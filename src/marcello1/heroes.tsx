// ── HÉROES de marcello1 (Chef Marcello, video 1: frijoles sin gases, el truco de la pignata de la nonna). Claude, 16-oct-2026.
//    Juego PROPIO del mundo de la cocina italiana de casa: tarjeta de fichero, pizarra de trattoria con tiza, mantel a cuadros,
//    pignata de barro, frasco de remojo que se enturbia, reloj-tomate, termómetro de hervor, frijol partido vs entero, línea del remojo.
//    PURO CSS (cero imágenes): texturas con gradientes + perspectiva + sombras en capas + brillo que barre.
//    Tipografías: 2 familias (Playfair Display = rótulos y números · Caveat = mano/tiza). Paleta: crema, rojo tomate, verde albahaca, cobre.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadPF } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCv } from "@remotion/google-fonts/Caveat";
import { useT, sp, ez, eo, cl, fr, P } from "../lkit/core";

const PF = loadPF("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily;
const CV = loadCv("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
const TOM = "#C8372D", TOM2 = "#8E1F18", BAS = "#3F7D3A", BAS2 = "#285427", CREAM = "#F6EEDD", INK = "#2A211B", COP = "#B8733A", COP2 = "#7E4520", CHALK = "#F3F0E6", GREY = "#8C8A82", CLAY = "#B9663A";
type A0 = { a0?: number };
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 18px 30px rgba(0,0,0,0.30), 0 44px 80px rgba(0,0,0,0.26)";

// ── texturas (gradientes) ────────────────────────────────────────────────
const TX: Record<string, string> = {
  mantel: "repeating-linear-gradient(0deg, rgba(200,55,45,0.50) 0 70px, transparent 70px 140px), repeating-linear-gradient(90deg, rgba(200,55,45,0.50) 0 70px, transparent 70px 140px), repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 6px), linear-gradient(170deg, #FBF5EA, #EADCC4)",
  wood: "repeating-linear-gradient(91deg, rgba(50,25,8,0.13) 0 2px, transparent 2px 27px), repeating-linear-gradient(89deg, rgba(255,230,190,0.07) 0 1px, transparent 1px 43px), radial-gradient(ellipse 40% 12% at 30% 40%, rgba(40,20,5,0.18), transparent 70%), radial-gradient(ellipse 30% 10% at 75% 72%, rgba(40,20,5,0.15), transparent 70%), linear-gradient(175deg, #8F5E36, #5C391E)",
  tile: "linear-gradient(90deg, rgba(160,150,135,0.55) 0 4px, transparent 4px), linear-gradient(0deg, rgba(160,150,135,0.55) 0 4px, transparent 4px), radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,255,255,0.9), transparent 70%), linear-gradient(170deg, #F7F4EC, #DED8CB)",
  chalk: "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.07), transparent 70%), radial-gradient(ellipse 30% 14% at 72% 66%, rgba(255,255,255,0.06), transparent 70%), repeating-linear-gradient(172deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(180deg, #2E332E, #1E221F)",
  cream: "repeating-linear-gradient(0deg, rgba(120,100,70,0.05) 0 1px, transparent 1px 8px), radial-gradient(ellipse 50% 40% at 30% 25%, rgba(255,255,255,0.7), transparent 70%), linear-gradient(170deg, #F8F0DF, #E8DAC0)",
  stove: "radial-gradient(ellipse 60% 50% at 50% 15%, rgba(255,220,170,0.25), transparent 70%), linear-gradient(180deg, #2F2A25, #15120F)",
  copper: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 5px), conic-gradient(from 210deg at 50% 50%, #8A4B22, #E0A070, #A65A2A, #F0B886, #8A4B22)",
};
const tileSize = { backgroundSize: "160px 160px, 160px 160px, 100% 100%, 100% 100%" } as React.CSSProperties;
const Bg: React.FC<{ k: keyof typeof TX; f: number; d: number }> = ({ k, f, d }) => {
  const sweep = -30 + 160 * (f / Math.max(1, d));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: TX[k], ...(k === "tile" ? tileSize : {}), transform: `scale(${1.05 + 0.03 * f / Math.max(1, d)})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,248,230,0.13) ${sweep}%, transparent ${sweep + 12}%)` }} />
    <AbsoluteFill style={{ background: k === "chalk" || k === "stove" ? "radial-gradient(ellipse 80% 60% at 35% 0%, rgba(255,226,180,0.14), rgba(255,226,180,0) 70%)" : "radial-gradient(ellipse 90% 70% at 50% 40%, transparent 55%, rgba(60,40,20,0.30))" }} />
  </AbsoluteFill>;
};
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-6 * Math.sin(f / 45)}px, ${5 * Math.cos(f / 51)}px) scale(${1.02 + 0.01 * Math.sin(f / 59)})` }}>{children}</AbsoluteFill>;
};
const shell = (bg: React.ReactNode, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{bg}<Drift>{c}</Drift></AbsoluteFill>;

// ── tipografía ───────────────────────────────────────────────────────────
const Ti: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties; sh?: boolean; w?: number }> = ({ txt, size, color = INK, u = 1, style, sh, w = 900 }) => (
  <div style={{ fontFamily: PF, fontWeight: w, fontSize: size, color, lineHeight: 1.0, letterSpacing: 1, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 24}px) scale(${0.92 + 0.08 * u})`,
    textShadow: sh ? "0 3px 0 rgba(0,0,0,0.22), 0 10px 26px rgba(0,0,0,0.45)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties; chalk?: boolean }> = ({ txt, u, size, color = INK, style, chalk }) => (
  <div style={{ fontFamily: CV, fontWeight: 700, fontSize: size, color: chalk ? CHALK : color, whiteSpace: "nowrap", lineHeight: 1.05, paddingRight: "0.4em",
    textShadow: chalk ? "0 0 2px rgba(255,255,255,0.45), 1px 1px 0 rgba(255,255,255,0.12)" : undefined,
    clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.1 - 8}% -25% -2%)`, ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 64, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible", flex: "none" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={color || (no ? TOM : BAS)} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const Strike: React.FC<{ u: number; w: number; color?: string; top?: string }> = ({ u, w, color = TOM, top = "50%" }) => (
  <div style={{ position: "absolute", left: -10, top, width: (w + 20) * eo(u), height: 10, borderRadius: 5, background: color, transform: "rotate(-3deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }} />
);
// sello de goma (rojo) que cae
const Stamp: React.FC<{ txt: string; u: number; size?: number; color?: string; rot?: number; style?: React.CSSProperties }> = ({ txt, u, size = 64, color = TOM, rot = -8, style }) => (
  <div style={{ position: "absolute", fontFamily: PF, fontWeight: 900, fontSize: size, color, padding: "8px 26px", border: `7px solid ${color}`, borderRadius: 14, letterSpacing: 3, whiteSpace: "nowrap",
    opacity: cl(u * 3) * 0.92, transform: `rotate(${rot}deg) scale(${1 + 1.4 * (1 - eo(u))})`, mixBlendMode: "multiply", boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.15)`, ...style }}>{txt}</div>
);
// tarjeta de fichero vieja (receta)
const Ficha: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; u: number; children?: React.ReactNode; title?: string }> = ({ x, y, w, h, rot = -2, u, children, title }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `perspective(1600px) rotateX(${(1 - eo(u)) * 30}deg) rotate(${rot}deg) translateY(${(1 - eo(u)) * 120}px)`, opacity: cl(u * 2.5),
    borderRadius: 10, boxShadow: SH, overflow: "hidden",
    background: "repeating-linear-gradient(180deg, transparent 0 63px, rgba(70,110,170,0.32) 63px 65px), radial-gradient(ellipse 30% 20% at 85% 85%, rgba(150,110,50,0.18), transparent 70%), radial-gradient(ellipse 20% 12% at 12% 90%, rgba(150,110,50,0.14), transparent 70%), linear-gradient(170deg, #FBF6EA, #EFE3CA)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 118, height: 4, background: "rgba(200,55,45,0.65)" }} />
    <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 2, background: "rgba(200,55,45,0.35)" }} />
    {title ? <div style={{ position: "absolute", left: 120, top: 34, fontFamily: PF, fontWeight: 900, fontSize: 58, color: TOM2, letterSpacing: 1 }}>{title}</div> : null}
    {children}
  </div>
);
// pizarra de trattoria con marco de madera
const Board: React.FC<{ x: number; y: number; w: number; h: number; u: number; children?: React.ReactNode; rot?: number }> = ({ x, y, w, h, u, children, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) translateY(${(1 - eo(u)) * 80}px)`, opacity: cl(u * 2.5), borderRadius: 16, boxShadow: SH,
    background: TX.wood, padding: 26 }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 8, background: TX.chalk, boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.4), inset 0 10px 30px rgba(0,0,0,0.5)", overflow: "hidden" }}>{children}</div>
  </div>
);
// frijol dibujado. kind: borlotti (crema con vetas rojas) · red · white. old = opaco y arrugado · split = piel rajada · cut = corte
const Bean: React.FC<{ w: number; kind?: "borlotti" | "red" | "white"; old?: boolean; split?: number; rot?: number; style?: React.CSSProperties; glow?: number }> = ({ w, kind = "borlotti", old, split = 0, rot = 0, style, glow = 0 }) => {
  const h = w * 0.64;
  const base = kind === "red" ? "radial-gradient(ellipse 55% 45% at 35% 30%, #C4523F, #8A2418 60%, #5E150D)" : kind === "white" ? "radial-gradient(ellipse 55% 45% at 35% 30%, #FFFDF6, #EDE4D0 60%, #CDBFA2)"
    : "radial-gradient(ellipse 12% 22% at 28% 40%, rgba(150,40,40,0.85), transparent 70%), radial-gradient(ellipse 16% 10% at 60% 30%, rgba(150,40,40,0.8), transparent 70%), radial-gradient(ellipse 10% 18% at 75% 62%, rgba(150,40,40,0.8), transparent 70%), radial-gradient(ellipse 14% 9% at 45% 72%, rgba(150,40,40,0.75), transparent 70%), radial-gradient(ellipse 55% 45% at 35% 30%, #F7E8D6, #E2C8AE 60%, #BFA084)";
  return (
    <div style={{ position: "relative", width: w, height: h, transform: `rotate(${rot}deg)`, flex: "none", ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "48% 52% 46% 54% / 60% 62% 38% 40%", background: base, filter: old ? "saturate(0.35) brightness(0.82)" : undefined,
        boxShadow: `0 ${w * 0.06}px ${w * 0.1}px rgba(0,0,0,0.35), inset 0 -${w * 0.05}px ${w * 0.08}px rgba(0,0,0,0.25)${glow ? `, 0 0 ${40 * glow}px rgba(255,240,180,${0.8 * glow})` : ""}` }} />
      {!old ? <div style={{ position: "absolute", left: "18%", top: "12%", width: "38%", height: "22%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.75), transparent 70%)" }} /> : null}
      {old ? <div style={{ position: "absolute", inset: 0, borderRadius: "48% 52% 46% 54% / 60% 62% 38% 40%", background: "repeating-linear-gradient(115deg, rgba(60,40,20,0.28) 0 2px, transparent 2px 9px), repeating-linear-gradient(25deg, rgba(60,40,20,0.18) 0 1px, transparent 1px 12px)" }} /> : null}
      <div style={{ position: "absolute", left: "42%", bottom: "4%", width: "18%", height: "13%", borderRadius: "50%", background: "linear-gradient(180deg, #FFFFFF, #DDD4C2)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }} />
      {split > 0 ? <div style={{ position: "absolute", left: "20%", top: "30%", width: `${55 * split}%`, height: "26%", borderRadius: "50%", background: "radial-gradient(ellipse, #FFF6E2, #EAD9B8 55%, #8C6A48)", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.45)", transform: "rotate(-8deg)" }} /> : null}
    </div>
  );
};
// corte de un frijol (mitad): piel + corazón; center = mancha blanca de tiza (crudo)
const BeanCut: React.FC<{ w: number; center?: number; dots?: number; style?: React.CSSProperties; f?: number }> = ({ w, center = 0, dots = 0, style, f = 0 }) => {
  const h = w * 0.64;
  return (
    <div style={{ position: "relative", width: w, height: h, flex: "none", ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "48% 52% 46% 54% / 60% 62% 38% 40%", background: "linear-gradient(180deg, #A2533C, #6E2C1C)", boxShadow: SH }} />
      <div style={{ position: "absolute", inset: w * 0.035, borderRadius: "48% 52% 46% 54% / 60% 62% 38% 40%", background: "radial-gradient(ellipse 60% 55% at 45% 40%, #FBF0DA, #EBD5AE 70%, #D4B88C)" }} />
      {center > 0 ? <div style={{ position: "absolute", left: "34%", top: "28%", width: "30%", height: "40%", borderRadius: "50%", opacity: center,
        background: "radial-gradient(ellipse, #FFFFFF 30%, rgba(255,255,255,0.85) 55%, transparent 75%)", boxShadow: "0 0 20px rgba(255,255,255,0.7)" }} /> : null}
      {Array.from({ length: Math.round(dots * 18) }, (_, i) => {
        const ax = 22 + ((i * 37) % 56), ay = 22 + ((i * 53) % 52);
        return <div key={i} style={{ position: "absolute", left: `${ax}%`, top: `${ay + 2 * Math.sin(f / 9 + i)}%`, width: w * 0.035, height: w * 0.035, borderRadius: "50%", background: "#E2A23A", boxShadow: "0 0 8px rgba(226,162,58,0.9)" }} />;
      })}
    </div>
  );
};
// olla de barro (pignata): panzona, boca angosta, dos asas
const PignataPot: React.FC<{ w: number; style?: React.CSSProperties; steam?: number; f?: number; children?: React.ReactNode }> = ({ w, style, steam = 0, f = 0, children }) => {
  const h = w * 1.0;
  return (
    <div style={{ position: "relative", width: w, height: h, flex: "none", ...style }}>
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", top: h * 0.2, [s < 0 ? "left" : "right"]: -w * 0.13, width: w * 0.24, height: h * 0.3, borderRadius: "50%", border: `${w * 0.05}px solid ${CLAY}`, borderColor: s < 0 ? `${CLAY} transparent ${CLAY} ${CLAY}` : `${CLAY} ${CLAY} ${CLAY} transparent`, boxShadow: "0 6px 10px rgba(0,0,0,0.3)" }} />)}
      <div style={{ position: "absolute", left: w * 0.32, width: w * 0.36, top: 0, height: h * 0.16, borderRadius: "14px 14px 6px 6px", background: "linear-gradient(90deg, #8E4523, #C9763F 40%, #9C4E27)", boxShadow: "inset 0 6px 8px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: w * 0.29, width: w * 0.42, top: -h * 0.02, height: h * 0.05, borderRadius: 20, background: "linear-gradient(180deg, #D98A55, #9C4E27)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.12, bottom: 0, borderRadius: "44% 44% 40% 40% / 40% 40% 50% 50%", background: "radial-gradient(ellipse 40% 35% at 35% 35%, #E59A62, #B9663A 50%, #7E3A1C 90%)", boxShadow: SH + ", inset -20px -30px 60px rgba(60,20,5,0.45)" }} />
      <div style={{ position: "absolute", left: "8%", right: "8%", top: h * 0.46, height: h * 0.05, background: "repeating-linear-gradient(90deg, rgba(90,35,12,0.45) 0 14px, transparent 14px 26px)", borderRadius: 10 }} />
      {children}
      {steam > 0 ? [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: w * (0.38 + 0.1 * i), top: -h * 0.1 - ((f * 1.4 + i * 30) % 90), width: w * 0.08, height: w * 0.22, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%)", opacity: steam * (1 - ((f * 1.4 + i * 30) % 90) / 90) }} />) : null}
    </div>
  );
};
// olla de acero en corte (agua + frijoles adentro). mode: boil (borbotón) · shiver (tiembla)
const PotCut: React.FC<{ x: number; y: number; w: number; h: number; f: number; mode: "boil" | "shiver" | "calm"; grey?: number; split?: number; thin?: boolean; hot?: number; children?: React.ReactNode }> = ({ x, y, w, h, f, mode, grey = 0, split = 0, thin, hot = 0, children }) => {
  const N = 16, amp = mode === "boil" ? 34 : mode === "shiver" ? 2 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", top: 40, [s < 0 ? "left" : "right"]: -56, width: 64, height: 26, borderRadius: 12, background: TX.copper, boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />)}
      <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 50px 50px", background: thin ? "linear-gradient(90deg, #9EA4A8, #D8DCDE, #9EA4A8)" : TX.copper, boxShadow: SH, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: thin ? 8 : 22, borderRadius: "6px 6px 38px 38px", background: "linear-gradient(180deg, #2C3033, #3E4448)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "78%", background: `linear-gradient(180deg, rgba(${170 - 60 * grey},${150 - 40 * grey},${120 - 20 * grey},0.85), rgba(${120 - 40 * grey},${85 - 20 * grey},${60},0.95))`, boxShadow: "inset 0 6px 0 rgba(255,255,255,0.25)" }} />
          {Array.from({ length: N }, (_, i) => {
            const bx = 6 + ((i * 41) % 84), by = 40 + ((i * 29) % 46);
            const jy = amp * Math.abs(Math.sin(f / (mode === "boil" ? 3.2 : 11) + i * 1.7)), jx = (mode === "boil" ? 10 : 1) * Math.sin(f / 5 + i);
            return <Bean key={i} w={w * 0.13} split={i % 2 === 0 ? split : 0} rot={(i * 47) % 360 + (mode === "boil" ? f * 3 * (i % 2 ? 1 : -1) : 0)} style={{ position: "absolute", left: `${bx}%`, top: `${by}%`, transform: `translate(${jx}px, ${-jy}px) rotate(${(i * 47) % 360}deg)` }} />;
          })}
          {mode !== "calm" ? Array.from({ length: mode === "boil" ? 22 : 4 }, (_, i) => {
            const per = mode === "boil" ? 26 : 70, p = ((f + i * 13) % per) / per;
            const r = mode === "boil" ? 14 + (i % 4) * 8 : 7;
            return <div key={"b" + i} style={{ position: "absolute", left: `${8 + ((i * 37) % 82)}%`, bottom: `${p * 76}%`, width: r, height: r, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.15)", opacity: 1 - p * 0.6 }} />;
          }) : null}
          {grey > 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: "22%", height: "18%", opacity: grey, background: "radial-gradient(ellipse 30% 60% at 20% 50%, #B5ADA2, transparent 70%), radial-gradient(ellipse 35% 60% at 60% 40%, #A79F94, transparent 70%), radial-gradient(ellipse 25% 50% at 85% 60%, #B9B1A6, transparent 70%)" }} /> : null}
          {children}
        </div>
      </div>
      {hot > 0 ? <div style={{ position: "absolute", left: thin ? "38%" : "10%", right: thin ? "38%" : "10%", bottom: -24, height: 30, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,140,40,${hot}), rgba(255,60,20,${0.6 * hot}) 50%, transparent 75%)` }} /> : null}
    </div>
  );
};
// llama de hornalla (azul), nivel 0..1
const Flame: React.FC<{ x: number; y: number; w: number; lv: number; f: number }> = ({ x, y, w, lv, f }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 160, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
    {Array.from({ length: 9 }, (_, i) => {
      const hh = (24 + 110 * lv) * (0.85 + 0.15 * Math.sin(f / 3 + i * 1.3));
      return <div key={i} style={{ width: w / 14, height: hh, borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%", background: "linear-gradient(0deg, #1E4FD8, #4F8BFF 45%, rgba(170,210,255,0.6) 80%, transparent)", boxShadow: "0 0 18px rgba(80,140,255,0.6)" }} />;
    })}
  </div>
);
const Label: React.FC<{ txt: string; u: number; x: number; y: number; size?: number; color?: string; bg?: string; rot?: number }> = ({ txt, u, x, y, size = 44, color = CREAM, bg = TOM, rot = -2 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: PF, fontWeight: 900, fontSize: size, color, background: bg, padding: "8px 22px", borderRadius: 8, boxShadow: "0 8px 18px rgba(0,0,0,0.35)", whiteSpace: "nowrap",
    transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * eo(u)})`, opacity: cl(u * 2.5) }}>{txt}</div>
);
const Arrow: React.FC<{ x: number; y: number; len: number; ang: number; u: number; color?: string }> = ({ x, y, len, ang, u, color = CHALK }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: `rotate(${ang}deg)`, transformOrigin: "0 0" }} width={len} height={40}>
    <path d={`M 0 0 Q ${len * 0.5} -26 ${len} 0 M ${len - 22} -14 L ${len} 0 L ${len - 24} 12`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const g0 = (a: number, a0?: number) => (a0 ?? a);

// ═════════════════════════════════════════════ COMPONENTES ═════════════════════════════════════════════

// 1 · promesa (= miniatura): ficha "FRIJOLES SIN GASES" sobre mantel
export const Promesa: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const it = [{ t: 5.9, txt: "Livianos" }, { t: 9.0, txt: "Sin panza inflada" }, { t: 10.0, txt: "Enteros y cremosos" }];
  return shell(<Bg k="mantel" f={f} d={d} />, <>
    <Ficha x={360} y={150} w={1200} h={780} rot={-2} u={u}>
      <div style={{ position: "absolute", left: 120, top: 26 }}><Ti txt="FRIJOLES" size={92} color={TOM2} u={sp(f, 4)} /></div>
      <div style={{ position: "absolute", left: 600, top: 26 }}><Ti txt="SIN GASES" size={92} color={BAS2} u={sp(f, 10)} /></div>
      {it.map((x, i) => { const v = cl((f - at(x.t)) / 12); return (
        <div key={i} style={{ position: "absolute", left: 140, top: 190 + i * 130, display: "flex", alignItems: "center", gap: 26 }}>
          <Tick u={v} size={70} /><Hand txt={x.txt} u={v} size={86} color={INK} />
        </div>); })}
    </Ficha>
    <Stamp txt="TRUCO DE LA NONNA · NÁPOLES" u={cl((f - 20) / 10)} size={40} color={TOM} rot={-6} style={{ left: 980, top: 820 }} />
  </>);
};

// 2 · olla rota: mitad reventados, mitad duros
export const OllaRota: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0);
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 460, top: 120, width: 1000, height: 820, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #5B5B5C, #2A2A2B 60%, #141414)", boxShadow: SH + ", inset 0 0 0 26px #3A3A3B", transform: `scale(${0.85 + 0.15 * u})`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 60, top: 60, right: 500, bottom: 60, borderRadius: "400px 0 0 400px", background: "radial-gradient(ellipse at 60% 50%, #9E968B, #7A7268 70%)" }}>
        {Array.from({ length: 12 }, (_, i) => <Bean key={i} w={88} split={1} old rot={i * 53} style={{ position: "absolute", left: 50 + (i % 3) * 110 + ((i * 37) % 30), top: 90 + Math.floor(i / 3) * 140 + ((i * 53) % 40) }} />)}
      </div>
      <div style={{ position: "absolute", left: 500, top: 60, right: 60, bottom: 60, borderRadius: "0 400px 400px 0", background: "radial-gradient(ellipse at 40% 50%, #7A5A3E, #4E3522 70%)" }}>
        {Array.from({ length: 14 }, (_, i) => <Bean key={i} w={80} rot={i * 71} style={{ position: "absolute", left: 40 + (i % 3) * 115 + ((i * 41) % 30), top: 80 + Math.floor(i / 3) * 120 + ((i * 29) % 40) }} />)}
      </div>
      <div style={{ position: "absolute", left: 497, top: 0, bottom: 0, width: 6, background: CHALK, opacity: 0.85 }} />
    </div>
    <Label txt="MITAD REVENTADOS" u={cl((f - 8) / 10)} x={150} y={110} size={50} />
    <Label txt="MITAD DUROS" u={cl((f - 22) / 10)} x={1330} y={860} size={50} bg={INK} rot={2} />
  </>);
};

// 3 · pizarra: los 2 errores
export const PizarraErrores: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  const L = [{ t: 61.9, txt: "Remojo apurado" }, { t: 63.4, txt: "Hervor a borbotones" }];
  return shell(<Bg k="tile" f={f} d={d} />, <Board x={330} y={110} w={1260} h={860} u={u} rot={-1}>
    <div style={{ position: "absolute", left: 80, top: 50 }}><Hand txt="Los 2 errores de siempre" u={cl(f / 22)} size={92} chalk /></div>
    <div style={{ position: "absolute", left: 80, top: 160, width: 1000 * eo(f / 26), height: 5, background: CHALK, opacity: 0.6, borderRadius: 3 }} />
    {L.map((x, i) => { const v = cl((f - at(x.t)) / 14); return (
      <div key={i} style={{ position: "absolute", left: 100, top: 250 + i * 170, display: "flex", alignItems: "center", gap: 30 }}>
        <Tick u={v} no size={80} color="#FF8A7A" /><Hand txt={`${i + 1}. ${x.txt}`} u={v} size={100} chalk />
      </div>); })}
    <div style={{ position: "absolute", left: 120, top: 610 }}><Hand txt="= olla rota + noche de gases" u={cl((f - at(64.0)) / 18)} size={72} color="#F5C26B" /></div>
  </Board>);
};

// 4 · corte del frijol: piel, corazón, azúcares
export const FrijolCorte: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const vS = cl((f - at(75.5)) / 12), vA = cl((f - at(77.7)) / 14);
  return shell(<Bg k="cream" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 520, top: 260, transform: `scale(${0.6 + 0.4 * u}) rotate(-6deg)` }}><BeanCut w={880} dots={vA} f={f} /></div>
    <Label txt="CORAZÓN SUAVE" u={cl(f / 10)} x={760} y={150} bg={BAS} />
    <Arrow x={1060} y={240} len={140} ang={80} u={cl(f / 14)} color={BAS2} />
    <Label txt="PIEL FINITA" u={vS} x={1420} y={330} bg={TOM2} rot={3} />
    <Arrow x={1460} y={420} len={120} ang={130} u={vS} color={TOM2} />
    <Label txt="AZÚCARES QUE LA PANZA NO DESHACE" u={vA} x={300} y={880} bg="#C98A1E" size={46} rot={-1} />
  </>);
};

// 5 · viaje de los azúcares: panza → intestino → fiesta de bacterias → gases
export const ViajeAzucar: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const st = [{ txt: "PANZA" }, { txt: "INTESTINO" }, { txt: "BACTERIAS" }, { txt: "GASES" }];
  const p = eo(f / Math.max(1, d - 20));
  return shell(<Bg k="chalk" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 120, top: 110 }}><Hand txt="Los azúcares pasan de largo…" u={cl(f / 20)} size={84} chalk /></div>
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      <path d="M 250 600 C 600 400, 800 800, 1100 600 S 1500 450, 1700 600" stroke={CHALK} strokeWidth={8} strokeDasharray="22 18" fill="none" opacity={0.7} />
    </svg>
    {st.map((s, i) => { const v = cl((p * 4 - i) * 1.2); const x = 250 + i * 483, y = 600;
      return <div key={i} style={{ position: "absolute", left: x - 140, top: y - 140, width: 280, height: 280, borderRadius: "50%", background: i === 3 ? TOM : i === 2 ? "#C98A1E" : "rgba(243,240,230,0.12)", border: `5px solid ${CHALK}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${0.4 + 0.6 * eo(v)}) rotate(${i === 2 ? 6 * Math.sin(f / 4) : 0}deg)`, opacity: cl(v * 2), boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
        {i === 2 ? <div style={{ display: "flex", gap: 10 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 40, height: 40, borderRadius: "50%", background: BAS, border: "4px solid #E8F0D8", transform: `translateY(${10 * Math.sin(f / 3 + k * 2)}px)` }} />)}</div>
          : i === 3 ? <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 34 + k * 8, height: 34 + k * 8, borderRadius: "50%", border: "5px solid #FFE6DF", transform: `translateY(${-((f * 2 + k * 15) % 40)}px)` }} />)}</div>
          : <div style={{ width: 120, height: i === 0 ? 90 : 26, borderRadius: i === 0 ? "10px 10px 60px 60px" : 20, background: i === 0 ? "linear-gradient(180deg, #E8C9A0, #B8875A)" : "repeating-linear-gradient(90deg, #E8B0A0 0 20px, #C98070 20px 40px)" }} />}
        <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 38, color: CHALK, marginTop: 14 }}>{s.txt}</div>
      </div>; })}
  </>);
};

// 6 · la pignata de la nonna Assunta
export const Pignata: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 100);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: TX.wood, boxShadow: "0 -10px 30px rgba(0,0,0,0.3)" }} />
    <div style={{ position: "absolute", left: 820, top: 200, transform: `translateY(${(1 - u) * 300}px)` }}>
      <PignataPot w={620} steam={1} f={f} />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: -40, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,120,30,0.75), rgba(200,40,10,0.4) 50%, transparent 75%)", opacity: 0.7 + 0.3 * Math.sin(f / 5) }} />
    </div>
    <div style={{ position: "absolute", left: 140, top: 110 }}><Ti txt="PIGNATA" size={150} color={COP2} u={cl((f - at(108.4)) / 10)} sh /></div>
    <div style={{ position: "absolute", left: 150, top: 270 }}><Hand txt="la olla de barro de la nonna" u={cl((f - at(108.6)) / 18)} size={64} /></div>
    <Label txt="2 ASAS" u={cl((f - at(110.0)) / 10)} x={1560} y={420} bg={BAS} />
    <Arrow x={1560} y={470} len={120} ang={160} u={cl((f - at(110.0)) / 12)} color={BAS2} />
    <Label txt="BOCA ANGOSTA" u={cl((f - at(110.9)) / 10)} x={1250} y={110} bg={TOM} rot={2} />
  </>);
};

// 7 · pizarra de trattoria: el menú de los 8 trucos, el 1 guardado
export const PizarraTrucos: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 120);
  return shell(<Bg k="tile" f={f} d={d} />, <Board x={480} y={60} w={960} h={960} u={u}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center" }}><Hand txt="Menù di oggi" u={cl(f / 14)} size={84} chalk style={{ display: "inline-block" }} /></div>
    {[8, 7, 6, 5, 4, 3, 2].map((n, i) => <div key={n} style={{ position: "absolute", left: 120, top: 170 + i * 80 }}><Hand txt={`Truco ${n}  · · · · · · · · ·`} u={cl((f - 6 - i * 4) / 10)} size={58} chalk /></div>)}
    <div style={{ position: "absolute", left: 100, top: 740, width: 700, height: 110, borderRadius: 12, border: "4px dashed #F5C26B", display: "flex", alignItems: "center", justifyContent: "center", opacity: cl((f - 40) / 10), transform: `scale(${0.9 + 0.1 * Math.sin(f / 6)})` }}>
      <Hand txt="Truco 1: el viejo · al final" u={cl((f - 42) / 14)} size={58} color="#F5C26B" />
    </div>
  </Board>);
};

// 8 · los nombres: fagioli = frijoles = porotos = judías (etiquetas colgando del mantel)
export const Nombres: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const N = [{ t: 173.6, txt: "FAGIOLI", s: "Italia", c: BAS }, { t: 174.0, txt: "FRIJOLES", s: "México y Centroamérica", c: TOM }, { t: 174.3, txt: "POROTOS", s: "Sur", c: COP }, { t: 174.6, txt: "JUDÍAS", s: "España", c: INK }];
  return shell(<Bg k="mantel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 90, height: 8, background: "linear-gradient(90deg, #6E4A2A, #A8774A, #6E4A2A)", boxShadow: "0 6px 12px rgba(0,0,0,0.3)" }} />
    {N.map((x, i) => { const v = sp(f, at(x.t), 10, 90); const sw = 6 * Math.sin(f / 12 + i) * (1 - cl(v - 0.2));
      return <div key={i} style={{ position: "absolute", left: 120 + i * 440, top: 98, width: 380, transformOrigin: "50% 0", transform: `rotate(${sw + (1 - v) * 40}deg)`, opacity: cl(v * 3) }}>
        <div style={{ margin: "0 auto", width: 4, height: 130, background: "#5A3A20" }} />
        <div style={{ borderRadius: 18, background: TX.cream, padding: "36px 10px", textAlign: "center", boxShadow: SH, border: `6px solid ${x.c}` }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", margin: "-20px auto 18px", background: "#5A3A20", boxShadow: "inset 0 3px 4px rgba(0,0,0,0.5)" }} />
          <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 70, color: x.c }}>{x.txt}</div>
          <div style={{ fontFamily: CV, fontWeight: 700, fontSize: 48, color: INK, marginTop: 6 }}>{x.s}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>{[0, 1, 2].map((k) => <Bean key={k} w={70} kind={i === 0 ? "borlotti" : i === 1 ? "red" : i === 2 ? "borlotti" : "white"} rot={k * 40 - 30} />)}</div>
        </div>
      </div>; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center" }}><Hand txt="La olla es la misma." u={cl((f - 60) / 18)} size={90} color={TOM2} style={{ display: "inline-block" }} /></div>
  </>);
};

// 9 · capítulo: plaqueta de mayólica con el número del truco
export const Capitulo: P<{ n: number; t: string } & A0> = ({ a, d, n, t }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 12, 110), v = sp(f, 8, 14, 120);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 610, top: 120, width: 700, height: 700, transform: `perspective(1600px) rotateY(${(1 - u) * -70}deg) scale(${0.7 + 0.3 * u})`, borderRadius: 26, boxShadow: SH,
      background: `radial-gradient(circle at 50% 50%, ${CREAM} 52%, transparent 53%), repeating-conic-gradient(from 0deg at 50% 50%, #2B5DA8 0 15deg, #F2C94C 15deg 30deg), ${CREAM}` }}>
      <div style={{ position: "absolute", inset: 28, borderRadius: 18, border: "10px solid #2B5DA8", boxShadow: "inset 0 0 0 6px #F2C94C" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: PF, fontWeight: 700, fontSize: 64, color: "#2B5DA8", letterSpacing: 8 }}>TRUCO Nº</div>
        <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 330, color: TOM, lineHeight: 0.95, textShadow: "0 6px 0 rgba(0,0,0,0.15)" }}>{n}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: `linear-gradient(115deg, transparent ${-20 + 140 * cl(f / 40)}%, rgba(255,255,255,0.45) ${-10 + 140 * cl(f / 40)}%, transparent ${0 + 140 * cl(f / 40)}%)` }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
      <div style={{ background: TOM, color: CREAM, fontFamily: PF, fontWeight: 900, fontSize: 76, padding: "14px 60px", borderRadius: 10, boxShadow: SH, transform: `scaleX(${eo(v)})`, whiteSpace: "nowrap", clipPath: "polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)" }}>
        <span style={{ opacity: cl((f - 14) / 8) }}>{t}</span>
      </div>
    </div>
  </>);
};

