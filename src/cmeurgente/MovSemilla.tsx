// MovSemilla.tsx — S4 · UN MOVIMIENTO CONTINUO de 42 s (1260 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 336,0.
//
// LA ESPINA: todo el presupuesto de 23.000 dólares sale de UN SOLO NÚMERO que el vendedor copió de
// la factura de Ernesto en el minuto dos de la visita. Ese número no es sagrado: lo puede mover el
// espectador esta semana. Y cuando el número baja, TODO el presupuesto encoge con él.
//
// LA FIGURA (el corazón del movimiento): el acto 2 y el acto 4 son LA MISMA GEOMETRÍA al derecho y
// al revés. Acto 2: el número enciende y cinco líneas SALEN de él hacia las cinco piezas del
// presupuesto (los puntos viajan del centro hacia afuera, las piezas nacen en el número). Acto 4:
// el mismo abanico, el mismo radio relativo, los mismos cinco nodos — pero el número está reescrito
// más chico, los puntos viajan de las piezas HACIA el número, y las cinco piezas encogen a la vez.
// Se reconoce porque los nodos se calculan con el MISMO vector relativo (REL) desde el hub.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                 ║
// ╠════╦═══════════════════════════════════════╦═══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto        ║ SALE: encuadre + luz + objeto                 ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: media, YA DEL OTRO LADO del      ║ CÁM: sigue orbitando y entrando (z −240→−206, ║
// ║ g0 ║ bloque (viene de MovDesglose): z −240,║      ry −14→−7,6), sin frenar en la frontera. ║
// ║    ║ ry −14, orbita completada.            ║ LUZ: keyFrom 0,70→0,58 · int 0,84→1,00 · el   ║
// ║    ║ LUZ: VENTANA DE LA COCINA, ámbar      ║      ámbar empieza a virar a VOLT (el dato).  ║
// ║    ║ lateral bajo (keyFrom 0,70, int 0,84).║ MAT: LA CIFRA 1.240 ya copiada, encendida en  ║
// ║    ║ MAT: LA FACTURA sobre la mesa, y el   ║      la pantalla de la tableta. La cámara     ║
// ║    ║ vendedor que entra por la derecha.    ║      está entrando DENTRO de ella.            ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: sale del interior de la cifra    ║ CÁM: z −206→−258 y EMPIEZA A BAJAR (drop      ║
// ║g360║ (contra-escala 3,2→1 sobre el MISMO   ║      −14→−46, tilt −1,1→−2,6). No corta.      ║
// ║    ║ punto focal 62/43): un solo viaje.    ║ LUZ: keyFrom 0,58→0,50 · el volt del dato en  ║
// ║    ║ LUZ: volt pleno sobre el dato.        ║      su pico y ya cayendo hacia la mano.      ║
// ║    ║ MAT: LA CIFRA, ahora el NÚCLEO del    ║ MAT: LAS CINCO LÍNEAS SE RECOGEN dentro del   ║
// ║    ║ que salen las cinco líneas.           ║      número; la última se vuelve el RENGLÓN   ║
// ║    ║                                       ║      de la hoja rayada que sube desde abajo.  ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: bajando (drop −46, tilt −2,6),   ║ CÁM: cerrada y baja (z −258→−306, drop −112,  ║
// ║g720║ la hoja ENTRA POR GEOMETRÍA desde     ║      tilt −5,6): el primer plano de la mano.  ║
// ║    ║ abajo de cuadro (y 128%→52%).         ║ LUZ: keyFrom 0,50→0,66, int 0,98→0,86, floor  ║
// ║    ║ LUZ: keyFrom 0,50, el volt cediendo   ║      0,62→0,68: el ámbar se concentra.        ║
// ║    ║ al ámbar de la ventana.               ║ MAT: LA HOJA se levanta hacia el lente (rx 4→ ║
// ║    ║ MAT: la cifra escrita en la hoja y    ║      26) y TAPA. La goma dejó el hueco; el    ║
// ║    ║ la mano con la goma encima.           ║      860 ya está escrito detrás.              ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: detrás del papel, en la misma    ║ CÁM: PRIMER PLANO CERRADO SOBRE LA HOJA       ║
// ║g1020║ curva de caída (z −306, drop −112).  ║      (z −320, panY −6, drop −130, tilt −6,4). ║
// ║    ║ LUZ: keyFrom 0,66, ámbar concentrado. ║ LUZ: ÁMBAR CONCENTRADO EN LA MANO, el resto   ║
// ║    ║ MAT: el 860 reescrito (más chico) en  ║      en sombra (keyFrom 0,78, floor 0,76).    ║
// ║    ║ el hueco que dejó la goma, y el       ║ MAT: LA HOJA RAYADA a sangre — el arranque de ║
// ║    ║ MISMO abanico de cinco piezas.        ║      MovSetecientos.                          ║
// ╚════╩═══════════════════════════════════════╩═══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido:
//   g360  1→2  ZOOM-THROUGH   — `zoomThrough(g, 328, 34, 62, 43)` empuja el mundo del acto 1 hacia
//                               DENTRO de la cifra copiada en la tableta, y el mundo del acto 2
//                               nace con la contra-escala EXACTA (misma fórmula, mismo punto focal
//                               62/43, de 3,2 a 1): la cámara entra por un lado y sale por el otro.
//                               La CIFRA no viaja en ninguno de los dos contenedores: es el punto
//                               fijo del zoom, y crece de 56 a 168 px. Detrás nunca hay negro.
//   g720  2→3  MATCH-MOVE     — la cámara no corta: sigue su caída (camDrop −14→−84, camTilt
//                               −1,1→−4,6) mientras las cinco líneas se recogen dentro del número
//                               y LA HOJA sube al cuadro desde y 128%. Nada aparece: todo entra
//                               por geometría, con el mismo vector de velocidad de la cámara.
//   g1020 3→4  OCLUSIÓN       — la hoja se levanta hacia el lente (rx 4→26, y 52→30) y
//                               `<SeamOcclude color={V.paper} lit={0,34} />` la lleva a tapar el
//                               100%. Detrás ya está el acto 4 montado y a plena opacidad.
//
// EL OBJETO QUE CRUZA CADA FRONTERA:
//   1→2  LA CIFRA 1.240 — de tinta copiada en una tableta a NÚCLEO del que sale el presupuesto.
//   2→3  LAS CINCO LÍNEAS — se recogen en una sola y esa se vuelve el RENGLÓN de la hoja rayada.
//   3→4  LA HOJA — tapa el cuadro y del otro lado es el SUELO del acto 4; el hueco que dejó la
//        goma es donde ya está escrito el 860.
//
// ⛔ CONTRATO: sin Math.random/Date.now (todo sale de rnd(k) y de g) · sin position:fixed · sin
// ⛔ filter:blur · rutas SOLO literales · ninguna <Sequence> envolviendo un acto (reloj continuo).
// ⚠️ El build monta el movimiento en UNA Sequence: useCurrentFrame() es LOCAL. Todo componente del
//    Stage que recibe `at`/`sheenAt` razona en frames locales → se traduce con L().
// ⚠️ Los clips duran 153 frames (CLIP_FRAMES). Las ventanas de video se alinean al múltiplo de 153
//    LOCAL (clipWin) para que el clip entre siempre en su frame 0 — que ES la foto de base — y
//    salga antes de la vuelta: nunca se ve ni el relevo ni el salto del loop.
// ⚠️ `cmeu_ic_lapiz.png` figura en la ficha pero NO existe en disco (los 33 íconos generados no lo
//    incluyen): se resolvió con material propio para no matar los 60 chunks del farm.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, CLIP_FRAMES, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, RoofPlane, SunField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  SeamOcclude, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1260;
const A2 = 360;
const A3 = 720;
const A4 = 1020;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ── LA GEOMETRÍA COMPARTIDA POR EL ACTO 2 Y EL ACTO 4 ────────────────────────────────────────
// El abanico se define UNA sola vez, en coordenadas RELATIVAS al núcleo. El acto 2 lo dibuja con
// hub HUB2 y el acto 4 con hub HUB4: mismo vector, mismo orden, misma inclinación. Es lo que hace
// que el espectador reconozca la figura cuando vuelve del revés.
const HUB2 = { x: 24, y: 46 };
const HUB4 = { x: 32, y: 43 };
const REL: { dx: number; dy: number }[] = [
  { dx: 31, dy: -30 },
  { dx: 46, dy: -16 },
  { dx: 52, dy: 4 },
  { dx: 45, dy: 24 },
  { dx: 29, dy: 37 },
];
const nodoDe = (hub: { x: number; y: number }, i: number, spread: number) => ({
  x: hub.x + REL[i].dx * spread,
  y: hub.y + REL[i].dy * spread,
});

