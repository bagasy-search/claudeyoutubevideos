// gary11e · componentes propios (los diez calefactores abiertos en el banco). Mismo look de la serie: hoja de trabajo crema, tinta carbónica, sello rojo,
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
const Sheet: React.FC<{ title: string; no?: string; children?: React.ReactNode; tilt?: number }> = ({ title, no = "11E", children, tilt = -1 }) => {
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

// ==================== cutaway — EL CALEFACTOR PARTIDO AL MEDIO (vuelve 7 veces, cada vez con una acción nueva)
// adelante la rejilla y la resistencia, atrás el ventilador, arriba la perilla del termostato (bimetal), junto a la resistencia el corte térmico, abajo el botón anti-vuelco, atrás la bornera y el cable
export const HeaterCut: React.FC<P & { act: string }> = ({ act, m, dur }) => {
  const f = useCurrentFrame(); const a = (i: number, d: number) => M(m, i, d);
  const X = 520, Y = 230, W = 760, H = 560;
  let pw = 1, glow = 0.7, rot = 0, blanket = 0, cutOpen = 0, cordHot = 0, termHot = 0, oil = 0, fan = 1, warn = 0;
  if (act === "parts") { glow = 0.55; }
  if (act === "tilt") { rot = 90 * io((f - a(0, 20)) / 18); const off = f > a(0, 20) + 20; pw = off ? 0 : 1; glow = off ? Math.max(0, 0.7 - (f - a(0, 20) - 20) / 40) : 0.7; fan = pw; }
  if (act === "cutoff") { blanket = io((f - a(0, 15)) / 30); const t = a(1, dur * 0.55); glow = 0.7 + 0.3 * cl((f - a(0, 15)) / 40); cutOpen = k(f, t, 8); if (cutOpen > 0.5) { pw = 0; glow = Math.max(0, 1 - (f - t) / 40); fan = 0; } }
  if (act === "cord") { cordHot = 0.35 + 0.25 * Math.sin(f / 9); }
  if (act === "terminal") { termHot = cl((f - a(0, 10)) / Math.max(30, dur - 20)) * (0.7 + 0.3 * Math.sin(f / 5)); }
  if (act === "blanket") { blanket = io((f - a(0, 10)) / 30); glow = 0.7 + 0.6 * cl((f - a(0, 10)) / Math.max(40, dur - 30)); warn = k(f, a(1, dur * 0.6), 10); }
  if (act === "oil") { oil = 1; fan = 0; glow = 0.4; }
  const coilCol = glow > 1 ? "#fff3c4" : `rgba(255,${Math.round(120 + 60 * glow)},40,${0.35 + 0.65 * Math.min(1, glow)})`;
  const lab = (txt: string, at: number, x: number, y: number, tx: number, ty: number, col = LINE) => { const e = k(f, at, 10); if (e <= 0) return null;
    return <g key={txt + at} opacity={e}><line x1={x} y1={y} x2={x + (tx - x) * e} y2={y + (ty - y) * e} stroke={col} strokeWidth={3} /><circle cx={x} cy={y} r={7} fill={col} />
      <text x={tx + (tx > x ? 14 : -14)} y={ty + 12} textAnchor={tx > x ? "start" : "end"} fontFamily={SANS} fontWeight={800} fontSize={32} fill={col} letterSpacing={2}>{txt}</text></g>; };
  const L: Record<string, [string, number, number, number, number, number, string?][]> = {
    parts: [["HEATING ELEMENT", a(0, 10), X + 150, Y + 280, X - 80, Y + 120, HOT], ["FAN", a(1, 60), X + 470, Y + 280, X - 80, Y + 470], ["THERMOSTAT · BIMETAL", a(2, 110), X + 640, Y + 40, X + W + 90, Y - 40], ["OVERHEAT CUTOFF", a(3, 150), X + 260, Y + 120, X + W + 90, Y + 110, C.gold], ["TIP-OVER SWITCH", a(4, 190), X + 380, Y + H, X + W + 90, Y + 520], ["TERMINAL BLOCK · 12.5 A", a(5, 230), X + W - 40, Y + 400, X + W + 90, Y + 330]],
    tilt: [["TIP-OVER SWITCH", 10, X + 380, Y + H, X + W + 90, Y + 520], ["CLICK · OFF", a(0, 20) + 22, X + 380, Y + H, X + W + 90, Y + 600, GRN]],
    cutoff: [["BLANKET", a(0, 15) + 10, X + 60, Y + 200, X - 80, Y + 100], ["CUTOFF OPENS", a(1, dur * 0.55), X + 260, Y + 120, X + W + 90, Y + 110, GRN]],
    cord: [["12.5 A IN", 12, X + W + 160, Y + 420, X + W + 200, Y + 300, C.gold], ["STRAIN RELIEF", a(1, dur * 0.5), X + W + 20, Y + 420, X + W + 200, Y + 520]],
    terminal: [["LOOSE CONNECTION", a(0, 10), X + W - 40, Y + 400, X + W + 90, Y + 300, C.ver], ["HEAT · EVERY RUN", a(1, dur * 0.5), X + W - 40, Y + 400, X + W + 90, Y + 480, C.ver]],
    blanket: [["THERMOSTAT READS ROOM AIR", a(0, 10) + 20, X + 640, Y + 40, X + W + 90, Y - 40], ["NO CUTOFF · HOTTER", a(1, dur * 0.6), X + 150, Y + 280, X - 80, Y + 470, C.ver]],
    oil: [["SEALED OIL", 10, X + 380, Y + 300, X - 80, Y + 140, C.gold], ["FINS", a(1, 60), X + 700, Y + 200, X + W + 90, Y + 120], ["NO GLOWING COIL", a(2, 120), X + 300, Y + 470, X - 80, Y + 500, GRN]],
  };
  const dots = `M ${X + W + 300} ${Y + 420} L ${X + W - 40} ${Y + 400} L ${X + 640} ${Y + 60} L ${X + 150} ${Y + 120} L ${X + 150} ${Y + 460}`;
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <defs><pattern id="ge" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(207,224,255,.07)" strokeWidth={2} /></pattern></defs>
      <rect width={1920} height={1080} fill="url(#ge)" />
      <g transform={`rotate(${rot} ${X + W / 2} ${Y + H})`}>
        {oil ? <g>{Array.from({ length: 9 }, (_, i) => <rect key={i} x={X + 40 + i * 80} y={Y + 20} width={60} height={H - 60} rx={26} fill="#2c3a52" stroke={LINE} strokeWidth={3} />)}
          {Array.from({ length: 9 }, (_, i) => <rect key={"o" + i} x={X + 50 + i * 80} y={Y + 60 + (H - 120) * (1 - 0.8)} width={40} height={(H - 120) * 0.8} rx={18} fill={`rgba(224,154,90,${0.35 + 0.2 * Math.sin(f / 14 + i)})`} />)}
          <rect x={X + 60} y={Y + H - 70} width={W - 120} height={18} rx={9} fill={HOT} opacity={0.6 + 0.3 * Math.sin(f / 7)} /></g> :
        <g>
          <rect x={X} y={Y} width={W} height={H} rx={24} fill="#1b2638" stroke={LINE} strokeWidth={4} />
          {/* rejilla */}
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={X + 30} y1={Y + 40 + i * 42} x2={X + 30} y2={Y + 60 + i * 42} stroke="#9aa3ad" strokeWidth={0} />)}
          <rect x={X + 20} y={Y + 30} width={30} height={H - 60} fill="none" stroke="#9aa3ad" strokeWidth={4} strokeDasharray="14 10" />
          {/* resistencia */}
          <path d={Array.from({ length: 16 }, (_, i) => `${i ? "L" : "M"} ${X + 110 + (i % 2) * 80} ${Y + 110 + i * 22}`).join(" ")} fill="none" stroke={coilCol} strokeWidth={10} strokeLinejoin="round" style={{ filter: glow > 0.3 ? `drop-shadow(0 0 ${12 * glow}px ${HOT})` : "none" }} />
          {/* ventilador */}
          <g transform={`translate(${X + 470} ${Y + 280}) rotate(${fan * pw * f * 9})`}>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={0} cy={-55} rx={22} ry={55} fill="#3d4f6e" stroke={LINE} strokeWidth={2} transform={`rotate(${i * 90})`} />)}<circle r={16} fill={LINE} /></g>
          {/* termostato */}
          <circle cx={X + 640} cy={Y + 60} r={36} fill="#2c3a52" stroke={LINE} strokeWidth={3} /><line x1={X + 640} y1={Y + 60} x2={X + 640} y2={Y + 30} stroke={C.gold} strokeWidth={6} />
          {/* corte térmico */}
          <g transform={`translate(${X + 260} ${Y + 120})`}><circle r={22} fill="#bfc6cf" stroke="#222" strokeWidth={3} /><line x1={-10} y1={0} x2={10} y2={-cutOpen * 18} stroke="#222" strokeWidth={5} /></g>
          {/* anti-vuelco */}
          <rect x={X + 360} y={Y + H - 6} width={40} height={20 + (rot > 45 ? 14 : 0)} rx={6} fill={rot > 45 ? GRN : "#bfc6cf"} />
          {/* bornera */}
          <rect x={X + W - 80} y={Y + 370} width={80} height={60} rx={8} fill={termHot > 0.1 ? `rgba(255,${Math.round(160 - 120 * termHot)},40,1)` : "#888"} style={{ filter: termHot > 0.3 ? `drop-shadow(0 0 ${20 * termHot}px ${HOT})` : "none" }} />
        </g>}
        {/* cable */}
        <path d={`M ${X + W} ${Y + 400} C ${X + W + 120} ${Y + 420}, ${X + W + 200} ${Y + 460}, ${X + W + 300} ${Y + 420}`} fill="none" stroke={cordHot ? `rgb(${Math.round(60 + 190 * cordHot)},60,40)` : "#111"} strokeWidth={act === "cord" ? 22 : 16} />
        {act === "cord" && <rect x={X + W - 6} y={Y + 384} width={46} height={34} rx={10} fill={C.gold} />}
        <Dots d={dots} on={pw * (act === "parts" || act === "oil" ? 0 : 1)} col="#ffe066" speed={5} />
        {/* manta */}
        {blanket > 0 && <path d={`M ${X - 40} ${Y - 20} Q ${X + 120} ${Y - 60 + 30 * Math.sin(f / 20)} ${X + 260} ${Y - 10} L ${X + 240} ${Y + H * blanket} Q ${X + 80} ${Y + H * blanket + 40} ${X - 50} ${Y + H * blanket} Z`} fill="#7a5a8c" opacity={0.92} />}
      </g>
      {(L[act] || []).map((l) => lab(l[0], l[1], l[2], l[3], l[4], l[5], l[6]))}
    </svg>
    {warn > 0 && <Stamp text="TOO HOT" at={a(1, dur * 0.6)} x={1500} y={900} />}
  </Bg>;
};

