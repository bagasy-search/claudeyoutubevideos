// dis.tsx — componentes de catástrofe de cpciudades ("7 ciudades que la Tierra borró"). Todo por código.
// Pantalla completa (fondo propio): Liquefy, Density, Balance, Column, LogScale, Race, Strata, Sonar, Profile, IceCap, Plates, RainCols, TenRoofs.
// Encima del plano: Clock, Stopwatch, Timeline, ArchFrame (foto de archivo), Fraction, Tally.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SANS, ROMAN, MONO, EMBER, EMBER2, ICE, W, H, k01, lerp, ease, easeOut, easeIn, rnd, shadow } from "./lib";

const RED = "#ff4a3d", WATER = "#3a9be0", MUD = "#7a5a3a";
const vis = (t: number, a: number, b: number, f = 0.35) => Math.min(k01(t, a, a + f), 1 - k01(t, b - f, b));
const Lbl: React.FC<{ x: number; y: number; text: string; o?: number; size?: number; color?: string; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, o = 1, size = 40, color = "#fff", anchor = "middle" }) =>
  <text x={x} y={y} textAnchor={anchor} fill={color} opacity={o} fontFamily={SANS} fontWeight={800} fontSize={size} letterSpacing={size * 0.12} stroke="#000" strokeWidth={size * 0.16} paintOrder="stroke">{text}</text>;
const Bg: React.FC<{ children?: React.ReactNode; tint?: string }> = ({ children, tint = "#0b0d12" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${tint} 0%, #040507 75%)` }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
      {Array.from({ length: 33 }, (_, i) => <line key={"v" + i} x1={i * 60} y1={0} x2={i * 60} y2={H} stroke="#fff" />)}
      {Array.from({ length: 19 }, (_, i) => <line key={"h" + i} x1={0} y1={i * 60} x2={W} y2={i * 60} stroke="#fff" />)}
    </svg>
    {children}
  </AbsoluteFill>
);
const Title: React.FC<{ t: number; a: number; text: string; sub?: string }> = ({ t, a, text, sub }) => {
  const k = easeOut(k01(t, a, a + 0.6));
  return <div style={{ position: "absolute", left: 110, top: 80, opacity: k, transform: `translateX(${(1 - k) * -40}px)`, color: "#fff", textShadow: shadow }}>
    <div style={{ width: 220 * k, height: 4, background: EMBER, boxShadow: `0 0 16px ${EMBER}` }} />
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: 12, marginTop: 14 }}>{text}</div>
    {sub && <div style={{ fontFamily: ROMAN, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: EMBER2, marginTop: 4 }}>{sub}</div>}
  </div>;
};
const shake = (t: number, amp: number, s = 1) => [Math.sin(t * 61 * s) * amp + Math.sin(t * 37 + 1) * amp * 0.6, Math.cos(t * 53 * s) * amp * 0.7];

