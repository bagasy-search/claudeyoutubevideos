// MovDosCaminos.tsx — S10 · video `cmeurgente` (canal "Claudio Mendoza Constructor")
// Tramo 1233,0 s → 1300,0 s = 67 s = 2010 cuadros a 30 fps. `gFrame` va de 0 a 2010.
//
// LA ESPINA: los dos caminos de Ernesto puestos uno al lado del otro, con los números fríos —
// INCLUIDA LA PARTE QUE NO ME CONVIENE. El panel también se paga. Sólo que en once años. Y los
// ciento veintiséis dólares se pagaron en cinco semanas. Ese es el orden, y se lee por el LARGO
// de las dos barras en pantalla, no por el número escrito.
//
// ⚠️ En este tramo el avatar va EN BUCLE Y MUTEADO: NO hay fondo garantizado debajo. Por eso la
//    raíz es un AbsoluteFill OPACO (V.ink0) + VoltAtmos montado en el cuadro 0 y nunca desmontado:
//    todo instante del movimiento está cubierto a pantalla completa.
//
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ HANDOFF — el acto N+1 arranca EXACTAMENTE donde termina el acto N                            ║
// ╠════╦════════════════════════════════════════════╦════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto             ║ SALE: encuadre + luz + objeto              ║
// ╠════╬════════════════════════════════════════════╬════════════════════════════════════════════╣
// ║ 1  ║ CÁM: viene de MovArrendamiento — media,    ║ CÁM: ya CRUZANDO a la derecha (camX +650→  ║
// ║ g0 ║ retrocediendo desde el cartel de SE VENDE  ║      +300 y cayendo), ry +3,2→+0,6. No     ║
// ║    ║ (z −60), con panX +10 de inercia hacia la  ║      frena en la frontera: la atraviesa.   ║
// ║    ║ derecha.                                    ║ LUZ: keyFrom 0,20→0,38; el frío empieza a  ║
// ║    ║ LUZ: TARDE ABIERTA, fría, key a la izq     ║      ceder, el ámbar asoma por la derecha. ║
// ║    ║ (keyFrom 0,20, tint sky, int 0,86).        ║ MAT: LA COLUMNA-COSTURA (Claudio y el      ║
// ║    ║ MAT: los DOS PRESUPUESTOS. El mundo FRÍO   ║      vecino con los dos papeles) entrando   ║
// ║    ║ (23.000 + factura de 187) centrado.        ║      al centro pegada al lente.            ║
// ╠════╬════════════════════════════════════════════╬════════════════════════════════════════════╣
// ║ 2  ║ CÁM: mismo vector hacia la derecha, sin    ║ CÁM: frenando y bajando sobre el ticket    ║
// ║g450║ frenar (camX +300 → −250 → −618).          ║      (camX −618, camZ +30, ry −3,0).       ║
// ║    ║ LUZ: cruzando de FRÍA a CÁLIDA (keyFrom    ║ LUZ: cálida plena (keyFrom 0,78, tint2     ║
// ║    ║ 0,38→0,78, tint2 → amber).                 ║      amber pleno, int 1,00).               ║
// ║    ║ MAT: la columna-costura terminando de      ║ MAT: EL TICKET DE 126 — su rectángulo ya   ║
// ║    ║ pasar y el mundo CÁLIDO (126 + factura de  ║      empezó a tumbarse y a estirarse: deja ║
// ║    ║ 88) entrando por la derecha.               ║      de ser tarjeta y se vuelve barra.     ║
// ╠════╬════════════════════════════════════════════╬════════════════════════════════════════════╣
// ║ 3  ║ CÁM: bajando y acercándose al ticket ya    ║ CÁM: empezando a retroceder (camZ +58 →    ║
// ║g900║ tumbado (camZ +30 → +58).                  ║      +22 → +6).                            ║
// ║    ║ LUZ: cálida con la key volviendo al centro ║ LUZ: keyFrom 0,58, int 1,04 — el amanecer  ║
// ║    ║ (keyFrom 0,78→0,64).                       ║      ya está subiendo detrás.              ║
// ║    ║ MAT: el ticket convertido en LA BARRA DE   ║ MAT: EL PRESUPUESTO GRANDE (los 23.000 del ║
// ║    ║ CINCO SEMANAS, con el material del ticket  ║      acto 1) volviendo del fondo, crece    ║
// ║    ║ corriendo adentro.                         ║      hasta el lente y CRUZA el cuadro.     ║
// ╠════╬════════════════════════════════════════════╬════════════════════════════════════════════╣
// ║ 4  ║ CÁM: retrocediendo, misma curva. La escala ║ CÁM: sigue retrocediendo hasta FRONTAL     ║
// ║g1350║ del eje ya se abrió detrás del papel.      ║      (camZ −50, ry → 0, camX plano).       ║
// ║    ║ LUZ: amanecer subiendo (keyFrom 0,56,      ║ LUZ: AMANECER casi pleno (int 1,05, floor  ║
// ║    ║ tint volt, floor 0,44).                    ║      0,40): entra aire.                    ║
// ║    ║ MAT: el presupuesto, YA CONVERTIDO en la   ║ MAT: LAS DOS BARRAS entrando juntas al     ║
// ║    ║ barra larguísima de once años, sobre el    ║      cuadro por el retroceso de la cámara. ║
// ║    ║ tejado con 0,6 de paneles.                 ║                                            ║
// ╠════╬════════════════════════════════════════════╬════════════════════════════════════════════╣
// ║ 5  ║ CÁM: frontal, quieta, con deriva viva.     ║ CÁM: FRONTAL Y QUIETA (z −110, ry 0) — el  ║
// ║g1740║ LUZ: amanecer pleno.                       ║      encuadre con el que abre MovCuandoSi. ║
// ║    ║ MAT: las dos barras enfrentadas: la corta  ║ LUZ: AMANECER LIMPIO PLENO, floor 0,38,    ║
// ║    ║ encendida en volt, la larga apagada.       ║      aire, nada de dramatismo.             ║
// ║    ║                                            ║ MAT: EL PAPEL del camino dos (la hoja)     ║
// ║    ║                                            ║      apoyado bajo la barra corta.          ║
// ╚════╩════════════════════════════════════════════╩════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido y ninguna baja un opacity a 0:
//   g450  1→2  MATCH-MOVE   — la cámara NO corta: sigue su dolly lateral hacia la derecha y CRUZA
//                             de un lado del split al otro. La columna-costura (la foto de los dos
//                             hombres comparando los dos papeles) pasa pegada al lente con parallax
//                             de primer plano (×1,28) mientras el mundo frío sale por la izquierda
//                             y el cálido entra por la derecha. El mundo cambia debajo del mismo
//                             vector de cámara.  OBJETO QUE CRUZA: la columna → la bisagra entre
//                             los dos caminos, que después se convierte en la tarjeta de cierre.
//   g900  2→3  MATCH-SHAPE  — EL MISMO Marco del ticket (340×430, vertical, inclinado) interpola
//                             sin cortarse a 1040×96 horizontal: la tarjeta SE VUELVE la barra de
//                             cinco semanas, con el material del ticket todavía corriendo adentro.
//                             Una sola forma entrega y recibe.  OBJETO: el ticket → la barra.
//   g1350 3→4  OCLUSIÓN     — <SeamOcclude color={V.paper}> con el presupuesto REAL haciendo la
//                             oclusión: el Marco de los 23.000 vuelve del fondo, crece hasta 3.400
//                             px pegado al lente y cruza. Detrás, el eje de tiempo ya se rescaló
//                             (de 188 px por semana a 2,7). OBJETO: el presupuesto → la barra de
//                             once años (mismo Marco, mismo material, otra forma).
//   g1740 4→5  MATCH-MOVE   — la cámara retrocede (camZ +6 → −50) y el retroceso mismo mete a las
//                             dos barras en el cuadro. Nada aparece: entra todo por geometría.
//                             OBJETO: la barra corta (el ex-ticket) se enciende en volt.
//
// ⛔ CONTRATO: un solo archivo, un solo reloj `g`, ninguna <Sequence> envolviendo un acto ·
//    sin Math.random ni Date.now (todo sale de rnd(k) y de g) · sin position fixed · cero capas
//    con filter blur propias · rutas de asset LITERALES y sólo las de la ficha.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, RoofPlane, SunField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── EL RELOJ Y LAS FRONTERAS ────────────────────────────────────────────────────────────────
const END = 2010;
const A2 = 450;
const A3 = 900;
const A4 = 1350;
const A5 = 1740;
const OCC = 1336;          // el presupuesto empieza a cruzar el cuadro

