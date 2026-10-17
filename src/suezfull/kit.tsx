// Kit del video entero de Suez: mundo nuevo (Viejo Mundo, mismo sepia del istmo), cámara por llaves,
// rótulos, rutas, portales y transiciones. Cada capítulo se coreografía A MANO con estas piezas.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

import { sf } from "./sf";

export const { fontFamily: SANS } = loadFont("normal", { weights: ["700", "800", "900"] });
export const { fontFamily: HAND } = loadHand("normal", { weights: ["700"] });
export const FPS = 30;
export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pop = (f: number, t0: number, damping = 11) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.6 } });
export const fadeOut = (t: number, t1: number, d = 0.3) => interpolate(t, [t1 - d, t1], [1, 0], clamp);
export const vis = (t: number, t0: number, t1: number) => t >= t0 - 0.05 && t <= t1 + 0.05;
export const ramp = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ───────── mundo: 30 px/grado, lon -100..160, lat 72..-50 ─────────
export const PPD = 30, ML = -100, MT = 72, MW = 7800, MH = 3660;
export const P = (lon: number, lat: number): [number, number] => [(lon - ML) * PPD, (MT - lat) * PPD];
export type Key = [number, number, number, number]; // t, lon, lat, zoom
export type Cam = { x: number; y: number; z: number };
export const camAt = (keys: Key[], t: number): Cam => {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const [ax, ay] = P(a[1], a[2]), [bx, by] = P(b[1], b[2]);
  let z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
  // viajes largos: la cámara se aleja en el medio (arco), como el minuto 1
  const dist = Math.hypot(bx - ax, by - ay) * Math.min(a[3], b[3]);
  if (dist > 1400) z *= 1 - Math.min(0.55, dist / 9000) * Math.sin(Math.PI * k);
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, z };
};
export const proj = (c: Cam, lon: number, lat: number): [number, number] => { const [wx, wy] = P(lon, lat); return [(wx - c.x) * c.z + 960, (wy - c.y) * c.z + 540]; };

// capas: mundo base, Mediterráneo en alta (90 px/grado) e istmo (300 px/grado)
const HI = { l: -12, r: 60, t: 56, b: 10 };
const INSET = { l: 29, r: 35.5, t: 33, b: 27 };
const EG = { l: 24, r: 40, t: 36, b: 24 };
const inView = (c: Cam, b: { l: number; r: number; t: number; b: number }) => {
  const [x0, y0] = proj(c, b.l, b.t), [x1, y1] = proj(c, b.r, b.b);
  return { x0, y0, x1, y1, on: x1 > 0 && x0 < 1920 && y1 > 0 && y0 < 1080, covers: x0 <= 0 && y0 <= 0 && x1 >= 1920 && y1 >= 1080 };
};
export const MapLayer: React.FC<{ c: Cam }> = ({ c }) => {
  const hi = inView(c, HI), ins = inView(c, INSET), eg = inView(c, EG);
  const useEg = c.z >= 5 && eg.on;
  const hiOp = interpolate(c.z, [1.3, 2.0], [0, 1], clamp);
  const insetOp = interpolate(c.z, [2.2, 4.5], [0, 1], clamp);
  const mask = `radial-gradient(ellipse closest-side at center, #000 ${interpolate(c.z, [4, 10], [55, 82], clamp)}%, transparent 100%)`;
  const [x0, y0] = proj(c, ML, MT);
  const baseOn = !(hi.covers && hiOp >= 1) && c.z < 6;
  return (
    <>
      {baseOn && <Img src={sf("suez/w2.jpg")} style={{ position: "absolute", left: x0, top: y0, width: MW * c.z, height: MH * c.z }} />}
      {hiOp > 0 && hi.on && !useEg && c.z < 7 && <Img src={sf("suez/w2_hi.jpg")} style={{ position: "absolute", left: hi.x0, top: hi.y0, width: hi.x1 - hi.x0, height: hi.y1 - hi.y0, opacity: hiOp }} />}
      {useEg && <Img src={sf("suez/w2_eg.jpg")} style={{ position: "absolute", left: eg.x0, top: eg.y0, width: eg.x1 - eg.x0, height: eg.y1 - eg.y0 }} />}
      {insetOp > 0 && ins.on && <Img src={sf("suez/inset.jpg")} style={{ position: "absolute", left: ins.x0, top: ins.y0, width: ins.x1 - ins.x0, height: ins.y1 - ins.y0, opacity: insetOp, WebkitMaskImage: mask, maskImage: mask }} />}
    </>
  );
};
// mapa con motion blur según la velocidad de la cámara
export const MapView: React.FC<{ keys: Key[]; t: number; hidden?: boolean; children?: (c: Cam) => React.ReactNode }> = ({ keys, t, hidden, children }) => {
  const c = camAt(keys, t), c0 = camAt(keys, t - 1 / FPS);
  const vz = Math.abs(Math.log(c.z / c0.z)) * 900, bz = Math.min(5, vz * 0.25);
  const bx = Math.min(16, Math.abs(c.x - c0.x) * c.z * 0.3) + bz, by = Math.min(16, Math.abs(c.y - c0.y) * c.z * 0.3) + bz;
  const id = "mb" + Math.round(t * 30);
  if (hidden) return null;
  return (
    <AbsoluteFill style={{ background: "#e6d8b6" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: bx + by > 0.6 ? `url(#${id})` : undefined }}><MapLayer c={c} /></AbsoluteFill>
      {children?.(c)}
    </AbsoluteFill>
  );
};

