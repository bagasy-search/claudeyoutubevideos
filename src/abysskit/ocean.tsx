// abysskit/ocean.tsx — piezas ilustradas del mar (Abyss Ledger): agua por profundidad con nieve marina que nunca para,
// rayos de sol, fondo de barro, haz de luz, esfera de acero, sumergible, anfípodo, pez, barco, regla de profundidad, mapas.
// Todo en código (estilo doc-ilustrado-btg): plano, paleta fija, algo se mueve siempre.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, ease } from "./kit";
import { Plate } from "./plate";

export const O = {
  surf: "#2c8fae", shallow: "#1b6283", mid: "#0f3a58", deep: "#08203a", abyss: "#041120", black: "#01050b",
  snow: "#d6e9ef", ivory: "#efe1c4", ivory2: "#c9b48e", mud: "#5a4f40", mud2: "#2f2a22", steel: "#8d9aa6", steel2: "#4b5662",
  lamp: "#fff2c8", red: C.red, orange: C.orange, ink: C.ink, dim: "rgba(244,239,230,.55)", cyan: "#5ff0ff", gold: "#e9c762", sky: "#9fd3e6",
};
export const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const lin = (f: number, a: number, b: number, x0: number, x1: number) => x0 + (x1 - x0) * Math.min(1, Math.max(0, (f - a) / (b - a)));
export const SV: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>{children}</svg>
);
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * Math.min(1, Math.max(0, k)))).join(",")})`; };
// color del agua según profundidad 0 (superficie) .. 1 (fosa)
export const waterAt = (k: number) => {
  const S = [O.surf, O.shallow, O.mid, O.deep, O.abyss, O.black], x = Math.min(0.999, Math.max(0, k)) * (S.length - 1), i = Math.floor(x);
  return mix(S[i], S[i + 1], x - i);
};

// ---------- agua: degradé por profundidad + nieve marina que deriva + rayos opcionales ----------
export const Water: React.FC<{ top?: number; bot?: number; snow?: number; rays?: number; drift?: number; children?: React.ReactNode }> = ({ top = 0.3, bot = 0.6, snow = 1, rays = 0, drift = 1, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${waterAt(top)} 0%, ${waterAt(bot)} 100%)`, overflow: "hidden" }}>
      {rays > 0 && <SV>{[0, 1, 2, 3, 4].map((i) => { const x = 200 + i * 380 + Math.sin(f / 50 + i) * 40; return <path key={i} d={`M${x},-20 L${x + 120},-20 L${x + 420},1100 L${x + 160},1100 Z`} fill="#e8fbff" opacity={rays * (0.05 + 0.04 * Math.sin(f / 30 + i * 2))} />; })}</SV>}
      <Plate kind="snow" rate={0.45} style={{ mixBlendMode: "screen", opacity: 0.4 * Math.min(1, snow) }} vstyle={{ filter: "grayscale(1) contrast(1.4) brightness(0.9)" }} />
      <Snow n={Math.round(70 * snow)} drift={drift} />
      {children}
    </AbsoluteFill>
  );
};
// partículas: suben despacio (la cámara baja) o caen (drift<0); tamaños y brillo al azar
export const Snow: React.FC<{ n?: number; drift?: number; color?: string; x0?: number; x1?: number; y0?: number; y1?: number; size?: number }> = ({ n = 110, drift = 1, color = O.snow, x0 = 0, x1 = 1920, y0 = -40, y1 = 1120, size = 1 }) => {
  const f = useCurrentFrame(), H = y1 - y0;
  return <>{Array.from({ length: n }).map((_, i) => {
    const sp = (0.4 + rnd(i, 2) * 1.4) * drift, y = y0 + ((((rnd(i, 3) * H - f * sp) % H) + H) % H), x = x0 + rnd(i, 4) * (x1 - x0) + Math.sin(f / 40 + i) * 8, r = (1 + rnd(i, 5) * 2.6) * size;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: color, opacity: 0.18 + rnd(i, 6) * 0.5 }} />;
  })}</>;
};
// fondo de barro con lomas suaves y piedritas
export const Floor: React.FC<{ y: number; color?: string; color2?: string; seed?: number; lit?: number }> = ({ y, color = O.mud, color2 = O.mud2, seed = 1, lit = 1 }) => {
  const pts = Array.from({ length: 13 }).map((_, i) => [i * 170 - 60, y + Math.sin(i * 1.7 + seed) * 18 + rnd(i, seed) * 14]);
  const d = `M-80,1100 ${pts.map(([x, yy]) => `L${x},${yy}`).join(" ")} L2000,${y} L2000,1100 Z`;
  return <SV><defs><linearGradient id={`fl${seed}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={mix(color, "#000000", 1 - lit)} /><stop offset="100%" stopColor={mix(color2, "#000000", 0.4)} /></linearGradient>
      <filter id={`flr${seed}`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.09" numOctaves={4} seed={seed} result="n" />
        <feDiffuseLighting in="n" lightingColor="#e8dcc8" surfaceScale={5} result="l"><feDistantLight azimuth={250} elevation={40} /></feDiffuseLighting>
        <feComposite in="l" in2="SourceGraphic" operator="in" result="c" /><feBlend in="SourceGraphic" in2="c" mode="multiply" /></filter></defs>
    <path d={d} fill={`url(#fl${seed})`} filter={`url(#flr${seed})`} />
    <path d={d.split(" L2000")[0].replace("M-80,1100 ", "M")} fill="none" stroke="#d9e8ee" strokeWidth={2} opacity={0.18 * lit} />
    {Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={rnd(i, seed + 7) * 1920} cy={y + 30 + rnd(i, seed + 8) * (1080 - y)} rx={4 + rnd(i, 9) * 10} ry={2 + rnd(i, 10) * 4} fill="#000" opacity={0.18} />)}
  </SV>;
};
// cono de luz desde (x,y) hacia el ángulo dado (grados, 90 = abajo)
export const Beam: React.FC<{ x: number; y: number; ang?: number; len?: number; w?: number; on?: number; color?: string }> = ({ x, y, ang = 90, len = 900, w = 34, on = 1, color = O.lamp }) => {
  const a = (ang * Math.PI) / 180, ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len, nx = -Math.sin(a), ny = Math.cos(a), hw = Math.tan((w * Math.PI) / 360) * len;
  const id = `bm${Math.round(x)}_${Math.round(y)}_${Math.round(ang)}`;
  return <SV><defs><linearGradient id={id} x1={x} y1={y} x2={ex} y2={ey} gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={color} stopOpacity={0.55 * on} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
    <path d={`M${x},${y} L${ex + nx * hw},${ey + ny * hw} L${ex - nx * hw},${ey - ny * hw} Z`} fill={`url(#${id})`} /></SV>;
};

// ---------- personas ----------
// muñequito sentado con las rodillas arriba (dentro de la esfera)
export const Sitter: React.FC<{ x: number; y: number; s?: number; shake?: number }> = ({ x, y, s = 1, shake = 0 }) => {
  const f = useCurrentFrame(), j = shake * Math.sin(f * 1.7) * 2;
  return <svg width={200 * s} height={200 * s} viewBox="0 0 200 200" style={{ position: "absolute", left: x - 100 * s + j, top: y - 200 * s, overflow: "visible" }}>
    <rect x={62} y={150} width={90} height={22} rx={10} fill="#2d3a5a" />
    <rect x={120} y={98} width={20} height={70} rx={9} fill="#2d3a5a" transform="rotate(-28 130 160)" />
    <rect x={56} y={74} width={46} height={92} rx={16} fill={C.vest} transform="rotate(-8 80 150)" />
    <rect x={92} y={96} width={12} height={58} rx={5} fill="#f2c49b" transform="rotate(-60 98 100)" />
    <circle cx={86} cy={58} r={24} fill="#f2c49b" />
    <path d="M62,52 Q86,22 110,52 L110,44 Q86,14 62,44 Z" fill="#5a3a22" />
  </svg>;
};

// ---------- esfera de acero en corte (adentro el muñequito) ----------
export const Sphere: React.FC<{ x: number; y: number; r?: number; inside?: boolean; lit?: number; shake?: number }> = ({ x, y, r = 300, inside = true, lit = 0, shake = 0 }) => {
  const f = useCurrentFrame(), j = shake * Math.sin(f * 2.3) * 3;
  return <div style={{ position: "absolute", left: x - r + j, top: y - r, width: 2 * r, height: 2 * r }}>
    <svg width={2 * r} height={2 * r} viewBox="-100 -100 200 200" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs><radialGradient id="sph" cx="35%" cy="30%"><stop offset="0%" stopColor="#c9d2da" /><stop offset="55%" stopColor={O.steel} /><stop offset="100%" stopColor={O.steel2} /></radialGradient></defs>
      <circle r={100} fill="url(#sph)" />
      {inside && <circle r={84} fill="#11161c" />}
      {inside && <circle r={84} fill="none" stroke="#000" strokeWidth={3} opacity={0.5} />}
      {/* escotilla arriba con pernos */}
      <rect x={-26} y={-104} width={52} height={14} rx={4} fill={O.steel2} />
      {[-20, -10, 0, 10, 20].map((b) => <circle key={b} cx={b} cy={-97} r={2.2} fill="#cfd6dc" />)}
      {/* ventanita */}
      <circle cx={70} cy={22} r={15} fill={inside ? "#0a2a3f" : "#173b52"} stroke="#c9d2da" strokeWidth={4} />
      <circle cx={70} cy={22} r={15} fill={O.lamp} opacity={lit * 0.5} />
    </svg>
    {inside && <Sitter x={r * 0.9} y={r * 1.62} s={r / 300} shake={shake} />}
  </div>;
};
// sumergible por fuera: esfera blanca con dos faroles y haces hacia abajo
export const Sub: React.FC<{ x: number; y: number; s?: number; on?: number; ang?: number }> = ({ x, y, s = 1, on = 1, ang = 70 }) => {
  const f = useCurrentFrame(), bob = Math.sin(f / 22) * 6;
  return <>
    <Beam x={x - 70 * s} y={y + 30 * s + bob} ang={ang + 20} len={1100 * s} w={30} on={on} />
    <Beam x={x + 70 * s} y={y + 30 * s + bob} ang={ang} len={1100 * s} w={30} on={on} />
    <svg width={260 * s} height={220 * s} viewBox="-130 -110 260 220" style={{ position: "absolute", left: x - 130 * s, top: y - 110 * s + bob, overflow: "visible" }}>
      <rect x={-118} y={10} width={236} height={26} rx={10} fill="#d8d0b8" />
      <circle r={86} fill="#e9ecef" /><circle r={86} fill="none" stroke="#9aa3ab" strokeWidth={6} />
      <circle cx={0} cy={6} r={34} fill="#0d2232" stroke="#9aa3ab" strokeWidth={6} />
      <circle cx={-10} cy={-4} r={9} fill="#ffffff" opacity={0.35} />
      {[-70, 70].map((lx) => <g key={lx}><rect x={lx - 16} y={18} width={32} height={22} rx={6} fill="#5b6570" /><circle cx={lx} cy={36} r={11} fill={O.lamp} opacity={0.25 + 0.75 * on} /></g>)}
    </svg>
  </>;
};

// ---------- anfípodo (vista de costado): cuerpo curvo de segmentos, antenas, patas que caminan ----------
export const Amphi: React.FC<{ x: number; y: number; s?: number; flip?: boolean; walk?: boolean; color?: string; stroke?: string; ph?: number; xray?: boolean; metal?: number; fiber?: number }> = ({
  x, y, s = 1, flip = false, walk = true, color = O.ivory, stroke = O.ivory2, ph = 0, xray = false, metal = 0, fiber = 0,
}) => {
  const f = useCurrentFrame(), t = (f + ph) / 3.2;
  const segs = Array.from({ length: 10 }).map((_, i) => { const a = Math.PI * (0.95 - i * 0.075); return [Math.cos(a) * 120 + 10, -Math.sin(a) * 60 + 40, 26 - Math.abs(i - 3.5) * 2.2]; });
  const gid = `am${Math.round(x)}_${Math.round(y)}`, fill = xray ? "rgba(95,240,255,.10)" : `url(#${gid})`, st = xray ? O.cyan : stroke;
  return <svg width={320 * s} height={200 * s} viewBox="-160 -80 320 200" style={{ position: "absolute", left: x - 160 * s, top: y - 120 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, filter: xray ? undefined : "drop-shadow(0 0 10px rgba(255,236,205,.28))" }}>
    <defs><radialGradient id={gid} cx="0.4" cy="0.25" r="0.8"><stop offset="0%" stopColor="#fffaf0" stopOpacity={0.95} /><stop offset="45%" stopColor={color} stopOpacity={0.82} /><stop offset="100%" stopColor={mix(stroke, "#2a1e12", 0.5)} stopOpacity={0.9} /></radialGradient></defs>
    {/* patas */}
    {Array.from({ length: 7 }).map((_, i) => { const [sx, sy] = segs[i + 2], w = walk ? Math.sin(t + i * 0.9) * 14 : 0; return <path key={i} d={`M${sx},${sy + 14} q${-6 + w * 0.4},26 ${-14 + w},48`} stroke={st} strokeWidth={5} fill="none" strokeLinecap="round" />; })}
    {/* antenas */}
    <path d={`M${segs[0][0] - 10},${segs[0][1] - 4} q-60,-${50 + Math.sin(t / 2) * 8} -120,-20`} stroke={st} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <path d={`M${segs[0][0] - 12},${segs[0][1] + 2} q-50,-${20 + Math.sin(t / 2 + 1) * 6} -110,10`} stroke={st} strokeWidth={3} fill="none" strokeLinecap="round" />
    {/* segmentos */}
    {segs.map(([sx, sy, r], i) => <ellipse key={i} cx={sx} cy={sy} rx={r * 1.05} ry={r} fill={fill} stroke={st} strokeWidth={xray ? 3 : 1.5} strokeOpacity={xray ? 1 : 0.6} />)}
    {!xray && segs.map(([sx, sy, r], i) => <ellipse key={"h" + i} cx={sx - r * 0.25} cy={sy - r * 0.5} rx={r * 0.45} ry={r * 0.18} fill="#ffffff" opacity={0.45} />)}
    {metal > 0 && segs.map(([sx, sy, r], i) => <ellipse key={"m" + i} cx={sx} cy={sy - 2} rx={r * 1.12} ry={r * 1.06} fill="none" stroke="#dfe8f0" strokeWidth={6} opacity={metal * (0.6 + 0.4 * Math.sin(f / 8 + i))} />)}
    {fiber > 0 && <path d={`M${segs[2][0]},${segs[2][1]} Q${segs[5][0]},${segs[5][1] + 24} ${segs[8][0]},${segs[8][1] - 6}`} stroke="#3a8bff" strokeWidth={4} fill="none" strokeDasharray="300" strokeDashoffset={300 * (1 - fiber)} style={{ filter: "drop-shadow(0 0 6px #3a8bff)" }} />}
    {/* ojo */}
    <circle cx={segs[0][0] + 4} cy={segs[0][1] - 6} r={4} fill={xray ? O.cyan : "#2b2016"} />
    {/* cola */}
    <path d={`M${segs[9][0]},${segs[9][1]} l18,18 m-18,-18 l6,24`} stroke={st} strokeWidth={4} strokeLinecap="round" />
  </svg>;
};
// pez caracol / fantasma: cabeza grande, cuerpo que se afina, cola que ondula
export const Ghost: React.FC<{ x: number; y: number; s?: number; flip?: boolean; color?: string; op?: number }> = ({ x, y, s = 1, flip = false, color = "#f3d7d0", op = 0.85 }) => {
  const f = useCurrentFrame(), w = Math.sin(f / 6) * 10;
  return <svg width={300 * s} height={140 * s} viewBox="0 -70 300 140" style={{ position: "absolute", left: x - 150 * s, top: y - 70 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, opacity: op }}>
    <path d={`M20,0 C20,-46 110,-50 150,-24 C200,-10 250,${-8 + w} 290,${w} C250,${10 + w} 200,14 150,26 C110,48 20,46 20,0 Z`} fill={color} opacity={0.75} />
    <circle cx={60} cy={-10} r={9} fill="#1b1b1b" opacity={0.7} />
  </svg>;
};
// pez común en silueta (para cardúmenes)
export const Fish: React.FC<{ x: number; y: number; s?: number; flip?: boolean; color?: string; op?: number }> = ({ x, y, s = 1, flip = false, color = "#0a1c2a", op = 1 }) => {
  const f = useCurrentFrame(), w = Math.sin(f / 4 + x) * 6;
  return <svg width={120 * s} height={50 * s} viewBox="0 -25 120 50" style={{ position: "absolute", left: x - 60 * s, top: y - 25 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, opacity: op }}>
    <path d={`M5,0 Q40,-22 85,-4 L115,${-16 + w} L108,${w} L115,${16 + w} L85,4 Q40,22 5,0 Z`} fill={color} />
  </svg>;
};
// barco de investigación en silueta sobre la línea de superficie y
export const Ship: React.FC<{ x: number; y: number; s?: number; color?: string; old?: boolean }> = ({ x, y, s = 1, color = "#0c1824", old = false }) => {
  const f = useCurrentFrame(), roll = Math.sin(f / 26) * 1.6;
  return <svg width={520 * s} height={260 * s} viewBox="0 -200 520 260" style={{ position: "absolute", left: x - 260 * s, top: y - 200 * s, overflow: "visible", transform: `rotate(${roll}deg)`, transformOrigin: "50% 77%" }}>
    <path d="M10,-10 L500,-10 L470,40 L40,40 Z" fill={color} />
    <rect x={120} y={-70} width={190} height={60} fill={color} /><rect x={170} y={-110} width={90} height={42} fill={color} />
    {old ? <><rect x={350} y={-190} width={8} height={180} fill={color} /><path d="M358,-180 L440,-30 L358,-30 Z" fill={color} opacity={0.85} /></>
      : <><rect x={330} y={-150} width={10} height={140} fill={color} /><path d="M335,-150 L430,-20" stroke={color} strokeWidth={6} /><rect x={60} y={-40} width={50} height={30} fill={color} /></>}
    {[150, 190, 230, 270].map((wx) => <rect key={wx} x={wx} y={-58} width={18} height={12} fill="#ffd48a" opacity={0.7} />)}
  </svg>;
};
// regla de profundidad vertical: marcas en metros, puntero en `at` metros
export const Ruler: React.FC<{ x: number; y0: number; y1: number; max: number; marks: [number, string?][]; at?: number; hot?: number; side?: "l" | "r" }> = ({ x, y0, y1, max, marks, at, hot, side = "r" }) => {
  const Y = (m: number) => y0 + (y1 - y0) * (m / max), tx = side === "r" ? 30 : -30;
  return <>
    <SV><line x1={x} y1={y0} x2={x} y2={y1} stroke="rgba(244,239,230,.55)" strokeWidth={4} />
      {marks.map(([m], i) => <line key={i} x1={x - 14} y1={Y(m)} x2={x + 14} y2={Y(m)} stroke={hot === m ? O.red : "rgba(244,239,230,.7)"} strokeWidth={hot === m ? 6 : 3} />)}</SV>
    {marks.map(([m, lab], i) => <div key={i} style={{ position: "absolute", left: side === "r" ? x + tx : undefined, right: side === "l" ? 1920 - x + 30 : undefined, top: Y(m) - 22, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: hot === m ? O.red : O.ink, textShadow: "0 2px 8px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>
      {m.toLocaleString("en-US")} m{lab ? <span style={{ fontWeight: 700, fontSize: 28, color: hot === m ? O.red : O.dim, marginLeft: 14 }}>{lab}</span> : null}</div>)}
    {at != null && <div style={{ position: "absolute", left: x - 26, top: Y(at) - 13, width: 52, height: 26, borderRadius: 13, background: O.orange, boxShadow: `0 0 20px ${O.orange}` }} />}
  </>;
};
// contador grande (metros, atmósferas…) con unidad
export const Counter: React.FC<{ x: number; y: number; v: number; unit?: string; size?: number; color?: string; align?: "left" | "right" | "center"; label?: string }> = ({ x, y, v, unit = "m", size = 120, color = O.ink, align = "left", label }) => (
  <div style={{ position: "absolute", left: align === "left" ? x : undefined, right: align === "right" ? 1920 - x : undefined, top: y, fontFamily: FONT, fontWeight: 900, fontSize: size, color, lineHeight: 1, textShadow: "0 6px 26px rgba(0,0,0,.6)", textAlign: align, ...(align === "center" ? { left: 0, right: 0 } : {}) }}>
    {Math.round(v).toLocaleString("en-US")}<span style={{ fontSize: size * 0.42, marginLeft: size * 0.12, color: O.dim }}>{unit}</span>
    {label && <div style={{ fontSize: size * 0.3, fontWeight: 800, color: O.orange, letterSpacing: 2, marginTop: 10, textTransform: "uppercase" }}>{label}</div>}
  </div>
);
export const Tag: React.FC<{ x: number; y: number; op?: number; color?: string; size?: number; children: React.ReactNode; center?: boolean }> = ({ x, y, op = 1, color = O.ink, size = 40, children, center }) => (
  <div style={{ position: "absolute", left: center ? x - 600 : x, width: center ? 1200 : undefined, textAlign: center ? "center" : undefined, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color, opacity: op, textShadow: "0 3px 12px rgba(0,0,0,.85)", whiteSpace: "nowrap" }}>{children}</div>
);
// flecha dibujada que crece (k 0..1)
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k?: number; color?: string; w?: number }> = ({ x1, y1, x2, y2, k = 1, color = O.orange, w = 10 }) => {
  const ex = x1 + (x2 - x1) * k, ey = y1 + (y2 - y1) * k, a = Math.atan2(y2 - y1, x2 - x1), h = w * 2.6;
  return <SV><line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={w} strokeLinecap="round" opacity={k > 0.01 ? 1 : 0} />
    {k > 0.05 && <path d={`M${ex + Math.cos(a) * h * 0.6},${ey + Math.sin(a) * h * 0.6} L${ex + Math.cos(a + 2.5) * h},${ey + Math.sin(a + 2.5) * h} L${ex + Math.cos(a - 2.5) * h},${ey + Math.sin(a - 2.5) * h} Z`} fill={color} />}</SV>;
};

// ---------- mapas planos (png ocre de mapr.py + json con lugares en fracción) ----------
export type MapDef = { ar: number; pts: Record<string, number[]> };
export const GeoBase: React.FC<{ png: string; m: MapDef; zoom?: [number, number]; fx?: number; fy?: number; children?: (P: (k: string | number[]) => [number, number]) => React.ReactNode; d: number; W?: number }> = ({ png, m, zoom = [1, 1.08], fx = 0.5, fy = 0.5, children, d, W }) => {
  const f = useCurrentFrame(), z = zoom[0] + (zoom[1] - zoom[0]) * ease(f, 0, Math.max(30, d)), w = W ?? Math.min(1920, 1080 * m.ar), h = w / m.ar, X = (1920 - w) / 2, Y = (1080 - h) / 2;
  const P = (k: string | number[]): [number, number] => { const p = typeof k === "string" ? m.pts[k] : k; return p ? [X + p[0] * w, Y + p[1] * h] : [-999, -999]; };
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #14385a 0%, #081a2c 70%, #050f1a 100%)", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
      <Img src={staticFile(png)} style={{ position: "absolute", left: X, top: Y, width: w, height: h }} />
      {children?.(P)}
    </AbsoluteFill>
  </AbsoluteFill>;
};
// punto que late + etiqueta
export const Pin: React.FC<{ x: number; y: number; k?: number; label?: string; color?: string; left?: boolean; size?: number }> = ({ x, y, k = 1, label, color = O.red, left, size = 40 }) => {
  const f = useCurrentFrame(), p = (f % 40) / 40;
  return <>
    <div style={{ position: "absolute", left: x - 50 * p, top: y - 50 * p, width: 100 * p, height: 100 * p, borderRadius: "50%", border: `4px solid ${color}`, opacity: k * (1 - p) }} />
    <div style={{ position: "absolute", left: x - 12, top: y - 12, width: 24, height: 24, borderRadius: 12, background: color, boxShadow: `0 0 22px 6px ${color}`, transform: `scale(${k})` }} />
    {label && <div style={{ position: "absolute", left: left ? undefined : x + 26, right: left ? 1920 - x + 26 : undefined, top: y - size * 0.7, fontFamily: FONT, fontWeight: 800, fontSize: size, color: O.ink, opacity: k, textShadow: "0 3px 10px rgba(0,0,0,.85)", whiteSpace: "nowrap" }}>{label}</div>}
  </>;
};
// polilínea que se dibuja (k 0..1)
export const Draw: React.FC<{ pts: [number, number][]; k: number; color?: string; w?: number; dash?: string; glow?: boolean }> = ({ pts, k, color = O.red, w = 8, dash, glow }) => {
  const L = pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  return <SV><path d={"M" + pts.map((p) => p.join(",")).join(" L")} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"
    strokeDasharray={dash ?? `${L} ${L}`} strokeDashoffset={dash ? 0 : L * (1 - k)} opacity={dash ? k : 1} style={glow ? { filter: `drop-shadow(0 0 10px ${color})` } : undefined} /></SV>;
};
