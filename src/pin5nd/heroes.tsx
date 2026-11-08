// heroes.tsx · kit PinSiete (sesD, pin5nd «7 cosas que nunca haría en mi casa siendo electricista»): componentes PROPIOS dibujados (zapatilla en cadena, alfombra, rollo que se cocina, batería hinchada, pata de tierra, taladro y caño, llave que corta el neutro).
// Escenario = Stage de ckit. VOSEO. Seguridad del guion.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { cl, eio, H, HAND, img, phys, Stage } from "./ckit";
import { FONT } from "./lib";

type C = React.FC<{ t: number; h: H }>;
const RED = "#e8432e", GRN = "#5fc7a0", CU_ = "#d9873e", CUL = "#f4b26b", INK = "#f3f6f8", NAVY = "#0f1b2a", AMB = "#ffc23a", BLU = "#5aa9e6", BRN = "#7b4a2a";
const P = (tt: number, a: number, w = 7, z = 0.5) => phys(tt, a, w, z);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const W = (tt: number, a: number, b: number) => eio(tt, a, b);

const Lbl: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; bg?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, tx, col = NAVY, bg = INK, size = 46, hand }) => {
  const s = P(tt, at, 8, 0.5); if (s <= 0.01) return null;
  const hw = (tx.length * (hand ? size * 1.3 : size) * 0.74 + 60) / 2; x = Math.min(Math.max(x, hw + 110), 1810 - hw);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2.2),
    padding: hand ? "4px 18px" : "10px 26px", borderRadius: 14, background: bg, color: col, fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: hand ? size * 1.3 : size,
    letterSpacing: hand ? 0 : 1.5, whiteSpace: "nowrap", boxShadow: hand ? "none" : "0 14px 34px rgba(0,0,0,.45)", textShadow: hand ? "0 6px 18px rgba(0,0,0,.7)" : "none" }}>{tx}</div>;
};
const Big: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; size?: number }> = ({ tt, at, x, y, tx, col = AMB, size = 200 }) => {
  const s = P(tt, at, 7, 0.42); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: "6px #1b1206", textShadow: "0 18px 40px rgba(0,0,0,.6)", lineHeight: 1, whiteSpace: "nowrap" } as React.CSSProperties}>{tx}</div>;
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>{children}</svg>;
const Defs = () => <defs>
  <radialGradient id="cu" cx=".35" cy=".35"><stop offset="0" stopColor="#ffd9a8" /><stop offset=".5" stopColor={CU_} /><stop offset="1" stopColor="#7a3d12" /></radialGradient>
  <linearGradient id="cuL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd9a8" /><stop offset=".5" stopColor={CU_} /><stop offset="1" stopColor="#7a3d12" /></linearGradient>
  <linearGradient id="hot" x1="0" x2="1"><stop offset="0" stopColor="#ffdd55" /><stop offset=".5" stopColor="#ff6a1a" /><stop offset="1" stopColor="#c21d0a" /></linearGradient>
  <pattern id="vy" width="60" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="30" height="40" fill="#3fa34d" /><rect x="30" width="30" height="40" fill="#f2d21b" /></pattern>
  <filter id="glow"><feGaussianBlur stdDeviation="10" /></filter>
