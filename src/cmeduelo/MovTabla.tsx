// MovTabla.tsx — MOVIMIENTO 2 de `cmeduelo` (canal Claudio Mendoza Constructor).
// "Panel Solar de $50 vs Turbina Eólica de $50 en un Patio Normal" · tramo s107→s118 (~55 s).
//
// ES **LA LÁMINA**: el arma de conversión del video. Claudio acaba de decir "presta atención a esta
// imagen, probablemente sea la parte más importante de todo el video" y sugiere pausar. Entonces la
// escena NEGRA del temporal se convierte en PAPEL y sobre ese papel se escribe, con tipografía real,
// una PÁGINA DE GUÍA: tabla de tres columnas (km/h · lo que se siente · vatios reales), el salto
// entre las dos últimas filas, la ley del cubo dibujada sobre las puntas de las barras, la línea de
// puntos del panel de $50 a la altura de los 52 W, la zona verde que se come toda la tabla, y los
// tres casilleros que hay que buscarle a una turbina antes de comprarla.
//
// ⛔ NO es una sucesión de tarjetas: es UN movimiento continuo.
//    · UNA sola atmósfera (`VoltAtmos`) montada una vez y jamás remontada.
//    · UNA sola cámara (`gcam` con el frame GLOBAL) que nunca vuelve a 0; los actos heredan su
//      posición y su inercia. El offset de entrada (panX -70 / ry -6) va CONSTANTE y lo cancela el
//      viaje de la propia gcam (panX +70 / ry +6), así el movimiento entra y sale en el contrato.
//    · La luz EVOLUCIONA: gris de temporal (sky) → papel cálido → voltio puro sobre el papel.
//    · MATERIA QUE CRUZA cada frontera: la tela del temporal se aquieta y se vuelve LA HOJA; la hoja
//      es la página; la página es la mesa de los casilleros; el casillero de la altura ya contiene
//      el CAÑO VERTICAL (el anemómetro en su mástil) que se lleva MovAltura.
//
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — acto por acto (cámara · luz · viento · materia)                            ║
// ╠══╤═══════════════════════╤══════════════════════════════════╤═══════════════════════════════╣
// ║ 1│ EL TEMPORAL SE AQUIETA│ enterFrom: z0 180, panX -70,     │ exitTo: la hoja cubre el 100%,║
// ║  │ Y SE VUELVE PAPEL     │ ry -6 · luz SKY+volt · viento .85│ luz vira a papel · viento .30 ║
// ║  │ (0 → .050 D)          │ materia: la ropa/tela volando    │ materia: LA HOJA de 3 columnas║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │  F1 = WIPE POR MATERIA (polvo del temporal + banda de PAPEL `V.bone`): el papel es lo que  ║
// ║  │  cruza, y detrás ya está el WhiteRoom encendido. ⛔ el color de la banda es el del PAPEL.  ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 2│ EL DEDO BAJA POR LA   │ enterFrom: papel establecido,    │ exitTo: 5 filas escritas, el  ║
// ║  │ TABLA (5 filas)       │ luz papel+volt · viento .14      │ dedo llegando al fondo,       ║
// ║  │ (.050 → .320 D)       │ materia: la hoja = la página     │ vector descendente vivo       ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │  F2 = MATCH-MOVE: el dedo NO corta, sigue su vector y sale por abajo de cuadro; detrás de  ║
// ║  │  ese movimiento aparecen las llaves y los chips del salto. No hay costura visible: hay     ║
// ║  │  continuidad de movimiento (por eso no repito el wipe de F1).                              ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 3│ EL SALTO Y LA LEY DEL │ enterFrom: dedo saliendo, filas  │ exitTo: la curva del cubo     ║
// ║  │ CUBO                  │ 1-3 apagadas, lean-in 1.045      │ dibujada sobre las 5 puntas   ║
// ║  │ (.320 → .467 D)       │ materia: las 5 filas             │ materia: la columna de vatios ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │  F3 = CORTE EN EL BEAT (+ `SeamFlash` voltio de 5 frames) EXACTO en "línea de puntos": la   ║
// ║  │  línea entra en el golpe. Encuadre y luz calzan a los dos lados (misma página, mismo z).   ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 4│ LA LÍNEA DE PUNTOS Y  │ enterFrom: tabla completa, luz   │ exitTo: toda la tabla teñida  ║
// ║  │ LA ZONA QUE GANA      │ virando a VOLTIO sobre papel     │ de voltio, la llave de "casi  ║
// ║  │ (.467 → .731 D)       │ materia: la columna de vatios    │ toda la tabla" · viento .12   ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │  F4 = OCLUSIÓN (`SeamOcclude` color PAPEL `#EAE6D9`, la propia hoja cruzando): detrás, la  ║
// ║  │  tabla ya se encogió al tercio superior y los tres casilleros están puestos.               ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 5│ LOS TRES CASILLEROS   │ enterFrom: tabla chica arriba,   │ exitTo: z1 40, panY -120 (la  ║
// ║  │ (.731 → 1.0 D)        │ luz VOLTIO sobre papel · .12     │ cámara mira ARRIBA), luz VOLT ║
// ║  │                       │ materia: la página como mesa     │ pura sobre papel · viento .10 ║
// ║  │                       │                                  │ materia: EL CAÑO VERTICAL     ║
// ║──┴───────────────────────┴──────────────────────────────────┴───────────────────────────────╢
// ║  F5 (salida hacia MovAltura) = ZOOM-THROUGH: la cámara ENTRA en el casillero de la ALTURA,    ║
// ║  el mástil crece y se sale por arriba del papel, el papel baja y por el borde superior vuelve ║
// ║  a asomar el aire del patio. MovAltura arranca exactamente ahí (z0 40, panY -120, caño).      ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════════╝
//
// MATERIAL REAL POR FILA (⛔ toda tarjeta flotante lleva clip o foto adentro):
//   10 km/h · apenas se sienten las hojas → FOTO  cmed_o_610_hojasviento
//   15 km/h · se mueven las hojas         → CLIP  cmed_o_610_hojasviento
//   20 km/h · se mueven las ramas finas   → CLIP  cmed_o_608_anemometro
//   30 km/h · se mueve el árbol entero    → CLIP  cmed_o_612_turbinagira
//   40 km/h · cuesta caminar de frente    → CLIP  cmed_h_611_caminaviento
//   dedo que baja  → CLIP cmed_h_603_tocalahoja   ·  papel/acto 1 → FOTO cmed_o_607_hojatrescolumnas
//   casilleros     → FOTO cmed_h_606_dudaturbina · CLIP cmed_o_612_turbinagira · CLIP cmed_o_608_anemometro
//
// CONTRATO TÉCNICO: sin Math.random/Date.now (todo `rnd(k)`), sin backdrop-filter, sin blur grande a
// pantalla completa, Easing.poly(5) en vez del inexistente Easing.quint, safe area 60 px, imports
// sólo de `remotion`, `react` y `./VoltStage`.

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, WindField, Layers, Plane, MediaCard, PhotoPlane, IconPng, WhiteRoom,
  SeamOcclude, SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Bed,
} from "./VoltStage";

