// clyde7 · componentes PROPIOS del video del chuck roast ahumado (Ch*). PURO CSS/DOM: cero imágenes adentro.
// Capas: tablas de pino quemadas (gradientes) + luz cenital + papel de carnicero / papel rosa / pizarra / ticket dibujados con gradientes
// + objeto dibujado (cortes de carne, termómetro, humo, reloj) + datos + acento brasa animado con resorte. 2 familias: Oswald + Caveat.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { sp, useT, LABEL, HAND, type P } from "../lkit/core";

const K = { ink: "#2A1A10", cream: "#F6EEDC", ember: "#E0662A", emberHi: "#FFB36B", red: "#B3261E", meat: "#9E2B25", meatDk: "#6D1A17", fat: "#F3E6D6",
  bark: "#2B160C", pink: "#E7B2A6", chalk: "#F1EEE4", green: "#3E7A3A", smoke: "#C9D4DC", blue: "#8FB3D9", gold: "#E9C46A" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };

// ── texturas dibujadas ──
const WOOD = [
  "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,190,120,0.22), rgba(255,190,120,0) 70%)",
  "repeating-linear-gradient(90deg, rgba(0,0,0,0.42) 0 4px, rgba(0,0,0,0) 4px 214px)",
  "repeating-radial-gradient(ellipse 260px 1200px at 18% 120%, rgba(0,0,0,0.10) 0 3px, rgba(0,0,0,0) 3px 19px)",
  "repeating-radial-gradient(ellipse 300px 1400px at 71% -30%, rgba(255,210,160,0.05) 0 2px, rgba(0,0,0,0) 2px 23px)",
  "repeating-linear-gradient(90deg, rgba(255,220,170,0.035) 0 1px, rgba(0,0,0,0) 1px 6px)",
  "linear-gradient(180deg, #4A2C18 0%, #331D10 55%, #24140A 100%)"].join(",");
const PAPER = ["repeating-linear-gradient(0deg, rgba(120,90,50,0.05) 0 1px, rgba(0,0,0,0) 1px 5px)", "repeating-linear-gradient(90deg, rgba(120,90,50,0.035) 0 1px, rgba(0,0,0,0) 1px 9px)",
  "radial-gradient(ellipse at 28% 18%, #FFF9EC, #EFE2C4 80%)"].join(",");
const PINK = ["repeating-linear-gradient(8deg, rgba(150,60,50,0.07) 0 1px, rgba(0,0,0,0) 1px 6px)", "repeating-linear-gradient(98deg, rgba(255,255,255,0.08) 0 1px, rgba(0,0,0,0) 1px 11px)",
  "radial-gradient(ellipse at 30% 20%, #F4C7BC, #D99A8E 85%)"].join(",");
const CHALK = ["radial-gradient(ellipse 40% 30% at 30% 35%, rgba(255,255,255,0.07), rgba(255,255,255,0) 70%)", "radial-gradient(ellipse 35% 25% at 72% 70%, rgba(255,255,255,0.05), rgba(255,255,255,0) 70%)",
  "repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0 2px, rgba(0,0,0,0) 2px 9px)", "linear-gradient(160deg, #2F3B33, #1C2520)"].join(",");
const STEEL = "conic-gradient(from 210deg at 50% 50%, #9aa3a8, #e4e8ea, #8d969b, #cfd5d8, #858e93, #e9ecee, #9aa3a8)";
const SHADOW = "0 34px 70px rgba(10,5,2,0.6), 0 8px 18px rgba(10,5,2,0.4), inset 0 0 0 1px rgba(255,255,255,0.25)";
const BG: Record<string, string> = { paper: PAPER, pink: PINK, chalk: CHALK, steel: STEEL };

const Scene: React.FC<{ f: number; children: React.ReactNode; glow?: number }> = ({ f, children, glow = 0 }) => (
  <AbsoluteFill style={{ background: WOOD, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -300, right: -300, bottom: -420, height: 700, borderRadius: "50%",
      background: `radial-gradient(ellipse at 50% 30%, rgba(224,102,42,${0.28 + glow * 0.2 + 0.05 * Math.sin(f / 9)}), rgba(224,102,42,0) 65%)` }} />
    {children}
  </AbsoluteFill>
);
// tarjeta que cae con resorte (papel / rosa / pizarra / acero)
const Card: React.FC<{ f: number; at: number; x: number; y: number; w: number; h: number; rot?: number; kind?: string; children?: React.ReactNode; style?: React.CSSProperties }> =
  ({ f, at, x, y, w, h, rot = 0, kind = "paper", children, style }) => {
  const s = sp(f, at, 15, 120);
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - s) * 70, width: w, height: h, opacity: cl(s * 1.5), transform: `rotate(${rot + (1 - s) * 4}deg) scale(${0.95 + 0.05 * s})`,
      background: BG[kind] || kind, boxShadow: SHADOW, borderRadius: kind === "chalk" ? 14 : 4, border: kind === "chalk" ? "14px solid #6B4426" : undefined, ...style }}>{children}</div>
  );
};
const Lab: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties; ls?: number }> = ({ children, size, color = K.ink, style, ls = 1.5 }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: size, color, letterSpacing: ls, lineHeight: 1.04, textTransform: "uppercase", ...style }}>{children}</div>
);
const Hand: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = K.ink, style }) => (
  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, ...style }}>{children}</div>
);
const In: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; x?: number }> = ({ f, at, children, style, from = 22, x = 0 }) => {
  const s = sp(f, at, 16, 150);
  return <div style={{ opacity: cl(s * 1.6), transform: `translate(${(1 - s) * x}px, ${(1 - s) * from}px)`, ...style }}>{children}</div>;
};
const Write: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 16, children, style }) => {
  const p = ez((f - at) / dur);
  return <div style={{ clipPath: p >= 1 ? undefined : `inset(-20% ${100 - p * 100}% -20% -2%)`, opacity: p > 0 ? 1 : 0, ...style }}>{children}</div>;
};
const Stamp: React.FC<{ f: number; at: number; txt: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ f, at, txt, color = K.red, size = 64, rot = -8, style }) => {
  const s = sp(f, at, 11, 220);
  return (
    <div style={{ position: "absolute", opacity: cl(s * 2), transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * s})`, border: `7px solid ${color}`, borderRadius: 10, padding: "4px 22px",
      color, fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{txt}</div>
  );
};
// trazo dibujado (tilde, cruz, subrayado, flecha)
const Stroke: React.FC<{ d: string; f: number; at: number; dur?: number; color?: string; w?: number; len?: number; style?: React.CSSProperties }> = ({ d, f, at, dur = 10, color = K.green, w = 12, len = 900, style }) => {
  const p = ez((f - at) / dur);
  return (
    <svg viewBox="0 0 100 100" style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p > 0 ? 1 : 0} />
    </svg>
  );
};
const TICK = "M 12 55 L 40 82 L 92 18";
const CROSS = "M 15 15 L 85 85 M 85 15 L 15 85";
const Tick: React.FC<{ f: number; at: number; x: number; y: number; s?: number; bad?: boolean }> = ({ f, at, x, y, s = 90, bad }) => (
  <Stroke d={bad ? CROSS : TICK} f={f} at={at} color={bad ? K.red : K.green} w={bad ? 13 : 14} style={{ left: x, top: y, width: s, height: s }} />
);
// barrido de brasa (acento): una línea que se enciende
const Ember: React.FC<{ f: number; at: number; w: number; style?: React.CSSProperties }> = ({ f, at, w, style }) => {
  const p = ez((f - at) / 14);
  return <div style={{ position: "absolute", height: 8, width: w * p, borderRadius: 4, background: `linear-gradient(90deg, ${K.ember}, ${K.emberHi})`, boxShadow: `0 0 18px rgba(255,140,60,0.7)`, ...style }} />;
};
// corte de carne dibujado: "map" = vetas blancas por todos lados · "brick" = rojo liso · "flat" = rojo con capa de grasa de un lado · "crust" = ahumado
const Meat: React.FC<{ kind: "map" | "brick" | "flat" | "crust" | "pale"; w: number; h: number; style?: React.CSSProperties; seed?: number }> = ({ kind, w, h, style, seed = 0 }) => {
  const base = kind === "crust" ? "radial-gradient(ellipse at 40% 35%, #C1574A, #8E2E26 55%, #3B1610 80%, #160805 100%)"
    : kind === "pale" ? "radial-gradient(ellipse at 40% 35%, #B98C82, #8B6A63 70%, #5D4842)" : `radial-gradient(ellipse at 40% 35%, #C4433A, ${K.meat} 60%, ${K.meatDk})`;
  const veins = kind === "map" || kind === "crust" ? [
    `repeating-linear-gradient(${32 + seed}deg, rgba(0,0,0,0) 0 38px, rgba(248,236,222,0.85) 38px 43px, rgba(0,0,0,0) 43px 95px)`,
    `repeating-linear-gradient(${-48 + seed}deg, rgba(0,0,0,0) 0 61px, rgba(248,236,222,0.7) 61px 64px, rgba(0,0,0,0) 64px 140px)`,
    `repeating-linear-gradient(${105 + seed}deg, rgba(0,0,0,0) 0 27px, rgba(248,236,222,0.45) 27px 29px, rgba(0,0,0,0) 29px 77px)`] : [];
  const cap = kind === "flat" ? ["linear-gradient(180deg, #F4E8D8 0 18%, rgba(0,0,0,0) 18%)"] : [];
  return (
    <div style={{ width: w, height: h, borderRadius: "46% 54% 42% 58% / 55% 45% 55% 45%", background: [...cap, ...veins, base].join(","),
      boxShadow: kind === "crust" ? "inset 0 0 0 16px #241008, inset 0 0 40px 22px rgba(0,0,0,0.55), 0 26px 50px rgba(0,0,0,0.55)" : "inset 0 0 30px rgba(60,0,0,0.5), 0 26px 50px rgba(0,0,0,0.5)", ...style }} />
  );
};
// dos lados: izquierda MAL / derecha BIEN, con rótulo y veredicto
const Versus: React.FC<{ f: number; at: number; at2: number; l: React.ReactNode; r: React.ReactNode; lt: string; rt: string; ls?: string; rs?: string; title?: string }> =
  ({ f, at, at2, l, r, lt, rt, ls, rs, title }) => (
  <>
    {title ? <In f={f} at={at - 4} style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}><Lab size={64} color={K.cream} ls={5}>{title}</Lab></In> : null}
    <Card f={f} at={at} x={150} y={190} w={760} h={740} rot={-1.5}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 150 }}>{l}</div>
      <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center" }}><Lab size={64} color={K.red}>{lt}</Lab>{ls ? <Hand size={50} style={{ marginTop: 6 }}>{ls}</Hand> : null}</div>
      <Tick f={f} at={at + 12} x={630} y={30} bad />
    </Card>
    <Card f={f} at={at2} x={1010} y={190} w={760} h={740} rot={1.5}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 150 }}>{r}</div>
      <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center" }}><Lab size={64} color={K.green}>{rt}</Lab>{rs ? <Hand size={50} style={{ marginTop: 6 }}>{rs}</Hand> : null}</div>
      <Tick f={f} at={at2 + 12} x={630} y={30} />
    </Card>
  </>
);
const Num: React.FC<{ v: number; f: number; at: number; dur?: number; pre?: string; suf?: string; dec?: number }> = ({ v, f, at, dur = 20, pre = "", suf = "", dec = 0 }) => {
  const x = v * ez((f - at) / dur);
  return <>{pre}{x.toFixed(dec)}{suf}</>;
};

