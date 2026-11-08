// heroes.tsx · kit HuertoAnillado (sesD, hue5nc «Técnica del anillado»): componentes PROPIOS, uno por idea, dibujados como el OBJETO
// que la idea es (rama con su corte, corte transversal cáscara/capa viva/madera, navaja, mandarino, rueda del año, cuaderno…).
// Escenario = Stage de ckit (foto del momento desenfocada + mesa + cámara curva). Física con resorte (phys). Datos = los del guion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { cl, eio, FONT, H, HAND, phys, Stage } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const BARK = "#7a5634", BARKD = "#4a321d", CAMB = "#a6d86e", WOOD = "#f1e2c0", MAND = "#f39a1e", LEAF = "#3f8f3a", LEAFD = "#245e22",
  INK = "#fbf6ea", NAVY = "#1b2416", RED = "#e2452f", GRN = "#6cc46a", AMB = "#ffc23a", SKY = "#7cc4e8", SUG = "#ffd86b", GUM = "#d98a1e", SOIL = "#5b3a22";
const P = (tt: number, a: number, w = 7, z = 0.5) => phys(tt, a, w, z);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const W = (tt: number, a: number, b: number) => eio(tt, a, b);
const R = (n: number) => Array.from({ length: Math.max(0, n) }, (_, i) => i);

const Lbl: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; bg?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, tx, col = NAVY, bg = INK, size = 46, hand }) => {
  const s = P(tt, at, 8, 0.5); if (s <= 0.01) return null;
  const hw = (tx.length * (hand ? size * 1.3 : size) * 0.74 + 60) / 2; x = Math.min(Math.max(x, hw + 110), 1810 - hw);  // nunca se corta en el borde
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2.2),
    padding: hand ? "4px 18px" : "10px 26px", borderRadius: 14, background: hand ? "transparent" : bg, color: hand ? INK : col, fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: hand ? size * 1.3 : size,
    letterSpacing: hand ? 0 : 1.5, whiteSpace: "nowrap", boxShadow: hand ? "none" : "0 14px 34px rgba(0,0,0,.45)", textShadow: hand ? "0 6px 18px rgba(0,0,0,.8)" : "none" }}>{tx}</div>;
};
const Big: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; size?: number }> = ({ tt, at, x, y, tx, col = AMB, size = 190 }) => {
  const s = P(tt, at, 7, 0.42); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: "6px #1b1206", textShadow: "0 18px 40px rgba(0,0,0,.6)", lineHeight: 1, whiteSpace: "nowrap" } as React.CSSProperties}>{tx}</div>;
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>{children}</svg>;
const Defs = () => <defs>
  <linearGradient id="bark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a7048" /><stop offset=".45" stopColor={BARK} /><stop offset="1" stopColor={BARKD} /></linearGradient>
  <linearGradient id="barkv" x1="0" x2="1"><stop offset="0" stopColor={BARKD} /><stop offset=".5" stopColor="#94683f" /><stop offset="1" stopColor={BARKD} /></linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f7f9" /><stop offset=".5" stopColor="#b9c2c9" /><stop offset="1" stopColor="#7c868d" /></linearGradient>
  <radialGradient id="mand" cx=".35" cy=".35"><stop offset="0" stopColor="#ffd08a" /><stop offset=".5" stopColor={MAND} /><stop offset="1" stopColor="#c4600c" /></radialGradient>
  <radialGradient id="sun"><stop offset="0" stopColor="#fff6c0" /><stop offset=".6" stopColor="#ffd23a" /><stop offset="1" stopColor="#ff9a1a" /></radialGradient>
  <linearGradient id="glass" x1="0" x2="1"><stop offset="0" stopColor="rgba(220,240,255,.45)" /><stop offset=".5" stopColor="rgba(255,255,255,.15)" /><stop offset="1" stopColor="rgba(220,240,255,.4)" /></linearGradient>
  <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5233" /><stop offset="1" stopColor="#3b2414" /></linearGradient>
</defs>;
const T: React.FC<{ x: number; y: number; tx: string; size?: number; col?: string; anchor?: "start" | "middle" | "end"; hand?: boolean; op?: number }> = ({ x, y, tx, size = 44, col = NAVY, anchor = "middle", hand, op = 1 }) =>
  <text x={x} y={y} textAnchor={anchor} fontFamily={hand ? HAND : FONT} fontWeight={900} fontSize={size} fill={col} opacity={op}>{tx}</text>;
const Card: React.FC<{ x: number; y: number; w: number; h: number; s: number; children?: React.ReactNode; bg?: string; rot?: number }> = ({ x, y, w, h, s, children, bg = INK, rot = 0 }) => s <= 0.01 ? null :
  <g transform={`translate(${x},${y}) rotate(${rot * (1 - s)}) scale(${0.7 + 0.3 * s})`} opacity={cl(s * 2)}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={bg} stroke="rgba(0,0,0,.25)" strokeWidth={4} />{children}</g>;
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; col?: string; w?: number }> = ({ x1, y1, x2, y2, k, col = AMB, w = 10 }) => {
  if (k <= 0.01) return null; const x = lp(x1, x2, k), y = lp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={x} y2={y} stroke={col} strokeWidth={w} strokeLinecap="round" />
    <path d={`M ${x} ${y} l ${-34 * Math.cos(a - 0.45)} ${-34 * Math.sin(a - 0.45)} M ${x} ${y} l ${-34 * Math.cos(a + 0.45)} ${-34 * Math.sin(a + 0.45)}`} stroke={col} strokeWidth={w} strokeLinecap="round" /></g>;
};
const Check: React.FC<{ x: number; y: number; ok: boolean; s: number; r?: number }> = ({ x, y, ok, s, r = 40 }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${s * r / 40})`}>
  <circle r={40} fill={ok ? GRN : RED} stroke="#fff" strokeWidth={5} />{ok ? <path d="M -18 0 l 12 14 l 24 -28" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M -16 -16 l 32 32 M 16 -16 l -32 32" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}
</g>;
const XOut: React.FC<{ x: number; y: number; w: number; k: number }> = ({ x, y, w, k }) => k <= 0.01 ? null : <g stroke={RED} strokeWidth={16} strokeLinecap="round">
  <line x1={x - w / 2} y1={y - w / 2} x2={lp(x - w / 2, x + w / 2, cl(k * 2))} y2={lp(y - w / 2, y + w / 2, cl(k * 2))} />
  {k > 0.5 && <line x1={x + w / 2} y1={y - w / 2} x2={lp(x + w / 2, x - w / 2, cl(k * 2 - 1))} y2={lp(y - w / 2, y + w / 2, cl(k * 2 - 1))} />}</g>;

// ── objetos dibujados ─────────────────────────────────────────────────────────────────
// corte transversal: cáscara (marrón) · capa viva (verde) · madera (crema con anillos) · palm = haces sueltos sin capa
const XSec: React.FC<{ x: number; y: number; r: number; sx?: number; palm?: boolean }> = ({ x, y, r, sx = 1, palm }) => <g transform={`translate(${x},${y}) scale(${sx},1)`}>
  <circle r={r} fill={palm ? "#8c7a52" : BARK} stroke={BARKD} strokeWidth={6} />
  {!palm && <circle r={r * 0.87} fill={CAMB} />}
  <circle r={palm ? r * 0.92 : r * 0.8} fill={WOOD} />
  {palm ? R(46).map((i) => { const q = r * 0.84 * Math.sqrt((i + 1) / 46); return <circle key={i} cx={Math.cos(i * 2.4) * q} cy={Math.sin(i * 2.4) * q} r={r * 0.035} fill="#7a5a2c" />; })
    : [0.62, 0.45, 0.28, 0.12].map((k, i) => <circle key={i} r={r * k} fill="none" stroke="#d6bd88" strokeWidth={4} />)}
</g>;
// rama horizontal con textura de cáscara y su corte transversal a la izquierda
const Branch: React.FC<{ x0: number; x1: number; y: number; r: number; cap?: boolean; children?: React.ReactNode }> = ({ x0, x1, y, r, cap = true, children }) => <g>
  <rect x={x0} y={y - r} width={x1 - x0} height={2 * r} fill="url(#bark)" />
  {R(Math.floor((x1 - x0) / 46)).map((i) => <path key={i} d={`M ${x0 + 24 + i * 46} ${y - r + 8 + (i % 3) * 6} q 10 ${r * 0.5} 0 ${r * 1.6 - (i % 2) * 14}`} stroke={BARKD} strokeWidth={4} fill="none" opacity={0.5} />)}
  {cap && <XSec x={x0} y={y} r={r} sx={0.32} />}
  {children}
</g>;
// el corte del anillado visto de costado (frente = trazo que se dibuja; back = la media luna del otro lado, punteada)
const Cut: React.FC<{ x: number; y: number; r: number; k: number; w?: number; back?: boolean; col?: string }> = ({ x, y, r, k, w = 6, back, col = "#2a1608" }) => {
  const L = 2.3 * r;
  return <path d={`M ${x} ${y - r} Q ${x + r * 0.3} ${y} ${x} ${y + r}`} stroke={col} strokeWidth={w} fill="none" strokeDasharray={back ? "12 14" : `${L} ${L}`} strokeDashoffset={back ? 0 : L * (1 - k)} opacity={back ? 0.8 * cl(k * 3) : 1} strokeLinecap="round" />;
};
const Knife: React.FC<{ x: number; y: number; rot?: number; s?: number; saw?: boolean; cutter?: boolean }> = ({ x, y, rot = 0, s = 1, saw, cutter }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  {cutter ? <><path d="M 0 0 L 180 0 L 240 22 L 0 22 Z" fill="url(#steel)" stroke="#5a636a" strokeWidth={4} />{R(5).map((i) => <line key={i} x1={30 + i * 30} y1={0} x2={44 + i * 30} y2={22} stroke="#8a949b" strokeWidth={3} />)}
    <rect x={-210} y={-14} width={214} height={50} rx={12} fill="#f2c200" stroke="#7a6200" strokeWidth={4} /></>
    : <><path d={saw ? `M 0 0 L 260 -10 L 282 10 ${R(14).map((i) => `L ${268 - i * 19} ${18 + (i % 2) * 12}`).join(" ")} L 0 24 Z` : "M 0 0 L 250 -6 Q 292 6 250 26 L 0 24 Z"} fill="url(#steel)" stroke="#5a636a" strokeWidth={4} />
    <rect x={-170} y={-6} width={175} height={36} rx={16} fill={saw ? "#222" : "#8a5a2e"} stroke="#3a2410" strokeWidth={4} /></>}
</g>;
const Mand: React.FC<{ x: number; y: number; r?: number; op?: number }> = ({ x, y, r = 26, op = 1 }) => <g opacity={op}><circle cx={x} cy={y} r={r} fill="url(#mand)" stroke="#a24e08" strokeWidth={3} /><ellipse cx={x + r * 0.3} cy={y - r * 0.95} rx={r * 0.45} ry={r * 0.2} fill={LEAF} transform={`rotate(-25 ${x + r * 0.3} ${y - r * 0.95})`} /></g>;
const Bloom: React.FC<{ x: number; y: number; s?: number; op?: number }> = ({ x, y, s = 1, op = 1 }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
  {R(5).map((i) => <ellipse key={i} cx={0} cy={-16} rx={10} ry={17} fill="#fffdf6" stroke="#e3dccb" strokeWidth={2} transform={`rotate(${i * 72})`} />)}<circle r={8} fill="#f1d04a" /></g>;
// mandarino: tronco + copa; n = mandarinas, fl = flores, sick = 0 verde · 1 seco, prop = palo que lo sostiene, band = tira ancha sacada
const MTree: React.FC<{ x: number; y: number; s?: number; n?: number; fl?: number; sick?: number; prop?: boolean; band?: number }> = ({ x, y, s = 1, n = 0, fl = 0, sick = 0, prop, band = 0 }) => {
  const lf = `rgb(${lp(63, 150, sick)},${lp(143, 110, sick)},${lp(58, 50, sick)})`, lfd = `rgb(${lp(36, 110, sick)},${lp(94, 80, sick)},${lp(34, 40, sick)})`;
  const sp = [[-150, -380], [-60, -450], [60, -440], [150, -370], [-100, -300], [20, -330], [120, -290], [-180, -300], [0, -400], [-40, -260], [90, -470], [180, -320], [-130, -440], [60, -270]];
  return <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -26 0 L -20 -240 Q 0 -260 20 -240 L 26 0 Z" fill="url(#barkv)" />
    {band > 0 && <rect x={-24} y={-150} width={48} height={band} fill={WOOD} stroke="#c9a56a" strokeWidth={3} />}
    <circle cx={0} cy={-370} r={210} fill={lfd} /><circle cx={-90} cy={-330} r={140} fill={lf} /><circle cx={90} cy={-400} r={130} fill={lf} />
    {sp.slice(0, fl).map(([a, b], i) => <Bloom key={"f" + i} x={a} y={b} s={0.8} />)}
    {sp.slice(0, n).map(([a, b], i) => <Mand key={"m" + i} x={a} y={b + 10} r={24} />)}
    {prop && <path d="M 150 0 L 120 -300" stroke="#8a6a3a" strokeWidth={14} strokeLinecap="round" />}
  </g>;
};
const Ribbon: React.FC<{ x: number; y: number; s?: number; sw?: number }> = ({ x, y, s = 1, sw = 0 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-14} y={-34} width={28} height={68} rx={6} fill={RED} /><path d={`M 0 30 Q ${-20 + sw * 14} 90 ${-34 + sw * 20} 140 L ${-10 + sw * 20} 136 Q ${4 + sw * 10} 86 10 34 Z`} fill="#c22f1e" />
  <path d={`M 4 30 Q ${30 + sw * 10} 80 ${40 + sw * 16} 120 L ${58 + sw * 16} 112 Q ${40 + sw * 6} 70 18 30 Z`} fill={RED} /></g>;
const Bottle: React.FC<{ x: number; y: number; s?: number; rot?: number; tx?: string }> = ({ x, y, s = 1, rot = 0, tx = "70%" }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  <rect x={-70} y={-160} width={140} height={260} rx={30} fill="url(#glass)" stroke="rgba(255,255,255,.8)" strokeWidth={5} /><rect x={-66} y={-60} width={132} height={156} rx={24} fill="rgba(190,225,255,.5)" />
  <rect x={-30} y={-210} width={60} height={56} rx={8} fill="#2d6fb8" /><rect x={-58} y={-110} width={116} height={86} rx={10} fill={INK} /><T x={0} y={-52} tx={tx} size={44} /></g>;
const Cal: React.FC<{ x: number; y: number; s: number; top: string; big: string; col?: string; w?: number }> = ({ x, y, s, top, big, col = RED, w = 260 }) => <Card x={x} y={y} w={w} h={250} s={s} rot={-6}>
  <rect x={-w / 2} y={-125} width={w} height={70} rx={22} fill={col} /><T x={0} y={-76} tx={top} size={36} col={INK} /><T x={0} y={big.length > 3 ? 44 : 60} tx={big} size={big.length > 4 ? 48 : big.length > 3 ? 58 : 90} /></Card>;
const Sun: React.FC<{ x: number; y: number; r?: number; k?: number }> = ({ x, y, r = 80, k = 1 }) => <g transform={`translate(${x},${y}) scale(${k})`}>
  {R(12).map((i) => <rect key={i} x={-8} y={-r - 56} width={16} height={38} rx={8} fill="#ffd23a" transform={`rotate(${i * 30})`} />)}<circle r={r} fill="url(#sun)" /></g>;
const Drop: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = SKY }) => <path transform={`translate(${x},${y}) scale(${s})`} d="M 0 -40 C 20 -10, 30 6, 30 18 A 30 30 0 1 1 -30 18 C -30 6, -20 -10, 0 -40 Z" fill={col} stroke="#2e6d8c" strokeWidth={4} />;
const Ground: React.FC<{ y: number; x0?: number; x1?: number; deep?: number }> = ({ y, x0 = 200, x1 = 1720, deep = 260 }) => <g>
  <rect x={x0} y={y} width={x1 - x0} height={deep} rx={24} fill="url(#soil)" /><rect x={x0} y={y - 10} width={x1 - x0} height={22} rx={10} fill="#5f8f3a" /></g>;

// ── 62 componentes, en el orden del guion ────────────────────────────────────────────────
// 1 · cero: hace dos años, ni una; hoy, con palo para que no se raje
const Cero: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = W(tt, 2.6, 4.2);
  return <AbsoluteFill><Svg><Defs /><Ground y={900} deep={160} />
    <g opacity={1 - k * 0.7}><MTree x={600} y={900} s={0.95 * P(tt, 0.2)} /></g>
    <g opacity={cl(k * 1.5)}><MTree x={1320} y={900} s={0.95} n={14} prop /></g>
  </Svg><Big tt={tt} at={0.8} x={600} y={300} tx="0" col={INK} /><Lbl tt={tt} at={1.4} x={600} y={980} tx="HACE 2 AÑOS" bg={INK} /><Lbl tt={tt} at={3.6} x={1320} y={980} tx="HOY · CON PALO" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 2 · línea: la navaja da la vuelta y deja una sola línea fina
const Linea: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k = W(tt, 1.2, 4.0);
  return <AbsoluteFill><Svg><Defs /><Branch x0={260} x1={1760} y={560} r={150} />
    <Cut x={1000} y={560} r={150} k={k} w={7} />
    <Knife x={1010} y={lp(400, 720, k)} rot={-100 + k * 10} s={1.1} />
  </Svg><Lbl tt={tt} at={4.2} x={960} y={860} tx="UNA LÍNEA. NADA MÁS." bg={AMB} size={58} /></AbsoluteFill>;
}}</Stage>;
// 3 · leña: el corte ancho, las hojas se secan y el árbol queda en leños
const Lena: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const sk = W(tt, 1.4, 4.2), lg = P(tt, 4.4, 6);
  return <AbsoluteFill><Svg><Defs /><Ground y={900} deep={160} />
    <g opacity={1 - cl(lg)}><MTree x={720} y={900} sick={sk} band={70} /></g>
    {R(9).map((i) => <ellipse key={i} cx={560 + i * 40} cy={lp(560, 890, cl(sk * 1.6 - i * 0.08))} rx={18} ry={9} fill="#a07a3a" opacity={cl(sk * 3 - i * 0.2) * (1 - cl(lg))} />)}
    {lg > 0.01 && [0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${620 + (i % 3) * 110 + (i > 2 ? 55 : 0)},${880 - (i > 2 ? 80 : 0)}) scale(${lg})`}><rect x={-60} y={-38} width={120} height={76} rx={14} fill="url(#bark)" /><ellipse cx={60} cy={0} rx={22} ry={38} fill={WOOD} stroke={BARKD} strokeWidth={5} /></g>)}
  </Svg><Lbl tt={tt} at={0.8} x={1300} y={420} tx="ANCHO · DOS VUELTAS" bg={RED} col={INK} /><Lbl tt={tt} at={4.8} x={1300} y={560} tx="= LEÑA EN MESES" bg={INK} size={56} /></AbsoluteFill>;
}}</Stage>;
// 4 · siete pasos: siete marcas numeradas a lo largo de la rama
const Siete: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <Branch x0={160} x1={1820} y={600} r={90} />
  {R(7).map((i) => { const s = P(tt, 0.5 + i * 0.5, 9); const x = 330 + i * 225; return <g key={i}><Cut x={x} y={600} r={90} k={cl(s)} w={5} col={AMB} />
    <g transform={`translate(${x},${430}) scale(${s})`}><circle r={52} fill={i === 4 ? AMB : INK} stroke={NAVY} strokeWidth={6} /><T x={0} y={18} tx={String(i + 1)} size={56} /></g></g>; })}
