// ── HÉROES de mickey7 (Mickey's Butcher Shop, video 7: el chuck eye, el steak escondido en un roast de $5). Claude, 16-oct-2026.
//    Juego PROPIO (no recicla los de mickey1-6): pizarra de capítulos con tiza, etiqueta que se da vuelta, sellos de goma, cuenta del
//    steakhouse que se imprime, novillo con el chuck que se ilumina, corte del ojo con su anillo de grasa, mapa de costuras, regla de grosor,
//    curva de la sal, dial de horno/hornalla, pista de vueltas por minuto, termómetro de aguja, botella de soda, pizarra de arreglos, escalera de plata…
//    PURO CSS/SVG (cero imágenes): textura dibujada (boiserie verde, pizarra, papel de carnicería, mármol, hierro, kraft, papel de ticket) + luz + sombra + objeto + dato + acento.
//    Tipografías: 2 familias (Bebas Neue = rótulos y números · Caveat = tiza y mano). Paleta del local: verde boiserie, rojo delantal, azul marino, crema, latón.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { sp, ez, eo, cl, fr } from "../lkit/core";

const LAB = loadBebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const HND = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const GRN = "#1F4A3A", GRN2 = "#2E6650", RED = "#B3262E", NAVY = "#1E2A44", CREAM = "#F4ECDC", BRASS = "#C9A24A", INK = "#2A211B", OK = "#3C8A55", MEAT = "#9E2F2C", MEAT2 = "#C9504A", FAT = "#F3E6D0", PINK = "#E58A8A";
type B = { t: number; txt: string };
type PP<T> = React.FC<T & { a: number; d: number; a0?: number }>;

// tiempo: f = cuadros desde el arranque ORIGINAL del componente (a0 si una ventana del avatar lo partió)
const useK = (a: number, a0?: number) => {
  const fl = useCurrentFrame(); const base = a0 ?? a;
  const f = fl + fr(a) - fr(base);
  return { f, fl, at: (t: number) => fr(t) - fr(base) };
};
const on = (f: number, at: number, dur = 12) => cl((f - at) / dur);

