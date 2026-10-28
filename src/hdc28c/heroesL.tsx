// componentes únicos de hdc28c · primera mitad (el árbol de 4 a 60, la maceta, el drenaje, la tierra, el sol, la mezcla del pie).
// Cada uno es UN objeto que se entiende sin leer, con física de resorte, cámara curva (Stage) y sin translateZ/rotateY.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

export const rnd = (i: number, k = 1) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };
export const LEAF = "#3f8a3a", LEAF2 = "#2a6a2a", CLAY = "#c46d42", CLAY2 = "#8e4a2a", SOIL = "#4a3424", SOIL2 = "#2e1f14", LEM = "#f4d43c";

// ---------- piezas de dibujo ----------
export const Lemon: React.FC<{ x: number; y: number; s?: number; g?: number; rot?: number; op?: number; glow?: number }> = ({ x, y, s = 1, g = 1, rot = 0, op = 1, glow = 0 }) => {
  const c1 = g > 0.5 ? "#fff4a8" : "#d6f0a0", c2 = g > 0.5 ? LEM : "#7cba3e", c3 = g > 0.5 ? "#c99a12" : "#4a7a22";
  return <div style={{ position: "absolute", left: x - 26 * s, top: y - 34 * s, width: 52 * s, height: 68 * s, transform: `rotate(${rot}deg)`, opacity: op }}>
    <div style={{ position: "absolute", left: 22 * s, top: -12 * s, width: 5 * s, height: 16 * s, borderRadius: 3, background: "#5d7a33" }} />
    <div style={{ position: "absolute", left: 4 * s, top: -8 * s, width: 22 * s, height: 10 * s, borderRadius: "100% 0", background: LEAF, transform: "rotate(-20deg)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50% 50% 46% 46% / 52% 52% 48% 48%", background: `radial-gradient(circle at 35% 30%, ${c1}, ${c2} 45%, ${c3})`, boxShadow: `0 ${10 * s}px ${22 * s}px rgba(0,0,0,.45)${glow > 0 ? `, 0 0 ${40 * glow * s}px rgba(255,220,80,${0.7 * glow})` : ""}` }} />
    <div style={{ position: "absolute", left: 20 * s, top: 62 * s, width: 12 * s, height: 10 * s, borderRadius: "50%", background: c2 }} />
  </div>;
};
export const Leaf: React.FC<{ x: number; y: number; s?: number; rot?: number; col?: string; vein?: string; op?: number; veins?: number }> = ({ x, y, s = 1, rot = 0, col = LEAF, vein = "rgba(255,255,255,.25)", op = 1, veins = 0 }) => (
  <svg viewBox="-60 -24 120 48" style={{ position: "absolute", left: x - 60 * s, top: y - 24 * s, width: 120 * s, height: 48 * s, transform: `rotate(${rot}deg)`, opacity: op, overflow: "visible" }}>
    <path d="M-58 0 Q-20 -26 40 -12 Q58 -4 60 0 Q58 4 40 12 Q-20 26 -58 0 Z" fill={col} />
    <path d="M-58 0 L58 0" stroke={vein} strokeWidth={veins ? 3 : 1.6} />
    {veins > 0 && Array.from({ length: 6 }, (_, i) => { const x0 = -40 + i * 16; return <g key={i} opacity={veins}><path d={`M${x0} 0 Q${x0 + 8} -8 ${x0 + 14} -16`} stroke={vein} strokeWidth={2.6} fill="none" /><path d={`M${x0} 0 Q${x0 + 8} 8 ${x0 + 14} 16`} stroke={vein} strokeWidth={2.6} fill="none" /></g>; })}
  </svg>
);
export const Flower: React.FC<{ x: number; y: number; s?: number; op?: number; rot?: number }> = ({ x, y, s = 1, op = 1, rot = 0 }) => (
  <svg viewBox="-30 -30 60 60" style={{ position: "absolute", left: x - 30 * s, top: y - 30 * s, width: 60 * s, height: 60 * s, opacity: op, transform: `rotate(${rot}deg)`, overflow: "visible" }}>
    {Array.from({ length: 5 }, (_, j) => <ellipse key={j} cx={0} cy={-14} rx={8} ry={14} fill="#fbf7f2" stroke="#e6c8e2" strokeWidth={1.4} transform={`rotate(${j * 72})`} />)}
    <circle r={7} fill="#f2d64a" />{Array.from({ length: 8 }, (_, j) => <circle key={j} cx={Math.cos(j * 0.8) * 9} cy={Math.sin(j * 0.8) * 9} r={1.6} fill="#e0b020" />)}
  </svg>
);
export const Mark: React.FC<{ x: number; y: number; p: number; ok?: boolean; s?: number }> = ({ x, y, p, ok, s = 120 }) => p <= 0 ? null : (
  <svg viewBox="0 0 100 100" style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, overflow: "visible", transform: `scale(${0.6 + 0.4 * cl(p)})` }}>
    <circle cx={50} cy={50} r={44} fill={ok ? "rgba(60,180,100,.25)" : "rgba(255,70,60,.22)"} stroke={ok ? GRN : RED} strokeWidth={6} opacity={cl(p * 2)} />
    {ok ? <path d="M28 52 L44 68 L74 34" stroke={GRN} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - cl(p))} />
      : <path d="M32 32 L68 68 M68 32 L32 68" stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - cl(p))} />}
  </svg>
);
export const Big: React.FC<{ x: number; y: number; txt: string; s: number; col?: string; size?: number; sub?: string }> = ({ x, y, txt, s, col = AMB, size = 120, sub }) => s <= 0.01 ? null : (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * s})`, opacity: cl(s * 2), textAlign: "center" }}>
    <div style={{ fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: "0 10px 40px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{txt}</div>
    {sub && <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 3, color: DIM, marginTop: 8, whiteSpace: "nowrap" }}>{sub}</div>}
  </div>
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
export const Drop: React.FC<{ x: number; y: number; s?: number; op?: number; col?: string }> = ({ x, y, s = 1, op = 1, col }) => (
  <div style={{ position: "absolute", left: x - 7 * s, top: y - 10 * s, width: 14 * s, height: 20 * s, borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%", background: col ?? "radial-gradient(circle at 35% 35%, #ffffff, #8fd0ff 60%, #3d8fd0)", opacity: op }} />
);
// maceta de barro (de frente, sin corte) con tierra arriba
export const Pot: React.FC<{ x: number; y: number; w: number; h: number; col?: string; soil?: string; label?: string; glow?: number }> = ({ x, y, w, h, col = CLAY, soil = SOIL, label, glow = 0 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h, width: w, height: h }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", filter: glow ? `drop-shadow(0 0 ${24 * glow}px rgba(255,210,120,${glow}))` : undefined }}>
      <defs><linearGradient id={"pg" + w} x1="0" x2="1"><stop offset="0" stopColor={CLAY2} /><stop offset=".35" stopColor={col} /><stop offset=".7" stopColor={col} /><stop offset="1" stopColor={CLAY2} /></linearGradient></defs>
      <path d="M2 8 L98 8 L86 100 L14 100 Z" fill={`url(#pg${w})`} /><rect x={0} y={0} width={100} height={12} rx={2} fill={col} /><rect x={0} y={9} width={100} height={3} fill="rgba(0,0,0,.25)" />
      <ellipse cx={50} cy={4} rx={46} ry={3} fill={soil} />
    </svg>
    {label && <div style={{ position: "absolute", left: 0, right: 0, top: "48%", textAlign: "center", fontWeight: 900, fontSize: Math.min(64, w * 0.24), color: "#fff6ea", textShadow: "0 4px 14px rgba(0,0,0,.5)" }}>{label}</div>}
  </div>
);
// arbolito de limón visto de frente (copa redonda con hojas y limones)
export const Tree: React.FC<{ x: number; y: number; s?: number; lemons?: number; low?: number; tt?: number; p?: number; seed?: number; flowers?: number; leafCol?: string }> = ({ x, y, s = 1, lemons = 0, low = 0, tt = 0, p = 1, seed = 1, flowers = 0, leafCol }) => {
  const R = 170 * s, cy = y - 300 * s;
  return <>
    <div style={{ position: "absolute", left: x - 10 * s, top: cy, width: 20 * s, height: 300 * s, borderRadius: 8, background: "linear-gradient(90deg,#5e4e3a,#8a7458,#5e4e3a)" }} />
    {Array.from({ length: 70 }, (_, i) => { const a = rnd(i, seed) * Math.PI * 2, r = Math.sqrt(rnd(i, seed + 3)) * R; const q = cl(p * 1.6 - i / 110); return q <= 0 ? null : <Leaf key={i} x={x + Math.cos(a) * r} y={cy + Math.sin(a) * r * 0.85} s={0.62 * s * q} rot={rnd(i, seed + 5) * 360 + 3 * Math.sin(tt + i)} col={leafCol ?? (i % 3 ? LEAF : LEAF2)} />; })}
    {Array.from({ length: flowers }, (_, i) => { const a = rnd(i, seed + 13) * Math.PI * 2, r = Math.sqrt(rnd(i, seed + 14)) * R * 0.95; return <Flower key={"f" + i} x={x + Math.cos(a) * r} y={cy + Math.sin(a) * r * 0.85} s={0.5 * s} />; })}
    {Array.from({ length: lemons }, (_, i) => { const top = lemons <= 6; const a = top ? -Math.PI / 2 + (i - (lemons - 1) / 2) * 0.32 : rnd(i, seed + 7) * Math.PI * 2; const r = top ? R * 0.92 : Math.sqrt(0.2 + 0.8 * rnd(i, seed + 8)) * R; const q = cl(phys(tt, 0.2 + i * 0.03, 8, 0.4)); return <Lemon key={"l" + i} x={x + Math.cos(a) * r} y={cy + Math.sin(a) * r * 0.85 + 10 * s} s={0.55 * s * q} rot={rnd(i, 9) * 30 - 15} />; })}
    {Array.from({ length: low }, (_, i) => { const d = i % 2 ? 1 : -1, k = i >> 1; return <Lemon key={"lo" + i} x={x + d * (R * 0.35 + k * 46 * s)} y={cy + R * 0.78 + 30 * s + k * 18 * s} s={0.55 * s} rot={d * 10} />; })}
  </>;
};
const Soil: React.FC<{ x: number; y: number; w: number; h: number; col?: string; children?: React.ReactNode; r?: number }> = ({ x, y, w, h, col, children, r = 14 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden", background: col ?? `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, boxShadow: "inset 0 0 40px rgba(0,0,0,.5), 0 30px 70px rgba(0,0,0,.5)" }}>
    {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 2) * w, top: rnd(i, 3) * h, width: 3 + rnd(i, 4) * 5, height: 3 + rnd(i, 4) * 4, borderRadius: "50%", background: rnd(i, 5) > 0.6 ? "rgba(220,200,160,.35)" : "rgba(0,0,0,.3)" }} />)}
    {children}
  </div>
);
const Root: React.FC<{ d: string; p: number; col?: string; w?: number }> = ({ d, p, col = "#e8d8b0", w = 5 }) => (
  <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - cl(p))} />
);

