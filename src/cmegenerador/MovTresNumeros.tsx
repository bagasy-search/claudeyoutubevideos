// MovTresNumeros.tsx — S7 · UN MOVIMIENTO CONTINUO de 60 s (1800 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmegenerador` · arranca en el segundo 770,0.
//
// LA ESPINA: los tres números del respaldo — vatios continuos, pico de arranque y kilovatios hora
// por día. Cada número no es un rótulo: es una FICHA FÍSICA con material real adentro, que NACE
// grande, se gana su cifra, y se va a esperar al riel. Al final las tres bajan a la mesa del taller,
// una mano las junta, y por abajo entra la hoja de la guía. Nadie te vende de más.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                 ║
// ╠════╦═══════════════════════════════════════╦═══════════════════════════════════════════════╣
// ║ AC ║ enterFrom                             ║ exitTo                                        ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: viene de MovDosPreguntas, media  ║ CÁM: z≈-120→+40 y siguiendo su vector hacia    ║
// ║ g0 ║ distancia, retrocedida (z≈-120),      ║      adelante-izquierda. NO frena en la        ║
// ║    ║ pan a la izquierda ya empezado.       ║      frontera: la atraviesa empujando.         ║
// ║    ║ LUZ: ÁMBAR BAJO (keyFrom 0.66, int    ║ LUZ: keyFrom 0.66→0.38, int 0.52→0.96, tintA   ║
// ║    ║ 0.52) — la caja negra de la estación.  ║      ámbar→VOLT: entra el laboratorio.         ║
// ║    ║ MAT: LA CIFRA 3 (los "3 kWh" que      ║ MAT: la VENTANA DEL DISPLAY de la pinza (el    ║
// ║    ║ quedaron solos) → se encoge y se      ║      rectángulo donde vive el 308) queda vacía ║
// ║    ║ vuelve el contador "3 NÚMEROS".       ║      y empieza a ABRIRSE. La ficha 1 ya viaja  ║
// ║    ║                                       ║      al riel con su cifra pegada.              ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: z≈+40 avanzando, misma inercia.  ║ CÁM: z≈-40, ya retrocediendo y bajando (la     ║
// ║g420║ LUZ: laboratorio a medio levantar     ║      caída hacia la mesa arranca acá).         ║
// ║    ║ (keyFrom 0.38, tintA casi volt).      ║ LUZ: keyFrom 0.38→0.30, int 0.96→1.0, floor    ║
// ║    ║ MAT: la ventana del display, que se   ║      0.70→0.72: negro puro, luz volt dura.     ║
// ║    ║ ABRE hasta ser la ficha del número    ║ MAT: la ficha DOS (la chapa del motor) + LAS   ║
// ║    ║ dos: adentro, la chapa del motor en   ║      TRES BARRAS DE PICO, que NO se apagan:    ║
// ║    ║ macro cerrado (todavía abstracta).    ║      cruzan el polvo y salen del otro lado.    ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: z≈-40 retrocediendo y bajando.   ║ CÁM: sigue BAJANDO y acelera (translateY       ║
// ║g900║ LUZ: laboratorio pleno, keyFrom 0.30. ║      -20→-104, rotateX -1,2→-5,4): la mesa.    ║
// ║    ║ MAT: la ficha DOS (misma Ventana, sin ║ LUZ: keyFrom 0.30→0.44, tintA volt→ámbar: la   ║
// ║    ║ desmontar) que se abre a MACRO, y las ║      luz de mesa empieza a entrar por abajo.   ║
// ║    ║ tres barras ya compactadas abajo.     ║ MAT: la ficha TRES (el medidor de enchufe) va  ║
// ║    ║                                       ║      EN VUELO del riel a la mesa, cruzando la  ║
// ║    ║                                       ║      frontera en pleno movimiento.             ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: cayendo hacia la mesa, misma     ║ CÁM: z≈+210, quieta sobre la mesa con deriva   ║
// ║g1380║ curva (no se reinicia).              ║      viva. Es el encuadre con el que abre      ║
// ║    ║ LUZ: keyFrom 0.44 y subiendo hacia    ║      MovEscalones.                             ║
// ║    ║ la derecha, tintA volviendo a ámbar.  ║ LUZ: LUZ DE MESA CÁLIDA (keyFrom 0.80, tintA   ║
// ║    ║ MAT: la ficha TRES en vuelo + el      ║      ámbar puro, floor 0.52) sobre el papel.   ║
// ║    ║ banco de trabajo SUBIENDO desde       ║ MAT: LA HOJA DE LOS 60 APARATOS apoyada en la  ║
// ║    ║ abajo de cuadro (la mano y las tres   ║      mesa (lámina real del PDF, dentro de una  ║
// ║    ║ tarjetas).                            ║      MediaCard vertical) = la base sobre la    ║
// ║    ║                                       ║      que arranca MovEscalones.                 ║
// ╚════╩═══════════════════════════════════════╩═══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fade:
//   g420  1→2  MATCH-SHAPE      — el RECTÁNGULO DEL DISPLAY (donde vivió el 308) no se corta: se
//                                 abre de 318×160 a 1210×648 con el material ya corriendo adentro
//                                 (la Ventana crece, el contenido no se re-encuadra) → es
//                                 literalmente "el display se vuelve la ficha del número dos".
//                                 A la vez la ficha 1 se encoge y viaja al riel: una sola forma
//                                 entrega y la otra recibe, sin un solo frame de negro.
//   g900  2→3  WIPE POR MATERIA — chispa de polvo de taller cruzando (SeamWipeMatter en `copper`
//                                 + mi capa de chispas). Detrás YA está el macro de la chapa; las
//                                 tres barras cruzan el polvo y salen compactadas abajo a la
//                                 derecha. Distinta de la anterior y no hay fundido.
//   g1380 3→4  MATCH-MOVE       — la cámara no corta: sigue su misma curva de caída (camDrop y
//                                 camTilt aceleran desde g1330) y el banco de trabajo SUBE al
//                                 cuadro. La ficha tres cruza la frontera EN VUELO. Nada aparece:
//                                 todo entra por geometría.
//
// ⛔ CONTRATO: sin Math.random/Date.now (todo sale de rnd(k) y de gFrame) · sin backdrop-filter ·
// ⛔ sin Easing.quint · rutas SOLO literales de la ficha · imports sólo remotion/react/VoltStage.
// ⚠️ El build monta CADA ACTO en su propia <Sequence>: useCurrentFrame() es LOCAL. Todo componente
//    del Stage que recibe `at`/`sheenAt` razona en frames locales → se traduce con L().
// ⚠️ Los clips duran 5,1 s (153 frames). Ningún kind="video" queda en pantalla más de ~148 frames
//    LOCALES: cada Ventana lleva la FOTO de base (viva por crop animado) y el clip encima sólo en
//    la ventana de arranque de su acto (el frame 0 del clip i2v ES la foto: el relevo no se ve).

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamWipeMatter,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

