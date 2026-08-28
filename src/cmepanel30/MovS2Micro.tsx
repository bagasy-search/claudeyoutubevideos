// MovS2Micro.tsx — MOVIMIENTO S2 · "EL MECANISMO DEL MICROINVERSOR"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 1605 frames @30 = 53,50 s.
// Se monta ENCIMA del avatar real de Claudio. ⛔ CERO filtros sobre el avatar: no hay una sola capa
// con opacidad apoyada sobre su cara. Todo el diseño vive ALREDEDOR de él y las ventanas se abren
// con GEOMETRÍA (`clip-path`), nunca con opacidad.
//
// ── CÓMO ESTÁ CONSTRUIDO ──────────────────────────────────────────────────────────────────────
// 1. EL MUNDO (atmósfera + los tres soles + los fondos a sangre) vive DENTRO de un único contenedor
//    recortado por LA APERTURA (`coverAt` → `clipOf`): un polígono en U con el hueco central abierto
//    hacia abajo. Hueco cerrado = el mundo tapa la pantalla. Hueco abierto = el mundo queda SÓLO en
//    los tercios laterales y la banda superior, y Claudio se ve LIMPIO en el medio.
//    Las CUATRO ventanas usan cuatro gestos DISTINTOS:
//      W1 (46-178)    los dos costados se separan y se vuelven a JUNTAR (la tapa de la caja)
//      W2 (430-576)   la banda superior SUBE como un telón y después vuelve a BAJAR sobre él
//      W3 (1082-1236) la banda IZQUIERDA barre hacia afuera (asimétrica) y ya no cierra: la tapa
//                     el polvo de hormigón de la costura D
//      W4 (1352-1546) apertura ESCALONADA (primero el costado derecho, 22 f después el izquierdo)
//                     y cierra con el EXTERIOR bajando desde arriba: así aterrizamos afuera
// 2. EL PRIMER PLANO (tarjetas con material real, números, íconos, titulares) NO está recortado.
//    Mientras la apertura está abierta TODO vive en x<26 % o x>74 %: nada entra jamás en la caja de
//    la cara (30-70 % · 10-90 %), y nunca hay nada sobre boca ni mentón.
// 3. UNA sola cámara `camAt(g)`, función pura de g, con deriva viva. Ningún acto la reinicia: el
//    acto 5 hereda la inercia del 4. UNA sola atmósfera, montada una vez para los 53 s.
// 4. LA MATERIA QUE CRUZA: LA CAJITA GRIS es literalmente EL MISMO objeto del frame 6 al 414 —
//    `cajaAt()` la sube de la mesa, la estaciona en el tercio izquierdo, la trae al centro y la
//    hace GIRAR 180° sobre su eje: la cara de atrás de la misma cajita ES la pantalla de las dos
//    ondas. Después la cajita vuelve en el acto 3 colgada del gancho (escuchando), en el 4 con el
//    led encendido y apagado, y en el 5 como su etiqueta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⇐ ENTRA DESDE el desembalaje del kit: MESA DE TALLER, cámara ya derivando a la izquierda,
//   luz HORA.taller (34°, ámbar, amb 0.44), materia entrante: LA CAJITA GRIS EN LA MANO.
//
// ACTO 1 · 0-188 · "LA CAJITA GRIS"          protagonista: LA CAJITA   texto: HACE DOS COSAS
//   entra  cam {z −260, grúa −16, push 1.14, foco 46/58}   luz {taller 34°, ámbar, amb 0.44 (rampa 12 f)}
//          materia {la cajita gris en la mano, subiendo de la mesa de taller}
//   sale   cam {grúa −48, push 1.09, foco 50/45}           luz {taller → limpio 30°, amb 0.50}
//          materia {LA CAJITA de frente, centrada, empezando a girar sobre su eje}
//   ── FRONTERA A @188 ···· MATCH-SHAPE: la MISMA cajita gira 180° sobre su eje Y. Su silueta no se
//      interrumpe un solo frame; lo que cambia es la cara que mira a cámara. La de atrás ES la
//      pantalla de las dos ondas, hecha con el macro del silicio del panel. Un objeto que cambia de
//      forma sin soltar el cuadro — nunca un corte, nunca un fundido. ····························
// ACTO 2 · 188-411 · "LO QUE HACE CUALQUIERA" protagonista: LAS DOS ONDAS  texto: MISMA TENSIÓN · MISMA FRECUENCIA
//   entra  cam {grúa −48, push 1.09}                       luz {limpio 22°, blanco, amb 0.62}
//          materia {la cara de atrás de la cajita: vidrio de silicio con la onda continua encima}
//   sale   cam {grúa −6, push 1.0, foco 50/45}             luz {limpio → penumbra, amb 0.44}
//          materia {las dos ondas COLAPSADAS en un solo punto de luz en el centro del cuadro}
//   ── FRONTERA B @411 ···· ZOOM-THROUGH: la cámara entra por ese punto (fx 50 / fy 45, arranca en
//      392) y sale del otro lado ya DENTRO del enchufe de la pared. El acto 3 se monta 20 f antes,
//      DEBAJO: un zoom-through contra nada es un fundido a negro. ······························
// ACTO 3 · 411-831 · "PRIMERO ESCUCHA"       protagonista: LA CAJITA QUE ESCUCHA  texto: PRIMERO ESCUCHA
//   entra  cam {saliendo del túnel, push 1.36 → 1.12, grúa +24} luz {penumbra 8°, sky, amb 0.22}
//          materia {el enchufe de la pared, macro, en penumbra}
//   sale   cam {grúa +6, push 1.18, foco 40/52}            luz {penumbra → cálida desde ABAJO, amb 0.60}
//          materia {la cajita con el LED recién encendido, empujando}
//   ── FRONTERA C @831 ···· OCLUSIÓN: el PLÁSTICO GRIS de la carcasa de la cajita (con sus ranuras
//      de ventilación y el canto lamido por la luz) cruza de derecha a izquierda y tapa el 100 %
//      entre los frames 830 y 833. El acto cambia ADENTRO de esos tres frames. El color es el de LA
//      MATERIA (#8E9088), jamás el del fondo: con el del fondo esto es un fundido a negro. ······
// ACTO 4 · 831-1236 · "SI NO HAY RED, SE APAGA" protagonista: EL LED  texto: ANTI-ISLANDING
//   entra  cam {grúa −14, push 1.06}                       luz {tormenta −30°, sky, amb 0.09}
//          materia {el mismo led, ahora a sangre y en la oscuridad}
//   sale   cam {grúa −16 → +10, push 1.02, foco 52/48}     luz {penumbra 12° → papel, amb 0.62}
//          materia {el hormigón del poste de la esquina}
//   (costura INTERNA @878 ···· MATCH-MOVE: `led_arranca` → `led_apaga` son el MISMO encuadre con el
//    led al revés. Se cortan en el frame 878 sin mover un píxel: el movimiento del plano continúa
//    y lo único que cambia es que la luz verde se murió. Un golpe seco de escala de 3 frames lo
//    vende como un click mecánico, no como una edición.
//    costura INTERNA @1020 ···· CORTE EN EL BEAT: sobre "no electrocuta", corte seco al operario del
//    poste. La BISAGRA es la palabra ANTI-ISLANDING: está en la misma x, y y tamaño a los dos lados
//    del corte durante 20 frames, y recién después se va al tercio izquierdo.)
//   ── FRONTERA D @1236 ···· WIPE POR MATERIA: el polvo y las astillas de hormigón del poste cruzan
//      el cuadro y detrás ya está la etiqueta de la cajita sobre el banco. La apertura vuelve a
//      CERRADO adentro del polvo. ···················································
// ACTO 5 · 1236-1605 · "EL PRIMER DATO"      protagonista: LA ETIQUETA  texto: NO LO COMPRES
//   entra  cam {grúa +10, push 1.10}                       luz {papel 70°, blanco, amb 0.62 → 0.88}
//          materia {la etiqueta de la cajita, la lupa barriéndola}
//   sale   cam {grúa +120, push 1.0, SIGUE ANDANDO}        luz {mediodía 88°, blanco, amb 0.95}
//          materia {EL ENCHUFE DE LA PARED EXTERIOR, encuadre abierto}
//
// ⇒ SALE HACIA la instalación en el patio: encuadre ABIERTO de exterior, la cámara siguiendo a
//   Claudio que camina hacia el kit, luz HORA.mediodia, materia saliente: el enchufe de la pared.
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade en ninguna frontera · cero capa de
// color con opacidad sobre el avatar · toda tarjeta flotante lleva FOTO o CLIP real adentro; las
// ondas y los anillos son gráfica de APOYO dibujada ENCIMA del material real, nunca el objeto.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamWipeMatter, zoomThrough, SunKey, HORA, flujo,
  Head, Body, Num, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps, anclados al ms de Whisper) ───────────────