// 10 · centro duro = pesado
export const CentroDuro: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 110);
  const pul = 0.75 + 0.25 * Math.sin(f / 5);
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 300, top: 300, transform: `rotate(-12deg) translateX(${-60 * eo(u)}px)` }}><BeanCut w={620} center={pul * cl((f - 10) / 10)} /></div>
    <div style={{ position: "absolute", left: 1000, top: 300, transform: `rotate(10deg) translateX(${60 * eo(u)}px) scaleX(-1)` }}><BeanCut w={620} center={pul * cl((f - 10) / 10)} /></div>
    <Label txt="CENTRO CASI CRUDO" u={cl((f - 18) / 10)} x={620} y={120} size={62} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center" }}><Hand txt="la panza lo pelea toda la noche" u={cl((f - 60) / 22)} size={80} color={CREAM} style={{ display: "inline-block", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }} /></div>
  </>);
};

// 11 · viejo vs nuevo
export const ViejoNuevo: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const L = [{ t: 241.6, txt: "opaco" }, { t: 242.6, txt: "descolorido" }, { t: 244.3, txt: "piel arrugada" }];
  const R = ["brilla", "gordito", "color parejo"];
  const vR = cl((f - at(244.2)) / 10);
  return shell(<Bg k="cream" f={f} d={d} />, <>
    {[0, 1].map((s) => { const old = s === 0; const v = old ? sp(f, 0) : sp(f, at(243.8));
      return <div key={s} style={{ position: "absolute", left: old ? 120 : 1000, top: 110, width: 800, height: 860, borderRadius: 22, background: old ? "linear-gradient(170deg, #D9D2C4, #B9B0A0)" : "linear-gradient(170deg, #FFF8EA, #F1E2C6)", boxShadow: SH, transform: `translateY(${(1 - v) * 80}px)`, opacity: cl(v * 2.5) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center" }}><Ti txt={old ? "VIEJO" : "NUEVO"} size={96} color={old ? GREY : BAS2} /></div>
        <div style={{ position: "absolute", left: 120, top: 170, display: "flex", flexWrap: "wrap", gap: 18, width: 560, justifyContent: "center" }}>
          {Array.from({ length: 8 }, (_, i) => <Bean key={i} w={118} old={old} split={old && i % 3 === 0 ? 0.8 : 0} rot={i * 37 - 40} glow={!old ? 0.25 + 0.2 * Math.sin(f / 6 + i) : 0} />)}
        </div>
        {(old ? L.map((x) => ({ txt: x.txt, v: cl((f - at(x.t)) / 10) })) : R.map((txt, i) => ({ txt, v: cl((vR * 3 - i) * 1.3) }))).map((x, i) => (
          <div key={i} style={{ position: "absolute", left: 140, top: 530 + i * 100, display: "flex", alignItems: "center", gap: 20 }}><Tick u={x.v} no={old} size={58} /><Hand txt={x.txt} u={x.v} size={70} /></div>
        ))}
      </div>; })}
  </>);
};

// 12 · calendario: cocínalos dentro del año
export const Calendario: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 110);
  const M = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const p = eo(f / Math.max(1, d * 0.7));
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 420, top: 90, width: 1080, height: 900, borderRadius: 16, background: TX.cream, boxShadow: SH, transform: `rotate(-1.5deg) translateY(${(1 - u) * 90}px)` }}>
      {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ position: "absolute", top: -22, left: 120 + k * 160, width: 26, height: 54, borderRadius: 13, background: TX.copper, boxShadow: "0 4px 6px rgba(0,0,0,0.4)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}><Ti txt="1 AÑO, NO MÁS" size={84} color={TOM2} /></div>
      <div style={{ position: "absolute", left: 80, top: 190, display: "grid", gridTemplateColumns: "repeat(4, 210px)", gap: 24 }}>
        {M.map((m, i) => { const on = p * 12 > i;
          return <div key={i} style={{ height: 150, borderRadius: 12, background: on ? (i < 11 ? "rgba(63,125,58,0.18)" : "rgba(200,55,45,0.2)") : "rgba(0,0,0,0.04)", border: `3px solid ${on ? (i < 11 ? BAS : TOM) : "rgba(0,0,0,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 52, color: INK }}>{m}</div>
            {on ? <div style={{ position: "absolute", right: 10, top: 6 }}><Tick u={cl(p * 12 - i)} size={40} no={i === 11} /></div> : null}
          </div>; })}
      </div>
    </div>
    <Stamp txt="COCÍNALOS DENTRO DEL AÑO" u={cl((f - d + 50) / 10)} size={50} rot={-5} style={{ left: 560, top: 900 }} />
  </>);
};

// 13 · la bandeja: intrusos marcados
export const Bandeja: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0);
  const I = [{ x: 380, y: 260, txt: "PIEDRITA", k: "stone" }, { x: 900, y: 520, txt: "TERRÓN", k: "dirt" }, { x: 1250, y: 280, txt: "ARRUGADO", k: "old" }];
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 90, width: 1600, height: 900, borderRadius: 40, background: "radial-gradient(ellipse 70% 60% at 40% 35%, #FFFFFF, #ECEFF0 70%, #D3D8DA)", boxShadow: SH + ", inset 0 0 0 18px #F6F8F8, inset 0 0 0 22px #1F3D6E", transform: `scale(${0.9 + 0.1 * u})` }}>
      {Array.from({ length: 34 }, (_, i) => <Bean key={i} w={92} rot={(i * 67) % 360} style={{ position: "absolute", left: 80 + ((i * 173) % 1380), top: 80 + ((i * 101) % 700) }} />)}
      {I.map((x, i) => { const v = cl((f - 10 - i * 12) / 10); return <div key={i} style={{ position: "absolute", left: x.x, top: x.y }}>
        {x.k === "stone" ? <div style={{ width: 90, height: 64, borderRadius: "45% 55% 50% 50%", background: "radial-gradient(ellipse at 35% 30%, #B8B2A8, #7C766C 70%)", boxShadow: "0 5px 8px rgba(0,0,0,0.35)" }} />
          : x.k === "dirt" ? <div style={{ width: 96, height: 72, borderRadius: "40% 60% 45% 55%", background: "radial-gradient(ellipse at 35% 30%, #7A5636, #4A3020 70%)", boxShadow: "0 5px 8px rgba(0,0,0,0.35)" }} />
          : <Bean w={64} old />}
        <svg style={{ position: "absolute", left: -50, top: -50, overflow: "visible" }} width={200} height={170}><ellipse cx={95} cy={82} rx={92} ry={78} stroke={TOM} strokeWidth={9} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(v)} /></svg>
        <div style={{ position: "absolute", left: -40, top: 130 }}><Label txt={x.txt} u={v} x={0} y={0} size={40} /></div>
      </div>; })}
    </div>
  </>);
};

// 14 · reloj de cocina con forma de tomate: empieza a correr el reloj
export const RelojCocina: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 12, 120);
  const ang = -40 * eo(f / 20) + f * 1.2;
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 610, top: 170, width: 700, height: 640, transform: `scale(${0.6 + 0.4 * u}) rotate(${2 * Math.sin(f / 2.5) * cl((f - 20) / 10)}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "48% 52% 46% 54% / 52% 50% 50% 48%", background: "radial-gradient(ellipse 40% 35% at 35% 30%, #FF8A6E, #D6402F 45%, #8E1F18 95%)", boxShadow: SH + ", inset -30px -40px 70px rgba(80,10,5,0.45)" }} />
      <div style={{ position: "absolute", left: 270, top: -40, width: 160, height: 90, background: `conic-gradient(from 0deg, ${BAS} 0 20deg, transparent 20deg 70deg, ${BAS} 70deg 90deg, transparent 90deg 140deg, ${BAS} 140deg 160deg, transparent 160deg 210deg, ${BAS} 210deg 230deg, transparent 230deg 280deg, ${BAS} 280deg 300deg, transparent 300deg)`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", left: 335, top: -70, width: 30, height: 70, borderRadius: 10, background: BAS2 }} />
      <div style={{ position: "absolute", left: 130, top: 130, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, #FFFDF5, #EFE6D0)", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.25)" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 216, top: 16, width: 8, height: 34, borderRadius: 4, background: INK, transformOrigin: "4px 204px", transform: `rotate(${i * 30}deg)` }} />)}
        <div style={{ position: "absolute", left: 212, top: 60, width: 16, height: 165, borderRadius: 8, background: TOM2, transformOrigin: "8px 160px", transform: `rotate(${ang}deg)` }} />
        <div style={{ position: "absolute", left: 195, top: 195, width: 50, height: 50, borderRadius: "50%", background: TX.copper }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center" }}><Ti txt="EMPIEZA A CORRER EL RELOJ" size={78} color={INK} u={cl((f - 30) / 12)} /></div>
  </>);
};

// 15 · el agua se carga: el frijol suelta azúcares hasta que el agua ya no recibe más
export const AguaCargada: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const lv = eo(f / Math.max(1, d - 30));
  return shell(<Bg k="cream" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 610, top: 120, width: 700, height: 820, borderRadius: "40px 40px 70px 70px", background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.35))", border: "6px solid rgba(180,200,210,0.9)", boxShadow: SH, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "86%", background: `linear-gradient(180deg, rgba(${200 - 30 * lv},${220 - 50 * lv},${235 - 90 * lv},0.75), rgba(${170 - 30 * lv},${190 - 60 * lv},${200 - 100 * lv},0.85))` }} />
      {Array.from({ length: 70 }, (_, i) => { const born = i / 70; const v = cl((lv - born) * 5); const y = 680 - v * (300 + (i * 37) % 300);
        return <div key={i} style={{ position: "absolute", left: 60 + (i * 89) % 560, top: y, width: 14, height: 14, borderRadius: "50%", background: "#E2A23A", opacity: v * 0.85, boxShadow: "0 0 6px rgba(226,162,58,0.8)" }} />; })}
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 20, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>{Array.from({ length: 16 }, (_, i) => <Bean key={i} w={110} rot={i * 47} />)}</div>
    </div>
    <div style={{ position: "absolute", left: 1400, top: 200, width: 60, height: 600, borderRadius: 30, background: "rgba(0,0,0,0.12)", overflow: "hidden", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.25)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${100 * lv}%`, background: lv > 0.85 ? TOM : "#E2A23A" }} />
    </div>
    <Label txt={lv > 0.85 ? "AGUA LLENA: YA NO SUELTA" : "AZÚCARES AL AGUA"} u={cl(f / 10)} x={lv > 0.85 ? 1080 : 1220} y={830} size={44} bg={lv > 0.85 ? TOM : "#C98A1E"} />
  </>);
};

// 16 · ficha del remojo de la nonna
export const FichaRemojo: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110);
  const L = [{ t: 374.8, txt: "Bol grande" }, { t: 375.4, txt: "Agua fría ×3" }, { t: 378.7, txt: "12 horas, mínimo" }, { t: 379.9, txt: "Cambiar el agua 2 veces" }];
  return shell(<Bg k="mantel" f={f} d={d} />, <Ficha x={330} y={110} w={1260} h={860} rot={1.5} u={u} title="Remojo de la nonna">
    {L.map((x, i) => { const v = cl((f - at(x.t)) / 12); return (
      <div key={i} style={{ position: "absolute", left: 130, top: 178 + i * 130, display: "flex", alignItems: "center", gap: 24 }}><Tick u={v} size={66} /><Hand txt={x.txt} u={v} size={92} color="#22314F" /></div>); })}
    <div style={{ position: "absolute", right: 70, top: 220, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(63,125,58,0.12), transparent 70%)", border: `8px solid ${BAS}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(-10deg) scale(${eo(cl((f - at(378.8)) / 10))})` }}>
      <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 120, color: BAS2, lineHeight: 0.9 }}>12</div><div style={{ fontFamily: PF, fontWeight: 900, fontSize: 46, color: BAS2 }}>HORAS</div>
    </div>
  </Ficha>);
};

// 17 · línea del remojo: noche → mañana, dos cambios de agua
export const LineaRemojo: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const p = eo(f / Math.max(1, d - 10));
  const P2 = [{ x: 0.12, txt: "AL REMOJO", c: INK }, { x: 0.5, txt: "CAMBIO 1 · antes de dormir", c: TOM }, { x: 0.88, txt: "CAMBIO 2 · a la mañana", c: BAS }];
  return shell(<Bg k="chalk" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 120 }}><Hand txt="Línea del remojo: 8 a 12 horas" u={cl(f / 16)} size={80} chalk /></div>
    <div style={{ position: "absolute", left: 200, top: 560, width: 1520, height: 12, borderRadius: 6, background: "rgba(243,240,230,0.25)" }}>
      <div style={{ width: `${100 * p}%`, height: "100%", borderRadius: 6, background: "linear-gradient(90deg, #3E5A8C, #F5C26B)" }} />
    </div>
    <div style={{ position: "absolute", left: 200 + 1520 * 0.3, top: 330, width: 120, height: 120, borderRadius: "50%", boxShadow: "inset -30px -8px 0 0 #F3F0E6", transform: "rotate(-20deg)", opacity: 0.9 }} />
    <div style={{ position: "absolute", left: 200 + 1520 * 0.82, top: 320, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, #FFE08A, #F5B53B)", boxShadow: "0 0 50px rgba(245,181,59,0.8)", opacity: cl(p * 2 - 1) }} />
    {P2.map((x, i) => { const v = cl((p - x.x + 0.12) * 6); return <div key={i} style={{ position: "absolute", left: 200 + 1520 * x.x - 40, top: 520 }}>
      <div style={{ width: 92, height: 92, borderRadius: "50% 50% 50% 0", transform: `rotate(-45deg) scale(${eo(v)})`, background: x.c === INK ? "#6A87B8" : x.c, border: "5px solid #F3F0E6", boxShadow: "0 10px 20px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", left: -110, top: 130, width: 320, textAlign: "center" }}><Hand txt={x.txt} u={v} size={50} chalk style={{ whiteSpace: "normal" }} /></div>
    </div>; })}
  </>);
};

// 18 · bicarbonato: media cucharadita
export const Bicarbonato: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 110);
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 220, top: 200, width: 460, height: 640, borderRadius: 18, background: "linear-gradient(90deg, #E9EEF2, #FFFFFF 40%, #D7DDE2)", boxShadow: SH, transform: `rotate(-6deg) translateY(${(1 - u) * 200}px)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 180, background: "linear-gradient(180deg, #2B5DA8, #1D4180)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontFamily: PF, fontWeight: 900, fontSize: 56, color: "#FFFFFF" }}>BICARBO-<br />NATO</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 300, fontFamily: CV, fontWeight: 700, fontSize: 44, color: "#1D4180", textAlign: "center" }}>de sodio</div>
    </div>
    <div style={{ position: "absolute", left: 820, top: 360, width: 520, height: 300, transform: `rotate(${-14 + 8 * eo(cl((f - 20) / 20))}deg)` }}>
      <div style={{ position: "absolute", left: 300, top: 120, width: 500, height: 46, borderRadius: 23, background: "linear-gradient(180deg, #E4E8EA, #9AA1A6)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: 0, top: 30, width: 330, height: 230, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #FFFFFF, #B8BEC2 70%)", boxShadow: SH }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 30, height: 170, borderRadius: "50%", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: "radial-gradient(ellipse at 60% 50%, #FFFFFF, #E9E6DE)", transform: `scaleY(${eo(cl((f - 10) / 14))})` }} />
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, background: "rgba(0,0,0,0.2)" }} />
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 120 }}><Ti txt="½ CUCHARADITA" size={96} color={CREAM} u={cl((f - 8) / 10)} sh /></div>
    <div style={{ position: "absolute", left: 1010, top: 760 }}><Hand txt="ablanda la piel" u={cl((f - 30) / 18)} size={88} color="#F5D48A" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)" }} /></div>
  </>);
};

