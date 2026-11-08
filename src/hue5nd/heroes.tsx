// heroes.tsx · kit HuertoAlbahaca (sesD, hue5nd «Hasta la Albahaca Seca Revive»): componentes PROPIOS, uno por idea (mata que se cae y se para, prueba de la uña, inmersión con burbujas, escalera de abonos…).
// Escenario = Stage de ckit. Física con resorte (phys). Datos = los del guion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { cl, eio, FONT, H, HAND, Mode, phys, rnd, Stage } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const CLAY = "#c0683a", CLAYD = "#8a4524", MAG = "#c81e78", MAGL = "#ea4b9e", LEAF = "#3f8f3a", LEAFD = "#245e22", ASH = "#a9a59c", ASHD = "#6f6c65",
  INK = "#fbf6ea", NAVY = "#1b2416", RED = "#e2452f", GRN = "#6cc46a", AMB = "#ffc23a", SKY = "#7cc4e8", SOIL = "#5b3a22", SOILD = "#3b2414", YEL = "#d9c94a";
const P = (tt: number, a: number, w = 7, z = 0.5) => phys(tt, a, w, z);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const W = (tt: number, a: number, b: number) => eio(tt, a, b);
const R = (n: number) => Array.from({ length: Math.max(0, n) }, (_, i) => i);
const mk = (mode: Mode, f: (tt: number) => React.ReactNode): C => ({ t, h }) => <Stage t={t} h={h} mode={mode} mesa={false}>{(tt) => <AbsoluteFill>{f(tt)}</AbsoluteFill>}</Stage>;

const Lbl: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; bg?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, tx, col = NAVY, bg = INK, size = 46, hand }) => {
  const s = P(tt, at, 8, 0.5); if (s <= 0.01) return null;
  const hw = (tx.length * (hand ? size * 1.3 : size) * 0.74 + 60) / 2; x = Math.min(Math.max(x, hw + 110), 1810 - hw);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2.2),
    padding: hand ? "4px 18px" : "10px 26px", borderRadius: 14, background: hand ? "transparent" : bg, color: hand ? INK : col, fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: hand ? size * 1.3 : size,
    letterSpacing: hand ? 0 : 1.5, whiteSpace: "nowrap", boxShadow: hand ? "none" : "0 14px 34px rgba(0,0,0,.45)", textShadow: hand ? "0 6px 18px rgba(0,0,0,.8)" : "none" }}>{tx}</div>;
};
const Big: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; size?: number }> = ({ tt, at, x, y, tx, col = AMB, size = 190 }) => {
  const s = P(tt, at, 7, 0.42); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: "6px #1b1206", textShadow: "0 18px 40px rgba(0,0,0,.6)", lineHeight: 1, whiteSpace: "nowrap" } as React.CSSProperties}>{tx}</div>;
};
const Defs = () => <defs>
  <linearGradient id="clay" x1="0" x2="1"><stop offset="0" stopColor={CLAYD} /><stop offset=".45" stopColor="#d98052" /><stop offset="1" stopColor={CLAYD} /></linearGradient>
  <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5233" /><stop offset="1" stopColor={SOILD} /></linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f7f9" /><stop offset=".5" stopColor="#b9c2c9" /><stop offset="1" stopColor="#7c868d" /></linearGradient>
  <radialGradient id="sun"><stop offset="0" stopColor="#fff6c0" /><stop offset=".6" stopColor="#ffd23a" /><stop offset="1" stopColor="#ff9a1a" /></radialGradient>
  <linearGradient id="glass" x1="0" x2="1"><stop offset="0" stopColor="rgba(220,240,255,.45)" /><stop offset=".5" stopColor="rgba(255,255,255,.15)" /><stop offset="1" stopColor="rgba(220,240,255,.4)" /></linearGradient>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3ece0" /><stop offset="1" stopColor="#d8cdb8" /></linearGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5a2e" /><stop offset="1" stopColor="#5a3818" /></linearGradient>
