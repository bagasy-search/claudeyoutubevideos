// clyde6 · componentes PROPIOS del video de la salchicha de desayuno casera (Sg*). PURO CSS (pedido del creador 16-oct): cero imágenes.
// Mundo visual: el ahumadero FRÍO de noviembre — tablas de pino nudoso, papel kraft de carnicero, pizarra de tiza, palangana enlozada
// blanca con borde azul cobalto (y su saltadura), escarcha, bolsa de lienzo, salvia, carne picada a cuchillo (puntitos de grasa blanca).
// 2 familias: Rye (cartel de feria, Tennessee) + Caveat (mano/lápiz). Si una pieza se parte por una ventana del avatar, a0 = inicio original.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadRye } from "@remotion/google-fonts/Rye";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { sp, fr } from "../lkit/core";

const RYE = loadRye("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const CAV = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
type P<T> = React.FC<T & { a: number; d: number; a0?: number }>;
const K = { pine: "#C99A5E", pineD: "#8A5E30", ink: "#2A1D14", kraft: "#C9A577", kraftL: "#E2C79F", cream: "#F5EBD8", enamel: "#F6F3EC", cobalt: "#1F3F7A",
  red: "#A93226", redD: "#741D16", sage: "#6F8A52", frost: "#CFE6F0", ice: "#7FB5D0", pink: "#D0796A", fat: "#F7EDE2", chalk: "#F1EFE6", gold: "#D9A441", green: "#3F7A44" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
const lin = (f: number, at: number, dur = 14) => ez((f - at) / dur);
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 16px 30px rgba(0,0,0,0.30), 0 48px 90px rgba(0,0,0,0.26)";
// tiempo base: si la pieza viene partida por una ventana del avatar, la animación sigue desde a0
const useB = (a: number, a0?: number) => {
  const f0 = useCurrentFrame(); const base = a0 ?? a;
  return { f: f0 + fr(a) - fr(base), at: (t: number) => fr(t) - fr(base) };
};

// ═══ TEXTURAS (gradientes, sin imágenes) ═══
const pineBg = [
  "radial-gradient(ellipse 26px 16px at 18% 32%, rgba(70,38,12,0.55), rgba(70,38,12,0) 70%)",
  "radial-gradient(ellipse 20px 13px at 63% 71%, rgba(70,38,12,0.5), rgba(70,38,12,0) 70%)",
  "radial-gradient(ellipse 30px 18px at 84% 18%, rgba(70,38,12,0.5), rgba(70,38,12,0) 70%)",
  "repeating-linear-gradient(90deg, rgba(60,30,8,0.55) 0 4px, transparent 4px 240px)",
  "repeating-linear-gradient(90deg, rgba(255,230,190,0.06) 0 2px, transparent 2px 17px)",
  "repeating-linear-gradient(88deg, rgba(90,50,20,0.10) 0 1px, transparent 1px 7px)",
  `linear-gradient(180deg, #B8844A, ${K.pineD})`].join(", ");
const kraftBg = `repeating-linear-gradient(8deg, rgba(110,75,40,0.07) 0 2px, transparent 2px 9px), repeating-linear-gradient(-63deg, rgba(255,240,215,0.07) 0 1px, transparent 1px 5px), radial-gradient(ellipse at 30% 25%, ${K.kraftL}, ${K.kraft})`;
const butcherBg = `repeating-linear-gradient(12deg, rgba(150,120,90,0.07) 0 2px, transparent 2px 10px), radial-gradient(ellipse at 30% 20%, #FFFFFF, #EEE6D8)`;
const chalkBg = `radial-gradient(ellipse 40% 25% at 30% 30%, rgba(255,255,255,0.06), transparent 70%), radial-gradient(ellipse 30% 20% at 75% 70%, rgba(255,255,255,0.05), transparent 70%), repeating-linear-gradient(170deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 11px), linear-gradient(180deg, #2B332D, #1C221E)`;
const linenBg = `repeating-linear-gradient(0deg, rgba(120,100,70,0.10) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(120,100,70,0.10) 0 1px, transparent 1px 4px), linear-gradient(180deg, #F3EBDC, #E2D6C0)`;
const steelBg = `conic-gradient(from 200deg at 50% 50%, #E9EDF0, #A9B1B8 20%, #EEF1F3 35%, #9AA3AB 55%, #E4E8EB 72%, #B3BAC0 88%, #E9EDF0)`;
const frostBg = `radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.0) 40%, rgba(235,248,255,0.85) 100%), repeating-linear-gradient(35deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 14px), linear-gradient(180deg, #D7ECF5, #9CC4D8)`;
const paperLines = `repeating-linear-gradient(180deg, transparent 0 62px, rgba(70,110,170,0.35) 62px 64px), linear-gradient(90deg, transparent 0 120px, rgba(200,60,60,0.45) 120px 123px, transparent 123px), #FBF8F0`;

const Bg: React.FC<{ bg: string; st?: React.CSSProperties; children?: React.ReactNode }> = ({ bg, st, children }) => <AbsoluteFill style={{ background: bg, overflow: "hidden", ...st }}>{children}</AbsoluteFill>;
const Light: React.FC<{ x?: string; y?: string; op?: number }> = ({ x = "28%", y = "12%", op = 0.28 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at ${x} ${y}, rgba(255,244,222,${op}), transparent 70%), radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(30,15,5,0.35))`, pointerEvents: "none" }} />
);
const Ry: React.FC<{ s: number; c?: string; st?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = K.ink, st, children }) => (
  <div style={{ fontFamily: RYE, fontSize: s, color: c, lineHeight: 1.05, letterSpacing: 1, ...st }}>{children}</div>
);
const Hd: React.FC<{ s: number; c?: string; st?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = K.ink, st, children }) => (
  <div style={{ fontFamily: CAV, fontWeight: 700, fontSize: s, color: c, lineHeight: 1.05, ...st }}>{children}</div>
);
// escritura a mano (barrido de izquierda a derecha)
const Write: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; st?: React.CSSProperties }> = ({ f, at, dur = 16, children, st }) => {
  const p = lin(f, at, dur);
  return <div style={{ clipPath: `inset(-30% ${100 - p * 103}% -30% -3%)`, opacity: p > 0 ? 1 : 0, ...st }}>{children}</div>;
};
const Pop: React.FC<{ f: number; at: number; children: React.ReactNode; st?: React.CSSProperties; dy?: number; dx?: number; sc?: number; rot?: number }> = ({ f, at, children, st, dy = 30, dx = 0, sc = 0, rot = 0 }) => {
  const s = sp(f, at, 14, 150);
  return <div style={{ opacity: cl(s * 1.5), transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) scale(${1 - sc * (1 - s)}) rotate(${(1 - s) * rot}deg)`, ...st }}>{children}</div>;
};
// sello de goma que golpea
const Stamp: React.FC<{ f: number; at: number; c?: string; s?: number; rot?: number; st?: React.CSSProperties; children: React.ReactNode }> = ({ f, at, c = K.red, s = 70, rot = -8, st, children }) => {
  const k = sp(f, at, 11, 210);
  return (
    <div style={{ position: "absolute", opacity: cl(k * 2), transform: `rotate(${rot}deg) scale(${1.9 - 0.9 * k})`, ...st }}>
      <div style={{ fontFamily: RYE, fontSize: s, color: c, padding: "10px 30px", border: `7px solid ${c}`, borderRadius: 14, letterSpacing: 2, whiteSpace: "nowrap",
        boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.0)`, opacity: 0.9, mixBlendMode: "multiply", background: "repeating-linear-gradient(115deg, transparent 0 9px, rgba(255,255,255,0.18) 9px 11px)" }}>{children}</div>
    </div>
  );
};
const Check: React.FC<{ f: number; at: number; ok?: boolean; s?: number }> = ({ f, at, ok = true, s = 74 }) => {
  const k = sp(f, at, 10, 220);
  return <div style={{ width: s, height: s, borderRadius: "50%", flex: "0 0 auto", background: ok ? K.green : K.red, color: "#fff", fontFamily: RYE, fontSize: s * 0.6, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})`, boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }}>{ok ? "✓" : "✕"}</div>;
};
// tarjeta de papel con chinche / cinta
const Card: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; rot?: number; k?: number; tape?: boolean; children?: React.ReactNode; st?: React.CSSProperties }> = ({ x, y, w, h, bg = kraftBg, rot = 0, k = 1, tape, children, st }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, borderRadius: 6, boxShadow: SH, transform: `perspective(1800px) rotateX(${(1 - k) * 22}deg) translateY(${(1 - k) * 80}px) rotate(${rot}deg)`, opacity: cl(k * 1.6), ...st }}>
    {tape ? <div style={{ position: "absolute", left: w / 2 - 90, top: -26, width: 180, height: 52, background: "linear-gradient(180deg, rgba(245,235,200,0.85), rgba(225,210,170,0.85))", transform: "rotate(-3deg)", boxShadow: "0 3px 6px rgba(0,0,0,0.2)" }} /> : null}
    {children}
  </div>
);
// pedacitos de cerdo picado a cuchillo (rosa con grasa blanca), deterministas
const Pork: React.FC<{ n: number; w: number; h: number; sz?: number; seed?: number; smear?: number; paste?: number }> = ({ n, w, h, sz = 26, seed = 1, smear = 0, paste = 0 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: number) => ((Math.sin((i + 1) * 12.9898 * (k + seed)) * 43758.5453) % 1 + 1) % 1;
      const s = sz * (0.6 + r(1) * 0.8), fatty = r(2) > 0.72;
      return <div key={i} style={{ position: "absolute", left: r(3) * (w - s), top: r(4) * (h - s), width: s * (1 + smear * 1.8), height: s * (1 - smear * 0.4), borderRadius: `${40 + r(5) * 30}% ${30 + r(6) * 40}% ${45 + r(7) * 25}% ${35 + r(8) * 30}%`,
        background: fatty ? `radial-gradient(circle at 35% 30%, #FFFFFF, ${K.fat} 60%, #E8D5C2)` : `radial-gradient(circle at 35% 30%, #EBA394, ${K.pink} 55%, #A9524A), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.8) 0 12%, transparent 13%)`,
        transform: `rotate(${r(9) * 180}deg)`, boxShadow: paste ? "none" : "0 3px 4px rgba(0,0,0,0.25)", opacity: 1 - paste * 0.6 }} />;
    })}
  </>
);
// palangana enlozada blanca con borde cobalto y la saltadura (vista desde arriba)
const Dishpan: React.FC<{ d: number; x: number; y: number; children?: React.ReactNode; rim?: string }> = ({ d, x, y, children, rim = K.cobalt }) => (
  <div style={{ position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #FFFFFF, ${K.enamel} 55%, #D9D4C8)`, boxShadow: `${SH}, inset 0 0 0 ${d * 0.045}px ${rim}` }}>
    <div style={{ position: "absolute", left: d * 0.78, top: d * 0.1, width: d * 0.07, height: d * 0.05, borderRadius: "45% 55% 40% 60%", background: "#1A1A1A", opacity: 0.85 }} />
    <div style={{ position: "absolute", inset: d * 0.1, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #FFFFFF, #ECE8DE 70%, #CFC9BB)", boxShadow: "inset 0 18px 40px rgba(0,0,0,0.22)", overflow: "hidden" }}>{children}</div>
  </div>
);
// etiqueta de precio colgante (cartón con ojal e hilo)
const Tag: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; children?: React.ReactNode; bg?: string }> = ({ x, y, w, h, rot = 0, children, bg = "#F8F1DF" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, transformOrigin: "50% -120px" }}>
    <div style={{ position: "absolute", left: w / 2 - 2, top: -120, width: 3, height: 140, background: "linear-gradient(180deg, #8B7355, #5E4A33)" }} />
    <div style={{ position: "absolute", inset: 0, background: bg, clipPath: "polygon(18% 0, 82% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", boxShadow: SH }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(10deg, rgba(150,120,90,0.07) 0 2px, transparent 2px 8px)" }} />
      <div style={{ position: "absolute", left: w / 2 - 16, top: 22, width: 32, height: 32, borderRadius: "50%", background: "#6B4F33", boxShadow: "inset 0 3px 5px rgba(0,0,0,0.6)" }} />
      {children}
    </div>
  </div>
);
// bruma de frío (manchas que suben)
const Mist: React.FC<{ f: number; x: number; y: number; w?: number; n?: number; op?: number }> = ({ f, x, y, w = 600, n = 8, op = 0.4 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const per = 80 + (i % 3) * 20, ph = ((f + i * 23) % per) / per, sz = 90 + ph * 170;
      return <div key={i} style={{ position: "absolute", left: x + ((i * 83) % w) - sz / 2 + 24 * Math.sin((f + i * 30) / 18), top: y - ph * 240 - sz / 2, width: sz, height: sz * 0.7, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(235,248,255,0.65), rgba(235,248,255,0) 68%)", opacity: op * Math.sin(Math.PI * ph) }} />;
    })}
  </>
);

// ═══ 1 · El rollito de la tienda: 1 libra, $5,49 (HOOK) ═══
export const SgPriceTag: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const roll = sp(f, 0, 14, 110), tg = sp(f, at(t) - 6, 9, 70), sw = Math.sin(f / 9) * 5 * (1 - cl((f - at(t)) / 60));
  return (
    <Bg bg={pineBg}>
      <Light />
      {/* mostrador */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, bottom: 0, background: `repeating-linear-gradient(0deg, rgba(60,30,10,0.18) 0 2px, transparent 2px 15px), linear-gradient(180deg, #7A4C24, #4E2F15)`, boxShadow: "0 -10px 30px rgba(0,0,0,0.4)" }} />
      {/* rollito en plástico */}
      <div style={{ position: "absolute", left: 300, top: 470, width: 760, height: 250, transform: `translateX(${(1 - roll) * -500}px) rotate(-4deg)`, opacity: cl(roll * 1.5) }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 20, bottom: 20, borderRadius: 120, background: `radial-gradient(ellipse at 50% 30%, #F0B7A8, #D88C7C 50%, #B9675A)`, boxShadow: SH }}>
          <Pork n={70} w={640} h={210} sz={16} seed={3} paste={0.7} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 120, background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0 10%, transparent 30%, transparent 70%, rgba(255,255,255,0.25) 82%, transparent 92%)" }} />
        </div>
        {[0, 1].map((s) => <div key={s} style={{ position: "absolute", [s ? "right" : "left"]: 0, top: 70, width: 90, height: 110, background: "linear-gradient(90deg, rgba(255,255,255,0.75), rgba(230,230,230,0.5))", clipPath: s ? "polygon(0 15%, 100% 0, 85% 50%, 100% 100%, 0 85%)" : "polygon(0 0, 100% 15%, 100% 85%, 0 100%, 15% 50%)" }} />)}
      </div>
      <Tag x={1220} y={250} w={460} h={560} rot={sw + (1 - tg) * -30}>
        <div style={{ opacity: cl(tg * 2), position: "absolute", inset: 0 }}>
          <Ry s={64} c={K.ink} st={{ position: "absolute", top: 90, width: "100%", textAlign: "center" }}>STORE ROLL</Ry>
          <Write f={f} at={at(t)} st={{ position: "absolute", top: 175, width: 460 }}><Ry s={120} c={K.cobalt} st={{ textAlign: "center" }}>1 LB</Ry></Write>
          <div style={{ position: "absolute", left: 40, right: 40, top: 320, height: 4, background: "rgba(42,29,20,0.4)" }} />
          <Pop f={f} at={at(t2)} sc={0.6} dy={0}><Ry s={140} c={K.red} st={{ position: "absolute", top: 350, width: 460, textAlign: "center" }}>$5.49</Ry></Pop>
        </div>
      </Tag>
      <Pop f={f} at={at(t2) + 22} st={{ position: "absolute", left: 230, top: 150 }}><Hd s={96} c={K.cream} st={{ textShadow: "0 4px 10px rgba(0,0,0,0.6)", transform: "rotate(-4deg)" }}>one little pound…</Hd></Pop>
    </Bg>
  );
};