// ---- 0:10 · DE 4 A 60: el contador que gira mientras el árbol se carga desde arriba hasta la rodilla ----
export const HCount: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 1.2, 4.6), n = Math.round(4 + 56 * k);
  return <>
    <Head tt={tt} kick="EL MISMO ÁRBOL · LA MISMA MACETA" title="RAMA POR RAMA" col={AMB} />
    <Tree x={760} y={900} s={1.25} lemons={Math.round(4 + 44 * k)} low={Math.round(8 * cl(k * 1.3 - 0.3))} tt={tt} seed={2} />
    <Pot x={760} y={1010} w={300} h={170} />
    <div style={{ position: "absolute", left: 1270, top: 330, width: 420, height: 380, borderRadius: 30, background: "rgba(20,18,14,.75)", border: "2px solid rgba(255,255,255,.12)", textAlign: "center", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: DIM, marginTop: 34 }}>LIMONES</div>
      <div style={{ fontSize: 210, fontWeight: 900, color: k > 0.95 ? GRN : AMB, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontFamily: HAND, fontSize: 44, color: TX }}>{k < 0.2 ? "allá arriba de todo" : "hasta la rodilla"}</div>
    </div>
    <Arrow x1={1100} y1={820} x2={1000} y2={850} p={cl((tt - 4) / 0.6)} col={GRN} curve={0.2} />
  </>;
}}</Stage>;

// ---- 0:45 · NO HAY POLVO MÁGICO: el frasco "mágico" se tacha y en su lugar caen las 7 fichas de las reglas ----
export const HMagic: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const x = cl((tt - 1.0) / 0.6), fall = (i: number) => phys(tt, 2.0 + i * 0.22, 7, 0.45);
  const R = ["MACETA", "SOL", "AL PIE", "HIERRO", "RIEGO", "FLORES", "PODA"];
  return <>
    <Head tt={tt} kick="ANTES DE EMPEZAR" title="NO HAY POLVO MÁGICO" col={RED} />
    <div style={{ position: "absolute", left: 270, top: 360, width: 240, height: 330, opacity: 1 - 0.55 * x, transform: `rotate(${-8 * x}deg)` }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 180, height: 46, borderRadius: 10, background: "linear-gradient(90deg,#6a4a9a,#b088e0,#6a4a9a)" }} />
      <div style={{ position: "absolute", left: 0, top: 40, width: 240, height: 290, borderRadius: 30, background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.06),rgba(255,255,255,.2))", border: "3px solid rgba(255,255,255,.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: "radial-gradient(circle at 50% 30%, #f6e2ff, #b48ad8)" }} />
        {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + rnd(i) * 200, top: 30 + ((rnd(i, 2) * 200 + tt * 30) % 220), width: 6, height: 6, borderRadius: 3, background: "#fff", opacity: 0.5 + 0.5 * Math.sin(tt * 4 + i) }} />)}
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 200, padding: 8, borderRadius: 8, background: "#fff6e0", color: "#4a2a6a", fontWeight: 900, fontSize: 30, textAlign: "center" }}>MÁGICO</div>
    </div>
    <Mark x={390} y={520} p={x} s={300} />
    {R.map((r, i) => { const s = fall(i); return s <= 0.01 ? null : <div key={i} style={{ position: "absolute", left: 720 + (i % 4) * 280, top: 330 + Math.floor(i / 4) * 230 - (1 - s) * 260, width: 250, height: 190, borderRadius: 22, background: i === 5 ? "linear-gradient(160deg,#2f6a3a,#1a3a22)" : "linear-gradient(160deg,#3a3329,#1e1a15)", border: `2px solid ${i === 5 ? GRN : "rgba(255,255,255,.14)"}`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", opacity: cl(s * 2), transform: `rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)` }}>
      <div style={{ fontSize: 76, fontWeight: 900, color: i === 5 ? GRN : AMB, marginLeft: 22, marginTop: 10 }}>{i + 1}</div>
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2, marginLeft: 22 }}>{r}</div>
    </div>; })}
    <Tag tt={tt} at={3.8} x={1300} y={850} txt="LA QUE MÁS LIMONES SALVA: LA 6" col={GRN} size={38} />
  </>;
}}</Stage>;

