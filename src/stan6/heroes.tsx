// ── HÉROES de stan6 (Stan the Butcher, video 6: la chuleta de cerdo jugosa, 9 trucos). Claude, 16-oct-2026.
//    Juego PROPIO (no recicla stan1-5 ni mickey): azulejo blanco rajado del local, papel de carnicero, tabla de madera de testa,
//    acero cepillado, pizarra, cuenta de restaurante, etiqueta de supermercado con lupa, termómetro de dial, sartén de hierro vista de arriba,
//    chuleta de costilla dibujada en CSS (carne, gorro de grasa, hueso), regla de grosor, reloj de sal, ticket de balanza, tarjeta de comentario.
//    PURO CSS (cero imágenes): texturas con gradientes + perspectiva + sombras en capas + brillo que barre.
//    Tipografías: 2 familias (Bebas Neue = rótulos y números · Permanent Marker = mano). Paleta del local: azulejo, kielbasa, rayita roja del gorro, acero.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { useT, sp, ez, eo, cl, P } from "../lkit/core";

const BEB = loadBebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const MRK = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const KIEL = "#7A1E1C", RED = "#C42A2E", PAPER = "#F8F5EE", INK = "#1D1A17", STEEL = "#9AA2A8", GOLD = "#C98A3A", MEAT = "#E6A39A", MEAT2 = "#C9786E", FAT = "#F5EBDC", OK = "#2E7D4C", BLUE = "#26476E", CRUST = "#8A4A22";
type A0 = { a0?: number };

// ── texturas del oficio (gradientes) ─────────────────────────────────────
const TX: Record<string, string> = {
  tile: "linear-gradient(118deg, transparent 0 41%, rgba(60,60,60,0.22) 41.2%, transparent 41.6% 100%), linear-gradient(64deg, transparent 0 63%, rgba(60,60,60,0.16) 63.15%, transparent 63.5%), repeating-linear-gradient(0deg, #B9BDB8 0 5px, transparent 5px 150px), repeating-linear-gradient(90deg, #B9BDB8 0 5px, transparent 5px 150px), radial-gradient(ellipse 50% 40% at 30% 25%, rgba(255,255,255,0.8), transparent 70%), linear-gradient(170deg, #F1F2EE, #DADDD7)",
  paper: "repeating-linear-gradient(87deg, rgba(150,140,120,0.06) 0 1px, transparent 1px 7px), repeating-linear-gradient(3deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 11px), radial-gradient(ellipse 45% 35% at 70% 30%, rgba(255,255,255,0.6), transparent 70%), linear-gradient(165deg, #FBF9F3, #E9E3D6)",
  block: "repeating-radial-gradient(circle at 30% 120%, rgba(70,38,14,0.16) 0 3px, transparent 3px 22px), repeating-linear-gradient(90deg, rgba(60,30,10,0.12) 0 2px, transparent 2px 160px), repeating-linear-gradient(0deg, rgba(60,30,10,0.10) 0 2px, transparent 2px 120px), radial-gradient(ellipse 50% 40% at 40% 30%, rgba(255,220,170,0.25), transparent 70%), linear-gradient(180deg, #A9784A, #7D5330)",
  steel: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px, rgba(0,0,0,0.05) 3px 4px), radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,0.45), transparent 70%), linear-gradient(175deg, #C4CACE, #858D93)",
  slate: "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.07), transparent 70%), radial-gradient(ellipse 30% 14% at 70% 65%, rgba(255,255,255,0.06), transparent 70%), repeating-linear-gradient(170deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(180deg, #2C302F, #1C201F)",
  kiel: "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 7px), radial-gradient(ellipse 40% 30% at 25% 20%, rgba(255,255,255,0.10), transparent 70%), linear-gradient(180deg, #7E2421, #4E1110)",
  cloth: "repeating-linear-gradient(0deg, rgba(196,42,46,0.55) 0 46px, transparent 46px 92px), repeating-linear-gradient(90deg, rgba(196,42,46,0.55) 0 46px, transparent 46px 92px), linear-gradient(#F6F1E7, #E8E0D0)",
  night: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,215,150,0.18), transparent 70%), linear-gradient(180deg, #23272C, #121417)",
};
const Bg: React.FC<{ k: keyof typeof TX; f: number; d: number }> = ({ k, f, d }) => {
  const sweep = -30 + 160 * (f / Math.max(1, d));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: TX[k], transform: `scale(${1.05 + 0.03 * f / Math.max(1, d)})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,250,235,0.12) ${sweep}%, transparent ${sweep + 12}%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 65% at 40% 0%, rgba(255,236,200,0.16), rgba(255,236,200,0) 70%)" }} />
  </AbsoluteFill>;
};
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-7 * Math.sin(f / 45)}px, ${5 * Math.cos(f / 51)}px) scale(${1.02 + 0.01 * Math.sin(f / 59)})` }}>{children}</AbsoluteFill>;
};
const shell = (bg: React.ReactNode, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{bg}<Drift>{c}</Drift></AbsoluteFill>;
const Lab: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties; sh?: boolean }> = ({ txt, size, color = PAPER, u = 1, style, sh = true }) => (
  <div style={{ fontFamily: BEB, fontSize: size, color, lineHeight: 0.95, letterSpacing: 2, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 28}px) scale(${0.88 + 0.12 * u})`,
    textShadow: sh ? "0 3px 0 rgba(0,0,0,0.22), 0 10px 26px rgba(0,0,0,0.42)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Mk: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties }> = ({ txt, u, size, color = INK, style }) => (
  <div style={{ fontFamily: MRK, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.1, paddingRight: "0.3em", clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.06 - 6}% -25% -2%)`, ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 74, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={color || (no ? RED : OK)} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const Stamp: React.FC<{ txt: string; s: number; x: number; y: number; r: number; color?: string; size?: number }> = ({ txt, s, x, y, r, color = RED, size = 96 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg) scale(${2 - Math.min(1, s)})`, opacity: cl(s * 3) * 0.92, border: `9px solid ${color}`, borderRadius: 10, padding: "4px 30px",
    fontFamily: BEB, fontSize: size, letterSpacing: 4, color, background: "rgba(255,250,244,0.55)", boxShadow: "inset 0 0 0 4px rgba(255,250,244,0.6)", whiteSpace: "nowrap", mixBlendMode: "multiply" }}>{txt}</div>
);
// sombra de contacto + ambiente
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 18px 30px rgba(0,0,0,0.33), 0 44px 80px rgba(0,0,0,0.28)";
const start = (a: number, a0?: number) => (a0 ?? a);

// chuleta de costilla vista de arriba: carne con marmoleo, gorro de grasa, hueso al costado. cook 0 = cruda, 1 = dorada; gray = gris seca
const Chop: React.FC<{ w: number; h: number; cook?: number; gray?: number; bone?: boolean; cuts?: number; style?: React.CSSProperties }> = ({ w, h, cook = 0, gray = 0, bone = true, cuts = 0, style }) => {
  const meat = gray > 0.5 ? "radial-gradient(ellipse at 40% 35%, #B3A79C, #8A7E73 60%, #6E645A)" : cook > 0.5
    ? "radial-gradient(ellipse at 40% 35%, #C9853F, #9A5524 55%, #6E3714)" : `radial-gradient(ellipse at 40% 35%, ${MEAT}, ${MEAT2} 70%)`;
  return <div style={{ position: "relative", width: w, height: h, ...style }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "48% 52% 44% 56% / 58% 50% 50% 42%", background: gray > 0.5 ? "#CFC6B8" : cook > 0.5 ? "linear-gradient(160deg, #E3B064, #B57028)" : `linear-gradient(160deg, #FFF7EA, ${FAT})`, boxShadow: SH }} />
    <div style={{ position: "absolute", left: w * 0.07, top: h * 0.1, right: w * (bone ? 0.2 : 0.07), bottom: h * 0.1, borderRadius: "46% 50% 44% 52% / 55% 48% 52% 45%", background: meat, boxShadow: "inset 0 0 18px rgba(0,0,0,0.18)" }}>
      {cook < 0.5 && gray < 0.5 ? [...Array(7)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${12 + i * 11}%`, top: `${20 + (i * 37) % 55}%`, width: `${18 + (i % 3) * 8}%`, height: 3, borderRadius: 2, background: "rgba(255,245,235,0.55)", transform: `rotate(${(i % 2 ? 1 : -1) * 24}deg)` }} />) : null}
    </div>
    {bone ? <div style={{ position: "absolute", right: w * 0.04, top: h * 0.06, width: w * 0.13, height: h * 0.88, borderRadius: w * 0.07, background: "linear-gradient(90deg, #F8F2E4, #DCCFB6 60%, #BBA98A)", boxShadow: "inset -4px 0 6px rgba(0,0,0,0.15)" }} /> : null}
    {[...Array(cuts)].map((_, i) => <div key={i} style={{ position: "absolute", left: w * (0.2 + i * 0.18), top: -4, width: 6, height: h * 0.12, background: "#5B1C16", borderRadius: 3 }} />)}
  </div>;
};

// 1 · capítulo: cartel de precio de vitrina (papel blanco con borde rojo) clavado en el riel de kielbasas, número gigante
export const Chapter: P<{ n: number; title: string; sub: string; tw: number } & A0> = ({ a, d, n, title, sub, tw, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), s = sp(f, at(tw) + 8, 14, 140), sw = Math.sin(f / 15) * 1.5 * (1 - cl((f - at(start(a, a0))) / 60));
  return shell(<Bg k="tile" f={f} d={d} />, <>
    {/* riel de acero con kielbasas colgando */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 26, background: "linear-gradient(180deg, #E6EAEC, #7D858B)", boxShadow: "0 8px 12px rgba(0,0,0,0.3)" }} />
    {[150, 330, 1560, 1740].map((x, i) => <div key={x} style={{ position: "absolute", left: x, top: 90, width: 60, height: 420 + (i % 2) * 60, borderRadius: 30, background: "linear-gradient(90deg, #4A0F0E, #8C2A24 45%, #5A1412)", boxShadow: "8px 14px 20px rgba(0,0,0,0.3)", transform: `rotate(${Math.sin(f / 30 + i) * 1.5}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "repeating-linear-gradient(180deg, transparent 0 70px, rgba(255,240,220,0.18) 70px 76px)" }} /></div>)}
    <div style={{ position: "absolute", left: 470, top: 80, width: 980, height: 820, transformOrigin: "50% 0", transform: `rotate(${sw + (1 - u) * -5}deg) translateY(${(1 - u) * -600}px)` }}>
      <div style={{ position: "absolute", left: 470, top: 0, width: 40, height: 80, borderRadius: "20px 20px 0 0", border: "8px solid #8E969C", borderBottom: "none" }} />
      <div style={{ position: "absolute", left: 0, top: 70, width: 980, height: 700, background: TX.paper, borderRadius: 8, boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 22, border: `8px solid ${RED}`, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: BEB, fontSize: 70, letterSpacing: 18, color: KIEL }}>TRICK №</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: BEB, fontSize: 400, lineHeight: 1, color: INK, textShadow: "6px 6px 0 rgba(196,42,46,0.25)" }}>{n}</div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 480, textAlign: "center", fontFamily: BEB, fontSize: title.length > 18 ? 96 : 120, lineHeight: 1, color: RED, opacity: cl(s * 2), transform: `translateY(${(1 - s) * 30}px)` }}>{title}</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center" }}>
      <Mk txt={sub} u={cl((f - at(tw) - 16) / 22)} size={62} color={KIEL} />
    </div>
  </>);
};

