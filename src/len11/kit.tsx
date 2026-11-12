// kit de héroes de Lenny (len11): orden de trabajo del plomero. Talonario crema con carbónico, plano azul,
// sello rojo FIXED, lápiz de carpintero, cinta de teflón, cobre. Todo SVG 1920x1080, sin imágenes salvo las que se pasan.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONTS } from "./Piezas";

export const { SERIF: SLAB, SANS, HAND } = FONTS;
export const K = {
  cream: "#F3EAD6", pad: "#EFE3C6", rule: "rgba(46,92,150,0.22)", navy: "#14263D", blue: "#1E4470", line: "rgba(190,215,240,0.55)",
  red: C.ver, copper: "#B87333", ink: "#1C2430", graphite: "#3B3B3E", porcelain: "#FBF9F3", water: "#8FC1DD", waterD: "#5E9CC2",
  lime: "#C9B07C", rust: "#9A5527", mold: "#3E4A3A", white: "#FFFBF2", green: "#3F7D4E",
};
export const FPS = 30;
export const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eio = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const eout = (x: number) => 1 - Math.pow(1 - cl(x), 3);
/** progreso 0..1 entre los segundos a y b */
export const pr = (t: number, a: number, b: number) => cl((t - a) / Math.max(0.001, b - a));
/** resorte amortiguado (0→1 con rebote) a partir del segundo a */
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 7 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.7); };
export const useT = () => useCurrentFrame() / FPS;
export const useFade = (dur: number) => { const f = useCurrentFrame(); return interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); };

// ---------- fondos
export const Pad: React.FC<{ no?: string; children?: React.ReactNode; dark?: boolean }> = ({ no = "0427", children, dark }) => (
  <AbsoluteFill style={{ background: dark ? K.navy : K.pad, overflow: "hidden" }}>
    {!dark && <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, ${K.rule} 0 2px, transparent 2px 54px)`, backgroundPosition: "0 160px" }} />}
    {!dark && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.35), rgba(120,90,40,0.18) 100%)" }} />}
    {!dark && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 118, background: K.navy, display: "flex", alignItems: "center", padding: "0 70px", justifyContent: "space-between" }}>
      <span style={{ fontFamily: SLAB, fontWeight: 700, fontSize: 40, color: K.cream, letterSpacing: 3 }}>LENNY&rsquo;S PLUMBING</span>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: K.copper, letterSpacing: 6 }}>WORK ORDER No. {no}</span>
    </div>}
    {!dark && <div style={{ position: "absolute", left: 120, top: 118, bottom: 0, width: 3, background: "rgba(184,50,42,0.35)" }} />}
    {children}
  </AbsoluteFill>
);
export const Blueprint: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${K.blue}, ${K.navy})`, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${K.line} 1px, transparent 1px), linear-gradient(90deg, ${K.line} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.35 }} />
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${K.line} 1px, transparent 1px), linear-gradient(90deg, ${K.line} 1px, transparent 1px)`, backgroundSize: "300px 300px", opacity: 0.55 }} />
    {children}
  </AbsoluteFill>
);
/** foto o clip de fondo oscurecido (para poner piezas encima del material real) */
export const Under: React.FC<{ src?: string; dark?: number; blur?: number; children?: React.ReactNode }> = ({ src, dark = 0.45, blur = 0, children }) => {
  const f = useCurrentFrame();
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + f * 0.0004})`, filter: `brightness(${1 - dark}) blur(${blur}px)` };
  return (
    <AbsoluteFill style={{ background: K.navy, overflow: "hidden" }}>
      {src && (src.endsWith(".mp4") ? <OffthreadVideo src={staticFile(src)} muted style={st} /> : <Img src={staticFile(src)} style={st} />)}
      {children}
    </AbsoluteFill>
  );
};

