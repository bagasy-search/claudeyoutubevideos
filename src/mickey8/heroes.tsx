// ── HÉROES de mickey8 (Mickey's Butcher Shop, video 8: el pastel de carne que nunca sale seco). Claude, 16-oct-2026.
//    Juego PROPIO (no recicla mickey1-7): rebanada que brilla con el tenedor, comanda de diner $22, ficha de receta con cruces,
//    capítulo = separador del fichero de recetas, paquetes 2:1 en la balanza, la grasa del cerdo que se derrite primero, etiqueta 93→80/20,
//    tres carnes, la esponja seca que roba jugo, panade en bol, sartén con cebolla y reloj de 8 min, tres cucharas de salsa,
//    puño vs yemas (puck vs suelto), orden de la mezcla, prueba de la nuez, corte molde vs placa, cotas 9×5×2½, perilla deslizable 350,
//    sonda al centro hasta 160, taza de glaseado, timer de reposo, letrero de fieltro de problemas, recibo del carnicero, 4 platos vs 16,
//    domingo/lunes, repaso en fichas, tarea en nota.
//    PURO CSS (cero imágenes): texturas dibujadas con gradientes + perspectiva + sombras en capas + brillo que barre.
//    Tipografías: 2 familias (Alfa Slab One = rótulos de diner · Kalam = mano). Paleta del local: boiserie verde, rojo del delantal, crema, bronce.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { useT, sp, ez, eo, cl, P } from "../lkit/core";

const SLB = loadSlab("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const KAL = loadKalam("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const GRN = "#1F4A3A", RED = "#B3282D", CREAM = "#F5ECDB", BRASS = "#C9A04A", INK = "#221E1A", OK = "#2F7A4A", GLAZE = "#8E2416", LOAF = "#6B3A22", BLUE = "#2D4E7A";
type A0 = { a0?: number };
const start = (a: number, a0?: number) => (a0 ?? a);

// ── texturas del oficio (gradientes) ─────────────────────────────────────
const TX: Record<string, string> = {
  green: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 6px), radial-gradient(ellipse 40% 30% at 25% 20%, rgba(255,255,255,0.07), transparent 70%), linear-gradient(180deg, #2A5C49, #1B4033)",
  butcher: "repeating-linear-gradient(90deg, rgba(120,70,60,0.05) 0 1px, transparent 1px 9px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 13px), radial-gradient(ellipse 45% 35% at 30% 30%, rgba(255,255,255,0.35), transparent 70%), linear-gradient(170deg, #E9CFC4, #D7B2A5)",
  marble: "linear-gradient(115deg, transparent 0 30%, rgba(120,120,125,0.18) 30.5%, transparent 32% 58%, rgba(120,120,125,0.12) 58.4%, transparent 60%), linear-gradient(35deg, transparent 0 44%, rgba(140,140,145,0.16) 44.4%, transparent 46%), radial-gradient(ellipse 50% 40% at 70% 30%, rgba(255,255,255,0.7), transparent 70%), linear-gradient(160deg, #F2F1EE, #DCDAD5)",
  kraft: "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-67deg, rgba(255,240,210,0.07) 0 1px, transparent 1px 13px), radial-gradient(ellipse 35% 25% at 80% 70%, rgba(255,230,190,0.18), transparent 70%), linear-gradient(170deg, #CDA878, #B88D5C)",
  wood: "repeating-linear-gradient(92deg, rgba(60,30,10,0.18) 0 3px, transparent 3px 26px, rgba(255,220,170,0.08) 26px 31px, transparent 31px 57px), repeating-linear-gradient(88deg, rgba(60,30,10,0.10) 0 1px, transparent 1px 9px), linear-gradient(180deg, #8E5F37, #6E4628)",
  // mantel de diner a cuadros (dos franjas cruzadas semitransparentes)
  gingham: "repeating-linear-gradient(0deg, rgba(179,40,45,0.38) 0 46px, transparent 46px 92px), repeating-linear-gradient(90deg, rgba(179,40,45,0.38) 0 46px, transparent 46px 92px), linear-gradient(180deg, #F7F1E6, #E9E0CF)",
  felt: "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 3px, transparent 3px 22px), radial-gradient(ellipse 60% 40% at 40% 30%, rgba(255,255,255,0.06), transparent 70%), linear-gradient(180deg, #1D1B1A, #121110)",
  tile: "repeating-linear-gradient(0deg, #CFCAC0 0 4px, transparent 4px 120px), repeating-linear-gradient(90deg, #CFCAC0 0 4px, transparent 4px 120px), radial-gradient(ellipse 50% 40% at 30% 20%, rgba(255,255,255,0.8), transparent 70%), linear-gradient(180deg, #F7F5EF, #E4E0D6)",
};
const Bg: React.FC<{ k: keyof typeof TX; f: number; d: number; dark?: number }> = ({ k, f, d, dark = 0 }) => {
  const sweep = -30 + 160 * (f / Math.max(1, d));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: TX[k], transform: `scale(${1.05 + 0.03 * f / Math.max(1, d)})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,250,235,0.10) ${sweep}%, transparent ${sweep + 12}%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 35% 0%, rgba(255,226,180,0.18), rgba(255,226,180,0) 70%)" }} />
    {dark ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,${dark}) 100%)` }} /> : null}
  </AbsoluteFill>;
};
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-7 * Math.sin(f / 47)}px, ${5 * Math.cos(f / 53)}px) scale(${1.02 + 0.01 * Math.sin(f / 61)})` }}>{children}</AbsoluteFill>;
};
const shell = (bg: React.ReactNode, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{bg}<Drift>{c}</Drift></AbsoluteFill>;
const Slab: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties; sh?: boolean }> = ({ txt, size, color = CREAM, u = 1, style, sh = true }) => (
  <div style={{ fontFamily: SLB, fontSize: size, color, lineHeight: 1.05, letterSpacing: 1, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 26}px) scale(${0.9 + 0.1 * u})`,
    textShadow: sh ? "0 3px 0 rgba(0,0,0,0.22), 0 10px 26px rgba(0,0,0,0.4)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
// letra a mano que se "escribe" (clip-path que avanza)
const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties }> = ({ txt, u, size, color = INK, style }) => (
  <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.1, paddingRight: "0.3em", clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.06 - 6}% -25% -2%)`, ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 74, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={color || (no ? RED : OK)} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
// trazo a mano alrededor de algo (óvalo) o tachado
const Ring: React.FC<{ u: number; w: number; h: number; color?: string; strike?: boolean }> = ({ u, w, h, color = RED, strike }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path d={strike ? `M ${w * 0.02} ${h * 0.62} Q ${w * 0.5} ${h * 0.38} ${w * 0.98} ${h * 0.5}` : `M ${w * 0.55} ${h * 0.04} C ${w * 1.05} ${h * 0.02}, ${w * 1.04} ${h * 0.98}, ${w * 0.5} ${h * 0.97} C ${-w * 0.04} ${h * 0.96}, ${-w * 0.03} ${h * 0.05}, ${w * 0.6} ${h * 0.1}`}
      stroke={color} strokeWidth={strike ? 12 : 9} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 18px 30px rgba(0,0,0,0.35), 0 44px 80px rgba(0,0,0,0.30)";
// miga del pastel de carne (corte): moteado de gradientes
const CRUMB = "radial-gradient(circle at 20% 30%, rgba(255,210,180,0.35) 0 4px, transparent 5px), radial-gradient(circle at 70% 60%, rgba(70,30,15,0.35) 0 5px, transparent 6px), radial-gradient(circle at 45% 80%, rgba(255,220,190,0.3) 0 3px, transparent 4px), radial-gradient(circle at 85% 20%, rgba(60,25,10,0.3) 0 4px, transparent 5px)";
const sliceBg = (dry = 0) => `${CRUMB}, ${CRUMB.replace(/20%|70%|45%|85%/g, (m) => `${(parseInt(m) + 37) % 100}%`)}, linear-gradient(180deg, ${dry > 0.5 ? "#8C7F74" : "#A8674A"}, ${dry > 0.5 ? "#6E625A" : "#87462C"})`;
const sec = (a: number, f: number) => a + f / 30;

// ── un pastel de carne visto de costado (cuerpo + costra + glaseado opcional) ──
const Loaf: React.FC<{ x: number; y: number; w: number; h: number; glaze?: number; crust?: number; grey?: number; style?: React.CSSProperties }> = ({ x, y, w, h, glaze = 1, crust = 1, grey = 0, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: `${h * 0.42}px ${h * 0.42}px ${h * 0.14}px ${h * 0.14}px`,
      background: grey ? "linear-gradient(180deg, #9A8E84, #7C7068 70%, #6A5E57)" : `linear-gradient(180deg, ${crust ? "#7A4026" : "#C08066"}, ${crust ? LOAF : "#A8674A"} 60%, ${crust ? "#4A2414" : "#8A4E35"})`,
      boxShadow: "inset 0 -10px 18px rgba(0,0,0,0.35), inset 0 8px 14px rgba(255,200,160,0.15), 0 22px 30px rgba(0,0,0,0.45)" }} />
    {glaze > 0 ? <div style={{ position: "absolute", left: w * 0.03, right: w * 0.03, top: -4, height: h * 0.42 * cl(glaze), borderRadius: `${h * 0.42}px ${h * 0.42}px 40% 40%`,
      background: `radial-gradient(ellipse 30% 40% at 35% 25%, rgba(255,255,255,0.55), transparent 60%), linear-gradient(180deg, #C2321C, ${GLAZE})`, opacity: cl(glaze * 1.5),
      boxShadow: "inset 0 -6px 10px rgba(0,0,0,0.3)" }} /> : null}
  </div>
);

