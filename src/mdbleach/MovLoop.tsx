// ══════════════════════════════════════════════════════════════════════════════════════════════
//  MovLoop.tsx — MOVIMIENTO 2 del video `mdbleach` (canal Mike Dalton, EN) · ~40 s / 1200 frames
//  "Chlorine eats rubber… it builds the machine that makes it fail faster."
//
//  ── LA IDEA ─────────────────────────────────────────────────────────────────────────────────
//  El tramo NO es una lista de daños: es UN CIRCUITO CERRADO. Hay una PISTA elíptica que vive en
//  el suelo del cuarto desde el frame 0 hasta el final, y una CUENTA DE LUZ (el "bead") que la
//  recorre. La cuenta nace como la última gota que cae de la jarra, se mete en la goma, sale
//  impresa en la página del fabricante, cae de noche por la porcelana y vuelve a la jarra.
//  Cuando cierra la primera vuelta la pista se pone roja y arranca la SEGUNDA VUELTA — las mismas
//  cuatro estaciones, con MENOS DE LA MITAD de tiempo cada una (~6,2 s → ~2,8 s), girando
//  alrededor del moho que crece justo en el CENTRO del aro. El bucle no se lee: se siente.
//
//  ⛔ NO es una sucesión de tarjetas. Es UNA sola escena: una atmósfera montada una vez, una sola
//  cámara (`stageCam(u,2)`) que nunca vuelve a 0, una luz que viaja de 'warm' a 'red'
//  (`movLight(2,u)`), y la PISTA + la CUENTA como materia que sobrevive a todas las fronteras.
//
//  ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
//  (cam = stageCam(u,2) SIEMPRE + un offset continuo `actOff(u)` que NUNCA se reinicia)
//
//  ACTO 1 · u 0.000–0.150 · "CHLORINE EATS RUBBER"            escala: PRODUCTO
//    enterFrom {cam: CAM_ARC[2].from {z .30 panX -70 panY 18 ry -7 rz .6} + off {z -260, x 40},
//               luz: 'warm' (viene del fósforo ya frío del Mov1),
//               materia: la ÚLTIMA GOTA de la jarra que el Mov1 dejó cayendo}
//    exitTo    {cam: off {z -90, x 10}, luz: warm→red 15 %,
//               materia: la caja del plato de la jarra + la CUENTA que sale de él}
//    ── FRONTERA A @u 0.150 · MATCH-SHAPE ──  la caja exacta del plato de la jarra se convierte
//       en la carta delantera del mazo de goma (`MatchShape`, misma w/h/r). El plato viejo ya
//       viene HUNDIÉNDOSE en z desde 16 frames antes, así que la goma le pasa por delante, y un
//       barrido especular (`Sheen`) cruza el cuarto justo encima.
//       ⇢ por qué: los dos actos tienen el MISMO rectángulo protagonista.
//
//  ACTO 2 · u 0.150–0.310 · "FIRM AND GRIPPY. THEN SOFT."     escala: OBJETO / MAZO 3D
//    enterFrom {cam: off {z -90, x 10}, luz: red 15 %, materia: la caja heredada}
//    exitTo    {cam: off {z +40, x -60, ry -4}, luz: red 34 %,
//               materia: la CARTA NEGRA de goma (el flapper), que es lo que barre el cuadro}
//    ── FRONTERA B @u 0.310 · OCLUSIÓN ──  la propia goma negra cruza como banda a 300 % de
//       pantalla (`Occluder`, ~5 frames de cobertura TOTAL) y detrás ya está la página impresa.
//       ⇢ por qué: cambio de tema fuerte (de la pieza al documento) y de escala.
//
//  ACTO 3 · u 0.310–0.460 · "THEY PRINT IT THEMSELVES"        escala: DOCUMENTO
//    enterFrom {cam: off {z +40, x -60, ry -4}, luz: red 34 %, materia: la banda negra → bloque impreso}
//    exitTo    {cam: off {z +160, x 90, ry 7}, luz: red 52 %,
//               materia: la CUENTA posada sobre el sello rojo de la página}
//    ── FRONTERA C @u 0.460 · ZOOM-THROUGH ──  la cámara entra DENTRO del sello (`ZoomThrough`
//       into [31,47], scale 8.2) y sale del otro lado en el macro nocturno del hilito.
//       ⇢ por qué: de plano de documento a MACRO; el punto de fuga es la propia cuenta.
//
//  ACTO 4 · u 0.460–0.620 · "THE LEAK RUNS ALL NIGHT"         escala: MACRO
//    enterFrom {cam: off {z +160, x 90, ry 7}, luz: red 52 %, materia: la cuenta, ahora gota de agua}
//    exitTo    {cam: off {z +300, x -30, ry -6}, luz: red 74 %,
//               materia: la sábana de agua diluida que se lleva el plato fuera de cuadro}
//    ── FRONTERA D @u 0.620 · WIPE POR MATERIA ──  el agua diluida (`VaporWipe` + la propia placa
//       macro montada en la sábana, que se va con ella); detrás ya está el aro entero girando.
//       ⇢ por qué: el acto está lleno de agua: la materia del acto ES el wipe.
//
//  ACTO 5 · u 0.620–0.900 · "SECOND LAP. HALF THE TIME."      escala: PLANO GENERAL
//    enterFrom {cam: off {z +300, x -30, ry -6}, luz: red 74 %, materia: la pista completa}
//    exitTo    {cam: off {z +120, x 0, ry 0}, luz: red 92 %,
//               materia: las cuatro placas orbitando + el moho creciendo en el CENTRO del aro}
//    ── FRONTERA E @u 0.900 · MATCH-MOVE ──  la cámara NO se detiene (sigue el paneo a la derecha
//       de `stageCam`) y el aro sigue girando con su inercia: las cuatro placas espiralan hacia
//       adentro y se las come el moho, y el remate sube desde el plano del aro.
//       ⇢ por qué: hay paneo y giro ya andando; el contenido cambia DETRÁS del movimiento.
//
//  ACTO 6 · u 0.900–1.000 · "NOT DESPITE. BECAUSE OF IT."     escala: DETALLE / REMATE
//    enterFrom {cam: off {z +120, x 0, ry 0}, luz: red 92 %, materia: el aro y el moho}
//    exitTo    {cam: CAM_ARC[2].to {z .62 panX 40 panY -24 ry 9 rz -.8} + off {z +200},
//               luz: 'red' pleno,
//               materia: el aro aplastado en UNA línea roja horizontal → es la mesa de la cocina
//               de noche donde abre el Mov3}
//
//  ── COSTURAS ────────────────────────────────────────────────────────────────────────────────
//   A MATCH-SHAPE · B OCLUSIÓN · C ZOOM-THROUGH · D WIPE POR MATERIA · E MATCH-MOVE
//   ⛔ ninguna es un fade · ⛔ no hay dos iguales seguidas.
//
//  ── POR QUÉ EL TEXTO VIVE EN UNA CAPA APARTE ────────────────────────────────────────────────
//   El dolly hacia adelante (translateZ del `actOff` + el `scale` de `stageCam`) magnifica el
//   mundo hasta ~1,6× en los actos 4-5. Si los titulares viajaran DENTRO de la cámara, a esa
//   altura estarían fuera de la safe area de 60 px. Por eso los bloques de tipografía viven en
//   una capa `<Frame>` anclada al cuadro, con un parallax chiquito DERIVADO de `cam.state`
//   (panX/panY × 0,05): respira con la cámara, pero nunca se sale del cuadro.
//
//  ── MATERIAL REAL HARDCODEADO (para el tarball del farm) ────────────────────────────────────
//   broll/mdbleach_h20_bleachintofull.mp4
//   broll/mdbleach_h26_flapperhand.mp4
//   broll/mdbleach_h27_flappercompare.mp4
//   broll/mdbleach_h28_trickleleak.mp4
//   broll/mdbleach_h29_tabletjar.mp4
//   img/mdbleach_h49_tankinside.jpg
//   img/mdbleach_h46_patchymold.jpg
//   img/mdbleach_lam_whybleach.jpg
//   (h46 y h49 NO tienen .mp4 en public/broll — van como FOTO a propósito.)
// ══════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
  MD, F_SANS, rgba, lerp, clamp01, eio,
  Atmos, Motes, Space3D, GlassPlate, Fan3D, MatchShape, ZoomThrough, Occluder, VaporWipe, Sheen,
  Kicker, Title, Em, TextBed, stageCam, movLight,
} from "./Stage";