// ───────── polilíneas ─────────
export function partial(pts: [number, number][], k: number) {
  if (k <= 0) return [] as [number, number][];
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let left = seg.reduce((a, b) => a + b, 0) * Math.min(1, k);
  const out: [number, number][] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) { out.push(pts[i + 1]); left -= seg[i]; continue; }
    const r = left / seg[i];
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r]);
    break;
  }
  return out;
}
export const dpath = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
export type LL = [number, number][];
// suaviza una ruta (Catmull-Rom) para que los barcos no doblen en ángulo
export const smooth = (pts: LL, n = 8): LL => {
  const out: LL = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < n; s++) {
      const u = s / n, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3)) as [number, number]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

// ruta que se dibuja (con barco/punta en la cabeza)
export const Route: React.FC<{ c: Cam; t: number; f: number; pts: LL; t0: number; t1: number; out?: number; color?: string; w?: number; dash?: boolean; ship?: boolean; flip?: boolean; shipSize?: number; glow?: string }> = ({ c, t, f, pts, t0, t1, out = 1e9, color = "#d4241c", w = 7, dash, ship, flip, shipSize = 90, glow }) => {
  if (t < t0) return null;
  const k = ramp(t, t0, t1, Easing.inOut(Easing.sin));
  const op = fadeOut(t, out, 0.4);
  if (op <= 0) return null;
  const sp = smooth(pts).map(([lo, la]) => proj(c, lo, la));
  const p = partial(sp, k);
  const [hx, hy] = p[p.length - 1] ?? sp[0];
  const prev = p[Math.max(0, p.length - 2)] ?? sp[0];
  const goingLeft = hx < prev[0] - 0.5;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={dpath(p)} fill="none" stroke="rgba(40,25,10,.35)" strokeWidth={w + 5} strokeLinecap="round" strokeLinejoin="round" />
        <path d={dpath(p)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? `${w * 2.4} ${w * 1.8}` : undefined} strokeDashoffset={dash ? -f * 1.2 : undefined} style={glow ? { filter: `drop-shadow(0 0 8px ${glow})` } : undefined} />
        {!ship && k > 0 && k < 1 && <circle cx={hx} cy={hy} r={w * 1.1} fill="#fff" stroke={color} strokeWidth={3} />}
      </svg>
      {ship && k > 0 && <Img src={sf("icons/ship.png")} style={{ position: "absolute", left: hx, top: hy + Math.sin(f / 6) * 3, width: shipSize, transform: `translate(-50%,-78%) scaleX(${(flip ?? goingLeft) ? -1 : 1})`, filter: "drop-shadow(0 8px 8px rgba(0,0,0,.45))" }} />}
    </AbsoluteFill>
  );
};

