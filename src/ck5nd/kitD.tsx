// ck5nd · kitC = componentes de Funeral Ham Buns: escenas de OBJETOS REALES recortados (public/ck5nd/obj) + piezas CSS (panes cenitales, cortes, relojes)
// que caen de a uno con resorte con peso; texto grande con contorno; un momento wow por componente. Viven a la derecha (x 1000-1890).
import React from "react";
import { Img, staticFile } from "remotion";
import { e, ei } from "../kits/yanqui3d/lib";
import { C, HAND, SANS, SERIF } from "./ui";

const cl = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const O = (n: string) => staticFile(`ck5nd/obj/${n}.png`);
// resorte con peso: 0→1 pasándose ~10 % y volviendo
const sp = (t: number, a: number, f = 1) => { const u = (t - a) * f * 0.6; return u <= 0 ? 0 : 1 - Math.exp(-5.2 * u) * Math.cos(8.5 * u); };
// aplastado al aterrizar (squash & stretch)
const sq = (t: number, a: number, amp = 0.09) => { const u = t - a; return u <= 0 ? 0 : Math.exp(-6 * u) * Math.sin(16 * u) * amp; };
const CX = 1455;
import ARJ from "./AR.json";
const AR = ARJ as Record<string, number>;

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


// ======================================= helpers propios de ck5nd =======================================
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
// tarjeta-etiqueta de cartón (pequeño cartel pegado a un objeto)
const Tag: React.FC<{ t: number; a: number; x: number; y: number; txt: string; w?: number; rot?: number; col?: string; size?: number }> = ({ t, a, x, y, txt, w = 300, rot = -6, col = C.wine, size }) => {
  if (t < a - 0.05) return null; const k = sp(t, a, 1.3), fs = size ?? Math.min(84, (w - 30) / (txt.length * 0.58));
  return <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, padding: "10px 0", textAlign: "center", background: "linear-gradient(180deg,#fbf3e4,#efdfbf)", borderRadius: 10, boxShadow: "0 14px 22px rgba(0,0,0,.5)", fontFamily: SANS, fontWeight: 900, fontSize: fs, color: col, transform: `rotate(${(rot + (1 - k) * 30).toFixed(2)}deg) scale(${(0.3 + 0.7 * k).toFixed(3)})`, opacity: cl((t - a) * 6) }}>{txt}</div>;
};

type M = { t: number; a: number; out: number; m: number[] };

// ======================================= helpers propios de ck5nd =======================================
const HAMP = "#e9a3a0", GLZ = "#e7b44a", BUNC = "#d99a4e";
// pan de mesa CSS visto desde arriba (para la vista cenital del glaseado y los mapas de calor)
const Roll: React.FC<{ x: number; y: number; s: number; col?: string; gl?: number; op?: number }> = ({ x, y, s, col = BUNC, gl = 0, op = 1 }) =>
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "34%", opacity: op, background: `radial-gradient(circle at 38% 32%, rgba(255,240,200,${(0.35 + 0.5 * gl).toFixed(2)}), ${col} 55%, #9a5a22)`, boxShadow: "inset 0 -8px 12px rgba(90,40,10,.45), 0 4px 8px rgba(0,0,0,.35)" }} />;
// fila de personas (íconos simples) — para conteos de gente
const People: React.FC<{ t: number; a: number; x: number; y: number; n: number; col?: string; s?: number; per?: number }> = ({ t, a, x, y, n, col = C.cream, s = 34, per = 10 }) => <>{Array.from({ length: n }, (_, i) => { const k = cl(sp(t, a + i * 0.025)); const cx = x + (i % per) * s * 1.15, cy = y + Math.floor(i / per) * s * 1.6;
  return <div key={i} style={{ position: "absolute", left: cx, top: cy, width: s, height: s * 1.5, opacity: k, transform: `scale(${k.toFixed(3)})`, transformOrigin: "50% 100%" }}>
    <div style={{ position: "absolute", left: s * 0.3, top: 0, width: s * 0.4, height: s * 0.4, borderRadius: "50%", background: col }} />
    <div style={{ position: "absolute", left: s * 0.12, top: s * 0.46, width: s * 0.76, height: s * 0.95, borderRadius: `${s * 0.38}px ${s * 0.38}px 6px 6px`, background: col }} /></div>; })}</>;
// sello de goma que golpea (NEVER, etc.)
const Stamp: React.FC<{ t: number; a: number; x: number; y: number; txt: string; rot?: number; col?: string; size?: number }> = ({ t, a, x, y, txt, rot = -12, col = C.red, size = 64 }) => {
  if (t < a) return null; const u = t - a, s = u < 0.12 ? 2.2 - 1.2 * (u / 0.12) : 1 + Math.exp(-14 * (u - 0.12)) * Math.sin(30 * (u - 0.12)) * 0.06;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s.toFixed(3)})`, border: `7px solid ${col}`, borderRadius: 12, padding: "4px 22px", fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 4, color: col, opacity: cl(u * 8) * 0.92, background: "rgba(255,248,235,.08)" }}>{txt}</div>;
};
// barra que se llena (tiempo / cantidad)
const Bar: React.FC<{ t: number; a: number; b: number; x: number; y: number; w: number; h?: number; col?: string }> = ({ t, a, b, x, y, w, h = 26, col = C.goldL }) => {
  if (t < a - 0.3) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: "rgba(0,0,0,.45)", border: "3px solid rgba(255,240,210,.6)", opacity: cl((t - a + 0.3) * 4) }}><div style={{ width: `${(100 * ei(t, a, b)).toFixed(1)}%`, height: "100%", borderRadius: h / 2, background: col }} /></div>;
};

// ======================================= helpers propios de ck5nd =======================================
// tarjeta índice de mamá (amarillenta, 7 renglones) — n = renglones visibles, hi = renglón resaltado (-1 ninguno)
const LINES7 = ["Ham", "Potatoes", "Green beans", "Jello salad", "Rolls", "Bars", "Coffee"];
const Card7: React.FC<{ t: number; a: number; x: number; y: number; w?: number; n?: number; hi?: number; rot?: number; pen?: number; strike?: number }> = ({ t, a, x, y, w = 520, n = 7, hi = -1, rot = -3, pen = 0, strike = 0 }) => {
  if (t < a - 0.05) return null; const k = cl(sp(t, a)), h = w * 0.62, lh = (h - 70) / 7.4;
  return <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, background: "linear-gradient(180deg,#f6e7b8,#e3cd8c)", borderRadius: 6, boxShadow: "0 18px 28px rgba(0,0,0,.55)", transform: `rotate(${(rot + (1 - k) * 20).toFixed(2)}deg) scale(${(0.4 + 0.6 * k).toFixed(3)})`, opacity: cl(k * 3) }}>
    <div style={{ position: "absolute", left: w * 0.35, top: -14, width: w * 0.3, height: 30, background: "rgba(240,225,170,.75)", transform: "rotate(-2deg)" }} />
    <div style={{ position: "absolute", left: 18, right: 18, top: 46, height: 2, background: "rgba(200,60,60,.45)" }} />
    {LINES7.slice(0, n).map((s, i) => <div key={i} style={{ position: "absolute", left: 30, top: 54 + i * lh, fontFamily: HAND, fontSize: lh * 0.88, lineHeight: 1, color: i === hi ? C.wine : "#2a3f7a", textShadow: i === hi ? "0 0 14px rgba(255,220,120,.9)" : undefined, transform: i === hi ? "scale(1.12)" : undefined, transformOrigin: "0 50%" }}>{s}
      {i < strike && <div style={{ position: "absolute", left: -6, right: -10, top: "52%", height: 4, background: "#2a3f7a", opacity: 0.85 }} />}</div>)}
    {pen > 0 && <div style={{ position: "absolute", right: 20, top: 60, width: w * 0.36, fontFamily: HAND, fontSize: lh * 0.6, color: "#555", opacity: pen, lineHeight: 1.25 }}>p. 7<br />+10%<br />1974</div>}
  </div>;
};
// casilla de precio que «cae» con un clic de registradora
const Price: React.FC<{ t: number; a: number; x: number; y: number; v: string; w?: number; col?: string }> = ({ t, a, x, y, v, w = 260, col = "#2f6a35" }) => <Tag t={t} a={a} x={x} y={y} txt={v} w={w} size={Math.min(64, (w - 30) / (v.length * 0.56))} col={col} rot={-4} />;
// rejilla de cortes (para la torta y las barras)
const Grid: React.FC<{ t: number; a: number; x: number; y: number; w: number; h: number; c: number; r: number; dur?: number; col?: string }> = ({ t, a, x, y, w, h, c, r, dur = 1.6, col = "rgba(40,20,10,.75)" }) => <>
  {Array.from({ length: c - 1 }, (_, i) => <div key={"c" + i} style={{ position: "absolute", left: x + (w * (i + 1)) / c - 2, top: y, width: 4, height: h * ei(t, a + (i * dur) / (c + r), a + (i * dur) / (c + r) + 0.3), background: col }} />)}
  {Array.from({ length: r - 1 }, (_, i) => <div key={"r" + i} style={{ position: "absolute", left: x, top: y + (h * (i + 1)) / r - 2, width: w * ei(t, a + dur / 2 + (i * dur) / (c + r), a + dur / 2 + (i * dur) / (c + r) + 0.3), height: 4, background: col }} />)}
</>;
// teléfono que suena (tiembla y emite ondas)
const ring2 = (t: number, a: number) => (t > a && t < a + 2.4 ? Math.sin((t - a) * 60) * 4 * (1 - (t - a) / 2.4) : 0);

type M2 = M;

// 01 · EL TELÉFONO DE LAS SIETE: el teléfono de pared tiembla y suena (ondas); el reloj marca 7; «JUEVES 11:00 · 50 PERSONAS» cae en la agenda; «2 DÍAS · $0»
export const WallPhone7: React.FC<M2> = ({ t, a, out, m: [pastor, thu, fifty, two] }) => <Stage t={t} a={a} out={out}>
  <Ob t={t} n="wallphone" a={a + 0.05} x={1250} y={760} w={300} r={ring2(t, a + 0.2)} origin="50% 20%" />
  {t > a + 0.2 && t < a + 3 && [0, 1, 2].map((i) => { const u = ((t - a - 0.2) * 1.4 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 1250 - 120 - u * 140, top: 420 - u * 140, width: 240 + u * 280, height: 240 + u * 280, borderRadius: "50%", border: `6px solid rgba(255,230,170,${(1 - u) * 0.7})` }} />; })}
  <Face t={t} a={a + 0.3} b={a + 0.31} x={1700} y={220} r={110} h0={7} h1={7} />
  <Lb t={t} a={pastor} x={1250} y={300} txt="IT'S THE PASTOR" size={44} w={480} />
  <Ob t={t} n="calendar" a={thu - 0.2} x={1680} y={720} w={330} r={4} />
  <Tag t={t} a={thu} x={1680} y={420} txt="THURSDAY · 11:00" w={360} size={42} />
  <Tag t={t} a={fifty} x={1680} y={770} txt="~50 PEOPLE" w={300} size={50} col="#7a4a10" rot={5} />
  <Tx t={t} a={two} y={880} txt="2 DAYS · NO BUDGET" size={66} font={SANS} weight={900} col={C.goldL} w={880} />
</Stage>;

// 02 · LA TARJETA: la tarjeta amarilla cae y los siete renglones se escriben uno a uno con la voz; «1971» con un pedazo de cinta
export const Card7Reveal: React.FC<M2> = ({ t, a, out, m: [yel, l7, y71] }) => {
  const n = t < l7 ? 0 : Math.min(7, 1 + Math.floor((t - l7) / 0.9));
  return <Stage t={t} a={a} out={out}>
    <Card7 t={t} a={yel - 0.2} x={1450} y={520} w={640} n={n} />
    <Lb t={t} a={yel} x={1450} y={130} txt="7 LINES · MY MOTHER'S HAND" size={48} w={760} />
    <Tag t={t} a={y71} x={1450} y={830} txt="SINCE 1971" w={340} size={56} />
  </Stage>;
};

// 03 · 12 CENTAVOS, 100 MILLAS: la taza humeante; una ruta punteada de 100 millas se dibuja hasta la iglesia; el precio 12¢ cae; «LO GUARDO PARA EL FINAL» con un candado
export const HundredMiles: React.FC<M2> = ({ t, a, out, m: [c12, mi, end] }) => <Stage t={t} a={a} out={out}>
  <Ob t={t} n="cupsaucer" a={a + 0.1} x={1250} y={860} w={300} />
  <Vapor t={t} a={a + 0.5} b={out} x={1250} y={680} big={0.6} />
  <Price t={t} a={c12} x={1250} y={300} v="12¢ A CUP" w={320} />
  <Stroke t={t} a={mi} d="M 1420 900 C 1500 700 1600 820 1660 600 S 1800 380 1830 300" col={C.cream} sw={8} dur={1.5} len={900} />
  <Lb t={t} a={mi + 0.6} x={1680} y={700} txt="100 MILES" size={56} w={360} col={C.goldL} />
  <Tx t={t} a={end} y={110} txt="SAVING IT FOR THE END" size={64} font={HAND} weight={700} w={860} />
</Stage>;

// 04 · LA PÁGINA MÁS GASTADA: tabla de tres columnas 25 · 50 · 100 que se arma; la columna del 50 se ilumina; el canto de la página se oscurece de tanto uso
export const CrowdChart: React.FC<M2> = ({ t, a, out, m: [crowd, most, fifty] }) => {
  const k = cl(sp(t, crowd - 0.3)), hl = ei(t, crowd + 1.5, crowd + 2.3), wear = ei(t, most, most + 1);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1150, top: 260, width: 600, height: 560, background: `linear-gradient(90deg, #f7efdc 0, #f7efdc 85%, rgba(120,80,30,${(0.5 * wear).toFixed(2)}))`, borderRadius: 8, boxShadow: "0 18px 28px rgba(0,0,0,.5)", transform: `rotate(-2deg) scale(${(0.4 + 0.6 * k).toFixed(3)})`, opacity: cl(k * 3), fontFamily: SANS, color: C.ink }}>
      <div style={{ textAlign: "center", fontSize: 34, fontWeight: 900, marginTop: 20 }}>FEEDING A CROWD · P. 7</div>
      {["25", "50", "100"].map((c, i) => <div key={c} style={{ position: "absolute", left: 40 + i * 180, top: 90, width: 160, height: 430, borderRadius: 10, background: i === 1 ? `rgba(230,180,70,${(0.55 * hl).toFixed(2)})` : "transparent" }}>
        <div style={{ textAlign: "center", fontSize: 48, fontWeight: 900 }}>{c}</div>
        {[0, 1, 2, 3, 4, 5].map((j) => <div key={j} style={{ margin: "26px 22px 0", height: 10, borderRadius: 5, background: "rgba(40,30,20,.35)", width: `${60 + ((i * 17 + j * 23) % 40)}%` }} />)}
      </div>)}
    </div>
    <Lb t={t} a={most} x={1450} y={170} txt="THE MOST USED PAGE" size={50} w={700} col={C.goldL} />
    <Tx t={t} a={fifty} y={860} txt={`${cnt(t, fifty, fifty + 1.4, 0, 50)} RECIPES · 1 PAGE EACH`} size={58} font={SANS} weight={900} w={860} />
  </Stage>;
};