// ── texturas del oficio (gradientes) ──────────────────────────────────────
const TX: Record<string, string> = {
  green: "repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0 300px, rgba(0,0,0,0.22) 300px 306px, rgba(255,255,255,0.06) 306px 310px, rgba(0,0,0,0) 310px 320px), linear-gradient(180deg, rgba(255,255,255,0.05) 0 2%, transparent 2% 48%, rgba(0,0,0,0.25) 48% 49%, rgba(255,255,255,0.06) 49% 50%, transparent 50%), radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,0.08), transparent 70%), linear-gradient(180deg, #24523F, #173729)",
  chalk: "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.09), transparent 70%), radial-gradient(ellipse 30% 14% at 72% 66%, rgba(255,255,255,0.07), transparent 70%), repeating-linear-gradient(172deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 11px), repeating-linear-gradient(8deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 7px), linear-gradient(180deg, #2C3530, #1E2622)",
  paper: "repeating-linear-gradient(90deg, rgba(150,90,80,0.05) 0 1px, transparent 1px 9px), repeating-linear-gradient(3deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 15px), radial-gradient(ellipse 45% 35% at 30% 30%, rgba(255,255,255,0.45), transparent 70%), linear-gradient(170deg, #EFDCCF, #DEC2B2)",
  marble: "linear-gradient(118deg, transparent 20%, rgba(120,120,130,0.18) 21%, transparent 22.5%, transparent 55%, rgba(120,120,130,0.14) 56%, transparent 57.2%), linear-gradient(32deg, transparent 38%, rgba(140,140,150,0.16) 39%, transparent 40%, transparent 70%, rgba(140,140,150,0.12) 70.8%, transparent 72%), radial-gradient(ellipse 50% 40% at 35% 30%, rgba(255,255,255,0.9), transparent 70%), linear-gradient(160deg, #F2F1EE, #D9D8D4)",
  iron: "radial-gradient(ellipse 45% 35% at 40% 35%, rgba(255,255,255,0.07), transparent 70%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.025) 0 2px, transparent 2px 5px), linear-gradient(170deg, #2A2A2C, #141416)",
  kraft: "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-67deg, rgba(255,240,210,0.07) 0 1px, transparent 1px 13px), radial-gradient(ellipse 30% 22% at 20% 30%, rgba(90,55,20,0.16), transparent 70%), linear-gradient(170deg, #C9A577, #B08756)",
  steel: "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, rgba(0,0,0,0.05) 1px 2px, transparent 2px 4px), conic-gradient(from 200deg at 30% 40%, #8F979E, #D3D8DC, #9AA2A9, #E2E6E9, #8F979E)",
  wood: "repeating-linear-gradient(91deg, rgba(60,30,10,0.18) 0 3px, transparent 3px 28px, rgba(255,220,170,0.08) 28px 33px, transparent 33px 61px), repeating-linear-gradient(89deg, rgba(60,30,10,0.10) 0 1px, transparent 1px 9px), radial-gradient(ellipse 12% 3% at 40% 30%, rgba(60,30,10,0.35), transparent 80%), linear-gradient(180deg, #8E5F36, #6E4626)",
};
const Bg: React.FC<{ k: string; f: number; dark?: number }> = ({ k, f, dark = 0 }) => {
  const sweep = -30 + (f % 300) / 300 * 170;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: TX[k] || TX.paper, transform: `scale(${1.05 + 0.0002 * f})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 14}%, rgba(255,250,235,0.09) ${sweep}%, transparent ${sweep + 14}%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 30% 8%, rgba(255,220,170,0.20), rgba(255,220,170,0) 70%)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(0deg, rgba(20,10,5,${0.32 + dark}), rgba(0,0,0,${dark * 0.5}) 62%)` }} />
  </AbsoluteFill>;
};
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-8 * Math.sin(f / 43)}px, ${5 * Math.cos(f / 49)}px) scale(${1.025 + 0.01 * Math.sin(f / 57)})` }}>{children}</AbsoluteFill>;
};
const shell = (bg: React.ReactNode, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden" }}>{bg}<Drift>{c}</Drift></AbsoluteFill>;

// ── piezas ────────────────────────────────────────────────────────────────
const Lab: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties }> = ({ txt, size, color = CREAM, u = 1, style }) => (
  <div style={{ fontFamily: LAB, fontSize: size, color, lineHeight: 0.95, letterSpacing: size > 90 ? 2 : 1, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 28}px) scale(${0.86 + 0.14 * u})`,
    textShadow: color === CREAM || color === BRASS ? "0 6px 22px rgba(0,0,0,0.55)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; chalk?: boolean; style?: React.CSSProperties }> = ({ txt, u, size, color = INK, chalk, style }) => (
  <div style={{ fontFamily: HND, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.05, paddingRight: "0.3em",
    clipPath: `inset(-30% ${(100 - 100 * ez(u)) * 1.06 - 6}% -30% -3%)`, textShadow: chalk ? "0 0 2px rgba(255,255,255,0.55), 0 0 9px rgba(255,255,255,0.18), 2px 3px 0 rgba(0,0,0,0.25)" : undefined, ...style }}>{txt}</div>
);
const Stamp: React.FC<{ txt: string; u: number; color?: string; rot?: number; size?: number; style?: React.CSSProperties }> = ({ txt, u, color = RED, rot = -8, size = 84, style }) => (
  <div style={{ display: "inline-block", fontFamily: LAB, fontSize: size, color, border: `8px solid ${color}`, borderRadius: 12, padding: "4px 26px 0", letterSpacing: 3,
    opacity: cl(u * 3) * 0.93, transform: `rotate(${rot}deg) scale(${1.9 - 0.9 * Math.min(1, u)})`, background: "rgba(255,250,240,0.12)",
    boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.15)`, maskImage: "repeating-linear-gradient(35deg, #000 0 14px, rgba(0,0,0,0.78) 14px 17px)", WebkitMaskImage: "repeating-linear-gradient(35deg, #000 0 14px, rgba(0,0,0,0.78) 14px 17px)", whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 80, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={color || (no ? RED : OK)} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
// tarjeta de papel con sombra de contacto + ambiente
const Card: React.FC<{ x: number; y: number; w: number; h?: number; u: number; rot?: number; bg?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, u, rot = -1.5, bg = TX.paper, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, borderRadius: 6, padding: "30px 40px", opacity: cl(u * 2),
    transform: `perspective(1400px) translateY(${(1 - u) * 90}px) rotateX(${(1 - u) * 24}deg) rotate(${rot}deg)`,
    boxShadow: "0 40px 70px rgba(10,5,0,0.55), 0 8px 16px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.25)", ...style }}>{children}</div>
);
// corte transversal de un steak (chuck eye): ojo marmolado con anillo de grasa
const SteakX: React.FC<{ w: number; h: number; eye?: number; ring?: number; fleck?: number; seams?: number; cook?: number; band?: number; id: string }> = ({ w, h, eye = 1, ring = 1, fleck = 1, seams = 0, cook = 0, band = 0, id }) => {
  const fl = Array.from({ length: 34 }, (_, i) => [Math.sin(i * 12.9898) * 0.5 + 0.5, Math.sin(i * 78.233) * 0.5 + 0.5, 3 + (i % 4) * 2]);
  return <svg width={w} height={h} viewBox="0 0 400 300" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id={id + "m"} cx="45%" cy="40%" r="65%"><stop offset="0" stopColor={cook ? "#E59B95" : MEAT2} /><stop offset="1" stopColor={cook ? "#B5524C" : MEAT} /></radialGradient>
      <linearGradient id={id + "c"} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4A2A16" /><stop offset="1" stopColor="#2A170B" /></linearGradient>
    </defs>
    <ellipse cx={205} cy={282} rx={190} ry={18} fill="rgba(0,0,0,0.28)" />
    <path d="M 20 150 C 15 60 110 18 210 22 C 310 26 392 70 386 160 C 380 240 300 278 200 276 C 100 274 26 236 20 150 Z" fill={cook ? `url(#${id}c)` : "#B9473F"} />
    <path d="M 34 150 C 30 72 116 36 210 40 C 300 44 372 82 368 160 C 364 228 292 260 200 258 C 108 256 38 222 34 150 Z" fill={band ? "#9B7F72" : `url(#${id}m)`} />
    {band ? <path d="M 34 150 C 30 72 116 36 210 40 C 300 44 372 82 368 160 C 364 228 292 260 200 258 C 108 256 38 222 34 150 Z" fill={`url(#${id}m)`} transform={`translate(${200 * band * 0.12} ${150 * band * 0.12}) scale(${1 - band * 0.12})`} /> : null}
    <ellipse cx={170} cy={145} rx={96 * eye} ry={84 * eye} fill="none" stroke={FAT} strokeWidth={10 * ring} opacity={ring} />
    {fl.map(([x, y, r], i) => <ellipse key={i} cx={90 + x * 220} cy={70 + y * 160} rx={r * fleck} ry={r * 0.45 * fleck} fill="#F8EEE2" opacity={0.85 * fleck} transform={`rotate(${(i * 37) % 180} ${90 + x * 220} ${70 + y * 160})`} />)}
    {seams ? <g stroke="#F4EBDD" strokeWidth={7} fill="none" strokeLinecap="round" opacity={seams}>
      <path d="M 270 46 C 262 110 290 170 352 210" /><path d="M 60 200 C 120 190 180 230 210 262" /><path d="M 290 120 C 320 130 350 128 366 120" />
    </g> : null}
  </svg>;
};
const Arrow: React.FC<{ d: string; u: number; color?: string; w?: number }> = ({ d, u, color = BRASS, w = 9 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);

// 1 · capítulo: pizarra de menú del local con marco de madera; número grande en tiza y el truco escrito a mano
export const ChalkChapter: PP<{ n: number; title: string; sub: string; tw: number }> = ({ a, d, a0, n, title, sub }) => {
  const { f } = useK(a, a0);
  const u = sp(f, 0, 14, 120), w1 = on(f, 6, 16), w2 = on(f, 18, 22), w3 = on(f, 34, 18);
  return shell(<Bg k="green" f={f} dark={0.15} />, <>
    <div style={{ position: "absolute", left: 230, top: 120, width: 1460, height: 840, borderRadius: 10, background: TX.wood, padding: 34, opacity: cl(u * 2),
      transform: `perspective(1600px) rotateY(${(1 - u) * -16}deg) rotateZ(-1deg) translateY(${(1 - u) * 60}px)`, boxShadow: "0 50px 90px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.4)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", background: TX.chalk, borderRadius: 4, boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 70, top: 40, fontFamily: HND, fontWeight: 700, fontSize: 64, color: "rgba(255,255,255,0.75)", opacity: cl(w1 * 2) }}>Mickey's trick no.</div>
        <div style={{ position: "absolute", left: 70, top: 110, fontFamily: HND, fontWeight: 700, fontSize: 420, lineHeight: 1, color: "#F6F1E4",
          clipPath: `inset(0 ${100 - 100 * ez(w1)}% 0 0)`, textShadow: "0 0 3px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.2)" }}>{n}</div>
        <div style={{ position: "absolute", left: 420, top: 230 }}><Hand txt={title} u={w2} size={title.length > 18 ? 96 : 118} color="#F6F1E4" chalk /></div>
        <div style={{ position: "absolute", left: 430, top: 380 }}><Hand txt={sub} u={w3} size={64} color="#F2C66B" chalk /></div>
        <svg width={1400} height={200} style={{ position: "absolute", left: 420, top: 470 }}><path d="M 10 30 C 300 18 600 40 900 22" stroke="rgba(255,255,255,0.7)" strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(on(f, 40, 14))} /></svg>
        <div style={{ position: "absolute", right: 60, bottom: 40, width: 220, height: 30, borderRadius: 6, background: "linear-gradient(180deg,#f5f3ee,#d9d5cc)", transform: "rotate(-8deg)", boxShadow: "0 6px 10px rgba(0,0,0,0.5)" }} />
      </div>
    </div>
  </>);
};

// 2 · etiqueta de precio que se da vuelta: CHUCK ROAST $5/lb → dorso "= RIBEYE inside"
export const PriceFlip: PP<{ tName: number; tPrice: number; tRib: number }> = ({ a, d, a0, tName, tPrice, tRib }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, at(tName) - 3, 13, 140), p = sp(f, at(tPrice), 12, 170), r = cl((f - at(tRib) + 4) / 16);
  const rot = 180 * ez(r);
  return shell(<Bg k="marble" f={f} dark={0.05} />, <>
    <div style={{ position: "absolute", left: 140, top: 210, opacity: cl(u * 2), transform: `translateX(${(1 - u) * -80}px)` }}><SteakX w={760} h={570} id="pf" /></div>
    <div style={{ position: "absolute", left: 1000, top: 220, width: 760, height: 560, perspective: 1600 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateY(${rot}deg) scale(${0.7 + 0.3 * u})`, opacity: cl(u * 2) }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(160deg,#FFFDF7,#ECE6D8)", borderRadius: 16, border: `10px solid ${RED}`, boxShadow: "0 40px 70px rgba(0,0,0,0.45)", padding: "40px 50px" }}>
          <div style={{ fontFamily: LAB, fontSize: 90, color: NAVY, letterSpacing: 4 }}>BEEF CHUCK ROAST</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: 30, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "left bottom", opacity: cl(p * 2) }}>
            <span style={{ fontFamily: LAB, fontSize: 110, color: RED, lineHeight: 1 }}>$</span><span style={{ fontFamily: LAB, fontSize: 300, color: RED, lineHeight: 0.8 }}>5</span>
            <span style={{ fontFamily: LAB, fontSize: 100, color: NAVY, lineHeight: 1 }}>.00 / LB</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: `repeating-linear-gradient(90deg, ${RED} 0 22px, #fff 22px 36px)`, opacity: 0.9, borderRadius: "0 0 6px 6px" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `linear-gradient(160deg, ${GRN2}, ${GRN})`, borderRadius: 16, border: `10px solid ${BRASS}`, boxShadow: "0 40px 70px rgba(0,0,0,0.45)", padding: "60px 50px", textAlign: "center" }}>
          <div style={{ fontFamily: HND, fontWeight: 700, fontSize: 80, color: CREAM }}>hiding inside…</div>
          <div style={{ fontFamily: LAB, fontSize: 210, color: BRASS, lineHeight: 1, marginTop: 10, textShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>A RIBEYE</div>
          <div style={{ fontFamily: LAB, fontSize: 64, color: CREAM, letterSpacing: 6 }}>THE CHUCK EYE</div>
        </div>
      </div>
    </div>
    <Arrow d="M 690 430 C 820 330 900 330 990 380" u={r} />
  </>);
};

// 3 · tres sellos de goma que caen sobre papel de carnicería
export const SameStamps: PP<{ items: B[] }> = ({ a, d, a0, items }) => {
  const { f, at } = useK(a, a0);
  return shell(<Bg k="paper" f={f} />, <>
    <div style={{ position: "absolute", left: 150, top: 120 }}><Lab txt="CHUCK EYE = RIBEYE?" size={120} color={NAVY} u={sp(f, 0, 14, 120)} /></div>
    {items.map((it, i) => <div key={i} style={{ position: "absolute", left: 180 + i * 560, top: 420 + (i % 2) * 90 }}>
      <Stamp txt={it.txt} u={sp(f, at(it.t), 10, 220)} rot={[-9, 5, -4][i]} size={100} color={[RED, NAVY, GRN][i]} />
    </div>)}
  </>);
};

// 4 · la cuenta del steakhouse que sale de la impresora, renglón por renglón, total en rojo y "+ TIP"
export const SteakhouseCheck: PP<{ rows: { t: number; a: string; b: string }[]; total: { t: number; b: string }; tip: number }> = ({ a, d, a0, rows, total, tip }) => {
  const { f, at } = useK(a, a0);
  const n = rows.filter((r) => f >= at(r.t) - 3).length + (f >= at(total.t) ? 2 : 0);
  const feed = 200 + 110 * n, tu = sp(f, at(total.t), 12, 170), tp = sp(f, at(tip), 11, 200);
  return shell(<Bg k="iron" f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 560, top: 70, width: 800, height: 120, borderRadius: 24, background: "linear-gradient(180deg,#3A3D42,#1C1E21)", boxShadow: "0 30px 50px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12)" }}>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 20, height: 14, borderRadius: 7, background: "#050505" }} />
      <div style={{ position: "absolute", right: 60, top: 30, width: 18, height: 18, borderRadius: 9, background: "#5BE37A", boxShadow: "0 0 12px #5BE37A" }} />
    </div>
    <div style={{ position: "absolute", left: 620, top: 175, width: 680, height: Math.min(860, feed), overflow: "hidden", transition: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 860, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 4px), linear-gradient(180deg,#FBFAF5,#EFEDE4)", padding: "30px 40px",
        boxShadow: "inset 0 -30px 40px rgba(0,0,0,0.06)", fontFamily: LAB, color: INK, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ fontSize: 56, textAlign: "center", letterSpacing: 6 }}>DOWNTOWN STEAKHOUSE</div>
        <div style={{ fontSize: 34, textAlign: "center", opacity: 0.6, letterSpacing: 4, marginBottom: 20 }}>TABLE 12 · ANNIVERSARY</div>
        {rows.map((r, i) => f >= at(r.t) - 3 ? <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 58, borderBottom: "3px dashed rgba(0,0,0,0.2)", padding: "8px 0" }}><span>{r.a}</span><span>{r.b}</span></div> : null)}
        {f >= at(total.t) ? <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, color: RED, transform: `scale(${0.8 + 0.2 * tu})`, transformOrigin: "right center" }}>
          <span style={{ fontSize: 70 }}>TOTAL</span><span style={{ fontSize: 150, lineHeight: 1 }}>${total.b}</span></div> : null}
        <div style={{ height: 30, background: "linear-gradient(135deg, transparent 50%, #1a1a1a 50%) 0 0/30px 30px, linear-gradient(225deg, transparent 50%, #1a1a1a 50%) 0 0/30px 30px", marginTop: 20, marginLeft: -40, marginRight: -40, opacity: 0 }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1370, top: 640 }}><Stamp txt="+ TIP" u={tp} color={BRASS} rot={10} size={110} /></div>
  </>);
};