// ═══ 2 · Pizarra: ni moledora, ni embutidora, ni máquina (HOOK) ═══
export const SgNoMachine: P<{ t: number; t2: number; t3: number; t4: number }> = ({ a, a0, t, t2, t3, t4 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 14, 100), card = sp(f, at(t4) - 4, 13, 120);
  const items = [["GRINDER", t], ["STUFFER", t2], ["MACHINE", t3]] as const;
  return (
    <Bg bg={pineBg}>
      <Light x="50%" y="5%" />
      <div style={{ position: "absolute", left: 140, top: 90, width: 1100, height: 880, borderRadius: 10, background: `linear-gradient(135deg, #8A5A2C, #5C3816)`, boxShadow: SH, transform: `perspective(1800px) rotateY(${(1 - k) * -25}deg)`, opacity: cl(k * 1.5) }}>
        <div style={{ position: "absolute", inset: 34, borderRadius: 4, background: chalkBg, boxShadow: "inset 0 8px 24px rgba(0,0,0,0.7)" }}>
          <Ry s={62} c="rgba(241,239,230,0.75)" st={{ position: "absolute", top: 40, width: "100%", textAlign: "center", letterSpacing: 6 }}>YOU DO NOT NEED</Ry>
          {items.map(([w, tt], i) => {
            const x = lin(f, at(tt) + 6, 10);
            return (
              <div key={w} style={{ position: "absolute", left: 120, top: 190 + i * 200, width: 790, height: 160 }}>
                <Write f={f} at={at(tt) - 8} dur={12}><Ry s={120} c={K.chalk} st={{ textShadow: "0 0 6px rgba(255,255,255,0.35)", opacity: 0.92 }}>{w}</Ry></Write>
                <div style={{ position: "absolute", left: -20, top: 70, width: 760 * x, height: 16, background: "#E05A4A", borderRadius: 8, transform: "rotate(-4deg)", boxShadow: "0 0 8px rgba(224,90,74,0.6)", opacity: 0.95 }} />
                <div style={{ position: "absolute", left: -20, top: 70, width: 760 * lin(f, at(tt) + 12, 10), height: 16, background: "#E05A4A", borderRadius: 8, transform: "rotate(5deg)", opacity: 0.95 }} />
              </div>
            );
          })}
        </div>
      </div>
      <Card x={1290} y={260} w={520} h={600} bg={butcherBg} rot={3} k={card} tape>
        <Hd s={76} c={K.red} st={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>just:</Hd>
        {["a knife", "a bowl", "a cold morning"].map((s, i) => (
          <Pop key={s} f={f} at={at(t4) + 8 + i * 12} dx={-30} dy={0} st={{ position: "absolute", left: 60, top: 170 + i * 130, display: "flex", gap: 22, alignItems: "center" }}>
            <Check f={f} at={at(t4) + 8 + i * 12} s={66} /><Hd s={74}>{s}</Hd>
          </Pop>
        ))}
      </Card>
    </Bg>
  );
};

// ═══ 3 · Ticket de pedido en el gancho: la promesa + 8 trucos (PROMISE) ═══
export const SgPromise: P<{ items: { txt: string; t: number }[]; t2: number }> = ({ a, a0, items, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 13, 90);
  return (
    <Bg bg={pineBg}>
      <Light x="40%" y="10%" />
      <div style={{ position: "absolute", left: 960 - 34, top: 40, width: 68, height: 68, borderRadius: "50%", background: steelBg, boxShadow: SH }} />
      <div style={{ position: "absolute", left: 360, top: 80, width: 1200, height: 900, transformOrigin: "50% 0", transform: `rotate(${(1 - k) * 8 + Math.sin(f / 22) * 0.6}deg)`, opacity: cl(k * 1.5) }}>
        <div style={{ position: "absolute", inset: 0, background: butcherBg, boxShadow: SH, clipPath: "polygon(0 0, 100% 0, 100% 96%, 96% 100%, 92% 96%, 88% 100%, 84% 96%, 80% 100%, 76% 96%, 72% 100%, 68% 96%, 64% 100%, 60% 96%, 56% 100%, 52% 96%, 48% 100%, 44% 96%, 40% 100%, 36% 96%, 32% 100%, 28% 96%, 24% 100%, 20% 96%, 16% 100%, 12% 96%, 8% 100%, 4% 96%, 0 100%)" }} />
        <Ry s={74} c={K.cobalt} st={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>YOUR SAUSAGE WILL…</Ry>
        <div style={{ position: "absolute", left: 80, right: 80, top: 150, borderTop: "4px dashed rgba(42,29,20,0.35)" }} />
        {items.map((it, i) => (
          <Pop key={i} f={f} at={at(it.t)} dx={-40} dy={0} st={{ position: "absolute", left: 120, top: 200 + i * 135, display: "flex", gap: 34, alignItems: "center" }}>
            <Check f={f} at={at(it.t) + 4} s={82} /><Ry s={78} c={i === 3 ? K.red : K.ink} st={{ whiteSpace: "nowrap" }}>{it.txt}</Ry>
          </Pop>
        ))}
      </div>
      <Stamp f={f} at={at(t2)} s={84} rot={-5} st={{ left: 470, top: 830 }}>8 SMOKEHOUSE TRICKS</Stamp>
    </Bg>
  );
};

// ═══ 4 · Tabla con letras quemadas: 55 años (INTRO) ═══
export const SgYears: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const burn = lin(f, at(t) - 6, 24), n = Math.round(55 * cl(burn));
  return (
    <Bg bg={`radial-gradient(ellipse at 50% 45%, #3B2716, #170D06)`}>
      <div style={{ position: "absolute", left: 260, top: 230, width: 1400, height: 520, borderRadius: 18, background: pineBg, boxShadow: `${SH}, inset 0 0 60px rgba(60,30,8,0.6)`, transform: `perspective(1600px) rotateX(${8 - 8 * burn}deg)` }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
          <div style={{ fontFamily: RYE, fontSize: 300, color: "#2A1406", textShadow: `0 0 ${30 * (1 - burn) + 4}px rgba(255,120,30,${0.9 - 0.6 * burn}), 0 2px 0 rgba(255,220,170,0.25)`, letterSpacing: 4 }}>{n}</div>
          <div>
            <Ry s={110} c="#2A1406" st={{ textShadow: `0 0 ${18 * (1 - burn)}px rgba(255,120,30,0.8)` }}>YEARS</Ry>
            <Hd s={70} c="#3A1E0A" st={{ marginTop: 6 }}>cutting hogs</Hd>
          </div>
        </div>
        {Array.from({ length: 10 }).map((_, i) => {
          const ph = ((f + i * 17) % 50) / 50;
          return <div key={i} style={{ position: "absolute", left: 300 + i * 85, top: 360 - ph * 260, width: 8, height: 8, borderRadius: "50%", background: "#FFB15A", boxShadow: "0 0 10px #FF7A1A", opacity: (1 - ph) * (1 - burn * 0.7) }} />;
        })}
      </div>
      <Stamp f={f} at={at(t2)} c={K.gold} s={70} rot={-4} st={{ left: 640, top: 800 }}>EAST TENNESSEE</Stamp>
    </Bg>
  );
};

// ═══ 5 · Almanaque de pared: noviembre de 1958, carneada (STORY) ═══
export const SgCalendar: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, at(t) - 10, 13, 100), flip = lin(f, at(t) - 10, 16), circ = lin(f, at(t2), 22);
  return (
    <Bg bg={pineBg}>
      <Light />
      <div style={{ position: "absolute", left: 560, top: 70, width: 800, height: 950, transform: `perspective(1800px) translateY(${(1 - k) * 60}px)`, opacity: cl(k * 1.5) }}>
        <div style={{ position: "absolute", left: 370, top: -14, width: 60, height: 60, borderRadius: "50%", background: steelBg, boxShadow: SH, zIndex: 3 }} />
        <div style={{ position: "absolute", inset: 0, background: "#F2E8D2", boxShadow: SH, borderRadius: 4 }}>
          <div style={{ height: 230, background: `linear-gradient(180deg, ${K.red}, ${K.redD})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Ry s={110} c={K.cream}>NOVEMBER</Ry>
            <Ry s={90} c={K.gold} st={{ marginTop: 6 }}>1958</Ry>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "26px 30px", rowGap: 18 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <Ry key={i} s={40} c={K.cobalt} st={{ textAlign: "center" }}>{d}</Ry>)}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 5; const ok = day >= 1 && day <= 30;
              return <div key={i} style={{ position: "relative", textAlign: "center", fontFamily: RYE, fontSize: 46, color: day === 22 ? K.red : K.ink, opacity: ok ? 0.85 : 0, height: 84 }}>
                {ok ? day : ""}
                {day === 22 ? <div style={{ position: "absolute", left: -10, top: -14, width: 120, height: 90, borderRadius: "50%", border: `6px solid ${K.red}`, clipPath: `inset(0 ${100 - circ * 100}% 0 0)`, transform: "rotate(-8deg)" }} /> : null}
              </div>;
            })}
          </div>
        </div>
        {/* hoja de octubre que se arranca */}
        <div style={{ position: "absolute", inset: 0, background: "#EFE3C8", boxShadow: SH, transformOrigin: "50% 0", transform: `rotateX(${flip * 100}deg)`, opacity: flip > 0.95 ? 0 : 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          <div style={{ height: 230, width: "100%", background: `linear-gradient(180deg, #6B5A3A, #4A3D26)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ry s={110} c={K.cream}>OCTOBER</Ry></div>
        </div>
      </div>
      <Pop f={f} at={at(t2) + 14} rot={-6} st={{ position: "absolute", left: 1370, top: 640 }}><Hd s={88} c={K.cream} st={{ textShadow: "0 4px 10px rgba(0,0,0,0.6)", transform: "rotate(-6deg)" }}>hog killing!</Hd></Pop>
    </Bg>
  );
};

// ═══ 6 · El dicho del abuelo pintado en una tabla (STORY_C · SIX_C · CLOSE_C) ═══
export const SgSaying: P<{ t: number; t2: number; t3: number; hl?: number; fin?: boolean }> = ({ a, a0, t, t2, t3, hl = 0, fin }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 14, 100);
  const L = [["KEEP IT COLD", t, "#BFE3F2"], ["KEEP IT COARSE", t2, "#F2B9A8"], ["KEEP YOUR HANDS OUT OF THE WARM", t3, K.chalk]] as const;
  return (
    <Bg bg={`radial-gradient(ellipse at 50% 40%, #2C3A33, #111714)`}>
      <Mist f={f} x={200} y={1100} w={1500} n={10} op={0.25} />
      <div style={{ position: "absolute", left: 150, top: 140, width: 1620, height: 800, borderRadius: 8, background: chalkBg, boxShadow: `${SH}, inset 0 0 0 26px #6E4A26, inset 0 0 0 30px #3E2812`, transform: `perspective(1800px) rotateX(${(1 - k) * 20}deg)`, opacity: cl(k * 1.5) }}>
        <Hd s={64} c="rgba(241,239,230,0.6)" st={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>Granddaddy used to say…</Hd>
        {L.map(([s, tt, c], i) => {
          const on = hl === 0 || hl === i + 1, glow = hl === i + 1 ? 0.5 + 0.5 * Math.sin(f / 7) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 0, width: "100%", top: 200 + i * 175, display: "flex", justifyContent: "center" }}>
              <Write f={f} at={at(tt) - 4} dur={i === 2 ? 24 : 14}>
                <Ry s={i === 2 ? 92 : 128} c={c} st={{ opacity: on ? 1 : 0.32, textShadow: `0 0 8px rgba(255,255,255,0.35), 0 0 ${30 * glow}px rgba(255,255,255,${0.6 * glow})`, whiteSpace: "nowrap" }}>{s}</Ry>
              </Write>
            </div>
          );
        })}
        {fin ? <Pop f={f} at={at(t3) + 30}><Hd s={60} c="rgba(241,239,230,0.75)" st={{ position: "absolute", right: 90, top: 700 }}>— Granddaddy, 1958</Hd></Pop> : null}
      </div>
    </Bg>
  );
};

