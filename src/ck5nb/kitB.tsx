// ck5nb · kitB = componentes de Deviled Eggs (aderezo cocido): escenas de OBJETOS REALES recortados (public/ck5nb/obj) que caen
// escena de OBJETOS REALES recortados (fotos agnes sobre blanco + rembg → public/ck5nb/obj/*.png) que caen de a uno con
// resorte con peso, aplastado al aterrizar y sombra de contacto; texto GRANDE (≥44 px a 1080) con contorno, pocas palabras;
// y un momento wow por componente. Viven a la derecha (x 1020-1890): el centro/izquierda es de Loretta y del zócalo.
import React from "react";
import { Img, staticFile } from "remotion";
import { e, ei } from "../kits/yanqui3d/lib";
import { C, HAND, SANS, SERIF } from "./ui";

const cl = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const O = (n: string) => staticFile(`ck5nb/obj/${n}.png`);
// resorte con peso: 0→1 pasándose ~10 % y volviendo
const sp = (t: number, a: number, f = 1) => { const u = (t - a) * f * 0.6; return u <= 0 ? 0 : 1 - Math.exp(-5.2 * u) * Math.cos(8.5 * u); };
// aplastado al aterrizar (squash & stretch)
const sq = (t: number, a: number, amp = 0.09) => { const u = t - a; return u <= 0 ? 0 : Math.exp(-6 * u) * Math.sin(16 * u) * amp; };
const CX = 1455;
// alto/ancho de cada recorte (para que nada alto se pase de alto: mh)
const AR: Record<string, number> = {"bacon": 0.197, "basket": 0.54, "beetegg": 0.692, "beetjar": 1.806, "bills": 0.841, "bowl": 0.683, "brush": 0.416, "bulletin": 1.085, "butter": 0.643, "calpad": 0.763, "carton": 0.714, "chair": 1.616, "cheddar": 0.531, "chives": 0.541, "chowchow": 1.719, "clock": 1.036, "coin": 0.565, "cooler": 1.008, "cup": 0.834, "curryegg": 0.709, "devplain": 0.976, "devslump": 0.647, "dishpan": 0.676, "dressbowl": 0.833, "egg": 1.303, "eggpeeled": 1.313, "eggs": 0.627, "eggwhite": 0.945, "envelope": 0.544, "eraser": 0.425, "flour": 1.287, "frame": 1.273, "halfegg_yolk": 1.378, "horseradish": 1.27, "icebowl": 0.828, "icepan": 0.543, "knob": 0.985, "masher": 0.398, "mayojar": 1.58, "milk": 2.373, "mustardcan": 0.591, "offyolk": 0.855, "olive": 1.012, "paprika": 0.802, "pen": 0.419, "phone": 0.689, "pimento": 1.256, "platter": 0.47, "projector": 1.064, "quarter": 0.73, "radish": 1.156, "receipt": 2.248, "recipecard": 0.668, "register": 1.092, "ruler": 0.308, "sack": 0.998, "salt": 0.404, "saucepan": 0.542, "scale": 0.959, "scissors": 0.554, "spoon": 0.524, "steamer": 0.472, "strainer": 0.466, "sugar": 0.666, "tagblank": 0.521, "thermo": 6.28, "timer": 1.451, "towel": 0.645, "tray": 0.61, "vinegar": 3.699, "water": 1.297, "whisk": 0.372, "yolks": 0.553, "ziplock": 1.325};

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

const Vapor: React.FC<{ t: number; a: number; b: number; x: number; y: number; big?: number }> = ({ t, a, b, x, y, big = 1 }) => <>{Array.from({ length: Math.max(1, Math.ceil((b - a) / 0.5)) }, (_, k) => <Puff key={k} t={t} a={a + k * 0.5} x={x + ((k * 37) % 60 - 30)} y={y} n={10} spread={70 * big} up={220 * big} dur={1.6} size={46 * big} col="rgba(255,255,255,.7)" />)}</>;


// ======================================= helpers propios de ck5nb =======================================
const GOOD = "#8fe39a";
// rótulo chico (sin el piso de 60 px de Tx) — para nombres debajo de objetos
const Lb: React.FC<{ t: number; a: number; x: number; y: number; txt: string; size?: number; col?: string; w?: number; font?: string; op?: number }> = ({ t, a, x, y, txt, size = 42, col = C.cream, w = 420, font = SANS, op = 1 }) => {
  if (t < a - 0.05 || op <= 0.001) return null; const k = sp(t, a, 1.4);
  return <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily: font, fontWeight: 800, fontSize: size, letterSpacing: 2, color: col, textShadow: ring("#1a0e08", 3), opacity: op * cl((t - a) * 6), transform: `translateY(${((1 - k) * 24).toFixed(1)}px)` }}>{txt}</div>;
};
// cruz roja y tilde verde dibujados
const XM: React.FC<{ t: number; at: number; x: number; y: number; s?: number }> = ({ t, at, x, y, s = 120 }) => <Stroke t={t} a={at} d={`M ${x - s} ${y - s} L ${x + s} ${y + s} M ${x + s} ${y - s} L ${x - s} ${y + s}`} col={C.red} sw={18} dur={0.4} len={s * 6} />;
const CK: React.FC<{ t: number; at: number; x: number; y: number; s?: number }> = ({ t, at, x, y, s = 90 }) => <Stroke t={t} a={at} d={`M ${x - s} ${y} L ${x - s * 0.25} ${y + s * 0.7} L ${x + s} ${y - s * 0.8}`} col={GOOD} sw={18} dur={0.4} len={s * 4} />;
// arco con peso (objeto que vuela de un punto a otro)
const arc = (t: number, at: number, dur: number, x0: number, y0: number, x1: number, y1: number, h = 200) => { const k = ei(t, at, at + dur); return { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(Math.PI * k) * h, k }; };
// número que cuenta
const cnt = (t: number, a: number, b: number, v0: number, v1: number) => Math.round(lerp(v0, v1, ei(t, a, b)));
// reloj de pared CSS con agujas que giran de h0 a h1 (horas)
const Face: React.FC<{ t: number; a: number; b: number; x: number; y: number; r?: number; h0: number; h1: number; op?: number }> = ({ t, a, b, x, y, r = 150, h0, h1, op = 1 }) => {
  const h = lerp(h0, h1, ei(t, a, b)), k = cl(sp(t, a - 0.6));
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fffaf0, #e9dcc0)", border: `${r * 0.09}px solid ${C.wine}`, boxShadow: "0 18px 30px rgba(0,0,0,.5)", transform: `scale(${(0.4 + 0.6 * k).toFixed(3)})`, opacity: op * cl(k * 3) }}>
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: r - 4, top: r * 0.06, width: 8, height: r * 0.16, background: C.ink, transformOrigin: `4px ${r * 0.94}px`, transform: `rotate(${i * 30}deg)` }} />)}
    <div style={{ position: "absolute", left: r - 7, top: r * 0.42, width: 14, height: r * 0.58, borderRadius: 7, background: C.ink, transformOrigin: `7px ${r * 0.58}px`, transform: `rotate(${(h * 30).toFixed(2)}deg)` }} />
    <div style={{ position: "absolute", left: r - 4, top: r * 0.14, width: 8, height: r * 0.86, borderRadius: 4, background: C.wine, transformOrigin: `4px ${r * 0.86}px`, transform: `rotate(${((h % 1) * 360).toFixed(2)}deg)` }} />
    <div style={{ position: "absolute", left: r - 12, top: r - 12, width: 24, height: 24, borderRadius: "50%", background: C.gold }} />
  </div>;
};
// termómetro de lectura instantánea CSS (esfera con aguja) — v = grados mostrados
const Dial: React.FC<{ t: number; a: number; x: number; y: number; v: number; r?: number; hot?: number }> = ({ t, a, x, y, v, r = 150, hot = 160 }) => {
  if (t < a - 0.05) return null; const k = cl(sp(t, a)); const ang = -120 + 240 * cl((v - 0) / 220);
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, transform: `scale(${(0.3 + 0.7 * k).toFixed(3)})`, opacity: cl(k * 3) }}>
    <div style={{ position: "absolute", left: r - 9, top: 2 * r - 10, width: 18, height: 360, borderRadius: 9, background: "linear-gradient(90deg,#8d9297,#e7eaec,#8d9297)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #e8e4da)", border: `${r * 0.1}px solid #b8bcc0`, boxShadow: "0 16px 28px rgba(0,0,0,.55)" }} />
    {Array.from({ length: 23 }, (_, i) => { const g = i * 10, an = -120 + 240 * g / 220; return <div key={i} style={{ position: "absolute", left: r - 2, top: r * 0.16, width: 4, height: i % 2 ? r * 0.08 : r * 0.14, background: g === hot ? C.red : C.ink, transformOrigin: `2px ${r * 0.84}px`, transform: `rotate(${an}deg)` }} />; })}
    <div style={{ position: "absolute", left: r - 5, top: r * 0.22, width: 10, height: r * 0.78, borderRadius: 5, background: C.red, transformOrigin: `5px ${r * 0.78}px`, transform: `rotate(${ang.toFixed(2)}deg)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: r * 1.2, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: r * 0.36, color: v >= hot ? "#2f8a3a" : C.ink }}>{Math.round(v)}°</div>
  </div>;
};
// mitad de huevo (clara recortada) con relleno CSS apilado: slump 0 = pico firme, 1 = desplomado y brilloso
const Swirl: React.FC<{ x: number; y: number; w: number; slump?: number; col?: string; gloss?: number; t?: number; a?: number; oil?: number }> = ({ x, y, w, slump = 0, col = "#f2c94c", gloss = 0, oil = 0 }) => {
  const H = w * 0.62 * (1 - 0.62 * slump), W0 = w * 0.62 * (1 + 0.25 * slump);
  return <div style={{ position: "absolute", left: x - w / 2, bottom: 1080 - y, width: w }}>
    {oil > 0 && <div style={{ position: "absolute", left: "-6%", right: "-6%", bottom: -w * 0.04, height: w * 0.42, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(255,214,90,0), rgba(255,214,90,${0.55 * oil}) 82%, rgba(255,214,90,0))` }} />}
    <Img src={O("eggwhite")} style={{ width: "100%", display: "block", filter: "drop-shadow(0 10px 12px rgba(0,0,0,.45))" }} />
    {[0, 1, 2, 3].map((i) => { const f = 1 - i * 0.24; return <div key={i} style={{ position: "absolute", left: (w - W0 * f) / 2, bottom: w * 0.5 + i * H * 0.26, width: W0 * f, height: H * 0.42, borderRadius: "50% 50% 46% 46%", background: `radial-gradient(ellipse at 40% 30%, rgba(255,255,255,${(0.15 + 0.55 * gloss).toFixed(2)}), ${col} 45%, #c9962a)`, boxShadow: "inset 0 -6px 8px rgba(120,70,10,.35)" }} />; })}
    <div style={{ position: "absolute", left: w / 2 - W0 * 0.06, bottom: w * 0.5 + H * 0.9, width: W0 * 0.12, height: H * 0.2 * (1 - slump), borderRadius: "50% 50% 40% 40%", background: col }} />
  </div>;
};
// tarjeta-etiqueta de cartón (pequeño cartel pegado a un objeto)
const Tag: React.FC<{ t: number; a: number; x: number; y: number; txt: string; w?: number; rot?: number; col?: string; size?: number }> = ({ t, a, x, y, txt, w = 300, rot = -6, col = C.wine, size }) => {
  if (t < a - 0.05) return null; const k = sp(t, a, 1.3), fs = size ?? Math.min(84, (w - 30) / (txt.length * 0.58));
  return <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, padding: "10px 0", textAlign: "center", background: "linear-gradient(180deg,#fbf3e4,#efdfbf)", borderRadius: 10, boxShadow: "0 14px 22px rgba(0,0,0,.5)", fontFamily: SANS, fontWeight: 900, fontSize: fs, color: col, transform: `rotate(${(rot + (1 - k) * 30).toFixed(2)}deg) scale(${(0.3 + 0.7 * k).toFixed(3)})`, opacity: cl((t - a) * 6) }}>{txt}</div>;
};

type M = { t: number; a: number; out: number; m: number[] };

// 01 · LA SILLA Y EL BATIDOR: 1954 — una silla de madera cae, la ollita abollada aterriza en el asiento, el batidor entra girando; al «no pares» el batidor revuelve sin parar y suben notas del coro
export const ChairWhisk: React.FC<M> = ({ t, a, out, m: [whisk, dont, choir] }) => {
  const stir = t > dont ? Math.sin((t - dont) * 9) * 18 : 0;
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.15} y={110} txt="1954" size={150} font={SANS} weight={900} col={C.goldL} />
    <Ob t={t} n="chair" a={a + 0.1} x={1450} y={1000} w={330} mh={640} />
    <Ob t={t} n="saucepan" a={a + 0.55} x={1470} y={700} w={330} r={-2} z={2} />
    <Ob t={t} n="whisk" a={whisk - 0.2} x={1440} y={640} w={300} from="right" r={-52 + stir} origin="80% 50%" z={3} />
    <Tx t={t} a={dont} y={290} txt="DON'T YOU DARE STOP STIRRING" size={62} font={HAND} weight={700} col={C.cream} />
    {[0, 1, 2, 3, 4].map((i) => { const u = (t - choir - i * 0.45) / 2.6; if (u < 0 || u > 1) return null; return <div key={i} style={{ position: "absolute", left: 1150 + i * 150 + Math.sin(u * 7 + i) * 30, top: 560 - u * 420, fontSize: 90, color: C.goldL, textShadow: ring("#1a0e08", 3), opacity: Math.sin(Math.PI * u) }}>♪</div>; })}
  </Stage>;
};

// 02 · CUATRO DOCENAS Y NI UN FRASCO: la palangana cae, los huevos llueven adentro mientras cuenta a 48; el frasco de mayonesa entra y se tacha; la despensa (harina, vinagre, azúcar) lo empuja afuera
export const DishpanEggs: React.FC<M> = ({ t, a, out, m: [nomayo, pantry] }) => {
  const gone = ei(t, pantry, pantry + 0.6);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="dishpan" a={a + 0.05} x={1300} y={900} w={460} />
    {[0, 1, 2, 3, 4, 5].map((i) => { const p = arc(t, a + 0.4 + i * 0.22, 0.5, 1300 + (i - 2.5) * 40, -100, 1240 + (i % 3) * 60, 780 - Math.floor(i / 3) * 30, 0); return t > a + 0.4 + i * 0.22 ? <Img key={i} src={O("egg")} style={{ position: "absolute", left: p.x - 45, top: p.y - 60, width: 90, transform: `rotate(${i * 40}deg)`, filter: "drop-shadow(0 6px 6px rgba(0,0,0,.4))" }} /> : null; })}
    <Tx t={t} a={a + 0.4} x={1300} y={150} txt={`${cnt(t, a + 0.4, a + 2.0, 0, 48)}`} size={170} font={SANS} weight={900} col={C.goldL} w={400} />
    <Lb t={t} a={a + 1.4} x={1300} y={340} txt="HARD-BOILED EGGS" size={44} />
    <Ob t={t} n="mayojar" a={nomayo - 0.3} x={1700} y={880} w={230} from="right" tf={`translateX(${(500 * gone).toFixed(0)}px) rotate(${(40 * gone).toFixed(1)}deg)`} op={1 - gone} />
    {gone < 0.9 && <XM t={t} at={nomayo + 0.3} x={1700} y={700} s={110} />}
    <Ob t={t} n="flour" a={pantry + 0.2} x={1560} y={900} w={170} />
    <Ob t={t} n="vinegar" a={pantry + 0.45} x={1700} y={900} w={90} />
    <Ob t={t} n="sugar" a={pantry + 0.7} x={1820} y={900} w={150} />
    <Lb t={t} a={pantry + 0.9} x={1690} y={420} txt="OUT OF A PANTRY" size={50} col={C.goldL} w={520} />
  </Stage>;
};