// ═══ HOOK · dos etiquetas de precio colgando de hilo ═══
const Tag: React.FC<{ f: number; at: number; x: number; name: string; lb: string; price: string; col: string; sw: number }> = ({ f, at, x, name, lb, price, col, sw }) => {
  const s = sp(f, at, 9, 90); const sway = (1 - s) * 14 + 1.2 * Math.sin((f + sw) / 22);
  return (
    <div style={{ position: "absolute", left: x, top: -40, width: 640, height: 900, transformOrigin: "50% 0", transform: `rotate(${sway}deg)`, opacity: cl(s * 2) }}>
      <div style={{ position: "absolute", left: 318, top: 0, width: 4, height: 230, background: "linear-gradient(#d8cbb0, #a89878)" }} />
      <div style={{ position: "absolute", left: 20, top: 220, width: 600, height: 560, background: PAPER, boxShadow: SHADOW, clipPath: "polygon(12% 0, 88% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)", padding: "70px 46px" }}>
        <div style={{ position: "absolute", left: 286, top: 26, width: 30, height: 30, borderRadius: "50%", background: "#3a2416", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }} />
        <Lab size={70} color={K.ink} style={{ textAlign: "center" }}>{name}</Lab>
        <div style={{ height: 6, background: col, margin: "22px 0" }} />
        <Lab size={64} color={K.ink} style={{ textAlign: "center", opacity: 0.75 }}>{lb}</Lab>
        <Lab size={190} color={col} style={{ textAlign: "center", marginTop: 6 }} ls={-2}>{price}</Lab>
      </div>
    </div>
  );
};
export const ChPriceDuel: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Tag f={f} at={at(t)} x={250} name="Brisket flat" lb="4 lb" price="$41" col={K.red} sw={0} />
      <Tag f={f} at={at(t2)} x={1030} name="Chuck roast" lb="4 lb" price="$19" col={K.green} sw={30} />
      <Stamp f={f} at={at(t3)} txt="under $5 / lb" color={K.green} size={78} rot={-7} style={{ left: 1110, top: 860, background: "rgba(246,238,220,0.92)" }} />
    </Scene>
  );
};

// ═══ HOOK_B · ticket del restaurante que se imprime ═══
export const ChReceipt: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const grow = 260 + 170 * ez((f - at(t)) / 12) + 170 * ez((f - at(t2)) / 12) + 230 * ez((f - at(t2) - 14) / 12);
  const row = (l: string, r: string, tt: number, big?: boolean) => (
    <In f={f} at={tt} from={10} style={{ display: "flex", justifyContent: "space-between", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: big ? 60 : 42, color: "#222", margin: "18px 0", whiteSpace: "nowrap" }}><span>{l}</span><span>{r}</span></In>
  );
  return (
    <Scene f={f}>
      <div style={{ position: "absolute", left: 610, top: 60, width: 700, height: 60, borderRadius: 14, background: "linear-gradient(#3b3b3b, #1b1b1b)", boxShadow: "0 12px 30px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 650, top: 100, width: 620, height: grow, overflow: "hidden", background: "linear-gradient(180deg, #E9E6DF, #FBFAF6 8%), repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0 1px, rgba(0,0,0,0) 1px 4px)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.55)", padding: "50px 48px", clipPath: "polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)" }}>
        <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 44, textAlign: "center", color: "#333", letterSpacing: 6 }}>** BBQ IN TOWN **</div>
        <div style={{ borderTop: "4px dashed #777", margin: "20px 0" }} />
        {row("1/2 LB BRISKET", "26.50", at(t))}
        {row("2 CUPS BEANS", "7.50", at(t2))}
        <div style={{ borderTop: "4px dashed #777", margin: "20px 0", opacity: f > at(t2) + 12 ? 1 : 0 }} />
        {row("TOTAL", "$34.00", at(t2) + 14, true)}
      </div>
      <Stamp f={f} at={at(t3)} txt="DRY." size={170} rot={-12} style={{ left: 1290, top: 380, background: "rgba(251,250,246,0.9)" }} />
    </Scene>
  );
};

// ═══ PROMISE · tarjeta de 3 tildes ═══
export const ChPromise: P<{ items: { txt: string; t: number }[]; t2: number }> = ({ a, items, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(items[0].t) - 8} x={360} y={110} w={1200} h={860} rot={-1}>
        <Hand size={84} color={K.red} style={{ position: "absolute", left: 80, top: 50 }}>a $5 cut that comes out…</Hand>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: 120, top: 220 + i * 170, display: "flex", alignItems: "center" }}>
            <div style={{ width: 110, height: 110, border: `7px solid ${K.ink}`, borderRadius: 10, position: "relative" }}><Tick f={f} at={at(it.t)} x={4} y={0} s={92} /></div>
            <In f={f} at={at(it.t)} x={-30} from={0}><Lab size={96} style={{ marginLeft: 50 }}>{it.txt}</Lab></In>
          </div>
        ))}
        <Ember f={f} at={at(t2)} w={760} style={{ left: 300, top: 760 }} />
        <In f={f} at={at(t2)} style={{ position: "absolute", left: 300, top: 680 }}><Hand size={80} color={K.ember}>…on your first try.</Hand></In>
      </Card>
    </Scene>
  );
};

