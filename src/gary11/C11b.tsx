// gary11b · componentes propios (agua caliente sin luz). Mismo look de la serie: hoja de trabajo crema, tinta carbónica, sello rojo,
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
const Sheet: React.FC<{ title: string; no?: string; children?: React.ReactNode; tilt?: number }> = ({ title, no = "11B", children, tilt = -1 }) => {
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

// ==================== cutaway — EL CALEFÓN PARTIDO AL MEDIO (vuelve 9 veces, cada vez con una acción nueva)
export const HeaterCut: React.FC<P & { act: string }> = ({ act, m, dur }) => {
  const f = useCurrentFrame();
  const a = (i: number, d: number) => M(m, i, d);
  const X0 = 760, X1 = 1160, Y0 = 210, Y1 = 900; // tanque interior
  const gas = !["elec", "dry", "reheat"].includes(act), vent = act === "vent";
  // nivel de agua (0..1) y temperatura (0 frío .. 1 caliente)
  let lvl = 1, temp = 0.85, flame = gas ? 1 : 0, elTop = 0, elBot = 0, fan = 0, coBack = 0, valveOpen = 1, coldIn = 0, drainOut = 0, airIn = 0;
  if (act === "gas") flame = k(f, 4, 10);
  if (act === "pilot") { flame = f > a(3, dur * 0.7) ? k(f, a(3, dur * 0.7), 8) : 0; }
  if (act === "vent") { const off = a(2, dur * 0.6); fan = f < off ? 1 : 1 - k(f, off, 10); flame = f < off ? 1 : 1 - k(f, off + 6, 8); coBack = f > a(3, dur * 0.8) ? k(f, a(3, dur * 0.8), 14) : 0; }
  if (act === "elec") { elTop = k(f, a(1, 30), 10); elBot = k(f, a(2, 50), 10); }
  if (act === "dry") { lvl = 1 - io(f / Math.max(20, a(0, dur * 0.4))); elTop = 1; }
  if (act === "reheat") { elTop = 1; elBot = 1; temp = io(f / Math.max(30, dur - 10)) * 0.85; }
  if (act === "dip") { const o = a(0, 20); coldIn = k(f, a(1, o + 20), 10); temp = 0.85 - 0.45 * io((f - a(1, o + 20)) / 70); }
  if (act === "full") { temp = 0.85 - 0.5 * io((f - a(3, dur * 0.7)) / 30); }
  if (act === "drain") { valveOpen = 1 - k(f, 4, 10); flame = 0; airIn = k(f, 22, 10); drainOut = k(f, a(1, 50), 10); lvl = 1 - 0.35 * io((f - a(1, 50)) / 80); }
  const wTop = Y0 + (Y1 - Y0) * (1 - lvl);
  const tc = (t: number) => `rgb(${Math.round(60 + 190 * t)},${Math.round(120 - 40 * t)},${Math.round(230 - 170 * t)})`;
  const lab = (txt: string, at: number, x: number, y: number, tx: number, ty: number, col = LINE) => {
    const e = k(f, at, 10); if (e <= 0) return null;
    return <g opacity={e}><line x1={x} y1={y} x2={x + (tx - x) * e} y2={y + (ty - y) * e} stroke={col} strokeWidth={3} /><circle cx={x} cy={y} r={7} fill={col} />
      <text x={tx + (tx > x ? 14 : -14)} y={ty + 12} textAnchor={tx > x ? "start" : "end"} fontFamily={SANS} fontWeight={800} fontSize={36} fill={col} letterSpacing={2}>{txt}</text></g>;
  };
  const T: Record<string, [string, number, number, number, number, number, string?][]> = {
    gas: [["BURNER", a(0, 10), 960, 950, 1380, 990], ["FLUE", a(1, 40), 960, 520, 1380, 430], ["EXHAUST OUT", a(2, 70), 960, 150, 1380, 120], ["WATER ALL AROUND", a(3, 100), 860, 640, 480, 700]],
    pilot: [["THERMOCOUPLE", a(0, 10), 900, 950, 480, 1000], ["≈ 0.03 V", a(1, 40), 840, 960, 480, 880], ["GAS VALVE · HELD OPEN", a(1, 50), 760, 820, 480, 760]],
    vent: [["FAN ON TOP", a(0, 10), 960, 140, 1380, 120], ["NO FAN = NO FLAME", a(2, 80), 960, 950, 1380, 990]],
    elec: [["UPPER ELEMENT · 4,500 W", a(1, 30), 800, 380, 1380, 330], ["LOWER ELEMENT · 4,500 W", a(2, 50), 800, 770, 1380, 830], ["OWN THERMOSTAT", a(3, 80), 740, 460, 480, 460]],
    dry: [["NO WATER", a(0, 20), 960, 500, 1380, 440], ["BURNS OUT IN SECONDS", a(1, 60), 800, 380, 480, 300, C.ver]],
    reheat: [["FULL TANK FROM COLD", a(1, 20), 960, 600, 1380, 600], ["≈ 1 HOUR", a(0, 40), 960, 200, 1380, 200]],
    dip: [["HOT OUT THE TOP", a(0, 10), 1080, 160, 1380, 110], ["COLD IN AT THE BOTTOM", a(1, 30), 870, 860, 480, 900]],
    full: [["TAP RUNS COLD…", a(0, 10), 1080, 160, 1380, 110], ["…BUT 40–50 GAL STILL INSIDE", a(2, 50), 960, 560, 1380, 600]],
    drain: [["1 · HEATER OFF", 4, 760, 960, 480, 960], ["2 · COLD VALVE CLOSED", 14, 860, 150, 480, 110], ["3 · HOT TAP OPEN · AIR IN", 22, 1080, 150, 1380, 110], ["4 · DRAIN VALVE", a(0, 40), 1150, 900, 1380, 990]],
  };
  // gotas que suben de calor / bajan de frío
  const dots = Array.from({ length: 26 }, (_, i) => { const x = X0 + 30 + ((i * 137) % (X1 - X0 - 60)); const sp = 0.6 + (i % 5) * 0.25; const y = Y1 - (((f * sp * 3 + i * 53) % (Y1 - wTop - 20)) + 10);
    return <circle key={i} cx={x} cy={y} r={5} fill={temp > 0.5 ? "#ffd2a8" : "#cfe8ff"} opacity={0.55 * lvl} />; });
  const elGlow = (y: number, on: number) => on <= 0 ? null : <g><rect x={X0 - 40} y={y - 14} width={360 * on} height={28} rx={14} fill={act === "dry" && lvl < 0.3 ? "#fff6d0" : HOT} style={{ filter: `drop-shadow(0 0 ${18 * on}px ${HOT})` }} />
    {act === "dry" && lvl < 0.25 && f % 7 < 3 && <path d={`M ${X0 + 300} ${y - 30} l 20 30 l -26 4 l 22 34`} stroke="#fff" strokeWidth={5} fill="none" />}</g>;
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><pattern id="grd" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(207,224,255,.07)" strokeWidth={2} /></pattern></defs>
      <rect width={1920} height={1080} fill="url(#grd)" />
      {/* camisa + espuma */}
      <rect x={X0 - 70} y={Y0 - 70} width={X1 - X0 + 140} height={Y1 - Y0 + 120} rx={60} fill="#e8e6df" stroke={LINE} strokeWidth={4} />
      <rect x={X0 - 40} y={Y0 - 40} width={X1 - X0 + 80} height={Y1 - Y0 + 60} rx={44} fill="#f4d36a" opacity={0.85} />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={X0 - 25 + ((i * 97) % (X1 - X0 + 50))} cy={Y0 - 25 + ((i * 61) % (Y1 - Y0 + 30))} r={6} fill="#e0b84a" />)}
      {/* tanque */}
      <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx={30} fill="#1d2a44" stroke={LINE} strokeWidth={4} />
      <rect x={X0 + 4} y={wTop} width={X1 - X0 - 8} height={Math.max(0, Y1 - wTop - 4)} rx={26} fill={tc(temp)} opacity={0.9} />
      {coldIn > 0 && <rect x={X0 + 4} y={Y1 - 4 - (Y1 - Y0) * 0.45 * coldIn} width={X1 - X0 - 8} height={(Y1 - Y0) * 0.45 * coldIn} rx={26} fill={COLD} opacity={0.55} />}
      {dots}
      {/* chimenea central (gas) */}
      {gas && <rect x={940} y={Y0 - 90} width={40} height={Y1 - Y0 + 150} fill="#3a4a66" stroke={LINE} strokeWidth={3} />}
      {gas && <Dots d={`M 960 ${Y1 + 40} L 960 ${Y0 - 140}`} on={flame * (1 - coBack)} col={HOT} speed={5} />}
      {gas && coBack > 0 && <Dots d={`M 960 ${Y0 - 100} L 960 ${Y1 + 40} L 600 ${Y1 + 60}`} on={coBack} col="#b0b0b0" speed={4} w={12} />}
      {/* quemador + piloto */}
      {gas && <g><rect x={880} y={Y1 + 40} width={160} height={14} rx={7} fill="#777" />
        {flame > 0 && Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${890 + i * 22} ${Y1 + 40} q 8 ${-30 - 8 * Math.sin(f / 3 + i)} 16 0`} fill="#4aa8ff" opacity={flame} style={{ filter: "drop-shadow(0 0 8px #4aa8ff)" }} />)}
        <path d={`M 860 ${Y1 + 44} q 6 ${-22 - 4 * Math.sin(f / 2)} 12 0`} fill="#7cc4ff" style={{ filter: "drop-shadow(0 0 6px #7cc4ff)" }} />
        <line x1={872} y1={Y1 + 40} x2={800} y2={Y1 + 70} stroke={act === "pilot" ? COP : "#999"} strokeWidth={8} />
        <rect x={700} y={Y1 - 110} width={90} height={110} rx={12} fill={act === "drain" ? "#444" : "#555"} stroke={LINE} strokeWidth={3} />
        <circle cx={745} cy={Y1 - 55} r={24} fill="#c9c9c9" transform={`rotate(${valveOpen * 90} 745 ${Y1 - 55})`} /><rect x={741} y={Y1 - 79} width={8} height={48} fill="#333" transform={`rotate(${valveOpen * 90} 745 ${Y1 - 55})`} />
        {act === "pilot" && <Dots d={`M 800 ${Y1 + 70} L 745 ${Y1 - 10}`} on={k(f, a(1, 40), 10)} col="#ffe066" speed={2} w={8} />}
      </g>}
      {/* ventilador arriba (power vent) */}
      {vent && <g><rect x={900} y={Y0 - 190} width={120} height={90} rx={10} fill="#666" stroke={LINE} strokeWidth={3} />
        {[0, 1, 2].map((i) => <line key={i} x1={960} y1={Y0 - 145} x2={960 + 36 * Math.cos(f * fan * 0.5 + i * 2.1)} y2={Y0 - 145 + 36 * Math.sin(f * fan * 0.5 + i * 2.1)} stroke="#ddd" strokeWidth={8} />)}
        {fan < 0.5 && <g stroke={C.ver} strokeWidth={10}><line x1={910} y1={Y0 - 180} x2={1010} y2={Y0 - 110} /><line x1={1010} y1={Y0 - 180} x2={910} y2={Y0 - 110} /></g>}</g>}
      {/* resistencias (eléctrico) */}
      {!gas && <g>{elGlow(380, elTop)}{elGlow(770, elBot)}
        <rect x={X0 - 70} y={350} width={40} height={60} fill="#bbb" /><rect x={X0 - 70} y={740} width={40} height={60} fill="#bbb" /></g>}
      {/* caños: frío con tubo de inmersión, caliente arriba, válvula de purga */}
      <rect x={850} y={Y0 - 150} width={22} height={act === "dip" || act === "drain" ? 660 : 120} fill={COLD} opacity={0.75} />
      <rect x={1050} y={Y0 - 150} width={22} height={120} fill={HOT} opacity={0.8} />
      {coldIn > 0 && <Dots d={`M 861 ${Y0 - 140} L 861 ${Y0 + 500} L 980 ${Y1 - 30}`} on={coldIn} col={COLD} speed={5} />}
      {airIn > 0 && <Dots d={`M 1061 ${Y0 - 200} L 1061 ${Y0 - 20}`} on={airIn} col="#ffffff" speed={-4} w={7} />}
      {act === "drain" && <g stroke={C.ver} strokeWidth={9} opacity={k(f, 14, 8)}><line x1={830} y1={Y0 - 130} x2={892} y2={Y0 - 80} /><line x1={892} y1={Y0 - 130} x2={830} y2={Y0 - 80} /></g>}
      <rect x={X1 + 60} y={Y1 - 20} width={60} height={34} rx={8} fill={COP} />
      {drainOut > 0 && <Dots d={`M ${X1 + 120} ${Y1 - 3} q 80 0 110 140`} on={drainOut} col={COLD} speed={6} w={14} />}
      {(T[act] || []).map(([t, at, x, y, tx, ty, col]) => <React.Fragment key={t}>{lab(t, at, x, y, tx, ty, col as any)}</React.Fragment>)}
    </svg>
    {act === "vent" && <Stamp text="SAFETY" at={a(1, 50)} x={420} y={240} />}
    {act === "pilot" && <Stamp text="NO HOUSE POWER" at={a(2, 70)} x={420} y={240} col={GRN} />}
    {act === "dry" && <Stamp text="$150–300 CALL" at={Math.min(dur - 14, a(1, 60) + 20)} x={420} y={240} />}
    {act === "reheat" && <Big x={420} y={240} at={10} size={90} col={C.gold}>{Math.round(io(f / Math.max(30, dur - 10)) * 60)} min</Big>}
  </Bg>;
};

// ==================== frostmirror — el espejo del baño se escarcha desde los bordes; un dedo escribe DAY 2
export const FrostMirror: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const fr = io(f / Math.max(20, dur * 0.7));
  const blobs = Array.from({ length: 30 }, (_, i) => { const ang = (i / 30) * Math.PI * 2; const r = 520 - 300 * fr * (0.7 + ((i * 37) % 10) / 30);
    return <circle key={i} cx={960 + Math.cos(ang) * 720} cy={520 + Math.sin(ang) * 420} r={Math.max(0, 760 - r)} fill="rgba(235,245,255,.20)" />; });
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 800, borderRadius: 20, background: "linear-gradient(160deg,#3d4a5c,#1f2836)", border: "18px solid #b8b2a4", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 180 + i * 60, top: ((f * 9 + i * 77) % 820) - 40, width: 4, height: 30, background: "rgba(180,210,255,.5)", borderRadius: 2 }} />)}
      <svg width={1200} height={800} style={{ position: "absolute", left: -360, top: -120 }}>{blobs}</svg>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, transparent ${70 - fr * 55}%, rgba(225,238,255,.85) ${100 - fr * 40}%)` }} />
      <Hand text="DAY 2" at={Math.round(dur * 0.45)} len={16} size={190} col="rgba(40,60,90,.55)" style={{ position: "absolute", left: 360, top: 280 }} />
    </div>
    <Big x={1640} y={900} at={8} size={64} col={COLD} font={SANS}>52°F</Big>
  </Bg>;
};

