// MovVeredicto.tsx — MOVIMIENTO 7 · EL ÚLTIMO DEL VIDEO · "EL VEREDICTO" · ~1200 frames @30fps (40 s)
// Canal Claudio Mendoza Constructor (ES) · video `cmebateria` · sección S11 · párrafos P73–P76.
//
// UN SOLO PLANO SECUENCIA. Una atmósfera (<VoltAtmos/>) montada UNA vez para los 40 s, UNA cama de
// foto que nunca se cambia (`cmeb_mv_ver_duelo`, el duelo de los dos aparatos), UNA cámara `gcam`
// que viaja z 260 → 330 con el pan −30 → +50 y NUNCA vuelve a cero, y una LUZ que hace el argumento
// entero: ÁMBAR PLENO (el generador manda, y le decimos que NO) → la KEY VOLTIO SE CORRE AL CAMPO
// DE LA BATERÍA mientras se encienden las cuatro cosas del 80 % → vuelve al ÁMBAR, sobria, para que
// el generador quede DIGNO en su 1 % → y en el último acto **las dos luces al 100 % en el mismo
// cuadro**: el equilibrio no se lee, se VE.
//
// LA MATERIA QUE CRUZA TODAS LAS FRONTERAS: **LAS DOS COLUMNAS** que llegan de MovCosto (la ámbar
// alta = 900 dólares, la voltio baja = 150 una vez). Acá su PIEL SE DRENA y detrás aparece la foto
// real del duelo; lo que queda del pie de cada columna se abre y se vuelve el PLINTO de cada campo
// (izquierda ámbar = el generador · derecha voltio = la batería). Esos dos plintos son después las
// dos bocas de los dos cables que terminan en el mismo tablero.
//        columna → piel drenada → plinto → filamento → cable → el mismo tablero.
//
// ⭐ LO QUE ESTE MOVIMIENTO TENÍA QUE RESOLVER: que el "80 % contra 1 %" NO se lea como una
//    infografía de porcentajes. Tres decisiones, todas espaciales y ninguna numérica:
//    1. Las tarjetas del 80 % **SE ENCIENDEN**: están montadas y a oscuras desde el principio del
//       acto 2 (son la casa apagada), y lo que las hace entrar es SU PROPIA LUZ — un halo que se
//       junta antes, un parpadeo de filamento de 8 frames, un charco de luz en el piso debajo. Cada
//       una con la luz que le corresponde: la heladera `torch`, la lámpara `amber`, las pantallas
//       `white`, los LEDs del router `volt`. Y antes de cada encendido llega el FILAMENTO desde el
//       plinto de la batería: primero la corriente, después la luz.
//    2. La proporción está en el ESPACIO: en el acto 2 la cámara se mete (`view` 0.885) y las
//       cuatro tarjetas ocupan casi todo el cuadro, pegadas, conectadas entre sí por la corriente;
//       en el acto 3 la cámara se ABRE (`view` 0.795), el generador queda grande y solo a la
//       izquierda y las tres cosas de su 1 % son CHICAS, LEJOS (z −300) y **sin un solo cable entre
//       ellas**. Cuatro juntas y encendidas contra tres lejos y sueltas: el 80/20 se entiende sin
//       leer un número.
//    3. El acto 4 no es una transición sino un GESTO FÍSICO: dos cables que salen de dos objetos
//       que estaban peleando y terminan en la misma boca.
//
// ⚠️ EL EQUIPO MÉDICO GRANDE no tiene foto (es un tema sensible y no se genera). Se resuelve con el
//    kit: una PLACA GRABADA sobria (chapa oscura, hairline ámbar, el ícono del enchufe) en el tercer
//    lugar de la fila del 1 %. No es una tarjeta flotante vacía: es una placa, y se lee como tal.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF — nada se reinicia entre actos (todo en fracciones de `durationInFrames` = D)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · 0.000–0.150 D · "EL DUELO"  (protagonista: la foto del duelo, que NACE de las columnas)
//   enterFrom cam {z0 260, pan −30 — EXACTO donde lo dejó MovCosto}
//             luz {ÁMBAR PLENO, key 0.35, rimA 1.00 / rimV 0.08}   viento {.10}
//             materia {LAS DOS COLUMNAS DEL GRÁFICO, ámbar alta y voltio baja, de pie sobre la losa}
//   exitTo    cam {z ~281, pan ~−50}   luz {ámbar, la key empezando a correrse a la derecha}
//             viento {.10}   materia {los dos aparatos enfrentados + los dos plintos formados}
//   (MATCH-SHAPE de entrada f 0–78: la tarjeta del duelo NACE del rectángulo que encierra a las dos
//    columnas y crece; las PIELES se DRENAN de arriba abajo y detrás aparece la foto real; el pie
//    que queda de cada columna se ABRE y se vuelve el plinto de su campo)
//   ── FRONTERA A @0.138 D ····· MATCH-MOVE ········································
//      La tarjeta del duelo NO se corta ni se funde: viene en UNA sola rampa continua desde el
//      centro (1180 px) hacia el fondo izquierdo (460 px) y la atraviesa sin un quiebre, mientras
//      DETRÁS cambia todo — la key salta al campo de la batería, el rim ámbar baja, los cuatro
//      bultos apagados llegan a su lugar y el plinto voltio se corre al borde derecho.
//      Por qué: los dos actos comparten sujeto y eje; cortar acá sería un salto de eje.
//
// ACTO 2 · 0.150–0.480 D · "EL 80 %"   (protagonista: las cuatro cosas de la casa que se encienden)
//   enterFrom cam {z ~281, view 0.87}  luz {ámbar → VOLTIO, key corriéndose a 0.82}  viento {.10}
//             materia {la tarjeta del duelo viajando al fondo + los cuatro bultos a oscuras}
//   exitTo    cam {z ~387, view 0.88}  luz {VOLTIO 0.72, rimV 0.96}   viento {.10}
//             materia {las cuatro tarjetas encendidas y unidas por los filamentos al plinto voltio}
//   (beats: @0.190 la heladera · @0.248 la luz de la cocina · @0.303 los teléfonos · @0.358 el
//    router — cada uno precedido por su filamento; @0.408 CORTE EN EL BEAT: <SeamFlash/> voltio de
//    5 frames y el 80 % escrito por el kit)
//   ── FRONTERA B @0.480 D ····· OCLUSIÓN ··········································
//      El CHASIS ROJO del generador cruza el lente (`V.danger`, 20 fr) y 6 frames después el bloque
//      GRIS del motor (`V.concrete`, 18 fr) — ⛔ nunca el color del fondo. Debajo de la cobertura
//      opaca se hace todo el cruce de campo: las cuatro tarjetas se van, la key vuelve a la
//      izquierda, la cámara se ABRE y el generador entra grande. Por qué acá: es el único cambio de
//      lado del movimiento, y la materia que tapa ES el protagonista del acto que entra.
//
// ACTO 3 · 0.480–0.715 D · "EL 1 %"    (protagonista: el generador, grande, solo y DIGNO)
//   enterFrom cam {z ~291, view 0.80}  luz {ÁMBAR otra vez, key 0.24, intensidad 0.88}  viento {.20}
//             materia {el chasis rojo que acaba de cruzar = el generador que ya está en cuadro}
//   exitTo    cam {z ~316, view 0.795}  luz {ámbar sobrio}   viento {.20}
//             materia {el generador y sus tres cosas chicas y lejanas, sin un cable entre ellas}
//   (beats: @0.545 la bomba · @0.585 el aire · @0.622 la PLACA GRABADA del equipo médico ·
//    @0.655 el 1 % en ámbar con un flash corto)
//   ── FRONTERA C @0.715 D ····· WIPE POR MATERIA ···································
//      El POLVO DE HORMIGÓN del piso del garaje (`V.concrete`, 30 fr) cruza el cuadro. Debajo NO se
//      desmonta nada: el generador VIAJA entero hacia el fondo, la heladera del acto 2 vuelve por
//      la derecha (es lo único que nunca se apagó) y los dos plintos empiezan a converger.
//      Por qué: acá no hay que ocultar un cambio de tema sino un cambio de POSICIÓN mientras los
//      dos sujetos siguen en cuadro.
//
// ACTO 4 · 0.715–1.000 D · "DEJAN DE COMPETIR"  (protagonista: el tablero donde entran los dos)
//   enterFrom cam {z ~316}   luz {ámbar + voltio subiendo los DOS}   viento {.20 → .35}
//             materia {el generador yéndose al fondo y la heladera volviendo}
//   exitTo    cam {z1 330, pan +50, view 0.815 — plano ABIERTO y quieto}
//             luz {ÁMBAR Y VOLTIO EN EQUILIBRIO: los dos rims al 100 %}   viento {.35}
//             materia {LOS DOS CABLES CONVERGIENDO EN EL MISMO TABLERO} ← último plano del video
//   (beat @0.885 los dos cables aterrizan juntos: <SeamFlash/> mezcla + chispas; y desde ahí quedan
//    ~138 frames (≈4,6 s) de HOLD VIVO: nadie sigue después de este movimiento, el plano tiene que
//    poder quedarse solo en el aire)
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande a pantalla · cero fade ·
// ⛔ ningún staticFile fuera de la lista de material de ESTE movimiento (un 404 mata el chunk).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, rgba, lerp, clamp01, rnd, gcam, light,
  VoltAtmos, WindField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

