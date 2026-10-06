// ════════════════════════════════════════════════════════════════════════════════════════════
//  MovLetter.tsx — MOVIMIENTO 3 del video `mdbleach` (canal Mike Dalton, EN).
//  ~1500 frames @ 30 fps (50 s). UN SOLO MOVIMIENTO CONTINUO en 6 ACTOS que se FUNDEN.
//  ⛔ No es una sucesión de componentes: es UNA escena. UNA atmósfera montada UNA vez, UNA
//     cámara (`stageCam(p,3)`) que ningún acto reinicia, UNA luz que evoluciona, y MATERIA que
//     cruza las cinco fronteras. Sin avatar en el medio.
//
//  ── LA HISTORIA ────────────────────────────────────────────────────────────────────────────
//  Mike escribió una carta de reclamo furiosa al fabricante del flapper. Tres flappers en
//  catorce meses. En la cuarta visita, tirado en el piso del baño con la tapa del tanque afuera,
//  gira la cabeza y ahí está la jarra de lejía detrás del desatascador, tapa costrosa, chorreados
//  secos. Una tapita cada noche, más de un año, a metro y medio de donde estaba arrodillado.
//  La pieza que falló no era el flapper. Era él. Nunca mandó la corrección.
//
//  ── LA MATERIA QUE CRUZA TODO: **LA TINTA** ────────────────────────────────────────────────
//  UN solo trazo (`D_SCRAWL` — la MISMA data de path en los seis actos: la misma mano, la misma
//  sustancia) recorre el movimiento y cambia de MATERIAL sin cambiar de FORMA:
//     acto 1  tinta NEGRA-ROJA húmeda escribiéndose sobre la carta, con su punta mojada
//     acto 2  el mismo trazo se despega de la hoja y se parte en tres PALOTES: la cuenta
//     acto 3  los tres palotes vuelven a unirse y escriben la acusación sobre el sobre; el
//             solapado del sobre CLIPEA la tinta → queda sellada adentro
//     acto 4  el trazo REAPARECE girado 92° y en color HUESO: son los chorreados secos que
//             bajan por el costado de la jarra. La tinta que lo acusaba a ellos lo acusa a él.
//     acto 5  el trazo se multiplica en 392 palotes de costra: una tapita por noche, un año
//     acto 6  los palotes se FUGAN al punto de fuga y son las rayas de la ruta; y sobre la
//             ficha de la carta un trazo ARRANCA y SE CORTA a mitad (`cut = 0.44`): la
//             corrección que nunca mandó.
//
//  ── EL VIAJE ───────────────────────────────────────────────────────────────────────────────
//  mesa CALIENTE de la cocina → piso FRÍO del baño → cabina de la camioneta (ámbar de ruta).
//  El frío del acto 4 NO es un repintado: es una SEGUNDA fuente (relleno frío bajo-izquierda)
//  que entra y se retira en rampa; la key de `movLight(3, ·)` sigue haciendo su viaje red→warm.
//
//  ════════════════════════════════════════════════════════════════════════════════════════════
//   TABLA DE HANDOFF   (fracciones de `durationInFrames`; nada se reinicia)
//  ════════════════════════════════════════════════════════════════════════════════════════════
//
//  ACTO 1 · LA CARTA · p 0.000 → 0.170
//    enterFrom cam { CAM_ARC[3].from = z .62 · panX 40 · panY −24 · ry 9 · rz −.8 · offsets 0 }
//              luz { 'red' heredada de MovLoop: el aro del circuito del cloro se apaga en 45 f
//                    sobre la bombita cálida de la cocina · key .30 (izquierda) }
//              materia { el ROJO del cloro que dejó el movimiento anterior }
//    exitTo    cam { offset panX −44 · panY +16 · ry −3 — la cámara ya bajó a la mesa }
//              luz { bombita cálida plena · key .30→.36 · intensity 1.02 }
//              materia { la carta ya no es escena: es una FICHA de 384×248 + su trazo }
//    ── FRONTERA A · MATCH-SHAPE ────────────────────────────────────────────────────────────
//       EL MISMO NODO DOM (misma `GlassPlate`, mismo clip corriendo adentro, misma `Sequence`)
//       se angosta de 1500×844 a 384×248 y aterriza EXACTO en la ranura frontal del mazo; las
//       otras dos cartas se abren desde DETRÁS de ella. Se elige match-shape porque los dos
//       lados tienen un rectángulo protagonista y el concepto es literal: la carta se archiva
//       como un caso más. La TINTA se despega de la hoja y vuela a ser el primer palote.
//
//  ACTO 2 · TRES VECES · p 0.170 → 0.345
//    enterFrom cam { offsets del acto 1, ya viajando a la derecha }
//              luz { cálida plena · key .36→.44 · intensity 1.06 (con parpadeo de bombita) }
//              materia { la ficha de la carta + el trazo hecho palote }
//    exitTo    cam { offset panX +96 · el mazo se ZAMBULLE hacia la cámara (z +520) }
//              luz { key .44 · intensity 1.06 }
//              materia { el mazo entero viniendo a cámara → la banda de tinta }
//    ── FRONTERA B · OCLUSIÓN (<Occluder/>) ─────────────────────────────────────────────────
//       Una banda de TINTA cruza y tapa el 100 % del cuadro ~9 frames (at B2−9, dur 18: la
//       cobertura total va de B2−4.3 a B2+4.3). Se elige oclusión porque es el cambio de
//       MATERIAL más duro del movimiento (goma+mano → papel+piel) y encima cambia el tema (la
//       cuenta → el insulto): hay que TAPAR. Los tres palotes convergen DENTRO de la banda —
//       se los ve entrar de un lado y salir del otro escribiendo sobre el sobre.
//
//  ACTO 3 · NO ERA CONFUSIÓN, ERA INSULTO · p 0.345 → 0.505
//    enterFrom cam { offset panX +90 frenando sobre el sobre }
//              luz { cálida BAJA e íntima (intensity 0.94) · key .44→.52 }
//              materia { los tres palotes reunidos = la acusación escrita }
//    exitTo    cam { VECTOR a la izquierda YA lanzado: −2100 px en 38 f, scaleX 1.22 }
//              luz { la cálida pierde densidad: 0.94 → 0.86 }
//              materia { el sobre CERRADO con la tinta sellada adentro, en movimiento }
//    ── FRONTERA C · MATCH-MOVE (whip) ──────────────────────────────────────────────────────
//       Nadie frena. El sobre sale por izquierda con estiramiento horizontal y estelas; el piso
//       del baño ENTRA por derecha desde +2100 px a la MISMA velocidad y desacelera. La costura
//       es el VECTOR DE LA CÁMARA, no un corte. Se elige match-move porque hay que VIAJAR de la
//       cocina al baño sin cortar y los dos lados ya están en movimiento.
//
//  ACTO 4 · EL GIRO DE CABEZA · p 0.505 → 0.715      (⚡ EL GOLPE en p ≈ 0.616)
//    enterFrom cam { llegando desde la derecha, desacelerando · relleno FRÍO entrando en rampa }
//              luz { cálida perdiendo densidad + fill frío bajo-izquierda (0 → .36) }
//              materia { el sobre convertido en el borde del tanque }
//    ⚡ EL GOLPE — ⛔ ni fundido ni cartel: es CÁMARA y LUZ.
//       · 10 f de ANTICIPACIÓN: micro-contra a la izquierda (impulso −0.26).
//       · SWING: ry −19° · rz +2.7° · x +280 px · scaleX 1.14 · estelas frías horizontales.
//       · la KEY SALTA de izquierda (.36) a derecha (.76) y la intensidad CAE a 0.46 durante
//         3 frames: es la lámpara pasando por detrás de la cabeza. ⛔ NO es negro: es contraluz.
//       · el impulso decae con OSCILACIÓN AMORTIGUADA (exp·cos): los ojos tardan en alcanzar
//         a la cabeza. Ese rebote es lo que lo hace doler.
//       · h33 se va a translateZ +520 por izquierda; h34 YA ESTÁ entrando por derecha: la
//         cámara no la descubre, la ALCANZA.
//       · 2 frames de pop especular sobre la jarra y ahí queda, quieta y culpable.
//       · el clip del piso se congela 28 f ANTES del golpe (se le acabó el material) → esa
//         quietud es exactamente la respiración previa al giro. Está buscada.
//    exitTo    cam { asentada, empujando sobre la tapa costrosa }
//              luz { fill frío en pico (.62) empezando a retirarse · key .76 }
//              materia { los chorreados HUESO bajando por el costado de la jarra }
//    ── FRONTERA D · ZOOM-THROUGH (<ZoomThrough/>) ──────────────────────────────────────────
//       La cámara ATRAVIESA la tapa costrosa (into 56 %/42 %, ×8, 18 f) y sale en el MACRO de
//       la MISMA tapa, que llega a escala 2.35 y desacelera a 1.00 en 40 f. Se elige
//       zoom-through porque es exactamente plano general → macro SOBRE EL MISMO OBJETO: acá no
//       se corta, se ENTRA.
//
//  ACTO 5 · UNA TAPITA CADA NOCHE · p 0.715 → 0.855
//    enterFrom cam { el macro aterrizando: la desaceleración del zoom ES la continuidad }
//              luz { fill frío retirándose (.62 → .12) · key .76→.68 }
//              materia { los chorreados hueso, ahora en macro }
//    exitTo    cam { retroceso suave · panY +30 (el arco pide bajar) }
//              luz { cálida de vuelta · intensity 0.96 }
//              materia { 392 palotes de costra ya empezando a fugarse al punto de fuga }
//    ── FRONTERA E · WIPE POR MATERIA (<VaporWipe/>) ────────────────────────────────────────
//       El vaho de lejía cruza de izquierda a derecha 24 f y el borde de ataque del vaho VA
//       REVELANDO el acto 6 (clip-path sincronizado con el barrido: ⛔ no hay opacidad, hay
//       BORDE). Se elige wipe por materia porque acá no hay que ocultar un objeto: hay que
//       cambiar de LUGAR mientras la materia (palotes → rayas de la ruta) sobrevive A LA VISTA,
//       por encima del vaho. El vaho lo sigue hasta la camioneta.
//
//  ACTO 6 · YO FUI LA PIEZA QUE FALLÓ · p 0.855 → 1.000
//    enterFrom cam { panY +30 heredado, entrando a la cabina · plano a sangre 2060×1160 }
//              luz { ámbar de ruta · key .68→.60 · intensity 0.96→0.98 }
//              materia { las rayas de la ruta = los palotes }
//    exitTo    cam { CAM_ARC[3].to = z .34 · panX 96 · panY 30 · ry 4 · rz .4 — offsets locales
//                    de vuelta a 0: ⛔ NO se pisa `stageCam` al final }
//              luz { 'warm' plena — MovTruck arranca frío y limpio DESDE acá }
//              materia { la ficha de la carta con el trazo CORTADO a mitad + las rayas }
//    El último frame queda ENCENDIDO (⛔ nunca cerrar a negro).
//
//  ── AVATAR ─────────────────────────────────────────────────────────────────────────────────
//  Este movimiento TAPA el avatar de punta a punta. Decisión consciente: el material real de
//  los seis actos ES Mike (su mesa, su cara, sus manos, su piso, su camioneta), así que su
//  presencia está garantizada sin abrir un hueco en la continuidad. No hay ventana de avatar.
//
//  ── LOS CLIPS DURAN 5,04 s (151 frames de línea de tiempo). CÓMO SE RESUELVE ───────────────
//  `OffthreadVideo` lee el frame del contexto: sin `Sequence`, en el frame 900 pediría el
//  segundo 30 de un clip de 5 s. Por eso TODA tarjeta con .mp4 va dentro de `<Clip>` (una
//  `Sequence layout="none"` que fija el origen temporal del material). La geometría se calcula
//  SIEMPRE afuera con el frame GLOBAL, así que el material y el movimiento son independientes.
//  Política deliberada, clip por clip:
//    · CONGELAR donde el cuadro quieto ES lo que corresponde y el momento está elegido:
//      la carta se congela EXACTAMENTE cuando él termina de escribir (f 151) y ahí empieza a
//      encogerse; el sobre se congela DENTRO del barrido del solapado (ya está cerrado); el
//      piso se congela 28 f antes del giro (la respiración previa); las tres fichas del mazo se
//      congelan cuando el mazo se ZAMBULLE hacia la cámara (el movimiento lo pone la cámara).
//    · REBOBINAR sólo donde el movimiento no puede parar: el plano de la camioneta (`len` 148).
//      En un POV de manejo el rebobinado se lee como ruta que sigue; encima cae con el destello
//      del parabrisas (`sheenAt` local 138).
//  Las camas de fondo van en `.jpg` a propósito: una foto nunca se congela.
//
//  ── CONTRATO TÉCNICO ───────────────────────────────────────────────────────────────────────
//  ⛔ Math.random / Date.now / new Date → `rnd(i)` · ⛔ backdrop-filter · ⛔ filter:blur grande a
//  pantalla completa · ⛔ Easing.quint (NO EXISTE) → Easing.poly(5) · ⛔ Easing.out(undefined) ·
//  `Space3D` POR ACTO (⚠️ `transform: perspective()` NO crea contexto 3D, y `clip-path`/`opacity`
//  aplanan el subárbol: por eso el `clipPath` del acto 6 y el `scale` del ZoomThrough van POR
//  FUERA de su `Space3D`) · zIndex EXPLÍCITO en cada frontera · rutas relativas (Material /
//  GlassPlate aplican `staticFile`) · safe area 60 px · rampas ≤15 f · titular ≥48 px, detalle
//  ≥30 px · hold VIVO (cámara, tinta, polvo: nada quieto) · imports SÓLO de remotion/react/./Stage.
// ════════════════════════════════════════════════════════════════════════════════════════════

