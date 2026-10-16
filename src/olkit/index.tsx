// ── OLKIT: componentes PURO CSS/SVG de Ole's Camp Kitchen (plan6, olc02-olc07). Claude, 16-oct-2026.
//    Cero imágenes: madera de tablón, papel de libro de cuentas, pizarra, esmalte, kraft y hierro DIBUJADOS con gradientes,
//    perspectiva y sombras en capas. Cada video llama setPal(<su paleta>) en su heroes.tsx: cambia colores, textura de fondo,
//    forma del capítulo (plate / board / tag) y el acento → mismo motor, look propio por video.
//    Contrato lkit: ({a, d, ...props}) con tiempos en SEGUNDOS absolutos del video; a0 = inicio original si el plan partió la toma.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { useT, sp, ez, eo, cl, P } from "../lkit/core";

const OSW = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const KAL = loadKalam("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;

export type Pal = {
  bg: "plank" | "logs" | "frost" | "iron" | "sepia"; chapter: "plate" | "board" | "tag";
  acc: string; acc2: string; ink: string; paper: string; cream: string; dark: string; ok: string; bad: string;
};
let PAL: Pal = { bg: "plank", chapter: "plate", acc: "#2F5D8A", acc2: "#C9A04A", ink: "#2A2119", paper: "#F3E8CF", cream: "#FBF4E4", dark: "#1C1712", ok: "#2F7A4A", bad: "#B3282D" };
export const setPal = (p: Partial<Pal>) => { PAL = { ...PAL, ...p }; };
type A0 = { a0?: number };
const st = (a: number, a0?: number) => (a0 ?? a);

// ── fondos (gradientes) ──────────────────────────────────────────────
const BG: Record<Pal["bg"], string> = {
  plank: "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 3px, transparent 3px 180px), repeating-linear-gradient(0deg, rgba(60,30,10,0.16) 0 2px, transparent 2px 11px, rgba(255,215,160,0.05) 11px 15px, transparent 15px 31px), radial-gradient(ellipse 60% 45% at 30% 25%, rgba(255,200,140,0.20), transparent 70%), linear-gradient(180deg, #6B4729, #3E2817)",
  logs: "repeating-linear-gradient(180deg, #5A3B22 0 70px, #3B2615 70px 78px, #6A4628 78px 150px, #2E1D10 150px 158px), radial-gradient(ellipse 50% 40% at 70% 30%, rgba(255,190,120,0.25), transparent 70%)",
  frost: "radial-gradient(ellipse 30% 22% at 20% 25%, rgba(255,255,255,0.35), transparent 70%), radial-gradient(ellipse 25% 18% at 80% 70%, rgba(255,255,255,0.25), transparent 70%), repeating-linear-gradient(60deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 23px), repeating-linear-gradient(-60deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 29px), linear-gradient(180deg, #33506A, #1A2B3C)",
  iron: "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(255,140,60,0.18), transparent 70%), repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.025) 0 2deg, transparent 2deg 5deg), linear-gradient(180deg, #2A2724, #121110)",
  sepia: "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,235,200,0.25), transparent 75%), repeating-linear-gradient(0deg, rgba(80,50,20,0.05) 0 1px, transparent 1px 7px), linear-gradient(180deg, #8C6B47, #4F3A24)",
};
const Bg: React.FC<{ f: number; d: number }> = ({ f, d }) => {
  const sw = -30 + 160 * (f / Math.max(1, d));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: BG[PAL.bg], transform: `scale(${1.06 + 0.03 * f / Math.max(1, d)})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sw - 12}%, rgba(255,245,225,0.08) ${sw}%, transparent ${sw + 12}%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
  </AbsoluteFill>;
};
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-7 * Math.sin(f / 45)}px, ${5 * Math.cos(f / 51)}px) scale(${1.02 + 0.01 * Math.sin(f / 59)})` }}>{children}</AbsoluteFill>;
};
const shell = (f: number, d: number, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><Bg f={f} d={d} /><Drift>{c}</Drift></AbsoluteFill>;
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 18px 30px rgba(0,0,0,0.35), 0 44px 80px rgba(0,0,0,0.30)";
const PAPER = () => `repeating-linear-gradient(0deg, transparent 0 46px, rgba(70,110,150,0.22) 46px 48px), linear-gradient(90deg, transparent 0 86px, rgba(190,60,50,0.35) 86px 89px, transparent 89px), radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,255,255,0.5), transparent 70%), linear-gradient(170deg, ${PAL.paper}, #E2D2AE)`;
const KRAFT = "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-67deg, rgba(255,240,210,0.07) 0 1px, transparent 1px 13px), radial-gradient(ellipse 35% 25% at 80% 70%, rgba(255,230,190,0.18), transparent 70%), linear-gradient(170deg, #CDA878, #B08454)";
const CHALK = "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.08), transparent 70%), radial-gradient(ellipse 30% 14% at 70% 65%, rgba(255,255,255,0.07), transparent 70%), repeating-linear-gradient(170deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(180deg, #2E3632, #1E241D)";
const FRAME = "repeating-linear-gradient(90deg, rgba(60,30,10,0.25) 0 2px, transparent 2px 14px), linear-gradient(180deg, #8A5A32, #5C3A1F)";

const Big: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties }> = ({ txt, size, color = PAL.cream, u = 1, style }) => (
  <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: size, color, lineHeight: 1.0, letterSpacing: 1, textTransform: "uppercase", opacity: cl(u * 2),
    transform: `translateY(${(1 - u) * 26}px) scale(${0.9 + 0.1 * u})`, textShadow: "0 3px 0 rgba(0,0,0,0.22), 0 10px 26px rgba(0,0,0,0.4)", whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties }> = ({ txt, u, size, color = PAL.ink, style }) => (
  <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.1, paddingRight: "0.3em", clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.06 - 6}% -25% -2%)`, ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number }> = ({ u, no, size = 70 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible", flex: "none" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={no ? PAL.bad : PAL.ok} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const Nail: React.FC<{ x: number; y: number }> = ({ x, y }) => <div style={{ position: "absolute", left: x, top: y, width: 22, height: 22, borderRadius: 11, background: "radial-gradient(circle at 35% 35%, #EEE, #8A8A8A 55%, #3A3A3A)", boxShadow: "0 3px 4px rgba(0,0,0,0.5)" }} />;

// 1 · CAPÍTULO: plato de esmalte con borde azul / tabla de pino quemada / etiqueta kraft con hilo (según PAL.chapter)
export const Chapter: P<{ n: number; kicker: string; title: string; sub: string; tw: number } & A0> = ({ a, d, n, kicker, title, sub, tw, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 12, 110), s = sp(f, at(tw) + 8, 14, 140), s2 = sp(f, at(tw) + 22, 14, 140);
  const ttl = <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: title.length > 22 ? 78 : 96, lineHeight: 1.02, color: PAL.ink, textTransform: "uppercase", maxWidth: 820, opacity: cl(s * 2), transform: `translateX(${(1 - s) * 40}px)` }}>{title}</div>;
  const sb = <Hand txt={sub} u={s2} size={52} color={PAL.acc} style={{ marginTop: 18 }} />;
  if (PAL.chapter === "plate") {
    return shell(f, d, <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 840, transform: `perspective(1600px) rotateX(${(1 - u) * 30}deg) translateY(${(1 - u) * 300}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 760, height: 760, borderRadius: 380, background: `radial-gradient(circle at 40% 35%, #FFFFFF, ${PAL.cream} 45%, #D9D0BC 70%)`, boxShadow: `${SH}, inset 0 0 0 26px ${PAL.acc}, inset 0 0 0 34px #FFFFFF, inset 0 0 0 40px rgba(0,0,0,0.08)` }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 54, letterSpacing: 12, color: PAL.acc }}>{kicker}</div>
          <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 380, lineHeight: 0.95, color: PAL.ink, textShadow: "0 6px 0 rgba(0,0,0,0.08)" }}>{n}</div>
        </div>
        <div style={{ position: "absolute", left: 130, top: 120, width: 220, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.8), transparent 70%)", transform: "rotate(-30deg)" }} />
      </div>
      <div style={{ position: "absolute", left: 820, top: 250 }}>{ttl}{sb}</div>
    </div>);
  }
  if (PAL.chapter === "board") {
    return shell(f, d, <div style={{ position: "absolute", left: 200, top: 170, width: 1520, height: 720, transformOrigin: "50% 0", transform: `rotate(${(1 - u) * -8 + Math.sin(f / 18) * 0.8 * (1 - cl(f / 60))}deg) translateY(${(1 - u) * -600}px)` }}>
      {[380, 1140].map((x) => <div key={x} style={{ position: "absolute", left: x, top: -170, width: 8, height: 190, background: "linear-gradient(90deg, #6A5A40, #C8B48A, #6A5A40)" }} />)}
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "repeating-linear-gradient(92deg, rgba(90,50,20,0.25) 0 3px, transparent 3px 40px, rgba(255,230,190,0.10) 40px 46px, transparent 46px 90px), linear-gradient(180deg, #D9B47E, #B98C55)", boxShadow: SH + ", inset 0 0 40px rgba(80,40,10,0.45)" }} />
      <Nail x={30} y={30} /><Nail x={1468} y={30} /><Nail x={30} y={668} /><Nail x={1468} y={668} />
      <div style={{ position: "absolute", left: 80, top: 70, display: "flex", alignItems: "center", gap: 50 }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 400, lineHeight: 1, color: "#3A2412", textShadow: "0 2px 0 rgba(255,230,190,0.4), 0 -2px 0 rgba(0,0,0,0.35)" }}>{n}</div>
        <div><div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 52, letterSpacing: 10, color: PAL.acc }}>{kicker}</div>{ttl}{sb}</div>
      </div>
    </div>);
  }
  return shell(f, d, <div style={{ position: "absolute", left: 300, top: 150, width: 1320, height: 760, transformOrigin: "8% 10%", transform: `rotate(${(1 - u) * 14 - 2 + Math.sin(f / 20) * 0.7}deg) scale(${0.85 + 0.15 * u})`, opacity: cl(u * 2) }}>
    <svg width={1320} height={760} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}><path d="M -300 -120 Q 40 -40 92 92" stroke="#E9DFC9" strokeWidth={5} fill="none" /></svg>
    <div style={{ position: "absolute", inset: 0, background: KRAFT, clipPath: "polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)", boxShadow: SH }} />
    <div style={{ position: "absolute", left: 70, top: 350, width: 56, height: 56, borderRadius: 28, background: "radial-gradient(circle, #3a2a1a 30%, #EDE2C8 34%, #C9B48C 60%)" }} />
    <div style={{ position: "absolute", left: 230, top: 90, display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 360, lineHeight: 1, color: PAL.acc, textShadow: "0 4px 0 rgba(0,0,0,0.15)" }}>{n}</div>
      <div><div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 50, letterSpacing: 10, color: PAL.ink }}>{kicker}</div>{ttl}{sb}</div>
    </div>
  </div>);
};