const END = 1800;
const A2 = 420;
const A3 = 900;
const A4 = 1380;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ── VENTANA: el marco de vidrio que RECORTA el material. Es la primitiva de este movimiento:
//    la misma Ventana que era el display de la pinza se abre y se vuelve la ficha del número dos.
//    Adentro va SIEMPRE material real (foto de base + clip encima en su ventana viva).
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; radius?: number; lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    width: Math.max(8, w), height: Math.max(8, h),
    marginLeft: -Math.max(8, w) / 2, marginTop: -Math.max(8, h) / 2,
    transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`,
    borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
    border: `1px solid ${rgba(litColor, 0.3 * lit)}`,
    boxShadow: `0 ${Math.round(h * 0.15)}px ${Math.round(h * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
      `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
  }}>{children}</div>
);

// ── MATERIAL dentro de la Ventana: la FOTO siempre (con crop animado = nunca queda quieta) y el
//    CLIP encima mientras dura de verdad. `k` es el zoom de recorte (≥1: la foto siempre cubre).
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
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

// ── PIE DE FICHA: el número del respaldo pegado a su tarjeta (va DENTRO de la Ventana).
const PieFicha: React.FC<{ n: string; valor: string; on: number; tint?: string }> = ({ n, valor, on, tint = V.volt }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      padding: "22px 12px 9px", opacity: clamp01(on),
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 58%)",
      display: "flex", alignItems: "baseline", gap: 10,
    }}>
      <span style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30, color: tint, lineHeight: 1 }}>{n}</span>
      <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 1.4, color: V.white }}>{valor}</span>
    </div>
  );
};

// ── LA BARRA DE PICO: capa gráfica (esto SÍ es un gráfico, no un objeto real disfrazado).
const Barra: React.FC<{
  x: number; base: number; h: number; w: number; valor: number; nombre: string;
  tint: string; on: number; lit: number; ganador?: boolean; g: number;
}> = ({ x, base, h, w, valor, nombre, tint, on, lit, ganador = false, g }) => {
  if (on <= 0.01) return null;
  const pulse = ganador ? 0.5 + 0.5 * Math.sin(g / 9) : 0;
  const alto = Math.max(3, h);
  const topPx = (base / 100) * 1080 - alto;
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: 0, opacity: clamp01(on) }}>
      {/* la cifra, encima de la barra */}
      <div style={{
        position: "absolute", left: 0, top: topPx - 74, width: w + 130, marginLeft: -(w + 130) / 2,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(30 + 14 * lit), color: tint,
          textShadow: `0 0 22px ${rgba(tint, 0.45)}, 0 4px 16px rgba(0,0,0,0.92)`, lineHeight: 1,
        }}>{miles(valor)}<span style={{ fontSize: 20, marginLeft: 5, opacity: 0.85 }}>W</span></div>
        <div style={{
          fontFamily: F_BODY, fontWeight: 700, fontSize: 19, letterSpacing: 2.2, marginTop: 5,
          color: rgba(V.white, 0.42 + 0.5 * lit), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
        }}>{nombre}</div>
      </div>
      {/* el cuerpo de la barra */}
      <div style={{
        position: "absolute", left: 0, top: topPx, width: w, height: alto, marginLeft: -w / 2,
        borderRadius: 3,
        background: `linear-gradient(180deg, ${rgba(tint, 0.30 + 0.5 * lit)} 0%, ${rgba(tint, 0.08 + 0.16 * lit)} 100%)`,
        boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.3 * lit)}, 0 0 ${Math.round(18 + 34 * pulse * lit)}px ${rgba(tint, 0.22 * lit)}`,
        borderTop: `3px solid ${rgba(tint, 0.6 + 0.4 * lit)}`,
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.2 * lit, mixBlendMode: "overlay",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 9px)",
        }} />
      </div>
    </div>
  );
};

