// MovNoche.tsx — MOVIMIENTO 5 de `cmebateria` · "LAS CINCO Y MEDIA DE LA MAÑANA" · ~45 s (D = 1350 f)
// Canal Claudio Mendoza Constructor (ES). ⛔ NO son cinco componentes pegados: es UN PLANO SECUENCIA.
//
// LA IDEA: es la única parte del video donde Claudio PIERDE. La batería estuvo toda la noche
// haciendo andar la heladera y unas luces. A las 5:30 la mide: 11,8 V. Una batería sana en reposo
// está en 12,6 o más; a 11,8 ya está por debajo de la mitad. Y viene el golpe que nadie cuenta:
// la vuelve a poner en el auto, gira la llave y EL ARRANQUE SALE FLOJO. Sale, pero lento, con
// esfuerzo. Una noche más fría y no arrancaba: te quedaste sin las dos cosas.
// La regla que sale de ahí: NUNCA BAJAR DE 12 VOLTIOS.
//
// ⛔⛔ LA COLUMNA VERTEBRAL ES LA LUZ. Sigue cortada. La ÚNICA fuente de los actos 1-4 es EL HAZ DE
// LA LINTERNA (`<Torch/>`, V.torch), que vive en espacio de PANTALLA: por eso ningún encuadre puede
// dejar el cuadro sin fuente. Y el haz SIEMPRE está tocando algo con TEXTURA (el azulejo, la puerta
// de la heladera, el plástico de la batería, la chapa del auto): nunca apunta al vacío.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
//  INVENTARIO DE LUZ — la garantía escrita de que ningún tramo cae por debajo de LUMA 25
// ══════════════════════════════════════════════════════════════════════════════════════════════
//  fuente                                   ventana (fracción de D)   ¿siempre encendida?
//  1. cama de foto (`PhotoPlane`, dim ≤.58) 0.000 → 1.000             SÍ (nunca hay fondo plano)
//  2. EL HAZ DE LA LINTERNA + su charco     0.000 → 0.905             SÍ (power nunca baja de .58)
//  3. el LCD del tester (glow propio)       0.222 → 0.612             (2ª fuente, acto 2 y 3)
//  4. la escala de tensión (auto-iluminada) 0.410 → 0.612
//  5. el aro del contacto + testigo de dash 0.618 → 1.000             SÍ en los actos 4 y 5
//  6. EL AMANECER FRÍO por la ventana       0.836 → 1.000             SÍ (lo más luminoso del mov.)
//  7. contra ámbar de `VoltAtmos`           0.000 → 1.000             SÍ (intensity ≥ 0.68)
//  · El haz se apaga recién en 0.905, y el amanecer ya está a plena potencia desde 0.884: hay 60
//    frames de SOLAPE. No existe un solo frame con el haz bajo y sin otra fuente.
//  · Los negros son `V.ink1`/`V.ink2`, jamás `#000`. La viñeta nunca cierra más de 0.24.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
//  TABLA DE HANDOFF (todo en FRACCIONES de `durationInFrames`: sobrevive al re-anclaje ±20%)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA DE MovGuia:  cam {z0 0} · luz {TORCH, única fuente} · partículas {.55}
//                      materia {EL HAZ DE LA LINTERNA en la mano}
//
// ACTO 1 · 0.000 → 0.185 · "CINCO Y MEDIA DE LA MAÑANA"        (protagonista: LA COCINA DORMIDA)
//   enterFrom cam {z 0, net 1.00, foco (860,470)} luz {torch, key .60} viento {.55}
//             materia {el haz, en la mano, entrando por la puerta de la cocina}
//   material  {cama: foto `linternaCocina` · hero: clip `linternaCocina` · íconos bombillanoche/reloj}
//   0.052 la hora la escribe el kit: 5:30 AM · el haz recorre azulejo → mesada → puerta blanca
//   exitTo    cam {z≈24, net 1.16} luz {torch} viento {.55} materia {el haz, barriendo hacia abajo}
//   ── FRONTERA A @0.170-0.196 ··· WIPE POR MATERIA (EL PROPIO HAZ) ························
//      El haz acelera y barre el cuadro de izquierda a derecha; el polvo encendido dentro del cono
//      (`SeamWipeMatter` teñido V.torch) tapa el cambio y detrás YA están las dos puntas del tester
//      sobre los bornes, exactamente donde el haz aterriza. ⛔ cero fade.
//
// ACTO 2 · 0.185 → 0.400 · "ONCE COMA OCHO VOLTIOS"            (protagonista: LAS DOS PUNTAS)
//   enterFrom cam {z≈24, net 1.30, foco (760,600)} luz {torch pleno} viento {.55}
//   material  {cama: foto `linternaCocina` · hero: clip `testerBornes` · foto `pantallaTester`
//              (con el LCD dibujado encima) · depth: foto `claudioAgachado` · ícono tester}
//   0.222 nace el LCD (2ª fuente) · 0.262 SALTA el Readout 11,8 V · 0.318 "por debajo de la mitad"
//   exitTo    cam {z≈62, net 1.66, foco (1420,390)} materia {EL LCD, llenando el cuadro}
//   ── FRONTERA B @0.392-0.436 ··· ZOOM-THROUGH ···········································
//      La cámara entra POR el LCD del tester (fx 68 / fy 38) y sale del otro lado adentro de la
//      escala de tensión, que ya está montada debajo desde 0.386: no hay un frame vacío.
//
// ACTO 3 · 0.400 → 0.612 · "NUNCA BAJAR DE DOCE VOLTIOS"       (protagonista: LA ESCALA)
//   enterFrom cam {z≈70, net 1.04, foco (900,520)} luz {torch, charco sobre el material real}
//   material  {cama: foto `claudioAgachado` · card foto `pantallaTester` · depth foto `testerBornes`
//              · ícono bateria} — la escala es un GRÁFICO: ahí sí mandan los vectores
//   0.452 → 12,6 SANA · 0.490 → 12,0 EL LÍMITE (línea roja) · 0.528 → el indicador CAE a 11,8 y
//   se queda DEBAJO de la línea · 0.560 → la regla
//   exitTo    cam {z≈98, net 1.12} materia {el plástico negro de la batería entrando por izquierda}
//   ── FRONTERA C @0.602-0.618 ··· OCLUSIÓN ················································
//      `BatteryEdge`: el canto del CAJÓN DE PLÁSTICO NEGRO de la batería (#2B2E27, con sus nervios
//      y el filo encendido por el haz) cruza y tapa el 100% ~5 frames. ⛔ NO es el color del fondo:
//      con el color del fondo esto haría un pozo negro (costó un render en `mdbleach`).
//
// ACTO 4 · 0.612 → 0.846 · "EL ARRANQUE SALIÓ FLOJO"           (protagonista: LA LLAVE)
//   enterFrom cam {z≈104, net 1.18, foco (900,520)} luz {torch + aro del contacto} viento {.55→.62}
//   material  {cama: foto `bateriaAuto` · clip `bateriaAuto` → clip `llaveContacto` ·
//              depth foto `claudioAgachado` · íconos auto / llaveauto}
//   0.664 la llave GIRA · 0.678-0.7235 SIETE compresiones con las pausas ACORTÁNDOSE (14→7 frames):
//   el latido del arranque está en la animación, no en el texto — cada compresión sacude el cuadro,
//   hunde el testigo del tablero y levanta la traza · 0.7285 ENGANCHA, por poco
//   exitTo    cam {z≈150, ry≈+6, net 1.24} materia {EL ARO DEL CONTACTO, redondo, cromado}
//   ── FRONTERA D @0.846 ··· MATCH-SHAPE ···················································
//      `RingBridge` vive en espacio de PANTALLA y NO se corta: el aro cromado del contacto y el
//      SOL FRÍO del amanecer son el MISMO círculo, en el mismo lugar y del mismo tamaño. El mundo
//      detrás cambia en UN frame (corte duro, no fundido) y el aro sostiene la mirada; sólo el
//      MATERIAL del aro migra de cromo a sol en 12 frames. `SeamFlash` de 5 f marca el beat.
//
// ACTO 5 · 0.846 → 1.000 · "TE QUEDASTE SIN LAS DOS COSAS"     (protagonista: EL AMANECER)
//   enterFrom cam {z≈152, ry +6, net 1.10} luz {torch → SKY} viento {.50 → .30}
//   material  {cama: foto `amanecerFrio` · card foto `amanecerFrio` · card foto `llaveContacto`}
//   0.905 el haz se APAGA del todo (el amanecer ya manda desde 0.884)
//   0.944 la cámara aterriza en LA LLAVE COLGANDO DEL CONTACTO, quieta, con luz azul de ventana
//   exitTo ⟶ cam {z 180 · ry +7} · luz {SKY} · partículas {.30}
//            materia {LA LLAVE COLGANDO DEL CONTACTO} → MovCosto la convierte en la tapa a rosca
//            del bidón de nafta (MATCH-SHAPE: dos objetos redondos y metálicos que giran).
//
// ⛔ cero Math.random / Date.now · cero backdrop-filter · cero blur grande full-screen · cero fade.
// ⛔ Easing.quint no existe → Easing.poly(5). ⛔ rgba() con undefined = NaN = negro → helper rgba().
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba,
  gcam, light, VoltAtmos, WindField, Layers, Plane,
  MediaCard, PhotoPlane, IconPng, Readout,
  SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

