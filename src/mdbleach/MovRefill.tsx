// ════════════════════════════════════════════════════════════════════════════════════════════
//  MovRefill.tsx — MOVIMIENTO 5 · "EL REFILL" · ~1500 frames (50 s) @30fps
//  Canal Mike Dalton (EN) · video `mdbleach` · escenario compartido `./Stage`.
//
//  ESTE ES EL PAGO DEL OPEN LOOP. En el minuto 1 Mike prometió que hay una pieza que le devuelve
//  el moho EN HORARIO y que nadie tocó nunca. Acá se abre el tanque y se paga. Por eso el
//  movimiento no es un diagrama: es un DESCENSO. La cámara entra al tanque y NO SALE hasta el
//  final; el video no vuelve a subir hasta MovClose.
//
//  UN SOLO PLANO SECUENCIA. Una atmósfera montada UNA vez (`<Atmos/>`), UNA cámara
//  `stageCam(p, 5)` que ningún acto reinicia (los actos ponen offsets ENCIMA), la luz
//  `movLight(5, p)` — que en este tramo es FRÍA de punta a punta, así que lo que EVOLUCIONA es
//  la DIRECCIÓN de la fuente (la bombita viaja de arriba-izquierda 0.20 a arriba-derecha 0.88,
//  porque estamos girando y bajando dentro del tanque) y su DUREZA (intensidad 1.02 → 0.66, con
//  un pico duro en el acto del dedo negro: es el único momento con key contrastada del tramo).
//
//  ════════════════════════════════════════════════════════════════════════════════════════════
//  LA CADENA DE MATERIA — un solo objeto cruza cada frontera y se transforma en el siguiente:
//        LA TAPA  →  EL ANILLO (la boca del rebalse)  →  EL AGUA  →  EL DEDO  →  LA PELÍCULA
//  ════════════════════════════════════════════════════════════════════════════════════════════
//
//  ════════════════════════════════════════════════════════════════════════════════════════════
//                                T A B L A   D E   H A N D O F F
//  (frames nominales para durationInFrames = 1500; TODO se calcula como FRACCIÓN de la duración)
//  ════════════════════════════════════════════════════════════════════════════════════════════
//
//  ACTO 1 · 0.000–0.150 (f0–225) · "LA TAPA" — protagonista: el mazo de la tapa
//    enterFrom  cam  stageCam p=0 → CAM_ARC[5].from {z .18, panX −34, panY −12, ry −5, rz −.3}
//                    + offset propio {z −210, x +60, y −30, ry +3.4, rx −2.6}
//                    ⇐ MovTruck me deja lejos, alto y frío, con la mano apagando un ventilador.
//               luz  FRÍA, key 0.20 (arriba-izquierda, la bombita del baño), intensidad 1.02
//               materia  ninguna todavía: el cuarto y la cama borrosa del interior del tanque
//    exitTo     cam  offset {z +30, y +14, ry −1.2} — el mazo colapsa y la cámara ya viene empujando
//               luz  FRÍA, key 0.30
//               materia  LA TAPA: la carta de la tapa (h47) y la de la tapa en la toalla (h48)
//    ── FRONTERA A @ f2−16 (f209) ······ OCLUSIÓN ─────────────────────────────────────────────
//       La tapa de porcelana pasa PEGADA al lente: `Occluder` en porcelana en sombra (#2C2E2B)
//       + un filo especular propio que la sella como objeto. Tapa el 100% ~7 frames; el cambio
//       de acto ocurre ahí adentro. Es OCLUSIÓN porque el cambio de tema es fuerte (de la tapa
//       al interior del tanque) y porque el objeto que tapa ES la materia del acto anterior.
//
//  ACTO 2 · 0.150–0.335 (f225–503) · "EL MAPA DEL TANQUE" — protagonista: el pipe de rebalse
//    enterFrom  cam  offset {z +30 → +90, y +14 → +30, ry −1.2 → −2.6}
//               luz  FRÍA, key 0.30 → 0.44, intensidad 0.98 → 0.90
//               materia  la tapa sigue en cuadro: h48 aparcada abajo-izquierda en un `GlassPlate`
//    exitTo     cam  offset {z +190, y +10, rx +3.2} — el cenital se desenfoca (rack a la lupa)
//               luz  FRÍA, key 0.44
//               materia  EL ANILLO: la lupa circular aterrizada sobre la boca del rebalse
//    ── FRONTERA B @ f3−30 → f3+26 (f473–529) ······ MATCH-SHAPE ─────────────────────────────
//       El anillo (la lupa de 260 px sobre la boca) se DESPLIEGA en la placa ancha de 1300×720
//       del acto 3. El material de adentro NUNCA se remonta: es el mismo clip h50 corriendo
//       durante toda la transformación — por eso se lee como transformación y no como reemplazo.
//       (No es la misma costura que A y prepara la C, que necesita un agujero grande en cuadro.)
//
//  ACTO 3 · 0.335–0.520 (f503–780) · "EL TRABAJO DEL TUBITO" — protagonista: el tubo flexible
//    enterFrom  cam  offset {z +190 → +300, ry +0.6, rx +4.2} — empuje hacia la boca
//               luz  FRÍA, key 0.44 → 0.60, intensidad 0.90 → 0.78
//               materia  EL ANILLO ya desplegado en placa + el agua que empieza a correr
//    exitTo     cam  offset {z +300} + `ZoomThrough` ×8 hacia [56%, 64%] (la boca del rebalse)
//               luz  FRÍA, key 0.60
//               materia  EL AGUA: la columna de gotas que baja por el pipe
//    ── FRONTERA C @ f4−20 (f760) ······ ZOOM-THROUGH ────────────────────────────────────────
//       LA COSTURA DEL VIDEO, una sola vez y bien: la cámara se mete POR LA BOCA del rebalse,
//       siguiendo al agua que acaba de caer ahí. Sale del otro lado ADENTRO. El acto 4 ya está
//       montado debajo, sobreescalado 1.55, y "emerge" desacelerando: no hay corte, hay tránsito.
//
//  ACTO 4 · 0.520–0.655 (f780–983) · "METÉ EL DEDO" — protagonista: el índice entrando
//    enterFrom  cam  offset {z +150 → +210, ry +1.8 → −0.8} + settle propio del acto 1.55 → 1.00
//               luz  FRÍA, key 0.60 → 0.74, intensidad 0.78 → 0.90
//               materia  EL AGUA: las mismas gotas siguen cayendo los primeros 46 frames
//    exitTo     cam  offset {z +210}
//               luz  FRÍA, key 0.74
//               materia  EL DEDO (y el ARCO DE ESPERA, que nace acá y vuelve en el acto 6)
//    ── FRONTERA D @ f5 (f983) ······ CORTE EN EL BEAT ───────────────────────────────────────
//       Corte seco en "slimy". Calza porque las dos mitades son MACRO del MISMO dedo, con la
//       misma escala de encuadre, la misma viñeta y la misma key: sólo cambia lo que hay en la
//       yema. Y hay un elemento que NO cambia en el corte: el arco de espera, clavado en la
//       misma posición de pantalla, que sigue barriendo. Eso lo cose.
//
//  ACTO 5 · 0.655–0.815 (f983–1223) · "EL DEDO NEGRO" — protagonista: la película viscosa
//    enterFrom  cam  offset {z +210 → +260, rx +0.4} — macro extremo
//               luz  FRÍA pero DURA: key 0.74 → 0.88, intensidad 0.90 (pico) + key local dura
//               materia  EL DEDO levantado
//    exitTo     cam  offset {z +260 → +120}
//               luz  intensidad cayendo a 0.72
//               materia  LA PELÍCULA: la baba negra de la yema
//    ── FRONTERA E @ f6−22 (f1201) ······ WIPE POR MATERIA ───────────────────────────────────
//       El trapo BLANCO real (clip h53) cruza el cuadro como una banda de 190% y detrás ya está
//       el acto 6. No es un `VaporWipe` genérico: la materia que barre es MATERIAL REAL rodado.
//       Y el mismo trapo se queda aparcado arriba-izquierda en el acto 6 (clip h54), limpiando
//       la pared del tanque dentro de su ventanita: la materia no desaparece, sigue trabajando.
//
//  ACTO 6 · 0.815–1.000 (f1223–1500) · "EL RELOJ" — protagonista: la mancha de la taza
//    enterFrom  cam  offset {z +120 → +60}
//               luz  FRÍA, key 0.88, intensidad 0.72 → 0.66
//               materia  LA PELÍCULA, ahora abajo, en la taza (h46) + el trapo aparcado
//    exitTo     cam  stageCam p=1 → CAM_ARC[5].to {z .78, panX +12, panY +54, ry +2, rz +.2}
//                    ⇒ el punto más CERCA y más ABAJO de todo el video. Desde acá MovClose sale
//                    hacia atrás. ⛔ El último frame NO pisa `stageCam`: el offset propio muere
//                    en {z +20, x 0, y 0, ry 0, rx +0.3} y deja la cámara del video limpia.
//               luz  FRÍA baja
//               materia  el ciclo sigue: el arco queda A MITAD DE VUELTA en el último frame.
//    EL BUCLE SIN CARTEL: un arco barre 84 frames y VUELVE A EMPEZAR. Cada vuelta completa suelta
//    una descarga de gotas sobre la mancha, la mancha se pone un punto más oscura y se suma una
//    marca a la fila de abajo. En 277 frames pasa 3,3 veces — y termina a mitad de la cuarta.
//    Nadie escribe "es un bucle": se ve el reloj dando otra vuelta cuando el movimiento termina.
//
//  ════════════════════════════════════════════════════════════════════════════════════════════
//  ⛔ CONTRATO: cero Math.random/Date · cero backdrop-filter · cero filter:blur a pantalla
//  completa (los fondos borrosos son los `_blur.jpg` YA horneados) · cero fade a negro · cero
//  opacity 0→1 sobre el cuadro entero · `Easing.poly(5)`, nunca `Easing.quint` · rutas relativas.
//
//  ⚠️ NOTA TÉCNICA (por qué hay un `Reel` local en vez de usar `Material` para todo): los clips
//  de este video duran 121 frames a 24 fps = 5,04 s. Varias placas de este movimiento viven
//  8–12 s en pantalla. `Material`/`GlassPlate` del Stage no exponen `playbackRate`, así que un
//  clip se quedaría CONGELADO en su último frame (= "quieto > 1,5 s", prohibido). `Reel` calcula
//  el `playbackRate` para que el clip cubra EXACTAMENTE su vida en pantalla. Donde la placa vive
//  ≤ 150 frames uso `GlassPlate` del Stage tal cual (las dos placas aparcadas).
//
//  ⚠️ h49 (el cenital del tanque) va en FOTO, no en clip, por decisión del auditor de movimiento:
//  el i2v le reataba la cadena en otro punto y le movía el flapper entre frames (severidad 9, dos
//  regeneraciones). La foto está auditada y aprobada. Vive en el acto 1 (una carta del mazo) y en
//  el acto 2 (el fondo entero, 9 s): en el acto 1 la mueve `Material` con su deriva propia, y en
//  el acto 2 le pongo un Ken-Burns RELATIVO AL ACTO, porque la deriva interna de `Material` se
//  mide sobre el frame GLOBAL (`frame/240`) y a esa altura ya llega saturada = foto clavada.
// ════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, staticFile, interpolate, useCurrentFrame, Easing,
} from "remotion";
import {
  MD, F_SANS, F_SERIF, rgba, lerp, clamp01, rnd, glassStyle, Sheen,
  Kicker, Title, TextBed, Occluder, Atmos, Motes, Space3D, Material, GlassPlate, ZoomThrough,
  stageCam, movLight,
} from "./Stage";

