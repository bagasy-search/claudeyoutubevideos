// heroes.tsx · kit PinTermicas (sesD, pin5nc «el secreto de las térmicas»): 45 componentes PROPIOS dibujados (térmica, bimetal, bobina,
// tablero, cable por sección, disyuntor, pinza, multímetro). Escenario = Stage de ckit. VOSEO. Seguridad del guion.
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

// ───────── componentes (uno por idea, en orden del guion) ─────────
const T32: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={960} y={540} s={1.7 * P(tt, 0.2)} on={1} amp="C32" glow={0.5 + 0.5 * Math.sin(tt * 5)} /></Svg>
  <Big tt={tt} at={0.8} x={500} y={540} tx="32 A" /><Lbl tt={tt} at={2} x={1450} y={400} tx="EN LA COCINA" bg={INK} /><Lbl tt={tt} at={3} x={1450} y={560} tx="«PARA QUE NO SALTE»" bg={RED} col={INK} hand /></AbsoluteFill>}</Stage>;
const Fino: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const b = W(tt, 1, 2.6); return <AbsoluteFill><Svg><Defs />
  <g transform="translate(560,540)"><CableCut r={34} col={b > 0.5 ? BRN : "#d9d9d4"} /></g><g transform="translate(1000,540)"><CableCut r={52} col="#d9d9d4" /></g><g transform="translate(1440,540)"><CableCut r={70} col="#d9d9d4" /></g>
  <T x={560} y={720} tx="1,5" size={60} col={AMB} /><T x={1000} y={720} tx="2,5" size={60} col={INK} op={0.6} /><T x={1440} y={720} tx="4" size={60} col={INK} op={0.6} />
  {b > 0.6 && <path d="M 520 470 l 30 40 l -20 30 l 40 30" stroke="#1b1206" strokeWidth={6} fill="none" />}</Svg>
  <Lbl tt={tt} at={0.6} x={560} y={330} tx="EL MÁS FINITO" bg={AMB} /><Lbl tt={tt} at={2.8} x={960} y={900} tx="DURO, MARRÓN, SE QUIEBRA" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Cuida: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={400} y={540} s={1} on={1} amp="C10" /><Cable x1={480} x2={1500} y={540} mm="1,5" />
  <circle cx={990} cy={540} r={150} fill="none" stroke={GRN} strokeWidth={12} opacity={W(tt, 1.2, 1.8)} />
  {["HELADERA", "LAVARROPAS", "HORNO"].map((n, i) => <g key={i} opacity={W(tt, 2.2 + i * 0.3, 2.5 + i * 0.3)}><rect x={1480} y={252 + i * 110} width={330} height={76} rx={14} fill={INK} /><T x={1645} y={306 + i * 110} tx={n} size={40} /><line x1={1500} y1={330 + i * 110} x2={1790} y2={330 + i * 110} stroke={RED} strokeWidth={8} /></g>)}
</Svg><Lbl tt={tt} at={1.4} x={990} y={780} tx="CUIDA EL CABLE" bg={GRN} /><Lbl tt={tt} at={3.4} x={960} y={140} tx="NO TE CUIDA A VOS" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Treinta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs /><Clamp x={1300} y={520} s={P(tt, 0.8)} val="16.0" /></Svg>
  <Big tt={tt} at={0.3} x={640} y={500} tx="30" size={300} /><Lbl tt={tt} at={1.6} x={640} y={700} tx="AÑOS CON LA PINZA" bg={INK} /><Lbl tt={tt} at={2.6} x={960} y={950} tx="COMO ME LO EXPLICÓ DON HÉCTOR" bg={AMB} /></AbsoluteFill>}</Stage>;
const Mira: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Panel x={620} y={520} amps={["C10", "C16", "C20"]} s={0.7} />
  {["MIRAR", "LEER", "ETIQUETAR", "MEDIR POR FUERA"].map((n, i) => <Pill key={i} tt={tt} at={0.6 + i * 0.45} x={1400} y={260 + i * 130} w={560} tx={n} ok />)}
  <Pill tt={tt} at={2.8} x={1400} y={820} w={560} tx="ADENTRO: MATRICULADO" ok={false} bg={AMB} size={34} /></Svg></AbsoluteFill>}</Stage>;
const TermoMag: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={520} w={640} h={520} s={P(tt, 0.3)}><Bimetal x={20} y={20} k={W(tt, 1, 2.4)} s={1.1} /><T x={0} y={220} tx="TERMO = CALOR" size={46} col={RED} /></Card>
  <Card x={1360} y={520} w={640} h={520} s={P(tt, 1.2)}><Coil x={0} y={0} pull={W(tt, 2.4, 2.6)} s={1.1} /><T x={0} y={220} tx="MAGNÉTICO = IMÁN" size={46} col={BLU} /></Card>
