// MovEscalonTarifa.tsx — S5 · UN MOVIMIENTO CONTINUO de 64 s (1920 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 566,0.
//
// LA ESPINA: el promedio de la factura miente. Ciento ochenta y siete dólares entre novecientos
// sesenta kilovatios hora da diecinueve centavos — y ese precio NO EXISTE. La tarifa viene en
// escalones, y los kilovatios hora que sacas cuando arreglas la secadora o el calentador salen
// SIEMPRE del escalón de arriba, el de veintiséis centavos. Por eso ciento veintiséis dólares de
// arreglos rinden mil ciento ochenta y cinco al año. La idea es FÍSICA, no aritmética: hay una pila
// de ladrillos en tres escalones y la mano saca de ARRIBA, nunca de abajo. Y el remate no es un
// número escrito: son dos pilas de billetes de ALTURA absurdamente distinta en el mismo cuadro.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                 ║
// ╠════╦═══════════════════════════════════════╦═══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto        ║ SALE: encuadre + luz + objeto                 ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: viene de MovTresNumeros. Media,  ║ CÁM: z≈-150 y YA empujando hacia adelante-     ║
// ║ g0 ║ girada hacia la noche (z -180,        ║      abajo (camZ 0→26, camRise arranca). No    ║
// ║    ║ ry -8), retrocedida.                  ║      frena en la frontera: la atraviesa.       ║
// ║    ║ LUZ: NOCHE AZUL. keyFrom 0.30, tintA  ║ LUZ: keyFrom 0.30→0.40, tintA sky→volt a       ║
// ║    ║ = V.sky, intensidad 0.70. La barra    ║      medio camino, intensidad 0.70→0.92.       ║
// ║    ║ del sol de MovTresNumeros se apaga.   ║ MAT: EL RENGLÓN DE LA DIVISIÓN (187/960) ya    ║
// ║    ║ MAT: LA FACTURA con la tabla de       ║      no es una línea: engrosó, se acostó en    ║
// ║    ║ tramos + la división escrita al lado. ║      perspectiva y se está cuarteando en       ║
// ║    ║                                       ║      LADRILLOS. Es el primer escalón.          ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: z≈-150 avanzando, misma inercia. ║ CÁM: z≈-18 y SUBIENDO (camRise 0→54): la       ║
// ║g420║ LUZ: keyFrom 0.40, tintA casi volt,   ║      cámara empezó a trepar la escalera.       ║
// ║    ║ el ámbar entrando por arriba-derecha. ║ LUZ: keyFrom 0.40→0.52, tintB volt→ámbar       ║
// ║    ║ MAT: el primer escalón cuarteado en   ║      fuerte: el escalón de arriba QUEMA.       ║
// ║    ║ ladrillos; los otros dos tramos se    ║ MAT: LA ESCALERA de tres tramos entera, con    ║
// ║    ║ apilan encima subiendo a la derecha.  ║      el de arriba encendido en ámbar.          ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: z≈-18 subiendo, sin cortar. La   ║ CÁM: z≈+40, alta y volcada sobre el escalón,   ║
// ║g870║ misma curva sigue trepando.           ║      empezando a retroceder hacia la mesa.     ║
// ║    ║ LUZ: keyFrom 0.52, ámbar fuerte       ║ LUZ: keyFrom 0.52→0.60, intensidad al máximo   ║
// ║    ║ arriba, volt de la medición abajo.    ║      (1.02): es el instante del dato.          ║
// ║    ║ MAT: el escalón de arriba, ahora en   ║ MAT: EL CUARTO LADRILLO sacado va EN VUELO     ║
// ║    ║ macro; los dos de abajo salen de      ║      hacia el lente, alargándose. Detrás, la   ║
// ║    ║ cuadro por geometría. La pila baja.   ║      pila ya bajó cuatro ladrillos.            ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: z≈+40 retrocediendo y bajando    ║ CÁM: z≈-104, casi frontal (ry -0,8), quieta    ║
// ║g1260║ hacia la mesa de la cocina.          ║      sobre la mesa con deriva viva.            ║
// ║    ║ LUZ: keyFrom 0.60→0.56, vuelve el     ║ LUZ: ÁMBAR DE COCINA BAJO (keyFrom 0.50,       ║
// ║    ║ ámbar de cocina, el volt bajando.     ║      intensidad 0.86) y el volt apagándose.    ║
// ║    ║ MAT: EL TICKET DE LA FERRETERÍA (en   ║ MAT: LA CAJA DEL RESULTADO MENSUAL (98,80)     ║
// ║    ║ lo que se transformó el ladrillo)     ║      estirándose ×12 en vertical: se está      ║
// ║    ║ apoyado en la mesa + la multiplicación.║      volviendo la columna del año.            ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 5  ║ CÁM: z≈-104 casi frontal, bajando el  ║ CÁM: FRONTAL Y ESTABLE, z -120, ry 0. Es el    ║
// ║g1620║ último tramo del viaje.              ║      encuadre con el que abre MovLadronesA.    ║
// ║    ║ LUZ: ámbar bajo, volt casi apagado.   ║ LUZ: ÁMBAR BAJO de cocina, volt apagado.       ║
// ║    ║ MAT: la caja del mensual convertida   ║ MAT: EL TICKET DE LA FERRETERÍA apoyado en la  ║
// ║    ║ en columna, llenándose de fajos.      ║      mesa bajo la pila chica — la materia con  ║
// ║    ║                                       ║      la que arranca el movimiento siguiente.   ║
// ╚════╩═══════════════════════════════════════╩═══════════════════════════════════════════════╝
//
// COSTURAS — la que manda la ficha en cada frontera, ninguna es un fundido:
//   g420  1→2  MATCH-SHAPE  — EL RENGLÓN DE LA DIVISIÓN no se corta ni se apaga: de g360 a g470 pasa
//                             de 7 px de alto a 48, se acuesta en la perspectiva del suelo (rotateX
//                             0→58) y se le abren juntas: los siete ladrillos que lo forman se
//                             separan. La línea de la división ES el primer escalón. Ni un frame de
//                             negro, ni un opacity que baje.
//   g870  2→3  MATCH-MOVE   — la cámara no corta: sigue trepando (camRise 6→168, camZ 64→178,
//                             rotateX 0→-2,6) y el mundo cambia debajo — los dos escalones de abajo
//                             se van por el borde inferior POR GEOMETRÍA mientras el de arriba crece
//                             a macro. La escalera nunca se desmonta.
//   g1260 3→4  OCLUSIÓN     — <SeamOcclude color={V.paper}>: el TICKET de la ferretería cruza el
//                             cuadro. El cuarto ladrillo venía volando hacia el lente y sale del
//                             otro lado convertido en el ticket, apoyado en la mesa en el mismo
//                             ángulo. `lit` por defecto (0.30): ni flash blanco ni fundido.
//   g1620 4→5  MATCH-SHAPE  — la CAJA del resultado mensual (98,80) se estira ×12 en vertical y se
//                             vuelve la columna del año; los fajos suben a llenarla desde la base.
//                             La cifra no se cambia: cuenta de 98,80 a 1.185,60 mientras la caja crece.
//
// ⛔ CONTRATO: sin Math.random / Date.now (todo sale de rnd(k) y de g) · sin backdrop-filter ·
// ⛔ sin filter: blur propio · rutas SÓLO literales de la ficha · ninguna <Sequence> por acto.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SunField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1920;
const A2 = 420;
const A3 = 870;
const A4 = 1260;
const A5 = 1620;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// dinero con separador de miles y coma decimal (ES): 1185.6 -> "1.185,60"
const dinero = (n: number, dec = 2) => {
  const v = Math.max(0, n);
  const ent = Math.floor(v);
  const s = String(ent);
  const mil = s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
  if (dec === 0) return mil;
  const fr = Math.round((v - ent) * 100);
  return mil + "," + (fr < 10 ? "0" + String(fr) : String(fr));
};

