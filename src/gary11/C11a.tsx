// gary11a · componentes propios (planilla de trabajo del electricista: hoja de inspección crema, tinta carbón azul,
// sello rojo, cobre, diagrama unifilar azul). Cada mecanismo se usa UNA vez en los 6 videos (registro D:/rtmp/gary11_COMPONENTES.md).
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONTS, hash } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const io = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const pop = (f: number, a: number) => { const x = Math.max(0, (f - a) / 30) * 9; return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.7); };
const CARBON = "#2a3f8f", BLUEPRINT = "#14305c", LINE = "#cfe0ff", GRN = "#3f9d5a", TAPE = "#1c1c1f";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
type P = { dur: number; m: number[] };
const M = (m: number[], i: number, d: number) => (m[i] ?? d);

// ---------- base: hoja de inspección
const Sheet: React.FC<{ title: string; no?: string; children?: React.ReactNode; tilt?: number; dark?: boolean }> = ({ title, no = "11A", children, tilt = -1.2, dark }) => {
  const f = useCurrentFrame();
  const e = k(f, 0, 14);
  return (
    <AbsoluteFill style={{ background: dark ? "#0f1b30" : "#2b2117" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,230,190,.10), rgba(0,0,0,.45))" }} />
      <div style={{ position: "absolute", left: 130, top: 70, width: 1660, height: 940, transform: `translateY(${(1 - e) * 60}px) rotate(${tilt}deg)`, opacity: e,
        background: `repeating-linear-gradient(0deg, transparent 0 47px, rgba(47,95,168,.16) 47px 49px), ${C.paper}`, boxShadow: "0 40px 90px rgba(0,0,0,.6)", borderRadius: 6 }}>
        <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(198,42,34,.45)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 92, background: C.ink, display: "flex", alignItems: "center", padding: "0 44px", justifyContent: "space-between", borderRadius: "6px 6px 0 0" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: C.paper, letterSpacing: 3 }}>{title}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.gold, letterSpacing: 4 }}>WORK SHEET · No. {no}</div>
        </div>
        {/* manchas de carbónico */}
        <div style={{ position: "absolute", right: 90, bottom: 70, width: 260, height: 90, borderRadius: "50%", background: "rgba(42,63,143,.06)", filter: "blur(14px)" }} />
        <div style={{ position: "absolute", left: 0, top: 92, right: 0, bottom: 0 }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};