</Svg><Lbl tt={tt} at={3.2} x={960} y={130} tx="DOS PROTECCIONES EN UNA CAJITA" bg={INK} /></AbsoluteFill>}</Stage>;
const BimetalC: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const k = W(tt, 0.6, 3.6); return <AbsoluteFill><Svg><Defs />
  <Bimetal x={960} y={560} k={k} s={2} /><rect x={1340} y={360 - 0} width={40} height={120} fill={k > 0.9 ? RED : "#666"} />
  <g transform="translate(360,700)"><rect x={-24} y={-200} width={48} height={260} rx={24} fill="#fff" stroke="#333" strokeWidth={5} /><rect x={-12} y={40 - 220 * k} width={24} height={220 * k} fill={RED} /><circle cy={70} r={40} fill={RED} /></g></Svg>
  <Lbl tt={tt} at={1} x={960} y={200} tx="DOS METALES QUE SE ESTIRAN DISTINTO" bg={INK} /><Lbl tt={tt} at={3.4} x={960} y={900} tx="LENTA A PROPÓSITO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Bobina: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const p = tt > 2 ? 1 : 0; return <AbsoluteFill><Svg><Defs />
  <Coil x={960} y={520} pull={p} s={1.8} /><Spark x={1500} y={300} k={p * P(tt, 2)} /></Svg>
  <Lbl tt={tt} at={0.8} x={960} y={150} tx="CORRIENTE NORMAL: NADA" bg={INK} /><Lbl tt={tt} at={2.2} x={960} y={900} tx="CORTO: SALTA EN MILÉSIMAS" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const DosFormas: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={500} w={680} h={560} s={P(tt, 0.3)}><Clock x={0} y={-40} k={W(tt, 0.6, 3.6)} r={150} col={AMB} /><T x={0} y={200} tx="LENTA · SOBRECARGA" size={46} /></Card>
  <Card x={1360} y={500} w={680} h={560} s={P(tt, 1.2)} bg="#ffe1dc"><Spark x={0} y={-40} k={P(tt, 1.6)} /><T x={0} y={200} tx="AL TOQUE · CORTO" size={46} col={RED} /></Card>
</Svg><Lbl tt={tt} at={3.4} x={960} y={930} tx="CÓMO SALTA TE DICE CUÁL FUE" bg={INK} /></AbsoluteFill>}</Stage>;
const Frente: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  {["C10", "C16", "C20"].map((a, i) => <Breaker key={i} x={560 + i * 400} y={520} s={1.3 * P(tt, 0.3 + i * 0.5)} on={1} amp={a} />)}
  <circle cx={1360} cy={680} r={0} /></Svg>
  <Lbl tt={tt} at={2} x={560} y={180} tx="C = LA CURVA" bg={INK} /><Lbl tt={tt} at={2.6} x={1360} y={180} tx="EL NÚMERO = AMPERES" bg={AMB} /><Lbl tt={tt} at={3.4} x={960} y={950} tx="LO ELIGE EL CABLE" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Tabla: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["1,5", "C10", "LUCES", 30], ["2,5", "C16", "TOMAS", 42], ["4", "C20-25*", "HORNO · TERMO", 54]].map(([mm, a, u, th], i) => { const s = P(tt, 0.4 + i * 0.9); return s > 0.01 && <g key={i} opacity={cl(s * 2)} transform={`translate(${lp(-300, 0, s)},0)`}>
    <Cable x1={260} x2={900} y={300 + i * 230} mm={mm as string} th={th as number} /><Arrow x1={930} y1={300 + i * 230} x2={1080} y2={300 + i * 230} k={1} col={AMB} w={8} />
    <Card x={1260} y={300 + i * 230} w={300} h={110} s={1} bg={AMB}><T x={0} y={16} tx={a as string} size={46} /></Card><T x={1440} y={312 + i * 230} tx={u as string} size={34} anchor="start" col={INK} /></g>; })}
</Svg><Lbl tt={tt} at={3.6} x={960} y={1000} tx="*LO CONFIRMA EL MATRICULADO" bg={INK} size={36} /></AbsoluteFill>}</Stage>;
const Pregunta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`translate(700,540) rotate(-3)`} opacity={cl(P(tt, 0.3) * 2)}><rect x={-340} y={-330} width={680} height={660} fill="#fbf6e2" stroke="#b9b2a0" strokeWidth={5} />
    <T x={0} y={-240} tx="MI TABLERO" size={52} hand />{["COCINA · 16", "LUCES · 10", "TERMOTANQUE · 20"].map((n, i) => <T key={i} x={-280} y={-120 + i * 110} tx={n} size={48} hand anchor="start" op={W(tt, 0.8 + i * 0.4, 1.1 + i * 0.4)} />)}</g>
  <Card x={1400} y={540} w={620} h={260} s={P(tt, 2.4)} bg={AMB}><T x={0} y={-20} tx="¿ESTOS NÚMEROS VAN" size={44} /><T x={0} y={50} tx="CON ESTOS CABLES?" size={44} /></Card>
