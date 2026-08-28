// MovArrendamiento.tsx — S9 · UN MOVIMIENTO CONTINUO de 64 s (1920 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 1152,0.
//
// LA ESPINA: el papel que dice CERO DÓLARES DE ENTRADA. El incentivo se lo lleva la empresa, la cuota
// sube todos los años, y cuando quieras vender la casa el comprador se da vuelta y se va.
// La trampa es LENTA, no violenta: nada de alarma. Todo se ve razonable hasta que sumás veinte años.
//
// ⚠️ En este tramo el avatar va EN BUCLE Y MUTEADO: NO hay fondo garantizado debajo. La atmósfera
//    (`VoltAtmos`, opaca, `V.ink0`) se monta en el frame 0 y NO se desmonta nunca: todo instante del
//    movimiento está cubierto a pantalla completa.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el SALE del acto N                   ║
// ╠════╦════════════════════════════════════════╦══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto         ║ SALE: encuadre + luz + objeto                ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: media y BAJA junto al tablero,    ║ CÁM: sigue bajando y entrando (z≈-174), ya   ║
// ║ g0 ║      z≈-200, panY -8 — hereda el       ║      derivando a la derecha: no frena.       ║
// ║    ║      encuadre de MovCableSuicida.      ║ LUZ: keyFrom 0.30→0.34, tintA volt con el    ║
// ║    ║ LUZ: VOLT SOBRIO (keyFrom 0.30, int    ║      ámbar del dinero empezando a entrar.    ║
// ║    ║      0.82) — se apagó el naranja.      ║ MAT: LA MONEDA. El cero impreso del contrato ║
// ║    ║ MAT: EL PAPEL DEL CONTRATO sobre la    ║      (anillo de tinta + interior de papel) ya ║
// ║    ║      mesa, con la palabra CERO grande   ║      dejó salir el disco: el 0 ES la moneda. ║
// ║    ║      y "veinte años" en letra chica.    ║      COSTURA → MATCH-SHAPE (g390)            ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: z≈-174 entrando, misma inercia.   ║ CÁM: la cámara SIGUE a la moneda y CAE con   ║
// ║g390║ LUZ: keyFrom 0.34, ámbar subiendo.     ║      ella (camDrop -6→-58, tilt -0.4→-3,2).  ║
// ║    ║ MAT: LA MONEDA, que se despega del     ║ LUZ: keyFrom 0.34→0.46, int 0.94→1.0.        ║
// ║    ║      tejado de la casa y cruza EN LA   ║ MAT: LA MONEDA en vuelo, ya acostándose      ║
// ║    ║      DIRECCIÓN EQUIVOCADA: del techo    ║      (rotateX 40°→72°): va a ser la tapa del ║
// ║    ║      hacia el papel de la empresa.      ║      PRIMER ESCALÓN. COSTURA → MATCH-MOVE    ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: cayendo, z≈-120, ya sobre el      ║ CÁM: SUBE con el papel (camDrop -58→-16) y   ║
// ║g840║      suelo de la escalera.             ║      el z se dispara hacia adelante.         ║
// ║    ║ LUZ: keyFrom 0.46, ámbar (el dinero).  ║ LUZ: keyFrom 0.46→0.54, tintA ámbar pleno.   ║
// ║    ║ MAT: LA MONEDA acostada = la tapa del  ║ MAT: EL CONTRATO se levanta del fondo, se    ║
// ║    ║      escalón 1. Detrás nacen los 20    ║      viene ENCIMA de la cámara y tapa el     ║
// ║    ║      escalones (3% por año: los        ║      cuadro llevándose la moneda.            ║
// ║    ║      primeros casi iguales).           ║      COSTURA → OCLUSIÓN `V.paper` (g1290)    ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: saliendo hacia atrás desde el     ║ CÁM: retrocediendo y bajando a la mesa       ║
// ║g1290║     papel (z≈-96), a la altura del    ║      (z≈-52, tilt -4,6).                     ║
// ║    ║      jardín del frente.                ║ LUZ: keyFrom 0.54→0.60: se abre la tarde.    ║
// ║    ║ LUZ: keyFrom 0.54, TARDE que se abre.  ║ MAT: EL CARTEL DE MADERA, que gira, se pone  ║
// ║    ║ MAT: EL CARTEL, que estaba EN BLANCO:  ║      vertical y se vuelve LA LÁMINA de la    ║
// ║    ║      las letras SE VENDE se estampan   ║      guía (las letras se van por abajo del   ║
// ║    ║      con el kit sobre `Bed`. La pareja ║      marco mientras entra la página).        ║
// ║    ║      pasa por delante y se va.         ║      COSTURA → MATCH-SHAPE (g1620)           ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 5  ║ CÁM: z≈-52 retrocediendo, bajando a    ║ CÁM: MEDIA, RETROCEDIENDO desde el cartel    ║
// ║g1620║     la mesa.                          ║      (z≈-60, panX +10) — el encuadre con el  ║
// ║    ║ LUZ: keyFrom 0.60, tarde abierta.      ║      que abre MovDosCaminos.                 ║
// ║    ║ MAT: LA LÁMINA de la guía (tabla de    ║ LUZ: TARDE ABIERTA (keyFrom 0.62, tintA      ║
// ║    ║      cable y fusible) apoyándose en la ║      ámbar, floor 0.44).                     ║
// ║    ║      mesa; la moneda vuelve, chica, y  ║ MAT: EL CARTEL DE MADERA de SE VENDE, otra   ║
// ║    ║      su flecha apunta a la CASA.       ║      vez en el jardín del fondo: es la       ║
// ║    ║                                        ║      materia que hereda MovDosCaminos.       ║
// ╚════╩════════════════════════════════════════╩══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido, ningún opacity a 0 para cambiar de acto:
//   g390  1→2  MATCH-SHAPE   — el CERO IMPRESO se vuelve LA MONEDA. Es la misma circunferencia: el
//                              anillo de tinta (borde de 20 px) adelgaza a 2,6 px y se vuelve el canto
//                              de la moneda, mientras el INTERIOR DE PAPEL del glifo BAJA como una
//                              persiana dentro del propio círculo y deja salir el metal. La forma
//                              nunca se corta, nunca hay un frame de negro.
//   g840  2→3  MATCH-MOVE    — la cámara no corta: sigue a la moneda en su caída (camDrop y camTilt
//                              aceleran desde g780) y el mundo cambia debajo — el tejado se hunde
//                              fuera de cuadro y la escalera de cuotas sube. La moneda cruza la
//                              frontera EN VUELO y aterriza acostada como la tapa del escalón 1.
//   g1290 3→4  OCLUSIÓN      — `SeamOcclude` con `V.paper` (lit por defecto). Lo motiva un objeto
//                              REAL: la MediaCard del contrato viene de z 40 a z 320 y de y 40 a
//                              y -34 pasando POR DELANTE de todo. Detrás ya está el jardín.
//   g1620 4→5  MATCH-SHAPE   — el CARTEL se vuelve LA LÁMINA: el mismo marco pasa de 760×470 tumbado
//                              a 386×520 vertical sobre la mesa; las letras SE VENDE se van deslizando
//                              por abajo del marco (recortadas, no desvanecidas) mientras la página
//                              de la guía ENTRA EMPUJANDO desde abajo dentro del mismo recorte.
//
// ⛔ CONTRATO: cero `Math` aleatorio y cero reloj de sistema (todo sale de `rnd(k)` y de gFrame) ·
// ⛔ ninguna `<Sequence>` envolviendo un acto · sin `position: fixed` · sin `filter: blur()` ·
// ⛔ rutas SOLO literales · imports sólo de react / remotion / VoltStage.
// ⚠️ Los componentes del Stage que reciben `at`/`sheenAt` razonan en frames LOCALES: se traducen con L().

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, RoofPlane, SunField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1920;
const A2 = 390;
const A3 = 840;
const A4 = 1290;
const A5 = 1620;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── MARCO: el vidrio que RECORTA el material. Es la primitiva del movimiento: el MISMO marco que fue
//    el cero impreso se vuelve la moneda, y el MISMO marco que fue el cartel se vuelve la lámina.
//    `round` a 50% lo convierte en disco sin cambiar de componente (eso ES el match-shape).
const Marco: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number | string;
  lit?: number; litColor?: string; opacity?: number; ring?: number; ringColor?: string;
  children: React.ReactNode;
}> = ({
  x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12,
  lit = 1, litColor = V.volt, opacity = 1, ring = 0, ringColor = V.volt, children,
}) => {
  const ww = Math.max(8, w);
  const hh = Math.max(8, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      boxShadow:
        `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.26)}px ${rgba(V.ink0, 0.8)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.66)}, ` +
        `inset 0 1px 0 ${rgba(V.white, 0.24 * lit)}` +
        (ring > 0.2 ? `, inset 0 0 0 ${ring.toFixed(1)}px ${ringColor}` : `, inset 0 0 0 1px ${rgba(litColor, 0.3 * lit)}`),
    }}>{children}</div>
  );
};