const A1 = 0;        // 5885 · "Lo que cambia todo es el microinversor."
const A2 = 188;      // 6073 · "Convierte la corriente del panel en la corriente de tu casa."
const A3 = 411;      // 6296 · "La segunda es la que casi nadie explica."
const A4 = 830;      // 6715 · "Si no la encuentra, si la red se cayó, se apaga solo."
const A5 = 1232;     // 7117 · "Y ahí tienes gratis el primer dato para no comprar basura."
const G_END = 1605;
// los frames en que el VISUAL cambia de acto: caen ADENTRO de la costura, no en el beat exacto
const SW4 = A4 + 1;    // 831 · adentro de la oclusión (tapa el 100 % entre 830 y 833)
const SW5 = A5 + 4;    // 1236 · adentro del wipe de polvo de hormigón
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });

// El plástico gris de la carcasa del microinversor: LA MATERIA de la oclusión de la frontera C.
const PLASTICO = "#8E9088";

// ── EL MATERIAL REAL. Las rutas van LITERALES en el punto de uso (`MediaCard src="..."`,
//    `PhotoPlane src="..."`, `IconPng src="..."`): el build escanea este .tsx por TEXTO y una ruta
//    armada por template literal no viaja en el tar → 404 → chunk muerto con un error que miente
//    ("source image cannot be decoded"). Por eso acá no hay ningún mapa de assets.

// ══ LA APERTURA ══════════════════════════════════════════════════════════════════════════════
// gL = borde derecho de la banda IZQUIERDA · gR = borde izquierdo de la banda DERECHA
// sh = altura de la banda SUPERIOR. El hueco (donde se ve Claudio limpio) = (gL..gR) × (sh..100).
type Cover = { gL: number; gR: number; sh: number; open: boolean };
const CERRADO: Cover = { gL: 50, gR: 50, sh: 0, open: false };

const coverAt = (g: number): Cover => {
  // W1 · ACTO 1 — los dos costados se separan como la tapa de la caja y se vuelven a JUNTAR
  if (g >= 46 && g < 178) {
    const abre = es(clamp01((g - 46) / 34));
    const junta = es(clamp01((g - 148) / 28));
    const sp = Math.min(abre, 1 - junta);
    return { gL: lerp(50, 21, sp), gR: lerp(50, 79, sp), sh: 10 * clamp01(sp * 2.6), open: sp > 0.006 };
  }
  // W2 · ACTO 3 — el mundo se retira HACIA ARRIBA como un telón, y después vuelve a BAJAR entero
  if (g >= 430 && g < 578) {
    const sube = esOut(clamp01((g - 430) / 40));
    const baja = esOut(clamp01((g - 540) / 36));
    const sh = lerp(lerp(100, 9, sube), 100, baja);
    return { gL: 22, gR: 78, sh, open: sh < 98.5 };
  }
  // W3 · ACTO 4 — asimétrica: la banda IZQUIERDA barre hacia afuera y el hueco crece hacia la
  // izquierda. No cierra nunca: la tapa el polvo de hormigón de la frontera D.
  if (g >= 1082 && g < SW5) {
    const barre = esOut(clamp01((g - 1082) / 30));
    return { gL: lerp(79, 21, barre), gR: 79, sh: 9, open: barre > 0.02 };
  }
  // W4 · ACTO 5 — ESCALONADA: primero se va el costado derecho, 22 f después el izquierdo. Cierra
  // con el EXTERIOR bajando desde arriba (la banda superior crece) y ya no se vuelve a abrir.
  if (g >= 1352 && g < 1548) {
    const saleR = es(clamp01((g - 1352) / 34));
    const saleL = es(clamp01((g - 1374) / 34));
    const baja = esOut(clamp01((g - 1496) / 46));
    const sh = lerp(8, 100, baja);
    return {
      gL: lerp(50, 18, saleL), gR: lerp(50, 82, saleR),
      sh, open: saleR > 0.012 && sh < 98.5,
    };
  }
  return CERRADO;
};

const clipOf = (c: Cover) =>
  c.open
    ? `polygon(0% 0%, 100% 0%, 100% 100%, ${c.gR.toFixed(2)}% 100%, ` +
      `${c.gR.toFixed(2)}% ${c.sh.toFixed(2)}%, ${c.gL.toFixed(2)}% ${c.sh.toFixed(2)}%, ` +
      `${c.gL.toFixed(2)}% 100%, 0% 100%)`
    : "inset(0px)";

// ── LOS CANTOS DE LA APERTURA. Todo su brillo sale HACIA AFUERA (hacia el mundo): ni un píxel de
//    gradiente se apoya sobre la cara. Es lo que hace que la apertura se lea como dos placas con el
//    canto lamido por la luz y no como una máscara.
const CantoV: React.FC<{ x: number; dir: -1 | 1; hot: number }> = ({ x, dir, hot }) => (
  <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 0 }}>
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 3, left: dir === -1 ? -3 : 0,
      background: `linear-gradient(180deg, ${rgba(V.volt, 0.3 * hot)}, ${rgba(V.bone, 0.68 * hot)} 44%, ${rgba(V.volt, 0.24 * hot)})`,
    }} />
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 118, left: dir === -1 ? -121 : 3,
      background: dir === -1
        ? `linear-gradient(270deg, ${rgba(V.bone, 0.15 * hot)}, rgba(0,0,0,0) 46%), linear-gradient(270deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`
        : `linear-gradient(90deg, ${rgba(V.bone, 0.15 * hot)}, rgba(0,0,0,0) 46%), linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`,
    }} />
  </div>
);
const CantoH: React.FC<{ y: number; x0: number; x1: number; hot: number }> = ({ y, x0, x1, hot }) => (
  <div style={{ position: "absolute", left: `${x0}%`, width: `${x1 - x0}%`, top: `${y}%`, height: 0 }}>
    <div style={{
      position: "absolute", left: 0, right: 0, height: 3, top: -3,
      background: `linear-gradient(90deg, ${rgba(V.sky, 0.2 * hot)}, ${rgba(V.bone, 0.6 * hot)} 50%, ${rgba(V.sky, 0.2 * hot)})`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, height: 94, top: -97,
      background: `linear-gradient(0deg, ${rgba(V.bone, 0.12 * hot)}, rgba(0,0,0,0) 60%), linear-gradient(0deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.58)})`,
    }} />
  </div>
);

