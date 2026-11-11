// gary11d · componentes propios (la placa de la caldera y el regreso de la luz). Mismo look de la serie: hoja de trabajo crema, tinta carbónica, sello rojo,
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
const Sheet: React.FC<{ title: string; no?: string; children?: React.ReactNode; tilt?: number }> = ({ title, no = "11D", children, tilt = -1 }) => {
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


// ==================== cutaway — LA CALDERA ABIERTA Y PARTIDA AL MEDIO (vuelve 12 veces, cada vez con una acción nueva)
// abajo el soplador, arriba el intercambiador, al costado el inductor y el caño de ventilación, quemadores + encendedor, la placa en el panel lateral; arriba a la izquierda el interruptor de servicio
export const FurnaceCut: React.FC<P & { act: string }> = ({ act, m, dur }) => {
  const f = useCurrentFrame(); const a = (i: number, d: number) => M(m, i, d);
  const X = 560, Y = 170, W = 640, H = 820; // gabinete
  // estado
  let pw = 1, ind = 0, ign = 0, gas = 0, blow = 0, led = "g", arc = 0, bolt = 0, snow = 0, jumper = 0, co = 0, water = 0.15, stat = 0, swOff = 0, ring: number[] = [], dark = 0;
  const seq = (t0: number, step: number) => { const t = f - t0; ind = t > 0 ? 1 : 0; ign = t > step * 2 ? 1 : 0; gas = t > step * 3 ? 1 : 0; blow = t > step * 4 ? 1 : 0; };
  if (act === "parts") { pw = 0.4; }
  if (act === "sequence") { const s = Math.max(20, (dur - 30) / 5); seq(a(0, 10), s); ind = f > a(0, 10) ? 1 : 0; ign = f > a(2, s * 2) ? 1 : 0; gas = f > a(3, s * 3) ? 1 : 0; blow = f > a(4, s * 4) ? 1 : 0; }
  if (act === "flicker") { pw = Math.floor(f / 11) % 3 === 1 ? 0 : 1; seq(Math.floor(f / 33) * 33, 6); if (!pw) { ind = ign = gas = blow = 0; } arc = f > a(1, 60) && Math.floor(f / 11) % 3 === 2 ? 1 : 0; dark = pw ? 0 : 0.5; }
  if (act === "spike") { bolt = k(f, a(0, 10), 6); led = f > a(1, 50) ? "r" : "g"; }
  if (act === "switchoff") { swOff = k(f, a(0, 10), 6); pw = 1 - swOff; dark = 0.55 * swOff; }
  if (act === "listen") { const s = Math.max(20, dur / 5); ind = f > a(0, 6) ? 1 : 0; ign = f > a(2, s) ? 1 : 0; gas = f > a(3, s * 2) ? 1 : 0; blow = f > a(4, s * 3.5) ? 1 : 0; ring = [ind ? a(0, 6) : -1, ign ? a(2, s) : -1, gas ? a(3, s * 2) : -1, blow ? a(4, s * 3.5) : -1]; }
  if (act === "vents" || act === "drift") { ind = 1; gas = act === "drift" ? 1 : 0; snow = io((f - a(0, 10)) / 40); if (f > a(1, dur * 0.6)) { gas = 0; ind = 0; led = "r"; } }
  if (act === "jumper") { jumper = k(f, a(1, dur * 0.5), 10); co = io((f - a(1, dur * 0.5) - 20) / 50); gas = 1; ind = 0; }
  if (act === "standby") { pw = 1; led = "g"; }
  if (act === "thermostat") { stat = 1; const cyc = Math.floor(f / 45); pw = f % 45 < 8 ? 0 : 1; seq(cyc * 45 + 8, 8); if (!pw) ind = ign = gas = blow = 0; }
  if (act === "condensate") { gas = 1; ind = 1; blow = 1; water = 0.15 + 0.7 * io((f - a(2, 60)) / Math.max(30, dur - a(2, 60))); }
  const lab = (txt: string, at: number, x: number, y: number, tx: number, ty: number, col = LINE) => { const e = k(f, at, 10); if (e <= 0) return null;
    return <g key={txt} opacity={e}><line x1={x} y1={y} x2={x + (tx - x) * e} y2={y + (ty - y) * e} stroke={col} strokeWidth={3} /><circle cx={x} cy={y} r={7} fill={col} />
      <text x={tx + (tx > x ? 14 : -14)} y={ty + 12} textAnchor={tx > x ? "start" : "end"} fontFamily={SANS} fontWeight={800} fontSize={32} fill={col} letterSpacing={2}>{txt}</text></g>; };
  const BX = X + 460, BY = Y + 330; // placa
  const L: Record<string, [string, number, number, number, number, number, string?][]> = {
    parts: [["BLOWER", a(1, 60), X + 300, Y + 690, X - 60, Y + 700], ["HEAT EXCHANGER", a(2, 140), X + 300, Y + 200, X - 60, Y + 150], ["INDUCER", a(3, dur * 0.7), X + W - 40, Y + 120, X + W + 160, Y + 60], ["IGNITER", a(4, dur * 0.8), X + 380, Y + 420, X - 60, Y + 430], ["CONTROL BOARD", a(5, dur * 0.85), BX + 60, BY + 60, X + W + 160, BY + 120, C.gold]],
    sequence: [["1 INDUCER", a(0, 10), X + W - 40, Y + 120, X + W + 160, Y + 60], ["2 PRESSURE SWITCH", a(1, 50), X + W + 30, Y + 220, X + W + 160, Y + 200], ["3 IGNITER", a(2, 90), X + 380, Y + 420, X - 60, Y + 430], ["4 GAS · FLAME SENSOR", a(3, 130), X + 300, Y + 470, X - 60, Y + 520]],
    flicker: [["RELAY CONTACTS ARC", a(1, 60), BX + 80, BY + 80, X + W + 160, BY + 40, C.ver], ["TRANSFORMER", a(2, 110), BX + 40, BY + 160, X + W + 160, BY + 200, C.ver], ["IGNITER · HOT / COLD", a(3, 160), X + 380, Y + 420, X - 60, Y + 430, C.ver]],
    spike: [["SPIKE", a(0, 10), BX + 40, BY + 160, X + W + 160, BY + 200, C.ver]],
    switchoff: [["SERVICE SWITCH · OFF", a(0, 10), 330, 260, 120, 420, GRN], ["DEAD · SAFE", a(1, dur * 0.5), BX + 80, BY + 80, X + W + 160, BY + 40, GRN]],
    listen: [["hmmm", a(0, 6), X + W - 40, Y + 120, X + W + 160, Y + 60], ["click", a(1, 40), BX + 80, BY + 80, X + W + 160, BY + 40], ["glow", a(2, 70), X + 380, Y + 420, X - 60, Y + 430, HOT], ["whoosh", a(3, 110), X + 300, Y + 470, X - 60, Y + 520, COLD], ["blower", a(4, 200), X + 300, Y + 690, X - 60, Y + 700]],
    vents: [["INTAKE", 10, X + W + 260, Y + 60, X + W + 380, Y + 10], ["EXHAUST", 10, X + W + 260, Y + 160, X + W + 380, Y + 220], ["PRESSURE SWITCH · BLOCKED", a(1, dur * 0.6), X + W + 30, Y + 220, X + W + 160, Y + 330, C.ver]],
    drift: [["INTAKE BLOCKED", a(0, 10), X + W + 260, Y + 60, X + W + 380, Y + 10, C.ver], ["LOCKED OUT", a(2, dur * 0.7), BX + 80, BY + 80, X + W + 160, BY + 40, C.ver]],
    jumper: [["PRESSURE SWITCH", a(0, 20), X + W + 30, Y + 220, X + W + 160, Y + 200], ["LIMIT SWITCH", a(0, 40), X + 200, Y + 300, X - 60, Y + 300], ["A WIRE ACROSS IT", a(1, dur * 0.5), X + W + 30, Y + 240, X + W + 160, Y + 290, C.ver]],
    standby: [["BOARD · POWERED", a(0, 10), BX + 80, BY + 80, X + W + 160, BY + 40, C.gold], ["TRANSFORMER · POWERED", a(0, 40), BX + 40, BY + 160, X + W + 160, BY + 200, C.gold], ["SURGE → BOARD", a(2, dur * 0.7), BX + 40, BY + 160, X + W + 160, BY + 280, C.ver]],
    thermostat: [["REBOOT", 8, 260, 640, 120, 760], ["CALL FOR HEAT", a(1, 120), 260, 640, 120, 820, C.gold]],
    condensate: [["CONDENSATE PUMP", a(2, 60), X + W + 200, Y + 760, X + W + 360, Y + 700], ["≈ 1 GAL / DAY", a(2, 90), X + W + 200, Y + 800, X + W + 360, Y + 790, COLD], ["NEEDS POWER", a(3, dur * 0.8), X + W + 200, Y + 760, X + W + 360, Y + 880, C.ver]],
  };
  const spin = blow ? f * 0.6 : 0, fan = ind ? f * 1.1 : 0;
  const ledOn = led === "r" ? (f % 20 < 10) : (f % 40 < 30);
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <defs><pattern id="g4" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(207,224,255,.07)" strokeWidth={2} /></pattern></defs>
      <rect width={1920} height={1080} fill="url(#g4)" />
      {/* interruptor de servicio en la viga */}
      <rect x={280} y={210} width={100} height={110} rx={10} fill={C.ver} stroke={LINE} strokeWidth={3} /><rect x={318} y={232} width={24} height={66} rx={6} fill="#ddd" />
      <rect x={322} y={swOff ? 268 : 236} width={16} height={26} rx={4} fill="#333" />
      <path d={`M 380 265 L 470 265 L 470 ${Y + 40} L ${BX + 60} ${Y + 40} L ${BX + 60} ${BY}`} fill="none" stroke="#222" strokeWidth={8} />
      <Dots d={`M 380 265 L 470 265 L 470 ${Y + 40} L ${BX + 60} ${Y + 40} L ${BX + 60} ${BY}`} on={pw * (act === "parts" ? 0 : 1)} col="#ffe066" speed={5} />
      {/* gabinete */}
      <rect x={X} y={Y} width={W} height={H} fill="#1b2638" stroke={LINE} strokeWidth={4} />
      {/* intercambiador */}
      {[0, 1, 2].map((i) => <path key={i} d={`M ${X + 120 + i * 140} ${Y + 420} L ${X + 120 + i * 140} ${Y + 120} Q ${X + 170 + i * 140} ${Y + 70} ${X + 220 + i * 140} ${Y + 120} L ${X + 220 + i * 140} ${Y + 420}`} fill={gas ? "rgba(255,140,60,.25)" : "rgba(160,170,190,.18)"} stroke="#9aa3ad" strokeWidth={4} />)}
      {/* quemadores + llamas */}
      <rect x={X + 100} y={Y + 450} width={420} height={30} fill="#555" />
      {gas > 0 && [0, 1, 2].map((i) => <path key={i} d={`M ${X + 150 + i * 140} ${Y + 450} q 20 ${-50 - 10 * Math.sin(f / 3 + i)} 40 0 Z`} fill={COLD} opacity={0.9} />)}
      {/* encendedor */}
      <rect x={X + 360} y={Y + 405} width={40} height={14} rx={4} fill={ign && !gas ? HOT : ign ? "#ffb07a" : "#9aa3ad"} style={{ filter: ign && !gas ? `drop-shadow(0 0 14px ${HOT})` : "none" }} />
      {/* soplador */}
      <circle cx={X + 300} cy={Y + 690} r={110} fill="#2c3a52" stroke="#9aa3ad" strokeWidth={4} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={X + 300} y1={Y + 690} x2={X + 300 + 95 * Math.cos(i * 0.628 + spin)} y2={Y + 690 + 95 * Math.sin(i * 0.628 + spin)} stroke="#9aa3ad" strokeWidth={6} />)}
      {blow > 0 && <Dots d={`M ${X + 300} ${Y + 560} L ${X + 300} ${Y - 40}`} on={1} col="#ffcf8a" speed={6} w={12} />}
      {/* inductor + caño */}
      <circle cx={X + W - 40} cy={Y + 120} r={46} fill="#2c3a52" stroke="#9aa3ad" strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={X + W - 40} y1={Y + 120} x2={X + W - 40 + 38 * Math.cos(i * 1.57 + fan)} y2={Y + 120 + 38 * Math.sin(i * 1.57 + fan)} stroke="#9aa3ad" strokeWidth={6} />)}
      <path d={`M ${X + W + 6} ${Y + 120} L ${X + W + 260} ${Y + 120}`} stroke="#e8e8e8" strokeWidth={34} /><path d={`M ${X + W + 6} ${Y + 60} L ${X + W + 260} ${Y + 60}`} stroke="#e8e8e8" strokeWidth={34} opacity={act === "vents" || act === "drift" ? 1 : 0.0} />
      {ind > 0 && <Dots d={`M ${X + W} ${Y + 120} L ${X + W + 260} ${Y + 120}`} on={snow > 0.8 ? 0 : 1} col="#c9c9c9" speed={6} />}
      <rect x={X + W + 240} y={Y - 20} width={140} height={240} fill="#eef3f7" opacity={snow * 0.95} rx={40} />
      {/* presostato */}
      <rect x={X + W + 10} y={Y + 200} width={46} height={46} rx={23} fill={act === "jumper" ? "#c9c9c9" : "#8a8f96"} stroke={LINE} strokeWidth={2} />
      {jumper > 0 && <path d={`M ${X + W + 10} ${Y + 223} C ${X + W - 30} ${Y + 300}, ${X + W + 100} ${Y + 300}, ${X + W + 56} ${Y + 223}`} stroke={C.ver} strokeWidth={6} fill="none" strokeDasharray={`${jumper * 200} 300`} />}
      {co > 0 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={X + 300 + Math.sin(i * 2 + f / 20) * 200} cy={Y + 300 - co * 200 - i * 20} r={50 + i * 10} fill="rgba(140,140,140,.3)" opacity={co} />)}
      {/* placa de control */}
      <rect x={BX} y={BY} width={160} height={220} rx={8} fill="#1f6b3a" stroke={LINE} strokeWidth={3} />
      {[0, 1, 2].map((i) => <rect key={i} x={BX + 20 + i * 44} y={BY + 50} width={32} height={40} fill="#111" />)}
      <rect x={BX + 30} y={BY + 130} width={70} height={50} fill="#b87333" />
      <circle cx={BX + 130} cy={BY + 190} r={10} fill={pw && ledOn ? (led === "r" ? C.ver : GRN) : "#333"} style={{ filter: pw && ledOn ? `drop-shadow(0 0 10px ${led === "r" ? C.ver : GRN})` : "none" }} />
      {arc > 0 && [0, 1, 2].map((i) => <path key={i} d={`M ${BX + 36 + i * 44} ${BY + 46} l 8 -18 l -6 0 l 10 -20`} stroke="#fff6a0" strokeWidth={4} fill="none" style={{ filter: "drop-shadow(0 0 8px #ffe066)" }} />)}
      {bolt > 0 && <path d={`M 1880 0 L 1700 220 L 1760 230 L 1560 ${BY + 40} L 1620 ${BY + 40} L ${BX + 160} ${BY + 160}`} stroke="#fff6a0" strokeWidth={10 * bolt} fill="none" style={{ filter: "drop-shadow(0 0 20px #ffe066)" }} />}
      {/* bomba de condensado */}
      {act === "condensate" && <g><rect x={X + W + 120} y={Y + 720} width={160} height={110} rx={10} fill="none" stroke={LINE} strokeWidth={4} /><rect x={X + W + 124} y={Y + 830 - 106 * water} width={152} height={106 * water} fill={COLD} opacity={0.7} />
        <rect x={X + W + 190} y={Y + 826 - 106 * water - 20} width={20} height={20} fill="#fff" /><path d={`M ${X + W} ${Y + 600} L ${X + W + 160} ${Y + 600} L ${X + W + 160} ${Y + 720}`} stroke={COLD} strokeWidth={6} fill="none" /><Dots d={`M ${X + W} ${Y + 600} L ${X + W + 160} ${Y + 600} L ${X + W + 160} ${Y + 720}`} on={1} col={COLD} speed={3} /></g>}
      {/* termostato */}
      {stat > 0 && <g><rect x={170} y={560} width={180} height={150} rx={20} fill="#f2f2f2" /><rect x={190} y={580} width={140} height={80} rx={8} fill={pw ? "#1b3a5a" : "#111"} />
        <text x={260} y={632} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={pw ? "#9ff3ff" : "#111"}>{pw ? (f % 45 < 20 ? "…" : "HEAT") : ""}</text>
        <path d={`M 350 635 L ${X} 635`} stroke="#222" strokeWidth={5} /><Dots d={`M 350 635 L ${X} 635`} on={pw} col={C.gold} speed={6} /></g>}
      {ring.map((r, i) => r >= 0 && f >= r ? <circle key={i} cx={[X + W - 40, X + 380, X + 300, X + 300][i]} cy={[Y + 120, Y + 410, Y + 460, Y + 690][i]} r={30 + ((f - r) % 30) * 3} fill="none" stroke={C.paper} strokeWidth={3} opacity={1 - ((f - r) % 30) / 30} /> : null)}
      {(L[act] || []).map(([t, at, x, y, tx, ty, col]) => lab(t, at, x, y, tx, ty, col))}
    </svg>
    <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})`, pointerEvents: "none" }} />
    {act === "spike" && <Stamp text="TOO MUCH" at={M(m, 1, 60)} x={1500} y={130} />}
    {act === "jumper" && <Stamp text="NEVER" at={Math.max(20, dur - 50)} x={1500} y={130} />}
    {act === "switchoff" && <Stamp text="SAFE" at={M(m, 1, 80)} x={1500} y={130} col={GRN} />}
  </Bg>;
};

// ==================== metro — el mapa de subte del procedimiento: 8 estaciones, el tren avanza a la de este paso
const STEPS_D = ["Find the switch today", "Power out · flip it off", "Unplug the sensitive things", "Lamp on · wait five", "Switch on · listen", "No start · count blinks", "Plug back · one at a time", "Card on the furnace"];
export const Metro: React.FC<P & { n: number }> = ({ n }) => {
  const f = useCurrentFrame(); const xs = STEPS_D.map((_, i) => 180 + i * 222); const e = io((f - 4) / 18); const tx = xs[Math.max(0, n - 2)] + (xs[n - 1] - xs[Math.max(0, n - 2)]) * e;
  return <Bg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.gold, letterSpacing: 8 }}>THE FURNACE LINE · STEP {n} OF 8</div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={`M 150 560 L 1740 560`} stroke="#c62a22" strokeWidth={26} strokeLinecap="round" />
      {xs.map((x, i) => <g key={i}><circle cx={x} cy={560} r={i === n - 1 ? 34 : 24} fill={i < n ? C.paper : "#6b5844"} stroke="#c62a22" strokeWidth={10} />
        <text x={x} y={i % 2 ? 660 : 490} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill={i === n - 1 ? C.paper : "rgba(244,239,227,.45)"}>{i + 1}</text></g>)}
      <g transform={`translate(${tx - 60} 515)`}><rect width={120} height={40} rx={14} fill={C.gold} /><rect x={14} y={8} width={24} height={16} fill="#2b2117" /><rect x={48} y={8} width={24} height={16} fill="#2b2117" /><rect x={82} y={8} width={24} height={16} fill="#2b2117" /></g>
    </svg>
    <Hand text={STEPS_D[n - 1]} at={14} len={16} size={92} col={C.paper} style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center" }} />
  </Bg>;
};

// ==================== wanted — el cartel de SE BUSCA: cada error es un "forajido" clavado en la pared con su recompensa
const MIST_D: Record<number, [string, string]> = { 2: ["THE CHEAP INVERTER", "modified sine"], 3: ["THE SUICIDE CORD", "two male ends"], 4: ["SNOW ON THE VENTS", "blocked intake"], 5: ["THE JUMPER WIRE", "safety switch bypassed"] };
export const Wanted: React.FC<P & { n: number }> = ({ n }) => {
  const f = useCurrentFrame(); const s = Math.min(1.05, pop(f, 2)) || 0.001; const [t, sub] = MIST_D[n] || ["", ""];
  return <Bg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "repeating-linear-gradient(90deg,#5a3d26 0 120px,#4e3420 120px 124px)" }} />
    <div style={{ position: "absolute", left: 610, top: 90, width: 700, height: 900, background: "#ead9b0", transform: `scale(${s}) rotate(${-2 + n}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,.6)", textAlign: "center" }}>
      <div style={{ position: "absolute", left: 335, top: 18, width: 30, height: 30, borderRadius: 15, background: "#888" }} />
      <div style={{ marginTop: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: "#3a2412", letterSpacing: 8 }}>WANTED</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#3a2412", letterSpacing: 4 }}>FOR KILLING FURNACES</div>
      <div style={{ margin: "40px auto", width: 420, height: 300, border: "6px solid #3a2412", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: C.ver }}>{n}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: "#3a2412" }}>{t}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: C.ver, marginTop: 10, opacity: k(f, 18, 8) }}>{sub}</div></div>
  </Bg>;
};