// ═══ 7 · Truco N: la palangana enlozada de la abuela con el número adentro ═══
export const SgTrick: P<{ n: number; name: string; sub: string; t: number; hot?: boolean }> = ({ a, a0, n, name, sub, t, hot }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, Math.min(at(t) - 6, 4), 12, 120), s2 = sp(f, Math.min(at(t) - 6, 4) + 10, 14, 120);
  return (
    <Bg bg={pineBg}>
      <Light x="30%" y="20%" />
      <div style={{ transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -25}deg)`, opacity: cl(k * 1.6), position: "absolute", left: 170, top: 190 }}>
        <Dishpan d={700} x={0} y={0} rim={hot ? K.red : K.cobalt}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Ry s={70} c={hot ? K.red : K.cobalt} st={{ letterSpacing: 6 }}>TRICK</Ry>
            <Ry s={330} c={hot ? K.red : K.cobalt} st={{ marginTop: -20, textShadow: "0 6px 0 rgba(0,0,0,0.12)" }}>{n}</Ry>
          </div>
        </Dishpan>
      </div>
      <div style={{ position: "absolute", left: 960, top: 300, width: 860, opacity: cl(s2 * 1.5), transform: `translateX(${(1 - s2) * 80}px)` }}>
        <div style={{ background: kraftBg, padding: "40px 50px", boxShadow: SH, transform: "rotate(-2deg)", borderRadius: 4 }}>
          <Ry s={name.length > 12 ? 92 : 112} c={K.ink}>{name}</Ry>
        </div>
        <Hd s={74} c={K.cream} st={{ marginTop: 40, textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>{sub}</Hd>
      </div>
      {hot ? <Stamp f={f} at={Math.min(at(t) - 6, 4) + 24} s={80} st={{ left: 1300, top: 760 }}>1958</Stamp> : null}
    </Bg>
  );
};

// ═══ 8 · Lámina de cortes del cerdo: la paleta (ONE) ═══
const Hog: React.FC<{ lit: number }> = ({ lit }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 640 }}>
    {/* patas */}
    {[180, 330, 820, 960].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 470, width: 95, height: 170, borderRadius: "0 0 22px 22px", background: i < 2 && lit > 0 ? `linear-gradient(180deg, rgba(208,121,106,${lit}), #E9C9B9)` : "#E9C9B9", border: "5px solid #3A2A1E" }} />)}
    <div style={{ position: "absolute", left: 120, top: 120, width: 1000, height: 420, borderRadius: "48% 52% 46% 54% / 55% 55% 45% 45%", background: "#EFD3C4", border: "6px solid #3A2A1E", overflow: "hidden" }}>
      {/* paleta (arriba de la pata delantera) */}
      <div style={{ position: "absolute", left: 40, top: 0, width: 300, height: 420, background: `rgba(208,121,106,${0.15 + 0.85 * lit})`, borderRight: "5px dashed #3A2A1E", boxShadow: lit > 0 ? `inset 0 0 ${60 * lit}px rgba(255,240,220,0.6)` : "none" }} />
      <div style={{ position: "absolute", left: 340, top: 0, width: 330, height: 420, borderRight: "5px dashed #3A2A1E", background: "rgba(0,0,0,0.03)" }} />
      <div style={{ position: "absolute", left: 340, top: 230, width: 660, height: 5, background: "repeating-linear-gradient(90deg, #3A2A1E 0 16px, transparent 16px 28px)" }} />
    </div>
    {/* cabeza */}
    <div style={{ position: "absolute", left: -40, top: 150, width: 260, height: 260, borderRadius: "50% 40% 45% 55%", background: "#EFD3C4", border: "6px solid #3A2A1E" }} />
    <div style={{ position: "absolute", left: -90, top: 250, width: 100, height: 80, borderRadius: "45%", background: "#E7B9A8", border: "6px solid #3A2A1E" }} />
    <div style={{ position: "absolute", left: 40, top: 110, width: 90, height: 110, borderRadius: "10% 90% 10% 90%", background: "#E7B9A8", border: "6px solid #3A2A1E", transform: "rotate(-20deg)" }} />
    <div style={{ position: "absolute", left: 40, top: 220, width: 22, height: 22, borderRadius: "50%", background: "#3A2A1E" }} />
    <div style={{ position: "absolute", left: 1105, top: 190, width: 60, height: 60, borderRadius: "50%", border: "6px solid #3A2A1E", borderLeftColor: "transparent", borderBottomColor: "transparent" }} />
  </div>
);
export const SgHogMap: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 14, 100), lit = lin(f, at(t) - 8, 14);
  return (
    <Bg bg={butcherBg}>
      <Ry s={70} c={K.cobalt} st={{ position: "absolute", top: 60, width: "100%", textAlign: "center", letterSpacing: 4 }}>NOT THE BACK END</Ry>
      <div style={{ position: "absolute", left: 300, top: 220, transform: `scale(${0.95 + 0.05 * k})`, opacity: cl(k * 1.5) }}><Hog lit={lit} /></div>
      <Pop f={f} at={at(t) - 2} st={{ position: "absolute", left: 120, top: 870 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: `60px solid ${K.red}`, transform: "rotate(30deg)" }} />
          <Ry s={84} c={K.red}>SHOULDER</Ry><Hd s={66} c={K.ink}>· "Boston butt" · top of the front leg</Hd>
        </div>
      </Pop>
      <Tag x={1520} y={300} w={330} h={400} rot={6 + Math.sin(f / 10) * 3 * (1 - lin(f, at(t2) + 30, 40))}>
        <div style={{ opacity: cl(sp(f, at(t2) - 4, 12, 140) * 2), position: "absolute", inset: 0 }}>
          <Ry s={110} c={K.red} st={{ position: "absolute", top: 110, width: "100%", textAlign: "center" }}>$2.19</Ry>
          <Hd s={64} c={K.ink} st={{ position: "absolute", top: 250, width: "100%", textAlign: "center" }}>a pound</Hd>
        </div>
      </Tag>
    </Bg>
  );
};