export const MOVVEREDICTO_FRAMES = 1200;

/* ── easings (⛔ Easing.quint NO EXISTE → Easing.poly(5)) ─────────────────────────────────── */
type Ease = (t: number) => number;
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1) as Ease,
  push: Easing.bezier(0.58, 0.0, 0.22, 1) as Ease,
  snap: Easing.bezier(0.14, 0.86, 0.22, 1) as Ease,
  soft: Easing.bezier(0.42, 0.06, 0.36, 1) as Ease,
  brake: Easing.bezier(0.05, 0.84, 0.12, 1) as Ease,
  settle: Easing.poly(5) as Ease,
  lin: ((t: number) => t) as Ease,
};

/** rampa multi-key con easing POR SEGMENTO — el easing nunca es constante en toda la pieza */
const keyed = (f: number, ks: number[], vs: number[], e: Ease | Ease[] = EZ.glide): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const w = ks[i + 1] - ks[i];
  const t = w <= 0 ? 1 : clamp01((f - ks[i]) / w);
  const ef: Ease = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/** mezcla dos colores (acepta "#rrggbb" y "rgb(r,g,b)") — la luz encadena, nunca salta */
const parseC = (c: string): number[] => {
  if (c.charAt(0) === "#") {
    const x = parseInt(c.slice(1), 16);
    return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
  }
  const m = c.replace(/[^0-9,]/g, "").split(",");
  return [Number(m[0]) || 0, Number(m[1]) || 0, Number(m[2]) || 0];
};
const mixc = (a: string, b: string, t: number): string => {
  const A = parseC(a);
  const B = parseC(b);
  const k = clamp01(t);
  return `rgb(${Math.round(lerp(A[0], B[0], k))},${Math.round(lerp(A[1], B[1], k))},${Math.round(lerp(A[2], B[2], k))})`;
};

const pctX = (px: number) => (px / 1920) * 100;
const pctY = (px: number) => (px / 1080) * 100;
const toPx = (xp: number) => (xp / 100) * 1920;
const toPy = (yp: number) => (yp / 100) * 1080;

/* ── MATERIAL REAL (⛔ SÓLO los nombres del material de MovVeredicto) ─────────────────────── */
const M = {
  duelo: "img/cmebateria/cmeb_mv_ver_duelo.jpg",
  heladera: "broll/cmebateria/cmeb_mv_ver_heladeraAndando.mp4",
  luz: "broll/cmebateria/cmeb_mv_ver_luzCocina.mp4",
  telefonos: "broll/cmebateria/cmeb_mv_ver_telefonosCargando.mp4",
  router: "broll/cmebateria/cmeb_mv_ver_routerLuces.mp4",
  bomba: "img/cmebateria/cmeb_mv_ver_bombaTanque.jpg",
  aire: "img/cmebateria/cmeb_mv_ver_aireVentana.jpg",
  cables: "img/cmebateria/cmeb_mv_ver_dosCables.jpg",
  cierre: "img/cmebateria/cmeb_mv_ver_claudioCierre.jpg",
  icGenerador: "img/cmebateria/cmeb_ic_generador.png",
  icBateria: "img/cmebateria/cmeb_ic_bateria.png",
  icHeladera: "img/cmebateria/cmeb_ic_heladera.png",
  icFoco: "img/cmebateria/cmeb_ic_foco.png",
  icCelular: "img/cmebateria/cmeb_ic_celular.png",
  icRouter: "img/cmebateria/cmeb_ic_router.png",
  icBomba: "img/cmebateria/cmeb_ic_bomba.png",
  icAire: "img/cmebateria/cmeb_ic_aire.png",
  icEnchufe: "img/cmebateria/cmeb_ic_enchufe.png",
  icCasa: "img/cmebateria/cmeb_ic_casa.png",
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   GEOMETRÍA HEREDADA — las dos columnas que deja MovCosto de pie sobre la losa.
   La ÁMBAR es la alta (900 dólares el primer año) y la VOLTIO la baja (150, una vez). Todo el
   movimiento cuelga de estos números: la losa es el nivel de los plintos, y los plintos son
   después las dos bocas de los dos cables.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const BASE_Y = 852;
const COL_A = { w: 172, h: 452, cx: 702 };    // ÁMBAR  → el GENERADOR (campo izquierdo)
const COL_V = { w: 172, h: 214, cx: 1218 };   // VOLTIO → la BATERÍA  (campo derecho)

/* ── LA PIEL DE LA COLUMNA: se DRENA de arriba abajo y detrás queda la foto real del duelo.
      Éste es el MATCH-SHAPE de entrada: el mismo rectángulo, otro contenido, cero fade. ────── */
const ColumnSkin: React.FC<{
  x: number; y: number; w: number; h: number; drain: number; color: string;
}> = ({ x, y, w, h, drain, color }) => {
  if (drain >= 0.999) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
      borderRadius: 5, pointerEvents: "none",
      clipPath: `inset(${(drain * 100).toFixed(2)}% 0px 0px 0px)`,
      background: `linear-gradient(180deg, ${rgba(color, 0.97)} 0%, ${rgba(color, 0.6)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.45)}, 0 0 38px ${rgba(color, 0.32)}`,
    }} />
  );
};