// ==================== lineup — los diez calefactores en el banco: el de este número se ilumina y le cuelga la etiqueta NEVER (roja) o WOULD (verde)
const LINE_NAMES = ["no tip-over", "no cutoff", "no listing", "thin cord", "open coil", "plug-in miracle", "battery heater", "plain ceramic", "oil-filled", "metal fan"];
export const Lineup: React.FC<P & { n: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const w = n <= 7; const col = w ? C.ver : GRN;
  return <Bg>
    <div style={{ position: "absolute", left: 80, right: 80, top: 640, height: 70, background: "#6b4a2a", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    {LINE_NAMES.map((nm, i) => { const on = i + 1 === n, done = i + 1 < n; const lift = on ? -40 * io(f / 14) : 0; const bad = i < 7;
      return <div key={i} style={{ position: "absolute", left: 110 + i * 172, top: 430 + lift, width: 150, height: 210, borderRadius: 14, background: on ? "#3b4a63" : "#252f40", border: `4px solid ${on ? col : "#55606f"}`, opacity: on ? 1 : done ? 0.55 : 0.8, boxShadow: on ? `0 0 40px ${col}` : "none" }}>
        <div style={{ position: "absolute", left: 18, right: 18, top: 24, height: 110, background: `repeating-linear-gradient(90deg, #55606f 0 6px, transparent 6px 14px)`, borderRadius: 8 }} />
        <div style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.paper }}>{i + 1}</div>
        {(on || done) && <div style={{ position: "absolute", top: -64, left: 10, transform: `rotate(${-6 + 3 * Math.sin(f / 18 + i)}deg)`, background: bad ? C.ver : GRN, color: C.paper, fontFamily: SANS, fontWeight: 900, fontSize: 26, padding: "4px 12px", borderRadius: 6 }}>{bad ? "NEVER" : "WOULD"}</div>}
      </div>; })}
    <Big x={960} y={200} at={6} size={110} col={col}>{`No. ${n} · ${w ? "NEVER" : "I WOULD"}`}</Big>
    <Big x={960} y={830} at={16} size={60} col={C.paper}>{LINE_NAMES[n - 1]}</Big>
  </Bg>;
};

// ==================== thermo — el termómetro de pared del procedimiento: 8 marcas, el mercurio sube una por paso
const STEPS = ["read the heater", "the right outlet", "the touch test", "three feet clear", "never unattended", "kids and pets", "clean it", "check the cord"];
export const Thermo: React.FC<P & { n: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const lv = (n - 1 + io(f / 24)) / 8;
  return <Sheet title={`SAFE USE · STEP ${n} OF 8`}>
    <div style={{ position: "absolute", left: 220, top: 60, width: 90, height: 660, borderRadius: 45, background: "#fff", border: `6px solid ${C.ink}` }}>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: 600 * lv, borderRadius: 30, background: C.ver }} /></div>
    <div style={{ position: "absolute", left: 196, top: 700, width: 140, height: 140, borderRadius: 70, background: C.ver, border: `6px solid ${C.ink}` }} />
    {STEPS.map((s, i) => { const y = 690 - (i + 1) * 75; const cur = i + 1 === n; return <div key={i} style={{ position: "absolute", left: 340, top: y - 26, display: "flex", alignItems: "center", gap: 20, opacity: i + 1 <= n ? 1 : 0.3 }}>
      <div style={{ width: 50, height: 6, background: C.ink }} /><div style={{ fontFamily: cur ? HAND : SANS, fontWeight: 700, fontSize: cur ? 62 : 38, color: cur ? CARBON : C.ink }}>{`${i + 1}. ${s}`}</div></div>; })}
  </Sheet>;
};

// ==================== matchbox — la caja de fósforos de los errores: cada error es un fósforo que se raspa y se prende
const MIST = ["the extension cord", "the power strip", "two heaters, one circuit", "a heater on a battery", "a fuel heater indoors"];
export const Matchbox: React.FC<P & { n: number }> = ({ n }) => {
  const f = useCurrentFrame(); const s = io(f / 18);
  return <Bg>
    <div style={{ position: "absolute", left: 200, top: 380, width: 520, height: 300, background: "#b8452a", border: "8px solid #3a1d10", borderRadius: 12 }}>
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, height: 40, background: "repeating-linear-gradient(90deg,#5a3a2a 0 4px,#7a5a40 4px 9px)" }} />
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#ffe2b8" }}>MISTAKE {n}</div></div>
    {MIST.map((t, i) => { const lit = i + 1 <= n, cur = i + 1 === n; const x = 820 + i * 190, sy = cur ? 420 - 120 * s : 300;
      return <div key={i} style={{ position: "absolute", left: x, top: sy, width: 22, height: 330, background: "#e9d3a6", borderRadius: 6 }}>
        <div style={{ position: "absolute", top: -26, left: -9, width: 40, height: 50, borderRadius: "50% 50% 45% 45%", background: lit ? "#3a1d10" : C.ver }} />
        {lit && <div style={{ position: "absolute", top: -96, left: -22, width: 66, height: 90, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 50% 70%, #fff3b0, #ff9a2a 55%, rgba(255,80,0,0) 70%)", transform: `scale(${(cur ? cl(f / 20 - 0.6) : 1) * (1 + 0.08 * Math.sin(f / 3 + i))})` }} />}
      </div>; })}
    <Big x={1240} y={850} at={20} size={66} col={C.paper}>{MIST[n - 1]}</Big>
  </Bg>;
};

// ==================== benchrow — el banco con diez calefactores: siete reciben una X roja, tres una tilde verde
export const BenchRow: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20), b = M(m, 1, dur * 0.55);
  return <Bg>
    <div style={{ position: "absolute", left: 60, right: 60, top: 660, height: 80, background: "#6b4a2a", borderRadius: 8 }} />
    {Array.from({ length: 10 }, (_, i) => { const bad = i < 7; const at = bad ? a + i * 7 : b + (i - 7) * 9; const e = k(f, at, 8);
      return <div key={i} style={{ position: "absolute", left: 90 + i * 176, top: 470, width: 150, height: 190, background: "#2b3547", borderRadius: 14, border: "4px solid #55606f" }}>
        <div style={{ position: "absolute", inset: "22px 18px 60px", background: "repeating-linear-gradient(90deg,#55606f 0 6px,transparent 6px 14px)" }} />
        {e > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: -120, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 120, color: bad ? C.ver : GRN, transform: `scale(${pop(f, at)})` }}>{bad ? "✕" : "✓"}</div>}</div>; })}
    <Big x={560} y={200} at={a} size={84} col={C.ver}>7 · NEVER</Big>
    <Big x={1420} y={200} at={b} size={84} col={GRN}>3 · I WOULD</Big>
  </Bg>;
};