export const MOVNOCHE_FRAMES = 1350;

/* ── EASINGS — nunca uno solo para todo el movimiento ──────────────────────────────────────── */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.12, 0.88, 0.2, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  expo: Easing.poly(5),
  lin: (t: number) => t,
};

/** rampa multi-key con easing POR SEGMENTO (el easing nunca es constante en todo el movimiento) */
const keyed = (
  f: number, ks: number[], vs: number[],
  e: ((t: number) => number) | ((t: number) => number)[] = EZ.glide,
): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const span = Math.max(1, ks[i + 1] - ks[i]);
  const t = clamp01((f - ks[i]) / span);
  const ef = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/* ── ANCLAS: TODO en FRACCIONES de `durationInFrames` ───────────────────────────────────────── */
const KF = {
  hook: 0.018,
  hora: 0.052,      // 5:30 AM — la hora la escribe el kit
  barrido: 0.126,   // el haz acelera: empieza el barrido
  fA: 0.170,        // FRONTERA A · WIPE POR MATERIA (el propio haz)
  bornes: 0.198,    // las dos puntas tocan los bornes
  lcd: 0.222,       // nace el LCD del tester (2ª fuente de luz)
  once: 0.262,      // SALTA 11,8 V
  mitad: 0.318,     // "por debajo de la mitad"
  fB: 0.392,        // FRONTERA B · ZOOM-THROUGH (por el LCD)
  escala: 0.424,
  sana: 0.452,      // 12,6 SANA
  limite: 0.490,    // 12,0 EL LÍMITE (línea roja)
  cae: 0.528,       // el indicador CAE por debajo y se queda
  regla: 0.562,     // NUNCA BAJAR DE 12 VOLTIOS
  fC: 0.602,        // FRONTERA C · OCLUSIÓN (el plástico negro de la batería)
  auto: 0.634,      // la batería vuelve al auto
  llave: 0.664,     // la llave gira
  engancha: 0.7285, // arranca, por poco
  flojo: 0.742,     // "SALIÓ, PERO LENTO"
  fD: 0.846,        // FRONTERA D · MATCH-SHAPE (el aro del contacto = el sol frío)
  alba: 0.884,
  apaga: 0.905,     // el haz se apaga: ya manda el amanecer
  quieta: 0.944,    // la llave, quieta, con luz que ya no es la linterna
};
const ACT = { a1: 0.0, a2: 0.185, a3: 0.400, a4: 0.612, a5: 0.846 };

/* SIETE compresiones con las pausas ACORTÁNDOSE (14 → 12 → 11 → 9 → 8 → 7 frames a D=1350):
   así se lee "gira con esfuerzo, pesado, y arranca por poco" sin una sola palabra. */
const CRANKS = [0.678, 0.6885, 0.6975, 0.7055, 0.7125, 0.7185, 0.7235];

/* ── RUTAS DEL MATERIAL — ⛔ SOLO los nombres de la lista de ESTE movimiento ────────────────── */
const IMG = (s: string) => `img/cmebateria/${s}.jpg`;
const VIDEO = (s: string) => `broll/cmebateria/${s}.mp4`;
const IC = (s: string) => `img/cmebateria/cmeb_ic_${s}.png`;
const M = {
  cocina: "cmeb_mv_noche_linternaCocina",
  bornes: "cmeb_mv_noche_testerBornes",
  pantalla: "cmeb_mv_noche_pantallaTester",
  bateriaAuto: "cmeb_mv_noche_bateriaAuto",
  llave: "cmeb_mv_noche_llaveContacto",
  claudio: "cmeb_mv_noche_claudioAgachado",
  amanecer: "cmeb_mv_noche_amanecerFrio",
};

/* ⛔ EL PLÁSTICO NEGRO DEL CAJÓN DE LA BATERÍA — la MATERIA que cruza en la frontera C.
   NO es V.ink0 (#0A0B08 = el fondo → pozo negro, el error que costó un render en `mdbleach`) ni el
   V.concrete seco (#7E7D74 → sobre una escena nocturna sería un flash blanco). Es plástico negro
   mate visto de refilón por la linterna: luma ~44, apenas por encima de la escena, con nervios y
   el filo encendido. Se lee como un OBJETO que pasa, no como un fundido. */
