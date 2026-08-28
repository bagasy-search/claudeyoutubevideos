// MovTresNumeros.tsx — S5 · UN MOVIMIENTO CONTINUO de 66 s (1980 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 482,0.
//
// LA ESPINA: los DOS PRIMEROS de los tres números que van ANTES del panel. Uno: cuánto gasta tu casa
// por día (960 kWh del recibo ÷ 30 días = 32). Dos: cuánto de ese consumo cae mientras hay sol (sólo
// siete horas de las veinticuatro, y adentro de esas siete apenas el veintidós por ciento de la casa).
// Lo que sobra no se guarda: sale por el poste, se vende barato y se recompra caro cuando anochece.
//
// EL GRÁFICO QUE TIENE QUE QUEDAR GRABADO: el `SunField` — 24 celdas = 24 horas, sólo 9 a 16
// encendidas. Acá NO aparece y desaparece: NACE chiquito y tímido al pie del cuadro en el acto 2,
// CRECE a pantalla completa en el acto 3 (es el protagonista), BAJA con la cámara hasta la casa vacía
// en el acto 4 pintando de ámbar el 22 % que se consume adentro del sol, y termina en el acto 5 como
// una tira delgada de volt en la noche azul: la única luz viva del cuadro cuando ya no hay sol.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                          ║
// ╠════╦════════════════════════════════════════╦══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto         ║ SALE: encuadre + luz + objeto                ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: viene de MovSetecientos. ALTA y   ║ CÁM: z≈-72 y ya viajando a la derecha y hacia║
// ║ g0 ║ ABIERTA (z -40), panY +10, sin giro.   ║      abajo (panX creciendo, camDrop 10→4):   ║
// ║    ║ LUZ: ÁMBAR ABIERTO DE COCINA (keyFrom  ║      NO frena en la frontera, la atraviesa.  ║
// ║    ║ 0.62, int 0.86, tint ámbar).           ║ LUZ: keyFrom 0.62→0.54, el volt empieza a    ║
// ║    ║ MAT: LA HOJA RAYADA EN BLANCO sobre la ║      entrar por arriba (tint ámbar→volt 0.5).║
// ║    ║ mesa, y el bolígrafo azul escribiendo  ║ MAT: EL TRAZO AZUL del bolígrafo, que se     ║
// ║    ║ el título de los tres números.         ║      despega del papel y sale a la escena.   ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: z≈-72 con la misma inercia hacia  ║ CÁM: z≈+4 y SUBIENDO (camDrop 4→30→62): la   ║
// ║g360║ la derecha; el mundo entra por abajo.  ║      cámara ya está levantándose al cielo.   ║
// ║    ║ LUZ: ámbar de cocina con volt arriba.  ║ LUZ: keyFrom 0.54→0.40, int 0.95→1.05, el    ║
// ║    ║ MAT: EL TRAZO AZUL se endereza y se    ║      tint termina de virar al VOLT.          ║
// ║    ║ vuelve LA RAYA DE LA DIVISIÓN: arriba  ║ MAT: EL ANILLO VOLT del resultado (el aro    ║
// ║    ║ 960 kWh del recibo, abajo 30 días.     ║      que rodea al 32) empieza a abrirse.     ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: z≈+4 subiendo, misma curva.       ║ CÁM: z≈-56 y CAYENDO fuerte (camDrop 62→6,   ║
// ║g840║ LUZ: mediodía volt, keyFrom 0.40.      ║      rotateX +3.2→-2.4): baja del cielo.     ║
// ║    ║ MAT: EL ANILLO del 32, ya abierto, es  ║ LUZ: keyFrom 0.40→0.34, el ámbar vuelve por  ║
// ║    ║ EL ARCO DEL SOL sobre el tejado; el    ║      abajo (la casa que se está calentando). ║
// ║    ║ SunField crece a pantalla completa.    ║ MAT: LA TIRA DEL SUNFIELD, que baja con la   ║
// ║    ║                                        ║      cámara y NO se apaga en la frontera.    ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: z≈-56 cayendo, hereda la curva.   ║ CÁM: z≈-146, ya girada (ry -6,9) y quieta a  ║
// ║g1320║ LUZ: mediodía con ámbar de interior.  ║      media altura, con deriva viva.          ║
// ║    ║ MAT: la tira del SunField aterriza y   ║ LUZ: keyFrom 0.34→0.24, int 0.95→0.70, el    ║
// ║    ║ SE PINTA DE ÁMBAR en el 22 %; esas     ║      tint arranca el viaje al AZUL DE NOCHE. ║
// ║    ║ celdas ámbar alimentan el disco del    ║ MAT: EL ALERO DEL TEJADO (V.roof) cruzando   ║
// ║    ║ medidor, que gira para afuera.         ║      el cuadro pegado al lente.              ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 5  ║ CÁM: z≈-146, girando, media altura.    ║ CÁM: MEDIA, girada a la noche (z -180,       ║
// ║g1710║ LUZ: azul frío entrando, ámbar bajo.  ║      ry -8). Es el encuadre de MovEscalonTarifa║
// ║    ║ MAT: EL ALERO se vuelve EL TRAVESAÑO   ║ LUZ: NOCHE: azul frío de V.sky, int 0.50, y  ║
// ║    ║ del poste de la calle; dos flechas     ║      el volt del SunField como única luz viva║
// ║    ║ cruzadas: una sale, otra vuelve gorda. ║ MAT: LA NOCHE AZUL sobre el poste (y la tira ║
// ║    ║                                        ║      de volt esperando la factura).          ║
// ╚════╩════════════════════════════════════════╩══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, NINGUNA es un fundido y ninguna baja un opacity a 0:
//   g360   1→2  MATCH-MOVE   — la cámara sigue al bolígrafo. La ventana de la hoja NO se desmonta:
//                              viaja a la izquierda y baja, y la ventana del recibo (el medidor)
//                              entra desde la derecha con EL MISMO VECTOR de velocidad. El trazo
//                              azul de tinta se despega del papel y se endereza: se vuelve LA RAYA
//                              DE LA DIVISIÓN. Un solo objeto entrega y recibe.
//   g840   2→3  MATCH-SHAPE  — el ANILLO VOLT que rodea al 32 no se corta: crece de 224 px a 1560,
//                              se abre (los bordes lateral e inferior se van a alfa 0 mientras el
//                              superior se queda) y termina siendo EL ARCO DEL SOL sobre el tejado.
//                              El ícono del sol arranca a recorrerlo. La misma geometría, otro rol.
//   g1320  3→4  MATCH-MOVE   — la cámara no corta: acelera su caída (camDrop 62→6, rotateX +3.2 a
//                              -2.4) y el mundo cambia debajo — el tejado sale por arriba y el
//                              living entra por abajo con el mismo vector. La tira del SunField
//                              baja CON la cámara, sin apagarse, y se pinta de ámbar del otro lado.
//   g1710  4→5  OCLUSIÓN     — <SeamOcclude color={V.roof}>: el alero del tejado cruza pegado al
//                              lente. Detrás ya está el poste de la calle, de noche. El alero sale
//                              del otro lado convertido en el TRAVESAÑO del poste.
//
// ⛔ CONTRATO: sin Math.random / Date.now (todo sale de rnd(k) y de g) · sin backdrop-filter ·
// ⛔ sin position:fixed · una sola capa con filter:blur() · rutas de asset SÓLO literales y sólo las
// ⛔ de la ficha · ningún acto envuelto en <Sequence>: un solo reloj `g` para los 1980 cuadros.
// ⚠️ Los clips duran 153 cuadros (CLIP_FRAMES). Cada ventana lleva SIEMPRE su foto de base viva por
//    recorte animado, y el clip encima sólo en su ventana de arranque: el cuadro 0 del clip i2v ES
//    la foto, así que el relevo no se ve y nunca queda un clip congelado en pantalla.
// ⚠️ Todo componente del Stage que razona en frames LOCALES (`at`, `sheenAt`) se traduce con L().

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SunField, RoofPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1980;
const A2 = 360;
const A3 = 840;
const A4 = 1320;
const A5 = 1710;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── VENTANA — el marco de vidrio que RECORTA el material real. Es la primitiva del movimiento:
//    la misma ventana que fue la hoja en blanco se corre y sigue siendo la hoja escrita; la del
//    recibo entra con su vector; la del living crece hasta ser el cuadro entero.
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; radius?: number; lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    width: Math.max(10, w), height: Math.max(10, h),
    marginLeft: -Math.max(10, w) / 2, marginTop: -Math.max(10, h) / 2,
    transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`,
    borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
    border: `1px solid ${rgba(litColor, 0.30 * lit)}`,
    boxShadow: `0 ${Math.round(h * 0.15)}px ${Math.round(h * 0.24)}px ${rgba(V.ink0, 0.80)}, ` +
      `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
  }}>{children}</div>
);