</Svg><Lbl tt={tt} at={3.4} x={1400} y={830} tx="PARA EL MATRICULADO" bg={INK} /></AbsoluteFill>}</Stage>;
const Fusible: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const hot = W(tt, 1.6, 3); return <AbsoluteFill><Svg><Defs />
  <Breaker x={360} y={540} s={1} on={1} amp="C32" /><Cable x1={440} x2={1600} y={540} mm="1,5" th={44} hot={hot} />
  {hot > 0.5 && [0, 1, 2].map((i) => <path key={i} d={`M ${800 + i * 220} 480 q 20 -50 0 -100 q -20 -50 0 -100`} stroke="rgba(200,200,200,.6)" strokeWidth={10} fill="none" opacity={0.5 + 0.5 * Math.sin(tt * 3 + i)} />)}</Svg>
  <Lbl tt={tt} at={0.8} x={360} y={300} tx="NO SALTA" bg={INK} /><Lbl tt={tt} at={2.6} x={1020} y={760} tx="EL PUNTO DÉBIL ES EL CABLE" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Ezequiel: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const sw = W(tt, 1, 2.2); return <AbsoluteFill><Svg><Defs />
  <g opacity={1 - sw}><Cable x1={300} x2={1100} y={380} mm="1,5" brown={1} th={34} /></g><g opacity={sw}><Cable x1={300} x2={1100} y={380} mm="4" th={56} /></g>
  <Panel x={1440} y={520} amps={["C20", "C16"]} s={0.7} labels={["HORNO", "COCINA"]} /></Svg>
  <Lbl tt={tt} at={0.6} x={700} y={240} tx="GENERAL ABAJO + BUSCAPOLO" bg={AMB} /><Lbl tt={tt} at={2.4} x={700} y={560} tx="CABLE NUEVO + CIRCUITO APARTE" bg={GRN} /><Lbl tt={tt} at={3.4} x={960} y={960} tx="LO HIZO EL MATRICULADO" bg={INK} /></AbsoluteFill>; }}</Stage>;
const CurvaC: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const k = W(tt, 0.4, 2.4); return <AbsoluteFill><Svg><Defs />
  <line x1={300} y1={860} x2={1640} y2={860} stroke={INK} strokeWidth={5} /><line x1={300} y1={860} x2={300} y2={200} stroke={INK} strokeWidth={5} />
  <path d={`M 300 820 L ${300 + 300 * k} 820 L ${300 + 320 * k} ${820 - 520 * k} L ${300 + 380 * k} 820 L ${300 + 1300 * k} 820`} stroke={AMB} strokeWidth={10} fill="none" />
  <line x1={300} y1={420} x2={1640} y2={420} stroke={RED} strokeWidth={6} strokeDasharray="20 14" opacity={W(tt, 1.6, 2)} />
  <Kettle x={1450} y={680} s={0.9 * P(tt, 2.6)} /></Svg>
  <Lbl tt={tt} at={1.4} x={760} y={260} tx="EL TIRÓN DEL ARRANQUE" bg={INK} /><Lbl tt={tt} at={2.4} x={1460} y={380} tx="CURVA C: LO DEJA PASAR" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const BCD: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["B", "MÁS RÁPIDA", BLU], ["C", "LA DE LAS CASAS", GRN], ["D", "MOTORES", RED]].map(([l, n, c], i) => <Card key={i} x={460 + i * 500} y={500} w={420} h={480} s={P(tt, 0.3 + i * 0.7)} bg={i === 1 ? AMB : INK}>
    <T x={0} y={-30} tx={l as string} size={220} col={c as string} /><T x={0} y={170} tx={n as string} size={38} /></Card>)}
