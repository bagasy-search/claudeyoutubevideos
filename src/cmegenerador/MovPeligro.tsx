// MovPeligro.tsx — S10 · UN MOVIMIENTO CONTINUO de 74 s (2220 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmegenerador`.
//
// LA ESPINA: las tres que matan — el cable suicida, el monóxido y el alargue flaco.
// Es el ÚNICO tramo del video donde entra el naranja `V.danger`, y entra DESDE ARRIBA: nace como una
// mancha en el cenit sobre el ámbar del amanecer que me deja MovTresDias, y para el final ya es la
// única luz del cuadro. Registro de ADVERTENCIA, no de espectáculo: no hay explosiones ni sangre.
// La gravedad se construye con detalle real (el cobre derretido adentro del plástico, el humo
// llenando el garaje, el operario silueteado en el poste al amanecer) y con TIEMPO — el acto 2
// respira: 16 segundos, una sola tarjeta grande, casi quieta, y dos ideas de texto en total.
// El último acto aterriza en la LÁMINA REAL de la guía (la tabla de cable y fusible), dentro de una
// MediaCard vertical, apoyada como papel de verdad sobre el banco. Sin precios ni URLs en pantalla.
//
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                    ║
// ╠════╦════════════════════════════════════╦════════════════════════════════════════════════════════
// ║ AC ║ enterFrom                          ║ exitTo
// ╠════╬════════════════════════════════════╬════════════════════════════════════════════════════════
// ║ 1  ║ CÁM: viene de MovTresDias, lejos   ║ CÁM: z≈+30 y SUBIENDO (camY 24→110), ya trepando por
// ║ f0 ║      y baja (z≈-340), sin tilt.    ║      el cable. La misma inercia sigue en el acto 2:
// ║    ║ LUZ: AMANECE — ámbar bajo en el    ║      no frena, no corta, no vuelve a 0.
// ║    ║      patio (tintA amber, keyFrom   ║ LUZ: keyFrom 0.80→0.66, el DANGER ya nació arriba
// ║    ║      0.80, intensidad 0.52).       ║      (dTop 0→0.24). tintA amber→danger al 72%.
// ║    ║ MAT: la luz del amanecer sobre el  ║ MAT: EL CABLE DE COBRE (Cord) — nace en f240 saliendo
// ║    ║      panel → cae sobre el piso del ║      del macro del cable suicida y en f480 ya es la
// ║    ║      garaje y encuentra el cable.  ║      línea de la calle. NO se desmonta en la frontera.
// ╠════╬════════════════════════════════════╬════════════════════════════════════════════════════════
// ║ 2  ║ CÁM: subiendo (camY 110→300), z    ║ CÁM: z≈-130 retrocediendo, camY frenando en 286.
// ║f480║      +30→+70, el mismo vector.     ║ LUZ: keyFrom 0.66→0.45, tint2 vira a `sky` (el gris
// ║    ║ LUZ: amanecer + danger arriba;     ║      del amanecer) y vuelve; el danger arriba se
// ║    ║      contra `sky` del cielo gris.  ║      sostiene en 0.20.
// ║    ║ MAT: EL MISMO CABLE, que ahora     ║ MAT: EL COBRE del conductor — se despega de la línea
// ║    ║      llega al poste (Cord con el   ║      y CRUZA el cuadro entero como oclusión (f952).
// ║    ║      mismo trazo, otro destino).   ║      Detrás ya está el garaje.
// ╠════╬════════════════════════════════════╬════════════════════════════════════════════════════════
// ║ 3  ║ CÁM: z≈+150 (el cobre tapa el      ║ CÁM: z≈-80 y cayendo, la cámara ya empuja hacia el
// ║f960║      salto), camY 60, abriendo.    ║      plástico del alargue.
// ║    ║ LUZ: keyFrom 0.44, intensidad      ║ LUZ: keyFrom 0.36, intensidad 0.62→0.74; el danger
// ║    ║      0.62: el garaje sin sol.      ║      arriba sube a 0.30 (empieza a mandar).
// ║    ║ MAT: el CABLE entra al garaje y    ║ MAT: EL HUMO del escape — llena el garaje desde f1000
// ║    ║      alimenta la casa (Cord baja). ║      y en f1440 cruza el cuadro (wipe). Detrás ya está
// ║    ║                                    ║      el macro del cobre derretido.
// ╠════╬════════════════════════════════════╬════════════════════════════════════════════════════════
// ║ 4  ║ CÁM: z≈-190 (el humo tapa el       ║ CÁM: z≈+95 ENTRANDO en el cobre (zoomThrough f1832,
// ║f1440      salto), camY -30, empujando.  ║      escala 1→7.5 hacia fx44/fy52). Sale en la tabla.
// ║    ║ LUZ: keyFrom 0.36, el danger       ║ LUZ: keyFrom 0.36→0.48, intensidad 0.90; el cobre
// ║    ║      arriba en 0.30, contra copper.║      caliente es la única fuente cálida que queda.
// ║    ║ MAT: EL HUMO que se vuelve el      ║ MAT: EL COBRE PELADO del alargue quemado — la cámara
// ║    ║      pardo derretido del plástico. ║      lo atraviesa y del otro lado es la fila impresa.
// ╠════╬════════════════════════════════════╬════════════════════════════════════════════════════════
// ║ 5  ║ CÁM: saliendo del zoom (z≈-230 →   ║ CÁM: z≈+30, quieta-viva, centrada en la lámina.
// ║f1860      -60), abriendo sobre el banco.║ LUZ: **DANGER NARANJA DURO DESDE ARRIBA** (dTop 0.40,
// ║    ║ LUZ: keyFrom 0.50, intensidad      ║      keyFrom 0.50, intensidad 0.95) = el enterFrom de
// ║    ║      0.86, danger arriba 0.34.     ║      MovCuenta, clavado.
// ║    ║ MAT: la LÁMINA de cable y fusible  ║ MAT: **LA TABLA IMPRESA EN EL CENTRO** (la lámina
// ║    ║      (la cámara sale adentro de    ║      viaja x 67→51 en los últimos 80 frames) — con la
// ║    ║      ella: w1740 → 552).           ║      hebra de cobre real (MediaCard peli4 chica)
// ║    ║                                    ║      apoyada al lado, que es lo que la trajo hasta acá.
// ╚════╩════════════════════════════════════╩════════════════════════════════════════════════════════
//
// COSTURAS (una distinta por frontera · ninguna es un fade · ninguna repite la anterior):
//   f480   1→2  MATCH-MOVE       — la cámara ya venía trepando por el cable desde f330 y NO se
//                                  detiene: camY 110→300 atraviesa la frontera. El Cord es el mismo
//                                  trazo antes y después (sólo cambia su punto de llegada), así que
//                                  lo que cambia es el CONTENIDO detrás, no el movimiento.
//   f952   2→3  OCLUSIÓN         — `SeamOcclude color={V.copper}` (el COBRE del conductor, ⛔ jamás
//                                  el color del fondo): tapa el 100% de f952 a f960, y el cambio de
//                                  acto cae en f960, con la tapa todavía puesta.
//   f1414  3→4  WIPE POR MATERIA — el HUMO del escape (`SeamWipeMatter tint={V.steel}`) reforzado
//                                  por la propia nube del acto 3, que llega a su máximo en f1440.
//                                  Detrás ya está montado el macro del cobre derretido.
//   f1832  4→5  ZOOM-THROUGH     — `zoomThrough(g, 1832, 28, 44, 52)`: la cámara entra en las hebras
//                                  de cobre del alargue y sale ADENTRO de la lámina impresa, que
//                                  arranca a w1740 y se encoge hasta apoyarse en el banco.
//
// ⛔ Sin Math.random / Date.now / new Date (todo sale de rnd(k) y de gFrame) · sin backdrop-filter ·
// ⛔ sin Easing.quint · rutas SOLO literales de la ficha · imports sólo remotion/react/VoltStage.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  SeamOcclude, SeamWipeMatter, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 2220;
const A2 = 480;
const A3 = 960;
const A4 = 1440;
const A5 = 1860;

