// MovNoche.tsx — MOVIMIENTO 4 de `cmeduelo` · "LA NOCHE DEL APAGÓN" · ~48 s (D ≈ 1440 f @ 30 fps)
// Canal Claudio Mendoza Constructor (ES). ⛔ NO son cinco componentes pegados: es UN PLANO SECUENCIA.
//
// LA IDEA: es el tramo donde Claudio estaba EQUIVOCADO. El panel venía 12 a 0 y esa noche marcó
// 0,0 A — "de noche un panel solar es una tabla de plástico mojándose". La turbina de $49, arriba
// en el caño, giraba como una hélice: 2,1 A a 14 V = 29 W, y entre las 9:30 pm y las 4 am metió
// 187 Wh en la batería. Más que los once días anteriores juntos.
//
// ⛔⛔ LA COLUMNA VERTEBRAL ES LA LUZ. No hay luz ambiente: se cortó la cuadra entera y llueve.
// La ÚNICA fuente que barre la escena es EL HAZ DE LA LINTERNA (`<Torch/>`, color V.torch), que
// vive en espacio de PANTALLA — por eso el cuadro NUNCA se queda sin fuente, pase lo que pase con
// la cámara. Lo que el haz ilumina se ve; lo que no, queda en SILUETA contra un cielo de tormenta
// que jamás es negro puro (`PhotoPlane` de nubes + `NightGrade`, luma ~55-80 siempre).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
//  INVENTARIO DE LUZ — la garantía escrita de que ningún frame se lee como "pantalla apagada"
// ══════════════════════════════════════════════════════════════════════════════════════════════
//  fuente                              ventana (fracción de D)   siempre encendida?
//  1. cielo de tormenta (PhotoPlane +  0.00 → 0.796              SÍ (base luminosa del cuadro)
//     NightGrade, dim ≤0.60)
//  2. EL HAZ DE LA LINTERNA            0.00 → 0.930              SÍ (power nunca baja de 0.55)
//     (+ pool caliente donde aterriza)
//  3. LCD de la pinza (glow propio)    0.190 → 0.512
//  4. relámpagos (2)                   0.318 / 0.470             picos de 4-6 frames
//  5. pantallita de la ESTACIÓN        0.545 → 0.796 y 0.925 → 1
//  6. lámpara led + módem + teléfono   0.815 → 1.000             SÍ en todo el acto 5
//  7. contra ámbar de VoltAtmos        0.00 → 1.00               SÍ (intensity ≥ 0.62)
//  En los ÚNICOS 4 frames en que el haz se apaga (el pico del relámpago, KF.fB) el cuadro está en
//  su máximo de luz, no en su mínimo. No existe un solo frame con power<0.55 y sin pantalla.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
//  TABLA DE HANDOFF  (todo en FRACCIONES de `durationInFrames`: sobrevive al re-anclaje ±20%)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA DE MovAltura:  cam {z 240 · panY −260 · ry +8} · luz {ÁMBAR apagándose} · viento {.55}
//                        materia {la silueta de la turbina allá arriba, contra el cielo}
//
// ACTO 1 · 0.000 → 0.135 · "SALÍ CON LA LINTERNA"                    (protagonista: LA SILUETA)
//   enterFrom cam {z240, camY −260, ry +8, net 1.05, foco (900,300)} luz {ámbar→torch, int .70}
//             viento {.55 → 1.00} materia {silueta de la turbina, foto `817_turbinaNoche`}
//   material  {far: `820_nubesTormenta` · hero: foto `817_turbinaNoche` · depth: clip `807_cuadraApagada`}
//   exitTo    cam {z≈218, camY −150, net 1.18} luz {torch} viento {1.00} materia {el haz, barriendo}
//   ── FRONTERA A @0.128-0.152 ··· MATCH-MOVE ·············································
//      El haz NO se corta: sigue su vector bajando y hacia la derecha a velocidad constante y la
//      cámara truckea con él. La silueta sale ARRASTRADA por el barrido y el panel mojado entra
//      justo donde el haz aterriza. Cero fade, cero corte: el objeto que se mueve tapa el cambio.
//
// ACTO 2 · 0.135 → 0.328 · "CERO COMA CERO AMPERIOS"                 (protagonista: EL PANEL MUERTO)
//   enterFrom cam {z≈218, camY −150, net 1.18, foco (760,620)} luz {torch pleno} viento {1.00}
//   material  {hero: clip `804_lluviaCostado` (el panel chorreando) · depth: foto `806_relojNueveYMedia`}
//   0.190 nace el LCD de la pinza (2ª fuente de luz) · 0.205 salta el Readout 0,0 A (sky, apagado)
//   0.288 "una tabla de plástico mojándose": el haz SE VA del panel y lo deja en penumbra
//   exitTo    cam {z≈205, camY −185, net 1.42} luz {torch, el haz subiendo} materia {el haz en fuga}
//   ── FRONTERA B @0.318-0.330 ··· CORTE EN EL BEAT (relámpago) ····························
//      `SeamFlash` + la foto `818_relampagoEnCara` a sangre, 5 frames. El pico de luz TAPA el corte
//      y cuando vuelve la oscuridad la cámara ya está arriba y la turbina está girando. No es un
//      fade: es un pico de 5 frames sobre el beat exacto de la palabra "turbina".
//
// ACTO 3 · 0.328 → 0.522 · "GIRANDO COMO UNA HÉLICE"                 (protagonista: LA TURBINA)
//   enterFrom cam {z≈205, camY −200, ry ≈+3, net 1.20, foco (1120,330)} luz {torch} viento {1.00 · MÁXIMO}
//   material  {hero: clip `822_turbinaRindeTemporal` · depth: clip `816_vientoDeVerdad`}
//   0.396 → 2,1 A · 0.428 → 14 V · 0.456 → 29 W · 0.474 → EL MARCADOR SE DA VUELTA (0,0 vs 2,1)
//   exitTo    cam {z≈150, camY −90, net 1.05} luz {torch, bajando} materia {el AGUA que chorrea}
//   ── FRONTERA C @0.512-0.545 ··· WIPE POR MATERIA (el agua) ······························
//      Una sábana de lluvia lateral + `SeamWipeMatter` teñido `V.blade` (gotas blancas encendidas
//      por el haz) barren el cuadro; detrás ya bajamos al suelo y está la estación. El agua es la
//      materia natural de esta noche: no hay banda de color de fondo en ninguna parte.
//
// ACTO 4 · 0.522 → 0.804 · "LO ÚNICO QUE CARGABA"                    (protagonista: LA ESTACIÓN)
//   enterFrom cam {z≈150, camY −60, camX +45, net 1.00, foco (960,640)} luz {torch + pantallita}
//             viento {1.00 → .55} materia {la estación en el suelo mojado, pantallita encendida}
//   material  {bed: clip `804_lluviaCostado` (suelo chorreando) · depth: foto `822_turbinaRindeTemporal`
//              (el MISMO material del acto 3, otra escala y otra luz) · clip `821_lineaElectricaTormenta`
//              · íconos PNG bateria / reloj}
//   0.586 → la barra salta a 68 Wh · 0.674 → 131 Wh · 0.714 → 187 Wh (3 saltos, no uno)
//   ── COSTURA INTERNA @0.652 ··· OCLUSIÓN (`WetSlab`, canto de hormigón MOJADO #3A3B35 con
//      filo encendido por el haz) — el salto temporal de las horas. ⛔ NO es V.ink0: es la materia.
//   0.752 → "más que los once días anteriores juntos" (dos barras enfrentadas)
//   exitTo    cam {z≈95, camX +70, net 1.15} luz {torch → ámbar} materia {LA PANTALLITA, a cuadro}
//   ── FRONTERA D @0.796-0.834 ··· ZOOM-THROUGH ···········································
//      `zoomThrough` entra POR la pantallita de la estación (fx 50 / fy 58) y salimos del otro lado
//      adentro de la casa. El interior ya está montado debajo desde 0.808: no hay un frame vacío.
//
// ACTO 5 · 0.804 → 1.000 · "LA ENERGÍA DE UNA TORMENTA"              (protagonista: LA LÁMPARA LED)
//   enterFrom cam {z≈95, camX +75, net 1.30, foco (960,500)} luz {ÁMBAR} viento {.30}
//   material  {far: foto `819_claudioPensativo` · hero: clip `823_lamparaLedEncendida` ·
//              íconos PNG bombillanoche → enchufe → bateria, encendiéndose de a uno}
//   0.838 lámpara · 0.874 módem · 0.906 teléfono  (los tres consumos GASTAN la barra)
//   0.930 la cámara retrocede y vuelve a bajar a la ESTACIÓN sobre el suelo mojado: la pantallita
//         queda a cuadro, encendida, en ámbar tibio — que es EXACTAMENTE donde arranca MovMarcador.
//   exitTo ⟶ cam {z 60 · camX +90 · camY 0 · ry 0} · luz {torch→ÁMBAR} · viento {.30}
//            materia {la estación de energía y su pantallita encendida sobre el suelo mojado}
//
// ⛔ cero Math.random / Date.now · cero backdrop-filter · cero blur grande full-screen · cero fade.
// ⛔ Easing.quint no existe → Easing.poly(5).
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba,
  gcam, light, VoltAtmos, WindField, Layers, Plane,
  MediaCard, PhotoPlane, IconPng, Readout,
  SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

