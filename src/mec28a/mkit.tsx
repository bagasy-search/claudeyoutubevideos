// piezas de dibujo de los componentes del canal del Mecánico: fusible de cuchilla, íconos de la tapa, lámpara de prueba, multímetro, relé, cable.
// Todo en SVG/HTML 2D (sin translateZ/rotateY), para que el Chrome del farm no parpadee.
import React from "react";
import { AMB, DIM, GRN, RED, TX, cl } from "./hkit";

export const rnd = (i: number, k = 1) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };
export const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
export const FCOL: Record<string, string> = { "5": "#d9b98a", "7.5": "#8a5a2b", "10": "#e2302a", "15": "#2f6fe0", "20": "#f2c623", "25": "#e8e8e8", "30": "#3cb04a" };
export const METAL = "linear-gradient(90deg,#8d939a,#e9edf1 45%,#9aa1a8)";

// fusible de cuchilla visto de frente: cuerpo de color translúcido, dos patitas, el puentecito en S (blown = cortado con hollín)
export const Fuse: React.FC<{ x: number; y: number; s?: number; amp?: string; blown?: number; glow?: number; rot?: number; op?: number; holes?: boolean; label?: boolean }> = ({ x, y, s = 1, amp = "15", blown = 0, glow = 0, rot = 0, op = 1, holes, label = true }) => {
  const c = FCOL[amp] ?? AMB;
  return <svg viewBox="-60 -90 120 200" style={{ position: "absolute", left: x - 60 * s, top: y - 90 * s, width: 120 * s, height: 200 * s, overflow: "visible", transform: `rotate(${rot}deg)`, opacity: op, filter: glow ? `drop-shadow(0 0 ${30 * glow}px rgba(255,240,200,${0.8 * glow}))` : "drop-shadow(0 18px 26px rgba(0,0,0,.55))" }}>
    <rect x={-42} y={30} width={22} height={74} rx={3} fill="#cfd5db" stroke="#7d848b" strokeWidth={2} />
    <rect x={20} y={30} width={22} height={74} rx={3} fill="#cfd5db" stroke="#7d848b" strokeWidth={2} />
    <rect x={-52} y={-86} width={104} height={124} rx={14} fill={c} opacity={0.82} stroke="rgba(0,0,0,.35)" strokeWidth={2} />
    <rect x={-52} y={-86} width={104} height={40} rx={14} fill={c} />
    <rect x={-46} y={-80} width={24} height={110} rx={10} fill="rgba(255,255,255,.28)" />
    <rect x={-34} y={-30} width={14} height={64} fill="#dfe4e8" /><rect x={20} y={-30} width={14} height={64} fill="#dfe4e8" />
    {blown < 0.5
      ? <path d="M-27 -26 C -27 -60, 0 -60, 0 -30 C 0 0, 27 0, 27 -26" stroke="#eef1f3" strokeWidth={6} fill="none" />
      : <><path d="M-27 -26 C -27 -60, -8 -60, -6 -44" stroke="#eef1f3" strokeWidth={6} fill="none" /><path d="M6 -14 C 10 0, 27 0, 27 -26" stroke="#eef1f3" strokeWidth={6} fill="none" />
        <ellipse cx={0} cy={-30} rx={18 * cl(blown * 2 - 1)} ry={14 * cl(blown * 2 - 1)} fill="rgba(20,14,10,.7)" /></>}
    {holes && <><circle cx={-27} cy={-74} r={5} fill="#222" stroke="#bbb" /><circle cx={27} cy={-74} r={5} fill="#222" stroke="#bbb" /></>}
    {label && <text x={0} y={-56} textAnchor="middle" fontSize={26} fontWeight={900} fill={amp === "7.5" || amp === "10" || amp === "15" || amp === "30" ? "#fff" : "#2a2016"} fontFamily="Arial">{amp}</text>}
  </svg>;
};

