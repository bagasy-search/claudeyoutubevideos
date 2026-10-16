// Suez — prueba de 20 s en el estilo del minuto 1 de Fortune: un solo plano-secuencia sobre el mapa antiguo,
// cada frase = un movimiento nuevo. Coreografiado a mano sobre los tiempos de palabra de Groq (voz Fish fortune_us).
import React from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import sfx from "./sfx.json";

import { sf } from "./sf";
const Audio = (_: any) => null; // farm: el audio final sale del WAV máster premezclado

const { fontFamily: SANS } = loadFont("normal", { weights: ["700", "800", "900"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["700"] });

export const FPS = 30;
export const SUEZ_END = 21.0;
// mismo mundo que Fortune: 30 px por grado, lon -200..60, lat 80..-62
const PPD = 30, ML = -200, MT = 80, MW = 7800, MH = 4260;
const P = (lon: number, lat: number): [number, number] => [(lon - ML) * PPD, (MT - lat) * PPD];
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, t0: number, damping = 11) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.6 } });
const fadeOut = (t: number, t1: number, d = 0.3) => interpolate(t, [t1 - d, t1], [1, 0], clamp);
const vis = (t: number, t0: number, t1: number) => t >= t0 - 0.05 && t <= t1 + 0.05;
const ramp = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

// ───────── cámara: [t, lon, lat, zoom] — nunca quieta ─────────
const KEYS: [number, number, number, number][] = [
  [0.0, 24, 33, 0.62],
  [1.3, 29, 32, 0.95],   // "the most powerful rulers on Earth"
  [2.9, 30.5, 31.2, 1.1],
  [4.2, 32.35, 30.6, 13.5], // "stared at the same strip of sand"
  [5.7, 32.4, 30.6, 14.5],
  [6.3, 31.85, 30.6, 15.5], // "A pharaoh started digging"
  [8.4, 31.95, 30.55, 16.5],
  [9.1, 32.3, 30.32, 14.0], // "A Persian king finished it"
  [10.4, 32.33, 30.3, 14.6],
  [11.6, 32.3, 30.35, 12.0], // "the desert buried it"
  [12.6, 32.3, 30.4, 11.5],
  [13.6, 31.8, 30.3, 7.0],  // "Then Napoleon's engineers"
  [16.9, 31.9, 30.35, 7.6],
  [17.6, 32.33, 31.05, 17.0], // "So how did one stubborn Frenchman"
  [19.5, 32.42, 30.35, 15.5],
  [21.0, 32.45, 30.15, 15.0],
];
function cam(t: number) {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const [ax, ay] = P(a[1], a[2]), [bx, by] = P(b[1], b[2]);
  const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, z };
}
type Cam = ReturnType<typeof cam>;
const proj = (c: Cam, lon: number, lat: number): [number, number] => { const [wx, wy] = P(lon, lat); return [(wx - c.x) * c.z + 960, (wy - c.y) * c.z + 540]; };

// ───────── mapa: mundo antiguo de Fortune + inset de relieve del istmo (Terrarium z9) ─────────
const INSET = { l: 29, r: 35.5, t: 33, b: 27 };
const MapLayer: React.FC<{ c: Cam }> = ({ c }) => {
  const [x0, y0] = proj(c, ML, MT);
  const [ix, iy] = proj(c, INSET.l, INSET.t), [ix1, iy1] = proj(c, INSET.r, INSET.b);
  const insetOp = interpolate(c.z, [1.4, 3.2], [0, 1], clamp);
  const mask = `radial-gradient(ellipse closest-side at center, #000 ${interpolate(c.z, [3, 9], [55, 82], clamp)}%, transparent 100%)`;
  return (
    <>
      {c.z < 12 && <Img src={sf("world_antique.jpg")} style={{ position: "absolute", left: x0, top: y0, width: MW * c.z, height: MH * c.z }} />}
      {insetOp > 0 && <Img src={sf("suez/inset.jpg")} style={{ position: "absolute", left: ix, top: iy, width: ix1 - ix, height: iy1 - iy, opacity: insetOp, WebkitMaskImage: mask, maskImage: mask }} />}
    </>
  );
};