// 19 · más no es mejor: una pizca ✓ · mucho ✗ (continúa tras el avatar)
export const MasNoEsMejor: P<A0> = ({ a, d, a0 }) => {
  const { f, at } = useT(a);
  const g = f + fr(a) - fr(g0(a, a0));
  const vL = cl((f - at(415.4)) / 10), vX = cl((f - at(417.0)) / 10), vP = cl((f - at(422.3)) / 10), vE = cl((f - at(423.9)) / 12);
  return shell(<Bg k="cream" f={g} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Ti txt="MÁS NO ES MEJOR" size={100} color={TOM2} u={Math.max(vL, vP)} /></div>
    {[0, 1].map((s) => { const ok = s === 0; const v = ok ? Math.max(vP, cl(g / 10)) : Math.max(vX, cl((g - 10) / 10));
      return <div key={s} style={{ position: "absolute", left: ok ? 200 : 1020, top: 230, width: 700, height: 740, borderRadius: 24, background: TX.cream, boxShadow: SH, border: `8px solid ${ok ? BAS : TOM}`, transform: `translateY(${(1 - eo(v)) * 60}px)`, opacity: cl(v * 2.5) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center" }}><Ti txt={ok ? "UNA PIZCA" : "UN PUÑADO"} size={80} color={ok ? BAS2 : TOM2} /></div>
        <div style={{ position: "absolute", left: 250, top: 190, width: 200, height: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ width: ok ? 70 : 200, height: ok ? 40 : 160, borderRadius: "50% 50% 10px 10px", background: "radial-gradient(ellipse at 50% 30%, #FFFFFF, #E2DED4)", boxShadow: "0 8px 16px rgba(0,0,0,0.25)" }} />
        </div>
        <div style={{ position: "absolute", left: 80, top: 430, display: "flex", alignItems: "center", gap: 18 }}><Tick u={v} no={!ok} size={70} /><Hand txt={ok ? "y se enjuagan bien" : "gusto jabonoso"} u={ok ? Math.max(vE, cl((g - 20) / 12)) : v} size={70} /></div>
        {!ok ? <div style={{ position: "absolute", left: 80, top: 560, display: "flex", alignItems: "center", gap: 18 }}><Tick u={v} no size={70} /><Hand txt="se deshacen" u={cl(v * 2 - 0.6)} size={70} /></div> : null}
      </div>; })}
  </>);
};

// 20 · frasco turbio: noche clara → mañana turbia con espumita
export const FrascoTurbio: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const tb = cl((f - at(428.6)) / 25), fo = cl((f - at(429.6)) / 18);
  const Jar: React.FC<{ x: number; turb: number; foam: number; lbl: string; lv: number }> = ({ x, turb, foam, lbl, lv }) => (
    <div style={{ position: "absolute", left: x, top: 180, width: 560, height: 700 }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: -40, height: 70, borderRadius: 14, background: TX.copper, boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 60px 60px", border: "6px solid rgba(190,205,215,0.95)", background: "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.4))", boxShadow: SH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv}%`, background: `linear-gradient(180deg, rgba(${215 - 40 * turb},${230 - 60 * turb},${240 - 110 * turb},${0.55 + 0.35 * turb}), rgba(${190 - 50 * turb},${205 - 70 * turb},${215 - 120 * turb},${0.65 + 0.3 * turb}))` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: `${lv - 4}%`, height: 50, opacity: foam, background: "radial-gradient(ellipse 14% 60% at 15% 50%, #F4F0E6, transparent 70%), radial-gradient(ellipse 16% 60% at 40% 40%, #EAE4D6, transparent 70%), radial-gradient(ellipse 14% 60% at 65% 55%, #F4F0E6, transparent 70%), radial-gradient(ellipse 14% 60% at 88% 45%, #EAE4D6, transparent 70%)" }} />
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 20, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>{Array.from({ length: 15 }, (_, i) => <Bean key={i} w={lv > 70 ? 120 : 92} rot={i * 47} />)}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center" }}><Ti txt={lbl} size={60} color={CREAM} sh /></div>
    </div>
  );
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <Jar x={280} turb={0} foam={0} lbl="NOCHE" lv={70} />
    <div style={{ opacity: cl((f - at(427.9)) / 10) }}><Jar x={1080} turb={tb} foam={fo} lbl="MAÑANA" lv={82} /></div>
    <Stamp txt="ESO TE COMÍAS" u={cl((f - at(431.3)) / 10)} size={66} rot={-8} style={{ left: 1150, top: 90 }} />
  </>);
};