export const MOVNOCHE_FRAMES = 1440;

/* ── EASINGS — nunca uno solo para todo ────────────────────────────────────────────────────── */
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

/* ── ANCLAS: TODO en FRACCIONES de `durationInFrames` (sobrevive al re-anclaje del Whisper) ─── */
const KF = {
  hook: 0.015,
  fA: 0.128,        // FRONTERA A · match-move (el barrido del haz)
  panel: 0.152,
  lcd: 0.190,
  zero: 0.205,
  nada: 0.248,
  tabla: 0.288,
  fB: 0.320,        // FRONTERA B · corte en el beat (relámpago)
  turbina: 0.336,
  amps: 0.396,
  volts: 0.428,
  watts: 0.456,
  rayo2: 0.470,
  marcador: 0.478,
  fC: 0.512,        // FRONTERA C · wipe por materia (el agua)
  estacion: 0.548,
  bar1: 0.586,
  fC2: 0.652,       // costura interna · OCLUSIÓN (canto de hormigón mojado) = salto de horas
  bar2: 0.674,
  bar3: 0.714,
  once: 0.752,
  fD: 0.796,        // FRONTERA D · zoom-through (la pantallita de la estación)
  lampara: 0.838,
  modem: 0.874,
  telefono: 0.906,
  vuelta: 0.930,
};
const ACT = { a1: 0.0, a2: 0.135, a3: 0.328, a4: 0.522, a5: 0.804 };

/* ── RUTAS DEL MATERIAL — ⛔ SOLO nombres de `_v3/material_MovNoche.txt` ────────────────────── */
const IMG = (s: string) => `img/cmeduelo/${s}.jpg`;
const VIDEO = (s: string) => `broll/cmeduelo/${s}.mp4`;
const IC = (s: string) => `img/cmeduelo/cmed_ic_${s}.png`;
const M = {
  nubes: "cmed_o_820_nubesTormenta",
  turbinaNoche: "cmed_o_817_turbinaNoche",
  cuadra: "cmed_o_807_cuadraApagada",
  lluvia: "cmed_o_804_lluviaCostado",
  reloj: "cmed_o_806_relojNueveYMedia",
  relampago: "cmed_h_818_relampagoEnCara",
  turbinaRinde: "cmed_o_822_turbinaRindeTemporal",
  vientoReal: "cmed_o_816_vientoDeVerdad",
  linea: "cmed_o_821_lineaElectricaTormenta",
  lampara: "cmed_h_823_lamparaLedEncendida",
  claudio: "cmed_h_819_claudioPensativo",
};

/* ⛔ el hormigón MOJADO de noche. NO es V.ink0 (#0A0B08 = el fondo → haría un pozo negro) ni el
   V.concrete seco (#7E7D74 → sobre una escena a luma ~45 haría un flash blanco). Es la losa real
   del patio bajo la lluvia: apenas por encima de la escena, con el filo encendido por la linterna. */