// 1 · apertura: la rebanada que brilla — tabla de madera, la rebanada en corte, el tenedor aprieta y suben gotas de jugo; "NOT JUST GROUND BEEF"
export const ShineSlice: P<{ tFork: number; tNot: number } & A0> = ({ a, d, tFork, tNot, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), pr = ez((f - at(tFork)) / 14), n = sp(f, at(tNot), 12, 150);
  const press = pr * (1 - cl((f - at(tFork) - 30) / 12));
  return shell(<Bg k="wood" f={f} d={d} dark={0.5} />, <>
    <div style={{ position: "absolute", left: 300, top: 300, width: 1320, height: 560, borderRadius: 40, background: TX.wood, boxShadow: SH, transform: `perspective(1600px) rotateX(${18 + (1 - u) * 20}deg) translateY(${(1 - u) * 200}px)` }}>
      {/* la rebanada: cara del corte mirando a cámara */}
      <div style={{ position: "absolute", left: 300, top: 40, width: 720, height: 420, transform: `scaleY(${1 - 0.06 * press})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "46% 46% 10% 10% / 38% 38% 8% 8%", background: sliceBg(), boxShadow: "inset 0 0 0 16px #5A2C17, inset 0 0 40px rgba(0,0,0,0.4), 0 30px 40px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 10, right: 10, top: -8, height: 110, borderRadius: "50% 50% 30% 30%", background: `radial-gradient(ellipse 30% 40% at 30% 30%, rgba(255,255,255,0.6), transparent 60%), linear-gradient(180deg, #C9341E, ${GLAZE})` }} />
        {/* el brillo del jugo barriendo la cara */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "46% 46% 10% 10% / 38% 38% 8% 8%", background: `linear-gradient(115deg, transparent ${-20 + 140 * cl(f / 90) - 10}%, rgba(255,240,220,0.35) ${-20 + 140 * cl(f / 90)}%, transparent ${-20 + 140 * cl(f / 90) + 10}%)` }} />
        {[...Array(9)].map((_, i) => { const t = cl((f - at(tFork) - 6 - i * 3) / 22); const x = 140 + (i * 61) % 460, yy = 250 + ((i * 37) % 110);
          return <div key={i} style={{ position: "absolute", left: x, top: yy - 60 * t, width: 22 + (i % 3) * 8, height: 26 + (i % 3) * 8, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: "radial-gradient(circle at 35% 30%, #fff, rgba(255,220,180,0.7) 40%, rgba(200,120,60,0.4))", opacity: t > 0 ? 0.9 * (1 - cl((t - 0.8) * 5)) + 0.1 : 0, transform: `scale(${0.4 + 0.6 * t})` }} />; })}
      </div>
      {/* tenedor: dorso apoyado arriba */}
      <div style={{ position: "absolute", left: 520, top: -190 + 120 * pr - 20 * (1 - u), width: 280, height: 210, transform: `rotate(-8deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 150, width: 280, height: 40, borderRadius: 20, background: "linear-gradient(180deg, #F2F2F2, #9A9A9A)", boxShadow: "0 10px 14px rgba(0,0,0,0.45)" }} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 62, top: 160, width: 22, height: 50, borderRadius: 10, background: "linear-gradient(90deg, #A8A8A8, #F4F4F4, #A0A0A0)" }} />)}
        <div style={{ position: "absolute", left: 120, top: -200, width: 40, height: 360, borderRadius: 20, background: "linear-gradient(90deg, #A8A8A8, #F4F4F4, #A0A0A0)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: cl(n * 2) }}>
      <Slab txt="THAT'S NOT JUST" size={70} color={CREAM} u={n} />
      <Slab txt="GROUND BEEF" size={130} color="#F7C9A8" u={n} />
    </div>
  </>);
};

// 2 · comanda de diner (bloc verde de "guest check") escrita a mano: MEATLOAF PLATE · 2 slices · potatoes · $22.00
export const DinerCheck: P<{ t22: number; tSl: number; tPot: number } & A0> = ({ a, d, t22, tSl, tPot, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), w1 = cl((f - at(start(a, a0)) - 8) / 24), w2 = cl((f - at(tSl)) / 22), w3 = cl((f - at(tPot)) / 22), t = sp(f, at(t22), 10, 170);
  return shell(<Bg k="gingham" f={f} d={d} dark={0.35} />, <>
    <div style={{ position: "absolute", left: 600, top: 70, width: 720, height: 940, transform: `rotate(${-3 + (1 - u) * 12}deg) translateY(${(1 - u) * 600}px)`, boxShadow: SH, borderRadius: 6,
      background: "repeating-linear-gradient(180deg, transparent 0 76px, rgba(47,122,74,0.55) 76px 79px), linear-gradient(180deg, #FBF9EE, #EFEBDA)" }}>
      <div style={{ height: 140, background: `linear-gradient(180deg, #3B8A5A, ${OK})`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px 6px 0 0" }}>
        <Slab txt="GUEST CHECK" size={68} color={CREAM} />
      </div>
      <div style={{ position: "absolute", right: 30, top: 160, fontFamily: SLB, fontSize: 30, color: "#C0392B" }}>№ 0417</div>
      <div style={{ position: "absolute", left: 60, top: 230 }}><Hand txt="1  Meatloaf plate" u={w1} size={66} color={BLUE} /></div>
      <div style={{ position: "absolute", left: 110, top: 316 }}><Hand txt="– 2 slices" u={w2} size={58} color={BLUE} /></div>
      <div style={{ position: "absolute", left: 110, top: 396 }}><Hand txt="– scoop of potatoes" u={w3} size={58} color={BLUE} /></div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 560, borderTop: "4px double rgba(47,122,74,0.7)" }} />
      <div style={{ position: "absolute", left: 60, top: 600, fontFamily: SLB, fontSize: 52, color: "#3E3A33" }}>TOTAL</div>
      <div style={{ position: "absolute", right: 60, top: 560, transform: `scale(${0.6 + 0.4 * t}) rotate(-4deg)`, opacity: cl(t * 2), transformOrigin: "100% 50%" }}>
        <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: 170, color: RED, lineHeight: 1 }}>$22</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", opacity: cl(t * 2) * 0.8 }}><Hand txt="downtown · thank you!" u={t} size={44} color="#6B6257" style={{ display: "inline-block" }} /></div>
    </div>
  </>);
};

// 3 · la receta que falló: ficha de fichero con 6 pasos; cada uno recibe una cruz roja cuando se nombra
export const WrongRecipe: P<{ title: string; items: { t: number; txt: string }[] } & A0> = ({ a, d, title, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="tile" f={f} d={d} dark={0.3} />, <>
    <div style={{ position: "absolute", left: 300, top: 100, width: 1320, height: 860, transform: `perspective(1800px) rotateX(${(1 - u) * 50}deg) rotate(-1.5deg)`, transformOrigin: "50% 100%", opacity: cl(u * 2), borderRadius: 10, boxShadow: SH,
      background: "repeating-linear-gradient(180deg, transparent 0 88px, rgba(70,110,170,0.35) 88px 90px), linear-gradient(180deg, #FFFDF6, #F2ECDD)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 86, height: 4, background: "rgba(200,60,60,0.6)" }} />
      <div style={{ position: "absolute", left: 50, top: 14 }}><Hand txt={title} u={cl((f - at(start(a, a0))) / 26)} size={60} color={BLUE} /></div>
      {items.map((it, i) => { const x = sp(f, at(it.t), 11, 180), row = 110 + i * 120;
        return <div key={i} style={{ position: "absolute", left: 70, top: row, width: 1180, height: 110, opacity: cl((f - at(start(a, a0)) - 6 - i * 3) / 10) }}>
          <div style={{ position: "absolute", left: 0, top: 18, fontFamily: KAL, fontWeight: 700, fontSize: 62, color: x > 0.3 ? "rgba(34,49,79,0.5)" : BLUE }}>{i + 1}. {it.txt}</div>
          <div style={{ position: "absolute", left: 40, top: 20, width: 40 + it.txt.length * 29, height: 80 }}><Ring u={x} w={40 + it.txt.length * 29} h={80} strike /></div>
          <div style={{ position: "absolute", right: 10, top: 10, transform: `scale(${0.5 + 0.5 * x})`, opacity: cl(x * 2) }}><Tick u={x} no size={82} /></div>
        </div>; })}
    </div>
  </>);
};

// 4 · capítulo: separador del fichero de recetas — caja de madera, la ficha-pestaña sube con el número y el título
export const Chapter: P<{ n: number; title: string; sub: string; tw: number } & A0> = ({ a, d, n, title, sub, tw, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110), up = sp(f, at(start(a, a0)) + 8, 12, 90), s = sp(f, at(tw) + 8, 13, 140);
  return shell(<Bg k="green" f={f} d={d} dark={0.45} />, <>
    {/* la caja (frente de madera) tapa la parte baja de la ficha */}
    <div style={{ position: "absolute", left: 360, top: 120 + (1 - up) * 520, width: 1200, height: 760, borderRadius: 16, boxShadow: SH,
      background: "repeating-linear-gradient(180deg, transparent 0 74px, rgba(70,110,170,0.28) 74px 76px), linear-gradient(180deg, #FFFDF6, #EFE8D6)" }}>
      {/* pestaña */}
      <div style={{ position: "absolute", left: 80 + ((n - 1) % 4) * 230, top: -90, width: 300, height: 100, borderRadius: "20px 20px 0 0", background: `linear-gradient(180deg, #D04039, ${RED})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 -4px 10px rgba(0,0,0,0.2)" }}>
        <div style={{ fontFamily: SLB, fontSize: 52, color: CREAM, letterSpacing: 3 }}>TRICK {n}</div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: SLB, fontSize: 300, lineHeight: 1, color: RED, opacity: 0.92, textShadow: "0 6px 0 rgba(0,0,0,0.12)" }}>{n}</div>
      <div style={{ position: "absolute", left: 330, top: 110, width: 800, opacity: cl(s * 2), transform: `translateX(${(1 - s) * 50}px)` }}>
        <div style={{ fontFamily: SLB, fontSize: title.length > 20 ? 78 : 96, lineHeight: 1.04, color: INK }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: 340, top: 360 }}><Hand txt={sub} u={cl((f - at(tw) - 20) / 24)} size={64} color={BLUE} /></div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 560, width: 1320, height: 560, borderRadius: "10px 10px 0 0", background: TX.wood, boxShadow: "0 -20px 40px rgba(0,0,0,0.45), inset 0 6px 0 rgba(255,220,170,0.25)" }}>
      <div style={{ position: "absolute", left: 560, top: 60, width: 200, height: 70, borderRadius: 10, background: "linear-gradient(180deg, #E8C877, #9C7A30)", boxShadow: "0 6px 10px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.5)" }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 16, height: 38, borderRadius: 4, background: "#F6EFD9", fontFamily: KAL, fontWeight: 700, fontSize: 26, color: INK, textAlign: "center", lineHeight: "38px" }}>meatloaf</div>
      </div>
    </div>
  </>);
};

// paquete de carnicería (papel blanco + hilo) con etiqueta escrita a mano
const Pack: React.FC<{ x: number; y: number; w: number; h: number; tag: string; tone: string; u: number }> = ({ x, y, w, h, tag, tone, u }) => (
  <div style={{ position: "absolute", left: x, top: y - (1 - u) * 300, width: w, height: h, opacity: cl(u * 2), transform: `rotate(${(1 - u) * -10}deg)` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "repeating-linear-gradient(35deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 12px), linear-gradient(170deg, #FFFFFF, #E9E4DA)", boxShadow: SH }} />
    <div style={{ position: "absolute", left: w / 2 - 3, top: 0, bottom: 0, width: 6, background: "repeating-linear-gradient(180deg, #E9E1D2 0 6px, #B8AE9C 6px 10px)" }} />
    <div style={{ position: "absolute", top: h / 2 - 3, left: 0, right: 0, height: 6, background: "repeating-linear-gradient(90deg, #E9E1D2 0 6px, #B8AE9C 6px 10px)" }} />
    <div style={{ position: "absolute", left: w * 0.06, top: h * 0.18, padding: "6px 14px", background: tone, borderRadius: 6, transform: "rotate(-4deg)", boxShadow: "0 4px 6px rgba(0,0,0,0.25)" }}>
      <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: Math.min(40, w / 10), color: INK, whiteSpace: "nowrap" }}>{tag}</div>
    </div>
  </div>
);

// 5 · 2 a 1: dos paquetes de chuck + uno de cerdo sobre el mostrador, la cuenta "2 : 1" y la regla "beef = flavor · pork = juice"
export const MeatRatio: P<{ tB: number; tP: number; tRule: number } & A0> = ({ a, d, tB, tP, tRule, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), b = sp(f, at(tB), 12, 140), b2 = sp(f, at(tB) + 6, 12, 140), p = sp(f, at(tP), 12, 140), r = sp(f, at(tRule), 13, 150);
  return shell(<Bg k="marble" f={f} d={d} dark={0.3} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Slab txt="THE OLD MEATLOAF MIX" size={74} color={GRN} u={u} sh={false} /></div>
    <Pack x={240} y={300} w={420} h={330} tag="CHUCK 80/20 · 1 lb" tone="#F3C6BE" u={b} />
    <Pack x={720} y={300} w={420} h={330} tag="CHUCK 80/20 · 1 lb" tone="#F3C6BE" u={b2} />
    <Pack x={1260} y={300} w={420} h={330} tag="GROUND PORK · 1 lb" tone="#F9E1D6" u={p} />
    <div style={{ position: "absolute", left: 1170, top: 380, fontFamily: SLB, fontSize: 120, color: RED, opacity: cl(p * 2) }}>+</div>
    <div style={{ position: "absolute", left: 240, top: 690, width: 1440, height: 26, borderRadius: 13, background: "rgba(0,0,0,0.08)", overflow: "hidden", opacity: cl(u * 2) }}>
      <div style={{ width: `${66.7 * ez(b)}%`, height: "100%", background: `linear-gradient(90deg, #9E3B2A, #C25A45)`, display: "inline-block" }} />
      <div style={{ width: `${33.3 * ez(p)}%`, height: "100%", background: "linear-gradient(90deg, #E6A79A, #F2C3B5)", display: "inline-block" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 120, opacity: cl(r * 2), transform: `translateY(${(1 - r) * 40}px)` }}>
      <div style={{ textAlign: "center" }}><Slab txt="BEEF" size={64} color="#9E3B2A" sh={false} /><Hand txt="gives the flavor" u={cl((f - at(tRule)) / 22)} size={58} color={INK} /></div>
      <div style={{ textAlign: "center" }}><Slab txt="PORK" size={64} color="#C66F5E" sh={false} /><Hand txt="gives the juice" u={cl((f - at(tRule) - 14) / 22)} size={58} color={INK} /></div>
    </div>
  </>);
};

// 6 · la grasa que se derrite: termómetro vertical que sube; el cubo de grasa de cerdo se funde ANTES que el de vaca
export const FatMelt: P<{ tH: number; tL: number } & A0> = ({ a, d, tH, tL, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), h = ez((f - at(tH)) / 90), mp = cl((h - 0.25) / 0.3), mb = 0.45 * cl((h - 0.7) / 0.3), l = sp(f, at(tL), 12, 150);
  const cube = (x: number, m: number, lbl: string, col: string) => <div style={{ position: "absolute", left: x, top: 330, width: 420, height: 520 }}>
    <div style={{ position: "absolute", left: 60, bottom: 120, width: 300, height: 300 * (1 - 0.82 * m), borderRadius: 18 + 60 * m, background: `linear-gradient(160deg, #FFFBF3, ${col})`,
      boxShadow: "inset -14px -14px 24px rgba(0,0,0,0.12), inset 10px 10px 18px rgba(255,255,255,0.8), 0 20px 30px rgba(0,0,0,0.25)" }} />
    <div style={{ position: "absolute", left: 60 - 80 * m, bottom: 100, width: 300 + 160 * m, height: 30 + 20 * m, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, rgba(255,240,190,${0.2 + 0.7 * m}), rgba(230,190,110,${0.6 * m}) 70%, transparent 72%)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center" }}><Slab txt={lbl} size={54} color={INK} sh={false} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: -10, textAlign: "center", opacity: cl(m * 3) }}><Hand txt={m > 0.6 ? "melted!" : "melting…"} u={m * 2} size={56} color={RED} style={{ display: "inline-block" }} /></div>
  </div>;
  return shell(<Bg k="tile" f={f} d={d} dark={0.3} />, <>
    {cube(330, mp, "PORK FAT", "#F4E4D4")}
    {cube(1170, mb, "BEEF FAT", "#F5EAD0")}
    {/* termómetro */}
    <div style={{ position: "absolute", left: 900, top: 120, width: 120, height: 820, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 60, height: 700, borderRadius: 30, background: "linear-gradient(90deg, #DADADA, #FFFFFF 40%, #C8C8C8)", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 46, bottom: 120, width: 28, height: 40 + 600 * h, borderRadius: 14, background: `linear-gradient(180deg, #E0402F, ${RED})` }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 120, height: 140, borderRadius: 60, background: `radial-gradient(circle at 35% 35%, #F06A55, ${RED} 60%, #7E1A1E)`, boxShadow: SH }} />
      {[0.2, 0.4, 0.6, 0.8].map((y) => <div key={y} style={{ position: "absolute", left: 92, bottom: 140 + 600 * y, width: 30, height: 5, background: "#7A746A" }} />)}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: cl(l * 2) }}><Slab txt="PORK FAT MELTS LOWER" size={72} color={GRN} u={l} sh={false} /></div>
  </>);
};

// 7 · etiqueta de la bandeja: 93/7 se tacha, aparece 80/20 en círculo y el sello "CHUCK"
export const LabelSwap: P<{ t80: number; t93: number; tNo: number } & A0> = ({ a, d, t80, t93, tNo, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), e = sp(f, at(t80), 12, 160), n = sp(f, at(t93), 12, 160), x = sp(f, at(tNo), 11, 180);
  const label = (x0: number, rot: number, big: string, small: string, uu: number, kids: React.ReactNode) => <div style={{ position: "absolute", left: x0, top: 230, width: 620, height: 600, transform: `rotate(${rot}deg) translateY(${(1 - uu) * 500}px)`, opacity: cl(uu * 2) }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "linear-gradient(180deg, #FFFFFF, #ECE8E0)", boxShadow: SH }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, borderRadius: "26px 26px 0 0", background: `linear-gradient(180deg, #CF3C36, ${RED})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Slab txt="GROUND BEEF" size={58} color={CREAM} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: SLB, fontSize: 190, color: INK, lineHeight: 1 }}>{big}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: SLB, fontSize: 46, color: "#6B6257" }}>{small}</div>
    {kids}
  </div>;
  return shell(<Bg k="butcher" f={f} d={d} dark={0.3} />, <>
    {label(220, -4, "93/7", "LEAN · LEAN · LEAN", Math.max(u, n), <>
      <div style={{ position: "absolute", left: 40, top: 200, width: 540, height: 160 }}><Ring u={x} w={540} h={160} strike /></div>
      <div style={{ position: "absolute", left: 120, top: 470, opacity: cl(x * 2) }}><Hand txt="for bolognese" u={x} size={60} color={RED} /></div>
    </>)}
    {label(1080, 3, "80/20", "GROUND CHUCK", e, <>
      <div style={{ position: "absolute", left: 50, top: 150, width: 520, height: 220 }}><Ring u={cl((f - at(t80) - 10) / 20)} w={520} h={220} color={OK} /></div>
      <div style={{ position: "absolute", left: 130, top: 470 }}><Hand txt="for meatloaf ✓" u={cl((f - at(t80) - 20) / 24)} size={60} color={OK} /></div>
    </>)}
  </>);
};

// 8 · tres carnes sobre papel de carnicería: vaca · cerdo · ternera, 1 lb cada una; la ternera con la etiqueta "optional · $$$"
export const ThreeMeats: P<{ tA: number; tV: number; tExp: number } & A0> = ({ a, d, tA, tV, tExp, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), s = [sp(f, at(tA), 12, 150), sp(f, at(tA) + 7, 12, 150), sp(f, at(tV), 12, 150)], ex = sp(f, at(tExp), 11, 170);
  const M = [["BEEF", "#A23A2A", "#C6604A"], ["PORK", "#E3A196", "#F3C7BA"], ["VEAL", "#E8BDB0", "#F7DCD2"]];
  return shell(<Bg k="kraft" f={f} d={d} dark={0.35} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}><Slab txt="THE OLD-TIME MIX" size={78} color={CREAM} u={u} /></div>
    {M.map(([n, c1, c2], i) => <div key={n} style={{ position: "absolute", left: 220 + i * 520, top: 300, width: 440, height: 560, opacity: cl(s[i] * 2), transform: `translateY(${(1 - s[i]) * 120}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 440, height: 320, borderRadius: 14, transform: "perspective(900px) rotateX(48deg)", background: TX.butcher, boxShadow: SH }} />
      {/* montículo de carne picada: gradiente radial + "hebras" */}
      <div style={{ position: "absolute", left: 70, top: 120, width: 300, height: 210, borderRadius: "50% 50% 44% 44% / 62% 62% 38% 38%",
        background: `repeating-radial-gradient(circle at 40% 40%, rgba(255,255,255,0.12) 0 3px, transparent 3px 9px), repeating-linear-gradient(60deg, rgba(0,0,0,0.08) 0 4px, transparent 4px 10px), radial-gradient(ellipse at 40% 30%, ${c2}, ${c1})`, boxShadow: "inset -10px -14px 20px rgba(0,0,0,0.25), 0 18px 20px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}><Slab txt={n} size={70} color={CREAM} sh /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center" }}><Hand txt="1 lb" u={s[i]} size={52} color="#FFF2DC" style={{ display: "inline-block" }} /></div>
    </div>)}
    <div style={{ position: "absolute", left: 1330, top: 250, transform: `rotate(8deg) scale(${0.6 + 0.4 * ex})`, opacity: cl(ex * 2), padding: "10px 26px", background: RED, borderRadius: 10, boxShadow: SH }}>
      <div style={{ fontFamily: SLB, fontSize: 46, color: CREAM }}>OPTIONAL · $$$</div>
    </div>
  </>);
};

