// ckit · escenario de los componentes únicos de Cuca (1 por minuto, ninguno repetido en la tanda cuca29).
// Base: hkit de tdc28a (Stage con máscara de entrada, cámara curva, piso de luz, polvo en primer plano) en paleta de barro/cal/maíz.
// Cada componente dibuja su OBJETO adentro; el fondo es la foto del momento desenfocada (h.bg), nunca un panel vacío.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { CU, FONT, P } from "./lib";

export const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export { FONT, CU };
export const phys = (t: number, a: number, w = 7, z = 0.42) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const eIn = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };
export const eio = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const img = (id: string) => staticFile(P + "img_" + id + ".jpg");
export const TX = CU.cal, DIM = "rgba(246,241,228,.6)", MZ = CU.maiz, BR = CU.barro, RED = CU.chile, VER = CU.verde, TIN = CU.tinta;
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export type H = { k: string; at: number; out: number; bg?: string; imgs?: string[]; [x: string]: any };
export type Mode = "iris" | "wipe" | "blinds" | "split" | "drop" | "diag" | "ring";

const maskOf = (m: Mode, p: number): string => {
  if (p > 0.97) return "linear-gradient(#000,#000)";
  if (m === "iris") return `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;
  if (m === "wipe") return `linear-gradient(105deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
  if (m === "diag") return `linear-gradient(225deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
  if (m === "split") { const a = 50 - p * 62, b = 50 + p * 62; return `linear-gradient(90deg, transparent ${a}%, #000 ${a + 10}%, #000 ${b - 10}%, transparent ${b}%)`; }
  if (m === "ring") return `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, 900 - p * 1100)}px, #000 ${Math.max(0, 900 - p * 1100) + 60}px)`;
  if (m === "blinds") return `linear-gradient(0deg, #000 ${p * 150 - 40}%, transparent ${p * 150}%)`; // cortina suave de abajo (las persianas dejaban rayas)
  return `linear-gradient(180deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
};

// escenario: foto del momento desenfocada + piso de luz cálida + haz de arriba + polvo delante; cámara curva (nunca zoom lineal)
export const Stage: React.FC<{ t: number; h: H; mode: Mode; tone?: string; cam?: number; mesa?: boolean; children: (tt: number) => React.ReactNode }> = ({ t, h, mode, tone = "#21160f", cam = 1, mesa = true, children }) => {
  const { at, out } = h;
  if (t < at - 0.05 || t > out + 0.85) return null;
  const inn = phys(t, at, 3.8, 0.72), xo = eIn(t, out - 0.25, out + 0.75), p = cl(inn) * (1 - xo);
  if (p <= 0.004) return null;
  const tt = t - at, D = Math.max(4, out - at);
  return <AbsoluteFill style={{ opacity: cl(p * 1.25), fontFamily: FONT, color: TX } as React.CSSProperties}>{/* fundido con profundidad: las máscaras (iris/persianas) se leían como agujeros y rayas */}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 65% at 50% 46%, ${tone}, #070505 74%)` }} />
    {h.bg && <AbsoluteFill style={{ opacity: 0.6 }}><Img src={img(h.bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) saturate(.9) brightness(.7)", transform: `scale(${1.2 + 0.03 * Math.sin(tt * 0.2)}) translateX(${-16 * tt / D}px)` }} /></AbsoluteFill>}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 60%, rgba(255,180,110,.06) 74%, rgba(0,0,0,.4) 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 44% 14% at 50% 85%, rgba(255,190,120,.16), transparent 70%)" }} />
    <AbsoluteFill style={{ background: `conic-gradient(from 168deg at 50% -12%, transparent 0deg, rgba(255,222,170,${0.06 + 0.02 * Math.sin(tt * 0.5)}) 12deg, transparent 24deg)`, mixBlendMode: "screen" }} />
    {/* mesa de madera en perspectiva: los objetos se apoyan en algo (sombra de contacto con motivo) */}
    {mesa && <div style={{ position: "absolute", left: -300, right: -300, bottom: -120, height: 520, transformOrigin: "50% 100%", transform: `perspective(1400px) rotateX(64deg) translateX(${-30 * tt / D}px)`, background: "repeating-linear-gradient(90deg, #5a3820 0 6px, #6a4428 6px 30px, #4e301a 30px 34px, #72492a 34px 90px)", WebkitMaskImage: "linear-gradient(0deg, #000 55%, transparent)", maskImage: "linear-gradient(0deg, #000 55%, transparent)", opacity: 0.75 } as React.CSSProperties} />}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 38% 30% at 34% 18%, rgba(255,214,160,.14), transparent 70%)", mixBlendMode: "screen" }} />
    <AbsoluteFill style={{ perspective: 2200, opacity: cl(inn * 1.6) * (1 - xo * 0.7) }}>
      <AbsoluteFill style={{ perspective: 2200, transform: `translateZ(${(-300 * (1 - inn) - 650 * xo + 18 * Math.sin(tt * 0.35)) * cam}px) rotateY(${(7 * (1 - inn) + 1.8 * Math.sin(tt * 0.22 + 0.5) - 6 * xo) * cam}deg) rotateX(${(1.2 * Math.sin(tt * 0.18) + 6 * xo) * cam}deg) translate(${(14 * Math.sin(tt * 0.5)) * cam}px, ${(8 * Math.sin(tt * 0.37 + 1)) * cam}px) scale(${1 + 0.055 * eio(tt, 0.4, D) * cam})` }}>
        {children(tt)}
      </AbsoluteFill>
    </AbsoluteFill>
    <AbsoluteFill style={{ pointerEvents: "none" }}>{Array.from({ length: 14 }, (_, i) => {
      const s = 6 + (i * 37) % 22, x = ((i * 271 + tt * (8 + i % 5) * 4) % 2100) - 90, y = 80 + (i * 163) % 920 + 30 * Math.sin(tt * 0.4 + i);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "rgba(255,226,180,.5)", filter: `blur(${s / 3}px)`, opacity: 0.22 + 0.2 * Math.sin(tt * 0.7 + i * 1.3) }} />;
    })}</AbsoluteFill>
  </AbsoluteFill>;
};