// 2 · el veredicto de la chuleta seca: plato con chuleta gris y sellos que caen GRAY · TOUGH · SHOE LEATHER · NO JUICE
export const ChopVerdict: P<{ items: { t: number; txt: string }[] } & A0> = ({ a, d, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120);
  return shell(<Bg k="cloth" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 560, top: 190, width: 800, height: 700, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #FFFFFF, #ECECE8 55%, #CFCFC9 70%, #F7F7F4 72%, #DADAD4)", boxShadow: SH, transform: `scale(${0.85 + 0.15 * u})`, opacity: cl(u * 2) }}>
      <Chop w={470} h={360} gray={1} style={{ position: "absolute", left: 165, top: 170, transform: "rotate(-12deg)" }} />
      <div style={{ position: "absolute", left: 470, top: 420, width: 190, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #F2DA9B, #D9B566)", boxShadow: "0 6px 10px rgba(0,0,0,0.2)" }} />
    </div>
    {items.map((it, i) => {
      const s = sp(f, at(it.t), 10, 220); const p = [[150, 140, -9], [1260, 170, 7], [140, 760, 6], [1180, 780, -6]][i % 4];
      return <Stamp key={i} txt={it.txt} s={s} x={p[0]} y={p[1]} r={p[2]} size={110} />;
    })}
  </>);
};

// 3 · la cuenta del restaurante en carpeta de cuero: HERITAGE PORK CHOP · DOUBLE CUT · $38.00 → sello DRY
export const RestBill: P<{ t38: number; tCut: number; tDry: number } & A0> = ({ a, d, t38, tCut, tDry, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), p = sp(f, at(t38), 11, 180), c = sp(f, at(tCut), 12, 160), dr = sp(f, at(tDry), 10, 220);
  return shell(<Bg k="night" f={f} d={d} />, <>
    {/* carpeta de cuero abierta en perspectiva */}
    <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 860, perspective: 1600 }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateX(${24 - 10 * u}deg) translateY(${(1 - u) * 300}px)`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 820, borderRadius: 18, background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 6px), linear-gradient(160deg, #2A1A12, #120A06)", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 330, top: 50, width: 540, height: 720, background: TX.paper, boxShadow: "0 10px 24px rgba(0,0,0,0.5)", padding: "40px 44px", color: INK }}>
          <div style={{ fontFamily: BEB, fontSize: 46, letterSpacing: 10, textAlign: "center", color: "#6D665C" }}>— DOWNTOWN —</div>
          <div style={{ borderTop: "3px solid #BDB5A6", margin: "18px 0 26px" }} />
          <div style={{ fontFamily: BEB, fontSize: 64, lineHeight: 1 }}>HERITAGE PORK CHOP</div>
          <div style={{ fontFamily: BEB, fontSize: 52, color: "#7A1E1C", opacity: cl(c * 2), marginTop: 8 }}>DOUBLE CUT · MUSTARD</div>
          <div style={{ borderTop: "3px dashed #BDB5A6", margin: "40px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: BEB }}>
            <span style={{ fontSize: 60 }}>TOTAL</span>
            <span style={{ fontSize: 170, color: RED, display: "inline-block", transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "100% 70%" }}>${Math.round(38 * cl(p * 1.2))}.00</span>
          </div>
          <div style={{ fontFamily: BEB, fontSize: 40, color: "#8A8276", marginTop: 20 }}>1 PORK CHOP · 1 GUEST</div>
        </div>
      </div>
    </div>
    <Stamp txt="DRY" s={dr} x={760} y={300} r={-12} size={170} />
  </>);
};

// 4 · la promesa: billete de $38 tachado vs chuleta de $5 sobre papel de carnicero + rueda "9 OLD TRICKS"
export const NinePromise: P<{ t9: number; t38: number; t5: number } & A0> = ({ a, d, t9, t38, t5, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), n = sp(f, at(t9), 12, 160), x = ez((f - at(t38)) / 14), v = sp(f, at(t5), 11, 180);
  return shell(<Bg k="paper" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 140, top: 240, width: 520, height: 520, borderRadius: 260, background: `radial-gradient(circle at 35% 30%, #9A2E29, ${KIEL})`, boxShadow: SH + ", inset 0 0 0 14px rgba(248,245,238,0.9), inset 0 0 0 22px rgba(0,0,0,0.15)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${(1 - n) * -40 - 6}deg) scale(${0.7 + 0.3 * n})`, opacity: cl(n * 2) }}>
      <div style={{ fontFamily: BEB, fontSize: 300, lineHeight: 0.9, color: PAPER }}>9</div>
      <div style={{ fontFamily: BEB, fontSize: 64, letterSpacing: 8, color: PAPER }}>OLD TRICKS</div>
    </div>
    <div style={{ position: "absolute", left: 780, top: 170, transform: `translateY(${(1 - u) * 200}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "relative", width: 520, height: 230, borderRadius: 12, background: "linear-gradient(160deg, #F4F1E8, #DAD3C3)", boxShadow: SH, padding: 24 }}>
        <div style={{ fontFamily: BEB, fontSize: 44, color: "#6D665C", letterSpacing: 6 }}>RESTAURANT</div>
        <div style={{ fontFamily: BEB, fontSize: 150, lineHeight: 1, color: INK }}>$38</div>
        <div style={{ position: "absolute", left: 10, top: 115, height: 14, width: 500 * x, background: RED, borderRadius: 7, transform: "rotate(-8deg)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 470, opacity: cl(v * 2), transform: `scale(${0.75 + 0.25 * v})`, transformOrigin: "30% 50%" }}>
      <Chop w={420} h={320} />
      <div style={{ position: "absolute", left: 380, top: 40, width: 360, height: 220, background: "linear-gradient(170deg, #FFFDF8, #EFE6D6)", clipPath: "polygon(14% 0,100% 0,100% 100%,14% 100%,0 50%)", boxShadow: SH, transform: "rotate(8deg)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30 }}>
        <div style={{ textAlign: "right" }}><div style={{ fontFamily: BEB, fontSize: 40, color: "#6D665C" }}>AT HOME</div><div style={{ fontFamily: BEB, fontSize: 140, lineHeight: 0.9, color: OK }}>$5</div></div>
      </div>
    </div>
  </>);
};

// 5 · el cartel del local: letrero esmaltado + contador de años 0→52 + "SOUTH SIDE · CHICAGO" + cajón de leche "AGE 14"
export const ShopSign: P<{ t52: number; tSS: number; t14: number } & A0> = ({ a, d, t52, tSS, t14, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110), y = ez((f - at(t52)) / 40), s = sp(f, at(tSS), 12, 160), k = sp(f, at(t14), 12, 160);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 210, top: 120, width: 1500, height: 420, borderRadius: 30, background: `linear-gradient(170deg, #2E5585, ${BLUE} 55%, #18304D)`, boxShadow: SH + ", inset 0 3px 0 rgba(255,255,255,0.3)", transform: `translateY(${(1 - u) * -500}px)` }}>
      <div style={{ position: "absolute", inset: 20, borderRadius: 20, border: `6px solid ${PAPER}` }} />
      {[[36, 36], [1440, 36], [36, 360], [1440, 360]].map(([x, yy], i) => <div key={i} style={{ position: "absolute", left: x, top: yy, width: 24, height: 24, borderRadius: 12, background: "radial-gradient(circle at 35% 35%, #fff, #9A9A9A 60%, #555)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: BEB, fontSize: 70, letterSpacing: 20, color: "#F3D9A8" }}>MEATS · SAUSAGE · SMOKED</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontFamily: BEB, fontSize: 230, lineHeight: 1, color: PAPER, textShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>{Math.round(52 * y)} YEARS</div>
    </div>
    <div style={{ position: "absolute", left: 260, top: 640, opacity: cl(s * 2), transform: `translateX(${(1 - s) * -80}px)` }}>
      <Lab txt="SOUTH SIDE" size={150} color={KIEL} sh={false} /><Lab txt="CHICAGO" size={110} color={INK} sh={false} />
    </div>
    {/* cajón de leche de madera con "AGE 14" */}
    <div style={{ position: "absolute", left: 1150, top: 620, width: 440, height: 330, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 120}px) rotate(-3deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: TX.block, borderRadius: 8, boxShadow: SH }} />
      {[60, 150, 240].map((yy) => <div key={yy} style={{ position: "absolute", left: 30, right: 30, top: yy, height: 40, background: "rgba(40,20,8,0.55)", borderRadius: 6 }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Mk txt="age 14" u={cl((f - at(t14) - 6) / 18)} size={96} color={PAPER} style={{ display: "inline-block", textShadow: "0 4px 10px rgba(0,0,0,0.6)" }} /></div>
    </div>
  </>);
};

// 6 · la pregunta número uno: globo de diálogo en pizarra con "WHY ARE MY PORK CHOPS ALWAYS DRY?" + contador #1
export const TopQuestion: P<{ tq: number; tw: number } & A0> = ({ a, d, tq, tw, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), q = cl((f - at(tq)) / 40), w = sp(f, at(tw), 12, 160);
  return shell(<Bg k="slate" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 230, top: 180, width: 1460, height: 520, borderRadius: 60, border: "8px solid rgba(245,245,240,0.85)", boxShadow: "0 0 18px rgba(255,255,255,0.15)", opacity: cl(u * 2), transform: `scale(${0.9 + 0.1 * u})` }}>
      <div style={{ position: "absolute", left: 200, bottom: -110, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderTop: "110px solid rgba(245,245,240,0.85)" }} />
      <div style={{ position: "absolute", left: 70, top: 80 }}><Mk txt="“Stan, why are my" u={q * 1.6} size={110} color="#F4F2EA" /></div>
      <div style={{ position: "absolute", left: 70, top: 250 }}><Mk txt="pork chops always DRY?”" u={q * 1.6 - 0.6} size={110} color="#F4F2EA" /></div>
    </div>
    <div style={{ position: "absolute", left: 1450, top: 70, width: 300, height: 300, borderRadius: 150, background: `radial-gradient(circle at 35% 30%, #E0464A, ${RED})`, boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(10deg) scale(${sp(f, at(tq) + 20, 10, 200)})` }}>
      <div style={{ fontFamily: BEB, fontSize: 60, color: PAPER, letterSpacing: 4 }}>QUESTION</div><div style={{ fontFamily: BEB, fontSize: 150, lineHeight: 0.9, color: PAPER }}>#1</div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 800, display: "flex", gap: 40, opacity: cl(w * 2) }}>
      {["WOMEN", "MEN", "FIRST APARTMENT"].map((t, i) => <div key={t} style={{ opacity: cl((f - at(tw) - i * 12) / 10), transform: `translateY(${(1 - cl((f - at(tw) - i * 12) / 10)) * 30}px)` }}><Lab txt={"· " + t} size={80} color="#E9E4D6" /></div>)}
    </div>
  </>);
};

// 7 · deshuesada vs costilla: dos chuletas en bandeja de telgopor (izq) y papel de carnicero (der), X roja y tilde
export const ChopCompare: P<{ tL: number; tX: number; tR: number; tB: number } & A0> = ({ a, d, tL, tX, tR, tB, a0 }) => {
  const { f, at } = useT(a);
  const l = sp(f, at(Math.min(tL, start(a, a0) + 0.2)), 13, 130), x = cl((f - at(tX)) / 12), r = sp(f, at(tR), 13, 130), b = cl((f - at(tB)) / 30);
  return shell(<Bg k="steel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 120, top: 200, width: 760, height: 620, borderRadius: 30, background: "linear-gradient(170deg, #FFFFFF, #E1E4E6)", boxShadow: SH + ", inset 0 0 0 16px rgba(220,224,228,0.9)", opacity: cl(l * 2), transform: `translateY(${(1 - l) * 200}px) rotate(-2deg)` }}>
      <div style={{ position: "absolute", left: 160, top: 130, width: 440, height: 360, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #F2C9C2, #E0A9A1 70%)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(120deg, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 60%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: BEB, fontSize: 70, color: INK }}>BONELESS LOIN</div>
      <div style={{ position: "absolute", left: 250, top: 160, opacity: x > 0 ? 1 : 0 }}><Tick u={x} no size={280} /></div>
    </div>
    <div style={{ position: "absolute", left: 1010, top: 170, width: 800, height: 680, background: TX.paper, boxShadow: SH, transform: `translateY(${(1 - r) * 260}px) rotate(2deg)`, opacity: cl(r * 2) }}>
      <Chop w={540} h={420} style={{ position: "absolute", left: 120, top: 80 }} />
      <svg width={800} height={680} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M 600 110 C 640 220 640 380 600 480" stroke={RED} strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
      </svg>
      <div style={{ position: "absolute", left: 610, top: 40, opacity: cl(b * 3) }}><Mk txt="bone!" u={b * 2} size={70} color={RED} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: BEB, fontSize: 80, color: OK }}>RIB CHOP · BONE IN</div>
      <div style={{ position: "absolute", left: 640, top: 520 }}><Tick u={cl((f - at(tR) - 10) / 14)} size={110} /></div>
    </div>
  </>);
};

// 8 · lo que se le dice al carnicero: ticket de pedido escrito a mano clavado en el gancho
export const AskButcher: P<{ tq: number; tk: number } & A0> = ({ a, d, tq, tk, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110), q = cl((f - at(tq)) / 45), k = sp(f, at(tk), 11, 200);
  return shell(<Bg k="kiel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 930, top: 40, width: 60, height: 160, borderRadius: "0 0 30px 30px", border: "10px solid #A6AEB4", borderTop: "none" }} />
    <div style={{ position: "absolute", left: 460, top: 160, width: 1000, height: 760, transformOrigin: "50% 0", transform: `rotate(${(1 - u) * 8 + Math.sin(f / 20) * 0.8}deg) translateY(${(1 - u) * -700}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent 0 78px, rgba(90,140,200,0.35) 78px 81px), linear-gradient(170deg, #FFFDF6, #EFE8D8)", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, background: "#E5DDCC", borderBottom: `5px solid ${RED}`, fontFamily: BEB, fontSize: 60, letterSpacing: 12, color: KIEL, textAlign: "center", lineHeight: "90px" }}>ORDER</div>
      <div style={{ position: "absolute", left: 60, top: 150 }}><Mk txt="rib chops," u={q * 3} size={100} color={BLUE} /></div>
      <div style={{ position: "absolute", left: 60, top: 310 }}><Mk txt="bone in," u={q * 3 - 1} size={100} color={BLUE} /></div>
      <div style={{ position: "absolute", left: 60, top: 470 }}><Mk txt="from the shoulder end" u={q * 3 - 2} size={88} color={BLUE} /></div>
    </div>
    <Stamp txt="HE'LL KNOW" s={k} x={1230} y={760} r={-10} size={100} color={OK} />
  </>);
};

// 9 · por qué el hueso: corte transversal (hueso frena el calor + grasa que se derrite), dos razones numeradas
export const TwoReasons: P<{ t1: number; t2: number } & A0> = ({ a, d, t1, t2, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), r1 = sp(f, at(t1), 12, 150), r2 = sp(f, at(t2), 12, 150), m = cl((f - at(t2)) / 60);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 240, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}>
      <Chop w={700} h={540} />
      {/* ondas de calor que se frenan junto al hueso */}
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 120 + ((f / 2) % 60), top: 120, width: 14, height: 300, borderRadius: 7, background: "linear-gradient(180deg, rgba(255,120,40,0), rgba(255,120,40,0.65), rgba(255,120,40,0))", opacity: r1 * (1 - i * 0.25) }} />)}
      <div style={{ position: "absolute", left: 470, top: 90, width: 150, height: 360, borderRadius: 60, background: "radial-gradient(ellipse, rgba(120,200,255,0.35), transparent 70%)", opacity: r1 }} />
      {[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 100, top: 20 + ((f * 2 + i * 40) % 80) * m, width: 22, height: 30, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 40% 35%, #FFF4C8, #E8B44A)", opacity: m }} />)}
    </div>
    <div style={{ position: "absolute", left: 1000, top: 250, width: 800 }}>
      <div style={{ opacity: cl(r1 * 2), transform: `translateX(${(1 - r1) * 60}px)`, display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: RED, fontFamily: BEB, fontSize: 96, color: PAPER, textAlign: "center", lineHeight: "124px", boxShadow: SH }}>1</div>
        <Lab txt="BONE SLOWS THE HEAT" size={86} />
      </div>
      <div style={{ marginTop: 90, opacity: cl(r2 * 2), transform: `translateX(${(1 - r2) * 60}px)`, display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: GOLD, fontFamily: BEB, fontSize: 96, color: PAPER, textAlign: "center", lineHeight: "124px", boxShadow: SH }}>2</div>
        <Lab txt="FAT MELTS = KEEPS IT WET" size={80} />
      </div>
    </div>
  </>);
};

// 10 · regla de grosor: la chuleta de canto crece ½" (X) → 1¼" → 1½" (tilde) contra una regla de acero
export const ThickGauge: P<{ tHalf: number; tQ: number; tH: number } & A0> = ({ a, d, tHalf, tQ, tH, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), q = ez((f - at(tQ)) / 18), h = ez((f - at(tH)) / 18), x = cl((f - at(tHalf) - 20) / 12);
  const inch = 220, th = inch * (0.5 + 0.75 * q + 0.25 * h);
  return shell(<Bg k="block" f={f} d={d} />, <>
    {/* regla de acero vertical */}
    <div style={{ position: "absolute", left: 520, top: 120, width: 120, height: 820, background: TX.steel, boxShadow: SH, borderRadius: 6, transform: `translateX(${(1 - u) * -300}px)` }}>
      {[...Array(31)].map((_, i) => <div key={i} style={{ position: "absolute", right: 0, bottom: 40 + i * inch / 8, width: i % 8 === 0 ? 70 : i % 4 === 0 ? 48 : 26, height: 4, background: INK }} />)}
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 10, bottom: 30 + i * inch, fontFamily: BEB, fontSize: 44, color: INK }}>{i}</div>)}
    </div>
    {/* la chuleta de canto (corte lateral: costra, carne, grasa) */}
    <div style={{ position: "absolute", left: 660, bottom: 140, width: 600, height: th, borderRadius: 26, background: `linear-gradient(90deg, ${FAT} 0 9%, ${MEAT} 9% 88%, #F8F2E4 88%)`, boxShadow: SH }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "repeating-linear-gradient(90deg, transparent 0 60px, rgba(255,245,235,0.25) 60px 64px)" }} />
    </div>
    <div style={{ position: "absolute", left: 1300, bottom: 140 + th - 110 }}>
      <Lab txt={h > 0.5 ? "1½ INCH" : q > 0.5 ? "1¼ INCH" : "½ INCH"} size={140} color={h > 0.5 || q > 0.5 ? OK : RED} />
    </div>
    <div style={{ position: "absolute", left: 1330, bottom: 140 + th + 60, opacity: q > 0.5 ? 0 : 1 }}><Tick u={x} no size={130} /></div>
    <div style={{ position: "absolute", left: 1330, bottom: 140 + th + 60, opacity: q > 0.5 ? 1 : 0 }}><Tick u={cl((f - at(tQ) - 16) / 14)} size={130} /></div>
    <div style={{ position: "absolute", left: 120, top: 160, transform: "rotate(-6deg)", opacity: cl(x * 2) * (1 - q) }}><Mk txt="too thin!" u={x * 1.5} size={80} color={RED} /></div>
  </>);
};

// 11 · una gruesa > dos finas: dos chuletas finas tachadas vs una gruesa que se parte en dos platos
export const OneVsTwo: P<{ t1: number; t2: number; t40: number } & A0> = ({ a, d, t1, t2, t40, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), s = ez((f - at(t2)) / 22), y = sp(f, at(t40), 12, 160), x = cl((f - at(t1) - 12) / 14);
  return shell(<Bg k="cloth" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 120, top: 260, opacity: cl(u * 2) }}>
      <Chop w={360} h={270} bone={false} style={{ transform: "scaleY(0.9) rotate(-8deg)" }} />
      <Chop w={360} h={270} bone={false} style={{ position: "absolute", left: 80, top: 230, transform: "rotate(6deg)" }} />
      <div style={{ position: "absolute", left: 60, top: 120 }}><Tick u={x} no size={300} /></div>
    </div>
    <div style={{ position: "absolute", left: 640, top: 380, fontFamily: BEB, fontSize: 200, color: INK, opacity: cl(u * 2), textShadow: "0 6px 0 rgba(255,255,255,0.7)" }}>VS</div>
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 960 + i * 440, top: 300 + i * 10, width: 420, height: 420, borderRadius: 210, background: "radial-gradient(circle at 45% 40%, #FFFFFF, #ECECE8 55%, #CFCFC9 70%, #F7F7F4 72%, #DADAD4)", boxShadow: SH, opacity: cl(s * 3) }} />)}
    <div style={{ position: "absolute", left: 1100, top: 380 }}>
      <Chop w={420} h={300} cook={1} style={{ position: "absolute", left: 0, top: 0, clipPath: "inset(0 50% 0 0)", transform: `translateX(${-60 * s}px)` }} />
      <Chop w={420} h={300} cook={1} style={{ position: "absolute", left: 0, top: 0, clipPath: "inset(0 0 0 50%)", transform: `translateX(${200 * s}px)` }} />
    </div>
    <div style={{ position: "absolute", left: 1040, top: 790, opacity: cl(s * 2) }}><Lab txt="1 THICK CHOP = 2 PLATES" size={86} color={KIEL} sh={false} /></div>
    <div style={{ position: "absolute", left: 1180, top: 140, transform: "rotate(-5deg)", opacity: cl(y * 2) }}><Mk txt="40 years like that" u={y} size={70} color={BLUE} /></div>
  </>);
};