// ───────── rótulos ─────────
export const Tag: React.FC<{ c: Cam; f: number; t: number; lon: number; lat: number; t0: number; t1: number; text: React.ReactNode; dy?: number; dx?: number; bg?: string; size?: number; dot?: boolean }> = ({ c, f, t, lon, lat, t0, t1, text, dy = 0, dx = 0, bg = "#111", size = 30, dot }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, lon, lat);
  const s = pop(f, t0) * fadeOut(t, t1);
  return (
    <>
      {dot && <div style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: "#fff", border: "4px solid #111", transform: `scale(${s})` }} />}
      <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 0.6, padding: "6px 14px 7px", borderRadius: 6, border: "2px solid rgba(255,255,255,.85)", boxShadow: "0 6px 16px rgba(0,0,0,.45)", whiteSpace: "nowrap", textTransform: "uppercase" }}>{text}</div>
    </>
  );
};
// texto a mano sobre el mapa (nombres de mares, etc.)
export const HandLabel: React.FC<{ c: Cam; f: number; t: number; lon: number; lat: number; t0: number; t1: number; text: string; size?: number; rot?: number; color?: string }> = ({ c, f, t, lon, lat, t0, t1, text, size = 54, rot = -3, color = "#26314a" }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, lon, lat);
  const w = ramp(t, t0, t0 + 0.5, Easing.linear) * fadeOut(t, t1);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: HAND, fontSize: size, color, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - ramp(t, t0, t0 + 0.5, Easing.linear) * 100}% 0 0)`, opacity: fadeOut(t, t1), textShadow: "0 0 6px #f3e6c4, 0 0 14px #f3e6c4" }} data-w={w}>{text}</div>;
};
export const Icon: React.FC<{ c: Cam; f: number; t: number; src: string; lon: number; lat: number; t0: number; t1: number; size?: number; flip?: boolean }> = ({ c, f, t, src, lon, lat, t0, t1, size = 100, flip }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, lon, lat);
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  return <Img src={sf(`icons/${src}.png`)} style={{ position: "absolute", left: x, top: y + Math.sin((f + lon * 9) / 12) * 4, width: size, transform: `translate(-50%,-80%) scale(${flip ? -s : s},${s})`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.4))" }} />;
};
// banderas: las que hay en PNG + las dibujadas en CSS
const CSSFLAG: Record<string, React.ReactNode> = {
  eg: <div style={{ width: "100%", height: "100%", background: "linear-gradient(#ce1126 0 33.3%, #fff 33.3% 66.6%, #111 66.6%)" }} />,
  egold: <div style={{ width: "100%", height: "100%", background: "#c8102e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 40 }}>☪</div>,
  ot: <div style={{ width: "100%", height: "100%", background: "#c8102e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 40 }}>☪</div>,
  pt: <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#046a38 0 40%,#da291c 40%)" }} />,
  il: <div style={{ width: "100%", height: "100%", background: "linear-gradient(#fff 0 12%,#0038b8 12% 24%,#fff 24% 76%,#0038b8 76% 88%,#fff 88%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0038b8", fontSize: 34 }}>✡</div>,
  ve: <div style={{ width: "100%", height: "100%", background: "#b22234", display: "flex", alignItems: "center", justifyContent: "center", color: "#f6c64e", fontSize: 36 }}>♌</div>,
  at: <div style={{ width: "100%", height: "100%", background: "linear-gradient(#ed2939 0 33.3%,#fff 33.3% 66.6%,#ed2939 66.6%)" }} />,
  su: <div style={{ width: "100%", height: "100%", background: "#cc0000", color: "#ffd900", fontSize: 26, padding: "2px 6px" }}>☭</div>,
  pa: <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#fff 0 50%,#d21034 50%)", }} />,
};
export const Flag: React.FC<{ c?: Cam; f: number; t: number; cc: string; lon?: number; lat?: number; x?: number; y?: number; t0: number; t1: number; w?: number; dx?: number; dy?: number }> = ({ c, f, t, cc, lon = 0, lat = 0, x: sx, y: sy, t0, t1, w = 70, dx = 0, dy = 0 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = c ? proj(c, lon, lat) : [sx ?? 0, sy ?? 0];
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  const box: React.CSSProperties = { position: "absolute", left: x + dx, top: y + dy, width: w, height: w * 0.66, transform: `translate(-50%,-50%) scale(${s}) rotate(-4deg)`, border: "3px solid #fff", borderRadius: 4, boxShadow: "0 6px 14px rgba(0,0,0,.45)", overflow: "hidden", transformOrigin: "50% 50%" };
  if (CSSFLAG[cc]) return <div style={{ ...box, fontSize: w * 0.5 }}><div style={{ width: w, height: w * 0.66, transform: `scale(${w / 70})`, transformOrigin: "0 0", position: "absolute" }}>{CSSFLAG[cc]}</div></div>;
  return <Img src={sf(`flag_${cc}.png`)} style={{ ...box, height: undefined }} />;
};

// nota de año arriba a la izquierda (gira el reloj de arena al cambiar)
export const YearNote: React.FC<{ f: number; t: number; marks: [number, string][]; until?: number }> = ({ f, t, marks, until = 1e9 }) => {
  const cur = [...marks].reverse().find(([s]) => s <= t);
  if (!cur || t > until) return null;
  const [last, label] = cur;
  if (!label) return null;
  const s = pop(f, last, 9) * fadeOut(t, until, 0.3);
  const flip = interpolate(t - last, [0, 0.5], [180, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14, zIndex: 50 }}>
      <Img src={sf("icons/hourglass.png")} style={{ width: 74, transform: `rotate(${flip}deg)`, filter: "drop-shadow(0 6px 8px rgba(0,0,0,.4))" }} />
      <div style={{ transform: `scale(${s}) rotate(-2deg)`, border: "3px solid #fff", boxShadow: "0 8px 18px rgba(0,0,0,.35)", padding: "0 26px", height: 84, display: "flex", alignItems: "center",
        backgroundImage: "repeating-linear-gradient(transparent 0 26px, rgba(80,110,160,.25) 26px 27px), linear-gradient(#fbf6e6,#efe4c4)", backgroundColor: "#f6efd9", fontFamily: HAND, fontSize: 62, color: "#26314a", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// rótulo negro del personaje
export const Caption: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; text: string; flag?: string }> = ({ f, t, t0, t1, x, y, text, flag }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 11) * fadeOut(t, t1, 0.25);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-2deg)`, display: "flex", alignItems: "center", gap: 12, background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 30, padding: "7px 16px 8px", borderRadius: 6, border: "2px solid rgba(255,255,255,.85)", boxShadow: "0 6px 16px rgba(0,0,0,.45)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {flag && <div style={{ position: "relative", width: 46, height: 30 }}><Flag f={9999} t={0} t0={-1} t1={9} cc={flag} x={23} y={15} w={46} /></div>}{text}
    </div>
  );
};
export const BigWord: React.FC<{ f: number; t: number; t0: number; t1: number; text: React.ReactNode; x?: number; y?: number; size?: number; color?: string }> = ({ f, t, t0, t1, text, x = 960, y = 170, size = 130, color = "#fff" }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 8) * fadeOut(t, t1, 0.25);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: size, color, letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 4px 0 #1b1b1b, 0 8px 22px rgba(0,0,0,.55), 0 0 2px #000", textAlign: "center", lineHeight: 1.05 }}>{text}</div>;
};
export const Stamp: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ f, t, t0, t1, x, y, text, size = 90, rot = -10, color = "#d4241c" }) => {
  if (!vis(t, t0, t1)) return null;
  const k = ramp(t, t0, t0 + 0.14, Easing.in(Easing.quad));
  const s = interpolate(k, [0, 1], [2.4, 1]) * fadeOut(t, t1);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: k, border: `${size * 0.09}px solid ${color}`, color, fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 4, padding: `0 ${size * 0.3}px`, borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", background: "rgba(255,244,236,.82)", boxShadow: "0 8px 20px rgba(0,0,0,.35)" }}>{text}</div>;
};
// nota de papel con texto a mano (cifras, citas)
export const Note: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; children: React.ReactNode; w?: number; rot?: number; size?: number }> = ({ f, t, t0, t1, x, y, children, w = 560, rot = -2, size = 52 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1, 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot}deg)`, padding: "22px 30px", border: "4px solid #fff", borderRadius: 6, boxShadow: "0 14px 34px rgba(0,0,0,.45)",
      backgroundImage: "repeating-linear-gradient(transparent 0 38px, rgba(80,110,160,.2) 38px 39px), linear-gradient(#fbf6e6,#efe4c4)", fontFamily: HAND, fontSize: size, color: "#26314a", lineHeight: 1.12, textAlign: "center" }}>{children}</div>
  );
};
// contador odómetro
export const Count: React.FC<{ t: number; t0: number; t1: number; from: number; to: number; fmt?: (n: number) => string }> = ({ t, t0, t1, from, to, fmt = (n) => Math.round(n).toLocaleString("en-US") }) => (
  <>{fmt(from + (to - from) * ramp(t, t0, t1, Easing.out(Easing.cubic)))}</>
);

// ───────── fotos reales (dominio público) ─────────
// foto tipo polaroid que cae sobre la pantalla, con zoom lento adentro
export const Photo: React.FC<{ f: number; t: number; t0: number; t1: number; src: string; x: number; y: number; w: number; h: number; rot?: number; caption?: string; pos?: string; from?: [number, number] }> = ({ f, t, t0, t1, src, x, y, w, h, rot = -3, caption, pos = "50% 40%", from = [0, -700] }) => {
  if (!vis(t, t0, t1)) return null;
  const k = ramp(t, t0, t0 + 0.5, Easing.out(Easing.back(1.2)));
  const out = ramp(t, t1 - 0.35, t1, Easing.in(Easing.cubic));
  const prog = (t - t0) / (t1 - t0);
  const ox = from[0] * (1 - k) + out * 1400 * Math.sign(x - 960 || 1), oy = from[1] * (1 - k);
  return (
    <div style={{ position: "absolute", left: x + ox, top: y + oy, transform: `translate(-50%,-50%) rotate(${rot + (1 - k) * 12}deg)`, background: "#fbf7ec", padding: "14px 14px 0", boxShadow: "0 22px 50px rgba(0,0,0,.55)", borderRadius: 3 }}>
      <div style={{ width: w, height: h, overflow: "hidden", background: "#222" }}>
        <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.04 + 0.1 * prog})`, filter: "sepia(.25) contrast(1.05)" }} />
      </div>
      <div style={{ height: caption ? 64 : 18, fontFamily: HAND, fontSize: 40, color: "#26314a", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>{caption}</div>
    </div>
  );
};
// foto a pantalla completa con zoom lento y viñeta (archivo real)
export const FullPhoto: React.FC<{ t: number; t0: number; t1: number; src: string; z0?: number; z1?: number; ox?: number; pos?: string }> = ({ t, t0, t1, src, z0 = 1.04, z1 = 1.16, ox = 30, pos = "50% 50%" }) => {
  const k = ramp(t, t0, t1, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z0 + (z1 - z0) * k}) translateX(${(k - 0.5) * ox}px)`, filter: "sepia(.3) contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%)" }} />
    </AbsoluteFill>
  );
};

// ───────── portales y transiciones ─────────
// portal circular que contiene una escena: abre desde o y cierra hacia cpt
export const ScenePortal: React.FC<{ t: number; open: [number, number]; close: [number, number]; o: [number, number]; cpt: [number, number]; children: React.ReactNode }> = ({ t, open, close, o, cpt, children }) => {
  if (t < open[0] || t > close[1]) return null;
  const kIn = open[1] > open[0] ? ramp(t, open[0], open[1]) : 1, kOut = ramp(t, close[0], close[1], Easing.in(Easing.cubic));
  const closing = t >= close[0];
  const R = closing ? 2300 * (1 - kOut) : 2300 * Easing.in(Easing.quad)(kIn);
  const [x, y] = closing ? cpt : o;
  const ring = closing ? Math.min(1, kOut * 4) : Math.max(0, 1 - kIn * 2.2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: !closing && kIn >= 1 ? undefined : `circle(${R}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
      {ring > 0 && R > 2 && <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", border: "7px solid #fff", opacity: ring, boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />}
    </AbsoluteFill>
  );
};
// portal circular chico a una imagen, anclado a un punto de la pantalla
export const Bubble: React.FC<{ f: number; t: number; t0: number; t1: number; src: string; x: number; y: number; r: number; pos?: string; caption?: string; anchor?: [number, number] }> = ({ f, t, t0, t1, src, x, y, r, pos = "50% 50%", caption, anchor }) => {
  const kin = ramp(t, t0, t0 + 0.45), kout = ramp(t, t1 - 0.4, t1);
  const k = Math.min(kin, 1 - kout);
  if (k <= 0) return null;
  const prog = (t - t0) / (t1 - t0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {anchor && <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={anchor[0]} y1={anchor[1]} x2={x} y2={y} stroke="#fff" strokeWidth={5} opacity={k} /><circle cx={anchor[0]} cy={anchor[1]} r={9 * k} fill="#fff" /></svg>}
      <AbsoluteFill style={{ clipPath: `circle(${r * k}px at ${x}px ${y}px)` }}>
        <Img src={sf(src)} style={{ position: "absolute", left: x - r * 1.15, top: y - r * 1.15, width: r * 2.3, height: r * 2.3, objectFit: "cover", objectPosition: pos, transform: `scale(${1.12 - 0.1 * prog})` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: x - r * k, top: y - r * k, width: 2 * r * k, height: 2 * r * k, borderRadius: "50%", border: "7px solid #fff", boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />
      {caption && <div style={{ position: "absolute", left: x, top: y + r * k + 14, transform: `translate(-50%,0) scale(${pop(f, t0 + 0.2)})`, background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 28, padding: "6px 14px", borderRadius: 6, border: "2px solid #fff", textTransform: "uppercase", whiteSpace: "nowrap", opacity: 1 - kout }}>{caption}</div>}
    </AbsoluteFill>
  );
};

// cadena de planos con transición en cada corte. shots = [tInicio, render, transición de entrada]
export type Tr = "whip" | "whipL" | "flash" | "zoom" | "smoke" | "sand" | "iris" | "slideUp" | "cut" | "ink";
export const Chain: React.FC<{ t: number; f: number; shots: [number, (t: number) => React.ReactNode, Tr?][]; end: number }> = ({ t, f, shots, end }) => {
  const D = 0.32;
  let i = shots.length - 1;
  while (i > 0 && t < shots[i][0]) i--;
  if (t < shots[0][0] || t > end) return null;
  const [tc, cur, tr = "cut"] = shots[i];
  const prev = i > 0 ? shots[i - 1][1] : null;
  const p = (t - tc) / D;
  const inTr = i > 0 && p < 1 && tr !== "cut";
  const wipeOver = (k: number) => {
    if (tr === "smoke" || tr === "sand") {
      const col = tr === "smoke" ? ["#3a302c", "#4d423c"] : ["#d4aa6e", "#bf9258"];
      return Array.from({ length: 14 }).map((_, j) => { const r = rnd(j + 7), sz = 700 * k + r * 400 * k; const x = (j % 5) * 470 + r * 120 - 60, y = Math.floor(j / 5) * 470 + r * 160 - 60; return <div key={j} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: "50%", background: col[j % 2], filter: "blur(40px)", opacity: Math.min(1, k * 1.6) }} />; });
    }
    if (tr === "flash") return <AbsoluteFill style={{ background: "#fff8e8", opacity: k }} />;
    if (tr === "ink") return <AbsoluteFill style={{ background: "#120c06", opacity: k }} />;
    return null;
  };
  if (!inTr) return <AbsoluteFill style={{ overflow: "hidden" }}>{cur(t)}</AbsoluteFill>;
  const tp = tc - 0.001;
  const e = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, p)));
  if (tr === "whip" || tr === "whipL") {
    const dir = tr === "whip" ? -1 : 1;
    return (
      <AbsoluteFill style={{ overflow: "hidden", filter: "blur(10px)" }}>
        <AbsoluteFill style={{ transform: `translateX(${dir * e * 1920}px)` }}>{prev?.(tp)}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateX(${-dir * (1 - e) * 1920}px)` }}>{cur(t)}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (tr === "slideUp") {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `translateY(${-e * 1080}px)`, filter: `blur(${Math.sin(Math.PI * e) * 8}px)` }}>{prev?.(tp)}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateY(${(1 - e) * 1080}px)`, filter: `blur(${Math.sin(Math.PI * e) * 8}px)` }}>{cur(t)}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (tr === "zoom") {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${1 + e * 2.5})`, opacity: 1 - e, filter: `blur(${e * 12}px)` }}>{prev?.(tp)}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(${0.6 + 0.4 * e})`, opacity: e, filter: `blur(${(1 - e) * 10}px)` }}>{cur(t)}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (tr === "iris") {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {prev?.(tp)}
        <AbsoluteFill style={{ clipPath: `circle(${e * 1150}px at 50% 50%)` }}>{cur(t)}</AbsoluteFill>
        <div style={{ position: "absolute", left: 960 - e * 1150, top: 540 - e * 1150, width: 2300 * e, height: 2300 * e, borderRadius: "50%", border: "7px solid #fff", opacity: 1 - e }} />
      </AbsoluteFill>
    );
  }
  // smoke / sand / flash / ink: tapa en la primera mitad, destapa en la segunda (el corte queda escondido)
  const k = interpolate(p, [0, 0.5, 1], [0, 1, 0], clamp);
  return <AbsoluteFill style={{ overflow: "hidden" }}>{p < 0.5 ? prev?.(tp) : cur(t)}{wipeOver(k)}</AbsoluteFill>;
};
// salida sin escena previa: la Chain empieza tapada; útil para "abrir desde negro"
export const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.28) 100%)", pointerEvents: "none" }} />;
// partículas de arena que cruzan (tormenta suave)
export const Dust: React.FC<{ f: number; op?: number; color?: string; n?: number }> = ({ f, op = 0.5, color = "#e8cf9f", n = 40 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
    {Array.from({ length: n }).map((_, i) => {
      const rr = rnd(i), r3 = rnd(i + 99);
      const speed = 10 + rr * 18;
      const x = ((rr * 2400 + f * speed) % 2400) - 240, y = 300 + r3 * 780 + Math.sin(f / 20 + i) * 20;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3 + rr * 5, height: 3 + rr * 5, borderRadius: "50%", background: color, opacity: 0.4 + 0.5 * r3 }} />;
    })}
  </AbsoluteFill>
);