// ==================== thermal — la cámara térmica: la placa en falso color, un punto blanco al lado del relé y la mira marca 400°F
export const Thermal: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 6); const t = Math.round(90 + 310 * io((f - a) / 30));
  return <AbsoluteFill style={{ background: "#05030a" }}>
    <div style={{ position: "absolute", left: 360, top: 160, width: 1200, height: 760, borderRadius: 30, background: "radial-gradient(circle at 62% 46%, #fff 0 3%, #ffe24a 6%, #ff7a1a 12%, #c2185b 22%, #4a148c 40%, #1a0a4a 70%)", opacity: 0.95 }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1000 + i * 90, top: 450, width: 60, height: 80, border: "3px solid rgba(255,255,255,.4)" }} />)}
    <div style={{ position: "absolute", left: 1056, top: 450, width: 120, height: 120, border: "4px solid #fff", borderRadius: 60, transform: `translate(-50%,-50%) scale(${1 + 0.1 * Math.sin(f / 4)})` }} />
    <div style={{ position: "absolute", left: 1150, top: 330, fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 70, color: "#fff" }}>{t}°F</div>
    <div style={{ position: "absolute", left: 380, top: 180, fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 30, color: "#fff", opacity: 0.8 }}>● REC  IR</div>
    <div style={{ position: "absolute", right: 380, top: 200, width: 30, height: 680, background: "linear-gradient(0deg,#1a0a4a,#c2185b,#ff7a1a,#ffe24a,#fff)" }} />{dur > 0 && null}
  </AbsoluteFill>;
};