import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  MD,
  F_SANS,
  F_SERIF,
  rgba,
  lerp,
  clamp01,
  rnd,
  Atmos,
  Motes,
  Space3D,
  Material,
  GlassPlate,
  Fan3D,
  ZoomThrough,
  Occluder,
  VaporWipe,
  Kicker,
  Title,
  Em,
  TextBed,
  stageCam,
  movLight,
} from "./Stage";

/* ── utilidades puras ───────────────────────────────────────────────────────────────────── */
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ID = (x: number) => x;
const ip = (f: number, inR: number[], outR: number[], e: (x: number) => number = ID) =>
  interpolate(f, inR, outR, { ...CL, easing: e });

const E_SOFT = Easing.bezier(0.22, 0.61, 0.28, 1);
const E_SNAP = Easing.bezier(0.62, 0.02, 0.12, 1);
const E_OVER = Easing.bezier(0.2, 1.42, 0.32, 1); // overshoot sin Easing.back
const E_OUT = Easing.out(Easing.cubic);
const E_IN = Easing.in(Easing.cubic);
const E_LONG = Easing.bezier(0.16, 0.84, 0.24, 1);
const E_DEEP = Easing.out(Easing.poly(5)); // ⛔ Easing.quint NO EXISTE

/* ── RUTAS DE MATERIAL REAL (⛔ un 404 mata el chunk entero del farm) ────────────────────── */
const M = {
  letter: "broll/mdbleach_h30_kitchenletter.mp4", // Mike escribiendo a mano bajo la bombita
  letterJpg: "img/mdbleach_h30_kitchenletter.jpg", // la misma toma, como ficha archivada
  faceJpg: "img/mdbleach_h31_letterface.jpg", // cama profunda del acto 1
  face: "broll/mdbleach_h31_letterface.mp4", // su cara, mandíbula apretada
  flapper: "broll/mdbleach_h26_flapperhand.mp4", // el flapper blando en su mano (viene del Mov2)
  envelope: "broll/mdbleach_h32_envelope.mp4", // MACRO: manos alisando el sobre cerrado
  floor: "broll/mdbleach_h33_floorlidoff.mp4", // tirado en el piso, brazo en el tanque
  jug: "broll/mdbleach_h34_jugbehindplunger.mp4", // ⚡ EL REVEAL: la jarra tras el desatascador
  cap: "broll/mdbleach_h36_crustedcap.mp4", // MACRO de la tapa costrosa y los chorreados
  realise: "broll/mdbleach_h35_realisation.mp4", // su cara en el piso, mandíbula floja
  driving: "broll/mdbleach_h37_driving.mp4", // manejando, mirando la ruta
} as const;