// 5 · la promesa en tres renglones de tiza con su check
export const PromiseBoard: PP<{ tA: number; tB: number; tC: number }> = ({ a, d, a0, tA, tB, tC }) => {
  const { f, at } = useK(a, a0);
  const L = [["a steakhouse ribeye…", tA], ["…out of a $5/lb roast", tB], ["TONIGHT.", tC]] as [string, number][];
  return shell(<Bg k="chalk" f={f} />, <>
    <div style={{ position: "absolute", left: 140, top: 90 }}><Lab txt="MICKEY'S PROMISE" size={110} color={BRASS} u={sp(f, 0, 14, 120)} /></div>
    {L.map(([t, tt], i) => <div key={i} style={{ position: "absolute", left: 170, top: 280 + i * 210, display: "flex", alignItems: "center", gap: 40 }}>
      <Tick u={on(f, at(tt) + 8, 10)} size={96} color="#9BE0A8" />
      <Hand txt={t} u={on(f, at(tt) - 2, i === 2 ? 10 : 22)} size={i === 2 ? 170 : 120} color={i === 2 ? "#F2C66B" : "#F6F1E4"} chalk />
    </div>)}
  </>);
};

// 6 · lo que NO necesitás (tachado) y lo que sí: cuchillo + sartén de hierro dibujados
export const ToolsOnly: PP<{ tNo: number; tNo2: number; tYes: number }> = ({ a, d, a0, tNo, tNo2, tYes }) => {
  const { f, at } = useK(a, a0);
  const y = sp(f, at(tYes), 13, 150);
  return shell(<Bg k="marble" f={f} />, <>
    {[["FANCY GRILL", tNo], ["GADGETS", tNo2]].map(([t, tt]: any, i) => <div key={i} style={{ position: "absolute", left: 140, top: 200 + i * 200 }}>
      <Lab txt={t} size={130} color="rgba(42,33,27,0.55)" u={sp(f, at(tt) - 4, 14, 150)} />
      <svg width={700} height={140} style={{ position: "absolute", left: -20, top: 0 }}><path d="M 0 80 L 640 50" stroke={RED} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(on(f, at(tt) + 6, 8))} /></svg>
    </div>)}
    <div style={{ position: "absolute", left: 980, top: 230, opacity: cl(y * 2), transform: `translateY(${(1 - y) * 80}px)` }}>
      <svg width={820} height={560} viewBox="0 0 820 560">
        <ellipse cx={330} cy={470} rx={300} ry={40} fill="rgba(0,0,0,0.3)" />
        <ellipse cx={330} cy={340} rx={280} ry={120} fill="#1A1A1C" /><ellipse cx={330} cy={320} rx={250} ry={98} fill="#2E2F33" />
        <ellipse cx={300} cy={300} rx={160} ry={50} fill="rgba(255,255,255,0.06)" />
        <path d="M 580 320 L 800 270 L 808 300 L 590 352 Z" fill="#1A1A1C" />
        <g transform="rotate(-18 400 120)"><rect x={160} y={100} width={420} height={44} rx={6} fill="url(#bl)" /><rect x={580} y={94} width={190} height={56} rx={14} fill="#5A3A22" />
          {[620, 680, 740].map((x) => <circle key={x} cx={x} cy={122} r={7} fill="#C9C2B5" />)}</g>
        <defs><linearGradient id="bl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F2F4F6" /><stop offset="1" stopColor="#8E979F" /></linearGradient></defs>
      </svg>
      <div style={{ marginTop: -30, marginLeft: 120 }}><Lab txt="A KNIFE + A HEAVY PAN" size={84} color={NAVY} u={y} /></div>
    </div>
  </>);
};

// 7 · años en el taco: 1972 → 2026, contador que corre, "54 YEARS AT THIS BLOCK", y la bolsita del viernes
export const BlockYears: PP<{ t72: number; t54: number; tFri: number }> = ({ a, d, a0, t72, t54, tFri }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, at(t72) - 4, 14, 130), c = ez((f - at(t72)) / 50), y = Math.round(1972 + 54 * c), n = sp(f, at(t54), 12, 170), fr2 = sp(f, at(tFri), 13, 150);
  return shell(<Bg k="green" f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 200, top: 300, width: 1000, height: 460, borderRadius: 30, background: TX.wood, opacity: cl(u * 2), transform: `perspective(1400px) rotateX(${18 - 6 * u}deg) translateY(${(1 - u) * 80}px)`,
      boxShadow: "0 50px 80px rgba(0,0,0,0.55), inset 0 -24px 0 rgba(0,0,0,0.25), inset 0 6px 0 rgba(255,220,180,0.18)" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 140, top: 80 + (i % 3) * 60, width: 160, height: 6, borderRadius: 3, background: "rgba(40,20,5,0.4)", transform: `rotate(${-20 + i * 9}deg)` }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: LAB, fontSize: 250, color: CREAM, textShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>{y}</div>
    </div>
    <div style={{ position: "absolute", left: 260, top: 130 }}><Lab txt={`${Math.round(54 * c)} YEARS AT THIS BLOCK`} size={110} color={BRASS} u={n} /></div>
    <div style={{ position: "absolute", left: 1300, top: 380, opacity: cl(fr2 * 2), transform: `translateY(${(1 - fr2) * 100}px) rotate(4deg)` }}>
      <div style={{ width: 380, height: 460, background: TX.kraft, clipPath: "polygon(0 6%, 8% 0, 16% 6%, 24% 0, 32% 6%, 40% 0, 48% 6%, 56% 0, 64% 6%, 72% 0, 80% 6%, 88% 0, 96% 6%, 100% 2%, 100% 100%, 0 100%)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 40, top: -40, width: 300, height: 120, background: TX.paper, borderRadius: 10, transform: "rotate(-6deg)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 30, top: 200 }}><Hand txt="every Friday" u={on(f, at(tFri) + 4, 18)} size={74} color={INK} /></div>
    </div>
  </>);
};

// 8 · novillo dibujado: el chuck se ilumina, el cuello en gris ("gristle"), la punta de costilla en latón con flecha al ribeye
export const SteerMap: PP<{ tChuck: number; tNeck: number; tRib: number; tSame: number }> = ({ a, d, a0, tChuck, tNeck, tRib, tSame }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 110), c = on(f, at(tChuck), 14), n = on(f, at(tNeck), 12), r = on(f, at(tRib), 14), s = on(f, at(tSame), 16);
  return shell(<Bg k="chalk" f={f} />, <>
    <svg width={1700} height={900} viewBox="0 0 1700 900" style={{ position: "absolute", left: 110, top: 120, opacity: cl(u * 2), transform: `scale(${0.94 + 0.06 * u})` }}>
      <g stroke="#F3EEE2" strokeWidth={7} fill="rgba(255,255,255,0.04)" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 260 300 C 280 210 380 170 520 180 L 1220 190 C 1350 195 1440 250 1460 340 L 1480 420 C 1490 470 1470 520 1430 540 L 1420 720 L 1370 720 L 1360 560 L 1240 570 L 1230 720 L 1180 720 L 1170 570 L 640 560 L 620 720 L 570 720 L 560 560 L 470 540 L 460 720 L 410 720 L 400 520 C 340 500 300 460 290 420 Z" />
        <path d="M 260 300 C 200 280 140 290 110 330 C 90 360 100 410 140 430 C 190 450 250 440 290 420" />
        <path d="M 150 300 L 120 250 M 210 290 L 205 240" />
      </g>
      <path d="M 300 270 C 330 210 420 190 540 190 L 760 192 L 770 545 L 470 540 C 400 520 330 480 300 420 Z" fill={`rgba(201,162,74,${0.18 + 0.3 * c})`} stroke={BRASS} strokeWidth={6} strokeDasharray="14 10" opacity={c} />
      <path d="M 300 270 C 330 210 420 190 470 190 L 470 540 C 400 520 330 480 300 420 Z" fill={`rgba(120,120,120,${0.55 * n})`} />
      <path d="M 660 192 L 770 192 L 770 545 L 660 545 Z" fill={`rgba(229,138,138,${0.75 * r})`} />
      <path d="M 770 192 L 1000 194 L 1000 548 L 770 545 Z" fill={`rgba(229,138,138,${0.35 * s})`} stroke={PINK} strokeWidth={5} strokeDasharray="12 10" opacity={s} />
    </svg>
    <div style={{ position: "absolute", left: 470, top: 360 }}><Hand txt="CHUCK" u={c} size={110} color={BRASS} chalk /></div>
    <div style={{ position: "absolute", left: 300, top: 700 }}><Hand txt="neck = gristle" u={n} size={74} color="#CFCFCF" chalk /></div>
    <div style={{ position: "absolute", left: 690, top: 140 }}><Hand txt="rib end" u={r} size={80} color={PINK} chalk /></div>
    <div style={{ position: "absolute", left: 930, top: 430 }}><Hand txt="→ the RIBEYE" u={s} size={96} color="#F6F1E4" chalk /></div>
    <div style={{ position: "absolute", left: 1150, top: 820 }}><Lab txt="SAME MUSCLE" size={110} color={BRASS} u={sp(f, at(tSame) + 10, 12, 170)} /></div>
  </>);
};