// ── CHISPAS de la frontera 2: polvo de taller encendido cruzando el cuadro (materia, no fade).
const Chispas: React.FC<{ g: number; at: number; dur: number }> = ({ g, at, dur }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const env = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 42 }, (_, i) => {
        const o = rnd(i * 4.7);
        const q = clamp01(p * 1.55 - o * 0.42);
        const sz = 3 + rnd(i * 8.3) * 9;
        const c = rnd(i * 2.9) > 0.55 ? V.amber : V.copper;
        return (
          <div key={i} style={{
            position: "absolute",
            top: `${(4 + rnd(i * 6.1) * 92).toFixed(2)}%`,
            left: `${lerp(-16, 118, q).toFixed(2)}%`,
            width: sz * (1 + q * 5), height: sz, borderRadius: sz,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(c, 0.85 * env)})`,
            boxShadow: `0 0 ${Math.round(14 + sz * 2)}px ${rgba(c, 0.5 * env)}`,
          }} />
        );
      })}
      {/* el frente de polvo que empuja las chispas */}
      <div style={{
        position: "absolute", top: "-22%", height: "144%", width: "58%",
        left: `${lerp(-64, 108, p).toFixed(1)}%`,
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.concrete, 0.30 * env)} 42%, ${rgba(V.copper, 0.22 * env)} 70%, rgba(0,0,0,0) 100%)`,
        transform: "rotate(7deg)",
      }} />
    </AbsoluteFill>
  );
};