// ==================== envelope — tres sobres cerrados; cada uno se abre en su frase
export const Envelope: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const T = ["WORKS WITH NO POWER?", "WHAT IT NEEDS", "NEVER ON A BATTERY"];
  return <Bg>{T.map((t, i) => { const a = M(m, i, 20 + i * 60); const op = io((f - a) / 14); const up = k(f, a + 10, 14);
    return <div key={i} style={{ position: "absolute", left: 170 + i * 560, top: 380, width: 480, height: 320 }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 40 - up * 230, height: 300, background: C.paper, boxShadow: "0 10px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: i === 2 ? C.ver : C.ink, lineHeight: 1.05 }}>{t}</div></div>
      <div style={{ position: "absolute", inset: 0, background: "#d8c7a0", boxShadow: "0 30px 60px rgba(0,0,0,.5)", clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 180, background: "#cbb98f", transformOrigin: "50% 0", transform: `perspective(800px) rotateX(${op * 175}deg)`, clipPath: "polygon(0 0, 100% 0, 50% 100%)", zIndex: op > 0.5 ? 0 : 2 }} />
      <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: HAND, fontSize: 48, color: CARBON }}>{i + 1}</div></div>; })}
  </Bg>;
};

// ==================== thermos — el tanque es un termo: el calor rebota adentro y casi no se escapa
export const Thermos: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const leak = Math.floor(f / 20);
  return <Bg dark>
    <div style={{ position: "absolute", left: 700, top: 120, width: 520, height: 840, borderRadius: "120px 120px 60px 60px", background: "linear-gradient(90deg,#9aa3ad,#e9edf0 40%,#8b939c)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 60, bottom: 50, borderRadius: "90px 90px 40px 40px", background: "#f2d16b" }} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 100, bottom: 90, borderRadius: "70px 70px 30px 30px", background: "linear-gradient(180deg,#ff8a3d,#d94f2b)", overflow: "hidden" }}>
        {Array.from({ length: 34 }, (_, i) => { const t = f * (0.7 + (i % 4) * 0.2) + i * 40; const x = 20 + Math.abs(((t * 3.1) % 600) - 300) * 0.98; const y = 20 + Math.abs(((t * 2.3 + i * 30) % 1200) - 600);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 18, borderRadius: 9, background: "#ffe1b8", opacity: 0.85 }} />; })}</div>
    </div>
    {Array.from({ length: Math.min(6, leak) }, (_, i) => { const t = (f - i * 20) / 40; return <div key={i} style={{ position: "absolute", left: 1230 + t * 140, top: 300 + i * 90 - t * 30, width: 16, height: 16, borderRadius: 8, background: "#ffd2a8", opacity: cl(1 - t / 3) }} />; })}
    <Big x={360} y={300} at={M(m, 0, 10)} size={78} col={C.gold}>50 GAL</Big>
    <Big x={360} y={400} at={M(m, 0, 16)} size={46} font={SANS}>= a big thermos</Big>
    <Big x={1580} y={560} at={M(m, 1, dur * 0.5)} size={84}>1 day</Big>
    <Big x={1580} y={680} at={M(m, 2, dur * 0.75)} size={60} col={C.gold}>sometimes 2</Big>
  </Bg>;
};