// texto a mano que se escribe (revela por clip)
const Hand: React.FC<{ text: string; at: number; len?: number; size?: number; col?: string; style?: React.CSSProperties }> = ({ text, at, len = 18, size = 54, col = CARBON, style }) => {
  const f = useCurrentFrame(); const p = cl((f - at) / len);
  if (p <= 0) return null;
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - p * 100}% -20% 0)`, ...style }}>{text}</div>;
};
// sello de goma que cae
const Stamp: React.FC<{ text: string; at: number; x: number; y: number; col?: string; rot?: number; size?: number }> = ({ text, at, x, y, col = C.ver, rot = -8, size = 64 }) => {
  const f = useCurrentFrame(); if (f < at) return null;
  const s = interpolate(f, [at, at + 5, at + 9], [2.2, 0.94, 1], CL), o = interpolate(f, [at, at + 4], [0, 0.92], CL);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, border: `7px solid ${col}`, borderRadius: 10, padding: "6px 26px",
    fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 6, whiteSpace: "nowrap", mixBlendMode: "multiply", maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.7))" }}>{text}</div>;
};
// óvalo de birome roja que se dibuja
const Circle: React.FC<{ at: number; x: number; y: number; w: number; h: number; len?: number }> = ({ at, x, y, w, h, len = 16 }) => {
  const f = useCurrentFrame(); const p = cl((f - at) / len); if (p <= 0) return null;
  const L = Math.PI * (w + h) * 1.05;
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill="none" stroke={C.ver} strokeWidth={6} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform={`rotate(-4 ${x} ${y})`} />
  </svg>;
};

// ==================== 1 · carbonquote — el presupuesto en carbónico, el total se marca y se circula
export const CarbonQuote: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame();
  const rows = ["22 kW standby unit", "Automatic transfer switch", "Gas line + concrete pad", "Permit + labor"];
  const tot = "$16,000"; const n = Math.round(tot.length * cl((f - 16) / 14));
  return <Sheet title="ESTIMATE · STANDBY GENERATOR" no="Q-01">
    {rows.map((r, i) => <div key={i} style={{ position: "absolute", left: 170, top: 70 + i * 96 }}><Hand text={r} at={i * 3} len={10} size={58} /></div>)}
    <div style={{ position: "absolute", left: 170, top: 520, fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: C.ink }}>TOTAL</div>
    <div style={{ position: "absolute", left: 560, top: 470, fontFamily: HAND, fontWeight: 700, fontSize: 170, color: CARBON, transform: `scale(${1 + 0.04 * Math.sin(f / 4) * cl((f - 30) / 10)})` }}>{tot.slice(0, n)}</div>
    <div style={{ position: "absolute", left: 0, top: 0 }}><Circle at={32} x={930 - 130} y={565 + 92 - 92} w={760} h={230} len={Math.min(18, dur - 34)} /></div>
  </Sheet>;
};

// ==================== 2 · threequotes — la firma frena y llegan dos presupuestos más
export const ThreeQuotes: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 30);
  const sig = cl(f / Math.max(10, a)) * 0.55; // la firma se queda por la mitad
  const card = (i: number) => {
    const ki = i === 0 ? 1 : k(f, a + (i - 1) * 7, 12);
    return <div key={i} style={{ position: "absolute", left: 210 + i * 520, top: 210, width: 470, height: 640, background: C.paper, borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,.55)",
      transform: `translateX(${(1 - ki) * 900}px) rotate(${(i - 1) * 2.5}deg)`, opacity: ki }}>
      <div style={{ background: C.ink, color: C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: 40, padding: "18px 26px", letterSpacing: 3 }}>QUOTE {i + 1}</div>
      {[0, 1, 2, 3].map((r) => <div key={r} style={{ margin: "34px 30px 0", height: 4, background: "rgba(47,95,168,.25)" }} />)}
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 120, fontFamily: SERIF, fontSize: 30, color: C.ink }}>TOTAL {i === 0 ? <span style={{ fontFamily: HAND, fontSize: 54, color: CARBON }}>$16,000</span> : <span style={{ fontFamily: HAND, fontSize: 64, color: C.ver }}>?</span>}</div>
      {i === 0 && <svg width={420} height={90} style={{ position: "absolute", left: 30, bottom: 20 }}>
        <path d="M5 60 C 40 10, 60 80, 95 40 S 150 20, 170 55 S 230 70, 260 30 S 330 50, 400 40" fill="none" stroke={CARBON} strokeWidth={5} strokeDasharray={520} strokeDashoffset={520 * (1 - sig)} />
        <line x1={0} y1={80} x2={410} y2={80} stroke={C.ink} strokeWidth={2} /></svg>}
    </div>;
  };
  return <AbsoluteFill style={{ background: "#2b2117" }}>{[0, 1, 2].map(card)}<Stamp text="GET 3 QUOTES" at={Math.min(dur - 16, a + 22)} x={960} y={140} /></AbsoluteFill>;
};

// ==================== 3 · cutaway — el diagrama unifilar de la casa (vuelve 7 veces, cada vez con una acción nueva)
// geometría: poste+trafo (x 220) → medidor (640) → tablero (980-1290) → toma de entrada (1480) → generador (1720); standby punteado (1700, 860)
const Flow: React.FC<{ d: string; on: number; col: string; speed?: number; w?: number }> = ({ d, on, col, speed = 3, w = 9 }) => {
  const f = useCurrentFrame(); if (on <= 0) return null;
  return <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray="26 22" strokeDashoffset={-f * speed} opacity={on} style={{ filter: `drop-shadow(0 0 8px ${col})` }} />;
};
export const Cutaway: React.FC<P & { act: string }> = ({ act, m, dur }) => {
  const f = useCurrentFrame();
  const a0 = M(m, 0, Math.round(dur * 0.45));
  // estado de las llaves
  let mainOn = 1, genOn = 0, plate = 0; // plate 0 = tapa la del generador, 1 = corrida sobre la principal
  if (act === "interlock") { const p = io((f - a0) / 18); mainOn = 1 - p; plate = io((f - a0 - 14) / 16); genOn = io((f - a0 - 30) / 8); }
  if (act === "slot") { const p = (Math.sin((f - 30) / 22) + 1) / 2; plate = f > 30 ? p : 0; mainOn = 1 - plate; genOn = plate; }
  if (act === "suicide" || act === "backfeed") { mainOn = 1; genOn = 0; }
  const hiInlet = act === "backbone" ? k(f, 6) : 0, hiPlate = act === "backbone" ? k(f, 16) : act === "interlock" || act === "slot" ? 1 : 0;
  const red = C.ver, cop = "#e09a5a";
  const street = act === "backfeed" ? k(f, 10, 20) : act === "suicide" ? k(f, M(m, 0, 20), 14) : act === "transformer" ? 1 : 0;
  const volts = act === "transformer" ? interpolate(f, [a0, a0 + 40], [240, 7200], CL) : 0;
  const branches = act === "gate" ? [0, 1, 2, 3, 4, 5].map((i) => k(f, a0 + i * 5, 8)) : [0, 0, 0, 0, 0, 0].map(() => (act === "interlock" ? genOn : 0.25));
  const label = { backbone: "THE BACKBONE", gate: "THE GATE", backfeed: "BACKFEED", transformer: "IT WORKS BOTH WAYS", interlock: "THE SLIDE PLATE", suicide: "MAIN STILL ON", slot: "TOP SLOT · NEXT TO THE MAIN" }[act] || "";
  const camZ = act === "transformer" ? 1 + 0.18 * io(f / 40) : act === "slot" || act === "interlock" ? 1 + 0.22 * io(f / 30) : 1;
  const camO = act === "transformer" ? "14% 40%" : act === "slot" || act === "interlock" ? "58% 38%" : "50% 50%";
  return (
    <AbsoluteFill style={{ background: BLUEPRINT }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, transparent 0 59px, rgba(207,224,255,.07) 59px 60px), repeating-linear-gradient(90deg, transparent 0 59px, rgba(207,224,255,.07) 59px 60px)" }} />
      <AbsoluteFill style={{ transform: `scale(${camZ})`, transformOrigin: camO }}>
        <svg width={1920} height={1080}>
          {/* suelo y casa */}
          <line x1={0} y1={900} x2={1920} y2={900} stroke={LINE} strokeWidth={3} opacity={0.5} />
          <path d="M820 900 V 380 L 1180 200 L 1540 380 V 900" fill="none" stroke={LINE} strokeWidth={4} opacity={0.75} />
          {/* poste + trafo */}
          <line x1={220} y1={900} x2={220} y2={170} stroke={LINE} strokeWidth={10} /><line x1={150} y1={200} x2={290} y2={200} stroke={LINE} strokeWidth={8} />
          <rect x={240} y={260} width={70} height={100} rx={14} fill="none" stroke={volts > 300 ? red : LINE} strokeWidth={5} />
          {/* acometida y medidor */}
          <path d="M290 200 Q 560 300 640 470" fill="none" stroke={LINE} strokeWidth={4} />
          <circle cx={640} cy={520} r={46} fill="none" stroke={LINE} strokeWidth={5} /><line x1={686} y1={520} x2={1000} y2={330} stroke={LINE} strokeWidth={4} />
          {/* tablero */}
          <rect x={980} y={300} width={310} height={500} rx={10} fill="rgba(207,224,255,.06)" stroke={LINE} strokeWidth={5} />
          {/* principal (arriba izq) y generador (arriba der) */}
          <rect x={1020} y={330} width={100} height={60} rx={6} fill={mainOn > 0.5 ? "rgba(63,157,90,.35)" : "rgba(198,42,34,.25)"} stroke={LINE} strokeWidth={3} />
          <rect x={1062} y={340 + 22 * (1 - mainOn)} width={16} height={18} fill={LINE} />
          <text x={1070} y={420} fill={LINE} fontFamily={SANS} fontSize={20} textAnchor="middle">MAIN</text>
          <rect x={1160} y={330} width={100} height={60} rx={6} fill={genOn > 0.5 ? "rgba(63,157,90,.45)" : "rgba(207,224,255,.08)"} stroke={act === "slot" ? cop : LINE} strokeWidth={act === "slot" ? 6 : 3} />
          <rect x={1202} y={362 - 22 * genOn} width={16} height={18} fill={LINE} />
          <text x={1210} y={420} fill={LINE} fontFamily={SANS} fontSize={20} textAnchor="middle">GEN</text>
          {/* placa del interlock */}
          <rect x={1150 - 140 * plate} y={322} width={120} height={20} rx={4} fill={hiPlate ? cop : "#9fb3d8"} opacity={0.95} style={{ filter: hiPlate ? `drop-shadow(0 0 12px ${cop})` : undefined }} />
          {/* circuitos */}
          {branches.map((b, i) => <rect key={i} x={1020 + (i % 2) * 140} y={460 + Math.floor(i / 2) * 90} width={100} height={50} rx={5} fill={`rgba(255,214,120,${0.08 + 0.5 * b})`} stroke={LINE} strokeWidth={2} />)}
          {/* toma de entrada y generador */}
          <rect x={1520} y={640} width={70} height={80} rx={8} fill={hiInlet ? "rgba(224,154,90,.4)" : "none"} stroke={hiInlet ? cop : LINE} strokeWidth={5} />
          <path d="M1290 700 H 1520" fill="none" stroke={LINE} strokeWidth={4} />
          <rect x={1680} y={760} width={150} height={120} rx={14} fill="none" stroke={LINE} strokeWidth={5} /><text x={1755} y={830} fill={LINE} fontFamily={SANS} fontSize={22} textAnchor="middle">GEN</text>
          {act === "suicide" ? <path d="M1680 820 C 1500 860, 1380 780, 1300 760" fill="none" stroke={cop} strokeWidth={10} /> : <path d="M1680 800 C 1630 760, 1610 700, 1590 690" fill="none" stroke={LINE} strokeWidth={6} />}
          {act === "suicide" && <g opacity={k(f, 8)}><rect x={1270} y={744} width={34} height={32} fill={cop} /><line x1={1262} y1={752} x2={1240} y2={752} stroke={cop} strokeWidth={6} /><line x1={1262} y1={768} x2={1240} y2={768} stroke={cop} strokeWidth={6} />
            <rect x={1652} y={806} width={30} height={30} fill={cop} /><line x1={1650} y1={812} x2={1632} y2={812} stroke={cop} strokeWidth={6} /><line x1={1650} y1={828} x2={1632} y2={828} stroke={cop} strokeWidth={6} /></g>}
          <rect x={1620} y={930} width={190} height={110} rx={10} fill="none" stroke={LINE} strokeWidth={3} strokeDasharray="12 10" opacity={0.5} /><text x={1715} y={995} fill={LINE} opacity={0.6} fontFamily={SANS} fontSize={22} textAnchor="middle">STANDBY</text>
          {/* flujos */}
          <Flow d="M1680 800 C 1630 760, 1610 700, 1590 690 L 1520 700 H 1290 L 1210 390" on={act === "interlock" ? genOn : act === "backbone" ? k(f, 24) : act === "backfeed" ? k(f, 4) : 0} col={act === "backfeed" ? red : "#ffd27a"} />
          <Flow d="M1680 820 C 1500 860, 1380 780, 1300 760 L 1070 390" on={act === "suicide" ? k(f, 10) : 0} col={red} />
          <Flow d="M1070 330 L 1000 330 L 686 520 L 640 470 Q 560 300 290 200 L 275 300" on={street} col={red} speed={4} />
          <Flow d="M290 200 Q 560 300 640 470 L 686 520 L 1000 330 L 1070 330" on={act === "gate" ? k(f, 4) : 0} col="#ffd27a" />
        </svg>
        {volts > 0 && <div style={{ position: "absolute", left: 330, top: 250, fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: volts > 300 ? "#ff8a7a" : LINE, textShadow: "0 0 24px rgba(255,90,70,.6)" }}>{fmt(volts)} V</div>}
        {act === "transformer" && <div style={{ position: "absolute", left: 1000, top: 820, fontFamily: SERIF, fontWeight: 700, fontSize: 54, color: LINE }}>240 V</div>}
        {act === "interlock" && f > a0 + 6 && <div style={{ position: "absolute", left: 1330, top: 330, fontFamily: HAND, fontSize: 56, color: "#ffd27a", opacity: k(f, a0 + 6) }}>main OFF first →</div>}
        {(act === "backfeed" || act === "suicide") && <div style={{ position: "absolute", left: 360, top: 600, fontFamily: HAND, fontSize: 64, color: "#ff8a7a", opacity: street }}>← to the street</div>}
        {act === "backbone" && <><div style={{ position: "absolute", left: 1610, top: 610, fontFamily: HAND, fontSize: 56, color: cop, opacity: hiInlet }}>inlet</div><div style={{ position: "absolute", left: 1000, top: 245, fontFamily: HAND, fontSize: 56, color: cop, opacity: k(f, 16) }}>interlock</div></>}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.paper, letterSpacing: 4, opacity: k(f, 4), transform: `translateX(${(1 - k(f, 4)) * -40}px)` }}>{label}</div>
      <div style={{ position: "absolute", left: 84, top: 140, fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.gold, letterSpacing: 5, opacity: k(f, 8) }}>SINGLE-LINE · GARY'S PANEL</div>
    </AbsoluteFill>
  );
};

// ==================== 4 · ledger — el renglón del paso se escribe en la hoja; los anteriores quedan tildados
const STEPS = ["Make the list first", "Starting watts, not running", "Size the generator", "Licensed electrician", "The right cord", "Where it sits", "Practice in October", "Add the battery"];
export const Ledger: React.FC<P & { n: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const wr = Math.max(8, Math.min(26, dur - 6));
  return <Sheet title="THE SETUP · 8 STEPS" no={`11A-${n}`}>
    {STEPS.map((s, i) => {
      const done = i < n - 1, cur = i === n - 1;
      return <div key={i} style={{ position: "absolute", left: 160, top: 26 + i * 100, display: "flex", alignItems: "center", gap: 30, opacity: i > n - 1 ? 0.35 : 1 }}>
        <div style={{ width: 70, fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: cur ? C.ver : C.ink }}>{i + 1}.</div>
        {done ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CARBON }}>{s}</div> : cur ? <Hand text={s} at={2} len={wr} size={66} /> : <div style={{ width: 640, height: 3, background: "rgba(19,33,58,.25)" }} />}
        {done && <div style={{ fontFamily: HAND, fontSize: 64, color: GRN }}>✓</div>}
      </div>;
    })}
    {/* lápiz que escribe */}
    <div style={{ position: "absolute", left: 300 + 640 * cl((f - 2) / wr), top: 26 + (n - 1) * 100 - 30, width: 18, height: 160, background: `linear-gradient(180deg, ${C.gold} 0 82%, #333 82%)`, borderRadius: 4, transform: "rotate(28deg)", transformOrigin: "50% 100%", opacity: f < wr + 6 ? 1 : 0, boxShadow: "8px 10px 14px rgba(0,0,0,.25)" }} />
  </Sheet>;
};