// 9 · corte del roast visto de punta: aparece el ojo, la medida "a fist", el anillo de grasa y las vetas — nombre en etiqueta
export const EyeSection: PP<{ tEye: number; tFist: number; tRing: number; tFleck: number; tName: number }> = ({ a, d, a0, tEye, tFist, tRing, tFleck, tName }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), e = on(f, at(tEye), 16), fi = on(f, at(tFist), 14), r = on(f, at(tRing), 14), fl = on(f, at(tFleck), 18), nm = sp(f, at(tName), 12, 170);
  return shell(<Bg k="paper" f={f} />, <>
    <div style={{ position: "absolute", left: 160, top: 170, opacity: cl(u * 2), transform: `rotate(-3deg) scale(${0.9 + 0.1 * u})` }}><SteakX w={1000} h={750} eye={0.6 + 0.4 * ez(e)} ring={ez(r)} fleck={ez(fl)} id="es" /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <ellipse cx={585} cy={530} rx={250} ry={220} fill="none" stroke={RED} strokeWidth={9} strokeDasharray="20 14" pathLength={1000} strokeDashoffset={1000 * (1 - eo(e))} opacity={cl(e * 3)} />
    </svg>
    {[["one round EYE", e, 0], ["the size of your FIST", fi, 1], ["thin RING of fat", r, 2], ["fine white FLECKS", fl, 3]].map(([t, v, i]: any) =>
      <div key={i} style={{ position: "absolute", left: 1230, top: 230 + i * 130, display: "flex", alignItems: "center", gap: 22, opacity: cl(v * 3) }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: RED, boxShadow: "0 0 0 6px rgba(179,38,46,0.2)" }} /><Hand txt={t} u={v} size={70} color={INK} />
      </div>)}
    <div style={{ position: "absolute", left: 1230, top: 780 }}><Stamp txt="THE CHUCK EYE" u={nm} color={GRN} rot={-5} size={96} /></div>
  </>);
};

// 10 · dos roasts de punta: con ojo = BUY (sello verde) · sólo costuras = PUT IT BACK (sello rojo) → "stew pot"
export const BuyOrBack: PP<{ tYes: number; tNo: number; tStew: number }> = ({ a, d, a0, tYes, tNo, tStew }) => {
  const { f, at } = useK(a, a0);
  const y = sp(f, at(tYes) - 4, 13, 140), n = sp(f, at(tNo), 13, 140), s = on(f, at(tStew), 14);
  return shell(<Bg k="steel" f={f} dark={0.15} />, <>
    {[[y, true], [n, false]].map(([v, good]: any, i) => <div key={i} style={{ position: "absolute", left: 150 + i * 860, top: 170, width: 760, height: 760, borderRadius: 20, background: TX.paper, opacity: cl(v * 2),
      transform: `perspective(1400px) rotateY(${(1 - v) * (i ? 30 : -30)}deg)`, boxShadow: "0 40px 70px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "absolute", left: 60, top: 60 }}><SteakX w={640} h={480} eye={good ? 1 : 0.0001} ring={good ? 1 : 0} fleck={good ? 1 : 0.2} seams={good ? 0 : 1} id={"bb" + i} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 570, textAlign: "center" }}><Stamp txt={good ? "BUY IT" : "PUT IT BACK"} u={on(f, (good ? at(tYes) : at(tNo)) + 10, 8)} color={good ? OK : RED} rot={good ? -6 : 5} size={96} /></div>
    </div>)}
    <div style={{ position: "absolute", left: 1150, top: 90 }}><Hand txt="→ that one's for the stew pot" u={s} size={70} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} /></div>
  </>);
};

// 11 · papelito de pedido para el mostrador: la pregunta en un globo + checklist del corte
export const AskSlip: PP<{ q: string; items: B[]; tq: number }> = ({ a, d, a0, q, items, tq }) => {
  const { f, at } = useK(a, a0);
  const b = sp(f, at(tq) - 4, 13, 150);
  return shell(<Bg k="green" f={f} />, <>
    <div style={{ position: "absolute", left: 130, top: 140, maxWidth: 900, background: CREAM, borderRadius: 40, padding: "40px 54px", opacity: cl(b * 2), transform: `scale(${0.7 + 0.3 * b}) rotate(-2deg)`, transformOrigin: "left bottom",
      boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: HND, fontWeight: 700, fontSize: 84, color: NAVY, lineHeight: 1.05, whiteSpace: "normal" }}>{q}</div>
      <div style={{ position: "absolute", left: 120, bottom: -46, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "40px solid transparent", borderTop: `60px solid ${CREAM}` }} />
    </div>
    <Card x={1060} y={300} w={720} u={sp(f, at(items[0].t) - 6, 14, 130)} rot={2.5}>
      <div style={{ fontFamily: LAB, fontSize: 64, color: RED, letterSpacing: 4, borderBottom: `4px solid ${RED}`, paddingBottom: 8 }}>ORDER SLIP · CHUCK</div>
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 30 }}>
        <div style={{ width: 70, height: 70, border: `5px solid ${INK}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick u={on(f, at(it.t) + 6, 10)} size={56} /></div>
        <Lab txt={it.txt} size={86} color={INK} u={sp(f, at(it.t), 13, 160)} />
      </div>)}
    </Card>
  </>);
};

// 12 · mapa de costuras: el roast de arriba con las líneas blancas que se trazan como fronteras punteadas + punta del cuchillo que sigue una
export const SeamMap: PP<{ tLines: number; tMap: number; tKnife: number }> = ({ a, d, a0, tLines, tMap, tKnife }) => {
  const { f, at } = useK(a, a0);
  const l = on(f, at(tLines), 18), m = on(f, at(tMap), 14), k = cl((f - at(tKnife)) / 70);
  const P = "M 520 300 C 600 420 760 470 900 600 C 980 680 1040 760 1120 820";
  return shell(<Bg k="wood" f={f} dark={0.1} />, <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><radialGradient id="sm" cx="45%" cy="40%" r="65%"><stop offset="0" stopColor={MEAT2} /><stop offset="1" stopColor={MEAT} /></radialGradient></defs>
      <ellipse cx={900} cy={940} rx={640} ry={40} fill="rgba(0,0,0,0.35)" />
      <path d="M 300 420 C 280 230 520 140 860 150 C 1240 160 1580 260 1600 520 C 1620 760 1300 920 900 910 C 520 900 320 720 300 420 Z" fill="url(#sm)" stroke="#E8D7C2" strokeWidth={14} />
      {[P, "M 900 600 C 1100 560 1300 600 1560 520", "M 900 600 C 760 700 560 760 380 700", "M 860 150 C 880 300 880 450 900 600"].map((p, i) =>
        <path key={i} d={p} stroke="#F5EDE0" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={m > 0 ? "22 16" : undefined} pathLength={1000}
          strokeDashoffset={0} opacity={ez(l)} style={{ clipPath: undefined }} />)}
    </svg>
    <div style={{ position: "absolute", left: 1220, top: 120 }}><Hand txt="borders on a map" u={m} size={88} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} /></div>
    <div style={{ position: "absolute", left: 120, top: 120 }}><Lab txt="DON'T CUT THROUGH · FOLLOW" size={90} color={BRASS} u={sp(f, at(tKnife), 13, 150)} /></div>
    {k > 0 ? (() => { const x = 520 + 600 * k, y = 300 + 520 * Math.pow(k, 0.95); return <div style={{ position: "absolute", left: x - 30, top: y - 300, transform: "rotate(28deg)" }}>
      <div style={{ width: 34, height: 220, borderRadius: "17px 17px 4px 4px", background: "linear-gradient(90deg,#F4F6F8,#9AA3AB)", clipPath: "polygon(50% 100%, 0 0, 100% 0)", transform: "rotate(180deg)" }} />
      <div style={{ width: 44, height: 150, marginLeft: -5, borderRadius: 12, background: "#4E3420", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }} /></div>; })() : null}
  </>);
};

// 13 · rendimiento: el ojo de un lado (ribeye chico), los recortes del otro → stew / burgers; balanza de cocina con las libras
export const YieldSplit: PP<{ tEye: number; tRest: number; tUse: number }> = ({ a, d, a0, tEye, tRest, tUse }) => {
  const { f, at } = useK(a, a0);
  const e = sp(f, at(tEye), 13, 140), r = sp(f, at(tRest), 13, 140), u2 = on(f, at(tUse), 16);
  return shell(<Bg k="marble" f={f} />, <>
    <div style={{ position: "absolute", left: 150, top: 220, opacity: cl(e * 2), transform: `translateX(${(1 - e) * -120}px)` }}>
      <SteakX w={700} h={520} id="ye" /><div style={{ marginTop: 10, marginLeft: 150 }}><Lab txt="THE EYE · STEAKS" size={90} color={GRN} u={e} /></div>
    </div>
    <div style={{ position: "absolute", left: 1050, top: 300, opacity: cl(r * 2), transform: `translateX(${(1 - r) * 120}px)` }}>
      <svg width={700} height={420} viewBox="0 0 700 420">
        {Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${120 + (i % 3) * 160 + (i > 5 ? 60 : 0)} ${80 + Math.floor(i / 3) * 100}) rotate(${i * 23})`}>
          <path d="M -70 0 C -60 -50 50 -55 70 -5 C 80 40 -40 55 -70 0 Z" fill={i % 2 ? MEAT : MEAT2} /><path d="M -50 -10 C -10 0 20 -20 55 -8" stroke={FAT} strokeWidth={8} fill="none" /></g>)}
      </svg>
      <div style={{ marginLeft: 120 }}><Lab txt="TRIMMINGS · ±1 LB" size={90} color={RED} u={r} /></div>
      <div style={{ marginLeft: 130, marginTop: 10 }}><Hand txt="stew · burgers on Sunday" u={u2} size={70} color={INK} /></div>
    </div>
  </>);
};