// 12 · la etiqueta del súper con lupa: "CONTAINS UP TO 12% OF A SOLUTION" se agranda y se subraya; "ENHANCED"
export const LabelZoom: P<{ tPct: number; tW: number; tE: number } & A0> = ({ a, d, tPct, tW, tE, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), p = ez((f - at(tPct)) / 20), w = sp(f, at(tW), 12, 160), e = sp(f, at(tE), 10, 210);
  const mx = 600 + 380 * p, my = 560;
  return shell(<Bg k="steel" f={f} d={d} />, <>
    {/* bandeja con film y la etiqueta */}
    <div style={{ position: "absolute", left: 200, top: 160, width: 1520, height: 760, borderRadius: 40, background: "linear-gradient(170deg, #FFFFFF, #DDE1E4)", boxShadow: SH, transform: `perspective(1800px) rotateX(${14 - 8 * u}deg)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 120, top: 100, width: 640, height: 520, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #F2C1B8, #DD9B91 70%)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.45) 32%, rgba(255,255,255,0) 44%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0) 80%)" }} />
      <div style={{ position: "absolute", left: 820, top: 160, width: 620, height: 440, background: "#FFFFFF", border: "4px solid #DADADA", boxShadow: "0 6px 14px rgba(0,0,0,0.18)", padding: 28 }}>
        <div style={{ fontFamily: BEB, fontSize: 64, color: INK }}>PORK LOIN CHOPS</div>
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 14, width: 480 - i * 90, background: "#D5D5D5", borderRadius: 7, marginTop: 18 }} />)}
        <div style={{ marginTop: 30, fontFamily: BEB, fontSize: 40, color: "#444", lineHeight: 1.05 }}>CONTAINS UP TO 12% OF A SOLUTION<br />OF WATER, SALT, SODIUM PHOSPHATE</div>
        <div style={{ position: "absolute", left: 28, top: 300, height: 8, width: 560 * cl((f - at(tPct) - 12) / 16), background: RED, borderRadius: 4 }} />
      </div>
    </div>
    {/* lupa (aro de acero + vidrio con brillo) */}
    <div style={{ position: "absolute", left: mx, top: my - 40, width: 420, height: 420, borderRadius: 210, border: "22px solid #3A3F44", boxShadow: SH + ", inset 0 0 0 6px rgba(255,255,255,0.4)", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0.08) 55%, rgba(200,230,255,0.12))", opacity: cl(p * 3),
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: BEB, fontSize: 190, color: RED, lineHeight: 0.9, textAlign: "center", transform: `scale(${0.6 + 0.4 * p})` }}>12%<div style={{ fontSize: 60, color: INK }}>SOLUTION</div></div>
      <div style={{ position: "absolute", left: 330, top: 330, width: 60, height: 250, borderRadius: 30, background: "linear-gradient(90deg, #2A1A12, #5A3A26, #2A1A12)", transform: "rotate(-45deg)", transformOrigin: "50% 0" }} />
    </div>
    <div style={{ position: "absolute", left: 120, top: 60, display: "flex", gap: 30, opacity: cl(w * 2) }}>
      {["WATER", "SALT", "+ OTHER THINGS"].map((t, i) => <div key={t} style={{ opacity: cl((f - at(tW) - i * 10) / 10) }}><Lab txt={t} size={84} color={BLUE} sh={false} /></div>)}
    </div>
    <Stamp txt="“ENHANCED”" s={e} x={1130} y={830} r={-6} size={110} color={KIEL} />
  </>);
};

// 13 · etiqueta kraft con tildes (verde) y una X (rojo): cabecera + 2-3 ítems
export const CheckTag: P<{ head: string; items: { t: number; txt: string }[]; no?: { t: number; txt: string } } & A0> = ({ a, d, head, items, no, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 12, 110), sw = Math.sin(f / 18) * 2 * (1 - cl((f - at(start(a, a0))) / 60));
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M 960 0 L ${960 + sw * 5} 150`} stroke="#E9E4D6" strokeWidth={5} /></svg>
    <div style={{ position: "absolute", left: 410, top: 140, width: 1100, height: 800, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - u) * -700}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), radial-gradient(ellipse 35% 25% at 80% 70%, rgba(255,230,190,0.18), transparent 70%), linear-gradient(170deg, #D2AE7E, #B98F5E)", clipPath: "polygon(8% 0,92% 0,100% 8%,100% 100%,0 100%,0 8%)", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 520, top: 30, width: 60, height: 60, borderRadius: 30, background: "#7A5A38", boxShadow: "inset 0 4px 8px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: BEB, fontSize: head.length > 24 ? 74 : 92, color: INK, letterSpacing: 3 }}>{head}</div>
      <div style={{ position: "absolute", left: 120, right: 80, top: 250 }}>
        {items.map((it, i) => { const s = cl((f - at(it.t)) / 12); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, height: 150, opacity: cl(s * 3) }}>
          <div style={{ width: 100, height: 100, border: `6px solid ${INK}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick u={s} size={90} /></div>
          <Lab txt={it.txt} size={100} color={INK} sh={false} u={ez(s * 1.4)} /></div>; })}
        {no ? (() => { const s = cl((f - at(no.t)) / 12); return <div style={{ display: "flex", alignItems: "center", gap: 30, height: 150, opacity: cl(s * 3) }}>
          <div style={{ width: 100, height: 100, border: `6px solid ${INK}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick u={s} no size={90} /></div>
          <Lab txt={no.txt} size={90} color={RED} sh={false} /></div>; })() : null}
      </div>
    </div>
  </>);
};

// tarjeta de receta del fichero (papel rayado viejo con esquina doblada) — base de SaltCard y BasteCard
const Recipe: React.FC<{ f: number; at: (t: number) => number; u: number; title: string; lines: { t: number; txt: string }[]; color: string }> = ({ f, at, u, title, lines, color }) => (
  <div style={{ position: "absolute", left: 300, top: 120, width: 1320, height: 840, transform: `rotate(${-2 + (1 - u) * -8}deg) translateY(${(1 - u) * 600}px)` }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent 0 96px, rgba(90,140,200,0.35) 96px 99px), linear-gradient(170deg, #FBF6E8, #EADFC6)", clipPath: "polygon(0 0,94% 0,100% 8%,100% 100%,0 100%)", boxShadow: SH }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 4, background: "rgba(200,60,60,0.55)" }} />
    <div style={{ position: "absolute", left: 90, top: 40, fontFamily: MRK, fontSize: 86, color }}>{title}</div>
    {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 100, top: 190 + i * 150 }}><Mk txt={l.txt} u={cl((f - at(l.t)) / 26)} size={l.txt.length > 26 ? 70 : 82} color={INK} /></div>)}
  </div>
);
// 14 · la sal: tarjeta de receta del abuelo de Cracovia
export const SaltCard: P<{ lines: { t: number; txt: string }[] } & A0> = ({ a, d, lines, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <Recipe f={f} at={at} u={u} title="Dad's salt (from Krakow)" lines={lines} color={KIEL} />
    {/* montañita de sal kosher en CSS */}
    <div style={{ position: "absolute", left: 1500, top: 760, width: 260, height: 140, borderRadius: "50% 50% 12% 12%", background: "repeating-radial-gradient(circle at 30% 40%, #FFFFFF 0 3px, #E6E6E2 3px 6px)", boxShadow: SH, opacity: cl(u * 2) }} />
  </>);
};

