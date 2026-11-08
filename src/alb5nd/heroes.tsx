// heroes.tsx · kit AlbGrietas (sesD, alb5nd «grietas en la pared: la causa real»): componentes PROPIOS, uno por idea, dibujados como
// la PARED misma (revoque, ladrillo, la grieta que se dibuja sola por su forma), el corte de la casa con su suelo, la bajada, el testigo
// de yeso, la acera con pendiente. Escenario = Stage de ckit. Datos = los del guion. Estructural → ingeniero.
import React from "react";
import { AbsoluteFill } from "remotion";
import { cl, eIn, eio, FONT, H, HAND, phys, Stage } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const BRICK = "#b5532f", BRICKD = "#7c3418", MORTAR = "#d9c7a8", SOIL = "#6a4428", SOILD = "#3e2614", CONC = "#9a9a94", CONCD = "#6c6c66",
  INK = "#fbf6ea", NAVY = "#1d1a16", RED = "#e2452f", GRN = "#6cc46a", SKY = "#7cc4e8", AMB = "#ffc23a", GEO = "#cfd2d6", SALT = "#f4f1ea", PIPE = "#2b2b2b";
const P = (tt: number, a: number, w = 7, z = 0.5) => phys(tt, a, w, z);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const W = (tt: number, a: number, b: number) => eio(tt, a, b);

const Lbl: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; bg?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, tx, col = NAVY, bg = INK, size = 44, hand }) => {
  const s = P(tt, at, 8, 0.5); if (s <= 0.01) return null;
  const hw = (tx.length * (hand ? size * 1.3 : size) * 0.74 + 60) / 2; x = Math.min(Math.max(x, hw + 110), 1810 - hw);  // nunca se corta en el borde
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2.2),
    padding: hand ? "4px 18px" : "10px 26px", borderRadius: 14, background: bg, color: col, fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: hand ? size * 1.3 : size,
    letterSpacing: hand ? 0 : 1.5, whiteSpace: "nowrap", boxShadow: hand ? "none" : "0 14px 34px rgba(0,0,0,.45)", textShadow: hand ? "0 6px 18px rgba(0,0,0,.7)" : "none" }}>{tx}</div>;
};
const Big: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; size?: number }> = ({ tt, at, x, y, tx, col = AMB, size = 170 }) => {
  const s = P(tt, at, 7, 0.42); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: "6px #1b1206", textShadow: "0 18px 40px rgba(0,0,0,.6)", lineHeight: 1, whiteSpace: "nowrap" } as React.CSSProperties}>{tx}</div>;
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>{children}</svg>;
const Defs = () => <defs>
  <pattern id="brick" width="120" height="60" patternUnits="userSpaceOnUse"><rect width="120" height="60" fill={MORTAR} /><rect x="3" y="3" width="114" height="24" rx="3" fill={BRICK} /><rect x="-57" y="33" width="114" height="24" rx="3" fill={BRICK} /><rect x="63" y="33" width="114" height="24" rx="3" fill={BRICK} /></pattern>
  <pattern id="gravel" width="44" height="40" patternUnits="userSpaceOnUse"><rect width="44" height="40" fill="#8d8a84" /><ellipse cx="11" cy="10" rx="10" ry="8" fill="#b9b5ad" /><ellipse cx="32" cy="14" rx="9" ry="7" fill="#a29e96" /><ellipse cx="20" cy="30" rx="11" ry="8" fill="#c8c4bc" /><ellipse cx="40" cy="34" rx="6" ry="5" fill="#9b978f" /></pattern>
  <pattern id="dirty" width="44" height="40" patternUnits="userSpaceOnUse"><rect width="44" height="40" fill="#7a5a3a" /><ellipse cx="11" cy="10" rx="10" ry="8" fill="#8f7357" /><ellipse cx="32" cy="16" rx="8" ry="7" fill="#9a7a5a" /><ellipse cx="22" cy="30" rx="10" ry="7" fill="#866648" /></pattern>
  <pattern id="grit" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r="3" fill="rgba(0,0,0,.25)" /><circle cx="28" cy="26" r="2" fill="rgba(255,220,180,.18)" /><circle cx="18" cy="34" r="2.5" fill="rgba(0,0,0,.2)" /></pattern>
  <pattern id="felt" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill={GEO} /><path d="M 0 4 l 16 3 M 0 12 l 16 -4" stroke="#b7bbc0" strokeWidth="1.5" /></pattern>
  <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#80583a" /><stop offset=".3" stopColor={SOIL} /><stop offset="1" stopColor={SOILD} /></linearGradient>
  <linearGradient id="conc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b4b4ae" /><stop offset="1" stopColor={CONCD} /></linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(124,196,232,.85)" /><stop offset="1" stopColor="rgba(40,110,160,.85)" /></linearGradient>
</defs>;
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
  <circle r={40} fill={ok ? GRN : RED} />{ok ? <path d="M -18 0 l 12 14 l 24 -28" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M -16 -16 l 32 32 M 16 -16 l -32 32" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}
</g>;
// muro de ladrillo con mancha y salitre (stain 0-1 = altura de la mancha)
const Wall: React.FC<{ x: number; y: number; w: number; h: number; stain?: number; salt?: number; paint?: string; peel?: number }> = ({ x, y, w, h, stain = 0, salt = 0, paint, peel = 0 }) => <g>
  <rect x={x} y={y} width={w} height={h} fill={paint ?? "url(#brick)"} stroke="#3a2a1a" strokeWidth={6} />
  {stain > 0 && <path d={`M ${x} ${y + h} L ${x} ${y + h - h * 0.55 * stain} ${Array.from({ length: 9 }, (_, i) => `Q ${x + w * (i + 0.5) / 9} ${y + h - h * 0.55 * stain - 30 * Math.sin(i * 1.7)} ${x + w * (i + 1) / 9} ${y + h - h * 0.55 * stain + 14 * Math.cos(i)}`).join(" ")} L ${x + w} ${y + h} Z`} fill="rgba(60,50,30,.42)" />}
  {salt > 0 && Array.from({ length: 26 }, (_, i) => <circle key={i} cx={x + 20 + ((i * 97) % (w - 40))} cy={y + h - 20 - ((i * 53) % (h * 0.35))} r={4 + (i % 4) * 2} fill={SALT} opacity={salt * 0.9} />)}
  {peel > 0 && [0.2, 0.5, 0.78].map((k, i) => <ellipse key={i} cx={x + w * k} cy={y + h * (0.62 + 0.08 * i)} rx={44 * peel} ry={30 * peel} fill={paint ?? INK} stroke="rgba(0,0,0,.25)" strokeWidth={4} />)}
</g>;
// corte transversal de obra: muro + cimiento + terreno de afuera (con zanja opcional)
const Section: React.FC<{ g: number; trench?: number; foot?: number; outsideHigh?: number; children?: React.ReactNode }> = ({ g, trench = 0, foot = 820, outsideHigh = 0, children }) => <g>
  <rect x={180} y={g} width={1560} height={1080 - g} fill="url(#soil)" /><rect x={180} y={g} width={1560} height={1080 - g} fill="url(#grit)" />
  <rect x={180} y={g - outsideHigh} width={1560 - 1060} height={outsideHigh} fill="url(#soil)" />
  <rect x={700} y={g - 360} width={130} height={360 + (foot - g)} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <rect x={660} y={foot} width={210} height={70} fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} />
  <rect x={830} y={g - 18} width={910} height={18} fill="url(#conc)" />
  {trench > 0 && <rect x={lp(430, 470, 0)} y={g - outsideHigh} width={210} height={(foot - 20 - g + outsideHigh) * trench} fill="#2a1a0e" />}
  {children}
</g>;
const Pipe: React.FC<{ x: number; y: number; r?: number; holes?: "down" | "up"; k?: number }> = ({ x, y, r = 56, holes = "down", k = 1 }) => <g transform={`translate(${x},${y}) scale(${k})`}>
  <circle r={r} fill={PIPE} stroke="#111" strokeWidth={6} /><circle r={r - 14} fill="#5a5a5a" />
  {[-40, 0, 40].map((a, i) => { const ang = ((holes === "down" ? 90 : -90) + a) * Math.PI / 180; return <circle key={i} cx={Math.cos(ang) * (r - 6)} cy={Math.sin(ang) * (r - 6)} r={8} fill={AMB} />; })}
</g>;
const Level: React.FC<{ x: number; y: number; w?: number; rot?: number; bub?: number }> = ({ x, y, w = 520, rot = 0, bub = 0 }) => <g transform={`translate(${x},${y}) rotate(${rot})`}>
  <rect x={-w / 2} y={-34} width={w} height={68} rx={10} fill="#e9c22b" stroke="#6a5410" strokeWidth={6} />
  <rect x={-70} y={-20} width={140} height={40} rx={20} fill="#c8f0a0" stroke="#3a5a20" strokeWidth={4} />
  <ellipse cx={bub * 50} cy={0} rx={22} ry={13} fill="#f7fff0" /><line x1={-26} y1={-20} x2={-26} y2={20} stroke="#222" strokeWidth={3} /><line x1={26} y1={-20} x2={26} y2={20} stroke="#222" strokeWidth={3} />
</g>;
const Bucket: React.FC<{ x: number; y: number; s?: number; fill?: string; label?: string }> = ({ x, y, s = 1, fill = "#e0e0e0", label }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M -110 -120 L 110 -120 L 90 120 L -90 120 Z" fill={fill} stroke="#333" strokeWidth={6} /><ellipse cx={0} cy={-120} rx={110} ry={22} fill="#bbb" stroke="#333" strokeWidth={6} />
  <path d="M -110 -120 Q 0 -260 110 -120" stroke="#333" strokeWidth={6} fill="none" />{label && <T x={0} y={30} tx={label} size={34} />}
</g>;
const Stake: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 220 }) => <g><rect x={x - 14} y={y - h} width={28} height={h} fill="#c49058" stroke="#6a4420" strokeWidth={4} /><path d={`M ${x - 14} ${y} L ${x} ${y + 40} L ${x + 14} ${y} Z`} fill="#c49058" stroke="#6a4420" strokeWidth={4} /></g>;
const Drop: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = SKY }) => <path transform={`translate(${x},${y}) scale(${s})`} d="M 0 -40 C 20 -10, 30 6, 30 18 A 30 30 0 1 1 -30 18 C -30 6, -20 -10, 0 -40 Z" fill={col} stroke="#2e6d8c" strokeWidth={4} />;