// ═══ PROMISE_B · pizarra de los 8 trucos ═══
const EIGHT = ["ASK FOR IT", "TRIM IT", "THE SALT", "THE RUB", "THE FIRE", "THE WRAP", "WHEN IT'S DONE", "HOW YOU SLICE"];
export const ChEight: P<{ t: number; ts: number[] }> = ({ a, t, ts }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 10} x={260} y={60} w={1400} h={960} kind="chalk">
        <Lab size={72} color={K.chalk} ls={6} style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", textShadow: "0 0 6px rgba(255,255,255,0.35)" }}>8 old smokehouse tricks</Lab>
        <div style={{ position: "absolute", left: 220, right: 220, top: 140, height: 4, background: "rgba(241,238,228,0.6)" }} />
        {EIGHT.map((x, i) => {
          const col = i < 4 ? 0 : 1, r = i % 4;
          return (
            <Write key={i} f={f} at={at(ts[i])} dur={12} style={{ position: "absolute", left: 110 + col * 630, top: 200 + r * 175, display: "flex", alignItems: "baseline" }}>
              <Hand size={110} color={i === 7 ? K.emberHi : K.gold} style={{ width: 90, textShadow: "0 0 8px rgba(255,255,255,0.25)" }}>{i + 1}</Hand>
              <Hand size={86} color={K.chalk} style={{ textShadow: "0 0 7px rgba(255,255,255,0.3)" }}>{x}</Hand>
            </Write>
          );
        })}
        {f > at(ts[7]) ? <Stroke d="M 5 60 C 25 10, 80 5, 95 50 C 99 85, 30 98, 8 70" f={f} at={at(ts[7]) + 6} dur={14} color={K.emberHi} w={3} len={400} style={{ left: 700, top: 690, width: 560, height: 150 }} /> : null}
      </Card>
    </Scene>
  );
};

// ═══ INTRO · 55 años quemado en la madera ═══
export const ChYears: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const s = sp(f, at(t), 14, 90), heat = ez((f - at(t)) / 25);
  return (
    <Scene f={f} glow={heat}>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", transform: `scale(${1.25 - 0.25 * s})`, opacity: cl(s * 1.5) }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 470, lineHeight: 1, color: "#1A0C05",
          textShadow: `0 0 ${30 * heat}px rgba(255,120,40,${0.8 * heat}), 0 0 ${8 * heat}px rgba(255,200,120,${heat}), 0 4px 0 rgba(255,220,180,0.12), 0 -3px 0 rgba(0,0,0,0.6)` }}>55</div>
      </div>
      <In f={f} at={at(t) + 10} style={{ position: "absolute", top: 650, width: "100%", textAlign: "center" }}><Lab size={92} color={K.cream} ls={10}>years of cutting meat</Lab></In>
      <Ember f={f} at={at(t2)} w={700} style={{ left: 610, top: 790 }} />
      <In f={f} at={at(t2)} style={{ position: "absolute", top: 830, width: "100%", textAlign: "center" }}><Hand size={96} color={K.emberHi}>east Tennessee</Hand></In>
    </Scene>
  );
};

// ═══ STORY · hoja de almanaque 1958 ═══
export const ChCal: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const row = (from: string, to: string, tt: number, y: number, col: string) => (
    <div style={{ position: "absolute", left: 830, top: y, display: "flex", alignItems: "center" }}>
      <In f={f} at={tt} x={-40} from={0}><Lab size={78} color={K.cream}>{from}</Lab></In>
      <div style={{ width: 200 * ez((f - tt - 4) / 12), height: 10, background: col, margin: "0 30px", position: "relative", borderRadius: 5 }}>
        <div style={{ position: "absolute", right: -18, top: -14, width: 0, height: 0, borderLeft: `30px solid ${col}`, borderTop: "19px solid transparent", borderBottom: "19px solid transparent", opacity: f > tt + 10 ? 1 : 0 }} />
      </div>
      <In f={f} at={tt + 12} x={-30} from={0}><Lab size={78} color={col}>{to}</Lab></In>
    </div>
  );
  return (
    <Scene f={f}>
      <Card f={f} at={at(t)} x={150} y={150} w={560} h={760} rot={-3}>
        <div style={{ height: 150, background: `linear-gradient(${K.red}, #8a1c16)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Lab size={80} color={K.cream} ls={8}>Saturday</Lab></div>
        <Lab size={270} color={K.ink} style={{ textAlign: "center", marginTop: 50 }} ls={-4}>1958</Lab>
        <Hand size={70} color={K.ink} style={{ textAlign: "center", opacity: 0.7, marginTop: 20 }}>Granddaddy's smokehouse</Hand>
        <div style={{ position: "absolute", left: 60, top: -20, width: 30, height: 60, borderRadius: 15, background: STEEL }} />
        <div style={{ position: "absolute", right: 60, top: -20, width: 30, height: 60, borderRadius: 15, background: STEEL }} />
      </Card>
      {row("BRISKET", "GRINDER", at(t2), 330, "#B9B2A6")}
      {row("CHUCK", "SMOKEHOUSE", at(t3), 560, K.emberHi)}
      <In f={f} at={at(t3) + 20} style={{ position: "absolute", left: 830, top: 720 }}><Hand size={74} color={K.cream}>salt · black pepper · hickory</Hand></In>
    </Scene>
  );
};

// ═══ STORY_B · el precio del brisket se dispara, el chuck no ═══
export const ChChart: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / 40), q = ez((f - at(t2)) / 26);
  const W = 1300, H = 560, X0 = 300, Y0 = 860;
  const bris = (x: number) => Y0 - H * (0.12 + 0.88 * Math.pow(x, 2.2));
  const chuck = (x: number) => Y0 - H * (0.1 + 0.12 * x);
  const path = (fn: (x: number) => number, k: number) => { let d = ""; for (let i = 0; i <= 60 * k; i++) { const x = i / 60; d += `${i ? "L" : "M"} ${X0 + W * x} ${fn(x)} `; } return d; };
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 8} x={180} y={120} w={1560} h={880} kind="chalk" />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke="rgba(241,238,228,0.7)" strokeWidth={5} />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - H - 30} stroke="rgba(241,238,228,0.7)" strokeWidth={5} />
        <path d={path(bris, p)} fill="none" stroke={K.emberHi} strokeWidth={14} strokeLinecap="round" />
        <path d={path(chuck, q)} fill="none" stroke="#9FD39A" strokeWidth={14} strokeLinecap="round" />
      </svg>
      <Hand size={64} color={K.chalk} style={{ position: "absolute", left: X0 - 40, top: Y0 + 20 }}>1990s</Hand>
      <Hand size={64} color={K.chalk} style={{ position: "absolute", left: X0 + W - 120, top: Y0 + 20 }}>today</Hand>
      <In f={f} at={at(t) + 30} style={{ position: "absolute", left: X0 + W - 470, top: 210 }}><Lab size={70} color={K.emberHi}>Brisket ↑↑↑</Lab></In>
      <In f={f} at={at(t2) + 14} style={{ position: "absolute", left: X0 + W - 520, top: Y0 - 200 }}><Lab size={70} color="#9FD39A">Chuck — still cheap</Lab></In>
      <In f={f} at={at(t) - 6} style={{ position: "absolute", left: 260, top: 160 }}><Lab size={58} color={K.chalk} ls={4}>Price per pound</Lab></In>
    </Scene>
  );
};

// ═══ STORY_B · más grasa adentro = más jugo ═══
export const ChFat: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const bar = (v: number, tt: number, col: string) => <div style={{ height: 46, width: 520 * v * ez((f - tt) / 18), background: col, borderRadius: 8, boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.2)" }} />;
  return (
    <Scene f={f}>
      <Versus f={f} at={at(t2)} at2={at(t)} title="Fat running through the meat"
        l={<div><Meat kind="flat" w={460} h={300} /><div style={{ marginTop: 50 }}>{bar(0.25, at(t2) + 10, "#C9B9A2")}</div></div>}
        r={<div><Meat kind="map" w={460} h={300} /><div style={{ marginTop: 50 }}>{bar(0.95, at(t) + 10, K.gold)}</div></div>}
        lt="Brisket flat" rt="Chuck" ls="lean · dries out" rs="more juice · more forgiveness" />
    </Scene>
  );
};

// ═══ capítulo · TRUCO n ═══
export const ChTrick: P<{ n: number; name: string; sub: string; t: number; hot?: boolean }> = ({ a, n, name, sub, t, hot }) => {
  const { f, at } = useT(a);
  const s = sp(f, at(t) - 6, 12, 110), s2 = sp(f, at(t) + 4, 14, 130);
  return (
    <Scene f={f} glow={hot ? 1 : 0.4}>
      <div style={{ position: "absolute", left: 200, top: 250, width: 520, height: 520, borderRadius: "50%", transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -40}deg)`, opacity: cl(s * 1.5),
        background: "radial-gradient(circle at 40% 35%, #4b2a17, #1d0e06 70%)", boxShadow: `0 0 0 14px #1A0C05, 0 0 0 20px ${hot ? K.ember : "#7a4a2a"}, 0 40px 80px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.7)` }}>
        <Lab size={60} color={K.emberHi} ls={10} style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>Trick</Lab>
        <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 330, lineHeight: 1, color: K.cream,
          textShadow: `0 0 30px rgba(255,140,60,${hot ? 0.9 : 0.5}), 0 6px 0 rgba(0,0,0,0.5)` }}>{n}</div>
      </div>
      <div style={{ position: "absolute", left: 800, top: 330, width: 1000, opacity: cl(s2 * 1.5), transform: `translateX(${(1 - s2) * 80}px)` }}>
        <Lab size={n === 8 || name.length > 16 ? 108 : 128} color={K.cream} ls={2}>{name}</Lab>
        <Ember f={f} at={at(t) + 8} w={620} style={{ position: "relative", marginTop: 24 }} />
        <Hand size={80} color={K.emberHi} style={{ marginTop: 30 }}>{sub}</Hand>
      </div>
    </Scene>
  );
};