// ==================== coldcal — el almanaque de pared: el marcador tacha dos días en rojo y una nota pegada dice $480
export const ColdCal: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.6);
  return <Bg><div style={{ position: "absolute", left: 420, top: 100, width: 1080, height: 880, background: C.paper, boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
    <div style={{ height: 130, background: C.ink, color: C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: 80, textAlign: "center", lineHeight: "130px" }}>JANUARY</div>
    {Array.from({ length: 35 }, (_, i) => { const d = i - 2; const x = (d === 14 && f > b) || (d === 15 && f > b + 14);
      return <div key={i} style={{ position: "absolute", left: 20 + (i % 7) * 148, top: 150 + Math.floor(i / 7) * 140, width: 140, height: 132, border: "2px solid #c9bfa6", fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.ink, padding: 8 }}>{d > 0 && d < 32 ? d : ""}
        {x && <svg width={140} height={132} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 20 20 L 120 112 M 120 20 L 20 112" stroke={C.ver} strokeWidth={12} strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 - 300 * cl((f - (d === 14 ? b : b + 14)) / 8)} /></svg>}</div>; })}
    <div style={{ position: "absolute", left: 740, top: 560, width: 300, height: 260, background: "#ffe98a", transform: `rotate(6deg) scale(${Math.min(1, pop(f, a)) || 0.001})`, boxShadow: "0 10px 20px rgba(0,0,0,.3)", padding: 20 }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CARBON }}>new board</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 90, color: C.ver }}>$480</div></div></div></Bg>;
};

// ==================== boomerang — el apagón no la mata: la luz se va como un búmeran, da la vuelta y al volver le pega a la placa
export const Boomerang: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 1, dur * 0.5); const t = cl(f / Math.max(20, b + 16)); const ang = t * Math.PI * 2;
  const x = 960 + 640 * Math.sin(ang), y = 540 - 300 * Math.sin(ang * 2) * 0.6; const hit = f > b + 16;
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={800} y={420} width={260} height={240} rx={14} fill="#1f6b3a" stroke={LINE} strokeWidth={4} />{[0, 1, 2].map((i) => <rect key={i} x={830 + i * 70} y={460} width={50} height={60} fill="#111" />)}
      {hit && <circle cx={930} cy={540} r={40 + (f - b - 16) * 3} fill="none" stroke={C.ver} strokeWidth={8} opacity={cl(1 - (f - b - 16) / 20)} />}
      {hit && <circle cx={880} cy={580} r={30} fill="#5a3a1a" opacity={0.9} />}
      {!hit && <g transform={`translate(${x} ${y}) rotate(${f * 24})`}><path d="M -80 0 Q 0 -30 0 -80 Q 10 -10 80 0 Q 0 10 -80 0 Z" fill="#ffe066" /></g>}
      <path d="M 300 100 L 300 240" stroke="#666" strokeWidth={6} />
    </svg>
    <Big x={480} y={170} at={4} size={52} font={SANS} col="#9aa3ad">BLACKOUT · board fine</Big>
    <Big x={1440} y={900} at={b} size={64} col={C.ver}>it dies when it comes back</Big>
  </Bg>;
};

// ==================== piggy — la alcancía se resquebraja y escupe monedas: $300 … $700
export const Piggy: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20), b = M(m, 1, dur * 0.6); const crack = cl((f - a) / 20); const spill = io((f - b) / 30); const usd = Math.round(300 + 400 * spill);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <ellipse cx={900} cy={520} rx={330} ry={240} fill="#f2a7b8" /><circle cx={1180} cy={470} r={90} fill="#f2a7b8" /><ellipse cx={1250} cy={480} rx={40} ry={30} fill="#e58aa0" />
      <path d="M 760 290 L 800 230 L 840 290" fill="#e58aa0" /><rect x={820} y={280} width={140} height={20} rx={8} fill="#7a3a4a" />
      {[700, 880, 1040].map((x, i) => <rect key={i} x={x} y={720} width={60} height={110} rx={20} fill="#e58aa0" />)}
      <path d={`M 900 300 L 870 380 L 930 440 L 880 520 L 940 600`} stroke="#3a1a22" strokeWidth={8} fill="none" strokeDasharray="420" strokeDashoffset={420 - 420 * crack} />
      {Array.from({ length: 16 }, (_, i) => { const t = cl(spill * 1.4 - i * 0.05); return <ellipse key={i} cx={900 + (i - 8) * 30 * t} cy={600 + t * (300 + (i % 4) * 20)} rx={34} ry={14} fill="#e4b84a" stroke="#8a6a1a" strokeWidth={3} opacity={t > 0 ? 1 : 0} />; })}
    </svg>
    <Big x={1500} y={240} at={b} size={110} col={C.ver}>${usd}</Big>
  </Bg>;
};

// ==================== sonar — el radar barre el sótano y hace "ping" en los tres lugares donde suele estar el interruptor
export const Sonar: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const ang = f * 0.06; const P3 = [[620, 420, "SIDE OF THE FURNACE", M(m, 0, 30)], [1260, 520, "THE WALL", M(m, 1, 90)], [960, 200, "THE JOIST ABOVE", M(m, 2, 150)]] as const; const red = M(m, 3, dur * 0.8);
  return <AbsoluteFill style={{ background: "#03140c" }}>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {[150, 300, 450].map((r) => <circle key={r} cx={960} cy={560} r={r} fill="none" stroke="rgba(80,255,150,.25)" strokeWidth={3} />)}
      <path d={`M 960 560 L ${960 + 480 * Math.cos(ang)} ${560 + 480 * Math.sin(ang)} A 480 480 0 0 0 ${960 + 480 * Math.cos(ang - 0.5)} ${560 + 480 * Math.sin(ang - 0.5)} Z`} fill="rgba(80,255,150,.18)" />
      {P3.map(([x, y, t, at]) => f > at ? <g key={t}><circle cx={x} cy={y} r={16} fill="#5fff9a" /><circle cx={x} cy={y} r={16 + ((f - at) % 30) * 2} fill="none" stroke="#5fff9a" strokeWidth={3} opacity={1 - ((f - at) % 30) / 30} />
        <text x={x} y={y - 34} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill="#bfffd6">{t}</text></g> : null)}
      {f > red && <rect x={930} y={226} width={60} height={70} rx={6} fill={C.ver} opacity={k(f, red, 8)} />}
    </svg>
    <Big x={960} y={980} at={red} size={46} font={SANS} col={C.ver}>sometimes a red cover plate</Big>
  </AbsoluteFill>;
};