// polilínea parcial (k = 0..1 del largo total), en coordenadas de pantalla
function partial(pts: [number, number][], k: number) {
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
const d = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");

// canal de los faraones (Bubastis → Wadi Tumilat → lagos Amargos → Suez); Necho llega hasta ~32.0
const NECHO: [number, number][] = [[31.51, 30.57], [31.62, 30.555], [31.78, 30.55], [31.9, 30.56], [32.0, 30.555]];
const DARIUS: [number, number][] = [[32.0, 30.555], [32.1, 30.55], [32.2, 30.56], [32.28, 30.55], [32.33, 30.45], [32.38, 30.34], [32.45, 30.18], [32.52, 30.04], [32.55, 29.96]];
// canal moderno Port Said → Suez
const MODERN: [number, number][] = [[32.31, 31.26], [32.32, 31.05], [32.32, 30.85], [32.3, 30.66], [32.3, 30.56], [32.35, 30.45], [32.4, 30.33], [32.47, 30.18], [32.53, 30.03], [32.56, 29.93]];

const Canals: React.FC<{ c: Cam; t: number; f: number }> = ({ c, t, f }) => {
  const pj = (a: [number, number][]) => a.map(([lo, la]) => proj(c, lo, la));
  const kN = ramp(t, 6.25, 7.45, Easing.out(Easing.quad));
  const stall = t > 7.45 && t < 7.9 ? Math.sin((t - 7.45) * 70) * 4 * (1 - (t - 7.45) / 0.45) : 0; // la pala se traba
  const kD = ramp(t, 9.0, 10.15, Easing.inOut(Easing.quad));
  const bury = ramp(t, 10.6, 11.7);
  const allOff = 1 - ramp(t, 12.3, 12.9);
  const kM = ramp(t, 17.15, 19.6, Easing.inOut(Easing.sin));
  const necho = pj(NECHO).map(([x, y]) => [x + stall, y] as [number, number]);
  const sand = (a: string, b: string) => (bury > 0 ? b : a);
  const w = Math.max(6, c.z * 0.95);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {/* isthmus: la franja de arena que todos miraban */}
      {vis(t, 3.4, 5.9) && (() => {
        const k = ramp(t, 3.5, 4.3) * fadeOut(t, 5.9, 0.4);
        const band = pj([[32.05, 31.2], [32.62, 31.2], [32.7, 29.98], [32.38, 29.98]]);
        return <path d={d(band) + "Z"} fill="#ffd23a" fillOpacity={0.22 * k + 0.08 * k * Math.sin(f / 4)} stroke="#fff6cf" strokeWidth={4} strokeOpacity={k} strokeDasharray="14 10" strokeDashoffset={-f * 1.5} />;
      })()}
      {allOff > 0 && <g opacity={allOff}>
        <path d={d(partial(necho, kN))} fill="none" stroke="#3b2a17" strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        <path d={d(partial(necho, kN))} fill="none" stroke={sand("#4f9fe0", "#c9a66b")} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={1 - 0.65 * bury} />
        <path d={d(partial(pj(DARIUS), kD))} fill="none" stroke="#3b2a17" strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" opacity={0.55 * (1 - bury * 0.6)} />
        <path d={d(partial(pj(DARIUS), kD))} fill="none" stroke={sand("#4f9fe0", "#c9a66b")} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={1 - 0.65 * bury}
          strokeDasharray={bury > 0 ? `${18 * (1 - bury) + 4} ${10 + 30 * bury}` : undefined} />
        {/* punta de la pala avanzando */}
        {kN > 0 && kN < 1 && (() => { const p = partial(necho, kN); const [x, y] = p[p.length - 1]; return <circle cx={x} cy={y} r={w * 0.9} fill="#fff" />; })()}
        {kD > 0 && kD < 1 && (() => { const p = partial(pj(DARIUS), kD); const [x, y] = p[p.length - 1]; return <circle cx={x} cy={y} r={w * 0.9} fill="#fff" />; })()}
      </g>}
      {/* canal moderno: trazo blanco que corta el istmo */}
      {kM > 0 && <>
        <path d={d(partial(pj(MODERN), kM))} fill="none" stroke="#1d3554" strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
        <path d={d(partial(pj(MODERN), kM))} fill="none" stroke="#fff" strokeWidth={w * 0.9} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px #8fd0ff)" }} />
      </>}
    </svg>
  );
};