// íconos de la tapa (trazo blanco)
export const ICONS: Record<string, string> = {
  radio: "M-30 -14 h60 v34 h-60 z M-20 -4 h22 M-20 6 h22 M18 3 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M-24 -14 L14 -30",
  usb: "M0 30 V-24 M0 -24 l-8 10 M0 -24 l8 10 M0 8 l-14 -10 v-8 M0 0 l14 -10 v-6 M-18 -18 h8 v6 h-8z",
  bulb: "M-14 4 a18 18 0 1 1 28 0 c-4 5 -6 9 -6 14 h-16 c0 -5 -2 -9 -6 -14 z M-8 24 h16 M-6 30 h12",
  wiper: "M-32 22 A40 40 0 0 1 32 22 M0 22 L-22 -14 M-26 -20 L-14 -6",
  horn: "M-30 -8 h12 l22 -16 v48 l-22 -16 h-12 z M14 -10 q8 10 0 20 M22 -18 q14 18 0 36",
  window: "M-28 24 V-14 l20 -14 h36 v52 z M4 -6 v22 M-2 2 l6 -8 l6 8",
  fan: "M0 0 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M0 -4 q-6 -22 10 -26 q6 14 -10 26 M4 2 q22 -4 26 12 q-14 6 -26 -12 M-4 2 q-14 16 -26 6 q4 -16 26 -6",
  brake: "M0 0 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 M-30 -18 q-10 18 0 36 M30 -18 q10 18 0 36 M0 -10 v12 M0 8 v2",
  defrost: "M-28 -20 h56 v40 h-56 z M-18 -8 q6 -6 12 0 t12 0 t12 0 M-18 4 q6 -6 12 0 t12 0 t12 0",
  plug: "M-16 -26 v14 M16 -26 v14 M-24 -12 h48 v14 a24 24 0 0 1 -48 0 z M0 26 v8",
  lock: "M-18 -2 h36 v28 h-36 z M-12 -2 v-10 a12 12 0 0 1 24 0 v10",
};
export const Icon: React.FC<{ k: string; x: number; y: number; s?: number; col?: string; op?: number; w?: number }> = ({ k, x, y, s = 1, col = TX, op = 1, w = 4 }) => (
  <svg viewBox="-40 -40 80 80" style={{ position: "absolute", left: x - 40 * s, top: y - 40 * s, width: 80 * s, height: 80 * s, overflow: "visible", opacity: op }}>
    <path d={ICONS[k] ?? ICONS.bulb} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// lámpara de prueba: mango transparente con la bombita, punta de metal y cable con cocodrilo
export const TestLamp: React.FC<{ x: number; y: number; s?: number; on?: number; rot?: number; cable?: boolean }> = ({ x, y, s = 1, on = 0, rot = 0, cable = true }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `rotate(${rot}deg) scale(${s})` }}>
    {cable && <svg style={{ position: "absolute", left: -20, top: -380, width: 400, height: 300, overflow: "visible" }}><path d="M20 30 C 120 -40, 260 60, 330 -20" stroke="#c0392b" strokeWidth={7} fill="none" /><rect x={322} y={-44} width={44} height={22} rx={4} fill="#d23c2c" transform="rotate(-20 330 -30)" /></svg>}
    <div style={{ position: "absolute", left: -4, top: -40, width: 8, height: 120, borderRadius: 3, background: METAL }} />
    <div style={{ position: "absolute", left: -34, top: -330, width: 68, height: 300, borderRadius: 30, background: "linear-gradient(90deg,rgba(255,255,255,.22),rgba(255,255,255,.07) 50%,rgba(255,255,255,.25))", border: "3px solid rgba(255,255,255,.35)", boxShadow: on ? `0 0 ${90 * on}px rgba(255,214,90,${0.7 * on})` : "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 18, top: 90, width: 32, height: 52, borderRadius: "50% 50% 40% 40%", background: on > 0.05 ? `radial-gradient(circle, #fffbe0, #ffd34a ${40 + 30 * on}%, rgba(255,180,40,.3))` : "radial-gradient(circle, rgba(255,255,255,.35), rgba(255,255,255,.08))", opacity: 0.5 + 0.5 * Math.max(on, 0.3) }} />
      <div style={{ position: "absolute", left: 30, top: 140, width: 8, height: 140, background: "#9aa1a8" }} />
    </div>
  </div>
);

// multímetro amarillo: pantalla con lectura, perilla que gira (ang en grados)
export const Meter: React.FC<{ x: number; y: number; s?: number; read: string; ang?: number; beep?: number; col?: string }> = ({ x, y, s = 1, read, ang = 0, beep = 0, col = "#1d2a1d" }) => (
  <div style={{ position: "absolute", left: x - 170 * s, top: y - 270 * s, width: 340, height: 540, transform: `scale(${s})`, transformOrigin: "0 0", borderRadius: 40, background: "linear-gradient(160deg,#f6c928,#d9a50e)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 10px #2a2a2a" }}>
    <div style={{ position: "absolute", left: 40, top: 46, width: 260, height: 130, borderRadius: 12, background: "linear-gradient(180deg,#a9c4a0,#8fb085)", color: col, fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 70, textAlign: "right", padding: "22px 18px 0 0", boxSizing: "border-box" }}>{read}</div>
    <div style={{ position: "absolute", left: 90, top: 230, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#555,#1a1a1a)", transform: `rotate(${ang}deg)` }}>
      <div style={{ position: "absolute", left: 74, top: 6, width: 12, height: 60, borderRadius: 6, background: "#f2f2f2" }} />
    </div>
    {["V", "Ω", "))))", "A"].map((t, i) => <div key={i} style={{ position: "absolute", left: 170 + Math.cos(-Math.PI / 2 + (i - 1.5) * 0.7) * 120 - 30, top: 310 + Math.sin(-Math.PI / 2 + (i - 1.5) * 0.7) * 120 - 18, width: 60, textAlign: "center", fontWeight: 900, fontSize: 26, color: "#2a2a2a" }}>{t}</div>)}
    <div style={{ position: "absolute", left: 80, top: 450, width: 40, height: 40, borderRadius: 20, background: "#111", border: "5px solid #c0392b" }} /><div style={{ position: "absolute", left: 220, top: 450, width: 40, height: 40, borderRadius: 20, background: "#111", border: "5px solid #333" }} />
    {beep > 0 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 330 + i * 30, top: 100 - i * 20, width: 40 + i * 30, height: 80 + i * 40, borderRadius: "50%", borderRight: `6px solid rgba(111,227,154,${beep * (1 - i * 0.25)})` }} />)}
  </div>
);