// ═══ TRICK1 · regla de grosor ═══
const Slab: React.FC<{ h: number; w: number }> = ({ h, w }) => (
  <div style={{ width: w, height: h, borderRadius: 26, background: `repeating-linear-gradient(12deg, rgba(0,0,0,0) 0 30px, rgba(248,236,222,0.6) 30px 34px, rgba(0,0,0,0) 34px 70px), linear-gradient(180deg, #C4433A, ${K.meat} 70%, ${K.meatDk})`,
    boxShadow: "inset 0 0 22px rgba(60,0,0,0.5), 0 20px 40px rgba(0,0,0,0.45)" }} />
);
const Ruler: React.FC<{ h: number; marks: number }> = ({ h, marks }) => (
  <div style={{ width: 70, height: h, background: "linear-gradient(90deg, #E8C98C, #CFA764)", boxShadow: "0 10px 20px rgba(0,0,0,0.4)", position: "relative" }}>
    {Array.from({ length: marks * 4 + 1 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, bottom: (h / (marks * 4)) * i - 2, width: i % 4 === 0 ? 40 : 20, height: 4, background: "#3a2410" }} />)}
  </div>
);
export const ChThick: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Versus f={f} at={at(t)} at2={at(t2)} title="How thick?"
        l={<div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}><Ruler h={360} marks={3} /><Slab h={180} w={420} /></div>}
        r={<div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}><Ruler h={360} marks={3} /><Slab h={360} w={420} /></div>}
        lt="1½ inch" rt="3 inches +" ls="slow cooker" rs="smoker · 3-4 lb" />
    </Scene>
  );
};

// ═══ TRICK1_B · lo que se le dice al carnicero (libreta de pedidos) ═══
export const ChOrder: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const L = [["a chuck roast,", "at least 3 inches thick", t], ["from the end", "closest to the rib", t2], ["with the most", "white streaks you've got", t3]] as const;
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 10} x={420} y={70} w={1080} h={940} rot={-1.5}
        style={{ background: [`repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 78px, rgba(80,120,170,0.35) 78px 81px)`, "linear-gradient(90deg, rgba(0,0,0,0) 118px, rgba(200,60,60,0.45) 118px 121px, rgba(0,0,0,0) 121px)", PAPER].join(",") }}>
        <div style={{ height: 120, background: `linear-gradient(${K.red}, #8a1c16)`, display: "flex", alignItems: "center", paddingLeft: 60 }}><Lab size={64} color={K.cream} ls={6}>Butcher order</Lab></div>
        <Hand size={70} color="#30508A" style={{ position: "absolute", left: 150, top: 150 }}>"I want…</Hand>
        {L.map(([x, y, tt], i) => (
          <Write key={i} f={f} at={at(tt)} dur={20} style={{ position: "absolute", left: 150, top: 250 + i * 225 }}>
            <Hand size={74} color="#30508A">{x}</Hand><Hand size={92} color="#1E3768" style={{ marginTop: -6 }}>{y}</Hand>
          </Write>
        ))}
        {L.map(([, , tt], i) => <Stroke key={"u" + i} d="M 0 50 C 30 44, 70 58, 100 48" f={f} at={at(tt) + 18} color={K.ember} w={5} len={200} style={{ left: 150, top: 380 + i * 225, width: 760, height: 40 }} />)}
      </Card>
    </Scene>
  );
};

// ═══ TRICK1_C · ladrillo o mapa ═══
export const ChMap: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Versus f={f} at={at(t)} at2={at(t2)} title="Hold it up to the light"
        l={<Meat kind="brick" w={520} h={400} />} r={<Meat kind="map" w={520} h={400} seed={8} />}
        lt="Solid brick" rt="A map" ls="put it back" rs="white rivers all through it" />
    </Scene>
  );
};
export const ChCheck: P<{ t: number; items: { txt: string; t: number }[] }> = ({ a, t, items }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t)} x={460} y={110} w={1000} h={860} rot={1} kind="pink">
        <Hand size={92} color={K.ink} style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>remember this one</Hand>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: 110, top: 230 + i * 200, display: "flex", alignItems: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: `7px solid ${K.ink}`, position: "relative" }}><Tick f={f} at={at(it.t)} x={10} y={6} s={96} /></div>
            <In f={f} at={at(it.t)} x={-30} from={0}><Lab size={104} style={{ marginLeft: 50 }}>{it.txt}</Lab></In>
          </div>
        ))}
      </Card>
    </Scene>
  );
};

// ═══ TRICK2_B · grasa dura afuera / blanda adentro ═══
export const ChTrim: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t)} x={150} y={140} w={760} h={660} rot={-1.5}>
        <Lab size={70} color={K.red} style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>Hard · white · waxy</Lab>
        <div style={{ position: "absolute", left: 130, top: 190, width: 500, height: 150, borderRadius: 30, background: "linear-gradient(180deg, #FAF4EA, #E6D8C2)", boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.12), 0 14px 30px rgba(0,0,0,0.3)" }} />
        <In f={f} at={at(t2)} style={{ position: "absolute", left: 120, top: 400, display: "flex", alignItems: "center" }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", background: STEEL, boxShadow: "inset 0 0 0 10px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.4)" }} />
          <Lab size={64} style={{ marginLeft: 40 }}>trim to a nickel</Lab>
        </In>
      </Card>
      <Card f={f} at={at(t) + 10} x={1010} y={140} w={760} h={660} rot={1.5}>
        <Lab size={70} color={K.green} style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>Soft fat inside</Lab>
        <div style={{ position: "absolute", left: 160, top: 170 }}><Meat kind="map" w={440} h={300} seed={20} /></div>
        <Lab size={70} style={{ position: "absolute", top: 520, width: "100%", textAlign: "center" }}>leave it</Lab>
      </Card>
      <Ember f={f} at={at(t3)} w={1100} style={{ left: 410, top: 870 }} />
      <In f={f} at={at(t3)} style={{ position: "absolute", top: 900, width: "100%", textAlign: "center" }}><Lab size={92} color={K.cream} ls={4}>Soft fat melts · hard fat stays</Lab></In>
    </Scene>
  );
};

// ═══ TRICK2_C · atado parejo vs suelto ═══
const Tied: React.FC<{ f: number; at: number; loose?: boolean }> = ({ f, at, loose }) => (
  <div style={{ position: "relative", width: 520, height: 330 }}>
    {loose ? <>
      <div style={{ position: "absolute", left: 0, top: 30, transform: "rotate(-9deg)" }}><Meat kind="map" w={270} h={280} /></div>
      <div style={{ position: "absolute", left: 270, top: 20, transform: "rotate(11deg)" }}><Meat kind="map" w={250} h={290} seed={30} /></div>
    </> : <>
      <Meat kind="map" w={520} h={330} seed={12} />
      {[0.25, 0.5, 0.75].map((x, i) => <div key={i} style={{ position: "absolute", left: 520 * x - 7, top: -14, width: 14, height: 360 * ez((f - at - 6 - i * 4) / 10), borderRadius: 7,
        background: "repeating-linear-gradient(45deg, #F2EBDD 0 6px, #CFC3AE 6px 10px)", boxShadow: "0 4px 8px rgba(0,0,0,0.4)" }} />)}
    </>}
  </div>
);
export const ChTie: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Versus f={f} at={at(t2)} at2={at(t)} title="Tie it like a little package"
        l={<Tied f={f} at={at(t2)} loose />} r={<Tied f={f} at={at(t)} />}
        lt="Loose roast" rt="Tight roast" ls="dry edge · raw middle" rs="cooks even" />
    </Scene>
  );
};

// ═══ TRICK3_B · la cuenta de la sal ═══
export const ChSalt: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const sp3 = sp(f, at(t3), 10, 160);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 8} x={240} y={120} w={1440} h={840} kind="chalk">
        <Lab size={60} color={K.chalk} ls={6} style={{ position: "absolute", top: 40, width: "100%", textAlign: "center" }}>Kosher salt · the night before</Lab>
        <Write f={f} at={at(t)} style={{ position: "absolute", left: 120, top: 220 }}><Hand size={150} color={K.chalk}>½ tsp</Hand></Write>
        <Write f={f} at={at(t) + 12} style={{ position: "absolute", left: 470, top: 245 }}><Hand size={110} color={K.gold}>per pound</Hand></Write>
        <Write f={f} at={at(t2)} style={{ position: "absolute", left: 120, top: 470 }}><Hand size={150} color={K.chalk}>× 4 lb roast</Hand></Write>
        <div style={{ position: "absolute", left: 120, top: 680, width: 1100 * ez((f - at(t3) + 6) / 10), height: 6, background: K.chalk, opacity: 0.8 }} />
        <div style={{ position: "absolute", left: 760, top: 610, transform: `scale(${0.5 + 0.5 * sp3})`, opacity: cl(sp3 * 2), transformOrigin: "0 50%" }}>
          <Hand size={190} color={K.emberHi} style={{ textShadow: "0 0 16px rgba(255,140,60,0.6)" }}>= 2 tsp</Hand>
        </div>
      </Card>
    </Scene>
  );
};