// ==================== bucket — corte del balde: la resistencia, el termómetro 50→100 °F, el reloj y el tercio de kWh
export const Bucket: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 20), a1 = M(m, 1, 60), a2 = M(m, 2, 120), a3 = M(m, 3, 180);
  const t = io((f - a0) / Math.max(20, a1 - a0 + 30)); const deg = Math.round(50 + 50 * t); const min = Math.round(cl((f - a3) / 40) * 30);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 560 300 L 620 900 Q 800 940 980 900 L 1040 300 Z" fill="rgba(255,255,255,.12)" stroke="#f2f2f2" strokeWidth={8} />
      <path d={`M 575 420 L 620 900 Q 800 940 980 900 L 1025 420 Z`} fill={`rgb(${Math.round(80 + 150 * t)},${Math.round(150 - 50 * t)},${Math.round(230 - 150 * t)})`} opacity={0.75} />
      <path d="M 980 260 L 980 330 L 860 330 L 860 760" fill="none" stroke="#bbb" strokeWidth={14} />
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={860} cy={640 + i * 22} rx={70} ry={12} fill="none" stroke={t > 0.05 ? HOT : "#aaa"} strokeWidth={10} style={{ filter: t > 0.05 ? `drop-shadow(0 0 ${10 * t}px ${HOT})` : "none" }} />)}
      <path d="M 980 260 Q 1200 200 1300 360" fill="none" stroke="#222" strokeWidth={10} />
      {Array.from({ length: 10 }, (_, i) => { const y = 420 - ((f * 2 + i * 40) % 160) * t; return <circle key={i} cx={640 + i * 38} cy={y} r={8} fill="rgba(255,255,255,.4)" opacity={t} />; })}
    </svg>
    <div style={{ position: "absolute", left: 1180, top: 420, width: 60, height: 460, borderRadius: 30, background: "#eee", border: "6px solid #999" }}>
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: 120 + 300 * t, borderRadius: 20, background: C.ver }} /></div>
    <Big x={1400} y={500} at={a0} size={110} col={deg > 90 ? HOT : C.paper} anchor="l">{deg}°F</Big>
    <Big x={1400} y={650} at={a2} size={72} col={C.gold} anchor="l">⅓ kWh</Big>
    <Big x={1400} y={780} at={a3} size={72} anchor="l">{min} min · 1,000 W</Big>
    <Big x={300} y={200} at={6} size={56} font={SANS} anchor="l">3 GAL</Big>
    {dur > 0 && null}
  </Bg>;
};

// ==================== tug — cinchada: la resistencia de 37 A arrastra a la estación de 1.000 W y la apaga
export const Tug: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 15), a1 = M(m, 1, dur * 0.6);
  const drag = io((f - a0) / Math.max(20, a1 - a0)) * 520; const off = f > a1;
  return <Bg>
    <div style={{ position: "absolute", left: 958, top: 200, width: 6, height: 700, background: C.ver }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M ${400 - drag * 0.3} 560 Q 960 ${600 + 10 * Math.sin(f / 3)} ${1500 - drag} 560`} stroke="#c9a46a" strokeWidth={22} fill="none" strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", left: 160 - drag * 0.3, top: 420, width: 280, height: 300, background: "#f0f0ea", borderRadius: 18, boxShadow: "0 20px 50px rgba(0,0,0,.6)", textAlign: "center", paddingTop: 40 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: C.ink }}>ELEMENT</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ver }}>37 A</div>
      <div style={{ fontFamily: SANS, fontSize: 34, color: C.ink }}>4,500 W · 240 V</div></div>
    <div style={{ position: "absolute", left: 1500 - drag, top: 440, width: 300, height: 260, background: "#2b2b2b", borderRadius: 22, boxShadow: "0 20px 50px rgba(0,0,0,.6)", transform: `rotate(${-6 * cl(drag / 300)}deg)` }}>
      <div style={{ margin: 30, height: 90, borderRadius: 10, background: off ? "#111" : "#9fe0a8", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: off ? C.ver : "#123", display: "flex", alignItems: "center", justifyContent: "center" }}>{off ? "OFF" : "1,000 W"}</div>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: C.paper }}>POWER STATION</div></div>
    <Stamp text="NOT A BATTERY JOB" at={a1 + 6} x={960} y={150} />
  </Bg>;
};

// ==================== binder — la carpeta de anillos: sale la solapa del paso N y se abre la hoja
const STEPS_B = ["Know which kind you have", "Pilot: leave it lit", "Power vent / tankless: station", "Electric: save the hot water", "Set up the bucket", "Plug into a GFCI", "Watch clock + thermometer", "Shower, outside the tub"];
export const Binder: React.FC<P & { n: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const pull = k(f, 4, 12), open = io((f - 14) / 14);
  const TABC = ["#c62a22", "#b8733a", "#d9b23a", "#3f9d5a", "#2f5fa8", "#5b3f8f", "#13213a", "#7a5a3a"];
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 140, width: 1100, height: 800, background: "#1d3354", borderRadius: 18, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40, top: 160 + i * 240, width: 60, height: 60, borderRadius: 30, border: "10px solid #c8c8c8" }} />)}
      <div style={{ position: "absolute", left: 120, top: 40, right: 60, bottom: 40, background: C.paper, borderRadius: 6, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-(1 - open) * 70}deg)` }}>
        <div style={{ position: "absolute", left: 60, top: 60, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.gold, letterSpacing: 6 }}>STEP {n} OF 8</div>
        <Hand text={STEPS_B[n - 1]} at={20} len={18} size={84} style={{ position: "absolute", left: 60, top: 150 }} />
        {Array.from({ length: n - 1 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 110, top: 520, width: 90, height: 90, borderRadius: 45, border: `5px solid ${GRN}`, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: GRN, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>)}
        <div style={{ position: "absolute", left: 60 + (n - 1) * 110, top: 520, width: 90, height: 90, borderRadius: 45, background: C.ver, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f, 30) || 0.001})` }}>{n}</div>
      </div>
      {TABC.map((c, i) => <div key={i} style={{ position: "absolute", right: -90 - (i === n - 1 ? pull * 50 : 0), top: 60 + i * 88, width: 110, height: 72, background: c, borderRadius: "0 12px 12px 0", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,0,0,.4)" }}>{i + 1}</div>)}
    </div>{dur > 0 && null}</Bg>;
};

// ==================== gfci — la corriente que se escapa al agua y el botón que salta en milisegundos
export const Gfci: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const leak = M(m, 2, Math.round(dur * 0.35)), trip = leak + 14;
  const ms = Math.round(cl((f - leak) / 14) * 25); const tripped = f > trip;
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 1100 420 L 1180 860 Q 1300 890 1420 860 L 1500 420 Z" fill="rgba(95,180,255,.35)" stroke="#ddd" strokeWidth={6} />
      <Dots d="M 520 520 L 860 520 L 1240 520 L 1240 700" on={tripped ? 0 : 1} col="#ffe066" speed={6} />
      {f > leak && !tripped && <Dots d="M 1240 700 L 1320 780 L 1400 720" on={1} col={C.ver} speed={8} w={12} />}
    </svg>
    <div style={{ position: "absolute", left: 600, top: 380, width: 280, height: 300, background: "#f6f6f0", borderRadius: 20, boxShadow: "0 20px 50px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 200, height: 70, borderRadius: 10, background: tripped ? C.ver : "#ddd", transform: `translateY(${tripped ? -18 : 0}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: tripped ? "#fff" : "#444", display: "flex", alignItems: "center", justifyContent: "center" }}>{tripped ? "TRIP" : "TEST"}</div>
      <div style={{ position: "absolute", left: 40, top: 150, width: 200, height: 70, borderRadius: 10, background: "#ccc", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#444", display: "flex", alignItems: "center", justifyContent: "center" }}>RESET</div></div>
    <Big x={740} y={260} at={4} size={58} font={SANS}>GFCI</Big>
    <Big x={1300} y={300} at={leak} size={52} col={C.ver} font={SANS}>leak into the water</Big>
    <Big x={740} y={800} at={leak} size={110} col={C.gold}>{ms} ms</Big>
  </Bg>;
};

// ==================== abacus — cada cuenta son 100 Wh; una ducha corre 5 cuentas
export const Abacus: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 15), a1 = M(m, 1, 60), a2 = M(m, 2, 120);
  const row = (y: number, n: number, moved: number, label: string, at: number) => { const e = k(f, at, 10);
    return <div style={{ position: "absolute", left: 300, top: y, width: 1320, height: 120, opacity: e }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 56, height: 8, background: "#c9a46a" }} />
      {Array.from({ length: n }, (_, i) => { const mv = cl(moved - i); return <div key={i} style={{ position: "absolute", left: 40 + i * 60 + mv * (1180 - n * 60), top: 20, width: 56, height: 80, borderRadius: 28, background: i < 5 ? "#c62a22" : "#2f5fa8", boxShadow: "0 6px 12px rgba(0,0,0,.5)" }} />; })}
      <div style={{ position: "absolute", left: 0, top: -50, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.paper }}>{label}</div></div>; };
  const m1 = 5 * io((f - a0) / 20) + 2.5 * io((f - a2) / 20); const m2 = 10 * io((f - a2 - 30) / 30) + 5 * io((f - a2 - 70) / 20);
  return <Bg><div style={{ position: "absolute", left: 240, top: 150, width: 1440, height: 760, border: "26px solid #6b4a2a", borderRadius: 18 }} />
    {row(300, 10, m1, "1,000 Wh STATION", a1)}{row(620, 20, m2, "2,000 Wh STATION", a2 + 20)}
    <Big x={960} y={110} at={a0} size={64} col={C.gold}>1 shower = 500 Wh</Big>
    <Big x={1500} y={480} at={a2} size={50} anchor="l" font={SANS}>once · maybe 1½</Big>
    <Big x={1500} y={800} at={a2 + 70} size={50} anchor="l" font={SANS}>2 – 3 times</Big>{dur > 0 && null}</Bg>;
};