// ───────── capas de pantalla ─────────
const Tag: React.FC<{ c: Cam; f: number; t: number; lon: number; lat: number; t0: number; t1: number; text: string; dy?: number; bg?: string; size?: number }> = ({ c, f, t, lon, lat, t0, t1, text, dy = 0, bg = "#111", size = 30 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, lon, lat);
  const s = pop(f, t0) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x, top: y + dy, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 0.6, padding: "6px 14px 7px", borderRadius: 6, border: "2px solid rgba(255,255,255,.85)", boxShadow: "0 6px 16px rgba(0,0,0,.45)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
      {text}
    </div>
  );
};
const Icon: React.FC<{ c: Cam; f: number; t: number; src: string; lon: number; lat: number; t0: number; t1: number; size?: number; flip?: boolean }> = ({ c, f, t, src, lon, lat, t0, t1, size = 100, flip }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, lon, lat);
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  return <Img src={sf(`icons/${src}.png`)} style={{ position: "absolute", left: x, top: y + Math.sin((f + lon * 9) / 12) * 4, width: size, transform: `translate(-50%,-80%) scale(${flip ? -s : s},${s})`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.4))" }} />;
};
const Flag: React.FC<{ c: Cam; f: number; t: number; cc: string; lon: number; lat: number; t0: number; t1: number; w?: number; dx?: number; dy?: number }> = ({ c, f, t, cc, lon, lat, t0, t1, w = 70, dx = 0, dy = 0 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, lon, lat);
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  return <Img src={sf(`flag_${cc}.png`)} style={{ position: "absolute", left: x + dx, top: y + dy, width: w, transform: `translate(-50%,-50%) scale(${s}) rotate(-4deg)`, border: "3px solid #fff", borderRadius: 4, boxShadow: "0 6px 14px rgba(0,0,0,.45)" }} />;
};

// 4 imperios → flechas que convergen en el istmo ("the same strip of sand")
const RULERS: { name: string; when: string; lon: number; lat: number; t0: number; bg: string }[] = [
  { name: "Pharaohs", when: "600 BC", lon: 31.2, lat: 25.5, t0: 1.45, bg: "#9c6a1c" },
  { name: "Persia", when: "500 BC", lon: 53, lat: 32.5, t0: 1.75, bg: "#2d6a5a" },
  { name: "Rome", when: "100 AD", lon: 13.5, lat: 40.5, t0: 2.05, bg: "#8e2a22" },
  { name: "Napoleon", when: "1799", lon: 7, lat: 43.5, t0: 2.35, bg: "#24427a" },
];
const Rulers: React.FC<{ c: Cam; f: number; t: number }> = ({ c, f, t }) => {
  if (!vis(t, 1.4, 4.0)) return null;
  const [sx, sy] = proj(c, 32.35, 30.6);
  const out = fadeOut(t, 3.9, 0.5);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {RULERS.map((r, i) => {
          const [x, y] = proj(c, r.lon, r.lat);
          const k = ramp(t, r.t0 + 0.6, r.t0 + 1.2) * out;
          if (k <= 0) return null;
          const mx = (x + sx) / 2 + (sy - y) * 0.18, my = (y + sy) / 2 - (sx - x) * 0.18;
          return <path key={i} d={`M${x},${y} Q${mx},${my} ${sx},${sy}`} fill="none" stroke="#fff" strokeWidth={5} pathLength={1000}
            style={{ strokeDasharray: `${k * 1000} 1000`, filter: "drop-shadow(0 3px 4px rgba(0,0,0,.45))", opacity: Math.min(1, k * 3) }} />;
        })}
        {t > 2.5 && <circle cx={sx} cy={sy} r={interpolate(t, [2.5, 3.6], [0, 38], clamp)} fill="none" stroke="#ffd23a" strokeWidth={7} opacity={out * (0.7 + 0.3 * Math.sin(f / 3))} />}
      </svg>
      {RULERS.map((r, i) => {
        const [x, y] = proj(c, r.lon, r.lat);
        const s = pop(f, r.t0, 10) * out;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, textAlign: "center" }}>
            <div style={{ background: r.bg, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 30, padding: "6px 16px 7px", borderRadius: 6, border: "3px solid #fff", boxShadow: "0 8px 18px rgba(0,0,0,.45)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{r.name}</div>
            <div style={{ marginTop: 6, fontFamily: HAND, fontSize: 40, color: "#2a1d0e", textShadow: "0 0 6px #f3e6c4, 0 0 12px #f3e6c4" }}>{r.when}</div>
          </div>
        );
      })}
    </>
  );
};