</Svg><Lbl tt={tt} at={4.4} x={960} y={820} tx="7 PASOS · EL 5 ES EL SEGURO" bg={INK} /></AbsoluteFill>}</Stage>;
// 5 · los tres que nunca: tres siluetas tapadas con candado
const TresNunca: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1, 2].map((i) => { const s = P(tt, 0.4 + i * 0.6, 8); return <Card key={i} x={520 + i * 440} y={500} w={360} h={460} s={s} rot={-8 + i * 8} bg="#24301e">
    <circle cx={0} cy={-60} r={110} fill="#3d4f36" /><rect x={-14} y={30} width={28} height={130} fill="#3d4f36" />
    <g transform="translate(0,-60)"><rect x={-46} y={-10} width={92} height={74} rx={12} fill={AMB} /><path d="M -28 -10 v -26 a 28 28 0 0 1 56 0 v 26" stroke={AMB} strokeWidth={12} fill="none" /><T x={0} y={44} tx="?" size={52} /></g></Card>; })}
</Svg><Lbl tt={tt} at={2.6} x={960} y={880} tx="3 ÁRBOLES A LOS QUE NUNCA" bg={RED} col={INK} size={54} /></AbsoluteFill>}</Stage>;
// 6 · Morelos: Cuernavaca → Cuautla, 30 años de quintas y patios
const Morelos: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const k = W(tt, 1.6, 4.0);
  return <AbsoluteFill><Svg><Defs />
    <path d="M 640 300 C 820 220, 1080 240, 1240 300 C 1360 360, 1380 520, 1300 640 C 1200 780, 980 820, 820 760 C 660 700, 560 560, 580 440 Z" fill="#5f8f3a" stroke={INK} strokeWidth={8} opacity={cl(P(tt, 0.2))} />
    <path d="M 760 470 Q 960 380 1160 560" stroke={AMB} strokeWidth={10} fill="none" strokeDasharray="20 14" opacity={cl(k * 3)} />
    {([[760, 470, "CUERNAVACA", 0.6], [1160, 560, "CUAUTLA", 3.2]] as [number, number, string, number][]).map(([x, y, n, a], i) => { const s = P(tt, a, 9); return <g key={i} transform={`translate(${x},${y}) scale(${s})`}><path d="M 0 0 C -40 -50, -40 -90, 0 -100 C 40 -90, 40 -50, 0 0 Z" fill={RED} stroke="#fff" strokeWidth={5} /><circle cy={-66} r={14} fill="#fff" /><T x={0} y={60} tx={n} size={38} col={INK} /></g>; })}
  </Svg><Lbl tt={tt} at={4.2} x={960} y={900} tx="30 AÑOS EN QUINTAS Y PATIOS" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 7 · dos caminos: corte transversal grande con sus tres capas
const DosVias: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const s = P(tt, 0.3, 6);
  return <AbsoluteFill><Svg><Defs /><g transform={`translate(760,540) scale(${s})`}><XSec x={0} y={0} r={330} /></g>
    <Arrow x1={1300} y1={260} x2={1060} y2={300} k={W(tt, 1.4, 2.0)} col={INK} /><Arrow x1={1300} y1={520} x2={1040} y2={500} k={W(tt, 2.4, 3.0)} col={CAMB} /><Arrow x1={1300} y1={780} x2={900} y2={700} k={W(tt, 3.4, 4.0)} col={AMB} />
  </Svg><Lbl tt={tt} at={1.8} x={1500} y={250} tx="CÁSCARA" bg={INK} /><Lbl tt={tt} at={2.8} x={1500} y={520} tx="CAPA VIVA" bg={CAMB} /><Lbl tt={tt} at={3.8} x={1500} y={790} tx="MADERA" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 8 · sube el agua: tronco en corte, gotas que suben por la madera
const Sube: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={780} y={80} width={360} height={920} rx={40} fill={BARK} /><rect x={812} y={80} width={296} height={920} fill={CAMB} /><rect x={830} y={80} width={260} height={920} fill={WOOD} />
  {R(10).map((i) => { const k = ((tt * 0.35 + i / 10) % 1); return <Drop key={i} x={880 + (i % 3) * 80} y={980 - k * 880} s={0.8} col={SKY} />; })}
  <Arrow x1={1220} y1={880} x2={1220} y2={220} k={W(tt, 0.8, 2.4)} col={SKY} w={14} />
</Svg><Lbl tt={tt} at={1.6} x={1520} y={420} tx="EL AGUA SUBE POR LA MADERA" bg={SKY} size={40} /><Lbl tt={tt} at={3.4} x={1520} y={560} tx="ESO NO SE TOCA NUNCA" bg={RED} col={INK} size={40} /></AbsoluteFill>}</Stage>;
// 9 · baja el azúcar: la hoja con sol hace azúcar, que baja por debajo de la cáscara a la raíz
const Baja: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <Sun x={1540} y={180} k={P(tt, 0.2)} /><ellipse cx={1200} cy={230} rx={190} ry={80} fill={LEAF} transform="rotate(-18 1200 230)" />
  <rect x={780} y={200} width={360} height={680} rx={40} fill={BARK} /><rect x={812} y={200} width={296} height={680} fill={CAMB} /><rect x={830} y={200} width={260} height={680} fill={WOOD} />
  {R(14).map((i) => { const k = ((tt * 0.3 + i / 14) % 1); const side = i % 2; return <rect key={i} x={side ? 812 : 1090} y={220 + k * 640} width={18} height={18} rx={4} fill={SUG} stroke="#a07a10" strokeWidth={2} opacity={cl(tt - 0.6)} />; })}
  <Ground y={880} x0={520} x1={1400} deep={180} />{[-200, -90, 30, 140, 240].map((dx, i) => <path key={i} d={`M 960 890 q ${dx * 0.5} 70 ${dx} 150`} stroke="#d8c3a0" strokeWidth={8} fill="none" />)}