// ── MATERIAL dentro del Marco: la FOTO BASE siempre viva (recorte animado) y, encima, el relevo —
//    el clip mientras dura de verdad, o la página de la guía ENTRANDO EMPUJADA desde abajo.
const Mat: React.FC<{
  photo: string; w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.04, k);
  return (
    <MediaCard src={photo} kind="photo" w={Math.max(12, w * kk)} h={Math.max(12, h * kk)}
      x={cx} y={cy} z={0} radius={0} lit={lit} litColor={litColor} sheenAt={sheenAt} />
  );
};

// ── EL ESCALÓN DE LA CUOTA: esto SÍ es un gráfico (una barra), no un objeto real disfrazado.
//    Veinte escalones que suben 3% por año, ACUMULATIVO: los primeros casi iguales, el último 75% más
//    alto. La lectura tiene que ser "no pasó nada… y de golpe pasó todo".
const Escalon: React.FC<{
  i: number; g: number; leftPx: number; pitch: number; wPx: number; basePct: number; kAlto: number;
}> = ({ i, g, leftPx, pitch, wPx, basePct, kAlto }) => {
  const alto = 160 * Math.pow(1.03, i) * kAlto;
  const nace = 900 + i * 11;
  const sube = ipe(g, [nace, nace + 22], [0, 1], Easing.out(Easing.cubic));
  if (sube <= 0.001) return null;
  const ultimo = i === 19;
  const h = Math.max(2, alto * sube);
  const baseY = (basePct / 100) * 1080;
  const tint = V.amber;                       // la cuota es DINERO: siempre ámbar, nunca el azul panel
  const brillo = ultimo ? 0.42 + 0.34 * (0.5 + 0.5 * Math.sin(g / 11)) : 0.2;
  return (
    <div style={{
      position: "absolute", left: leftPx + i * pitch, top: baseY - h, width: wPx, height: h,
      borderRadius: 2,
      background: `linear-gradient(180deg, ${rgba(tint, ultimo ? 0.66 : 0.36)} 0%, ${rgba(tint, 0.07)} 100%)`,
      borderTop: `3px solid ${rgba(tint, ultimo ? 1 : 0.66)}`,
      boxShadow: `0 0 ${Math.round(10 + 40 * brillo)}px ${rgba(tint, 0.24 + 0.3 * brillo)}`,
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.18, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 11px)",
      }} />
    </div>
  );
};