/* ════════════════════════════════════════════════════════════════════════════════════════════
   CLIP — origen temporal del material real.
   Una `Sequence layout="none"` (⛔ sin `layout="none"` mete un AbsoluteFill que APLANA el 3D)
   cuyo `from` se recalcula por frame. Con `len` grande el clip corre una sola vez y se congela;
   con `len` = 148 rebobina. La geometría se calcula afuera con el frame GLOBAL: el reinicio del
   material NO toca ni posición ni escala.
   ════════════════════════════════════════════════════════════════════════════════════════════ */
const NOLOOP = 100000;
const Clip: React.FC<{ start: number; len?: number; children: React.ReactNode }> = ({
  start,
  len = NOLOOP,
  children,
}) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, Math.floor((frame - start) / len));
  return (
    <Sequence from={start + k * len} durationInFrames={len} layout="none">
      {children}
    </Sequence>
  );
};

/* ── LA TINTA ───────────────────────────────────────────────────────────────────────────── */
// UNA sola data de path para todo el movimiento: es la MISMA mano y la MISMA sustancia. Entre
// actos cambian el color, la escala y el giro — nunca la forma.
const D_SCRAWL =
  "M 14 78 C 44 20, 70 106, 100 58 C 124 20, 143 98, 168 64 C 196 28, 215 102, 246 66 " +
  "C 272 36, 291 98, 320 62 C 348 28, 369 100, 400 66 C 428 36, 449 102, 480 64 " +
  "C 508 32, 529 98, 560 62 C 585 36, 607 86, 626 54";
const D_UNDER = "M 10 96 C 118 70, 302 114, 470 76 C 541 60, 591 88, 630 70";
const D_TALLY = "M 22 6 C 29 40, 13 78, 21 114";

const INK = "#150F10"; // tinta seca sobre papel bajo bombita
const INK_WET = "#5B1A14"; // el brillo húmedo del trazo recién hecho
const CRUST = "#E8E2D6"; // la costra de lejía: hueso, no blanco puro

/**
 * Un trazo que se ESCRIBE (⛔ nunca aparece de golpe). `pathLength={1}` normaliza la longitud
 * del path: el dibujado es determinístico sin medir nada en runtime.
 * `cut` recorta el avance máximo — 0.44 = el trazo se corta a mitad y NO sigue nunca más.
 */
const Ink: React.FC<{
  f: number;
  at: number;
  dur: number;
  d: string;
  vb: [number, number];
  color?: string;
  width?: number;
  glow?: number;
  cut?: number;
  wet?: boolean;
  opacity?: number;
}> = ({ f, at, dur, d, vb, color = INK, width = 8, glow = 0, cut = 1, wet = false, opacity = 1 }) => {
  const p = Math.min(cut, clamp01((f - at) / dur));
  if (p <= 0.001) return null;
  return (
    <svg
      viewBox={`0 0 ${vb[0]} ${vb[1]}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%", overflow: "visible", opacity, display: "block" }}
    >
      {/* halo de absorción: la tinta moja el papel alrededor del trazo */}
      <path
        d={d}
        fill="none"
        stroke={rgba(color, 0.3)}
        strokeWidth={width * 2.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        style={glow > 0 ? { filter: `drop-shadow(0 0 ${glow}px ${rgba(color, 0.85)})` } : undefined}
      />
      {/* la punta HÚMEDA: sólo el pedacito que se está escribiendo AHORA */}
      {wet && p < cut && (
        <path
          d={d}
          fill="none"
          stroke={INK_WET}
          strokeWidth={width * 0.55}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.045 1"
          strokeDashoffset={1 - p}
          opacity={0.85}
        />
      )}
    </svg>
  );
};

/** La tinta DESPEGÁNDOSE de una superficie y viajando a la siguiente: cruza la frontera a la vista. */
const InkTravel: React.FC<{
  f: number;
  at: number;
  dur: number;
  from: { x: number; y: number; s: number; r: number };
  to: { x: number; y: number; s: number; r: number };
  w: number;
  color?: string;
  width?: number;
}> = ({ f, at, dur, from, to, w, color = INK_WET, width = 9 }) => {
  const t = ip(f, [at, at + dur], [0, 1], E_LONG);
  const x = lerp(from.x, to.x, t);
  const y = lerp(from.y, to.y, t);
  const s = lerp(from.s, to.s, t);
  const r = lerp(from.r, to.r, t);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: (w * 120) / 640,
        transform:
          `translate(-50%,-50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
          `rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`,
        opacity: 0.94,
      }}
    >
      <Ink f={f} at={at - 60} dur={1} d={D_SCRAWL} vb={[640, 120]} color={color} width={width} glow={3} />
    </div>
  );
};