// 21 · el agua del remojo se tira (continúa tras el avatar)
export const SeTira: P<A0> = ({ a, d, a0 }) => {
  const { f, at } = useT(a);
  const g = f + fr(a) - fr(g0(a, a0));
  const vA = cl((f - at(451.6)) / 10), vS = cl((f - at(453.0)) / 8), vD = cl((f - at(455.4)) / 14);
  const tilt = -14 * eo(vD);
  return shell(<Bg k="tile" f={g} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Ti txt="EL AGUA DEL REMOJO" size={96} color={INK} u={cl(g / 10)} /></div>
    <div style={{ position: "absolute", left: 460, top: 260, width: 1000, height: 560, transform: `rotate(${tilt}deg)`, transformOrigin: "20% 100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "0 0 500px 500px / 0 0 420px 420px", background: "linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 75%, rgba(255,255,255,0.45))", border: "8px solid rgba(190,205,215,0.95)", borderTop: "none", boxShadow: SH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0, background: "linear-gradient(180deg, rgba(176,150,100,0.85), rgba(120,95,60,0.95))" }} />
        {Array.from({ length: 34 }, (_, i) => <div key={i} style={{ position: "absolute", left: 90 + (i * 83) % 820, top: 110 + (i * 61) % 380, width: 18, height: 18, borderRadius: "50%", background: "#F2B33D", boxShadow: "0 0 8px rgba(242,179,61,0.9)", opacity: Math.max(vA, cl(g / 14)), transform: `translateY(${6 * Math.sin(g / 7 + i)}px)` }} />)}
      </div>
      <div style={{ position: "absolute", left: -10, right: -10, top: -14, height: 30, borderRadius: 15, background: "linear-gradient(180deg, #E8EEF2, #B8C4CC)" }} />
    </div>
    <Label txt="AZÚCARES QUE NO TE DEJAN DORMIR" u={Math.max(vA, cl((g - 12) / 10))} x={560} y={300} size={44} bg="#C98A1E" />
    <Stamp txt="SE TIRA. TODA." u={Math.max(vS, cl((g - 20) / 8))} size={110} rot={-10} style={{ left: 640, top: 600 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center" }}><Hand txt="no le devuelvas lo que le sacaste" u={vD} size={70} color={TOM2} style={{ display: "inline-block" }} /></div>
  </>);
};

// 22 · olla finita vs olla gruesa
export const OllaFinaGruesa: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const vT = cl((f - at(515.8)) / 14), vG = cl((f - at(516.4)) / 10);
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <PotCut x={160} y={240} w={680} h={560} f={f} mode="calm" thin hot={vT} />
    <div style={{ position: "absolute", left: 300, top: 760, width: 400, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,8,2,0.9), transparent 70%)", opacity: vT }} />
    <PotCut x={1080} y={240} w={680} h={560} f={f} mode="calm" hot={0.7 * vG} />
    <Label txt="FINITA: SE QUEMA ABAJO" u={cl(f / 10)} x={170} y={110} bg={TOM} size={46} />
    <Label txt="GRUESA: CALOR PAREJO" u={vG} x={1090} y={110} bg={BAS} size={46} rot={2} />
  </>);
};

// 23 · cronómetro: 10 minutos de hervor fuerte (el único)
export const Cronometro: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), v = cl((f - at(533.5)) / 10);
  const secs = Math.max(0, 600 - Math.floor(f / 3));
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 300 }}><PotCut x={0} y={0} w={640} h={520} f={f} mode="boil" hot={1} /></div>
    <div style={{ position: "absolute", left: 960, top: 230, width: 800, height: 520, borderRadius: 40, background: "linear-gradient(170deg, #FBF5EA, #E7DAC1)", boxShadow: SH, transform: `scale(${0.7 + 0.3 * u})` }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 60, height: 260, borderRadius: 20, background: "#1F2A1F", boxShadow: "inset 0 6px 18px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 200, color: "#9BE07A", textShadow: "0 0 18px rgba(155,224,122,0.6)", letterSpacing: 6 }}>{mm}:{ss}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center" }}><Ti txt="HERVOR FUERTE" size={74} color={TOM2} u={cl(f / 10)} /></div>
    </div>
    <Stamp txt="EL ÚNICO DE SU VIDA" u={v} size={58} rot={-6} style={{ left: 1020, top: 820 }} />
  </>);
};