/* ── EL PLINTO DE CADA CAMPO — el pie de la columna que se ABRE y queda como pedestal.
      Es la boca de la que sale la corriente: primero los filamentos del 80 %, después el cable
      gordo del acto 4. Lleva su ícono PNG encima y su charco de luz en el piso. ─────────────── */
const Plinth: React.FC<{
  f: number; x: number; y: number; w: number; color: string; icon: string; iconSize: number;
  on: number; name?: string;
}> = ({ f, x, y, w, color, icon, iconSize, on, name }) => {
  if (on <= 0.01) return null;
  const pulse = 0.86 + Math.sin(f / 37 + x) * 0.14;
  return (
    <>
      {/* el charco de luz: el pedestal ilumina la losa, no flota en la nada */}
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w * 2.1, height: 96, marginLeft: -w * 1.05, marginTop: -22,
        background: `radial-gradient(closest-side, ${rgba(color, 0.3 * on * pulse)} 0%, rgba(0,0,0,0) 72%)`,
        filter: "blur(7px)", mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* la losa del pedestal */}
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w * on, height: 22, marginLeft: -(w * on) / 2, borderRadius: 5,
        background: `linear-gradient(180deg, ${rgba(color, 0.92)} 0%, ${rgba(color, 0.34)} 100%)`,
        boxShadow: `0 12px 34px ${rgba(V.ink0, 0.86)}, inset 0 1px 0 ${rgba(V.white, 0.5)}`,
      }} />
      <IconPng src={icon} x={x} y={y - pctY(iconSize + 16)} size={iconSize} opacity={0.62 + 0.38 * on} glow={color} />
      {name && (
        <div style={{
          position: "absolute", left: `${x}%`, top: `${y + 2.6}%`, transform: "translateX(-50%)",
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 3.4,
          color: rgba(V.white, 0.72), textTransform: "uppercase", whiteSpace: "nowrap",
          textShadow: "0 4px 18px rgba(0,0,0,0.94)",
        }}>{name}</div>
      )}
    </>
  );
};

/* ── EL ENCENDIDO — 8 frames de filamento, no una animación de escala.
      La curva es literal: el filamento pega dos veces antes de quedarse. Determinística. ───── */
const IGN_STEPS = [0, 0.92, 0.13, 1, 0.26, 0.88, 0.58, 1];
const ignite = (f: number, at: number): number => {
  const d = Math.round(f - at);
  if (d < 0) return 0;
  if (d < IGN_STEPS.length) return IGN_STEPS[d];
  return 1;
};

/* ── ⭐ LA TARJETA QUE SE ENCIENDE — está montada y A OSCURAS desde el principio del acto (es la
      casa apagada). Lo que la hace entrar es SU PROPIA LUZ: el halo se junta antes, el velo negro
      se levanta con el parpadeo, y queda un charco de luz en el piso debajo. ─────────────────── */
const IgniteCard: React.FC<{
  f: number; at: number; bornAt: number; src: string; kind?: "video" | "photo"; startFrom?: number;
  w: number; h: number; x: number; y: number; z: number; ry?: number; rx?: number;
  glow: string; label?: string; labelUntil?: number;
}> = ({
  f, at, bornAt, src, kind = "video", startFrom = 0, w, h, x, y, z, ry = 0, rx = 0, glow, label, labelUntil = 1e9,
}) => {
  const born = EZ.brake(clamp01((f - bornAt) / 16));
  if (born <= 0.002) return null;
  const ig = ignite(f, at);
  const pre = clamp01((f - (at - 9)) / 9);          // la luz se JUNTA antes de que se vea
  const alive = 1 + Math.sin(f / 23 + x) * 0.045;   // hold vivo: una lámpara nunca está quieta
  // misma micro-deriva que MediaCard (función pura del frame) para que el velo calce exacto
  const drift = Math.sin(f / 41 + x) * 2.4;
  const driftR = Math.sin(f / 67 + y) * 0.5;
  const veilT =
    `translateZ(${z}px) rotateY(${(ry + driftR).toFixed(2)}deg) rotateX(${rx}deg) translateY(${drift.toFixed(2)}px)`;
  return (
    <div style={{
      position: "absolute", inset: 0, transformStyle: "preserve-3d", pointerEvents: "none",
      transform: `translateY(${((1 - born) * 38).toFixed(2)}px)`, opacity: born,
    }}>
      {/* EL HALO — la luz existe ANTES y AFUERA de la tarjeta */}
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w * 2.0, height: h * 2.0, marginLeft: -w, marginTop: -h,
        transform: `translateZ(${z - 3}px)`,
        background: `radial-gradient(closest-side, ${rgba(glow, 0.36 * (0.22 * pre + 0.78 * ig) * alive)} 0%, rgba(0,0,0,0) 70%)`,
        mixBlendMode: "screen",
      }} />
      <MediaCard
        src={src} kind={kind} startFrom={startFrom}
        w={w} h={h} x={x} y={y} z={z} ry={ry} rx={rx} radius={13}
        lit={0.16 + 0.84 * ig} litColor={glow}
        sheenAt={at + 2}
        label={label && f > at + 4 && f < labelUntil ? label : undefined}
      />
      {/* EL VELO — mientras está apagada la cosa está a OSCURAS, no ausente */}
      {ig < 0.995 && (
        <div style={{
          position: "absolute", left: `${x}%`, top: `${y}%`,
          width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
          transform: veilT, borderRadius: 13, pointerEvents: "none",
          background: `linear-gradient(178deg, ${rgba(V.ink0, 0.9 * (1 - ig))} 0%, ${rgba(V.ink1, 0.95 * (1 - ig))} 100%)`,
        }} />
      )}
      {/* EL CHARCO EN EL PISO — la cosa ilumina lo que tiene abajo */}
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w * 1.3, height: h * 0.5, marginLeft: -w * 0.65, marginTop: h * 0.4,
        transform: `translateZ(${z - 8}px)`,
        background: `radial-gradient(closest-side, ${rgba(glow, 0.3 * ig * alive)} 0%, rgba(0,0,0,0) 68%)`,
        filter: "blur(8px)", mixBlendMode: "screen",
      }} />
    </div>
  );
};

/* ── LA PLACA GRABADA — el EQUIPO MÉDICO GRANDE no tiene foto y no se inventa una. Se resuelve
      como lo que es en una casa de verdad: una chapa grabada al lado del tomacorriente. ────── */