// ── LAS CINCO PIEZAS DEL PRESUPUESTO ─────────────────────────────────────────────────────────
// Cada pieza es UNA LÍNEA DE LA TABLETA DEL VENDEDOR: por eso el material de adentro es el mismo
// plano del vendedor copiando, recortado en cinco zonas distintas. El ícono PNG delante la
// identifica. Suman 23.000 exactos; al 60% (el número bajado) suman 13.800 exactos.
const PIEZAS: { nom: string; ic: string; full: number; k: number; cx: number; cy: number; tint: string }[] = [
  { nom: "PANELES", ic: "img/cmeurgente/cmeu_ic_panelsolar.png", full: 11400, k: 2.30, cx: 34, cy: 34, tint: V.panel },
  { nom: "INVERSOR", ic: "img/cmeurgente/cmeu_ic_rayo.png", full: 3200, k: 2.05, cx: 66, cy: 42, tint: V.volt },
  { nom: "ESTRUCTURA", ic: "img/cmeurgente/cmeu_ic_caja.png", full: 2600, k: 2.55, cx: 48, cy: 64, tint: V.steel },
  { nom: "INSTALACIÓN", ic: "img/cmeurgente/cmeu_ic_camioneta.png", full: 4100, k: 1.95, cx: 24, cy: 56, tint: V.amber },
  { nom: "PERMISOS", ic: "img/cmeurgente/cmeu_ic_sello.png", full: 1700, k: 2.75, cx: 72, cy: 26, tint: V.bone },
];
const TOTAL = 23000;