// 24 · espuma: se saca toda con la espumadera
export const Espuma: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const clean = eo(cl(f / Math.max(1, at(561.6))));
  const sx = 1100 - 700 * clean;
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 410, top: 90, width: 1100, height: 900, borderRadius: "50%", background: TX.copper, boxShadow: SH }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #B8946A, #7A5A3A 75%)", overflow: "hidden" }}>
        {Array.from({ length: 22 }, (_, i) => <Bean key={i} w={80} rot={i * 61} style={{ position: "absolute", left: 120 + (i * 151) % 760, top: 140 + (i * 97) % 560, opacity: 0.85 }} />)}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - clean, clipPath: `inset(0 0 0 ${100 - 100 * (1 - clean)}%)`, background: "radial-gradient(ellipse 18% 14% at 30% 40%, #B9B2A6, transparent 70%), radial-gradient(ellipse 22% 16% at 55% 30%, #A9A296, transparent 70%), radial-gradient(ellipse 20% 15% at 70% 60%, #BDB5A9, transparent 70%), radial-gradient(ellipse 18% 14% at 40% 70%, #ACA599, transparent 70%), radial-gradient(ellipse 30% 25% at 50% 50%, rgba(170,162,150,0.85), transparent 70%)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: sx, top: 300 + 40 * Math.sin(f / 6), transform: "rotate(-25deg)" }}>
      <div style={{ width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, #DADFE2, #8F979C)", boxShadow: SH, backgroundImage: "radial-gradient(circle, #3A3F42 7px, transparent 8px), radial-gradient(circle at 40% 30%, #E6EAEC, #8F979C)", backgroundSize: "40px 40px, 100% 100%" }} />
      <div style={{ position: "absolute", left: 200, top: 100, width: 520, height: 34, borderRadius: 17, background: "linear-gradient(180deg, #E4E8EA, #8F979C)" }} />
    </div>
    <Label txt="ESPUMA GRIS = PROTEÍNA + ALMIDÓN" u={cl((f - at(562.7)) / 10)} x={420} y={930} size={46} bg={INK} />
    <Label txt="AFUERA, TODA" u={cl(f / 10)} x={140} y={110} size={56} />
  </>);
};

