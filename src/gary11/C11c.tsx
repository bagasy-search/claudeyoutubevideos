// gary11c · componentes propios (bomba de pozo sin luz). Mismo look de la serie: hoja de trabajo crema, tinta carbónica, sello rojo,
// cobre, unifilar azul. Cada mecanismo se usa UNA vez en los 6 videos (registro D:/rtmp/gary11_COMPONENTES.md).
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONTS } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const io = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const pop = (f: number, a: number) => { const x = Math.max(0, (f - a) / 30) * 9; return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.7); };
const CARBON = "#2a3f8f", BLUEPRINT = "#14305c", LINE = "#cfe0ff", GRN = "#3f9d5a", COP = "#e09a5a", HOT = "#ff7a2f", COLD = "#5fb4ff";
type P = { dur: number; m: number[] };
const M = (m: number[], i: number, d: number) => (m[i] ?? d);
const Bg: React.FC<{ children?: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <AbsoluteFill style={{ background: dark ? "#0f1b30" : "#2b2117" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,230,190,.10), rgba(0,0,0,.5))" }} />{children}</AbsoluteFill>);
const Sheet: React.FC<{ title: string; no?: string; children?: React.ReactNode; tilt?: number }> = ({ title, no = "11C", children, tilt = -1 }) => {
  const f = useCurrentFrame(); const e = k(f, 0, 14);
  return <Bg><div style={{ position: "absolute", left: 130, top: 70, width: 1660, height: 940, transform: `translateY(${(1 - e) * 60}px) rotate(${tilt}deg)`, opacity: e,
    background: `repeating-linear-gradient(0deg, transparent 0 47px, rgba(47,95,168,.16) 47px 49px), ${C.paper}`, boxShadow: "0 40px 90px rgba(0,0,0,.6)", borderRadius: 6 }}>
    <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(198,42,34,.45)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 92, background: C.ink, display: "flex", alignItems: "center", padding: "0 44px", justifyContent: "space-between", borderRadius: "6px 6px 0 0" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: C.paper, letterSpacing: 3 }}>{title}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.gold, letterSpacing: 4 }}>WORK SHEET · No. {no}</div></div>
    <div style={{ position: "absolute", left: 0, top: 92, right: 0, bottom: 0 }}>{children}</div></div></Bg>;
};
const Hand: React.FC<{ text: string; at: number; len?: number; size?: number; col?: string; style?: React.CSSProperties }> = ({ text, at, len = 18, size = 54, col = CARBON, style }) => {
  const f = useCurrentFrame(); const p = cl((f - at) / len); if (p <= 0) return null;
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - p * 100}% -20% 0)`, ...style }}>{text}</div>;
};
const Stamp: React.FC<{ text: string; at: number; x: number; y: number; col?: string; rot?: number; size?: number }> = ({ text, at, x, y, col = C.ver, rot = -8, size = 64 }) => {
  const f = useCurrentFrame(); if (f < at) return null;
  const s = interpolate(f, [at, at + 5, at + 9], [2.2, 0.94, 1], CL), o = interpolate(f, [at, at + 4], [0, 0.92], CL);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, border: `7px solid ${col}`, borderRadius: 10, padding: "6px 26px",
    fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 6, whiteSpace: "nowrap", mixBlendMode: "multiply" }}>{text}</div>;
};
const Big: React.FC<{ x: number; y: number; at: number; size?: number; col?: string; children: React.ReactNode; font?: string; anchor?: "l" | "c" }> = ({ x, y, at, size = 70, col = C.paper, children, font = SERIF, anchor = "c" }) => {
  const f = useCurrentFrame(); const e = k(f, at, 10); if (e <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"},-50%) translateY(${(1 - e) * 26}px)`, opacity: e, fontFamily: font, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: col === C.paper ? "0 4px 16px rgba(0,0,0,.6)" : "none", letterSpacing: font === SERIF ? 1 : 0 }}>{children}</div>;
};
const Dots: React.FC<{ d: string; on: number; col: string; speed?: number; w?: number }> = ({ d, on, col, speed = 3, w = 9 }) => {
  const f = useCurrentFrame(); if (on <= 0) return null;
  return <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray="4 24" strokeDashoffset={-f * speed} opacity={on} style={{ filter: `drop-shadow(0 0 6px ${col})` }} />;
};