// 03 · EL SECRETO: un huevo relleno sube como pico firme; la fuente entera se desliza; al «secret» entra la ollita con un signo de pregunta que late
export const SecretPan: React.FC<M> = ({ t, a, out, m: [peak, plate, secret] }) => {
  const up = cl(sp(t, peak - 0.2)); const pl = ei(t, plate - 0.3, plate + 0.4);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={120} txt="TANGIER" size={110} font={SANS} weight={900} col={C.goldL} />
    {pl < 1 && <div style={{ opacity: 1 - pl }}><Swirl x={1450} y={780} w={360} slump={1 - up} gloss={0.2} /></div>}
    <Lb t={t} a={peak} x={1450} y={290} txt="STANDS UP IN A PEAK" size={52} op={1 - pl} w={640} />
    <Ob t={t} n="platter" a={plate - 0.2} x={1420} y={900} w={560} from="left" />
    <Ob t={t} n="saucepan" a={secret - 0.2} x={1700} y={700} w={300} from="right" r={-6} z={3} />
    {t > secret && <div style={{ position: "absolute", left: 1600, top: 330, width: 200, textAlign: "center", fontFamily: SERIF, fontSize: 200, color: C.goldL, textShadow: ring("#1a0e08", 5), transform: `scale(${(1 + 0.08 * Math.sin((t - secret) * 6)).toFixed(3)})`, opacity: cl((t - secret) * 4) }}>?</div>}
  </Stage>;
};

// 04 · ANTES DEL FRASCO: a la izquierda el frasco «hoy» que se apaga; a la derecha el bol de aderezo cocido; al «thick» la cuchara queda parada adentro; al «exact» un tilde
export const ModernVsBefore: React.FC<M> = ({ t, a, out, m: [before, thick, exact] }) => {
  const th = ei(t, thick - 0.2, thick + 0.8), dim = ei(t, before, before + 0.6);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="mayojar" a={a + 0.1} x={1150} y={880} w={220} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(${(1 - 0.7 * dim).toFixed(2)}) brightness(${(1 - 0.35 * dim).toFixed(2)})`} />
    <Lb t={t} a={a + 0.4} x={1150} y={940} txt="THE MODERN WAY" size={38} w={360} />
    <Ob t={t} n="dressbowl" a={before - 0.2} x={1600} y={880} w={380} />
    <Ob t={t} n="spoon" a={thick - 0.1} x={1600} y={690 + 40 * (1 - th)} w={240} from="up" r={-80 + 10 * Math.sin((t - thick) * 2)} z={2} />
    <Lb t={t} a={before + 0.3} x={1600} y={940} txt="THE WAY BEFORE" size={38} w={380} col={C.goldL} />
    <Tx t={t} a={thick + 0.2} x={1600} y={200} txt="THICK & GLOSSY" size={72} font={SANS} weight={900} w={620} />
    <CK t={t} at={exact} x={1600} y={420} s={80} />
    <Lb t={t} a={exact + 0.2} x={1600} y={520} txt="EXACT TEMPERATURE" size={44} w={560} col={GOOD} />
  </Stage>;
};

// 05 · SEIS IGLESIAS, SEIS HUEVOS: seis huevos distintos caen en semicírculo; el de Decorah va al centro, se agranda y se vacía de golpe
export const SixPlates: React.FC<M> = ({ t, a, out, m: [decorah, empty] }) => {
  const N6 = ["devplain", "beetegg", "curryegg", "halfegg_yolk", "devslump", "devplain"], hi = ei(t, decorah - 0.2, decorah + 0.6), em = ei(t, empty, empty + 0.8);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={110} txt="6 CHURCH TABLES" size={86} font={SANS} weight={900} />
    {N6.map((n, i) => { const an = Math.PI * (0.1 + 0.8 * i / 5), x = 1450 - Math.cos(an) * 360, y = 820 - Math.sin(an) * 280; const me = i === 5;
      return <Ob key={i} t={t} n={n} a={a + 0.3 + i * 0.25} x={me ? lerp(x, 1450, hi) : x} y={me ? lerp(y, 760, hi) : y} w={me ? 160 + 160 * hi : 160} from="pop" op={me ? 1 - 0.9 * em : 1 - 0.6 * hi} z={me ? 4 : 1} />; })}
    <Tag t={t} a={decorah} x={1450} y={230} txt="DECORAH" w={380} size={64} />
    <Tx t={t} a={empty + 0.3} y={880} txt="FIRST PLATE EMPTY" size={70} font={SANS} weight={900} col={C.goldL} />
  </Stage>;
};

// 06 · 39¢ CONTRA 9¢: el frasco recibe su etiqueta 39¢; tres huevos de gallinero ruedan; la etiqueta 9¢ se pega al bol del aderezo y el frasco se hunde
export const StorePrice: React.FC<M> = ({ t, a, out, m: [first, c39, chick, c9] }) => {
  const sink = ei(t, c9 + 0.3, c9 + 1.1);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={first} y={110} txt="1 · THE JAR COST MONEY" size={66} font={SANS} weight={900} w={820} />
    <Ob t={t} n="mayojar" a={first + 0.2} x={1200} y={880 + 60 * sink} w={230} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(${(1 - 0.4 * sink).toFixed(2)})`} />
    <Tag t={t} a={c39} x={1200} y={430 + 60 * sink} txt="39¢" w={220} />
    {[0, 1, 2].map((i) => { const p = arc(t, chick + i * 0.3, 0.7, 1900, 700, 1520 + i * 110, 880, 160); return t > chick + i * 0.3 ? <Img key={i} src={O("egg")} style={{ position: "absolute", left: p.x - 50, top: p.y - 130, width: 100, transform: `rotate(${(1 - p.k) * 400}deg)`, filter: "drop-shadow(0 6px 6px rgba(0,0,0,.4))" }} /> : null; })}
    <Lb t={t} a={chick + 0.4} x={1630} y={940} txt="EVERYBODY HAD CHICKENS" size={36} w={460} />
    <Ob t={t} n="dressbowl" a={c9 - 0.5} x={1630} y={720} w={300} />
    <Tag t={t} a={c9} x={1630} y={330} txt="9¢" w={200} col="#2f6a35" />
  </Stage>;
};

// 07 · LA HELADERA DEL TAMAÑO DE UN APARADOR: aparador de madera con lugar para UN frasco; el frasco de más sale despedido; entra el bol de aderezo y las puertas cierran; «una semana» = 7 días
export const IceboxDoor: React.FC<M> = ({ t, a, out, m: [cup, week] }) => {
  const shut = ei(t, cup + 1.2, cup + 1.9), W = 520, H = 560, L = 1450 - W / 2, T = 330, k = cl(sp(t, a)), ko = ei(t, a + 1.5, a + 2.2);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={100} txt="2 · NO ROOM FOR JARS" size={66} font={SANS} weight={900} w={820} />
    <div style={{ position: "absolute", left: L, top: T, width: W, height: H, borderRadius: 14, background: "linear-gradient(180deg,#e9e4d8,#cfc7b5)", boxShadow: "0 0 0 14px #8a6a45, 0 30px 50px rgba(0,0,0,.6)", transform: `translateY(${((1 - k) * -500).toFixed(0)}px)`, opacity: cl(k * 3) }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: H * 0.55, height: 10, background: "#9c958a" }} />
    </div>
    <Ob t={t} n="mayojar" a={a + 0.6} x={1350} y={T + H * 0.55} w={140} z={2} />
    <Ob t={t} n="mayojar" a={a + 1.1} x={1560} y={T + H * 0.55} w={140} z={2} tf={`translate(${(420 * ko).toFixed(0)}px, ${(300 * ko * ko).toFixed(0)}px) rotate(${(120 * ko).toFixed(0)}deg)`} op={1 - ei(t, a + 2.0, a + 2.3)} />
    <Ob t={t} n="dressbowl" a={cup} x={1450} y={T + H * 0.97} w={260} from="up" z={2} />
    {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: s ? 1450 : L, top: T, width: W / 2, height: H, background: "linear-gradient(90deg,#a47a4c,#8a6236)", border: "6px solid #6b4a28", boxSizing: "border-box", borderRadius: 8, transformOrigin: s ? "100% 50%" : "0% 50%", transform: `perspective(1400px) rotateY(${((s ? 1 : -1) * 92 * (1 - shut)).toFixed(1)}deg)`, opacity: t > cup + 1.2 ? 1 : 0, zIndex: 5 }}><div style={{ position: "absolute", top: H / 2 - 30, left: s ? 18 : W / 2 - 46, width: 16, height: 60, borderRadius: 8, background: C.gold }} /></div>)}
    {Array.from({ length: 7 }, (_, i) => <Lb key={i} t={t} a={week + i * 0.18} x={1450 - 300 + i * 100} y={920} txt={"SMTWTFS"[i]} size={46} col={i === 6 ? C.goldL : C.cream} w={90} />)}
    <Lb t={t} a={week + 1.4} x={1450} y={990} txt="KEEPS A WEEK" size={40} col={C.goldL} w={420} />
  </Stage>;
};

// 08 · LA OLLITA ABOLLADA DE 1931: la ollita cae por la escalera del sótano, rebota de escalón en escalón y al aterrizar se aplasta — «1931» se estampa
export const DentedStairs: React.FC<M> = ({ t, a, out, m: [fall, land] }) => {
  const steps = 5, u = cl((t - fall) / (land - fall)), si = Math.min(steps - 1, Math.floor(u * steps)), f = u * steps - si;
  const px = 1150 + (si + f) * 130, py = 340 + si * 120 - Math.sin(Math.PI * f) * 90 + f * 120, rot = (t - fall) * 420;
  const done = t >= land, dent = done ? sq(t, land, 0.22) : 0;
  return <Stage t={t} a={a} out={out}>
    {Array.from({ length: steps }, (_, i) => <div key={i} style={{ position: "absolute", left: 1100 + i * 130, top: 430 + i * 120, width: 820 - i * 130, height: 120, background: "linear-gradient(180deg,#7a5a3a,#523a24)", boxShadow: "inset 0 8px 0 #9a7650, 0 10px 20px rgba(0,0,0,.4)", opacity: e(t, a + i * 0.1, a + i * 0.1 + 0.3) }} />)}
    {t < fall ? <Ob t={t} n="saucepan" a={a + 0.4} x={1170} y={430} w={230} /> :
      <div style={{ position: "absolute", left: (done ? 1780 : px) - 115, top: (done ? 940 : py) - 110, width: 230, transform: `rotate(${done ? 14 : rot.toFixed(1)}deg) scale(${(1 + dent).toFixed(3)},${(1 - dent).toFixed(3)})` }}><Img src={O("saucepan")} style={{ width: "100%", filter: "drop-shadow(0 10px 12px rgba(0,0,0,.5))" }} /></div>}
    {done && <Puff t={t} a={land} x={1780} y={960} n={14} spread={160} up={30} col="rgba(230,220,200,.8)" />}
    <Tx t={t} a={land + 0.15} x={1300} y={130} txt="1931" size={170} font={SANS} weight={900} col={C.goldL} rot={-6} w={500} />
    <Lb t={t} a={land + 0.6} x={1300} y={320} txt="SHE NEVER BOUGHT A NEW ONE" size={40} w={600} />
  </Stage>;
};

// 09 · EL MOSTRADOR DE INGREDIENTES: cada ingrediente cae en su lugar con la voz y deja su medida escrita a mano; la harina larga un polvito; al «that's it» todos rebotan juntos = 1 CUP
export const IngredientGrid: React.FC<M> = ({ t, a, out, m }) => {
  const [i1, i2, i3, i4, i5, i6, i7, i8, pow, done] = m;
  const R: [string, string, number][] = [["sugar", "2 TBSP SUGAR", i1], ["flour", "1 TBSP FLOUR", i2], ["mustardcan", "1 TSP DRY MUSTARD", i3], ["salt", "½ TSP SALT", i4], ["egg", "1 EGG", i5], ["milk", "½ CUP MILK", i6], ["vinegar", "¼ CUP VINEGAR", i7], ["butter", "1 TBSP BUTTER", i8]];
  const hop = t > done ? -Math.abs(Math.sin((t - done) * 7)) * 30 * Math.exp(-(t - done) * 2) : 0;
  return <Stage t={t} a={a} out={out} veil={0.62}>
    {R.map(([n, txt, at], i) => { const col = i % 4, row = Math.floor(i / 4), x = 1120 + col * 225, y = 560 + row * 340;
      return <React.Fragment key={i}><Ob t={t} n={n} a={at - 0.25} x={x} y={y} w={n === "milk" || n === "vinegar" ? 80 : 150} mh={230} tf={`translateY(${hop.toFixed(1)}px)`} />
        <Lb t={t} a={at + 0.1} x={x} y={y + 10} txt={txt} size={28} w={225} font={HAND} /></React.Fragment>; })}
    <Puff t={t} a={i2 + 0.1} x={1345} y={500} n={14} spread={90} up={80} col="rgba(255,255,255,.9)" />
    <Lb t={t} a={pow} x={1450} y={250} txt="THE POWDER · NOT THE SQUEEZE BOTTLE" size={34} w={720} col={C.goldL} op={1 - e(t, done - 0.3, done)} />
    <Tx t={t} a={done} y={130} txt="= 1 CUP" size={90} font={SANS} weight={900} col={C.goldL} />
  </Stage>;
};

