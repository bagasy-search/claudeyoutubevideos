// ── HÉROES de Stan the Butcher · video 5 (stan5, 16-oct): "200 libras de albóndigas por semana · 7 trucos" ──
// PURO CSS (pedido del creador 16-oct): cero imágenes. Mundo propio de este video: la mesa de albóndigas del fondo del local
// (mesa de acero, mármol de amasar, mantel a cuadros de la casa italiana, la receta de Mrs. Lombardi en papel amarillento),
// salsa de tomate y albahaca. Capas: fondo → sombra/luz → objeto → dato → acento.
// Dos familias: SLAB2 (Roboto Slab: lo impreso) y PEN (Patrick Hand: lo escrito a mano). Todo `t` = segundo absoluto de words.json.
import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadRS } from "@remotion/google-fonts/RobotoSlab";
import { loadFont as loadPH } from "@remotion/google-fonts/PatrickHand";
import { useT, sp, cl, ez, eo, lin, type P } from "../lkit/core";

const SLAB2 = loadRS("normal", { weights: ["500", "800", "900"], subsets: ["latin"] }).fontFamily;
const PEN = loadPH("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const TOM = "#C0392B", BASIL = "#3E7B3A", CREAM = "#FBF3E2", INK = "#2A211B", YEL = "#EAD9A2", STEELD = "#3c4246", PINK = "#E6A3A0", BEEF = "#9B2D2A";
const SH = "0 40px 80px rgba(0,0,0,0.42), 0 14px 26px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.25)";

// ── texturas CSS ──
const MARBLE: React.CSSProperties = {
  backgroundColor: "#EEECE7",
  backgroundImage: [
    "linear-gradient(115deg, transparent 0 30%, rgba(120,120,125,0.18) 30.5% 31%, transparent 31.5% 100%)",
    "linear-gradient(160deg, transparent 0 55%, rgba(110,110,118,0.14) 55.3% 55.9%, transparent 56.3%)",
    "linear-gradient(75deg, transparent 0 68%, rgba(130,130,135,0.12) 68.2% 68.6%, transparent 69%)",
    "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.9), transparent 50%)",
    "radial-gradient(ellipse at 80% 70%, rgba(200,198,190,0.5), transparent 55%)",
  ].join(","),
};
const CHECK: React.CSSProperties = {
  backgroundColor: "#F4ECDD",
  backgroundImage: [
    "repeating-linear-gradient(0deg, rgba(192,57,43,0.55) 0 46px, transparent 46px 92px)",
    "repeating-linear-gradient(90deg, rgba(192,57,43,0.55) 0 46px, transparent 46px 92px)",
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 6px)",
  ].join(","),
};
const STEELT: React.CSSProperties = {
  backgroundImage: [
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 4px)",
    "linear-gradient(180deg, #c8ced1, #9aa2a7 45%, #b9c0c3 70%, #858d92)",
  ].join(","),
};
const OLDPAPER: React.CSSProperties = {
  backgroundColor: YEL,
  backgroundImage: [
    "radial-gradient(circle at 80% 15%, rgba(140,95,30,0.28), transparent 35%)",
    "radial-gradient(circle at 15% 85%, rgba(140,95,30,0.22), transparent 30%)",
    "radial-gradient(ellipse at 50% 50%, rgba(255,250,225,0.6), transparent 70%)",
    "repeating-linear-gradient(11deg, rgba(110,80,30,0.05) 0 2px, transparent 2px 6px)",
  ].join(","),
};
const TILE2: React.CSSProperties = {
  backgroundColor: "#EAE6DC",
  backgroundImage: [
    "repeating-linear-gradient(0deg, #c4bdae 0 3px, transparent 3px 100px)",
    "repeating-linear-gradient(90deg, #c4bdae 0 3px, transparent 3px 100px)",
    "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6), transparent 60%)",
  ].join(","),
};

