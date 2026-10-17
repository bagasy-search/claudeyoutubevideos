// ── BASE visual de Hank Out Back (plan6, 16-oct-2026). Piezas PURO CSS/SVG (cero imágenes) para los héroes de cada video.
//    Mundo de Hank = noticia de fauna contada por un explorador casero: libreta de campo, mapa del estado, estuco de Florida, cartel de
//    cuarentena, noche con linterna. Paleta de sus miniaturas: rojo UPDATE, azul marino, blanco. Bebas Neue (rótulos) + Caveat (libreta).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { sp, ez, eo, cl, fr } from "../lkit/core";
export { sp, ez, eo, cl, fr };

export const LAB = loadBebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const HND = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
export const BARN = "#8E2A22", BARN2 = "#B23A2E", CREAM = "#F6EEDC", NAVY = "#1B2A4E", INK = "#2B2420", PENCIL = "#3A3A40", OK = "#3D7F4A",
  RED = "#D62828", GOLD = "#E8B43A", STRAW = "#E3C46E", EGG = "#E9D3B4", BLUE = "#8FB7C9", SAGE = "#6E8B5E", ZINC = "#A9B1B6", ORANGE = "#E8701E", SHELL = "#7A4A22", SHELL2 = "#3A2210";
export type B = { t: number; txt: string };
export type PP<T> = React.FC<T & { a: number; d: number; a0?: number }>;

export const useK = (a: number, a0?: number) => {
  const fl = useCurrentFrame(); const base = a0 ?? a;
  const f = fl + fr(a) - fr(base);
  return { f, fl, at: (t: number) => fr(t) - fr(base) };
};
export const on = (f: number, at: number, dur = 12) => cl((f - at) / dur);