// ---------- RELOJ: esfera grande que se dibuja sobre el plano y marca la hora exacta ----------
export const Clock: React.FC<{ t: number; a: number; b: number; h: number; m: number; label?: string; x?: number; y?: number; r?: number; spin?: boolean }> =
  ({ t, a, b, h, m, label, x = W / 2, y = H / 2 - 30, r = 230, spin = true }) => {
    const o = vis(t, a, b); if (o <= 0) return null;
    const k = easeOut(k01(t, a, a + 0.9)), tgt = (h % 12) * 60 + m, cur = spin ? lerp(tgt - 95, tgt, k) : tgt;
    const ah = (cur / 720) * 360 - 90, am = ((cur % 60) / 60) * 360 - 90, sec = ((t - a) * 6) % 360 - 90;
    const P = (ang: number, rr: number) => [x + Math.cos((ang * Math.PI) / 180) * rr, y + Math.sin((ang * Math.PI) / 180) * rr];
    const txt = `${h}:${String(m).padStart(2, "0")}`;
    return <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o }}>
      <circle cx={x} cy={y} r={r * 1.5} fill="rgba(0,0,0,.45)" style={{ filter: "blur(40px)" }} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${k} 1`} transform={`rotate(-90 ${x} ${y})`} />
      {Array.from({ length: 60 }, (_, i) => { const [x1, y1] = P(i * 6, r - (i % 5 ? 14 : 34)), [x2, y2] = P(i * 6, r - 4);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={i % 5 ? 2 : 6} opacity={k01(k, i / 60, i / 60 + 0.1)} />; })}
      {(() => { const [hx, hy] = P(ah, r * 0.52), [mx, my] = P(am, r * 0.8), [sx, sy] = P(sec, r * 0.88);
        return <g opacity={k}><line x1={x} y1={y} x2={hx} y2={hy} stroke="#fff" strokeWidth={14} strokeLinecap="round" />
          <line x1={x} y1={y} x2={mx} y2={my} stroke={EMBER2} strokeWidth={8} strokeLinecap="round" />
          <line x1={x} y1={y} x2={sx} y2={sy} stroke={RED} strokeWidth={3} /><circle cx={x} cy={y} r={12} fill={RED} /></g>; })()}
      <Lbl x={x} y={y + r + 110} text={txt} size={110} o={k01(t, a + 0.7, a + 1.0)} />
      {label && <Lbl x={x} y={y + r + 170} text={label} size={34} color={EMBER2} o={k01(t, a + 0.9, a + 1.2)} />}
    </svg>;
  };

// ---------- CRONÓMETRO: corre de 0 a "to" segundos, anillo que se llena ----------
export const Stopwatch: React.FC<{ t: number; a: number; b: number; to: number; dur?: number; label?: string; x?: number; y?: number; hot?: boolean }> =
  ({ t, a, b, to, dur, label, x = W - 330, y = 300, hot = true }) => {
    const o = vis(t, a, b); if (o <= 0) return null;
    const D = dur ?? b - a - 0.3, k = k01(t, a, a + D), v = to * k, mm = Math.floor(v / 60), ss = Math.floor(v % 60), cs = Math.floor((v * 100) % 100);
    const r = 170, c = hot ? RED : EMBER2;
    return <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o }}>
      <circle cx={x} cy={y} r={r + 40} fill="rgba(0,0,0,.55)" style={{ filter: "blur(24px)" }} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={14} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={c} strokeWidth={14} pathLength={1} strokeDasharray={`${k} 1`} transform={`rotate(-90 ${x} ${y})`} strokeLinecap="round" />
      <text x={x} y={y + 30} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={700} fontSize={84} stroke="#000" strokeWidth={6} paintOrder="stroke">{`${mm}:${String(ss).padStart(2, "0")}`}<tspan fontSize={40} fill={c}>{`.${String(cs).padStart(2, "0")}`}</tspan></text>
      {label && <Lbl x={x} y={y + r + 70} text={label} size={32} color={c} />}
    </svg>;
  };

// ---------- LÍNEA DE TIEMPO horizontal con hitos (sobre el plano, abajo) ----------
export const Timeline: React.FC<{ t: number; a: number; b: number; items: { at: number; text: string; sub?: string; red?: boolean }[]; y?: number; title?: string }> = ({ t, a, b, items, y = 760, title }) => {
  const o = vis(t, a, b); if (o <= 0) return null;
  const x0 = 180, x1 = W - 180, k = ease(k01(t, a, a + 0.8));
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o }}>
    <rect x={0} y={y - 200} width={W} height={420} fill="url(#tlg)" />
    <defs><linearGradient id="tlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset=".5" stopColor="#000" stopOpacity=".65" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient></defs>
    {title && <Lbl x={x0} y={y - 120} text={title} size={40} anchor="start" color={EMBER2} o={k} />}
    <line x1={x0} y1={y} x2={lerp(x0, x1, k)} y2={y} stroke="#fff" strokeWidth={4} />
    {items.map((it, i) => { const xx = lerp(x0 + 60, x1 - 60, items.length > 1 ? i / (items.length - 1) : 0.5), q = easeOut(k01(t, it.at, it.at + 0.45)), c = it.red ? RED : EMBER2;
      return <g key={i} opacity={q} transform={`translate(${xx},${y}) scale(${0.6 + 0.4 * q})`}>
        <circle r={16} fill={c} stroke="#000" strokeWidth={4} /><circle r={30 + 6 * Math.sin((t - it.at) * 5)} fill="none" stroke={c} strokeWidth={2} opacity={0.6} />
        <Lbl x={0} y={-48} text={it.text} size={50} /> {it.sub && <Lbl x={0} y={72} text={it.sub} size={28} color={c} />}
      </g>; })}
  </svg>;
};

// ---------- FOTO DE ARCHIVO: tarjeta que entra en 3D con flash de obturador, polvo, crédito ----------
export const ArchFrame: React.FC<{ t: number; a: number; b: number; src: string; credit?: string; caption?: string; tilt?: number; bw?: boolean; under?: React.ReactNode }> = ({ t, a, b, src, credit, caption, tilt = 1, bw }) => {
  const u = t - a, k = easeOut(k01(t, a, a + 0.7)), d = b - a;
  const ry = lerp(18 * tilt, -4 * tilt, k01(t, a, b)), rx = lerp(8, 2, k), sc = lerp(0.82, 0.94, k01(t, a, b)) ;
  const flash = Math.max(0, 1 - u / 0.18);
  return <AbsoluteFill style={{ background: "#07080a", perspective: 1600 }}>
    <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: W + 120, height: H + 120, objectFit: "cover", filter: `blur(38px) brightness(.35) ${bw ? "grayscale(1)" : ""}` }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc})`, boxShadow: "0 40px 120px rgba(0,0,0,.85)", border: "14px solid #e8e2d4", background: "#e8e2d4", maxWidth: W * 0.8 }}>
        <Img src={staticFile(src)} style={{ display: "block", maxWidth: W * 0.78, maxHeight: H * 0.74, filter: `contrast(1.05) ${bw ? "grayscale(1) sepia(.25)" : "sepia(.12)"}` }} />
      </div>
    </AbsoluteFill>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 60 }, (_, i) => { const x = (rnd(i, 4) * W + u * (20 + rnd(i, 5) * 40)) % W, y = (rnd(i, 6) * H - u * (10 + rnd(i, 7) * 30) + H) % H;
        return <circle key={i} cx={x} cy={y} r={1 + rnd(i, 8) * 2.5} fill="#fff" opacity={0.18 + 0.25 * rnd(i, 9)} />; })}
    </svg>
    {caption && <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: ROMAN, fontWeight: 800, fontSize: 52, letterSpacing: 8, color: "#fff", textShadow: shadow, opacity: k01(t, a + 0.4, a + 0.8) * (1 - k01(t, b - 0.3, b)) }}>{caption}</div>}
    {credit && <div style={{ position: "absolute", right: 40, bottom: 24, fontFamily: SANS, fontSize: 20, color: "rgba(255,255,255,.6)", letterSpacing: 2 }}>{credit}</div>}
    {flash > 0 && <AbsoluteFill style={{ background: `rgba(255,255,255,${flash * 0.85})` }} />}
    {d < 0 && null}
  </AbsoluteFill>;
};