// ---- 1:05 · EL EMBUDO DE LAS FLORES: cientos de flores arriba, casi todo cae, pasan poquitos limones ----
export const HFunnel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fall = eio(tt, 1.4, 4.2);
  return <>
    <Head tt={tt} kick="DÓNDE SE PIERDEN" title="EN LAS FLORES QUE CAEN" col={RED} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M560 300 L1360 300 L1030 640 L1030 820 L890 820 L890 640 Z" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.3)" strokeWidth={4} /></svg>
    {Array.from({ length: 60 }, (_, i) => { const x0 = 600 + rnd(i) * 720, y0 = 230 + rnd(i, 2) * 80, out = rnd(i, 3) > 0.12; const k = cl(fall * 1.4 - rnd(i, 4) * 0.4);
      const x = out ? x0 + (x0 < 960 ? -1 : 1) * 260 * k : lerpN(x0, 960, k), y = out ? y0 + 680 * k * k : lerpN(y0, 700, k);
      return <Flower key={i} x={x} y={y} s={0.9} rot={k * 300 * (i % 2 ? 1 : -1)} op={out ? 1 - 0.6 * k : 1} />; })}
    {[0, 1, 2, 3].map((i) => <Lemon key={i} x={900 + i * 40} y={900} s={0.9 * cl((tt - 3.6 - i * 0.15) / 0.4)} />)}
    <Big x={340} y={540} txt="CIENTOS" s={phys(tt, 0.6, 6, 0.5)} col={TX} size={86} sub="DE FLORES" />
    <Big x={1580} y={760} txt="3-4" s={phys(tt, 3.8, 6, 0.5)} col={AMB} size={130} sub="DE CADA 100" />
  </>;
}}</Stage>;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;

// ---- 2:55 · EL ICEBERG: lo de arriba nunca es más grande que lo de abajo (copa = raíz, en espejo) ----
export const HMirror: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const g = eio(tt, 0.8, 3.4);
  return <>
    <Head tt={tt} kick="REGLA 1 · LA MACETA" title="ARRIBA = ABAJO" col={AMB} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 480, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 596, height: 8, background: "#6a4a2c" }} />
    {[[560, 0.55], [1360, 1.0]].map(([x, k], j) => { const s = (k as number) * g; return <React.Fragment key={j}>
      <div style={{ position: "absolute", left: (x as number) - 9, top: 600 - 260 * s, width: 18, height: 260 * s, background: "#7a6450", borderRadius: 6 }} />
      {Array.from({ length: 34 }, (_, i) => { const a = rnd(i, j + 2) * Math.PI * 2, r = Math.sqrt(rnd(i, j + 3)) * 170 * s; return <Leaf key={i} x={(x as number) + Math.cos(a) * r} y={600 - 260 * s - 40 + Math.sin(a) * r * 0.8} s={0.6 * Math.max(0.2, s)} rot={rnd(i, 4) * 360} col={i % 3 ? LEAF : LEAF2} />; })}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
        {Array.from({ length: 9 }, (_, i) => { const dx = (i - 4) * 40 * s; return <Root key={i} d={`M${x} 604 Q${(x as number) + dx * 0.6} ${640 + 80 * s} ${(x as number) + dx * 1.6} ${640 + (150 + 60 * rnd(i, j)) * s}`} p={g} w={4} />; })}
      </svg>
      <Tag tt={tt} at={2.6 + j * 0.4} x={x as number} y={1000} txt={j ? "MACETA GRANDE" : "MACETA CHICA"} col={j ? GRN : RED} size={36} />
    </React.Fragment>; })}
    <div style={{ position: "absolute", left: 160, top: 300, fontFamily: HAND, fontSize: 52, color: TX, opacity: cl((tt - 3) / 0.5), transform: "rotate(-4deg)" }}>las raíces mandan</div>
  </>;
}}</Stage>;