// ==================== 5 · padflip — el talonario de órdenes: cinco hojas que se levantan, sello por cada una
export const PadFlip: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, Math.round(dur * 0.6));
  const T = Math.max(12, Math.floor(a / 5));
  const MIST = ["Suicide cord", "Inlet, no interlock", "Too close to the house", "Sized for the whole house", "No maintenance"];
  const top = Math.min(4, Math.floor(f / T));
  return <AbsoluteFill style={{ background: "#2b2117", perspective: 1600 }}>
    {MIST.map((t, i) => {
      const flip = io((f - (i + 1) * T) / 10) * (i < 4 ? 1 : 0);
      if (i < top - 1) return null;
      return <div key={i} style={{ position: "absolute", left: 560, top: 150, width: 800, height: 780, transformOrigin: "50% 0", transform: `rotateX(${flip * 170}deg)`, zIndex: 10 - i, background: C.paper, borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.55)", backfaceVisibility: "hidden" }}>
        <div style={{ height: 40, background: "repeating-linear-gradient(90deg, #555 0 14px, transparent 14px 34px)", opacity: 0.6 }} />
        <div style={{ padding: "30px 50px", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: C.ink, letterSpacing: 3 }}>WORK ORDER · MISTAKE {i + 1}</div>
        <div style={{ padding: "10px 50px", fontFamily: HAND, fontWeight: 700, fontSize: 76, color: CARBON }}>{t}</div>
        {[0, 1, 2].map((r) => <div key={r} style={{ margin: "40px 50px 0", height: 3, background: "rgba(47,95,168,.25)" }} />)}
        <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 780 }}>
          {f > i * T + 6 && <Stamp text={i >= 3 && f >= a ? "COULDN'T FIX" : "PAID TO FIX"} at={i >= 3 && f >= a ? a + (i - 3) * 6 : i * T + 6} x={420} y={600} col={i >= 3 && f >= a ? C.ver : "#2c6b45"} />}
        </div>
      </div>;
    })}
  </AbsoluteFill>;
};