// ---------- LICUEFACCIÓN: corte de suelo, granos apoyados → sacudida → el agua los separa → la casa se hunde ----------
export const Liquefy: React.FC<{ t: number; a: number; b: number; shakeAt: number; floatAt: number; sinkAt: number; title?: string }> = ({ t, a, b, shakeAt, floatAt, sinkAt, title = "LICUEFACCIÓN" }) => {
  const sh = k01(t, shakeAt, shakeAt + 0.3) * (1 - k01(t, sinkAt + 2.5, sinkAt + 3.5)), fl = ease(k01(t, floatAt, floatAt + 1.6)), sk = ease(k01(t, sinkAt, sinkAt + 2.2));
  const [dx, dy] = shake(t, 16 * sh);
  const gx0 = 260, gy0 = 470, gw = 1400, gh = 520, R = 26;
  const grains: [number, number][] = [];
  for (let r = 0; r < 10; r++) for (let c = 0; c < 27; c++) grains.push([gx0 + 30 + c * 51.5 + (r % 2) * 25, gy0 + 30 + r * 49]);
  const pr = fl; // presión del agua
  return <Bg tint="#0f1218">
    <Title t={t} a={a} text={title} sub="el suelo que se vuelve líquido" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${dx},${dy})`}>
        <rect x={gx0} y={gy0} width={gw} height={gh} fill="#1a2533" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} />
        <rect x={gx0} y={gy0 + gh * (1 - 0.92)} width={gw} height={gh * 0.92} fill={WATER} opacity={0.18 + 0.4 * pr} />
        {grains.map(([x, y], i) => { const j = rnd(i, 2), ox = (rnd(i, 3) - 0.5) * 30 * fl + Math.sin(t * 3 + i) * 6 * fl, oy = (rnd(i, 4) - 0.5) * 26 * fl + Math.cos(t * 2.5 + i) * 6 * fl;
          return <circle key={i} cx={x + ox} cy={y + oy} r={R - 2 - j * 4} fill={`hsl(36, ${30 + j * 20}%, ${48 + j * 14}%)`} stroke="#000" strokeOpacity={0.4} />; })}
        {/* contactos grano-grano: se dibujan quietos y se rompen al flotar */}
        {grains.map(([x, y], i) => i % 27 < 26 && i % 3 === 0 ? <line key={"c" + i} x1={x + 12} y1={y} x2={x + 40} y2={y} stroke={EMBER2} strokeWidth={4} opacity={(1 - fl) * k01(t, a + 0.8, a + 1.6)} /> : null)}
        {pr > 0.05 && [0.2, 0.4, 0.6, 0.8].map((q, i) => <path key={i} d={`M${gx0 + gw * q},${gy0 + gh - 10} l0,${-120 * pr} m-18,22 l18,-22 l18,22`} stroke={ICE} strokeWidth={8} fill="none" opacity={pr} strokeLinecap="round" />)}
        {/* casa */}
        <g transform={`translate(${W / 2 - 150},${gy0 - 230 + sk * 300}) rotate(${sk * 9} 150 230)`}>
          <rect x={0} y={60} width={300} height={170} fill="#c9b79a" stroke="#000" strokeWidth={4} />
          <path d="M-20,64 L150,-30 L320,64 Z" fill="#8a3b2a" stroke="#000" strokeWidth={4} />
          {[40, 130, 220].map((xx) => <rect key={xx} x={xx} y={100} width={44} height={56} fill="#2a3340" />)}
        </g>
        <rect x={gx0} y={gy0} width={gw} height={8} fill="#5b4a33" />
      </g>
      <Lbl x={W / 2} y={gy0 + gh + 80} text={fl > 0.5 ? "EL AGUA EMPUJA · LOS GRANOS FLOTAN" : sh > 0.3 ? "SACUDIDA" : "LOS GRANOS SE APOYAN UNOS EN OTROS"} size={40} color={fl > 0.5 ? ICE : EMBER2} o={k01(t, a + 0.6, a + 1)} />
    </svg>
  </Bg>;
};

// ---------- DENSIDAD: agua vs barro; la roca se hunde en uno y flota en el otro ----------
export const Density: React.FC<{ t: number; a: number; b: number; dropAt: number; title?: string }> = ({ t, a, b, dropAt, title = "EL BARRO CARGA" }) => {
  const d = k01(t, dropAt, dropAt + 1.4), dw = easeIn(d), dm = easeOut(k01(t, dropAt, dropAt + 1.0));
  const tank = (x: number, label: string, fill: string, y: number, sub: string, o: number) => <g>
    <rect x={x} y={300} width={560} height={560} fill="none" stroke="#fff" strokeWidth={5} />
    <rect x={x + 3} y={380} width={554} height={477} fill={fill} opacity={0.75} />
    {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={x + 30 + rnd(i, x) * 500} cy={420 + rnd(i, x + 1) * 420} r={4 + rnd(i, 2) * 8} fill="#000" opacity={fill === MUD ? 0.35 : 0} />)}
    <path d={`M${x + 280 - 70},${y} l40,-60 l80,-10 l40,50 l-20,60 l-100,10 z`} fill="#8d8b86" stroke="#000" strokeWidth={4} />
    <Lbl x={x + 280} y={930} text={label} size={54} />
    <Lbl x={x + 280} y={990} text={sub} size={30} color={EMBER2} o={o} />
  </g>;
  return <Bg>
    <Title t={t} a={a} text={title} sub="lo que importa es la densidad" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {tank(300, "AGUA", WATER, lerp(260, 800, dw), "la roca se hunde", k01(t, dropAt + 1.2, dropAt + 1.6))}
      {tank(1060, "BARRO", MUD, lerp(260, 400 + Math.sin(t * 2) * 6, dm), "la roca FLOTA", k01(t, dropAt + 1.0, dropAt + 1.4))}
    </svg>
  </Bg>;
};

// ---------- BALANZA: aire vs nube de roca; la nube pesa más y la balanza cae ----------
export const Balance: React.FC<{ t: number; a: number; b: number; tipAt: number }> = ({ t, a, b, tipAt }) => {
  const tip = easeOut(k01(t, tipAt, tipAt + 0.9)), ang = lerp(0, 16, tip) + Math.sin((t - tipAt) * 9) * 2 * (1 - tip) * k01(t, tipAt, tipAt + 0.1);
  const cx = W / 2, cy = 380, L = 520, rad = (ang * Math.PI) / 180;
  const Lp = [cx - L * Math.cos(rad), cy - L * Math.sin(rad)], Rp = [cx + L * Math.cos(rad), cy + L * Math.sin(rad)];
  const pan = (p: number[], label: string, cloud: boolean) => <g transform={`translate(${p[0]},${p[1]})`}>
    <line x1={-120} y1={180} x2={0} y2={0} stroke="#fff" strokeWidth={3} /><line x1={120} y1={180} x2={0} y2={0} stroke="#fff" strokeWidth={3} />
    <path d="M-170,180 Q0,260 170,180 Z" fill="#cfd4dc" stroke="#000" strokeWidth={4} />
    {Array.from({ length: cloud ? 26 : 10 }, (_, i) => <circle key={i} cx={(rnd(i, cloud ? 3 : 4) - 0.5) * 260} cy={120 - rnd(i, 5) * 110 + Math.sin(t * 2 + i) * 4} r={cloud ? 26 + rnd(i, 6) * 26 : 30 + rnd(i, 6) * 20}
      fill={cloud ? `hsl(20, 8%, ${18 + rnd(i, 7) * 18}%)` : "rgba(200,225,255,.22)"} />)}
    {cloud && Array.from({ length: 22 }, (_, i) => <circle key={"r" + i} cx={(rnd(i, 8) - 0.5) * 230} cy={140 - rnd(i, 9) * 100} r={4 + rnd(i, 10) * 6} fill="#555" />)}
    <Lbl x={0} y={330} text={label} size={44} color={cloud ? EMBER2 : "#fff"} />
  </g>;
  return <Bg>
    <Title t={t} a={a} text="MÁS PESADA QUE EL AIRE" sub="por eso no sube: baja" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${cx},${cy} L${cx - 90},${cy + 560} L${cx + 90},${cy + 560} Z`} fill="#2b2f36" stroke="#fff" strokeOpacity={0.3} />
      <line x1={Lp[0]} y1={Lp[1]} x2={Rp[0]} y2={Rp[1]} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={18} fill={EMBER} />
      {pan(Lp, "AIRE", false)}{pan(Rp, "NUBE DE ROCA Y GAS", true)}
    </svg>
  </Bg>;
};