const WET = "#3A3B35";

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL HAZ DE LA LINTERNA — la única fuente de luz, y el objeto que cruza TODAS las fronteras.
   Vive en espacio de PANTALLA (no dentro de la cámara): por eso ningún encuadre puede dejar el
   cuadro sin fuente. `power` nunca baja de 0.55 salvo en el pico del relámpago (donde sobra luz).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Torch: React.FC<{
  f: number; ox: number; oy: number; tx: number; ty: number;
  power: number; spread?: number; color?: string;
}> = ({ f, ox, oy, tx, ty, power, spread = 300, color = V.torch }) => {
  if (power <= 0.02) return null;
  // temblor de mano: el haz nunca está perfectamente quieto (hold VIVO)
  const jx = Math.sin(f / 13) * 1.1 + Math.sin(f / 31) * 0.6;
  const jy = Math.cos(f / 17) * 0.9 + Math.sin(f / 43) * 0.5;
  const OX = (ox / 100) * 1920, OY = (oy / 100) * 1080;
  const TX = ((tx + jx * 0.16) / 100) * 1920, TY = ((ty + jy * 0.16) / 100) * 1080;
  const dx = TX - OX, dy = TY - OY;
  const len = Math.max(220, Math.sqrt(dx * dx + dy * dy));
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI + jx * 0.28;
  const flick = 0.94 + Math.sin(f / 7.3) * 0.035 + Math.sin(f / 2.9) * 0.022; // led barato con pilas
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
          `linear-gradient(90deg, ${rgba(color, 0.34 * p)} 0%, ${rgba(color, 0.2 * p)} 26%, ` +
          `${rgba(color, 0.1 * p)} 58%, ${rgba(color, 0.035 * p)} 82%, rgba(0,0,0,0) 100%)`,
        mixBlendMode: "screen",
      }} />
      {/* el CHARCO de luz donde aterriza: lo que cae acá SE VE, el resto queda en silueta */}
      <div style={{
        position: "absolute", left: `${tx + jx * 0.16}%`, top: `${ty + jy * 0.16}%`,
        width: wide * 2.5, height: wide * 1.85, marginLeft: -wide * 1.25, marginTop: -wide * 0.925,
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(color, 0.4 * p)} 0%, ${rgba(color, 0.17 * p)} 38%, rgba(0,0,0,0) 72%)`,
        mixBlendMode: "screen",
      }} />
      {/* núcleo caliente: el punto duro del reflector */}
      <div style={{
        position: "absolute", left: `${tx + jx * 0.16}%`, top: `${ty + jy * 0.16}%`,
        width: wide * 0.62, height: wide * 0.48, marginLeft: -wide * 0.31, marginTop: -wide * 0.24,
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(V.white, 0.3 * p)} 0%, rgba(0,0,0,0) 68%)`,
        mixBlendMode: "screen",
      }} />
      {/* la lluvia ENCENDIDA dentro del cono (lo que hace que un haz se lea como haz) */}
      <div style={{
        position: "absolute", left: `${ox}%`, top: `${oy}%`,
        width: len * 1.14, height: wide, marginTop: -wide / 2,
        transformOrigin: "0% 50%", transform: `rotate(${ang.toFixed(3)}deg)`,
        clipPath: "polygon(0% 45.5%, 100% 0%, 100% 100%, 0% 54.5%)",
        opacity: 0.5 * p, mixBlendMode: "screen", overflow: "hidden",
      }}>
        {Array.from({ length: 16 }, (_, i) => {
          const a = rnd(i * 3.77), b = rnd(i * 8.13);
          const yy = ((b * 130 + f * (2.4 + a * 3.1)) % 130) - 15;
          return (
            <div key={i} style={{
              position: "absolute", left: `${(a * 96 + 2).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
              width: 1.6, height: 26 + b * 34,
              background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(color, 0.5)}, rgba(0,0,0,0))`,
              transform: "rotate(16deg)",
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LA LLUVIA — el temporal. Estrías más densas e inclinadas que el `WindField` del Stage, que
   sigue corriendo debajo (el viento llega a su MÁXIMO del video: speed 1.00).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const RainField: React.FC<{ f: number; density: number; tilt?: number; tint?: string }> = ({
  f, density, tilt = 21, tint = V.sky,
}) => {
  const d = clamp01(density);
  if (d <= 0.02) return null;
  const n = Math.round(30 + d * 74);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.28 + 0.52 * d, overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i * 2.91), b = rnd(i * 6.17), c = rnd(i * 11.3);
        const sp = (5.2 + a * 6.4) * (0.4 + d * 1.5);
        const yy = ((b * 150 + f * sp) % 150) - 26;
        const xx = (a * 128 - 16 + f * sp * 0.11) % 128 - 8;
        const h = 46 + c * 128 * (0.5 + d);
        return (
          <div key={i} style={{
            position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
            width: 1.4 + c * 0.9, height: h,
            background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(tint, 0.1 + c * 0.24)} 42%, rgba(0,0,0,0))`,
            transform: `rotate(${tilt}deg)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA C · WIPE POR MATERIA — la sábana de agua que cruza el cuadro.
   Detrás de ella ya bajamos al suelo. ⛔ no hay ninguna banda del color del fondo.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const WaterSheet: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const env = Math.sin(p * Math.PI);
  const x = lerp(-40, 140, EZ.push(p));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      <div style={{
        position: "absolute", top: "-30%", left: `${x.toFixed(1)}%`,
        width: "62%", height: "170%", transform: "rotate(14deg)",
        background:
          `linear-gradient(96deg, rgba(0,0,0,0) 0%, ${rgba(V.blade, 0.1 * env)} 22%, ` +
          `${rgba(V.torch, 0.24 * env)} 50%, ${rgba(V.blade, 0.1 * env)} 76%, rgba(0,0,0,0) 100%)`,
      }} />
      {Array.from({ length: 34 }, (_, i) => {
        const a = rnd(i * 4.4), b = rnd(i * 9.6);
        const lx = x - 12 + a * 66;
        return (
          <div key={i} style={{
            position: "absolute", left: `${lx.toFixed(2)}%`, top: `${(b * 116 - 8).toFixed(2)}%`,
            width: 2.4 + b * 2.6, height: 40 + a * 130,
            background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.torch, (0.24 + b * 0.4) * env)}, rgba(0,0,0,0))`,
            transform: "rotate(15deg)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   COSTURA INTERNA DEL ACTO 4 · OCLUSIÓN — el canto de la losa de hormigón MOJADO cruza el cuadro
   y adentro de la banda saltan las horas. El filo lleva el reflejo de la linterna sobre el agua:
   por eso se lee como un OBJETO que pasa, no como un fundido.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const WetSlab: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const x = lerp(-172, 172, EZ.push(p));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-58%", left: `${x.toFixed(1)}%`,
        width: "320%", height: "216%", transform: "rotate(-6deg)",
        background:
          `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.torch, 0.5)} 3%, ${WET} 8%, ` +
          `${WET} 88%, ${rgba(V.torch, 0.22)} 97%, rgba(0,0,0,0) 100%)`,
      }}>
        {/* especular del agua sobre el hormigón: el filo mojado devuelve el haz */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            `linear-gradient(178deg, ${rgba(V.torch, 0.16)} 0%, rgba(0,0,0,0) 22%, ` +
            `rgba(0,0,0,0) 74%, ${rgba(V.ink0, 0.42)} 100%)`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL RELÁMPAGO — corte en el beat. 5 frames: la foto real a sangre + el pico blanco-azulado.
   No es un fade: sube y baja en menos de un sexto de segundo.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Lightning: React.FC<{ f: number; at: number; dur?: number; strength?: number }> = ({
  f, at, dur = 5, strength = 1,
}) => {
  const p = clamp01(1 - Math.abs(f - at) / dur);
  if (p <= 0) return null;
  const stutter = f === at + 1 ? 0.42 : 1;   // el doble golpe del rayo
  const a = p * p * strength * stutter;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.78 * a }}>
        <PhotoPlane src={IMG(M.relampago)} z={0} scale={1.24} dim={0.1} tint={V.sky} />
      </AbsoluteFill>
      <AbsoluteFill style={{
        background: `radial-gradient(120% 96% at 62% 8%, ${rgba(V.white, 0.5 * a)} 0%, ${rgba(V.sky, 0.24 * a)} 46%, rgba(0,0,0,0) 78%)`,
        mixBlendMode: "screen",
      }} />
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
      <MediaCard src={VIDEO(slug)} kind="video" sheenAt={i === 0 ? 14 : 5} {...geo} />
    </Sequence>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LA PANTALLITA DE LA ESTACIÓN — la 5ª fuente de luz y LA MATERIA QUE SALE hacia MovMarcador.
   El bisel y el LCD son LUZ (no un objeto dibujado haciendo de foto): la estación real vive en la
   tarjeta de material que va debajo. Los números los escribe el kit, ningún motor de imagen.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const StationScreen: React.FC<{
  f: number; x: number; y: number; w: number; wh: number; hourT: number; warm: number; op: number;
}> = ({ f, x, y, w, wh, hourT, warm, op }) => {
  if (op <= 0.01) return null;
  const h = Math.round(w * 0.58);
  const glowC = warm > 0.5 ? V.amber : V.volt;
  const pct = clamp01(wh / 187);
  const pulse = 0.86 + Math.sin(f / 11) * 0.14;
  const led = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, opacity: op,
      transform: `translateY(${(Math.sin(f / 57) * 2).toFixed(2)}px)`,
    }}>
      {/* el resplandor que la pantallita tira sobre el suelo mojado (fuente de luz de la escena) */}
      <div style={{
        position: "absolute", left: "50%", top: "56%",
        width: w * 3.2, height: h * 3.2, marginLeft: -w * 1.6, marginTop: -h * 1.6,
        background: `radial-gradient(50% 50% at 50% 50%, ${rgba(glowC, 0.26 * pulse)} 0%, ${rgba(glowC, 0.09)} 38%, rgba(0,0,0,0) 72%)`,
        mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* el frente del aparato: gris oscuro, NO el color del fondo */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 14,
        background: "linear-gradient(168deg, #34362E 0%, #23251F 62%, #191A15 100%)",
        boxShadow: `0 ${Math.round(h * 0.2)}px ${Math.round(h * 0.3)}px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.white, 0.16)}`,
      }} />
      {/* el LCD */}
      <div style={{
        position: "absolute", left: "6%", top: "12%", width: "88%", height: "76%", borderRadius: 8,
        background: `linear-gradient(178deg, ${rgba(glowC, 0.24)} 0%, ${rgba(glowC, 0.1)} 46%, rgba(6,8,5,0.9) 100%)`,
        boxShadow: `inset 0 0 ${Math.round(h * 0.3)}px ${rgba(glowC, 0.34 * pulse)}, inset 0 1px 0 ${rgba(V.white, 0.2)}`,
        overflow: "hidden",
      }}>
        {/* la BARRA DE CARGA (helper dibujado: un gráfico SÍ puede ser vectorial) */}
        <div style={{ position: "absolute", left: "7%", right: "7%", top: "56%", height: Math.round(h * 0.13) }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 999,
            background: rgba(V.ink0, 0.62), boxShadow: `inset 0 1px 3px ${rgba(V.ink0, 0.9)}`,
          }} />
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: `${(pct * 100).toFixed(2)}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${rgba(glowC, 0.72)} 0%, ${glowC} 100%)`,
            boxShadow: `0 0 ${Math.round(h * 0.2)}px ${rgba(glowC, 0.7)}`,
          }} />
          {[0.36, 0.7].map((t) => (
            <div key={t} style={{
              position: "absolute", left: `${t * 100}%`, top: -3, bottom: -3, width: 2,
              background: rgba(V.white, 0.22),
            }} />
          ))}
        </div>
        {/* la cifra: LA ESCRIBE EL KIT */}
        <div style={{
          position: "absolute", left: "7%", top: "10%",
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(h * 0.34), lineHeight: 1,
          color: glowC, textShadow: `0 0 ${Math.round(h * 0.3)}px ${rgba(glowC, 0.7)}`,
        }}>
          {Math.round(wh)}
          <span style={{ fontSize: Math.round(h * 0.15), marginLeft: 6, color: rgba(glowC, 0.8) }}>Wh</span>
        </div>
        {/* el reloj de la noche: 9:30 pm → 4:00 am */}
        <div style={{
          position: "absolute", right: "7%", top: "14%", textAlign: "right",
          fontFamily: F_BODY, fontWeight: 700, fontSize: Math.round(h * 0.12),
          letterSpacing: 1.6, color: rgba(V.white, 0.74),
        }}>
          {hourT < 0.5 ? "9:30 PM" : hourT < 0.86 ? "1:10 AM" : "4:00 AM"}
        </div>
        {/* barrido del refresco del LCD (hold VIVO) */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "26%",
          top: `${(((f * 0.9) % 140) - 20).toFixed(1)}%`,
          background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.white, 0.05)}, rgba(0,0,0,0))`,
        }} />
      </div>
      {/* el led de carga parpadeando */}
      <div style={{
        position: "absolute", right: "7%", bottom: "6%", width: 10, height: 10, borderRadius: "50%",
        background: rgba(V.amber, 0.5 + 0.5 * led),
        boxShadow: `0 0 ${10 + led * 14}px ${rgba(V.amber, 0.6 + 0.4 * led)}`,
      }} />
    </div>
  );
};

