// ck5na · kit3 = vuelta 2 de los componentes tras el evaluador (eval1/quejas.json): SIN tarjetas ni paneles. Cada uno es una
// escena de OBJETOS REALES recortados (fotos agnes sobre blanco + rembg → public/ck5na/obj/*.png) que caen de a uno con
// resorte con peso, aplastado al aterrizar y sombra de contacto; texto GRANDE (≥44 px a 1080) con contorno, pocas palabras;
// y un momento wow por componente. Viven a la derecha (x 1020-1890): el centro/izquierda es de Loretta y del zócalo.
import React from "react";
import { Img, staticFile } from "remotion";
import { e, ei } from "../kits/yanqui3d/lib";
import { C, HAND, SANS, SERIF } from "./ui";

const cl = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const O = (n: string) => staticFile(`ck5na/obj/${n}.png`);
// resorte con peso: 0→1 pasándose ~10 % y volviendo
const sp = (t: number, a: number, f = 1) => { const u = (t - a) * f * 0.6; return u <= 0 ? 0 : 1 - Math.exp(-5.2 * u) * Math.cos(8.5 * u); };
// aplastado al aterrizar (squash & stretch)
const sq = (t: number, a: number, amp = 0.09) => { const u = t - a; return u <= 0 ? 0 : Math.exp(-6 * u) * Math.sin(16 * u) * amp; };
const CX = 1455;
// alto/ancho de cada recorte (para que nada alto se pase de alto: mh)
const AR: Record<string, number> = {"apron": 1.129, "bag12": 1.249, "ball": 0.93, "basket": 0.54, "bills": 0.841, "bowl": 0.683, "bowldough": 0.701, "bowllid": 0.587, "brush": 0.416, "bun": 0.802, "bun_towel": 0.753, "butter": 0.643, "calpad": 0.763, "chalk": 0.725, "circle": 0.978, "clock": 1.036, "coin": 0.565, "cup": 0.834, "disk": 0.958, "doughflat": 0.568, "doughrock": 0.899, "doughsoft": 0.877, "eggs": 0.627, "envelope": 0.544, "fbag": 1.026, "fist": 1.641, "flour": 1.287, "frame": 1.273, "girl1962": 1.378, "gum": 0.669, "hazel": 1.339, "honeydip": 0.699, "knotraw": 0.276, "loupe": 0.63, "milk": 2.373, "palm": 0.411, "pan913": 0.638, "pan_steam": 0.668, "pan_warm": 0.744, "pen": 0.419, "pricetag25": 1.288, "quarter": 0.73, "receipt": 2.248, "recipecard": 0.668, "register": 1.092, "roll_flake": 0.75, "roll_horn": 0.522, "roll_knot": 0.806, "roll_pan": 0.799, "rope": 0.116, "ruler": 0.308, "salt": 0.404, "scale": 0.959, "shelf": 0.213, "skillet": 0.759, "spoon": 0.524, "spoonstr": 0.673, "sugar": 0.666, "tagblank": 0.521, "tagstring": 2.358, "timer": 1.451, "towel": 0.645, "tray": 0.61, "water": 1.297, "wrist": 0.858, "yeastjar": 1.344, "yeastpk": 0.651};

const ring = (c: string, r: number) => [[-r, 0], [r, 0], [0, -r], [0, r], [-r * 0.7, -r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, r * 0.7]].map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(",") + ",0 10px 26px rgba(0,0,0,.65)";

