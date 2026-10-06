// MovCierre.tsx — S11 · EL ÚLTIMO MOVIMIENTO de `cmeurgente` (canal Claudio Mendoza Constructor).
// Tramo 1430,0 s → 1481,0 s = 51 s = 1530 cuadros a 30 fps. El video TERMINA acá.
//
// LA ESPINA: medir cuesta cincuenta dólares y una tarde; la guía es el atajo; y el código queda
// quieto en pantalla el tiempo que hace falta para levantarlo con el teléfono. El movimiento entero
// es UN viaje de cámara desde la mordaza de la pinza (cerrado, cálido, z −260) hasta la mesa de la
// cocina abierta y quieta con las dos guías (z −80). La luz NO cambia de estación: es el cierre.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ HANDOFF — el acto N+1 arranca EXACTAMENTE donde termina el acto N                          ║
// ╠════╦════════════════════════════════════════╦══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto         ║ SALE: encuadre + luz + objeto                ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: viene de MovCuandoSi, cerrada a   ║ CÁM: z≈−250, ya SUBIENDO (locY −78) con el   ║
// ║ g0 ║ la altura de la mano sobre la pinza    ║      vector de subida abierto: no frena.     ║
// ║    ║ (z −260, panY bajo).                   ║ LUZ: keyFrom 0,80→0,77, tintA ámbar apenas   ║
// ║    ║ LUZ: cálida de cierre (keyFrom 0,80,   ║      corrida hacia volt; misma estación.     ║
// ║    ║ tintA ámbar, floor 0,56).              ║ MAT: LA VENTANA BLANCA DEL MEDIDOR DE        ║
// ║    ║ MAT: la mordaza de la pinza y el       ║      ENCHUFE se despega de la foto y sube    ║
// ║    ║ medidor de enchufe sobre la mesa.      ║      con el mundo: es lo que cruza.          ║
// ║    ║                                        ║ COSTURA → MATCH-MOVE                         ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: z≈−250 subiendo, misma inercia;   ║ CÁM: z≈−205, la subida se aplana y la        ║
// ║g360║ la mesa sale por abajo y la página     ║      cámara empieza a acercarse a la página. ║
// ║    ║ entra por abajo con el MISMO vector.   ║ LUZ: keyFrom 0,77→0,74, intensidad 0,92.     ║
// ║    ║ LUZ: la misma, cálida (keyFrom 0,77).  ║ MAT: LA FILA marcada de la tabla (543×40)    ║
// ║    ║ MAT: la ventana blanca ya aterrizada   ║      queda sola en cuadro: no se apaga, se   ║
// ║    ║ como MARCA DE FILA sobre la página de  ║      ESTIRA hasta ser la página de las       ║
// ║    ║ los sesenta aparatos.                  ║      catorce acciones (mismo rectángulo).    ║
// ║    ║                                        ║ COSTURA → MATCH-SHAPE                        ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: z≈−205 acercándose, sin cortar.   ║ CÁM: z≈−185, sigue entrando; la página gira  ║
// ║g780║ LUZ: keyFrom 0,74, floor 0,50.         ║      sobre su lomo hacia el lente.           ║
// ║    ║ MAT: la fila estirada YA es la página  ║ LUZ: keyFrom 0,74→0,72; sin cambio de        ║
// ║    ║ de las catorce acciones, con la reseña ║      estación (el cierre no cambia de luz).  ║
// ║    ║ de Óscar apoyada al lado.              ║ MAT: LA PÁGINA (V.paper) se da vuelta y      ║
// ║    ║                                        ║      cruza el cuadro; detrás YA está la      ║
// ║    ║                                        ║      tarjeta clara con el código.            ║
// ║    ║                                        ║ COSTURA → OCLUSIÓN con V.paper (g918, 32f)   ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: z≈−185; el mundo respira detrás.  ║ CÁM: z≈−9 (lo más cerca del movimiento) y    ║
// ║g960║ LUZ: keyFrom 0,72, la misma.           ║      empieza a RETROCEDER en g1264.          ║
// ║    ║ MAT: EL CÓDIGO, quieto, entero, de     ║ LUZ: keyFrom 0,72→0,70, floor abriendo.      ║
// ║    ║ frente, sobre la tarjeta clara, con    ║ MAT: LA TARJETA CLARA DEL CÓDIGO se aleja    ║
// ║    ║ los dos libros apoyados al lado.       ║      con la cámara y se APOYA en la mesa     ║
// ║    ║ ⛔ NADA cruza por delante g960→g1260.  ║      como la contratapa impresa de la guía.  ║
// ║    ║                                        ║ COSTURA → MATCH-MOVE                         ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 5  ║ CÁM: retrocediendo desde z≈−9, la mesa ║ CÁM: z −80, abierta y QUIETA sobre la mesa,  ║
// ║g1260║ entera sube al cuadro con ese mismo   ║      con deriva viva. Último cuadro.         ║
// ║    ║ vector.                                ║ LUZ: keyFrom 0,70, floor 0,44: se respira.   ║
// ║    ║ LUZ: la misma, abriéndose.             ║ MAT: la mesa de la cocina con la hoja        ║
// ║    ║ MAT: la tarjeta del código apoyada en  ║      rayada, la pinza y las dos guías. El    ║
// ║    ║ la mesa + las dos guías.               ║      código sigue en cuadro hasta el final.  ║
// ║    ║                                        ║ COSTURA → fin (sos el último)                ║
// ╚════╩════════════════════════════════════════╩══════════════════════════════════════════════╝
//
// EL OBJETO QUE CRUZA CADA FRONTERA Y EN QUÉ SE TRANSFORMA:
//   g360  la VENTANA BLANCA del medidor de enchufe  →  la MARCA DE FILA de la tabla de la guía
//   g780  la MARCA DE FILA (543×40)                 →  la PÁGINA de las catorce acciones (640×880)
//   g918  la PÁGINA de papel que se da vuelta       →  la TARJETA CLARA que sostiene el código
//   g1260 la TARJETA CLARA del código               →  la contratapa impresa apoyada en la mesa
//
// ⛔ CONTRATO: ninguna <Sequence> (todas las tarjetas son kind="photo": no hay loop de clip) ·
// ⛔ sin Math.random / Date.now (todo sale de rnd(k) y de g) · sin position fixed · una sola capa
// ⛔ con blur · rutas SOLO literales · ningún fundido y ningún opacity que baje a 0 para cambiar
// ⛔ de acto (todo entra y sale por GEOMETRÍA).
// ⭐ EL CÓDIGO ES SAGRADO: se dibuja en una capa propia POR ENCIMA de todo el mundo 3D, con
//    transform fijo (sin rotación, sin escala animada, sin blur, sin deriva) de g941 a g1264. En
//    ese tramo no se monta NINGUNA capa por encima suyo. Lado del código en pantalla: 640 px de
//    imagen × 0,806 de módulo útil = 516 px ≥ 420 px.