// 05 · EL ÁRBOL TELEFÓNICO: ocho teléfonos en cascada se encienden de a uno con una línea que corre; el número 3 (mamá) lleva corona dorada; reloj de media hora que se cierra
export const PhoneTree: React.FC<M2> = ({ t, a, out, m: [eight, first, half, num3, hers] }) => {
  const P8 = Array.from({ length: 8 }, (_, i) => ({ x: 1080 + (i % 4) * 230 + (Math.floor(i / 4) ? 115 : 0), y: 340 + Math.floor(i / 4) * 300 }));
  return <Stage t={t} a={a} out={out}>
    <People t={t} a={eight} x={1100} y={120} n={8} s={44} per={8} />
    {P8.map((p, i) => { const on = t > first + i * 0.55; return <React.Fragment key={i}>
      {i > 0 && <Stroke t={t} a={first + (i - 1) * 0.55} d={`M ${P8[i - 1].x} ${P8[i - 1].y} L ${p.x} ${p.y}`} col={C.goldL} sw={6} dur={0.45} len={400} />}
      <div style={{ position: "absolute", left: p.x - 50, top: p.y - 50, width: 100, height: 100, borderRadius: "50%", background: on ? C.goldL : "rgba(255,240,210,.18)", boxShadow: on ? "0 0 26px rgba(255,210,120,.8)" : "none", fontFamily: SANS, fontWeight: 900, fontSize: 46, color: C.ink, textAlign: "center", lineHeight: "100px", transform: `scale(${(i === 2 && t > num3 ? 1.25 : 1).toFixed(2)})` }}>{i + 1}</div>
    </React.Fragment>; })}
    <Lb t={t} a={half} x={1450} y={900} txt="30 MINUTES · EVERYONE KNEW" size={46} w={760} />
    <Tag t={t} a={num3} x={1540} y={200} txt="MOM · #3" w={260} size={44} rot={5} />
    <Lb t={t} a={hers} x={1540} y={290} txt="THEN ME" size={40} w={260} col={C.goldL} />
  </Stage>;
};

// 06 · ¿QUÉ TE TRAIGO?: la pregunta grande en globo; debajo una canasta se llena de fuentes que llegan de los costados
export const WhatBring: React.FC<M2> = ({ t, a, out, m: [bring, work] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={bring} y={140} txt="“WHAT DO YOU NEED ME TO BRING?”" size={60} font={SERIF} w={860} col={C.cream} />
  <Ob t={t} n="potatopan" a={bring + 0.8} x={1240} y={880} w={300} from="left" />
  <Ob t={t} n="jellopan" a={bring + 1.2} x={1660} y={880} w={300} from="right" />
  <Ob t={t} n="rollbasket" a={bring + 1.6} x={1450} y={760} w={260} z={3} />
  <Stamp t={t} a={work} x={1450} y={430} txt="TUESDAY = WORK" rot={-6} col={C.goldL} size={58} />
</Stage>;

// 07 · EL INVIERNO DE 1971: tres cruces en un almanaque de cinco semanas; dos ensaladas de papa iguales chocan; el plato de verdura queda VACÍO; la canasta de panes se vacía
export const Winter71: React.FC<M2> = ({ t, a, out, m: [three, twop, nov, ran] }) => {
  const clash = ei(t, twop, twop + 0.6);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={three} y={90} txt="3 FUNERALS IN 5 WEEKS" size={70} font={SANS} weight={900} col={C.goldL} w={880} />
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1090 + i * 150, top: 210, width: 130, height: 110, borderRadius: 10, background: "rgba(255,248,235,.9)", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.ink, textAlign: "center", paddingTop: 6, opacity: cl((t - three - i * 0.1) * 4) }}>WEEK {i + 1}{[0, 2, 4].includes(i) && t > three + 0.6 + i * 0.2 && <div style={{ fontSize: 56, color: C.wine, lineHeight: 1 }}>✝</div>}</div>)}
    <Ob t={t} n="potatopan" a={twop - 0.6} x={lerp(1150, 1330, clash)} y={720} w={260} />
    <Ob t={t} n="potatopan" a={twop - 0.3} x={lerp(1750, 1570, clash)} y={720} w={260} from="right" />
    <Lb t={t} a={twop} x={1450} y={420} txt="TWO POTATO SALADS" size={42} w={600} />
    <Ob t={t} n="chinaplate" a={nov - 0.2} x={1260} y={960} w={220} />
    <Lb t={t} a={nov} x={1260} y={980} txt="NO VEGETABLE" size={30} w={260} col={C.red} />
    <Ob t={t} n="rollbasket" a={ran - 0.3} x={1660} y={960} w={220} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(${(1 - 0.5 * ei(t, ran, ran + 1)).toFixed(2)})`} />
    <Lb t={t} a={ran} x={1660} y={980} txt="OUT OF ROLLS" size={30} w={260} col={C.red} />
  </Stage>;
};

// 08 · LA PUERTA DEL APARADOR: una puerta de madera se abre en perspectiva y adentro está la tarjeta pegada, con las tazas en el estante
export const CupboardDoor: React.FC<M2> = ({ t, a, out, m: [sat, ord, cup] }) => {
  const open = ei(t, cup - 0.3, cup + 1.2);
  return <Stage t={t} a={a} out={out}>
    <Lb t={t} a={sat} x={1450} y={110} txt="AT THE KITCHEN TABLE" size={46} w={700} />
    <Lb t={t} a={ord} x={1450} y={180} txt="IN THE ORDER YOU LAY THEM OUT" size={36} w={900} col={C.goldL} />
    <div style={{ position: "absolute", left: 1180, top: 270, width: 540, height: 640, background: "linear-gradient(180deg,#5a3a1e,#3b2412)", borderRadius: 10, boxShadow: "0 20px 30px rgba(0,0,0,.6)", opacity: cl((t - a) * 4) }}>
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: 20, right: 20, top: 200 + s * 220, height: 14, background: "#7a5530" }} />)}
      {[0, 1, 2].map((i) => <Img key={i} src={O("cupsaucer")} style={{ position: "absolute", left: 300 + i * 70, top: 130, width: 90 }} />)}
    </div>
    <Card7 t={t} a={cup - 0.2} x={1330} y={480} w={260} n={7} rot={-2} />
    <div style={{ position: "absolute", left: 1180, top: 270, width: 540, height: 640, transform: `perspective(1400px) rotateY(${(-105 * open).toFixed(1)}deg)`, transformOrigin: "0% 50%", background: "linear-gradient(90deg,#6e4826,#8a5d33 50%,#6e4826)", border: "10px solid #4e3119", borderRadius: 10, boxShadow: "0 20px 30px rgba(0,0,0,.6)", opacity: cl((t - a) * 4) }}>
      <div style={{ position: "absolute", left: 470, top: 300, width: 26, height: 60, borderRadius: 10, background: C.gold }} />
    </div>
  </Stage>;
};

// 09 · RENGLÓN 1 · JAMÓN: la tarjeta en miniatura arriba con «Ham» encendido; el jamón cae; cuatro virtudes se tildan (ya cocido, corta prolijo, aguanta, sobra para sándwich)
export const HamWhy: React.FC<M2> = ({ t, a, out, m: [cooked, slices, home, nov] }) => <Stage t={t} a={a} out={out}>
  <Card7 t={t} a={a} x={1760} y={190} w={240} hi={0} />
  <Ob t={t} n="ham" a={a + 0.3} x={1300} y={880} w={460} />
  {([[cooked, "ALREADY COOKED"], [slices, "SLICES NEAT"], [home, "SANDWICHES FOR THE FAMILY"], [nov, "CHEAPEST IN NOVEMBER"]] as [number, string][]).map(([at, s], i) => <React.Fragment key={i}>
    <CK t={t} at={at} x={1200} y={360 + i * 80} s={28} /><Lb t={t} a={at} x={1460} y={336 + i * 80} txt={s} size={34} w={460} /></React.Fragment>)}
</Stage>;

// 10 · LA BALANZA DEL JAMÓN: 50 platitos × ⅓-½ lb → 20-24 lb; dos jamones de 10 lb caen en los platillos; $1.49/lb → $29.80
export const HamMath: React.FC<M2> = ({ t, a, out, m: [r2024, use20, two, d149, c2980] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={a + 0.2} y={90} txt="1/3 TO 1/2 LB A PERSON" size={70} font={SANS} weight={900} w={860} />
  <Tag t={t} a={r2024} x={1450} y={210} txt="50 PEOPLE → 20–24 LB" w={520} size={44} />
  <Stamp t={t} a={use20} x={1450} y={360} txt="WE USE 20" col={C.goldL} size={54} />
  <Ob t={t} n="ham" a={two} x={1220} y={820} w={330} />
  <Ob t={t} n="ham" a={two + 0.35} x={1650} y={820} w={330} />
  <Lb t={t} a={two + 0.4} x={1220} y={840} txt="10 LB" size={40} w={200} />
  <Lb t={t} a={two + 0.7} x={1650} y={840} txt="10 LB" size={40} w={200} />
  <Price t={t} a={d149} x={1450} y={560} v="$1.49 / LB" w={300} col="#7a4a10" />
  <Price t={t} a={c2980} x={1450} y={930} v="$29.80" w={300} />
</Stage>;

// 11 · BAJO Y LENTO: el reloj de horno 275°; un medio vaso de agua se vierte; el papel aluminio se cierra; un reloj gira 2½ horas; una segunda casita (horneado en casa el miércoles)
export const LowSlow: React.FC<M2> = ({ t, a, out, m: [d275, water, perlb, two5, home] }) => <Stage t={t} a={a} out={out}>
  <Tag t={t} a={d275} x={1200} y={130} txt="275°F" w={240} size={72} />
  <Ob t={t} n="roaster" a={d275 + 0.3} x={1260} y={880} w={420} />
  <Lb t={t} a={water} x={1260} y={360} txt="½ CUP WATER · FOIL TIGHT" size={40} w={520} />
  <Lb t={t} a={perlb} x={1690} y={150} txt="15 MIN A POUND" size={42} w={400} col={C.goldL} />
  <Face t={t} a={two5 - 0.4} b={two5 + 2} x={1690} y={390} r={120} h0={0} h1={2.5} />
  <Lb t={t} a={two5} x={1690} y={530} txt="10 LB = 2½ HOURS" size={38} w={400} />
  <Ob t={t} n="hat" a={home} x={1690} y={900} w={1} op={0} />
  <Tag t={t} a={home} x={1690} y={700} txt="HAM #2: BAKED AT HOME WEDNESDAY" w={420} size={28} col="#7a4a10" />
</Stage>;

// 12 · EL GLASEADO AL FINAL: azúcar negra + miel + mostaza en una pasta; a 400° burbujea; si va al principio, el azúcar se pone NEGRA antes que el jamón entibie
export const GlazeLast: React.FC<M2> = ({ t, a, out, m: [bs, d400, sticky, burns, c320] }) => {
  const bub = ei(t, d400, sticky + 1);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="ham" a={a + 0.1} x={1340} y={880} w={460} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(${(1 + 0.6 * bub).toFixed(2)}) brightness(${(1 + 0.15 * bub).toFixed(2)})`} />
    <Lb t={t} a={bs} x={1340} y={140} txt="BROWN SUGAR · HONEY · MUSTARD" size={44} w={820} />
    <Tag t={t} a={d400} x={1340} y={250} txt="AT THE END · 400°F" w={440} size={44} />
    {t > d400 && Array.from({ length: 10 }, (_, i) => { const u = ((t - d400) * 0.9 + i * 0.1) % 1; const s = 14 + 10 * ((i * 7) % 3); return <div key={i} style={{ position: "absolute", left: 1200 + ((i * 61) % 280), top: 660 - u * 60, width: s, height: s, borderRadius: "50%", border: "3px solid rgba(255,220,140,.9)", opacity: Math.sin(Math.PI * u) * bub }} />; })}
    <Ob t={t} n="ham" a={burns - 0.3} x={1740} y={560} w={200} from="right" fl="drop-shadow(0 8px 10px rgba(0,0,0,.4)) brightness(.3) contrast(1.4)" />
    <Lb t={t} a={burns} x={1740} y={580} txt="GLAZE FIRST = BURNT" size={30} w={300} col={C.red} />
    <Price t={t} a={c320} x={1740} y={760} v="$3.20" w={220} />
  </Stage>;
};

