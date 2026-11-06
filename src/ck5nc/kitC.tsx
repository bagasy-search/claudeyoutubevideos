// ck5nc · kitC = componentes de Funeral Ham Buns: escenas de OBJETOS REALES recortados (public/ck5nc/obj) + piezas CSS (panes cenitales, cortes, relojes)
// que caen de a uno con resorte con peso; texto grande con contorno; un momento wow por componente. Viven a la derecha (x 1000-1890).
import React from "react";
import { Img, staticFile } from "remotion";
import { e, ei } from "../kits/yanqui3d/lib";
import { C, HAND, SANS, SERIF } from "./ui";

const cl = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const O = (n: string) => staticFile(`ck5nc/obj/${n}.png`);
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


// ======================================= helpers propios de ck5nc =======================================
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

// ======================================= helpers propios de ck5nc =======================================
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

// 01 · EL RELOJ Y LAS CUATRO FUENTES: reloj de escuela a las 11:05; cuatro fuentes de bollos caen en fila; «55 MIN» cuenta hacia atrás
export const ClockUrns: React.FC<M> = ({ t, a, out, m: [pans, min55] }) => <Stage t={t} a={a} out={out}>
  <Face t={t} a={a + 0.2} b={out} x={1450} y={250} r={140} h0={11.08} h1={11.2} />
  {[0, 1, 2, 3].map((i) => <Ob key={i} t={t} n="glazedpan" a={pans + i * 0.3} x={1120 + i * 225} y={900 - (i % 2) * 40} w={250} z={i} />)}
  <Tx t={t} a={pans + 1.4} y={430} txt="40 HAM BUNS" size={82} font={SANS} weight={900} col={C.goldL} />
  {t > min55 && <Tx t={t} a={min55} y={560} txt={`${cnt(t, min55, min55 + 3, 55, 52)} MIN TO GO`} size={66} font={SANS} weight={900} w={700} />}
</Stage>;