// 10 · LA HARINA SE HACE BOLITAS: harina y azúcar caen en la ollita; la harina sola en el líquido arma grumos que rebotan; mezclada en seco con el azúcar se abre en granos sueltos
export const FlourLumps: React.FC<M> = ({ t, a, out, m: [skip, dumpl, separ] }) => {
  const lump = ei(t, dumpl - 0.3, dumpl + 0.4) * (1 - ei(t, separ - 0.2, separ + 0.6)), grain = ei(t, separ - 0.1, separ + 0.8);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={110} txt="MIX IT DRY FIRST" size={80} font={SANS} weight={900} />
    <Ob t={t} n="saucepan" a={a + 0.1} x={1450} y={900} w={520} />
    <Ob t={t} n="flour" a={a + 0.4} x={1250} y={560} w={160} from="left" r={-30} op={1 - e(t, skip, skip + 0.4)} />
    <Ob t={t} n="sugar" a={a + 0.7} x={1680} y={560} w={160} from="right" r={30} op={1 - e(t, skip, skip + 0.4)} />
    <Puff t={t} a={a + 1.0} x={1450} y={760} n={16} spread={120} up={70} col="rgba(255,255,255,.95)" />
    {Array.from({ length: 9 }, (_, i) => { const x = 1300 + (i % 5) * 70 + (i > 4 ? 35 : 0), y = 760 - (i > 4 ? 40 : 0) - Math.abs(Math.sin((t - dumpl) * 5 + i)) * 26 * lump; const s = lerp(16, 46, lump);
      return <div key={i} style={{ position: "absolute", left: x - s / 2 + Math.cos(i * 2.4) * 80 * grain, top: y - s / 2 + Math.sin(i * 2.4) * 20 * grain, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffffff,#e6dcc6)", boxShadow: "0 4px 6px rgba(0,0,0,.35)", opacity: Math.max(lump, 0.6 * grain) }} />; })}
    <Lb t={t} a={dumpl} x={1450} y={300} txt="FLOUR ALONE = DUMPLINGS" size={44} op={1 - grain} w={600} col={C.red} />
    <Lb t={t} a={separ} x={1450} y={300} txt="SUGAR KEEPS THE GRAINS APART" size={44} w={640} col={GOOD} />
  </Stage>;
};

// 11 · EL HUEVO QUE SE PARTE: un huevo baja y se parte en dos mitades de cáscara sobre la ollita; la yema cae y se bate a pasta; al «milk» la leche se vierte en chorro
export const EggCrack: React.FC<M> = ({ t, a, out, m: [paste, milkin] }) => {
  const cr = a + 1.0, sp2 = ei(t, cr, cr + 0.4), fallY = ei(t, cr + 0.2, cr + 0.7), pour = ei(t, milkin - 0.3, milkin + 0.3);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="saucepan" a={a + 0.05} x={1420} y={920} w={520} />
    {t < cr ? <Ob t={t} n="egg" a={a + 0.3} x={1420} y={520} w={130} /> : <>
      <div style={{ position: "absolute", left: 1420 - 65 - 90 * sp2, top: 350, width: 130, height: 85, overflow: "hidden", transform: `rotate(${-40 * sp2}deg)`, opacity: 1 - e(t, cr + 0.9, cr + 1.3) }}><Img src={O("egg")} style={{ width: 130 }} /></div>
      <div style={{ position: "absolute", left: 1420 - 65 + 90 * sp2, top: 435, width: 130, height: 85, overflow: "hidden", transform: `rotate(${40 * sp2}deg)`, opacity: 1 - e(t, cr + 0.9, cr + 1.3) }}><Img src={O("egg")} style={{ width: 130, marginTop: -85 }} /></div>
      <div style={{ position: "absolute", left: 1420 - 40, top: lerp(450, 760, fallY), width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffe9a0,#f0a81c 60%,#c8780c)", transform: `scale(${(1 + 0.6 * ei(t, paste, paste + 0.6)).toFixed(3)},${(1 - 0.5 * ei(t, paste, paste + 0.6)).toFixed(3)})`, boxShadow: "0 6px 10px rgba(0,0,0,.35)" }} /></>}
    <Tx t={t} a={paste} y={120} txt="WHISK TO A PASTE" size={78} font={SANS} weight={900} />
    <Ob t={t} n="milk" a={milkin - 0.6} x={1700} y={640} w={130} from="right" r={-55 * pour} origin="30% 20%" z={3} />
    {pour > 0.4 && <div style={{ position: "absolute", left: 1555, top: 520, width: 20, height: 280 * cl((pour - 0.4) * 2), background: "linear-gradient(90deg,#f4f1ea,#ffffff,#e9e5dc)", borderRadius: 10, opacity: 0.95 }} />}
    <Lb t={t} a={milkin} x={1450} y={300} txt="THEN ½ CUP MILK" size={50} w={560} col={C.goldL} />
  </Stage>;
};

// 12 · EL COLCHÓN: harina y leche forman un colchón blanco en la ollita; el vinagre llega ÚLTIMO en gotas que rebotan sobre el colchón; el atajo (vinagre primero) muestra granitos cortados tachados
export const VinegarCushion: React.FC<M> = ({ t, a, out, m: [knuck, vlast, curdle, cushion] }) => {
  const cu = ei(t, cushion - 0.4, cushion + 0.5), bad = e(t, curdle - 0.2, curdle + 0.3) * (1 - e(t, cushion - 0.5, cushion - 0.1));
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={110} txt="VINEGAR GOES IN LAST" size={74} font={SANS} weight={900} col={C.goldL} />
    <Ob t={t} n="saucepan" a={a + 0.1} x={1420} y={920} w={540} />
    <Ob t={t} n="spoon" a={knuck - 0.2} x={1760} y={560} w={200} from="right" r={-30 + 25 * Math.max(0, Math.sin((t - knuck) * 10)) * (1 - e(t, knuck + 1.2, knuck + 1.5))} op={1 - e(t, knuck + 1.3, knuck + 1.6)} />
    <Lb t={t} a={knuck} x={1700} y={680} txt="RAP!" size={64} col={C.red} w={240} op={1 - e(t, knuck + 1.0, knuck + 1.4)} />
    <Ob t={t} n="vinegar" a={vlast - 0.3} x={1640} y={640} w={90} from="up" r={-35} z={3} />
    {bad > 0.01 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1300 + (i * 47) % 260, top: 760 + (i * 29) % 60, width: 18, height: 14, borderRadius: 6, background: "#f6eedb", boxShadow: "0 2px 3px rgba(0,0,0,.4)", opacity: bad }} />)}
    {bad > 0.5 && <XM t={t} at={curdle + 0.2} x={1420} y={790} s={90} />}
    <Lb t={t} a={curdle} x={1420} y={300} txt="VINEGAR FIRST = GRAINY" size={46} w={600} col={C.red} op={1 - cu} />
    <div style={{ position: "absolute", left: 1220, top: 755, width: 400, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%,#ffffff,#efe6d2 60%,#d9ccb0)", opacity: cu, transform: `scaleY(${(0.6 + 0.4 * cu).toFixed(3)})` }} />
    {[0, 1, 2, 3].map((i) => { const at = cushion + 0.4 + i * 0.35, p = arc(t, at, 0.35, 1610, 600, 1340 + i * 60, 760, 0); const b = sq(t, at + 0.35, 0.5); return t > at ? <div key={i} style={{ position: "absolute", left: p.x - 10, top: p.y - 14 - Math.abs(b) * 60, width: 20, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(214,170,90,.9)", opacity: 1 - e(t, at + 0.6, at + 0.9) }} /> : null; })}
    <Lb t={t} a={cushion} x={1420} y={300} txt="FLOUR + MILK = A CUSHION" size={46} w={620} col={GOOD} />
  </Stage>;
};

// 13 · EL TERMÓMETRO DE CARAMELO: un tubo de vidrio gigante; el rojo sube con la voz y se clava en la marca dorada 160; «PAGE 9» se estampa al lado
export const CandyThermo: React.FC<M> = ({ t, a, out, m: [d160, pg9] }) => {
  const v = lerp(70, 160, ei(t, a + 0.5, d160)), H = 760, T0 = 140, X = 1300, pos = (g: number) => T0 + H - 60 - (g - 60) / 120 * (H - 140);
  const k = cl(sp(t, a));
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: X - 50, top: T0, width: 100, height: H, borderRadius: 50, background: "linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,.85) 40%,rgba(255,255,255,.3))", boxShadow: "0 0 0 6px rgba(255,255,255,.5), 0 30px 40px rgba(0,0,0,.6)", transform: `translateY(${((1 - k) * -700).toFixed(0)}px)` }} />
    <div style={{ position: "absolute", left: X - 70, top: T0 + H - 110, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#d8392b 55%,#8e1d2b)", transform: `translateY(${((1 - k) * -700).toFixed(0)}px)` }} />
    <div style={{ position: "absolute", left: X - 20, top: pos(v), width: 40, height: T0 + H - 60 - pos(v), background: "linear-gradient(90deg,#a3241b,#ff5a46,#a3241b)", borderRadius: 20, opacity: cl(k * 2) }} />
    {[80, 100, 120, 140, 160, 180].map((g) => <React.Fragment key={g}><div style={{ position: "absolute", left: X + 60, top: pos(g) - 3, width: g === 160 ? 110 : 60, height: 6, background: g === 160 ? C.gold : C.cream, opacity: e(t, a + 0.3, a + 0.6) }} />
      <div style={{ position: "absolute", left: X + 180, top: pos(g) - 26, fontFamily: SANS, fontWeight: 900, fontSize: g === 160 ? 64 : 40, color: g === 160 ? C.goldL : C.cream, textShadow: ring("#1a0e08", 3), opacity: e(t, a + 0.3, a + 0.6), transform: g === 160 ? `scale(${(1 + 0.25 * sq(t, d160, 1)).toFixed(3)})` : undefined }}>{g}°F</div></React.Fragment>)}
    <Tx t={t} a={d160} x={1640} y={120} txt="SAFE" size={110} font={SANS} weight={900} col={GOOD} w={420} />
    <Tag t={t} a={pg9} x={1640} y={640} txt="PAGE 9" w={260} rot={8} />
    <Lb t={t} a={pg9 + 0.4} x={1640} y={760} txt="EGG DISHES" size={40} w={360} />
  </Stage>;
};

// 14 · EL MISMO NÚMERO: «a ojo» queda borroso y tachado; el termómetro de caramelo se compara con uno de esfera: las dos agujas caen al mismo 160; «8 DOLLARS» se pega
export const SameNumber: React.FC<M> = ({ t, a, out, m: [byeye, candy, eight] }) => {
  const v = lerp(90, 160, ei(t, candy - 0.2, candy + 1.2));
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={110} txt="SAFE = THICK" size={86} font={SANS} weight={900} col={C.goldL} />
    <Lb t={t} a={byeye} x={1450} y={260} txt="NOT BY EYE" size={60} col={C.red} w={460} op={1 - e(t, candy - 0.3, candy)} />
    {t > byeye && t < candy && <XM t={t} at={byeye + 0.3} x={1450} y={300} s={70} />}
    <Ob t={t} n="thermo" a={candy - 0.3} x={1200} y={950} w={90} mh={620} from="left" />
    <Dial t={t} a={candy + 0.2} x={1620} y={560} v={v} r={170} />
    <Tag t={t} a={eight} x={1620} y={860} txt="ABOUT $8" w={330} col="#2f6a35" />
  </Stage>;
};

// 15 · LA PERILLA Y EL OCHO: la perilla gira hasta «MED-LOW» (no MED); la cuchara de madera traza un 8 dorado que se dibuja sobre el fondo de la ollita y toca las esquinas
export const KnobFig8: React.FC<M> = ({ t, a, out, m: [notmed, stir, fig8, corners] }) => {
  const rot = lerp(-130, -30, ei(t, a + 0.4, a + 1.0)) + lerp(0, -35, ei(t, notmed, notmed + 0.5));
  const u = (t - fig8) * 1.1, cx = 1450, cy = 760, px = cx + Math.sin(u * Math.PI) * 230, py = cy + Math.sin(u * 2 * Math.PI) * 60;
  const path = Array.from({ length: 61 }, (_, i) => { const s = i / 60 * Math.min(2, Math.max(0, u)); return `${i ? "L" : "M"} ${(cx + Math.sin(s * Math.PI) * 230).toFixed(1)} ${(cy + Math.sin(s * 2 * Math.PI) * 60).toFixed(1)}`; }).join(" ");
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="knob" a={a + 0.05} x={1200} y={430} w={190} tf={`rotate(${rot.toFixed(1)}deg)`} origin="50% 50%" />
    <Lb t={t} a={a + 0.6} x={1200} y={450} txt="MEDIUM-LOW" size={44} col={C.goldL} w={360} />
    {t > notmed - 0.1 && t < notmed + 1.8 && <><Lb t={t} a={notmed} x={1600} y={260} txt="NOT MEDIUM" size={54} col={C.red} w={420} /><XM t={t} at={notmed + 0.2} x={1600} y={300} s={60} /></>}
    <Ob t={t} n="saucepan" a={stir - 0.3} x={1450} y={940} w={600} />
    {t > fig8 && <Stroke t={t} a={fig8} d={path} col={C.gold} sw={10} dur={0.01} len={4000} />}
    {t > stir && <div style={{ position: "absolute", left: (t > fig8 ? px : 1450 + Math.sin((t - stir) * 4) * 120) - 25, top: (t > fig8 ? py : 760) - 330, width: 50, height: 340, transform: `rotate(${(Math.cos(u * Math.PI) * 14).toFixed(1)}deg)`, transformOrigin: "50% 100%" }}><Img src={O("spoon")} style={{ width: 340, transform: "rotate(-90deg) translate(-150px,-145px)", filter: "drop-shadow(0 8px 8px rgba(0,0,0,.45))" }} /></div>}
    <Tx t={t} a={fig8 + 0.2} y={110} txt="A FIGURE 8" size={92} font={SANS} weight={900} />
    {[[1200, 790], [1700, 790]].map(([x, y], i) => t > corners + i * 0.4 ? <div key={i} style={{ position: "absolute", left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: "50%", border: `8px solid ${GOOD}`, transform: `scale(${(0.5 + 0.5 * cl(sp(t, corners + i * 0.4))).toFixed(3)})` }} /> : null)}
  </Stage>;
};

// 16 · DE GOLPE: la cuchara sale del aderezo chorreando fino; a los ~5 minutos «de golpe» la gota se espesa, se estira y queda pegada (napa)
export const SpoonDrip: React.FC<M> = ({ t, a, out, m: [allonce, coat] }) => {
  const th = ei(t, allonce - 0.1, allonce + 0.9), period = lerp(0.6, 2.2, th), ph = ((t - a) % period) / period;
  const dropY = lerp(0, 420, ph ** 2) * (1 - th * 0.85), dropS = lerp(18, 46, th);
  return <Stage t={t} a={a} out={out}>
    <Face t={t} a={a + 0.2} b={allonce} x={1240} y={300} r={120} h0={0} h1={1 / 12 * 1.1} />
    <Lb t={t} a={allonce} x={1240} y={440} txt="~5 MINUTES" size={44} w={320} col={C.goldL} />
    <Ob t={t} n="saucepan" a={a + 0.1} x={1560} y={980} w={480} />
    <Ob t={t} n="spoon" a={a + 0.3} x={1600} y={520} w={300} from="up" r={-75} />
    <div style={{ position: "absolute", left: 1615 - dropS / 2, top: 520 + dropY, width: dropS, height: dropS * (1.3 + 1.6 * th * (1 - ph)), borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", background: "radial-gradient(circle at 35% 30%,#fff7d0,#f2cf62 60%,#c99a2a)", opacity: 0.95 }} />
    <Tx t={t} a={allonce} x={1450} y={110} txt="ALL AT ONCE" size={92} font={SANS} weight={900} col={C.goldL} />
    <Lb t={t} a={coat} x={1600} y={300} txt="IT COATS THE SPOON" size={50} w={560} />
  </Stage>;
};

// 17 · LA LÍNEA DEL DEDO: el dorso de la cuchara cubierto de aderezo; un dedo (sombra) pasa y deja una raya limpia que NO se cierra; al «holds» la raya brilla dorada
export const NappeLine: React.FC<M> = ({ t, a, out, m: [finger, nappe, holds] }) => {
  const d = ei(t, finger, finger + 0.8), hl = e(t, holds, holds + 0.4);
  const SW = 300, SH = 520, X = 1450 - SW / 2, Y = 260;
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: X, top: Y, width: SW, height: SH, borderRadius: "50% 50% 46% 46% / 40% 40% 60% 60%", background: "linear-gradient(160deg,#c49058,#8c5b2c)", boxShadow: "0 30px 40px rgba(0,0,0,.55)", transform: `scale(${(0.6 + 0.4 * cl(sp(t, a))).toFixed(3)}) rotate(-8deg)`, opacity: cl((t - a) * 4) }}>
      <div style={{ position: "absolute", inset: 18, borderRadius: "inherit", background: "radial-gradient(ellipse at 40% 30%,#fff3c4,#f0cc62 60%,#d3a43a)", opacity: e(t, a + 0.4, a + 0.9) }} />
      <div style={{ position: "absolute", left: 18, top: SH * 0.48, height: 34, width: (SW - 36) * d, background: "linear-gradient(180deg,#8c5b2c,#a8763f)", borderRadius: 17, boxShadow: hl > 0 ? `0 0 ${(30 * hl).toFixed(0)}px ${C.gold}` : undefined, border: hl > 0 ? `3px solid rgba(248,221,164,${hl})` : undefined }} />
    </div>
    <div style={{ position: "absolute", left: X - 40 + (SW + 20) * d, top: Y + SH * 0.48 - 60, width: 120, height: 150, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.5), rgba(0,0,0,0))", opacity: t > finger - 0.2 && d < 1 ? 1 : 0, filter: "blur(6px)" }} />
    <Tx t={t} a={nappe} y={100} txt="NAPPE" size={110} font={SERIF} col={C.goldL} />
    <Lb t={t} a={nappe + 0.3} x={1450} y={830} txt="IT HOLDS A LINE" size={54} w={560} />
    <CK t={t} at={holds + 0.2} x={1770} y={500} s={70} />
  </Stage>;
};

// 18 · LA AGUJA NO MIENTE: termómetro de esfera grande; a 150 se planta y titila en rojo «NOT YET»; sigue a 160 verde; la manteca cae, se derrite en un charquito y el aderezo brilla
export const DialRead: React.FC<M> = ({ t, a, out, m: [only150, butter, glossy] }) => {
  const v = t < only150 + 1.4 ? lerp(120, 150, ei(t, a + 0.3, only150)) : lerp(150, 160, ei(t, only150 + 1.4, only150 + 2.4));
  const melt = ei(t, butter + 0.4, butter + 2.0), gl = ei(t, glossy - 0.2, glossy + 0.6);
  return <Stage t={t} a={a} out={out}>
    <Dial t={t} a={a + 0.05} x={1220} y={430} v={v} r={190} />
    {t > only150 && t < only150 + 1.4 && <Lb t={t} a={only150} x={1220} y={700} txt="150 · NOT YET" size={50} col={C.red} w={400} op={0.6 + 0.4 * Math.sin((t - only150) * 12)} />}
    <Ob t={t} n="dressbowl" a={butter - 0.4} x={1640} y={900} w={400} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(${(1 + 0.18 * gl).toFixed(3)}) contrast(${(1 + 0.15 * gl).toFixed(3)})`} />
    <Ob t={t} n="butter" a={butter} x={1640} y={760} w={180 * (1 - 0.6 * melt)} op={1 - melt} />
    {melt > 0 && <div style={{ position: "absolute", left: 1640 - 120 * melt, top: 690, width: 240 * melt, height: 50 * melt, borderRadius: "50%", background: "radial-gradient(closest-side,#fff2a8,rgba(255,230,140,0))", opacity: 0.9 }} />}
    {gl > 0 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1540 + i * 90, top: 680 + (i % 2) * 20, width: 30, height: 30, background: "radial-gradient(closest-side,#ffffff,rgba(255,255,255,0))", transform: `scale(${(gl * (0.7 + 0.5 * Math.sin((t - glossy) * 5 + i * 2))).toFixed(3)})` }} />)}
    <Tx t={t} a={glossy} x={1640} y={150} txt="GLOSSY" size={110} font={SERIF} col={C.goldL} w={520} />
    <Lb t={t} a={butter} x={1640} y={330} txt="+1 TBSP BUTTER · OFF THE HEAT" size={36} w={560} />
  </Stage>;
};

// 19 · EL NIDO DE HIELO: el bol de hielo cae, la ollita se hunde adentro y suelta vapor que se corta; el film se apoya sobre la superficie (sin piel); un reloj de 15 minutos da la vuelta
export const IceNest: React.FC<M> = ({ t, a, out, m: [setin, wrap, skin, fifteen] }) => {
  const sink = ei(t, setin - 0.2, setin + 0.6), wr = ei(t, wrap - 0.1, wrap + 0.7);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={110} txt="COOL IT FAST" size={90} font={SANS} weight={900} col={C.goldL} />
    <Ob t={t} n="icebowl" a={a + 0.1} x={1400} y={940} w={560} z={1} />
    <Ob t={t} n="saucepan" a={setin - 0.6} x={1400} y={760 + 80 * sink} w={420} z={2} />
    <Vapor t={t} a={setin} b={Math.min(wrap, setin + 3)} x={1400} y={560} big={0.9} />
    {wr > 0 && <div style={{ position: "absolute", left: 1400 - 230, top: lerp(380, 640 + 80 * sink, wr), width: 460, height: 90, borderRadius: "40%", background: "linear-gradient(180deg,rgba(255,255,255,.55),rgba(220,235,255,.25))", border: "2px solid rgba(255,255,255,.7)", zIndex: 3, transform: `rotate(${(-12 * (1 - wr)).toFixed(1)}deg)` }} />}
    <Lb t={t} a={wrap + 0.2} x={1400} y={300} txt="PLASTIC RIGHT ON TOP" size={48} w={600} />
    <Lb t={t} a={skin} x={1400} y={370} txt="NO SKIN" size={56} col={GOOD} w={400} />
    <Face t={t} a={fifteen - 0.2} b={fifteen + 2.5} x={1760} y={560} r={120} h0={0} h1={0.25} />
    <Lb t={t} a={fifteen} x={1760} y={700} txt="15 MIN" size={50} col={C.goldL} w={260} />
  </Stage>;
};

// 20 · VIERNES · SÁBADO · DOMINGO: tres percheros de cocina; cada día cuelga su objeto (bol de aderezo, cartón de huevos, fuente); «Monday» trae la ensaladera de papa
export const WeekendPegs: React.FC<M> = ({ t, a, out, m: [fri, sat, sun, sched, monday] }) => {
  const D: [string, string, number][] = [["FRI", "dressbowl", fri], ["SAT", "carton", sat], ["SUN", "platter", sun]];
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={100} txt="MAKE IT THE DAY BEFORE" size={66} font={SANS} weight={900} w={840} />
    <div style={{ position: "absolute", left: 1040, top: 330, width: 820, height: 26, borderRadius: 8, background: "linear-gradient(180deg,#a47a4c,#6b4a28)", boxShadow: "0 10px 16px rgba(0,0,0,.5)", transform: `scaleX(${cl(sp(t, a)).toFixed(3)})` }} />
    {D.map(([d, n, at], i) => { const x = 1180 + i * 270; return <React.Fragment key={i}>
      <Lb t={t} a={at - 0.2} x={x} y={360} txt={d} size={60} col={C.goldL} w={240} />
      <Ob t={t} n={n} a={at} x={x} y={720} w={220} from="drop" tf={`rotate(${(Math.sin((t - at) * 3) * 4 * Math.exp(-(t - at))).toFixed(2)}deg)`} />
      <Lb t={t} a={at + 0.3} x={x} y={740} txt={["DRESSING", "EGGS", "POTLUCK"][i]} size={36} w={240} /></React.Fragment>; })}
    <Tx t={t} a={sched} y={830} txt="THE CHURCH LADY SCHEDULE" size={60} font={HAND} weight={700} col={C.cream} w={860} />
    <Lb t={t} a={monday} x={1450} y={250} txt="LEFTOVERS → MONDAY'S POTATO SALAD" size={36} w={760} col={GOOD} />
  </Stage>;
};

// 21 · SABE A 1954: el bol frío tiembla como budín; se estampa un sello postal «1954» encima con un golpe
export const YearStamp: React.FC<M> = ({ t, a, out, m: [tastes, stamp] }) => {
  const wob = Math.sin((t - a) * 9) * 0.03 * Math.exp(-(t - a) * 0.8), hit = sq(t, stamp, 0.3);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="dressbowl" a={a + 0.05} x={1450} y={900} w={460} tf={`scale(${(1 + wob).toFixed(4)},${(1 - wob).toFixed(4)})`} />
    <Lb t={t} a={a + 0.4} x={1450} y={300} txt="THICK AS A PUDDING" size={52} w={600} />
    <Lb t={t} a={a + 1.6} x={1450} y={370} txt="SHARP & SWEET" size={52} w={520} col={C.goldL} />
    {t > stamp - 0.4 && <div style={{ position: "absolute", left: 1450 - 190, top: lerp(-200, 470, ei(t, stamp - 0.4, stamp)), width: 380, height: 220, border: `12px solid ${C.wine}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 130, color: C.wine, background: "rgba(251,243,228,.85)", transform: `rotate(-9deg) scale(${(1 + hit).toFixed(3)},${(1 - hit).toFixed(3)})`, boxShadow: "0 16px 26px rgba(0,0,0,.5)" }}>1954</div>}
    <Tx t={t} a={tastes} y={100} txt="IT TASTES LIKE" size={70} font={SANS} weight={900} />
  </Stage>;
};

// 22 · CINCO OLLITAS ARRUINADAS: cinco ollitas en fila; con cada error la suya se arruina a la vista (grumos, humo, quemado, aguada, piel) y le cae su número; el teléfono suena y se tacha
export const FivePans: React.FC<M> = ({ t, a, out, m: [r1, r2, r3, phone, r4, r5] }) => {
  const R: [number, string][] = [[r1, "VINEGAR FIRST"], [r2, "TOO HOT"], [r3, "STOPPED STIRRING"], [r4, "UNDER 160°"], [r5, "COOLED SLOW"]];
  const cur = R.reduce((k, [at], i) => (t >= at - 0.3 ? i : k), 0);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="5 WAYS TO RUIN IT" size={84} font={SANS} weight={900} col={C.goldL} />
    {R.map(([at, txt], i) => { const x = 1100 + i * 175, on = i === cur, up = on ? cl(sp(t, at - 0.3)) : 0, y = 620 - 80 * up;
      return <React.Fragment key={i}>
        <Ob t={t} n="saucepan" a={a + 0.3 + i * 0.15} x={x} y={y} w={on ? 230 : 160} fl={`drop-shadow(0 10px 12px rgba(0,0,0,.4)) brightness(${t > at ? (on ? 1 : 0.55) : 0.85})`} />
        {t > at && i === 1 && <Vapor t={t} a={at} b={at + 3} x={x} y={y - 120} big={0.5} />}
        {t > at && i === 2 && <Puff t={t} a={at + 0.2} x={x} y={y - 100} n={12} spread={60} up={160} dur={2} col="rgba(40,30,25,.8)" />}
        <Lb t={t} a={at} x={x} y={y + 20} txt={`${i + 1}`} size={60} col={on ? C.red : C.cream} w={120} />
        {on && <Tx t={t} a={at + 0.1} y={820} txt={txt} size={70} font={SANS} weight={900} w={860} />}</React.Fragment>; })}
    {t > phone - 0.2 && t < r4 - 0.4 && <><Ob t={t} n="phone" a={phone - 0.2} x={1780} y={330} w={170} from="pop" tf={`rotate(${(Math.sin((t - phone) * 40) * 6).toFixed(1)}deg)`} /><XM t={t} at={phone + 0.5} x={1780} y={250} s={70} /></>}
  </Stage>;
};

// 23 · EL RESCATE: el aderezo grumoso se empuja por el colador con el dorso de la cuchara y sale liso; si está cortado como ricota, el bol se va a la basura
export const StrainerRescue: React.FC<M> = ({ t, a, out, m: [strain, cottage] }) => {
  const push = Math.max(0, Math.sin((t - strain) * 4)), flow = ei(t, strain + 0.3, strain + 3);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={100} txt="A RESCUE" size={100} font={SANS} weight={900} col={GOOD} />
    <Ob t={t} n="bowl" a={a + 0.1} x={1350} y={940} w={420} />
    <Ob t={t} n="strainer" a={strain - 0.4} x={1350} y={700} w={430} from="up" />
    <Ob t={t} n="spoon" a={strain} x={1330} y={640 + 30 * push} w={260} r={-20} z={3} />
    {flow > 0 && Array.from({ length: 6 }, (_, i) => { const u = ((t - strain) * 1.4 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 1330 + (i - 3) * 20, top: 720 + u * 130, width: 14, height: 22, borderRadius: 7, background: "#f2cf62", opacity: flow * (1 - u) }} />; })}
    <Lb t={t} a={strain + 0.6} x={1350} y={300} txt="LUMPS STAY · SAUCE COMES OUT SMOOTH" size={36} w={760} />
    {t > cottage - 0.3 && <><Ob t={t} n="dressbowl" a={cottage - 0.3} x={1720} y={800} w={250} from="right" fl="drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(.3) brightness(.8)" tf={`translateY(${(240 * ei(t, cottage + 1.6, cottage + 2.4) ** 2).toFixed(0)}px) rotate(${(50 * ei(t, cottage + 1.6, cottage + 2.4)).toFixed(1)}deg)`} />
      <Lb t={t} a={cottage + 0.2} x={1720} y={480} txt="CURDLED? START AGAIN" size={38} col={C.red} w={460} /><XM t={t} at={cottage + 0.6} x={1720} y={690} s={90} /></>}
  </Stage>;
};

// 24 · EL CARTÓN DE COSTADO: el cartón cae y se tumba de costado con un golpe; un huevo en corte muestra la yema que flota hacia el centro; al «eleven» 12 mitades: 11 tildes verdes y una roja
export const CartonSide: React.FC<M> = ({ t, a, out, m: [side, drifts, eleven] }) => {
  const tip = ei(t, side - 0.2, side + 0.5), yc = ei(t, drifts, drifts + 1.4), el = t > eleven - 0.3;
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={100} txt="FROM YOUR COMMENTS · #1" size={56} font={SANS} weight={900} w={840} />
    {!el && <Ob t={t} n="carton" a={a + 0.2} x={1250} y={880} w={380} tf={`rotate(${(-90 * tip).toFixed(1)}deg)`} origin="0% 100%" />}
    {!el && t > drifts - 0.4 && <div style={{ position: "absolute", left: 1600, top: 380, width: 220, height: 290, borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%", background: "radial-gradient(ellipse at 45% 40%,#ffffff,#f4efe4)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", transform: `rotate(${(-90 * tip).toFixed(1)}deg)`, opacity: e(t, drifts - 0.4, drifts) }}>
      <div style={{ position: "absolute", left: 110 - 55, top: lerp(30, 145 - 55, yc), width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffe08a,#f0a81c 60%,#c8780c)" }} /></div>}
    {!el && <Lb t={t} a={drifts + 0.3} x={1710} y={720} txt="YOLK DRIFTS TO THE MIDDLE" size={34} w={420} />}
    {el && Array.from({ length: 12 }, (_, i) => { const x = 1130 + (i % 4) * 210, y = 470 + Math.floor(i / 4) * 210, bad = i === 7; return <React.Fragment key={i}>
      <Ob t={t} n="halfegg_yolk" a={eleven - 0.3 + i * 0.07} x={x} y={y} w={120} from="pop" />
      {bad ? <XM t={t} at={eleven + 1.2} x={x} y={y - 80} s={40} /> : <CK t={t} at={eleven + 0.3 + i * 0.06} x={x} y={y - 80} s={36} />}</React.Fragment>; })}
    {el && <Tx t={t} a={eleven + 0.4} y={880} txt="11 OF 12 CENTERED" size={70} font={SANS} weight={900} col={C.goldL} />}
  </Stage>;
};

// 25 · LA CANASTA DE VAPOR: la olla con canasta; los huevos de gallinero entran, la tapa baja, vapor; el reloj marca 13; directo al hielo con salpicón; la cáscara se va entera
export const SteamBasket: React.FC<M> = ({ t, a, out, m: [steam, t13, icew, peel] }) => {
  const toIce = ei(t, icew - 0.3, icew + 0.4);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={100} txt="FRESH EGGS? STEAM THEM" size={64} font={SANS} weight={900} w={860} />
    <Ob t={t} n="steamer" a={a + 0.2} x={1300} y={900} w={480} op={1 - 0.5 * toIce} />
    {[0, 1, 2].map((i) => <Ob key={i} t={t} n="egg" a={a + 0.7 + i * 0.2} x={lerp(1220 + i * 80, 1680 + i * 50, toIce)} y={lerp(790, 850, toIce)} w={90} z={2} />)}
    <Vapor t={t} a={steam} b={icew - 0.3} x={1300} y={680} big={1.1} />
    <Face t={t} a={steam + 0.3} b={t13} x={1700} y={380} r={110} h0={0} h1={13 / 60} />
    <Lb t={t} a={t13} x={1700} y={510} txt="13 MINUTES" size={48} col={C.goldL} w={340} />
    <Ob t={t} n="icebowl" a={icew - 0.6} x={1720} y={940} w={360} from="right" />
    <Puff t={t} a={icew + 0.3} x={1720} y={800} n={16} spread={120} up={60} col="rgba(200,230,255,.9)" />
    <Lb t={t} a={peel} x={1500} y={640} txt="THEY PEEL" size={56} col={GOOD} w={360} />
  </Stage>;
};

// 26 · NADA A LA BASURA: el tacho de basura abre la tapa, el huevo roto vuela hacia él… y a mitad de camino gira hacia el bol de ensalada de huevo; la tapa se cierra vacía
export const TornToSalad: React.FC<M> = ({ t, a, out, m: [garbage] }) => {
  const fl = a + 0.9, p = t < fl + 0.4 ? arc(t, fl, 0.4, 1200, 520, 1460, 420, 120) : arc(t, fl + 0.4, 0.6, 1460, 420, 1500, 700, -100), lid = ei(t, fl - 0.4, fl) * (1 - ei(t, fl + 0.9, fl + 1.3));
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={100} txt="#3 · TORN EGGS = EGG SALAD" size={58} font={SANS} weight={900} w={860} />
    <div style={{ position: "absolute", left: 1640, top: 560, width: 200, height: 300, borderRadius: "10px 10px 26px 26px", background: "linear-gradient(90deg,#6c7176,#b8bdc2,#6c7176)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", opacity: e(t, a, a + 0.3) }} />
    <div style={{ position: "absolute", left: 1625, top: 530, width: 230, height: 36, borderRadius: 14, background: "linear-gradient(180deg,#c4c8cc,#7b8085)", transformOrigin: "100% 100%", transform: `rotate(${(70 * lid).toFixed(1)}deg)`, opacity: e(t, a, a + 0.3) }} />
    <Ob t={t} n="eggpeeled" a={a + 0.3} x={1200} y={600} w={130} op={t > fl ? 0 : 1} />
    {t > fl && t < fl + 1.0 && <Img src={O("eggpeeled")} style={{ position: "absolute", left: p.x - 65, top: p.y - 85, width: 130, transform: `rotate(${((t - fl) * 500).toFixed(0)}deg)` }} />}
    <Ob t={t} n="bowl" a={fl + 0.2} x={1500} y={900} w={360} from="left" />
    <Lb t={t} a={fl + 1.0} x={1500} y={920} txt="MONDAY'S LUNCH" size={40} col={C.goldL} w={420} />
    <Lb t={t} a={garbage} x={1450} y={300} txt="NOTHING WENT IN THE GARBAGE" size={44} w={760} />
  </Stage>;
};

// 27 · FINO COMO ARENA: doce yemas caen en el bol; el tenedor pisa y las yemas se deshacen en un montoncito de arena dorada que cae como reloj de arena
export const MashSand: React.FC<M> = ({ t, a, out, m: [sand] }) => {
  const sm = ei(t, a + 1.6, sand);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={100} txt="1 DOZEN = 24 HALVES" size={76} font={SANS} weight={900} />
    <Ob t={t} n="bowl" a={a + 0.1} x={1450} y={940} w={480} z={2} />
    {Array.from({ length: 12 }, (_, i) => { const at = a + 0.4 + i * 0.09, p = arc(t, at, 0.4, 1200 + (i % 6) * 100, 150, 1360 + (i % 4) * 60, 770 - Math.floor(i / 4) * 30, 0); const s = 60 * (1 - sm);
      return t > at && s > 2 ? <div key={i} style={{ position: "absolute", left: p.x - s / 2, top: p.y - s / 2, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffe08a,#f0a81c 60%,#c8780c)", zIndex: 1 }} /> : null; })}
    {sm > 0 && <div style={{ position: "absolute", left: 1450 - 170 * sm, top: 770 - 70 * sm, width: 340 * sm, height: 110 * sm, borderRadius: "50% 50% 10% 10%", background: "radial-gradient(ellipse at 50% 20%,#ffe6a0,#e9b443 70%)", zIndex: 1 }} />}
    {sm > 0.3 && Array.from({ length: 30 }, (_, i) => { const u = ((t - a) * 0.8 + i / 30) % 1; return <div key={i} style={{ position: "absolute", left: 1450 + Math.sin(i * 7.1) * 120, top: 360 + u * 380, width: 7, height: 7, borderRadius: "50%", background: "#f2c14e", opacity: (1 - u) * sm }} />; })}
    <Ob t={t} n="masher" a={a + 1.2} x={1560} y={720 + 40 * Math.max(0, Math.sin((t - a) * 6))} w={300} from="right" r={-20} z={3} op={1 - e(t, sand, sand + 0.5)} />
    <Tx t={t} a={sand} y={240} txt="FINE, LIKE SAND" size={80} font={SERIF} col={C.goldL} />
  </Stage>;
};

// 28 · LA FÓRMULA BASE: cada ingrediente cae en una balanza de platillo con la voz (yemas, aderezo ⅓ taza, mostaza, pimienta BLANCA); la pimienta negra intenta entrar y deja puntitos tachados
export const BaseFormula: React.FC<M> = ({ t, a, out, m: [third, ymust, white, specks] }) => {
  const R: [string, string, number][] = [["yolks", "12 YOLKS", a + 0.3], ["dressbowl", "⅓ CUP DRESSING", third], ["mustardcan", "1 TSP YELLOW MUSTARD", ymust]];
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="THE BASE FILLING" size={86} font={SANS} weight={900} col={C.goldL} />
    {R.map(([n, txt, at], i) => <React.Fragment key={i}><Ob t={t} n={n} a={at} x={1160 + i * 260} y={640} w={220} mh={240} />
      <Lb t={t} a={at + 0.2} x={1160 + i * 260} y={660} txt={txt} size={30} w={250} font={HAND} />
      {i < 2 && <Lb t={t} a={R[i + 1][2] - 0.1} x={1290 + i * 260} y={500} txt="+" size={70} w={60} col={C.goldL} />}</React.Fragment>)}
    <Lb t={t} a={white} x={1700} y={760} txt="+ A PINCH OF WHITE PEPPER" size={36} w={440} col={C.goldL} />
    {t > white && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1600 + (i * 37) % 190, top: 820 + (i * 23) % 50, width: 9, height: 9, borderRadius: "50%", background: "#f6efe0", opacity: e(t, white + i * 0.05, white + i * 0.05 + 0.2) }} />)}
    {t > specks && <><Lb t={t} a={specks} x={1300} y={780} txt="BLACK PEPPER = SPECKS" size={34} col={C.red} w={460} />{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1200 + (i * 41) % 200, top: 850 + (i * 19) % 50, width: 10, height: 10, borderRadius: "50%", background: "#171210" }} />)}<XM t={t} at={specks + 0.5} x={1300} y={875} s={60} /></>}
  </Stage>;
};

// 29 · LA REGLA DEL PICO: dos huevos rellenos al lado de una regla; el de mayonesa se va desplomando y brilla; el de aderezo cocido queda alto y mate — la regla marca la diferencia
export const PeakRuler: React.FC<M> = ({ t, a, out, m: [slumps, matte] }) => {
  const sl = ei(t, slumps - 0.4, slumps + 2.2);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="WHAT'S DIFFERENT" size={80} font={SANS} weight={900} />
    <div style={{ opacity: e(t, a + 0.2, a + 0.5) }}><Swirl x={1220} y={820} w={300} slump={sl} gloss={sl} /></div>
    <div style={{ opacity: e(t, a + 0.5, a + 0.8) }}><Swirl x={1680} y={820} w={300} slump={0} gloss={0.05} /></div>
    <Ob t={t} n="ruler" a={a + 0.8} x={1450} y={830} w={90} tf="rotate(-90deg)" origin="50% 50%" mh={400} />
    <Lb t={t} a={a + 0.4} x={1220} y={860} txt="MAYONNAISE" size={38} w={320} />
    <Lb t={t} a={a + 0.7} x={1680} y={860} txt="COOKED DRESSING" size={38} w={360} col={C.goldL} />
    <Lb t={t} a={slumps} x={1220} y={330} txt="SLUMPS · SHINY" size={44} col={C.red} w={360} />
    <Lb t={t} a={matte} x={1680} y={330} txt="STANDS · MATTE" size={44} col={GOOD} w={360} />
  </Stage>;
};

// 30 · LA CASCADA DEL RALLADOR: el cheddar baja por el lado fino del rallador y cae una lluvia de hebras naranjas; el pimiento entra; el relleno se vuelve naranja — «casados»
export const GraterCascade: React.FC<M> = ({ t, a, out, m: [jeal, pim, ched, finegr, orange, married] }) => {
  const rub = Math.sin((t - ched) * 7) * 40 * (t > ched ? 1 : 0), or = ei(t, orange - 0.2, orange + 1.2);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="VELMA GROFF'S" size={70} font={HAND} weight={700} col={C.goldL} />
    <Lb t={t} a={jeal} x={1450} y={200} txt="THE LUTHERAN LADIES WERE JEALOUS" size={34} w={720} />
    <Ob t={t} n="pimento" a={pim - 0.2} x={1150} y={880} w={160} from="left" />
    <Lb t={t} a={pim + 0.2} x={1150} y={900} txt="2 TBSP PIMENTO" size={30} w={260} font={HAND} />
    <Ob t={t} n="masher" a={ched - 0.4} x={1500} y={560} w={380} r={-30} />
    <Ob t={t} n="cheddar" a={ched - 0.2} x={1540 + rub} y={520} w={170} z={3} r={-30} />
    {t > ched && Array.from({ length: 24 }, (_, i) => { const u = ((t - ched) * 1.2 + i / 24) % 1; return <div key={i} style={{ position: "absolute", left: 1460 + Math.sin(i * 3.3) * 70, top: 600 + u * 260, width: 6, height: 26, borderRadius: 3, background: "#f19a2a", transform: `rotate(${(i * 47) % 90 - 45}deg)`, opacity: 1 - u }} />; })}
    <Lb t={t} a={finegr} x={1700} y={330} txt="THE FINE SIDE" size={44} col={C.goldL} w={340} />
    <div style={{ opacity: e(t, ched, ched + 0.4) }}><Swirl x={1460} y={980} w={260} col={or > 0 ? `rgb(${Math.round(lerp(242, 240, or))},${Math.round(lerp(201, 150, or))},${Math.round(lerp(76, 40, or))})` : "#f2c94c"} /></div>
    <Lb t={t} a={married} x={1750} y={880} txt="MARRIED OVERNIGHT" size={34} w={340} col={C.goldL} />
  </Stage>;
};

// 31 · LAS CLARAS QUE SE TIÑEN: las claras entran al frasco de remolacha; el jugo se vierte; un reloj de noche gira; al sacarlas son magenta por fuera y al cortarlas parecen flores
export const BeetSoak: React.FC<M> = ({ t, a, out, m: [dutch, wedding, pour, overnight, magenta, flowers] }) => {
  const dye = ei(t, overnight, magenta);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="RED BEET EGGS" size={86} font={SANS} weight={900} col="#e0569a" />
    <Lb t={t} a={dutch} x={1450} y={200} txt="PENNSYLVANIA DUTCH → IOWA" size={36} w={640} />
    <Lb t={t} a={wedding} x={1450} y={250} txt="EVERY MENNONITE WEDDING" size={36} w={640} col={C.goldL} />
    <Ob t={t} n="beetjar" a={a + 0.4} x={1250} y={940} w={220} mh={520} />
    {t > pour && <div style={{ position: "absolute", left: 1232, top: 470, width: 26, height: 420 * ei(t, pour, pour + 0.6), background: "linear-gradient(90deg,#6d0f3b,#b5205e,#6d0f3b)", borderRadius: 13, opacity: 1 - e(t, pour + 2, pour + 2.4) }} />}
    <Face t={t} a={overnight - 0.2} b={magenta} x={1660} y={430} r={110} h0={6} h1={18} op={1 - e(t, magenta, magenta + 0.4)} />
    <Lb t={t} a={overnight} x={1660} y={560} txt="OVERNIGHT" size={44} w={320} op={1 - e(t, magenta, magenta + 0.4)} />
    <Ob t={t} n="eggwhite" a={a + 0.8} x={1660} y={900} w={240} fl={`drop-shadow(0 10px 12px rgba(0,0,0,.4)) sepia(${dye.toFixed(2)}) hue-rotate(${(-60 * dye).toFixed(0)}deg) saturate(${(1 + 6 * dye).toFixed(2)}) brightness(${(1 - 0.25 * dye).toFixed(2)})`} op={1 - e(t, flowers - 0.3, flowers)} />
    <Ob t={t} n="beetegg" a={flowers - 0.3} x={1660} y={900} w={260} from="pop" />
    <Tx t={t} a={flowers} x={1660} y={500} txt="LIKE FLOWERS" size={64} font={SERIF} col="#f39bc5" w={500} />
  </Stage>;
};

// 32 · EL PROYECTOR DEL CÍRCULO MISIONERO: un proyector de diapositivas proyecta un cuadro de luz; cada «clac» cambia la diapositiva (curry, chutney, damasco) y el huevo con curry aterriza
export const SlideProjector: React.FC<M> = ({ t, a, out, m: [slides, ruth, curry, chutney, apricot, exotic] }) => {
  const S: [number, string, string][] = [[slides, "INDIA & AFRICA", "#3c6e8f"], [curry, "½ TSP CURRY", "#c88a1c"], [chutney, "1 TBSP MANGO CHUTNEY", "#8a4a1c"], [apricot, "OR APRICOT JAM", "#e09a3a"]];
  const cur = S.reduce((k, [at], i) => (t >= at ? i : k), 0), clk = sq(t, S[cur][0], 0.5);
  return <Stage t={t} a={a} out={out}>
    <Lb t={t} a={a + 0.1} x={1450} y={90} txt="THE MISSIONARY CIRCLE" size={50} w={720} col={C.goldL} />
    <Ob t={t} n="projector" a={a + 0.1} x={1150} y={960} w={300} />
    <div style={{ position: "absolute", left: 1210, top: 640, width: 600, height: 0, borderTop: "170px solid transparent", opacity: 0 }} />
    <div style={{ position: "absolute", left: 1260, top: 300, width: 600, height: 380, clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0 82%)", background: "linear-gradient(90deg,rgba(255,240,200,.05),rgba(255,240,200,.28))", opacity: e(t, slides, slides + 0.3) }} />
    {t > slides && <div style={{ position: "absolute", left: 1470, top: 200, width: 400, height: 300, background: `linear-gradient(160deg,${S[cur][2]},#1a0e08)`, border: "10px solid #fbf3e4", boxShadow: "0 0 60px rgba(255,236,190,.45)", transform: `scale(${(1 - clk * 0.3).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 46, color: C.cream, textAlign: "center", textShadow: ring("#1a0e08", 3) }}>{S[cur][1]}</div>}
    <Lb t={t} a={ruth} x={1670} y={530} txt="RUTH CARMODY" size={36} w={360} />
    <Ob t={t} n="curryegg" a={curry + 0.3} x={1600} y={940} w={240} from="drop" />
    <Tx t={t} a={exotic} x={1600} y={620} txt="EXOTIC!" size={80} font={HAND} weight={700} col={C.goldL} w={400} />
  </Stage>;
};

// 33 · EL RABANITO DE LA HUERTA: un rabanito sale de la tierra de un tirón (con tierra que salta), se ralla, se exprime en el repasador y las gotas caen; ciebollín picado llueve; junio→agosto
export const RadishPull: React.FC<M> = ({ t, a, out, m: [garden, social, grate, squeeze, chive, june, aug] }) => {
  const pull = cl(sp(t, a + 0.5, 1.4)), sqz = ei(t, squeeze, squeeze + 0.6);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="THE PARSONAGE GARDEN" size={64} font={SANS} weight={900} w={860} />
    <div style={{ position: "absolute", left: 1040, top: 820, width: 840, height: 140, borderRadius: "40% 40% 0 0", background: "linear-gradient(180deg,#5a3a20,#2e1c0e)", opacity: e(t, a, a + 0.3) }} />
    <Ob t={t} n="radish" a={a + 0.2} x={1200} y={lerp(900, 640, pull)} w={170} from="none" op={1 - e(t, grate, grate + 0.4)} z={2} />
    {t > a + 0.5 && <Puff t={t} a={a + 0.55} x={1200} y={820} n={12} spread={90} up={40} col="rgba(110,70,40,.9)" />}
    <Lb t={t} a={social} x={1200} y={320} txt="THE STRAWBERRY SOCIAL" size={36} w={380} col={C.goldL} />
    <Ob t={t} n="towel" a={grate - 0.2} x={1520} y={780} w={300} tf={`scaleX(${(1 - 0.35 * sqz).toFixed(3)}) rotate(${(20 * sqz).toFixed(1)}deg)`} />
    {t > squeeze + 0.3 && [0, 1, 2, 3].map((i) => { const u = ((t - squeeze) * 1.5 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: 1510 + i * 8, top: 790 + u * 140, width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(232,120,150,.85)", opacity: 1 - u }} />; })}
    <Lb t={t} a={squeeze} x={1520} y={420} txt="SQUEEZE OUT THE WATER" size={44} w={380} />
    <Ob t={t} n="chives" a={chive - 0.2} x={1760} y={600} w={200} from="right" />
    {t > chive && Array.from({ length: 16 }, (_, i) => { const u = ((t - chive) * 0.9 + i / 16) % 1; return <div key={i} style={{ position: "absolute", left: 1700 + (i * 29) % 140, top: 620 + u * 280, width: 7, height: 18, borderRadius: 3, background: "#3d8a3a", opacity: 1 - u }} />; })}
    <Lb t={t} a={june} x={1450} y={980} txt="JUNE" size={44} w={200} col={GOOD} />
    <Lb t={t} a={aug} x={1680} y={980} txt="AUGUST: TOO HOT" size={44} w={280} col={GOOD} />
  </Stage>;
};

// 34 · LA FILA DE FRASCOS DE LA CENA DE COSECHA: veinte frascos de chow-chow se alinean de a uno en un estante; una cucharada sale del primero (2 cucharadas) y cae al relleno
export const JarRow: React.FC<M> = ({ t, a, out, m: [relish, sept, jars20, twotb, picca] }) => {
  const sp2 = arc(t, twotb, 0.8, 1180, 520, 1600, 820, 160);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="CHOW-CHOW" size={100} font={SANS} weight={900} col="#9fd36a" />
    <Lb t={t} a={relish} x={1450} y={220} txt="CABBAGE · GREEN TOMATOES · PEPPERS" size={36} w={700} />
    <Lb t={t} a={sept} x={1450} y={270} txt="PUT UP IN SEPTEMBER · SERVED IN OCTOBER" size={36} w={700} col={C.goldL} />
    <div style={{ position: "absolute", left: 1040, top: 560, width: 840, height: 22, background: "linear-gradient(180deg,#a47a4c,#6b4a28)", boxShadow: "0 10px 16px rgba(0,0,0,.5)", opacity: e(t, a, a + 0.3) }} />
    {Array.from({ length: 10 }, (_, i) => <Ob key={i} t={t} n="chowchow" a={jars20 - 0.6 + i * 0.08} x={1090 + i * 82} y={560} w={70} mh={170} from="pop" />)}
    <Tx t={t} a={jars20} x={1450} y={610} txt="20 JARS" size={78} font={SANS} weight={900} col={C.goldL} w={420} />
    {t > twotb && <Ob t={t} n="spoon" a={twotb} x={sp2.x} y={sp2.y} w={160} from="none" r={-20} z={3} op={1 - e(t, twotb + 1, twotb + 1.3)} />}
    <div style={{ opacity: e(t, twotb - 0.3, twotb) }}><Swirl x={1600} y={1000} w={240} col="#e6c35a" /></div>
    <Lb t={t} a={twotb + 0.2} x={1280} y={860} txt="2 TBSP · DRAINED" size={40} w={360} />
    <Lb t={t} a={picca} x={1280} y={930} txt="OR PICCALILLI" size={40} w={360} col={C.goldL} />
  </Stage>;
};

// 35 · EL BOLETÍN DE LA IGLESIA: el plato se vacía en 4 minutos (cronómetro); Agnes, 90 años, aparece como un nombre escrito a mano; el boletín parroquial se despliega con la receta impresa
export const BulletinRecipe: React.FC<M> = ({ t, a, out, m: [hb, marlys, gone4, gotone, agnes, bulletin] }) => {
  const empt = ei(t, gone4 - 0.2, gone4 + 1.2), unf = ei(t, bulletin - 0.2, bulletin + 0.7);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="HORSERADISH & BACON" size={72} font={SANS} weight={900} col={C.goldL} w={860} />
    <Lb t={t} a={marlys} x={1450} y={200} txt="COUSIN MARLYS · LADIES' AID, DECORAH" size={34} w={760} />
    <Ob t={t} n="platter" a={hb + 0.3} x={1300} y={860} w={460} op={1 - 0.8 * empt} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(${(1 - empt).toFixed(2)})`} />
    <Face t={t} a={gone4 - 0.4} b={gone4 + 1.2} x={1720} y={480} r={100} h0={0} h1={4 / 60} op={1 - e(t, agnes, agnes + 0.4)} />
    <Lb t={t} a={gone4} x={1720} y={600} txt="GONE IN 4 MIN" size={42} col={C.red} w={360} op={1 - e(t, agnes, agnes + 0.4)} />
    <Lb t={t} a={gotone} x={1300} y={300} txt="I GOT ONE" size={50} w={360} font={HAND} />
    <Lb t={t} a={agnes} x={1720} y={300} txt="AGNES THOMPSON, 90" size={56} w={460} font={HAND} col={C.goldL} />
    <div style={{ position: "absolute", left: 1600, top: 380, width: 260, transform: `perspective(1200px) rotateY(${(-80 * (1 - unf)).toFixed(1)}deg)`, transformOrigin: "0% 50%", opacity: e(t, bulletin - 0.2, bulletin) }}><Img src={O("bulletin")} style={{ width: "100%", filter: "drop-shadow(0 16px 20px rgba(0,0,0,.5))" }} /></div>
  </Stage>;
};

// 36 · POLVO DE TOCINO: el rábano picante entra al relleno; cuatro tiras de tocino crujiente se parten y se pulverizan en una lluvia fina que cae sobre el pico
export const BaconDust: React.FC<M> = ({ t, a, out, m: [bacon, dust] }) => {
  const brk = ei(t, dust - 0.4, dust + 0.2);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="horseradish" a={a + 0.1} x={1200} y={900} w={200} />
    <Lb t={t} a={a + 0.4} x={1200} y={920} txt="1 TBSP HORSERADISH" size={32} w={320} font={HAND} />
    <div style={{ opacity: e(t, a + 0.3, a + 0.6) }}><Swirl x={1600} y={980} w={300} col="#eecf6c" /></div>
    <Ob t={t} n="bacon" a={bacon - 0.2} x={1600} y={520} w={420} op={1 - brk} tf={`scaleX(${(1 - 0.3 * brk).toFixed(3)})`} />
    {t > dust - 0.2 && Array.from({ length: 40 }, (_, i) => { const u = ((t - dust) * 0.7 + i / 40) % 1; return <div key={i} style={{ position: "absolute", left: 1540 + (i * 31) % 120, top: 540 + u * 330, width: 8 + (i % 3) * 3, height: 6 + (i % 2) * 3, borderRadius: 2, background: i % 3 ? "#8a3a1c" : "#c26a3a", opacity: (1 - u) * e(t, dust - 0.2, dust + 0.2) }} />; })}
    <Tx t={t} a={dust} x={1600} y={140} txt="BACON DUST" size={100} font={SANS} weight={900} col="#e0805a" w={600} />
  </Stage>;
};

// 37 · TRES GOLPES Y UNA ORACIÓN: «ácido · picante · salado» caen como tres pesas; al «can't stop at one» la mano (sombra) se lleva un huevo; el pastor (oración) llega tarde: la fuente vacía
export const ThreeHits: React.FC<M> = ({ t, a, out, m: [tangy, sharp, salty, cant, prayer] }) => {
  const W3: [string, string, number][] = [["TANGY", C.goldL, tangy], ["SHARP", "#ff9a7a", sharp], ["SALTY", C.cream, salty]];
  return <Stage t={t} a={a} out={out}>
    {W3.map(([w, c, at], i) => <Tx key={i} t={t} a={at} y={140 + i * 140} txt={w} size={100} font={SANS} weight={900} col={c} rot={[-4, 3, -2][i]} />)}
    <Ob t={t} n="devplain" a={a + 0.2} x={1450} y={940} w={300} tf={`translate(${(-600 * ei(t, cant + 0.4, cant + 1.2)).toFixed(0)}px, ${(-200 * ei(t, cant + 0.4, cant + 1.2)).toFixed(0)}px)`} />
    <Lb t={t} a={cant} x={1450} y={620} txt="YOU CAN'T STOP AT ONE" size={44} w={620} />
    <Lb t={t} a={prayer} x={1450} y={700} txt="GONE BEFORE THE PRAYER" size={44} w={620} col={C.goldL} />
  </Stage>;
};

// 38 · MITAD Y MITAD: una fuente redonda se parte con una línea dorada; doce de un relleno caen de un lado, doce del otro del otro lado
export const SplitPlate: React.FC<M> = ({ t, a, out, m: [split, twelve] }) => {
  const R = 300, X = 1450, Y = 600, k = cl(sp(t, a));
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={80} txt="1 DOZEN · 2 KINDS" size={80} font={SANS} weight={900} col={C.goldL} />
    <div style={{ position: "absolute", left: X - R, top: Y - R * 0.62, width: 2 * R, height: 1.24 * R, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%,#ffffff,#e9e3d6 70%,#bdb4a2)", boxShadow: "0 30px 40px rgba(0,0,0,.55)", transform: `scale(${(0.5 + 0.5 * k).toFixed(3)})`, opacity: cl(k * 3) }} />
    <Stroke t={t} a={split} d={`M ${X} ${Y - R * 0.6} L ${X} ${Y + R * 0.6}`} col={C.gold} sw={10} dur={0.5} len={500} />
    {Array.from({ length: 12 }, (_, i) => { const side = i < 6 ? -1 : 1, j = i % 6, x = X + side * (90 + (j % 2) * 110), y = Y - 130 + Math.floor(j / 2) * 120; return <Ob key={i} t={t} n={side < 0 ? "beetegg" : "devplain"} a={split + 0.4 + i * 0.12} x={x} y={y + 40} w={110} from="pop" />; })}
    <Lb t={t} a={twelve} x={X - 160} y={850} txt="12 OF ONE" size={44} w={300} />
    <Lb t={t} a={twelve + 0.6} x={X + 160} y={850} txt="12 OF ANOTHER" size={44} w={320} col={C.goldL} />
  </Stage>;
};

// 39 · LA CURVA DEL CAMINO: las claras en un recipiente y el relleno en una bolsa viajan separados dentro de una caja; la caja toma una curva (todo se inclina) y nada se mueve
export const CarryCurve: React.FC<M> = ({ t, a, out, m: [neverhome, atchurch, curve] }) => {
  const tilt = t > curve ? Math.sin(Math.min(Math.PI, (t - curve) * 2.2)) * 16 : 0, drive = (t - a) * 30;
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={neverhome} y={90} txt="NEVER FILL THEM AT HOME" size={66} font={SANS} weight={900} w={860} col={C.goldL} />
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((1040 + i * 140 - drive * 6) % 900 + 900) % 900 + 1000, top: 990, width: 70, height: 10, background: "rgba(251,243,228,.6)", opacity: e(t, a, a + 0.3) }} />)}
    <div style={{ position: "absolute", inset: 0, transform: `rotate(${tilt.toFixed(2)}deg)`, transformOrigin: "1450px 940px" }}>
      <Ob t={t} n="icepan" a={a + 0.3} x={1250} y={540} w={330} fl="drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(.2) brightness(1.1)" />
      <Lb t={t} a={a + 0.6} x={1250} y={560} txt="WHITES" size={40} w={260} />
      <Ob t={t} n="ziplock" a={a + 0.8} x={1620} y={540} w={180} />
      <Lb t={t} a={a + 1.1} x={1620} y={560} txt="FILLING" size={40} w={260} />
    </div>
    <Lb t={t} a={atchurch} x={1450} y={220} txt="FILL THEM AT THE CHURCH" size={46} w={660} col={GOOD} />
    <Lb t={t} a={curve} x={1450} y={290} txt="NOTHING SLIDES ON A CURVE" size={46} w={660} />
  </Stage>;
};

// 40 · LA BOLSA CORTADA: el relleno va a una esquina de la bolsa; la tijera corta medio pulgada (se dibuja la medida); la bolsa aprieta y sale un remolino que se arma en la clara; la bolsa vuela a la basura
export const ZipSnip: React.FC<M> = ({ t, a, out, m: [snip, swirl, nowash] }) => {
  const cut = ei(t, snip - 0.2, snip + 0.2), sw = ei(t, swirl - 0.2, swirl + 1.4), toss = ei(t, nowash, nowash + 0.7);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="A PLAIN STORAGE BAG" size={74} font={SANS} weight={900} />
    <Ob t={t} n="ziplock" a={a + 0.2} x={1450 + 400 * toss} y={620 - 300 * toss} w={240} r={-150 + 200 * toss} origin="50% 50%" op={1 - e(t, nowash + 0.5, nowash + 0.7)} />
    <Ob t={t} n="scissors" a={snip - 0.5} x={1600} y={720} w={220} from="right" r={-30 + 30 * cut} op={1 - e(t, snip + 0.8, snip + 1.1)} z={3} />
    <Lb t={t} a={snip + 0.2} x={1700} y={480} txt="SNIP ½ INCH" size={46} w={340} col={C.goldL} />
    <div style={{ opacity: e(t, swirl - 0.3, swirl) }}><Swirl x={1450} y={980} w={300} slump={1 - sw} /></div>
    <Lb t={t} a={swirl + 0.6} x={1180} y={760} txt="IT HOLDS THE SWIRL" size={36} w={360} col={GOOD} />
    <Lb t={t} a={nowash} x={1700} y={300} txt="NO PASTRY BAG TO WASH" size={40} w={460} />
  </Stage>;
};

// 41 · EL RELOJ DE ARENA DE LA MESA: termómetro a 40°F y un reloj de arena de dos horas que corre; si hace más de 90°F el reloj se achica a una hora
export const Hourglass: React.FC<M> = ({ t, a, out, m: [f40, two, f90] }) => {
  const hot = ei(t, f90 - 0.2, f90 + 0.6), sand = ei(t, two, out + 2), S = 1 - 0.35 * hot, X = 1600, Y = 560;
  return <Stage t={t} a={a} out={out}>
    <Tag t={t} a={a + 0.2} x={1450} y={90} txt="PAGE 9" w={240} />
    <Dial t={t} a={f40 - 0.3} x={1180} y={480} v={lerp(70, 40, ei(t, f40 - 0.3, f40 + 0.6))} r={150} hot={40} />
    <Lb t={t} a={f40} x={1180} y={680} txt="40°F OR COLDER" size={44} w={360} col={GOOD} />
    {t > two - 0.3 && <div style={{ position: "absolute", left: X - 120, top: Y - 230, width: 240, height: 460, transform: `scale(${S.toFixed(3)}) rotate(${(-180 * (1 - cl(sp(t, two - 0.3)))).toFixed(1)}deg)`, opacity: e(t, two - 0.3, two) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, background: "#7a5a3a", borderRadius: 6 }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, background: "#7a5a3a", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 20, right: 20, top: 22, bottom: 22, clipPath: "polygon(0 0,100% 0,55% 50%,100% 100%,0 100%,45% 50%)", background: "rgba(255,255,255,.25)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 208 * sand, height: 208 * (1 - sand), background: "#e6c070", clipPath: "polygon(0 0,100% 0,55% 100%,45% 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 208 * sand, background: "#e6c070" }} />
      </div></div>}
    <Lb t={t} a={two} x={X} y={820} txt={hot > 0.5 ? "1 HOUR" : "2 HOURS MAX"} size={56} w={420} col={hot > 0.5 ? C.red : C.goldL} />
    <Lb t={t} a={f90} x={X} y={890} txt="OVER 90°F OUTSIDE" size={38} w={420} col={C.red} />
  </Stage>;
};

// 42 · LA BANDEJA DE HIELO: la asadera de hielo picado cae y escupe cubitos; la fuente se apoya encima; de 48 sale UNA fuente y la otra espera; al «swap» se cruzan en arco
export const IceTraySwap: React.FC<M> = ({ t, a, out, m: [crushed, ontop, f48, swap] }) => {
  const sw = ei(t, swap, swap + 1.0);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="ONE PLATE OUT · ONE BACK" size={64} font={SANS} weight={900} col={C.goldL} w={860} />
    <Ob t={t} n="icepan" a={crushed - 0.2} x={1300} y={900} w={460} />
    <Puff t={t} a={crushed + 0.2} x={1300} y={850} n={14} spread={200} up={40} col="rgba(220,240,255,.95)" />
    <Ob t={t} n="platter" a={ontop - 0.2} x={lerp(1300, 1720, sw)} y={lerp(830, 640, sw) - Math.sin(Math.PI * sw) * 160} w={380} from="drop" z={2} />
    <Ob t={t} n="cooler" a={f48 - 0.2} x={1720} y={900} w={260} from="right" />
    <Ob t={t} n="platter" a={f48 + 0.3} x={lerp(1720, 1300, sw)} y={lerp(640, 830, sw) - Math.sin(Math.PI * sw) * 160} w={300} from="up" z={3} />
    <Lb t={t} a={f48} x={1720} y={460} txt="NOT ALL 48 AT ONCE" size={38} w={420} />
    <Lb t={t} a={swap + 0.4} x={1500} y={300} txt="SWAP" size={70} w={300} col={GOOD} />
  </Stage>;
};

// 43 · EL RELOJ MANDA: el reloj de pared marca más de dos horas; la tapa del tacho se abre y la fuente se inclina hacia adentro; «nadie debería enfermarse»
export const ClockTrash: React.FC<M> = ({ t, a, out, m: [trash, nobody] }) => {
  const tip = ei(t, trash + 0.2, trash + 1.0), lid = ei(t, trash - 0.2, trash + 0.2);
  return <Stage t={t} a={a} out={out}>
    <Face t={t} a={a + 0.2} b={trash} x={1220} y={380} r={160} h0={1} h1={3.2} />
    <Lb t={t} a={a + 0.8} x={1220} y={570} txt="OVER 2 HOURS?" size={48} w={400} col={C.red} />
    <div style={{ position: "absolute", left: 1600, top: 640, width: 220, height: 320, borderRadius: "10px 10px 26px 26px", background: "linear-gradient(90deg,#6c7176,#b8bdc2,#6c7176)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", opacity: e(t, a + 0.4, a + 0.7) }} />
    <div style={{ position: "absolute", left: 1585, top: 610, width: 250, height: 36, borderRadius: 14, background: "linear-gradient(180deg,#c4c8cc,#7b8085)", transformOrigin: "100% 100%", transform: `rotate(${(75 * lid).toFixed(1)}deg)`, opacity: e(t, a + 0.4, a + 0.7) }} />
    <Ob t={t} n="platter" a={a + 0.9} x={lerp(1400, 1700, tip)} y={lerp(800, 700, tip)} w={300} from="left" tf={`rotate(${(55 * tip).toFixed(1)}deg)`} op={1 - e(t, trash + 0.9, trash + 1.2)} />
    <Tx t={t} a={trash} x={1450} y={120} txt="THEY GO IN THE TRASH" size={64} font={SANS} weight={900} w={860} />
    <Lb t={t} a={nobody} x={1450} y={260} txt="NOBODY SHOULD GET SICK FROM A CHURCH SUPPER" size={32} w={860} col={C.goldL} />
  </Stage>;
};

// 44 · EL PICNIC DE 1957: sol que pega fuerte sobre tres fuentes; el termómetro trepa a 94; el reloj corre de las 11 a las 2; 11 muñequitos se tumban; la regla nueva se clava
export const Picnic57: React.FC<M> = ({ t, a, out, m: [f94, t11, t2, sick, rule] }) => {
  const sun = cl(sp(t, a + 0.2));
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} x={1250} y={80} txt="JULY 4, 1957" size={72} font={SANS} weight={900} col={C.goldL} w={560} />
    <div style={{ position: "absolute", left: 1640, top: 90, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,#fff6c0,#ffc840 55%,rgba(255,160,40,0) 72%)", transform: `scale(${(0.4 + 0.6 * sun + 0.05 * Math.sin((t - a) * 4)).toFixed(3)})`, opacity: sun }} />
    <Lb t={t} a={f94} x={1740} y={300} txt="94°F" size={70} w={260} col="#ff9a5a" />
    {[0, 1, 2].map((i) => <Ob key={i} t={t} n="platter" a={a + 0.5 + i * 0.2} x={1140 + i * 270} y={600} w={240} fl={`drop-shadow(0 10px 12px rgba(0,0,0,.4)) brightness(${(1 + 0.25 * ei(t, t11, t2)).toFixed(2)}) sepia(${(0.5 * ei(t, t11, sick)).toFixed(2)})`} />)}
    <Face t={t} a={t11 - 0.3} b={t2 + 0.6} x={1250} y={330} r={90} h0={11} h1={14} op={1 - e(t, sick - 0.2, sick)} />
    <Lb t={t} a={t11} x={1250} y={440} txt="11 AM → 2 PM" size={38} w={320} op={1 - e(t, sick - 0.2, sick)} />
    {t > sick && Array.from({ length: 11 }, (_, i) => { const x = 1080 + i * 75, fall = ei(t, sick + 0.3 + i * 0.12, sick + 0.6 + i * 0.12); return <div key={i} style={{ position: "absolute", left: x, top: 730, width: 40, height: 120, transform: `rotate(${(85 * fall).toFixed(0)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 34, height: 34, margin: "0 auto", borderRadius: "50%", background: C.cream }} /><div style={{ width: 12, height: 80, margin: "0 auto", background: C.cream, borderRadius: 6 }} /></div>; })}
    <Lb t={t} a={sick + 0.2} x={1450} y={880} txt="11 PEOPLE SICK · THE PASTOR TOO" size={42} w={760} col={C.red} />
    <Tag t={t} a={rule} x={1450} y={430} txt="THE NEW RULE" w={400} />
  </Stage>;
};

// 45 · LA PRUEBA DE UNA HORA: dos fuentes en la mesada; el reloj corre una hora entera; el de mayonesa se desploma, brilla y larga un anillo de aceite; el cocido queda igual; los dos a la basura
export const OneHourTest: React.FC<M> = ({ t, a, out, m: [storemayo, side, hour, soft, oilring, same2, bothtrash, flourcook, oilegg] }) => {
  const sl = ei(t, hour, soft + 1.0), oil = ei(t, oilring - 0.2, oilring + 0.8), bin = ei(t, bothtrash, bothtrash + 0.8), why = t > flourcook - 0.3;
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={70} txt="MY LITTLE EXPERIMENT" size={66} font={SANS} weight={900} col={C.goldL} w={860} />
    <Face t={t} a={hour - 0.4} b={soft} x={1450} y={330} r={110} h0={0} h1={1} op={1 - e(t, bothtrash - 0.2, bothtrash)} />
    <Lb t={t} a={hour} x={1450} y={460} txt="1 HOUR · 70°F" size={40} w={340} op={1 - e(t, bothtrash - 0.2, bothtrash)} />
    <div style={{ opacity: e(t, storemayo - 0.3, storemayo) * (1 - bin), transform: `translateY(${(300 * bin * bin).toFixed(0)}px)` }}><Swirl x={1180} y={860} w={280} slump={sl} gloss={sl} oil={oil} /></div>
    <div style={{ opacity: e(t, side - 0.3, side) * (1 - bin), transform: `translateY(${(300 * bin * bin).toFixed(0)}px)` }}><Swirl x={1720} y={860} w={280} slump={0} gloss={0.05} /></div>
    <Lb t={t} a={storemayo} x={1180} y={890} txt="STORE MAYO" size={38} w={320} op={1 - bin} />
    <Lb t={t} a={side} x={1720} y={890} txt="COOKED DRESSING" size={38} w={360} col={C.goldL} op={1 - bin} />
    <Lb t={t} a={oilring} x={1180} y={560} txt="A RING OF OIL" size={42} col={C.red} w={340} op={1 - bin} />
    <Lb t={t} a={same2} x={1720} y={560} txt="EXACTLY THE SAME" size={42} col={GOOD} w={380} op={1 - bin} />
    <Lb t={t} a={bothtrash} x={1450} y={600} txt="BOTH IN THE TRASH" size={50} w={560} op={1 - e(t, flourcook - 0.4, flourcook - 0.1)} />
    {why && <><Lb t={t} a={flourcook} x={1450} y={300} txt="FLOUR + COOKED EGG = IT STANDS" size={44} w={760} col={GOOD} /><Lb t={t} a={oilegg} x={1450} y={380} txt="MAYO = OIL THAT SOFTENS WARM" size={44} w={760} col={C.red} /></>}
  </Stage>;
};

// 46 · EL OJITO DE ACEITUNA: una rodaja de aceituna con su pimiento cae girando sobre el remolino y «mira»: le salen dos pestañas dibujadas; después pimentón espolvoreado y tocino
export const OliveEye: React.FC<M> = ({ t, a, out, m: [olive, eye, paprika, baconon, nothingbeet] }) => {
  const o = arc(t, olive, 0.6, 1700, 200, 1450, 640, 80);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={80} txt="DECORATING" size={90} font={SANS} weight={900} col={C.goldL} />
    <div style={{ opacity: e(t, a + 0.2, a + 0.5) }}><Swirl x={1450} y={860} w={340} /></div>
    {t > olive && <Img src={O("olive")} style={{ position: "absolute", left: o.x - 50, top: o.y - 50, width: 100, transform: `rotate(${((1 - o.k) * 720).toFixed(0)}deg) scaleY(${(o.k < 1 ? 0.6 + 0.4 * Math.abs(Math.cos(o.k * 6)) : 1).toFixed(3)})`, filter: "drop-shadow(0 6px 6px rgba(0,0,0,.45))" }} />}
    {t > eye && <Stroke t={t} a={eye} d="M 1395 585 L 1380 560 M 1420 578 L 1415 550 M 1480 578 L 1485 550 M 1505 585 L 1520 560" col={C.cream} sw={6} dur={0.4} len={200} />}
    <Lb t={t} a={eye} x={1450} y={300} txt="A LITTLE EYE LOOKING UP" size={44} w={620} />
    <Ob t={t} n="paprika" a={paprika - 0.2} x={1170} y={760} w={180} from="left" r={-40 * e(t, paprika, paprika + 0.4)} />
    {t > paprika && Array.from({ length: 18 }, (_, i) => { const u = ((t - paprika) * 1 + i / 18) % 1; return <div key={i} style={{ position: "absolute", left: 1240 + u * 140 + Math.sin(i) * 20, top: 600 + u * 120 + (i % 4) * 10, width: 7, height: 7, borderRadius: 2, background: "#c0392b", opacity: 1 - u }} />; })}
    <Lb t={t} a={paprika + 0.2} x={1170} y={790} txt="PAPRIKA" size={38} w={260} col="#ff8a6a" />
    <Ob t={t} n="bacon" a={baconon - 0.2} x={1740} y={760} w={240} from="right" />
    <Lb t={t} a={baconon + 0.2} x={1740} y={790} txt="BACON DUST" size={38} w={300} col="#e0805a" />
    <Lb t={t} a={nothingbeet} x={1450} y={950} txt="BEET EGGS: NOTHING · THEY'RE PRETTY ENOUGH" size={34} w={860} col="#f39bc5" />
  </Stage>;
};

// 47 · LA CINTA DEL SÁBADO: una cinta transportadora corre de izquierda a derecha y pasan, de a uno, los pasos del sábado (cartón, vapor, huevo pelado, yemas, bolsas); el domingo llega la heladerita
export const Conveyor: React.FC<M> = ({ t, a, out, m: [sun2] }) => {
  const I = ["carton", "steamer", "eggpeeled", "yolks", "ziplock"], L = ["CARTON ON ITS SIDE", "STEAM", "PEEL & HALVE", "MASH & MIX", "WHITES · BAGS"], sp0 = 150, belt = (t - a) * sp0;
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt={t < sun2 ? "SATURDAY MORNING" : "SUNDAY"} size={84} font={SANS} weight={900} col={C.goldL} />
    <div style={{ position: "absolute", left: 1020, top: 800, width: 860, height: 44, borderRadius: 22, background: `repeating-linear-gradient(90deg,#3a3f45 0 40px,#2a2e33 40px 80px)`, backgroundPosition: `${belt.toFixed(0)}px 0`, boxShadow: "0 16px 24px rgba(0,0,0,.55)", opacity: e(t, a, a + 0.3) }} />
    {I.map((n, i) => { const x = 1000 + ((t - a) - i * 2.6) * sp0; if (x < 960 || x > 1960 || t > sun2) return null; const ctr = Math.abs(x - 1450) < 140;
      return <React.Fragment key={i}><Ob t={t} n={n} a={a + i * 2.6} x={x} y={800} w={ctr ? 230 : 180} from="none" mh={300} /><Lb t={t} a={a + i * 2.6 + 1.6} x={1450} y={300} txt={L[i]} size={50} w={600} op={ctr ? 1 : 0} /></React.Fragment>; })}
    <Ob t={t} n="cooler" a={sun2} x={1450} y={800} w={320} from="drop" />
    <Lb t={t} a={sun2 + 0.4} x={1450} y={300} txt="INTO THE COOLER WITH ICE PACKS" size={46} w={760} />
  </Stage>;
};

// 48 · EL CAJÓN DE MRS. THORSEN: cinco cosas que nunca hacía salen de un cajón de madera que se abre, una por vez, y cada una recibe su tachadura
export const Drawer: React.FC<M> = ({ t, a, out, m: [n1, n2, n3, n4, n5] }) => {
  const R: [string, string, number][] = [["ziplock", "FILL AT HOME", n1], ["spoon", "A FORK FOR THE YOLKS", n2], ["mustardcan", "PREPARED MUSTARD IN THE DRESSING", n3], ["platter", "A PLATE IN THE SUN", n4], ["dressbowl", "THROW OUT THE DRESSING", n5]];
  const cur = R.reduce((k, [, , at], i) => (t >= at - 0.4 ? i : k), 0), at = R[cur][2], op = ei(t, a, a + 0.5);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="SHE NEVER…" size={100} font={HAND} weight={700} col={C.goldL} />
    <div style={{ position: "absolute", left: 1150, top: 760, width: 600, height: 200, background: "linear-gradient(180deg,#8a6236,#5a3e22)", border: "8px solid #6b4a28", borderRadius: 10, boxShadow: "0 20px 30px rgba(0,0,0,.55)", transform: `translateY(${(60 * (1 - op)).toFixed(0)}px)` }}><div style={{ position: "absolute", left: 260, top: 80, width: 80, height: 22, borderRadius: 10, background: C.gold }} /></div>
    <Ob key={cur} t={t} n={R[cur][0]} a={at - 0.4} x={1450} y={700} w={280} from="up" mh={330} />
    <XM t={t} at={at + 0.5} x={1450} y={560} s={110} />
    <Lb t={t} a={at - 0.2} x={1450} y={250} txt={R[cur][1]} size={50} w={820} />
    {R.map((_, i) => <div key={i} style={{ position: "absolute", left: 1290 + i * 70, top: 990, width: 40, height: 40, borderRadius: "50%", background: i <= cur ? C.red : "rgba(251,243,228,.35)", opacity: op }} />)}
  </Stage>;
};

// 49 · LA GOMA DE BORRAR: un huevo relleno entra al freezer (escarcha) y sale como una goma de borrar rosa que rebota; «sin huevo» el pico no se para
export const FreezeEraser: React.FC<M> = ({ t, a, out, m: [freeze, eraser, noegg] }) => {
  const fr = ei(t, freeze, freeze + 1.0), sw = ei(t, eraser - 0.3, eraser + 0.2), bo = t > eraser ? Math.abs(Math.sin((t - eraser) * 6)) * 80 * Math.exp(-(t - eraser) * 2) : 0, ne = t > noegg - 0.3;
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="CAN YOU FREEZE THEM?" size={70} font={SANS} weight={900} w={860} />
    {!ne && <Ob t={t} n={sw < 0.5 ? "devplain" : "eraser"} a={a + 0.3} x={1450} y={820 - bo} w={sw < 0.5 ? 300 : 260} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) ${sw < 0.5 ? `saturate(${(1 - 0.8 * fr).toFixed(2)}) brightness(${(1 + 0.4 * fr).toFixed(2)})` : ""}`} />}
    {!ne && fr > 0 && sw < 0.5 && <div style={{ position: "absolute", left: 1270, top: 540, width: 360, height: 300, background: "radial-gradient(closest-side, rgba(220,240,255,.55), rgba(220,240,255,0))", opacity: fr }} />}
    {!ne && <Tx t={t} a={eraser} y={300} txt="NO, HONEY" size={90} font={HAND} weight={700} col={C.red} />}
    {!ne && <Lb t={t} a={eraser + 0.4} x={1450} y={420} txt="RUBBERY · LIKE A PENCIL ERASER" size={42} w={760} />}
    {ne && <><div style={{ opacity: e(t, noegg - 0.3, noegg) }}><Swirl x={1250} y={860} w={280} slump={0.85} /></div><div style={{ opacity: e(t, noegg, noegg + 0.3) }}><Swirl x={1680} y={860} w={280} /></div>
      <Lb t={t} a={noegg} x={1250} y={890} txt="NO EGG" size={40} w={260} col={C.red} /><Lb t={t} a={noegg + 0.3} x={1680} y={890} txt="WITH THE EGG" size={40} w={300} col={GOOD} />
      <Lb t={t} a={noegg + 0.6} x={1450} y={330} txt="THE EGG MAKES IT STAND UP" size={46} w={700} /></>}
  </Stage>;
};

// 50 · EL ÁRBOL DE PRIMOS: un frasco genérico de aderezo dulce y el bol del aderezo cocido se unen por una rama dorada a un abuelo común (mayonesa + aderezo cocido); 1930s
export const CousinTree: React.FC<M> = ({ t, a, out, m: [cousin, thirties] }) => {
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={80} txt="MIRACLE WHIP?" size={80} font={SANS} weight={900} />
    <Ob t={t} n="mayojar" a={a + 0.4} x={1180} y={480} w={150} />
    <Lb t={t} a={a + 0.6} x={1180} y={500} txt="MAYONNAISE" size={34} w={260} />
    <Ob t={t} n="dressbowl" a={a + 0.8} x={1720} y={480} w={220} />
    <Lb t={t} a={a + 1.0} x={1720} y={500} txt="COOKED DRESSING" size={34} w={320} col={C.goldL} />
    <Stroke t={t} a={cousin - 0.2} d="M 1180 560 Q 1180 700 1450 720 Q 1720 700 1720 560" col={C.gold} sw={10} dur={0.8} len={900} />
    <Ob t={t} n="mayojar" a={cousin + 0.4} x={1450} y={930} w={150} from="up" fl="drop-shadow(0 12px 16px rgba(0,0,0,.4)) sepia(.6) hue-rotate(-10deg) saturate(1.4)" />
    <Lb t={t} a={cousin + 0.6} x={1450} y={950} txt="A COUSIN · SWEET & TANGY" size={36} w={500} col={C.goldL} />
    <Tag t={t} a={thirties} x={1450} y={250} txt="1930s" w={240} />
  </Stage>;
};

// 51 · LA CAJA REGISTRADORA: cada costo salta en la cinta del ticket con un «clinc»; la suma da 70¢; del otro lado la taza de mayonesa marca $1.10 y la balanza se inclina
export const RegisterTotal: React.FC<M> = ({ t, a, out, m: [egg25, milk12, vin8, rest25, c70, mayo110] }) => {
  const R: [string, number, number][] = [["EGG", 25, egg25], ["½ CUP MILK", 12, milk12], ["¼ CUP VINEGAR", 8, vin8], ["SUGAR · FLOUR · MUSTARD · SALT · BUTTER", 25, rest25]];
  const tl = ei(t, mayo110 + 0.4, mayo110 + 1.4);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="register" a={a + 0.1} x={1220} y={960} w={340} />
    <div style={{ position: "absolute", left: 1080, top: 140, width: 300, height: 520, background: "linear-gradient(180deg,#fffdf6,#f1e9d6)", boxShadow: "0 16px 26px rgba(0,0,0,.5)", transform: `scaleY(${cl(sp(t, a + 0.3)).toFixed(3)})`, transformOrigin: "50% 100%", fontFamily: "monospace", color: C.ink, padding: "18px 16px", boxSizing: "border-box" }}>
      {R.map(([l, c, at], i) => t > at ? <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: i === 3 ? 20 : 28, fontWeight: 700, marginBottom: 16, opacity: e(t, at, at + 0.2) }}><span style={{ maxWidth: 200 }}>{l}</span><span>{c}¢</span></div> : null)}
      {t > c70 && <div style={{ borderTop: "3px dashed #6b5a48", marginTop: 10, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 44, fontWeight: 900, color: "#2f6a35" }}><span>1 CUP</span><span>70¢</span></div>}
    </div>
    <Ob t={t} n="mayojar" a={mayo110 - 0.3} x={1700} y={lerp(780, 860, tl)} w={180} from="right" />
    <Tag t={t} a={mayo110} x={1700} y={lerp(360, 440, tl)} txt="$1.10" w={240} col={C.red} />
    <Tx t={t} a={c70} x={1700} y={130} txt="STILL CHEAPER" size={64} font={SANS} weight={900} col={GOOD} w={460} />
  </Stage>;
};

// 52 · LA TARJETA ESCRITA A MANO: la receta entera se escribe en una tarjeta con letra de abuela, renglón por renglón con la voz (la tinta corre detrás de la pluma)
export const RecipeCardHand: React.FC<M & { lines: { at: number; txt: string }[] }> = ({ t, a, out, lines }) => {
  const k = cl(sp(t, a));
  return <Stage t={t} a={a} out={out} veil={0.66}>
    <div style={{ position: "absolute", left: 1040, top: 120, width: 820, height: 820, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 63px, rgba(70,110,170,.25) 63px 65px), linear-gradient(180deg,#fffaf0,#f3e5cb)", borderRadius: 14, boxShadow: "0 30px 50px rgba(0,0,0,.6)", transform: `rotate(${(-2 + 6 * (1 - k)).toFixed(2)}deg) translateY(${((1 - k) * 600).toFixed(0)}px)`, padding: "34px 40px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: HAND, fontSize: 54, color: C.wine, fontWeight: 700, marginBottom: 6 }}>Mrs. Thorsen's Dressing</div>
      {lines.map((l, i) => { const w = ei(t, l.at, l.at + Math.max(0.8, l.txt.length * 0.045)); return t > l.at ? <div key={i} style={{ fontFamily: HAND, fontSize: 40, fontWeight: 600, color: "#1c2f63", height: 64, lineHeight: "64px", whiteSpace: "nowrap", overflow: "hidden", width: `${(w * 100).toFixed(1)}%` }}>{l.txt}</div> : null; })}
    </div>
  </Stage>;
};

// 53 · LA BANDEJA GIRATORIA DE LOS SEIS: los seis huevos en una bandeja que gira despacio; el que se nombra pasa adelante y crece; al final el de Decorah queda al frente con un brillo
export const SixTray: React.FC<M & { names: string[]; step: number }> = ({ t, a, out, names, step }) => {
  const N6 = ["devplain", "beetegg", "curryegg", "halfegg_yolk", "devslump", "devplain"], idx = Math.min(5, Math.max(0, Math.floor((t - a - 0.6) / step))), rot = lerp(0, -idx * 60, 1) - 60 * (ei(t, a + 0.6 + idx * step, a + 0.6 + idx * step + 0.8) - 1);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={80} txt="THE SIX" size={100} font={SANS} weight={900} col={C.goldL} />
    {N6.map((n, i) => { const an = (i * 60 + rot) * Math.PI / 180, x = 1450 + Math.sin(an) * 330, z = Math.cos(an), y = 720 + z * 110, s = 0.6 + 0.4 * (z + 1) / 2 + (i === idx ? 0.25 : 0);
      return <div key={i} style={{ position: "absolute", left: x - 110 * s, top: y - 150 * s, width: 220 * s, zIndex: Math.round(z * 10) + 10, opacity: e(t, a + 0.1 + i * 0.1, a + 0.4 + i * 0.1) * (0.5 + 0.5 * (z + 1) / 2), filter: i === idx ? `drop-shadow(0 0 30px rgba(255,200,110,.8))` : `brightness(${(0.6 + 0.4 * (z + 1) / 2).toFixed(2)})` }}><Img src={O(n)} style={{ width: "100%" }} /></div>; })}
    <Lb key={idx} t={t} a={a + 0.6 + idx * step} x={1450} y={250} txt={names[idx]} size={50} w={820} />
  </Stage>;
};

// 54 · LA OLLITA EN EL CLAVO: la bolsa de papel de 1969 cae, de adentro sale la ollita abollada que se cuelga sola de un clavo en la pared; la frase de Mrs. Thorsen queda escrita a mano
export const PanOnNail: React.FC<M> = ({ t, a, out, m: [y1969, sack, never, nail] }) => {
  const outk = ei(t, sack + 0.6, sack + 1.4), hang = ei(t, nail - 0.3, nail + 0.6), sw = Math.sin((t - nail) * 3) * 6 * Math.exp(-(t - nail) * 0.8);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={y1969} x={1250} y={90} txt="1969" size={130} font={SANS} weight={900} col={C.goldL} w={420} />
    <Ob t={t} n="sack" a={sack - 0.2} x={1300} y={940} w={300} />
    <div style={{ position: "absolute", left: 1700 - 7, top: 300, width: 14, height: 14, borderRadius: "50%", background: "#9aa0a6", boxShadow: "0 3px 4px rgba(0,0,0,.6)", opacity: e(t, a, a + 0.4) }} />
    {t > sack + 0.6 && <div style={{ position: "absolute", left: lerp(1300, 1700, hang) - 130, top: lerp(lerp(800, 560, outk), 300, hang) - 20, width: 260, transform: `rotate(${(lerp(0, -90, hang) + sw).toFixed(2)}deg)`, transformOrigin: "92% 20%", opacity: e(t, sack + 0.6, sack + 0.9) }}><Img src={O("saucepan")} style={{ width: "100%", filter: "drop-shadow(0 14px 16px rgba(0,0,0,.55))" }} /></div>}
    <Tx t={t} a={never} x={1450} y={760} txt="THE ONLY ONE WHO NEVER STOPPED STIRRING" size={60} font={HAND} weight={700} w={860} />
  </Stage>;
};