// ==================== queue — la fila de cuatro en la puerta del baño, un solo balde
export const Queue: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.7);
  return <Bg>
    <div style={{ position: "absolute", left: 1460, top: 220, width: 300, height: 680, background: "#5a3d26", borderRadius: 8, boxShadow: "0 20px 50px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", left: 230, top: 340, width: 26, height: 26, borderRadius: 13, background: C.gold }} /></div>
    {[0, 1, 2, 3].map((i) => { const e = k(f, a + i * 6, 10); const h = [430, 400, 300, 260][i];
      return <div key={i} style={{ position: "absolute", left: 1220 - i * 260, top: 900 - h, opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: "#d8c7a0", margin: "0 auto" }} />
        <div style={{ width: 150, height: h - 100, borderRadius: "60px 60px 10px 10px", background: ["#2f5fa8", "#b8733a", "#3f9d5a", "#c62a22"][i], marginTop: 10 }} />
        <div style={{ position: "absolute", left: 30, top: 130, background: C.paper, padding: "4px 18px", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.ink, transform: "rotate(-4deg)" }}>#{i + 1}</div></div>; })}
    <div style={{ position: "absolute", left: 1500, top: 760, width: 140, height: 140, background: "#f2f2f2", borderRadius: "10px 10px 30px 30px" }} />
    <Big x={700} y={180} at={a + 20} size={60} col={C.gold}>4 × 30 min, one bucket</Big>
    <Stamp text="HEAT IT ANOTHER WAY" at={b} x={760} y={300} />
  </Bg>;
};

// ==================== match — el fósforo prende la hornalla aunque el encendedor esté muerto
export const Match: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, Math.round(dur * 0.5)); const strike = io((f - a + 16) / 12); const lit = f > a;
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <ellipse cx={960} cy={680} rx={300} ry={70} fill="#2a2a2a" stroke="#555" strokeWidth={10} />
      {Array.from({ length: 24 }, (_, i) => { const ang = (i / 24) * Math.PI * 2; const on = lit ? cl((f - a - Math.abs(i - 6) * 1.2) / 6) : 0;
        const x = 960 + Math.cos(ang) * 220, y = 680 + Math.sin(ang) * 52; return <path key={i} d={`M ${x - 10} ${y} q 10 ${-40 - 10 * Math.sin(f / 2 + i)} 20 0`} fill="#4aa8ff" opacity={on} style={{ filter: "drop-shadow(0 0 10px #4aa8ff)" }} />; })}
      <g transform={`translate(${1500 - strike * 360} ${360 + strike * 230}) rotate(${-30 + strike * 20})`}>
        <rect x={0} y={-6} width={260} height={12} rx={6} fill="#e8d2a0" /><circle cx={0} cy={0} r={14} fill="#7a1d12" />
        {f > a - 10 && <path d={`M -10 0 q -20 ${-40 - 8 * Math.sin(f)} 10 -70 q 30 30 10 70`} fill="#ffb347" style={{ filter: "drop-shadow(0 0 14px #ffb347)" }} />}</g>
      <g opacity={0.8}><rect x={420} y={760} width={170} height={70} rx={10} fill="#444" /><line x1={420} y1={760} x2={590} y2={830} stroke={C.ver} strokeWidth={8} /><line x1={590} y1={760} x2={420} y2={830} stroke={C.ver} strokeWidth={8} /></g>
    </svg>
    <Big x={505} y={890} at={6} size={36} font={SANS}>igniter: dead</Big>
    <Big x={960} y={200} at={a} size={70} col={C.gold}>top burners still light</Big>
  </Bg>;
};

// ==================== pricegun — la pistola de precios etiqueta el kit; al lado, la caja del calefón nuevo
export const PriceGun: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const items = [["BUCKET", "$10"], ["HEATER", "$20"], ["GFCI", "$18"], ["THERMOMETER", "$12"]];
  const ats = items.map((_, i) => M(m, i, 12 + i * 22)); const tot = M(m, 4, ats[3] + 30); const gx = ats.reduce((acc, a, i) => (f >= a ? 760 + i * 280 : acc), 600);
  return <Bg>
    <div style={{ position: "absolute", left: 120, top: 260, width: 420, height: 600, background: "#cdb791", boxShadow: "0 30px 60px rgba(0,0,0,.5)", opacity: 0.85 }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: C.ink }}>NEW WATER HEATER</div>
      <div style={{ position: "absolute", left: 60, top: 300, background: C.paper, padding: "10px 24px", fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink, transform: "rotate(-6deg)" }}>$1,500+</div></div>
    {items.map(([n, p], i) => { const on = f >= ats[i]; return <div key={n} style={{ position: "absolute", left: 640 + i * 280, top: 560, width: 240, height: 240, background: "#efeee8", borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.ink }}>{n}</div>
      {on && <div style={{ position: "absolute", left: 40, top: 30, background: "#ffd84a", padding: "8px 20px", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: "#222", transform: `rotate(-8deg) scale(${pop(f, ats[i]) || 0.001})` }}>{p}</div>}</div>; })}
    <svg width={1920} height={1080} style={{ position: "absolute" }}><g transform={`translate(${gx + 60} 420)`}><rect x={0} y={0} width={180} height={90} rx={14} fill="#e04a2f" /><rect x={40} y={80} width={50} height={120} rx={10} fill="#333" /></g></svg>
    <Big x={1200} y={230} at={tot} size={120} col={C.gold}>≈ $60</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== redx — la hoja de errores: se escribe el renglón N y la birome roja lo tacha
const MIST = ["Electric heater on a station + homemade cord", "Space heater in the bathroom", "Draining the tank 'for the pipes'", "Modified sine on a tankless", "Shutting the gas off a pilot heater"];
export const RedX: React.FC<P & { n: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const x = cl((f - 22) / 10);
  return <Sheet title="5 MISTAKES · THE CALLS AFTER THE STORM" no={`M-0${n}`}>
    {MIST.map((t, i) => { const y = 60 + i * 150; const done = i < n - 1, cur = i === n - 1;
      return <div key={i} style={{ position: "absolute", left: 170, top: y, opacity: i < n ? 1 : 0.18 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.gold }}>#{i + 1}</div>
        {cur ? <Hand text={t} at={2} len={16} size={64} style={{ position: "absolute", left: 90, top: -10 }} /> : <div style={{ position: "absolute", left: 90, top: -10, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CARBON, whiteSpace: "nowrap" }}>{i < n ? t : "· · ·"}</div>}
        {(done || (cur && x > 0)) && <svg width={1400} height={110} style={{ position: "absolute", left: 60, top: -20 }}>
          <path d="M 10 20 L 120 90 M 120 20 L 10 90" stroke={C.ver} strokeWidth={10} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 * (1 - (done ? 1 : x))} /></svg>}</div>; })}
    {dur > 0 && null}
  </Sheet>;
};

// ==================== sputter — sin bomba no hay presión: el chorro se afina hasta gotear; el tanque caliente no sirve
export const Sputter: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.4); const p = 1 - io((f - a) / Math.max(20, b - a + 20));
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 700 260 L 1000 260 Q 1060 260 1060 320 L 1060 360" stroke="#c9c9c9" strokeWidth={60} fill="none" />
      {p > 0.15 ? <rect x={1060 - 16 * p} y={380} width={32 * p} height={560} fill="rgba(140,200,255,.75)" /> :
        Array.from({ length: 4 }, (_, i) => <circle key={i} cx={1060} cy={390 + ((f * 9 + i * 140) % 560)} r={10} fill="rgba(140,200,255,.85)" />)}
      <circle cx={420} cy={420} r={150} fill="#f2f2f2" stroke="#666" strokeWidth={10} />
      <line x1={420} y1={420} x2={420 + 120 * Math.cos(Math.PI * (1.25 - p))} y2={420 - 120 * Math.sin(Math.PI * (1.25 - p))} stroke={C.ver} strokeWidth={10} strokeLinecap="round" />
    </svg>
    <Big x={420} y={640} at={4} size={44} font={SANS}>WELL PRESSURE</Big>
    <div style={{ position: "absolute", left: 1350, top: 420, width: 300, height: 480, borderRadius: 40, background: "linear-gradient(180deg,#ff8a3d,#d94f2b)", opacity: 0.9 }} />
    <Big x={1500} y={660} at={M(m, 2, dur * 0.7)} size={60}>HOT</Big>
    <Stamp text="DOESN'T MATTER" at={M(m, 2, dur * 0.7) + 8} x={1500} y={800} />
  </Bg>;
};