const SoberPlate: React.FC<{
  f: number; at: number; x: number; y: number; z: number; w: number; text: string;
}> = ({ f, at, x, y, z, w, text }) => {
  const p = EZ.brake(clamp01((f - at) / 22));
  if (p <= 0.004) return null;
  const h = 92;
  const led = 0.4 + Math.abs(Math.sin(f / 29)) * 0.5;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
      transform: `translateZ(${z}px) rotateY(-7deg) translateY(${(Math.sin(f / 59 + x) * 2).toFixed(2)}px)`,
      clipPath: `inset(0px ${((1 - p) * 100).toFixed(1)}% 0px 0px)`,
      borderRadius: 6, overflow: "hidden",
      background: "linear-gradient(172deg, #23241C 0%, #14150F 100%)",
      border: `1px solid ${rgba(V.amber, 0.34)}`,
      boxShadow: `0 16px 34px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.white, 0.14)}`,
    }}>
      <IconPng src={M.icEnchufe} x={13} y={30} size={40} opacity={0.86} glow={V.amber} />
      <div style={{ position: "absolute", left: 68, top: 16 }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: 2.8,
          color: rgba(V.amber, 0.82), textTransform: "uppercase",
        }}>SIN NEGOCIAR</div>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 0.8,
          color: rgba(V.white, 0.92), textTransform: "uppercase", whiteSpace: "nowrap",
        }}>{text}</div>
      </div>
      <div style={{
        position: "absolute", right: 12, top: 12, width: 9, height: 9, borderRadius: "50%",
        background: rgba(V.amber, led), boxShadow: `0 0 12px ${rgba(V.amber, led)}`,
      }} />
    </div>
  );
};

/* ── CABLES Y FILAMENTOS — trazo dibujado (esto SÍ es un gráfico legítimo) con un pulso de carga
      corriendo adentro. Cada uno conserva el color de SU columna del acto 1. ────────────────── */
const qPoint = (p0: number[], p1: number[], p2: number[], t: number): number[] => {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
};
const qLen = (p0: number[], p1: number[], p2: number[]): number => {
  let L = 0;
  let prev = p0;
  for (let i = 1; i <= 24; i++) {
    const q = qPoint(p0, p1, p2, i / 24);
    const dx = q[0] - prev[0];
    const dy = q[1] - prev[1];
    L += Math.sqrt(dx * dx + dy * dy);
    prev = q;
  }
  return L;
};
const Cable: React.FC<{
  f: number; from: number[]; ctrl: number[]; to: number[]; color: string; grow: number;
  seed: number; gauge?: number;
}> = ({ f, from, ctrl, to, color, grow, seed, gauge = 1 }) => {
  if (grow <= 0.004) return null;
  const g = EZ.glide(clamp01(grow));
  const L = qLen(from, ctrl, to);
  const d = `M ${from[0].toFixed(1)} ${from[1].toFixed(1)} Q ${ctrl[0].toFixed(1)} ${ctrl[1].toFixed(1)} ${to[0].toFixed(1)} ${to[1].toFixed(1)}`;
  const pt = ((f * 0.016 + seed) % 1 + 1) % 1;
  const P = qPoint(from, ctrl, to, pt * g);
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible" }}>
      <path d={d} fill="none" stroke={rgba(color, 0.15)} strokeWidth={17 * gauge} strokeLinecap="round"
        strokeDasharray={`${L.toFixed(1)} ${L.toFixed(1)}`} strokeDashoffset={(L * (1 - g)).toFixed(1)} />
      <path d={d} fill="none" stroke={rgba(V.ink0, 0.92)} strokeWidth={9 * gauge} strokeLinecap="round"
        strokeDasharray={`${L.toFixed(1)} ${L.toFixed(1)}`} strokeDashoffset={(L * (1 - g)).toFixed(1)} />
      <path d={d} fill="none" stroke={rgba(color, 0.92)} strokeWidth={4 * gauge} strokeLinecap="round"
        strokeDasharray={`${L.toFixed(1)} ${L.toFixed(1)}`} strokeDashoffset={(L * (1 - g)).toFixed(1)} />
      {g > 0.12 && <circle cx={P[0].toFixed(1)} cy={P[1].toFixed(1)} r={15 * gauge} fill={rgba(color, 0.16)} />}
      {g > 0.12 && <circle cx={P[0].toFixed(1)} cy={P[1].toFixed(1)} r={6.5 * gauge} fill={rgba(color, 0.96)} />}
    </svg>
  );
};