// ==================== cutaway — EL POZO PARTIDO AL MEDIO (vuelve 11 veces, cada vez con una acción nueva)
// izquierda: el pozo con la bomba sumergible abajo; derecha: el sótano con el tanque de presión (vejiga + aire), presostato y manómetro
export const WellCut: React.FC<P & { act: string }> = ({ act, m, dur }) => {
  const f = useCurrentFrame(); const a = (i: number, d: number) => M(m, i, d);
  const GX = 520, TOP = 300, BOT = 1010; // el pozo
  const TX = 1240, TY = 420, TW = 300, TH = 460; // el tanque de presión
  // estado: psi (0..1 entre 0 y 60), corriendo, nivel estático, calor del motor
  let psi = 0.6, run = 0, heat = 0, hum = 0, hand = 0, ramp = 0, chk = 1, cyc = 0, wl = 0.25, flowUp = 0, flowOut = 0, airLow = 0;
  if (act === "well") { run = k(f, a(1, 60), 10); flowUp = run; }
  if (act === "bladder") { run = 1; flowUp = 1; psi = 0.35 + 0.5 * io((f - a(2, 60)) / 120); }
  if (act === "cutout") { psi = 0.6 + 0.4 * io(f / Math.max(20, a(1, 60))); run = f < a(2, dur * 0.7) ? 1 : 0; flowUp = run; }
  if (act === "drawdown") { flowOut = 1; psi = 1 - 0.55 * io(f / Math.max(30, dur - 20)); }
  if (act === "surge") { psi = 0.45; run = f > a(0, 20) ? 1 : 0; flowUp = run; }
  if (act === "cook") { run = 0; hum = 1; heat = io(f / Math.max(20, dur - 10)); }
  if (act === "static") { wl = 0.25 + 0.1 * Math.sin(f / 30); }
  if (act === "shortcycle") { airLow = k(f, a(2, dur * 0.6), 14); cyc = 1; run = Math.floor(f / 18) % 2 ? 1 : 0; psi = run ? 0.7 : 0.45; flowUp = run; }
  if (act === "softstart") { ramp = 1; run = 1; flowUp = 1; }
  if (act === "check") { chk = 1; psi = 0.6; }
  if (act === "handpump") { hand = 1; }
  const pumpY = BOT - 150, waterTop = TOP + (BOT - TOP) * wl;
  const lab = (txt: string, at: number, x: number, y: number, tx: number, ty: number, col = LINE) => {
    const e = k(f, at, 10); if (e <= 0) return null;
    return <g opacity={e}><line x1={x} y1={y} x2={x + (tx - x) * e} y2={y + (ty - y) * e} stroke={col} strokeWidth={3} /><circle cx={x} cy={y} r={7} fill={col} />
      <text x={tx + (tx > x ? 14 : -14)} y={ty + 12} textAnchor={tx > x ? "start" : "end"} fontFamily={SANS} fontWeight={800} fontSize={34} fill={col} letterSpacing={2}>{txt}</text></g>;
  };
  const L: Record<string, [string, number, number, number, number, number, string?][]> = {
    well: [["100–200 FT DOWN", a(0, 20), 540, 640, 760, 600], ["SUBMERSIBLE PUMP", a(1, 60), 540, pumpY, 760, pumpY + 40], ["LONG SKINNY MOTOR", a(2, 120), 540, pumpY + 70, 300, pumpY + 120]],
    bladder: [["PRESSURE TANK", a(0, 10), TX + 150, TY - 10, TX + 300, TY - 60], ["RUBBER BLADDER", a(1, 40), TX + 150, TY + 330, TX + 380, TY + 400], ["AIR", a(1, 50), TX + 150, TY + 90, TX + 380, TY + 60]],
    cutout: [["CUT-OUT · 50–60 PSI", a(1, 40), 1120, 330, 760, 260], ["SWITCH OPENS · PUMP STOPS", a(2, 90), 1120, 330, 760, 330, C.ver]],
    drawdown: [["DRAWDOWN", a(3, 120), TX + 150, TY + 300, TX + 380, TY + 260, C.gold], ["NOT THE WHOLE TANK", a(2, 90), TX + 150, TY + 120, TX + 380, TY + 120]],
    surge: [["DEAD STOP", a(0, 20), 540, pumpY, 760, pumpY], ["SURGE", a(1, 60), 700, 330, 760, 230, C.ver]],
    cook: [["TRYING TO START", 10, 540, pumpY, 760, pumpY], ["OVERHEATED", a(0, dur * 0.6), 540, pumpY + 60, 760, pumpY + 110, C.ver]],
    static: [["STATIC WATER LEVEL", a(0, 30), 540, waterTop, 760, waterTop - 40, COLD], ["PUMP SET DEPTH", a(0, 60), 540, pumpY, 760, pumpY + 40], ["HAND PUMP DEPTH", a(1, 140), 600, pumpY - 120, 300, pumpY - 180, C.gold]],
    shortcycle: [["ON · OFF · ON · OFF", 10, 1120, 330, 760, 260, C.ver], ["AIR CHARGE LOW", a(2, dur * 0.6), TX + 150, TY + 80, TX + 380, TY + 40, C.ver]],
    softstart: [["SOFT STARTER", 6, 1000, 800, 760, 900, GRN], ["SURGE ½", 20, 700, 330, 760, 230, GRN]],
    check: [["CHECK VALVE · ON TOP OF THE PUMP", a(1, 60), 540, pumpY - 40, 760, pumpY - 80, GRN], ["ONE MORE IN THE LINE", a(2, 110), 540, 420, 760, 430, GRN]],
    handpump: [["CYLINDER AT THE BOTTOM", a(1, 80), 470, pumpY - 60, 300, pumpY - 120, C.gold], ["HANDLE AT THE TOP", a(2, 130), 470, 150, 300, 120, C.gold], ["NEXT TO THE ELECTRIC PUMP", a(0, 30), 560, 600, 760, 640]],
  };
  const sw = run ? 1 : 0; const shake = (cyc || act === "surge") && run ? Math.sin(f * 2) * 3 : 0;
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <defs><pattern id="g3" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(207,224,255,.07)" strokeWidth={2} /></pattern></defs>
      <rect width={1920} height={1080} fill="url(#g3)" />
      {/* tierra + nieve */}
      <rect x={0} y={TOP - 40} width={980} height={1080} fill="#3b2c20" opacity={0.85} />
      <rect x={0} y={TOP - 60} width={980} height={24} fill="#eef3f7" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 97) % 960} cy={TOP + 40 + ((i * 131) % 700)} r={4 + (i % 3)} fill="#5a4330" />)}
      {/* casing del pozo */}
      <rect x={GX - 60} y={TOP - 120} width={120} height={BOT - TOP + 120} fill="#1b2638" stroke={LINE} strokeWidth={4} />
      <rect x={GX - 56} y={waterTop} width={112} height={BOT - waterTop} fill={COLD} opacity={0.45} />
      {/* bomba + motor */}
      <g transform={`translate(${shake} 0)`}>
        <rect x={GX - 30} y={pumpY} width={60} height={70} fill="#c9ced6" stroke="#333" strokeWidth={3} />
        <rect x={GX - 30} y={pumpY + 70} width={60} height={110} rx={8} fill={heat > 0 ? `rgb(${Math.round(190 + 60 * heat)},${Math.round(190 - 120 * heat)},${Math.round(200 - 160 * heat)})` : "#9aa3ad"} stroke="#333" strokeWidth={3} style={{ filter: heat > 0.3 ? `drop-shadow(0 0 ${20 * heat}px ${HOT})` : "none" }} />
        {run > 0 && [0, 1, 2].map((i) => <line key={i} x1={GX} y1={pumpY + 125} x2={GX + 22 * Math.cos(f * (ramp ? Math.min(0.5, f / 80) : 0.5) + i * 2.1)} y2={pumpY + 125 + 22 * Math.sin(f * 0.5 + i * 2.1)} stroke="#333" strokeWidth={5} />)}
        {hum > 0 && f % 6 < 3 && <text x={GX + 50} y={pumpY + 140} fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.ver}>mmm</text>}
      </g>
      {/* válvula de retención */}
      {act === "check" && <g opacity={k(f, a(1, 60), 10)}><circle cx={GX} cy={pumpY - 30} r={22} fill={GRN} /><path d={`M ${GX - 12} ${pumpY - 22} L ${GX} ${pumpY - 40} L ${GX + 12} ${pumpY - 22}`} stroke="#fff" strokeWidth={5} fill="none" /><circle cx={GX} cy={430} r={20} fill={GRN} opacity={k(f, a(2, 110), 10)} /></g>}
      {/* caño de subida + cable */}
      <path d={`M ${GX} ${pumpY} L ${GX} ${TOP - 140} L 1150 ${TOP - 140} L 1150 ${TY + TH - 40} L ${TX} ${TY + TH - 40}`} fill="none" stroke="#6b7a8f" strokeWidth={22} />
      <path d={`M ${GX + 18} ${pumpY + 80} L ${GX + 18} ${TOP - 110} L 1000 ${TOP - 110} L 1000 760`} fill="none" stroke="#222" strokeWidth={6} />
      <Dots d={`M ${GX} ${pumpY} L ${GX} ${TOP - 140} L 1150 ${TOP - 140} L 1150 ${TY + TH - 40} L ${TX} ${TY + TH - 40}`} on={flowUp} col={COLD} speed={6} />
      {act === "surge" && run > 0 && <Dots d={`M 1000 760 L 1000 ${TOP - 110} L ${GX + 18} ${TOP - 110} L ${GX + 18} ${pumpY + 80}`} on={cl(1 - (f - a(0, 20)) / 30)} col={C.ver} speed={14} w={14} />}
      {ramp > 0 && <g opacity={k(f, 6, 10)}><rect x={960} y={740} width={80} height={60} rx={8} fill={GRN} /><Dots d={`M 1000 760 L 1000 ${TOP - 110} L ${GX + 18} ${TOP - 110} L ${GX + 18} ${pumpY + 80}`} on={cl(f / 60)} col={GRN} speed={4} /></g>}
      {/* tanque de presión con vejiga */}
      <rect x={TX} y={TY} width={TW} height={TH} rx={110} fill="#2f5fa8" stroke={LINE} strokeWidth={4} />
      {(() => { const wh = 80 + (TH - 160) * (act === "drawdown" ? psi * 0.7 : psi * 0.55 + 0.1) * (1 - airLow * 0.3); return <g>
        <rect x={TX + 20} y={TY + 40} width={TW - 40} height={TH - 80 - wh} rx={80} fill="rgba(255,255,255,.18)" />
        <path d={`M ${TX + 20} ${TY + TH - 40 - wh} Q ${TX + TW / 2} ${TY + TH - 70 - wh} ${TX + TW - 20} ${TY + TH - 40 - wh} L ${TX + TW - 20} ${TY + TH - 60} Q ${TX + TW / 2} ${TY + TH - 10} ${TX + 20} ${TY + TH - 60} Z`} fill={COLD} opacity={0.8} stroke="#111" strokeWidth={6} />
        {act === "drawdown" && <rect x={TX + TW + 30} y={TY + TH - 40 - wh} width={40} height={wh - 20} fill={C.gold} opacity={0.85} />}
      </g>; })()}
      <Dots d={`M ${TX} ${TY + TH - 40} L 1110 ${TY + TH - 40} L 1110 1000 L 1700 1000`} on={flowOut} col={COLD} speed={5} />
      {/* presostato + manómetro */}
      <rect x={1080} y={300} width={90} height={80} rx={8} fill="#8a8f96" stroke={LINE} strokeWidth={3} />
      <line x1={1100} y1={340} x2={1150} y2={340 - (sw ? 0 : 18)} stroke={sw ? GRN : C.ver} strokeWidth={8} />
      <circle cx={1660} cy={360} r={70} fill="#f2f2f2" stroke="#666" strokeWidth={8} />
      <line x1={1660} y1={360} x2={1660 + 55 * Math.cos(Math.PI * (1.2 - psi * 1.4))} y2={360 - 55 * Math.sin(Math.PI * (1.2 - psi * 1.4))} stroke={C.ver} strokeWidth={7} strokeLinecap="round" />
      <text x={1660} y={470} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={38} fill={C.paper}>{Math.round(psi * 60)} PSI</text>
      {/* bomba manual (variante) */}
      {hand > 0 && <g opacity={k(f, 6, 12)}><rect x={GX - 110} y={TOP - 120} width={20} height={pumpY - TOP + 80} fill={C.gold} /><rect x={GX - 124} y={pumpY - 60} width={48} height={70} rx={8} fill={C.gold} />
        <path d={`M ${GX - 100} ${TOP - 120} L ${GX - 100} ${TOP - 200} L ${GX - 100 + 130 * Math.cos(-0.4 + 0.3 * Math.sin(f / 8))} ${TOP - 200 + 130 * Math.sin(-0.4 + 0.3 * Math.sin(f / 8))}`} stroke={C.gold} strokeWidth={16} fill="none" strokeLinecap="round" /></g>}
      {(L[act] || []).map(([t, at, x, y, tx, ty, col]) => <React.Fragment key={t}>{lab(t, at, x, y, tx, ty, col)}</React.Fragment>)}
    </svg>
    {act === "cook" && <Stamp text="$2,200 · 3 DAYS" at={Math.max(20, dur - 40)} x={1450} y={180} />}
    {act === "softstart" && <Stamp text="CUT IN HALF" at={M(m, 0, 40)} x={1450} y={180} col={GRN} />}
  </Bg>;
};

// ==================== faucetcough — la canilla tose: tres bocanadas de aire, una gota, y nada (el vaso queda vacío)
export const FaucetCough: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, 40), c = M(m, 2, 80);
  const puff = (at: number) => { const t = (f - at) / 18; if (t < 0 || t > 1.4) return null; return <div style={{ position: "absolute", left: 930 - t * 40, top: 440 + t * 60, width: 60 + t * 120, height: 60 + t * 120, borderRadius: "50%", background: "rgba(220,230,240,.35)", opacity: 1 - t / 1.4 }} />; };
  return <Bg>
    <div style={{ position: "absolute", left: 640, top: 300, width: 400, height: 60, background: "linear-gradient(180deg,#e9edf0,#8b939c)", borderRadius: 30 }} />
    <div style={{ position: "absolute", left: 900, top: 340, width: 70, height: 110, background: "linear-gradient(90deg,#9aa3ad,#e9edf0,#8b939c)", borderRadius: "0 0 20px 20px" }} />
    {[a, a + 12, b].map((t, i) => <React.Fragment key={i}>{puff(t)}</React.Fragment>)}
    {f > b + 10 && f < c + 20 && <div style={{ position: "absolute", left: 928, top: 460 + Math.min(260, (f - b - 10) * 12), width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: COLD }} />}
    <div style={{ position: "absolute", left: 860, top: 720, width: 160, height: 220, border: "6px solid rgba(255,255,255,.6)", borderTop: "none", borderRadius: "0 0 20px 20px" }} />
    <Big x={960} y={180} at={c} size={90} col={C.ver}>nothing.</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== gearchain — tres engranajes POWER → PUMP → WATER; el primero se frena y arrastra a los otros