// ==================== tower — el tanque de agua del pueblo sostiene la presión aunque las casas estén a oscuras
export const Tower: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5);
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={260} y={420} width={20} height={520} fill="#8b97a8" /><rect x={460} y={420} width={20} height={520} fill="#8b97a8" />
      <ellipse cx={370} cy={300} rx={220} ry={150} fill="#d8dde4" /><rect x={160} y={300} width={420} height={60} fill="#d8dde4" />
      <rect x={170} y={330 - 140 * 0.85} width={400} height={140 * 0.85} fill={COLD} opacity={0.5} />
      <path d="M 370 940 L 370 980 L 1800 980" stroke="#666" strokeWidth={22} fill="none" />
      <Dots d="M 370 420 L 370 980 L 1800 980" on={1} col={COLD} speed={6} w={12} />
      {[0, 1, 2, 3].map((i) => <g key={i}><path d={`M ${900 + i * 230} 980 L ${900 + i * 230} 860`} stroke="#666" strokeWidth={10} />
        <path d={`M ${820 + i * 230} 860 L ${900 + i * 230} 780 L ${980 + i * 230} 860 Z`} fill="#3a2a22" /><rect x={830 + i * 230} y={860} width={140} height={100} fill="#2a3346" />
        <rect x={880 + i * 230} y={890} width={40} height={40} fill="#0d1220" /></g>)}
    </svg>
    <Big x={1300} y={300} at={a} size={70} col={C.gold}>pressure stays on</Big>
    <Big x={1300} y={420} at={a + 10} size={44} font={SANS}>lights out · water still comes</Big>
  </Bg>;
};

// ==================== shift — la palanca de cambios del calefón híbrido: 500 W o 4.500 W
export const Shift: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, Math.round(dur * 0.6)); const p = io((f - a) / 14); const w = Math.round(500 + 4000 * p);
  return <Bg>
    <div style={{ position: "absolute", left: 660, top: 240, width: 600, height: 600, background: "#222", borderRadius: 40, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 280, top: 80, width: 40, height: 440, background: "#111", borderRadius: 20 }} />
      <div style={{ position: "absolute", left: 230, top: 60 + p * 380, width: 140, height: 140, borderRadius: 70, background: "radial-gradient(circle at 35% 30%,#aaa,#333)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 360, top: 100, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: p < 0.5 ? GRN : "#777" }}>HEAT PUMP</div>
      <div style={{ position: "absolute", left: 360, top: 470, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: p > 0.5 ? C.ver : "#777" }}>ELEMENTS</div></div>
    <Big x={1560} y={540} at={6} size={110} col={p > 0.5 ? C.ver : C.gold}>{w.toLocaleString("en-US")} W</Big>
    <Stamp text="TREAT IT AS ELECTRIC" at={a + 18} x={960} y={140} />
  </Bg>;
};

// ==================== typewriter — la máquina de escribir tipea las cuatro clases en la tarjeta (con campanita)
export const Typewriter: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const L = ["GAS PILOT", "POWER VENT", "TANKLESS", "ELECTRIC"];
  const ats = L.map((_, i) => M(m, i, 6 + i * Math.round(dur / 5)));
  const cur = ats.reduce((acc, a, i) => (f >= a ? i : acc), -1); const ch = cur >= 0 ? Math.min(L[cur].length, Math.floor((f - ats[cur]) / 1.4)) : 0;
  return <Bg>
    <div style={{ position: "absolute", left: 520, top: 120, width: 880, height: 520, background: C.paper, boxShadow: "0 20px 50px rgba(0,0,0,.5)", transform: `translateX(${-ch * 14}px)` }}>
      {L.map((t, i) => <div key={t} style={{ position: "absolute", left: 80, top: 60 + i * 110, fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 70, color: C.ink }}>{i < cur ? `☐ ${t}` : i === cur ? `☐ ${t.slice(0, ch)}` : ""}</div>)}</div>
    <div style={{ position: "absolute", left: 420, top: 600, width: 1080, height: 360, background: "linear-gradient(180deg,#2c2c2c,#111)", borderRadius: "40px 40px 20px 20px", boxShadow: "0 30px 70px rgba(0,0,0,.7)" }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + (i % 10) * 92, top: 60 + Math.floor(i / 10) * 90 + (i === ((f / 2) | 0) % 30 && ch < 10 ? 8 : 0), width: 70, height: 70, borderRadius: 35, background: "#e8e4d8", border: "5px solid #555" }} />)}</div>
  </Bg>;
};

// ==================== packbucket — las cosas caen de a una en el balde, la tapa cierra
export const PackBucket: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["IMMERSION HEATER 1,000 W", "PLUG-IN GFCI", "5-GAL BUCKET + LID", "KITCHEN THERMOMETER", "CLEAN PUMP SPRAYER"]; const ats = T.map((_, i) => M(m, i, 10 + i * 40));
  const lid = k(f, dur - 26, 12);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d="M 760 520 L 800 940 Q 960 970 1120 940 L 1160 520 Z" fill="#f2f2f2" stroke="#ccc" strokeWidth={6} />
      <ellipse cx={960} cy={520 - (1 - lid) * 300} rx={210} ry={30} fill="#e0e0e0" stroke="#aaa" strokeWidth={6} opacity={lid} /></svg>
    {T.map((t, i) => { const e = io((f - ats[i]) / 16); if (f < ats[i]) return null; const y = 120 + e * 520; const o = 1 - k(f, ats[i] + 14, 6);
      return <div key={t} style={{ position: "absolute", left: 960, top: y, transform: "translateX(-50%)", opacity: o, background: C.paper, padding: "12px 26px", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>{t}</div>; })}
    {T.map((t, i) => f >= ats[i] + 14 ? <div key={i} style={{ position: "absolute", left: 160, top: 220 + i * 110, fontFamily: HAND, fontSize: 50, color: C.paper }}>✓ {t.toLowerCase()}</div> : null)}
    <Hand text="SHOWER KIT" at={dur - 14} len={12} size={70} col="#111" style={{ position: "absolute", left: 800, top: 700 }} />
  </Bg>;
};

// ==================== scope — el osciloscopio: la onda lisa de la pared y la escalera del inversor barato
export const Scope: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, 60), c = M(m, 2, 120), d = M(m, 3, 170);
  const wave = (y: number, stair: boolean, on: number) => { let s = ""; for (let x = 0; x <= 1100; x += 6) { const ph = (x + f * 8) / 140; let v = Math.sin(ph); if (stair) v = Math.round(v * 2) / 2; s += (x ? "L" : "M") + (410 + x) + " " + (y - v * 90 * on) + " "; } return s; };
  return <Bg dark>
    <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 820, borderRadius: 50, background: "#111", border: "26px solid #4a4a4a", boxShadow: "0 40px 90px rgba(0,0,0,.7)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(80,255,140,.07) 0 2px, transparent 2px 80px), repeating-linear-gradient(90deg, rgba(80,255,140,.07) 0 2px, transparent 2px 80px)" }} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={wave(360, false, k(f, a, 10))} stroke="#5dff8f" strokeWidth={6} fill="none" style={{ filter: "drop-shadow(0 0 10px #5dff8f)" }} />
      <path d={wave(700, true, k(f, b, 10))} stroke="#ffd34a" strokeWidth={6} fill="none" style={{ filter: "drop-shadow(0 0 10px #ffd34a)" }} />
    </svg>
    <Big x={1690} y={360} at={a} size={36} font={SANS}>WALL</Big><Big x={1700} y={700} at={b} size={36} font={SANS}>CHEAP INVERTER</Big>
    <Big x={210} y={360} at={c} size={70}>💡</Big><Big x={210} y={700} at={c} size={70}>💡</Big>
    {f > d && <><Big x={210} y={470} at={d} size={40} col={GRN} font={SANS}>board ✓</Big><Big x={210} y={810} at={d} size={40} col={C.ver} font={SANS}>board ✗</Big></>}
    {dur > 0 && null}
  </Bg>;
};