// escena: velo oscuro suave detrás (no es tarjeta) + salida fundida con caída
const Stage: React.FC<{ t: number; a: number; out: number; children: React.ReactNode; veil?: number }> = ({ t, a, out, children, veil = 0.55 }) => {
  if (t < a - 0.2 || t > out + 0.8) return null;
  // salida: se funde y se aleja hacia el fondo en 0,28 s (antes se deslizaba a la derecha y en la salida todo quedaba cortado en el borde)
  const kO = ei(t, out, out + 0.28);
  if (kO >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - kO, transform: `scale(${(1 - 0.08 * kO).toFixed(4)})`, filter: kO > 0.01 ? `blur(${(10 * kO).toFixed(1)}px)` : undefined, transformOrigin: "75% 60%" }}>
      <div style={{ position: "absolute", left: 860, top: -80, width: 1200, height: 1240, background: `radial-gradient(closest-side, rgba(18,9,4,${veil}), rgba(18,9,4,${veil * 0.55}) 60%, rgba(18,9,4,0))`, opacity: e(t, a - 0.15, a + 0.5) }} />
      {/* cámara que nunca se queda quieta: acercamiento curvo lento sobre la escena (dos cuadros nunca iguales) */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(-26 * Math.sin(1.4 * cl((t - a) / Math.max(1, out - a)))).toFixed(1)}px, ${(-14 * cl((t - a) / Math.max(1, out - a))).toFixed(1)}px) scale(${(1 + 0.06 * ei(t, a, Math.max(a + 1, out))).toFixed(4)}) rotate(${(0.8 * Math.sin(0.9 * (t - a))).toFixed(3)}deg)`, transformOrigin: "96% 60%" }}>{children}</div>
    </div>
  );
};

type From = "drop" | "left" | "right" | "up" | "pop" | "none";
type OP = { t: number; n: string; a: number; x: number; y: number; w: number; mh?: number; from?: From; r?: number; tf?: string; sh?: number; op?: number; z?: number; children?: React.ReactNode; origin?: string; fl?: string };
// objeto recortado: (x, y) = punto de apoyo (centro de la base)
const Ob: React.FC<OP> = ({ t, n, a, x: x0, y, w: w0, mh = 640, from = "drop", r = 0, tf = "", sh = 1, op = 1, z, children, origin = "50% 100%", fl }) => {
  if (t < a - 0.05 || op <= 0.001) return null;
  const w = Math.min(w0 * 1.3, 920, (mh * 1.3) / (AR[n] ?? 1)); const x = Math.min(Math.max(x0, 1000 + w / 2), 1880 - w / 2);
  const k = from === "none" ? 1 : sp(t, a);
  let dx = 0, dy = 0, rot = r, s = 1;
  if (from === "drop") { dy = -(1 - k) * 640; rot = r + (1 - k) * -16; }
  if (from === "left") { dx = -(1 - k) * 760; rot = r + (1 - k) * -24; }
  if (from === "right") { dx = (1 - k) * 760; rot = r + (1 - k) * 24; }
  if (from === "up") dy = (1 - k) * 560;
  if (from === "pop") s = Math.max(0.02, k);
  const q = from === "none" ? 0 : sq(t, from === "pop" ? a + 0.05 : a + 0.3);
  const shK = from === "drop" ? cl(k) : 1;
  return (
    <div style={{ position: "absolute", left: x - w / 2, bottom: 1080 - y, width: w, zIndex: z, opacity: op * cl((t - a) * 7) }}>
      {sh > 0 && <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -w * 0.035, height: w * 0.09, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.62), rgba(0,0,0,0))", opacity: sh * (0.25 + 0.75 * shK), transform: `scaleX(${(0.55 + 0.45 * shK).toFixed(3)})` }} />}
      <div style={{ position: "relative", transform: `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${(s * (1 + q)).toFixed(4)},${(s * (1 - q)).toFixed(4)}) ${tf}`, transformOrigin: origin }}>
        <Img src={O(n)} style={{ width: "100%", display: "block", filter: fl ?? "drop-shadow(0 12px 16px rgba(0,0,0,.4))" }} />
        {children}
      </div>
    </div>
  );
};

// texto grande con contorno (sin panel); entra con resorte
type TP = { t: number; a: number; x?: number; y: number; txt: React.ReactNode; size?: number; col?: string; font?: string; w?: number; weight?: number; ol?: string; rot?: number; op?: number; ls?: number };
const Tx: React.FC<TP> = ({ t, a, x = CX, y, txt, size = 64, col = C.cream, font = SERIF, w = 860, weight = 400, ol = "#1a0e08", rot = 0, op = 1, ls = 0 }) => {
  if (t < a - 0.05 || op <= 0.001) return null;
  const k = sp(t, a, 1.3); size = Math.max(size, font === HAND ? 72 : 60); if (typeof txt === "string") { const lw = Math.max(...txt.split(/\s+/).map((x) => x.length)); size = Math.min(size, (w - 20) / (lw * (font === HAND ? 0.5 : 0.66))); }
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily: font, fontSize: size, fontWeight: weight, letterSpacing: ls, color: col, lineHeight: 1.04, textShadow: ring(ol, size >= 80 ? 5 : size >= 50 ? 4 : 3), opacity: op * cl((t - a) * 6), transform: `translateY(${((1 - k) * 46).toFixed(1)}px) scale(${(0.55 + 0.45 * k).toFixed(4)}) rotate(${rot}deg)`, transformOrigin: "50% 100%" }}>{txt}</div>
  );
};
const Half: React.FC<{ n?: string }> = ({ n = "" }) => <span>{n}<span style={{ display: "inline-block", fontSize: "0.5em", lineHeight: 1, verticalAlign: "0.55em", marginLeft: 2 }}>1/2</span></span>;

// trazo dibujado (círculo, tilde, tachado) que se pinta con la voz
const Stroke: React.FC<{ t: number; a: number; d: string; col?: string; sw?: number; dur?: number; len?: number; l?: number; tp?: number; W?: number; H?: number }> = ({ t, a, d, col = C.red, sw = 12, dur = 0.5, len = 1600, l = 0, tp = 0, W = 1920, H = 1080 }) => {
  if (t < a) return null;
  return <svg width={W} height={H} style={{ position: "absolute", left: l, top: tp, overflow: "visible" }}><path d={d} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - ei(t, a, a + dur))} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.5))" }} /></svg>;
};
// partículas (harina, vapor, burbujas) deterministas
const Puff: React.FC<{ t: number; a: number; x: number; y: number; n?: number; col?: string; spread?: number; up?: number; dur?: number; size?: number }> = ({ t, a, x, y, n = 18, col = "rgba(255,255,255,.85)", spread = 160, up = 120, dur = 1.1, size = 26 }) => {
  const u = (t - a) / dur; if (u < 0 || u > 1) return null;
  return <>{Array.from({ length: n }, (_, i) => { const an = (i * 137.5) % 360 * Math.PI / 180, rr = spread * (0.4 + 0.6 * ((i * 53) % 10) / 10) * ei(t, a, a + dur); const s = size * (0.6 + ((i * 31) % 7) / 7);
    return <div key={i} style={{ position: "absolute", left: x + Math.cos(an) * rr - s / 2, top: y + Math.sin(an) * rr * 0.5 - up * u - s / 2, width: s, height: s, borderRadius: "50%", background: `radial-gradient(closest-side, ${col}, rgba(255,255,255,0))`, opacity: (1 - u) * 0.95 }} />; })}</>;
};

// ============================================================================================================
// 1 · LA BOLSA DEL SÚPER: la bolsa de 12 pancitos cae, la etiqueta amarilla se pega de un golpe con $4.79 y se parte en 40¢ por pancito
const Vapor: React.FC<{ t: number; a: number; b: number; x: number; y: number; big?: number }> = ({ t, a, b, x, y, big = 1 }) => <>{Array.from({ length: Math.max(1, Math.ceil((b - a) / 0.5)) }, (_, k) => <Puff key={k} t={t} a={a + k * 0.5} x={x + ((k * 37) % 60 - 30)} y={y} n={10} spread={70 * big} up={220 * big} dur={1.6} size={46 * big} col="rgba(255,255,255,.7)" />)}</>;

export const ShelfTag: React.FC<{ t: number; a: number; out: number; split: number }> = ({ t, a, out, split }) => {
  const kS = sp(t, split, 1.2);
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="bag12" a={a + 0.05} x={1380} y={900} w={560} r={-3} />
      <Ob t={t} n="tagblank" a={a + 0.75} x={1650} y={860} w={330} from="right" r={-8 + 6 * cl(kS)} z={3}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 92, color: "#c0281c", letterSpacing: -2 }}>$4.79</div>
      </Ob>
      <Tx t={t} a={split} y={150} txt={<span>÷ 12 = <span style={{ color: C.goldL }}>40¢</span></span>} size={104} font={SANS} weight={900} />
      <Tx t={t} a={split + 0.4} y={275} txt="A ROLL" size={58} font={SANS} weight={800} ls={6} />
    </Stage>
  );
};

// 2 · LOS 31 INGREDIENTES: se da vuelta la bolsa y le salen volando las palabras raras de la etiqueta mientras un 31 gigante cuenta
export const LabelScroll: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const W = ["CALCIUM PROPIONATE", "DATEM", "AZODICARBONAMIDE", "SOY LECITHIN", "MONO- & DIGLYCERIDES", "SODIUM STEAROYL LACTYLATE", "ENZYMES", "NATAMYCIN", "CALCIUM SULFATE"];
  const n = Math.round(31 * ei(t, a + 0.5, a + 4.2)), turn = ei(t, a + 0.1, a + 0.7);
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="bag12" a={a} x={1260} y={960} w={420} from="none" tf={`rotateY(${turn * 180}deg)`} origin="50% 50%" />
      {W.map((w, i) => { const at = a + 0.7 + i * 0.4, u = cl((t - at) / 3.2); if (t < at) return null;
        return <div key={w} style={{ position: "absolute", left: 1150 + ((i * 97) % 300), top: 640 - u * (420 + (i % 3) * 60), fontFamily: SANS, fontWeight: 800, fontSize: 30 + (i % 3) * 6, color: "#fff", textShadow: ring("#1a0e08", 3), opacity: Math.min(1, u * 6) * (1 - cl((u - 0.75) * 4)), transform: `rotate(${((i * 23) % 24) - 12}deg) scale(${0.6 + 0.4 * cl(u * 4)})`, whiteSpace: "nowrap" }}>{w}</div>; })}
      <div style={{ position: "absolute", left: 1560, top: 360, width: 320, textAlign: "center", fontFamily: SERIF, fontSize: 250, lineHeight: 1, color: C.goldL, textShadow: ring("#1a0e08", 6), transform: `scale(${1 + 0.06 * Math.sin(t * 9) * (n < 31 ? 1 : 0)})` }}>{n}</div>
      <Tx t={t} a={a + 0.9} x={1720} y={630} w={360} txt="INGREDIENTS" size={46} font={SANS} weight={900} ls={3} />
    </Stage>
  );
};

// 3 · EL TACO DE ALMANAQUE: las hojas vuelan de 1962 a 2026 sobre el calendario de pared, y queda «64 AÑOS» grande
export const YearFlip: React.FC<{ t: number; a: number; out: number; from: number; to: number }> = ({ t, a, out, from, to }) => {
  const k = ei(t, a + 0.6, a + 3.4), y = Math.round(lerp(from, to, k)), fl = k > 0 && k < 1 ? (t * 14) % 1 : 1;
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="calpad" a={a} x={1440} y={930} w={600}>
        <div style={{ position: "absolute", left: 0, right: 0, top: "42%", textAlign: "center", fontFamily: SERIF, fontSize: 170, color: C.ink, lineHeight: 1, transform: `perspective(700px) rotateX(${(1 - fl) * 70}deg)`, transformOrigin: "50% 0" }}>{y}</div>
      </Ob>
      {k > 0 && k < 1 && [0, 1, 2].map((i) => { const u = ((t * 14) + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 1250 + u * 260, top: 520 - u * 380, width: 300, height: 220, background: "#fbf7ee", boxShadow: "0 8px 20px rgba(0,0,0,.35)", opacity: 1 - u, transform: `rotate(${u * 70 - 20}deg)` }} />; })}
      <Tx t={t} a={a + 3.6} y={90} txt={`${to - from} YEARS`} size={110} font={SANS} weight={900} col={C.goldL} />
      <Tx t={t} a={a + 4.1} y={215} txt="not one roll bought" size={58} font={HAND} />
    </Stage>
  );
};

// 4 · LA LUPA SOBRE EL TICKET: el ticket de 1962 cae, la lupa agranda tres renglones iguales de YEAST y aparece un ? rojo
export const LoupeTeaser: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = ei(t, a + 1.2, a + 2.4), kr = sp(t, a);
  const R = ["FLOUR ...... .19", "YEAST ...... .08", "YEAST ...... .08", "YEAST ...... .08", "MILK ....... .07"];
  const lx = lerp(1860, 1400, k), ly = lerp(900, 470, k);
  return (
    <Stage t={t} a={a} out={out}>
      <div style={{ position: "absolute", left: 1150, top: 120, width: 460, height: 820, transform: `translateY(${(1 - kr) * -700}px) rotate(${-4 + (1 - cl(kr)) * -10}deg)`, background: "linear-gradient(180deg,#f6ead0,#ecd9ae)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", clipPath: "polygon(0 2%,6% 0,12% 2%,18% 0,24% 2%,30% 0,36% 2%,42% 0,48% 2%,54% 0,60% 2%,66% 0,72% 2%,78% 0,84% 2%,90% 0,96% 2%,100% 0,100% 98%,94% 100%,88% 98%,82% 100%,76% 98%,70% 100%,64% 98%,58% 100%,52% 98%,46% 100%,40% 98%,34% 100%,28% 98%,22% 100%,16% 98%,10% 100%,4% 98%,0 100%)", padding: "50px 34px", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 36, color: "#4a3820", lineHeight: 1.9 }}>
        <div style={{ textAlign: "center" }}>MAIN ST. GROCERY</div><div style={{ textAlign: "center" }}>MARCH 1962</div>
        {R.map((r, i) => <div key={i}>{r}</div>)}
      </div>
      {t > a + 0.6 && <div style={{ position: "absolute", left: lx - 190, top: ly - 190, width: 380, height: 380, opacity: e(t, a + 0.6, a + 0.9) }}>
        <div style={{ position: "absolute", left: 300, top: 290, width: 230, height: 54, borderRadius: 20, background: "linear-gradient(180deg,#6a4426,#2b1a0c)", transform: "rotate(42deg)", transformOrigin: "0 50%", boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "18px solid #2b1d12", boxShadow: "0 24px 40px rgba(0,0,0,.55), inset 0 0 30px rgba(0,0,0,.25)", background: "radial-gradient(circle at 50% 50%, #f8eed6, #ead6a8)", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 60, color: k >= 1 ? "#b02018" : "#4a3820", lineHeight: 1.25 }}>
          <div>YEAST .08</div><div>YEAST .08</div><div>YEAST .08</div>
          <div style={{ position: "absolute", left: 40, top: 30, width: 120, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.55)", filter: "blur(8px)" }} />
        </div>
      </div>}
      <Tx t={t} a={a + 2.6} x={1460} y={50} w={600} txt="3 × YEAST?" size={96} font={SANS} weight={900} col="#ff6a55" />
    </Stage>
  );
};

// 5 · CUATRO DÍAS EN EL FRÍO: el bol tapado cae y cuelgan de a una cuatro etiquetas de hilo DAY 1-4 que se balancean
export const FourDayStrip: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => (
  <Stage t={t} a={a} out={out}>
    <Ob t={t} n="bowllid" a={a} x={1450} y={990} w={560} />
    <div style={{ position: "absolute", left: 1060, top: 110, width: 800, height: 6, background: "linear-gradient(90deg,#8a6a40,#d8b780,#8a6a40)", opacity: e(t, a, a + 0.4) }} />
    {[0, 1, 2, 3].map((i) => { const at = a + 0.8 + i * 0.7; if (t < at) return null; const sw = 18 * Math.exp(-2.4 * (t - at)) * Math.cos(7 * (t - at));
      return <div key={i} style={{ position: "absolute", left: 1100 + i * 195, top: 112, width: 180, transformOrigin: "50% 0", transform: `rotate(${sw.toFixed(2)}deg) translateY(${(1 - cl(sp(t, at))) * -200}px)` }}>
        <Img src={O("tagstring")} style={{ width: "100%", display: "block", filter: "drop-shadow(0 10px 12px rgba(0,0,0,.45))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "38%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.wine, lineHeight: 1 }}>DAY<br /><span style={{ fontSize: 76 }}>{i + 1}</span></div>
      </div>; })}
    <Tx t={t} a={a + 3.9} y={420} txt="ONE BOWL · 4 DAYS" size={70} font={SANS} weight={900} col={C.goldL} />
  </Stage>
);

// 6 · LA REPISA DE LOS CINCO PANES: caen de a uno sobre la repisa los cuatro panes y el quinto queda tapado con un repasador
export const FiveBreadShelf: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const P = [{ n: "roll_pan", l: "PAN ROLLS" }, { n: "roll_flake", l: "BUTTERFLAKE" }, { n: "roll_knot", l: "KNOTS" }, { n: "roll_horn", l: "BUTTERHORNS" }, { n: "bun_towel", l: "?" }];
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="shelf" a={a} x={1460} y={790} w={900} from="left" sh={0.6} />
      {P.map((p, i) => { const at = a + 0.8 + i * 0.75, x = 1110 + i * 175; return <React.Fragment key={p.n}>
        <Ob t={t} n={p.n} a={at} x={x} y={735} w={i === 4 ? 230 : 210} r={(i % 2 ? 4 : -4)} />
        <Tx t={t} a={at + 0.3} x={x} y={i === 4 ? 420 : 800} w={200} txt={i === 4 ? "?" : String(i + 1)} size={i === 4 ? 150 : 64} font={SERIF} col={i === 4 ? "#e8473a" : C.goldL} />
      </React.Fragment>; })}
      <Tx t={t} a={a + 1.1} y={200} txt="ONE BOWL" size={96} font={SANS} weight={900} col={C.goldL} />
      <Tx t={t} a={a + 2.2} y={320} txt="five church breads" size={60} font={HAND} />
    </Stage>
  );
};

// 7 · LA FOTO DE 1962: cae girando una foto de bordes blancos de Loretta a los 17 en la cocina, con cinta, y la fecha a mano
export const Snapshot62: React.FC<{ t: number; a: number; out: number; line1: string; line2: string }> = ({ t, a, out, line1, line2 }) => {
  const k = sp(t, a, 0.9);
  return (
    <Stage t={t} a={a} out={out}>
      <div style={{ position: "absolute", left: 1210, top: 90, width: 480, padding: "22px 22px 110px", background: "#f7f2e6", boxShadow: "0 40px 70px rgba(0,0,0,.55), 0 4px 0 rgba(0,0,0,.1)", transform: `translate(${(1 - k) * 500}px, ${(1 - k) * -300}px) rotate(${4 + (1 - k) * 40}deg) scale(${0.8 + 0.2 * k})` }}>
        <Img src={O("girl1962")} style={{ width: "100%", display: "block", filter: "sepia(.35) contrast(1.05)", background: "radial-gradient(120% 90% at 50% 30%, #d9d2c2, #8e8574)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: HAND, fontSize: 64, color: "#1d2a5a", opacity: e(t, a + 1.2, a + 1.8) }}>{line1}</div>
        <div style={{ position: "absolute", left: "38%", top: -26, width: 170, height: 56, background: "rgba(240,225,180,.75)", transform: "rotate(-6deg)", boxShadow: "0 2px 4px rgba(0,0,0,.2)" }} />
      </div>
      <Tx t={t} a={a + 1.9} y={950} txt={line2} size={54} font={HAND} />
    </Stage>
  );
};

// 8 · HAZEL: su retrato cae enmarcado, el delantal azul doblado se apoya al costado y su nombre y «73» se escriben grandes
export const HazelCard: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => (
  <Stage t={t} a={a} out={out}>
    <Ob t={t} n="apron" a={a + 1.3} x={1730} y={1040} w={260} from="right" r={6} />
    <div style={{ position: "absolute", left: 1230, top: 70, width: 400, padding: 18, background: "linear-gradient(135deg,#5a3a20,#2e1c0e)", boxShadow: "0 40px 70px rgba(0,0,0,.55)", transform: `translateY(${(1 - sp(t, a)) * -650}px) rotate(${-3 + (1 - cl(sp(t, a))) * -14}deg)` }}>
      <Img src={O("hazel")} style={{ width: "100%", display: "block", filter: "sepia(.25)", background: "radial-gradient(120% 90% at 50% 30%, #d9d2c2, #7e7564)" }} />
    </div>
    <Tx t={t} a={a + 0.9} x={1430} y={710} w={800} txt="HAZEL NORDQUIST" size={74} font={SERIF} col={C.cream} />
    <Tx t={t} a={a + 1.8} x={1330} y={800} w={400} txt={<span>age <span style={{ fontSize: 120, color: C.goldL }}>73</span></span>} size={60} font={HAND} />
  </Stage>
);

// 9 · LA FRASE EN TINTA: la pluma escribe la frase de Hazel en una ficha grande, letra por letra, y la segunda línea en rojo
export const InkQuote: React.FC<{ t: number; a: number; out: number; l1: string; l2: string; a2: number }> = ({ t, a, out, l1, l2, a2 }) => {
  const e1 = Math.min(a2 - 0.1, a + 1.4), n1 = Math.round(l1.length * ei(t, a + 0.2, e1)), n2 = Math.round(l2.length * ei(t, a2, a2 + 0.8));
  const writing2 = t >= a2, pk = writing2 ? n2 / l2.length : n1 / l1.length;
  return (
    <Stage t={t} a={a} out={out} veil={0.7}>
      <Ob t={t} n="recipecard" a={a - 0.1} x={1420} y={1010} w={980} from="up" sh={0.8} r={-2}>
        <div style={{ position: "absolute", left: "7%", right: "6%", top: "22%", fontFamily: HAND, fontSize: 78, lineHeight: 1.08, color: "#1d2a5a" }}>
          <div>{l1.slice(0, n1)}</div>
          <div style={{ color: C.wine, fontSize: 104, marginTop: 18, position: "relative", display: "inline-block" }}>{l2.slice(0, n2)}
            <div style={{ position: "absolute", left: 0, bottom: -8, height: 8, borderRadius: 4, background: C.wine, width: `${100 * ei(t, a2 + 0.8, a2 + 1.3)}%` }} />
          </div>
        </div>
      </Ob>
      <Ob t={t} n="pen" a={a + 0.1} x={1060 + 760 * pk} y={writing2 ? 840 : 690} w={300} from="right" r={-12} sh={0} z={4} op={1 - e(t, a2 + 1.3, a2 + 1.7)} />
    </Stage>
  );
};

// 10 · LA SEMANA DEL BOL: el bol de masa en el centro y, con cada día que nombra, sale volando de él un pan distinto a su lugar
export const BowlWeek: React.FC<{ t: number; marks: number[]; a: number; out?: number }> = ({ t, marks, a, out = marks[3] + 6 }) => {
  const D = [{ d: "SUN", n: "roll_pan" }, { d: "MON", n: "roll_flake" }, { d: "TUE", n: "roll_knot" }, { d: "WED", n: "roll_horn" }];
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="bowldough" a={a} x={1460} y={1010} w={520} />
      {D.map((p, i) => { const at = marks[i]; if (t < at) return null; const k = ei(t, at, at + 0.8), x = 1130 + i * 220, tx = lerp(1460, x, k), ty = lerp(820, 470, k) - Math.sin(k * Math.PI) * 180;
        return <React.Fragment key={p.d}>
          <Ob t={t} n={p.n} a={at} x={tx} y={ty} w={lerp(80, 190, k)} from="none" r={(1 - k) * 200} />
          <Tx t={t} a={at + 0.6} x={x} y={490} w={220} txt={p.d} size={56} font={SANS} weight={900} col={i === 0 ? C.goldL : C.cream} />
        </React.Fragment>; })}
      <Tx t={t} a={a + 0.4} y={90} txt="one bowl · all week" size={64} font={HAND} />
    </Stage>
  );
};

// 11 · LA LEVADURA DORMIDA: frasco de levadura con burbujas que suben rápido en tibio; entra la escarcha y casi se frenan
export const SleepyYeast: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const kc = ei(t, a + 3.2, a + 5.8), spd = lerp(1, 0.06, kc), W = 520, H = W * (AR.yeastjar ?? 1.2);
  const mask = { WebkitMaskImage: `url(${O("yeastjar")})`, maskImage: `url(${O("yeastjar")})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" } as React.CSSProperties;
  // cristales de escarcha: ramitas que crecen desde abajo y los costados
  const F = Array.from({ length: 34 }, (_, i) => { const x = (i * 97) % W, side = i % 3 === 0; return { x: side ? (i % 2 ? 10 : W - 10) : x, y: side ? H * (0.35 + ((i * 37) % 60) / 100) : H - 6, ang: side ? (i % 2 ? -20 : 200) : -90 + ((i * 53) % 60) - 30, L: 60 + ((i * 41) % 110), d: (i % 7) * 0.12 }; });
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="yeastjar" a={a} x={1440} y={1010} w={W}>
        <div style={{ position: "absolute", inset: 0, ...mask }}>
          {Array.from({ length: 46 }, (_, i) => { const ph = (i * 0.137) % 1, sz = 16 + (i % 5) * 9, wob = Math.sin((t - a) * 3 * spd + i) * 10;
            const y = ((t - a) * (0.35 + (i % 4) * 0.1) * spd + ph) % 1;
            return <div key={i} style={{ position: "absolute", left: 40 + ((i * 83) % (W - 100)) + wob, top: H * 0.95 - y * H * 0.62, width: sz, height: sz, borderRadius: "50%", background: "radial-gradient(circle at 32% 30%, rgba(255,255,255,.95) 0 18%, rgba(255,255,255,.25) 40%, rgba(255,240,210,.12) 70%, rgba(255,255,255,.5) 100%)", boxShadow: "0 0 6px rgba(255,255,255,.4)", opacity: e(t, a + 0.3, a + 0.8) * (1 - 0.5 * kc) }} />; })}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(200,230,255,${0.75 * kc}) ${lerp(0, 70, kc)}%, rgba(200,230,255,${0.25 * kc}))` }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {F.map((f, i) => { const g = ei(t, a + 3.2 + f.d, a + 5.4 + f.d), L = f.L * g, r = (f.ang * Math.PI) / 180, x2 = f.x + Math.cos(r) * L, y2 = f.y + Math.sin(r) * L;
              const br = [0.4, 0.7].map((q) => { const bx = f.x + Math.cos(r) * L * q, by = f.y + Math.sin(r) * L * q, l2 = L * 0.35; return `M${bx} ${by} L${bx + Math.cos(r + 0.8) * l2} ${by + Math.sin(r + 0.8) * l2} M${bx} ${by} L${bx + Math.cos(r - 0.8) * l2} ${by + Math.sin(r - 0.8) * l2}`; }).join(" ");
              return g > 0.01 ? <path key={i} d={`M${f.x} ${f.y} L${x2} ${y2} ${br}`} stroke="rgba(245,252,255,.95)" strokeWidth={3} strokeLinecap="round" fill="none" style={{ filter: "drop-shadow(0 0 4px rgba(190,230,255,.9))" }} /> : null; })}
          </svg>
        </div>
      </Ob>
      <Tx t={t} a={a + 0.5} y={110} txt="WARM = FAST" size={100} font={SANS} weight={900} col="#ffb35c" op={1 - kc} />
      <Tx t={t} a={a + 3.6} y={110} txt="COLD = SLOW" size={100} font={SANS} weight={900} col="#bfe4ff" />
    </Stage>
  );
};

// 12 · LOS INGREDIENTES SOBRE LA MESA: cada ingrediente cae grande al frente con su medida cuando lo nombra y después se corre a la fila de arriba
export const Ingredients: React.FC<{ t: number; out: number; title: string; rows: { at: number; txt: string }[] }> = ({ t, out, title, rows }) => {
  const N = ["milk", "butter", "sugar", "salt", "yeastpk", "water", "eggs", "flour"], a = rows[0].at - 1.2;
  const cur = rows.reduce((c, r, i) => (t >= r.at ? i : c), -1);
  return (
    <Stage t={t} a={a} out={out}>
      <Tx t={t} a={a} y={70} txt={title} size={54} font={SANS} weight={900} col={C.goldL} ls={3} />
      {rows.map((r, i) => { if (t < r.at) return null; const done = i < cur, k = done ? ei(t, rows[i + 1].at, rows[i + 1].at + 0.6) : 0;
        const x = lerp(1460, 1080 + i * 105, k), y = lerp(860, 330, k), w = lerp(380, 100, k);
        return <React.Fragment key={i}>
          <Ob t={t} n={N[i]} a={r.at} x={x} y={y} w={w} mh={lerp(520, 120, k)} from={done ? "none" : "drop"} />
          <Tx t={t} a={r.at + 0.25} y={900} txt={r.txt} size={56} font={SANS} weight={900} op={done ? 1 - k * 3 : 1} />
        </React.Fragment>; })}
    </Stage>
  );
};

// 13 · LAS DOS CACEROLAS: 1962 la leche hirviendo con nata y vapor; hoy apenas tibia
export const MilkPans: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  // dos cacerolas frente a frente: la de 1962 hierve con vapor denso (a la palabra crece el vapor); la de hoy, tibia y quieta
  const kb = ei(t, at + 2.2, at + 3.4);
  return (
    <Stage t={t} a={at} out={out} veil={0.72}>
      <Ob t={t} n="pan_steam" a={at + 0.1} x={1225} y={760} w={320} />
      <Vapor t={t} a={at + 0.5} b={out + 0.6} x={1225} y={560} big={1 + 0.8 * kb} />
      <Ob t={t} n="pan_warm" a={at + 1.5} x={1660} y={760} w={320} />
      <Tx t={t} a={at + 0.6} x={1225} y={790} w={420} txt="1962" size={96} font={SANS} weight={900} col={C.goldL} />
      <Tx t={t} a={at + 1.9} x={1660} y={790} w={420} txt="TODAY" size={96} font={SANS} weight={900} col={C.cream} />
    </Stage>
  );
};

// 14 · LA PRUEBA DE LA MUÑECA: la gota de leche en la muñeca y un termómetro que sube a 110 verde, se pasa a rojo temblando y vuelve
export const WristThermo: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const up = ei(t, a + 0.8, a + 2.2), over = ei(t, a + 3.4, a + 4.3), back = ei(t, a + 6.2, a + 7.2);
  const deg = 70 + 40 * up + 50 * over * (1 - back), hot = deg > 118, sh = hot ? Math.sin(t * 60) * 4 : 0, h = (deg - 60) / 110;
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="wrist" a={a} x={1330} y={1000} w={600} from="left" />
      <div style={{ position: "absolute", left: 1700 + sh, top: 150, width: 80, height: 720, transform: `translateY(${(1 - sp(t, a + 0.3)) * -800}px)` }}>
        <div style={{ position: "absolute", left: 18, top: 0, width: 44, height: 640, borderRadius: 22, background: "linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,.95),rgba(255,255,255,.5))", boxShadow: "0 20px 30px rgba(0,0,0,.45)" }} />
        <div style={{ position: "absolute", left: 30, bottom: 70, width: 20, height: 570 * h, borderRadius: 10, background: hot ? "#e0281c" : "#d8392b" }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff7a6a, #c0201a)", boxShadow: "0 12px 20px rgba(0,0,0,.45)" }} />
        <div style={{ position: "absolute", left: -10, bottom: 70 + 570 * (50 / 110) - 3, width: 100, height: 6, background: "#3fae5c" }} />
      </div>
      <Tx t={t} a={a + 0.8} x={1530} y={130} w={330} txt={`${Math.round(deg)}°F`} size={92} font={SANS} weight={900} col={hot ? "#ff5b4a" : C.cream} />
      <Tx t={t} a={a + 3.8} x={1400} y={260} w={760} txt="DEAD YEAST" size={76} font={SANS} weight={900} col="#ff5b4a" op={1 - back} />
      <Tx t={t} a={a + 6.8} x={1400} y={260} w={760} txt="WARM, NOT HOT" size={72} font={SANS} weight={900} col="#7fe08f" />
    </Stage>
  );
};

// 15 · EL TIMER DE HUEVO: la perilla del timer gira de 10 a 0 sin saltos mientras al lado la espuma del frasco sube de verdad
export const EggTimer: React.FC<{ t: number; a: number; out: number; mins: number; label: string }> = ({ t, a, out, mins, label }) => {
  const k = ei(t, a + 0.6, a + 7.5), sec = Math.round(mins * 60 * (1 - k)), mm = Math.floor(sec / 60), ss = sec % 60;
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="timer" a={a} x={1230} y={900} w={360} tf={`rotate(${Math.sin(t * 40) * 1.2 * (k > 0 && k < 1 ? 1 : 0) + (k >= 1 ? sq(t, a + 7.5, 0.6) * 20 : 0)}deg)`} origin="50% 90%" />
      <Tx t={t} a={a + 0.4} x={1230} y={240} w={420} txt={`${mm}:${String(ss).padStart(2, "0")}`} size={110} font={SANS} weight={900} col={k >= 1 ? "#7fe08f" : C.cream} />
      <Ob t={t} n="yeastjar" a={a + 0.4} x={1650} y={900} w={360}>
        <div style={{ position: "absolute", left: "16%", right: "16%", bottom: `${18 + 50 * k}%`, height: 30 + 120 * k, borderRadius: "50% 50% 20% 20%", background: "radial-gradient(circle at 50% 30%, #fffaf0, #f1dfb8 70%)", boxShadow: "inset 0 -6px 10px rgba(0,0,0,.1)" }} />
      </Ob>
      <Tx t={t} a={a + 7.7} y={120} txt={label} size={60} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 16 · EL RELOJ DEL BATIDO: reloj de pared grande con la aguja barriendo dos minutos y la cuchara de madera batiendo el bol al lado
export const BeatClock: React.FC<{ t: number; at: number; out: number; label: string }> = ({ t, at, out, label }) => {
  const k = ei(t, at + 0.5, at + 9), bt = Math.sin(t * 16);
  return (
    <Stage t={t} a={at} out={out}>
      <Ob t={t} n="clock" a={at} x={1250} y={760} w={480}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 8, height: "36%", marginLeft: -4, background: "#c0201a", borderRadius: 4, transformOrigin: "50% 0", transform: `rotate(${180 + k * 720}deg)` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 22, height: 22, margin: -11, borderRadius: "50%", background: "#222" }} />
      </Ob>
      <Ob t={t} n="bowl" a={at + 0.4} x={1680} y={980} w={380} />
      <Ob t={t} n="spoon" a={at + 0.7} x={1680 + bt * 30} y={820} w={300} from="right" r={-50 + bt * 18} sh={0} origin="80% 80%" />
      <Tx t={t} a={at + 0.5} x={1250} y={800} w={500} txt={`${Math.floor(k * 2)}:${String(Math.round((k * 120) % 60)).padStart(2, "0")}`} size={90} font={SANS} weight={900} col={k >= 1 ? "#7fe08f" : C.cream} />
      <Tx t={t} a={at + 1} y={90} txt={label} size={64} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 17 · LOS HILOS DE LA CUCHARA: la cuchara sube despacio de la masa y los hilos elásticos se estiran brillando
export const StringySpoon: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = ei(t, a + 0.6, a + 4);
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="spoonstr" a={a} x={1460} y={lerp(1040, 960, k)} w={640} from="up" tf={`scaleY(${1 + 0.14 * k})`} origin="50% 0" />
      <Tx t={t} a={a + 1.5} y={110} txt="LONG STRINGS" size={92} font={SANS} weight={900} col={C.goldL} />
      <Tx t={t} a={a + 2.4} y={230} txt="= soft rolls" size={70} font={HAND} />
    </Stage>
  );
};

// 18 · MEDIA TAZA POR VEZ: la taza medidora se vuelca sobre el bol una y otra vez con nube de harina y el contador sube hasta 6
export const FlourRange: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const P = [0, 1, 2, 3, 4, 5].map((i) => a + 1 + i * 1.5), n = P.filter((p) => t >= p + 0.4).length;
  const tip = P.reduce((m, p) => Math.max(m, Math.sin(Math.PI * cl((t - p) / 0.9))), 0);
  const v = 3 + n * 0.5, whole = Math.floor(v);
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="bowl" a={a} x={1420} y={990} w={520} />
      <Ob t={t} n="cup" a={a + 0.3} x={1640} y={640} w={260} from="right" r={-tip * 95} origin="20% 60%" sh={0} />
      {P.map((p, i) => <Puff key={i} t={t} a={p + 0.4} x={1440} y={780} n={16} spread={180} up={90} dur={1} size={46} />)}
      <Tx t={t} a={a + 0.4} x={1270} y={130} w={500} txt={<span>{whole}{v % 1 ? <Half /> : ""} CUPS</span>} size={100} font={SANS} weight={900} col={v >= 5.5 ? "#7fe08f" : C.cream} />
      <Tx t={t} a={P[5] + 0.6} x={1270} y={260} w={500} txt="stop when it's soft" size={56} font={HAND} />
    </Stage>
  );
};

// 19 · DE ALMOHADA A PIEDRA: una masa blanda grande que, al decir «día tres», se pone gris, se agrieta y tiembla como piedra
export const DoughToRock: React.FC<{ t: number; a: number; out: number; at3: number }> = ({ t, a, out, at3 }) => {
  const k = ei(t, at3, at3 + 1), sh = k > 0 && k < 1 ? Math.sin(t * 70) * 6 : 0;
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="doughsoft" a={a} x={1460 + sh} y={930} w={560} op={1 - k} tf={`scale(${1 + 0.03 * Math.sin(t * 3)})`} />
      <Ob t={t} n="doughrock" a={at3} x={1460 + sh} y={930} w={540} from="none" op={k} />
      <Tx t={t} a={a + 0.3} y={150} txt="TOO MUCH FLOUR" size={80} font={SANS} weight={900} col="#ff6a55" />
      <Tx t={t} a={a + 0.8} y={270} txt="day 1 · soft" size={60} font={HAND} op={1 - k} />
      <Tx t={t} a={at3 + 0.4} y={270} txt="day 3 · a rock" size={70} font={HAND} col="#ffd0c4" />
    </Stage>
  );
};

// 20 · LA HELADERA ABIERTA: se abre la puerta en perspectiva, se prende la luz y el bol baja al estante de abajo; la puerta queda tachada
export const FridgeMap: React.FC<{ t: number; a: number; out: number; door: number; shelf: number }> = ({ t, a, out, door, shelf }) => {
  const op = ei(t, a + 0.2, a + 1.1), lt = e(t, a + 0.7, a + 1.0), kb = ei(t, shelf, shelf + 1.1);
  return (
    <Stage t={t} a={a} out={out}>
      <div style={{ position: "absolute", left: 1180, top: 90, width: 520, height: 900, transform: `translateY(${(1 - sp(t, a)) * 600}px)`, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: `linear-gradient(180deg, rgba(255,250,235,${0.7 + 0.3 * lt}), rgba(225,222,210,${0.8}))`, boxShadow: "inset 0 0 60px rgba(0,0,0,.25), 0 40px 60px rgba(0,0,0,.5)", border: "14px solid #e9e4d8" }} />
        <div style={{ position: "absolute", left: "40%", top: 18, width: 100, height: 30, borderRadius: 15, background: "#fff", boxShadow: `0 0 ${80 * lt}px ${30 * lt}px rgba(255,240,190,.9)` }} />
        {[300, 560].map((y) => <div key={y} style={{ position: "absolute", left: 14, right: 14, top: y, height: 12, background: "linear-gradient(180deg,rgba(255,255,255,.9),rgba(160,170,180,.6))" }} />)}
        <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 900, borderRadius: 26, background: "linear-gradient(90deg,#f4f0e6,#dcd6c8)", border: "4px solid #cfc8b8", transformOrigin: "100% 50%", transform: `rotateY(${op * 105}deg)`, boxShadow: "0 30px 50px rgba(0,0,0,.4)" }}>
          <div style={{ position: "absolute", left: 30, top: 380, width: 22, height: 160, borderRadius: 11, background: "#b9b2a2" }} />
        </div>
      </div>
      <Ob t={t} n="bowllid" a={a + 1.2} x={1440} y={lerp(380, 890, kb)} w={330} from="none" op={e(t, a + 1.2, a + 1.5)} z={2} />
      <div style={{ position: "absolute", left: 1610, top: 300, opacity: e(t, door, door + 0.2) }}>
        <Tx t={t} a={door} x={70} y={0} w={240} txt="DOOR" size={56} font={SANS} weight={900} />
        <Stroke t={t} a={door + 0.3} d="M-20 10 L170 80 M170 10 L-20 80" sw={14} len={420} dur={0.4} />
      </div>
      <Tx t={t} a={shelf + 1} x={1440} y={20} w={760} txt="BOTTOM SHELF · IN THE BACK" size={44} font={SANS} weight={900} col="#7fe08f" />
    </Stage>
  );
};

// 21 · EL PUÑETAZO: la masa crecida en el bol, baja el puño, se desinfla con un suspiro de harina y queda el hueco
export const PunchDown: React.FC<{ t: number; a: number; out: number; hit: number }> = ({ t, a, out, hit }) => {
  const kf = ei(t, hit - 0.45, hit), kd = cl((t - hit) * 4);
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="bowldough" a={a} x={1460} y={990} w={580} op={1 - kd} tf={`scale(${1 + 0.04 * ei(t, a, hit)})`} />
      <Ob t={t} n="doughflat" a={hit} x={1460} y={990} w={580} from="none" op={kd} tf={`scale(${1 + sq(t, hit, 0.12)},${1 - sq(t, hit, 0.12)})`} />
      {t > hit - 0.6 && <Ob t={t} n="fist" a={hit - 0.6} x={1470} y={lerp(380, 760, kf) - (t > hit ? ei(t, hit + 0.4, hit + 1) * 420 : 0)} w={300} from="none" sh={0} z={3} />}
      <Puff t={t} a={hit} x={1460} y={720} n={22} spread={260} up={60} dur={1.2} size={60} />
      <Tx t={t} a={hit + 0.2} x={1720} y={300} w={360} txt="pfff" size={110} font={HAND} col={C.goldL} rot={-8} />
      <Tx t={t} a={a + 0.5} y={110} txt="it sighs · it calms down" size={56} font={HAND} />
    </Stage>
  );
};

// 22 · LA CAJA REGISTRADORA DE 1962: el ticket va saliendo de la caja renglón por renglón, grande, hasta el 98¢ sellado y 4¢ el pan
export const Receipt62: React.FC<{ t: number; out: number; sumAt: number; ovenAt: number; totAt: number; perAt: number; rows: { at: number; item: string; c: number }[] }> = ({ t, out, sumAt, ovenAt, totAt, perAt, rows }) => {
  type Ln = { i: string; c: string; tot: boolean; at: number };
  const a = rows[0].at - 1;
  const L: Ln[] = [...rows.filter((r) => t >= r.at).map((r) => ({ i: r.item.split(",")[0], c: `.${String(r.c).padStart(2, "0")}`, tot: false, at: r.at })),
    ...(t >= sumAt ? [{ i: "SUBTOTAL", c: ".83", tot: false, at: sumAt }] : []), ...(t >= ovenAt ? [{ i: "OVEN", c: ".15", tot: false, at: ovenAt }] : []), ...(t >= totAt ? [{ i: "TOTAL", c: ".98", tot: true, at: totAt }] : [])].sort((p, q) => p.at - q.at);
  const V = L.slice(-7), last = L.length ? L[L.length - 1] : null, lastAt = last ? last.at : a + 1;
  const feed = ei(t, lastAt, lastAt + 0.45), len = 150 + 66 * Math.max(0, V.length - 1 + feed);
  return (
    <Stage t={t} a={a} out={out}>
      <div style={{ position: "absolute", left: 1060, top: 690 - len, width: 520, height: len + 40, background: "linear-gradient(180deg,#f8edd2,#efdcb0)", boxShadow: "0 20px 40px rgba(0,0,0,.45)", padding: "24px 30px", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 42, color: "#3e2e18", lineHeight: "66px", overflow: "hidden", clipPath: "polygon(0 18px,5% 0,10% 18px,15% 0,20% 18px,25% 0,30% 18px,35% 0,40% 18px,45% 0,50% 18px,55% 0,60% 18px,65% 0,70% 18px,75% 0,80% 18px,85% 0,90% 18px,95% 0,100% 18px,100% 100%,0 100%)" }}>
        <div style={{ textAlign: "center", fontSize: 30, lineHeight: "60px" }}>MAIN ST. · 1962</div>
        {V.map((l, k) => <div key={l.i + k} style={{ display: "flex", justifyContent: "space-between", color: l.tot ? "#b02018" : undefined, fontSize: l.tot ? 50 : 42 }}><span>{l.i}</span><span>{l.c}</span></div>)}
      </div>
      <Ob t={t} n="register" a={a} x={1320} y={1070} w={420} from="up" z={3} />
      {last && !last.tot && <Tx key={last.i} t={t} a={lastAt} x={1760} y={560} w={300} txt={last.c.replace(".", "").replace(/^0/, "") + "¢"} size={96} font={SANS} weight={900} col={C.goldL} />}
      <Tx t={t} a={totAt + 0.2} x={1750} y={140} w={300} txt="98¢" size={140} font={SANS} weight={900} col="#ff5b4a" rot={-10} />
      {t >= perAt && <Ob t={t} n="coin" a={perAt} x={1750} y={560} w={150} from="pop" />}
      <Tx t={t} a={perAt + 0.2} x={1750} y={590} w={320} txt="4¢ A ROLL" size={70} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 23 · LA TORRE DE MONEDAS DE HOY: cada ingrediente de hoy suma monedas que caen con rebote a una pila que crece; $5.16 y 21¢ el pan
export const CoinStack: React.FC<{ t: number; out: number; totAt: number; perAt: number; rows: { at: number; item: string; c: number }[] }> = ({ t, out, totAt, perAt, rows }) => {
  const a = rows[0].at - 1; let acc = 0; const coins: { at: number }[] = [];
  rows.forEach((r) => { const n = Math.max(1, Math.round(r.c / 12)); for (let i = 0; i < n; i++) coins.push({ at: r.at + i * 0.12 }); acc += r.c; });
  const cur = rows.filter((r) => t >= r.at), last = cur[cur.length - 1], sum = cur.reduce((s, r) => s + r.c, 0);
  return (
    <Stage t={t} a={a} out={out}>
      {coins.map((c, i) => t >= c.at && <Ob key={i} t={t} n="quarter" a={c.at} x={1300 + (i % 2) * 6 - ((i * 7) % 5)} y={1000 - i * 17} w={200} sh={i === 0 ? 1 : 0} fl="drop-shadow(0 4px 3px rgba(0,0,0,.5))" tf="scaleY(.5)" />)}
      {last && <Tx t={t} a={last.at} x={1680} y={330} w={420} txt={last.item.split(",")[0]} size={58} font={SANS} weight={900} />}
      {last && <Tx t={t} a={last.at + 0.1} x={1680} y={410} w={420} txt={last.c < 100 ? `${last.c}¢` : `$${(last.c / 100).toFixed(2)}`} size={92} font={SANS} weight={900} col={C.goldL} />}
      <Tx t={t} a={a + 0.3} x={1680} y={120} w={420} txt={`$${(Math.min(sum, 516) / 100).toFixed(2)}`} size={t >= totAt ? 130 : 84} font={SANS} weight={900} col={t >= totAt ? "#ff5b4a" : C.cream} />
      <Tx t={t} a={perAt} x={1680} y={620} w={420} txt="21¢ A ROLL" size={72} font={SANS} weight={900} col="#7fe08f" />
      <Tx t={t} a={a + 0.4} x={1680} y={60} w={420} txt="TODAY" size={42} font={SANS} weight={800} col={C.goldL} ls={4} />
    </Stage>
  );
};

// 24 · TRES ETIQUETAS EN EL HILO: la de la panadería 29¢, la de la bolsa 40¢ y la tuya 21¢, colgadas de a una, la tuya en dorado y más grande
export const PerRollTags: React.FC<{ t: number; a: number; b: number; c: number; out: number; s?: number }> = ({ t, a, b, c, out, s = a - 1 }) => {
  const T = [{ at: a, l: "BAKERY", v: "29¢", col: C.ink, w: 230 }, { at: b, l: "THE BAG", v: "40¢", col: "#b02018", w: 230 }, { at: c, l: "YOURS", v: "21¢", col: "#1f6a35", w: 300 }];
  return (
    <Stage t={t} a={s} out={out}>
      <Ob t={t} n="bag12" a={s} x={1250} y={1040} w={300} op={1 - e(t, a - 0.5, a)} />
      <div style={{ position: "absolute", left: 1040, top: 140, width: 840, height: 5, background: "linear-gradient(90deg,#8a6a40,#d8b780,#8a6a40)", opacity: e(t, s, s + 0.4) }} />
      {T.map((p, i) => { if (t < p.at) return null; const sw = 20 * Math.exp(-2.2 * (t - p.at)) * Math.cos(6.5 * (t - p.at));
        return <div key={i} style={{ position: "absolute", left: 1100 + i * 260 - (p.w - 230) / 2, top: 142, width: p.w, transformOrigin: "50% 0", transform: `rotate(${sw.toFixed(2)}deg) translateY(${(1 - cl(sp(t, p.at))) * -260}px)` }}>
          <Img src={O("tagstring")} style={{ width: "100%", display: "block", filter: `drop-shadow(0 12px 14px rgba(0,0,0,.5))${i === 2 ? " sepia(.6) saturate(2.4) hue-rotate(5deg)" : ""}` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "34%", textAlign: "center", fontFamily: SANS, fontWeight: 900, color: p.col, lineHeight: 1 }}><div style={{ fontSize: i === 2 ? 34 : 28 }}>{p.l}</div><div style={{ fontSize: i === 2 ? 104 : 80 }}>{p.v}</div></div>
        </div>; })}
      <Tx t={t} a={c + 0.6} y={700} txt="about half" size={80} font={HAND} col={C.goldL} />
    </Stage>
  );
};

// 25 · LA LEVADURA DE MÁS: caen tres sobres, el tercero sale volando tachado, vuelven 8 centavos rodando y aparece el chicle
export const YeastRefund: React.FC<{ t: number; a: number; strike: number; back: number; gum: number; out: number }> = ({ t, a, strike, back, gum, out }) => {
  const kf = ei(t, strike + 0.5, strike + 1.3);
  return (
    <Stage t={t} a={a} out={out}>
      {[0, 1, 2].map((i) => <Ob key={i} t={t} n="yeastpk" a={a + 0.3 + i * 0.4} x={1170 + i * 260 + (i === 2 ? kf * 400 : 0)} y={720 - (i === 2 ? kf * 500 : 0)} w={290} r={(i - 1) * 6 + (i === 2 ? kf * 120 : 0)} op={i === 2 ? 1 - kf : 1} />)}
      <Stroke t={t} a={strike} d="M1570 520 L1780 760 M1780 520 L1570 760" sw={18} len={700} dur={0.4} />
      <Tx t={t} a={a + 0.8} y={110} txt="3 PACKETS?" size={84} font={SANS} weight={900} />
      <Tx t={t} a={strike + 0.3} y={220} txt="I only used 2" size={64} font={HAND} col="#ff9a8a" />
      {Array.from({ length: 8 }, (_, i) => <Ob key={i} t={t} n="coin" a={back + i * 0.12} x={1130 + (i % 4) * 100} y={960 - Math.floor(i / 4) * 40} w={95} from="right" sh={0.6} />)}
      <Tx t={t} a={back + 0.6} x={1290} y={800} w={500} txt="8¢ BACK" size={70} font={SANS} weight={900} col={C.goldL} />
      <Ob t={t} n="gum" a={gum} x={1760} y={980} w={220} from="pop" r={-12} />
      <Tx t={t} a={gum + 0.3} x={1740} y={760} w={300} txt="+ gum" size={64} font={HAND} />
    </Stage>
  );
};

// 26 · LA CINTA DEL DÍA: una bolita de masa viaja por un riel y en cada estación se transforma (pellizco, forma, crece, horno, manteca)
export const DailyRail: React.FC<{ t: number; out: number; marks: number[] }> = ({ t, out, marks }) => {
  const a = marks[0] - 1, L = ["PINCH OFF", "SHAPE IT COLD", "LET IT RISE", "375°F", "BRUSH WITH BUTTER"];
  const st = marks.reduce((c, m, i) => (t >= m ? i : c), -1), xs = [1110, 1290, 1460, 1630, 1800];
  const pos = st < 0 ? xs[0] : lerp(xs[Math.max(0, st - 1)], xs[st], ei(t, marks[st], marks[st] + 0.8));
  const grow = st >= 2 ? 1 + 0.45 * ei(t, marks[2], marks[2] + 2) : 1, baked = st >= 3 ? ei(t, marks[3], marks[3] + 1.5) : 0, shine = st >= 4 ? e(t, marks[4], marks[4] + 0.8) : 0;
  return (
    <Stage t={t} a={a} out={out}>
      <div style={{ position: "absolute", left: 1050, top: 800, width: 820, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#d8d4cc,#8a857c)", boxShadow: "0 16px 24px rgba(0,0,0,.45)", opacity: e(t, a, a + 0.5) }} />
      {xs.map((x, i) => <div key={i} style={{ position: "absolute", left: x - 18, top: 795, width: 36, height: 36, borderRadius: "50%", background: i <= st ? C.gold : "#6a645a", boxShadow: i === st ? `0 0 30px ${C.gold}` : "none", opacity: e(t, a + i * 0.1, a + 0.5 + i * 0.1) }} />)}
      {st >= 3 && <div style={{ position: "absolute", left: pos - 160, top: 420, width: 320, height: 360, borderRadius: 30, background: "radial-gradient(closest-side, rgba(255,140,40,.55), rgba(255,100,20,0))", opacity: baked * (1 - shine * 0.6) }} />}
      <Ob t={t} n={baked > 0.5 ? "roll_pan" : "ball"} a={a + 0.2} x={pos} y={790} w={230 * grow} from={st < 0 ? "drop" : "none"} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(${1 + 0.25 * shine})`} />
      {st >= 0 && <Tx t={t} a={marks[st]} y={190} txt={L[st]} size={88} font={SANS} weight={900} col={st === 3 ? "#ffb35c" : C.cream} />}
      {st >= 0 && <Tx t={t} a={marks[st] + 0.1} y={110} txt={`${st + 1} / 5`} size={50} font={SANS} weight={800} col={C.goldL} />}
    </Stage>
  );
};