export const GearChain: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const stop = M(m, 0, 10); const sp = f < stop ? 1 : Math.max(0, 1 - (f - stop) / 20);
  const ang = (f < stop ? f : stop + (1 - Math.pow(1 - Math.min(1, (f - stop) / 20), 2)) * 10) * 3;
  const gear = (cx: number, cy: number, r: number, rot: number, label: string, i: number) => {
    const teeth = Array.from({ length: 12 }, (_, t) => { const an = (t / 12) * Math.PI * 2; return <rect key={t} x={cx - 14} y={cy - r - 22} width={28} height={36} fill={["#c62a22", "#b8733a", "#2f5fa8"][i]} transform={`rotate(${(an * 180) / Math.PI + rot} ${cx} ${cy})`} />; });
    const dead = f > M(m, i, stop + i * 40);
    return <g key={label}>{teeth}<circle cx={cx} cy={cy} r={r} fill={["#c62a22", "#b8733a", "#2f5fa8"][i]} /><circle cx={cx} cy={cy} r={r * 0.35} fill="#1b1b1b" />
      <text x={cx} y={cy + r + 90} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={dead ? "#777" : C.paper}>{label}</text>
      {dead && <text x={cx} y={cy + 20} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={60} fill="#fff">✕</text>}</g>;
  };
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    {gear(480, 480, 160, ang, "POWER", 0)}{gear(960, 480, 160, -ang + 15, "PUMP", 1)}{gear(1440, 480, 160, ang, "WATER", 2)}</svg>
    <Big x={960} y={110} at={4} size={52} font={SANS} col={sp > 0.5 ? C.paper : C.ver}>one stops · they all stop</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== combolock — candado de combinación: tres números que hay que saber, cada uno hace clic
export const ComboLock: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["WHICH PUMP", "THE ONE NUMBER", "WHAT WORKS"]; const ats = T.map((_, i) => M(m, i, 20 + i * 80));
  const cur = ats.reduce((acc, a, i) => (f >= a ? i : acc), -1); const target = [120, -200, 60][Math.max(0, cur)]; const prev = cur > 0 ? [120, -200, 60][cur - 1] : 0;
  const rot = cur < 0 ? f * 2 : prev + (target - prev) * io((f - ats[cur]) / 14); const open = k(f, ats[2] + 30, 12);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={`M 800 ${460 - open * 60} L 800 300 Q 800 160 960 160 Q 1120 160 1120 300 L 1120 ${400 - open * 60}`} fill="none" stroke="#c9c9c9" strokeWidth={50} />
      <rect x={720} y={420} width={480} height={460} rx={60} fill="#2a2a2a" />
      <g transform={`rotate(${rot} 960 650)`}><circle cx={960} cy={650} r={170} fill="#111" stroke="#888" strokeWidth={8} />
        {Array.from({ length: 40 }, (_, i) => <line key={i} x1={960} y1={490} x2={960} y2={i % 5 ? 505 : 520} stroke="#ddd" strokeWidth={4} transform={`rotate(${i * 9} 960 650)`} />)}</g>
      <path d="M 945 460 L 975 460 L 960 485 Z" fill={C.ver} />
    </svg>
    {T.map((t, i) => <div key={t} style={{ position: "absolute", left: i === 0 ? 150 : i === 1 ? 150 : 1300, top: i === 2 ? 420 : 330 + i * 200, opacity: k(f, ats[i], 8), fontFamily: SANS, fontWeight: 800, fontSize: 52, color: i <= cur ? C.gold : C.paper }}>{i + 1} · {t} {i < cur || (i === cur && f > ats[i] + 14) ? "✓" : ""}</div>)}
    {dur > 0 && null}
  </Bg>;
};

// ==================== flashlight — el haz de la linterna barre el sótano oscuro y encuentra el tanque y la cajita gris
export const Flashlight: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.5);
  const x = interpolate(f, [0, a, b, b + 30, dur], [300, 700, 1100, 1400, 1400], CL), y = interpolate(f, [0, a, b, b + 30, dur], [700, 600, 560, 420, 420], CL);
  return <AbsoluteFill style={{ background: "#07090d" }}>
    <AbsoluteFill style={{ WebkitMaskImage: `radial-gradient(circle 260px at ${x}px ${y}px, #000 55%, transparent 100%)`, maskImage: `radial-gradient(circle 260px at ${x}px ${y}px, #000 55%, transparent 100%)` }}>
      <AbsoluteFill style={{ background: "#3a3f46" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: "#555b62" }} />
      <div style={{ position: "absolute", left: 900, top: 300, width: 330, height: 560, borderRadius: 120, background: "linear-gradient(90deg,#1f4f9a,#3f7fd8,#1f4f9a)" }} />
      <div style={{ position: "absolute", left: 700, top: 760, width: 260, height: 26, background: "#8a8f96" }} />
      <div style={{ position: "absolute", left: 1350, top: 360, width: 110, height: 100, background: "#8a8f96", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 1290, top: 400, width: 70, height: 20, background: "#b87333" }} />
    </AbsoluteFill>
    <Big x={1065} y={240} at={b - 10} size={46} font={SANS}>PRESSURE TANK</Big>
    <Big x={1500} y={300} at={b + 30} size={46} col={C.gold} font={SANS}>the small gray box</Big>
  </AbsoluteFill>;
};

// ==================== liftoff — la pesa: arrancar desde quieto cuesta 3–5 veces lo que cuesta sostenerla
export const LiftOff: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const lift = io((f - a) / 20); const w = f < a + 20 ? Math.round(1000 + 3000 * Math.sin(Math.PI * cl((f - a) / 20))) : 1000;
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 900, width: 1200, height: 20, background: "#555" }} />
    <div style={{ position: "absolute", left: 560, top: 820 - lift * 380, width: 800, height: 20, background: "#bbb" }}>
      <div style={{ position: "absolute", left: -40, top: -90, width: 80, height: 200, background: "#222", borderRadius: 12 }} /><div style={{ position: "absolute", right: -40, top: -90, width: 80, height: 200, background: "#222", borderRadius: 12 }} /></div>
    <Big x={960} y={180} at={4} size={110} col={w > 1500 ? C.ver : C.gold}>{w.toLocaleString("en-US")} W</Big>
    <Big x={960} y={290} at={a + 24} size={44} font={SANS}>½ HP · running</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== lockers — tres casilleros: se abren uno por uno con lo que SÍ funciona
export const Lockers: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = [["240 V OUT", "from one station"], ["OR TWO LINKED", "units together"], ["SURGE RATING", "above the pump start"]];
  const ats = T.map((_, i) => M(m, i, 10 + i * 60));
  return <Bg>{T.map(([t, s], i) => { const o = io((f - ats[i]) / 12);
    return <div key={t} style={{ position: "absolute", left: 200 + i * 540, top: 200, width: 440, height: 700, background: "#e9e4d6", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ padding: "180px 30px 0", fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: C.ink }}>{t}</div>
      <div style={{ padding: "20px 30px", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CARBON }}>{s}</div>
      <div style={{ position: "absolute", left: 140, bottom: 80, width: 160, height: 160, borderRadius: 80, background: GRN, color: "#fff", fontSize: 110, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f, ats[i] + 8) || 0.001})` }}>✓</div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#5d6a7a,#7d8a9a)", borderRadius: 10, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-o * 105}deg)` }}>
        {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ margin: "26px 60px 0", height: 12, background: "#3e4856", borderRadius: 6 }} />)}
        <div style={{ position: "absolute", right: 40, top: 330, width: 30, height: 90, background: "#c9c9c9", borderRadius: 8 }} /><div style={{ position: "absolute", left: 40, bottom: 40, fontFamily: SANS, fontWeight: 800, fontSize: 60, color: C.paper }}>{i + 1}</div></div></div>; })}{dur > 0 && null}</Bg>;
};

// ==================== beaker — dos probetas: el tanque de 20 gal da 6–7; el de 44 da 13–16
export const Beaker: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.5);
  const tube = (x: number, cap: number, use: number, at: number, lab: string) => { const e = io((f - at) / 30);
    return <div style={{ position: "absolute", left: x, top: 180, width: 300, height: 760 }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 300, height: 700 * (cap / 44), border: "8px solid rgba(255,255,255,.7)", borderTop: "none", borderRadius: "0 0 30px 30px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(use / cap) * 100 * e}%`, background: COLD, opacity: 0.75, borderRadius: "0 0 22px 22px" }} /></div>
      <div style={{ position: "absolute", top: -40, width: 300, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.paper, opacity: k(f, at, 8) }}>{lab}</div>
      <div style={{ position: "absolute", left: 320, bottom: 700 * (use / 44) * e - 30, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.gold, opacity: e, whiteSpace: "nowrap" }}>{use === 7 ? "6–7 gal" : "13–16 gal"}</div></div>; };
  return <Bg>{tube(420, 20, 7, a, "20 GAL TANK")}{tube(1100, 44, 15, b, "44 GAL TANK")}</Bg>;
};

// ==================== flywheel — el volante quieto pide un golpe enorme de corriente hasta que gira
export const Flywheel: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.6);
  const spin = io((f - a) / Math.max(20, b - a)); const ang = spin * spin * f * 6; const amps = Math.round(spin < 0.9 ? 40 - 30 * spin : 10);
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <g transform={`rotate(${ang} 760 540)`}><circle cx={760} cy={540} r={300} fill="none" stroke="#9aa3ad" strokeWidth={60} />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={760} y1={540} x2={760 + 280 * Math.cos(i * 1.047)} y2={540 + 280 * Math.sin(i * 1.047)} stroke="#9aa3ad" strokeWidth={24} />)}<circle cx={760} cy={540} r={50} fill="#555" /></g>
      <rect x={1300} y={300} width={60} height={480} rx={30} fill="#222" stroke="#666" strokeWidth={4} />
      <rect x={1306} y={306 + 468 * (1 - amps / 40)} width={48} height={468 * (amps / 40)} rx={24} fill={amps > 20 ? C.ver : GRN} />
    </svg>
    <Big x={1500} y={480} at={a} size={100} col={amps > 20 ? C.ver : GRN} anchor="l">{amps * 1} A</Big>
    <Big x={1500} y={600} at={b} size={52} font={SANS} anchor="l">½ second · spun up</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== stairs — la escalera del sótano: cada paso enciende un escalón con su título