// 9 · la esponja seca: miga seca dibujada como esponja; flechas de jugo que salen de la carne y entran a la miga; medidor "juice in the meat" que baja
export const DrySponge: P<{ tS: number; tSoak: number; tDry: number } & A0> = ({ a, d, tS, tSoak, tDry, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), s = sp(f, at(tS), 12, 150), k = ez((f - at(tSoak)) / 70), dr = sp(f, at(tDry), 12, 160);
  return shell(<Bg k="tile" f={f} d={d} dark={0.3} />, <>
    {/* bloque de carne */}
    <div style={{ position: "absolute", left: 200, top: 330, width: 520, height: 380, borderRadius: 40, background: sliceBg(k > 0.7 ? 1 : 0), boxShadow: SH, opacity: cl(u * 2), filter: `saturate(${1 - 0.6 * k})` }} />
    <div style={{ position: "absolute", left: 200, top: 740, width: 520, textAlign: "center" }}><Slab txt="THE MEAT" size={58} color={INK} sh={false} /></div>
    {/* esponja de miga seca */}
    <div style={{ position: "absolute", left: 1200, top: 360, width: 520, height: 320, borderRadius: 30, opacity: cl(s * 2), transform: `scale(${0.7 + 0.3 * s})`,
      background: `radial-gradient(circle at 20% 30%, rgba(120,80,30,0.45) 0 10px, transparent 11px), radial-gradient(circle at 60% 60%, rgba(120,80,30,0.45) 0 14px, transparent 15px), radial-gradient(circle at 80% 25%, rgba(120,80,30,0.4) 0 9px, transparent 10px), radial-gradient(circle at 35% 75%, rgba(120,80,30,0.4) 0 12px, transparent 13px), linear-gradient(170deg, ${k > 0.5 ? "#C69A5E" : "#E9C98E"}, ${k > 0.5 ? "#A97C44" : "#D3AE6E"})`, boxShadow: SH }} />
    <div style={{ position: "absolute", left: 1200, top: 740, width: 520, textAlign: "center" }}><Slab txt="DRY CRUMBS" size={58} color={INK} sh={false} /></div>
    {/* gotas que viajan */}
    {[...Array(7)].map((_, i) => { const t = cl(k * 1.6 - i * 0.12); const x = 720 + 480 * ez(t), y = 470 + i * 18 - Math.sin(t * Math.PI) * 120;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 34, height: 44, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #fff, #E4A877 50%, #B5622E)", opacity: t > 0 && t < 1 ? 1 : 0 }} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Slab txt="A SPONGE THAT'S ALREADY DRY" size={66} color={GRN} u={s} sh={false} /></div>
    <div style={{ position: "absolute", left: 640, top: 860, width: 640, opacity: cl(dr * 2) }}>
      <div style={{ fontFamily: SLB, fontSize: 34, color: INK, textAlign: "center", marginBottom: 10 }}>JUICE LEFT IN THE MEAT</div>
      <div style={{ height: 40, borderRadius: 20, background: "rgba(0,0,0,0.12)", overflow: "hidden" }}><div style={{ width: `${100 - 70 * k}%`, height: "100%", background: `linear-gradient(90deg, ${RED}, #E0705E)` }} /></div>
    </div>
  </>);
};

// 10 · panade: bol visto desde arriba (pan blanco en trozos → la leche lo cubre → pasta), con la receta en la ficha al costado
export const Panade: P<{ lines: { t: number; txt: string }[]; tMilk: number; tPaste: number } & A0> = ({ a, d, lines, tMilk, tPaste, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), m = ez((f - at(tMilk)) / 40), p = ez((f - at(tPaste)) / 40);
  return shell(<Bg k="wood" f={f} d={d} dark={0.4} />, <>
    <div style={{ position: "absolute", left: 160, top: 160, width: 760, height: 760, borderRadius: 380, transform: `scale(${0.7 + 0.3 * u})`, opacity: cl(u * 2),
      background: "radial-gradient(circle at 50% 50%, #F4F1EA 0 54%, #D9D3C6 62%, #FFFFFF 66%, #C8C2B4 72%, #A9A397 74%)", boxShadow: "0 40px 70px rgba(0,0,0,0.55)" }}>
      {[...Array(14)].map((_, i) => { const ang = i * 2.399, r = 70 + (i % 5) * 42; return <div key={i} style={{ position: "absolute", left: 380 + Math.cos(ang) * r - 50, top: 380 + Math.sin(ang) * r - 40, width: 100 - (i % 3) * 14, height: 80 - (i % 4) * 10,
        borderRadius: `${30 + i % 4 * 6}% ${50 - i % 3 * 8}% ${40}% ${35}%`, background: "linear-gradient(160deg, #FFFDF8, #EDE5D3)", boxShadow: "0 4px 8px rgba(0,0,0,0.18)", transform: `rotate(${i * 37}deg) scale(${1 - 0.8 * p})`, opacity: 1 - p }} />; })}
      <div style={{ position: "absolute", left: 380 - 280 * m, top: 380 - 280 * m, width: 560 * m, height: 560 * m, borderRadius: 300, background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95), rgba(246,242,232,${0.55 + 0.4 * p}) 60%, rgba(236,228,210,${0.6 + 0.4 * p}))`, opacity: 0.85 }} />
      {p > 0 ? <div style={{ position: "absolute", left: 120, top: 120, width: 520, height: 520, borderRadius: 260, opacity: p, background: "repeating-radial-gradient(circle at 45% 45%, rgba(210,195,165,0.35) 0 6px, transparent 6px 15px), radial-gradient(circle, #F2EADA, #E3D7BF)" }} /> : null}
    </div>
    <div style={{ position: "absolute", left: 1040, top: 150, width: 740, height: 780, borderRadius: 10, boxShadow: SH, transform: `rotate(2deg) translateX(${(1 - u) * 400}px)`,
      background: "repeating-linear-gradient(180deg, transparent 0 96px, rgba(70,110,170,0.3) 96px 98px), linear-gradient(180deg, #FFFDF6, #F2ECDD)" }}>
      <div style={{ position: "absolute", left: 40, top: 20 }}><Slab txt="PANADE" size={78} color={RED} sh={false} /></div>
      {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 50, top: 130 + i * 98 }}><Hand txt={l.txt} u={cl((f - at(l.t)) / 22)} size={54} color={BLUE} /></div>)}
    </div>
  </>);
};

// 11 · la cebolla: sartén desde arriba, los cubitos pasan de blanco a dorado mientras un reloj cuenta 0→8 min; "+ garlic, last minute"
export const OnionPan: P<{ t8: number; tGold: number; tGar: number; tCool: number } & A0> = ({ a, d, t8, tGold, tGar, tCool, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), g = ez((f - at(t8)) / Math.max(30, at(tGold) - at(t8) + 30)), gr = sp(f, at(tGar), 12, 160), co = sp(f, at(tCool), 12, 160);
  const mins = Math.min(8, Math.floor(g * 8 + 0.0001));
  const col = (i: number) => { const k = cl(g * 1.15 - (i % 5) * 0.03); return `rgb(${248 - 20 * k}, ${244 - 70 * k}, ${232 - 150 * k})`; };
  return shell(<Bg k="tile" f={f} d={d} dark={0.4} />, <>
    <div style={{ position: "absolute", left: 180, top: 140, width: 800, height: 800, borderRadius: 400, transform: `scale(${0.7 + 0.3 * u})`, opacity: cl(u * 2),
      background: "radial-gradient(circle, #2A2826 0 58%, #1A1918 64%, #3C3A37 67%, #111 70%)", boxShadow: "0 40px 70px rgba(0,0,0,0.6)" }}>
      <div style={{ position: "absolute", left: 760, top: 370, width: 420, height: 60, borderRadius: 20, background: "linear-gradient(180deg, #333, #111)" }} />
      {[...Array(46)].map((_, i) => { const ang = i * 2.399, r = 30 + ((i * 53) % 270); return <div key={i} style={{ position: "absolute", left: 400 + Math.cos(ang) * r - 14, top: 400 + Math.sin(ang) * r - 14, width: 30, height: 26, borderRadius: 6, background: col(i), opacity: 0.92, transform: `rotate(${i * 29}deg)`, boxShadow: "0 2px 3px rgba(0,0,0,0.4)" }} />; })}
      {gr > 0 ? [...Array(10)].map((_, i) => { const ang = i * 1.7, r = 60 + (i * 41) % 200; return <div key={"g" + i} style={{ position: "absolute", left: 400 + Math.cos(ang) * r, top: 400 + Math.sin(ang) * r - (1 - gr) * 200, width: 16, height: 14, borderRadius: 4, background: "#FFF7E2", opacity: cl(gr * 2) }} />; }) : null}
      <div style={{ position: "absolute", left: 320, top: 360, width: 160, height: 60, borderRadius: 30, background: "radial-gradient(ellipse, rgba(255,240,170,0.8), rgba(240,200,100,0.0) 70%)", opacity: 1 - g }} />
    </div>
    {/* reloj de cocina */}
    <div style={{ position: "absolute", left: 1180, top: 160, width: 520, height: 520, borderRadius: 260, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E8E3D8 70%, #C9C2B2)", boxShadow: SH, opacity: cl(u * 2) }}>
      {[...Array(8)].map((_, i) => <div key={i} style={{ position: "absolute", left: 250, top: 30, width: 20, height: 50, transformOrigin: "10px 230px", transform: `rotate(${i * 45}deg)`, background: i < mins ? RED : "#B9B2A4", borderRadius: 4 }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontFamily: SLB, fontSize: 150, color: INK, lineHeight: 1 }}>{mins}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", fontFamily: SLB, fontSize: 40, color: "#6B6257" }}>MIN · MEDIUM</div>
    </div>
    <div style={{ position: "absolute", left: 1150, top: 740, opacity: cl(gr * 2) }}><Hand txt="+ 2 garlic cloves, last minute" u={gr} size={56} color={INK} /></div>
    <div style={{ position: "absolute", left: 1150, top: 820, opacity: cl(co * 2) }}><Hand txt="cool it before the meat!" u={co} size={56} color={RED} /></div>
  </>);
};

// 12 · tres cucharas de salsa que caen en la sartén: ketchup · Worcestershire · mustard + "30 seconds"
export const SauceSpoons: P<{ items: { t: number; txt: string; col: string }[]; t30: number } & A0> = ({ a, d, items, t30, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), s30 = sp(f, at(t30), 12, 160);
  return shell(<Bg k="green" f={f} d={d} dark={0.45} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Slab txt="INTO THE WARM ONION" size={70} color={CREAM} u={u} /></div>
    {items.map((it, i) => { const s = sp(f, at(it.t), 12, 140), x = 260 + i * 500;
      return <div key={i} style={{ position: "absolute", left: x, top: 220, width: 420, height: 700, opacity: cl(s * 2), transform: `translateY(${(1 - s) * -260}px)` }}>
        {/* cuchara de metal */}
        <div style={{ position: "absolute", left: 90, top: 60, width: 240, height: 170, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #FFFFFF, #B9B9B9 60%, #7C7C7C)", boxShadow: SH }}>
          <div style={{ position: "absolute", left: 22, top: 16, width: 196, height: 130, borderRadius: "50%", background: `radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.6), ${it.col} 45%)` }} />
        </div>
        <div style={{ position: "absolute", left: 196, top: 220, width: 28, height: 260, borderRadius: 14, background: "linear-gradient(90deg, #8A8A8A, #F2F2F2, #8A8A8A)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center" }}><Hand txt={it.txt} u={cl((f - at(it.t) - 6) / 22)} size={58} color={CREAM} style={{ display: "inline-block", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }} /></div>
      </div>; })}
    <div style={{ position: "absolute", left: 760, top: 860, width: 400, height: 120, borderRadius: 60, background: `linear-gradient(180deg, #D04039, ${RED})`, display: "flex", alignItems: "center", justifyContent: "center", opacity: cl(s30 * 2), transform: `scale(${0.6 + 0.4 * s30})`, boxShadow: SH }}>
      <Slab txt="STIR 30 SEC" size={56} color={CREAM} />
    </div>
  </>);
};

// 13 · puño vs yemas: pantalla partida; a la izquierda 5 min de apretar → "disco de hockey" apretado; a la derecha 1 min con los dedos → suelto
export const FistVsFinger: P<{ tL: number; tR: number; tPuck: number } & A0> = ({ a, d, tL, tR, tPuck, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), l = sp(f, at(tL), 12, 150), r = sp(f, at(tR), 12, 150), pk = sp(f, at(tPuck), 11, 170);
  const bounce = Math.abs(Math.sin((f - at(tPuck)) / 6)) * 30 * (1 - cl((f - at(tPuck)) / 60));
  return shell(<Bg k="marble" f={f} d={d} dark={0.3} />, <>
    <div style={{ position: "absolute", left: 958, top: 60, width: 4, height: 960, background: "rgba(0,0,0,0.25)" }} />
    <div style={{ position: "absolute", left: 0, width: 960, top: 90, textAlign: "center", opacity: cl(l * 2) }}><Slab txt="FISTS · 5 MIN" size={72} color={RED} sh={false} u={l} /></div>
    <div style={{ position: "absolute", left: 960, width: 960, top: 90, textAlign: "center", opacity: cl(r * 2) }}><Slab txt="FINGERTIPS · 1 MIN" size={72} color={OK} sh={false} u={r} /></div>
    {/* izquierda: el disco */}
    <div style={{ position: "absolute", left: 230, top: 430 - bounce, width: 500, height: 200, opacity: cl(Math.max(l, u) * 2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(180deg, #8C5A44, #5E3826)", boxShadow: "inset 0 -20px 30px rgba(0,0,0,0.4), inset 0 14px 20px rgba(255,255,255,0.15), 0 30px 40px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 40%, #A06A52, #6E4230)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, width: 960, top: 720, textAlign: "center", opacity: cl(pk * 2) }}><Hand txt="tight · rubbery · springy" u={pk} size={60} color={RED} style={{ display: "inline-block" }} /></div>
    {/* derecha: mezcla suelta (montículo con migas que se levantan) */}
    <div style={{ position: "absolute", left: 1180, top: 380, width: 520, height: 300, opacity: cl(r * 2) }}>
      {[...Array(28)].map((_, i) => { const x = 40 + (i * 67) % 440, y = 120 + ((i * 29) % 140) - Math.abs(Math.sin((f + i * 9) / 14)) * 26; return <div key={i} style={{ position: "absolute", left: x, top: y, width: 60 + (i % 3) * 12, height: 46 + (i % 4) * 8,
        borderRadius: "45% 55% 50% 40%", background: i % 4 === 0 ? "#F1E6D2" : i % 3 === 0 ? "#E6A396" : "#B5513C", boxShadow: "0 6px 8px rgba(0,0,0,0.3)" }} />; })}
    </div>
    <div style={{ position: "absolute", left: 960, width: 960, top: 720, textAlign: "center", opacity: cl(r * 2) }}><Hand txt="loose is juicy" u={cl((f - at(tR) - 10) / 24)} size={66} color={OK} style={{ display: "inline-block" }} /></div>
  </>);
};

// 14 · el orden de la mezcla: tarjeta numerada; la carne recién entra al final (sello "THEN THE MEAT")
export const MixOrder: P<{ items: { t: number; txt: string }[]; tMeat: number } & A0> = ({ a, d, items, tMeat, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), m = sp(f, at(tMeat), 11, 170);
  const s0 = sec(a, f); let cur = -1; items.forEach((it, i) => { if (s0 >= it.t - 0.1) cur = i; });
  return shell(<Bg k="kraft" f={f} d={d} dark={0.4} />, <>
    <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 940, borderRadius: 12, boxShadow: SH, transform: `rotate(-1deg) translateY(${(1 - u) * 600}px)`,
      background: "repeating-linear-gradient(180deg, transparent 0 104px, rgba(70,110,170,0.28) 104px 106px), linear-gradient(180deg, #FFFDF6, #F2ECDD)" }}>
      <div style={{ position: "absolute", left: 60, top: 18 }}><Slab txt="IN THE BOWL, IN THIS ORDER" size={58} color={RED} sh={false} /></div>
      {items.map((it, i) => { const s = sp(f, at(it.t), 12, 170), on = i === cur;
        return <div key={i} style={{ position: "absolute", left: 60, top: 125 + i * 106, display: "flex", alignItems: "center", gap: 26, opacity: cl(s * 2), transform: `translateX(${(1 - s) * -60}px)` }}>
          <div style={{ width: 76, height: 76, borderRadius: 38, background: on ? RED : "#E5DCCB", color: on ? CREAM : INK, fontFamily: SLB, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.25)" }}>{i + 1}</div>
          <Hand txt={it.txt} u={cl((f - at(it.t)) / 20)} size={on ? 64 : 58} color={on ? INK : BLUE} />
          {i < cur ? <Tick u={1} size={56} /> : null}
        </div>; })}
      <div style={{ position: "absolute", right: 60, bottom: 50, transform: `rotate(-8deg) scale(${1.5 - 0.5 * m})`, opacity: cl(m * 2), border: `8px solid ${RED}`, borderRadius: 14, padding: "8px 26px" }}>
        <Slab txt="THEN THE MEAT" size={62} color={RED} sh={false} />
      </div>
    </div>
  </>);
};

// 15 · la prueba de la nuez: bolita aplanada en una sartén chica, gira 1 min por lado, chispas de grasa, y la pregunta "more salt?"
export const WalnutTest: P<{ tFry: number; tTaste: number; tFix: number } & A0> = ({ a, d, tFry, tTaste, tFix, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), fr = cl((f - at(tFry)) / 50), flip = ez((f - at(tFry) - 30) / 14), ta = sp(f, at(tTaste), 12, 160), fx = sp(f, at(tFix), 12, 160);
  return shell(<Bg k="tile" f={f} d={d} dark={0.4} />, <>
    <div style={{ position: "absolute", left: 300, top: 220, width: 640, height: 640, borderRadius: 320, background: "radial-gradient(circle, #2A2826 0 58%, #1A1918 64%, #3C3A37 67%, #111 70%)", boxShadow: "0 40px 70px rgba(0,0,0,0.6)", transform: `scale(${0.7 + 0.3 * u})` }}>
      <div style={{ position: "absolute", left: 600, top: 290, width: 360, height: 56, borderRadius: 20, background: "linear-gradient(180deg, #333, #111)" }} />
      <div style={{ position: "absolute", left: 230, top: 250, width: 180, height: 150, borderRadius: "50%", transform: `rotateX(${flip * 180}deg)`,
        background: `radial-gradient(ellipse at 40% 35%, ${fr > 0.5 ? "#9A5A36" : "#D98C76"}, ${fr > 0.5 ? "#5B2E17" : "#B5604A"})`, boxShadow: "0 8px 12px rgba(0,0,0,0.6), 0 0 0 6px rgba(255,220,150,0.18)" }} />
      {[...Array(8)].map((_, i) => { const t = ((f + i * 7) % 24) / 24; return <div key={i} style={{ position: "absolute", left: 320 + Math.cos(i) * (110 + 60 * t), top: 320 + Math.sin(i) * (90 + 60 * t), width: 8, height: 8, borderRadius: 4, background: "#FFE7A8", opacity: fr > 0 ? 1 - t : 0 }} />; })}
    </div>
    <div style={{ position: "absolute", left: 1060, top: 250, width: 640 }}>
      <Slab txt="SIZE OF A WALNUT" size={66} color={CREAM} u={u} />
      <div style={{ marginTop: 26 }}><Hand txt="1 minute each side" u={cl((f - at(tFry)) / 22)} size={64} color="#FFE2B8" style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
      <div style={{ marginTop: 40, opacity: cl(ta * 2), transform: `scale(${0.8 + 0.2 * ta})`, transformOrigin: "0 50%" }}><Slab txt="TASTE IT." size={110} color="#F7C9A8" /></div>
      <div style={{ marginTop: 20, opacity: cl(fx * 2) }}><Hand txt="more salt? more pepper?" u={fx} size={60} color={CREAM} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
    </div>
  </>);
};

// 16 · corte transversal: molde (la grasa sube y "hierve" los costados) vs placa (la grasa se escurre, costra alrededor)
export const PanVsSheet: P<{ tPan: number; tBoil: number; tSheet?: number } & A0> = ({ a, d, tPan, tBoil, tSheet, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), g = ez((f - at(tPan)) / 70), b = cl((f - at(tBoil)) / 20), sh = tSheet != null ? sp(f, at(tSheet), 12, 140) : 0;
  return shell(<Bg k="green" f={f} d={d} dark={0.45} />, <>
    {/* molde */}
    <div style={{ position: "absolute", left: 180 + (tSheet != null ? 0 : 340), top: 300, width: 720, height: 460, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 200}px)` }}>
      <Loaf x={110} y={60} w={500} h={260} glaze={0} grey={g > 0.6 ? 1 : 0} />
      <div style={{ position: "absolute", left: 90, top: 300 - 200 * g, width: 540, height: 40 + 200 * g, background: `linear-gradient(180deg, rgba(220,190,120,0.85), rgba(150,120,70,0.9))`, borderRadius: "0 0 10px 10px" }}>
        {b > 0 ? [...Array(10)].map((_, i) => { const t = ((f + i * 5) % 18) / 18; return <div key={i} style={{ position: "absolute", left: 20 + i * 52, top: 10 + (1 - t) * 60, width: 20, height: 20, borderRadius: 10, border: "3px solid rgba(255,250,220,0.8)", opacity: (1 - t) * b }} />; }) : null}
      </div>
      <div style={{ position: "absolute", left: 70, top: 20, width: 580, height: 340, border: "18px solid #9C9C9C", borderTop: "none", borderRadius: "0 0 26px 26px", boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.3), 0 26px 30px rgba(0,0,0,0.5)", borderColor: "#B7B7B7 #8E8E8E #7A7A7A #A8A8A8" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}><Slab txt="LOAF PAN" size={64} color={CREAM} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: -120, textAlign: "center", opacity: cl(b * 2) }}><Hand txt="the sides boil in grease" u={b} size={60} color="#FFD7A0" style={{ display: "inline-block", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
    </div>
    {tSheet != null ? <div style={{ position: "absolute", left: 1040, top: 300, width: 720, height: 460, opacity: cl(sh * 2), transform: `translateX(${(1 - sh) * 300}px)` }}>
      <Loaf x={110} y={80} w={500} h={240} glaze={0} />
      <div style={{ position: "absolute", left: 20, top: 320, width: 680, height: 22, borderRadius: 4, background: "linear-gradient(180deg, #E8E8E8, #9A9A9A)", boxShadow: "0 20px 26px rgba(0,0,0,0.5)" }} />
      {[...Array(6)].map((_, i) => { const t = ((f + i * 11) % 40) / 40; const side = i % 2 ? 1 : -1; return <div key={i} style={{ position: "absolute", left: 360 + side * (250 + 110 * t), top: 300, width: 40, height: 14, borderRadius: 7, background: "rgba(230,200,120,0.85)", opacity: 1 - t }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}><Slab txt="SHEET PAN" size={64} color="#BFE6C9" /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: -120, textAlign: "center" }}><Hand txt="crust on every side" u={cl((f - at(tSheet!) - 10) / 24)} size={60} color="#CFF2D8" style={{ display: "inline-block", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
    </div> : null}
  </>);
};

// 17 · las cotas del pan de carne formado a mano: perspectiva 3D con líneas de cota 9" · 5" · 2½"
export const LoafDims: P<{ tL: number; tW: number; tH: number } & A0> = ({ a, d, tL, tW, tH, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), l = cl((f - at(tL)) / 18), w = cl((f - at(tW)) / 18), h = cl((f - at(tH)) / 18);
  const dim = (u0: number, txt: string, style: React.CSSProperties, vert = false) => <div style={{ position: "absolute", ...style }}>
    <div style={{ position: "absolute", left: 0, top: vert ? 0 : 20, width: vert ? 6 : `${100 * eo(u0)}%`, height: vert ? `${100 * eo(u0)}%` : 6, background: BRASS }} />
    <div style={{ position: "absolute", left: vert ? 30 : "40%", top: vert ? "35%" : -70, opacity: cl(u0 * 2), fontFamily: SLB, fontSize: 70, color: CREAM, textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>{txt}</div>
  </div>;
  return shell(<Bg k="green" f={f} d={d} dark={0.45} />, <>
    <div style={{ position: "absolute", left: 360, top: 280, width: 1200, height: 600, transform: `perspective(1600px) rotateX(${40 + (1 - u) * 30}deg) rotateZ(-6deg)`, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 600, borderRadius: 14, background: "linear-gradient(135deg, #F3F3F1, #B9B9B6 50%, #E6E6E3)", boxShadow: "0 40px 60px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 230, top: 150, width: 740, height: 300, borderRadius: 150, background: "radial-gradient(ellipse at 40% 35%, #DA8F79, #B5604A 70%, #8E4430)", boxShadow: "0 30px 30px rgba(0,0,0,0.45), inset 0 -16px 20px rgba(0,0,0,0.25)" }} />
    </div>
    {dim(l, '9"', { left: 470, top: 830, width: 900, height: 40 })}
    {dim(w, '5"', { left: 1460, top: 360, width: 40, height: 380 }, true)}
    {dim(h, '2½"', { left: 380, top: 420, width: 40, height: 220 }, true)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Slab txt="SHAPED BY HAND · WET HANDS" size={64} color={CREAM} u={u} /></div>
  </>);
};

// 18 · el horno: perilla grande de esmalte que va a 400 (tachado) y vuelve a 350 con una marca de bronce
export const OvenKnob: P<{ t350: number; t400: number } & A0> = ({ a, d, t350, t400, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), k1 = ez((f - at(t350)) / 18), k2 = ez((f - at(t400)) / 16), back = ez((f - at(t400) - 30) / 16);
  const deg = -120 + 200 * k1 + 40 * k2 * (1 - back);
  const MARK: [number, string][] = [[-120, "OFF"], [-60, "250"], [0, "300"], [40, "325"], [80, "350"], [120, "400"], [160, "450"]];
  return shell(<Bg k="tile" f={f} d={d} dark={0.4} />, <>
    <div style={{ position: "absolute", left: 560, top: 140, width: 800, height: 800, borderRadius: 400, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #EAE6DC 60%, #C9C2B2)", boxShadow: SH, transform: `scale(${0.8 + 0.2 * u})` }}>
      {MARK.map(([m, l]) => <div key={l} style={{ position: "absolute", left: 340, top: 340, width: 120, height: 120, transform: `rotate(${m}deg) translateY(-320px) rotate(${-m}deg)`, textAlign: "center",
        fontFamily: SLB, fontSize: l === "350" ? 56 : 44, color: l === "350" ? RED : l === "400" ? "#8A8478" : "#5A544A", lineHeight: "120px" }}>{l}
        {l === "400" ? <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 120 }}><Ring u={cl((f - at(t400) - 18) / 14)} w={120} h={120} strike /></div> : null}</div>)}
      <div style={{ position: "absolute", left: 200, top: 200, width: 400, height: 400, borderRadius: 200, background: "radial-gradient(circle at 35% 30%, #FFFFFF, #CFCFCF 55%, #8A8A8A)", boxShadow: "0 18px 30px rgba(0,0,0,0.45)", transform: `rotate(${deg}deg)` }}>
        <div style={{ position: "absolute", left: 175, top: 10, width: 50, height: 190, borderRadius: 25, background: "linear-gradient(90deg, #3A3835, #1E1C1A)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 120, top: 420, opacity: cl(k1 * 2) }}><Slab txt="350°F" size={150} color={RED} sh={false} u={k1} /></div>
    <div style={{ position: "absolute", left: 1440, top: 440, opacity: cl(back * 2) }}><Hand txt="not 400" u={back} size={86} color={INK} /></div>
  </>);
};

// 19 · la sonda: corte del pan de carne, el termómetro entra por el costado hasta el centro; el número sube y se detiene en 160 (o se pasa a 180)
export const ProbeTemp: P<{ tIn: number; t160: number; over?: number; tOver?: number } & A0> = ({ a, d, tIn, t160, over, tOver, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), pin = ez((f - at(tIn)) / 20), r = ez((f - at(tIn) - 10) / Math.max(20, at(t160) - at(tIn))), ov = tOver != null ? ez((f - at(tOver)) / 30) : 0;
  const temp = Math.round(40 + 120 * r + ((over ?? 160) - 160) * ov), hot = temp > 162;
  return shell(<Bg k="wood" f={f} d={d} dark={0.45} />, <>
    <div style={{ position: "absolute", left: 180, top: 360, width: 1000, height: 440, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "48% 48% 10% 10% / 40% 40% 8% 8%", background: sliceBg(hot ? 1 : 0), boxShadow: "inset 0 0 0 18px #5A2C17, 0 30px 40px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 470, top: 190, width: 60, height: 60, borderRadius: 30, border: "5px dashed rgba(255,255,255,0.8)" }} />
    </div>
    {/* la sonda horizontal */}
    <div style={{ position: "absolute", left: 1180 - 520 * pin, top: 570, width: 640, height: 14, borderRadius: 7, background: "linear-gradient(180deg, #F5F5F5, #8E8E8E)" }} />
    <div style={{ position: "absolute", left: 1700 - 520 * pin, top: 440, width: 260, height: 260, borderRadius: 130, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #DDD8CC 70%, #9E978A)", boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: SLB, fontSize: 92, color: hot ? RED : temp >= 160 ? OK : INK }}>{temp}°</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", opacity: cl((r - 0.95) * 20) * (1 - ov) }}><Slab txt="160°F IN THE CENTER = DONE" size={72} color="#CFF2D8" /></div>
    {tOver != null ? <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", opacity: cl(ov * 2) }}><Slab txt="PAST 160 = JUICE IN THE PAN" size={72} color="#FFB4A0" /></div> : null}
    <div style={{ position: "absolute", left: 260, top: 860, opacity: cl(pin * 2) }}><Hand txt="from the side, to the very center" u={pin} size={56} color={CREAM} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
  </>);
};

// 20 · la taza del glaseado: tres ingredientes que se escriben, la taza se llena en capas, y la regla "at 145° → glaze → back in to 160°"
export const GlazeCup: P<{ lines: { t: number; txt: string }[]; t145: number; t160: number } & A0> = ({ a, d, lines, t145, t160, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), fill = cl((sec(a, f) - lines[0].t) / Math.max(1, lines[lines.length - 1].t - lines[0].t + 1.5)), s1 = sp(f, at(t145), 12, 160), s2 = sp(f, at(t160), 12, 160);
  return shell(<Bg k="gingham" f={f} d={d} dark={0.45} />, <>
    <div style={{ position: "absolute", left: 220, top: 260, width: 520, height: 600, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 200}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 440, height: 560, borderRadius: "16px 16px 120px 120px / 16px 16px 60px 60px", background: "linear-gradient(90deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.7))", boxShadow: SH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${85 * fill}%`, background: `radial-gradient(ellipse 30% 20% at 35% 10%, rgba(255,255,255,0.5), transparent 70%), linear-gradient(180deg, #C9341E, ${GLAZE})` }} />
        {[1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 0, width: 70, top: i * 130, height: 5, background: "rgba(60,60,60,0.5)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 420, top: 120, width: 120, height: 260, borderRadius: "0 120px 120px 0", border: "26px solid rgba(255,255,255,0.6)", borderLeft: "none" }} />
    </div>
    <div style={{ position: "absolute", left: 860, top: 160, width: 900, height: 470, borderRadius: 10, boxShadow: SH, background: "repeating-linear-gradient(180deg, transparent 0 96px, rgba(70,110,170,0.3) 96px 98px), linear-gradient(180deg, #FFFDF6, #F2ECDD)", transform: "rotate(1.5deg)" }}>
      <div style={{ position: "absolute", left: 40, top: 16 }}><Slab txt="'70s SHOP GLAZE" size={62} color={RED} sh={false} /></div>
      {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 50, top: 120 + i * 98 }}><Hand txt={l.txt} u={cl((f - at(l.t)) / 22)} size={58} color={BLUE} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 860, top: 700, display: "flex", alignItems: "center", gap: 24 }}>
      {[["145°", s1, "#8A6E2E"], ["GLAZE", s1, RED], ["160°", s2, OK]].map(([t, s, c], i) => <React.Fragment key={i}>
        {i ? <div style={{ fontFamily: SLB, fontSize: 64, color: CREAM, opacity: cl((s as number) * 2) }}>→</div> : null}
        <div style={{ padding: "16px 30px", borderRadius: 16, background: c as string, opacity: cl((s as number) * 2), transform: `scale(${0.6 + 0.4 * (s as number)})`, boxShadow: SH }}><Slab txt={t as string} size={64} color={CREAM} /></div>
      </React.Fragment>)}
    </div>
  </>);
};

// 21 · reposo: timer mecánico de cocina en 15, el cuchillo "bloqueado" con una cinta, y el jugo que vuelve a la miga
export const RestTimer: P<{ t15: number; tSettle: number } & A0> = ({ a, d, t15, tSettle, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), w = sp(f, at(t15), 12, 150), st = ez((f - at(tSettle)) / 60);
  const left = Math.max(0, 15 - Math.floor(cl((f - at(t15)) / Math.max(1, d - at(t15))) * 15));
  return shell(<Bg k="wood" f={f} d={d} dark={0.45} />, <>
    <div style={{ position: "absolute", left: 220, top: 200, width: 640, height: 640, opacity: cl(u * 2), transform: `scale(${0.7 + 0.3 * u})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 320, background: `radial-gradient(circle at 40% 35%, #FF6F5E, ${RED} 60%, #7E1A1E)`, boxShadow: SH }} />
      <div style={{ position: "absolute", inset: 60, borderRadius: 260, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #EDE7DA 70%, #CFC7B6)", transform: `rotate(${-(15 - left) * 6}deg)` }}>
        {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: 250, top: 10, width: 20, height: i % 3 ? 26 : 46, borderRadius: 4, background: INK, transformOrigin: "10px 250px", transform: `rotate(${i * 30}deg)` }} />)}
      </div>
      <div style={{ position: "absolute", left: 300, top: -40, width: 40, height: 120, borderRadius: 10, background: "linear-gradient(90deg, #8E1E22, #D4453C, #8E1E22)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: SLB, fontSize: 170, color: INK, lineHeight: 1 }}>{left}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: SLB, fontSize: 44, color: "#6B6257" }}>MINUTES</div>
    </div>
    <div style={{ position: "absolute", left: 980, top: 230, width: 760, opacity: cl(w * 2) }}>
      <Slab txt="DON'T CUT IT." size={104} color={CREAM} u={w} />
      <div style={{ marginTop: 30, position: "relative", width: 700, height: 220 }}>
        <Loaf x={60} y={40} w={560} h={170} glaze={1} />
        {[...Array(10)].map((_, i) => { const x = 110 + (i * 47) % 460, y0 = 60 + (i % 3) * 30; return <div key={i} style={{ position: "absolute", left: x, top: y0 + 60 * st, width: 14, height: 18, borderRadius: 7, background: "rgba(255,225,190,0.85)", opacity: 1 - st }} />; })}
      </div>
      <div style={{ marginTop: 30 }}><Hand txt="the juice settles back in" u={st * 1.5} size={60} color="#FFE2B8" style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
    </div>
  </>);
};

// 22 · problemas: letrero de fieltro negro con letras blancas a presión (como el menú de un diner); síntoma → causa
export const FeltBoard: P<{ rows: { t: number; a: string; b: string }[]; done?: [string, string][] } & A0> = ({ a, d, rows, done = [], a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const all = [...done.map(([x, y]) => ({ t: -1, a: x, b: y })), ...rows];
  return shell(<Bg k="green" f={f} d={d} dark={0.5} />, <>
    <div style={{ position: "absolute", left: 200, top: 90, width: 1520, height: 900, borderRadius: 14, background: TX.felt, boxShadow: `${SH}, inset 0 0 0 26px #6E4628, inset 0 0 0 30px #4A2E18`, transform: `translateY(${(1 - u) * -700}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SLB, fontSize: 62, color: "#F3EFE6", letterSpacing: 6 }}>IF IT WENT WRONG</div>
      {all.map((r, i) => { const s = r.t < 0 ? 1 : sp(f, at(r.t), 12, 170), y = 170 + i * 150;
        return <div key={i} style={{ position: "absolute", left: 80, top: y, width: 1360, display: "flex", alignItems: "baseline", gap: 30, opacity: (r.t < 0 ? 0.55 : 1) * cl(s * 2) }}>
          <div style={{ fontFamily: SLB, fontSize: 64, color: r.t < 0 ? "#D9D4C8" : "#FFFFFF", minWidth: 420, letterSpacing: 3, transform: `translateY(${(1 - s) * 20}px)` }}>{r.a}</div>
          <div style={{ fontFamily: SLB, fontSize: 48, color: "#F2C230" }}>→</div>
          <div style={{ fontFamily: SLB, fontSize: 44, color: "#E9E4DA", letterSpacing: 2, clipPath: `inset(0 ${100 - 100 * cl((f - at(r.t) - 8) / 24) * (r.t < 0 ? 0 : 1) - (r.t < 0 ? 0 : 0)}% 0 0)` }}>{r.b}</div>
        </div>; })}
    </div>
  </>);
};

// 23 · recibo del carnicero (papel térmico angosto que se imprime renglón a renglón) con el total $16
export const ButcherReceipt: P<{ rows: { t: number; a: string; b: string }[]; total: { t: number; b: string } } & A0> = ({ a, d, rows, total, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), s0 = sec(a, f), tt = sp(f, at(total.t), 11, 170);
  const n = rows.filter((r) => s0 >= r.t - 0.1).length + (s0 >= total.t ? 1.6 : 0);
  return shell(<Bg k="butcher" f={f} d={d} dark={0.35} />, <>
    <div style={{ position: "absolute", left: 560, top: 60, width: 800, height: 260 + 130 * n, maxHeight: 980, overflow: "hidden", transform: `rotate(-1.5deg) translateY(${(1 - u) * -300}px)`, boxShadow: SH,
      background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 5px), linear-gradient(180deg, #FFFEFA, #F1ECE1)" }}>
      <div style={{ textAlign: "center", paddingTop: 40, fontFamily: SLB, fontSize: 46, color: INK, letterSpacing: 4 }}>CALLAHAN MEATS</div>
      <div style={{ textAlign: "center", fontFamily: SLB, fontSize: 28, color: "#7A746A", letterSpacing: 6 }}>DORCHESTER · SINCE 1972</div>
      <div style={{ margin: "26px 50px", borderTop: "4px dashed #B9B2A4" }} />
      {rows.map((r, i) => { const s = sp(f, at(r.t), 12, 180);
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "18px 60px", fontFamily: SLB, fontSize: 46, color: INK, opacity: cl(s * 3) }}><span>{r.a}</span><span>{r.b}</span></div>; })}
      <div style={{ margin: "16px 50px", borderTop: "4px dashed #B9B2A4", opacity: cl(tt * 2) }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 60px", opacity: cl(tt * 2) }}>
        <span style={{ fontFamily: SLB, fontSize: 56, color: INK }}>TOTAL</span>
        <span style={{ fontFamily: SLB, fontSize: 150, color: RED, transform: `scale(${0.7 + 0.3 * tt})`, display: "inline-block" }}>{total.b}</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1420, top: 760, opacity: cl(tt * 2), transform: "rotate(-6deg)" }}><Hand txt="3 lb meatloaf" u={tt} size={70} color={GRN} /></div>
  </>);
};

// 24 · 4 platos del restaurante ($22 c/u → $88) vs la placa de 8 rebanadas que cuesta $16
export const PlateMath: P<{ t8: number; t22: number; t88: number; t16: number } & A0> = ({ a, d, t8, t22, t88, t16, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), s8 = sp(f, at(t8), 12, 150), s22 = sp(f, at(t22), 12, 150), s88 = sp(f, at(t88), 11, 170), s16 = sp(f, at(t16), 11, 170);
  return shell(<Bg k="gingham" f={f} d={d} dark={0.5} />, <>
    {/* izquierda: 8 rebanadas en abanico sobre tabla */}
    <div style={{ position: "absolute", left: 120, top: 300, width: 760, height: 440, borderRadius: 30, background: TX.wood, boxShadow: SH, opacity: cl(Math.max(u, s8) * 2) }}>
      {[...Array(8)].map((_, i) => { const s = cl(s8 * 1.6 - i * 0.08); return <div key={i} style={{ position: "absolute", left: 70 + i * 78, top: 80 + (1 - s) * 60, width: 110, height: 260, borderRadius: "40% 40% 10% 10% / 24% 24% 6% 6%", background: sliceBg(),
        boxShadow: "inset 0 0 0 8px #5A2C17, 4px 10px 14px rgba(0,0,0,0.45)", transform: `rotate(${(i - 3.5) * 3}deg)`, opacity: cl(s * 2) }}><div style={{ height: 40, borderRadius: "50% 50% 20% 20%", background: `linear-gradient(180deg, #C9341E, ${GLAZE})` }} /></div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center" }}><Slab txt="8 SLICES · $16" size={80} color={OK} u={s16} sh /></div>
    </div>
    {/* derecha: 4 platos */}
    <div style={{ position: "absolute", left: 1000, top: 250, width: 800, height: 600 }}>
      {[0, 1, 2, 3].map((i) => { const s = cl(s22 * 1.4 - i * 0.12); return <div key={i} style={{ position: "absolute", left: (i % 2) * 380, top: Math.floor(i / 2) * 280, width: 340, height: 240, borderRadius: "50%", opacity: cl(s * 2), transform: `scale(${0.7 + 0.3 * s})`,
        background: "radial-gradient(ellipse, #FFFFFF 0 55%, #E8E4DC 60%, #FFFFFF 64%, #CFC9BD 70%)", boxShadow: "0 16px 24px rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", left: 90, top: 70, width: 80, height: 90, borderRadius: 14, background: sliceBg(), boxShadow: "inset 0 0 0 6px #5A2C17" }} />
        <div style={{ position: "absolute", left: 150, top: 80, width: 80, height: 80, borderRadius: 14, background: sliceBg(), boxShadow: "inset 0 0 0 6px #5A2C17" }} />
        <div style={{ position: "absolute", left: 235, top: 90, width: 60, height: 60, borderRadius: 30, background: "radial-gradient(circle at 40% 35%, #FFFDF5, #EAD9B4)" }} />
        <div style={{ position: "absolute", left: 120, top: 172, fontFamily: SLB, fontSize: 40, color: RED }}>$22</div>
      </div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", opacity: cl(s88 * 2) }}><Slab txt="4 PLATES = $88" size={80} color="#FFB4A0" u={s88} /></div>
    </div>
  </>);
};

// 25 · dos noches: dos hojas de almanaque de pared (domingo caliente · lunes sándwich frío) y una tercera "freezer" que entra al final
export const TwoNights: P<{ days: { t: number; d: string; txt: string }[] } & A0> = ({ a, d, days, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const W = days.length > 2 ? 500 : 620, gap = days.length > 2 ? 560 : 720, x0 = days.length > 2 ? 160 : 260;
  return shell(<Bg k="green" f={f} d={d} dark={0.45} />, <>
    {days.map((dy, i) => { const s = sp(f, at(dy.t), 12, 140);
      return <div key={i} style={{ position: "absolute", left: x0 + i * gap, top: 170, width: W, height: 720, opacity: cl(s * 2) * cl(u * 2), transform: `rotate(${(i - 1) * 2.5}deg) perspective(1200px) rotateX(${(1 - s) * -60}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(180deg, #FFFEFA, #EFE7D7)", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 170, borderRadius: "10px 10px 0 0", background: i === 2 ? `linear-gradient(180deg, #3E6EA8, ${BLUE})` : `linear-gradient(180deg, #CF3C36, ${RED})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Slab txt={dy.d} size={86} color={CREAM} />
        </div>
        <div style={{ position: "absolute", left: W / 2 - 150, top: 230, width: 300, height: 220, borderRadius: "50%", background: "radial-gradient(ellipse, #FFFFFF 0 55%, #E8E4DC 60%, #FFFFFF 64%, #CFC9BD 70%)", boxShadow: "0 10px 16px rgba(0,0,0,0.25)" }}>
          {i === 1 ? <div style={{ position: "absolute", left: 60, top: 50, width: 180, height: 120, borderRadius: 10, background: "linear-gradient(180deg, #FFFDF6, #EFE4CF)", boxShadow: "inset 0 -26px 0 #A8674A, 0 4px 6px rgba(0,0,0,0.2)" }} />
            : i === 2 ? <div style={{ position: "absolute", left: 50, top: 60, width: 200, height: 100, borderRadius: 6, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0 10px, transparent 10px 30px), linear-gradient(180deg, #F3F0E2, #DCD7C2)", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }} />
            : <><div style={{ position: "absolute", left: 50, top: 60, width: 110, height: 100, borderRadius: 14, background: sliceBg(), boxShadow: "inset 0 0 0 6px #5A2C17" }} /><div style={{ position: "absolute", left: 170, top: 70, width: 80, height: 70, borderRadius: 40, background: "radial-gradient(circle at 40% 35%, #FFFDF5, #EAD9B4)" }} /></>}
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 500, textAlign: "center" }}><Hand txt={dy.txt} u={cl((f - at(dy.t) - 8) / 22)} size={56} color={GRN} style={{ display: "inline-block" }} /></div>
      </div>; })}
  </>);
};

// 26 · repaso: fichas del fichero que pasan una por una (la actual al frente, las anteriores atrás con tilde)
export const RecapCards: P<{ items: { t: number; txt: string }[] } & A0> = ({ a, d, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const s0 = sec(a, f); let cur = 0; items.forEach((it, i) => { if (s0 >= it.t - 0.1) cur = i; });
  return shell(<Bg k="wood" f={f} d={d} dark={0.45} />, <>
    <div style={{ position: "absolute", left: 120, top: 80 }}><Slab txt="THE WHOLE RECIPE" size={70} color={CREAM} u={u} /></div>
    <div style={{ position: "absolute", left: 120, top: 200, width: 520 }}>
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 76, opacity: i <= cur ? 1 : 0.35 }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: i === cur ? RED : i < cur ? OK : "rgba(255,255,255,0.25)", color: CREAM, fontFamily: SLB, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
        <div style={{ fontFamily: SLB, fontSize: 26, color: CREAM, whiteSpace: "nowrap" }}>{it.txt.split(" · ")[0].toUpperCase()}</div>
      </div>)}
    </div>
    {items.map((it, i) => { const s = sp(f, at(it.t), 13, 140), gone = i < cur ? cl((s0 - items[i + 1].t) * 3) : 0;
      if (i > cur || gone >= 1) return null;
      return <div key={i} style={{ position: "absolute", left: 760, top: 220, width: 1040, height: 640, borderRadius: 12, boxShadow: SH, opacity: 1 - gone,
        transform: `translateX(${(1 - s) * 700 + gone * -200}px) rotate(${(1 - s) * 8 + gone * -6}deg)`,
        background: "repeating-linear-gradient(180deg, transparent 0 96px, rgba(70,110,170,0.3) 96px 98px), linear-gradient(180deg, #FFFDF6, #F2ECDD)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: RED, borderRadius: "12px 12px 0 0" }} />
        <div style={{ position: "absolute", left: 50, top: 40, fontFamily: SLB, fontSize: 140, color: RED, lineHeight: 1 }}>{i + 1}</div>
        <div style={{ position: "absolute", left: 230, top: 70, width: 760 }}>{it.txt.split(" · ").map((ln, j) => <Hand key={j} txt={ln} u={cl((f - at(it.t) - 6 - j * 10) / 20)} size={j ? 56 : 70} color={j ? BLUE : INK} />)}</div>
      </div>; })}
  </>);
};

// 27 · la tarea: nota de papel pegada con cinta en el mostrador con SOLO dos cosas; cada una se tilda
export const Homework: P<{ items: { t: number; txt: string }[]; tOnly: number } & A0> = ({ a, d, items, tOnly, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), o = sp(f, at(tOnly), 12, 160);
  return shell(<Bg k="marble" f={f} d={d} dark={0.3} />, <>
    <div style={{ position: "absolute", left: 440, top: 120, width: 1040, height: 820, transform: `rotate(-2deg) scale(${0.85 + 0.15 * u})`, opacity: cl(u * 2), boxShadow: SH, borderRadius: 4,
      background: "repeating-linear-gradient(180deg, transparent 0 110px, rgba(70,110,170,0.3) 110px 112px), linear-gradient(180deg, #FFF9D9, #F5EBB5)" }}>
      <div style={{ position: "absolute", left: 420, top: -30, width: 200, height: 60, background: "rgba(240,235,215,0.75)", transform: "rotate(3deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", left: 60, top: 40 }}><Slab txt="HOMEWORK" size={84} color={RED} sh={false} /></div>
      {items.map((it, i) => { const s = sp(f, at(it.t), 12, 160);
        return <div key={i} style={{ position: "absolute", left: 70, top: 220 + i * 220, display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 90, height: 90, border: `6px solid ${INK}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick u={cl((f - at(it.t) - 20) / 14)} size={78} /></div>
          <Hand txt={it.txt} u={cl((f - at(it.t)) / 24)} size={70} color={INK} />
          <div style={{ opacity: 0 * s }} />
        </div>; })}
      <div style={{ position: "absolute", right: 70, bottom: 60, transform: `rotate(-6deg) scale(${0.6 + 0.4 * o})`, opacity: cl(o * 2) }}><Hand txt="only those two." u={o} size={74} color={RED} /></div>
    </div>
  </>);
};