// 27 · LA ASADERA 4×6: caen las 24 bolitas en la asadera en perspectiva y, al crecer, se tocan y se vuelven pancitos dorados
export const PanGrid: React.FC<{ t: number; a: number; out: number; rise: number }> = ({ t, a, out, rise }) => {
  const kr = ei(t, rise, rise + 2);
  return (
    <Stage t={t} a={a} out={out}>
      <div style={{ position: "absolute", left: 1060, top: 400, width: 800, height: 560, transform: `perspective(1400px) rotateX(38deg) translateY(${(1 - sp(t, a)) * 500}px)`, transformOrigin: "50% 100%" }}>
        <Img src={O("pan913")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill", filter: "drop-shadow(0 30px 30px rgba(0,0,0,.5))" }} />
        {Array.from({ length: 24 }, (_, i) => { const r = Math.floor(i / 6), c = i % 6, at = a + 0.6 + i * 0.08; if (t < at) return null; const k = sp(t, at, 1.4);
          return <Img key={i} src={O(kr > 0.5 ? "roll_pan" : "ball")} style={{ position: "absolute", left: 95 + c * 105 - 45 * kr, top: 70 + r * 108 - 40 * kr - (1 - cl(k)) * 300, width: 92 + 90 * kr, opacity: cl((t - at) * 8), filter: "drop-shadow(0 6px 5px rgba(0,0,0,.45))" }} />; })}
      </div>
      <Tx t={t} a={a + 1.2} y={130} txt="4 × 6 = 24" size={100} font={SANS} weight={900} col={C.goldL} />
      <Tx t={t} a={rise + 1} y={250} txt="the gaps are gone" size={64} font={HAND} />
    </Stage>
  );
};

// 28 · LA TORRE DE TIRAS: caen seis láminas de masa con manteca brillante, la pila se para de canto, crece en el horno y el pancito se abre en abanico
export const StripTower: React.FC<{ t: number; a: number; out: number; fan: number; mu: number }> = ({ t, a, out, fan, mu }) => {
  // seis láminas de masa con manteca brillante caen de a una; al «muffin» la pila se para de canto; crece en el horno
  // y al «fan» el pancito de hojaldre real se abre en abanico: seis hojas que se separan
  const X = 1440, Y = 820, Wd = 540, kSt = sp(t, mu - 0.1, 0.9), kRise = ei(t, mu + 1.2, fan - 0.8), kFan = cl(sp(t, fan, 0.8));
  const slab = (i: number) => {
    const at = a + 0.05 + i * 0.35, k = sp(t, at, 1.4);
    if (t < at - 0.02) return null;
    return (
      <div key={i} style={{ position: "absolute", left: -Wd / 2, top: -(i + 1) * 58, width: Wd, height: 58, opacity: cl((t - at) * 6), transform: `translateY(${((1 - k) * -560).toFixed(1)}px) scaleY(${(1 - sq(t, at + 0.3, 0.25)).toFixed(3)})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 14, borderRadius: "10px 10px 2px 2px", background: "linear-gradient(180deg,#fff6df,#f3dfb4)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 14, height: 42, borderRadius: "2px 2px 10px 10px", background: "linear-gradient(180deg,#e8cd98,#c9a066)", boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} />
        {i > 0 && <div style={{ position: "absolute", left: 8, right: 8, top: 52, height: 9, borderRadius: 4, background: "linear-gradient(90deg,#f2c54a,#fff1a6 50%,#efbf3f)", boxShadow: "0 0 12px rgba(255,214,90,.95)" }} />}
      </div>
    );
  };
  const RW = 520, RH = RW * (AR.roll_flake ?? 0.75);
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      <div style={{ position: "absolute", left: X, top: Y, opacity: 1 - ei(t, mu + 0.9, mu + 1.6), transform: `rotate(${(-90 * cl(kSt)).toFixed(2)}deg) scale(${(1 - 0.35 * cl(kSt)).toFixed(3)})`, transformOrigin: "0 -120px" }}>{Array.from({ length: 6 }, (_, i) => slab(i))}</div>
      {t > mu + 0.9 && (
        <div style={{ position: "absolute", left: X - RW / 2, top: Y - RH, width: RW, height: RH, opacity: ei(t, mu + 0.9, mu + 1.6), transform: `scale(${(0.62 + 0.38 * kRise).toFixed(3)})`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", left: "6%", right: "6%", bottom: -RW * 0.03, height: RW * 0.08, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.6), rgba(0,0,0,0))" }} />
          {Array.from({ length: 6 }, (_, i) => { const c = i - 2.5, l = (i * 100) / 6, r = 100 - ((i + 1) * 100) / 6;
            return <Img key={i} src={O("roll_flake")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", clipPath: `inset(0 ${r.toFixed(2)}% 0 ${l.toFixed(2)}%)`, transform: `translateX(${(c * 26 * kFan).toFixed(1)}px) rotate(${(c * 7 * kFan).toFixed(2)}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(0 10px 12px rgba(0,0,0,.45))" }} />; })}
        </div>
      )}
      <Puff t={t} a={fan + 0.05} x={X} y={Y - RH * 0.8} n={16} spread={220} up={160} dur={1.3} size={44} />
    </Stage>
  );
};

// 29 · LA SOGA Y LA REGLA: la soga de masa se estira sobre la regla hasta la marca de 8 pulgadas y aparece el nudo
export const RopeRuler: React.FC<{ t: number; a: number; out: number; knot: number }> = ({ t, a, out, knot }) => {
  // la regla cae; la soga de masa se estira encima hasta el 8 (marca dorada); al «knot» la soga se enrolla en el nudo real
  const RW = 800, RL = 1040, TOP = 860 - RW * (AR.ruler ?? 0.308), rk = ei(t, a + 0.7, a + 1.9), kK = ei(t, knot - 0.3, knot + 0.3);
  const x0 = RL + RW * 0.05, x8 = RL + RW * (0.05 + 0.9 * 8 / 12);
  return (
    <Stage t={t} a={a} out={out} veil={0.7}>
      <Ob t={t} n="ruler" a={a} x={RL + RW / 2} y={860} w={RW / 1.3} />
      {t > a + 0.6 && <div style={{ position: "absolute", left: x0, top: TOP - 46, width: x8 - x0, height: 96, clipPath: `inset(0 ${((1 - rk) * 100).toFixed(2)}% 0 0)`, opacity: 1 - kK, transform: `scale(${(1 - 0.5 * kK).toFixed(3)})`, transformOrigin: "50% 50%" }}>
        <Img src={O("rope")} style={{ width: "100%", height: "100%", objectFit: "fill", filter: "drop-shadow(0 12px 8px rgba(0,0,0,.5))" }} /></div>}
      <Stroke t={t} a={a + 1.9} d={`M ${x8} ${TOP - 70} L ${x8} ${TOP + 110}`} col={C.gold} sw={10} dur={0.3} len={200} />
      <Tx t={t} a={a + 2.1} x={x8} y={TOP - 190} w={300} txt="8 IN" size={100} font={SANS} weight={900} col={C.goldL} op={1 - kK} />
      <Ob t={t} n="roll_knot" a={knot} x={1440} y={TOP + 10} w={300} from="pop" tf={`rotate(${((1 - cl(sp(t, knot))) * -220).toFixed(1)}deg)`} origin="50% 60%" />
      <Puff t={t} a={knot + 0.1} x={1440} y={TOP - 140} n={16} spread={200} up={100} />
    </Stage>
  );
};

// 30 · LA PIZZA DE DOCE: el disco de masa cae, seis cortes lo parten en 12 cuñas que se separan y la de arriba se enrolla en medialuna
export const TwelveWedges: React.FC<{ t: number; a: number; out: number; roll: number }> = ({ t, a, out }) => {
  // el disco de masa cae; seis cortes lo parten en 12 cuñas que se separan con peso; la de arriba se enrolla en medialuna
  const cx = 1450, cy = 560, R = 300, k0 = sp(t, a), kCut = (i: number) => ei(t, a + 1.1 + i * 0.22, a + 1.35 + i * 0.22), kH = ei(t, a + 5.0, a + 5.6);
  const P = (d: number) => `${(50 + 72 * Math.cos(d * Math.PI / 180)).toFixed(2)}% ${(50 + 72 * Math.sin(d * Math.PI / 180)).toFixed(2)}%`;
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      <div style={{ position: "absolute", left: cx - R * 0.9, top: cy + R * 0.92, width: R * 1.8, height: R * 0.2, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.55), rgba(0,0,0,0))", opacity: cl(k0) }} />
      <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, transform: `translateY(${((1 - k0) * -620).toFixed(1)}px) perspective(1400px) rotateX(38deg)` }}>
        {Array.from({ length: 12 }, (_, i) => { const d0 = i * 30 - 90, dm = (d0 + 15) * Math.PI / 180, k = cl(sp(t, a + 3.0 + i * 0.07, 0.9)), top = i === 0 || i === 11;
          return <Img key={i} src={O("circle")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", clipPath: `polygon(50% 50%, ${P(d0)}, ${P(d0 + 15)}, ${P(d0 + 30)})`, transform: `translate(${(Math.cos(dm) * 46 * k).toFixed(1)}px, ${(Math.sin(dm) * 46 * k).toFixed(1)}px)`, opacity: top ? 1 - kH : 1, filter: "drop-shadow(0 8px 6px rgba(0,0,0,.4))" }} />; })}
        <svg width={2 * R} height={2 * R} style={{ position: "absolute", inset: 0, opacity: 1 - ei(t, a + 3.0, a + 3.3) }}>
          {Array.from({ length: 6 }, (_, i) => { const d = (i * 30 - 90) * Math.PI / 180, k = kCut(i);
            return k > 0 ? <line key={i} x1={R - Math.cos(d) * R * 0.98 * k} y1={R - Math.sin(d) * R * 0.98 * k} x2={R + Math.cos(d) * R * 0.98 * k} y2={R + Math.sin(d) * R * 0.98 * k} stroke="rgba(120,80,40,.85)" strokeWidth={5} strokeLinecap="round" /> : null; })}
        </svg>
      </div>
      <Ob t={t} n="roll_horn" a={a + 5.3} x={cx} y={cy - R * 0.55} w={300} from="pop" tf={`rotate(${((1 - cl(sp(t, a + 5.3))) * 260).toFixed(1)}deg)`} origin="50% 60%" />
      <Puff t={t} a={a + 5.35} x={cx} y={cy - R * 0.95} n={14} spread={170} up={90} />
    </Stage>
  );
};

// 31 · MIEL Y MANTECA: la manteca cae en la ollita y se derrite, la miel chorrea del palito y la brocha se moja y pinta
export const HoneyButter: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => {
  const km = ei(t, a + 0.8, a + 3), kd = ei(t, b + 0.2, b + 1.6);
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="skillet" a={a} x={1420} y={980} w={600} from="left" />
      <Ob t={t} n="butter" a={a + 0.4} x={1420} y={lerp(800, 860, km)} w={260} op={1 - km} tf={`scaleY(${1 - 0.6 * km})`} z={2} />
      <Ob t={t} n="honeydip" a={b} x={1560} y={520} w={300} from="right" r={-20} sh={0} z={3} />
      {t > b + 0.2 && <div style={{ position: "absolute", left: 1545, top: 520, width: 14, height: 300 * kd, borderRadius: 7, background: "linear-gradient(180deg,#f5b42a,#d88a10)", boxShadow: "0 0 10px rgba(255,190,60,.7)", opacity: 1 - e(t, b + 3, b + 3.5) }} />}
      <Tx t={t} a={a + 0.5} x={1300} y={110} w={600} txt="2 TBSP BUTTER" size={68} font={SANS} weight={900} />
      <Tx t={t} a={b} x={1300} y={200} w={600} txt="+ 1 TBSP HONEY" size={68} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 32 · LA FICHA DE LA FERIA: la receta manuscrita de Mrs. Lund cae de costado y le atan una etiqueta de 25¢ con hilo
export const EstateSale: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => (
  <Stage t={t} a={a} out={out}>
    <Ob t={t} n="recipecard" a={a} x={1420} y={900} w={720} r={-6}>
      <div style={{ position: "absolute", left: "10%", top: "22%", fontFamily: HAND, fontSize: 58, color: "#1d2a5a", lineHeight: 1.15 }}>Butterhorns<br /><span style={{ fontSize: 44 }}>— Mrs. Lund</span></div>
    </Ob>
    <Ob t={t} n="pricetag25" a={a + 0.9} x={1730} y={700} w={260} from="right" r={14} sh={0} z={3}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "38%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#b02018" }}>25¢</div>
    </Ob>
    <Tx t={t} a={a + 1.4} y={140} txt="ESTATE SALE" size={96} font={SANS} weight={900} col={C.goldL} />
  </Stage>
);

// 33 · LA CANASTA DE LA FERIA: el reloj corre de 9:54 a 11 mientras los pancitos salen de la canasta de a uno; vacía, GONE
export const BazaarClock: React.FC<{ t: number; a: number; out: number; gone: number }> = ({ t, a, out, gone }) => {
  // reloj de pared grande: las agujas corren de 9:54 a 11:00 mientras los bollos salen de la canasta de a uno; vacía = GONE de un sello
  const k = ei(t, a + 0.5, gone), hA = 297 + 33 * k, mA = 324 + 396 * k, kc = sp(t, a), CXc = 1230, CYc = 380, R = 215;
  const N = 7, BX = 1640, BY = 900, BW = 500;
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      <div style={{ position: "absolute", left: CXc - R, top: CYc - R, width: 2 * R, height: 2 * R, borderRadius: "50%", transform: `translateY(${((1 - kc) * -520).toFixed(1)}px) rotate(${((1 - kc) * -12).toFixed(2)}deg)`, background: "radial-gradient(circle at 45% 40%, #fffaf0, #efe4cc 70%, #d6c49e)", boxShadow: "0 0 0 16px #6b3f1d, 0 0 0 22px #3e220e, 0 26px 40px rgba(0,0,0,.6)" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: R - 4, top: 12, width: 8, height: i % 3 ? 18 : 34, borderRadius: 3, background: "#2b1a0e", transform: `rotate(${i * 30}deg)`, transformOrigin: `4px ${R - 12}px` }} />)}
        <div style={{ position: "absolute", left: R - 7, top: R - 105, width: 14, height: 110, borderRadius: 7, background: "#1d120a", transform: `rotate(${hA}deg)`, transformOrigin: "7px 105px" }} />
        <div style={{ position: "absolute", left: R - 4, top: R - 150, width: 8, height: 155, borderRadius: 4, background: "#1d120a", transform: `rotate(${mA}deg)`, transformOrigin: "4px 150px" }} />
        <div style={{ position: "absolute", left: R - 13, top: R - 13, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f6d58a,#8a5a1a)" }} />
      </div>
      {Array.from({ length: N }, (_, i) => { const lv = a + 1.0 + i * ((gone - a - 1.4) / N), u = ei(t, lv, lv + 0.7), col = i % 4, row = Math.floor(i / 4);
        return u < 1 ? <div key={i} style={{ position: "absolute", left: BX - 150 + col * 90 + row * 45, top: BY - 250 + row * 40 - u * 380, width: 120, opacity: cl((t - a - 0.4) * 4) * (1 - u), transform: `rotate(${(u * 40 * (i % 2 ? 1 : -1)).toFixed(1)}deg) translateX(${(u * 160).toFixed(0)}px)`, zIndex: 1 }}>
          <Img src={O("bun")} style={{ width: "100%", filter: "drop-shadow(0 6px 6px rgba(0,0,0,.45))" }} /></div> : null; })}
      <Ob t={t} n="basket" a={a + 0.2} x={BX} y={BY} w={BW / 1.3} z={2} />
      <Tx t={t} a={gone} x={1660} y={430} w={440} txt="GONE" size={150} font={SANS} weight={900} col="#ff6a4d" rot={-8} />
      <Puff t={t} a={gone + 0.05} x={1640} y={470} n={14} spread={200} up={60} col="rgba(240,210,160,.9)" />
    </Stage>
  );
};

// 34 · LA PALMA QUE APLASTA: bola de masa junto a una pelota de tenis del mismo tamaño; baja la palma y queda un disco de 3½ pulgadas
export const PressDisk: React.FC<{ t: number; a: number; out: number; press: number; tennis: number }> = ({ t, a, out, press, tennis }) => {
  // bola de masa junto a una pelota de tenis del mismo tamaño; la masa respira mientras leva; al «press» baja la palma,
  // la bola se aplasta en disco y aparece la regla con la medida
  const kP = ei(t, press - 0.7, press - 0.05), kU = ei(t, press + 0.5, press + 1.1), sqz = ei(t, press - 0.12, press + 0.1);
  const breath = 1 + 0.035 * Math.sin(2.2 * (t - a)) * (1 - sqz);
  const PW = 360, PH = PW * (AR.palm ?? 0.411);
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      <Ob t={t} n="doughsoft" a={a + 0.1} x={1330} y={800} w={230} op={1 - sqz} tf={`scale(${(breath * (1 + 0.5 * sqz)).toFixed(4)},${(breath * (1 - 0.65 * sqz)).toFixed(4)})`} />
      {t > a && <div style={{ position: "absolute", left: 1660 - 115 + (1 - cl(sp(t, a + 0.1))) * 600, top: 800 - 230, width: 230, height: 230, borderRadius: "50%", opacity: 1 - e(t, press - 1.0, press - 0.6), transform: `rotate(${((1 - cl(sp(t, a + 0.1))) * 340).toFixed(1)}deg)`, background: "radial-gradient(circle at 35% 30%, #f4ff8a, #cfe628 45%, #9fb515 80%, #7c8f0c)", boxShadow: "0 22px 26px rgba(0,0,0,.45), inset -14px -18px 30px rgba(0,0,0,.25)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -70, top: 20, width: 190, height: 190, borderRadius: "50%", border: "9px solid rgba(255,255,255,.92)" }} />
        <div style={{ position: "absolute", left: 110, top: 20, width: 190, height: 190, borderRadius: "50%", border: "9px solid rgba(255,255,255,.92)" }} /></div>}
      {t >= press - 0.1 && <div style={{ position: "absolute", left: 1330 - 260, top: 800 - 150, width: 520, transform: `scale(${(0.7 + 0.3 * cl(sp(t, press - 0.1, 1.4))).toFixed(3)}, ${(0.5 + 0.5 * cl(sp(t, press - 0.1, 1.4))).toFixed(3)})`, transformOrigin: "50% 100%", opacity: e(t, press - 0.1, press + 0.05) }}>
        <Img src={O("disk")} style={{ width: "100%", filter: "drop-shadow(0 14px 14px rgba(0,0,0,.5))" }} /></div>}
      {t > press - 0.75 && kU < 1 && <div style={{ position: "absolute", left: 1330 - PW / 2 + 20, top: lerp(-PH - 40, 800 - 200 - PH * 0.6, kP) - kU * 700, width: PW, transform: `rotate(${(-8 + 8 * kP).toFixed(1)}deg)` }}>
        <Img src={O("palm")} style={{ width: "100%", filter: "drop-shadow(0 26px 22px rgba(0,0,0,.55))" }} /></div>}
      <Ob t={t} n="ruler" a={press + 0.7} x={1440} y={930} w={600 / 1.3} from="right" />
      <Stroke t={t} a={press + 1.2} d="M 1080 640 L 1080 600 L 1580 600 L 1580 640" col={C.gold} sw={9} dur={0.45} len={700} />
      <Tx t={t} a={press + 1.5} x={1330} y={440} w={520} txt={<Half n="3" />} size={130} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 35 · EL HORNO APAGADO QUE LEUDA: adentro del horno se prende la lucecita, abajo una asadera de agua caliente con vapor, los pancitos crecen
export const ProofOven: React.FC<{ t: number; a: number; light: number; water: number; out: number }> = ({ t, a, light, water, out }) => {
  // adentro del horno apagado (paredes de enlozado con perspectiva): al «light» se prende la lamparita y baña el estante de luz
  // tibia; al «water» la asadera de agua caliente de abajo larga vapor; los pancitos se inflan al doble
  const L = 1030, T = 170, W = 850, H = 760, I = 120, kL = ei(t, light, light + 0.8), kR = ei(t, light + 0.6, out), kin = sp(t, a, 0.9);
  const wall = "linear-gradient(180deg,#3a3f45,#24282c)";
  return (
    <Stage t={t} a={a} out={out} veil={0.6}>
      <div style={{ position: "absolute", left: L, top: T, width: W, height: H, borderRadius: 26, overflow: "hidden", opacity: cl((t - a) * 4), transform: `scale(${(0.86 + 0.14 * cl(kin)).toFixed(4)})`, transformOrigin: "50% 60%", boxShadow: "0 0 0 22px #e9e3d6, 0 0 0 28px #b9b2a2, 0 40px 60px rgba(0,0,0,.65)", background: "#15181b" }}>
        <div style={{ position: "absolute", inset: 0, background: wall, clipPath: `polygon(0 0, ${I}px ${I}px, ${I}px ${H - I}px, 0 ${H}px)`, filter: "brightness(.8)" }} />
        <div style={{ position: "absolute", inset: 0, background: wall, clipPath: `polygon(${W}px 0, ${W - I}px ${I}px, ${W - I}px ${H - I}px, ${W}px ${H}px)`, filter: "brightness(.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,#2c3034,#1b1e21)", clipPath: `polygon(0 ${H}px, ${I}px ${H - I}px, ${W - I}px ${H - I}px, ${W}px ${H}px)` }} />
        <div style={{ position: "absolute", left: I, top: I, width: W - 2 * I, height: H - 2 * I, background: "linear-gradient(180deg,#2f3439,#202428)" }} />
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: I - 50 + i * 2, right: I - 50 + i * 2, top: 430 + i * 9, height: 4, background: "linear-gradient(90deg,#6c7176,#c9ced2,#6c7176)", opacity: 0.9 }} />)}
        <div style={{ position: "absolute", left: W / 2 - 28, top: I - 40, width: 56, height: 56, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, rgba(255,250,220,${0.25 + 0.75 * kL}), rgba(255,190,90,${0.2 + 0.7 * kL}) 60%, rgba(80,60,40,.6))`, boxShadow: `0 0 ${(80 * kL).toFixed(0)}px ${(30 * kL).toFixed(0)}px rgba(255,190,90,${0.7 * kL})` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 18%, rgba(255,196,110,${0.5 * kL}), rgba(255,170,80,${0.18 * kL}) 55%, rgba(0,0,0,0))`, mixBlendMode: "screen" }} />
        <div style={{ position: "absolute", left: W / 2 - 270, top: 430 - 270 * (AR.roll_pan ?? 0.8) + 30, width: 540, transform: `scale(${(1 + 0.18 * kR).toFixed(3)}, ${(1 + 0.45 * kR).toFixed(3)})`, transformOrigin: "50% 100%", filter: `brightness(${(0.55 + 0.5 * kL).toFixed(3)}) drop-shadow(0 12px 10px rgba(0,0,0,.6))` }}>
          <Img src={O("roll_pan")} style={{ width: "100%" }} /></div>
        <div style={{ position: "absolute", left: W / 2 - 200, top: H - I - 140, width: 400, opacity: e(t, water - 0.6, water), filter: `brightness(${(0.6 + 0.4 * kL).toFixed(3)})` }}>
          <Img src={O("pan_warm")} style={{ width: "100%", filter: "drop-shadow(0 8px 8px rgba(0,0,0,.6))" }} /></div>
        <Vapor t={t} a={water} b={out + 0.6} x={W / 2} y={H - I - 120} big={1.2} />
      </div>
    </Stage>
  );
};