</defs>;
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}><Defs />{children}</svg>;
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
// maceta de barro (x,y = centro de la base; la tierra queda en y = -290). cut = corte que deja ver la tierra
const Pot: React.FC<{ x: number; y: number; s?: number; cut?: boolean; hole?: boolean; children?: React.ReactNode }> = ({ x, y, s = 1, cut, hole = true, children }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  {children}
  {cut ? <><path d="M -150 -270 L -112 0 L 112 0 L 150 -270 Z" fill="url(#soil)" /><path d="M -150 -270 L -112 0 L -92 0 L -128 -270 Z M 150 -270 L 112 0 L 92 0 L 128 -270 Z" fill="url(#clay)" />
    <rect x={-112} y={-14} width={224} height={14} fill={CLAYD} />{hole && <rect x={-20} y={-14} width={40} height={14} fill="#120a05" />}
    <rect x={-168} y={-298} width={40} height={48} rx={6} fill={CLAY} /><rect x={128} y={-298} width={40} height={48} rx={6} fill={CLAY} /></>
    : <><path d="M -150 -250 L -112 0 L 112 0 L 150 -250 Z" fill="url(#clay)" /><rect x={-168} y={-288} width={336} height={48} rx={8} fill="#d17a4a" stroke={CLAYD} strokeWidth={4} /><ellipse cx={0} cy={-288} rx={150} ry={16} fill={SOILD} /></>}
</g>;
const Bract: React.FC<{ x: number; y: number; s?: number; col?: string; white?: boolean }> = ({ x, y, s = 1, col = MAG, white = true }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${s})`}>
  {[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d="M 0 0 C -24 -8, -24 -34, 0 -40 C 24 -34, 24 -8, 0 0 Z" fill={col} stroke="rgba(70,0,40,.45)" strokeWidth={2} />)}
  {white && <circle r={5} fill="#fffdf2" />}
</g>;
const Leaf: React.FC<{ x: number; y: number; r?: number; s?: number; col?: string }> = ({ x, y, r = 0, s = 1, col = LEAF }) => <path transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} d="M 0 0 C -18 -12, -18 -36, 0 -52 C 18 -36, 18 -12, 0 0 Z" fill={col} stroke={LEAFD} strokeWidth={2} />;
const SPOT = R(110).map((i) => { const h = rnd(i + 3), hw = 60 + 180 * Math.sin(Math.PI * Math.min(1, 0.12 + h * 0.8)); return { x: (rnd(i + 200) - 0.5) * 2 * hw, y: -40 - h * 560, h, r: rnd(i + 400) * 360 }; });
// bugambilia en mata. fl = cuánta flor (0-1) · low = hasta dónde baja (1 = hasta abajo, .15 = sólo la punta) · leaf = hoja (0-1.4)
const Bush: React.FC<{ x: number; y: number; s?: number; fl?: number; low?: number; leaf?: number; col?: string }> = ({ x, y, s = 1, fl = 1, low = 1, leaf = 1, col = MAG }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  {[-90, -40, 10, 60, 100].map((a, i) => <path key={i} d={`M ${a * 0.1} 0 Q ${a * 0.8} -240 ${a * 1.5} -${500 + (i % 2) * 70}`} stroke="#6a4a2a" strokeWidth={12} fill="none" strokeLinecap="round" />)}
  {SPOT.slice(0, Math.floor(70 * leaf)).map((p, i) => <Leaf key={i} x={p.x} y={p.y} r={p.r} s={0.9 + (leaf - 1) * 0.5} col={i % 3 ? LEAF : "#57a84a"} />)}
  {SPOT.map((p, i) => (p.h >= 1 - low && i / 110 < fl) ? <Bract key={"b" + i} x={p.x * 0.96} y={p.y} s={1.05} col={i % 4 ? col : MAGL} /> : null)}
</g>;
const Sun: React.FC<{ x: number; y: number; r?: number; k?: number }> = ({ x, y, r = 80, k = 1 }) => <g transform={`translate(${x},${y}) scale(${k})`}>
  {R(12).map((i) => <rect key={i} x={-8} y={-r - 56} width={16} height={38} rx={8} fill="#ffd23a" transform={`rotate(${i * 30})`} />)}<circle r={r} fill="url(#sun)" /></g>;
const Drop: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = SKY }) => <path transform={`translate(${x},${y}) scale(${s})`} d="M 0 -40 C 20 -10, 30 6, 30 18 A 30 30 0 1 1 -30 18 C -30 6, -20 -10, 0 -40 Z" fill={col} stroke="#2e6d8c" strokeWidth={4} />;
const Spoon: React.FC<{ x: number; y: number; s?: number; rot?: number; ash?: boolean; heap?: number }> = ({ x, y, s = 1, rot = 0, ash = true, heap = 1 }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  <rect x={70} y={-10} width={300} height={20} rx={10} fill="url(#steel)" stroke="#5a636a" strokeWidth={3} /><ellipse rx={92} ry={52} fill="url(#steel)" stroke="#5a636a" strokeWidth={4} />
  {ash && <path d={`M -70 0 Q 0 ${-90 * heap} 70 0 Q 0 30 -70 0 Z`} fill={ASH} stroke={ASHD} strokeWidth={3} />}</g>;
const Jar: React.FC<{ x: number; y: number; s?: number; lvl?: number; tx?: string }> = ({ x, y, s = 1, lvl = 0.65, tx }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-90} y={-250 * lvl} width={180} height={250 * lvl} rx={18} fill={ASH} /><rect x={-100} y={-280} width={200} height={290} rx={30} fill="url(#glass)" stroke="rgba(255,255,255,.85)" strokeWidth={5} />
  <rect x={-80} y={-326} width={160} height={50} rx={10} fill="#8a6a3a" stroke="#4a3518" strokeWidth={4} />{tx && <><rect x={-76} y={-170} width={152} height={70} rx={8} fill={INK} /><T x={0} y={-122} tx={tx} size={32} /></>}</g>;
const Plate: React.FC<{ x: number; y: number; s?: number; foam?: number; tt?: number }> = ({ x, y, s = 1, foam = 0, tt = 0 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <ellipse cx={0} cy={10} rx={230} ry={62} fill="#d8d3c5" /><ellipse rx={230} ry={58} fill="#fff" stroke="#c9c3b2" strokeWidth={4} /><ellipse rx={120} ry={32} fill={SOIL} />
  {foam > 0 && R(26).map((i) => { const a = rnd(i) * 6.28, r = rnd(i + 9) * 110, u = (tt * 1.6 + rnd(i + 20)) % 1; return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.3 - u * 44 * foam} r={(6 + rnd(i + 2) * 14) * foam} fill="rgba(255,255,255,.85)" stroke="#bfc8cc" strokeWidth={2} opacity={1 - u * 0.6} />; })}</g>;
const Shears: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number }> = ({ x, y, s = 1, rot = 0, o = 0.3 }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  <g transform={`rotate(${-o * 24})`}><path d="M 0 0 L 170 -18 L 190 2 L 0 22 Z" fill="url(#steel)" stroke="#5a636a" strokeWidth={4} /><rect x={-190} y={-8} width={196} height={30} rx={14} fill={RED} /></g>
  <g transform={`rotate(${o * 24})`}><path d="M 0 -22 L 190 -2 L 170 18 L 0 0 Z" fill="url(#steel)" stroke="#5a636a" strokeWidth={4} /><rect x={-190} y={-22} width={196} height={30} rx={14} fill="#b8341f" /></g><circle r={12} fill="#39424a" /></g>;
const Wall: React.FC<{ y?: number }> = ({ y = 900 }) => <g><rect x={200} y={140} width={1520} height={y - 140} rx={18} fill="url(#wall)" /><rect x={200} y={y - 6} width={1520} height={70} rx={10} fill="#8c7d67" />{R(5).map((i) => <line key={i} x1={200} x2={1720} y1={290 + i * 150} y2={290 + i * 150} stroke="#d0c4ad" strokeWidth={3} />)}</g>;
const Bag: React.FC<{ x: number; y: number; s?: number; col?: string; tx: string; sub?: string }> = ({ x, y, s = 1, col = "#3f8f3a", tx, sub }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M -140 -200 L 140 -200 L 160 200 L -160 200 Z" fill={col} stroke="rgba(0,0,0,.4)" strokeWidth={5} /><path d="M -140 -200 Q 0 -240 140 -200" fill={col} stroke="rgba(0,0,0,.4)" strokeWidth={5} /><rect x={-120} y={-90} width={240} height={150} rx={12} fill={INK} /><T x={0} y={-6} tx={tx} size={46} />{sub && <T x={0} y={44} tx={sub} size={28} col="#555" />}</g>;
const Cup: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}><path d="M -70 -80 L 70 -80 L 54 60 L -54 60 Z" fill={INK} stroke="#a79b83" strokeWidth={4} /><ellipse cy={-80} rx={70} ry={14} fill="#3a2212" /><path d="M 68 -50 q 56 8 46 50 q -10 34 -52 26" fill="none" stroke={INK} strokeWidth={16} /></g>;
const Cal: React.FC<{ x: number; y: number; s: number; top: string; big: string; col?: string; w?: number }> = ({ x, y, s, top, big, col = RED, w = 280 }) => <Card x={x} y={y} w={w} h={250} s={s} rot={-6}>
  <rect x={-w / 2} y={-125} width={w} height={70} rx={22} fill={col} /><T x={0} y={-76} tx={top} size={36} col={INK} /><T x={0} y={big.length > 3 ? 44 : 60} tx={big} size={big.length > 6 ? 40 : big.length > 4 ? 48 : big.length > 3 ? 58 : 90} /></Card>;
// rama horizontal
const Rama: React.FC<{ x0: number; x1: number; y: number; children?: React.ReactNode }> = ({ x0, x1, y, children }) => <g>
  <rect x={x0} y={y - 11} width={x1 - x0} height={22} rx={11} fill="#6a4a2a" stroke="#3f2b16" strokeWidth={3} />{children}</g>;
// tarjetas con texto en fila; ok = tilde o cruz
const Fila: React.FC<{ tt: number; at: number; y: number; x?: number; w?: number; tx: string; ok?: boolean; size?: number }> = ({ tt, at, y, x = 960, w = 1200, tx, ok, size = 54 }) => <Card x={x} y={y} w={w} h={120} s={P(tt, at, 9)} rot={2}><T x={-w / 2 + 40} y={20} tx={tx} size={size} anchor="start" />{ok !== undefined && <Check x={w / 2 - 80} y={0} ok={ok} s={P(tt, at + 0.5)} r={42} />}</Card>;

// ── componentes, en el orden del guion ────────────────────────────────────────────────

// ── kit HuertoAlbahaca: piezas propias ─────────────────────────────────────────────────
const mix = (c1: number[], c2: number[], k: number) => `rgb(${c1.map((v, i) => Math.round(v + (c2[i] - v) * cl(k))).join(",")})`;
// mata de albahaca: up 0 = caída (hojas colgando, pálida) · 1 = parada; dry = fracción de hojas secas; fl = espiga de flor
const Basil: React.FC<{ x: number; y: number; s?: number; up?: number; dry?: number; n?: number; fl?: number }> = ({ x, y, s = 1, up = 1, dry = 0, n = 5, fl = 0 }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  {R(n).map((i) => { const a = (i - (n - 1) / 2) * (n > 6 ? 0.22 : 0.32); const L = 250 + (i % 2) * 40; const bend = (1 - up) * 1.25 * (a >= 0 ? 1 : -1);
    const tx = Math.sin(a + bend) * L, ty = -Math.cos(a + bend * 0.9) * L * (0.5 + 0.5 * up), cx = Math.sin(a) * L * 0.5, cy = -L * 0.6;
    return <g key={i}><path d={`M 0 0 Q ${cx} ${cy} ${tx} ${ty}`} stroke="#5f7d2c" strokeWidth={9} fill="none" strokeLinecap="round" />
      {[0.35, 0.6, 0.85, 1].map((u, j) => { const px = 2 * (1 - u) * u * cx + u * u * tx, py = 2 * (1 - u) * u * cy + u * u * ty; const dead = rnd(i * 7 + j + 1) < dry;
        const col = dead ? "#8a6a3a" : mix([150, 160, 80], [63, 143, 58], up); const ang = lp(150, 50, up), sc = j === 3 ? 0.9 : 1.25, d = a * 57;
        return <g key={j}><Leaf x={px} y={py} r={-ang + d} s={sc} col={col} /><Leaf x={px} y={py} r={ang + d} s={sc} col={col} /></g>; })}
      {fl > 0.01 && <g transform={`translate(${tx},${ty})`}>{R(5).map((k) => <circle key={k} cx={0} cy={-k * 14 * fl} r={7 * fl} fill="#f3eefc" stroke="#b9a4d8" strokeWidth={2} />)}</g>}
    </g>; })}
</g>;
const Ball: React.FC<{ x: number; y: number; s: number; col: string }> = ({ x, y, s, col }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${s})`}><path d="M -150 -250 L -112 0 L 112 0 L 150 -250 Z" fill="url(#soil)" />
  {R(16).map((i) => <path key={i} d={`M ${-140 + i * 18} ${-230 + rnd(i) * 40} q ${(rnd(i + 5) - 0.5) * 60} 110 ${(rnd(i + 9) - 0.5) * 40} ${200 + rnd(i + 2) * 30}`} stroke={col} strokeWidth={6} fill="none" strokeLinecap="round" />)}</g>;
const AB = ["AGUA DE LENTEJAS", "AGUA DE ARROZ", "TÉ DE COMPOSTA", "CAFÉ USADO", "COMPOSTA EN CAPA"];

// ── componentes, en el orden del guion ────────────────────────────────────────────────
const AyerHoy = mk("split", (tt) => <><Svg><Pot x={560} y={940} s={1.05 * P(tt, 0.2)}><Basil x={0} y={-288} up={0} dry={0.15} /></Pot><Pot x={1360} y={940} s={1.05 * P(tt, 0.9)}><Basil x={0} y={-288} up={W(tt, 1.4, 3.2)} /></Pot></Svg>
  <Lbl tt={tt} at={0.5} x={560} y={170} tx="AYER EN LA TARDE" bg={INK} /><Lbl tt={tt} at={1.2} x={1360} y={170} tx="HOY EN LA MAÑANA" bg={GRN} /><Big tt={tt} at={3} x={960} y={520} tx="< 24 H" size={130} /></>);
const NoAbono = mk("wipe", (tt) => <><Svg><Bag x={600} y={560} s={1.1 * P(tt, 0.2)} col="#6b5a8a" tx="ABONO" sub="EN UNA NOCHE" /><XOut x={600} y={560} w={330} k={W(tt, 1.2, 1.8)} /><Drop x={1320} y={560} s={4.2 * P(tt, 2.2)} /><Check x={1470} y={360} ok s={P(tt, 3)} r={50} /></Svg>
  <Lbl tt={tt} at={2.6} x={1320} y={850} tx="FUE EL AGUA" bg={SKY} /></>);
const Quema = mk("drop", (tt) => { const k = W(tt, 1.4, 3); return <><Svg><Pot x={960} y={980} s={1.6} cut>
  {R(14).map((i) => { const a = -1.2 + i * 0.18; return <path key={i} d={`M 0 -250 q ${Math.sin(a) * 60} 80 ${Math.sin(a) * 120} ${150 + rnd(i) * 60}`} stroke={mix([240, 230, 200], [160, 60, 30], k)} strokeWidth={5} fill="none" />; })}
  {R(30).map((i) => <circle key={"g" + i} cx={(rnd(i) - 0.5) * 240} cy={-420 + W(tt, 0.4, 1.6) * (150 + rnd(i + 3) * 120)} r={7} fill="#e8e0ff" stroke="#6b5a8a" strokeWidth={2} />)}</Pot></Svg>
  <Lbl tt={tt} at={0.6} x={1500} y={300} tx="ABONO" bg="#cfc6ef" /><Lbl tt={tt} at={2.4} x={1460} y={600} tx="RAÍZ SECA: SE QUEMA" bg={RED} col={INK} /></>; });
const Cinco = mk("blinds", (tt) => <><Svg>{AB.map((n, i) => <Card key={i} x={330 + i * 315} y={540} w={280} h={380} s={P(tt, 0.3 + i * 0.45)} rot={i % 2 ? 4 : -4} bg={i === 2 ? AMB : INK}>
  <circle cx={0} cy={-90} r={62} fill={NAVY} /><T x={0} y={-66} tx={String(i + 1)} size={70} col={INK} /><T x={0} y={50} tx={n.split(" ")[0]} size={34} /><T x={0} y={96} tx={n.split(" ").slice(1).join(" ")} size={28} /></Card>)}</Svg>
  <Lbl tt={tt} at={2.8} x={960} y={880} tx="TODOS DE LA COCINA" bg={GRN} /></>);