</Svg><Lbl tt={tt} at={3} x={960} y={930} tx="¿B O D EN TU TABLERO? PREGUNTÁ" bg={INK} /></AbsoluteFill>}</Stage>;
const Habla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={760} y={560} s={1.5} on={1 - W(tt, 0.6, 0.9)} amp="C16" />
  <g transform="translate(1260,360)" opacity={W(tt, 1.2, 1.6)}><path d="M -220 -110 h 440 a 30 30 0 0 1 30 30 v 160 a 30 30 0 0 1 -30 30 h -300 l -80 70 l 10 -70 h -70 a 30 30 0 0 1 -30 -30 v -160 a 30 30 0 0 1 30 -30 z" fill={INK} stroke="#1b1206" strokeWidth={6} /><T x={0} y={20} tx="¡ESTOY TRABAJANDO!" size={48} hand /></g></Svg>
  <Lbl tt={tt} at={2.4} x={760} y={930} tx="NO ESTÁ ROTA" bg={GRN} /><Lbl tt={tt} at={3.2} x={1340} y={720} tx="NO LA CALLES" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Sobrecarga: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const k = W(tt, 0.4, 3); return <AbsoluteFill><Svg><Defs />
  {["ESTUFA", "CALOVENTOR", "PAVA"].map((n, i) => <Card key={i} x={400} y={300 + i * 200} w={420} h={140} s={P(tt, 0.3 + i * 0.6)} bg={AMB}><T x={0} y={16} tx={n} size={46} /></Card>)}
  {[0, 1, 2].map((i) => <Arrow key={i} x1={620} y1={300 + i * 200} x2={980} y2={520} k={W(tt, 0.6 + i * 0.6, 1 + i * 0.6)} col={AMB} w={8} />)}
  <Breaker x={1180} y={520} s={1.3} on={tt > 3.4 ? 0 : 1} amp="C16" /><Clock x={1560} y={360} k={k} r={100} col={RED} tx="MINUTOS" /></Svg>
  <Lbl tt={tt} at={3.6} x={960} y={970} tx="NO OTRA TÉRMICA: REPARTIR" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Suma: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const a = tt < 1.4 ? 0 : tt < 2.6 ? 9 : 16; return <AbsoluteFill><Svg><Defs />
  <Clamp x={560} y={540} s={1.3} val={a.toFixed(1)} />
  <Bar x={980} y={300} w={760} k={a / 16} col={a >= 16 ? RED : AMB} tx={`${a} A de 16`} />
  <g opacity={W(tt, 1.4, 1.7)}><Kettle x={1100} y={600} s={0.9} /><T x={1100} y={760} tx="PAVA 9 A" size={40} col={INK} /></g>
  <g opacity={W(tt, 2.6, 2.9)}><rect x={1400} y={520} width={180} height={160} rx={20} fill="#ddd" stroke="#555" strokeWidth={5} />{[0, 1, 2].map((i) => <line key={i} x1={1420} y1={560 + i * 40} x2={1560} y2={560 + i * 40} stroke={RED} strokeWidth={8} />)}<T x={1490} y={760} tx="CALOVENTOR 7 A" size={40} col={INK} /></g></Svg>
  <Lbl tt={tt} at={3.4} x={1360} y={920} tx="AHÍ ESTÁ TU RESPUESTA" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const Corto: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <Wire x1={260} x2={980} y={460} col="#7b4a2a" th={40} bare={60} /><Wire x1={1660} x2={940} y={520} col="#2a6fdb" th={40} bare={60} dir={-1} />
  <Spark x={970} y={490} k={P(tt, 1.2) * (0.8 + 0.2 * Math.sin(tt * 20))} /><Breaker x={1500} y={800} s={0.8} on={tt > 1.3 ? 0 : 1} amp="C16" /></Svg>
  <Lbl tt={tt} at={0.6} x={500} y={330} tx="FASE" bg="#c08a5a" /><Lbl tt={tt} at={0.8} x={1400} y={380} tx="NEUTRO" bg={BLU} /><Lbl tt={tt} at={2.4} x={760} y={800} tx="SALTA AL INSTANTE" bg={RED} col={INK} /><Lbl tt={tt} at={3.4} x={760} y={930} tx="NO SE INSISTE" bg={INK} /></AbsoluteFill>}</Stage>;
const DeAUno: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => { const n = Math.min(4, Math.floor(W(tt, 0.6, 3.4) * 5)); return <AbsoluteFill><Svg><Defs />
  {["TELE", "HELADERA", "LAVARROPAS", "TOSTADORA"].map((a, i) => <g key={i}><Socket x={330 + i * 420} y={460} s={0.7} /><Card x={330 + i * 420} y={760} w={340} h={100} s={i < n ? 1 : 0.02} bg={i === 3 && n > 3 ? RED : INK}><T x={0} y={14} tx={a} size={38} col={i === 3 && n > 3 ? INK : NAVY} /></Card></g>)}
  {n > 3 && <Spark x={1590} y={420} k={1} />}</Svg>
  <Lbl tt={tt} at={0.4} x={960} y={150} tx="TODO DESENCHUFADO · TÉRMICA ARRIBA" bg={INK} /><Lbl tt={tt} at={3.6} x={1500} y={930} tx="ESE ES" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Lluvia: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const w = W(tt, 1, 2.8); return <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 30 }, (_, i) => <line key={i} x1={(i * 67) % 1920} y1={((tt * 600 + i * 113) % 1100) - 60} x2={(i * 67) % 1920 - 14} y2={((tt * 600 + i * 113) % 1100)} stroke={BLU} strokeWidth={4} opacity={0.6} />)}
  <Box x={960} y={560} w={600} h={460} lid={1}><rect x={-274} y={204 - 408 * w * 0.5} width={548} height={408 * w * 0.5} fill="rgba(90,169,230,.7)" /><Wire x1={-200} x2={10} y={40} col="#7b4a2a" th={26} bare={30} /><Wire x1={200} x2={-10} y={60} col="#2a6fdb" th={26} bare={30} dir={-1} /></Box></Svg>
  <Lbl tt={tt} at={0.6} x={960} y={200} tx="SALTA SÓLO CUANDO LLUEVE" bg={INK} /><Lbl tt={tt} at={3} x={960} y={920} tx="CAJA DE AFUERA CON AGUA" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Disyuntor: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={520} y={500} s={1.2} on={1} amp="C16" />
  <g transform={`translate(1300,500) scale(${1.2 * P(tt, 0.8)})`}><rect x={-150} y={-170} width={300} height={340} rx={14} fill="#f4f4f2" stroke="#9aa3ab" strokeWidth={4} /><rect x={-40} y={-80} width={80} height={130} rx={10} fill="#2b3640" /><rect x={-30} y={-70} width={60} height={46} rx={8} fill={GRN} /><circle cx={100} cy={-110} r={28} fill="#f2c21b" stroke="#555" strokeWidth={4} /><T x={100} y={-98} tx="T" size={32} /><T x={0} y={120} tx="30 mA" size={44} /></g></Svg>
  <Lbl tt={tt} at={1.6} x={480} y={860} tx="TÉRMICA: CUIDA EL CABLE" bg={AMB} /><Lbl tt={tt} at={2.6} x={1420} y={860} tx="DISYUNTOR: TE CUIDA A VOS" bg={GRN} /></AbsoluteFill>}</Stage>;