// ---------- texto
export const Title: React.FC<{ t: number; kick?: string; text: string; x?: number; y?: number; col?: string; size?: number; at?: number; light?: boolean }> = ({ t, kick, text, x = 160, y = 190, col, size = 74, at = 0.1, light }) => {
  const p = spr(t, at);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: cl(p * 1.4), transform: `translateY(${(1 - p) * 24}px)` }}>
      {kick && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 7, color: K.copper, marginBottom: 8 }}>{kick}</div>}
      <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: size, lineHeight: 1.04, color: col || (light ? K.cream : K.ink) }}>{text}</div>
    </div>
  );
};
/** rótulo a lápiz de carpintero, con línea guía opcional dibujándose */
export const Pencil: React.FC<{ t: number; at: number; x: number; y: number; text: string; to?: [number, number]; size?: number; col?: string; anchor?: "start" | "middle" | "end"; out?: number }> = ({ t, at, x, y, text, to, size = 46, col = K.graphite, anchor = "start", out = 1e9 }) => {
  const p = pr(t, at, at + 0.5), o = 1 - pr(t, out, out + 0.3);
  const n = Math.round(text.length * p);
  return (
    <g opacity={o}>
      {to && <path d={`M${x} ${y + 10} Q${(x + to[0]) / 2 + 30} ${(y + to[1]) / 2 - 40} ${to[0]} ${to[1]}`} fill="none" stroke={col} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pr(t, at + 0.2, at + 0.7)} />}
      {to && pr(t, at + 0.6, at + 0.7) > 0 && <circle cx={to[0]} cy={to[1]} r={7} fill={col} />}
      <text x={x} y={y} fontFamily={HAND} fontWeight={700} fontSize={size} fill={col} textAnchor={anchor}>{text.slice(0, n)}</text>
    </g>
  );
};
/** sello de goma rojo que golpea */
export const Stamp: React.FC<{ t: number; at: number; x: number; y: number; text?: string; rot?: number; size?: number; col?: string }> = ({ t, at, x, y, text = "FIXED", rot = -12, size = 96, col = K.red }) => {
  if (t < at) return null;
  const k = pr(t, at, at + 0.18); const sc = lerp(2.4, 1, eout(k));
  const w = text.length * size * 0.66 + 60;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={cl(k * 3) * 0.92}>
      <rect x={-w / 2} y={-size * 0.78} width={w} height={size * 1.36} rx={14} fill="none" stroke={col} strokeWidth={9} />
      <rect x={-w / 2 + 12} y={-size * 0.78 + 12} width={w - 24} height={size * 1.36 - 24} rx={8} fill="none" stroke={col} strokeWidth={3} />
      <text x={0} y={size * 0.3} textAnchor="middle" fontFamily={SLAB} fontWeight={700} fontSize={size} fill={col} letterSpacing={6}>{text}</text>
    </g>
  );
};
/** marca discreta de las láminas que salen del libro */
export const FromBook: React.FC<{ x?: number; y?: number }> = ({ x = 1680, y = 1010 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 5, color: K.copper, opacity: 0.85, borderTop: `2px solid ${K.copper}`, paddingTop: 4 }}>FROM THE BOOK</div>
);
export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>{children}</svg>
);