// 36 · LA PRUEBA DEL HOYUELO: la sombra de un dedo aprieta dos bollos; el apurado vuelve enseguida, el listo guarda el hoyuelo y se ilumina
export const DimpleTest: React.FC<{ t: number; a: number; out: number; ok: number }> = ({ t, a, out, ok }) => {
  // dos bollos lado a lado bajo luz rasante: la sombra de un dedo baja sobre cada uno; el de la izquierda (apurado) vuelve enseguida
  // y no guarda la marca; el de la derecha (listo) se queda con el hoyuelo y se adelanta con luz tibia
  const p1 = a + 0.9, p2 = ok - 0.1;
  const finger = (x: number, at: number) => { const d = ei(t, at - 0.6, at), u = ei(t, at + 0.15, at + 0.7); return t > at - 0.6 && u < 1 ? <div style={{ position: "absolute", left: x - 58, top: lerp(-360, 590 - 300, d) - 520 * u, width: 116, height: 300, borderRadius: "58px 58px 52px 52px", background: "linear-gradient(90deg,#c98d6e,#efc2a2 42%,#e2ac8b 70%,#bf8366)", boxShadow: "0 24px 30px rgba(0,0,0,.45)", transform: "rotate(-6deg)", zIndex: 6 }}>
      <div style={{ position: "absolute", left: 26, bottom: 16, width: 64, height: 70, borderRadius: "32px 32px 26px 26px", background: "linear-gradient(180deg,#f8dccd,#f1c7b3)", boxShadow: "inset 0 -4px 6px rgba(160,90,70,.35)" }} /></div> : null; };
  const dent = (keep: boolean, at: number) => { const v = keep ? ei(t, at - 0.05, at + 0.15) : ei(t, at - 0.05, at + 0.1) * (1 - ei(t, at + 0.2, at + 0.5));
    return v > 0.01 ? <div style={{ position: "absolute", left: "38%", top: "14%", width: "24%", height: "16%", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 60%, rgba(120,80,40,.55), rgba(150,110,60,.25) 55%, rgba(255,255,255,0) 72%)", boxShadow: "inset 0 -6px 8px rgba(255,248,230,.6)", opacity: v }} /> : null; };
  const win = cl(sp(t, ok + 0.7, 0.8));
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      <Ob t={t} n="doughsoft" a={a + 0.1} x={1230} y={820} w={240} tf={`scale(${(1 + sq(t, p1 + 0.2, 0.12)).toFixed(4)},${(1 - sq(t, p1 + 0.2, 0.12)).toFixed(4)})`} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(${(1 - 0.35 * win).toFixed(3)})`}>{dent(false, p1)}</Ob>
      <Ob t={t} n="doughsoft" a={a + 0.5} x={1640} y={820} w={240} tf={`translateY(${(-40 * win).toFixed(1)}px) scale(${(1 + 0.1 * win).toFixed(3)})`} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) drop-shadow(0 0 ${(40 * win).toFixed(0)}px rgba(255,200,110,${(0.8 * win).toFixed(2)}))`}>{dent(true, p2)}</Ob>
      {finger(1230, p1)}
      <Stroke t={t} a={p1 + 0.9} d="M 1150 610 L 1310 770 M 1310 610 L 1150 770" col="#c3262a" sw={16} dur={0.35} len={500} />
      <Stroke t={t} a={p2 + 0.7} d="M 1560 690 L 1620 750 L 1740 600" col="#3f9b3a" sw={18} dur={0.35} len={300} />
      {finger(1640, p2)}
    </Stage>
  );
};