// 13 · TEJAS: las tajadas finas se acomodan como tejas en el roaster una tras otra; el jugo cae en hilo; gruesa (½ lb, 1 tajada) vs finas (⅓ lb, 3 tajadas, «parece más»)
export const Shingles: React.FC<M2> = ({ t, a, out, m: [sh, juice, thick, thin3, more] }) => <Stage t={t} a={a} out={out}>
  {Array.from({ length: 9 }, (_, i) => { const at = sh + i * 0.18, k = cl(sp(t, at)); return t > at ? <div key={i} style={{ position: "absolute", left: 1110 + i * 62, top: 470 + i * 14 - (1 - k) * 260, width: 220, height: 150, borderRadius: "46% 54% 40% 50%", background: "radial-gradient(ellipse at 40% 40%, #f6b9b0, #d98276 70%, #b85f55)", boxShadow: "0 8px 12px rgba(0,0,0,.4)", transform: `rotate(${-12 + i * 2}deg)`, opacity: k }} /> : null; })}
  <Lb t={t} a={sh} x={1450} y={150} txt="OVERLAPPING LIKE SHINGLES" size={48} w={800} />
  {t > juice && <div style={{ position: "absolute", left: 1450, top: 260, width: 10, height: 240 * ei(t, juice, juice + 0.8), background: "linear-gradient(180deg,#c98a3a,#e7b44a)", borderRadius: 5, opacity: 1 - ei(t, juice + 2, juice + 2.6) }} />}
  {t > thick - 0.2 && <div style={{ position: "absolute", left: 1110, top: 840 - (1 - cl(sp(t, thick - 0.2))) * 200, width: 220, height: 90, borderRadius: "40% 50% 36% 44%", background: "radial-gradient(ellipse at 40% 35%, #f6b9b0, #d98276 65%, #a8524a)", boxShadow: "0 14px 0 #b8655c, 0 22px 20px rgba(0,0,0,.5)" }} />}
  <Lb t={t} a={thick} x={1220} y={980} txt="1 THICK = HALF A POUND" size={30} w={280} col={C.red} />
  <Ob t={t} n="hamslices" a={thin3 - 0.2} x={1680} y={960} w={260} />
  <Lb t={t} a={thin3} x={1680} y={980} txt="3 THIN = A THIRD OF A POUND" size={30} w={280} col={GOOD} />
  <Tx t={t} a={more} y={300} txt="AND THEY FEEL LIKE THEY GOT MORE" size={52} font={HAND} weight={700} w={860} />
</Stage>;

// 14 · LOS CUATRO NOMBRES: «funeral potatoes» en el centro y tres carteles con los otros nombres orbitan; una fuente se deja en la puerta de una casa (umbral) y otra va a la mesa
export const FourNames: React.FC<M2> = ({ t, a, out, m: [fp, names, drop, spoon] }) => <Stage t={t} a={a} out={out}>
  <Ob t={t} n="potatopan" a={fp - 0.2} x={1450} y={760} w={420} />
  <Tag t={t} a={fp} x={1450} y={120} txt="FUNERAL POTATOES" w={520} size={52} />
  {["CHEESY POTATOES", "PARTY POTATOES", "HASH BROWN CASSEROLE"].map((s, i) => { const an = (t - names) * 0.6 + i * 2.09; return <Tag key={i} t={t} a={names + i * 0.35} x={1450 + Math.cos(an) * 300} y={420 + Math.sin(an) * 90} txt={s} w={300} size={26} rot={Math.sin(an) * 6} col="#7a4a10" />; })}
  <Lb t={t} a={drop} x={1450} y={900} txt="ONE PAN TO THE HOUSE · ONE TO THE TABLE" size={34} w={800} />
  <Tx t={t} a={spoon} y={240} txt="COMFORT WITH A SPOON" size={56} font={HAND} weight={700} w={860} col={C.goldL} />
</Stage>;