const SEAM_OCCL = 952;   // 2→3 · cobre
const SEAM_WIPE = 1414;  // 3→4 · humo
const SEAM_ZOOM = 1832;  // 4→5 · zoom-through por el cobre

const LAM_R = 0.7069;    // 1588 / 2246 — las láminas son verticales: NUNCA estirarlas

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ── EL CABLE — la MATERIA que cruza la frontera 1→2 ─────────────────────────────────────────
// Es la CAPA GRÁFICA que conecta (el trazo del conductor), no el objeto: el cable de verdad vive
// adentro de las MediaCards (el macro con los dos machos, el poste, el alargue derretido).
const Cord: React.FC<{
  x1: number; y1: number; x2: number; y2: number; sag: number;
  w: number; opacity: number; hot: number; g: number;
}> = ({ x1, y1, x2, y2, sag, w, opacity, hot, g }) => {
  if (opacity <= 0.002) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  const d = "M " + x1.toFixed(1) + " " + y1.toFixed(1) +
    " Q " + mx.toFixed(1) + " " + my.toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1);
  const pulse = 0.5 + Math.sin(g / 11) * 0.5;
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, overflow: "visible" }}
    >
      {/* la goma del cable */}
      <path d={d} fill="none" stroke={rgba(V.ink0, 0.92)} strokeWidth={w + 7} strokeLinecap="round" />
      <path d={d} fill="none" stroke={rgba(V.ink2, 0.95)} strokeWidth={w + 2} strokeLinecap="round" />
      {/* el cobre adentro: es lo que viaja */}
      <path d={d} fill="none" stroke={rgba(V.copper, 0.5 + 0.42 * hot)} strokeWidth={Math.max(1.4, w * 0.42)} strokeLinecap="round" />
      {/* el reflejo de la key sobre la goma (iluminación de producto, no un contorno plano) */}
      <path d={d} fill="none" stroke={rgba(V.white, 0.16 + 0.14 * pulse * hot)} strokeWidth={Math.max(1, w * 0.16)} strokeLinecap="round" />
    </svg>
  );
};