// 37 · LA CUENTA DE LA GENTE: 1½ pan por persona, después se llena una grilla de 60 pancitos y al final caen 2½ boles
export const CrowdMath: React.FC<{ t: number; a: number; b: number; c: number; out: number }> = ({ t, a, b, c, out }) => {
  const kb = ei(t, b, b + 1.8), n = Math.round(60 * kb), hideA = e(t, b - 0.3, b), hideB = e(t, c - 0.3, c);
  const half = (x: number) => `polygon(0 0, ${x}px 0, ${x}px 1080px, 0 1080px)`;
  return (
    <Stage t={t} a={a} out={out}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - hideA }}>
        <Ob t={t} n="roll_pan" a={a} x={1300} y={800} w={320} />
        <div style={{ position: "absolute", inset: 0, clipPath: half(1640) }}><Ob t={t} n="roll_pan" a={a + 0.5} x={1640} y={800} w={320} /></div>
        <Tx t={t} a={a + 0.5} y={150} txt={<span>1<Half /> PER PERSON</span>} size={92} font={SANS} weight={900} col={C.goldL} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: (1 - hideB) * e(t, b - 0.1, b + 0.2) }}>
        {Array.from({ length: n }, (_, i) => <Img key={i} src={O("roll_pan")} style={{ position: "absolute", left: 1070 + (i % 10) * 80, top: 330 + Math.floor(i / 10) * 70, width: 78, filter: "drop-shadow(0 4px 4px rgba(0,0,0,.45))" }} />)}
        <Tx t={t} a={b} y={150} txt="40 PEOPLE = 60 ROLLS" size={78} font={SANS} weight={900} />
      </div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", inset: 0, clipPath: i === 2 ? half(1700) : undefined }}><Ob t={t} n="bowldough" a={c + i * 0.3} x={1180 + i * 260} y={900} w={250} /></div>)}
      <Tx t={t} a={c + 0.4} y={150} txt={<span>2<Half /> BOWLS</span>} size={120} font={SANS} weight={900} col={C.goldL} />
      <Tx t={t} a={c + 1} y={950} txt="for 40 people" size={60} font={HAND} />
    </Stage>
  );
};