// ── EL MAPA DEL MUNDO (coordenadas en % de pantalla dentro de la capa 3D) ───────────────────
// Un solo dolly lateral recorre las dos estaciones: el mundo FRÍO y el mundo CÁLIDO. El acto 3,
// el 4 y el 5 se arman EN LA MISMA estación cálida: la cámara nunca se teletransporta, sólo
// desacelera y retrocede.
const WA = 22;             // estación A · el camino uno (frío)
const WB = 78;             // estación B · el camino dos (cálido) — y el escenario de los actos 3-5
const X0 = 84;             // centro de la barra de ONCE AÑOS
const LARGO = 1560;        // px de la barra de once años (once años = 572 semanas)
const NUB = 14;            // px de la barra de cinco semanas a la MISMA escala (1560 × 5/572)
const XN = X0 - (LARGO / 2) / 19.2 + (NUB / 2) / 19.2;   // centro de la barra corta, mismo origen

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── MARCO — el vidrio que RECORTA el material. Es la primitiva de este movimiento: el mismo
//    Marco que fue tarjeta se vuelve barra sin cortarse (ahí vive el match-shape).
const Marco: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number; children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(6, w);
  const hh = Math.max(6, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      transformStyle: "preserve-3d",
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.30 * lit)}`,
      boxShadow: `0 ${Math.round(Math.min(140, hh * 0.15))}px ${Math.round(Math.min(200, hh * 0.24))}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro del Marco: la FOTO siempre (con recorte animado = nunca queda quieta) y el
//    CLIP encima donde de verdad corre. `k` es el zoom de recorte: ≥1 para que siempre cubra.
const Mat: React.FC<{
  photo?: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
  const iw = Math.max(10, w * kk);
  const ih = Math.max(10, h * kk);
  return (
    <>
      {photo && (
        <MediaCard src={photo} kind="photo" w={iw} h={ih} x={cx} y={cy} z={0}
          radius={0} lit={lit} litColor={litColor} sheenAt={sheenAt} />
      )}
      {clip && vid > 0.004 && (
        <MediaCard src={clip} kind="video" w={iw} h={ih} x={cx} y={cy} z={0}
          radius={0} lit={lit} litColor={litColor} opacity={clamp01(vid)} />
      )}
    </>
  );
};

// ── EL RELLENO DE UNA BARRA: lo que se paga. Va DENTRO del Marco, encima del material.
const Relleno: React.FC<{ p: number; color: string; glow?: number }> = ({ p, color, glow = 1 }) => {
  const q = clamp01(p);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: `${(q * 100).toFixed(3)}%`,
        background: `linear-gradient(90deg, ${rgba(color, 0.55)} 0%, ${rgba(color, 0.78)} 74%, ${rgba(color, 0.95)} 100%)`,
        boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.42)}, 0 0 ${Math.round(26 * glow)}px ${rgba(color, 0.48 * glow)}`,
        mixBlendMode: "screen",
      }} />
      {q > 0.0015 && q < 0.998 && (
        <div style={{
          position: "absolute", left: `${(q * 100).toFixed(3)}%`, top: 0, bottom: 0,
          width: 4, marginLeft: -2, background: rgba(V.white, 0.88),
          boxShadow: `0 0 ${Math.round(22 * glow)}px ${rgba(color, 0.92)}`,
        }} />
      )}
    </AbsoluteFill>
  );
};

// ── EL EJE DE TIEMPO: las marcas y los rótulos de una barra. Esto SÍ es un gráfico (no un objeto
//    real disfrazado), así que va en vectores.
const Ejes: React.FC<{
  x: number; y: number; w: number; n: number; tint: string; on: number;
  unidad: string; marca?: number[]; z?: number;
}> = ({ x, y, w, n, tint, on, unidad, marca = [], z = 0 }) => {
  if (on <= 0.01) return null;
  const ww = Math.max(10, w);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: ww, marginLeft: -ww / 2,
      transform: `translateZ(${z}px)`, opacity: clamp01(on),
    }}>
      {Array.from({ length: n + 1 }, (_, i) => {
        const rot = marca.indexOf(i) >= 0;
        const alto = rot ? 26 : 13;
        return (
          <div key={i} style={{
            position: "absolute", left: `${((i / n) * 100).toFixed(3)}%`, top: -alto - 8,
            width: rot ? 2 : 1, height: alto, marginLeft: rot ? -1 : 0,
            background: rgba(tint, rot ? 0.78 : 0.30),
            boxShadow: rot ? `0 0 10px ${rgba(tint, 0.4)}` : "none",
          }} />
        );
      })}
      {marca.map((i) => (
        <div key={`m${i}`} style={{
          position: "absolute", left: `${((i / n) * 100).toFixed(3)}%`, top: -66,
          transform: "translateX(-50%)", whiteSpace: "nowrap",
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 26, color: rgba(tint, 0.9),
          textShadow: "0 3px 14px rgba(0,0,0,0.92)",
        }}>{i}</div>
      ))}
      <div style={{
        position: "absolute", left: "100%", top: -62, marginLeft: 16, whiteSpace: "nowrap",
        fontFamily: F_BODY, fontWeight: 700, fontSize: 20, letterSpacing: 3,
        color: rgba(V.white, 0.5), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
      }}>{unidad}</div>
    </div>
  );
};

// ── PLACA: una cama oscura con texto, posicionada en coordenadas del mundo 3D.
const Placa: React.FC<{
  x: number; y: number; on: number; w?: number | string; z?: number; children: React.ReactNode;
}> = ({ x, y, on, w = "auto", z = 0, children }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateZ(${z}px) translateY(${((1 - clamp01(on)) * 18).toFixed(1)}px)`,
      opacity: clamp01(on),
    }}>
      <Bed pad={16} w={w}>{children}</Bed>
    </div>
  );
};