/* ══════════════════════════════════════════════════════════════════════════════════════════
   MATERIAL REAL — rutas hardcodeadas (el build tiene que sumarlas al tarball o el farm 404ea)
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const V = {
  liftlid: "broll/mdbleach_h47_liftlid.mp4",
  lidontowel: "broll/mdbleach_h48_lidontowel.mp4",
  pointtube: "broll/mdbleach_h50_pointtube.mp4",
  fingerinside: "broll/mdbleach_h51_fingerinside.mp4",
  blackfinger: "broll/mdbleach_h52_blackfinger.mp4",
  wipetube: "broll/mdbleach_h53_wipetube.mp4",
  wipetankwall: "broll/mdbleach_h54_wipetankwall.mp4",
  patchymold: "broll/mdbleach_h46_patchymold.mp4",
};
const P = {
  // ⛔ h49 NO va en clip: el auditor de MOVIMIENTO rechazó el clip h49_tankinside
  // dos veces con severidad 9 ("the chain reattaches at a different point, the stopper moves").
  // Es una escena sin acción real, así que el i2v se inventa estructura. Va la FOTO auditada.
  tankinside: "img/mdbleach_h49_tankinside.jpg",
  lamTankmap: "img/mdbleach_lam_tankmap.jpg",
  bedTank: "img/mdbleach_h49_tankinside_blur.jpg",
  bedTube: "img/mdbleach_h50_pointtube_blur.jpg",
  bedFinger: "img/mdbleach_h52_blackfinger_blur.jpg",
  bedPour: "img/mdbleach_h15_tankpour_blur.jpg",
};

/* ── easings (⛔ Easing.quint no existe → poly(5)) ────────────────────────────────────────── */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.14, 0.86, 0.22, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  drop: Easing.bezier(0.72, 0.0, 0.62, 1),
  land: Easing.poly(5),
  lin: (t: number) => t,
};

/** rampa multi-key con easing POR SEGMENTO — el easing NUNCA es constante en toda la pieza */
const keyed = (
  f: number, ks: number[], vs: number[],
  e: ((t: number) => number) | ((t: number) => number)[] = EZ.glide,
): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / Math.max(1, ks[i + 1] - ks[i]));
  const ef = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/** guarda de monotonía: si un ancla queda antes que la anterior, `keyed` devolvería basura */
const mono = (ks: number[]) => {
  const out = ks.slice();
  for (let i = 1; i < out.length; i++) if (out[i] <= out[i - 1]) out[i] = out[i - 1] + 1;
  return out;
};