const Avisa = mk("diag", (tt) => { const k = W(tt, 0.3, 3.4); const f = (x: number, d: number) => 340 + 260 * Math.exp(-((x - d) ** 2) / 0.012);
  const pts = (d: number) => R(60).filter((i) => i / 59 <= k).map((i) => `${300 + i / 59 * 1320},${f(i / 59, d)}`).join(" ");
  return <><Svg><line x1={300} y1={700} x2={1620} y2={700} stroke={INK} strokeWidth={4} opacity={0.5} /><polyline points={pts(0.35)} fill="none" stroke={GRN} strokeWidth={14} strokeLinecap="round" /><polyline points={pts(0.6)} fill="none" stroke={INK} strokeWidth={8} opacity={0.6} strokeDasharray="18 14" /></Svg>
  <Lbl tt={tt} at={1} x={560} y={230} tx="LA ALBAHACA: PRIMERO" bg={GRN} /><Lbl tt={tt} at={2.2} x={1360} y={230} tx="LAS DEMÁS, DESPUÉS" bg={INK} /><Lbl tt={tt} at={3.4} x={960} y={850} tx="«LA PRIMERA QUE SE CAE Y LA PRIMERA QUE SE LEVANTA»" bg={AMB} size={32} /></>; });
const TresDias = mk("ring", (tt) => <><Svg>{R(3).map((i) => <g key={i}><Cal x={400 + i * 320} y={330} s={P(tt, 0.3 + i * 0.6)} top={`DÍA ${i + 1}`} big="" col={AMB} w={260} /><Sun x={400 + i * 320} y={360} r={44} k={P(tt, 0.5 + i * 0.6)} /></g>)}
  <Pot x={1480} y={960} s={0.9}><Basil x={0} y={-288} up={1 - W(tt, 0.5, 2.6)} dry={W(tt, 1.5, 2.6) * 0.2} /></Pot></Svg><Lbl tt={tt} at={2.8} x={1480} y={160} tx="CALOR Y SIN AGUA" bg={RED} col={INK} /></>);
const Una = mk("iris", (tt) => { const k = W(tt, 0.6, 1.6), k2 = W(tt, 2.0, 3.0); const S: [number, string, string, number, boolean][] = [[400, "#7a9a3a", "#9fdc6a", k, true], [720, "#7b6a45", "#8a6a3a", k2, false]];
  return <><Svg>{S.map(([y, c, ins, kk, ok], i) => <g key={i}><rect x={300} y={y - 40} width={1320} height={80} rx={40} fill={c} stroke="#3c4a1c" strokeWidth={4} /><rect x={900} y={y - 28} width={260 * kk} height={56} rx={20} fill={ins} /><Check x={1720} y={y} ok={ok} s={P(tt, i ? 3.1 : 1.8)} r={48} /></g>)}</Svg>
  <Lbl tt={tt} at={1.7} x={1030} y={290} tx="VERDE Y HÚMEDO: VIVO" bg={GRN} /><Lbl tt={tt} at={3.1} x={1030} y={830} tx="CAFÉ Y SECO: YA NO" bg={RED} col={INK} /><Lbl tt={tt} at={0.4} x={960} y={560} tx="MEDIO CENTÍMETRO CON LA UÑA" bg={INK} size={34} /></>; });
const Doblar = mk("wipe", (tt) => { const b = Math.sin(W(tt, 0.5, 2.3) * Math.PI) * 0.9; const sn = W(tt, 2.2, 2.6); return <><Svg>
  <path d={`M 560 900 Q ${560 + 220 * b} 600 ${560 + 420 * b} ${380 + 200 * b}`} stroke="#6f9a34" strokeWidth={30} fill="none" strokeLinecap="round" />
  <path d="M 1360 900 L 1360 640" stroke="#7b6a45" strokeWidth={30} strokeLinecap="round" /><path d={`M 1360 640 L ${1360 + 200 * sn} ${380 + 180 * sn}`} stroke="#7b6a45" strokeWidth={30} strokeLinecap="round" />
  {sn > 0.1 && sn < 0.9 && <path d="M 1330 620 l -40 -30 M 1390 620 l 40 -30 M 1360 600 l 0 -50" stroke={AMB} strokeWidth={8} strokeLinecap="round" />}</Svg>
  <Lbl tt={tt} at={1} x={560} y={200} tx="SE DOBLA COMO HULE: VIVA" bg={GRN} /><Lbl tt={tt} at={2.6} x={1360} y={200} tx="TRUENA: ESA RAMA NO" bg={RED} col={INK} /></>; });
const Raiz = mk("split", (tt) => <><Svg><Ball x={600} y={820} s={1.4 * P(tt, 0.3)} col="#f4ecd2" /><Ball x={1320} y={820} s={1.4 * P(tt, 1.3)} col="#5a3a1c" /></Svg>
  <Lbl tt={tt} at={1} x={600} y={200} tx="BLANCAS Y FIRMES" bg={GRN} /><Lbl tt={tt} at={2} x={1320} y={200} tx="CAFÉS, BLANDAS, HUELEN" bg={RED} col={INK} /><Lbl tt={tt} at={3} x={1320} y={930} tx="FUE AGUA DE MÁS" bg={INK} /></>);
const Pan = mk("drop", (tt) => { const u = (tt * 1.2) % 1; return <><Svg><g transform="translate(960,1000) scale(1.7)"><path d="M -150 -270 L -112 0 L 112 0 L 150 -270 Z" fill="#2a1a10" />
  <path d="M -126 -262 L -95 -6 L 95 -6 L 126 -262 Z" fill="#b08a5a" stroke="#7a5a34" strokeWidth={4} /><path d="M -150 -270 L -112 0 L -101 0 L -137 -270 Z M 150 -270 L 112 0 L 101 0 L 137 -270 Z" fill="url(#clay)" />
  {tt > 0.8 && R(4).map((i) => { const v = (u + i * 0.25) % 1; return <g key={i}><Drop x={-138 + v * 26} y={-280 + v * 290} s={0.3} /><Drop x={138 - v * 26} y={-280 + v * 290} s={0.3} /></g>; })}</g></Svg>
  <Lbl tt={tt} at={0.4} x={960} y={150} tx="LA TIERRA SECA SE ENCOGE" bg={INK} /><Lbl tt={tt} at={1.8} x={1520} y={520} tx="EL AGUA SE VA POR LA ORILLA" bg={SKY} /><Lbl tt={tt} at={3} x={960} y={760} tx="EL CENTRO, SECO" bg={AMB} /></>; });
const Burbujas = mk("iris", (tt) => <><Svg><rect x={560} y={540} width={800} height={440} rx={40} fill="rgba(124,196,232,.35)" stroke="#9fb3bd" strokeWidth={10} /><Pot x={960} y={940} s={1.15}><Basil x={0} y={-288} up={W(tt, 1, 4) * 0.6} /></Pot>
  <rect x={560} y={572} width={800} height={10} fill="rgba(255,255,255,.6)" />{R(26).map((i) => { const v = (tt * 0.9 + rnd(i)) % 1; return <circle key={i} cx={810 + rnd(i + 4) * 300} cy={575 - v * 40} r={(5 + rnd(i + 1) * 10) * (1 - v * 0.5)} fill="none" stroke="#fff" strokeWidth={3} opacity={(1 - v) * cl(tt - 0.4)} />; })}</Svg>
  <Lbl tt={tt} at={1.2} x={1640} y={420} tx="SALE EL AIRE" bg={SKY} /><Big tt={tt} at={2.4} x={1640} y={640} tx="20-30" size={120} /><Lbl tt={tt} at={2.8} x={1600} y={770} tx="MINUTOS · NO MÁS DE 1 HORA" bg={INK} size={30} /></>);
const Escurrir = mk("ring", (tt) => <><Svg><Plate x={600} y={860} s={1.2 * P(tt, 0.3)} /><ellipse cx={600} cy={860} rx={250} ry={62} fill="rgba(124,196,232,.75)" opacity={cl(P(tt, 0.3))} /><Pot x={600} y={850} s={0.9 * P(tt, 0.5)} /><XOut x={600} y={620} w={300} k={W(tt, 1.3, 1.8)} />
  <Plate x={1320} y={860} s={1.2 * P(tt, 1.9)} /><Pot x={1320} y={850} s={0.9 * P(tt, 2.1)} /><Check x={1320} y={380} ok s={P(tt, 2.7)} r={56} /></Svg><Lbl tt={tt} at={3.2} x={960} y={160} tx="LA RAÍZ NECESITA AIRE" bg={GRN} /></>);
const Sombra = mk("split", (tt) => { const k = W(tt, 0.6, 2); return <><Svg><Wall /><rect x={1200} y={260} width={380} height={420} rx={10} fill="#bfe6ff" stroke="#8a6a3a" strokeWidth={18} /><Sun x={1460} y={360} r={50} />
  <path d={`M 1200 300 L ${1200 - 420 * k} 900 L ${1200 - 120 * k} 900 L 1200 680 Z`} fill="#fff3b0" opacity={0.35} /><Pot x={480} y={880} s={0.8 * P(tt, 0.3)}><Basil x={0} y={-288} up={0.5} /></Pot></Svg>
  <Lbl tt={tt} at={1.6} x={480} y={300} tx="LUZ, SIN SOL DIRECTO" bg={GRN} /><Lbl tt={tt} at={2.6} x={1390} y={780} tx="1 O 2 DÍAS" bg={AMB} /></>; });
const Globo = mk("wipe", (tt) => { const k = W(tt, 0.5, 2.6); return <><Svg><g transform={`translate(600,${640 - 120 * k})`}><path d={`M 0 ${60 + 170 * k} q 20 80 -10 200`} stroke={INK} strokeWidth={4} fill="none" /><ellipse rx={90 + 110 * k} ry={60 + 170 * k} fill={RED} stroke="#7a1a10" strokeWidth={6} /></g>
  <g transform="translate(1320,860)"><path d="M 0 0 L 0 -320" stroke="#5f7d2c" strokeWidth={12} /><Leaf x={0} y={-220} r={lp(160, 50, k)} s={4} /><Leaf x={0} y={-220} r={lp(-160, -50, k)} s={4} /></g></Svg>
  <Lbl tt={tt} at={2.8} x={960} y={150} tx="LA HOJA SE SOSTIENE CON AGUA" bg={SKY} /></>; });
