// Escenario.tsx — EL ESCENARIO COMPARTIDO DEL VSL. Se escribe UNA vez y lo consumen TODOS los
// movimientos, que es lo único que garantiza que la unión ENTRE movimientos no se note
// (`video-pipeline/references/suites_premium.md` §7).
//
// ⛔ PEDIDO DEL CREADOR (sep-2026), y es el que manda sobre este archivo: *"siento que le falta
// dinamismo al video, que sea ultra inmersivo, con componentes profesionales, que parezca editado
// por After Effects, componentes con 6-9 capas, desenfoques, multiescenas, carruseles con tarjetas
// flotantes, 3D"*. Y sigue valiendo lo anterior: *"debe ser limpia, muy limpia"*. No se
// contradicen — limpio NO es plano. Lo que había antes era limpio y PLANO: tarjetas blancas
// sólidas, cero profundidad, cero parallax, cero 3D. Esto agrega las capas SIN agregar desorden.
//
// ── EL MODELO DE CAPAS (6-9 por plano, de atrás hacia adelante) ───────────────────────────────
//  L1  PLATE      el material real (clip o foto) a sangre
//  L2  GRADE      velo direccional que hunde el plate y lo tiñe
//  L3  PROFUNDIDAD la copia _blur.jpg del MISMO plate detrás de las piezas (⛔ NUNCA backdrop-filter)
//  L4  BOKEH      discos desenfocados MUY al fondo, con parallax propio
//  L5  MATERIA    las tarjetas de vidrio con FOTO/CLIP REAL adentro, en planos con translateZ
//  L6  LUZ        specular que sigue a la key + rim + sombra de contacto que aterriza
//  L7  TIPOGRAFÍA titular + kicker, con su propia profundidad
//  L8  ATMÓSFERA  polvo, barrido especular, halación
//  L9  LENTE      viñeta + aberración de borde + grano
//
// ⛔⛔ CONTRATO TÉCNICO (cada punto costó un render — `suites_premium.md` §6):
//  · CERO `Math.random`/`Date.now`: el farm rinde en 50 chunks paralelos y cada uno tiene que dar
//    EXACTAMENTE lo mismo. Todo es función pura de `useCurrentFrame()`.
//  · CERO `backdrop-filter`: multiplica ×5 el tiempo de render. El desenfoque de fondo sale de la
//    copia `_blur.jpg` que YA está en disco para cada foto (`preblur.mjs`), no de un filtro.
//  · CERO `filter: blur()` grande sobre imágenes a pantalla completa.
//  · `Easing.quint` NO EXISTE → `Easing.poly(5)`. `Easing.out(undefined)` compila y explota.
//  · Safe area 60 px, y en un plano con translateZ alto la perspectiva AGRANDA: anclar por
//    bottom/right y calcular el margen sobre el tamaño YA escalado.
import React from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import type { Theme } from "../VideoEdit/kit/premium/theme";
import {
  useKeyLight, tilt3d, slabShadow, specular, mblur, Bokeh, Dust, Sweep, LensVignette, Grain, Halation,
} from "../VideoEdit/kit/premium/stagecraft";

const { fontFamily: INTER } = loadInter();
export const FF = `${INTER}, "Segoe UI", system-ui, sans-serif`;

// ── PALETA ────────────────────────────────────────────────────────────────────────────────────
export const INK = "#14120F";
export const PAPER = "#FFFFFF";
export const SOFT = "#F5F2EC";
export const LINE = "#E4DFD5";
export const MUTE = "#79726A";
export const ACC = "#E0922C";   // ámbar de obra — el ÚNICO acento
export const GOOD = "#2E7D57";
export const BAD = "#C1442F";

/** El theme que consumen los helpers del kit premium (`slabShadow`, `Bokeh`, `Dust`…). Se declara
 *  ACÁ y no en el `theme.ts` compartido para no tocar los otros canales. */