// encabezado chico (kicker + título) arriba a la izquierda: acompaña, nunca es el componente
export const Head: React.FC<{ tt: number; kick: string; title: string; col?: string; d?: number }> = ({ tt, kick, title, col = MZ, d = 0.1 }) => {
  const s = cl(phys(tt, d, 6, 0.7));
  return <div style={{ position: "absolute", left: 110, top: 78, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: DIM }}><div style={{ width: 34 * s, height: 3, borderRadius: 2, background: col }} />{kick}</div>
    <div style={{ fontWeight: 900, fontSize: 58, marginTop: 6, transform: `translateY(${(1 - s) * 18}px)`, filter: `blur(${(1 - s) * 6}px)`, whiteSpace: "nowrap", textShadow: "0 6px 26px rgba(0,0,0,.6)" }}>{title}</div>
  </div>;
};
// rótulo que cae con peso
export const Tag: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, txt, col = TX, size = 36, hand }) => {
  const s = phys(tt, at, 7, 0.45);
  if (s <= 0.01) return null;
  const w = txt.length * (hand ? size * 0.75 : size * 0.68 + 2), xc = Math.max(w / 2 + 70, Math.min(1850 - w / 2, x));
  return <div style={{ position: "absolute", left: xc, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -40}px) scale(${0.8 + 0.2 * s})`, opacity: cl(s * 2), fontWeight: 900, fontFamily: hand ? HAND : FONT, fontSize: hand ? size * 1.35 : size, letterSpacing: hand ? 0 : 2, color: col, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.65)" }}>{txt}</div>;
};
// foto con marco
export const Photo: React.FC<{ id?: string; w: number; h: number; r?: number; z?: number; style?: React.CSSProperties; dim?: number }> = ({ id, w, h, r = 18, z = 1.08, style, dim = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: r, overflow: "hidden", background: "#1a120d", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.1)", position: "relative", ...style }}>
    {id && <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />}
    {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />}
  </div>
);
// un frijol (elipse con brillo); ok=false = opaco y arrugado
export const Bean: React.FC<{ x: number; y: number; r?: number; s?: number; col?: string; ok?: boolean; o?: number }> = ({ x, y, r = 0, s = 1, col = "#b5654a", ok = true, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 44 * s, height: 28 * s, marginLeft: -22 * s, marginTop: -14 * s, borderRadius: "50%", transform: `rotate(${r}deg)`, opacity: o,
    background: ok ? `radial-gradient(ellipse at 35% 30%, rgba(255,255,255,.75) 0 8%, ${col} 30%, #5a2a18 100%)` : `radial-gradient(ellipse at 40% 40%, #8a6a58, #4a3a30 90%)`,
    boxShadow: ok ? "0 6px 10px rgba(0,0,0,.45)" : "0 4px 8px rgba(0,0,0,.4), inset 0 0 0 2px rgba(0,0,0,.25)", filter: ok ? undefined : "contrast(.8)" }} />
);
// olla de barro de perfil (SVG) con nivel de líquido y vapor
export const Olla: React.FC<{ x: number; y: number; w?: number; lvl?: number; liq?: string; steam?: number; tt?: number; cut?: boolean }> = ({ x, y, w = 520, lvl = 0.5, liq = "#5a2e1c", steam = 0, tt = 0, cut }) => {
  const h = w * 0.86;
  return <svg width={w} height={h + 160} style={{ position: "absolute", left: x - w / 2, top: y - h / 2 - 160, overflow: "visible" }} viewBox={`0 -160 ${w} ${h + 160}`}>
    <defs>
      <linearGradient id="barro" x1="0" x2="1"><stop offset="0" stopColor="#6b2f17" /><stop offset=".45" stopColor="#b35a32" /><stop offset="1" stopColor="#4a1f0f" /></linearGradient>
      <clipPath id={"ollaclip" + x}><path d={`M ${w * 0.12} ${h * 0.12} C ${-w * 0.06} ${h * 0.5}, ${w * 0.08} ${h * 0.98}, ${w * 0.5} ${h} C ${w * 0.92} ${h * 0.98}, ${w * 1.06} ${h * 0.5}, ${w * 0.88} ${h * 0.12} Z`} /></clipPath>
    </defs>
    <path d={`M ${w * 0.12} ${h * 0.12} C ${-w * 0.06} ${h * 0.5}, ${w * 0.08} ${h * 0.98}, ${w * 0.5} ${h} C ${w * 0.92} ${h * 0.98}, ${w * 1.06} ${h * 0.5}, ${w * 0.88} ${h * 0.12} Z`} fill={cut ? "#2a140b" : "url(#barro)"} stroke="#3a180a" strokeWidth={6} />
    {cut && <g clipPath={`url(#ollaclip${x})`}><rect x={0} y={h * (1 - lvl)} width={w} height={h} fill={liq} /><rect x={0} y={h * (1 - lvl)} width={w} height={8} fill="rgba(255,255,255,.18)" /></g>}
    <rect x={w * 0.08} y={h * 0.04} width={w * 0.84} height={h * 0.1} rx={14} fill="#8a3e1f" stroke="#3a180a" strokeWidth={5} />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${w * (0.36 + i * 0.14)} -10 c -26 -36 26 -70 0 -104 c -26 -36 26 -70 0 -104`} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="0.3 0.7" strokeDashoffset={-((tt * 0.4 + i * 0.33) % 1)} opacity={steam} />)}
  </svg>;
};
// llama (SVG) con intensidad 0..1
export const Flame: React.FC<{ x: number; y: number; k: number; tt: number; s?: number }> = ({ x, y, k, tt, s = 1 }) => (
  <svg width={260 * s} height={300 * s} style={{ position: "absolute", left: x - 130 * s, top: y - 300 * s, overflow: "visible" }} viewBox="-130 -300 260 300">
    {[0, 1, 2, 3, 4].map((i) => { const hh = (90 + 170 * k) * (0.7 + 0.3 * Math.sin(tt * 9 + i * 1.7)), ww = 40 + 20 * k, xx = (i - 2) * 34;
      return <path key={i} d={`M ${xx - ww / 2} 0 Q ${xx - ww / 2} ${-hh * 0.5} ${xx + 6 * Math.sin(tt * 7 + i)} ${-hh} Q ${xx + ww / 2} ${-hh * 0.5} ${xx + ww / 2} 0 Z`} fill={i % 2 ? "#ffb02e" : "#ff6a1a"} opacity={0.85} />; })}
    <ellipse cx={0} cy={0} rx={120} ry={18} fill="rgba(255,140,40,.35)" />
  </svg>
);