// ==================== timeclock — la tarjeta del reloj de fichar: heladera una hora sí, tres no; el agua en los huecos
export const TimeClock: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, 40), c = M(m, 2, dur * 0.75);
  return <Sheet title="FRIDGE SHIFTS · TIME CARD" no="TC-1">
    {Array.from({ length: 12 }, (_, h) => { const on = h % 4 === 0; const t = a + h * 4; const shown = f > t;
      return <div key={h} style={{ position: "absolute", left: 170 + h * 112, top: 120, width: 96, height: 420, border: `3px solid ${C.ink}`, background: shown ? (on ? "rgba(63,157,90,.25)" : "rgba(47,95,168,.08)") : "transparent" }}>
        <div style={{ position: "absolute", top: -50, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.ink }}>{h + 1}h</div>
        {shown && <div style={{ position: "absolute", left: 18, top: 30, fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 30, color: on ? GRN : CARBON, transform: "rotate(-90deg) translateX(-200px)", transformOrigin: "0 0", whiteSpace: "nowrap" }}>{on ? "FRIDGE ON" : f > b ? "OFF" : ""}</div>}
        {!on && f > c && h % 4 === 2 && <div style={{ position: "absolute", left: 6, right: 6, bottom: 10, height: 120, background: C.ver, opacity: 0.85, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 24, textAlign: "center", paddingTop: 30 }}>SHOWER WATER</div>}
      </div>; })}
    <Big x={830} y={680} at={b} size={64} col={C.ver}>1 hour on · 3 hours off</Big>
  </Sheet>;
};

// ==================== rolodex — el fichero giratorio: una tarjeta por clase con sus vatios
export const Rolodex: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const CARDS = [["GAS TANK · PILOT", "0 W", "works on its own"], ["POWER VENT GAS", "50–150 W", "a power station runs it"], ["TANKLESS GAS", "50–150 W", "pure sine wave only"]];
  const ats = CARDS.map((_, i) => M(m, i, i ? 99999 : 0)); const cur = ats.reduce((acc, a, i) => (f >= a ? i : acc), 0); const flip = io((f - ats[cur]) / 10);
  return <Bg>
    <div style={{ position: "absolute", left: 560, top: 820, width: 800, height: 60, background: "#333", borderRadius: 30 }} />
    <div style={{ position: "absolute", left: 940, top: 300, width: 40, height: 540, background: "#555" }} />
    {CARDS.map((c, i) => { const rel = i - cur; if (rel < -1 || rel > 2) return null; const rot = rel === 0 ? (1 - flip) * -70 : rel < 0 ? 80 : -70 - rel * 8;
      return <div key={i} style={{ position: "absolute", left: 460, top: 230, width: 1000, height: 560, background: C.paper, borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,.5)", transformOrigin: "50% 100%", transform: `perspective(1800px) rotateX(${rot}deg)`, opacity: rel < 0 ? 0 : 1, zIndex: 10 - rel }}>
        <div style={{ height: 22, background: [C.blue, C.gold, GRN][i] }} />
        <div style={{ padding: "40px 60px", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: C.ink }}>{c[0]}</div>
        <div style={{ padding: "0 60px", fontFamily: SANS, fontWeight: 800, fontSize: 120, color: C.ver }}>{c[1]}</div>
        <div style={{ padding: "10px 60px", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CARBON }}>{c[2]}</div></div>; })}
    {dur > 0 && null}
  </Bg>;
};

// ==================== dipstick — la varilla de la estación: la marca baja y frena en 20 %
export const Dipstick: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const pull = k(f, 2, 14); const a = M(m, 0, 20); const lvl = 1 - 0.8 * io((f - a) / 30);
  return <Bg dark>
    <div style={{ position: "absolute", left: 300, top: 600, width: 500, height: 330, background: "#2b2b2b", borderRadius: 28, boxShadow: "0 20px 50px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 520 + pull * 200, top: 120 - pull * 0, width: 1100, height: 60, transform: `rotate(${-10 + pull * 10}deg)`, transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", left: 0, top: 18, width: 1000, height: 24, background: "linear-gradient(180deg,#ddd,#888)", borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 1000 * (1 - lvl), top: 14, width: 1000 * lvl, height: 32, background: "rgba(198,140,40,.85)", borderRadius: 12 }} />
      {[1, 0.5, 0.2].map((v) => <div key={v} style={{ position: "absolute", left: 1000 * (1 - v) - 2, top: -40, width: 4, height: 140, background: v === 0.2 ? C.ver : C.paper }}><div style={{ position: "absolute", top: 150, left: -40, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: v === 0.2 ? C.ver : C.paper }}>{v * 100}%</div></div>)}
    </div>
    <Stamp text="KEEP 20% FOR THE NIGHT" at={a + 34} x={1180} y={620} />
    <Big x={1180} y={800} at={M(m, 1, a + 50)} size={46} font={SANS}>fridge + furnace overnight</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== pyramid — los bloques: calor y comida abajo, la ducha arriba
export const Pyramid: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const B = [["HEAT · FURNACE", 900, C.ver, 0], ["FOOD · FRIDGE", 700, C.gold, 0], ["COMFORT · SHOWER", 480, C.blue, 1]] as const;
  return <Bg>{B.map(([t, w, c, mi], i) => { const at = mi === 0 ? M(m, 0, 4) + i * 8 : M(m, 1, 60); const e = pop(f, at);
    return <div key={t} style={{ position: "absolute", left: 960 - (w as number) / 2, top: 760 - i * 200 - (1 - Math.min(1, e)) * 500, width: w as number, height: 180, background: c as string, borderRadius: 10, opacity: f > at ? 1 : 0, boxShadow: "0 16px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.paper }}>{t}</div>; })}
    <Big x={960} y={110} at={M(m, 2, 90)} size={60} col={C.gold}>comfort comes after heat and food</Big></Bg>;
};

// ==================== eggtimer — el timer de cocina a 5 minutos mientras la luz parpadea
export const EggTimer: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 6); const wind = io((f - a) / 12); const run = Math.max(0, f - a - 12) / Math.max(1, dur - a - 12);
  const flick = M(m, 1, dur * 0.5); const fl = f > flick && f < flick + 50 && [0, 1, 0, 1, 1, 0, 1].includes(Math.floor((f - flick) / 7)) ? 0.15 : 1;
  const ang = (wind * 5 - run * 1.2) * 6;
  return <Bg>
    <AbsoluteFill style={{ background: `rgba(255,236,190,${0.14 * fl})` }} />
    <div style={{ position: "absolute", left: 660, top: 220, width: 600, height: 600, borderRadius: 300, background: "radial-gradient(circle at 40% 30%,#fff,#d9d4c4)", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: 296, top: 20, width: 8, height: i % 5 ? 20 : 40, background: C.ink, transformOrigin: "4px 280px", transform: `rotate(${i * 6}deg)` }} />)}
      <div style={{ position: "absolute", left: 280, top: 60, width: 40, height: 240, background: C.ver, borderRadius: 20, transformOrigin: "20px 240px", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: 250, top: 250, width: 100, height: 100, borderRadius: 50, background: "#333" }} /></div>
    <Big x={960} y={110} at={a} size={84} col={C.gold}>WAIT 5 MINUTES</Big>
    <Big x={1560} y={540} at={flick} size={48} font={SANS}>flicker · drop · back</Big>
  </Bg>;
};