// ═══ TRICK3_C · la noche en la heladera, en 3 tiempos ═══
export const ChNight: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const P3 = [
    { h: "HOUR 1", s: "salt pulls water out", tt: t, m: "pale" as const, beads: true },
    { h: "OVERNIGHT", s: "salty water goes back in", tt: t2, m: "map" as const, beads: false },
    { h: "MORNING", s: "dry like leather", tt: t3, m: "brick" as const, beads: false }];
  return (
    <Scene f={f}>
      <div style={{ position: "absolute", left: 200, top: 120, width: 1520, height: 8, borderRadius: 4, background: "rgba(246,238,220,0.25)" }}>
        <div style={{ width: `${100 * (ez((f - at(t)) / 20) * 0.33 + ez((f - at(t2)) / 20) * 0.33 + ez((f - at(t3)) / 20) * 0.34)}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${K.blue}, ${K.emberHi})` }} />
      </div>
      {P3.map((p, i) => (
        <Card key={i} f={f} at={at(p.tt)} x={150 + i * 560} y={200} w={500} h={760} rot={[-2, 1, -1][i]}>
          <Lab size={66} color={i === 2 ? K.red : K.ink} style={{ textAlign: "center", marginTop: 40 }}>{p.h}</Lab>
          <div style={{ position: "relative", margin: "40px auto 0", width: 360, height: 280 }}>
            <Meat kind={p.m} w={360} h={280} seed={i * 15} style={i === 2 ? { filter: "saturate(0.7) brightness(0.75)" } : undefined} />
            {p.beads ? Array.from({ length: 9 }).map((_, j) => <div key={j} style={{ position: "absolute", left: 50 + (j * 37) % 260, top: 40 + ((j * 53) % 170), width: 26, height: 26, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #fff, rgba(220,150,150,0.75) 45%, rgba(160,40,40,0.4))", opacity: ez((f - at(p.tt) - 10 - j * 2) / 8) }} />) : null}
          </div>
          <Hand size={62} style={{ textAlign: "center", marginTop: 50, padding: "0 30px" }}>{p.s}</Hand>
        </Card>
      ))}
    </Scene>
  );
};

// ═══ TRICK4 · pimienta 2 : sal 1 (dálmata) ═══
const Pile: React.FC<{ w: number; dark: boolean; f: number; at: number }> = ({ w, dark, f, at }) => {
  const p = ez((f - at) / 16);
  return (
    <div style={{ width: w, height: w * 0.5 * p, borderRadius: "50% 50% 8px 8px / 100% 100% 8px 8px", alignSelf: "flex-end",
      background: dark ? "radial-gradient(circle at 30% 30%, #555 0 2px, rgba(0,0,0,0) 3px) 0 0/14px 14px, radial-gradient(circle at 70% 60%, #777 0 2px, rgba(0,0,0,0) 3px) 0 0/19px 19px, #141414"
        : "radial-gradient(circle at 30% 30%, #fff 0 3px, rgba(0,0,0,0) 4px) 0 0/16px 16px, radial-gradient(circle at 70% 60%, #ddd 0 2px, rgba(0,0,0,0) 3px) 0 0/12px 12px, #F1EFEA",
      boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }} />
  );
};
export const ChRub: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const s = sp(f, at(t2), 12, 140);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 8} x={260} y={110} w={1400} h={860} kind="steel" style={{ borderRadius: 20 }}>
        <div style={{ position: "absolute", left: 140, bottom: 300, display: "flex", gap: 90, alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><Pile w={430} dark f={f} at={at(t)} /><Lab size={70} style={{ marginTop: 26 }}>2 pepper</Lab></div>
          <Lab size={160} style={{ marginBottom: 60 }}>:</Lab>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><Pile w={250} dark={false} f={f} at={at(t) + 10} /><Lab size={70} style={{ marginTop: 26 }}>1 salt</Lab></div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: cl(s * 1.5), transform: `scale(${0.8 + 0.2 * s})` }}>
          <div style={{ display: "inline-block", background: "#F6F4EE", boxShadow: "0 16px 30px rgba(0,0,0,0.4)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: 34, background: "radial-gradient(circle at 20% 50%, #111 0 11px, rgba(0,0,0,0) 12px) 0 0/80px 34px, radial-gradient(circle at 70% 40%, #111 0 7px, rgba(0,0,0,0) 8px) 0 0/55px 34px" }} />
            <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 110, letterSpacing: 6, color: "#111", padding: "0 50px", lineHeight: 1.1 }}>THE DALMATIAN RUB</span>
            <div style={{ height: 34, background: "radial-gradient(circle at 40% 50%, #111 0 10px, rgba(0,0,0,0) 11px) 0 0/70px 34px, radial-gradient(circle at 85% 30%, #111 0 6px, rgba(0,0,0,0) 7px) 0 0/45px 34px" }} />
          </div>
        </div>
      </Card>
    </Scene>
  );
};

// ═══ TRICK4_B · capa gruesa vs liviana ═══
const Rubbed: React.FC<{ heavy?: boolean }> = ({ heavy }) => (
  <div style={{ width: 460, height: 340, borderRadius: 30, boxShadow: "inset 0 0 26px rgba(40,0,0,0.5), 0 22px 40px rgba(0,0,0,0.45)",
    background: heavy ? "radial-gradient(circle, #2a2a2a 0 3px, rgba(0,0,0,0) 4px) 0 0/9px 9px, radial-gradient(circle, #6e6a64 0 2px, rgba(0,0,0,0) 3px) 4px 4px/9px 9px, #3c3833"
      : `radial-gradient(circle, #111 0 3px, rgba(0,0,0,0) 4px) 0 0/31px 27px, radial-gradient(circle, #F4F1EA 0 2px, rgba(0,0,0,0) 3px) 11px 7px/43px 37px, radial-gradient(circle, #111 0 2px, rgba(0,0,0,0) 3px) 17px 13px/23px 41px, linear-gradient(160deg, #C4433A, ${K.meat})` }} />
);
export const ChCoat: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Versus f={f} at={at(t)} at2={at(t2)} title="See red meat between the specks"
        l={<Rubbed heavy />} r={<Rubbed />} lt="Caked on" rt="A light coat" ls="a mouthful of sand" rs="pressed in, not rubbed" />
    </Scene>
  );
};

// ═══ TRICK5 · humo blanco vs humo azul ═══
const Smoke: React.FC<{ f: number; thick?: boolean }> = ({ f, thick }) => (
  <div style={{ position: "relative", width: 460, height: 500, borderRadius: 24, overflow: "hidden", background: "linear-gradient(180deg, #2E3A46, #1A2129)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.45)" }}>
    <div style={{ position: "absolute", left: 180, bottom: 0, width: 100, height: 150, background: "linear-gradient(90deg, #1b1b1b, #444 50%, #1b1b1b)", borderRadius: 6 }} />
    {Array.from({ length: thick ? 14 : 7 }).map((_, i) => {
      const ph = ((f * (thick ? 1.6 : 1.1) + i * 23) % 140) / 140;
      const size = thick ? 120 + ph * 230 : 40 + ph * 90;
      return <div key={i} style={{ position: "absolute", left: 230 - size / 2 + Math.sin(i * 2 + f / 20) * (thick ? 60 : 30) * ph, bottom: 130 + ph * 330, width: size, height: size, borderRadius: "50%",
        background: thick ? `radial-gradient(circle, rgba(240,240,240,${0.85 * (1 - ph)}), rgba(240,240,240,0) 70%)` : `radial-gradient(circle, rgba(160,195,235,${0.75 * (1 - ph)}), rgba(150,185,225,0) 70%)` }} />;
    })}
  </div>
);
export const ChSmoke: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Versus f={f} at={at(t)} at2={at(t2)} l={<Smoke f={f} thick />} r={<Smoke f={f} />} lt="Thick white" rt="Thin blue" ls="tastes like an ashtray" rs="barely see it · a whisper" />
    </Scene>
  );
};