// ── MARCO: el vidrio que RECORTA el material. Es la primitiva de todo este movimiento — el mismo
//    rectángulo hace de renglón de la división, de ladrillo, de tarjeta y de fajo de billetes.
const Marco: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number; canto?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 8, lit = 1, litColor = V.volt, opacity = 1, canto = 1, children }) => {
  const ww = Math.max(6, w);
  const hh = Math.max(4, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      transformStyle: "preserve-3d", transformOrigin: "50% 100%",
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      borderTop: `${(1.5 * canto).toFixed(1)}px solid ${rgba(litColor, 0.62 * lit * canto)}`,
      boxShadow: `0 ${Math.round(hh * 0.16)}px ${Math.round(hh * 0.26)}px ${rgba(V.ink0, 0.76)}, ` +
        `0 3px 14px ${rgba(V.ink0, 0.6)}, inset 0 1px 0 ${rgba(V.white, 0.22 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro del Marco: la FOTO siempre (recorte animado = nunca queda quieta) y el CLIP
//    encima cuando toca. `k` es el zoom de recorte (≥1: la foto siempre cubre el marco).
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.04, k);
  const iw = Math.max(10, w * kk);
  const ih = Math.max(10, h * kk);
  return (
    <>
      <MediaCard src={photo} kind="photo" w={iw} h={ih} x={cx} y={cy} z={0}
        radius={0} lit={lit} litColor={litColor} sheenAt={sheenAt} />
      {clip && vid > 0.004 && (
        <MediaCard src={clip} kind="video" w={iw} h={ih} x={cx} y={cy} z={0}
          radius={0} lit={lit} litColor={litColor} opacity={clamp01(vid)} />
      )}
    </>
  );
};

// ── EL LADRILLO — la unidad manipulable de la tarifa. NO es un rectángulo de color: adentro va un
//    recorte distinto de la foto real de los ladrillos, así que cada uno tiene su propia cara.
const Ladrillo: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; seed: number;
  lit?: number; tint?: string; opacity?: number; sheenAt?: number; canto?: number;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, seed, lit = 1, tint = V.volt, opacity = 1, sheenAt = -999, canto = 1 }) => {
  const cx = 50 + (rnd(seed * 3.7) - 0.5) * 38;
  const cy = 50 + (rnd(seed * 8.9) - 0.5) * 34;
  return (
    <Marco x={x} y={y} w={w} h={h} z={z} ry={ry} rx={rx} rot={rot} radius={3}
      lit={lit} litColor={tint} opacity={opacity} canto={canto}>
      <Mat photo="img/cmeurgente/cmeu_ladrillos.jpg" w={Math.max(6, w)} h={Math.max(4, h)}
        k={2.5} cx={cx} cy={cy} lit={lit} litColor={tint} sheenAt={sheenAt} />
      {/* la junta de mortero del canto inferior: lo que hace que se lea como PILA y no como tarjeta */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: Math.max(2, h * 0.11),
        background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.72)} 100%)`,
      }} />
    </Marco>
  );
};