</Svg><Lbl tt={tt} at={1.6} x={420} y={420} tx="EL AZÚCAR BAJA POR LA CÁSCARA" bg={SUG} size={38} /><Lbl tt={tt} at={3.4} x={420} y={560} tx="LA COMIDA DE LA RAÍZ" bg={INK} size={38} /></AbsoluteFill>}</Stage>;
// 10 · el freno: el azúcar se junta arriba del corte y la rama arma flor
const Freno: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const pile = W(tt, 1.0, 4.0);
  return <AbsoluteFill><Svg><Defs /><Branch x0={200} x1={1760} y={640} r={110} cap={false}><Cut x={980} y={640} r={110} k={1} w={8} /></Branch>
    {R(16).map((i) => { const x0 = 1700 - ((tt * 220 + i * 90) % 760); const x = Math.max(x0, 1000 + (i % 5) * 22); return <rect key={i} x={x} y={600 + (i % 4) * 18} width={18} height={18} rx={4} fill={SUG} stroke="#a07a10" strokeWidth={2} opacity={cl(tt - 0.4)} />; })}
    {R(6).map((i) => <Bloom key={i} x={1100 + i * 110} y={lp(560, 470 - (i % 2) * 40, P(tt, 2.2 + i * 0.3))} s={P(tt, 2.2 + i * 0.3)} />)}
    <rect x={1000} y={540} width={lp(0, 160, pile)} height={18} rx={9} fill={AMB} />
  </Svg><Lbl tt={tt} at={1.4} x={600} y={420} tx="SE FRENA UNAS SEMANAS" bg={INK} /><Lbl tt={tt} at={3.6} x={1300} y={300} tx="MÁS COMIDA ARRIBA = FLOR" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 11 · se cierra solo: una tranquera en el camino del azúcar que se abre sola a las 4-6 semanas
const Callo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const op = W(tt, 3.0, 4.6);
  return <AbsoluteFill><Svg><Defs />
    <rect x={240} y={560} width={1440} height={110} rx={55} fill="#6b4a2c" /><rect x={240} y={604} width={1440} height={20} fill={SUG} opacity={0.4} />
    <g transform={`translate(960,520) rotate(${-op * 80} -60 0)`}><rect x={-60} y={0} width={20} height={190} fill={RED} /><rect x={-60} y={60} width={200} height={20} fill={RED} /><rect x={-60} y={120} width={200} height={20} fill={RED} /></g>
    {R(8).map((i) => { const x = 260 + ((tt * 200 + i * 180) % 1400); const stop = op < 0.5 && x > 880 && x < 960; return <rect key={i} x={stop ? 880 : x} y={596} width={30} height={30} rx={6} fill={SUG} stroke="#a07a10" strokeWidth={2} opacity={op < 0.5 && x > 960 ? 0 : 1} />; })}
    {["SEM 1", "SEM 2", "SEM 4", "SEM 6"].map((n, i) => <Cal key={n} x={420 + i * 360} y={300} s={P(tt, 0.4 + i * 0.7, 9)} top={n} big={i < 2 ? "FRENO" : "PASA"} col={i < 2 ? RED : "#3f8f3a"} w={240} />)}
  </Svg><Lbl tt={tt} at={4.4} x={960} y={860} tx="ES UN FRENO, NO UN CORTE PARA SIEMPRE" bg={INK} size={44} /></AbsoluteFill>;
}}</Stage>;
// 12 · no es de un día para otro: el reloj de 24 h tachado, la rueda del año sí
const Temporada: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s1 = P(tt, 0.3), s2 = P(tt, 2.2);
  return <AbsoluteFill><Svg><Defs />
    <g transform={`translate(560,480) scale(${s1})`}><circle r={190} fill={INK} stroke={NAVY} strokeWidth={10} />{R(12).map((i) => <rect key={i} x={-5} y={-176} width={10} height={26} fill={NAVY} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-130} stroke={NAVY} strokeWidth={10} transform={`rotate(${tt * 120})`} /><T x={0} y={90} tx="24 H" size={46} /></g>
    <XOut x={560} y={480} w={300} k={W(tt, 1.2, 1.9)} />
    <g transform={`translate(1360,480) scale(${s2})`}>{[GRN, AMB, MAND, SKY].map((c, i) => <g key={i} transform={`rotate(${i * 90})`}><path d="M 0 0 L 0 -200 A 200 200 0 0 1 200 0 Z" fill={c} stroke="#fff" strokeWidth={6} /></g>)}<circle r={70} fill={INK} /><T x={0} y={16} tx="1 AÑO" size={40} /></g>
  </Svg><Lbl tt={tt} at={2.8} x={1260} y={820} tx="ESTA TEMPORADA SE NOTA · LA OTRA, LA CARGA" bg={INK} size={38} /></AbsoluteFill>;
}}</Stage>;
// 13 · nueve de cada diez: diez arbolitos, nueve tienen otro problema
const Nueve: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  {R(10).map((i) => { const x = 360 + (i % 5) * 300, y = 470 + Math.floor(i / 5) * 300, s = P(tt, 0.2 + i * 0.12, 9), bad = i !== 7, k = W(tt, 2.2 + i * 0.1, 2.8 + i * 0.1);
    return <g key={i} transform={`translate(${x},${y}) scale(${s})`}><rect x={-10} y={0} width={20} height={70} fill={BARK} /><circle cy={-40} r={80} fill={bad ? `rgb(${lp(63, 200, k)},${lp(143, 140, k)},${lp(58, 40, k)})` : LEAF} />
      {!bad && <Knife x={-40} y={60} s={0.35} rot={-20} />}</g>; })}
</Svg><Lbl tt={tt} at={2.4} x={960} y={190} tx="9 DE 10: OTRO PROBLEMA" bg={AMB} size={58} /><Lbl tt={tt} at={3.8} x={960} y={970} tx="EL CORTE ES LO ÚLTIMO" bg={INK} /></AbsoluteFill>}</Stage>;
// 14 · seis a ocho horas: el sol cruza el patio y la barra de horas se llena
const SolHoras: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = W(tt, 0.6, 4.4), a = Math.PI * (1 - k);
  return <AbsoluteFill><Svg><Defs /><Ground y={860} deep={200} />
    <path d="M 300 860 A 660 520 0 0 1 1620 860" stroke="rgba(255,255,255,.35)" strokeWidth={6} fill="none" strokeDasharray="14 14" />
    <Sun x={960 + 660 * Math.cos(a)} y={860 - 520 * Math.sin(a)} r={60} />
    <MTree x={960} y={860} s={0.8} />
    <rect x={560} y={960} width={800} height={46} rx={23} fill="rgba(0,0,0,.4)" /><rect x={560} y={960} width={800 * k} height={46} rx={23} fill={AMB} />
    {[6, 8].map((n) => <line key={n} x1={560 + 800 * n / 10} y1={950} x2={560 + 800 * n / 10} y2={1016} stroke="#fff" strokeWidth={5} />)}
  </Svg><Lbl tt={tt} at={3.6} x={960} y={150} tx="6 A 8 HORAS DE SOL DIRECTO" bg={AMB} size={56} /></AbsoluteFill>;
}}</Stage>;
// 15 · de semilla: la regla de años, la fruta llega entre el 6 y el 10
const Semilla: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const k = W(tt, 0.6, 3.6);
  return <AbsoluteFill><Svg><Defs />
    <rect x={260} y={640} width={1400} height={30} rx={15} fill={INK} />
    {R(11).map((i) => <g key={i}><line x1={260 + i * 140} y1={620} x2={260 + i * 140} y2={690} stroke={INK} strokeWidth={6} /><T x={260 + i * 140} y={740} tx={String(i)} size={40} col={INK} /></g>)}
    <rect x={260 + 6 * 140} y={600} width={4 * 140} height={110} rx={20} fill={AMB} opacity={0.35 * cl(P(tt, 3.2))} />
    <g transform={`translate(${260 + 1400 * k},600) scale(${0.3 + 0.7 * k})`}><rect x={-8} y={-120} width={16} height={120} fill={BARK} /><circle cy={-170} r={80} fill={LEAF} />{k > 0.6 && <Mand x={30} y={-170} r={22} />}</g>
    <circle cx={260} cy={600} r={16} fill="#8a6a3a" />
  </Svg><Lbl tt={tt} at={3.4} x={1400} y={420} tx="DE SEMILLA: 6 A 10 AÑOS" bg={AMB} /><Lbl tt={tt} at={4.4} x={1400} y={880} tx="ES JOVEN, NO ESTÁ ENFERMO" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 16 · abono azul: el bolso azul cae, salen ramas larguísimas y ni una flor
const Azul: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const g = W(tt, 1.6, 4.4);
  return <AbsoluteFill><Svg><Defs /><Ground y={900} deep={160} />
    <g transform={`translate(420,${lp(200, 420, P(tt, 0.3))}) rotate(${lp(0, 30, W(tt, 0.8, 1.6))})`}><path d="M -120 -160 L 120 -160 L 140 160 L -140 160 Z" fill="#2d6fb8" stroke="#123d6b" strokeWidth={6} /><T x={0} y={40} tx="N" size={120} col={INK} /></g>
    {R(24).map((i) => <circle key={i} cx={560 + (i % 6) * 30} cy={lp(480, 890, cl(W(tt, 1.0, 2.2) - (i % 4) * 0.1))} r={8} fill="#7fb8ff" />)}
    <g transform="translate(1180,900)"><rect x={-20} y={-260} width={40} height={260} fill="url(#barkv)" />
      {[-70, -35, 0, 35, 70].map((a, i) => <path key={i} d={`M 0 -250 Q ${a * 2} ${-400 - 200 * g} ${a * 5} ${-420 - 300 * g}`} stroke={LEAF} strokeWidth={14} fill="none" />)}
      {R(14).map((i) => <ellipse key={i} cx={(i % 7 - 3) * 60 * (0.5 + g)} cy={-330 - Math.floor(i / 7) * 160 * g - (i % 3) * 40} rx={34} ry={16} fill={LEAF} />)}</g>
    <Bloom x={1560} y={300} s={2 * P(tt, 3.6)} /><XOut x={1560} y={300} w={120} k={W(tt, 4.0, 4.6)} />
  </Svg><Lbl tt={tt} at={4.6} x={1180} y={180} tx="PURA HOJA, NADA DE FLOR" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 17 · la flor sale de la ramita del año pasado: la tijera la corta