// 14 · grasa blanda vs silver skin: dos muestras con el pulgar que aprieta (una cede, la otra rebota)
export const SoftSilver: PP<{ tSoft: number; tSilver: number; tThumb: number }> = ({ a, d, a0, tSoft, tSilver, tThumb }) => {
  const { f, at } = useK(a, a0);
  const s = sp(f, at(tSoft) - 4, 13, 140), v = sp(f, at(tSilver) - 4, 13, 140), th = on(f, at(tThumb), 30);
  const press = Math.sin(Math.PI * cl((f - at(tThumb)) / 26));
  return shell(<Bg k="paper" f={f} />, <>
    {[[s, "SOFT FAT", "= FLAVOR", "#F6EBD6", OK], [v, "SILVER SKIN", "= RUBBER BAND", "#DCE3EA", RED]].map(([u, t1, t2, col, cc]: any, i) =>
      <div key={i} style={{ position: "absolute", left: 160 + i * 860, top: 200, width: 740, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px)` }}>
        <div style={{ height: 380, borderRadius: 30, background: i ? `linear-gradient(115deg, #EEF2F6 0 18%, #B9C4CE 30%, #F8FAFC 42%, #AEB9C3 60%, #E5EBF0)` : `radial-gradient(ellipse 60% 50% at 40% 40%, #FFF7E8, ${col})`,
          boxShadow: "0 30px 50px rgba(0,0,0,0.35), inset 0 -20px 30px rgba(0,0,0,0.12)", transform: `scaleY(${i ? 1 - 0.03 * press : 1 - 0.18 * press})`, transformOrigin: "bottom" }} />
        <div style={{ marginTop: 26 }}><Lab txt={t1} size={110} color={INK} u={u} /></div><div><Lab txt={t2} size={80} color={cc} u={u} /></div>
      </div>)}
    <div style={{ position: "absolute", left: 360, top: 900 }}><Hand txt="soft gives · silver fights back" u={th} size={90} color={NAVY} /></div>
  </>);
};

// 15 · la veta: fibras dibujadas; corte ACROSS (verde, pedacitos cortos) vs ALONG (rojo, soga larga)
export const GrainCut: PP<{ tAcross: number; tAlong: number; tHalf: number }> = ({ a, d, a0, tAcross, tAlong, tHalf }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), ac = on(f, at(tAcross), 14), al = on(f, at(tAlong), 14), h = sp(f, at(tHalf), 12, 170);
  return shell(<Bg k="wood" f={f} dark={0.15} />, <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cl(u * 2) }}>
      <rect x={240} y={260} width={1440} height={520} rx={60} fill={MEAT} stroke="#E8D7C2" strokeWidth={12} />
      {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M 270 ${290 + i * 24} C 700 ${280 + i * 24} 1200 ${300 + i * 24} 1650 ${290 + i * 24}`} stroke={i % 3 ? "rgba(255,190,180,0.35)" : "rgba(80,10,10,0.35)"} strokeWidth={4} fill="none" />)}
      {[520, 700, 880].map((x, i) => <path key={x} d={`M ${x} 220 L ${x} 820`} stroke="#7EE29A" strokeWidth={10} strokeDasharray="26 14" pathLength={1} opacity={cl(ac * 3)} style={{ strokeDashoffset: 0 }} />)}
      <path d="M 1100 520 L 1640 520" stroke={RED} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(al)} />
    </svg>
    <div style={{ position: "absolute", left: 470, top: 110 }}><Lab txt="ACROSS ✓" size={120} color="#7EE29A" u={sp(f, at(tAcross), 12, 160)} /></div>
    <div style={{ position: "absolute", left: 1180, top: 820 }}><Lab txt="ALONG = A ROPE ✗" size={100} color={PINK} u={sp(f, at(tAlong), 12, 160)} /></div>
    <div style={{ position: "absolute", left: 240, top: 840 }}><Hand txt="the knife did half the chewing" u={on(f, at(tHalf), 20)} size={72} color={CREAM} style={{ opacity: cl(h * 2), textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} /></div>
  </>);
};

// 16 · regla de carpintero: steak de 1½" vs ¾"; abajo el corte cocido: el fino gris entero, el grueso rosado con costra
export const ThickThin: PP<{ tThick: number; tThin: number; tGray: number; tPink: number }> = ({ a, d, a0, tThick, tThin, tGray, tPink }) => {
  const { f, at } = useK(a, a0);
  const k = sp(f, at(tThick) - 3, 13, 140), n = sp(f, at(tThin), 13, 140), g = on(f, at(tGray), 16), p = on(f, at(tPink), 16);
  const Slab = ({ h, u, cook, gray, label, col }: any) => <div style={{ width: 620, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px)` }}>
    <div style={{ height: h, borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 40px rgba(0,0,0,0.45)", background: cook ? (gray ? `linear-gradient(180deg,#3A2010 0 8%, #9B7F72 8% 92%, #3A2010 92%)` : `linear-gradient(180deg,#3A2010 0 7%, #A86A5C 7% 14%, ${PINK} 14% 86%, #A86A5C 86% 93%, #3A2010 93%)`)
      : `linear-gradient(180deg, ${MEAT2}, ${MEAT})`, transition: "none" }} />
    <div style={{ marginTop: 16 }}><Lab txt={label} size={90} color={col} u={u} /></div></div>;
  return shell(<Bg k="marble" f={f} />, <>
    <div style={{ position: "absolute", left: 140, top: 140, width: 70, height: 800, background: "linear-gradient(90deg,#E8C770,#C9A24A)", borderRadius: 6, boxShadow: "0 20px 30px rgba(0,0,0,0.3)" }}>
      {Array.from({ length: 33 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 20 + i * 24, width: i % 4 ? 22 : 44, height: 3, background: INK }} />)}
    </div>
    <div style={{ position: "absolute", left: 300, top: 160, display: "flex", gap: 120, alignItems: "flex-end" }}>
      <Slab h={300} u={k} cook={p > 0} gray={false} label={'1½"  ✓'} col={OK} />
      <Slab h={150} u={n} cook={g > 0} gray label={'¾"  ✗'} col={RED} />
    </div>
    <div style={{ position: "absolute", left: 1040, top: 640 }}><Hand txt="gray all the way through" u={g} size={66} color={RED} /></div>
    <div style={{ position: "absolute", left: 320, top: 640 }}><Hand txt="crust + pink middle" u={p} size={66} color={OK} /></div>
  </>);
};