// 15 · LA LISTA DE LA FUENTE (p. 33): siete ingredientes caen en dos filas, cada uno con su medida
export const PotatoList: React.FC<M2> = ({ t, a, out, m: [i1, i2, i3, i4, i5, i6, i7] }) => {
  const I: [string, string, number, number][] = [["hashbag", "30 OZ HASH BROWNS", i1, 200], ["soupcan", "1 CAN SOUP", i2, 120], ["sourcream", "2 CUPS SOUR CREAM", i3, 150], ["butterdish", "½ CUP BUTTER", i4, 160], ["onion", "½ CUP ONION", i5, 110], ["potatopan", "2 CUPS CHEDDAR", i6, 1], ["cornflakes", "2 CUPS CORN FLAKES", i7, 170]];
  return <Stage t={t} a={a} out={out}>
    <Tag t={t} a={a + 0.1} x={1450} y={80} txt="ONE 9×13 PAN · P. 33" w={460} size={44} />
    {I.map(([n, l, at, w], i) => { const x = 1130 + (i % 4) * 215, y = i < 4 ? 500 : 860; return <React.Fragment key={i}>
      {i === 5 ? <div style={{ position: "absolute", left: x - 70, top: y - 110, width: 140, height: 100, borderRadius: "50%", background: "radial-gradient(circle,#f7b23a,#e08a1a)", opacity: cl((t - at) * 4), boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} /> : <Ob t={t} n={n} a={at - 0.2} x={x} y={y - 20} w={w} />}
      <Lb t={t} a={at} x={x} y={y} txt={l} size={24} w={210} />
    </React.Fragment>; })}
  </Stage>;
};

// 16 · EL REPASADOR RETORCIDO (wow): la toalla se retuerce en espiral y caen gotas que llenan un vaso medidor; «AGUA = SOPA DE PAPA»
export const WringTowel: React.FC<M2> = ({ t, a, out, m: [towel, wring, amazed, soup, skip] }) => {
  const tw = ei(t, wring - 0.2, wring + 2), fill = ei(t, wring + 0.3, amazed + 3);
  return <Stage t={t} a={a} out={out}>
    <Lb t={t} a={a + 0.1} x={1450} y={110} txt="THE TRICK" size={56} w={500} col={C.goldL} />
    <Ob t={t} n="wrungtowel" a={towel - 0.2} x={1330} y={560} w={420} r={-10} tf={`scaleX(${(1 - 0.25 * tw).toFixed(3)}) rotate(${(tw * 8 * Math.sin((t - wring) * 3)).toFixed(2)}deg)`} />
    {t > wring && Array.from({ length: 12 }, (_, i) => { const u = ((t - wring) * 1.3 + i / 12) % 1; return <div key={i} style={{ position: "absolute", left: 1300 + ((i * 37) % 70), top: 600 + u * 260, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(170,210,255,.9)", opacity: (1 - u) * (1 - ei(t, soup + 3, soup + 4)) }} />; })}
    <div style={{ position: "absolute", left: 1240, top: 860, width: 200, height: 170, border: "6px solid rgba(255,255,255,.8)", borderTop: "none", borderRadius: "0 0 22px 22px", overflow: "hidden", opacity: cl((t - wring) * 3) }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(100 * fill).toFixed(0)}%`, background: "rgba(150,195,240,.75)" }} /></div>
    <Lb t={t} a={amazed} x={1690} y={500} txt="SO MUCH WATER" size={44} w={360} />
    <Tx t={t} a={soup} x={1690} y={640} txt="= POTATO SOUP" size={60} font={SANS} weight={900} w={380} col={C.red} />
    <Lb t={t} a={skip} x={1690} y={820} txt="EVERY WATERY PAN SKIPPED THIS" size={30} w={380} />
  </Stage>;
};

// 17 · AL HORNO DESTAPADO: la fuente cruda, la capa de copos cae como lluvia dorada, entra al horno 350° y sale dorada; reloj 50-55 min
export const FlakeRain: React.FC<M2> = ({ t, a, out, m: [fold, toss, bake, gold] }) => {
  const g = ei(t, bake, gold + 1);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="potatopan" a={fold - 0.3} x={1420} y={880} w={480} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(${(0.5 + 0.6 * g).toFixed(2)}) brightness(${(0.85 + 0.25 * g).toFixed(2)})`} />
    <Lb t={t} a={fold} x={1420} y={140} txt="FOLD IN · SPREAD IN A 9×13" size={44} w={700} />
    {t > toss && t < toss + 4 && Array.from({ length: 30 }, (_, i) => { const u = ((t - toss) * 0.8 + i / 30) % 1; return <div key={i} style={{ position: "absolute", left: 1220 + ((i * 47) % 400), top: 300 + u * 380, width: 18, height: 12, borderRadius: 4, background: "#e4b04a", transform: `rotate(${i * 41 + u * 200}deg)`, opacity: Math.sin(Math.PI * u) }} />; })}
    <Lb t={t} a={toss} x={1420} y={230} txt="CORN FLAKES + THE OTHER HALF OF THE BUTTER" size={32} w={820} col={C.goldL} />
    <Tag t={t} a={bake} x={1760} y={360} txt="350°F · 50–55 MIN" w={300} size={36} />
    <Lb t={t} a={gold} x={1420} y={960} txt="GOLDEN · BUBBLING AT THE EDGES" size={38} w={700} col={C.goldL} />
  </Stage>;
};

// 18 · CUCHARONES: 50 tazas de media taza se forman en grilla; cada fuente se come 12-15; aparecen 4 fuentes
export const ScoopPans: React.FC<M2> = ({ t, a, out, m: [sc, half, four] }) => <Stage t={t} a={a} out={out}>
  <Lb t={t} a={sc} x={1450} y={110} txt="1 PAN = 12–15 SCOOPS" size={52} w={760} />
  <Lb t={t} a={half} x={1450} y={180} txt="½ CUP A PERSON" size={44} w={600} col={C.goldL} />
  <People t={t} a={half + 0.4} x={1090} y={260} n={50} s={30} per={25} />
  {[0, 1, 2, 3].map((i) => <Ob key={i} t={t} n="potatopan" a={four + i * 0.3} x={1150 + i * 205} y={880} w={220} />)}
  <Tx t={t} a={four + 1.3} y={560} txt="4 PANS" size={110} font={SANS} weight={900} col={C.goldL} />
</Stage>;

// 19 · LA BOLSA DEL SÚPER (cuenta de una fuente): los ingredientes salen de la bolsa con su precio y una cinta de sumadora acumula hasta $11.25; ×4 = $45
export const PanCost: React.FC<M2> = ({ t, a, out, m: [p1, p3, p4, p5, p6, p7, c1125, c45] }) => {
  const P: [number, string, number][] = [[p1, "HASH BROWNS", 2.98], [p1 + 2.5, "SOUP", 1.25], [p3, "SOUR CREAM", 2.29], [p4, "BUTTER", 1.12], [p5, "CHEDDAR", 2.48], [p6, "CORN FLAKES", 0.73], [p7, "½ ONION", 0.4]];
  const sum = P.filter(([at]) => t > at).reduce((s, [, , v]) => s + v, 0);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1130, top: 170, width: 420, height: 700, background: "linear-gradient(180deg,#fdfbf5,#efe9dc)", boxShadow: "0 16px 24px rgba(0,0,0,.5)", fontFamily: "monospace", fontSize: 30, color: "#2a2a2a", padding: "24px 28px", opacity: cl((t - a) * 4) }}>
      {P.map(([at, s, v], i) => t > at ? <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><span>{s}</span><span>{v.toFixed(2)}</span></div> : null)}
      <div style={{ borderTop: "3px dashed #777", marginTop: 10, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 900 }}><span>PAN</span><span>${(t > c1125 ? 11.25 : sum).toFixed(2)}</span></div>
    </div>
    <Price t={t} a={c45} x={1720} y={620} v="× 4 = $45" w={320} />
    <Lb t={t} a={c45 + 1.5} x={1720} y={760} txt="THE PRICIEST LINE" size={34} w={340} col={C.goldL} />
  </Stage>;
};

// 20 · LA NOCHE ANTES (papas): cuatro fuentes tapadas entran a una heladera que se cierra; la bolsita de copos queda afuera colgando con su etiqueta; +10 min
export const FridgeNight: React.FC<M2> = ({ t, a, out, m: [nb, bag, ten] }) => {
  const shut = ei(t, bag - 0.8, bag - 0.1);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1150, top: 220, width: 420, height: 720, borderRadius: 24, background: "linear-gradient(180deg,#eef1f3,#c9cfd4)", boxShadow: "0 20px 30px rgba(0,0,0,.55)", opacity: cl((t - a) * 4) }}>
      {[0, 1, 2, 3].map((i) => <Img key={i} src={O("potatopan")} style={{ position: "absolute", left: 50, top: 60 + i * 160, width: 320, opacity: cl((t - nb - i * 0.3) * 3), filter: "saturate(.6)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1150, top: 220, width: 420, height: 720, borderRadius: 24, background: "linear-gradient(90deg,#dfe4e8,#f6f8f9)", transform: `perspective(1400px) rotateY(${(-100 * (1 - shut)).toFixed(1)}deg)`, transformOrigin: "0% 50%", opacity: cl((t - a) * 4), boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}><div style={{ position: "absolute", right: 30, top: 300, width: 20, height: 120, borderRadius: 10, background: "#9aa1a7" }} /></div>
    <Ob t={t} n="cornflakes" a={bag} x={1730} y={660} w={240} />
    <Tag t={t} a={bag + 0.3} x={1730} y={680} txt="TOPPING · SEPARATE" w={300} size={30} />
    <Tag t={t} a={ten} x={1730} y={300} txt="COLD → +10 MIN" w={300} size={40} col="#2a4f7a" />
  </Stage>;
};

// 21 · RENGLÓN 3 · EL PLATO PESADO: un plato cargado de jamón, papa y gelatina hunde la balanza; cae la fuente de chauchas verdes y la equilibra
export const HeavyPlate: React.FC<M2> = ({ t, a, out, m: [added, heavy, lbs] }) => {
  const tip = ei(t, heavy - 0.5, heavy + 0.5) * (1 - ei(t, lbs - 0.4, lbs + 0.6));
  return <Stage t={t} a={a} out={out}>
    <Card7 t={t} a={a} x={1760} y={190} w={240} hi={2} />
    <Lb t={t} a={added} x={1400} y={120} txt="THE LINE MOM ADDED" size={46} w={600} />
    <div style={{ position: "absolute", left: 1440, top: 600, width: 20, height: 360, background: "linear-gradient(90deg,#8d6a3a,#c99a5a,#8d6a3a)", opacity: cl((t - a) * 4) }} />
    <div style={{ position: "absolute", left: 1080, top: 590, width: 760, height: 14, background: "#a77b42", transform: `rotate(${(-10 * tip).toFixed(2)}deg)`, opacity: cl((t - a) * 4) }}>
      <Img src={O("paperplate")} style={{ position: "absolute", left: 0, top: -200, width: 280, filter: "drop-shadow(0 10px 12px rgba(0,0,0,.5))" }} />
      {t > lbs - 0.4 && <Img src={O("greenbeans")} style={{ position: "absolute", right: 20, top: -170, width: 240, filter: "drop-shadow(0 10px 12px rgba(0,0,0,.5))", opacity: cl((t - lbs + 0.4) * 4) }} />}
    </div>
    <Lb t={t} a={heavy} x={1240} y={300} txt="A HEAVY PLATE" size={40} w={400} col={C.red} />
    <Tag t={t} a={lbs} x={1640} y={300} txt="10 LB FOR 50" w={300} size={44} col="#2f6a35" />
  </Stage>;
};

// 22 · EN GRASA DE PANCETA, NO HERVIDAS: la olla con agua se tacha; en la sartén de hierro chisporrotea la panceta; entra la cebolla y las chauchas brillan; $12.50
export const BaconFat: React.FC<M2> = ({ t, a, out, m: [nob, bacon, onion, shiny, c] }) => <Stage t={t} a={a} out={out}>
  <Ob t={t} n="stockpot" a={nob - 0.3} x={1180} y={600} w={220} op={1 - ei(t, bacon, bacon + 0.5)} />
  {t < bacon + 0.5 && <XM t={t} at={nob + 0.4} x={1180} y={480} s={80} />}
  <Ob t={t} n="skillet" a={bacon - 0.2} x={1440} y={900} w={520} />
  {t > bacon && Array.from({ length: 14 }, (_, i) => { const u = ((t - bacon) * 2.2 + i / 14) % 1; return <div key={i} style={{ position: "absolute", left: 1300 + ((i * 53) % 260), top: 760 - u * 90, width: 6, height: 6, borderRadius: "50%", background: "#fff3c4", opacity: (1 - u) * (1 - ei(t, shiny + 2, shiny + 3)) }} />; })}
  <Lb t={t} a={bacon} x={1440} y={150} txt="1 LB BACON, CRISP" size={46} w={600} />
  <Ob t={t} n="onion" a={onion - 0.2} x={1730} y={620} w={130} from="right" op={1 - ei(t, shiny - 1, shiny)} />
  <Lb t={t} a={onion} x={1440} y={230} txt="ONION IN THE FAT" size={40} w={600} col={C.goldL} />
  <Ob t={t} n="greenbeans" a={shiny - 0.4} x={1440} y={820} w={380} from="up" z={3} />
  <Lb t={t} a={shiny} x={1440} y={310} txt="HOT & SHINY" size={44} w={500} col={GOOD} />
  <Price t={t} a={c} x={1740} y={420} v="$12.50" w={240} />
</Stage>;

// 23 · EL HORNO LLENO: un horno con todas las rejillas llenas (jamón, papas) y la gelatina ya lista en la heladera de al lado con tilde — «2 días antes, sin horno»
export const OvenFull: React.FC<M2> = ({ t, a, out, m: [ahead, noov, full, wait] }) => <Stage t={t} a={a} out={out}>
  <Card7 t={t} a={a} x={1760} y={190} w={240} hi={3} />
  <div style={{ position: "absolute", left: 1080, top: 360, width: 440, height: 520, borderRadius: 18, background: "radial-gradient(ellipse at 50% 60%, #ffb35a, #a2441c 70%, #3a1a0c)", border: "16px solid #2f3134", boxShadow: "0 20px 30px rgba(0,0,0,.6)", opacity: cl((t - full + 1) * 3) }} />
  <Ob t={t} n="ham" a={full} x={1300} y={560} w={220} z={3} />
  <Ob t={t} n="potatopan" a={full + 0.3} x={1300} y={800} w={260} z={3} />
  <Lb t={t} a={full} x={1300} y={900} txt="EVERY OVEN FULL" size={34} w={420} col={C.red} />
  <Ob t={t} n="jellopan" a={ahead - 0.2} x={1720} y={720} w={300} />
  <Tag t={t} a={ahead} x={1720} y={400} txt="2 DAYS AHEAD" w={300} size={44} />
  <Lb t={t} a={noov} x={1720} y={740} txt="NO OVEN" size={36} w={300} col={GOOD} />
  <CK t={t} at={wait} x={1720} y={560} s={60} />
</Stage>;

// 24 · LAS DOS ENSALADAS: corte en capas de la pretzel (crocante, crema, gelatina roja) que se arma capa por capa; la Watergate verde al lado; la roja se vacía primero
export const LayerSalad: React.FC<M2> = ({ t, a, out, m: [green, wg, crust, cream, straw, gone] }) => {
  const L = (at: number, y: number, h: number, bg: string, lab: string) => { const k = cl(sp(t, at)); return t > at ? <React.Fragment key={lab}><div style={{ position: "absolute", left: 1450, top: y - (1 - k) * 160, width: 380, height: h, background: bg, borderRadius: 6, boxShadow: "0 6px 10px rgba(0,0,0,.35)", opacity: cl(k * 3) }} /><Lb t={t} a={at} x={1640} y={y + h / 2 - 18} txt={lab} size={26} w={360} /></React.Fragment> : null; };
  const gn = ei(t, gone, gone + 1);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="watergate" a={green} x={1220} y={860} w={300} />
    <Lb t={t} a={wg} x={1220} y={880} txt="“WATERGATE SALAD”" size={30} w={340} col="#bfe8a8" />
    <div style={{ opacity: 1 - 0.75 * gn }}>
      {L(crust, 760, 70, "repeating-linear-gradient(90deg,#c9893a 0 18px,#e0a85a 18px 36px)", "SALTY PRETZEL CRUST")}
      {L(cream, 660, 100, "linear-gradient(180deg,#fffaf0,#f1e6d0)", "SWEET CREAM CHEESE")}
      {L(straw, 560, 100, "radial-gradient(circle at 30% 50%, #ff6b6b 0 14px, transparent 15px), radial-gradient(circle at 70% 40%, #ff6b6b 0 12px, transparent 13px), linear-gradient(180deg,#e0303a,#b5172a)", "STRAWBERRY JELLO")}
    </div>
    <Stamp t={t} a={gone} x={1640} y={480} txt="GONE FIRST" size={50} />
  </Stage>;
};

// 25 · SEIS CUARTOS: seis frascos de un cuarto se llenan de rojo en fila y se vuelcan en tres fuentes; $18
export const SixQuarts: React.FC<M2> = ({ t, a, out, m: [q6, three, c18] }) => {
  const pour = ei(t, three, three + 1.5);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={q6} y={100} txt="½ CUP × 50 = 6 QUARTS" size={64} font={SANS} weight={900} w={860} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1110 + i * 130, top: 330, width: 100, height: 160, border: "6px solid rgba(255,255,255,.75)", borderRadius: "10px 10px 18px 18px", overflow: "hidden", opacity: cl((t - q6 - i * 0.15) * 4) * (1 - pour) }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(100 * ei(t, q6 + 0.3 + i * 0.2, q6 + 1 + i * 0.2)).toFixed(0)}%`, background: "#d62a37" }} /></div>)}
    {[0, 1, 2].map((i) => <Ob key={i} t={t} n="jellopan" a={three + 0.6 + i * 0.3} x={1170 + i * 285} y={860} w={260} />)}
    <Lb t={t} a={three} x={1450} y={600} txt="3 PANS OF PRETZEL SALAD" size={40} w={700} />
    <Price t={t} a={c18} x={1450} y={940} v="$18" w={200} />
  </Stage>;
};

// 26 · FRÍO EN HIELO: la fuente de gelatina baja dentro de una fuente de hielo picado (vaho frío); termómetro 40°; un reloj 2 h que en verano se parte a 1 h
export const IceNestCold: React.FC<M2> = ({ t, a, out, m: [d40, ice, two, ninety] }) => {
  const h = ei(t, ninety - 0.3, ninety + 0.6);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="icepan" a={ice - 0.3} x={1380} y={900} w={500} />
    <Ob t={t} n="jellopan" a={ice} x={1380} y={860 + 30 * ei(t, ice, ice + 0.8)} w={400} from="up" z={3} />
    {t > ice && [0, 1, 2, 3].map((i) => { const u = ((t - ice) * 0.5 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: 1200 + i * 110, top: 700 - u * 80, width: 120, height: 40, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(220,240,255,.55), transparent)", opacity: Math.sin(Math.PI * u) }} />; })}
    <Dial t={t} a={d40} x={1760} y={330} v={lerp(70, 40, ei(t, d40, d40 + 1))} r={100} hot={999} />
    <Lb t={t} a={d40} x={1760} y={520} txt="40° OR COLDER" size={34} w={320} col="#bfe0ff" />
    <Tag t={t} a={two} x={1380} y={240} txt={h < 0.5 ? "2 HOURS OUT = DONE" : "OVER 90°F: 1 HOUR"} w={440} size={40} col={h < 0.5 ? C.wine : C.red} />
  </Stage>;
};

// 27 · SEIS DOCENAS: 72 panecitos caen en tres canastas de a dos docenas; la panadería ×3; el repasador se dobla sobre la canasta
export const SixDozen: React.FC<M2> = ({ t, a, out, m: [oneh, r72, three, c1056, bak, fold] }) => {
  const fl = ei(t, fold, fold + 0.8);
  return <Stage t={t} a={a} out={out}>
    <Lb t={t} a={oneh} x={1450} y={100} txt="1½ ROLLS A PERSON" size={50} w={700} />
    <Tx t={t} a={r72} y={160} txt={`${cnt(t, r72, r72 + 1.5, 0, 72)} ROLLS`} size={100} font={SANS} weight={900} col={C.goldL} />
    {[0, 1, 2].map((i) => <Ob key={i} t={t} n="rollbasket" a={three + i * 0.35} x={1160 + i * 290} y={860} w={270} />)}
    <Lb t={t} a={three} x={1450} y={900} txt="3 BATCHES OF 2 DOZEN" size={36} w={600} />
    <Price t={t} a={c1056} x={1250} y={460} v="$10.56" w={240} />
    <Tag t={t} a={bak} x={1660} y={460} txt="BAKERY: ×3" w={260} size={42} col={C.red} rot={5} />
    {t > fold && <div style={{ position: "absolute", left: 1320, top: 620, width: 260, height: 120 * fl, background: "repeating-linear-gradient(90deg,#fff 0 14px,#e8e2d6 14px 28px)", borderRadius: 10, boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} />}
  </Stage>;
};

// 28 · MANTECA BLANDA: un pan se desgarra en dos con manteca fría (trozo duro), y con la manteca blanda se unta liso
export const SoftButter: React.FC<M2> = ({ t, a, out, m: [soft, tear] }) => {
  const rip = ei(t, tear - 0.6, tear + 0.4);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="butterdish" a={soft - 0.2} x={1700} y={860} w={300} />
    <Lb t={t} a={soft} x={1700} y={880} txt="ALREADY SOFT" size={34} w={320} col={GOOD} />
    <div style={{ position: "absolute", left: 1150, top: 520, width: 160, height: 160, borderRadius: "48%", background: `radial-gradient(circle at 38% 32%, #ffe6b0, #d99a4e 60%, #9a5a22)`, transform: `translateX(${(-40 * rip).toFixed(0)}px) rotate(${(-12 * rip).toFixed(1)}deg)`, clipPath: "polygon(0 0,55% 0,45% 30%,58% 55%,44% 100%,0 100%)", opacity: cl((t - a) * 4) }} />
    <div style={{ position: "absolute", left: 1150, top: 520, width: 160, height: 160, borderRadius: "48%", background: `radial-gradient(circle at 38% 32%, #ffe6b0, #d99a4e 60%, #9a5a22)`, transform: `translateX(${(40 * rip).toFixed(0)}px) rotate(${(12 * rip).toFixed(1)}deg)`, clipPath: "polygon(55% 0,100% 0,100% 100%,44% 100%,58% 55%,45% 30%)", opacity: cl((t - a) * 4) }} />
    <div style={{ position: "absolute", left: 1210, top: 500, width: 50, height: 34, background: "#f6e08a", borderRadius: 4, opacity: 1 - rip * 0.3 }} />
    <Lb t={t} a={tear} x={1230} y={740} txt="COLD BUTTER TEARS IT" size={32} w={380} col={C.red} />
  </Stage>;
};

// 29 · LA TORTA EN BANDEJA (5 × 8): la bandeja de chocolate; el glaseado caliente se vierte y se hunde; una regla aparece y la grilla se corta en 5 × 8 = 40 cuadrados parejos; los torcidos (a ojo) se tachan
export const RulerCake: React.FC<M2> = ({ t, a, out, m: [sheet, warm, fudgy, forty, ruler, eyeball] }) => {
  const X = 1120, Y = 380, W = 680, H = 460, ice = ei(t, warm - 0.3, fudgy + 1);
  return <Stage t={t} a={a} out={out}>
    <Tag t={t} a={sheet} x={1450} y={90} txt="CHURCH SHEET CAKE · P. 65" w={640} size={36} />
    <div style={{ position: "absolute", left: X - 18, top: Y - 18, width: W + 36, height: H + 36, borderRadius: 14, background: "linear-gradient(180deg,#c9ccd0,#8d9297)", boxShadow: "0 20px 30px rgba(0,0,0,.55)", opacity: cl((t - a) * 4) }} />
    <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, background: "linear-gradient(180deg,#6a3a1c,#4a2410)", opacity: cl((t - a) * 4) }} />
    <div style={{ position: "absolute", left: X, top: Y, width: W * ice, height: H, background: "linear-gradient(135deg,#3a1a0a,#5a2c14 40%,#2e1206)", boxShadow: "inset 0 0 24px rgba(255,255,255,.12)" }} />
    <Lb t={t} a={warm} x={1450} y={200} txt="ICING POURED ON WARM" size={42} w={700} col={C.goldL} />
    {t > ruler && <div style={{ position: "absolute", left: X - 40, top: Y - 70, width: W + 80, height: 46, background: "repeating-linear-gradient(90deg,#f3dc8c 0 2px,#e8c96a 2px 34px)", borderRadius: 4, boxShadow: "0 6px 10px rgba(0,0,0,.4)", opacity: cl((t - ruler) * 4) * (1 - ei(t, forty + 8, forty + 9)) }} />}
    <Grid t={t} a={ruler + 0.5} x={X} y={Y} w={W} h={H} c={8} r={5} dur={2.5} col="rgba(255,235,200,.75)" />
    <Tx t={t} a={forty} y={880} txt="5 × 8 = 40 SQUARES" size={70} font={SANS} weight={900} col={C.goldL} />
    <Lb t={t} a={eyeball} x={1450} y={980} txt="BY EYE: 36 + 4 CROOKED ONES NOBODY EATS" size={30} w={820} col={C.red} />
  </Stage>;
};

// 30 · LIMÓN EN 48: el pan de limón se corta con cuchillo mojado (gotas); 24 de venta vs 48 de funeral; el azúcar impalpable cae como nieve
export const LemonSnow: React.FC<M2> = ({ t, a, out, m: [lemon, hot, wet, b24, l48, snow] }) => {
  const X = 1200, Y = 380, W = 520, H = 360, small = t > l48;
  return <Stage t={t} a={a} out={out}>
    <Tag t={t} a={lemon} x={1450} y={90} txt="LEMON BARS · P. 64" w={520} size={38} />
    <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, background: "linear-gradient(180deg,#f7dc5a,#e8c13a 70%,#d9a85a)", borderRadius: 8, boxShadow: "0 18px 26px rgba(0,0,0,.5)", opacity: cl((t - a) * 4) }} />
    <Lb t={t} a={hot} x={1450} y={210} txt="FILLING ON THE HOT CRUST" size={38} w={700} />
    <Lb t={t} a={wet} x={1450} y={280} txt="WET KNIFE · WIPE EVERY CUT" size={36} w={700} col={C.goldL} />
    {!small && <Grid t={t} a={b24} x={X} y={Y} w={W} h={H} c={6} r={4} dur={1.2} />}
    {small && <Grid t={t} a={l48} x={X} y={Y} w={W} h={H} c={8} r={6} dur={1.4} />}
    <Tx t={t} a={b24} x={1450} y={780} txt={small ? "FUNERAL: 48 LITTLE ONES" : "BAKE SALE: 24"} size={54} font={SANS} weight={900} w={760} col={small ? C.goldL : C.cream} />
    {t > snow && Array.from({ length: 40 }, (_, i) => { const u = ((t - snow) * 0.35 + i / 40) % 1; return <div key={i} style={{ position: "absolute", left: X + ((i * 53) % W), top: Y - 120 + u * (H + 120), width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: Math.sin(Math.PI * u) * 0.9 }} />; })}
  </Stage>;
};

// 31 · 88 PIEZAS: 40 cuadraditos de chocolate y 48 de limón se apilan en una torre de conteo frente a 50 personas; $15.50; un tercer plato (scotcheroos) entra solo
export const EightyEight: React.FC<M2> = ({ t, a, out, m: [p88, never, c, third, sc] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={p88 - 1} y={90} txt={`${cnt(t, p88 - 1, p88 + 0.5, 0, 88)} PIECES · 50 PEOPLE`} size={64} font={SANS} weight={900} w={860} />
  {Array.from({ length: 88 }, (_, i) => { const at = p88 - 1 + i * 0.016; return t > at ? <div key={i} style={{ position: "absolute", left: 1110 + (i % 11) * 44, top: 260 + Math.floor(i / 11) * 44, width: 38, height: 38, borderRadius: 5, background: i < 40 ? "#4a2410" : "#f2d35a", boxShadow: "0 3px 4px rgba(0,0,0,.35)" }} /> : null; })}
  <Lb t={t} a={never} x={1350} y={640} txt="THEY NEVER COME BACK" size={40} w={600} col={C.goldL} />
  <Price t={t} a={c} x={1250} y={740} v="$15.50" w={240} />
  <Ob t={t} n="scotcheroo" a={third} x={1700} y={960} w={200} from="right" />
  <Lb t={t} a={sc} x={1700} y={980} txt="NOBODY SIGNED UP FOR" size={28} w={320} />
</Stage>;

// 32 · ALREDEDOR DE LA URNA: la urna en el centro; muñequitos (hombres) se juntan en ronda con frases del clima; del otro lado una mesa donde aparece «se ríen por primera vez»
export const AroundUrn: React.FC<M2> = ({ t, a, out, m: [notd, men, weather, sorry, laugh] }) => <Stage t={t} a={a} out={out}>
  <Card7 t={t} a={a} x={1760} y={190} w={240} hi={6} />
  <Tx t={t} a={notd} y={90} txt="COFFEE IS NOT A DRINK" size={54} font={SANS} weight={900} col={C.goldL} w={660} x={1540} />
  <Ob t={t} n="urn" a={men - 0.3} x={1300} y={820} w={200} />
  {Array.from({ length: 5 }, (_, i) => { const an = Math.PI * (0.15 + 0.7 * i / 4), k = cl(sp(t, men + i * 0.2)); return <div key={i} style={{ position: "absolute", left: 1300 + Math.cos(an) * 220 - 25, top: 760 - Math.sin(an) * 110 - 75 + (1 - k) * 60, opacity: k }}><People t={t} a={men + i * 0.2} x={0} y={0} n={1} s={50} /></div>; })}
  <Lb t={t} a={weather} x={1560} y={300} txt="THE WEATHER · THE CROPS" size={34} w={560} />
  <Lb t={t} a={sorry} x={1560} y={370} txt="= “I'M SORRY”" size={40} w={480} col={C.goldL} />
  <Tag t={t} a={laugh} x={1690} y={720} txt="THE FIRST LAUGH ALL DAY" w={360} size={30} col="#7a4a10" />
</Stage>;

// 33 · DOS URNAS: 1½ taza × 50 = 75 tazas; dos urnas de 40 se llenan con nivel; $9 → 12¢ la taza
export const TwoUrns: React.FC<M2> = ({ t, a, out, m: [cup, c75, u40, two, c9, c12] }) => <Stage t={t} a={a} out={out}>
  <Lb t={t} a={cup} x={1450} y={100} txt="1½ CUPS A PERSON" size={48} w={700} />
  <Tx t={t} a={c75} y={160} txt="75 CUPS" size={110} font={SANS} weight={900} col={C.goldL} />
  {[0, 1].map((i) => { const at = i ? two : u40, f = ei(t, at, at + 1.5) * (i ? 35 / 40 : 1); return <React.Fragment key={i}>
    <Ob t={t} n="urn" a={at - 0.3} x={1250 + i * 340} y={920} w={210} />
    <div style={{ position: "absolute", left: 1250 + i * 340 + 120, top: 560, width: 26, height: 300, borderRadius: 13, background: "rgba(0,0,0,.45)", border: "3px solid rgba(255,240,210,.5)", opacity: cl((t - at) * 4) }}><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(100 * f).toFixed(0)}%`, background: "#8a4b22", borderRadius: 13 }} /></div>
    <Lb t={t} a={at} x={1250 + i * 340} y={940} txt={i ? "+35" : "40 CUPS"} size={30} w={200} /></React.Fragment>; })}
  <Price t={t} a={c9} x={1450} y={420} v="$9" w={160} />
  <Tag t={t} a={c12} x={1660} y={420} txt="12¢ A CUP" w={260} size={44} col="#2f6a35" />
</Stage>;

// 34 · CAFÉ DE HUEVO, PARTE 1: el huevo cae y se rompe con cáscara sobre el café molido; la cáscara se aplasta; se forma la pasta «arena mojada»
export const EggCoffeeA: React.FC<M2> = ({ t, a, out, m: [scand, cupc, crack, crush, sand] }) => {
  const p = arc(t, crack - 0.5, 0.5, 1700, 200, 1440, 640, 60), mud = ei(t, sand - 0.5, sand + 0.8);
  return <Stage t={t} a={a} out={out}>
    <Tag t={t} a={scand} x={1450} y={90} txt="SCANDINAVIAN LUTHERAN EGG COFFEE" w={720} size={34} />
    <div style={{ position: "absolute", left: 1220, top: 640, width: 440, height: 220, borderRadius: "0 0 220px 220px", background: "linear-gradient(180deg,#f3ecdf,#cfc5b3)", boxShadow: "0 18px 26px rgba(0,0,0,.5)", opacity: cl((t - cupc) * 4) }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 0, height: 60, borderRadius: "50%", background: mud > 0 ? `rgb(${Math.round(lerp(90, 55, mud))},${Math.round(lerp(55, 38, mud))},${Math.round(lerp(30, 22, mud))})` : "#5a3720", backgroundImage: "radial-gradient(rgba(0,0,0,.35) 1px, transparent 1.5px)", backgroundSize: "8px 8px" }} />
    </div>
    <Lb t={t} a={cupc} x={1440} y={900} txt="1 CUP GROUND COFFEE" size={34} w={460} />
    {t > crack - 0.5 && t < crack + 0.2 && <Img src={O("egg")} style={{ position: "absolute", left: p.x - 50, top: p.y - 70, width: 100, transform: `rotate(${(p.k * 200).toFixed(0)}deg)` }} />}
    {t > crack && Array.from({ length: 9 }, (_, i) => { const k = ei(t, crack, crack + 0.4), sq = ei(t, crush, crush + 0.6); const an = i * 0.7; return <div key={i} style={{ position: "absolute", left: 1440 + Math.cos(an) * 70 * k * (1 - 0.6 * sq) - 12, top: 650 + Math.sin(an) * 18 * k - 8, width: 26 * (1 - 0.5 * sq), height: 16 * (1 - 0.5 * sq), background: "#f2e8da", borderRadius: 4, transform: `rotate(${i * 40}deg)`, boxShadow: "0 2px 3px rgba(0,0,0,.4)" }} />; })}
    <Lb t={t} a={crack} x={1440} y={440} txt="SHELL AND ALL" size={50} w={520} col={C.goldL} />
    <Tx t={t} a={sand} y={240} txt="WET SAND" size={80} font={HAND} weight={700} />
  </Stage>;
};

// 35 · CAFÉ DE HUEVO, PARTE 2 (wow): olla vista en corte: la balsa de borra flota arriba (3-4 min), entra la taza de agua fría y la balsa SE HUNDE; el líquido de arriba se aclara a ámbar
export const RaftSink: React.FC<M2> = ({ t, a, out, m: [scrape, boil, raft, cold, sink, clear] }) => {
  const s = ei(t, sink - 0.4, sink + 2.2), cl2 = ei(t, sink + 0.5, clear + 1), up = ei(t, raft - 1, raft + 0.5);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1150, top: 300, width: 560, height: 620, borderRadius: "16px 16px 60px 60px", border: "14px solid #b8bdc2", borderTop: "none", background: `linear-gradient(180deg, rgb(${Math.round(lerp(70, 200, cl2))},${Math.round(lerp(40, 130, cl2))},${Math.round(lerp(20, 50, cl2))}) 0%, rgb(${Math.round(lerp(60, 170, cl2))},${Math.round(lerp(35, 100, cl2))},${Math.round(lerp(18, 35, cl2))}) 100%)`, overflow: "hidden", boxShadow: "0 20px 30px rgba(0,0,0,.6)", opacity: cl((t - a) * 4) }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: lerp(lerp(500, 30, up), 520, s), height: 80, borderRadius: "40% 40% 30% 30%", background: "radial-gradient(ellipse at 50% 30%, #6e4a2a, #3a2412)", backgroundImage: "radial-gradient(rgba(240,230,200,.35) 2px, transparent 3px)", backgroundSize: "14px 12px", opacity: t > scrape ? 1 : 0 }} />
      {t > boil && t < sink && Array.from({ length: 10 }, (_, i) => { const u = ((t - boil) * 1.2 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 40 + ((i * 67) % 460), top: 560 - u * 450, width: 16, height: 16, borderRadius: "50%", border: "3px solid rgba(255,255,255,.6)", opacity: 1 - u }} />; })}
    </div>
    <Lb t={t} a={scrape} x={1430} y={150} txt="PASTE INTO THE BOILING POT" size={40} w={700} op={1 - ei(t, sink - 0.6, sink - 0.1)} />
    <Tag t={t} a={raft} x={1820} y={360} txt="A RAFT" w={200} size={46} rot={6} />
    <Ob t={t} n="cupsaucer" a={cold - 0.3} x={1800} y={680} w={170} r={-30 * ei(t, cold, cold + 0.6)} from="right" />
    <Lb t={t} a={cold} x={1800} y={700} txt="1 CUP ICE-COLD WATER" size={26} w={220} col="#bfe0ff" />
    <Lb t={t} a={sink} x={1430} y={150} txt="THE RAFT SINKS" size={52} w={600} col={C.goldL} />
    <Ob t={t} n="amber" a={clear - 0.2} x={1800} y={980} w={150} />
    <Lb t={t} a={clear} x={1800} y={990} txt="CLEAR AMBER" size={28} w={220} col={C.goldL} />
  </Stage>;
};

// 36 · LA REGLA DE LA URNA: urna con un indicador; a la mitad, salta la alarma «NUEVA TANDA»; una zapatilla vieja tachada = café de 2 horas
export const UrnHalf: React.FC<M2> = ({ t, a, out, m: [b5, rule, shoe, half] }) => {
  const lvl = 1 - 0.55 * ei(t, rule, half + 0.5);
  return <Stage t={t} a={a} out={out}>
    <Lb t={t} a={b5} x={1450} y={100} txt="5 GALLONS · 5 CUPS · 5 EGGS" size={46} w={800} />
    <Ob t={t} n="urn" a={a + 0.1} x={1300} y={940} w={260} />
    <div style={{ position: "absolute", left: 1470, top: 440, width: 40, height: 460, borderRadius: 20, background: "rgba(0,0,0,.45)", border: "3px solid rgba(255,240,210,.5)", opacity: cl((t - a) * 4) }}><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(100 * lvl).toFixed(0)}%`, background: "#8a4b22", borderRadius: 20 }} /></div>
    <Lb t={t} a={shoe} x={1720} y={460} txt="2 HOURS = AN OLD SHOE" size={32} w={380} col={C.red} />
    <Stamp t={t} a={half} x={1700} y={680} txt="HALF EMPTY → NEW BATCH" size={34} col={GOOD} rot={-4} />
  </Stage>;
};

// 37 · SI SE ACABA EL CAFÉ: la puerta del salón se abre y todos los muñequitos salen; se apagan las luces
export const EverybodyHome: React.FC<M2> = ({ t, a, out, m: [ham, coffee] }) => {
  const go = ei(t, coffee + 0.4, coffee + 2.4);
  return <Stage t={t} a={a} out={out}>
    <Lb t={t} a={ham} x={1450} y={100} txt="OUT OF HAM? SOMEBODY MAKES A SANDWICH" size={36} w={860} />
    <div style={{ position: "absolute", left: 1720, top: 420, width: 140, height: 360, background: `rgba(255,220,140,${(0.25 + 0.5 * go).toFixed(2)})`, border: "8px solid #5a3a1e", opacity: cl((t - a) * 4) }} />
    {Array.from({ length: 18 }, (_, i) => { const sx = 1100 + (i % 6) * 95, sy = 520 + Math.floor(i / 6) * 90, g = cl(go * 1.6 - i * 0.03); return <div key={i} style={{ position: "absolute", left: lerp(sx, 1770, g), top: lerp(sy, 640, g), opacity: 1 - ei(t, coffee + 1.6 + i * 0.04, coffee + 2.6) }}><People t={t} a={a + 0.2} x={0} y={0} n={1} s={40} /></div>; })}
    <Tx t={t} a={coffee} y={860} txt="OUT OF COFFEE? EVERYBODY GOES HOME" size={52} font={SANS} weight={900} w={880} col={C.goldL} />
  </Stage>;
};

// 38 · LA CUENTA DE LAS SIETE LÍNEAS: barras horizontales por renglón crecen proporcionales al precio (las papas la más larga), suma $143.56 → $2.87 → «CALL IT $3»
export const SevenBars: React.FC<M2> = ({ t, a, out, m: [gro, tot, pp, three] }) => {
  const B: [string, number][] = [["HAM + GLAZE", 33], ["POTATOES", 45], ["GREEN BEANS", 12.5], ["JELLO SALAD", 18], ["ROLLS", 10.56], ["BARS", 15.5], ["COFFEE", 9]];
  return <Stage t={t} a={a} out={out}>
    {B.map(([s, v], i) => { const at = gro + 1 + i * 4.2; return <React.Fragment key={i}>
      <Lb t={t} a={at} x={1200} y={170 + i * 82} txt={s} size={26} w={260} />
      {t > at && <div style={{ position: "absolute", left: 1340, top: 176 + i * 82, height: 40, width: 480 * (v / 45) * ei(t, at, at + 0.7), borderRadius: 8, background: i === 1 ? C.goldL : "rgba(255,240,210,.8)" }} />}
      <Lb t={t} a={at + 0.5} x={1360 + 480 * (v / 45) + 60} y={174 + i * 82} txt={`$${v % 1 ? v.toFixed(2) : v}`} size={26} w={140} col={C.goldL} />
    </React.Fragment>; })}
    <Tx t={t} a={tot} y={760} txt="$143.56 · 50 PEOPLE" size={62} font={SANS} weight={900} w={860} />
    <Lb t={t} a={pp} x={1450} y={860} txt="$2.87 A PLATE" size={50} w={500} />
    <Stamp t={t} a={three} x={1450} y={960} txt="CALL IT $3" col={GOOD} size={56} />
  </Stage>;
};

// 39 · 1971 vs HOY y EL CATERING: «UNDER $40» de la tarjeta se tacha; 69¢/lb; el catering de Des Moines suma $16 × 50 = $800 en bandejas de aluminio sin nombre
export const CatererVs: React.FC<M2> = ({ t, a, out, m: [u40, c69, cat, six, e800, noname] }) => <Stage t={t} a={a} out={out}>
  <Tag t={t} a={u40} x={1200} y={150} txt="1971: UNDER $40" w={340} size={40} />
  <Lb t={t} a={c69} x={1200} y={240} txt="HAM 69¢ A POUND" size={32} w={360} />
  <Stroke t={t} a={c69 + 2.5} d="M 1040 175 L 1360 175" col={C.red} sw={9} dur={0.4} len={340} />
  <Ob t={t} n="catertray" a={cat} x={1660} y={780} w={340} />
  <Lb t={t} a={cat + 1} x={1660} y={150} txt="A CATERER IN DES MOINES" size={34} w={420} />
  <Tag t={t} a={six} x={1660} y={260} txt="$16 A PERSON" w={300} size={44} col={C.red} />
  <Tx t={t} a={e800} x={1660} y={360} txt="× 50 = $800" size={64} font={SANS} weight={900} w={440} col={C.red} />
  <Lb t={t} a={noname} x={1660} y={800} txt="DOESN'T KNOW ANYBODY'S NAME" size={28} w={400} />
  <Ob t={t} n="paperplate" a={e800 + 1} x={1200} y={860} w={300} />
  <Lb t={t} a={e800 + 1.3} x={1200} y={880} txt="US: $3" size={40} w={240} col={GOOD} />
</Stage>;

// 40 · EL FONDO Y EL AMOR: la lata del fondo paga jamón, café y panes ($50); el resto llega en fuentes de 9×13 de a una, con un corazón que late
export const FundLove: React.FC<M2> = ({ t, a, out, m: [fund, each, fifty, love] }) => <Stage t={t} a={a} out={out}>
  <Ob t={t} n="coffeecan" a={fund - 0.2} x={1200} y={860} w={240} />
  <Lb t={t} a={fund} x={1200} y={880} txt="THE FUNERAL FUND" size={32} w={340} col={C.goldL} />
  <Lb t={t} a={fund + 0.6} x={1200} y={420} txt="HAM · COFFEE · ROLLS" size={34} w={360} />
  <Price t={t} a={fifty} x={1200} y={300} v="≈ $50" w={220} />
  {["potatopan", "greenbeans", "jellopan", "lemonbars"].map((n, i) => <Ob key={n} t={t} n={n} a={each + i * 0.4} x={1560 + (i % 2) * 230} y={640 + Math.floor(i / 2) * 260} w={210} from={i % 2 ? "right" : "up"} />)}
  {t > love && <div style={{ position: "absolute", left: 1600, top: 220, fontSize: 160, color: C.red, textShadow: ring("#1a0e08", 4), transform: `scale(${(1 + 0.1 * Math.sin((t - love) * 7)).toFixed(3)})`, opacity: cl((t - love) * 4) }}>♥</div>}
</Stage>;

// 41 · LA HOJA DE ANOTACIÓN: el corcho con la hoja; los renglones con 1-2-3-4 casillas se llenan con firmas; al final +10 % convierte 50 en 55 (un primo que llega)
export const SignupSheet: React.FC<M2> = ({ t, a, out, m: [bull, left, names, ten, cousin, p55] }) => {
  const R: [string, number][] = [["POTATOES", 4], ["BEANS", 2], ["JELLO", 3], ["BARS", 2]];
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1110, top: 200, width: 560, height: 640, background: "radial-gradient(#b8875a 1px, #a87a4e 2px)", backgroundSize: "6px 6px", border: "14px solid #6e4a26", borderRadius: 8, boxShadow: "0 20px 30px rgba(0,0,0,.55)", opacity: cl((t - bull) * 4) }}>
      <div style={{ position: "absolute", left: 40, top: 30, width: 460, height: 560, background: "#fbfaf4", boxShadow: "0 6px 10px rgba(0,0,0,.35)", fontFamily: SANS, color: C.ink }}>
        {R.map(([s, n], i) => <div key={i} style={{ position: "absolute", left: 20, top: 30 + i * 130, opacity: cl((t - left - i * 0.4) * 4) }}><div style={{ fontWeight: 900, fontSize: 30 }}>{s}</div>
          {Array.from({ length: n }, (_, j) => <div key={j} style={{ display: "inline-block", width: 96, marginRight: 8, marginTop: 6, borderBottom: "2px solid #444", fontFamily: HAND, fontSize: 30, color: "#2a3f7a", height: 40 }}>{t > names + i * 0.5 + j * 0.25 ? ["Ruth", "Marlys", "Bev", "Jo"][(i + j) % 4] : ""}</div>)}</div>)}
      </div>
    </div>
    <Tag t={t} a={ten} x={1760} y={300} txt="+10%" w={200} size={64} col="#2f6a35" />
    <Lb t={t} a={cousin} x={1760} y={420} txt="SOMEBODY BRINGS A COUSIN" size={26} w={260} />
    <Tx t={t} a={p55} x={1760} y={540} txt={`${cnt(t, p55, p55 + 1, 50, 55)}`} size={130} font={SANS} weight={900} w={260} col={C.goldL} />
  </Stage>;
};