const Ramita: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const c = W(tt, 3.2, 3.8), fall = W(tt, 3.8, 5.2);
  return <AbsoluteFill><Svg><Defs /><Branch x0={160} x1={900} y={560} r={60} cap={false} />
    <path d="M 900 560 Q 1100 500 1300 540" stroke="#8a6a3a" strokeWidth={30} fill="none" strokeLinecap="round" />
    <g transform={`translate(0,${fall * 400}) rotate(${fall * 20} 1300 540)`}><path d="M 1300 540 Q 1500 560 1700 500" stroke="#8a6a3a" strokeWidth={18} fill="none" strokeLinecap="round" />
      {R(5).map((i) => <Bloom key={i} x={1380 + i * 70} y={520 - (i % 2) * 30} s={P(tt, 0.6 + i * 0.2)} />)}</g>
    <g transform={`translate(1320,${lp(260, 520, W(tt, 2.0, 3.2))})`}><path d={`M 0 0 L ${-60 + c * 40} 120 M 0 0 L ${60 - c * 40} 120`} stroke="#c8d0d6" strokeWidth={16} strokeLinecap="round" /><circle r={18} fill={RED} /></g>
  </Svg><Lbl tt={tt} at={1.0} x={1540} y={340} tx="RAMITA DEL AÑO PASADO" bg={INK} /><Lbl tt={tt} at={4.2} x={700} y={820} tx="PODA BONITA = SIN FLOR" bg={RED} col={INK} /></AbsoluteFill>;
}}</Stage>;
// 18 · sed o charco: en los dos casos tira la flor
const Sed: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const f = (i: number) => lp(420, 820, cl(W(tt, 1.4 + i * 0.25, 3.4 + i * 0.25)));
  return <AbsoluteFill><Svg><Defs />
    <rect x={180} y={840} width={680} height={160} rx={20} fill="#b89060" />{R(6).map((i) => <path key={i} d={`M ${240 + i * 110} 850 l 30 60 l -20 40`} stroke="#7a5a30" strokeWidth={5} fill="none" />)}
    <rect x={1060} y={840} width={680} height={160} rx={20} fill={SOIL} /><ellipse cx={1400} cy={850} rx={300} ry={36} fill={SKY} opacity={0.8} />
    {R(5).map((i) => <Bloom key={"a" + i} x={300 + i * 120} y={f(i)} s={0.9} />)}{R(5).map((i) => <Bloom key={"b" + i} x={1180 + i * 120} y={f(i + 1)} s={0.9} />)}
    <Sun x={520} y={240} r={60} k={P(tt, 0.3)} />{R(3).map((i) => <Drop key={i} x={1300 + i * 100} y={220 + ((tt * 140 + i * 60) % 200)} s={0.8} />)}
  </Svg><Lbl tt={tt} at={0.6} x={520} y={110} tx="SED" bg={AMB} size={56} /><Lbl tt={tt} at={0.9} x={1400} y={110} tx="CHARCO" bg={SKY} size={56} /><Lbl tt={tt} at={3.8} x={960} y={560} tx="RIEGO HONDO Y PAREJO" bg={GRN} size={54} /></AbsoluteFill>;
}}</Stage>;
// 19 · adulto: el arbolito crece en la regla de años hasta la marca de 4-5, en la tierra (en maceta no)
const Adulto: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const g = W(tt, 0.5, 3.6);
  return <AbsoluteFill><Svg><Defs /><Ground y={880} deep={180} />
    <MTree x={760} y={880} s={0.25 + 0.75 * g} />
    <rect x={1240} y={300} width={60} height={580} rx={14} fill={INK} />{R(7).map((i) => <g key={i}><line x1={1240} y1={880 - i * 90} x2={1320} y2={880 - i * 90} stroke={NAVY} strokeWidth={6} /><T x={1360} y={894 - i * 90} tx={`${i}`} size={40} col={INK} anchor="start" /></g>)}
    <rect x={1230} y={880 - 5 * 90 - 10} width={80} height={110} rx={10} fill={AMB} opacity={0.6 * cl(P(tt, 3.4))} />
    <g transform="translate(1620,800)" opacity={cl(P(tt, 4.2))}><path d="M -70 -90 L 70 -90 L 54 40 L -54 40 Z" fill="#c8663a" /><XOut x={0} y={-25} w={150} k={W(tt, 4.4, 5)} /></g>
  </Svg><Lbl tt={tt} at={3.6} x={760} y={160} tx="4-5 AÑOS · SANO · EN LA TIERRA" bg={AMB} size={50} /></AbsoluteFill>;
}}</Stage>;
// 20 · señales de un árbol débil: cuatro etiquetas alrededor del tronco
const Senales: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={900} deep={160} />
  <MTree x={960} y={900} s={0.9} sick={0.35} />
  <ellipse cx={972} cy={lp(760, 800, W(tt, 1, 3))} rx={10} ry={16} fill={GUM} />{R(5).map((i) => <circle key={i} cx={944 + (i % 2) * 20} cy={860 - ((tt * 60 + i * 30) % 200)} r={6} fill="#111" />)}
</Svg>{([["GOMITA ÁMBAR", 480, 380], ["HORMIGAS EN UN HUECO", 1440, 380], ["DESPUÉS DE UNA SEQUÍA", 480, 700], ["RECIÉN TRASPLANTADO", 1440, 700]] as [string, number, number][]).map(([n, x, y], i) =>
  <Lbl key={i} tt={tt} at={0.6 + i * 0.7} x={x} y={y} tx={n} bg={AMB} size={38} />)}<Lbl tt={tt} at={3.8} x={960} y={160} tx="NO LO TOQUES" bg={RED} col={INK} size={60} /></AbsoluteFill>}</Stage>;
// 21 · la prueba de la uña: la uña raspa y aparece el verde
const Una: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = W(tt, 1.2, 3.0);
  return <AbsoluteFill><Svg><Defs /><path d="M 100 600 Q 900 520 1820 560" stroke={BARK} strokeWidth={120} fill="none" strokeLinecap="round" />
    <ellipse cx={960} cy={548} rx={Math.max(1, 160 * k)} ry={34} fill={CAMB} stroke="#6aa03a" strokeWidth={4} />
    <g transform={`translate(${lp(800, 1120, k)},460) rotate(20)`}><path d="M -60 -220 L 60 -220 L 70 0 Q 0 40 -70 0 Z" fill="#e0b090" stroke="#9a6a4a" strokeWidth={5} /><path d="M -50 -6 Q 0 26 50 -6 L 46 -40 Q 0 -20 -46 -40 Z" fill="#f6e2d4" stroke="#c9a08a" strokeWidth={3} /></g>
  </Svg><Lbl tt={tt} at={3.2} x={960} y={800} tx="VERDE ABAJO = VIVO Y CON FUERZA" bg={CAMB} size={50} /></AbsoluteFill>;
}}</Stage>;
// 22 · del grosor de una escoba: el calibre entre 2 y 5 cm
const Escoba: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const k = W(tt, 1.2, 3.4), r = lp(40, 100, k);
  return <AbsoluteFill><Svg><Defs />
    <g transform="translate(560,520)"><rect x={-28} y={-380} width={56} height={600} rx={28} fill="#d9a85a" stroke="#8a6020" strokeWidth={5} /><path d="M -110 220 L 110 220 L 150 420 L -150 420 Z" fill="#c9a040" /></g>
    <XSec x={1200} y={520} r={r} />
    <g><rect x={1200 - r} y={300} width={12} height={150} fill="#c8d0d6" /><rect x={1200 + r - 12} y={300} width={12} height={150} fill="#c8d0d6" /><rect x={1200 - r} y={300} width={2 * r} height={20} fill="#c8d0d6" /></g>
  </Svg><Big tt={tt} at={0.6} x={1200} y={820} tx={`${Math.round(lp(2, 5, k))} CM`} size={120} /><Lbl tt={tt} at={3.6} x={960} y={150} tx="RAMA PRINCIPAL · NUNCA EL TRONCO" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 23 · la rama testigo: dos ramas iguales, la del trapito rojo no se toca
const Testigo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <Branch x0={160} x1={1760} y={360} r={70}><Cut x={900} y={360} r={70} k={W(tt, 0.6, 2.0)} w={6} /></Branch>
  <Branch x0={160} x1={1760} y={720} r={70} />
  <g transform={`translate(900,${790}) scale(${P(tt, 2.4)})`}><Ribbon x={0} y={0} sw={Math.sin(tt * 3)} /></g>