// ==================== odometer — el contador mecánico de los que estuvieron de acuerdo: los rodillos giran hasta 3,000+
export const Odometer: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5); const v = Math.round(3000 * io((f - a) / 50)); const s = String(v).padStart(4, "0");
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 260, background: C.paper, borderRadius: 18, padding: 30, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      <Hand text="&quot;Space heaters cause a huge share of the fires I go to.&quot;" at={4} len={30} size={46} />
      <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#777" }}>— a firefighter, in the comments</div></div>
    <div style={{ position: "absolute", left: 560, top: 560, display: "flex", gap: 14 }}>
      {s.split("").map((d, i) => <div key={i} style={{ width: 150, height: 210, background: "#111", borderRadius: 12, overflow: "hidden", border: `4px solid ${C.gold}`, position: "relative" }}>
        <div style={{ position: "absolute", top: -210 * Number(d) + 0, width: "100%", transition: "none" }}>{Array.from({ length: 10 }, (_, n) => <div key={n} style={{ height: 210, lineHeight: "210px", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 150, color: C.paper }}>{n}</div>)}</div></div>)}
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 150, color: C.gold, alignSelf: "center" }}>+</div></div>
    <Big x={960} y={900} at={a + 20} size={50} col={C.paper}>people agreed</Big>
  </Bg>;
};

// ==================== pieslice — la torta de los incendios por calefacción: la porción de los calefactores se separa y crece a la derecha la de las muertes
export const PieSlice: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15), b = M(m, 1, dur * 0.55);
  const arc = (cx: number, cy: number, r: number, p: number, dx = 0) => { const t = p * Math.PI * 2; return `M ${cx + dx} ${cy} L ${cx + dx} ${cy - r} A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${cx + dx + r * Math.sin(t)} ${cy - r * Math.cos(t)} Z`; };
  const p1 = 0.33 * io((f - a) / 30), p2 = 0.8 * io((f - b) / 30);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <circle cx={560} cy={560} r={280} fill="#3d4f6e" /><path d={arc(560, 560, 280, p1, 30 * k(f, a + 30, 12))} fill={HOT} />
    <circle cx={1360} cy={560} r={280} fill="#3d4f6e" opacity={k(f, b - 10, 10)} /><path d={arc(1360, 560, 280, p2)} fill={C.ver} opacity={k(f, b - 10, 10)} />
    <text x={560} y={930} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill={C.paper} opacity={k(f, a, 10)}>home heating fires</text>
    <text x={1360} y={930} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill={C.paper} opacity={k(f, b, 10)}>heating fire deaths</text>
  </svg><Big x={960} y={140} at={a} size={62} col={C.paper}>the space heater share</Big></Bg>;
};

// ==================== toolbelt — el cinturón de herramientas: cuatro bolsillos; en cada uno entra una de las cuatro cosas
const FOUR = ["TIP-OVER SWITCH", "OVERHEAT CUTOFF", "LISTING MARK", "REAL CORD"];
export const ToolBelt: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame();
  return <Bg>
    <div style={{ position: "absolute", left: 80, right: 80, top: 520, height: 110, background: "#7a4e28", borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    {FOUR.map((t, i) => { const at = M(m, i, 20 + i * (dur / 5)); const e = k(f, at, 14);
      return <div key={i} style={{ position: "absolute", left: 160 + i * 420, top: 560, width: 340, height: 300, background: "#8f5d33", borderRadius: "0 0 40px 40px", border: "6px solid #5a3a1a" }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: -220 + 230 * e, height: 200, background: C.paper, borderRadius: 14, opacity: e, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", whiteSpace: "pre-line", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: C.ink, padding: 10, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>{`${i + 1}\n${t}`}</div></div>; })}
    <Big x={960} y={220} at={4} size={110} col={C.gold}>FOUR THINGS</Big>
  </Bg>;
};

// ==================== longdivision — la cuenta en el pizarrón: 1500 ÷ 120 escrito a tiza, el resultado 12.5 A aparece abajo y se encierra
export const LongDivision: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.6);
  return <AbsoluteFill style={{ background: "#1f3a2c" }}><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,.06), rgba(0,0,0,.5))" }} />
    <Hand text="1,500 W" at={a} size={150} col="#f2f2e8" style={{ position: "absolute", left: 360, top: 220 }} />
    <Hand text="÷ 120 V" at={a + 24} size={150} col="#f2f2e8" style={{ position: "absolute", left: 360, top: 420 }} />
    <div style={{ position: "absolute", left: 340, top: 650, height: 8, width: 1000 * k(f, a + 50, 20), background: "#f2f2e8" }} />
    <Hand text="= 12.5 A" at={b} size={170} col="#ffe066" style={{ position: "absolute", left: 360, top: 690 }} />
    {f > b + 20 && <svg width={1920} height={1080} style={{ position: "absolute" }}><ellipse cx={720} cy={790} rx={400} ry={130} fill="none" stroke="#ffe066" strokeWidth={8} strokeDasharray={2600} strokeDashoffset={2600 * (1 - k(f, b + 20, 24))} /></svg>}
  </AbsoluteFill>;
};

// ==================== measuringcup — la jarra medidora del circuito: 15 A de capacidad, raya roja al 80 % (12 A); el calefactor la llena hasta 12.5
export const MeasuringCup: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.4); const lv = 12.5 * io((f - a) / 40);
  const top = 200, h = 640, y = (v: number) => top + h - (v / 15) * h;
  return <Bg>
    <div style={{ position: "absolute", left: 720, top, width: 480, height: h, border: "8px solid rgba(220,235,255,.9)", borderTop: "none", borderRadius: "0 0 40px 40px", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: (lv / 15) * h, background: "linear-gradient(#ffb070,#e07030)" }} /></div>
    {[3, 6, 9, 12, 15].map((v) => <div key={v} style={{ position: "absolute", left: 600, top: y(v) - 20, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.paper }}>{v} A</div>)}
    <div style={{ position: "absolute", left: 690, top: y(12), width: 560, height: 6, background: C.ver }} />
    <Big x={1500} y={y(12)} at={M(m, 0, 10)} size={48} col={C.ver} anchor="l">80% · 12 A</Big>
    <Big x={1500} y={y(12.5) - 80} at={a + 40} size={48} col={C.gold} anchor="l">heater 12.5 A</Big>
  </Bg>;
};