// ═══ TRICK5_B · dial del ahumador sube a 250 ═══
export const ChDial: P<{ t: number; deg: number; lab: string; t2: number }> = ({ a, t, deg, lab, t2 }) => {
  const { f, at } = useT(a);
  const v = 100 + (deg - 100) * ez((f - at(t)) / 40) + (f > at(t) + 40 ? 1.5 * Math.sin(f / 12) : 0);
  const ang = interpolate(v, [100, 400], [-130, 130]);
  return (
    <Scene f={f} glow={0.6}>
      <div style={{ position: "absolute", left: 260, top: 140, width: 800, height: 800, borderRadius: "50%", background: STEEL, boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 26px #2a2a2a" }}>
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #FFFDF6, #E9E2D0)", boxShadow: "inset 0 8px 30px rgba(0,0,0,0.35)" }}>
          {Array.from({ length: 13 }).map((_, i) => {
            const aa = -130 + i * (260 / 12), val = 100 + i * 25;
            return <div key={i} style={{ position: "absolute", left: 340 - 3, top: 0, width: 6, height: 340, transformOrigin: "50% 100%", transform: `rotate(${aa}deg)` }}>
              <div style={{ width: 6, height: i % 2 ? 26 : 46, background: val >= 225 && val <= 275 ? K.green : K.ink }} />
              {i % 2 === 0 ? <div style={{ position: "absolute", top: 54, left: -40, width: 86, textAlign: "center", transform: `rotate(${-aa}deg)`, fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: K.ink }}>{val}</div> : null}
            </div>;
          })}
          <div style={{ position: "absolute", left: 340 - 120, top: 340 - 120, width: 240, height: 240, borderRadius: "50%", border: `16px solid rgba(62,122,58,0.25)`, opacity: 0 }} />
          <div style={{ position: "absolute", left: 340 - 8, top: 60, width: 16, height: 280, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, background: `linear-gradient(${K.red}, #5a0e0a)`, borderRadius: 8, boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 340 - 36, top: 340 - 36, width: 72, height: 72, borderRadius: "50%", background: STEEL, boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }} />
          <Lab size={46} style={{ position: "absolute", bottom: 150, width: "100%", textAlign: "center", opacity: 0.6 }}>°F</Lab>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 330 }}>
        <Lab size={250} color={K.cream} ls={-4}><Num v={deg} f={f} at={at(t)} dur={40} />°</Lab>
        <Ember f={f} at={at(t2)} w={560} style={{ position: "relative", marginTop: 10 }} />
        <In f={f} at={at(t2)}><Hand size={84} color={K.emberHi} style={{ marginTop: 30, width: 640 }}>{lab.toLowerCase()}</Hand></In>
      </div>
    </Scene>
  );
};

// ═══ TRICK5_C · 3 horas sin abrir ═══
export const ChClock: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / 50);
  return (
    <Scene f={f}>
      <div style={{ position: "absolute", left: 230, top: 160, width: 760, height: 760, borderRadius: "50%", background: `conic-gradient(rgba(224,102,42,0.85) 0 ${p * 90}deg, rgba(0,0,0,0) ${p * 90}deg), radial-gradient(circle, #FBF6EA, #E8DCC2)`,
        boxShadow: "0 0 0 22px #3a2416, 0 0 0 30px #1a0c05, 0 40px 80px rgba(0,0,0,0.6)" }}>
        {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 377, top: 20, width: 6, height: 360, transformOrigin: "50% 100%", transform: `rotate(${i * 30}deg)` }}><div style={{ width: 6, height: 40, background: K.ink }} /></div>)}
        <div style={{ position: "absolute", left: 372, top: 150, width: 16, height: 230, transformOrigin: "50% 100%", transform: `rotate(${p * 90}deg)`, background: K.ink, borderRadius: 8 }} />
        <div style={{ position: "absolute", left: 376, top: 60, width: 8, height: 320, transformOrigin: "50% 100%", transform: `rotate(${p * 1080}deg)`, background: K.red, borderRadius: 4 }} />
      </div>
      <div style={{ position: "absolute", left: 1100, top: 260 }}>
        <Lab size={180} color={K.cream}><Num v={3} f={f} at={at(t)} dur={50} /> hours</Lab>
        <In f={f} at={at(t2)}><Lab size={86} color={K.emberHi} style={{ marginTop: 20 }}>do not touch it</Lab></In>
        <In f={f} at={at(t2) + 14}><Hand size={74} color={K.cream} style={{ marginTop: 30 }}>every peek = +20 minutes</Hand></In>
      </div>
    </Scene>
  );
};

// ═══ TRICK6 · la meseta (stall) en 165 ═══
export const ChStall: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t) + 30) / 50);
  const X0 = 320, Y0 = 860, W = 1300, H = 600;
  const fn = (x: number) => x < 0.45 ? 40 + (165 - 40) * Math.sin((x / 0.45) * Math.PI / 2) : x < 0.75 ? 165 + 2 * Math.sin(x * 60) : 165 + (205 - 165) * ((x - 0.75) / 0.25);
  const y = (v: number) => Y0 - H * (v - 30) / 190;
  let d = ""; for (let i = 0; i <= 80 * p; i++) { const x = i / 80; d += `${i ? "L" : "M"} ${X0 + W * x} ${y(fn(x))} `; }
  const b = ez((f - at(t2)) / 14);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 30} x={200} y={120} w={1520} h={880} kind="chalk" />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} y1={y(165)} x2={X0 + W} y2={y(165)} stroke="rgba(233,196,106,0.45)" strokeWidth={4} strokeDasharray="18 14" />
        <path d={d} fill="none" stroke={K.emberHi} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={X0 + W * 0.45} y={y(165) - 70} width={W * 0.3 * b} height={140} fill="rgba(143,179,217,0.18)" stroke="rgba(143,179,217,0.8)" strokeWidth={4} rx={16} />
      </svg>
      <Lab size={74} color={K.gold} style={{ position: "absolute", left: X0 - 10, top: y(165) - 110 }}>165°F</Lab>
      <In f={f} at={at(t2)} style={{ position: "absolute", left: X0 + W * 0.45 + 20, top: y(165) + 90 }}><Lab size={110} color={K.blue}>The stall</Lab><Hand size={64} color={K.chalk}>1-2 hours · don't panic</Hand></In>
      <Lab size={56} color={K.chalk} ls={4} style={{ position: "absolute", left: 260, top: 160 }}>Inside temperature</Lab>
    </Scene>
  );
};