// ── MATERIAL dentro de la Ventana: la FOTO siempre (con recorte animado, nunca queda quieta) y el
//    CLIP encima mientras dura de verdad. `k` es el zoom de recorte (≥1: la foto siempre cubre).
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
  const iw = Math.max(12, w * kk);
  const ih = Math.max(12, h * kk);
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

// ── RÓTULO al pie de una ventana (va DENTRO de la ventana, sobre su propia cama).
const PieVentana: React.FC<{ n?: string; texto: string; on: number; tint?: string }> = ({
  n, texto, on, tint = V.volt,
}) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      padding: "24px 14px 10px", opacity: clamp01(on),
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.92) 58%)",
      display: "flex", alignItems: "baseline", gap: 11,
    }}>
      {n && <span style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30, color: tint, lineHeight: 1 }}>{n}</span>}
      <span style={{
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.6,
        color: V.white, textTransform: "uppercase",
      }}>{texto}</span>
    </div>
  );
};

// ── EL ANILLO QUE SE VUELVE ARCO — la costura MATCH-SHAPE de la frontera 2.
//    `abre` 0 = anillo cerrado (rodea al 32) · 1 = sólo el borde de arriba (el arco del sol).
const Arco: React.FC<{
  x: number; y: number; d: number; thick: number; rot: number; abre: number;
  tint: string; on: number; dash?: number;
}> = ({ x, y, d, thick, rot, abre, tint, on, dash = 0 }) => {
  if (on <= 0.01 || d < 8) return null;
  const lado = rgba(tint, (0.62 * (1 - abre)) * on);
  const abajo = rgba(tint, (0.5 * (1 - abre) * (1 - abre)) * on);
  const arriba = rgba(tint, (0.30 + 0.62 * abre) * on);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2,
      borderRadius: "50%",
      borderStyle: dash > 0.5 ? "dashed" : "solid",
      borderWidth: Math.max(1, thick),
      borderTopColor: arriba, borderRightColor: lado, borderBottomColor: abajo, borderLeftColor: lado,
      transform: `rotate(${rot.toFixed(2)}deg)`,
      boxShadow: `0 0 ${Math.round(18 + 46 * abre)}px ${rgba(tint, 0.20 * on)}`,
      pointerEvents: "none",
    }} />
  );
};

// ── LA RAYA — el trazo azul del bolígrafo que se despega del papel y se vuelve la raya de dividir.
//    Es la materia que cruza la frontera 1. Un solo elemento, interpolado de punta a punta.
const Raya: React.FC<{
  x: number; y: number; w: number; h: number; rot: number; tint: string; on: number; brillo: number;
}> = ({ x, y, w, h, rot, tint, on, brillo }) => {
  if (on <= 0.01 || w < 2) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: Math.max(2, h), marginLeft: -w / 2, marginTop: -h / 2,
      borderRadius: h, opacity: clamp01(on),
      background: `linear-gradient(90deg, ${rgba(tint, 0.25)} 0%, ${rgba(tint, 1)} 14%, ${rgba(tint, 1)} 86%, ${rgba(tint, 0.25)} 100%)`,
      boxShadow: `0 0 ${Math.round(10 + 26 * brillo)}px ${rgba(tint, 0.42 * brillo)}, 0 3px 12px rgba(0,0,0,0.8)`,
      transform: `rotate(${rot.toFixed(2)}deg)`,
      pointerEvents: "none",
    }} />
  );
};

// ── LAS DOS FLECHAS DEL POSTE (acto 5). Esto SÍ es un gráfico: un vector con su punta, no un
//    objeto real disfrazado. La que sale es flaca y volt; la que vuelve es gorda y ámbar.
const FlechaBarra: React.FC<{
  x: number; y: number; largo: number; grosor: number; rot: number; tint: string;
  on: number; avance: number; haciaIzq?: boolean;
}> = ({ x, y, largo, grosor, rot, tint, on, avance, haciaIzq = false }) => {
  if (on <= 0.01) return null;
  const L2 = Math.max(6, largo * clamp01(avance));
  const punta = Math.max(8, grosor * 1.9);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: L2, height: grosor, marginTop: -grosor / 2,
      marginLeft: haciaIzq ? -L2 : 0,
      transform: `rotate(${rot.toFixed(2)}deg)`,
      transformOrigin: haciaIzq ? "100% 50%" : "0% 50%",
      opacity: clamp01(on), pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: grosor,
        background: `linear-gradient(${haciaIzq ? 270 : 90}deg, ${rgba(tint, 0.16)} 0%, ${rgba(tint, 0.92)} 74%, ${rgba(tint, 1)} 100%)`,
        boxShadow: `0 0 ${Math.round(grosor * 1.6)}px ${rgba(tint, 0.42)}`,
      }} />
      <div style={{
        position: "absolute", top: "50%", [haciaIzq ? "left" : "right"]: -punta * 0.72,
        marginTop: -punta, width: 0, height: 0,
        borderTop: `${punta}px solid transparent`,
        borderBottom: `${punta}px solid transparent`,
        [haciaIzq ? "borderRight" : "borderLeft"]: `${punta * 1.25}px solid ${rgba(tint, 1)}`,
        filter: `drop-shadow(0 0 ${Math.round(punta)}px ${rgba(tint, 0.45)})`,
      }} />
    </div>
  );
};

// ── CAMA RADIAL para las cifras: el número nunca se apoya en el aire sobre material real.
const CamaNum: React.FC<{ x: number; y: number; s: number; on?: number }> = ({ x, y, s, on = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    width: s * 4.4, height: s * 2.7, marginLeft: -s * 2.2, marginTop: -s * 1.35,
    background: "radial-gradient(closest-side, rgba(8,9,6,0.86), rgba(8,9,6,0))",
    opacity: clamp01(on), pointerEvents: "none",
  }} />
);