const Vasos = mk("blinds", (tt) => <><Svg>{R(4).map((i) => <g key={i} opacity={cl(P(tt, 0.3 + i * 0.6) * 2)}><path d={`M ${340 + i * 330} 360 L ${460 + i * 330} 360 L ${448 + i * 330} 540 L ${352 + i * 330} 540 Z`} fill="rgba(124,196,232,.6)" stroke={INK} strokeWidth={5} />{i < 3 && <T x={565 + i * 330} y={470} tx="5 min" size={34} col={INK} />}</g>)}
  <rect x={660} y={820} width={600} height={40} rx={14} fill="url(#steel)" /><Pot x={960} y={815} s={0.55 * P(tt, 2.6)} /></Svg><Lbl tt={tt} at={3.2} x={1500} y={760} tx="QUE LA MACETA PESE" bg={AMB} /></>);
const Nudo = mk("iris", (tt) => { const c = W(tt, 1.4, 1.8), g = W(tt, 2.2, 4); return <><Svg><path d={`M 960 980 L 960 ${c > 0.5 ? 525 : 260}`} stroke="#5f7d2c" strokeWidth={22} />
  {[880, 700, 540].map((y, i) => <g key={i}><Leaf x={960} y={y} r={-60} s={3} /><Leaf x={960} y={y} r={60} s={3} /></g>)}{c < 0.5 && <><Leaf x={960} y={380} r={-60} s={3} /><Leaf x={960} y={380} r={60} s={3} /></>}
  <circle cx={960} cy={540} r={40 + 10 * Math.sin(tt * 6)} fill="none" stroke={AMB} strokeWidth={8} opacity={cl(tt - 0.4)} />{c < 1 && <Shears x={960} y={505} s={1.1} o={0.4 * (1 - c)} />}
  {g > 0 && [-1, 1].map((sd) => <g key={sd}><path d={`M 960 525 Q ${960 + sd * 60} ${520 - 120 * g} ${960 + sd * 130 * g} ${520 - 230 * g}`} stroke="#6f9a34" strokeWidth={14} fill="none" /><Leaf x={960 + sd * 130 * g} y={520 - 230 * g} r={sd * 30} s={2.4 * g} /></g>)}</Svg>
  <Lbl tt={tt} at={0.6} x={1400} y={560} tx="EL NUDO" bg={AMB} /><Lbl tt={tt} at={1.6} x={1460} y={420} tx="½ CM ARRIBA" bg={INK} /><Lbl tt={tt} at={2.8} x={1400} y={250} tx="SALEN DOS RAMAS" bg={GRN} /></>; });
const Flor = mk("diag", (tt) => { const k = W(tt, 1.6, 2.2); return <><Svg><Pot x={700} y={980} s={1.1}><Basil x={0} y={-288} up={1} fl={1 - k} /></Pot><Shears x={700} y={300} s={0.8 * P(tt, 1)} o={0.4 * (1 - k)} rot={-20} /></Svg>
  <Lbl tt={tt} at={0.4} x={1380} y={300} tx="FLOR = MENOS HOJAS" bg={RED} col={INK} /><Lbl tt={tt} at={2.4} x={1380} y={480} tx="LA ESPIGA, FUERA" bg={GRN} /><Lbl tt={tt} at={3.2} x={1380} y={660} tx="SI QUIERES HOJAS" bg={INK} /></>; });
const Mole = mk("ring", (tt) => <><Svg><ellipse cx={720} cy={600} rx={300} ry={90} fill="#fff" stroke="#c9c3b2" strokeWidth={6} /><ellipse cx={720} cy={592} rx={210} ry={56} fill="#5a2414" />{R(9).map((i) => <circle key={i} cx={600 + rnd(i) * 240} cy={580 + rnd(i + 3) * 20} r={6} fill="#f4e7c8" />)}
  <XOut x={720} y={590} w={360} k={W(tt, 1.6, 2.2)} /><g transform="translate(1340,640)"><rect x={-200} y={-30} width={400} height={60} rx={20} fill={INK} /><rect x={-200} y={-90} width={90} height={70} rx={20} fill="#dfe8ef" /><circle cx={-150} cy={-120} r={40} fill="#e0b48a" /></g></Svg>
  <Lbl tt={tt} at={0.6} x={720} y={320} tx="UN PLATO DE MOLE" bg={AMB} /><Lbl tt={tt} at={1.2} x={1340} y={420} tx="RECIÉN SALIDO DEL HOSPITAL" bg={INK} size={36} /><Lbl tt={tt} at={2.6} x={960} y={880} tx="ASÍ ES EL ABONO A UNA RAÍZ LASTIMADA" bg={RED} col={INK} size={38} /></>);
const SieteDias = mk("blinds", (tt) => <><Svg>{R(7).map((i) => <Card key={i} x={330 + i * 210} y={460} w={180} h={240} s={P(tt, 0.3 + i * 0.3)} bg={i === 6 ? GRN : INK}><T x={0} y={-60} tx={`DÍA ${i + 1}`} size={32} /><Drop x={0} y={30} s={0.9} /></Card>)}</Svg>
  <Lbl tt={tt} at={2.6} x={960} y={740} tx="SÓLO AGUA · NADA DE ABONO" bg={AMB} /><Lbl tt={tt} at={3.4} x={960} y={870} tx="HOJITAS NUEVAS = YA PUEDE COMER" bg={GRN} /></>);
const Falange = mk("drop", (tt) => { const k = W(tt, 0.4, 1.4); return <><Svg><Pot x={760} y={1000} s={1.7} cut /><g transform={`translate(760,${290 + 310 * k})`}><rect x={-34} y={-300} width={68} height={300} rx={34} fill="#e0b48a" stroke="#9a6a45" strokeWidth={4} /><line x1={-34} x2={34} y1={-70} y2={-70} stroke="#9a6a45" strokeWidth={4} /></g>
  <line x1={840} x2={960} y1={541} y2={541} stroke={AMB} strokeWidth={6} opacity={cl(tt - 1)} /><line x1={840} x2={960} y1={600} y2={600} stroke={AMB} strokeWidth={6} opacity={cl(tt - 1)} />
  <Fila tt={tt} at={1.8} y={330} x={1440} w={640} tx="HÚMEDO: NO RIEGAS" ok={false} size={40} /><Fila tt={tt} at={2.6} y={480} x={1440} w={640} tx="SECO: RIEGAS" ok size={40} /></Svg><Lbl tt={tt} at={1} x={1040} y={570} tx="3 CM" bg={AMB} /></>; });
const Humeda = mk("wipe", (tt) => <><Svg><Card x={560} y={500} w={480} h={420} s={P(tt, 0.3)}><Drop x={0} y={-40} s={2.4} /><T x={0} y={150} tx="1 · UN POCO DE AGUA" size={38} /></Card><Arrow x1={840} y1={500} x2={1060} y2={500} k={W(tt, 1.1, 1.6)} />
  <Card x={1360} y={500} w={480} h={420} s={P(tt, 1.6)} bg={GRN}><Jar x={0} y={70} s={0.6} lvl={0.7} /><T x={0} y={150} tx="2 · LUEGO EL ABONO" size={38} /></Card></Svg><Lbl tt={tt} at={2.8} x={960} y={880} tx="TIERRA SECA: EL LÍQUIDO SE VA POR LA ORILLA" bg={INK} size={36} /></>);
const Escalera = mk("diag", (tt) => <><Svg>{AB.map((n, i) => { const s = P(tt, 0.3 + i * 0.45); return <g key={i} opacity={cl(s * 2)} transform={`translate(${220 + i * 300},${860 - i * 120})`}><rect x={0} y={0} width={290} height={130 + i * 120} fill={i === 4 ? LEAFD : i === 2 ? AMB : "rgba(255,255,255,.18)"} stroke={INK} strokeWidth={3} />
  <T x={145} y={-20} tx={n} size={n.length > 14 ? 24 : 30} col={INK} /></g>; })}</Svg><Lbl tt={tt} at={0.4} x={420} y={250} tx="DEL MÁS SUAVE…" bg={INK} /><Lbl tt={tt} at={2.8} x={1500} y={150} tx="…A LA BASE" bg={GRN} /></>);
const HojaN = mk("split", (tt) => <><Svg><Leaf x={600} y={760} s={3 * P(tt, 0.3)} col="#b9c46a" /><Leaf x={1320} y={830} s={6 * P(tt, 1.3)} col={LEAFD} /></Svg><Big tt={tt} at={1.8} x={960} y={420} tx="N" size={220} col={GRN} />
  <Lbl tt={tt} at={0.8} x={600} y={880} tx="POCO NITRÓGENO: PÁLIDA" bg={INK} size={36} /><Lbl tt={tt} at={2.4} x={1320} y={930} tx="BIEN COMIDA: COMO CUCHARA" bg={GRN} size={36} /></>);
const PocoSeguido = mk("ring", (tt) => <><Svg>{R(6).map((i) => { const h = 90 * P(tt, 0.3 + i * 0.2); return <rect key={i} x={260 + i * 110} y={640 - h} width={70} height={h} rx={8} fill={GRN} />; })}
  <rect x={1240} y={640 - 420 * P(tt, 2)} width={260} height={420 * P(tt, 2)} rx={12} fill={RED} /><line x1={220} x2={1700} y1={640} y2={640} stroke={INK} strokeWidth={4} /></Svg>
  <Lbl tt={tt} at={1.4} x={560} y={760} tx="POQUITO CADA 10-15 DÍAS" bg={GRN} /><Lbl tt={tt} at={2.6} x={1370} y={760} tx="MUCHO DE GOLPE: QUEMA" bg={RED} col={INK} /></>);
const Lentejas = mk("iris", (tt) => <><Svg><rect x={760} y={300} width={400} height={560} rx={50} fill="rgba(200,230,255,.3)" stroke={INK} strokeWidth={8} /><rect x={770} y={420} width={380} height={430} rx={40} fill="rgba(180,140,60,.35)" />
  {R(60).map((i) => <ellipse key={i} cx={790 + rnd(i) * 340} cy={lp(330, 800 + rnd(i + 2) * 40, W(tt, 0.6 + rnd(i + 7) * 0.4, 2.2))} rx={11} ry={7} fill="#b9773a" />)}<rect x={740} y={270} width={440} height={40} rx={10} fill="#e9dcc0" stroke="#a79b83" strokeWidth={4} /></Svg>
  <Lbl tt={tt} at={0.4} x={460} y={360} tx="1 TAZA SIN SAL" bg={AMB} /><Lbl tt={tt} at={1.2} x={460} y={520} tx="2 L SIN CLORO" bg={SKY} /><Lbl tt={tt} at={2.2} x={1460} y={440} tx="12 H A LA SOMBRA" bg={INK} /><Lbl tt={tt} at={3} x={1460} y={600} tx="SE CUELA" bg={GRN} /></>);
