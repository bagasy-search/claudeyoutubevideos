// MovS6B.tsx — MOVIMIENTO S6B · "LAS DOS HOJAS DE LA PARED" (segunda CTA)
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 2 actos · 925.270 → 942.250 ms · 509 frames @30.
//
// LA IDEA: no se vende nada. Se MUESTRAN dos páginas reales de los manuales de Claudio, las que
// tiene pegadas con cinta en la pared del garaje. El espectador está LEYENDO 8,4 y 8,6 segundos:
// la única obligación de este movimiento es que las dos hojas se vean hermosas y NÍTIDAS.
//
// ⛔ PROHIBIDO en pantalla: precio, URL, botón, cuenta regresiva. No hay ninguno.
// ⭐ EL TEXTO DE LAS FILAS ES TEXTO REAL DE REACT (Oswald + Inter), no una imagen con letras:
//    nítido a cualquier escala y sin erratas.
//
// LA COSTURA ENTRE LAS DOS LÁMINAS **NO ES UN FUNDIDO**: es un DESPLAZAMIENTO LATERAL DE CÁMARA
// por la pared. Las dos hojas están pegadas UNA AL LADO DE LA OTRA en el mismo muro (x 960 y x 2880
// del muro), y los DOS actos montan el muro ENTERO. Lo único que se mueve es `wallX(gFrame)`, que
// corre el muro 1920 px entre los frames g236 y g268 — a caballo entre el final del acto 1 y el
// arranque del acto 2. Por eso el pan se ve continuo aunque los dos actos sean ramas distintas.
//
// UNA cámara: `camAt(gFrame)`. Entra en la hoja (scale 0,62 → 1: la hoja pasa a ocupar el cuadro
// entero) y después NO se detiene nunca — sigue con un empuje lentísimo hasta 1,055 y la deriva viva
// del `gcam`. Nunca vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch. Debajo de todo, la CAMA DE
// FOTO: la pared real del garaje con las hojas (`cmee_s6_senala_pared_hojas.png`).
// LA LUZ: la de trabajo, BLANCA, entrando desde la IZQUIERDA — la misma en las dos hojas, así que
// la costura no cambia de iluminación. Se va abriendo (torch 0,10 → 0,17) a lo largo del movimiento.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-252 (8,4 s) · LÁMINA 1 "LAS 7 CONEXIONES QUE NO SE HACEN NUNCA"
//   entra  cam {plano de la pared, hoja al 62%, cinta y bloques visibles} luz {trabajo blanca desde la izq}
//   sale   cam {hoja a sangre, empuje lentísimo; el muro EMPIEZA a correr} luz {la misma, sin cambio}
//   ── COSTURA ···· PAN LATERAL POR LA PARED: la hoja 1 sale por la izquierda y entra la de al lado.
//                   ⛔ NO es un fundido: es el mismo muro continuo moviéndose. ····················
// ACTO 2 · g251-509 (8,6 s) · LÁMINA 2 "CALIBRE DE CABLE Y FUSIBLE POR CONSUMO"
//   entra  cam {terminando el pan, hoja 2 llegando al centro}   luz {la misma luz de trabajo}
//   sale   cam {quieta salvo deriva: se sostiene para poder leer} luz {torch 0,17, pareja}
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba,
  gcam, VoltAtmos, Layers, Plane, PhotoPlane, Kick,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const B1 = 0, B2 = 251;
const G_END = 509;
const START: Record<number, number> = { 1: B1, 2: B2 };

// ── EL MURO: las dos hojas están pegadas UNA AL LADO DE LA OTRA ──────────────────────────────
const SHEET1_X = 960;      // centro de la hoja 1, en coordenadas del muro
const SHEET2_X = 2880;     // centro de la hoja 2 (exactamente un ancho de cuadro a la derecha)
const PW = 1480, PH = 946; // el papel
const PTOP = (1080 - PH) / 2;

// ── LA TINTA DEL PAPEL ──────────────────────────────────────────────────────────────────────
const INK = "#22241C";
const INK_SOFT = "#5A5C50";
const PAPER_A = "#F6F3E9";
const PAPER_B = "#E7E3D3";
const PAPER_C = "#D8D3C0";