/* ── EL RELOJ DE LA NOCHE dibujado bajo la estación (eje = 6,5 h de tormenta) ───────────────── */
const NightClock: React.FC<{ f: number; t: number; op: number }> = ({ f, t, op }) => {
  if (op <= 0.01) return null;
  const p = clamp01(t);
  return (
    <div style={{ position: "absolute", left: "22%", right: "22%", top: "76%", opacity: op }}>
      <div style={{ position: "relative", height: 3, background: rgba(V.white, 0.16), borderRadius: 999 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: `${(p * 100).toFixed(2)}%`,
          background: `linear-gradient(90deg, ${rgba(V.torch, 0.4)}, ${rgba(V.volt, 0.9)})`, borderRadius: 999,
        }} />
        <div style={{
          position: "absolute", left: `${(p * 100).toFixed(2)}%`, top: "50%",
          width: 13, height: 13, marginLeft: -6.5, marginTop: -6.5, borderRadius: "50%",
          background: V.volt, boxShadow: `0 0 ${14 + Math.sin(f / 10) * 6}px ${rgba(V.volt, 0.85)}`,
        }} />
        {[0, 1].map((i) => (
          <div key={i} style={{
            position: "absolute", left: i === 0 ? 0 : "100%", top: 16,
            transform: i === 0 ? "none" : "translateX(-100%)",
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2.6,
            color: rgba(V.white, 0.6), whiteSpace: "nowrap",
            textShadow: "0 3px 14px rgba(0,0,0,0.9)",
          }}>{i === 0 ? "9:30 PM" : "4:00 AM"}</div>
        ))}
      </div>
    </div>
  );
};

/* ── s156 · "MÁS QUE LOS ONCE DÍAS ANTERIORES JUNTOS" (dos barras, sin inventar cifras) ─────── */
const ElevenVsOne: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.01) return null;
  const wA = lerp(0, 22, EZ.snap(clamp01(p * 1.5)));
  const wB = lerp(0, 100, EZ.push(clamp01(p * 1.5 - 0.3)));
  const Row = (lbl: string, w: number, c: string, glow: boolean) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 23, letterSpacing: 2.6,
        color: rgba(V.white, 0.72), marginBottom: 7, textTransform: "uppercase",
      }}>{lbl}</div>
      <div style={{ position: "relative", height: 22, background: rgba(V.ink0, 0.7), borderRadius: 999 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: `${w.toFixed(1)}%`, borderRadius: 999,
          background: `linear-gradient(90deg, ${rgba(c, 0.6)}, ${c})`,
          boxShadow: glow ? `0 0 ${20 + Math.sin(f / 13) * 8}px ${rgba(c, 0.6)}` : "none",
        }} />
      </div>
    </div>
  );
  return (
    <div style={{ width: 560, opacity: clamp01(p * 2) }}>
      {Row("Once días de sol", wA, V.sky, false)}
      {Row("Una noche de tormenta", wB, V.volt, true)}
    </div>
  );
};