// ───────── kit AlbGrietas: primitivas propias ─────────
const PLAS = "#e9dfcc", CRK = "#2a1d12", RUST = "#9a4a1c", WOOD = "#c49058";
// grieta que se dibuja sola (k 0-1)
const Crk: React.FC<{ d: string; k: number; w?: number; col?: string }> = ({ d, k, w = 9, col = CRK }) => k <= 0.01 ? null :
  <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cl(k)} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
const stairs = (x: number, y: number, n: number, dx: number, dy: number) => `M ${x} ${y} ` + Array.from({ length: n }, () => `h ${dx} v ${dy}`).join(" ");
const web = (cx: number, cy: number, r: number, seed = 1) => Array.from({ length: 14 }, (_, i) => {
  const a = i * 0.9 + seed, l = r * (0.5 + 0.5 * Math.abs(Math.sin(i * 2.3 + seed)));
  const x1 = cx + Math.cos(a) * l * 0.2, y1 = cy + Math.sin(a) * l * 0.2, x2 = cx + Math.cos(a + 0.4) * l, y2 = cy + Math.sin(a + 0.4) * l;
  return `M ${x1} ${y1} Q ${(x1 + x2) / 2 + 30 * Math.sin(i)} ${(y1 + y2) / 2 + 30 * Math.cos(i)} ${x2} ${y2}`;
}).join(" ");
// pared revocada (plano frontal)
const Plas: React.FC<{ x: number; y: number; w: number; h: number; col?: string }> = ({ x, y, w, h, col = PLAS }) => <g>
  <rect x={x} y={y} width={w} height={h} fill={col} stroke="#5a4a36" strokeWidth={6} /><rect x={x} y={y} width={w} height={h} fill="url(#grit)" opacity={0.6} /></g>;
const Win: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 300, h = 260 }) => <g>
  <rect x={x} y={y} width={w} height={h} fill="#9fd0ea" stroke={WOOD} strokeWidth={16} /><line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={WOOD} strokeWidth={10} />
  <rect x={x - 16} y={y + h} width={w + 32} height={18} fill="#d8d0c0" stroke="#5a4a36" strokeWidth={4} /></g>;
const Downpipe: React.FC<{ x: number; y1: number; y2: number; elbow?: number }> = ({ x, y1, y2, elbow = 0 }) => <g>
  <rect x={x - 22} y={y1} width={44} height={y2 - y1} fill="#8a8f94" stroke="#3a3e42" strokeWidth={5} />
  {elbow > 0 && <path d={`M ${x - 22} ${y2} q 0 50 50 50 h ${elbow} v -44 h ${-elbow + 6} q -6 0 -6 -6 z`} fill="#8a8f94" stroke="#3a3e42" strokeWidth={5} />}
</g>;
const Coin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}><circle r={46} fill="#d9b44a" stroke="#7a5a10" strokeWidth={6} /><circle r={32} fill="none" stroke="#a8851c" strokeWidth={4} /></g>;
const Testigo: React.FC<{ x: number; y: number; broken?: number; date?: string; rot?: number }> = ({ x, y, broken = 0, date = "8/11", rot = -8 }) => <g transform={`translate(${x},${y}) rotate(${rot})`}>
  <rect x={-90} y={-36} width={180} height={72} rx={16} fill="#fbfaf4" stroke="#b9b2a0" strokeWidth={5} />
  {broken > 0.01 && <Crk d="M 0 -36 l -8 20 l 12 16 l -6 36" k={broken} w={6} col={RED} />}
  <T x={0} y={74} tx={date} size={30} hand col={INK} /></g>;
const Sun: React.FC<{ x: number; y: number; r?: number; tt: number }> = ({ x, y, r = 70, tt }) => <g transform={`translate(${x},${y}) rotate(${tt * 20})`}>
  {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={r + 14} x2={0} y2={r + 50} stroke={AMB} strokeWidth={10} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}<circle r={r} fill={AMB} /></g>;
const Tree: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-24} y={-260} width={48} height={260} fill="#6a4428" /><circle cx={0} cy={-330} r={150} fill="#3f7d3a" /><circle cx={-90} cy={-270} r={90} fill="#4c8f45" /><circle cx={90} cy={-280} r={100} fill="#356e31" /></g>;
// casa de frente (techo plano/losa) con suelo
const House: React.FC<{ x: number; y: number; w: number; h: number; tilt?: number; children?: React.ReactNode }> = ({ x, y, w, h, tilt = 0, children }) => <g transform={`rotate(${tilt},${x},${y + h})`}>
  <rect x={x - 20} y={y - 40} width={w + 40} height={40} fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} />
  <Plas x={x} y={y} w={w} h={h} />{children}</g>;
