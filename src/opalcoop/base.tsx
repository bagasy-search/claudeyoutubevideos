// ── BASE visual de Opal's Hen House (plan6, 16-oct-2026). Piezas PURO CSS/SVG (cero imágenes) que usan los héroes de cada video.
//    Texturas del mundo de Opal dibujadas con gradientes: tabla roja de granero, madera gastada, papel de sobre, tarjeta de receta rayada,
//    mantel de hule a cuadros, pizarra, chapa galvanizada, paja. Tipos: Bebas Neue (rótulos y números) + Caveat (mano / lápiz).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { sp, ez, eo, cl, fr } from "../lkit/core";
export { sp, ez, eo, cl, fr };

export const LAB = loadBebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const HND = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
export const BARN = "#8E2A22", BARN2 = "#B23A2E", CREAM = "#F6EEDC", NAVY = "#22314F", INK = "#2B2420", PENCIL = "#3A3A40", OK = "#3D7F4A",
  RED = "#B8262B", GOLD = "#D9A23A", STRAW = "#E3C46E", EGG = "#E9D3B4", BLUE = "#8FB7C9", SAGE = "#7E9B6E", ZINC = "#A9B1B6";
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
// gallina dibujada (silueta SVG): color de cuerpo, cresta, pose
export const Hen: React.FC<{ w: number; body?: string; comb?: string; wing?: string; rooster?: boolean; flip?: boolean; style?: React.CSSProperties }> = ({ w, body = "#9C4B23", comb = "#D3262B", wing, rooster, flip, style }) => (
  <svg width={w} height={w * 0.9} viewBox="0 0 200 180" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
    <ellipse cx={100} cy={172} rx={70} ry={7} fill="rgba(0,0,0,0.25)" />
    {rooster ? <path d="M 40 70 C 0 40 6 0 30 10 C 28 30 40 50 58 66 Z M 46 78 C 4 70 0 30 20 28 C 26 50 40 66 60 76 Z" fill={wing || body} opacity={0.95} /> : <path d="M 38 80 C 10 70 14 40 30 34 C 34 52 44 66 60 74 Z" fill={wing || body} />}
    <path d="M 40 90 C 40 50 90 46 120 60 C 132 40 160 30 168 54 C 172 70 160 80 158 96 C 160 140 120 160 90 156 C 56 152 40 124 40 90 Z" fill={body} />
    <path d="M 70 92 C 90 84 120 92 130 112 C 112 124 84 120 70 92 Z" fill={wing || "rgba(0,0,0,0.18)"} opacity={0.6} />
    <path d={rooster ? "M 140 40 C 142 22 150 28 152 20 C 156 30 160 22 164 18 C 166 30 170 26 174 24 C 172 38 168 44 160 46 Z" : "M 146 44 C 148 32 154 36 156 30 C 160 38 164 32 168 30 C 168 40 164 46 158 48 Z"} fill={comb} />
    <path d="M 168 58 L 186 64 L 168 68 Z" fill="#E1A93A" />
    <path d={rooster ? "M 160 70 C 156 92 168 96 170 74 Z" : "M 162 70 C 160 82 168 84 168 72 Z"} fill={comb} />
    <circle cx={158} cy={56} r={4} fill="#1A1210" />
    <path d="M 92 154 L 88 172 M 112 154 L 116 172" stroke="#D99A3A" strokeWidth={6} strokeLinecap="round" />
  </svg>
);
export const Egg: React.FC<{ w: number; c?: string; style?: React.CSSProperties }> = ({ w, c = "#C98F5C", style }) => (
  <div style={{ width: w, height: w * 1.28, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: `radial-gradient(ellipse 35% 30% at 35% 30%, rgba(255,255,255,0.55), transparent 70%), radial-gradient(ellipse 80% 80% at 60% 70%, rgba(0,0,0,0.18), transparent 70%), ${c}`,
    boxShadow: "0 12px 18px rgba(0,0,0,0.35)", ...style }} />
);
// capítulo genérico de Opal: tarjeta de receta clavada con chinche en la tabla roja del granero
export const RecipeChapter: React.FC<{ f: number; n: number; kicker: string; title: string; sub: string; bg?: string }> = ({ f, n, kicker, title, sub, bg = "barn" }) => {
  const u = sp(f, 0, 14, 120), w1 = on(f, 8, 14), w2 = on(f, 16, 22), w3 = on(f, 32, 18);
  return shell(<Bg k={bg} f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 300, top: 150, width: 1320, height: 780, background: TX.card, borderRadius: 8, opacity: cl(u * 2),
      transform: `perspective(1600px) rotateX(${(1 - u) * 20}deg) rotate(${-2 + (1 - u) * 6}deg) translateY(${(1 - u) * 80}px)`,
      boxShadow: "0 50px 90px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", left: 640, top: -18, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F26B5B, #A51E1E)", boxShadow: "0 8px 10px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", left: 60, top: 40 }}><Hand txt={kicker} u={w1} size={66} color={RED} /></div>
      <div style={{ position: "absolute", right: 70, top: 150, fontFamily: LAB, fontSize: 380, lineHeight: 0.8, color: BARN, opacity: 0.16 + 0.84 * ez(w1), transform: `scale(${1.3 - 0.3 * ez(w1)})` }}>{n}</div>
      <div style={{ position: "absolute", left: 60, top: 230 }}><Hand txt={title} u={w2} size={title.length > 22 ? 96 : 120} color={NAVY} /></div>
      <div style={{ position: "absolute", left: 66, top: 420 }}><Hand txt={sub} u={w3} size={66} color={PENCIL} /></div>
      <svg width={1100} height={60} style={{ position: "absolute", left: 60, top: 520 }}><path d="M 6 30 C 300 18 600 40 900 24" stroke={RED} strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(on(f, 40, 14))} /></svg>
      <div style={{ position: "absolute", left: 60, bottom: 50, display: "flex", gap: 26, opacity: cl(on(f, 30, 14) * 2) }}>
        <Hen w={120} /><Hen w={120} body="#1C1C22" wing="#2E3A2E" /><Hen w={120} body="#D9A84E" wing="#C48F3A" />
      </div>
    </div>
  </>);
};