const CualBajo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={500} w={680} h={560} s={P(tt, 0.3)}><Breaker x={0} y={-30} s={0.9} on={0} amp="C16" /><T x={0} y={210} tx="CORRIENTE DE MÁS" size={40} /></Card>
  <Card x={1360} y={500} w={680} h={560} s={P(tt, 1.2)} bg="#e6f6ee"><rect x={-130} y={-180} width={260} height={300} rx={14} fill="#f4f4f2" stroke="#9aa3ab" strokeWidth={4} /><rect x={-30} y={-40} width={60} height={46} rx={8} fill={RED} /><T x={0} y={210} tx="UNA FUGA A TIERRA" size={40} /></Card>
</Svg><Lbl tt={tt} at={2.6} x={960} y={110} tx="MIRÁ CUÁL BAJÓ" bg={INK} /><Lbl tt={tt} at={3.4} x={960} y={950} tx="AL DISYUNTOR NO SE LO PUENTEA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const NoSalta: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={960} y={540} s={1.6} on={1} amp="C20" glow={W(tt, 1.6, 2) * (0.5 + 0.5 * Math.sin(tt * 6))} /></Svg>
  <Lbl tt={tt} at={0.6} x={500} y={360} tx="«NUNCA SALTA NADA»" bg={INK} hand /><Lbl tt={tt} at={2} x={1440} y={720} tx="ESO ES LA ALARMA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Setenta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <g filter="" opacity={0.95}><Panel x={960} y={560} amps={["15", "15", "25", "25"]} s={0.75} /></g>
  <rect x={560} y={330} width={800} height={460} fill="rgba(160,110,40,.22)" /></Svg>
  <Big tt={tt} at={0.4} x={960} y={190} tx="AÑOS 70" size={130} /><Lbl tt={tt} at={2} x={960} y={920} tx="40 Y PICO DE AÑOS, ORIGINALES" bg={INK} /></AbsoluteFill>}</Stage>;
const DosDeCuatro: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  <Panel x={960} y={500} amps={["15", "15", "25", "25"]} s={0.85} glow={[0, W(tt, 1.6, 2), 0, W(tt, 2.2, 2.6)]} />
  {[1, 3].map((i, j) => <Check key={i} x={960 - 1.5 * 136 + i * 136} y={800} ok={false} s={P(tt, 1.8 + j * 0.6)} />)}
  {[0, 2].map((i, j) => <Check key={i} x={960 - 1.5 * 136 + i * 136} y={800} ok s={P(tt, 1.2 + j * 0.3)} />)}</Svg>
  <Lbl tt={tt} at={0.6} x={960} y={140} tx="PRUEBA CON EL DOBLE DE CORRIENTE" bg={INK} /><Lbl tt={tt} at={3.2} x={960} y={950} tx="AÑOS SIN PROTECCIÓN" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Senales: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["CALIENTE", "🖐"], ["ZUMBA", "〰"], ["OLOR A PLÁSTICO", "≈"], ["AMARILLENTA", "▮"], ["PALANCA BLANDA", "↕"]].map(([n], i) => <Pill key={i} tt={tt} at={0.4 + i * 0.5} x={1300} y={220 + i * 150} w={640} tx={n as string} ok={false} />)}
  <Breaker x={500} y={540} s={1.4} on={1} amp="C16" glow={0.4 + 0.4 * Math.sin(tt * 8)} /></Svg>
  <Lbl tt={tt} at={3.4} x={960} y={1000} tx="MATRICULADO, ESA MISMA SEMANA" bg={AMB} /></AbsoluteFill>}</Stage>;