const STEPS_C = ["Read your pump", "Know your starting number", "Pick your power source", "Connect it the legal way", "Fill up before the storm", "Run the pump in short shifts", "Protect the pipes", "Test it once in October"];
export const Stairs: React.FC<P & { n: number }> = ({ n }) => {
  const f = useCurrentFrame(); const climb = io((f - 6) / 16);
  return <Bg>
    {STEPS_C.map((t, i) => { const lit = i < n - 1 || (i === n - 1 && f > 14); const x = 200 + i * 190, y = 900 - i * 90;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 260, height: 1080 - y, background: lit ? (i === n - 1 ? "#d9b23a" : "#8b6a3f") : "#3a2c20", borderTop: `10px solid ${lit ? C.paper : "#5a4632"}`, boxShadow: i === n - 1 && lit ? "0 0 60px rgba(217,178,58,.6)" : "none" }}>
        <div style={{ padding: "14px 20px", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: lit ? C.ink : "#6b5844" }}>{i + 1}</div></div>; })}
    <div style={{ position: "absolute", left: 200 + (n - 1) * 190 + 80 - (1 - climb) * 190, top: 900 - (n - 1) * 90 - 150 + (1 - climb) * 90, width: 90, height: 140, background: C.ink, borderRadius: "40px 40px 10px 10px" }} />
    <div style={{ position: "absolute", left: 120, top: 120, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.gold, letterSpacing: 6 }}>STEP {n} OF 8</div>
    <Hand text={STEPS_C[n - 1]} at={12} len={16} size={90} col={C.paper} style={{ position: "absolute", left: 120, top: 180 }} />
  </Bg>;
};

// ==================== sliderule — la regla de cálculo: corre la reglilla y alinea HP con vatios de marcha y de arranque
export const SlideRule: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 30); const off = io((f - a) / 16) * 0; const rows = [["½ HP", "1,000 W", "3,000–5,000 W"], ["¾ HP", "1,500 W", "4,000–7,000 W"], ["1 HP", "2,000 W", "5,000–8,000 W"]];
  const sel = 0; const slide = io((f - 8) / 16);
  return <Bg>
    <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 480, background: "#efe6cf", borderRadius: 16, boxShadow: "0 30px 70px rgba(0,0,0,.55)" }}>
      {["HORSEPOWER", "RUNNING", "TO START"].map((h, i) => <div key={h} style={{ position: "absolute", left: 60 + i * 520, top: 30, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.gold, letterSpacing: 4 }}>{h}</div>)}
      {rows.map((r, j) => r.map((c, i) => <div key={i + "" + j} style={{ position: "absolute", left: 60 + i * 520 + (i > 0 ? (1 - slide) * 300 : 0), top: 110 + j * 120, fontFamily: i === 2 ? SERIF : SANS, fontWeight: 900, fontSize: 64, color: j === sel ? (i === 2 ? C.ver : C.ink) : "rgba(19,33,58,.35)", opacity: i > 0 ? slide : 1 }}>{c}</div>))}
      <div style={{ position: "absolute", left: 30 + off, top: 95, width: 1540, height: 110, border: `6px solid ${C.ver}`, borderRadius: 14, opacity: k(f, a, 8) }} /></div>
    <Big x={960} y={170} at={4} size={56} col={C.paper} font={SANS}>the rule of thumb</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== scratch — raspadita: la moneda raspa PEAK y aparecen CONTINUOUS y SURGE
export const Scratch: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.55); const p = cl((f - a) / 40);
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 680, background: "#2b2b2b", borderRadius: 24, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#ffd84a", opacity: f > b ? 0.25 : 1 }}>PEAK 5000 W!</div>
      {f > b && <svg width={1200} height={300} style={{ position: "absolute", top: 40 }}><line x1={50} y1={150} x2={1150} y2={90} stroke={C.ver} strokeWidth={14} /></svg>}
      <div style={{ position: "absolute", left: 60, top: 330, width: 1080, height: 300, background: "#e9e6dd", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "30px 50px", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: C.ink }}>CONTINUOUS · 2,200 W</div>
        <div style={{ padding: "0 50px", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: C.ver }}>SURGE · 4,400 W</div>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg,#b8b8b8 0 12px,#a5a5a5 12px 24px)", clipPath: `inset(0 0 0 ${p * 100}%)` }} /></div></div>
    <div style={{ position: "absolute", left: 420 + p * 1080, top: 620 + 40 * Math.sin(f / 2), width: 110, height: 110, borderRadius: 55, background: "radial-gradient(circle at 35% 30%,#f2d16b,#a07a20)" }} />
  </Bg>;
};

// ==================== sleeve — la funda de espuma sube por el caño mientras afuera baja el termómetro
export const Sleeve: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const s = io((f - a) / 40); const deg = Math.round(40 - 40 * io(f / Math.max(30, dur)));
  return <Bg>
    <div style={{ position: "absolute", left: 200, top: 520, width: 1520, height: 70, background: "linear-gradient(180deg,#d9894a,#a5532e)", borderRadius: 35 }} />
    <div style={{ position: "absolute", left: 200, top: 500, width: 1520 * s, height: 110, background: "#4d4d4d", borderRadius: 55, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
    {Array.from({ length: 14 }, (_, i) => { const x = 220 + i * 108; return x > 200 + 1520 * s ? <div key={i} style={{ position: "absolute", left: x, top: 500 + 10 * Math.sin(i), width: 30, height: 30, color: "#dff1ff", fontSize: 40, opacity: cl((40 - deg) / 20) }}>❄</div> : null; })}
    <div style={{ position: "absolute", left: 1560, top: 140, width: 50, height: 300, borderRadius: 25, background: "#eee", border: "5px solid #999" }}><div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: 260 * (deg + 10) / 60, borderRadius: 18, background: deg < 32 ? COLD : C.ver }} /></div>
    <Big x={1400} y={300} at={4} size={80} col={deg < 32 ? COLD : C.paper}>{deg}°F</Big>
    <Big x={600} y={300} at={M(m, 1, dur * 0.6)} size={52} font={SANS}>wrap · close drafts · drain if needed</Big>
  </Bg>;
};

// ==================== cone — los conos de obra: cada error baja un cono numerado a la fila
const MIST_C = ["THE DRYER OUTLET", "BURNING UP THE PUMP", "MODIFIED SINE", "GENERATOR INSIDE", "THE PRESSURE SWITCH"];
export const Cone: React.FC<P & { n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <Bg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: "#2e2e2e" }} />
    {MIST_C.map((t, i) => { const cur = i === n - 1, on = i < n; const y = cur ? 520 - (1 - Math.min(1, pop(f, 4))) * 600 : 520;
      return on ? <div key={i} style={{ position: "absolute", left: 140 + i * 340, top: y, width: 260 }}>
        <svg width={260} height={360}><path d="M 130 0 L 230 340 L 30 340 Z" fill="#ff6a1a" /><rect x={70} y={120} width={120} height={36} fill="#fff" /><rect x={50} y={220} width={160} height={36} fill="#fff" /><rect x={0} y={330} width={260} height={30} rx={8} fill="#222" /></svg>
        <div style={{ position: "absolute", top: 40, width: 260, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 50, color: "#fff" }}>{i + 1}</div>
        <div style={{ marginTop: 20, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: cur ? C.gold : "#aaa", opacity: cur ? k(f, 10, 8) : 1 }}>{t}</div></div> : null; })}
    <div style={{ position: "absolute", left: 120, top: 110, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: C.paper }}>MISTAKE {n}</div>
  </Bg>;
};

// ==================== scissors — la tijera de cables corta el cable suicida en dos
export const Scissors: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const close = io((f - 14) / 8); const cut = f > 22; const sep = io((f - 22) / 14) * 120;
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d={`M 100 560 L ${960 - sep} 560`} stroke="#222" strokeWidth={36} strokeLinecap="round" /><path d={`M ${960 + sep} 560 L 1820 560`} stroke="#222" strokeWidth={36} strokeLinecap="round" />
    {cut && <g><circle cx={960 - sep} cy={560} r={14} fill="#c87533" /><circle cx={960 + sep} cy={560} r={14} fill="#c87533" /></g>}
    <rect x={40} y={500} width={90} height={120} rx={12} fill="#444" /><rect x={1790} y={500} width={90} height={120} rx={12} fill="#444" />
    <g transform={`rotate(${-30 + 30 * close} 960 560)`}><path d="M 960 560 L 960 200" stroke="#c62a22" strokeWidth={50} strokeLinecap="round" /></g>
    <g transform={`rotate(${30 - 30 * close} 960 560)`}><path d="M 960 560 L 960 920" stroke="#c62a22" strokeWidth={50} strokeLinecap="round" /></g>
    <circle cx={960} cy={560} r={30} fill="#999" /></svg>
    <Stamp text="CUT IT" at={24} x={960} y={160} />{dur > 0 && null}</Bg>;
};

// ==================== hoist — la grúa saca 240 pies de caño del pozo; el contador de pies y el de dólares corren juntos
export const Hoist: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 30); const p = io((f - a) / Math.max(30, dur - a - 20)); const ft = Math.round(240 * p), usd = Math.round(1500 + 1500 * p);
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={0} y={760} width={1920} height={320} fill="#3b2c20" /><rect x={0} y={740} width={1920} height={24} fill="#eef3f7" />
    <line x1={700} y1={760} x2={900} y2={180} stroke="#d9b23a" strokeWidth={26} /><line x1={1100} y1={760} x2={900} y2={180} stroke="#d9b23a" strokeWidth={26} />
    <line x1={900} y1={180} x2={900} y2={760 - p * 400 + 400} stroke="#222" strokeWidth={8} />
    <rect x={890} y={760 - p * 400 + 400 - 40} width={20} height={Math.max(40, 400 * (1 - p) + 300)} fill="#6b7a8f" />
    <rect x={860} y={740} width={80} height={40} fill="#1b2638" /></svg>
    <Big x={1450} y={400} at={a} size={110} col={C.paper} anchor="l">{ft} ft</Big>
    <Big x={1450} y={560} at={a} size={110} col={C.ver} anchor="l">${usd.toLocaleString("en-US")}</Big>
  </Bg>;
};