export const VSL: Theme = {
  name: "vslcurso",
  mode: "dark",
  fontDisplay: FF,
  fontBody: FF,
  fontLabel: FF,
  color: {
    bg0: "#0C0B09", bg1: "#14120F", bg2: "#1E1B16",
    surface: "rgba(255,255,255,0.94)", surfaceStrong: PAPER,
    text: PAPER, textSoft: "rgba(255,255,255,0.78)", textDim: "rgba(255,255,255,0.46)",
    accent: ACC, accentSoft: "#F0B968", accent2: "#E8E4DC",
    gold: ACC, danger: BAD, good: GOOD,
    ink: INK, line: "rgba(255,255,255,0.16)",
    glow: "rgba(224,146,44,0.46)", shadow: "rgba(0,0,0,0.62)",
    onAccent: INK,
  },
  radius: 20,
  texture: "grain",
  rays: true,
  raysColor: "rgba(224,146,44,0.09)",
  upperLabels: true,
  labelSpacing: 4,
  strokeW: 5,
  displayWeight: 800,
};

// ── ALEATORIEDAD DETERMINISTA ─────────────────────────────────────────────────────────────────
/** hash entero. ⛔ NO `Math.sin(seed*12.9898)`: con seeds grandes —y el seed suele ser el frame de
 *  arranque— pierde precisión y los sorteos se CORRELACIONAN (medido en `pinluz`: racha de 11). */