// ==================== mailslots — los buzones del tablero: un buzón por circuito, una sola carta-calefactor en cada uno; la segunda rebota
export const MailSlots: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 3, dur * 0.7);
  return <Bg>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 240 + i * 380, top: 360, width: 300, height: 380, background: "#3b4a63", borderRadius: 14, border: "5px solid #8a96a8" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 60, height: 22, background: "#111", borderRadius: 6 }} />
      <div style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.paper }}>CIRCUIT {i + 1}</div>
      {(() => { const at = a + i * 12; const e = k(f, at, 14); return <div style={{ position: "absolute", left: 70, top: -200 + 280 * e, width: 160, height: 100, background: C.paper, borderRadius: 8, opacity: e > 0 ? 1 - k(f, at + 14, 8) * 0.0 : 0, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: C.ver, display: "flex", alignItems: "center", justifyContent: "center", clipPath: e > 0.95 ? "inset(0 0 72% 0)" : "none" }}>HEATER</div>; })()}</div>)}
    {f > b && <div style={{ position: "absolute", left: 310, top: 160 + 60 * Math.abs(Math.sin((f - b) / 6)) * Math.exp(-(f - b) / 30), width: 160, height: 100, background: C.paper, borderRadius: 8, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: C.ver, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${-12}deg)` }}>+ ANYTHING</div>}
    <Big x={960} y={180} at={a} size={70} col={C.gold}>one heater per circuit</Big>
  </Bg>;
};

// ==================== icemelt — el bloque de hielo de la estación: 1,000 Wh se derrite bajo el calefactor en 40 min; al lado, la manta apenas gotea
export const IceMelt: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const p = io((f - a) / Math.max(40, dur - a - 30)); const mins = Math.round(40 * p);
  return <Bg dark>
    <div style={{ position: "absolute", left: 360, top: 300 + 360 * p, width: 420, height: 360 * (1 - p) + 4, background: "rgba(190,225,255,.85)", borderRadius: 18, boxShadow: "0 0 40px rgba(150,200,255,.5)" }} />
    <div style={{ position: "absolute", left: 300, top: 660, width: 540, height: 30 + 30 * p, borderRadius: "50%", background: "rgba(120,180,240,.5)" }} />
    <div style={{ position: "absolute", left: 470, top: 150, width: 200, height: 120, background: HOT, borderRadius: 14, opacity: 0.6 + 0.4 * Math.sin(f / 5) }} />
    <Big x={570} y={780} at={a} size={52} col={C.paper}>1,500 W heater</Big>
    <Big x={570} y={880} at={a} size={80} col={C.ver}>{`${mins} min`}</Big>
    <div style={{ position: "absolute", left: 1140, top: 300 + 10 * p, width: 420, height: 360 - 10 * p, background: "rgba(190,225,255,.85)", borderRadius: 18 }} />
    <Big x={1350} y={780} at={a + 30} size={52} col={C.paper}>50 W blanket</Big>
    <Big x={1350} y={880} at={a + 30} size={80} col={GRN}>20 hours</Big>
    <Big x={960} y={110} at={4} size={58} col={C.gold}>1,000 Wh power station</Big>
  </Bg>;
};

// ==================== racers — la carrera con el mismo tanque: el calefactor sale disparado y se queda sin nafta; la manta camina y llega a la mañana
export const Racers: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const t = Math.max(0, f - a);
  const xh = 160 + Math.min(500, t * 18), xb = 160 + Math.min(1400, t * (1400 / Math.max(60, dur - a - 10)));
  const row = (y: number, x: number, lab: string, col: string, fuel: number) => <div key={lab} style={{ position: "absolute", left: 0, top: y, width: 1920 }}>
    <div style={{ position: "absolute", left: 140, right: 140, top: 90, height: 6, background: "rgba(255,255,255,.25)" }} />
    <div style={{ position: "absolute", left: x, top: 0, width: 180, height: 90, background: col, borderRadius: 14, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>{lab}</div>
    <div style={{ position: "absolute", left: 1600, top: 10, width: 200, height: 40, border: "4px solid #fff", borderRadius: 8 }}><div style={{ width: `${100 * fuel}%`, height: "100%", background: fuel > 0.2 ? GRN : C.ver }} /></div></div>;
  return <Bg>
    {row(300, xh, "HEATER", HOT, Math.max(0, 1 - t / 28))}
    {row(600, xb, "BLANKET", COLD, Math.max(0.1, 1 - t / Math.max(60, dur * 2)))}
    {t > 28 && <Big x={xh + 90} y={250} at={a + 28} size={44} col={C.ver}>empty</Big>}
    <Big x={960} y={140} at={4} size={62} col={C.paper}>same battery · warmer per watt</Big>
  </Bg>;
};

// ==================== turnstile — el molinete: los electrones se amontonan para pasar por el alambre fino y el roce lo pone naranja
export const Turnstile: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const g = cl((f - M(m, 1, 30)) / 40);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={100} y={380} width={700} height={320} fill="#2c3a52" /><rect x={1120} y={380} width={700} height={320} fill="#2c3a52" />
    <rect x={800} y={510} width={320} height={60} fill={`rgb(${Math.round(90 + 165 * g)},${Math.round(90 + 50 * g)},60)`} style={{ filter: `drop-shadow(0 0 ${30 * g}px ${HOT})` }} />
    {Array.from({ length: 40 }, (_, i) => { const lane = i % 8, sp = 4 + (i % 5); const x0 = ((f * sp + i * 97) % 1800); const inWire = x0 > 800 && x0 < 1120; const y = inWire ? 540 + (lane - 4) * 4 : 400 + lane * 38; const x = inWire ? 800 + (x0 - 800) * 0.5 : x0;
      return <circle key={i} cx={x} cy={y} r={12} fill="#ffe066" />; })}
  </svg><Big x={960} y={220} at={4} size={62} col={C.paper}>thin wire resists · resistance makes heat</Big></Bg>;
};

// ==================== bimetal — la tira bimetálica: dos metales pegados; al calentarse se curva y abre el contacto
export const Bimetal: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const h = 0.5 + 0.5 * Math.sin((f - M(m, 1, 30)) / 30); const bend = f > M(m, 1, 30) ? h : 0;
  const c = 260 * bend; const path = `M 500 600 Q 900 ${600 - c} 1300 ${600 - 2 * c * 0.6}`;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d={path} fill="none" stroke={COP} strokeWidth={30} /><path d={path} transform="translate(0 30)" fill="none" stroke="#bfc6cf" strokeWidth={30} />
    <rect x={440} y={560} width={70} height={110} fill="#555" /><circle cx={1330} cy={640} r={24} fill={bend > 0.4 ? "#555" : "#ffe066"} />
    <text x={1380} y={660} fontFamily={SANS} fontWeight={800} fontSize={40} fill={bend > 0.4 ? C.ver : GRN}>{bend > 0.4 ? "OPEN" : "CLOSED"}</text>
    <rect x={700} y={820} width={520} height={30} rx={15} fill="#333" /><rect x={700} y={820} width={520 * bend} height={30} rx={15} fill={HOT} />
  </svg><Big x={960} y={200} at={4} size={62} col={C.paper}>two metals · bend when warm</Big></Bg>;
};

// ==================== jigsaw — el rompecabezas: la pieza del anti-vuelco tiene su hueco moldeado, pero la pieza nunca llega
export const Jigsaw: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5); const tr = f > a ? 30 * Math.sin((f - a) / 4) * Math.exp(-(f - a) / 30) : 0;
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={460} y={260} width={1000} height={560} rx={20} fill="#e8e3d6" />
    <path d="M 860 640 h 80 a 40 40 0 0 1 80 0 h 80 v 160 h -240 Z" fill="#2b2117" stroke="#9a8d70" strokeWidth={4} strokeDasharray="12 10" />
    <text x={980} y={330} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.ink}>molded spot · tip-over switch</text>
    <g transform={`translate(${1500 + tr} 380)`} opacity={1 - k(f, a + 40, 20)}><path d="M 0 0 h 80 a 40 40 0 0 1 80 0 h 80 v 160 h -240 Z" fill={GRN} /><text x={120} y={110} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} fill={C.paper}>SWITCH</text></g>
  </svg><Big x={980} y={920} at={a + 30} size={64} col={C.ver}>no switch in it</Big></Bg>;
};

// ==================== unmask — la caja dice una cosa: la tapa de cartón se levanta y adentro el lugar del corte térmico está vacío
export const Unmask: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15); const up = io((f - a) / 24);
  return <Bg>
    <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 520, background: "#2b3547", borderRadius: 16 }}>
      <div style={{ position: "absolute", left: 300, top: 160, width: 200, height: 200, border: `6px dashed ${C.ver}`, borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.ver }}>EMPTY</div></div>
    <div style={{ position: "absolute", left: 540, top: 280 - 520 * up, width: 840, height: 560, background: "#c9a46a", borderRadius: 16, transform: `rotate(${-8 * up}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ border: `8px solid ${C.ink}`, padding: "20px 40px", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.ink }}>OVERHEAT PROTECTION</div></div>
    <Big x={960} y={940} at={a + 30} size={56} col={C.paper}>the box vs. the inside</Big>
  </Bg>;
};