// ── TINTA SOBRE PAPEL ───────────────────────────────────────────────────────────────────────
// La página es clara: la tipografía del Stage (Head/Body) trae sombra oscura pensada para el negro,
// así que acá la tinta se escribe con las MISMAS familias (F_DISPLAY / F_BODY) y contraste de papel.
const INK = "#171A0F";        // tinta principal
const INK2 = "#5C6149";       // tinta secundaria
const VOLT_INK = "#6E8A00";   // el voltio, legible sobre papel
const AMB_INK = "#8A5B00";    // el ámbar, legible sobre papel
const PAPER = "#EAE6D9";      // LA MATERIA de las costuras F1 y F4 (la hoja)

// ── GEOMETRÍA DE LA PÁGINA (px sobre 1920×1080; safe area 60) ────────────────────────────────
const PX = (px: number) => (px / 1920) * 100;
const PY = (py: number) => (py / 1080) * 100;

const M_LEFT = 240;           // margen izquierdo de la página (canaleta del dedo)
const M_RIGHT = 1800;         // margen derecho (donde se alinean los vatios)
const Y_KICK = 118;           // "PÁGINA 4 · TURBINA DE 60 cm"
const Y_TITLE = 152;          // el slot de titular (una idea por acto, siempre en el mismo lugar)
const Y_HEAD = 248;           // encabezados de columna
const Y_RULE = 296;           // filete bajo los encabezados
const ROW_Y = [352, 484, 616, 748, 880];
const ROW_H = 118;
const Y_LINE = 954;           // la línea de puntos del panel (bisagra)

const COL1_R = 600;           // km/h: números alineados a la derecha
const CARD_X = 810;           // centro de la tarjeta con material real
const TXT_X = 950;            // "lo que se siente"
const BAR_X = 1370;           // arranque de las barras de vatios
const BAR_MAX = 400;          // 52 W = 400 px  → 7,69 px por vatio (lineal: el cubo se VE)
const PTR_X = 350;            // canaleta del dedo / de los chips

const ROWS: { kmh: number; feel: string; w: number; src: string; kind: "video" | "photo"; from: number }[] = [
  { kmh: 10, feel: "apenas se sienten las hojas", w: 1, src: "img/cmeduelo/cmed_o_610_hojasviento.jpg", kind: "photo", from: 0 },
  { kmh: 15, feel: "se mueven las hojas", w: 3, src: "broll/cmeduelo/cmed_o_610_hojasviento.mp4", kind: "video", from: 26 },
  { kmh: 20, feel: "se mueven las ramas finas", w: 7, src: "broll/cmeduelo/cmed_o_608_anemometro.mp4", kind: "video", from: 12 },
  { kmh: 30, feel: "se mueve el árbol entero", w: 22, src: "broll/cmeduelo/cmed_o_612_turbinagira.mp4", kind: "video", from: 20 },
  { kmh: 40, feel: "cuesta caminar de frente", w: 52, src: "broll/cmeduelo/cmed_h_611_caminaviento.mp4", kind: "video", from: 8 },
];
const barLen = (w: number) => Math.max(9, (w / 52) * BAR_MAX);
const wattSize = [56, 62, 70, 90, 118];

// ── HELPERS PUROS ───────────────────────────────────────────────────────────────────────────
const EO = Easing.bezier(0.22, 0.61, 0.28, 1);
const SNAP = Easing.bezier(0.7, 0, 0.18, 1);
const ramp = (frame: number, at: number, dur: number, easing = EO) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// curva suave (Catmull-Rom → Bézier) por las puntas de las barras = LA LEY DEL CUBO, dibujada
const smoothPath = (pts: [number, number][]) => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