const Borne: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const lo = W(tt, 0.6, 2), hot = W(tt, 1.8, 3); return <AbsoluteFill><Svg><Defs />
  <rect x={760} y={300} width={400} height={480} rx={20} fill="#f4f4f2" stroke="#9aa3ab" strokeWidth={5} /><circle cx={960} cy={400} r={60} fill="#c9ccd1" stroke="#666" strokeWidth={6} />
  <path d={`M 920 400 L 1000 400 M 960 360 L 960 440`} stroke="#555" strokeWidth={12} transform={`rotate(${-50 * lo},960,400)`} />
  <Wire x1={300} x2={900} y={560 + 20 * lo} col="#7b4a2a" th={44} bare={60} hot={hot > 0.5 ? 1 : 0} />
  <circle cx={930} cy={560} r={70} fill={RED} opacity={hot * 0.4 * (0.6 + 0.4 * Math.sin(tt * 6))} filter="url(#glow)" /></Svg>
  <Lbl tt={tt} at={1} x={1440} y={400} tx="EL TORNILLO SE AFLOJA" bg={INK} /><Lbl tt={tt} at={2.4} x={1440} y={560} tx="FLOJO = CALIENTA" bg={RED} col={INK} /><Lbl tt={tt} at={3.4} x={960} y={930} tx="REAJUSTE: 10 MIN, GENERAL CORTADA" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Mapa: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  <Panel x={960} y={500} amps={["C10", "C16", "C16", "C20"]} s={0.85} labels={["LUCES", "COCINA", "BAÑO", "TERMO"].map((l, i) => tt > 0.8 + i * 0.6 ? l : "")} /></Svg>
  <Lbl tt={tt} at={3.4} x={960} y={950} tx="EL MAPA DE TU TABLERO" bg={AMB} /></AbsoluteFill>}</Stage>;
const Pasos: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["2 PERSONAS", "PAPEL + CINTA + BIROME", "BAJÁS UNA SOLA", "¿QUÉ SE APAGÓ?", "ANOTÁS Y SUBÍS"].map((n, i) => <Card key={i} x={960} y={200 + i * 160} w={900} h={120} s={P(tt, 0.3 + i * 0.55)} bg={i === 2 ? AMB : INK}>
    <T x={-390} y={20} tx={String(i + 1)} size={64} col={RED} /><T x={40} y={16} tx={n} size={48} /></Card>)}
</Svg></AbsoluteFill>}</Stage>;
const Descubrir: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={500} y={540} s={1.3} on={1} amp="C16" />
  {["COCINA ENTERA", "+ LAVADERO"].map((n, i) => <g key={i}><Arrow x1={620} y1={540} x2={1080} y2={380 + i * 300} k={W(tt, 0.6 + i * 0.6, 1.2 + i * 0.6)} col={AMB} /><Card x={1360} y={380 + i * 300} w={520} h={120} s={P(tt, 0.9 + i * 0.6)} bg={i ? RED : INK}><T x={0} y={16} tx={n} size={46} col={i ? INK : NAVY} /></Card></g>)}
</Svg><Lbl tt={tt} at={3} x={960} y={140} tx="LA MISMA TÉRMICA" bg={INK} /><Lbl tt={tt} at={3.8} x={960} y={960} tx="ESE PAPEL VALE MÁS QUE UN TRUCO" bg={AMB} /></AbsoluteFill>}</Stage>;
const Bipolar: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={520} y={480} s={1.2} on={1} amp="C16" />
  <g transform={`translate(1300,480) scale(${P(tt, 0.8)})`}><Breaker x={-84} y={0} s={1.2} on={1} amp="C16" /><Breaker x={84} y={0} s={1.2} on={1} amp="" /><rect x={-120} y={-30} width={240} height={20} fill="#2b3640" /></g></Svg>
  <Lbl tt={tt} at={1.4} x={520} y={820} tx="UNIPOLAR: UN CABLE" bg={INK} /><Lbl tt={tt} at={2.2} x={1300} y={820} tx="BIPOLAR: FASE Y NEUTRO" bg={GRN} /><Lbl tt={tt} at={3.4} x={960} y={970} tx="¿LAS ANGOSTAS CORTAN LA FASE?" bg={AMB} /></AbsoluteFill>}</Stage>;
const Cero: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <Socket x={560} y={540} s={1.2} /><Tester x={520} y={560} lit={0} rot={-24} /><Meter x={1300} y={540} val={tt > 1.6 ? "0.0" : "---"} s={1.1} /></Svg>
  <Lbl tt={tt} at={0.8} x={560} y={180} tx="BUSCAPOLO: NO PRENDE" bg={INK} /><Lbl tt={tt} at={2} x={1300} y={180} tx="MULTÍMETRO: CERO" bg={GRN} /><Lbl tt={tt} at={3.2} x={960} y={950} tx="RECIÉN AHÍ SE TOCA" bg={AMB} /></AbsoluteFill>}</Stage>;