// ---- 3:40 · EL BALDE DE PINTURA: 20 L se vuelcan y llenan la mitad de la maceta de 40 ----
export const HBucket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const tip = eio(tt, 0.8, 1.8), f1 = eio(tt, 1.6, 3.0), tip2 = eio(tt, 3.2, 3.9), f2 = eio(tt, 3.7, 5.0), fill = 0.5 * f1 + 0.5 * f2;
  return <>
    <Head tt={tt} kick="REGLA 1 · LA MACETA" title="¿CUÁNTO ES 40 LITROS?" col={AMB} />
    <div style={{ position: "absolute", left: 430, top: 360, width: 230, height: 270, transformOrigin: "100% 20%", transform: `rotate(${(tip - tip2 * 0) * 70 * (1 - f2 * 0.0)}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 26px 26px", background: "linear-gradient(90deg,#d9dde0,#ffffff,#c3c8cc)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 30, top: 90, width: 170, height: 70, borderRadius: 10, background: "#3a6aa8", color: "#fff", fontWeight: 900, fontSize: 52, textAlign: "center", lineHeight: "70px" }}>20 L</div>
    </div>
    {(f1 > 0 && f1 < 1) || (f2 > 0 && f2 < 1) ? Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 690 + rnd(i) * 60 + ((tt * 200 + i * 40) % 140), top: 470 + ((tt * 600 + i * 47) % 240), width: 16, height: 16, borderRadius: 4, background: i % 3 ? "#5a3f2a" : "#3a2a1c" }} />) : null}
    <div style={{ position: "absolute", left: 820, top: 440, width: 460, height: 460 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs><clipPath id="potIn"><path d="M6 4 L94 4 L84 100 L16 100 Z" /></clipPath></defs>
        <path d="M2 2 L98 2 L86 100 L14 100 Z" fill="rgba(196,109,66,.25)" stroke={CLAY} strokeWidth={2} />
        <rect x={0} y={100 - 96 * fill} width={100} height={96 * fill} fill={SOIL} clipPath="url(#potIn)" />
        <line x1={0} y1={52} x2={100} y2={52} stroke="#fff" strokeDasharray="3 3" strokeWidth={0.8} opacity={0.7} />
      </svg>
      <div style={{ position: "absolute", right: -190, top: 210, fontWeight: 900, fontSize: 38, color: f1 > 0.95 && f2 < 0.1 ? AMB : DIM }}>LA MITAD</div>
    </div>
    <Big x={1600} y={880} txt="40 L" s={phys(tt, 5.0, 6, 0.5)} col={GRN} size={140} sub="40 CM ANCHO · 40 CM HONDO" />
    <Tag tt={tt} at={3.2} x={545} y={720} txt="OTRO BALDE MÁS" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 4:35 · TRES SEMANAS CON LOS PIES EN EL AGUA: la raíz blanca se pone marrón y arriba la hoja amarillea ----
export const HPond: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = eio(tt, 0.8, 4.4), wk = Math.min(3, Math.floor(w * 3.2) + 1);
  return <>
    <Head tt={tt} kick="REGLA 1 · EL DRENAJE" title="LAS RAÍCES EN AGUA PARADA" col={RED} />
    <Soil x={560} y={420} w={800} h={460}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: "linear-gradient(180deg, rgba(70,110,130,.75), rgba(40,70,90,.9))" }} />
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 700, bottom: (tt * 50 + i * 30) % 200, width: 10, height: 10, borderRadius: 5, border: "2px solid rgba(200,240,255,.5)" }} />)}
      <svg style={{ position: "absolute", inset: 0, width: 800, height: 460, overflow: "visible" }}>
        {Array.from({ length: 10 }, (_, i) => { const x = 400 + (i - 4.5) * 50; const c = `rgb(${Math.round(232 - 150 * w)},${Math.round(216 - 160 * w)},${Math.round(176 - 140 * w)})`; return <Root key={i} d={`M400 0 Q${x} 160 ${x + (i - 4.5) * 20} ${360 + rnd(i) * 80}`} p={1} col={c} w={6} />; })}
      </svg>
    </Soil>
    {[0, 1, 2, 3, 4].map((i) => <Leaf key={i} x={860 + i * 60} y={340 - (i % 2) * 30} s={1.1} rot={-20 + i * 10 + 40 * w * (i % 2 ? 1 : -1) * cl(w - 0.6)} col={`rgb(${Math.round(63 + 170 * w)},${Math.round(138 + 60 * w)},${Math.round(58 - 10 * w)})`} />)}
    <div style={{ position: "absolute", left: 1460, top: 430, textAlign: "center" }}>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: DIM }}>SEMANA</div>
      <div style={{ fontSize: 200, fontWeight: 900, color: wk >= 3 ? RED : AMB, lineHeight: 1 }}>{wk}</div>
    </div>
    <Tag tt={tt} at={4.6} x={960} y={960} txt="Y LA GENTE LO RIEGA MÁS" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 5:05 · LA MACETA SE ARMA POR CAPAS: agujeros, piedritas, tierra y los dos ladrillos que la levantan ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = [0.6, 1.4, 2.2, 3.0].map((a) => phys(tt, a, 7, 0.45));
  return <>
    <Head tt={tt} kick="REGLA 1 · EL DRENAJE" title="LA MACETA POR DENTRO" col={ICE} />
    <div style={{ position: "absolute", left: 690, top: 300, width: 540, height: 560 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <defs><clipPath id="potL"><path d="M5 2 L95 2 L85 98 L15 98 Z" /></clipPath></defs>
        <path d="M2 0 L98 0 L87 100 L13 100 Z" fill="rgba(196,109,66,.2)" stroke={CLAY} strokeWidth={2.4} />
        <g clipPath="url(#potL)">
          <rect x={0} y={98 - 18 * L[1]} width={100} height={18} fill="#8a8078" />
          {Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={8 + rnd(i) * 84} cy={98 - rnd(i, 2) * 16 * L[1]} rx={2.6} ry={1.8} fill={i % 4 ? "#a89a8a" : "#b06a4a"} />)}
          <rect x={0} y={80 - 70 * L[2]} width={100} height={70 * L[2]} fill={SOIL} />
          {Array.from({ length: 50 }, (_, i) => <circle key={"s" + i} cx={rnd(i, 5) * 100} cy={80 - rnd(i, 6) * 68 * L[2]} r={0.5} fill="rgba(230,210,170,.5)" />)}
        </g>
        {[22, 40, 60, 78].map((x, i) => <circle key={i} cx={x} cy={99} r={2.2} fill="#120c08" stroke={AMB} strokeWidth={0.8 * L[0]} />)}
      </svg>
    </div>
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 960 + d * 150 - 70, top: 870 + (1 - L[3]) * -200, width: 140, height: 70, borderRadius: 6, background: "linear-gradient(180deg,#b5583a,#8a3e26)", opacity: cl(L[3] * 2), boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />)}
    {L[3] > 0.5 && [0, 1, 2].map((i) => <Drop key={i} x={900 + i * 60} y={880 + ((tt * 140 + i * 30) % 90)} s={1.6} />)}
    <Tag tt={tt} at={0.8} x={420} y={850} txt="VARIOS AGUJEROS" col={AMB} anchor="c" />
    <Tag tt={tt} at={1.6} x={1500} y={790} txt="3-4 DEDOS DE PIEDRITAS" col={TX} />
    <Tag tt={tt} at={2.4} x={1500} y={520} txt="TIERRA SUELTA" col={TX} />
    <Tag tt={tt} at={3.2} x={420} y={960} txt="2 LADRILLOS" col={AMB} />
  </>;
}}</Stage>;

// ---- 5:45 · UNO, UNO, UNO: tres palas que se vuelcan en el balde y se revuelven ----
export const HMix111: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const M = [["TIERRA", "#6a4a32"], ["COMPOST", "#2f2116"], ["ARENA GRUESA", "#cdb98e"]];
  const stir = eio(tt, 3.6, 5.2);
  return <>
    <Head tt={tt} kick="REGLA 1 · LA TIERRA" title="UNO · UNO · UNO" col={AMB} />
    {M.map(([n, c], i) => { const go = eio(tt, 0.7 + i * 0.9, 1.4 + i * 0.9); const x = 360 + i * 300; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 90 + (1240 - x) * go * 0.0, top: 300, width: 180, height: 120, borderRadius: "0 0 90px 90px", background: c, opacity: 1, transform: `scale(${1 - 0.5 * go})`, transformOrigin: "50% 0%", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: x, top: 470, transform: "translateX(-50%)", fontWeight: 900, fontSize: 30, color: go > 0.5 ? DIM : TX, whiteSpace: "nowrap" }}>1 · {n}</div>
      {go > 0 && go < 1 && Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: x + (1300 - x) * go + rnd(k) * 40, top: 340 + 260 * go * go + rnd(k, 2) * 30, width: 14, height: 14, borderRadius: 4, background: c }} />)}
    </React.Fragment>; })}
    <div style={{ position: "absolute", left: 1100, top: 470, width: 520, height: 440, borderRadius: "16px 16px 60px 60px", background: "linear-gradient(90deg,#3a3d42,#6a6e74,#3a3d42)", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      {M.map(([, c], i) => { const k = eio(tt, 1.2 + i * 0.9, 1.8 + i * 0.9); return <div key={i} style={{ position: "absolute", left: 10, right: 10, bottom: 10 + i * 80 * (1 - stir), height: 80 * k * (1 - stir) + 0.1, background: c }} />; })}
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: 240 * stir, background: "radial-gradient(circle at 40% 40%, #7a6248, #4a3424)", opacity: stir }} />
    </div>
    {stir > 0 && stir < 1 && <div style={{ position: "absolute", left: 1350 + 100 * Math.cos(tt * 6), top: 420, width: 16, height: 220, background: "#8a6a4a", borderRadius: 8, transform: `rotate(${20 * Math.sin(tt * 6)}deg)` }} />}
    <Tag tt={tt} at={5.0} x={1340} y={960} txt="SUELTA · PASA EL AGUA · TIENE COMIDA" col={GRN} size={32} />
  </>;
}}</Stage>;

// ---- 6:10 · CAMBIARLE EL COLCHÓN: el pan de raíces que da vueltas, la tijera recorta dos dedos alrededor ----
export const HMattress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cut = eio(tt, 1.8, 4.2), fresh = eio(tt, 4.4, 5.4);
  return <>
    <Head tt={tt} kick="CADA 2-3 AÑOS · FIN DEL INVIERNO" title="CAMBIARLE EL COLCHÓN" col={GRN} />
    <div style={{ position: "absolute", left: 960 - 230, top: 300, width: 460, height: 560, borderRadius: "40% 40% 30% 30%", background: `radial-gradient(circle at 45% 40%, #6a4a32, ${SOIL2})`, boxShadow: "0 40px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <svg viewBox="0 0 460 560" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={230} cy={290 + i * 6} rx={(214 - i * 6)} ry={(266 - i * 6)} stroke="#e8d8b0" strokeWidth={5} fill="none" opacity={1 - cut * 0.92} strokeDasharray={`${300 - i * 20} 30`} />)}
        {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <line key={"n" + i} x1={230 + Math.cos(a) * 150} y1={290 + Math.sin(a) * 190} x2={230 + Math.cos(a) * (150 + 50 * fresh)} y2={290 + Math.sin(a) * (190 + 50 * fresh)} stroke="#ffffff" strokeWidth={3} opacity={fresh} />; })}
      </svg>
    </div>
    {cut > 0 && cut < 1 && (() => { const a = cut * Math.PI * 2 - Math.PI / 2, x = 960 + Math.cos(a) * 240, y = 580 + Math.sin(a) * 290; return <svg viewBox="0 0 160 70" style={{ position: "absolute", left: x - 80, top: y - 35, width: 160, height: 70, transform: `rotate(${a * 57 + 90}deg)`, overflow: "visible" }}>
      <path d={`M10 35 L150 ${30 - 10 * Math.abs(Math.sin(tt * 12))}`} stroke="#d0d4d8" strokeWidth={10} strokeLinecap="round" /><path d={`M10 35 L150 ${40 + 10 * Math.abs(Math.sin(tt * 12))}`} stroke="#b0b4b8" strokeWidth={10} strokeLinecap="round" />
      <circle cx={8} cy={22} r={14} stroke="#c0392b" strokeWidth={8} fill="none" /><circle cx={8} cy={50} r={14} stroke="#c0392b" strokeWidth={8} fill="none" /></svg>; })()}
    <Tag tt={tt} at={1.0} x={480} y={420} txt="RAÍCES DANDO VUELTAS" col={RED} size={34} />
    <Tag tt={tt} at={2.4} x={1460} y={420} txt="2-3 DEDOS ALREDEDOR" col={AMB} size={34} />
    <Tag tt={tt} at={4.6} x={1460} y={760} txt="RAÍZ NUEVA = MÁS CARGA" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 6:30 · EL RELOJ DEL SOL: el arco del sol cruza el patio y llena las horas (6 mínimo, 8 mejor) ----
export const HSunClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 80% 70% at 50% 60%, #2a2418, #0a0806 75%)">{(tt) => {
  const k = eio(tt, 0.6, 4.6), hrs = k * 8, a = Math.PI * (1 - k);
  return <>
    <Head tt={tt} kick="REGLA 2 · EL SOL" title="NO SE NEGOCIA" col={AMB} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <path d="M460 820 A500 420 0 0 1 1460 820" stroke="rgba(255,255,255,.18)" strokeWidth={4} fill="none" strokeDasharray="10 14" />
      <path d="M460 820 A500 420 0 0 1 1460 820" stroke={hrs >= 6 ? GRN : AMB} strokeWidth={14} fill="none" strokeDasharray={1460} strokeDashoffset={1460 * (1 - k)} strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => { const b = Math.PI * (1 - i / 8); return <g key={i}><line x1={960 + Math.cos(b) * 470} y1={820 - Math.sin(b) * 395} x2={960 + Math.cos(b) * 530} y2={820 - Math.sin(b) * 445} stroke={i === 6 ? GRN : "rgba(255,255,255,.4)"} strokeWidth={i === 6 ? 8 : 3} /><text x={960 + Math.cos(b) * 580} y={830 - Math.sin(b) * 490} fill={i === 6 ? GRN : "rgba(255,255,255,.5)"} fontSize={30} fontWeight={900} textAnchor="middle">{i}h</text></g>; })}
    </svg>
    <div style={{ position: "absolute", left: 960 + Math.cos(a) * 500 - 70, top: 820 - Math.sin(a) * 420 - 70, width: 140, height: 140, borderRadius: 70, background: "radial-gradient(circle, #fff6c8, #ffc83a 55%, rgba(255,160,40,0))", boxShadow: "0 0 120px rgba(255,200,80,.8)" }} />
    <Tree x={960} y={880} s={0.85} lemons={Math.round(30 * cl(hrs / 6))} tt={tt} seed={4} />
    <Pot x={960} y={960} w={210} h={110} />
    <Big x={1560} y={620} txt={`${Math.floor(hrs)} H`} s={1} col={hrs >= 6 ? GRN : AMB} size={110} />
    <Tag tt={tt} at={4.0} x={1580} y={950} txt="SIN SOL · SIN FLORES · SIN LIMONES" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 7:25 · UN CUARTO DE VUELTA: visto desde arriba, el lado del sol se carga; la maceta gira y se empareja ----