/** bezier cuadrática — el recorrido del agua del tubito a la boca del rebalse */
const qb = (p0: number, p1: number, p2: number, t: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

/* ══════════════════════════════════════════════════════════════════════════════════════════
   PRIMITIVAS DE MATERIAL
   ══════════════════════════════════════════════════════════════════════════════════════════ */

const CLIP_LEN_30 = 151; // 121 frames @24fps ≈ 5,04 s ≈ 151 frames a 30 fps

/** CLIP real que dura EXACTAMENTE lo que vive en pantalla (nunca se congela). */
const Reel: React.FC<{
  src: string; life: number; pos?: string; sc?: number; rate?: number;
}> = ({ src, life, pos = "50% 46%", sc = 1.06, rate }) => {
  const r = rate ?? Math.min(1, CLIP_LEN_30 / Math.max(1, life));
  return (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      playbackRate={Math.max(0.34, Math.min(1.6, r))}
      style={{
        width: "100%", height: "100%", objectFit: "cover",
        objectPosition: pos, transform: `scale(${sc.toFixed(4)})`,
      }}
    />
  );
};

/** FOTO real con deriva lentísima (los `_blur.jpg` ya vienen horneados: ⛔ nunca filter:blur). */
const Still: React.FC<{
  src: string; f: number; pos?: string; sc?: number; drift?: number; bright?: number; sat?: number;
}> = ({ src, f, pos = "50% 46%", sc = 1.08, drift = 0.09, bright = 1, sat = 1 }) => (
  <Img
    src={staticFile(src)}
    style={{
      width: "100%", height: "100%", objectFit: "cover", objectPosition: pos,
      transform: `scale(${(sc + drift * clamp01(f / 900)).toFixed(4)})`,
      filter: bright !== 1 || sat !== 1 ? `brightness(${bright}) saturate(${sat})` : undefined,
    }}
  />
);

/** El grade del canal encima de cualquier material real (negro + un punto de rojo + viñeta). */
const Grade: React.FC<{ d?: number; red?: number; vig?: number }> = ({ d = 0.1, red = 0.045, vig = 0.42 }) => (
  <>
    <AbsoluteFill style={{ background: rgba(MD.red, red), mixBlendMode: "soft-light" }} />
    <AbsoluteFill style={{ background: `rgba(0,0,0,${d})` }} />
    <AbsoluteFill style={{ background: `radial-gradient(84% 72% at 50% 44%, rgba(0,0,0,0) 42%, rgba(0,0,0,${vig}) 100%)` }} />
  </>
);

/**
 * TARJETA FLOTANTE premium. Mismo vidrio que el Stage (`glassStyle`), sombra de contacto que
 * ATERRIZA, bisel interno, rim de producto arriba y barrido especular. Adentro va SIEMPRE
 * material real (`children` = `Reel` o `Still`). ⛔ No existe la tarjeta vacía.
 */
const Card: React.FC<{
  w: number; h: number; x?: number; y?: number; z?: number;
  rx?: number; ry?: number; rz?: number; radius?: number; lit?: number; op?: number;
  sheenAt?: number; caption?: string; tag?: string; hot?: number;
  children: React.ReactNode; overlay?: React.ReactNode;
}> = ({
  w, h, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, radius = 18, lit = 1, op = 1,
  sheenAt, caption, tag, hot = 0, children, overlay,
}) => {
  if (op <= 0.004) return null;
  const lift = 1 + Math.max(0, z) / 900;
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%", width: w, height: h, opacity: op,
        transform:
          `translate(-50%,-50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) ` +
          `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* SOMBRA DE CONTACTO — la tarjeta aterriza, no flota en el vacío (gradiente, ⛔ sin blur) */}
      <div
        style={{
          position: "absolute", left: "4%", right: "4%", bottom: -20 * lift, height: 34 * lift,
          background: `radial-gradient(58% 100% at 50% 0%, rgba(0,0,0,${(0.62 / lift).toFixed(3)}) 0%, rgba(0,0,0,0) 74%)`,
        }}
      />
      <div
        style={{
          position: "absolute", inset: 0, boxSizing: "border-box", padding: Math.min(12, w * 0.022),
          ...glassStyle({ radius, lit }),
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "relative", width: "100%", height: "100%", overflow: "hidden",
            borderRadius: Math.max(2, radius - 7), backgroundColor: MD.ink0,
            boxShadow: `inset 0 0 0 1px ${rgba(MD.white, 0.14)}, inset 0 18px 46px rgba(0,0,0,0.5)`,
          }}
        >
          {children}
          {/* rim de producto arriba */}
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              background:
                `linear-gradient(184deg, ${rgba(MD.white, 0.15 * lit)} 0%, rgba(255,255,255,0) 24%), ` +
                `radial-gradient(120% 84% at 10% 0%, ${rgba(MD.cold, 0.1 * lit)} 0%, rgba(0,0,0,0) 58%)`,
            }}
          />
          {hot > 0.01 && (
            <AbsoluteFill
              style={{
                boxShadow: `inset 0 0 0 2px ${rgba(MD.red, 0.7 * hot)}, inset 0 0 70px ${rgba(MD.redHot, 0.3 * hot)}`,
              }}
            />
          )}
          {overlay}
          {sheenAt !== undefined && <Sheen at={sheenAt} dur={30} angle={16} />}
          {tag && (
            <div
              style={{
                position: "absolute", left: 16, top: 16, padding: "7px 13px", borderRadius: 4,
                background: rgba(MD.red, 0.94), fontFamily: F_SANS, fontWeight: 800,
                fontSize: 22, letterSpacing: 2.2, color: MD.white, textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
          )}
          {caption && (
            <div
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 20px 16px",
                background: "linear-gradient(180deg, rgba(6,6,8,0) 0%, rgba(6,6,8,0.9) 56%)",
                fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 1.6,
                color: rgba(MD.white, 0.95), textTransform: "uppercase",
              }}
            >
              {caption}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** Plano con parallax propio: cada capa tiene su Z y su factor de deriva. Mínimo 5-6 por acto. */
const Plane: React.FC<{
  f: number; pz: number; px?: number; op?: number; sc?: number; children: React.ReactNode;
}> = ({ f, pz, px = 1, op = 1, sc = 1, children }) => (
  <AbsoluteFill
    style={{
      opacity: op, transformStyle: "preserve-3d",
      transform:
        `translateZ(${pz}px) scale(${sc}) ` +
        `translate3d(${(Math.sin(f / 53) * 4 * px).toFixed(2)}px, ${(Math.cos(f / 79) * 3 * px).toFixed(2)}px, 0)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** KEY LOCAL — la fuente dura de cada acto. La atmósfera es una; esto es el foco de la escena. */
const KeyLight: React.FC<{ x: number; y: number; r: number; power: number; tint: string }> = ({
  x, y, r, power, tint,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none", mixBlendMode: "screen",
      background: `radial-gradient(${r}% ${r * 0.78}% at ${x}% ${y}%, ${rgba(tint, 0.24 * power)} 0%, ${rgba(tint, 0.07 * power)} 38%, rgba(0,0,0,0) 70%)`,
    }}
  />
);

/* ══════════════════════════════════════════════════════════════════════════════════════════
   TIPOGRAFÍA — 1 idea por acto, titular ≤7 palabras, revelado en BLOQUES SEMÁNTICOS
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Wds: React.FC<{
  text: string; f: number; at: number; size: number; step?: number; serif?: boolean; color?: string;
}> = ({ text, f, at, size, step = 4, serif = false, color = MD.white }) => (
  <>
    {text.split(" ").map((w, i) => {
      const p = clamp01((f - (at + i * step)) / 12);
      const e = EZ.snap(p);
      return (
        <span
          key={i}
          style={{
            display: "inline-block", marginRight: size * 0.24, opacity: p,
            transform: `translateY(${((1 - e) * size * 0.4).toFixed(2)}px) scale(${(0.94 + e * 0.06).toFixed(3)})`,
            fontFamily: serif ? F_SERIF : F_SANS,
            fontStyle: serif ? "italic" : "normal",
            fontWeight: serif ? 500 : 800,
            color: serif ? MD.redHot : color,
          }}
        >
          {w}
        </span>
      );
    })}
  </>
);

const Beat: React.FC<{
  f: number; at: number; kicker: string; head: string; em?: string;
  size?: number; w?: number; kColor?: string;
}> = ({ f, at, kicker, head, em, size = 60, w = 780, kColor = MD.red }) => {
  const k = clamp01((f - at) / 15);
  const nHead = head.split(" ").length;
  return (
    <TextBed w={w} pad={28}>
      <div style={{ opacity: k, transform: `translateY(${((1 - EZ.snap(k)) * 14).toFixed(1)}px)` }}>
        <Kicker color={kColor}>{kicker}</Kicker>
      </div>
      <div style={{ height: 14 }} />
      <Title size={size}>
        <Wds text={head} f={f} at={at + 10} size={size} />
        {em ? (
          <>
            <br />
            <Wds text={em} f={f} at={at + 12 + nHead * 4} size={size * 1.06} serif />
          </>
        ) : null}
      </Title>
    </TextBed>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   PARTÍCULAS DE AGUA — la materia que cruza la frontera C (y vuelve en el acto 6)
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Squirt: React.FC<{ f: number; born: number; power: number; n?: number }> = ({
  f, born, power, n = 26,
}) => {
  if (power <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const s = rnd(i * 4.11);
        const s2 = rnd(i * 9.7);
        const t = (((f - born) * (0.011 + s * 0.006) + s2) % 1 + 1) % 1;
        // 0 → .46 : recorre el tubito hasta la boca · .46 → 1 : cae dentro del pipe
        const along = clamp01(t / 0.46);
        const fall = clamp01((t - 0.46) / 0.54);
        const x = t < 0.46 ? qb(35.5, 47.5, 56.5, along) : 56.5 + Math.sin(fall * 5 + i) * 0.8;
        const y = t < 0.46 ? qb(40.5, 44.5, 55.5, along) : 55.5 + fall * fall * 46;
        const d = (3.4 + s * 5.2) * (t < 0.46 ? 1 : 1 + fall * 0.5);
        const a = (t < 0.06 ? t / 0.06 : t > 0.94 ? (1 - t) / 0.06 : 1) * power * (0.4 + s2 * 0.6);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
              width: d, height: d * (t < 0.46 ? 1 : 1.7), borderRadius: "50%",
              background: `radial-gradient(circle at 36% 30%, ${rgba(MD.white, 0.9)} 0%, ${rgba(MD.cold, 0.5)} 56%, rgba(255,255,255,0) 78%)`,
              boxShadow: `0 0 ${d * 2}px ${rgba(MD.cold, 0.4 * a)}`,
              opacity: a,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Columna de gotas que sigue cayendo del otro lado del zoom-through (cose la frontera C). */
const FallThrough: React.FC<{ f: number; born: number; power: number }> = ({ f, born, power }) => {
  if (power <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 22 }, (_, i) => {
        const s = rnd(i * 5.3), s2 = rnd(i * 2.9);
        const t = (((f - born) * (0.02 + s * 0.014) + s2) % 1 + 1) % 1;
        const d = 5 + s * 13;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${18 + s2 * 64}%`, top: `${-8 + t * 122}%`,
              width: d, height: d * 2.1, borderRadius: "50%",
              background: `linear-gradient(180deg, ${rgba(MD.white, 0.5)} 0%, ${rgba(MD.cold, 0.14)} 100%)`,
              opacity: power * (0.2 + s * 0.55) * (t > 0.9 ? (1 - t) * 10 : 1),
              transform: `translateX(${(Math.sin(f / 9 + i) * 4).toFixed(1)}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL ARCO — nace en el acto 4 ("go on, I'll wait"), cruza el corte D sin moverse, y en el
   acto 6 es EL RELOJ que vuelve a empezar. Nunca dice "bucle": lo hace.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Arc: React.FC<{
  p: number; size: number; label?: string; num?: string; power?: number; hot?: number;
}> = ({ p, size, label, num, power = 1, hot = 0 }) => {
  const R = size / 2 - 10;
  const C = 2 * Math.PI * R;
  const col = hot > 0.5 ? MD.redHot : MD.cold;
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: power }}>
      <svg width={size} height={size} style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={rgba(MD.white, 0.14)} strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={R} fill="none"
          stroke={col} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={`${(C * clamp01(p)).toFixed(2)} ${C.toFixed(2)}`}
          opacity={0.9}
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        {num != null && (
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: size * 0.34, color: MD.white, lineHeight: 1 }}>
            {num}
          </div>
        )}
        {label != null && (
          <div
            style={{
              fontFamily: F_SANS, fontWeight: 800, fontSize: 20, letterSpacing: 2.4,
              color: rgba(MD.white, 0.66), marginTop: 6, textTransform: "uppercase",
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA A — el filo especular de la tapa que acompaña al `Occluder` (lo sella como OBJETO)
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const LidEdge: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const left = interpolate(p, [0, 1], [110, -310], { easing: Easing.bezier(0.36, 0, 0.2, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: "-30%", height: "160%", left: `${(left + 300).toFixed(2)}%`, width: "2.2%",
          transform: "rotate(8deg)",
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.bone, 0.85)} 46%, ${rgba(MD.white, 0.95)} 60%, rgba(255,255,255,0) 100%)`,
          boxShadow: `0 0 90px 26px ${rgba(MD.bone, 0.22)}`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA E — WIPE POR MATERIA hecho con MATERIAL REAL: el trapo blanco que cruza el cuadro
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const RagWipe: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const W = 190;
  const left = interpolate(p, [0, 1], [112, -(W + 12)], { easing: Easing.bezier(0.3, 0.02, 0.18, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: "-16%", height: "132%", left: `${left.toFixed(2)}%`, width: `${W}%`,
          transform: `rotate(${(5 - p * 3).toFixed(2)}deg)`, overflow: "hidden",
          boxShadow: `0 0 140px 50px ${rgba(MD.ink0, 0.85)}`,
        }}
      >
        <OffthreadVideo
          src={staticFile(V.wipetube)}
          muted
          playbackRate={1}
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%",
            transform: `scale(${(1.14 + p * 0.1).toFixed(3)})`,
          }}
        />
        <AbsoluteFill style={{ background: `rgba(0,0,0,${(0.14 + p * 0.1).toFixed(3)})` }} />
        {/* los bordes de la banda: apenas plumeados, o no hay cobertura real */}
        <AbsoluteFill
          style={{
            background:
              `linear-gradient(90deg, ${MD.ink0} 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0) 95%, ${MD.ink0} 100%)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
                                    A C T O   1  —  L A   T A P A
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Act1: React.FC<{ f: number; a1: number; a2: number }> = ({ f, a1, a2 }) => {
  const open = keyed(
    f,
    [a1 + 14, a1 + 74, a2 - 74, a2 - 16],
    [0.16, 1.0, 1.0, 0.08],
    [EZ.land, EZ.lin, EZ.push],
  );
  // la 3ª carta es FOTO (h49): `Material` del Stage detecta la extensión y le pone su deriva
  // lenta — acá SÍ sirve, porque su rampa interna (frame/240) recorre justo el acto 1 entero.
  const items = [
    { src: V.liftlid, cap: "LID OFF", pos: "50% 42%", photo: false, fx: 50, fy: 42 },
    { src: V.lidontowel, cap: "FLAT ON A TOWEL", pos: "50% 54%", photo: false, fx: 50, fy: 54 },
    { src: P.tankinside, cap: "NOW LOOK IN", pos: "50% 46%", photo: true, fx: 50, fy: 46 },
  ];
  const life = a2 - a1;
  const born = clamp01((f - (a1 + 2)) / 16); // rampa de entrada corta: el cuadro nunca está vacío
  return (
    <>
      {/* plano 1 · la cama: el interior del tanque, ya borroso y horneado */}
      <Plane f={f} pz={-320} px={0.16} sc={1.24}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Still src={P.bedTank} f={f} sc={1.1} drift={0.1} bright={0.32} sat={0.6} />
          <AbsoluteFill style={{ background: "radial-gradient(72% 62% at 46% 42%, rgba(0,0,0,0) 26%, rgba(0,0,0,0.86) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 2 · aire del cuarto */}
      <Plane f={f} pz={-140} px={0.5}><Motes n={30} tint={MD.cold} speed={0.9} /></Plane>

      {/* plano 3 · EL MAZO — desfase por carta: la delantera se mueve MÁS que la trasera */}
      <Plane f={f} pz={30} px={1}>
        {items.map((it, i) => {
          const c = i - 1;
          const lag = 0.55 + 0.45 * (i / 2);
          const oo = clamp01(open * lag);
          const depth = (2 - i) * 54;
          const capIn = clamp01((f - (a1 + 62 + i * 12)) / 18);
          return (
            <Card
              key={i}
              w={440} h={276}
              x={c * 336 * oo}
              y={Math.abs(c) * 16 * oo - depth * 0.06 + 26}
              z={30 - depth + oo * 46 * (1 - Math.abs(c) / 3)}
              ry={-c * 11 * oo}
              rz={c * 1.5 * oo}
              lit={0.42 + 0.5 * (i / 2)}
              op={born}
              sheenAt={a1 + 78 + i * 9}
              caption={capIn > 0.5 ? it.cap : undefined}
            >
              {it.photo ? (
                <Material src={it.src} drift={0.16} focusX={it.fx} focusY={it.fy} />
              ) : (
                <Reel src={it.src} life={life} pos={it.pos} sc={1.08} />
              )}
              <Grade d={0.08} vig={0.3} />
            </Card>
          );
        })}
      </Plane>

      {/* plano 4 · tipografía */}
      <AbsoluteFill style={{ transform: "translateZ(120px)" }}>
        <div style={{ position: "absolute", left: 200, bottom: 120, width: 740 }}>
          <Beat f={f} at={a1 + 10} kicker="NOW THE TANK" head="THE PART" em="you never touched" size={60} w={740} />
        </div>
      </AbsoluteFill>

      {/* plano 5 · suciedad de primer plano */}
      <Plane f={f} pz={220} px={1.8} op={0.5}><Motes n={12} tint={MD.bone} speed={1.6} /></Plane>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
                       A C T O   2  —  E L   M A P A   D E L   T A N Q U E
   El cenital real del interior. Sobre él, la PÁGINA DE LA GUÍA (lámina vertical, texto ya
   horneado) y los marcadores. Al final, el rack: lo nítido se apaga y queda la lupa.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Act2: React.FC<{ f: number; a2: number; a3: number }> = ({ f, a2, a3 }) => {
  const sharp = keyed(f, [a2, a3 - 34, a3 + 12], [1, 1, 0], [EZ.lin, EZ.soft]);
  const lamIn = clamp01((f - (a2 + 40)) / 26);
  const lamOut = 1 - clamp01((f - (a3 - 46)) / 30);
  const mark = clamp01((f - (a2 + 82)) / 22);
  const parked = clamp01((f - (a2 + 6)) / 20) * (1 - clamp01((f - (a2 + 122)) / 22));
  // ⚠️ la deriva interna de `Material` es `1 + drift*clamp01(frame/240)` sobre el frame GLOBAL:
  // acá el acto arranca en f225, así que ya llega saturada y la foto quedaría CLAVADA 9 s.
  // Por eso el Ken-Burns lo pongo yo, relativo al acto: empuje real del 6 % de punta a punta.
  const kb = lerp(1.10, 1.17, clamp01((f - a2) / Math.max(1, a3 + 14 - a2)));
  return (
    <>
      {/* plano 1 · la cama borrosa: el MISMO cenital, ya horneado. Nunca se remonta. */}
      <Plane f={f} pz={-300} px={0.14} sc={1.2}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Still src={P.bedTank} f={f} sc={1.14} drift={0.1} bright={0.44} sat={0.72} />
        </AbsoluteFill>
      </Plane>

      {/* plano 2 · el cenital NÍTIDO. Su opacidad hace el RACK FOCUS hacia la lupa (motivado). */}
      <Plane f={f} pz={-210} px={0.3} op={sharp}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `scale(${kb.toFixed(4)})` }}>
            <Material src={P.tankinside} drift={0} focusX={50} focusY={44} />
          </AbsoluteFill>
          <Grade d={0.12} vig={0.5} />
        </AbsoluteFill>
      </Plane>

      {/* plano 3 · marcadores de estructura sobre el material real (hairlines, no objetos) */}
      <Plane f={f} pz={-60} px={0.6} op={mark * sharp}>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={640} y1={318} x2={836} y2={402} stroke={rgba(MD.bone, 0.5)} strokeWidth={2} />
            <rect x={598} y={286} width={64} height={64} fill="none" stroke={rgba(MD.bone, 0.62)} strokeWidth={2} />
          </svg>
          <div
            style={{
              position: "absolute", left: 452, top: 250, fontFamily: F_SANS, fontWeight: 800,
              fontSize: 30, letterSpacing: 2.6, color: rgba(MD.bone, 0.86),
              textShadow: "0 4px 18px rgba(0,0,0,0.95)",
            }}
          >
            FILL VALVE
          </div>
        </AbsoluteFill>
      </Plane>

      {/* plano 4 · LA PÁGINA DE LA GUÍA — lámina vertical con su texto horneado, como objeto */}
      <Plane f={f} pz={90} px={1.1}>
        <Card
          w={400} h={578}
          x={lerp(596, 520, EZ.snap(lamIn))}
          y={-24 + (1 - lamIn) * 40}
          z={70}
          ry={-13} rz={1.2}
          radius={10}
          lit={0.9}
          op={clamp01(lamIn) * clamp01(lamOut)}
          sheenAt={a2 + 96}
        >
          <Still src={P.lamTankmap} f={f} pos="50% 50%" sc={1.02} drift={0.03} />
          <Grade d={0.04} red={0.02} vig={0.24} />
        </Card>
      </Plane>

      {/* plano 5 · LA MATERIA QUE CRUZÓ LA FRONTERA A: la tapa, apoyada en la toalla.
          Placa corta (≤150 frames) → acá SÍ va el `GlassPlate` del Stage, con `src` real. */}
      {parked > 0.01 && (
        <Plane f={f} pz={140} px={1.4} op={parked}>
          <GlassPlate
            src={V.lidontowel}
            w={324} h={202}
            x={-560} y={190} z={40}
            ry={13} rz={-1.4}
            lit={0.5}
            focusX={50} focusY={56}
            label={
              <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: rgba(MD.bone, 0.8) }}>
                THEY CRACK
              </div>
            }
          />
        </Plane>
      )}

      {/* plano 6 · tipografía */}
      <AbsoluteFill style={{ transform: "translateZ(150px)" }}>
        <div style={{ position: "absolute", left: 270, top: 170, width: 700 }}>
          <Beat f={f} at={a2 + 18} kicker="STANDING IN THE MIDDLE" head="THAT TALL PIPE IS" em="the overflow" size={54} w={700} />
        </div>
      </AbsoluteFill>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LA PLACA QUE CRUZA LA FRONTERA B  —  MATCH-SHAPE
   Vive en SU PROPIA capa, fuera de los dos actos, porque pertenece a los dos: nace como el
   ANILLO de 260 px aterrizado sobre la boca del rebalse (una lupa sobre el cenital) y se
   DESPLIEGA en la placa ancha del acto 3. El clip de adentro NUNCA se remonta.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const MorphPlate: React.FC<{ f: number; b0: number; a3: number; a4: number }> = ({ f, b0, a3, a4 }) => {
  const born = clamp01((f - b0) / 16);
  const m = clamp01((f - (a3 - 30)) / 56);
  const e = EZ.land(m);
  const grow = clamp01((f - (a3 + 26)) / (a4 - a3 - 26));
  const w = lerp(260, lerp(1300, 1716, EZ.soft(grow)), e);
  const h = lerp(260, lerp(720, 950, EZ.soft(grow)), e);
  const radius = lerp(130, 16, e);
  const life = a4 + 24 - b0;
  return (
    <Card
      w={w} h={h}
      x={lerp(-6, 0, e)}
      y={lerp(24, -6, e)}
      z={lerp(120, 40, e)}
      ry={lerp(-4, 0.6, e)}
      rz={lerp(1.6, 0, e)}
      radius={radius}
      lit={lerp(0.6, 1, e)}
      op={born * (0.2 + 0.8 * EZ.snap(born))}
      sheenAt={a3 + 40}
    >
      <Reel src={V.pointtube} life={life} pos="52% 48%" sc={lerp(1.9, 1.05, e)} />
      <Grade d={0.1} vig={lerp(0.62, 0.34, e)} />
      {/* el bisel del anillo, que se afina hasta desaparecer dentro del marco de la placa */}
      <AbsoluteFill
        style={{
          pointerEvents: "none", borderRadius: radius,
          boxShadow:
            `inset 0 0 0 ${(9 * (1 - e) + 0).toFixed(2)}px ${rgba(MD.bone, 0.72 * (1 - e))}, ` +
            `inset 0 0 ${(40 * (1 - e)).toFixed(1)}px ${rgba(MD.ink0, 0.8 * (1 - e))}`,
        }}
      />
    </Card>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
              A C T O   3  —  E L   T R A B A J O   D E L   T U B I T O
   El protagonista es la placa que viene de la frontera B. Acá encima corre EL AGUA: sale del
   fill valve, recorre el tubito y CAE DENTRO de la boca del rebalse. Ese chorro es la materia
   con la que la cámara se va a meter en el pipe (frontera C).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Act3: React.FC<{ f: number; a3: number; a4: number }> = ({ f, a3, a4 }) => {
  const water = keyed(f, [a3 + 42, a3 + 78, a4 - 40, a4], [0, 1, 1, 1.35], [EZ.snap, EZ.lin, EZ.push]);
  const glow = clamp01((f - (a3 + 96)) / 40);
  return (
    <>
      {/* plano 1 · la cama: el mismo tubito, horneado borroso — el mundo detrás de la placa */}
      <Plane f={f} pz={-300} px={0.14} sc={1.22}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Still src={P.bedTube} f={f} sc={1.16} drift={0.11} bright={0.36} sat={0.62} />
          <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 54% 52%, rgba(0,0,0,0) 24%, rgba(0,0,0,0.88) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 2 · aire */}
      <Plane f={f} pz={-120} px={0.5}><Motes n={22} tint={MD.cold} speed={1} /></Plane>

      {/* (plano 3 = la MorphPlate, que vive en su propia capa y cruza la frontera) */}

      {/* plano 4 · EL AGUA sobre la placa: el chorro que va a la boca y CAE dentro */}
      <Plane f={f} pz={130} px={1.2}>
        <Squirt f={f} born={a3 + 42} power={water} />
        {/* la boca encendida: cuanto más agua cae, más late el agujero */}
        <div
          style={{
            position: "absolute", left: "56.5%", top: "55.5%", transform: "translate(-50%,-50%)",
            width: 190 + Math.sin(f / 13) * 8, height: 190 + Math.sin(f / 13) * 8, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(MD.cold, 0.3 * glow)} 0%, rgba(0,0,0,0) 66%)`,
            opacity: glow,
          }}
        />
      </Plane>

      {/* plano 5 · tipografía */}
      <AbsoluteFill style={{ transform: "translateZ(180px)" }}>
        <div style={{ position: "absolute", left: 340, bottom: 230, width: 640 }}>
          <Beat f={f} at={a3 + 44} kicker="AFTER EVERY FILL" head="IT SQUIRTS WATER" em="down the pipe" size={54} w={640} />
        </div>
      </AbsoluteFill>

      {/* plano 6 · suciedad de primer plano */}
      <Plane f={f} pz={250} px={2} op={0.42}><Motes n={10} tint={MD.bone} speed={1.8} /></Plane>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
                       A C T O   4  —  M E T É   E L   D E D O
   Salimos del zoom-through ADENTRO. El acto entra sobreescalado y desacelera: eso es "emerger".
   Las gotas que veníamos siguiendo siguen cayendo los primeros 46 frames (cose la costura C).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Act4: React.FC<{ f: number; a4: number; a5: number; arcP: number }> = ({ f, a4, a5, arcP }) => {
  const settle = keyed(f, [a4 - 14, a4 + 40], [1.55, 1.0], EZ.drop);
  const carry = 1 - clamp01((f - (a4 + 6)) / 46);
  const arcIn = clamp01((f - (a4 + 74)) / 20);
  const life = a5 + 26 - (a4 - 14);
  return (
    <>
      {/* el SETTLE (emerger del zoom-through) sólo afecta a la MATERIA, nunca a la tipografía:
          si envolviera al texto, lo escupiría fuera del safe area durante los primeros 40 frames */}
      <AbsoluteFill style={{ transform: `scale(${settle.toFixed(4)})`, transformStyle: "preserve-3d" }}>
        {/* plano 1 · material real a sangre: el dedo entrando en la boca del pipe */}
        <Plane f={f} pz={-180} px={0.2} sc={1.04}>
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <Reel src={V.fingerinside} life={life} pos="52% 48%" sc={1.1} />
            <Grade d={0.16} red={0.03} vig={0.58} />
          </AbsoluteFill>
        </Plane>

        {/* plano 2 · LA MATERIA QUE CRUZÓ LA FRONTERA C: el agua sigue cayendo del otro lado */}
        <Plane f={f} pz={40} px={1}><FallThrough f={f} born={a4 - 20} power={carry} /></Plane>

        {/* plano 3 · aire húmedo */}
        <Plane f={f} pz={110} px={1.3} op={0.7}><Motes n={16} tint={MD.cold} speed={1.3} /></Plane>
      </AbsoluteFill>

      {/* plano 4 · EL ARCO DE ESPERA — "go on, I'll wait". Nace acá; vuelve como reloj en el 6.
          Su posición de PANTALLA es la misma que tendrá en el acto 5: eso cose el corte seco. */}
      <div
        style={{
          position: "absolute", right: 320, bottom: 240, opacity: arcIn,
          transform: `translateY(${((1 - EZ.snap(arcIn)) * 18).toFixed(1)}px)`,
        }}
      >
        <Arc p={arcP} size={168} label="I'll wait" power={1} />
      </div>

      {/* plano 5 · tipografía (arriba-derecha: cambia el peso del cuadro respecto del acto 3) */}
      <AbsoluteFill style={{ transform: "translateZ(190px)" }}>
        <div style={{ position: "absolute", right: 330, top: 200, width: 620 }}>
          <Beat f={f} at={a4 + 20} kicker="TOP OF THE PIPE" head="RUN A FINGER" em="inside" size={58} w={620} />
        </div>
      </AbsoluteFill>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
                   A C T O   5  —  E L   D E D O   N E G R O   (el golpe)
   Macro extremo, key DURA, hold VIVO. Es el único momento del tramo con contraste alto: todo
   lo demás es agua fría. Se entra por CORTE EN EL BEAT en la palabra "slimy".
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Act5: React.FC<{ f: number; a5: number; a6: number; arcP: number }> = ({ f, a5, a6, arcP }) => {
  const punch = keyed(f, [a5, a5 + 10, a5 + 44], [1.06, 1.02, 1.0], [EZ.snap, EZ.soft]);
  const arcOut = 1 - clamp01((f - (a5 + 30)) / 24);
  const life = a6 + 14 - a5;
  const hot = clamp01((f - (a5 + 54)) / 30);
  return (
    <>
      <AbsoluteFill style={{ transform: `scale(${punch.toFixed(4)})`, transformStyle: "preserve-3d" }}>
      {/* plano 1 · cama horneada del mismo macro (profundidad detrás de la placa) */}
      <Plane f={f} pz={-320} px={0.12} sc={1.3}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Still src={P.bedFinger} f={f} sc={1.2} drift={0.12} bright={0.3} sat={0.5} />
        </AbsoluteFill>
      </Plane>

      {/* plano 2 · EL MACRO — placa casi a sangre, con su marco y su sombra de contacto */}
      <Plane f={f} pz={40} px={0.9}>
        <Card
          w={1180} h={640}
          y={-6 + Math.sin(f / 61) * 4}
          z={80}
          ry={lerp(1.4, -0.8, clamp01((f - a5) / (a6 - a5)))}
          rz={-0.4}
          radius={14}
          lit={1.15}
          hot={hot * 0.55}
          sheenAt={a5 + 96}
        >
          <Reel src={V.blackfinger} life={life} pos="50% 44%" sc={1.08} />
          {/* key DURA de producto: la bombita pega de arriba-izquierda y deja el resto en sombra */}
          <AbsoluteFill
            style={{
              pointerEvents: "none", mixBlendMode: "screen",
              background: `radial-gradient(52% 46% at 30% 20%, ${rgba(MD.white, 0.2)} 0%, ${rgba(MD.cold, 0.06)} 44%, rgba(0,0,0,0) 72%)`,
            }}
          />
          <Grade d={0.1} red={0.07} vig={0.56} />
        </Card>
      </Plane>

      {/* plano 3 · la baba: goterones lentísimos formándose en la yema (hold VIVO) */}
      <Plane f={f} pz={150} px={1.1}>
        {Array.from({ length: 5 }, (_, i) => {
          const s = rnd(i * 6.7);
          const t = (((f - a5) * (0.0042 + s * 0.0026) + rnd(i * 2.3)) % 1 + 1) % 1;
          const d = 10 + s * 16;
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: `${44 + s * 16}%`, top: `${46 + t * 30}%`,
                width: d, height: d * (1 + t * 1.1), borderRadius: "50%",
                background: `linear-gradient(180deg, ${rgba("#171512", 0.95)} 0%, ${rgba("#0A0908", 0.95)} 100%)`,
                boxShadow: `inset -2px -3px 6px ${rgba(MD.bone, 0.12)}, 0 6px 14px rgba(0,0,0,0.7)`,
                opacity: 0.5 + s * 0.4,
              }}
            />
          );
        })}
      </Plane>

      {/* plano 6 · suciedad de primer plano, muy cerca del lente */}
      <Plane f={f} pz={300} px={2.2} op={0.5}><Motes n={9} tint={MD.bone} speed={2.1} /></Plane>
      </AbsoluteFill>

      {/* plano 4 · EL ARCO sigue clavado EXACTAMENTE donde estaba en el acto 4 (misma posición de
          pantalla, mismo tamaño, misma vuelta): ese elemento inmóvil es lo que cose el corte seco */}
      {arcOut > 0.01 && (
        <div style={{ position: "absolute", right: 320, bottom: 240, opacity: arcOut }}>
          <Arc p={arcP} size={168} label="I'll wait" />
        </div>
      )}

      {/* plano 5 · tipografía */}
      <AbsoluteFill style={{ transform: "translateZ(210px)" }}>
        <div style={{ position: "absolute", left: 320, bottom: 230, width: 700 }}>
          <Beat f={f} at={a5 + 14} kicker="AND IN A MOLDY TOILET" head="SLIMY." em="it usually is" size={66} w={700} />
        </div>
      </AbsoluteFill>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
                            A C T O   6  —  E L   R E L O J
   El arco vuelve. Barre 84 frames, se completa, SUELTA UNA DESCARGA sobre la mancha y VUELVE
   A EMPEZAR. La mancha se pone un punto más oscura en cada vuelta y se suma una marca abajo.
   No hay ningún cartel que diga "bucle": el movimiento termina con el arco a mitad de vuelta.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CYC = 84;
const Act6: React.FC<{ f: number; a6: number; end: number }> = ({ f, a6, end }) => {
  const el = Math.max(0, f - (a6 + 10));
  const cyc = (el % CYC) / CYC;
  const turns = Math.floor(el / CYC);
  const burst = clamp01((cyc - 0.82) / 0.18);          // la descarga, al final de cada vuelta
  const dark = Math.min(0.52, turns * 0.12 + burst * 0.06);
  const parked = clamp01((f - (a6 + 8)) / 20) * (1 - clamp01((f - (a6 + 130)) / 24));
  const life = end - a6 + 10;
  return (
    <>
      {/* plano 1 · la cama: el frasco marrón volcándose en el tanque, horneado borroso.
          Nadie lo lee como información: es la promesa de lo que viene en MovClose. */}
      <Plane f={f} pz={-320} px={0.13} sc={1.24}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Still src={P.bedPour} f={f} sc={1.14} drift={0.1} bright={0.3} sat={0.56} />
          <AbsoluteFill style={{ background: "radial-gradient(74% 64% at 50% 54%, rgba(0,0,0,0) 24%, rgba(0,0,0,0.88) 100%)" }} />
        </AbsoluteFill>
      </Plane>

      {/* plano 2 · aire */}
      <Plane f={f} pz={-130} px={0.5}><Motes n={24} tint={MD.cold} speed={0.8} /></Plane>

      {/* plano 3 · LA MANCHA: el destino del enjuague. Se oscurece un punto por vuelta. */}
      <Plane f={f} pz={30} px={1}>
        <Card
          w={980} h={580}
          y={10 + Math.sin(f / 67) * 5}
          z={60}
          ry={lerp(-2.2, 0.8, clamp01((f - a6) / (end - a6)))}
          rz={0.5}
          radius={16}
          lit={0.95}
          hot={burst * 0.7}
          sheenAt={a6 + 70}
          overlay={
            <>
              {/* el moho que vuelve: manchones que se van sumando vuelta a vuelta */}
              {Array.from({ length: 9 }, (_, i) => {
                const s = rnd(i * 3.9), s2 = rnd(i * 8.1);
                const on = clamp01((el - i * (CYC / 9)) / 30);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute", left: `${16 + s * 66}%`, top: `${26 + s2 * 52}%`,
                      width: 40 + s * 130, height: 30 + s2 * 90,
                      borderRadius: "56% 44% 62% 38% / 48% 58% 42% 52%",
                      background: `radial-gradient(circle at 42% 38%, ${rgba("#12140F", 0.9)} 0%, ${rgba(MD.mold, 0.42)} 58%, rgba(0,0,0,0) 78%)`,
                      opacity: on * dark * 1.4,
                      transform: `rotate(${(s2 * 90).toFixed(1)}deg) scale(${(0.9 + Math.sin(f / 51 + i) * 0.05).toFixed(3)})`,
                    }}
                  />
                );
              })}
              {/* la descarga: gotas que bajan y siembran otra vez */}
              {burst > 0.01 &&
                Array.from({ length: 14 }, (_, i) => {
                  const s = rnd(i * 7.3);
                  const k = clamp01(burst * 1.5 - s * 0.4);
                  return (
                    <div
                      key={`b${i}`}
                      style={{
                        position: "absolute", left: `${20 + s * 60}%`, top: `${-10 + k * 96}%`,
                        width: 5 + s * 8, height: (5 + s * 8) * 2.3, borderRadius: "50%",
                        background: `linear-gradient(180deg, ${rgba(MD.white, 0.5)} 0%, ${rgba(MD.cold, 0.12)} 100%)`,
                        opacity: k > 0.98 ? 0 : burst * 0.9,
                      }}
                    />
                  );
                })}
            </>
          }
        >
          <Reel src={V.patchymold} life={life} pos="50% 50%" sc={1.06} />
          <Grade d={0.1} red={0.06} vig={0.46} />
        </Card>
      </Plane>

      {/* plano 4 · EL TRAPO que barrió la frontera E, aparcado, todavía trabajando.
          Placa corta (≤150 frames) → `GlassPlate` del Stage con `src` real. */}
      {parked > 0.01 && (
        <Plane f={f} pz={160} px={1.4} op={parked}>
          <GlassPlate
            src={V.wipetankwall}
            w={330} h={206}
            x={-470} y={-250} z={50}
            ry={15} rz={1.6}
            lit={0.5}
            focusX={52} focusY={48}
          />
        </Plane>
      )}

      {/* plano 5 · EL RELOJ: el arco vuelve a empezar, y las marcas se acumulan */}
      <div style={{ position: "absolute", right: 300, bottom: 250 }}>
        <Arc p={cyc} size={188} num={String(turns + 1)} label="fill" hot={burst > 0.4 ? 1 : 0} />
        <div style={{ display: "flex", gap: 9, marginTop: 18, justifyContent: "center" }}>
          {Array.from({ length: Math.min(8, turns) }, (_, i) => (
            <div
              key={i}
              style={{
                width: 5, height: 26, borderRadius: 3,
                background: rgba(MD.redHot, 0.55 + 0.35 * clamp01((el - (i + 1) * CYC) / 20)),
                boxShadow: `0 0 12px ${rgba(MD.red, 0.4)}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* plano 6 · tipografía */}
      <AbsoluteFill style={{ transform: "translateZ(200px)" }}>
        <div style={{ position: "absolute", left: 280, top: 150, width: 700 }}>
          <Beat f={f} at={a6 + 16} kicker="EVERY FILL. EVERY TIME." head="YOU PUT IT" em="back" size={62} w={700} />
        </div>
      </AbsoluteFill>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
                                E L   M O V I M I E N T O
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovRefill: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = Math.max(60, durationInFrames);
  const f = Math.min(frame, D - 1);
  const p = clamp01(f / D);

  // ── ACTOS COMO FRACCIONES DE LA DURACIÓN (±20% de tolerancia sobre el nominal de 1500) ──
  const a1 = 0;
  const a2 = Math.round(D * 0.150);
  const a3 = Math.round(D * 0.335);
  const a4 = Math.round(D * 0.520);
  const a5 = Math.round(D * 0.655);
  const a6 = Math.round(D * 0.815);
  const END = D;

  // ── LAS FRONTERAS ──
  const sA = a2 - 16;          // OCLUSIÓN         (dur 18 · cobertura total ≈ sA+4 … sA+13)
  const b0 = a3 - 92;          // MATCH-SHAPE      (nace la lupa; se despliega en a3−30 … a3+26)
  const sC = a4 - 20;          // ZOOM-THROUGH     (dur 22)
  const sD = a5;               // CORTE EN EL BEAT (seco, sin overlay)
  const sE = a6 - 22;          // WIPE POR MATERIA (dur 26 · cobertura total ≈ sE+9 … sE+17)

  // ── LA CÁMARA DEL VIDEO. ⛔ Un solo `stageCam`, jamás reiniciado. ──
  const scam = stageCam(p, 5);

  // ── OFFSET PROPIO DEL MOVIMIENTO — va ENCIMA de stageCam, nunca en su lugar. Muere en ~0. ──
  const OK = mono([
    a1, D * 0.07, a2, D * 0.24, a3, D * 0.44, sC, a4 + 40, a5, D * 0.74, a6, D * 0.92, END,
  ]);
  const EE = [EZ.glide, EZ.soft, EZ.push, EZ.soft, EZ.push, EZ.push, EZ.drop, EZ.soft, EZ.glide, EZ.soft, EZ.glide, EZ.soft];
  const oz = keyed(f, OK, [-210, -90, 30, 90, 190, 250, 300, 150, 210, 260, 120, 60, 20], EE);
  const ox = keyed(f, OK, [60, 30, 0, -40, -70, -34, -6, -30, 0, 20, -10, 6, 0], EE);
  const oy = keyed(f, OK, [-30, -14, 14, 30, 10, -2, -6, 8, 0, -8, 12, 4, 0], EE);
  const ory = keyed(f, OK, [3.4, 2.0, -1.2, -2.6, 0.6, 1.4, 0.6, 1.8, -0.8, -1.6, 0.8, 0.3, 0], EE);
  const orx = keyed(f, OK, [-2.6, -1.6, 1.2, 2.4, 3.2, 3.8, 4.2, -2.0, -1.0, 0.4, 1.6, 0.8, 0.3], EE);
  const bx = Math.sin(f / 47) * 2.3 + Math.sin(f / 113) * 1.3;   // deriva viva: nunca quieto
  const by = Math.cos(f / 61) * 1.8;
  const offset =
    `translateZ(${oz.toFixed(2)}px) translate3d(${(ox + bx).toFixed(2)}px, ${(oy + by).toFixed(2)}px, 0) ` +
    `rotateY(${ory.toFixed(3)}deg) rotateX(${orx.toFixed(3)}deg)`;

  // ── LA LUZ. `movLight(5, p)` es FRÍA de punta a punta (arco del video): lo que evoluciona es
  //    la DIRECCIÓN de la fuente y su DUREZA. Pico duro en el acto 5.
  const tint = movLight(5, p);
  const keyPos = keyed(f, [a1, a2, a3, a4, a5, a6, END], [0.20, 0.30, 0.44, 0.60, 0.74, 0.86, 0.88], EZ.soft);
  const inten = keyed(f, [a1, a2, a3, a4, a5, a5 + 60, a6, END], [1.02, 0.98, 0.90, 0.78, 0.9, 0.94, 0.72, 0.66], EZ.soft);

  // dureza de la key: 0 = agua fría difusa · 1 = la bombita pegando duro sobre el dedo negro
  const hard = keyed(
    f, mono([a5 - 1, a5, a5 + 24, a6 - 34, sE + 13]), [0, 1, 1, 1, 0],
    [EZ.lin, EZ.lin, EZ.lin, EZ.soft],
  );

  // ── EL ARCO (nace en el acto 4, cruza el corte D, vuelve como reloj en el 6) ──
  const arcWait = clamp01((f - (a4 + 74)) / 96);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* LA ATMÓSFERA — se monta UNA vez, para los seis actos. Nunca se remonta. */}
      <Atmos tint={tint} keyFrom={keyPos} intensity={inten} />

      {/* LA CÁMARA — una sola, con el offset del movimiento encima */}
      <AbsoluteFill style={{ transform: `${scam.transform} ${offset}`, transformStyle: "preserve-3d" }}>

        {/* ACTO 1 · zIndex 10 */}
        {f < sA + 11 && (
          <Space3D depth={1500} style={{ zIndex: 10 }}>
            <Act1 f={f} a1={a1} a2={a2} />
          </Space3D>
        )}

        {/* ACTO 2 · zIndex 20 — mounta DENTRO de la cobertura del Occluder */}
        {f >= sA + 8 && f < a3 + 34 && (
          <Space3D depth={1500} style={{ zIndex: 20 }}>
            <Act2 f={f} a2={a2} a3={a3} />
          </Space3D>
        )}

        {/* ACTO 4 · zIndex 25 — mounta DEBAJO del acto 3 para que el zoom-through lo descubra */}
        {f >= sC + 4 && f < sD && (
          <Space3D depth={1500} style={{ zIndex: 25 }}>
            <Act4 f={f} a4={a4} a5={a5} arcP={arcWait} />
          </Space3D>
        )}

        {/* ACTO 3 + LA PLACA QUE CRUZA LA FRONTERA B · zIndex 30 · sale por ZOOM-THROUGH
            ⚠️ el zIndex va en ESTE div, no dentro del ZoomThrough: si no, el acto 4 (zIndex 25)
            pintaría ENCIMA del `AbsoluteFill` sin z-index del ZoomThrough y el clavado se vería. */}
        {f < a4 + 6 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 30, transformStyle: "preserve-3d" }}>
            <ZoomThrough at={sC} dur={22} into={[56, 56]} scale={8}>
              <Space3D depth={1500}>
                {f >= a3 - 12 && <Act3 f={f} a3={a3} a4={a4} />}
                {f >= b0 && <MorphPlate f={f} b0={b0} a3={a3} a4={a4} />}
              </Space3D>
            </ZoomThrough>
          </div>
        )}

        {/* ACTO 5 · zIndex 40 — entra por CORTE EN EL BEAT, seco, en "slimy" */}
        {f >= sD && f < sE + 14 && (
          <Space3D depth={1500} style={{ zIndex: 40 }}>
            <Act5 f={f} a5={a5} a6={a6} arcP={arcWait} />
          </Space3D>
        )}

        {/* ACTO 6 · zIndex 45 — mounta DENTRO de la cobertura del trapo */}
        {f >= sE + 13 && (
          <Space3D depth={1500} style={{ zIndex: 45 }}>
            <Act6 f={f} a6={a6} end={END} />
          </Space3D>
        )}
      </AbsoluteFill>

      {/* ── LAS COSTURAS, encima de la cámara (viven en pantalla, no en el espacio) ── */}
      {/* A · OCLUSIÓN: la tapa de porcelana pasa pegada al lente */}
      <Occluder at={sA} dur={18} color="#2C2E2B" angle={8} />
      <LidEdge f={f} at={sA} dur={18} />

      {/* E · WIPE POR MATERIA: el trapo blanco REAL cruza el cuadro */}
      <div style={{ position: "absolute", inset: 0, zIndex: 60 }}>
        <RagWipe f={f} at={sE} dur={26} />
      </div>

      {/* ── KEY LOCAL DEL MOMENTO: la bombita viaja con la cámara y se ENDURECE en el acto 5.
             El salto de 0→1 cae EXACTO en el corte seco (ahí sí se quiere sentir); la vuelta a
             luz blanda se apaga DEBAJO del trapo de la frontera E, nunca a la vista. ── */}
      <KeyLight
        x={18 + keyPos * 64}
        y={lerp(6, 16, hard)}
        r={lerp(92, 62, hard)}
        power={lerp(0.7, 1.25, hard)}
        tint={tint}
      />
    </AbsoluteFill>
  );
};