// ==================== 6 · hotfloor — la punta suelta en el piso: el círculo de peligro se abre y el pie frena
export const HotFloor: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 30), b = M(m, 1, 80), c = M(m, 2, Math.round(dur * 0.75));
  const glow = k(f, a, 10), ring = (f - a) % 40 / 40;
  const foot = interpolate(f, [c - 30, c], [520, 120], { ...CL, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #5b4330 0 180px, #4d382a 180px 184px)" }}>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(0,0,0,0), rgba(0,0,0,.55))" }} />
    <svg width={1920} height={1080}>
      <path d="M -40 760 C 300 700, 500 860, 820 600" fill="none" stroke="#1b1b1b" strokeWidth={34} strokeLinecap="round" />
      <rect x={800} y={540} width={140} height={110} rx={16} fill="#222" transform="rotate(-30 870 595)" />
      {[0, 1, 2].map((i) => <rect key={i} x={935} y={548 + i * 28} width={90} height={14} rx={3} fill={`rgb(${190 + 65 * glow},${190 - 60 * glow},${150 - 110 * glow})`} transform="rotate(-30 870 595)" style={{ filter: glow > 0.1 ? `drop-shadow(0 0 ${18 * glow}px #ff7a30)` : undefined }} />)}
      {glow > 0 && [0, 0.5].map((o, i) => { const r = ((ring + o) % 1); return <circle key={i} cx={960} cy={560} r={120 + 420 * r} fill="none" stroke={C.ver} strokeWidth={6} opacity={(1 - r) * glow} />; })}
    </svg>
    {f > b && <div style={{ position: "absolute", left: 1160, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#ffd1c4", textShadow: "0 0 30px rgba(255,80,50,.8)", transform: `scale(${Math.min(1.1, pop(f, b))})` }}>240 V</div>}
    {f > b + 10 && <div style={{ position: "absolute", left: 1170, top: 470, fontFamily: HAND, fontSize: 64, color: C.paper, opacity: k(f, b + 10) }}>live · bare metal</div>}
    {f > c - 30 && <div style={{ position: "absolute", left: 300, bottom: foot - 600, width: 230, height: 420, borderRadius: "110px 110px 60px 60px", background: "linear-gradient(180deg,#9aa3ad,#6f7782)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />}
  </AbsoluteFill>;
};

// ==================== 7 · leafhour — cae una hoja de otoño sobre la semana; se circula el sábado y se da vuelta el reloj de arena
export const LeafHour: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 30), b = M(m, 1, 80);
  const lx = interpolate(f, [0, a], [520, 1515], { ...CL, easing: Easing.inOut(Easing.sin) }) + Math.sin(f / 6) * 40 * (1 - cl(f / a));
  const ly = interpolate(f, [0, a], [-120, 480], CL);
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const flip = io((f - b) / 14);
  return <Sheet title="OCTOBER · FALL ROUTINE" no="11A-F">
    {days.map((d, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 205, top: 300, width: 160, height: 180, border: `3px solid ${C.ink}`, borderRadius: 8, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.85 }}>{d}</div>)}
    <div style={{ position: "absolute", left: -130, top: -160 }}><Circle at={a + 4} x={1520 - 130 + 130} y={390 + 160 - 92 + 92} w={210} h={230} /></div>
    <div style={{ position: "absolute", left: lx - 130, top: ly - 92, fontSize: 120, transform: `rotate(${f * 4 * (1 - cl(f / a)) - 20}deg)`, filter: "drop-shadow(6px 10px 8px rgba(0,0,0,.3))" }}>🍁</div>
    <div style={{ position: "absolute", left: 640, top: 560, width: 120, height: 220, transform: `rotate(${180 * flip}deg)`, transformOrigin: "50% 50%" }}>
      <svg width={120} height={220}><path d="M10 10 H110 L60 110 L110 210 H10 L60 110 Z" fill="rgba(255,255,255,.4)" stroke={C.ink} strokeWidth={5} />
        <path d={`M${60 - 40 * (1 - cl((f - b - 14) / 60))} ${10 + 20} H${60 + 40 * (1 - cl((f - b - 14) / 60))} L60 110 Z`} fill={C.gold} /></svg>
    </div>
    {f > b && <div style={{ position: "absolute", left: 820, top: 600 }}><Hand text="about 2 hours" at={b + 8} len={16} size={84} /></div>}
  </Sheet>;
};

// ==================== 8 · keys102 — las tres teclas del selector 1·0·2 se hunden de a una
export const Keys102: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame();
  const KEYS = [["1", "UTILITY"], ["0", "OFF"], ["2", "GENERATOR"]];
  const at = [M(m, 0, 20), M(m, 1, 60), M(m, 2, 100)];
  const cur = at.reduce((c, t, i) => (f >= t ? i : c), -1);
  return <AbsoluteFill style={{ background: "#1a1d22" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.1), transparent 60%)" }} />
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 620, borderRadius: 30, background: "linear-gradient(180deg,#8c9198,#5d6168)", boxShadow: "0 40px 80px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.4)" }}>
      {KEYS.map(([n, l], i) => {
        const dn = cur === i ? 1 : 0, p = io((f - at[i]) / 6) * dn;
        return <div key={i} style={{ position: "absolute", left: 90 + i * 360, top: 110, width: 300 }}>
          <div style={{ height: 260, borderRadius: 20, background: cur === i ? "linear-gradient(180deg,#f2efe6,#d8d2c2)" : "linear-gradient(180deg,#e9e5da,#c9c2b1)", boxShadow: `0 ${26 - 20 * p}px 0 #6d6a62, 0 ${34 - 20 * p}px 30px rgba(0,0,0,.5)`, transform: `translateY(${p * 20}px)`,
            fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
          <div style={{ marginTop: 60, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: cur === i ? (i === 2 ? "#ffd27a" : "#d7f2dd") : "rgba(255,255,255,.55)" }}>{l}</div>
          <div style={{ margin: "18px auto 0", width: 34, height: 34, borderRadius: 17, background: cur === i ? (i === 1 ? "#c9c9c9" : i === 2 ? "#ffb347" : "#5fd47c") : "#333", boxShadow: cur === i ? "0 0 22px #ffd27a" : "none" }} />
        </div>;
      })}
    </div>
    <Stamp text="A PROPER TRANSFER SWITCH" at={Math.min(dur - 20, at[2] + 30)} x={960} y={930} col="#2c6b45" size={54} />
  </AbsoluteFill>;
};

// ==================== 9 · billcount — la columna del standby: los billetes se apilan con el contador
export const BillCount: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame();
  const at = [M(m, 0, 20), M(m, 1, 120), M(m, 2, 220), M(m, 3, 420), M(m, 4, 500)];
  const n = Math.round(interpolate(f, [at[0], at[0] + 40], [0, 26], CL));
  const usd = interpolate(f, [at[0], at[0] + 40], [0, 16000], CL);
  return <Sheet title="ROUTE A · STANDBY" no="11A-S">
    <div style={{ position: "absolute", left: 160, top: 640, width: 520 }}>
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: (hash(i) % 30) - 15, top: -i * 20, width: 460, height: 120, background: "linear-gradient(90deg,#c8d2b4,#aebb98)", border: "3px solid #7c8a68", borderRadius: 6, transform: `rotate(${(hash(i + 9) % 7) - 3}deg)` }}>
        <div style={{ position: "absolute", left: 180, top: 22, width: 76, height: 76, borderRadius: 38, border: "3px solid #7c8a68" }} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 760, top: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: C.ink, letterSpacing: 3 }}>INSTALLED</div>
    <div style={{ position: "absolute", left: 760, top: 110, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CARBON }}>${fmt(Math.min(usd, 8000))}{usd > 8000 ? "–" + fmt(usd) : ""}</div>
    {[["SERVICE", "$200–400 / yr", 1], ["FUEL", "~2 gal propane / hr", 2], ["", "fully automatic", 3], ["", "runs everything", 4]].map(([h, t, i]) => f > at[i as number] ? <div key={i as number} style={{ position: "absolute", left: 760, top: 300 + ((i as number) - 1) * 130, opacity: k(f, at[i as number]) }}>
      {h && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 4, color: C.gold }}>{h}</div>}<Hand text={t as string} at={at[i as number]} len={16} size={70} /></div> : null)}
  </Sheet>;
};

// ==================== 10 · spindle — los recibos se clavan uno por uno en el pinche del banco
export const Spindle: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame();
  const R = [["Inlet + interlock", "$500–1,200"], ["Inverter generator", "$600–1,200"], ["Power station", "$500–1,200"], ["Fuel", "a few gal / day"]];
  const at = [M(m, 0, 20), M(m, 1, 120), M(m, 2, 220), M(m, 3, 320)];
  return <AbsoluteFill style={{ background: "linear-gradient(180deg,#3a2a1c,#251a11)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.paper, letterSpacing: 4 }}>ROUTE B · GARY'S ROUTE</div>
    <div style={{ position: "absolute", left: 956, top: 220, width: 8, height: 600, background: "linear-gradient(90deg,#999,#eee,#888)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 860, top: 810, width: 200, height: 40, borderRadius: 20, background: "#222" }} />
    {R.map(([a, b], i) => {
      const d = cl((f - at[i]) / 10), y = interpolate(d, [0, 1], [-500, 720 - i * 110]);
      if (f < at[i] - 1) return null;
      return <div key={i} style={{ position: "absolute", left: 960 - 330 + ((hash(i) % 60) - 30), top: y - 200, width: 660, height: 200, background: "#fbf8f0", borderRadius: 3, boxShadow: "0 12px 24px rgba(0,0,0,.45)", transform: `rotate(${(hash(i + 3) % 9) - 4}deg)`, padding: "22px 40px", fontFamily: "'Courier New', monospace", zIndex: i,
        maskImage: "radial-gradient(circle at 50% 50%, transparent 10px, #000 11px)" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#333" }}>{a}</div><div style={{ fontSize: 66, fontWeight: 900, color: C.ver }}>{b}</div></div>;
    })}
    {f > at[3] + 40 && <div style={{ position: "absolute", right: 120, bottom: 120, fontFamily: HAND, fontSize: 70, color: "#ffd27a", opacity: k(f, at[3] + 40) }}>you do the switching</div>}
  </AbsoluteFill>;
};

// ==================== 11 · clothesline — las etiquetas de cada aparato se cuelgan de la soga con broches
export const Clothesline: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 4), M(m, 1, 150)];
  const T = [["FRIDGE", "150 W", "800 W"], ["CHEST FREEZER", "100 W", "500 W"]];
  return <AbsoluteFill style={{ background: "linear-gradient(180deg,#cfd8e0,#9fb0bf)" }}>
    <svg width={1920} height={1080}><path d="M -20 220 Q 960 330 1940 220" fill="none" stroke="#5a4a3a" strokeWidth={6} /></svg>
    {T.map(([n, r, s], i) => {
      const d = k(f, at[i], 14); if (d <= 0) return null;
      const sw = Math.sin((f - at[i]) / 7) * 9 * Math.exp(-(f - at[i]) / 40);
      return <div key={i} style={{ position: "absolute", left: 380 + i * 640, top: 270, transformOrigin: "50% 0", transform: `translateY(${(1 - d) * -400}px) rotate(${sw}deg)` }}>
        <div style={{ margin: "0 auto", width: 40, height: 90, background: "#c9a26b", borderRadius: 6 }} />
        <div style={{ width: 520, height: 520, background: C.paper, borderRadius: 14, boxShadow: "0 30px 50px rgba(0,0,0,.35)", padding: "40px 46px", clipPath: "polygon(12% 0, 88% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.ink }}>{n}</div>
          <div style={{ marginTop: 30, fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.gold }}>RUNNING</div><Hand text={r} at={at[i] + 10} size={96} />
          <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.ver }}>TO START</div><Hand text={s} at={at[i] + 30} size={96} col={C.ver} />
        </div>
      </div>;
    })}
    <div style={{ position: "absolute", left: 80, bottom: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: C.ink, letterSpacing: 3 }}>LARRY'S LIST · RANCH HOUSE</div>
  </AbsoluteFill>;
};

// ==================== 12 · splitflap — el cartel de paletas va dando la cuenta de Larry
const Flap: React.FC<{ text: string; at: number; w?: number }> = ({ text, at, w = 60 }) => {
  const f = useCurrentFrame(); const CH = " 0123456789,+-WK";
  return <div style={{ display: "flex", gap: 6 }}>{text.split("").map((c, i) => {
    const t = f - at - i * 2; const done = t > 10;
    const ch = done ? c : t > 0 ? CH[(hash(i * 13 + Math.floor(t)) % CH.length)] : " ";
    return <div key={i} style={{ width: w, height: w * 1.45, background: "#161616", borderRadius: 6, color: "#f5f0e0", fontFamily: SANS, fontWeight: 600, fontSize: w * 1.05, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "inset 0 -2px 0 #000" }}>
      {ch}<div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 3, background: "#000" }} /></div>;
  })}</div>;
};
export const SplitFlap: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 10), M(m, 1, 100), M(m, 2, 220), M(m, 3, 420)];
  const rows = [["RUNNING", "1,800 W"], ["BIGGEST START", "2,000 W"], ["SURGE ON TOP", "+1,200 W"], ["GENERATOR", "3K-4K W"]];
  return <AbsoluteFill style={{ background: "#1a2433" }}>
    <div style={{ position: "absolute", left: 140, top: 90, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: C.paper, letterSpacing: 4 }}>ADD IT UP</div>
    {rows.map(([l, v], i) => f >= at[i] - 2 ? <div key={i} style={{ position: "absolute", left: 140, top: 230 + i * 200, display: "flex", alignItems: "center", gap: 50, opacity: k(f, at[i] - 2, 6) }}>
      <div style={{ width: 560, fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 5, color: i === 3 ? "#ffd27a" : "rgba(245,240,224,.8)" }}>{l}</div><Flap text={v} at={at[i]} w={i === 3 ? 92 : 80} /></div> : null)}
    {f > at[1] && <div style={{ position: "absolute", left: 1500, top: 430, fontFamily: HAND, fontSize: 54, color: "#ff8a7a" }}>sump pump</div>}
  </AbsoluteFill>;
};