// ==================== lookalike — busque las diferencias: la marca verdadera y la que "se parece"; una lupa encierra las letras que no son
export const Lookalike: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5);
  const seal = (x: number, txt: string, real: boolean) => <div style={{ position: "absolute", left: x, top: 330, width: 380, height: 380, borderRadius: 190, border: `14px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: C.paper }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: C.ink }}>{txt}</div><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.ink }}>{real ? "LISTED" : "LISTD"}</div></div>;
  const r = 140 + 10 * Math.sin(f / 8);
  return <Bg>{seal(420, "TL", true)}{seal(1120, "LT", false)}
    {f > a && <svg width={1920} height={1080} style={{ position: "absolute" }}><circle cx={1310} cy={520} r={r * k(f, a, 12)} fill="none" stroke={C.ver} strokeWidth={10} /></svg>}
    <Big x={610} y={820} at={8} size={50} col={GRN}>a real mark</Big><Big x={1310} y={820} at={a} size={50} col={C.ver}>looks like one · isn't</Big>
  </Bg>;
};

// ==================== chainlink — la cadena: eslabones gruesos, uno finito en el medio que se pone rojo
export const ChainLink: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const g = cl((f - M(m, 1, dur * 0.4)) / 40) * (0.8 + 0.2 * Math.sin(f / 4));
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    {Array.from({ length: 9 }, (_, i) => { const thin = i === 4; return <ellipse key={i} cx={240 + i * 180} cy={540 + 8 * Math.sin(f / 15 + i)} rx={110} ry={60} fill="none" stroke={thin ? `rgb(${Math.round(150 + 105 * g)},${Math.round(150 - 90 * g)},60)` : "#9aa3ad"} strokeWidth={thin ? 8 : 30} style={{ filter: thin && g > 0.3 ? `drop-shadow(0 0 ${25 * g}px ${HOT})` : "none" }} />; })}
  </svg><Big x={960} y={260} at={4} size={58} col={C.paper}>plug → thin wire → switch</Big><Big x={960} y={800} at={M(m, 1, dur * 0.4)} size={70} col={C.ver}>the weak link</Big></Bg>;
};

// ==================== irgun — el termómetro infrarrojo: el punto rojo apunta al cable y la pantalla sube 70 → 140 °F a lo largo de la hora
export const IrGun: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = io(f / Math.max(60, dur - 20)); const t = Math.round(70 + 70 * p); const mins = Math.round(60 * p);
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 100 760 C 600 760, 900 700, 1300 760" fill="none" stroke={`rgb(${Math.round(60 + 180 * p)},50,40)`} strokeWidth={22} />
      <line x1={1250} y1={340} x2={1000} y2={735} stroke="#ff2a2a" strokeWidth={3} opacity={0.8} /><circle cx={1000} cy={735} r={10} fill="#ff2a2a" />
      <path d="M 1250 300 h 360 v 120 h -200 l -40 180 h -80 l 20 -180 h -60 Z" fill="#e8b23a" stroke="#222" strokeWidth={4} />
      <rect x={1420} y={320} width={170} height={80} rx={8} fill="#cfe8c8" />
      <text x={1505} y={378} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={52} fill="#123">{t}°F</text>
    </svg>
    <Big x={420} y={300} at={4} size={56} col={C.paper}>{`on high · ${mins} min`}</Big>
    <Big x={420} y={900} at={M(m, 2, dur * 0.7)} size={64} col={C.ver}>hot at the plug</Big>
  </Bg>;
};

// ==================== feeler — la galga en la rejilla: una regla del ancho de un dedo pasa entre las barras y toca la espiral naranja
export const Feeler: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15); const x = 1500 - 560 * io((f - a) / 40);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d={Array.from({ length: 14 }, (_, i) => `${i ? "L" : "M"} ${600 + (i % 2) * 60} ${300 + i * 36}`).join(" ")} fill="none" stroke="#ff8a3a" strokeWidth={14} style={{ filter: `drop-shadow(0 0 14px ${HOT})` }} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={780} y={250 + i * 90} width={30} height={40} fill="#9aa3ad" />)}
    {Array.from({ length: 7 }, (_, i) => <rect key={"v" + i} x={760} y={250 + i * 90} width={70} height={12} fill="#9aa3ad" />)}
    <rect x={x} y={505} width={700} height={40} rx={8} fill={C.gold} /><text x={x + 350} y={535} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={28} fill={C.ink}>ONE FINGER WIDE</text>
  </svg><Big x={1400} y={800} at={a + 40} size={60} col={C.ver}>curtain · paper · finger · tail</Big></Bg>;
};

// ==================== exchange — la casa de cambio: el cartel promete 500 W → 1,500 W; la tabla verdadera dice 1 W → 1 W, siempre
export const Exchange: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15), b = M(m, 1, dur * 0.5);
  const rowS = (y: number, l: string, r: string, col: string, at: number) => <div key={y} style={{ position: "absolute", left: 460, top: y, width: 1000, height: 120, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 50px", background: "#111", borderRadius: 10, opacity: k(f, at, 10), fontFamily: SANS, fontWeight: 900, fontSize: 70, color: col }}><span>{l}</span><span>→</span><span>{r}</span></div>;
  return <Bg>
    {rowS(260, "500 W", "1,500 W", "#ffd04a", a)}
    {f > b && <div style={{ position: "absolute", left: 420, top: 316, width: 1080 * k(f, b, 12), height: 10, background: C.ver }} />}
    {rowS(480, "1 W in", "1 W of heat", GRN, b + 10)}{rowS(640, "1,500 W", "1,500 W", GRN, b + 30)}
    <Big x={960} y={900} at={b + 40} size={56} col={C.paper}>every heater · about 100 %</Big>
  </Bg>;
};

// ==================== hanger — el cuadro colgado: la caja cuelga del tomacorriente sin cable y el calor se queda pegado a la placa
export const Hanger: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const g = cl(f / Math.max(60, dur * 0.8));
  return <Bg><div style={{ position: "absolute", left: 700, top: 220, width: 520, height: 680, background: "#e8e0cc", borderRadius: 12 }}>
    <div style={{ position: "absolute", left: 140, top: 160, width: 240, height: 360, background: "#fff", border: "4px solid #bbb", borderRadius: 18, boxShadow: `0 0 ${80 * g}px ${40 * g}px rgba(255,110,40,${0.6 * g})` }} />
    <div style={{ position: "absolute", left: 90, top: 250 + 4 * Math.sin(f / 10), width: 340, height: 260, background: "#d8d8d8", borderRadius: 20, border: "5px solid #888", transform: `rotate(${2 * Math.sin(f / 22)}deg)` }}>
      <div style={{ position: "absolute", inset: 40, background: "repeating-linear-gradient(90deg,#999 0 6px,transparent 6px 14px)" }} /></div></div>
    <Big x={1500} y={400} at={8} size={52} col={C.paper} anchor="l">no cord</Big><Big x={1500} y={500} at={M(m, 1, dur * 0.5)} size={52} col={C.ver} anchor="l">the outlet heats</Big>
  </Bg>;
};

// ==================== towel — la toalla cae sobre la cerámica: el reloj cuenta y antes del minuto, click, OFF
export const Towel: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const drop = io((f - a) / 18); const t = Math.max(0, f - a - 18); const sec = Math.min(52, Math.round(t * 1.4)); const off = t > 38;
  return <Bg>
    <div style={{ position: "absolute", left: 640, top: 420, width: 440, height: 420, background: "#3b4a63", borderRadius: 18 }}><div style={{ position: "absolute", inset: 40, background: off ? "#333" : "linear-gradient(#ff9a4a,#e0602a)", borderRadius: 10 }} /></div>
    <div style={{ position: "absolute", left: 600, top: -400 + 800 * drop, width: 520, height: 420, background: "repeating-linear-gradient(0deg,#e8d8c8 0 18px,#d8c4b0 18px 36px)", borderRadius: "10px 10px 40px 40px" }} />
    <div style={{ position: "absolute", left: 1260, top: 400, width: 300, height: 300, borderRadius: 150, background: C.paper, border: `8px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 90, color: C.ink }}>{sec}s</div>
    {off && <Stamp text="CLICK · OFF" at={a + 18 + 38} x={860} y={300} col={GRN} />}
  </Bg>;
};

// ==================== curves — las dos curvas: el de ventilador sube y baja de golpe; el de aceite sube despacio y baja despacio
export const Curves: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = io(f / Math.max(50, dur - 10)); const N = 60;
  const pts = (fn: (t: number) => number) => Array.from({ length: Math.round(N * p) + 1 }, (_, i) => { const t = i / N; return `${i ? "L" : "M"} ${260 + t * 1400} ${820 - 500 * fn(t)}`; }).join(" ");
  const fast = (t: number) => (t < 0.5 ? Math.min(1, t * 8) : Math.max(0, 1 - (t - 0.5) * 8)), slow = (t: number) => (t < 0.5 ? 1 - Math.exp(-t * 6) : (1 - Math.exp(-3)) * Math.exp(-(t - 0.5) * 4));
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <line x1={260} y1={820} x2={1680} y2={820} stroke={LINE} strokeWidth={3} /><line x1={960} y1={280} x2={960} y2={840} stroke="rgba(207,224,255,.4)" strokeDasharray="10 10" strokeWidth={3} />
    <text x={960} y={880} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill={LINE}>switch off</text>
    <path d={pts(fast)} fill="none" stroke={HOT} strokeWidth={8} /><path d={pts(slow)} fill="none" stroke={C.gold} strokeWidth={10} />
    <text x={300} y={260} fontFamily={SANS} fontWeight={800} fontSize={40} fill={HOT}>fan heater</text><text x={300} y={320} fontFamily={SANS} fontWeight={800} fontSize={40} fill={C.gold}>oil-filled · slow up, slow down</text>
  </svg></Bg>;
};

// ==================== blueprintmap — el plano de la casa: se baja una térmica y las habitaciones de ese circuito se apagan en el plano
export const BlueprintMap: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20); const off = f > a;
  const R = [[300, 260, 420, 300, 1], [720, 260, 380, 300, 0], [300, 560, 300, 280, 1], [600, 560, 500, 280, 0], [1100, 260, 420, 580, 2]];
  return <AbsoluteFill style={{ background: BLUEPRINT }}><svg width={1920} height={1080} style={{ position: "absolute" }}>
    {R.map(([x, y, w, h, c], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill={off && c === 1 ? "rgba(0,0,0,.6)" : "rgba(255,230,120,.18)"} stroke={LINE} strokeWidth={4} />
      {[0, 1].map((j) => <circle key={j} cx={x + 40 + j * (w - 80)} cy={y + h - 30} r={12} fill={off && c === 1 ? "#333" : "#ffe066"} />)}</g>)}
    <rect x={1600} y={300} width={180} height={420} rx={10} fill="#2c3a52" stroke={LINE} strokeWidth={3} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1640} y={330 + i * 76} width={100} height={46} rx={6} fill={i === 1 && off ? C.ver : "#9aa3ad"} />)}
    {f > M(m, 1, dur * 0.6) && <text x={1690} y={790} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill="#fff">"bedrooms"</text>}
  </svg><Big x={960} y={140} at={4} size={56} col={C.paper}>which outlets share a circuit</Big></AbsoluteFill>;
};