// ==================== contacts — los contactos del presostato bajo la lupa: se pican, se queman y se pegan
export const Contacts: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.4), c = M(m, 2, dur * 0.7);
  const pit = io((f - a) / 40); const stuck = f > b; const gap = stuck ? 0 : 40 + 20 * Math.sin(f / 6);
  return <Bg dark>
    <div style={{ position: "absolute", left: 460, top: 140, width: 1000, height: 800, borderRadius: 500, background: "radial-gradient(circle,#2a3346,#0d1220)", border: "20px solid #333" }} />
    <div style={{ position: "absolute", left: 700, top: 380 - gap / 2, width: 520, height: 120, background: "#c87533", borderRadius: 16 }} />
    <div style={{ position: "absolute", left: 700, top: 520 + gap / 2, width: 520, height: 120, background: "#c87533", borderRadius: 16 }} />
    {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 720 + ((i * 113) % 480), top: (i % 2 ? 470 - gap / 2 : 520 + gap / 2) + ((i * 7) % 20) - 10, width: 24, height: 24, borderRadius: 12, background: "#2a1a10", opacity: pit }} />)}
    <Big x={960} y={110} at={b} size={64} col={C.ver}>{stuck ? "STUCK" : ""}</Big>
    <Big x={960} y={990} at={c} size={52} font={SANS} col={C.gold}>runs nonstop · or never closes</Big>
  </Bg>;
};

// ==================== signpost — el poste de cruce de caminos: una flecha por cada tipo de pozo
export const Signpost: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["SHALLOW JET", "CONSTANT PRESSURE", "VERY DEEP", "SOFT STARTER", "TEN BELOW", "CISTERN", "MEDICAL"]; const at = (i: number) => M(m, i, 6 + i * 10);
  return <Bg><div style={{ position: "absolute", left: 940, top: 140, width: 40, height: 900, background: "#6b4a2a" }} />
    {T.map((t, i) => { const r = i % 2 ? 1 : -1; const e = pop(f, at(i)); return <div key={t} style={{ position: "absolute", left: r > 0 ? 980 : 460, top: 170 + i * 110, width: 480, height: 86, background: i === 0 ? C.gold : "#e9e4d6", transform: `rotate(${r * (3 + i % 3) * (2 - Math.min(1, e))}deg) scale(${Math.min(1, e) || 0.001})`, transformOrigin: r > 0 ? "0 50%" : "100% 50%", clipPath: r > 0 ? "polygon(0 0,90% 0,100% 50%,90% 100%,0 100%)" : "polygon(10% 0,100% 0,100% 100%,10% 100%,0 50%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.ink }}>{t}</div>; })}{dur > 0 && null}</Bg>;
};

// ==================== ramp — la bolita: subir el escalón de golpe (arranque directo) contra subir la rampa (arranque suave)
export const Ramp: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 60), b = M(m, 2, dur * 0.6); const t = cl((f - 10) / 60); const t2 = cl((f - a) / 80);
  const peak1 = Math.round(t < 0.2 ? 5000 * (t / 0.2) : t < 0.35 ? 5000 : 1000), peak2 = Math.round(1000 + 1500 * Math.min(1, t2 * 1.4));
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 120 460 L 520 460 L 520 260 L 860 260" stroke={C.ver} strokeWidth={18} fill="none" />
      <circle cx={interpolate(t, [0, 0.2, 0.35, 1], [140, 500, 540, 840])} cy={interpolate(t, [0, 0.2, 0.35, 1], [430, 430, 230, 230])} r={30} fill={C.ver} />
      <path d="M 1060 820 L 1800 620" stroke={GRN} strokeWidth={18} fill="none" /><path d="M 1060 820 L 1800 820" stroke="#555" strokeWidth={6} />
      <circle cx={1080 + 700 * t2} cy={790 - 190 * t2} r={30} fill={GRN} />
    </svg>
    <Big x={500} y={600} at={10} size={84} col={C.ver}>{peak1.toLocaleString("en-US")} W</Big><Big x={500} y={700} at={10} size={40} font={SANS}>direct start</Big>
    <Big x={1430} y={940} at={a} size={84} col={GRN}>{peak2.toLocaleString("en-US")} W</Big><Big x={1430} y={1020} at={a} size={40} font={SANS}>soft starter</Big>
    <Stamp text="HALF OR MORE" at={b} x={1440} y={300} col={GRN} />
  </Bg>;
};

// ==================== freezebat — la batería en la nieve: el rayo de carga choca contra el copo y no entra
export const FreezeBat: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const tries = Math.floor(f / 18); const ph = (f % 18) / 18;
  return <Bg dark>
    {Array.from({ length: 50 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 137) % 1920, top: ((f * (2 + (i % 3)) + i * 61) % 1100) - 20, color: "#dff1ff", fontSize: 20 + (i % 4) * 8, opacity: 0.6 }}>❄</div>)}
    <div style={{ position: "absolute", left: 760, top: 380, width: 400, height: 360, background: "#2b2b2b", borderRadius: 30, border: "6px solid #dff1ff" }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 280, height: 90, background: "#111", borderRadius: 10, fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.ver, display: "flex", alignItems: "center", justifyContent: "center" }}>NOT CHARGING</div>
      <div style={{ position: "absolute", left: 60, top: 200, fontFamily: SANS, fontWeight: 800, fontSize: 70, color: COLD }}>❄ 28°F</div></div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M ${300 + ph * 380} 560 l 30 -40 l -10 34 l 40 -10 l -30 44 l 10 -34 z`} fill="#ffe066" opacity={ph < 0.9 ? 1 : 0} /></svg>
    <Big x={960} y={180} at={4} size={56} font={SANS} col={C.paper}>keep the station inside, warm</Big>{tries > 99 && dur > 0 && null}
  </Bg>;
};

// ==================== register — la caja registradora vieja: se aprietan las teclas, suben las banderitas con los precios y salta el cajón
export const Register: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 4), b = M(m, 1, dur * 0.6); const flags = [["PARTS", "$1,500–3,000", a + 8], ["LABOR", "+ on top", b]] as const;
  const drawer = io((f - b - 16) / 10);
  return <Bg>
    <div style={{ position: "absolute", left: 560, top: 380, width: 800, height: 420, background: "linear-gradient(180deg,#b8733a,#7a4a24)", borderRadius: "40px 40px 10px 10px", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 18 }, (_, i) => { const press = (i === 4 && f > a && f < a + 8) || (i === 13 && f > b && f < b + 8); return <div key={i} style={{ position: "absolute", left: 60 + (i % 6) * 115, top: 150 + Math.floor(i / 6) * 80 + (press ? 8 : 0), width: 90, height: 60, borderRadius: 30, background: "#f1ead6", boxShadow: press ? "none" : "0 8px 0 #6b5a3c", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>{["$", "1", "5", "0", "0", "+", "3", "0", "0", "0", "C", "×", "L", "A", "B", "=", "%", "#"][i]}</div>; })}
    </div>
    <div style={{ position: "absolute", left: 600, top: 800, width: 720, height: 90, background: "#4e3218", transform: `translateY(${drawer * 80}px)`, borderRadius: 8 }} />
    {flags.map(([t, v, at], i) => { const up = io((f - at) / 10); return <div key={t} style={{ position: "absolute", left: 640 + i * 340, top: 330 - up * 200, width: 300, height: 170, background: C.paper, border: `6px solid ${C.ink}`, opacity: up, textAlign: "center", paddingTop: 16 }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.gold }}>{t}</div><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: i ? C.ver : C.ink }}>{v}</div></div>; })}
  </Bg>;
};

// ==================== rungs — la escalera de precios: tres peldaños, del más caro al más barato
export const Rungs: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = [["HAND PUMP", "$3,000–5,000"], ["GENERATOR + INLET", "$1,300–2,700"], ["TUB + 4 JUGS", "≈ $30"]]; const ats = T.map((_, i) => M(m, i + 1, 20 + i * 60));
  return <Bg>
    <div style={{ position: "absolute", left: 560, top: 100, width: 30, height: 900, background: "#8b6a3f" }} /><div style={{ position: "absolute", left: 1330, top: 100, width: 30, height: 900, background: "#8b6a3f" }} />
    {T.map(([t, p], i) => <div key={t} style={{ position: "absolute", left: 590, top: 220 + i * 270, width: 740, height: 140, background: i === 2 ? GRN : "#e9e4d6", opacity: k(f, ats[i], 10), transform: `translateX(${(1 - k(f, ats[i], 10)) * -60}px)`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: i === 2 ? "#fff" : C.ink, borderRadius: 8 }}><span>{t}</span><span>{p}</span></div>)}
    <Stamp text="DO THE CHEAP ONE FIRST" at={Math.max(ats[2] + 30, dur - 40)} x={960} y={1000} col={GRN} size={50} />
  </Bg>;
};

// ==================== roadmap — el mapa de rutas del condado: el lápiz marca Wooster y el invierno de 2008
export const RoadMap: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20), b = M(m, 1, dur * 0.6);
  return <Bg><div style={{ position: "absolute", left: 200, top: 120, width: 1520, height: 840, background: "#e8e0c8", boxShadow: "0 30px 70px rgba(0,0,0,.5)", transform: "rotate(-1.5deg)" }}>
    <svg width={1520} height={840} style={{ position: "absolute" }}>
      {[["M 0 300 C 400 260 900 420 1520 360", 14], ["M 300 0 C 360 300 520 600 640 840", 10], ["M 900 0 C 880 300 1040 560 1100 840", 10], ["M 0 640 C 500 600 1100 720 1520 620", 8]].map(([d, w], i) => <path key={i} d={d as string} stroke={i ? "#c9b48a" : "#c62a22"} strokeWidth={w as number} fill="none" />)}
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 211) % 1520} cy={(i * 97) % 840} r={6} fill="#b9c79a" />)}
      <circle cx={760} cy={380} r={70 * k(f, a, 12)} fill="none" stroke={CARBON} strokeWidth={8} /></svg>
    <Hand text="Wooster" at={a} size={70} style={{ position: "absolute", left: 840, top: 290 }} />
    <Hand text="winter 2008" at={b} size={60} col={C.ver} style={{ position: "absolute", left: 840, top: 380 }} /></div></Bg>;
};

// ==================== dimmer — la lamparita y el reloj del generador: arranca, se ahoga, se apaga… otra vez
export const Dimmer: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const cyc = Math.max(0, f - a) % 40; const bog = f > a && cyc > 8 && cyc < 30; const lvl = bog ? 0.25 : 1; const rpm = bog ? 2200 : 3600;
  return <Bg dark>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 600px 360px, rgba(255,220,150,${0.35 * lvl}), transparent 50%)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={600} y1={0} x2={600} y2={240} stroke="#333" strokeWidth={6} />
      <circle cx={600} cy={330} r={90} fill={`rgba(255,${Math.round(200 * lvl + 40)},${Math.round(120 * lvl)},${0.3 + 0.7 * lvl})`} style={{ filter: `drop-shadow(0 0 ${50 * lvl}px #ffd28a)` }} />
      <circle cx={1350} cy={560} r={220} fill="#f2f2f2" stroke="#666" strokeWidth={10} />
      <line x1={1350} y1={560} x2={1350 + 180 * Math.cos(Math.PI * (1.2 - (rpm / 4000) * 1.4))} y2={560 - 180 * Math.sin(Math.PI * (1.2 - (rpm / 4000) * 1.4))} stroke={C.ver} strokeWidth={10} strokeLinecap="round" /></svg>
    <Big x={1350} y={860} at={4} size={70} col={bog ? C.ver : C.paper}>{rpm} RPM</Big>
    <Big x={600} y={560} at={a} size={60} col={bog ? C.ver : GRN} font={SANS}>{bog ? "BOG" : "START"}</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== island — el corte anti-isla: la red se va y el inversor solar abre su propio interruptor
export const Island: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.5); const off = f > a + 20; const open = k(f, a + 20, 8);
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <g transform="translate(200 260) skewX(-20)">{Array.from({ length: 6 }, (_, i) => <rect key={i} x={(i % 3) * 140} y={Math.floor(i / 3) * 110} width={130} height={100} fill="#1d3354" stroke="#8fb3e8" strokeWidth={4} />)}</g>
    <path d="M 560 480 L 820 480" stroke="#222" strokeWidth={8} /><rect x={820} y={420} width={160} height={120} rx={14} fill="#ececec" />
    <path d={`M 980 480 L 1100 480 L ${1100 + 80 * Math.cos(-open * 0.6)} ${480 + 80 * Math.sin(-open * 0.6)}`} stroke="#222" strokeWidth={8} fill="none" /><path d="M 1180 480 L 1500 480" stroke="#222" strokeWidth={8} />
    <line x1={1600} y1={200} x2={1600} y2={900} stroke="#6b4a2a" strokeWidth={24} /><line x1={1500} y1={480} x2={1600} y2={480} stroke="#222" strokeWidth={8} />
    <Dots d="M 560 480 L 1100 480" on={off ? 0 : 1} col="#ffe066" speed={6} /><Dots d="M 1180 480 L 1600 480" on={off ? 0 : 1} col="#ffe066" speed={6} />
    {off && <g stroke={C.ver} strokeWidth={10}><line x1={1560} y1={140} x2={1640} y2={220} /><line x1={1640} y1={140} x2={1560} y2={220} /></g>}
    <g opacity={k(f, b, 10)}><circle cx={1750} cy={560} r={40} fill="#ffd84a" /><rect x={1720} y={600} width={60} height={140} fill="#ff8a1a" /></g></svg>
    <Big x={900} y={640} at={4} size={40} font={SANS}>INVERTER</Big><Stamp text="SHUTS OFF ON PURPOSE" at={a + 22} x={900} y={180} />
    <Big x={1650} y={820} at={b} size={44} font={SANS} col={C.gold}>protects the lineman</Big>
  </Bg>;
};