const Ground: React.FC<{ y: number; x?: number; w?: number }> = ({ y, x = 120, w = 1680 }) => <g><rect x={x} y={y} width={w} height={1080 - y} fill="url(#soil)" /><rect x={x} y={y} width={w} height={1080 - y} fill="url(#grit)" /></g>;
const Big2: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; size?: number; col?: string }> = ({ tt, at, x, y, tx, size = 150, col = AMB }) => { const s = P(tt, at, 7, 0.45); return s <= 0.01 ? null :
  <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * s})`} opacity={cl(s * 2)}><text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={col} stroke="#1b1206" strokeWidth={6} paintOrder="stroke">{tx}</text></g>; };
const Pill: React.FC<{ tt: number; at: number; x: number; y: number; w: number; tx: string; bg?: string; col?: string; size?: number; ok?: boolean }> = ({ tt, at, x, y, w, tx, bg = INK, col = NAVY, size = 38, ok }) => { const s = P(tt, at); return <Card x={x} y={y} w={w} h={96} s={s} bg={bg}>
  <T x={ok === undefined ? 0 : 30} y={14} tx={tx} size={size} col={col} />{ok !== undefined && <Check x={-w / 2 + 56} y={0} ok={ok} s={P(tt, at + 0.4)} />}</Card>; };
const Xout: React.FC<{ x: number; y: number; w: number; h: number; k: number }> = ({ x, y, w, h, k }) => k <= 0.01 ? null : <g>
  <Crk d={`M ${x} ${y} L ${x + w} ${y + h}`} k={k} w={16} col={RED} /><Crk d={`M ${x + w} ${y} L ${x} ${y + h}`} k={k} w={16} col={RED} /></g>;

// ───────── componentes (uno por idea, en orden del guion) ─────────
const DosVeces: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const p1 = W(tt, 0.8, 1.5), r1 = W(tt, 1.8, 2.4), p2 = W(tt, 2.6, 3.2), r2 = W(tt, 3.4, 4.1); const vis = (p1 > 0 && r1 < 1) ? 1 - p1 + r1 : (p2 > 0 && r2 < 1) ? 1 - p2 + r2 : 1;
  return <AbsoluteFill><Svg><Defs /><Plas x={360} y={180} w={1200} h={700} /><Win x={500} y={260} />
    <g opacity={cl(vis)}><Crk d={stairs(800, 520, 6, 70, 55)} k={W(tt, 0.1, 0.7)} /></g>
    <rect x={360} y={180} width={1200 * (p1 - r1 > 0 ? p1 : 0)} height={700} fill="#f4ecdc" opacity={p1 > 0 && r1 < 1 ? 0.9 : 0} />
    <rect x={360} y={180} width={1200 * (p2 - r2 > 0 ? p2 : 0)} height={700} fill="#efe2cc" opacity={p2 > 0 && r2 < 1 ? 0.9 : 0} />
  </Svg><Lbl tt={tt} at={0.9} x={600} y={960} tx="MANO 1" bg={INK} /><Lbl tt={tt} at={2.7} x={960} y={960} tx="MANO 2" bg={INK} /><Lbl tt={tt} at={4.1} x={1360} y={960} tx="Y VOLVIÓ" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const TresMetros: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={860} />
  <House x={260} y={360} w={1100} h={500}><Win x={380} y={460} w={240} h={220} /><Crk d={stairs(620, 680, 4, 50, 45)} k={W(tt, 0.2, 1)} /></House>
  <Downpipe x={1330} y1={330} y2={860} /><ellipse cx={1330} cy={880} rx={90} ry={20} fill="url(#water)" opacity={W(tt, 1.8, 2.4)} />
  <Arrow x1={640} y1={940} x2={1310} y2={940} k={W(tt, 1, 2.2)} col={AMB} /></Svg>
  <Lbl tt={tt} at={2.2} x={980} y={1010} tx="3 METROS" bg={AMB} /><Lbl tt={tt} at={3.2} x={1450} y={250} tx="LA CAUSA: UN CAÑO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Aviso: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => { const bl = 0.5 + 0.5 * Math.sin(tt * 7); return <AbsoluteFill><Svg><Defs /><Plas x={460} y={200} w={1000} h={640} />
  <Crk d={stairs(700, 300, 6, 80, 70)} k={W(tt, 0.2, 1.2)} w={12} />
  <g transform="translate(1260,320)" opacity={W(tt, 1.4, 1.8)}><path d="M -70 60 L 0 -70 L 70 60 Z" fill={AMB} stroke="#1b1206" strokeWidth={8} /><T x={0} y={44} tx="!" size={90} /></g>
  <circle cx={1260} cy={320} r={130} fill="none" stroke={AMB} strokeWidth={8} opacity={W(tt, 1.4, 1.8) * bl} /></Svg>
  <Lbl tt={tt} at={2.2} x={700} y={930} tx="NO ES EL PROBLEMA" bg={INK} /><Lbl tt={tt} at={3.1} x={1280} y={930} tx="ES EL AVISO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Mapa: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Plas x={300} y={160} w={1320} h={720} col="#efe4cc" />
  {Array.from({ length: 9 }, (_, i) => <line key={i} x1={300 + i * 165} y1={160} x2={300 + i * 165} y2={880} stroke="rgba(90,74,54,.18)" strokeWidth={3} />)}
  <Win x={420} y={240} w={260} h={230} /><Crk d={"M 680 240 " + stairs(680, 240, 6, 80, 70).slice(13)} k={W(tt, 0.3, 1.6)} w={12} />
  {[[690, 350, "SALE"], [930, 450, "VA"], [1160, 640, "FORMA"]].map(([x, y, s], i) => { const k = P(tt, 1.6 + i * 0.7); return k > 0.01 && <g key={i} transform={`translate(${x},${(y as number) - 60 * k}) scale(${k})`}>
    <path d="M 0 0 C -40 -50 -40 -100 0 -100 C 40 -100 40 -50 0 0 Z" fill={RED} stroke="#1b1206" strokeWidth={5} /><circle cy={-68} r={16} fill={INK} /><T x={70} y={-50} tx={s as string} size={40} anchor="start" col="#1d2733" /></g>; })}
</Svg><Lbl tt={tt} at={3.8} x={960} y={970} tx="LA GRIETA ES UN MAPA" bg={AMB} /></AbsoluteFill>}</Stage>;
const Treinta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <Big2 tt={tt} at={0.3} x={760} y={600} tx="30" size={340} /><Bucket x={1300} y={640} s={P(tt, 1)} fill="#9a9a94" label="MEZCLA" />
</Svg><Lbl tt={tt} at={1.4} x={760} y={760} tx="AÑOS DE OBRA" bg={INK} /><Lbl tt={tt} at={2.4} x={1300} y={880} tx="PEÓN A LOS 19" bg={AMB} hand={false} /></AbsoluteFill>}</Stage>;
const Tres: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1, 2].map((i) => { const s = P(tt, 0.3 + i * 0.9); return <Card key={i} x={460 + i * 500} y={520} w={400} h={480} s={s} bg={["#c49058", "#cfe8f6", "#ffe39a"][i]}>
    {i === 0 && <g><rect x={-150} y={-60} width={300} height={140} fill="url(#soil)" /><rect x={-150} y={-60} width={300} height={30} fill="#80583a" /></g>}
    {i === 1 && <Drop x={0} y={10} s={2.4} />}{i === 2 && <Sun x={0} y={0} r={70} tt={tt} />}
    <T x={0} y={190} tx={["EL SUELO", "EL AGUA", "EL SOL"][i]} size={52} /></Card>; })}
</Svg><Lbl tt={tt} at={3.2} x={960} y={130} tx="TU CASA SE MUEVE POR 3 COSAS" bg={INK} /></AbsoluteFill>}</Stage>;
const Suelos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const tl = 2.2 * W(tt, 2.4, 3.6); return <AbsoluteFill><Svg><Defs />
  {[["#8a6a48", 640, "FIRME"], ["#a08a6a", 640, "RELLENO"], ["#7a4f3a", 640, "ARCILLA"]].map(([c, , n], i) => { const k = W(tt, 0.2 + i * 0.6, 0.8 + i * 0.6); return <g key={i} opacity={k}>
    <rect x={260 + i * 470} y={640} width={470} height={440} fill={c as string} /><rect x={260 + i * 470} y={640} width={470} height={440} fill="url(#grit)" /><T x={495 + i * 470} y={900} tx={n as string} size={52} col={INK} /></g>; })}
  <House x={420} y={330} w={1080} h={300} tilt={tl}><line x1={420} y1={330} x2={1500} y2={630} stroke="transparent" /></House>
  <Crk d={stairs(1000, 360, 4, 60, 60)} k={W(tt, 3.2, 4.2)} w={10} />
</Svg><Lbl tt={tt} at={3.4} x={960} y={150} tx="NO SE APOYA PAREJA" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Esponja: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const wet = tt < 2.4 ? W(tt, 0.4, 1.6) : 1 - W(tt, 2.6, 3.8); const sc = 1 + 0.22 * wet; return <AbsoluteFill><Svg><Defs />
  <g transform={`translate(960,520) scale(${sc},${0.9 + 0.3 * wet})`}><rect x={-300} y={-180} width={600} height={360} rx={40} fill={wet > 0.5 ? "#6e4632" : "#a8794e"} stroke="#3e2614" strokeWidth={8} />
    {wet < 0.6 && <path d="M -260 -60 L -80 -20 L 40 -120 M -80 -20 L -40 140 M 40 -120 L 220 -40 L 160 150 M 220 -40 L 290 20" stroke="#3e2614" strokeWidth={8} fill="none" opacity={1 - wet * 1.6} />}</g>
  {wet > 0.3 && [0, 1, 2, 3].map((i) => <Drop key={i} x={700 + i * 170} y={170 + ((tt * 200 + i * 60) % 120)} s={0.9} />)}
</Svg><Lbl tt={tt} at={1.2} x={560} y={900} tx="SE MOJA: SE HINCHA" bg="#cfe8f6" /><Lbl tt={tt} at={3.4} x={1360} y={900} tx="SE SECA: SE ENCOGE" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Losa: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const st = W(tt, 0.8, 2.4); return <AbsoluteFill><Svg><Defs /><Sun x={1500} y={200} tt={tt} />
  <rect x={480 - 40 * st} y={420} width={960 + 80 * st} height={70} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} /><Plas x={520} y={490} w={880} h={400} />
  <Arrow x1={560} y1={380} x2={400} y2={380} k={st} col={RED} /><Arrow x1={1360} y1={380} x2={1520} y2={380} k={st} col={RED} />
  <Crk d="M 520 500 L 1400 500" k={W(tt, 2.6, 3.8)} w={7} /></Svg>
  <Lbl tt={tt} at={1.6} x={960} y={300} tx="AL MEDIODÍA SE ESTIRA" bg={AMB} /><Lbl tt={tt} at={3.4} x={960} y={970} tx="LA PARED RECIBE EL EMPUJÓN" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Victima: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs /><Plas x={760} y={330} w={400} h={420} />
  <Crk d={stairs(840, 380, 5, 50, 60)} k={W(tt, 0.3, 1)} />
  <Arrow x1={300} y1={540} x2={730} y2={540} k={W(tt, 1, 1.8)} col="#c49058" /><Arrow x1={960} y1={90} x2={960} y2={300} k={W(tt, 1.6, 2.4)} col={AMB} /><Arrow x1={1620} y1={540} x2={1190} y2={540} k={W(tt, 2.2, 3)} col={SKY} />
</Svg><Lbl tt={tt} at={1.3} x={330} y={460} tx="SUELO" bg="#c49058" /><Lbl tt={tt} at={1.9} x={1160} y={150} tx="SOL" bg={AMB} /><Lbl tt={tt} at={2.5} x={1590} y={460} tx="AGUA" bg={SKY} />
  <Lbl tt={tt} at={3.4} x={960} y={880} tx="LA PARED ES LA VÍCTIMA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Tela: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Plas x={300} y={150} w={1320} h={760} />
  <Crk d={web(700, 450, 300, 1)} k={W(tt, 0.2, 2)} w={4} /><Crk d={web(1250, 620, 280, 3)} k={W(tt, 0.8, 2.6)} w={4} /></Svg>
  <Lbl tt={tt} at={2.6} x={960} y={140} tx="CAUSA 1 · LA TELARAÑA" bg={INK} /><Lbl tt={tt} at={3.4} x={960} y={980} tx="ES EL REVOQUE, NO LA CASA" bg={GRN} /></AbsoluteFill>}</Stage>;
const Piel: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const o = W(tt, 0.6, 1.8); return <AbsoluteFill><Svg><Defs />
  <rect x={500} y={200} width={500} height={620} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <g transform={`translate(${-260 * o},0)`}><rect x={1000} y={200} width={70} height={620} fill={PLAS} stroke="#5a4a36" strokeWidth={5} /><Crk d={web(1035, 500, 160, 2)} k={W(tt, 0.2, 0.8)} w={3} /></g>
  <Arrow x1={1300} y1={380} x2={1100} y2={380} k={W(tt, 2, 2.6)} col={AMB} /><Arrow x1={300} y1={640} x2={480} y2={640} k={W(tt, 2.6, 3.2)} col={GRN} />
</Svg><Lbl tt={tt} at={2.4} x={1450} y={380} tx="PIEL = REVOQUE" bg={AMB} /><Lbl tt={tt} at={3} x={330} y={560} tx="HUESO SANO" bg={GRN} /><Lbl tt={tt} at={3.8} x={960} y={950} tx="FIJADOR · ENDUIDO · PINTURA" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Direccion: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <Plas x={220} y={220} w={680} h={560} /><Plas x={1020} y={220} w={680} h={560} />
  <Crk d={web(560, 500, 230, 4)} k={W(tt, 0.2, 1.4)} w={4} /><Crk d={stairs(1120, 280, 6, 80, 75)} k={W(tt, 1, 2.2)} w={10} />
  <Arrow x1={1150} y1={330} x2={1590} y2={720} k={W(tt, 2.2, 3)} col={AMB} w={12} /></Svg>
  <Lbl tt={tt} at={1.6} x={560} y={870} tx="SIN DIRECCIÓN" bg={GRN} /><Lbl tt={tt} at={2.8} x={1360} y={870} tx="CON DIRECCIÓN" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Esquina: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Plas x={300} y={140} w={1320} h={800} />
  <Win x={720} y={380} w={420} h={340} /><Crk d="M 1140 380 l 40 -40 l 30 -10 l 40 -50 l 30 -30" k={W(tt, 0.4, 1.8)} w={10} /><Crk d="M 720 720 l -40 40 l -20 30 l -40 40" k={W(tt, 1.4, 2.6)} w={10} />
  <circle cx={1140} cy={380} r={50} fill="none" stroke={RED} strokeWidth={8} opacity={W(tt, 0.2, 0.6)} />
</Svg><Lbl tt={tt} at={0.6} x={1400} y={280} tx="SIEMPRE DESDE LA ESQUINA" bg={RED} col={INK} /><Lbl tt={tt} at={2.8} x={960} y={1000} tx="CAUSA 2 · LA VENTANA" bg={INK} /></AbsoluteFill>}</Stage>;
const Dintel: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const ok = i === 0, x = 240 + i * 760, lw = ok ? 120 : 30; return <g key={i}><Plas x={x} y={220} w={680} h={620} /><Win x={x + 190} y={420} w={300} h={260} />
    <rect x={x + 190 - lw} y={370} width={300 + 2 * lw} height={44} fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} opacity={W(tt, 0.4 + i, 1 + i)} />
    {ok && <g opacity={W(tt, 1.2, 1.6)}><Arrow x1={x + 190} y1={340} x2={x + 70} y2={340} k={1} col={GRN} w={6} /><T x={x + 130} y={320} tx="20 CM" size={30} col={INK} /></g>}
    {!ok && <Crk d={`M ${x + 160} 414 l -40 -50 l -30 -40`} k={W(tt, 2.2, 3)} w={8} />}
    <Check x={x + 340} y={780} ok={ok} s={P(tt, 2.6 + i * 0.6)} /></g>; })}
</Svg><Lbl tt={tt} at={1} x={580} y={140} tx="DINTEL BIEN APOYADO" bg={GRN} /><Lbl tt={tt} at={2} x={1340} y={140} tx="CORTO: RAJA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Ampliacion: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const op = W(tt, 0.4, 1.4); return <AbsoluteFill><Svg><Defs /><rect x={300} y={160} width={1320} height={760} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <rect x={760} y={360} width={400 * op} height={320} fill="#9fd0ea" stroke={WOOD} strokeWidth={14} />
  <Crk d="M 1160 360 l 40 -50 l 20 -30 l 40 -40" k={W(tt, 2.2, 3.4)} w={10} /><Crk d="M 760 360 l -40 -50 l -30 -40" k={W(tt, 2.6, 3.8)} w={10} /></Svg>
  <Lbl tt={tt} at={1.4} x={960} y={260} tx="VENTANA NUEVA, SIN DINTEL" bg={INK} /><Lbl tt={tt} at={3.2} x={960} y={1000} tx="A LOS MESES: LA GRIETA" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Apuntalar: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={900} /><rect x={340} y={180} width={1240} height={720} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <rect x={760} y={420} width={400} height={300} fill="#2a1a0e" opacity={W(tt, 2.4, 3)} />
  {[620, 1300].map((x, i) => { const s = W(tt, 0.4 + i * 0.6, 1.2 + i * 0.6); return <g key={i} opacity={s}><rect x={x - 14} y={360} width={28} height={540 * s} fill={WOOD} stroke="#6a4420" strokeWidth={4} /><rect x={x - 80} y={340} width={160} height={26} fill={WOOD} /></g>; })}
</Svg><Lbl tt={tt} at={1.6} x={960} y={110} tx="PRIMERO SE APUNTALA" bg={AMB} /><Lbl tt={tt} at={3.2} x={960} y={990} tx="NO ES PARA UN SÁBADO SOLO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Escalera: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><rect x={300} y={140} width={1320} height={800} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <Crk d={stairs(480, 170, 12, 60, 60)} k={W(tt, 0.3, 2.8)} w={14} col="#140c06" /></Svg>
  <Lbl tt={tt} at={1.2} x={1350} y={260} tx="SIGUE LAS JUNTAS" bg={INK} /><Lbl tt={tt} at={2.8} x={960} y={1000} tx="CAUSA 3 · EN ESCALERA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Apunta: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const sk = W(tt, 1, 2.6); return <AbsoluteFill><Svg><Defs /><Ground y={850} />
  <House x={360} y={380} w={1200} h={470} tilt={1.6 * sk}><path d="M 760 820 L 820 760 L 880 760 L 880 700 L 960 700 L 960 620 L 1060 620 L 1060 520 L 1180 520 L 1180 420" stroke={CRK} strokeWidth={6 + 14 * sk} fill="none" /></House>
  <Arrow x1={1600} y1={560} x2={1600} y2={800} k={W(tt, 2.4, 3.2)} col={RED} w={14} /></Svg>
  <Lbl tt={tt} at={1.4} x={1180} y={290} tx="MÁS ANCHA ARRIBA" bg={INK} /><Lbl tt={tt} at={3} x={1500} y={960} tx="ESTA ESQUINA BAJÓ" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Fuentes: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={700} /><Plas x={760} y={200} w={400} h={500} />
  <rect x={700} y={700} width={520} height={90} fill="url(#conc)" opacity={0.8} />
  {[["BAJADA", 420, 360], ["CAÑO QUE PIERDE", 420, 880], ["CANTERO", 1500, 360], ["PILETA", 1500, 880]].map(([n, x, y], i) => <g key={i}>
    <Arrow x1={x as number} y1={y as number} x2={(x as number) < 960 ? 720 : 1200} y2={770} k={W(tt, 0.4 + i * 0.8, 1 + i * 0.8)} col={SKY} />
    <Card x={x as number} y={y as number} w={360} h={90} s={P(tt, 0.3 + i * 0.8)} bg="#cfe8f6"><T x={0} y={14} tx={n as string} size={36} /></Card></g>)}
</Svg><Lbl tt={tt} at={3.8} x={960} y={130} tx="CASI SIEMPRE: EL AGUA" bg={AMB} /></AbsoluteFill>}</Stage>;
const Ingeniero: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["MÁS DE 3-4 MM", "CRECE", "SE ABRE DE UN LADO", "PUERTAS QUE NO CIERRAN"].map((n, i) => <Pill key={i} tt={tt} at={0.3 + i * 0.6} x={700} y={260 + i * 150} w={760} tx={n} ok={false} />)}
  {(() => { const s = P(tt, 3, 6, 0.4); return s > 0.01 && <g transform={`translate(1460,540) rotate(-12) scale(${2 - s})`} opacity={cl(s * 2)}><rect x={-230} y={-80} width={460} height={160} rx={18} fill="none" stroke={RED} strokeWidth={12} /><T x={0} y={24} tx="INGENIERO" size={74} col={RED} /></g>; })()}
</Svg><Lbl tt={tt} at={3.8} x={1460} y={720} tx="NO EL PINTOR" bg={INK} /></AbsoluteFill>}</Stage>;
const Cajon: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const c = 0.5 - 0.5 * Math.cos(tt * 2.2), day = c > 0.5; return <AbsoluteFill style={{ background: day ? "transparent" : "rgba(10,14,30,.35)" }}><Svg><Defs />
  {day ? <Sun x={1560} y={190} tt={tt} /> : <circle cx={1560} cy={190} r={60} fill="#e8e8f0" />}
  <Plas x={460} y={460} w={1000} h={440} /><rect x={420 + 60 * c} y={390} width={1080} height={70} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} />
  <line x1={460} y1={462} x2={1460} y2={462} stroke={CRK} strokeWidth={7} /></Svg>
  <Lbl tt={tt} at={0.8} x={960} y={300} tx="SE ABRE Y SE CIERRA CADA DÍA" bg={INK} /><Lbl tt={tt} at={2.4} x={960} y={990} tx="CAUSA 4 · BAJO EL TECHO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Reflectiva: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const pw = W(tt, 0.6, 1.8); return <AbsoluteFill><Svg><Defs /><Sun x={420} y={200} tt={tt} />
  <rect x={560} y={520} width={1000} height={80} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} /><rect x={560} y={500} width={1000 * pw} height={24} fill="#ffffff" />
  {[0, 1, 2].map((i) => <g key={i}><Arrow x1={500 + i * 120} y1={280} x2={760 + i * 200} y2={490} k={W(tt, 0.2, 0.8)} col={AMB} w={8} /><Arrow x1={760 + i * 200} y1={490} x2={1000 + i * 260} y2={200} k={W(tt, 2, 2.8)} col="#ffffff" w={8} /></g>)}
  <g transform="translate(1680,640)"><rect x={-24} y={-200} width={48} height={260} rx={24} fill="#fff" stroke="#333" strokeWidth={5} /><rect x={-12} y={-180 + 120 * W(tt, 2.4, 3.6)} width={24} height={220 - 120 * W(tt, 2.4, 3.6)} fill={RED} /><circle cy={70} r={40} fill={RED} /></g>
</Svg><Lbl tt={tt} at={1.4} x={1060} y={700} tx="PINTURA BLANCA REFLECTIVA" bg={INK} /><Lbl tt={tt} at={3.2} x={960} y={900} tx="+ MASILLA ELÁSTICA EN LA LÍNEA" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Regla: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => { const k = W(tt, 0.6, 2.4); return <AbsoluteFill><Svg><Defs /><rect x={300} y={150} width={1320} height={780} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <rect x={860} y={150} width={180} height={780} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} />
  <Crk d="M 1046 150 L 1046 930" k={k} w={10} /><rect x={1060} y={150 + 740 * k} width={40} height={300} fill="#e9c22b" stroke="#6a5410" strokeWidth={4} transform={`translate(0,-150)`} opacity={k < 1 ? 1 : 0} />
</Svg><Lbl tt={tt} at={2.4} x={1400} y={300} tx="RECTA, COMO CON REGLA" bg={INK} /><Lbl tt={tt} at={3.2} x={960} y={1000} tx="CAUSA 5 · LA UNIÓN" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const DosMat: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => { const a = Math.sin(tt * 2.4); return <AbsoluteFill><Svg><Defs />
  <rect x={640} y={220 - 18 * a} width={200} height={600} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} /><rect x={840} y={220 + 10 * a} width={480} height={600} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <Arrow x1={740} y1={180} x2={740} y2={120 - 20 * a} k={W(tt, 0.6, 1.2)} col={SKY} /><Arrow x1={1080} y1={180} x2={1080} y2={150 - 6 * a} k={W(tt, 0.9, 1.5)} col={AMB} />
  <Crk d="M 840 220 L 840 820" k={W(tt, 1.6, 2.6)} w={10} col={RED} /></Svg>
  <Lbl tt={tt} at={1.4} x={540} y={900} tx="HORMIGÓN" bg="#cfe8f6" /><Lbl tt={tt} at={1.6} x={1380} y={900} tx="LADRILLO" bg={AMB} /><Lbl tt={tt} at={3} x={960} y={985} tx="SE MUEVEN DISTINTO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Malla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const m = W(tt, 0.8, 2); return <AbsoluteFill><Svg><Defs /><Plas x={300} y={150} w={1320} h={780} />
  <Crk d="M 960 150 L 960 930" k={W(tt, 0.1, 0.6)} w={10} />
  <defs><pattern id="mesh" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 0 0 L 30 0 M 0 0 L 0 30" stroke="#f0f0f0" strokeWidth={5} /></pattern></defs>
  <rect x={960 - 220 * m} y={150} width={440 * m} height={780} fill="url(#mesh)" opacity={0.95} />
  <g opacity={W(tt, 2, 2.6)}><Arrow x1={960} y1={980} x2={740} y2={980} k={1} col={AMB} w={6} /><Arrow x1={960} y1={980} x2={1180} y2={980} k={1} col={AMB} w={6} /></g></Svg>
  <Lbl tt={tt} at={2.4} x={960} y={990} tx="15 CM DE CADA LADO" bg={AMB} /><Lbl tt={tt} at={3.4} x={960} y={110} tx="MALLA + MASILLA ELÁSTICA" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Hierro: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => { const r = W(tt, 1, 2.6); return <AbsoluteFill><Svg><Defs />
  <rect x={760} y={120} width={400} height={860} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} /><path d={`M 760 400 Q ${740 - 40 * r} 560 760 720`} fill="#b4b4ae" stroke="#4a4a44" strokeWidth={4} />
  <Crk d="M 800 140 L 800 960" k={W(tt, 0.2, 1)} w={9} />
  {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${800 + i * 6} ${300 + i * 160} q 10 60 -4 ${80 + 40 * r}`} stroke={RUST} strokeWidth={14} fill="none" opacity={r} strokeLinecap="round" />)}