// 17 · dial del freezer: aguja hasta 20 min y escarcha que se dibuja; "JUST FIRM"
export const FreezeDial: PP<{ t20: number; tFirm: number }> = ({ a, d, a0, t20, tFirm }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), m = ez((f - at(t20) + 6) / 30), fm = sp(f, at(tFirm), 12, 170);
  const ang = -120 + 120 * m;
  return shell(<Bg k="steel" f={f} dark={0.1} />, <>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(220,240,255,${0.35 * m}) 100%)` }} />
    <div style={{ position: "absolute", left: 610, top: 160, width: 700, height: 700, borderRadius: 350, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #DDE6EE 60%, #B9C7D3)", opacity: cl(u * 2), transform: `scale(${0.8 + 0.2 * u})`,
      boxShadow: "0 40px 70px rgba(0,0,0,0.45), inset 0 0 0 22px #9FB0BF, inset 0 0 0 30px #E9EFF4" }}>
      {Array.from({ length: 31 }, (_, i) => { const A = (-150 + i * 10) * Math.PI / 180; return <div key={i} style={{ position: "absolute", left: 350 + Math.sin(A) * 280 - 3, top: 350 - Math.cos(A) * 280, width: 6, height: i % 5 ? 20 : 40, background: NAVY, transform: `rotate(${-150 + i * 10}deg)`, transformOrigin: "top" }} />; })}
      <div style={{ position: "absolute", left: 340, top: 120, width: 20, height: 240, borderRadius: 10, background: RED, transformOrigin: "50% 230px", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: 310, top: 320, width: 80, height: 80, borderRadius: 40, background: NAVY }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: LAB, fontSize: 130, color: NAVY }}>{Math.round(20 * m)} MIN</div>
    </div>
    <div style={{ position: "absolute", left: 1350, top: 420 }}><Stamp txt="JUST FIRM" u={fm} color={NAVY} rot={-6} size={100} /></div>
    <div style={{ position: "absolute", left: 180, top: 460 }}><Lab txt="NOT FROZEN" size={100} color={CREAM} u={fm} /></div>
  </>);
};

// 18 · curva de la sal: el agua sale (30 min) y vuelve a entrar; de noche llega al centro — gráfico de tiza
export const SaltCurve: PP<{ tOut: number; tIn: number; tNight: number }> = ({ a, d, a0, tOut, tIn, tNight }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), o = on(f, at(tOut), 30), i2 = on(f, at(tIn), 30), n = on(f, at(tNight), 20);
  return shell(<Bg k="chalk" f={f} />, <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cl(u * 2) }}>
      <path d="M 220 200 L 220 820 L 1720 820" stroke="#E8E4DA" strokeWidth={6} fill="none" />
      <path d="M 220 520 L 1720 520" stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeDasharray="12 12" />
      <path d="M 220 520 C 330 520 380 300 520 300" stroke="#8FC8F0" strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(o)} />
      <path d="M 520 300 C 700 300 760 700 1000 720 C 1200 735 1500 740 1700 740" stroke="#F2C66B" strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(i2 * 0.6 + n * 0.4)} />
      {[[520, "30 MIN"], [1000, "4 H"], [1660, "OVERNIGHT"]].map(([x, t]: any, i) => <g key={i}><path d={`M ${x} 820 L ${x} 840`} stroke="#E8E4DA" strokeWidth={5} /></g>)}
    </svg>
    {[[470, "30 min"], [960, "4 h"], [1560, "overnight"]].map(([x, t]: any, i) => <div key={i} style={{ position: "absolute", left: x, top: 850 }}><Hand txt={t} u={u} size={60} color="#E8E4DA" chalk /></div>)}
    <div style={{ position: "absolute", left: 420, top: 200 }}><Hand txt="water comes OUT" u={o} size={78} color="#8FC8F0" chalk /></div>
    <div style={{ position: "absolute", left: 860, top: 560 }}><Hand txt="…and goes back IN" u={i2} size={78} color="#F2C66B" chalk /></div>
    <div style={{ position: "absolute", left: 1220, top: 360 }}><Lab txt="SALT IN THE MIDDLE" size={90} color={CREAM} u={sp(f, at(tNight) + 8, 12, 160)} /></div>
    <div style={{ position: "absolute", left: 120, top: 90 }}><Lab txt="SALT ON THE STEAK" size={90} color={BRASS} u={u} /></div>
  </>);
};

// 19 · ficha de receta de la sal (tarjeta de fichero con renglones), un renglón por frase
export const SaltCard: PP<{ lines: B[] }> = ({ a, d, a0, lines }) => {
  const { f, at } = useK(a, a0);
  return shell(<Bg k="green" f={f} />, <>
    <Card x={300} y={110} w={1320} h={860} u={sp(f, 0, 14, 120)} rot={-1.2}
      bg={`linear-gradient(180deg, transparent 0 150px, ${RED} 150px 154px, transparent 154px), repeating-linear-gradient(180deg, transparent 0 118px, rgba(60,90,150,0.35) 118px 121px), linear-gradient(170deg,#FFFDF6,#F0E9DA)`}>
      <div style={{ fontFamily: LAB, fontSize: 96, color: NAVY, letterSpacing: 4 }}>THE NIGHT-BEFORE SALT</div>
      <div style={{ marginTop: 40 }}>{lines.map((l, i) => <div key={i} style={{ height: 120, display: "flex", alignItems: "center" }}><Hand txt={"· " + l.txt} u={on(f, at(l.t) - 2, 18)} size={84} color={INK} /></div>)}</div>
      <div style={{ position: "absolute", right: 60, top: 40, width: 140, height: 140, borderRadius: 70, background: "radial-gradient(circle at 40% 35%, #fff, #ddd)", boxShadow: "inset 0 -8px 14px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAB, fontSize: 56, color: NAVY }}>¾ tsp</div>
    </Card>
  </>);
};

// 20 · reloj de cocina: 10 min ✗ "worst of both", 45 min ✓ mínimo, una noche ★
export const SaltClock: PP<{ t45: number; t10: number; tWorst: number }> = ({ a, d, a0, t45, t10, tWorst }) => {
  const { f, at } = useK(a, a0);
  const R = [["45 MIN", "at least", t45, OK, true], ["10 MIN", "never", t10, RED, false]] as const;
  return shell(<Bg k="kraft" f={f} />, <>
    {R.map(([t, s, tt, c, ok], i) => { const u = sp(f, at(tt) - 3, 13, 150); const m = ez((f - at(tt)) / 26) * (ok ? 0.75 : 1 / 6);
      return <div key={i} style={{ position: "absolute", left: 220 + i * 820, top: 190, width: 640, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}>
        <div style={{ position: "relative", width: 520, height: 520, borderRadius: 260, margin: "0 auto", background: "radial-gradient(circle at 40% 35%, #FFFDF7, #E8E1D2)", boxShadow: `0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 18px ${c}` }}>
          <div style={{ position: "absolute", inset: 18, borderRadius: 260, background: `conic-gradient(${c}AA 0 ${m * 360}deg, transparent ${m * 360}deg)` }} />
          <div style={{ position: "absolute", left: 250, top: 70, width: 20, height: 200, borderRadius: 10, background: INK, transformOrigin: "50% 190px", transform: `rotate(${m * 360}deg)` }} />
          <div style={{ position: "absolute", left: 230, top: 230, width: 60, height: 60, borderRadius: 30, background: INK }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}><Lab txt={t} size={130} color={c} u={u} /><Hand txt={s} u={on(f, at(tt) + 4, 12)} size={70} color={INK} style={{ display: "inline-block" }} /></div>
      </div>; })}
    <div style={{ position: "absolute", left: 1150, top: 120 }}><Stamp txt="WORST OF BOTH" u={sp(f, at(tWorst), 10, 220)} color={RED} rot={8} size={84} /></div>
  </>);
};

// 21 · el mito de la mesada: termómetro de aguja que sube sólo 2-3°; sello "MYTH"
export const CounterMyth: PP<{ tHour: number; tDeg: number; tNo: number }> = ({ a, d, a0, tHour, tDeg, tNo }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, at(tHour) - 4, 13, 140), v = 38 + 3 * ez((f - at(tDeg)) / 24), n = sp(f, at(tNo), 10, 220);
  const p = (v - 30) / 100;
  return shell(<Bg k="marble" f={f} />, <>
    <div style={{ position: "absolute", left: 160, top: 180 }}><Lab txt="1 HOUR ON THE COUNTER" size={110} color={NAVY} u={u} /></div>
    <div style={{ position: "absolute", left: 300, top: 360, width: 1100, height: 120, borderRadius: 60, background: "rgba(255,255,255,0.92)", boxShadow: "0 24px 40px rgba(0,0,0,0.3), inset 0 0 0 6px #ddd", opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 30, top: 34, height: 52, width: 1040 * p, borderRadius: 26, background: `linear-gradient(90deg, #6FB7E8, ${RED})` }} />
      {[30, 50, 70, 90, 110, 130].map((t, i) => <div key={t} style={{ position: "absolute", left: 30 + 1040 * (t - 30) / 100, top: 130, fontFamily: LAB, fontSize: 44, color: INK }}>{t}°</div>)}
    </div>
    <div style={{ position: "absolute", left: 300, top: 560 }}><Lab txt={`${v.toFixed(0)}°F  (+${(v - 38).toFixed(0)}°)`} size={160} color={RED} u={sp(f, at(tDeg), 12, 170)} /></div>
    <div style={{ position: "absolute", left: 1250, top: 600 }}><Stamp txt="MYTH" u={n} color={RED} rot={-12} size={160} /></div>
  </>);
};

// 22 · la hornalla: perilla en MEDIUM-HIGH, 5 min vacía, aceite que brilla, la primera voluta de humo (cuatro pasos)
export const PanHeat: PP<{ tMed: number; t5: number; tOil: number; tSmoke: number }> = ({ a, d, a0, tMed, t5, tOil, tSmoke }) => {
  const { f, at } = useK(a, a0);
  const S = [["MEDIUM-HIGH", tMed], ["5 MIN · EMPTY", t5], ["1 TBSP OIL", tOil], ["FIRST WISP = READY", tSmoke]] as [string, number][];
  const kn = ez((f - at(tMed)) / 16) * 200, sm = on(f, at(tSmoke), 40);
  return shell(<Bg k="iron" f={f} />, <>
    <div style={{ position: "absolute", left: 180, top: 230, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(circle at 40% 35%, #F4F4F2, #C9CBCE 60%, #8E9196)", boxShadow: "0 40px 70px rgba(0,0,0,0.6), inset 0 0 0 16px #6F7277" }}>
      {["OFF", "LOW", "MED", "HI"].map((t, i) => { const A = (-90 + i * 75) * Math.PI / 180; return <div key={t} style={{ position: "absolute", left: 280 + Math.cos(A) * 200 - 50, top: 280 + Math.sin(A) * 200 - 26, width: 100, textAlign: "center", fontFamily: LAB, fontSize: 44, color: INK }}>{t}</div>; })}
      <div style={{ position: "absolute", left: 130, top: 130, width: 300, height: 300, borderRadius: 150, background: "radial-gradient(circle at 40% 30%, #3A3B3E, #111)", transform: `rotate(${kn}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 135, top: 10, width: 30, height: 140, borderRadius: 15, background: "linear-gradient(90deg,#E9E9E9,#9a9a9a)" }} />
      </div>
    </div>
    {sm > 0 ? <svg width={300} height={400} style={{ position: "absolute", left: 360, top: -80 + 300 * (1 - sm), opacity: cl(sm * 2) * 0.8 }}><path d="M 150 380 C 100 300 200 240 150 160 C 110 90 190 60 160 0" stroke="rgba(230,230,230,0.7)" strokeWidth={22} fill="none" strokeLinecap="round" /></svg> : null}
    {S.map(([t, tt], i) => { const u = sp(f, at(tt), 13, 160); return <div key={i} style={{ position: "absolute", left: 860, top: 210 + i * 170, display: "flex", alignItems: "center", gap: 30, opacity: cl(u * 2), transform: `translateX(${(1 - u) * 80}px)` }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: i === 3 ? RED : BRASS, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAB, fontSize: 64, color: "#fff", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>{i + 1}</div>
      <Lab txt={t} size={96} color={CREAM} /></div>; })}
  </>);
};

// 23 · pista de vueltas: "5 min each side" tachado vs flechitas de vuelta cada minuto; al final dos cortes: banda gris gruesa vs fina
export const FlipTrack: PP<{ tOld: number; tFlip: number; tBand: number }> = ({ a, d, a0, tOld, tFlip, tBand }) => {
  const { f, at } = useK(a, a0);
  const o = sp(f, at(tOld) - 3, 13, 150), x = on(f, at(tOld) + 14, 8), fl = sp(f, at(tFlip) - 2, 13, 150), b = sp(f, at(tBand), 13, 150);
  return shell(<Bg k="kraft" f={f} />, <>
    <div style={{ position: "absolute", left: 140, top: 130, opacity: cl(o * 2) }}>
      <Lab txt="5 MIN · FLIP · 5 MIN" size={100} color="rgba(42,33,27,0.6)" u={o} />
      <svg width={1000} height={120} style={{ position: "absolute", left: -20, top: 10 }}><path d="M 0 60 L 860 40" stroke={RED} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(x)} /></svg>
    </div>
    <div style={{ position: "absolute", left: 140, top: 330, display: "flex", gap: 28, opacity: cl(fl * 2) }}>
      {Array.from({ length: 8 }, (_, i) => { const u = sp(f, at(tFlip) + i * 5, 12, 180); return <div key={i} style={{ width: 170, height: 170, borderRadius: 20, background: i % 2 ? "linear-gradient(180deg,#5A3218,#2E190A)" : "linear-gradient(180deg,#7A4524,#3E220E)", transform: `rotateX(${(1 - u) * 180}deg)`, boxShadow: "0 14px 24px rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAB, fontSize: 64, color: CREAM }}>{i + 1}′</div>; })}
    </div>
    <div style={{ position: "absolute", left: 160, top: 530 }}><Hand txt="flip it every minute" u={on(f, at(tFlip), 20)} size={84} color={INK} /></div>
    <div style={{ position: "absolute", left: 300, top: 660, display: "flex", gap: 160, opacity: cl(b * 2), transform: `translateY(${(1 - b) * 60}px)` }}>
      {[[0.42, "OLD WAY", RED], [0.12, "EVERY MINUTE", OK]].map(([band, t, c]: any, i) => <div key={i}>
        <div style={{ width: 560, height: 180, borderRadius: 14, background: `linear-gradient(180deg, #2E190A 0 9%, #9B7F72 9% ${9 + band * 50}%, ${PINK} ${9 + band * 50}% ${91 - band * 50}%, #9B7F72 ${91 - band * 50}% 91%, #2E190A 91%)`, boxShadow: "0 18px 30px rgba(0,0,0,0.4)" }} />
        <div style={{ marginTop: 10 }}><Lab txt={t} size={70} color={c} /></div></div>)}
    </div>
  </>);
};

// 24 · ingredientes del final: tres fichas que caen en la sartén de hierro dibujada; la cuchara que rocía
export const BasteCard: PP<{ items: B[]; tSpoon: number }> = ({ a, d, a0, items, tSpoon }) => {
  const { f, at } = useK(a, a0);
  const s = on(f, at(tSpoon), 20), wob = Math.sin(f / 5) * 8 * s;
  return shell(<Bg k="iron" f={f} />, <>
    <svg width={1100} height={760} viewBox="0 0 1100 760" style={{ position: "absolute", left: 60, top: 220 }}>
      <ellipse cx={500} cy={640} rx={460} ry={60} fill="rgba(0,0,0,0.45)" />
      <ellipse cx={500} cy={430} rx={440} ry={200} fill="#151517" /><ellipse cx={500} cy={410} rx={400} ry={170} fill="#2B2C30" />
      <ellipse cx={500} cy={420} rx={300} ry={110} fill="#4A2A16" /><ellipse cx={480} cy={400} rx={200} ry={60} fill="#6B3E1F" />
      <ellipse cx={500} cy={420} rx={360} ry={140} fill={`rgba(242,193,78,${0.35 * s})`} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={220 + (i * 47) % 560} cy={360 + ((i * 31) % 130)} r={6 + (i % 3) * 3} fill={`rgba(255,240,200,${0.5 * s})`} />)}
      <path d="M 900 380 L 1090 330 L 1096 360 L 905 420 Z" fill="#151517" />
    </svg>
    <div style={{ position: "absolute", left: 600, top: 120 + wob, opacity: cl(s * 3), transform: "rotate(-30deg)" }}>
      <div style={{ width: 120, height: 80, borderRadius: "50%", background: "linear-gradient(180deg,#E9ECEF,#8E979F)" }} /><div style={{ width: 24, height: 260, marginLeft: 96, marginTop: -10, background: "linear-gradient(90deg,#E9ECEF,#8E979F)", borderRadius: 12 }} />
    </div>
    {items.map((it, i) => { const u = sp(f, at(it.t), 13, 150); return <div key={i} style={{ position: "absolute", left: 1220, top: 200 + i * 200, opacity: cl(u * 2), transform: `translateX(${(1 - u) * 120}px) rotate(${[-2, 1.5, -1][i]}deg)` }}>
      <div style={{ background: TX.paper, padding: "18px 40px", borderRadius: 8, boxShadow: "0 20px 34px rgba(0,0,0,0.5)", borderLeft: `14px solid ${[BRASS, CREAM, OK][i]}` }}><Lab txt={it.txt} size={84} color={INK} /></div></div>; })}
    <div style={{ position: "absolute", left: 240, top: 120 }}><Hand txt="spoon it over · again & again" u={s} size={70} color={BRASS} /></div>
  </>);
};

// 25 · termómetro de aguja: sube hasta 130 (verde), marca 125 tachado; "fat melts in"
export const PullDial: PP<{ t130: number; t125: number; tFat: number }> = ({ a, d, a0, t130, t125, tFat }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, 0, 14, 120), v = 60 + 70 * ez((f - at(t130) + 10) / 34), x = on(f, at(t125), 10), ft = on(f, at(tFat), 18);
  const ang = -135 + 270 * (v - 40) / 160;
  return shell(<Bg k="steel" f={f} dark={0.1} />, <>
    <div style={{ position: "absolute", left: 220, top: 150, width: 780, height: 780, borderRadius: 390, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #ECEFF2 60%, #C6CDD3)", opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})`,
      boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 0 0 26px #A9B2BA, inset 0 0 0 34px #F3F5F7" }}>
      <div style={{ position: "absolute", inset: 60, borderRadius: 330, background: `conic-gradient(from -135deg, transparent 0 ${(270 * (125 - 40) / 160)}deg, ${OK} ${(270 * (125 - 40) / 160)}deg ${(270 * (135 - 40) / 160)}deg, transparent ${(270 * (135 - 40) / 160)}deg)`, WebkitMaskImage: "radial-gradient(circle, transparent 62%, #000 63%)", maskImage: "radial-gradient(circle, transparent 62%, #000 63%)" }} />
      {Array.from({ length: 17 }, (_, i) => { const deg = -135 + i * 270 / 16; const A = deg * Math.PI / 180; return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 387, top: 390 - 300, width: 6, height: i % 2 ? 22 : 44, background: NAVY, transformOrigin: "3px 300px", transform: `rotate(${deg}deg)` }} />
        {i % 2 ? null : <div style={{ position: "absolute", left: 390 + Math.sin(A) * 220 - 50, top: 390 - Math.cos(A) * 220 - 28, width: 100, textAlign: "center", fontFamily: LAB, fontSize: 46, color: NAVY }}>{40 + i * 10}</div>}
      </React.Fragment>; })}
      <div style={{ position: "absolute", left: 380, top: 110, width: 20, height: 290, borderRadius: 10, background: RED, transformOrigin: "50% 280px", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: 345, top: 345, width: 90, height: 90, borderRadius: 45, background: NAVY }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: LAB, fontSize: 120, color: NAVY }}>{Math.round(v)}°F</div>
    </div>
    <div style={{ position: "absolute", left: 1120, top: 260 }}><Lab txt="PULL AT 130°" size={150} color={OK} u={sp(f, at(t130) + 16, 12, 170)} /></div>
    <div style={{ position: "absolute", left: 1130, top: 450, opacity: cl(x * 3) }}><Lab txt="NOT 125°" size={120} color={RED} />
      <svg width={500} height={130} style={{ position: "absolute", left: -10, top: 0 }}><path d="M 0 70 L 440 50" stroke={RED} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(x)} /></svg></div>
    <div style={{ position: "absolute", left: 1130, top: 640 }}><Hand txt="the fat melts into the meat" u={ft} size={72} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)" }} /></div>
  </>);
};