// ═══ 9 · Corte transversal: 1 parte grasa, 3 partes magro (ONE_B) ═══
export const SgRatio: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const parts = [0, 1, 2, 3].map((i) => sp(f, at(t) - 8 + i * 6, 12, 140));
  return (
    <Bg bg={kraftBg}>
      <Light x="50%" y="0%" />
      <Ry s={96} c={K.redD} st={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>SAUSAGE NEEDS FAT</Ry>
      <div style={{ position: "absolute", left: 560, top: 230, width: 800, height: 700, transform: "perspective(1500px) rotateX(14deg) rotateZ(-2deg)" }}>
        {parts.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: i * 172, width: 800, height: 162, borderRadius: 18, transform: `translateX(${(1 - p) * (i % 2 ? 900 : -900)}px)`, boxShadow: SH,
            background: i === 0 ? `repeating-linear-gradient(100deg, rgba(230,215,200,0.5) 0 6px, transparent 6px 22px), radial-gradient(ellipse at 40% 30%, #FFFFFF, ${K.fat} 60%, #E3CDB8)` : `repeating-linear-gradient(80deg, rgba(255,255,255,0.18) 0 3px, transparent 3px 18px), radial-gradient(ellipse at 40% 30%, #E9A091, ${K.pink} 55%, #A44E44)` }}>
            {i > 0 ? <Pork n={10} w={780} h={150} sz={20} seed={i + 4} /> : null}
          </div>
        ))}
      </div>
      <Pop f={f} at={at(t2)} dx={40} dy={0} st={{ position: "absolute", left: 1420, top: 260 }}><Ry s={92} c={K.ink}>1 FAT</Ry></Pop>
      <Pop f={f} at={at(t2) + 6} dx={40} dy={0} st={{ position: "absolute", left: 1420, top: 600 }}><Ry s={92} c={K.redD}>3 LEAN</Ry></Pop>
      <Stamp f={f} at={at(t2) + 22} s={70} rot={-10} c={K.green} st={{ left: 110, top: 520 }}>DON'T TRIM IT</Stamp>
    </Bg>
  );
};

// ═══ 10 · Balanza colgante: 8 lb → 7 lb de carne (ONE_C) ═══
export const SgYield: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const w = lin(f, at(t) - 10, 22), bone = lin(f, at(t2) - 14, 18), val = 8 - bone;
  const ang = -140 + 280 * (val / 10) * w;
  return (
    <Bg bg={pineBg}>
      <Light />
      <div style={{ position: "absolute", left: 365, top: 0, width: 10, height: 185, background: "#555" }} />
      <div style={{ position: "absolute", left: 60, top: 180, width: 460, height: 460, borderRadius: "50%", background: steelBg, boxShadow: SH, transform: "scale(1.35)", transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", inset: 34, borderRadius: "50%", background: "radial-gradient(circle, #FFFDF5, #EDE6D3)", boxShadow: "inset 0 6px 16px rgba(0,0,0,0.3)" }}>
          {Array.from({ length: 11 }).map((_, i) => {
            const an = (-140 + 28 * i) * Math.PI / 180;
            return <div key={i} style={{ position: "absolute", left: 196 + 150 * Math.sin(an) - 20, top: 196 - 150 * Math.cos(an) - 20, width: 40, textAlign: "center", fontFamily: RYE, fontSize: 30, color: K.ink }}>{i}</div>;
          })}
          <div style={{ position: "absolute", left: 193, top: 46, width: 6, height: 150, background: K.red, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, borderRadius: 3 }} />
          <div style={{ position: "absolute", left: 178, top: 180, width: 36, height: 36, borderRadius: "50%", background: "#333" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 760, top: 200, width: 1100 }}>
        <Pop f={f} at={at(t) - 6}><Ry s={180} c={K.cream} st={{ textShadow: "0 6px 14px rgba(0,0,0,0.5)" }}>8 LB <span style={{ fontSize: 80 }}>shoulder</span></Ry></Pop>
        <div style={{ position: "relative", height: 140, marginTop: 10 }}>
          <div style={{ position: "absolute", left: 40, top: 30, width: 380, height: 70, borderRadius: 40, background: "linear-gradient(180deg, #FFFDF5, #E8DFC8)", boxShadow: SH, transform: `translate(${bone * 900}px, ${-bone * 120}px) rotate(${bone * 40}deg)`, opacity: 1 - bone * 0.9 }}>
            {[0, 1].map((s) => <div key={s} style={{ position: "absolute", [s ? "right" : "left"]: -30, top: -10, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFDF5, #E3D8BE)" }} />)}
          </div>
          <Hd s={64} c={K.cream} st={{ position: "absolute", left: 500, top: 30, opacity: cl(bone * 2) }}>bone out</Hd>
        </div>
        <Pop f={f} at={at(t2) - 2} sc={0.4}><Ry s={180} c={K.gold} st={{ textShadow: "0 6px 14px rgba(0,0,0,0.5)" }}>7 LB <span style={{ fontSize: 80 }}>of meat</span></Ry></Pop>
      </div>
      <Pop f={f} at={at(t2) + 30} rot={-5} st={{ position: "absolute", left: 900, top: 830 }}><Hd s={84} c={K.cream} st={{ transform: "rotate(-5deg)", borderBottom: `5px solid ${K.red}` }}>remember that number</Hd></Pop>
    </Bg>
  );
};

// ═══ 11 · Freezer abierto: 45 minutos, bowl y cuchillo adentro (TWO) ═══
export const SgFreezer: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 14, 100), sec = Math.max(0, 45 * 60 - Math.floor(f * 6));
  const mm = String(Math.floor(sec / 60)).padStart(2, "0"), ss = String(sec % 60).padStart(2, "0");
  return (
    <Bg bg={frostBg}>
      <Mist f={f} x={300} y={1080} w={1300} n={12} op={0.55} />
      {/* bandeja con cubos escarchados */}
      <div style={{ position: "absolute", left: 110, top: 300, width: 900, height: 560, borderRadius: 18, background: steelBg, boxShadow: SH, transform: `perspective(1600px) rotateX(${38 - 10 * k}deg)`, opacity: cl(k * 1.4) }}>
        <div style={{ position: "absolute", inset: 26, borderRadius: 10, background: "linear-gradient(180deg, #DDE3E7, #B8C1C7)", overflow: "hidden" }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 24 + (i % 8) * 104, top: 24 + Math.floor(i / 8) * 100, width: 80, height: 76, borderRadius: 12,
              background: i % 4 === 1 ? `radial-gradient(circle at 35% 30%, #FFFFFF, ${K.fat})` : `radial-gradient(circle at 35% 30%, #EAA898, ${K.pink} 60%, #A9524A)`, boxShadow: "0 4px 6px rgba(0,0,0,0.25), inset 0 0 0 4px rgba(235,248,255,0.65)" }} />
          ))}
        </div>
      </div>
      {/* reloj de cocina */}
      <div style={{ position: "absolute", left: 1150, top: 140, width: 620, height: 300, borderRadius: 30, background: "linear-gradient(180deg, #2A2F33, #121517)", boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: RYE, fontSize: 190, color: "#9FE3FF", textShadow: "0 0 18px rgba(120,210,255,0.8)", letterSpacing: 6 }}>{mm}:{ss}</div>
      </div>
      <Ry s={62} c={K.cobalt} st={{ position: "absolute", left: 1150, top: 470, width: 620, textAlign: "center", whiteSpace: "nowrap" }}>IN THE FREEZER</Ry>
      <Pop f={f} at={at(t) - 4} dx={60} dy={0} st={{ position: "absolute", left: 1170, top: 640, display: "flex", gap: 24, alignItems: "center" }}><Check f={f} at={at(t)} s={70} /><Hd s={80}>+ the mixing bowl</Hd></Pop>
      <Pop f={f} at={at(t2) - 4} dx={60} dy={0} st={{ position: "absolute", left: 1170, top: 770, display: "flex", gap: 24, alignItems: "center" }}><Check f={f} at={at(t2)} s={70} /><Hd s={80}>+ your knife</Hd></Pop>
    </Bg>
  );
};