// ==================== doorhanger — el cartelito de picaporte: de un lado OFF, se da vuelta y del otro ON + 5
export const DoorHanger: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 1, dur * 0.5); const flip = io((f - b) / 14); const side = flip < 0.5;
  return <Bg>
    <div style={{ position: "absolute", left: 1100, top: 460, width: 60, height: 60, borderRadius: 30, background: "#c9c9c9" }} />
    <div style={{ position: "absolute", left: 960, top: 300, width: 340, height: 640, transform: `perspective(1200px) rotateY(${flip * 180}deg) rotate(${Math.sin(f / 10) * 2}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: side ? C.ver : GRN, transform: side ? "none" : "rotateY(180deg)", padding: 30, textAlign: "center", color: "#fff" }}>
        <div style={{ margin: "40px auto 60px", width: 140, height: 140, borderRadius: 70, background: "#2b2117" }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40 }}>{side ? "POWER OUT" : "POWER BACK"}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130 }}>{side ? "OFF" : "ON"}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54 }}>{side ? "the furnace switch" : "after 5 steady min"}</div></div></div>
    <Big x={500} y={540} at={4} size={70} col={C.paper}>{side ? "goes out →" : "comes back →"}</Big>
  </Bg>;
};

// ==================== popout — los enchufes saltan de la pared con resorte: TV, computadora, microondas
export const PopOut: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["TELEVISION", "COMPUTER", "MICROWAVE"]; const ats = T.map((_, i) => M(m, i, 10 + i * 30)); const d = M(m, 3, dur * 0.8);
  return <Bg>{T.map((t, i) => { const p = Math.min(1.2, pop(f, ats[i])); const x = 260 + i * 520;
    return <div key={t} style={{ position: "absolute", left: x, top: 260 }}>
      <div style={{ width: 300, height: 420, background: "#efeadc", borderRadius: 20, boxShadow: "inset 0 0 0 6px #cfc6ae" }}><div style={{ position: "absolute", left: 110, top: 140, width: 80, height: 130, borderRadius: 16, background: "#2b2117" }} /></div>
      <div style={{ position: "absolute", left: 90, top: 150 + p * 260, width: 120, height: 110, background: "#222", borderRadius: 14, transform: `rotate(${p * 25}deg)` }} />
      <div style={{ position: "absolute", left: 140, top: 260 + p * 260, width: 20, height: 400, background: "#222" }} />
      <div style={{ marginTop: 30, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.paper, opacity: k(f, ats[i], 8) }}>{t}</div></div>; })}
    <Big x={960} y={140} at={d} size={52} font={SANS} col={C.gold}>anything with a circuit board</Big></Bg>;
};

// ==================== trampoline — la bolita en la cama elástica: hunde la lona (sag) y sale disparada por encima de la raya roja (surge)
export const Trampoline: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.5); const sag = f < b ? io((f - a) / 14) : 1 - io((f - b) / 6); const up = f > b ? Math.sin(Math.PI * cl((f - b) / 24)) : 0;
  const by = 640 + sag * 140 - up * 520;
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <line x1={300} y1={300} x2={1620} y2={300} stroke={C.ver} strokeWidth={6} strokeDasharray="30 18" /><text x={1640} y={312} fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.ver}>TOO HIGH</text>
    <path d={`M 500 700 Q 960 ${700 + sag * 280} 1420 700`} stroke="#222" strokeWidth={16} fill="none" />
    <line x1={500} y1={700} x2={460} y2={900} stroke="#888" strokeWidth={14} /><line x1={1420} y1={700} x2={1460} y2={900} stroke="#888" strokeWidth={14} />
    <circle cx={960} cy={by} r={56} fill="#ffe066" stroke="#c9a400" strokeWidth={6} /><text x={960} y={by + 12} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.ink}>V</text>
  </svg><Big x={600} y={980} at={a} size={56} font={SANS} col={COLD}>SAG</Big><Big x={1320} y={200} at={b} size={64} font={SANS} col={C.ver}>SURGE</Big></Bg>;
};

// ==================== ecg — el monitor cardíaco de la red: la línea se cae a cero, vuelve, se cae, vuelve (2-3 veces en un minuto); cada vuelta sacude la caldera
export const Ecg: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const W = 1500; const x0 = 210; const n = Math.min(W, f * 9);
  const yv = (x: number) => { const p = x / W; const off = (p > 0.25 && p < 0.33) || (p > 0.48 && p < 0.55) || (p > 0.7 && p < 0.76); const kick = [0.33, 0.55, 0.76].some((q) => Math.abs(p - q) < 0.01); return off ? 640 : kick ? 320 : 540 + 26 * Math.sin(x / 12); };
  let d = ""; for (let x = 0; x <= n; x += 4) d += `${x ? "L" : "M"} ${x0 + x} ${yv(x)} `;
  const shake = [0.33, 0.55, 0.76].some((q) => Math.abs(n / W - q) < 0.02) ? 8 : 0; const c = M(m, 1, dur * 0.7);
  return <AbsoluteFill style={{ background: "#020a06" }}>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>{Array.from({ length: 30 }, (_, i) => <line key={i} x1={i * 66} y1={0} x2={i * 66} y2={1080} stroke="rgba(80,255,150,.08)" />)}
      <path d={d} stroke="#5fff9a" strokeWidth={6} fill="none" style={{ filter: "drop-shadow(0 0 8px #5fff9a)" }} /></svg>
    <div style={{ position: "absolute", right: 140, bottom: 120, transform: `translate(${shake * Math.sin(f * 3)}px,0)`, width: 200, height: 260, background: "#9aa3ad", borderRadius: 10, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.ink, textAlign: "center", paddingTop: 100 }}>FURNACE</div>
    <Big x={960} y={140} at={M(m, 0, 10)} size={48} font={SANS} col="#bfffd6">trips · recloses · 2–3× a minute</Big>
    <Big x={960} y={900} at={c} size={52} font={SANS} col={C.ver}>each flicker slams the furnace</Big>
  </AbsoluteFill>;
};

// ==================== lastdrop — el vaso de las sacudidas: cada gota es una sacudida; la última rebalsa y deja la mancha marrón
export const LastDrop: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 1, dur * 0.7); const drops = Math.floor(f / 10); const lvl = Math.min(1, drops * 0.08); const over = f > b - 20;
  return <Bg>
    <div style={{ position: "absolute", left: 760, top: 300, width: 400, height: 560, border: "10px solid rgba(255,255,255,.7)", borderTop: "none", borderRadius: "0 0 30px 30px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "#ffcf4a", opacity: 0.85 }} /></div>
    {!over && <div style={{ position: "absolute", left: 950, top: 120 + (f % 10) * 18, width: 22, height: 30, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#ffcf4a" }} />}
    {over && <div style={{ position: "absolute", left: 700, top: 860, width: 520 * k(f, b - 20, 20), height: 60, borderRadius: 30, background: "#5a3a1a" }} />}
    <Big x={960} y={960} at={b} size={64} col={C.ver}>the brown spot</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== jackbox — la caja sorpresa: la manivela gira despacio… y salta el resorte con la palabra SURGE
export const JackBox: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 0, dur * 0.6); const open = f > b; const s = open ? Math.min(1.15, pop(f, b)) : 0;
  return <Bg>
    <div style={{ position: "absolute", left: 760, top: 560, width: 400, height: 360, background: "repeating-linear-gradient(45deg,#c62a22 0 40px,#e9e4d6 40px 80px)", border: "8px solid #2b2117" }} />
    <div style={{ position: "absolute", left: 760, top: 540, width: 400, height: 30, background: "#2b2117", transformOrigin: "0 50%", transform: `rotate(${open ? -110 : 0}deg)` }} />
    <div style={{ position: "absolute", left: 1160, top: 700, width: 120, height: 14, background: "#888", transformOrigin: "0 50%", transform: `rotate(${f * 8}deg)` }} />
    {open && <div style={{ position: "absolute", left: 960, top: 560 - s * 380, transform: "translateX(-50%)", fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: "#ffe066", textShadow: "0 0 30px #ff7a1a" }}>SURGE!</div>}
    {open && <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M 960 560 L 960 ${560 - s * 260}`} stroke="#888" strokeWidth={10} strokeDasharray="14 10" /></svg>}
  </Bg>;
};

// ==================== boardgame — el tablero de juego: el peón avanza 5 casilleros (minutos); un parpadeo lo manda de vuelta a SALIDA
export const BoardGame: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const back = M(m, 2, dur * 0.65); const steps = f < back ? Math.min(4, Math.floor(f / 22)) : Math.max(0, Math.floor((f - back - 16) / 22)); const xs = [0, 1, 2, 3, 4, 5].map((i) => 300 + i * 240);
  const px = f >= back && f < back + 16 ? xs[4] + (xs[0] - xs[4]) * io((f - back) / 16) : xs[steps];
  return <Bg>
    {xs.map((x, i) => <div key={i} style={{ position: "absolute", left: x - 100, top: 480, width: 200, height: 200, background: i === 0 ? C.ver : i === 5 ? GRN : ["#e9e4d6", "#d9b23a"][i % 2], border: "6px solid #2b2117", fontFamily: SANS, fontWeight: 800, fontSize: i === 0 || i === 5 ? 40 : 70, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 0 ? "START" : i === 5 ? "ON" : i}</div>)}
    <div style={{ position: "absolute", left: px - 40, top: 380 - Math.abs(Math.sin(f / 7)) * 30, width: 80, height: 110, borderRadius: "40px 40px 10px 10px", background: C.ink }} />
    {f >= back && f < back + 10 && <AbsoluteFill style={{ background: "rgba(255,255,255,.4)" }} />}
    <Big x={960} y={820} at={back} size={52} font={SANS} col={C.ver}>it flickered · back to start</Big>
    <Big x={960} y={220} at={4} size={56} col={C.paper}>five minutes, one square each</Big>
  </Bg>;
};