// 2 · LIBRO DE CUENTAS: hoja rayada con filas que se escriben a mano y un total subrayado (costos, inventario del sótano, recibos)
export const Ledger: P<{ title: string; rows: { t: number; a: string; b: string }[]; total?: { t: number; a: string; b: string }; foot?: string } & A0> = ({ a, d, title, rows, total, foot, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120);
  const rh = rows.length > 6 ? 70 : 84, fs = rows.length > 6 ? 50 : 58;
  const LH = Math.min(940, 230 + rows.length * rh + (total ? 150 : 0) + (foot ? 100 : 0));
  return shell(f, d, <div style={{ position: "absolute", left: 330, top: (1080 - LH) / 2, width: 1260, height: LH, transform: `perspective(1800px) rotateX(${(1 - u) * 35 + 8}deg) rotateZ(-1.5deg) translateY(${(1 - u) * 400}px)`, transformOrigin: "50% 100%" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: PAPER(), boxShadow: SH }} />
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(90deg, ${PAL.dark}, #4A3A2A)`, borderRadius: "8px 0 0 8px" }} />
    <div style={{ position: "absolute", left: 120, top: 40 }}><Big txt={title} size={64} color={PAL.acc} u={u} style={{ textShadow: "none" }} /></div>
    {rows.map((r, i) => { const v = sp(f, at(r.t), 14, 150); return <div key={i} style={{ position: "absolute", left: 120, right: 70, top: 150 + i * rh, height: rh, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <Hand txt={r.a} u={v} size={fs} /><Hand txt={r.b} u={sp(f, at(r.t) + 8, 14, 150)} size={fs} color={PAL.acc} />
    </div>; })}
    {total ? (() => { const v = sp(f, at(total.t), 14, 150); const y = 170 + rows.length * rh; return <>
      <div style={{ position: "absolute", left: 120, right: 70, top: y, height: 6, background: PAL.ink, transformOrigin: "0 50%", transform: `scaleX(${ez(v)})` }} />
      <div style={{ position: "absolute", left: 120, right: 70, top: y + 18, display: "flex", justifyContent: "space-between" }}>
        <Big txt={total.a} size={60} color={PAL.ink} u={v} style={{ textShadow: "none" }} /><Big txt={total.b} size={92} color={PAL.bad} u={v} style={{ textShadow: "none" }} /></div>
    </>; })() : null}
    {foot ? <div style={{ position: "absolute", left: 120, bottom: 40 }}><Hand txt={foot} u={sp(f, at((total ? total.t : rows[rows.length - 1].t)) + 20, 14, 120)} size={44} color={PAL.acc} /></div> : null}
  </div>);
};

// 3 · FICHA DE RECETA: tarjeta de fichero con chinche, ingredientes que se anotan uno por uno
export const RecipeCard: P<{ title: string; lines: { t: number; txt: string }[]; note?: { t: number; txt: string } } & A0> = ({ a, d, title, lines, note, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120);
  const lh = lines.length > 6 ? 68 : 80;
  return shell(f, d, <div style={{ position: "absolute", left: 360, top: 110, width: 1200, height: 860, transform: `rotate(${-2 + (1 - u) * -10}deg) scale(${0.8 + 0.2 * u})`, opacity: cl(u * 2) }}>
    <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, transparent 0 ${lh - 2}px, rgba(70,110,150,0.25) ${lh - 2}px ${lh}px), linear-gradient(180deg, transparent 0 130px, rgba(190,60,50,0.5) 130px 134px, transparent 134px), linear-gradient(170deg, #FFFDF6, ${PAL.paper})`, boxShadow: SH, borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 560, top: -16, width: 60, height: 60, borderRadius: 30, background: `radial-gradient(circle at 35% 35%, #fff, ${PAL.bad} 50%, #5A1010)`, boxShadow: "0 8px 10px rgba(0,0,0,0.45)" }} />
    <div style={{ position: "absolute", left: 70, top: 40 }}><Hand txt={title} u={u} size={76} color={PAL.bad} /></div>
    {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 80, top: 150 + i * lh, display: "flex", gap: 22, alignItems: "center" }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: PAL.acc, opacity: cl(sp(f, at(l.t), 14, 150) * 2) }} />
      <Hand txt={l.txt} u={sp(f, at(l.t), 14, 150)} size={lines.length > 6 ? 50 : 58} /></div>)}
    {note ? <div style={{ position: "absolute", right: 60, bottom: 40, transform: "rotate(-4deg)", background: "#F2D466", padding: "14px 28px", boxShadow: "0 10px 18px rgba(0,0,0,0.3)", opacity: cl(sp(f, at(note.t), 14, 140) * 2) }}>
      <Hand txt={note.txt} u={sp(f, at(note.t) + 4, 14, 140)} size={48} /></div> : null}
  </div>);
};