// ═══ 12 · Termómetro de la grasa: fría corta limpio, tibia se embarra (TWO_B) ═══
export const SgFatTemp: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const rise = lin(f, 0, 30), sm = lin(f, at(t2) - 2, 16);
  return (
    <Bg bg={butcherBg}>
      <div style={{ position: "absolute", left: 200, top: 120, width: 120, height: 820, borderRadius: 60, background: "linear-gradient(90deg, #F4F7F9, #D3DADF 50%, #F4F7F9)", boxShadow: SH }}>
        <div style={{ position: "absolute", left: 40, bottom: 120, width: 40, height: 520 * rise + 60, borderRadius: 20, background: `linear-gradient(0deg, ${K.red}, #E0574A)` }} />
        <div style={{ position: "absolute", left: 10, bottom: 10, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #F07060, ${K.red})` }} />
      </div>
      <Hd s={56} c={K.cobalt} st={{ position: "absolute", left: 350, top: 760 }}>freezer-cold</Hd>
      <Hd s={56} c={K.red} st={{ position: "absolute", left: 350, top: 150 }}>room temperature</Hd>
      {/* lado frío */}
      <div style={{ position: "absolute", left: 700, top: 160, width: 1080, height: 330, borderRadius: 16, background: frostBg, boxShadow: SH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 30, top: 40, width: 420, height: 250 }}><Pork n={16} w={420} h={250} sz={46} seed={2} /></div>
        <Ry s={84} c={K.cobalt} st={{ position: "absolute", left: 500, top: 70 }}>COLD FAT</Ry>
        <Hd s={70} c={K.ink} st={{ position: "absolute", left: 500, top: 175 }}>the knife cuts it clean</Hd>
      </div>
      <div style={{ position: "absolute", left: 700, top: 560, width: 1080, height: 330, borderRadius: 16, background: `radial-gradient(ellipse at 30% 40%, #FBE3D2, #EFC7AE)`, boxShadow: SH, overflow: "hidden", opacity: cl(sp(f, at(t) - 6, 13, 120) * 1.5) }}>
        <div style={{ position: "absolute", left: 30, top: 40, width: 420, height: 250, transform: `skewX(${-28 * sm}deg)` }}><Pork n={16} w={420} h={250} sz={46} seed={2} smear={sm} /></div>
        <Ry s={84} c={K.red} st={{ position: "absolute", left: 500, top: 70 }}>WARM FAT</Ry>
        <div style={{ position: "absolute", left: 500, top: 175, transform: `scaleX(${1 + 0.35 * sm}) skewX(${-14 * sm}deg)`, transformOrigin: "0 50%" }}><Hd s={70} c={K.ink}>the knife SMEARS it</Hd></div>
      </div>
    </Bg>
  );
};

// ═══ 13 · Tabla de tamaños: del tamaño de una arveja (THREE_B) ═══
export const SgPeaSize: P<{ t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 14, 120);
  const sizes = [[46, "smaller"], [64, "PEA"], [86, "bigger"]] as const;
  return (
    <Bg bg={`repeating-linear-gradient(90deg, rgba(60,30,10,0.12) 0 3px, transparent 3px 120px), repeating-linear-gradient(0deg, rgba(60,30,10,0.08) 0 2px, transparent 2px 14px), linear-gradient(180deg, #A97843, #7C5128)`}>
      <Light />
      <Ry s={84} c={K.cream} st={{ position: "absolute", top: 50, width: "100%", textAlign: "center", textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>THE SIZE OF A PEA</Ry>
      <div style={{ position: "absolute", left: 180, top: 200, width: 1560, height: 330, background: butcherBg, boxShadow: SH, borderRadius: 8, opacity: cl(k * 1.5), display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {sizes.map(([s, l], i) => (
          <Pop key={l} f={f} at={at(t) - 10 + i * 6} sc={0.6} st={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ width: s * 1.6, height: s * 1.5, borderRadius: "45% 55% 50% 50%", background: `radial-gradient(circle at 35% 30%, #EBA394, ${K.pink} 55%, #A9524A), radial-gradient(circle at 70% 65%, #FFF 0 14%, transparent 15%)`, boxShadow: "0 8px 12px rgba(0,0,0,0.3)" }} />
            <Hd s={i === 1 ? 84 : 64} c={i === 1 ? K.red : K.ink}>{l}</Hd>
          </Pop>
        ))}
      </div>
      <div style={{ position: "absolute", left: 180, top: 600, width: 740, height: 380, background: kraftBg, boxShadow: SH, borderRadius: 8, opacity: cl(sp(f, at(t2) - 6, 13, 120) * 1.5), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 30, top: 30, width: 400, height: 320 }}><Pork n={30} w={400} h={320} sz={40} seed={7} /></div>
        <Ry s={60} c={K.green} st={{ position: "absolute", left: 450, top: 80 }}>LOOSE</Ry><Ry s={60} c={K.green} st={{ position: "absolute", left: 450, top: 160 }}>COARSE</Ry>
        <div style={{ position: "absolute", left: 470, top: 250 }}><Check f={f} at={at(t2) + 6} s={86} /></div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 600, width: 740, height: 380, background: `linear-gradient(180deg, #E9DED0, #D5C6B3)`, boxShadow: SH, borderRadius: 8, opacity: cl(sp(f, at(t3) - 8, 13, 120) * 1.5), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 60, width: 360, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #E2B2A2, #C98E7E 60%, #A97264)", boxShadow: "inset 0 -14px 20px rgba(0,0,0,0.2), 0 10px 16px rgba(0,0,0,0.3)" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.15) 0 2px, transparent 3px) 0 0 / 22px 22px" }} />
        </div>
        <Ry s={60} c={K.red} st={{ position: "absolute", left: 440, top: 80 }}>SPONGY</Ry><Ry s={60} c={K.red} st={{ position: "absolute", left: 440, top: 160 }}>STORE</Ry>
        <div style={{ position: "absolute", left: 460, top: 250 }}><Check f={f} at={at(t3) + 4} s={86} ok={false} /></div>
      </div>
    </Bg>
  );
};

// ═══ 14 · Reloj de pared: 7 lb en 30 minutos · la abuela 40 lb (THREE_C) ═══
export const SgClock: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const sw = lin(f, at(t) - 6, 40), deg = 180 * sw;
  return (
    <Bg bg={pineBg}>
      <Light x="30%" y="30%" />
      <div style={{ position: "absolute", left: 160, top: 170, width: 740, height: 740, borderRadius: "50%", background: `linear-gradient(135deg, #8A5A2C, #4C2E12)`, boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #FFFBF0, #EDE2C8)", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `conic-gradient(rgba(127,181,208,0.55) 0deg ${deg}deg, transparent ${deg}deg)` }} />
          {Array.from({ length: 12 }).map((_, i) => {
            const an = i * 30 * Math.PI / 180;
            return <div key={i} style={{ position: "absolute", left: 330 + 270 * Math.sin(an) - 30, top: 330 - 270 * Math.cos(an) - 30, width: 60, textAlign: "center", fontFamily: RYE, fontSize: 48, color: K.ink }}>{i === 0 ? 12 : i}</div>;
          })}
          <div style={{ position: "absolute", left: 326, top: 70, width: 8, height: 260, background: K.ink, transformOrigin: "50% 100%", transform: `rotate(${deg * 12}deg)`, borderRadius: 4 }} />
          <div style={{ position: "absolute", left: 322, top: 140, width: 16, height: 190, background: K.red, transformOrigin: "50% 100%", transform: `rotate(${deg}deg)`, borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 305, top: 305, width: 50, height: 50, borderRadius: "50%", background: K.ink }} />
        </div>
      </div>
      <Pop f={f} at={at(t) - 4} st={{ position: "absolute", left: 1000, top: 230 }}><Ry s={150} c={K.cream} st={{ textShadow: "0 6px 14px rgba(0,0,0,0.5)" }}>30 MIN</Ry><Hd s={76} c={K.cream}>for 7 pounds, by hand</Hd></Pop>
      <Card x={1000} y={580} w={760} h={360} k={sp(f, at(t2) - 4, 13, 120)} rot={-2} tape>
        <Hd s={70} c={K.ink} st={{ position: "absolute", left: 40, top: 50 }}>Grandmother:</Hd>
        <Ry s={100} c={K.red} st={{ position: "absolute", left: 40, top: 140 }}>40 LB</Ry>
        <Hd s={60} c={K.ink} st={{ position: "absolute", left: 44, top: 262 }}>a morning, singing ♪</Hd>
      </Card>
    </Bg>
  );
};

// ═══ 15 · La cuenta de la sal: 1½ cdta × 7 lb = 10½ (FOUR) ═══
export const SgSaltMath: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 14, 100);
  return (
    <Bg bg={chalkBg} st={{ boxShadow: "inset 0 0 0 26px #6E4A26" }}>
      <Hd s={70} c="rgba(241,239,230,0.7)" st={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>coarse kosher salt</Hd>
      <div style={{ position: "absolute", left: 0, width: "100%", top: 250, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 40, opacity: cl(k * 1.5) }}>
        <Write f={f} at={2} dur={14}><Ry s={170} c="#F6E7B0">1½ tsp</Ry></Write>
        <Write f={f} at={14} dur={8}><Ry s={140} c={K.chalk}>×</Ry></Write>
        <Write f={f} at={20} dur={14}><Ry s={170} c="#F2B9A8">7 lb</Ry></Write>
      </div>
      <div style={{ position: "absolute", left: 460, top: 470, width: 1000 * lin(f, 34, 14), height: 10, background: K.chalk, borderRadius: 5, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 0, width: "100%", top: 520, display: "flex", justifyContent: "center" }}>
        <Pop f={f} at={42} sc={0.5}><Ry s={220} c="#BFE3F2" st={{ textShadow: "0 0 14px rgba(191,227,242,0.6)" }}>= 10½ tsp</Ry></Pop>
      </div>
      <Stamp f={f} at={at(t2)} s={80} rot={-6} c="#E05A4A" st={{ left: 600, top: 850 }}>MEASURE · DON'T SHAKE</Stamp>
    </Bg>
  );
};

// ═══ 16 · Dos cucharas: kosher vs de mesa, casi el doble de salada (FOUR_B) ═══
const SaltSpoon: React.FC<{ fine: boolean }> = ({ fine }) => (
  <div style={{ position: "relative", width: 620, height: 300 }}>
    <div style={{ position: "absolute", left: 360, top: 120, width: 270, height: 50, borderRadius: 25, background: steelBg, boxShadow: SH }} />
    <div style={{ position: "absolute", left: 0, top: 10, width: 400, height: 280, borderRadius: "50%", background: steelBg, boxShadow: SH }}>
      <div style={{ position: "absolute", inset: 24, borderRadius: "50%", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.25)", background: fine
        ? "radial-gradient(circle, #FFFFFF 0 1.6px, transparent 2.2px) 0 0 / 8px 8px, radial-gradient(circle, #F4F4F4 0 1.6px, transparent 2.2px) 4px 4px / 8px 8px, radial-gradient(circle at 40% 35%, #FFFFFF, #E9EDF0)"
        : "radial-gradient(circle, #FFFFFF 0 7px, transparent 8px) 0 0 / 34px 30px, radial-gradient(circle, #F2F2F2 0 6px, transparent 7px) 16px 15px / 34px 30px, radial-gradient(circle at 40% 35%, #C9D0D5, #A9B2B9)" }} />
    </div>
  </div>
);
export const SgSpoons: P<{ t: number }> = ({ a, a0, t }) => {
  const { f, at } = useB(a, a0);
  return (
    <Bg bg={kraftBg}>
      <Light x="50%" y="0%" />
      <Ry s={78} c={K.ink} st={{ position: "absolute", top: 60, width: "100%", textAlign: "center" }}>SAME SPOON · NOT THE SAME SALT</Ry>
      {[0, 1].map((i) => {
        const k = sp(f, i * 10, 13, 120);
        return (
          <div key={i} style={{ position: "absolute", left: 140 + i * 860, top: 220, width: 780, height: 560, borderRadius: 16, background: butcherBg, boxShadow: SH, opacity: cl(k * 1.5), transform: `translateY(${(1 - k) * 60}px)` }}>
            <div style={{ position: "absolute", left: 80, top: 60 }}><SaltSpoon fine={i === 1} /></div>
            <Ry s={70} c={i ? K.red : K.cobalt} st={{ position: "absolute", top: 400, width: "100%", textAlign: "center" }}>{i ? "FINE TABLE SALT" : "COARSE KOSHER"}</Ry>
            <Hd s={60} c={K.ink} st={{ position: "absolute", top: 480, width: "100%", textAlign: "center" }}>{i ? "only 1 tsp a pound" : "1½ tsp a pound"}</Hd>
          </div>
        );
      })}
      <Stamp f={f} at={at(t)} s={96} c={K.red} rot={-5} st={{ left: 1040, top: 840 }}>≈ 2× SALTIER</Stamp>
    </Bg>
  );
};

// ═══ 17 · Ficha de receta en la caja de lata: la mezcla de Tennessee (FIVE) ═══
export const SgBlend: P<{ items: { q: string; txt: string; t: number }[]; t2: number }> = ({ a, a0, items, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 14, 100);
  return (
    <Bg bg={pineBg}>
      <Light />
      {/* caja de lata */}
      <div style={{ position: "absolute", left: 320, top: 620, width: 1280, height: 420, borderRadius: 18, background: `linear-gradient(180deg, ${K.sage}, #4E6538)`, boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "radial-gradient(circle, rgba(255,255,255,0.12) 0 2px, transparent 3px) 0 0 / 40px 40px" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, borderRadius: "18px 18px 0 0", background: "linear-gradient(180deg, #8DA56C, #5E7744)" }} />
      </div>
      <div style={{ position: "absolute", left: 360, top: 110, width: 1200, height: 720, borderRadius: 10, background: `repeating-linear-gradient(180deg, transparent 0 96px, rgba(70,110,170,0.35) 96px 98px), linear-gradient(180deg, transparent 0 130px, rgba(200,60,60,0.5) 130px 133px, transparent 133px), #FBF6E8`, boxShadow: SH, transform: `translateY(${(1 - k) * 500}px) rotate(${(1 - k) * 4 - 1}deg)` }}>
        <Hd s={78} c={K.redD} st={{ position: "absolute", left: 50, top: 30 }}>Breakfast Sausage — per pound</Hd>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: 60, top: 160 + i * 98, display: "flex", gap: 40, alignItems: "baseline" }}>
            <Write f={f} at={at(it.t) - 4} dur={10}><Hd s={82} c={K.cobalt} st={{ width: 220 }}>{it.q}</Hd></Write>
            <Write f={f} at={at(it.t)} dur={16}><Hd s={82} c={K.ink}>{it.txt}</Hd></Write>
          </div>
        ))}
      </div>
      <Stamp f={f} at={at(t2)} s={72} rot={-5} c={K.green} st={{ left: 560, top: 860 }}>OLD TENNESSEE BLEND</Stamp>
    </Bg>
  );
};