// 25 · las hojas de la abuela: laurel, salvia, hinojo
export const Hojas: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const Leaf: React.FC<{ c1: string; c2: string; w: number; h: number; rot: number }> = ({ c1, c2, w, h, rot }) => (
    <div style={{ width: w, height: h, borderRadius: "0 100% 0 100%", background: `linear-gradient(135deg, ${c1}, ${c2})`, transform: `rotate(${rot}deg)`, boxShadow: "0 10px 18px rgba(0,0,0,0.3)", position: "relative" }}>
      <div style={{ position: "absolute", left: "8%", top: "48%", width: "84%", height: 4, background: "rgba(255,255,255,0.35)", transform: "rotate(43deg)", transformOrigin: "0 50%" }} />
    </div>
  );
  const H = [{ t: 606.0, txt: "2 hojas de laurel", el: <div style={{ display: "flex", gap: 20 }}><Leaf c1="#6E8F3A" c2="#3E5A1E" w={150} h={150} rot={-10} /><Leaf c1="#7EA048" c2="#46652A" w={130} h={130} rot={20} /></div> },
    { t: 607.6, txt: "unas hojas de salvia", el: <div style={{ display: "flex", gap: 14 }}>{[0, 1, 2].map((k) => <Leaf key={k} c1="#AEBFA0" c2="#73866A" w={100} h={150} rot={-20 + k * 20} />)}</div> },
    { t: 610.6, txt: "1 cdita. de hinojo", el: <div style={{ display: "flex", flexWrap: "wrap", width: 260, gap: 8 }}>{Array.from({ length: 24 }, (_, k) => <div key={k} style={{ width: 22, height: 44, borderRadius: "50%", background: "repeating-linear-gradient(0deg, #8E8A4A 0 4px, #B8B068 4px 8px)", transform: `rotate(${k * 37}deg)` }} />)}</div> }];
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Ti txt="LAS HOJAS DE LA ABUELA" size={92} color={CREAM} u={cl(f / 10)} sh /></div>
    {H.map((x, i) => { const v = sp(f, at(x.t) - 4, 12, 110); return <div key={i} style={{ position: "absolute", left: 110 + i * 590, top: 240, width: 520, height: 700, borderRadius: 24, background: TX.cream, boxShadow: SH, transform: `translateY(${(1 - v) * 120}px) rotate(${(i - 1) * 2}deg)`, opacity: cl(v * 3) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>{x.el}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center" }}><Hand txt={x.txt} u={v} size={70} style={{ display: "inline-block" }} /></div>
    </div>; })}
  </>);
};

// 26 · cada país con su hoja
export const HojasPaises: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const R = [{ p: "ITALIA", h: "hinojo", c: BAS }, { p: "MÉXICO", h: "epazote", c: TOM }, { p: "OTROS LUGARES", h: "comino", c: COP }];
  return shell(<Bg k="tile" f={f} d={d} />, <Board x={300} y={90} w={1320} h={900} u={sp(f, 0, 14, 120)}>
    <div style={{ position: "absolute", left: 80, top: 40 }}><Hand txt="Cada país, con su hoja" u={cl(f / 16)} size={90} chalk /></div>
    {R.map((x, i) => { const v = cl((f - 8 - i * 9) / 10); return <div key={i} style={{ position: "absolute", left: 100, top: 200 + i * 150, display: "flex", alignItems: "center", gap: 30, opacity: cl(v * 3) }}>
      <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 64, color: "#F5C26B", width: 500 }}>{x.p}</div>
      <Hand txt={`→ ${x.h}`} u={v} size={90} chalk />
    </div>; })}
    <div style={{ position: "absolute", left: 100, top: 690 }}><Hand txt="la misma sabiduría vieja: ayuda a la digestión" u={cl((f - at(625.8)) / 22)} size={60} color="#B8E0A0" /></div>
  </Board>);
};