// ==================== xray — la casa en rayos X: aparecen los galones escondidos (calefón, depósito del inodoro, caños)
export const XRay: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const sweep = interpolate(f, [0, Math.max(30, dur * 0.8)], [0, 1], CL); const sx = 200 + sweep * 1520; const a = M(m, 1, 40);
  return <AbsoluteFill style={{ background: "#061018" }}>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 200 500 L 960 160 L 1720 500 L 1720 960 L 200 960 Z" fill="none" stroke="#2a6a8a" strokeWidth={8} />
      <line x1={200} y1={720} x2={1720} y2={720} stroke="#2a6a8a" strokeWidth={6} />
      <path d="M 300 940 L 300 760 L 1600 760 L 1600 560 L 900 560" stroke="#5fe0ff" strokeWidth={10} fill="none" opacity={sx > 800 ? 1 : 0.15} />
      <rect x={360} y={780} width={130} height={170} rx={30} fill="#5fe0ff" opacity={sx > 420 ? 0.8 : 0.1} />
      <rect x={1420} y={560} width={110} height={70} rx={10} fill="#5fe0ff" opacity={sx > 1450 ? 0.8 : 0.1} />
      <rect x={sx - 6} y={140} width={12} height={840} fill="#9ff3ff" opacity={0.7} />
    </svg>
    <Big x={425} y={1010} at={a} size={44} font={SANS} col="#9ff3ff">WATER HEATER · 40–50 gal</Big>
    <Big x={1475} y={520} at={Math.round(dur * 0.75)} size={40} font={SANS} col="#9ff3ff">toilet tank · 2 gal</Big>
    <Big x={960} y={110} at={4} size={56} col="#9ff3ff">more than you think</Big>
  </AbsoluteFill>;
};

// ==================== elevator — el indicador de piso de ascensor: cada paso de la tarjeta enciende un número
const CARD_C = ["PUMP VOLTS · HP", "MAIN OFF", "INTERLOCK OVER", "GENERATOR OUTSIDE", "CORD INTO INLET", "GENERATOR BREAKER ON", "PUMP BREAKER ON", "WATCH THE GAUGE", "CLICK · PUMP OFF"];
export const Elevator: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const ats = CARD_C.map((_, i) => M(m, i, i ? 99999 : 0)); const cur = ats.reduce((acc, a, i) => (f >= a ? i : acc), 0);
  return <Bg dark>
    <div style={{ position: "absolute", left: 300, top: 160, width: 1320, height: 160, background: "#2a2416", borderRadius: 20, border: "8px solid #b8733a", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
      {CARD_C.map((_, i) => <div key={i} style={{ width: 100, height: 100, borderRadius: 50, border: "5px solid #b8733a", background: i === cur ? "#ffcf6a" : i < cur ? "#5a4a2a" : "#1a160c", color: i === cur ? "#1a160c" : "#b8733a", fontFamily: SANS, fontWeight: 800, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: i === cur ? "0 0 40px #ffcf6a" : "none" }}>{i}</div>)}</div>
    <div style={{ position: "absolute", left: 300, top: 420, width: 1320, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: C.paper, opacity: k(f, ats[cur], 8) }}>{CARD_C[cur]}</div>
    <div style={{ position: "absolute", left: 760, top: 640, width: 200, height: 360, background: "#9aa3ad", transform: `translateX(${-k(f, ats[cur], 10) * 0}px)` }} /><div style={{ position: "absolute", left: 960, top: 640, width: 200, height: 360, background: "#8a939d" }} />
  </Bg>;
};

// ==================== gascans — dos filas de bidones: 2 horas de generador contra 24
export const GasCans: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5);
  const can = (x: number, y: number, on: boolean, col: string) => <div style={{ position: "absolute", left: x, top: y, width: 90, height: 120, background: col, borderRadius: 10, opacity: on ? 1 : 0, transform: `scale(${on ? 1 : 0.6})` }}><div style={{ position: "absolute", right: -20, top: 6, width: 30, height: 14, background: "#222", transform: "rotate(-30deg)" }} /></div>;
  return <Bg>
    <Big x={340} y={320} at={4} size={50} font={SANS} anchor="l">2 HOURS A DAY</Big>
    {Array.from({ length: 3 }, (_, i) => <React.Fragment key={i}>{can(800 + i * 120, 260, f > 8 + i * 6, GRN)}</React.Fragment>)}
    <Big x={340} y={640} at={a} size={50} font={SANS} anchor="l" col={C.ver}>24 HOURS</Big>
    {Array.from({ length: 10 }, (_, i) => <React.Fragment key={i}>{can(800 + i * 100, 580, f > a + i * 3, C.ver)}</React.Fragment>)}
    <Big x={1280} y={460} at={10} size={44} font={SANS} col={C.gold}>1½–3 gal  vs  8–12 gal</Big>
  </Bg>;
};