// ==================== palm — la mano en la placa: media hora a máxima, la palma se apoya y la escala dice tibio o quema
export const Palm: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15); const hot = cl((f - M(m, 2, dur * 0.6)) / 20); const press = io((f - a) / 18);
  return <Bg>
    <div style={{ position: "absolute", left: 720, top: 280, width: 300, height: 480, background: "#fff", border: "5px solid #bbb", borderRadius: 20 }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 100, top: 100 + i * 180, width: 100, height: 120, background: "#eee", border: "3px solid #ccc", borderRadius: 30 }} />)}</div>
    <div style={{ position: "absolute", left: 640, top: 900 - 520 * press, width: 460, height: 560, borderRadius: "200px 200px 120px 120px", background: `rgba(${Math.round(220 + 35 * hot)},${Math.round(170 - 90 * hot)},${Math.round(140 - 100 * hot)},.92)` }} />
    <div style={{ position: "absolute", left: 1260, top: 300, width: 60, height: 480, background: "linear-gradient(#ff3a2a,#ffb03a,#5fd06a)", borderRadius: 30 }} />
    <div style={{ position: "absolute", left: 1240, top: 760 - 440 * (0.35 + 0.6 * hot), width: 100, height: 14, background: "#fff" }} />
    <Big x={1360} y={360} at={8} size={46} col={C.ver} anchor="l">too hot to hold</Big><Big x={1360} y={740} at={8} size={46} col={GRN} anchor="l">warm is normal</Big>
  </Bg>;
};

// ==================== compass — el compás de carpintero: la punta en el calefactor y el lápiz traza el círculo de tres pies; lo que queda adentro se va
export const Compass: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = io(f / Math.max(40, dur * 0.6)); const ang = p * Math.PI * 2; const R = 330, cx = 960, cy = 560;
  const things = [["curtain", -60], ["bed", 30], ["papers", 150], ["clothes", 230]] as const;
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d={`M ${cx} ${cy - R} A ${R} ${R} 0 ${p > 0.5 ? 1 : 0} 1 ${cx + R * Math.sin(ang)} ${cy - R * Math.cos(ang)}`} fill="none" stroke={C.gold} strokeWidth={8} strokeDasharray="20 12" />
    <line x1={cx} y1={cy} x2={cx + R * Math.sin(ang)} y2={cy - R * Math.cos(ang)} stroke="#bfc6cf" strokeWidth={12} /><rect x={cx - 60} y={cy - 50} width={120} height={100} rx={14} fill={HOT} />
    {things.map(([t, d], i) => { const r = (d * Math.PI) / 180, gone = p > 0.6 + i * 0.08; const rr = gone ? R + 160 : R - 90;
      return <text key={t} x={cx + rr * Math.cos(r)} y={cy + rr * Math.sin(r)} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={gone ? GRN : C.ver}>{t}</text>; })}
  </svg><Big x={960} y={110} at={4} size={70} col={C.paper}>3 FEET · ALL AROUND</Big></Bg>;
};

// ==================== dustbunny — el polvo en la rejilla: las pelusas se juntan, se prende la resistencia y cada una larga una chispa y humo
export const DustBunny: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 30);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d={Array.from({ length: 18 }, (_, i) => `${i ? "L" : "M"} ${420 + i * 60} ${560 + (i % 2) * 60}`).join(" ")} fill="none" stroke={f > a ? "#ff8a3a" : "#7a7a7a"} strokeWidth={14} />
    {Array.from({ length: 14 }, (_, i) => { const x = 440 + i * 75, y = 540 + (i % 3) * 30; const lit = f > a + i * 4; return <g key={i}>
      <circle cx={x} cy={y} r={18 + (i % 3) * 5} fill={lit ? "#ffb04a" : "#9a9488"} opacity={lit ? Math.max(0, 1 - (f - a - i * 4) / 30) : 0.9} />
      {lit && <circle cx={x + 6 * Math.sin(f / 7 + i)} cy={y - (f - a - i * 4) * 3} r={14 + (f - a - i * 4) * 0.4} fill="rgba(160,160,160,.35)" />}</g>; })}
  </svg><Big x={960} y={220} at={4} size={70} col={C.paper}>dust burns</Big><Big x={960} y={880} at={a + 30} size={52} col={C.gold}>blow it out first · outside</Big></Bg>;
};

// ==================== rugpeek — la alfombra se levanta de una esquina: abajo, el cable marrón y duro; el calor queda atrapado
export const RugPeek: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15); const up = io((f - a) / 24) * 0.55;
  return <Bg>
    <div style={{ position: "absolute", left: 200, top: 300, width: 1520, height: 560, background: "#8a6a48" }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d="M 200 600 C 700 560, 1200 660, 1720 600" fill="none" stroke="#e8e0d0" strokeWidth={18} />
      <path d="M 760 580 C 860 590, 960 620, 1060 620" fill="none" stroke="#7a4a20" strokeWidth={20} /></svg>
    <div style={{ position: "absolute", left: 300, top: 300, width: 1320, height: 560, background: "repeating-linear-gradient(45deg,#7a2a2a 0 30px,#8f3a30 30px 60px)", border: "10px solid #c9a46a", transformOrigin: "100% 100%", transform: `perspective(1800px) rotateX(${up * 70}deg)` }} />
    <Big x={960} y={180} at={a + 20} size={60} col={C.ver}>you can't see it · the rug traps heat</Big>
  </Bg>;
};

// ==================== melt — la zapatilla que se derrite: la carcasa se ablanda, se comba y las tomas se deforman bajo 12.5 A durante horas
export const Melt: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = cl((f - M(m, 1, dur * 0.3)) / Math.max(40, dur * 0.6)); const hrs = (4 * p).toFixed(1);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d={`M 400 500 Q 960 ${500 + 120 * p} 1520 500 L 1520 640 Q 960 ${640 + 160 * p} 400 640 Z`} fill={`rgb(${Math.round(230 - 30 * p)},${Math.round(230 - 120 * p)},${Math.round(220 - 160 * p)})`} />
    {Array.from({ length: 6 }, (_, i) => { const x = 520 + i * 170; return <g key={i}><rect x={x} y={540 + 60 * p * Math.sin(Math.PI * (i + 0.5) / 6)} width={18} height={40 - 14 * p} fill="#222" /><rect x={x + 40} y={540 + 60 * p * Math.sin(Math.PI * (i + 0.5) / 6)} width={18} height={40 - 14 * p} fill="#222" /></g>; })}
    {p > 0.3 && Array.from({ length: 5 }, (_, i) => <circle key={i} cx={700 + i * 140} cy={480 - ((f + i * 23) % 80) * 2} r={20} fill="rgba(180,180,180,.25)" />)}
  </svg><Big x={960} y={220} at={4} size={56} col={C.paper}>12.5 A · for hours</Big><Big x={960} y={880} at={M(m, 1, dur * 0.3)} size={70} col={C.ver}>{`${hrs} h`}</Big></Bg>;
};

// ==================== bridge — el puente de 15 toneladas: pasa un camión de 12.5 y aguanta; entra el segundo y el tablero se comba
export const Bridge: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.4); const sag = 90 * cl((f - b - 30) / 30);
  const tx1 = 300 + Math.min(500, (f - a) * 10), tx2 = f > b ? -200 + Math.min(900, (f - b) * 18) : -400;
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d={`M 200 620 Q 960 ${620 + sag} 1720 620`} fill="none" stroke="#9aa3ad" strokeWidth={30} /><rect x={160} y={620} width={60} height={300} fill="#666" /><rect x={1700} y={620} width={60} height={300} fill="#666" />
    {[tx1, tx2].map((x, i) => <g key={i} transform={`translate(${x} ${560 + sag * 0.9})`}><rect x={0} y={-80} width={240} height={90} rx={10} fill={i ? C.ver : HOT} /><text x={120} y={-22} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={36} fill="#fff">12.5 A</text></g>)}
  </svg><Big x={960} y={180} at={4} size={62} col={C.paper}>rated 15 A · 25 A on it</Big>
    {sag > 40 && <Big x={960} y={950} at={b + 50} size={56} col={C.ver}>old breaker · wires get hot</Big>}</Bg>;
};