// 27 · ajo con cáscara + chorro de aceite
export const AjoAceite: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const vA = sp(f, 0, 12, 110), vO = cl((f - at(640.5)) / 12);
  const Clove: React.FC<{ rot: number }> = ({ rot }) => <div style={{ width: 150, height: 210, borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 35% 35%, #FFFBF0, #EADFC8 60%, #C9B796)", boxShadow: SH, transform: `rotate(${rot}deg)`, position: "relative" }}>
    <div style={{ position: "absolute", left: "48%", top: -10, width: 8, height: 40, background: "#B8A27C", borderRadius: 4 }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: "repeating-linear-gradient(90deg, rgba(180,150,110,0.25) 0 2px, transparent 2px 22px)" }} />
  </div>;
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 260, top: 330, display: "flex", gap: 40, transform: `translateY(${(1 - vA) * 200}px)` }}><Clove rot={-12} /><Clove rot={14} /></div>
    <div style={{ position: "absolute", left: 250, top: 160 }}><Ti txt="2 DIENTES DE AJO" size={70} color={CREAM} u={cl(f / 10)} sh /></div>
    <div style={{ position: "absolute", left: 270, top: 640 }}><Hand txt="con cáscara" u={cl((f - 14) / 16)} size={76} color="#F5D48A" /></div>
    <div style={{ position: "absolute", left: 1140, top: 80, width: 220, height: 520, transform: `rotate(${-30 * eo(vO)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 80, top: 0, width: 60, height: 120, borderRadius: 8, background: "linear-gradient(90deg, #3A4A20, #5E7A30)" }} />
      <div style={{ position: "absolute", left: 0, top: 100, width: 220, height: 420, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg, rgba(90,110,30,0.95), rgba(170,170,50,0.9) 40%, rgba(90,110,30,0.95))", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 20, top: 260, width: 180, height: 120, borderRadius: 10, background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PF, fontWeight: 900, fontSize: 30, color: BAS2, textAlign: "center" }}>OLIO<br />D'OLIVA</div>
    </div>
    <div style={{ position: "absolute", left: 1170, top: 170, width: 26, height: 620 * vO, borderRadius: 13, background: "linear-gradient(180deg, rgba(200,180,40,0.95), rgba(220,190,60,0.7))", boxShadow: "0 0 16px rgba(230,200,60,0.6)" }} />
    <div style={{ position: "absolute", left: 980, top: 860 }}><Ti txt="+ UN BUEN CHORRO" size={64} color={CREAM} u={vO} sh /></div>
  </>);
};

// 28 · tomate al principio: 1 h 30 → 3 h y sigue duro
export const TomateReloj: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const v1 = cl((f - at(675.2)) / 12), v2 = cl((f - at(676.6)) / 12), v3 = cl((f - at(678.9)) / 10);
  const Bar: React.FC<{ y: number; w: number; v: number; c: string; lbl: string; time: string }> = ({ y, w, v, c, lbl, time }) => (
    <div style={{ position: "absolute", left: 160, top: y }}>
      <Hand txt={lbl} u={v} size={64} />
      <div style={{ marginTop: 10, width: w * eo(v), height: 110, borderRadius: 18, background: c, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30 }}>
        <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 70, color: CREAM, opacity: cl(v * 2 - 1) }}>{time}</div>
      </div>
    </div>
  );
  return shell(<Bg k="cream" f={f} d={d} />, <>
    <Bar y={150} w={700} v={Math.max(v1, cl(f / 12))} c={BAS} lbl="sin tomate" time="1 h 30" />
    <Bar y={450} w={1400} v={v2} c={TOM} lbl="con tomate desde el principio" time="3 h +" />
    <div style={{ position: "absolute", left: 1200, top: 760, display: "flex", alignItems: "center", gap: 30 }}><Bean w={200} kind="red" style={{ transform: `rotate(-10deg) scale(${0.7 + 0.3 * eo(v3)})` }} /><Ti txt="Y SIGUE DURO" size={80} color={TOM2} u={v3} /></div>
  </>);
};

// 29 · el orden: tiernos → sal → tomate → 20 min juntos
export const Orden: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const S = [{ t: 687.0, n: "1", txt: "Tiernos de verdad" }, { t: 689.9, n: "2", txt: "Recién ahí, la sal" }, { t: 692.0, n: "3", txt: "Tomate o sofrito" }, { t: 694.1, n: "4", txt: "20 minutos juntos" }];
  return shell(<Bg k="mantel" f={f} d={d} />, <Ficha x={300} y={100} w={1320} h={880} rot={-1} u={sp(f, 0, 14, 110)} title="Sal y tomate, al final">
    {S.map((x, i) => { const v = cl((f - at(x.t)) / 12); return <div key={i} style={{ position: "absolute", left: 130, top: 175 + i * 150, display: "flex", alignItems: "center", gap: 30, opacity: cl(v * 3) }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", background: i < 1 ? BAS : i < 3 ? TOM : COP, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PF, fontWeight: 900, fontSize: 62, color: CREAM, boxShadow: "0 8px 16px rgba(0,0,0,0.3)", transform: `scale(${eo(v)})` }}>{x.n}</div>
      <Hand txt={x.txt} u={v} size={90} color="#22314F" />
    </div>; })}
  </Ficha>);
};

// 30 · la prueba de los cinco: arriba, medio, fondo; uno con centro de tiza = la olla sigue
export const CincoFrijoles: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const vC = cl((f - at(725.8)) / 10), vT = cl((f - at(727.9)) / 10);
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}><Ti txt="SE PRUEBAN CINCO" size={96} color={CREAM} u={cl(f / 10)} sh /></div>
    <div style={{ position: "absolute", left: 140, top: 320, display: "flex", gap: 60 }}>
      {[0, 1, 2, 3, 4].map((i) => { const v = sp(f, 4 + i * 5, 12, 120); const bad = i === 3;
        return <div key={i} style={{ transform: `translateY(${(1 - v) * 150}px) scale(${bad ? 1 + 0.08 * vC * Math.sin(f / 4) : 1})`, opacity: cl(v * 3), position: "relative" }}>
          <BeanCut w={260} center={bad ? vC : 0} />
          <div style={{ textAlign: "center", fontFamily: CV, fontWeight: 700, fontSize: 52, color: CREAM, marginTop: 14 }}>{["arriba", "medio", "fondo", "medio", "fondo"][i]}</div>
          {bad ? <svg style={{ position: "absolute", left: -30, top: -30, overflow: "visible" }} width={320} height={230}><ellipse cx={160} cy={112} rx={160} ry={118} stroke={TOM} strokeWidth={9} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(vC)} /></svg> : null}
        </div>; })}
    </div>
    <Label txt="CENTRO DE TIZA = LA OLLA SIGUE" u={vT} x={560} y={830} size={56} />
  </>);
};

// 31 · el mito: "tienen que hervir fuerte"
export const Mito: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const vQ = sp(f, 0, 14, 110), vS = cl((f - at(755.6)) / 10);
  return shell(<Bg k="cream" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 260, top: 230, width: 1400, height: 480, borderRadius: 40, background: "#FFFFFF", boxShadow: SH, transform: `scale(${0.8 + 0.2 * vQ}) rotate(-1deg)` }}>
      <div style={{ position: "absolute", left: 120, bottom: -60, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderTop: "70px solid #FFFFFF" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: PF, fontWeight: 900, fontSize: 72, color: INK, lineHeight: 1.25 }}>
        «Los frijoles tienen que<br /><span style={{ position: "relative", display: "inline-block" }}>HERVIR FUERTE<Strike u={vS} w={600} top="45%" /></span>, o no se cocinan»</div>
    </div>
    <Stamp txt="MITO" u={cl((f - at(756.4)) / 8)} size={150} rot={-14} style={{ left: 1300, top: 640 }} />
  </>);
};

// 32 · el borbotón: los frijoles se golpean, la piel se raja, el caldo se pone gris
export const Borboton: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const vR = cl((f - at(774.8)) / 12), vG = cl((f - at(778.5)) / 20);
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <PotCut x={560} y={200} w={800} h={660} f={f} mode="boil" split={vR} grey={vG} hot={1} />
    <Flame x={640} y={870} w={640} lv={1} f={f} />
    <Label txt="SE GOLPEAN" u={cl(f / 10)} x={170} y={260} size={56} />
    <Label txt="LA PIEL SE RAJA" u={vR} x={1420} y={380} size={52} rot={3} />
    <Label txt="PASTA GRIS + CALDO TURBIO" u={vG} x={150} y={720} size={48} bg={INK} />
  </>);
};

// 33 · por fuera vs por dentro: el calor fuerte cocina la piel antes que el corazón
export const FueraDentro: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const p = cl(f / Math.max(1, d - 20));
  const vR = cl((f - at(789.9)) / 10);
  return shell(<Bg k="chalk" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 560, top: 220, width: 800, height: 540, borderRadius: "48% 52% 46% 54% / 60% 62% 38% 40%", background: `radial-gradient(ellipse 60% 55% at 50% 50%, #F2F2F0 ${30 - 10 * p}%, #F5C26B ${48 - 8 * p}%, #E26A2C ${70 - 10 * p}%, #9E2C14 95%)`, boxShadow: SH + ", 0 0 80px rgba(226,106,44,0.4)" }} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const ang = (i / 8) * Math.PI * 2; const r = 520 - 60 * ((f / 10 + i) % 1);
      return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * r - 20, top: 490 + Math.sin(ang) * r * 0.7 - 20, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle, #FFB15A, rgba(226,106,44,0))" }} />; })}
    <Label txt="POR FUERA: PASADO" u={cl((f - at(787.4)) / 10)} x={170} y={160} size={52} bg={TOM} />
    <Label txt="POR DENTRO: CRUDO" u={cl((f - at(788.9)) / 10)} x={1180} y={180} size={52} bg={INK} rot={2} />
    <Stamp txt="ROTOS Y CRUDOS" u={vR} size={70} rot={-5} style={{ left: 640, top: 840 }} />
  </>);
};

// 34 · el agua que apenas tiembla: nada los golpea
export const Tiembla: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <PotCut x={560} y={200} w={800} h={660} f={f} mode="shiver" hot={0.35} />
    <Flame x={760} y={870} w={400} lv={0.08} f={f} />
    <Label txt="NADA LOS GOLPEA" u={cl((f - at(806.6)) / 10)} x={150} y={260} size={54} bg={BAS} />
    <Label txt="PIEL ENTERA" u={cl((f - at(808.6)) / 10)} x={1430} y={380} size={54} bg={BAS} rot={3} />
    <Label txt="CALOR HASTA EL CENTRO" u={cl((f - at(810.2)) / 10)} x={150} y={720} size={50} bg={COP2} />
  </>);
};