const Lengua: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={700} y={540} s={1.5} on={1} amp={tt > 1.6 ? "C32" : "C16"} glow={tt > 1.6 ? 1 : 0} /><Arrow x1={980} y1={700} x2={980} y2={380} k={W(tt, 0.8, 1.6)} col={RED} w={14} /></Svg>
  <Lbl tt={tt} at={2.2} x={1400} y={420} tx="«LE CORTASTE LA LENGUA»" bg={INK} hand /><Lbl tt={tt} at={3.2} x={1400} y={620} tx="NUNCA SUBIR EL NÚMERO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Puentear: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={620} y={540} s={1.6} on={1} amp="C16" /><path d="M 520 260 C 360 400 360 700 520 820" stroke="#9aa3ab" strokeWidth={14} fill="none" opacity={W(tt, 0.4, 1)} />
  <line x1={300} y1={240} x2={940} y2={860} stroke={RED} strokeWidth={26} strokeLinecap="round" opacity={W(tt, 1.4, 1.8)} /><circle cx={620} cy={550} r={380} fill="none" stroke={RED} strokeWidth={26} opacity={W(tt, 1.4, 1.8)} /></Svg>
  <Lbl tt={tt} at={2.2} x={1440} y={360} tx="NI ALAMBRE NI MONEDA" bg={INK} /><Lbl tt={tt} at={3.2} x={1440} y={520} tx="NI SACAR LA TIERRA" bg={RED} col={INK} /><Lbl tt={tt} at={3.8} x={1440} y={680} tx="NI ANULAR EL DISYUNTOR" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Rearmar: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["CURIOSIDAD", "MALA SUERTE", "NO ME ESCUCHASTE"].map((n, i) => <Card key={i} x={460 + i * 500} y={500} w={440} h={440} s={P(tt, 0.4 + i * 0.9)} bg={i === 2 ? RED : INK}>
    <T x={0} y={-60} tx={`${i + 1} ${i ? "VECES" : "VEZ"}`} size={60} col={i === 2 ? INK : RED} /><T x={0} y={60} tx={n} size={i === 2 ? 34 : 44} col={i === 2 ? INK : NAVY} /></Card>)}
</Svg><Lbl tt={tt} at={3.4} x={960} y={900} tx="MÁXIMO 2 Y SE BUSCA" bg={AMB} /></AbsoluteFill>}</Stage>;
const General: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={560} y={540} s={1.6} on={1 - W(tt, 0.6, 1.2)} amp="GEN" /><Tester x={1100} y={700} lit={0} rot={-10} /><Meter x={1480} y={540} val="0.0" s={P(tt, 1.8)} /></Svg>
  <Lbl tt={tt} at={1.2} x={560} y={170} tx="LA GENERAL ABAJO" bg={AMB} /><Lbl tt={tt} at={2.4} x={1300} y={170} tx="SE COMPRUEBA" bg={INK} /><Lbl tt={tt} at={3.4} x={960} y={960} tx="LA TAPA DE ADENTRO: MATRICULADO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Consume: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Breaker x={500} y={500} s={1.1} on={1} amp="C16" /><Breaker x={860} y={500} s={1.1} on={1} amp="C32" />
  <Card x={1380} y={500} w={560} h={360} s={P(tt, 1)}><T x={0} y={-100} tx="FACTURA" size={44} hand /><T x={0} y={20} tx="IGUAL" size={110} col={GRN} /></Card></Svg>
  <Lbl tt={tt} at={0.4} x={960} y={140} tx="«¿CONSUME MÁS LUZ?»" bg={INK} hand /><Lbl tt={tt} at={2.6} x={960} y={930} tx="NO AHORRA NADA, PUEDE COSTAR TODO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Toda: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["GENERAL", "LA CASA PIDE DE MÁS"], ["DISYUNTOR", "FUGA"], ["NADA BAJÓ", "¿EL VECINO TIENE LUZ?"]].map(([a, b], i) => <Card key={i} x={960} y={280 + i * 240} w={1300} h={180} s={P(tt, 0.4 + i * 0.9)} bg={i === 2 ? AMB : INK}>
    <T x={-600} y={20} tx={a as string} size={54} anchor="start" col={RED} /><T x={0} y={20} tx={b as string} size={44} anchor="start" /></Card>)}
</Svg></AbsoluteFill>}</Stage>;
const Cambiar: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Panel x={620} y={540} amps={["C10", "C16", "C16"]} s={0.8} /><rect x={330} y={330} width={580} height={420} fill="rgba(232,67,46,.18)" stroke={RED} strokeWidth={8} strokeDasharray="20 14" opacity={W(tt, 0.8, 1.2)} />
  <Pill tt={tt} at={1.6} x={1440} y={420} w={760} tx="MAPA HECHO" ok /><Pill tt={tt} at={2.2} x={1440} y={560} w={760} tx="LA PREGUNTA DEL NÚMERO" ok size={34} /></Svg>
  <Lbl tt={tt} at={1} x={620} y={170} tx="ADENTRO HAY TENSIÓN" bg={RED} col={INK} /><Lbl tt={tt} at={3.2} x={1400} y={780} tx="EL CAMBIO: MATRICULADO" bg={INK} /></AbsoluteFill>}</Stage>;