</defs>;
const Breaker: React.FC<{ x: number; y: number; s?: number; on: number; amp: string; glow?: number }> = ({ x, y, s = 1, on, amp, glow = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-70} y={-170} width={140} height={340} rx={14} fill="#f4f4f2" stroke="#9aa3ab" strokeWidth={4} />
    <rect x={-70} y={-170} width={140} height={46} rx={10} fill="#d8dde2" />
    <rect x={-40} y={-80} width={80} height={130} rx={10} fill="#2b3640" />
    <rect x={-30} y={lp(30, -70, on)} width={60} height={46} rx={8} fill={on > 0.5 ? GRN : RED} />
    <text x={0} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={NAVY}>{amp}</text>
    {glow > 0 && <rect x={-90} y={-190} width={180} height={380} rx={24} fill="none" stroke={RED} strokeWidth={10} opacity={glow} />}
  </g>
);
const CableCut: React.FC<{ r: number; col: string }> = ({ r, col }) => <g><circle r={r * 1.9} fill={col} stroke="rgba(0,0,0,.35)" strokeWidth={4} /><circle r={r} fill="url(#cu)" /></g>;
const Wire: React.FC<{ x1: number; x2: number; y: number; col: string; th?: number; bare?: number; dir?: 1 | -1; hot?: number }> = ({ x1, x2, y, col, th = 34, bare = 0, dir = 1, hot = 0 }) => {
  const a = Math.min(x1, x2), w = Math.abs(x2 - x1), tip = dir === 1 ? Math.max(x1, x2) : a;
  return <g>
    <rect x={a} y={y - th / 2} width={w} height={th} rx={th / 2} fill={hot > 0 ? "url(#hot)" : col} />
    <rect x={a} y={y - th / 2 + 4} width={w} height={th * 0.22} rx={4} fill="rgba(255,255,255,.28)" />
    {bare > 0 && <rect x={dir === 1 ? tip : tip - bare} y={y - th * 0.22} width={bare} height={th * 0.44} rx={4} fill="url(#cuL)" />}
  </g>;
};
const Socket: React.FC<{ x: number; y: number; s?: number; tint?: number }> = ({ x, y, s = 1, tint = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-190} width={300} height={380} rx={26} fill={`rgb(${246 - 30 * tint},${244 - 60 * tint},${236 - 130 * tint})`} stroke="#b9b3a6" strokeWidth={5} />
    <rect x={-100} y={-120} width={200} height={240} rx={30} fill={`rgb(${236 - 30 * tint},${235 - 60 * tint},${228 - 130 * tint})`} stroke="#c9c4b8" strokeWidth={4} />
    <rect x={-58} y={-40} width={16} height={50} rx={4} transform="rotate(30 -50 -15)" fill="#2b2b2b" />
    <rect x={42} y={-40} width={16} height={50} rx={4} transform="rotate(-30 50 -15)" fill="#2b2b2b" />
    <rect x={-8} y={30} width={16} height={56} rx={4} fill="#2b2b2b" />
  </g>
);
const Clamp: React.FC<{ x: number; y: number; s?: number; val: string }> = ({ x, y, s = 1, val }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -90 -150 A 95 95 0 1 1 90 -150" fill="none" stroke="#f2c21b" strokeWidth={44} strokeLinecap="round" />
    <rect x={-110} y={-120} width={220} height={380} rx={40} fill="#f2c21b" stroke="#a88208" strokeWidth={5} />
    <rect x={-80} y={-80} width={160} height={100} rx={12} fill="#c9d6c1" stroke="#555" strokeWidth={4} />
    <text x={70} y={-12} textAnchor="end" fontFamily="monospace" fontWeight={900} fontSize={64} fill={NAVY}>{val}</text>
    <circle cx={0} cy={120} r={52} fill="#222" /><circle cx={0} cy={120} r={10} fill="#888" />
  </g>
);
const Box: React.FC<{ x: number; y: number; w?: number; h?: number; lid?: number; children?: React.ReactNode; metal?: boolean }> = ({ x, y, w = 560, h = 420, lid = 0, children, metal }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={metal ? 8 : 26} fill={metal ? "#7d868f" : "#e9e6dc"} stroke={metal ? "#4b535a" : "#b5ae9e"} strokeWidth={8} />
    <rect x={-w / 2 + 26} y={-h / 2 + 26} width={w - 52} height={h - 52} rx={metal ? 4 : 16} fill={metal ? "#3a4148" : "#5a554b"} />
    {children}
    {lid < 0.99 && <g transform={`translate(0,${-h / 2}) scale(1,${1 - lid}) translate(0,${h / 2})`}><rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} rx={metal ? 10 : 30} fill={metal ? "#9aa3ab" : "#f3f1ea"} stroke="#b5ae9e" strokeWidth={6} /></g>}
  </g>
);
const Photo: React.FC<{ id?: string; x: number; y: number; w: number; h: number; tt: number; at?: number; rot?: number }> = ({ id, x, y, w, h, tt, at = 0, rot = -2 }) => {
  const s = P(tt, at, 6.5, 0.55); if (!id || s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, padding: 12, background: "#f6f2e8", borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,.5)", transform: `translateY(${(1 - s) * 600}px) rotate(${rot * s}deg)`, opacity: cl(s * 2) }}>
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.11 + 0.05 * W(tt, at, at + 6)})` }} /></div>
  </div>;
};

// ───────── kit PinTermicas: primitivas propias ─────────
const Card: React.FC<{ x: number; y: number; w: number; h: number; s: number; children?: React.ReactNode; bg?: string; rot?: number }> = ({ x, y, w, h, s, children, bg = INK, rot = 0 }) => s <= 0.01 ? null :
  <g transform={`translate(${x},${y}) rotate(${rot * (1 - s)}) scale(${0.7 + 0.3 * s})`} opacity={cl(s * 2)}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={bg} stroke="rgba(0,0,0,.25)" strokeWidth={4} />{children}</g>;
const T: React.FC<{ x: number; y: number; tx: string; size?: number; col?: string; anchor?: "start" | "middle" | "end"; hand?: boolean; op?: number }> = ({ x, y, tx, size = 42, col = NAVY, anchor = "middle", hand, op = 1 }) =>
  <text x={x} y={y} textAnchor={anchor} fontFamily={hand ? HAND : FONT} fontWeight={900} fontSize={size} fill={col} opacity={op}>{tx}</text>;
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; col?: string; w?: number }> = ({ x1, y1, x2, y2, k, col = AMB, w = 10 }) => {
  if (k <= 0.01) return null; const x = lp(x1, x2, k), y = lp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={x} y2={y} stroke={col} strokeWidth={w} strokeLinecap="round" />
    <path d={`M ${x} ${y} l ${-34 * Math.cos(a - 0.45)} ${-34 * Math.sin(a - 0.45)} M ${x} ${y} l ${-34 * Math.cos(a + 0.45)} ${-34 * Math.sin(a + 0.45)}`} stroke={col} strokeWidth={w} strokeLinecap="round" /></g>;
};
const Check: React.FC<{ x: number; y: number; ok: boolean; s: number }> = ({ x, y, ok, s }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${s})`}>
  <circle r={40} fill={ok ? GRN : RED} />{ok ? <path d="M -18 0 l 12 14 l 24 -28" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M -16 -16 l 32 32 M 16 -16 l -32 32" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}</g>;
const Pill: React.FC<{ tt: number; at: number; x: number; y: number; w: number; tx: string; bg?: string; col?: string; size?: number; ok?: boolean }> = ({ tt, at, x, y, w, tx, bg = INK, col = NAVY, size = 38, ok }) => { const s = P(tt, at); return <Card x={x} y={y} w={w} h={96} s={s} bg={bg}>
  <T x={ok === undefined ? 0 : 30} y={14} tx={tx} size={size} col={col} />{ok !== undefined && <Check x={-w / 2 + 56} y={0} ok={ok} s={P(tt, at + 0.4)} />}</Card>; };
const Bar: React.FC<{ x: number; y: number; w: number; h?: number; k: number; col?: string; tx?: string }> = ({ x, y, w, h = 70, k, col = AMB, tx }) => <g>
  <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="rgba(255,255,255,.12)" /><rect x={x} y={y} width={Math.max(h, w * cl(k))} height={h} rx={h / 2} fill={col} opacity={k > 0.01 ? 1 : 0} />
  {tx && <T x={x + 30} y={y + h * 0.68} tx={tx} size={h * 0.55} anchor="start" />}</g>;
// tablero de puerta gris con N térmicas (ons = estado de cada palanca 0-1)
const Panel: React.FC<{ x: number; y: number; amps: string[]; ons?: number[]; s?: number; glow?: number[]; labels?: string[] }> = ({ x, y, amps, ons, s = 0.8, glow, labels }) => {
  const n = amps.length, step = 160 * s, w = n * step + 120 * s;
  return <g><rect x={x - w / 2} y={y - 260 * s} width={w} height={520 * s} rx={18} fill="#8e979f" stroke="#4b535a" strokeWidth={8} /><rect x={x - w / 2 + 24} y={y - 236 * s} width={w - 48} height={472 * s} rx={10} fill="#3a4148" />
    {amps.map((a, i) => <g key={i}><Breaker x={x - (n - 1) * step / 2 + i * step} y={y} s={s} on={ons ? ons[i] : 1} amp={a} glow={glow ? glow[i] : 0} />
      {labels && labels[i] && <g><rect x={x - (n - 1) * step / 2 + i * step - 66 * s} y={y + 180 * s} width={132 * s} height={44 * s} fill="#f6efd6" /><T x={x - (n - 1) * step / 2 + i * step} y={y + 212 * s} tx={labels[i]} size={26 * s} hand /></g>}</g>)}</g>;
};
// cable en tramo con su sección escrita (hot 0-1 lo pone al rojo)
const Cable: React.FC<{ x1: number; x2: number; y: number; mm: string; th?: number; hot?: number; brown?: number }> = ({ x1, x2, y, mm, th = 40, hot = 0, brown = 0 }) => <g>
  <Wire x1={x1} x2={x2} y={y} col={brown > 0.5 ? BRN : "#d9d9d4"} th={th} hot={hot > 0.5 ? 1 : 0} />
  <T x={(x1 + x2) / 2} y={y - th / 2 - 16} tx={`${mm} mm²`} size={40} col={INK} /></g>;
const Bimetal: React.FC<{ x: number; y: number; k: number; s?: number }> = ({ x, y, k, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d={`M -200 0 Q 0 ${-120 * k} 200 ${-40 * k}`} stroke="#c9ccd1" strokeWidth={22} fill="none" /><path d={`M -200 22 Q 0 ${22 - 120 * k} 200 ${22 - 40 * k}`} stroke={CU_} strokeWidth={22} fill="none" />
  <rect x={-240} y={-30} width={50} height={80} fill="#555" /></g>;
const Coil: React.FC<{ x: number; y: number; pull: number; s?: number }> = ({ x, y, pull, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-160 + i * 40} cy={0} rx={20} ry={90} fill="none" stroke={CU_} strokeWidth={12} />)}
  <rect x={-260 + 120 * pull} y={-26} width={180} height={52} rx={8} fill="#6d747b" stroke="#333" strokeWidth={4} />
  {pull > 0.5 && <ellipse cx={0} cy={0} rx={260} ry={150} fill="none" stroke={BLU} strokeWidth={6} strokeDasharray="14 12" opacity={0.8} />}</g>;
const Clock: React.FC<{ x: number; y: number; k: number; r?: number; col?: string; tx?: string }> = ({ x, y, k, r = 110, col = AMB, tx }) => <g transform={`translate(${x},${y})`}>
  <circle r={r} fill={INK} stroke="#1b1206" strokeWidth={6} /><path d={`M 0 0 L 0 ${-r * 0.82} A ${r * 0.82} ${r * 0.82} 0 ${k > 0.5 ? 1 : 0} 1 ${r * 0.82 * Math.sin(k * 2 * Math.PI)} ${-r * 0.82 * Math.cos(k * 2 * Math.PI)} Z`} fill={col} opacity={k > 0.005 ? 1 : 0} />
  {tx && <T x={0} y={r + 60} tx={tx} size={40} col={INK} />}</g>;
const Kettle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M -90 80 L -70 -70 Q 0 -110 70 -70 L 90 80 Z" fill="#e6e8ea" stroke="#555" strokeWidth={6} /><path d="M 90 -20 Q 150 -10 130 60" stroke="#555" strokeWidth={14} fill="none" /><path d="M -70 -40 L -140 -80" stroke="#555" strokeWidth={14} /></g>;
const Spark: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => k <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${k})`}>
  <path d="M 0 -80 L 18 -18 L 80 0 L 18 18 L 0 80 L -18 18 L -80 0 L -18 -18 Z" fill={AMB} stroke="#ff6a1a" strokeWidth={6} /></g>;
const Tester: React.FC<{ x: number; y: number; lit: number; rot?: number }> = ({ x, y, lit, rot = -30 }) => <g transform={`translate(${x},${y}) rotate(${rot})`}>
  <rect x={-18} y={-260} width={36} height={220} rx={14} fill="#2a6fdb" /><rect x={-6} y={-40} width={12} height={70} fill="#ccc" /><circle cx={0} cy={-200} r={14} fill={lit > 0.5 ? RED : "#666"} />{lit > 0.5 && <circle cx={0} cy={-200} r={34} fill={RED} opacity={0.35} />}</g>;
const Meter: React.FC<{ x: number; y: number; val: string; s?: number }> = ({ x, y, val, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-130} y={-200} width={260} height={400} rx={30} fill="#f2c21b" stroke="#a88208" strokeWidth={6} /><rect x={-100} y={-170} width={200} height={110} rx={10} fill="#c9d6c1" stroke="#555" strokeWidth={4} />
  <text x={80} y={-90} textAnchor="end" fontFamily="monospace" fontWeight={900} fontSize={70} fill={NAVY}>{val}</text><circle cx={0} cy={60} r={70} fill="#333" /><circle cx={0} cy={60} r={14} fill="#888" /></g>;

// ───────── kit PinTreinta: primitivas propias (objetos del trabajo diario) ─────────
const YEL = "#f2c21b", GRY = "#8e979f", DK = "#222b33", PAP = "#f1e6c6";
const Num: React.FC<{ tt: number; at?: number; x: number; y: number; n: number; s?: number }> = ({ tt, at = 0.2, x, y, n, s = 1 }) => { const k = P(tt, at, 8, 0.45); return k <= 0.01 ? null :
  <g transform={`translate(${x},${y}) scale(${s * (0.5 + 0.5 * k)}) rotate(${(1 - k) * -30})`} opacity={cl(k * 2)}><circle r={92} fill={AMB} stroke="#1b1206" strokeWidth={7} /><T x={0} y={36} tx={String(n)} size={104} col="#1b1206" /></g>; };
const Radio: React.FC<{ x: number; y: number; s?: number; on: number; t: number }> = ({ x, y, s = 1, on, t }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <line x1={110} y1={-120} x2={210} y2={-290} stroke="#aaa" strokeWidth={8} /><rect x={-210} y={-130} width={420} height={260} rx={30} fill="#a4562c" stroke="#5a2c12" strokeWidth={7} />
  <circle cx={-90} cy={0} r={92} fill="#3a2a1e" />{[-40, 0, 40].map((d) => <line key={d} x1={-170} x2={-10} y1={d} y2={d} stroke="#6b5240" strokeWidth={6} />)}<rect x={40} y={-90} width={140} height={60} rx={8} fill="#f0dfae" /><circle cx={80} cy={40} r={30} fill="#ddd" /><circle cx={150} cy={40} r={30} fill="#ddd" />
  {on > 0.5 && [0, 1, 2].map((i) => { const p = (t * 1.1 + i / 3) % 1; return <path key={i} d={`M 240 ${-70 - p * 50} q ${40 + p * 80} ${70 + p * 50} 0 ${140 + p * 100}`} stroke={AMB} strokeWidth={9} fill="none" opacity={1 - p} />; })}</g>;
const Screwdriver: React.FC<{ x: number; y: number; rot?: number; s?: number; ins?: boolean }> = ({ x, y, rot = 0, s = 1, ins }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  <rect x={-40} y={-340} width={80} height={200} rx={26} fill={ins ? RED : YEL} stroke="#333" strokeWidth={5} /><rect x={-13} y={-140} width={26} height={250} fill="#c9ccd1" />{ins && <rect x={-20} y={-140} width={40} height={222} fill={RED} opacity={0.95} />}<path d="M -13 110 L 13 110 L 6 150 L -6 150 Z" fill="#9aa3ab" /></g>;
const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; children?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, children }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}><rect x={-150} y={-290} width={300} height={580} rx={40} fill="#14181c" stroke="#555" strokeWidth={6} /><rect x={-132} y={-262} width={264} height={524} rx={18} fill="#2a333b" />{children}</g>;
const Plug: React.FC<{ x: number; y: number; s?: number; col?: string; rot?: number }> = ({ x, y, s = 1, col = "#30363c", rot = 0 }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}><rect x={-80} y={-70} width={160} height={140} rx={34} fill={col} stroke="#111" strokeWidth={5} /><rect x={-42} y={70} width={14} height={60} fill="#cfd3d8" /><rect x={28} y={70} width={14} height={60} fill="#cfd3d8" /><rect x={-14} y={-210} width={28} height={140} fill={col} /></g>;
const TesterOut: React.FC<{ x: number; y: number; s?: number; on: string }> = ({ x, y, s = 1, on }) => <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-170} y={-120} width={340} height={240} rx={40} fill="#f2c21b" stroke="#a88208" strokeWidth={6} />{[0, 1, 2].map((i) => <g key={i}><circle cx={-100 + i * 100} cy={-20} r={36} fill={on[i] === "1" ? GRN : on[i] === "2" ? RED : "#5b5b52"} />{on[i] !== "0" && <circle cx={-100 + i * 100} cy={-20} r={56} fill={on[i] === "1" ? GRN : RED} opacity={0.3} />}</g>)}</g>;
const Reel: React.FC<{ x: number; y: number; r?: number; spin: number; col?: string; hot?: number }> = ({ x, y, r = 200, spin, col = "#e7b512", hot = 0 }) => <g transform={`translate(${x},${y}) rotate(${spin * 360})`}><circle r={r} fill={col} stroke="#6d5508" strokeWidth={8} />{[0.86, 0.72, 0.58].map((k) => <circle key={k} r={r * k} fill="none" stroke={hot > 0.5 ? RED : "#30363c"} strokeWidth={r * 0.1} opacity={0.9} />)}<circle r={r * 0.32} fill="#555" /><rect x={-8} y={-r * 0.3} width={16} height={r * 0.6} fill="#aaa" /></g>;
const Bulb: React.FC<{ x: number; y: number; s?: number; g: number }> = ({ x, y, s = 1, g }) => <g transform={`translate(${x},${y}) scale(${s})`}>{g > 0.02 && <circle cy={-40} r={240} fill={AMB} opacity={0.35 * g} filter="url(#glow)" />}<path d="M -120 -60 A 130 130 0 1 1 120 -60 Q 90 30 60 90 L -60 90 Q -90 30 -120 -60 Z" fill={`rgba(255,240,190,${0.18 + 0.75 * g})`} stroke="#ddd" strokeWidth={6} /><rect x={-60} y={92} width={120} height={84} rx={10} fill="#9aa3ab" /></g>;
const Wall: React.FC<{ tone?: string }> = ({ tone = "#d7ccb6" }) => <rect x={180} y={130} width={1560} height={820} rx={14} fill={tone} stroke="#958a73" strokeWidth={6} />;
const Toggle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-90} y={-130} width={180} height={260} rx={20} fill="#f6f4ec" stroke="#b9b3a6" strokeWidth={5} /><rect x={-34} y={-70} width={68} height={140} rx={10} fill="#e6e2d6" stroke="#aaa" strokeWidth={3} /></g>;
const Tag: React.FC<{ x: number; y: number; tx: string; s?: number; rot?: number; bg?: string; w?: number }> = ({ x, y, tx, s = 1, rot = 0, bg = PAP, w = 200 }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}><rect x={-w / 2} y={-44} width={w} height={88} rx={6} fill={bg} stroke="#b8a878" strokeWidth={3} /><T x={0} y={18} tx={tx} size={46} hand /></g>;
const Beep: React.FC<{ x: number; y: number; t: number; on: boolean }> = ({ x, y, t, on }) => !on ? null : <g>{[0, 1, 2].map((i) => { const p = (t * 1.4 + i / 3) % 1; return <circle key={i} cx={x} cy={y} r={40 + p * 180} fill="none" stroke={GRN} strokeWidth={7} opacity={1 - p} />; })}</g>;

// ───────── kit PinSiete: primitivas nuevas (objetos de la casa) ─────────
const Strip: React.FC<{ x: number; y: number; s?: number; n?: number; brown?: number; rot?: number }> = ({ x, y, s = 1, n = 5, brown = 0, rot = 0 }) => { const w = n * 110 + 80; return <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  <rect x={-w / 2} y={-60} width={w} height={120} rx={30} fill={`rgb(${242 - 90 * brown},${240 - 140 * brown},${232 - 190 * brown})`} stroke="#9a9488" strokeWidth={5} />
  {brown > 0.05 && <ellipse cx={-w / 2 + 70} cy={0} rx={90} ry={50} fill="#5b2e10" opacity={0.7 * brown} />}
  {Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(${-w / 2 + 95 + i * 110},0)`}><circle r={38} fill="#e4e0d4" stroke="#b5ae9e" strokeWidth={3} /><rect x={-20} y={-16} width={8} height={22} transform="rotate(30 -16 -5)" fill="#333" /><rect x={12} y={-16} width={8} height={22} transform="rotate(-30 16 -5)" fill="#333" /><rect x={-4} y={10} width={8} height={18} fill="#333" /></g>)}
  <rect x={w / 2 - 62} y={-30} width={40} height={60} rx={8} fill={RED} /></g>; };