export const MovArrendamiento: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El movimiento se monta con UNA sola Sequence: el frame LOCAL puede no ser el global.
  const lFrame = useCurrentFrame();
  const off = (Number.isFinite(gFrame) ? (gFrame as number) : lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda un gFrame usable, arranco en la cabecera del acto pedido.
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame) ? (gFrame as number) : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ═══════════════════════════
  // Entra en z -200 (media y baja, junto al tablero) y sale en z -60 (media, retrocediendo).
  // El viaje base es un solo empuje suave; encima va UN track aditivo que entra con la moneda,
  // cae con ella a la escalera, sube con el papel y se retira en el jardín.
  const camB = gcam(g, { z0: -200, z1: -60, panX: 10, panY: -8, ry: -3.2, rx: 1.1, dur: END });
  const camZ = ip(g,
    [0, 130, 300, 390, 520, 700, 840, 980, 1140, 1240, 1290, 1400, 1540, 1620, 1780, 1920],
    [0, 12, 26, 34, 22, 46, 30, 58, 84, 96, 42, 12, -6, -18, -12, 0]);
  const camDrop = ip(g, [0, 300, 390, 640, 780, 840, 1000, 1180, 1290, 1420, 1620, 1780, 1920],
    [0, -3, -6, -14, -30, -58, -66, -70, -16, -26, -38, -44, -46]);
  const camTilt = ip(g, [0, 300, 390, 700, 840, 1120, 1240, 1290, 1440, 1620, 1920],
    [0, -0.2, -0.4, -1.6, -3.2, -3.6, -3.0, -1.2, -2.4, -3.8, -4.6]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada (a escala) para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — volt sobrio del tablero → el ámbar del dinero → la TARDE ABIERTA del cierre ══
  const keyFrom = ip(g, [0, 300, 390, 840, 1180, 1290, 1460, 1620, 1920],
    [0.30, 0.32, 0.34, 0.46, 0.50, 0.54, 0.57, 0.60, 0.62]);
  const inten = ip(g, [0, 160, 390, 700, 840, 1240, 1290, 1500, 1760, 1920],
    [0.82, 0.90, 0.94, 1.00, 1.00, 0.96, 0.88, 0.96, 1.00, 1.00]);
  const floor = ip(g, [0, 390, 840, 1290, 1620, 1920], [0.62, 0.62, 0.60, 0.54, 0.48, 0.44]);
  const tintA = light(ip(g, [0, 300, 700, 1180, 1620, 1920], [0.04, 0.16, 0.58, 0.86, 0.96, 1]), "volt", "amber");
  const tintB = light(ip(g, [0, 390, 900, 1290, 1620, 1920], [0.05, 0.22, 0.40, 0.72, 0.92, 1]), "sky", "amber");

  // ══ EL PAPEL DEL CONTRATO — nace en la mesa, se va a la derecha como el papel de la EMPRESA,
  //    y en g1240 se viene ENCIMA de la cámara: es la materia que hace la oclusión de la frontera 3.
  const kK = [0, 130, 300, 390, 470, 620, 800, 900, 1180, 1240, 1290, 1330];
  const ctW = ip(g, kK, [1080, 1062, 1020, 980, 862, 704, 620, 566, 522, 640, 900, 1180]);
  const ctH = ip(g, kK, [640, 630, 606, 582, 512, 418, 372, 340, 314, 384, 540, 708]);
  const ctX = ip(g, kK, [50, 49.6, 48.6, 47.5, 56, 72, 79, 79, 79, 74, 62, 52]);
  const ctY = ip(g, kK, [54, 53.4, 52.4, 51.6, 46, 36, 32, 44, 50, 40, 12, -34]);
  const ctZ = ip(g, kK, [-40, -34, -26, -18, -60, -140, -180, -180, -170, 40, 250, 320]);
  const ctRX = ip(g, kK, [16, 15, 13, 11, 6, 0, -2, 4, 8, 12, 18, 24]);
  const ctRY = ip(g, kK, [-3, -3, -3, -3, -7, -12, -14, -12, -10, -6, -2, 0]);
  const ctLit = ip(g, kK, [0.88, 1, 1, 1, 0.92, 0.74, 0.64, 0.72, 0.80, 0.92, 1, 1]);
  // el recorte: en el acto 3 el papel se lee EN MACRO (la letra chica), no en plano general
  const ctK = Math.max(1.05, ip(g, [0, 300, 470, 800, 900, 1180, 1240, 1330],
    [1210, 1160, 1010, 780, 1180, 1240, 900, 1330]) / Math.max(60, ctW));

  // ══ LA MONEDA — el objeto que cruza DOS fronteras: es el cero impreso, después el incentivo que
  //    se va en la dirección equivocada, y por último la tapa del primer escalón.
  const kC = [130, 300, 318, 390, 438, 470, 560, 640, 720, 800, 840, 872, 900, 1240, 1276, 1310, 1340];
  const cX = ip(g, kC, [36, 36, 36, 35, 32.5, 30, 38, 53, 66, 77, 74, 52, 24, 24, 24, 22, 21]);
  const cY = ip(g, kC, [46, 46, 46, 47, 51, 60, 50, 44, 40, 40, 44, 62, 79, 79, 79, 34, -18]);
  const cD = ip(g, kC, [132, 132, 136, 178, 244, 300, 320, 330, 320, 300, 286, 250, 210, 210, 208, 186, 170]);
  const cZ = ip(g, kC, [-20, -16, -12, 30, 108, 150, 200, 214, 190, 120, 96, 80, 46, 46, 46, 200, 300]);
  const cRX = ip(g, kC, [0, 0, 0, 4, 12, 16, 8, 0, 10, 26, 40, 58, 72, 72, 72, 40, 10]);
  const cRot = ip(g, kC, [0, 0, -1, -6, -18, -26, -46, -70, -96, -122, -134, -150, -162, -164, -165, -190, -206]);
  const cLit = ip(g, kC, [0.10, 0.11, 0.14, 0.46, 0.82, 1, 1, 1, 1, 1, 1, 0.96, 0.9, 0.9, 0.9, 0.8, 0.6]);
  // el ANILLO: el trazo de tinta del cero impreso que adelgaza hasta ser el canto del metal
  const ringW = ip(g, [130, 300, 340, 400, 452], [20, 20, 13, 5, 2.6]);
  const ringCol = light(ip(g, [300, 340, 452], [0, 0.4, 1]), "ink2", "amber");
  // la PERSIANA DE PAPEL: el interior del glifo baja dentro del propio círculo y deja salir el metal
  const paperY = ip(g, [300, 318, 438], [0, 0, 118]);
  // "CER": las tres letras impresas que, con el anillo, forman la palabra CERO sobre el contrato
  const cerOn = ip(g, [150, 190, 330, 404], [0, 1, 1, 0]);
  const cerX = cX - (1.4 * cD) / 19.2;

  // ══ EL TEJADO DEL FOLLETO — lleno de azul (panels=1). Sube en el acto 2 y se HUNDE en la frontera
  //    2 mientras la cámara sigue a la moneda: el mundo cambia debajo, la cámara no corta.
  const roofY = ip(g, [360, 470, 620, 780, 880], [116, 82, 78, 92, 124]);
  const roofLit = ip(g, [360, 470, 780, 880], [0, 0.9, 0.86, 0.2]);

  // ══ LA ESCALERA DE LAS CUOTAS — veinte escalones, 3% por año, ACUMULATIVO ════════════════
  const escBase = ip(g, [880, 960, 1240], [92, 86, 85]);
  const escK = ip(g, [880, 980, 1200, 1290], [0.9, 1, 1, 1.02]);
  const escOn = g >= 896 && g < 1300;
  const escLeft = 372;
  const escPitch = 46;
  const escW = 40;
  const pct20 = Math.round((Math.pow(1.03, 19) - 1) * 100);

  // ══ EL CARTEL DE SE VENDE — nace escondido detrás del papel que ocluye, y en g1620 se vuelve la
  //    lámina de la guía SIN cortar el marco (mismo componente, otra geometría, otro material).
  const kS = [1250, 1302, 1340, 1420, 1560, 1600, 1620, 1660, 1760, 1920];
  const sW = ip(g, kS, [300, 600, 760, 780, 770, 700, 560, 386, 358, 350]);
  const sH = ip(g, kS, [190, 380, 470, 482, 476, 470, 480, 520, 500, 496]);
  const sX = ip(g, kS, [52, 52, 52, 49, 47, 46, 45, 44, 46, 47]);
  const sY = ip(g, kS, [50, 50, 50, 50, 50.5, 51, 52, 55, 57, 58]);
  const sZ = ip(g, kS, [-40, -20, 0, 10, 14, 20, 30, 40, 30, 20]);
  const sRX = ip(g, kS, [2, 3, 4, 4, 4, 5, 8, 15, 21, 24]);
  const sRY = ip(g, kS, [-4, -5, -6, -7, -7, -8, -9, -10, -9, -9]);
  const sLit = ip(g, kS, [0.4, 0.8, 1, 1, 1, 1, 1, 1, 0.98, 0.96]);
  // relevo de material dentro del MISMO recorte: clip del viento → página de la guía empujando
  const vientoOn = g < 1300 ? 0 : ip(g, [1300, 1330, 1552, 1584], [0, 1, 1, 0]);
  const lamOn = ip(g, [1600, 1656], [0, 1]);
  const lamPush = ip(g, [1600, 1656], [78, 50]);
  // las letras SE VENDE: el cartel viene EN BLANCO, se estampan con el kit y se van deslizando ABAJO
  const letrasOn = ip(g, [1326, 1352], [0, 1]);
  const letrasPop = ipe(g, [1326, 1358], [1.22, 1], Easing.out(Easing.cubic));
  const letrasY = ip(g, [1590, 1642], [43, 132]);
  const letrasSize = Math.max(48, Math.min(64, sW * 0.082));

  // ══ LA PAREJA que mira, se da vuelta y se va (pasa POR DELANTE) ═══════════════════════════
  const kP = [1396, 1450, 1520, 1600, 1680];
  const pX = ip(g, kP, [96, 80, 84, 92, 101]);
  const pY = ip(g, kP, [56, 54, 52, 50, 48]);
  const pW = ip(g, kP, [340, 424, 402, 360, 330]);
  const pH = ip(g, kP, [220, 274, 260, 234, 214]);
  const pZ = ip(g, kP, [140, 172, 122, 60, 20]);
  const pLit = ip(g, kP, [0.45, 1, 0.92, 0.7, 0.5]);

  // ══ EL CIERRE — la mesa, la segunda lámina, la moneda que VUELVE hacia la casa ════════════
  const mesaY = ip(g, [1600, 1760, 1920], [104, 90, 87]);
  const mesaLit = ip(g, [1600, 1760, 1920], [0, 0.72, 0.92]);
  const lam2Y = ipe(g, [1690, 1790], [116, 66], Easing.out(Easing.cubic));
  const volverOn = ip(g, [1700, 1748], [0, 1]);
  const volverX = ip(g, [1700, 1830, 1920], [76, 69, 68]);

  // ══ TEXTOS — UNA idea por acto, siempre sobre Bed, titular ≥48 px ═════════════════════════
  const t1 = ip(g, [70, 96, 322, 348], [0, 1, 1, 0]);       // CERO DÓLARES DE ENTRADA
  const tChica = ip(g, [200, 232, 344, 372], [0, 1, 1, 0]); // la letra chica: VEINTE AÑOS
  const t2 = ip(g, [464, 492, 786, 812], [0, 1, 1, 0]);     // EL INCENTIVO SE VA
  const t3 = ip(g, [900, 930, 1210, 1236], [0, 1, 1, 0]);   // TRES POR CIENTO POR AÑO
  const t4 = ip(g, [1332, 1360, 1562, 1588], [0, 1, 1, 0]); // CUANDO QUIERAS VENDER
  const t5 = ip(g, [1698, 1730], [0, 1]);                   // BUSCA QUIEN SE QUEDA CON EL INCENTIVO

  // el fondo cambia DURO debajo de la oclusión de papel: nadie ve el cambio
  const jardin = g >= 1289;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez, cubre a pantalla completa y sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio bajo UNA sola cámara ═══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano: la pared de papel del contrato → el jardín del frente --- */}
        {!jardin && (
          <PhotoPlane src="img/cmeurgente/cmeu_contrato.jpg" kind="photo" z={-660}
            scale={ip(g, [0, 1289], [1.32, 1.20])}
            dim={ip(g, [0, 390, 840, 1289], [0.60, 0.66, 0.74, 0.78])} tint={V.volt} />
        )}
        {jardin && (
          <PhotoPlane src="img/cmeurgente/cmeu_seVende.jpg" kind="photo" z={-660}
            scale={ip(g, [1289, 1920], [1.34, 1.20])}
            dim={ip(g, [1289, 1620, 1920], [0.74, 0.62, 0.54])} tint={V.amber} />
        )}

        {/* PLANO 2 · el aire de la oficina: rejilla de profundidad que se apaga con la tarde ---- */}
        <Plane z={-450}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [60, 240, 1180, 1420], [0, 0.24, 0.24, 0.04]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.09)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · EL TEJADO DEL FOLLETO — lleno de azul: de acá se despega el incentivo ----- */}
        {g >= 356 && g < 890 && (
          <Plane z={-190}>
            <div style={{ position: "absolute", inset: 0, transform: "translateX(-330px)" }}>
              <RoofPlane y={roofY} w={880} h={250} rx={54} lit={roofLit} z={0} panels={1} />
            </div>
          </Plane>
        )}

        {/* PLANO 4 · LA MESA — sube al cuadro con la cámara y sostiene la lámina del cierre --- */}
        {g >= 1596 && (
          <PadPlane y={mesaY} w={1680} h={380} rx={64} lit={mesaLit} z={-160} />
        )}

        {/* PLANO 5 · LA ESCALERA DE LAS CUOTAS — el gráfico del 3% acumulado ------------------ */}
        {escOn && (
          <Plane z={-40} style={{ opacity: ip(g, [896, 926, 1258, 1292], [0, 1, 1, 0.2]) }}>
            {/* la línea del AÑO 1: la referencia contra la que se mide todo lo que se acumula */}
            <div style={{
              position: "absolute", left: escLeft - 40, top: (escBase / 100) * 1080 - 160 * escK,
              width: 20 * escPitch + 80, height: 2,
              background: `repeating-linear-gradient(90deg, ${rgba(V.white, 0.34)} 0 12px, rgba(0,0,0,0) 12px 24px)`,
              opacity: ip(g, [930, 966], [0, 1]),
            }} />
            {Array.from({ length: 20 }, (_, i) => (
              <Escalon key={i} i={i} g={g} leftPx={escLeft} pitch={escPitch} wPx={escW}
                basePct={escBase} kAlto={escK} />
            ))}
            {/* el piso del gráfico */}
            <div style={{
              position: "absolute", left: escLeft - 60, top: (escBase / 100) * 1080, height: 2,
              width: 20 * escPitch + 120,
              background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.white, 0.28)}, rgba(0,0,0,0))`,
            }} />
            {/* los dos rótulos del eje: dónde empieza y dónde termina el contrato */}
            <div style={{
              position: "absolute", left: escLeft - 26, top: (escBase / 100) * 1080 + 16, width: 120,
              fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2.2,
              color: rgba(V.white, 0.5), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
              opacity: ip(g, [930, 962], [0, 1]),
            }}>AÑO 1</div>
            <div style={{
              position: "absolute", left: escLeft + 19 * escPitch - 34, top: (escBase / 100) * 1080 + 16, width: 130,
              fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2.2,
              color: rgba(V.amber, 0.9), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
              opacity: ip(g, [1104, 1136], [0, 1]),
            }}>AÑO 20</div>
          </Plane>
        )}

        {/* PLANO 6 · EL PAPEL DEL CONTRATO — el objeto del acto 1, el papel de la empresa en el
            acto 2, la letra chica en el acto 3, y la MATERIA que ocluye en la frontera 3 ------- */}
        {g < 1336 && (
          <Plane z={0}>
            <Marco x={ctX} y={ctY} w={ctW} h={ctH} z={ctZ} ry={ctRY} rx={ctRX}
              radius={g < 470 ? 10 : 8} lit={ctLit} litColor={g < 900 ? V.paper : V.amber}>
              <Mat photo="img/cmeurgente/cmeu_contrato.jpg" w={ctW} h={ctH} k={ctK}
                cx={50 + Math.sin(g / 250) * 3.0} cy={48 + Math.cos(g / 296) * 2.4}
                lit={ctLit} litColor={g < 900 ? V.paper : V.amber} sheenAt={L(206)} />

              {/* LA LETRA CHICA: las líneas que nadie lee, y la única que importa subrayada */}
              {g >= 190 && g < 470 && (
                <div style={{
                  position: "absolute", left: "8%", right: "40%", bottom: "9%",
                  opacity: ip(g, [190, 224, 430, 466], [0, 1, 1, 0]),
                }}>
                  {[0, 1, 2, 3, 4].map((r) => (
                    <div key={r} style={{
                      height: 4, marginBottom: 9, borderRadius: 2,
                      width: `${(56 + rnd(r * 3.7) * 40).toFixed(1)}%`,
                      background: rgba(V.ink0, 0.5 + rnd(r * 5.1) * 0.2),
                    }} />
                  ))}
                  <div style={{
                    height: 5, borderRadius: 3, background: rgba(V.amber, 0.92),
                    width: `${(46 * ip(g, [244, 292], [0, 1])).toFixed(1)}%`,
                    boxShadow: `0 0 16px ${rgba(V.amber, 0.55)}`,
                  }} />
                </div>
              )}
            </Marco>
          </Plane>
        )}

        {/* PLANO 7 · "CER" — las tres letras impresas que, con el anillo, forman la palabra CERO */}
        {cerOn > 0.01 && (
          <Plane z={-14}>
            <div style={{
              position: "absolute", left: `${cerX}%`, top: `${cY}%`,
              transform: `translate(-50%,-50%) rotateX(${ctRX.toFixed(2)}deg) rotateY(${ctRY.toFixed(2)}deg)`,
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(cD * 1.06), lineHeight: 0.82,
              letterSpacing: -3, color: rgba(V.ink0, 0.86 * cerOn),
              textShadow: `0 1px 0 ${rgba(V.white, 0.14 * cerOn)}`,
            }}>CER</div>
          </Plane>
        )}

        {/* PLANO 8 · LA MONEDA — el cero impreso → el incentivo que se va → la tapa del escalón 1.
            El MISMO disco cruza las dos primeras fronteras. Pasa POR DELANTE en el apogeo (z 214). */}
        {g >= 126 && g < 1340 && (
          <Plane z={0}>
            <Marco x={cX} y={cY} w={cD} h={cD} z={cZ} rx={cRX} rot={cRot}
              radius="50%" lit={cLit} litColor={V.amber} ring={ringW} ringColor={ringCol}>
              <Mat photo="img/cmeurgente/cmeu_moneda.jpg" w={cD} h={cD} k={1.6}
                cx={50 + Math.sin(g / 210) * 2.4} cy={50 + Math.cos(g / 244) * 2.0}
                lit={cLit} litColor={V.amber} sheenAt={L(466)} />
              {/* la persiana de papel: el interior del glifo BAJA y deja salir el metal */}
              {paperY < 116 && (
                <div style={{
                  position: "absolute", left: "-6%", right: "-6%", top: `${paperY}%`, height: "112%",
                  background: `linear-gradient(178deg, ${rgba(V.paper, 0.97)} 0%, ${rgba(V.paper, 0.88)} 62%, ${rgba(V.concrete, 0.7)} 100%)`,
                  boxShadow: `inset 0 -2px 10px ${rgba(V.ink0, 0.4)}`,
                }} />
              )}
            </Marco>
          </Plane>
        )}

        {/* PLANO 9 · LA TRAYECTORIA EQUIVOCADA — el reguero del incentivo, del techo a la empresa.
            Esto SÍ es un gráfico (una traza), no un objeto real disfrazado. -------------------- */}
        {g >= 470 && g < 860 && (
          <Plane z={60} style={{ opacity: ip(g, [470, 506, 800, 858], [0, 1, 1, 0]) }}>
            {Array.from({ length: 22 }, (_, i) => {
              const t = i / 21;
              const px = lerp(30, 77, t);
              const py = lerp(60, 40, t) - 18 * Math.sin(t * Math.PI);
              const vivo = clamp01((ip(g, [470, 800], [0, 1.08]) - t) * 7);
              const s = 6 + 5 * vivo + rnd(i * 4.3) * 3;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${px}%`, top: `${py}%`, width: s, height: s,
                  marginLeft: -s / 2, marginTop: -s / 2, borderRadius: "50%",
                  background: rgba(V.amber, 0.16 + 0.62 * vivo),
                  boxShadow: vivo > 0.4 ? `0 0 ${Math.round(10 + 16 * vivo)}px ${rgba(V.amber, 0.42 * vivo)}` : "none",
                }} />
              );
            })}
          </Plane>
        )}

        {/* PLANO 10 · EL CARTEL — viene EN BLANCO. Las letras se las pongo yo, sobre Bed.
            En g1620 el MISMO marco se vuelve la lámina de la guía. ---------------------------- */}
        {g >= 1248 && (
          <Plane z={0}>
            <Marco x={sX} y={sY} w={sW} h={sH} z={sZ} ry={sRY} rx={sRX}
              radius={g < 1620 ? 8 : 6} lit={sLit} litColor={g < 1600 ? V.roof : V.amber}>
              {/* material base: el cartel clavado en el jardín, siempre vivo por recorte */}
              <Mat photo="img/cmeurgente/cmeu_seVende.jpg" w={sW} h={sH}
                k={Math.max(1.06, ip(g, [1248, 1340, 1560, 1620, 1760], [900, 980, 940, 860, 780]) / Math.max(60, sW))}
                cx={50 + Math.sin(g / 236) * 2.6} cy={46 + Math.cos(g / 268) * 2.0}
                lit={sLit} litColor={g < 1600 ? V.roof : V.amber} sheenAt={L(1348)} />

              {/* el viento: el mismo cartel, moviéndose. El primer cuadro del clip ES la foto. */}
              {vientoOn > 0.004 && (
                <MediaCard src="broll/cmeurgente/cmeu_seVende_mov.mp4" kind="video"
                  w={Math.max(12, sW * 1.16)} h={Math.max(12, sH * 1.16)} x={50} y={48} z={0}
                  radius={0} lit={sLit} litColor={V.roof} opacity={clamp01(vientoOn)} />
              )}

              {/* MATCH-SHAPE g1620: la página de la guía ENTRA EMPUJANDO desde abajo del recorte */}
              {lamOn > 0.004 && (
                <MediaCard src="img/cmeurgente/cmeu_lam_cable.jpg" kind="photo"
                  w={Math.max(12, sW * 1.06)} h={Math.max(12, sH * 1.06)} x={50} y={lamPush} z={0}
                  radius={0} lit={1} litColor={V.amber} opacity={clamp01(lamOn)} sheenAt={L(1672)} />
              )}

              {/* LAS LETRAS DEL CARTEL — el cartel venía en blanco: se estampan acá, sobre Bed,
                  y en la frontera 4 se van DESLIZANDO por abajo del marco (recortadas, no borradas) */}
              {letrasOn > 0.01 && lamOn < 0.98 && (
                <div style={{
                  position: "absolute", left: "50%", top: `${letrasY}%`,
                  transform: `translate(-50%,-50%) rotate(-1.6deg) scale(${letrasPop.toFixed(3)})`,
                  opacity: clamp01(letrasOn),
                }}>
                  <Bed pad={16}>
                    <Head size={letrasSize} color={V.white}>SE VENDE</Head>
                  </Bed>
                </div>
              )}
            </Marco>
          </Plane>
        )}

        {/* PLANO 11 · LA PAREJA que se da vuelta y se va — pasa POR DELANTE (z 172) ----------- */}
        {g >= 1392 && g < 1690 && (
          <Plane z={0}>
            <Marco x={pX} y={pY} w={pW} h={pH} z={pZ} ry={-11} rx={3} radius={10}
              lit={pLit} litColor={V.sky} opacity={ip(g, [1392, 1420], [0, 1])}>
              <Mat photo="img/cmeurgente/cmeu_pareja_va.jpg" w={pW} h={pH}
                k={Math.max(1.06, ip(g, [1396, 1520, 1680], [560, 500, 460]) / Math.max(60, pW))}
                cx={52 + Math.sin(g / 190) * 2.2} cy={48} lit={pLit} litColor={V.sky} sheenAt={L(1444)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 14px 10px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2,
                color: rgba(V.white, 0.9), textTransform: "uppercase",
                opacity: ip(g, [1436, 1466, 1600, 1636], [0, 1, 1, 0]),
              }}>El comprador</div>
            </Marco>
          </Plane>
        )}

        {/* PLANO 12 · LA SEGUNDA LÁMINA — la guía apoyada detrás, en la mesa ------------------ */}
        {g >= 1684 && (
          <Plane z={26}>
            <Marco x={60.5} y={lam2Y} w={252} h={358} z={-16} ry={-14} rx={16} radius={6}
              lit={0.86} litColor={V.amber} opacity={0.94}>
              <Mat photo="img/cmeurgente/cmeu_lam_cable.jpg" w={252} h={358} k={1.16}
                cx={62} cy={38} lit={0.86} litColor={V.amber} sheenAt={L(1782)} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 13 · LA MONEDA QUE VUELVE — chica, y ahora la flecha apunta A LA CASA -------- */}
        {g >= 1698 && (
          <Plane z={90} style={{ opacity: volverOn }}>
            <Marco x={volverX} y={36} w={128} h={128} z={40} rx={16} rot={ip(g, [1700, 1920], [-14, 6])}
              radius="50%" lit={0.98} litColor={V.amber} ring={2.4} ringColor={rgba(V.amber, 0.9)}>
              <Mat photo="img/cmeurgente/cmeu_moneda.jpg" w={128} h={128} k={1.6}
                cx={50} cy={50} lit={0.98} litColor={V.amber} sheenAt={L(1756)} />
            </Marco>
            <IconPng src="img/cmeurgente/cmeu_ic_flecha.png" x={ip(g, [1700, 1920], [70, 66])} y={36}
              size={ip(g, [1700, 1810], [64, 96])} z={20} opacity={0.92 * volverOn}
              rot={ip(g, [1700, 1920], [172, 182])} glow={V.ink0} />
            <IconPng src="img/cmeurgente/cmeu_ic_casa.png" x={57.5} y={34}
              size={ip(g, [1700, 1830], [86, 118])} z={10} opacity={0.95 * volverOn}
              rot={ip(g, [1700, 1920], [-5, 2])} glow={V.ink0} />
          </Plane>
        )}

        {/* ÍCONOS PNG como objetos de la escena — el sello de la empresa y el candado del plazo */}
        {g >= 640 && g < 830 && (
          <Plane z={72}>
            <IconPng src="img/cmeurgente/cmeu_ic_sello.png" x={83} y={26}
              size={ip(g, [640, 700], [86, 128])} z={0}
              opacity={ip(g, [640, 682, 786, 826], [0, 0.95, 0.95, 0])}
              rot={ip(g, [640, 828], [-11, 4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1450 && g < 1596 && (
          <Plane z={76}>
            <IconPng src="img/cmeurgente/cmeu_ic_candado.png" x={26} y={40}
              size={ip(g, [1450, 1500], [72, 112])} z={0}
              opacity={ip(g, [1450, 1486, 1554, 1592], [0, 0.92, 0.92, 0])}
              rot={ip(g, [1450, 1594], [9, -4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 940 && g < 1120 && (
          <Plane z={70}>
            <IconPng src="img/cmeurgente/cmeu_ic_calendario.png" x={17} y={30}
              size={ip(g, [940, 990], [78, 116])} z={0}
              opacity={ip(g, [940, 978, 1080, 1116], [0, 0.9, 0.9, 0])}
              rot={ip(g, [940, 1118], [-8, 5])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ LA FIRMA DEL VIDEO — las veinticuatro horas, cuando ya se abrió la tarde ═════ */}
      {g >= 1656 && (
        <SunField sun={7 / 24} from={9} use={0.22} cells={24}
          on={ip(g, [1656, 1700], [0, 0.44])} tint={V.volt} night={V.sky}
          y={91} w={1080} h={22} cycle={230} />
      )}

      {/* ══════ COSTURA · FRONTERA 3 (g1290) — OCLUSIÓN: el contrato tapa el cuadro ═════════
          El color es el de LA MATERIA que cruza (`V.paper`), y el componente ya la lleva a
          luminancia media: ni fundido a negro ni flash blanco. Lo motiva el papel real de arriba. */}
      <SeamOcclude at={L(1276)} dur={26} color={V.paper} angle={-7} />

      {/* ══════ HUD — texto y cifras en espacio de pantalla ═════════════════════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* ACTO 1 · CERO DÓLARES DE ENTRADA */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={690} pad={24}>
              <Kick color={V.volt}>El papel que te ponen adelante</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>CERO DÓLARES DE ENTRADA</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Suena bien. <Em color={V.amber}>Y por eso funciona.</Em></Body>
            </Bed>
          </div>
        )}

        {/* la letra chica que nadie lee: VEINTE AÑOS (anotación del objeto, no un titular nuevo) */}
        {tChica > 0.01 && (
          <div style={{
            position: "absolute", left: "62%", top: "78%", opacity: tChica,
            transform: `translate(-50%,-50%) translateY(${((1 - tChica) * 14).toFixed(1)}px)`,
          }}>
            <Bed pad={16}>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 50, letterSpacing: 2.6,
                color: V.amber, textShadow: "0 4px 18px rgba(0,0,0,0.92)",
              }}>VEINTE AÑOS</div>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · EL INCENTIVO SE VA */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "68%", opacity: t2, transform: `translateY(${((1 - t2) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>La moneda va para el otro lado</Kick>
              <div style={{ height: 8 }} />
              <Head size={70}>EL INCENTIVO <Em color={V.amber}>SE VA</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Del techo de tu casa a la empresa que firma</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · TRES POR CIENTO POR AÑO (+ la cifra del año 20) */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "13%", opacity: t3, transform: `translateY(${((1 - t3) * -22).toFixed(1)}px)` }}>
            <Bed w={680} pad={24}>
              <Kick color={V.amber}>La cuota que te queda</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>TRES POR CIENTO <Em color={V.amber}>POR AÑO</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Cada año, sobre el del año anterior</Body>
            </Bed>
          </div>
        )}
        {g >= 1126 && g < 1268 && (
          <div style={{ opacity: ip(g, [1126, 1152, 1238, 1266], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "70%", top: "40%", width: 460, height: 250,
              marginLeft: -230, marginTop: -125,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value={`+${pct20}`} unit="%" label="LA CUOTA DEL AÑO VEINTE"
              at={L(1130)} x={70} y={40} size={112} color={V.amber} align="center" />
          </div>
        )}

        {/* ACTO 4 · CUANDO QUIERAS VENDER */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t4, transform: `translateY(${((1 - t4) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>Veinte años es mucho tiempo</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>CUANDO QUIERAS <Em color={V.amber}>VENDER</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>El comprador tiene que aceptar tu contrato. Muchos no lo aceptan.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · BUSCA QUIEN SE QUEDA CON EL INCENTIVO */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "16%", opacity: t5, transform: `translateY(${((1 - t5) * -24).toFixed(1)}px)` }}>
            <Bed w={720} pad={26}>
              <Kick color={V.volt}>Antes de firmar nada</Kick>
              <div style={{ height: 8 }} />
              <Head size={60}>BUSCA QUIÉN SE QUEDA CON <Em color={V.amber}>EL INCENTIVO</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Si no eres tú, el sistema no es tuyo</Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: cierra en el acto 1 (papel frío, todo mirando al centro) y se ABRE con la tarde */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at 50% 48%, rgba(0,0,0,0) 50%, rgba(6,7,5,${ip(g, [0, 840, 1290, 1920], [0.46, 0.42, 0.34, 0.26]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