// 4 · ETIQUETA DE PRECIO: kraft colgada de un hilo, precio grande "por plato"; opcional el precio de la tienda tachado
export const PriceTag: P<{ t: number; big: string; small: string; head?: string; strike?: { t: number; txt: string; who: string } } & A0> = ({ a, d, t, big, small, head, strike, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 10, 90), v = sp(f, at(t), 12, 140);
  const sw = Math.sin(f / 14) * 3 * (1 - cl((f - at(st(a, a0))) / 70));
  return shell(f, d, <>
    {strike ? (() => { const s = sp(f, at(strike.t), 14, 140); return <div style={{ position: "absolute", left: 160, top: 300, width: 560, height: 420, background: "linear-gradient(170deg, #FFFFFF, #E9E6DE)", boxShadow: SH, transform: `rotate(-6deg) translateX(${(1 - s) * -400}px)`, opacity: cl(s * 2), borderRadius: 10, padding: 40 }}>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 40, color: "#666", letterSpacing: 4 }}>{strike.who}</div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 150, color: "#333", marginTop: 20 }}>{strike.txt}</div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 230, height: 14, background: PAL.bad, transformOrigin: "0 50%", transform: `rotate(-8deg) scaleX(${ez(sp(f, at(strike.t) + 18, 14, 140))})`, borderRadius: 7 }} />
    </div>; })() : null}
    <div style={{ position: "absolute", left: strike ? 860 : 560, top: 0, width: 800, height: 1000, transformOrigin: "50% 0", transform: `rotate(${sw + (1 - u) * 10}deg) translateY(${(1 - u) * -500}px)` }}>
      <div style={{ position: "absolute", left: 398, top: 0, width: 4, height: 210, background: "#EDE3CC" }} />
      <div style={{ position: "absolute", left: 60, top: 200, width: 680, height: 620, background: KRAFT, clipPath: "polygon(50% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 372, top: 230, width: 56, height: 56, borderRadius: 28, background: "radial-gradient(circle, #2a1a0a 30%, #EDE2C8 34%, #C9B48C 60%)" }} />
      {head ? <div style={{ position: "absolute", left: 60, width: 680, top: 330, textAlign: "center", fontFamily: OSW, fontWeight: 500, fontSize: 46, letterSpacing: 6, color: PAL.ink }}>{head}</div> : null}
      <div style={{ position: "absolute", left: 60, width: 680, top: 400, textAlign: "center", fontFamily: OSW, fontWeight: 700, fontSize: big.length > 5 ? 190 : 230, lineHeight: 1, color: PAL.bad, transform: `scale(${0.6 + 0.4 * v})`, opacity: cl(v * 2) }}>{big}</div>
      <div style={{ position: "absolute", left: 60, width: 680, top: 650, display: "flex", justifyContent: "center" }}><Hand txt={small} u={sp(f, at(t) + 10, 14, 140)} size={62} /></div>
    </div>
  </>);
};

// 5 · PIZARRA: lista que se escribe con tiza (reglas, menú de la semana, repaso) en marco de madera
export const ChalkList: P<{ head: string; items: { t: number; txt: string }[]; num?: boolean } & A0> = ({ a, d, head, items, num, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120);
  const n = items.length, lh = n > 6 ? 92 : 110, fs = n > 6 ? 56 : 66;
  return shell(f, d, <div style={{ position: "absolute", left: 250, top: 70, width: 1420, height: 940, transform: `translateY(${(1 - u) * 500}px) rotate(${(1 - u) * 4}deg)` }}>
    <div style={{ position: "absolute", inset: 0, background: FRAME, borderRadius: 14, boxShadow: SH }} />
    <div style={{ position: "absolute", inset: 30, background: CHALK, borderRadius: 6, boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)" }} />
    <div style={{ position: "absolute", left: 90, top: 64 }}><Hand txt={head} u={u} size={78} color="#F2E7C9" style={{ textShadow: "0 0 6px rgba(255,255,255,0.35)" }} /></div>
    <div style={{ position: "absolute", left: 90, top: 170, width: 600, height: 5, background: "rgba(242,231,201,0.75)", transformOrigin: "0 50%", transform: `scaleX(${ez(sp(f, at(st(a, a0)) + 12, 14, 120))})` }} />
    {items.map((it, i) => { const v = sp(f, at(it.t), 14, 150); return <div key={i} style={{ position: "absolute", left: 100, top: 200 + i * lh, display: "flex", gap: 26, alignItems: "baseline" }}>
      <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: fs, color: PAL.acc2, opacity: cl(v * 2), width: 70 }}>{num ? `${i + 1}.` : "—"}</div>
      <Hand txt={it.txt} u={v} size={fs} color="#F4EFE2" style={{ textShadow: "0 0 5px rgba(255,255,255,0.3)" }} /></div>; })}
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 8, height: 26, background: "linear-gradient(180deg, #7A4E2A, #4A2F18)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 1100, bottom: 30, width: 90, height: 22, borderRadius: 6, background: "linear-gradient(180deg, #FFFFFF, #CFCFCF)" }} />
  </div>);
};

// 6 · PASOS CON TIEMPO: barra de tiempo de cocina con relojitos que se llenan (tapado 10' → destapado 10' → huevos 4')
export const Steps: P<{ head: string; items: { t: number; txt: string; min: string }[] } & A0> = ({ a, d, head, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120);
  const n = items.length, w = Math.min(460, 1560 / n);
  return shell(f, d, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}><Big txt={head} size={84} u={u} /></div>
    <div style={{ position: "absolute", left: 180, right: 180, top: 560, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.18)" }} />
    {items.map((it, i) => { const v = sp(f, at(it.t), 13, 130); const x = 960 - (n * w) / 2 + i * w;
      const fill = cl((f - at(it.t)) / 45);
      return <div key={i} style={{ position: "absolute", left: x, top: 330, width: w, display: "flex", flexDirection: "column", alignItems: "center", opacity: cl(v * 2), transform: `translateY(${(1 - v) * 60}px)` }}>
        <div style={{ width: 230, height: 230, borderRadius: 115, background: `conic-gradient(${PAL.acc2} ${fill * 360}deg, rgba(255,255,255,0.12) ${fill * 360}deg)`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 186, height: 186, borderRadius: 93, background: `radial-gradient(circle at 40% 35%, #FFFFFF, ${PAL.cream})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OSW, fontWeight: 700, fontSize: it.min.length > 4 ? 52 : 70, color: PAL.ink }}>{it.min}</div>
        </div>
        <div style={{ marginTop: 70, maxWidth: w - 20, textAlign: "center", fontFamily: KAL, fontWeight: 700, fontSize: 50, color: PAL.cream, textShadow: "0 3px 10px rgba(0,0,0,0.6)", whiteSpace: "normal", lineHeight: 1.1 }}>{it.txt}</div>
      </div>; })}
  </>);
};

// 7 · COMPARAR: dos tarjetas enfrentadas (mal / bien, tienda / casa) con tilde y cruz
export const Compare: P<{ head?: string; left: { t: number; label: string; val: string }; right: { t: number; label: string; val: string }; foot?: { t: number; txt: string } } & A0> = ({ a, d, head, left, right, foot, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120);
  const card = (c: { t: number; label: string; val: string }, x: number, bad: boolean, rot: number) => { const v = sp(f, at(c.t), 13, 130);
    return <div style={{ position: "absolute", left: x, top: 260, width: 700, height: 560, borderRadius: 18, background: bad ? "linear-gradient(170deg, #EDE6DA, #CFC5B3)" : `linear-gradient(170deg, #FFFDF6, ${PAL.paper})`, boxShadow: SH,
      transform: `rotate(${rot}deg) translateY(${(1 - v) * 300}px)`, opacity: cl(v * 2), padding: "50px 50px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 46, letterSpacing: 4, color: bad ? "#6B6257" : PAL.acc, textTransform: "uppercase" }}>{c.label}</div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: c.val.length > 9 ? 96 : 140, lineHeight: 1.05, color: bad ? "#4A4038" : PAL.ink, marginTop: 30, whiteSpace: "normal" }}>{c.val}</div>
      <div style={{ position: "absolute", right: 40, bottom: 40 }}><Tick u={sp(f, at(c.t) + 14, 14, 140)} no={bad} size={110} /></div>
    </div>; };
  return shell(f, d, <>
    {head ? <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}><Big txt={head} size={78} u={u} /></div> : null}
    {card(left, 200, true, -3)}{card(right, 1020, false, 2.5)}
    <div style={{ position: "absolute", left: 920, top: 480, width: 80, height: 80, borderRadius: 40, background: PAL.acc2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OSW, fontWeight: 700, fontSize: 40, color: PAL.dark, boxShadow: SH, transform: `scale(${sp(f, at(right.t), 12, 160)})` }}>VS</div>
    {foot ? <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}><Hand txt={foot.txt} u={sp(f, at(foot.t), 14, 130)} size={60} color={PAL.cream} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div> : null}
  </>);
};

// 8 · TERMÓMETRO: de puerta (frío) o de horno; la columna baja/sube hasta el valor con marcas
export const Thermo: P<{ t: number; from: number; to: number; min: number; max: number; unit: string; label: string; note?: string } & A0> = ({ a, d, t, from, to, min, max, unit, label, note, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120), v = eo(cl((f - at(t)) / 50));
  const val = from + (to - from) * v, H = 640, y = (x: number) => H - ((x - min) / (max - min)) * H;
  const cold = to < from;
  const ticks = [] as number[]; for (let k = min; k <= max; k += (max - min) / 8) ticks.push(Math.round(k));
  return shell(f, d, <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(1 - u) * 400}px)` }}>
    <div style={{ position: "absolute", left: 560, top: 120, width: 300, height: 840, borderRadius: 30, background: "linear-gradient(90deg, #B8BDC2, #EEF1F3 40%, #9AA0A6)", boxShadow: SH }} />
    <div style={{ position: "absolute", left: 680, top: 170, width: 60, height: H + 40, borderRadius: 30, background: "rgba(255,255,255,0.85)", boxShadow: "inset 0 0 10px rgba(0,0,0,0.25)" }} />
    <div style={{ position: "absolute", left: 692, top: 190 + y(val), width: 36, height: H - y(val) + 20, borderRadius: 18, background: cold ? "linear-gradient(90deg, #2E6FB5, #6FA8E0)" : "linear-gradient(90deg, #B3282D, #E85A4F)" }} />
    <div style={{ position: "absolute", left: 660, top: 850, width: 100, height: 100, borderRadius: 50, background: cold ? "radial-gradient(circle at 35% 35%, #9CC8F0, #2E6FB5)" : "radial-gradient(circle at 35% 35%, #F08070, #B3282D)" }} />
    {ticks.map((k) => <div key={k} style={{ position: "absolute", left: 590, top: 190 + y(k) - 14, fontFamily: OSW, fontWeight: 500, fontSize: 26, color: "#333", width: 70, textAlign: "right" }}>{k}°</div>)}
    <div style={{ position: "absolute", left: 960, top: 300 }}>
      <Big txt={label} size={66} u={u} />
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 240, lineHeight: 1.05, color: cold ? "#BFE0FF" : "#FFD2B0", textShadow: "0 6px 26px rgba(0,0,0,0.5)", marginTop: 10 }}>{Math.round(val)}°{unit}</div>
      {note ? <Hand txt={note} u={sp(f, at(t) + 40, 14, 120)} size={60} color={PAL.cream} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /> : null}
    </div>
  </div>);
};

// 9 · CONTADOR: número grande que corre (13 centavos, 40 hombres, 3 días) con monedas/fichas que caen
export const Counter: P<{ t: number; from: number; to: number; pre?: string; suf?: string; label: string; dec?: number; chips?: number } & A0> = ({ a, d, t, from, to, pre = "", suf = "", label, dec = 0, chips = 0, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120), v = eo(cl((f - at(t)) / 40));
  const val = (from + (to - from) * v).toFixed(dec);
  return shell(f, d, <>
    {Array.from({ length: chips }).map((_, i) => { const c = sp(f, at(t) + i * 5, 12, 160); const x = 700 + ((i * 137) % 520), r = (i * 47) % 40 - 20;
      return <div key={i} style={{ position: "absolute", left: x, top: 720 - (i % 3) * 12, width: 120, height: 120, borderRadius: 60, transform: `translateY(${(1 - c) * -700}px) rotate(${r}deg)`, opacity: cl(c * 3),
        background: i % 4 === 3 ? "radial-gradient(circle at 35% 30%, #F2F2F2, #A9A9A9 60%, #6A6A6A)" : "radial-gradient(circle at 35% 30%, #F2B27A, #B8642E 60%, #7A3A14)", boxShadow: "0 10px 16px rgba(0,0,0,0.5), inset 0 0 0 6px rgba(0,0,0,0.12)" }} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 300, lineHeight: 1, color: PAL.cream, textShadow: "0 8px 30px rgba(0,0,0,0.55)", transform: `scale(${0.7 + 0.3 * u})` }}>{pre}{val}{suf}</div>
      <Hand txt={label} u={sp(f, at(t) + 20, 14, 120)} size={70} color={PAL.acc2} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} />
    </div>
  </>);
};

// 10 · PROBLEMAS: tablero de problema → arreglo con sello
export const Trouble: P<{ rows: { t: number; a: string; b: string }[] } & A0> = ({ a, d, rows, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120);
  const lh = rows.length > 4 ? 150 : 180;
  return shell(f, d, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}><Big txt="IF IT GOES WRONG" size={80} u={u} /></div>
    {rows.map((r, i) => { const v = sp(f, at(r.t), 13, 130); const w = sp(f, at(r.t) + 16, 13, 130);
      return <div key={i} style={{ position: "absolute", left: 180, right: 180, top: 220 + i * lh, height: lh - 30, display: "flex", alignItems: "center", gap: 40, opacity: cl(v * 2), transform: `translateX(${(1 - v) * -200}px)` }}>
        <div style={{ width: 560, height: lh - 40, background: "linear-gradient(170deg, #FFFDF6, #E8DCC0)", boxShadow: SH, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 30px", boxSizing: "border-box", gap: 20 }}>
          <Tick u={v} no size={60} /><div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 52, color: PAL.ink, textTransform: "uppercase" }}>{r.a}</div></div>
        <svg width={90} height={40}><path d="M 0 20 L 80 20 M 60 4 L 82 20 L 60 36" stroke={PAL.acc2} strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(w)} /></svg>
        <Hand txt={r.b} u={w} size={56} color={PAL.cream} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} />
      </div>; })}
  </>);
};

// 11 · LA TARJETA DEL LIBRO (CTA): tarjeta impresa apoyada en la taza, QR DIBUJADO en SVG (matriz), URL corta a mano
export const BookCard: P<{ t: number; title: string; sub: string; url: string; qr: number[][] } & A0> = ({ a, d, t, title, sub, url, qr, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 12, 110), v = sp(f, at(t), 13, 130);
  const N = qr.length, cell = 380 / N;
  return shell(f, d, <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, transform: `perspective(1800px) rotateY(${(1 - u) * -30 - 4}deg) rotateX(4deg) translateX(${(1 - u) * 400}px)`, opacity: cl(u * 2) }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: `linear-gradient(170deg, #FFFDF6, ${PAL.paper})`, boxShadow: SH }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, borderRadius: "16px 16px 0 0", background: `repeating-linear-gradient(90deg, ${PAL.bad} 0 40px, ${PAL.cream} 40px 80px)` }} />
    <div style={{ position: "absolute", left: 70, top: 90, width: 760 }}>
      <div style={{ fontFamily: OSW, fontWeight: 500, fontSize: 44, letterSpacing: 6, color: PAL.acc }}>OLE'S CAMP KITCHEN</div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: title.length > 20 ? 92 : 112, lineHeight: 1.02, color: PAL.ink, marginTop: 16, whiteSpace: "normal", textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: 48, color: PAL.acc, marginTop: 24, whiteSpace: "normal", lineHeight: 1.2 }}>{sub}</div>
      <div style={{ marginTop: 50, display: "inline-block", background: PAL.dark, padding: "16px 30px", borderRadius: 10, transform: `scale(${0.8 + 0.2 * v})`, opacity: cl(v * 2) }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 46, color: PAL.cream, letterSpacing: 1 }}>{url}</div></div>
    </div>
    <div style={{ position: "absolute", left: 900, top: 200, width: 440, height: 440, background: "#fff", borderRadius: 12, boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.85 + 0.15 * v})` }}>
      <svg width={380} height={380} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">{qr.map((row, y) => row.map((c, x) => c ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#111" /> : null))}</svg>
    </div>
    <div style={{ position: "absolute", left: 900, top: 670, width: 440, textAlign: "center" }}><Hand txt="point your phone here" u={sp(f, at(t) + 16, 14, 120)} size={44} color={PAL.bad} /></div>
  </div>);
};

// 12 · DICHO: frase corta de Ole escrita a mano grande sobre papel rasgado (el remate de cada truco)
export const Motto: P<{ t: number; txt: string; who?: string } & A0> = ({ a, d, t, txt, who = "— Ole", a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(st(a, a0)), 13, 120), v = sp(f, at(t), 14, 110);
  return shell(f, d, <div style={{ position: "absolute", left: 210, top: 260, width: 1500, height: 560, transform: `rotate(${-1.5 + (1 - u) * 5}deg) scale(${0.85 + 0.15 * u})`, opacity: cl(u * 2) }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, #FFFDF6, ${PAL.paper})`, boxShadow: SH, clipPath: "polygon(0 4%, 6% 0, 14% 3%, 25% 0, 38% 4%, 52% 1%, 66% 4%, 80% 0, 92% 3%, 100% 1%, 99% 96%, 90% 100%, 76% 97%, 60% 100%, 45% 96%, 30% 100%, 15% 97%, 3% 100%)" }} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 120, display: "flex", justifyContent: "center" }}><Hand txt={`“${txt}”`} u={v} size={txt.length > 30 ? 74 : 96} color={PAL.ink} /></div>
    <div style={{ position: "absolute", right: 120, bottom: 90 }}><Hand txt={who} u={sp(f, at(t) + 30, 14, 120)} size={56} color={PAL.acc} /></div>
  </div>);
};