import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, SunField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── EL RELOJ Y LAS FRONTERAS ────────────────────────────────────────────────────────────────
const END = 1530;
const A2 = 360;
const A3 = 780;
const A4 = 960;
const A5 = 1260;
const OCC_AT = 918;          // arranque de la oclusión de papel
const OCC_DUR = 32;          // cobertura total en 934, termina en 950
const QR_ON = 941;           // el código ya está armado detrás del papel
const QR_GO = 1264;          // recién acá empieza a alejarse (la ventana sagrada es 960→1260)

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── LA PÁGINA: geometría compartida por los dos actos de guía ───────────────────────────────
// Las láminas vienen ya compuestas sobre lienzo 16:9 con la página entera centrada sobre la mesa
// oscura. Una ventana de relación 640/880 = 0,727 recorta un 40,9 % horizontal centrado: la página
// (que ocupa el 35 % central) entra ENTERA, con margen. Por eso ni el ancho ni el `k` se tocan.
const PAGE_W = 640;
const PAGE_H = 880;
const PAGE2_X = 36;          // la página de los sesenta aparatos, acto 2
const PAGE2_Y = 51;
const PAGE_Z = -40;
// Las filas de la tabla, medidas sobre la lámina y traducidas a píxeles de la ventana.
const ROW_TOP = 160;
const ROW_STEP = 39.7;
const ROW_X = 36.86;         // centro de la marca de fila, en % de pantalla
const ROW_W = 543;
const ROW_H = 40;
// centro vertical de la fila i, en % de pantalla (la página está fija durante el acto 2)
const rowPct = (i: number) =>
  ((PAGE2_Y / 100) * 1080 - PAGE_H / 2 + ROW_TOP + i * ROW_STEP + ROW_H / 2) / 10.8;

// ── VENTANA — el marco de vidrio que RECORTA el material real ───────────────────────────────
// Es la primitiva del movimiento: la misma Ventana que fue la fila de la tabla se estira y se
// vuelve la página entera, sin cortar y sin un solo cuadro de negro.
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; origin?: string;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt,
        origin = "50% 50%", children }) => {
  const ww = Math.max(8, w);
  const hh = Math.max(8, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) ` +
        `rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      transformOrigin: origin,
      borderRadius: radius, overflow: "hidden",
      border: `1px solid ${rgba(litColor, 0.30 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.13)}px ${Math.round(hh * 0.2)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.24 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Ventana. La foto SIEMPRE viva por recorte animado (`k`, `cx`, `cy`),
//    nunca una estampilla quieta. `k` ≥ 1 garantiza que la foto cubre la ventana entera.
const Mat: React.FC<{
  photo: string; w: number; h: number; k: number;
  cx?: number; cy?: number; lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.02, k);
  return (
    <MediaCard src={photo} kind="photo" w={Math.max(10, w * kk)} h={Math.max(10, h * kk)}
      x={cx} y={cy} z={0} radius={0} lit={lit} litColor={litColor} sheenAt={sheenAt} />
  );
};

// ── CHIP DE PRECIO — un dato clavado a un objeto de la foto (esto SÍ es un gráfico) ─────────
const Chip: React.FC<{
  x: number; y: number; on: number; valor: string; nombre: string; tint?: string; z?: number;
}> = ({ x, y, on, valor, nombre, tint = V.volt, z = 0 }) => {
  if (on <= 0.012) return null;
  const s = 0.86 + 0.14 * clamp01(on);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateZ(${z}px) scale(${s.toFixed(3)})`,
      opacity: clamp01(on), whiteSpace: "nowrap",
    }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 12,
        padding: "12px 20px 12px 18px", borderRadius: 10,
        background: "linear-gradient(180deg, rgba(8,9,6,0.93) 0%, rgba(8,9,6,0.78) 100%)",
        border: `1px solid ${rgba(tint, 0.42)}`,
        boxShadow: `0 16px 40px rgba(0,0,0,0.7), 0 0 26px ${rgba(tint, 0.16)}`,
      }}>
        <span style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 54, lineHeight: 1, color: tint }}>{valor}</span>
        <span style={{
          fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2.4,
          color: rgba(V.white, 0.82), textTransform: "uppercase",
        }}>{nombre}</span>
      </div>
    </div>
  );
};