const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  {[-66, -22, 22, 66].map((dx, i) => <rect key={i} x={dx - 19} y={-200 + Math.abs(i - 1.5) * 22} width={38} height={150} rx={19} fill="#d9a07a" stroke="#8a5a3a" strokeWidth={4} />)}
  <rect x={-95} y={-90} width={190} height={190} rx={60} fill="#d9a07a" stroke="#8a5a3a" strokeWidth={4} />
  <rect x={70} y={-40} width={44} height={130} rx={22} transform="rotate(-35 92 25)" fill="#d9a07a" stroke="#8a5a3a" strokeWidth={4} />
  <rect x={-80} y={95} width={160} height={120} fill="#22344a" /></g>;
const Batt: React.FC<{ x: number; y: number; s?: number; sw?: number; hot?: number }> = ({ x, y, s = 1, sw = 0, hot = 0 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d={`M -110 -170 Q ${-110 - 70 * sw} 0 -110 170 L 110 170 Q ${110 + 70 * sw} 0 110 -170 Z`} fill={hot > 0.5 ? "url(#hot)" : "#2f3a44"} stroke="#11161b" strokeWidth={6} />
  <rect x={-40} y={-200} width={80} height={32} rx={6} fill="#9aa3ab" />
  <path d="M -20 -60 L 20 -60 L -5 10 L 25 10 L -25 100 L -5 30 L -30 30 Z" fill={AMB} /></g>;
const Humo: React.FC<{ x: number; y: number; s?: number; t: number; on: boolean }> = ({ x, y, s = 1, t, on }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-150} y={-40} width={300} height={44} fill="#f4f4f0" stroke="#aaa" strokeWidth={4} /><ellipse cx={0} cy={4} rx={150} ry={40} fill="#ecece6" stroke="#aaa" strokeWidth={4} />
  {[-60, -20, 20, 60].map((d) => <line key={d} x1={d} y1={-10} x2={d} y2={22} stroke="#bbb" strokeWidth={6} />)}
  <circle cx={110} cy={0} r={13} fill={on && Math.floor(t * 3) % 2 === 0 ? RED : "#933"} />
  {on && [0, 1, 2].map((i) => { const p = (t * 1.2 + i / 3) % 1; return <path key={i} d={`M ${-120 - p * 90} ${60 + p * 60} q ${120 + p * 90} ${60 + p * 40} ${240 + p * 180} 0`} stroke={RED} strokeWidth={7} fill="none" opacity={1 - p} />; })}</g>;
const Mata: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M -20 -240 Q -150 -200 -140 60" stroke="#222" strokeWidth={16} fill="none" /><rect x={-80} y={-200} width={160} height={400} rx={70} fill="#d42a1e" stroke="#7a130b" strokeWidth={6} />
  <rect x={-30} y={-252} width={60} height={60} fill="#333" /><path d="M 30 -246 L 130 -270 L 130 -236 L 30 -222 Z" fill="#222" />
  <rect x={-62} y={-60} width={124} height={120} rx={10} fill="#f6f2e2" /><T x={0} y={18} tx="ABC" size={50} col={NAVY} /></g>;
const Lava: React.FC<{ x: number; y: number; s?: number; live?: number }> = ({ x, y, s = 1, live = 0 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-170} y={-200} width={340} height={400} rx={20} fill="#eef0f2" stroke={live > 0.5 ? RED : "#8a929a"} strokeWidth={live > 0.5 ? 14 : 6} />
  <rect x={-164} y={-194} width={328} height={64} rx={16} fill="#d9dde1" /><circle cx={110} cy={-162} r={18} fill="#888" />
  <circle cx={0} cy={40} r={120} fill="#9fb4c4" stroke="#7a8a96" strokeWidth={14} /><circle cx={0} cy={40} r={80} fill="#c9dbe8" /></g>;
const Taladro: React.FC<{ x: number; y: number; s?: number; spin?: number }> = ({ x, y, s = 1, spin = 0 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-60} y={-70} width={260} height={120} rx={30} fill="#2a6fdb" stroke="#123" strokeWidth={5} /><rect x={60} y={40} width={80} height={170} rx={20} fill="#2a6fdb" stroke="#123" strokeWidth={5} />
  <rect x={-120} y={-35} width={60} height={50} fill="#333" /><rect x={-270} y={-16} width={150} height={20} fill="#c9ccd1" />
  {spin > 0 && [0, 1, 2].map((i) => <line key={i} x1={-260 + i * 44} y1={-16} x2={-240 + i * 44} y2={4} stroke="#666" strokeWidth={5} />)}</g>;
const Plug3: React.FC<{ x: number; y: number; s?: number; cut?: number; lab?: number }> = ({ x, y, s = 1, cut = 0, lab = 0 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M 0 -330 L 0 -150" stroke="#30363c" strokeWidth={46} /><rect x={-140} y={-160} width={280} height={190} rx={50} fill="#30363c" stroke="#111" strokeWidth={6} />
  <rect x={-14} y={30} width={28} height={lp(200, 40, cut)} fill="#d5b04a" stroke="#8a6a12" strokeWidth={3} />
  <rect x={-92} y={22} width={26} height={140} rx={4} transform="rotate(30 -79 22)" fill="#cfd3d6" stroke="#777" strokeWidth={3} />
  <rect x={66} y={22} width={26} height={140} rx={4} transform="rotate(-30 79 22)" fill="#cfd3d6" stroke="#777" strokeWidth={3} />
  {lab > 0.01 && <g opacity={cl(lab * 2)}><T x={-190} y={210} tx="FASE" size={38} col={INK} /><T x={190} y={210} tx="NEUTRO" size={38} col={INK} /><T x={0} y={290} tx="TIERRA" size={44} col={AMB} /></g>}</g>;
const Casa: React.FC<{ tt: number }> = ({ tt }) => <g opacity={cl(P(tt, 0.2) * 2)}><rect x={360} y={180} width={1200} height={720} rx={10} fill="rgba(240,236,224,.92)" stroke="#5b5346" strokeWidth={14} />
  <line x1={360} y1={560} x2={1560} y2={560} stroke="#5b5346" strokeWidth={10} /><line x1={860} y1={180} x2={860} y2={560} stroke="#5b5346" strokeWidth={10} /><line x1={1160} y1={560} x2={1160} y2={900} stroke="#5b5346" strokeWidth={10} />
  <T x={610} y={300} tx="DORMITORIO" size={40} col="#5b5346" /><T x={1210} y={300} tx="COCINA" size={40} col="#5b5346" /><T x={760} y={700} tx="PASILLO" size={40} col="#5b5346" /><T x={1360} y={700} tx="LIVING" size={40} col="#5b5346" />
  <rect x={1480} y={760} width={80} height={140} fill={GRN} /></g>;

// título de cada una de las 7: número grande + qué no hago + dibujo propio
const Tit = (n: number, l1: string, l2: string, draw: (tt: number) => React.ReactNode, mode: "iris" | "wipe" | "blinds" | "split" | "drop" | "diag" | "ring"): C => ({ t, h }) => <Stage t={t} h={h} mode={mode}>{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`translate(420,520) scale(${0.4 + 0.6 * P(tt, 0.2, 7, 0.4)})`}><circle r={250} fill={AMB} stroke="#1b1206" strokeWidth={12} /><T x={0} y={120} tx={String(n)} size={340} col="#1b1206" /></g>
  <g opacity={cl(P(tt, 0.9) * 2)}>{draw(tt)}</g>
  {Array.from({ length: 7 }, (_, j) => <circle key={j} cx={760 + j * 70} cy={960} r={22} fill={j < n - 1 ? GRN : j === n - 1 ? AMB : "rgba(255,255,255,.2)"} />)}
  </Svg><Lbl tt={tt} at={0.6} x={1250} y={150} tx="NUNCA HARÍA" bg={RED} col={INK} size={54} /><Lbl tt={tt} at={1.1} x={1250} y={790} tx={l1} bg={INK} size={44} />{l2 && <Lbl tt={tt} at={1.4} x={1250} y={875} tx={l2} bg={INK} size={44} />}</AbsoluteFill>}</Stage>;
const T1 = Tit(1, "ZAPATILLA EN ZAPATILLA", "NI ALGO QUE CALIENTA", (tt) => <g><Strip x={1100} y={420} s={0.6} /><Strip x={1400} y={560} s={0.6} brown={W(tt, 1.4, 3)} /></g>, "iris");
const T2 = Tit(2, "CABLE BAJO LA ALFOMBRA", "NI APRETADO POR UN MUEBLE", (tt) => <g><rect x={900} y={470} width={780} height={70} rx={12} fill="#a7643a" /><Wire x1={850} x2={1730} y={548} col="#d9d9d4" th={22} /><rect x={900} y={460} width={780} height={30} fill="#c88454" /></g>, "wipe");
const T3 = Tit(3, "ALARGUE ENROLLADO", "CON ALGO DE MUCHO CONSUMO", (tt) => <Reel x={1250} y={460} r={190} spin={0} hot={W(tt, 1.5, 3) > 0.5 ? 1 : 0} />, "split");
const T4 = Tit(4, "BATERÍA CARGANDO DE NOCHE", "SIN MIRAR", (tt) => <g><Batt x={1150} y={470} s={0.9} /><circle cx={1450} cy={400} r={90} fill="#e9e4c8" /><circle cx={1490} cy={370} r={80} fill={NAVY} /></g>, "drop");
const T5 = Tit(5, "CORTAR LA PATA DE TIERRA", "NI ANULARLA CON ADAPTADOR", (tt) => <Plug3 x={1250} y={500} s={0.9} cut={W(tt, 1.4, 2.6)} />, "diag");
const T6 = Tit(6, "AGUJEREAR SIN SABER", "POR DÓNDE VAN LOS CAÑOS", (tt) => <g><rect x={950} y={250} width={600} height={430} fill="#d7ccb6" stroke="#958a73" strokeWidth={6} /><line x1={1250} y1={250} x2={1250} y2={680} stroke={RED} strokeWidth={14} strokeDasharray="20 14" /><Taladro x={1620} y={420} s={0.7} spin={1} /></g>, "blinds");
const T7 = Tit(7, "CONFIAR EN LA LLAVE DE LUZ", "PARA CAMBIAR UNA LÁMPARA", (tt) => <g><Toggle x={1050} y={460} s={1.2} /><Bulb x={1420} y={420} s={0.8} g={0} /><Spark x={1420} y={560} k={W(tt, 2, 2.4) * (0.8 + 0.2 * Math.sin(tt * 20))} /></g>, "ring");

const Cadena: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const k = W(tt, 1.8, 3.8); return <AbsoluteFill><Svg><Defs />
  <path d="M 150 300 L 380 300" stroke="#ddd" strokeWidth={18} />
  {[0, 1, 2].map((i) => { const s = P(tt, 0.2 + i * 0.45); return s <= 0.01 ? null : <g key={i} opacity={cl(s * 2)}><Strip x={570 + i * 430} y={300 + i * 220} s={0.62} brown={i === 0 ? k : 0} />{i < 2 && <path d={`M ${760 + i * 430} ${300 + i * 220} C ${880 + i * 430} ${330 + i * 220} ${700 + i * 430} ${500 + i * 220} ${430 + (i + 1) * 430} ${520 + i * 220}`} stroke="#ddd" strokeWidth={14} fill="none" />}</g>; })}
  {k > 0.2 && <circle cx={420} cy={300} r={100} fill={RED} opacity={0.4 * k} filter="url(#glow)" />}
  </Svg>{["ESTUFA DE CUARZO", "PAVA ELÉCTRICA", "CARGADOR"].map((n, i) => <Lbl key={i} tt={tt} at={1.2 + i * 0.35} x={420} y={640 + i * 95} tx={n} bg={i < 2 ? AMB : INK} size={40} />)}
  <Lbl tt={tt} at={3.4} x={560} y={160} tx="PLÁSTICO COCINADO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Siete: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 7 }, (_, j) => { const s = P(tt, 0.3 + j * 0.22, 8, 0.45); const x = 300 + j * 220, y = 520 + (j % 2 ? 60 : -60); return s <= 0.01 ? null : <g key={j} transform={`translate(${x},${y}) scale(${s}) rotate(${(1 - s) * 40})`}><circle r={92} fill={j === 6 ? RED : AMB} stroke="#1b1206" strokeWidth={7} /><T x={0} y={36} tx={String(j + 1)} size={104} col={j === 6 ? INK : "#1b1206"} /></g>; })}
  </Svg><Lbl tt={tt} at={2} x={960} y={200} tx="30 AÑOS · EN MI CASA, NI LOCO" bg={INK} /><Lbl tt={tt} at={2.6} x={1620} y={800} tx="LA 7, AL FINAL" bg={RED} col={INK} hand /></AbsoluteFill>}</Stage>;
const Reglas: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const it = ["BAJAR LA TÉRMICA", "PROBAR QUE NO HAY TENSIÓN", "NUNCA SUBIR EL AMPERAJE", "NUNCA PUENTEAR EL DISYUNTOR"]; return <AbsoluteFill><Svg><Defs />
  <g transform="translate(960,560) rotate(-2)" opacity={cl(P(tt, 0.2) * 2)}><rect x={-560} y={-380} width={1120} height={740} fill="#f4ecd2" stroke="#a89a72" strokeWidth={6} />{Array.from({ length: 9 }, (_, j) => <line key={j} x1={-520} x2={520} y1={-250 + j * 70} y2={-250 + j * 70} stroke="#c8bb94" strokeWidth={3} />)}<line x1={-430} x2={-430} y1={-380} y2={360} stroke="#d77" strokeWidth={4} />
    <T x={0} y={-290} tx="LAS REGLAS DE DON HÉCTOR" size={58} col="#6a3a12" hand />
    {it.map((n, i) => <g key={i} opacity={cl(P(tt, 0.9 + i * 0.5) * 2)}><T x={-380} y={-150 + i * 140} tx={`${i + 1}. ${n}`} size={50} col={NAVY} anchor="start" hand /><Check x={470} y={-165 + i * 140} ok s={P(tt, 1.2 + i * 0.5)} /></g>)}</g>
  </Svg><Lbl tt={tt} at={3.2} x={960} y={1000} tx="40 AÑOS · NI UN ACCIDENTE" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Matric: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const k = W(tt, 0.8, 2); return <AbsoluteFill><Svg><Defs />
  <Panel x={700} y={520} amps={["GRAL", "C16", "C16", "C10", "DIF"]} s={0.85} />
  <g transform={`translate(700,520) scale(${k})`} opacity={k}><rect x={-80} y={-40} width={160} height={130} rx={18} fill={AMB} stroke="#1b1206" strokeWidth={6} /><path d="M -50 -40 L -50 -100 A 50 50 0 0 1 50 -100 L 50 -40" stroke="#1b1206" strokeWidth={18} fill="none" /></g>
  <Card x={1430} y={360} w={640} h={200} s={P(tt, 1.4)} bg={RED}><T x={0} y={18} tx="TABLERO = MATRICULADO" size={44} col={INK} /></Card>
  <Card x={1430} y={640} w={640} h={240} s={P(tt, 2.2)} bg={GRN}><T x={0} y={-20} tx="HOY: COSAS DE USO" size={42} /><T x={0} y={50} tx="SIN TOCAR UN CABLE" size={42} /></Card>
  </Svg></AbsoluteFill>; }}</Stage>;
const Primer: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const k = W(tt, 0.6, 3); const ws = [["ESTUFA", 1500], ["PAVA", 1500], ["CARGADOR", 10]]; return <AbsoluteFill><Svg><Defs />
  <Socket x={240} y={540} s={0.8} /><Cable x1={330} x2={900} y={540} mm="0,75" th={lp(30, 52, k)} hot={k} />
  <Strip x={1150} y={540} s={0.7} />
  {ws.map(([n], i) => { const y = 260 + i * 280; return <g key={i}><path d={`M 1700 ${y} C 1500 ${y} 1450 540 1350 540`} stroke={i < 2 ? AMB : "#bbb"} strokeWidth={i < 2 ? 18 : 8} fill="none" opacity={cl(P(tt, 0.3 + i * 0.3) * 2)} /><T x={1760} y={y + 14} tx={n as string} size={36} col={INK} /></g>; })}
  {[0, 1, 2, 3].map((i) => { const p = ((tt * 0.8 + i / 4) % 1); return <circle key={i} cx={lp(1300, 360, p)} cy={540} r={14} fill={AMB} opacity={k} />; })}
  </Svg><Lbl tt={tt} at={1.6} x={600} y={380} tx="TODO PASA POR ACÁ" bg={RED} col={INK} /><Lbl tt={tt} at={2.6} x={600} y={720} tx="EL PRIMER CABLE, FINITO" bg={INK} size={40} /></AbsoluteFill>; }}</Stage>;