export const HQuarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const r = eio(tt, 1.6, 3.0) * 90 + eio(tt, 3.6, 5.0) * 90;
  return <>
    <Head tt={tt} kick="REGLA 2 · UNA VEZ POR MES" title="UN CUARTO DE VUELTA" col={GRN} />
    <div style={{ position: "absolute", left: 1560, top: 300, width: 180, height: 180, borderRadius: 90, background: "radial-gradient(circle, #fff6c8, #ffc83a 55%, rgba(255,160,40,0))", boxShadow: "0 0 140px rgba(255,200,80,.7)" }} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1180, top: 420 + i * 50, width: 360, height: 6, borderRadius: 3, background: "rgba(255,220,120,.35)", transform: "rotate(-14deg)" }} />)}
    <div style={{ position: "absolute", left: 700, top: 300, width: 520, height: 520, borderRadius: 260, background: `radial-gradient(circle, ${SOIL}, ${SOIL2} 60%, ${CLAY} 62%, ${CLAY2} 70%, transparent 71%)`, transform: `rotate(${r}deg)`, boxShadow: "0 40px 90px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 50 }, (_, i) => { const a = rnd(i, 3) * Math.PI * 2, rr = 40 + rnd(i, 4) * 150; return <Leaf key={i} x={260 + Math.cos(a) * rr} y={260 + Math.sin(a) * rr} s={0.7} rot={a * 57} col={i % 3 ? LEAF : LEAF2} />; })}
      {Array.from({ length: 12 }, (_, i) => { const a = -0.9 + (i / 11) * 1.8; return <Lemon key={"l" + i} x={260 + Math.cos(a) * 170} y={260 + Math.sin(a) * 170} s={0.55} />; })}
      <div style={{ position: "absolute", left: 470, top: 240, width: 40, height: 40, borderRadius: 20, background: AMB, border: "4px solid #fff" }} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 470, fontWeight: 900, fontSize: 120, color: AMB }}>{Math.round(r)}°</div>
    <Tag tt={tt} at={1.0} x={1360} y={850} txt="EL LADO DEL SOL CARGA MÁS" col={AMB} size={34} />
    <Tag tt={tt} at={4.8} x={420} y={680} txt="SE CARGA PAREJO" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 8:05 · LA NOCHE DE HELADA: el termómetro baja de 0, el plástico cae sobre la copa sin tocar las hojas ----