// ── LA MARCA DE FILA — el objeto que cruza dos fronteras ────────────────────────────────────
// Nace como la ventana blanca del display del medidor de enchufe (acto 1), aterriza sobre la tabla
// de la guía como la fila que el dedo recorre (acto 2) y se ESTIRA hasta ser la página entera de
// las catorce acciones (acto 3). Es siempre el MISMO rectángulo.
const Marca: React.FC<{ x: number; y: number; w: number; h: number; lit: number; z: number }> = ({
  x, y, w, h, lit, z,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    width: Math.max(6, w), height: Math.max(6, h),
    marginLeft: -Math.max(6, w) / 2, marginTop: -Math.max(6, h) / 2,
    transform: `translateZ(${z}px)`, borderRadius: 6,
    background: `linear-gradient(180deg, ${rgba(V.torch, 0.30 * lit)} 0%, ${rgba(V.volt, 0.12 * lit)} 100%)`,
    boxShadow: `inset 0 0 0 1px ${rgba(V.torch, 0.60 * lit)}, 0 0 26px ${rgba(V.volt, 0.30 * lit)}`,
  }} />
);

// ── EL BOTÓN DE SUSCRIBIRSE (acto 5) ────────────────────────────────────────────────────────
const Suscribir: React.FC<{ on: number; x: number; y: number }> = ({ on, x, y }) => {
  if (on <= 0.012) return null;
  const s = 0.9 + 0.1 * clamp01(on);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) scale(${s.toFixed(3)})`, opacity: clamp01(on),
      display: "flex", alignItems: "center", gap: 18,
    }}>
      <IconPng src="img/cmeurgente/cmeu_ic_mensaje.png" x={0} y={0} size={64} opacity={0.96} glow={V.ink0} />
      <div style={{
        marginLeft: 40, padding: "16px 34px", borderRadius: 999,
        background: `linear-gradient(180deg, ${rgba(V.volt, 0.95)} 0%, ${rgba(V.voltSoft, 0.95)} 100%)`,
        boxShadow: `0 18px 44px rgba(0,0,0,0.68), 0 0 30px ${rgba(V.volt, 0.24)}`,
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 3.4,
        color: V.ink0, textTransform: "uppercase",
      }}>Suscríbete</div>
    </div>
  );
};

export const MovCierre: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  const f = useCurrentFrame();
  const g = gFrame ?? f;                 // reloj CONTINUO del movimiento
  const off = g - f;                     // los componentes del Stage razonan en cuadros LOCALES
  const L = (x: number) => x - off;
  void acto;                             // el build monta el movimiento entero de una sola vez

  // ══ LA LUZ — no cambia de estación: es el cierre. Sólo se abre. ═══════════════════════════
  const keyFrom = ip(g, [0, A2, A3, A4, A5, END], [0.80, 0.77, 0.74, 0.72, 0.71, 0.70]);
  const inten = ip(g, [0, 220, A2, 620, A3, A4, 1180, A5, 1420, END],
    [0.86, 0.92, 0.92, 0.96, 0.94, 0.98, 1.0, 1.0, 0.96, 0.92]);
  const floor = ip(g, [0, A2, A3, A4, A5, 1420, END], [0.56, 0.54, 0.50, 0.48, 0.47, 0.44, 0.44]);
  const tintA = light(ip(g, [0, A3, A5, END], [0, 0.18, 0.30, 0.34]), "amber", "volt");
  const tintB = light(ip(g, [0, A4, END], [0.10, 0.34, 0.52]), "torch", "amber");

  // ══ LA CÁMARA — UN SOLO VIAJE: z −260 → −80, con desviaciones LOCALES que se SUMAN ════════
  const cam = gcam(g, { z0: -260, z1: -80, panX: 11, panY: -16, ry: -3.2, rx: 1.5, dur: END });
  // subida del acto 1 al 2 (el MATCH-MOVE), aplanada después; el acto 5 la deja quieta.
  const locY = ip(g, [0, 292, 372, 470, A3, A4, A5, 1372, END],
    [0, 0, -30, -86, -108, -114, -114, -78, -50]);
  // acercamiento progresivo y RETROCESO en la frontera 4→5 (vuelve al z de salida de la ficha)
  const locZ = ipe(g, [0, 300, 470, A3, 900, 950, A5, QR_GO, 1332, 1436, END],
    [0, 4, 26, 52, 70, 80, 80, 80, 44, 10, 0], Easing.bezier(0.3, 0.55, 0.3, 1));
  const camT = `${cam.transform} translate3d(0px, ${locY.toFixed(2)}px, ${locZ.toFixed(2)}px)`;
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;

  // ══ ACTO 1 · los dos instrumentos: cincuenta dólares y una tarde ══════════════════════════
  const h1W = ip(g, [0, 70, 210, 300, 372, 440], [900, 1092, 1160, 1180, 1180, 1180]);
  const h1H = ip(g, [0, 70, 210, 300, 372, 440], [506, 614, 653, 664, 664, 664]);
  const h1X = ip(g, [0, 210, 300, 372, 440], [54, 52, 52, 50, 47]);
  const h1Y = ip(g, [0, 210, 300, 372, 440], [56, 54, 54, 96, 152]);
  const h1K = ip(g, [0, 120, 300, 440], [1.62, 1.30, 1.16, 1.12]);
  const h1CX = 50 + Math.sin(g / 210) * 2.6;
  const h1CY = ip(g, [0, 300], [58, 50]) + Math.cos(g / 258) * 1.8;
  const h1Lit = ip(g, [0, 90, 300, 400], [0.66, 0.96, 1, 0.9]);
  const h1Ry = ip(g, [0, 210, 440], [7, 2, 0]);

  const chip30 = ip(g, [150, 172, 316, 334], [0, 1, 1, 0]);
  const chip20 = ip(g, [196, 218, 316, 334], [0, 1, 1, 0]);
  const cincuenta = ip(g, [246, 264, 330, 346], [0, 1, 1, 0]);

  // ══ EL OBJETO QUE CRUZA: la ventana blanca del medidor → la marca de fila ═════════════════
  // Nace clavada al display del medidor de enchufe, sube con el mundo en el MATCH-MOVE y aterriza
  // como la fila que el dedo recorre. Después de g744 se ESTIRA hasta ser la página del acto 3.
  const mNace = ip(g, [268, 292], [0, 1]);
  const mX = ipe(g, [268, 300, 372, 436], [66, 65, 50, ROW_X], Easing.bezier(0.32, 0.6, 0.3, 1));
  // el paso por las filas de la tabla: baja de fila en fila, con hold entre paso y paso
  const mYRow = ip(g,
    [436, 476, 504, 546, 574, 616, 644, 686, 706, 744],
    [rowPct(1), rowPct(1), rowPct(1), rowPct(4), rowPct(4), rowPct(7), rowPct(7), rowPct(10), rowPct(10), rowPct(13)]);
  const mY = ipe(g, [268, 300, 372, 436], [53.8, 53.2, 44, rowPct(1)], Easing.bezier(0.32, 0.6, 0.3, 1));
  // MATCH-SHAPE g744→g836: el MISMO rectángulo pasa de fila (543×40) a página (640×880)
  const morph = ipe(g, [744, 836], [0, 1], Easing.bezier(0.28, 0.62, 0.26, 1));
  const marX = g < 436 ? mX : lerp(ROW_X, 52, morph);
  const marY = g < 436 ? mY : lerp(mYRow, 50, morph);
  const marW = g < 372 ? ip(g, [268, 300, 372], [118, 132, 300])
    : g < 436 ? ip(g, [372, 436], [300, ROW_W]) : lerp(ROW_W, PAGE_W, morph);
  const marH = g < 372 ? ip(g, [268, 300, 372], [62, 66, 52])
    : g < 436 ? ip(g, [372, 436], [52, ROW_H]) : lerp(ROW_H, PAGE_H, morph);
  const marLit = ip(g, [268, 292, 700, 744, 800], [0, 1, 1, 0.8, 0]);

  // ══ ACTO 2 · la guía abierta en la página de los sesenta aparatos ═════════════════════════
  const p2On = g >= 330;
  const p2Y = ipe(g, [330, 372, 452], [162, 118, PAGE2_Y], Easing.bezier(0.24, 0.62, 0.28, 1));
  const p2X = ip(g, [330, 452, 744, 792, 868], [PAGE2_X, PAGE2_X, PAGE2_X, 28, -26]);
  const p2Ry = ip(g, [330, 452, 744, 792, 868], [10, 0, 0, 12, 34]);
  const p2K = ip(g, [330, 452, 744], [1.065, 1.045, 1.028]);
  const p2Lit = ip(g, [330, 400, 744, 868], [0.5, 1, 1, 0.5]);

  // el resto del libro, en profundidad: dos páginas más y las tapas
  const fanOn = ip(g, [408, 470, 730, 796], [0, 1, 1, 0]);
  const fanX = ip(g, [408, 470, 730, 796], [96, 76, 72, 104]);
  const fanX2 = ip(g, [408, 500, 730, 796], [104, 88, 84, 112]);

  // ══ ACTO 3 · las catorce acciones + la reseña de Óscar ════════════════════════════════════
  // La página del acto 3 ES la Marca estirada: se dibuja con la MISMA geometría (marX/marY/…).
  const p3Mat = g >= 744;
  const p3Ry = ip(g, [836, 900, 950], [0, 0, -74]);
  const p3XLate = ip(g, [900, 950], [0, 13]);
  const p3Lit = ip(g, [744, 812, 900, 950], [0.42, 1, 1, 0.72]);

  // ══ ACTO 4 · EL CÓDIGO — capa propia, por encima de todo, QUIETA g941→g1264 ═══════════════
  const qrOn = g >= QR_ON;
  const qrS = ipe(g, [QR_GO, 1312, 1386], [1, 0.9, 0.42], Easing.bezier(0.3, 0.6, 0.28, 1));
  const qrX = ipe(g, [QR_GO, 1312, 1386], [62, 68, 81], Easing.bezier(0.3, 0.6, 0.28, 1));
  const qrY = ipe(g, [QR_GO, 1312, 1386], [50, 58, 76], Easing.bezier(0.3, 0.6, 0.28, 1));
  // deriva: RIGUROSAMENTE cero hasta g1386. Recién cuando ya es la contratapa en la mesa respira.
  const qrDrift = g <= 1386 ? 0 : Math.sin((g - 1386) / 58) * 1.6;

  const librosOn = ip(g, [968, 1012, 1300, 1352], [0, 1, 1, 0]);
  const librosX = ip(g, [968, 1012, 1300, 1352], [15, 21, 22, 8]);
  const t4 = ip(g, [986, 1010, 1212, 1236], [0, 1, 1, 0]);

  // ══ ACTO 5 · la mesa de la cocina: la hoja rayada, la pinza y las dos guías ═══════════════
  const p5On = g >= 1244;
  const p5Y = ipe(g, [1244, 1300, 1400], [138, 74, 47], Easing.bezier(0.24, 0.6, 0.28, 1));
  const p5W = ip(g, [1244, 1400, END], [1310, 1500, 1520]);
  const p5H = ip(g, [1244, 1400, END], [737, 844, 856]);
  const p5K = ip(g, [1244, 1400, END], [1.14, 1.06, 1.035]);
  const p5Lit = ip(g, [1244, 1330, END], [0.42, 0.94, 1]);
  const p5Rx = ip(g, [1244, 1400, END], [11, 2, 0]);

  const t5 = ip(g, [1318, 1344, 1500, 1524], [0, 1, 1, 0.86]);
  const subs = ip(g, [1392, 1424], [0, 1]);
  const solOn = ip(g, [1300, 1372, END], [0, 1, 1]);

  // ══ TEXTOS DE LOS ACTOS 1-3 (todo sobre <Bed>) ════════════════════════════════════════════
  const t1 = ip(g, [84, 108, 306, 330], [0, 1, 1, 0]);
  const t2 = ip(g, [400, 428, 726, 752], [0, 1, 1, 0]);
  const t3 = ip(g, [792, 816, 856, 876], [0, 1, 1, 0]);
  const t3b = ip(g, [868, 894, 930, 950], [0, 1, 1, 0]);

  // ══ FONDO LEJANO — cambia DURO en el instante de cobertura total de la oclusión (g934) ═════
  const fondoTarde = g >= 934;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y sólo EVOLUCIONA ─────────────────────────────── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ═══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano ---------------------------------------------------- */}
        {!fondoTarde && (
          <PhotoPlane src="img/cmeurgente/cmeu_mesa_final.jpg" kind="photo" z={-700}
            scale={ip(g, [0, 934], [1.30, 1.21])}
            dim={ip(g, [0, A2, A3, 934], [0.74, 0.70, 0.66, 0.63])} tint={V.amber} />
        )}
        {fondoTarde && (
          <PhotoPlane src="img/cmeurgente/cmeu_portadas.jpg" kind="photo" z={-700}
            scale={ip(g, [934, A5, END], [1.26, 1.20, 1.14])}
            dim={ip(g, [934, A5, END], [0.64, 0.60, 0.68])} tint={V.amber} />
        )}

        {/* PLANO 2 · el aire de la cocina: rejilla suave de profundidad ------------------ */}
        <Plane z={-450}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.4).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [0, 200, A3, 1180, END], [0.06, 0.20, 0.20, 0.10, 0.04]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.amber, 0.075)} 0 1px, rgba(0,0,0,0) 1px 112px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.amber, 0.05)} 0 1px, rgba(0,0,0,0) 1px 112px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · LA MESA — el suelo sobre el que aterriza todo ----------------------- */}
        <PadPlane
          y={ip(g, [0, A2, 470, 934, A5, END], [78, 92, 128, 128, 104, 84])}
          w={1680} h={392} rx={64}
          lit={ip(g, [0, A2, 470, 934, A5, END], [0.9, 0.6, 0, 0, 0.5, 0.96])} z={-170} />

        {/* PLANO 4 · la tira de las 24 horas: la firma del video, de vuelta al final ----- */}
        <Plane z={-330}>
          <SunField sun={7 / 24} from={9} use={0.22} y={91} w={1180} h={20}
            on={ip(g, [1290, 1372, 1500, END], [0, 0.5, 0.5, 0.42])} />
        </Plane>

        {/* PLANO 5 · ACTO 1 — LOS DOS INSTRUMENTOS (la pinza de 30, el medidor de 20) ---- */}
        {g < 470 && (
          <Plane z={0}>
            <Ventana x={h1X} y={h1Y} w={h1W} h={h1H} z={20} ry={h1Ry} rx={ip(g, [0, 372, 470], [0, 0, -9])}
              radius={14} lit={h1Lit} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_pinza_mesa.jpg" w={h1W} h={h1H} k={h1K}
                cx={h1CX} cy={h1CY} lit={h1Lit} litColor={V.amber} sheenAt={L(96)} />
              {/* la luz de mesa que entra por abajo a la derecha: el cierre es cálido */}
              <AbsoluteFill style={{
                background: `radial-gradient(74% 60% at 78% 112%, ${rgba(V.amber, 0.24)} 0%, rgba(0,0,0,0) 64%)`,
              }} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 6 · ACTO 2 — LA GUÍA ABIERTA en la página de los sesenta aparatos ------- */}
        {p2On && g < 880 && (
          <Plane z={PAGE_Z}>
            <Ventana x={p2X} y={p2Y} w={PAGE_W} h={PAGE_H} z={0} ry={p2Ry}
              rx={ip(g, [330, 452], [8, 0])} radius={10} lit={p2Lit} litColor={V.bone}
              origin="0% 50%">
              <Mat photo="img/cmeurgente/cmeu_lam_60a_caros.jpg" w={PAGE_W} h={PAGE_H} k={p2K}
                cx={50} cy={50 + Math.sin(g / 246) * 0.9} lit={p2Lit} litColor={V.bone}
                sheenAt={L(470)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 6b · el resto del libro, en profundidad (las otras páginas de la guía) --- */}
        {fanOn > 0.012 && (
          <Plane z={-250} style={{ opacity: clamp01(fanOn) }}>
            <Ventana x={fanX} y={44} w={300} h={412} z={0} ry={-15} rot={-3}
              radius={8} lit={0.5} litColor={V.bone}>
              <Mat photo="img/cmeurgente/cmeu_lam_7conexiones.jpg" w={300} h={412} k={1.05}
                cx={50} cy={50} lit={0.5} litColor={V.bone} />
            </Ventana>
            <Ventana x={fanX2} y={72} w={264} h={363} z={-120} ry={-19} rot={4}
              radius={8} lit={0.38} litColor={V.bone}>
              <Mat photo="img/cmeurgente/cmeu_lam_cablefusible.jpg" w={264} h={363} k={1.05}
                cx={50} cy={50} lit={0.38} litColor={V.bone} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 7 · EL RECTÁNGULO QUE CRUZA TODO — display → fila → página -------------- */}
        {/* Hasta g744 es la MARCA (la ventana blanca del medidor, después la fila marcada).
            Desde g744 el MISMO rectángulo lleva adentro la página de las catorce acciones y se
            estira hasta ser esa página: MATCH-SHAPE, sin un solo cuadro de fundido. */}
        {p3Mat && (
          <Plane z={PAGE_Z}>
            <Ventana x={marX + p3XLate} y={marY} w={marW} h={marH} z={6}
              ry={p3Ry} rx={ip(g, [744, 836], [0, 0])}
              radius={ip(g, [744, 836], [6, 10])} lit={p3Lit} litColor={V.bone}
              origin="0% 50%">
              <Mat photo="img/cmeurgente/cmeu_lam_14acciones.jpg" w={marW} h={marH}
                k={ip(g, [744, 836, 900], [1.06, 1.04, 1.03])}
                cx={50} cy={50 + Math.sin(g / 232) * 0.8} lit={p3Lit} litColor={V.bone}
                sheenAt={L(852)} />
            </Ventana>
          </Plane>
        )}
        {!p3Mat && mNace > 0.012 && (
          <Plane z={PAGE_Z}>
            <Marca x={marX} y={marY} w={marW} h={marH} lit={marLit * mNace} z={8} />
          </Plane>
        )}
        {p3Mat && g < 812 && (
          <Plane z={PAGE_Z}>
            <Marca x={marX} y={marY} w={marW} h={marH} lit={marLit} z={14} />
          </Plane>
        )}

        {/* PLANO 8 · ACTO 5 — LA MESA DE LA COCINA, entera, subiendo al cuadro ----------- */}
        {p5On && (
          <Plane z={-20}>
            <Ventana x={48} y={p5Y} w={p5W} h={p5H} z={0} ry={ip(g, [1244, 1400], [-4, 0])}
              rx={p5Rx} radius={14} lit={p5Lit} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_mesa_final.jpg" w={p5W} h={p5H} k={p5K}
                cx={50 + Math.sin(g / 268) * 1.4} cy={ip(g, [1244, END], [54, 50])}
                lit={p5Lit} litColor={V.amber} sheenAt={L(1352)} />
              <AbsoluteFill style={{
                background: `radial-gradient(80% 64% at 26% -10%, ${rgba(V.torch, 0.16)} 0%, rgba(0,0,0,0) 62%)`,
              }} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 9 · LOS DOS LIBROS apoyados al lado del código (acto 4) ----------------- */}
        {librosOn > 0.012 && (
          <Plane z={-90} style={{ opacity: clamp01(librosOn) }}>
            <Ventana x={librosX} y={ip(g, [968, 1012, 1352], [88, 79, 74])} w={470} h={264} z={0}
              ry={9} rx={ip(g, [968, 1012], [12, 4])} radius={12}
              lit={ip(g, [968, 1030], [0.4, 0.94])} litColor={V.amber}>
              <Mat photo="img/cmeurgente/cmeu_portadas.jpg" w={470} h={264} k={1.1}
                cx={50 + Math.sin(g / 214) * 1.6} cy={50} lit={0.94} litColor={V.amber}
                sheenAt={L(1046)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 10 · PRIMER PLANO — lo que pasa POR DELANTE de todo ---------------------
            ⛔ Ninguno de estos objetos existe entre g950 y g1268: en la ventana del código no
               cruza NADA por delante. */}
        {g < 340 && (
          <Plane z={250}>
            <IconPng src="img/cmeurgente/cmeu_ic_billete.png"
              x={ip(g, [40, 330], [-10, 34])} y={ip(g, [40, 330], [104, 88])}
              size={ip(g, [40, 330], [300, 220])} rot={ip(g, [40, 330], [-14, 6])}
              opacity={ip(g, [40, 84, 300, 336], [0, 0.9, 0.9, 0])} glow={V.ink0} />
          </Plane>
        )}
        {g > 160 && g < 470 && (
          <Plane z={318}>
            <IconPng src="img/cmeurgente/cmeu_ic_moneda.png"
              x={ip(g, [170, 460], [112, 62])} y={ip(g, [170, 460], [24, -18])}
              size={ip(g, [170, 460], [190, 250])} rot={ip(g, [170, 460], [10, -22])}
              opacity={ip(g, [170, 208, 420, 464], [0, 0.86, 0.86, 0])} glow={V.ink0} />
          </Plane>
        )}
        {g > 430 && g < 700 && (
          <Plane z={214}>
            <IconPng src="img/cmeurgente/cmeu_ic_lupa.png"
              x={ip(g, [440, 690], [-14, 44])} y={ip(g, [440, 690], [116, 96])}
              size={ip(g, [440, 690], [250, 210])} rot={ip(g, [440, 690], [-22, 4])}
              opacity={ip(g, [440, 486, 646, 694], [0, 0.82, 0.82, 0])} glow={V.ink0} />
          </Plane>
        )}
        {g > 1268 && (
          <Plane z={262}>
            <IconPng src="img/cmeurgente/cmeu_ic_pinza.png"
              x={ip(g, [1284, 1470], [-12, 26])} y={ip(g, [1284, 1470], [112, 96])}
              size={ip(g, [1284, 1470], [320, 250])} rot={ip(g, [1284, 1470], [-18, 2])}
              opacity={ip(g, [1284, 1332, 1450, 1500], [0, 0.82, 0.82, 0])} glow={V.ink0} />
          </Plane>
        )}
        {solOn > 0.012 && (
          <Plane z={-150} style={{ opacity: clamp01(solOn) * 0.55 }}>
            <IconPng src="img/cmeurgente/cmeu_ic_sol.png"
              x={12} y={ip(g, [1300, END], [24, 18])} size={150} opacity={0.7} glow={V.amber} />
          </Plane>
        )}

        {/* PLANO 11 · el polvo de la cocina, delante de todo el mundo 3D ----------------- */}
        <Plane z={330} style={{ opacity: ip(g, [0, 200, 950, 1268, END], [0.3, 0.42, 0.42, 0.34, 0.3]) }}>
          {Array.from({ length: 16 }, (_, i) => {
            const sp = 0.3 + rnd(i * 4.7) * 0.8;
            const yy = ((rnd(i * 2.3) * 120 - (g * sp) / 22) % 120 + 120) % 120 - 10;
            const oculto = g > 946 && g < 1272;         // el código no se toca
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 8.1) * 100).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 3 + rnd(i * 3.7) * 3, height: 3 + rnd(i * 3.7) * 3, borderRadius: "50%",
                background: rgba(V.torch, oculto ? 0 : 0.1 + rnd(i * 6.1) * 0.14),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ═════════ HUD — todo el texto sobre <Bed>, y todo fuera de la zona del código ══════ */}

      {/* ACTO 1 · CINCUENTA DÓLARES Y UNA TARDE */}
      {t1 > 0.012 && (
        <div style={{
          position: "absolute", left: "5.6%", top: "16%", width: 720,
          opacity: clamp01(t1), transform: `translateY(${((1 - t1) * 26).toFixed(1)}px)`,
        }}>
          <Bed pad={30}>
            <Kick color={V.amber}>LO QUE CUESTA SABER</Kick>
            <div style={{ height: 12 }} />
            <Head size={72}>CINCUENTA DÓLARES<br />Y UNA <Em color={V.volt}>TARDE</Em></Head>
          </Bed>
        </div>
      )}
      <Chip x={ip(g, [150, 330], [67, 69])} y={ip(g, [150, 330], [36, 33])} on={chip30}
        valor="$30" nombre="la pinza" tint={V.volt} />
      <Chip x={ip(g, [196, 330], [80, 82])} y={ip(g, [196, 330], [64, 61])} on={chip20}
        valor="$20" nombre="el medidor" tint={V.volt} />
      {cincuenta > 0.012 && (
        <div style={{ opacity: clamp01(cincuenta) }}>
          <Readout value="$50" label="Y NO SE GASTA OTRA VEZ" at={L(250)} x={74} y={49}
            size={148} color={V.amber} />
        </div>
      )}

      {/* ACTO 2 · SESENTA APARATOS MEDIDOS */}
      {t2 > 0.012 && (
        <div style={{
          position: "absolute", left: "62%", top: "30%", width: 640,
          opacity: clamp01(t2), transform: `translateY(${((1 - t2) * 24).toFixed(1)}px)`,
        }}>
          <Bed pad={30}>
            <Kick color={V.volt}>LA HOJA QUE YA ESTÁ HECHA</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>SESENTA APARATOS<br /><Em color={V.volt}>MEDIDOS</Em></Head>
            <div style={{ height: 16 }} />
            <Body size={30}>Vatios reales y horas por día. Tú buscas los tuyos y sumas.</Body>
          </Bed>
        </div>
      )}

      {/* ACTO 3 · CATORCE COSAS, ONCE GRATIS */}
      {t3 > 0.012 && (
        <div style={{
          position: "absolute", left: "6%", top: "22%", width: 620,
          opacity: clamp01(t3), transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)`,
        }}>
          <Bed pad={30}>
            <Head size={74}>CATORCE COSAS,<br />ONCE <Em color={V.volt}>GRATIS</Em></Head>
          </Bed>
        </div>
      )}
      {t3b > 0.012 && (
        <div style={{
          position: "absolute", left: "6%", top: "56%", width: 620,
          opacity: clamp01(t3b), transform: `translateY(${((1 - t3b) * 22).toFixed(1)}px)`,
        }}>
          <Bed pad={30}>
            <Body size={38} color={V.white}>«Hice cuatro. Bajé ochenta dólares.»</Body>
            <div style={{ height: 12 }} />
            <Kick color={V.amber}>ÓSCAR · 52 AÑOS</Kick>
          </Bed>
        </div>
      )}

      {/* ACTO 4 · EL CÓDIGO — el bloque de texto vive a la IZQUIERDA, lejos de la tarjeta */}
      {t4 > 0.012 && (
        <div style={{
          position: "absolute", left: "4.4%", top: "38%", width: 600,
          opacity: clamp01(t4), transform: `translateY(${((1 - t4) * 20).toFixed(1)}px)`,
        }}>
          <Bed pad={30}>
            <Kick color={V.amber}>LAS DOS GUÍAS, EN EL MISMO SITIO</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>EL <Em color={V.volt}>CÓDIGO</Em></Head>
            <div style={{ height: 14 }} />
            <Body size={29}>Apunta la cámara del teléfono. Se abre solo.</Body>
          </Bed>
        </div>
      )}

      {/* ACTO 5 · MIDE ANTES DE COMPRAR */}
      {t5 > 0.012 && (
        <div style={{
          position: "absolute", left: "6.2%", top: "13%", width: 700,
          opacity: clamp01(t5), transform: `translateY(${((1 - t5) * 20).toFixed(1)}px)`,
        }}>
          <Bed pad={32}>
            <Head size={84}>MIDE ANTES<br />DE <Em color={V.volt}>COMPRAR</Em></Head>
          </Bed>
        </div>
      )}
      <Suscribir on={subs} x={25} y={88} />

      {/* ══════════════════════════════════════════════════════════════════════════════════
          ⭐ EL CÓDIGO — CAPA PROPIA, FUERA DE LA CÁMARA, POR ENCIMA DE TODO EL MUNDO.
          De g941 a g1264 el transform es EXACTAMENTE `translate(-50%,-50%) scale(1)`: no rota,
          no escala, no se desenfoca, no deriva y nada se dibuja por delante. Son 323 cuadros
          (10,8 s) por encima de los 9 s pedidos. El módulo útil del PNG mide 640 × 0,806 = 516 px.
          Después de g1264 la MISMA tarjeta se aleja con la cámara y se apoya en la mesa: es el
          objeto que cruza la frontera 4→5.
      ══════════════════════════════════════════════════════════════════════════════════════ */}
      {qrOn && (
        <div style={{
          position: "absolute", left: `${qrX}%`, top: `${qrY}%`,
          width: 760, height: 880, marginLeft: -380, marginTop: -440,
          transform: `translateY(${qrDrift.toFixed(2)}px) scale(${qrS.toFixed(4)})`,
          transformOrigin: "50% 50%",
          borderRadius: 20,
          background: "linear-gradient(168deg, #F6F3EA 0%, #EDE7DA 62%, #DFD8C8 100%)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.72), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.7)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "44px 60px 40px",
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4.6,
            color: "#5A6B12", textTransform: "uppercase",
          }}>La guía completa</div>
          <div style={{ height: 18 }} />
          <Img src={staticFile("img/cmeurgente/cmeu_qr.png")}
            style={{ width: 640, height: 640, display: "block", imageRendering: "pixelated" }} />
          <div style={{ height: 20 }} />
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 44, letterSpacing: 1.2,
            color: "#14170E",
          }}>claudiomendoza.vercel.app</div>
        </div>
      )}

      {/* ══ COSTURA 3→4 · OCLUSIÓN CON V.paper — la página se da vuelta y tapa el cuadro ══
          Se monta DESPUÉS del código a propósito: es lo único que puede pasarle por delante, y
          desaparece en g950, diez cuadros antes de que arranque la ventana sagrada. */}
      {g >= OCC_AT && g < OCC_AT + OCC_DUR + 2 && (
        <SeamOcclude at={L(OCC_AT)} dur={OCC_DUR} color={V.paper} angle={-7} lit={0.34} />
      )}
    </AbsoluteFill>
  );
};

export default MovCierre;