const Calor: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => { const it: [string, number][] = [["ESTUFA DE CUARZO", 0.62], ["PAVA ELÉCTRICA", 1], ["PLANCHA", 0.6], ["SECADOR DE PELO", 0.7], ["HORNO ELÉCTRICO", 0.92], ["TELE", 0.06], ["CARGADOR", 0.02]]; return <AbsoluteFill><Svg><Defs />
  {it.map(([n, v], i) => { const y = 210 + i * 108; const hot = v > 0.3; return <g key={i} opacity={cl(P(tt, 0.2 + i * 0.25) * 2)}><T x={700} y={y + 40} tx={n} size={40} col={INK} anchor="end" /><Bar x={740} y={y} w={1000} h={60} k={v * W(tt, 0.3 + i * 0.25, 1.2 + i * 0.25)} col={hot ? RED : GRN} /></g>; })}
  </Svg><Lbl tt={tt} at={2.6} x={1300} y={990} tx="LO QUE HACE CALOR CONSUME MUCHÍSIMO" bg={AMB} size={40} /></AbsoluteFill>; }}</Stage>;
const PavaLuz: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const k = W(tt, 1.2, 2.6); const a = -8 * k; return <AbsoluteFill><Svg><Defs />
  <path d="M 960 900 L 900 980 L 1020 980 Z" fill="#9aa3ab" /><line x1={960} y1={900} x2={960} y2={520} stroke="#9aa3ab" strokeWidth={18} />
  <g transform={`rotate(${a} 960 520)`}><line x1={460} y1={520} x2={1460} y2={520} stroke="#c9ccd1" strokeWidth={16} />
    <g transform={`rotate(${-a} 560 520)`}><line x1={560} y1={520} x2={560} y2={600} stroke="#999" strokeWidth={6} /><Kettle x={560} y={680} s={1.1} /></g>
    <g transform={`rotate(${-a} 1360 520)`}><line x1={1360} y1={520} x2={1360} y2={600} stroke="#999" strokeWidth={6} />{Array.from({ length: 8 }, (_, i) => <Bulb key={i} x={1250 + (i % 4) * 75} y={690 + Math.floor(i / 4) * 90} s={0.22} g={1} />)}</g></g>
  </Svg><Lbl tt={tt} at={0.5} x={560} y={300} tx="UNA PAVA" bg={RED} col={INK} /><Lbl tt={tt} at={0.9} x={1360} y={300} tx="TODAS LAS LUCES" bg={INK} /><Lbl tt={tt} at={2.6} x={960} y={160} tx="LA PAVA PESA MÁS" bg={AMB} hand /></AbsoluteFill>; }}</Stage>;
const Espiral: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const st = ["SE CALIENTA", "SE AFLOJA", "CALIENTA MÁS", "SE PONE MARRÓN"]; const rot = W(tt, 0.4, 4) * 360; return <AbsoluteFill><Svg><Defs />
  <circle cx={960} cy={540} r={300} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={30} />
  <path d={`M 960 240 A 300 300 0 ${rot > 180 ? 1 : 0} 1 ${960 + 300 * Math.sin(rot * Math.PI / 180)} ${540 - 300 * Math.cos(rot * Math.PI / 180)}`} stroke="url(#hot)" strokeWidth={30} fill="none" strokeLinecap="round" />
  <Plug x={960} y={520} s={1.2} col={`rgb(${48 + 80 * W(tt, 1, 4)},${54 - 10 * W(tt, 1, 4)},${60 - 40 * W(tt, 1, 4)})`} />
  </Svg>{st.map((n, i) => { const a = i * Math.PI / 2; return <Lbl key={i} tt={tt} at={0.5 + i * 0.8} x={960 + Math.sin(a) * 470} y={540 - Math.cos(a) * 380} tx={n} bg={i === 3 ? RED : AMB} col={i === 3 ? INK : NAVY} size={42} />; })}
  <Lbl tt={tt} at={3.6} x={960} y={985} tx="Y NO SALTA NINGUNA TÉRMICA" bg={INK} size={40} /></AbsoluteFill>; }}</Stage>;
const Ropero: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const k = W(tt, 0.8, 2.4); return <AbsoluteFill><Svg><Defs /><Wall />
  <Socket x={980} y={700} s={0.55} />
  <g transform={`translate(${lp(0, 300, k)},0)`}><rect x={560} y={220} width={560} height={720} rx={10} fill="#8a5a34" stroke="#4a2c14" strokeWidth={8} /><line x1={840} y1={240} x2={840} y2={920} stroke="#4a2c14" strokeWidth={6} /><circle cx={810} cy={580} r={14} fill="#e2c27a" /><circle cx={870} cy={580} r={14} fill="#e2c27a" /></g>
  <Arrow x1={1180} y1={1000} x2={1480} y2={1000} k={k} col={AMB} />
  </Svg><Big tt={tt} at={2.2} x={1500} y={330} tx="20 cm" size={150} /><Lbl tt={tt} at={2.8} x={1500} y={480} tx="TODO EL ARREGLO" bg={GRN} /><Lbl tt={tt} at={3.4} x={560} y={170} tx="ZAPATILLA MARRÓN: A LA BASURA" bg={RED} col={INK} size={40} /></AbsoluteFill>; }}</Stage>;