</Svg><Lbl tt={tt} at={1.2} x={1420} y={260} tx="RECTA, EN COLUMNA" bg={INK} /><Lbl tt={tt} at={2.2} x={1420} y={540} tx="REVOQUE HINCHADO" bg={AMB} /><Lbl tt={tt} at={3} x={1420} y={820} tx="MANCHAS DE ÓXIDO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Hincha: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const g = W(tt, 0.6, 3); return <AbsoluteFill><Svg><Defs />
  <rect x={560} y={240} width={800} height={600} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} />
  <circle cx={960} cy={540} r={50 + 70 * g} fill={RUST} opacity={0.6 + 0.4 * g} /><circle cx={960} cy={540} r={50} fill="#4a4a4a" stroke="#222" strokeWidth={5} />
  {Array.from({ length: 6 }, (_, i) => { const a = i * 1.05 + 0.3; return <Crk key={i} d={`M ${960 + Math.cos(a) * 110} ${540 + Math.sin(a) * 110} L ${960 + Math.cos(a) * 330} ${540 + Math.sin(a) * 300}`} k={W(tt, 1.8, 3.2)} w={7} />; })}
</Svg><Lbl tt={tt} at={1.2} x={960} y={150} tx="EL HIERRO OXIDADO SE HINCHA" bg={INK} /><Lbl tt={tt} at={3.2} x={960} y={950} tx="Y ROMPE DESDE ADENTRO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Alejate: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => { const f = eIn(tt, 0.8, 1.8); return <AbsoluteFill><Svg><Defs /><Ground y={920} x={120} w={1680} />
  <rect x={300} y={240} width={1000} height={70} fill="url(#conc)" stroke="#4a4a44" strokeWidth={6} /><rect x={300} y={160} width={1000} height={80} fill="none" stroke="#555" strokeWidth={8} />
  <path d={`M 860 ${310 + 600 * f} l 80 -10 l 30 50 l -90 30 z`} fill="#9a9a94" stroke="#4a4a44" strokeWidth={4} transform={`rotate(${f * 80},900,${330 + 600 * f})`} />
  <line x1={840} y1={300} x2={940} y2={300} stroke={RUST} strokeWidth={10} opacity={W(tt, 0.6, 1)} />
  <g transform={`translate(${lp(900, 1560, W(tt, 1.6, 3))},760)`}><circle cy={-120} r={40} fill="#c58e64" /><rect x={-40} y={-80} width={80} height={160} rx={30} fill="#3a6aa0" /></g>