// ── HALO: la piscina de luz de cada mundo del split. Frío a la izquierda, cálido a la derecha.
const Halo: React.FC<{ x: number; y: number; w: number; h: number; color: string; a: number }> = ({ x, y, w, h, color, a }) => {
  if (a <= 0.004) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, pointerEvents: "none",
      background: `radial-gradient(closest-side, ${rgba(color, 0.30 * a)} 0%, ${rgba(color, 0.10 * a)} 46%, rgba(0,0,0,0) 76%)`,
    }} />
  );
};

// ── FIBRAS DE PAPEL: el polvo que levanta el presupuesto al cruzar (materia, no fundido).
const Fibras: React.FC<{ g: number; at: number; dur: number }> = ({ g, at, dur }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const env = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 34 }, (_, i) => {
        const o = rnd(i * 4.1);
        const q = clamp01(p * 1.5 - o * 0.38);
        const sz = 2 + rnd(i * 7.9) * 6;
        return (
          <div key={i} style={{
            position: "absolute",
            top: `${(3 + rnd(i * 5.3) * 94).toFixed(2)}%`,
            left: `${lerp(-18, 120, q).toFixed(2)}%`,
            width: sz * (1 + q * 4.2), height: sz, borderRadius: sz,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.paper, 0.62 * env)})`,
            boxShadow: `0 0 ${Math.round(10 + sz * 1.6)}px ${rgba(V.bone, 0.30 * env)}`,
            transform: `rotate(${(rnd(i * 3.7) * 16 - 8).toFixed(1)}deg)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LÍNEA GUÍA: del objeto a su rótulo. Vector puro, y sólo para lo que ES un gráfico.
const Guia: React.FC<{ x: number; y0: number; y1: number; tint: string; on: number }> = ({ x, y0, y1, tint, on }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${Math.min(y0, y1)}%`,
      height: `${Math.abs(y1 - y0)}%`, width: 2, marginLeft: -1,
      background: `linear-gradient(180deg, ${rgba(tint, 0.05)} 0%, ${rgba(tint, 0.62)} 100%)`,
      opacity: clamp01(on), transformOrigin: "50% 100%",
      transform: `scaleY(${clamp01(on).toFixed(3)})`,
    }} />
  );
};

export const MovDosCaminos: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El movimiento se monta con UNA sola <Sequence>; aun así traduzco los `at`/`sheenAt` por si
  // el build recorta: los componentes del Stage razonan en cuadros LOCALES.
  const lFrame = useCurrentFrame();
  const off = (Number.isFinite(gFrame as number) ? (gFrame as number) : lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UN SOLO VIAJE. Dolly lateral que cruza el split y después RETROCEDE. ═══════
  // La base sólo aporta la perspectiva y la deriva viva (nunca hay un cuadro perfectamente
  // quieto); el viaje lo escriben las curvas de abajo, que jamás vuelven a cero.
  const camB = gcam(g, { z0: -60, z1: -60, panX: 0, panY: 0, ry: 0, rx: 0, dur: END });
  const camZ = ip(g,
    [0, 180, 380, 450, 620, 780, 900, 1040, 1180, 1300, 1350, 1420, 1520, 1650, 1740, 1880, END],
    [0, 20, 36, 34, 20, 40, 30, 58, 46, 22, 6, -18, -34, -46, -50, -50, -50]);
  const camX = ip(g,
    [0, 220, 400, 450, 570, 720, 880, 1100, 1340, 1500, 1700, 1880, END],
    [650, 626, 566, 300, -250, -556, -618, -648, -676, -700, -714, -722, -726]);
  const camY = ip(g, [0, 450, 900, 1200, 1350, 1600, 1740, END], [0, -10, 22, 40, 26, 4, -6, -10]);
  const camRY = ip(g, [0, 300, 450, 620, 900, 1150, 1350, 1560, 1740, END],
    [3.2, 3.0, 0.6, -2.4, -3.0, -2.0, -1.2, -0.5, 0, 0]);
  const camRX = ip(g, [0, 700, 900, 1150, 1350, 1740, END], [0.4, 0.8, 1.6, 2.2, 1.2, 0.2, 0]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translate3d(${camX.toFixed(1)}px, ${camY.toFixed(1)}px, 0) ` +
    `rotateY(${camRY.toFixed(2)}deg) rotateX(${camRX.toFixed(2)}deg)`;

  // parallax por plano: el fondo se arrastra un 28 %, el primer plano un 128 % (y se iguala al
  // escenario detrás de la oclusión, para que la columna aterrice como tarjeta de cierre).
  const kFg = ip(g, [0, OCC, OCC + 10, END], [1.28, 1.28, 1.0, 1.0]);
  const parBg = `translateX(${(camX * (0.28 - 1)).toFixed(1)}px)`;
  const parFg = `translateX(${(camX * (kFg - 1)).toFixed(1)}px)`;
  const parSuelo = `translateX(${(camX * (0.14 - 1)).toFixed(1)}px)`;

  // la deriva replicada para el HUD: el texto no queda pegado con cinta al cuadro
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — TARDE ABIERTA fría → el cruce al lado cálido → AMANECER LIMPIO pleno ═════════
  const keyFrom = ip(g, [0, 380, 450, 560, 900, 1150, 1350, 1600, 1740, END],
    [0.20, 0.24, 0.38, 0.62, 0.78, 0.64, 0.56, 0.50, 0.48, 0.46]);
  const inten = ip(g, [0, 300, 700, 1100, 1320, 1400, 1600, 1740, END],
    [0.86, 0.92, 1.00, 1.02, 1.06, 1.00, 1.02, 1.05, 1.08]);
  const floor = ip(g, [0, 600, 1200, 1600, END], [0.52, 0.50, 0.46, 0.42, 0.38]);
  const tintA = light(ip(g, [0, 420, 900, 1400, END], [0, 0.22, 0.58, 0.90, 1]), "sky", "volt");
  const tintB = light(ip(g, [0, 430, 700, 1300, 1700, END], [0, 0.16, 1, 1, 0.52, 0.38]), "sky", "amber");

  // ══ PRES · EL PRESUPUESTO DE 23.000 ═══════════════════════════════════════════════════════
  // UN SOLO Marco que vive los 67 s: tarjeta del mundo frío → se va al fondo → vuelve, crece
  // hasta el lente y CRUZA (la oclusión) → sale del otro lado convertido en LA BARRA DE ONCE AÑOS.
  const kP = [0, 120, 300, 450, 700, 1000, 1270, 1300, 1330, 1341, 1346, 1420, 1560, 1740, END];
  const xP = ip(g, kP, [WA, WA, WA, WA, WA - 2, WA - 4, WA - 4, WA + 18, WA + 48, WA + 64, X0, X0, X0, X0, X0]);
  const yP = ip(g, kP, [44, 44, 44, 44, 42, 40, 40, 42, 46, 50, 40, 40, 40, 40, 40]);
  const wP = ip(g, kP, [880, 880, 880, 872, 640, 520, 500, 1200, 2600, 3400, LARGO, LARGO, LARGO, LARGO, LARGO]);
  const hP = ip(g, kP, [560, 560, 560, 556, 420, 344, 330, 780, 1650, 2100, 86, 86, 86, 86, 86]);
  const zP = ip(g, kP, [10, 10, 10, 8, -140, -260, -260, 60, 380, 520, 10, 10, 10, 10, 10]);
  const ryP = ip(g, kP, [7, 6.4, 5.2, 4.4, 3, 2, 2, -2, -5, -6, 0, 0, 0, 0, 0]);
  const rotP = ip(g, kP, [-1.6, -1.4, -1.2, -1, -0.8, -0.6, -0.6, -2.6, 0.8, 1.6, 0, 0, 0, 0, 0]);
  const litP = ip(g, kP, [0.92, 1, 1, 0.95, 0.62, 0.42, 0.42, 0.78, 0.6, 0.5, 0.48, 0.52, 0.56, 0.60, 0.62]);
  const cropP = ip(g, kP, [1000, 1000, 990, 980, 700, 600, 560, 1420, 3000, 3900, 1760, 1740, 1720, 1700, 1690]);
  const kbP = Math.max(1.04, cropP / Math.max(40, wP));
  const cyP = ip(g, kP, [50, 50, 50, 50, 50, 50, 50, 48, 46, 45, 44, 44, 44, 44, 44]);

  // ══ TICK · EL TICKET DE FERRETERÍA DE 126 ═════════════════════════════════════════════════
  // El otro Marco protagonista: tarjeta vertical del mundo cálido → LA BARRA DE CINCO SEMANAS
  // (match-shape de g900) → la BARRA CORTA a escala real (14 px contra 1.560) detrás del papel.
  const kT = [468, 500, 700, 862, 926, 990, 1300, 1338, 1346, 1440, 1700, 1780, END];
  const xT = ip(g, kT, [WB + 18, WB + 17, WB + 16, WB + 15, WB + 8, WB, WB, WB, XN, XN, XN, XN, XN]);
  const yT = ip(g, kT, [64, 63, 62, 60, 56, 54, 54, 54, 56, 56, 56, 56, 56]);
  const wT = ip(g, kT, [340, 336, 330, 326, 700, 1040, 1040, 1040, NUB, NUB, NUB, NUB, NUB]);
  const hT = ip(g, kT, [430, 426, 420, 414, 210, 96, 96, 96, 76, 76, 76, 76, 76]);
  const zT = ip(g, kT, [-20, -14, -8, 0, 14, 26, 26, 26, 16, 16, 16, 16, 16]);
  const ryT = ip(g, kT, [-12, -11, -9, -7, -3, 0, 0, 0, 0, 0, 0, 0, 0]);
  const rotT = ip(g, kT, [-4, -3.6, -3, -2.4, -1, 0, 0, 0, 0, 0, 0, 0, 0]);
  const litT = ip(g, kT, [0.9, 1, 1, 1, 1, 1, 1, 1, 0.52, 0.52, 0.58, 1, 1]);
  const cropT = ip(g, kT, [740, 740, 760, 800, 940, 1180, 1180, 1180, 150, 150, 150, 150, 150]);
  const kbT = Math.max(1.04, cropT / Math.max(10, wT));
  const cxT = ip(g, kT, [46, 46, 47, 48, 50, 52, 54, 54, 54, 54, 54, 54, 54]);
  const cyT = ip(g, kT, [56, 56, 55, 54, 52, 50, 50, 50, 50, 50, 50, 50, 50]);
  const opT = ip(g, [462, 480], [0, 1]);

  // ══ MDER · LA TARJETA GRANDE DEL MUNDO CÁLIDO (la mesa del camino dos) ════════════════════
  const kD = [428, 452, 560, 880, 960, 1100, 1330, 1420, END];
  const xD = ip(g, kD, [WB, WB, WB, WB, WB, WB - 14, WB - 30, WB - 36, WB - 40]);
  const yD = ip(g, kD, [58, 42, 42, 42, 38, 28, 20, 17, 15]);
  const wD = ip(g, kD, [900, 900, 890, 880, 700, 460, 360, 320, 300]);
  const hD = ip(g, kD, [572, 572, 566, 560, 446, 292, 230, 204, 192]);
  const zD = ip(g, kD, [-40, -20, -14, -10, -80, -260, -400, -470, -520]);
  const ryD = ip(g, kD, [-9, -8, -7.4, -6.6, -5, -4, -3, -2.6, -2.4]);
  const litD = ip(g, kD, [0.7, 1, 1, 1, 0.92, 0.74, 0.6, 0.55, 0.52]);
  const opD = ip(g, [428, 446], [0, 1]);
  const cropD = ip(g, kD, [1050, 1040, 1030, 1020, 840, 570, 452, 402, 380]);
  const kbD = Math.max(1.04, cropD / Math.max(40, wD));

  // ══ MIZQ-ECO · la factura FRÍA traída al mundo cálido para que las dos se toquen ═════════
  // Mismo asset del acto 1, otra escala y otra luz: la variedad sale del MATERIAL, no de sumar
  // piezas. Es lo que hace legible la resta 187 → 88.
  const ecoOn = ip(g, [704, 736, 986, 1016], [0, 1, 1, 0]);
  const ecoX = ip(g, [704, 880, 1016], [WB - 30, WB - 26, WB - 30]);
  const ecoY = ip(g, [704, 880, 1016], [72, 70, 66]);

  // ══ SEAM · LA COLUMNA-COSTURA (los dos hombres con los dos papeles) ══════════════════════
  // Vive en el plano de PRIMER PLANO (parallax ×1,28) y es lo que pasa pegado al lente en la
  // frontera 1→2. Detrás de la oclusión aterriza como la tarjeta humana del cierre.
  const kS = [0, 300, 450, 620, 900, 1200, OCC, OCC + 10, 1560, 1740, END];
  const xS = ip(g, kS, [50, 50, 50, 50, 50, 50, 50, X0 + 32, X0 + 32, X0 + 32, X0 + 32]);
  const yS = ip(g, kS, [50, 50, 50, 50, 52, 54, 54, 78, 78, 78, 78]);
  const wS = ip(g, kS, [300, 300, 300, 300, 282, 246, 246, 360, 360, 360, 360]);
  const hS = ip(g, kS, [980, 980, 980, 980, 900, 780, 780, 232, 232, 232, 232]);
  const zS = ip(g, kS, [120, 120, 120, 116, 88, 44, 44, 12, 12, 12, 12]);
  const ryS = ip(g, kS, [0, -0.6, -1.4, -3, -4.6, -5.4, -5.4, -6, -6, -6, -6]);
  const litS = ip(g, kS, [0.66, 0.86, 1, 0.9, 0.7, 0.5, 0.5, 0.8, 0.92, 1, 1]);
  const cropS = ip(g, kS, [980, 970, 950, 900, 800, 660, 660, 420, 412, 400, 396]);
  const kbS = Math.max(1.04, cropS / Math.max(40, wS));

  // ══ LOS DOS RELLENOS — el corazón aritmético del movimiento ═══════════════════════════════
  // Cinco semanas: SE LLENA DE GOLPE (40 cuadros = 1,3 s).
  const fillT = g < 1000 ? 0 : ipe(g, [1024, 1064], [0, 1], Easing.out(Easing.cubic));
  // Once años: el mismo dinero avanzando al mismo ritmo real. En todo lo que dura este movimiento
  // apenas llega al primer año de once. No es un truco: es la escala.
  const fillP = g < 1396 ? 0 : ipe(g, [1400, 1960], [0, 1 / 11], Easing.inOut(Easing.ease));

  // ══ LAS CIFRAS ════════════════════════════════════════════════════════════════════════════
  const n23 = ip(g, [96, 128, 152], [0, 23000, 23000]);
  const n126 = ip(g, [540, 568, 592], [0, 126, 126]);
  const on23 = ip(g, [92, 116, 404, 434], [0, 1, 1, 0]);
  const on187 = ip(g, [188, 214, 404, 434], [0, 1, 1, 0]);
  const on126 = ip(g, [534, 560, 872, 902], [0, 1, 1, 0]);
  const on88 = ip(g, [640, 666, 986, 1016], [0, 1, 1, 0]);
  const onResta = ip(g, [762, 792, 986, 1016], [0, 1, 1, 0]);
  const on1185 = ip(g, [1128, 1158, 1312, 1338], [0, 1, 1, 0]);
  const on13800 = ip(g, [1414, 1444, 1706, 1732], [0, 1, 1, 0]);
  const onFijo = ip(g, [1552, 1584, 1706, 1732], [0, 1, 1, 0]);
  const onPago = ip(g, [1072, 1100, 1312, 1338], [0, 1, 1, 0]);

  // ══ LOS EJES ══════════════════════════════════════════════════════════════════════════════
  const ejeT = ip(g, [996, 1024, 1310, 1334], [0, 1, 1, 0]);
  const ejeP = ip(g, [1382, 1416, 1930, END], [0, 1, 1, 0.9]);

  // ══ ROTULOS DE CIERRE (acto 5): las dos barras enfrentadas ════════════════════════════════
  const rotCorta = ip(g, [1756, 1790], [0, 1]);
  const rotLarga = ip(g, [1792, 1826], [0, 1]);
  const pulsoCorta = g < A5 ? 0 : 0.5 + 0.5 * Math.sin((g - A5) / 8.5);

  // ══ TEJADO / SUNFIELD — las dos firmas del video, como suelo y como aire ══════════════════
  const roofOn = ip(g, [1352, 1440, END], [0, 0.9, 1]);
  const sunOn = ip(g, [1600, 1720, 1960, END], [0, 0.5, 0.5, 0.42]);

  // ══ EL CLIP DE LA CASA — la MISMA casa detrás de los dos caminos, y al amanecer al final ══
  const vidCasa = ip(g, [1596, 1640, 1980, END], [0, 1, 1, 1]);

  // ══ TEXTOS (HUD, espacio de pantalla, todo sobre Bed) ═════════════════════════════════════
  const t1 = ip(g, [64, 92, 404, 432], [0, 1, 1, 0]);
  const t2 = ip(g, [494, 524, 848, 876], [0, 1, 1, 0]);
  const t3 = ip(g, [952, 984, 1300, 1330], [0, 1, 1, 0]);
  const t4 = ip(g, [1392, 1424, 1700, 1728], [0, 1, 1, 0]);
  const t5 = ip(g, [1782, 1814, 1988, END], [0, 1, 1, 0.94]);

  // el icono de calendario que pasa PEGADO AL LENTE en el acto 3
  const calOn = ip(g, [1148, 1176, 1258, 1286], [0, 1, 1, 0]);
  const calX = ip(g, [1148, 1286], [118, -18]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta en el cuadro 0 y NO se remonta nunca. Cubre el 100 % del
             cuadro en todo instante (el avatar de abajo va en bucle y muteado). ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═══════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · EL FONDO LEJANO — la MISMA casa detrás de los dos caminos ------------ */}
        <Plane z={-660}>
          <div style={{ position: "absolute", inset: 0, transform: parBg }}>
            <PhotoPlane src="img/cmeurgente/cmeu_casa_dia.jpg" kind="photo" z={0}
              scale={ip(g, [0, 900, 1600, END], [1.34, 1.26, 1.22, 1.18])}
              dim={ip(g, [0, 450, 900, 1400, 1740, END], [0.70, 0.72, 0.74, 0.68, 0.58, 0.52])}
              tint={V.sky} />
          </div>
        </Plane>

        {/* PLANO 1b · EL AMANECER: la casa VIVA (clip) que entra por geometría en el acto 5 */}
        {g >= 1590 && (
          <Plane z={-540}>
            <div style={{ position: "absolute", inset: 0, transform: parBg }}>
              <Marco
                x={X0} y={ipe(g, [1590, 1720], [96, 62], Easing.out(Easing.cubic))}
                w={ip(g, [1590, 1740, END], [1180, 1320, 1360])}
                h={ip(g, [1590, 1740, END], [664, 742, 764])}
                z={0} ry={-2} rx={ip(g, [1590, 1740], [10, 2])} radius={16}
                lit={ip(g, [1590, 1740, END], [0.4, 0.8, 0.92])} litColor={V.amber}
                opacity={ip(g, [1590, 1636], [0, 0.9])}
              >
                <Mat photo="img/cmeurgente/cmeu_casa_dia.jpg"
                  clip="broll/cmeurgente/cmeu_casa_dia_mov.mp4" vid={vidCasa}
                  w={1360} h={764} k={1.10}
                  cx={50 + Math.sin(g / 260) * 2.4} cy={50 + Math.cos(g / 310) * 1.8}
                  lit={ip(g, [1590, 1740, END], [0.4, 0.8, 0.92])} litColor={V.amber}
                  sheenAt={L(1706)} />
                <AbsoluteFill style={{ background: rgba(V.ink0, ip(g, [1590, 1740, END], [0.62, 0.5, 0.44])) }} />
              </Marco>
            </div>
          </Plane>
        )}

        {/* PLANO 2 · EL AIRE — la rejilla de profundidad del split ------------------------- */}
        <Plane z={-430}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(camX * (0.5 - 1)).toFixed(1)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [0, 160, 900, 1340, 1600, END], [0, 0.22, 0.22, 0.16, 0.07, 0.04]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.sky, 0.10)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.sky, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · EL SUELO — el tejado con 0,6 de paneles (el sistema chico, el que SÍ) - */}
        {g >= 1348 && (
          <Plane z={-200}>
            <div style={{ position: "absolute", inset: 0, transform: parSuelo }}>
              <RoofPlane y={ip(g, [1348, 1560, END], [104, 88, 84])} w={1560} h={340} rx={62}
                lit={roofOn * 0.9} z={0} panels={0.6} />
            </div>
          </Plane>
        )}

        {/* PLANO 4 · LAS DOS PISCINAS DE LUZ DEL SPLIT — frío a la izquierda, cálido a la
            derecha. Es lo que hace que sean dos MUNDOS y no dos tarjetas. ----------------- */}
        <Plane z={-120}>
          <Halo x={WA} y={46} w={1500} h={1120} color={V.sky}
            a={ip(g, [0, 300, 450, 700, 1000], [0.9, 1, 0.8, 0.35, 0.14])} />
          <Halo x={WB} y={48} w={1500} h={1120} color={V.amber}
            a={ip(g, [300, 450, 700, 1200, 1500, END], [0.1, 0.42, 1, 0.86, 0.6, 0.5])} />
          {/* la CANALETA entre los dos mundos: la costura física del split */}
          <div style={{
            position: "absolute", left: "50%", top: "-30%", width: 5, height: "160%", marginLeft: -2,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.bone, 0.24)} 30%, ${rgba(V.bone, 0.30)} 70%, rgba(0,0,0,0) 100%)`,
            opacity: ip(g, [0, 200, 700, 1000], [0.6, 1, 0.7, 0]),
            boxShadow: `0 0 40px ${rgba(V.ink0, 0.9)}`,
          }} />
        </Plane>

        {/* PLANO 5 · EL ESCENARIO — los cuatro Marcos con MATERIAL REAL adentro ------------ */}
        <Plane z={0}>

          {/* ── PRES · el presupuesto de 23.000 → la barra de ONCE AÑOS ── */}
          <Marco x={xP} y={yP} w={wP} h={hP} z={zP} ry={ryP} rot={rotP}
            radius={g < 1342 ? 12 : 5} lit={litP} litColor={g < 1342 ? V.sky : V.steel}>
            <Mat photo="img/cmeurgente/cmeu_split_izq.jpg"
              w={wP} h={hP} k={kbP}
              cx={50 + Math.sin(g / 270) * 2.6} cy={cyP}
              lit={litP} litColor={g < 1342 ? V.sky : V.steel} sheenAt={L(58)} />
            {/* el relleno de once años: apenas avanza, y se ve que avanza */}
            {g >= 1396 && <Relleno p={fillP} color={V.sky} glow={0.55} />}
            {/* la trama fría del papel comercial */}
            {g < 1342 && (
              <AbsoluteFill style={{
                background: `linear-gradient(158deg, ${rgba(V.sky, 0.16)} 0%, rgba(0,0,0,0) 52%)`,
                mixBlendMode: "screen",
              }} />
            )}
          </Marco>

          {/* ── MDER · la mesa del camino dos ── */}
          {g >= 424 && (
            <Marco x={xD} y={yD} w={wD} h={hD} z={zD} ry={ryD} radius={12}
              lit={litD} litColor={V.amber} opacity={opD}>
              <Mat photo="img/cmeurgente/cmeu_split_der.jpg" w={wD} h={hD} k={kbD}
                cx={48 + Math.sin(g / 240) * 2.8} cy={50 + Math.cos(g / 290) * 2.2}
                lit={litD} litColor={V.amber} sheenAt={L(486)} />
            </Marco>
          )}

          {/* ── ECO · la factura FRÍA traída al lado cálido: la resta 187 → 88 ── */}
          {ecoOn > 0.01 && (
            <Marco x={ecoX} y={ecoY} w={320} h={206} z={-40} ry={7} rot={-2} radius={10}
              lit={0.55} litColor={V.sky} opacity={ecoOn}>
              <Mat photo="img/cmeurgente/cmeu_split_izq.jpg" w={320} h={206} k={2.1}
                cx={38} cy={62 + Math.sin(g / 200) * 2} lit={0.55} litColor={V.sky} sheenAt={L(742)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 12px 8px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 58%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: 2,
                color: rgba(V.white, 0.8), textTransform: "uppercase",
              }}>Camino uno</div>
            </Marco>
          )}

          {/* ── TICK · el ticket de 126 → la barra de CINCO SEMANAS → la barra corta real ── */}
          {g >= 460 && (
            <Marco x={xT} y={yT} w={wT} h={hT} z={zT} ry={ryT} rot={rotT}
              radius={g < 940 ? 10 : 4} lit={litT} litColor={V.volt} opacity={opT}>
              <Mat photo="img/cmeurgente/cmeu_split_der.jpg" w={wT} h={hT} k={kbT}
                cx={cxT} cy={cyT} lit={litT} litColor={V.volt} sheenAt={L(504)} />
              {g >= 1000 && <Relleno p={fillT} color={V.volt} glow={g >= A5 ? 1 + pulsoCorta * 0.8 : 1} />}
            </Marco>
          )}

          {/* el halo de la barra corta cuando se enciende en el cierre: 14 px tienen que LEERSE */}
          {g >= A5 && (
            <div style={{
              position: "absolute", left: `${XN}%`, top: "56%", width: 120, height: 150,
              marginLeft: -60, marginTop: -75, pointerEvents: "none",
              background: `radial-gradient(closest-side, ${rgba(V.volt, 0.34 + 0.16 * pulsoCorta)} 0%, rgba(0,0,0,0) 72%)`,
            }} />
          )}

          {/* ── LOS EJES DE TIEMPO (esto SÍ es un gráfico) ── */}
          <Ejes x={ip(g, [996, 1334], [WB, WB])} y={ip(g, [996, 1334], [50.6, 50.6])}
            w={1040} n={5} tint={V.volt} on={ejeT} unidad="SEMANAS" marca={[1, 2, 3, 4, 5]} z={26} />
          <Ejes x={X0} y={37.4} w={LARGO} n={11} tint={V.sky} on={ejeP}
            unidad="AÑOS" marca={[1, 5, 11]} z={12} />

          {/* ── LAS CIFRAS PEGADAS A SU OBJETO (cada una sobre su cama) ── */}
          <Placa x={WA} y={17} on={on23} z={30}>
            <Kick color={rgba(V.white, 0.72)}>Presupuesto · válido 48 horas</Kick>
            <div style={{ height: 6 }} />
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 0.9, color: V.amber,
              textShadow: `0 0 46px ${rgba(V.amber, 0.32)}, 0 6px 26px rgba(0,0,0,0.92)`,
            }}>{Math.round(n23).toLocaleString("es-ES")}<span style={{ fontSize: 44, marginLeft: 12, opacity: 0.85 }}>$</span></div>
          </Placa>

          <Placa x={WA + 15} y={74} on={on187} z={30}>
            <Kick color={rgba(V.white, 0.6)}>Factura, cada mes</Kick>
            <div style={{ height: 4 }} />
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 0.92, color: V.amber,
              textShadow: "0 6px 24px rgba(0,0,0,0.92)",
            }}>187 <span style={{ fontSize: 28, opacity: 0.8 }}>$</span></div>
          </Placa>

          <Placa x={WB} y={17} on={on126} z={30}>
            <Kick color={rgba(V.white, 0.72)}>Seis arreglos · ferretería</Kick>
            <div style={{ height: 6 }} />
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 0.9, color: V.volt,
              textShadow: `0 0 46px ${rgba(V.volt, 0.32)}, 0 6px 26px rgba(0,0,0,0.92)`,
            }}>{Math.round(n126)}<span style={{ fontSize: 44, marginLeft: 12, opacity: 0.85 }}>$</span></div>
          </Placa>

          <Placa x={WB + 15} y={74} on={on88} z={30}>
            <Kick color={rgba(V.white, 0.6)}>Factura, cada mes</Kick>
            <div style={{ height: 4 }} />
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 0.92, color: V.volt,
              textShadow: "0 6px 24px rgba(0,0,0,0.92)",
            }}>88 <span style={{ fontSize: 28, opacity: 0.8 }}>$</span></div>
          </Placa>

          {/* la resta, entre las dos facturas: la misma casa, igual de cómoda */}
          <Placa x={WB - 8} y={86} on={onResta} z={40} w={640}>
            <Body size={30}>La misma casa. Igual de cómoda.</Body>
            <div style={{ height: 6 }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 54, color: rgba(V.white, 0.45), textDecoration: "line-through" }}>187</span>
              <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, color: rgba(V.white, 0.5) }}>→</span>
              <span style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, color: V.volt, textShadow: `0 0 26px ${rgba(V.volt, 0.36)}` }}>88</span>
              <span style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: rgba(V.white, 0.62) }}>= 99 AL MES</span>
            </div>
          </Placa>

          {/* acto 3: lo que sigue entrando todos los años */}
          <Placa x={WB - 2} y={26} on={on1185} z={40} w={620}>
            <Kick color={V.amber}>Y otra vez el año siguiente</Kick>
            <div style={{ height: 6 }} />
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 104, lineHeight: 0.9, color: V.amber,
              textShadow: `0 0 40px ${rgba(V.amber, 0.3)}, 0 6px 24px rgba(0,0,0,0.92)`,
            }}>1.185 <span style={{ fontSize: 34, opacity: 0.85 }}>$ AL AÑO</span></div>
          </Placa>

          {/* acto 3: el sello sobre el final de la barra */}
          <Placa x={WB + 24} y={64} on={onPago} z={40}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 52, letterSpacing: 3,
              color: V.volt, textShadow: `0 0 26px ${rgba(V.volt, 0.4)}, 0 4px 18px rgba(0,0,0,0.9)`,
            }}>PAGADO</div>
          </Placa>

          {/* acto 4: los 13.800 del sistema chico */}
          <Placa x={X0 - 2} y={22} on={on13800} z={40} w={640}>
            <Kick color={rgba(V.white, 0.72)}>El sistema chico, ya medido</Kick>
            <div style={{ height: 6 }} />
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 110, lineHeight: 0.9, color: V.amber,
              textShadow: `0 0 42px ${rgba(V.amber, 0.28)}, 0 6px 24px rgba(0,0,0,0.92)`,
            }}>13.800 <span style={{ fontSize: 36, opacity: 0.85 }}>$</span></div>
          </Placa>

          {/* acto 4: LA PARTE QUE NO ME CONVIENE — el cargo fijo que no se va nunca */}
          <Placa x={X0 + 30} y={66} on={onFijo} z={40} w={560}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 64, color: V.amber,
                textShadow: "0 4px 18px rgba(0,0,0,0.9)",
              }}>+14 $</span>
              <span style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: rgba(V.white, 0.66) }}>AL MES</span>
            </div>
            <div style={{ height: 6 }} />
            <Body size={28}>Cargo fijo. Con paneles <Em color={V.amber}>también lo pagas</Em>.</Body>
          </Placa>

          {/* ── CIERRE: los dos rótulos enfrentados, cada uno colgando de su barra ── */}
          <Guia x={XN} y0={48} y1={54} tint={V.volt} on={rotCorta} />
          <Placa x={XN + 9} y={44} on={rotCorta} z={40} w={430}>
            <Kick color={V.volt}>Los 126</Kick>
            <div style={{ height: 4 }} />
            <Head size={54} color={V.volt}>CINCO SEMANAS</Head>
          </Placa>
          <Guia x={X0 + 26} y0={30} y1={38.6} tint={V.sky} on={rotLarga} />
          <Placa x={X0 + 26} y={26} on={rotLarga} z={40} w={470}>
            <Kick color={rgba(V.sky, 0.9)}>Los 13.800</Kick>
            <div style={{ height: 4 }} />
            <Head size={54} color={rgba(V.bone, 0.86)}>ONCE AÑOS</Head>
          </Placa>

          {/* ── EL PAPEL DEL CAMINO DOS: el objeto que le entrego a MovCuandoSi ── */}
          {g >= 1700 && (
            <Marco
              x={X0 - 40}
              y={ipe(g, [1700, 1826], [104, 78], Easing.out(Easing.cubic))}
              w={ip(g, [1700, 1826, END], [300, 342, 348])}
              h={ip(g, [1700, 1826, END], [196, 222, 226])}
              z={16} ry={9} rx={ip(g, [1700, 1826], [16, 5])} rot={-2} radius={10}
              lit={ip(g, [1700, 1826, END], [0.5, 0.95, 1])} litColor={V.volt}
            >
              <Mat photo="img/cmeurgente/cmeu_split_der.jpg" w={348} h={226} k={1.7}
                cx={54 + Math.sin(g / 210) * 1.8} cy={52}
                lit={ip(g, [1700, 1826, END], [0.5, 0.95, 1])} litColor={V.volt} sheenAt={L(1846)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 12px 9px",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 58%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 2,
                color: V.white, textTransform: "uppercase",
              }}>Lo que mediste tú</div>
            </Marco>
          )}
        </Plane>

        {/* PLANO 6 · PRIMER PLANO — lo que pasa POR DELANTE ------------------------------- */}
        <Plane z={0}>
          <div style={{ position: "absolute", inset: 0, transform: parFg, transformStyle: "preserve-3d" }}>
            {/* la COLUMNA-COSTURA: la bisagra entre los dos caminos, pegada al lente en la
                frontera 1→2 y aterrizada como tarjeta humana en el cierre */}
            <Marco x={xS} y={yS} w={wS} h={hS} z={zS} ry={ryS} radius={g < OCC + 6 ? 8 : 12}
              lit={litS} litColor={g < OCC + 6 ? V.bone : V.amber}>
              <Mat photo="img/cmeurgente/cmeu_ernesto_sala.jpg" w={wS} h={hS} k={kbS}
                cx={50 + Math.sin(g / 300) * 2.2} cy={ip(g, [0, 900, OCC + 10, END], [50, 48, 50, 50])}
                lit={litS} litColor={g < OCC + 6 ? V.bone : V.amber} sheenAt={L(408)} />
              {g >= OCC + 6 && (
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 12px 9px",
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 58%)",
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 2,
                  color: V.white, textTransform: "uppercase",
                }}>Los dos papeles</div>
              )}
            </Marco>

            {/* el CALENDARIO cruzando pegado al lente en el acto 3 (objeto de la escena) */}
            {calOn > 0.01 && (
              <IconPng src="img/cmeurgente/cmeu_ic_calendario.png"
                x={calX} y={ip(g, [1148, 1286], [72, 60])}
                size={ip(g, [1148, 1218, 1286], [300, 400, 300])} z={320}
                opacity={calOn * 0.92} rot={ip(g, [1148, 1286], [-12, 9])} glow={V.ink0} />
            )}

            {/* el calendario CHICO, apoyado en el origen de la barra de cinco semanas */}
            {g >= 1006 && g < 1330 && (
              <IconPng src="img/cmeurgente/cmeu_ic_calendario.png"
                x={ip(g, [1006, 1330], [WB - 28.6, WB - 28.6])} y={62}
                size={ip(g, [1006, 1046], [72, 104])} z={40}
                opacity={ip(g, [1006, 1042, 1300, 1328], [0, 0.95, 0.95, 0])}
                rot={ip(g, [1006, 1328], [-8, 5])} glow={V.ink0} />
            )}
          </div>
        </Plane>
      </Layers>

      {/* ══════ LA FIRMA DEL VIDEO — las 24 horas, como aire del amanecer ═════════════════ */}
      {sunOn > 0.01 && (
        <SunField sun={7 / 24} from={9} use={0.22} on={sunOn * 0.6} tint={V.volt} night={V.sky}
          y={92} w={1180} h={22} cycle={220} />
      )}

      {/* ══════ COSTURA · FRONTERA 3→4 (g1350) — OCLUSIÓN CON EL PRESUPUESTO ══════════════
          El Marco de los 23.000 ya está cruzando el cuadro a 3.400 px pegado al lente; esto le
          pone la materia (papel couché) que tapa el 100 % y levanta sus fibras. Detrás, el eje
          de tiempo ya se rescaló de 188 px por semana a 2,7. ⛔ nunca con V.ink0 ni con lit alto. */}
      <SeamOcclude at={L(OCC)} dur={26} color={V.paper} angle={7} lit={0.30} />
      <Fibras g={g} at={OCC - 4} dur={40} />

      {/* ══════ HUD — UNA idea de texto por acto, siempre sobre Bed ═══════════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* ACTO 1 · CAMINO UNO */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "64%", opacity: t1, transform: `translateY(${((1 - t1) * 24).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={rgba(V.sky, 0.95)}>El camino que te ofrecen</Kick>
              <div style={{ height: 8 }} />
              <Head size={96}>CAMINO UNO</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Firmas hoy. <Em color={V.amber}>Veintitrés mil dólares</Em>.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · CAMINO DOS */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "12%", opacity: t2, transform: `translateY(${((1 - t2) * -24).toFixed(1)}px)` }}>
            <Bed w={740} pad={24}>
              <Kick color={V.volt}>El camino que mediste</Kick>
              <div style={{ height: 8 }} />
              <Head size={96}>CAMINO DOS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Mides primero. <Em>Ciento veintiséis dólares</Em>.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · CINCO SEMANAS */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "72%", opacity: t3, transform: `translateY(${((1 - t3) * 24).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={V.volt}>Los ciento veintiséis</Kick>
              <div style={{ height: 8 }} />
              <Head size={86}>CINCO SEMANAS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Se pagaron solos. Y siguen pagando.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · ONCE AÑOS — la parte que no me conviene */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "30%", top: "70%", opacity: t4, transform: `translateY(${((1 - t4) * 24).toFixed(1)}px)` }}>
            <Bed w={760} pad={24}>
              <Kick color={V.amber}>Y ahora la parte que no me conviene</Kick>
              <div style={{ height: 8 }} />
              <Head size={86}>ONCE AÑOS</Head>
              <div style={{ height: 10 }} />
              <Body size={31}>El panel <Em color={V.amber}>también se paga</Em>. Sólo que aquí.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · ESE ES EL ORDEN */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "50%", top: "76%", transform: `translate(-50%,-50%) translateY(${((1 - t5) * 22).toFixed(1)}px)`, opacity: t5 }}>
            <Bed w={860} pad={26}>
              <Kick color={V.volt}>Ese es el orden</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>PRIMERO LO DE <Em>CINCO SEMANAS</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>Después, si quieres, lo de once años.</Body>
            </Bed>
          </div>
        )}

        {/* la lectura de la barra corta cuando se enciende: 126 dólares, devueltos */}
        {g >= 1836 && (
          <Readout value="126" unit="$" label={g < 1970 ? "SE DEVOLVIERON SOLOS" : undefined}
            at={L(1840)} x={13} y={30} size={ip(g, [1836, 1900, END], [78, 96, 96])}
            color={V.volt} align="center" />
        )}
      </AbsoluteFill>

      {/* viñeta: se abre a medida que entra el amanecer (menos dramatismo, más aire) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(128% 108% at 50% 48%, rgba(0,0,0,0) ${ip(g, [0, 1350, END], [48, 54, 62]).toFixed(0)}%, rgba(6,7,5,${ip(g, [0, 900, 1400, END], [0.42, 0.40, 0.32, 0.24]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