const Hilitos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const k = W(tt, 0.6, 3); const n = 19, sanos = [3, 9, 14]; return <AbsoluteFill><Svg><Defs />
  <circle cx={760} cy={540} r={300} fill="#d9d9d4" stroke="#888" strokeWidth={8} />
  {Array.from({ length: n }, (_, i) => { const a = i * 2.4, r = 40 + Math.sqrt(i) * 50; const ok = sanos.includes(i) || i / n > k; return <circle key={i} cx={760 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={34} fill={ok ? (k > 0.95 && sanos.includes(i) ? "url(#hot)" : "url(#cu)") : "#4a3a30"} opacity={ok ? 1 : 0.6} />; })}
  {[0, 1, 2].map((i) => { const p = (tt * 0.7 + i / 3) % 1; return <g key={i} transform={`translate(1450,${lp(150, 420, p)})`} opacity={1 - p}><path d="M -60 0 Q -60 -60 0 -70 Q 60 -60 60 0 Z" fill={INK} /><rect x={-60} y={0} width={120} height={30} rx={10} fill="#555" /></g>; })}
  </Svg><Lbl tt={tt} at={0.4} x={1450} y={560} tx="PISADA TRAS PISADA" bg={INK} size={40} /><Big tt={tt} at={3} x={1450} y={760} tx="3 HILITOS" size={120} col={RED} /></AbsoluteFill>; }}</Stage>;
const Alfombra: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const g = W(tt, 1, 3); return <AbsoluteFill><Svg><Defs />
  <rect x={120} y={700} width={1680} height={260} fill="#8a6a4a" /><rect x={120} y={700} width={1680} height={14} fill="#5a4430" />
  <Wire x1={140} x2={1780} y={665} col="#d9d9d4" th={36} hot={g > 0.6 ? 1 : 0} />
  <circle cx={980} cy={665} r={120} fill={RED} opacity={0.45 * g} filter="url(#glow)" />
  <path d="M 200 650 Q 980 560 1720 650 L 1720 690 Q 980 600 200 690 Z" fill="#b8543a" /><rect x={200} y={600} width={1520} height={48} rx={18} fill="#c86a4a" opacity={0.95} />
  {[0, 1, 2].map((i) => <path key={i} d={`M ${930 + i * 50} 560 q 18 -50 0 -100 q -18 -50 0 -100`} stroke="#999" strokeWidth={6} fill="none" opacity={0.5 * g} strokeDasharray="10 10" />)}
  </Svg><Lbl tt={tt} at={0.8} x={500} y={300} tx="NO LO VES" bg={INK} /><Lbl tt={tt} at={1.4} x={960} y={240} tx="NO SE VENTILA" bg={INK} /><Lbl tt={tt} at={2} x={1420} y={300} tx="ARRIBA, ALGO QUE PRENDE" bg={RED} col={INK} size={40} /></AbsoluteFill>; }}</Stage>;
const Bisagra: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const c = 0.5 + 0.5 * Math.sin(tt * 2.2); const ch = W(tt, 1, 3); return <AbsoluteFill><Svg><Defs />
  <rect x={600} y={150} width={60} height={780} fill="#6d5a44" /><g transform={`translate(660,150) scale(${lp(0.25, 1, c)},1)`}><rect x={0} y={0} width={700} height={780} fill="#c9a578" stroke="#6d5a44" strokeWidth={8} /><circle cx={620} cy={420} r={22} fill="#e2c27a" /></g>
  <path d={`M 200 900 L 640 900 Q 660 ${900 - 10 * ch} 680 900 L 1700 900`} stroke="#d9d9d4" strokeWidth={lp(30, 30, ch)} fill="none" />
  <ellipse cx={660} cy={900} rx={lp(30, 60, ch)} ry={lp(15, 6, ch)} fill={ch > 0.6 ? "#7a2a14" : "#d9d9d4"} />
  </Svg><Lbl tt={tt} at={0.6} x={1350} y={300} tx="CADA VEZ QUE CERRÁS" bg={INK} /><Lbl tt={tt} at={2.4} x={1350} y={420} tx="LO APRETÁS UN POCO MÁS" bg={RED} col={INK} size={42} /></AbsoluteFill>; }}</Stage>;
const SeCambia: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={500} w={640} h={560} s={P(tt, 0.3)}><Wire x1={-260} x2={260} y={-60} col={BLU} th={48} /><rect x={-80} y={-100} width={160} height={80} rx={6} fill="#222" opacity={0.9} /><T x={0} y={110} tx="CINTA" size={70} col={RED} /><Check x={0} y={200} ok={false} s={P(tt, 1)} /></Card>
  <Card x={1360} y={500} w={640} h={560} s={P(tt, 1.2)}><Wire x1={-260} x2={260} y={-60} col={BLU} th={48} /><T x={0} y={110} tx="CABLE NUEVO" size={64} col={NAVY} /><Check x={0} y={200} ok s={P(tt, 1.8)} /></Card>
  </Svg><Lbl tt={tt} at={2.4} x={960} y={930} tx="CHATO, DURO, UN BULTO O PARTIDO: SE CAMBIA" bg={AMB} size={40} /></AbsoluteFill>}</Stage>;
const Zocalo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => { const k = W(tt, 0.4, 2.2); return <AbsoluteFill><Svg><Defs /><Wall />
  <rect x={180} y={820} width={1560} height={70} fill="#7a5a3a" />
  <path d={`M 260 780 L ${lp(260, 1500, k)} 780`} stroke="#eee" strokeWidth={22} strokeLinecap="round" />
  {[0, 1, 2, 3, 4].map((i) => <g key={i} opacity={cl(P(tt, 0.8 + i * 0.3) * 2)}><path d={`M ${400 + i * 250} 800 L ${400 + i * 250} 770 Q ${400 + i * 250} 755 ${420 + i * 250} 755 L ${440 + i * 250} 755`} stroke="#fafafa" strokeWidth={10} fill="none" /><circle cx={400 + i * 250} cy={803} r={7} fill="#888" /></g>)}
  <path d="M 1500 780 Q 1600 780 1640 920 L 1680 960" stroke="#eee" strokeWidth={22} fill="none" opacity={k} /><path d="M 1550 960 L 1850 960 L 1800 930 L 1600 930 Z" fill="#555" opacity={cl(P(tt, 2.2) * 2)} />
  </Svg><Lbl tt={tt} at={1.2} x={760} y={620} tx="GRAMPITAS DE PLÁSTICO" bg={GRN} /><Lbl tt={tt} at={1.8} x={760} y={500} tx="NUNCA A TRAVÉS DEL CABLE" bg={RED} col={INK} size={40} /><Lbl tt={tt} at={2.6} x={1500} y={300} tx="CUBRECABLE" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Rollo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const k = W(tt, 0.6, 3.4); return <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 6 }, (_, r) => Array.from({ length: r === 0 || r === 5 ? 5 : 7 }, (_, c) => { const n = r === 0 || r === 5 ? 5 : 7; const x = 760 + (c - (n - 1) / 2) * 92, y = 300 + r * 92; const d = Math.hypot(c - (n - 1) / 2, r - 2.5); const hot = cl(k * 1.6 - d * 0.3); return <g key={r + "-" + c}><circle cx={x} cy={y} r={42} fill={`rgb(${120 + 135 * hot},${120 - 40 * hot},${120 - 100 * hot})`} stroke="#333" strokeWidth={4} /><circle cx={x} cy={y} r={14} fill="url(#cu)" /></g>; }))}
  <Wire x1={1240} x2={1780} y={450} col="#d9d9d4" th={40} />
  {[0, 1, 2].map((i) => { const p = (tt * 0.8 + i / 3) % 1; return <path key={i} d={`M ${1340 + i * 150} ${410 - p * 140} q 20 -30 0 -60`} stroke="#9fd0ff" strokeWidth={6} fill="none" opacity={1 - p} />; })}
  </Svg><Lbl tt={tt} at={1} x={1510} y={640} tx="ESTIRADO: EL CALOR SE VA" bg={GRN} size={40} /><Lbl tt={tt} at={2.2} x={760} y={900} tx="ENROLLADO: UN HORNO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Etiqueta: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Reel x={560} y={540} r={300} spin={W(tt, 0.2, 1.4) * 0.3} />
  <g transform={`translate(1300,540) rotate(-3) scale(${P(tt, 0.8)})`}><rect x={-380} y={-260} width={760} height={520} rx={16} fill="#f6f1de" stroke="#b8a878" strokeWidth={6} /><T x={0} y={-170} tx="CUÁNTO AGUANTA" size={52} col={NAVY} />
    <T x={-330} y={-50} tx="ENROLLADO" size={42} col={NAVY} anchor="start" /><Bar x={-330} y={-20} w={660} h={60} k={0.3 * W(tt, 1.4, 2.4)} col={RED} />
    <T x={-330} y={120} tx="DESENROLLADO" size={42} col={NAVY} anchor="start" /><Bar x={-330} y={150} w={660} h={60} k={W(tt, 2, 3)} col={GRN} /></g>
  </Svg><Lbl tt={tt} at={3.2} x={1300} y={930} tx="LEELA · SI NO TIENE: DESENROLLÁ TODO" bg={AMB} size={40} /></AbsoluteFill>}</Stage>;
const Grueso: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={500} w={700} h={620} s={P(tt, 0.3)} bg="#e6f6ee"><Plug3 x={0} y={60} s={0.62} /><T x={0} y={250} tx="GRUESO · CON TIERRA" size={44} /></Card>
  <Card x={1360} y={500} w={700} h={620} s={P(tt, 1.2)} bg="#fbe9e4"><g transform="translate(0,60) scale(0.62)"><path d="M 0 -330 L 0 -150" stroke="#30363c" strokeWidth={20} /><rect x={-110} y={-160} width={220} height={170} rx={40} fill="#30363c" /><rect x={-80} y={0} width={24} height={130} rx={4} transform="rotate(30 -68 0)" fill="#cfd3d6" /><rect x={56} y={0} width={24} height={130} rx={4} transform="rotate(-30 68 0)" fill="#cfd3d6" /></g><T x={0} y={250} tx="FINITO · 2 PATAS" size={44} /></Card>
  </Svg><Lbl tt={tt} at={2} x={560} y={930} tx="HERRAMIENTAS Y CALOR" bg={GRN} /><Lbl tt={tt} at={2.6} x={1360} y={930} tx="UNA LÁMPARA Y NADA MÁS" bg={RED} col={INK} size={40} /></AbsoluteFill>}</Stage>;
const Baterias: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const it = ["MONOPATÍN", "BICICLETA", "HERRAMIENTA", "BATERÍA PORTÁTIL"]; return <AbsoluteFill><Svg><Defs />
  {it.map((n, i) => { const s = P(tt, 0.3 + i * 0.4); const x = 330 + i * 420; return s <= 0.01 ? null : <g key={i} transform={`translate(${x},500) scale(${s})`}><Batt x={0} y={0} s={0.8 - i * 0.08} /><T x={0} y={260} tx={n} size={40} col={INK} /></g>; })}
  </Svg><Lbl tt={tt} at={2.2} x={960} y={150} tx="EN CASI TODAS LAS CASAS" bg={INK} /><Lbl tt={tt} at={2.8} x={960} y={940} tx="ENCHUFADA A LA NOCHE, AL LADO DE LA CAMA" bg={AMB} size={40} /></AbsoluteFill>; }}</Stage>;