// ==================== blinkcount — la luz de la placa parpadea y cada parpadeo cae como un palito en la libreta
export const BlinkCount: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 30); const t = Math.max(0, f - a); const ph = t % 70; const n = ph < 60 ? Math.min(3, Math.floor(ph / 15) + (ph % 15 < 8 ? 1 : 0)) : 0; const on = t > 0 && ph < 45 && ph % 15 < 8;
  return <Bg dark>
    <div style={{ position: "absolute", left: 300, top: 260, width: 560, height: 560, borderRadius: 20, background: "#1f6b3a", border: "6px solid " + LINE }}>
      <div style={{ position: "absolute", left: 230, top: 230, width: 100, height: 100, borderRadius: 50, background: on ? C.ver : "#3a0e0e", boxShadow: on ? "0 0 80px #ff3a3a" : "none" }} /></div>
    <div style={{ position: "absolute", left: 1060, top: 260, width: 600, height: 560, background: C.paper, padding: 40 }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.gold }}>BLINKS</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 200, color: CARBON, letterSpacing: 20 }}>{"|".repeat(n)}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: C.ver, opacity: t > 60 ? 1 : 0 }}>code 3</div></div>
  </Bg>;
};

// ==================== rampmeter — el semáforo de acceso: deja pasar UN aparato por luz verde, un minuto entre uno y otro
export const RampMeter: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["FRIDGE", "TELEVISION", "COMPUTER"]; const ats = T.map((_, i) => M(m, i + 1, 40 + i * 50)); const cur = ats.reduce((acc, a, i) => (f >= a ? i : acc), -1);
  return <Bg>
    <div style={{ position: "absolute", left: 860, top: 120, width: 120, height: 300, borderRadius: 20, background: "#222" }}>{["#c62a22", "#3f9d5a"].map((c, i) => { const green = i === 1 && cur >= 0 && f - ats[cur] < 20; const red = i === 0 && !(cur >= 0 && f - ats[cur] < 20);
      return <div key={i} style={{ margin: "30px auto", width: 90, height: 90, borderRadius: 45, background: green || red ? c : "#333", boxShadow: green || red ? `0 0 40px ${c}` : "none" }} />; })}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 200, background: "#4a4f57" }} /><div style={{ position: "absolute", left: 920, top: 540, width: 8, height: 240, background: "#fff" }} />
    {T.map((t, i) => { const go = i <= cur ? io((f - ats[i]) / 30) : 0; const x = 200 + (2 - i) * 220 - 0 + go * (1300 - 0); return <div key={t} style={{ position: "absolute", left: i <= cur ? 600 + go * 900 : 180 + (2 - i) * 200, top: 600, width: 180, height: 120, borderRadius: 14, background: ["#e9e4d6", "#5d6a7a", "#2f5fa8"][i], fontFamily: SANS, fontWeight: 800, fontSize: 28, color: i ? "#fff" : C.ink, display: "flex", alignItems: "center", justifyContent: "center", opacity: x > -1 ? 1 : 0 }}>{t}</div>; })}
    <Big x={960} y={900} at={M(m, 4, dur * 0.85)} size={56} font={SANS} col={C.gold}>a minute apart</Big>
  </Bg>;
};