// portal circular a una imagen real (dominio público), anclado en pantalla
const Portal: React.FC<{ t: number; src: string; t0: number; t1: number; x: number; y: number; r: number; full?: boolean; pos?: string; caption?: string; f: number }> = ({ t, src, t0, t1, x, y, r, full, pos = "50% 50%", caption, f }) => {
  const kin = ramp(t, t0, t0 + 0.45), kout = ramp(t, t1 - 0.4, t1);
  const k = Math.min(kin, 1 - kout);
  if (k <= 0) return null;
  const R = full ? interpolate(t, [t0, t0 + 0.55, t1 - 0.5, t1], [0, 1300, 1300, 0], { ...clamp, easing: ease }) : r * k;
  const ring = full ? interpolate(t, [t0, t0 + 0.25, t0 + 0.55], [1, 1, 0], clamp) + interpolate(t, [t1 - 0.4, t1 - 0.2], [0, 1], clamp) : 1;
  const prog = (t - t0) / (t1 - t0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: `circle(${R}px at ${x}px ${y}px)` }}>
        <Img src={sf(src)} style={full
          ? { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", objectPosition: pos, transform: `scale(${1.16 - 0.12 * prog})`, transformOrigin: "30% 60%" }
          : { position: "absolute", left: x - r * 1.15, top: y - r * 1.15, width: r * 2.3, height: r * 2.3, objectFit: "cover", objectPosition: pos, transform: `scale(${1.12 - 0.1 * prog})` }} />
        <AbsoluteFill style={{ background: full ? "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.4) 100%)" : "radial-gradient(circle at 50% 50%, transparent 60%, rgba(40,25,10,.35) 100%)", left: 0 }} />
      </AbsoluteFill>
      {ring > 0 && <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", border: "7px solid #fff", opacity: Math.min(1, ring), boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />}
      {caption && !full && <div style={{ position: "absolute", left: x, top: y + r * k + 26, transform: `translate(-50%,0) scale(${pop(f, t0 + 0.2)})`, fontFamily: HAND, fontSize: 40, color: "#2a1d0e", textShadow: "0 0 6px #f3e6c4, 0 0 14px #f3e6c4", whiteSpace: "nowrap", opacity: 1 - kout }}>{caption}</div>}
    </AbsoluteFill>
  );
};

// sello rojo que cae
const Stamp: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; text: string; size?: number; rot?: number }> = ({ f, t, t0, t1, x, y, text, size = 78, rot = -10 }) => {
  if (!vis(t, t0, t1)) return null;
  const k = ramp(t, t0, t0 + 0.14, Easing.in(Easing.quad));
  const s = interpolate(k, [0, 1], [2.4, 1]) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: k, border: `${size * 0.09}px solid #d4241c`, color: "#d4241c", fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 4, padding: `0 ${size * 0.3}px`, borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", mixBlendMode: "multiply", background: "rgba(255,240,230,.25)" }}>{text}</div>
  );
};