// ── EL HUMO — la materia del acto 3, que además hace de wipe en la frontera 3→4 ─────────────
const Humo: React.FC<{ g: number; from: number; amount: number; drift: number }> = ({ g, from, amount, drift }) => {
  if (amount <= 0.004) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: amount }}>
      {Array.from({ length: 22 }, (_, i) => {
        const sp = 0.22 + rnd(i * 4.7) * 0.55;
        const life = ((g - from) * sp) / 34 + rnd(i * 8.3) * 6;
        const t = life % 6;
        const s = 190 + rnd(i * 2.1) * 340 + t * 46;
        const xx = lerp(rnd(i * 5.9) * 96, rnd(i * 5.9) * 96 - 26, t / 6) + drift * (0.4 + rnd(i * 3.7));
        const yy = 96 - t * 13 - rnd(i * 6.1) * 16;
        const a = Math.sin(clamp01(t / 6) * Math.PI) * (0.10 + rnd(i * 7.1) * 0.11);
        return (
          <div key={i} style={{
            position: "absolute", left: xx.toFixed(2) + "%", top: yy.toFixed(2) + "%",
            width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: "50%",
            background: "radial-gradient(circle, " + rgba(V.steel, a) + " 0%, " + rgba(V.concrete, a * 0.5) + " 44%, rgba(0,0,0,0) 70%)",
            filter: "blur(16px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const MovPeligro: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  // El build puede montarme dentro de una Sequence: el frame LOCAL no es el global. Todo componente
  // del Stage que recibe `at` (Seam*, sheenAt) razona en frames LOCALES → los traduzco con L().
  const lFrame = useCurrentFrame();
  const off = gFrame - lFrame;
  const L = (gAt: number) => gAt - off;

  // `acto` es la red: si el build me pasa un gFrame no numérico, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame) ? gFrame : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a 0 ═══════════════════════════════
  const cam = gcam(g, { z0: -240, z1: 130, panX: 96, panY: 34, ry: 5.4, rx: -1.5, dur: END });
  const cz = ip(
    g,
    [0, 120, 300, 420, 480, 560, 700, 860, 946, 962, 1080, 1240, 1400, 1424, 1452, 1600, 1740, 1826, 1846, 1876, 2010, 2130, 2220],
    [-340, -210, -110, -20, 30, 70, 20, -60, -130, 150, 70, 10, -40, -80, -190, -110, -30, 60, 95, -230, -140, -60, 30],
  );
  // el TILT: la cámara trepa por el cable desde f330 y no frena hasta el poste (MATCH-MOVE de f480)
  const camY = ip(
    g,
    [0, 300, 400, 480, 560, 660, 860, 940, 958, 1200, 1410, 1452, 1700, 1826, 1876, 2060, 2220],
    [24, 6, 62, 110, 220, 300, 292, 286, 60, 20, -8, -30, -52, -70, 40, 12, -6],
  );
  const camT = cam.transform + " translateZ(" + cz.toFixed(1) + "px) translateY(" + camY.toFixed(1) + "px)";
  // la deriva de la cámara, replicada para los overlays (que el texto no se lea pegado con cinta)
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;

  // ══ LA LUZ — EVOLUCIONA: amanecer ámbar → el danger nace ARRIBA → manda el cuadro entero ═══
  const keyFrom = ip(g, [0, 120, 480, 700, 960, 1200, 1440, 1700, 1860, 2220],
    [0.80, 0.74, 0.66, 0.60, 0.44, 0.40, 0.36, 0.44, 0.50, 0.50]);
  const inten = ip(g, [0, 20, 140, 300, 480, 700, 960, 1160, 1440, 1620, 1860, 2040, 2220],
    [0.52, 0.66, 0.72, 0.86, 0.80, 0.70, 0.62, 0.58, 0.74, 0.90, 0.86, 0.92, 0.95]);
  const floorL = ip(g, [0, 300, 960, 1440, 1860, 2220], [0.68, 0.66, 0.70, 0.62, 0.58, 0.56]);
  const tintA = light(ip(g, [0, 90, 300, 520], [0, 0.15, 0.72, 1]), "amber", "danger");
  const tintB = light(ip(g, [0, 470, 700, 1000, 1420, 1560, 2220], [0, 0, 0.9, 0.9, 0.3, 0, 0]), "amber", "sky");
  // EL NARANJA ENTRA DESDE ARRIBA — el único tramo del video que lo tiene
  const dTop = ip(g, [0, 110, 300, 480, 900, 1400, 1500, 1860, 2220],
    [0, 0.05, 0.20, 0.24, 0.20, 0.18, 0.30, 0.34, 0.40]);
  const kx = (14 + keyFrom * 70).toFixed(1);

  // ══ EL CABLE que cruza la frontera 1→2 ════════════════════════════════════════════════════
  const cordOp = ip(g, [236, 300, 900, 950, 1000, 1110, 1180], [0, 1, 1, 0.9, 0.8, 0.5, 0]);
  const cordHot = ip(g, [236, 480, 700, 960, 1180], [0.2, 0.5, 0.9, 0.5, 0.3]);
  // el punto de llegada VIAJA: del piso del garaje (acto 1) a la cruceta del poste (acto 2) y de ahí
  // baja al garaje del acto 3. El trazo es EL MISMO en las tres, por eso la frontera no se ve.
  const cX1 = ip(g, [236, 400, 560, 960, 1120], [430, 300, 170, 60, -80]);
  const cY1 = ip(g, [236, 400, 560, 960, 1120], [880, 940, 1010, 900, 830]);
  const cX2 = ip(g, [236, 340, 480, 640, 960, 1120], [1420, 1520, 1560, 1420, 1180, 940]);
  const cY2 = ip(g, [236, 340, 480, 640, 960, 1120], [700, 520, 300, 176, 300, 520]);
  const cSag = ip(g, [236, 480, 640, 960, 1120], [90, 130, 160, 120, 90]);

  // ══ EL HUMO del acto 3 (y el refuerzo del wipe de la frontera 3→4) ════════════════════════
  const humo = ip(g, [986, 1080, 1260, 1380, 1420, 1444, 1470], [0, 0.42, 0.72, 0.94, 1, 0.9, 0]);

  // ══ EL ZOOM-THROUGH de la frontera 4→5: la cámara entra en el cobre ════════════════════════
  const zt = zoomThrough(g, SEAM_ZOOM, 28, 44, 52);

  // ══ LA ESCALADA DE TENSIÓN del acto 1 (el transformador multiplica) ════════════════════════
  const voltRaw = ipe(g, [296, 330, 372], [220, 3100, 7620], Easing.out(Easing.cubic));
  const voltShake = g < 372 ? (rnd(Math.floor(g / 2) * 2.3) - 0.5) * 220 * clamp01((372 - g) / 60) : 0;
  const volts = g < 294 ? 220 : Math.max(220, Math.round(voltRaw + voltShake));
  const voltOn = ip(g, [290, 306, 470, 540], [0, 1, 1, 0]);

  // ── opacidades / gates de bloque ───────────────────────────────────────────────────────────
  const a1Op = ip(g, [0, 12, 455, 500], [0, 1, 1, 0]);
  const emberOn = ip(g, [1380, 1470, 2220], [0, 0.8, 1]);

  // ── ACTO 1 · el macro del cable con los dos machos ────────────────────────────────────────
  const p1F = [0, 24, 140, 300, 400, 470, 520];
  const p1W = ip(g, p1F, [1120, 1150, 1180, 1120, 980, 900, 860]);
  const p1H = ip(g, p1F, [590, 606, 622, 590, 516, 474, 452]);
  const p1X = ip(g, p1F, [50, 50, 50, 49, 44, 38, 34]);
  const p1Y = ip(g, p1F, [50, 50, 49, 52, 66, 92, 122]);
  const p1Z = ip(g, p1F, [-40, -10, 20, 60, 30, -20, -60]);
  const p1Ry = ip(g, p1F, [6.5, 6, 4.5, 1.5, -2.5, -5, -6]);
  const p1Rx = ip(g, p1F, [1.6, 1.4, 0.8, -0.4, -2.4, -4, -5]);

  // ── ACTO 2 · el operario en el poste, contraluz al amanecer (que RESPIRE) ─────────────────
  const p2F = [400, 470, 560, 640, 720, 760, 900, 950, 962];
  const p2W = ip(g, p2F, [980, 1010, 1040, 1060, 1060, 880, 860, 850, 850]);
  const p2H = ip(g, p2F, [640, 660, 680, 692, 692, 574, 561, 555, 555]);
  const p2X = ip(g, p2F, [54, 53, 52, 51, 51, 34, 33, 33, 33]);
  const p2Y = ip(g, p2F, [-32, -8, 20, 44, 46, 48, 50, 51, 51]);
  const p2Z = ip(g, p2F, [-120, -70, -20, 20, 26, -30, -50, -60, -60]);
  const p2Ry = ip(g, p2F, [-9, -7.5, -5, -2.5, -2, 7, 8, 8.5, 8.5]);
  const p2Rx = ip(g, p2F, [4, 3, 1.6, 0.4, 0.2, -0.6, -1, -1.2, -1.2]);

  // ── ACTO 2 · la LÁMINA REAL de las 7 conexiones (el beat "Nunca." de f722) ────────────────
  const l7F = [712, 760, 830, 920, 948];
  const l7W = ip(g, l7F, [300, 372, 384, 384, 384]);
  const l7X = ip(g, l7F, [82, 74, 73, 73, 73]);
  const l7Y = ip(g, l7F, [58, 50, 49, 49, 49]);
  const l7Z = ip(g, l7F, [-90, 40, 56, 46, 40]);
  const l7Rot = ip(g, l7F, [5, 1.2, 0.6, -0.4, -0.8]);
  const l7Ry = ip(g, l7F, [-14, -6, -4, -3, -3]);

  // ── ACTO 3 · el generador andando adentro del garaje ──────────────────────────────────────
  const p3F = [960, 1010, 1120, 1260, 1300, 1420, 1452];
  const p3W = ip(g, p3F, [880, 1080, 1180, 1180, 900, 880, 880]);
  const p3H = ip(g, p3F, [520, 620, 640, 640, 500, 490, 490]);
  const p3X = ip(g, p3F, [36, 44, 50, 50, 33, 32, 32]);
  const p3Y = ip(g, p3F, [50, 48, 47, 47, 52, 53, 53]);
  const p3Z = ip(g, p3F, [-60, -10, 40, 46, -10, -30, -34]);
  const p3Ry = ip(g, p3F, [7, 4, 1, 0.4, 8, 9, 9]);
  const p3Rx = ip(g, p3F, [-1, -0.4, 0.4, 0.6, -1.2, -1.6, -1.6]);

  // ── ACTO 4 · el macro del alargue fino derretido por dentro ───────────────────────────────
  const p4F = [1436, 1490, 1600, 1740, 1830];
  const p4W = ip(g, p4F, [980, 1180, 1280, 1280, 1300]);
  const p4H = ip(g, p4F, [520, 620, 672, 672, 682]);
  const p4X = ip(g, p4F, [50, 50, 50, 48, 46]);
  const p4Y = ip(g, p4F, [50, 49, 48, 48, 49]);
  const p4Z = ip(g, p4F, [-20, 30, 70, 90, 110]);
  const p4Ry = ip(g, p4F, [-6, -3, -0.6, 1.6, 2.6]);
  const p4Rx = ip(g, p4F, [2, 1, 0.2, -0.6, -1]);
  const calor = 0.5 + Math.sin(g / 17) * 0.28 + Math.sin(g / 6.3) * 0.12;

  // ── ACTO 5 · LA LÁMINA REAL de cable y fusible (papel de verdad sobre el banco) ────────────
  const l5F = [1844, 1880, 1930, 1990, 2080, 2140, 2220];
  const l5W = ip(g, l5F, [1740, 1180, 760, 552, 546, 542, 538]);
  const l5X = ip(g, l5F, [50, 56, 64, 67, 67, 58, 51]);
  const l5Y = ip(g, l5F, [46, 47, 48, 47.5, 47.5, 47.5, 47.5]);
  const l5Z = ip(g, l5F, [320, 220, 120, 40, 26, 22, 20]);
  const l5Rot = ip(g, l5F, [-4, -3, -2, -1.4, -1.2, -1.1, -1]);
  const l5Rx = ip(g, l5F, [16, 12, 8, 6, 5.4, 5.2, 5]);
  const l5Ry = ip(g, l5F, [6, 4.4, 3, 2, 1.6, 1.5, 1.4]);
  const l5H = l5W / LAM_R;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — se monta UNA vez y no se remonta nunca; sólo evoluciona ══════════ */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floorL} />

      {/* ══ EL NARANJA ENTRA DESDE ARRIBA — la firma de luz de esta sección ════════════════ */}
      <AbsoluteFill style={{
        background: "radial-gradient(124% 68% at " + kx + "% -14%, " + rgba(V.danger, dTop) + " 0%, " +
          rgba(V.danger, dTop * 0.34) + " 34%, rgba(0,0,0,0) 66%)",
        mixBlendMode: "screen", pointerEvents: "none",
      }} />
      <AbsoluteFill style={{
        background: "linear-gradient(180deg, " + rgba(V.danger, dTop * 0.5) + " 0%, rgba(0,0,0,0) 24%)",
        mixBlendMode: "screen", pointerEvents: "none",
      }} />

      {/* ══════ EL ESPACIO 3D — 7 planos con parallax propio, bajo UNA sola cámara ══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano a sangre ---------------------------------------------- */}
        {g < 520 && (
          <AbsoluteFill style={{ opacity: ip(g, [0, 14, 430, 510], [0, 1, 1, 0.6]) }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_peli1.jpg" kind="photo" z={-680}
              scale={1.34} dim={ip(g, [0, 120, 400], [0.62, 0.5, 0.66])} tint={V.amber} />
          </AbsoluteFill>
        )}
        {g >= 400 && g < 962 && (
          <AbsoluteFill style={{ opacity: ip(g, [400, 460, 930, 958], [0, 1, 1, 1]) }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_peli2.jpg" kind="photo" z={-700}
              scale={1.22} dim={0.62} tint={V.sky} />
          </AbsoluteFill>
        )}
        {g >= 956 && g < 1452 && (
          <AbsoluteFill style={{ opacity: ip(g, [956, 990, 1400, 1448], [0, 1, 1, 0.9]) }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_peli3.jpg" kind="photo" z={-660}
              scale={1.28} dim={0.6} tint={V.steel} />
          </AbsoluteFill>
        )}
        {g >= 1428 && g < 1876 && (
          <AbsoluteFill style={{ opacity: ip(g, [1428, 1462, 1820, 1866], [0, 1, 1, 0.7]) }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_peli4.jpg" kind="photo" z={-620}
              scale={1.45} dim={0.68} tint={V.copper} />
          </AbsoluteFill>
        )}
        {g >= 1846 && (
          <AbsoluteFill style={{ opacity: ip(g, [1846, 1900, 2220], [0, 0.9, 0.9]) }}>
            <PhotoPlane src="img/cmegenerador/cmeg_mv_peli5.jpg" kind="photo" z={-640}
              scale={1.2} dim={0.56} tint={V.danger} />
          </AbsoluteFill>
        )}

        {/* PLANO 2 · el aire de atrás: rejilla de profundidad, siempre viva ------------------ */}
        <Plane z={-460}>
          <div style={{ position: "absolute", inset: 0, transform: "translateX(" + (bx * 2.6).toFixed(2) + "px)" }}>
            <AbsoluteFill style={{
              opacity: ip(g, [0, 90, 1400, 1520, 2220], [0, 0.16, 0.16, 0.26, 0.22]),
              backgroundImage:
                "repeating-linear-gradient(90deg, " + rgba(V.danger, 0.09) + " 0 1px, rgba(0,0,0,0) 1px 104px)," +
                "repeating-linear-gradient(0deg, " + rgba(V.danger, 0.06) + " 0 1px, rgba(0,0,0,0) 1px 104px)",
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · el suelo: el piso del garaje (acto 1) y el banco de trabajo (acto 5) ---- */}
        {g < 540 && (
          <PadPlane y={ip(g, [0, 300, 520], [86, 82, 96])} w={1620} h={330} rx={64}
            lit={ip(g, [0, 60, 440, 520], [0, 0.7, 0.7, 0.2])} z={-200} />
        )}
        {g >= 1852 && (
          <PadPlane y={ip(g, [1852, 1990, 2220], [96, 80, 78])} w={1700} h={360} rx={62}
            lit={ip(g, [1852, 1930, 2220], [0, 0.9, 1])} z={-160} />
        )}

        {/* PLANO 4 · EL CABLE — la materia que cruza la frontera 1→2 ------------------------- */}
        {g >= 234 && g < 1182 && (
          <Plane z={-90}>
            <Cord x1={cX1} y1={cY1} x2={cX2} y2={cY2} sag={cSag} w={9}
              opacity={cordOp} hot={cordHot} g={g} />
          </Plane>
        )}

        {/* PLANO 5 · LOS PROTAGONISTAS (material real dentro de vidrio, uno por acto) -------- */}

        {/* ACTO 1 · el macro del cable con un macho en cada punta */}
        {g < 524 && (
          <Plane z={0} style={{ opacity: a1Op }}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_peli1.mp4" kind="video"
              w={p1W} h={p1H} x={p1X} y={p1Y} z={p1Z} ry={p1Ry} rx={p1Rx} radius={12}
              lit={ip(g, [0, 90, 300, 470], [0.55, 1, 1, 0.6])}
              litColor={light(ip(g, [90, 320], [0, 1]), "amber", "danger")}
              sheenAt={L(34)}
              label={g >= 150 && g < 430 ? "DOS MACHOS · UN SOLO CABLE" : undefined}
            />
          </Plane>
        )}

        {/* ACTO 2 · el operario en el poste al amanecer — el plano que RESPIRA */}
        {g >= 396 && g < 962 && (
          <Plane z={0}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_peli2.mp4" kind="video"
              w={p2W} h={p2H} x={p2X} y={p2Y} z={p2Z} ry={p2Ry} rx={p2Rx} radius={12}
              lit={ip(g, [396, 520, 900, 958], [0.4, 0.95, 0.95, 0.8])}
              litColor={light(ip(g, [480, 700], [0, 1]), "sky", "danger")}
              sheenAt={L(612)}
              opacity={ip(g, [396, 428, 950, 960], [0, 1, 1, 1])}
              label={g >= 600 && g < 706 ? "LA LÍNEA QUE CREEN MUERTA" : undefined}
            />
          </Plane>
        )}

        {/* ACTO 2 · la LÁMINA REAL de la guía en el beat "Nunca." (f722) — papel vertical */}
        {g >= 706 && g < 962 && (
          <Plane z={0}>
            <MediaCard
              src="img/cmegenerador/cmeg_lam_7conexiones.jpg" kind="photo"
              w={l7W} h={l7W / LAM_R} x={l7X} y={l7Y} z={l7Z} rot={l7Rot} ry={l7Ry} radius={6}
              lit={0.98} litColor={V.paper} grade={false}
              sheenAt={L(772)}
              opacity={ip(g, [706, 742, 950, 960], [0, 1, 1, 1])}
            />
          </Plane>
        )}

        {/* ACTO 3 · el generador andando adentro del garaje, con la puerta a medias */}
        {g >= 956 && g < 1456 && (
          <Plane z={0}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_peli3.mp4" kind="video"
              w={p3W} h={p3H} x={p3X} y={p3Y} z={p3Z} ry={p3Ry} rx={p3Rx} radius={12}
              lit={ip(g, [956, 1010, 1300, 1450], [0.5, 1, 0.92, 0.7])}
              litColor={light(ip(g, [1000, 1300], [0, 1]), "steel", "danger")}
              sheenAt={L(1006)}
              label={g >= 1300 && g < 1420 ? "ADENTRO · LA PUERTA A MEDIAS" : undefined}
            />
          </Plane>
        )}
        {/* ACTO 3 · el MISMO material a otra escala: el mismo equipo, pero afuera y lejos */}
        {g >= 1272 && g < 1452 && (
          <Plane z={-40} style={{ opacity: ip(g, [1272, 1312, 1408, 1444], [0, 1, 1, 0.35]) }}>
            <MediaCard
              src="img/cmegenerador/cmeg_mv_peli3.jpg" kind="photo"
              w={ip(g, [1272, 1330, 1440], [180, 300, 312])}
              h={ip(g, [1272, 1330, 1440], [104, 172, 179])}
              x={ip(g, [1272, 1330, 1440], [88, 76, 75.5])}
              y={ip(g, [1272, 1330, 1440], [40, 40.5, 41])}
              z={ip(g, [1272, 1330, 1440], [-260, -170, -160])}
              ry={-9} radius={8} lit={0.85} litColor={V.amber}
              label="AL AIRE LIBRE · LEJOS"
            />
          </Plane>
        )}

        {/* ACTO 4 · el macro del alargue fino derretido — la cámara ENTRA acá (zoom-through) */}
        {g >= 1432 && g < 1876 && (
          <Plane z={0} style={{ transform: "translateZ(0px) " + (zt.out === "none" ? "" : zt.out), opacity: zt.opacity }}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_peli4.mp4" kind="video"
              w={p4W} h={p4H} x={p4X} y={p4Y} z={p4Z} ry={p4Ry} rx={p4Rx} radius={12}
              lit={ip(g, [1432, 1500, 1820], [0.45, 1, 1])}
              litColor={V.copper}
              sheenAt={L(1486)}
              label={g >= 1620 && g < 1810 ? "ADENTRO DEL PLÁSTICO" : undefined}
            />
            {/* el CALOR que no se ve desde afuera: el cobre recalentado, latiendo bajo la goma */}
            <div style={{
              position: "absolute", left: p4X + "%", top: (p4Y + 1) + "%",
              width: p4W * 0.52, height: p4H * 0.3,
              marginLeft: -(p4W * 0.26), marginTop: -(p4H * 0.15),
              borderRadius: "50%",
              background: "radial-gradient(circle, " + rgba(V.danger, 0.20 + 0.16 * calor) + " 0%, " +
                rgba(V.copper, 0.11 + 0.08 * calor) + " 42%, rgba(0,0,0,0) 72%)",
              mixBlendMode: "screen",
              opacity: ip(g, [1500, 1600, 1830], [0, 1, 1]),
            }} />
          </Plane>
        )}

        {/* ACTO 5 · LA LÁMINA REAL de cable y fusible — la cámara SALE adentro de ella */}
        {g >= 1842 && (
          <Plane z={0}>
            <MediaCard
              src="img/cmegenerador/cmeg_lam_cablefusible.jpg" kind="photo"
              w={l5W} h={l5H} x={l5X} y={l5Y} z={l5Z}
              rot={l5Rot} rx={l5Rx} ry={l5Ry} radius={6}
              lit={1} litColor={V.paper} grade={false}
              sheenAt={L(1996)}
              opacity={ip(g, [1842, 1866, 2220], [0, 1, 1])}
            />
          </Plane>
        )}
        {/* ACTO 5 · Claudio en el banco, señalando la tabla impresa (el material que la valida) */}
        {g >= 1892 && (
          <Plane z={-60} style={{ opacity: ip(g, [1892, 1936, 2220], [0, 1, 1]) }}>
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_peli5.mp4" kind="video"
              w={ip(g, [1892, 1960, 2220], [420, 560, 566])}
              h={ip(g, [1892, 1960, 2220], [236, 315, 318])}
              x={ip(g, [1892, 1960, 2220], [16, 18, 18.5])}
              y={ip(g, [1892, 1960, 2220], [26, 32, 32.5])}
              z={ip(g, [1892, 1960, 2220], [-180, -90, -76])}
              ry={ip(g, [1892, 2220], [12, 5])} radius={10}
              lit={0.92} litColor={V.amber} sheenAt={L(1958)}
              label="EL BANCO · LA TABLA IMPRESA"
            />
          </Plane>
        )}
        {/* ACTO 5 · LA HEBRA DE COBRE que sobrevive del acto 4: el mismo macro, ya chico */}
        {g >= 1872 && (
          <Plane z={-20} style={{ opacity: ip(g, [1872, 1914, 2220], [0, 1, 1]) }}>
            <MediaCard
              src="img/cmegenerador/cmeg_mv_peli4.jpg" kind="photo"
              w={ip(g, [1872, 1940, 2220], [180, 240, 244])}
              h={ip(g, [1872, 1940, 2220], [100, 134, 136])}
              x={ip(g, [1872, 1940, 2220], [92, 88, 87.5])}
              y={ip(g, [1872, 1940, 2220], [84, 78, 77.5])}
              z={ip(g, [1872, 1940, 2220], [-140, -50, -40])}
              rot={ip(g, [1872, 2220], [6, 0.6])} ry={-8} radius={8}
              lit={0.8} litColor={V.copper}
            />
          </Plane>
        )}

        {/* PLANO 6 · objetos de escena delante (íconos PNG con fondo transparente) ----------- */}
        {g >= 150 && g < 470 && (
          <Plane z={110}>
            <IconPng src="img/cmegenerador/cmeg_ic_enchufe.png"
              x={ip(g, [150, 300, 460], [22, 24, 20])} y={ip(g, [150, 300, 460], [30, 28, 24])}
              size={ip(g, [150, 200, 460], [70, 132, 126])} z={0}
              opacity={ip(g, [150, 182, 420, 466], [0, 0.95, 0.95, 0])} rot={-8} glow={V.ink0} />
            <IconPng src="img/cmegenerador/cmeg_ic_enchufe.png"
              x={ip(g, [180, 320, 460], [78, 76, 80])} y={ip(g, [180, 320, 460], [26, 24, 20])}
              size={ip(g, [180, 230, 460], [70, 132, 126])} z={0}
              opacity={ip(g, [180, 212, 420, 466], [0, 0.95, 0.95, 0])} rot={9} glow={V.ink0} />
          </Plane>
        )}
        {g >= 306 && g < 700 && (
          <Plane z={140} style={{ opacity: ip(g, [306, 340, 640, 698], [0, 0.9, 0.9, 0]) }}>
            <IconPng src="img/cmegenerador/cmeg_ic_rayo.png"
              x={ip(g, [306, 640], [69, 72])} y={ip(g, [306, 640], [62, 18])}
              size={ip(g, [306, 400, 640], [64, 108, 96])} z={0}
              opacity={0.5 + 0.45 * (0.5 + Math.sin(g / 9) * 0.5)} rot={ip(g, [306, 640], [10, -4])}
              glow={V.danger} />
          </Plane>
        )}
        {g >= 728 && g < 950 && (
          <Plane z={120} style={{ opacity: ip(g, [728, 764, 916, 948], [0, 0.95, 0.95, 0.4]) }}>
            <IconPng src="img/cmegenerador/cmeg_ic_breaker.png"
              x={88} y={ip(g, [728, 900], [72, 69])} size={132} z={0} opacity={0.95}
              rot={ip(g, [728, 900], [-7, -2])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1170 && g < 1440 && (
          <Plane z={130} style={{ opacity: ip(g, [1170, 1212, 1400, 1436], [0, 0.9, 0.9, 0.25]) }}>
            <IconPng src="img/cmegenerador/cmeg_ic_casa.png"
              x={86} y={ip(g, [1170, 1400], [16, 20])} size={128} z={0} opacity={0.9}
              rot={ip(g, [1170, 1400], [4, -2])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1494 && g < 1780 && (
          <Plane z={130} style={{ opacity: ip(g, [1494, 1534, 1730, 1776], [0, 0.92, 0.92, 0]) }}>
            <IconPng src="img/cmegenerador/cmeg_ic_congelador.png"
              x={82} y={ip(g, [1494, 1730], [20, 25])} size={162} z={0} opacity={0.94}
              rot={ip(g, [1494, 1730], [-6, 3])} glow={V.ink0} />
          </Plane>
        )}

        {/* PLANO 7 · el humo del escape: la materia del acto 3 y el refuerzo del wipe -------- */}
        <Humo g={g} from={986} amount={humo} drift={bx * 0.8} />

        {/* PLANO 8 · primer plano fuera de foco: pavesas de cobre (hold VIVO permanente) ----- */}
        <Plane z={320} style={{ opacity: 0.55 }}>
          <div style={{ position: "absolute", inset: 0, transform: "translateX(" + (bx * -3.4).toFixed(2) + "px)" }}>
            {Array.from({ length: 11 }, (_, i) => {
              const sp = 0.4 + rnd(i * 4.1) * 0.9;
              const xx = ((rnd(i * 7.3) * 100 + (g * sp) / 30) % 106) - 3;
              const yy = 6 + rnd(i * 2.9) * 86;
              const s = lerp(22, 76, rnd(i * 5.7));
              const warm = i % 3 === 0 ? V.danger : V.copper;
              return (
                <div key={i} style={{
                  position: "absolute", left: xx.toFixed(2) + "%", top: yy.toFixed(2) + "%",
                  width: s, height: s, borderRadius: "50%",
                  background: "radial-gradient(circle, " + rgba(warm, 0.10 + 0.1 * emberOn) + ", rgba(0,0,0,0) 70%)",
                }} />
              );
            })}
          </div>
        </Plane>
      </Layers>

      {/* ══ COSTURA 2→3 · OCLUSIÓN con el COBRE del conductor (⛔ jamás el color del fondo) ══ */}
      <SeamOcclude at={L(SEAM_OCCL)} dur={20} color={V.copper} angle={-9} />
      {/* ══ COSTURA 3→4 · WIPE POR MATERIA: el humo del escape cruzando el cuadro ═══════════ */}
      <SeamWipeMatter at={L(SEAM_WIPE)} dur={52} tint={V.steel} />

      {/* ══ LA TIRA DEL CANAL — acá casi no descansa: la carga del alargue no para ═════════ */}
      {g >= 1596 && g < 1830 && (
        <DutyField duty={0.93} cells={30} on={ip(g, [1596, 1636, 1792, 1826], [0, 0.9, 0.9, 0])}
          tint={V.danger} y={88} w={1160} h={26} cycle={92} />
      )}

      {/* ══ OVERLAYS DE TEXTO — fuera de la cámara para que la tipografía no se deforme, ════
          pero atados a la deriva de la cámara para que no se lean pegados con cinta.        */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        transform: "translate3d(" + (bx * 0.55).toFixed(2) + "px, " + (by * 0.55).toFixed(2) + "px, 0)",
      }}>

        {/* ACTO 1 · titular (f133 · "le dicen cable suicida") */}
        {g >= 118 && g < 452 && (
          <div style={{
            position: "absolute", left: 122, bottom: 122, width: 880,
            opacity: ip(g, [118, 144, 420, 450], [0, 1, 1, 0]),
            transform: "translateY(" + ip(g, [118, 148, 422, 452], [46, 0, 0, -32]).toFixed(1) + "px)",
          }}>
            <Bed pad={28}>
              <Kick color={V.danger}>UNO · EL PUENTE CASERO</Kick>
              <div style={{ height: 12 }} />
              <Head size={92}>LE DICEN CABLE SUICIDA</Head>
            </Bed>
          </div>
        )}

        {/* ACTO 1 · la escalada del transformador (f239 · "la multiplica a miles de voltios") */}
        {g >= 290 && g < 542 && (
          <div style={{
            position: "absolute", right: 128, top: ip(g, [290, 400, 540], [122, 108, 96]),
            textAlign: "right", opacity: voltOn, whiteSpace: "nowrap",
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4,
              color: rgba(V.white, 0.72), textTransform: "uppercase", marginBottom: 8,
              textShadow: "0 4px 18px rgba(0,0,0,0.94)",
            }}>EN LA LÍNEA DE LA CALLE</div>
            <Num size={ip(g, [290, 380, 540], [140, 168, 158])} color={V.danger}>
              {miles(volts)}
              <span style={{ fontSize: 56, marginLeft: 12, color: rgba(V.danger, 0.82) }}>V</span>
            </Num>
          </div>
        )}

        {/* ACTO 2 · titular — una sola idea, y el plano respira debajo */}
        {g >= 546 && g < 704 && (
          <div style={{
            position: "absolute", left: 122, bottom: 122, width: 900,
            opacity: ip(g, [546, 574, 674, 702], [0, 1, 1, 0]),
            transform: "translateY(" + ip(g, [546, 578, 676, 704], [44, 0, 0, -34]).toFixed(1) + "px)",
          }}>
            <Bed pad={28}>
              <Kick color={V.danger}>EL TRANSFORMADOR LA MULTIPLICA</Kick>
              <div style={{ height: 12 }} />
              <Head size={86}>MATA AL QUE ESTÁ EN EL POSTE</Head>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · el beat de f722: "Nunca." + el interruptor de transferencia */}
        {g >= 716 && g < 946 && (
          <div style={{
            position: "absolute", left: 122, bottom: 138, width: 700,
            opacity: ip(g, [716, 744, 912, 944], [0, 1, 1, 0]),
            transform: "translateY(" + ip(g, [716, 748, 914, 946], [40, 0, 0, -28]).toFixed(1) + "px)",
          }}>
            <Bed pad={26}>
              <Head size={108} color={V.danger}>NUNCA</Head>
              <div style={{ height: 10 }} />
              <Body size={34}>Para eso existe el interruptor de transferencia.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · titular (f1067 · "no huele, no se ve") */}
        {g >= 1046 && g < 1268 && (
          <div style={{
            position: "absolute", left: 122, bottom: 122, width: 900,
            opacity: ip(g, [1046, 1074, 1238, 1266], [0, 1, 1, 0]),
            transform: "translateY(" + ip(g, [1046, 1078, 1240, 1268], [44, 0, 0, -32]).toFixed(1) + "px)",
          }}>
            <Bed pad={28}>
              <Kick color={V.danger}>DOS · MONÓXIDO DE CARBONO</Kick>
              <div style={{ height: 12 }} />
              <Head size={92}>NO HUELE, NO SE VE</Head>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · el remate de f1423: la puerta a medias no alcanza */}
        {g >= 1404 && g < 1444 && (
          <div style={{
            position: "absolute", left: 122, bottom: 130, width: 820,
            opacity: ip(g, [1404, 1420, 1436, 1444], [0, 1, 1, 0]),
          }}>
            <Bed pad={24}>
              <Head size={64} color={V.danger}>A MEDIAS NO ALCANZA</Head>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · titular (f1580 · "se calienta adentro del plástico donde no lo ves") */}
        {g >= 1556 && g < 1810 && (
          <div style={{
            position: "absolute", left: 122, bottom: 150, width: 920,
            opacity: ip(g, [1556, 1584, 1780, 1808], [0, 1, 1, 0]),
            transform: "translateY(" + ip(g, [1556, 1588, 1782, 1810], [44, 0, 0, -32]).toFixed(1) + "px)",
          }}>
            <Bed pad={28}>
              <Kick color={V.danger}>TRES · EL ALARGUE FLACO</Kick>
              <div style={{ height: 12 }} />
              <Head size={88}>SE CALIENTA DONDE NO LO VES</Head>
            </Bed>
          </div>
        )}
        {g >= 1604 && g < 1828 && (
          <div style={{
            position: "absolute", left: 0, right: 0, top: "83.5%", textAlign: "center",
            opacity: ip(g, [1604, 1640, 1794, 1826], [0, 0.9, 0.9, 0]),
          }}>
            <Kick color={V.danger}>LA CARGA NO PARA · EL COBRE TAMPOCO SE ENFRÍA</Kick>
          </div>
        )}

        {/* ACTO 5 · titular (f1879 · "alargue grueso y corto") */}
        {g >= 1872 && g < 2100 && (
          <div style={{
            position: "absolute", left: 122, bottom: 124, width: 720,
            opacity: ip(g, [1872, 1902, 2064, 2098], [0, 1, 1, 0]),
            transform: "translateY(" + ip(g, [1872, 1906, 2066, 2100], [42, 0, 0, -30]).toFixed(1) + "px)",
          }}>
            <Bed pad={28}>
              <Kick color={V.amber}>PARA ESTAS CARGAS</Kick>
              <div style={{ height: 12 }} />
              <Head size={100}>GRUESO Y CORTO</Head>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · el pie de la lámina (f1967 · "la tabla de qué grosor va para cada vatio") */}
        {g >= 1948 && (
          <div style={{
            position: "absolute", left: l5X + "%", top: (l5Y + (l5H / 1080) * 50 + 3.4) + "%",
            transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap",
            opacity: ip(g, [1948, 1982, 2220], [0, 1, 1]),
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 3.4,
              color: V.white, textTransform: "uppercase",
              textShadow: "0 5px 22px rgba(0,0,0,0.95)",
            }}>CABLE Y FUSIBLE POR VATIOS Y DISTANCIA</div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