// minimapa de pergamino arriba a la derecha: dónde estamos mientras corre una escena
export const MiniMap: React.FC<{ f: number; t: number; t0: number; t1: number; lon: number; lat: number; z: number; title?: string; children?: (c: Cam) => React.ReactNode }> = ({ f, t, t0, t1, lon, lat, z, title, children }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1, 0.3);
  const [mx, my] = P(lon, lat);
  const c: Cam = { x: mx, y: my, z };
  const SC = 0.22;
  return (
    <div style={{ position: "absolute", right: 46, top: 40, width: 1920 * SC, height: 1080 * SC, transform: `scale(${s}) rotate(1.5deg)`, transformOrigin: "100% 0%", border: "5px solid #fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,.5)", background: "#e6d8b6", zIndex: 40 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${SC})`, transformOrigin: "0 0" }}>
        <MapLayer c={c} />
        {children?.(c)}
        {title && <div style={{ position: "absolute", left: 60, top: 40, fontFamily: HAND, fontSize: 96, color: "#26314a" }}>{title}</div>}
      </div>
    </div>
  );
};
// trazo de canal (azul con borde) parcial
export const CanalLine: React.FC<{ c: Cam; pts: LL; k: number; w?: number; color?: string; op?: number }> = ({ c, pts, k, w = 10, color = "#4f9fe0", op = 1 }) => {
  if (k <= 0) return null;
  const p = partial(smooth(pts).map(([lo, la]) => proj(c, lo, la)), k);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <path d={dpath(p)} fill="none" stroke="#3b2a17" strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <path d={dpath(p)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