export const rnd = (seed: number): number => {
  let h = Math.imul(Math.round(seed * 1000) ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// ── LA CÁMARA, CONTINUA EN TODO EL VIDEO ──────────────────────────────────────────────────────
/** ⛔⛔ LA REGLA QUE HACE QUE NO SE NOTE LA COSTURA: la cámara es función del frame GLOBAL del
 *  video, no del frame local del movimiento. Un `<Sequence>` rebasea `useCurrentFrame()` a 0, así
 *  que cada movimiento recibe su `desde` (frame absoluto de arranque) y lo suma. Resultado: el
 *  acto 3 hereda la posición, el zoom y la inercia que dejó el acto 2, y el movimiento 4 hereda
 *  los del movimiento 3. NINGÚN acto vuelve a 0.
 *
 *  El easing NO es constante: tres senos de período distinto (17,2 s / 23,7 s / 31,1 s) que nunca
 *  se repiten en los 277 s, así que la cámara no late con un ritmo reconocible. */
export const useCam = (desde: number) => {
  const f = useCurrentFrame() + desde;
  const z = 1 + 0.030 * Math.sin(f / 516) + 0.012 * Math.sin(f / 711 + 1.7);
  const panX = 1.9 * Math.sin(f / 933 + 0.4) + 0.7 * Math.sin(f / 389 + 2.1);
  const panY = 1.1 * Math.cos(f / 1042 + 1.1);
  const ry = 1.15 * Math.sin(f / 878 + 0.9);
  const rx = 0.55 * Math.cos(f / 1190 + 2.4);
  return { f, z, panX, panY, ry, rx,
    css: `perspective(2200px) scale(${z.toFixed(4)}) translate3d(${panX.toFixed(3)}%, ${panY.toFixed(3)}%, 0) rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)` };
};

/** El acto en curso dentro de un movimiento, más su progreso 0→1. Los actos se declaran en frames
 *  LOCALES; la cámara sigue siendo global. */
export const useActo = (cortes: number[]) => {
  const f = useCurrentFrame();
  let i = 0;
  for (let k = 0; k < cortes.length; k++) if (f >= cortes[k]) i = k;
  const a = cortes[i];
  const b = i + 1 < cortes.length ? cortes[i + 1] : a + 300;
  return { i, f, local: f - a, p: interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
};

/** entrada con spring + desenfoque de movimiento que se resuelve en ~4 frames (nada aparece
 *  nítido de una), y salida opcional. `sinSalida` para la pieza que llega al final del video:
 *  ⛔ el fade de salida ahí deja el CTA a medio transparente en el último cuadro. */
export const useEntra = (at = 0, opts?: { salida?: boolean; rise?: number }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 16 });
  const out = opts?.salida === false ? 1
    : interpolate(frame, [Math.max(1, durationInFrames - 9), durationInFrames], [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { s, a: s * out, y: (1 - s) * (opts?.rise ?? 26), blur: mblur(s, 6) };
};

// ══ L1 · PLATE — el material real a sangre, con su propio parallax ════════════════════════════
export const Plate: React.FC<{ src: string; desde: number; profundidad?: number }> = ({ src, desde, profundidad = 0 }) => {
  const cam = useCam(desde);
  const es = src.endsWith(".mp4");
  const k = 1 - profundidad * 0.45;        // el fondo se mueve MENOS que el frente
  const st: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${(1.06 * cam.z).toFixed(4)}) translate(${(cam.panX * k * 0.5).toFixed(3)}%, ${(cam.panY * k * 0.5).toFixed(3)}%)`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      {es
        ? <OffthreadVideo src={staticFile(src)} muted style={st} />
        : <Img src={staticFile(src)} style={st} />}
    </AbsoluteFill>
  );
};

// ══ L2+L3 · GRADE + PROFUNDIDAD ═══════════════════════════════════════════════════════════════
/** El velo que hunde el plate para que la tipografía blanca se lea, MÁS la copia desenfocada del
 *  mismo plate detrás de las piezas.
 *
 *  ⛔ El desenfoque NO es `backdrop-filter` (×5 el render) ni `filter: blur` a pantalla completa:
 *  es el hermano `_blur.jpg` que `preblur.mjs` ya dejó en disco para CADA foto. Coste 0.
 *  ⛔ Y este div NUNCA baja su `opacity`: lo que se anima es el alfa del color.
 *  ⚠️ Calibración medida: a 0,80 de alfa el b-roll DESAPARECE y cada gráfico queda sobre pantalla
 *  negra (el defecto que el creador vio como "horrenda"). 0,52-0,60 deja ver la materia detrás. */
export const Grade: React.FC<{ p: number; blurSrc?: string; fuerza?: number; lado?: "centro" | "derecha" | "izquierda" }> = ({
  p, blurSrc, fuerza = 1, lado = "centro",
}) => {
  const a = 0.56 * fuerza * p;
  const g = lado === "derecha"
    ? `linear-gradient(90deg, rgba(12,11,9,${(a * 1.25).toFixed(3)}) 0%, rgba(12,11,9,${(a * 0.95).toFixed(3)}) 52%, rgba(12,11,9,${(a * 0.55).toFixed(3)}) 100%)`
    : lado === "izquierda"
      ? `linear-gradient(270deg, rgba(12,11,9,${(a * 1.25).toFixed(3)}) 0%, rgba(12,11,9,${(a * 0.95).toFixed(3)}) 52%, rgba(12,11,9,${(a * 0.55).toFixed(3)}) 100%)`
      : `radial-gradient(130% 105% at 50% 46%, rgba(12,11,9,${(a * 0.82).toFixed(3)}) 0%, rgba(12,11,9,${(a * 1.18).toFixed(3)}) 100%)`;
  return (
    <>
      {/* ⛔⛔ ESTA CAPA IBA A 0,82 DE ALFA Y TAPABA EL PLATE. Lo cazó uno de los directores de
          movimiento rindiendo stills de verdad: el cobro quedaba "una mancha blanda" y el círculo
          de su costura, un disco beige plano. Es exactamente el defecto que el creador ya rechazó
          como look de stock trucho (`feedback_broll_fondo_desenfocado_look_stock`): el fondo
          desenfocado a pantalla completa se lee como banco de imágenes.
          Ahora: 0,32 de alfa y una MÁSCARA RADIAL, así el desenfoque sólo existe en el centro —
          donde apoya la tarjeta y hace falta para leer— y en los bordes sobrevive el b-roll
          NÍTIDO, que es lo que hace que el plano siga pareciendo material real. */}
      {blurSrc && (
        <AbsoluteFill style={{ opacity: 0.32 * p, overflow: "hidden" }}>
          <Img
            src={staticFile(blurSrc)}
            style={{
              width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.14)",
              maskImage: "radial-gradient(115% 100% at 50% 48%, #000 0%, #000 44%, transparent 82%)",
              WebkitMaskImage: "radial-gradient(115% 100% at 50% 48%, #000 0%, #000 44%, transparent 82%)",
            }}
          />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: g }} />
    </>
  );
};

// ══ L4+L8+L9 · ATMÓSFERA Y LENTE — se montan UNA vez por movimiento y no se remontan ══════════
/** ⛔ Va DENTRO del movimiento, montada una sola vez para los 4-6 actos. Si cada acto monta su
 *  propia atmósfera, en la frontera hay un *reset* de fondo y se lee "empezó algo". */
export const Atmos: React.FC<{ desde: number; polvo?: number; bokeh?: number }> = ({ desde, polvo = 1, bokeh = 1 }) => (
  <>
    {bokeh > 0 && <Bokeh theme={VSL} count={Math.round(8 * bokeh)} opacity={0.4 * bokeh} seed={desde} />}
    {polvo > 0 && <Dust theme={VSL} count={Math.round(26 * polvo)} opacity={0.16 * polvo} />}
    <Halation theme={VSL} x={62} y={18} size={120} />
    <Sweep theme={VSL} at={10} dur={64} angle={16} />
    <LensVignette theme={VSL} strength={1.05} />
    <Grain theme={VSL} amount={0.055} />
  </>
);

// ══ L5+L6 · LA TARJETA DE MATERIA ═════════════════════════════════════════════════════════════
/** ⛔⛔ REGLA DURA (`suites_premium.md`): *"toda tarjeta flotante lleva MATERIAL REAL adentro. Una
 *  tarjeta que es sólo una forma con texto es código en pantalla y se nota."* Así que `src` es
 *  OBLIGATORIO y acepta foto o clip.
 *
 *  Capas de la tarjeta: sombra de objeto sólido con canto (`slabShadow`) · el material dentro de
 *  un marco con recorte · rim-light en el borde superior · specular que sigue a la key de escena ·
 *  sombra de contacto que ATERRIZA en el suelo · inclinación 3D propia por semilla (`tilt3d`).
 *
 *  ⚠️ `z` es el plano de profundidad: la perspectiva AGRANDA lo que tiene translateZ alto, así que
 *  las tarjetas de primer plano van ancladas y con margen calculado sobre el tamaño ya escalado. */
export const Tarjeta: React.FC<{
  src: string;
  w: number; h: number;
  rotulo?: string; sub?: string;
  seed?: number; z?: number; at?: number;
  marca?: "ok" | "no";
  estilo?: React.CSSProperties;
  /** altura del cajetín de texto; 0 = tarjeta de puro material */
  texto?: boolean;
}> = ({ src, w, h, rotulo, sub, seed = 0, z = 0, at = 0, marca, estilo, texto = true }) => {
  const frame = useCurrentFrame();
  const luz = useKeyLight("center");
  const e = useEntra(at, { rise: 34 });
  const es = src.endsWith(".mp4");
  const conTexto = texto && (rotulo || sub);
  const hMedia = conTexto ? h - (sub ? 116 : 86) : h;
  return (
    <div
      style={{
        position: "relative", width: w, height: h, borderRadius: VSL.radius + 2,
        background: PAPER,
        boxShadow: slabShadow(luz, { lift: 1.25 + z / 90, edge: "rgba(20,18,15,0.5)", tint: "rgba(0,0,0,0.5)" }),
        transform: `${tilt3d({ amount: 0.34, seed, frame, z })} translateY(${e.y.toFixed(1)}px) scale(${(0.94 + 0.06 * e.s).toFixed(3)})`,
        opacity: e.a, filter: e.blur, overflow: "hidden",
        ...estilo,
      }}
    >
      {/* L5 · el MATERIAL REAL adentro */}
      <div style={{ position: "relative", width: "100%", height: hMedia, overflow: "hidden", background: SOFT }}>
        {es
          ? <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        {/* L6 · specular sobre el material, siguiendo la key de la escena */}
        <div style={{ position: "absolute", inset: 0, background: specular(luz, 0.5), mixBlendMode: "screen", opacity: 0.55 }} />
        {/* rim superior: el canto del vidrio */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(255,255,255,0.6)" }} />
        {marca && (
          <div
            style={{
              position: "absolute", top: 18, left: 18, width: 52, height: 52, borderRadius: 26,
              background: marca === "ok" ? GOOD : BAD, color: PAPER,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FF, fontSize: 31, fontWeight: 800,
              boxShadow: "0 10px 26px rgba(0,0,0,.45)",
            }}
          >
            {marca === "ok" ? "✓" : "✕"}
          </div>
        )}
      </div>
      {conTexto && (
        <div style={{ padding: "18px 26px 22px" }}>
          {rotulo && <div style={{ fontFamily: FF, fontSize: 38, fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1.12 }}>{rotulo}</div>}
          {sub && <div style={{ fontFamily: FF, fontSize: 25, fontWeight: 500, color: MUTE, marginTop: 8, lineHeight: 1.3 }}>{sub}</div>}
        </div>
      )}
    </div>
  );
};

/** Sombra de CONTACTO: la elipse que aterriza en el suelo debajo de una tarjeta. Es la capa que
 *  convence al ojo de que el objeto está APOYADO y no pegado con photoshop. */
export const Contacto: React.FC<{ w: number; y: number; x?: number; op?: number }> = ({ w, y, x = 0, op = 0.5 }) => {
  const luz = useKeyLight("center");
  return (
    <div
      style={{
        position: "absolute", left: `calc(50% + ${x + luz.sx * 10}px)`, top: y,
        width: w * 0.92, height: 26, marginLeft: -(w * 0.92) / 2, borderRadius: "50%",
        background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${op}) 0%, rgba(0,0,0,0) 72%)`,
        filter: "blur(9px)", pointerEvents: "none",
      }}
    />
  );
};