// 38 · LA BANDEJA AL FREEZER: la bandeja de bolitas se cubre de escarcha que crece, pasa a la bolsa de freezer y queda «1 MES»
export const FreezerSteps: React.FC<{ t: number; a: number; bag: number; month: number; out: number }> = ({ t, a, bag, month, out }) => {
  // bandeja dentro del freezer (luz fría desde arriba), escarcha que crece cristal a cristal, pasa a la bolsa, la bolsa se sella y el almanaque cae en «1 MONTH»
  const kf = ei(t, a + 0.8, bag - 0.4), kb = ei(t, bag - 0.3, bag + 0.3), seal = ei(t, bag + 0.9, bag + 1.5), km = sp(t, month);
  const FR = Array.from({ length: 40 }, (_, i) => ({ x: 1140 + ((i * 89) % 620), y: 760 + ((i * 47) % 150), s: 10 + (i % 5) * 6, d: (i % 9) * 0.1 }));
  return (
    <Stage t={t} a={a} out={out} veil={0.7}>
      <div style={{ position: "absolute", left: 1000, top: -40, width: 920, height: 1100, background: "radial-gradient(ellipse 50% 70% at 50% 0%, rgba(190,225,255,.55), rgba(150,200,255,.12) 60%, rgba(150,200,255,0))", opacity: e(t, a, a + 0.6) * (1 - kb) }} />
      <Ob t={t} n="tray" a={a + 0.3} x={1460} y={940} w={700} op={1 - kb} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.35)) saturate(${1 - 0.5 * kf}) brightness(${1 + 0.18 * kf})`} />
      {FR.map((f, i) => { const g = ei(t, a + 1 + f.d * 3 * (bag - a - 1.5) / 3, a + 1.6 + f.d * 3 * (bag - a - 1.5) / 3); return g > 0.01 ? <div key={i} style={{ position: "absolute", left: f.x, top: f.y, width: f.s, height: f.s, opacity: g * (1 - kb), transform: `scale(${g}) rotate(${i * 23}deg)` }}>
        <svg width={f.s} height={f.s} viewBox="-10 -10 20 20"><path d="M0 -9 L0 9 M-8 -4.5 L8 4.5 M-8 4.5 L8 -4.5" stroke="#f6fcff" strokeWidth={2.2} strokeLinecap="round" /></svg></div> : null; })}
      <Ob t={t} n="fbag" a={bag} x={1460} y={1000} w={560} from="up" />
      {t > bag + 0.9 && <div style={{ position: "absolute", left: 1190, top: 1000 - 560 * (AR.fbag ?? 1.1) + 40, width: 540 * seal, height: 14, borderRadius: 7, background: "linear-gradient(90deg,#2f6fd0,#7fb0ff)", boxShadow: "0 0 10px rgba(120,170,255,.8)" }} />}
      {t >= month && <div style={{ position: "absolute", left: 1640, top: 380, width: 220, transform: `translateY(${(1 - cl(km)) * -500}px) rotate(${6 + sq(t, month + 0.3, 0.6) * 20}deg)` }}><Img src={O("calpad")} style={{ width: "100%", filter: "drop-shadow(0 14px 14px rgba(0,0,0,.5))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "38%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#b02018", lineHeight: 0.95 }}>1<br /><span style={{ fontSize: 40 }}>MONTH</span></div></div>}
      <Tx t={t} a={a + 0.6} y={110} txt="FROZEN HARD · 2 HOURS" size={84} font={SANS} weight={900} col="#bfe4ff" op={1 - e(t, bag - 0.4, bag)} />
      <Tx t={t} a={bag + 0.3} y={110} txt="INTO A FREEZER BAG" size={84} font={SANS} weight={900} col="#bfe4ff" op={1 - e(t, month - 0.3, month)} />
      <Tx t={t} a={month + 0.2} y={110} txt="KEEPS A MONTH" size={104} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 39 · LA PIZARRA DE LA SEMANA: pizarra de tiza real; sólo los últimos 3 días, con letra grande, y el día nuevo entra subrayado
export const WeekBoard: React.FC<{ t: number; out: number; rows: { at: number; d: string; w: string }[] }> = ({ t, out, rows }) => {
  const a = rows[0].at - 0.8, sh = rows.filter((r) => t >= r.at), cur = sh.length - 1;
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="chalk" a={a} x={1460} y={1000} w={860}>
        <div style={{ position: "absolute", left: "11%", right: "11%", top: "14%", bottom: "14%", overflow: "hidden" }}>
          {sh.map((r, i) => { const pos = i - Math.max(0, cur - 2), k = ei(t, r.at, r.at + 0.5), sl = cur >= 3 && i <= cur ? ei(t, rows[cur].at, rows[cur].at + 0.5) : 1;
            if (pos < -1) return null; const yy = (pos + (cur >= 3 ? 1 - sl : 0)) * 33;
            return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${yy}%`, fontFamily: HAND, color: "#f4f1e8", opacity: k * (pos < 0 ? 1 - sl : 1) * (i === cur ? 1 : 0.6), textShadow: "0 0 2px rgba(255,255,255,.5)", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 70, color: i === cur ? "#ffe9a0" : "#f4f1e8" }}>{r.d}</span><span style={{ fontSize: 56 }}> · {r.w}</span>
              {i === cur && <svg width={400} height={20} style={{ position: "absolute", left: 0, top: 78 }}><path d="M5 10 Q 200 2, 395 12" stroke="#ffe9a0" strokeWidth={5} fill="none" strokeDasharray={420} strokeDashoffset={420 * (1 - ei(t, r.at + 0.3, r.at + 0.8))} /></svg>}
            </div>; })}
        </div>
      </Ob>
      <Tx t={t} a={a + 0.3} y={110} txt="MY WEEK" size={90} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 40 · LO QUE HAZEL NUNCA HIZO: un objeto por renglón, grande, que cae y lo tacha una pincelada roja dibujada; quedan en columna chiquitos