export const HFrost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #14202e, #04070c 75%)">{(tt) => {
  const temp = 8 - 11 * eio(tt, 0.4, 2.4), cover = phys(tt, 2.8, 5, 0.6);
  return <>
    <Head tt={tt} kick="REGLA 2 · LAS NOCHES DE HELADA" title="LO ARRIMAS O LO TAPAS" col={ICE} />
    {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1920, top: ((rnd(i, 2) * 1080 + tt * (30 + rnd(i, 3) * 40)) % 1080), width: 4, height: 4, borderRadius: 2, background: "#eaf4ff", opacity: 0.6 }} />)}
    <div style={{ position: "absolute", left: 360, top: 300, width: 70, height: 520, borderRadius: 35, background: "rgba(255,255,255,.12)", border: "3px solid rgba(255,255,255,.4)" }}>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: 30 + (temp + 5) * 30, borderRadius: 17, background: temp < 0 ? ICE : RED }} />
    </div>
    <div style={{ position: "absolute", left: 460, top: 520, fontWeight: 900, fontSize: 96, color: temp < 0 ? ICE : TX }}>{temp.toFixed(0)}°</div>
    <Tree x={1180} y={860} s={0.95} lemons={18} tt={tt} seed={6} leafCol={temp < -1 && cover < 0.5 ? "#7a9a8a" : undefined} />
    <Pot x={1180} y={940} w={230} h={120} />
    <div style={{ position: "absolute", left: 1180 - 260, top: 260 - (1 - cover) * 300, width: 520, height: 600, borderRadius: "48% 48% 12% 12%", background: "linear-gradient(160deg, rgba(235,245,255,.32), rgba(200,220,240,.12))", border: "3px solid rgba(255,255,255,.45)", opacity: cl(cover * 2) }} />
    <Tag tt={tt} at={3.4} x={1180} y={1010} txt="SIN TOCAR LAS HOJAS" col={ICE} size={34} />
  </>;
}}</Stage>;

// ---- 8:35 · LA BALANZA N–K: dos platillos, hojas de un lado, limón con jugo del otro; el equilibrio es el truco ----
export const HBalance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tilt = -14 * eio(tt, 0.8, 1.8) + 14 * eio(tt, 2.6, 4.0) + 3 * Math.sin(tt * 1.5) * (1 - eio(tt, 4, 5));
  const r = (tilt * Math.PI) / 180;
  return <>
    <Head tt={tt} kick="REGLA 3 · LO QUE PIDE" title="NITRÓGENO Y POTASIO JUNTOS" col={AMB} />
    <div style={{ position: "absolute", left: 950, top: 360, width: 20, height: 470, background: "linear-gradient(90deg,#8a7458,#c4a87a,#8a7458)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 860, top: 820, width: 200, height: 40, borderRadius: 10, background: "#6a5440" }} />
    <div style={{ position: "absolute", left: 960 - 420, top: 360, width: 840, height: 14, borderRadius: 7, background: "#c4a87a", transform: `rotate(${tilt}deg)` }} />
    {[-1, 1].map((d) => { const x = 960 + d * 400 * Math.cos(r), y = 367 + d * 400 * Math.sin(r); return <React.Fragment key={d}>
      <div style={{ position: "absolute", left: x - 1, top: y, width: 3, height: 200, background: "rgba(255,255,255,.5)" }} />
      <div style={{ position: "absolute", left: x - 150, top: y + 200, width: 300, height: 40, borderRadius: "0 0 150px 150px", background: "linear-gradient(180deg,#d8b880,#8a6a3a)" }} />
      {d < 0 ? [0, 1, 2, 3].map((i) => <Leaf key={i} x={x - 75 + i * 50} y={y + 185 - (i % 2) * 18} s={0.9} rot={-30 + i * 20} />) : [0, 1, 2].map((i) => <Lemon key={i} x={x - 60 + i * 60} y={y + 165} s={0.9} />)}
      <div style={{ position: "absolute", left: x, top: y + 270, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 46, fontWeight: 900, color: d < 0 ? GRN : AMB }}>{d < 0 ? "NITRÓGENO" : "POTASIO"}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: DIM }}>{d < 0 ? "HOJAS QUE ALIMENTAN" : "JUGO Y QUE NO SE CAIGA"}</div>
      </div>
    </React.Fragment>; })}
    <Tag tt={tt} at={1.4} x={960} y={250} txt="SÓLO NITRÓGENO = VERDE Y SIN FLOR" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 9:10 · LA RECETA DEL MES: cinco ingredientes caen uno por uno en el bol, cada uno con su medida ----