// 42 · EL ORDEN DE LA FILA (dos mesas): la mesa larga recibe platos → jamón → papas → chauchas → gelatina → panes; postres y café se van a otra mesa al otro lado del salón
export const LineOrder: React.FC<M2> = ({ t, a, out, m: [o1, o2, o3, o4, o5, o6, sep, across] }) => {
  const S: [number, string][] = [[o1, "chinaplate"], [o2, "hamslices"], [o3, "potatopan"], [o4, "greenbeans"], [o5, "jellopan"], [o6, "rollbasket"]];
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1040, top: 540, width: 820, height: 34, borderRadius: 8, background: "linear-gradient(180deg,#f3ead8,#cdbf9f)", boxShadow: "0 14px 22px rgba(0,0,0,.5)", opacity: cl((t - a) * 4) }} />
    {S.map(([at, n], i) => <React.Fragment key={i}><Ob t={t} n={n} a={at - 0.1} x={1100 + i * 140} y={545} w={130} /><Lb t={t} a={at} x={1100 + i * 140} y={590} txt={`${i + 1}`} size={34} w={60} col={C.goldL} /></React.Fragment>)}
    <div style={{ position: "absolute", left: 1500, top: 880, width: 360, height: 30, borderRadius: 8, background: "linear-gradient(180deg,#f3ead8,#cdbf9f)", opacity: cl((t - sep) * 4) }} />
    <Ob t={t} n="lemonbars" a={sep} x={1590} y={885} w={170} />
    <Ob t={t} n="urn" a={across} x={1780} y={885} w={110} />
    <Lb t={t} a={sep} x={1250} y={840} txt="BARS & COFFEE: ACROSS THE ROOM" size={30} w={440} />
  </Stage>;
};