export const NeverCard: React.FC<{ t: number; out: number; notyet: number; rows: { at: number; txt: string }[] }> = ({ t, out, notyet, rows }) => {
  const N = ["towel", "bowllid", "flour", "calpad", "ball"], a = rows[0].at - 0.6, cur = rows.reduce((c, r, i) => (t >= r.at ? i : c), -1);
  return (
    <Stage t={t} a={a} out={out}>
      <Tx t={t} a={a} y={70} txt="HAZEL NEVER…" size={80} font={SANS} weight={900} col={C.goldL} />
      {rows.map((r, i) => { if (t < r.at) return null; const done = i < cur, k = done ? ei(t, rows[i + 1].at, rows[i + 1].at + 0.6) : 0;
        const x = lerp(1400, 1800, k), y = lerp(800, 290 + i * 150, k), w = lerp(420, 120, k);
        return <React.Fragment key={i}>
          <Ob t={t} n={N[i]} a={r.at} x={x} y={y} w={w} from={done ? "none" : "drop"} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) grayscale(${0.5 * k})`} />
          <Stroke t={t} a={r.at + 0.7} d={`M${x - w * 0.55} ${y - w * 0.55} L${x + w * 0.55} ${y - w * 0.05}`} sw={lerp(18, 7, k)} len={900} dur={0.35} />
          <Tx t={t} a={r.at + 0.2} x={1400} y={860} w={720} txt={r.txt} size={54} font={HAND} op={done ? 1 - k * 3 : 1} />
        </React.Fragment>; })}
      <Tx t={t} a={notyet} x={1400} y={190} w={760} txt="not yet, honey" size={96} font={HAND} col={C.goldL} rot={-5} />
    </Stage>
  );
};

// 41 · EL SOBRE DE PREGUNTAS: se abre la solapa del sobre y sale una carta por pregunta; la pregunta a mano y la respuesta grande
export const AskMail: React.FC<{ t: number; out: number; rows: { at: number; q: string; ans: string }[] }> = ({ t, out, rows }) => {
  const a = rows[0].at - 1, cur = rows.reduce((c, r, i) => (t >= r.at ? i : c), -1), fl = ei(t, a + 0.4, a + 1);
  return (
    <Stage t={t} a={a} out={out}>
      <Ob t={t} n="envelope" a={a} x={1460} y={1010} w={700} z={4}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "55%", clipPath: "polygon(0 0,100% 0,50% 100%)", background: "linear-gradient(180deg,#efe2c6,#d9c7a0)", transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${fl * 170}deg)`, opacity: fl < 0.5 ? 1 : 0.0, boxShadow: "0 4px 6px rgba(0,0,0,.2)" }} />
      </Ob>
      {rows.map((r, i) => { if (t < r.at - 0.1 || i < cur - 1) return null; const k = sp(t, r.at - 0.1, 1.1), gone = i < cur ? ei(t, rows[cur].at - 0.1, rows[cur].at + 0.5) : 0;
        return <div key={i} style={{ position: "absolute", left: 1130, top: 160, width: 660, height: 560, background: "linear-gradient(180deg,#fffaf0,#f3e5cb)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", borderRadius: 6, padding: "40px 46px", zIndex: 3 - (i < cur ? 1 : 0), transform: `translate(${gone * 700}px, ${(1 - cl(k)) * 520 - gone * 120}px) rotate(${(i % 2 ? 2 : -2) + gone * 25}deg)`, opacity: 1 - gone }}>
          <div style={{ fontFamily: HAND, fontSize: 64, color: "#1d2a5a", lineHeight: 1.1 }}>{r.q}</div>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 54, color: C.wine, lineHeight: 1.1, marginTop: 40, opacity: e(t, r.at + 1.2, r.at + 1.6) }}>{r.ans}</div>
        </div>; })}
      <Tx t={t} a={a + 0.3} x={1460} y={50} w={700} txt="YOU ASKED" size={70} font={SANS} weight={900} col={C.goldL} />
    </Stage>
  );
};