export const HRecipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const I = [["2 PUÑADOS", "CÁSCARA DE PLÁTANO", "#3a2a1a"], ["1 CDA RASA", "CENIZA DE LEÑA", "#a8a8a2"], ["1 CDA", "BORRA DE CAFÉ", "#2a1a10"], ["1 CDA", "HUEVO MOLIDO", "#f3eee2"], ["2 PUÑADOS", "COMPOST", "#3a2a1c"]];
  return <>
    <Head tt={tt} kick="REGLA 3 · MACETA DE 40-50 L · 1 VEZ AL MES" title="LA MEZCLA AL PIE" col={GRN} />
    {I.map(([q, n, c], i) => { const s = phys(tt, 0.5 + i * 0.7, 7, 0.5), go = eio(tt, 0.9 + i * 0.7, 1.5 + i * 0.7); return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 140, top: 260 + i * 140, width: 720, height: 116, borderRadius: 20, background: "rgba(30,26,20,.8)", border: "2px solid rgba(255,255,255,.1)", opacity: cl(s * 2), transform: `translateX(${(1 - s) * -80}px)`, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, marginLeft: 22, background: `radial-gradient(circle at 35% 35%, ${c === "#f3eee2" ? "#ffffff" : "#8a7458"}, ${c})`, boxShadow: "0 8px 20px rgba(0,0,0,.5)" }} />
        <div><div style={{ fontSize: 40, fontWeight: 900, color: AMB }}>{q}</div><div style={{ fontSize: 28, fontWeight: 800, color: TX }}>{n}</div></div>
      </div>
      {go > 0 && go < 1 && Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: 880 + 480 * go + rnd(k + i * 9) * 60, top: 300 + i * 140 + (300 - i * 140) * go * go + rnd(k, 2) * 30, width: 14, height: 14, borderRadius: 6, background: c }} />)}
    </React.Fragment>; })}
    <div style={{ position: "absolute", left: 1130, top: 560, width: 620, height: 260, borderRadius: "0 0 230px 230px", background: "linear-gradient(90deg,#9a7a56,#d8b880,#9a7a56)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 0, height: 30 + 170 * eio(tt, 1, 4.4), background: "radial-gradient(circle at 40% 30%, #6a5038, #2e2016)" }} />
    </div>
    <Tag tt={tt} at={4.6} x={1440} y={900} txt="TODO DE LA COCINA" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 9:45 · LA CÁSCARA DE PLÁTANO EN 7 DÍAS: amarilla → negra crujiente → polvo en el frasco ----
export const HPeelDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = eio(tt, 0.6, 4.0), day = 1 + Math.round(d * 6), pw = eio(tt, 4.2, 5.4);
  const col = d < 0.5 ? `rgb(${Math.round(232 - 120 * d * 2)},${Math.round(200 - 130 * d * 2)},${Math.round(58 - 20 * d * 2)})` : `rgb(${Math.round(112 - 84 * (d - 0.5) * 2)},${Math.round(70 - 50 * (d - 0.5) * 2)},${Math.round(38 - 26 * (d - 0.5) * 2)})`;
  return <>
    <Head tt={tt} kick="REGLA 3 · EL POTASIO" title="SECA, NEGRA Y CRUJIENTE" col={AMB} />
    <div style={{ position: "absolute", left: 360, top: 430, width: 760, height: 380, borderRadius: 24, background: "linear-gradient(160deg,#c8ccd0,#8a8e94)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", opacity: 1 - pw }} />
    {[0, 1, 2].map((i) => <svg key={i} viewBox="0 0 300 120" style={{ position: "absolute", left: 380 + i * 230, top: 470 + (i % 2) * 130, width: 420 * (1 - 0.18 * d), height: 170, transform: `rotate(${-10 + i * 12}deg) scale(${1 - pw})`, overflow: "visible" }}>
      {[0, 1, 2].map((j) => <path key={j} d={`M150 60 Q${80 + j * 30} ${10 + j * 40 - 20 * d} ${10 + j * 20} ${40 + j * 20}`} stroke={col} strokeWidth={34 - 10 * d} fill="none" strokeLinecap="round" />)}
    </svg>)}
    <div style={{ position: "absolute", left: 1240, top: 360, width: 300, height: 120, textAlign: "center" }}>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: DIM }}>DÍA</div><div style={{ fontSize: 140, fontWeight: 900, color: AMB, lineHeight: 1 }}>{day}</div>
    </div>
    <div style={{ position: "absolute", left: 1320, top: 600, width: 170, height: 260, borderRadius: 22, background: "rgba(255,255,255,.12)", border: "3px solid rgba(255,255,255,.35)", overflow: "hidden", opacity: cl(pw * 3) }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200 * pw, background: "radial-gradient(circle at 40% 30%, #6a4a30, #3a2616)" }} />
    </div>
    <Tag tt={tt} at={4.6} x={1405} y={920} txt="POLVO · DURA MESES" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 10:20 · LA AGUJA DE LA CAL: la ceniza empuja el medidor a alcalino y un candado se cierra sobre el hierro ----