</Svg><Lbl tt={tt} at={2.6} x={1500} y={480} tx="ALÉJATE DE DEBAJO" bg={RED} col={INK} /><Lbl tt={tt} at={3.4} x={1500} y={600} tx="Y LLAMA AL INGENIERO" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Calendario: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const a = tt * 60; return <AbsoluteFill><Svg><Defs />
  <g transform={`translate(760,540) rotate(${a})`}>{["LLUVIAS", "SECA", "LLUVIAS", "SECA"].map((n, i) => <g key={i} transform={`rotate(${i * 90})`}><path d="M 0 0 L 0 -300 A 300 300 0 0 1 300 0 Z" fill={i % 2 ? AMB : SKY} stroke="#1b1206" strokeWidth={5} /><T x={150} y={-110} tx={n} size={34} /></g>)}</g>
  <Plas x={1220} y={300} w={460} h={480} /><Crk d={stairs(1280, 340, 5, 60, 70)} k={0.3 + 0.7 * (0.5 + 0.5 * Math.sin(tt * 2))} w={10} /></Svg>
  <Lbl tt={tt} at={1.4} x={1450} y={880} tx="VUELVE CON LA ESTACIÓN" bg={RED} col={INK} /><Lbl tt={tt} at={2.6} x={960} y={110} tx="CAUSA 7 · LA QUE VUELVE" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Litros: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const n = Math.round(lp(0, 3000, W(tt, 1, 3.4))); return <AbsoluteFill><Svg><Defs />
  <path d="M 300 360 L 1100 360 L 1100 420 L 300 420 Z" fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} />{Array.from({ length: 16 }, (_, i) => <Drop key={i} x={330 + i * 50} y={200 + ((tt * 260 + i * 47) % 140)} s={0.6} />)}
  <Downpipe x={1080} y1={420} y2={860} /><rect x={1000} y={860} width={160} height={80} fill="url(#water)" stroke="#2e6d8c" strokeWidth={4} opacity={W(tt, 1, 2)} />
  <T x={1450} y={560} tx={n.toLocaleString("es")} size={150} col={SKY} /><T x={1450} y={640} tx="LITROS" size={60} col={INK} /></Svg>
  <Lbl tt={tt} at={0.6} x={700} y={280} tx="TECHO DE 100 M²" bg={INK} /><Lbl tt={tt} at={3.4} x={1080} y={1010} tx="EN UN SOLO METRO CUADRADO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Medio: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={300} y={160} width={820} height={620} fill="#d8cdb8" stroke="#5a4a36" strokeWidth={10} /><T x={710} y={480} tx="DORMITORIO" size={56} col="#5a4a36" />
  <rect x={1120} y={160} width={170} height={760} fill="url(#conc)" /><Crk d="M 1150 760 l 40 30 l 30 -10 l 60 40" k={W(tt, 1.4, 2.2)} w={7} />
  <circle cx={1200} cy={760} r={34} fill="#8a8f94" stroke="#3a3e42" strokeWidth={5} /><ellipse cx={1220} cy={800} rx={110 * W(tt, 0.4, 1.4)} ry={60 * W(tt, 0.4, 1.4)} fill="url(#water)" opacity={0.8} />
  <Arrow x1={1120} y1={880} x2={1200} y2={880} k={W(tt, 2.2, 2.8)} col={AMB} w={6} /></Svg>
  <Lbl tt={tt} at={2.6} x={1440} y={960} tx="A 50 CM DE LA ESQUINA" bg={AMB} /><Lbl tt={tt} at={3.4} x={1520} y={600} tx="ACERA ROTA, SIN PENDIENTE" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Donde: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["PEGADA A LA PARED", "EN UN CANTERO", "HACE CHARCO", "SE PIERDE"].map((n, i) => { const x = 520 + (i % 2) * 880, y = 360 + Math.floor(i / 2) * 330; return <Card key={i} x={x} y={y} w={760} h={260} s={P(tt, 0.4 + i * 0.7)}>
    <Plas x={-340} y={-100} w={120} h={200} /><Drop x={-200} y={60} s={1.2} /><T x={90} y={14} tx={n} size={42} /></Card>; })}
</Svg><Lbl tt={tt} at={3.4} x={960} y={130} tx="¿DÓNDE SALE EL AGUA?" bg={AMB} /></AbsoluteFill>}</Stage>;
const UnMetro: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const x = 240 + i * 760, far = i === 0; return <g key={i}><rect x={x} y={240} width={180} height={560} fill="url(#brick)" /><rect x={x + 180} y={700} width={500} height={100} fill="url(#soil)" />
    <ellipse cx={far ? x + 560 : x + 230} cy={700} rx={90 * W(tt, 0.6 + i, 1.4 + i)} ry={22} fill="url(#water)" />
    {far && <g opacity={W(tt, 1.2, 1.6)}><Arrow x1={x + 190} y1={640} x2={x + 520} y2={640} k={1} col={AMB} w={6} /><T x={x + 360} y={610} tx="+1 M" size={40} col={INK} /></g>}
    <Check x={x + 340} y={900} ok={far} s={P(tt, 1.6 + i)} /></g>; })}