/* ── EL MARCADOR QUE SE DA VUELTA — el panel iba 12 a 0 y esta noche marca 0,0 A ────────────── */
const Scoreboard: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.01) return null;
  const slide = lerp(46, 0, EZ.snap(clamp01(p)));
  const Side = (kick: string, val: string, unit: string, c: string, hot: boolean, dir: number) => (
    <div style={{
      flex: 1, textAlign: "center",
      transform: `translateX(${(slide * dir).toFixed(1)}px)`,
      opacity: clamp01(p * 1.6),
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3.2,
        color: rgba(V.white, hot ? 0.82 : 0.5), textTransform: "uppercase", marginBottom: 8,
      }}>{kick}</div>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: hot ? 122 : 100, lineHeight: 0.9, color: c,
        textShadow: hot
          ? `0 0 ${44 + Math.sin(f / 12) * 10}px ${rgba(c, 0.55)}, 0 6px 26px rgba(0,0,0,0.92)`
          : "0 6px 26px rgba(0,0,0,0.92)",
        opacity: hot ? 1 : 0.66,
      }}>
        {val}<span style={{ fontSize: hot ? 42 : 34, marginLeft: 8, color: rgba(c, 0.82) }}>{unit}</span>
      </div>
    </div>
  );
  return (
    <Bed pad={30} w={860}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        {Side("El panel · 12 a 0", "0,0", "A", V.sky, false, -1)}
        <div style={{
          width: 2, height: 118, background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.white, 0.26)}, rgba(0,0,0,0))`,
        }} />
        {Side("La turbina de $49", "2,1", "A", V.volt, true, 1)}
      </div>
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <Kick color={V.amber}>ESTA NOCHE EL MARCADOR SE DA VUELTA</Kick>
      </div>
    </Bed>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovNoche: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const f = useCurrentFrame();
  const A = (x: number) => Math.round(D * x);

  /* ── LA CÁMARA — UNA sola, función del frame GLOBAL. ⛔ ningún acto la reinicia en 0. ─────
     Es un DESCENSO: entra donde la dejó MovAltura (arriba, mirando la turbina en silueta) y baja
     por el caño hasta el suelo mojado. `gcam` viaja z 240 → 60 con un reloj DEFORMADO pero
     MONÓTONO; el paneo del handoff (camY −260 → 0, camX 0 → +90) va por fuera de la escala del
     mundo para que el frame 0 calce EXACTO con el último frame de MovAltura.               */
  const clk = keyed(f,
    [0, A(KF.fA), A(KF.panel), A(KF.nada), A(KF.fB), A(KF.turbina), A(KF.watts), A(KF.fC), A(KF.estacion), A(KF.bar3), A(KF.fD), A(KF.lampara), D],
    [0, A(0.10), A(0.17), A(0.26), A(0.33), A(0.36), A(0.46), A(0.53), A(0.58), A(0.72), A(0.80), A(0.86), D],
    [EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.snap, EZ.glide, EZ.lin, EZ.push, EZ.glide, EZ.lin, EZ.soft, EZ.glide]);
  const g = gcam(clk, { z0: 240, z1: 60, dur: D, rx: 1.6 });
  const mag = 1500 / (1500 - g.z);

  // el paneo del HANDOFF (fuera de la escala del mundo: son los mismos px que usó MovAltura)
  const camY = keyed(f, [0, A(0.14), A(0.34), A(0.55), A(0.80), D], [-260, -140, -200, -60, -20, 0],
    [EZ.glide, EZ.soft, EZ.push, EZ.glide, EZ.soft]);
  const camX = keyed(f, [0, A(0.34), A(0.55), A(0.80), D], [0, 20, 45, 70, 90], [EZ.soft, EZ.glide, EZ.soft, EZ.glide]);
  const ryK = keyed(f, [0, A(0.33), A(0.60), D], [8, 4, -3, 0], [EZ.soft, EZ.glide, EZ.soft]);

  // el ENCUADRE dentro del mundo (qué punto queda al centro, y a qué aumento neto)
  const net = keyed(f,
    [0, A(KF.fA), A(KF.panel), A(KF.zero), A(KF.tabla), A(KF.turbina), A(KF.marcador), A(KF.fC), A(KF.estacion), A(KF.bar3), A(KF.fD), A(KF.lampara), A(KF.vuelta), D],
    [1.05, 1.18, 1.3, 1.62, 1.42, 1.2, 1.34, 1.05, 1.0, 1.12, 1.15, 1.3, 1.12, 1.02],
    [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.lin, EZ.soft, EZ.push, EZ.glide, EZ.soft]);
  const fx = keyed(f,
    [0, A(KF.fA), A(KF.panel), A(KF.zero), A(KF.fB), A(KF.turbina), A(KF.marcador), A(KF.fC), A(KF.estacion), A(KF.fD), A(KF.lampara), D],
    [900, 880, 760, 700, 900, 1120, 960, 1000, 960, 960, 960, 960],
    [EZ.lin, EZ.push, EZ.soft, EZ.glide, EZ.snap, EZ.glide, EZ.soft, EZ.glide, EZ.lin, EZ.soft, EZ.lin]);
  const fy = keyed(f,
    [0, A(KF.fA), A(KF.panel), A(KF.zero), A(KF.fB), A(KF.turbina), A(KF.marcador), A(KF.fC), A(KF.estacion), A(KF.fD), A(KF.lampara), D],
    [300, 430, 620, 560, 380, 330, 520, 600, 640, 600, 500, 520],
    [EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.glide, EZ.push, EZ.soft, EZ.lin, EZ.soft, EZ.lin]);
  const ws = net / mag;
  const panX = 960 - fx, panY = 540 - fy;

  /* ── LA LUZ — ÁMBAR apagándose → TORCH (única fuente) → ÁMBAR tibio de adentro de la casa.
        Un solo viaje: la luz EVOLUCIONA, no salta.                                           */
  const stage = keyed(f, [0, A(0.13), A(0.70), A(KF.fD), A(KF.lampara), D], [0, 1, 1, 1.42, 1.85, 2],
    [EZ.glide, EZ.lin, EZ.push, EZ.soft, EZ.glide]);
  const tint = stage <= 1 ? light(stage, "amber", "torch") : light(stage - 1, "torch", "amber");
  const warm = clamp01(stage - 1);
  // la key de la atmósfera SIGUE al haz de la linterna (0 = izquierda, 1 = derecha)
  const torchX = keyed(f,
    [0, A(KF.fA), A(KF.panel), A(KF.zero), A(KF.tabla), A(KF.fB), A(KF.turbina), A(KF.amps), A(KF.fC), A(KF.estacion), A(KF.bar2), A(KF.fD), A(KF.lampara), A(KF.vuelta), D],
    [64, 41, 33, 31, 44, 62, 70, 66, 55, 50, 52, 50, 44, 50, 50],
    [EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.snap, EZ.glide, EZ.push, EZ.soft, EZ.lin, EZ.soft, EZ.glide, EZ.soft, EZ.lin]);
  const torchY = keyed(f,
    [0, A(KF.fA), A(KF.panel), A(KF.zero), A(KF.tabla), A(KF.fB), A(KF.turbina), A(KF.amps), A(KF.fC), A(KF.estacion), A(KF.bar2), A(KF.fD), D],
    [26, 46, 58, 61, 44, 22, 20, 44, 62, 66, 64, 60, 56],
    [EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.snap, EZ.glide, EZ.push, EZ.soft, EZ.lin, EZ.soft, EZ.glide]);
  // ⛔ `power` nunca baja de 0.55 salvo en el pico del relámpago (donde el cuadro está a plena luz)
  const torchPow = keyed(f,
    [0, A(0.02), A(KF.tabla), A(KF.fB) - 3, A(KF.fB) + 3, A(KF.turbina), A(KF.estacion), A(KF.fD), A(KF.fD) + 26, A(KF.vuelta), D],
    [0.72, 1, 0.78, 1, 0.34, 1, 0.86, 0.8, 0.2, 0.0, 0.0],
    [EZ.push, EZ.soft, EZ.push, EZ.snap, EZ.push, EZ.soft, EZ.lin, EZ.push, EZ.soft, EZ.lin]);
  const torchSpread = keyed(f, [0, A(KF.zero), A(KF.turbina), A(KF.estacion), D], [330, 190, 300, 400, 420],
    [EZ.soft, EZ.push, EZ.glide, EZ.soft]);
  const atmoInt = keyed(f, [0, A(0.13), A(KF.fB), A(KF.fC), A(KF.fD), A(KF.lampara), D],
    [0.78, 0.66, 0.7, 0.72, 0.78, 0.95, 0.9], EZ.soft);

  /* ── EL VIENTO — llega a su MÁXIMO del video (1.00): es el temporal. Entra en .55 (MovAltura). */
  const wind = keyed(f, [0, A(0.11), A(KF.fB), A(KF.marcador), A(KF.fC2), A(KF.fD), A(KF.lampara), D],
    [0.55, 1.0, 1.0, 1.0, 0.86, 0.62, 0.34, 0.3],
    [EZ.push, EZ.lin, EZ.lin, EZ.soft, EZ.glide, EZ.push, EZ.soft]);
  const rain = keyed(f, [0, A(0.11), A(KF.fC2), A(KF.fD), A(KF.fD) + 30, D],
    [0.5, 1.0, 0.86, 0.6, 0.16, 0.12], [EZ.push, EZ.lin, EZ.soft, EZ.push, EZ.soft]);

  /* ── LA BARRA DE CARGA — 3 saltos, no uno. 0 → 68 → 131 → 187 Wh, 9:30 pm → 4:00 am ─────── */
  const wh = keyed(f,
    [A(KF.estacion), A(KF.bar1), A(KF.bar1) + 20, A(KF.bar2), A(KF.bar2) + 22, A(KF.bar3), A(KF.bar3) + 24, D],
    [0, 0, 68, 68, 131, 131, 187, 187],
    [EZ.lin, EZ.snap, EZ.lin, EZ.snap, EZ.lin, EZ.push, EZ.lin]);
  const hourT = keyed(f, [A(KF.estacion), A(KF.bar1) + 20, A(KF.bar2) + 22, A(KF.bar3) + 24], [0, 0.3, 0.66, 1],
    [EZ.soft, EZ.glide, EZ.soft]);

  /* ── VENTANAS DE MONTAJE (cada acto se apaga sólo cuando su costura ya lo tapó) ──────────── */
  const outdoor = f < A(KF.fD) + Math.round(D * 0.045);
  const inHouse = f >= A(KF.fD) + Math.round(D * 0.012);
  const zt = zoomThrough(f, A(KF.fD), Math.round(D * 0.038), 50, 58);

  /* ── el fondo de MATERIAL REAL: sólo cambia DENTRO de una costura que lo tapa ────────────── */
  const farSrc = f < A(KF.fC) + 8 ? IMG(M.nubes) : f < A(KF.fD) + 14 ? IMG(M.cuadra) : IMG(M.claudio);
  const farDim = f < A(KF.fC) + 8 ? 0.56 : f < A(KF.fD) + 14 ? 0.6 : 0.62;
  const farScale = keyed(f, [0, A(KF.fC), A(KF.fD), D], [2.6, 2.3, 2.1, 1.9], EZ.soft);

  /* ── TEXTO: 1 idea por acto, ≤7 palabras, cama oscura obligatoria, safe area 60 px ──────── */
  const paraX = -panX * 0.014, paraY = -panY * 0.011;
  const tIn = (at: number, out: number, ramp = 14) =>
    clamp01((f - A(at)) / ramp) * (1 - clamp01((f - A(out)) / 16));
  const t1 = tIn(KF.hook, 0.116);
  const t2 = tIn(0.166, 0.306);
  const t3 = tIn(0.348, 0.462);
  const t4 = tIn(0.556, 0.736);
  const t5 = tIn(0.846, 0.996, 16);
  const scoreP = clamp01((f - A(KF.marcador)) / 18) * (1 - clamp01((f - A(KF.fC) + 10) / 14));
  const elevenP = clamp01((f - A(KF.once)) / 20) * (1 - clamp01((f - A(0.786)) / 14));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA — montada UNA vez para los D frames. ⛔ no se remonta entre actos. ── */}
      <VoltAtmos tint={tint} tint2={V.amber} keyFrom={clamp01(torchX / 100)} intensity={atmoInt} floor={0.6} />

      {/* ══ EL MUNDO, bajo UNA sola cámara ══════════════════════════════════════════════════ */}
      <Layers cam={g.transform}>
        <AbsoluteFill style={{
          transform: `translate3d(${camX.toFixed(2)}px, ${camY.toFixed(2)}px, 0) rotateY(${ryK.toFixed(3)}deg)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ── FUENTE DE LUZ #1: el cielo de tormenta. NUNCA negro puro. ── */}
          <PhotoPlane src={farSrc} kind="photo" z={-540} scale={farScale} dim={farDim} tint={warm > 0.5 ? V.amber : V.sky} />
          {/* grade de noche: azula el cielo sin apagarlo (⛔ nada de blur full-screen) */}
          <Plane z={-520}>
            <AbsoluteFill style={{
              background:
                `linear-gradient(182deg, ${rgba("#14202B", 0.34 * (1 - warm * 0.7))} 0%, ` +
                `${rgba("#0C1219", 0.5 * (1 - warm * 0.6))} 58%, ${rgba(V.ink0, 0.72)} 100%)`,
            }} />
            <AbsoluteFill style={{
              background: `radial-gradient(78% 40% at 50% 96%, ${rgba(V.amber, 0.07 + 0.1 * warm)} 0%, rgba(0,0,0,0) 70%)`,
            }} />
          </Plane>

          {/* ── EL MUNDO ESCALADO (encuadre) ── */}
          <AbsoluteFill style={{
            transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
            transformStyle: "preserve-3d",
          }}>
            {/* ══════ ACTOS 1-4 · EL PATIO. Se van por el ZOOM-THROUGH de la frontera D. ══════ */}
            {outdoor && (
              <AbsoluteFill style={{
                transform: zt.out === "none" ? undefined : zt.out,
                opacity: zt.opacity, transformStyle: "preserve-3d",
              }}>
                {/* ── ACTO 1 · LA SILUETA que viene de MovAltura ───────────────────────────── */}
                {f < A(0.2) && (
                  <Plane z={-140}>
                    <MediaCard
                      src={IMG(M.turbinaNoche)} kind="photo"
                      w={760} h={470} x={52} y={26} z={0} ry={-7} rx={2} radius={12}
                      label="ARRIBA, EN EL CAÑO"
                      lit={keyed(f, [0, A(0.06), A(0.13), A(0.2)], [0.28, 0.5, 0.34, 0.2], EZ.soft)}
                      litColor={V.torch} sheenAt={10}
                      opacity={keyed(f, [0, A(0.02), A(0.14), A(0.2)], [0.9, 1, 1, 0], [EZ.lin, EZ.lin, EZ.push])}
                    />
                  </Plane>
                )}
                {f < A(0.176) && (
                  <Plane z={-330}>
                    <LiveCard f={f} slug={M.cuadra} mount={A(0.03)} out={A(0.176)} geo={{
                      w: 400, h: 250, x: 19, y: 62, z: 0, ry: 14, radius: 10,
                      label: "TODA LA CUADRA", lit: 0.4, litColor: V.sky,
                      opacity: keyed(f, [A(0.03), A(0.055), A(0.15), A(0.176)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.push]),
                    }} />
                  </Plane>
                )}

                {/* ── ACTO 2 · EL PANEL MOJADO que no entrega nada ─────────────────────────── */}
                {f >= A(0.128) && f < A(0.342) && (
                  <>
                    <Plane z={60}>
                      <LiveCard f={f} slug={M.lluvia} mount={A(0.128)} out={A(0.342)} geo={{
                        w: 780, h: 470, x: 42, y: 52, z: 0, ry: 8, rx: -2, radius: 13,
                        label: "EL PANEL, MOJADO", litColor: V.torch,
                        lit: keyed(f, [A(0.13), A(KF.zero), A(KF.tabla), A(0.318)], [0.5, 1, 0.34, 0.24], EZ.soft),
                        opacity: keyed(f, [A(0.128), A(0.152), A(0.318), A(0.342)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.push]),
                      }} />
                    </Plane>
                    <Plane z={-220}>
                      <MediaCard
                        src={IMG(M.reloj)} kind="photo"
                        w={330} h={210} x={82} y={30} z={0} ry={-15} radius={10}
                        label="9:30 PM" lit={0.42} litColor={V.amber} sheenAt={A(0.16)}
                        opacity={keyed(f, [A(0.15), A(0.176), A(0.3), A(0.324)], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.push])}
                      />
                    </Plane>
                    {/* FUENTE DE LUZ #3 · el LCD de la pinza: la cifra la escribe el kit */}
                    {f >= A(KF.lcd) && f < A(KF.fC) && (
                      <Plane z={190}>
                        <div style={{
                          position: "absolute", left: "42%", top: "52%",
                          width: 470, height: 232, marginLeft: -235, marginTop: -116,
                          borderRadius: 12,
                          background: `radial-gradient(70% 70% at 50% 40%, ${rgba(V.sky, 0.2)} 0%, rgba(6,10,8,0.86) 72%)`,
                          boxShadow: `inset 0 0 60px ${rgba(V.sky, 0.28)}, 0 20px 60px ${rgba(V.ink0, 0.8)}`,
                          opacity: keyed(f, [A(KF.lcd), A(KF.lcd) + 12, A(KF.tabla), A(0.318)], [0, 1, 1, 0.5], [EZ.push, EZ.lin, EZ.soft]),
                        }}>
                          <div style={{
                            position: "absolute", inset: 0, borderRadius: 12, mixBlendMode: "screen",
                            background: `linear-gradient(180deg, ${rgba(V.sky, 0.1)} 0%, rgba(0,0,0,0) 46%)`,
                          }} />
                        </div>
                        <Readout
                          value="0,0" unit="A" label="El panel solar · 9:40 pm"
                          at={A(KF.zero)} x={42} y={52} size={132} color={V.sky}
                        />
                      </Plane>
                    )}
                  </>
                )}

                {/* ── ACTO 3 · LA TURBINA girando como una hélice de avión ─────────────────── */}
                {f >= A(KF.fB) - 6 && f < A(0.548) && (
                  <>
                    <Plane z={40}>
                      <LiveCard f={f} slug={M.turbinaRinde} mount={A(KF.fB) - 6} out={A(0.548)} geo={{
                        w: 820, h: 490, x: 56, y: 40, z: 0, ry: -6, rx: 3, radius: 13,
                        label: "2,1 A · 14 V · 29 W", litColor: V.torch,
                        lit: keyed(f, [A(KF.fB), A(KF.turbina), A(KF.watts), A(KF.fC)], [0.44, 1, 1, 0.7], EZ.soft),
                        opacity: keyed(f, [A(KF.fB) - 6, A(KF.fB) + 6, A(KF.fC) + 12, A(0.548)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.push]),
                      }} />
                    </Plane>
                    <Plane z={-260}>
                      <LiveCard f={f} slug={M.vientoReal} mount={A(0.352)} out={A(0.52)} geo={{
                        w: 380, h: 240, x: 17, y: 68, z: 0, ry: 16, radius: 10,
                        label: "VIENTO DE VERDAD", lit: 0.44, litColor: V.sky,
                        opacity: keyed(f, [A(0.352), A(0.378), A(0.5), A(0.52)], [0, 0.92, 0.92, 0], [EZ.push, EZ.lin, EZ.push]),
                      }} />
                    </Plane>
                    <Plane z={200}>
                      {f >= A(KF.amps) && f < A(KF.marcador) && (
                        <Readout value="2,1" unit="A" label="La turbina de $49"
                          at={A(KF.amps)} x={31} y={30} size={128} color={V.volt} />
                      )}
                      {f >= A(KF.volts) && f < A(KF.marcador) && (
                        <Readout value="14" unit="V" label="En la batería"
                          at={A(KF.volts)} x={31} y={49} size={92} color={V.volt} />
                      )}
                      {f >= A(KF.watts) && f < A(KF.marcador) && (
                        <div style={{
                          position: "absolute", left: "31%", top: "68%", transform: "translate(-50%,-50%)",
                          opacity: clamp01((f - A(KF.watts)) / 10),
                        }}>
                          <Bed pad={20} w={330}>
                            <Kick color={V.amber}>DOS POR CATORCE</Kick>
                            <div style={{ height: 6 }} />
                            <Num size={112} color={V.amber}>29 W</Num>
                          </Bed>
                        </div>
                      )}
                    </Plane>
                  </>
                )}

                {/* ── ACTO 4 · LA ESTACIÓN sobre el suelo mojado, y la barra que sube ──────── */}
                {f >= A(KF.fC) && (
                  <>
                    <Plane z={-300}>
                      <LiveCard f={f} slug={M.linea} mount={A(KF.fC) + 10} out={A(KF.fC2)} geo={{
                        w: 400, h: 250, x: 18, y: 27, z: 0, ry: 15, radius: 10,
                        label: "LA RED, CAÍDA", lit: 0.38, litColor: V.sky,
                        opacity: keyed(f, [A(KF.fC) + 10, A(KF.fC) + 34, A(KF.fC2) - 24, A(KF.fC2)], [0, 0.88, 0.88, 0], [EZ.push, EZ.lin, EZ.push]),
                      }} />
                    </Plane>
                    <Plane z={-180}>
                      {/* el MISMO material del acto 3, otra escala y otra luz: la turbina sigue */}
                      <MediaCard
                        src={IMG(M.turbinaRinde)} kind="photo"
                        w={360} h={228} x={83} y={28} z={0} ry={-16} radius={10}
                        label="SIGUE GIRANDO" lit={0.52} litColor={V.volt} sheenAt={A(KF.fC2) + 8}
                        opacity={keyed(f, [A(KF.fC2) - 6, A(KF.fC2) + 20, A(KF.fD) - 30, A(KF.fD)], [0, 0.92, 0.92, 0], [EZ.push, EZ.lin, EZ.push])}
                      />
                    </Plane>
                    {/* la cama de MATERIAL REAL sobre la que apoya la estación: el suelo chorreando */}
                    <Plane z={80}>
                      <LiveCard f={f} slug={M.lluvia} mount={A(KF.fC) + 12} out={A(KF.fD) + 18} geo={{
                        w: 900, h: 400, x: 50, y: 68, z: 0, ry: 0, rx: 16, radius: 16,
                        lit: 0.4, litColor: V.torch, grade: true,
                        opacity: keyed(f, [A(KF.fC) + 12, A(KF.fC) + 34, A(KF.fD) + 4, A(KF.fD) + 18], [0, 0.9, 0.9, 0], [EZ.push, EZ.lin, EZ.push]),
                      }} />
                    </Plane>
                    {/* FUENTE DE LUZ #5 · LA PANTALLITA (la materia que sale hacia MovMarcador) */}
                    <Plane z={230}>
                      <StationScreen
                        f={f} x={50} y={58} w={430} wh={wh} hourT={hourT} warm={warm}
                        op={keyed(f, [A(KF.estacion) - 14, A(KF.estacion) + 8, A(KF.fD) + 20, A(KF.fD) + 34], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.push])}
                      />
                      <NightClock f={f} t={hourT}
                        op={keyed(f, [A(KF.bar1) - 10, A(KF.bar1) + 12, A(KF.once), A(KF.once) + 20], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.push])} />
                      <IconPng src={IC("bateria")} x={30} y={44} size={72} z={0}
                        opacity={keyed(f, [A(KF.estacion), A(KF.estacion) + 16, A(KF.fD) - 20, A(KF.fD)], [0, 0.9, 0.9, 0], [EZ.push, EZ.lin, EZ.push])}
                        glow={V.volt} />
                      <IconPng src={IC("reloj")} x={70} y={44} size={66} z={0}
                        opacity={keyed(f, [A(KF.bar1), A(KF.bar1) + 16, A(KF.fD) - 20, A(KF.fD)], [0, 0.82, 0.82, 0], [EZ.push, EZ.lin, EZ.push])}
                        glow={V.amber} />
                    </Plane>
                  </>
                )}
              </AbsoluteFill>
            )}

            {/* ══════ ACTO 5 · ADENTRO DE LA CASA — sale del otro lado del zoom-through ══════ */}
            {inHouse && (
              <>
                <Plane z={-40}>
                  <LiveCard f={f} slug={M.lampara} mount={A(KF.fD) + 14} out={D} geo={{
                    w: 820, h: 500, x: 47, y: 44, z: 0, ry: 5, rx: -2, radius: 14,
                    label: "TODA LA NOCHE", litColor: V.amber,
                    lit: keyed(f, [A(KF.fD) + 14, A(KF.lampara), A(KF.vuelta), D], [0.6, 1, 0.86, 0.7], EZ.soft),
                    opacity: keyed(f, [A(KF.fD) + 14, A(KF.fD) + 34, A(KF.vuelta), D], [0, 1, 1, 0.72], [EZ.push, EZ.lin, EZ.soft]),
                  }} />
                </Plane>
                {/* los TRES consumos: se prenden de a uno a medida que Claudio los nombra */}
                <Plane z={260}>
                  {([
                    ["bombillanoche", 22, 74, KF.lampara, V.amber, 92],
                    ["enchufe", 50, 78, KF.modem, V.volt, 78],
                    ["bateria", 78, 74, KF.telefono, V.amber, 84],
                  ] as [string, number, number, number, string, number][]).map(([ic, ix, iy, at, c, sz]) => {
                    const on = clamp01((f - A(at)) / 12);
                    if (on <= 0) return null;
                    const glowP = 0.7 + 0.3 * Math.sin(f / 12 + ix);
                    return (
                      <div key={ic}>
                        <div style={{
                          position: "absolute", left: `${ix}%`, top: `${iy}%`,
                          width: 300, height: 300, marginLeft: -150, marginTop: -150,
                          background: `radial-gradient(50% 50% at 50% 50%, ${rgba(c, 0.24 * on * glowP)} 0%, rgba(0,0,0,0) 70%)`,
                          mixBlendMode: "screen", pointerEvents: "none",
                        }} />
                        <IconPng src={IC(ic)} x={ix} y={iy - 4} size={sz * lerp(0.82, 1, EZ.snap(on))}
                          z={0} opacity={on} glow={c} />
                      </div>
                    );
                  })}
                </Plane>
                {/* 0.930 · volvemos a bajar a la ESTACIÓN: es el plano que recibe MovMarcador */}
                {f >= A(KF.vuelta) - 20 && (
                  <>
                    <Plane z={60}>
                      <MediaCard
                        src={IMG(M.lluvia)} kind="photo"
                        w={840} h={340} x={50} y={70} z={0} rx={17} radius={16}
                        lit={0.5} litColor={V.amber}
                        opacity={keyed(f, [A(KF.vuelta) - 20, A(KF.vuelta) + 6], [0, 0.88], EZ.push)}
                      />
                    </Plane>
                    <Plane z={240}>
                      <StationScreen f={f} x={50} y={62} w={400} wh={187} hourT={1} warm={1}
                        op={keyed(f, [A(KF.vuelta) - 20, A(KF.vuelta) + 8], [0, 1], EZ.push)} />
                    </Plane>
                  </>
                )}
              </>
            )}
          </AbsoluteFill>
        </AbsoluteFill>
      </Layers>

      {/* ══ EL TEMPORAL — viento al MÁXIMO del video (1.00) + lluvia densa e inclinada ══════ */}
      <WindField speed={wind} tint={V.sky} count={26} opacity={0.9} />
      <RainField f={f} density={rain} tilt={20} tint={V.sky} />
      <RainField f={f} density={rain * 0.7} tilt={26} tint={V.torch} />

      {/* ══ FUENTE DE LUZ #2 · EL HAZ DE LA LINTERNA — cruza TODAS las fronteras ═══════════ */}
      <Torch f={f} ox={16} oy={104} tx={torchX} ty={torchY} power={torchPow} spread={torchSpread} />

      {/* ══ FRONTERA B · CORTE EN EL BEAT: el relámpago (5 frames, ⛔ no es un fade) ════════ */}
      <Lightning f={f} at={A(KF.fB)} dur={5} strength={1} />
      <SeamFlash at={A(KF.fB)} color={V.sky} dur={6} />
      {/* 2º relámpago, más lejano, sobre "veintinueve vatios" */}
      <Lightning f={f} at={A(KF.rayo2)} dur={4} strength={0.5} />

      {/* ══ FRONTERA C · WIPE POR MATERIA: el agua ═════════════════════════════════════════ */}
      <WaterSheet f={f} at={A(KF.fC)} dur={Math.round(D * 0.03)} />
      <SeamWipeMatter at={A(KF.fC) + 4} dur={Math.round(D * 0.026)} tint={V.blade} />

      {/* ══ COSTURA INTERNA · OCLUSIÓN: el canto de la losa mojada = el salto de horas ═════ */}
      <WetSlab f={f} at={A(KF.fC2)} dur={Math.round(D * 0.014)} />

      {/* ══ FRONTERA D · el bloom de salida del ZOOM-THROUGH (refracción, no un fundido) ═══ */}
      {f > A(KF.fD) + 20 && f < A(KF.fD) + 44 && (
        <AbsoluteFill style={{
          pointerEvents: "none", mixBlendMode: "screen",
          background: `radial-gradient(60% 50% at 50% 54%, ${rgba(V.amber, 0.3 * Math.sin(clamp01((f - A(KF.fD) - 20) / 24) * Math.PI))} 0%, rgba(0,0,0,0) 74%)`,
        }} />
      )}

      {/* ══ TIPOGRAFÍA — 1 idea por acto, ≤7 palabras, cama oscura, safe area 60 px ════════ */}
      {t1 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(34, 0, EZ.snap(t1)).toFixed(1)}px)`,
          opacity: t1,
        }}>
          <Bed pad={28} w={860}>
            <Kick color={V.amber}>9:30 PM · SE FUE LA LUZ</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>SALÍ CON LA <Em color={V.torch}>LINTERNA</Em></Head>
          </Bed>
        </div>
      )}
      {t2 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(t2)).toFixed(1)}px)`,
          opacity: t2,
        }}>
          <Bed pad={28} w={840}>
            <Kick color={V.sky}>MI CAMPEÓN IBA DOCE A CERO</Kick>
            <div style={{ height: 12 }} />
            {f < A(KF.nada)
              ? <Head size={76}>CERO COMA CERO <Em color={V.sky}>AMPERIOS</Em></Head>
              : <Head size={94}>CERO <Em color={V.sky}>ABSOLUTO</Em></Head>}
            <div style={{ height: 10 }} />
            <Body size={30}>De noche es una tabla de plástico mojándose.</Body>
          </Bed>
        </div>
      )}
      {t3 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(28, 0, EZ.snap(t3)).toFixed(1)}px)`,
          opacity: t3,
        }}>
          <Bed pad={28} w={800}>
            <Kick>ARRIBA, EN EL CAÑO</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>GIRANDO COMO UNA <Em>HÉLICE</Em></Head>
          </Bed>
        </div>
      )}
      {/* EL MARCADOR QUE SE DA VUELTA — centrado, es el clímax numérico */}
      {scoreP > 0.01 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(-50%,-50%) translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) scale(${lerp(0.94, 1, EZ.snap(scoreP)).toFixed(3)})`,
          opacity: scoreP,
        }}>
          <Scoreboard f={f} p={scoreP} />
        </div>
      )}
      {t4 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(t4)).toFixed(1)}px)`,
          opacity: t4,
        }}>
          <Bed pad={28} w={880}>
            <Kick color={V.amber}>CON LA CUADRA A OSCURAS</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>LO ÚNICO QUE <Em>CARGABA</Em></Head>
            {elevenP > 0.01 && (
              <div style={{ marginTop: 18, opacity: elevenP }}>
                <ElevenVsOne f={f} p={elevenP} />
              </div>
            )}
          </Bed>
        </div>
      )}
      {t5 > 0.01 && (
        <div style={{
          position: "absolute", left: 96, bottom: 112,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(26, 0, EZ.snap(t5)).toFixed(1)}px)`,
          opacity: t5,
        }}>
          <Bed pad={28} w={920}>
            <Kick color={V.amber}>LA ENERGÍA DE UNA TORMENTA</Kick>
            <div style={{ height: 12 }} />
            <Head size={72}>UNA LÁMPARA, EL WIFI, UN <Em color={V.amber}>TELÉFONO</Em></Head>
          </Bed>
        </div>
      )}

      {/* ── viñeta VIVA: nunca cierra del todo (⛔ crushear las esquinas = pantalla apagada) ── */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(92% 76% at ${torchX.toFixed(1)}% ${(torchY * 0.6 + 22).toFixed(1)}%, rgba(0,0,0,0) 40%, rgba(0,0,0,${(0.22 + 0.05 * Math.sin(f / 91)).toFixed(3)}) 100%)`,
      }} />
      {/* aberración cromática en los picos de energía (⛔ nunca un blur full-screen) */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [A(KF.fB) - 8, A(KF.fB) + 10, A(KF.marcador), A(KF.marcador) + 40, A(KF.bar3), A(KF.bar3) + 30],
          [0, 0.12, 0.12, 0.05, 0.13, 0], [EZ.push, EZ.lin, EZ.soft, EZ.push, EZ.soft]),
        background: `linear-gradient(94deg, ${rgba(V.volt, 0.16)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(V.amber, 0.16)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