// ── VITRINA — el marco de vidrio que RECORTA el material. Adentro va SIEMPRE material real. ──
const Vitrina: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(10, w);
  const hh = Math.max(10, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      transformStyle: "preserve-3d",
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.28 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.24 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Vitrina: la FOTO siempre (con recorte animado = nunca queda quieta) y
//    el CLIP encima sólo mientras dura de verdad. `k` es el zoom de recorte (≥1: siempre cubre).
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

// ── LOS RENGLONES DE LA HOJA — la trama de la hoja rayada (la materia con la que me voy) ─────
const Renglones: React.FC<{ on: number; paso?: number; tint?: string }> = ({ on, paso = 46, tint = V.sky }) => {
  if (on <= 0.01) return null;
  return (
    <AbsoluteFill style={{
      opacity: 0.5 * clamp01(on), mixBlendMode: "overlay",
      backgroundImage:
        `repeating-linear-gradient(0deg, ${rgba(tint, 0.5)} 0 1px, rgba(0,0,0,0) 1px ${paso}px),` +
        `linear-gradient(90deg, ${rgba(V.danger, 0.22)} 0 2px, rgba(0,0,0,0) 2px 100%)`,
      backgroundPosition: "0 0, 13% 0",
    }} />
  );
};

// ── LAS MIGAS DE LA GOMA — lo que queda sobre el papel cuando la cifra se borra ──────────────
const Migas: React.FC<{ e: number; g: number; x: number; y: number; w: number }> = ({ e, g, x, y, w }) => {
  if (e <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: 130, marginLeft: -w / 2, marginTop: -30 }}>
      {Array.from({ length: 26 }, (_, i) => {
        const o = rnd(i * 5.7);
        const q = clamp01((e - o * 0.55) * 2.2);
        if (q <= 0) return null;
        const sz = 3 + rnd(i * 3.1) * 8;
        const dy = rnd(i * 8.3) * 74;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${(rnd(i * 2.3) * 96).toFixed(2)}%`,
            top: dy + Math.sin(g / 37 + i) * 1.4,
            width: sz * (1.4 + rnd(i * 9.1) * 1.6), height: sz,
            borderRadius: sz, opacity: 0.72 * q,
            background: rgba(V.concrete, 0.5 + rnd(i * 7.7) * 0.34),
            boxShadow: `0 2px 5px ${rgba(V.ink0, 0.7)}`,
            transform: `rotate(${(rnd(i * 4.4) * 90 - 45).toFixed(1)}deg)`,
          }} />
        );
      })}
    </div>
  );
};

// ── EL ABANICO — LA FIGURA. Cinco líneas del núcleo a las cinco piezas. `dir` invierte el punto
//    que viaja: +1 = del número hacia afuera (acto 2), −1 = de las piezas hacia el número (acto 4).
const Abanico: React.FC<{
  hub: { x: number; y: number };
  nodos: { x: number; y: number }[];
  q: number[]; dot: number[]; dir: number; tint: string; alpha: number;
}> = ({ hub, nodos, q, dot, dir, tint, alpha }) => {
  if (alpha <= 0.01) return null;
  const HX = hub.x * 19.2, HY = hub.y * 10.8;
  return (
    <svg viewBox="0 0 1920 1080" preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: clamp01(alpha) }}>
      {nodos.map((n, i) => {
        const NX = n.x * 19.2, NY = n.y * 10.8;
        const len = Math.sqrt((NX - HX) * (NX - HX) + (NY - HY) * (NY - HY));
        const qq = clamp01(q[i]);
        if (qq <= 0.002) return null;
        const off = len * (1 - qq);
        return (
          <g key={i}>
            <line x1={HX} y1={HY} x2={NX} y2={NY}
              stroke={rgba(tint, 0.16)} strokeWidth={11} strokeLinecap="round"
              strokeDasharray={len} strokeDashoffset={off} />
            <line x1={HX} y1={HY} x2={NX} y2={NY}
              stroke={rgba(tint, 0.86)} strokeWidth={2.6} strokeLinecap="round"
              strokeDasharray={len} strokeDashoffset={off} />
          </g>
        );
      })}
      {nodos.map((n, i) => {
        const d = dot[i];
        if (d < 0 || d > 1) return null;
        const t = dir > 0 ? d : 1 - d;
        const NX = n.x * 19.2, NY = n.y * 10.8;
        const px = lerp(HX, NX, t), py = lerp(HY, NY, t);
        const env = Math.sin(clamp01(d) * Math.PI);
        return (
          <g key={`d${i}`}>
            <circle cx={px} cy={py} r={16} fill={rgba(tint, 0.20 * env)} />
            <circle cx={px} cy={py} r={5.5} fill={rgba(tint, 0.95 * env + 0.05)} />
          </g>
        );
      })}
      {/* el núcleo: el anillo del que sale todo (y al que todo vuelve) */}
      <circle cx={HX} cy={HY} r={30} fill="none" stroke={rgba(tint, 0.34)} strokeWidth={2} />
      <circle cx={HX} cy={HY} r={44} fill="none" stroke={rgba(tint, 0.14)} strokeWidth={1.4} />
    </svg>
  );
};

// ── UNA PIEZA DEL PRESUPUESTO — vidrio con MATERIAL REAL adentro + ícono PNG + barra de magnitud
const Pieza: React.FC<{
  i: number; x: number; y: number; s: number; z: number;
  valor: number; barra: number; lit: number; g: number; sheenAt: number;
}> = ({ i, x, y, s, z, valor, barra, lit, g, sheenAt }) => {
  const p = PIEZAS[i];
  if (s <= 0.02) return null;
  const W = 336, H = 208;
  const bob = Math.sin(g / (44 + i * 7) + i * 1.7) * 2.6;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: W, height: H + 62, marginLeft: -W / 2, marginTop: -(H + 62) / 2,
      transform: `translateZ(${z.toFixed(1)}px) translateY(${bob.toFixed(2)}px) scale(${s.toFixed(3)})`,
      transformStyle: "preserve-3d",
    }}>
      {/* el vidrio con el material real: la línea de la tableta del vendedor, recortada */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: W, height: H,
        borderRadius: 10, overflow: "hidden",
        border: `1px solid ${rgba(p.tint, 0.34 * lit)}`,
        boxShadow: `0 ${Math.round(H * 0.16)}px ${Math.round(H * 0.2)}px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.white, 0.22 * lit)}`,
      }}>
        <Mat photo="img/cmeurgente/cmeu_vendedor_tablet.jpg" w={W} h={H} k={p.k}
          cx={p.cx} cy={p.cy} lit={0.5 + 0.5 * lit} litColor={p.tint} sheenAt={sheenAt} />
        {/* el rótulo de la pieza, sobre su propia cama */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "30px 14px 11px",
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.92) 56%)",
          display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8,
        }}>
          <span style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.7,
            color: rgba(V.white, 0.5 + 0.5 * lit), textTransform: "uppercase",
          }}>{p.nom}</span>
          <span style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 38, lineHeight: 1,
            color: rgba(V.amber, 0.55 + 0.45 * lit),
            textShadow: `0 0 18px ${rgba(V.amber, 0.34 * lit)}, 0 4px 14px rgba(0,0,0,0.9)`,
          }}>{miles(valor)}</span>
        </div>
      </div>
      {/* el ícono PNG: objeto de la escena, delante del vidrio y con su propia sombra */}
      <IconPng src={p.ic} x={16} y={4} size={86} z={26} opacity={0.5 + 0.5 * lit} rot={-4 + i * 2} glow={V.ink0} />
      {/* LA BARRA DE MAGNITUD: lo que ENCOGE. Su largo es el dinero de esta pieza. */}
      <div style={{
        position: "absolute", left: 0, top: H + 16, width: W, height: 12,
        borderRadius: 6, background: rgba(V.ink1, 0.72),
        boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.08)}`,
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: 12, borderRadius: 6,
          width: `${(clamp01((p.full / 11400) * barra) * 100).toFixed(2)}%`,
          background: `linear-gradient(90deg, ${rgba(V.amber, 0.5 + 0.4 * lit)} 0%, ${rgba(V.amber, 0.86 * lit + 0.12)} 100%)`,
          boxShadow: `0 0 16px ${rgba(V.amber, 0.34 * lit)}`,
        }} />
      </div>
    </div>
  );
};