// ── LOS ACTOS, COMO FRACCIONES DE LA DURACIÓN REAL (el build ancla al ms, ±20 %) ─────────────
const A1 = 0.0, A2 = 0.15, A3 = 0.31, A4 = 0.46, A5 = 0.62, A6 = 0.9;

// ── MATERIAL REAL, una constante por estación del circuito ───────────────────────────────────
const SRC = {
  jug: "broll/mdbleach_h20_bleachintofull.mp4",
  rubber: "broll/mdbleach_h26_flapperhand.mp4",
  compare: "broll/mdbleach_h27_flappercompare.mp4",
  valve: "img/mdbleach_h49_tankinside.jpg",
  page: "img/mdbleach_lam_whybleach.jpg",
  trickle: "broll/mdbleach_h28_trickleleak.mp4",
  tablet: "broll/mdbleach_h29_tabletjar.mp4",
  mold: "img/mdbleach_h46_patchymold.jpg",
};

// Las 4 estaciones del circuito, en orden de recorrido.
const STATIONS = [
  { src: SRC.jug, tag: "01 · YOU POUR" },
  { src: SRC.rubber, tag: "02 · RUBBER SOFTENS" },
  { src: SRC.trickle, tag: "03 · IT LEAKS ALL NIGHT" },
  { src: SRC.mold, tag: "04 · MOLD COMES BACK" },
];

// ── LA VUELTA ────────────────────────────────────────────────────────────────────────────────
// `turn(u)`: 0→1 es la PRIMERA vuelta (la cuenta se DEMORA en cada estación y después corre);
// 1→2 es la SEGUNDA, continua y sin descanso, en menos de la mitad del tiempo. Función continua
// de `u`: nunca se reinicia, nunca salta.
const segTravel = (q: number) => (q < 0.6 ? (q / 0.6) * 0.16 : 0.16 + eio(0, 0.84, (q - 0.6) / 0.4));
const turn = (u: number) => {
  const B = [A1, A2, A3, A4, A5];
  if (u < A5) {
    for (let i = 0; i < 4; i++) {
      if (u < B[i + 1]) return (i + segTravel(clamp01((u - B[i]) / (B[i + 1] - B[i])))) * 0.25;
    }
  }
  if (u < A6) return 1 + eio(0, 1, clamp01((u - A5) / (A6 - A5)));
  // el aro NO frena de golpe: sigue con inercia y va muriendo
  return 2 + eio(0, 0.17, clamp01((u - A6) / (1 - A6)));
};