export const HAshMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const sp = eio(tt, 0.8, 3.0), a = -60 + 110 * sp, lock = phys(tt, 3.2, 6, 0.5);
  return <>
    <Head tt={tt} kick="REGLA 3 · LA CENIZA" title="LA QUE MÁS CUIDADO PIDE" col={RED} />
    {Array.from({ length: 5 }, (_, i) => { const on = cl(sp * 6 - i); return <div key={i} style={{ position: "absolute", left: 300 + i * 70, top: 330, width: 60, height: 60, borderRadius: "50% 50% 30% 30%", background: "radial-gradient(circle at 40% 30%, #d8d8d2, #8a8a86)", opacity: on, transform: `translateY(${on * 340}px)` }} />; })}
    <div style={{ position: "absolute", left: 250, top: 700, width: 420, height: 120, borderRadius: "0 0 210px 210px", background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }}><div style={{ position: "absolute", left: 30, right: 30, top: 0, height: 30 * sp, background: "#b0b0aa", borderRadius: 8 }} /></div>
    <svg style={{ position: "absolute", left: 760, top: 300, width: 600, height: 420, overflow: "visible" }}>
      <defs><linearGradient id="phg" x1="0" x2="1"><stop offset="0" stopColor="#e85a3a" /><stop offset=".45" stopColor="#7dd87d" /><stop offset="1" stopColor="#5a7ae8" /></linearGradient></defs>
      <path d="M40 360 A260 260 0 0 1 560 360" stroke="url(#phg)" strokeWidth={46} fill="none" />
      <text x={30} y={420} fill={TX} fontSize={30} fontWeight={900}>ÁCIDA</text><text x={460} y={420} fill={TX} fontSize={30} fontWeight={900}>CON CAL</text>
      <line x1={300} y1={360} x2={300 + 230 * Math.sin((a * Math.PI) / 180)} y2={360 - 230 * Math.cos((a * Math.PI) / 180)} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      <circle cx={300} cy={360} r={22} fill="#fff" />
    </svg>
    <div style={{ position: "absolute", left: 1460, top: 420, width: 240, height: 240, borderRadius: 120, background: "radial-gradient(circle at 40% 35%, #ff9a5a, #b8541a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, fontWeight: 900, color: "#fff", boxShadow: "0 0 60px rgba(255,120,40,.5)" }}>Fe</div>
    {lock > 0.01 && <svg viewBox="0 0 100 110" style={{ position: "absolute", left: 1520, top: 470 - (1 - lock) * 200, width: 130, height: 140, opacity: cl(lock * 2) }}><path d="M25 50 V32 a25 25 0 0 1 50 0 V50" stroke="#e8e8ea" strokeWidth={12} fill="none" /><rect x={12} y={48} width={76} height={56} rx={10} fill="#d0d4d8" /><circle cx={50} cy={72} r={8} fill="#333" /></svg>}
    <Tag tt={tt} at={3.6} x={1580} y={760} txt="EL HIERRO SE TRABA" col={RED} size={36} />
    <Tag tt={tt} at={4.4} x={460} y={900} txt="1 CUCHARADA RASA · NADA MÁS" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 11:30 · LA CÁSCARA DE HUEVO: entera tarda años; molida casi polvo, meses ----
export const HEggs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = eio(tt, 1.2, 3.6);
  return <>
    <Head tt={tt} kick="REGLA 3 · EL CALCIO" title="CASI POLVO, NO ENTERA" col={ICE} />
    <div style={{ position: "absolute", left: 300, top: 360, width: 520, height: 420, textAlign: "center" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 130, top: 120 + (i % 2) * 40, width: 150, height: 110, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 40% 30%, #fffaf0, #e6dccb)", clipPath: "polygon(0 40%, 18% 30%, 30% 46%, 46% 28%, 62% 44%, 80% 30%, 100% 42%, 100% 100%, 0 100%)", transform: `rotate(${i * 25 - 20}deg)` }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, fontSize: 40, fontWeight: 900, color: RED }}>ENTERA · AÑOS</div>
    </div>
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M860 560 L1040 560" stroke={AMB} strokeWidth={8} strokeDasharray={180} strokeDashoffset={180 * (1 - g)} /></svg>
    <div style={{ position: "absolute", left: 1120, top: 500, width: 420, height: 220, borderRadius: "0 0 210px 210px", background: "linear-gradient(90deg,#7a7470,#b8b2aa,#7a7470)", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 14, height: 70 * g, borderRadius: "0 0 160px 160px", background: "radial-gradient(circle, #ffffff, #e8e0d0)" }} />
    </div>
    <div style={{ position: "absolute", left: 1290 + 60 * Math.sin(tt * 5) * g, top: 340, width: 60, height: 230, borderRadius: 30, background: "linear-gradient(90deg,#6a645e,#a8a29a)", transform: `rotate(${18 * Math.sin(tt * 5) * g}deg)` }} />
    <div style={{ position: "absolute", left: 1330, top: 780, transform: "translateX(-50%)", fontSize: 40, fontWeight: 900, color: GRN, whiteSpace: "nowrap", opacity: cl(g * 2 - 1) }}>MOLIDA · MESES</div>
    <Tag tt={tt} at={3.8} x={960} y={930} txt="LAVAR · SECAR · MORTERO" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 12:10 · EL ANILLO: maceta vista desde arriba, las raíces que comen al borde, el tronco con una cruz ----
export const HRing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 0.8, 2.6), ring = eio(tt, 2.8, 4.2);
  return <>
    <Head tt={tt} kick="REGLA 3 · CÓMO SE ECHA" title="EN ANILLO, CERCA DEL BORDE" col={GRN} />
    <svg style={{ position: "absolute", left: 960 - 330, top: 210, width: 660, height: 660, overflow: "visible" }}>
      <circle cx={330} cy={330} r={318} fill={CLAY} /><circle cx={330} cy={330} r={290} fill={SOIL} />
      {Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return <Root key={i} d={`M${330 + Math.cos(a) * 60} ${330 + Math.sin(a) * 60} Q${330 + Math.cos(a + 0.2) * 180} ${330 + Math.sin(a + 0.2) * 180} ${330 + Math.cos(a + 0.1) * 275} ${330 + Math.sin(a + 0.1) * 275}`} p={r} col={i % 2 ? "#f4ead2" : "#d8c39a"} w={3} />; })}
      <circle cx={330} cy={330} r={210} fill="none" stroke="#6a4a2c" strokeWidth={70 * ring} opacity={0.95} />
      <circle cx={330} cy={330} r={210} fill="none" stroke={AMB} strokeWidth={4} strokeDasharray="14 12" opacity={ring} />
      <circle cx={330} cy={330} r={40} fill="#7a6450" stroke={RED} strokeWidth={6 * cl(tt - 1.6)} />
      <path d="M300 300 L360 360 M360 300 L300 360" stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={cl(tt - 1.6)} />
    </svg>
    <Tag tt={tt} at={1.8} x={420} y={540} txt="PEGADO AL TRONCO NO" col={RED} size={34} />
    <Tag tt={tt} at={1.2} x={1500} y={330} txt="LAS FINITAS BLANCAS COMEN" col={TX} size={32} />
    <Big x={1500} y={640} txt="10 CM" s={phys(tt, 3.2, 6, 0.5)} col={GRN} size={110} sub="DEL BORDE" />
  </>;
}}</Stage>;

// ---- 13:05 · MITAD Y MÁS SEGUIDO: la dosis entera cada 3 meses pega y quema; la mitad cada mes, pareja ----
export const HHalfDose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.6, 4.2), W0 = 1300, x0 = 320;
  const full = (x: number) => { const m = (x * 12) % 3; return m < 0.2 ? 1 : Math.max(0.05, 1 - (m - 0.2) / 2); };
  const half = (x: number) => 0.5 + 0.06 * Math.sin(x * 12 * Math.PI * 2);
  const path = (f: (x: number) => number, y0: number) => Array.from({ length: 121 }, (_, i) => i / 120).filter((x) => x <= p).map((x, i) => `${i ? "L" : "M"}${x0 + x * W0} ${y0 - f(x) * 300}`).join(" ");
  return <>
    <Head tt={tt} kick="REGLA 3 · EL ABONO COMPRADO" title="LA MITAD, CADA MES" col={AMB} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <rect x={x0} y={420} width={W0} height={30} fill="rgba(255,70,60,.18)" /><text x={x0 + W0 + 20} y={444} fill={RED} fontSize={26} fontWeight={900}>QUEMA</text>
      <line x1={x0} y1={760} x2={x0 + W0} y2={760} stroke="rgba(255,255,255,.3)" strokeWidth={3} />
      {Array.from({ length: 13 }, (_, i) => <text key={i} x={x0 + (i / 12) * W0} y={800} fill={DIM} fontSize={24} fontWeight={800} textAnchor="middle">{i ? i : ""}</text>)}
      <path d={path(full, 760)} stroke={RED} strokeWidth={8} fill="none" strokeLinejoin="round" />
      <path d={path(half, 760)} stroke={GRN} strokeWidth={8} fill="none" strokeLinejoin="round" />
    </svg>
    <Tag tt={tt} at={1.6} x={760} y={380} txt="DOSIS ENTERA CADA 3" col={RED} size={32} />
    <Tag tt={tt} at={2.8} x={1300} y={560} txt="½ DOSIS CADA MES" col={GRN} size={36} />
    <div style={{ position: "absolute", left: 960, top: 860, transform: "translateX(-50%)", fontSize: 28, fontWeight: 800, letterSpacing: 4, color: DIM }}>MESES</div>
  </>;
}}</Stage>;