// ---------- COLUMNA QUE COLAPSA: empuje vs peso; al quebrar cae como una fuente y corre por el suelo ----------
export const Column: React.FC<{ t: number; a: number; b: number; breakAt: number }> = ({ t, a, b, breakAt }) => {
  const grow = easeOut(k01(t, a + 0.3, breakAt)), col = ease(k01(t, breakAt, breakAt + 1.6)), run = ease(k01(t, breakAt + 1.0, breakAt + 3.2));
  const base = 900, top = lerp(base, 160, grow), cx = 700;
  const push = 1 - col * 0.8, wt = 0.4 + 0.6 * k01(t, a + 0.5, breakAt);
  return <Bg>
    <Title t={t} a={a} text="LA COLUMNA COLAPSA" sub="como una fuente que se queda sin fuerza" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${cx - 420},${base + 40} L${cx - 90},${base - 120} L${cx + 90},${base - 120} L${cx + 420},${base + 40} Z`} fill="#3a3430" />
      <line x1={0} y1={base + 40} x2={W} y2={base + 40} stroke="#5a504a" strokeWidth={6} />
      {Array.from({ length: 70 }, (_, i) => { const q = i / 70, r1 = rnd(i, 1), y = lerp(base - 120, top, q * (1 - col * 0.6)), spread = 30 + q * 220;
        const fallX = (r1 - 0.5) * 2 * (300 + 200 * q) * col, fallY = col * (base - y) * (0.6 + 0.4 * r1);
        return <circle key={i} cx={cx + (r1 - 0.5) * spread + fallX} cy={y + fallY + Math.sin(t * 2 + i) * 6} r={30 + q * 60} fill={`hsl(18, 6%, ${16 + r1 * 22}%)`} opacity={0.85} />; })}
      {run > 0 && [-1, 1].map((s) => Array.from({ length: 14 }, (_, i) => <circle key={s + "_" + i} cx={cx + s * (200 + run * 900 * (i / 14 + 0.3))} cy={base + 10 - rnd(i, s + 3) * 40} r={40 + rnd(i, 4) * 40} fill="hsl(20,8%,25%)" opacity={0.9 * run} />))}
      <g opacity={k01(t, a + 0.6, a + 1)}>
        <path d={`M${cx + 330},${base - 160} l0,${-300 * push} m-26,30 l26,-30 l26,30`} stroke={EMBER2} strokeWidth={14} fill="none" strokeLinecap="round" />
        <Lbl x={cx + 330} y={base - 200 - 300 * push} text="EMPUJE" size={40} color={EMBER2} />
        <path d={`M${cx + 520},${base - 460} l0,${260 * wt} m-26,-30 l26,30 l26,-30`} stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" />
        <Lbl x={cx + 520} y={base - 490} text="PESO" size={40} color={RED} />
      </g>
      {col > 0.2 && <Lbl x={W - 360} y={300} text="QUIEBRE" size={70} color={RED} o={k01(col, 0.2, 0.4)} />}
    </svg>
  </Bg>;
};

// ---------- ESCALA LOGARÍTMICA de magnitud: cada escalón ×32 ----------
export const LogScale: React.FC<{ t: number; a: number; b: number; hi?: number; title?: string }> = ({ t, a, b, hi = 9, title = "MAGNITUD" }) => {
  const steps = [5, 6, 7, 8, 9], bx = 260, by = 900;
  return <Bg>
    <Title t={t} a={a} text={title} sub="cada punto = 32 veces más energía" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <line x1={bx - 40} y1={by} x2={W - 160} y2={by} stroke="#fff" strokeWidth={3} />
      {steps.map((m, i) => { const at = a + 0.6 + i * 0.55, q = easeOut(k01(t, at, at + 0.6)), hgt = Math.min(720, 12 * Math.pow(2.8, i)) * q, x = bx + i * 290, c = m === hi ? RED : m >= 8 ? EMBER : EMBER2;
        return <g key={m}>
          <rect x={x} y={by - hgt} width={180} height={hgt} fill={c} opacity={0.9} />
          <Lbl x={x + 90} y={by + 70} text={String(m)} size={64} o={q} />
          {i > 0 && <Lbl x={x - 55} y={by - hgt - 20} text="×32" size={30} color="#fff" o={k01(t, at + 0.3, at + 0.6)} />}
        </g>; })}
    </svg>
  </Bg>;
};

// ---------- CARRERA: dos barras de velocidad (ola vs avión) ----------
export const Race: React.FC<{ t: number; a: number; b: number; rows: { label: string; v: number; unit: string; red?: boolean }[]; title: string; sub?: string }> = ({ t, a, b, rows, title, sub }) => {
  const mx = Math.max(...rows.map((r) => r.v));
  return <Bg>
    <Title t={t} a={a} text={title} sub={sub} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {rows.map((r, i) => { const at = a + 0.5 + i * 0.4, q = ease(k01(t, at, at + 1.2)), y = 420 + i * 220, wdt = 1300 * (r.v / mx) * q;
        return <g key={i}>
          <Lbl x={260} y={y - 20} text={r.label} size={44} anchor="start" />
          <rect x={260} y={y} width={wdt} height={90} rx={10} fill={r.red ? RED : EMBER2} />
          <Lbl x={280 + wdt} y={y + 66} text={`${Math.round(r.v * q)} ${r.unit}`} size={50} anchor="start" o={q} />
        </g>; })}
    </svg>
  </Bg>;
};

// ---------- ESTRATOS: corte del terreno que se rellena capa por capa ----------
export const Strata: React.FC<{ t: number; a: number; b: number; layers: { at: number; label: string; color: string }[]; title: string; sub?: string; dig?: number }> = ({ t, a, b, layers, title, sub, dig }) => {
  const x0 = 200, x1 = W - 200, yb = 960, lh = 150;
  const dg = dig != null ? ease(k01(t, dig, dig + 1.5)) : 0;
  return <Bg>
    <Title t={t} a={a} text={title} sub={sub} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {layers.map((L, i) => { const q = ease(k01(t, L.at, L.at + 0.9)), y = yb - (i + 1) * lh;
        return <g key={i} opacity={q}>
          <path d={`M${x0},${y + lh} L${x0},${y + lh * (1 - q) + 10 * Math.sin(i)} Q${W / 2},${y + lh * (1 - q) - 20} ${x1},${y + lh * (1 - q) + 8} L${x1},${y + lh} Z`} fill={L.color} stroke="#000" strokeOpacity={0.4} />
          <Lbl x={x1 - 30} y={y + lh / 2 + 14} text={L.label} size={38} anchor="end" />
        </g>; })}
      {dg > 0 && <g>
        <rect x={W / 2 - 90} y={yb - layers.length * lh} width={180} height={(layers.length - 0.6) * lh * dg} fill="#000" opacity={0.55} stroke={EMBER2} strokeWidth={4} strokeDasharray="14 10" />
        <Lbl x={W / 2} y={yb - layers.length * lh - 30} text="LA EXCAVACIÓN" size={36} color={EMBER2} />
      </g>}
    </svg>
  </Bg>;
};

// ---------- SONAR: barre el fondo del mar y no encuentra nada ----------
export const Sonar: React.FC<{ t: number; a: number; b: number; nadaAt: number }> = ({ t, a, b, nadaAt }) => {
  const cx = W / 2, cy = 560, R = 420, ang = ((t - a) * 140) % 360;
  return <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 52%, #02221a 0%, #000 70%)" }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs><radialGradient id="sw" cx="0" cy="0" r="1"><stop offset="0" stopColor="#38ffb0" stopOpacity=".55" /><stop offset="1" stopColor="#38ffb0" stopOpacity="0" /></radialGradient></defs>
      {[0.25, 0.5, 0.75, 1].map((q) => <circle key={q} cx={cx} cy={cy} r={R * q} fill="none" stroke="#38ffb0" strokeOpacity={0.35} strokeWidth={2} />)}
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#38ffb0" strokeOpacity={0.25} /><line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="#38ffb0" strokeOpacity={0.25} />
      <g transform={`rotate(${ang} ${cx} ${cy})`}><path d={`M${cx},${cy} L${cx + R},${cy} A${R},${R} 0 0 0 ${cx + R * Math.cos(-0.6)},${cy + R * Math.sin(-0.6)} Z`} fill="#38ffb0" opacity={0.28} />
        <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#7dffd0" strokeWidth={4} /></g>
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={cx + (rnd(i, 1) - 0.5) * R * 1.6} cy={cy + (rnd(i, 2) - 0.5) * R * 1.6} r={3} fill="#38ffb0" opacity={0.2 + 0.3 * Math.abs(Math.sin(t * 2 + i))} />)}
      <text x={110} y={130} fill="#38ffb0" fontFamily={MONO} fontWeight={700} fontSize={40}>GOLFO DE CORINTO · BÚSQUEDA SUBMARINA</text>
      <text x={110} y={180} fill="#38ffb0" opacity={0.7} fontFamily={MONO} fontSize={30}>{`PROFUNDIDAD ${Math.round(40 + (t - a) * 13)} m`}</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#fff" fontFamily={SANS} fontWeight={800} fontSize={140} letterSpacing={30} opacity={k01(t, nadaAt, nadaAt + 0.3)} stroke="#000" strokeWidth={10} paintOrder="stroke">NADA</text>
    </svg>
  </AbsoluteFill>;
};

// ---------- PERFIL DE RELIEVE: la montaña en pocos km, con un rascacielos de escala ----------
export const Profile: React.FC<{ t: number; a: number; b: number; peak: number; km: number; label: string; bld?: { h: number; label: string }; title: string; sub?: string; flowAt?: number }> =
  ({ t, a, b, peak, km, label, bld, title, sub, flowAt }) => {
    const q = ease(k01(t, a + 0.3, a + 1.6)), x0 = 220, x1 = W - 180, yb = 920, sy = 620 / peak;
    const pts = Array.from({ length: 60 }, (_, i) => { const u = i / 59, h = peak * Math.pow(u, 0.75) * (0.92 + 0.08 * Math.sin(u * 22)); return [lerp(x0, x1, u), yb - h * sy * q]; });
    const fl = flowAt != null ? ease(k01(t, flowAt, flowAt + 2.0)) : 0;
    return <Bg>
      <Title t={t} a={a} text={title} sub={sub} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={yb} width={x0} height={H - yb} fill={WATER} opacity={0.6} />
        <path d={`M${x0},${yb} ` + pts.map((p) => `L${p[0]},${p[1]}`).join(" ") + ` L${x1},${yb} Z`} fill="#2f4a32" stroke="#a9d39a" strokeWidth={4} />
        {fl > 0 && <path d={`M${x1 - 60},${pts[57][1]} ` + pts.slice(0, 58).reverse().map((p) => `L${p[0]},${p[1] - 10}`).join(" ")} fill="none" stroke={MUD} strokeWidth={26} pathLength={1} strokeDasharray={`${fl} 1`} strokeLinecap="round" />}
        <line x1={x1 + 20} y1={yb} x2={x1 + 20} y2={yb - peak * sy * q} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" />
        <Lbl x={x1 - 10} y={yb - peak * sy * q - 30} text={label} size={54} anchor="end" o={q} />
        <line x1={x0} y1={yb + 50} x2={x1} y2={yb + 50} stroke="#fff" strokeWidth={3} />
        <Lbl x={(x0 + x1) / 2} y={yb + 110} text={`${km} km`} size={50} o={q} />
        {bld && <g opacity={k01(t, a + 1.4, a + 1.8)}><rect x={x0 + 30} y={yb - bld.h * sy} width={50} height={bld.h * sy} fill="#cfd8e3" /><Lbl x={x0 + 55} y={yb - bld.h * sy - 20} text={bld.label} size={28} /></g>}
      </svg>
    </Bg>;
  };

// ---------- VOLCÁN CON CASQUETE: el 10 % del hielo se derrite y baja por los cañones ----------
export const IceCap: React.FC<{ t: number; a: number; b: number; meltAt: number; runAt: number }> = ({ t, a, b, meltAt, runAt }) => {
  const m = ease(k01(t, meltAt, meltAt + 1.2)), r = ease(k01(t, runAt, runAt + 3.0));
  const cx = 760, top = 260, base = 880;
  return <Bg>
    <Title t={t} a={a} text="LO QUE MATÓ A ARMERO FUE EL HIELO" sub="un 10 % del glaciar alcanzó" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${cx - 640},${base} L${cx - 90},${top} L${cx + 90},${top} L${cx + 640},${base} Z`} fill="#3b3330" stroke="#000" strokeWidth={4} />
      <path d={`M${cx - 300},${top + 270} L${cx - 90},${top} L${cx + 90},${top} L${cx + 300},${top + 270} Q${cx},${top + 320} ${cx - 300},${top + 270} Z`} fill="#eef6ff" />
      <path d={`M${cx + 90},${top} L${cx + 130},${top + 60} L${cx + 300},${top + 270} Q${cx + 220},${top + 290} ${cx + 160},${top + 280} L${cx + 40},${top} Z`} fill={RED} opacity={0.85 * m} />
      <Lbl x={cx + 380} y={top + 90} text="10 %" size={90} color={RED} o={m} />
      {[`M${cx + 230},${top + 285} C${cx + 420},${top + 420} ${cx + 560},${base - 60} ${1480},${base - 40}`,
        `M${cx - 60},${top + 300} C${cx + 60},${top + 520} ${cx + 380},${base + 10} ${1470},${base - 10}`].map((d, i) =>
        <path key={i} d={d} fill="none" stroke={MUD} strokeWidth={26 - i * 6} pathLength={1} strokeDasharray={`${k01(r, i * 0.15, 1)} 1`} strokeLinecap="round" />)}
      <g opacity={k01(r, 0.8, 1)} transform={`translate(1500,${base - 40})`}>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={(i % 3) * 46} y={-Math.floor(i / 3) * 40} width={36} height={30} fill="#e8e0d0" />)}
        <Lbl x={70} y={-150} text="ARMERO" size={48} /><Lbl x={70} y={70} text="50 km río abajo" size={28} color={EMBER2} />
      </g>
    </svg>
  </Bg>;
};