// ==================== swap — el tomacorriente viejo de dos patas sale y entra el GFCI
export const Swap: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10); const out = io((f - a) / 14), inn = io((f - a - 16) / 14);
  return <Bg>
    <div style={{ position: "absolute", left: 660, top: 180, width: 600, height: 760, background: "#efe7d6", borderRadius: 30, boxShadow: "0 30px 70px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 760, top: 260, width: 400, height: 600, background: "#e6dcc8", borderRadius: 20, transform: `translateX(${out * -900}px) rotate(${out * -20}deg)`, opacity: 1 - out }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 130, top: 120 + i * 250, width: 140, height: 120 }}><div style={{ position: "absolute", left: 20, top: 20, width: 18, height: 70, background: "#333" }} /><div style={{ position: "absolute", left: 100, top: 20, width: 18, height: 70, background: "#333" }} /></div>)}</div>
    <div style={{ position: "absolute", left: 760, top: 260, width: 400, height: 600, background: "#f8f8f4", borderRadius: 20, transform: `translateX(${(1 - inn) * 900}px)`, boxShadow: "0 10px 20px rgba(0,0,0,.3)" }}>
      <div style={{ position: "absolute", left: 100, top: 250, width: 200, height: 50, background: "#ddd", fontFamily: SANS, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", color: C.ver }}>TEST</div>
      <div style={{ position: "absolute", left: 100, top: 310, width: 200, height: 50, background: "#ccc", fontFamily: SANS, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>RESET</div></div>
    <Big x={1560} y={360} at={M(m, 1, a + 40)} size={80} col={C.gold}>30 years late</Big>
    <Big x={1560} y={480} at={M(m, 2, a + 70)} size={44} font={SANS}>+ plug-in GFCI for the station</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== loupe — la lupa recorre la chapa de datos y agranda lo que importa
export const Loupe: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, 20), b = M(m, 2, dur * 0.7);
  const tx = interpolate(f, [0, a, b, b + 12], [560, 760, 900, 760], CL), ty = interpolate(f, [0, a, b, b + 12], [400, 520, 600, 420], CL);
  const rows = ["MODEL ··········", "SERIAL ··········", "CAPACITY  50 GAL", "FUEL  NATURAL GAS", "INPUT  40,000 BTU/H", "120/240 V ······"];
  const sheet = (s: number) => rows.map((r, i) => <div key={i} style={{ position: "absolute", left: 60 * s, top: (40 + i * 70) * s, fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 30 * s, color: "#333", whiteSpace: "nowrap" }}>{r}</div>);
  return <Bg>
    <div style={{ position: "absolute", left: 460, top: 300, width: 1000, height: 480, background: "#e9e6dd", border: "6px solid #999", borderRadius: 10, overflow: "hidden" }}>{sheet(1)}</div>
    <div style={{ position: "absolute", left: tx - 160, top: ty - 160, width: 320, height: 320, borderRadius: 160, border: "18px solid #222", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,.6)", background: "#e9e6dd" }}>
      <div style={{ position: "absolute", left: -(tx - 460) * 2.2 + 160, top: -(ty - 300) * 2.2 + 160 }}>{sheet(2.2)}</div></div>
    <div style={{ position: "absolute", left: tx + 120, top: ty + 120, width: 40, height: 220, background: "#222", borderRadius: 20, transform: "rotate(-45deg)", transformOrigin: "20px 0" }} />
    <Big x={960} y={170} at={a} size={66} col={C.gold}>only 4 things matter</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== polaroid — la foto instantánea sale, se revela y queda pegada en la tarjeta
export const Polaroid: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 4), b = M(m, 1, dur * 0.55), c = M(m, 2, dur * 0.8);
  const eject = io((f - a) / 16); const dev = cl((f - a - 16) / 40); const pin = io((f - c) / 12);
  return <Bg>
    <div style={{ position: "absolute", left: 1180, top: 280, width: 560, height: 520, background: C.paper, boxShadow: "0 20px 50px rgba(0,0,0,.5)", transform: "rotate(3deg)" }}>
      <div style={{ padding: "30px 40px", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CARBON }}>MY WATER HEATER</div></div>
    <div style={{ position: "absolute", left: 300, top: 400, width: 520, height: 300, background: "#2b2b2b", borderRadius: 30 }} />
    <div style={{ position: "absolute", left: interpolate(pin, [0, 1], [360, 1300]), top: interpolate(eject, [0, 1], [420, 620]) - pin * 280, width: 400, height: 470, background: "#fbfbf7", padding: 26, boxShadow: "0 16px 30px rgba(0,0,0,.5)", transform: `rotate(${pin * -4}deg)` }}>
      <div style={{ width: 348, height: 348, background: `linear-gradient(180deg, rgba(240,240,236,${1 - dev}), rgba(240,240,236,${1 - dev})), #c9c4b6`, position: "relative" }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 30, top: 40 + i * 60, width: 280 - i * 30, height: 16, background: "#555", opacity: dev * 0.8 }} />)}</div></div>
    <Big x={560} y={250} at={b} size={56} col={C.gold}>print it · tape it on</Big>
  </Bg>;
};

// ==================== ration — el rollo de números: se cortan tres boletos, el resto no
export const Ration: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["1 · ONE SHOWER", "2 · DISHES IN A TUB", "3 · DONE"]; const ats = T.map((_, i) => M(m, i, 10 + i * 30)); const no = M(m, 3, dur * 0.8);
  return <Bg>
    <div style={{ position: "absolute", left: 140, top: 380, width: 260, height: 260, borderRadius: 130, background: "#c62a22", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    {T.map((t, i) => { const e = io((f - ats[i]) / 14); if (f < ats[i]) return null;
      return <div key={t} style={{ position: "absolute", left: 360 + e * (260 + i * 30), top: 450 - 0 + (e > 0.99 ? -200 + i * 200 : 0), width: 720, height: 130, background: "#f2d16b", border: "4px dashed #8a6a1a", transform: `rotate(${e * (i - 1) * 4}deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink, display: "flex", alignItems: "center", paddingLeft: 40 }}>{t}</div>; })}
    <Stamp text="NOT 5 PEOPLE, ANYTIME" at={no} x={1300} y={900} />
  </Bg>;
};

// ==================== settle — el frasco de agua oxidada: la arena baja y arriba queda clara
export const Settle: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.3); const s = io((f - a) / Math.max(30, dur - a - 20));
  return <Bg>
    <div style={{ position: "absolute", left: 760, top: 200, width: 400, height: 700, borderRadius: "30px 30px 60px 60px", border: "10px solid rgba(255,255,255,.6)", overflow: "hidden", background: `linear-gradient(180deg, rgba(${Math.round(190 - 100 * s)},${Math.round(120 + 60 * s)},${Math.round(70 + 150 * s)},.75) 0%, rgba(160,90,40,.85) 100%)` }}>
      {Array.from({ length: 60 }, (_, i) => { const y0 = (i * 113) % 660; const y = y0 + (660 - y0) * s - ((i * 7) % 30) * s; return <div key={i} style={{ position: "absolute", left: 20 + ((i * 53) % 340), top: y, width: 10, height: 10, borderRadius: 5, background: "#7a4a1a" }} />; })}</div>
    <Big x={1460} y={360} at={M(m, 0, 6)} size={56} anchor="l" font={SANS}>first gallon: rusty</Big>
    <Big x={1460} y={460} at={a} size={56} anchor="l" col={GRN} font={SANS}>normal</Big>
    <Big x={1460} y={600} at={M(m, 2, dur * 0.7)} size={56} anchor="l" col={C.gold} font={SANS}>use the clear top</Big>
  </Bg>;
};

// ==================== bodymap — el lavado de arriba abajo con un galón
export const BodyMap: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const zones = [[860, 130, 200, 200], [700, 340, 520, 300], [800, 640, 320, 360]]; const ats = zones.map((_, i) => M(m, i, 10 + i * 30));
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <circle cx={960} cy={230} r={90} fill="none" stroke={C.paper} strokeWidth={8} />
      <path d="M 860 340 L 1060 340 L 1200 620 M 860 340 L 720 620 M 880 340 L 860 640 L 900 980 M 1040 340 L 1060 640 L 1020 980" stroke={C.paper} strokeWidth={8} fill="none" />
      {zones.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h * cl((f - ats[i]) / 14)} fill={COLD} opacity={0.35} />)}
    </svg>
    {["FACE", "ARMS", "THE REST"].map((t, i) => <Big key={t} x={1400} y={250 + i * 150} at={ats[i]} size={60} anchor="l">{i + 1} · {t}</Big>)}
    <Big x={400} y={540} at={4} size={80} col={C.gold}>1 gal</Big>{dur > 0 && null}
  </Bg>;
};

// ==================== phonecord — el cable rulo del teléfono cruza la pantalla; cada instrucción viaja por él
export const PhoneCord: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["UNPLUG FROM THE WALL", "PLUG INTO THE STATION", "WAIT A MINUTE"]; const ats = T.map((_, i) => M(m, i, 20 + i * 50)); const fan = M(m, 3, dur * 0.7), hot = M(m, 4, dur * 0.85);
  let coil = ""; for (let x = 0; x <= 1100; x += 4) coil += (x ? "L" : "M") + (330 + x) + " " + (560 + 26 * Math.sin(x / 9) + 30 * Math.sin(x / 300 + f / 20)) + " ";
  return <Bg dark>
    <div style={{ position: "absolute", left: 120, top: 420, width: 220, height: 320, background: "#e8e1cf", borderRadius: "90px 90px 30px 30px", transform: "rotate(-14deg)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={coil} stroke="#e8e1cf" strokeWidth={8} fill="none" /></svg>
    <div style={{ position: "absolute", left: 1450, top: 260, width: 300, height: 640, borderRadius: 40, background: "#ececec", boxShadow: "0 20px 50px rgba(0,0,0,.6)" }}>
      <svg width={300} height={200} style={{ position: "absolute", top: -170 }}><rect x={90} y={60} width={120} height={100} rx={10} fill="#777" />{[0, 1, 2].map((i) => <line key={i} x1={150} y1={110} x2={150 + 36 * Math.cos((f > fan ? f * 0.5 : 0) + i * 2.1)} y2={110 + 36 * Math.sin((f > fan ? f * 0.5 : 0) + i * 2.1)} stroke="#ddd" strokeWidth={8} />)}</svg>
      {f > fan + 10 && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 38, bottom: 30, width: 26, height: 40 + 10 * Math.sin(f / 2 + i), background: "#4aa8ff", borderRadius: "50% 50% 20% 20%", filter: "drop-shadow(0 0 8px #4aa8ff)" }} />)}</div>
    {T.map((t, i) => { const p = io((f - ats[i]) / 20); if (f < ats[i]) return null; return <div key={t} style={{ position: "absolute", left: 340 + p * (360 + i * 120), top: 300 + i * 0 - (p > 0.99 ? -i * 0 : 0) - 0, transform: `translateY(${i * 90}px)`, background: C.paper, padding: "10px 24px", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink, borderRadius: 8 }}>{i + 1} · {t}</div>; })}
    <Big x={1600} y={980} at={hot} size={56} col={C.gold}>hot water · ~40 min</Big>
  </Bg>;
};

// ==================== track — la pista: el UPS de la computadora se para a la primera vuelta, la estación sigue
export const Track: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, dur * 0.5);
  const ups = Math.min(io((f - a) / 30) * 0.25, 0.25), st = io((f - a) / Math.max(40, dur - a)) * 0.95;
  const pos = (t: number, r: number) => [960 + Math.cos(t * Math.PI * 2 - Math.PI / 2) * r * 1.9, 540 + Math.sin(t * Math.PI * 2 - Math.PI / 2) * r];
  const [ux, uy] = pos(ups, 300), [sx, sy] = pos(st, 380);
  return <Bg>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><ellipse cx={960} cy={540} rx={570} ry={300} fill="none" stroke="#a5532e" strokeWidth={60} /><ellipse cx={960} cy={540} rx={722} ry={380} fill="none" stroke="#a5532e" strokeWidth={60} /></svg>
    <div style={{ position: "absolute", left: ux - 50, top: uy - 40, width: 100, height: 80, background: "#555", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: sx - 70, top: sy - 50, width: 140, height: 100, background: "#2b2b2b", border: `5px solid ${GRN}`, borderRadius: 14 }} />
    <Big x={960} y={480} at={a} size={52} font={SANS}>COMPUTER BACKUP · a few minutes</Big>
    <Big x={960} y={600} at={b} size={52} col={GRN} font={SANS}>POWER STATION · hours</Big>
  </Bg>;
};

// ==================== pegboard — el tablero de herramientas: cada cosa cuelga en su silueta cuando la nombra
export const Pegboard: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = [["PILOT GAS", "nothing to do"], ["VENT / TANKLESS", "50–150 W"], ["PURE SINE", "plug or transfer switch"]]; const ats = T.map((_, i) => M(m, i, 99999));
  return <Bg>
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 840, background: "#c9a46a", backgroundImage: "radial-gradient(#5a3d26 6px, transparent 7px)", backgroundSize: "60px 60px", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      {T.map(([t, s], i) => { const e = pop(f, ats[i]); const on = f > ats[i];
        return <div key={t} style={{ position: "absolute", left: 100 + i * 500, top: 160, width: 420, height: 520 }}>
          <div style={{ position: "absolute", inset: 0, border: "6px dashed rgba(60,40,20,.6)", borderRadius: 20 }} />
          {on && <div style={{ position: "absolute", inset: 0, background: C.paper, borderRadius: 20, transform: `translateY(${(1 - Math.min(1, e)) * -300}px) rotate(${(1 - Math.min(1, e)) * 6}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,.4)", padding: 30 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: C.ink }}>{t}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CARBON, marginTop: 30 }}>{s}</div></div>}
          <div style={{ position: "absolute", left: 190, top: -40, width: 40, height: 60, borderRadius: 10, background: "#777" }} /></div>; })}</div>
    {dur > 0 && null}
  </Bg>;
};

// ==================== lockout — el candado rojo de bloqueo se cierra sobre cada uno de los tres «nunca»
export const Lockout: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const T = ["SPACE HEATER IN THE BATHROOM", "PROPANE HEATER / CAMP STOVE INDOORS", "TWO-MALE CORD"]; const ats = T.map((_, i) => M(m, i, 10 + i * 40));
  return <Bg>{T.map((t, i) => { const c = io((f - ats[i]) / 8);
    return <div key={t} style={{ position: "absolute", left: 140 + i * 580, top: 260, width: 520, height: 560, background: "#efeee8", borderRadius: 18, opacity: k(f, i * 4, 8), boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>
      <div style={{ padding: 30, fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: C.ink, lineHeight: 1.05 }}>{t}</div>
      {f > ats[i] - 8 && <svg width={240} height={300} style={{ position: "absolute", left: 140, top: 230 }}>
        <path d={`M 50 ${150 - (1 - c) * 50} L 50 80 Q 50 20 120 20 Q 190 20 190 80 L 190 ${110 - (1 - c) * 50}`} fill="none" stroke="#bbb" strokeWidth={22} />
        <rect x={20} y={130} width={200} height={150} rx={20} fill={C.ver} /><circle cx={120} cy={195} r={16} fill="#300" /></svg>}
      {c > 0.9 && <div style={{ position: "absolute", left: 160, bottom: 20, background: C.ver, color: "#fff", padding: "6px 22px", fontFamily: SANS, fontWeight: 800, fontSize: 40 }}>NEVER</div>}</div>; })}</Bg>;
};

// ==================== ballot — la urna con cuatro ranuras: ¿qué calefón tenés?
export const Ballot: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["PILOT", "POWER VENT", "TANKLESS", "ELECTRIC"]; const ats = T.map((_, i) => M(m, i + 1, 30 + i * 18));
  return <Bg>
    <div style={{ position: "absolute", left: 360, top: 480, width: 1200, height: 460, background: "#1d3354", borderRadius: 20, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      {T.map((t, i) => <div key={t} style={{ position: "absolute", left: 60 + i * 280, top: 40, width: 240, height: 30, background: "#0a1220", borderRadius: 8 }}><div style={{ position: "absolute", top: 60, width: 240, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.paper }}>{t}</div>
        <div style={{ position: "absolute", top: 140, width: 240, textAlign: "center", fontFamily: HAND, fontSize: 90, color: C.gold }}>{"|".repeat(Math.max(0, Math.min(6, Math.floor((f - ats[i]) / 6))))}</div></div>)}</div>
    {T.map((t, i) => { const p = io((f - ats[i]) / 14); if (f < ats[i] || p >= 1) return null; return <div key={i} style={{ position: "absolute", left: 420 + i * 280, top: 120 + p * 380, width: 240, height: 140, background: C.paper, transform: `rotate(${(1 - p) * 10}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />; })}
    <Big x={960} y={200} at={M(m, 0, 6)} size={70} col={C.gold}>which one do you have?</Big>{dur > 0 && null}
  </Bg>;
};

// ---------- overlays de una sola vez (sobre material real)
export const TankDeg: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const d = Math.round(120 - 6 * io(f / Math.max(20, dur - 20)));
  return <div style={{ position: "absolute", right: 120, top: 140, opacity: o, display: "flex", alignItems: "center", gap: 26 }}>
    <div style={{ width: 44, height: 360, borderRadius: 22, background: "#eee", border: "5px solid #999", position: "relative" }}><div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: 300 * ((d - 60) / 70), borderRadius: 16, background: C.ver }} /></div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: C.paper, textShadow: "0 4px 16px #000" }}>{d}°F<div style={{ fontFamily: SANS, fontSize: 36 }}>−1° an hour</div></div></div>;
};
export const BtuRoll: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const v = Math.round(40000 * io(f / 30));
  const s = v.toString().padStart(5, "0");
  return <div style={{ position: "absolute", left: 120, bottom: 140, opacity: o }}>
    <div style={{ display: "flex", gap: 8 }}>{s.split("").map((c, i) => <div key={i} style={{ width: 80, height: 120, background: "#111", color: "#f4efe3", fontFamily: SANS, fontWeight: 800, fontSize: 90, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>{c}</div>)}</div>
    <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.paper, textShadow: "0 3px 12px #000" }}>BTU / HOUR · INPUT</div></div>;
};
export const Valve: React.FC<{ dur: number; label: string }> = ({ dur, label }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10)); const r = io((f - 8) / 14) * 90;
  return <div style={{ position: "absolute", right: 140, top: 160, opacity: o, textAlign: "center" }}>
    <svg width={260} height={260}><circle cx={130} cy={130} r={110} fill="rgba(0,0,0,.35)" /><rect x={30} y={115} width={200} height={30} rx={15} fill={C.ver} transform={`rotate(${r} 130 130)`} /><circle cx={130} cy={130} r={26} fill="#ccc" /></svg>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.paper, textShadow: "0 3px 12px #000" }}>{label}</div></div>;
};

// ---------- despacho de los planos C
export const CompC: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const c: string = s.comp, m: number[] = s.m || [];
  if (c.startsWith("cut:")) return <HeaterCut act={c.slice(4)} m={m} dur={dur} />;
  if (c.startsWith("binder:step")) return <Binder n={Number(c.slice(11))} m={m} dur={dur} />;
  if (c.startsWith("redx:")) return <RedX n={Number(c.slice(5))} m={m} dur={dur} />;
  const T: Record<string, React.FC<P>> = { frostmirror: FrostMirror, envelope: Envelope, thermos: Thermos, bucket: Bucket, tug: Tug, gfci: Gfci, abacus: Abacus, queue: Queue, match: Match, pricegun: PriceGun, sputter: Sputter, tower: Tower, shift: Shift, typewriter: Typewriter, packbucket: PackBucket, scope: Scope, timeclock: TimeClock, rolodex: Rolodex, dipstick: Dipstick, pyramid: Pyramid, eggtimer: EggTimer, swap: Swap, loupe: Loupe, polaroid: Polaroid, ration: Ration, settle: Settle, bodymap: BodyMap, phonecord: PhoneCord, track: Track, pegboard: Pegboard, lockout: Lockout, ballot: Ballot };
  const X = T[c]; return X ? <X m={m} dur={dur} /> : null;
};