// ── LA CIFRA — el objeto que atraviesa el movimiento entero. `corte` la borra (goma) o la escribe
//    (lápiz) sin un solo fundido: es un recorte que avanza, como en el papel de verdad.
const Cifra: React.FC<{
  valor: string; unidad?: string; rotulo?: string;
  x: number; y: number; size: number; color: string;
  corte?: number; sentido?: "borra" | "escribe"; pad?: number; on?: number;
}> = ({ valor, unidad, rotulo, x, y, size, color, corte = 0, sentido = "borra", pad = 1, on = 1 }) => {
  if (on <= 0.01) return null;
  const c = clamp01(corte);
  // ⛔ `inset()` no admite valores negativos: el recorte se hace sobre una caja CON PADDING, así el
  // resplandor de la cifra vive dentro del área recortable y no se ve un canto duro.
  const clip = sentido === "borra"
    ? `inset(0% 0% 0% ${(c * 100).toFixed(2)}%)`
    : `inset(0% ${((1 - c) * 100).toFixed(2)}% 0% 0%)`;
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, opacity: clamp01(on) }}>
      {/* cama radial: la cifra nunca se pierde encima del material */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: size * 4.4 * pad, height: size * 2.7 * pad,
        marginLeft: -size * 2.2 * pad, marginTop: -size * 1.35 * pad,
        background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
      }} />
      <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
        {rotulo && (
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.max(19, Math.round(size * 0.19)),
            letterSpacing: 3.4, color: rgba(V.white, 0.68), textTransform: "uppercase",
            marginBottom: Math.round(size * 0.07), textShadow: "0 4px 18px rgba(0,0,0,0.92)",
          }}>{rotulo}</div>
        )}
        <div style={{ clipPath: clip }}>
          <span style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.92, color,
            textShadow: `0 0 ${Math.round(size * 0.4)}px ${rgba(color, 0.4)}, 0 6px 26px rgba(0,0,0,0.92)`,
          }}>{valor}</span>
          {unidad && (
            <span style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.round(size * 0.34),
              marginLeft: 10, color: rgba(color, 0.82),
              textShadow: "0 4px 18px rgba(0,0,0,0.9)",
            }}>{unidad}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const MovSemilla: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build monta el movimiento en UNA Sequence: el frame LOCAL no tiene por qué ser el global.
  const lFrame = useCurrentFrame();
  const ACT_IN = [0, 0, A2, A3, A4];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(4, Math.round(acto)))] + lFrame;
  const g = Math.max(0, Math.min(END, gRaw));
  const off = gRaw - lFrame;
  const L = (gAt: number) => gAt - off;

  // Ventana de clip alineada al múltiplo de 153 LOCAL: el clip entra siempre en su frame 0 (que ES
  // la foto de base) y sale antes de la vuelta. Nunca se ve el relevo ni el salto del loop.
  const clipWin = (desde: number, largo: number) => {
    const s0 = Math.ceil(Math.max(0, L(desde)) / CLIP_FRAMES) * CLIP_FRAMES + off;
    return ip(g, [s0 - 1, s0, s0 + largo, s0 + largo + 18], [0, 1, 1, 0]);
  };

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ═══════════════════════════
  // Hereda de MovDesglose (z −240, ry −14, orbita completada) y entrega a MovSetecientos
  // (z −320, panY −6, primer plano cerrado sobre la hoja). Un solo viaje: baja y cierra.
  const camB = gcam(g, { z0: -240, z1: -320, panX: 14, panY: -6, ry: 0, rx: 0, dur: END });
  const camZ = ip(g, [0, 160, 360, 520, 720, 880, 1020, 1150, 1260],
    [0, 26, 58, 30, 44, 12, 34, 58, 46]);
  const camRY = ip(g, [0, 200, 420, 720, 900, 1120, 1260],
    [-14, -11.4, -7.6, -3.4, -1.6, -0.6, -0.2]);
  const camDrop = ip(g, [0, 300, 620, 720, 800, 900, 1020, 1140, 1260],
    [0, -3, -14, -46, -84, -100, -112, -124, -130]);
  const camTilt = ip(g, [0, 360, 640, 720, 820, 1020, 1260],
    [0, -0.4, -1.1, -2.6, -4.6, -5.6, -6.4]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateY(${camRY.toFixed(2)}deg) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — VENTANA DE LA COCINA todo el tramo: ámbar lateral bajo + el volt del dato.
  //    Entra plena y sale CONCENTRADA en la mano, con el resto cayendo en sombra (floor sube).
  const keyFrom = ip(g, [0, 200, 360, 560, 720, 900, 1020, 1140, 1260],
    [0.70, 0.66, 0.58, 0.46, 0.50, 0.60, 0.66, 0.72, 0.78]);
  const inten = ip(g, [0, 120, 360, 520, 720, 900, 1020, 1140, 1260],
    [0.84, 0.92, 1.00, 1.04, 0.98, 0.90, 0.86, 0.78, 0.70]);
  const floor = ip(g, [0, 360, 720, 1020, 1260], [0.52, 0.56, 0.62, 0.68, 0.76]);
  const tintA = light(ip(g, [0, 120, 380, 620, 760, 1020, 1260],
    [0.14, 0.22, 0.86, 0.90, 0.50, 0.30, 0.18]), "amber", "volt");
  const tintB = light(ip(g, [0, 360, 720, 1020, 1260], [0, 0.12, 0.30, 0.16, 0.05]), "amber", "torch");

  // ══ COSTURA 1 (g360) — ZOOM-THROUGH dentro de la cifra copiada en la tableta ══════════════
  const ZT_AT = 328, ZT_DUR = 34, ZFX = 62, ZFY = 43;
  const zt = zoomThrough(g, ZT_AT, ZT_DUR, ZFX, ZFY);
  // el mundo del acto 2 NACE con la contra-escala exacta, sobre el MISMO punto focal: la cámara
  // entra por un lado del número y sale por el otro. Su opacidad es 1 SIEMPRE (no hay fundido).
  const s2 = ipe(g, [ZT_AT + 2, ZT_AT + 102], [3.2, 1], Easing.out(Easing.cubic));
  const out2 = g < ZT_AT + 2
    ? `translate(${((50 - ZFX) * 2.2).toFixed(2)}%, ${((50 - ZFY) * 2.2).toFixed(2)}%) scale(3.2)`
    : `translate(${((50 - ZFX) * (s2 - 1)).toFixed(2)}%, ${((50 - ZFY) * (s2 - 1)).toFixed(2)}%) scale(${s2.toFixed(3)})`;

  // ══ ACTO 1 — LA FACTURA Y EL VENDEDOR QUE COPIA ═══════════════════════════════════════════
  const kF = [0, 90, 176, 260, 360];
  const facW = ip(g, kF, [1250, 1040, 640, 604, 596]);
  const facH = ip(g, kF, [706, 604, 400, 380, 376]);
  const facX = ip(g, kF, [48, 41, 23, 20.6, 20]);
  const facY = ip(g, kF, [47, 49, 53.5, 55.4, 56]);
  const facZ = ip(g, kF, [44, 20, -36, -46, -48]);
  const facRY = ip(g, kF, [2, 6, 11, 12, 12.4]);
  const facK = Math.max(1.06, ip(g, kF, [1420, 1290, 1120, 1140, 1150]) / Math.max(40, facW));

  const kT = [56, 130, 200, 300, 360];
  const tabX = ip(g, kT, [124, 84, 64, 62, 61.6]);
  const tabW = ip(g, kT, [700, 760, 800, 820, 824]);
  const tabH = ip(g, kT, [438, 476, 500, 512, 515]);
  const tabRY = ip(g, kT, [-18, -11, -6, -4.6, -4.4]);
  const tabZ = ip(g, kT, [-24, 0, 18, 26, 28]);
  const tabLit = ip(g, [56, 140, 240], [0.42, 0.86, 1]);

  // ══ LA CIFRA — el objeto que cruza TODO el movimiento ═════════════════════════════════════
  // Nace en la columna de la factura, la copian a la tableta, la cámara entra DENTRO de ella, se
  // vuelve el núcleo del abanico, baja con la cámara hasta la hoja, y ahí la goma la borra.
  const cifX = ip(g, [190, 214, 256, ZT_AT, 396, 452, 648, 706, 772, 1010],
    [21.5, 34, 61.8, 61.8, 34, HUB2.x, HUB2.x, 31, 44, 44]);
  const cifY = ip(g, [190, 214, 256, ZT_AT, 396, 452, 648, 706, 772, 1010],
    [51.5, 44, 43, 43, 45, HUB2.y, HUB2.y, 44, 47.5, 47.5]);
  const cifS = ip(g, [190, 256, ZT_AT, 352, 396, 452, 648, 706, 772],
    [40, 54, 58, 112, 152, 168, 168, 132, 104]);
  const cifOn = ip(g, [186, 202], [0, 1]);
  const cifCol = light(ip(g, [190, 250, 300, 700, 800], [0, 0.2, 1, 1, 0.62]), "white", "volt");
  const cifRot = g < 452 ? "KILOVATIOS HORA AL MES" : g < 700 ? "LO QUE DICE TU FACTURA" : "LO QUE COPIÓ EL VENDEDOR";
  // LA GOMA: el recorte que borra la cifra de izquierda a derecha, con la pasada del clip real.
  const borrado = ipe(g, [812, 908], [0, 1], Easing.bezier(0.4, 0.02, 0.3, 1));
  // LA CIFRA NUEVA — reescrita MÁS CHICA en el hueco que dejó la goma.
  const escrito = ipe(g, [958, 1016], [0, 1], Easing.bezier(0.35, 0.05, 0.25, 1));
  const nueX = ip(g, [958, 1014, 1072, 1180, 1260], [44, 44, HUB4.x, HUB4.x, HUB4.x + 2.2]);
  const nueY = ip(g, [958, 1014, 1072, 1180, 1260], [47.5, 47.5, HUB4.y, HUB4.y, HUB4.y - 1.4]);
  const nueS = ip(g, [958, 1014, 1072, 1260], [72, 76, 104, 104]);

  // ══ ACTO 2 — EL ABANICO: cinco líneas que SALEN del número ════════════════════════════════
  const LSTART = [408, 436, 464, 492, 520];
  const qOut2 = ip(g, [648, 700, 764], [1, 1, 0]);          // las líneas se RECOGEN en la frontera
  const q2 = LSTART.map((s) => ip(g, [s, s + 34], [0, 1]) * qOut2);
  const dot2 = LSTART.map((s, i) => (g >= s && g <= s + 34)
    ? ip(g, [s, s + 34], [0, 1])
    : (g >= 660 + i * 9 && g <= 726 + i * 9 ? ip(g, [660 + i * 9, 726 + i * 9], [1, 0]) : -1));
  const nodos2 = PIEZAS.map((_, i) => nodoDe(HUB2, i, 1));
  // cada pieza NACE en el número y viaja por su línea hasta su nodo (nada aparece de la nada)
  const cq2 = LSTART.map((s) => ipe(g, [s + 8, s + 54], [0.10, 1], Easing.out(Easing.cubic)));
  const cin2 = ip(g, [652, 764], [1, 0.06]);                 // y vuelven a entrar en el número
  const cs2 = LSTART.map((s) => ipe(g, [s + 8, s + 54], [0.14, 1], Easing.out(Easing.cubic)) * ip(g, [652, 760], [1, 0.05]));
  const totV = ipe(g, [548, 646], [0, TOTAL], Easing.out(Easing.cubic));
  const totOn2 = ip(g, [544, 566, 676, 716], [0, 1, 1, 0]);

  // ══ ACTO 3 — LA HOJA QUE SUBE Y LA MANO CON LA GOMA ═══════════════════════════════════════
  const kH = [640, 700, 790, 900, 990, 1015];
  const hojY = ipe(g, kH, [128, 74, 52, 50, 44, 30], Easing.out(Easing.cubic));
  const hojX = ip(g, kH, [51, 50.4, 50, 49, 48, 47]);
  const hojW = ip(g, kH, [1120, 1150, 1180, 1180, 1210, 1290]);
  const hojH = ip(g, kH, [660, 680, 700, 700, 720, 780]);
  const hojRX = ip(g, kH, [-2, 1, 4, 5, 14, 26]);
  const hojZ = ip(g, kH, [-60, -20, 10, 18, 46, 96]);
  const hojLit = ip(g, [640, 720, 900, 1015], [0.5, 0.94, 1, 0.86]);
  const hojK = Math.max(1.05, ip(g, [640, 790, 900, 1015], [1400, 1300, 1260, 1330]) / Math.max(40, hojW));
  const vidA = clipWin(690, 126);
  const vidB = clipWin(880, 118);
  const migas = ipe(g, [820, 960], [0, 1], Easing.out(Easing.cubic));

  // ══ ACTO 4 — LA MISMA FIGURA, DEL REVÉS: TODO ENCOGE ══════════════════════════════════════
  const enc = ipe(g, [1082, 1176], [0, 1], Easing.bezier(0.3, 0.02, 0.24, 1));  // 0 = 23.000 · 1 = 13.800
  const spread4 = 1 - 0.20 * enc;
  const nodos4 = PIEZAS.map((_, i) => nodoDe(HUB4, i, spread4));
  const s4c = 1 - 0.20 * enc;
  const bar4 = 1 - 0.40 * enc;
  const q4 = PIEZAS.map(() => ip(g, [1009, 1030], [0.86, 1]));
  const dot4 = PIEZAS.map((_, i) => (g >= 1090 + i * 10 && g <= 1156 + i * 10)
    ? ip(g, [1090 + i * 10, 1156 + i * 10], [0, 1]) : -1);
  const salida = ip(g, [1180, 1260], [0, 1]);                 // el abanico sale de cuadro por arriba
  const gx4 = salida * 13;
  const gy4 = salida * -16;
  const lit4 = ip(g, [1082, 1180, 1260], [1, 0.94, 0.5]);
  const totOn4 = ip(g, [1040, 1066, 1206, 1250], [0, 1, 1, 0.25]);

  // la hoja del acto 4: crece hasta el PRIMER PLANO CERRADO con el que arranca MovSetecientos
  const h4Y = ip(g, [1009, 1080, 1180, 1260], [56, 54, 55, 57]);
  const h4X = ip(g, [1009, 1180, 1260], [45, 45, 46]);
  const h4W = ip(g, [1009, 1080, 1180, 1260], [1290, 1330, 1460, 1780]);
  const h4H = ip(g, [1009, 1080, 1180, 1260], [780, 800, 870, 1010]);
  const h4RX = ip(g, [1009, 1080, 1260], [22, 6, 1]);
  const h4Z = ip(g, [1009, 1080, 1260], [86, 30, 8]);
  const h4K = Math.max(1.05, ip(g, [1009, 1180, 1260], [1400, 1520, 1860]) / Math.max(40, h4W));
  const vidC = clipWin(1096, 118);

  // ══ TEXTOS — UNA idea por acto, cada una viva bastante más de 2,0 s + 0,28 s por palabra ══
  const t1 = ip(g, [108, 132, 306, 332], [0, 1, 1, 0]);       // 7,3 s · 5 palabras
  const t2 = ip(g, [402, 426, 676, 702], [0, 1, 1, 0]);       // 9,9 s · 4 palabras
  const t3 = ip(g, [768, 792, 972, 998], [0, 1, 1, 0]);       // 7,6 s · 5 palabras
  const t4 = ip(g, [1074, 1098, 1222, 1248], [0, 1, 1, 0]);   // 5,5 s · 3 palabras

  const verActo1 = g < ZT_AT + ZT_DUR + 12;
  const verActo2 = g >= ZT_AT - 4 && g < 812;
  const verActo3 = g >= 636 && g < 1015;
  const verActo4 = g >= 1009;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — todos los planos bajo UNA sola cámara ══════════════════════ */}
      <Layers cam={camT}>

        {/* ╔══ ACTO 1 · LA MESA DE LA COCINA, EL MINUTO DOS DE LA VISITA ═══════════════════╗ */}
        {/* el contenedor entero es lo que el ZOOM-THROUGH empuja hacia dentro de la cifra    */}
        {verActo1 && (
          <div style={{
            position: "absolute", inset: 0, transformStyle: "preserve-3d",
            transform: zt.out, opacity: zt.opacity,
          }}>
            {/* fondo lejano: la cocina del vendedor */}
            <PhotoPlane src="img/cmeurgente/cmeu_vendedor_tablet.jpg" kind="photo" z={-620}
              scale={ip(g, [0, 360], [1.30, 1.19])}
              dim={ip(g, [0, 120, 360], [0.50, 0.58, 0.66])} tint={V.amber} />

            {/* la mesa: el suelo sobre el que aterriza todo */}
            <PadPlane y={ip(g, [0, 360], [90, 86])} w={1560} h={340} rx={64}
              lit={ip(g, [0, 140, 360], [0.42, 0.6, 0.66])} z={-180} />

            {/* LA FACTURA sobre la mesa: de donde sale el número. Se corre a la izquierda y
                cede el centro al vendedor: nada se apaga, todo se mueve. */}
            <Plane z={0}>
              <Vitrina x={facX} y={facY} w={facW} h={facH} z={facZ} ry={facRY}
                radius={12} lit={ip(g, [0, 200, 360], [1, 0.92, 0.86])} litColor={V.amber}>
                <Mat photo="img/cmeurgente/cmeu_factura_lupa.jpg" w={facW} h={facH} k={facK}
                  cx={ip(g, [0, 200, 360], [50, 44, 42]) + Math.sin(g / 250) * 2.2}
                  cy={ip(g, [0, 200, 360], [52, 46, 45]) + Math.cos(g / 300) * 1.6}
                  lit={ip(g, [0, 200, 360], [1, 0.92, 0.86])} litColor={V.amber} sheenAt={L(34)} />
                {/* la columna de kilovatios hora, señalada sobre el papel */}
                <div style={{
                  position: "absolute", left: "8%", right: "8%",
                  top: `${ip(g, [120, 190], [64, 50]).toFixed(1)}%`, height: 3,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.volt, 0.7 * ip(g, [118, 150], [0, 1]))}, rgba(0,0,0,0))`,
                  boxShadow: `0 0 18px ${rgba(V.volt, 0.4 * ip(g, [118, 150], [0, 1]))}`,
                }} />
              </Vitrina>
            </Plane>

            {/* EL VENDEDOR CON LA TABLETA: entra por GEOMETRÍA desde fuera de cuadro */}
            <Plane z={0}>
              <Vitrina x={tabX} y={44} w={tabW} h={tabH} z={tabZ} ry={tabRY}
                radius={12} lit={tabLit} litColor={V.volt}>
                <Mat photo="img/cmeurgente/cmeu_vendedor_tablet.jpg" w={tabW} h={tabH}
                  k={ip(g, [56, 360], [1.42, 1.30])}
                  cx={54 + Math.sin(g / 210) * 2.4} cy={46 + Math.cos(g / 260) * 1.8}
                  lit={tabLit} litColor={V.volt} sheenAt={L(150)} />
                {/* la ventana del display de la tableta: donde aterriza el número copiado */}
                <div style={{
                  position: "absolute", left: "26%", top: "22%", width: "48%", height: "42%",
                  borderRadius: 6, border: `1px solid ${rgba(V.volt, 0.42 * ip(g, [214, 262], [0, 1]))}`,
                  background: `radial-gradient(closest-side, ${rgba(V.volt, 0.13 * ip(g, [214, 262], [0, 1]))}, rgba(0,0,0,0))`,
                }} />
              </Vitrina>
            </Plane>

            {/* PRIMER PLANO: la lupa del vendedor, delante de todo */}
            <Plane z={250}>
              <IconPng src="img/cmeurgente/cmeu_ic_lupa.png"
                x={ip(g, [0, 360], [84, 74])} y={ip(g, [0, 360], [78, 84])}
                size={ip(g, [0, 360], [156, 186])} z={0}
                opacity={ip(g, [0, 40, 300, 356], [0.9, 0.9, 0.9, 0.55])}
                rot={ip(g, [0, 360], [-12, -3])} glow={V.ink0} />
            </Plane>

            {/* la firma del video como textura de ambiente: las 24 horas del día */}
            <SunField sun={7 / 24} from={9} use={0.22}
              on={ip(g, [150, 190, 300, 344], [0, 0.32, 0.32, 0.1])}
              y={95} w={880} h={18} cycle={230} />
          </div>
        )}

        {/* ╔══ ACTO 2 · DE AHÍ SALE TODO — EL ABANICO AL DERECHO ═══════════════════════════╗ */}
        {/* nace con la contra-escala del zoom-through, sobre el MISMO punto focal            */}
        {verActo2 && (
          <div style={{
            position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: out2,
          }}>
            <PhotoPlane src="img/cmeurgente/cmeu_factura_lupa.jpg" kind="photo" z={-650}
              scale={ip(g, [ZT_AT, 812], [1.36, 1.20])}
              dim={ip(g, [ZT_AT, 470, 812], [0.62, 0.76, 0.80])} tint={V.volt} />

            {/* EL TEJADO al fondo: el sistema que TODAVÍA no hay que comprar, entero */}
            <RoofPlane y={94} w={1520} h={330} rx={60} z={-540}
              lit={ip(g, [370, 470, 760, 806], [0, 0.3, 0.3, 0.12])} panels={1} />

            {/* rejilla de profundidad: el aire entre el número y las piezas */}
            <Plane z={-360}>
              <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
                <AbsoluteFill style={{
                  opacity: ip(g, [368, 470, 700, 790], [0, 0.22, 0.22, 0.04]),
                  backgroundImage:
                    `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.09)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
                    `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
                }} />
              </div>
            </Plane>

            {/* LA CAMA DEL NÚCLEO: la macro de la columna de kWh de la factura, material real
                debajo del número (el número nunca flota sobre un fondo plano). */}
            <Plane z={-40}>
              <Vitrina x={HUB2.x} y={HUB2.y} w={ip(g, [ZT_AT, 452, 700, 790], [1180, 580, 570, 430])}
                h={ip(g, [ZT_AT, 452, 700, 790], [700, 344, 338, 254])}
                z={-30} ry={ip(g, [ZT_AT, 700], [3, 8])}
                radius={10} lit={ip(g, [ZT_AT, 400, 700, 800], [1, 0.9, 0.88, 0.6])} litColor={V.volt}>
                <Mat photo="img/cmeurgente/cmeu_factura_lupa.jpg"
                  w={ip(g, [ZT_AT, 452, 790], [1180, 580, 430])}
                  h={ip(g, [ZT_AT, 452, 790], [700, 344, 254])}
                  k={ip(g, [ZT_AT, 452, 790], [1.10, 1.62, 1.7])}
                  cx={42 + Math.sin(g / 240) * 1.8} cy={48 + Math.cos(g / 290) * 1.4}
                  lit={ip(g, [ZT_AT, 400, 800], [1, 0.9, 0.6])} litColor={V.volt} sheenAt={L(430)} />
              </Vitrina>
            </Plane>

            {/* LA FIGURA: las cinco líneas que salen del número */}
            <Plane z={10}>
              <Abanico hub={HUB2} nodos={nodos2} q={q2} dot={dot2} dir={1}
                tint={V.volt} alpha={ip(g, [400, 424, 780, 806], [0, 1, 1, 0.2])} />
            </Plane>

            {/* LAS CINCO PIEZAS DEL PRESUPUESTO — cada una con material real adentro */}
            <Plane z={40}>
              {PIEZAS.map((p, i) => {
                const t = clamp01(cq2[i] * cin2);
                const n = nodos2[i];
                return (
                  <Pieza key={i} i={i}
                    x={lerp(HUB2.x, n.x, t)} y={lerp(HUB2.y, n.y, t)}
                    s={cs2[i]} z={i === 2 ? 60 : i === 0 ? 20 : 40}
                    valor={p.full * ip(g, [LSTART[i] + 20, LSTART[i] + 56], [0, 1])}
                    barra={ip(g, [LSTART[i] + 26, LSTART[i] + 70], [0, 1])}
                    lit={ip(g, [LSTART[i] + 10, LSTART[i] + 46, 700, 780], [0.3, 1, 1, 0.5])}
                    g={g} sheenAt={L(LSTART[i] + 58)} />
                );
              })}
            </Plane>

            {/* PRIMER PLANO: la esquina del papel del presupuesto cruzando por delante — y
                anunciando la materia con la que se resuelve la frontera 3. */}
            {g >= 668 && (
              <Plane z={300}>
                <Vitrina x={ip(g, [676, 806], [-24, 124])} y={ip(g, [676, 806], [58, 70])}
                  w={640} h={430} z={0} rot={ip(g, [676, 806], [-16, -6])} ry={ip(g, [676, 806], [22, -14])}
                  radius={8} lit={0.5} litColor={V.paper} opacity={0.94}>
                  <Mat photo="img/cmeurgente/cmeu_factura_lupa.jpg" w={640} h={430} k={2.8}
                    cx={ip(g, [676, 806], [38, 62])} cy={54} lit={0.5} litColor={V.paper} />
                </Vitrina>
              </Plane>
            )}
          </div>
        )}

        {/* ╔══ ACTO 3 · LA HOJA QUE SUBE Y LA GOMA ════════════════════════════════════════╗ */}
        {/* entra POR GEOMETRÍA desde abajo de cuadro con el mismo vector que la cámara       */}
        {verActo3 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            <PhotoPlane src="img/cmeurgente/cmeu_mano_goma.jpg" kind="photo" z={-660}
              scale={ip(g, [660, 1015], [1.34, 1.22])}
              dim={ip(g, [660, 760, 1015], [0.84, 0.74, 0.70])} tint={V.amber} />

            <Plane z={0}>
              <Vitrina x={hojX} y={hojY} w={hojW} h={hojH} z={hojZ} rx={hojRX}
                ry={ip(g, [640, 900, 1015], [-4, -1, 2])}
                radius={12} lit={hojLit} litColor={V.amber}>
                <Mat photo="img/cmeurgente/cmeu_mano_goma.jpg"
                  clip="broll/cmeurgente/cmeu_mano_goma_mov.mp4" vid={Math.max(vidA, vidB)}
                  w={hojW} h={hojH} k={hojK}
                  cx={48 + Math.sin(g / 270) * 2.2} cy={50 + Math.cos(g / 320) * 1.6}
                  lit={hojLit} litColor={V.amber} sheenAt={L(742)} />
                {/* LA HOJA RAYADA: el renglón en el que se recogieron las cinco líneas */}
                <Renglones on={ip(g, [700, 790], [0, 0.9])} paso={54} tint={V.sky} />
                {/* las migas de la goma, acumulándose sobre el papel */}
                <Migas e={migas} g={g} x={52} y={54} w={520} />
                {/* la luz de la ventana de la cocina concentrándose en la mano */}
                <AbsoluteFill style={{
                  background: `radial-gradient(66% 54% at 44% 58%, ${rgba(V.amber, 0.26 * ip(g, [820, 1010], [0.2, 1]))} 0%, rgba(0,0,0,0) 68%)`,
                }} />
              </Vitrina>
            </Plane>

            {/* EL RENGLÓN QUE VIENE DEL ABANICO: la última de las cinco líneas, ya recogida,
                aterriza como la raya de la hoja. Cruza la frontera 2 sin cortarse. */}
            <Plane z={30}>
              <div style={{
                position: "absolute", left: "20%", width: `${ip(g, [700, 790], [8, 56]).toFixed(1)}%`,
                top: `${(hojY + 4).toFixed(2)}%`, height: 3,
                opacity: ip(g, [694, 730, 900, 960], [0, 0.9, 0.9, 0.25]),
                background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.volt, 0.7)} 24%, ${rgba(V.volt, 0.5)} 76%, rgba(0,0,0,0))`,
                boxShadow: `0 0 16px ${rgba(V.volt, 0.32)}`,
              }} />
            </Plane>
          </div>
        )}

        {/* ╔══ ACTO 4 · Y TODO ENCOGE — LA MISMA FIGURA, DEL REVÉS ════════════════════════╗ */}
        {verActo4 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            <PhotoPlane src="img/cmeurgente/cmeu_mano_goma.jpg" kind="photo" z={-640}
              scale={ip(g, [1009, 1260], [1.30, 1.18])}
              dim={ip(g, [1009, 1140, 1260], [0.76, 0.72, 0.66])} tint={V.amber} />

            {/* EL TEJADO: el sistema encoge con el número — la firma del video, literal */}
            <RoofPlane y={92} w={1500} h={320} rx={60} z={-520}
              lit={ip(g, [1020, 1080, 1240], [0.16, 0.34, 0.24])} panels={1 - 0.4 * enc} />

            {/* LA HOJA: el suelo del acto y el PRIMER PLANO CERRADO con el que me voy */}
            <Plane z={0}>
              <Vitrina x={h4X} y={h4Y} w={h4W} h={h4H} z={h4Z} rx={h4RX}
                ry={ip(g, [1009, 1260], [3, 0.4])}
                radius={ip(g, [1180, 1260], [12, 6])} lit={ip(g, [1009, 1100, 1260], [0.8, 1, 1])} litColor={V.amber}>
                <Mat photo="img/cmeurgente/cmeu_mano_goma.jpg"
                  clip="broll/cmeurgente/cmeu_mano_goma_mov.mp4" vid={vidC}
                  w={h4W} h={h4H} k={h4K}
                  cx={46 + Math.sin(g / 280) * 1.8} cy={52 + Math.cos(g / 330) * 1.3}
                  lit={ip(g, [1009, 1100, 1260], [0.8, 1, 1])} litColor={V.amber} sheenAt={L(1122)} />
                <Renglones on={ip(g, [1009, 1090, 1260], [0.6, 0.9, 1])} paso={58} tint={V.sky} />
                <Migas e={1} g={g} x={56} y={46} w={480} />
                {/* el ámbar se concentra en la mano y el resto cae en sombra */}
                <AbsoluteFill style={{
                  background: `radial-gradient(58% 50% at 42% 56%, ${rgba(V.amber, 0.30 * ip(g, [1060, 1260], [0.4, 1]))} 0%, rgba(0,0,0,0) 66%)`,
                }} />
              </Vitrina>
            </Plane>

            {/* LA MISMA FIGURA — mismo vector relativo, ahora con los puntos volviendo al núcleo */}
            <div style={{
              position: "absolute", inset: 0, transformStyle: "preserve-3d",
              transform: `translate(${gx4.toFixed(2)}%, ${gy4.toFixed(2)}%)`,
            }}>
              <Plane z={20}>
                <Abanico hub={HUB4} nodos={nodos4} q={q4} dot={dot4} dir={-1}
                  tint={V.volt} alpha={ip(g, [1009, 1040, 1200, 1260], [0.5, 1, 1, 0.42])} />
              </Plane>
              <Plane z={50}>
                {PIEZAS.map((p, i) => (
                  <Pieza key={i} i={i}
                    x={nodos4[i].x} y={nodos4[i].y}
                    s={s4c} z={i === 2 ? 64 : i === 0 ? 24 : 44}
                    valor={p.full * (1 - 0.4 * enc)}
                    barra={bar4} lit={lit4} g={g} sheenAt={L(1044 + i * 12)} />
                ))}
              </Plane>
            </div>
          </div>
        )}

        {/* ╔══ LA CIFRA — EL OBJETO QUE ATRAVIESA EL MOVIMIENTO ENTERO ════════════════════╗ */}
        {/* Vive FUERA de los contenedores de acto: es el punto fijo del zoom-through y el   */}
        {/* núcleo del abanico. Ningún acto la monta ni la desmonta.                          */}
        <Plane z={90}>
          {g >= 186 && g < 930 && (
            <Cifra valor="1.240" unidad={g >= 400 && g < 700 ? "kWh" : undefined}
              rotulo={g >= 236 && g < 700 ? cifRot : undefined}
              x={cifX} y={cifY} size={cifS} color={cifCol}
              corte={borrado} sentido="borra"
              pad={ip(g, [190, 400, 700], [0.8, 1, 0.9])} on={cifOn} />
          )}
          {g >= 956 && (
            <Cifra valor="860" unidad="kWh"
              rotulo={g >= 1040 ? "DESPUÉS DE SEIS ARREGLOS" : undefined}
              x={nueX} y={nueY} size={nueS} color={V.volt}
              corte={escrito} sentido="escribe" pad={0.92}
              on={ip(g, [1200, 1260], [1, 0.8])} />
          )}
        </Plane>
      </Layers>

      {/* ══════ COSTURA · FRONTERA 3 (g1020) — OCLUSIÓN: LA HOJA SE LEVANTA Y TAPA ════════ */}
      {/* el color es el de LA MATERIA que cruza (el papel), nunca el del fondo, y con la    */}
      {/* luminancia media del componente (lit 0,34 < 0,45): ni fundido a negro ni flash.    */}
      <SeamOcclude at={L(1006)} dur={26} color={V.paper} angle={-7} lit={0.34} />

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ═════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* EL TOTAL DEL PRESUPUESTO — se arma en el acto 2 y ENCOGE en el acto 4 */}
        {totOn2 > 0.01 && (
          <div style={{ position: "absolute", left: "84%", top: "86%", transform: "translate(-50%,-50%)", opacity: totOn2 }}>
            <Bed pad={18}>
              <div style={{
                fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2.6,
                color: rgba(V.white, 0.6), textTransform: "uppercase", marginBottom: 4,
              }}>El presupuesto</div>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 84, lineHeight: 0.94, color: V.amber,
                textShadow: `0 0 30px ${rgba(V.amber, 0.34)}, 0 6px 24px rgba(0,0,0,0.92)`,
              }}>{miles(totV)}<span style={{ fontSize: 34, marginLeft: 8, opacity: 0.8 }}>USD</span></div>
            </Bed>
          </div>
        )}
        {totOn4 > 0.01 && (
          <div style={{ position: "absolute", left: "84%", top: "86%", transform: "translate(-50%,-50%)", opacity: totOn4 }}>
            <Bed pad={18}>
              <div style={{
                fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2.6,
                color: rgba(V.white, 0.6), textTransform: "uppercase", marginBottom: 4,
              }}>El presupuesto</div>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: ip(g, [1082, 1176], [84, 66]),
                lineHeight: 0.94, color: V.amber,
                textShadow: `0 0 30px ${rgba(V.amber, 0.34)}, 0 6px 24px rgba(0,0,0,0.92)`,
              }}>{miles(TOTAL * (1 - 0.4 * enc))}<span style={{ fontSize: 30, marginLeft: 8, opacity: 0.8 }}>USD</span></div>
            </Bed>
          </div>
        )}

        {/* ACTO 1 · EL MINUTO DOS DE LA VISITA */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "5%", top: "68%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.amber}>Antes de medir nada</Kick>
              <div style={{ height: 8 }} />
              <Head size={60}>EL MINUTO DOS DE LA VISITA</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Abre tu factura y copia <Em>un solo número</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · DE AHÍ SALE TODO */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "4%", top: "8%", opacity: t2, transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)` }}>
            <Bed w={660} pad={24}>
              <Kick color={V.volt}>Ese número</Kick>
              <div style={{ height: 8 }} />
              <Head size={72}>DE AHÍ SALE TODO</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Las cinco piezas del presupuesto <Em>salen de él</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · ESE NÚMERO NO ES SAGRADO */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "5%", top: "70%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={680} pad={24}>
              <Kick color={V.amber}>Lo que nadie te dice</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}>ESE NÚMERO NO ES SAGRADO</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Lo puedes bajar <Em>esta semana</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · Y TODO ENCOGE */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "4.5%", top: "9%", opacity: t4, transform: `translateY(${((1 - t4) * -24).toFixed(1)}px)` }}>
            <Bed w={640} pad={24}>
              <Kick color={V.volt}>Baja el número</Kick>
              <div style={{ height: 8 }} />
              <Head size={74}>Y TODO ENCOGE</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Menos paneles, menos <Em color={V.amber}>de todo</Em></Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta de cierre: el ámbar se concentra en la mano y los bordes caen en sombra */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at ${ip(g, [0, 1260], [50, 45]).toFixed(1)}% ${ip(g, [0, 1260], [46, 54]).toFixed(1)}%, rgba(0,0,0,0) ${ip(g, [0, 720, 1260], [56, 52, 44]).toFixed(0)}%, rgba(6,7,5,${ip(g, [0, 720, 1260], [0.30, 0.38, 0.54]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