</Svg><Lbl tt={tt} at={1.4} x={580} y={140} tx="LEJOS: BIEN" bg={GRN} /><Lbl tt={tt} at={2.4} x={1340} y={140} tx="PEGADA: LA ENCONTRASTE" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Pendiente: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const k = W(tt, 0.6, 1.8); return <AbsoluteFill><Svg><Defs /><Ground y={720} />
  <rect x={260} y={260} width={180} height={460} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <path d={`M 440 ${640} L 1600 ${640 + 60 * k} L 1600 720 L 440 720 Z`} fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} />
  <Level x={1020} y={600 + 30 * k} w={600} rot={2.9 * k} bub={k} />{[0, 1, 2].map((i) => <Drop key={i} x={lp(520, 1560, cl((tt * 0.5 + i * 0.33) % 1))} y={620 + 60 * cl((tt * 0.5 + i * 0.33) % 1)} s={0.7} />)}
</Svg><Lbl tt={tt} at={1.6} x={1020} y={430} tx="1 CM POR METRO" bg={AMB} /><Lbl tt={tt} at={2.6} x={1100} y={900} tx="PARA AFUERA, NUNCA A LA PARED" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Ramirez: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`translate(960,520) rotate(${-3 + 3 * P(tt, 0.2)})`} opacity={cl(P(tt, 0.2) * 2)}><rect x={-420} y={-360} width={840} height={720} rx={20} fill="#8a6a48" /><rect x={-380} y={-320} width={760} height={660} fill="#fbf8ef" />
    <rect x={-90} y={-390} width={180} height={60} rx={12} fill="#555" /><T x={0} y={-240} tx="ING. RAMÍREZ" size={46} hand />
    {["CIMIENTO: BIEN", "SE MOVIÓ POR EL AGUA", "SIN AGUA: QUIETO"].map((n, i) => <g key={i} opacity={W(tt, 1 + i * 0.9, 1.4 + i * 0.9)}><Check x={-290} y={-120 + i * 150} ok s={1} /><T x={-220} y={-104 + i * 150} tx={n} size={44} anchor="start" /></g>)}</g>
</Svg></AbsoluteFill>}</Stage>;
const Orden: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["LA CAUSA", "EL TESTIGO", "EL INGENIERO", "LA MASILLA"].map((n, i) => { const s = P(tt, 0.3 + i * 0.7); return <g key={i}><Card x={330 + i * 420} y={460} w={360} h={220} s={s} bg={i === 3 ? AMB : INK}><T x={0} y={-30} tx={String(i + 1)} size={80} col={RED} /><T x={0} y={60} tx={n} size={38} /></Card>
    {i < 3 && <Arrow x1={520 + i * 420} y1={460} x2={560 + i * 420} y2={460} k={W(tt, 0.7 + i * 0.7, 1 + i * 0.7)} col={AMB} w={8} />}</g>; })}
</Svg><Lbl tt={tt} at={3.4} x={960} y={780} tx="EL PINTOR EMPEZÓ AL REVÉS" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Veinte: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => { const k = W(tt, 0.8, 3.6); return <AbsoluteFill><Svg><Defs />
  <rect x={620} y={300} width={680} height={480} fill="#d8cdb8" stroke="#5a4a36" strokeWidth={10} /><T x={960} y={560} tx="LA CASA" size={56} col="#5a4a36" />
  <rect x={480} y={170} width={960} height={740} rx={40} fill="none" stroke={AMB} strokeWidth={10} pathLength={1} strokeDasharray={`${k} 1`} />
  <g transform="translate(1660,300)"><circle r={110} fill={INK} stroke="#1b1206" strokeWidth={6} /><path d={`M 0 0 L 0 -90 A 90 90 0 ${k > 0.5 ? 1 : 0} 1 ${90 * Math.sin(k * 2 * Math.PI)} ${-90 * Math.cos(k * 2 * Math.PI)} Z`} fill={AMB} /><T x={0} y={170} tx="20 MIN" size={46} col={INK} /></g>
</Svg><Lbl tt={tt} at={3.4} x={960} y={1000} tx="LA CAUSA ESTÁ EN OTRO LUGAR" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Bolita: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const r = eIn(tt, 0.8, 2.6); return <AbsoluteFill><Svg><Defs />
  <g transform="rotate(3,960,700)"><rect x={260} y={640} width={1400} height={60} fill="#c9b79a" stroke="#5a4a36" strokeWidth={5} />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={260 + i * 140} y1={640} x2={260 + i * 140} y2={700} stroke="#5a4a36" strokeWidth={3} />)}
    <Crk d="M 500 650 L 700 690 L 900 650 L 1100 690" k={W(tt, 0.2, 1)} w={5} /><circle cx={lp(500, 1600, r)} cy={612} r={28} fill="#5aa0e8" stroke="#1d4d80" strokeWidth={5} /></g>
</Svg><Lbl tt={tt} at={2.6} x={1460} y={500} tx="SIEMPRE A LA MISMA ESQUINA" bg={AMB} /><Lbl tt={tt} at={3.4} x={960} y={900} tx="ESA ESQUINA BAJÓ" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Arriba: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Plas x={300} y={340} w={1320} h={600} />
  <path d="M 260 300 L 1660 300 L 1640 380 L 280 380 Z" fill="#8a8f94" stroke="#3a3e42" strokeWidth={6} />
  {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={330 + i * 75} cy={300 - 10 * Math.sin(i)} rx={40} ry={18} fill={i % 3 ? "#7a5a1a" : "#5a7a2a"} opacity={W(tt, 0.3 + i * 0.05, 0.6 + i * 0.05)} transform={`rotate(${i * 23},${330 + i * 75},300)`} />)}
  {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${500 + i * 230} 380 q 10 ${120 + 60 * W(tt, 1.6, 2.6)} 0 ${240 * W(tt, 1.6, 2.6)}`} stroke={SKY} strokeWidth={14} fill="none" opacity={0.85} />)}
</Svg><Lbl tt={tt} at={1} x={960} y={200} tx="CANALETA TAPADA DE HOJAS" bg={INK} /><Lbl tt={tt} at={2.8} x={960} y={985} tx="REBALSA CONTRA LA PARED" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Arbol: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const d = W(tt, 1.2, 3); return <AbsoluteFill><Svg><Defs /><Ground y={600} />
  <House x={240} y={300} w={560} h={300} tilt={-1.2 * d} /><rect x={220} y={600} width={600} height={80} fill="url(#conc)" />
  <Tree x={1360} y={600} s={1.1} />{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M 1360 620 Q ${1200 - i * 50} ${700 + i * 30} ${800 + i * 30} ${700 + i * 40}`} stroke="#5a3a1a" strokeWidth={8} fill="none" opacity={W(tt, 0.4, 1.2)} />)}
  {[0, 1, 2].map((i) => <Drop key={i} x={lp(620, 1340, d) - i * 60} y={760 + i * 40} s={0.8} />)}
  <g opacity={W(tt, 0.6, 1)}><Arrow x1={820} y1={540} x2={1320} y2={540} k={1} col={AMB} w={6} /><T x={1070} y={510} tx="< 5-6 M" size={42} col={INK} /></g></Svg>
  <Lbl tt={tt} at={2.8} x={960} y={150} tx="EN LA SECA CHUPA EL AGUA" bg={AMB} /><Lbl tt={tt} at={3.6} x={960} y={1000} tx="LA ARCILLA SE ENCOGE" bg={INK} /></AbsoluteFill>; }}</Stage>;
const Foto: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => { const fl = cl(1 - Math.abs(tt - 2.2) * 4); return <AbsoluteFill><Svg><Defs /><Plas x={300} y={150} w={1320} h={780} />
  <Crk d={stairs(700, 260, 7, 70, 70)} k={1} w={10} /><Testigo x={980} y={480} />
  <g opacity={W(tt, 0.8, 1.2)}><rect x={1100} y={300} width={56} height={460} fill="#e9c22b" stroke="#6a5410" strokeWidth={4} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={1100} y1={320 + i * 36} x2={1128} y2={320 + i * 36} stroke="#222" strokeWidth={3} />)}</g>
  <rect x={0} y={0} width={1920} height={1080} fill="#fff" opacity={fl} /></Svg>
  <Lbl tt={tt} at={1.2} x={1440} y={260} tx="FECHA + REGLA" bg={INK} /><Lbl tt={tt} at={2.8} x={960} y={1010} tx="EN 4 SEMANAS, LA FOTO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Lista: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`translate(960,${lp(-400, 520, P(tt, 0.2))}) rotate(-2)`}><rect x={-440} y={-430} width={880} height={860} fill="#fbf6e2" stroke="#b9b2a0" strokeWidth={5} />
    <T x={0} y={-340} tx="PARA EL CORRALÓN" size={52} hand />
    {["CODO (100 o 63 mm)", "2 M DE CAÑO", "CANALETA DE PISO", "2 BOLSAS DE MEZCLA", "SELLADOR ELÁSTICO", "GUANTES · GAFAS · MASCARILLA"].map((n, i) => <g key={i} opacity={W(tt, 0.8 + i * 0.45, 1.1 + i * 0.45)}>
      <rect x={-380} y={-260 + i * 110} width={44} height={44} fill="none" stroke="#333" strokeWidth={5} /><path d={`M -372 ${-238 + i * 110} l 14 14 l 26 -30`} stroke={GRN} strokeWidth={8} fill="none" /><T x={-310} y={-224 + i * 110} tx={n} size={42} anchor="start" hand /></g>)}</g>