// ── LA OCLUSIÓN (frontera C) — LA CARCASA DE LA CAJITA que cruza el cuadro ────────────────────
// Escrita a mano y no con `SeamOcclude` porque la materia importa: es plástico gris con RANURAS de
// ventilación, canto lamido por la luz y una etiqueta plateada. Entra desde fuera de cuadro, tapa
// el 100 % durante ~3 frames y se va. ⛔ El color es el del PLÁSTICO, nunca el del fondo.
const OcluyeCarcasa: React.FC<{ at: number; dur?: number }> = ({ at, dur = 26 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(112, -162, esOut(p));
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-22%", left: `${L.toFixed(2)}%`, width: "150%", height: "144%",
        transform: "rotate(5deg)",
        background:
          `linear-gradient(96deg, ${rgba(V.bone, 0.55)} 0%, rgba(255,255,255,0) 2.2%),` +
          `linear-gradient(180deg, ${PLASTICO} 0%, #6E7069 44%, #45463F 100%)`,
        boxShadow: `0 0 120px ${rgba(V.ink0, 0.9)}`,
        overflow: "hidden",
      }}>
        {/* las RANURAS de ventilación: la carcasa tiene materia, no es un rectángulo plano */}
        <div style={{
          position: "absolute", left: "6%", right: "6%", top: "18%", bottom: "18%",
          backgroundImage:
            `repeating-linear-gradient(90deg, ${rgba(V.ink0, 0.34)} 0px, ${rgba(V.ink0, 0.34)} 6px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 30px)`,
          opacity: 0.9,
        }} />
        {/* la etiqueta plateada atornillada a la carcasa */}
        <div style={{
          position: "absolute", left: "24%", top: "40%", width: "22%", height: "20%",
          background: `linear-gradient(160deg, #D8D8D0 0%, #A9A9A0 62%, #85857C 100%)`,
          boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.7)}, 0 6px 18px ${rgba(V.ink0, 0.6)}`,
        }} />
        {/* los tornillos y las vetas del molde */}
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", top: `${(6 + rnd(i * 4.7) * 84).toFixed(1)}%`,
            left: `${(4 + rnd(i * 2.3) * 84).toFixed(1)}%`,
            width: 12 + rnd(i * 8.1) * 10, height: 12 + rnd(i * 8.1) * 10, borderRadius: "50%",
            background: `radial-gradient(circle at 34% 30%, ${rgba(V.white, 0.5)}, ${rgba(V.ink0, 0.7)} 72%)`,
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── ASTILLAS DE HORMIGÓN (refuerzan el WIPE POR MATERIA de la frontera D) ─────────────────────
const Astillas: React.FC<{ at: number; dur?: number }> = ({ at, dur = 32 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 11 }, (_, i) => {
        const o = rnd(i * 3.7);
        const q = clamp01(p * 1.44 - o * 0.32);
        const x = lerp(-24, 130, esOut(q));
        const y = 4 + o * 84 + Math.sin(q * 3.4 + i) * 7;
        const rot = -30 + rnd(i * 9.3) * 60 + q * 210;
        const s = 70 + o * 190;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(1)}%`, top: `${y.toFixed(1)}%`,
            width: s, height: s * (0.34 + o * 0.4),
            transform: `rotate(${rot.toFixed(1)}deg) skewX(${(-10 + o * 20).toFixed(1)}deg)`,
            background: `linear-gradient(158deg, #A9A79C 0%, ${V.concrete} 46%, #4C4B45 100%)`,
            boxShadow: `0 22px 60px ${rgba(V.ink0, 0.82)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LOS ANILLOS QUE ENTRAN — la respuesta visual a "PRIMERO ESCUCHA" ──────────────────────────
// Todo el mundo dibuja "emitir" como círculos que SALEN. Escuchar es exactamente lo contrario: los
// anillos nacen fuera de cuadro y se CONTRAEN sobre la cajita hasta desaparecer adentro de ella.
// Van en FRÍO porque lo que busca es la red de la compañía (ley de dirección: lo que te cobran
// entra desde arriba y en frío). Es gráfica de apoyo ENCIMA del material real, nunca el objeto.
const AnillosQueEntran: React.FC<{
  g: number; at: number; cx: number; cy: number; n?: number; period?: number; color?: string; op?: number;
}> = ({ g, at, cx, cy, n = 5, period = 64, color = V.sky, op = 1 }) => {
  if (g < at || op <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const t = (((g - at) / period) + i / n) % 1;   // 0 = lejísimos · 1 = llega a la cajita
        const r = lerp(1020, 34, t);
        const a = (0.05 + 0.52 * t * t) * op;
        return (
          <div key={i} style={{
            position: "absolute", left: `${cx}%`, top: `${cy}%`,
            width: r * 2.1, height: r * 1.46, marginLeft: -r * 1.05, marginTop: -r * 0.73,
            borderRadius: "50%",
            border: `${(1 + t * 2.6).toFixed(2)}px solid ${rgba(color, a)}`,
            boxShadow: `0 0 ${(20 * t).toFixed(0)}px ${rgba(color, 0.34 * a)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── EL LATIDO DE LA RED (arriba, en frío) — y su MUERTE en el acto 4 ──────────────────────────
const LatidoRed: React.FC<{ g: number; y: number; vivo: number; op?: number }> = ({ g, y, vivo, op = 1 }) => {
  const W = 1920, MID = 60, amp = 40 * vivo;
  let d = "";
  for (let i = 0; i <= 192; i++) {
    const x = (i / 192) * W;
    const ph = ((x / 150) + g * 0.031) % 1;
    const spike = ph < 0.08 ? Math.sin((ph / 0.08) * Math.PI) : ph < 0.14 ? -0.36 * Math.sin(((ph - 0.08) / 0.06) * Math.PI) : 0;
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${(MID - amp * spike).toFixed(1)}`;
  }
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: `${y}%`, height: 120, opacity: op }}>
      <svg width="100%" height="120" viewBox="0 0 1920 120" preserveAspectRatio="none">
        <path d={d} fill="none" stroke={rgba(V.sky, 0.72)} strokeWidth={3} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 14px ${rgba(V.sky, 0.6)})` }} />
      </svg>
    </div>
  );
};

// ── LAS DOS ONDAS (acto 2) — gráfica de APOYO dibujada sobre el macro del silicio ─────────────
// La del panel arranca CONTINUA (línea casi plana con rizado) y se convierte en alterna; después
// engancha frecuencia (λ) y fase (φ) con la de la red hasta ser indistinguible. Al final las dos
// colapsan en UN punto de luz en el centro exacto del cuadro: por ahí entra la cámara.
const Ondas: React.FC<{ g: number }> = ({ g }) => {
  const amp = es(clamp01((g - 206) / 78));
  const lock = es(clamp01((g - 246) / 96));
  const col = es(clamp01((g - 366) / 28));
  const t = g * 0.086;
  const W = 1200, H = 520, MID = 260;
  const lamG = 264, lamP = lerp(796, 264, lock);
  const aG = 104 * (1 - col * 0.95);
  const aP = lerp(9, 104, amp) * (1 - col * 0.95);
  const phi = lerp(2.58, 0, lock);
  const d = (lam: number, a: number, ph: number) => {
    let s = "";
    for (let i = 0; i <= 150; i++) {
      const x = (i / 150) * W;
      s += `${i ? "L" : "M"}${x.toFixed(1)} ${(MID - a * Math.sin((x / lam) * Math.PI * 2 + t + ph)).toFixed(1)}`;
    }
    return s;
  };
  const marcas = clamp01((g - 296) / 22) * clamp01(1 - (g - 366) / 22);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, top: 0 }}>
      {/* el eje cero de la pantalla */}
      <path d={`M0 ${MID} L${W} ${MID}`} stroke={rgba(V.bone, 0.16)} strokeWidth={1.5} fill="none" />
      {/* LA RED: fría, la referencia que ya estaba ahí */}
      <path d={d(lamG, aG, 0)} fill="none" stroke={rgba(V.sky, 0.86)} strokeWidth={5} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 16px ${rgba(V.sky, 0.5)})` }} />
      {/* EL PANEL: verde-voltio, la que se convierte y se engancha */}
      <path d={d(lamP, aP, phi)} fill="none" stroke={rgba(V.volt, 0.95)} strokeWidth={6} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 22px ${rgba(V.volt, 0.6)})` }} />
      {/* el corchete de AMPLITUD (misma tensión) y el de PERÍODO (misma frecuencia) */}
      {marcas > 0.01 && (
        <g opacity={marcas}>
          <path d={`M132 ${MID - aP} L132 ${MID + aP} M120 ${MID - aP} L144 ${MID - aP} M120 ${MID + aP} L144 ${MID + aP}`}
            stroke={rgba(V.bone, 0.8)} strokeWidth={3} fill="none" />
          <path d={`M600 ${MID + 150} L${600 + lamP} ${MID + 150} M600 ${MID + 136} L600 ${MID + 164} M${600 + lamP} ${MID + 136} L${600 + lamP} ${MID + 164}`}
            stroke={rgba(V.bone, 0.8)} strokeWidth={3} fill="none" />
        </g>
      )}
      {/* EL NODO: las dos ondas colapsadas en un punto. Por acá entra la cámara (frontera B). */}
      {col > 0.02 && (
        <g>
          <circle cx={W / 2} cy={MID} r={10 + col * 26} fill={rgba(V.volt, 0.95 * col)} />
          <circle cx={W / 2} cy={MID} r={26 + col * 92} fill="none"
            stroke={rgba(V.volt, 0.5 * col)} strokeWidth={4} />
          <circle cx={W / 2} cy={MID} r={16 + col * 54} fill={rgba(V.volt, 0.22 * col)} />
        </g>
      )}
    </svg>
  );
};

// ── la cifra que VIAJA (Readout salta; esto se mueve con el objeto) ───────────────────────────
const Ticker: React.FC<{
  text: string; x: number; y: number; size: number; color: string; opacity?: number; scale?: number; unit?: string;
}> = ({ text, x, y, size, color, opacity = 1, scale = 1, unit }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    transform: `translate(-50%,-50%) scale(${scale.toFixed(3)})`,
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.9, color, opacity,
    whiteSpace: "nowrap",
    textShadow: `0 0 ${Math.round(size * 0.42)}px ${rgba(color, 0.4)}, 0 6px 26px rgba(0,0,0,0.94)`,
  }}>
    {text}
    {unit && <span style={{ fontSize: Math.round(size * 0.34), marginLeft: 9, color: rgba(color, 0.84) }}>{unit}</span>}
  </div>
);

// ── rótulo de escena (detalle ≥30 px, cama oscura obligatoria sobre el negro) ─────────────────
const Rotulo: React.FC<{ children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number }> = ({
  children, x, y, color = V.bone, size = 31, op = 1,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
  }}>{children}</div>
);