// grupo con transform propio dentro de un Plane (mantiene las coordenadas de pantalla)
const G: React.FC<{ t?: string; children: React.ReactNode; o?: number }> = ({ t, children, o = 1 }) => (
  <div style={{
    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
    transform: t, transformOrigin: "50% 50%", transformStyle: "preserve-3d", opacity: o,
  }}>{children}</div>
);

// revelado por BARRIDO (nunca un fade): la tipografía se ESCRIBE de izquierda a derecha
const ClipIn: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <div style={{ clipPath: `inset(0 ${((1 - clamp01(p)) * 100).toFixed(2)}% 0 0)`, ...style }}>{children}</div>
);

// el slot de TITULAR: una idea por acto, siempre en el mismo lugar, cambiando por ROLADO mecánico
const TitleRoll: React.FC<{ frame: number; items: { at: number; text: string; color: string }[] }> = ({ frame, items }) => {
  const H = 76;
  let ty = 0;
  for (let i = 1; i < items.length; i++) {
    ty += ramp(frame, items[i].at, 11, SNAP) * H;
  }
  return (
    <div style={{
      position: "absolute", left: M_LEFT, top: Y_TITLE, width: 1000, height: H, overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-ty.toFixed(2)}px)` }}>
        {items.map((it, i) => (
          <div key={i} style={{
            height: H, display: "flex", alignItems: "center",
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 58, lineHeight: 1,
            letterSpacing: 0.4, color: it.color, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>{it.text}</div>
        ))}
      </div>
    </div>
  );
};

// chip de la comparación (acto 3): es un RÓTULO sobre un gráfico, no una tarjeta flotante
const Chip: React.FC<{ x: number; y: number; big: string; small: string; color: string; p: number; align?: "left" | "center" }> = ({
  x, y, big, small, color, p, align = "center",
}) => (
  <div style={{
    position: "absolute", left: x, top: y, transform: `translate(${align === "center" ? "-50%" : "0"},-50%) translateX(${((1 - p) * -26).toFixed(1)}px)`,
    opacity: p, textAlign: align === "center" ? "center" : "left", whiteSpace: "nowrap",
  }}>
    <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, lineHeight: 0.94, color }}>{big}</div>
    <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: INK2, marginTop: 4, textTransform: "uppercase" }}>{small}</div>
  </div>
);

export const MovTabla: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const frame = useCurrentFrame();
  const A = (f: number) => Math.round(D * f);

  // ── LOS TIEMPOS (fracciones de D, para que sobrevivan al re-anclaje al Whisper) ────────────
  const T = {
    sheet: A(0.006),      // la hoja entra volando en el temporal
    wipe: A(0.034),       // F1 · wipe por materia (papel)
    a2: A(0.050),         // acto 2 · la página escrita
    rows: [A(0.068), A(0.112), A(0.159), A(0.207), A(0.262)], // s108…s112
    a3: A(0.320),         // F2 · match-move (el dedo sale, entra el salto) · s113
    cube: A(0.429),       // s114 · la ley del cubo dibujada
    a4: A(0.467),         // F3 · corte en el beat · s115 la línea de puntos
    zone: A(0.591),       // s116 · la zona donde gana el panel
    all: A(0.669),        // s117 · "es casi toda la tabla"
    a5: A(0.731),         // F4 · oclusión de papel · s118 los tres casilleros
    c1: A(0.755), c2: A(0.822), c3: A(0.884),
    tilt: A(0.930),       // F5 · zoom-through hacia MovAltura
  };

  // ── LA CÁMARA (una sola, frame GLOBAL, nunca vuelve a 0) ───────────────────────────────────
  // gcam viaja panX +70 / ry +6 sobre TODO el movimiento; el offset constante -70 / -6deg que le
  // append­eo es el enterFrom que dejó MovCubo. Se cancelan: entra en (-70,-6°) y sale en (0,0°).
  const cam = gcam(frame, { z0: 180, z1: 40, panX: 70, panY: 0, ry: 6, dur: D });
  // el recorrido de LECTURA: baja con el dedo, se estabiliza en la lámina, y al final MIRA ARRIBA
  const readY = interpolate(
    frame,
    [0, T.a2, T.rows[2], T.a3, T.a4, T.zone, T.a5, T.tilt, D],
    [0, -8, -18, -28, -24, -16, -6, 18, -120],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO },
  );
  const camStr = cam.transform + ` translate3d(-70px, ${readY.toFixed(2)}px, 0) rotateY(-6deg)`;
  // la página es un objeto físico: compensa la magnificación del dolly y deja pasar ~3% de empuje
  const magz = 1500 / (1500 - cam.z);
  const pageFit = (1 / magz) * (0.985 + 0.03 * cam.e);

  // ── LA LUZ (evoluciona, no salta) ──────────────────────────────────────────────────────────
  const skyToVolt = ramp(frame, 0, A(0.12));                 // gris del temporal → voltio
  const atmosTint = light(skyToVolt, "sky", "volt");
  const roomWarm = ramp(frame, T.a4 - 34, 74);               // el papel vira a VOLTIO con la línea
  const roomTint = light(roomWarm, "amber", "volt");
  const atmosI = interpolate(frame, [0, T.wipe, T.a5, D], [1, 0.9, 0.9, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyFrom = interpolate(frame, [0, D], [0.18, 0.42], { extrapolateRight: "clamp" });

  // ── EL VIENTO (literal: .85 temporal → .10 la lámina en calma) ─────────────────────────────
  const wind = interpolate(
    frame, [0, A(0.028), A(0.06), A(0.75), D], [0.85, 0.5, 0.14, 0.12, 0.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO },
  );

  // ── ACTO 1 · la tela se aquieta y se vuelve LA HOJA ────────────────────────────────────────
  const sheetP = ramp(frame, T.sheet, T.wipe - T.sheet, Easing.bezier(0.32, 0.9, 0.3, 1));
  const sheetW = lerp(430, 2680, sheetP);
  const sheetH = lerp(270, 1680, sheetP);
  const act1Alive = frame < T.wipe + 11;

  // ── ACTO 2 · el dedo baja por la tabla ─────────────────────────────────────────────────────
  const bandY = interpolate(
    frame,
    [0, T.a2, T.rows[0], T.rows[1], T.rows[2], T.rows[3], T.rows[4], T.a3, T.a3 + 30],
    [Y_HEAD, Y_HEAD, ROW_Y[0], ROW_Y[1], ROW_Y[2], ROW_Y[3], ROW_Y[4], ROW_Y[4], 1240],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO },
  );
  const ptrAlive = frame > T.wipe + 4 && frame < T.a3 + 34;

  // ── ACTO 3 · el salto + la ley del cubo ────────────────────────────────────────────────────
  const dim13 = interpolate(
    frame, [T.a3 - 8, T.a3 + 18, T.cube, T.cube + 24, T.a4],
    [1, 0.34, 0.34, 0.86, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO },
  );
  const lean = interpolate(frame, [T.a3, T.a3 + 26, T.cube - 8, T.cube + 26], [1, 1.045, 1.045, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO });
  const leanT = `translate(0px, ${((540 - 740) * (lean - 1)).toFixed(2)}px) scale(${lean.toFixed(4)})`;
  const jumpP = ramp(frame, T.a3 + 6, 26);
  const chipOut = ramp(frame, T.a4, 16, SNAP);
  const cubeP = ramp(frame, T.cube, 34, Easing.poly(3));

  // ── ACTO 4 · la línea de puntos y la zona que gana ─────────────────────────────────────────
  const lineP = ramp(frame, T.a4, 26, Easing.poly(5));
  const zoneP = ramp(frame, T.zone, 30);
  const allP = ramp(frame, T.all, 22, SNAP);

  // ── ACTO 5 · los tres casilleros + la salida hacia MovAltura ───────────────────────────────
  // el encogido de la tabla ocurre TAPADO por la banda de papel de F4 (cobertura 100% hasta ~+7f)
  const shrink = interpolate(frame, [T.a5 + 1, T.a5 + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SNAP });
  const tableScale = lerp(1, 0.55, shrink);
  const tableY = lerp(0, -150, shrink);
  const tableT = `translate(0px, ${tableY.toFixed(1)}px) scale(${tableScale.toFixed(4)}) ` + leanT;
  const fichaP = [ramp(frame, T.c1, 14, SNAP), ramp(frame, T.c2, 14, SNAP), ramp(frame, T.c3, 14, SNAP)];
  // F5 · ZOOM-THROUGH: la cámara ENTRA en el casillero de la altura (el mástil)
  const zt = zoomThrough(frame, T.tilt, Math.round(Math.max(24, (D - T.tilt) * 2.2)), 69.3, 63.9);
  const zoomT = zt.out === "none" ? "" : zt.out;
  const mastRise = interpolate(frame, [T.c3, T.c3 + 40, T.tilt, D], [26, 0, 0, -104], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO });
  // el papel BAJA y por el borde de arriba vuelve a asomar el aire del patio (viento .10)
  const paperDrop = interpolate(frame, [T.tilt, D], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.poly(2) });
  const paperZoom = interpolate(frame, [T.tilt, D], [1, 1.44], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.poly(2) });

  const pageT = `${zoomT} scale(${pageFit.toFixed(4)})`;

  // puntas de las barras (para la curva del cubo)
  const tips: [number, number][] = ROWS.map((r, i) => [BAR_X + barLen(r.w), ROW_Y[i] + 40] as [number, number]);
  const cubeD = smoothPath(tips);

  const paperOn = frame >= T.wipe;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca ───────────────────────────── */}
      <VoltAtmos tint={atmosTint} tint2={V.amber} keyFrom={keyFrom} intensity={atmosI} floor={0.55} />
      <WindField speed={wind} tint={V.white} count={24} />

      {/* ── EL PAPEL: plano de fondo con parallax propio (0,35 de la cámara) ──────────────── */}
      <AbsoluteFill style={{
        transform: `translate3d(${(-70 * (1 - cam.e) * 0.35).toFixed(2)}px, ${(readY * 0.35 + paperDrop + Math.sin(frame / 97) * 3).toFixed(2)}px, 0) scale(${paperZoom.toFixed(4)})`,
        overflow: "hidden",
      }}>
        <WhiteRoom at={T.wipe + 1} dur={7} tint={roomTint}>
          {/* la hoja REAL de tres columnas como textura del papel: la página es un objeto físico */}
          <AbsoluteFill style={{ opacity: 0.13, mixBlendMode: "multiply" }}>
            <Img src={staticFile("img/cmeduelo/cmed_o_607_hojatrescolumnas.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
          {/* fibra del papel (determinista, sin Math.random) */}
          <AbsoluteFill style={{ opacity: 0.5 }}>
            {Array.from({ length: 22 }, (_, i) => (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 4.7) * 100).toFixed(2)}%`, top: `${(rnd(i * 8.3) * 100).toFixed(2)}%`,
                width: 1 + rnd(i * 2.1) * 2, height: 1 + rnd(i * 5.9) * 2, borderRadius: "50%",
                background: rgba(INK, 0.05 + rnd(i * 3.3) * 0.05),
              }} />
            ))}
          </AbsoluteFill>
        </WhiteRoom>
      </AbsoluteFill>

      {/* ── LA ESCENA (una sola cámara para todos los planos) ─────────────────────────────── */}
      <Layers cam={camStr}>

        {/* ACTO 1 · el temporal (cama de material real) + LA HOJA que se aquieta ------------ */}
        {act1Alive && (
          <>
            <PhotoPlane src="broll/cmeduelo/cmed_h_611_caminaviento.mp4" kind="video" z={-340}
              scale={1.34} dim={0.46} tint={V.sky} startFrom={4} />
            <Plane z={-40}>
              <MediaCard
                src="img/cmeduelo/cmed_o_607_hojatrescolumnas.jpg" kind="photo"
                w={Math.round(sheetW)} h={Math.round(sheetH)}
                x={lerp(61, 50, sheetP)} y={lerp(63, 50, sheetP)}
                z={lerp(-40, 120, sheetP)}
                rot={lerp(-17, 0, sheetP)} ry={lerp(26, 0, sheetP)} rx={lerp(13, 0, sheetP)}
                lit={0.9} litColor={V.sky} radius={lerp(14, 2, sheetP)} sheenAt={T.sheet + 8} grade
              />
            </Plane>
            <Plane z={120}>
              <div style={{ position: "absolute", left: 96, bottom: 92, opacity: ramp(frame, T.sheet + 2, 10), transform: `translateY(${((1 - ramp(frame, T.sheet + 2, 12)) * 22).toFixed(1)}px)` }}>
                <Bed pad={28}>
                  <Kick color={V.volt}>PÁGINA 4 · LA GUÍA DEL PATIO</Kick>
                  <div style={{ height: 10 }} />
                  <Head size={66}>LA PÁGINA MÁS IMPORTANTE</Head>
                </Bed>
              </div>
            </Plane>
          </>
        )}

        {/* PLANO DE LA PÁGINA (tinta, grilla, gráficos) ------------------------------------- */}
        {paperOn && (
          <Plane z={0}>
            <G t={pageT}>

              {/* ── titular + kicker: una idea por acto, siempre en el mismo slot ───────── */}
              <ClipIn p={ramp(frame, T.a2, 14)} style={{ position: "absolute", left: M_LEFT, top: Y_KICK, width: 1000 }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 4.4, color: VOLT_INK, textTransform: "uppercase" }}>
                  PÁGINA 4 · TURBINA DE 60 cm MEDIDA EN EL PATIO
                </div>
              </ClipIn>
              <TitleRoll frame={frame} items={[
                { at: T.a2, text: "La tabla del viento", color: INK },
                { at: T.a3, text: "Mira el salto", color: AMB_INK },
                { at: T.cube, text: "La ley del cubo", color: AMB_INK },
                { at: T.a4, text: "Esta línea es mi panel", color: VOLT_INK },
                { at: T.zone, text: "Debajo de ella gana el panel", color: VOLT_INK },
                { at: T.all, text: "Es casi toda la tabla", color: VOLT_INK },
                { at: T.a5, text: "3 datos antes de comprarla", color: INK },
              ]} />

              {/* ── zona voltio (crece HACIA ARRIBA desde la línea) ──────────────────────── */}
              {zoneP > 0 && (
                <div style={{
                  position: "absolute", left: 300, width: 1500,
                  top: lerp(Y_LINE, ROW_Y[0] - ROW_H / 2, zoneP), height: Y_LINE - lerp(Y_LINE, ROW_Y[0] - ROW_H / 2, zoneP),
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.1)} 0%, ${rgba(V.volt, 0.26)} 100%)`,
                  borderTop: `2px solid ${rgba(VOLT_INK, 0.5)}`,
                }} />
              )}

              {/* ── encabezados de columna + filete ─────────────────────────────────────── */}
              <ClipIn p={ramp(frame, T.a2 + 4, 16)} style={{ position: "absolute", left: 0, top: Y_HEAD, width: 1920, height: 40 }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: COL1_R, textAlign: "right", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.2, color: INK2, textTransform: "uppercase" }}>
                  VIENTO km/h
                </div>
                <div style={{ position: "absolute", left: 700, top: 0, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.2, color: INK2, textTransform: "uppercase" }}>
                  SE SIENTE
                </div>
                <div style={{ position: "absolute", left: 0, top: 0, width: M_RIGHT, textAlign: "right", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.2, color: INK2, textTransform: "uppercase" }}>
                  VATIOS REALES
                </div>
              </ClipIn>
              <div style={{
                position: "absolute", left: M_LEFT, top: Y_RULE, height: 3,
                width: (M_RIGHT - M_LEFT) * ramp(frame, T.a2 + 6, 20), background: rgba(INK, 0.62),
              }} />

              {/* ── las 5 filas: grilla, cifras y barras (la tipografía la escribe el kit) ── */}
              {ROWS.map((r, i) => {
                const rp = ramp(frame, T.rows[i], 15);
                const op = i < 3 ? dim13 : 1;
                const active = clamp01(1 - Math.abs(bandY - ROW_Y[i]) / (ROW_H * 0.62));
                const isLast = i === 4;
                return (
                  <div key={i} style={{ opacity: rp * op }}>
                    {/* cama de fila activa */}
                    <div style={{
                      position: "absolute", left: 300, top: ROW_Y[i] - ROW_H / 2, width: 1500, height: ROW_H,
                      background: rgba(V.volt, 0.16 * active), borderRadius: 6,
                    }} />
                    {active > 0.25 && (
                      <div style={{
                        position: "absolute", left: 300, top: ROW_Y[i] - ROW_H / 2, width: 7, height: ROW_H,
                        background: rgba(V.voltSoft, active), borderRadius: 4,
                      }} />
                    )}
                    {/* hairline de la grilla */}
                    <div style={{ position: "absolute", left: M_LEFT, top: ROW_Y[i] + ROW_H / 2, width: (M_RIGHT - M_LEFT) * rp, height: 1, background: rgba(INK, 0.13) }} />

                    {/* col 1 · km/h */}
                    <div style={{
                      position: "absolute", left: 0, top: ROW_Y[i] - 44, width: COL1_R, textAlign: "right",
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 72, lineHeight: 1.1, color: INK,
                      transform: `translateX(${((1 - rp) * -22).toFixed(1)}px)`,
                    }}>{r.kmh}</div>

                    {/* col 2 · lo que se siente (el material real va en el plano de adelante) */}
                    <div style={{
                      position: "absolute", left: TXT_X, top: ROW_Y[i] - 40, width: 400,
                      fontFamily: F_BODY, fontWeight: 600, fontSize: 32, lineHeight: 1.22, color: INK,
                      transform: `translateX(${((1 - rp) * -16).toFixed(1)}px)`,
                    }}>{r.feel}</div>

                    {/* col 3 · vatios: barra (gráfico) + cifra alineada a la derecha */}
                    <div style={{
                      position: "absolute", left: BAR_X, top: ROW_Y[i] + 33, height: 15, borderRadius: 8,
                      width: barLen(r.w) * ramp(frame, T.rows[i] + 3, 22, Easing.poly(3)),
                      background: isLast
                        ? `linear-gradient(90deg, ${rgba(V.amber, 0.75)}, ${V.amber})`
                        : `linear-gradient(90deg, ${rgba(VOLT_INK, 0.55)}, ${rgba(VOLT_INK, 0.9)})`,
                      boxShadow: `0 2px 0 ${rgba(INK, 0.16)}`,
                    }} />
                    <div style={{
                      position: "absolute", left: 0, top: ROW_Y[i] - wattSize[i] * 0.62, width: M_RIGHT, textAlign: "right",
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: wattSize[i], lineHeight: 1,
                      color: isLast ? AMB_INK : INK,
                      transform: `scale(${(1 + (1 - ramp(frame, T.rows[i], 9, SNAP)) * 0.2).toFixed(3)})`, transformOrigin: "100% 50%",
                    }}>
                      {r.w}<span style={{ fontSize: Math.round(wattSize[i] * 0.42), color: INK2, marginLeft: 8 }}>W</span>
                    </div>
                  </div>
                );
              })}

              {/* ── ACTO 3 · las llaves del salto + la curva del cubo (gráficos, no objetos) ─ */}
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                {/* llave del viento: 30 → 40 */}
                <path
                  d={`M 664 ${ROW_Y[3]} L 700 ${ROW_Y[3]} L 700 ${ROW_Y[4]} L 664 ${ROW_Y[4]}`}
                  fill="none" stroke={AMB_INK} strokeWidth={4} strokeLinecap="round"
                  strokeDasharray={420} strokeDashoffset={420 * (1 - jumpP)} opacity={(1 - chipOut) * 0.9}
                />
                {/* llave de la energía: de la punta de 22 W a la punta de 52 W */}
                <path
                  d={`M ${tips[3][0]} ${tips[3][1]} C ${tips[3][0] + 120} ${tips[3][1]}, ${tips[4][0] - 150} ${tips[4][1]}, ${tips[4][0]} ${tips[4][1]}`}
                  fill="none" stroke={VOLT_INK} strokeWidth={5} strokeLinecap="round"
                  strokeDasharray={520} strokeDashoffset={520 * (1 - jumpP)} opacity={(1 - chipOut) * 0.95}
                />
                <circle cx={tips[4][0]} cy={tips[4][1]} r={9 * jumpP} fill={V.amber} stroke={AMB_INK} strokeWidth={2} opacity={1 - chipOut} />
                {/* LA LEY DEL CUBO: la curva por las cinco puntas */}
                <path
                  d={cubeD} fill="none" stroke={AMB_INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={1700} strokeDashoffset={1700 * (1 - cubeP)} opacity={0.85 * (1 - chipOut * 0.55)}
                />
              </svg>
              <div style={{ transform: `translateX(${(chipOut * -420).toFixed(1)}px)`, opacity: 1 - chipOut }}>
                <Chip x={PTR_X} y={(ROW_Y[3] + ROW_Y[4]) / 2} big="+33%" small="MÁS VIENTO" color={AMB_INK} p={jumpP} />
                <Chip x={1470} y={984} big="+136%" small="MÁS ENERGÍA" color={VOLT_INK} p={jumpP} align="left" />
              </div>

              {/* ── ACTO 4 · LA LÍNEA DE PUNTOS = el panel solar de $50 ─────────────────── */}
              {lineP > 0 && (
                <>
                  <div style={{
                    position: "absolute", left: 300, top: Y_LINE - 4, height: 8, width: 1500 * lineP,
                    backgroundImage: `repeating-linear-gradient(90deg, ${V.volt} 0px, ${V.volt} 22px, rgba(0,0,0,0) 22px, rgba(0,0,0,0) 40px)`,
                    filter: `drop-shadow(0 2px 0 ${rgba(INK, 0.28)})`,
                  }} />
                  <div style={{
                    position: "absolute", left: 356, top: Y_LINE + 16, opacity: ramp(frame, T.a4 + 12, 12),
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 2.6, color: VOLT_INK, textTransform: "uppercase",
                  }}>
                    PANEL SOLAR DE $50 · 52 W
                  </div>
                </>
              )}

              {/* ── s117 · la llave de "casi toda la tabla" ─────────────────────────────── */}
              {allP > 0 && (
                <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                  <path
                    d={`M 292 ${ROW_Y[0] - ROW_H / 2} L 258 ${ROW_Y[0] - ROW_H / 2} L 258 ${Y_LINE} L 292 ${Y_LINE}`}
                    fill="none" stroke={VOLT_INK} strokeWidth={5} strokeLinecap="round"
                    strokeDasharray={780} strokeDashoffset={780 * (1 - allP)}
                  />
                </svg>
              )}

              {/* ── ACTO 5 · los tres casilleros (fichas de papel) ──────────────────────── */}
              {shrink > 0 && (
                <G>
                  {[
                    { x: M_LEFT, w: 450, t: "VELOCIDAD DE ARRANQUE", d: "Más de 3 m/s y ya casi\nno la vas a usar." },
                    { x: 730, w: 450, t: "DIÁMETRO DEL ROTOR", d: "Lo único que multiplica\nde verdad." },
                    { x: 1220, w: 580, t: "ALTURA DE MONTAJE", d: "La que nadie te dice\ny la que cambia\nel resultado." },
                  ].map((f, i) => (
                    <div key={i} style={{
                      position: "absolute", left: f.x, top: 628, width: f.w, height: 332,
                      opacity: fichaP[i], transform: `translateY(${((1 - fichaP[i]) * 34).toFixed(1)}px)`,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(246,244,236,0.72) 100%)",
                      border: `1px solid ${rgba(INK, 0.16)}`, borderRadius: 12,
                      boxShadow: `0 18px 40px ${rgba(INK, 0.16)}, inset 0 1px 0 rgba(255,255,255,0.9)`,
                    }}>
                      <div style={{
                        position: "absolute", left: 26, top: i === 2 ? 34 : 172, width: i === 2 ? 300 : f.w - 52,
                        marginLeft: i === 2 ? 204 : 0,
                        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 1.4, lineHeight: 1.1, color: INK, textTransform: "uppercase",
                      }}>{f.t}</div>
                      <div style={{
                        position: "absolute", left: 26, top: i === 2 ? 96 : 222, width: i === 2 ? 300 : f.w - 52,
                        marginLeft: i === 2 ? 204 : 0,
                        fontFamily: F_BODY, fontWeight: 500, fontSize: 30, lineHeight: 1.24, color: INK2, whiteSpace: "pre-line",
                      }}>{f.d}</div>
                      <div style={{ position: "absolute", left: 20, top: 236, width: 62, height: 5, background: rgba(VOLT_INK, 0.8), borderRadius: 3, display: i === 2 ? "none" : "block" }} />
                    </div>
                  ))}
                </G>
              )}
            </G>
          </Plane>
        )}

        {/* PLANO DEL MATERIAL REAL (flota sobre la página con su propio parallax) ----------- */}
        {paperOn && (
          <Plane z={64}>
            <G t={pageT}>
              <G t={tableT}>
                {/* una tarjeta con clip/foto REAL por fila: esto es lo que convierte la tabla en lámina */}
                {ROWS.map((r, i) => {
                  const rp = ramp(frame, T.rows[i], 15);
                  if (rp <= 0) return null;
                  const op = (i < 3 ? dim13 : 1) * rp;
                  return (
                    <MediaCard
                      key={i}
                      src={r.src} kind={r.kind} startFrom={r.from}
                      w={220} h={116}
                      x={PX(CARD_X + i * 0.7)} y={PY(ROW_Y[i] + (1 - rp) * 26)}
                      z={10 + i * 3}
                      lit={0.55 + 0.45 * clamp01(1 - Math.abs(bandY - ROW_Y[i]) / ROW_H)}
                      litColor={i === 4 ? V.amber : V.ink2}
                      radius={8} opacity={op} sheenAt={T.rows[i] + 5} grade
                    />
                  );
                })}

                {/* EL DEDO que baja: material real (Claudio tocando la hoja), no un cursor dibujado */}
                {ptrAlive && (
                  <>
                    <MediaCard
                      src="broll/cmeduelo/cmed_h_603_tocalahoja.mp4" kind="video" startFrom={6}
                      w={210} h={132} x={PX(PTR_X)} y={PY(bandY)} z={40}
                      lit={0.8} litColor={V.amber} radius={10}
                      opacity={ramp(frame, T.wipe + 6, 12) * (1 - ramp(frame, T.a3 + 14, 18))}
                      sheenAt={T.wipe + 14} grade
                    />
                    <div style={{
                      position: "absolute", left: PTR_X + 118, top: bandY - 15, width: 0, height: 0,
                      borderTop: "15px solid transparent", borderBottom: "15px solid transparent",
                      borderLeft: `20px solid ${V.amber}`,
                      opacity: ramp(frame, T.wipe + 8, 12) * (1 - ramp(frame, T.a3 + 10, 14)),
                    }} />
                  </>
                )}

                {/* íconos como objetos de la página */}
                <IconPng src="img/cmeduelo/cmed_ic_viento.png" x={PX(318)} y={PY(Y_HEAD - 6)} size={44} z={20} opacity={0.85 * ramp(frame, T.a2 + 8, 14)} glow={INK} />
                <IconPng src="img/cmeduelo/cmed_ic_rayo.png" x={PX(1596)} y={PY(Y_HEAD - 8)} size={46} z={20} opacity={0.9 * ramp(frame, T.a2 + 10, 14)} glow={INK} />
                <IconPng src="img/cmeduelo/cmed_ic_anemometro.png" x={PX(PTR_X - 118)} y={PY((ROW_Y[3] + ROW_Y[4]) / 2 - 96)} size={52} z={26} opacity={jumpP * (1 - chipOut)} glow={INK} />
                <IconPng src="img/cmeduelo/cmed_ic_panel.png" x={PX(318)} y={PY(Y_LINE + 14)} size={52} z={30} opacity={ramp(frame, T.a4 + 10, 14)} glow={INK} />
              </G>

              {/* ── ACTO 5 · el material real de cada casillero ─────────────────────────── */}
              {shrink > 0 && (
                <G>
                  <MediaCard
                    src="img/cmeduelo/cmed_h_606_dudaturbina.jpg" kind="photo"
                    w={386} h={140} x={PX(465)} y={PY(714)} z={26}
                    lit={0.6} litColor={V.ink2} radius={8} opacity={fichaP[0]} sheenAt={T.c1 + 4} grade
                  />
                  <MediaCard
                    src="broll/cmeduelo/cmed_o_612_turbinagira.mp4" kind="video" startFrom={40}
                    w={386} h={140} x={PX(955)} y={PY(714)} z={26}
                    lit={0.6} litColor={V.ink2} radius={8} opacity={fichaP[1]} sheenAt={T.c2 + 4} grade
                  />
                  {/* EL CAÑO VERTICAL: el mástil asoma por arriba del casillero — se lo lleva MovAltura */}
                  <MediaCard
                    src="broll/cmeduelo/cmed_o_608_anemometro.mp4" kind="video" startFrom={30}
                    w={180} h={300} x={PX(1330)} y={PY(700 + mastRise)} z={54}
                    lit={0.9} litColor={V.volt} radius={8} opacity={fichaP[2]} sheenAt={T.c3 + 4} grade
                  />
                  <IconPng src="img/cmeduelo/cmed_ic_viento.png" x={PX(650)} y={PY(646)} size={44} z={30} opacity={0.85 * fichaP[0]} glow={INK} />
                  <IconPng src="img/cmeduelo/cmed_ic_turbina.png" x={PX(1140)} y={PY(646)} size={44} z={30} opacity={0.85 * fichaP[1]} glow={INK} />
                  <IconPng src="img/cmeduelo/cmed_ic_regla.png" x={PX(1758)} y={PY(646)} size={44} z={30} opacity={0.85 * fichaP[2]} glow={INK} />
                </G>
              )}
            </G>
          </Plane>
        )}
      </Layers>

      {/* ── LAS COSTURAS (⛔ ninguna es un fade; una distinta por frontera) ─────────────────── */}
      {/* F1 · WIPE POR MATERIA: polvo del temporal + la banda de PAPEL que llega */}
      <SeamWipeMatter at={T.wipe - 10} dur={26} tint={V.concrete} />
      <SeamOcclude at={T.wipe} dur={22} color={PAPER} angle={-7} />
      {/* F3 · CORTE EN EL BEAT: flash voltio de 5 frames justo en "la línea de puntos" */}
      <SeamFlash at={T.a4} color={V.volt} dur={5} />
      {/* F4 · OCLUSIÓN: la propia hoja cruza y detrás ya están los tres casilleros */}
      <SeamOcclude at={T.a5} dur={18} color={PAPER} angle={6} />
    </AbsoluteFill>
  );
};

export default MovTabla;