// ── capas comunes ──
// mesa de trabajo: pared de azulejo cuadrado + mesa (mármol / mantel / acero) en perspectiva + empuje lento + luz que barre
const Table: React.FC<{ f: number; d: number; top?: React.CSSProperties; h?: number; dark?: boolean; children: React.ReactNode }> = ({ f, d, top = MARBLE, h = 0.42, dark, children }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#171310" }}>
    <AbsoluteFill style={{ transform: `scale(${1 + 0.045 * ez(f / Math.max(1, d))})` }}>
      <AbsoluteFill style={{ ...TILE2, transform: `translateX(${10 * f / Math.max(1, d)}px)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,240,215,0.15), rgba(40,25,15,0.25))" }} />
      <div style={{ position: "absolute", left: -140, right: -140, bottom: -80, height: `${h * 100 + 8}%`, transform: "perspective(1400px) rotateX(40deg)", transformOrigin: "50% 0%", ...top,
        boxShadow: "0 -20px 44px rgba(0,0,0,0.35), inset 0 8px 0 rgba(255,255,255,0.35)" }} />
      {dark ? <AbsoluteFill style={{ background: "rgba(14,10,8,0.5)" }} /> : null}
      {children}
    </AbsoluteFill>
    <Glint f={f} d={d} />
  </AbsoluteFill>
);
const Glint: React.FC<{ f: number; d: number }> = ({ f, d }) => {
  const x = lin(f, 6, Math.min(d, 100), -50, 150, ez);
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", background: `linear-gradient(100deg, transparent ${x - 16}%, rgba(255,255,255,0.45) ${x}%, transparent ${x + 16}%)` }} />;
};
const Rise: React.FC<{ f: number; at: number; y?: number; x?: number; s0?: number; rot?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ f, at, y = 70, x = 0, s0 = 0.88, rot = 0, style, children }) => {
  const k = sp(f, at, 13, 150);
  return <div style={{ opacity: cl(k * 1.7), transform: `translate(${x * (1 - k)}px, ${y * (1 - k)}px) scale(${s0 + (1 - s0) * k}) rotate(${rot * (1 - k)}deg)`, ...style }}>{children}</div>;
};
// albóndiga (esfera con textura de picado)
const Ball: React.FC<{ s: number; cooked?: boolean; sauce?: boolean }> = ({ s, cooked, sauce }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", position: "relative",
    backgroundColor: cooked ? "#7A3B1E" : "#B5524A",
    backgroundImage: [
      `radial-gradient(circle at 32% 28%, rgba(255,255,255,${cooked ? 0.18 : 0.32}), transparent 42%)`,
      `radial-gradient(circle at 50% 50%, rgba(255,235,215,${cooked ? 0.12 : 0.4}) 0 2px, transparent 3px)`,
      `radial-gradient(circle at 50% 50%, rgba(60,10,5,0.35) 0 2px, transparent 3px)`,
      `radial-gradient(circle at 70% 75%, rgba(30,5,0,${cooked ? 0.6 : 0.4}), transparent 60%)`,
    ].join(","), backgroundSize: `100% 100%, ${s / 7}px ${s / 8}px, ${s / 9}px ${s / 6}px, 100% 100%`,
    boxShadow: `0 ${s * 0.12}px ${s * 0.18}px rgba(0,0,0,0.4)${sauce ? `, 0 ${s * 0.28}px 0 -${s * 0.06}px rgba(170,35,20,0.85)` : ""}` }} />
);
// número de truco: ficha de "tome su número" del mostrador
const NumTab: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const k = sp(f, 0, 12, 160);
  return (
    <div style={{ position: "absolute", left: 60, top: 50, transform: `translateY(${-200 * (1 - k)}px) rotate(-4deg)`, display: "flex", boxShadow: SH }}>
      <div style={{ background: TOM, color: CREAM, fontFamily: SLAB2, fontWeight: 900, fontSize: 30, letterSpacing: 4, padding: "26px 16px", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>TRICK</div>
      <div style={{ background: CREAM, padding: "6px 30px", fontFamily: SLAB2, fontWeight: 900, fontSize: 104, color: INK, lineHeight: 1.1, borderRight: "4px dashed rgba(0,0,0,0.25)" }}>{n}</div>
    </div>
  );
};
const Tape: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = -8 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 44, transform: `rotate(${rot}deg)`, background: "linear-gradient(180deg, rgba(240,235,215,0.85), rgba(220,212,185,0.85))", boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
    clipPath: "polygon(3% 0, 97% 4%, 100% 50%, 96% 100%, 2% 96%, 0 50%)", zIndex: 3 }} />
);
const Hand: React.FC<{ txt: string; f: number; at: number; dur?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f, at, dur = 12, size = 56, color = INK, style }) => {
  const p = cl((f - at) / Math.max(1, dur));
  return <div style={{ fontFamily: PEN, fontSize: size, color, whiteSpace: "nowrap", clipPath: `inset(-25% ${100 - p * 100}% -25% -5%)`, ...style }}>{txt}</div>;
};
const Pill: React.FC<{ txt: string; bg?: string; color?: string; size?: number }> = ({ txt, bg = BASIL, color = CREAM, size = 56 }) => (
  <span style={{ fontFamily: PEN, fontSize: size, color, background: bg, padding: "4px 28px", borderRadius: 40, boxShadow: SH, whiteSpace: "nowrap" }}>{txt}</span>
);
const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 110, color = INK, style }) => (
  <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: size, lineHeight: 1, color, textShadow: "0 4px 0 rgba(255,255,255,0.5)", ...style }}>{children}</div>
);

// 1 ── HOOK: 200 libras por semana, 30 años (balanza colgante de dial)
export const TwoHundred: P<{ t: number; wk: number; yrs: number }> = ({ a, d, t, wk, yrs }) => {
  const { f, at } = useT(a);
  const v = Math.round(200 * eo(cl((f - at(t)) / 36)));
  const ang = -120 + 240 * (v / 200);
  return (
    <Table f={f} d={d} top={STEELT}>
      <div style={{ position: "absolute", left: 360, top: 0, width: 10, height: 150, background: "linear-gradient(90deg, #666, #ddd, #666)" }} />
      <div style={{ position: "absolute", left: 120, top: 130, width: 500, height: 500, borderRadius: "50%", ...STEELT, boxShadow: SH, transform: `rotate(${2 * Math.sin(f / 18)}deg)`, transformOrigin: "50% -20%" }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fff, #f3eee2 70%, #d8cfbd)", boxShadow: "inset 0 8px 24px rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: "repeating-conic-gradient(from -120deg at 50% 50%, #333 0 0.8deg, transparent 0.8deg 12deg)",
          WebkitMaskImage: "radial-gradient(circle, transparent 0 66%, #000 67% 72%, transparent 73%)", maskImage: "radial-gradient(circle, transparent 0 66%, #000 67% 72%, transparent 73%)" }} />
        <div style={{ position: "absolute", left: 246, top: 80, width: 8, height: 180, background: TOM, borderRadius: 4, transformOrigin: "50% 170px", transform: `rotate(${ang}deg)` }} />
        <div style={{ position: "absolute", left: 220, top: 220, width: 60, height: 60, borderRadius: 30, ...STEELT }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: SLAB2, fontWeight: 800, fontSize: 34, color: INK }}>LB</div>
      </div>
      <div style={{ position: "absolute", left: 180, top: 690, display: "flex", gap: 14 }}>
        {Array.from({ length: 7 }).map((_, i) => <Rise key={i} f={f} at={at(t) + 6 + i * 3} y={-80}><Ball s={70} /></Rise>)}
      </div>
      <div style={{ position: "absolute", left: 780, top: 170, width: 1060 }}>
        <Big size={300} color={TOM}>{v}</Big>
        <Big size={88}>POUNDS OF MEATBALLS</Big>
        {f >= at(wk) ? <Rise f={f} at={at(wk)}><div style={{ marginTop: 30 }}><Pill txt="every single week" bg={TOM} size={64} /></div></Rise> : null}
        {f >= at(yrs) ? <Rise f={f} at={at(yrs)}><div style={{ marginTop: 34, fontFamily: PEN, fontSize: 66, color: INK }}>for almost 30 years</div></Rise> : null}
      </div>
    </Table>
  );
};

// 2 ── HOOK_2: los 3 fracasos (tarjetas que caen sobre el mantel con tachadura)
export const ThreeFails: P<{ fails: { t: number; txt: string; sub: string }[] }> = ({ a, d, fails }) => {
  const { f, at } = useT(a);
  return (
    <Table f={f} d={d} top={CHECK} h={0.55}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Big size={78}>WHY YOURS GO WRONG</Big></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", gap: 60, perspective: 1600 }}>
        {fails.map((x, i) => {
          const k = sp(f, at(x.t), 11, 140);
          return (
            <div key={i} style={{ width: 480, height: 560, transform: `translateY(${-500 * (1 - k)}px) rotateX(${(1 - k) * 40}deg) rotate(${(i - 1) * 4}deg)`, opacity: cl(k * 2), ...OLDPAPER, boxShadow: SH, position: "relative", padding: 40, boxSizing: "border-box" }}>
              <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i === 0 ? <Ball s={190} cooked /> : i === 1 ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap", width: 220 }}>{Array.from({ length: 9 }).map((_, j) => <Ball key={j} s={50 + (j % 3) * 10} cooked />)}</div> : <div style={{ filter: "grayscale(0.85)" }}><Ball s={190} cooked /></div>}
              </div>
              <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 76, color: TOM, textAlign: "center" }}>{x.txt}</div>
              <div style={{ fontFamily: PEN, fontSize: 52, color: INK, textAlign: "center" }}>{x.sub}</div>
              <Tape x={170} y={-20} rot={(i - 1) * 6} />
            </div>
          );
        })}
      </div>
    </Table>
  );
};

// 3 ── PROMISE: 7 tickets de "tome su número" que salen del dispensador
export const NumberTickets: P<{ tix: { t: number; txt: string }[]; done?: string[] }> = ({ a, d, tix: t0, done = [] }) => {
  const { f, at } = useT(a);
  const tix = [...done.map((txt) => ({ txt, t: a - 30 })), ...t0];
  return (
    <Table f={f} d={d} top={STEELT} dark>
      <div style={{ position: "absolute", left: 80, top: 330, width: 230, height: 320, borderRadius: "40px 40px 20px 20px", background: `linear-gradient(160deg, ${TOM}, #7d1f15)`, boxShadow: SH }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 40, height: 110, borderRadius: 12, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 80, color: "#ff5a3c", textShadow: "0 0 12px rgba(255,90,60,0.8)" }}>
          {String(tix.filter((x) => f >= at(x.t)).length).padStart(2, "0")}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: SLAB2, fontWeight: 900, fontSize: 30, color: CREAM, letterSpacing: 3 }}>NOW SERVING</div>
      </div>
      <div style={{ position: "absolute", left: 360, right: 60, top: 140, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30 }}>
        {tix.map((x, i) => {
          const k = sp(f, at(x.t), 12, 150);
          return (
            <div key={i} style={{ transform: `translateX(${-600 * (1 - k)}px) rotate(${(i % 2 ? 3 : -3) * k}deg)`, opacity: cl(k * 2), height: 330, background: CREAM, boxShadow: SH, position: "relative",
              clipPath: "polygon(0 0, 100% 0, 100% 44%, 96% 50%, 100% 56%, 100% 100%, 0 100%, 0 56%, 4% 50%, 0 44%)", padding: "24px 20px", boxSizing: "border-box", textAlign: "center" }}>
              <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 110, color: TOM, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ borderTop: "3px dashed rgba(0,0,0,0.25)", margin: "18px 0" }} />
              <div style={{ fontFamily: SLAB2, fontWeight: 800, fontSize: 40, color: INK }}>{x.txt}</div>
            </div>
          );
        })}
      </div>
    </Table>
  );
};