</Svg></AbsoluteFill>}</Stage>;
const Codo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const e = W(tt, 0.6, 1.6), fl = W(tt, 1.8, 3.2); return <AbsoluteFill><Svg><Defs /><Ground y={860} /><rect x={240} y={140} width={300} height={720} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <Downpipe x={600} y1={140} y2={800} elbow={e > 0.05 ? 900 * e : 0} />
  {fl > 0 && [0, 1, 2, 3].map((i) => <Drop key={i} x={700 + 900 * e * ((fl + i * 0.25) % 1)} y={830} s={0.7} />)}<ellipse cx={1580} cy={880} rx={140 * fl} ry={24} fill="url(#water)" />
  <g opacity={W(tt, 2.4, 2.8)}><Arrow x1={560} y1={980} x2={1560} y2={980} k={1} col={AMB} w={6} /></g></Svg>
  <Lbl tt={tt} at={1.2} x={760} y={700} tx="CORTE A 20 CM + CODO" bg={INK} /><Lbl tt={tt} at={2.8} x={1080} y={985} tx="1 A 1,5 M DE LA CASA" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Pozo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={560} />
  <rect x={300} y={200} width={360} height={360} fill="url(#brick)" /><rect x={300} y={560} width={360} height={120} fill="url(#conc)" />
  <rect x={760} y={560} width={260} height={380} fill="#2a1a0e" /><rect x={760} y={940 - 380 * W(tt, 0.6, 1.8)} width={260} height={380 * W(tt, 0.6, 1.8)} fill="url(#water)" />
  {[0, 1, 2].map((i) => <path key={i} d={`M 760 ${700 + i * 70} Q 700 ${720 + i * 70} 660 ${640 + i * 30}`} stroke={SKY} strokeWidth={10} fill="none" opacity={W(tt, 1.6, 2.4)} />)}
  <Xout x={720} y={500} w={340} h={480} k={W(tt, 2.6, 3.2)} /></Svg>
  <Lbl tt={tt} at={1} x={1350} y={360} tx="POZO CIEGO PEGADO" bg={INK} /><Lbl tt={tt} at={3.2} x={1350} y={800} tx="LO MISMO, PERO ESCONDIDO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const NoCaves: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const x = 220 + i * 780, ok = i === 0; return <g key={i}><rect x={x} y={580} width={700} height={500} fill="url(#soil)" /><rect x={x + 60} y={260} width={130} height={420} fill="url(#brick)" /><rect x={x + 30} y={680} width={190} height={60} fill="url(#conc)" />
    {ok ? <g opacity={W(tt, 0.4, 1.2)}><rect x={x + 190} y={560} width={420} height={30} fill="url(#conc)" /><path d={`M ${x + 300} 560 l 30 -40 l 40 30 l 30 -30`} stroke={CRK} strokeWidth={6} fill="none" /></g>
      : <path d={`M ${x + 190} 580 L ${x + 190} 800 Q ${x + 160} 820 ${x + 120} 760 L ${x + 400} 800 L ${x + 420} 580 Z`} fill="#1a0e06" opacity={W(tt, 1.4, 2.2)} />}
    <Check x={x + 450} y={360} ok={ok} s={P(tt, 1.2 + i * 1.2)} /></g>; })}
</Svg><Lbl tt={tt} at={1.2} x={570} y={140} tx="ROMPES LA ACERA" bg={GRN} /><Lbl tt={tt} at={2.4} x={1350} y={140} tx="NUNCA CAVES AL PIE" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Junta: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const s = W(tt, 0.8, 2); return <AbsoluteFill><Svg><Defs />
  <rect x={500} y={160} width={300} height={600} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} /><rect x={830} y={680} width={800} height={80} fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} />
  <rect x={800} y={680} width={30} height={80 * s} fill="#3a3a3a" /><path d={`M 1300 600 L ${1300 - 300 * s} ${640 + 40 * s}`} stroke="#d0d0c8" strokeWidth={40} strokeLinecap="round" />
  <Arrow x1={815} y1={900} x2={815} y2={780} k={W(tt, 2, 2.6)} col={AMB} w={8} /></Svg>
  <Lbl tt={tt} at={2.2} x={815} y={960} tx="1 CM + SELLADOR ELÁSTICO" bg={AMB} /><Lbl tt={tt} at={3.2} x={1300} y={300} tx="CON CEMENTO SE RAJA" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Esperar: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Plas x={300} y={150} w={1320} h={780} />
  <Crk d={stairs(640, 260, 7, 70, 70)} k={1} w={10} /><g opacity={W(tt, 0.4, 1)}><Testigo x={890} y={500} /></g>
  <g transform="translate(1380,420)" opacity={W(tt, 1.4, 1.8)}><rect x={-120} y={-60} width={240} height={120} rx={20} fill="#ddd" stroke="#555" strokeWidth={5} /><T x={0} y={14} tx="MASILLA" size={40} /></g>
  <Xout x={1240} y={340} w={280} h={160} k={W(tt, 2, 2.6)} /></Svg>
  <Lbl tt={tt} at={2.6} x={1380} y={620} tx="HOY NO SE TAPA" bg={RED} col={INK} /><Lbl tt={tt} at={3.4} x={960} y={1000} tx="TESTIGO, FECHA Y A ESPERAR" bg={INK} /></AbsoluteFill>}</Stage>;
const Testigos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <Plas x={220} y={240} w={700} h={560} /><Plas x={1000} y={240} w={700} h={560} />
  <Crk d="M 570 260 L 570 780" k={1} w={8} /><Crk d="M 1350 260 L 1350 780" k={1} w={8} />
  <Testigo x={570} y={500} broken={W(tt, 1, 1.8)} date="ANTES" rot={0} /><Testigo x={1350} y={500} date="DESPUÉS" rot={0} /></Svg>
  <Lbl tt={tt} at={1.6} x={570} y={900} tx="SE RAJÓ EN 3 SEMANAS" bg={RED} col={INK} /><Lbl tt={tt} at={2.8} x={1350} y={900} tx="ENTERO 1 AÑO" bg={GRN} /><Lbl tt={tt} at={3.6} x={960} y={130} tx="LA PRUEBA DE LA CAUSA" bg={AMB} /></AbsoluteFill>}</Stage>;
const Pieza: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const s = W(tt, 1.2, 2.6); return <AbsoluteFill><Svg><Defs /><Ground y={800} />
  <House x={260} y={360} w={700} h={440}><T x={610} y={600} tx="40 AÑOS" size={56} col="#5a4a36" /></House>
  <g transform={`translate(0,${18 * s})`}><Plas x={960} y={420} w={600} h={380} col="#f2ead8" /><rect x={940} y={380} width={640} height={40} fill="url(#conc)" /><T x={1260} y={630} tx="PIEZA NUEVA" size={50} col="#5a4a36" /></g>
  <Crk d="M 960 380 L 960 800" k={W(tt, 2, 3)} w={10} col={RED} /><Arrow x1={1260} y1={260} x2={1260} y2={360} k={W(tt, 1, 1.8)} col={AMB} /></Svg>
  <Lbl tt={tt} at={1.6} x={1360} y={190} tx="SE ESTÁ ASENTANDO" bg={AMB} /><Lbl tt={tt} at={3.2} x={960} y={980} tx="FALTÓ LA JUNTA" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Cuarenta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={760} /><House x={660} y={380} w={600} h={380} />
  {[["BAJADA NUEVA", 360, 300], ["CAÑO ROTO", 360, 640], ["ÁRBOL NUEVO", 1560, 300], ["PILETA", 1560, 640]].map(([n, x, y], i) => <Card key={i} x={x as number} y={y as number} w={380} h={100} s={P(tt, 0.6 + i * 0.6)} bg={AMB}><T x={0} y={14} tx={n as string} size={38} /></Card>)}
</Svg><Lbl tt={tt} at={3.2} x={960} y={150} tx="¿QUÉ CAMBIÓ AFUERA?" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Finita: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const y = Math.min(5, Math.floor(W(tt, 0.4, 3.4) * 6)); return <AbsoluteFill><Svg><Defs /><Plas x={300} y={150} w={1320} h={680} />
  <path d={stairs(560, 220, 8, 90, 70)} stroke={CRK} strokeWidth={3 + y * 4} fill="none" strokeLinejoin="round" />
  {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><circle cx={420 + i * 216} cy={930} r={22} fill={i <= y ? AMB : "#555"} /><T x={420 + i * 216} y={1000} tx={i === 0 ? "HOY" : `AÑO ${i}`} size={34} col={INK} /></g>)}
</Svg><Lbl tt={tt} at={3.4} x={960} y={110} tx="LA FINITA DE HOY ES LA GRANDE" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
const Errores: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  {["TAPAR SIN MIRAR", "MASILLA DURA", "CULPAR A LA PINTURA", "CAVAR AL PIE", "ESPERAR"].map((n, i) => { const s = P(tt, 0.3 + i * 0.5); return <Card key={i} x={960} y={200 + i * 160} w={900} h={120} s={s} bg={i === 4 ? RED : INK}>
    <T x={-380} y={20} tx={String(i + 1)} size={64} col={i === 4 ? INK : RED} /><T x={40} y={16} tx={n} size={50} col={i === 4 ? INK : NAVY} /></Card>; })}
</Svg></AbsoluteFill>}</Stage>;
const Dura: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const m = 0.5 + 0.5 * Math.sin(tt * 2.6); return <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const x = 240 + i * 760; return <g key={i}><Plas x={x} y={220} w={680} h={580} /><rect x={x + 320 - 12 * m} y={220} width={40 + 24 * m} height={580} fill={i === 0 ? "#f4f4f0" : "#7ac0e0"} stroke="#555" strokeWidth={3} />
    {i === 0 && <Crk d={`M ${x + 340} 240 L ${x + 330} 400 L ${x + 350} 560 L ${x + 336} 780`} k={W(tt, 1.6, 2.6)} w={7} col={RED} />}
    <Check x={x + 340} y={890} ok={i === 1} s={P(tt, 2.2 + i * 0.6)} /></g>; })}