// 26 · reposo: botella de soda que se agita y se calma + cuenta regresiva 5:00
export const RestBottle: PP<{ t5: number; tSoda: number; tSettle: number }> = ({ a, d, a0, t5, tSoda, tSettle }) => {
  const { f, at } = useK(a, a0);
  const u = sp(f, at(t5) - 4, 13, 140), shk = on(f, at(tSoda), 6) * (1 - on(f, at(tSettle), 30)), st = on(f, at(tSettle), 30);
  const secs = Math.max(0, 300 - Math.floor(Math.max(0, f - at(t5)) / 30 * 18));
  const wob = Math.sin(f * 1.3) * 7 * shk;
  return shell(<Bg k="wood" f={f} dark={0.12} />, <>
    <div style={{ position: "absolute", left: 300, top: 160, transform: `rotate(${wob}deg)`, transformOrigin: "50% 100%", opacity: cl(u * 2) }}>
      <div style={{ width: 120, height: 120, margin: "0 auto", background: "linear-gradient(90deg,#3B8F5A,#7FD39C,#3B8F5A)", borderRadius: "20px 20px 0 0", opacity: 0.85 }} />
      <div style={{ position: "relative", width: 300, height: 600, borderRadius: "120px 120px 40px 40px", background: "linear-gradient(90deg, rgba(60,140,90,0.75), rgba(150,230,170,0.6) 40%, rgba(60,140,90,0.8))", boxShadow: "0 40px 60px rgba(0,0,0,0.45), inset 0 0 0 6px rgba(255,255,255,0.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420 + 60 * shk, background: "linear-gradient(180deg, rgba(150,40,40,0.85), rgba(110,20,20,0.95))" }} />
        {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i * 53) % 240, top: 600 - ((f * (2 + i % 3) + i * 70) % 420), width: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.7)", opacity: shk }} />)}
        <div style={{ position: "absolute", left: 40, top: 40, width: 40, height: 480, borderRadius: 20, background: "rgba(255,255,255,0.25)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 800, top: 260 }}><Lab txt="DON'T CUT IT" size={130} color={CREAM} u={u} /></div>
    <div style={{ position: "absolute", left: 800, top: 420, fontFamily: LAB, fontSize: 300, color: BRASS, lineHeight: 1, textShadow: "0 10px 30px rgba(0,0,0,0.5)", opacity: cl(u * 2) }}>{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</div>
    <div style={{ position: "absolute", left: 820, top: 760 }}><Hand txt="the juice settles back in" u={st} size={80} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)" }} /></div>
  </>);
};

// 27 · pizarra de arreglos: problema (sello) → causa/arreglo a mano; los ya dichos quedan arriba en chico
export const FixBoard: PP<{ done: [string, string][]; rows: { t: number; a: string; b: string }[] }> = ({ a, d, a0, done, rows }) => {
  const { f, at } = useK(a, a0);
  return shell(<Bg k="chalk" f={f} />, <>
    <div style={{ position: "absolute", left: 120, top: 70 }}><Lab txt="WHAT WENT WRONG · THE FIX" size={96} color={BRASS} u={sp(f, 0, 14, 120)} /></div>
    {done.map(([p, x], i) => <div key={"d" + i} style={{ position: "absolute", left: 140, top: 200 + i * 80, fontFamily: HND, fontWeight: 700, fontSize: 52, color: "rgba(246,241,228,0.55)" }}>✓ {p} — {x}</div>)}
    {rows.map((r, i) => { const u = sp(f, at(r.t), 12, 200); const top = 220 + done.length * 80 + i * 300; return <div key={i} style={{ position: "absolute", left: 140, top }}>
      <Stamp txt={r.a} u={u} color={PINK} rot={-3} size={100} style={{ background: "transparent" }} />
      <div style={{ marginTop: 26, marginLeft: 20 }}><Hand txt={"→ " + r.b} u={on(f, at(r.t) + 12, 24)} size={78} color="#F6F1E4" chalk /></div></div>; })}
  </>);
};

// 28 · escalera de plata: barras de billetes que crecen (164 vs 32) en papel de carnicería
export const MoneyLadder: PP<{ rows: { t: number; a: string; b: number }[] }> = ({ a, d, a0, rows }) => {
  const { f, at } = useK(a, a0);
  return shell(<Bg k="paper" f={f} />, <>
    <div style={{ position: "absolute", left: 140, top: 100 }}><Lab txt="WHAT THE STEAK COSTS" size={110} color={NAVY} u={sp(f, 0, 14, 120)} /></div>
    {rows.map((r, i) => { const u = sp(f, at(r.t) - 3, 14, 120); const g = ez((f - at(r.t) + 3) / 30); return <div key={i} style={{ position: "absolute", left: 160, top: 330 + i * 300 }}>
      <Lab txt={r.a} size={70} color={INK} u={u} />
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 14 }}>
        <div style={{ width: 1300 * (r.b / 164) * g, height: 120, borderRadius: 10, background: `repeating-linear-gradient(90deg, #5E8A5A 0 70px, #4E7A4B 70px 74px), linear-gradient(180deg,#7FA978,#4E7A4B)`, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }} />
        <Lab txt={`$${Math.round(r.b * g)}`} size={140} color={i ? NAVY : RED} u={u} /></div></div>; })}
  </>);
};

// 29 · la cuenta del chuck: ticket de balanza del local (renglones + total + pie)
export const ChuckMath: PP<{ rows: { t: number; a: string; b: string }[]; total: { t: number; b: string }; foot: { t: number; txt: string } }> = ({ a, d, a0, rows, total, foot }) => {
  const { f, at } = useK(a, a0);
  const tu = sp(f, at(total.t), 11, 200);
  return shell(<Bg k="green" f={f} />, <>
    <Card x={460} y={90} w={1000} h={900} u={sp(f, 0, 14, 120)} rot={1.5} bg="repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 4px), linear-gradient(180deg,#FBFAF5,#EFEDE4)">
      <div style={{ fontFamily: LAB, fontSize: 80, color: GRN, textAlign: "center", letterSpacing: 6 }}>MICKEY'S BUTCHER SHOP</div>
      <div style={{ fontFamily: LAB, fontSize: 40, color: INK, opacity: 0.55, textAlign: "center", letterSpacing: 5, marginBottom: 30 }}>DORCHESTER · BOSTON</div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: LAB, fontSize: 70, color: INK, borderBottom: "3px dashed rgba(0,0,0,0.2)", padding: "14px 0", opacity: cl(on(f, at(r.t) - 3, 6) * 2) }}><span>{r.a}</span><span>{r.b}</span></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 30, fontFamily: LAB, color: RED, opacity: cl(tu * 2), transform: `scale(${0.8 + 0.2 * tu})` }}><span style={{ fontSize: 80 }}>TOTAL</span><span style={{ fontSize: 200, lineHeight: 1 }}>{total.b}</span></div>
      <div style={{ marginTop: 26, textAlign: "center" }}><Hand txt={foot.txt} u={on(f, at(foot.t), 18)} size={76} color={NAVY} /></div>
    </Card>
  </>);
};