const TresSeg: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const n = Math.min(3, Math.floor(W(tt, 0.6, 3.4) * 4)); return <AbsoluteFill><Svg><Defs />
  {[1, 2, 3].map((i) => <g key={i} transform={`translate(${560 + (i - 1) * 400},520) scale(${i <= n ? 1 : 0.6})`} opacity={i <= n ? 1 : 0.3}><circle r={150} fill={i <= n ? AMB : "#555"} stroke="#1b1206" strokeWidth={8} /><T x={0} y={50} tx={String(i)} size={150} /></g>)}</Svg>
  <Lbl tt={tt} at={0.4} x={960} y={160} tx="LA PRUEBA DE LOS 3 SEGUNDOS" bg={INK} /><Lbl tt={tt} at={3.6} x={960} y={900} tx="SIN ABRIR NADA" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const Lectura: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={560} y={500} w={680} h={560} s={P(tt, 0.3)} bg="#ffe1dc"><Clock x={0} y={-60} k={0.04} r={130} col={RED} /><T x={0} y={140} tx="ANTES DE 3 SEG" size={44} /><T x={0} y={210} tx="CORTO EN EL APARATO" size={36} col={RED} /></Card>
  <Card x={1360} y={500} w={680} h={560} s={P(tt, 1.4)}><Clock x={0} y={-60} k={W(tt, 1.6, 3.6) * 0.8} r={130} col={AMB} /><T x={0} y={140} tx="MINUTOS DESPUÉS" size={44} /><T x={0} y={210} tx="SOBRECARGA: REPARTÍ" size={36} col={GRN} /></Card>
</Svg></AbsoluteFill>}</Stage>;
const CincoMin: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const k = W(tt, 0.4, 2.6); return <AbsoluteFill><Svg><Defs />
  <Kettle x={420} y={540} s={1.2} /><rect x={620} y={440} width={260} height={220} rx={20} fill="#333" stroke="#111" strokeWidth={6} /><rect x={650} y={470} width={200} height={130} fill={RED} opacity={0.5 + 0.3 * Math.sin(tt * 4)} />
  <Clock x={1180} y={520} k={k * 0.42} r={150} col={AMB} tx="4-5 MIN" /><Breaker x={1600} y={540} s={1.1} on={tt > 2.8 ? 0 : 1} amp="C16" /></Svg>
  <Lbl tt={tt} at={3} x={960} y={150} tx="SOBRECARGA, CLARITO" bg={AMB} /><Lbl tt={tt} at={3.8} x={960} y={960} tx="LA TÉRMICA ESTABA BIEN" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const Repaso: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["LENTA + AL TOQUE", "DOS PARTES"], ["EL NÚMERO", "LO ELIGE EL CABLE"], ["C", "LA CURVA DE LAS CASAS"], ["DESPACIO", "SOBRECARGA"], ["AL TOQUE", "CORTO"], ["DISYUNTOR", "TE CUIDA A VOS"], ["NUNCA", "SUBIR · PUENTEAR · ABRIR"], ["3 SEGUNDOS", "LA PRUEBA"]].map(([a, b], i) => {
    const x = 330 + (i % 4) * 420, y = 330 + Math.floor(i / 4) * 380; return <Card key={i} x={x} y={y} w={380} h={320} s={P(tt, 0.3 + i * 0.5)} bg={i === 6 ? RED : INK}>
      <T x={0} y={-50} tx={a} size={a.length > 10 ? 36 : 50} col={i === 6 ? INK : RED} /><T x={0} y={50} tx={b} size={b.length > 16 ? 26 : 32} col={i === 6 ? INK : NAVY} /></Card>; })}
</Svg></AbsoluteFill>}</Stage>;

export const MAP: Record<string, C> = {
  t32: T32, fino: Fino, cuida: Cuida, treinta: Treinta, mira: Mira, termomag: TermoMag, bimetal: BimetalC, bobina: Bobina, dosformas: DosFormas,
  frente: Frente, tabla: Tabla, pregunta: Pregunta, fusible: Fusible, ezequiel: Ezequiel, curvac: CurvaC, bcd: BCD, habla: Habla, sobrecarga: Sobrecarga,
  suma: Suma, corto: Corto, deauno: DeAUno, lluvia: Lluvia, disyuntor: Disyuntor, cualbajo: CualBajo, nosalta: NoSalta, setenta: Setenta,
  dosdecuatro: DosDeCuatro, senales: Senales, borne: Borne, mapa: Mapa, pasos: Pasos, descubrir: Descubrir, bipolar: Bipolar, cero: Cero,
  lengua: Lengua, puentear: Puentear, rearmar: Rearmar, general: General, consume: Consume, toda: Toda, cambiar: Cambiar, tresseg: TresSeg,
  lectura: Lectura, cincomin: CincoMin, repaso: Repaso,
};