// ==================== 13 · addtape — la cinta de la sumadora imprime renglón por renglón
export const AddTape: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 10), b = M(m, 1, 100);
  const L = [["INLET + INTERLOCK", "950.00"], ["GENERATOR 4,500 W", "1,100.00"], ["POWER STATION", "GIFT"], ["", ""], ["TOTAL", "2,050.00 *"]];
  const shown = Math.min(L.length, Math.floor(Math.max(0, f + 4) / 6));
  return <AbsoluteFill style={{ background: "#2b2117" }}>
    <div style={{ position: "absolute", left: 360, top: 800, width: 640, height: 220, background: "linear-gradient(180deg,#4a4f57,#2c3036)", borderRadius: 26 }} />
    <div style={{ position: "absolute", left: 420, top: 800 - shown * 110 - 40, width: 520, height: shown * 110 + 40, background: "#fbfaf4", fontFamily: "'Courier New', monospace", padding: "20px 30px", boxShadow: "0 0 30px rgba(0,0,0,.4)" }}>
      {L.slice(0, shown).map(([t, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", height: 110, alignItems: "center", fontSize: i === 4 ? 46 : 34, fontWeight: 900, color: i === 4 ? C.ver : "#222", borderTop: i === 4 ? "3px dashed #999" : undefined }}><span>{t}</span><span>{v}</span></div>)}
    </div>
    {f > b && <div style={{ position: "absolute", left: 1120, top: 360, width: 620, padding: "26px 34px", background: C.paper, transform: `rotate(3deg) translateX(${(1 - k(f, b, 10)) * 700}px)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.ink }}>STANDBY QUOTE</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 110, color: CARBON, position: "relative", display: "inline-block" }}>$16,000
        <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 9, background: C.ver, transformOrigin: "0 50%", transform: `scaleX(${k(f, b + 14, 10)}) rotate(-4deg)` }} /></div></div>}
  </AbsoluteFill>;
};

// ==================== 14 · ldl — las puntas del tester saltan: vivo, muerto, vivo
export const LDL: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 20), M(m, 1, 90), M(m, 2, 150), M(m, 3, 220)];
  const pos = f < at[1] ? 0 : f < at[2] ? 1 : 2;
  const X = [430, 960, 1490];
  const px = interpolate(f, [at[1] - 8, at[1], at[2] - 8, at[2]], [X[0], X[1], X[1], X[2]], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const v = pos === 1 ? 0 : f < at[0] ? 0 : 120;
  return <Sheet title="LIVE · DEAD · LIVE" no="11A-T" dark>
    {["KNOWN LIVE", "THE PANEL", "KNOWN LIVE"].map((t, i) => <div key={i} style={{ position: "absolute", left: X[i] - 130 - 130, top: 330, width: 260, height: 260, borderRadius: 18, border: `5px solid ${C.ink}`, background: i === 1 ? "rgba(19,33,58,.08)" : "rgba(63,157,90,.08)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ display: "flex", gap: 30 }}><div style={{ width: 18, height: 60, background: C.ink, borderRadius: 4 }} /><div style={{ width: 18, height: 60, background: C.ink, borderRadius: 4 }} /></div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: C.ink }}>{t}</div></div>)}
    <div style={{ position: "absolute", left: px - 130 - 30, top: 200, width: 60, height: 150, background: `linear-gradient(180deg, ${C.ver} 0 75%, #ccc 75%)`, borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 700, top: 640, width: 520, height: 170, background: "#f2c230", borderRadius: 22, boxShadow: "0 20px 40px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 440, height: 110, background: "#b7c4a8", borderRadius: 8, fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 84, color: "#1d2618", textAlign: "right", padding: "0 26px", lineHeight: "110px" }}>{v} V</div></div>
    <div style={{ position: "absolute", left: 0, top: 0 }}><Stamp text={pos === 1 ? "DEAD" : "LIVE"} at={pos === 0 ? at[0] : at[pos]} x={X[pos] - 130} y={630} col={pos === 1 ? C.ink : "#2c6b45"} size={50} /></div>
  </Sheet>;
};

// ==================== 15 · tally24 — el reloj de 24 h se pinta por turnos y al costado se cuentan los galones con palotes
export const Tally24: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 10), M(m, 1, 150), M(m, 2, 260), M(m, 3, 360)];
  const R = 270, cx = 560, cy = 560;
  const paint = cl((f - at[1]) / 60);
  const seg = (h0: number, h1: number) => { const a0 = (h0 / 24) * 2 * Math.PI - Math.PI / 2, a1 = (h1 / 24) * 2 * Math.PI - Math.PI / 2; return `M ${cx} ${cy} L ${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`; };
  const shifts = [[0, 4], [6, 10], [12, 16], [18, 22]];
  const gal = Math.round(interpolate(f, [at[3], at[3] + 50], [0, 12], CL));
  return <Sheet title="FUEL · ONE DAY OF OUTAGE" no="11A-G">
    <svg width={1660} height={850} style={{ position: "absolute", left: 0, top: -92 }}>
      <circle cx={cx} cy={cy} r={R + 14} fill="none" stroke={C.ink} strokeWidth={6} />
      {shifts.map(([a, b], i) => { const p = cl(paint * 4 - i); return p > 0 ? <path key={i} d={seg(a, a + (b - a) * p)} fill="rgba(184,115,58,.55)" /> : null; })}
      {Array.from({ length: 24 }, (_, h) => { const an = (h / 24) * 2 * Math.PI - Math.PI / 2; return <line key={h} x1={cx + (R - 10) * Math.cos(an)} y1={cy + (R - 10) * Math.sin(an)} x2={cx + R * Math.cos(an)} y2={cy + R * Math.sin(an)} stroke={C.ink} strokeWidth={h % 6 ? 2 : 5} />; })}
      <text x={cx} y={cy + 20} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={C.ink}>{f > at[2] ? "12–16 h" : "24 h"}</text>
    </svg>
    <div style={{ position: "absolute", left: 960, top: 70 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.gold }}>HALF LOAD BURNS</div><Hand text="½ – ¾ gal / hour" at={at[0]} size={76} /></div>
    {f > at[1] && <div style={{ position: "absolute", left: 960, top: 260 }}><Hand text="4 on · 2 off" at={at[1]} size={76} col={C.gold} /></div>}
    {f > at[3] && <div style={{ position: "absolute", left: 960, top: 450 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.ver }}>GALLONS A DAY · 8 TO 12</div>
      <svg width={620} height={160}>{Array.from({ length: gal }, (_, i) => { const g = Math.floor(i / 5), j = i % 5; return j < 4 ? <line key={i} x1={20 + g * 150 + j * 26} y1={20} x2={14 + g * 150 + j * 26} y2={140} stroke={CARBON} strokeWidth={8} strokeLinecap="round" /> : <line key={i} x1={0 + g * 150} y1={110} x2={110 + g * 150} y2={40} stroke={C.ver} strokeWidth={8} strokeLinecap="round" />; })}</svg></div>}
  </Sheet>;
};

// ==================== 16 · tankchain — cuatro garrafas en cadena; la llama pasa de una a otra y cada una corre su cuentahoras
export const TankChain: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 30), M(m, 1, 180), M(m, 2, 260)];
  const per = Math.max(12, Math.floor((at[1] - at[0]) / 2));
  const active = f < at[1] ? 0 : Math.min(3, Math.floor((f - at[1]) / 14) + 1);
  return <AbsoluteFill style={{ background: "linear-gradient(180deg,#dfe6ea,#b9c4cc)" }}>
    <svg width={1920} height={1080}><path d="M 300 760 C 500 860, 600 860, 760 760 S 1000 660, 1160 760 S 1400 860, 1560 760" fill="none" stroke="#333" strokeWidth={10} /></svg>
    {[0, 1, 2, 3].map((i) => {
      const on = i === active, hrs = i < active ? 10 : on ? Math.round(interpolate(f, [i === 0 ? at[0] : at[1] + (i - 1) * 14, (i === 0 ? at[0] : at[1] + (i - 1) * 14) + (i === 0 ? per : 12)], [0, 10], CL)) : 0;
      return <div key={i} style={{ position: "absolute", left: 200 + i * 430, top: 300, width: 220 }}>
        <div style={{ margin: "0 auto", width: 120, height: 60, border: "8px solid #8a9096", borderBottom: "none", borderRadius: "30px 30px 0 0" }} />
        <div style={{ width: 220, height: 360, borderRadius: "70px 70px 50px 50px", background: i < active ? "linear-gradient(90deg,#c9ccce,#f4f4f4,#c9ccce)" : "linear-gradient(90deg,#d9dcde,#ffffff,#d9dcde)", boxShadow: on ? "0 0 40px rgba(255,190,90,.8)" : "0 20px 40px rgba(0,0,0,.25)", opacity: i < active ? 0.6 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 56, color: C.ink }}>{hrs} h</div>
        {on && <div style={{ position: "absolute", left: 80, top: -120, fontSize: 70, transform: `scale(${1 + 0.1 * Math.sin(f / 3)})` }}>🔥</div>}
      </div>;
    })}
    <div style={{ position: "absolute", left: 120, top: 80, fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: C.ink, letterSpacing: 3 }}>20 LB TANK · 8–10 HOURS · HALF LOAD</div>
    {f > at[1] + 50 && <div style={{ position: "absolute", left: 130, top: 170 }}><Hand text="four tanks = a long weekend" at={at[1] + 50} size={70} col={C.gold} /></div>}
    <Stamp text="DOESN'T GO STALE" at={at[2]} x={1500} y={190} col="#2c6b45" size={48} />
  </AbsoluteFill>;
};

// ==================== 17 · dominoes — tres fichas: garaje, porche, sótano; cada una cae al nombrarla
export const Dominoes: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 60), M(m, 1, 140), M(m, 2, 210)];
  const D = [["GARAGE", "door open"], ["PORCH", "under a window"], ["BASEMENT", ""]];
  return <AbsoluteFill style={{ background: "#16120e", perspective: 1400 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: C.paper, letterSpacing: 4 }}>ONE OF THREE THINGS</div>
    {D.map(([a, b], i) => {
      const fall = io((f - at[i] - 6) / 14);
      return <div key={i} style={{ position: "absolute", left: 300 + i * 500, top: 260, width: 300, height: 600, transformOrigin: "50% 100%", transform: `rotateX(${fall * 78}deg)`, background: "linear-gradient(180deg,#f4efe3,#ddd3bd)", borderRadius: 24, boxShadow: "0 30px 60px rgba(0,0,0,.6)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: f < at[i] - 20 ? 0.25 : 1 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.ink }}>{a}</div>
        <div style={{ width: 200, height: 4, background: C.ink }} />
        <div style={{ fontFamily: HAND, fontSize: 52, color: CARBON }}>{b}</div>
        {f > at[i] && <div style={{ position: "absolute", fontFamily: SERIF, fontWeight: 900, fontSize: 300, color: C.ver, opacity: 0.85 * k(f, at[i], 6) }}>×</div>}
      </div>;
    })}
  </AbsoluteFill>;
};

// ==================== 18 · directory — el repaso se escribe en la tarjeta de circuitos de la puerta del tablero
export const Directory: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame();
  const L = ["Standby: $8–16K installed", "  sign it: medical equipment", "  sign it: well + away half the year", "  sign it: week-long outages + gas", "Inlet + interlock + permit · $500–1,200", "Inverter gen · 20 ft out · $600–1,200", "Power station · $500–1,200"];
  const at = L.map((_, i) => M(m, i, 40 + i * 150));
  return <AbsoluteFill style={{ background: "linear-gradient(180deg,#7d848c,#5a6168)" }}>
    <div style={{ position: "absolute", left: 210, top: 70, width: 1500, height: 940, background: C.paper, borderRadius: 8, boxShadow: "0 30px 70px rgba(0,0,0,.6)", transform: "rotate(-.6deg)" }}>
      <div style={{ padding: "26px 40px", fontFamily: SERIF, fontWeight: 900, fontSize: 46, letterSpacing: 4, color: C.ink, borderBottom: `4px solid ${C.ink}` }}>CIRCUIT DIRECTORY · THE RECAP</div>
      {L.map((t, i) => <div key={i} style={{ position: "absolute", left: 40, top: 120 + i * 112, right: 40, height: 112, borderBottom: "2px solid rgba(19,33,58,.3)", display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 60, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.gold }}>{String(i + 1).padStart(2, "0")}</div>
        <Hand text={t} at={at[i]} len={20} size={60} />
        {f > at[i] + 24 && <div style={{ marginLeft: "auto", fontFamily: HAND, fontSize: 64, color: GRN }}>✓</div>}
      </div>)}
    </div>
  </AbsoluteFill>;
};