// ── EL FAJO — la unidad de las dos pilas. Mismo rectángulo que el ladrillo, otra materia: adentro
//    va un recorte de la foto real de los billetes. La ALTURA de la pila es el mensaje.
const Fajo: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rot?: number; seed: number; lit?: number; tint?: string; opacity?: number;
}> = ({ x, y, w, h, z = 0, ry = 0, rot = 0, seed, lit = 1, tint = V.amber, opacity = 1 }) => {
  const cx = 50 + (rnd(seed * 5.1) - 0.5) * 34;
  const cy = 50 + (rnd(seed * 2.3) - 0.5) * 30;
  return (
    <Marco x={x} y={y} w={w} h={h} z={z} ry={ry} rot={rot} radius={2}
      lit={lit} litColor={tint} opacity={opacity} canto={0.8}>
      <Mat photo="img/cmeurgente/cmeu_dos_pilas.jpg" w={Math.max(6, w)} h={Math.max(4, h)}
        k={3.1} cx={cx} cy={cy} lit={lit} litColor={tint} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: Math.max(2, h * 0.3),
        background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.66)} 100%)`,
      }} />
    </Marco>
  );
};

// ── CAMA RADIAL: la plancha oscura bajo una cifra que vive sobre material real.
const Cama: React.FC<{ x: number; y: number; w: number; h: number; a?: number }> = ({ x, y, w, h, a = 0.82 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
    marginLeft: -w / 2, marginTop: -h / 2,
    background: `radial-gradient(closest-side, rgba(8,9,6,${a}), rgba(8,9,6,0))`,
  }} />
);

// ── RÓTULO DE ESCALÓN: el precio del tramo, pegado a su peldaño (esto SÍ es un gráfico de dato).
const Precio: React.FC<{
  x: number; y: number; valor: string; nombre: string; tint: string; on: number; lit: number; size?: number;
}> = ({ x, y, valor, nombre, tint, on, lit, size = 44 }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
      textAlign: "center", opacity: clamp01(on), whiteSpace: "nowrap",
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1,
        color: tint, textShadow: `0 0 ${Math.round(size * 0.5)}px ${rgba(tint, 0.34 + 0.3 * lit)}, 0 4px 18px rgba(0,0,0,0.94)`,
      }}>{valor}</div>
      <div style={{
        fontFamily: F_BODY, fontWeight: 700, fontSize: Math.round(size * 0.4), letterSpacing: 2.2, marginTop: 4,
        color: rgba(V.white, 0.34 + 0.5 * lit), textShadow: "0 3px 14px rgba(0,0,0,0.92)",
      }}>{nombre}</div>
    </div>
  );
};

// ── LA ESCALERA: geometría compartida por los tres tramos. Devuelve el x% del ladrillo i.
const slotX = (cx: number, w: number, n: number, gap: number, i: number) => {
  const bw = (w - (n - 1) * gap) / n;
  return cx + ((i - (n - 1) / 2) * (bw + gap)) / 1920 * 100;
};
const slotW = (w: number, n: number, gap: number) => (w - (n - 1) * gap) / n;

// ── LOS CUATRO LADRILLOS QUE LA MANO SACA DE ARRIBA (nunca de abajo) ────────────────────────
const VUELO = [
  { t0: 930, dur: 96, xf: -20, yf: 30, rf: -24, i: 4 },
  { t0: 994, dur: 96, xf: 120, yf: 76, rf: 21, i: 3 },
  { t0: 1054, dur: 96, xf: -24, yf: 88, rf: 27, i: 2 },
  { t0: 1150, dur: 118, xf: 122, yf: 44, rf: -13, i: 1 },
];

export const MovEscalonTarifa: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El movimiento se monta con UNA sola <Sequence>: traduzco el frame global al local para todo
  // componente del Stage que razona en frames (`at`, `sheenAt`).
  const lFrame = useCurrentFrame();
  const off = (Number.isFinite(gFrame) ? (gFrame as number) : lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame) ? (gFrame as number) : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ═══════════════════════════
  // Un solo viaje: entra atrás y girada en la noche (z -180, ry -8), trepa la escalera hasta el
  // macro del escalón caro, y baja a la mesa quedando FRONTAL y estable (z -120, ry 0).
  const camB = gcam(g, { z0: -180, z1: -120, panX: 14, panY: -8, ry: 0, rx: 0, dur: END });
  const camZ = ip(g,
    [0, 240, 420, 700, 870, 1000, 1120, 1260, 1400, 1560, 1620, 1780, 1920],
    [0, 14, 26, 64, 110, 178, 196, 150, 72, 14, -6, -4, 0]);
  const camRise = ip(g,
    [0, 420, 700, 870, 1010, 1180, 1260, 1440, 1620, 1920],
    [0, 2, 6, 54, 168, 196, 180, 96, 34, 10]);
  const camRY = ip(g, [0, 420, 870, 1260, 1620, 1920], [-8, -6.6, -4.2, -2.4, -0.8, 0]);
  const camTilt = ip(g, [0, 760, 1010, 1260, 1500, 1920], [0, 0, -2.6, -3.4, -1.6, 0]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camRise.toFixed(1)}px) rotateY(${camRY.toFixed(2)}deg) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara replicada para el HUD: el texto no queda pegado con cinta al vidrio
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — noche azul (lo que hereda) → ámbar quemando arriba → ámbar bajo de cocina ════
  const keyFrom = ip(g, [0, 420, 700, 870, 1120, 1260, 1440, 1700, 1920],
    [0.30, 0.40, 0.46, 0.52, 0.60, 0.60, 0.56, 0.50, 0.50]);
  const inten = ip(g, [0, 140, 420, 700, 1000, 1120, 1300, 1560, 1780, 1920],
    [0.70, 0.80, 0.92, 0.96, 1.00, 1.02, 0.96, 0.90, 0.86, 0.86]);
  const floor = ip(g, [0, 420, 1000, 1420, 1920], [0.62, 0.60, 0.66, 0.58, 0.52]);
  // sky -> volt en la primera mitad, volt -> amber en la segunda: en g=860 las dos dan volt exacto.
  const tintTemprano = light(ip(g, [0, 260, 860], [0, 0.56, 1]), "sky", "volt");
  const tintTardio = light(ip(g, [860, 1240, 1620, 1920], [0, 0.44, 0.86, 1]), "volt", "amber");
  const tintA = g < 860 ? tintTemprano : tintTardio;
  const tintB = light(ip(g, [0, 420, 760, 1260, 1620, 1920], [0, 0.28, 0.86, 1, 1, 1]), "sky", "amber");

  // ══ LA FACTURA — el papel del que sale todo. Vive de g0 a la oclusión, sin desmontarse. ═══
  const kF = [0, 40, 200, 380, 470, 700, 900, 1120, 1240];
  const facW = ip(g, kF, [720, 700, 660, 640, 520, 360, 300, 262, 250]);
  const facH = ip(g, kF, [800, 778, 734, 712, 578, 400, 334, 292, 278]);
  const facX = ip(g, kF, [70, 70, 69.5, 69, 76, 84, 88, 91, 93]);
  const facY = ip(g, kF, [46, 46, 46, 46, 40, 27, 20, 15, 12]);
  const facZ = ip(g, kF, [30, 26, 22, 18, -30, -110, -180, -240, -270]);
  const facRY = ip(g, kF, [-13, -12, -11, -10.4, -14, -19, -22, -24, -25]);
  const facLit = ip(g, kF, [0.30, 1, 1, 1, 0.92, 0.7, 0.56, 0.42, 0.36]);
  const facK = Math.max(1.05, ip(g, [0, 200, 470, 900, 1240], [880, 800, 640, 420, 320]) / Math.max(40, facW));

  // ══ LA DIVISIÓN 187 / 960 — y EL RENGLÓN que se vuelve el primer escalón ══════════════════
  const divOn = ip(g, [128, 156, 386, 414], [0, 1, 1, 0]);       // los dos números, no el renglón
  const tachado = ip(g, [286, 322], [0, 1]);                     // el 0,19 tachado: no existe
  const cocOn = ip(g, [236, 268, 380, 408], [0, 1, 1, 0]);       // el cociente

  // ══ LOS TRES TRAMOS DE LA ESCALERA ════════════════════════════════════════════════════════
  // El tramo 0 ES el renglón de la división: nace en g150 como una línea de 7 px y se acuesta,
  // engorda y se cuartea en ladrillos a través de la frontera g420. Ni un fade en el medio.
  const kE0 = [150, 300, 360, 420, 470, 560, 870, 1010, 1130, 1258];
  const e0W = ip(g, kE0, [344, 346, 346, 700, 560, 560, 560, 620, 700, 760]);
  const e0H = ip(g, kE0, [7, 7, 8, 26, 48, 48, 48, 62, 78, 90]);
  const e0X = ip(g, kE0, [28, 28, 28.3, 32, 36, 36, 36, 33, 29, 26]);
  const e0Y = ip(g, kE0, [33.5, 33.5, 33.8, 58, 77, 77, 78.4, 96, 116, 132]);
  const e0Z = ip(g, kE0, [22, 22, 20, -10, -30, -30, -30, -20, -6, 6]);
  const e0RX = ip(g, kE0, [0, 0, 2, 34, 58, 58, 58, 60, 62, 64]);
  const e0Gap = ip(g, kE0, [0, 0, 0.6, 5, 9, 9, 9, 10, 11, 12]);
  const e0Lit = ip(g, kE0, [0.5, 0.86, 0.9, 0.86, 0.8, 0.78, 0.78, 0.62, 0.44, 0.3]);
  const e0Canto = ip(g, [150, 360, 420, 500], [1, 1, 0.7, 0.35]);

  // tramo 1 y tramo 2: se apilan encima, subiendo a la derecha. Entran POR GEOMETRÍA (suben desde
  // abajo del tramo anterior), nunca por opacidad.
  const kE1 = [470, 500, 570, 870, 1010, 1130, 1258];
  const e1W = ip(g, kE1, [520, 520, 545, 545, 610, 690, 750]);
  const e1H = ip(g, kE1, [10, 26, 48, 48, 64, 82, 96]);
  const e1X = ip(g, kE1, [45, 45, 45, 45, 42, 38, 35]);
  const e1Y = ip(g, kE1, [80, 72, 63.5, 65.2, 86, 108, 126]);
  const e1Lit = ip(g, kE1, [0.4, 0.72, 0.9, 0.9, 0.7, 0.5, 0.34]);

  const kE2 = [560, 592, 664, 870, 1010, 1120, 1260];
  const e2W = ip(g, kE2, [500, 500, 530, 530, 900, 1180, 1240]);
  const e2H = ip(g, kE2, [10, 26, 48, 48, 122, 198, 214]);
  const e2X = ip(g, kE2, [54, 54, 54, 54, 52, 50, 49.4]);
  const e2Y = ip(g, kE2, [67, 59, 50.2, 51.6, 51, 50, 49]);
  const e2Z = ip(g, kE2, [-150, -150, -150, -150, -60, 20, 34]);
  const e2Lit = ip(g, kE2, [0.4, 0.8, 1, 1, 1, 1, 0.98]);
  // el escalón de arriba QUEMA: pasa de volt a ámbar fuerte y se queda ahí
  const e2Tint = light(ip(g, [592, 700, 780], [0, 0.6, 1]), "volt", "amber");

  // cuántos ladrillos ya salió la mano del escalón de arriba (y cuánto BAJÓ la pila por eso)
  const sacados = ip(g, [930, 962, 994, 1026, 1054, 1086, 1150, 1182], [0, 1, 1, 2, 2, 3, 3, 4]);
  const baja = sacados * 15;   // px: la pila baja de verdad cada vez que sale un ladrillo

  // ══ EL CONTADOR DE kWh QUE SE VAN — nace en el acto 3 y CRUZA la oclusión ════════════════
  const kwh = ip(g, [936, 1000, 1060, 1156, 1214], [0, 96, 190, 286, 380]);
  const kwhX = ip(g, [900, 1180, 1244, 1268, 1340, 1560], [72, 72, 68, 63, 60, 60]);
  const kwhY = ip(g, [900, 1180, 1244, 1268, 1340, 1560], [72, 72, 66, 46, 33, 33]);
  const kwhS = ip(g, [900, 1180, 1244, 1268, 1340, 1560], [104, 104, 92, 74, 62, 62]);
  const kwhOn = ip(g, [930, 950, 1540, 1584], [0, 1, 1, 0]);

  // ══ EL TICKET DE LA FERRETERÍA — en lo que se transforma el cuarto ladrillo ═══════════════
  const kT = [1252, 1300, 1400, 1620, 1760, 1830, 1920];
  const ticW = ip(g, kT, [430, 400, 392, 392, 372, 384, 384]);
  const ticH = ip(g, kT, [186, 470, 540, 540, 300, 132, 132]);
  const ticX = ip(g, kT, [64, 26, 22, 22, 19, 17, 17]);
  const ticY = ip(g, kT, [42, 58, 62, 62, 78, 92, 92]);
  const ticRY = ip(g, kT, [-16, 12, 13, 13, 10, 6, 6]);
  const ticRX = ip(g, kT, [10, 8, 6, 6, 26, 56, 58]);
  const ticLit = ip(g, kT, [0.5, 0.9, 1, 1, 0.92, 0.86, 0.84]);

  // ══ LA MULTIPLICACIÓN 380 × 0,26 = 98,80 · y la CAJA que se estira ×12 ════════════════════
  const mulOn = ip(g, [1296, 1330, 1596, 1626], [0, 1, 1, 0]);
  // La CAJA del resultado: de la ficha del mensual a la COLUMNA del año (match-shape g1620).
  const kC = [1380, 1440, 1560, 1620, 1700, 1780, 1920];
  const cajaW = ip(g, kC, [470, 470, 466, 400, 300, 258, 250]);
  const cajaH = ip(g, kC, [176, 176, 178, 300, 560, 664, 686]);
  const cajaX = ip(g, kC, [63, 63, 63, 63.4, 63.6, 63.6, 63.6]);
  const cajaY = ip(g, kC, [58, 58, 58, 62, 60, 54.6, 53.6]);
  const cajaOn = ip(g, [1376, 1404, 1704, 1748], [0, 1, 1, 0]);
  // la cifra que cuenta de 98,80 al año entero mientras la caja crece: la cifra NO se reemplaza
  const cifraAnual = ip(g, [1596, 1660, 1712], [98.8, 760, 1185.6]);
  const cifraX = ip(g, kC, [63, 63, 63, 63.4, 66.5, 71.5, 71.5]);
  const cifraY = ip(g, kC, [55, 55, 55, 56, 40, 21.5, 20.6]);
  const cifraS = ip(g, kC, [104, 104, 104, 104, 92, 76, 76]);

  // ══ LAS DOS PILAS — la diferencia se lee por ALTURA, no por el número escrito ═════════════
  // 1.185,60 / 126 = 9,41. Fajo = 24 px. Pila grande 28 fajos (672 px) · pila chica 3 (72 px).
  const N_GRANDE = 28;
  const N_CHICA = 3;
  const FAJO_H = 24;
  const grandeVis = ip(g, [1626, 1700, 1786], [0, 14, N_GRANDE]);
  const chicaVis = ip(g, [1650, 1704], [0, N_CHICA]);
  const baseY = 88.4;                       // la línea de la mesa donde apoyan las dos pilas
  const pilasLit = ip(g, [1620, 1700, 1920], [0.5, 0.94, 1]);
  const clipOn = ip(g, [1668, 1706, 1900, 1918], [0, 1, 1, 0.86]);

  // ══ TEXTOS — UNA idea por acto, cada una ≥ 200 frames en pantalla ════════════════════════
  const t1 = ip(g, [150, 176, 392, 414], [0, 1, 1, 0]);       // EL PROMEDIO MIENTE
  const t2 = ip(g, [468, 496, 846, 868], [0, 1, 1, 0]);       // LOS DE ARRIBA SON LOS CAROS
  const t3 = ip(g, [900, 928, 1224, 1250], [0, 1, 1, 0]);     // VEINTISÉIS CENTAVOS
  const t4 = ip(g, [1300, 1330, 1580, 1606], [0, 1, 1, 0]);   // NOVENTA Y OCHO CON OCHENTA
  const t5 = ip(g, [1652, 1682, 1900, 1920], [0, 1, 1, 1]);   // MIL CIENTO OCHENTA Y CINCO…

  // el fondo lejano cambia DURO detrás del ticket que cruza (frontera 3): eso ES la oclusión
  const mesaCocina = g >= 1256;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano: la factura de noche → la mesa de la cocina ----------- */}
        {!mesaCocina && (
          <PhotoPlane src="img/cmeurgente/cmeu_factura_escalones.jpg" kind="photo" z={-660}
            scale={ip(g, [0, 1240], [1.34, 1.22])}
            dim={ip(g, [0, 200, 700, 1240], [0.60, 0.66, 0.76, 0.80])} tint={V.sky} />
        )}
        {mesaCocina && (
          <PhotoPlane src="img/cmeurgente/cmeu_calculadora.jpg" kind="photo" z={-640}
            scale={ip(g, [1256, 1920], [1.32, 1.20])}
            dim={ip(g, [1256, 1620, 1920], [0.72, 0.66, 0.62])} tint={V.amber} />
        )}

        {/* PLANO 2 · la rejilla del recibo: la trama de tramos, como aire de profundidad --- */}
        <Plane z={-420}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.4).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [120, 300, 900, 1240, 1420], [0, 0.24, 0.24, 0.10, 0.03]),
              backgroundImage:
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.10)} 0 1px, rgba(0,0,0,0) 1px 88px),` +
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.05)} 0 1px, rgba(0,0,0,0) 1px 132px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · EL SUELO — la mesa del taller y después la de la cocina --------------- */}
        <PadPlane
          y={ip(g, [0, 420, 870, 1010, 1260, 1620, 1920], [92, 88, 86, 104, 98, 90, 88])}
          w={1720} h={400} rx={64}
          lit={ip(g, [0, 300, 870, 1120, 1300, 1920], [0.32, 0.6, 0.78, 0.5, 0.8, 1])}
          z={-190} />

        {/* PLANO 4 · LA FACTURA — el papel del que sale todo. Recede, nunca se apaga. ------ */}
        {g < 1250 && (
          <Plane z={0}>
            <Marco x={facX} y={facY} w={facW} h={facH} z={facZ} ry={facRY} rx={2}
              radius={10} lit={facLit} litColor={g < 700 ? V.sky : V.amber}>
              <Mat photo="img/cmeurgente/cmeu_factura_escalones.jpg"
                w={facW} h={facH} k={facK}
                cx={50 + Math.sin(g / 250) * 3.2} cy={46 + Math.cos(g / 300) * 2.6}
                lit={facLit} litColor={g < 700 ? V.sky : V.amber} sheenAt={L(44)} />
              {/* el subrayado que corre por la columna de tramos del recibo real */}
              <div style={{
                position: "absolute", left: "8%", right: "8%", top: "63%", height: 4,
                background: rgba(V.amber, 0.8),
                transform: `scaleX(${ip(g, [196, 262], [0, 1]).toFixed(3)})`, transformOrigin: "0% 50%",
                boxShadow: `0 0 18px ${rgba(V.amber, 0.55)}`,
                opacity: ip(g, [196, 262, 470, 540], [0, 1, 1, 0.25]),
              }} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 5 · LA ESCALERA DE TRES TRAMOS ------------------------------------------- */}
        {/* TRAMO 0 — es EL RENGLÓN de la división que se acostó y se cuarteó (match-shape). */}
        {g >= 148 && g < 1258 && (
          <Plane z={0}>
            {Array.from({ length: 7 }, (_, i) => (
              <Ladrillo key={i}
                x={slotX(e0X, e0W, 7, e0Gap, i)}
                y={e0Y + baja / 1080 * 100 * 0.35}
                w={slotW(e0W, 7, e0Gap)} h={e0H} z={e0Z}
                rx={e0RX} ry={ip(g, [150, 470], [0, -3])}
                seed={i * 7 + 3} lit={e0Lit} tint={V.volt} canto={e0Canto}
                sheenAt={i === 3 ? L(452) : -999} />
            ))}
          </Plane>
        )}
        {/* TRAMO 1 — sube desde el tramo 0 y se apoya encima, corrido a la derecha. */}
        {g >= 468 && g < 1258 && (
          <Plane z={-70}>
            {Array.from({ length: 5 }, (_, i) => (
              <Ladrillo key={i}
                x={slotX(e1X, e1W, 5, 9, i)}
                y={e1Y + baja / 1080 * 100 * 0.7}
                w={slotW(e1W, 5, 9)} h={e1H} z={-70}
                rx={ip(g, [470, 570, 1258], [40, 52, 60])} ry={-4}
                seed={i * 11 + 31} lit={e1Lit} tint={V.volt}
                sheenAt={i === 2 ? L(596) : -999} />
            ))}
          </Plane>
        )}
        {/* TRAMO 2 — EL DE ARRIBA. Quema en ámbar y es del que la mano saca los ladrillos. */}
        {g >= 558 && g < 1258 && (
          <Plane z={0}>
            {Array.from({ length: 5 }, (_, i) => {
              const quedan = 5 - sacados;
              const vivo = clamp01(quedan - i);        // el ladrillo i deja el escalón cuando lo sacan
              if (vivo <= 0.02) return null;
              return (
                <Ladrillo key={i}
                  x={slotX(e2X, e2W, 5, ip(g, [560, 870, 1120], [9, 9, 18]), i)}
                  y={e2Y + baja / 1080 * 100}
                  w={slotW(e2W, 5, ip(g, [560, 870, 1120], [9, 9, 18]))} h={e2H} z={e2Z}
                  rx={ip(g, [560, 664, 870, 1120], [40, 48, 48, 30])}
                  ry={ip(g, [560, 870, 1120], [-5, -5, -2])}
                  seed={i * 13 + 61} lit={e2Lit} tint={e2Tint}
                  sheenAt={i === 4 ? L(690) : -999} />
              );
            })}
          </Plane>
        )}

        {/* PLANO 6 · LOS LADRILLOS QUE SALEN DE ARRIBA — pasan POR DELANTE del lente ------ */}
        {g >= 926 && g < 1266 && (
          <Plane z={0}>
            {VUELO.map((v, k) => {
              if (g < v.t0) return null;
              const p = clamp01((g - v.t0) / v.dur);
              const e = ipe(p, [0, 1], [0, 1], Easing.bezier(0.42, 0, 0.86, 0.5));
              const gap2 = ip(g, [560, 870, 1120], [9, 9, 18]);
              const x0 = slotX(e2X, e2W, 5, gap2, v.i);
              const y0 = e2Y + baja / 1080 * 100;
              const w0 = slotW(e2W, 5, gap2);
              const esUltimo = k === 3;
              return (
                <Ladrillo key={k}
                  x={lerp(x0, v.xf, e)}
                  y={lerp(y0, v.yf, e) - Math.sin(p * Math.PI) * 9}
                  w={lerp(w0, esUltimo ? w0 * 3.4 : w0 * 2.6, e)}
                  h={lerp(e2H, esUltimo ? e2H * 1.5 : e2H * 1.9, e)}
                  z={lerp(e2Z, 330, e)}
                  rx={lerp(ip(g, [560, 870, 1120], [40, 48, 30]), 8, e)}
                  ry={lerp(-2, v.rf * 0.6, e)} rot={lerp(0, v.rf, e)}
                  seed={v.i * 13 + 61} lit={lerp(1, 0.5, e)} tint={e2Tint}
                  opacity={clamp01(1 - (p - 0.82) / 0.18)} />
              );
            })}
          </Plane>
        )}

        {/* PLANO 7 · EL TICKET DE LA FERRETERÍA — en lo que se convierte el cuarto ladrillo */}
        {g >= 1250 && (
          <Plane z={20}>
            <Marco x={ticX} y={ticY} w={ticW} h={ticH} z={ip(g, [1252, 1400, 1920], [180, 30, -10])}
              ry={ticRY} rx={ticRX} radius={6} lit={ticLit} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_ticket.jpg" w={ticW} h={ticH}
                k={Math.max(1.05, ip(g, [1252, 1400, 1760, 1920], [640, 460, 430, 430]) / Math.max(40, ticW))}
                cx={50 + Math.sin(g / 210) * 2.6} cy={44 + Math.cos(g / 260) * 3.0}
                lit={ticLit} litColor={V.amber} sheenAt={L(1318)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 12px 10px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.8,
                color: V.white, textTransform: "uppercase",
                opacity: ip(g, [1330, 1372, 1800, 1846], [0, 1, 1, 0.2]),
              }}>126 dólares · ferretería</div>
            </Marco>
          </Plane>
        )}

        {/* PLANO 8 · LA CAJA DEL RESULTADO — ficha del mensual → COLUMNA del año ----------
            NO es una forma con texto: adentro ya vive la foto real de los billetes, apretada en
            macro. Cuando la caja se estira ×12 el material se estira con ella, y los fajos de la
            pila grande suben a ocupar exactamente ese hueco. Eso ES el match-shape de g1620. */}
        {g >= 1374 && cajaOn > 0.01 && (
          <Plane z={40}>
            <Marco x={cajaX} y={cajaY} w={cajaW} h={cajaH} z={0}
              ry={ip(g, [1374, 1620, 1920], [-3, -5, -3])} rx={0} radius={8}
              lit={ip(g, [1374, 1620, 1760], [0.9, 0.8, 0.34])} litColor={V.amber}
              opacity={cajaOn} canto={0.9}>
              <Mat photo="img/cmeurgente/cmeu_dos_pilas.jpg"
                w={cajaW} h={cajaH}
                k={Math.max(1.05, ip(g, [1374, 1560, 1620, 1780, 1920], [900, 880, 780, 470, 430]) / Math.max(40, cajaW))}
                cx={58 + Math.sin(g / 190) * 2.2} cy={62 + Math.cos(g / 240) * 2.4}
                lit={ip(g, [1374, 1620, 1780], [0.62, 0.72, 0.3])} litColor={V.amber}
                sheenAt={L(1444)} />
              <AbsoluteFill style={{
                background: `linear-gradient(180deg, ${rgba(V.ink0, 0.62)} 0%, ${rgba(V.ink0, 0.34)} 46%, ${rgba(V.ink0, 0.74)} 100%)`,
              }} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 9 · LAS DOS PILAS DE BILLETES — la ALTURA es el mensaje ------------------ */}
        {g >= 1624 && (
          <Plane z={30}>
            {/* pila grande: 1.185,60 al año. Se llena desde la base y se sale por arriba. */}
            {Array.from({ length: N_GRANDE }, (_, i) => {
              const vivo = clamp01(grandeVis - i);
              if (vivo <= 0.02) return null;
              const yy = baseY - ((i + 0.5) * FAJO_H) / 1080 * 100;
              return (
                <Fajo key={i}
                  x={63.6 + (rnd(i * 4.3) - 0.5) * 0.55}
                  y={yy + (1 - vivo) * 3.2}
                  w={244 - i * 0.5} h={FAJO_H} z={0}
                  ry={ip(g, [1624, 1920], [-6, -3])}
                  rot={(rnd(i * 9.7) - 0.5) * 1.9}
                  seed={i * 3 + 5} lit={pilasLit * (0.72 + 0.28 * vivo)} tint={V.amber}
                  opacity={clamp01(vivo * 1.6)} />
              );
            })}
            {/* pila chica: 126 dólares. Tres fajos. El mismo ancho, para que mienta la altura. */}
            {Array.from({ length: N_CHICA }, (_, i) => {
              const vivo = clamp01(chicaVis - i);
              if (vivo <= 0.02) return null;
              const yy = baseY - ((i + 0.5) * FAJO_H) / 1080 * 100;
              return (
                <Fajo key={i}
                  x={36 + (rnd(i * 6.1) - 0.5) * 0.6}
                  y={yy + (1 - vivo) * 3.2}
                  w={250} h={FAJO_H} z={30}
                  ry={ip(g, [1624, 1920], [7, 4])}
                  rot={(rnd(i * 2.9) - 0.5) * 2.2}
                  seed={i * 17 + 41} lit={pilasLit} tint={V.volt}
                  opacity={clamp01(vivo * 1.6)} />
              );
            })}
          </Plane>
        )}

        {/* PLANO 10 · EL CLIP — la mano que sigue agregando billetes a la pila grande ----- */}
        {g >= 1662 && (
          <Plane z={170}>
            <MediaCard src="broll/cmeurgente/cmeu_dos_pilas_mov.mp4" kind="video"
              w={ip(g, [1662, 1740, 1920], [330, 430, 448])}
              h={ip(g, [1662, 1740, 1920], [196, 256, 266])}
              x={ip(g, [1662, 1920], [15, 17.5])} y={ip(g, [1662, 1920], [43, 46])}
              z={ip(g, [1662, 1920], [120, 178])}
              ry={ip(g, [1662, 1920], [13, 9])} rx={4}
              radius={10} lit={0.94} litColor={V.amber}
              opacity={clipOn}
              label="Cada mes vuelve a pasar" sheenAt={L(1734)} />
          </Plane>
        )}

        {/* ÍCONOS PNG como objetos de la escena (con su parallax, no pegados al borde) ---- */}
        {g >= 556 && g < 792 && (
          <Plane z={90}>
            <IconPng src="img/cmeurgente/cmeu_ic_flecha.png"
              x={ip(g, [556, 780], [28, 46])} y={ip(g, [556, 780], [72, 40])}
              size={ip(g, [556, 640, 780], [78, 120, 104])} z={40}
              opacity={ip(g, [556, 588, 744, 788], [0, 0.92, 0.92, 0])}
              rot={ip(g, [556, 780], [-46, -32])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1288 && g < 1436 && (
          <Plane z={80}>
            <IconPng src="img/cmeurgente/cmeu_ic_calculadora.png" x={44} y={78}
              size={ip(g, [1288, 1330], [82, 124])} z={30}
              opacity={ip(g, [1288, 1320, 1408, 1434], [0, 0.95, 0.95, 0])}
              rot={ip(g, [1288, 1434], [-9, 4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1748 && (
          <Plane z={80}>
            <IconPng src="img/cmeurgente/cmeu_ic_billete.png" x={82} y={62}
              size={ip(g, [1748, 1808], [70, 116])} z={40}
              opacity={ip(g, [1748, 1790, 1900, 1920], [0, 0.9, 0.9, 0.9])}
              rot={ip(g, [1748, 1920], [12, -4])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ LA BARRA DEL SOL que venía de MovTresNumeros, apagándose ═════════════════ */}
      {g < 168 && (
        <SunField sun={7 / 24} from={9} use={0.22}
          on={ip(g, [0, 96, 164], [0.5, 0.22, 0])}
          tint={V.volt} night={V.sky} y={95} w={1120} h={24} cycle={210} />
      )}

      {/* ══════ COSTURA · FRONTERA 3 (g1260) — OCLUSIÓN: el ticket de papel cruza ═══════ */}
      <SeamOcclude at={L(1246)} dur={26} color={V.paper} angle={-9} />

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* LA DIVISIÓN 187 / 960 — y el cociente que NO existe, tachado */}
        {g >= 126 && g < 416 && (
          <div style={{ opacity: divOn }}>
            <Cama x={28} y={40} w={660} h={660} a={0.84} />
            <div style={{
              position: "absolute", left: "28%", top: "26%", transform: "translate(-50%,-50%)",
              textAlign: "center", whiteSpace: "nowrap",
            }}>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 1, color: V.amber,
                textShadow: `0 0 34px ${rgba(V.amber, 0.34)}, 0 6px 24px rgba(0,0,0,0.94)`,
              }}>187<span style={{ fontSize: 38, marginLeft: 9, opacity: 0.8 }}>$</span></div>
            </div>
            <div style={{
              position: "absolute", left: "28%", top: "41%", transform: "translate(-50%,-50%)",
              textAlign: "center", whiteSpace: "nowrap",
            }}>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 1, color: V.volt,
                textShadow: `0 0 34px ${rgba(V.volt, 0.3)}, 0 6px 24px rgba(0,0,0,0.94)`,
              }}>960<span style={{ fontSize: 38, marginLeft: 9, opacity: 0.8 }}>kWh</span></div>
            </div>
            {/* el cociente 0,19 — el precio que no existe en ningún renglón del recibo */}
            <div style={{
              position: "absolute", left: "28%", top: "55%", transform: "translate(-50%,-50%)",
              opacity: cocOn, textAlign: "center",
            }}>
              <div style={{ position: "relative", display: "inline-block", padding: "0 16px" }}>
                <div style={{
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 1,
                  color: rgba(V.white, 0.62), textShadow: "0 6px 24px rgba(0,0,0,0.94)",
                }}>0,19</div>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "50%", height: 6,
                  background: rgba(V.danger, 0.92), transform: `scaleX(${tachado.toFixed(3)})`,
                  transformOrigin: "0% 50%", boxShadow: `0 0 18px ${rgba(V.danger, 0.55)}`,
                }} />
              </div>
              <div style={{
                fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2.4, marginTop: 6,
                color: rgba(V.white, 0.5), textShadow: "0 3px 14px rgba(0,0,0,0.92)",
              }}>ESE PRECIO NO EXISTE</div>
            </div>
          </div>
        )}

        {/* LOS TRES PRECIOS DE LOS TRAMOS — el dato pegado a su peldaño */}
        <Precio x={ip(g, [470, 1010], [23.5, 21])} y={ip(g, [470, 1010], [70.5, 89])}
          valor="0,09" nombre="TRAMO BÁSICO" tint={rgba(V.white, 0.66)}
          on={ip(g, [502, 534, 930, 986], [0, 1, 1, 0])} lit={0.4} size={40} />
        <Precio x={ip(g, [590, 1010], [33, 30])} y={ip(g, [590, 1010], [57, 78])}
          valor="0,15" nombre="TRAMO MEDIO" tint={rgba(V.white, 0.78)}
          on={ip(g, [594, 626, 930, 986], [0, 1, 1, 0])} lit={0.55} size={44} />
        <Precio x={ip(g, [664, 1010, 1200], [42.5, 22, 20])} y={ip(g, [664, 1010, 1200], [43, 26, 22])}
          valor="0,26" nombre="EL DE ARRIBA" tint={V.amber}
          on={ip(g, [668, 700, 1216, 1248], [0, 1, 1, 0])} lit={1}
          size={ip(g, [664, 1010, 1200], [54, 78, 82])} />

        {/* EL CONTADOR DE kWh QUE SE VAN — nace en el acto 3 y CRUZA la oclusión al acto 4 */}
        {g >= 928 && g < 1590 && (
          <div style={{ opacity: kwhOn }}>
            <Cama x={kwhX} y={kwhY} w={kwhS * 4.6} h={kwhS * 2.6} a={0.8} />
            <Readout value={"−" + dinero(kwh, 0)} unit="kWh"
              label={g < 1500 ? "LO QUE SACAS AL MES" : undefined}
              at={L(932)} x={kwhX} y={kwhY} size={kwhS} color={V.volt} align="center" />
          </div>
        )}

        {/* LA MULTIPLICACIÓN 380 × 0,26 (acto 4) — y el resultado que se vuelve la columna */}
        {g >= 1292 && g < 1624 && (
          <div style={{ opacity: mulOn, position: "absolute", left: "63%", top: "44.5%", transform: "translate(-50%,-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: 2,
              color: rgba(V.white, 0.8), textShadow: "0 5px 22px rgba(0,0,0,0.94)",
            }}>
              380 <span style={{ color: rgba(V.white, 0.45) }}>×</span>{" "}
              <span style={{ color: V.amber }}>0,26</span>
            </div>
          </div>
        )}

        {/* LA CIFRA: 98,80 al mes → 1.185,60 al año (la misma cifra, contando) */}
        {g >= 1376 && (
          <div>
            <Cama x={cifraX} y={cifraY} w={cifraS * 5} h={cifraS * 2.6} a={0.82} />
            <Readout value={"$" + dinero(g < 1596 ? 98.8 : cifraAnual)}
              label={g < 1596 ? "CADA MES" : g < 1700 ? "×12" : "AL AÑO"}
              at={L(1380)} x={cifraX} y={cifraY} size={cifraS} color={V.amber} align="center" />
          </div>
        )}

        {/* LOS DOS RÓTULOS DE LAS PILAS — a alturas absurdamente distintas: eso ES el dato */}
        {g >= 1690 && (
          <>
            <Precio x={36} y={ip(g, [1690, 1760], [83, 78.6])}
              valor="$126" nombre="LO QUE GASTASTE" tint={V.volt}
              on={ip(g, [1690, 1726], [0, 1])} lit={0.9} size={54} />
            <Precio x={63.6} y={ip(g, [1704, 1800], [30, 22.6])}
              valor="$1.185" nombre="LO QUE TE AHORRAS AL AÑO" tint={V.amber}
              on={ip(g, [1704, 1742], [0, 1])} lit={1} size={62} />
          </>
        )}

        {/* ACTO 1 · EL PROMEDIO MIENTE */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "66%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.sky}>Tu factura dividida</Kick>
              <div style={{ height: 8 }} />
              <Head size={72}>EL PROMEDIO <Em color={V.danger}>MIENTE</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>La luz no se cobra a un solo precio</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · LOS DE ARRIBA SON LOS CAROS */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "11%", opacity: t2, transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)` }}>
            <Bed w={660} pad={24}>
              <Kick color={V.volt}>Viene por escalones</Kick>
              <div style={{ height: 8 }} />
              <Head size={64}>LOS DE ARRIBA SON <Em color={V.amber}>LOS CAROS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Cada tramo se cobra más que el anterior</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · VEINTISÉIS CENTAVOS */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "62%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>El escalón de arriba</Kick>
              <div style={{ height: 8 }} />
              <Head size={72}>VEINTISÉIS <Em color={V.amber}>CENTAVOS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Los kWh que sacas salen de <Em>ahí</Em>, nunca de abajo</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · NOVENTA Y OCHO CON OCHENTA */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "13%", opacity: t4, transform: `translateY(${((1 - t4) * -22).toFixed(1)}px)` }}>
            <Bed w={640} pad={24}>
              <Kick color={V.volt}>Trescientos ochenta kWh menos</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>NOVENTA Y OCHO <Em color={V.amber}>CON OCHENTA</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Cada mes, en la misma casa</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · MIL CIENTO OCHENTA Y CINCO CONTRA CIENTO VEINTISÉIS */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "5.5%", top: "8%", opacity: t5, transform: `translateY(${((1 - t5) * 24).toFixed(1)}px)` }}>
            <Bed w={620} pad={24}>
              <Kick color={V.amber}>Mira las dos alturas</Kick>
              <div style={{ height: 8 }} />
              <Head size={58}>MIL CIENTO OCHENTA Y CINCO CONTRA <Em color={V.volt}>CIENTO VEINTISÉIS</Em></Head>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta de cierre: la cocina se calienta por abajo y los bordes se apagan */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(130% 110% at 50% 48%, rgba(0,0,0,0) 52%, rgba(6,7,5,${(0.28 + 0.2 * ip(g, [1260, 1920], [0, 1])).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