const Pasillo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const f = W(tt, 1.2, 2.6); return <AbsoluteFill><Svg><Defs /><Casa tt={tt} />
  <g transform="translate(700,760)"><Batt x={0} y={0} s={0.35} hot={f > 0.5 ? 1 : 0} />{f > 0.1 && <circle r={160 * f} fill={RED} opacity={0.35} filter="url(#glow)" />}</g>
  <path d="M 610 380 L 610 760 L 1480 830" stroke={GRN} strokeWidth={14} strokeDasharray="26 18" fill="none" opacity={cl(P(tt, 0.6) * 2)} />
  {f > 0.6 && <g><line x1={820} y1={700} x2={940} y2={820} stroke={RED} strokeWidth={22} /><line x1={940} y1={700} x2={820} y2={820} stroke={RED} strokeWidth={22} /></g>}
  </Svg><Lbl tt={tt} at={2.8} x={960} y={1000} tx="EL CAMINO PARA SALIR, CORTADO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Hinchada: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const sw = W(tt, 0.4, 2); const it = ["INFLADA O DEFORMADA", "HUELE RARO", "SE CALIENTA MUCHO"]; return <AbsoluteFill><Svg><Defs />
  <Batt x={560} y={540} s={1.4} sw={sw} />
  {it.map((n, i) => <Pill key={i} tt={tt} at={1 + i * 0.5} x={1340} y={330 + i * 160} w={760} tx={n} ok={false} size={40} />)}
  </Svg><Lbl tt={tt} at={2.8} x={1340} y={860} tx="NO SE CARGA MÁS" bg={RED} col={INK} size={52} /><Lbl tt={tt} at={3.3} x={1340} y={960} tx="A UN LUGAR QUE LAS RECIBA" bg={INK} size={38} /></AbsoluteFill>; }}</Stage>;
const DeDia: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => { const it = ["DE DÍA, DESPIERTO", "CARGADOR ORIGINAL", "PISO QUE NO PRENDE", "LEJOS DE CAMA Y SALIDA", "TERMINA: DESENCHUFO"]; return <AbsoluteFill><Svg><Defs />
  <g transform="translate(420,420)" opacity={cl(P(tt, 0.2) * 2)}><circle r={130} fill={AMB} />{Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5 + tt * 0.3; return <line key={i} x1={Math.cos(a) * 160} y1={Math.sin(a) * 160} x2={Math.cos(a) * 220} y2={Math.sin(a) * 220} stroke={AMB} strokeWidth={14} strokeLinecap="round" />; })}</g>
  <Batt x={420} y={800} s={0.55} />
  {it.map((n, i) => <Pill key={i} tt={tt} at={0.6 + i * 0.45} x={1260} y={210 + i * 160} w={860} tx={n} ok size={40} />)}
  </Svg></AbsoluteFill>; }}</Stage>;
const HumoC: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={0} y={0} width={1920} height={150} fill="#e8e2d2" /><Humo x={960} y={190} s={1.6} t={tt} on={tt > 1.4} />
  </Svg><Lbl tt={tt} at={1} x={960} y={560} tx="DETECTOR DE HUMO EN EL PASILLO" bg={AMB} /><Lbl tt={tt} at={2} x={960} y={700} tx="CUESTA MENOS QUE UNA CENA" bg={INK} /><Lbl tt={tt} at={2.8} x={960} y={840} tx="LO MEJOR QUE PODÉS PONER" bg={GRN} /></AbsoluteFill>}</Stage>;
const Walter: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={480} w={700} h={600} s={P(tt, 0.3)} bg="#fbe9e4"><rect x={-110} y={-170} width={220} height={150} rx={20} fill="#333" /><T x={0} y={-80} tx="$" size={70} col={AMB} /><T x={0} y={60} tx="CARGADOR DE FERIA" size={44} /><T x={0} y={130} tx="TODA LA NOCHE · AL SILLÓN" size={32} /><Check x={0} y={220} ok={false} s={P(tt, 1)} /></Card>
  <Card x={1360} y={480} w={700} h={600} s={P(tt, 1.6)} bg="#e6f6ee"><rect x={-110} y={-170} width={220} height={150} rx={20} fill="#333" /><T x={0} y={-80} tx="OK" size={60} col={GRN} /><T x={0} y={60} tx="EL ORIGINAL" size={44} /><T x={0} y={130} tx="DE DÍA · PATIO TECHADO" size={32} /><Check x={0} y={220} ok s={P(tt, 2.2)} /></Card>
  </Svg><Lbl tt={tt} at={0.8} x={960} y={130} tx="MI CUÑADO WALTER" bg={INK} hand /></AbsoluteFill>}</Stage>;
const Mitad: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 7 }, (_, j) => { const done = j < 4; const s = P(tt, 0.2 + j * 0.15); return <g key={j} transform={`translate(${330 + j * 210},520) scale(${s})`}><circle r={80} fill={done ? GRN : j === 6 ? RED : "rgba(255,255,255,.18)"} stroke={done ? "#0e3a2a" : INK} strokeWidth={5} /><T x={0} y={30} tx={String(j + 1)} size={84} col={done ? NAVY : INK} />{done && <Check x={60} y={-60} ok s={P(tt, 1.2 + j * 0.15)} />}</g>; })}
  </Svg><Lbl tt={tt} at={1.4} x={960} y={250} tx="VAMOS POR LA MITAD" bg={AMB} size={56} /><Lbl tt={tt} at={2.4} x={1300} y={780} tx="LAS 3 MÁS SERIAS" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Patas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <Plug3 x={760} y={560} s={1.2} lab={W(tt, 0.8, 1.6)} />
  <circle cx={760} cy={720} r={80} fill="none" stroke={AMB} strokeWidth={10} opacity={W(tt, 1.8, 2.2)} />
  </Svg><Lbl tt={tt} at={1.2} x={1440} y={420} tx="LAS DE LOS COSTADOS: CORRIENTE" bg={INK} size={40} /><Lbl tt={tt} at={2} x={1440} y={560} tx="LA DEL MEDIO, MÁS LARGA: TIERRA" bg={AMB} size={40} /></AbsoluteFill>}</Stage>;
const Adaptador: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const k = W(tt, 0.8, 2.2); return <AbsoluteFill><Svg><Defs />
  <Plug3 x={540} y={480} s={0.75} />
  <g transform="translate(1080,560)"><rect x={-160} y={-120} width={320} height={240} rx={30} fill="#f2f0ea" stroke="#999" strokeWidth={6} />{[-60, 60].map((x) => <rect key={x} x={x - 10} y={120} width={20} height={110} fill="#cfd3d6" stroke="#777" strokeWidth={3} />)}
    <path d="M 0 -40 C 40 60 120 100 260 60" stroke={AMB} strokeWidth={12} fill="none" strokeDasharray="18 14" opacity={k} /><circle cx={290} cy={50} r={36} fill={RED} opacity={k} /><T x={290} y={64} tx="?" size={44} col={INK} op={k} /></g>
  </Svg><Lbl tt={tt} at={1.6} x={1300} y={240} tx="LA TIERRA NO VA A NINGÚN LADO" bg={RED} col={INK} size={40} /><Lbl tt={tt} at={2.4} x={540} y={940} tx="O LA PATA CORTADA CON LA PINZA" bg={INK} size={38} /></AbsoluteFill>; }}</Stage>;
const LavaC: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const p = (tt * 0.9) % 1; return <AbsoluteFill><Svg><Defs />
  <Lava x={480} y={480} s={0.95} /><path d="M 480 670 L 480 900 L 360 900" stroke="url(#vy)" strokeWidth={20} fill="none" /><path d="M 330 900 l 60 0 M 340 920 l 40 0 M 350 940 l 20 0" stroke={INK} strokeWidth={8} />
  <circle cx={480} cy={lp(560, 900, p)} r={14} fill={AMB} /><Breaker x={760} y={420} s={0.6} on={tt > 2 ? 0 : 1} amp="DIF" />
  <Lava x={1440} y={480} s={0.95} live={1} />{tt > 1.5 && <g><Spark x={1590} y={360} k={0.5 + 0.2 * Math.sin(tt * 16)} /><g transform="translate(1700,700)"><circle cx={0} cy={-170} r={40} fill={INK} /><line x1={0} y1={-130} x2={0} y2={20} stroke={INK} strokeWidth={22} /><line x1={0} y1={-90} x2={-90} y2={-140} stroke={INK} strokeWidth={18} /><line x1={0} y1={20} x2={-40} y2={130} stroke={INK} strokeWidth={18} /><line x1={0} y1={20} x2={40} y2={130} stroke={INK} strokeWidth={18} /></g></g>}
  </Svg><Lbl tt={tt} at={0.6} x={540} y={130} tx="CON TIERRA: EL DISYUNTOR CORTA" bg={GRN} size={38} /><Lbl tt={tt} at={1.4} x={1400} y={130} tx="SIN TIERRA: LA CHAPA ESPERA" bg={RED} col={INK} size={38} /></AbsoluteFill>; }}</Stage>;
const Chapa: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => { const it = ["LAVARROPAS", "HELADERA", "HORNO ELÉCTRICO", "PAVA", "TERMOTANQUE ELÉCTRICO", "MICROONDAS"]; return <AbsoluteFill><Svg><Defs />
  {it.map((n, i) => { const x = 520 + (i % 2) * 880, y = 300 + Math.floor(i / 2) * 230; const s = P(tt, 0.3 + i * 0.3); return s <= 0.01 ? null : <g key={i} transform={`translate(${x},${y}) scale(${s})`}><rect x={-380} y={-80} width={760} height={160} rx={24} fill={INK} /><path d="M -320 -40 L -280 -40 L -300 0 L -270 0 L -310 50 L -300 10 L -330 10 Z" fill={AMB} transform="translate(0,0) scale(1.1)" /><T x={30} y={16} tx={n} size={n.length > 14 ? 34 : 42} /></g>; })}
  </Svg><Lbl tt={tt} at={2.4} x={960} y={130} tx="CHAPA Y AGUA: SIEMPRE CON TIERRA" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Boton: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const pr = W(tt, 1, 1.3), off = tt > 1.6 ? 1 : 0; return <AbsoluteFill><Svg><Defs />
  <g transform="translate(760,540) scale(1.7)"><rect x={-150} y={-170} width={300} height={340} rx={14} fill="#f4f4f2" stroke="#9aa3ab" strokeWidth={4} /><rect x={-60} y={-80} width={120} height={130} rx={10} fill="#2b3640" /><rect x={-48} y={lp(-70, 4, off)} width={96} height={42} rx={8} fill={off ? RED : GRN} />
    <circle cx={95} cy={110} r={lp(26, 20, pr)} fill={AMB} stroke="#a07800" strokeWidth={4} /><T x={95} y={124} tx="T" size={32} col={NAVY} /><T x={-50} y={130} tx="DIF" size={40} col={NAVY} /></g>
  <Clock x={1440} y={420} k={W(tt, 0.4, 2.6)} r={130} tx="1 VEZ POR MES" />
  </Svg><Lbl tt={tt} at={2} x={1440} y={760} tx="TIENE QUE SALTAR" bg={GRN} /><Lbl tt={tt} at={2.8} x={1440} y={880} tx="SI NO SALTA: ELECTRICISTA" bg={RED} col={INK} size={40} /></AbsoluteFill>; }}</Stage>;
const Vertical: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const k = W(tt, 0.6, 2); return <AbsoluteFill><Svg><Defs /><Wall />
  <Socket x={620} y={760} s={0.4} /><Toggle x={1180} y={520} s={0.7} /><Socket x={1500} y={760} s={0.4} />
  {[620, 1180].map((x, i) => <rect key={i} x={x - 60} y={130} width={120} height={820 * k} fill={RED} opacity={0.3} />)}
  <rect x={620} y={730} width={880 * W(tt, 1.6, 2.6)} height={60} fill={RED} opacity={0.3} />
  {[0, 1].map((i) => <path key={i} d={`M ${[620, 1180][i]} ${[690, 420][i]} L ${[620, 1180][i]} 130`} stroke={INK} strokeWidth={10} strokeDasharray="16 12" opacity={k} />)}
  <g transform="translate(900,330)" opacity={W(tt, 2.6, 3)}><circle r={40} fill="none" stroke={GRN} strokeWidth={10} /><line x1={-60} y1={0} x2={60} y2={0} stroke={GRN} strokeWidth={6} /><line x1={0} y1={-60} x2={0} y2={60} stroke={GRN} strokeWidth={6} /></g>
  </Svg><Lbl tt={tt} at={1.2} x={960} y={90} tx="EN LA VERTICAL, NO SE AGUJEREA" bg={RED} col={INK} size={40} /><Lbl tt={tt} at={3} x={900} y={430} tx="ACÁ, MEJOR" bg={GRN} size={36} /></AbsoluteFill>; }}</Stage>;