// ═══ TRICK6_C · aluminio vs papel ═══
const Pack: React.FC<{ foil?: boolean; f: number }> = ({ foil, f }) => (
  <div style={{ position: "relative", width: 480, height: 300 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: foil ? STEEL : PINK, boxShadow: "0 24px 44px rgba(0,0,0,0.5), inset 0 -10px 20px rgba(0,0,0,0.15)" }} />
    <div style={{ position: "absolute", left: 40, right: 40, top: 140, height: 6, background: foil ? "rgba(0,0,0,0.25)" : "rgba(120,40,30,0.35)" }} />
    {!foil ? Array.from({ length: 5 }).map((_, i) => { const ph = ((f + i * 17) % 70) / 70;
      return <div key={i} style={{ position: "absolute", left: 80 + i * 75, top: -20 - ph * 180, width: 60 + ph * 50, height: 60 + ph * 50, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${0.5 * (1 - ph)}), rgba(255,255,255,0) 70%)` }} />; })
      : <div style={{ position: "absolute", left: 60, right: 60, bottom: -40, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(120,70,40,0.65), rgba(120,70,40,0) 70%)" }} />}
  </div>
);
export const ChWrap: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Versus f={f} at={at(t)} at2={at(t2)} title="Why paper and not foil?" l={<Pack foil f={f} />} r={<Pack f={f} />}
        lt="Foil" rt="Pink paper" ls="steam → crust turns to mush" rs="breathes · crust stays a crust" />
    </Scene>
  );
};

// ═══ TRICK7 · 202-207 °F, pero manda el tacto ═══
export const ChTemp: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const lvl = 0.2 + 0.62 * ez((f - at(t)) / 30) + 0.06 * ez((f - at(t2)) / 20);
  return (
    <Scene f={f}>
      <div style={{ position: "absolute", left: 360, top: 90, width: 150, height: 760, borderRadius: 75, background: "linear-gradient(90deg, #d9dde0, #fff 40%, #c9cfd3)", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", left: 50, bottom: 40, width: 50, height: 660 * lvl, borderRadius: 25, background: `linear-gradient(${K.red}, #E04A2E)` }} />
        <div style={{ position: "absolute", left: -20, top: 110, width: 190, height: 110, border: `6px solid ${K.green}`, borderRadius: 18, opacity: ez((f - at(t2)) / 10) }} />
      </div>
      <div style={{ position: "absolute", left: 335, top: 800, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FF6A4A, #B3261E 70%)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 640, top: 150 }}>
        <In f={f} at={at(t)}><Lab size={190} color={K.cream} ls={-3}>202–207°F</Lab></In>
        <In f={f} at={at(t2) + 6}><Hand size={74} color={K.gold} style={{ marginTop: 10 }}>somewhere in there…</Hand></In>
        <Card f={f} at={at(t3)} x={0} y={360} w={1050} h={360} rot={-1.5} kind="pink">
          <Lab size={88} style={{ position: "absolute", left: 60, top: 50 }}>Feel beats the number</Lab>
          <Hand size={84} style={{ position: "absolute", left: 60, top: 190 }}>slides in like soft butter</Hand>
        </Card>
      </div>
    </Scene>
  );
};

// ═══ TRICK7_B · reposo en la conservadora ═══
export const ChRest: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const s = sp(f, at(t), 13, 120);
  return (
    <Scene f={f}>
      <div style={{ position: "absolute", left: 220, top: 300 + (1 - s) * 80, width: 760, height: 560, opacity: cl(s * 1.5) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 130, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(180deg, #F4F1EA, #D9D4CA)", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 20, top: 120, width: 720, height: 440, borderRadius: "10px 10px 30px 30px", background: `linear-gradient(180deg, #D63A2E, #9E1F17)`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 -18px 30px rgba(0,0,0,0.25), inset 0 10px 0 rgba(255,255,255,0.15)" }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: 60, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.18)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1100, top: 220 }}>
        <In f={f} at={at(t)}><Lab size={120} color={K.cream} ls={6}>The rest</Lab></In>
        <In f={f} at={at(t2)}><Lab size={190} color={K.gold} style={{ marginTop: 20 }}>1 hour</Lab></In>
        <div style={{ position: "relative" }}>
          <In f={f} at={at(t3)}><Lab size={150} color={K.emberHi}>2 is better</Lab></In>
        </div>
        <In f={f} at={at(t3) + 12}><Hand size={70} color={K.cream} style={{ marginTop: 20 }}>wrapped · towel · lid shut</Hand></In>
      </div>
    </Scene>
  );
};

// ═══ TRICK8 · la veta: brisket 1 dirección, chuck 3-4 ═══
const Grain: React.FC<{ dirs: number[]; w: number; h: number }> = ({ dirs, w, h }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 40, overflow: "hidden", boxShadow: "inset 0 0 0 14px #2a1008, 0 24px 44px rgba(0,0,0,0.5)", background: "#8E2E26" }}>
    {dirs.map((d, i) => {
      const n = dirs.length, cw = w / Math.min(n, 2), ch = n > 2 ? h / 2 : h;
      return <div key={i} style={{ position: "absolute", left: (i % 2) * cw, top: Math.floor(i / 2) * ch, width: n === 3 && i === 2 ? w : cw, height: ch,
        background: `repeating-linear-gradient(${d}deg, #A9382F 0 9px, #7C221C 9px 14px)`, boxShadow: "inset 0 0 0 5px rgba(246,232,214,0.9)" }} />;
    })}
  </div>
);
export const ChGrain: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t)} x={150} y={170} w={760} h={740} rot={-1.5}>
        <div style={{ position: "absolute", left: 130, top: 120 }}><Grain dirs={[0]} w={500} h={340} /></div>
        <Lab size={70} style={{ position: "absolute", bottom: 130, width: "100%", textAlign: "center" }}>Brisket</Lab>
        <Hand size={56} style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center" }}>one grain, one way</Hand>
      </Card>
      <Card f={f} at={at(t2)} x={1010} y={170} w={760} h={740} rot={1.5}>
        <div style={{ position: "absolute", left: 130, top: 120 }}><Grain dirs={[0, 90, 40]} w={500} h={340} /></div>
        <Lab size={70} color={K.red} style={{ position: "absolute", bottom: 130, width: "100%", textAlign: "center" }}>Chuck</Lab>
        <Hand size={56} style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center" }}>3-4 muscles · every grain different</Hand>
      </Card>
    </Scene>
  );
};
// ═══ TRICK8_B · cortar a través de la veta, grosor de un lápiz ═══
export const ChSlice: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const n = Math.floor(8 * ez((f - at(t)) / 30));
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 8} x={200} y={130} w={1520} h={820} style={{ background: "repeating-linear-gradient(90deg, #5a3a22 0 60px, #4b2f1b 60px 64px), linear-gradient(#5a3a22, #3e2614)" }}>
        <div style={{ position: "absolute", left: 160, top: 170, width: 900, height: 400 }}><Grain dirs={[0]} w={900} h={400} /></div>
        {Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", left: 230 + i * 100, top: 140, width: 8, height: 460, background: "linear-gradient(#e8edf0, #9aa3a8)", boxShadow: "0 0 10px rgba(255,255,255,0.6)" }} />)}
        <div style={{ position: "absolute", left: 1110, top: 200 }}>
          <In f={f} at={at(t)}><Lab size={92} color={K.cream}>Lines left → right</Lab></In>
          <In f={f} at={at(t) + 12}><Lab size={92} color={K.emberHi} style={{ marginTop: 20 }}>Slice straight down</Lab></In>
        </div>
        <In f={f} at={at(t2)} style={{ position: "absolute", left: 160, top: 640, display: "flex", alignItems: "center" }}>
          <div style={{ width: 640, height: 34, borderRadius: 4, background: "linear-gradient(90deg, #F2C14E 0 88%, #E9B07A 88% 95%, #333 95%)", boxShadow: "0 8px 16px rgba(0,0,0,0.5)" }} />
          <Hand size={84} color={K.cream} style={{ marginLeft: 40 }}>as thick as a pencil</Hand>
        </In>
      </Card>
    </Scene>
  );
};

// ═══ TRICK8_C · burnt ends: en el pueblo los venden como especial ═══
export const ChBurnt: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <div style={{ position: "absolute", left: 220, top: 230, width: 700, height: 560 }}>
        {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 4) * 160 + (i % 3) * 8, top: Math.floor(i / 4) * 130 + (i % 2) * 10, width: 130, height: 110, borderRadius: 18,
          transform: `rotate(${(i * 37) % 20 - 10}deg) scale(${ez((f - at(t) - i) / 8)})`, background: "radial-gradient(circle at 35% 30%, #9a3a22, #4a160c 60%, #1c0804)", boxShadow: "inset 0 -8px 14px rgba(0,0,0,0.5), inset 0 6px 8px rgba(255,170,110,0.35), 0 10px 18px rgba(0,0,0,0.5)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 1040, top: 220 }}>
        <In f={f} at={at(t)}><Lab size={150} color={K.cream}>Burnt ends</Lab></In>
        <Card f={f} at={at(t2)} x={0} y={230} w={700} h={330} rot={3} kind="chalk">
          <Hand size={70} color={K.chalk} style={{ position: "absolute", left: 50, top: 30 }}>TODAY'S SPECIAL</Hand>
          <Hand size={92} color={K.gold} style={{ position: "absolute", left: 50, top: 120 }}>½ lb = a whole roast</Hand>
        </Card>
      </div>
    </Scene>
  );
};

// ═══ FIX · si no salió bien ═══
export const ChFix: P<{ t: number; rows: { p: string; f: string; t: number }[] }> = ({ a, t, rows }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 10} x={160} y={80} w={1600} h={920}>
        <Lab size={70} color={K.ink} ls={4} style={{ position: "absolute", top: 40, width: "100%", textAlign: "center" }}>If it didn't come out right</Lab>
        {rows.map((r, i) => (
          <div key={i} style={{ position: "absolute", left: 80, right: 80, top: 190 + i * 180, height: 150, display: "flex", alignItems: "center", borderTop: i ? "3px dashed rgba(42,26,16,0.3)" : undefined }}>
            <In f={f} at={at(r.t)} x={-30} from={0} style={{ width: 600 }}><Lab size={74} color={K.red}>{r.p}</Lab></In>
            <div style={{ width: 120 * ez((f - at(r.t) - 6) / 10), height: 8, background: K.ink, borderRadius: 4, marginRight: 50 }} />
            <In f={f} at={at(r.t) + 10} x={-30} from={0}><Hand size={r.f.length > 22 ? 64 : 80} color={K.green}>{r.f.toLowerCase()}</Hand></In>
          </div>
        ))}
      </Card>
    </Scene>
  );
};
export const ChThin: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 10} x={300} y={140} w={1320} h={800} kind="pink">
        <Lab size={80} style={{ position: "absolute", top: 50, width: "100%", textAlign: "center" }}>Only a thin one at the store?</Lab>
        <div style={{ position: "absolute", left: 120, top: 260 }}>
          <In f={f} at={at(t)} x={-30} from={0}><Lab size={100}>Wrap sooner · 150°F</Lab></In>
          <In f={f} at={at(t2)} x={-30} from={0}><Lab size={100} color={K.red} style={{ marginTop: 50 }}>Pull 2 hours earlier</Lab></In>
          <In f={f} at={at(t2) + 20}><Hand size={80} style={{ marginTop: 50 }}>still beats any dry brisket</Hand></In>
        </div>
      </Card>
    </Scene>
  );
};