// ═══ 18 · La liga: de migas sueltas a pegajosa, como masa de pan (SIX_B) ═══
export const SgBind: P<{ t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useB(a, a0);
  const p = cl((f - at(t) + 6) / (at(t3) - at(t) + 1));
  const st = [t, t2, t3].map((x) => sp(f, at(x) - 6, 12, 140));
  return (
    <Bg bg={butcherBg}>
      <Ry s={96} c={K.cobalt} st={{ position: "absolute", top: 60, width: "100%", textAlign: "center" }}>THE BIND</Ry>
      <div style={{ position: "absolute", left: 200, top: 210, display: "flex", gap: 90 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "relative", width: 440, height: 440, opacity: cl(st[i] * 1.5), transform: `scale(${0.8 + 0.2 * st[i]})` }}>
            <Dishpan d={440} x={0} y={0}>
              {i === 0 ? <div style={{ position: "absolute", inset: 30 }}><Pork n={34} w={280} h={280} sz={32} seed={11} /></div> : null}
              {i === 1 ? <div style={{ position: "absolute", left: 50, top: 60, width: 250, height: 220, borderRadius: "42% 58% 50% 50%", background: `radial-gradient(circle at 40% 35%, #EBA394, ${K.pink} 60%, #A9524A)`, boxShadow: "0 8px 12px rgba(0,0,0,0.3)" }}>
                <Pork n={14} w={240} h={210} sz={22} seed={5} />
                {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 230, top: 50 + j * 50, width: 60 + 20 * Math.sin(f / 8 + j), height: 6, borderRadius: 3, background: K.pink, transform: `rotate(${-20 + j * 20}deg)` }} />)}
              </div> : null}
              {i === 2 ? <div style={{ position: "absolute", left: 50, top: 50, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, #F2B8A9, ${K.pink} 60%, #9E4D43)`, boxShadow: "0 10px 14px rgba(0,0,0,0.3), inset 0 -10px 20px rgba(0,0,0,0.15)" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.7) 0 3px, transparent 4px) 0 0 / 34px 30px" }} />
              </div> : null}
            </Dishpan>
            <Hd s={68} c={i === 2 ? K.green : K.ink} st={{ position: "absolute", top: 470, width: 440, textAlign: "center", whiteSpace: "nowrap" }}>{["loose crumbs", "tacky", "like bread dough"][i]}</Hd>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 220, top: 880, width: 1480, height: 26, borderRadius: 13, background: "#E0D6C6", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.2)" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 13, background: `linear-gradient(90deg, ${K.pink}, ${K.green})` }} />
      </div>
      <Hd s={56} c={K.ink} st={{ position: "absolute", left: 220, top: 930 }}>salt + ice water + 2 minutes of squeezing</Hd>
    </Bg>
  );
};

// ═══ 19 · Pizarra de ajustes de la hamburguesita de prueba (SEVEN_B) ═══
export const SgTasteFix: P<{ t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useB(a, a0);
  const rows = [["tastes flat", "+ a little salt", 2], ["no bite", "+ red pepper", 14], ["want it sweeter", "+ brown sugar", Math.max(26, at(t3) - 8)]] as const;
  return (
    <Bg bg={chalkBg} st={{ boxShadow: "inset 0 0 0 26px #6E4A26" }}>
      <Ry s={80} c={K.chalk} st={{ position: "absolute", top: 70, width: "100%", textAlign: "center", opacity: 0.9 }}>TASTE THE TEST PATTY</Ry>
      {rows.map(([q, fx, at0], i) => (
        <div key={i} style={{ position: "absolute", left: 180, top: 260 + i * 220, width: 1560, display: "flex", alignItems: "center" }}>
          <Write f={f} at={at0} dur={12} st={{ width: 640 }}><Hd s={96} c={K.chalk}>{q}</Hd></Write>
          <div style={{ width: 200 * lin(f, at0 + 10, 8), height: 8, background: K.chalk, opacity: 0.8, position: "relative" }}>
            <div style={{ position: "absolute", right: -6, top: -14, width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `26px solid ${K.chalk}`, opacity: lin(f, at0 + 16, 4) }} />
          </div>
          <Pop f={f} at={at0 + 16} dx={-30} dy={0} st={{ marginLeft: 60 }}><Ry s={92} c={["#F6E7B0", "#F28A7A", "#E7C08A"][i]}>{fx}</Ry></Pop>
        </div>
      ))}
      <Pop f={f} at={at(t2) + 10}><Hd s={60} c="rgba(241,239,230,0.65)" st={{ position: "absolute", right: 140, top: 950 }}>…the valley way</Hd></Pop>
    </Bg>
  );
};

// ═══ 20 · Una noche en la heladera: la sal y la salvia entran, se hace un rollo firme (EIGHT_B) ═══
export const SgOvernight: P<{ t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useB(a, a0);
  const s1 = lin(f, at(t) - 6, 50), s2 = lin(f, at(t2) - 6, 50), firm = lin(f, at(t3) - 6, 24), hr = 10 + 8 * lin(f, 0, at(t3) + 20);
  const H = Math.floor(hr) % 12 || 12;
  return (
    <Bg bg={`radial-gradient(ellipse at 50% 30%, #1F2E45, #0B111C)`}>
      {/* luna y estrellas */}
      <div style={{ position: "absolute", left: 1560, top: 90, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFBE8, #E8DDB5)", boxShadow: "0 0 60px rgba(255,250,220,0.5)" }} />
      <div style={{ position: "absolute", left: 1600, top: 70, width: 150, height: 150, borderRadius: "50%", background: "#16233A" }} />
      {Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 211) % 1900, top: (i * 97) % 360, width: 4, height: 4, borderRadius: 2, background: "#FFF", opacity: 0.4 + 0.4 * Math.sin(f / 10 + i) }} />)}
      <Ry s={84} c={K.cream} st={{ position: "absolute", left: 120, top: 80 }}>ONE NIGHT IN THE SACK</Ry>
      <Hd s={70} c="#9FC6E8" st={{ position: "absolute", left: 120, top: 190 }}>{H}:00 {hr >= 12 && hr < 24 ? "AM" : "PM"}</Hd>
      {/* corte del rollo en la bolsa de lienzo */}
      <div style={{ position: "absolute", left: 220, top: 340, width: 1480, height: 560, borderRadius: 280, background: linenBg, boxShadow: `${SH}, inset 0 0 40px rgba(0,0,0,0.25)`, transform: `scaleY(${1 - 0.06 * firm})` }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: 240, background: `radial-gradient(ellipse at 40% 35%, #E6A193, ${K.pink} 60%, #9C4A40)`, overflow: "hidden", boxShadow: "inset 0 0 30px rgba(0,0,0,0.35)" }}>
          <Pork n={60} w={1400} h={480} sz={34} seed={9} paste={firm * 0.35} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 240, background: `radial-gradient(ellipse ${20 + 90 * s1}% ${20 + 90 * s1}% at 50% 50%, transparent 60%, rgba(255,255,255,${0.35 * (1 - s1)}) 80%, transparent 100%), radial-gradient(circle, rgba(255,255,255,${0.75 * s1}) 0 2px, transparent 3px) 0 0 / 46px 38px` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 240, background: `radial-gradient(circle, rgba(85,110,60,${0.9 * s2}) 0 3px, transparent 4px) 13px 9px / 52px 44px, radial-gradient(circle, rgba(30,25,20,${0.8 * s2}) 0 2px, transparent 3px) 27px 21px / 40px 50px` }} />
        </div>
      </div>
      <Pop f={f} at={at(t) - 2} dx={-30} dy={0} st={{ position: "absolute", left: 230, top: 930 }}><Hd s={70} c="#F6F1E6">salt — all the way through</Hd></Pop>
      <Pop f={f} at={at(t2) - 2} dx={-30} dy={0} st={{ position: "absolute", left: 1000, top: 930 }}><Hd s={70} c="#B7D59A">sage &amp; pepper — soak in</Hd></Pop>
      <Stamp f={f} at={at(t3)} s={74} c={K.gold} rot={-5} st={{ left: 700, top: 560 }}>ONE SOLID LOG</Stamp>
    </Bg>
  );
};