// ==================== 19 · tripbank — las tres "nunca": cada breaker salta con la bandera roja
export const TripBank: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 4), M(m, 1, 76), M(m, 2, 150)];
  const B = ["A CORD WITH TWO MALE ENDS", "AN INLET WITHOUT AN INTERLOCK", "A GENERATOR IN THE GARAGE"];
  return <AbsoluteFill style={{ background: "#202328" }}>
    <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, background: "linear-gradient(180deg,#9aa0a7,#7b8189)", borderRadius: 18, boxShadow: "inset 0 2px 0 rgba(255,255,255,.4), 0 40px 80px rgba(0,0,0,.6)" }}>
      {B.map((t, i) => {
        const tr = io((f - at[i]) / 5);
        return <div key={i} style={{ position: "absolute", left: 80, top: 60 + i * 270, width: 1240, height: 220, display: "flex", alignItems: "center", gap: 50 }}>
          <div style={{ width: 300, height: 200, background: "#1d1f22", borderRadius: 12, position: "relative" }}>
            <div style={{ position: "absolute", left: 100, top: 30 + 60 * tr, width: 100, height: 80, background: "#2e3135", borderRadius: 8, boxShadow: "0 6px 0 #000" }} />
            {tr > 0.5 && <div style={{ position: "absolute", right: 10, top: 10, width: 40, height: 40, background: C.ver, borderRadius: 4 }} />}
          </div>
          <div><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: tr > 0.5 ? C.ver : "rgba(19,33,58,.5)", letterSpacing: 4 }}>NEVER</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: 2, opacity: 0.4 + 0.6 * tr }}>{t}</div></div>
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