// ---------- piezas de plomería en corte
/** inodoro en corte (vista lateral): taza, sifón, agua a nivel `lvl` (0..1), anillo de cal de grosor `ring` (0..1) */
export const BowlCut: React.FC<{ x: number; y: number; s?: number; lvl?: number; ring?: number; ringCol?: string; glow?: number; children?: React.ReactNode }> = ({ x, y, s = 1, lvl = 1, ring = 1, ringCol = K.rust, glow = 0, children }) => {
  const wy = lerp(250, 120, lvl); // altura del agua dentro de la taza
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-300 40 Q-300 330 -60 360 L-40 470 L60 470 L80 360 Q300 330 300 40 Z" fill={K.porcelain} stroke={K.ink} strokeWidth={6} />
      <path d="M-262 60 Q-262 300 -40 320 L-20 420 L40 420 L56 320 Q262 300 262 60 Z" fill="#E9EEF0" stroke="#B9C2C7" strokeWidth={3} />
      <clipPath id="bowlIn"><path d="M-262 60 Q-262 300 -40 320 L-20 420 L40 420 L56 320 Q262 300 262 60 Z" /></clipPath>
      <g clipPath="url(#bowlIn)">
        <rect x={-300} y={wy} width={600} height={500} fill={K.water} opacity={0.85} />
        <rect x={-300} y={wy} width={600} height={6} fill="#fff" opacity={0.6} />
        {ring > 0 && <>
          <rect x={-300} y={120 - 16 * ring} width={600} height={30 * ring} fill={ringCol} opacity={0.85} />
          {glow > 0 && <rect x={-300} y={120 - 22} width={600} height={42} fill={K.copper} opacity={glow * 0.4} />}
        </>}
      </g>
      <rect x={-330} y={10} width={660} height={44} rx={20} fill={K.porcelain} stroke={K.ink} strokeWidth={6} />
      {children}
    </g>
  );
};
/** vaso medidor de vidrio con nivel 0..1 (1 taza) */
export const Cup: React.FC<{ x: number; y: number; s?: number; lvl?: number; steam?: number; t?: number; tint?: string }> = ({ x, y, s = 1, lvl = 1, steam = 0, t = 0, tint = "#F2EBD0" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M-80 ${-150 + 230 * (1 - lvl)} L80 ${-150 + 230 * (1 - lvl)} L70 80 L-70 80 Z`} fill={tint} opacity={0.85} />
    <path d="M-90 -170 L90 -170 L76 86 L-76 86 Z" fill="rgba(255,255,255,0.18)" stroke={K.ink} strokeWidth={5} />
    <path d="M90 -120 Q150 -110 140 -30 Q132 20 82 10" fill="none" stroke={K.ink} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={-88} x2={-60} y1={-140 + i * 55} y2={-140 + i * 55} stroke={K.red} strokeWidth={3} />)}
    {steam > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${-40 + i * 40} -190 q 18 -30 0 -60 q -18 -30 0 -60`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={steam * (0.4 + 0.3 * Math.sin(t * 3 + i))} transform={`translate(0 ${-((t * 30 + i * 20) % 30)})`} />)}
  </g>
);
/** carátula de reloj / cronómetro de cocina */
export const Dial: React.FC<{ x: number; y: number; r?: number; frac: number; label?: string; col?: string }> = ({ x, y, r = 200, frac, label, col = K.red }) => {
  const a = -Math.PI / 2 + frac * Math.PI * 2;
  const big = frac > 0.5 ? 1 : 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 18} fill={K.white} stroke={K.ink} strokeWidth={8} />
      {frac > 0.001 && <path d={`M0 0 L0 ${-r} A${r} ${r} 0 ${big} 1 ${Math.cos(a) * r} ${Math.sin(a) * r} Z`} fill={col} opacity={0.85} />}
      {Array.from({ length: 60 }, (_, i) => <line key={i} x1={0} x2={0} y1={-r} y2={-r + (i % 5 ? 12 : 26)} stroke={K.ink} strokeWidth={i % 5 ? 2 : 5} transform={`rotate(${i * 6})`} />)}
      <line x1={0} y1={0} x2={Math.cos(a) * r * 0.86} y2={Math.sin(a) * r * 0.86} stroke={K.ink} strokeWidth={10} strokeLinecap="round" />
      <circle r={16} fill={K.ink} />
      {label && <text y={r * 0.5} textAnchor="middle" fontFamily={SLAB} fontWeight={700} fontSize={r * 0.3} fill={K.ink}>{label}</text>}
    </g>
  );
};
/** piedra pómez en mango, ángulo en grados, `wet` 0..1 */
export const Pumice: React.FC<{ x: number; y: number; s?: number; rot?: number; wet?: number }> = ({ x, y, s = 1, rot = 0, wet = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-14} y={-330} width={28} height={300} rx={10} fill="#B07A44" stroke={K.ink} strokeWidth={4} />
    <rect x={-90} y={-40} width={180} height={90} rx={26} fill={wet > 0.5 ? "#8D8F8C" : "#C7C5BD"} stroke={K.ink} strokeWidth={5} />
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-70 + ((i * 37) % 140)} cy={-20 + ((i * 23) % 60)} r={3 + (i % 3)} fill="rgba(40,40,40,0.35)" />)}
    {wet > 0.5 && [0, 1, 2].map((i) => <circle key={i} cx={-50 + i * 50} cy={58} r={6} fill={K.water} />)}
  </g>
);
/** cinta de teflón como barra de avance (0..1) */
export const Teflon: React.FC<{ x: number; y: number; w: number; frac: number; label?: string }> = ({ x, y, w, frac, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-12} width={w} height={24} rx={4} fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
    <rect x={0} y={-12} width={w * frac} height={24} rx={4} fill="#F7F7F2" />
    {Array.from({ length: Math.floor(w * frac / 18) }, (_, i) => <line key={i} x1={i * 18} x2={i * 18 + 10} y1={-12} y2={12} stroke="rgba(0,0,0,0.08)" strokeWidth={2} />)}
    <circle cx={w * frac} cy={0} r={30} fill="#F7F7F2" stroke="#ccc" strokeWidth={3} />
    <circle cx={w * frac} cy={0} r={12} fill={K.red} />
    {label && <text x={0} y={-30} fontFamily={SANS} fontWeight={700} fontSize={22} letterSpacing={5} fill={K.cream}>{label}</text>}
  </g>
);