// relé: cubito negro con número y cuatro patitas; open = 0..1 deja ver adentro la bobina y el contacto
export const Relay: React.FC<{ x: number; y: number; s?: number; n?: string; open?: number; closed?: number; col?: string }> = ({ x, y, s = 1, n = "1", open = 0, closed = 0, col = "#1b1c1f" }) => (
  <div style={{ position: "absolute", left: x - 90 * s, top: y - 90 * s, width: 180, height: 220, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    {[30, 70, 110, 150].map((l) => <div key={l} style={{ position: "absolute", left: l - 6, top: 170, width: 12, height: 50, background: METAL }} />)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 180, height: 180, borderRadius: 14, background: open > 0.02 ? `rgba(30,30,34,${1 - 0.75 * open})` : `linear-gradient(150deg,#3a3c42,${col})`, border: "2px solid rgba(255,255,255,.14)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {open < 0.6 && <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontWeight: 900, fontSize: 52, color: "rgba(255,255,255,.75)", opacity: 1 - open * 1.6 }}>{n}</div>}
      {open > 0.02 && <svg viewBox="0 0 180 180" style={{ position: "absolute", inset: 0, opacity: open }}>
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={56} cy={50 + i * 11} rx={26} ry={6} fill="none" stroke="#d48a3a" strokeWidth={4} />)}
        <path d={`M100 140 L150 ${140 - 34 * (1 - closed)}`} stroke="#ccc" strokeWidth={8} strokeLinecap="round" />
        <circle cx={150} cy={106} r={8} fill={closed > 0.9 ? "#ffd34a" : "#888"} />
      </svg>}
    </div>
  </div>
);

// cable con corriente: puntitos que avanzan por el trazo (flow 0..1 = intensidad), heat = color al rojo
export const Wire: React.FC<{ d: string; tt: number; flow?: number; heat?: number; w?: number; col?: string; speed?: number }> = ({ d, tt, flow = 0, heat = 0, w = 14, col = "#c0392b", speed = 1 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
    <path d={d} stroke="rgba(0,0,0,.5)" strokeWidth={w + 8} fill="none" strokeLinecap="round" />
    <path d={d} stroke={heat > 0 ? `rgb(${190 + 65 * heat},${57 + 120 * heat * (1 - heat)},${43 * (1 - heat)})` : col} strokeWidth={w} fill="none" strokeLinecap="round" style={{ filter: heat > 0.3 ? `drop-shadow(0 0 ${30 * heat}px rgba(255,90,30,${heat}))` : undefined }} />
    {flow > 0 && <path d={d} stroke={`rgba(255,240,170,${flow})`} strokeWidth={w * 0.45} fill="none" strokeLinecap="round" strokeDasharray="4 30" strokeDashoffset={-tt * 160 * speed} />}
  </svg>
);

export const Coin: React.FC<{ x: number; y: number; s?: number; txt?: string }> = ({ x, y, s = 1, txt = "50¢" }) => (
  <div style={{ position: "absolute", left: x - 70 * s, top: y - 70 * s, width: 140 * s, height: 140 * s, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff3c0,#e0b440 45%,#9a7418)", boxShadow: `0 ${16 * s}px ${30 * s}px rgba(0,0,0,.5), inset 0 0 0 ${6 * s}px rgba(120,90,20,.6)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44 * s, color: "#6a4c0c" }}>{txt}</div>
);

export const Big: React.FC<{ x: number; y: number; txt: string; s: number; col?: string; size?: number; sub?: string }> = ({ x, y, txt, s, col = AMB, size = 120, sub }) => s <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * s})`, opacity: cl(s * 2), textAlign: "center" }}>
    <div style={{ fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: "0 10px 40px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{txt}</div>
    {sub && <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 3, color: DIM, marginTop: 8, whiteSpace: "nowrap" }}>{sub}</div>}
  </div>
);
export const Mark: React.FC<{ x: number; y: number; p: number; ok?: boolean; s?: number }> = ({ x, y, p, ok, s = 120 }) => p <= 0 ? null : (
  <svg viewBox="0 0 100 100" style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, overflow: "visible", transform: `scale(${0.6 + 0.4 * cl(p)})` }}>
    <circle cx={50} cy={50} r={44} fill={ok ? "rgba(60,180,100,.25)" : "rgba(255,70,60,.22)"} stroke={ok ? GRN : RED} strokeWidth={6} opacity={cl(p * 2)} />
    {ok ? <path d="M28 52 L44 68 L74 34" stroke={GRN} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - cl(p))} />
      : <path d="M32 32 L68 68 M68 32 L32 68" stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - cl(p))} />}
  </svg>
);
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; col?: string; w?: number; curve?: number }> = ({ x1, y1, x2, y2, p, col = AMB, w = 8, curve = 0 }) => {
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * curve, my = (y1 + y2) / 2 + (x2 - x1) * curve, L = Math.hypot(x2 - x1, y2 - y1) * 1.2 + 40;
  const a = Math.atan2(y2 - my, x2 - mx);
  return <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
    <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - cl(p))} />
    {p > 0.92 && <path d={`M${x2} ${y2} l${-26 * Math.cos(a - 0.5)} ${-26 * Math.sin(a - 0.5)} M${x2} ${y2} l${-26 * Math.cos(a + 0.5)} ${-26 * Math.sin(a + 0.5)}`} stroke={col} strokeWidth={w} strokeLinecap="round" />}
  </svg>;
};
// tablero de autos visto de frente (silueta) para los componentes de la cabina
export const DashBar: React.FC<{ y?: number; op?: number }> = ({ y = 640, op = 1 }) => (
  <div style={{ position: "absolute", left: 120, top: y, width: 1680, height: 340, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(180deg,#2c2d31,#16171a)", boxShadow: "0 -10px 60px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.06)", opacity: op }} />
);