// 02 · LA FUENTE QUE SE VACÍA: 12 bollos en grilla; a cada visita (cargadores, la esposa del pastor, el de la funeraria) desaparecen de a tres
export const GoneEarly: React.FC<M> = ({ t, a, out, m: [half, pb, pw, fd] }) => {
  const who = [pb, pw, fd], take = (i: number) => { const g = Math.floor(i / 2); return g < 3 ? who[g] + 0.3 + (i % 2) * 0.25 : 1e9; };
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={half} y={90} txt="HALF GONE BEFORE THE FAMILY SITS" size={58} font={SANS} weight={900} w={860} />
    <div style={{ position: "absolute", left: 1170, top: 330, width: 560, height: 430, borderRadius: 22, background: "linear-gradient(180deg,#c9ccd0,#8d9297)", boxShadow: "0 20px 30px rgba(0,0,0,.55)", opacity: cl((t - a) * 4) }} />
    {Array.from({ length: 12 }, (_, i) => { const tk = take(i), gone = ei(t, tk, tk + 0.45); const x = 1240 + (i % 4) * 140, y = 400 + Math.floor(i / 4) * 140;
      return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${(gone * 500).toFixed(0)}px, ${(-gone * 260).toFixed(0)}px)`, opacity: 1 - gone }}><Roll x={x} y={y} s={124} gl={0.7} /></div>; })}
    {["PALLBEARERS", "PASTOR'S WIFE", "FUNERAL DIRECTOR"].map((s, i) => <Tag key={i} t={t} a={who[i]} x={1170 + i * 280} y={830} txt={s} w={270} size={30} rot={-4 + i * 4} />)}
  </Stage>;
};

// 03 · SEISCIENTOS FUNERALES: palitos de conteo de a cinco se van dibujando y el número trepa a 600+
export const Tally600: React.FC<M> = ({ t, a, out, m: [sixty, six] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={sixty} y={120} txt="60 YEARS" size={96} font={SANS} weight={900} col={C.goldL} />
  {Array.from({ length: 12 }, (_, g) => { const x = 1080 + (g % 4) * 200, y = 330 + Math.floor(g / 4) * 170, at = sixty + 0.6 + g * 0.22;
    return <React.Fragment key={g}>{[0, 1, 2, 3].map((j) => <Stroke key={j} t={t} a={at + j * 0.04} d={`M ${x + j * 32} ${y} L ${x + j * 32} ${y + 120}`} col={C.cream} sw={10} dur={0.15} len={130} />)}<Stroke t={t} a={at + 0.18} d={`M ${x - 14} ${y + 96} L ${x + 120} ${y + 20}`} col={C.red} sw={10} dur={0.15} len={170} /></React.Fragment>; })}
  <Tx t={t} a={six} y={860} txt={`${cnt(t, six, six + 0.9, 60, 600)}+ FUNERALS`} size={86} font={SANS} weight={900} w={820} />
</Stage>;

// 04 · EL LUGAR EQUIVOCADO (adelanto): la olla de glaseado se inclina, la flecha va a la tapa, se tacha y salta a la grieta entre panes
export const WrongTeaser: React.FC<M> = ({ t, a, out, m: [arl, wrong, dis] }) => {
  const tilt = ei(t, wrong - 0.3, wrong + 0.3);
  return <Stage t={t} a={a} out={out}>
    <Tag t={t} a={arl} x={1450} y={80} txt="ARLENE'S TRICK" w={460} size={56} />
    {[0, 1, 2].map((i) => <Roll key={i} x={1250 + i * 200} y={760} s={196} gl={0.4} op={cl((t - a) * 4)} />)}
    <Ob t={t} n="glazepot" a={a + 0.3} x={1460} y={480} w={300} r={-38 * tilt} origin="30% 80%" z={3} />
    <Stroke t={t} a={wrong} d="M 1450 540 Q 1300 600 1260 670" col={C.goldL} sw={12} dur={0.4} len={300} />
    <XM t={t} at={wrong + 0.6} x={1260} y={680} s={60} />
    <Stroke t={t} a={wrong + 1.1} d="M 1450 540 Q 1380 620 1352 740" col={GOOD} sw={14} dur={0.4} len={300} />
    <Tx t={t} a={dis} y={900} txt="WRONG PLACE · ON PURPOSE" size={62} font={SANS} weight={900} w={860} col={C.goldL} />
  </Stage>;
};

// 05 · EL LIBRO CON PESTAÑAS: tarjetas de receta en abanico; pestañas p. 38 y p. 41 asoman; «50» recetas cuenta
export const CookbookTabs: React.FC<M> = ({ t, a, out, m: [p38, p41, fifty] }) => <Stage t={t} a={a} out={out}>
  {Array.from({ length: 7 }, (_, i) => { const k = cl(sp(t, a + 0.1 + i * 0.08)); return <div key={i} style={{ position: "absolute", left: 1240, top: 300, width: 420, height: 520, borderRadius: 14, background: i % 2 ? "#f6ead2" : "#fbf3e4", boxShadow: "0 10px 20px rgba(0,0,0,.4)", transform: `rotate(${((i - 3) * 6 * k).toFixed(2)}deg)`, transformOrigin: "50% 120%", opacity: k }} />; })}
  <Tag t={t} a={p38} x={1300} y={240} txt="P. 38 · HAM BUNS" w={360} size={40} rot={-8} />
  <Tag t={t} a={p41} x={1640} y={300} txt="P. 41 · HAM BALLS" w={360} size={40} rot={7} col="#7a4a10" />
  <Tx t={t} a={fifty} y={860} txt={`${cnt(t, fifty, fifty + 0.7, 0, 50)} CHURCH SUPPER RECIPES`} size={56} font={SANS} weight={900} w={860} />
</Stage>;

// 06 · 1961, EL CAMIÓN DE LA LECHE: el año cae; el camioncito entra desde la izquierda y frena con rebote; cae el vasito de chocolatada; «16»
export const MilkTruck61: React.FC<M> = ({ t, a, out, m: [sixteen, truck, choc] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={a + 0.1} y={90} txt="FEBRUARY 1961" size={96} font={SANS} weight={900} col={C.goldL} />
  <Tag t={t} a={sixteen} x={1180} y={330} txt="I WAS 16" w={300} size={54} rot={-6} />
  <Ob t={t} n="milktruck" a={truck - 0.2} x={1420} y={860} w={520} from="left" />
  <Ob t={t} n="chocmilk" a={choc} x={1770} y={880} w={130} />
  <Lb t={t} a={choc + 0.3} x={1740} y={900} txt="CHOCOLATE MILK" size={34} w={300} />
</Stage>;

// 07 · EL BOLLO SIMPLE DE 1961: bollo pelado + raya de mostaza; la tapa del roaster lo encierra 1 hora y sale apagado y seco; nadie repite
export const PlainBun61: React.FC<M> = ({ t, a, out, m: [must, dry, roast, nosec] }) => {
  const dull = ei(t, roast + 0.5, roast + 2.5);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="hambun" a={a + 0.1} x={1450} y={820} w={380} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(${(1 - 0.75 * dull).toFixed(2)}) brightness(${(1 - 0.25 * dull).toFixed(2)})`} />
    <Stroke t={t} a={must} d="M 1330 640 C 1400 610 1500 670 1570 630" col="#e8c22a" sw={16} dur={0.5} len={300} />
    <Lb t={t} a={must + 0.2} x={1450} y={300} txt="HAM · BUN · YELLOW MUSTARD" size={44} w={780} />
    <Ob t={t} n="roaster" a={roast - 0.2} x={1450} y={880} w={520} op={1 - ei(t, roast + 2.4, roast + 2.9)} z={4} />
    {t > roast && t < roast + 2.6 && <Tx t={t} a={roast} y={420} txt="1 HOUR" size={100} font={SANS} weight={900} col={C.goldL} />}
    <Tx t={t} a={dry} y={130} txt="A LITTLE DRY" size={76} font={HAND} weight={700} />
    <Stamp t={t} a={nosec} x={1450} y={560} txt="NO SECONDS" />
  </Stage>;
};

// 08 · DOS FUENTES VACÍAS: dos fuentes vacías caen; «NI UN BOLLO» para la familia; entra la tercera fuente y se aparta con su cartel FAMILY
export const TwoPansFamily: React.FC<M> = ({ t, a, out, m: [any, notone, aside] }) => {
  const mv = ei(t, aside, aside + 0.8);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="emptypan" a={a + 0.1} x={1240} y={760} w={360} op={1 - 0.6 * mv} />
    <Ob t={t} n="emptypan" a={a + 0.4} x={1640} y={820} w={360} op={1 - 0.6 * mv} />
    <Lb t={t} a={any} x={1450} y={180} txt="ANYTHING FOR THE FAMILY?" size={50} w={800} />
    <Stamp t={t} a={notone} x={1450} y={420} txt="NOT ONE BUN" rot={-8} />
    <Ob t={t} n="glazedpan" a={aside - 0.4} x={lerp(1450, 1640, mv)} y={lerp(980, 620, mv)} w={380} from="up" z={5} />
    <Tag t={t} a={aside + 0.6} x={1640} y={300} txt="FAMILY" w={260} size={64} rot={5} />
  </Stage>;
};

// 09 · EL JAMÓN AL HORNO: el jamón cae del lado del corte; perilla 275°; «15 min por libra» se multiplica; el termómetro sube a 140
export const HamOven: React.FC<M> = ({ t, a, out, m: [d275, perlb, pull] }) => <Stage t={t} a={a} out={out}>
  <Ob t={t} n="ham" a={a + 0.1} x={1300} y={880} w={460} />
  <Tag t={t} a={d275} x={1300} y={240} txt="275°F · CUT SIDE DOWN" w={480} size={44} />
  <Lb t={t} a={perlb} x={1300} y={360} txt="15 MIN A POUND" size={52} w={560} col={C.goldL} />
  <Dial t={t} a={pull - 1} x={1720} y={380} v={lerp(80, 140, ei(t, pull - 0.8, pull + 0.6))} r={130} hot={140} />
</Stage>;

// 10 · AFEITADO vs GRUESO: la tajada gruesa cae como un zapato; el jamón afeitado se apila y deja ver el diario a través; al «tears» la gruesa se tacha
export const ShavedThick: React.FC<M> = ({ t, a, out, m: [shav, news, shoe, tears] }) => <Stage t={t} a={a} out={out}>
  <Ob t={t} n="newspaper" a={news - 0.3} x={1620} y={880} w={420} op={0.9} />
  <Ob t={t} n="shaved" a={shav} x={1620} y={860} w={330} op={1} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) opacity(${(1 - 0.35 * ei(t, news, news + 0.8)).toFixed(2)})`} z={2} />
  <Lb t={t} a={news + 0.3} x={1640} y={440} txt="THIN ENOUGH TO READ THROUGH" size={34} w={420} col={C.goldL} />
  <Ob t={t} n="thickslice" a={shoe - 0.3} x={1180} y={860} w={300} />
  <Lb t={t} a={shoe} x={1200} y={300} txt="LIKE A SHOE IN A PILLOW" size={34} w={340} />
  <XM t={t} at={tears} x={1180} y={760} s={90} />
  <CK t={t} at={tears + 0.4} x={1620} y={620} s={70} />
</Stage>;

// 11 · LA ONZA: el montón crece; «¾ LB = 12 OZ» se reparte en 12 bollos de 1 oz; ×40 = 2½ lb
export const OunceMath: React.FC<M> = ({ t, a, out, m: [q34, oz1, f25] }) => {
  const g = ei(t, a, q34 + 1);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="shaved" a={a + 0.1} x={1450} y={780} w={180 + 160 * g} />
    <Tx t={t} a={q34} y={110} txt="¾ LB = 12 OZ" size={96} font={SANS} weight={900} col={C.goldL} />
    {Array.from({ length: 12 }, (_, i) => <Roll key={i} x={1130 + (i % 6) * 128} y={880 + Math.floor(i / 6) * 0} s={t > oz1 + i * 0.08 ? 96 : 0} gl={0.3} />)}
    <Lb t={t} a={oz1} x={1450} y={300} txt="1 OUNCE IN EACH BUN" size={48} w={620} />
    <Tag t={t} a={f25} x={1450} y={420} txt="40 BUNS = 2½ LB" w={480} size={56} />
  </Stage>;
};

// 12 · LA PLANCHA PEGADA: la plancha de 12 cae; los panes separados se tachan; el cuchillo cruza de costado y la tapa se levanta entera; «−30 MIN»
export const SlabSheet: React.FC<M> = ({ t, a, out, m: [sheet, dont, side, half] }) => {
  const cut = ei(t, side, side + 1.4), lift = ei(t, side + 1.6, side + 2.4);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="slab12" a={sheet - 0.2} x={1450} y={860} w={520} />
    <Lb t={t} a={dont} x={1450} y={250} txt="DON'T PULL THEM APART" size={52} w={760} />
    {t > dont && t < side && <XM t={t} at={dont + 0.3} x={1450} y={700} s={80} />}
    <Ob t={t} n="knife" a={side - 0.3} x={lerp(1900, 1250, cut)} y={760} w={520} from="right" r={0} z={4} op={1 - lift} />
    <Ob t={t} n="slabtop" a={side + 1.5} x={1450} y={760 - 180 * lift} w={500} from="none" z={3} op={lift > 0 ? 1 : 0} />
    <Tag t={t} a={half} x={1450} y={110} txt="SAVES 30 MINUTES" w={460} size={52} col="#2f6a35" />
  </Stage>;
};

// 13 · LA MANO PLANA: tabla + cuchillo serrucho; la mano «como sosteniendo un libro»; el cuchillo entra lento; al «scar» un círculo marca la cicatriz de 1966
export const FlatHand: React.FC<M> = ({ t, a, out, m: [ser, flat, slide, scar] }) => {
  const go = ei(t, slide, slide + 6);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="slab12" a={a + 0.1} x={1400} y={900} w={460} />
    <Ob t={t} n="knife" a={ser} x={lerp(1880, 1500, go)} y={800} w={480} from="right" z={3} />
    <Ob t={t} n="scarthumb" a={flat} x={1380} y={690} w={300} r={90} origin="50% 50%" z={4} />
    <Lb t={t} a={flat + 0.3} x={1400} y={150} txt="FLAT HAND · FINGERS UP" size={52} w={760} />
    <Stroke t={t} a={scar} d="M 1420 520 m -90 0 a 90 70 0 1 0 180 0 a 90 70 0 1 0 -180 0" col={C.red} sw={10} dur={0.6} len={560} />
    <Tag t={t} a={scar + 0.4} x={1680} y={390} txt="1966" w={200} size={60} />
  </Stage>;
};

// 14 · EL ACORDEÓN: una cinta rosa se pliega en zigzag con bolsitas de aire; al «blanket» la plana se aplasta gris; borde a borde
export const AccordionFold: React.FC<M> = ({ t, a, out, m: [acc, pock, blank, edge] }) => {
  const f = ei(t, acc - 0.4, acc + 1.6), N = 9;
  const pts = Array.from({ length: N + 1 }, (_, i) => `${1100 + i * 80},${640 + (i % 2 ? -1 : 1) * 110 * f}`).join(" ");
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={acc} y={110} txt="FOLD IT · LIKE AN ACCORDION" size={64} font={SANS} weight={900} w={860} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cl((t - a) * 4) }}><polyline points={pts} fill="none" stroke={HAMP} strokeWidth={46} strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,.45))" }} /><polyline points={pts} fill="none" stroke="#f7c9c4" strokeWidth={12} strokeLinejoin="round" opacity={0.7} /></svg>
    {Array.from({ length: N }, (_, i) => { const k = cl(sp(t, pock + i * 0.1)); return <div key={i} style={{ position: "absolute", left: 1130 + i * 80, top: 630 + (i % 2 ? 50 : -70), width: 30 * k, height: 30 * k, borderRadius: "50%", border: "4px solid rgba(255,255,255,.85)" }} />; })}
    <Lb t={t} a={pock} x={1450} y={330} txt="POCKETS OF AIR" size={52} w={600} col={C.goldL} />
    {t > blank && <div style={{ position: "absolute", left: 1100, top: 900, width: 700, height: 26, borderRadius: 13, background: "#b88a86", opacity: cl((t - blank) * 3) * (1 - ei(t, edge, edge + 0.5)) }} />}
    <Lb t={t} a={blank} x={1450} y={940} txt="FLAT = A WET BLANKET" size={40} w={600} op={1 - ei(t, edge, edge + 0.5)} />
    <Lb t={t} a={edge} x={1450} y={940} txt="EDGE TO EDGE" size={50} w={600} col={GOOD} />
  </Stage>;
};

// 15 · LA CAPA DE QUESO: seis fetas finas cubren la plancha de a una; la feta gruesa cae y se tacha (RUBBERY); vuelve la tapa
export const CheeseTiles: React.FC<M> = ({ t, a, out, m: [six, thin, rub, top] }) => <Stage t={t} a={a} out={out}>
  <div style={{ position: "absolute", left: 1150, top: 560, width: 600, height: 330, borderRadius: 26, background: `linear-gradient(180deg, ${HAMP}, #c97f7b)`, boxShadow: "0 18px 28px rgba(0,0,0,.5)", opacity: cl((t - a) * 4) }} />
  {Array.from({ length: 6 }, (_, i) => { const k = cl(sp(t, six + i * 0.3)); return <div key={i} style={{ position: "absolute", left: 1160 + (i % 3) * 196, top: 570 + Math.floor(i / 3) * 160 - (1 - k) * 300, width: 200, height: 160, background: "radial-gradient(circle at 30% 40%, rgba(0,0,0,.18) 0 9px, transparent 10px), radial-gradient(circle at 70% 65%, rgba(0,0,0,.16) 0 7px, transparent 8px), #f5dc8f", borderRadius: 6, opacity: k, boxShadow: "0 4px 6px rgba(0,0,0,.3)" }} />; })}
  <Lb t={t} a={six} x={1450} y={430} txt="6 THIN SLICES A PAN" size={52} w={700} />
  <Ob t={t} n="swissthick" a={rub - 0.3} x={1740} y={420} w={200} from="right" z={5} />
  <XM t={t} at={rub + 0.3} x={1740} y={330} s={70} />
  <Lb t={t} a={rub + 0.3} x={1740} y={120} txt="RUBBERY" size={44} w={300} col={C.red} />
  <Ob t={t} n="slabtop" a={top} x={1450} y={880} w={560} z={6} />
</Stage>;

// 16 · ARLENE, 1978: el año; Cedar Rapids → nuestro pueblo con una línea de puntos; a las 7 de la mañana llega su tarjeta, la lata de amapola y la manteca
export const Arlene78: React.FC<M> = ({ t, a, out, m: [cedar, tract, card7, poppy] }) => <Stage t={t} a={a} out={out}>
  <Tx t={t} a={a + 0.1} y={80} txt="ARLENE · 1978" size={96} font={SANS} weight={900} col={C.goldL} />
  <Tag t={t} a={cedar} x={1150} y={250} txt="CEDAR RAPIDS" w={320} size={40} rot={-5} />
  <Stroke t={t} a={cedar + 0.5} d="M 1180 320 Q 1450 180 1700 330" col={C.cream} sw={8} dur={1} len={700} />
  <Tag t={t} a={cedar + 1.4} x={1720} y={330} txt="OUR TOWN" w={280} size={40} rot={5} />
  <Lb t={t} a={tract} x={1450} y={440} txt="THE WHOLE COUNTY CAME" size={46} w={720} op={1 - ei(t, card7 - 0.5, card7)} />
  <Face t={t} a={card7 - 0.3} b={card7 + 2} x={1180} y={760} r={110} h0={6.8} h1={7} />
  <Ob t={t} n="poppytin" a={poppy} x={1480} y={920} w={200} />
  <Ob t={t} n="butterstick" a={poppy + 0.4} x={1720} y={920} w={240} />
</Stage>;

// 17 · ENTRE LAS GRIETAS (wow): vista cenital de 12 panes; el glaseado dorado corre POR LAS LÍNEAS en las dos direcciones, no arriba; después las tapas brillan
export const PourBetween: React.FC<M> = ({ t, a, out, m: [inst, spoon, ruin, shiny, gone] }) => {
  const X0 = 1150, Y0 = 330, S = 150, g = (k: number) => ei(t, spoon + k * 0.5, spoon + k * 0.5 + 1.2), sh = ei(t, shiny - 0.3, shiny + 0.8), vanish = ei(t, gone, gone + 1.2);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: X0 - 26, top: Y0 - 26, width: 4 * S + 52, height: 3 * S + 52, borderRadius: 22, background: "linear-gradient(180deg,#c9ccd0,#8d9297)", boxShadow: "0 20px 30px rgba(0,0,0,.55)" }} />
    {Array.from({ length: 12 }, (_, i) => <Roll key={i} x={X0 + S / 2 + (i % 4) * S} y={Y0 + S / 2 + Math.floor(i / 4) * S} s={S - 8} gl={sh} op={1 - vanish * cl(((i * 7) % 12) / 12 * 3 - 0.6 + vanish * 2)} />)}
    {[1, 2, 3].map((c, k) => <div key={"v" + c} style={{ position: "absolute", left: X0 + c * S - 7, top: Y0, width: 14, height: 3 * S * g(k), background: `linear-gradient(180deg, ${GLZ}, #f6d27a)`, boxShadow: "0 0 18px rgba(255,200,80,.8)", borderRadius: 7 }} />)}
    {[1, 2].map((r, k) => <div key={"h" + r} style={{ position: "absolute", left: X0, top: Y0 + r * S - 7, width: 4 * S * g(k + 1.5), height: 14, background: `linear-gradient(90deg, ${GLZ}, #f6d27a)`, boxShadow: "0 0 18px rgba(255,200,80,.8)", borderRadius: 7 }} />)}
    <Ob t={t} n="glazepot" a={spoon - 0.5} x={1820} y={330} w={200} from="right" r={-20} z={6} op={1 - ei(t, spoon + 3, spoon + 3.5)} />
    <Lb t={t} a={inst} x={1450} y={130} txt="NOT ON TOP…" size={50} w={600} op={1 - ei(t, spoon, spoon + 0.4)} />
    <Lb t={t} a={spoon} x={1450} y={130} txt="DOWN INTO THE CRACKS" size={56} w={760} col={C.goldL} />
    <Tx t={t} a={ruin} y={860} txt="SOGGY?" size={80} font={HAND} weight={700} op={1 - sh} />
    <Tx t={t} a={shiny} y={860} txt="SHINY & GOLDEN" size={70} font={SANS} weight={900} col={C.goldL} op={1 - vanish} />
    <Stamp t={t} a={gone} x={1450} y={540} txt="GONE" size={90} />
  </Stage>;
};