export const MovTresNumeros: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  // El build monta cada acto en su propia <Sequence>: el frame LOCAL no es el global.
  const lFrame = useCurrentFrame();
  const off = gFrame - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda un gFrame usable, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4];
  const gRaw = Number.isFinite(gFrame) ? gFrame : ACT_IN[Math.max(0, Math.min(4, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a 0 ══════════════════════════════
  const camB = gcam(g, { z0: -120, z1: 190, panX: -84, panY: 34, ry: -5.2, rx: 1.8, dur: END });
  const camZ = ip(g,
    [0, 110, 300, 420, 560, 700, 900, 1010, 1180, 1330, 1380, 1470, 1620, 1800],
    [-190, -96, -10, 40, 4, 58, -40, 46, 116, 60, -30, 46, 96, 20]);
  const camDrop = ip(g, [0, 620, 900, 1180, 1330, 1380, 1470, 1620, 1800],
    [0, -4, -8, -14, -20, -46, -104, -120, -128]);
  const camTilt = ip(g, [0, 900, 1330, 1380, 1470, 1620, 1800],
    [0, -0.6, -1.2, -2.4, -5.4, -6.0, -6.2]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — ámbar bajo (lo que hereda) → laboratorio volt → luz de mesa cálida (lo que entrega)
  const keyFrom = ip(g, [0, 90, 420, 900, 1240, 1380, 1560, 1800],
    [0.66, 0.52, 0.38, 0.30, 0.30, 0.44, 0.68, 0.80]);
  const inten = ip(g, [0, 70, 240, 420, 900, 1180, 1380, 1600, 1800],
    [0.52, 0.80, 0.92, 0.96, 1.00, 1.02, 0.92, 0.86, 0.90]);
  const floor = ip(g, [0, 300, 900, 1380, 1800], [0.62, 0.70, 0.72, 0.64, 0.52]);
  const tintA = light(ip(g, [0, 130, 1320, 1500, 1700, 1800], [0, 0.88, 1, 0.45, 0.08, 0.02]), "amber", "volt");
  const tintB = light(ip(g, [0, 420, 900, 1300, 1560, 1800], [0, 0.42, 0.76, 0.80, 0.20, 0]), "amber", "torch");

  // ══ FICHA 1 — VATIOS CONTINUOS (la pinza en el cable) ═════════════════════════════════════
  const k1 = [0, 120, 176, 300, 392, 452, 1300, 1400, 1490, 1660, 1800];
  const w1 = ip(g, k1, [1200, 1176, 1160, 980, 960, 248, 248, 262, 252, 252, 252]);
  const h1 = ip(g, k1, [676, 662, 652, 552, 540, 140, 140, 158, 152, 152, 152]);
  const x1 = ip(g, k1, [47, 46, 45, 39, 38, 11.5, 11.5, 14, 17.5, 20.5, 20.5]);
  const y1 = ip(g, k1, [46, 46, 46, 46, 46, 22, 22, 43, 70, 76, 76]);
  const z1 = ip(g, k1, [60, 50, 46, 40, 38, 150, 150, 92, 30, 26, 26]);
  const ry1 = ip(g, k1, [4, 2.4, 1.8, 0.8, 0.4, 14, 14, 11, 8, 6, 6]);
  const rx1 = ip(g, k1, [0, 0, 0, 0, 0, 0, 0, 9, 24, 26, 26]);
  const lit1 = ip(g, k1, [0.55, 1, 1, 1, 1, 0.62, 0.62, 0.82, 0.95, 0.95, 0.9]);
  const kb1 = Math.max(1.06, ip(g, [0, 146, 300, 392, 452, 1300, 1800],
    [1380, 1300, 1120, 1060, 272, 272, 268]) / Math.max(40, w1));
  const vid1 = ip(g, [0, 128, 148], [1, 1, 0]);
  const op1 = ip(g, [0, 12], [0, 1]);

  // ══ FICHA 2 — PICO DE ARRANQUE (la chapa del motor). NACE del rectángulo del display. ═════
  const k2 = [392, 444, 596, 664, 744, 900, 1000, 1114, 1180, 1268, 1300, 1400, 1500, 1660, 1800];
  const w2 = ip(g, k2, [318, 1210, 1200, 1180, 450, 450, 980, 920, 760, 232, 232, 268, 252, 252, 252]);
  const h2 = ip(g, k2, [160, 648, 644, 636, 372, 372, 560, 520, 420, 140, 140, 162, 152, 152, 152]);
  const x2 = ip(g, k2, [64, 51, 51, 51, 51, 51, 44, 44, 36, 11.5, 11.5, 16, 24.5, 29.5, 29.5]);
  const y2 = ip(g, k2, [30, 44, 44, 44, 36, 36, 40, 40, 38, 37, 37, 50, 72, 76, 76]);
  const z2 = ip(g, k2, [4, 30, 34, 36, 20, 20, 50, 50, 44, 130, 130, 92, 30, 26, 26]);
  const ry2 = ip(g, k2, [0, 0, -1, -1.5, 0, 0, -2, -2, -6, 12, 12, 9, 5, 3, 3]);
  const rx2 = ip(g, k2, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 22, 26, 26]);
  const lit2 = ip(g, k2, [0.7, 1, 1, 1, 1, 1, 1, 1, 1, 0.7, 0.7, 0.85, 0.95, 0.95, 0.9]);
  // el recorte: la Ventana crece pero el material NO se re-encuadra (eso ES el match-shape)
  const kb2 = Math.max(1.05, ip(g,
    [392, 444, 560, 600, 664, 744, 900, 1000, 1114, 1180, 1268, 1800],
    [1290, 1290, 1360, 1360, 1260, 560, 545, 1500, 1420, 1010, 262, 262]) / Math.max(40, w2));
  const vid2 = ip(g, [420, 548, 568], [1, 1, 0]) * ip(g, [392, 420], [0, 1]);
  const vid2b = ip(g, [900, 1028, 1048], [1, 1, 0]) * ip(g, [896, 902], [0, 1]);

  // ══ FICHA 3 — KILOVATIOS HORA POR DÍA (el medidor de enchufe) ═════════════════════════════
  const k3 = [268, 300, 410, 470, 1300, 1372, 1470, 1560, 1660, 1720, 1800];
  const w3 = ip(g, k3, [300, 300, 300, 232, 232, 420, 330, 348, 348, 252, 252]);
  const h3 = ip(g, k3, [182, 182, 182, 140, 140, 256, 200, 212, 212, 152, 152]);
  const x3 = ip(g, k3, [108, 79, 79, 11.5, 11.5, 46, 39, 39, 39, 39, 39]);
  const y3 = ip(g, k3, [64, 64, 64, 52, 52, 58, 70, 67, 67, 76, 76]);
  const z3 = ip(g, k3, [20, 20, 20, 140, 140, 110, 40, 110, 110, 28, 28]);
  const ry3 = ip(g, k3, [-10, -6, -6, 13, 13, 5, 3, 2, 2, 2, 2]);
  const rx3 = ip(g, k3, [0, 0, 0, 0, 0, 6, 22, 14, 14, 25, 25]);
  const lit3 = ip(g, k3, [0.8, 0.9, 0.9, 0.24, 0.24, 0.9, 1, 1, 1, 0.95, 0.92]);
  const kb3 = Math.max(1.05, ip(g, [268, 470, 1300, 1372, 1560, 1800],
    [352, 268, 258, 470, 386, 276]) / Math.max(40, w3));
  const vid3 = ip(g, [1380, 1508, 1528], [1, 1, 0]) * ip(g, [1372, 1382], [0, 1]);

  // ══ LOS DOS MOTORES QUE ACOMPAÑAN (mismo material, otra escala y otra luz) ════════════════
  const xA = ip(g, [664, 744, 900, 952], [-16, 29, 29, -20]);
  const xC = ip(g, [664, 744, 900, 952], [116, 73, 73, 120]);
  const acOn = ip(g, [660, 690, 946, 958], [0, 1, 1, 0]);

  // ══ LAS BARRAS DE PICO — nacen en el acto 2 y CRUZAN el polvo de la frontera 2 ════════════
  const barBase = ip(g, [690, 900, 952, 1300, 1380], [76, 76, 88, 88, 104]);
  const barK = ip(g, [690, 900, 952, 1300, 1380], [1, 1, 0.45, 0.45, 0.34]);
  const barXA = ip(g, [690, 900, 952], [29, 29, 68]);
  const barXB = ip(g, [690, 900, 952], [51, 51, 77]);
  const barXC = ip(g, [690, 900, 952], [73, 73, 86]);
  const barW = ip(g, [690, 900, 952], [88, 88, 46]);
  const hA = ipe(g, [700, 748], [0, 110], Easing.out(Easing.cubic)) * barK;
  const hB = ipe(g, [730, 778], [0, 240], Easing.out(Easing.cubic)) * barK;
  const hC = ipe(g, [760, 808], [0, 160], Easing.out(Easing.cubic)) * barK;
  const vA = ipe(g, [700, 748], [0, 1100], Easing.out(Easing.cubic));
  const vB = ipe(g, [730, 778], [0, 2400], Easing.out(Easing.cubic));
  const vC = ipe(g, [760, 808], [0, 1600], Easing.out(Easing.cubic));
  const barOn = ip(g, [694, 716, 1330, 1372], [0, 1, 1, 0]);
  const litPerd = ip(g, [1240, 1276], [1, 0.24]);   // los dos que no mandan, se apagan
  const litGana = ip(g, [1100, 1132], [1, 1]);

  // ══ EL CONTADOR "3 NÚMEROS" — la cifra 3 que hereda de MovDosPreguntas ════════════════════
  const cifra3X = ip(g, [0, 54, 96], [50, 24, 8.8]);
  const cifra3Y = ip(g, [0, 54, 96], [44, 26, 9.6]);
  const cifra3S = ip(g, [0, 54, 96], [190, 112, 62]);
  const pill = [ip(g, [96, 200], [0.16, 1]), ip(g, [596, 626], [0.16, 1]), ip(g, [1462, 1494], [0.16, 1])];

  // ══ LA CIFRA DE LA PINZA — 308 W ══════════════════════════════════════════════════════════
  const watts = Math.round(ip(g, [188, 200, 214, 228, 242], [0, 214, 332, 296, 308]));
  const wNumX = ip(g, [188, 392, 430, 452], [64, 64, 26, 12]);
  const wNumY = ip(g, [188, 392, 430, 452], [30, 30, 26, 22]);
  const wNumS = ip(g, [188, 392, 430, 452], [150, 150, 88, 48]);
  const wNumOn = ip(g, [184, 194, 430, 450], [0, 1, 1, 0]);

  // ══ LOS KILOVATIOS HORA — 308 W × 24 h = 7,4 kWh/día ══════════════════════════════════════
  const kwh = ip(g, [1490, 1560, 1620, 1662], [0, 4.2, 6.9, 7.4]);
  const kwhX = ip(g, [1490, 1660, 1720], [39, 39, 39]);
  const kwhY = ip(g, [1490, 1660, 1720], [50, 50, 60]);
  const kwhS = ip(g, [1490, 1660, 1720], [116, 116, 40]);
  const kwhOn = ip(g, [1484, 1498, 1700, 1722], [0, 1, 1, 0]);

  // ══ LAS LÁMINAS DE LA GUÍA — páginas REALES del PDF, apoyadas en la mesa ══════════════════
  const lamY = ipe(g, [1676, 1762], [128, 56], Easing.out(Easing.cubic));
  const lamY2 = ipe(g, [1692, 1778], [132, 60], Easing.out(Easing.cubic));
  const lamOn = g >= 1670 ? 1 : 0;
  const mesaCalida = ip(g, [1580, 1720, 1800], [0, 0.5, 0.72]);

  // ══ TEXTOS (bloques HUD) ══════════════════════════════════════════════════════════════════
  const t1 = ip(g, [186, 206, 386, 408], [0, 1, 1, 0]);      // acto 1 · vatios continuos
  const tSuma = ip(g, [528, 548, 588, 602], [0, 1, 1, 0]);   // "súmalo tú"
  const t2 = ip(g, [604, 626, 872, 894], [0, 1, 1, 0]);      // acto 2 · pico de arranque
  const tFus = ip(g, [975, 996, 1090, 1108], [0, 1, 1, 0]);  // el fusible
  const t3 = ip(g, [1124, 1148, 1318, 1344], [0, 1, 1, 0]);  // la regla del pico
  const t4 = ip(g, [1738, 1760], [0, 1]);                    // el cierre
  const sumaTach = ip(g, [1150, 1176], [0, 1]);

  // ── backdrop: cambia DURO en el frente de polvo de la frontera 2 (no hay fundido)
  const fondoTardio = g >= 900;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — 7 planos con parallax propio, bajo UNA sola cámara ══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano (el tablero eléctrico → la chapa del motor) ------------ */}
        {!fondoTardio && (
          <PhotoPlane src="img/cmegenerador/cmeg_mv_tnum1.png" kind="photo" z={-640}
            scale={ip(g, [0, 900], [1.30, 1.20])} dim={ip(g, [0, 60, 420, 900], [0.46, 0.54, 0.68, 0.74])}
            tint={V.volt} />
        )}
        {fondoTardio && (
          <PhotoPlane src="img/cmegenerador/cmeg_mv_tnum2.png" kind="photo" z={-660}
            scale={ip(g, [900, 1800], [1.34, 1.22])} dim={ip(g, [900, 1380, 1800], [0.80, 0.78, 0.72])}
            tint={V.volt} />
        )}

        {/* PLANO 2 · el aire del laboratorio: rejilla de profundidad ------------------------ */}
        <Plane z={-430}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [300, 460, 1180, 1420], [0, 0.28, 0.28, 0.05]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.10)} 0 1px, rgba(0,0,0,0) 1px 104px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.065)} 0 1px, rgba(0,0,0,0) 1px 104px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · LA MESA — sube al cuadro con la cámara (el suelo de MovEscalones) ------ */}
        {g >= 1290 && (
          <PadPlane y={ip(g, [1290, 1470, 1800], [118, 86, 82])} w={1640} h={380} rx={64}
            lit={ip(g, [1290, 1470, 1800], [0, 0.8, 0.98])} z={-150} />
        )}

        {/* PLANO 4 · EL BANCO DE TRABAJO (acto 4): entra por GEOMETRÍA, subiendo de cuadro -- */}
        {g >= 1288 && (
          <Ventana
            x={52} y={ipe(g, [1288, 1440], [142, 44], Easing.out(Easing.cubic))}
            w={1240} h={700} z={-60} rx={ip(g, [1288, 1470], [16, 6])} ry={-2}
            radius={14} lit={ip(g, [1288, 1420, 1800], [0.4, 0.9, 1])} litColor={V.amber}
          >
            <Mat photo="img/cmegenerador/cmeg_mv_tnum4.png" clip="broll/cmegenerador/cmeg_mv_tnum4.mp4"
              vid={ip(g, [1380, 1500, 1524], [1, 1, 0]) * ip(g, [1374, 1382], [0, 1])}
              w={1240} h={700}
              k={Math.max(1.05, ip(g, [1288, 1440, 1620, 1800], [1560, 1420, 1330, 1290]) / 1240)}
              cx={ip(g, [1288, 1800], [52, 47])} cy={ip(g, [1288, 1800], [46, 53])}
              lit={ip(g, [1288, 1440, 1800], [0.4, 0.9, 1])} litColor={V.amber} sheenAt={L(1416)} />
            {/* la luz de mesa cálida que entra por abajo a la derecha (el exitTo de este mov) */}
            <AbsoluteFill style={{
              background: `radial-gradient(78% 62% at 74% 108%, ${rgba(V.amber, 0.30 * mesaCalida)} 0%, rgba(0,0,0,0) 66%)`,
            }} />
          </Ventana>
        )}

        {/* PLANO 5 · EL RIEL: los tres casilleros del respaldo (estructura, no objeto) ------ */}
        {g >= 452 && g < 1420 && (
          <Plane z={110} style={{ opacity: ip(g, [452, 480, 1330, 1408], [0, 1, 1, 0]) }}>
            {[22, 37, 52].map((yy, i) => (
              <div key={i} style={{
                position: "absolute", left: "11.5%", top: `${yy}%`, width: 238, height: 146,
                marginLeft: -119, marginTop: -73, borderRadius: 10,
                border: `1px dashed ${rgba(V.volt, i === 1 && g < 1268 ? 0.30 : 0.12)}`,
                background: `linear-gradient(180deg, ${rgba(V.ink1, 0.42)} 0%, ${rgba(V.ink0, 0.2)} 100%)`,
              }} />
            ))}
          </Plane>
        )}

        {/* PLANO 6 · LAS TRES FICHAS — cada una con MATERIAL REAL adentro ------------------- */}

        {/* FICHA 1 · la pinza en el cable de entrada. Vive de g0 a g1800 sin desmontarse. */}
        <Plane z={0}>
          <Ventana x={x1} y={y1} w={w1} h={h1} z={z1} ry={ry1} rx={rx1}
            radius={g < 400 ? 14 : 10} lit={lit1} litColor={V.volt} opacity={op1}>
            <Mat photo="img/cmegenerador/cmeg_mv_tnum1.png" clip="broll/cmegenerador/cmeg_mv_tnum1.mp4"
              vid={vid1} w={w1} h={h1} k={kb1}
              cx={50 + Math.sin(g / 260) * 3.4} cy={50 + Math.cos(g / 310) * 2.6}
              lit={lit1} litColor={V.volt} sheenAt={L(26)} />
            <PieFicha n="1" valor="308 W" on={ip(g, [440, 470], [0, 1])} tint={V.volt} />
          </Ventana>
        </Plane>

        {/* FICHA 2 · NACE del rectángulo del display y se abre (MATCH-SHAPE en g420) */}
        {g >= 390 && (
          <Plane z={0}>
            <Ventana x={x2} y={y2} w={w2} h={h2} z={z2} ry={ry2} rx={rx2}
              radius={10} lit={lit2} litColor={V.volt}>
              <Mat photo="img/cmegenerador/cmeg_mv_tnum2.png" clip="broll/cmegenerador/cmeg_mv_tnum2.mp4"
                vid={Math.max(vid2, vid2b)} w={w2} h={h2} k={kb2}
                cx={50 + Math.sin(g / 230) * 3.0} cy={50 + Math.cos(g / 280) * 2.4}
                lit={lit2} litColor={V.volt} sheenAt={L(452)} />
              <PieFicha n="2" valor="2.400 W" on={ip(g, [1272, 1300], [0, 1])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* FICHA 3 · el medidor de enchufe. Espera apagada en el riel y CRUZA la frontera 3 */}
        {g >= 266 && (
          <Plane z={0}>
            <Ventana x={x3} y={y3} w={w3} h={h3} z={z3} ry={ry3} rx={rx3}
              radius={10} lit={lit3} litColor={g < 1300 ? V.steel : V.amber}
              opacity={ip(g, [266, 282], [0, 1])}>
              <Mat photo="img/cmegenerador/cmeg_mv_tnum3.png" clip="broll/cmegenerador/cmeg_mv_tnum3.mp4"
                vid={vid3} w={w3} h={h3} k={kb3}
                cx={50 + Math.sin(g / 300) * 3.0} cy={50 + Math.cos(g / 340) * 2.2}
                lit={lit3} litColor={g < 1300 ? V.steel : V.amber} sheenAt={L(1392)} />
              <PieFicha n="3" valor="7,4 kWh" on={ip(g, [1666, 1694], [0, 1])} tint={V.amber} />
            </Ventana>
          </Plane>
        )}

        {/* LOS DOS MOTORES QUE ACOMPAÑAN (acto 2): mismo material, otro recorte y otra luz */}
        {g >= 656 && g < 962 && (
          <Plane z={-10} style={{ opacity: acOn }}>
            <Ventana x={xA} y={38} w={360} h={300} z={-30} ry={9} radius={10} lit={0.82} litColor={V.sky}>
              <Mat photo="img/cmegenerador/cmeg_mv_tnum2.png" w={360} h={300} k={1.9}
                cx={34 + Math.sin(g / 190) * 2} cy={40} lit={0.82} litColor={V.sky} sheenAt={L(700)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 12px 10px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2,
                color: V.white, textTransform: "uppercase",
              }}>Refrigerador</div>
            </Ventana>
            <Ventana x={xC} y={38} w={360} h={300} z={-30} ry={-9} radius={10} lit={0.82} litColor={V.copper}>
              <Mat photo="img/cmegenerador/cmeg_mv_tnum2.png" w={360} h={300} k={2.2}
                cx={68} cy={62 + Math.cos(g / 210) * 2} lit={0.82} litColor={V.copper} sheenAt={L(760)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 12px 10px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2,
                color: V.white, textTransform: "uppercase",
              }}>Compresor</div>
            </Ventana>
          </Plane>
        )}

        {/* LAS LÁMINAS DE LA GUÍA — páginas REALES del PDF, verticales, apoyadas en la mesa */}
        {lamOn > 0 && (
          <Plane z={30}>
            <Ventana x={80.5} y={lamY2} w={248} h={351} z={-14} ry={-13} rx={13}
              radius={6} lit={0.86} litColor={V.amber} opacity={0.94}>
              <Mat photo="img/cmegenerador/cmeg_lam_podio.png" w={248} h={351} k={1.04}
                cx={50} cy={50} lit={0.86} litColor={V.amber} sheenAt={L(1742)} />
            </Ventana>
            <Ventana x={71} y={lamY} w={330} h={467} z={20} ry={-9} rx={14}
              radius={6} lit={1} litColor={V.amber}>
              <Mat photo="img/cmegenerador/cmeg_lam_60a_caros.png" w={330} h={467} k={1.04}
                cx={50} cy={50 + Math.sin(g / 240) * 1.2} lit={1} litColor={V.amber} sheenAt={L(1730)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 7 · LAS BARRAS DE PICO — capa gráfica que cruza el polvo de la frontera 2 -- */}
        {g >= 692 && g < 1376 && (
          <Plane z={40}>
            <Barra x={barXA} base={barBase} h={hA} w={barW} valor={vA} nombre="REFRIGERADOR"
              tint={V.sky} on={barOn} lit={litPerd} g={g} />
            <Barra x={barXB} base={barBase} h={hB} w={barW} valor={vB} nombre="BOMBA"
              tint={V.volt} on={barOn} lit={litGana} ganador={g >= 1240} g={g} />
            <Barra x={barXC} base={barBase} h={hC} w={barW} valor={vC} nombre="COMPRESOR"
              tint={V.copper} on={barOn} lit={litPerd} g={g} />
            {/* la línea de base: el piso del gráfico */}
            <div style={{
              position: "absolute", left: "50%", top: `${barBase}%`, width: ip(g, [900, 952], [1240, 620]),
              marginLeft: -ip(g, [900, 952], [1240, 620]) / 2,
              transform: `translateX(${ip(g, [900, 952], [0, 460]).toFixed(0)}px)`,
              height: 2, background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.white, 0.3)}, rgba(0,0,0,0))`,
              opacity: barOn,
            }} />
          </Plane>
        )}

        {/* ÍCONOS PNG como objetos de la escena ------------------------------------------- */}
        {g >= 970 && g < 1114 && (
          <Plane z={130}>
            <IconPng src="img/cmegenerador/cmeg_ic_breaker.png" x={86} y={34}
              size={ip(g, [970, 1000], [110, 152])} z={0}
              opacity={ip(g, [970, 996, 1094, 1112], [0, 1, 1, 0])}
              rot={ip(g, [970, 1110], [-7, 4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1250 && g < 1348 && (
          <Plane z={140}>
            <IconPng src="img/cmegenerador/cmeg_ic_rayo.png" x={77} y={66}
              size={ip(g, [1250, 1276], [70, 122])} z={0}
              opacity={ip(g, [1250, 1274, 1326, 1346], [0, 1, 1, 0])}
              rot={ip(g, [1250, 1344], [-14, 3])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1668 && g < 1756 && (
          <Plane z={140}>
            <IconPng src="img/cmegenerador/cmeg_ic_bateria.png" x={52} y={62}
              size={ip(g, [1668, 1694], [72, 118])} z={0}
              opacity={ip(g, [1668, 1692, 1736, 1754], [0, 0.95, 0.95, 0])}
              rot={ip(g, [1668, 1754], [8, -3])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ LA TIRA DEL CICLO — la firma del video, en sus dos usos ════════════════════ */}
      {/* acto 1: TODO lo esencial prendido AL MISMO TIEMPO (las celdas se llenan) */}
      {g >= 32 && g < 200 && (
        <DutyField duty={ip(g, [40, 90, 140, 178], [0.1, 0.4, 0.75, 1])} cells={30}
          on={ip(g, [34, 58, 168, 198], [0, 0.92, 0.92, 0])} tint={V.volt}
          y={64} w={860} h={30} cycle={150} />
      )}
      {/* acto 4: las VEINTICUATRO HORAS del apagón, llenándose */}
      {g >= 1482 && g < 1712 && (
        <DutyField duty={ip(g, [1490, 1662], [0, 1])} cells={24}
          on={ip(g, [1484, 1508, 1684, 1710], [0, 0.88, 0.88, 0])} tint={V.amber}
          y={88} w={900} h={26} cycle={130} />
      )}

      {/* ══════ COSTURA · FRONTERA 2 (g900) — WIPE POR MATERIA: chispa de polvo ═══════════ */}
      <SeamWipeMatter at={L(886)} dur={30} tint={V.copper} />
      <Chispas g={g} at={886} dur={34} />

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ═════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* EL CONTADOR: la cifra 3 que hereda de MovDosPreguntas → "3 NÚMEROS" + tres pastillas */}
        <div style={{ position: "absolute", left: `${cifra3X}%`, top: `${cifra3Y}%`, transform: "translate(-50%,-50%)" }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: cifra3S, lineHeight: 0.9,
            color: light(ip(g, [0, 96], [0, 1]), "amber", "volt"),
            textShadow: `0 0 ${Math.round(cifra3S * 0.4)}px ${rgba(V.amber, 0.3)}, 0 6px 24px rgba(0,0,0,0.92)`,
          }}>3</div>
        </div>
        <div style={{ position: "absolute", left: "11.6%", top: "8.4%", transform: "translate(-50%,-50%)", opacity: ip(g, [70, 108], [0, 1]) }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.4,
            color: rgba(V.white, 0.82), textTransform: "uppercase",
            textShadow: "0 4px 18px rgba(0,0,0,0.92)",
          }}>Números</div>
          <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
            {pill.map((p, i) => (
              <div key={i} style={{
                width: 52, height: 7, borderRadius: 4,
                background: rgba(i === 2 && g >= 1462 ? V.amber : V.volt, 0.16 + 0.76 * p),
                boxShadow: p > 0.5 ? `0 0 14px ${rgba(i === 2 && g >= 1462 ? V.amber : V.volt, 0.5 * p)}` : "none",
              }} />
            ))}
          </div>
        </div>

        {/* LA CIFRA DE LA PINZA: 308 W (cama radial para que no se pierda sobre el material) */}
        {g >= 182 && g < 452 && (
          <div style={{ opacity: wNumOn }}>
            <div style={{
              position: "absolute", left: `${wNumX}%`, top: `${wNumY}%`,
              width: wNumS * 4.2, height: wNumS * 2.6, marginLeft: -wNumS * 2.1, marginTop: -wNumS * 1.3,
              background: `radial-gradient(closest-side, rgba(8,9,6,0.80), rgba(8,9,6,0))`,
            }} />
            <Readout value={String(watts)} unit="W" label={g < 400 ? "VATIOS CONTINUOS" : undefined}
              at={L(186)} x={wNumX} y={wNumY} size={wNumS} color={V.volt} align="center" />
          </div>
        )}

        {/* LOS KILOVATIOS HORA: 308 W × 24 h */}
        {g >= 1484 && g < 1724 && (
          <div style={{ opacity: kwhOn }}>
            <div style={{
              position: "absolute", left: `${kwhX}%`, top: `${kwhY}%`,
              width: kwhS * 4.6, height: kwhS * 2.8, marginLeft: -kwhS * 2.3, marginTop: -kwhS * 1.4,
              background: `radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))`,
            }} />
            <Readout value={kwh.toFixed(1).replace(".", ",")} unit="kWh"
              label={g < 1690 ? "EN VEINTICUATRO HORAS" : undefined}
              at={L(1488)} x={kwhX} y={kwhY} size={kwhS} color={V.amber} align="center" />
          </div>
        )}

        {/* ACTO 1 · UNO. VATIOS CONTINUOS */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "76%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={640} pad={22}>
              <Kick color={V.volt}>Número uno</Kick>
              <div style={{ height: 6 }} />
              <Head size={66}>VATIOS CONTINUOS</Head>
              <div style={{ height: 8 }} />
              <Body size={30}>Todo lo esencial, prendido <Em>al mismo tiempo</Em></Body>
            </Bed>
          </div>
        )}

        {/* "SÚMALO TÚ, NO LE CREAS A NADIE" — la cola del número uno */}
        {tSuma > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "80%", opacity: tSuma, transform: `translateY(${((1 - tSuma) * 18).toFixed(1)}px)` }}>
            <Bed w={620} pad={20}>
              <Head size={54}>SÚMALO <Em>TÚ</Em></Head>
              <div style={{ height: 6 }} />
              <Body size={30}>No le creas a nadie el número</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · DOS. PICO DE ARRANQUE */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "80%", opacity: t2, transform: `translateY(${((1 - t2) * 22).toFixed(1)}px)` }}>
            <Bed w={660} pad={22}>
              <Kick color={V.volt}>Número dos</Kick>
              <div style={{ height: 6 }} />
              <Head size={66}>PICO DE ARRANQUE</Head>
              <div style={{ height: 8 }} />
              <Body size={30}>Lo que pide el aparato <Em>al encender</Em></Body>
            </Bed>
          </div>
        )}

        {/* EL FUSIBLE (g975) */}
        {tFus > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "68%", opacity: tFus, transform: `translateY(${((1 - tFus) * 18).toFixed(1)}px)` }}>
            <Bed w={600} pad={20}>
              <Head size={52}>O ARRANCA, O TE TIRA <Em color={V.amber}>EL FUSIBLE</Em></Head>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · LA REGLA DEL PICO */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "68%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={22}>
              <Kick color={V.volt}>La regla que uso</Kick>
              <div style={{ height: 6 }} />
              <Head size={64}>MANDA EL <Em>PICO MÁS ALTO</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={30}>No la suma de todos</Body>
            </Bed>
          </div>
        )}

        {/* LA SUMA TACHADA (no es la suma: es el más alto) */}
        {sumaTach > 0.01 && g < 1348 && (
          <div style={{
            position: "absolute", left: "77%", top: "73%", transform: "translate(-50%,-50%)",
            opacity: sumaTach * ip(g, [1300, 1344], [1, 0]), textAlign: "center",
          }}>
            <div style={{ position: "relative", display: "inline-block", padding: "0 10px" }}>
              <Num size={54} color={rgba(V.white, 0.5)}>5.100 W</Num>
              <div style={{
                position: "absolute", left: 0, right: 0, top: "52%", height: 5,
                background: rgba(V.amber, 0.9), transform: `scaleX(${ip(g, [1150, 1182], [0, 1])})`,
                transformOrigin: "0% 50%", boxShadow: `0 0 16px ${rgba(V.amber, 0.5)}`,
              }} />
            </div>
            <div style={{
              fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2,
              color: rgba(V.white, 0.55), marginTop: 4, textShadow: "0 3px 14px rgba(0,0,0,0.9)",
            }}>LA SUMA NO MANDA</div>
          </div>
        )}

        {/* ACTO 4 · EL CIERRE */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "26%", opacity: t4, transform: `translateY(${((1 - t4) * 24).toFixed(1)}px)` }}>
            <Bed w={620} pad={24}>
              <Kick color={V.amber}>Los tres números</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}>CON ESTO NO TE <Em color={V.amber}>VENDEN DE MÁS</Em></Head>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta de cierre: la mesa se calienta y los bordes se apagan */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(128% 108% at 50% 46%, rgba(0,0,0,0) 52%, rgba(6,7,5,${(0.30 + 0.2 * mesaCalida).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