// ═══ MONEY · la cuenta en el libro ═══
export const ChMath: P<{ t: number; t2: number; t3: number; t4: number }> = ({ a, t, t2, t3, t4 }) => {
  const { f, at } = useT(a);
  const row = (l: string, m: string, r: React.ReactNode, tt: number, y: number, col: string) => (
    <In f={f} at={tt} x={-30} from={0} style={{ position: "absolute", left: 100, right: 100, top: y, display: "flex", alignItems: "baseline" }}>
      <Lab size={78} style={{ width: 560 }}>{l}</Lab><Hand size={78} style={{ width: 430 }}>{m}</Hand><Lab size={120} color={col}>{r}</Lab>
    </In>
  );
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 10} x={200} y={110} w={1520} h={860} style={{ background: ["linear-gradient(90deg, rgba(0,0,0,0) 1060px, rgba(180,60,50,0.4) 1060px 1064px, rgba(0,0,0,0) 1064px)", "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 96px, rgba(60,110,90,0.3) 96px 99px)", PAPER].join(",") }}>
        <Lab size={60} ls={8} style={{ position: "absolute", top: 40, width: "100%", textAlign: "center" }}>The arithmetic</Lab>
        {row("Brisket flat", "4 lb × $10", <Num v={40} f={f} at={at(t2)} pre="$" />, at(t), 200, K.red)}
        {row("Chuck roast", "4 lb × <$5", <>{"<"}<Num v={20} f={f} at={at(t3)} pre="$" /></>, at(t3) - 10, 400, K.green)}
      </Card>
      <Stamp f={f} at={at(t4)} txt="half price" color={K.green} size={130} rot={-9} style={{ left: 640, top: 690, background: "rgba(246,238,220,0.85)" }} />
    </Scene>
  );
};
export const ChPlates: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      {Array.from({ length: 6 }).map((_, i) => {
        const s = sp(f, at(t) + i * 4, 12, 160);
        return <div key={i} style={{ position: "absolute", left: 260 + (i % 3) * 480, top: 120 + Math.floor(i / 3) * 400, width: 340, height: 340, borderRadius: "50%", transform: `scale(${s})`,
          background: "radial-gradient(circle, #FBFAF6 0 52%, #E9E6DE 53% 60%, #FBFAF6 61%)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", left: 90, top: 110, width: 160, height: 110, borderRadius: "40% 60% 50% 50%", background: "repeating-linear-gradient(80deg, #8E2E26 0 14px, #6b1e18 14px 18px), #8E2E26", boxShadow: "inset 0 0 0 8px #2a1008" }} />
        </div>;
      })}
      <In f={f} at={at(t2)} style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center" }}>
        <span style={{ background: K.ember, padding: "10px 50px", borderRadius: 10, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}><Lab size={100} color="#fff" style={{ display: "inline" }}>6 plates · ≈ $3 a plate</Lab></span>
      </In>
    </Scene>
  );
};
export const ChSeven: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const bar = (v: number, tt: number, col: string, lab: string) => (
    <div style={{ display: "flex", alignItems: "center", marginTop: 50 }}>
      <div style={{ height: 120, width: 1000 * v * ez((f - tt) / 22), background: col, borderRadius: 12, boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.2), 0 14px 26px rgba(0,0,0,0.4)" }} />
      <In f={f} at={tt + 14} x={-20} from={0}><Lab size={78} color={K.cream} style={{ marginLeft: 36 }}>{lab}</Lab></In>
    </div>
  );
  return (
    <Scene f={f}>
      <div style={{ position: "absolute", left: 200, top: 170 }}>
        <In f={f} at={at(t) - 6}><Lab size={130} color={K.gold}>$34 buys…</Lab></In>
        {bar(0.07, at(t), "#CDBFA8", "½ lb brisket (in town)")}
        {bar(0.95, at(t2), K.ember, "")}
        <In f={f} at={at(t2) + 20} style={{ position: "absolute", left: 60, top: 395 }}><Lab size={78} color="#fff">almost 7 lb of chuck</Lab></In>
      </div>
    </Scene>
  );
};
export const ChWeek: P<{ t: number; items: { d: string; txt: string; t: number }[]; t2: number }> = ({ a, t, items, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      {items.map((it, i) => (
        <Card key={i} f={f} at={at(it.t)} x={150 + i * 410} y={150} w={370} h={560} rot={[-2, 1, -1, 2][i]}>
          <div style={{ height: 120, background: i === 0 ? K.red : "#3a2416", display: "flex", alignItems: "center", justifyContent: "center" }}><Lab size={76} color={K.cream} ls={6}>{it.d}</Lab></div>
          <Hand size={70} style={{ textAlign: "center", marginTop: 130, padding: "0 20px" }}>{it.txt.toLowerCase()}</Hand>
        </Card>
      ))}
      <In f={f} at={at(t2)} style={{ position: "absolute", top: 800, width: "100%", textAlign: "center" }}><Lab size={96} color={K.cream} ls={3}>2 roasts · $40 · 5 dinners</Lab></In>
      <Ember f={f} at={at(t2) + 8} w={1100} style={{ left: 410, top: 930 }} />
    </Scene>
  );
};

// ═══ CLOSE · tarea ═══
export const ChHomework: P<{ t: number; t2: number; t3: number; t4: number }> = ({ a, t, t2, t3, t4 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <Card f={f} at={at(t) - 10} x={240} y={90} w={1440} h={900} kind="chalk">
        <Write f={f} at={at(t)} style={{ position: "absolute", left: 100, top: 50 }}><Hand size={110} color={K.gold}>This week's homework</Hand></Write>
        <Write f={f} at={at(t2)} dur={24} style={{ position: "absolute", left: 100, top: 250 }}><Hand size={94} color={K.chalk}>1. ask for a chuck roast 3" thick,</Hand><Hand size={94} color={K.chalk} style={{ marginLeft: 70 }}>from the rib end</Hand></Write>
        <Write f={f} at={at(t3)} dur={20} style={{ position: "absolute", left: 100, top: 530 }}><Hand size={94} color={K.chalk}>2. salt it the night before</Hand></Write>
        <In f={f} at={at(t4)} style={{ position: "absolute", left: 100, top: 690 }}><Lab size={70} color={K.emberHi} ls={4}>Just those two.</Lab></In>
      </Card>
    </Scene>
  );
};
export const ChComment: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const bub = (q: string, tt: number, y: number, x: number) => (
    <Card f={f} at={tt} x={x} y={y} w={1100} h={250} rot={x > 500 ? 1 : -1} style={{ borderRadius: 40 }}>
      <div style={{ position: "absolute", left: 40, top: 45, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${K.emberHi}, ${K.ember})` }} />
      <Lab size={74} style={{ position: "absolute", left: 250, top: 75, right: 40 }}>{q}</Lab>
    </Card>
  );
  return (
    <Scene f={f}>
      <In f={f} at={at(t) - 12} style={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }}><Hand size={110} color={K.cream}>tell me in the comments</Hand></In>
      {bub("What do you pay for brisket?", at(t), 300, 260)}
      {bub("What state are you watching from?", at(t2), 620, 560)}
    </Scene>
  );
};
export const ChNext: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f} glow={0.6}>
      <In f={f} at={at(t) - 10} style={{ position: "absolute", top: 150, width: "100%", textAlign: "center" }}><Lab size={70} color={K.emberHi} ls={10}>Next Sunday</Lab></In>
      <div style={{ position: "absolute", top: 260, width: "100%", textAlign: "center", transform: `scale(${0.7 + 0.3 * sp(f, at(t), 12, 120)})` }}>
        <Lab size={300} color={K.cream} ls={-4}>25</Lab>
      </div>
      <In f={f} at={at(t) + 8} style={{ position: "absolute", top: 600, width: "100%", textAlign: "center" }}><Lab size={92} color={K.cream} ls={4}>old smokehouse tricks</Lab></In>
      <Stamp f={f} at={at(t2)} txt="never written down" color={K.ember} size={70} rot={-4} style={{ left: 600, top: 780 }} />
    </Scene>
  );
};
export const ChSaying: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Scene f={f}>
      <In f={f} at={at(t) - 14} style={{ position: "absolute", left: 220, top: 120 }}><Hand size={300} color={K.ember} style={{ opacity: 0.8 }}>"</Hand></In>
      <div style={{ position: "absolute", left: 300, right: 260, top: 280 }}>
        <Write f={f} at={at(t)} dur={26}><Hand size={120} color={K.cream}>The best meat in the cow</Hand></Write>
        <Write f={f} at={at(t2)} dur={26}><Hand size={120} color={K.emberHi}>is the meat nobody wants to pay for.</Hand></Write>
        <In f={f} at={at(t2) + 34}><Lab size={60} color={K.cream} ls={8} style={{ marginTop: 60 }}>— Granddaddy, 1958</Lab></In>
      </div>
    </Scene>
  );
};