// ═══ 21 · Cocinada al toque vs reposada en la bolsa (EIGHT_B) ═══
export const SgRestVs: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const L = sp(f, at(t) - 6, 13, 120), R = sp(f, at(t2) - 6, 13, 120);
  const Round: React.FC<{ rich: boolean }> = ({ rich }) => (
    <div style={{ width: 360, height: 360, borderRadius: "50%", background: rich ? "radial-gradient(circle at 40% 35%, #8A4A28, #5C2E14 60%, #3A1C0B)" : "radial-gradient(circle at 40% 35%, #C9A08A, #A87F6A 60%, #8C6654)", boxShadow: "0 14px 24px rgba(0,0,0,0.4)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: rich ? `radial-gradient(circle, rgba(111,138,82,0.95) 0 3px, transparent 4px) 0 0 / 30px 28px, radial-gradient(circle at 45% 40%, #D88A72, #B4614E)` : "radial-gradient(circle at 45% 40%, #D9B3A3, #C49A88)" }} />
    </div>
  );
  return (
    <Bg bg={butcherBg}>
      <div style={{ position: "absolute", left: 958, top: 0, bottom: 0, width: 4, background: "rgba(120,90,60,0.25)" }} />
      <div style={{ position: "absolute", left: 0, width: 960, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, opacity: cl(L * 1.5), transform: `translateY(${(1 - L) * 60}px)` }}>
        <Ry s={64} c="#8C6654">COOKED RIGHT AWAY</Ry><Round rich={false} /><Hd s={80} c="#6A5244">= seasoned pork</Hd>
      </div>
      <div style={{ position: "absolute", left: 960, width: 960, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, opacity: cl(R * 1.5), transform: `translateY(${(1 - R) * 60}px)` }}>
        <Ry s={64} c={K.redD}>RESTED IN THE SACK</Ry><Round rich /><Ry s={90} c={K.green}>= SAUSAGE</Ry>
      </div>
    </Bg>
  );
};

// ═══ 22 · Panel de la cocina enlozada: perilla en medio-bajo (COOK) ═══
export const SgDial: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const knob = sp(f, at(t) - 10, 14, 90);
  const fl = 0.5 + 0.08 * Math.sin(f / 3);
  return (
    <Bg bg={`linear-gradient(180deg, #F3EFE6, #DCD5C6)`}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: `linear-gradient(180deg, ${K.cobalt}, #142B55)` }} />
      <div style={{ position: "absolute", left: 220, top: 260, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E9E3D5 60%, #C9C0AE)", boxShadow: SH }}>
        {["OFF", "LO", "MED", "HI"].map((s, i) => {
          const ang = -120 + i * 70, r = 345;
          return <Ry key={s} s={52} c={i === 1 ? K.cobalt : K.ink} st={{ position: "absolute", left: 300 + r * Math.sin(ang * Math.PI / 180) - 60, top: 300 - r * Math.cos(ang * Math.PI / 180) - 28, width: 120, textAlign: "center" }}>{s}</Ry>;
        })}
        <div style={{ position: "absolute", inset: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFDF8, #DDD5C3)", transform: `rotate(${-120 + 105 * knob}deg)`, boxShadow: "0 14px 22px rgba(0,0,0,0.35)" }}>
          <div style={{ position: "absolute", left: 170, top: 0, width: 50, height: 380, borderRadius: 25, background: "linear-gradient(90deg, #E6DFD0, #FFFFFF, #D6CEBC)", boxShadow: "0 6px 10px rgba(0,0,0,0.25)" }} />
          <div style={{ position: "absolute", left: 186, top: 14, width: 18, height: 70, borderRadius: 9, background: K.red }} />
        </div>
      </div>
      {/* llamita azul baja */}
      <div style={{ position: "absolute", left: 1150, top: 520, width: 560, height: 200, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
        {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ width: 34, height: 70 * fl * (0.8 + 0.2 * Math.sin(f / 4 + i)) * (0.3 + 0.7 * knob), borderRadius: "50% 50% 20% 20%", background: "linear-gradient(0deg, #2F5BD8, #7FB2FF 60%, rgba(255,255,255,0.2))", opacity: 0.9 }} />)}
      </div>
      <div style={{ position: "absolute", left: 1120, top: 720, width: 620, height: 30, borderRadius: 15, background: "linear-gradient(180deg, #3A3633, #121110)" }} />
      <Pop f={f} at={at(t) + 4} st={{ position: "absolute", left: 1100, top: 220 }}><Ry s={110} c={K.cobalt}>MEDIUM LOW</Ry><Hd s={70} c={K.ink}>no oil · cold iron skillet</Hd></Pop>
      <Stamp f={f} at={at(t2)} s={70} c={K.red} rot={-4} st={{ left: 960, top: 830 }}>COLD PAN · SLOW HEAT</Stamp>
    </Bg>
  );
};

// ═══ 23 · Termómetro de pinchar 160 °F + corte sin rosado (COOK_B) ═══
export const SgDone: P<{ t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useB(a, a0);
  const nd = lin(f, 0, 30), ang = -130 + 260 * (160 / 220) * nd;
  return (
    <Bg bg={kraftBg}>
      <Light />
      <div style={{ position: "absolute", left: 200, top: 170, width: 560, height: 560, borderRadius: "50%", background: steelBg, boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 36, borderRadius: "50%", background: "radial-gradient(circle, #FFFFFF, #ECEFF1)", boxShadow: "inset 0 6px 16px rgba(0,0,0,0.25)" }}>
          {[0, 40, 80, 120, 160, 200].map((v) => {
            const an = (-130 + 260 * v / 220) * Math.PI / 180;
            return <div key={v} style={{ position: "absolute", left: 244 + 190 * Math.sin(an) - 40, top: 244 - 190 * Math.cos(an) - 20, width: 80, textAlign: "center", fontFamily: RYE, fontSize: 34, color: v === 160 ? K.red : K.ink }}>{v}</div>;
          })}
          <div style={{ position: "absolute", left: 241, top: 64, width: 6, height: 180, background: K.red, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)` }} />
          <div style={{ position: "absolute", left: 224, top: 226, width: 40, height: 40, borderRadius: "50%", background: "#333" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 470, top: 720, width: 20, height: 300, background: steelBg }} />
      <Ry s={130} c={K.red} st={{ position: "absolute", left: 230, top: 40 }}>160°F</Ry>
      <div style={{ position: "absolute", left: 1000, top: 200, width: 700, height: 420, opacity: cl(sp(f, at(t2) - 10, 13, 120) * 1.5) }}>
        {[0, 1].map((s) => (
          <div key={s} style={{ position: "absolute", left: s * 360, top: s * 20, width: 330, height: 330, borderRadius: s ? "0 50% 50% 0" : "50% 0 0 50%", background: "radial-gradient(circle at 40% 35%, #7A3E20, #4E260F)", boxShadow: SH, transform: `translateX(${s * 20 * lin(f, at(t2) - 10, 14)}px)` }}>
            <div style={{ position: "absolute", [s ? "left" : "right"]: 0, top: 26, width: 300, height: 278, borderRadius: s ? "0 50% 50% 0" : "50% 0 0 50%", background: `radial-gradient(circle, rgba(255,255,255,0.4) 0 2px, transparent 3px) 0 0 / 26px 24px, radial-gradient(circle at 50% 50%, #CDA28C, #B58B72)` }} />
          </div>
        ))}
      </div>
      <Pop f={f} at={at(t2)} dx={40} dy={0} st={{ position: "absolute", left: 1010, top: 690, display: "flex", gap: 24, alignItems: "center" }}><Check f={f} at={at(t2) + 2} s={84} /><Ry s={84}>NO PINK</Ry></Pop>
      <Pop f={f} at={at(t3)} dx={40} dy={0} st={{ position: "absolute", left: 1010, top: 820, display: "flex", gap: 24, alignItems: "center" }}><Check f={f} at={at(t3) + 2} s={84} /><Ry s={84}>CLEAR JUICE</Ry></Pop>
    </Bg>
  );
};

// ═══ 24 · Receta del gravy en la tarjeta + 40 centavos (GRAVY) ═══
export const SgGravy: P<{ t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 13, 110);
  const L = [["3 tbsp", "sausage grease"], ["3 tbsp", "flour · 2 min"], ["2 cups", "cold milk"]];
  return (
    <Bg bg={pineBg}>
      <Light />
      <Card x={240} y={110} w={1000} h={820} bg={`repeating-linear-gradient(180deg, transparent 0 110px, rgba(70,110,170,0.3) 110px 112px), #FBF6E8`} rot={-2} k={k} tape>
        <Hd s={96} c={K.redD} st={{ position: "absolute", left: 60, top: 40 }}>Sunday Sausage Gravy</Hd>
        {L.map(([q, w], i) => (
          <div key={i} style={{ position: "absolute", left: 70, top: 220 + i * 150, display: "flex", gap: 40, alignItems: "baseline" }}>
            <Write f={f} at={4 + i * 7} dur={10}><Ry s={80} c={K.cobalt} st={{ width: 270 }}>{q}</Ry></Write>
            <Write f={f} at={8 + i * 7} dur={12}><Hd s={84}>{w}</Hd></Write>
          </div>
        ))}
        <Write f={f} at={28} dur={14} st={{ position: "absolute", left: 70, top: 680 }}><Hd s={72} c={K.ink}>+ pepper · pinch of salt · 1 round</Hd></Write>
      </Card>
      <Tag x={1400} y={330} w={380} h={460} rot={8 + Math.sin(f / 9) * 3}>
        <div style={{ opacity: cl(sp(f, Math.min(at(t2), 40) - 4, 12, 140) * 2), position: "absolute", inset: 0 }}>
          <Hd s={70} c={K.ink} st={{ position: "absolute", top: 100, width: "100%", textAlign: "center" }}>costs you</Hd>
          <Ry s={160} c={K.red} st={{ position: "absolute", top: 190, width: "100%", textAlign: "center" }}>40¢</Ry>
        </div>
      </Tag>
    </Bg>
  );
};