// ── OFFSET DE CÁMARA POR ACTO — UNA sola curva continua ENCIMA de `stageCam` ─────────────────
// ⛔ Ningún acto reinventa la cámara: cada uno ocupa un tramo de ESTA curva.
const OFF_KEYS: { u: number; z: number; x: number; y: number; ry: number }[] = [
  { u: 0.0, z: -260, x: 40, y: 10, ry: 6 },
  { u: 0.15, z: -90, x: 10, y: 0, ry: 2 },
  { u: 0.31, z: 40, x: -60, y: -8, ry: -4 },
  { u: 0.46, z: 160, x: 90, y: 16, ry: 7 },
  { u: 0.62, z: 300, x: -30, y: -20, ry: -6 },
  { u: 0.9, z: 120, x: 0, y: 0, ry: 0 },
  { u: 1.0, z: 200, x: 0, y: -6, ry: 2 },
];
const actOff = (u: number, f: number) => {
  let a = OFF_KEYS[0];
  let b = OFF_KEYS[OFF_KEYS.length - 1];
  for (let i = 0; i < OFF_KEYS.length - 1; i++) {
    if (u >= OFF_KEYS[i].u && u <= OFF_KEYS[i + 1].u) {
      a = OFF_KEYS[i];
      b = OFF_KEYS[i + 1];
      break;
    }
  }
  const t = eio(0, 1, clamp01((u - a.u) / Math.max(1e-6, b.u - a.u)));
  // respiración: nada queda perfectamente quieto (regla del canal)
  const bx = Math.sin(f / 53) * 2.6 + Math.sin(f / 119) * 1.5;
  const by = Math.cos(f / 67) * 2.0;
  return (
    `translate3d(${(lerp(a.x, b.x, t) + bx).toFixed(2)}px, ${(lerp(a.y, b.y, t) + by).toFixed(2)}px, ` +
    `${lerp(a.z, b.z, t).toFixed(2)}px) rotateY(${lerp(a.ry, b.ry, t).toFixed(3)}deg)`
  );
};

// ── GEOMETRÍA DEL CIRCUITO ───────────────────────────────────────────────────────────────────
const RX = 500, RZ = 380, RY = 170;
/** Un punto del aro en el espacio de la escena (upright, para colgar placas reales). */
const ringPoint = (turns: number) => {
  const th = (turns * 360 - 90) * (Math.PI / 180);
  const c = Math.cos(th), s = Math.sin(th);
  return { x: c * RX, y: -s * RY * 0.5 + 60, z: s * RZ, front: (s + 1) / 2 };
};

// ── LA PISTA — materia que sobrevive a los SEIS actos. Se monta UNA vez, nunca se remonta. ───
const RingTrack: React.FC<{ f: number; turns: number; scale: number; heat: number; lift: number }> = ({
  f, turns, scale, heat, lift,
}) => {
  const lap1 = clamp01(turns);
  const lap2 = clamp01(turns - 1);
  const th = (turns * 360 - 90) * (Math.PI / 180);
  const hx = 780 + 740 * Math.cos(th);
  const hy = 328 + 300 * Math.sin(th);
  const pulse = 0.78 + Math.sin(f / 9) * 0.22;
  const hot = rgba(MD.red, 0.5 + heat * 0.5);
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%", width: 1560, height: 656,
        transform:
          `translate(-50%,-50%) translate3d(0px, ${lift.toFixed(1)}px, -60px) ` +
          `rotateX(69deg) scale(${scale.toFixed(4)})`,
        transformStyle: "preserve-3d",
      }}
    >
      <svg viewBox="0 0 1560 656" width="100%" height="100%" style={{ overflow: "visible" }}>
        {/* la zanja de la pista */}
        <ellipse cx={780} cy={328} rx={740} ry={300} fill="none" stroke={rgba(MD.white, 0.055)} strokeWidth={64} />
        <ellipse cx={780} cy={328} rx={740} ry={300} fill="none" stroke={rgba(MD.white, 0.16)} strokeWidth={2} />
        {/* muescas de las 4 estaciones */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i * 90 - 90) * (Math.PI / 180);
          const done = turns > i * 0.25 + 0.02 ? 1 : 0.18;
          return (
            <g key={i}>
              <circle cx={780 + 740 * Math.cos(a)} cy={328 + 300 * Math.sin(a)} r={13} fill="none"
                stroke={rgba(MD.white, 0.14 + done * 0.3)} strokeWidth={3} />
              <circle cx={780 + 740 * Math.cos(a)} cy={328 + 300 * Math.sin(a)} r={4.5}
                fill={rgba(MD.red, 0.25 + done * 0.6)} />
            </g>
          );
        })}
        {/* VUELTA 1: la línea de hueso que se dibuja */}
        <ellipse cx={780} cy={328} rx={740} ry={300} fill="none" pathLength={1000}
          strokeDasharray={`${(lap1 * 1000).toFixed(1)} 1000`} strokeLinecap="round"
          stroke={rgba(MD.bone, 0.5)} strokeWidth={7} transform="rotate(-90 780 328)" />
        {/* VUELTA 2: la MISMA pista, ahora al rojo y más gruesa */}
        {lap2 > 0 && (
          <>
            <ellipse cx={780} cy={328} rx={740} ry={300} fill="none" pathLength={1000}
              strokeDasharray={`${(lap2 * 1000).toFixed(1)} 1000`} strokeLinecap="round"
              stroke={rgba(MD.red, 0.16 + heat * 0.16)} strokeWidth={44} transform="rotate(-90 780 328)" />
            <ellipse cx={780} cy={328} rx={740} ry={300} fill="none" pathLength={1000}
              strokeDasharray={`${(lap2 * 1000).toFixed(1)} 1000`} strokeLinecap="round"
              stroke={hot} strokeWidth={12} transform="rotate(-90 780 328)" />
          </>
        )}
        {/* LA CUENTA: halo en círculos concéntricos (⛔ nada de filter:blur recalculado por frame) */}
        <circle cx={hx} cy={hy} r={64 * pulse} fill={rgba(MD.red, 0.09 + heat * 0.08)} />
        <circle cx={hx} cy={hy} r={34 * pulse} fill={rgba(MD.redHot, 0.2 + heat * 0.14)} />
        <circle cx={hx} cy={hy} r={15} fill={rgba(MD.white, 0.92)} />
      </svg>
    </div>
  );
};