// 42 · LA BALANZA DE DOS ÉPOCAS: balanza de bronce con 98¢ en monedas de un lado y billetes de hoy del otro; el brazo se inclina con peso
export const KitchenScale: React.FC<{ t: number; a: number; b: number; c: number; out: number }> = ({ t, a, b, c, out }) => {
  // balanza de bronce centrada: 98¢ en monedas a la izquierda; al decir «today» cae el billete de $5 y el brazo se va con resorte para ese lado
  const CXs = 1420, ARM = 250, k0 = cl(sp(t, a)), tilt = t >= b ? 14 * (1 - Math.exp(-4 * (t - b)) * Math.cos(9 * (t - b))) : 0;
  const pan = (side: number) => ({ x: CXs + side * ARM * Math.cos(tilt * Math.PI / 180), y: 400 + side * ARM * Math.sin(tilt * Math.PI / 180) });
  const L = pan(-1), R = pan(1);
  return (
    <Stage t={t} a={a} out={out} veil={0.7}>
      <div style={{ transform: `translateY(${(1 - k0) * 500}px)` }}>
        <div style={{ position: "absolute", left: CXs - 22, top: 400, width: 44, height: 560, background: "linear-gradient(90deg,#7a5418,#f3d38a 45%,#8a6420)", borderRadius: 10, boxShadow: "0 20px 30px rgba(0,0,0,.45)" }} />
        <div style={{ position: "absolute", left: CXs - 190, top: 940, width: 380, height: 60, borderRadius: "50% 50% 14px 14px", background: "linear-gradient(180deg,#f0cf80,#8a6420)", boxShadow: "0 24px 30px rgba(0,0,0,.55)" }} />
        <div style={{ position: "absolute", left: CXs - 26, top: 374, width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff3c4,#b8892e 60%,#6a4a12)" }} />
      </div>
      <div style={{ position: "absolute", left: CXs - ARM - 20, top: 391, width: 2 * ARM + 40, height: 18, borderRadius: 9, background: "linear-gradient(180deg,#f3d38a,#8a6420)", transform: `rotate(${tilt}deg)`, opacity: e(t, a + 0.2, a + 0.5), boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} />
      {[{ p: L, n: "coin", l: "1962", v: "98¢", at: a + 0.6, w: 150 }, { p: R, n: "bills", l: "TODAY", v: "$5", at: b - 0.15, w: 230 }].map((s, i) => (
        <div key={i} style={{ position: "absolute", left: s.p.x - 130, top: s.p.y, width: 260, opacity: e(t, a + 0.3, a + 0.6) }}>
          <svg width={260} height={170} style={{ position: "absolute", top: 0 }}><path d="M130 0 L22 170 M130 0 L238 170" stroke="#a07a30" strokeWidth={4} /></svg>
          <div style={{ position: "absolute", top: 170, left: 0, width: 260, height: 44, borderRadius: "0 0 130px 130px", background: "linear-gradient(180deg,#f3d38a,#9a7228)", boxShadow: "0 14px 20px rgba(0,0,0,.45)" }} />
          {t >= s.at && <div style={{ position: "absolute", left: 130 - s.w / 2, top: 172 - s.w * (AR[s.n] ?? 0.6), width: s.w, transform: `translateY(${(1 - cl(sp(t, s.at))) * -360}px)` }}><Img src={O(s.n)} style={{ width: "100%", filter: "drop-shadow(0 6px 6px rgba(0,0,0,.45))" }} /></div>}
          <Tx t={t} a={s.at + 0.2} x={130} y={232} w={320} txt={s.l} size={54} font={SANS} weight={800} col={C.goldL} />
          <Tx t={t} a={s.at + 0.3} x={130} y={290} w={320} txt={s.v} size={110} font={SANS} weight={900} />
        </div>))}
      <Tx t={t} a={c} y={100} txt="STILL HALF THE STORE PRICE" size={70} font={SANS} weight={900} col="#9ff0ac" />
    </Stage>
  );
};

// 43 · EL BOL QUE QUEDÓ: el bol amarillo tapado en el estante de abajo y, al lado, el retrato de Hazel apoyado en un marco chico
export const KeptBowl: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => (
  <Stage t={t} a={a} out={out}>
    <Ob t={t} n="shelf" a={a} x={1460} y={880} w={860} from="left" sh={0.6} />
    <Ob t={t} n="bowllid" a={a + 0.5} x={1330} y={835} w={430} />
    <Ob t={t} n="frame" a={b} x={1700} y={835} w={260} r={4}>
      <div style={{ position: "absolute", left: "22%", right: "22%", top: "17%", bottom: "17%", overflow: "hidden" }}><Img src={O("hazel")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "sepia(.3)", background: "#b9b09e" }} /></div>
    </Ob>
    <Tx t={t} a={a + 0.8} y={150} txt="still on the bottom shelf" size={70} font={HAND} />
    <Tx t={t} a={b + 0.5} x={1700} y={900} w={420} txt="Hazel · 1889–1974" size={50} font={HAND} col={C.goldL} />
  </Stage>
);

// 37 · CUATRO POR NOCHE: del bol de masa salen volando cuatro bollos por día a la placa (domingo, lunes, martes) y al final humean
export const FourANight: React.FC<{ t: number; a: number; out: number; d1: number; d2: number; d3: number; fresh: number }> = ({ t, a, out, d1, d2, d3, fresh }) => {
  // el bol de masa de la heladera a la izquierda; cada noche salen CUATRO bollos volando a la placa (una fila por día) y el día
  // cambia arriba en letra grande; al «fresh» la placa larga vapor y se entibia
  const days = [d1, d2, d3], names = ["SUNDAY", "MONDAY", "TUESDAY"], BX = 1200, BY = 690, warm = ei(t, fresh, fresh + 0.8);
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      <Ob t={t} n="bowldough" a={a} x={BX} y={860} w={260} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(.92) saturate(.8) hue-rotate(-8deg)`} />
      <Ob t={t} n="tray" a={a + 0.15} x={1570} y={900} w={400} from="right" fl={`drop-shadow(0 12px 16px rgba(0,0,0,.45)) drop-shadow(0 0 ${(36 * warm).toFixed(0)}px rgba(255,190,100,${(0.7 * warm).toFixed(2)}))`} />
      {days.map((d, r) => [0, 1, 2, 3].map((c) => { const at = d + c * 0.12, k = ei(t, at, at + 0.45), x = lerp(BX, 1430 + c * 92 + r * 18, k), y = lerp(BY, 820 - r * 52, k) - Math.sin(k * Math.PI) * 170;
        return t >= at ? <div key={`${r}${c}`} style={{ position: "absolute", left: x - 58, top: y - 46, width: 116, zIndex: 5 - r, transform: `rotate(${((1 - k) * 220).toFixed(1)}deg) scale(${(1 + sq(t, at + 0.45, 0.12)).toFixed(4)},${(1 - sq(t, at + 0.45, 0.12)).toFixed(4)})`, filter: `brightness(${(1 + 0.15 * warm).toFixed(3)}) drop-shadow(0 6px 6px rgba(0,0,0,.45))` }}>
          <Img src={O("bun")} style={{ width: "100%" }} /></div> : null; }))}
      {days.map((d, r) => <Tx key={r} t={t} a={d - 0.05} x={1600} y={500} w={560} txt={names[r]} size={104} font={SANS} weight={900} col={r === 2 ? C.goldL : C.cream} op={1 - e(t, (days[r + 1] ?? out + 2) - 0.25, (days[r + 1] ?? out + 2) - 0.05)} />)}
      {[0, 1, 2].map((r) => <Puff key={r} t={t} a={days[r] + 0.55} x={1630} y={800 - r * 52} n={10} spread={200} up={50} col="rgba(240,215,170,.85)" />)}
      <Vapor t={t} a={fresh} b={out + 0.6} x={1640} y={700} big={1.1} />
    </Stage>
  );
};

// 44 · TODO AL BOL: cada ingrediente aparece justo cuando lo nombra y cae adentro del bol grande; al final la cuchara bate
export const IntoTheBowl: React.FC<{ t: number; a: number; out: number; at: number[]; warm: number; beat: number }> = ({ t, a, out, at, warm, beat }) => {
  // la receta entera de un tirón: cada ingrediente aparece arriba justo cuando lo nombra, se queda flotando un instante y cae
  // ADENTRO del bol grande (el bol se dibuja después y lo tapa), con polvillo en el borde; mientras entibia, vapor; al «beat» la
  // cuchara de madera gira dentro del bol
  const items = ["milk", "butter", "sugar", "salt", "yeastpk", "eggs", "flour"];
  const BXc = 1460, RIM = 700;
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      {items.map((n, i) => { const s = at[i], d0 = s + 0.9, k = ei(t, d0, d0 + 0.45), ar = AR[n] ?? 1, w = Math.min(230, 300 / ar), h = w * ar, kin = cl(sp(t, s - 0.1));
        if (t < s - 0.15 || k >= 1) return null;
        const y = lerp(250, RIM + 40, k * k) + Math.sin(2.4 * (t - s)) * 8 * (1 - k);
        return <div key={n} style={{ position: "absolute", left: BXc - w / 2 + (i % 2 ? 40 : -40) * (1 - k), top: y, width: w, opacity: cl((t - s + 0.15) * 6), transform: `scale(${(0.4 + 0.6 * kin).toFixed(4)}) rotate(${((1 - kin) * 30 + k * 25 * (i % 2 ? 1 : -1)).toFixed(1)}deg)`, transformOrigin: "50% 50%" }}>
          <Img src={O(n)} style={{ width: "100%", height: h, objectFit: "contain", filter: "drop-shadow(0 14px 14px rgba(0,0,0,.5))" }} /></div>; })}
      <Ob t={t} n="bowl" a={a} x={BXc} y={960} w={520} z={3} />
      {at.map((s, i) => <Puff key={i} t={t} a={s + 1.3} x={BXc} y={RIM + 30} n={12} spread={220} up={70} col={i === 6 ? "rgba(250,245,235,.95)" : "rgba(240,220,180,.85)"} />)}
      <div style={{ position: "absolute", inset: 0, zIndex: 4 }}><Vapor t={t} a={warm} b={warm + 3} x={BXc} y={RIM} big={1.1} /></div>
      {t > beat - 0.1 && <div style={{ position: "absolute", left: BXc - 150, top: RIM - 260, width: 300, zIndex: 2, transformOrigin: "50% 50%", transform: `rotate(${(-72 + Math.sin(7 * (t - beat)) * 22).toFixed(1)}deg) translateY(${((1 - cl(sp(t, beat - 0.1))) * -300).toFixed(0)}px)` }}>
        <Img src={O("spoon")} style={{ width: "100%", filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))" }} /></div>}
    </Stage>
  );
};

// 43 · ¿UNA SEMANA? NO, CUATRO DÍAS: en el almanaque se escribe un 7 rojo, se tacha y se estampa un 4
export const WeekNo: React.FC<{ t: number; a: number; out: number; no: number; tempt: number }> = ({ t, a, out, no, tempt }) => {
  // el almanaque de la cocina: alguien escribe un «7» rojo a mano (¿una semana?); al «No» lo tacha un trazo y cae un «4» de sello
  // con polvillo; al «tempting» el 7 tachado tiembla queriendo volver y el 4 se planta otra vez
  const shake = Math.sin(38 * (t - tempt)) * 6 * (1 - ei(t, tempt + 0.2, tempt + 0.9)) * (t > tempt ? 1 : 0);
  return (
    <Stage t={t} a={a} out={out} veil={0.72}>
      <Ob t={t} n="calpad" a={a} x={1450} y={900} w={430} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake.toFixed(1)}px)` }}>
        <Tx t={t} a={a + 0.35} x={1350} y={600} w={300} txt="7" size={230} font={SANS} weight={900} col="#c3262a" ol="#fff3dc" op={1 - 0.45 * ei(t, no + 0.3, no + 0.8)} rot={-6} />
        <Stroke t={t} a={no + 0.05} d="M 1250 650 L 1460 830" col="#7a0e10" sw={16} dur={0.3} len={300} />
      </div>
      <Tx t={t} a={no + 0.55} x={1570} y={590} w={320} txt="4" size={260} font={SANS} weight={900} col="#2c1a0e" ol="#fff3dc" rot={4} />
      <Puff t={t} a={no + 0.6} x={1570} y={780} n={14} spread={190} up={50} col="rgba(240,220,180,.9)" />
      <Puff t={t} a={tempt + 0.9} x={1570} y={780} n={8} spread={150} up={40} col="rgba(240,220,180,.8)" />
    </Stage>
  );
};