export const TX: Record<string, string> = {
  barn: "repeating-linear-gradient(90deg, rgba(0,0,0,0.28) 0 6px, rgba(255,255,255,0.05) 6px 9px, transparent 9px 150px), repeating-linear-gradient(90deg, transparent 0 40px, rgba(255,255,255,0.025) 40px 41px, transparent 41px 77px, rgba(0,0,0,0.05) 77px 79px, transparent 79px 150px), radial-gradient(ellipse 50% 30% at 30% 25%, rgba(255,210,170,0.14), transparent 70%), radial-gradient(ellipse 30% 20% at 80% 80%, rgba(0,0,0,0.25), transparent 70%), linear-gradient(180deg, #9A3127, #6E1F19)",
  wood: "repeating-linear-gradient(0deg, rgba(60,35,15,0.20) 0 2px, transparent 2px 23px, rgba(255,230,190,0.06) 23px 27px, transparent 27px 53px), repeating-linear-gradient(0deg, rgba(60,35,15,0.10) 0 1px, transparent 1px 8px), radial-gradient(ellipse 4% 10% at 30% 40%, rgba(60,35,15,0.30), transparent 80%), linear-gradient(90deg, #8C6B4A, #A98764 40%, #8D6A47)",
  grey: "repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 5px, transparent 5px 170px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 7px), radial-gradient(ellipse 50% 40% at 30% 30%, rgba(255,255,255,0.10), transparent 70%), linear-gradient(180deg, #7C7A73, #55534E)",
  paper: "repeating-linear-gradient(3deg, rgba(255,255,255,0.20) 0 1px, transparent 1px 15px), radial-gradient(ellipse 45% 35% at 30% 30%, rgba(255,255,255,0.55), transparent 70%), radial-gradient(ellipse 20% 12% at 85% 80%, rgba(150,110,60,0.12), transparent 70%), linear-gradient(170deg, #F7F0E1, #E9DCC2)",
  card: "linear-gradient(180deg, transparent 0 118px, rgba(200,60,60,0.55) 118px 121px, transparent 121px), repeating-linear-gradient(180deg, transparent 0 59px, rgba(80,120,180,0.32) 59px 61px), radial-gradient(ellipse 50% 40% at 30% 30%, rgba(255,255,255,0.6), transparent 70%), linear-gradient(170deg, #FCF8EE, #EFE6D2)",
  kraft: "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-67deg, rgba(255,240,210,0.07) 0 1px, transparent 1px 13px), radial-gradient(ellipse 30% 22% at 20% 30%, rgba(90,55,20,0.16), transparent 70%), linear-gradient(170deg, #D2B285, #B8925F)",
  gingham: "repeating-linear-gradient(90deg, rgba(178,40,40,0.38) 0 46px, transparent 46px 92px), repeating-linear-gradient(0deg, rgba(178,40,40,0.38) 0 46px, transparent 46px 92px), radial-gradient(ellipse 60% 50% at 40% 30%, rgba(255,255,255,0.35), transparent 70%), linear-gradient(180deg, #F4EEE6, #E5DCD0)",
  chalk: "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.09), transparent 70%), radial-gradient(ellipse 30% 14% at 72% 66%, rgba(255,255,255,0.07), transparent 70%), repeating-linear-gradient(172deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 11px), linear-gradient(180deg, #2E3631, #1F2622)",
  zinc: "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 1px, rgba(0,0,0,0.05) 1px 2px, transparent 2px 5px), conic-gradient(from 210deg at 35% 40%, #8E979C, #CED4D7, #9AA3A8, #E1E5E7, #8E979C)",
  straw: "repeating-linear-gradient(17deg, rgba(150,110,30,0.35) 0 2px, transparent 2px 9px), repeating-linear-gradient(-23deg, rgba(255,240,180,0.35) 0 2px, transparent 2px 11px), repeating-linear-gradient(71deg, rgba(120,90,20,0.25) 0 1px, transparent 1px 7px), linear-gradient(180deg, #D9B866, #B9933F)",
  stucco: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.10) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.07) 0 2px, transparent 3px), repeating-radial-gradient(circle at 37% 41%, rgba(120,95,60,0.07) 0 3px, transparent 3px 11px), repeating-radial-gradient(circle at 81% 13%, rgba(255,250,235,0.10) 0 2px, transparent 2px 9px), linear-gradient(170deg, #E5D3B3, #CDB58E)",
  notebook: "linear-gradient(90deg, transparent 0 110px, rgba(210,60,60,0.55) 110px 113px, transparent 113px), repeating-linear-gradient(180deg, transparent 0 63px, rgba(70,110,170,0.30) 63px 65px), radial-gradient(ellipse 50% 40% at 30% 30%, rgba(255,255,255,0.55), transparent 70%), radial-gradient(ellipse 25% 18% at 85% 85%, rgba(140,110,60,0.14), transparent 70%), linear-gradient(170deg, #FBF7EA, #EDE3CB)",
  map: "repeating-radial-gradient(ellipse at 30% 40%, rgba(60,90,60,0.10) 0 2px, transparent 2px 38px), repeating-radial-gradient(ellipse at 75% 65%, rgba(60,90,60,0.08) 0 2px, transparent 2px 46px), linear-gradient(180deg, #DCE7D2, #C9D9BC)",
  sea: "repeating-linear-gradient(170deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 26px), radial-gradient(ellipse 70% 50% at 50% 30%, rgba(120,170,200,0.25), transparent 70%), linear-gradient(180deg, #24496A, #13283F)",
  orange: "repeating-linear-gradient(135deg, rgba(0,0,0,0.0) 0 60px, rgba(0,0,0,0.10) 60px 120px), linear-gradient(180deg, #F08A2E, #D9661B)",
  soil: "radial-gradient(circle at 22% 31%, rgba(0,0,0,0.25) 0 3px, transparent 4px), radial-gradient(circle at 63% 72%, rgba(255,230,190,0.08) 0 2px, transparent 3px), repeating-radial-gradient(circle at 41% 57%, rgba(20,10,0,0.18) 0 2px, transparent 2px 13px), repeating-radial-gradient(circle at 78% 22%, rgba(120,80,40,0.20) 0 3px, transparent 3px 17px), linear-gradient(180deg, #5A3E28, #3A271A)",
  night: "radial-gradient(ellipse 40% 30% at 75% 20%, rgba(255,240,200,0.18), transparent 70%), linear-gradient(180deg, #1B2238, #0E1220)",
  dusk: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,150,80,0.55), transparent 70%), linear-gradient(180deg, #2A3358 0%, #6B4E73 55%, #E28A5B 100%)",
};
export const Bg: React.FC<{ k: string; f: number; dark?: number }> = ({ k, f, dark = 0 }) => {
  const sweep = -30 + (f % 320) / 320 * 170;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: TX[k] || TX.paper, transform: `scale(${1.05 + 0.0002 * f})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 14}%, rgba(255,250,235,0.08) ${sweep}%, transparent ${sweep + 14}%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 30% 8%, rgba(255,225,180,0.20), rgba(255,225,180,0) 70%)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(0deg, rgba(20,10,5,${0.30 + dark}), rgba(0,0,0,${dark * 0.5}) 62%)` }} />
  </AbsoluteFill>;
};
export const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-8 * Math.sin(f / 43)}px, ${5 * Math.cos(f / 49)}px) scale(${1.025 + 0.01 * Math.sin(f / 57)})` }}>{children}</AbsoluteFill>;
};
export const shell = (bg: React.ReactNode, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden" }}>{bg}<Drift>{c}</Drift></AbsoluteFill>;

export const Lab: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties }> = ({ txt, size, color = CREAM, u = 1, style }) => (
  <div style={{ fontFamily: LAB, fontSize: size, color, lineHeight: 0.95, letterSpacing: size > 90 ? 2 : 1, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 28}px) scale(${0.86 + 0.14 * u})`,
    textShadow: color === CREAM || color === GOLD || color === STRAW ? "0 6px 22px rgba(0,0,0,0.55)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