// ══ CARRUSEL 3D DE TARJETAS FLOTANTES ═════════════════════════════════════════════════════════
/** Pedido explícito del creador: *"carruseles con tarjetas flotantes, 3D"*.
 *  El abanico gira en Y y cada carta tiene su propio desfase: **la delantera se mueve MÁS que la
 *  trasera** (regla de `suites_premium.md`), que es lo que da el parallax. `foco` (0..n-1, puede
 *  ser fraccionario) dice qué carta está adelante; el build lo anima al ms de la palabra.
 *  ⛔ Acá sí va `preserve-3d`: no hay ningún `backdrop-filter` en el kit, así que no hay vidrio
 *  que romper, y es lo único que hace que las cartas compartan el MISMO espacio 3D. */
export const Carrusel: React.FC<{
  cartas: { src: string; rotulo?: string; sub?: string }[];
  foco: number;
  w?: number; h?: number; radio?: number;
}> = ({ cartas, foco, w = 470, h = 560, radio = 620 }) => {
  const frame = useCurrentFrame();
  const luz = useKeyLight("center");
  const paso = 360 / Math.max(6, cartas.length * 2.1);
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2000, perspectiveOrigin: "50% 46%" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d", transform: `translate(-50%,-50%) rotateY(${(-foco * paso).toFixed(3)}deg)` }}>
        {cartas.map((c, i) => {
          const ang = i * paso;
          const d = Math.abs(i - foco);
          const adelante = Math.max(0, 1 - d);                    // 1 = es la carta en foco
          const flota = Math.sin(frame / (58 + i * 9) + i * 1.7) * (5 + 7 * adelante);
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h,
                transformStyle: "preserve-3d",
                transform: `rotateY(${ang.toFixed(3)}deg) translateZ(${radio}px) translateY(${flota.toFixed(2)}px) scale(${(0.86 + 0.14 * adelante).toFixed(3)})`,
                opacity: 0.42 + 0.58 * adelante,
                filter: adelante > 0.88 ? undefined : `blur(${((1 - adelante) * 3.1).toFixed(2)}px)`,
              }}
            >
              <Tarjeta src={c.src} w={w} h={h} rotulo={c.rotulo} sub={c.sub} seed={i * 7 + 3} z={0} at={0} />
              <div
                style={{
                  position: "absolute", left: 0, right: 0, bottom: -30, height: 24,
                  background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${(0.5 * adelante + 0.12).toFixed(2)}) 0%, rgba(0,0,0,0) 70%)`,
                  filter: "blur(8px)", transform: `translateX(${(luz.sx * 8).toFixed(1)}px)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ══ COSTURAS ══════════════════════════════════════════════════════════════════════════════════
/** OCLUSIÓN — un objeto grande cruza y tapa el 100 % durante 3-6 frames.
 *  ⛔⛔ EL COLOR ES EL DE LA MATERIA QUE CRUZA, NUNCA EL DEL FONDO (medido en `mdbleach`: con el
 *  color del fondo no ocluye, hace un FUNDIDO A NEGRO y se ve un flash). Acá la materia por
 *  defecto es el papel de los documentos del curso. */
export const Occluder: React.FC<{ at: number; dur?: number; material?: string; angulo?: number }> = ({
  at, dur = 16, material = SOFT, angulo = -7,
}) => {
  const f = useCurrentFrame();
  if (f < at - 2 || f > at + dur + 3) return null;
  // GEOMETRÍA MEDIDA (la primera versión NO OCLUÍA y hay que dejarlo escrito):
  // banda de 180% con la parte sólida del 14% al 86% = 129,6% de ancho sólido, viajando 320% y
  // rotada -12° (que se come ~26% en las esquinas) → el 100% del cuadro quedaba cubierto
  // ~0,5-1,3 frames. El swap se veía. Lo cazaron DOS de los directores de movimiento midiéndolo.
  // Ahora: sólido = 320%·0,88 = 281,6% · la rotación de -7° sobre 260% de alto se come ~36% ·
  // ventana de cobertura total = 281,6 − 100 − 36 = 145,6% sobre un viaje de 460%
  // → 31,6% de `dur`, o sea 5,0 frames con dur=16. El swap entra cómodo en el medio.
  const x = interpolate(f, [at, at + dur], [-340, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: "-80%", left: `${x}%`, width: "320%", height: "260%",
          transform: `rotate(${angulo}deg)`,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${material} 6%, ${material} 94%, rgba(0,0,0,0) 100%)`,
          boxShadow: "0 0 140px rgba(0,0,0,0.55)",
        }}
      />
    </AbsoluteFill>
  );
};

/** WIPE POR MATERIA — partículas cruzan y detrás ya está lo nuevo. */
export const WipeMateria: React.FC<{ at: number; dur?: number; color?: string }> = ({ at, dur = 20, color = "rgba(245,242,236,0.9)" }) => {
  const f = useCurrentFrame();
  if (f < at - 2 || f > at + dur + 4) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 26 }, (_, i) => {
        const r = rnd(i * 3.1 + at);
        const r2 = rnd(i * 7.7 + at + 1);
        const s = 10 + r * 46;
        const x = -20 + p * 150 + r2 * 40;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${(r2 * 100).toFixed(1)}%`,
            width: s, height: s, borderRadius: "50%", background: color,
            filter: `blur(${(6 + r * 12).toFixed(1)}px)`,
            opacity: Math.sin(p * Math.PI) * (0.2 + r * 0.5),
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ══ L7 · TIPOGRAFÍA ═══════════════════════════════════════════════════════════════════════════
export const SOMBRA_TEXTO = "0 3px 10px rgba(0,0,0,.6), 0 7px 38px rgba(0,0,0,.78)";

export const Kicker: React.FC<{ children: React.ReactNode; at?: number; color?: string }> = ({ children, at = 0, color = ACC }) => {
  const e = useEntra(at, { rise: 14 });
  return (
    <div style={{
      fontFamily: FF, fontSize: 25, fontWeight: 800, letterSpacing: "0.17em", textTransform: "uppercase",
      color, opacity: e.a, transform: `translateY(${e.y.toFixed(1)}px)`, textShadow: SOMBRA_TEXTO,
    }}>{children}</div>
  );
};

export const Titular: React.FC<{ children: React.ReactNode; at?: number; size?: number; z?: number }> = ({
  children, at = 0, size = 64, z = 40,
}) => {
  const frame = useCurrentFrame();
  const e = useEntra(at, { rise: 22 });
  return (
    <div style={{
      fontFamily: FF, fontSize: size, fontWeight: 700, color: PAPER, letterSpacing: "-0.028em",
      lineHeight: 1.1, textShadow: SOMBRA_TEXTO, opacity: e.a, filter: e.blur,
      transform: `${tilt3d({ amount: 0.18, seed: at, frame, z })} translateY(${e.y.toFixed(1)}px)`,
    }}>{children}</div>
  );
};

/** cifra grande con odómetro. `hasta` se alcanza en ~24 frames desde `at`. */
export const Cifra: React.FC<{ hasta: number; at?: number; sufijo?: string; size?: number }> = ({
  hasta, at = 0, sufijo, size = 210,
}) => {
  const frame = useCurrentFrame();
  const e = useEntra(at, { rise: 18 });
  const k = interpolate(frame, [at + 4, at + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{
      fontFamily: FF, fontSize: size, fontWeight: 800, lineHeight: 0.94, letterSpacing: "-0.045em",
      color: PAPER, textShadow: "0 4px 14px rgba(0,0,0,.6), 0 10px 50px rgba(0,0,0,.8)",
      fontVariantNumeric: "tabular-nums", opacity: e.a, filter: e.blur,
      transform: `${tilt3d({ amount: 0.22, seed: at + 5, frame, z: 60 })} translateY(${e.y.toFixed(1)}px)`,
    }}>
      {Math.round(hasta * k).toLocaleString("es-MX")}
      {sufijo && <span style={{ fontSize: size * 0.33, fontWeight: 700, marginLeft: 14, color: ACC }}>{sufijo}</span>}
    </div>
  );
};

/** el chip de acento del remate (última línea de una frase cinética) */
export const Chip: React.FC<{ children: React.ReactNode; at?: number; size?: number }> = ({ children, at = 0, size = 92 }) => {
  const e = useEntra(at, { rise: 20 });
  const luz = useKeyLight("center");
  return (
    <span style={{
      display: "inline-block", fontFamily: FF, fontSize: size, fontWeight: 800, letterSpacing: "-0.025em",
      color: INK, background: ACC, padding: "10px 30px 16px", borderRadius: 14,
      boxShadow: slabShadow(luz, { lift: 1.1, edge: "rgba(120,74,18,0.6)", tint: "rgba(0,0,0,0.5)" }),
      opacity: e.a, filter: e.blur, transform: `translateY(${e.y.toFixed(1)}px)`,
    }}>{children}</span>
  );
};

// ── el marco seguro: 60 px de margen mínimo, y las piezas de primer plano ancladas ────────────
export const SAFE = 96;