// 18 · LA TARJETA DE ARLENE: tarjeta amarillenta con mancha de manteca; la frase se escribe a mano y se subraya DOS veces
export const ArleneCard: React.FC<M> = ({ t, a, out, m: [stain, betw, twice] }) => {
  const k = cl(sp(t, a)), wr = ei(t, betw, betw + 1.6), msg = "pour it between, not on top";
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1110, top: 330, width: 700, height: 440, background: "linear-gradient(180deg,#fbf1d6,#ecd9a8)", borderRadius: 10, boxShadow: "0 20px 30px rgba(0,0,0,.55)", transform: `rotate(${(-3 + (1 - k) * 25).toFixed(2)}deg) scale(${(0.4 + 0.6 * k).toFixed(3)})`, opacity: cl(k * 3) }}>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 120 + i * 62, height: 2, background: "rgba(80,120,180,.35)" }} />)}
      <div style={{ position: "absolute", left: 30, right: 30, top: 70, height: 3, background: "rgba(200,60,60,.5)" }} />
      <div style={{ position: "absolute", right: 30, top: 18, width: 150, height: 120, borderRadius: "48% 52% 40% 60%", background: "radial-gradient(closest-side, rgba(200,150,60,.42), rgba(200,150,60,.15) 70%, transparent)", opacity: ei(t, stain - 0.2, stain + 0.4) }} />
      <div style={{ position: "absolute", left: 30, top: 10, fontFamily: HAND, fontSize: 52, color: "#2a3f7a" }}>Ham Buns ~ A.P.</div>
      <div style={{ position: "absolute", left: 40, top: 170, width: 640, fontFamily: HAND, fontSize: 64, color: "#2a3f7a", lineHeight: 1.15 }}>{msg.slice(0, Math.round(msg.length * wr))}</div>
    </div>
    <Stroke t={t} a={twice} d="M 1160 600 C 1350 590 1560 606 1760 596" col="#2a3f7a" sw={7} dur={0.4} len={700} />
    <Stroke t={t} a={twice + 0.5} d="M 1170 622 C 1360 614 1570 628 1750 618" col="#2a3f7a" sw={7} dur={0.4} len={700} />
    <Tx t={t} a={twice + 0.6} y={830} txt="UNDERLINED TWICE" size={60} font={SANS} weight={900} col={C.goldL} />
  </Stage>;
};