// 15 · qué hace la sal: corte de la carne con gotitas que SALEN (brillan) y vuelven a ENTRAR; candado "HOLDS THE JUICE"
export const SaltCycle: P<{ tOut: number; tIn: number; tHold: number } & A0> = ({ a, d, tOut, tIn, tHold, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), o = ez((f - at(tOut)) / 30), i = ez((f - at(tIn)) / 40), h = sp(f, at(tHold), 11, 190);
  const pos = (k: number) => { const out = o * (1 - i); return { x: 200 + k * 130, y: 520 - 220 * out + 220 * i * (k % 3) * 0.4 }; };
  return shell(<Bg k="slate" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 470, width: 1600, height: 440, borderRadius: 40, background: `linear-gradient(180deg, ${MEAT} 0 12%, ${MEAT2} 100%)`, boxShadow: SH, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "repeating-linear-gradient(8deg, transparent 0 50px, rgba(255,240,230,0.25) 50px 54px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 30, borderRadius: "40px 40px 0 0", background: `rgba(255,255,255,${0.5 * o * (1 - i)})` }} />
    </div>
    {[...Array(11)].map((_, k) => { const p = pos(k); return <div key={k} style={{ position: "absolute", left: p.x, top: p.y, width: 46, height: 60, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 35% 30%, #FFFFFF, #9ED0F0 50%, #4A90C0)", boxShadow: "0 6px 12px rgba(0,0,0,0.3)", opacity: cl(o * 3) }} />; })}
    <div style={{ position: "absolute", left: 160, top: 120, display: "flex", gap: 60 }}>
      <div style={{ opacity: cl(o * 2) }}><Lab txt="1 · WATER COMES OUT" size={92} color={i > 0.5 ? "#8C9A9A" : "#9ED0F0"} /></div>
      <div style={{ opacity: cl(i * 2) }}><Lab txt="2 · GOES BACK IN" size={92} color="#9ED0F0" /></div>
    </div>
    <div style={{ position: "absolute", left: 640, top: 270, opacity: cl(h * 2), transform: `scale(${0.7 + 0.3 * h})` }}>
      <div style={{ padding: "16px 50px", borderRadius: 16, background: OK, boxShadow: SH, fontFamily: BEB, fontSize: 100, color: PAPER, letterSpacing: 4 }}>SALT HOLDS THE JUICE</div>
    </div>
  </>);
};

// 16 · cuándo salar: línea de tiempo en acero con 4 paradas: RIGHT BEFORE ✓ · 10 MIN ✗ · 45 MIN+ ✓ · NIGHT BEFORE ✓✓
export const SaltClock: P<{ t45: number; t10: number; tOk: number } & A0> = ({ a, d, t45, t10, tOk, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), s45 = cl((f - at(t45)) / 14), s10 = cl((f - at(t10)) / 14), ok = cl((f - at(tOk)) / 14);
  const stops = [{ x: 220, l: "RIGHT BEFORE", s: ok, no: false }, { x: 640, l: "10 MIN", s: s10, no: true }, { x: 1060, l: "45 MIN +", s: s45, no: false }, { x: 1480, l: "NIGHT BEFORE", s: Math.max(ok, s45 * 0.0 + cl((f - at(start(a, a0))) / 14)), no: false }];
  return shell(<Bg k="steel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 500, width: 1600 * ez(u), height: 22, borderRadius: 11, background: INK, boxShadow: "0 6px 12px rgba(0,0,0,0.3)" }} />
    <div style={{ position: "absolute", left: 160, top: 120 }}><Lab txt="WHEN TO SALT" size={130} color={INK} sh={false} /></div>
    {stops.map((p, i) => <div key={i} style={{ position: "absolute", left: p.x, top: 440, width: 300, textAlign: "center", opacity: cl(u * 2) }}>
      <div style={{ margin: "0 auto", width: 140, height: 140, borderRadius: 70, background: p.s > 0 ? (p.no ? RED : OK) : "#6B7378", boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.15 * sp(f, at(0) + 0, 12, 160) * 0})` }}>
        <Tick u={p.s} no={p.no} size={90} color={PAPER} />
      </div>
      <div style={{ marginTop: 40 }}><Lab txt={p.l} size={74} color={p.no && p.s > 0 ? RED : INK} sh={false} /></div>
      {p.no ? <div style={{ marginTop: 10, opacity: cl(p.s * 2) }}><Mk txt="gray juice" u={p.s} size={52} color={RED} /></div> : null}
    </div>)}
  </>);
};

// 17 · cortar la grasa: chuleta grande, el cuchillo hace 4 cortes en el canto cada pulgada; después se aplana
export const FatCuts: P<{ tCut: number; tInch: number; tFlat: number } & A0> = ({ a, d, tCut, tInch, tFlat, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), c = cl((f - at(tCut)) / 50), n = Math.floor(c * 4.99), fl = ez((f - at(tFlat)) / 20), inch = cl((f - at(tInch)) / 14);
  const kx = 420 + c * 4 * 240;
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 300, top: 260, perspective: 1600, opacity: cl(u * 2) }}>
      <div style={{ transform: `rotateX(${(1 - fl) * 26}deg)`, transformOrigin: "50% 100%" }}>
        <Chop w={1300} h={560} cuts={n} />
      </div>
    </div>
    {/* cuchillo: hoja de acero + mango de madera */}
    <div style={{ position: "absolute", left: kx, top: 120 + 40 * Math.abs(Math.sin(c * 4 * Math.PI)), opacity: c > 0 && c < 1 ? 1 : 0, transform: "rotate(8deg)" }}>
      <div style={{ width: 70, height: 260, background: "linear-gradient(90deg, #F2F4F5, #A9B0B5)", clipPath: "polygon(0 0,100% 0,100% 100%,40% 100%)", boxShadow: SH }} />
      <div style={{ width: 70, height: 180, marginTop: -440, borderRadius: 14, background: "linear-gradient(90deg, #5A3820, #8A5A34, #4A2E1A)" }} />
    </div>
    <div style={{ position: "absolute", left: 500, top: 210, width: 240, opacity: inch }}>
      <div style={{ height: 6, background: INK }} /><div style={{ textAlign: "center", marginTop: -70 }}><Lab txt="1 INCH" size={60} color={INK} sh={false} /></div>
    </div>
    <div style={{ position: "absolute", left: 1380, top: 860, opacity: cl(fl * 2) }}><Lab txt="STAYS FLAT" size={110} color={PAPER} /></div>
    <div style={{ position: "absolute", left: 160, top: 860 }}><Mk txt="through the fat, not into the meat" u={cl((f - at(tCut) - 30) / 30)} size={56} color={PAPER} style={{ textShadow: "0 3px 8px rgba(0,0,0,0.6)" }} /></div>
  </>);
};

// 18 · 20 minutos: reloj de cocina de cuerda (20 vs 2 h tachado) + papel de cocina + "WATER = ENEMY"
export const TwentyMin: P<{ t20: number; t2h: number; tW: number } & A0> = ({ a, d, t20, t2h, tW, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), m = ez((f - at(t20)) / 26), x = cl((f - at(t2h)) / 14), w = sp(f, at(tW), 11, 190);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 220, top: 200, width: 600, height: 600, borderRadius: 300, background: "radial-gradient(circle at 35% 30%, #FFFFFF, #E5E2DA 60%, #BDB8AC)", boxShadow: SH, transform: `scale(${0.8 + 0.2 * u})`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 50, borderRadius: 250, background: `conic-gradient(${RED} ${120 * m}deg, #F7F4EC 0)`, boxShadow: "inset 0 6px 14px rgba(0,0,0,0.15)" }} />
      {[...Array(12)].map((_, i) => <div key={i} style={{ position: "absolute", left: 296, top: 60, width: 8, height: 40, background: INK, transformOrigin: "4px 240px", transform: `rotate(${i * 30}deg)` }} />)}
      <div style={{ position: "absolute", inset: 190, borderRadius: 110, background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BEB, fontSize: 150, color: INK }}>{Math.round(20 * m)}</div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 840 }}><Lab txt="MINUTES OUT OF THE FRIDGE" size={70} color={INK} sh={false} /></div>
    <div style={{ position: "absolute", left: 980, top: 230, opacity: cl(x * 3) }}>
      <Lab txt="NOT 2 HOURS" size={130} color={INK} sh={false} />
      <div style={{ position: "absolute", left: -10, top: 60, height: 16, width: 620 * x, background: RED, borderRadius: 8, transform: "rotate(-4deg)" }} />
    </div>
    <div style={{ position: "absolute", left: 980, top: 500, opacity: cl(w * 2), transform: `translateY(${(1 - w) * 60}px)` }}>
      <div style={{ width: 720, height: 300, borderRadius: 20, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 24px), linear-gradient(170deg, #FFFFFF, #E7E7E2)", boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: BEB, fontSize: 70, color: "#4A90C0" }}>WATER = THE ENEMY</div>
        <div style={{ fontFamily: BEB, fontSize: 110, color: INK }}>PAT IT DRY</div>
      </div>
    </div>
  </>);
};

// 19 · la sartén de hierro vista de arriba: 1 canto de grasa 2 min → 2 plana 3 min → 3 vuelta 3 min; "DON'T PRESS"
export const PanSteps: P<{ t1: number; t2: number; t3: number; tNo: number } & A0> = ({ a, d, t1, t2, t3, tNo, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), s1 = cl((f - at(t1)) / 12), s2 = cl((f - at(t2)) / 12), s3 = cl((f - at(t3)) / 12), no = sp(f, at(tNo), 10, 210);
  const cook = s3 > 0 ? 1 : 0;
  const steps = [{ s: s1, n: "1", l: "FAT EDGE DOWN", m: "2 MIN" }, { s: s2, n: "2", l: "LAY IT FLAT", m: "3 MIN" }, { s: s3, n: "3", l: "FLIP", m: "3 MIN" }];
  return shell(<Bg k="night" f={f} d={d} />, <>
    {/* sartén: hierro negro con brillo + mango */}
    <div style={{ position: "absolute", left: 120, top: 150, width: 780, height: 780, borderRadius: 390, background: "radial-gradient(circle at 40% 35%, #3B3B3B, #151515 60%, #050505)", boxShadow: SH + ", inset 0 0 0 30px #1C1C1C, inset 0 0 0 34px #333", opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 390, background: "radial-gradient(ellipse 30% 18% at 35% 30%, rgba(255,255,255,0.12), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 770, top: 340, width: 360, height: 100, borderRadius: 30, background: "linear-gradient(180deg, #2A2A2A, #0C0C0C)" }} />
      <div style={{ position: "absolute", left: 190, top: 220 }}>
        {s2 > 0 ? <Chop w={400} h={320} cook={cook} /> :
          <div style={{ width: 380, height: 70, marginTop: 120, borderRadius: 30, background: s1 > 0 ? "linear-gradient(180deg, #F6D58A, #C9862E)" : FAT, boxShadow: "0 0 30px rgba(255,190,90,0.5)", transform: "rotate(-8deg)" }} />}
      </div>
      {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", left: 200 + (i * 37) % 380, top: 200 + (i * 53) % 380, width: 10, height: 10, borderRadius: 5, background: "#FFE7A8", opacity: s1 * (0.3 + 0.7 * Math.abs(Math.sin(f / 4 + i))) }} />)}
    </div>
    <div style={{ position: "absolute", left: 1000, top: 170 }}>
      {steps.map((p, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, height: 190, opacity: 0.25 + 0.75 * cl(p.s * 2), transform: `translateX(${(1 - eo(p.s)) * 60}px)` }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: GOLD, fontFamily: BEB, fontSize: 96, color: INK, textAlign: "center", lineHeight: "126px", boxShadow: SH }}>{p.n}</div>
        <div><Lab txt={p.l} size={88} /><div style={{ fontFamily: BEB, fontSize: 60, color: GOLD, letterSpacing: 4 }}>{p.m}</div></div>
      </div>)}
    </div>
    <Stamp txt="DON'T PRESS" s={no} x={1080} y={790} r={-6} size={110} />
  </>);
};

// 20 · manteca, ajo, tomillo: tarjeta de receta + cuchara de baño que va y viene
export const BasteCard: P<{ lines: { t: number; txt: string }[] } & A0> = ({ a, d, lines, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110), sw = Math.sin(f / 7);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <Recipe f={f} at={at} u={u} title="The butter at the end" lines={lines} color={GOLD} />
    <div style={{ position: "absolute", left: 1380, top: 640, width: 360, height: 120, transform: `rotate(${-30 + 14 * sw}deg)`, transformOrigin: "100% 50%", opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 0, top: 10, width: 130, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF, #AEB5BA 60%, #6D757A)", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 110, top: 48, width: 250, height: 22, borderRadius: 11, background: "linear-gradient(180deg, #E6EAEC, #7D858B)" }} />
      <div style={{ position: "absolute", left: 20, top: 26, width: 90, height: 60, borderRadius: "50%", background: "radial-gradient(circle, #FFE59A, #E0A93A)", opacity: 0.9 }} />
    </div>
  </>);
};

// 21 · terminar en el horno: puerta de horno con ventana, dial a 375°F y "RESTAURANTS DO IT EVERY NIGHT"
export const OvenFinish: P<{ t375: number; tN: number } & A0> = ({ a, d, t375, tN, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), k = ez((f - at(t375) + 4) / 18), n = sp(f, at(tN), 11, 190);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 200, top: 160, width: 820, height: 760, borderRadius: 26, background: "linear-gradient(180deg, #FAF8F2, #D8D4C9)", boxShadow: SH, transform: `translateY(${(1 - u) * 300}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, borderRadius: "26px 26px 0 0", background: "linear-gradient(180deg, #E9E5DB, #CFCABE)", borderBottom: "6px solid #B9B3A5" }}>
        <div style={{ position: "absolute", left: 340, top: 18, width: 116, height: 116, borderRadius: 58, background: "radial-gradient(circle at 35% 30%, #FFFFFF, #C9C9C9 55%, #8A8A8A)", boxShadow: "0 8px 14px rgba(0,0,0,0.45)", transform: `rotate(${-130 + 200 * k}deg)` }}>
          <div style={{ position: "absolute", left: 51, top: 8, width: 14, height: 48, borderRadius: 7, background: INK }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 200, height: 26, borderRadius: 13, background: "linear-gradient(180deg, #F3F3F3, #9C9C9C)" }} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 280, height: 380, borderRadius: 18, background: `radial-gradient(ellipse 60% 55% at 50% 70%, rgba(255,140,40,${0.2 + 0.6 * k}), rgba(30,15,8,0.95) 75%), #1A120D`, boxShadow: "inset 0 0 0 10px #2C2620" }}>
        <div style={{ position: "absolute", left: 120, top: 170, width: 360, height: 130, borderRadius: 65, background: "radial-gradient(circle at 40% 35%, #3B3B3B, #0C0C0C)" }}>
          <div style={{ position: "absolute", left: 70, top: 20, width: 220, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #C9853F, #6E3714)" }} />
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1100, top: 260 }}><Lab txt={`${Math.round(200 + 175 * k)}°F`} size={260} color={k > 0.95 ? "#D9581E" : INK} sh={false} /></div>
    <div style={{ position: "absolute", left: 1100, top: 560, opacity: cl(u * 2) }}><Lab txt="A FEW MINUTES TO FINISH" size={70} color={INK} sh={false} /></div>
    <div style={{ position: "absolute", left: 1100, top: 700, transform: "rotate(-4deg)", opacity: cl(n * 2) }}><Mk txt="restaurants do it every night" u={n} size={58} color={RED} /></div>
  </>);
};

// termómetro de dial grande (aguja) — base de TempDial y PullRest
const Dial: React.FC<{ x: number; y: number; size: number; temp: number; marks: number[]; zone?: [number, number] }> = ({ x, y, size, temp, marks, zone }) => {
  const ang = (t: number) => -120 + (t - 120) * (240 / 60);   // 120°F … 180°F
  return <div style={{ position: "absolute", left: x, top: y, width: size, height: size }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: size / 2, background: "radial-gradient(circle at 35% 30%, #FFFFFF, #E8E6E0 55%, #9FA5A9 75%, #E6EAEC 77%, #6E767B)", boxShadow: SH }} />
    {zone ? <div style={{ position: "absolute", inset: size * 0.1, borderRadius: size / 2, background: `conic-gradient(from ${ang(zone[0])}deg, rgba(46,125,76,0.55) 0 ${ang(zone[1]) - ang(zone[0])}deg, transparent 0)`, WebkitMaskImage: "radial-gradient(circle, transparent 62%, #000 63%)", maskImage: "radial-gradient(circle, transparent 62%, #000 63%)" }} /> : null}
    {marks.map((m) => <div key={m} style={{ position: "absolute", left: size / 2 - 60, top: size / 2 - 30, width: 120, height: 60, textAlign: "center", fontFamily: BEB, fontSize: size * 0.085, color: INK,
      transform: `rotate(${ang(m)}deg) translateY(${-size * 0.32}px) rotate(${-ang(m)}deg)` }}>{m}</div>)}
    {[...Array(25)].map((_, i) => <div key={i} style={{ position: "absolute", left: size / 2 - 2, top: size * 0.08, width: 4, height: i % 4 === 0 ? 30 : 16, background: INK, transformOrigin: `2px ${size * 0.42}px`, transform: `rotate(${-120 + i * 10}deg)` }} />)}
    <div style={{ position: "absolute", left: size / 2 - 7, top: size * 0.14, width: 14, height: size * 0.38, borderRadius: 7, background: RED, transformOrigin: `7px ${size * 0.36}px`, transform: `rotate(${ang(temp)}deg)`, boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }} />
    <div style={{ position: "absolute", left: size / 2 - 26, top: size / 2 - 26, width: 52, height: 52, borderRadius: 26, background: "radial-gradient(circle at 35% 30%, #fff, #777)" }} />
  </div>;
};
// 22 · 145°F: la aguja va a 170, 160 (tachadas) y se clava en 145; chuleta cortada rosada
export const TempDial: P<{ t145: number; t160: number; t170: number; tPink: number } & A0> = ({ a, d, t145, t160, t170, tPink, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120);
  const ph = (t: number) => cl((f - at(t)) / 16);
  let temp = 130 + 15 * ph(t145);
  if (f >= at(t160)) temp = 145 + 15 * ph(t160);
  if (f >= at(t170)) temp = 160 + 10 * ph(t170);
  const back = cl((f - at(t170) - 30) / 20); if (back > 0) temp = 170 - 25 * ez(back);
  const p = sp(f, at(tPink), 12, 160);
  return shell(<Bg k="slate" f={f} d={d} />, <>
    <div style={{ opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}><Dial x={160} y={140} size={800} temp={temp} marks={[120, 130, 140, 150, 160, 170, 180]} zone={[143, 148]} /></div>
    <div style={{ position: "absolute", left: 1060, top: 130 }}>
      <Lab txt="145°F" size={260} color="#7FD39B" u={ph(t145)} />
      <div style={{ position: "relative", marginTop: 20, opacity: cl(ph(t160) * 3) }}><Lab txt="NOT 160" size={120} color="#E8E3D6" /><div style={{ position: "absolute", left: -8, top: 52, height: 12, width: 380 * ph(t160 + 0.4), background: RED, transform: "rotate(-5deg)" }} /></div>
      <div style={{ position: "relative", marginTop: 10, opacity: cl(ph(t170) * 3) }}><Lab txt="NOT 170" size={120} color="#E8E3D6" /><div style={{ position: "absolute", left: -8, top: 52, height: 12, width: 380 * ph(t170 + 0.4), background: RED, transform: "rotate(-5deg)" }} /></div>
    </div>
    <div style={{ position: "absolute", left: 1350, top: 700, opacity: cl(p * 2), transform: `scale(${0.7 + 0.3 * p}) rotate(-4deg)` }}>
      <div style={{ width: 440, height: 220, borderRadius: 30, background: "linear-gradient(180deg, #8A4A22 0 10%, #E9A8A0 10% 90%, #8A4A22 90%)", boxShadow: SH }} />
      <div style={{ marginTop: 10, textAlign: "center" }}><Mk txt="light pink = right" u={p} size={54} color="#F4C2BA" /></div>
    </div>
  </>);
};

// 23 · la regla que cambió: dos fichas oficiales — OLD RULE 160°F (sello VOID) → NEW RULE 145°F + 3 MIN REST
export const RuleChange: P<{ tOld: number; tNew: number; tRest: number } & A0> = ({ a, d, tOld, tNew, tRest, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), o = sp(f, at(tOld), 12, 150), n = sp(f, at(tNew), 12, 150), r = sp(f, at(tRest), 11, 190);
  const card = (x: number, rot: number, s: number, head: string, big: string, col: string) => <div style={{ position: "absolute", left: x, top: 200, width: 700, height: 640, background: TX.paper, boxShadow: SH, transform: `rotate(${rot}deg) translateY(${(1 - s) * 500}px)`, opacity: cl(s * 2), padding: 40 }}>
    <div style={{ fontFamily: BEB, fontSize: 52, letterSpacing: 10, color: "#6D665C", textAlign: "center" }}>SAFE COOKING TEMPERATURE</div>
    <div style={{ borderTop: `6px double ${INK}`, margin: "16px 0 30px" }} />
    <div style={{ fontFamily: BEB, fontSize: 80, color: INK, textAlign: "center" }}>{head}</div>
    <div style={{ fontFamily: BEB, fontSize: 260, lineHeight: 1, color: col, textAlign: "center" }}>{big}</div>
  </div>;
  return shell(<Bg k="block" f={f} d={d} />, <>
    {card(180, -5, Math.max(o, cl(u * 1.2)), "PORK · OLD RULE", "160°F", "#6D665C")}
    <Stamp txt="OUTDATED" s={n} x={300} y={770} r={-10} size={100} />
    {card(1020, 4, n, "PORK · TODAY", "145°F", OK)}
    <div style={{ position: "absolute", left: 1130, top: 860, opacity: cl(r * 2), transform: `scale(${0.7 + 0.3 * r})` }}>
      <div style={{ padding: "10px 40px", borderRadius: 14, background: OK, fontFamily: BEB, fontSize: 90, color: PAPER, boxShadow: SH }}>+ 3 MIN REST</div>
    </div>
  </>);
};

// 24 · sacar a 140 y reposar: dial a 140, plato tibio con reloj de 5 min, la aguja sube sola a 145
export const PullRest: P<{ t140: number; tRest: number; t145: number } & A0> = ({ a, d, t140, tRest, t145, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), p = ez((f - at(t140)) / 18), r = cl((f - at(tRest)) / 14), up = ez((f - at(t145)) / 50);
  const temp = 125 + 15 * p + 5 * up;
  return shell(<Bg k="slate" f={f} d={d} />, <>
    <div style={{ opacity: cl(u * 2) }}><Dial x={140} y={180} size={700} temp={temp} marks={[120, 130, 140, 150, 160, 170, 180]} zone={[143, 148]} /></div>
    <div style={{ position: "absolute", left: 960, top: 150 }}>
      <Lab txt={`PULL AT 140°F`} size={130} color={PAPER} u={p} />
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 30, opacity: cl(r * 2) }}>
        <div style={{ width: 220, height: 220, borderRadius: 110, background: `conic-gradient(${GOLD} ${360 * cl((f - at(tRest)) / 120)}deg, #3A3F44 0)`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 160, height: 160, borderRadius: 80, background: "#1F2326", fontFamily: BEB, fontSize: 90, color: PAPER, textAlign: "center", lineHeight: "166px" }}>5</div>
        </div>
        <Lab txt="MIN REST · WARM PLATE" size={84} color={GOLD} />
      </div>
      <div style={{ marginTop: 60, opacity: cl(up * 3) }}><Lab txt="→ CLIMBS TO 145°F" size={110} color="#7FD39B" /></div>
    </div>
  </>);
};

// 25 · pizarra de problemas: SÍNTOMA → ARREGLO (se escriben con tiza en filas)
export const TroubleBoard: P<{ rows: { t: number; a: string; b: string }[]; done?: [string, string][] } & A0> = ({ a, d, rows, done = [], a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120);
  const all = [...done.map(([x, y]) => ({ a: x, b: y, s: 1 })), ...rows.map((r) => ({ a: r.a, b: r.b, s: cl((f - at(r.t)) / 14) }))];
  return shell(<Bg k="kiel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 140, top: 90, width: 1640, height: 900, borderRadius: 16, background: TX.slate, boxShadow: SH + ", inset 0 0 0 22px #6E4A2C, inset 0 0 0 26px #3E2716", transform: `translateY(${(1 - u) * 400}px)` }}>
      <div style={{ position: "absolute", left: 90, top: 60, fontFamily: MRK, fontSize: 78, color: "#F2EFE6" }}>still dry? check this:</div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 170, height: 4, background: "rgba(240,240,235,0.5)" }} />
      {all.map((r, i) => <div key={i} style={{ position: "absolute", left: 90, top: 210 + i * 165, display: "flex", alignItems: "center", gap: 40, opacity: cl(r.s * 3) }}>
        <div style={{ width: 470 }}><Lab txt={r.a} size={92} color="#F4B3A4" u={ez(r.s * 2)} /></div>
        <div style={{ fontFamily: BEB, fontSize: 80, color: "#F2EFE6", opacity: cl(r.s * 2 - 0.4) }}>→</div>
        <Mk txt={r.b} u={r.s * 1.3 - 0.3} size={66} color="#F2EFE6" />
      </div>)}
    </div>
  </>);
};

// 26 · cortar contra la fibra: bloque de carne con líneas; el cuchillo corta ACROSS (corto = tierno ✓) vs ALONG (gomitas ✗)
export const GrainSlice: P<{ tA: number; tS: number; tL: number } & A0> = ({ a, d, tA, tS, tL, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), s = ez((f - at(tA)) / 30), t = sp(f, at(tS), 12, 160), l = sp(f, at(tL), 12, 160);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 220, width: 900, height: 560, opacity: cl(u * 2) }}>
      {[...Array(6)].map((_, i) => <div key={i} style={{ position: "absolute", left: i * 150 + 30 * s * i, top: 0, width: 140, height: 560, borderRadius: 18, background: `repeating-linear-gradient(90deg, ${MEAT2} 0 10px, ${MEAT} 10px 24px), #E7A39A`, boxShadow: SH,
        clipPath: i === 0 ? "inset(0 0 0 0 round 30px 0 0 30px)" : undefined }} />)}
      <div style={{ position: "absolute", left: 0, top: -60, width: 900 * s, height: 6, background: OK }} />
    </div>
    <div style={{ position: "absolute", left: 1150, top: 220, opacity: cl(t * 2) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}><Tick u={t} size={100} /><Lab txt="ACROSS = SHORT = TENDER" size={64} color={PAPER} /></div>
    </div>
    <div style={{ position: "absolute", left: 1150, top: 520, opacity: cl(l * 2) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}><Tick u={l} no size={100} /><Lab txt="ALONG = RUBBER BANDS" size={64} color={PAPER} /></div>
      <div style={{ marginTop: 30, display: "flex", gap: 14 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 200, height: 26, borderRadius: 13, background: "linear-gradient(90deg, #C9786E, #E6A39A)", transform: `rotate(${Math.sin(f / 6 + i) * 6}deg) scaleX(${1 + 0.15 * Math.sin(f / 5 + i)})` }} />)}</div>
    </div>
  </>);
};

// 27 · ticket de balanza de papel térmico que se imprime: RESTAURANT $38 + TIP · HOME $5 · TOTAL $6
export const Receipt: P<{ rows: { t: number; a: string; b: string }[]; total: { t: number; a: string; b: string } } & A0> = ({ a, d, rows, total, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110), tt = sp(f, at(total.t), 11, 190);
  const shown = rows.filter((r) => f >= at(r.t) - 4).length + (f >= at(total.t) - 4 ? 1.4 : 0);
  return shell(<Bg k="steel" f={f} d={d} />, <>
    {/* la impresora de la balanza */}
    <div style={{ position: "absolute", left: 520, top: 60, width: 880, height: 190, borderRadius: 30, background: "linear-gradient(180deg, #F4F4F2, #C9CBCB)", boxShadow: SH, transform: `translateY(${(1 - u) * -300}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 320, height: 100, borderRadius: 10, background: "#0E1A12", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)", fontFamily: BEB, fontSize: 80, color: "#6CFF9A", textAlign: "right", paddingRight: 20, lineHeight: "104px" }}>PORK</div>
      <div style={{ position: "absolute", left: 140, bottom: 18, width: 600, height: 16, borderRadius: 8, background: "#2B2A27" }} />
    </div>
    <div style={{ position: "absolute", left: 610, top: 236, width: 700, height: 820, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -820 + Math.min(820, 140 + 150 * shown), width: 700, height: 800, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 5px), linear-gradient(180deg, #FFFEFA, #F1ECE1)", boxShadow: "0 20px 30px rgba(0,0,0,0.3)", padding: "30px 44px", color: INK }}>
        <div style={{ fontFamily: BEB, fontSize: 44, letterSpacing: 8, color: "#7A746A", textAlign: "center" }}>STAN'S ARITHMETIC</div>
        {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: BEB, fontSize: 64, marginTop: 30, opacity: f >= at(r.t) - 4 ? 1 : 0 }}><span>{r.a}</span><span>{r.b}</span></div>)}
        <div style={{ borderTop: "4px dashed #B9B2A4", margin: "30px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: BEB, opacity: f >= at(total.t) - 4 ? 1 : 0 }}><span style={{ fontSize: 56 }}>{total.a}</span><span style={{ fontSize: 150, color: OK, display: "inline-block", transform: `scale(${0.8 + 0.2 * tt})` }}>{total.b}</span></div>
      </div>
    </div>
  </>);
};

// 28 · familia de 4: mesa con 4 platos; RESTAURANT $150+ vs HOME $24 → SAVE $120+ (sello)
export const FamilyMath: P<{ tR: number; tH: number; tD: number } & A0> = ({ a, d, tR, tH, tD, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), r = sp(f, at(tR), 12, 160), h = sp(f, at(tH), 12, 160), s = sp(f, at(tD), 10, 210);
  return shell(<Bg k="cloth" f={f} d={d} />, <>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 140 + (i % 2) * 380, top: 160 + Math.floor(i / 2) * 380, width: 330, height: 330, borderRadius: 165, background: "radial-gradient(circle at 45% 40%, #FFFFFF, #ECECE8 55%, #CFCFC9 70%, #F7F7F4 72%, #DADAD4)", boxShadow: SH, opacity: cl((u - i * 0.1) * 2) }}>
      <Chop w={210} h={160} cook={1} style={{ position: "absolute", left: 60, top: 85 }} />
    </div>)}
    <div style={{ position: "absolute", left: 1000, top: 150, opacity: cl(r * 2), transform: `translateX(${(1 - r) * 80}px)` }}>
      <div style={{ padding: "20px 40px", background: "linear-gradient(160deg, #2A1A12, #120A06)", boxShadow: SH, borderRadius: 12 }}>
        <div style={{ fontFamily: BEB, fontSize: 56, color: "#BDB5A6", letterSpacing: 6 }}>RESTAURANT · FAMILY OF 4</div>
        <div style={{ fontFamily: BEB, fontSize: 170, lineHeight: 1, color: "#F2C2B8" }}>$150+</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 500, opacity: cl(h * 2), transform: `translateX(${(1 - h) * 80}px)` }}>
      <div style={{ padding: "20px 40px", background: TX.paper, boxShadow: SH, borderRadius: 12 }}>
        <div style={{ fontFamily: BEB, fontSize: 56, color: "#6D665C", letterSpacing: 6 }}>AT HOME · FAMILY OF 4</div>
        <div style={{ fontFamily: BEB, fontSize: 170, lineHeight: 1, color: OK }}>$24</div>
      </div>
    </div>
    <Stamp txt="SAVE $120+" s={s} x={1060} y={830} r={-7} size={120} color={OK} />
  </>);
};

// 29 · el repaso: ticket largo de carnicería con los 9 trucos que se van tildando
export const TicketList: P<{ items: { t: number; txt: string }[] } & A0> = ({ a, d, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110);
  const last = items.reduce((m, it, i) => (f >= at(it.t) - 4 ? i : m), -1);
  const scroll = 0 * last;
  return shell(<Bg k="kiel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 460, top: 60, width: 1000, height: 960, overflow: "hidden", transform: `translateY(${(1 - u) * 900}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, minHeight: 960, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 5px), linear-gradient(180deg, #FFFEFA, #F1ECE1)", boxShadow: SH, padding: "36px 60px", transform: `translateY(${-scroll}px)` }}>
        <div style={{ fontFamily: BEB, fontSize: 80, letterSpacing: 8, color: KIEL, textAlign: "center" }}>STAN'S 9 · JUICY PORK CHOP</div>
        <div style={{ borderTop: "4px dashed #B9B2A4", margin: "16px 0 10px" }} />
        {items.map((it, i) => { const s = cl((f - at(it.t)) / 12); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, height: 86, opacity: 0.18 + 0.82 * cl(s * 3) }}>
          <div style={{ width: 64, fontFamily: BEB, fontSize: 70, color: RED }}>{i + 1}</div>
          <div style={{ flex: 1, fontFamily: BEB, fontSize: 64, color: INK, whiteSpace: "nowrap" }}>{it.txt}</div>
          <Tick u={s} size={64} />
        </div>; })}
      </div>
    </div>
  </>);
};

// 30 · comentarios: tarjeta tipo comentario sobre la mesada con taza de café; "¿a qué temperatura? ¿qué ciudad?"
export const CommentCard: P<{ tq: number; tc: number } & A0> = ({ a, d, tq, tc, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 120), q = cl((f - at(tq)) / 30), c = cl((f - at(tc)) / 30);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 260, top: 180, width: 1100, height: 680, borderRadius: 30, background: "linear-gradient(170deg, #FFFFFF, #EEEDEA)", boxShadow: SH, transform: `rotate(-2deg) translateY(${(1 - u) * 400}px)`, padding: 60 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: `radial-gradient(circle at 35% 30%, #4A78AA, ${BLUE})` }} />
        <div style={{ fontFamily: BEB, fontSize: 64, color: INK }}>COMMENTS · STAN READS EVERY ONE</div>
      </div>
      <div style={{ marginTop: 60 }}><Mk txt="What temp did your mom cook pork to?" u={q * 1.3} size={50} color={INK} /></div>
      <div style={{ marginTop: 60 }}><Mk txt="What city did you grow up in?" u={c * 1.3} size={50} color={INK} /></div>
      <div style={{ position: "absolute", left: 60, bottom: 50, width: 980, height: 6, background: `linear-gradient(90deg, ${RED} ${100 * c}%, #DDD 0)`, borderRadius: 3 }} />
    </div>
    {/* taza de café vista de arriba */}
    <div style={{ position: "absolute", left: 1450, top: 560, width: 300, height: 300, borderRadius: 150, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E1DED6 70%)", boxShadow: SH, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: 110, background: "radial-gradient(circle at 40% 35%, #6B3E20, #2E1709)" }} />
      <div style={{ position: "absolute", left: 270, top: 110, width: 90, height: 80, borderRadius: 40, border: "22px solid #E9E6DE" }} />
    </div>
  </>);
};