// ==================== bingo — el cartón de bingo de los hábitos: cada hábito marca su casillero
export const Bingo: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["BUCKET FLUSH", "TANK LID OFF", "ONLY WHEN NEEDED", "DISHES IN A TUB", "PAPER PLATES", "JUG + BUCKET", "DRINK FROM JUGS", "FREE", "PUMP 2× A DAY"]; const at = (i: number) => (i === 0 ? M(m, 1, 30) : 30 + i * 12);
  return <Bg><div style={{ position: "absolute", left: 510, top: 90, width: 900, height: 900, background: C.paper, borderRadius: 16, boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
    {T.map((t, i) => { const on = f > at(i); return <div key={t} style={{ position: "absolute", left: 30 + (i % 3) * 290, top: 30 + Math.floor(i / 3) * 290, width: 260, height: 260, border: `5px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.ink, padding: 16 }}>{t}
      {on && <div style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, background: "rgba(198,42,34,.55)", transform: `scale(${Math.min(1, pop(f, at(i))) || 0.001})` }} />}</div>; })}</div>{dur > 0 && null}</Bg>;
};

// ==================== nesting — las mamushkas de tanques: el tanque grande se abre y adentro sólo un tercio es agua usable
export const Nesting: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const S = [20, 32, 44, 86]; const ats = S.map((_, i) => M(m, i + 1, 30 + i * 15)); ats[0] = Math.min(ats[0], 6); // AUDITOR 11-nov: sin arranque vacío (congelado 3,6 s)
  return <Bg>{S.map((g, i) => { const h = 260 + i * 140, w = 160 + i * 70, e = k(f, ats[i], 10); const x = 260 + i * 400;
    return <div key={g} style={{ position: "absolute", left: x, top: 960 - h, width: w, height: h, borderRadius: w / 2, background: "#2f5fa8", opacity: e, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: (h - 20) / 3 * io((f - ats[i] - 10) / 20), background: COLD, borderRadius: `0 0 ${w / 2}px ${w / 2}px`, opacity: 0.9 }} />
      <div style={{ position: "absolute", top: -60, width: w, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.paper }}>{g} gal</div></div>; })}
    <Stamp text="≈ ⅓ YOU CAN USE" at={Math.max(ats[3] + 30, dur - 50)} x={960} y={160} col={C.gold} />
  </Bg>;
};

// ==================== gauge — el manómetro gigante: la aguja cae al corte de arranque, hace clic y vuelve al corte de parada
export const Gauge: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 2, dur * 0.6); const psi = f < a ? 30 + 20 * io(f / Math.max(20, a)) : 50;
  const ang = Math.PI * (1.25 - (psi / 100) * 1.5);
  return <Bg>
    <div style={{ position: "absolute", left: 560, top: 140, width: 800, height: 800, borderRadius: 400, background: "radial-gradient(circle at 40% 30%,#fff,#d9d4c4)", border: "30px solid #9aa3ad", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {Array.from({ length: 11 }, (_, i) => { const an = Math.PI * (1.25 - (i / 10) * 1.5); return <g key={i}><line x1={960 + 300 * Math.cos(an)} y1={540 - 300 * Math.sin(an)} x2={960 + 340 * Math.cos(an)} y2={540 - 340 * Math.sin(an)} stroke={C.ink} strokeWidth={8} />
        <text x={960 + 250 * Math.cos(an)} y={555 - 250 * Math.sin(an)} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.ink}>{i * 10}</text></g>; })}
      {[[30, GRN, "CUT-IN"], [50, C.ver, "CUT-OUT"]].map(([v, c, t]) => { const an = Math.PI * (1.25 - ((v as number) / 100) * 1.5); return <g key={t as string}><line x1={960 + 340 * Math.cos(an)} y1={540 - 340 * Math.sin(an)} x2={960 + 380 * Math.cos(an)} y2={540 - 380 * Math.sin(an)} stroke={c as string} strokeWidth={16} /><text x={960 + 430 * Math.cos(an)} y={550 - 430 * Math.sin(an)} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={c as string}>{t}</text></g>; })}
      <line x1={960} y1={540} x2={960 + 280 * Math.cos(ang)} y2={540 - 280 * Math.sin(ang)} stroke={C.ver} strokeWidth={14} strokeLinecap="round" /><circle cx={960} cy={540} r={30} fill="#333" /></svg>
    <Big x={960} y={720} at={4} size={90} col={C.ink}>{Math.round(psi)} PSI</Big>
  </Bg>;
};

// ==================== pour — el balde se inclina desde la altura de la rodilla y el inodoro descarga
export const Pour: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 30); const tilt = io((f - a) / 16) * 70; const pouring = f > a + 12 && f < a + 70; const flush = k(f, a + 40, 14);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={1100} y={560} width={360} height={60} rx={20} fill="#f4f4f0" /><path d="M 1120 620 Q 1280 820 1440 620 Z" fill="#f4f4f0" /><rect x={1220} y={760} width={120} height={200} fill="#f4f4f0" />
      <ellipse cx={1280} cy={600} rx={150} ry={30} fill={`rgba(95,180,255,${0.6 - 0.4 * flush})`} />
      {flush > 0 && <path d={`M 1280 600 m -${100 * (1 - flush)} 0 a ${100 * (1 - flush)} 20 0 1 0 ${200 * (1 - flush)} 0`} stroke={COLD} strokeWidth={6} fill="none" transform={`rotate(${f * 12} 1280 600)`} />}
      <line x1={600} y1={700} x2={1000} y2={700} stroke="rgba(244,239,227,.5)" strokeWidth={4} strokeDasharray="20 14" />
      <g transform={`translate(760 520) rotate(${tilt} 120 120)`}><path d="M 20 0 L 220 0 L 200 240 L 40 240 Z" fill="#f2f2f2" stroke="#ccc" strokeWidth={6} /><rect x={24} y={20} width={192} height={120} fill={COLD} opacity={0.6} /></g>
      {pouring && <path d="M 1000 560 Q 1150 520 1260 600" stroke={COLD} strokeWidth={28} fill="none" opacity={0.85} />}
    </svg>
    <Big x={620} y={760} at={a} size={40} font={SANS} anchor="l">knee height</Big><Big x={960} y={140} at={4} size={64} col={C.gold}>2 gal · one steady pour</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== septic — la pendiente: la casa, el caño, la cámara séptica por gravedad; el poste de alarma si hay bomba
export const Septic: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5);
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 0 520 L 1920 760 L 1920 1080 L 0 1080 Z" fill="#3b2c20" /><path d="M 0 500 L 1920 740" stroke="#eef3f7" strokeWidth={24} />
    <rect x={160} y={300} width={300} height={220} fill="#3a2a22" /><path d="M 140 300 L 310 180 L 480 300 Z" fill="#5a3d26" />
    <path d="M 400 560 L 1200 700" stroke="#888" strokeWidth={24} /><rect x={1200} y={660} width={360} height={200} rx={30} fill="#5a6170" />
    <Dots d="M 400 560 L 1200 700" on={1} col="#a5835a" speed={4} w={10} />
    <g opacity={k(f, a, 10)}><line x1={1700} y1={560} x2={1700} y2={760} stroke="#888" strokeWidth={12} /><rect x={1660} y={500} width={80} height={70} rx={8} fill="#ddd" /><circle cx={1700} cy={535} r={16} fill={f % 20 < 10 ? C.ver : "#600"} /></g></svg>
    <Big x={800} y={520} at={a - 20} size={60} col={C.gold}>gravity · no power needed</Big>
    <Big x={1700} y={440} at={a} size={36} font={SANS}>alarm post = pump</Big>
  </Bg>;
};

// ==================== flowchart — el diagrama de flujo: luz de vuelta → 5 min → bomba → ¿sube la aguja? sí / no
export const FlowChart: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const B = [["POWER BACK · 5 MIN", 200, 160], ["PUMP BREAKER ON", 200, 380], ["RUN THE KITCHEN TAP", 200, 600], ["GAUGE CLIMBS?", 200, 820]];
  const ats = [M(m, 0, 10), M(m, 1, 80), M(m, 2, 140), M(m, 3, 200)];
  return <Bg>
    {B.map(([t, x, y], i) => <div key={t as string} style={{ position: "absolute", left: x as number, top: y as number, width: 620, height: 130, background: i === 3 ? C.gold : C.paper, borderRadius: i === 3 ? 0 : 20, transform: i === 3 ? "skewX(-12deg)" : "none", opacity: k(f, ats[i], 10), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.ink }}>{t}</div>)}
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 505, top: 290 + i * 220, width: 10, height: 90 * k(f, ats[i + 1], 8), background: C.paper }} />)}
    <div style={{ position: "absolute", left: 1000, top: 760, opacity: k(f, ats[3] + 20, 10), fontFamily: SANS, fontWeight: 800, fontSize: 50, color: GRN }}>YES → you're good</div>
    <div style={{ position: "absolute", left: 1000, top: 880, opacity: k(f, ats[3] + 40, 10), fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.ver }}>NO → breaker off · call the well man</div>{dur > 0 && null}
  </Bg>;
};

// ==================== scroll — el pergamino del repaso: se desenrolla con las líneas que importan
export const Scroll: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const L = ["120 V or 240 V", "single or double breaker", "surge = 3–5 × running", "240 V station or generator outside", "inlet + interlock / transfer switch"]; const u = io(f / Math.max(20, dur * 0.6));
  return <Bg>
    <div style={{ position: "absolute", left: 460, top: 120, width: 1000, height: 60 + u * 760, background: "#efe2bf", boxShadow: "0 20px 50px rgba(0,0,0,.5)", overflow: "hidden" }}>
      {L.map((t, i) => <Hand key={t} text={`${i + 1}. ${t}`} at={10 + i * 14} len={12} size={58} style={{ position: "absolute", left: 60, top: 60 + i * 140 }} />)}</div>
    <div style={{ position: "absolute", left: 430, top: 90, width: 1060, height: 60, borderRadius: 30, background: "#8b6a3f" }} />
    <div style={{ position: "absolute", left: 430, top: 150 + u * 760, width: 1060, height: 60, borderRadius: 30, background: "#8b6a3f" }} />
  </Bg>;
};

// ==================== barricade — tres vallas rayadas caen frente a los tres «nunca»
export const Barricade: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const T = ["DRYER OUTLET", "TWO-MALE CORD", "GENERATOR IN THE GARAGE"]; const ats = T.map((_, i) => M(m, i, 10 + i * 70));
  return <Bg>{T.map((t, i) => { const e = Math.min(1, pop(f, ats[i])) || 0;
    return <div key={t} style={{ position: "absolute", left: 130 + i * 580, top: 300 }}>
      <div style={{ width: 520, height: 120, background: "repeating-linear-gradient(45deg,#ff6a1a 0 40px,#fff 40px 80px)", transform: `translateY(${(1 - e) * -500}px)`, opacity: f > ats[i] ? 1 : 0, borderRadius: 8 }} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 50px", opacity: f > ats[i] ? 1 : 0 }}><div style={{ width: 20, height: 300, background: "#ddd" }} /><div style={{ width: 20, height: 300, background: "#ddd" }} /></div>
      <div style={{ marginTop: 20, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: C.paper, opacity: k(f, ats[i] + 6, 8) }}>NEVER<br />{t}</div></div>; })}</Bg>;
};

// ==================== keyring — el llavero: tres llaves legales; cada una entra en su cerradura, gira y la cerradura se pone verde
export const KeyRing: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["INLET + INTERLOCK", "SMALL TRANSFER SWITCH", "PUMP TRANSFER SWITCH"]; const ats = T.map((_, i) => M(m, i + 1, i === 2 ? dur - 30 : 30 + i * 70));
  const swing = Math.sin(f / 14) * 4;
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <circle cx={300} cy={540} r={110} fill="none" stroke="#c9c9c9" strokeWidth={18} transform={`rotate(${swing} 300 400)`} />
      {T.map((t, i) => { const y = 260 + i * 280; const go = io((f - ats[i]) / 14); const turn = io((f - ats[i] - 14) / 10); const lit = f > ats[i] + 24;
        return <g key={t} opacity={f > ats[i] - 8 ? 1 : 0.25}>
          <g transform={`translate(${400 + go * 560} ${y}) rotate(${turn * 90} 0 0)`}>
            <circle cx={0} cy={0} r={46} fill="#d9b23a" /><circle cx={0} cy={0} r={18} fill="#0f1b30" />
            <rect x={40} y={-14} width={240} height={28} fill="#d9b23a" />{[0, 1, 2, 3].map((j) => <rect key={j} x={160 + j * 30} y={14} width={18} height={14 + (j % 2) * 12} fill="#d9b23a" />)}</g>
          <rect x={1000} y={y - 90} width={200} height={180} rx={30} fill={lit ? GRN : "#5d6a7a"} /><rect x={1080} y={y - 24} width={40} height={48} rx={8} fill="#0f1b30" />
          <text x={1260} y={y + 14} fontFamily={SANS} fontWeight={800} fontSize={44} fill={lit ? C.paper : "#8a96a6"}>{t}</text></g>; })}
    </svg>
    <Stamp text="PERMIT" at={Math.max(30, dur - 26)} x={1600} y={120} col={GRN} />
  </Bg>;
};

// ==================== meterback — el medidor de la casa gira AL REVÉS: la flecha sale de la casa hacia la calle y el número de voltios del poste trepa
export const MeterBack: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20), b = M(m, 1, 120), c = M(m, 2, dur * 0.8);
  const spin = f > a ? -(f - a) * 9 : 0; const v = Math.round(240 + 6960 * io((f - b) / 30));
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 200, width: 520, height: 680, borderRadius: "260px 260px 30px 30px", background: "radial-gradient(circle at 40% 30%, rgba(255,255,255,.55), rgba(180,200,220,.25))", border: "14px solid #8b939c" }}>
      <div style={{ position: "absolute", left: 80, top: 120, width: 360, height: 120, background: "#f2efe6", borderRadius: 12, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[0, 1, 2, 3, 4].map((i) => <svg key={i} width={60} height={60}><circle cx={30} cy={30} r={26} fill="#fff" stroke="#333" strokeWidth={3} /><line x1={30} y1={30} x2={30 + 20 * Math.cos((spin / (i + 1)) * 0.0174 * (i % 2 ? -1 : 1))} y2={30 + 20 * Math.sin((spin / (i + 1)) * 0.0174 * (i % 2 ? -1 : 1))} stroke={C.ver} strokeWidth={4} /></svg>)}</div>
      <div style={{ position: "absolute", left: 60, top: 330, width: 400, height: 30, borderRadius: 15, background: "#222", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: ((spin * -2) % 400 + 400) % 400 * -1 + 400 - 60, width: 60, height: 30, background: "#111", borderLeft: "8px solid " + C.ver }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ver, opacity: k(f, a, 8) }}>◀◀ BACKWARD</div></div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><Dots d="M 880 540 L 1300 540 L 1500 300" on={k(f, a, 8)} col={C.ver} speed={10} w={14} />
      <line x1={1500} y1={160} x2={1500} y2={980} stroke="#6b4a2a" strokeWidth={26} /></svg>
    <Big x={1500} y={110} at={b} size={96} col={C.ver}>{v.toLocaleString("en-US")} V</Big>
    <Big x={1500} y={1010} at={c} size={46} font={SANS} col={C.gold}>a lineman thinks it’s dead</Big>
  </Bg>;
};

// ==================== seismo — el sismógrafo: la pluma de arriba dibuja la luz de la red (curva lisa); la de abajo la del inversor barato (dientes) y el motor se calienta
export const Seismo: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const heat = cl(f / Math.max(20, dur)); const W = 1500; const px = 210 + Math.min(W, f * 14);
  let a = "", b = ""; for (let x = 0; x <= Math.min(W, f * 14); x += 6) { const t = x / 60; a += `${x ? "L" : "M"} ${210 + x} ${330 + 70 * Math.sin(t)} `; b += `${x ? "L" : "M"} ${210 + x} ${740 + (Math.sin(t) > 0.35 ? -70 : Math.sin(t) < -0.35 ? 70 : 0)} `; }
  return <Bg>
    <div style={{ position: "absolute", left: 160, top: 180, width: 1600, height: 760, background: "repeating-linear-gradient(90deg, #f6f1e4 0 58px, #e6dcc4 58px 60px)", boxShadow: "0 30px 70px rgba(0,0,0,.5)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={a} stroke={CARBON} strokeWidth={6} fill="none" /><path d={b} stroke={C.ver} strokeWidth={6} fill="none" />
      <line x1={px} y1={330 + 70 * Math.sin((px - 210) / 60)} x2={px + 120} y2={200} stroke="#444" strokeWidth={6} />
      <line x1={px} y1={740} x2={px + 120} y2={610} stroke="#444" strokeWidth={6} /></svg>
    <Big x={210} y={230} at={4} size={40} font={SANS} anchor="l" col={C.ink}>GRID · PURE SINE</Big>
    <Big x={210} y={880} at={4} size={40} font={SANS} anchor="l" col={C.ver}>CHEAP INVERTER</Big>
    <div style={{ position: "absolute", right: 200, top: 820, width: 160, height: 90, borderRadius: 18, background: `rgb(${Math.round(160 + 95 * heat)},${Math.round(160 - 100 * heat)},80)`, boxShadow: `0 0 ${40 * heat}px ${HOT}`, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>MOTOR {Math.round(100 + 80 * heat)}°F</div>
  </Bg>;
};

// ---------- overlays de una sola vez (sobre material real)
export const TapeLabel: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const w = io((f - 4) / 14);
  return <div style={{ position: "absolute", left: 140, bottom: 160, opacity: o, transform: "rotate(-3deg)" }}>
    <div style={{ background: "#efe7c8", padding: "18px 40px", clipPath: `inset(0 ${100 - w * 100}% 0 0)`, boxShadow: "0 8px 18px rgba(0,0,0,.4)", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#1b1b1b", whiteSpace: "nowrap" }}>{text}</div></div>;
};
export const PsiDial: React.FC<{ dur: number; a: number; b: number }> = ({ dur, a, b }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const v = a + (b - a) * io((f - 6) / Math.max(20, dur - 30)); const an = Math.PI * (1.25 - (v / 100) * 1.5);
  return <div style={{ position: "absolute", right: 140, top: 140, opacity: o }}><svg width={300} height={300}><circle cx={150} cy={150} r={130} fill="rgba(244,239,227,.92)" stroke="#9aa3ad" strokeWidth={14} />
    <line x1={150} y1={150} x2={150 + 105 * Math.cos(an)} y2={150 - 105 * Math.sin(an)} stroke={C.ver} strokeWidth={8} strokeLinecap="round" /><circle cx={150} cy={150} r={14} fill="#333" />
    <text x={150} y={230} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={C.ink}>{Math.round(v)} PSI</text></svg></div>;
};
export const JugCount: React.FC<{ dur: number; n: number; label: string }> = ({ dur, n, label }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", left: 140, top: 150, opacity: o, display: "flex", gap: 16, alignItems: "flex-end" }}>
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ width: 70, height: 110, borderRadius: "18px 18px 10px 10px", background: "rgba(140,200,255,.85)", border: "4px solid #2f5fa8", transform: `scale(${Math.min(1, pop(f, 6 + i * 6)) || 0.001})` }} />)}
    <div style={{ marginLeft: 20, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.paper, textShadow: "0 3px 12px #000" }}>{label}</div></div>;
};

// ---------- despacho de los planos C
export const CompC: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const c: string = s.comp, m: number[] = s.m || [];
  if (c.startsWith("cut:")) return <WellCut act={c.slice(4)} m={m} dur={dur} />;
  if (c.startsWith("stairs:step")) return <Stairs n={Number(c.slice(11))} m={m} dur={dur} />;
  if (c.startsWith("cone:")) return <Cone n={Number(c.slice(5))} m={m} dur={dur} />;
  const T: Record<string, React.FC<P>> = { faucetcough: FaucetCough, gearchain: GearChain, combolock: ComboLock, flashlight: Flashlight, liftoff: LiftOff, lockers: Lockers, beaker: Beaker, flywheel: Flywheel, sliderule: SlideRule, scratch: Scratch, keyring: KeyRing, sleeve: Sleeve, meterback: MeterBack, scissors: Scissors, hoist: Hoist, seismo: Seismo, contacts: Contacts, signpost: Signpost, ramp: Ramp, freezebat: FreezeBat, register: Register, rungs: Rungs, roadmap: RoadMap, dimmer: Dimmer, island: Island, xray: XRay, elevator: Elevator, gascans: GasCans, bingo: Bingo, nesting: Nesting, gauge: Gauge, pour: Pour, septic: Septic, flowchart: FlowChart, scroll: Scroll, barricade: Barricade };
  const X = T[c]; return X ? <X m={m} dur={dur} /> : null;
};