// ==================== labeler — la etiquetadora: aprieta el gatillo y sale la cinta con la regla letra por letra
export const Labeler: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const L = ["POWER OUT · SWITCH OFF", "BACK · WAIT 5 · SWITCH ON", "NO START · COUNT BLINKS"]; const ats = L.map((_, i) => M(m, i, 10 + i * (dur / 3)));
  return <Bg>
    <div style={{ position: "absolute", left: 160, top: 360, width: 360, height: 300, borderRadius: 40, background: "#2b2b2b", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", left: 40, top: 40, width: 280, height: 90, background: "#9fd39f", borderRadius: 8 }} /></div>
    {L.map((t, i) => { const p = cl((f - ats[i]) / 24); return <div key={t} style={{ position: "absolute", left: 520, top: 380 + i * 110, height: 80, background: "#111", color: "#f2f2f2", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 52, lineHeight: "80px", padding: "0 30px", letterSpacing: 4, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - p * 100}% 0 0)`, transform: `rotate(${i - 1}deg)` }}>{t}</div>; })}
  </Bg>;
};

// ==================== slots — la tragamonedas de los síntomas: los rodillos frenan en BUZZ · HOT · LOCKOUT
export const Slots: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const R = ["BUZZ", "HOT", "LOCKOUT"]; const stops = R.map((_, i) => M(m, i === 2 ? 3 : i, 20 + i * 30)); const pool = ["BUZZ", "HOT", "SENSOR", "LOCKOUT", "DEAD", "OK"];
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 680, borderRadius: 60, background: "linear-gradient(180deg,#c62a22,#7a1410)", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      {R.map((r, i) => { const spin = f < stops[i]; const word = spin ? pool[Math.floor(f / 3 + i) % pool.length] : r;
        return <div key={i} style={{ position: "absolute", left: 80 + i * 360, top: 160, width: 320, height: 300, background: "#fbfaf4", borderRadius: 16, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, color: spin ? "#999" : C.ink, transform: `translateY(${spin ? ((f * 40) % 300) - 150 : 0}px)`, filter: spin ? "blur(3px)" : "none" }}>{word}</div></div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: "#ffe066", opacity: k(f, M(m, 4, dur - 30), 8) }}>…or it just dies</div></div>
    <div style={{ position: "absolute", left: 1580, top: 260, width: 30, height: 260, background: "#888", borderRadius: 15 }} /><div style={{ position: "absolute", left: 1560, top: 220, width: 70, height: 70, borderRadius: 35, background: C.ver }} />
  </Bg>;
};

// ==================== umbrella — el paraguas sobre el tablero: se abre y los rayos que bajan por la línea rebotan en la tela
export const Umbrella: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const op = io((f - a) / 14);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={820} y={620} width={280} height={380} fill="#8a939d" stroke={LINE} strokeWidth={4} />{Array.from({ length: 8 }, (_, i) => <rect key={i} x={850 + (i % 2) * 120} y={650 + Math.floor(i / 2) * 80} width={100} height={50} fill="#333" />)}
    <line x1={960} y1={600} x2={960} y2={300} stroke="#666" strokeWidth={10} />
    <path d={`M ${960 - 420 * op} ${360 + 60 * (1 - op)} Q 960 ${360 - 260 * op} ${960 + 420 * op} ${360 + 60 * (1 - op)} Z`} fill={C.ver} />
    {Array.from({ length: 5 }, (_, i) => { const t = ((f + i * 13) % 40) / 40; const x = 600 + i * 180; const y = -50 + t * 420; const hitY = 330 - 180 * op * (1 - Math.abs(x - 960) / 420);
      return y < hitY || op < 0.5 ? <path key={i} d={`M ${x} ${y} l -16 40 l 14 0 l -18 44`} stroke="#fff6a0" strokeWidth={6} fill="none" /> : <path key={i} d={`M ${x} ${hitY} l ${x < 960 ? -60 : 60} -40`} stroke="#fff6a0" strokeWidth={6} opacity={1 - t} />; })}
  </svg><Big x={960} y={1040} at={a} size={44} font={SANS} col={C.gold}>whole-house surge protector · at the panel</Big>{dur > 0 && null}</Bg>;
};

// ==================== oilpress — el botón rojo del quemador a gasoil: cada apretón deja un charco más de gasoil en la cámara; al cuarto, la bocanada
export const OilPress: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5); const n = f < a ? Math.min(1, Math.floor(f / 30)) : 1 + Math.min(3, Math.floor((f - a) / 24)); const pressing = f % 24 < 6 && f > a;
  return <Bg dark>
    <div style={{ position: "absolute", left: 300, top: 300, width: 300, height: 300, borderRadius: 30, background: "#555" }}><div style={{ position: "absolute", left: 90, top: 90 + (pressing ? 10 : 0), width: 120, height: 120, borderRadius: 60, background: C.ver, boxShadow: pressing ? "none" : "0 12px 0 #6b0e0a" }} /></div>
    <div style={{ position: "absolute", left: 800, top: 260, width: 800, height: 520, borderRadius: 40, background: "#2b2117", border: "10px solid #555", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: n * 50, background: "#1a1206", borderTop: "4px solid #4a3a1a" }} />
      {n >= 4 && <div style={{ position: "absolute", left: 300, bottom: 60, width: 300 * k(f, a + 72, 10), height: 300 * k(f, a + 72, 10), borderRadius: "50%", background: "radial-gradient(circle,#ffe066,#ff7a1a 50%,rgba(60,60,60,.9))" }} />}</div>
    <Big x={450} y={680} at={4} size={70} col={C.paper}>{n}× press</Big>
    <Big x={1200} y={860} at={4} size={48} font={SANS} col={n >= 4 ? C.ver : C.gold}>{n >= 4 ? "puff back" : "oil in the chamber"}</Big>
  </Bg>;
};

// ==================== molasses — el aceite del compresor frío: cae como melaza; con horas de calor corre como agua
export const Molasses: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5); const warm = io((f - a) / 50); const hrs = Math.round(warm * 6);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={760} y={160} width={400} height={200} rx={30} fill="#5d6a7a" />
      <path d={`M 960 360 Q ${960 + 10 * Math.sin(f / 10)} ${360 + (200 + warm * 300) / 2} 960 ${360 + 120 + warm * 420 * cl(f / 40)}`} stroke={`rgb(${Math.round(90 + 120 * warm)},${Math.round(60 + 110 * warm)},20)`} strokeWidth={60 - warm * 40} strokeLinecap="round" fill="none" />
      <rect x={1300} y={300} width={60} height={420} rx={30} fill="#eee" stroke="#999" strokeWidth={5} /><rect x={1306} y={714 - 400 * (0.15 + 0.7 * warm)} width={48} height={400 * (0.15 + 0.7 * warm)} rx={24} fill={warm > 0.5 ? C.ver : COLD} />
    </svg>
    <Big x={960} y={110} at={4} size={52} font={SANS} col={COLD}>cold compressor oil</Big>
    <Big x={1560} y={540} at={a} size={84} col={C.gold}>+{hrs} h</Big>
  </Bg>;
};

// ==================== advent — el almanaque de octubre: seis puertitas se abren y adentro está cada tarea de la tarde
export const Advent: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const T = ["LABEL THE SWITCH", "TAPE THE CARD", "NEW FILTER", "CHECK THE VENTS", "TEST CO ALARMS", "MODEL NUMBER"]; const ats = T.map((_, i) => (i < 2 ? M(m, i + 1, 30 + i * 40) : 120 + i * 30));
  return <Bg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: "#e58a2a" }}>ONE AFTERNOON IN OCTOBER</div>
    {T.map((t, i) => { const o = io((f - ats[i]) / 12); const x = 260 + (i % 3) * 480, y = 260 + Math.floor(i / 3) * 360;
      return <div key={t} style={{ position: "absolute", left: x, top: y, width: 420, height: 320 }}>
        <div style={{ position: "absolute", inset: 0, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink, padding: 20 }}>{t}</div>
        <div style={{ position: "absolute", inset: 0, background: "#a8501e", border: "6px solid #6b2e0e", transformOrigin: "0 50%", transform: `perspective(1200px) rotateY(${-o * 110}deg)`, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: "#f2c48a", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div></div>; })}
  </Bg>;
};

// ==================== filterclog — el filtro se va poniendo gris, las flechas de aire se achican y el termómetro del límite sube a TRIP
export const FilterClog: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.4), c = M(m, 2, dur * 0.65); const g = io((f - b) / 40); const temp = Math.round(120 + 90 * io((f - b) / 50));
  return <Bg>
    <div style={{ position: "absolute", left: 300, top: 240, width: 460, height: 600, background: `rgb(${Math.round(245 - 150 * g)},${Math.round(240 - 150 * g)},${Math.round(230 - 150 * g)})`, border: "16px solid #c9b48a", backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 20px, transparent 20px 40px)", opacity: k(f, a, 8) }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 820, top: 300 + i * 130, width: 400 * (1 - g * 0.8), height: 26, background: COLD, clipPath: "polygon(0 30%,85% 30%,85% 0,100% 50%,85% 100%,85% 70%,0 70%)" }} />)}
    <div style={{ position: "absolute", left: 1420, top: 220, width: 60, height: 520, borderRadius: 30, background: "#eee", border: "5px solid #999" }}><div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: (temp - 100) * 4.6, borderRadius: 24, background: temp > 190 ? C.ver : C.gold }} /></div>
    <Big x={1450} y={160} at={b} size={64} col={temp > 190 ? C.ver : C.paper}>{temp}°F</Big>
    <Stamp text="LIMIT TRIP" at={c} x={1450} y={830} />
  </Bg>;
};

// ==================== jenga — la torre de piezas: cada bloque es un repuesto con su precio; tiembla cuando se agrega el siguiente
export const Jenga: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = [["CONTROL BOARD", "$300–700"], ["IGNITER", "$150–300"], ["INDUCER MOTOR", "$300–600"]]; const ats = T.map((_, i) => M(m, i === 0 ? 0 : i + 1, 20 + i * (dur / 3)));
  const wob = (i: number) => Math.sin((f - ats[i]) / 3) * 4 * cl(1 - (f - ats[i]) / 20);
  return <Bg>{T.map(([t, p], i) => { const e = Math.min(1, pop(f, ats[i])) || 0; return f > ats[i] ? <div key={t} style={{ position: "absolute", left: 560, top: 820 - i * 190 - (1 - e) * 300, width: 800, height: 170, background: ["#d9a066", "#c98e52", "#b87b40"][i], border: "4px solid #6b4a2a", transform: `rotate(${wob(i) + (i % 2 ? 1 : -1)}deg)`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: "#2b1a0a" }}><span>{t}</span><span style={{ color: C.ver }}>{p}</span></div> : null; })}
    <div style={{ position: "absolute", left: 460, top: 1000, width: 1000, height: 30, background: "#555" }} /></Bg>;
};

// ==================== nowserving — el visor de "estamos atendiendo el número": va por el 12, el tuyo es el 87
export const NowServing: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.4), b = M(m, 2, dur * 0.7); const now = 12 + Math.floor(cl(f / dur) * 2);
  return <Bg dark>
    <div style={{ position: "absolute", left: 360, top: 160, width: 700, height: 420, background: "#111", borderRadius: 20, border: "10px solid #444", textAlign: "center" }}>
      <div style={{ marginTop: 30, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#aaa", letterSpacing: 6 }}>NOW SERVING</div>
      <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 240, color: "#ff3a2a", textShadow: "0 0 30px #ff3a2a" }}>{String(now).padStart(2, "0")}</div></div>
    <div style={{ position: "absolute", left: 1200, top: 300, width: 360, height: 460, background: "#f2d9a8", transform: `rotate(8deg) translateY(${(1 - k(f, a, 12)) * 300}px)`, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ marginTop: 40, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink }}>YOUR NUMBER</div><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: C.ink }}>87</div></div>
    <Big x={710} y={760} at={b} size={80} col={C.gold}>$100–200 just to show up</Big>
  </Bg>;
};

// ==================== postcard — la postal: se da vuelta, sello de Bluffton 2011 y la estampilla con el pueblo bajo el hielo
export const Postcard: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20), b = M(m, 1, dur * 0.4); const fl = io((f - a) / 16);
  return <Bg>
    <div style={{ position: "absolute", left: 460, top: 220, width: 1000, height: 640, transform: `perspective(1600px) rotateY(${180 - fl * 180}deg)`, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, background: "#f4ecd8", backfaceVisibility: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: 500, top: 40, bottom: 40, width: 3, background: "#c9bfa6" }} />
        <div style={{ position: "absolute", right: 50, top: 40, width: 140, height: 170, border: "6px dashed #8a6a3a", background: "linear-gradient(180deg,#bfe0ff,#fff 60%,#9ab0c8)" }} />
        <div style={{ position: "absolute", right: 140, top: 150, width: 220, height: 220, borderRadius: 110, border: "6px solid rgba(198,42,34,.7)", transform: `rotate(-14deg) scale(${Math.min(1, pop(f, b)) || 0.001})`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "rgba(198,42,34,.85)" }}>BLUFFTON<br />OHIO<br />2011</div>
        <Hand text="the story that taught me" at={b + 20} size={52} style={{ position: "absolute", left: 50, top: 300 }} /></div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#9ab0c8,#e8eef4)", transform: "rotateY(180deg)", backfaceVisibility: "hidden" }} /></div>
  </Bg>;
};

// ==================== goalie — los arqueros: la zapatilla con protector cuida el arco chico de la tele; el arco grande de la caldera queda vacío; el protector del tablero tapa todo
export const Goalie: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 40), b = M(m, 2, dur * 0.55), c = M(m, 3, dur * 0.8);
  const ball = (x0: number, x1: number, at: number, saved: boolean) => { const t = cl((f - at) / 18); return f > at ? <circle cx={x0 + (x1 - x0) * t} cy={540 - Math.sin(Math.PI * t) * 120 + (saved && t >= 1 ? 120 : 0)} r={26} fill="#ffe066" /> : null; };
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={200} y={420} width={300} height={220} fill="none" stroke="#fff" strokeWidth={10} /><text x={350} y={700} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.paper}>TV · COMPUTER</text>
    <rect x={250} y={520} width={200} height={40} rx={10} fill={GRN} opacity={k(f, a, 8)} />
    <rect x={1200} y={300} width={540} height={360} fill="none" stroke="#fff" strokeWidth={10} /><text x={1470} y={720} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.paper}>FURNACE · HARDWIRED</text>
    {f > c && <rect x={1180} y={280} width={580} height={400} fill="rgba(63,157,90,.35)" stroke={GRN} strokeWidth={8} opacity={k(f, c, 10)} />}
    {ball(960, 360, a + 6, true)}{ball(960, 1470, b, f > c)}
  </svg><Big x={960} y={140} at={b + 20} size={56} font={SANS} col={f > c ? GRN : C.ver}>{f > c ? "the panel protector covers it" : "the strip can't reach the furnace"}</Big></Bg>;
};

// ==================== bulge — el capacitor: la lata se hincha arriba y el motor zumba sin girar
export const Bulge: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5); const b = io((f - a) / 30); const hum = Math.sin(f * 2.5) * 3;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <g transform={`translate(${hum} 0)`}><circle cx={600} cy={540} r={200} fill="#5d6a7a" /><circle cx={600} cy={540} r={60} fill="#333" /><text x={600} y={820} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={C.paper}>INDUCER · hum</text></g>
    <rect x={1200} y={340} width={240} height={400} rx={30} fill="#c9ced6" />
    <path d={`M 1200 360 Q 1320 ${340 - b * 90} 1440 360`} fill="#c9ced6" stroke="#888" strokeWidth={4} />
    <path d={`M 1260 350 L 1380 350 M 1320 300 L 1320 ${350 - b * 50}`} stroke="#555" strokeWidth={6} opacity={0.5} />
    {b > 0.6 && <path d="M 1320 260 q 10 -30 0 -60 q -10 -30 0 -60" stroke="#999" strokeWidth={6} fill="none" opacity={0.6} />}
  </svg><Big x={1320} y={820} at={a} size={44} font={SANS} col={C.ver}>CAPACITOR · took the hit</Big></Bg>;
};

// ==================== fuseblow — el fusible de la placa en primer plano: el filamento se pone rojo, se curva y se corta
export const FuseBlow: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.5); const hot = io((f - a) / 30); const gone = f > b;
  return <Bg dark>
    <div style={{ position: "absolute", left: 560, top: 260, width: 800, height: 420, borderRadius: 30, background: "rgba(80,140,255,.35)", border: "10px solid rgba(80,140,255,.8)" }} />
    <div style={{ position: "absolute", left: 460, top: 390, width: 120, height: 160, background: "#c9c9c9", borderRadius: 10 }} /><div style={{ position: "absolute", left: 1340, top: 390, width: 120, height: 160, background: "#c9c9c9", borderRadius: 10 }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {!gone ? <path d={`M 580 470 Q 960 ${470 + 60 * hot * Math.sin(f / 2)} 1340 470`} stroke={`rgb(${Math.round(200 + 55 * hot)},${Math.round(200 - 120 * hot)},80)`} strokeWidth={14} fill="none" style={{ filter: `drop-shadow(0 0 ${30 * hot}px #ff5a1a)` }} />
        : <g><path d="M 580 470 Q 760 520 900 500" stroke="#333" strokeWidth={14} fill="none" /><path d="M 1020 500 Q 1160 520 1340 470" stroke="#333" strokeWidth={14} fill="none" /></g>}
    </svg>
    <Big x={960} y={180} at={4} size={56} font={SANS} col={C.paper}>3 A · 5 A automotive fuse</Big>
    <Big x={960} y={820} at={b} size={64} col={C.gold}>sometimes it’s just the fuse</Big>
  </Bg>;
};

// ==================== strikes — el tablero de béisbol: STRIKE 1, 2, 3 → LOCKOUT
export const Strikes: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.3); const n = Math.min(3, Math.max(0, Math.floor((f - a) / 22) + 1)); const out = f > a + 66;
  return <Bg dark>
    <div style={{ position: "absolute", left: 460, top: 200, width: 1000, height: 620, background: "#0b3a20", border: "16px solid #3a2a1a", borderRadius: 10, textAlign: "center" }}>
      <div style={{ marginTop: 40, fontFamily: SANS, fontWeight: 800, fontSize: 60, color: "#f2f2f2", letterSpacing: 10 }}>IGNITION TRIES</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 60 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 140, height: 140, borderRadius: 70, background: i < n ? "#ffcf4a" : "#123a24", boxShadow: i < n ? "0 0 40px #ffcf4a" : "none" }} />)}</div>
      <div style={{ marginTop: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: out ? C.ver : "#123a24" }}>LOCKOUT</div></div>
    <Big x={960} y={940} at={M(m, 0, 10)} size={44} font={SANS} col={C.paper}>cracked igniter · no glow</Big>
  </Bg>;
};