// 19 · EL GLASEADO EXACTO: cinco ingredientes caen en fila con su medida; al «yellow works» el dijon gira y lo reemplaza la mostaza amarilla
export const GlazeFive: React.FC<M> = ({ t, a, out, m: [g1, g2, yel, g3, g4, g5] }) => {
  const sw = ei(t, yel, yel + 0.6), I: [string, string, number, number][] = [["butterstick", "½ CUP BUTTER", g1, 210], ["dijon", "1½ TBSP DIJON", g2, 140], ["onionjar", "1 TBSP ONION", g3, 130], ["poppytin", "1 TBSP POPPY", g4, 160], ["worcester", "1 TSP WORCESTER", g5, 110]];
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="ARLENE'S GLAZE" size={90} font={SANS} weight={900} col={C.goldL} />
    {I.map(([n, l, at, w], i) => { const x = 1100 + i * 175, y = i % 2 ? 640 : 860;
      return <React.Fragment key={i}>
        <Ob t={t} n={i === 1 && sw > 0.5 ? "mustard" : n} a={at - 0.2} x={x} y={y} w={w} tf={i === 1 ? `rotateY(${(sw * 180).toFixed(0)}deg)` : ""} />
        <Lb t={t} a={at} x={x} y={y + 14} txt={i === 1 && sw > 0.5 ? "OR YELLOW" : l} size={28} w={200} col={i === 1 && sw > 0.5 ? GOOD : C.cream} />
      </React.Fragment>; })}
  </Stage>;
};

// 20 · LAS ESPONJITAS: en la ollita, las escamas de cebolla se hinchan durante 1 minuto (anillo que se cierra); las que quedan arriba se queman y se tachan
export const OnionSponge: React.FC<M> = ({ t, a, out, m: [melt, onemin, spong, swell, gold] }) => {
  const sw = ei(t, spong, swell + 4), ring1 = ei(t, onemin, onemin + 14), gd = ei(t, gold - 0.3, gold + 1);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1150, top: 380, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#4d4f52 60%,#2e3033)", boxShadow: "0 20px 30px rgba(0,0,0,.6)", opacity: cl((t - a) * 4) }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #fff2c0, ${lerp(0, 1, gd) > 0.5 ? "#e0a93a" : "#f2d27a"})` }} />
      {Array.from({ length: 22 }, (_, i) => { const an = i * 2.4, r = 40 + ((i * 53) % 180), s = 10 + 16 * sw; return <div key={i} style={{ position: "absolute", left: 260 + Math.cos(an) * r - s / 2, top: 260 + Math.sin(an) * r - s / 2, width: s, height: s * 0.7, borderRadius: "40%", background: "#f6e7c2", boxShadow: "0 1px 2px rgba(0,0,0,.4)", transform: `rotate(${i * 37}deg)` }} />; })}
    </div>
    <Lb t={t} a={melt} x={1410} y={140} txt="MELT THE BUTTER · ONION IN" size={46} w={760} />
    <svg width={260} height={260} style={{ position: "absolute", left: 1640, top: 200, opacity: cl((t - onemin) * 4) }}><circle cx={130} cy={130} r={100} fill="rgba(0,0,0,.45)" stroke="rgba(255,240,210,.3)" strokeWidth={14} /><circle cx={130} cy={130} r={100} fill="none" stroke={C.goldL} strokeWidth={14} strokeDasharray={628} strokeDashoffset={628 * (1 - ring1)} transform="rotate(-90 130 130)" strokeLinecap="round" /><text x={130} y={148} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={52} fill={C.cream}>1:00</text></svg>
    <Lb t={t} a={spong} x={1770} y={480} txt="LITTLE SPONGES" size={36} w={300} col={C.goldL} />
    <Tx t={t} a={gold} y={880} txt="SMELLS LIKE A COUNTY FAIR" size={56} font={HAND} weight={700} w={860} />
  </Stage>;
};

// 21 · PINCEL vs CUCHARA (corte): bollo cortado al medio; con pincel el dorado queda en la tapa y el centro dice PAN SECO; con cuchara baja por las líneas hasta el pan de abajo
export const BrushSpoon: React.FC<M> = ({ t, a, out, m: [brush, dry, spoon, down, bot] }) => {
  const sideA = (x: number, deep: number, lab: string, at: number, col: string) => <>
    <div style={{ position: "absolute", left: x - 170, top: 430, width: 340, height: 150, borderRadius: "160px 160px 18px 18px", background: `linear-gradient(180deg, ${BUNC}, #f0d4a0 40%)` }} />
    <div style={{ position: "absolute", left: x - 170, top: 580, width: 340, height: 70, background: `repeating-linear-gradient(90deg, ${HAMP} 0 30px, #f3b9b4 30px 60px)` }} />
    <div style={{ position: "absolute", left: x - 170, top: 650, width: 340, height: 100, borderRadius: "18px 18px 40px 40px", background: "linear-gradient(180deg,#f0d4a0,#c8873d)" }} />
    <div style={{ position: "absolute", left: x - 172, top: 426, width: 344, height: 22 + deep * 300, borderRadius: "160px 160px 18px 18px", background: `linear-gradient(180deg, ${GLZ}, rgba(231,180,74,${(0.15 + 0.5 * deep).toFixed(2)}))`, mixBlendMode: "multiply" }} />
    <Lb t={t} a={at} x={x} y={790} txt={lab} size={36} w={340} col={col} /></>;
  return <Stage t={t} a={a} out={out}>
    <div style={{ opacity: cl((t - brush) * 4) }}>{sideA(1220, 0.04 * ei(t, brush, brush + 1), "DRY BREAD INSIDE", dry, C.red)}</div>
    <Ob t={t} n="knife" a={brush - 0.2} x={1220} y={420} w={1} op={0} />
    <Lb t={t} a={brush} x={1220} y={330} txt="BRUSH" size={52} w={300} />
    <div style={{ opacity: cl((t - spoon) * 4) }}>{sideA(1680, ei(t, down - 0.5, bot + 0.5), "TO THE BOTTOM BUN", bot, GOOD)}</div>
    <Lb t={t} a={spoon} x={1680} y={330} txt="SPOON" size={52} w={300} col={C.goldL} />
    {t > down && [0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 1594 + i * 172, top: 430, width: 12, height: 320 * ei(t, down + i * 0.3, bot), background: GLZ, boxShadow: "0 0 12px rgba(255,200,80,.9)", borderRadius: 6 }} />)}
    <XM t={t} at={dry + 0.4} x={1220} y={250} s={50} />
  </Stage>;
};

// 22 · DIEZ MINUTOS: la fuente sobre una balanza de dos platos; el reloj de 10 minutos corre; el pan «bebe» (el dorado sube) y la balanza se inclina: MÁS PESADA
export const TenRest: React.FC<M> = ({ t, a, out, m: [ten, drink, heavy] }) => {
  const d = ei(t, drink - 1, heavy + 1), tilt = 9 * ei(t, heavy - 0.5, heavy + 0.8);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={ten} y={100} txt={`${String(10 - Math.floor(cl((t - ten) / 25) * 10)).padStart(2, "0")}:00 ON THE COUNTER`} size={70} font={SANS} weight={900} w={860} />
    <div style={{ position: "absolute", left: 1440, top: 520, width: 20, height: 400, background: "linear-gradient(90deg,#8d6a3a,#c99a5a,#8d6a3a)", opacity: cl((t - a) * 4) }} />
    <div style={{ position: "absolute", left: 1100, top: 510, width: 700, height: 14, background: "#a77b42", transform: `rotate(${tilt.toFixed(2)}deg)`, transformOrigin: "50% 50%", opacity: cl((t - a) * 4) }}>
      <div style={{ position: "absolute", left: -10, top: -150, width: 280, height: 150 }}><Img src={O("foilpan")} style={{ width: "100%", filter: `drop-shadow(0 10px 12px rgba(0,0,0,.5)) sepia(${(0.5 * d).toFixed(2)}) saturate(${(1 + d).toFixed(2)})` }} /></div>
      <div style={{ position: "absolute", right: 40, top: -100, width: 180, height: 100 }}><Img src={O("slabtop")} style={{ width: "100%", filter: "drop-shadow(0 10px 12px rgba(0,0,0,.5))" }} /></div>
    </div>
    <Lb t={t} a={drink} x={1450} y={250} txt="THE BREAD DRINKS IT UP" size={48} w={760} col={C.goldL} />
    <Stamp t={t} a={heavy} x={1250} y={800} txt="HEAVIER" rot={-6} col={GOOD} size={58} />
  </Stage>;
};