// ---------- PLACAS + RESORTE: África empuja a Europa unos mm por año; el resorte se carga y salta ----------
export const Plates: React.FC<{ t: number; a: number; b: number; snapAt: number }> = ({ t, a, b, snapAt }) => {
  const load = k01(t, a + 0.6, snapAt), snap = easeOut(k01(t, snapAt, snapAt + 0.25)), back = ease(k01(t, snapAt + 0.25, snapAt + 1.2));
  const comp = load * (1 - snap), [dx, dy] = shake(t, 22 * snap * (1 - back));
  const spring = (x0: number, x1: number, y: number) => { const n = 14, w = (x1 - x0) / n; let d = `M${x0},${y}`; for (let i = 0; i < n; i++) d += ` L${x0 + w * (i + 0.5)},${y + (i % 2 ? -50 : 50)}`; return d + ` L${x1},${y}`; };
  const sx1 = lerp(1300, 980, comp);
  return <Bg tint="#121010">
    <Title t={t} a={a} text="UN RESORTE BAJO EL ATLÁNTICO" sub="placa africana contra placa europea" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${dx},${dy})`}>
        <rect x={0} y={560} width={720} height={400} fill="#4a3c2c" /><Lbl x={360} y={780} text="EUROPA" size={56} />
        <rect x={sx1} y={560} width={W - sx1} height={400} fill="#5a4a2e" /><Lbl x={(sx1 + W) / 2} y={780} text="ÁFRICA" size={56} />
        <path d={spring(720, sx1, 620)} fill="none" stroke={comp > 0.6 ? RED : EMBER2} strokeWidth={10} strokeLinejoin="round" />
        <rect x={0} y={420} width={W} height={140} fill={WATER} opacity={0.35} />
        <path d={`M${W - 120},700 l${-180},0 m40,-30 l-40,30 l40,30`} stroke="#fff" strokeWidth={10} fill="none" />
        <Lbl x={W - 210} y={660} text="unos mm por año" size={30} color="#fff" />
      </g>
      <Lbl x={W / 2} y={300} text={snap > 0.2 ? "¡SALTA!" : `TENSIÓN ${Math.round(comp * 100)} %`} size={snap > 0.2 ? 120 : 54} color={snap > 0.2 ? RED : EMBER2} o={k01(t, a + 0.5, a + 0.9)} />
    </svg>
  </Bg>;
};

// ---------- LLUVIA: dos columnas, "3 días" se llena hasta igualar "1 año" ----------
export const RainCols: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const y = ease(k01(t, a + 0.4, a + 1.4)), d = ease(k01(t, a + 1.4, b - 0.6)), hh = 600, yb = 930;
  const col = (x: number, q: number, label: string, sub: string, red: boolean) => <g>
    <rect x={x} y={yb - hh} width={260} height={hh} fill="none" stroke="#fff" strokeWidth={4} />
    <rect x={x + 4} y={yb - hh * q} width={252} height={hh * q} fill={WATER} opacity={0.85} />
    {red && Array.from({ length: 30 }, (_, i) => <line key={i} x1={x + rnd(i, 1) * 260} y1={((t * 900 + rnd(i, 2) * 900) % 900) + 20} x2={x + rnd(i, 1) * 260 - 8} y2={((t * 900 + rnd(i, 2) * 900) % 900) + 60} stroke={ICE} strokeWidth={3} opacity={0.7 * (1 - q * 0.5)} />)}
    <Lbl x={x + 130} y={yb + 70} text={label} size={56} color={red ? RED : "#fff"} />
    <Lbl x={x + 130} y={yb + 120} text={sub} size={28} color={EMBER2} />
  </g>;
  return <Bg>
    <Title t={t} a={a} text="DICIEMBRE DE 1999" sub="la lluvia de un año, en tres días" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {col(560, y, "1 AÑO", "lluvia normal", false)}{col(1100, d, "3 DÍAS", "diciembre 1999", true)}
      <Lbl x={W / 2 + 10} y={yb - hh - 40} text="=" size={90} o={k01(d, 0.9, 1)} color={RED} />
    </svg>
  </Bg>;
};

// ---------- 10 TECHOS: se enciende uno (1 de cada 10 era taberna) ----------
export const TenRoofs: React.FC<{ t: number; a: number; b: number; litAt: number; label: string }> = ({ t, a, b, litAt, label }) => {
  const lit = k01(t, litAt, litAt + 0.25);
  return <Bg tint="#140f0a">
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 10 }, (_, i) => { const x = 210 + i * 155, q = easeOut(k01(t, a + i * 0.07, a + 0.4 + i * 0.07)), on = i === 6;
        return <g key={i} transform={`translate(${x},${560 + (1 - q) * 80})`} opacity={q}>
          <rect x={0} y={0} width={120} height={160} fill={on && lit ? "#3a2412" : "#22262c"} stroke="#000" strokeWidth={3} />
          <path d="M-12,4 L60,-60 L132,4 Z" fill={on && lit ? EMBER : "#40464f"} />
          <rect x={38} y={50} width={44} height={60} fill={on ? `rgba(255,190,90,${0.15 + 0.85 * lit})` : "#151820"} />
          {on && lit > 0 && <circle cx={60} cy={80} r={120} fill={EMBER} opacity={0.18 * lit} />}
        </g>; })}
      <Lbl x={W / 2} y={900} text={label} size={60} color={EMBER2} o={lit} />
    </svg>
  </Bg>;
};

// ---------- FRACCIÓN gigante (2/3) que se pinta sobre el agua ----------
export const Fraction: React.FC<{ t: number; a: number; b: number; n: number; d: number; sub?: string }> = ({ t, a, b, n, d, sub }) => {
  const o = vis(t, a, b), k = easeOut(k01(t, a, a + 0.6)); if (o <= 0) return null;
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o }}>
    <circle cx={W / 2} cy={H / 2} r={360} fill="rgba(0,0,0,.45)" style={{ filter: "blur(60px)" }} />
    <g transform={`translate(${W / 2},${H / 2 - 40}) scale(${lerp(1.3, 1, k)})`}>
      <text y={-40} textAnchor="middle" fill="#fff" fontFamily={ROMAN} fontWeight={800} fontSize={250} stroke="#000" strokeWidth={8} paintOrder="stroke">{n}</text>
      <line x1={-150 * k} y1={10} x2={150 * k} y2={10} stroke={RED} strokeWidth={14} strokeLinecap="round" />
      <text y={240} textAnchor="middle" fill="#fff" fontFamily={ROMAN} fontWeight={800} fontSize={250} stroke="#000" strokeWidth={8} paintOrder="stroke">{d}</text>
    </g>
    {sub && <Lbl x={W / 2} y={H - 110} text={sub} size={44} color={EMBER2} o={k01(t, a + 0.5, a + 0.9)} />}
  </svg>;
};

// ---------- CONTADOR QUE NO SE DECIDE (cifras que oscilan entre dos valores) ----------
export const Waver: React.FC<{ t: number; a: number; b: number; lo: number; hi: number; label: string }> = ({ t, a, b, lo, hi, label }) => {
  const o = vis(t, a, b); if (o <= 0) return null;
  const s = (Math.sin((t - a) * 3.1) + Math.sin((t - a) * 7.3) * 0.4) / 1.4, v = Math.round(lerp(lo, hi, 0.5 + 0.5 * s) / 10) * 10;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: o, color: "#fff", textShadow: shadow }}>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 200, letterSpacing: -4, fontVariantNumeric: "tabular-nums", color: EMBER2 }}>{v.toLocaleString("es-AR")}</div>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 12 }}>{label}</div>
    <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 32, letterSpacing: 4, opacity: 0.85, marginTop: 6 }}>{`entre ${lo.toLocaleString("es-AR")} y ${hi.toLocaleString("es-AR")}`}</div>
  </div>;
};

// ---------- NÚMERO EN ESCALA: "30 km" de columna junto al Everest ----------
export const Heights: React.FC<{ t: number; a: number; b: number; bars: { h: number; label: string; red?: boolean }[]; unit: string; title: string; sub?: string }> = ({ t, a, b, bars, unit, title, sub }) => {
  const mx = Math.max(...bars.map((x) => x.h)), yb = 940;
  return <Bg>
    <Title t={t} a={a} text={title} sub={sub} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <line x1={200} y1={yb} x2={W - 200} y2={yb} stroke="#fff" strokeWidth={3} />
      {bars.map((x, i) => { const at = a + 0.5 + i * 0.5, q = ease(k01(t, at, at + 1.3)), hh = (680 * x.h) / mx * q, xx = W / 2 - (bars.length - 1) * 220 + i * 440;
        return <g key={i}>
          <path d={x.red ? `M${xx - 110},${yb} Q${xx - 60},${yb - hh * 0.6} ${xx - 120},${yb - hh} Q${xx},${yb - hh - 60} ${xx + 120},${yb - hh} Q${xx + 60},${yb - hh * 0.6} ${xx + 110},${yb} Z` : `M${xx - 160},${yb} L${xx},${yb - hh} L${xx + 160},${yb} Z`}
            fill={x.red ? "hsl(15,8%,30%)" : "#cfd8e3"} stroke={x.red ? RED : "#fff"} strokeWidth={4} />
          <Lbl x={xx} y={yb - hh - 30} text={`${x.h} ${unit}`} size={54} o={q} color={x.red ? RED : "#fff"} />
          <Lbl x={xx} y={yb + 60} text={x.label} size={34} o={q} />
        </g>; })}
    </svg>
  </Bg>;
};

// ---------- CELDA DE SYLBARIS: corte de la celda semienterrada; el calor sólo entra por la rendija ----------
export const Cell: React.FC<{ t: number; a: number; b: number; heatAt: number }> = ({ t, a, b, heatAt }) => {
  const h = ease(k01(t, heatAt, heatAt + 1.4));
  return <Bg tint="#140c08">
    <Title t={t} a={a} text="LA CELDA" sub="muros gruesos, semienterrada, una sola rendija" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={640} width={W} height={440} fill="#3d2f22" />
      <rect x={640} y={420} width={640} height={420} fill="#7c6f60" stroke="#000" strokeWidth={4} />
      <rect x={700} y={480} width={520} height={300} fill="#1b1612" />
      <rect x={1040} y={438} width={90} height={22} fill="#000" />
      <rect x={0} y={0} width={W} height={420 + 200 * h} fill="url(#nube)" opacity={h} />
      <defs><linearGradient id="nube" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff6a2a" stopOpacity=".9" /><stop offset="1" stopColor="#3a1a10" stopOpacity=".2" /></linearGradient></defs>
      {h > 0.2 && Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${1085},${440} q${(i - 4) * 12},${60 + i * 12} ${(i - 4) * 30},${140 + i * 16}`} stroke={EMBER} strokeWidth={6} fill="none" opacity={0.5 * h} strokeDasharray="12 10" strokeDashoffset={-t * 80} />)}
      <circle cx={860} cy={720} r={34} fill="#d8c3a5" /><rect x={830} y={750} width={60} height={30} fill="#d8c3a5" />
      <Lbl x={1085} y={400} text="RENDIJA" size={36} color={EMBER2} o={k01(t, a + 0.6, a + 1)} />
      <Lbl x={960} y={1010} text="MUROS DE PIEDRA · BAJO TIERRA" size={34} o={k01(t, a + 0.9, a + 1.3)} />
    </svg>
  </Bg>;
};