// 4 ── STORY_2: la receta pegada en la pared + barras de ventas 50 → 100 → 200
export const SalesBars: P<{ bars: { t: number; v: number }[]; ev: number }> = ({ a, d, bars, ev }) => {
  const { f, at } = useT(a);
  return (
    <Table f={f} d={d} top={STEELT} h={0.3}>
      <div style={{ position: "absolute", left: 120, top: 120, width: 560, height: 700, ...OLDPAPER, boxShadow: SH, transform: "rotate(-3deg)", padding: 50, boxSizing: "border-box" }}>
        <Tape x={200} y={-22} />
        <div style={{ fontFamily: PEN, fontSize: 54, color: "#5a4a35", lineHeight: 1.35 }}>Mrs. L —<br />2 beef · 1 pork<br />fingertips!<br />wet bread + milk<br />taste first<br />same size<br />oven, then sauce</div>
        <div style={{ position: "absolute", right: 40, bottom: 40, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(150,100,40,0.25), transparent 70%)" }} />
      </div>
      <div style={{ position: "absolute", left: 820, right: 120, top: 150, bottom: 300, display: "flex", alignItems: "flex-end", gap: 60 }}>
        {bars.map((b, i) => {
          const h = lin(f, at(b.t), at(b.t) + 22, 0, b.v / 200, eo);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 72, color: i === 2 ? TOM : INK, opacity: f >= at(b.t) ? 1 : 0 }}>{b.v}<span style={{ fontSize: 34 }}> lb</span></div>
              <div style={{ width: "100%", height: `${h * 78}%`, borderRadius: "16px 16px 0 0", background: `linear-gradient(90deg, ${i === 2 ? TOM : BEEF}, ${i === 2 ? "#e2584a" : "#c0504a"}, ${i === 2 ? TOM : BEEF})`, boxShadow: SH,
                backgroundImage: "repeating-radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08) 0 6px, transparent 6px 14px)" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 820, right: 120, top: 800, display: "flex", justifyContent: "space-around", fontFamily: PEN, fontSize: 46, color: INK }}><span>week 1</span><span>then</span><span>by year's end</span></div>
      {f >= at(ev) ? <div style={{ position: "absolute", right: 120, top: 80 }}><Rise f={f} at={at(ev)}><Pill txt="every week" bg={TOM} size={62} /></Rise></div> : null}
    </Table>
  );
};

// 5 ── STORY_3: tarjeta de precio clavada en la bandeja ($3,49 la libra)
export const PriceCard: P<{ price: string; unit: string; t: number; best: number }> = ({ a, d, price, unit, t, best }) => {
  const { f, at } = useT(a);
  const k = sp(f, at(t), 11, 140);
  return (
    <Table f={f} d={d} top={STEELT} h={0.55}>
      <div style={{ position: "absolute", left: 160, top: 560, width: 1000, height: 330, borderRadius: 14, background: "#f5f5f2", boxShadow: SH, padding: 26, boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 8, transform: "perspective(1200px) rotateX(35deg)" }}>
        {Array.from({ length: 27 }).map((_, i) => <div key={i} style={{ display: "flex", justifyContent: "center" }}><Ball s={80} /></div>)}
      </div>
      <div style={{ position: "absolute", left: 600, top: 140, transform: `translateY(${-300 * (1 - k)}px) rotate(${-4 + 4 * (1 - k)}deg)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", left: 270, top: 380, width: 12, height: 200, background: "linear-gradient(90deg, #777, #eee, #777)" }} />
        <div style={{ width: 560, height: 400, background: CREAM, border: `14px solid ${TOM}`, boxShadow: SH, textAlign: "center", padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 52, color: INK, letterSpacing: 3 }}>MEATBALLS</div>
          <div style={{ fontFamily: PEN, fontSize: 40, color: "#6a5a45" }}>raw · rolled · ready for the sauce</div>
          <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 150, color: TOM, lineHeight: 1.1 }}>{price}</div>
          <div style={{ fontFamily: PEN, fontSize: 46, color: INK, marginTop: -10 }}>{unit}</div>
        </div>
      </div>
      {f >= at(best) ? <div style={{ position: "absolute", left: 1220, top: 260 }}><Rise f={f} at={at(best)} rot={8}><div style={{ fontFamily: PEN, fontSize: 64, color: CREAM, background: BASIL, padding: "10px 30px", transform: "rotate(6deg)", boxShadow: SH }}>best deal in Chicago</div></Rise></div> : null}
    </Table>
  );
};

// 6 ── ONE: 2 de res + 1 de cerdo (bloques sobre papel) y para qué sirve cada uno
export const MeatMix: P<{ no: number; t: number; pork: number; why: { t: number; txt: string }[] }> = ({ a, d, no, t, pork, why }) => {
  const { f, at } = useT(a);
  const Block: React.FC<{ c: string; lab: string; at0: number }> = ({ c, lab, at0 }) => (
    <Rise f={f} at={at0} y={-260}>
      <div style={{ width: 300, height: 230, borderRadius: "40% 40% 28% 28% / 50% 50% 22% 22%", backgroundColor: c, boxShadow: `${SH}, inset -18px -20px 30px rgba(0,0,0,0.3), inset 12px 14px 24px rgba(255,255,255,0.25)`,
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,240,230,0.5) 0 3px, transparent 4px), radial-gradient(circle at 50% 50%, rgba(0,0,0,0.15) 0 3px, transparent 4px)", backgroundSize: "26px 22px, 19px 31px" }} />
      <div style={{ textAlign: "center", fontFamily: SLAB2, fontWeight: 900, fontSize: 52, color: INK, marginTop: 20 }}>{lab}</div>
    </Rise>
  );
  return (
    <Table f={f} d={d} h={0.5}>
      <NumTab n={no} f={f} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 50 }}>
        <Block c={BEEF} lab="BEEF" at0={at(t)} />
        <Block c={BEEF} lab="BEEF" at0={at(t) + 6} />
        <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 120, color: INK, opacity: f >= at(pork) ? 1 : 0, alignSelf: "center" }}>+</div>
        <Block c={PINK} lab="PORK" at0={at(pork)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}><Rise f={f} at={at(t)}><Big size={84}>2 : 1</Big></Rise></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 40 }}>
        {why.map((w, i) => f >= at(w.t) ? <Rise key={i} f={f} at={at(w.t)}><Pill txt={w.txt.toLowerCase()} bg={i ? "#b0605a" : BEEF} size={54} /></Rise> : null)}
      </div>
    </Table>
  );
};

// 7 ── ONE_3: una sola pasada por el disco grueso (vs dos pasadas = pasta)
export const OnceThrough: P<{ t: number; twice: number; plate: number }> = ({ a, d, t, twice, plate }) => {
  const { f, at } = useT(a);
  const Plate: React.FC<{ holes: number; size: number }> = ({ holes, size }) => (
    <div style={{ width: size, height: size, borderRadius: "50%", ...STEELT, boxShadow: SH, position: "relative",
      backgroundImage: `radial-gradient(circle at 50% 50%, #222 0 ${holes}px, transparent ${holes + 1}px), linear-gradient(180deg, #d4d9dc, #8c949a)`, backgroundSize: `${holes * 3.2}px ${holes * 3.2}px, 100% 100%` }}>
      <div style={{ position: "absolute", left: "42%", top: "42%", width: "16%", height: "16%", borderRadius: "50%", background: "#c9cfd2", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.5)" }} />
    </div>
  );
  const strand = (c: string, smooth: boolean): React.CSSProperties => ({ width: 380, height: 150, borderRadius: 30, backgroundColor: c,
    backgroundImage: smooth ? "linear-gradient(180deg, rgba(255,255,255,0.2), transparent)" : "repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 4px, transparent 4px 18px), radial-gradient(circle at 50% 50%, rgba(255,240,230,0.55) 0 3px, transparent 4px)",
    backgroundSize: smooth ? "100% 100%" : "100% 100%, 24px 20px", boxShadow: SH });
  return (
    <Table f={f} d={d} top={STEELT} h={0.35}>
      <div style={{ position: "absolute", left: 180, top: 150, width: 640, textAlign: "center" }}>
        <Rise f={f} at={at(t)}><div style={{ display: "flex", justifyContent: "center" }}><Plate holes={14} size={330} /></div></Rise>
        <Rise f={f} at={at(t) + 8}><div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}><div style={strand(BEEF, false)} /></div></Rise>
        <Big size={80} color={BASIL} style={{ marginTop: 30 }}>1× COARSE</Big>
      </div>
      <div style={{ position: "absolute", left: 1100, top: 150, width: 640, textAlign: "center", opacity: f >= at(twice) ? 1 : 0.15 }}>
        <div style={{ display: "flex", justifyContent: "center" }}><Plate holes={6} size={330} /></div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}><div style={strand("#c98a86", true)} /></div>
        <Big size={80} color={TOM} style={{ marginTop: 30 }}>2× = PASTE</Big>
        {f >= at(twice) + 8 ? <div style={{ position: "absolute", left: 100, right: 100, top: 240, height: 14, background: TOM, transform: `rotate(-20deg) scaleX(${ez((f - at(twice) - 8) / 10)})`, borderRadius: 7, boxShadow: SH }} /> : null}
      </div>
      {f >= at(plate) ? <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Rise f={f} at={at(plate)}><Pill txt="once through the coarse plate" size={58} /></Rise></div> : null}
    </Table>
  );
};

// 8 ── TWO: medidor de apretón (de "suave" a "salchicha")
export const SqueezeMeter: P<{ no: number; t: number; sausage: number }> = ({ a, d, no, t, sausage }) => {
  const { f, at } = useT(a);
  const v = lin(f, at(t), at(sausage) + 10, 0.05, 0.96, ez);
  const zones = [["SOFT", BASIL], ["FIRM", "#C9A227"], ["RUBBER BALL", "#D3772B"], ["SAUSAGE", TOM]];
  return (
    <Table f={f} d={d} h={0.3} dark>
      <NumTab n={no} f={f} />
      <div style={{ position: "absolute", left: 260, right: 260, top: 300, height: 120, borderRadius: 60, overflow: "hidden", boxShadow: SH, display: "flex" }}>
        {zones.map(([z, c]) => <div key={z} style={{ flex: 1, background: `linear-gradient(180deg, ${c}, ${c}bb)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB2, fontWeight: 900, fontSize: 38, color: CREAM }}>{z}</div>)}
      </div>
      <div style={{ position: "absolute", left: `calc(260px + ${v} * (100% - 520px))`, top: 250, marginLeft: -30, width: 60, height: 220, borderRadius: 16, background: CREAM, boxShadow: SH }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 80, alignItems: "center" }}>
        <div style={{ transform: `scale(${1 - 0.25 * v}, ${1 - 0.1 * v})` }}><Ball s={240} /></div>
        <div style={{ fontFamily: PEN, fontSize: 70, color: CREAM }}>the harder you squeeze,<br />the harder the meatball</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}><Big size={96} color={CREAM} style={{ textShadow: "0 5px 14px rgba(0,0,0,0.6)" }}>DON'T SQUEEZE</Big></div>
    </Table>
  );
};

// 9 ── TWO_3: todo frío (termómetro con escarcha + tiempos de heladera / freezer)
export const ColdRule: P<{ t: number; smear: number; cool: number; frz: number }> = ({ a, d, t, smear, cool, frz }) => {
  const { f, at } = useT(a);
  const lvl = lin(f, at(t), at(t) + 30, 0.7, 0.18, eo);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(180deg, #dfeaf0, #b9ccd6)" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.7) 0 1.5px, transparent 2.5px)", backgroundSize: "60px 70px, 45px 38px", opacity: 0.6 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 0 62%, rgba(80,100,110,0.25) 62% 100%)" }} />
      <div style={{ position: "absolute", left: 220, top: 110, width: 140, height: 780 }}>
        <div style={{ position: "absolute", left: 30, top: 0, width: 80, bottom: 120, borderRadius: 40, background: "rgba(255,255,255,0.85)", boxShadow: SH, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 0, height: `${lvl * 100}%`, background: `linear-gradient(90deg, #2a6fb0, #4f9be0, #2a6fb0)`, borderRadius: 22 }} />
          {[0.2, 0.4, 0.6, 0.8].map((y) => <div key={y} style={{ position: "absolute", left: 0, width: 26, top: `${y * 100}%`, height: 4, background: "rgba(0,0,0,0.3)" }} />)}
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #7fbaf0, #2a6fb0)", boxShadow: SH }} />
      </div>
      <div style={{ position: "absolute", left: 480, top: 120, width: 1300 }}>
        <Rise f={f} at={0}><Big size={130} color="#1f4f7a">KEEP IT COLD</Big></Rise>
        <div style={{ display: "flex", gap: 30, marginTop: 30 }}>
          {["the meat", "the bowl", "your hands"].map((x, i) => <Rise key={x} f={f} at={at(t) + i * 10}><Pill txt={x} bg="#2a6fb0" size={60} /></Rise>)}
        </div>
        {f >= at(smear) ? <Rise f={f} at={at(smear)}><div style={{ marginTop: 50, fontFamily: PEN, fontSize: 66, color: TOM }}>warm fat smears → tough</div></Rise> : null}
        <div style={{ display: "flex", gap: 40, marginTop: 50 }}>
          {f >= at(cool) ? <Rise f={f} at={at(cool)}><div style={{ background: "#fff", boxShadow: SH, borderRadius: 18, padding: "20px 40px", textAlign: "center" }}><Big size={96} color="#1f4f7a">10 min</Big><div style={{ fontFamily: PEN, fontSize: 46, color: INK }}>bowl in the cooler</div></div></Rise> : null}
          {f >= at(frz) ? <Rise f={f} at={at(frz)}><div style={{ background: "#fff", boxShadow: SH, borderRadius: 18, padding: "20px 40px", textAlign: "center" }}><Big size={96} color="#1f4f7a">5 min</Big><div style={{ fontFamily: PEN, fontSize: 46, color: INK }}>yours in the freezer</div></div></Rise> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 10 ── THREE: el pan que se empapa (rebanada-esponja + nivel de leche)
export const BreadSponge: P<{ no: number; t: number; mash: number }> = ({ a, d, no, t, mash }) => {
  const { f, at } = useT(a);
  const soak = lin(f, at(t), at(t) + 60, 0, 1, ez);
  const m = lin(f, at(mash), at(mash) + 20, 0, 1, ez);
  return (
    <Table f={f} d={d} top={CHECK} h={0.5}>
      <NumTab n={no} f={f} />
      <div style={{ position: "absolute", left: 220, top: 240, width: 700, height: 600 }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, borderRadius: "0 0 50% 50% / 0 0 40% 40%", background: "linear-gradient(90deg, #dfe6ea, #fff 40%, #c5ced3)", boxShadow: SH, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 - 40 * soak}%`, background: "linear-gradient(180deg, #fffdf6, #f1ead8)" }} />
        </div>
        {[0, 1].map((i) => (
          <div key={i} style={{ position: "absolute", left: 120 + i * 220, top: 120 + 160 * soak + i * 20, width: 230, height: 230, borderRadius: "30% 30% 12% 12%", transform: `rotate(${(i ? 8 : -6)}deg) scale(${1 - 0.5 * m}, ${1 - 0.7 * m})`,
            backgroundColor: soak > 0.5 ? "#f3ead2" : "#f7f0dc", backgroundImage: "radial-gradient(circle at 50% 50%, rgba(160,130,80,0.25) 0 3px, transparent 4px), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0 2px, transparent 3px)", backgroundSize: "18px 16px, 13px 21px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.25), inset 0 -10px 20px rgba(160,130,80,0.25)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 1020, top: 220, width: 800 }}>
        <Rise f={f} at={at(t)}><Big size={92}>WET BREAD,</Big></Rise>
        <Rise f={f} at={at(t) + 6}><Big size={92} color={TOM}>NOT CRUMBS</Big></Rise>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
          {["2 thick slices, no crust", "½ cup whole milk", "5 minutes · soft like oatmeal"].map((x, i) => <Hand key={x} txt={"• " + x} f={f} at={at(t) + 14 + i * 14} size={58} />)}
          {f >= at(mash) ? <Hand txt="• mash it with a fork" f={f} at={at(mash)} size={58} color={TOM} /> : null}
        </div>
      </div>
    </Table>
  );
};

// 11 ── THREE_3: 2 huevos cada 3 libras (huevos CSS + balanza del equilibrio)
export const EggRule: P<{ t: number; no_: number; bal: number }> = ({ a, d, t, no_, bal }) => {
  const { f, at } = useT(a);
  const Egg: React.FC<{ x: boolean }> = ({ x }) => (
    <div style={{ position: "relative", width: 150, height: 196, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #fffdf8, #f2e7d2 60%, #d8c7a7)", boxShadow: SH, opacity: x ? 0.45 : 1 }}>
      {x ? <div style={{ position: "absolute", left: -20, right: -20, top: 86, height: 12, background: TOM, transform: "rotate(-30deg)", borderRadius: 6 }} /> : null}
    </div>
  );
  return (
    <Table f={f} d={d} h={0.46}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Rise f={f} at={at(t)}><Big size={110}>2 EGGS <span style={{ color: TOM }}>/ 3 LB</span></Big></Rise></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 40 }}>
        {[0, 1, 2, 3].map((i) => <Rise key={i} f={f} at={i < 2 ? at(t) + i * 6 : at(no_) + (i - 2) * 6} y={-200}><Egg x={i >= 2} /></Rise>)}
      </div>
      {f >= at(no_) ? <div style={{ position: "absolute", left: 1130, top: 570 }}><Rise f={f} at={at(no_) + 10}><Pill txt="too many → spongy, bouncy" bg={TOM} size={50} /></Rise></div> : null}
      {f >= at(bal) ? <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 40 }}>
        <Rise f={f} at={at(bal)}><Pill txt="eggs = hold it together" size={54} /></Rise><Rise f={f} at={at(bal) + 12}><Pill txt="bread = keeps it soft" bg="#9a7a3a" size={54} /></Rise></div> : null}
    </Table>
  );
};

// 12 ── FOUR: la albóndiga de prueba (sartén vista de arriba + 1 min por lado)
export const TestPatty: P<{ no: number; t: number; eat: number }> = ({ a, d, no, t, eat }) => {
  const { f, at } = useT(a);
  const side = f - at(t) < 45 ? 1 : 2;
  const p = cl(((f - at(t)) % 45) / 45);
  return (
    <Table f={f} d={d} top={STEELT} h={0.4} dark>
      <NumTab n={no} f={f} />
      <div style={{ position: "absolute", left: 260, top: 200, width: 640, height: 640 }}>
        <div style={{ position: "absolute", left: 560, top: 280, width: 420, height: 70, borderRadius: 35, background: "linear-gradient(180deg, #2b2b2b, #0d0d0d)", boxShadow: SH }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #3a3a3a, #141414 70%)", boxShadow: `${SH}, inset 0 0 0 26px #222, inset 0 0 50px rgba(0,0,0,0.8)` }} />
        <div style={{ position: "absolute", left: 250, top: 250, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle at 45% 40%, ${side === 2 ? "#8a4a26" : "#b0584f"}, ${side === 2 ? "#5a2c14" : "#8d3a32"})`,
          boxShadow: `0 0 0 ${8 + 6 * Math.sin(f / 3)}px rgba(255,200,120,0.18), 0 6px 12px rgba(0,0,0,0.5)`, transform: `rotateY(${side === 2 && p < 0.15 ? p * 1200 : 0}deg)` }} />
        <div style={{ position: "absolute", left: 230, top: 420, width: 180, textAlign: "center", fontFamily: PEN, fontSize: 40, color: CREAM }}>size of a quarter</div>
      </div>
      <div style={{ position: "absolute", left: 1020, top: 200, width: 800 }}>
        <Rise f={f} at={0}><Big size={110} color={CREAM} style={{ textShadow: "0 5px 14px rgba(0,0,0,0.6)" }}>THE TEST<br />MEATBALL</Big></Rise>
        <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
          {[1, 2].map((s) => <div key={s} style={{ flex: 1, background: s <= side && f >= at(t) ? TOM : "rgba(255,255,255,0.15)", color: CREAM, fontFamily: SLAB2, fontWeight: 800, fontSize: 44, padding: "18px 0", textAlign: "center", borderRadius: 12, boxShadow: SH }}>1 MIN · SIDE {s}</div>)}
        </div>
        {f >= at(eat) ? <Rise f={f} at={at(eat)}><div style={{ marginTop: 50 }}><Pill txt="then you eat it" bg={BASIL} size={66} /></div></Rise> : null}
      </div>
    </Table>
  );
};

// 13 ── FOUR_3: la receta de la casa (ficha sobre mármol, por libra)
export const ShopRecipe: P<{ items: { t: number; txt: string }[]; foot: number }> = ({ a, d, items, foot }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 13, 110);
  return (
    <Table f={f} d={d} h={0.62}>
      <div style={{ position: "absolute", left: 420, top: 100, width: 1080, height: 820, transform: `perspective(1600px) rotateX(${14 - 6 * k}deg) rotate(${-2 + 2 * k}deg) translateY(${140 * (1 - k)}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, ...OLDPAPER, boxShadow: SH, borderRadius: 6 }} />
        <Tape x={460} y={-22} />
        <div style={{ position: "absolute", left: 70, top: 50, right: 70, borderBottom: `5px double ${TOM}`, paddingBottom: 14, fontFamily: SLAB2, fontWeight: 900, fontSize: 64, color: TOM }}>THE SHOP RECIPE <span style={{ fontFamily: PEN, fontWeight: 400, fontSize: 48, color: INK }}>per batch</span></div>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: 90, top: 210 + i * 104, display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: f >= at(it.t) ? BASIL : "rgba(0,0,0,0.12)", color: CREAM, fontFamily: SLAB2, fontWeight: 900, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f >= at(it.t) ? sp(f, at(it.t), 10, 200) : 1})` }}>{i + 1}</div>
            <Hand txt={it.txt} f={f} at={at(it.t)} size={64} color="#3a2f22" />
          </div>
        ))}
        {f >= at(foot) ? <div style={{ position: "absolute", right: 60, bottom: 50, transform: `rotate(-8deg) scale(${2 - sp(f, at(foot), 9, 220)})`, border: `7px solid ${TOM}`, borderRadius: 10, padding: "6px 22px", fontFamily: SLAB2, fontWeight: 900, fontSize: 52, color: TOM, mixBlendMode: "multiply" }}>MRS. L APPROVED</div> : null}
      </div>
    </Table>
  );
};

// 14 ── FIVE_2: cuchara de 2 oz → 8 por libra → 3 lb = 24
export const ScoopMath: P<{ no: number; t: number; three: number; thou: number }> = ({ a, d, no, t, three, thou }) => {
  const { f, at } = useT(a);
  const n = f >= at(three) ? Math.min(24, 8 + Math.floor((f - at(three)) / 2)) : Math.min(8, Math.max(0, Math.floor((f - at(t)) / 3)));
  return (
    <Table f={f} d={d} top={STEELT} h={0.5}>
      <NumTab n={no} f={f} />
      <div style={{ position: "absolute", left: 120, top: 520, width: 1100, height: 440, transform: "perspective(1300px) rotateX(38deg)", borderRadius: 16, background: "linear-gradient(180deg, #d9dee1, #a8b0b4)", boxShadow: SH, padding: 26, boxSizing: "border-box",
        display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 10 }}>
        {Array.from({ length: 24 }).map((_, i) => <div key={i} style={{ display: "flex", justifyContent: "center", alignItems: "center", transform: `scale(${i < n ? sp(f, 0, 10, 200) : 0})` }}><Ball s={96} /></div>)}
      </div>
      <div style={{ position: "absolute", left: 300, top: 170, display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #b9c0c4 55%, #7b8388)", boxShadow: SH, position: "relative" }}>
          <div style={{ position: "absolute", left: 180, top: 80, width: 260, height: 40, borderRadius: 20, background: "linear-gradient(180deg, #d5dadd, #8c949a)" }} />
        </div>
        <Big size={96} style={{ marginLeft: 260 }}>2 oz</Big>
      </div>
      <div style={{ position: "absolute", left: 1300, top: 220, width: 560, textAlign: "center" }}>
        <Big size={260} color={TOM}>{n}</Big>
        <Big size={52}>{f >= at(three) ? "FROM 3 POUNDS" : "PER POUND"}</Big>
        {f >= at(thou) ? <Rise f={f} at={at(thou)}><div style={{ marginTop: 40, fontFamily: PEN, fontSize: 56, color: INK }}>Friday: 1,000 before opening</div></Rise> : null}
      </div>
    </Table>
  );
};

// 15 ── SIX: perilla del horno a 425 °F + 15 min + bandeja
export const OvenDial: P<{ no: number; t: number; min: number }> = ({ a, d, no, t, min }) => {
  const { f, at } = useT(a);
  const deg = lin(f, at(t) - 10, at(t) + 20, -130, 95, eo);
  const temp = Math.round(lin(f, at(t) - 10, at(t) + 20, 200, 425, eo) / 5) * 5;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(180deg, #f2efe6, #d9d3c4)" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 100%)", backgroundSize: "400px 100%" }} />
      <NumTab n={no} f={f} />
      <div style={{ position: "absolute", left: 200, top: 260, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbfaf6, #e1dccf 70%, #b7ae9b)", boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: "repeating-conic-gradient(from -130deg at 50% 50%, #555 0 1deg, transparent 1deg 15deg)", WebkitMaskImage: "radial-gradient(circle, transparent 0 80%, #000 81% 88%, transparent 89%)", maskImage: "radial-gradient(circle, transparent 0 80%, #000 81% 88%, transparent 89%)" }} />
        <div style={{ position: "absolute", left: 90, top: 90, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #444, #111)", boxShadow: "0 16px 30px rgba(0,0,0,0.5)", transform: `rotate(${deg}deg)` }}>
          <div style={{ position: "absolute", left: 136, top: 16, width: 28, height: 120, borderRadius: 14, background: "linear-gradient(90deg, #ddd, #fff, #bbb)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 800, top: 200, width: 1000 }}>
        <Big size={250} color={TOM}>{temp}°F</Big>
        {f >= at(min) ? <Rise f={f} at={at(min)}><Big size={110}>15 MINUTES</Big></Rise> : null}
        <div style={{ marginTop: 50, width: 860, height: 190, borderRadius: 14, background: "linear-gradient(180deg, #6f7477, #3d4245)", boxShadow: `${SH}, inset 0 0 0 10px #555`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 30px",
          filter: `saturate(${1})` }}>
          {Array.from({ length: 6 }).map((_, i) => <Ball key={i} s={110} cooked={f >= at(min)} />)}
        </div>
        <div style={{ marginTop: 20, fontFamily: PEN, fontSize: 50, color: INK }}>a finger of space between them</div>
      </div>
    </AbsoluteFill>
  );
};

// 16 ── SEVEN: hervor suave vs hervor fuerte (burbujas CSS) + 30 minutos
export const SimmerGauge: P<{ no: number; t: number; boil: number; mins: number }> = ({ a, d, no, t, boil, mins }) => {
  const { f, at } = useT(a);
  const Pot: React.FC<{ hard?: boolean; on: boolean }> = ({ hard, on }) => (
    <div style={{ position: "relative", width: 620, height: 420, opacity: on ? 1 : 0.2 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, #2a2a2a 0 70%, #8d9498 72%, #c9ced1 80%, #5f666a 100%)", zIndex: 2 }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 14, bottom: 14, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%, #d2452f, #8e2414)", overflow: "hidden" }}>
          {Array.from({ length: hard ? 22 : 6 }).map((_, i) => {
            const ph = ((f * (hard ? 3.2 : 0.9) + i * 37) % 60) / 60;
            const x = (i * 97) % 520, y = (i * 53) % 70;
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: (hard ? 34 : 18) * ph, height: (hard ? 26 : 14) * ph, borderRadius: "50%", border: "3px solid rgba(255,190,170,0.7)", opacity: 1 - ph }} />;
          })}
          {[0, 1, 2].map((i) => <div key={"b" + i} style={{ position: "absolute", left: 120 + i * 130, top: 22 + (hard ? 8 * Math.sin(f / 2 + i) : 2 * Math.sin(f / 12 + i)) }}><Ball s={64} cooked /></div>)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0, borderRadius: "0 0 40px 40px", background: "linear-gradient(90deg, #6f7477, #d5dadd 30%, #9aa2a6 60%, #5c6164)", boxShadow: SH }} />
    </div>
  );
  return (
    <Table f={f} d={d} top={STEELT} h={0.3} dark>
      <NumTab n={no} f={f} />
      <div style={{ position: "absolute", left: 140, top: 300 }}><Pot on={f >= at(t)} /><div style={{ marginTop: 40, textAlign: "center" }}><Pill txt="low simmer ✓" bg={BASIL} size={64} /></div></div>
      <div style={{ position: "absolute", left: 1150, top: 300 }}><Pot hard on={f >= at(boil)} /><div style={{ marginTop: 40, textAlign: "center", opacity: f >= at(boil) ? 1 : 0.2 }}><Pill txt="hard boil ✗" bg={TOM} size={64} /></div></div>
      {f >= at(mins) ? <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center" }}><Rise f={f} at={at(mins)}><Big size={120} color={CREAM} style={{ textShadow: "0 5px 14px rgba(0,0,0,0.6)" }}>30 MINUTES</Big></Rise></div> : null}
    </Table>
  );
};

// 17 ── MONEY: bolsa congelada vs restaurante vs a la manera de Stan (menos de 1 dólar cada una)
type W3 = { t?: number; price: string; txt: string; sub: string };
export const ThreeWays: P<{ bag: W3; rest: W3; home?: W3; each?: number }> = ({ a, d, bag, rest, home, each }) => {
  const { f, at } = useT(a);
  const Card: React.FC<{ x: W3; good?: boolean; i: number }> = ({ x, good, i }) => (
    <Rise f={f} at={x.t === undefined ? -40 : at(x.t)} y={160}>
      <div style={{ width: 500, height: 600, background: good ? CREAM : "#e9e6df", boxShadow: SH, borderRadius: 18, position: "relative", overflow: "hidden", transform: `rotate(${(i - 1) * 2}deg)` }}>
        <div style={{ height: 120, background: good ? BASIL : i === 0 ? "#6e8fa6" : "#8a6a52", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB2, fontWeight: 900, fontSize: 48, color: CREAM, letterSpacing: 2 }}>{x.txt}</div>
        <div style={{ textAlign: "center", fontFamily: SLAB2, fontWeight: 900, fontSize: 170, color: good ? BASIL : INK, marginTop: 40 }}>{x.price}</div>
        <div style={{ textAlign: "center", fontFamily: PEN, fontSize: 52, color: INK }}>{x.sub}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 30 }}>{Array.from({ length: good ? 6 : i === 0 ? 4 : 3 }).map((_, j) => <Ball key={j} s={56} cooked={!good} />)}</div>
      </div>
    </Rise>
  );
  return (
    <Table f={f} d={d} top={CHECK} h={0.4}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 60 }}>
        <Card x={bag} i={0} /><Card x={rest} i={1} />{home && home.t !== undefined && f >= at(home.t) ? <Card x={home} i={2} good /> : <div style={{ width: 500, height: 600, border: "6px dashed rgba(0,0,0,0.25)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB2, fontWeight: 900, fontSize: 200, color: "rgba(0,0,0,0.25)" }}>?</div>}
      </div>
      {each !== undefined && f >= at(each) ? <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}><Rise f={f} at={at(each)}><Pill txt="less than $1 a meatball" bg={TOM} size={70} /></Rise></div> : null}
    </Table>
  );
};

// 18 ── RECAP: los tickets de pedido colgados de un hilo con broches (2 tandas)
export const TicketLine: P<{ tix: { t: number; txt: string }[]; done?: string[] }> = ({ a, d, tix, done = [] }) => {
  const { f, at } = useT(a);
  const all = [...done.map((txt) => ({ txt, t: a - 30 })), ...tix];
  return (
    <Table f={f} d={d} top={STEELT} h={0.25}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Big size={64}>THE 7 TRICKS</Big></div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 200, height: 6, background: "#6b5a45", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", transform: "rotate(-0.6deg)" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 190, display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const x = all[i];
          if (!x) return <div key={i} style={{ width: 240 }} />;
          const k = done.length && i < done.length ? 1 : sp(f, at(x.t), 10, 130);
          const sw = done.length && i < done.length ? 0 : (1 - k) * 25 * Math.cos(f / 4);
          return (
            <div key={i} style={{ width: 240, transformOrigin: "50% 0%", transform: `translateY(${-500 * (1 - k)}px) rotate(${sw + (i % 2 ? 2 : -2)}deg)`, opacity: cl(k * 2) }}>
              <div style={{ width: 40, height: 70, margin: "0 auto -20px", borderRadius: 6, background: "linear-gradient(90deg, #b88a55, #e0b77f, #a8794a)", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", position: "relative", zIndex: 2 }} />
              <div style={{ background: "#FFFDF7", boxShadow: SH, padding: "30px 18px 40px", minHeight: 520, boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0 1px, transparent 1px 6px)",
                clipPath: "polygon(0 0, 100% 0, 100% 96%, 92% 100%, 84% 96%, 76% 100%, 68% 96%, 60% 100%, 52% 96%, 44% 100%, 36% 96%, 28% 100%, 20% 96%, 12% 100%, 4% 96%, 0 100%)" }}>
                <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 100, color: TOM, textAlign: "center", lineHeight: 1 }}>{i + 1}</div>
                <div style={{ borderTop: "3px dashed rgba(0,0,0,0.25)", margin: "16px 0" }} />
                <div style={{ fontFamily: PEN, fontSize: 44, color: INK, lineHeight: 1.15, textAlign: "center" }}>{x.txt}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Table>
  );
};

// 19 ── TROUBLE: diagnóstico en tablilla (síntoma → causas que se tachan → el arreglo)
export const Diagnosis: P<{ sym: string; t: number; causes: { t: number; txt: string }[]; fix: { t: number; txt: string } }> = ({ a, d, sym, t, causes, fix }) => {
  const { f, at } = useT(a);
  const k = sp(f, at(t), 13, 120);
  return (
    <Table f={f} d={d} h={0.5} top={CHECK}>
      <div style={{ position: "absolute", left: 560, top: 70, width: 800, height: 900, transform: `translateY(${300 * (1 - k)}px) rotate(${-2 * k}deg)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(135deg, #8a5a32, #5e3b1e)", boxShadow: SH,
          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 6px, transparent 6px 22px), linear-gradient(135deg, #8a5a32, #5e3b1e)" }} />
        <div style={{ position: "absolute", left: 300, top: -30, width: 200, height: 80, borderRadius: 14, ...STEELT, boxShadow: "0 8px 14px rgba(0,0,0,0.4)", zIndex: 2 }} />
        <div style={{ position: "absolute", left: 40, right: 40, top: 50, bottom: 40, background: "#FFFDF6", boxShadow: "0 6px 12px rgba(0,0,0,0.25)", padding: "60px 50px", boxSizing: "border-box",
          backgroundImage: "repeating-linear-gradient(180deg, transparent 0 78px, rgba(70,110,170,0.25) 78px 80px)" }}>
          <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 40, color: "#777", letterSpacing: 4 }}>SYMPTOM</div>
          <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 84, color: TOM, lineHeight: 1.1 }}>{sym}</div>
          <div style={{ fontFamily: SLAB2, fontWeight: 900, fontSize: 40, color: "#777", letterSpacing: 4, marginTop: 30 }}>BECAUSE…</div>
          {causes.map((c, i) => (
            <div key={i} style={{ position: "relative", marginTop: 14 }}>
              <Hand txt={"✗ " + c.txt} f={f} at={at(c.t)} size={64} color={INK} />
            </div>
          ))}
          {f >= at(fix.t) ? <Rise f={f} at={at(fix.t)}><div style={{ marginTop: 40, fontFamily: PEN, fontSize: 58, color: CREAM, background: BASIL, padding: "8px 26px", borderRadius: 10, display: "inline-block", boxShadow: SH }}>fix: {fix.txt}</div></Rise> : null}
        </div>
      </div>
    </Table>
  );
};