// ═══ 25 · Planilla de problemas en el portapapeles (FIX) ═══
export const SgFix: P<{ t: number; t2?: number; t3?: number; t4?: number; mode: number }> = ({ a, a0, t, t2, t3, t4, mode }) => {
  const { f, at } = useB(a, a0);
  const rows = [["CRUMBLED", "too lean · bind too short", t], ["GREASE PUDDLE", "fat got warm chopping", t2 ?? t], ["GRAY & TOUGH", "heat too high · you pressed it", t3 ?? t], ["TOO SALTY", "table salt, kosher measure", t4 ?? t]] as const;
  const k = sp(f, 0, 13, 110);
  return (
    <Bg bg={pineBg}>
      <Light />
      <div style={{ position: "absolute", left: 230, top: 60, width: 1460, height: 980, borderRadius: 24, background: "linear-gradient(135deg, #9C6B3A, #6A4420)", boxShadow: SH, transform: `perspective(1800px) rotateX(${(1 - k) * 16}deg)`, opacity: cl(k * 1.5) }}>
        <div style={{ position: "absolute", left: 590, top: -20, width: 280, height: 90, borderRadius: 14, background: steelBg, boxShadow: SH }} />
        <div style={{ position: "absolute", inset: "70px 40px 40px", background: "#FBF8F0", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
          <Ry s={72} c={K.cobalt} st={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>IF SOMETHING WENT WRONG</Ry>
          {rows.map(([p, c, tt], i) => {
            const vis = mode === 1 ? (i === 0 ? 1 : 0.18) : 1;
            const appear = mode === 1 ? (i === 0 ? at(tt) - 4 : 0) : (i === 3 ? at(tt) - 4 : 0);
            return (
              <Pop key={i} f={f} at={appear} dx={-40} dy={0} st={{ position: "absolute", left: 50, top: 170 + i * 175, width: 1280, display: "flex", alignItems: "center", gap: 30, opacity: vis }}>
                <div style={{ width: 70, height: 70, borderRadius: 10, border: `6px solid ${K.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: RYE, fontSize: 60, color: K.green }}>{mode === 2 || i === 0 ? "✓" : ""}</div>
                <Ry s={60} c={K.red} st={{ width: 480, whiteSpace: "nowrap" }}>{p}</Ry>
                <Hd s={62} c={K.ink} st={{ whiteSpace: "nowrap" }}>→ {c}</Hd>
              </Pop>
            );
          })}
        </div>
      </div>
      {mode === 2 ? <Stamp f={f} at={at(t4 ?? t) + 50} s={70} c={K.green} rot={-4} st={{ left: 720, top: 945 }}>EVERY ONE HAS A FIX</Stamp> : null}
    </Bg>
  );
};

// ═══ 26 · Pregunta N con sello de respuesta (ASK) ═══
export const SgQ: P<{ n: number; q: string; ans: string; t: number; t2: number }> = ({ a, a0, n, q, ans, t, t2 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 13, 120);
  return (
    <Bg bg={kraftBg}>
      <Light x="30%" y="20%" />
      <div style={{ position: "absolute", left: 140, top: 160, width: 520, height: 700, borderRadius: 20, background: chalkBg, boxShadow: `${SH}, inset 0 0 0 16px #6E4A26`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${(1 - k) * -10}deg) scale(${0.85 + 0.15 * k})`, opacity: cl(k * 1.5) }}>
        <Hd s={80} c="rgba(241,239,230,0.75)">question</Hd>
        <Ry s={380} c={K.chalk} st={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>{n}</Ry>
      </div>
      <Pop f={f} at={Math.min(at(t), 6)} dx={50} dy={0} st={{ position: "absolute", left: 760, top: 280, width: 1050 }}><Ry s={q.length > 15 ? 96 : 120} c={K.ink}>{q}</Ry></Pop>
      <Stamp f={f} at={at(t2)} s={ans.length > 6 ? 76 : 130} c={ans === "NO" ? K.red : K.green} rot={-6} st={{ left: 780, top: 600 }}>{ans}</Stamp>
    </Bg>
  );
};

// ═══ 27 · Cuánto dura: bolsa en heladera 3 días · papel en freezer 3 meses (ASK_C) ═══
export const SgKeep: P<{ t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useB(a, a0);
  const A1 = sp(f, at(t) - 8, 13, 120), A2 = sp(f, at(t2) - 8, 13, 120);
  return (
    <Bg bg={`linear-gradient(180deg, #E9EEF0, #C9D3D8)`}>
      <Ry s={84} c={K.ink} st={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>HOW LONG DOES IT KEEP?</Ry>
      <div style={{ position: "absolute", left: 140, top: 200, width: 780, height: 780, borderRadius: 24, background: "linear-gradient(180deg, #FFFFFF, #E6ECEF)", boxShadow: SH, opacity: cl(A1 * 1.5), transform: `translateY(${(1 - A1) * 80}px)` }}>
        <div style={{ position: "absolute", left: 140, top: 110, width: 500, height: 260, borderRadius: 130, background: linenBg, boxShadow: SH }}>
          <div style={{ position: "absolute", right: -40, top: 100, width: 80, height: 60, background: "#E2D6C0", clipPath: "polygon(0 0, 100% 30%, 100% 70%, 0 100%)" }} />
          <div style={{ position: "absolute", right: 30, top: 80, width: 10, height: 100, background: "#8B7355" }} />
        </div>
        <Hd s={72} c={K.ink} st={{ position: "absolute", top: 430, width: "100%", textAlign: "center" }}>cloth sack · refrigerator</Hd>
        <Ry s={130} c={K.red} st={{ position: "absolute", top: 540, width: "100%", textAlign: "center" }}>3 DAYS</Ry>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 200, width: 780, height: 780, borderRadius: 24, background: frostBg, boxShadow: SH, opacity: cl(A2 * 1.5), transform: `translateY(${(1 - A2) * 80}px)` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 170 + i * 30, top: 90 + i * 70, width: 400, height: 180, background: butcherBg, boxShadow: SH, transform: `rotate(${-4 + i * 3}deg)` }}>
            {i === 2 ? <Write f={f} at={at(t2) + 10} dur={14} st={{ position: "absolute", left: 50, top: 50 }}><Hd s={60} c="#555">Nov 16 · sausage</Hd></Write> : null}
          </div>
        ))}
        <Hd s={72} c={K.ink} st={{ position: "absolute", top: 430, width: "100%", textAlign: "center" }}>butcher paper · freezer</Hd>
        <Pop f={f} at={at(t3) - 4} sc={0.5}><Ry s={130} c={K.cobalt} st={{ position: "absolute", top: 540, width: 780, textAlign: "center" }}>3 MONTHS</Ry></Pop>
      </div>
    </Bg>
  );
};

// ═══ 28 · Ticket de la caja registradora: la cuenta (MONEY) ═══
export const SgMath: P<{ t: number; t2: number; t3: number; t4: number; t5: number }> = ({ a, a0, t, t2, t3, t4, t5 }) => {
  const { f, at } = useB(a, a0);
  const L: [string, string, number, string?][] = [["STORE ROLL", "$5.49 /lb", at(t) - 4], ["PORK SHOULDER 8 lb", "$17.xx", at(t2) - 4], ["SPICES, ALL 7 lb", "$1.00", at(t3) - 4], ["YOUR SAUSAGE", "$2.65 /lb", at(t4) - 4, K.green]];
  const shown = L.filter((l) => f >= l[2]).length, len = 200 + shown * 150 + (f >= at(t5) - 4 ? 170 : 0);
  return (
    <Bg bg={pineBg}>
      <Light x="50%" y="0%" />
      {/* caja registradora (frente) */}
      <div style={{ position: "absolute", left: 460, top: 0, width: 1000, height: 140, borderRadius: "0 0 30px 30px", background: "linear-gradient(180deg, #4A4F55, #23272B)", boxShadow: SH }}>
        <div style={{ position: "absolute", left: 300, bottom: 18, width: 400, height: 14, borderRadius: 7, background: "#0B0C0D" }} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 120, width: 800, height: len, background: `repeating-linear-gradient(180deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 6px), #FDFCF7`, boxShadow: SH, transition: "none",
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), 97% 100%, 94% calc(100% - 14px), 91% 100%, 88% calc(100% - 14px), 85% 100%, 82% calc(100% - 14px), 79% 100%, 76% calc(100% - 14px), 73% 100%, 70% calc(100% - 14px), 67% 100%, 64% calc(100% - 14px), 61% 100%, 58% calc(100% - 14px), 55% 100%, 52% calc(100% - 14px), 49% 100%, 46% calc(100% - 14px), 43% 100%, 40% calc(100% - 14px), 37% 100%, 34% calc(100% - 14px), 31% 100%, 28% calc(100% - 14px), 25% 100%, 22% calc(100% - 14px), 19% 100%, 16% calc(100% - 14px), 13% 100%, 10% calc(100% - 14px), 7% 100%, 4% calc(100% - 14px), 0 100%)" }}>
        <Ry s={54} c={K.ink} st={{ position: "absolute", top: 50, width: "100%", textAlign: "center", letterSpacing: 4 }}>CLYDE'S ARITHMETIC</Ry>
        {L.map(([n, v, at0, c], i) => f >= at0 ? (
          <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 170 + i * 150, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: i === 3 ? "5px double #333" : "none", paddingTop: i === 3 ? 20 : 0 }}>
            <Hd s={66} c={c ?? K.ink}>{n}</Hd><Ry s={i === 3 ? 74 : 60} c={c ?? (i === 0 ? K.red : K.ink)}>{v}</Ry>
          </div>) : null)}
        {f >= at(t5) - 4 ? <Ry s={58} c={K.cobalt} st={{ position: "absolute", left: 50, right: 50, top: 170 + 4 * 150 + 30, textAlign: "center" }}>7 LB = PRICE OF 3 ROLLS</Ry> : null}
      </div>
    </Bg>
  );
};

// ═══ 29 · Un sábado al mes: almanaque + lista (MONEY_B) ═══
export const SgMonth: P<{ items: { txt: string; t: number }[] }> = ({ a, a0, items }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 13, 110), circ = lin(f, at(items[0].t), 20);
  return (
    <Bg bg={pineBg}>
      <Light />
      <div style={{ position: "absolute", left: 130, top: 140, width: 760, height: 800, background: "#F4ECD8", boxShadow: SH, borderRadius: 6, transform: `rotate(-2deg) translateY(${(1 - k) * 80}px)`, opacity: cl(k * 1.5) }}>
        <div style={{ height: 150, background: `linear-gradient(180deg, ${K.sage}, #4E6538)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ry s={80} c={K.cream}>ONE MONTH</Ry></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: 24, rowGap: 14 }}>
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} style={{ position: "relative", height: 100, textAlign: "center", fontFamily: RYE, fontSize: 40, color: i % 7 === 6 ? K.red : K.ink, opacity: 0.85 }}>
              {i < 30 ? i + 1 : ""}
              {i === 6 ? <div style={{ position: "absolute", left: -6, top: -18, width: 110, height: 90, borderRadius: "50%", border: `6px solid ${K.red}`, clipPath: `inset(0 ${100 - circ * 100}% 0 0)` }} /> : null}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 990, top: 170 }}>
        {items.map((it, i) => (
          <Pop key={i} f={f} at={at(it.t) - 4} dx={50} dy={0} st={{ marginBottom: 46, background: kraftBg, padding: "18px 34px", boxShadow: SH, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`, display: "inline-block" }}>
            <Hd s={84} c={i === items.length - 1 ? K.redD : K.ink}>{it.txt}</Hd>
          </Pop>
        )).map((el, i) => <div key={i}>{el}</div>)}
      </div>
    </Bg>
  );
};

// ═══ 30 · La tarea: hacé DOS (CLOSE) ═══
export const SgHomework: P<{ t: number; t2: number; t3: number; t4: number }> = ({ a, a0, t, t2, t3, t4 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 13, 110);
  const tick = (tt: number) => lin(f, at(tt) + 14, 8);
  return (
    <Bg bg={pineBg}>
      <Light />
      <div style={{ position: "absolute", left: 300, top: 70, width: 1320, height: 940, background: paperLines, boxShadow: SH, transform: `rotate(-1.5deg) translateY(${(1 - k) * 80}px)`, opacity: cl(k * 1.5) }}>
        <Hd s={110} c={K.ink} st={{ position: "absolute", left: 170, top: 40 }}>Homework</Hd>
        <Write f={f} at={8} dur={16} st={{ position: "absolute", left: 170, top: 200 }}><Hd s={80} c="#777">not all eight this week…</Hd></Write>
        <Write f={f} at={at(t) - 4} dur={12} st={{ position: "absolute", left: 900, top: 180 }}><Ry s={110} c={K.red} st={{ whiteSpace: "nowrap" }}>DO TWO.</Ry></Write>
        {[["buy the shoulder, not the roll", t2], ["freeze the cubes 45 min", t3]].map(([s, tt], i) => (
          <div key={i} style={{ position: "absolute", left: 170, top: 380 + i * 160, display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ width: 90, height: 90, border: `7px solid ${K.ink}`, borderRadius: 8, position: "relative" }}>
              <div style={{ position: "absolute", left: 6, top: -20, fontFamily: RYE, fontSize: 110, color: K.green, clipPath: `inset(0 ${100 - tick(tt as number) * 100}% 0 0)` }}>✓</div>
            </div>
            <Write f={f} at={at(tt as number) - 2} dur={16}><Hd s={88}>{s}</Hd></Write>
          </div>
        ))}
        <Pop f={f} at={at(t4)} st={{ position: "absolute", left: 170, top: 740 }}><Hd s={84} c={K.cobalt}>→ taste it on Saturday</Hd></Pop>
      </div>
    </Bg>
  );
};

// ═══ 31 · Pregunta para los comentarios en una ficha clavada (CLOSE_B) ═══
export const SgComment: P<{ t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useB(a, a0);
  const k = sp(f, 0, 13, 110);
  return (
    <Bg bg={pineBg}>
      <Light x="50%" y="10%" />
      <Card x={260} y={110} w={1400} h={860} bg={butcherBg} rot={-1} k={k}>
        <div style={{ position: "absolute", left: 680, top: -20, width: 44, height: 44, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #F27A6A, ${K.red})`, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
        <Ry s={64} c={K.cobalt} st={{ position: "absolute", top: 70, width: "100%", textAlign: "center", letterSpacing: 4 }}>TELL ME IN THE COMMENTS</Ry>
        <Write f={f} at={Math.min(at(t) - 4, 6)} dur={22} st={{ position: "absolute", left: 90, top: 200, width: 1240 }}><Hd s={96} c={K.ink}>Did anybody in your family make sausage at home?</Hd></Write>
        <div style={{ position: "absolute", left: 90, top: 470, display: "flex", gap: 50 }}>
          {["cloth sacks", "patties"].map((s, i) => (
            <Pop key={s} f={f} at={at(t2) + i * 8} sc={0.4} st={{ padding: "20px 46px", borderRadius: 60, border: `6px solid ${K.ink}`, background: i ? "#F7E3D3" : "#EFE6D2" }}><Hd s={80}>{s}</Hd></Pop>
          ))}
        </div>
        <Pop f={f} at={at(t3)} st={{ position: "absolute", left: 90, top: 680 }}><Ry s={84} c={K.red}>WHAT COUNTY?</Ry></Pop>
      </Card>
    </Bg>
  );
};