const NoSubas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={560} y={540} s={1.6} on={0} amp="C16" glow={W(tt, 0.8, 1.2)} />
  <g opacity={W(tt, 1, 1.4)}><line x1={380} y1={300} x2={740} y2={780} stroke={RED} strokeWidth={28} /><line x1={740} y1={300} x2={380} y2={780} stroke={RED} strokeWidth={28} /></g>
  <rect x={1000} y={380} width={760} height={300} fill="#d7ccb6" /><Wire x1={1000} x2={1760} y={530} col={BRN} th={34} /><Spark x={1380} y={530} k={0.6 + 0.2 * Math.sin(tt * 14)} />
  </Svg><Lbl tt={tt} at={1.6} x={1380} y={260} tx="CABLE LASTIMADO EN LA PARED" bg={INK} size={40} /><Lbl tt={tt} at={2.4} x={1380} y={820} tx="SE LLAMA A UN ELECTRICISTA" bg={AMB} /></AbsoluteFill>}</Stage>;
const CortaNeutro: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => { const p = (tt * 0.7) % 1; const k = W(tt, 1.4, 2.2); return <AbsoluteFill><Svg><Defs />
  <path d="M 200 360 L 1500 360 L 1500 480" stroke={BRN} strokeWidth={20} fill="none" /><path d="M 200 760 L 900 760" stroke={BLU} strokeWidth={20} fill="none" /><path d={`M 900 760 L ${lp(1100, 1080, k)} ${lp(760, 680, k)}`} stroke={BLU} strokeWidth={20} /><path d="M 1100 760 L 1500 760 L 1500 640" stroke={BLU} strokeWidth={20} fill="none" />
  <circle cx={900} cy={760} r={18} fill={INK} /><circle cx={1100} cy={760} r={18} fill={INK} />
  <Bulb x={1500} y={600} s={0.6} g={1 - k} />
  {[0, 1, 2].map((i) => { const q = (p + i / 3) % 1; return <circle key={i} cx={lp(200, 1500, q)} cy={360} r={14} fill={AMB} />; })}
  <circle cx={1500} cy={480} r={60} fill={RED} opacity={0.4 * k * (0.7 + 0.3 * Math.sin(tt * 8))} filter="url(#glow)" />
  <T x={160} y={340} tx="FASE" size={40} col={AMB} anchor="start" /><T x={160} y={740} tx="NEUTRO" size={40} col={BLU} anchor="start" />
  </Svg><Lbl tt={tt} at={1.6} x={1000} y={900} tx="LA LLAVE CORTA EL NEUTRO" bg={INK} /><Lbl tt={tt} at={2.4} x={1500} y={220} tx="LA FASE SIGUE LLEGANDO" bg={RED} col={INK} size={40} /></AbsoluteFill>; }}</Stage>;
const Diecinueve: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill style={{ background: "rgba(40,30,10,.35)" }}><Svg><Defs />
  <g transform="translate(960,540) rotate(-2)" opacity={cl(P(tt, 0.2) * 2)}><rect x={-560} y={-360} width={1120} height={720} fill="#efe3c2" stroke="#a89a72" strokeWidth={6} />
    <T x={0} y={-230} tx="19 AÑOS" size={110} col="#6a3a12" hand />
    {["UNA COCINA", "APAGUÉ LA LLAVE", "ARRIBA DE LA MESADA", "EL GOLPE EN TODO EL BRAZO"].map((n, i) => <T key={i} x={-460} y={-90 + i * 105} tx={`· ${n}`} size={52} col={i === 3 ? "#a2241a" : NAVY} anchor="start" hand op={cl(P(tt, 0.8 + i * 0.55) * 2)} />)}</g>
  </Svg><Lbl tt={tt} at={3.2} x={1400} y={960} tx="«¿BAJASTE LA TÉRMICA?»" bg={AMB} hand /></AbsoluteFill>}</Stage>;
const DosPasos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={540} y={500} w={680} h={620} s={P(tt, 0.3)}><Breaker x={0} y={-30} s={0.95} on={1 - W(tt, 0.8, 1.2)} amp="C10" /><T x={0} y={250} tx="1 · BAJO LA TÉRMICA" size={44} /></Card>
  <Card x={1380} y={500} w={680} h={620} s={P(tt, 1.4)}><Tester x={-40} y={170} lit={0} rot={-10} /><T x={0} y={250} tx="2 · PRUEBO: NO HAY TENSIÓN" size={38} /></Card>
  <Arrow x1={900} y1={500} x2={1020} y2={500} k={W(tt, 1.2, 1.6)} />
  </Svg><Lbl tt={tt} at={2.6} x={960} y={930} tx="LAS DOS COSAS. SIEMPRE." bg={AMB} size={54} /></AbsoluteFill>}</Stage>;
const Prueba3: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const st: [string, boolean, number][] = [["BORNE 1", false, 0.4], ["BORNE 2", false, 1.4], ["TOMA CON CORRIENTE", true, 2.4]]; return <AbsoluteFill><Svg><Defs />
  {st.map(([n, lit, a], i) => { const s = P(tt, a); const x = 380 + i * 580; return s <= 0.01 ? null : <g key={i} opacity={cl(s * 2)}>{i < 2 ? <g transform={`translate(${x},420)`}><rect x={-90} y={-60} width={180} height={120} rx={20} fill="#f4f1e6" stroke="#999" strokeWidth={5} /><circle cx={-40} cy={0} r={16} fill="#c9a24a" /><circle cx={40} cy={0} r={16} fill="#c9a24a" /></g> : <Socket x={x} y={420} s={0.55} />}
    <Tester x={x + (i < 2 ? (i === 0 ? -40 : 40) : 0)} y={680} lit={lit && tt > a + 0.5 ? 1 : 0} rot={0} /><T x={x} y={860} tx={n} size={40} col={INK} /><Check x={x} y={950} ok={!lit ? true : true} s={P(tt, a + 0.6)} />
    <T x={x} y={250} tx={lit ? "PRENDE: FUNCIONA" : "NO PRENDE"} size={38} col={lit ? AMB : GRN} op={cl(P(tt, a + 0.5) * 2)} /></g>; })}
  </Svg><Lbl tt={tt} at={3.4} x={960} y={110} tx="AHORA SÍ, TOCO" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const Hector: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <Toggle x={560} y={540} s={1.8} /><Bulb x={560} y={180} s={0.45} g={1} />
  </Svg><Lbl tt={tt} at={0.6} x={1300} y={420} tx="«LA LLAVE DE LUZ ES PARA LA LUZ," bg={INK} hand size={46} /><Lbl tt={tt} at={1.6} x={1300} y={540} tx="NO PARA EL ELECTRICISTA»" bg={AMB} hand size={46} /><Lbl tt={tt} at={2.8} x={1300} y={720} tx="DON HÉCTOR" bg={INK} size={36} /></AbsoluteFill>}</Stage>;
const Nelida: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const it: [string, string][] = [["CABLE APLASTADO", "BAJO LA ALFOMBRA"], ["ALARGUE ENROLLADO", "CON EL LAVARROPAS"], ["HELADERA", "PATA DE TIERRA CORTADA"]]; return <AbsoluteFill><Svg><Defs />
  {it.map(([a, b], i) => <Card key={i} x={960} y={300 + i * 230} w={1200} h={190} s={P(tt, 0.4 + i * 0.7)}><Check x={-520} y={0} ok={false} s={P(tt, 0.9 + i * 0.7)} /><T x={-440} y={-12} tx={a} size={46} anchor="start" /><T x={-440} y={48} tx={b} size={34} col="#5a6470" anchor="start" /></Card>)}
  </Svg><Lbl tt={tt} at={0.2} x={960} y={110} tx="LA CASA DE LA SEÑORA NÉLIDA" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Tostadora: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const off = tt > 1.6; return <AbsoluteFill><Svg><Defs />
  <g transform="translate(560,600)"><rect x={-220} y={-160} width={440} height={300} rx={60} fill="#c9ccd1" stroke="#666" strokeWidth={6} /><rect x={-150} y={-160} width={90} height={20} fill="#333" /><rect x={50} y={-160} width={90} height={20} fill="#333" /><rect x={220} y={-40} width={40} height={90} fill="#444" />{!off && <Spark x={-120} y={60} k={0.5 + 0.2 * Math.sin(tt * 18)} />}</g>
  <Breaker x={1180} y={520} s={1.2} on={off ? 0 : 1} amp="DIF" glow={off ? 1 : 0} />
  <Arrow x1={820} y1={560} x2={1060} y2={540} k={W(tt, 0.6, 1.4)} col={RED} />
  </Svg><Lbl tt={tt} at={0.4} x={560} y={300} tx="LA TOSTADORA TENÍA UNA FUGA" bg={RED} col={INK} size={40} /><Lbl tt={tt} at={2} x={1500} y={820} tx="EL DISYUNTOR LA SALVÓ" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const Recorrido: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => { const it = ["FICHAS: ¿TIBIAS?", "TOMAS: ¿BAILAN?", "MANCHAS NEGRAS", "OLOR RARO", "LUCES QUE BAJAN", "BOTÓN DEL DISYUNTOR"]; return <AbsoluteFill><Svg><Defs />
  <Clock x={420} y={480} k={W(tt, 0.2, 4)} r={200} tx="10 MINUTOS" />
  {it.map((n, i) => <Pill key={i} tt={tt} at={0.5 + i * 0.4} x={1300} y={190 + i * 140} w={820} tx={`${i + 1}. ${n}`} size={40} />)}
  </Svg><Lbl tt={tt} at={3} x={420} y={900} tx="SIN HERRAMIENTAS" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Flojo: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const wob = Math.sin(tt * 9) * 9 * W(tt, 0.6, 1.2); return <AbsoluteFill><Svg><Defs />
  <Socket x={760} y={560} s={1.4} /><g transform={`rotate(${wob} 760 520)`}><Plug x={760} y={430} s={1.3} /></g>
  </Svg><Lbl tt={tt} at={1} x={1450} y={400} tx="SI LA FICHA BAILA" bg={INK} /><Lbl tt={tt} at={1.8} x={1450} y={540} tx="UN TOMA FLOJO CALIENTA" bg={RED} col={INK} size={42} /><Lbl tt={tt} at={2.6} x={1450} y={680} tx="SE CAMBIA, CON LA TÉRMICA BAJADA" bg={AMB} size={36} /></AbsoluteFill>; }}</Stage>;