// ==================== 20 · toggles3 — tres palancas en la chapa: cada tarea sube su llave y prende la luz verde
export const Toggles3: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const at = [M(m, 0, 4), M(m, 1, 100), M(m, 2, 160)];
  const T = ["LIST WITH STARTING WATTS", "PRACTICE IN OCTOBER", "CARD INSIDE THE PANEL DOOR"];
  return <AbsoluteFill style={{ background: "#14181d" }}>
    {T.map((t, i) => {
      const up = io((f - at[i]) / 5);
      return <div key={i} style={{ position: "absolute", left: 200 + i * 540, top: 200, width: 440, height: 680, background: "linear-gradient(180deg,#d9d4c7,#b6af9e)", borderRadius: 26, boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginTop: 60, width: 46, height: 46, borderRadius: 23, background: up > 0.5 ? "#59d47a" : "#3a3f3b", boxShadow: up > 0.5 ? "0 0 30px #59d47a" : "none" }} />
        <div style={{ marginTop: 50, width: 150, height: 240, background: "#efece4", borderRadius: 14, position: "relative", boxShadow: "inset 0 4px 10px rgba(0,0,0,.3)" }}>
          <div style={{ position: "absolute", left: 50, top: 120 - 90 * up, width: 50, height: 110, background: "linear-gradient(90deg,#999,#eee,#999)", borderRadius: 25, transformOrigin: "50% 100%", transform: `rotate(${(1 - up) * 0}deg)` }} />
        </div>
        <div style={{ marginTop: 50, padding: "0 30px", textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 2, color: C.ink }}>{t}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// ==================== overlays sobre material real (mecanismos 21-32)
const Corner: React.FC<{ children: React.ReactNode; dur: number; side?: "l" | "r"; y?: number }> = ({ children, dur, side = "l", y = 680 }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", [side === "l" ? "left" : "right"]: 90, top: y, opacity: o, transform: `translateY(${(1 - k(f, 0, 10)) * 30}px)` } as React.CSSProperties}>{children}</div>;
};
// 21 · nameplate — la cinta de la rotuladora se marca letra por letra
export const NamePlate: React.FC<{ dur: number; text: string; sub: string }> = ({ dur, text, sub }) => {
  const f = useCurrentFrame(); const n = Math.floor(cl(f / 26) * text.length);
  return <Corner dur={dur} y={820}><div style={{ display: "inline-block", background: "#1d2a4a", padding: "14px 30px", borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,.5)", fontFamily: SANS, fontWeight: 600, fontSize: 54, letterSpacing: 8, color: "#f0f0f0", textShadow: "0 -2px 0 rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,.4)" }}>{text.slice(0, n)}</div>
    <div style={{ marginTop: 12, fontFamily: HAND, fontSize: 46, color: C.paper, textShadow: "0 2px 10px #000", opacity: k(f, 28) }}>{sub}</div></Corner>;
};
// 22 · hangtag — etiqueta colgante con el consumo del aparato
export const HangTag: React.FC<{ dur: number; title: string; run: string; start?: string }> = ({ dur, title, run, start }) => {
  const f = useCurrentFrame(); const sw = Math.sin(f / 8) * 6 * Math.exp(-f / 50);
  return <Corner dur={dur} side="r" y={110}><div style={{ transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
    <svg width={40} height={70} style={{ display: "block", margin: "0 auto" }}><path d="M20 0 Q 30 35 20 70" stroke={C.paper} strokeWidth={3} fill="none" /></svg>
    <div style={{ width: 400, background: C.paper, borderRadius: 12, padding: "28px 32px", boxShadow: "0 20px 40px rgba(0,0,0,.5)", clipPath: "polygon(14% 0, 86% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: C.ink }}>{title}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: CARBON }}>{run}</div>
      {start && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: C.ver }}>{start}</div>}</div></div></Corner>;
};
// 23 · pencilnote — nota de lápiz con flecha dibujada hacia el centro del cuadro
export const PencilNote: React.FC<{ dur: number; text: string; side?: "l" | "r" }> = ({ dur, text, side = "l" }) => {
  const f = useCurrentFrame(); const p = cl((f - 8) / 14); const o = 1 - k(f, dur - 10, 10);
  const x0 = side === "l" ? 330 : 1590, x1 = side === "l" ? 760 : 1160;
  const d = `M ${x0} 300 Q ${(x0 + x1) / 2} ${200} ${x1} 420`;
  return <AbsoluteFill style={{ opacity: o }}>
    <svg width={1920} height={1080}><path d={d} fill="none" stroke={C.paper} strokeWidth={7} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - p)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />
      {p > 0.95 && <path d={`M ${x1} 420 l ${side === "l" ? -40 : 40} -8 M ${x1} 420 l ${side === "l" ? -14 : 14} -38`} stroke={C.paper} strokeWidth={7} strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />}</svg>
    <div style={{ position: "absolute", [side === "l" ? "left" : "right"]: 110, top: 200 } as React.CSSProperties}><Hand text={text} at={0} len={12} size={78} col={C.paper} style={{ textShadow: "0 3px 12px rgba(0,0,0,.9)" }} /></div>
  </AbsoluteFill>;
};
// 24 · stopwatch — cronómetro mecánico que corre hasta los minutos dichos
export const Stopwatch: React.FC<{ dur: number; min: number; label: string }> = ({ dur, min, label }) => {
  const f = useCurrentFrame(); const a = cl(f / Math.min(50, dur - 12)) * (min / 60) * 360;
  return <Corner dur={dur} side="r" y={130}><div style={{ display: "flex", alignItems: "center", gap: 26 }}>
    <svg width={240} height={270}><rect x={105} y={0} width={30} height={30} rx={6} fill="#c9c9c9" /><circle cx={120} cy={150} r={112} fill={C.paper} stroke="#c9c9c9" strokeWidth={12} />
      {Array.from({ length: 12 }, (_, i) => { const an = (i / 12) * Math.PI * 2; return <line key={i} x1={120 + 92 * Math.sin(an)} y1={150 - 92 * Math.cos(an)} x2={120 + 104 * Math.sin(an)} y2={150 - 104 * Math.cos(an)} stroke={C.ink} strokeWidth={4} />; })}
      <path d={`M120 150 L ${120 + 100 * Math.sin(0)} ${150 - 100} A 100 100 0 ${a > 180 ? 1 : 0} 1 ${120 + 100 * Math.sin((a * Math.PI) / 180)} ${150 - 100 * Math.cos((a * Math.PI) / 180)} Z`} fill="rgba(198,42,34,.25)" />
      <line x1={120} y1={150} x2={120 + 96 * Math.sin((a * Math.PI) / 180)} y2={150 - 96 * Math.cos((a * Math.PI) / 180)} stroke={C.ver} strokeWidth={6} strokeLinecap="round" /></svg>
    <div><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: C.paper, textShadow: "0 3px 14px #000" }}>{min} min</div><div style={{ fontFamily: HAND, fontSize: 46, color: C.paper, textShadow: "0 3px 10px #000" }}>{label}</div></div></div></Corner>;
};
// 25 · inspstamp — sello del inspector PASSED / FAILED sobre la toma
export const InspStamp: React.FC<{ dur: number; pass: boolean; sub: string }> = ({ dur, pass, sub }) => {
  const f = useCurrentFrame(); const o = 1 - k(f, dur - 10, 10);
  return <AbsoluteFill style={{ opacity: o }}><Stamp text={pass ? "PASSED" : "FAILED"} at={4} x={1450} y={300} col={pass ? "#3fae62" : "#e0473c"} size={110} rot={pass ? -6 : 7} />
    {f > 14 && <div style={{ position: "absolute", left: 1150, top: 410, width: 600, textAlign: "center", fontFamily: HAND, fontSize: 50, color: C.paper, textShadow: "0 3px 12px #000", opacity: k(f, 14) }}>{sub}</div>}</AbsoluteFill>;
};
// 26 · tapebar — la barra de progreso de cinta aisladora (8 vueltas = 8 pasos)
export const TapeBar: React.FC<{ dur: number; n: number; title: string }> = ({ dur, n, title }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 8, 8));
  return <div style={{ position: "absolute", left: 90, bottom: 60, opacity: o, display: "flex", alignItems: "center", gap: 24 }}>
    <div style={{ display: "flex", gap: 4 }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ width: 70, height: 34, background: i < n ? TAPE : "rgba(28,28,31,.25)", borderRadius: 3, boxShadow: i < n ? "inset 0 4px 0 rgba(255,255,255,.12), 0 4px 10px rgba(0,0,0,.4)" : undefined,
      transform: i === n - 1 ? `scaleX(${k(f, 2, 10)})` : undefined, transformOrigin: "0 50%" }} />)}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 36, color: C.paper, textShadow: "0 2px 10px #000" }}>STEP {n} · <span style={{ fontFamily: HAND, fontSize: 46 }}>{title}</span></div></div>;
};
// 27 · meterread — el multímetro amarillo marca el número
export const MeterRead: React.FC<{ dur: number; to: number; from?: number; unit: string; label: string; pre?: string }> = ({ dur, to, from = 0, unit, label, pre = "" }) => {
  const f = useCurrentFrame(); const v = interpolate(f, [4, 30], [from, to], { ...CL, easing: Easing.out(Easing.cubic) });
  return <Corner dur={dur} y={640}><div style={{ width: 460, height: 300, background: "#f2c230", borderRadius: 30, boxShadow: "0 20px 50px rgba(0,0,0,.6)", padding: 26 }}>
    <div style={{ height: 130, background: "#b7c4a8", borderRadius: 10, fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 76, textAlign: "right", padding: "0 20px", lineHeight: "130px", color: "#1d2618" }}>{pre}{fmt(v)}{unit}</div>
    <div style={{ marginTop: 30, fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 2, color: "#1d1d1d" }}>{label}</div></div></Corner>;
};
// 28 · floatgauge — el flotante de la tapa del tanque de propano llega a 80 %
export const FloatGauge: React.FC<{ dur: number; pct: number; label: string }> = ({ dur, pct, label }) => {
  const f = useCurrentFrame(); const p = interpolate(f, [6, 36], [5, pct], { ...CL, easing: Easing.out(Easing.back(1.4)) });
  const an = (-120 + (p / 100) * 240) * (Math.PI / 180);
  return <Corner dur={dur} side="r" y={120}><svg width={360} height={360}><circle cx={180} cy={180} r={160} fill="#f5f5f0" stroke="#9aa0a7" strokeWidth={16} />
    {[0, 20, 40, 60, 80, 100].map((t) => { const a = (-120 + (t / 100) * 240) * (Math.PI / 180); return <text key={t} x={180 + 118 * Math.sin(a)} y={190 - 118 * Math.cos(a)} textAnchor="middle" fontFamily={SANS} fontSize={28} fontWeight={600} fill={t >= 80 ? C.ver : C.ink}>{t}</text>; })}
    <line x1={180} y1={180} x2={180 + 130 * Math.sin(an)} y2={180 - 130 * Math.cos(an)} stroke={C.ver} strokeWidth={9} strokeLinecap="round" /><circle cx={180} cy={180} r={16} fill={C.ink} /></svg>
    <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 50, color: C.paper, textShadow: "0 3px 12px #000" }}>{label}</div></Corner>;
};
// 29 · bondscrew — la lupa sobre el tornillo verde del neutro: ¿unido o flotante?
export const BondScrew: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 10) * (1 - k(f, dur - 10, 10)); const rot = interpolate(f, [10, 40], [0, 540], CL);
  return <div style={{ position: "absolute", right: 130, top: 140, opacity: o, display: "flex", alignItems: "center", gap: 30 }}>
    <div style={{ fontFamily: HAND, fontSize: 64, color: C.paper, textShadow: "0 3px 12px #000", textAlign: "right" }}>bonded<br />or floating?</div>
    <div style={{ width: 300, height: 300, borderRadius: 150, border: `12px solid ${C.paper}`, background: "radial-gradient(circle,#c9c3b1,#8a8473)", boxShadow: "0 20px 40px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 150, height: 150, borderRadius: 75, background: "radial-gradient(circle at 35% 35%,#7fd08e,#2e7d43)", transform: `rotate(${rot}deg)`, position: "relative" }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 66, height: 18, background: "#1d4a2a", borderRadius: 4 }} /></div></div></div>;
};
// 30 · datecan — tira de cinta de papel en el bidón con la fecha escrita a fibrón
export const DateCan: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const peel = k(f, 2, 12); const o = 1 - k(f, dur - 10, 10);
  return <div style={{ position: "absolute", left: 160, top: 160, opacity: o, transform: `rotate(-4deg) scaleX(${peel})`, transformOrigin: "0 50%" }}>
    <div style={{ background: "#efe2bd", padding: "22px 60px", boxShadow: "0 10px 24px rgba(0,0,0,.45)", maskImage: "linear-gradient(90deg, transparent 0, #000 12px, #000 calc(100% - 12px), transparent)" }}>
      <Hand text={text} at={12} len={20} size={80} col="#111" /></div></div>;
};
// 31 · coalarm — los aros del bip de la alarma de CO, uno por piso
export const COAlarm: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", right: 100, top: 120, opacity: o }}>
    {[0, 1, 2].map((fl) => { const on = f > 10 + fl * 18; const r = ((f - fl * 18) % 30) / 30;
      return <div key={fl} style={{ position: "relative", width: 380, height: 150, marginBottom: 20, display: "flex", alignItems: "center", gap: 26, opacity: on ? 1 : 0.25 }}>
        <div style={{ position: "relative", width: 110, height: 110 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 55, background: "#f4f4f0", boxShadow: "0 8px 20px rgba(0,0,0,.5)" }} />
          <div style={{ position: "absolute", left: 47, top: 47, width: 16, height: 16, borderRadius: 8, background: on && Math.floor(f / 8) % 2 ? C.ver : "#600" }} />
          {on && <div style={{ position: "absolute", left: 55 - 55 * (1 + r), top: 55 - 55 * (1 + r), width: 110 * (1 + r), height: 110 * (1 + r), borderRadius: "50%", border: `4px solid ${C.ver}`, opacity: 1 - r }} />}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: C.paper, textShadow: "0 3px 12px #000" }}>FLOOR {fl + 1}</div></div>; })}
  </div>;
};
// 32 · gasdial — los relojitos del medidor de gas giran: ¿alcanza para el generador y la caldera a la vez?
export const GasDial: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", left: 110, bottom: 110, opacity: o }}>
    <div style={{ display: "flex", gap: 16, background: "#e8e4d8", padding: 20, borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
      {[0, 1, 2, 3].map((i) => { const a = (f * (i % 2 ? -1 : 1) * (8 / (i + 1))) * (Math.PI / 180) * 6;
        return <svg key={i} width={130} height={130}><circle cx={65} cy={65} r={58} fill="#fff" stroke="#333" strokeWidth={4} />{Array.from({ length: 10 }, (_, j) => { const b = (j / 10) * Math.PI * 2; return <text key={j} x={65 + 44 * Math.sin(b)} y={72 - 44 * Math.cos(b)} textAnchor="middle" fontSize={16} fontFamily={SANS}>{j}</text>; })}
          <line x1={65} y1={65} x2={65 + 40 * Math.sin(a)} y2={65 - 40 * Math.cos(a)} stroke={C.ver} strokeWidth={5} strokeLinecap="round" /></svg>; })}</div>
    <div style={{ marginTop: 14, fontFamily: HAND, fontSize: 52, color: C.paper, textShadow: "0 3px 12px #000" }}>generator + furnace, together?</div></div>;
};

// ---------- despacho de los planos C
export const CompC: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const c: string = s.comp, m: number[] = s.m || [];
  if (c.startsWith("cut:")) return <Cutaway act={c.slice(4)} m={m} dur={dur} />;
  if (c.startsWith("ledger:step")) return <Ledger n={Number(c.slice(11))} m={m} dur={dur} />;
  const T: Record<string, React.FC<P>> = { quote: CarbonQuote, stamp: ThreeQuotes, five: PadFlip, prongs: HotFloor, fall: LeafHour, knob: Keys102, sides: BillCount, route: Spindle, larry: Clothesline, sum: SplitFlap, receipt: AddTape, ldl: LDL, fuel: Tally24, tanks: TankChain, three: Dominoes, recap: Directory, never: TripBank, checklist: Toggles3 };
  const X = T[c]; return X ? <X m={m} dur={dur} /> : null;
};