/* ── LOS PALOTES: una tapita por noche ──────────────────────────────────────────────────── */
// 392 palotes de costra. Primero son una CUENTA pegada a la pared; después se FUGAN al punto de
// fuga y son las rayas de la ruta del acto 6. Todo determinístico (`rnd`), ⛔ nada de random.
const TickField: React.FC<{
  f: number;
  n: number;
  drawAt: number;
  drawDur: number;
  morphAt: number;
  morphDur: number;
}> = ({ f, n, drawAt, drawDur, morphAt, morphDur }) => {
  const m = ip(f, [morphAt, morphAt + morphDur], [0, 1], E_LONG);
  const cols = 28;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const born = drawAt + (i / n) * drawDur;
        const a = clamp01((f - born) / 7);
        if (a <= 0.001) return null;
        const cx = i % cols;
        const cy = Math.floor(i / cols);
        // ── la cuenta en la pared
        const gx = 246 + cx * 50 + (cy % 2) * 5;
        const gy = 306 + cy * 39;
        const gr = -9 + rnd(i * 2.3) * 18;
        // ── la ruta: fuga a un punto
        const depth = Math.pow(((i * 37) % 100) / 100, 2.15); // 0 = lejos · 1 = cerca
        const rx = 968 + (rnd(i * 5.9) - 0.5) * 118 * depth + (rnd(i * 8.3) - 0.5) * 24;
        const ry = 486 + depth * 690;
        const x = lerp(gx, rx, m);
        const y = lerp(gy, ry, m);
        const w = lerp(5, 3 + depth * 15, m);
        const h = lerp(27, 7 + depth * 96, m);
        const rot = lerp(gr, 0, m);
        const o = a * lerp(0.42 + rnd(i * 1.7) * 0.5, 0.16 + depth * 0.84, m);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: w / 2,
              transform: `translate(-50%,-50%) rotate(${rot.toFixed(2)}deg)`,
              background: rgba(CRUST, o),
              boxShadow:
                m > 0.5 ? `0 0 ${(11 * depth * m).toFixed(1)}px ${rgba(CRUST, 0.25 * m * depth)}` : "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ── ESTELAS de movimiento (⛔ nada de filter:blur a pantalla completa: se recalcula por frame) */
const Streaks: React.FC<{ f: number; at: number; dur: number; dir?: number; tint?: string; n?: number }> = ({
  f,
  at,
  dur,
  dir = -1,
  tint = MD.bone,
  n = 12,
}) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const o = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o * 0.55, overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => {
        const s = rnd(i * 4.13);
        const off = dir * (p * 260 + s * 180);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${-30 + s * 70 + off * 0.4}%`,
              top: `${4 + s * 92}%`,
              width: `${52 + s * 66}%`,
              height: 2 + rnd(i * 9.7) * 12,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(tint, 0.16 + s * 0.2)} 48%, rgba(0,0,0,0) 100%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ── TEXTO: bloques semánticos, palabra por palabra (⛔ nunca un opacity global) ─────────── */
const Words: React.FC<{
  f: number;
  at: number;
  text: string;
  size: number;
  color?: string;
  step?: number;
  serifOn?: string[];
  accent?: string;
}> = ({ f, at, text, size, color = MD.white, step = 3.2, serifOn, accent = MD.redHot }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: `0 ${Math.round(size * 0.22)}px`,
      fontFamily: F_SANS,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.04,
      color,
      textShadow: "0 6px 30px rgba(0,0,0,0.92), 0 2px 6px rgba(0,0,0,0.85)",
    }}
  >
    {text.split(" ").map((w, i) => {
      const t0 = at + i * step;
      const o = ip(f, [t0, t0 + 10], [0, 1], E_OUT);
      const y = ip(f, [t0, t0 + 15], [30, 0], E_OUT);
      const bare = w.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      const isSerif = (serifOn ?? []).some((s) => s.toUpperCase() === bare);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: o,
            transform: `translateY(${y.toFixed(1)}px)`,
            ...(isSerif
              ? { fontFamily: F_SERIF, fontStyle: "italic" as const, fontWeight: 500, color: accent }
              : null),
          }}
        >
          {w}
        </span>
      );
    })}
  </div>
);

/** Bloque de texto anclado por `bottom`/`left` (safe area, ⛔ nunca por top con translateZ alto). */
const Say: React.FC<{
  f: number;
  in0: number;
  out0: number;
  left?: number;
  bottom?: number;
  width?: number;
  children: React.ReactNode;
}> = ({ f, in0, out0, left = 96, bottom = 104, width = 1180, children }) => {
  const dy = ip(f, [out0, out0 + 22], [0, 210], E_IN);
  const clip = ip(f, [out0 + 2, out0 + 22], [0, 100], E_IN);
  const inY = ip(f, [in0, in0 + 14], [40, 0], E_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        transform: `translateY(${(dy + inY).toFixed(1)}px)`,
        clipPath: `inset(0 0 ${clip.toFixed(1)}% 0)`,
      }}
    >
      <TextBed pad={30}>{children}</TextBed>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ════════════════════════════════════════════════════════════════════════════════════════════ */
export const MovLetter: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const f = useCurrentFrame();
  const D = durationInFrames;
  const p = clamp01(f / D);
  const F = (x: number) => Math.round(x * D);

  // ── LAS FRONTERAS, como FRACCIONES de D (el build las ancla al ms real, ±20 %)
  const B1 = F(0.17); //  A · MATCH-SHAPE
  const B2 = F(0.345); //  B · OCLUSIÓN
  const B3 = F(0.505); //  C · MATCH-MOVE (whip)
  const B4 = F(0.715); //  D · ZOOM-THROUGH
  const B5 = F(0.855); //  E · WIPE POR MATERIA
  const HT = B3 + Math.round((B4 - B3) * 0.53); // ⚡ EL GIRO DE CABEZA

  // ── LA CÁMARA: una sola, del frame GLOBAL del movimiento. ⛔ ningún acto la reinicia.
  const cam = stageCam(p, 3);

  // Offsets de acto: rampas CLAMPEADAS que se SUMAN → continuas por construcción (C0).
  const ox =
    ip(f, [0, B1], [0, -44], E_SOFT) +
    ip(f, [B1, B2], [0, 140], E_SOFT) +
    ip(f, [B2, B3 - 12], [0, -50], E_SOFT) +
    ip(f, [B3 - 12, B3], [0, -240], E_SNAP) +
    ip(f, [B3, B3 + 32], [0, 242], E_OUT) +
    ip(f, [B3 + 32, B4], [0, -78], E_SOFT) +
    ip(f, [B4, B5], [0, 58], E_SOFT) +
    ip(f, [B5, D], [0, -58], E_SOFT);
  const oy =
    ip(f, [0, B1], [0, 16], E_SOFT) +
    ip(f, [B1, B2], [0, -10], E_SOFT) +
    ip(f, [B2, B3], [0, 22], E_SOFT) +
    ip(f, [B3, B4], [0, -30], E_SOFT) +
    ip(f, [B4, B5], [0, 18], E_SOFT) +
    ip(f, [B5, D], [0, -16], E_SOFT);
  const ory =
    ip(f, [0, B1], [0, -3], E_SOFT) +
    ip(f, [B1, B2], [0, 5], E_SOFT) +
    ip(f, [B2, B3], [0, -4], E_SOFT) +
    ip(f, [B3, B4], [0, 3], E_SOFT) +
    ip(f, [B4, D], [0, -3], E_SOFT);

  // ⚡ EL GOLPE: anticipación + swing + oscilación amortiguada (exp·cos). Arranca y termina en 0.
  const hitK = f >= HT ? Math.exp(-(f - HT) / 11) * Math.cos((f - HT) / 5.6) : 0;
  const swing = ip(f, [HT - 10, HT], [0, -0.26], E_IN) + hitK;
  const hitSX = 1 + Math.abs(swing) * 0.14;

  // respiración: ⛔ nada perfectamente quieto, nunca
  const bx = Math.sin(f / 49) * 2.3 + Math.sin(f / 113) * 1.5;
  const by = Math.cos(f / 63) * 1.9;

  const worldTransform =
    `${cam.transform} translate3d(${(ox + bx + swing * 280).toFixed(2)}px, ${(oy + by).toFixed(2)}px, 0) ` +
    `rotateY(${(ory + swing * -19).toFixed(3)}deg) rotateZ(${(swing * 2.7).toFixed(3)}deg) ` +
    `scaleX(${hitSX.toFixed(4)})`;

  // ── LA LUZ. `movLight(3,·)` hace el viaje 'red' → 'warm'; la curva lo resuelve rápido porque
  //    el rojo del cloro es una RESACA del movimiento anterior, no el color de esta escena.
  const L = movLight(3, Math.pow(p, 0.55));
  // la key VIAJA: bombita de la cocina (izq) → SALTA a la derecha en el giro → ruta
  const keyFrom =
    0.3 +
    ip(f, [0, B2], [0, 0.14], E_SOFT) +
    ip(f, [B2, B3], [0, 0.08], E_SOFT) +
    ip(f, [HT - 2, HT + 8], [0, 0.24], E_SNAP) +
    ip(f, [B4, D], [0, -0.16], E_SOFT);
  const intensity =
    1.0 +
    ip(f, [0, B1], [0, 0.02], E_SOFT) +
    ip(f, [B1, B2], [0, 0.04], E_SOFT) +
    // parpadeo de bombita vieja (tapa el fin de material del mazo y es puro hold vivo)
    ip(f, [B1 + 144, B1 + 152], [0, 0.16], E_SNAP) +
    ip(f, [B1 + 152, B1 + 164], [0, -0.16], E_OUT) +
    ip(f, [B2, B3], [0, -0.12], E_SOFT) +
    ip(f, [B3, HT - 2], [0, -0.06], E_SOFT) +
    // ⚡ contraluz de 3 frames: la lámpara pasa POR DETRÁS de la cabeza. ⛔ no es negro.
    ip(f, [HT - 2, HT + 3], [0, -0.42], E_SNAP) +
    ip(f, [HT + 3, HT + 16], [0, 0.44], E_OUT) +
    ip(f, [B4, B5], [0, 0.06], E_SOFT) +
    ip(f, [B5, D], [0, 0.02], E_SOFT);

  // el relleno FRÍO del piso del baño: una SEGUNDA fuente que entra y se retira
  const coldFill =
    ip(f, [B3 - 20, HT], [0, 0.36], E_SOFT) +
    ip(f, [HT, HT + 26], [0, 0.26], E_OUT) +
    ip(f, [B4 + 20, B5], [0, -0.5], E_SOFT) +
    ip(f, [B5, B5 + 60], [0, -0.12], E_SOFT);
  // resaca ROJA del circuito de cloro que dejó MovLoop (se apaga en 45 frames)
  const redHang = ip(f, [0, 45], [0.5, 0], E_DEEP);
  // ámbar de ruta: la cabina queda HABITADA (⛔ nunca cerrar a negro)
  const amber = ip(f, [B5 - 30, D], [0, 0.2], E_SOFT);

  // ── zIndex EXPLÍCITO EN CADA FRONTERA (con `preserve-3d`, el primer plano de un acto tapa al
  //    siguiente aunque ya esté montado)
  const zA1 = 26; // la ficha de la carta vive por delante del mazo: ella lo empezó
  const zA2 = f >= B2 - 20 ? 84 : 20; // el mazo se zambulle a cámara antes de la banda
  const zA3 = f >= B3 - 12 ? 80 : 30; // el sobre pasa POR DELANTE de la cámara en el whip
  const zA4 = f >= B4 - 16 ? 92 : 40; // el zoom-through atraviesa: el acto vuela hacia el ojo

  // ── ACTO 1 · geometría de LA CARTA (un ÚNICO nodo: por eso el match-shape es de verdad)
  const L_w = ip(f, [151, B1 + 6], [1500, 384], E_LONG);
  const L_h = ip(f, [151, B1 + 6], [844, 248], E_LONG);
  const L_r = ip(f, [151, B1 + 6], [18, 14], E_LONG);
  const L_x = ip(f, [B1 + 6, B1 + 74], [0, -560], E_SOFT);
  const L_y = ip(f, [0, B1 + 6], [8, 0], E_SOFT) + ip(f, [B1 + 6, B1 + 74], [0, 34], E_SOFT);
  const L_z = ip(f, [0, B1 + 6], [40, -140], E_LONG) + ip(f, [B1 + 6, B1 + 74], [0, -120], E_SOFT);
  const L_ry = ip(f, [0, B1 + 6], [-7, 0], E_SOFT) + ip(f, [B1 + 6, B1 + 74], [0, 17], E_SOFT);
  const L_rz = ip(f, [0, B1 + 6], [-0.8, -4], E_SOFT) + ip(f, [B1 + 6, B1 + 74], [0, 2], E_SOFT);
  const L_op = ip(f, [B1 + 14, B1 + 74], [1, 0.62], E_SOFT);
  const L_lit = ip(f, [B1 - 20, B1 + 60], [0.72, 0.3], E_SOFT);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — montada UNA vez, ⛔ NUNCA remontada entre actos ═══════════════ */}
      <Atmos tint={L} keyFrom={keyFrom} intensity={intensity} />
      <Motes n={40} tint={MD.bone} speed={0.9} />
      {redHang > 0.004 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(78% 62% at 62% 34%, ${rgba(MD.red, 0.13 * redHang)} 0%, rgba(0,0,0,0) 62%)`,
            boxShadow: `inset 0 0 220px ${rgba(MD.red, 0.34 * redHang)}`,
          }}
        />
      )}

      {/* ══ EL MUNDO — una sola cámara para los seis actos ══════════════════════════════ */}
      <AbsoluteFill style={{ transform: worldTransform, transformStyle: "preserve-3d" }}>
        {/* ══════════════════ ACTO 1 · LA CARTA ══════════════════════════════════════════ */}
        {f < B2 + 3 && (
          <div style={{ position: "absolute", inset: 0, zIndex: zA1 }}>
            <Space3D depth={1600}>
              {/* plano de fondo — su cara en la penumbra, mirando la hoja.
                  Va en FOTO a propósito: una cama nunca se congela. Se apaga 16 f ANTES de la
                  frontera, así que no hay ninguna opacidad moviéndose en la costura. */}
              {f < B1 - 12 && (
                <div
                  style={{
                    position: "absolute",
                    inset: "-16%",
                    transform: `translateZ(-900px) scale(${(1.62 + ip(f, [0, B1], [0, 0.06], E_SOFT)).toFixed(3)})`,
                    opacity: ip(f, [0, 12], [0, 0.42], E_OUT) * ip(f, [B1 - 60, B1 - 16], [1, 0], E_SOFT),
                  }}
                >
                  <Material src={M.faceJpg} drift={0.1} focusX={50} focusY={38} />
                  <AbsoluteFill style={{ background: "rgba(6,6,8,0.62)" }} />
                </div>
              )}

              {/* ── LA CARTA. UN SOLO NODO de f0 a B2: el clip nunca se corta, sólo cambia de
                    forma. El material se congela en el f 151 — EXACTAMENTE cuando termina de
                    escribir — y es justo ahí donde arranca el match-shape. */}
              <Clip start={0}>
                <GlassPlate
                  src={M.letter}
                  w={L_w}
                  h={L_h}
                  x={L_x}
                  y={L_y}
                  z={L_z}
                  ry={L_ry}
                  rz={L_rz}
                  radius={L_r}
                  lit={L_lit}
                  opacity={L_op}
                  sheenAt={26}
                  focusX={50}
                  focusY={54}
                >
                  {/* LA TINTA NACE: se escribe sobre la hoja, con su punta mojada */}
                  <div style={{ position: "absolute", left: "9%", right: "12%", bottom: "15%", height: "20%" }}>
                    <Ink f={f} at={44} dur={92} d={D_SCRAWL} vb={[640, 120]} width={9} wet glow={2} />
                  </div>
                  {/* el subrayado furioso: cierra el trazo justo cuando el clip se termina */}
                  <div style={{ position: "absolute", left: "11%", right: "16%", bottom: "7%", height: "9%" }}>
                    <Ink f={f} at={122} dur={30} d={D_UNDER} vb={[640, 120]} width={11} />
                  </div>
                </GlassPlate>
              </Clip>

              {/* SU CARA — segundo tamaño del mismo momento; toma el primer plano mientras la
                  carta se encoge. Sale por delante de la cámara ANTES de la frontera. */}
              {f > 117 && f < B1 + 6 && (
                <Clip start={118}>
                  <GlassPlate
                    src={M.face}
                    w={ip(f, [120, B1 - 40], [560, 800], E_SOFT)}
                    h={ip(f, [120, B1 - 40], [316, 452], E_SOFT)}
                    x={ip(f, [120, B1 - 40], [700, 360], E_SOFT) + ip(f, [B1 - 40, B1 + 6], [0, 1180], E_IN)}
                    y={ip(f, [120, B1 - 40], [230, 120], E_SOFT)}
                    z={ip(f, [120, B1 - 40], [-60, 150], E_SOFT) + ip(f, [B1 - 40, B1 + 6], [0, 640], E_IN)}
                    ry={ip(f, [120, B1 + 6], [-16, -32], E_SOFT)}
                    radius={16}
                    lit={0.55}
                    sheenAt={78}
                    focusX={52}
                    focusY={36}
                  />
                </Clip>
              )}
            </Space3D>
          </div>
        )}

        {/* ══════════════════ ACTO 2 · TRES VECES ════════════════════════════════════════ */}
        {/* El mazo aparece CERRADO exactamente donde aterriza la ficha de la carta (mismo
            origen: 0,0,−140), así que no "entra": estaba ahí, debajo. */}
        {f > B1 + 4 && f < B2 + 3 && (
          <div style={{ position: "absolute", inset: 0, zIndex: zA2 }}>
            <Space3D depth={1600}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformStyle: "preserve-3d",
                  transform:
                    `translate3d(${ip(f, [B1 + 6, B2], [0, -84], E_SOFT).toFixed(1)}px, ` +
                    `${ip(f, [B1 + 6, B2], [0, -18], E_SOFT).toFixed(1)}px, ` +
                    `${(-140 + ip(f, [B1 + 6, B2], [0, 60], E_SOFT) + ip(f, [B1 + 150, B2], [0, 520], E_IN)).toFixed(1)}px)`,
                }}
              >
                {/* TRES VECES la MISMA mano con el MISMO flapper, entrando por otro momento del
                    clip cada vez. Desfase por carta: la delantera se mueve MÁS que la trasera. */}
                <Clip start={B1 + 5}>
                  <Fan3D
                    items={[
                      {
                        src: M.flapper,
                        startFrom: 0,
                        label: (
                          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2.4, color: rgba(MD.bone, 0.86) }}>
                            MONTH 1
                          </div>
                        ),
                      },
                      {
                        src: M.flapper,
                        startFrom: 26,
                        label: (
                          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2.4, color: rgba(MD.bone, 0.86) }}>
                            MONTH 7
                          </div>
                        ),
                      },
                      {
                        src: M.flapper,
                        startFrom: 52,
                        label: (
                          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2.4, color: MD.redHot }}>
                            MONTH 14
                          </div>
                        ),
                      },
                    ]}
                    open={ip(f, [B1 + 12, B1 + 100], [0.06, 1], E_OVER)}
                    w={384}
                    h={248}
                    spread={330}
                    arc={10}
                    z={0}
                    sheenAt={30}
                  />
                </Clip>
              </div>

              {/* LOS TRES PALOTES — la cuenta, uno por carta que aterriza. Se van hacia abajo
                  justo antes de la banda: entran a la oclusión, no desaparecen. */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 62,
                    height: 130,
                    transform:
                      `translate(-50%,-50%) translate3d(${-472 + i * 74}px, ` +
                      `${-292 + ip(f, [B2 - 26, B2 + 6], [0, 300], E_IN)}px, 220px) ` +
                      `rotate(${(-6 + i * 5).toFixed(1)}deg)`,
                  }}
                >
                  <Ink f={f} at={B1 + 40 + i * 26} dur={16} d={D_TALLY} vb={[44, 120]} color={MD.redHot} width={9} glow={9} />
                </div>
              ))}
            </Space3D>
          </div>
        )}

        {/* ══════════════ ACTO 3 · NO ERA CONFUSIÓN, ERA INSULTO ═════════════════════════ */}
        {/* Monta DENTRO de la cobertura total del Occluder (B2−4.3 → B2+4.3): nunca se lo ve
            aparecer. */}
        {f > B2 - 4 && f < B3 + 36 && (
          <div style={{ position: "absolute", inset: 0, zIndex: zA3 }}>
            <Space3D depth={1600}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformStyle: "preserve-3d",
                  transform:
                    `translate3d(${(ip(f, [B2, B3 - 12], [90, -20], E_SOFT) + ip(f, [B3 - 12, B3 + 26], [0, -2100], E_SNAP)).toFixed(1)}px, ` +
                    `${ip(f, [B2, B3], [26, -12], E_SOFT).toFixed(1)}px, ` +
                    `${(ip(f, [B2, B3], [-140, 60], E_SOFT) + ip(f, [B3 - 12, B3 + 26], [0, 520], E_SNAP)).toFixed(1)}px) ` +
                    `scaleX(${(1 + ip(f, [B3 - 12, B3 + 4], [0, 0.22], E_SNAP)).toFixed(3)})`,
                }}
              >
                {/* cama profunda: su cara, mandíbula apretada, en el borde de la luz */}
                {f > B2 + 94 && (
                  <Clip start={B2 + 95} len={112}>
                    <GlassPlate
                      src={M.face}
                      startFrom={40}
                      w={620}
                      h={350}
                      x={ip(f, [B2 + 96, B3], [-880, -640], E_SOFT)}
                      y={ip(f, [B2 + 96, B3], [-190, -150], E_SOFT)}
                      z={-330}
                      ry={22}
                      radius={14}
                      lit={0.34}
                      opacity={0.8}
                      focusX={54}
                      focusY={34}
                    />
                  </Clip>
                )}

                {/* EL SOBRE. MACRO de sus manos alisándolo. El material se congela DENTRO del
                    barrido del solapado: cuando vuelve a verse, ya es un sobre cerrado. */}
                <Clip start={B2 - 4}>
                  <GlassPlate
                    src={M.envelope}
                    w={ip(f, [B2, B3], [1400, 1180], E_SOFT)}
                    h={ip(f, [B2, B3], [788, 664], E_SOFT)}
                    x={ip(f, [B2, B3], [40, 130], E_SOFT)}
                    y={ip(f, [B2, B3], [-4, 26], E_SOFT)}
                    z={ip(f, [B2, B3], [0, 90], E_SOFT)}
                    ry={ip(f, [B2, B3], [6, -3], E_SOFT)}
                    radius={16}
                    lit={0.78}
                    sheenAt={38}
                    focusX={50}
                    focusY={52}
                  >
                    {/* LA ACUSACIÓN a mano sobre el sobre: EL MISMO TRAZO del acto 1 */}
                    <div
                      style={{
                        position: "absolute",
                        left: "10%",
                        right: "12%",
                        top: "38%",
                        height: "24%",
                        clipPath: `inset(0 0 ${ip(f, [B2 + 128, B2 + 160], [0, 104], E_SNAP).toFixed(1)}% 0)`,
                      }}
                    >
                      <Ink f={f} at={B2 + 30} dur={86} d={D_SCRAWL} vb={[640, 120]} width={10} wet glow={2} />
                    </div>
                    {/* EL SOLAPADO baja y SELLA la tinta adentro (⛔ no la borra: la esconde) */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: `${ip(f, [B2 + 126, B2 + 162], [-64, 62], E_SNAP).toFixed(1)}%`,
                        height: "64%",
                        background: `linear-gradient(180deg, ${rgba(MD.bone, 0.94)} 0%, ${rgba(MD.bone, 0.86)} 74%, ${rgba("#B8B0A2", 0.9)} 100%)`,
                        boxShadow: "0 22px 46px rgba(0,0,0,.55)",
                        opacity: 0.9,
                      }}
                    />
                  </GlassPlate>
                </Clip>
              </div>
            </Space3D>
          </div>
        )}

        {/* ═════════════ ACTO 4 · EL GIRO DE CABEZA (⚡ EL GOLPE) ════════════════════════ */}
        {f > B3 - 13 && f < B4 + 8 && (
          <div style={{ position: "absolute", inset: 0, zIndex: zA4 }}>
            {/* ⚠️ el ZoomThrough va POR FUERA del Space3D: su `transform: scale()` aplanaría
                las capas 3D del acto durante TODO el acto si las envolviera sin perspectiva
                propia. Con el Space3D adentro, la perspectiva se establece por debajo. */}
            <ZoomThrough at={B4 - 14} dur={18} into={[56, 42]} scale={8}>
              <Space3D depth={1500}>
                {/* EL PISO. Entra por DERECHA a la MISMA velocidad con la que salió el sobre.
                    Se congela 28 f antes del giro: esa quietud es la respiración previa. */}
                {f < HT + 34 && (
                  <Clip start={B3 - 12}>
                    <GlassPlate
                      src={M.floor}
                      w={1520}
                      h={856}
                      x={ip(f, [B3 - 12, B3 + 34], [2100, 0], E_OUT) + ip(f, [HT, HT + 18], [0, -2000], E_SNAP)}
                      y={ip(f, [B3, HT], [10, -14], E_SOFT)}
                      z={ip(f, [B3, HT], [-40, 30], E_SOFT) + ip(f, [HT, HT + 18], [0, 520], E_SNAP)}
                      ry={ip(f, [B3, HT], [-8, 2], E_SOFT)}
                      rz={ip(f, [B3, HT], [1.4, -0.4], E_SOFT)}
                      radius={16}
                      lit={0.5}
                      sheenAt={46}
                      focusX={48}
                      focusY={58}
                    />
                  </Clip>
                )}

                {/* ⚡ EL REVEAL. Ya está entrando cuando la cabeza gira: la cámara no la
                    descubre, la ALCANZA. */}
                {f > HT - 13 && (
                  <Clip start={HT - 12}>
                    <GlassPlate
                      src={M.jug}
                      w={ip(f, [HT, B4], [1560, 1420], E_SOFT)}
                      h={ip(f, [HT, B4], [878, 800], E_SOFT)}
                      x={ip(f, [HT - 12, HT + 22], [1500, 0], E_OUT) + ip(f, [HT + 22, B4], [0, -60], E_SOFT)}
                      y={ip(f, [HT, B4], [-6, 22], E_SOFT)}
                      z={ip(f, [HT, B4], [-90, 130], E_SOFT)}
                      ry={ip(f, [HT - 12, HT + 30], [16, -2], E_OUT)}
                      rz={ip(f, [HT - 12, HT + 30], [-2.6, 0.3], E_OUT)}
                      radius={16}
                      lit={0.82}
                      sheenAt={20}
                      focusX={58}
                      focusY={46}
                    >
                      {/* LA TINTA VUELVE — mismo trazo, girado 92°, en HUESO: los chorreados
                          secos que bajan por el costado. La sustancia que lo acusa a él. */}
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "48%",
                          width: 520,
                          height: 98,
                          transform: "translate(-50%,-50%) rotate(92deg) scale(0.86)",
                        }}
                      >
                        <Ink
                          f={f}
                          at={HT + 32}
                          dur={78}
                          d={D_SCRAWL}
                          vb={[640, 120]}
                          color={CRUST}
                          width={7}
                          glow={4}
                          opacity={0.82}
                        />
                      </div>
                      {/* pop especular de 2 frames al aterrizar el reveal */}
                      {f >= HT + 10 && f <= HT + 12 && <AbsoluteFill style={{ background: rgba(MD.white, 0.16) }} />}
                    </GlassPlate>
                  </Clip>
                )}

                {/* el relleno FRÍO del piso: segunda fuente, baja y por izquierda */}
                {coldFill > 0.01 && (
                  <AbsoluteFill
                    style={{
                      pointerEvents: "none",
                      background: `radial-gradient(96% 78% at 6% 88%, ${rgba(MD.cold, 0.3 * coldFill)} 0%, rgba(0,0,0,0) 62%)`,
                    }}
                  />
                )}
              </Space3D>
            </ZoomThrough>
          </div>
        )}

        {/* ═════════════ ACTO 5 · UNA TAPITA CADA NOCHE ═════════════════════════════════ */}
        {f > B4 - 12 && f < B5 + 18 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 50 }}>
            <Space3D depth={1500}>
              {/* el MACRO llega a escala 2.35 y desacelera a 1.00: el aterrizaje del zoom ES la
                  continuidad. ⛔ nada aparece: lo que había crecido, frena. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformStyle: "preserve-3d",
                  transform:
                    `scale(${ip(f, [B4 - 8, B4 + 40], [2.35, 1], E_DEEP).toFixed(4)}) ` +
                    `translate3d(${ip(f, [B4, B5], [0, -70], E_SOFT).toFixed(1)}px, ${ip(f, [B4, B5], [0, 24], E_SOFT).toFixed(1)}px, 0)`,
                }}
              >
                <Clip start={B4 - 12}>
                  <GlassPlate
                    src={M.cap}
                    w={1460}
                    h={822}
                    y={ip(f, [B4, B5], [0, -18], E_SOFT)}
                    z={ip(f, [B4, B5], [60, -120], E_SOFT)}
                    ry={ip(f, [B4, B5], [-3, 5], E_SOFT)}
                    radius={16}
                    lit={0.86}
                    sheenAt={40}
                    focusX={54}
                    focusY={44}
                  >
                    {/* el mismo trazo hueso, ahora de cerca: es la costra en macro */}
                    <div style={{ position: "absolute", left: "14%", right: "16%", top: "52%", height: "22%" }}>
                      <Ink f={f} at={B4 + 4} dur={44} d={D_SCRAWL} vb={[640, 120]} color={CRUST} width={6} opacity={0.6} />
                    </div>
                  </GlassPlate>
                </Clip>
              </div>

              {/* su cara en el piso: ojos fijos, mandíbula floja. El horror aterriza acá. */}
              {f > B4 + 103 && (
                <Clip start={B4 + 104}>
                  <GlassPlate
                    src={M.realise}
                    w={ip(f, [B4 + 110, B5], [640, 780], E_SOFT)}
                    h={ip(f, [B4 + 110, B5], [360, 440], E_SOFT)}
                    x={ip(f, [B4 + 110, B5], [-880, -560], E_SOFT) + ip(f, [B5, B5 + 18], [0, -280], E_IN)}
                    y={ip(f, [B4 + 110, B5], [250, 176], E_SOFT)}
                    z={ip(f, [B4 + 110, B5], [-300, 120], E_SOFT)}
                    ry={ip(f, [B4 + 110, B5], [20, 8], E_SOFT)}
                    radius={14}
                    lit={0.46}
                    sheenAt={54}
                    focusX={52}
                    focusY={40}
                  />
                </Clip>
              )}

              {/* "CUATRO PIES": la distancia, MEDIDA. Capa gráfica de estructura, ⛔ no un
                  objeto dibujado haciendo de objeto real. */}
              {f > B4 + 150 && (
                <div
                  style={{
                    position: "absolute",
                    left: "24%",
                    right: "40%",
                    top: "62%",
                    height: 2,
                    background: `linear-gradient(90deg, ${rgba(MD.red, 0)} 0%, ${MD.red} 16%, ${MD.red} 84%, ${rgba(MD.red, 0)} 100%)`,
                    transform: `scaleX(${ip(f, [B4 + 152, B4 + 186], [0, 1], E_OUT).toFixed(3)}) rotate(-3deg)`,
                    transformOrigin: "right center",
                    boxShadow: `0 0 16px ${rgba(MD.red, 0.7)}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: -48,
                      fontFamily: F_SANS,
                      fontWeight: 800,
                      fontSize: 34,
                      letterSpacing: 2,
                      color: MD.redHot,
                      opacity: ip(f, [B4 + 176, B4 + 194], [0, 1], E_OUT),
                      textShadow: "0 4px 18px rgba(0,0,0,.9)",
                    }}
                  >
                    4 FT
                  </div>
                </div>
              )}
            </Space3D>
          </div>
        )}

        {/* ═════════════ ACTO 6 · YO FUI LA PIEZA QUE FALLÓ ═════════════════════════════ */}
        {/* ⚠️ el `clipPath` (que es lo que hace el WIPE: BORDE, ⛔ no opacidad) va POR FUERA del
            Space3D — `clip-path` aplana el subárbol, y la perspectiva se establece por debajo. */}
        {f > B5 - 9 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 60,
              clipPath: `inset(0 ${(100 - ip(f, [B5 - 8, B5 + 14], [0, 100], E_SOFT)).toFixed(1)}% 0 0)`,
            }}
          >
            <Space3D depth={1500}>
              {/* llega A SANGRE detrás del vaho (2060×1160 tapa el cuadro entero) y recién
                  después se acomoda a plano flotante: así el acto 5 no asoma por los márgenes. */}
              <Clip start={B5 - 8} len={148}>
                <GlassPlate
                  src={M.driving}
                  w={ip(f, [B5 + 30, B5 + 96], [2060, 1560], E_SOFT)}
                  h={ip(f, [B5 + 30, B5 + 96], [1160, 878], E_SOFT)}
                  x={ip(f, [B5 + 30, D], [0, -40], E_SOFT)}
                  y={ip(f, [B5, D], [-10, 16], E_SOFT)}
                  z={ip(f, [B5 - 8, B5 + 44], [-240, 30], E_OUT) + ip(f, [B5 + 44, D], [0, -10], E_SOFT)}
                  ry={ip(f, [B5, D], [6, -2], E_SOFT)}
                  rz={ip(f, [B5, D], [-1, 0.4], E_SOFT)}
                  radius={ip(f, [B5 + 30, B5 + 96], [0, 18], E_SOFT)}
                  lit={0.74}
                  sheenAt={138}
                  startFrom={2}
                  focusX={44}
                  focusY={44}
                />
              </Clip>

              {/* LA CORRECCIÓN QUE NUNCA MANDÓ. La ficha de la carta vuelve (en FOTO: es un
                  recuerdo, no una escena) y el trazo arranca... y SE CORTA a mitad. */}
              {f > B5 + 60 && (
                <GlassPlate
                  src={M.letterJpg}
                  w={470}
                  h={264}
                  x={-596}
                  y={ip(f, [B5 + 62, B5 + 98], [430, 268], E_OUT)}
                  z={200}
                  ry={13}
                  rz={-3}
                  radius={12}
                  lit={0.5}
                  focusX={50}
                  focusY={52}
                >
                  <div style={{ position: "absolute", left: "10%", right: "12%", bottom: "22%", height: "26%" }}>
                    <Ink f={f} at={B5 + 104} dur={96} d={D_SCRAWL} vb={[640, 120]} width={9} cut={0.44} wet />
                  </div>
                  <AbsoluteFill style={{ background: "rgba(6,6,8,0.3)", pointerEvents: "none" }} />
                </GlassPlate>
              )}
            </Space3D>
          </div>
        )}

        {/* ══ LA MATERIA QUE CRUZA LA FRONTERA E: los palotes se fugan y son la ruta ═════ */}
        {/* Vive POR ENCIMA del wipe y del acto 6: se lo ve transformarse mientras cambia el
            lugar. Eso es "wipe por materia" y no "corte con vapor encima". */}
        {f > B4 + 24 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 70, pointerEvents: "none" }}>
            <TickField f={f} n={392} drawAt={B4 + 30} drawDur={122} morphAt={B5 - 26} morphDur={78} />
          </div>
        )}

        {/* ══ LA TINTA CRUZANDO LAS FRONTERAS A y B (capa propia, por delante de los actos) ══ */}
        {f > B1 - 26 && f < B1 + 34 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 88, pointerEvents: "none" }}>
            <InkTravel
              f={f}
              at={B1 - 24}
              dur={54}
              from={{ x: -40, y: 190, s: 1, r: 0 }}
              to={{ x: -472, y: -292, s: 0.34, r: -84 }}
              w={640}
            />
          </div>
        )}
        {f > B2 - 28 && f < B2 + 46 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 88, pointerEvents: "none" }}>
            <InkTravel
              f={f}
              at={B2 - 26}
              dur={58}
              from={{ x: -472, y: -292, s: 0.34, r: -84 }}
              to={{ x: 40, y: -32, s: 1, r: 0 }}
              w={640}
            />
          </div>
        )}
      </AbsoluteFill>

      {/* ══ LAS COSTURAS — una DISTINTA por frontera. ⛔ NUNCA un fade. ═══════════════════ */}
      {/* FRONTERA B · OCLUSIÓN — banda de tinta, cobertura total ~9 frames */}
      <div style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}>
        <Occluder at={B2 - 9} dur={18} color={INK} angle={-9} />
      </div>
      {/* FRONTERA C · MATCH-MOVE — estelas en el vector del whip */}
      <div style={{ position: "absolute", inset: 0, zIndex: 99, pointerEvents: "none" }}>
        <Streaks f={f} at={B3 - 12} dur={30} dir={-1} tint={MD.bone} n={12} />
      </div>
      {/* ⚡ EL GOLPE — estelas frías del giro de cabeza */}
      <div style={{ position: "absolute", inset: 0, zIndex: 99, pointerEvents: "none" }}>
        <Streaks f={f} at={HT - 2} dur={20} dir={1} tint={MD.cold} n={14} />
      </div>
      {/* FRONTERA E · WIPE POR MATERIA — el vaho de lejía, sincronizado con el clip-path */}
      <div style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "none" }}>
        <VaporWipe at={B5 - 10} dur={24} />
      </div>

      {/* ══ EL TEXTO — 1 idea por acto, titular ≤7 palabras, cama oscura obligatoria ═════ */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: "none" }}>
        {/* ACTO 1 */}
        {f < B1 + 14 && (
          <Say f={f} in0={22} out0={B1 - 22} width={1180}>
            <div
              style={{
                opacity: ip(f, [22, 38], [0, 1], E_OUT),
                transform: `translateX(${ip(f, [22, 40], [-20, 0], E_OUT).toFixed(1)}px)`,
              }}
            >
              <Kicker>And I know that, because —</Kicker>
            </div>
            <div style={{ marginTop: 14 }}>
              <Words f={f} at={54} text="I WROTE THEM A LETTER." size={76} serifOn={["LETTER"]} />
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: F_SANS,
                fontWeight: 600,
                fontSize: 32,
                color: rgba(MD.bone, 0.74),
                opacity: ip(f, [128, 148], [0, 1], E_OUT),
              }}
            >
              and I was not polite in it
            </div>
          </Say>
        )}

        {/* ACTO 2 */}
        {f > B1 + 20 && f < B2 + 10 && (
          <Say f={f} in0={B1 + 24} out0={B2 - 30} width={1220}>
            <div style={{ opacity: ip(f, [B1 + 26, B1 + 42], [0, 1], E_OUT) }}>
              <Kicker>Same house. Same toilet.</Kicker>
            </div>
            <div style={{ marginTop: 14 }}>
              <Words f={f} at={B1 + 52} text="THREE FLAPPERS. FOURTEEN MONTHS." size={70} serifOn={["THREE"]} />
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: F_SERIF,
                fontStyle: "italic",
                fontSize: 34,
                color: rgba(MD.bone, 0.82),
                opacity: ip(f, [B1 + 122, B1 + 142], [0, 1], E_OUT),
              }}
            >
              by the third one I was not confused. I was insulted.
            </div>
          </Say>
        )}

        {/* ACTO 3 */}
        {f > B2 + 12 && f < B3 + 6 && (
          <Say f={f} in0={B2 + 16} out0={B3 - 26} width={1180}>
            <div style={{ opacity: ip(f, [B2 + 18, B2 + 34], [0, 1], E_OUT) }}>
              <Kicker>Twenty-two years in</Kicker>
            </div>
            <div style={{ marginTop: 14 }}>
              <Words f={f} at={B2 + 44} text="I TOLD THEM: GARBAGE." size={76} serifOn={["GARBAGE"]} />
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: F_SANS,
                fontWeight: 600,
                fontSize: 31,
                color: rgba(MD.bone, 0.72),
                opacity: ip(f, [B2 + 118, B2 + 140], [0, 1], E_OUT),
              }}
            >
              sealed it, stamped it, sent it
            </div>
          </Say>
        )}

        {/* ACTO 4 — el titular cae CON el golpe, ⛔ nunca antes */}
        {f > B3 + 8 && f < B4 - 6 && (
          <Say f={f} in0={B3 + 12} out0={B4 - 30} width={1240}>
            <div style={{ opacity: ip(f, [B3 + 14, B3 + 30], [0, 1], E_OUT) }}>
              <Kicker>Fourth call. Same toilet.</Kicker>
            </div>
            <div style={{ marginTop: 14 }}>
              <Words f={f} at={HT + 6} text="THEN I TURNED MY HEAD." size={78} step={2.4} serifOn={["TURNED"]} />
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: F_SANS,
                fontWeight: 600,
                fontSize: 31,
                color: rgba(MD.bone, 0.76),
                opacity: ip(f, [HT + 62, HT + 84], [0, 1], E_OUT),
              }}
            >
              tucked in behind the plunger. Cap crusted white.
            </div>
          </Say>
        )}

        {/* ACTO 5 */}
        {f > B4 + 16 && f < B5 - 4 && (
          <Say f={f} in0={B4 + 20} out0={B5 - 28} width={1180}>
            <div style={{ opacity: ip(f, [B4 + 22, B4 + 38], [0, 1], E_OUT) }}>
              <Kicker>And she says — oh, yes</Kicker>
            </div>
            <div style={{ marginTop: 14 }}>
              <Words f={f} at={B4 + 48} text="A CAPFUL. EVERY NIGHT." size={76} serifOn={["EVERY"]} />
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: F_SERIF,
                fontStyle: "italic",
                fontSize: 34,
                color: rgba(MD.bone, 0.84),
                opacity: ip(f, [B4 + 128, B4 + 150], [0, 1], E_OUT),
              }}
            >
              for over a year — four feet from where I was kneeling
            </div>
          </Say>
        )}

        {/* ACTO 6 — EL REMATE. El último frame queda ENCENDIDO. */}
        {f > B5 + 18 && (
          <div
            style={{
              position: "absolute",
              left: 100,
              bottom: 116,
              width: 1300,
              transform: `translateY(${ip(f, [B5 + 20, B5 + 40], [52, 0], E_OUT).toFixed(1)}px)`,
            }}
          >
            <TextBed pad={32}>
              <div style={{ opacity: ip(f, [B5 + 22, B5 + 40], [0, 1], E_OUT) }}>
                <Kicker color={MD.warm}>The part was fine.</Kicker>
              </div>
              <div style={{ marginTop: 14 }}>
                <Words
                  f={f}
                  at={B5 + 52}
                  text="I WAS THE PART THAT FAILED."
                  size={70}
                  step={2.6}
                  serifOn={["FAILED"]}
                  accent={MD.redHot}
                />
              </div>
              <div style={{ marginTop: 16, opacity: ip(f, [B5 + 118, B5 + 140], [0, 1], E_OUT) }}>
                <Title size={38} color={rgba(MD.bone, 0.9)}>
                  I never sent them a <Em color={MD.warm}>correction</Em>.
                </Title>
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 5,
                  width: `${ip(f, [B5 + 150, B5 + 200], [0, 94], E_OUT).toFixed(1)}%`,
                  background: `linear-gradient(90deg, ${MD.warm}, ${rgba(MD.warm, 0)})`,
                  boxShadow: `0 0 18px ${rgba(MD.warm, 0.7)}`,
                  borderRadius: 3,
                }}
              />
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {/* ámbar de ruta: la cabina queda HABITADA — ⛔ nunca cerrar a negro */}
      {amber > 0.004 && (
        <AbsoluteFill
          style={{
            zIndex: 120,
            pointerEvents: "none",
            background: `radial-gradient(76% 60% at 82% 104%, ${rgba(MD.warm, amber)} 0%, rgba(0,0,0,0) 62%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