const PAPER_BED = "img/cmeenchufe/cmee_s6_senala_pared_hojas.png";

// ── LA CÁMARA · entra en la hoja y después NO se detiene nunca ───────────────────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -80, z1: 60, panX: 12, panY: -10, ry: -1.4, rx: 0.7, dur: G_END });
  const push = interpolate(g, [0, 46, 238, 268, G_END], [0.62, 1, 1.012, 1.022, 1.055], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.24, 0.62, 0.26, 1),
  });
  return `${base.transform} scale(${push.toFixed(4)})`;
};
// EL PAN LATERAL: el muro corre 1920 px. Empieza en el acto 1 y termina en el acto 2 — los dos
// actos montan el muro entero, así que la costura no tiene ni un frame de aire.
const wallX = (g: number) =>
  interpolate(g, [236, 268], [0, -1920], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.42, 0, 0.2, 1),
  });

// ── LOS BLOQUES DE LA PARED (el muro sigue existiendo a los costados de las hojas) ───────────
const Wall: React.FC = () => (
  <div style={{ position: "absolute", left: -1200, top: -400, width: 6240, height: 1880 }}>
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
      background: `linear-gradient(102deg, ${rgba(V.concrete, 0.36)} 0%, ${rgba(V.ink2, 0.94)} 44%, ${rgba(V.ink1, 0.99)} 100%)`,
    }} />
    {/* las juntas del bloque: horizontales cada 118 px, verticales trabadas */}
    {Array.from({ length: 16 }, (_, r) => (
      <div key={r} style={{ position: "absolute", left: 0, top: r * 118, width: "100%", height: 3, background: rgba(V.ink0, 0.6) }} />
    ))}
    {Array.from({ length: 130 }, (_, i) => {
      const r = i % 16;
      const c = Math.floor(i / 16);
      return (
        <div key={"v" + i} style={{
          position: "absolute", left: c * 396 + (r % 2 ? 198 : 0), top: r * 118, width: 3, height: 118,
          background: rgba(V.ink0, 0.5),
        }} />
      );
    })}
    {/* la luz de trabajo entra desde la IZQUIERDA y cae en el muro */}
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: `linear-gradient(96deg, ${rgba(V.torch, 0.1)} 0%, rgba(0,0,0,0) 46%)` }} />
  </div>
);

// ── LA CINTA DE ENMASCARAR (las cuatro esquinas de cada hoja) ────────────────────────────────
const Tape: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <div style={{
    position: "absolute", left: x, top: y, width: 126, height: 42,
    background: "linear-gradient(174deg, rgba(232,214,166,0.94), rgba(206,186,138,0.9))",
    transform: `rotate(${rot}deg)`,
    boxShadow: "0 6px 14px rgba(0,0,0,0.42)",
    opacity: 0.95,
  }} />
);

// ── LA HOJA: papel real, con su grano, su luz desde la izquierda y su sombra en la pared ─────
const Sheet: React.FC<{ cx: number; children: React.ReactNode; seed: number }> = ({ cx, children, seed }) => (
  <div style={{
    position: "absolute", left: cx - PW / 2, top: PTOP, width: PW, height: PH,
    transform: `rotate(${(rnd(seed) * 1.4 - 0.7).toFixed(2)}deg)`,
    boxShadow: `26px 30px 70px rgba(0,0,0,0.66), 0 2px 0 rgba(255,255,255,0.16)`,
  }}>
    {/* el papel */}
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: `linear-gradient(166deg, ${PAPER_A} 0%, ${PAPER_B} 58%, ${PAPER_C} 100%)` }} />
    {/* la luz de trabajo BLANCA entrando desde la izquierda */}
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: "linear-gradient(98deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.02) 40%, rgba(60,58,44,0.10) 100%)" }} />
    {/* grano del papel */}
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: 0.055,
      backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)",
      backgroundSize: "3px 3px", mixBlendMode: "multiply",
    }} />
    {/* fibras: cuatro dobleces suavísimos, para que no se lea como un rectángulo de CSS */}
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} style={{
        position: "absolute", left: 0, right: 0, top: 120 + rnd(seed + i * 3.3) * 700, height: 1,
        background: "rgba(0,0,0,0.05)",
      }} />
    ))}
    {children}
    {/* rótulo de esquina, discreto: es material de la guía */}
    <div style={{
      position: "absolute", right: 46, bottom: 26, fontFamily: F_BODY, fontWeight: 600, fontSize: 21,
      letterSpacing: 2.4, color: rgba(INK_SOFT, 0.85), textTransform: "uppercase",
    }}>Página de la guía · Claudio Mendoza</div>
    <Tape x={-30} y={-16} rot={-19} />
    <Tape x={PW - 96} y={-18} rot={14} />
    <Tape x={-34} y={PH - 26} rot={11} />
    <Tape x={PW - 92} y={PH - 24} rot={-13} />
  </div>
);