// 43 · LA MESA DE LA FAMILIA: una mesa redonda con mantel, platos de loza y tazas ya servidas; dos platos llegan volando desde la fila
export const FamilyTable: React.FC<M2> = ({ t, a, out, m: [down, round, real, two] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={a + 0.1} y={90} txt="THE FAMILY DOESN'T STAND IN LINE" size={56} font={SANS} weight={900} w={880} col={C.goldL} />
  <Lb t={t} a={down} x={1450} y={180} txt="DOWN THE STAIRS FIRST" size={38} w={600} />
  <div style={{ position: "absolute", left: 1150, top: 520, width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #fffaf0, #e8dcc4)", boxShadow: "0 24px 30px rgba(0,0,0,.55)", opacity: cl((t - round) * 4) }} />
  {Array.from({ length: 5 }, (_, i) => { const an = Math.PI * 2 * i / 5 + 0.3; return <React.Fragment key={i}>
    <Ob t={t} n="chinaplate" a={real + i * 0.15} x={1450 + Math.cos(an) * 220} y={690 + Math.sin(an) * 100} w={120} from="pop" />
    <Ob t={t} n="cupsaucer" a={real + 0.8 + i * 0.15} x={1450 + Math.cos(an) * 220 + 70} y={680 + Math.sin(an) * 100} w={70} from="pop" /></React.Fragment>; })}
  {[0, 1].map((i) => { const p = arc(t, two + i * 0.6, 1, 1900, 400, 1380 + i * 160, 640, 180); return t > two + i * 0.6 ? <Img key={i} src={O("paperplate")} style={{ position: "absolute", left: p.x - 70, top: p.y - 50, width: 140, opacity: 1 - ei(t, two + i * 0.6 + 0.9, two + i * 0.6 + 1.1) }} /> : null; })}
  <Lb t={t} a={real} x={1450} y={880} txt="REAL PLATES · COFFEE ALREADY POURED" size={32} w={700} />
</Stage>;

// 44 · FUENTES CHICAS Y RELEVO: en la mesa una fuente se va vaciando; del horno sale la de relevo y la vieja vuelve a la cocina (carrusel); 2 h · 140° · 40°
export const PanRelay: React.FC<M2> = ({ t, a, out, m: [never1, keep, low, small, two] }) => {
  const sw = ei(t, low + 0.6, low + 2);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="potatopan" a={never1 - 0.2} x={1300} y={500} w={460} op={1 - ei(t, never1 + 1.5, never1 + 2)} />
    {t < never1 + 2 && <XM t={t} at={never1 + 0.6} x={1300} y={380} s={80} />}
    <Lb t={t} a={never1} x={1300} y={160} txt="NEVER ONE BIG PAN" size={44} w={560} col={C.red} />
    <Ob t={t} n="potatopan" a={keep} x={lerp(1240, 1900, sw)} y={860} w={260} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(${(1 - 0.35 * ei(t, keep + 1, low)).toFixed(2)})`} op={1 - sw} />
    <Ob t={t} n="potatopan" a={low + 0.6} x={lerp(1000, 1240, sw)} y={860} w={260} from="none" op={sw} />
    <Lb t={t} a={keep} x={1600} y={560} txt="THE OTHER 3 HOT IN THE OVEN" size={32} w={480} />
    <Lb t={t} a={small} x={1600} y={640} txt="SMALL PANS · REPLACE THEM" size={36} w={480} col={C.goldL} />
    <Tag t={t} a={two} x={1650} y={300} txt="2 H · HOT 140° · COLD 40°" w={420} size={32} />
  </Stage>;
};

// 45 · LA BANDEJA DE LAS SOBRAS: la bandeja descartable recibe tajadas, papa, chauchas, panes y barras; la cinta azul escribe NOMBRE · CONTENIDO · FECHA; poco hondo enfría rápido (termograma)
export const LeftoverTray: React.FC<M2> = ({ t, a, out, m: [al, tape, date, fr, shallow, deep] }) => {
  const wr = ei(t, date - 0.5, date + 1.5), txt = "THE DAHLS · HAM, POT. · THU";
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="alupan" a={al - 0.2} x={1380} y={760} w={480} />
    {t > tape && <div style={{ position: "absolute", left: 1170, top: 600, width: 420 * ei(t, tape, tape + 0.5), height: 54, background: "#4a8fd8", opacity: 0.94 }} />}
    {t > date - 0.5 && <div style={{ position: "absolute", left: 1185, top: 610, fontFamily: HAND, fontSize: 32, color: "#111" }}>{txt.slice(0, Math.round(txt.length * wr))}</div>}
    <Tag t={t} a={fr} x={1380} y={200} txt="FRIDGE WITHIN 2 HOURS" w={460} size={40} />
    <div style={{ position: "absolute", left: 1680, top: 380, width: 180, height: 50, borderRadius: 8, background: `linear-gradient(90deg, #3a7bd5, #3a7bd5)`, opacity: cl((t - shallow) * 4) }} />
    <Lb t={t} a={shallow} x={1770} y={440} txt="SHALLOW: COLD FAST" size={24} w={220} col="#bfe0ff" />
    <div style={{ position: "absolute", left: 1680, top: 540, width: 180, height: 160, borderRadius: 8, background: `radial-gradient(ellipse at 50% 55%, #e0402a ${(30 * ei(t, deep, deep + 1)).toFixed(0)}%, #3a7bd5 75%)`, opacity: cl((t - deep) * 4) }} />
    <Lb t={t} a={deep} x={1770} y={710} txt="DEEP: WARM IN THE MIDDLE" size={24} w={240} col={C.red} />
  </Stage>;
};

// 46 · CINCO ERRORES: cinco fichas de dominó de pie; con cada error cae una (efecto dominó) y muestra su ícono
export const DominoFive: React.FC<M2> = ({ t, a, out, m: [m1, m2, m3, m4, m5] }) => {
  const M5: [number, string][] = [[m1, "+10%"], [m2, "1 BIG PAN"], [m3, "COFFEE LAST"], [m4, "JELLO SAME DAY"], [m5, "FAMILY IN LINE"]];
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="5 MISTAKES" size={90} font={SANS} weight={900} col={C.goldL} />
    {M5.map(([at, s], i) => { const f = ei(t, at, at + 0.5); return <div key={i} style={{ position: "absolute", left: 1100 + i * 160, top: 380, width: 110, height: 300, borderRadius: 14, background: "linear-gradient(180deg,#fbf3e4,#e3d4b4)", boxShadow: "0 14px 20px rgba(0,0,0,.5)", transform: `rotate(${(80 * f).toFixed(1)}deg)`, transformOrigin: "100% 100%", opacity: cl((t - a - i * 0.1) * 4) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: C.wine }}>{i + 1}</div>
      <div style={{ position: "absolute", left: 6, right: 6, top: 120, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, color: C.ink, opacity: f }}>{s}</div></div>; })}
  </Stage>;
};

// 47 · LOS DOS DÍAS (riel): martes / miércoles «día frío» / jueves «día caliente»; un riel horario se desliza 6:00 → 11:45 con íconos que se prenden
export const ThreeDayRail: React.FC<M2> = ({ t, a, out, m: [tue, wed, thu, t6, t9, t10, t1030, t1045, t11, t1145] }) => {
  const H: [number, string, string][] = [[t6, "6:00", "ham"], [t9, "9:00", "potatopan"], [t10, "10:00", "greenbeans"], [t1030, "10:30", "urn"], [t1045, "10:45", "rollbasket"], [t11, "11:00", "ham"], [t1145, "11:45", "paperplate"]];
  const sl = ei(t, t6 - 0.5, t1145 + 1);
  return <Stage t={t} a={a} out={out}>
    {[[tue, "TUE", "THE CALL · SIGN-UP BY NOON", "#c7c1b3"], [wed, "WED", "THE COLD DAY", "#9fd0ff"], [thu, "THU", "THE HOT DAY", "#ff9a6a"]].map(([at, d, s, col], i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 1090 + i * 270, top: 150, width: 250, height: 150, borderRadius: 14, background: col as string, opacity: cl((t - (at as number)) * 4) * (t > thu && i < 2 ? 0.45 : 1), boxShadow: "0 10px 16px rgba(0,0,0,.4)" }} />
      <Lb t={t} a={at as number} x={1215 + i * 270} y={165} txt={d as string} size={50} w={240} col={C.ink} />
      <Lb t={t} a={(at as number) + 0.3} x={1215 + i * 270} y={240} txt={s as string} size={20} w={240} col={C.ink} /></React.Fragment>)}
    {t > wed && t < thu && ["jellopan", "lemonbars", "rollbasket", "ham"].map((n, i) => <Ob key={n} t={t} n={n} a={wed + 1 + i * 3} x={1150 + i * 200} y={700} w={180} />)}
    <div style={{ position: "absolute", left: 1040 - 1200 * sl + 400, top: 640, width: 2400, height: 6, background: "rgba(255,240,210,.6)", opacity: cl((t - t6 + 0.5) * 3) }} />
    {t > thu && H.map(([at, h, n], i) => { const x = 1440 + i * 260 - 1560 * sl + 200; return x > 950 && x < 1950 ? <React.Fragment key={i}>
      <Ob t={t} n={n} a={at - 0.2} x={x} y={620} w={150} from="pop" op={t > at ? 1 : 0.25} />
      <Lb t={t} a={at - 0.3} x={x} y={660} txt={h} size={30} w={160} col={t > at ? C.goldL : C.cream} /></React.Fragment> : null; })}
  </Stage>;
};

// 48 · LO QUE MAMÁ NUNCA HIZO: cinco renglones en la tarjeta con «NEVER» de sello; al último, una silla en la cocina vacía con una taza humeante
export const NeverFive: React.FC<M2> = ({ t, a, out, m: [n1, n2, n3, n4, n5, sit] }) => {
  const N5: [number, string][] = [[n1, "ASKED “WHAT DO YOU NEED?”"], [n2, "LET THE FAMILY STAND IN LINE"], [n3, "THREW AWAY LEFTOVERS"], [n4, "CHARGED ONE DOLLAR"], [n5, "LEFT THE KITCHEN EMPTY"]];
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={80} txt="MOM NEVER…" size={86} font={SANS} weight={900} col={C.goldL} />
    {N5.map(([at, s], i) => <React.Fragment key={i}><Lb t={t} a={at} x={1500} y={230 + i * 105} txt={s} size={32} w={620} /><Stamp t={t} a={at + 0.3} x={1150} y={255 + i * 105} txt="NEVER" size={30} rot={-8} /></React.Fragment>)}
    <Ob t={t} n="cupsaucer" a={sit - 0.3} x={1700} y={930} w={160} />
    {t > sit && <Vapor t={t} a={sit} b={out} x={1700} y={830} big={0.4} />}
    <Lb t={t} a={sit} x={1400} y={900} txt="SOMEBODY TO SIT WITH" size={34} w={460} col={C.goldL} />
  </Stage>;
};

// 49 · LA SEÑORA DAHL: el órgano (tubos que se encienden), «41 AÑOS»; la tarjeta con los siete renglones TILDADOS uno por uno (cubierto); el sombrero en la puerta
export const DahlOrgan: React.FC<M2> = ({ t, a, out, m: [dahl, org, town, cov, hat, liked] }) => <Stage t={t} a={a} out={out}>
  {Array.from({ length: 11 }, (_, i) => { const h = 180 + Math.abs(5 - i) * -18 + 160, on = ei(t, org + i * 0.08, org + i * 0.08 + 0.3) * (1 - ei(t, cov - 1, cov)); return <div key={i} style={{ position: "absolute", left: 1110 + i * 52, top: 520 - h, width: 38, height: h, borderRadius: "19px 19px 4px 4px", background: `linear-gradient(90deg,#9a7a3a,#f3dc8c ${(40 + 30 * on).toFixed(0)}%,#9a7a3a)`, boxShadow: on > 0.5 ? "0 0 22px rgba(255,220,130,.7)" : "none", opacity: cl((t - dahl) * 3) * (1 - ei(t, cov - 1, cov)) }} />; })}
  <Lb t={t} a={org} x={1400} y={560} txt="ORGANIST · 41 YEARS" size={40} w={600} op={1 - ei(t, cov - 1, cov)} />
  <Lb t={t} a={town} x={1400} y={640} txt="THE WHOLE TOWN CAME" size={36} w={600} op={1 - ei(t, cov - 1, cov)} />
  <Card7 t={t} a={cov - 0.4} x={1380} y={520} w={480} strike={0} />
  {Array.from({ length: 7 }, (_, i) => <CK key={i} t={t} at={cov + 0.3 + i * 0.4} x={1600} y={355 + i * 39} s={18} />)}
  <Ob t={t} n="hat" a={hat - 0.2} x={1760} y={900} w={200} />
  <Tx t={t} a={liked} x={1450} y={860} txt="“MOTHER WOULD HAVE LIKED THAT COFFEE”" size={42} font={SERIF} w={860} />
</Stage>;

// 50 · LÁPIZ EN LOS MÁRGENES: la tarjeta con anotaciones a lápiz que aparecen en el margen (p. 7, +10 %, 1974); el lápiz pasa; «NUNCA CAMBIÉ LOS SIETE»
export const PencilMargin: React.FC<M2> = ({ t, a, out, m: [pencil, y74, never] }) => {
  const pg = ei(t, pencil, y74 + 1.5);
  return <Stage t={t} a={a} out={out}>
    <Card7 t={t} a={a} x={1450} y={520} w={640} pen={pg} />
    <Ob t={t} n="pencil" a={pencil} x={lerp(1700, 1800, pg)} y={lerp(380, 560, pg)} w={260} r={-40} z={4} />
    <Tag t={t} a={y74} x={1250} y={180} txt="1974 · MY FIRST EGG COFFEE" w={480} size={32} />
    <Tx t={t} a={never} y={860} txt="NEVER CHANGED THE 7 LINES" size={58} font={SANS} weight={900} w={860} col={C.goldL} />
  </Stage>;
};

// 51 · ¿Y SI SON 100?: un deslizador 50 → 100 dobla cada cantidad (20→40-45 lb, 4→8 fuentes, 2→4 urnas); sin urna, 4 cafeteras en fila; sin cerdo, 100 presas de pollo
export const Double100: React.FC<M2> = ({ t, a, out, m: [q100, d1, d2, d3, makers, chick, p100] }) => {
  const k = ei(t, q100 + 1, q100 + 2.5);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={q100} y={90} txt={`${Math.round(lerp(50, 100, k))} PEOPLE`} size={90} font={SANS} weight={900} col={C.goldL} />
    {([[d1, "HAM", "20 LB", "40–45 LB"], [d2, "POTATOES", "4 PANS", "8 PANS"], [d3, "COFFEE", "2 URNS", "4 URNS"]] as [number, string, string, string][]).map(([at, s, x, y], i) => <React.Fragment key={i}>
      <Lb t={t} a={at} x={1200} y={250 + i * 80} txt={s} size={30} w={260} />
      <Lb t={t} a={at} x={1420} y={250 + i * 80} txt={x} size={30} w={200} op={0.5} />
      <Lb t={t} a={at + 0.3} x={1650} y={250 + i * 80} txt={`→ ${y}`} size={34} w={300} col={C.goldL} /></React.Fragment>)}
    {[0, 1, 2, 3].map((i) => <Ob key={i} t={t} n="coffeemaker" a={makers + i * 0.2} x={1150 + i * 140} y={860} w={130} op={1 - ei(t, chick - 0.4, chick)} />)}
    <Lb t={t} a={makers} x={1360} y={880} txt="NO URN? 3–4 COFFEE MAKERS" size={28} w={520} op={1 - ei(t, chick - 0.4, chick)} />
    <Ob t={t} n="chicken" a={chick} x={1700} y={880} w={300} />
    <Lb t={t} a={p100} x={1700} y={900} txt="NO PORK? 100 PIECES" size={30} w={320} col={GOOD} />
  </Stage>;
};

// 52 · LA TARJETA OTRA VEZ: los siete renglones se encienden uno a uno con su cantidad al costado; abajo «$143 · $3 A PLATE»
export const CardAgain: React.FC<M2> = ({ t, a, out, m: [r1, r2, r3, r4, r5, r6, r7, sum] }) => {
  const R = [r1, r2, r3, r4, r5, r6, r7], Q = ["20 LB · 140°", "4 PANS · WRING", "10 LB · BACON FAT", "6 QT · 2 DAYS AHEAD", "6 DOZEN · SOFT BUTTER", "SHEET CAKE + LEMON", "75 CUPS · START FIRST"];
  const hi = R.filter((x) => t > x).length - 1;
  return <Stage t={t} a={a} out={out}>
    <Card7 t={t} a={a} x={1260} y={500} w={460} hi={hi} />
    {Q.map((q, i) => <Lb key={i} t={t} a={R[i]} x={1700} y={325 + i * 40} txt={q} size={24} w={360} col={i === hi ? C.goldL : C.cream} />)}
    <Tx t={t} a={sum} y={860} txt="50 PEOPLE · $143 · $3 A PLATE" size={56} font={SANS} weight={900} w={880} col={C.goldL} />
  </Stage>;
};

// 53 · EL TELÉFONO VA A SONAR: la puerta del aparador con la tarjeta adentro; el teléfono de pared tiembla otra vez; «SABRÁS QUÉ HACER»
export const RingAgain: React.FC<M2> = ({ t, a, out, m: [your, still, ring] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={your} y={90} txt="WHAT WAS ON YOUR CHURCH'S TABLE?" size={50} font={SANS} weight={900} w={880} col={C.goldL} />
  <Card7 t={t} a={still - 0.3} x={1240} y={560} w={420} />
  <Ob t={t} n="wallphone" a={still} x={1700} y={820} w={240} r={ring2(t, ring)} origin="50% 20%" />
  {t > ring && [0, 1].map((i) => { const u = ((t - ring) * 1.4 + i / 2) % 1; return <div key={i} style={{ position: "absolute", left: 1700 - 100 - u * 120, top: 460 - u * 120, width: 200 + u * 240, height: 200 + u * 240, borderRadius: "50%", border: `6px solid rgba(255,230,170,${(1 - u) * 0.7})` }} />; })}
  <Lb t={t} a={ring + 1.5} x={1450} y={960} txt="YOU'LL KNOW WHAT TO DO" size={46} w={700} />
</Stage>;