</Svg><Lbl tt={tt} at={1} x={580} y={130} tx="DURA: SE RAJA AL MES" bg={RED} col={INK} /><Lbl tt={tt} at={2} x={1340} y={130} tx="ELÁSTICA: ESTIRA" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const DiezAnos: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const k = W(tt, 0.4, 3); return <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 10 }, (_, i) => { const hh = 50 * (i + 1) * cl(k * 10 - i); return <g key={i}><rect x={360 + i * 120} y={860 - hh} width={80} height={hh} rx={8} fill={i > 6 ? RED : AMB} /><T x={400 + i * 120} y={910} tx={`${i + 1}`} size={34} col={INK} /></g>; })}
  <T x={1640} y={400} tx="×10" size={160} col={RED} op={W(tt, 3, 3.6)} /><T x={1640} y={480} tx="EL ARREGLO" size={44} col={INK} op={W(tt, 3, 3.6)} /></Svg>
  <Lbl tt={tt} at={1} x={760} y={150} tx="1 MM POR AÑO" bg={INK} /><Lbl tt={tt} at={3.6} x={960} y={1010} tx="EL TESTIGO CUESTA MENOS QUE UN CAFÉ" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Lalo: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Card x={600} y={520} w={600} h={460} s={P(tt, 0.3)}><T x={0} y={-120} tx="LINDA HOY" size={64} /><Plas x={-200} y={-60} w={400} h={220} col="#f6efe0" /><T x={0} y={200} tx="vuelve en un año" size={40} hand col={RED} /></Card>
  <Card x={1320} y={520} w={600} h={460} s={P(tt, 1.2)} bg={AMB}><T x={0} y={-120} tx="BIEN" size={80} /><Testigo x={0} y={40} /><T x={0} y={200} tx="primero el testigo" size={40} hand /></Card>
  <Check x={1560} y={300} ok s={P(tt, 2.6)} /></Svg><Lbl tt={tt} at={3.2} x={960} y={950} tx="ELIJA" bg={INK} hand /></AbsoluteFill>}</Stage>;
const Estructural: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["MÁS DE 3-4 MM", "EN ESCALERA Y CRECE", "SE ABRE DE UN LADO", "PUERTAS · PISOS"].map((n, i) => { const x = 520 + (i % 2) * 880, y = 380 + Math.floor(i / 2) * 260; return <Card key={i} x={x} y={y} w={780} h={180} s={P(tt, 0.4 + i * 0.6)}>
    <T x={-320} y={22} tx={String(i + 1)} size={80} col={RED} /><T x={40} y={16} tx={n} size={44} /></Card>; })}
</Svg><Lbl tt={tt} at={3.2} x={960} y={150} tx="CON UNA: INGENIERO" bg={RED} col={INK} /><Lbl tt={tt} at={4} x={960} y={960} tx="DUDAS: TESTIGO 4 SEMANAS" bg={AMB} /></AbsoluteFill>}</Stage>;
const Vecino: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={200} y={200} width={760} height={700} fill="#cfe2c4" stroke="#3a5a20" strokeWidth={6} opacity={W(tt, 0.2, 0.8)} /><rect x={960} y={200} width={760} height={700} fill="#d8d8d8" stroke="#666" strokeWidth={6} />
  <line x1={960} y1={160} x2={960} y2={940} stroke={RED} strokeWidth={10} strokeDasharray="30 20" />
  {["CANALETAS", "ACERA", "CAÑOS", "CANTEROS"].map((n, i) => <g key={i} opacity={W(tt, 0.8 + i * 0.5, 1.1 + i * 0.5)}><Check x={320} y={330 + i * 140} ok s={0.8} /><T x={390} y={344 + i * 140} tx={n} size={44} anchor="start" /></g>)}
  <T x={1340} y={560} tx="EL VECINO" size={56} col="#555" /></Svg>
  <Lbl tt={tt} at={2.8} x={580} y={130} tx="LO DE TU LADO" bg={GRN} /><Lbl tt={tt} at={3.6} x={1340} y={990} tx="SE LO MUESTRAS CON EL BALDE" bg={AMB} /></AbsoluteFill>}</Stage>;
const Espuma: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const f = W(tt, 0.4, 1.6); return <AbsoluteFill><Svg><Defs />
  <g transform="translate(560,560) rotate(-14)"><rect x={-80} y={-260} width={160} height={440} rx={30} fill="#e0a020" stroke="#5a3a10" strokeWidth={6} /><rect x={-26} y={-320} width={52} height={70} fill="#333" /><T x={0} y={0} tx="ESPUMA" size={36} /></g>
  <Plas x={900} y={200} w={760} h={640} /><Crk d="M 1280 220 L 1280 820" k={1} w={10} />
  <path d={`M 1280 260 C ${1280 + 140 * f} 360 ${1280 - 140 * f} 520 1280 ${260 + 520 * f}`} stroke="#f2d070" strokeWidth={30 + 40 * f} fill="none" strokeLinecap="round" opacity={0.95} />
  <Xout x={1060} y={260} w={440} h={520} k={W(tt, 2.2, 2.8)} /></Svg>
  <Lbl tt={tt} at={1.8} x={420} y={900} tx="ES PARA MARCOS" bg={INK} /><Lbl tt={tt} at={3.2} x={1240} y={985} tx="GRIETA: MASILLA ELÁSTICA + MALLA" bg={AMB} /></AbsoluteFill>; }}</Stage>;
const Sismo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const k = W(tt, 0.2, 2); return <AbsoluteFill><Svg><Defs />
  <path d={"M 200 300 " + Array.from({ length: 60 }, (_, i) => `L ${200 + i * 26 * k} ${300 + (i > 20 && i < 40 ? 110 : 18) * Math.sin(i * 1.7)}`).join(" ")} stroke={RED} strokeWidth={6} fill="none" />
  <rect x={300} y={480} width={180} height={460} fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} /><Crk d="M 310 600 L 470 700" k={W(tt, 2, 2.6)} w={8} />
  <Plas x={1100} y={480} w={520} h={460} /><Crk d={web(1360, 700, 180, 5)} k={W(tt, 2.4, 3.2)} w={3} /></Svg>
  <Lbl tt={tt} at={2.6} x={420} y={985} tx="CON DIRECCIÓN: INGENIERO" bg={RED} col={INK} /><Lbl tt={tt} at={3.4} x={1360} y={985} tx="TELARAÑA: NORMAL" bg={GRN} /></AbsoluteFill>; }}</Stage>;
const Depto: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={360} y={100} width={480} height={900} fill="#bdb6a8" stroke="#555" strokeWidth={6} />{Array.from({ length: 24 }, (_, i) => <rect key={i} x={400 + (i % 4) * 110} y={130 + Math.floor(i / 4) * 140} width={70} height={90} fill={i === 5 ? AMB : "#9fd0ea"} />)}
  {["TELARAÑA", "VENTANA", "BAJO LA LOSA", "UNIONES"].map((n, i) => <Pill key={i} tt={tt} at={0.6 + i * 0.5} x={1340} y={220 + i * 130} w={560} tx={n} ok />)}
  <Pill tt={tt} at={2.8} x={1340} y={780} w={560} tx="CAUSA 7" ok={false} bg="#ddd" /></Svg>
  <Lbl tt={tt} at={3.4} x={1340} y={930} tx="NO HAY SUELO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
const Repaso: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["TELARAÑA", "REVOQUE"], ["VENTANA", "DINTEL"], ["ESCALERA", "INGENIERO"], ["BAJO EL TECHO", "LOSA AL SOL"], ["UNIÓN", "MALLA"], ["HIERRO", "INGENIERO YA"], ["LA QUE VUELVE", "EL AGUA"]].map(([a, b], i) => {
    const x = 330 + (i % 4) * 420, y = 330 + Math.floor(i / 4) * 380; const s = P(tt, 0.3 + i * 0.55); return <Card key={i} x={i < 4 ? x : x + 210} y={y} w={380} h={320} s={s} bg={i === 6 ? AMB : INK}>
      <T x={0} y={-70} tx={String(i + 1)} size={90} col={RED} /><T x={0} y={30} tx={a} size={40} /><T x={0} y={100} tx={b} size={32} col="#5a4a36" /></Card>; })}
</Svg></AbsoluteFill>}</Stage>;

export const MAP: Record<string, C> = {
  dosveces: DosVeces, tresmetros: TresMetros, aviso: Aviso, mapa: Mapa, treinta: Treinta, tres: Tres, suelos: Suelos, esponja: Esponja, losa: Losa,
  victima: Victima, tela: Tela, piel: Piel, direccion: Direccion, esquina: Esquina, dintel: Dintel, ampliacion: Ampliacion, apuntalar: Apuntalar,
  escalera: Escalera, apunta: Apunta, fuentes: Fuentes, ingeniero: Ingeniero, cajon: Cajon, reflectiva: Reflectiva, regla: Regla, dosmat: DosMat,
  malla: Malla, hierro: Hierro, hincha: Hincha, alejate: Alejate, calendario: Calendario, litros: Litros, medio: Medio, donde: Donde, unmetro: UnMetro,
  pendiente: Pendiente, ramirez: Ramirez, orden: Orden, veinte: Veinte, bolita: Bolita, arriba: Arriba, arbol: Arbol, foto: Foto, lista: Lista,
  codo: Codo, pozo: Pozo, nocaves: NoCaves, junta: Junta, esperar: Esperar, testigos: Testigos, pieza: Pieza, cuarenta: Cuarenta, finita: Finita,
  errores: Errores, dura: Dura, diezanos: DiezAnos, lalo: Lalo, estructural: Estructural, vecino: Vecino, espuma: Espuma, sismo: Sismo, depto: Depto,
  repaso: Repaso,
};