// ── LOS DIBUJOS A LÍNEA (una página de manual se dibuja a mano, no se fotografía) ────────────
const Draw: React.FC<{ kind: number; k: number }> = ({ kind, k }) => {
  const s = { stroke: INK, strokeWidth: 2.6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const op = 0.2 + 0.8 * k;
  return (
    <svg width={112} height={62} viewBox="0 0 112 62" style={{ opacity: op, overflow: "visible" }}>
      {kind === 0 && (<>
        {/* cable con clavija macho en las dos puntas — TACHADO */}
        <path {...s} d="M 16 22 h 14 v 18 h -14 z" />
        <path {...s} d="M 8 27 h 8 M 8 35 h 8" />
        <path {...s} d="M 96 22 h -14 v 18 h 14 z" />
        <path {...s} d="M 104 27 h -8 M 104 35 h -8" />
        <path {...s} d="M 30 31 C 46 18, 66 44, 82 31" />
        <path stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" d="M 10 54 L 102 8" />
      </>)}
      {kind === 1 && (<>
        {/* la caja gris con un cable hasta un tomacorriente de pared */}
        <path {...s} d="M 6 24 h 40 v 30 h -40 z" />
        <circle {...s} cx={40} cy={30} r={3} />
        <path {...s} d="M 46 34 C 66 34, 66 18, 84 18" />
        <path {...s} d="M 84 6 h 22 v 24 h -22 z" />
        <path {...s} d="M 91 14 v 8 M 99 14 v 8" />
      </>)}
      {kind === 2 && (<>
        {/* tablero de circuitos fijos, sin transferencia entre medio */}
        <path {...s} d="M 8 8 h 46 v 46 h -46 z" />
        <path {...s} d="M 16 18 h 12 M 16 28 h 12 M 16 38 h 12" />
        <path {...s} d="M 54 30 h 50" />
        <path {...s} d="M 76 20 v 20" />
        <circle {...s} cx={94} cy={30} r={9} />
      </>)}
      {kind === 3 && (<>
        {/* el interruptor general, puenteado */}
        <path {...s} d="M 24 10 h 30 v 44 h -30 z" />
        <path {...s} d="M 34 22 h 10 v 10 h -10 z" />
        <path {...s} d="M 14 32 h 10 M 54 32 h 10" />
        <path {...s} d="M 18 18 C 40 -2, 62 -2, 62 20" />
      </>)}
      {kind === 4 && (<>
        {/* extensión fina: el cuello estrangulado */}
        <path {...s} d="M 4 22 C 34 22, 40 28, 54 28 C 68 28, 74 22, 106 22" />
        <path {...s} d="M 4 40 C 34 40, 40 34, 54 34 C 68 34, 74 40, 106 40" />
        <path {...s} d="M 54 12 v 6 M 54 44 v 6" />
      </>)}
      {kind === 5 && (<>
        {/* dos calibres distintos empalmados */}
        <path stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" d="M 6 31 h 42" />
        <path stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" d="M 62 31 h 44" />
        <path {...s} d="M 48 20 h 14 v 22 h -14 z" />
      </>)}
      {kind === 6 && (<>
        {/* clavija sin la pata de tierra */}
        <path {...s} d="M 30 12 h 52 v 38 h -52 z" />
        <path {...s} d="M 30 22 h -22 M 30 40 h -22" />
        <path {...s} d="M 82 31 h 18" strokeDasharray="4 5" />
      </>)}
    </svg>
  );
};

// el dibujo del fusible que le corresponde a la fila resaltada (lámina 2)
const FuseDraw: React.FC<{ k: number }> = ({ k }) => (
  <svg width={160} height={120} viewBox="0 0 160 120" style={{ opacity: 0.15 + 0.85 * k, overflow: "visible" }}>
    <path stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" d="M 34 34 h 92 v 52 h -92 z" />
    <path stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" d="M 34 46 h -22 v 28 h 22" />
    <path stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" d="M 126 46 h 22 v 28 h -22" />
    <path stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" d="M 46 60 L 66 48 L 86 72 L 106 48 L 116 60" />
    <text x={80} y={112} textAnchor="middle" fontFamily={F_BODY} fontSize={19} fontWeight={700} fill={INK}>15 A</text>
  </svg>
);

// ── LÁMINA 1 · LAS 7 CONEXIONES QUE NO SE HACEN NUNCA ───────────────────────────────────────
const SIETE: { n: string; t: string; p: string }[] = [
  { n: "1", t: "CABLE CON MACHO EN LAS DOS PUNTAS", p: "Las patas libres quedan con corriente." },
  { n: "2", t: "LA BATERÍA A UN TOMA DE LA PARED", p: "Inyecta corriente hacia la calle." },
  { n: "3", t: "CIRCUITOS FIJOS SIN TRANSFERENCIA", p: "Tu casa y la línea quedan unidas." },
  { n: "4", t: "PUENTEAR EL INTERRUPTOR GENERAL", p: "Ya nadie puede cortar tu casa." },
  { n: "5", t: "CARGAR DESDE UNA EXTENSIÓN FINA", p: "El cuello se calienta antes que el fusible." },
  { n: "6", t: "EMPALMAR DOS CALIBRES DISTINTOS", p: "El más fino es el que se cocina." },
  { n: "7", t: "ENCHUFE SIN TOMA DE TIERRA", p: "La carcasa queda esperando tu mano." },
];

// ── LÁMINA 2 · CALIBRE DE CABLE Y FUSIBLE POR CONSUMO ───────────────────────────────────────
const TABLA: { n: string; c: string; a: string; g: string; f: string; hot?: boolean }[] = [
  { n: "1", c: "CONGELADOR VIEJO", a: "6 A", g: "14 AWG", f: "15 A", hot: true },
  { n: "2", c: "REFRIGERADOR", a: "5 A", g: "14 AWG", f: "15 A" },
  { n: "3", c: "LAVADORA", a: "8 A", g: "14 AWG", f: "15 A" },
  { n: "4", c: "BOMBA DE AGUA", a: "9 A", g: "14 AWG", f: "15 A" },
  { n: "5", c: "MICROONDAS", a: "11 A", g: "12 AWG", f: "20 A" },
  { n: "6", c: "AIRE DE VENTANA", a: "12 A", g: "12 AWG", f: "20 A" },
  { n: "7", c: "HERVIDOR ELÉCTRICO", a: "13 A", g: "12 AWG", f: "20 A" },
  { n: "8", c: "CALENTADOR DE PASO", a: "18 A", g: "10 AWG", f: "30 A" },
];

export const MovS6B: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const f = gFrame - (START[acto] ?? 0);     // frame LOCAL del acto

  // LA LUZ: la misma luz de trabajo en las dos hojas — se abre despacio, nunca salta.
  const inten = interpolate(gFrame, [0, 60, 268, G_END], [0.72, 0.9, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyFrom = interpolate(gFrame, [0, G_END], [0.2, 0.34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);
  const wx = wallX(gFrame);

  // los tiempos de lectura, en frames LOCALES de cada acto
  const filaOn = (i: number) => clamp01((f - (24 + i * 15)) / 9);          // lámina 1
  const rowOn = (i: number) => clamp01((f - (22 + i * 13)) / 8);           // lámina 2
  const hot = clamp01((f - 168) / 14);                                     // el resalte del congelador

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: una sola vez, opaca a sangre. Nunca se remonta entre actos. ── */}
      <VoltAtmos tint={V.torch} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={0.4} />
      {/* ── LA CAMA DE FOTO: la pared REAL del garaje con las hojas pegadas ── */}
      <PhotoPlane src={PAPER_BED} kind="photo" z={0} scale={1.24} dim={0.62} tint={V.torch} />

      <Layers cam={cam}>
        {/* EL MURO ENTERO se monta en LOS DOS actos: la costura es el pan, no un corte */}
        <Plane z={-260}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${wx.toFixed(1)}px)` }}>
            <Wall />
          </div>
        </Plane>

        <Plane z={0}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${wx.toFixed(1)}px)` }}>

            {/* ═══ LÁMINA 1 · LAS 7 CONEXIONES QUE NO SE HACEN NUNCA ═════════════════════ */}
            <Sheet cx={SHEET1_X} seed={3.1}>
              <div style={{
                position: "absolute", left: 56, top: 44, right: 56,
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 52, letterSpacing: 1.4,
                lineHeight: 1.06, color: INK, textTransform: "uppercase",
              }}>Las 7 conexiones que no se hacen nunca</div>
              <div style={{ position: "absolute", left: 56, top: 124, right: 56, height: 4, background: INK, opacity: 0.82 }} />
              <div style={{
                position: "absolute", left: 56, top: 136, fontFamily: F_BODY, fontWeight: 600, fontSize: 22,
                letterSpacing: 3, color: rgba(INK_SOFT, 0.9), textTransform: "uppercase",
              }}>Manual de instalación · hoja 1</div>

              {SIETE.map((r, i) => {
                const k = acto === 1 ? filaOn(i) : 1;
                const top = 186 + i * 101;
                return (
                  <div key={r.n}>
                    <div style={{ position: "absolute", left: 56, right: 56, top: top + 92, height: 1, background: rgba(INK, 0.16) }} />
                    {/* la numeración, escrita a mano en el margen */}
                    <div style={{
                      position: "absolute", left: 22, top: top + 24, width: 34, textAlign: "center",
                      fontFamily: F_BODY, fontStyle: "italic", fontWeight: 700, fontSize: 30,
                      color: rgba(INK_SOFT, 0.55 + 0.35 * k),
                      transform: `rotate(${(rnd(i * 7.7) * 8 - 4).toFixed(1)}deg)`,
                    }}>{r.n}</div>
                    <div style={{ position: "absolute", left: 68, top: top + 12 }}>
                      <Draw kind={i} k={k} />
                    </div>
                    <div style={{
                      position: "absolute", left: 198, top: top + 26, width: 520,
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 0.9,
                      lineHeight: 1.1, color: rgba(INK, 0.28 + 0.72 * k),
                      transform: `translateX(${lerp(-8, 0, k).toFixed(1)}px)`,
                    }}>{r.t}</div>
                    <div style={{
                      position: "absolute", left: 736, top: top + 30, width: 660,
                      fontFamily: F_BODY, fontWeight: 500, fontSize: 26, lineHeight: 1.2,
                      color: rgba(INK_SOFT, 0.24 + 0.76 * k),
                      transform: `translateX(${lerp(-8, 0, k).toFixed(1)}px)`,
                    }}>{r.p}</div>
                  </div>
                );
              })}
            </Sheet>

            {/* ═══ LÁMINA 2 · CALIBRE DE CABLE Y FUSIBLE POR CONSUMO ═════════════════════ */}
            <Sheet cx={SHEET2_X} seed={8.6}>
              <div style={{
                position: "absolute", left: 56, top: 44, right: 56,
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 52, letterSpacing: 1.4,
                lineHeight: 1.06, color: INK, textTransform: "uppercase",
              }}>Calibre de cable y fusible por consumo</div>
              <div style={{ position: "absolute", left: 56, top: 124, right: 56, height: 4, background: INK, opacity: 0.82 }} />
              {/* el encabezado de las CUATRO columnas */}
              {[
                { l: 66, w: 520, t: "CONSUMO" },
                { l: 606, w: 200, t: "AMPERES" },
                { l: 822, w: 260, t: "CALIBRE DE CABLE" },
                { l: 1098, w: 300, t: "FUSIBLE" },
              ].map((c) => (
                <div key={c.t} style={{
                  position: "absolute", left: c.l, top: 148, width: c.w,
                  fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 2.4,
                  color: rgba(INK_SOFT, 0.92), textTransform: "uppercase",
                }}>{c.t}</div>
              ))}
              <div style={{ position: "absolute", left: 56, top: 186, right: 56, height: 2, background: rgba(INK, 0.55) }} />
              {/* las reglas finas verticales: es una TABLA, no una lista */}
              {[594, 810, 1086].map((x) => (
                <div key={x} style={{ position: "absolute", left: x, top: 148, width: 1, height: 720, background: rgba(INK, 0.14) }} />
              ))}

              {TABLA.map((r, i) => {
                const k = acto === 2 ? rowOn(i) : 0;
                const top = 202 + i * 84;
                const hotK = r.hot ? (acto === 2 ? hot : 0) : 0;
                return (
                  <div key={r.n}>
                    {hotK > 0.02 && (
                      <div style={{
                        position: "absolute", left: 56, right: 56, top: top - 6, height: 74,
                        background: rgba(V.volt, 0.34 * hotK),
                        borderLeft: `7px solid ${rgba(V.voltSoft, 0.95 * hotK)}`,
                        boxShadow: `0 6px 18px rgba(0,0,0,${(0.14 * hotK).toFixed(2)})`,
                      }} />
                    )}
                    <div style={{ position: "absolute", left: 56, right: 56, top: top + 70, height: 1, background: rgba(INK, 0.14) }} />
                    <div style={{
                      position: "absolute", left: 22, top: top + 16, width: 34, textAlign: "center",
                      fontFamily: F_BODY, fontStyle: "italic", fontWeight: 700, fontSize: 26,
                      color: rgba(INK_SOFT, 0.5 + 0.35 * k),
                      transform: `rotate(${(rnd(i * 4.3 + 1.7) * 8 - 4).toFixed(1)}deg)`,
                    }}>{r.n}</div>
                    <div style={{
                      position: "absolute", left: 66, top: top + 14, width: 520,
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1,
                      color: rgba(INK, 0.24 + 0.76 * k),
                      transform: `translateX(${lerp(-10, 0, k).toFixed(1)}px)`,
                    }}>{r.c}</div>
                    {[{ l: 606, w: 200, t: r.a }, { l: 822, w: 260, t: r.g }, { l: 1098, w: 300, t: r.f }].map((c) => (
                      <div key={c.l} style={{
                        position: "absolute", left: c.l, top: top + 16, width: c.w,
                        fontFamily: F_BODY, fontWeight: 700, fontSize: 29, letterSpacing: 1,
                        color: rgba(INK, 0.2 + 0.8 * k),
                      }}>{c.t}</div>
                    ))}
                  </div>
                );
              })}
            </Sheet>

            {/* el dibujo a línea del fusible que le corresponde al congelador, en el margen */}
            {acto === 2 && hot > 0.02 && (
              <>
                <div style={{
                  position: "absolute", left: SHEET2_X + PW / 2 - 6, top: PTOP + 232, width: 74, height: 2,
                  background: rgba(INK, 0.5 * hot),
                }} />
                <div style={{ position: "absolute", left: SHEET2_X + PW / 2 + 62, top: PTOP + 178 }}>
                  <FuseDraw k={hot} />
                </div>
              </>
            )}
          </div>
        </Plane>
      </Layers>

      {/* ── EL RÓTULO DE ABAJO: dónde están las dos hojas. Sin precio y sin URL. ── */}
      {gFrame > 96 && (
        <div style={{
          position: "absolute", left: "3.4%", bottom: "5%",
          opacity: clamp01((gFrame - 96) / 16),
          padding: "14px 22px", borderRadius: 10,
          background: "linear-gradient(180deg, rgba(8,9,6,0.9) 0%, rgba(8,9,6,0.72) 100%)",
          boxShadow: "0 18px 46px rgba(0,0,0,0.6)",
        }}>
          <Kick color={V.volt}>ESTÁN ABAJO, EN LA DESCRIPCIÓN</Kick>
        </div>
      )}
    </AbsoluteFill>
  );
};