// ==================== canary — el canario de la mina: la jaula al lado de la estufa a propano; el aire se agrisa y el canario se calla
export const Canary: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const g = cl((f - M(m, 0, 10)) / Math.max(40, dur * 0.7));
  return <Bg><AbsoluteFill style={{ background: `rgba(120,120,110,${0.55 * g})` }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {Array.from({ length: 11 }, (_, i) => <line key={i} x1={1060 + i * 34} y1={300} x2={1060 + i * 34} y2={700} stroke="#c9a46a" strokeWidth={6} />)}
      <path d="M 1060 300 Q 1230 160 1400 300" fill="none" stroke="#c9a46a" strokeWidth={8} /><rect x={1040} y={700} width={380} height={24} fill="#c9a46a" />
      <g transform={`translate(1230 ${560 + 60 * g}) rotate(${70 * g})`}><ellipse rx={60} ry={42} fill="#ffd93a" /><circle cx={44} cy={-30} r={26} fill="#ffd93a" /><circle cx={54} cy={-34} r={5} fill="#222" /><path d="M 68 -28 l 18 6 l -18 6 Z" fill={HOT} /></g>
      <rect x={420} y={520} width={260} height={300} rx={20} fill="#3a5a8a" /><circle cx={550} cy={480} r={70} fill="#ff9a3a" opacity={0.8 + 0.2 * Math.sin(f / 4)} />
    </svg>
    <Big x={960} y={140} at={4} size={70} col={C.paper}>carbon monoxide</Big><Big x={960} y={960} at={M(m, 1, dur * 0.6)} size={48} col={C.gold}>indoor-rated · low-oxygen shutoff · CO alarm</Big>
  </Bg>;
};

// ==================== screwback — el tornillo de aluminio: con cada ciclo de calor el tornillo del borne sale un poquito y el borne se pone rojo
export const ScrewBack: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const cyc = Math.floor(f / 40), ph = (f % 40) / 40; const out = Math.min(8, cyc) * 9 + 9 * ph * (ph < 0.5 ? 1 : 0); const hot = cl(cyc / 8);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={700} y={420} width={520} height={260} rx={20} fill="#ddd" /><path d={`M 300 560 L 900 560`} stroke="#c0c4c8" strokeWidth={26} />
    <g transform={`translate(${880 - out} 560) rotate(${cyc * 60 + ph * 60})`}><circle r={60} fill={`rgb(${Math.round(190 + 60 * hot)},${Math.round(190 - 110 * hot)},${Math.round(190 - 140 * hot)})`} stroke="#555" strokeWidth={4} /><rect x={-50} y={-8} width={100} height={16} fill="#555" /></g>
    <rect x={800} y={740} width={320} height={60} rx={10} fill="#333" /><text x={960} y={784} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.paper}>{`heat cycle ${cyc + 1}`}</text>
  </svg><Big x={960} y={200} at={4} size={58} col={C.paper}>aluminum wiring · connections loosen</Big></Bg>;
};

// ==================== diary — la libreta de trabajos de Gary: la hoja de Galion, invierno 2003, se escribe sola
export const Diary: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame();
  return <Sheet title="JOB BOOK · GALION, OHIO" tilt={1.2}>
    <Hand text="Winter 2003" at={6} size={70} style={{ position: "absolute", left: 180, top: 60 }} />
    <Hand text="Harold — kitchen lights flicker" at={30} len={30} size={56} style={{ position: "absolute", left: 180, top: 200 }} />
    <Hand text="smell: warm plastic at the door" at={M(m, 1, dur * 0.6)} len={30} size={56} col={C.ver} style={{ position: "absolute", left: 180, top: 320 }} />
    <svg width={1660} height={800} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M 180 ${520} q 200 -30 400 0 t 400 0`} fill="none" stroke={CARBON} strokeWidth={5} strokeDasharray={900} strokeDashoffset={900 * (1 - k(f, 60, 40))} /></svg>
  </Sheet>;
};

// ==================== menuboard — el pizarrón de precios de la cafetería: las cuatro cuentas honestas, la última sin precio
export const MenuBoard: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const R = [["new outlet · own circuit", "$150–400"], ["worn outlet replaced", "$50–150"], ["good heater · all 4 things", "$35–80"], ["a house fire", "everything"]];
  return <AbsoluteFill style={{ background: "#1c1c1c" }}><div style={{ position: "absolute", left: 260, top: 120, width: 1400, height: 840, border: "18px solid #6b4a2a", background: "#202a24", borderRadius: 10 }}>
    <div style={{ textAlign: "center", marginTop: 40, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#f2f2e8" }}>The honest money</div>
    {R.map(([l, p], i) => { const at = M(m, i, 20 + i * dur / 5); return <div key={i} style={{ position: "absolute", left: 80, right: 80, top: 210 + i * 150, display: "flex", justifyContent: "space-between", opacity: k(f, at, 12), fontFamily: HAND, fontWeight: 700, fontSize: 60, color: i === 3 ? "#ff7a6a" : "#f2f2e8" }}><span>{l}</span><span>{p}</span></div>; })}
  </div></AbsoluteFill>;
};

// ==================== ratingplate — la chapa de la base agrandada: cuatro zonas se iluminan por turno (volts/watts, marca, advertencias, modelo)
export const RatingPlate: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const Z = [["120 V · 1500 W · 12.5 A", 160], ["LISTING MARK", 330], ["WARNINGS · NO EXTENSION CORD · 3 FT", 500], ["MODEL · DATE", 670]] as const;
  const cur = Z.findIndex((_, i) => f < M(m, i + 1, (dur / 4) * (i + 1))); const c = cur < 0 ? 3 : cur;
  return <Bg><div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 820, background: "linear-gradient(135deg,#e4e6e8,#b8bcc0)", borderRadius: 30, boxShadow: "inset 0 0 40px rgba(0,0,0,.25), 0 30px 60px rgba(0,0,0,.5)" }}>
    {[40, 1120].map((x) => [40, 740].map((y) => <div key={`${x}${y}`} style={{ position: "absolute", left: x, top: y, width: 40, height: 40, borderRadius: 20, background: "#888" }} />))}
    {Z.map(([t, y], i) => <div key={i} style={{ position: "absolute", left: 120, right: 120, top: y - 60, height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 50, color: C.ink, borderRadius: 14, border: i === c ? `8px solid ${C.ver}` : "8px solid transparent", opacity: i <= c ? 1 : 0.25 }}>{t}</div>)}
  </div></Bg>;
};

// ==================== dollhouse — la pieza vista desde arriba: cuatro lugares malos se marcan con X y el bueno se enciende en verde
export const DollHouse: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const X: [number, number, string][] = [[520, 220, "doorway"], [960, 200, "under the window"], [1320, 520, "by the bed"], [700, 760, "behind the chair"]];
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={400} y={150} width={1120} height={800} fill="#d9cdb4" stroke="#6b4a2a" strokeWidth={14} /><rect x={440} y={140} width={180} height={24} fill="#d9cdb4" />
    <rect x={820} y={140} width={300} height={24} fill="#9cc4e4" /><rect x={1220} y={420} width={260} height={360} fill="#9a7a9a" /><rect x={620} y={640} width={220} height={180} fill="#7a5a3a" />
    {X.map(([x, y, t], i) => { const at = M(m, i, 10 + i * 30); const e = k(f, at, 8); return e > 0 && <g key={i} opacity={e}><text x={x} y={y + 30} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={110} fill={C.ver}>✕</text><text x={x} y={y + 80} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={C.ink}>{t}</text></g>; })}
    {f > M(m, 4, dur * 0.7) && <g><rect x={445} y={420} width={110} height={90} rx={10} fill={GRN} opacity={0.6 + 0.4 * Math.sin(f / 6)} /><text x={600} y={480} fontFamily={SANS} fontWeight={800} fontSize={34} fill={GRN}>bare wall · 3 ft · hard floor</text></g>}
  </svg></Bg>;
};

// ==================== spotlight — el reflector: el calor de la estufa se desparrama por toda la pieza; el de la manta queda en la cama
export const Spotlight: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 1, dur * 0.4); const sw = k(f, b, 24);
  return <Bg dark>
    <div style={{ position: "absolute", left: 660, top: 520, width: 600, height: 280, background: "#5a4a6a", borderRadius: 20 }} />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 25% 80%, rgba(255,140,60,${0.55 * (1 - sw)}), rgba(255,140,60,0) 70%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 320px 160px at 50% 61%, rgba(255,160,70,${0.75 * sw}), rgba(255,160,70,0))` }} />
    <div style={{ position: "absolute", left: 320, top: 780, width: 120, height: 100, background: HOT, borderRadius: 12, opacity: 1 - sw }} />
    <Big x={960} y={180} at={4} size={62} col={C.paper}>{sw > 0.5 ? "warm the bed · 50–100 W" : "the room · 1,500 W"}</Big>
  </Bg>;
};