// ── LA CUENTA fuera de la pista: la MISMA luz, posada sobre el material de cada acto ─────────
const Bead: React.FC<{ f: number; x: number; y: number; s?: number; hot?: number }> = ({
  f, x, y, s = 1, hot = 0.6,
}) => {
  const pulse = 0.82 + Math.sin(f / 8) * 0.18;
  const rings: { r: number; a: number; core: boolean }[] = [
    { r: 62, a: 0.1, core: false },
    { r: 30, a: 0.24, core: false },
    { r: 13, a: 0.95, core: true },
  ];
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%", width: 1, height: 1,
        transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 40px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {rings.map((g, i) => {
        const d = g.r * 2 * s * pulse;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: -d / 2, top: -d / 2, width: d, height: d, borderRadius: "50%",
              background: g.core
                ? `radial-gradient(circle, ${rgba(MD.white, 0.95)} 0%, ${rgba(MD.redHot, 0.7)} 68%, rgba(0,0,0,0) 100%)`
                : rgba(i === 1 ? MD.redHot : MD.red, g.a * (0.5 + hot * 0.6)),
            }}
          />
        );
      })}
    </div>
  );
};

// ── Chapita de estación: ESTRUCTURA sobre la pista, nunca protagonista ───────────────────────
const StationTag: React.FC<{ children: React.ReactNode; on: number }> = ({ children, on }) => (
  <div
    style={{
      display: "inline-block", padding: "7px 15px", borderRadius: 4,
      background: `linear-gradient(180deg, ${rgba(MD.ink2, 0.95)} 0%, ${rgba(MD.ink0, 0.95)} 100%)`,
      border: `1px solid ${rgba(MD.red, 0.25 + on * 0.5)}`,
      boxShadow: "0 8px 26px rgba(0,0,0,.6)",
      fontFamily: F_SANS, fontWeight: 800, fontSize: 24, letterSpacing: 3,
      color: rgba(MD.bone, 0.5 + on * 0.5), whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/**
 * Bloque de texto del acto. Entra revelándose por máscara desde abajo y SALE por máscara desde
 * arriba (⛔ nunca un `opacity 0→1` del cuadro). Vive en la capa `<Frame>`, no en la cámara.
 */
const Say: React.FC<{
  f: number; at: number; out?: number; side?: "left" | "right"; kicker?: string;
  w?: number; bottom?: number; children: React.ReactNode;
}> = ({ f, at, out = 0, side = "left", kicker, w = 780, bottom = 104, children }) => {
  const q = clamp01((f - at) / 26);
  const e = interpolate(q, [0, 1], [0, 1], { easing: Easing.out(Easing.poly(4)) });
  const st: React.CSSProperties = {
    position: "absolute", bottom, width: w,
    transform: `translateY(${((1 - e) * 44 + out * 90).toFixed(1)}px)`,
    clipPath: `inset(${((1 - e) * 100).toFixed(1)}% 0% ${(out * 100).toFixed(1)}% 0%)`,
  };
  if (side === "left") st.left = 96; else st.right = 96;
  return (
    <div style={st}>
      <TextBed pad={28}>
        {kicker ? <div style={{ marginBottom: 10 }}><Kicker>{kicker}</Kicker></div> : null}
        {children}
      </TextBed>
    </div>
  );
};

const Detail: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: F_SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.3, marginTop: 14,
      color: rgba(MD.bone, 0.88), textShadow: "0 3px 14px rgba(0,0,0,.9)",
    }}
  >
    {children}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════════════════════
//  EL MOVIMIENTO
// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovLoop: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const D = Math.max(90, durationInFrames);
  const f = Math.min(frame, D - 1);
  const u = clamp01(f / D);
  const F = (x: number) => Math.round(x * D);

  const cam = stageCam(u, 2);   // ⛔ la cámara del video, jamás pisada ni reiniciada
  const tint = movLight(2, u);  // warm → red, sin saltos
  const T = turn(u);
  const heat = clamp01((T - 0.55) / 1.1);

  // fronteras, en frames reales
  const fA = F(A2), fB = F(A3), fC = F(A4), fD = F(A5), fE = F(A6);
  const sinkAt = fA - 28;   // el plato de la jarra empieza a hundirse ANTES del match
  const matchAt = fA - 12;  // A · MATCH-SHAPE
  const occAt = fB - 8;     // B · OCLUSIÓN
  const zoomAt = fC - 6;    // C · ZOOM-THROUGH
  const wipeAt = fD - 14;   // D · WIPE POR MATERIA

  // ventanas de montaje de los actos (las comparte el mundo y la capa de tipografía)
  const on1 = f < fA + 16;
  const on2 = f >= matchAt && f < fB + 4;
  const on3 = f >= fB - 4 && f < fC + 20;
  const on4 = f >= fC - 8 && f < fD + 6;
  const on5 = f >= fD - 12 && f < fE + 46;
  const on6 = f >= fE - 26;

  // progresos compartidos entre mundo y tipografía
  const p4go = eio(0, 1, clamp01((f - wipeAt) / 22));   // el agua se lleva el acto 4
  const p1out = clamp01((f - (fA - 20)) / 28);          // el texto del acto 1 se va con el plato
  const p3out = clamp01((f - (zoomAt - 12)) / 14);      // el texto se va antes del zoom-through
  const p5suck = eio(0, 1, clamp01((f - fE) / 46));     // el moho se come las placas
  const p6 = eio(0, 1, clamp01((f - (fE - 26)) / 54));

  // rampa de ambiente ≤ 15 frames (el contenido ya está desde el frame 0)
  const amb = 0.84 + clamp01(f / 12) * 0.2;

  // ── la pista: chica y baja en la vuelta 1, protagonista en la 2 ──
  const ringScale =
    u < A5 ? lerp(0.44, 0.56, eio(0, 1, clamp01(u / A5)))
      : u < A6 ? lerp(0.56, 0.7, eio(0, 1, clamp01((u - A5) / (A6 - A5))))
        : lerp(0.7, 0.58, eio(0, 1, clamp01((u - A6) / (1 - A6))));
  const ringLift =
    u < A5 ? lerp(430, 260, eio(0, 1, clamp01(u / A5)))
      : lerp(260, 120, eio(0, 1, clamp01((u - A5) / (A6 - A5))));
  const ringZ = f < fD ? 6 : 28;   // sube de capa BAJO el wipe de la frontera D
  const act5Z = f < fD ? 12 : 30;  // ídem: antes del wipe vive DETRÁS del macro del acto 4

  // parallax de la capa de tipografía: respira con la cámara, pero anclada al cuadro
  const hudX = cam.state.panX * 0.05 + Math.sin(f / 71) * 2.2;
  const hudY = cam.state.panY * 0.05 + Math.cos(f / 89) * 1.8;

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* ATMÓSFERA — montada UNA vez para los seis actos, nunca remontada */}
      <Atmos
        tint={tint}
        keyFrom={lerp(0.18, 0.74, eio(0, 1, u))}
        intensity={amb * lerp(0.96, 1.12, Math.sin(u * Math.PI))}
      />
      {/* el cuarto respira rojo desde el suelo a medida que el circuito calienta */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 62% at 50% 118%, ${rgba(MD.red, 0.05 + heat * 0.16)} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />

      {/* ══════════════════════ EL MUNDO (dentro de la cámara) ══════════════════════ */}
      <Space3D depth={1600}>
        <div style={{ position: "absolute", inset: 0, transform: cam.transform, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, transform: actOff(u, f), transformStyle: "preserve-3d" }}>

            {/* ══ LA PISTA — la materia que cruza TODAS las fronteras ══ */}
            <div style={{ position: "absolute", inset: 0, zIndex: ringZ, transformStyle: "preserve-3d" }}>
              <RingTrack f={f} turns={T} scale={ringScale} heat={heat} lift={ringLift} />
            </div>

            {/* ══════════ ACTO 1 · LA JARRA (u 0.00) ══════════ */}
            {on1 && (() => {
              const mp = eio(0, 1, clamp01((f - sinkAt) / 40));
              const q = eio(0, 1, clamp01(f / 40));
              return (
                <div style={{ position: "absolute", inset: 0, zIndex: 10, transformStyle: "preserve-3d" }}>
                  <Space3D depth={1600}>
                    <GlassPlate
                      src={SRC.jug}
                      w={1180} h={640} radius={22}
                      z={-620 * mp}
                      lit={0.74 - mp * 0.5}
                      opacity={1 - mp}
                      focusX={54} focusY={44}
                      sheenAt={14}
                    />
                    {/* la última gota de la jarra = la CUENTA que después vive en la pista */}
                    <Bead f={f} x={lerp(-40, 232, q)} y={lerp(-236, 258, q)} s={0.85 + q * 0.35} hot={0.35} />
                  </Space3D>
                </div>
              );
            })()}

            {/* ══════════ ACTO 2 · LA GOMA · MATCH-SHAPE desde la caja del acto 1 (u 0.15) ══════════ */}
            {on2 && (() => {
              const mp = clamp01((f - matchAt) / 22);
              const open = eio(0, 1, clamp01((f - (matchAt + 26)) / 46));
              const soft = clamp01((f - (matchAt + 70)) / 60);
              const beadQ = eio(0, 1, clamp01((f - matchAt) / 60));
              return (
                <div style={{ position: "absolute", inset: 0, zIndex: 11, transformStyle: "preserve-3d" }}>
                  <Space3D depth={1600}>
                    {/* la MISMA caja del plato de la jarra se vuelve la carta delantera del mazo */}
                    {mp < 1 ? (
                      <MatchShape
                        at={matchAt} dur={22}
                        from={{ w: 1180, h: 640, r: 22 }}
                        to={{ w: 380, h: 240, r: 18 }}
                        src={SRC.rubber}
                      />
                    ) : (
                      <Fan3D
                        items={[
                          { src: SRC.valve, label: <StationTag on={soft}>THE FILL VALVE</StationTag> },
                          { src: SRC.compare, label: <StationTag on={soft}>THE GASKET</StationTag> },
                          { src: SRC.rubber, label: <StationTag on={1}>THE FLAPPER</StationTag> },
                        ]}
                        open={open}
                        w={380} h={240}
                        spread={318} arc={11}
                        z={40}
                        sheenAt={matchAt + 40}
                      />
                    )}
                    {/* la goma se ablanda: el rojo se come el borde de la carta delantera */}
                    <div
                      style={{
                        position: "absolute", left: "50%", top: "50%", width: 396, height: 256,
                        transform:
                          `translate(-50%,-50%) translate3d(${(318 * open).toFixed(1)}px, ${(12 * open).toFixed(1)}px, 46px) ` +
                          `rotateY(${(-11 * open).toFixed(2)}deg)`,
                        borderRadius: 20, pointerEvents: "none", opacity: mp,
                        boxShadow: `inset 0 0 ${(34 + soft * 46).toFixed(0)}px ${rgba(MD.red, 0.2 + soft * 0.45)}`,
                      }}
                    />
                    <Bead f={f} x={lerp(232, 300, beadQ)} y={lerp(258, 96, beadQ)} s={0.9} hot={0.5} />
                  </Space3D>
                </div>
              );
            })()}

            {/* ══════════ ACTO 3 · LA PÁGINA DEL FABRICANTE (u 0.31) ══════════ */}
            {on3 && (() => {
              const q = eio(0, 1, clamp01((f - (fB - 4)) / Math.max(1, fC - fB)));
              const stamp = clamp01((f - (fB + 46)) / 34);
              return (
                <ZoomThrough at={zoomAt} dur={24} into={[31, 47]} scale={8.2}>
                  <div style={{ position: "absolute", inset: 0, zIndex: 24, transformStyle: "preserve-3d" }}>
                    <Space3D depth={1600}>
                      {/* la página, vertical, apoyada, con parallax propio */}
                      <GlassPlate
                        src={SRC.page}
                        w={528} h={700} radius={10}
                        x={-386} y={-14} z={lerp(-40, 130, q)}
                        ry={lerp(13, 4, q)} rz={-1.4}
                        lit={0.85}
                        focusX={50} focusY={lerp(30, 62, q)}
                        sheenAt={fB + 16}
                      >
                        {/* el SELLO rojo que se traza sobre la letra chica — el punto de fuga del zoom */}
                        <div
                          style={{
                            position: "absolute", left: "9%", top: "50%", height: 9,
                            width: `${(stamp * 82).toFixed(1)}%`,
                            background: `linear-gradient(90deg, ${rgba(MD.red, 0.15)}, ${MD.red} 30%, ${MD.redHot})`,
                            boxShadow: `0 0 26px ${rgba(MD.red, 0.85)}`,
                            transform: "rotate(-1.6deg)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute", left: "9%", top: "56%",
                            fontFamily: F_SANS, fontWeight: 900, fontSize: 30, letterSpacing: 2,
                            color: MD.redHot, opacity: stamp,
                            textShadow: "0 3px 16px rgba(0,0,0,.95)",
                          }}
                        >
                          VOIDS THE WARRANTY
                        </div>
                      </GlassPlate>
                      {/* la pastilla azul: el otro papel del expediente, más chico y más atrás */}
                      <GlassPlate
                        src={SRC.tablet}
                        w={392} h={248} radius={12}
                        x={196} y={-192} z={-150} ry={-13} rz={2}
                        lit={0.45} startFrom={18} opacity={0.72}
                        focusX={50} focusY={48}
                      />
                      {/* la cuenta se posa EXACTAMENTE sobre el sello: por ahí entra la cámara */}
                      <Bead f={f} x={-352} y={26} s={0.8 + stamp * 0.5} hot={0.75} />
                    </Space3D>
                  </div>
                </ZoomThrough>
              );
            })()}

            {/* ══════════ ACTO 4 · EL HILITO DE NOCHE, MACRO (u 0.46) ══════════ */}
            {on4 && (() => {
              const q = eio(0, 1, clamp01((f - (fC - 8)) / Math.max(1, fD - fC)));
              const night = clamp01((f - fC) / 40);
              return (
                <div style={{ position: "absolute", inset: 0, zIndex: 13, transformStyle: "preserve-3d" }}>
                  <Space3D depth={1600}>
                    <GlassPlate
                      src={SRC.trickle}
                      w={1560} h={880} radius={16}
                      y={-40 - 660 * p4go}
                      z={lerp(90, 230, q)}
                      rx={lerp(-3, 2, q)} rz={lerp(0.8, -0.6, q)}
                      lit={0.5 + night * 0.35}
                      focusX={48} focusY={lerp(38, 58, q)}
                      sheenAt={fC + 26}
                    />
                    {/* LA SÁBANA DE AGUA DILUIDA: es la costura D, y se lleva la placa con ella */}
                    {p4go > 0 && (
                      <div
                        style={{
                          position: "absolute", left: "-10%", right: "-10%",
                          top: `${(112 - p4go * 150).toFixed(1)}%`, height: "58%",
                          transform: "translateZ(220px)",
                          background:
                            `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(MD.bone, 0.1)} 26%, ` +
                            `${rgba(MD.white, 0.2)} 58%, ${rgba(MD.cold, 0.12)} 82%, rgba(255,255,255,0) 100%)`,
                        }}
                      />
                    )}
                    {/* la cuenta ahora es la gota que baja por la porcelana */}
                    <Bead
                      f={f}
                      x={lerp(-120, 96, q)}
                      y={lerp(-250, 296, q) - 660 * p4go}
                      s={0.7} hot={0.85}
                    />
                  </Space3D>
                </div>
              );
            })()}

            {/* ══════════ ACTO 5 · LA SEGUNDA VUELTA, el circuito entero acelerado (u 0.62) ══════════ */}
            {on5 && (() => {
              const bloom = clamp01((f - (fD + 30)) / 150);
              return (
                <div style={{ position: "absolute", inset: 0, zIndex: act5Z, transformStyle: "preserve-3d" }}>
                  <Space3D depth={1800}>
                    {/* EL MOHO CRECE EN EL CENTRO DEL ARO — la tesis, en material real */}
                    <GlassPlate
                      src={SRC.mold}
                      w={300 + 300 * bloom + 260 * p5suck}
                      h={196 + 196 * bloom + 170 * p5suck}
                      radius={999}
                      y={70} z={-190 + 150 * p5suck}
                      rz={lerp(-2.4, 2.4, Math.sin(f / 90) * 0.5 + 0.5)}
                      lit={0.3 + bloom * 0.4}
                      opacity={0.35 + bloom * 0.65}
                      focusX={52} focusY={50}
                    />
                    {/* las CUATRO estaciones, ahora placas reales que ORBITAN la pista */}
                    {STATIONS.map((st, i) => {
                      const pt = ringPoint(T + i * 0.25);
                      const sc = 0.56 + pt.front * 0.66;
                      const inward = 1 - p5suck;
                      return (
                        <GlassPlate
                          key={i}
                          src={st.src}
                          w={318 * sc} h={202 * sc} radius={14}
                          x={pt.x * inward}
                          y={pt.y * inward - 34}
                          z={pt.z * inward - 40 * p5suck}
                          ry={lerp(26, -26, pt.front)}
                          rz={lerp(2.6, -2.6, pt.front)}
                          lit={0.18 + pt.front * 0.78}
                          opacity={(0.34 + pt.front * 0.66) * (1 - p5suck * 0.9)}
                          startFrom={i * 9}
                          focusX={50} focusY={46}
                        />
                      );
                    })}
                  </Space3D>
                </div>
              );
            })()}

            {/* ══════════ ACTO 6 · el aro se aplasta en UNA línea roja (u 0.90) ══════════ */}
            {on6 && (() => {
              const line = clamp01((f - (fE + 22)) / 40);
              return (
                <div style={{ position: "absolute", inset: 0, zIndex: 34, transformStyle: "preserve-3d" }}>
                  <div
                    style={{
                      position: "absolute", left: "50%", bottom: 168,
                      transform: "translateX(-50%) translateZ(90px)",
                      width: `${(line * 54).toFixed(1)}%`, height: 4,
                      background: `linear-gradient(90deg, rgba(0,0,0,0), ${MD.red} 22%, ${MD.redHot} 50%, ${MD.red} 78%, rgba(0,0,0,0))`,
                      boxShadow: `0 0 30px ${rgba(MD.red, 0.85)}`,
                    }}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </Space3D>

      {/* polvo del cuarto: hold vivo permanente, montado UNA vez */}
      <AbsoluteFill style={{ zIndex: 44, pointerEvents: "none" }}>
        <Motes n={40} tint={heat > 0.5 ? MD.redHot : MD.bone} speed={0.8 + heat * 0.8} />
      </AbsoluteFill>

      {/* ══════════════════════ LA CAPA DE TIPOGRAFÍA (anclada al cuadro) ══════════════════════ */}
      {/* Una idea de texto por acto, titular ≥48 px, detalle 31 px, safe area 96 px. */}
      <AbsoluteFill
        style={{
          zIndex: 45, pointerEvents: "none",
          transform: `translate3d(${hudX.toFixed(2)}px, ${hudY.toFixed(2)}px, 0)`,
        }}
      >
        {on1 && p1out < 1 && (
          <>
            <div style={{ position: "absolute", left: 96, top: 96, opacity: 1 - p1out }}>
              <StationTag on={1}>{STATIONS[0].tag}</StationTag>
            </div>
            <Say f={f} at={12} out={p1out} kicker="THE CIRCUIT">
              <Title size={82}>CHLORINE <Em>eats rubber</Em>.</Title>
              <Detail>Not all at once. Slowly — every single flush.</Detail>
            </Say>
          </>
        )}

        {/* el texto del acto 2 se apaga BAJO la oclusión de la frontera B, nunca a la vista */}
        {on2 && f < fB - 2 && (
          <Say f={f} at={matchAt + 20} side="right" w={720} kicker={STATIONS[1].tag}>
            <Title size={66}>FIRM AND GRIPPY. THEN <Em>soft and slick</Em>.</Title>
            <Detail>The flapper. The fill-valve seals. The gasket goes brittle.</Detail>
          </Say>
        )}

        {on3 && p3out < 1 && (
          <Say f={f} at={fB + 12} out={p3out} side="right" w={700} kicker="03 · READ THE MAKER">
            <Title size={70}>THEY <Em>print it themselves</Em>.</Title>
            <Detail>Chlorine tablets in the tank can void the parts warranty.</Detail>
          </Say>
        )}

        {on4 && p4go < 1 && (
          <>
            <div style={{ position: "absolute", left: 96, top: 92, opacity: 1 - p4go }}>
              <StationTag on={1}>{STATIONS[2].tag}</StationTag>
            </div>
            <Say f={f} at={fC + 14} out={p4go} w={840} kicker="EVERY NIGHT, ALL NIGHT">
              <Title size={76}>THE LEAK RUNS <Em>all night</Em>.</Title>
              <Detail>Clean water trickles in. Anything you added is rinsed away.</Detail>
            </Say>
          </>
        )}

        {on5 && (
          <>
            <div style={{ position: "absolute", left: 96, top: 88, opacity: 1 - p5suck }}>
              <StationTag on={1}>{STATIONS[3].tag}</StationTag>
            </div>
            {/* contador de vueltas: dato de estructura, chico y vivo */}
            <div
              style={{
                position: "absolute", right: 96, top: 84,
                fontFamily: F_SANS, fontWeight: 900, fontSize: 46, letterSpacing: 4,
                color: rgba(MD.redHot, 0.55 + Math.sin(f / 11) * 0.2),
                textShadow: "0 4px 20px rgba(0,0,0,.95)",
              }}
            >
              LAP {Math.min(2, Math.floor(T) + 1)} / 2
            </div>
            <Say f={f} at={fD + 16} out={p5suck} side="right" w={760} kicker="THE LOOP CLOSES">
              <Title size={70}>AND THE MOLD COMES BACK <Em>faster</Em>.</Title>
              <Detail>Second lap — half the time. The bleach built the machine.</Detail>
            </Say>
          </>
        )}

        {on6 && (
          <AbsoluteFill
            style={{
              alignItems: "center", justifyContent: "center",
              transform: `translateY(${((1 - p6) * 260).toFixed(1)}px)`,
            }}
          >
            <div
              style={{
                width: Math.min(1260, width - 220), textAlign: "center",
                clipPath: `inset(${((1 - p6) * 100).toFixed(1)}% 0% 0% 0%)`,
              }}
            >
              <TextBed pad={38}>
                <Title size={62}>NOT DESPITE THE BLEACH.</Title>
                <div style={{ height: 8 }} />
                <Title size={92}><Em>Because of it.</Em></Title>
                <Detail>
                  Bleach doesn&rsquo;t just fail in a toilet — it builds the machine that makes it fail faster.
                </Detail>
              </TextBed>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      {/* ══ LAS COSTURAS ══ (⛔ ninguna es un fade · ⛔ no hay dos iguales seguidas) */}
      <AbsoluteFill style={{ zIndex: 60, pointerEvents: "none" }}>
        {/* A · el barrido especular que acompaña el MATCH-SHAPE (luz que cruza, no un fundido) */}
        <Sheen at={matchAt} dur={24} angle={16} />
        {/* B · OCLUSIÓN: la goma negra cruza y tapa el 100 % ~5 frames */}
        <Occluder at={occAt} dur={15} color={MD.ink1} angle={-9} />
        {/* D · WIPE POR MATERIA: el agua diluida */}
        <VaporWipe at={wipeAt} dur={26} />
        {/* el beat de la segunda vuelta: cada estación pasa con un golpe de luz roja */}
        {f >= fD && f < fE && (() => {
          const k = (T * 4) % 1;
          const hit = k < 0.08 ? 1 - k / 0.08 : 0;
          return hit > 0 ? (
            <AbsoluteFill
              style={{
                background: `radial-gradient(120% 90% at 50% 60%, ${rgba(MD.red, 0.16 * hit)} 0%, rgba(0,0,0,0) 70%)`,
              }}
            />
          ) : null;
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