// ==================== passthru — el caño con el tanque al costado: el agua sucia de la red pasa derecho por la estación hasta la caldera
export const PassThru: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.5); const sw = f > b && Math.floor(f / 12) % 2;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 100 540 L 1820 540" stroke="#555" strokeWidth={60} /><rect x={760} y={360} width={400} height={360} rx={30} fill="#2f5fa8" stroke={LINE} strokeWidth={5} />
    <text x={960} y={330} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.paper}>POWER STATION</text>
    <rect x={1660} y={420} width={160} height={240} fill="#9aa3ad" /><text x={1740} y={700} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={C.paper}>FURNACE</text>
    <path d={`M 100 540 ${Array.from({ length: 40 }, (_, i) => `L ${100 + i * 40} ${540 + (i % 3 === 0 ? -50 : i % 3 === 1 ? 40 : 0) * (Math.sin(f / 3 + i) > 0 ? 1 : -1)}`).join(" ")}`} stroke={C.ver} strokeWidth={8} fill="none" opacity={k(f, a, 8)} strokeDasharray={`${Math.min(1700, f * 40)} 3000`} />
    {f > b && <g><circle cx={960} cy={540} r={60} fill={sw ? "#ffe066" : "#333"} /><text x={960} y={800} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill="#ffe066">{sw ? "BATTERY" : "WALL"}</text></g>}
  </svg><Big x={960} y={140} at={a} size={52} font={SANS} col={C.ver}>passes right through</Big></Bg>;
};

// ==================== viewmaster — el visor de diapositivas: el disco gira y muestra las cuatro cosas a revisar antes de llamar
export const ViewMaster: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["THE SWITCH", "THE BREAKER", "THE FILTER", "THE VENTS"]; const ats = T.map((_, i) => M(m, i, 10 + i * 40)); const cur = ats.reduce((acc, a, i) => (f >= a ? i : acc), 0); const rot = cur * 90 - 90 * (1 - io((f - ats[cur]) / 10));
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <g transform={`rotate(${-rot} 560 540)`}><circle cx={560} cy={540} r={300} fill="#f2f2f2" stroke="#ccc" strokeWidth={6} /><circle cx={560} cy={540} r={40} fill="#ccc" />
        {T.map((_, i) => <rect key={i} x={540} y={280} width={40} height={60} fill={i === cur ? C.gold : "#999"} transform={`rotate(${i * 90} 560 540)`} />)}</g>
      <rect x={1000} y={300} width={720} height={480} rx={60} fill="#c62a22" /><circle cx={1200} cy={540} r={130} fill="#111" /><circle cx={1520} cy={540} r={130} fill="#111" />
    </svg>
    <div style={{ position: "absolute", left: 1000, top: 830, width: 720, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: C.paper }}>{cur + 1} · {T[cur]}</div>
    <Big x={1360} y={200} at={M(m, 4, dur * 0.8)} size={48} font={SANS} col={C.gold}>half the dead furnaces</Big>
  </Bg>;
};

// ==================== keypad — el teléfono de disco gigante: antes de discar, las cuatro cosas en fila; el modelo se ilumina primero
export const Keypad: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["MODEL NUMBER", "BLINK CODE", "WHAT HAPPENED", "WHAT YOU CHECKED"]; const a = M(m, 1, dur * 0.5);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform={`rotate(${f < a ? 0 : -40 * io((f - a) / 16)} 520 540)`}><circle cx={520} cy={540} r={300} fill="#2b2b2b" />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={520 + 220 * Math.cos(-2.2 + i * 0.5)} cy={540 + 220 * Math.sin(-2.2 + i * 0.5)} r={44} fill="#f2f2f2" />)}</g><circle cx={520} cy={540} r={90} fill="#c62a22" /></svg>
    {T.map((t, i) => <div key={t} style={{ position: "absolute", left: 980, top: 240 + i * 150, width: 760, height: 120, background: i === 0 && f > a ? C.gold : C.paper, borderRadius: 14, opacity: k(f, M(m, 0, 10) + i * 8, 8), display: "flex", alignItems: "center", padding: "0 40px", fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.ink }}>{i + 1} · {t}</div>)}
  </Bg>;
};

// ==================== neon — el cartel de neón del repaso: cada línea se enciende con su zumbido, la de la regla en rojo
export const Neon: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const L = ["POWER OUT → SWITCH OFF", "STEADY FIVE MINUTES", "SWITCH ON · WATCH ONE START"]; const ats = L.map((_, i) => M(m, i, 10 + i * (dur / 3)));
  return <AbsoluteFill style={{ background: "#0a0a12" }}>
    <div style={{ position: "absolute", left: 200, top: 140, right: 200, bottom: 140, border: "6px solid #2a2a3a", borderRadius: 30 }} />
    {L.map((t, i) => { const on = f > ats[i] && !(f - ats[i] < 10 && (f - ats[i]) % 4 < 2); const col = i === 1 ? "#ff4a5a" : "#5ff3ff";
      return <div key={t} style={{ position: "absolute", left: 0, right: 0, top: 260 + i * 200, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 96, color: on ? "#fff" : "#2a2a3a", textShadow: on ? `0 0 10px ${col}, 0 0 30px ${col}, 0 0 60px ${col}` : "none" }}>{t}</div>; })}
  </AbsoluteFill>;
};