const Huevo = mk("drop", (tt) => <><Svg>{["HOY", "MAÑANA", "DESPUÉS"].map((d, i) => <g key={i}><Jar x={520 + i * 440} y={820} s={P(tt, 0.3 + i * 0.7)} lvl={0.7} /><T x={520 + i * 440} y={900} tx={d} size={40} col={INK} op={cl(tt - 0.5 - i * 0.7)} /><Check x={520 + i * 440} y={380} ok={i < 2} s={P(tt, 0.8 + i * 0.7)} r={46} />
  {i === 2 && R(3).map((k) => <path key={k} d={`M ${1320 + k * 40} 520 q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#b7c24a" strokeWidth={8} fill="none" opacity={cl(tt - 2.2)} />)}</g>)}</Svg>
  <Lbl tt={tt} at={2.8} x={1400} y={200} tx="AGRIA, A HUEVO: YA NO" bg={RED} col={INK} /></>);
const Arroz = mk("blinds", (tt) => { const B: [string, string, boolean][] = [["1er LAVADO", "#d9cfb4", false], ["2º", "#eef0ec", true], ["3º", "#f6f8f6", true], ["DE COCER", "#e8d29a", false]];
  return <><Svg>{B.map(([n, c, ok], i) => <g key={i} opacity={cl(P(tt, 0.3 + i * 0.5) * 2)}><path d={`M ${300 + i * 380} 560 Q ${450 + i * 380} 760 ${600 + i * 380} 560 Z`} fill={c} stroke={INK} strokeWidth={5} /><ellipse cx={450 + i * 380} cy={560} rx={150} ry={26} fill={c} stroke={INK} strokeWidth={5} />
  <T x={450 + i * 380} y={480} tx={n} size={n.length > 6 ? 36 : 48} col={INK} /><Check x={450 + i * 380} y={820} ok={ok} s={P(tt, 0.8 + i * 0.5)} r={44} /></g>)}</Svg><Lbl tt={tt} at={2.8} x={960} y={950} tx="1 VEZ AL MES, EL MISMO DÍA" bg={AMB} /></>; });
const Moho = mk("wipe", (tt) => <><Svg><Pot x={960} y={980} s={1.6}>{R(40).map((i) => <circle key={i} cx={(rnd(i) - 0.5) * 280} cy={-288 + (rnd(i + 5) - 0.5) * 14} r={10 + rnd(i + 1) * 12} fill="#f3f1ea" opacity={W(tt, 0.8, 2.2)} />)}</Pot>
  <Drop x={960} y={lp(200, 480, W(tt, 2.2, 2.8)) - 90 * Math.sin(W(tt, 2.8, 3.4) * Math.PI)} s={1.2} /></Svg>
  <Lbl tt={tt} at={1} x={1500} y={360} tx="GUARDADA = FERMENTA" bg={INK} /><Lbl tt={tt} at={2.6} x={1480} y={520} tx="MOHO QUE NO DEJA ENTRAR EL AGUA" bg={RED} col={INK} size={34} /></>);
const Madura = mk("iris", (tt) => <><Svg><path d="M 260 860 Q 620 380 980 860 Z" fill="#3b2414" />{R(40).map((i) => <circle key={i} cx={360 + rnd(i) * 520} cy={830 - rnd(i + 1) * 200 * (1 - Math.abs(rnd(i) - 0.5) * 1.6)} r={6 + rnd(i + 2) * 8} fill={i % 3 ? "#4e321c" : "#2a180c"} />)}
  <Fila tt={tt} at={0.6} x={1400} y={360} w={680} tx="OSCURA Y SUELTA" ok size={40} /><Fila tt={tt} at={1.4} x={1400} y={510} w={680} tx="HUELE A BOSQUE" ok size={40} /><Fila tt={tt} at={2.2} x={1400} y={660} w={680} tx="CÁSCARAS O BASURA" ok={false} size={40} /></Svg>
  <Lbl tt={tt} at={3} x={1400} y={820} tx="VIVERO: COMPOSTA O HUMUS" bg={AMB} size={36} /></>);
const Media = mk("ring", (tt) => { const k = W(tt, 1.6, 2.8); return <><Svg><rect x={1060} y={420} width={520} height={520} rx={30} fill="rgba(124,196,232,.3)" stroke="#9fb3bd" strokeWidth={10} /><rect x={1070} y={500} width={500} height={430} fill={`rgba(90,58,34,${0.15 + 0.6 * k})`} />
  <g transform={`translate(${lp(560, 1320, k)},${lp(560, 700, k)})`}><path d="M -40 -200 L 40 -200 L 50 0 Q 90 120 0 140 Q -90 120 -50 0 Z" fill="#c9b79a" stroke="#7a6a50" strokeWidth={5} /><ellipse cx={0} cy={70} rx={60} ry={60} fill="#3b2414" opacity={0.7} /><path d="M -46 -150 L 46 -150" stroke={RED} strokeWidth={10} /></g></Svg>
  <Lbl tt={tt} at={0.4} x={560} y={260} tx="2 TAZAS · 300 G" bg={AMB} /><Lbl tt={tt} at={2.2} x={1320} y={330} tx="10 L SIN CLORO" bg={SKY} /></>; });
const TeHoras = mk("diag", (tt) => { const k = W(tt, 0.4, 3.4); return <><Svg><circle cx={620} cy={500} r={250} fill={INK} stroke={NAVY} strokeWidth={14} />
  {R(12).map((i) => <line key={i} x1={620 + Math.sin(i * 0.5236) * 210} y1={500 - Math.cos(i * 0.5236) * 210} x2={620 + Math.sin(i * 0.5236) * 235} y2={500 - Math.cos(i * 0.5236) * 235} stroke={NAVY} strokeWidth={8} />)}
  <line x1={620} y1={500} x2={620 + Math.sin(k * 18.85) * 190} y2={500 - Math.cos(k * 18.85) * 190} stroke={RED} strokeWidth={12} strokeLinecap="round" />
  <rect x={1150} y={400} width={460} height={460} rx={30} fill={mix([170, 140, 100], [70, 45, 25], k)} stroke="#9fb3bd" strokeWidth={10} /></Svg>
  <Big tt={tt} at={0.6} x={620} y={870} tx={`${Math.round(lp(0, 36, k))} H`} size={110} /><Lbl tt={tt} at={2} x={1380} y={320} tx="CADA 12 H: APRIETAS Y REVUELVES" bg={INK} size={32} /><Lbl tt={tt} at={3.4} x={1380} y={940} tx="COMO UN TÉ CARGADO" bg={AMB} /></>; });
const Diluye = mk("wipe", (tt) => { const k = W(tt, 0.8, 2); return <><Svg><g transform={`translate(${lp(560, 820, k)},${lp(560, 330, k)}) rotate(${lp(0, 70, k)})`}><Cup x={0} y={0} s={1.4} /></g>
  {k > 0.6 && <path d="M 900 360 Q 940 480 960 600" stroke="#5a3a22" strokeWidth={14} fill="none" opacity={cl(1 - W(tt, 2.2, 2.6))} />}<rect x={760} y={560} width={420} height={420} rx={30} fill="rgba(124,196,232,.45)" stroke="#9fb3bd" strokeWidth={10} /><T x={970} y={800} tx="10 L" size={90} col={NAVY} /></Svg>
  <Big tt={tt} at={2.2} x={1500} y={460} tx="1 TAZA" size={120} /><Lbl tt={tt} at={2.8} x={1500} y={640} tx="EN 10 LITROS" bg={GRN} /><Lbl tt={tt} at={3.4} x={1500} y={780} tx="CONCENTRADO QUEMA" bg={RED} col={INK} /></>; });
const Olor = mk("split", (tt) => <><Svg><Card x={600} y={500} w={560} h={460} s={P(tt, 0.3)} bg="#e6f6ee"><Leaf x={-60} y={40} r={-30} s={3} /><Leaf x={60} y={40} r={30} s={3} /><T x={0} y={170} tx="TIERRA HÚMEDA, BOSQUE" size={34} /><Check x={200} y={-150} ok s={P(tt, 1)} r={44} /></Card>
  <Card x={1320} y={500} w={560} h={460} s={P(tt, 1.4)} bg="#ffe1dc">{R(3).map((k) => <path key={k} d={`M ${-60 + k * 60} 60 q 24 -40 0 -80 q -24 -40 0 -80`} stroke="#9aa53a" strokeWidth={10} fill="none" />)}<T x={0} y={170} tx="HUEVO O BASURA AGRIA" size={34} /><Check x={200} y={-150} ok={false} s={P(tt, 2)} r={44} /></Card></Svg>
  <Lbl tt={tt} at={2.8} x={960} y={880} tx="COLADO DURA 2 DÍAS" bg={AMB} /></>);
const DosSemanas = mk("drop", (tt) => <><Svg><line x1={260} x2={1660} y1={760} y2={760} stroke={INK} strokeWidth={6} />{R(4).map((i) => <g key={i}><circle cx={300 + i * 440} cy={760} r={16} fill={AMB} /><T x={300 + i * 440} y={830} tx={i === 0 ? "HOY" : `SEMANA ${i}`} size={34} col={INK} />
  <Leaf x={300 + i * 440} y={730} s={(1.5 + i * 1.2) * P(tt, 0.4 + i * 0.6)} col={i < 2 ? "#7aa84a" : LEAFD} /></g>)}</Svg>
  <Lbl tt={tt} at={2.6} x={1400} y={200} tx="MÁS VERDE Y MÁS GRANDE" bg={GRN} /><Lbl tt={tt} at={3.2} x={560} y={200} tx="NO EN DOS DÍAS" bg={RED} col={INK} /></>);
const Costra = mk("iris", (tt) => { const k = W(tt, 0.6, 1.8); return <><Svg><Pot x={960} y={980} s={1.6}><path d={`M -150 -292 L 150 -292 L 150 ${-292 + 22 * k} L -150 ${-292 + 22 * k} Z`} fill="#24140a" />{R(20).map((i) => <circle key={i} cx={(rnd(i) - 0.5) * 260} cy={-294} r={7 * k} fill="#efece4" />)}</Pot>
  {[0, 1, 2].map((i) => { const u = (tt * 0.9 + i * 0.33) % 1; const yb = u < 0.6 ? lp(150, 500, u / 0.6) : 500 - 140 * Math.sin((u - 0.6) / 0.4 * Math.PI); return <Drop key={i} x={760 + i * 200 + (u > 0.6 ? (u - 0.6) * 300 * (i - 1) : 0)} y={yb} s={0.9} />; })}</Svg>
  <Lbl tt={tt} at={1.2} x={1550} y={380} tx="CAFÉ DIRECTO: COSTRA" bg={RED} col={INK} /><Lbl tt={tt} at={2.4} x={1550} y={540} tx="EL AGUA NO ENTRA" bg={INK} /></>; });
const Neutro = mk("ring", (tt) => { const v = lp(4, 6.8, W(tt, 0.6, 2.4)) + 0.15 * Math.sin(tt * 5) * (1 - W(tt, 2.4, 3)); const a = Math.PI * (1 - v / 14);
  return <><Svg>{R(14).map((i) => { const a0 = Math.PI * (1 - i / 14), a1 = Math.PI * (1 - (i + 1) / 14); return <path key={i} d={`M ${960 + Math.cos(a0) * 420} ${760 - Math.sin(a0) * 420} A 420 420 0 0 1 ${960 + Math.cos(a1) * 420} ${760 - Math.sin(a1) * 420} L ${960 + Math.cos(a1) * 300} ${760 - Math.sin(a1) * 300} A 300 300 0 0 0 ${960 + Math.cos(a0) * 300} ${760 - Math.sin(a0) * 300} Z`} fill={`hsl(${i * 18},70%,52%)`} />; })}
  <line x1={960} y1={760} x2={960 + Math.cos(a) * 380} y2={760 - Math.sin(a) * 380} stroke={INK} strokeWidth={14} strokeLinecap="round" /><circle cx={960} cy={760} r={30} fill={INK} /></Svg>
  <Lbl tt={tt} at={0.4} x={480} y={860} tx="ÁCIDO" bg={RED} col={INK} /><Lbl tt={tt} at={0.4} x={1440} y={860} tx="ALCALINO" bg="#6a5acd" col={INK} /><Lbl tt={tt} at={2.6} x={960} y={930} tx="CAFÉ USADO: CASI NEUTRO" bg={AMB} /></>; });
const UnoTres = mk("blinds", (tt) => <><Svg><g opacity={cl(P(tt, 0.3) * 2)}><Cup x={360} y={520} s={1.1} /><T x={360} y={680} tx="1 CAFÉ SECO" size={36} col={INK} /></g><T x={560} y={540} tx="+" size={110} col={AMB} op={cl(tt - 0.8)} />
  {R(3).map((i) => <g key={i} opacity={cl(P(tt, 1 + i * 0.4) * 2)}><Cup x={780 + i * 260} y={520} s={1.1} /><T x={780 + i * 260} y={680} tx="COMPOSTA" size={30} col={INK} /></g>)}</Svg>
  <Lbl tt={tt} at={3} x={960} y={900} tx="NUNCA EL CAFÉ SOLO" bg={RED} col={INK} /><Lbl tt={tt} at={2.2} x={1480} y={300} tx="SE SECA UN DÍA EN CHAROLA" bg={INK} size={32} /></>);
const LiqSol = mk("wipe", (tt) => { const k = W(tt, 0.4, 3.2); const pl = (f: (x: number) => number) => R(80).filter((i) => i / 79 <= k).map((i) => `${280 + i / 79 * 1360},${820 - f(i / 79)}`).join(" ");
  return <><Svg><line x1={280} x2={1660} y1={820} y2={820} stroke={INK} strokeWidth={5} /><line x1={280} x2={280} y1={820} y2={260} stroke={INK} strokeWidth={5} />
  <polyline points={pl((x) => 480 * Math.exp(-((x - 0.08) ** 2) / 0.004))} fill="none" stroke={SKY} strokeWidth={12} /><polyline points={pl((x) => 160 * cl(x * 8))} fill="none" stroke="#a5763f" strokeWidth={16} /></Svg>
  <Lbl tt={tt} at={1} x={620} y={240} tx="LÍQUIDO: RÁPIDO, SE GASTA" bg={SKY} /><Lbl tt={tt} at={2.4} x={1300} y={560} tx="SÓLIDO: MESES" bg="#a5763f" col={INK} /><Lbl tt={tt} at={3.4} x={960} y={930} tx="SI SÓLO HACES UNO, HAZ ESTE" bg={GRN} /></>; });
const Capa = mk("drop", (tt) => { const a = W(tt, 0.5, 1.4), b = W(tt, 1.8, 2.8); return <><Svg><Pot x={900} y={1000} s={1.8} cut><rect x={-140} y={-270} width={280} height={30} fill="#7a5233" opacity={1 - a} /><rect x={-145} y={-270 - 120 * (1 - b)} width={290} height={30} fill="#24140a" opacity={b} />
  <rect x={-14} y={-340} width={28} height={80} fill="#5f7d2c" /><rect x={-24} y={-271} width={48} height={32} fill="#7a5233" opacity={b} /></Pot><Spoon x={lp(640, 520, a)} y={lp(420, 380, a)} s={0.8 * P(tt, 0.3)} rot={-20} ash={false} /></Svg>
  <Lbl tt={tt} at={1.2} x={1480} y={420} tx="FUERA 2 CM DE TIERRA VIEJA" bg={INK} size={36} /><Lbl tt={tt} at={2.6} x={1480} y={560} tx="2 CM DE COMPOSTA" bg={AMB} /><Lbl tt={tt} at={3.4} x={1480} y={700} tx="UN DEDO LEJOS DEL TALLO" bg={GRN} size={36} /></>; });
const PlatanoFlor = mk("diag", (tt) => <><Svg><path d="M 320 640 Q 420 400 560 380 Q 480 470 470 640 Z" fill="#e8c43a" stroke="#8a6a1a" strokeWidth={6} /><Arrow x1={620} y1={520} x2={820} y2={520} k={W(tt, 0.8, 1.3)} />
  <Pot x={1040} y={960} s={0.95 * P(tt, 1)}><Basil x={0} y={-288} up={1} fl={W(tt, 1.4, 2.4)} n={4} /></Pot>
  <Fila tt={tt} at={2.4} x={1520} y={380} w={640} tx="ROSAL · TOMATE · LIMÓN" ok size={30} /><Fila tt={tt} at={3} x={1540} y={540} w={540} tx="ALBAHACA" ok={false} size={36} /></Svg><Lbl tt={tt} at={0.4} x={440} y={260} tx="POTASIO = FLOR" bg={AMB} /></>);
const Ceniza = mk("ring", (tt) => <><Svg><Spoon x={560} y={460} s={1.2 * P(tt, 0.3)} rot={-15} /><XOut x={640} y={460} w={300} k={W(tt, 1.4, 1.9)} /><Arrow x1={1180} y1={760} x2={1180} y2={340} k={W(tt, 1.8, 2.6)} col={RED} w={14} /><Leaf x={1480} y={720} s={4.5 * P(tt, 2.4)} col="#d9c94a" /></Svg>
  <Lbl tt={tt} at={2} x={1180} y={860} tx="SUBE EL pH" bg={RED} col={INK} /><Lbl tt={tt} at={2.8} x={1480} y={230} tx="AMARILLEA AUNQUE COMA" bg={INK} /></>);
const MitadEt = mk("wipe", (tt) => { const k = W(tt, 1, 2.2); return <><Svg><Bag x={560} y={560} s={1.15 * P(tt, 0.3)} col="#2e6fb5" tx="FERTILIZANTE" sub="DOSIS: 1 TAPA" /><rect x={1180} y={360} width={300} height={400} rx={30} fill="none" stroke={INK} strokeWidth={8} />
  <rect x={1188} y={lp(368, 560, k)} width={284} height={lp(384, 192, k)} rx={24} fill="#4a9be0" /><line x1={1160} x2={1500} y1={560} y2={560} stroke={AMB} strokeWidth={6} strokeDasharray="16 10" /></Svg>
  <Big tt={tt} at={2.2} x={1330} y={250} tx="½" size={150} /><Lbl tt={tt} at={2.8} x={1330} y={880} tx="Y CADA 2 SEMANAS COMO MUCHO" bg={INK} size={34} /></>; });
const CocinaNo = mk("blinds", (tt) => <><Svg>{["LECHE", "REFRESCO", "AGUA CON AZÚCAR", "AGUA DE COCER CON SAL"].map((n, i) => <Fila key={i} tt={tt} at={0.3 + i * 0.5} x={960} y={280 + i * 150} w={1000} tx={n} ok={false} size={46} />)}</Svg>
  <Lbl tt={tt} at={2.8} x={960} y={920} tx="SE PUDRE · MOSQUITAS · MOHO" bg={RED} col={INK} /></>);
const CAL5: [string, string, string][] = [["DÍA 1", "INMERSIÓN Y PODA", "#7cc4e8"], ["DÍAS 2-7", "SÓLO AGUA", "#9ed8f0"], ["DÍA 8", "AGUA DE LENTEJAS", "#ffc23a"], ["DÍA 15", "CAPA + TÉ C/10 DÍAS", "#6cc46a"], ["CADA MES", "ARROZ Y CAFÉ", "#e08a5a"]];
const Calendario = mk("iris", (tt) => <><Svg><line x1={240} x2={1680} y1={600} y2={600} stroke={INK} strokeWidth={8} opacity={0.6} />{CAL5.map(([a, b, c], i) => { const s = P(tt, 0.3 + i * 0.7); return <g key={i} opacity={cl(s * 2)}><circle cx={300 + i * 330} cy={600} r={30 * s} fill={c} />
  <Card x={300 + i * 330} y={i % 2 ? 790 : 400} w={300} h={210} s={s} bg={c}><T x={0} y={-30} tx={a} size={42} /><T x={0} y={40} tx={b} size={b.length > 16 ? 22 : b.length > 12 ? 26 : 30} /></Card></g>; })}</Svg>
  <Lbl tt={tt} at={4} x={960} y={990} tx="PÉGALO EN EL REFRIGERADOR" bg={INK} size={34} /></>);
const Flaca = mk("split", (tt) => <><Svg><Sun x={560} y={200} r={40} k={P(tt, 0.3)} /><Pot x={560} y={960} s={0.6} /><g transform="translate(560,787) scale(0.6,1.3)"><Basil x={0} y={0} up={1} n={2} /></g>
  {R(6).map((i) => <Sun key={i} x={1060 + i * 110} y={200} r={30} k={P(tt, 1.2 + i * 0.15)} />)}<Pot x={1340} y={960} s={0.9 * P(tt, 1.4)}><Basil x={0} y={-288} up={1} n={7} s={1.15} /></Pot></Svg>
  <Lbl tt={tt} at={0.8} x={560} y={340} tx="1 HORA: LARGA Y FLACA" bg={INK} /><Lbl tt={tt} at={2.4} x={1340} y={340} tx="6 HORAS, MEJOR DE MAÑANA" bg={GRN} /><Lbl tt={tt} at={3.2} x={960} y={1010} tx="NO ES ABONO: ES SOL" bg={AMB} size={38} /></>);
const Vasito = mk("drop", (tt) => <><Svg><g transform="translate(520,900)"><path d="M -60 -150 L -45 0 L 45 0 L 60 -150 Z" fill="#2a2a2a" stroke="#555" strokeWidth={4} /><Basil x={0} y={-150} s={0.45} up={0.3} /></g><Arrow x1={700} y1={760} x2={960} y2={760} k={W(tt, 1, 1.6)} />
  <Pot x={1340} y={960} s={1.25 * P(tt, 1.5)}><Basil x={0} y={-288} up={1} /></Pot></Svg>
  <Lbl tt={tt} at={0.5} x={520} y={580} tx="VASITO DE 10 CM" bg={RED} col={INK} /><Lbl tt={tt} at={2.2} x={1340} y={240} tx="3 A 5 LITROS · 20 CM" bg={GRN} /><Lbl tt={tt} at={3} x={960} y={1010} tx="MÁS TIERRA, EL AGUA DURA MÁS" bg={INK} size={36} /></>);
const Encharca = mk("wipe", (tt) => { const k = W(tt, 0.6, 2.4); return <><Svg><Pot x={620} y={960} s={1.5} cut hole={false}><path d={`M ${-112 - 30 * k} ${-260 * k} L ${112 + 30 * k} ${-260 * k} L 112 -14 L -112 -14 Z`} fill="rgba(80,140,190,.55)" /></Pot>
  <Pot x={1300} y={960} s={1.5} cut>{[0, 1, 2].map((i) => { const u = (tt * 1.1 + i * 0.33) % 1; return <Drop key={i} x={0} y={u * 80} s={0.4} />; })}</Pot></Svg>
  <Lbl tt={tt} at={1.4} x={620} y={300} tx="SIN HOYO: SE PUDRE" bg={RED} col={INK} /><Lbl tt={tt} at={2.4} x={1300} y={300} tx="CON HOYO, SIEMPRE" bg={GRN} /><Lbl tt={tt} at={3.2} x={960} y={1030} tx="Y EL PLATO, VACÍO A LA MEDIA HORA" bg={INK} size={34} /></>; });
const Treinta = mk("iris", (tt) => { const n = Math.floor(W(tt, 0.4, 2.6) * 30); return <><Svg><path d="M 760 560 L 800 900 L 1120 900 L 1160 560 Z" fill="#2a2a2a" stroke="#555" strokeWidth={6} />
  {R(n).map((i) => { const x = 790 + rnd(i) * 340, h = 120 + rnd(i + 3) * 140, ex = x + (rnd(i + 5) - 0.5) * 40; return <g key={i}><line x1={x} y1={560} x2={ex} y2={560 - h} stroke="#6f9a34" strokeWidth={4} /><Leaf x={ex} y={560 - h} r={-50} s={0.9} /><Leaf x={ex} y={560 - h} r={50} s={0.9} /></g>; })}</Svg>
  <Big tt={tt} at={0.6} x={1500} y={480} tx={String(Math.max(1, n))} size={200} /><Lbl tt={tt} at={2.8} x={1500} y={700} tx="PLANTITAS EN UN VASITO" bg={INK} /><Lbl tt={tt} at={3.4} x={1500} y={820} tx="SE PELEAN POR EL AGUA" bg={RED} col={INK} /></>; });
const Separar = mk("split", (tt) => <><Svg>{R(4).map((i) => <Pot key={i} x={420 + i * 360} y={900} s={0.7 * P(tt, 0.5 + i * 0.5)}>{R(3).map((j) => <Basil key={j} x={(j - 1) * 60} y={-288} s={0.4} up={0.8} n={3} />)}</Pot>)}
  {R(3).map((i) => <line key={"d" + i} x1={540 + i * 360} x2={660 + i * 360} y1={975} y2={975} stroke={AMB} strokeWidth={6} opacity={cl(tt - 2.6)} />)}</Svg>
  <Lbl tt={tt} at={0.4} x={960} y={200} tx="GRUPITOS DE 3 O 4" bg={GRN} /><Lbl tt={tt} at={2.8} x={960} y={1002} tx="15 CM ENTRE UNO Y OTRO" bg={AMB} size={34} /></>);
const AguaOx = mk("ring", (tt) => <><Svg><rect x={480} y={340} width={220} height={420} rx={40} fill="#5a3a22" stroke="#2e1d10" strokeWidth={6} /><rect x={530} y={290} width={120} height={70} rx={10} fill="#ddd" /><XOut x={590} y={550} w={300} k={W(tt, 1, 1.5)} />
  <Drop x={1320} y={600} s={3.8 * P(tt, 1.6)} /><Check x={1470} y={400} ok s={P(tt, 2.2)} r={46} /></Svg>
  <Lbl tt={tt} at={0.4} x={520} y={860} tx="AGUA OXIGENADA: AL BOTIQUÍN" bg={INK} size={36} /><Lbl tt={tt} at={2.4} x={1400} y={880} tx="EL AGUA SOLA, BIEN DADA" bg={SKY} /></>);
const Pudre = mk("drop", (tt) => { const k = W(tt, 1.2, 2.6); return <><Svg><rect x={900} y={300} width={120} height={120} rx={20} fill="#5f7d2c" />
  {R(14).map((i) => { const brown = i % 3 !== 0; return brown && rnd(i) < k ? null : <path key={i} d={`M ${915 + i * 7} 420 q ${(i - 7) * 30} 150 ${(i - 7) * 55} ${260 + rnd(i) * 80}`} stroke={brown ? "#5a3a1c" : "#f4ecd2"} strokeWidth={10} fill="none" strokeLinecap="round" />; })}
  <Shears x={lp(560, 1200, k)} y={620} s={0.9} o={0.3 + 0.3 * Math.sin(tt * 10)} /></Svg>
  <Lbl tt={tt} at={0.6} x={1480} y={320} tx="CAFÉS Y BLANDAS: FUERA" bg={RED} col={INK} /><Lbl tt={tt} at={1.6} x={1480} y={460} tx="BLANCAS: SE QUEDAN" bg={GRN} /><Lbl tt={tt} at={3} x={1480} y={600} tx="TIERRA NUEVA · RIEGO MAÑANA" bg={INK} size={34} /></>; });
const Esquejes = mk("iris", (tt) => { const k = W(tt, 1, 3.4); return <><Svg><path d="M 760 420 L 800 940 L 1120 940 L 1160 420 Z" fill="rgba(200,230,255,.3)" stroke={INK} strokeWidth={8} /><path d="M 768 520 L 801 932 L 1119 932 L 1152 520 Z" fill="rgba(124,196,232,.35)" />
  {[-1, 0, 1].map((j) => <g key={j}><line x1={960 + j * 90} y1={300} x2={960 + j * 80} y2={700} stroke="#5f7d2c" strokeWidth={14} /><Leaf x={960 + j * 90} y={300} r={-40} s={2.2} /><Leaf x={960 + j * 90} y={300} r={40} s={2.2} />
  {R(5).map((r) => <path key={r} d={`M ${960 + j * 80} 700 q ${(r - 2) * 20} ${80 * k} ${(r - 2) * 36} ${170 * k}`} stroke="#f4ecd2" strokeWidth={4} fill="none" />)}</g>)}</Svg>
  <Lbl tt={tt} at={0.4} x={460} y={360} tx="PUNTAS DE 10 CM" bg={INK} /><Big tt={tt} at={2.2} x={1500} y={560} tx="10-15" size={130} /><Lbl tt={tt} at={2.8} x={1500} y={700} tx="DÍAS: RAÍCES" bg={GRN} /></>; });
const Pelona = mk("split", (tt) => <><Svg><line x1={560} y1={960} x2={560} y2={460} stroke="#5f7d2c" strokeWidth={14} />{R(4).map((i) => <Leaf key={i} x={560} y={460} r={-80 + i * 50} s={2.2} />)}<XOut x={560} y={660} w={300} k={W(tt, 1, 1.5)} />
  <g transform={`translate(1360,960) scale(${P(tt, 1.6)})`}><Basil x={0} y={0} up={1} n={9} s={1.1} /></g><Check x={1360} y={300} ok s={P(tt, 2.4)} r={50} /></Svg>
  <Lbl tt={tt} at={0.6} x={560} y={260} tx="HOJAS DE ABAJO: PELONA" bg={RED} col={INK} size={38} /><Lbl tt={tt} at={2.6} x={1360} y={990} tx="DE LA PUNTA: ARBOLITO" bg={GRN} /></>);
const Tercio = mk("ring", (tt) => { const k = W(tt, 0.6, 2); const a = k * Math.PI * 2 / 3; return <><Svg><circle cx={720} cy={540} r={300} fill={LEAF} /><path d={`M 720 540 L 720 240 A 300 300 0 0 1 ${720 + 300 * Math.sin(a)} ${540 - 300 * Math.cos(a)} Z`} fill={AMB} /></Svg>
  <Big tt={tt} at={1.8} x={1420} y={440} tx="1/3" size={200} /><Lbl tt={tt} at={2.4} x={1420} y={680} tx="MÁXIMO, DE UNA VEZ" bg={INK} /><Lbl tt={tt} at={3.2} x={1420} y={810} tx="1 SEMANA SIN ABONO ANTES DE COMER" bg={GRN} size={30} /></>; });
const Pulgon = mk("diag", (tt) => <><Svg><path d="M 960 1000 Q 940 640 980 260" stroke="#5f7d2c" strokeWidth={26} fill="none" /><Leaf x={980} y={280} r={-50} s={3.4} /><Leaf x={980} y={280} r={50} s={3.4} />
  {R(14).map((i) => <ellipse key={i} cx={940 + rnd(i) * 90} cy={250 + rnd(i + 2) * 60} rx={9} ry={6} fill="#7ab83a" stroke="#3d6a1a" strokeWidth={2} opacity={cl(tt - 0.6)} />)}
  {R(6).map((i) => { const v = (tt * 0.25 + i / 6) % 1; return <g key={"a" + i} transform={`translate(${958 - 10 * Math.sin(v * 6)},${960 - v * 640})`}><ellipse rx={8} ry={14} fill="#1b1206" /><circle cy={-16} r={7} fill="#1b1206" /></g>; })}</Svg>
  <Lbl tt={tt} at={1} x={1420} y={300} tx="PULGÓN EN LAS PUNTAS" bg={GRN} /><Lbl tt={tt} at={2} x={1420} y={700} tx="HORMIGAS QUE SUBEN Y BAJAN" bg={INK} size={36} /></>);
const Chorro = mk("wipe", (tt) => <><Svg><path d="M 300 860 Q 700 500 940 560" stroke={SKY} strokeWidth={18} fill="none" strokeDasharray="30 16" strokeDashoffset={-tt * 120} opacity={cl(tt - 0.3)} /><Leaf x={1060} y={520} r={-100} s={5} />
  {R(10).map((i) => { const v = cl((tt - 1 - rnd(i)) * 0.8); return <ellipse key={i} cx={1000 + rnd(i + 3) * 120} cy={560 + v * 400} rx={8} ry={6} fill="#7ab83a" opacity={1 - v * 0.7} />; })}</Svg>
  <Lbl tt={tt} at={1.8} x={1480} y={300} tx="3 DÍAS, EN LA MAÑANA" bg={AMB} /><Lbl tt={tt} at={2.8} x={1440} y={820} tx="SI SIGUEN: 1 CDTA DE JABÓN EN 1 L" bg={INK} size={32} /></>);
const Mosca = mk("ring", (tt) => <><Svg><rect x={860} y={300} width={200} height={300} rx={10} fill="#f2d21b" stroke="#a88f0a" strokeWidth={5} /><line x1={960} y1={600} x2={960} y2={900} stroke="#8a6a3a" strokeWidth={14} />
  {R(16).map((i) => { const v = cl((tt - rnd(i) * 1.6) / 1.6); const sx = 400 + rnd(i + 1) * 1100, sy = 200 + rnd(i + 2) * 700, ex = 880 + rnd(i + 3) * 160, ey = 320 + rnd(i + 4) * 260;
    return <g key={i} transform={`translate(${lp(sx, ex, v)},${lp(sy, ey, v)})`}><ellipse rx={14} ry={8} fill="#fff" /><ellipse cx={-8} cy={-6} rx={10} ry={6} fill="rgba(255,255,255,.7)" /></g>; })}</Svg>
  <Lbl tt={tt} at={2.4} x={1480} y={300} tx="MOSQUITA BLANCA" bg={INK} /><Lbl tt={tt} at={3} x={1480} y={440} tx="EL AMARILLO LAS JALA" bg={AMB} /></>);
const Caracol = mk("iris", (tt) => { const k = W(tt, 0.5, 1.4); return <><Svg><rect width={1920} height={1080} fill="rgba(5,10,25,.6)" /><path d={`M 330 300 L 1300 ${640 - 300 * k} L 1300 ${640 + 300 * k} Z`} fill="#fff6c0" opacity={0.25 * k} /><rect x={200} y={260} width={140} height={80} rx={20} fill="#3a4450" />
  {R(3).map((i) => <g key={i} transform={`translate(${1000 + i * 140},${600 + (i - 1) * 120})`} opacity={k}><ellipse cx={0} cy={20} rx={70} ry={18} fill="#a58a6a" /><circle cx={-6} cy={-10} r={40} fill="#8a5a2e" stroke="#5a3a18" strokeWidth={5} /><circle cx={-6} cy={-10} r={18} fill="none" stroke="#5a3a18" strokeWidth={4} /></g>)}</Svg>
  <Lbl tt={tt} at={1.6} x={1180} y={240} tx="DE NOCHE, CON LÁMPARA" bg={AMB} /><Lbl tt={tt} at={2.4} x={1180} y={940} tx="A MANO · NADA DE VENENOS" bg={GRN} /></>; });
const Semilla = mk("split", (tt) => <><Svg><rect x={300} y={620} width={1320} height={300} fill="url(#soil)" />{R(9).map((i) => <ellipse key={i} cx={420 + i * 140} cy={lp(300, 628, W(tt, 0.3 + i * 0.08, 1 + i * 0.08))} rx={10} ry={7} fill="#111" />)}
  <rect x={300} y={612} width={1320} height={14} fill="#7a5233" opacity={W(tt, 1.4, 1.8)} />
  {R(9).map((i) => { const g = W(tt, 2.4 + i * 0.08, 3.6); return g > 0 ? <g key={"s" + i}><line x1={420 + i * 140} y1={620} x2={420 + i * 140} y2={620 - 70 * g} stroke="#6f9a34" strokeWidth={5} /><Leaf x={420 + i * 140} y={620 - 70 * g} r={-60} s={g} /><Leaf x={420 + i * 140} y={620 - 70 * g} r={60} s={g} /></g> : null; })}</Svg>
  <Lbl tt={tt} at={1.6} x={960} y={200} tx="APENAS TAPADITA" bg={AMB} /><Lbl tt={tt} at={2.8} x={960} y={1000} tx="5 A 10 DÍAS CON CALOR" bg={GRN} /></>);
const ERR5 = ["ABONO A LA PLANTA CAÍDA", "REGAR DESDE ARRIBA LA MACETA SECA", "EL TÉ SIN DILUIR", "CÁSCARA DE PLÁTANO", "DEJAR QUE FLOREZCA"];
const Errores = mk("blinds", (tt) => <Svg>{ERR5.map((n, i) => <Fila key={i} tt={tt} at={0.4 + i * 0.75} x={960} y={220 + i * 150} w={1300} tx={`${i + 1} · ${n}`} ok={false} size={44} />)}</Svg>);
const Frio = mk("drop", (tt) => { const v = lp(22, 7, W(tt, 0.4, 2)); const yv = 860 - v * 22; return <><Svg><rect x={700} y={260} width={80} height={620} rx={40} fill={INK} /><circle cx={740} cy={900} r={70} fill={v < 10 ? SKY : RED} /><rect x={716} y={yv} width={48} height={880 - yv} fill={v < 10 ? SKY : RED} />
  <line x1={680} x2={800} y1={640} y2={640} stroke={AMB} strokeWidth={6} /><Leaf x={1300} y={780} s={5} />{v < 10 && R(7).map((i) => <circle key={i} cx={1262 + rnd(i) * 76} cy={560 + rnd(i + 2) * 170} r={10} fill="#1b1206" />)}</Svg>
  <Big tt={tt} at={0.6} x={1000} y={400} tx={`${Math.round(v)}°`} size={130} /><Lbl tt={tt} at={1.2} x={480} y={640} tx="MENOS DE 10°" bg={AMB} /><Lbl tt={tt} at={2.6} x={1400} y={260} tx="MÉTELA A LA CASA" bg={INK} /></>; });
const AlMes = mk("iris", (tt) => { const k = W(tt, 0.4, 3); return <><Svg><Pot x={960} y={980} s={lp(0.7, 1.2, k)}><Basil x={0} y={-288} up={1} n={Math.round(lp(3, 9, k))} s={lp(0.7, 1.25, k)} /></Pot></Svg>
  <Big tt={tt} at={0.4} x={380} y={420} tx={`${Math.round(lp(1, 30, k))} DÍAS`} size={110} /><Lbl tt={tt} at={2.6} x={1560} y={360} tx="REDONDA Y VERDE OSCURO" size={36} bg={GRN} /><Lbl tt={tt} at={3.4} x={1560} y={500} tx="MACETA DE 5 L: YA NO SE CAE" bg={INK} size={34} /></>; });
const REP = ["AGUA BIEN DADA: UÑA · INMERSIÓN · SOMBRA", "7 DÍAS SIN ABONO", "LENTEJA · ARROZ · TÉ · CAFÉ · CAPA", "TÉ: 1 TAZA EN 10 L, CADA 10 DÍAS", "NADA DE PLÁTANO NI CENIZA", "6 H DE SOL · MACETA CON HOYO · CORTAR DE LA PUNTA"];
const Repaso = mk("drop", (tt) => <Svg>{REP.map((n, i) => <Fila key={i} tt={tt} at={0.3 + i * 0.65} x={960} y={190 + i * 140} w={1500} tx={n} ok size={n.length > 36 ? 34 : 42} />)}</Svg>);

export const MAP: Record<string, C> = {
  ayerhoy: AyerHoy, noabono: NoAbono, quema: Quema, cinco: Cinco, avisa: Avisa, tresdias: TresDias, una: Una, doblar: Doblar, raiz: Raiz, pan: Pan, burbujas: Burbujas, escurrir: Escurrir,
  sombra: Sombra, globo: Globo, vasos: Vasos, nudo: Nudo, flor: Flor, mole: Mole, sietedias: SieteDias, falange: Falange, humeda: Humeda, escalera: Escalera, hojan: HojaN, pocoseguido: PocoSeguido,
  lentejas: Lentejas, huevo: Huevo, arroz: Arroz, moho: Moho, madura: Madura, media: Media, tehoras: TeHoras, diluye: Diluye, olor: Olor, dossemanas: DosSemanas, costra: Costra, neutro: Neutro,
  unotres: UnoTres, liqsol: LiqSol, capa: Capa, platanoflor: PlatanoFlor, ceniza: Ceniza, mitadet: MitadEt, cocinano: CocinaNo, calendario: Calendario, flaca: Flaca, vasito: Vasito, encharca: Encharca,
  treinta: Treinta, separar: Separar, aguaox: AguaOx, pudre: Pudre, esquejes: Esquejes, pelona: Pelona, tercio: Tercio, pulgon: Pulgon, chorro: Chorro, mosca: Mosca, caracol: Caracol, semilla: Semilla,
  errores: Errores, frio: Frio, almes: AlMes, repaso: Repaso,
};