// 23 · LA NOCHE ANTES: tira de dos días — LUNES de noche (luna, urnas tibias, velorio) → MARTES a la mañana (sol); la fuente cruza por la heladera
export const NightBefore: React.FC<M> = ({ t, a, out, m: [vis, night, mon, tue] }) => {
  const dn = ei(t, tue - 0.5, tue + 1.2), mv = ei(t, night, tue);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1060, top: 220, width: 800, height: 420, borderRadius: 26, overflow: "hidden", background: `linear-gradient(90deg, #1d2547 ${(50 - 50 * dn).toFixed(0)}%, #f3c26b ${(100 - 50 * dn).toFixed(0)}%)`, boxShadow: "0 18px 28px rgba(0,0,0,.5)", opacity: cl((t - a) * 4) }}>
      <div style={{ position: "absolute", left: 80, top: 50, width: 100, height: 100, borderRadius: "50%", boxShadow: "-24px 10px 0 0 #f3ecd2", opacity: 1 - dn }} />
      <div style={{ position: "absolute", right: 90, top: 50 + 60 * (1 - dn), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#fff3c4,#f6b23a)", opacity: dn }} />
    </div>
    <Lb t={t} a={vis} x={1260} y={660} txt="MONDAY · VISITATION" size={36} w={380} />
    <Lb t={t} a={tue} x={1660} y={660} txt="TUESDAY · FUNERAL" size={36} w={380} col={C.goldL} />
    <Ob t={t} n="urn" a={mon} x={1180} y={620} w={130} op={1 - dn} />
    <Ob t={t} n="foilpan" a={night - 0.3} x={lerp(1300, 1640, mv)} y={600} w={260} z={4} />
    <Tx t={t} a={night} y={760} txt="THE BREAD DRINKS ALL NIGHT" size={58} font={HAND} weight={700} w={860} />
  </Stage>;
};

// 24 · EL CUARTITO DE VAPOR: fuente bajo papel aluminio; 350°; el borde se pliega con un trazo; el vapor queda atrapado debajo como una cúpula; sin tapa las semillas se queman
export const FoilSteam: React.FC<M> = ({ t, a, out, m: [d350, crimp, tw20, room, scor] }) => {
  const dome = ei(t, room - 0.3, room + 1), unc = ei(t, scor - 0.8, scor);
  return <Stage t={t} a={a} out={out}>
    <Tag t={t} a={d350} x={1180} y={140} txt="350°F" w={240} size={72} />
    <Tag t={t} a={tw20} x={1720} y={140} txt="20 MIN COVERED" w={330} size={42} col="#7a4a10" />
    <Ob t={t} n="foilpan" a={a + 0.1} x={1450} y={820} w={560} tf={`scaleY(${(1 + 0.12 * dome).toFixed(3)})`} op={1 - unc} />
    <Ob t={t} n="glazedpan" a={scor - 0.8} x={1450} y={820} w={560} from="none" op={unc} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) brightness(${(1 - 0.5 * ei(t, scor, scor + 1)).toFixed(2)}) contrast(1.3)`} />
    <Stroke t={t} a={crimp} d="M 1180 640 L 1720 640 L 1720 860 L 1180 860 Z" col={C.goldL} sw={9} dur={1.2} len={1600} />
    {t > room && t < scor - 0.6 && <Vapor t={t} a={room} b={scor - 0.8} x={1450} y={700} big={0.7} />}
    <Lb t={t} a={room} x={1450} y={330} txt="A WARM LITTLE STEAM ROOM" size={48} w={780} op={1 - unc} />
    <Lb t={t} a={scor} x={1450} y={330} txt="UNCOVERED: SEEDS SCORCH" size={48} w={780} col={C.red} />
  </Stage>;
};

// 25 · EL LADO DE ALLÁ PRIMERO: el aluminio se pela desde el fondo y el vapor sale hacia afuera, lejos de la muñeca; +5 MIN destapado, las semillas tostándose
export const FarSide: React.FC<M> = ({ t, a, out, m: [far, burn, five, toast] }) => {
  const peel = ei(t, far, far + 1.4);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="glazedpan" a={a + 0.1} x={1450} y={860} w={560} />
    <div style={{ position: "absolute", left: 1170, top: 600, width: 560, height: 240, transform: `perspective(900px) rotateX(${(-70 * peel).toFixed(1)}deg)`, transformOrigin: "50% 100%", background: "linear-gradient(135deg,#f4f4f4,#a9adb2 40%,#e7e9ea 60%,#9a9ea3)", borderRadius: 10, opacity: 1 - ei(t, far + 1.3, far + 1.8), boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
    {t > far + 0.3 && <Vapor t={t} a={far + 0.3} b={far + 2.6} x={1450} y={560} big={0.9} />}
    <Lb t={t} a={far} x={1450} y={150} txt="OPEN THE FAR SIDE FIRST" size={54} w={800} />
    <Lb t={t} a={burn} x={1450} y={240} txt="STEAM BURNS · AWAY FROM YOU" size={40} w={720} col={C.red} />
    <Tag t={t} a={five} x={1700} y={360} txt="+5 MIN" w={220} size={60} col="#2f6a35" />
    <Lb t={t} a={toast} x={1450} y={940} txt="DON'T WALK AWAY" size={46} w={600} col={C.goldL} />
  </Stage>;
};

// 26 · EL CENTRO MÁS FRÍO: mapa de calor de 12 panes (bordes rojos, centro azul); el termómetro entra en el bollo del medio: 120 ✗ → 140 ✓
export const CenterCold: React.FC<M> = ({ t, a, out, m: [cold, push, w140, i120] }) => {
  const heat = ei(t, cold - 0.5, cold + 1.2), up = ei(t, i120 + 1.5, i120 + 4);
  return <Stage t={t} a={a} out={out}>
    {Array.from({ length: 12 }, (_, i) => { const c = i % 4, r = Math.floor(i / 4), mid = (c === 1 || c === 2) && r === 1, edge = c === 0 || c === 3 || r !== 1;
      const col = mid ? `rgb(${Math.round(lerp(217, 70 + 140 * up, heat))},${Math.round(lerp(154, 110 - 40 * up, heat))},${Math.round(lerp(78, 200 - 150 * up, heat))})` : edge ? `rgb(${Math.round(lerp(217, 220, heat))},${Math.round(lerp(154, 70, heat))},${Math.round(lerp(78, 40, heat))})` : BUNC;
      return <Roll key={i} x={1180 + c * 160} y={420 + r * 160} s={150} col={col} />; })}
    <Lb t={t} a={cold} x={1420} y={170} txt="THE MIDDLE IS ALWAYS COLDEST" size={48} w={860} />
    <Ob t={t} n="knife" a={push} x={1500} y={480} w={1} op={0} />
    <div style={{ position: "absolute", left: 1336, top: 200 + 170 * ei(t, push, push + 0.6), width: 12, height: 300, background: "linear-gradient(90deg,#8d9297,#eef0f1,#8d9297)", borderRadius: 6, opacity: cl((t - push) * 4) }} />
    <Dial t={t} a={push} x={1760} y={300} v={t < i120 ? lerp(70, 140, ei(t, push, w140 + 1)) : lerp(120, 140, up)} r={110} hot={140} />
    {t > i120 && t < i120 + 1.5 && <XM t={t} at={i120 + 0.2} x={1760} y={300} s={70} />}
    <Lb t={t} a={i120 + 4} x={1450} y={920} txt="140° OR HOTTER" size={58} w={600} col={GOOD} />
  </Stage>;
};

// 27 · CUÁNTA GENTE: el diario del obituario + autos en la puerta; 200 muñequitos para el granjero, 60 para la señora del hogar; «1 por persona»
export const HeadCount: React.FC<M> = ({ t, a, out, m: [obit, cars, m60, per] }) => {
  const shrink = ei(t, m60 - 0.3, m60 + 0.5);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="newspaper" a={obit} x={1220} y={420} w={300} r={-6} />
    <Lb t={t} a={obit + 0.3} x={1220} y={440} txt="THE OBITUARY" size={34} w={300} />
    <Lb t={t} a={cars} x={1650} y={300} txt={`${cnt(t, cars, cars + 3, 0, 60)} CARS AT THE VISITATION`} size={34} w={440} />
    <div style={{ opacity: 1 - shrink }}><People t={t} a={cars + 2} x={1080} y={540} n={50} s={30} per={20} /><Tx t={t} a={cars + 2.6} y={760} txt="FARMER · 200" size={60} font={SANS} weight={900} /></div>
    <div style={{ opacity: shrink }}><People t={t} a={m60} x={1250} y={540} n={15} s={40} per={8} col={C.goldL} /><Tx t={t} a={m60 + 0.4} y={760} txt="NURSING HOME · 60" size={60} font={SANS} weight={900} col={C.goldL} /></div>
    <Tag t={t} a={per} x={1450} y={900} txt="1 BUN PER PERSON" w={460} size={52} />
  </Stage>;
};

// 28 · LA CUENTA DE LAS FUENTES: 40 ÷ 12 = 3⅓ — tres fuentes se llenan, la cuarta queda a un tercio y se completa; las 8 de más brillan doradas: CAJA DE LA FAMILIA
export const PanMath: React.FC<M> = ({ t, a, out, m: [twelve, third, four, f48, ex8] }) => {
  const done = (p: number) => (p < 3 ? 12 : t < four ? 4 : 12);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={twelve} y={90} txt={t < four ? "40 ÷ 12 = 3 1/3 PANS" : t < f48 ? "→ 4 PANS" : "4 × 12 = 48"} size={84} font={SANS} weight={900} col={C.goldL} w={880} />
    {[0, 1, 2, 3].map((p) => <React.Fragment key={p}>
      <div style={{ position: "absolute", left: 1090 + (p % 2) * 400, top: 300 + Math.floor(p / 2) * 320, width: 360, height: 280, borderRadius: 18, background: "linear-gradient(180deg,#c9ccd0,#8d9297)", boxShadow: "0 14px 22px rgba(0,0,0,.5)", opacity: cl((t - twelve - p * 0.3) * 4) }} />
      {Array.from({ length: 12 }, (_, i) => { const show = i < done(p) && t > twelve + p * 0.6 + i * 0.05; const ex = p === 3 && i >= 4;
        return show ? <Roll key={i} x={1140 + (p % 2) * 400 + (i % 4) * 87} y={350 + Math.floor(p / 2) * 320 + Math.floor(i / 4) * 90} s={80} gl={ex && t > ex8 ? 1 : 0.3} col={ex && t > ex8 ? "#f2c24a" : BUNC} /> : null; })}
    </React.Fragment>)}
    <Lb t={t} a={third} x={1690} y={940} txt="A THIRD OF A PAN" size={40} w={360} op={1 - ei(t, four, four + 0.4)} />
    <Tag t={t} a={ex8} x={1690} y={950} txt="+8 · THE FAMILY BOX" w={420} size={40} col="#7a4a10" />
  </Stage>;
};

// 29 · LA LISTA POR CUATRO: bolsa del súper cae; cada renglón de la receta multiplica ×4 en una pila de etiquetas
export const TimesFour: React.FC<M> = ({ t, a, out, m: [pk, oz, sl, st, mu, on, ws] }) => {
  const R: [number, string][] = [[pk, "4 PACKAGES OF 12 ROLLS"], [oz, "48 OZ HAM = 3 LB"], [sl, "24 SLICES SWISS (1½ LB)"], [st, "4 STICKS BUTTER"], [mu, "6 TBSP MUSTARD"], [on, "4 TBSP ONION · 4 TBSP POPPY"], [ws, "4 TSP WORCESTERSHIRE"]];
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="grocerybag" a={a + 0.1} x={1160} y={940} w={300} />
    <Tx t={t} a={a + 0.3} x={1160} y={250} txt="× 4" size={160} font={SANS} weight={900} col={C.goldL} w={300} />
    {R.map(([at, s], i) => <Lb key={i} t={t} a={at} x={1600} y={230 + i * 92} txt={s} size={34} w={560} col={i === R.length - 1 || t < (R[i + 1]?.[0] ?? 1e9) ? C.goldL : C.cream} />)}
  </Stage>;
};

// 30 · EL TICKET DE $57: un ticket de papel se imprime renglón a renglón con la voz; TOTAL $57 ÷ 48 = $1,19; al «1978» la lata del fondo para funerales
export const Receipt57: React.FC<M> = ({ t, a, out, m: [r1, r2, r3, r4, r5, tot, per, y78, fund] }) => {
  const L: [number, string, string][] = [[r1, "ROLLS 4 × 3.50", "14.00"], [r2, "DELI HAM 3 LB", "21.00"], [r3, "SWISS 1½ LB", "9.00"], [r4, "BUTTER 1 LB", "4.50"], [r5, "MUSTARD · ONION · SEEDS", "8.00"]];
  const grow = ei(t, a, tot + 0.5), sl = ei(t, y78 - 0.3, y78 + 0.6);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1170, top: 140, width: 470, height: 140 + 640 * grow, background: "linear-gradient(180deg,#fdfbf5,#efe9dc)", boxShadow: "0 16px 24px rgba(0,0,0,.5)", fontFamily: "monospace", color: "#2a2a2a", overflow: "hidden", transform: `translateX(${(-140 * sl).toFixed(0)}px)` }}>
      <div style={{ textAlign: "center", fontSize: 30, fontWeight: 700, marginTop: 24 }}>GROCERY · LAST WEEK</div>
      {L.map(([at, s, v], i) => t > at ? <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 28px 0", fontSize: 28 }}><span>{s}</span><span>{v}</span></div> : null)}
      {t > tot && <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 28px 0", fontSize: 40, fontWeight: 900, borderTop: "3px dashed #777", marginTop: 18 }}><span>TOTAL</span><span>≈ $57</span></div>}
    </div>
    <Tag t={t} a={per} x={1420 - 140 * sl} y={880} txt="$1.19 A BUN" w={360} size={60} />
    <Ob t={t} n="coffeecan" a={y78} x={1720} y={820} w={250} from="right" />
    <Lb t={t} a={fund} x={1720} y={840} txt="THE FUNERAL FUND" size={34} w={320} col={C.goldL} />
  </Stage>;
};

// 31 · DOS ESTANTES: horno de frente con dos rejillas, dos fuentes en cada una; a la mitad, flechas curvas las cambian de lugar; el de abajo dora más rápido
export const RackSwap: React.FC<M> = ({ t, a, out, m: [side, sw, brn] }) => {
  const k = ei(t, sw, sw + 1.2), yA = lerp(430, 700, k), yB = lerp(700, 430, k);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1110, top: 300, width: 700, height: 560, borderRadius: 24, background: "radial-gradient(ellipse at 50% 60%, #ffb35a, #a2441c 70%, #3a1a0c)", border: "18px solid #2f3134", boxShadow: "0 20px 30px rgba(0,0,0,.6)", opacity: cl((t - a) * 4) }} />
    {[480, 750].map((y, i) => <div key={i} style={{ position: "absolute", left: 1140, top: y, width: 640, height: 8, background: "#c9ccd0", opacity: cl((t - a) * 4) }} />)}
    {[0, 1].map((i) => <React.Fragment key={i}>
      <Ob t={t} n="glazedpan" a={side + i * 0.2} x={1290 + i * 330} y={yA + 50} w={270} from="none" z={3} />
      <Ob t={t} n="foilpan" a={side + 0.4 + i * 0.2} x={1290 + i * 330} y={yB + 50} w={270} from="none" z={3} fl={`drop-shadow(0 8px 10px rgba(0,0,0,.4)) brightness(${(1 - 0.2 * ei(t, brn, brn + 1)).toFixed(2)})`} />
    </React.Fragment>)}
    <Lb t={t} a={side} x={1460} y={170} txt="2 PANS SIDE BY SIDE · 2 RACKS" size={44} w={820} />
    <Stroke t={t} a={sw} d="M 1830 470 C 1900 560 1900 640 1830 730" col={C.goldL} sw={10} dur={0.5} len={320} />
    <Stroke t={t} a={sw + 0.2} d="M 1090 730 C 1020 640 1020 560 1090 470" col={C.goldL} sw={10} dur={0.5} len={320} />
    <Lb t={t} a={brn} x={1460} y={900} txt="THE BOTTOM BROWNS FASTER" size={44} w={760} col={C.goldL} />
  </Stage>;
};

// 32 · LA FILA DEL BUFFET: seis estaciones sobre una mesa larga que se van encendiendo en orden; los bollos AL FINAL, a propósito; si van primero, el bollo arriba de todo
export const BuffetLine: React.FC<M> = ({ t, a, out, m: [l1, l2, l3, l4, l5, l6, end, top] }) => {
  const S = [[l1, "PLATES"], [l2, "HOT DISHES"], [l3, "SALADS"], [l4, "HAM BUNS"], [l5, "DESSERT"], [l6, "COFFEE"]] as [number, string][];
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1040, top: 620, width: 840, height: 40, borderRadius: 8, background: "linear-gradient(180deg,#f3ead8,#cdbf9f)", boxShadow: "0 14px 22px rgba(0,0,0,.5)", opacity: cl((t - a) * 4) }} />
    {S.map(([at, s], i) => { const on = t > at, hb = i === 3; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 1060 + i * 136, top: 520, width: 120, height: 100, borderRadius: 14, background: on ? (hb ? C.goldL : "rgba(255,240,210,.85)") : "rgba(255,240,210,.15)", boxShadow: on ? "0 0 24px rgba(255,210,120,.6)" : "none", transform: `scale(${(on ? 1 + 0.12 * Math.exp(-6 * (t - at)) : 0.9).toFixed(3)})` }} />
      <Lb t={t} a={at} x={1120 + i * 136} y={680} txt={s} size={24} w={140} col={hb ? C.goldL : C.cream} /></React.Fragment>; })}
    <People t={t} a={l1} x={1060 + 136 * Math.min(5, Math.floor(cl((t - l1) / 12) * 6))} y={380} n={1} s={50} />
    <Tx t={t} a={end} y={160} txt="THE BUNS GO AT THE END · ON PURPOSE" size={56} font={SANS} weight={900} w={860} col={C.goldL} />
    <Lb t={t} a={top} x={1450} y={830} txt="FIRST? ONE BUN ON TOP OF EVERYTHING" size={38} w={820} />
  </Stage>;
};

// 33 · LA INCURSIÓN A LA COCINA: la fuente llena; cada «HAM BUN» uno sale volando hacia una mano distinta y el contador baja; al final «UNA FUENTE YA SE FUE»
export const KitchenRaid: React.FC<M> = ({ t, a, out, m: [gs, h1, h2, h3, h4, pan1] }) => {
  const hits = [h1, h1 + 1.2, h2, h2 + 1, h3, h3 + 1.2, h4, h4 + 0.8, h4 + 1.6, h4 + 2.4, h4 + 3.1, h4 + 3.8], left = 12 - hits.filter((h) => t > h).length;
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="glazedpan" a={a + 0.1} x={1340} y={880} w={460} op={t > pan1 ? 0.3 : 1} />
    {hits.map((h, i) => { const p = arc(t, h, 0.8, 1340, 720, [1880, 1760, 1640][i % 3], [200, 330, 150][i % 3], 240); return t > h && p.k < 1 ? <Img key={i} src={O("hambun")} style={{ position: "absolute", left: p.x - 60, top: p.y - 50, width: 120, transform: `rotate(${(p.k * 300).toFixed(0)}deg)`, opacity: 1 - p.k * 0.6 }} /> : null; })}
    <Tx t={t} a={gs} x={1340} y={130} txt={`${left} LEFT`} size={110} font={SANS} weight={900} col={left < 4 ? C.red : C.goldL} w={500} />
    <Lb t={t} a={gs} x={1700} y={460} txt="GRANDSONS · PASTOR'S WIFE · DIRECTOR · US" size={30} w={360} />
    <Stamp t={t} a={pan1} x={1340} y={620} txt="ONE PAN GONE" size={56} />
  </Stage>;
};

// 34 · LA CAJA DE LA FAMILIA: ocho bollos caen en la bandeja descartable, entra el papel aluminio, la cinta azul se pega con un trazo y el marcador escribe; el reloj salta de 6 a 9 de la noche
export const FamilyBox: React.FC<M> = ({ t, a, out, m: [eight, foil, tape, mark, six, nine] }) => {
  const nm = "FAMILY", wr = ei(t, mark, mark + 1.2);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="alupan" a={a + 0.1} x={1340} y={900} w={460} op={t > foil ? 1 : 0} />
    <Ob t={t} n="emptypan" a={a + 0.1} x={1340} y={900} w={460} op={t > foil ? 0 : 1} />
    {Array.from({ length: 8 }, (_, i) => t > eight + i * 0.15 && t < foil ? <Roll key={i} x={1190 + (i % 4) * 100} y={770 + Math.floor(i / 4) * 80 - 300 * (1 - cl(sp(t, eight + i * 0.15)))} s={90} gl={0.7} /> : null)}
    <Lb t={t} a={eight} x={1340} y={330} txt="8 BUNS FOR THE FAMILY" size={46} w={620} op={1 - ei(t, six - 1, six)} />
    {t > tape && <div style={{ position: "absolute", left: 1130, top: 760, width: 420 * ei(t, tape, tape + 0.5), height: 52, background: "#4a8fd8", opacity: 0.92, boxShadow: "0 3px 5px rgba(0,0,0,.3)" }} />}
    {t > mark && <div style={{ position: "absolute", left: 1150, top: 760, fontFamily: HAND, fontSize: 52, color: "#111" }}>{nm.slice(0, Math.round(nm.length * wr))}</div>}
    <Face t={t} a={six - 0.3} b={nine + 1} x={1720} y={330} r={120} h0={6} h1={9} />
    <Lb t={t} a={six} x={1720} y={480} txt="A QUIET HOUSE" size={36} w={320} />
    <Lb t={t} a={nine} x={1720} y={520} txt="9 PM · THEY OPEN THE BOX" size={32} w={340} col={C.goldL} />
  </Stage>;
};

// 35 · CINCO BOLLOS ARRUINADOS: cinco bollos en fila, cada uno con su defecto (seco, empapado, queso sin derretir, semillas negras, centro frío) que aparece con su número
export const FiveRuined: React.FC<M> = ({ t, a, out, m: [m1, m2, m3, m4, m5] }) => {
  const D: [number, string, string][] = [[m1, "DRY", "saturate(.4) brightness(1.15)"], [m2, "SOGGY", "brightness(.7) sepia(.5)"], [m3, "CHEESE", "contrast(1.2)"], [m4, "BURNT", "brightness(.45) contrast(1.4)"], [m5, "COLD", "hue-rotate(180deg) saturate(.5)"]];
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={90} txt="5 WAYS TO RUIN THEM" size={80} font={SANS} weight={900} col={C.goldL} />
    {D.map(([at, l, f], i) => { const x = 1110 + i * 175, on = t > at, cur = on && (i === 4 || t < D[i + 1][0]);
      return <React.Fragment key={i}>
        <Ob t={t} n="hambun" a={a + 0.3 + i * 0.15} x={x} y={cur ? 700 : 760} w={cur ? 210 : 160} fl={`drop-shadow(0 10px 12px rgba(0,0,0,.4)) ${on ? f : ""}`} />
        <Lb t={t} a={at} x={x} y={800} txt={`${i + 1} · ${l}`} size={28} w={170} col={cur ? C.red : C.cream} />
      </React.Fragment>; })}
  </Stage>;
};

// 36 · LO QUE ARLENE NUNCA HIZO: cinco sellos NEVER golpean sobre cinco objetos que caen (tajada gruesa, panes sueltos, fuente destapada, mostaza dulce, el bollo que sale de la cocina)
export const NeverStamps: React.FC<M> = ({ t, a, out, m: [n1, n2, n3, n4, n5] }) => {
  const S: [number, string, string][] = [[n1, "thickslice", "THICK HAM"], [n2, "slab12", "SEPARATED"], [n3, "glazedpan", "UNCOVERED"], [n4, "mustard", "SWEET MUSTARD"], [n5, "hambun", "OUT THE DOOR"]];
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={a + 0.1} y={80} txt="ARLENE NEVER…" size={86} font={SANS} weight={900} col={C.goldL} />
    {S.map(([at, n, l], i) => { const x = 1120 + (i % 3) * 300, y = i < 3 ? 520 : 860, xx = i < 3 ? x : x + 150;
      return <React.Fragment key={i}>
        <Ob t={t} n={n} a={at - 0.2} x={xx} y={y} w={200} />
        <Stamp t={t} a={at + 0.5} x={xx} y={y - 110} txt="NEVER" size={42} rot={-14 + i * 6} />
        <Lb t={t} a={at + 0.6} x={xx} y={y + 10} txt={l} size={28} w={260} />
      </React.Fragment>; })}
  </Stage>;
};

// 37 · ADELANTAR Y CONGELAR: almanaque con 24 h; +5 min; el freezer escarcha la bandeja (copos), con la regla: congelar ANTES del glaseado, hasta 1 mes
export const AheadFreeze: React.FC<M> = ({ t, a, out, m: [q1, h24, q2, bg, mon] }) => {
  const fr = ei(t, q2, q2 + 2);
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="foilpan" a={a + 0.1} x={1450} y={860} w={460} fl={`drop-shadow(0 12px 16px rgba(0,0,0,.4)) saturate(${(1 - 0.6 * fr).toFixed(2)}) hue-rotate(${(20 * fr).toFixed(0)}deg) brightness(${(1 + 0.25 * fr).toFixed(2)})`} />
    <Tag t={t} a={h24} x={1220} y={200} txt="UP TO 24 HOURS" w={380} size={44} />
    <Lb t={t} a={h24 + 4} x={1220} y={300} txt="+5 MIN COVERED" size={36} w={380} col={C.goldL} />
    {t > q2 && Array.from({ length: 14 }, (_, i) => { const u = ((t - q2) * 0.4 + i * 0.13) % 1; return <div key={i} style={{ position: "absolute", left: 1220 + ((i * 71) % 480), top: 400 + u * 420, fontSize: 40, color: "#e6f3ff", opacity: Math.sin(Math.PI * u) * fr, textShadow: "0 0 8px #9fd0ff" }}>❄</div>; })}
    <Tag t={t} a={bg} x={1700} y={200} txt="FREEZE BEFORE THE GLAZE" w={380} size={36} col="#2a4f7a" />
    <Lb t={t} a={mon} x={1700} y={300} txt="UP TO A MONTH" size={40} w={380} col="#bfe0ff" />
  </Stage>;
};

// 38 · LOS REEMPLAZOS: el jamón se da vuelta como una carta y aparece pavo; la lata de amapola rueda afuera y entra el bol de sésamo
export const SwapCards: React.FC<M> = ({ t, a, out, m: [q3, q4, ses] }) => {
  const f1 = ei(t, q3 + 1.2, q3 + 2), f2 = ei(t, ses - 0.4, ses + 0.4);
  return <Stage t={t} a={a} out={out}>
    <div style={{ position: "absolute", left: 1080, top: 360, width: 360, height: 440, transform: `perspective(900px) rotateY(${(180 * f1).toFixed(1)}deg)`, transformStyle: "flat" }}>
      <Img src={O(f1 < 0.5 ? "shaved" : "turkey")} style={{ width: "100%", transform: f1 < 0.5 ? undefined : "scaleX(-1)", filter: "drop-shadow(0 12px 16px rgba(0,0,0,.4))", opacity: cl((t - a) * 4) }} />
    </div>
    <Lb t={t} a={q3} x={1260} y={850} txt={f1 < 0.5 ? "HAM" : "TURKEY WORKS"} size={44} w={360} col={f1 < 0.5 ? C.cream : GOOD} />
    <Ob t={t} n="poppytin" a={q4} x={lerp(1680, 1990, f2)} y={720} w={200} r={360 * f2} origin="50% 50%" op={1 - f2} />
    <Ob t={t} n="sesame" a={ses} x={1680} y={720} w={240} from="right" />
    <Lb t={t} a={q4} x={1680} y={850} txt={f2 < 0.5 ? "NO POPPY SEEDS?" : "SESAME ON TOP"} size={40} w={380} col={f2 < 0.5 ? C.cream : GOOD} />
  </Stage>;
};

// 39 · LA REGLA DE LAS DOS HORAS: un aro de 2 horas se vacía; en vez de una fuente grande, fuentes chicas entran a la línea de a una cuando la anterior baja a 3-4 bollos
export const SmallPans: React.FC<M> = ({ t, a, out, m: [two, d34, small, one, down] }) => {
  const r = ei(t, two, two + 8), sw = ei(t, down, down + 1);
  return <Stage t={t} a={a} out={out}>
    <svg width={300} height={300} style={{ position: "absolute", left: 1080, top: 140, opacity: cl((t - two) * 4) }}><circle cx={150} cy={150} r={120} fill="rgba(0,0,0,.45)" /><circle cx={150} cy={150} r={120} fill="none" stroke={C.red} strokeWidth={18} strokeDasharray={754} strokeDashoffset={754 * r} transform="rotate(-90 150 150)" strokeLinecap="round" /><text x={150} y={172} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={64} fill={C.cream}>2 H</text></svg>
    <Lb t={t} a={d34} x={1230} y={470} txt="FRIDGE: 3–4 DAYS" size={36} w={360} />
    <Lb t={t} a={small} x={1620} y={160} txt="SMALL PANS, NOT ALL AT ONCE" size={40} w={520} col={C.goldL} />
    <Ob t={t} n="glazedpan" a={one} x={lerp(1620, 1940, sw)} y={720} w={330} op={1 - sw} />
    <Ob t={t} n="glazedpan" a={down + 0.2} x={1620} y={720} w={330} from="right" />
    <Lb t={t} a={down} x={1620} y={760} txt="DOWN TO 3 OR 4 → NEW PAN" size={34} w={460} />
  </Stage>;
};

// 40 · LA PICADORA DE HIERRO: la manivela gira, salen bolitas de jamón y ruedan a la fila; galleta graham, tamaño pelota de golf, el reloj de hierro marca 160°
export const HamBalls: React.FC<M> = ({ t, a, out, m: [grind, hb, grh, golf, t160, iron] }) => {
  const crank = (t - grind) * 260;
  return <Stage t={t} a={a} out={out}>
    <Ob t={t} n="grinder" a={grind - 0.2} x={1220} y={760} w={340} tf={t > grind ? `rotate(${(Math.sin(crank / 60) * 3).toFixed(2)}deg)` : ""} />
    <Tag t={t} a={iron} x={1220} y={180} txt="CAST IRON · CLAMPED" w={380} size={36} />
    <Lb t={t} a={hb} x={1600} y={170} txt="1 LB HAM + 1 LB PORK" size={42} w={520} />
    <Ob t={t} n="graham" a={grh} x={1820} y={940} w={150} />
    <Lb t={t} a={grh + 0.2} x={1820} y={950} txt="GRAHAM" size={28} w={180} col={C.goldL} />
    {Array.from({ length: 6 }, (_, i) => { const at = golf + i * 0.35, p = arc(t, at, 0.7, 1300, 640, 1450 + i * 60, 880, 120); return t > at ? <Img key={i} src={O("hamball")} style={{ position: "absolute", left: p.x - 40, top: p.y - 70, width: 80, transform: `rotate(${(p.k * 360).toFixed(0)}deg)` }} /> : null; })}
    <Lb t={t} a={golf} x={1560} y={290} txt="GOLF-BALL SIZE" size={40} w={420} col={C.goldL} />
    <Dial t={t} a={t160 - 0.5} x={1660} y={540} v={lerp(90, 160, ei(t, t160 - 0.4, t160 + 0.6))} r={100} hot={160} />
  </Stage>;
};

// 41 · LA MAÑANA EN EL RELOJ: el reloj de escuela grande; las agujas avanzan 10:30 → 11 → 11:15 → 11:30 → 12, con un cartel por cada hito que entra en órbita
export const ClockMorning: React.FC<M> = ({ t, a, out, m: [c1030, c11, c1115, c1130, c12] }) => {
  const H: [number, number, string][] = [[c1030, 10.5, "OVENS ON"], [c11, 11, "FIRST HYMN"], [c1115, 11.25, "FOIL OFF"], [c1130, 11.5, "PALLBEARERS"], [c12, 12, "AMEN"]];
  let h = 10.4; H.forEach(([at, v], i) => { const pv = i ? H[i - 1][1] : 10.4; if (t > at - 0.8) h = lerp(pv, v, ei(t, at - 0.8, at)); });
  return <Stage t={t} a={a} out={out}>
    <Face t={t} a={a + 0.1} b={a + 0.11} x={1380} y={560} r={250} h0={h} h1={h} />
    {H.map(([at, v, l], i) => { const an = (v * 30 - 90) * Math.PI / 180; return <Tag key={i} t={t} a={at} x={1380 + Math.cos(an) * 390 + 60} y={540 + Math.sin(an) * 330 - 30} txt={l} w={260} size={34} rot={-4 + i * 2} col={i === 4 ? "#2f6a35" : C.wine} />; })}
  </Stage>;
};

// 42 · LA TARJETA EN LA CAJA: 1989 (la puerta de la cocina, ella en el marco) → 2019 (Arlene, 91); la tarjeta de receta baja planeando y entra en la caja de la hija
export const CardInBox: React.FC<M> = ({ t, a, out, m: [y89, y19, n91, box] }) => {
  const p = arc(t, box - 0.3, 1.4, 1250, 300, 1600, 780, -80);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={y89} x={1420} y={120} txt="1989" size={120} font={SANS} weight={900} op={1 - 0.6 * ei(t, y19, y19 + 0.5)} w={400} />
    <Lb t={t} a={y89 + 0.6} x={1440} y={280} txt="MOM · I STOOD IN THE DOORWAY" size={30} w={420} op={1 - ei(t, y19, y19 + 0.5)} />
    <Tx t={t} a={y19} x={1720} y={120} txt="2019" size={110} font={SANS} weight={900} col={C.goldL} w={400} />
    <Tag t={t} a={n91} x={1720} y={300} txt="ARLENE · 91" w={300} size={44} />
    <Ob t={t} n="alupan" a={box - 1} x={1600} y={940} w={380} />
    {t > box - 0.3 && <div style={{ position: "absolute", left: p.x - 120, top: p.y - 80, width: 240, height: 150, background: "linear-gradient(180deg,#fbf1d6,#ecd9a8)", borderRadius: 6, boxShadow: "0 10px 16px rgba(0,0,0,.5)", transform: `rotate(${(Math.sin(p.k * 9) * 14 * (1 - p.k)).toFixed(1)}deg) scale(${(1 - 0.4 * p.k).toFixed(3)})`, opacity: 1 - ei(t, box + 1.1, box + 1.4) }}><div style={{ fontFamily: HAND, fontSize: 30, color: "#2a3f7a", padding: 12 }}>Ham Buns ~ A.P.</div></div>}
  </Stage>;
};

// 43 · EL BOLLO DESARMADO: capas que bajan una por una con su medida (pan de abajo, jamón ¾ lb, suizo, tapa, glaseado) y se cierran de golpe al final con el termómetro en 140°
export const ExplodedBun: React.FC<M> = ({ t, a, out, m: [ra, rb, rc, rd, rf, rg] }) => {
  const close = ei(t, rf, rf + 0.8);
  const Ly = (at: number, y: number, h: number, bg: string, lab: string, br: string) => { const k = cl(sp(t, at)), yy = lerp(y, 600 + (y - 600) * 0.15, close);
    return t > at - 0.05 ? <React.Fragment key={lab}><div style={{ position: "absolute", left: 1180, top: yy - h / 2 - (1 - k) * 200, width: 420, height: h, borderRadius: br, background: bg, boxShadow: "0 8px 12px rgba(0,0,0,.4)", opacity: cl(k * 3) }} /><Lb t={t} a={at} x={1760} y={yy - 22} txt={lab} size={30} w={300} op={1 - close} /></React.Fragment> : null; };
  return <Stage t={t} a={a} out={out}>
    {Ly(ra, 860, 70, "linear-gradient(180deg,#f0d4a0,#c8873d)", "12 ROLLS · 1 SLAB", "14px 14px 40px 40px")}
    {Ly(rb, 740, 60, `repeating-linear-gradient(90deg, ${HAMP} 0 30px, #f3b9b4 30px 60px)`, "¾ LB SHAVED HAM", "10px")}
    {Ly(rb + 3, 640, 26, "#f5dc8f", "6 SLICES SWISS", "4px")}
    {Ly(rc, 520, 110, `linear-gradient(180deg, ${BUNC}, #f0d4a0)`, "TOP HALF", "200px 200px 14px 14px")}
    {Ly(rd, 410, 22, GLZ, "GLAZE IN THE CRACKS", "10px")}
    <Lb t={t} a={rf} x={1390} y={170} txt="350° · FOIL · 20 + 5" size={46} w={600} col={C.goldL} />
    <Dial t={t} a={rg - 0.4} x={1700} y={330} v={lerp(80, 140, ei(t, rg - 0.3, rg + 0.6))} r={100} hot={140} />
  </Stage>;
};

// 44 · LAS DOCE EN PUNTO: pregunta grande «¿QUIÉN FUE TU ARLENE?»; la aguja grande llega a las 12 y el aluminio de la última fuente se levanta con vapor
export const LastFoil: React.FC<M> = ({ t, a, out, m: [your, big, foil] }) => {
  const off = ei(t, foil, foil + 1.2);
  return <Stage t={t} a={a} out={out}>
    <Tx t={t} a={your} y={110} txt="WHO WAS YOUR ARLENE?" size={80} font={SANS} weight={900} col={C.goldL} w={880} />
    <Face t={t} a={big - 0.4} b={big + 1} x={1720} y={420} r={130} h0={11.9} h1={12} />
    <Ob t={t} n="glazedpan" a={a + 0.3} x={1340} y={900} w={460} />
    <Ob t={t} n="foilpan" a={a + 0.3} x={1340} y={900 - 260 * off} w={460} from="none" r={-18 * off} op={1 - off} z={3} />
    {t > foil && <Vapor t={t} a={foil} b={foil + 3} x={1340} y={720} big={0.8} />}
  </Stage>;
};