// 30 · copa de vino vs el ticket de $17: la copa dibujada en CSS con su precio, el ticket gana
export const VsWine: PP<{ tWine: number; tBack: number }> = ({ a, d, a0, tWine, tBack }) => {
  const { f, at } = useK(a, a0);
  const w = sp(f, at(tWine) - 3, 13, 140), b = on(f, at(tBack), 16);
  return shell(<Bg k="iron" f={f} />, <>
    <div style={{ position: "absolute", left: 300, top: 160, opacity: cl(w * 2), transform: `translateY(${(1 - w) * 60}px)` }}>
      <div style={{ width: 340, height: 340, borderRadius: "0 0 170px 170px", background: "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.08))", boxShadow: "inset 0 0 0 5px rgba(255,255,255,0.35)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: "linear-gradient(180deg,#7A1020,#3E0610)" }} /></div>
      <div style={{ width: 22, height: 260, margin: "0 auto", background: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5))" }} />
      <div style={{ width: 240, height: 22, margin: "0 auto", borderRadius: 11, background: "rgba(255,255,255,0.4)" }} />
      <div style={{ textAlign: "center", marginTop: 20 }}><Lab txt="1 GLASS DOWNTOWN" size={70} color={CREAM} /></div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 260 }}><Lab txt="$17" size={360} color={BRASS} u={sp(f, at(tWine) + 8, 12, 170)} /><Lab txt="STEAK FOR FOUR" size={90} color={CREAM} u={sp(f, at(tWine) + 14, 12, 170)} /></div>
    <div style={{ position: "absolute", left: 1000, top: 820 }}><Hand txt="…and the mailman came back" u={b} size={74} color={CREAM} /></div>
  </>);
};

// 31 · resumen: tira de papel de la balanza con los 7 trucos, se imprime de a uno y la tira sube
export const RecapTicket: PP<{ items: B[] }> = ({ a, d, a0, items }) => {
  const { f, at } = useK(a, a0);
  const n = items.filter((it) => f >= at(it.t) - 4).length;
  const shift = Math.max(0, n - 5) * 120;
  return shell(<Bg k="green" f={f} />, <>
    <div style={{ position: "absolute", left: 140, top: 110 }}><Lab txt="THE CHUCK EYE" size={120} color={BRASS} u={sp(f, 0, 14, 120)} /><Lab txt="7 TRICKS" size={90} color={CREAM} u={sp(f, 6, 14, 120)} /></div>
    <div style={{ position: "absolute", left: 760, top: 0, width: 1040, height: 1080, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 80 - shift, width: 1000, padding: "40px 50px", background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 4px), linear-gradient(180deg,#FBFAF5,#EFEDE4)", boxShadow: "0 40px 70px rgba(0,0,0,0.5)", minHeight: 1200 }}>
        {items.map((it, i) => { const u = sp(f, at(it.t) - 4, 13, 170); return f >= at(it.t) - 4 ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, height: 120, borderBottom: "3px dashed rgba(0,0,0,0.18)", opacity: cl(u * 2) }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: i === n - 1 ? RED : GRN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAB, fontSize: 56 }}>{i + 1}</div>
          <Hand txt={it.txt} u={on(f, at(it.t) - 4, 18)} size={60} color={INK} /></div> : null; })}
      </div>
    </div>
  </>);
};

// 32 · la tarea: calendario de la semana con WEEK / FRI / SAT y un círculo rojo de lápiz
export const Homework: PP<{ items: { t: number; d: string; txt: string }[] }> = ({ a, d, a0, items }) => {
  const { f, at } = useK(a, a0);
  return shell(<Bg k="kraft" f={f} />, <>
    <div style={{ position: "absolute", left: 140, top: 90 }}><Lab txt="YOUR HOMEWORK" size={120} color={NAVY} u={sp(f, 0, 14, 120)} /></div>
    {items.map((it, i) => { const u = sp(f, at(it.t) - 3, 13, 150); return <div key={i} style={{ position: "absolute", left: 140 + i * 580, top: 300, width: 520, height: 600, background: "linear-gradient(180deg,#FFFDF6,#EEE7D6)", borderRadius: 10,
      boxShadow: "0 30px 60px rgba(0,0,0,0.45)", opacity: cl(u * 2), transform: `perspective(1200px) rotateX(${(1 - u) * 40}deg) rotate(${[-2, 1, -1][i]}deg)`, transformOrigin: "top", overflow: "hidden" }}>
      <div style={{ height: 140, background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LAB, fontSize: 110, color: "#fff", letterSpacing: 6 }}>{it.d}</div>
      <div style={{ padding: "50px 36px", fontFamily: HND, fontWeight: 700, fontSize: 64, color: INK, lineHeight: 1.15, whiteSpace: "normal" }}>{it.txt}</div>
      <svg width={520} height={600} style={{ position: "absolute", left: 0, top: 0 }}><ellipse cx={260} cy={330} rx={220} ry={150} stroke={RED} strokeWidth={8} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(on(f, at(it.t) + 10, 14))} /></svg>
    </div>; })}
  </>);
};