// ==================== spiritlevel — el nivel de burbuja: mientras la burbuja queda al centro, el anillo de 5 minutos se llena; si tiembla (parpadeo), el anillo se vacía
export const SpiritLevel: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20); const shake = Math.round(dur * 0.45); const t0 = f < shake + 12 ? 0 : shake + 12;
  const wob = f >= shake && f < shake + 12 ? Math.sin(f * 2.2) * 220 : 0; const p = f >= shake && f < shake + 12 ? 0 : cl((f - t0) / (f < shake ? shake * 1.5 : dur - shake));
  const R = 150, L = 2 * Math.PI * R;
  return <Bg dark>
    <div style={{ position: "absolute", left: 260, top: 470, width: 1000, height: 150, borderRadius: 30, background: "#d9b23a", border: "8px solid #8a6a1a" }}>
      <div style={{ position: "absolute", left: 300, top: 35, width: 400, height: 80, borderRadius: 40, background: "rgba(190,255,140,.85)", border: "4px solid #4a6a2a", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 470 / 2 - 60 + wob * 0.6, top: 14, width: 100, height: 52, borderRadius: 26, background: "rgba(255,255,255,.9)" }} />
        <div style={{ position: "absolute", left: 150, top: 0, width: 4, height: 80, background: "#333" }} /><div style={{ position: "absolute", left: 246, top: 0, width: 4, height: 80, background: "#333" }} /></div></div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <circle cx={1530} cy={545} r={R} fill="none" stroke="#2a3346" strokeWidth={30} />
      <circle cx={1530} cy={545} r={R} fill="none" stroke={p > 0.98 ? GRN : C.gold} strokeWidth={30} strokeDasharray={`${L * p} ${L}`} transform="rotate(-90 1530 545)" />
      <text x={1530} y={570} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={70} fill={C.paper}>{(p * 5).toFixed(1)}</text>
      <text x={1530} y={620} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill="#9aa3ad">MIN STEADY</text></svg>
    <Big x={760} y={260} at={a} size={60} col={C.paper}>no flicker · no dimming</Big>
    <Big x={760} y={800} at={shake} size={46} font={SANS} col={C.ver}>it wobbled → start over</Big>
  </Bg>;
};

// ==================== startgun — la largada: suena el disparo y todos los aparatos de la calle arrancan a la vez y se amontonan en el carril angosto de la línea
export const StartGun: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20), b = M(m, 1, dur * 0.5); const go = io((f - a) / 30); const T = ["FURNACE", "FRIDGE", "WATER HEATER", "FURNACE", "FRIDGE", "PUMP"];
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <line x1={300} y1={160} x2={300} y2={960} stroke="#fff" strokeWidth={8} strokeDasharray="30 20" />
      <path d="M 1200 160 L 1500 470 L 1820 470 L 1820 610 L 1500 610 L 1200 960" fill="none" stroke={C.ver} strokeWidth={6} />
      {f > a && f < a + 10 && <circle cx={200} cy={120} r={60} fill="#ffe066" opacity={0.8} />}
    </svg>
    <div style={{ position: "absolute", left: 120, top: 80, width: 120, height: 60, background: "#333", borderRadius: 10 }} />
    {T.map((t, i) => { const y0 = 180 + i * 125; const x = 320 + go * (1180 + i * 20); const y = go > 0.7 ? y0 + (540 - y0) * cl((go - 0.7) / 0.3) * 0.85 : y0;
      return <div key={i} style={{ position: "absolute", left: x, top: y - 45, width: 200, height: 90, borderRadius: 14, background: ["#9aa3ad", "#e9e4d6", "#c98e52"][i % 3], fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${go > 0.8 ? (i - 2.5) * 6 : 0}deg)` }}>{t}</div>; })}
    <Big x={1640} y={400} at={b} size={50} font={SANS} col={C.ver}>all starting together</Big>
  </Bg>;
};

// ==================== fridgelight — al revés que la heladera: abrís la heladera y la luz se PRENDE; abrís la caldera y la corriente se APAGA
export const FridgeLight: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20); const o1 = io((f - 10) / 14), o2 = io((f - a) / 14);
  const door = (x: number, o: number, col: string) => <div style={{ position: "absolute", left: x, top: 200, width: 460, height: 640, background: col, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-o * 70}deg)`, border: "6px solid #555", borderRadius: 16 }} />;
  return <Bg dark>
    <div style={{ position: "absolute", left: 200, top: 200, width: 460, height: 640, background: o1 > 0.3 ? "#fff8d6" : "#222", borderRadius: 16, boxShadow: o1 > 0.3 ? "0 0 120px rgba(255,240,180,.7)" : "none" }} />
    {door(200, o1, "#e9e4d6")}
    <div style={{ position: "absolute", left: 1160, top: 200, width: 460, height: 640, background: "#1b2638", borderRadius: 16 }}>
      <div style={{ position: "absolute", left: 160, top: 260, width: 140, height: 120, borderRadius: 10, background: "#1f6b3a" }}><div style={{ position: "absolute", left: 56, top: 44, width: 28, height: 28, borderRadius: 14, background: o2 > 0.3 ? "#333" : GRN }} /></div></div>
    {door(1160, o2, "#8a939d")}
    <Big x={430} y={130} at={10} size={50} font={SANS} col="#ffe9a0">FRIDGE · door open = light ON</Big>
    <Big x={1390} y={130} at={a} size={50} font={SANS} col={C.ver}>FURNACE · door open = power OFF</Big>
    <Big x={960} y={960} at={Math.max(a + 30, dur - 50)} size={56} col={C.paper}>put the door back on</Big>
  </Bg>;
};

// ==================== parking — el estacionamiento del circuito: 15 lugares (amperes); entra la estufa y ocupa 12 y medio
export const Parking: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.4); const n = 12.5 * io((f - a) / 36);
  return <Bg>
    <div style={{ position: "absolute", left: 160, top: 360, width: 1600, height: 300, background: "#4a4f57" }} />
    {Array.from({ length: 15 }, (_, i) => { const fill = cl(n - i); return <div key={i} style={{ position: "absolute", left: 180 + i * 104, top: 380, width: 96, height: 260, borderLeft: "4px solid #fff", borderRight: i === 14 ? "4px solid #fff" : "none" }}>
      <div style={{ position: "absolute", left: 10, bottom: 20, width: 72, height: 200 * fill, background: C.ver, borderRadius: 12 }} />
      <div style={{ position: "absolute", top: -50, width: 96, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.paper }}>{i + 1}</div></div>; })}
    <Big x={960} y={220} at={4} size={90} col={C.paper}>1,500 W heater</Big>
    <Big x={960} y={780} at={a + 30} size={64} col={C.gold}>{n.toFixed(1)} of 15 A</Big>
  </Bg>;
};

// ---------- overlays de una sola vez (sobre material real)
export const LedChip: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const on = f % 20 < 10;
  return <div style={{ position: "absolute", right: 140, top: 140, opacity: o, display: "flex", alignItems: "center", gap: 20, background: "rgba(10,20,14,.82)", padding: "18px 30px", borderRadius: 16 }}>
    <div style={{ width: 40, height: 40, borderRadius: 20, background: on ? C.ver : "#3a0e0e", boxShadow: on ? "0 0 24px #ff3a3a" : "none" }} /><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.paper }}>{text}</div></div>;
};
export const KitchenClock: React.FC<{ dur: number; label: string }> = ({ dur, label }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const mn = (f / Math.max(1, dur)) * 5;
  return <div style={{ position: "absolute", left: 140, top: 140, opacity: o, display: "flex", alignItems: "center", gap: 24 }}><svg width={220} height={220}><circle cx={110} cy={110} r={100} fill="rgba(244,239,227,.95)" stroke={C.ink} strokeWidth={8} />
    <line x1={110} y1={110} x2={110 + 80 * Math.sin(mn * 0.1047 * 6)} y2={110 - 80 * Math.cos(mn * 0.1047 * 6)} stroke={C.ver} strokeWidth={6} /><line x1={110} y1={110} x2={110} y2={50} stroke={C.ink} strokeWidth={8} /></svg>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.paper, textShadow: "0 3px 12px #000" }}>{label}</div></div>;
};
export const SnowStake: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const s = Math.min(1, pop(f, 4)) || 0.001;
  return <div style={{ position: "absolute", right: 200, bottom: 120, opacity: o, transform: `scale(${s})`, transformOrigin: "50% 100%" }}>
    <div style={{ background: "#f4ecd8", border: "6px solid #6b4a2a", padding: "16px 30px", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CARBON }}>{text}</div><div style={{ margin: "0 auto", width: 22, height: 220, background: "#6b4a2a" }} /></div>;
};

// ---------- despacho de los planos C
export const CompC: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const c: string = s.comp, m: number[] = s.m || [];
  if (c.startsWith("cut:")) return <FurnaceCut act={c.slice(4)} m={m} dur={dur} />;
  if (c.startsWith("metro:step")) return <Metro n={Number(c.slice(10))} m={m} dur={dur} />;
  if (c.startsWith("wanted:")) return <Wanted n={Number(c.slice(7))} m={m} dur={dur} />;
  const T: Record<string, React.FC<P>> = { thermal: Thermal, coldcal: ColdCal, boomerang: Boomerang, piggy: Piggy, sonar: Sonar, spiritlevel: SpiritLevel, doorhanger: DoorHanger, popout: PopOut, startgun: StartGun, trampoline: Trampoline, ecg: Ecg, lastdrop: LastDrop, jackbox: JackBox, boardgame: BoardGame, blinkcount: BlinkCount, fridgelight: FridgeLight, rampmeter: RampMeter, labeler: Labeler, slots: Slots, umbrella: Umbrella, oilpress: OilPress, molasses: Molasses, advent: Advent, filterclog: FilterClog, jenga: Jenga, nowserving: NowServing, postcard: Postcard, goalie: Goalie, bulge: Bulge, fuseblow: FuseBlow, strikes: Strikes, parking: Parking, passthru: PassThru, viewmaster: ViewMaster, keypad: Keypad, neon: Neon };
  const X = T[c]; return X ? <X m={m} dur={dur} /> : null;
};