// ==================== fooled — el termostato del pasillo engañado: el calefactor le sopla al lado, la aguja marca 72 y los caños de la pared de afuera se escarchan
export const Fooled: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = cl((f - M(m, 0, 10)) / Math.max(40, dur * 0.7)); const t = Math.round(64 + 8 * p);
  return <Bg>
    <div style={{ position: "absolute", left: 300, top: 260, width: 260, height: 260, borderRadius: 130, background: C.paper, border: `8px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 96, color: C.ink }}>{t}°</div>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 22% 50%, rgba(255,140,60,${0.4 * p}), rgba(0,0,0,0) 35%)` }} />
    <div style={{ position: "absolute", left: 1180, top: 160, width: 30, height: 760, background: "#9aa3ad" }}><div style={{ position: "absolute", inset: -6, background: `rgba(220,240,255,${0.85 * p})`, borderRadius: 6 }} /></div>
    <div style={{ position: "absolute", left: 1400, top: 160, width: 30, height: 760, background: "#9aa3ad" }}><div style={{ position: "absolute", inset: -6, background: `rgba(220,240,255,${0.85 * p})`, borderRadius: 6 }} /></div>
    <Big x={430} y={640} at={8} size={46} col={C.paper}>hall thermostat · "warm"</Big><Big x={1300} y={980} at={M(m, 1, dur * 0.5)} size={46} col={COLD}>outside-wall pipes · colder</Big>
  </Bg>;
};

// ==================== coinstack — las pilas de monedas: una moneda de 22¢ por hora cae, 8 por día, la pila del mes llega a $50
export const CoinStack: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const n = Math.min(30, Math.floor(f / Math.max(4, (dur - 40) / 30)));
  const L = [[M(m, 0, 10), "1.5 kWh / hour"], [M(m, 1, 60), "× 15¢ = 22¢ / hour"], [M(m, 2, 120), "8 h = $1.75 / day"], [M(m, 3, 180), "30 days ≈ $50"]] as const;
  return <Bg>
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: 360 + (i % 3) * 8, top: 860 - i * 20, width: 260, height: 26, borderRadius: "50%", background: "linear-gradient(#e8c060,#b08a30)", border: "2px solid #7a5a1a" }} />)}
    {L.map(([at, t], i) => <div key={i} style={{ position: "absolute", left: 820, top: 260 + i * 140, opacity: k(f, at, 10), fontFamily: SANS, fontWeight: 900, fontSize: 64, color: i === 3 ? C.gold : C.paper }}>{t}</div>)}
  </Bg>;
};

// ==================== tripflag — la térmica disparada: la palanca queda en el medio con la banderita naranja; la mano la lleva a OFF y después a ON
export const TripFlag: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.4), b = M(m, 2, dur * 0.7);
  const pos = f < a ? 0.5 : f < b ? 0.5 + 0.5 * io((f - a) / 14) : 1 - io((f - b) / 14);
  return <Bg dark>
    <div style={{ position: "absolute", left: 760, top: 200, width: 400, height: 680, background: "#2c3a52", borderRadius: 16, border: "6px solid #9aa3ad" }}>
      <div style={{ position: "absolute", left: 130, top: 120, width: 140, height: 440, background: "#111", borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 120, top: 140 + 320 * pos, width: 160, height: 100, background: "#ddd", borderRadius: 12 }} />
      {pos > 0.4 && pos < 0.6 && <div style={{ position: "absolute", left: 300, top: 300, width: 60, height: 60, background: "#ff8a2a", borderRadius: 8 }} />}
      <div style={{ position: "absolute", left: 300, top: 120, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: GRN }}>ON</div><div style={{ position: "absolute", left: 300, top: 520, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.ver }}>OFF</div></div>
    <Big x={1500} y={400} at={8} size={52} col={C.paper}>{f < a ? "in the middle" : f < b ? "firmly OFF" : "then ON"}</Big>
  </Bg>;
};

// ==================== dinnerplate — el plato sobre el acolchado: el contorno del agujero quemado coincide con un plato de comida
export const DinnerPlate: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.4); const e = io((f - a) / 24);
  return <Bg>
    <div style={{ position: "absolute", left: 300, top: 200, width: 1320, height: 700, background: "repeating-linear-gradient(90deg,#c9b8d8 0 60px,#b8a4c8 60px 120px)", borderRadius: 30 }} />
    <div style={{ position: "absolute", left: 760, top: 340, width: 400, height: 400, borderRadius: 200, background: "radial-gradient(circle,#2a1a10 40%,#7a4a20 70%,rgba(122,74,32,0) 75%)" }} />
    <div style={{ position: "absolute", left: 760, top: 340 - 500 * (1 - e), width: 400, height: 400, borderRadius: 200, background: "#fff", border: "14px solid #ddd", opacity: 0.85 * e }} />
    <Big x={960} y={960} at={a + 20} size={56} col={C.paper}>the size of a dinner plate</Big>
  </Bg>;
};

// ==================== marquee — la marquesina del repaso: las letras del cartel de cine se prenden de a una línea, las 4 cosas arriba y la regla abajo
export const Marquee: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const R = ["TIP-OVER SWITCH", "OVERHEAT CUTOFF", "LISTING MARK ON THE HEATER", "THICK CORD · STRAIN RELIEF"];
  return <AbsoluteFill style={{ background: "#120e0a" }}><div style={{ position: "absolute", left: 200, top: 120, width: 1520, height: 840, background: "#f4ecd8", borderRadius: 20, border: "24px solid #b8733a" }}>
    {Array.from({ length: 28 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + (i % 14) * 106, top: i < 14 ? -18 : 784, width: 22, height: 22, borderRadius: 11, background: (Math.floor(f / 6) + i) % 3 ? "#ffe9a0" : "#7a5a2a" }} />)}
    <div style={{ textAlign: "center", marginTop: 50, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: C.ver, letterSpacing: 6 }}>FOUR THINGS</div>
    {R.map((t, i) => { const at = M(m, i, 20 + i * (dur / 5)); return <div key={i} style={{ textAlign: "center", marginTop: 26, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: C.ink, opacity: k(f, at, 6) }}>{t}</div>; })}
  </div></AbsoluteFill>;
};

// ---------- overlays de una sola vez (sobre material real)
export const WattTag: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", right: 140, top: 140, opacity: o, background: "#f4ecd8", border: `6px solid ${C.ink}`, borderRadius: 12, padding: "14px 30px", fontFamily: SANS, fontWeight: 900, fontSize: 48, color: C.ink, transform: `rotate(${2 * Math.sin(f / 20)}deg)` }}>{text}</div>;
};
export const TapeRing: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const p = k(f, 4, 30);
  return <div style={{ position: "absolute", left: 140, bottom: 120, opacity: o, display: "flex", alignItems: "center", gap: 24 }}><svg width={200} height={200}><circle cx={100} cy={100} r={80} fill="none" stroke="#ff8a1a" strokeWidth={22} strokeDasharray={503} strokeDashoffset={503 * (1 - p)} /></svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: "0 3px 12px #000" }}>{text}</div></div>;
};
export const CoBadge: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const on = f % 30 < 15;
  return <div style={{ position: "absolute", right: 160, bottom: 140, opacity: o, display: "flex", alignItems: "center", gap: 20, background: "rgba(245,245,240,.95)", padding: "18px 30px", borderRadius: 60 }}>
    <div style={{ width: 34, height: 34, borderRadius: 17, background: on ? GRN : "#1a3a1a" }} /><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink }}>{text}</div></div>;
};

// ---------- despacho de los planos C
export const CompC: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const c: string = s.comp, m: number[] = s.m || [];
  if (c.startsWith("cut:")) return <HeaterCut act={c.slice(4)} m={m} dur={dur} />;
  if (c.startsWith("lineup:")) return <Lineup n={Number(c.slice(7))} m={m} dur={dur} />;
  if (c.startsWith("thermo:step")) return <Thermo n={Number(c.slice(11))} m={m} dur={dur} />;
  if (c.startsWith("matchbox:")) return <Matchbox n={Number(c.slice(9))} m={m} dur={dur} />;
  const T: Record<string, React.FC<P>> = { benchrow: BenchRow, odometer: Odometer, pieslice: PieSlice, toolbelt: ToolBelt, longdivision: LongDivision, measuringcup: MeasuringCup, mailslots: MailSlots, icemelt: IceMelt, racers: Racers, turnstile: Turnstile, bimetal: Bimetal, jigsaw: Jigsaw, unmask: Unmask, lookalike: Lookalike, chainlink: ChainLink, irgun: IrGun, feeler: Feeler, exchange: Exchange, hanger: Hanger, towel: Towel, curves: Curves, blueprintmap: BlueprintMap, palm: Palm, compass: Compass, dustbunny: DustBunny, rugpeek: RugPeek, melt: Melt, bridge: Bridge, canary: Canary, screwback: ScrewBack, diary: Diary, menuboard: MenuBoard, ratingplate: RatingPlate, dollhouse: DollHouse, spotlight: Spotlight, fooled: Fooled, coinstack: CoinStack, tripflag: TripFlag, dinnerplate: DinnerPlate, marquee: Marquee };
  const X = T[c]; return X ? <X m={m} dur={dur} /> : null;
};