const Mancha: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const k = W(tt, 0.4, 1.8); return <AbsoluteFill><Svg><Defs />
  <Socket x={760} y={540} s={1.6} /><ellipse cx={680} cy={500} rx={70 * k} ry={110 * k} fill="#2a1a10" opacity={0.75} /><ellipse cx={850} cy={530} rx={40 * k} ry={70 * k} fill="#6a3a1a" opacity={0.7} />
  <circle cx={760} cy={540} r={330} fill="none" stroke={RED} strokeWidth={12} strokeDasharray="30 20" opacity={W(tt, 1.6, 2)} />
  </Svg><Lbl tt={tt} at={1.2} x={1480} y={440} tx="AHÍ HUBO CHISPA O CALOR" bg={RED} col={INK} size={42} /><Lbl tt={tt} at={2} x={1480} y={580} tx="NO SE USA MÁS" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Parpadea: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const dip = tt > 1 && tt < 1.6 ? 0.35 : tt > 2.4 && tt < 2.7 ? 0.5 : 1; return <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * (1 - dip)})` }}><Svg><Defs />
  <Bulb x={560} y={460} s={1.1} g={dip} /><Lava x={1320} y={560} s={0.9} />
  <polyline points={Array.from({ length: 60 }, (_, i) => { const x = 200 + i * 26, ti = i / 60 * 4; const v = ti > 1 && ti < 1.6 ? 0.35 : ti > 2.4 && ti < 2.7 ? 0.5 : 1; return `${x},${960 - v * 120}`; }).join(" ")} stroke={AMB} strokeWidth={8} fill="none" opacity={cl(P(tt, 0.3) * 2)} />
  </Svg><Lbl tt={tt} at={1.2} x={1100} y={200} tx="ARRANCA EL LAVARROPAS Y BAJAN" bg={INK} size={38} /><Lbl tt={tt} at={2.4} x={1100} y={300} tx="EMPALME FLOJO: ELECTRICISTA" bg={AMB} size={38} /></AbsoluteFill>; }}</Stage>;
const Mito = (n: number, mito: string, ver: string, draw: (tt: number) => React.ReactNode, mode: "iris" | "split" | "drop"): C => ({ t, h }) => <Stage t={t} h={h} mode={mode}>{(tt) => <AbsoluteFill><Svg><Defs />{draw(tt)}
  <g transform={`translate(1380,330) rotate(-8) scale(${P(tt, 1.6, 9, 0.4)})`}><rect x={-230} y={-80} width={460} height={160} rx={16} fill="none" stroke={RED} strokeWidth={14} /><T x={0} y={30} tx="FALSO" size={96} col={RED} /></g></Svg>
  <Lbl tt={tt} at={0.3} x={960} y={110} tx={`MITO ${n}: «${mito}»`} bg={INK} size={40} /><Lbl tt={tt} at={2.4} x={1380} y={640} tx={ver} bg={AMB} size={38} /></AbsoluteFill>}</Stage>;
const M1 = Mito(1, "CON GUANTES DE COCINA ESTOY AISLADO", "SE TRABAJA SIN TENSIÓN", (tt) => <g transform="translate(560,560)"><path d="M -140 260 L -150 -40 Q -160 -220 -90 -230 L -80 -80 L -60 -270 Q -20 -290 0 -260 L 10 -90 L 40 -280 Q 80 -290 100 -250 L 90 -70 L 140 -200 Q 180 -200 180 -150 L 150 60 L 140 260 Z" fill="#f2c21b" stroke="#a88208" strokeWidth={6} />{[[-60, 0], [40, 80], [-20, 160]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={10} fill="#a88208" />)}</g>, "iris");
const M2 = Mito(2, "LA TÉRMICA ME PROTEGE A MÍ", "LA TÉRMICA CUIDA AL CABLE · A VOS, EL DISYUNTOR", (tt) => <g><Breaker x={420} y={540} s={1.1} on={1} amp="C16" /><Arrow x1={520} y1={540} x2={760} y2={540} k={W(tt, 0.6, 1.2)} /><Cable x1={780} x2={1020} y={540} mm="2,5" th={44} /></g>, "split");
const M3 = Mito(3, "ES CHIQUITO, NO PASA NADA", "220 V IGUAL QUE EL HORNO", (tt) => <g><rect x={300} y={430} width={180} height={220} rx={20} fill="#eee" stroke="#999" strokeWidth={5} /><Wire x1={480} x2={1000} y={600} col="#eee" th={20} bare={50} /><Spark x={1040} y={600} k={0.5 + 0.2 * Math.sin(tt * 16)} /><T x={640} y={500} tx="220 V" size={80} col={AMB} /></g>, "drop");
const Agua: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const p = (tt * 1.4) % 1; return <AbsoluteFill><Svg><Defs />
  <Strip x={1300} y={720} s={0.8} /><path d="M 1150 690 q 30 -80 0 -150 q 60 50 50 150 Z M 1300 690 q 40 -100 0 -180 q 70 70 60 180 Z" fill="#ff7a1a" opacity={0.85} />
  <g transform="translate(300,360)"><rect x={-40} y={-30} width={160} height={60} rx={12} fill="#2f7d3a" /><path d="M 120 0 Q 500 -40 900 330" stroke="#6bb6e8" strokeWidth={26} fill="none" strokeDasharray="30 18" strokeDashoffset={-p * 96} /></g>
  {[0, 1].map((i) => { const q = (p + i / 2) % 1; return <circle key={i} cx={lp(1200, 420, q)} cy={lp(690, 360, q) - Math.sin(q * Math.PI) * 120} r={18} fill={AMB} />; })}
  <g opacity={W(tt, 1.4, 1.8)}><line x1={150} y1={200} x2={1700} y2={900} stroke={RED} strokeWidth={30} /></g>
  </Svg><Lbl tt={tt} at={0.4} x={960} y={110} tx="AGUA, NUNCA" bg={RED} col={INK} size={60} /><Lbl tt={tt} at={1.8} x={560} y={900} tx="LA CORRIENTE VIENE POR EL CHORRO" bg={INK} size={38} /></AbsoluteFill>; }}</Stage>;
const Abc: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const st = ["BAJO LA GENERAL", "MATAFUEGO ABC", "NO SE APAGA: AFUERA Y BOMBEROS"]; return <AbsoluteFill><Svg><Defs />
  <Mata x={420} y={560} s={1.3} />
  {st.map((n, i) => <g key={i}><Card x={1240} y={280 + i * 240} w={900} h={180} s={P(tt, 0.5 + i * 0.8)} bg={i === 2 ? "#fbe9e4" : INK}><circle cx={-380} cy={0} r={46} fill={AMB} /><T x={-380} y={18} tx={String(i + 1)} size={52} /><T x={-300} y={16} tx={n} size={n.length > 20 ? 36 : 46} anchor="start" /></Card></g>)}
  </Svg><Lbl tt={tt} at={3.2} x={960} y={960} tx="LAS COSAS SE COMPRAN DE NUEVO" bg={AMB} size={36} /></AbsoluteFill>; }}</Stage>;
const TermGrande: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const k = W(tt, 0.8, 1.6); return <AbsoluteFill><Svg><Defs />
  <Breaker x={500} y={500} s={1.3} on={1} amp="C16" /><Arrow x1={680} y1={500} x2={900} y2={500} k={k} col={RED} /><Breaker x={1080} y={500} s={1.3} on={1} amp="C25" glow={k} />
  <g opacity={W(tt, 1.6, 2)}><line x1={920} y1={260} x2={1240} y2={740} stroke={RED} strokeWidth={26} /><line x1={1240} y1={260} x2={920} y2={740} stroke={RED} strokeWidth={26} /></g>
  <Card x={1580} y={500} w={460} h={420} s={P(tt, 2.2)} bg="#e6f6ee"><T x={0} y={-90} tx="UNA COSA" size={46} /><T x={0} y={-30} tx="A LA VEZ" size={46} /><T x={0} y={60} tx="O CIRCUITO NUEVO" size={34} /><T x={0} y={110} tx="CON MATRICULADO" size={34} /></Card>
  </Svg><Lbl tt={tt} at={1.8} x={800} y={880} tx="LA TÉRMICA CUIDA AL CABLE" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Multi: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={520} w={680} h={640} s={P(tt, 0.3)}><Tester x={-30} y={190} lit={1} rot={-10} /><T x={60} y={-180} tx="BUSCAPOLO" size={48} /><T x={60} y={-120} tx="PRIMER AVISO" size={34} col="#5a6470" /></Card>
  <Card x={1360} y={520} w={680} h={640} s={P(tt, 1.2)}><Meter x={0} y={40} val="220" s={0.95} /><T x={0} y={-250} tx="MULTÍMETRO" size={48} /></Card>
  </Svg><Lbl tt={tt} at={2.2} x={1360} y={920} tx="MUCHO MÁS CONFIABLE" bg={GRN} /><Lbl tt={tt} at={2.8} x={560} y={920} tx="PROBALO ANTES EN ALGO VIVO" bg={AMB} size={38} /></AbsoluteFill>}</Stage>;
const Recap: C = ({ t, h }) => { const it = ["NADA DE ZAPATILLA EN ZAPATILLA", "NINGÚN CABLE BAJO LA ALFOMBRA", "EL ALARGUE, DESENROLLADO ENTERO", "BATERÍAS DE DÍA + DETECTOR", "LA TIERRA NO SE CORTA", "DETECTOR ANTES DE AGUJEREAR", "TÉRMICA ABAJO + BUSCAPOLO"]; return <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {it.map((n, i) => { const s = P(tt, 0.4 + i * 1.6); return <g key={i}><Card x={960} y={150 + i * 125} w={1400} h={104} s={s} bg={i === 6 ? AMB : INK}><circle cx={-640} cy={0} r={38} fill={i === 6 ? RED : AMB} /><T x={-640} y={16} tx={String(i + 1)} size={46} col={i === 6 ? INK : NAVY} /><T x={-570} y={15} tx={n} size={44} anchor="start" /></Card><Check x={1610} y={150 + i * 125} ok s={P(tt, 1 + i * 1.6)} /></g>; })}
  </Svg></AbsoluteFill>}</Stage>; };
const Hector3: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const it: [string, React.ReactNode][] = [["LA TÉRMICA NUNCA SE SUBE", <Breaker key="b" x={0} y={-40} s={0.7} on={1} amp="C16" />], ["EL DISYUNTOR NUNCA SE PUENTEA", <Breaker key="d" x={0} y={-40} s={0.7} on={1} amp="DIF" />], ["NUNCA CON TENSIÓN", <Tester key="t" x={-10} y={60} lit={0} rot={0} />]]; return <AbsoluteFill><Svg><Defs />
  {it.map(([n, d], i) => <Card key={i} x={400 + i * 560} y={520} w={500} h={600} s={P(tt, 0.4 + i * 0.6)}>{d}<T x={0} y={210} tx={n.split(" ").slice(0, 2).join(" ")} size={40} /><T x={0} y={260} tx={n.split(" ").slice(2).join(" ")} size={40} /></Card>)}
  </Svg><Lbl tt={tt} at={0.2} x={960} y={110} tx="LAS 3 DE DON HÉCTOR, PARA SIEMPRE" bg={AMB} /></AbsoluteFill>; }}</Stage>;

export const MAP: Record<string, C> = { cadena: Cadena, siete: Siete, reglas: Reglas, matric: Matric, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7,
  primer: Primer, calor: Calor, pavaluz: PavaLuz, espiral: Espiral, ropero: Ropero, hilitos: Hilitos, alfombra: Alfombra, bisagra: Bisagra, secambia: SeCambia, zocalo: Zocalo,
  rollo: Rollo, etiqueta: Etiqueta, grueso: Grueso, baterias: Baterias, pasillo: Pasillo, hinchada: Hinchada, dedia: DeDia, humo: HumoC, walter: Walter, mitad: Mitad,
  patas: Patas, adaptador: Adaptador, lavarropas: LavaC, chapa: Chapa, boton: Boton, vertical: Vertical, nosubas: NoSubas, cortaneutro: CortaNeutro, diecinueve: Diecinueve,
  dospasos: DosPasos, prueba3: Prueba3, hector: Hector, nelida: Nelida, tostadora: Tostadora, recorrido: Recorrido, flojo: Flojo, mancha: Mancha, parpadea: Parpadea,
  m1: M1, m2: M2, m3: M3, agua: Agua, abc: Abc, termgrande: TermGrande, multi: Multi, recap: Recap, hector3: Hector3 };