// 35 · la perilla al mínimo: 1 h 30, 2, 3 horas, probando desde la primera
export const Llama: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const T = [{ t: 855.2, txt: "1 h 30" }, { t: 856.0, txt: "2 h" }, { t: 856.7, txt: "3 h" }];
  const vP = cl((f - at(858.8)) / 14);
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 220, top: 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #F4F4F2, #B9BCBE 70%)", boxShadow: SH }}>
      {["MAX", "", "", "MIN"].map((m, i) => <div key={i} style={{ position: "absolute", left: 260 + 220 * Math.cos((-200 + i * 50) * Math.PI / 180) - 40, top: 260 + 220 * Math.sin((-200 + i * 50) * Math.PI / 180) - 20, fontFamily: PF, fontWeight: 900, fontSize: 36, color: i === 3 ? BAS2 : TOM2 }}>{m}</div>)}
      <div style={{ position: "absolute", left: 130, top: 130, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3A3A3A, #111)", transform: `rotate(${-110 + 150 * eo(cl(f / 30))}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 118, top: 10, width: 24, height: 110, borderRadius: 12, background: "#F2F2F2" }} />
      </div>
    </div>
    <Flame x={300} y={820} w={360} lv={0.08} f={f} />
    {T.map((x, i) => { const v = cl((f - at(x.t)) / 8); return <div key={i} style={{ position: "absolute", left: 920 + i * 300, top: 330, width: 260, height: 260, borderRadius: "50%", background: TX.cream, border: `8px solid ${COP}`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${eo(v)})` }}>
      <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 76, color: INK }}>{x.txt}</div></div>; })}
    <div style={{ position: "absolute", left: 930, top: 680 }}><Hand txt="probando desde la primera hora" u={vP} size={72} color="#F5D48A" /></div>
  </>);
};

// 36 · la olla lenta = la pignata de la nonna con enchufe
export const PignataEnchufe: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const vE = cl((f - at(872.9)) / 14);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: TX.wood }} />
    <div style={{ position: "absolute", left: 860, top: 230, transform: `scale(${0.8 + 0.2 * sp(f, 0)})` }}><PignataPot w={520} steam={1} f={f} /></div>
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      <path d="M 1360 760 C 1480 820, 1520 900, 1600 860 S 1700 760, 1720 650" stroke="#222" strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(vE)} />
    </svg>
    <div style={{ position: "absolute", left: 1680, top: 560, width: 90, height: 100, borderRadius: 14, background: "linear-gradient(180deg, #F2F2F2, #BDBDBD)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)", opacity: cl(vE * 2 - 1) }}>
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 22 + k * 32, top: -30, width: 12, height: 34, background: "#C9A24A", borderRadius: 3 }} />)}
    </div>
    <div style={{ position: "absolute", left: 120, top: 120 }}><Ti txt="OLLA LENTA" size={110} color={COP2} u={cl(f / 10)} sh /></div>
    <div style={{ position: "absolute", left: 130, top: 260 }}><Hand txt="= la pignata de la nonna con enchufe" u={vE} size={70} /></div>
    <Label txt="EN BAJO · TODA LA NOCHE" u={cl((f - 6) / 10)} x={140} y={420} size={46} bg={BAS} />
  </>);
};

// 37 · porciones chicas, 2 veces por semana
export const Porciones: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const D = ["L", "M", "M", "J", "V", "S", "D"];
  const vW = cl((f - at(921.1)) / 10);
  return shell(<Bg k="mantel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Ti txt="PORCIONES CHICAS" size={96} color={TOM2} u={cl((f - at(919.4)) / 10)} style={{ textShadow: "0 3px 0 rgba(255,255,255,0.8)" }} /></div>
    <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 560, borderRadius: 24, background: TX.cream, boxShadow: SH, display: "flex", justifyContent: "space-around", alignItems: "center", padding: 30 }}>
      {D.map((x, i) => { const on = i === 1 || i === 4; const v = cl((vW * 2 - (i === 4 ? 0.6 : 0)) * 1.5);
        return <div key={i} style={{ width: 190, height: 420, borderRadius: 18, background: on ? "rgba(63,125,58,0.12)" : "rgba(0,0,0,0.03)", border: `3px solid ${on ? BAS : "rgba(0,0,0,0.1)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "24px 0" }}>
          <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 70, color: INK }}>{x}</div>
          {on ? <div style={{ width: 150, height: 80, borderRadius: "0 0 75px 75px", background: "linear-gradient(180deg, #FFFFFF, #E0D8C8)", boxShadow: "0 8px 14px rgba(0,0,0,0.25)", transform: `scale(${eo(v)})`, position: "relative" }}>
            <div style={{ position: "absolute", left: 14, right: 14, top: 4, height: 26, borderRadius: "50%", background: "radial-gradient(ellipse, #9A5A3A, #6E3A20)" }} /></div> : <div />}
        </div>; })}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center" }}><Hand txt="2 veces por semana · el cuerpo se acostumbra" u={vW} size={66} color={INK} style={{ display: "inline-block" }} /></div>
  </>);
};

// 38 · resumen: la lista de lo que cuidamos (pizarra que se va tildando; continúa entre ventanas)
export const Resumen: P<A0> = ({ a, d, a0 }) => {
  const { f, at } = useT(a);
  const g = f + fr(a) - fr(g0(a, a0));
  const L = [{ t: 939.2, txt: "Frijol nuevo" }, { t: 941.9, txt: "La bandeja" }, { t: 944.1, txt: "Remojo largo + agua cambiada" }, { t: 946.9, txt: "Una pizca de bicarbonato" }, { t: 950.8, txt: "El agua del remojo, tirada" },
    { t: 953.0, txt: "Primer hervor, espuma afuera" }, { t: 955.5, txt: "Las hojas" }, { t: 957.4, txt: "Sal y tomate al final" }, { t: 959.9, txt: "El fuego que apenas tiembla" }];
  return shell(<Bg k="tile" f={g} d={d} />, <Board x={330} y={40} w={1260} h={1000} u={sp(g, 0, 14, 120)}>
    <div style={{ position: "absolute", left: 70, top: 26 }}><Hand txt="Lo que cuidamos" u={cl(g / 14)} size={84} chalk /></div>
    {L.map((x, i) => { const v = cl((f - at(x.t)) / 10); return <div key={i} style={{ position: "absolute", left: 80, top: 140 + i * 88, display: "flex", alignItems: "center", gap: 22, opacity: 0.35 + 0.65 * cl(v * 3) }}>
      <div style={{ width: 54, height: 54, borderRadius: 10, border: "4px solid #F3F0E6", display: "flex", alignItems: "center", justifyContent: "center" }}><Tick u={v} size={46} color="#B8E0A0" /></div>
      <Hand txt={x.txt} u={cl(v * 3)} size={62} chalk />
    </div>; })}
  </Board>);
};

// 39 · una olla, toda la semana: pizarra de menú (continúa entre ventanas)
export const Semana: P<A0> = ({ a, d, a0 }) => {
  const { f, at } = useT(a);
  const g = f + fr(a) - fr(g0(a, a0));
  const S = [{ t: 970.8, dia: "Domingo", txt: "frijoles tibios en su caldo, aceite y pan" }, { t: 976.7, dia: "Lunes", txt: "pasta e fagioli" }, { t: 980.6, dia: "Miércoles", txt: "sobre pan tostado con ajo" }, { t: 981.6, dia: "Viernes", txt: "al costado de la carne" }];
  return shell(<Bg k="wood" f={g} d={d} />, <Board x={300} y={60} w={1320} h={960} u={sp(g, 0, 14, 120)} rot={1}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center" }}><Hand txt="Una olla, media semana" u={cl(g / 14)} size={92} color="#F5C26B" style={{ display: "inline-block" }} /></div>
    {S.map((x, i) => { const v = cl((f - at(x.t)) / 12); return <div key={i} style={{ position: "absolute", left: 90, top: 190 + i * 170, opacity: cl(v * 3) }}>
      <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 60, color: "#F3F0E6", letterSpacing: 2 }}>{x.dia.toUpperCase()}</div>
      <Hand txt={x.txt} u={v} size={62} chalk />
    </div>; })}
  </Board>);
};

// 40 · la tarea: una olla, dos cambios
export const Tarea: P<A0> = ({ a, d }) => {
  const { f, at } = useT(a);
  const v1 = cl((f - at(994.1)) / 10), v2 = cl((f - at(996.7)) / 10);
  return shell(<Bg k="mantel" f={f} d={d} />, <Ficha x={330} y={110} w={1260} h={860} rot={-1.5} u={sp(f, 0, 14, 110)} title="Tu tarea de esta semana">
    <div style={{ position: "absolute", left: 130, top: 190 }}><Ti txt="1 OLLA" size={120} color={TOM2} u={v1} /></div>
    <div style={{ position: "absolute", left: 600, top: 190 }}><Ti txt="2 CAMBIOS" size={120} color={BAS2} u={v2} /></div>
    {["Cambiar el agua del remojo", "Fuego que apenas tiembla"].map((t, i) => { const v = cl((f - at(996.9) - i * 8) / 12); return <div key={i} style={{ position: "absolute", left: 140, top: 400 + i * 150, display: "flex", alignItems: "center", gap: 24 }}>
      <Tick u={v} size={70} /><Hand txt={t} u={v} size={90} color="#22314F" /></div>; })}
  </Ficha>);
};

// 41 · pregunta para los comentarios
export const Comentario: P<A0> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 12, 110);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 360, top: 170, width: 1200, height: 640, borderRadius: 36, background: "#FFFFFF", boxShadow: SH, transform: `translateY(${(1 - u) * 160}px)`, opacity: cl(u * 3) }}>
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: TOM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PF, fontWeight: 900, fontSize: 50, color: CREAM }}>?</div>
        <div style={{ fontFamily: PF, fontWeight: 900, fontSize: 48, color: INK }}>Cuéntame en los comentarios</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 190, fontFamily: CV, fontWeight: 700, fontSize: 78, color: INK, lineHeight: 1.1 }}>En tu casa, el agua del remojo… ¿se tiraba o se usaba?</div>
      <div style={{ position: "absolute", left: 70, top: 470, display: "flex", gap: 40 }}>
        {[{ t: "SE TIRABA", c: BAS }, { t: "SE USABA", c: TOM }].map((x, i) => <div key={i} style={{ padding: "18px 50px", borderRadius: 50, background: x.c, color: CREAM, fontFamily: PF, fontWeight: 900, fontSize: 52, boxShadow: "0 10px 20px rgba(0,0,0,0.25)", transform: `scale(${eo(cl((f - 16 - i * 8) / 10))})` }}>{x.t}</div>)}
      </div>
    </div>
  </>);
};