const BATT_DARK = "#22251F";
const BATT_LIT = "#3B3E33";
/* el cromo del aro del contacto (frontera D) */
const CHROME = "#9CA096";

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL HAZ DE LA LINTERNA — la única fuente de los actos 1-4 y el objeto que abre la frontera A.
   Vive en espacio de PANTALLA: pase lo que pase con la cámara, el cuadro nunca se queda sin
   fuente. `power` no baja de 0.58 hasta que el amanecer ya está a plena potencia.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Torch: React.FC<{
  f: number; ox: number; oy: number; tx: number; ty: number;
  power: number; spread?: number; color?: string;
}> = ({ f, ox, oy, tx, ty, power, spread = 300, color = V.torch }) => {
  if (power <= 0.02) return null;
  // temblor de mano: el haz NUNCA está perfectamente quieto (hold VIVO)
  const jx = Math.sin(f / 13) * 1.15 + Math.sin(f / 31) * 0.62;
  const jy = Math.cos(f / 17) * 0.94 + Math.sin(f / 43) * 0.5;
  const OX = (ox / 100) * 1920, OY = (oy / 100) * 1080;
  const TX = ((tx + jx * 0.16) / 100) * 1920, TY = ((ty + jy * 0.16) / 100) * 1080;
  const dx = TX - OX, dy = TY - OY;
  const len = Math.max(240, Math.sqrt(dx * dx + dy * dy));
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI + jx * 0.26;
  const flick = 0.945 + Math.sin(f / 7.3) * 0.032 + Math.sin(f / 2.9) * 0.02; // led barato con pilas
  const p = power * flick;
  const wide = spread * (0.82 + power * 0.4);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* el CONO: se abre del puño hacia donde apunta */}
      <div style={{
        position: "absolute", left: `${ox}%`, top: `${oy}%`,
        width: len * 1.14, height: wide, marginTop: -wide / 2,
        transformOrigin: "0% 50%", transform: `rotate(${ang.toFixed(3)}deg)`,
        clipPath: "polygon(0% 45.5%, 100% 0%, 100% 100%, 0% 54.5%)",
        background:
          `linear-gradient(90deg, ${rgba(color, 0.32 * p)} 0%, ${rgba(color, 0.19 * p)} 26%, ` +
          `${rgba(color, 0.1 * p)} 58%, ${rgba(color, 0.035 * p)} 82%, rgba(0,0,0,0) 100%)`,
        mixBlendMode: "screen",
      }} />
      {/* el CHARCO donde ATERRIZA: siempre cae sobre algo con textura, nunca sobre el vacío */}
      <div style={{
        position: "absolute", left: `${tx + jx * 0.16}%`, top: `${ty + jy * 0.16}%`,
        width: wide * 2.6, height: wide * 1.9, marginLeft: -wide * 1.3, marginTop: -wide * 0.95,
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(color, 0.42 * p)} 0%, ${rgba(color, 0.18 * p)} 38%, rgba(0,0,0,0) 72%)`,
        mixBlendMode: "screen",
      }} />
      {/* núcleo caliente: el punto duro del reflector */}
      <div style={{
        position: "absolute", left: `${tx + jx * 0.16}%`, top: `${ty + jy * 0.16}%`,
        width: wide * 0.6, height: wide * 0.46, marginLeft: -wide * 0.3, marginTop: -wide * 0.23,
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(V.white, 0.3 * p)} 0%, rgba(0,0,0,0) 68%)`,
        mixBlendMode: "screen",
      }} />
      {/* EL REBOTE EN EL AZULEJO: la segunda luz que no es la linterna. Un haz sobre azulejo blanco
          devuelve un resplandor difuso hacia abajo — por eso la cocina nunca se lee como un pozo. */}
      <div style={{
        position: "absolute", left: `${tx * 0.62 + 19}%`, top: `${ty * 0.5 + 46}%`,
        width: wide * 5.4, height: wide * 3.2, marginLeft: -wide * 2.7, marginTop: -wide * 1.6,
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(color, 0.11 * p)} 0%, rgba(0,0,0,0) 74%)`,
        mixBlendMode: "screen",
      }} />
      {/* el POLVO ENCENDIDO dentro del cono: lo que hace que un haz se lea como haz */}
      <div style={{
        position: "absolute", left: `${ox}%`, top: `${oy}%`,
        width: len * 1.14, height: wide, marginTop: -wide / 2,
        transformOrigin: "0% 50%", transform: `rotate(${ang.toFixed(3)}deg)`,
        clipPath: "polygon(0% 45.5%, 100% 0%, 100% 100%, 0% 54.5%)",
        opacity: 0.55 * p, mixBlendMode: "screen", overflow: "hidden",
      }}>
        {Array.from({ length: 22 }, (_, i) => {
          const a = rnd(i * 3.77), b = rnd(i * 8.13);
          const xx = ((a * 118 + f * (0.16 + b * 0.34)) % 118) - 9;
          const yy = 6 + b * 88 + Math.sin(f / (24 + a * 30) + i) * 5;
          const s = 2 + b * 3.4;
          return (
            <div key={i} style={{
              position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
              width: s, height: s, borderRadius: "50%",
              background: rgba(color, 0.24 + a * 0.4),
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA A · WIPE POR MATERIA — el propio haz barre el cuadro. Detrás ya están los bornes.
   Es LUZ cruzando (screen), no una banda de color: por eso no puede leerse como un fundido.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const BeamSweep: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const env = Math.sin(p * Math.PI);
  const x = lerp(-34, 132, EZ.push(p));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      <div style={{
        position: "absolute", top: "-28%", left: `${x.toFixed(1)}%`,
        width: "54%", height: "164%", transform: "rotate(-11deg)",
        background:
          `linear-gradient(96deg, rgba(0,0,0,0) 0%, ${rgba(V.torch, 0.1 * env)} 20%, ` +
          `${rgba(V.torch, 0.34 * env)} 50%, ${rgba(V.torch, 0.1 * env)} 78%, rgba(0,0,0,0) 100%)`,
      }} />
      {/* el polvo del aire de la noche, encendido de canto por el haz que pasa */}
      {Array.from({ length: 30 }, (_, i) => {
        const a = rnd(i * 4.4), b = rnd(i * 9.6);
        const lx = x - 8 + a * 56;
        const s = 3 + b * 6;
        return (
          <div key={i} style={{
            position: "absolute", left: `${lx.toFixed(2)}%`, top: `${(b * 112 - 6).toFixed(2)}%`,
            width: s, height: s, borderRadius: "50%",
            background: rgba(V.torch, (0.3 + b * 0.42) * env),
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA C · OCLUSIÓN — el canto del CAJÓN DE PLÁSTICO NEGRO de la batería cruza el cuadro.
   Nervios moldeados + filo encendido por la linterna. ⛔ NUNCA el color del fondo.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const BatteryEdge: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const x = lerp(-176, 176, EZ.push(p));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-56%", left: `${x.toFixed(1)}%`,
        width: "322%", height: "214%", transform: "rotate(-5deg)",
        background:
          `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.torch, 0.52)} 2.4%, ${BATT_LIT} 6%, ` +
          `${BATT_DARK} 20%, ${BATT_DARK} 80%, ${BATT_LIT} 94%, ${rgba(V.torch, 0.3)} 98%, rgba(0,0,0,0) 100%)`,
      }}>
        {/* los NERVIOS moldeados del cajón: es un objeto, no una banda */}
        <div style={{
          position: "absolute", inset: 0,
          background: `repeating-linear-gradient(90deg, ${rgba(V.white, 0.05)} 0px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 46px, ${rgba(V.ink0, 0.5)} 50px)`,
        }} />
        {/* especular del plástico: la linterna raspando la tapa */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            `linear-gradient(176deg, ${rgba(V.torch, 0.2)} 0%, rgba(0,0,0,0) 20%, ` +
            `rgba(0,0,0,0) 70%, ${rgba(V.ink0, 0.46)} 100%)`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   MATERIAL REAL QUE NO SE CONGELA — el clip corre en loops de 88 frames dentro de su <Sequence>.
   ⛔ Toda tarjeta flotante lleva material real adentro: acá siempre hay un clip o una foto.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
type Geo = {
  w: number; h: number; x: number; y: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  label?: string; lit?: number; litColor?: string; opacity?: number; grade?: boolean;
};
const VID = 88;
const LiveCard: React.FC<{ f: number; slug: string; mount: number; out: number; geo: Geo }> = ({
  f, slug, mount, out, geo,
}) => {
  if (f < mount || f >= out) return null;
  const loops = Math.max(1, Math.ceil((out - mount) / VID));
  const i = Math.min(loops - 1, Math.floor((f - mount) / VID));
  const from = mount + i * VID;
  const dur = Math.max(2, Math.min(VID, out - from));
  return (
    <Sequence from={from} durationInFrames={dur} layout="none">
      <MediaCard src={VIDEO(slug)} kind="video" sheenAt={i === 0 ? 14 : 6} {...geo} />
    </Sequence>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL LCD DEL TESTER — la 2ª fuente de luz del acto 2 y la puerta del ZOOM-THROUGH.
   El bisel y la pantalla son LUZ; el tester REAL vive en la MediaCard que va debajo. La cifra la
   escribe el kit: ningún motor de imagen dibuja un 11,8 legible.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const TesterLCD: React.FC<{
  f: number; x: number; y: number; w: number; value: string; warn: number; op: number;
}> = ({ f, x, y, w, value, warn, op }) => {
  if (op <= 0.01) return null;
  const h = Math.round(w * 0.54);
  const c = warn > 0.5 ? V.danger : V.volt;
  const pulse = 0.86 + Math.sin(f / 10) * 0.14;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, opacity: op,
      transform: `translateY(${(Math.sin(f / 55) * 2).toFixed(2)}px)`,
    }}>
      {/* el resplandor que la pantallita tira sobre el borne y la mano: fuente de luz de la escena */}
      <div style={{
        position: "absolute", left: "50%", top: "52%",
        width: w * 3.1, height: h * 3.4, marginLeft: -w * 1.55, marginTop: -h * 1.7,
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(c, 0.24 * pulse)} 0%, ${rgba(c, 0.08)} 40%, rgba(0,0,0,0) 74%)`,
        mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* el frente del aparato: gris del instrumento, NO el color del fondo */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 12,
        background: "linear-gradient(168deg, #3A3C33 0%, #26281F 64%, #1A1C16 100%)",
        boxShadow: `0 ${Math.round(h * 0.2)}px ${Math.round(h * 0.3)}px ${rgba(V.ink0, 0.82)}, inset 0 1px 0 ${rgba(V.white, 0.16)}`,
      }} />
      {/* el LCD */}
      <div style={{
        position: "absolute", left: "6%", top: "11%", width: "88%", height: "78%", borderRadius: 7,
        background: `linear-gradient(178deg, ${rgba(c, 0.22)} 0%, ${rgba(c, 0.09)} 48%, rgba(6,8,5,0.9) 100%)`,
        boxShadow: `inset 0 0 ${Math.round(h * 0.3)}px ${rgba(c, 0.34 * pulse)}, inset 0 1px 0 ${rgba(V.white, 0.2)}`,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: "8%", top: "16%",
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(h * 0.48), lineHeight: 1,
          color: c, textShadow: `0 0 ${Math.round(h * 0.3)}px ${rgba(c, 0.7)}`,
        }}>
          {value}
          <span style={{ fontSize: Math.round(h * 0.22), marginLeft: 8, color: rgba(c, 0.82) }}>V</span>
        </div>
        <div style={{
          position: "absolute", right: "8%", top: "20%", textAlign: "right",
          fontFamily: F_BODY, fontWeight: 700, fontSize: Math.round(h * 0.13),
          letterSpacing: 1.8, color: rgba(V.white, 0.66),
        }}>DC · 20V</div>
        {/* barrido del refresco del LCD (hold VIVO) */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "28%",
          top: `${(((f * 0.85) % 140) - 22).toFixed(1)}%`,
          background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.white, 0.05)}, rgba(0,0,0,0))`,
        }} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 3 · LA ESCALA DE TENSIÓN — la única imagen que explica todo el movimiento.
   Un GRÁFICO sí puede ser vectorial (el Stage lo dice): un eje, una zona roja y un indicador.
   El material real va al lado y debajo. 12,6 SANA · 12,0 EL LÍMITE · 11,8 DONDE ESTÁ.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const SC_TOP = 12.85, SC_BOT = 11.45, SC_H = 452, SC_W = 44;
const sy = (v: number) => ((SC_TOP - v) / (SC_TOP - SC_BOT)) * SC_H;
const fmt = (v: number) => v.toFixed(1).replace(".", ",");

const VoltScale: React.FC<{
  f: number; value: number; pSana: number; pLim: number; pCae: number; op: number;
}> = ({ f, value, pSana, pLim, pCae, op }) => {
  if (op <= 0.01) return null;
  const yv = sy(value);
  const dangerTop = sy(12.0);
  const ticks = [12.8, 12.6, 12.4, 12.2, 12.0, 11.8, 11.6];
  const glow = 0.72 + 0.28 * Math.sin(f / 12);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 620, height: SC_H + 96, opacity: op }}>
      {/* el TUBO de la escala: vidrio con su bisel, no una barra plana */}
      <div style={{
        position: "absolute", left: 132, top: 40, width: SC_W, height: SC_H, borderRadius: SC_W / 2,
        background: `linear-gradient(180deg, ${rgba(V.volt, 0.16)} 0%, ${rgba(V.ink2, 0.9)} 34%, ${rgba(V.ink1, 0.95)} 100%)`,
        boxShadow: `inset 0 2px 6px ${rgba(V.ink0, 0.9)}, inset 0 0 26px ${rgba(V.white, 0.06)}, 0 18px 44px ${rgba(V.ink0, 0.7)}`,
        overflow: "hidden",
      }}>
        {/* ZONA ROJA: todo lo que está por debajo de 12,0 */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: dangerTop, bottom: 0,
          background: `linear-gradient(180deg, ${rgba(V.danger, 0.42 * pLim)} 0%, ${rgba(V.danger, 0.14 * pLim)} 100%)`,
        }} />
        {/* ZONA SANA: de 12,6 para arriba */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: sy(12.6),
          background: `linear-gradient(180deg, ${rgba(V.volt, 0.4 * pSana)} 0%, ${rgba(V.volt, 0.1 * pSana)} 100%)`,
        }} />
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: `linear-gradient(180deg, ${rgba(V.white, 0.22)}, rgba(0,0,0,0))`,
        }} />
      </div>

      {/* las marcas y sus cifras — las escribe el kit */}
      {ticks.map((v) => {
        const big = v === 12.6 || v === 12.0;
        return (
          <div key={v} style={{ position: "absolute", left: 62, top: 40 + sy(v) - 12, width: 560, height: 24 }}>
            <div style={{
              position: "absolute", left: 0, top: 11, width: big ? 66 : 52, height: big ? 2 : 1,
              background: rgba(V.white, big ? 0.4 : 0.2),
            }} />
            <div style={{
              position: "absolute", left: big ? -8 : 2, top: 0, width: 58, textAlign: "right",
              fontFamily: F_DISPLAY, fontWeight: big ? 800 : 600, fontSize: big ? 27 : 21,
              letterSpacing: 1.2, color: rgba(V.white, big ? 0.9 : 0.44),
              textShadow: "0 3px 14px rgba(0,0,0,0.9)",
            }}>{fmt(v)}</div>
          </div>
        );
      })}

      {/* 12,6 SANA */}
      <div style={{
        position: "absolute", left: 190, top: 40 + sy(12.6) - 17, opacity: pSana,
        transform: `translateX(${lerp(26, 0, EZ.snap(pSana)).toFixed(1)}px)`,
      }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: 3.4,
          color: V.volt, textShadow: `0 0 22px ${rgba(V.volt, 0.5)}, 0 3px 14px rgba(0,0,0,0.9)`,
        }}>SANA · EN REPOSO</div>
      </div>

      {/* 12,0 EL LÍMITE — la línea roja, punteada y a todo el ancho */}
      <div style={{ position: "absolute", left: 132, top: 40 + dangerTop - 1, width: 420, opacity: pLim }}>
        <div style={{
          height: 3,
          background: `repeating-linear-gradient(90deg, ${V.danger} 0px, ${V.danger} 13px, rgba(0,0,0,0) 13px, rgba(0,0,0,0) 24px)`,
          boxShadow: `0 0 ${16 + glow * 10}px ${rgba(V.danger, 0.6)}`,
          transform: `scaleX(${EZ.push(pLim).toFixed(3)})`, transformOrigin: "0% 50%",
        }} />
        <div style={{
          position: "absolute", right: 0, top: -40,
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: 3.4,
          color: V.danger, textShadow: `0 0 20px ${rgba(V.danger, 0.5)}, 0 3px 14px rgba(0,0,0,0.9)`,
        }}>EL LÍMITE</div>
      </div>

      {/* EL INDICADOR: cae de 12,6 a 11,8 y SE QUEDA por debajo de la línea roja */}
      <div style={{
        position: "absolute", left: 88, top: 40 + yv - 34, width: 520, height: 68,
        opacity: clamp01(pCae * 3),
      }}>
        {/* el filo del indicador sobre el tubo */}
        <div style={{
          position: "absolute", left: 44, top: 30, width: 92, height: 7, borderRadius: 4,
          background: `linear-gradient(90deg, ${rgba(V.white, 0.2)}, ${V.bone})`,
          boxShadow: `0 0 ${18 + glow * 8}px ${rgba(V.white, 0.4)}`,
        }} />
        <div style={{ position: "absolute", left: 200, top: -16 }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <Num size={96} color={value < 12.0 ? V.danger : V.volt}>{fmt(value)}</Num>
            <div style={{
              marginLeft: 10, marginBottom: 16,
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 38,
              color: rgba(value < 12.0 ? V.danger : V.volt, 0.85),
            }}>V</div>
          </div>
          <div style={{
            marginTop: 2, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3.2,
            color: rgba(V.white, 0.74), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
          }}>DONDE ESTÁ LA MÍA</div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 4 · LA TRAZA DEL ARRANQUE — el latido, dibujado. Siete compresiones con las pausas
   acortándose: se VE que gira pesado y que engancha por poco. Sin una sola cifra inventada.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CrankTrace: React.FC<{
  f: number; ats: number[]; catchAt: number; op: number; w?: number;
}> = ({ f, ats, catchAt, op, w = 620 }) => {
  if (op <= 0.01) return null;
  const t0 = ats[0] - 16;
  const t1 = catchAt + 46;
  const span = Math.max(1, t1 - t0);
  const caught = clamp01((f - catchAt) / 22);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 148, opacity: op }}>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 26, height: 2,
        background: `linear-gradient(90deg, ${rgba(V.white, 0.06)}, ${rgba(V.white, 0.22)}, ${rgba(V.white, 0.06)})`,
      }} />
      {/* cada compresión: una púa que sube. Las que ya pasaron quedan escritas. */}
      {ats.map((at, i) => {
        const born = clamp01((f - at) / 5);
        if (born <= 0) return null;
        const px = ((at - t0) / span) * w;
        const hh = lerp(38, 96, i / Math.max(1, ats.length - 1)) * lerp(0.55, 1, EZ.snap(born));
        const hot = clamp01(1 - (f - at) / 12);
        return (
          <div key={i} style={{
            position: "absolute", left: px, bottom: 26, width: 7, height: hh, marginLeft: -3.5,
            borderRadius: 3,
            background: `linear-gradient(180deg, ${rgba(V.amber, 0.5 + 0.5 * hot)}, ${rgba(V.amber, 0.16)})`,
            boxShadow: hot > 0.02 ? `0 0 ${16 + hot * 26}px ${rgba(V.amber, 0.6 * hot)}` : "none",
          }} />
        );
      })}
      {/* el enganche: la traza se vuelve continua y verde-voltio */}
      {caught > 0 && (
        <div style={{
          position: "absolute", left: ((catchAt - t0) / span) * w, bottom: 26,
          width: (w - ((catchAt - t0) / span) * w) * EZ.push(caught), height: 5, borderRadius: 3,
          background: `linear-gradient(90deg, ${rgba(V.volt, 0.9)}, ${rgba(V.volt, 0.45)})`,
          boxShadow: `0 0 ${18 + Math.sin(f / 9) * 8}px ${rgba(V.volt, 0.55)}`,
        }} />
      )}
      <div style={{
        position: "absolute", left: 0, bottom: 0,
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 3.2,
        color: rgba(V.white, 0.6), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
      }}>GIRÓ CON ESFUERZO</div>
      <div style={{
        position: "absolute", right: 0, bottom: 0, opacity: caught,
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 22, letterSpacing: 3.2,
        color: V.volt, textShadow: `0 0 18px ${rgba(V.volt, 0.5)}, 0 3px 14px rgba(0,0,0,0.9)`,
      }}>ENGANCHÓ · POR POCO</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA D · MATCH-SHAPE — EL MISMO CÍRCULO. Vive en espacio de PANTALLA (con un pelo de
   parallax para que no se lea pegado) y NO SE CORTA: es el aro cromado del contacto y, del otro
   lado del corte, el sol frío del amanecer. Sólo migra el MATERIAL, en 12 frames.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const RingBridge: React.FC<{
  f: number; x: number; y: number; size: number; sun: number; flare: number; spin: number; op: number;
  px: number; py: number;
}> = ({ f, x, y, size, sun, flare, spin, op, px, py }) => {
  if (op <= 0.01) return null;
  const r = size / 2;
  const chrome = 1 - sun;
  const breath = 0.97 + Math.sin(f / 71) * 0.03;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: size, height: size, marginLeft: -r, marginTop: -r, opacity: op,
      transform: `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) scale(${breath.toFixed(3)})`,
      pointerEvents: "none",
    }}>
      {/* el halo: cromo que devuelve la linterna → disco frío del amanecer */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: size * (2.4 + sun * 1.6), height: size * (2.4 + sun * 1.6),
        marginLeft: -size * (1.2 + sun * 0.8), marginTop: -size * (1.2 + sun * 0.8),
        borderRadius: "50%",
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(sun > 0.5 ? V.sky : V.torch, (0.16 + 0.3 * sun + 0.4 * flare))} 0%, rgba(0,0,0,0) 70%)`,
        mixBlendMode: "screen",
      }} />
      {/* EL DISCO interior: hueco del contacto (oscuro, con la ranura) → cara del sol (clara) */}
      <div style={{
        position: "absolute", inset: size * 0.13, borderRadius: "50%",
        background: sun < 0.5
          ? `radial-gradient(58% 58% at 42% 34%, ${rgba(V.ink2, 0.96)} 0%, ${rgba(V.ink1, 0.98)} 74%)`
          : `radial-gradient(60% 60% at 46% 40%, ${rgba(V.white, 0.68)} 0%, ${rgba(V.sky, 0.52)} 58%, ${rgba(V.sky, 0.2)} 100%)`,
        boxShadow: sun < 0.5
          ? `inset 0 3px 10px ${rgba(V.ink0, 0.9)}`
          : `0 0 ${Math.round(size * 0.5)}px ${rgba(V.sky, 0.5)}`,
        opacity: 1,
      }} />
      {/* la RANURA de la llave (sólo del lado del contacto) */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: size * 0.05, height: size * 0.36,
        marginLeft: -size * 0.025, marginTop: -size * 0.18, borderRadius: 3,
        background: rgba(V.ink0, 0.92 * chrome), opacity: chrome,
        transform: `rotate(${spin.toFixed(2)}deg)`,
        boxShadow: `0 0 8px ${rgba(V.ink0, 0.9 * chrome)}`,
      }} />
      {/* EL ARO: la forma que sobrevive la frontera */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `${Math.round(size * 0.075)}px solid ${rgba(CHROME, 0.34 + 0.5 * chrome)}`,
        boxShadow:
          `inset 0 ${Math.round(size * 0.04)}px ${Math.round(size * 0.08)}px ${rgba(V.ink0, 0.7 * chrome)}, ` +
          `0 0 ${Math.round(size * (0.16 + flare * 0.6))}px ${rgba(chrome > 0.5 ? V.torch : V.sky, 0.34 + flare * 0.6)}`,
      }} />
      {/* especular del cromo: el punto donde le pega la linterna (y el flare del beat) */}
      <div style={{
        position: "absolute", left: "16%", top: "12%", width: size * 0.34, height: size * 0.2,
        borderRadius: "50%", mixBlendMode: "screen",
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(V.white, (0.3 + flare * 0.6) * (0.35 + 0.65 * chrome))} 0%, rgba(0,0,0,0) 72%)`,
        transform: `rotate(${(spin * 0.4).toFixed(2)}deg)`,
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 5 · EL AMANECER FRÍO — el gris azulado que entra por la ventana. Es la fuente que releva
   a la linterna, y es lo más luminoso de todo el movimiento (por eso el final no cae a negro).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const DawnWindow: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.01) return null;
  const drift = Math.sin(f / 133) * 1.6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* la luz cruda que entra por el vano */}
      <AbsoluteFill style={{
        background:
          `linear-gradient(${(102 + drift).toFixed(2)}deg, ${rgba("#B9D2E2", 0.34 * p)} 0%, ` +
          `${rgba(V.sky, 0.2 * p)} 26%, rgba(0,0,0,0) 62%)`,
        mixBlendMode: "screen",
      }} />
      {/* el charco frío en el piso: lo que la ventana proyecta */}
      <AbsoluteFill style={{
        background: `radial-gradient(72% 46% at ${(24 + drift).toFixed(1)}% 74%, ${rgba(V.sky, 0.26 * p)} 0%, rgba(0,0,0,0) 72%)`,
        mixBlendMode: "screen",
      }} />
      {/* el aire de la mañana: azul frío pisando el ámbar de la noche */}
      <AbsoluteFill style={{ background: rgba("#2B4257", 0.16 * p), mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovNoche: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const D = durationInFrames;
  const f = useCurrentFrame();
  const A = (x: number) => Math.round(D * x);

  /* ── LA CÁMARA — UNA sola, función del frame GLOBAL. ⛔ ningún acto la reinicia en 0. ─────
     Entra en z 0 (donde la dejó MovGuia) y viaja a z 180 con ry +7, que es donde la agarra
     MovCosto. El reloj `clk` está DEFORMADO pero es MONÓTONO: acelera cuando el haz barre y
     cuando la llave gira, y se frena en la escala y en el amanecer.                         */
  const clk = keyed(f,
    [0, A(KF.fA), A(KF.once), A(KF.fB), A(KF.escala), A(KF.cae), A(KF.fC), A(KF.llave), A(KF.engancha), A(KF.fD), A(KF.quieta), D],
    [0, A(0.14), A(0.23), A(0.36), A(0.42), A(0.50), A(0.58), A(0.67), A(0.78), A(0.86), A(0.96), D],
    [EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.lin, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.lin]);
  const g = gcam(clk, { z0: 0, z1: 180, ry: 7, rx: 1.2, dur: D });
  const mag = 1500 / (1500 - g.z);

  // excursión propia de la cámara (vuelve a 0 en D: el handoff sale limpio en z/ry)
  const camX = keyed(f, [0, A(0.2), A(KF.escala), A(KF.fC), A(KF.fD), D], [0, -26, 34, -18, 22, 0],
    [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide]);
  const camY = keyed(f, [0, A(KF.fA), A(KF.mitad), A(KF.cae), A(KF.llave), A(KF.fD), D], [0, 30, 58, 10, -22, -34, 0],
    [EZ.glide, EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.glide]);

  /* ── EL ENCUADRE: qué punto queda al centro y a qué aumento NETO ────────────────────────── */
  const net = keyed(f,
    [0, A(KF.barrido), A(KF.fA), A(KF.bornes), A(KF.once), A(KF.mitad), A(KF.fB), A(KF.escala), A(KF.cae), A(KF.fC), A(KF.auto), A(KF.llave), A(KF.engancha), A(KF.fD), A(KF.alba), A(KF.quieta), D],
    [1.00, 1.10, 1.16, 1.22, 1.16, 1.24, 1.62, 1.04, 1.09, 1.12, 1.18, 1.30, 1.40, 1.24, 1.10, 1.16, 1.05],
    [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.lin, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.glide, EZ.soft]);
  const fx = keyed(f,
    [0, A(KF.barrido), A(KF.fA), A(KF.bornes), A(KF.once), A(KF.fB), A(KF.escala), A(KF.cae), A(KF.fC), A(KF.auto), A(KF.llave), A(KF.fD), A(KF.alba), A(KF.quieta), D],
    [860, 700, 980, 760, 1150, 1459, 900, 860, 960, 900, 1080, 1160, 900, 1080, 1020],
    [EZ.lin, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.lin, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.lin]);
  const fy = keyed(f,
    [0, A(KF.barrido), A(KF.fA), A(KF.bornes), A(KF.once), A(KF.fB), A(KF.escala), A(KF.cae), A(KF.fC), A(KF.auto), A(KF.llave), A(KF.fD), A(KF.alba), A(KF.quieta), D],
    [470, 420, 560, 600, 520, 367, 520, 560, 520, 540, 480, 470, 500, 520, 540],
    [EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.lin, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.lin, EZ.soft]);

  /* ── EL LATIDO DEL ARRANQUE — cada compresión sacude TODO el cuadro (cámara + luz) ──────── */
  let beat = 0;
  for (let i = 0; i < CRANKS.length; i++) {
    const d = Math.abs(f - A(CRANKS[i])) / 5.2;
    if (d < 1) beat = Math.max(beat, (1 - d) * (1 - d));
  }
  const running = clamp01((f - A(KF.engancha)) / 20) * (1 - clamp01((f - A(KF.fD)) / 12));
  const idle = running * (0.5 + 0.5 * Math.sin(f / 4.7)) * 0.35;
  const shake = beat * 0.009 + idle * 0.0022;

  const ws = (net / mag) * (1 + shake);
  const panX = 960 - fx, panY = 540 - fy;

  /* ── LA LUZ — un solo viaje: (volt residual de MovGuia) → TORCH pleno → SKY del amanecer ── */
  const stage = keyed(f, [0, A(0.032), A(KF.fD), A(KF.alba), D], [0, 1, 1, 1.9, 2],
    [EZ.push, EZ.lin, EZ.glide, EZ.soft]);
  const tint = stage <= 1 ? light(stage, "volt", "torch") : light(stage - 1, "torch", "sky");
  const dawn = clamp01((stage - 1) / 1);

  /* ── EL HAZ: siempre apuntando a algo con TEXTURA. Nunca al vacío. ──────────────────────── */
  const torchX = keyed(f,
    [0, A(KF.hora), A(KF.barrido), A(KF.fA), A(KF.bornes), A(KF.lcd), A(KF.once), A(KF.fB), A(KF.escala), A(KF.cae), A(KF.fC), A(KF.auto), A(KF.llave), A(KF.engancha), A(KF.fD), A(KF.alba), D],
    [34, 44, 33, 70, 47, 72, 68, 52, 79, 76, 46, 48, 58, 60, 62, 58, 55],
    [EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.lin, EZ.glide, EZ.soft]);
  const torchY = keyed(f,
    [0, A(KF.hora), A(KF.barrido), A(KF.fA), A(KF.bornes), A(KF.lcd), A(KF.once), A(KF.fB), A(KF.escala), A(KF.cae), A(KF.fC), A(KF.auto), A(KF.llave), A(KF.fD), D],
    [38, 55, 48, 63, 55, 32, 34, 48, 40, 44, 55, 55, 48, 45, 42],
    [EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.lin]);
  // ⛔ `power` no baja de 0.58 hasta 0.884, y para entonces el amanecer ya está a plena potencia
  const torchPow = keyed(f,
    [0, A(0.03), A(KF.fA) - 4, A(KF.fA) + 10, A(KF.once), A(KF.fB), A(KF.escala), A(KF.fC), A(KF.llave), A(KF.fD), A(KF.alba), A(KF.apaga), D],
    [0.74, 1.0, 1.0, 0.94, 0.9, 0.86, 0.78, 0.9, 0.86, 0.72, 0.4, 0.0, 0.0],
    [EZ.push, EZ.lin, EZ.snap, EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.push, EZ.soft, EZ.lin]);
  const torchSpread = keyed(f,
    [0, A(KF.fA), A(KF.once), A(KF.escala), A(KF.llave), D], [360, 430, 210, 300, 250, 320],
    [EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.glide]);
  const atmoInt = keyed(f, [0, A(KF.fA), A(KF.fB), A(KF.fC), A(KF.fD), A(KF.alba), D],
    [0.7, 0.68, 0.72, 0.7, 0.78, 0.98, 0.94], EZ.soft) + beat * 0.1;

  /* ── LAS PARTÍCULAS — el aire de la noche (.55) que se aquieta con el amanecer (.30) ────── */
  const wind = keyed(f, [0, A(KF.fB), A(KF.fC), A(KF.llave), A(KF.engancha), A(KF.fD), A(KF.alba), D],
    [0.55, 0.55, 0.52, 0.62, 0.58, 0.5, 0.36, 0.3],
    [EZ.lin, EZ.soft, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft]);

  /* ── LA CIFRA DE LA ESCALA: 12,6 → cae → 11,8 y SE QUEDA ahí ────────────────────────────── */
  const scaleV = keyed(f, [A(KF.sana), A(KF.cae), A(KF.cae) + 26, D], [12.6, 12.6, 11.8, 11.8],
    [EZ.lin, EZ.push, EZ.lin]);

  /* ── VENTANAS DE MONTAJE: cada acto se apaga sólo cuando su costura ya lo tapó ───────────── */
  const zt = zoomThrough(f, A(KF.fB), Math.round(D * 0.042), 68, 38);
  const preZoom = f < A(KF.fB) + Math.round(D * 0.05);   // actos 1+2, se van POR el LCD
  const inScale = f >= A(KF.fB) - 8 && f < A(KF.fC) + 6; // acto 3, corta DENTRO de la oclusión
  const inCar = f >= A(KF.fC) + 2 && f < A(KF.fD);       // acto 4, nace TAPADO por la oclusión
  const inDawn = f >= A(KF.fD);                          // acto 5, corte duro bajo el MATCH-SHAPE

  /* ── LA CAMA DE FOTO: sólo cambia DENTRO de una costura que la tapa ─────────────────────── */
  const farSrc = f < A(KF.fB) + Math.round(D * 0.022) ? IMG(M.cocina)
    : f < A(KF.fC) + 3 ? IMG(M.claudio)
      : f < A(KF.fD) ? IMG(M.bateriaAuto) : IMG(M.amanecer);
  const farDim = f < A(KF.fB) + Math.round(D * 0.022) ? 0.54
    : f < A(KF.fC) + 3 ? 0.58
      : f < A(KF.fD) ? 0.5 : 0.3;
  const farScale = keyed(f, [0, A(KF.fB), A(KF.fC), A(KF.fD), D], [2.3, 2.1, 2.0, 1.9, 1.7], EZ.soft);

  /* ── LA FRONTERA D: el aro que NO se corta ───────────────────────────────────────────────── */
  const ringOp = keyed(f, [A(KF.llave) - 10, A(KF.llave) + 12, A(KF.alba) + 20, A(KF.quieta) - 10, D],
    [0, 1, 1, 1, 1], [EZ.push, EZ.lin, EZ.lin, EZ.lin]);
  const ringSun = keyed(f, [A(KF.fD), A(KF.fD) + 12], [0, 1], EZ.soft);
  const ringFlare = clamp01(1 - Math.abs(f - A(KF.fD)) / 7) * 0.9 + beat * 0.35;
  // la llave GIRA: 0° → 34° (contacto) → 62° (arranque) y vuelve a 34° cuando engancha
  const ringSpin = keyed(f,
    [A(KF.llave), A(KF.llave) + 9, A(CRANKS[0]) - 4, A(KF.engancha), A(KF.engancha) + 14, D],
    [0, 34, 62, 62, 34, 34], [EZ.snap, EZ.push, EZ.lin, EZ.glide, EZ.lin]);
  const ringSize = keyed(f, [A(KF.llave), A(KF.fD), A(KF.alba), A(KF.quieta), D], [300, 300, 262, 246, 240],
    [EZ.lin, EZ.soft, EZ.glide, EZ.soft]);

  /* ── TEXTO: 1 idea por acto, titular ≤7 palabras, cama oscura, safe area 60 px ───────────── */
  const paraX = -panX * 0.014, paraY = -panY * 0.011;
  const tIn = (at: number, out: number, ramp = 14) =>
    clamp01((f - A(at)) / ramp) * (1 - clamp01((f - A(out)) / 16));
  const t1 = tIn(KF.hook, 0.152);
  const t2 = tIn(0.212, 0.372);
  const t3 = tIn(KF.regla, 0.592);
  const t4 = tIn(0.646, 0.826);
  const t5 = tIn(0.872, 0.994, 16);
  const scaleOp = keyed(f, [A(KF.escala) - 12, A(KF.escala) + 14, A(KF.fC) + 2, A(KF.fC) + 4], [0, 1, 1, 0],
    [EZ.push, EZ.lin, EZ.lin]);
  const traceOp = keyed(f, [A(CRANKS[0]) - 10, A(CRANKS[0]) + 8, A(0.812), A(0.834)], [0, 1, 1, 0],
    [EZ.push, EZ.lin, EZ.push]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink1, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA — montada UNA vez para los D frames. ⛔ no se remonta entre actos. ── */}
      <VoltAtmos tint={tint} tint2={V.amber} keyFrom={clamp01(torchX / 100)} intensity={atmoInt} floor={0.5} />

      {/* ══ EL MUNDO, bajo UNA sola cámara ══════════════════════════════════════════════════ */}
      <Layers cam={g.transform}>
        <AbsoluteFill style={{
          transform: `translate3d(${camX.toFixed(2)}px, ${camY.toFixed(2)}px, 0)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ── FUENTE #1 · LA CAMA DE FOTO. Nunca hay fondo plano en los márgenes. ── */}
          <PhotoPlane src={farSrc} kind="photo" z={-540} scale={farScale} dim={farDim}
            tint={dawn > 0.5 ? V.sky : V.torch} />
          {/* grade de noche: azula sin apagar. ⛔ nada de blur full-screen. */}
          <Plane z={-520}>
            <AbsoluteFill style={{
              background:
                `linear-gradient(182deg, ${rgba("#16212C", 0.3 * (1 - dawn * 0.8))} 0%, ` +
                `${rgba("#0E141A", 0.44 * (1 - dawn * 0.75))} 58%, ${rgba(V.ink1, 0.6 * (1 - dawn * 0.5))} 100%)`,
            }} />
            <AbsoluteFill style={{
              background: `radial-gradient(76% 42% at 52% 96%, ${rgba(V.amber, 0.08)} 0%, rgba(0,0,0,0) 70%)`,
            }} />
          </Plane>

          {/* ── EL MUNDO ESCALADO (encuadre) ── */}
          <AbsoluteFill style={{
            transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
            transformStyle: "preserve-3d",
          }}>
            {/* ═══ ACTOS 1 y 2 — se van POR el LCD en el zoom-through de la frontera B ═══ */}
            {preZoom && (
              <AbsoluteFill style={{
                transform: zt.out === "none" ? undefined : zt.out,
                opacity: zt.opacity, transformStyle: "preserve-3d",
              }}>
                {/* ── ACTO 1 · LA COCINA DORMIDA ───────────────────────────────────────── */}
                {f < A(0.212) && (
                  <>
                    <Plane z={-90}>
                      <LiveCard f={f} slug={M.cocina} mount={0} out={A(0.212)} geo={{
                        w: 880, h: 520, x: 48, y: 50, z: 0, ry: 6, rx: -2, radius: 14,
                        label: "LA COCINA, A OSCURAS", litColor: V.torch,
                        lit: keyed(f, [0, A(KF.hora), A(KF.barrido), A(KF.fA), A(0.212)], [0.3, 0.62, 0.5, 0.9, 0.4], EZ.soft),
                        opacity: keyed(f, [0, A(0.012), A(KF.fA) + 15, A(KF.fA) + 17], [0.86, 1, 1, 0], [EZ.lin, EZ.lin, EZ.lin]),
                      }} />
                    </Plane>
                    <Plane z={-320}>
                      <MediaCard
                        src={IMG(M.claudio)} kind="photo"
                        w={340} h={218} x={19} y={70} z={0} ry={15} radius={10}
                        label="TODAVÍA CORTADA" lit={0.34} litColor={V.torch} sheenAt={A(0.07)}
                        opacity={keyed(f, [A(0.03), A(0.062), A(KF.fA) + 14, A(KF.fA) + 16], [0, 0.82, 0.82, 0], [EZ.push, EZ.lin, EZ.lin])}
                      />
                    </Plane>
                    {/* LA HORA la escribe el kit — ningún motor de imagen dibuja un 5:30 legible */}
                    <Plane z={180}>
                      <Readout
                        value="5:30" unit="AM" label="La luz seguía cortada"
                        at={A(KF.hora)} x={74} y={26} size={104} color={V.torch}
                      />
                      <IconPng src={IC("reloj")} x={74} y={41} size={64} z={0} glow={V.ink0}
                        opacity={keyed(f, [A(KF.hora) + 6, A(KF.hora) + 22, A(KF.fA) - 8, A(KF.fA) + 4], [0, 0.82, 0.82, 0], [EZ.push, EZ.lin, EZ.push])} />
                      <IconPng src={IC("bombillanoche")} x={22} y={30} size={82} z={0} glow={V.ink0}
                        opacity={keyed(f, [A(0.02), A(0.05), A(KF.barrido), A(KF.fA)], [0, 0.66, 0.66, 0], [EZ.push, EZ.lin, EZ.push])} />
                    </Plane>
                  </>
                )}

                {/* ── ACTO 2 · LAS DOS PUNTAS EN LOS BORNES ────────────────────────────── */}
                {f >= A(KF.fA) - 4 && (
                  <>
                    <Plane z={70}>
                      <LiveCard f={f} slug={M.bornes} mount={A(KF.fA) - 4} out={A(KF.fB) + Math.round(D * 0.05)} geo={{
                        w: 680, h: 430, x: 38, y: 58, z: 0, ry: 7, rx: -2, radius: 13,
                        label: "LAS DOS PUNTAS EN LOS BORNES", litColor: V.torch,
                        lit: keyed(f, [A(KF.fA), A(KF.bornes), A(KF.once), A(KF.fB)], [0.55, 1, 0.9, 0.7], EZ.soft),
                        opacity: keyed(f, [A(KF.fA) - 4, A(KF.fA) + 14, A(KF.fB)], [0, 1, 1], [EZ.push, EZ.lin]),
                      }} />
                    </Plane>
                    {/* el tester REAL; el LCD dibujado va encima, en otro plano */}
                    <Plane z={-70}>
                      <MediaCard
                        src={IMG(M.pantalla)} kind="photo"
                        w={470} h={300} x={76} y={34} z={0} ry={-13} rx={2} radius={12}
                        lit={0.6} litColor={V.torch} sheenAt={A(KF.lcd) + 6}
                        opacity={keyed(f, [A(KF.lcd) - 16, A(KF.lcd) + 4, A(KF.fB)], [0, 0.96, 0.96], [EZ.push, EZ.lin])}
                      />
                    </Plane>
                    {/* FUENTE #3 · EL LCD: la cifra la escribe el kit */}
                    <Plane z={170}>
                      <TesterLCD
                        f={f} x={76} y={34} w={306} value="11.8" warn={f >= A(KF.once) ? 1 : 0}
                        op={keyed(f, [A(KF.lcd), A(KF.lcd) + 12, A(KF.fB) + 10], [0, 1, 1], [EZ.push, EZ.lin])}
                      />
                      <IconPng src={IC("tester")} x={18} y={26} size={78} z={0} glow={V.ink0}
                        opacity={keyed(f, [A(KF.bornes), A(KF.bornes) + 16, A(KF.mitad), A(KF.mitad) + 18], [0, 0.8, 0.8, 0], [EZ.push, EZ.lin, EZ.push])} />
                    </Plane>
                    {/* EL NÚMERO QUE SALTA */}
                    {f >= A(KF.once) - 2 && f < A(KF.fB) + 8 && (
                      <Plane z={230}>
                        <Readout
                          value="11,8" unit="V" label="Después de toda la noche"
                          at={A(KF.once)} x={74} y={63} size={148} color={V.danger}
                        />
                      </Plane>
                    )}
                  </>
                )}
              </AbsoluteFill>
            )}

            {/* ═══ ACTO 3 · LA ESCALA DE TENSIÓN — sale del otro lado del zoom-through ═══ */}
            {inScale && (
              <>
                <Plane z={-160}>
                  <MediaCard
                    src={IMG(M.pantalla)} kind="photo"
                    w={430} h={276} x={77} y={38} z={0} ry={-14} radius={11}
                    label="LO QUE MARCA" lit={0.72} litColor={V.torch} sheenAt={A(KF.escala) + 10}
                    opacity={keyed(f, [A(KF.fB) - 8, A(KF.escala), A(KF.fC) + 2, A(KF.fC) + 4], [0, 0.96, 0.96, 0], [EZ.push, EZ.lin, EZ.lin])}
                  />
                </Plane>
                <Plane z={-330}>
                  <MediaCard
                    src={IMG(M.bornes)} kind="photo"
                    w={330} h={210} x={81} y={72} z={0} ry={-18} rx={4} radius={10}
                    lit={0.42} litColor={V.torch}
                    opacity={keyed(f, [A(KF.sana), A(KF.sana) + 20, A(KF.fC) + 2, A(KF.fC) + 4], [0, 0.8, 0.8, 0], [EZ.push, EZ.lin, EZ.lin])}
                  />
                </Plane>
                <Plane z={140}>
                  <div style={{ position: "absolute", left: 128, top: 236 }}>
                    <VoltScale
                      f={f} value={scaleV} op={scaleOp}
                      pSana={keyed(f, [A(KF.sana), A(KF.sana) + 16], [0, 1], EZ.snap)}
                      pLim={keyed(f, [A(KF.limite), A(KF.limite) + 18], [0, 1], EZ.push)}
                      pCae={keyed(f, [A(KF.sana) + 4, A(KF.sana) + 18], [0, 1], EZ.snap)}
                    />
                  </div>
                  <IconPng src={IC("bateria")} x={58} y={24} size={84} z={0} glow={V.ink0}
                    opacity={keyed(f, [A(KF.escala), A(KF.escala) + 18, A(KF.regla), A(KF.regla) + 18], [0, 0.78, 0.78, 0], [EZ.push, EZ.lin, EZ.push])} />
                </Plane>
              </>
            )}

            {/* ═══ ACTO 4 · LA BATERÍA VUELVE AL AUTO Y LA LLAVE GIRA ═══════════════════ */}
            {inCar && (
              <>
                <Plane z={-60}>
                  <LiveCard f={f} slug={M.bateriaAuto} mount={A(KF.fC) + 2} out={A(KF.llave) + 10} geo={{
                    w: 850, h: 510, x: 45, y: 52, z: 0, ry: 6, rx: -2, radius: 14,
                    label: "LA VOLVÍ A PONER EN EL AUTO", litColor: V.torch,
                    lit: keyed(f, [A(KF.fC), A(KF.auto), A(KF.llave)], [0.5, 0.92, 0.8], EZ.soft),
                    opacity: keyed(f, [A(KF.fC) + 2, A(KF.fC) + 4, A(KF.llave), A(KF.llave) + 10], [0, 1, 1, 0], [EZ.lin, EZ.lin, EZ.push]),
                  }} />
                </Plane>
                <Plane z={-30}>
                  <LiveCard f={f} slug={M.llave} mount={A(KF.llave) + 2} out={A(KF.fD)} geo={{
                    w: 880, h: 520, x: 52, y: 48, z: 0, ry: 4, rx: -1, radius: 14,
                    label: "GIRÉ LA LLAVE", litColor: V.torch,
                    lit: 0.6 + beat * 0.35 + running * 0.12,
                    opacity: keyed(f, [A(KF.llave) + 2, A(KF.llave) + 14, A(KF.fD)], [0, 1, 1], [EZ.push, EZ.lin]),
                  }} />
                </Plane>
                <Plane z={-340}>
                  <MediaCard
                    src={IMG(M.claudio)} kind="photo"
                    w={320} h={206} x={19} y={26} z={0} ry={17} radius={10}
                    lit={0.36} litColor={V.torch}
                    opacity={keyed(f, [A(KF.auto), A(KF.auto) + 20, A(KF.engancha), A(KF.engancha) + 20], [0, 0.76, 0.76, 0], [EZ.push, EZ.lin, EZ.push])}
                  />
                </Plane>
                <Plane z={200}>
                  <IconPng src={IC("auto")} x={72} y={22} size={92} z={0} glow={V.ink0}
                    opacity={keyed(f, [A(KF.auto), A(KF.auto) + 16, A(KF.llave) + 20, A(KF.llave) + 34], [0, 0.82, 0.82, 0], [EZ.push, EZ.lin, EZ.push])} />
                  <IconPng src={IC("llaveauto")} x={72} y={22} size={86} z={0} glow={V.ink0}
                    opacity={keyed(f, [A(KF.llave) + 16, A(KF.llave) + 30, A(0.806), A(0.824)], [0, 0.86, 0.86, 0], [EZ.push, EZ.lin, EZ.push])} />
                  {/* EL TESTIGO DEL TABLERO: se HUNDE en cada compresión (el motor de arranque tira) */}
                  <div style={{
                    position: "absolute", left: "44%", top: "30%", width: 240, height: 240,
                    marginLeft: -120, marginTop: -120, borderRadius: "50%", mixBlendMode: "screen",
                    opacity: keyed(f, [A(KF.llave), A(KF.llave) + 10, A(KF.engancha) + 26, A(KF.engancha) + 44], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.push]),
                    background: `radial-gradient(50% 50% at 50% 50%, ${rgba(V.danger, 0.34 * (1 - beat * 0.72))} 0%, rgba(0,0,0,0) 70%)`,
                  }} />
                </Plane>
              </>
            )}

            {/* ═══ ACTO 5 · AMANECE FRÍO ════════════════════════════════════════════════ */}
            {inDawn && (
              <>
                <Plane z={-120}>
                  <MediaCard
                    src={IMG(M.amanecer)} kind="photo"
                    w={940} h={560} x={44} y={46} z={0} ry={5} rx={-2} radius={14}
                    label="AMANECIÓ, Y SEGUÍA CORTADA" lit={0.9} litColor={V.sky} sheenAt={A(KF.fD) + 18}
                    opacity={keyed(f, [A(KF.fD), A(KF.fD) + 14, A(KF.quieta) - 16, A(KF.quieta) + 8], [0.9, 1, 1, 0.34], [EZ.lin, EZ.lin, EZ.push])}
                  />
                </Plane>
                {/* EL PLANO FINAL: la llave colgando del contacto, quieta, con luz de ventana */}
                <Plane z={60}>
                  <MediaCard
                    src={IMG(M.llave)} kind="photo"
                    w={880} h={520} x={54} y={48} z={0} ry={3} rx={-1} radius={14}
                    label="LA LLAVE, EN EL CONTACTO" lit={0.86} litColor={V.sky} sheenAt={A(KF.quieta) + 10}
                    opacity={keyed(f, [A(KF.quieta) - 22, A(KF.quieta) + 4, D], [0, 1, 1], [EZ.push, EZ.lin])}
                  />
                </Plane>
              </>
            )}
          </AbsoluteFill>
        </AbsoluteFill>
      </Layers>

      {/* ══ EL AIRE DE LA NOCHE — .55 al entrar, .30 al salir (arco de partículas del video) ══ */}
      <WindField speed={wind} tint={light(dawn, "torch", "sky")} count={24} opacity={0.72} />

      {/* ══ FUENTE #6 · EL AMANECER FRÍO — releva a la linterna con 60 frames de solape ══════ */}
      <DawnWindow f={f} p={keyed(f, [A(KF.fD) - 10, A(KF.fD) + 10, A(KF.alba), D], [0, 0.5, 1, 1], [EZ.push, EZ.glide, EZ.lin])} />

      {/* ══ FUENTE #2 · EL HAZ DE LA LINTERNA — cruza los cuatro primeros actos ═════════════ */}
      <Torch f={f} ox={13} oy={106} tx={torchX} ty={torchY} power={torchPow} spread={torchSpread} />

      {/* ══ FRONTERA A · WIPE POR MATERIA: el propio haz barriendo + el polvo encendido ═════ */}
      <BeamSweep f={f} at={A(KF.fA)} dur={Math.round(D * 0.026)} />
      <SeamWipeMatter at={A(KF.fA) + 3} dur={Math.round(D * 0.024)} tint={V.torch} />

      {/* ══ FRONTERA B · el bloom de salida del ZOOM-THROUGH (refracción, no un fundido) ════ */}
      {f > A(KF.fB) + 18 && f < A(KF.fB) + 46 && (
        <AbsoluteFill style={{
          pointerEvents: "none", mixBlendMode: "screen",
          background: `radial-gradient(58% 48% at 62% 42%, ${rgba(V.volt, 0.26 * Math.sin(clamp01((f - A(KF.fB) - 18) / 28) * Math.PI))} 0%, rgba(0,0,0,0) 74%)`,
        }} />
      )}

      {/* ══ FRONTERA C · OCLUSIÓN: el plástico negro de la batería (⛔ NO el color del fondo) ═ */}
      <BatteryEdge f={f} at={A(KF.fC)} dur={Math.round(D * 0.013)} />

      {/* ══ FRONTERA D · MATCH-SHAPE: el MISMO círculo, aro del contacto → sol frío ═════════ */}
      <RingBridge
        f={f} x={62} y={45} size={ringSize} sun={ringSun} flare={ringFlare} spin={ringSpin}
        op={ringOp} px={paraX * 1.6} py={paraY * 1.6}
      />
      <SeamFlash at={A(KF.fD)} color={V.torch} dur={5} />

      {/* ══ EL LATIDO DEL ARRANQUE, DIBUJADO — vive en espacio de PANTALLA (con parallax) para
             que el encuadre cerrado del acto 4 no se lo coma. Safe area: 120 px del borde. ══ */}
      {traceOp > 0.01 && (
        <div style={{
          position: "absolute", left: 1180, top: 700,
          transform: `translate(${(paraX * 1.4).toFixed(1)}px, ${(paraY * 1.4).toFixed(1)}px)`,
        }}>
          <CrankTrace f={f} ats={CRANKS.map((c) => A(c))} catchAt={A(KF.engancha)} op={traceOp} w={620} />
        </div>
      )}

      {/* ══ TIPOGRAFÍA — 1 idea por acto, ≤7 palabras, cama oscura, safe area 60 px ═════════ */}
      {t1 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(34, 0, EZ.snap(t1)).toFixed(1)}px)`,
          opacity: t1,
        }}>
          <Bed pad={28} w={880}>
            <Kick color={V.amber}>LA LUZ SEGUÍA CORTADA</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>CINCO Y MEDIA DE LA <Em color={V.torch}>MAÑANA</Em></Head>
          </Bed>
        </div>
      )}
      {t2 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(t2)).toFixed(1)}px)`,
          opacity: t2,
        }}>
          <Bed pad={28} w={860}>
            <Kick color={V.torch}>TODA LA NOCHE ANDANDO</Kick>
            <div style={{ height: 12 }} />
            {f < A(KF.mitad)
              ? <Head size={80}>ONCE COMA OCHO <Em color={V.danger}>VOLTIOS</Em></Head>
              : <Head size={88}>POR DEBAJO DE LA <Em color={V.danger}>MITAD</Em></Head>}
            <div style={{ height: 10 }} />
            <Body size={30}>Una batería sana, en reposo, marca 12,6 o más.</Body>
          </Bed>
        </div>
      )}
      {t3 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(28, 0, EZ.snap(t3)).toFixed(1)}px)`,
          opacity: t3,
        }}>
          <Bed pad={28} w={840}>
            <Kick color={V.danger}>CUANDO EL TESTER MARCA 12</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>NUNCA BAJAR DE <Em color={V.volt}>DOCE VOLTIOS</Em></Head>
          </Bed>
        </div>
      )}
      {t4 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(t4)).toFixed(1)}px)`,
          opacity: t4,
        }}>
          <Bed pad={28} w={820}>
            <Kick color={V.torch}>GIRÉ LA LLAVE</Kick>
            <div style={{ height: 12 }} />
            <Head size={82}>EL ARRANQUE SALIÓ <Em color={V.danger}>FLOJO</Em></Head>
            <div style={{ height: 10 }} />
            <Body size={30}>Salió, pero lento. Una noche más fría y no arrancaba.</Body>
          </Bed>
        </div>
      )}
      {t5 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(26, 0, EZ.snap(t5)).toFixed(1)}px)`,
          opacity: t5,
        }}>
          <Bed pad={28} w={900}>
            <Kick color={V.sky}>LA PRÓXIMA VEZ, TAL VEZ NO</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>TE QUEDASTE SIN LAS <Em color={V.sky}>DOS COSAS</Em></Head>
          </Bed>
        </div>
      )}

      {/* ── viñeta VIVA: NUNCA cierra del todo. Crushear las esquinas = pantalla apagada. ──── */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(94% 78% at ${torchX.toFixed(1)}% ${(torchY * 0.6 + 20).toFixed(1)}%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.2 + 0.04 * Math.sin(f / 91) - dawn * 0.07).toFixed(3)}) 100%)`,
      }} />
      {/* aberración cromática sólo en los picos (⛔ nunca un blur full-screen) */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [A(KF.once) - 8, A(KF.once) + 12, A(KF.cae), A(KF.cae) + 34, A(KF.engancha), A(KF.engancha) + 30],
          [0, 0.12, 0.1, 0.05, 0.13, 0], [EZ.push, EZ.soft, EZ.push, EZ.soft, EZ.push]) + beat * 0.1,
        background: `linear-gradient(94deg, ${rgba(V.volt, 0.16)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(V.amber, 0.16)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