// ---------- LETRAS QUE SE ILUMINAN (la palabra griega del papiro) ----------
export const GlowWord: React.FC<{ t: number; a: number; b: number; text: string; tr: string; dur?: number }> = ({ t, a, b, text, tr, dur = 1.6 }) => {
  const o = vis(t, a, b); if (o <= 0) return null;
  const ch = [...text];
  return <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: o }}>
    <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 170, letterSpacing: 20 }}>
      {ch.map((c, i) => { const q = k01(t, a + (i / ch.length) * dur, a + (i / ch.length) * dur + 0.3);
        return <span key={i} style={{ color: `rgba(255,${Math.round(150 + 80 * q)},${Math.round(60 + 120 * q)},${0.15 + 0.85 * q})`, textShadow: `0 0 ${40 * q}px rgba(255,140,40,${q})` }}>{c}</span>; })}
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: 14, color: "#fff", textShadow: shadow, opacity: k01(t, a + dur, a + dur + 0.4) }}>{tr}</div>
  </div>;
};

// ---------- JAULA POMBALINA: pared sola vs. pared con cruces de madera, mismo temblor ----------
export const Gaiola: React.FC<{ t: number; a: number; b: number; shakeAt: number }> = ({ t, a, b, shakeAt }) => {
  const sh = k01(t, shakeAt, shakeAt + 0.4) * (1 - k01(t, shakeAt + 3.2, shakeAt + 3.8)), fall = easeIn(k01(t, shakeAt + 1.4, shakeAt + 2.6));
  const draw = ease(k01(t, a + 0.4, a + 1.6)), base = 900, fw = 380, fh = 560;
  const bld = (cx: number, braced: boolean) => {
    const [dx] = shake(t, 14 * sh, braced ? 0.7 : 1.2), lean = braced ? Math.sin(t * 9) * 2.2 * sh : fall * 26;
    return <g transform={`translate(${cx + dx},${base}) rotate(${lean}) translate(0,${braced ? 0 : fall * 120})`}>
      {Array.from({ length: 4 }, (_, f) => Array.from({ length: 3 }, (_, c) => {
        const x = -fw / 2 + c * (fw / 3), y = -fh + f * (fh / 4), r = rnd(f * 3 + c, braced ? 9 : 2);
        const off = braced ? [0, 0] : [(r - 0.5) * 260 * fall, fall * (220 + 160 * r) * (1 - f / 5)];
        return <g key={f + "_" + c} transform={`translate(${off[0]},${off[1]}) rotate(${braced ? 0 : (r - 0.5) * 60 * fall})`}>
          <rect x={x} y={y} width={fw / 3} height={fh / 4} fill="#d8cdb8" stroke="#6b5d48" strokeWidth={3} opacity={draw} />
          {braced && <path d={`M${x},${y} L${x + fw / 3},${y + fh / 4} M${x + fw / 3},${y} L${x},${y + fh / 4}`} stroke="#9a6a32" strokeWidth={9} opacity={k01(t, a + 1.2, a + 2.0)} />}
        </g>; }))}
    </g>;
  };
  return <Bg>
    <Title t={t} a={a} text="LA JAULA POMBALINA" sub="cruces de madera dentro de la pared" />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <line x1={120} y1={base} x2={W - 120} y2={base} stroke="#5a504a" strokeWidth={6} />
      {bld(560, false)}{bld(1360, true)}
      <Lbl x={560} y={base + 70} text="PIEDRA SOLA" size={38} o={draw} />
      <Lbl x={1360} y={base + 70} text="CON JAULA" size={38} o={draw} color={EMBER2} />
      {sh > 0.1 && <Lbl x={W / 2} y={560} text="TEMBLOR" size={52} color={RED} o={sh} />}
    </svg>
  </Bg>;
};