export const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; chalk?: boolean; style?: React.CSSProperties }> = ({ txt, u, size, color = INK, chalk, style }) => (
  <div style={{ fontFamily: HND, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.05, paddingRight: "0.3em",
    clipPath: `inset(-30% ${(100 - 100 * ez(u)) * 1.06 - 6}% -30% -3%)`, textShadow: chalk ? "0 0 2px rgba(255,255,255,0.55), 0 0 9px rgba(255,255,255,0.18), 2px 3px 0 rgba(0,0,0,0.25)" : undefined, ...style }}>{txt}</div>
);
export const Stamp: React.FC<{ txt: string; u: number; color?: string; rot?: number; size?: number; style?: React.CSSProperties }> = ({ txt, u, color = RED, rot = -8, size = 84, style }) => (
  <div style={{ display: "inline-block", fontFamily: LAB, fontSize: size, color, border: `8px solid ${color}`, borderRadius: 12, padding: "4px 26px 0", letterSpacing: 3,
    opacity: cl(u * 3) * 0.93, transform: `rotate(${rot}deg) scale(${1.9 - 0.9 * Math.min(1, u)})`, background: "rgba(255,250,240,0.12)",
    maskImage: "repeating-linear-gradient(35deg, #000 0 14px, rgba(0,0,0,0.78) 14px 17px)", WebkitMaskImage: "repeating-linear-gradient(35deg, #000 0 14px, rgba(0,0,0,0.78) 14px 17px)", whiteSpace: "nowrap", ...style }}>{txt}</div>
);
export const Tick: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 80, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible", flex: "none" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={color || (no ? RED : OK)} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
export const Card: React.FC<{ x: number; y: number; w: number; h?: number; u: number; rot?: number; bg?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, u, rot = -1.5, bg = TX.paper, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, borderRadius: 6, padding: "30px 40px", opacity: cl(u * 2),
    transform: `perspective(1400px) translateY(${(1 - u) * 90}px) rotateX(${(1 - u) * 24}deg) rotate(${rot}deg)`,
    boxShadow: "0 40px 70px rgba(10,5,0,0.55), 0 8px 16px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.25)", ...style }}>{children}</div>
);
export const Tape: React.FC<{ x: number; y: number; rot?: number; w?: number }> = ({ x, y, rot = -8, w = 150 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 44, transform: `rotate(${rot}deg)`, background: "linear-gradient(180deg, rgba(240,228,190,0.82), rgba(225,210,165,0.78))",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)", clipPath: "polygon(0 8%, 4% 0, 8% 10%, 12% 0, 100% 0, 97% 50%, 100% 100%, 6% 100%, 0 90%, 3% 50%)" }} />
);
export const Arrow: React.FC<{ d: string; u: number; color?: string; w?: number }> = ({ d, u, color = GOLD, w = 9 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
// caracol gigante africano dibujado (SVG): concha cónica con rayas de tigre + cuerpo con dos antenas
export const Snail: React.FC<{ w: number; f?: number; flip?: boolean; style?: React.CSSProperties }> = ({ w, f = 0, flip, style }) => {
  const st = 4 * Math.sin(f / 9);
  return <svg width={w} height={w * 0.62} viewBox="0 0 260 160" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
    <defs><linearGradient id="shl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C9925A" /><stop offset="0.5" stopColor="#8A5426" /><stop offset="1" stopColor="#4A2A12" /></linearGradient></defs>
    <ellipse cx={130} cy={152} rx={118} ry={8} fill="rgba(0,0,0,0.28)" />
    <path d={`M 226 104 L ${246 + st} ${54 - st} M 222 106 L ${232 + st} ${62}`} stroke="#6E6152" strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M 18 148 C 30 120 120 118 206 116 C 232 114 244 100 238 88 C 232 104 200 108 150 112 C 90 116 40 124 18 148 Z" fill="#8B7B66" />
    <circle cx={246 + st} cy={52 - st} r={5} fill="#3B342C" /><circle cx={232 + st} cy={60} r={4} fill="#3B342C" />
    <path d="M 40 122 C 30 70 70 22 120 10 C 150 4 176 18 182 44 C 188 76 168 108 130 118 C 100 126 60 128 40 122 Z" fill="url(#shl)" stroke="#3A2210" strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${62 + i * 20} ${120 - i * 3} C ${70 + i * 18} ${80 - i * 8} ${96 + i * 14} ${40 - i * 4} ${120 + i * 9} ${18 + i * 4}`} stroke="#3A2210" strokeWidth={6 - i * 0.5} fill="none" opacity={0.75} strokeLinecap="round" />)}
    <path d="M 120 14 C 150 10 170 26 170 48 C 170 70 150 84 130 82 C 112 80 104 64 112 52 C 120 42 136 46 136 56" stroke="#F1D2A0" strokeWidth={4} fill="none" opacity={0.65} />
    <ellipse cx={92} cy={50} rx={22} ry={9} fill="rgba(255,240,210,0.35)" transform="rotate(-40 92 50)" />
  </svg>;
};
// huevitos de caracol (perlas blancas en espiral)
export const Eggs: React.FC<{ n: number; u: number; r?: number; style?: React.CSSProperties }> = ({ n, u, r = 11, style }) => (
  <div style={{ position: "relative", ...style }}>{Array.from({ length: n }, (_, i) => { const a = i * 2.39996, d = 7 * Math.sqrt(i) * r / 6; const v = cl(u * n - i * 0.6);
    return <div key={i} style={{ position: "absolute", left: d * Math.cos(a), top: d * Math.sin(a), width: 2 * r, height: 2 * r, borderRadius: "50%", opacity: v, transform: `scale(${0.4 + 0.6 * v})`,
      background: "radial-gradient(circle at 35% 30%, #FFFFFF, #F1EAD8 55%, #CFC4A8)", boxShadow: "0 3px 5px rgba(0,0,0,0.35)" }} />; })}</div>
);
// rótulo de noticia del canal: pestaña roja + barra blanca con texto azul marino (gramática de las miniaturas de Hank)
export const Update: React.FC<{ tab: string; txt: string; u: number; y?: number; size?: number }> = ({ tab, txt, u, y = 800, size = 132 }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: 1920, opacity: cl(u * 2), transform: `translateY(${(1 - ez(u)) * 60}px)` }}>
    <div style={{ display: "inline-block", marginLeft: 90, background: RED, color: "#fff", fontFamily: LAB, fontSize: 64, padding: "6px 26px 0", letterSpacing: 2, boxShadow: "0 10px 20px rgba(0,0,0,0.35)", clipPath: `inset(0 ${100 - 100 * ez(u * 1.4)}% 0 0)` }}>{tab}</div>
    <div style={{ background: "#FFFFFF", padding: "10px 90px 0", boxShadow: "0 -6px 30px rgba(0,0,0,0.35)" }}>
      <div style={{ fontFamily: LAB, fontSize: size, color: NAVY, letterSpacing: 3, lineHeight: 1.02, whiteSpace: "nowrap", clipPath: `inset(-10% ${100 - 100 * ez(cl(u * 1.6 - 0.3))}% -10% 0)` }}>{txt}</div></div>
  </div>
);
// capítulo de Hank: hoja de libreta de campo (anillos + cinta) sobre el mapa
export const FieldChapter: React.FC<{ f: number; n: number; kicker: string; title: string; sub: string; bg?: string }> = ({ f, n, kicker, title, sub, bg = "map" }) => {
  const u = sp(f, 0, 14, 120), w1 = on(f, 8, 14), w2 = on(f, 16, 22), w3 = on(f, 32, 18);
  return shell(<Bg k={bg} f={f} dark={0.12} />, <>
    <div style={{ position: "absolute", left: 300, top: 150, width: 1320, height: 780, background: TX.notebook, borderRadius: 6, opacity: cl(u * 2),
      transform: `perspective(1600px) rotateX(${(1 - u) * 20}deg) rotate(${-2 + (1 - u) * 6}deg) translateY(${(1 - u) * 80}px)`,
      boxShadow: "0 50px 90px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.35)" }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} style={{ position: "absolute", left: 140 * i + 70, top: -16, width: 26, height: 40, borderRadius: 13, border: "5px solid #8A8F94" }} />)}
      <Tape x={-40} y={60} rot={-28} w={190} /><Tape x={1190} y={680} rot={-24} w={190} />
      <div style={{ position: "absolute", left: 150, top: 60 }}><Lab txt={kicker} size={70} color={RED} u={w1} /></div>
      <div style={{ position: "absolute", right: 80, top: 130, fontFamily: LAB, fontSize: 380, lineHeight: 0.8, color: NAVY, opacity: 0.12 + 0.6 * ez(w1), transform: `scale(${1.3 - 0.3 * ez(w1)})` }}>{n}</div>
      <div style={{ position: "absolute", left: 150, top: 230 }}><Hand txt={title} u={w2} size={title.length > 22 ? 100 : 124} color={NAVY} /></div>
      <div style={{ position: "absolute", left: 156, top: 420 }}><Hand txt={sub} u={w3} size={66} color={PENCIL} /></div>
      <svg width={1100} height={60} style={{ position: "absolute", left: 150, top: 520 }}><path d="M 6 30 C 300 18 600 40 900 24" stroke={RED} strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(on(f, 40, 14))} /></svg>
      <div style={{ position: "absolute", right: 120, bottom: 70, opacity: cl(on(f, 30, 14) * 2), transform: `translateX(${(1 - ez(on(f, 30, 40))) * 120}px)` }}><Snail w={300} f={f} /></div>
    </div>
  </>);
};