export const MovTresNumeros: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build monta el movimiento en UNA Sequence: el frame local no tiene por qué ser el global.
  const lFrame = useCurrentFrame();
  const off = (Number.isFinite(gFrame as number) ? (gFrame as number) : lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda un gFrame usable, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ════════════════════════════
  // Un solo viaje: entra ALTA Y ABIERTA (z -40) y sale MEDIA Y GIRADA A LA NOCHE (z -180, ry -8).
  // Adentro de cada acto sólo hay desviaciones LOCALES que se SUMAN a ese viaje.
  const camB = gcam(g, { z0: -40, z1: -180, panX: 16, panY: 0, ry: -8, rx: 1.6, dur: END });
  const camZx = ip(g,
    [0, 180, A2, 520, 700, A3, 1000, 1180, A4, 1460, 1620, A5, 1850, END],
    [0, -20, -34, -10, 28, 48, 16, -14, -46, -22, 8, 22, 6, 0]);
  // el eje vertical: sube al cielo en el acto 3 y CAE a la casa en la frontera 3 (match-move).
  const camDrop = ip(g,
    [0, A2, 620, A3, 1080, 1240, A4, 1420, 1560, A5, END],
    [10, 4, 30, 62, 66, 52, 6, -20, -28, -24, -20]);
  const camTilt = ip(g, [0, A2, A3, 1180, A4, 1480, END], [0, 0.4, 3.2, 3.0, -2.4, -3.2, -3.6]);
  const camT = `${camB.transform} translateZ(${camZx.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada al 42 % para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — ámbar abierto de cocina → mediodía volt → NOCHE azul fría ════════════════════
  const keyFrom = ip(g, [0, A2, 620, A3, 1180, A4, 1520, A5, END],
    [0.62, 0.54, 0.46, 0.40, 0.37, 0.34, 0.28, 0.24, 0.20]);
  const inten = ip(g, [0, 140, A2, 620, A3, 1100, A4, 1520, A5, 1860, END],
    [0.86, 0.92, 0.95, 1.00, 1.05, 1.06, 0.95, 0.80, 0.70, 0.56, 0.50]);
  const floor = ip(g, [0, A2, A3, A4, A5, END], [0.50, 0.52, 0.56, 0.62, 0.70, 0.78]);
  // dos tramos encadenados (en g=A4 los dos dan exactamente VOLT: la luz no salta)
  const tintA = g < A4
    ? light(ip(g, [0, 150, 640, A3], [0, 0.34, 0.82, 1]), "amber", "volt")
    : light(ip(g, [A4, 1520, A5, END], [0, 0.34, 0.66, 1]), "volt", "sky");
  const tintB = light(ip(g, [0, A3, A4, A5, END], [0, 0.16, 0.34, 0.72, 1]), "amber", "sky");

  // ══ FONDOS — se relevan por GEOMETRÍA (uno se va de cuadro, el otro ya está detrás) ═══════
  const bgHojaY = ipe(g, [700, 900], [0, -1460], Easing.out(Easing.cubic));   // la mesa sale por arriba
  const bgTejY = ipe(g, [1240, A4 + 96], [0, -1240], Easing.out(Easing.cubic)); // el tejado sale por arriba
  const bgCasaY = ipe(g, [1250, A4 + 96], [980, 0], Easing.out(Easing.cubic));  // el living entra por abajo
  const nocheYa = g >= A5 + 2;   // el relevo al poste ocurre BAJO la oclusión (cobertura total)

  // ══ ACTO 1-2 · LA HOJA — nace grande y centrada, se corre a la izquierda siguiendo al bolígrafo
  const kH = [0, 60, 150, 300, A2, 470, 620, A3, 900, 1000];
  const wH = ip(g, kH, [1180, 1160, 1080, 1000, 940, 700, 660, 620, 380, 300]);
  const hH = ip(g, kH, [664, 652, 608, 562, 528, 394, 372, 350, 214, 168]);
  const xH = ip(g, kH, [50, 49.4, 47, 43, 39, 27, 25.5, 24, 12, -16]);
  const yH = ip(g, kH, [47, 47, 47.5, 48, 49, 55, 57, 58, 68, 78]);
  const zH = ip(g, kH, [30, 28, 24, 18, 10, -30, -44, -60, -180, -300]);
  const ryH = ip(g, kH, [3.2, 2.6, 2.0, 1.2, 0.4, 7, 8, 9, 15, 19]);
  const rxH = ip(g, kH, [0, 0, 0, 0, 0, 3, 4, 5, 9, 12]);
  const litH = ip(g, kH, [0.55, 1, 1, 1, 1, 0.96, 0.92, 0.88, 0.5, 0.3]);
  const kbH = Math.max(1.05, ip(g, [0, 150, 300, A2, 470, A3, 1000],
    [1330, 1210, 1090, 1010, 760, 668, 330]) / Math.max(40, wH));
  const opH = ip(g, [0, 14], [0, 1]);
  // el clip de la mano escribiendo: dos ventanas vivas de menos de 148 cuadros, nunca congelado
  const vidH = Math.max(
    ip(g, [22, 150, 168], [1, 1, 0]),
    g < A2 ? 0 : ip(g, [372, 500, 518], [1, 1, 0]),
  );

  // ══ ACTO 2 · EL RECIBO — el medidor de la calle entra desde la derecha CON EL MISMO VECTOR ═
  const kR = [300, A2, 420, 520, 660, A3, 940, 1060];
  const wR = ip(g, kR, [520, 560, 600, 620, 610, 590, 360, 288]);
  const hR = ip(g, kR, [318, 342, 366, 378, 372, 360, 220, 176]);
  const xR = ip(g, kR, [126, 104, 82, 71, 70.5, 70, 92, 120]);
  const yR = ip(g, kR, [30, 32.5, 34.5, 35.5, 36, 36.5, 28, 22]);
  const zR = ip(g, kR, [-70, -46, -20, 10, 14, 12, -110, -220]);
  const ryR = ip(g, kR, [-16, -13, -10, -7, -6.4, -6, -13, -18]);
  const litR = ip(g, kR, [0.4, 0.72, 0.94, 1, 1, 0.96, 0.5, 0.28]);
  const kbR = Math.max(1.05, ip(g, [300, 420, 660, A3, 1060], [1.34, 1.26, 1.20, 1.18, 1.30]));
  const vidR = g < A2 ? 0 : ip(g, [396, 524, 542], [1, 1, 0]);

  // ══ EL TRAZO AZUL → LA RAYA DE LA DIVISIÓN (la materia que cruza la frontera 1) ═══════════
  const kY = [180, 250, 320, A2, 400, 460, 760, A3, 880];
  const rayaX = ip(g, kY, [41, 41.5, 42.5, 47, 55, 70, 70, 70, 70]);
  const rayaY = ip(g, kY, [52, 52.6, 53, 50, 45, 37.5, 37.5, 46, 55]);
  // se RETRAE a cero DENTRO del anillo: geometría, no un opacity que baja a 0 en la frontera
  const rayaW = ipe(g, [186, 268, 320, A2, 460, 800, 872],
    [0, 214, 236, 300, 336, 330, 0], Easing.out(Easing.cubic));
  const rayaH = ip(g, kY, [7, 7, 7, 7.6, 8.4, 9, 9, 9, 6]);
  const rayaRot = ip(g, kY, [-2.6, -2.2, -1.8, -1.1, -0.4, 0, 0, 0, 0]);
  const rayaOn = ip(g, [182, 200], [0, 1]);
  const rayaTint = light(ip(g, [300, 440], [0, 1]), "panel", "volt");
  const rayaBrillo = ip(g, [300, 460, 800], [0, 1, 0.7]);

  // ══ LAS CIFRAS DE LA DIVISIÓN — 960 kWh del recibo ÷ 30 días = 32 ═════════════════════════
  const kwhMes = Math.round(ip(g, [404, 424, 442, 462], [0, 640, 1020, 960]));
  const kwhOn = ip(g, [398, 416, 812, 848], [0, 1, 1, 0]);
  const diasOn = ip(g, [470, 496, 812, 848], [0, 1, 1, 0]);
  const treintaydos = ip(g, [520, 548, 572, 596], [0, 24, 36, 32]);
  const t32On = ip(g, [514, 534, 1000, 1044], [0, 1, 1, 0]);
  const t32X = ip(g, [514, A3, 900, 1010], [70, 70, 63, 55]);
  const t32Y = ip(g, [514, A3, 900, 1010], [55, 55, 22, 14]);
  const t32S = ip(g, [514, A3, 900, 1010], [148, 148, 92, 62]);

  // ══ EL ANILLO → EL ARCO DEL SOL (la costura MATCH-SHAPE de la frontera 2) ═════════════════
  const arcD = ipe(g, [560, 640, 780, A3, 940, 1180, A4, 1420],
    [300, 322, 344, 560, 1320, 1580, 1540, 1320], Easing.out(Easing.cubic));
  const arcX = ip(g, [560, A3, 940, 1180, A4, 1440], [70, 70, 62, 54, 50, 46]);
  const arcY = ip(g, [560, A3, 940, 1180, A4, 1440], [55, 55, 52, 58, 66, 88]);
  const arcAbre = ip(g, [700, 800, A3, 920], [0, 0.16, 0.6, 1]);
  const arcRot = ip(g, [560, A3, 1180, 1440], [0, -10, -3, 2]);
  const arcTh = ip(g, [560, A3, 960, 1300, 1440], [7, 8, 5, 4, 3]);
  const arcOn = ip(g, [552, 588, 1330, 1424], [0, 1, 1, 0]);

  // el SOL recorriendo el arco: de las 9 (izquierda) a las 16 (derecha), por arriba
  const solT = clamp01(ip(g, [A3 + 30, 1250], [0, 1]));
  const solAng = lerp(Math.PI * 0.96, Math.PI * 0.04, solT);
  const solX = arcX + ((Math.cos(solAng) * arcD) / 2 / 1920) * 100;
  const solY = arcY - ((Math.sin(solAng) * arcD) / 2 / 1080) * 100;
  const solOn = ip(g, [A3 + 14, A3 + 54, 1268, 1310], [0, 1, 1, 0]);
  const solSize = ip(g, [A3, 980, 1180, 1300], [96, 148, 138, 108]);

  // ══ EL SUNFIELD — LA FIRMA. Un solo gráfico que vive los cinco actos y se transforma ══════
  const sfW = ip(g, [548, 700, A3, 960, 1180, A4, 1480, A5, END], [700, 800, 1180, 1600, 1600, 1440, 1200, 1080, 1000]);
  const sfH = ip(g, [548, 700, A3, 960, 1180, A4, 1480, A5, END], [16, 22, 62, 126, 126, 92, 56, 42, 36]);
  const sfY = ip(g, [548, 700, A3, 960, 1180, A4, 1480, A5, END], [91, 89, 66, 47, 47, 57, 77, 84, 86]);
  const sfOn = ip(g, [540, 600, A3, 960, END], [0, 0.42, 0.82, 1, 1]);
  const sfUse = ip(g, [A4 - 30, 1372, 1470, END], [0, 0, 0.22, 0.22]);

  // ══ ACTO 4 · LA CASA VACÍA y EL MEDIDOR QUE GIRA PARA AFUERA ══════════════════════════════
  const kC = [1252, A4, 1400, 1520, 1660, A5, 1810];
  const wC = ip(g, kC, [1120, 1240, 1300, 1290, 1260, 1220, 840]);
  const hC = ip(g, kC, [630, 700, 734, 728, 712, 690, 474]);
  const xC = ip(g, kC, [52, 51, 50.5, 50, 49, 48, -22]);
  const yC = ip(g, kC, [96, 52, 46, 45.5, 45, 44.5, 24]);
  const zC = ip(g, kC, [-140, -70, -30, -18, -20, -30, -340]);
  const ryC = ip(g, kC, [-4, -2.6, -1.6, -1.2, -1.6, -2.4, -14]);
  const litC = ip(g, kC, [0.30, 0.82, 1, 1, 0.94, 0.84, 0.30]);
  const kbC = Math.max(1.05, ip(g, [1252, 1400, 1660, A5, 1810], [1.34, 1.24, 1.18, 1.20, 1.36]));

  const kM = [1372, 1430, 1520, 1660, A5, 1810];
  const wM = ip(g, kM, [300, 420, 452, 448, 430, 288]);
  const hM = ip(g, kM, [184, 258, 278, 276, 264, 176]);
  const xM = ip(g, kM, [96, 78.5, 77, 77, 78, 122]);
  const yM = ip(g, kM, [70, 68, 67.5, 67.5, 68.5, 78]);
  const zM = ip(g, kM, [-120, 60, 96, 92, 70, -300]);
  const ryM = ip(g, kM, [-18, -9, -7, -7, -9, -22]);
  const litM = ip(g, kM, [0.3, 0.9, 1, 1, 0.9, 0.3]);
  const vidM = g < 1400 ? 0 : ip(g, [1414, 1542, 1560], [1, 1, 0]);
  const veintidos = ip(g, [1462, 1500, 1536, 1566], [0, 15, 26, 22]);
  const v22On = ip(g, [1456, 1478, 1662, 1700], [0, 1, 1, 0]);

  // ══ ACTO 5 · EL POSTE, LAS DOS FLECHAS Y LA NOCHE ═════════════════════════════════════════
  const kP = [1690, A5, 1770, 1850, 1940, END];
  const wP = ip(g, kP, [820, 900, 1000, 1020, 1010, 1000]);
  const hP = ip(g, kP, [500, 548, 610, 622, 616, 610]);
  const xP = ip(g, kP, [64, 66, 68, 68.5, 68, 67.5]);
  const yP = ip(g, kP, [50, 49, 48, 47.5, 47.5, 48]);
  const zP = ip(g, kP, [-190, -110, -40, -14, -20, -30]);
  const ryP = ip(g, kP, [-16, -13, -10, -8.5, -8, -8]);
  const litP = ip(g, kP, [0.3, 0.62, 0.9, 1, 0.98, 0.94]);
  const kbP = Math.max(1.05, ip(g, [1690, 1850, END], [1.30, 1.18, 1.22]));
  const salidaAv = ipe(g, [1752, 1832], [0, 1], Easing.out(Easing.cubic));
  const vueltaAv = ipe(g, [1836, 1932], [0, 1], Easing.out(Easing.cubic));
  const flechasOn = ip(g, [1744, 1774], [0, 1]);
  // el travesaño: el alero del tejado sale del otro lado de la oclusión convertido en esto
  const travW = ipe(g, [A5 + 6, 1792], [0, 470], Easing.out(Easing.cubic));
  const travOn = ip(g, [A5 + 4, A5 + 26], [0, 1]);

  // ══ EL CONTADOR DE LOS TRES NÚMEROS — el hilo del video (dos de tres se cierran acá) ══════
  const pastilla = [
    ip(g, [600, 660], [0.14, 1]),
    ip(g, [1500, 1560], [0.14, 1]),
    0.14,
  ];
  const contOn = ip(g, [64, 116, 1900, 1962], [0, 1, 1, 0.4]);

  // ══ TEXTOS — UNA idea por acto, cada una viva mucho más que su piso de legibilidad ════════
  const t1 = ip(g, [72, 100, 316, 348], [0, 1, 1, 0]);        // acto 1 · LOS TRES NÚMEROS
  const t2 = ip(g, [430, 462, 792, 826], [0, 1, 1, 0]);       // acto 2 · TREINTA Y DOS POR DÍA
  const t3 = ip(g, [900, 934, 1270, 1304], [0, 1, 1, 0]);     // acto 3 · SOLO SIETE HORAS
  const t4 = ip(g, [1378, 1412, 1668, 1700], [0, 1, 1, 0]);   // acto 4 · VEINTIDÓS POR CIENTO
  const t5 = ip(g, [1748, 1786], [0, 1]);                     // acto 5 · SE VENDE BARATO…

  // el primer plano: el marco de la puerta de la cocina que cruza pegado al lente (acto 1-2)
  const jambaX = ip(g, [0, 300, 560], [-6, 14, 34]);
  const jambaOn = ip(g, [0, 40, 470, 560], [0.85, 0.85, 0.85, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · EL FONDO LEJANO. Los relevos son por GEOMETRÍA, nunca por opacity ------ */}
        {/* la mesa de la cocina (macro de la hoja) sale de cuadro por arriba en la frontera 2 */}
        {g < 920 && (
          <Plane z={-660} style={{ transform: `translateZ(-660px) translateY(${bgHojaY.toFixed(0)}px)` }}>
            <PhotoPlane src="img/cmeurgente/cmeu_hoja_blanco.jpg" kind="photo" z={0}
              scale={ip(g, [0, 700, 920], [1.52, 1.40, 1.36])}
              dim={ip(g, [0, 120, A2, 700], [0.60, 0.66, 0.70, 0.74])} tint={V.amber} />
          </Plane>
        )}
        {/* el tejado al mediodía: ya está DETRÁS antes de que la mesa se vaya */}
        {g >= 660 && g < A4 + 120 && (
          <Plane z={-700} style={{ transform: `translateZ(-700px) translateY(${bgTejY.toFixed(0)}px)` }}>
            <PhotoPlane src="img/cmeurgente/cmeu_tejado_sol.jpg" kind="photo" z={0}
              scale={ip(g, [660, A3, A4], [1.42, 1.30, 1.24])}
              dim={ip(g, [660, 780, A3, 1180, A4], [0.86, 0.64, 0.50, 0.52, 0.62])} tint={V.volt} />
          </Plane>
        )}
        {/* el living vacío entra por abajo con el mismo vector con el que sale el tejado */}
        {g >= 1250 && !nocheYa && (
          <Plane z={-680} style={{ transform: `translateZ(-680px) translateY(${bgCasaY.toFixed(0)}px)` }}>
            <PhotoPlane src="img/cmeurgente/cmeu_casa_vacia.jpg" kind="photo" z={0}
              scale={ip(g, [1250, A4, A5], [1.40, 1.30, 1.26])}
              dim={ip(g, [1250, A4, 1560, A5], [0.78, 0.64, 0.66, 0.74])} tint={V.amber} />
          </Plane>
        )}
        {/* LA NOCHE: el relevo al poste ocurre con el cuadro tapado al 100 % por el alero */}
        {nocheYa && (
          <Plane z={-700}>
            <PhotoPlane src="img/cmeurgente/cmeu_poste.jpg" kind="photo" z={0}
              scale={ip(g, [A5, END], [1.34, 1.24])}
              dim={ip(g, [A5, 1800, END], [0.80, 0.74, 0.78])} tint={V.sky} />
          </Plane>
        )}

        {/* PLANO 2 · EL AIRE: rejilla de profundidad, sólo mientras hay medición ------------ */}
        <Plane z={-460}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [A2, 520, 1180, 1440], [0, 0.24, 0.24, 0.04]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.09)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · EL TEJADO en perspectiva: el suelo del acto 3 (la firma RoofPlane) ----- */}
        {g >= 700 && g < A4 + 70 && (
          <Plane z={-190}>
            <RoofPlane
              y={ip(g, [700, A3, 1180, A4 + 70], [128, 78, 74, 118])}
              w={1480} h={340}
              rx={ip(g, [700, A3, A4 + 70], [66, 56, 66])}
              lit={ip(g, [700, 800, 1180, A4, A4 + 70], [0, 0.9, 1, 0.7, 0])}
              z={0}
              panels={ip(g, [700, A3, 1180, A4], [0.86, 0.80, 0.74, 0.70])} />
          </Plane>
        )}

        {/* PLANO 4 · LA HOJA — la ventana que abre el movimiento y NO se desmonta nunca ----- */}
        {g < 1010 && (
          <Plane z={0}>
            <Ventana x={xH} y={yH} w={wH} h={hH} z={zH} ry={ryH} rx={rxH}
              radius={g < A2 ? 14 : 10} lit={litH} litColor={V.amber} opacity={opH}>
              <Mat photo="img/cmeurgente/cmeu_hoja_blanco.jpg" clip="broll/cmeurgente/cmeu_hoja_escribe.mp4"
                vid={vidH} w={wH} h={hH} k={kbH}
                cx={50 + Math.sin(g / 250) * 3.2} cy={50 + Math.cos(g / 300) * 2.4}
                lit={litH} litColor={V.amber} sheenAt={L(30)} />
              <PieVentana n="1" texto="Lo que gasta tu casa" on={ip(g, [214, 244, 780, 812], [0, 1, 1, 0])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 5 · EL RECIBO DEL MES — entra desde la derecha con EL MISMO VECTOR --------- */}
        {g >= 296 && g < 1070 && (
          <Plane z={0}>
            <Ventana x={xR} y={yR} w={wR} h={hR} z={zR} ry={ryR} rx={2}
              radius={10} lit={litR} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_medidor_calle.jpg" clip="broll/cmeurgente/cmeu_medidor_mov.mp4"
                vid={vidR} w={wR} h={hR} k={kbR}
                cx={50 + Math.sin(g / 220) * 2.6} cy={50 + Math.cos(g / 270) * 2.0}
                lit={litR} litColor={V.amber} sheenAt={L(408)} />
              <PieVentana texto="El recibo del mes" on={ip(g, [396, 424, 800, 830], [0, 1, 1, 0])} tint={V.amber} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 6 · EL TEJADO EN MACRO (acto 3): el mismo material, otra escala y otra luz -- */}
        {g >= 902 && g < 1300 && (
          <Plane z={40}>
            <Ventana
              x={ip(g, [902, 1000, 1200, 1300], [-14, 17, 17.5, -16])}
              y={ip(g, [902, 1000, 1300], [72, 70, 68])}
              w={ip(g, [902, 1000, 1300], [330, 396, 380])}
              h={ip(g, [902, 1000, 1300], [206, 248, 238])}
              z={ip(g, [902, 1000, 1300], [-40, 40, 30])}
              ry={ip(g, [902, 1000, 1300], [16, 10, 9])} rx={4}
              radius={10} lit={ip(g, [902, 980, 1240, 1300], [0.3, 0.94, 0.94, 0.4])} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_tejado_sol.jpg" w={396} h={248} k={2.35}
                cx={34 + Math.sin(g / 200) * 2.4} cy={44} lit={0.94} litColor={V.volt} sheenAt={L(1008)} />
              <PieVentana texto="Nueve a cuatro" on={ip(g, [1004, 1032, 1244, 1274], [0, 1, 1, 0])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 7 · LA CASA VACÍA — entra por abajo en la frontera 3 y ocupa el cuadro ----- */}
        {g >= 1248 && g < 1820 && (
          <Plane z={0}>
            <Ventana x={xC} y={yC} w={wC} h={hC} z={zC} ry={ryC} rx={ip(g, [1248, A4, A5], [12, 3, 1])}
              radius={14} lit={litC} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_casa_vacia.jpg" w={wC} h={hC} k={kbC}
                cx={50 + Math.sin(g / 280) * 2.6} cy={50 + Math.cos(g / 330) * 2.0}
                lit={litC} litColor={V.amber} sheenAt={L(1396)} />
              {/* la luz del mediodía entrando por la ventana del living, sobre el material real */}
              <AbsoluteFill style={{
                background: `radial-gradient(58% 74% at 24% 8%, ${rgba(V.torch, 0.26 * ip(g, [A4, 1460, A5], [0, 0.9, 0.5]))} 0%, rgba(0,0,0,0) 62%)`,
              }} />
              <PieVentana texto="Mediodía · no hay nadie" on={ip(g, [1394, 1424, 1650, 1684], [0, 1, 1, 0])} tint={V.amber} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 8 · EL MEDIDOR GIRANDO PARA AFUERA (acto 4) -------------------------------- */}
        {g >= 1368 && g < 1820 && (
          <Plane z={0}>
            <Ventana x={xM} y={yM} w={wM} h={hM} z={zM} ry={ryM} rx={6}
              radius={10} lit={litM} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_medidor_calle.jpg" clip="broll/cmeurgente/cmeu_medidor_mov.mp4"
                vid={vidM} w={wM} h={hM} k={1.22}
                cx={50 + Math.sin(g / 190) * 2.2} cy={50} lit={litM} litColor={V.volt} sheenAt={L(1436)} />
              {/* el aro ámbar del 22 %: lo que el SunField pintó de ámbar termina acá */}
              <div style={{
                position: "absolute", left: "50%", top: "50%", width: 132, height: 132,
                marginLeft: -66, marginTop: -66, borderRadius: "50%",
                border: `4px solid ${rgba(V.amber, 0.16)}`,
                boxShadow: `inset 0 0 0 4px ${rgba(V.amber, 0.10 * ip(g, [1470, 1540], [0, 1]))}`,
                transform: `rotate(${(g * 1.6).toFixed(1)}deg)`,
                opacity: ip(g, [1462, 1500, 1660, 1696], [0, 1, 1, 0]),
                background: `conic-gradient(${rgba(V.amber, 0.72)} 0deg ${(ip(g, [1470, 1560], [0, 79])).toFixed(0)}deg, rgba(0,0,0,0) 0deg)`,
                WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,0) 56%, rgba(0,0,0,1) 58%)",
                maskImage: "radial-gradient(circle, rgba(0,0,0,0) 56%, rgba(0,0,0,1) 58%)",
              }} />
              <PieVentana texto="Se va para afuera" on={ip(g, [1548, 1578, 1656, 1690], [0, 1, 1, 0])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 9 · EL POSTE DE LA CALLE (acto 5) — entra ya montado bajo la oclusión ------ */}
        {g >= 1686 && (
          <Plane z={0}>
            <Ventana x={xP} y={yP} w={wP} h={hP} z={zP} ry={ryP} rx={ip(g, [1686, 1850], [7, 1])}
              radius={14} lit={litP} litColor={V.sky}>
              <Mat photo="img/cmeurgente/cmeu_poste.jpg" w={wP} h={hP} k={kbP}
                cx={50 + Math.sin(g / 260) * 2.2} cy={48 + Math.cos(g / 310) * 1.8}
                lit={litP} litColor={V.sky} sheenAt={L(1782)} />
              {/* la noche que cae sobre el material real: azul frío desde arriba */}
              <AbsoluteFill style={{
                background: `linear-gradient(184deg, ${rgba(V.sky, 0.30 * ip(g, [A5, 1880, END], [0.2, 0.9, 1]))} 0%, rgba(0,0,0,0) 64%)`,
              }} />
              <PieVentana texto="El poste de la calle" on={ip(g, [1790, 1820], [0, 1])} tint={V.sky} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 10 · PRIMER PLANO — algo pasa SIEMPRE por delante de la escena ------------- */}
        {/* la jamba de la puerta de la cocina, desenfocada, pegada al lente (única capa con blur) */}
        {g < 570 && (
          <Plane z={250}>
            <div style={{
              position: "absolute", top: "-14%", height: "128%",
              left: `${jambaX}%`, width: 190,
              background: `linear-gradient(90deg, rgba(6,7,5,0) 0%, ${rgba(V.ink1, 0.94)} 26%, ${rgba(V.ink0, 0.98)} 62%, rgba(6,7,5,0) 100%)`,
              filter: "blur(11px)", opacity: jambaOn, transform: "rotate(1.4deg)",
            }} />
          </Plane>
        )}
        {/* el sol pasando GRANDE por delante, casi contra el lente, en el pico del acto 3 */}
        {g >= 1150 && g < 1320 && (
          <Plane z={286}>
            <IconPng src="img/cmeurgente/cmeu_ic_sol.png"
              x={ip(g, [1150, 1320], [126, 26])} y={ip(g, [1150, 1236, 1320], [30, 22, 36])}
              size={ip(g, [1150, 1236, 1320], [230, 320, 250])} z={0}
              opacity={ip(g, [1150, 1186, 1276, 1318], [0, 0.5, 0.5, 0])}
              rot={ip(g, [1150, 1320], [-14, 10])} glow={V.ink0} />
          </Plane>
        )}
        {/* el cable del poste cruzando por delante en la noche */}
        {g >= 1770 && (
          <Plane z={240}>
            <div style={{
              position: "absolute", left: "-10%", width: "126%", height: 5,
              top: `${ip(g, [1770, END], [24, 27]).toFixed(1)}%`,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.94)} 12%, ${rgba(V.ink0, 0.96)} 88%, rgba(0,0,0,0) 100%)`,
              transform: `rotate(${ip(g, [1770, END], [-3.4, -2.6]).toFixed(2)}deg)`,
              opacity: ip(g, [1770, 1806], [0, 0.9]),
            }} />
            <div style={{
              position: "absolute", left: "-10%", width: "126%", height: 4,
              top: `${ip(g, [1770, END], [31, 33.6]).toFixed(1)}%`,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.9)} 14%, ${rgba(V.ink0, 0.92)} 86%, rgba(0,0,0,0) 100%)`,
              transform: `rotate(${ip(g, [1770, END], [-2.6, -2.0]).toFixed(2)}deg)`,
              opacity: ip(g, [1780, 1816], [0, 0.85]),
            }} />
          </Plane>
        )}

        {/* el aire frío de la noche: motas azules determinísticas (rnd, nunca Math.random) --- */}
        {g >= A5 && (
          <Plane z={150}>
            {Array.from({ length: 22 }, (_, i) => {
              const sp = 0.3 + rnd(i * 4.9) * 1.1;
              const yy = (rnd(i * 2.3) * 112 - ((g - A5) * sp) / 22) % 112;
              const sz = 2 + rnd(i * 7.1) * 3.4;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${(rnd(i * 8.7) * 100).toFixed(2)}%`,
                  top: `${((yy + 112) % 112 - 6).toFixed(2)}%`,
                  width: sz, height: sz, borderRadius: "50%",
                  background: rgba(V.sky, 0.16 + rnd(i * 5.5) * 0.24),
                  opacity: ip(g, [A5, A5 + 40], [0, 1]),
                }} />
              );
            })}
          </Plane>
        )}

        {/* PLANO 11 · ÍCONOS PNG como objetos de la escena (con su parallax) ---------------- */}
        {g >= 466 && g < 830 && (
          <Plane z={64}>
            <IconPng src="img/cmeurgente/cmeu_ic_calendario.png"
              x={ip(g, [466, 520, 830], [59, 56.5, 56])} y={ip(g, [466, 520], [46, 44.5])}
              size={ip(g, [466, 520], [58, 92])} z={0}
              opacity={ip(g, [466, 498, 798, 828], [0, 0.94, 0.94, 0])}
              rot={ip(g, [466, 830], [-9, 4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1416 && g < 1690 && (
          <Plane z={70}>
            <IconPng src="img/cmeurgente/cmeu_ic_casa.png"
              x={ip(g, [1416, 1470, 1690], [14, 16.5, 17])} y={ip(g, [1416, 1470], [36, 33])}
              size={ip(g, [1416, 1470], [70, 116])} z={0}
              opacity={ip(g, [1416, 1450, 1656, 1688], [0, 0.9, 0.9, 0])}
              rot={ip(g, [1416, 1690], [7, -3])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1840 && (
          <Plane z={72}>
            <IconPng src="img/cmeurgente/cmeu_ic_medidor.png"
              x={ip(g, [1840, 1900, END], [22, 24.5, 25])} y={ip(g, [1840, 1900], [72, 69])}
              size={ip(g, [1840, 1900], [64, 104])} z={0}
              opacity={ip(g, [1840, 1878], [0, 0.85])}
              rot={ip(g, [1840, END], [-8, 2])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ LA FIRMA · SUNFIELD — 24 celdas, sólo 9 a 16 encendidas ═══════════════════ */}
      {/* Un solo gráfico: nace tímido al pie (acto 2), es el cuadro entero (acto 3), baja con la */}
      {/* cámara y se pinta de ámbar en el 22 % (acto 4), y queda de noche como la única luz viva. */}
      <SunField sun={7 / 24} from={9} cells={24} use={sfUse} on={sfOn}
        tint={V.volt} night={V.sky} y={sfY} w={sfW} h={sfH} cycle={210} />
      {/* las horas rotuladas bajo la tira, sólo mientras la tira es el protagonista */}
      {g >= 930 && g < 1330 && (
        <div style={{
          position: "absolute", left: "50%", top: `${(sfY + (sfH / 1080) * 100 * 0.5 + 3.4).toFixed(2)}%`,
          width: sfW, marginLeft: -sfW / 2, display: "flex", justifyContent: "space-between",
          opacity: ip(g, [930, 966, 1288, 1326], [0, 0.8, 0.8, 0]),
          fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2.4,
          color: rgba(V.white, 0.62), textShadow: "0 3px 14px rgba(0,0,0,0.92)",
        }}>
          <span>0 H</span><span>9 H</span><span>16 H</span><span>24 H</span>
        </div>
      )}

      {/* ══════ COSTURA · FRONTERA 4 (g1710) — OCLUSIÓN: el alero del tejado cruza ════════ */}
      <SeamOcclude at={L(A5 - 8)} dur={20} color={V.roof} angle={11} lit={0.34} />

      {/* ══════ HUD — gráficos y texto en espacio de pantalla (deriva heredada de la cámara) */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* EL TRAZO AZUL → LA RAYA DE LA DIVISIÓN (la materia que cruza la frontera 1) */}
        <Raya x={rayaX} y={rayaY} w={rayaW} h={rayaH} rot={rayaRot}
          tint={rayaTint} on={rayaOn} brillo={rayaBrillo} />

        {/* EL ANILLO → EL ARCO DEL SOL (la materia que cruza la frontera 2) */}
        <Arco x={arcX} y={arcY} d={arcD} thick={arcTh} rot={arcRot}
          abre={arcAbre} tint={V.volt} on={arcOn} dash={g >= A3 + 120 ? 1 : 0} />

        {/* EL SOL recorriendo el arco de las 9 a las 16 */}
        {solOn > 0.01 && (
          <IconPng src="img/cmeurgente/cmeu_ic_sol.png" x={solX} y={solY}
            size={solSize} z={0} opacity={solOn}
            rot={ip(g, [A3, 1300], [-16, 12])} glow={V.volt} />
        )}

        {/* LA DIVISIÓN ESCRITA A MANO: 960 kWh del recibo, 30 días, y el 32 en volt */}
        {kwhOn > 0.01 && (
          <div style={{
            position: "absolute", left: "70%", top: "30.5%", transform: "translate(-50%,-50%)",
            opacity: kwhOn,
          }}>
            <Bed pad={18} w={352}>
              <Kick color={V.amber}>Del recibo</Kick>
              <div style={{ height: 4 }} />
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 84, lineHeight: 0.94, color: V.amber,
                textShadow: `0 0 30px ${rgba(V.amber, 0.34)}, 0 6px 24px rgba(0,0,0,0.92)`,
              }}>
                {kwhMes}<span style={{ fontSize: 30, marginLeft: 9, opacity: 0.84 }}>kWh</span>
              </div>
            </Bed>
          </div>
        )}
        {diasOn > 0.01 && (
          <div style={{
            position: "absolute", left: "70%", top: "44.5%", transform: "translate(-50%,-50%)",
            opacity: diasOn,
          }}>
            <Bed pad={16} w={300}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, lineHeight: 0.94, color: V.white,
                  textShadow: "0 6px 22px rgba(0,0,0,0.92)",
                }}>30</span>
                <span style={{
                  fontFamily: F_BODY, fontWeight: 700, fontSize: 26, letterSpacing: 2.6,
                  color: rgba(V.white, 0.74), textTransform: "uppercase",
                }}>días del mes</span>
              </div>
            </Bed>
          </div>
        )}

        {/* EL RESULTADO: 32 kWh por día — el primero de los tres números */}
        {t32On > 0.01 && (
          <div style={{ opacity: t32On }}>
            <CamaNum x={t32X} y={t32Y} s={t32S} />
            <Readout value={treintaydos.toFixed(0)} label="KWH POR DÍA"
              at={L(518)} x={t32X} y={t32Y} size={t32S} color={V.volt} align="center" />
          </div>
        )}

        {/* EL SEGUNDO NÚMERO: el 22 % que cae adentro del sol */}
        {v22On > 0.01 && (
          <div style={{ opacity: v22On }}>
            <CamaNum x={30} y={62} s={140} />
            <Readout value={veintidos.toFixed(0)} unit="%"
              label="DENTRO DEL SOL" at={L(1460)} x={30} y={62} size={140} color={V.amber} align="center" />
          </div>
        )}

        {/* EL TRAVESAÑO DEL POSTE — el alero sale del otro lado de la oclusión convertido en esto */}
        {travOn > 0.01 && (
          <div style={{
            position: "absolute", left: "68%", top: `${ip(g, [A5, 1860], [27, 25.5]).toFixed(1)}%`,
            width: travW, height: 13, marginLeft: -travW / 2, borderRadius: 3,
            background: `linear-gradient(180deg, ${rgba(V.roof, 0.94)} 0%, ${rgba(V.roof, 0.5)} 46%, ${rgba(V.ink0, 0.94)} 100%)`,
            boxShadow: `0 8px 26px ${rgba(V.ink0, 0.86)}, inset 0 1px 0 ${rgba(V.white, 0.2)}`,
            transform: `rotate(${ip(g, [A5, 1860], [-4.6, -3.2]).toFixed(2)}deg)`,
            opacity: travOn,
          }} />
        )}

        {/* LAS DOS FLECHAS DEL ACTO 5: una sale flaca y barata, la otra vuelve gorda y cara */}
        {flechasOn > 0.01 && (
          <>
            <FlechaBarra x={62} y={40} largo={430} grosor={11} rot={-13} tint={V.volt}
              on={flechasOn} avance={salidaAv} />
            <FlechaBarra x={62} y={58} largo={430} grosor={26} rot={11} tint={V.amber}
              on={flechasOn * ip(g, [1836, 1866], [0, 1])} avance={vueltaAv} haciaIzq />
            <div style={{
              position: "absolute", left: "80%", top: "31%", transform: "translate(-50%,-50%)",
              opacity: ip(g, [1800, 1832], [0, 1]),
            }}>
              <Bed pad={13} w={214}>
                <div style={{
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 2.2,
                  color: V.volt, textTransform: "uppercase",
                }}>Sale barato</div>
              </Bed>
            </div>
            <div style={{
              position: "absolute", left: "38%", top: "70%", transform: "translate(-50%,-50%)",
              opacity: ip(g, [1900, 1936], [0, 1]),
            }}>
              <Bed pad={13} w={236}>
                <div style={{
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 2.2,
                  color: V.amber, textTransform: "uppercase",
                }}>Vuelve caro</div>
              </Bed>
            </div>
          </>
        )}

        {/* EL CONTADOR DE LOS TRES NÚMEROS — el hilo que este movimiento avanza dos tercios */}
        <div style={{
          position: "absolute", left: "89%", top: "9%", transform: "translate(-50%,-50%)",
          opacity: contOn, textAlign: "center",
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.4,
            color: rgba(V.white, 0.8), textTransform: "uppercase",
            textShadow: "0 4px 18px rgba(0,0,0,0.92)",
          }}>Tres números</div>
          <div style={{ display: "flex", gap: 8, marginTop: 9, justifyContent: "center" }}>
            {pastilla.map((p, i) => (
              <div key={i} style={{
                width: 52, height: 7, borderRadius: 4,
                background: rgba(i === 1 ? V.amber : V.volt, 0.14 + 0.78 * p),
                boxShadow: p > 0.5 ? `0 0 14px ${rgba(i === 1 ? V.amber : V.volt, 0.5 * p)}` : "none",
              }} />
            ))}
          </div>
        </div>

        {/* ACTO 1 · LOS TRES NÚMEROS */}
        {t1 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "70%", opacity: t1,
            transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)`,
          }}>
            <Bed w={660} pad={24}>
              <Kick color={V.volt}>Antes de firmar nada</Kick>
              <div style={{ height: 6 }} />
              <Head size={72}>LOS TRES NÚMEROS</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Los mides <Em>tú</Em>, en una hoja, esta semana</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · TREINTA Y DOS POR DÍA */}
        {t2 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "13%", opacity: t2,
            transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)`,
          }}>
            <Bed w={636} pad={24}>
              <Kick color={V.volt}>Número uno</Kick>
              <div style={{ height: 6 }} />
              <Head size={70}>TREINTA Y DOS <Em>POR DÍA</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>El recibo dividido por los días del mes</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · SOLO SIETE HORAS */}
        {t3 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "72%", opacity: t3,
            transform: `translateY(${((1 - t3) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={700} pad={24}>
              <Kick color={V.volt}>Número dos</Kick>
              <div style={{ height: 6 }} />
              <Head size={72}>SOLO <Em>SIETE HORAS</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>El panel trabaja de nueve a cuatro. Nada más.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · VEINTIDÓS POR CIENTO */}
        {t4 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "14%", opacity: t4,
            transform: `translateY(${((1 - t4) * -24).toFixed(1)}px)`,
          }}>
            <Bed w={676} pad={24}>
              <Kick color={V.amber}>De todo lo que gastas</Kick>
              <div style={{ height: 6 }} />
              <Head size={72}>VEINTIDÓS <Em color={V.amber}>POR CIENTO</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Es lo que cae mientras hay sol. La casa está vacía.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · SE VENDE BARATO Y SE RECOMPRA CARO */}
        {t5 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "76%", opacity: t5,
            transform: `translateY(${((1 - t5) * 26).toFixed(1)}px)`,
          }}>
            <Bed w={716} pad={24}>
              <Kick color={V.sky}>El resto se va por el poste</Kick>
              <div style={{ height: 6 }} />
              <Head size={64}>SE VENDE <Em>BARATO</Em> Y SE RECOMPRA <Em color={V.amber}>CARO</Em></Head>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta de cierre: cae la noche y los bordes se apagan al azul frío */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at 50% 44%, rgba(0,0,0,0) 50%, ` +
          `${rgba(V.ink0, (0.30 + 0.30 * ip(g, [A4, A5, END], [0, 0.5, 1])))} 100%)`,
      }} />
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "soft-light",
        background: rgba(V.sky, 0.34 * ip(g, [A4, A5, 1900, END], [0, 0.35, 0.9, 1])),
      }} />
    </AbsoluteFill>
  );
};