/* ── LAS CHISPAS del aterrizaje (con `rnd` del Stage, jamás Math.random) ─────────────────── */
const Sparks: React.FC<{ f: number; at: number; x: number; y: number; color: string }> = ({ f, at, x, y, color }) => {
  const d = f - at;
  if (d < 0 || d > 34) return null;
  const p = clamp01(d / 34);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 18 }, (_, i) => {
        const a = rnd(i * 5.7) * Math.PI * 2;
        const sp = 34 + rnd(i * 2.9) * 120;
        const r = sp * EZ.brake(p);
        return (
          <div key={i} style={{
            position: "absolute", left: x + Math.cos(a) * r, top: y + Math.sin(a) * r * 0.6 + p * p * 46,
            width: 3.5, height: 3.5, borderRadius: "50%",
            background: rgba(color, 0.9 * (1 - p)),
            boxShadow: `0 0 10px ${rgba(color, 0.7 * (1 - p))}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ── CUE de texto: entra y sale por WIPE (clip-path), jamás por opacity ───────────────────── */
const CueBed: React.FC<{
  f: number; from: number; to: number; box: React.CSSProperties; children: React.ReactNode;
}> = ({ f, from, to, box, children }) => {
  if (f < from || f > to) return null;
  const i = EZ.snap(clamp01((f - from) / 18));
  const o = EZ.push(clamp01((f - (to - 15)) / 15));
  return (
    <div style={{
      position: "absolute", ...box,
      transform: `translateY(${((1 - i) * 32 - o * 26).toFixed(2)}px)`,
      clipPath: `inset(${(o * 100).toFixed(1)}% 0px ${((1 - i) * 100).toFixed(1)}% 0px)`,
    }}>{children}</div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovVeredicto: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const frame = useCurrentFrame();
  const END = Math.max(420, D);
  /** los actos son FRACCIONES de la duración: aguanta el re-anclaje al Whisper ±20 % */
  const A = (x: number) => Math.round(END * x);
  const f = Math.min(Math.max(frame, 0), END - 1);

  /* ── los cuatro actos, las tres fronteras y los beats ───────────────────────────────────── */
  const A1 = 0;
  const FA = A(0.138);    // MATCH-MOVE      (invisible por construcción)
  const A2 = A(0.150);
  const IG1 = A(0.190);   // la heladera
  const IG2 = A(0.248);   // la luz de la cocina
  const IG3 = A(0.303);   // los teléfonos
  const IG4 = A(0.358);   // el router
  const B80 = A(0.408);   // CORTE EN EL BEAT: el 80 %
  const FB = A(0.480);    // OCLUSIÓN        (chasis rojo + bloque gris del motor)
  const A3 = A(0.500);
  const IG5 = A(0.545);   // la bomba
  const IG6 = A(0.585);   // el aire
  const IG7 = A(0.622);   // la placa del equipo médico
  const B1P = A(0.655);   // el 1 %
  const FC = A(0.715);    // WIPE POR MATERIA (polvo de hormigón)
  const A4 = A(0.740);
  const BLAND = A(0.885); // los dos cables aterrizan

  /* ── LA CÁMARA: UNA sola llamada a gcam sobre el frame GLOBAL. Nunca vuelve a 0.
        entra en z 260 / pan −30 (lo que dejó MovCosto) y sale en z 330 / pan +50. ─────────── */
  const G = gcam(f, { z0: 260, z1: 330, panX: 80, panY: -14, dur: END });
  const mx = keyed(f, [A1, FA, A2, B80, FB, A3, B1P, FC, A4, END],
    [-30, -44, -50, -30, -18, -6, -2, -18, -28, -30],
    [EZ.soft, EZ.glide, EZ.push, EZ.glide, EZ.snap, EZ.soft, EZ.push, EZ.glide, EZ.settle]);
  const mz = keyed(f, [A1, FA, A2, IG4, FB, A3, B1P, FC, A4, BLAND, END],
    [0, 20, 26, 62, 84, -14, 6, 22, -10, 26, 40],
    [EZ.soft, EZ.glide, EZ.push, EZ.push, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.glide, EZ.settle]);
  const my = keyed(f, [A1, A2, IG4, FB, A3, FC, A4, END],
    [0, 8, -10, -2, 12, 4, -6, 10],
    [EZ.glide, EZ.soft, EZ.push, EZ.snap, EZ.soft, EZ.glide, EZ.settle]);
  // la cámara MIRA al campo que manda: derecha en el 80 %, izquierda en el 1 %, al frente al final
  const ryX = keyed(f, [A1, A2, IG4, FB, A3, FC, A4, END],
    [-6, -3, 4.6, 3.6, -4.6, -3, 1.2, 0],
    [EZ.soft, EZ.glide, EZ.soft, EZ.snap, EZ.soft, EZ.glide, EZ.settle]);
  const rxX = keyed(f, [A1, A2, FB, A3, FC, A4, END],
    [1.6, 0.8, -0.6, 1.4, 0.6, -1.2, 1.4], EZ.soft);
  // ⭐ EL ENCUADRE ES EL ARGUMENTO: se CIERRA sobre el 80 % (cuatro cosas cerca y grandes) y se
  //    ABRE sobre el 1 % (tres cosas chicas con mucho hormigón vacío alrededor).
  const view = keyed(f, [A1, A2, IG4, FB, A3, B1P, FC, A4, END],
    [0.86, 0.87, 0.885, 0.88, 0.80, 0.795, 0.81, 0.845, 0.815],
    [EZ.soft, EZ.glide, EZ.lin, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.settle]);
  const camStr =
    `${G.transform} translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, ${mz.toFixed(2)}px) ` +
    `rotateY(${ryX.toFixed(3)}deg) rotateX(${rxX.toFixed(3)}deg) scale(${view.toFixed(4)})`;

  /* ── LA LUZ: ámbar pleno → voltio en el campo de la batería → ámbar sobrio para el 1 % →
        LOS DOS AL 100 % en el mismo cuadro. 0 = ámbar · 1 = voltio. ─────────────────────── */
  const voltMix = keyed(f, [A1, A2, IG1, IG4, FB, A3, B1P, FC, A4, A4 + 110, END],
    [0, 0.05, 0.22, 0.72, 0.62, 0.12, 0.06, 0.16, 0.34, 0.5, 0.5],
    [EZ.soft, EZ.push, EZ.glide, EZ.lin, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.glide, EZ.settle]);
  const tint = light(voltMix, "amber", "volt");
  const tint2 = mixc(V.amber, V.torch, keyed(f, [A1, IG1, IG4, FB, END], [0, 0.1, 0.42, 0.2, 0.3], EZ.glide));
  // la KEY VIAJA al campo que está hablando: centro-izq → derecha (batería) → izq (generador) → centro
  const keyPos = keyed(f, [A1, A2, IG2, IG4, FB, A3, B1P, FC, A4 + 100, END],
    [0.35, 0.44, 0.74, 0.82, 0.78, 0.24, 0.22, 0.3, 0.5, 0.5],
    [EZ.soft, EZ.glide, EZ.soft, EZ.lin, EZ.snap, EZ.lin, EZ.glide, EZ.push, EZ.settle]);
  const intensity = keyed(f, [A1, A2, IG3, IG4, B80, FB, A3, B1P, FC, A4 + 90, END],
    [1, 1.04, 1.12, 1.18, 1.2, 1.0, 0.88, 0.86, 0.92, 1.06, 1.02],
    [EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.glide, EZ.snap, EZ.lin, EZ.glide, EZ.push, EZ.settle]);
  // LOS DOS RIMS — ámbar entra por la IZQUIERDA (campo del generador), voltio por la DERECHA
  // (campo de la batería). En el acto 4 los dos están al 100 % en el mismo cuadro: el equilibrio.
  const rimA = keyed(f, [A1, A2, IG2, IG4, FB, A3, FC, A4 + 110, END],
    [1, 0.94, 0.5, 0.28, 0.4, 1, 0.9, 1, 1],
    [EZ.soft, EZ.glide, EZ.lin, EZ.snap, EZ.push, EZ.glide, EZ.settle, EZ.lin]);
  const rimV = keyed(f, [A1, A2, IG2, IG4, FB, A3, FC, A4 + 110, END],
    [0.08, 0.16, 0.62, 0.96, 0.9, 0.18, 0.26, 1, 1],
    [EZ.soft, EZ.push, EZ.glide, EZ.lin, EZ.snap, EZ.glide, EZ.settle, EZ.lin]);

  /* ── EL AIRE: .10 (el patio quieto de MovCosto) → .35 (el cierre) ───────────────────────── */
  const wind = keyed(f, [A1, FB, FB + 10, A3, FC, FC + 34, END],
    [0.1, 0.1, 0.2, 0.2, 0.2, 0.35, 0.35],
    [EZ.lin, EZ.snap, EZ.lin, EZ.lin, EZ.push, EZ.lin]);
  const windTint = mixc(V.amber, V.white, voltMix);
  const dim = keyed(f, [A1, A2, FB, A3, FC, A4 + 70, END],
    [0.74, 0.68, 0.66, 0.62, 0.6, 0.52, 0.5],
    [EZ.soft, EZ.lin, EZ.glide, EZ.lin, EZ.glide, EZ.settle]);

  /* ══ ACTO 1 · MATCH-SHAPE DE ENTRADA ═══════════════════════════════════════════════════
     La tarjeta del duelo NACE del rectángulo que encierra a las dos columnas y crece; las pieles
     se drenan de arriba abajo y detrás aparece la foto real. Es UNA sola rampa continua que
     atraviesa la frontera A sin un quiebre (eso ES el match-move). ─────────────────────────── */
  const BOX_L = COL_A.cx - COL_A.w / 2;
  const BOX_R = COL_V.cx + COL_V.w / 2;
  const BOX_W = BOX_R - BOX_L;                       // 688
  const BOX_H = COL_A.h;                             // 452
  const BOX_CX = pctX((BOX_L + BOX_R) / 2);          // ~50 %
  const BOX_CY = pctY(BASE_Y - BOX_H / 2);           // ~57.96 %

  const dK = [A1, 62, FA, A2 + 40, A3 - 30, A3 + 30, FC, A4 + 80];
  const dE = [EZ.brake, EZ.lin, EZ.push, EZ.lin, EZ.brake, EZ.lin, EZ.push];
  const dW = keyed(f, dK, [BOX_W, 1180, 1150, 460, 470, 660, 620, 300], dE);
  const dX = keyed(f, dK, [BOX_CX, 50, 48, 15.5, 16, 30, 30, 24], dE);
  const dY = keyed(f, dK, [BOX_CY, 50, 50, 62, 62, 52, 52, 32], dE);
  const dZ = keyed(f, dK, [0, 30, 24, -300, -300, 70, 60, -420], dE);
  const dRy = keyed(f, [A1, 62, A2 + 40, A3 + 30, A4 + 80], [0, 3, 11, 6, 13], EZ.glide);
  const dLit = keyed(f, [A1, 30, A2 + 40, A3, A3 + 40, FC, A4 + 90],
    [0.2, 0.9, 0.34, 0.4, 1, 1, 0.52], [EZ.brake, EZ.push, EZ.lin, EZ.brake, EZ.lin, EZ.glide]);
  const dLitCol = mixc(V.amber, V.volt, keyed(f, [A1, A2, IG4, FB, A3], [0.35, 0.35, 0.5, 0.2, 0], EZ.glide));
  const dH = dW * 0.5627;

  const drainA = EZ.push(clamp01((f - 10) / 56));
  const drainV = EZ.push(clamp01((f - 22) / 56));

  /* ── LOS DOS PLINTOS: nacen del pie de cada columna y se abren a su campo ────────────────── */
  const plOn = EZ.brake(clamp01((f - 52) / 34));
  const gpX = keyed(f, [A1, 58, FA, A2 + 30, FC, A4 + 96],
    [pctX(COL_A.cx), pctX(COL_A.cx), 26, 18, 18, 50], [EZ.lin, EZ.glide, EZ.push, EZ.lin, EZ.settle]);
  const gpY = keyed(f, [A1, 58, A2 + 30, FC, A4 + 96],
    [pctY(BASE_Y), pctY(BASE_Y), 80, 80, 84], [EZ.lin, EZ.glide, EZ.lin, EZ.settle]);
  const bpX = keyed(f, [A1, 58, FA, A2 + 30, FC, A4 + 96],
    [pctX(COL_V.cx), pctX(COL_V.cx), 72, 82, 82, 50], [EZ.lin, EZ.glide, EZ.push, EZ.lin, EZ.settle]);
  const bpY = keyed(f, [A1, 58, A2 + 30, FC, A4 + 96],
    [pctY(BASE_Y), pctY(BASE_Y), 80, 80, 84], [EZ.lin, EZ.glide, EZ.lin, EZ.settle]);
  const gpW = keyed(f, [A1, 58, A2 + 30], [COL_A.w, COL_A.w, 240], [EZ.lin, EZ.brake]);
  const bpW = keyed(f, [A1, 58, A2 + 30], [COL_V.w, COL_V.w, 240], [EZ.lin, EZ.brake]);

  /* ══ ACTO 2 · LAS CUATRO COSAS DEL 80 % ════════════════════════════════════════════════
     Cerca, grandes y PEGADAS. Se encienden una por una, cada una con SU luz, y la corriente
     llega antes que la luz por el filamento que sale del plinto voltio. ──────────────────── */
  const C80 = [
    { src: M.heladera, at: IG1, born: A2 - 4, x: 44, y: 33, w: 470, h: 264, z: 170, ry: 6, glow: V.torch, label: "LA HELADERA NO PIERDE" },
    { src: M.luz, at: IG2, born: A2 + 6, x: 71, y: 30, w: 430, h: 242, z: 120, ry: -8, glow: V.amber, label: "UNA LUZ EN LA COCINA" },
    { src: M.telefonos, at: IG3, born: A2 + 16, x: 46, y: 68, w: 440, h: 248, z: 200, ry: 5, glow: V.white, label: "LOS TELÉFONOS CON CARGA" },
    { src: M.router, at: IG4, born: A2 + 26, x: 73, y: 66, w: 410, h: 231, z: 140, ry: -6, glow: V.volt, label: "EL INTERNET ANDANDO" },
  ];
  const cardsOut = EZ.push(clamp01((f - (FB - 8)) / 22));   // se van DEBAJO de la oclusión

  /* ══ ACTO 3 · LAS TRES DEL 1 % ═════════════════════════════════════════════════════════
     Lejos (z −300), chicas y SUELTAS: ni un cable entre ellas. Eso es la proporción. ─────── */
  const farOut = EZ.push(clamp01((f - (FC - 6)) / 26));

  /* ══ ACTO 4 · LA HELADERA VUELVE (es lo único que nunca se apagó) ══════════════════════ */
  const hW = keyed(f, [FC, FC + 40, A4 + 90], [330, 480, 460], [EZ.brake, EZ.glide]);
  const hX = keyed(f, [FC, FC + 44, A4 + 90], [104, 76, 74], [EZ.brake, EZ.settle]);
  const hY = keyed(f, [FC, FC + 44, A4 + 90], [42, 40, 40], [EZ.brake, EZ.settle]);
  const hZ = keyed(f, [FC, FC + 44, A4 + 90], [40, 170, 150], [EZ.brake, EZ.settle]);

  /* la boca del tablero: EL MISMO punto de llegada para los dos cables */
  const TB_X = 50, TB_Y = 74, TB_W = 620, TB_H = 349;
  const JY = toPy(TB_Y) - TB_H / 2 + 12;
  const cableA = clamp01((f - (A4 + 46)) / 66);
  const cableV = clamp01((f - (A4 + 62)) / 66);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ATMÓSFERA — montada UNA vez para los 40 s. NUNCA se remonta entre actos. */}
      <VoltAtmos tint={tint} tint2={tint2} keyFrom={keyPos} intensity={intensity} floor={0.58} />

      {/* EL MUNDO, bajo UNA sola cámara, en planos con parallax propio */}
      <Layers cam={camStr}>
        {/* z −640 · LA CAMA DE FOTO: el duelo, una sola foto, el movimiento entero. Nunca fondo plano. */}
        <Plane z={-640}>
          <PhotoPlane src={M.duelo} z={0} scale={1.24} dim={dim} tint={tint} />
        </Plane>

        {/* z −300 · LAS DOS LUCES. Ámbar por la izquierda (generador), voltio por la derecha
            (batería). En el acto 4 las dos al 100 % a la vez: el equilibrio se VE. */}
        <Plane z={-300}>
          <AbsoluteFill style={{
            background: `linear-gradient(96deg, ${rgba(V.amber, 0.18 * rimA)} 0%, rgba(0,0,0,0) 46%)`,
            mixBlendMode: "screen",
          }} />
          <AbsoluteFill style={{
            background: `linear-gradient(276deg, ${rgba(V.volt, 0.18 * rimV)} 0%, rgba(0,0,0,0) 46%)`,
            mixBlendMode: "screen",
          }} />
        </Plane>

        {/* z −180 · el aire LEJOS (parallax de la atmósfera) */}
        <Plane z={-180}>
          <WindField speed={wind * 0.7} tint={windTint} count={16} opacity={0.5} />
        </Plane>

        {/* z 0 · ⭐ LA TARJETA DEL DUELO — el objeto que cruza TODO el movimiento:
            nace de las dos columnas (acto 1) · se va al fondo izquierdo (acto 2) · vuelve grande y
            ámbar como retrato del generador (acto 3) · y se corre al FONDO (acto 4). */}
        <Plane z={0}>
          <MediaCard
            src={M.duelo} kind="photo"
            w={dW} h={dH} x={dX} y={dY} z={dZ} ry={dRy} rx={-1} radius={lerp(5, 15, clamp01(f / 62))}
            lit={dLit} litColor={dLitCol}
            sheenAt={f < A3 ? 44 : A3 + 26}
            label={
              (f > 70 && f < FA) ? "EL DUELO"
                : (f > A3 + 26 && f < FC) ? "EL GENERADOR"
                  : undefined
            }
          />
          {/* las PIELES de las dos columnas drenándose: el MATCH-SHAPE de entrada */}
          <ColumnSkin x={pctX(COL_A.cx)} y={pctY(BASE_Y - COL_A.h / 2)} w={COL_A.w} h={COL_A.h} drain={drainA} color={V.amber} />
          <ColumnSkin x={pctX(COL_V.cx)} y={pctY(BASE_Y - COL_V.h / 2)} w={COL_V.w} h={COL_V.h} drain={drainV} color={V.volt} />
        </Plane>

        {/* z +10 · LOS DOS PLINTOS — el pie de cada columna, abierto. En el acto 4 los dos
            convergen al centro y se meten DETRÁS del tablero: van al mismo lugar, literal. */}
        <Plane z={10}>
          <Plinth f={f} x={gpX} y={gpY} w={gpW} color={V.amber} icon={M.icGenerador} iconSize={104}
            on={plOn} name={f > A3 && f < FC ? "EL GENERADOR" : undefined} />
          <Plinth f={f} x={bpX} y={bpY} w={bpW} color={V.volt} icon={M.icBateria} iconSize={104}
            on={plOn} name={f > A2 + 40 && f < FB ? "LA BATERÍA" : undefined} />
        </Plane>

        {/* z +30 · LOS FILAMENTOS DEL 80 % — la corriente llega ANTES que la luz.
            Salen todos del plinto voltio: se ve de dónde sale lo que enciende la casa. */}
        {f > A2 && f < FB + 6 && (
          <Plane z={30}>
            {C80.map((c, i) => {
              const g = clamp01((f - (c.at - 26)) / 30) * (1 - cardsOut);
              const bx = toPx(bpX);
              const by = toPy(bpY) - 16;
              const cx = toPx(c.x);
              const cy = toPy(c.y) + c.h * 0.5;
              return (
                <Cable key={i} f={f}
                  from={[bx, by]}
                  ctrl={[lerp(bx, cx, 0.5) + (i % 2 === 0 ? 90 : -70), lerp(by, cy, 0.5) + 70]}
                  to={[cx, cy]}
                  color={V.volt} grow={g} seed={0.11 + i * 0.23} gauge={0.42} />
              );
            })}
          </Plane>
        )}

        {/* z +20 · ⭐ LAS CUATRO COSAS DEL 80 % — montadas y A OSCURAS desde el principio del
            acto; lo que las hace entrar es SU PROPIA LUZ. */}
        {f > A2 - 10 && f < FB + 14 && cardsOut < 0.999 && (
          <Plane z={20} style={{
            transform: `translateZ(20px) translateY(${(cardsOut * 90).toFixed(1)}px) scale(${(1 - cardsOut * 0.14).toFixed(3)})`,
            opacity: 1 - cardsOut,
          }}>
            {C80.map((c, i) => (
              <IgniteCard key={i} f={f} at={c.at} bornAt={c.born}
                src={c.src} kind="video" startFrom={8 + i * 6}
                w={c.w} h={c.h} x={c.x} y={c.y} z={c.z} ry={c.ry} rx={i % 2 === 0 ? -1 : 1}
                glow={c.glow} label={c.label} labelUntil={FB - 10} />
            ))}
          </Plane>
        )}

        {/* z −40 · LAS TRES DEL 1 % — chicas, LEJOS y sueltas. Ni un cable entre ellas. */}
        {f > A3 && farOut < 0.999 && (
          <Plane z={-40} style={{
            transform: `translateZ(-40px) translateY(${(farOut * -70).toFixed(1)}px) scale(${(1 - farOut * 0.2).toFixed(3)})`,
            opacity: 1 - farOut,
          }}>
            <IgniteCard f={f} at={IG5} bornAt={A3 + 4} src={M.bomba} kind="photo"
              w={250} h={141} x={70} y={34} z={-300} ry={-9} glow={V.amber} label="LA BOMBA DE AGUA" labelUntil={FC} />
            <IgniteCard f={f} at={IG6} bornAt={IG5 + 8} src={M.aire} kind="photo"
              w={236} h={133} x={82} y={56} z={-320} ry={-12} glow={V.amber} label="EL AIRE" labelUntil={FC} />
            <SoberPlate f={f} at={IG7} x={70} y={78} z={-340} w={430} text="EQUIPO MÉDICO GRANDE" />
          </Plane>
        )}

        {/* z +150 · ACTO 4 · LA HELADERA VUELVE por la derecha, debajo del polvo de la costura C.
            Es lo único que nunca se apagó: la batería adelante, andando. */}
        {f > FC - 4 && (
          <Plane z={150}>
            <IgniteCard f={f} at={FC - 4} bornAt={FC - 4} src={M.heladera} kind="video" startFrom={40}
              w={hW} h={hW * 0.5627} x={hX} y={hY} z={hZ} ry={-9} rx={1}
              glow={V.volt} label={f > A4 + 30 ? "SIGUE ANDANDO" : undefined} />
          </Plane>
        )}

        {/* z +40 · LOS DOS CABLES Y EL TABLERO — el último plano premium del video */}
        {f > A4 && (
          <Plane z={40}>
            <Cable f={f}
              from={[toPx(dX), toPy(dY) + dH * 0.46]}
              ctrl={[toPx(dX) + 150, JY - 46]}
              to={[toPx(TB_X) - 72, JY]}
              color={V.amber} grow={cableA} seed={0.17} />
            <Cable f={f}
              from={[toPx(hX), toPy(hY) + hW * 0.5627 * 0.46]}
              ctrl={[toPx(hX) - 150, JY - 46]}
              to={[toPx(TB_X) + 72, JY]}
              color={V.volt} grow={cableV} seed={0.63} />
            <MediaCard src={M.cables} kind="photo"
              w={TB_W} h={TB_H} x={TB_X} y={TB_Y} z={60} ry={0} rx={-3} radius={16}
              lit={1} litColor={mixc(V.volt, V.amber, 0.5)} sheenAt={A4 + 40}
              label={f > BLAND - 24 ? "EL MISMO TABLERO" : undefined} />
            {/* el hombre que lo midió, chico y al costado: la última cara del video */}
            {f > A4 + 26 && (
              <MediaCard src={M.cierre} kind="photo"
                w={300} h={169} x={15} y={66} z={-80} ry={11} rx={2} radius={13}
                lit={0.86} litColor={mixc(V.amber, V.volt, 0.5)} sheenAt={A4 + 60}
                label={f > BLAND ? "EN EL GARAJE" : undefined} />
            )}
          </Plane>
        )}

        {/* z +260 · LOS ÍCONOS como objetos de la escena (PNG sin fondo) */}
        <Plane z={260}>
          {f > IG1 + 6 && f < FB - 6 && <IconPng src={M.icHeladera} x={30} y={20} size={62} opacity={0.86} glow={V.torch} />}
          {f > IG2 + 6 && f < FB - 6 && <IconPng src={M.icFoco} x={36} y={20} size={62} opacity={0.86} glow={V.amber} />}
          {f > IG3 + 6 && f < FB - 6 && <IconPng src={M.icCelular} x={42} y={20} size={62} opacity={0.86} glow={V.white} />}
          {f > IG4 + 6 && f < FB - 6 && <IconPng src={M.icRouter} x={48} y={20} size={62} opacity={0.86} glow={V.volt} />}
          {f > IG5 + 6 && f < FC && <IconPng src={M.icBomba} x={58} y={20} size={58} opacity={0.7} glow={V.amber} />}
          {f > IG6 + 6 && f < FC && <IconPng src={M.icAire} x={63} y={20} size={58} opacity={0.7} glow={V.amber} />}
          {f > A4 + 80 && <IconPng src={M.icCasa} x={50} y={pctY(JY) - 9} size={66} opacity={0.9} glow={V.volt} />}
        </Plane>

        {/* z +320 · el aire CERCA: el polvo del patio delante de la cámara */}
        <Plane z={320}>
          <WindField speed={wind} tint={windTint} count={20} opacity={0.85} />
        </Plane>

        {/* z 0 · TIPOGRAFÍA — 1 idea por acto, titular ≤7 palabras, siempre con cama oscura */}
        <Plane z={0}>
          {/* ACTO 1 · el NO honesto */}
          <CueBed f={f} from={16} to={A2 + 26} box={{ left: 210, top: 118 }}>
            <Bed pad={28}>
              <Kick color={V.amber}>EL VEREDICTO</Kick>
              <div style={{ marginTop: 10 }}><Head size={90}>No lo <Em color={V.amber}>reemplaza</Em>.</Head></div>
              <div style={{ marginTop: 12 }}>
                <Body size={30} color={rgba(V.bone, 0.88)}>Ni en potencia · ni en autonomía</Body>
              </div>
            </Bed>
          </CueBed>
          {/* ACTO 2 · el 80 % */}
          <CueBed f={f} from={A2 + 30} to={FB - 6} box={{ left: 210, top: 118 }}>
            <Bed pad={28}>
              <Kick color={V.volt}>PERO SÍ REEMPLAZA</Kick>
              <div style={{ marginTop: 10 }}><Head size={84}>Lo que de verdad <Em>usás</Em>.</Head></div>
            </Bed>
          </CueBed>
          {f > B80 - 2 && f < FB - 6 && (
            <Readout value="80" unit="%" label="DE LAS VECES" at={B80} x={20} y={46} size={196} color={V.volt} />
          )}
          {/* ACTO 3 · el 1 % — el generador queda DIGNO */}
          <CueBed f={f} from={A3 + 14} to={FC - 4} box={{ left: 210, top: 112 }}>
            <Bed pad={28}>
              <Kick color={V.amber}>EL GENERADOR ES PARA</Kick>
              <div style={{ marginTop: 10 }}><Head size={84}>El apagón de <Em color={V.amber}>tres días</Em>.</Head></div>
              <div style={{ marginTop: 12 }}>
                <Body size={29} color={rgba(V.bone, 0.86)}>Si estás en ese caso, tenelo</Body>
              </div>
            </Bed>
          </CueBed>
          {f > B1P - 2 && f < FC - 4 && (
            <Readout value="1" unit="%" label="DE LAS VECES" at={B1P} x={79} y={14} size={150} color={V.amber} />
          )}
          {/* ACTO 4 · dejan de competir — el último titular del video */}
          <CueBed f={f} from={A4 + 16} to={END + 90}
            box={{ left: 0, right: 0, top: 66, display: "flex", justifyContent: "center" }}>
            <Bed pad={28}>
              <div style={{ textAlign: "center" }}>
                <Kick color={mixc(V.volt, V.amber, 0.5)}>PARA TODO EL RESTO</Kick>
                <div style={{ marginTop: 10 }}><Head size={78}>Dejan de <Em color={V.amber}>competir</Em>.</Head></div>
                {f > BLAND - 40 && (
                  <div style={{ marginTop: 14 }}>
                    <Body size={29} color={rgba(V.bone, 0.9)}>Una batería y un inversor, en el garaje</Body>
                  </div>
                )}
              </div>
            </Bed>
          </CueBed>
        </Plane>
      </Layers>

      {/* ══ LAS COSTURAS ══ (⛔ nunca un fade; una distinta por frontera) ══════════════════
          FRONTERA A · MATCH-MOVE: no lleva componente — es la rampa continua de la tarjeta del
          duelo cruzando @FA mientras cambia todo lo demás. Invisible por construcción. */}
      {/* CORTE EN EL BEAT (interno al acto 2): el flash sobre "el ochenta por ciento" */}
      <SeamFlash at={B80} color={V.volt} dur={5} />
      {/* FRONTERA B · OCLUSIÓN: el CHASIS ROJO del generador cruza el lente, y detrás el bloque
          GRIS del motor. ⛔ el color es el de LA MATERIA que cruza, JAMÁS el del fondo. */}
      <SeamOcclude at={FB} dur={20} color={V.danger} angle={9} />
      <SeamOcclude at={FB + 6} dur={18} color={V.concrete} angle={-12} />
      {/* beat interno del acto 3: el 1 %, en ámbar y corto — el generador no se humilla */}
      <SeamFlash at={B1P} color={V.amber} dur={4} />
      {/* FRONTERA C · WIPE POR MATERIA: el polvo de hormigón del piso del garaje. Debajo no se
          desmonta nada: el generador viaja al fondo y la heladera vuelve por la derecha. */}
      <SeamWipeMatter at={FC} dur={30} tint={V.concrete} />
      {/* el beat en que los dos cables aterrizan JUNTOS en el mismo tablero */}
      <SeamFlash at={BLAND} color={mixc(V.volt, V.amber, 0.5)} dur={6} />
      <Sparks f={f} at={BLAND} x={toPx(TB_X)} y={JY} color={V.volt} />
      <Sparks f={f} at={BLAND + 3} x={toPx(TB_X) - 60} y={JY + 4} color={V.amber} />

      {/* viñeta del canal, constante: la misma piel de imagen en los cuatro actos */}
      <AbsoluteFill style={{
        background: "radial-gradient(128% 100% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 64, bottom: 44, opacity: 0.3,
        fontFamily: F_BODY, fontWeight: 600, fontSize: 20, letterSpacing: 4,
        color: rgba(V.white, 0.7), textTransform: "uppercase",
      }}>EL VEREDICTO</div>
    </AbsoluteFill>
  );
};

export default MovVeredicto;