</Svg><Lbl tt={tt} at={1.4} x={1400} y={230} tx="CON CORTE" bg={AMB} /><Lbl tt={tt} at={2.8} x={1400} y={600} tx="TESTIGO · NO SE TOCA" bg={RED} col={INK} /><Lbl tt={tt} at={4.0} x={960} y={980} tx="MISMO TAMAÑO · MISMO LADO DEL SOL" bg={INK} size={40} /></AbsoluteFill>}</Stage>;
// 24 · del tamaño de un chícharo: caen los pétalos, quedan las bolitas
const Chicharo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = W(tt, 0.6, 2.6);
  return <AbsoluteFill><Svg><Defs /><path d="M 300 360 Q 900 300 1620 380" stroke="#8a6a3a" strokeWidth={22} fill="none" />
    {R(5).map((i) => <g key={i}><path d={`M ${460 + i * 240} 345 l 0 60`} stroke={LEAFD} strokeWidth={8} />
      {R(5).map((j) => <ellipse key={j} cx={460 + i * 240 + Math.cos(j * 1.26) * 26 + f * (j - 2) * 30} cy={lp(420, 800, cl(f * 1.3 - j * 0.06))} rx={12} ry={20} fill="#fffdf6" opacity={1 - f * 0.4} />)}
      <circle cx={460 + i * 240} cy={420} r={Math.max(0, 18 * P(tt, 2.4 + i * 0.12))} fill="#7fbf3a" stroke="#3a6a1a" strokeWidth={3} /></g>)}
    <g transform={`translate(1500,680) scale(${P(tt, 3.4)})`}><path d="M -110 0 Q 0 -60 110 0 Q 0 40 -110 0 Z" fill="#6aaa3a" /><circle cx={-50} cy={-6} r={18} fill="#8ad04a" /><circle cx={0} cy={-8} r={18} fill="#8ad04a" /><circle cx={50} cy={-6} r={18} fill="#8ad04a" /></g>
  </Svg><Lbl tt={tt} at={3.6} x={760} y={680} tx="BOLITAS COMO UN CHÍCHARO = TU DÍA" bg={AMB} size={46} /></AbsoluteFill>;
}}</Stage>;
// 25 · la rueda del año: dos ventanas buenas (al caer los pétalos · fin del verano)
const RuedaAno: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const s = P(tt, 0.2), nd = W(tt, 0.8, 4.4) * 300;
  const arc = (a0: number, a1: number, col: string, k: number) => { const r = 330, f = (a: number) => [960 + r * Math.sin(a * Math.PI / 180), 540 - r * Math.cos(a * Math.PI / 180)]; const [x0, y0] = f(a0), [x1, y1] = f(lp(a0, a1, k)); return k > 0.01 ? <path d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`} stroke={col} strokeWidth={60} fill="none" strokeLinecap="round" /> : null; };
  return <AbsoluteFill><Svg><Defs /><g transform={`translate(960,540) scale(${s}) translate(-960,-540)`}>
    <circle cx={960} cy={540} r={330} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={60} />
    {arc(30, 70, GRN, W(tt, 1.4, 2.2))}{arc(170, 215, AMB, W(tt, 2.8, 3.6))}
    {["PRIMAVERA", "VERANO", "OTOÑO", "INVIERNO"].map((n, i) => <T key={n} x={960 + 460 * Math.sin((i * 90 + 45) * Math.PI / 180)} y={556 - 460 * Math.cos((i * 90 + 45) * Math.PI / 180)} tx={n} size={36} col={INK} />)}
    <line x1={960} y1={540} x2={960 + 260 * Math.sin(nd * Math.PI / 180)} y2={540 - 260 * Math.cos(nd * Math.PI / 180)} stroke={INK} strokeWidth={12} strokeLinecap="round" /><circle cx={960} cy={540} r={24} fill={INK} /></g>
  </Svg><Lbl tt={tt} at={2.0} x={1560} y={140} tx="AL CAER LOS PÉTALOS" bg={GRN} size={40} /><Lbl tt={tt} at={3.4} x={380} y={960} tx="FIN DEL VERANO" bg={AMB} size={40} /></AbsoluteFill>;
}}</Stage>;
// 26 · nunca: frío, ola de calor o brote fuerte
const NuncaTres: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {([["INVIERNO", SKY], ["OLA DE CALOR", RED], ["BROTE FUERTE", GRN]] as [string, string][]).map(([n, c], i) => { const s = P(tt, 0.4 + i * 0.8, 8); return <Card key={i} x={480 + i * 480} y={500} w={400} h={460} s={s} rot={-6 + i * 6}>
    {i === 0 && R(6).map((j) => <line key={j} x1={0} y1={-60} x2={110 * Math.cos(j * 1.047)} y2={-60 + 110 * Math.sin(j * 1.047)} stroke={SKY} strokeWidth={14} strokeLinecap="round" />)}
    {i === 1 && <g><rect x={-20} y={-170} width={40} height={180} rx={20} fill="#eee" stroke="#999" strokeWidth={4} /><rect x={-10} y={-120} width={20} height={130} fill={RED} /><circle cy={30} r={40} fill={RED} /></g>}
    {i === 2 && R(5).map((j) => <path key={j} d={`M ${-80 + j * 40} 40 Q ${-60 + j * 40} -60 ${-60 + j * 40} -150`} stroke={GRN} strokeWidth={12} fill="none" />)}
    <rect x={-200} y={110} width={400} height={80} fill={c} /><T x={0} y={164} tx={n} size={40} col={INK} /><XOut x={0} y={-50} w={200} k={W(tt, 1.0 + i * 0.8, 1.6 + i * 0.8)} /></Card>; })}
</Svg><Lbl tt={tt} at={3.6} x={960} y={900} tx="MIRA TU ÁRBOL, NO EL CALENDARIO" bg={INK} /></AbsoluteFill>}</Stage>;
// 27 · navaja de injertar sí, cuchillo de sierrita no
const Navajas: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Knife x={420} y={lp(260, 440, P(tt, 0.3))} s={1.4} rot={-6} /><Knife x={1260} y={lp(260, 440, P(tt, 0.9))} s={1.4} rot={-6} saw />
  <Check x={600} y={680} ok s={P(tt, 1.8)} r={60} /><Check x={1440} y={680} ok={false} s={P(tt, 2.4)} r={60} />
</Svg><Lbl tt={tt} at={2.0} x={600} y={830} tx="FILO LISO · CORTA FINO" bg={GRN} /><Lbl tt={tt} at={2.8} x={1440} y={830} tx="SIERRITA · DESGARRA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 28 · alcohol de 70: la botella moja el trapito y limpia la hoja de los dos lados
const Setenta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fl = W(tt, 2.8, 3.4), wipe = Math.sin(tt * 5) * 120;
  return <AbsoluteFill><Svg><Defs /><Bottle x={480} y={500} s={1.3 * P(tt, 0.2)} rot={lp(0, 40, W(tt, 0.8, 1.6))} />
    <g transform={`translate(1160,520) scale(1,${lp(1, -1, fl)})`}><Knife x={-180} y={0} s={1.5} /></g>
    <g transform={`translate(${1260 + wipe},${510})`} opacity={cl(tt - 1.2)}><path d="M -90 -60 Q 0 -90 90 -60 L 100 60 Q 0 90 -100 60 Z" fill="#f2efe6" stroke="#c8c2b2" strokeWidth={4} /><ellipse cx={0} cy={0} rx={50} ry={26} fill="rgba(120,170,220,.4)" /></g>
  </Svg><Lbl tt={tt} at={1.4} x={480} y={860} tx="ALCOHOL DE FARMACIA" bg={INK} /><Lbl tt={tt} at={3.4} x={1260} y={800} tx="LOS DOS LADOS · ENTRE ÁRBOL Y ÁRBOL" bg={AMB} size={40} /></AbsoluteFill>;
}}</Stage>;
// 29 · el kit: navaja, trapito, alcohol y un gis. Y nada más
const Kit: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`translate(0,${lp(-500, 0, P(tt, 0.3, 7, 0.4))})`}><Knife x={300} y={700} s={1} rot={-4} /></g>
  <g transform={`translate(0,${lp(-500, 0, P(tt, 0.9, 7, 0.4))})`}><path d="M 760 640 Q 860 600 960 650 L 980 760 Q 860 790 750 760 Z" fill="#f2efe6" stroke="#c8c2b2" strokeWidth={4} /></g>
  <g transform={`translate(0,${lp(-500, 0, P(tt, 1.5, 7, 0.4))})`}><Bottle x={1240} y={620} s={0.8} /></g>
  <g transform={`translate(0,${lp(-500, 0, P(tt, 2.1, 7, 0.4))})`}><rect x={1480} y={700} width={220} height={44} rx={18} fill="#fbfbf4" stroke="#bbb" strokeWidth={4} transform="rotate(-12 1590 722)" /></g>
  {["NAVAJA", "TRAPITO", "ALCOHOL", "GIS"].map((n, i) => <T key={n} x={[420, 870, 1240, 1590][i]} y={880} tx={n} size={40} col={INK} op={cl(P(tt, 0.6 + i * 0.6))} />)}
</Svg><Lbl tt={tt} at={3.2} x={960} y={200} tx="NI PINTURA · NI CERA · NI CINTA" bg={INK} size={48} /></AbsoluteFill>}</Stage>;
// 30 · a 30-40 cm del tronco: la cinta métrica se estira y marca el lugar
const Altura: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = W(tt, 0.8, 3.0);
  return <AbsoluteFill><Svg><Defs /><rect x={260} y={80} width={220} height={1000} fill="url(#barkv)" />
    <Branch x0={470} x1={1800} y={520} r={90} cap={false}><Cut x={1110} y={520} r={90} k={W(tt, 3.2, 4.4)} w={7} /></Branch>
    <rect x={470} y={380} width={720 * k} height={56} fill="#f5d21a" stroke="#8a7000" strokeWidth={4} />
    {R(Math.floor(18 * k)).map((i) => <line key={i} x1={470 + i * 40} y1={380} x2={470 + i * 40} y2={i % 5 === 0 ? 420 : 404} stroke="#222" strokeWidth={3} />)}
    <rect x={1030} y={360} width={160} height={96} rx={8} fill="none" stroke={RED} strokeWidth={6} opacity={cl(P(tt, 3.0))} />
  </Svg><Big tt={tt} at={3.0} x={1110} y={260} tx="30-40 CM" size={110} /><Lbl tt={tt} at={4.2} x={1110} y={760} tx="DESDE DONDE SALE DEL TRONCO" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 31 · uno, dos milímetros: la lupa sobre la línea y la regla de milímetros
const Mm: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const z = P(tt, 1.0, 6);
  return <AbsoluteFill><Svg><Defs /><Branch x0={100} x1={1820} y={560} r={120} cap={false}><Cut x={700} y={560} r={120} k={1} w={3} /></Branch>
    <g transform={`translate(1200,520) scale(${z})`}><circle r={300} fill={BARK} stroke="#ddd" strokeWidth={26} />
      {R(14).map((i) => <path key={i} d={`M ${-260 + i * 40} -220 q 14 120 0 440`} stroke={BARKD} strokeWidth={6} fill="none" opacity={0.5} />)}
      <rect x={-12} y={-290} width={24} height={580} fill="#2a1608" /><rect x={-150} y={170} width={300} height={60} fill="#f5d21a" />{R(16).map((i) => <line key={i} x1={-150 + i * 20} y1={170} x2={-150 + i * 20} y2={i % 5 === 0 ? 214 : 196} stroke="#222" strokeWidth={4} />)}</g>
    <line x1={1410} y1={730} x2={1600} y2={940} stroke="#ddd" strokeWidth={40} strokeLinecap="round" opacity={cl(z)} />
  </Svg><Big tt={tt} at={2.2} x={1200} y={150} tx="1-2 MM" size={130} /><Lbl tt={tt} at={3.4} x={520} y={860} tx="COMO UN CORTE DE PAPEL" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 32 · nunca una tira ancha, nunca dos vueltas: muestras tachadas
const Tiras: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  {([["1 CM", 14], ["2 CM", 28], ["3 CM", 42], ["2 VUELTAS", 0], ["ESPIRAL", -1]] as [string, number][]).map(([n, w], i) => { const x = 300 + i * 330, s = P(tt, 0.3 + i * 0.5, 9); return <g key={i} transform={`translate(${x},520) scale(${s})`}>
    <rect x={-70} y={-260} width={140} height={520} rx={30} fill="url(#barkv)" />
    {w > 0 && <rect x={-70} y={-w * 2} width={140} height={w * 4} fill={WOOD} />}
    {w === 0 && <><rect x={-70} y={-60} width={140} height={10} fill="#2a1608" /><rect x={-70} y={40} width={140} height={10} fill="#2a1608" /></>}
    {w === -1 && <path d="M -70 -180 L 70 -90 M -70 -60 L 70 30 M -70 60 L 70 150" stroke="#2a1608" strokeWidth={10} />}
    <T x={0} y={330} tx={n} size={38} col={INK} /><XOut x={0} y={0} w={160} k={W(tt, 2.8 + i * 0.25, 3.3 + i * 0.25)} /></g>; })}
</Svg><Lbl tt={tt} at={4.4} x={960} y={140} tx="ESTO MATA · UNA LÍNEA, UNA VUELTA" bg={RED} col={INK} size={48} /></AbsoluteFill>}</Stage>;
// 33 · las dos medias lunas: media de este lado, la otra 10 cm más arriba del lado contrario
const Lunas: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k1 = W(tt, 0.8, 2.2), k2 = W(tt, 2.6, 3.8);
  return <AbsoluteFill><Svg><Defs /><Branch x0={160} x1={1760} y={560} r={150} />
    <path d="M 760 560 Q 805 640 760 710" stroke="#2a1608" strokeWidth={8} fill="none" strokeDasharray="200" strokeDashoffset={200 * (1 - k1)} />
    <path d="M 1160 410 Q 1205 480 1160 560" stroke="#2a1608" strokeWidth={8} fill="none" strokeDasharray="12 14" opacity={cl(k2 * 3)} />
    <line x1={760} y1={300} x2={lp(760, 1160, k2)} y2={300} stroke={AMB} strokeWidth={8} /><line x1={760} y1={280} x2={760} y2={320} stroke={AMB} strokeWidth={8} />
  </Svg><Lbl tt={tt} at={2.0} x={760} y={880} tx="MEDIA VUELTA DE ESTE LADO" bg={INK} size={40} /><Lbl tt={tt} at={3.8} x={960} y={220} tx="10 CM ARRIBA · DEL OTRO LADO" bg={AMB} size={44} /></AbsoluteFill>;
}}</Stage>;
// 34 · siempre queda un camino: la cáscara desenrollada, el azúcar zigzaguea entre las dos medias lunas
const Camino: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={560} y={100} width={800} height={880} rx={20} fill={BARK} stroke={BARKD} strokeWidth={8} />{R(9).map((i) => <path key={i} d={`M ${600 + i * 90} 120 q 14 400 0 840`} stroke={BARKD} strokeWidth={6} fill="none" opacity={0.5} />)}
  <rect x={560} y={680} width={400} height={16} fill="#2a1608" opacity={cl(P(tt, 0.4))} /><rect x={960} y={400} width={400} height={16} fill="#2a1608" opacity={cl(P(tt, 0.9))} />
  <path d="M 1160 120 L 1160 360 Q 1160 540 760 560 L 760 640 Q 760 760 1160 800 L 1160 960" stroke={SUG} strokeWidth={10} fill="none" strokeDasharray="22 18" strokeDashoffset={-tt * 120} opacity={cl(tt - 1.4)} />
</Svg><Lbl tt={tt} at={2.4} x={1640} y={500} tx="SIEMPRE HAY PASO" bg={SUG} /><Lbl tt={tt} at={3.4} x={1640} y={640} tx="LA RAÍZ SIGUE COMIENDO" bg={INK} size={36} /></AbsoluteFill>}</Stage>;
// 35 · no le pongas nada encima: pintura, cera, cinta y pasta tachadas
const NadaEncima: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {["PINTURA", "CERA", "CINTA", "PASTA"].map((n, i) => { const x = 380 + i * 390, s = P(tt, 0.3 + i * 0.4, 9); return <g key={n} transform={`translate(${x},500) scale(${s})`}>
    {i === 0 && <><rect x={-80} y={-100} width={160} height={180} rx={14} fill="#8a9aa8" /><rect x={-80} y={-100} width={160} height={40} fill="#d04a3a" /></>}
    {i === 1 && <rect x={-90} y={-60} width={180} height={120} rx={20} fill="#e8c860" />}
    {i === 2 && <><circle r={90} fill="#b8b8b0" /><circle r={46} fill="#2a2a2a" /></>}
    {i === 3 && <path d="M -90 60 L -60 -80 L 60 -80 L 90 60 Z" fill="#c8b8a0" />}
    <T x={0} y={170} tx={n} size={40} col={INK} /><XOut x={0} y={-10} w={190} k={W(tt, 2.0 + i * 0.3, 2.5 + i * 0.3)} /></g>; })}
</Svg><Lbl tt={tt} at={3.8} x={960} y={860} tx="EL CORTE SE SECA AL AIRE" bg={GRN} size={54} /></AbsoluteFill>}</Stage>;
// 36 · semana por semana: rayita oscura → cordoncito → callo cerrado
const Semanas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  {(["SEMANA 1", "SEMANA 2-3", "SEMANA 6"]).map((n, st) => { const s = P(tt, 0.4 + st * 1.2, 8); return <g key={st} transform={`translate(${400 + st * 560},500) scale(${s})`}>
    <rect x={-200} y={-170} width={400} height={340} rx={40} fill={BARK} />{R(6).map((j) => <path key={j} d={`M ${-170 + j * 64} -150 q 10 150 0 300`} stroke={BARKD} strokeWidth={5} fill="none" opacity={0.5} />)}
    {st === 0 && <rect x={-200} y={-4} width={400} height={8} fill="#1a0c04" />}
    {st === 1 && <><rect x={-200} y={-14} width={400} height={28} rx={14} fill="#b89a6a" /><rect x={-200} y={-3} width={400} height={6} fill="#2a1608" /></>}
    {st === 2 && <rect x={-200} y={-12} width={400} height={24} rx={12} fill="#a88a5a" opacity={0.8} />}
    <T x={0} y={240} tx={n} size={44} col={INK} /></g>; })}
</Svg><Lbl tt={tt} at={4.2} x={960} y={160} tx="EL CORDONCITO = EL CALLO QUE CIERRA" bg={AMB} size={46} /></AbsoluteFill>}</Stage>;
// 37 · alerta a las ocho semanas: hojas tristes arriba del corte y goma
const Alerta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const k = W(tt, 1.0, 3.4);
  return <AbsoluteFill><Svg><Defs /><Branch x0={160} x1={1760} y={560} r={90} cap={false}><Cut x={700} y={560} r={90} k={1} w={8} /></Branch>
    {R(9).map((i) => { const x = 820 + i * 100; return <ellipse key={i} cx={x} cy={lp(430, 470, k) + (i % 2) * 20} rx={44} ry={20} fill={`rgb(${lp(63, 220, k)},${lp(143, 190, k)},${lp(58, 60, k)})`} transform={`rotate(${lp(-20, 50, k)} ${x} 450)`} />; })}
    <ellipse cx={712} cy={lp(650, 720, W(tt, 2, 4))} rx={14} ry={22} fill={GUM} />
    <Cal x={360} y={300} s={P(tt, 0.3)} top="SEMANA 8" big="NO" />
  </Svg><Lbl tt={tt} at={3.4} x={1240} y={820} tx="ESA RAMA NO SE VUELVE A ANILLAR" bg={RED} col={INK} size={44} /></AbsoluteFill>;
}}</Stage>;
// 38 · cuéntalas: bolitas caídas bajo cada rama, el contador compara
const Cuenta: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const nA = Math.round(lp(0, 3, W(tt, 0.8, 3.6))), nT = Math.round(lp(0, 11, W(tt, 0.8, 3.6)));
  return <AbsoluteFill><Svg><Defs />
    <Branch x0={120} x1={860} y={300} r={50} cap={false}><Cut x={300} y={300} r={50} k={1} w={6} /></Branch><Branch x0={1060} x1={1800} y={300} r={50} cap={false} />
    <g transform="translate(1240,360)"><Ribbon x={0} y={0} s={0.6} /></g>
    {R(nA).map((i) => <circle key={"a" + i} cx={300 + i * 80} cy={820} r={20} fill="#7fbf3a" />)}{R(nT).map((i) => <circle key={"b" + i} cx={1160 + (i % 6) * 80} cy={820 - Math.floor(i / 6) * 50} r={20} fill="#7fbf3a" />)}
    <rect x={120} y={850} width={1680} height={20} rx={10} fill={SOIL} />
  </Svg><Big tt={tt} at={0.6} x={490} y={600} tx={String(nA)} size={150} col={GRN} /><Big tt={tt} at={0.6} x={1430} y={600} tx={String(nT)} size={150} col={RED} />
    <Lbl tt={tt} at={1.0} x={490} y={150} tx="ANILLADA" bg={AMB} /><Lbl tt={tt} at={1.4} x={1430} y={150} tx="TESTIGO" bg={RED} col={INK} /><Lbl tt={tt} at={4.0} x={960} y={970} tx="BOLITAS CAÍDAS" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 39 · un despertador, no un remedio: el reloj suena sobre la rama
const Despertador: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const on = cl(W(tt, 1.0, 1.4) - W(tt, 3.4, 3.8)), sh = Math.sin(tt * 40) * 6 * on;
  return <AbsoluteFill><Svg><Defs /><g transform={`translate(${960 + sh},460) scale(${P(tt, 0.2)})`}>
    <circle cx={-150} cy={-200} r={70} fill={RED} /><circle cx={150} cy={-200} r={70} fill={RED} /><circle r={240} fill={INK} stroke={RED} strokeWidth={30} />
    <line x1={0} y1={0} x2={0} y2={-160} stroke={NAVY} strokeWidth={14} strokeLinecap="round" /><line x1={0} y1={0} x2={110} y2={0} stroke={NAVY} strokeWidth={14} strokeLinecap="round" /><circle r={20} fill={NAVY} /></g>
    {R(3).map((i) => <path key={i} d={`M ${1260 + i * 40} ${300 - i * 30} q 40 60 0 120`} stroke={AMB} strokeWidth={10} fill="none" opacity={on} />)}
  </Svg><Lbl tt={tt} at={2.4} x={960} y={830} tx="1 RAMA · 1 AÑO" bg={AMB} size={60} /><Lbl tt={tt} at={3.6} x={960} y={950} tx="SI YA DESPERTÓ, NO HACE FALTA" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 40 · la piedra la noche anterior: la navaja va y viene y después corta el papel sin desgarrar
const Piedra: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const st = Math.sin(tt * 6) * 140 * (1 - W(tt, 2.8, 3.2)), cut = W(tt, 3.4, 4.6);
  return <AbsoluteFill><Svg><Defs /><rect x={560} y={640} width={800} height={110} rx={20} fill="#6a7078" /><rect x={560} y={640} width={800} height={30} rx={14} fill="#8a9098" />
    <g transform={`translate(${880 + st},${lp(610, 300, W(tt, 2.8, 3.4))}) rotate(${lp(-12, 70, W(tt, 2.8, 3.4))})`}><Knife x={0} y={0} s={1.1} /></g>
    <g opacity={cl(tt * 2 - 6)}><path d="M 1300 200 L 1700 200 L 1700 600 L 1300 600 Z" fill="#fbfbf4" stroke="#ccc" strokeWidth={3} /><line x1={1500} y1={200} x2={1500} y2={lp(200, 600, cut)} stroke="#9aa" strokeWidth={4} /></g>
  </Svg><Lbl tt={tt} at={1.0} x={960} y={880} tx="LA NOCHE ANTERIOR: RIEGO Y PIEDRA" bg={INK} size={44} /><Lbl tt={tt} at={4.6} x={1500} y={700} tx="CORTA EL PAPEL SIN DESGARRAR" bg={AMB} size={36} /></AbsoluteFill>;
}}</Stage>;
// 41 · el gis: palmo y medio desde el tronco, la media luna marcada
const Gis: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const p1 = P(tt, 0.6, 8), p2 = P(tt, 1.6, 8), mk = W(tt, 2.6, 3.8);
  return <AbsoluteFill><Svg><Defs /><rect x={180} y={80} width={220} height={1000} fill="url(#barkv)" />
    <Branch x0={390} x1={1800} y={560} r={110} cap={false}><path d="M 1110 450 Q 1150 520 1110 560" stroke="#fbfbf4" strokeWidth={14} fill="none" strokeDasharray="160" strokeDashoffset={160 * (1 - mk)} strokeLinecap="round" /></Branch>
    {([[400, p1, 1], [880, p2, 0.5]] as [number, number, number][]).map(([x, s, w], i) => <g key={i} transform={`translate(${x},380) scale(${s})`} opacity={cl(s * 2)}><path d={`M 0 0 Q ${240 * w} -80 ${480 * w} 0`} stroke={AMB} strokeWidth={14} fill="none" /><circle cx={0} cy={0} r={14} fill={AMB} /><circle cx={480 * w} cy={0} r={14} fill={AMB} /></g>)}
    <rect x={1080} y={lp(300, 430, mk)} width={140} height={36} rx={14} fill="#fbfbf4" transform={`rotate(-30 1150 ${lp(318, 448, mk)})`} />
  </Svg><Lbl tt={tt} at={2.2} x={880} y={260} tx="UN PALMO Y MEDIO" bg={AMB} /><Lbl tt={tt} at={4.0} x={1150} y={820} tx="MARCAS · CORTAS · PARAS EN LO DURO" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 42 · el cuaderno: se anota todo lo de ese día
const Cuaderno: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rows = ["FECHA", "QUÉ ÁRBOL", "QUÉ RAMAS", "¿VUELTA O MEDIAS LUNAS?", "BOLITAS O FLORES POR RAMA"];
  return <AbsoluteFill><Svg><Defs /><g transform={`translate(960,520) rotate(-3) scale(${P(tt, 0.2)})`}>
    <rect x={-480} y={-380} width={960} height={760} rx={16} fill="#fbf7e8" stroke="#c9bf9a" strokeWidth={6} />{R(10).map((i) => <line key={i} x1={-440} y1={-280 + i * 66} x2={440} y2={-280 + i * 66} stroke="#b6d0e8" strokeWidth={3} />)}
    <line x1={-380} y1={-380} x2={-380} y2={380} stroke="#e8a0a0" strokeWidth={4} />{R(8).map((i) => <circle key={i} cx={-450} cy={-320 + i * 92} r={12} fill="#555" />)}
    {rows.map((r, i) => <T key={r} x={-350} y={-232 + i * 132} tx={r} size={44} col="#2a3a8a" anchor="start" hand op={W(tt, 0.8 + i * 0.6, 1.2 + i * 0.6)} />)}</g>
  </Svg><Lbl tt={tt} at={4.4} x={1500} y={960} tx="EN 6 SEMANAS NO TE ACUERDAS" bg={AMB} size={40} /></AbsoluteFill>;
}}</Stage>;
// 43 · quince minutos de trabajo: el cronómetro y después mirar cada semana
const Quince: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const k = W(tt, 0.6, 3.0), a = Math.max(0.001, k) * Math.PI * 0.5;
  return <AbsoluteFill><Svg><Defs /><g transform={`translate(640,520) scale(${P(tt, 0.2)})`}><rect x={-30} y={-300} width={60} height={50} rx={10} fill="#999" /><circle r={250} fill={INK} stroke="#444" strokeWidth={26} />
    <path d={`M 0 0 L 0 -220 A 220 220 0 0 1 ${220 * Math.sin(a)} ${-220 * Math.cos(a)} Z`} fill={AMB} opacity={0.8} />
    <line x1={0} y1={0} x2={200 * Math.sin(a)} y2={-200 * Math.cos(a)} stroke={NAVY} strokeWidth={12} strokeLinecap="round" /></g>
    {R(6).map((i) => <Cal key={i} x={1180 + (i % 3) * 240} y={340 + Math.floor(i / 3) * 300} s={P(tt, 2.6 + i * 0.25, 9)} top={`SEM ${i + 1}`} big="MIRAR" col="#3f8f3a" w={210} />)}
  </Svg><Big tt={tt} at={1.4} x={640} y={900} tx="15 MIN" size={110} /><Lbl tt={tt} at={4.4} x={1420} y={960} tx="Y MIRAR CADA SEMANA AL REGAR" bg={INK} size={38} /></AbsoluteFill>;
}}</Stage>;
// 44 · Doña Chela: cuchillo de sierrita en el tronco, hondo, dos vueltas, hasta la madera
const Sierrita: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const k = W(tt, 0.8, 3.0);
  return <AbsoluteFill><Svg><Defs /><rect x={740} y={60} width={440} height={1020} fill="url(#barkv)" />
    {[460, 560].map((y, j) => <path key={j} d={`M 740 ${y} ${R(11).map((i) => `L ${740 + i * 44} ${y + (i % 2 ? 26 : -18)}`).join(" ")}`} stroke={WOOD} strokeWidth={22} fill="none" strokeDasharray="700" strokeDashoffset={700 * (1 - cl(k * 2 - j))} />)}
    <g transform={`translate(${lp(1300, 1000, k)},${lp(460, 560, k)})`}><Knife x={0} y={0} s={1.1} saw rot={180} /></g>
  </Svg><Lbl tt={tt} at={1.0} x={400} y={300} tx="EN EL TRONCO" bg={RED} col={INK} /><Lbl tt={tt} at={2.0} x={400} y={440} tx="HONDO · 2 VUELTAS" bg={RED} col={INK} /><Lbl tt={tt} at={3.2} x={1560} y={760} tx="LLEGÓ A LA MADERA" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 45 · la guayaba con malla: agua pareja, sombra, sin abono, casi un año
const Malla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const m = P(tt, 0.6, 6), g = W(tt, 2.4, 4.8);
  return <AbsoluteFill><Svg><Defs /><Ground y={900} deep={160} /><MTree x={960} y={900} s={0.9} sick={lp(0.6, 0, g)} />
    <g transform={`translate(0,${lp(-500, 0, m)})`}><path d="M 560 220 L 1360 220 L 1420 300 L 500 300 Z" fill="rgba(20,40,20,.55)" />{R(20).map((i) => <line key={i} x1={520 + i * 46} y1={220} x2={540 + i * 46} y2={300} stroke="rgba(255,255,255,.3)" strokeWidth={3} />)}
      <line x1={520} y1={300} x2={520} y2={900} stroke="#8a6a3a" strokeWidth={14} /><line x1={1400} y1={300} x2={1400} y2={900} stroke="#8a6a3a" strokeWidth={14} /></g>
    {R(4).map((i) => <Drop key={i} x={760 + i * 130} y={700 + ((tt * 120 + i * 50) % 180)} s={0.6} />)}
  </Svg><Lbl tt={tt} at={1.4} x={280} y={500} tx="SOMBRA EN LAS HORAS FUERTES" bg={INK} size={34} /><Lbl tt={tt} at={2.6} x={1660} y={500} tx="SIN ABONO" bg={INK} size={38} /><Lbl tt={tt} at={4.0} x={960} y={140} tx="CASI 1 AÑO PARA VOLVER" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 46 · error dos, cortar la madera: la navaja pasa la capa viva y el agua deja de subir
const Madera: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = W(tt, 0.8, 2.4), dry = W(tt, 2.8, 4.6);
  return <AbsoluteFill><Svg><Defs /><XSec x={700} y={560} r={320} />
    <path d={`M 380 560 L ${lp(381, 640, k)} 560`} stroke="#1a0c04" strokeWidth={20} strokeLinecap="round" /><Knife x={lp(120, 380, k)} y={548} s={1} rot={0} />
    {R(6).map((i) => { const y = 980 - ((tt * 160 + i * 140) % 840); return <Drop key={i} x={1380 + (i % 2) * 90} y={y} s={0.8} col={dry > 0.5 ? "#9a8a6a" : SKY} />; })}
    <XOut x={1420} y={540} w={260} k={W(tt, 2.6, 3.2)} />
  </Svg><Lbl tt={tt} at={1.6} x={700} y={130} tx="HASTA LO BLANCO = CORTAS EL AGUA" bg={RED} col={INK} size={42} /><Lbl tt={tt} at={3.8} x={700} y={980} tx="EN CUANTO SIENTES LO DURO, PARAS" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 47 · error cuatro: navaja sucia + cinta encima = hongo
const Hongo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const f = W(tt, 1.6, 4.0);
  return <AbsoluteFill><Svg><Defs /><Branch x0={160} x1={1760} y={560} r={130} cap={false} />
    <rect x={880} y={430} width={160} height={260} fill="#c9c0a8" opacity={cl(P(tt, 0.6))} />{R(6).map((i) => <line key={i} x1={880} y1={450 + i * 40} x2={1040} y2={450 + i * 40} stroke="#a8a088" strokeWidth={3} />)}
    {R(14).map((i) => <circle key={i} cx={880 + (i * 37) % 140 + (i % 3) * 10} cy={440 + (i * 53) % 240} r={Math.max(0, lp(0, 10 + (i % 4) * 6, cl(f * 1.4 - i * 0.04)))} fill={i % 2 ? "#e9eedf" : "#6a8a5a"} opacity={0.9} />)}
    <g transform="translate(300,300)"><Knife x={0} y={0} s={0.9} />{R(8).map((i) => <circle key={i} cx={20 + i * 28} cy={-10 + (i % 3) * 14} r={6} fill="#6a5a3a" />)}</g>
  </Svg><Lbl tt={tt} at={1.0} x={420} y={200} tx="SIN ALCOHOL" bg={RED} col={INK} /><Lbl tt={tt} at={2.0} x={960} y={860} tx="TAPADO = HUMEDAD = HONGO" bg={INK} /><Lbl tt={tt} at={4.0} x={1500} y={240} tx="LIMPIA · AL AIRE" bg={GRN} /></AbsoluteFill>;
}}</Stage>;
// 48 · error cinco: todo el árbol, todos los años → una cosecha enorme y después agotado
const Agotado: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs />
  <line x1={360} y1={820} x2={1560} y2={820} stroke={INK} strokeWidth={8} />
  {([[0.25, "AÑO 1", INK], [1, "AÑO 2", AMB], [0.08, "AÑO 3", RED]] as [number, string, string][]).map(([v, n, c], i) => { const k = W(tt, 0.6 + i * 1.0, 1.4 + i * 1.0); const hh = 560 * v * k; return <g key={i}>
    <rect x={480 + i * 380} y={820 - hh} width={220} height={Math.max(0, hh)} rx={14} fill={c} />
    {R(Math.round(8 * v * k)).map((j) => <Mand key={j} x={530 + i * 380 + (j % 3) * 60} y={790 - Math.floor(j / 3) * 60} r={24} />)}
    <T x={590 + i * 380} y={880} tx={n} size={40} col={INK} /></g>; })}
</Svg><Lbl tt={tt} at={3.4} x={1350} y={300} tx="AGOTADO, FLACO" bg={RED} col={INK} /><Lbl tt={tt} at={4.4} x={760} y={200} tx="1 RAMA · 1 AÑO · CON TESTIGO" bg={INK} size={42} /></AbsoluteFill>}</Stage>;
// 49 · a cuáles sí: los frutos en fila con su visto
const SiNo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const fr: [string, string, number][] = [["MANDARINA", MAND, 1], ["NARANJA", "#f28a12", 1], ["LIMÓN", "#9ad03a", 1], ["MANGO", "#f2b81a", 1], ["AGUACATE", "#4a7a2a", 1], ["LICHI", "#d8443a", 1], ["GUAYABA", "#c8d870", 0]];
  return <AbsoluteFill><Svg><Defs />{fr.map(([n, c, ok], i) => { const x = 240 + i * 240, s = P(tt, 0.3 + i * 0.35, 9); return <g key={n} transform={`translate(${x},480) scale(${s})`}>
    {n === "MANGO" || n === "AGUACATE" ? <ellipse rx={70} ry={92} fill={c} stroke="rgba(0,0,0,.3)" strokeWidth={4} /> : <circle r={78} fill={c} stroke="rgba(0,0,0,.3)" strokeWidth={4} />}
    <T x={0} y={160} tx={n} size={30} col={INK} />{ok ? <Check x={56} y={-70} ok s={P(tt, 1.2 + i * 0.35)} r={32} /> : <T x={0} y={-110} tx="A VECES" size={28} col={AMB} />}</g>; })}
  </Svg><Lbl tt={tt} at={3.8} x={960} y={850} tx="ADULTOS QUE NO CUAJAN" bg={GRN} size={52} /></AbsoluteFill>;
}}</Stage>;
// 50 · los de hueso lloran goma: el durazno con la gota color miel
const Hueso: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const g = W(tt, 1.0, 4.0);
  return <AbsoluteFill><Svg><Defs /><rect x={760} y={60} width={300} height={1020} fill="url(#barkv)" /><path d="M 900 420 l 40 30 l -30 30" stroke="#1a0c04" strokeWidth={8} fill="none" />
    <path d={`M 930 450 q 30 ${20 + 160 * g} 0 ${40 + 200 * g} q -30 -20 -10 ${-40 - 160 * g} Z`} fill={GUM} stroke="#9a5a10" strokeWidth={4} opacity={0.92} />
    <g transform={`translate(1460,460) scale(${P(tt, 0.4)})`}><circle r={130} fill="#f6a88a" /><path d="M 0 -130 Q 30 0 0 130" stroke="#d87a5a" strokeWidth={6} fill="none" /><ellipse cx={40} cy={-140} rx={50} ry={20} fill={LEAF} /></g>
  </Svg><Lbl tt={tt} at={2.0} x={1460} y={720} tx="DURAZNO · CIRUELO · CHABACANO" bg={INK} size={36} /><Lbl tt={tt} at={3.4} x={400} y={460} tx="DE HUESO: NUNCA" bg={RED} col={INK} size={52} /></AbsoluteFill>;
}}</Stage>;
// 51 · palmera, plátano, papaya: por dentro son distintos, no tienen cáscara y madera
const Palma: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`translate(560,500) scale(${P(tt, 0.3)})`}><XSec x={0} y={0} r={260} /></g><g transform={`translate(1360,500) scale(${P(tt, 1.2)})`}><XSec x={0} y={0} r={260} palm /></g>
  <XOut x={1360} y={500} w={240} k={W(tt, 2.8, 3.4)} />
</Svg><Lbl tt={tt} at={0.8} x={560} y={860} tx="ÁRBOL: CÁSCARA Y MADERA" bg={GRN} size={40} /><Lbl tt={tt} at={1.8} x={1360} y={860} tx="PALMERA · PLÁTANO · PAPAYA" bg={AMB} size={40} /><Lbl tt={tt} at={3.6} x={1360} y={980} tx="SÓLO SERÍA UNA HERIDA" bg={INK} size={36} /></AbsoluteFill>}</Stage>;
// 52 · Don Rubén: la planilla de lo que hacía, tachada y cambiada
const Ruben: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rows: [string, string][] = [["ABONO AZUL CADA MES", "NADA DE AZUL"], ["PODA CADA DICIEMBRE", "SIN PODA"], ["UN BALDE TODOS LOS DÍAS", "CUANDO ESTÉ SECA"]];
  return <AbsoluteFill><Svg><Defs />{rows.map(([a, b], i) => { const s = P(tt, 0.3 + i * 0.5, 9), x = W(tt, 2.4 + i * 0.4, 2.9 + i * 0.4), s2 = P(tt, 3.0 + i * 0.4, 9); return <g key={i}>
    <Card x={620} y={300 + i * 230} w={760} h={170} s={s}><T x={0} y={16} tx={a} size={44} />{x > 0.01 && <line x1={-340} y1={0} x2={lp(-340, 340, x)} y2={0} stroke={RED} strokeWidth={12} />}</Card>
    <Arrow x1={1040} y1={300 + i * 230} x2={1180} y2={300 + i * 230} k={cl(s2)} col={GRN} />
    <Card x={1500} y={300 + i * 230} w={560} h={170} s={s2} bg={GRN}><T x={0} y={16} tx={b} size={44} col={INK} /></Card></g>; })}
  </Svg><Lbl tt={tt} at={0.6} x={620} y={120} tx="LO QUE HACÍA DON RUBÉN" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 53 · tres ramas: dos con medias lunas, una con el trapito rojo
const TresRamas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={940} deep={140} />
  <path d="M 940 940 L 950 520" stroke={BARK} strokeWidth={90} />
  {([[-1, 360, 1], [1, 300, 1], [1, 460, 0]] as [number, number, number][]).map(([d, y, cut], i) => { const x2 = 950 + d * 560; return <g key={i}><path d={`M 950 ${y + 120} Q ${950 + d * 260} ${y + 40} ${x2} ${y}`} stroke={BARK} strokeWidth={46} fill="none" />
    {cut ? <><circle cx={950 + d * 300} cy={y + 50} r={Math.max(0, 22 * P(tt, 0.8 + i * 0.8))} fill="none" stroke="#fbfbf4" strokeWidth={8} /><circle cx={950 + d * 380} cy={y + 30} r={Math.max(0, 22 * P(tt, 1.2 + i * 0.8))} fill="none" stroke="#fbfbf4" strokeWidth={8} strokeDasharray="8 8" /></>
      : <g transform={`translate(${950 + d * 340},${y + 70}) scale(${0.6 * P(tt, 2.8)})`}><Ribbon x={0} y={0} sw={Math.sin(tt * 3)} /></g>}</g>; })}
</Svg><Lbl tt={tt} at={1.4} x={420} y={200} tx="MEDIAS LUNAS" bg={AMB} /><Lbl tt={tt} at={2.2} x={1500} y={160} tx="MEDIAS LUNAS" bg={AMB} /><Lbl tt={tt} at={3.2} x={1560} y={720} tx="TESTIGO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 54 · la bolsa de cada diciembre: las mandarinas caen a la bolsa de papel
const Bolsa: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  {R(12).map((i) => { const k = cl(W(tt, 0.6 + i * 0.25, 1.2 + i * 0.25)); return <Mand key={i} x={840 + (i % 4) * 80} y={lp(-80, 700 - Math.floor(i / 4) * 64, k)} r={34} op={k > 0 ? 1 : 0} />; })}
  <path d="M 760 520 L 1160 520 L 1200 900 L 720 900 Z" fill="#c8a06a" stroke="#8a6a3a" strokeWidth={6} /><path d="M 760 520 l 40 50 l 40 -50 l 40 50 l 40 -50 l 40 50 l 40 -50 l 40 50 l 40 -50 l 40 50 l 40 -50" fill="none" stroke="#8a6a3a" strokeWidth={5} />
  <Cal x={1500} y={420} s={P(tt, 2.4)} top="DICIEMBRE" big="1 BOLSA" col={RED} />
</Svg><Lbl tt={tt} at={3.8} x={960} y={160} tx="CADA DICIEMBRE, UNA BOLSA" bg={AMB} /></AbsoluteFill>}</Stage>;
// 55 · las reglas de Don Tomás en la pizarra
const Reglas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={360} y={140} width={1200} height={760} rx={20} fill="#26332a" stroke="#8a6a3a" strokeWidth={26} />
  {["1 · CONOCER EL ÁRBOL UNA TEMPORADA", "2 · SIEMPRE LA RAMA TESTIGO", "3 · NO TAPAR OTRO PROBLEMA"].map((r, i) => <T key={r} x={440} y={360 + i * 180} tx={r} size={54} col="#f2f2e6" anchor="start" hand op={W(tt, 0.6 + i * 1.1, 1.2 + i * 1.1)} />)}
</Svg><Lbl tt={tt} at={0.3} x={960} y={140} tx="LAS REGLAS DE DON TOMÁS" bg={AMB} /></AbsoluteFill>}</Stage>;
// 56 · si ya lo hiciste ancho: hasta 1 cm a veces el borde cierra; más ancho y seco, se corta más abajo
const Reparar: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const c = W(tt, 1.4, 4.0);
  return <AbsoluteFill><Svg><Defs />
    <g transform="translate(560,0)"><rect x={-90} y={80} width={180} height={1000} fill="url(#barkv)" /><rect x={-90} y={500} width={180} height={lp(60, 6, c)} fill={WOOD} /><rect x={-90} y={496} width={180} height={10 * c} fill="#a88a5a" /></g>
    <g transform="translate(1360,0)"><rect x={-90} y={80} width={180} height={1000} fill="url(#barkv)" /><rect x={-90} y={460} width={180} height={140} fill="#d8c8a0" />
      <line x1={-160} y1={760} x2={160} y2={760} stroke={RED} strokeWidth={10} strokeDasharray="20 12" opacity={cl(P(tt, 3.0))} /><Knife x={180} y={748} s={0.6} rot={180} /></g>
  </Svg><Lbl tt={tt} at={0.6} x={560} y={240} tx="HASTA 1 CM: A VECES CIERRA" bg={GRN} size={40} /><Lbl tt={tt} at={1.6} x={1360} y={240} tx="MUY ANCHO Y SECO" bg={RED} col={INK} size={40} /><Lbl tt={tt} at={3.4} x={1360} y={880} tx="CORTAR LIMPIO MÁS ABAJO" bg={INK} size={38} /></AbsoluteFill>;
}}</Stage>;
// 57 · cuánto tarda: dos carriles, según cuándo cortaste
const DosTiempos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {([["AL CAER LOS PÉTALOS", "ESTA TEMPORADA", GRN], ["FIN DEL VERANO", "FLOR DE LA PRIMAVERA", AMB]] as [string, string, string][]).map(([a, b, c], i) => { const k = W(tt, 0.8 + i * 1.4, 2.2 + i * 1.4); return <g key={i}>
    <Card x={460} y={360 + i * 340} w={620} h={150} s={P(tt, 0.3 + i * 1.4)} bg={c}><T x={0} y={16} tx={a} size={44} col={NAVY} /></Card>
    <Arrow x1={800} y1={360 + i * 340} x2={1120} y2={360 + i * 340} k={k} col={INK} w={14} />
    <Card x={1440} y={360 + i * 340} w={620} h={150} s={P(tt, 1.6 + i * 1.4)}><T x={0} y={16} tx={b} size={44} /></Card></g>; })}
</Svg><Lbl tt={tt} at={4.4} x={960} y={980} tx="NO ES DE UNA SEMANA" bg={RED} col={INK} size={44} /></AbsoluteFill>}</Stage>;
// 58 · herida chica y limpia vs grande y sucia
const Herida: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const c = W(tt, 1.6, 4.0);
  return <AbsoluteFill><Svg><Defs />
    <g transform="translate(560,520)"><rect x={-200} y={-300} width={400} height={600} rx={40} fill={BARK} /><rect x={-200} y={-4} width={400} height={lp(8, 0, c)} fill="#1a0c04" /><rect x={-200} y={-10} width={400} height={20 * c} rx={10} fill="#a88a5a" opacity={c} /></g>
    <g transform="translate(1360,520)"><rect x={-200} y={-300} width={400} height={600} rx={40} fill={BARK} /><path d="M -200 -80 L -100 -40 L 0 -110 L 100 -30 L 200 -90 L 200 80 L 100 40 L 0 120 L -100 50 L -200 90 Z" fill="#cbb890" />
      {R(9).map((i) => <circle key={i} cx={-160 + i * 40} cy={(i % 3) * 30 - 20} r={8 + 6 * c} fill="#5a6a4a" opacity={c} />)}</g>
  </Svg><Lbl tt={tt} at={0.6} x={560} y={140} tx="CHICA Y LIMPIA: CIERRA" bg={GRN} size={42} /><Lbl tt={tt} at={1.2} x={1360} y={140} tx="GRANDE Y SUCIA: NO" bg={RED} col={INK} size={42} /><Lbl tt={tt} at={3.8} x={960} y={960} tx="FINO · LIMPIO · UNA SOLA VEZ" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 59 · el cúter: hoja nueva, presión suave (la aguja en verde)
const Cuter: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const p = lp(-80, -20, W(tt, 1.6, 3.0)) + Math.sin(tt * 4) * 4;
  return <AbsoluteFill><Svg><Defs /><g transform={`translate(${lp(420, 520, P(tt, 0.3))},420) rotate(-10)`}><Knife x={0} y={0} s={1.6} cutter /></g>
    <g transform="translate(1340,640)"><path d="M -260 0 A 260 260 0 0 1 260 0" stroke="rgba(255,255,255,.2)" strokeWidth={60} fill="none" />
      <path d="M -260 0 A 260 260 0 0 1 -75 -249" stroke={GRN} strokeWidth={60} fill="none" /><path d="M 75 -249 A 260 260 0 0 1 260 0" stroke={RED} strokeWidth={60} fill="none" />
      <line x1={0} y1={0} x2={220 * Math.sin(p * Math.PI / 180)} y2={-220 * Math.cos(p * Math.PI / 180)} stroke={INK} strokeWidth={14} strokeLinecap="round" /><circle r={26} fill={INK} /></g>
  </Svg><Lbl tt={tt} at={0.8} x={560} y={700} tx="HOJA NUEVA · DESINFECTADA" bg={INK} /><Lbl tt={tt} at={2.6} x={1340} y={780} tx="SIN APRETAR DE MÁS" bg={GRN} /><Lbl tt={tt} at={3.6} x={1340} y={220} tx="ENTRA FÁCIL A LA MADERA" bg={RED} col={INK} size={38} /></AbsoluteFill>;
}}</Stage>;
// 60 · la guayaba de la vecina: comparar sol y agua antes que nada
const Vecinas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const bar = (x: number, y: number, v: number, c: string, a: number) => <g><rect x={x} y={y} width={300} height={36} rx={18} fill="rgba(0,0,0,.4)" /><rect x={x} y={y} width={300 * v * W(tt, a, a + 1)} height={36} rx={18} fill={c} /></g>;
  return <AbsoluteFill><Svg><Defs /><Ground y={760} deep={120} />
    <MTree x={560} y={760} s={0.7} n={12} /><MTree x={1360} y={760} s={0.7} />
    <Sun x={420} y={120} r={40} /><Sun x={1220} y={120} r={40} k={0.6} />
    {bar(410, 900, 0.9, AMB, 1.0)}{bar(1210, 900, 0.4, AMB, 1.4)}{bar(410, 960, 0.6, SKY, 2.0)}{bar(1210, 960, 0.95, SKY, 2.4)}
  </Svg><Lbl tt={tt} at={0.6} x={560} y={240} tx="LA DE LA VECINA" bg={GRN} size={40} /><Lbl tt={tt} at={0.9} x={1360} y={240} tx="LA TUYA" bg={INK} size={40} /><Lbl tt={tt} at={3.4} x={960} y={500} tx="SOL Y AGUA: AHÍ ESTÁ LA DIFERENCIA" bg={AMB} size={40} /></AbsoluteFill>;
}}</Stage>;
// 61 · el alambre: la rama engorda, el alambre se mete y no cierra
const Alambre: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const g = W(tt, 0.8, 4.4), r = lp(90, 150, g);
  return <AbsoluteFill><Svg><Defs />
    <path d={`M 160 ${560 - r} L 860 ${560 - r} Q 960 ${560 - r + 40 * g} 1060 ${560 - r} L 1760 ${560 - r} L 1760 ${560 + r} L 1060 ${560 + r} Q 960 ${560 + r - 40 * g} 860 ${560 + r} L 160 ${560 + r} Z`} fill="url(#bark)" />
    <rect x={948} y={560 - r + 30 * g} width={24} height={2 * r - 60 * g} rx={8} fill="#9aa4ab" stroke="#555" strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <T key={i} x={360 + i * 380} y={900} tx={`AÑO ${i + 1}`} size={36} col={INK} op={g > i / 4 ? 1 : 0.3} />)}
  </Svg><Lbl tt={tt} at={1.0} x={960} y={200} tx="¿UN ALAMBRE APRETADO? NO" bg={RED} col={INK} size={48} /><Lbl tt={tt} at={3.6} x={960} y={980} tx="SE METE EN LA CÁSCARA Y NO CIERRA" bg={INK} size={40} /></AbsoluteFill>;
}}</Stage>;
// 62 · repaso: siete fichas
const Repaso: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["ADULTO · SANO · EN TIERRA · UNA RAMA", "AL CAER PÉTALOS O FIN DEL VERANO", "NAVAJA AFILADA + ALCOHOL", "1-2 MM · UNA VUELTA · SÓLO CÁSCARA", "LA PRIMERA VEZ: MEDIAS LUNAS", "NADA ENCIMA · SIN ABONO FUERTE", "CONTAR CONTRA LA TESTIGO"].map((n, i) => {
    const s = P(tt, 0.4 + i * 1.1, 9), x = i < 4 ? 420 + i * 360 : 600 + (i - 4) * 360, y = i < 4 ? 400 : 720, cut = n.length > 20 ? n.lastIndexOf(" ", 20) : -1;
    return <Card key={n} x={x} y={y} w={340} h={250} s={s} rot={-6} bg={i === 4 ? "#ffe9b0" : INK}><rect x={-170} y={-125} width={340} height={60} rx={22} fill={BARK} /><T x={0} y={-80} tx={String(i + 1)} size={44} col={INK} />
      {(cut > 0 ? [n.slice(0, cut), n.slice(cut + 1)] : [n]).map((ln, j) => <T key={j} x={0} y={20 + j * 44} tx={ln} size={28} />)}</Card>; })}
</Svg></AbsoluteFill>}</Stage>;

export const MAP: Record<string, C> = {
  cero: Cero, linea: Linea, lena: Lena, siete: Siete, tresnunca: TresNunca, morelos: Morelos, dosvias: DosVias, sube: Sube, baja: Baja, freno: Freno,
  callo: Callo, temporada: Temporada, nueve: Nueve, solhoras: SolHoras, semilla: Semilla, azul: Azul, ramita: Ramita, sed: Sed, adulto: Adulto,
  senales: Senales, una: Una, escoba: Escoba, testigo: Testigo, chicharo: Chicharo, ruedaano: RuedaAno, nuncatres: NuncaTres, navajas: Navajas,
  setenta: Setenta, kit: Kit, altura: Altura, mm: Mm, tiras: Tiras, lunas: Lunas, camino: Camino, nadaencima: NadaEncima, semanas: Semanas,
  alerta: Alerta, cuenta: Cuenta, despertador: Despertador, piedra: Piedra, gis: Gis, cuaderno: Cuaderno, quince: Quince, sierrita: Sierrita,
  malla: Malla, madera: Madera, hongo: Hongo, agotado: Agotado, sino: SiNo, hueso: Hueso, palma: Palma, ruben: Ruben, tresramas: TresRamas,
  bolsa: Bolsa, reglas: Reglas, reparar: Reparar, dostiempos: DosTiempos, herida: Herida, cuter: Cuter, vecinas: Vecinas, alambre: Alambre, repaso: Repaso,
};