// tormenta de arena que entierra el canal (partículas deterministas, sin feTurbulence)
const SandStorm: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const k = interpolate(t, [10.45, 10.9, 11.7, 12.4], [0, 1, 1, 0], clamp);
  if (k <= 0) return null;
  const N = 46;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: k }}>
      <AbsoluteFill style={{ background: "linear-gradient(100deg, rgba(214,180,120,.0) 0%, rgba(214,180,120,.45) 40%, rgba(205,165,100,.55) 70%, rgba(214,180,120,.2) 100%)" }} />
      {Array.from({ length: N }).map((_, i) => {
        const r1 = Math.sin(i * 12.9898) * 43758.5453, rr = r1 - Math.floor(r1);
        const r2 = Math.sin(i * 78.233) * 12345.678, r3 = r2 - Math.floor(r2);
        const speed = 28 + rr * 40;
        const x = ((rr * 2400 + f * speed) % 2600) - 340;
        const y = r3 * 1080;
        const w = 260 + rr * 520, h = 40 + r3 * 90;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: "50%", background: i % 3 ? "#d8b678" : "#c99d5c", opacity: 0.35 + 0.3 * r3, filter: `blur(${14 + rr * 18}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

// corte de niveles del mar: lo que calcularon los ingenieros de Napoleón (Le Père, 1799: Mar Rojo ~10 m más alto)
const SeaLevels: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 13) * fadeOut(t, t1, 0.35);
  const rise = ramp(t, 14.15, 14.9, Easing.out(Easing.back(1.4)));
  const fall = ramp(t, 15.85, 16.5, Easing.inOut(Easing.cubic));
  const lift = 120 * rise * (1 - fall);
  const base = 250, BW = 330;
  const write = (t0: number, d: number) => ramp(t, t0, t0 + d, Easing.linear);
  const handW = write(14.3, 0.55);
  return (
    <div style={{ position: "absolute", left: 960, top: 560, width: 1100, height: 560, transform: `translate(-50%,-50%) scale(${s}) rotate(-1deg)`, background: "linear-gradient(#fbf6e6,#efe4c4)", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 18px 40px rgba(0,0,0,.45)",
      backgroundImage: "repeating-linear-gradient(transparent 0 38px, rgba(80,110,160,.18) 38px 39px), linear-gradient(#fbf6e6,#efe4c4)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 40, top: 22, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#26314a", letterSpacing: 1 }}>NAPOLEON'S SURVEY · 1799</div>
      {/* tierra del istmo */}
      <div style={{ position: "absolute", left: 40 + BW, top: base - 60, width: 1100 - 80 - 2 * BW, height: 400, background: "#c9a66b", borderTop: "5px solid #8a6a3a" }} />
      {/* Mediterráneo */}
      <div style={{ position: "absolute", left: 40, top: base, width: BW, height: 400, background: "linear-gradient(#5a9bd6,#2f6fb8)", borderTop: "5px solid #dff0ff" }} />
      <div style={{ position: "absolute", left: 40 + BW / 2, top: base + 120, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>MEDITERRANEAN</div>
      {/* Mar Rojo, sube (el error) */}
      <div style={{ position: "absolute", left: 1100 - 40 - BW, top: base - lift, width: BW, height: 400 + lift, background: "linear-gradient(#5a9bd6,#2f6fb8)", borderTop: "5px solid #dff0ff" }} />
      <div style={{ position: "absolute", left: 1100 - 40 - BW / 2, top: base + 120, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>RED SEA</div>
      {/* nivel del Mediterráneo como referencia + cota a mano sobre el Mar Rojo */}
      <svg width={1100} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><marker id="ar" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fff" /></marker></defs>
        <line x1={40} y1={base} x2={1060} y2={base} stroke="#26314a" strokeWidth={3} strokeDasharray="12 9" opacity={0.75} />
        {rise > 0.05 && <line x1={895} y1={base - 4} x2={895} y2={base - lift + 16} stroke="#fff" strokeWidth={5} markerEnd="url(#ar)" opacity={Math.min(1, lift / 40)} />}
      </svg>
      <div style={{ position: "absolute", left: 895, top: base - lift - 92, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 64, color: "#26314a", clipPath: `inset(0 ${100 - handW * 100}% 0 0)`, whiteSpace: "nowrap" }}>
        +10 m higher?
        {fall > 0 && <div style={{ position: "absolute", left: -6, top: 40, height: 6, width: `${fall * 104}%`, background: "#d4241c", borderRadius: 3, transform: "rotate(-4deg)" }} />}
      </div>
    </div>
  );
};

// nota de papel con el año (arriba a la izquierda) + reloj de arena, como el minuto 1
const YEARS: [number, string][] = [[6.0, "600 BC"], [8.85, "500 BC"], [12.65, "1799"], [17.15, "1859"]];
const YearNote: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const cur = [...YEARS].reverse().find(([s]) => s <= t);
  if (!cur) return null;
  const [last, label] = cur;
  const s = pop(f, last, 9);
  const flip = interpolate(t - last, [0, 0.5], [180, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={sf("icons/hourglass.png")} style={{ width: 74, transform: `rotate(${flip}deg)`, filter: "drop-shadow(0 6px 8px rgba(0,0,0,.4))" }} />
      <div style={{ transform: `scale(${s}) rotate(-2deg)`, border: "3px solid #fff", boxShadow: "0 8px 18px rgba(0,0,0,.35)", padding: "0 26px", height: 84, display: "flex", alignItems: "center",
        backgroundImage: "repeating-linear-gradient(transparent 0 26px, rgba(80,110,160,.25) 26px 27px), linear-gradient(#fbf6e6,#efe4c4)", backgroundColor: "#f6efd9", fontFamily: HAND, fontSize: 62, color: "#26314a" }}>{label}</div>
    </div>
  );
};

const CloudIntro: React.FC<{ t: number }> = ({ t }) => {
  const k = ramp(t, 0, 1.25, Easing.in(Easing.quad));
  if (k >= 1) return null;
  const C: [number, number, number][] = [[200, 300, 1.2], [1500, 250, 1.1], [860, 700, 1.4], [300, 880, 1.0], [1650, 820, 1.2], [960, 380, 1.5]];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {C.map(([x, y, s], i) => (
        <Img key={i} src={sf(`icons/${i % 2 ? "cloud2" : "cloud1"}.png`)} style={{ position: "absolute", left: x + (x - 960) * k * 1.8, top: y + (y - 540) * k * 1.8, width: 1100 * s * (1 + k * 2), transform: "translate(-50%,-50%)", opacity: 1 - k }} />
      ))}
    </AbsoluteFill>
  );
};

const BigWord: React.FC<{ f: number; t: number; t0: number; t1: number; text: React.ReactNode; x?: number; y?: number; size?: number }> = ({ f, t, t0, t1, text, x = 960, y = 170, size = 130 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 8) * fadeOut(t, t1, 0.25);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 4px 0 #1b1b1b, 0 8px 22px rgba(0,0,0,.55), 0 0 2px #000" }}>{text}</div>;
};

// barco moviéndose por el canal moderno al final
const ShipAlong: React.FC<{ c: Cam; t: number; f: number }> = ({ c, t, f }) => {
  const k = ramp(t, 17.5, 21.2, Easing.linear);
  if (k <= 0) return null;
  const p = partial(MODERN.map(([lo, la]) => proj(c, lo, la)), Math.min(k, 0.999));
  const [x, y] = p[p.length - 1];
  return <Img src={sf("icons/ship.png")} style={{ position: "absolute", left: x, top: y + Math.sin(f / 6) * 3, width: 120, transform: `translate(-50%,-75%) scale(${pop(f, 17.5, 10)})`, filter: "drop-shadow(0 8px 8px rgba(0,0,0,.45))" }} />;
};

type Ev = [number, string, number, number];
export const SUEZ_SFX = sfx as Ev[];
const SfxTrack: React.FC = () => (
  <>
    {SUEZ_SFX.map(([t0, file, vol, dur], i) => (
      <Sequence key={i} from={Math.round(t0 * FPS)} durationInFrames={Math.round(dur * FPS)}>
        <Audio src={sf(`sfx/${file}.wav`)} volume={(fr) => vol * interpolate(fr, [dur * FPS - 6, dur * FPS], [1, 0], clamp)} />
      </Sequence>
    ))}
  </>
);

export const Suez: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const f = fr;
  const c = cam(t);
  // motion blur direccional proporcional a la velocidad de la cámara (igual que el minuto 1)
  const c0 = cam(Math.max(0, t - 1 / FPS));
  const vx = Math.abs(c.x - c0.x) * c.z, vy = Math.abs(c.y - c0.y) * c.z, vz = Math.abs(Math.log(c.z / c0.z)) * 900;
  const bz = Math.min(5, vz * 0.25);
  const bx = Math.min(16, vx * 0.3) + bz, by = Math.min(16, vy * 0.3) + bz;
  const blurOn = bx + by > 0.6;
  const dim = interpolate(t, [13.9, 14.2, 16.7, 17.1], [0, 0.35, 0.35, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#d9c9a0", overflow: "hidden" }}>
      <Audio src={sf("suez/voz.wav")} />
      <SfxTrack />
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: blurOn ? "url(#mb)" : undefined }}>
        <MapLayer c={c} />
        <Canals c={c} t={t} f={f} />
      </AbsoluteFill>

      {/* 0-4 s: todos los imperios miran el mismo punto */}
      <Rulers c={c} f={f} t={t} />
      <Tag c={c} f={f} t={t} lon={31.75} lat={31.55} t0={4.1} t1={5.9} text="Mediterranean" bg="#2f6fb8" size={28} />
      <Tag c={c} f={f} t={t} lon={32.95} lat={29.75} t0={4.3} t1={5.9} text="Red Sea" bg="#2f6fb8" size={28} />
      <Tag c={c} f={f} t={t} lon={32.95} lat={30.62} t0={4.55} t1={5.9} text="120 km of sand" bg="#9c6a1c" size={30} />
      <Icon c={c} f={f} t={t} src="ship" lon={32.0} lat={31.42} t0={4.2} t1={5.9} size={110} />
      <Icon c={c} f={f} t={t} src="ship" lon={32.72} lat={29.85} t0={4.4} t1={5.9} size={110} flip />

      {/* Necho II */}
      <Portal t={t} f={f} src="suez/necho.jpg" t0={5.95} t1={8.6} x={400} y={330} r={220} pos="70% 50%" caption="Necho II" />
      <Tag c={c} f={f} t={t} lon={31.62} lat={30.7} t0={6.3} t1={8.6} text="Pharaoh's canal" bg="#9c6a1c" size={28} />
      <Stamp f={f} t={t} t0={7.55} t1={8.6} x={1220} y={420} text="Gave up" />

      {/* Darío I */}
      <Portal t={t} f={f} src="suez/darius.jpg" t0={8.85} t1={11.0} x={1520} y={330} r={220} pos="50% 30%" caption="Darius I" />
      <Tag c={c} f={f} t={t} lon={32.62} lat={30.15} t0={10.0} t1={10.9} text="Finished ✓" bg="#2a7d2e" size={30} />
      <SandStorm t={t} f={f} />
      <BigWord f={f} t={t} t0={11.05} t1={12.4} text="BURIED" />

      {/* Napoleón */}
      <Portal t={t} f={f} src="suez/gerome.jpg" t0={12.6} t1={14.15} x={960} y={540} r={0} full pos="25% 60%" />
      <AbsoluteFill style={{ background: "#1a1208", opacity: dim, pointerEvents: "none" }} />
      <SeaLevels f={f} t={t} t0={14.05} t1={17.05} />
      <Stamp f={f} t={t} t0={15.3} t1={17.05} x={930} y={430} text="Wrong" size={96} rot={-12} />
      <BigWord f={f} t={t} t0={15.95} t1={17.05} text={<span>BY <span style={{ color: "#ffd23a" }}>30 FT</span></span>} y={930} size={110} />

      {/* el francés terco */}
      <ShipAlong c={c} t={t} f={f} />
      <Flag c={c} f={f} t={t} cc="fr" lon={32.05} lat={30.95} t0={18.1} t1={21.0} w={84} />
      <Tag c={c} f={f} t={t} lon={32.05} lat={30.82} t0={18.25} t1={21.0} text="Ferdinand de Lesseps" size={28} />
      <BigWord f={f} t={t} t0={19.35} t1={21.0} text={<span style={{ color: "#ffd23a" }}>?</span>} x={1380} y={500} size={300} />

      <YearNote f={f} t={t} />
      <CloudIntro t={t} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.28) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