// ── cartel que ATERRIZA (nada arranca de cero: entra con desplazamiento y escala) ─────────────
const Cartel: React.FC<{
  g: number; at: number; out: number; x: number; y: number; size?: number; color?: string; children: React.ReactNode;
}> = ({ g, at, out, x, y, size = 40, color = V.white, children }) => {
  const inP = es(clamp01((g - at) / 13));
  const outP = clamp01((g - out) / 15);
  if (g < at || outP >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateY(${((1 - inP) * 30 + outP * 24 + Math.sin(g / 57) * 2.2).toFixed(1)}px) ` +
        `scale(${(0.9 + 0.1 * inP - outP * 0.06).toFixed(3)})`,
      opacity: Math.min(1, inP * 1.6) * (1 - outP),
    }}>
      <Bed pad={20}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 1.8, color,
          textTransform: "uppercase", lineHeight: 1.08, whiteSpace: "nowrap",
          textShadow: "0 4px 18px rgba(0,0,0,0.95)",
        }}>{children}</div>
      </Bed>
    </div>
  );
};

// ── LA CAJITA GRIS, frame a frame. UN SOLO objeto del frame 6 al 414. ─────────────────────────
// Sube de la mesa de taller → se estaciona en el tercio izquierdo (ventana W1) → vuelve al centro →
// GIRA 180° sobre su eje Y (frontera A · MATCH-SHAPE) → crece hasta ser la pantalla de las ondas.
const cajaAt = (g: number) => {
  const inn = es(clamp01((g - 6) / 42));
  const park = es(clamp01((g - 54) / 44));
  const back = es(clamp01((g - 148) / 32));
  const grow = es(clamp01((g - 198) / 46));
  const flip = clamp01((g - 172) / 34);            // 90° (el canto, la bisagra real) cae en 189
  const w = lerp(lerp(lerp(596, 380, park), 764, back), 1240, grow);
  const h = lerp(lerp(lerp(352, 230, park), 452, back), 540, grow);
  const x = lerp(lerp(lerp(50, 17.5, park), 50, back), 50, grow);
  const y = lerp(lerp(lerp(124, 47, inn), 47, park), 45, back);
  const ry = lerp(lerp(lerp(-17, 12, park), -4, back), 0, grow) + flip * 180;
  const rx = lerp(lerp(6, -3, park), 3, back);
  return { w, h, x, y, ry, rx, flip, park, grow };
};

// MediaCard tiene deriva propia (hold VIVO). Lo que se apoya ENCIMA de una MediaCard tiene que
// derivar exactamente igual o la gráfica patina sobre el material.
const mcSync = (cf: number, x: number, y: number): React.CSSProperties => ({
  transform: `rotateY(${(Math.sin(cf / 67 + y) * 0.5).toFixed(3)}deg) translateY(${(Math.sin(cf / 41 + x) * 2.4).toFixed(2)}px)`,
});

// ── LA CÁMARA · una sola función de g, con deriva viva, que NUNCA vuelve a cero ───────────────
const KF = [A1, 120, A2, 300, 396, 414, 505, 620, 700, 790, SW4, 878, 950, 1020, 1090, 1180, SW5, 1352, 1500, G_END];
const camAt = (g: number) => {
  const base = gcam(g, { z0: -260, z1: 520, panX: -196, panY: 18, ry: -5.4, rx: 1.8, dur: G_END });
  const crane = interpolate(
    g, KF,
    [-16, -34, -48, -26, -6, -2, 24, 48, 28, 6, -14, -28, -48, -76, -50, -16, 10, 34, 76, 120],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g, KF,
    [1.14, 1.04, 1.09, 1.02, 1.0, 1.36, 1.12, 1.04, 1.10, 1.18, 1.06, 1.12, 1.22, 1.30, 1.06, 1.02, 1.10, 1.02, 1.06, 1.0],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const fx = interpolate(g, [A1, A2, 396, 505, 700, SW4, 1020, SW5, G_END], [46, 50, 50, 62, 40, 48, 44, 52, 56], CL);
  const fy = interpolate(g, [A1, A2, 396, 505, 700, SW4, 1020, SW5, G_END], [58, 45, 45, 40, 52, 50, 44, 48, 42], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS2Micro: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;      // pasa un frame mío al reloj interno de las primitivas

  // ── LA LUZ: función continua de g. Evoluciona, nunca salta entre actos. Entra en HORA.taller y
  //    sale en HORA.mediodia, pasando por la penumbra de la escucha y la tormenta del apagón. ──
  const sunAng = interpolate(
    g, [A1, A2, 300, A3, 505, 700, SW4, 1000, 1080, SW5, 1400, G_END],
    [HORA.taller.ang, 30, HORA.limpio.ang, 16, HORA.penumbra.ang, 22, HORA.tormenta.ang, -26,
      12, HORA.papel.ang, 78, HORA.mediodia.ang], CL,
  );
  const amb = interpolate(
    g, [A1, 12, A2, 300, A3, 505, 620, 700, 800, SW4, 878, 990, 1060, SW5, 1330, 1520, G_END],
    [0.34, HORA.taller.amb, 0.50, HORA.limpio.amb, 0.44, HORA.penumbra.amb, 0.18, 0.42, 0.60, 0.34,
      HORA.tormenta.amb, 0.12, 0.30, 0.62, HORA.papel.amb, 0.90, HORA.mediodia.amb], CL,
  );
  // pesos de los tres soles: cálido (lo que te queda) · frío (lo que te cobran) · blanco (el día)
  const warmW = interpolate(g, [A1, A2, 300, A3, 560, 700, 800, SW4, 900, 1020, 1120, SW5, G_END],
    [0.94, 0.72, 0.42, 0.3, 0.14, 0.5, 0.86, 0.6, 0.1, 0.34, 0.56, 0.4, 0.24], CL);
  const coldW = interpolate(g, [A1, A2, 300, A3, 560, 700, 800, SW4, 900, 1020, SW5, G_END],
    [0.1, 0.26, 0.48, 0.62, 0.86, 0.7, 0.34, 0.62, 0.8, 0.46, 0.24, 0.12], CL);
  const dayW = interpolate(g, [A1, A2, 300, A3, SW4, 1020, SW5, 1400, G_END],
    [0.06, 0.2, 0.42, 0.24, 0.04, 0.2, 0.62, 0.9, 1.0], CL);
  const coolMix = interpolate(g, [A1, A2, A3, 560, 700, SW4, 900, 1060, SW5, G_END],
    [0.02, 0.16, 0.55, 0.82, 0.5, 0.7, 0.92, 0.42, 0.14, 0.04], CL);
  const keyFrom = interpolate(g, [A1, A2, A3, 620, SW4, 1020, SW5, G_END],
    [0.18, 0.34, 0.56, 0.68, 0.3, 0.24, 0.62, 0.78], CL);
  const inten = interpolate(g, [A1, 12, A2, A3, 600, 690, 800, SW4, 900, 1000, 1020, SW5, G_END],
    [0.7, 1.0, 1.0, 0.94, 0.55, 0.7, 1.06, 0.72, 0.4, 0.44, 1.06, 1.0, 0.94], CL);
  const floorDim = interpolate(g, [A1, A2, A3, 620, SW4, 940, 1020, SW5, G_END],
    [0.58, 0.54, 0.66, 0.82, 0.8, 0.86, 0.66, 0.52, 0.44], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const clip = clipOf(cov);
  const cantoHot = cov.open ? clamp01((cov.gR - cov.gL) / 24) : 0;

  // ── FRONTERA B · ZOOM-THROUGH. El acto 3 se monta 20 f antes, DEBAJO: un zoom-through contra
  //    nada es un fundido a negro. El punto de fuga es el NODO de las ondas: 50 % / 45 %.
  const zw = g >= 392 && g < 418 ? zoomThrough(g, 392, 20, 50, 45) : null;
  const zs: React.CSSProperties = zw
    ? { transform: zw.out, opacity: zw.opacity, transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d" };

  const a1 = g < A2 + 26;                 // la cajita cruza la frontera A girando
  const a2 = g >= A2 - 40 && g < 418;
  const a3 = g >= 374 && g < SW4;         // se monta 20 f antes del zoom-through
  const a4 = g >= SW4 && g < SW5;
  const a5 = g >= SW5 - 4;

  const cj = cajaAt(g);
  const verCaja = g < 418;

  // ACTO 2 · el desfase que se va a cero
  const lock2 = es(clamp01((g - 246) / 96));
  const desfase = Math.round(lerp(148, 0, lock2));

  // ACTO 3 · la escucha, y el momento en que ENCUENTRA la red
  const escucha = clamp01((g - 560) / 24) * clamp01(1 - (g - 700) / 20);
  const hallada = clamp01((g - 689) / 10);
  const empuja = es(clamp01((g - 700) / 46));

  // ACTO 4 · el MATCH-MOVE del led (mismo encuadre, led al revés) y su golpe mecánico
  const clack = g >= 878 && g < 881 ? 1 - (g - 878) / 3 : 0;
  const redViva = clamp01(1 - (g - 846) / 22);

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          la apertura recorta. Ni un solo píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* la atmósfera se monta UNA vez para los 53 s: nunca se remonta entre actos */}
        <VoltAtmos
          tint={light(coolMix, "volt", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* el SOL es un personaje: su ángulo marca la hora. El FRÍO entra siempre desde arriba. */}
        <SunKey ang={sunAng} temp="torch" amb={warmW * amb} soft={66} />
        <SunKey ang={98} temp="sky" amb={coldW * amb * 0.82} soft={78} />
        <SunKey ang={sunAng} temp="white" amb={dayW * amb * 0.7} soft={84} />

        <Layers cam={cam}>
          {/* ── ACTO 3 (fondo) · se monta ANTES del zoom-through para que nunca haya negro ──── */}
          {a3 && (
            <Plane z={-840}>
              {/* salimos del túnel DENTRO del enchufe de la pared: la escala se abre de 1,92 a 1,2 */}
              <PhotoPlane src="img/cmepanel30/cmep30_s1_enchufe_pared_exterior.png" kind="photo" z={0}
                scale={interpolate(g, [392, 470, 700, SW4], [1.92, 1.24, 1.2, 1.3], CL)}
                dim={interpolate(g, [392, 470, 600, 700, SW4], [0.36, 0.6, 0.76, 0.58, 0.5], CL)}
                tint={V.sky} />
            </Plane>
          )}

          {/* ── ACTOS 1 y 2 (fondo) · LA MESA DE TALLER. Un solo fondo para los dos actos: lo que
              cambia entre ellos es la luz y la cajita, no el mundo. Se lo lleva el zoom-through. ── */}
          {(a1 || a2) && (
            <AbsoluteFill style={zs}>
              <Plane z={-820}>
                <PhotoPlane src="img/cmepanel30/cmep30_s2_caja_abierta_contenido.png" kind="photo" z={0}
                  scale={interpolate(g, [A1, A2, A3], [1.3, 1.2, 1.16], CL)}
                  dim={interpolate(g, [A1, 16, 160, A2, 300, 392], [0.56, 0.44, 0.42, 0.5, 0.62, 0.72], CL)}
                  tint={V.amber} />
              </Plane>
              <Plane z={-520}>
                {/* el aire del taller: polvo que sube contra la luz rasante (hold vivo del fondo) */}
                {Array.from({ length: 12 }, (_, i) => {
                  const o = rnd(i * 5.1);
                  const yy = ((rnd(i * 2.9) * 100 - (g * (0.3 + o * 0.5)) / 9) % 104 + 104) % 104;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${(6 + rnd(i * 7.3) * 88).toFixed(1)}%`, top: `${yy.toFixed(1)}%`,
                      width: 1.5, height: 36 + o * 88,
                      background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.torch, 0.12 + o * 0.1)}, rgba(0,0,0,0))`,
                    }} />
                  );
                })}
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTO 4 (fondo) · EL LED. Los dos clips son el MISMO encuadre con el led al revés:
              el corte del frame 878 es un MATCH-MOVE, no se mueve un solo píxel. ─────────────── */}
          {a4 && (
            <>
              {g < 878 && (
                <Plane z={-820}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s2_clip_cajita_led_arranca.mp4" kind="video"
                    z={0} startFrom={0} scale={1.22} dim={0.3} tint={V.sky} />
                </Plane>
              )}
              {g >= 878 && g < 1020 && (
                <Plane z={-820}>
                  <div style={{ position: "absolute", inset: 0, transform: `scale(${(1 + clack * 0.016).toFixed(4)})` }}>
                    <PhotoPlane src="broll/cmepanel30/cmep30_s2_clip_cajita_led_apaga.mp4" kind="video"
                      z={0} startFrom={0} scale={1.22}
                      dim={interpolate(g, [878, 900, 950, 1018], [0.3, 0.5, 0.66, 0.7], CL)} tint={V.sky} />
                  </div>
                </Plane>
              )}
              {/* CORTE EN EL BEAT @1020 — el operario del poste, a sangre, sin transición */}
              {g >= 1020 && g < 1090 && (
                <Plane z={-840}>
                  <PhotoPlane src="broll/cmepanel30/cmep30_s2_clip_operario_poste.mp4" kind="video"
                    z={0} startFrom={0} scale={1.2}
                    dim={interpolate(g, [1020, 1046, 1088], [0.24, 0.34, 0.44], CL)} tint={V.amber} />
                </Plane>
              )}
              {g >= 1090 && (
                <Plane z={-840}>
                  <PhotoPlane src="img/cmepanel30/cmep30_s2_poste_calle_operario.png" kind="photo"
                    z={0} scale={interpolate(g, [1090, SW5], [1.3, 1.2], CL)}
                    dim={interpolate(g, [1090, 1140, SW5], [0.56, 0.5, 0.6], CL)} tint={V.amber} />
                </Plane>
              )}
              {/* EL LATIDO DE LA RED, arriba y en frío. Se aplana en el frame 868: se cayó. */}
              <Plane z={-320}>
                <LatidoRed g={g} y={5} vivo={redViva} op={clamp01(1 - (g - 950) / 24) * clamp01((g - SW4) / 10)} />
              </Plane>
            </>
          )}

          {/* ── ACTO 5 (fondo) · el banco con la etiqueta, y después el EXTERIOR que baja ────── */}
          {a5 && (
            <>
              <Plane z={-840}>
                <PhotoPlane src="img/cmepanel30/cmep30_s2_claudio_advierte_etiqueta.png" kind="photo" z={0}
                  scale={interpolate(g, [SW5, 1400, 1546], [1.28, 1.2, 1.16], CL)}
                  dim={interpolate(g, [SW5, 1300, 1400, 1500], [0.68, 0.52, 0.56, 0.62], CL)} tint={V.amber} />
              </Plane>
              {/* EL EXTERIOR baja desde arriba como un telón: así aterrizamos afuera, en mediodía,
                  con el enchufe de la pared exterior como materia saliente. */}
              {g >= 1494 && (
                <Plane z={-700}>
                  <div style={{
                    position: "absolute", inset: 0,
                    transform: `translateY(${lerp(-104, 0, esOut(clamp01((g - 1494) / 50))).toFixed(2)}%)`,
                  }}>
                    <PhotoPlane src="img/cmepanel30/cmep30_s1_enchufe_pared_exterior.png" kind="photo" z={0}
                      scale={interpolate(g, [1494, 1546, G_END], [1.34, 1.22, 1.08], CL)}
                      dim={interpolate(g, [1494, 1560, G_END], [0.34, 0.22, 0.16], CL)} tint={V.white} />
                    {/* el canto de la placa que baja: la luz lame el borde, no es una máscara */}
                    <div style={{
                      position: "absolute", left: 0, right: 0, bottom: -4, height: 4,
                      background: `linear-gradient(90deg, ${rgba(V.white, 0.3)}, ${rgba(V.bone, 0.86)} 48%, ${rgba(V.white, 0.3)})`,
                    }} />
                  </div>
                </Plane>
              )}
            </>
          )}
        </Layers>
      </AbsoluteFill>

      {/* los cantos de la apertura: el brillo sale SIEMPRE hacia el mundo, jamás hacia la cara */}
      {cov.open && (
        <>
          <CantoV x={cov.gL} dir={-1} hot={cantoHot} />
          <CantoV x={cov.gR} dir={1} hot={cantoHot} />
          {cov.sh > 0.5 && cov.sh < 99 && <CantoH y={cov.sh} x0={cov.gL} x1={cov.gR} hot={cantoHot} />}
        </>
      )}

      {/* ════ EL PRIMER PLANO — no está recortado. Mientras la apertura esté ABIERTA todo esto vive
          en x<26 % o x>74 %: nunca en la caja de la cara, nunca sobre boca ni mentón. ════ */}
      <Layers cam={cam}>

        {/* ═══ LA CAJITA GRIS · UN SOLO objeto del frame 6 al 414. Cruza la frontera A girando. ══ */}
        {verCaja && (
          <AbsoluteFill style={zs}>
            <Plane z={110}>
              <div style={{
                position: "absolute", left: `${cj.x.toFixed(3)}%`, top: `${cj.y.toFixed(3)}%`,
                width: cj.w, height: cj.h, marginLeft: -cj.w / 2, marginTop: -cj.h / 2,
                transform: `rotateY(${cj.ry.toFixed(2)}deg) rotateX(${cj.rx.toFixed(2)}deg)`,
                transformStyle: "preserve-3d",
              }}>
                {/* CARA DE ADELANTE · la cajita gris en la mano (material real) */}
                <div style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}>
                  <MediaCard src="img/cmepanel30/cmep30_s2_claudio_sostiene_cajita.png" kind="photo"
                    w={cj.w} h={cj.h} x={50} y={50} z={0} lit={1} litColor={V.amber}
                    label={g >= 22 && g < 168 ? "EL MICROINVERSOR" : undefined}
                    sheenAt={toCF(30)} radius={12} />
                </div>
                {/* CARA DE ATRÁS · la MISMA cajita: el macro del silicio del panel, y encima las dos
                    ondas dibujadas. La gráfica es capa de APOYO; el material real es la foto. */}
                <div style={{
                  position: "absolute", inset: 0, transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}>
                  <MediaCard src="img/cmepanel30/cmep30_s2_vidrio_silicio_macro.png" kind="photo"
                    w={cj.w} h={cj.h} x={50} y={50} z={0} lit={0.9} litColor={V.volt}
                    sheenAt={toCF(214)} radius={12} />
                  <div style={{ position: "absolute", inset: 0, ...mcSync(cf, 50, 50) }}>
                    <Ondas g={g} />
                    {/* las dos etiquetas de las ondas, adentro de la pantalla */}
                    {g >= 214 && g < 372 && (
                      <>
                        <Rotulo x={20} y={11} color={rgba(V.sky, 0.95)} size={30}
                          op={clamp01((g - 214) / 12) * clamp01(1 - (g - 358) / 12)}>
                          LA DE TU PARED
                        </Rotulo>
                        <Rotulo x={20} y={89} color={rgba(V.volt, 0.95)} size={30}
                          op={clamp01((g - 226) / 12) * clamp01(1 - (g - 358) / 12)}>
                          LA DEL PANEL
                        </Rotulo>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Plane>
          </AbsoluteFill>
        )}

        {/* ═══ ACTO 1 · LA CAJITA GRIS ═════════════════════════════════════════════════════════ */}
        {a1 && (
          <AbsoluteFill style={zs}>
            {/* la mano que la hace girar — entra cuando se abre la ventana, siempre en el tercio */}
            <Plane z={150}>
              {g >= 46 && g < 160 && (
                <MediaCard src="broll/cmepanel30/cmep30_s2_clip_gira_cajita_mano.mp4" kind="video"
                  w={352} h={212}
                  x={lerp(112, 86, es(clamp01((g - 46) / 34))) + lerp(0, 28, es(clamp01((g - 140) / 20)))}
                  y={27} z={0} ry={-13} rx={2} startFrom={8} lit={1} litColor={V.volt}
                  label="MÁS CHICA QUE UN LADRILLO" sheenAt={toCF(84)} radius={10} />
              )}
            </Plane>

            {/* "Y hace dos cosas" — dos números con su ícono, como objetos de la escena. La 1 se
                enciende en el frame 126 ("la primera la entiende cualquiera"); la 2 queda apagada. */}
            <Plane z={170}>
              {g >= 74 && g < 172 && (() => {
                const uno = clamp01((g - 126) / 14);
                const op = clamp01((g - 74) / 12) * clamp01(1 - (g - 158) / 14);
                return (
                  <>
                    <IconPng src="img/cmepanel30/cmep30_ic_rayo.png" x={82} y={53}
                      size={lerp(0, 74, es(clamp01((g - 78) / 16)))} z={0} opacity={op * (0.5 + 0.5 * uno)} glow={V.ink0} />
                    <div style={{
                      position: "absolute", left: "82%", top: "63%", transform: `translate(-50%,-50%) scale(${(1 + uno * 0.14).toFixed(3)})`,
                      opacity: op,
                    }}>
                      <Num size={92} color={uno > 0.4 ? V.volt : rgba(V.bone, 0.5)}>1</Num>
                    </div>
                    <IconPng src="img/cmepanel30/cmep30_ic_lupa.png" x={92} y={53}
                      size={lerp(0, 74, es(clamp01((g - 92) / 16)))} z={0} opacity={op * 0.42} glow={V.ink0} />
                    <div style={{
                      position: "absolute", left: "92%", top: "63%", transform: "translate(-50%,-50%)", opacity: op,
                    }}>
                      <Num size={92} color={rgba(V.bone, 0.4)}>2</Num>
                    </div>
                  </>
                );
              })()}
            </Plane>

            {/* EL TEXTO DEL ACTO — en el tercio izquierdo, bien lejos de su boca */}
            <Plane z={90}>
              <Cartel g={g} at={74} out={150} x={16} y={80} size={44} color={V.white}>
                HACE<br />DOS COSAS
              </Cartel>
            </Plane>
          </AbsoluteFill>
        )}

        {/* ═══ ACTO 2 · LO QUE HACE CUALQUIERA ═════════════════════════════════════════════════ */}
        {a2 && (
          <AbsoluteFill style={zs}>
            {/* los dos extremos del trabajo, con material real: por dónde ENTRA y por dónde SALE.
                La pared es "lo que te cobran": entra desde ARRIBA y en FRÍO. */}
            <Plane z={200}>
              {g >= 208 && g < 372 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_cajita_dos_cables.png" kind="photo"
                  w={332} h={200}
                  x={lerp(-14, 15, es(clamp01((g - 208) / 32))) - lerp(0, 30, es(clamp01((g - 352) / 22)))}
                  y={81} z={0} ry={12} rx={-2} lit={1} litColor={V.volt}
                  label="DOS CABLES" sheenAt={toCF(244)} radius={10} />
              )}
              {g >= 232 && g < 372 && (() => {
                const fl = flujo("cobran", clamp01((g - 232) / 32));
                return (
                  <MediaCard src="img/cmepanel30/cmep30_s1_enchufe_pared_exterior.png" kind="photo"
                    w={332} h={200} x={85}
                    y={81 + pc(fl.dy) + lerp(0, 28, es(clamp01((g - 352) / 22)))}
                    z={0} ry={-12} rx={2} lit={0.95} litColor={V.sky}
                    label="TU PARED" sheenAt={toCF(268)} radius={10} />
                );
              })()}
            </Plane>

            {/* EL DESFASE que se va a cero: el dato que prueba que se sincronizó */}
            <Plane z={230}>
              {g >= 262 && g < 372 && (
                <Ticker
                  text={desfase > 0 ? `${desfase}°` : "EN FASE"}
                  x={50} y={16}
                  size={desfase > 0 ? 96 : 82}
                  color={desfase > 0 ? V.sky : V.volt}
                  opacity={clamp01((g - 262) / 12) * clamp01(1 - (g - 358) / 14)}
                />
              )}
              {g >= 268 && g < 358 && (
                <Rotulo x={50} y={23} color={rgba(V.bone, 0.8)} size={30}
                  op={clamp01((g - 268) / 12) * clamp01(1 - (g - 344) / 14)}>
                  DESFASE CON LA RED
                </Rotulo>
              )}
            </Plane>

            {/* EL TEXTO DEL ACTO — la apertura está CERRADA, puede vivir abajo y centrado */}
            <Plane z={220}>
              {g >= 300 && g < 372 && (
                <div style={{
                  position: "absolute", left: "50%",
                  top: `${lerp(90, 87, es(clamp01((g - 300) / 24))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", textAlign: "center",
                  opacity: clamp01((g - 300) / 11) * clamp01(1 - (g - 358) / 14),
                }}>
                  <Head size={56} color={V.white}>MISMA TENSIÓN · MISMA FRECUENCIA</Head>
                </div>
              )}
            </Plane>
          </AbsoluteFill>
        )}

        {/* ═══ ACTO 3 · PRIMERO ESCUCHA ════════════════════════════════════════════════════════ */}
        {a3 && g >= A3 && (
          <>
            {/* ── la ventana W2: "la segunda es la que casi nadie explica" ─────────────────── */}
            <Plane z={160}>
              {g >= 436 && g < 552 && (
                <MediaCard src="broll/cmepanel30/cmep30_s2_clip_cajita_gira_gancho.mp4" kind="video"
                  w={352} h={212}
                  x={lerp(112, 86, es(clamp01((g - 436) / 32))) + lerp(0, 28, es(clamp01((g - 532) / 20)))}
                  y={40} z={0} ry={-13} rx={2} startFrom={6} lit={0.9} litColor={V.sky}
                  label="LA MISMA CAJITA" sheenAt={toCF(474)} radius={10} />
              )}
              {g >= 452 && g < 552 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_claudio_explica_cajita.png" kind="photo"
                  w={336} h={202}
                  x={lerp(-14, 13, es(clamp01((g - 452) / 32))) - lerp(0, 30, es(clamp01((g - 532) / 20)))}
                  y={64} z={0} ry={12} rx={-2} lit={0.86} litColor={V.sky}
                  label="LA SEGUNDA" sheenAt={toCF(496)} radius={10} />
              )}
              {g >= 440 && g < 546 && (
                <div style={{
                  position: "absolute", left: "13%", top: "26%",
                  transform: `translate(-50%,-50%) scale(${(1 + (1 - clamp01((g - 440) / 12)) * 0.16).toFixed(3)})`,
                  opacity: clamp01((g - 440) / 12) * clamp01(1 - (g - 532) / 14),
                }}>
                  <Num size={148} color={V.volt}>2</Num>
                </div>
              )}
              <Cartel g={g} at={462} out={534} x={13} y={40} size={36} color={rgba(V.bone, 0.95)}>
                CASI NADIE<br />LA EXPLICA
              </Cartel>
            </Plane>

            {/* ── LA ESCUCHA. La apertura ya bajó: pantalla entera, silencio visual, atención.
                La cajita colgada del gancho, quieta y apagada; y los anillos que ENTRAN. ────── */}
            <Plane z={40}>
              <AnillosQueEntran g={g} at={556} cx={31} cy={54} n={5} period={64} color={V.sky}
                op={escucha * 0.95} />
              {/* el último anillo del apagón del acto 4 muere solo: acá todavía encuentra algo */}
            </Plane>
            <Plane z={120}>
              {g >= 566 && g < 700 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_cajita_gris_gancho.png" kind="photo"
                  w={560} h={336} x={31}
                  y={lerp(74, 54, es(clamp01((g - 566) / 40)))}
                  z={0} ry={10} rx={-2} lit={0.5} litColor={V.sky}
                  label="TODAVÍA NO EMPUJA NADA" sheenAt={toCF(618)} radius={12} />
              )}
              {/* el enchufe que está escuchando: ícono en frío, arriba a la derecha */}
              {g >= 578 && g < 720 && (
                <IconPng src="img/cmepanel30/cmep30_ic_enchufe.png" x={74} y={30}
                  size={lerp(0, 104, es(clamp01((g - 578) / 18)))} z={0}
                  opacity={0.9 * clamp01(1 - (g - 706) / 14)} glow={V.ink0} />
              )}
              {g >= 596 && g < 700 && (
                <Readout value="0" unit="W" label="MIENTRAS ESCUCHA" at={toCF(596)}
                  x={76} y={62} size={128} color={V.sky} />
              )}
            </Plane>

            {/* EL TEXTO DEL ACTO — 3,7 s en pantalla completa, muy por encima del piso de lectura */}
            <Plane z={220}>
              {g >= 578 && g < 690 && (
                <div style={{
                  position: "absolute", left: "50%",
                  top: `${(87 + Math.sin(g / 61) * 0.4).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", textAlign: "center",
                  opacity: clamp01((g - 578) / 12) * clamp01(1 - (g - 676) / 14),
                }}>
                  <Head size={70} color={V.white}>PRIMERO <span style={{ color: V.volt }}>ESCUCHA</span></Head>
                </div>
              )}
            </Plane>

            {/* ── ENCUENTRA LA RED Y EMPIEZA A EMPUJAR. Lo que te QUEDA entra desde ABAJO y en
                CÁLIDO: la cajita se enciende y los rayos suben hacia el enchufe. ───────────── */}
            {g >= 689 && (
              <>
                <Plane z={60}>
                  {/* el único anillo que SALE: la red contestó */}
                  {hallada > 0 && hallada < 1.6 && (
                    <div style={{
                      position: "absolute", left: "74%", top: "30%",
                      width: lerp(40, 1500, esOut(clamp01((g - 689) / 30))),
                      height: lerp(28, 1050, esOut(clamp01((g - 689) / 30))),
                      marginLeft: -lerp(20, 750, esOut(clamp01((g - 689) / 30))),
                      marginTop: -lerp(14, 525, esOut(clamp01((g - 689) / 30))),
                      borderRadius: "50%",
                      border: `${lerp(6, 1, clamp01((g - 689) / 30)).toFixed(1)}px solid ${rgba(V.sky, 0.7 * clamp01(1 - (g - 689) / 32))}`,
                    }} />
                  )}
                </Plane>
                <Plane z={130}>
                  {g >= 700 && (
                    <MediaCard src="broll/cmepanel30/cmep30_s2_clip_cajita_led_arranca.mp4" kind="video"
                      w={lerp(560, 940, empuja)} h={lerp(336, 564, empuja)}
                      x={lerp(31, 38, empuja)} y={lerp(54, 50, empuja)}
                      z={0} ry={lerp(10, 4, empuja)} rx={-2} startFrom={0} lit={1} litColor={V.volt}
                      label="AHORA SÍ" sheenAt={toCF(744)} radius={12} />
                  )}
                </Plane>
                {/* los rayos que suben, cálidos, desde abajo hacia el enchufe */}
                <Plane z={240}>
                  {Array.from({ length: 5 }, (_, i) => {
                    const t = clamp01((g - 716 - i * 15) / 68);
                    if (t <= 0 || t >= 1) return null;
                    const e = esOut(t);
                    return (
                      <IconPng key={i} src="img/cmepanel30/cmep30_ic_rayo.png"
                        x={lerp(40 + rnd(i * 4.4) * 8, 74, e)} y={lerp(96, 32, e)}
                        size={lerp(28, 72, e)} z={0}
                        opacity={0.92 * Math.sin(t * Math.PI)} rot={lerp(-16, 6, e)} glow={V.amber} />
                    );
                  })}
                </Plane>
                <Plane z={200}>
                  {g >= 742 && (() => {
                    const fl = flujo("queda", clamp01((g - 742) / 32));
                    return (
                      <Readout value="310" unit="W" label="AHORA SÍ EMPUJA" at={toCF(742)}
                        x={79} y={64 + pc(fl.dy)} size={132} color={V.amber} />
                    );
                  })()}
                  {g >= 768 && (
                    <Rotulo x={79} y={78} color={rgba(V.amber, 0.95)} size={31} op={clamp01((g - 768) / 14)}>
                      SE SINCRONIZÓ
                    </Rotulo>
                  )}
                </Plane>
              </>
            )}
          </>
        )}

        {/* ═══ ACTO 4 · SI NO HAY RED, SE APAGA ════════════════════════════════════════════════ */}
        {a4 && (
          <>
            {/* la red que se cae — arriba y en frío, como manda la ley de dirección */}
            <Plane z={210}>
              {g >= 842 && g < 934 && (
                <Rotulo x={50} y={13} color={rgba(V.sky, 0.95)} size={34}
                  op={clamp01((g - 842) / 12) * clamp01(1 - (g - 916) / 16)}>
                  LA RED SE CAYÓ
                </Rotulo>
              )}
            </Plane>

            {/* el último anillo de escucha: sale, no encuentra nada, y se muere */}
            <Plane z={50}>
              <AnillosQueEntran g={g} at={884} cx={48} cy={50} n={3} period={70} color={V.sky}
                op={clamp01((g - 884) / 16) * clamp01(1 - (g - 946) / 20) * 0.5} />
            </Plane>

            {/* EL LED APAGADO: la cifra que cae a cero, entrando desde abajo (es lo que te queda:
                nada). Golpe mecánico de 3 frames en el corte del MATCH-MOVE. */}
            <Plane z={190}>
              {g >= 892 && g < 1016 && (
                <Readout value="0" unit="W" label="SE APAGA SOLO" at={toCF(892)}
                  x={24} y={70} size={148} color={rgba(V.bone, 0.86)} />
              )}
              {g >= 900 && g < 1014 && (
                <IconPng src="img/cmepanel30/cmep30_ic_foco.png" x={24} y={50}
                  size={lerp(0, 92, es(clamp01((g - 900) / 16)))} z={0}
                  opacity={0.5 * clamp01(1 - (g - 998) / 14)} glow={V.ink0} />
              )}
            </Plane>

            {/* LA ETIQUETA: el término está IMPRESO en la cajita. Material real con el término
                escrito con tipografía de verdad encima (ningún motor de imagen escribe texto). */}
            <Plane z={140}>
              {g >= 946 && g < 1018 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_etiqueta_cajita.png" kind="photo"
                  w={720} h={420} x={72}
                  y={lerp(120, 48, es(clamp01((g - 946) / 34)))}
                  z={0} ry={-9} rx={3} lit={1} litColor={V.volt}
                  label="ESTÁ IMPRESO EN LA CAJA" sheenAt={toCF(992)} radius={12} />
              )}
              {g >= 972 && g < 1018 && (
                <IconPng src="img/cmepanel30/cmep30_ic_sello.png" x={90} y={30}
                  size={lerp(0, 96, es(clamp01((g - 972) / 14)))} z={0}
                  opacity={0.95} rot={-11} glow={V.ink0} />
              )}
            </Plane>

            {/* ── LA BISAGRA DEL CORTE EN EL BEAT @1020. Esta palabra está en la MISMA x, y y
                tamaño a los dos lados del corte durante 20 frames: es lo que impide que el corte
                se lea como un salto. Recién en 1040 se va al tercio izquierdo. ─────────────── */}
            {g >= 950 && g < 1226 && (() => {
              const irse = es(clamp01((g - 1040) / 26));
              const op = clamp01((g - 950) / 12) * clamp01(1 - (g - 1210) / 16);
              return (
                <Plane z={250}>
                  <div style={{
                    position: "absolute", left: `${lerp(31, 15, irse).toFixed(2)}%`,
                    top: `${lerp(26, 15, irse).toFixed(2)}%`,
                    transform: `translate(-50%,-50%) translateY(${(Math.sin(g / 59) * 2).toFixed(2)}px)`,
                    opacity: op, textAlign: "center",
                  }}>
                    <Bed pad={lerp(24, 16, irse)}>
                      <Head size={lerp(68, 40, irse)} color={V.volt}>ANTI-ISLANDING</Head>
                      <div style={{ marginTop: 8, opacity: 1 - irse }}>
                        <Body size={32} color={rgba(V.bone, 0.92)}>si no hay red, no arranca</Body>
                      </div>
                    </Bed>
                  </div>
                </Plane>
              );
            })()}

            {/* ── EL PAGO: hay una persona real del otro lado ───────────────────────────────── */}
            {g >= 1026 && (
              <>
                <Plane z={150}>
                  {g >= 1090 && (
                    <MediaCard src="broll/cmepanel30/cmep30_s2_clip_operario_poste.mp4" kind="video"
                      w={362} h={218}
                      x={lerp(114, 87, es(clamp01((g - 1090) / 32)))}
                      y={34} z={0} ry={-12} rx={2} startFrom={0} lit={1} litColor={V.amber}
                      label="EL DE LA ESQUINA" sheenAt={toCF(1136)} radius={10} />
                  )}
                  {g >= 1118 && (
                    <MediaCard src="img/cmepanel30/cmep30_s1_enchufe_pared_exterior.png" kind="photo"
                      w={344} h={208}
                      x={lerp(-14, 13, es(clamp01((g - 1118) / 32)))}
                      y={44} z={0} ry={12} rx={-2} lit={0.9} litColor={V.sky}
                      label="EL CABLE QUE DEVUELVE" sheenAt={toCF(1164)} radius={10} />
                  )}
                </Plane>

                {/* el sello VERDE sobre el cable: lo que devuelve corriente, con la caja apagada,
                    no lastima a nadie. El ícono entra rotando y se clava. */}
                <Plane z={230}>
                  {g >= 1160 && (
                    <IconPng src="img/cmepanel30/cmep30_ic_sello.png" x={20} y={35}
                      size={lerp(150, 88, es(clamp01((g - 1160) / 16)))} z={0}
                      opacity={0.96 * clamp01((g - 1160) / 8)}
                      rot={lerp(-32, -9, es(clamp01((g - 1160) / 20)))} glow={V.ink0} />
                  )}
                  {g >= 1026 && g < 1086 && (
                    <Rotulo x={50} y={87} color={rgba(V.bone, 0.95)} size={34}
                      op={clamp01((g - 1026) / 10) * clamp01(1 - (g - 1070) / 14)}>
                      HAY ALGUIEN DEL OTRO LADO
                    </Rotulo>
                  )}
                </Plane>

                {/* el titular del pago, en el tercio izquierdo: nunca sobre su boca */}
                <Plane z={120}>
                  {g >= 1140 && g < 1230 && (
                    <div style={{
                      position: "absolute", left: "15%",
                      top: `${(78 + Math.sin(g / 63) * 0.5).toFixed(2)}%`,
                      transform: "translate(-50%,-50%)",
                      opacity: clamp01((g - 1140) / 12) * clamp01(1 - (g - 1214) / 14),
                    }}>
                      <Bed pad={20}>
                        <div style={{
                          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, lineHeight: 1.02,
                          color: V.white, textTransform: "uppercase", textShadow: "0 6px 26px rgba(0,0,0,0.95)",
                        }}>
                          NO<br /><span style={{ color: V.volt }}>ELECTROCUTA</span><br />A NADIE
                        </div>
                      </Bed>
                    </div>
                  )}
                </Plane>
              </>
            )}
          </>
        )}

        {/* ═══ ACTO 5 · EL PRIMER DATO PARA NO COMPRAR BASURA ══════════════════════════════════ */}
        {a5 && (
          <>
            {/* LA ETIQUETA a pantalla completa y la lupa barriéndola: el dato es GRATIS y está ahí */}
            <Plane z={110}>
              {g >= SW5 && g < 1352 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_etiqueta_cajita.png" kind="photo"
                  w={880} h={520} x={lerp(46, 30, es(clamp01((g - 1300) / 60)))}
                  y={lerp(76, 47, es(clamp01((g - SW5) / 38))) + lerp(0, 34, es(clamp01((g - 1340) / 22)))}
                  z={0} ry={-7} rx={3} lit={1} litColor={V.volt}
                  label="LO QUE TIENE QUE DECIR LA CAJA" sheenAt={toCF(1288)} radius={14} />
              )}
              {g >= 1256 && g < 1348 && (
                <IconPng src="img/cmepanel30/cmep30_ic_lupa.png"
                  x={46 + Math.cos(g / 26) * 13} y={44 + Math.sin(g / 26) * 9}
                  size={104} z={0} opacity={0.94 * clamp01((g - 1256) / 14) * clamp01(1 - (g - 1332) / 14)}
                  glow={V.ink0} />
              )}
            </Plane>

            {/* LAS DOS PALABRAS que hay que buscar. Entran desde ABAJO y en CÁLIDO: es lo que te
                queda (el dato que te ahorra la plata). */}
            <Plane z={230}>
              {["PROTECCIÓN ANTI-ISLANDING", "CERTIFICACIÓN DE CONEXIÓN"].map((t, i) => {
                const at = 1266 + i * 30;
                if (g < at || g >= 1348) return null;
                const fl = flujo("queda", clamp01((g - at) / 26));
                return (
                  <div key={i} style={{
                    position: "absolute", left: "78%", top: `${(34 + i * 13 + pc(fl.dy)).toFixed(2)}%`,
                    transform: "translate(-50%,-50%)",
                    opacity: clamp01(1 - (g - 1332) / 14),
                  }}>
                    <Bed pad={16}>
                      <div style={{
                        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 33, letterSpacing: 1.4,
                        color: V.volt, textTransform: "uppercase", whiteSpace: "nowrap",
                        textShadow: "0 4px 18px rgba(0,0,0,0.95)",
                      }}>{t}</div>
                    </Bed>
                  </div>
                );
              })}
              {g >= 1244 && g < 1336 && (
                <Rotulo x={50} y={12} color={rgba(V.amber, 0.95)} size={34}
                  op={clamp01((g - 1244) / 12) * clamp01(1 - (g - 1320) / 14)}>
                  EL PRIMER DATO, GRATIS
                </Rotulo>
              )}
            </Plane>

            {/* ── LA VENTANA W4: la regla dura, con él en el medio y limpio ─────────────────── */}
            <Plane z={160}>
              {g >= 1372 && g < 1512 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_etiqueta_cajita.png" kind="photo"
                  w={344} h={208}
                  x={lerp(-14, 13, es(clamp01((g - 1372) / 32)))}
                  y={40} z={0} ry={12} rx={-2} lit={1} litColor={V.volt}
                  label="BUSCA ESTAS DOS PALABRAS" sheenAt={toCF(1416)} radius={10} />
              )}
              {g >= 1394 && g < 1512 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_cable_suicida_banco.png" kind="photo"
                  w={344} h={208}
                  x={lerp(114, 87, es(clamp01((g - 1394) / 32)))}
                  y={30} z={0} ry={-12} rx={2} lit={0.9} litColor={V.danger}
                  label="SI NO LAS DICE" sheenAt={toCF(1438)} radius={10} />
              )}
              {g >= 1442 && g < 1512 && (
                <MediaCard src="broll/cmepanel30/cmep30_s2_clip_claudio_niega_cable_suicida.mp4" kind="video"
                  w={330} h={198}
                  x={lerp(116, 87, es(clamp01((g - 1442) / 30)))}
                  y={62} z={0} ry={-12} rx={2} startFrom={4} lit={0.94} litColor={V.danger}
                  label="NO ES UN AHORRO" sheenAt={toCF(1480)} radius={10} />
              )}
            </Plane>

            {/* LA REGLA — tercio izquierdo, tres líneas, bien lejos de su boca */}
            <Plane z={120}>
              {g >= 1452 && g < 1544 && (
                <div style={{
                  position: "absolute", left: "15%",
                  top: `${(76 + Math.sin(g / 57) * 0.5).toFixed(2)}%`,
                  transform: `translate(-50%,-50%) scale(${(0.94 + 0.06 * es(clamp01((g - 1452) / 12))).toFixed(3)})`,
                  opacity: clamp01((g - 1452) / 10) * clamp01(1 - (g - 1528) / 14),
                }}>
                  <Bed pad={22}>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 58, lineHeight: 1.0,
                      color: V.white, textTransform: "uppercase", textShadow: "0 6px 26px rgba(0,0,0,0.95)",
                    }}>
                      NO LO<br /><span style={{ color: V.danger }}>COMPRES</span>
                    </div>
                  </Bed>
                </div>
              )}
            </Plane>

            {/* ── EL ATERRIZAJE: encuadre abierto de exterior y la cámara SIGUIÉNDOLO hacia el
                patio. La materia saliente es el enchufe de la pared exterior (ya está detrás). ── */}
            <Plane z={90}>
              {g >= 1520 && (
                <MediaCard src="broll/cmepanel30/cmep30_s2_clip_claudio_camina_hacia_kit.mp4" kind="video"
                  w={lerp(420, 560, es(clamp01((g - 1520) / 70)))}
                  h={lerp(252, 336, es(clamp01((g - 1520) / 70)))}
                  x={lerp(-16, 62, es(clamp01((g - 1520) / 84)))}
                  y={lerp(74, 62, es(clamp01((g - 1520) / 84)))}
                  z={0} ry={lerp(14, -4, es(clamp01((g - 1520) / 84)))} rx={-2}
                  startFrom={0} lit={1} litColor={V.white}
                  label="AL PATIO" sheenAt={toCF(1566)} radius={12} />
              )}
              {g >= 1552 && (
                <IconPng src="img/cmepanel30/cmep30_ic_enchufe.png"
                  x={lerp(18, 13, es(clamp01((g - 1552) / 46)))} y={28}
                  size={lerp(0, 96, es(clamp01((g - 1552) / 18)))} z={0} opacity={0.9} glow={V.ink0} />
              )}
            </Plane>
          </>
        )}

      </Layers>

      {/* ════ LAS COSTURAS, siempre por encima de todo ════ */}
      {/* FRONTERA C @831 · OCLUSIÓN — la carcasa gris de la cajita cruza y tapa el 100 % entre los
          frames 830 y 833: ahí adentro cambia el acto, la escala y la luz. */}
      <OcluyeCarcasa at={818} dur={26} />
      {/* FRONTERA D @1236 · WIPE POR MATERIA — el polvo y las astillas de hormigón del poste, y
          detrás ya está la etiqueta sobre el banco. La apertura vuelve a CERRADO acá adentro. */}
      <SeamWipeMatter at={1220} dur={32} tint={V.concrete} />
      <Astillas at={1218} dur={34} />
    </AbsoluteFill>
  );
};
