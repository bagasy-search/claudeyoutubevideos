// Motor de la v5: lee PLAN (plan.ts) y dibuja cada escena con su estilo (S0-S9). Tiempo = real (voz_v5.wav).
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as lSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as lAnton } from "@remotion/google-fonts/Anton";
import { loadFont as lType } from "@remotion/google-fonts/SpecialElite";
import { loadFont as lHand } from "@remotion/google-fonts/Caveat";
import { loadFont as lPlay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as lSans } from "@remotion/google-fonts/Montserrat";
import { PLAN, Scene, Beat, Style } from "./plan";
import LINES from "./lines.json";
import CAPS from "./captions.json";
import tmIntro from "./tm_intro.json";
import GDP from "../gdp.json";
import { Main } from "../Main";
import { EvidenceDesk, DeskScene } from "../desk";
import { Terrain3D, useTerrainTextures } from "../v3";

import { sf } from "../sf";
const Audio = (_: any) => null; // farm: el audio final sale del WAV máster premezclado

const { fontFamily: SERIF } = lSerif("italic");
const { fontFamily: ANTON } = lAnton();
const { fontFamily: TYPE } = lType();
const { fontFamily: HAND } = lHand("normal", { weights: ["700"] });
const { fontFamily: PLAY } = lPlay("normal", { weights: ["700", "900"] });
const { fontFamily: SANS } = lSans("normal", { weights: ["700", "800", "900"] });

export const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
type Line = { i: number; text: string; start: number; end: number };
type Cap = { text: string; startMs: number; endMs: number };
const LN = LINES as Line[];
const CP = CAPS as Cap[];
export const TOTAL = Math.max(...LN.map((l) => l.end)) + 1.2;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

// ── tiempos ──
export const wordTime = (l: number, w?: string) => {
  const L = LN[l];
  if (!w) return L.start;
  const n = norm(w);
  const c = CP.find((c) => c.startMs / 1000 >= L.start - 0.05 && c.startMs / 1000 <= L.end + 0.05 && norm(c.text).startsWith(n));
  return c ? c.startMs / 1000 : L.start;
};
type RScene = Scene & { t0: number; t1: number; bt: (Beat & { t: number })[]; idx: number };
const SC: RScene[] = PLAN.map((s, idx) => ({ ...s, idx, t0: idx === 0 ? 0 : LN[s.from].start - 0.08, t1: 0, bt: s.beats.map((b) => ({ ...b, t: Math.max(LN[s.from].start, wordTime(b.l, b.w)) })).sort((a, b) => a.t - b.t) }));
SC.forEach((s, i) => (s.t1 = i + 1 < SC.length ? SC[i + 1].t0 : TOTAL));
export const INTRO_END = SC[1].t0;

const pop = (t: number, t0: number, damping = 12) => spring({ frame: (t - t0) * FPS, fps: FPS, config: { damping, stiffness: 170, mass: 0.6 } });
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ── imagen protagonista con Ken Burns y fundido entre cambios ──
const heroList = (s: RScene) => {
  const imgs = s.bt.filter((b) => b.k === "img") as (Beat & { k: "img"; t: number })[];
  if (s.bg && (!imgs.length || imgs[0].t > s.t0 + 0.3)) imgs.unshift({ k: "img", l: s.from, src: s.bg, t: s.t0 } as any);
  return imgs;
};
const KB: React.FC<{ src: string; t: number; t0: number; t1: number; i: number; style?: React.CSSProperties; imgStyle?: React.CSSProperties }> = ({ src, t, t0, t1, i, style, imgStyle }) => {
  const k = interpolate(t, [t0, t1 + 0.6], [0, 1], clamp);
  const dir = i % 4;
  const sc = dir % 2 ? 1.16 - 0.1 * k : 1.06 + 0.1 * k;
  const dx = (dir < 2 ? -1 : 1) * 30 * (k - 0.5), dy = (dir === 1 || dir === 2 ? 1 : -1) * 16 * (k - 0.5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${dx}px,${dy}px) scale(${sc})`, ...imgStyle }} />
    </AbsoluteFill>
  );
};
const Heroes: React.FC<{ s: RScene; t: number; render?: (src: string, i: number, t0: number, t1: number, op: number, b: any) => React.ReactNode }> = ({ s, t, render }) => {
  const H = heroList(s);
  return (
    <>
      {H.map((h, i) => {
        const t1 = i + 1 < H.length ? H[i + 1].t : s.t1;
        if (t < h.t - 0.05 || t > t1 + 0.5) return null;
        const op = i === 0 ? 1 : interpolate(t, [h.t, h.t + 0.35], [0, 1], clamp);
        return <React.Fragment key={i}>{render ? render(h.src, i, h.t, t1, op, h) : <KB src={h.src} t={t} t0={h.t} t1={t1} i={i} style={{ opacity: op }} />}</React.Fragment>;
      })}
    </>
  );
};

// ── ventanas de los estímulos (no-imagen) ──
const overlays = (s: RScene) => {
  const O = s.bt.filter((b) => b.k !== "img" && b.k !== "draw");
  return O.map((b, i) => {
    const next2 = O[i + 2]?.t ?? Infinity, next1 = O[i + 1]?.t ?? Infinity;
    const solo = b.k === "big" || b.k === "quote" || b.k === "chart";
    const end = Math.min(b.t + (b.k === "chart" ? 6 : 4.2), solo ? next1 : next2, s.t1 - 0.05);
    return { b, t0: b.t, t1: Math.max(b.t + 1.2, end), slot: i % 2 };
  });
};
const env = (t: number, t0: number, t1: number) => Math.min(interpolate(t, [t0, t0 + 0.25], [0, 1], clamp), interpolate(t, [t1 - 0.25, t1], [1, 0], clamp));

// ── piezas comunes ──
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const countVal = (t: number, t0: number, to: number) => to * interpolate(t, [t0, t0 + 1.3], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const Hi: React.FC<{ text: string; hi?: string; color: string; extra?: React.CSSProperties }> = ({ text, hi, color, extra }) => {
  if (!hi || !text.includes(hi)) return <>{text}</>;
  const [a, ...rest] = text.split(hi);
  return <>{a}<span style={{ color, ...extra }}>{hi}</span>{rest.join(hi)}</>;
};
const ring = (rx: number, ry: number) => {
  let d = ""; for (let i = 0; i <= 64; i++) { const a = (i / 64) * Math.PI * 2.12 - 0.4, w = 1 + 0.05 * Math.sin(a * 2 + 0.7) + 0.025 * Math.sin(a * 3 + 2); d += `${i ? "L" : "M"}${(Math.cos(a) * rx * w).toFixed(1)},${(Math.sin(a) * ry * w).toFixed(1)}`; }
  return d;
};
const Star: React.FC<{ size: number; color: string; points?: number; spin: number; children?: React.ReactNode; textColor?: string; font?: string; fs?: number }> = ({ size, color, points = 16, spin, children, textColor = "#111", font = ANTON, fs = 54 }) => {
  let d = ""; for (let i = 0; i < points * 2; i++) { const r = i % 2 ? size * 0.36 : size * 0.5, a = (i / (points * 2)) * Math.PI * 2; d += `${i ? "L" : "M"}${(size / 2 + Math.cos(a) * r).toFixed(1)},${(size / 2 + Math.sin(a) * r).toFixed(1)}`; }
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: `rotate(${spin}deg)`, filter: "drop-shadow(0 10px 18px rgba(0,0,0,.45))" }}><path d={d + "Z"} fill={color} /></svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: font, fontSize: fs, color: textColor, lineHeight: 1, padding: size * 0.18, transform: "rotate(-8deg)" }}>{children}</div>
    </div>
  );
};
const ICONS: Record<string, string> = {
  drain: "M20 110 Q60 80 100 110 T180 110 M20 140 Q60 110 100 140 T180 140 M20 170 Q60 140 100 170 T180 170",
  fence: "M30 60 V175 M80 60 V175 M130 60 V175 M180 60 V175 M15 95 H195 M15 145 H195 M30 60 L22 74 M30 60 L38 74 M80 60 L72 74 M80 60 L88 74 M130 60 L122 74 M130 60 L138 74 M180 60 L172 74 M180 60 L188 74",
  tractor: "M40 150 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0 M140 160 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0 M70 120 V70 H120 L135 120 H178 V152 M120 70 V120 M150 120 V95",
  tree: "M100 185 V110 M100 140 L70 112 M100 125 L130 98 M100 22 C40 22 40 110 100 110 C160 110 160 22 100 22",
  school: "M30 180 V90 L100 40 L170 90 V180 Z M85 180 V130 H115 V180 M100 40 V12 H124 V24 H100 M50 110 H75 V130 H50 Z M125 110 H150 V130 H125 Z",
  deed: "M45 25 H155 V175 H45 Z M65 55 H135 M65 80 H135 M65 105 H120 M108 148 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M115 160 L110 182 M130 160 L135 182",
  cross: "M80 30 H120 V80 H170 V120 H120 V170 H80 V120 H30 V80 H80 Z",
  wheat: "M100 188 V40 M100 62 q-20 -10 -22 -30 q20 5 22 30 M100 62 q20 -10 22 -30 q-20 5 -22 30 M100 92 q-22 -10 -24 -30 q22 5 24 30 M100 92 q22 -10 24 -30 q-22 5 -24 30 M100 122 q-22 -10 -24 -30 q22 5 24 30 M100 122 q22 -10 24 -30 q-22 5 -24 30",
};

// ── gráficos con datos reales (Maddison 2023 vía OWID) ──
const G = GDP as unknown as Record<string, Record<string, number>>;
const series = (iso: string, y0: number, y1: number) => Object.entries(G[iso]).map(([y, v]) => [Number(y), v] as [number, number]).filter(([y]) => y >= y0 && y <= y1).sort((a, b) => a[0] - b[0]);
const CHARTS: Record<string, { y0: number; y1: number; title: string }> = {
  gdp1890: { y0: 1870, y1: 1890, title: "GDP per person · 1870-1890" },
  gdp1932: { y0: 1900, y1: 1932, title: "GDP per person · 1900-1932" },
  gdp1945: { y0: 1900, y1: 1945, title: "GDP per person · 1900-1945" },
  gdp1990: { y0: 1900, y1: 1990, title: "GDP per person · 1900-1990" },
  gdpfull: { y0: 1870, y1: 2022, title: "GDP per person · 1870-2022" },
};
const Chart: React.FC<{ id: string; t: number; t0: number; dark: boolean }> = ({ id, t, t0, dark }) => {
  if (id === "wheatcrash") {
    const k = interpolate(t, [t0 + 0.2, t0 + 1.6], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return (
      <div style={{ width: 760, padding: 40, background: dark ? "#0b0b0b" : "#fff", borderRadius: 18, boxShadow: "0 20px 50px rgba(0,0,0,.5)", fontFamily: SANS, color: dark ? "#fff" : "#111" }}>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 2 }}>WHEAT PRICES · 1929-1932</div>
        <svg width={680} height={300} style={{ marginTop: 16 }}><path d={`M20,40 L${20 + 640 * k},${40 + 230 * k * k}`} stroke="#e3261c" strokeWidth={14} strokeLinecap="round" fill="none" />
          <path d={`M${20 + 640 * k},${40 + 230 * k * k} l-34,-6 l18,-30 z`} fill="#e3261c" opacity={k > 0.95 ? 1 : 0} /></svg>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#e3261c" }}>COLLAPSE</div>
      </div>
    );
  }
  if (id === "fewhands") {
    const N = 200, few = 3;
    return (
      <div style={{ width: 900, padding: 40, background: dark ? "#0b0b0b" : "#fff", borderRadius: 18, fontFamily: SANS, color: dark ? "#fff" : "#111" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {Array.from({ length: N }).map((_, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: i < few ? "#ff4fa3" : dark ? "#333" : "#ccc", opacity: interpolate(t, [t0 + i * 0.004, t0 + i * 0.004 + 0.2], [0, 1], clamp), boxShadow: i < few ? "0 0 18px #ff4fa3" : undefined }} />)}
        </div>
        <div style={{ marginTop: 22, fontSize: 36, fontWeight: 800 }}><span style={{ color: "#ff4fa3" }}>●</span> wealth & power · <span style={{ opacity: 0.6 }}>● everyone else</span></div>
      </div>
    );
  }
  const c = CHARTS[id]; if (!c) return null;
  const W = 1100, H = 520, L = 90, B = 60;
  const ca = series("CAN", c.y0, c.y1), ar = series("ARG", c.y0, c.y1);
  const vmax = Math.max(...ca.map((p) => p[1]), ...ar.map((p) => p[1])) * 1.1;
  const yr = interpolate(t, [t0 + 0.3, t0 + 2.6], [c.y0, c.y1], { ...clamp, easing: ease });
  const IW = W - 60;
  const X = (y: number) => L + ((y - c.y0) / (c.y1 - c.y0)) * (IW - L - 40), Y = (v: number) => H - B - (v / vmax) * (H - B - 30);
  const path = (s: [number, number][]) => s.filter(([y]) => y <= yr).map(([y, v], i) => `${i ? "L" : "M"}${X(y).toFixed(1)},${Y(v).toFixed(1)}`).join("");
  const last = (s: [number, number][]) => { const f = s.filter(([y]) => y <= yr); return f[f.length - 1]; };
  const lc = last(ca), la = last(ar);
  const fg = dark ? "#fff" : "#111", pinkC = dark ? "#ff4fa3" : "#e3261c", blueC = dark ? "#7fd3ff" : "#2f6fb8";
  return (
    <div style={{ width: W, background: dark ? "#070707" : "#fbf8f1", borderRadius: 20, padding: "26px 30px", boxShadow: "0 24px 60px rgba(0,0,0,.55)", fontFamily: SANS }}>
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2, color: fg }}>{c.title}</div>
      <svg width={IW} height={H} style={{ overflow: "visible" }}>
        {[0.25, 0.5, 0.75, 1].map((k) => <line key={k} x1={L} x2={IW - 20} y1={Y(vmax * k / 1.1)} y2={Y(vmax * k / 1.1)} stroke={fg} strokeOpacity={0.12} />)}
        {[c.y0, Math.round((c.y0 + c.y1) / 2), c.y1].map((y) => <text key={y} x={X(y)} y={H - 18} fill={fg} fillOpacity={0.6} fontSize={24} fontWeight={700} textAnchor={y === c.y1 ? "end" : y === c.y0 ? "start" : "middle"}>{y}</text>)}
        <path d={path(ca)} stroke={blueC} strokeWidth={7} fill="none" strokeLinejoin="round" />
        <path d={path(ar)} stroke={pinkC} strokeWidth={7} fill="none" strokeLinejoin="round" />
        {dark && ca.filter(([y]) => y <= yr && y % 5 === 0).map(([y, v]) => <circle key={"c" + y} cx={X(y)} cy={Y(v)} r={6} fill={blueC} />)}
        {dark && ar.filter(([y]) => y <= yr && y % 5 === 0).map(([y, v]) => <circle key={"a" + y} cx={X(y)} cy={Y(v)} r={6} fill={pinkC} />)}
        {lc && <g transform={`translate(${X(lc[0])},${Y(lc[1])})`}><circle r={11} fill={blueC} /><text x={X(lc[0]) > W * 0.6 ? -14 : 14} y={!la || lc[1] >= la[1] ? -20 : 42} textAnchor={X(lc[0]) > W * 0.6 ? "end" : "start"} fill={blueC} stroke={dark ? "#070707" : "#fbf8f1"} strokeWidth={8} paintOrder="stroke" fontSize={30} fontWeight={900}>Canada ${fmt(lc[1])}</text></g>}
        {la && <g transform={`translate(${X(la[0])},${Y(la[1])})`}><circle r={11} fill={pinkC} /><text x={X(la[0]) > W * 0.6 ? -14 : 14} y={lc && la[1] > lc[1] ? -20 : 42} textAnchor={X(la[0]) > W * 0.6 ? "end" : "start"} fill={pinkC} stroke={dark ? "#070707" : "#fbf8f1"} strokeWidth={8} paintOrder="stroke" fontSize={30} fontWeight={900}>Argentina ${fmt(la[1])}</text></g>}
      </svg>
      <div style={{ fontSize: 18, color: fg, opacity: 0.5 }}>Maddison Project Database 2023 · 2011 US$</div>
    </div>
  );
};

// ── estímulo según estilo ──
const BeatView: React.FC<{ st: Style; b: Beat & { t: number }; t: number; t0: number; t1: number; slot: number }> = ({ st, b, t, t0, t1, slot }) => {
  const e = env(t, t0, t1), p = pop(t, t0), lt = t - t0;
  const pos = (y0: number, y1: number): React.CSSProperties => ({ position: "absolute", left: 960, top: slot ? y1 : y0, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p})`, opacity: e });
  const dark = st === "S5";
  // títulos
  if (b.k === "title") {
    const s: Record<string, React.CSSProperties> = {
      S0: { fontFamily: SANS, fontWeight: 900, fontSize: 92, color: "#fff", letterSpacing: 3, textTransform: "uppercase", textShadow: "0 6px 24px rgba(0,0,0,.7), 0 0 2px #000" },
      S1: { fontFamily: SERIF, fontSize: 130, color: "#2a1b4a", textShadow: "0 4px 30px rgba(255,255,255,.6)" },
      S2: { fontFamily: PLAY, fontWeight: 700, fontSize: 82, color: "#d8b45a", textShadow: "0 0 18px rgba(216,180,90,.35)" },
      S3: { fontFamily: SERIF, fontSize: 104, color: "#fff", textShadow: "0 0 30px rgba(255,255,255,.35)" },
      S4: { fontFamily: ANTON, fontSize: 130, color: "#fff", textShadow: Array.from({ length: 10 }, (_, i) => `${i + 1}px ${i + 1}px 0 #1a1a1a`).join(",") + ", 0 20px 30px rgba(0,0,0,.5)" },
      S5: { fontFamily: ANTON, fontSize: 120, color: "#fff", letterSpacing: 2 },
      S6: { fontFamily: SERIF, fontSize: 112, color: "#1B1A17" },
      S7: { fontFamily: TYPE, fontSize: 62, color: "#b3170c", border: "6px solid #b3170c", padding: "8px 26px", transform: "rotate(-4deg)", textTransform: "uppercase", background: "rgba(236,230,218,.85)" },
      S8: { fontFamily: SERIF, fontSize: 140, color: "#f5d48a", textShadow: "0 0 40px rgba(255,170,60,.55), 0 6px 20px rgba(0,0,0,.6)" },
      S9: {},
    };
    const hiC = st === "S2" ? "#fff6d6" : st === "S6" || st === "S4" ? "#D4170C" : st === "S1" ? "#e0557a" : "#ffd23a";
    return <div style={{ ...pos(st === "S2" ? 150 : 210, st === "S2" ? 150 : 230), whiteSpace: "nowrap", ...s[st] }}><Hi text={b.text} hi={(b as any).hi} color={hiC} extra={st === "S2" ? { fontSize: "1.25em", fontWeight: 900 } : undefined} /></div>;
  }
  if (b.k === "big") {
    const words = b.text.split(" ");
    const base: React.CSSProperties = st === "S1"
      ? { fontFamily: ANTON, fontSize: 170, background: "linear-gradient(90deg,#5b2bd6,#ff6f7d)", WebkitBackgroundClip: "text", color: "transparent" }
      : st === "S6" ? { fontFamily: ANTON, fontSize: 160, color: "#1B1A17" }
      : st === "S7" ? { fontFamily: ANTON, fontSize: 150, color: "#1B1A17", background: "#ECE6DA", padding: "4px 34px", transform: "rotate(-2deg)", boxShadow: "0 14px 30px rgba(0,0,0,.5)" }
      : st === "S8" ? { fontFamily: ANTON, fontSize: 200, color: "#f6e3b4", textShadow: Array.from({ length: 12 }, (_, i) => `0 ${i + 1}px 0 #6b3d12`).join(",") + ", 0 30px 50px rgba(0,0,0,.6)" }
      : { fontFamily: ANTON, fontSize: 170, color: "#fff", textShadow: Array.from({ length: 10 }, (_, i) => `${i + 1}px ${i + 1}px 0 #111`).join(",") + ", 0 26px 40px rgba(0,0,0,.55)" };
    const hiC = st === "S1" ? "#ff4f6d" : st === "S8" ? "#ffb347" : "#e3261c";
    const fs = (base.fontSize as number) * (b.text.length > 22 ? Math.max(0.42, 18 / b.text.length) : 1);
    return (
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * p})`, opacity: e, display: "flex", gap: fs * 0.25, whiteSpace: "nowrap", ...base, fontSize: fs }}>
        {words.map((w, i) => {
          const k = interpolate(lt, [i * 0.09, i * 0.09 + 0.2], [0, 1], clamp);
          const isHi = (b as any).hi && w.includes((b as any).hi);
          return <span key={i} style={{ display: "inline-block", opacity: k, transform: `translateY(${(1 - k) * 40}px)`, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, color: isHi && st !== "S1" ? hiC : undefined }}>{w}</span>;
        })}
      </div>
    );
  }
  if (b.k === "year") {
    const s: React.CSSProperties = st === "S7" ? { fontFamily: PLAY, fontWeight: 900, fontSize: 280, color: "#c0271d", transform: "rotate(-5deg)", textShadow: "0 8px 20px rgba(0,0,0,.35)" }
      : st === "S2" ? { fontFamily: HAND, fontSize: 230, color: "#f4f1e6", opacity: 0.92, textShadow: "0 0 8px rgba(255,255,255,.4)" }
      : st === "S4" ? { fontFamily: ANTON, fontSize: 260, color: "#ffd23a", textShadow: Array.from({ length: 14 }, (_, i) => `${i + 1}px ${i + 1}px 0 #7a5200`).join(",") }
      : st === "S8" ? { fontFamily: ANTON, fontSize: 300, color: "transparent", WebkitTextStroke: "4px #f5d48a", textShadow: "0 0 40px rgba(255,170,60,.5)" }
      : st === "S5" ? { fontFamily: ANTON, fontSize: 260, color: "#ff4fa3" }
      : st === "S6" ? { fontFamily: PLAY, fontWeight: 900, fontSize: 240, color: "#D4170C" }
      : { fontFamily: HAND, fontSize: 120, color: "#26314a", background: "#f6efd9", padding: "0 40px", border: "4px solid #fff", boxShadow: "0 10px 24px rgba(0,0,0,.4)", transform: "rotate(-3deg)" };
    const corner = st === "S0" || st === "S3" || st === "S1";
    return <div style={{ position: "absolute", left: corner ? 260 : slot ? 1500 : 420, top: corner ? 150 : 330, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * p})`, opacity: e, whiteSpace: "nowrap", ...s }}>{b.text}</div>;
  }
  if (b.k === "count") {
    const v = countVal(t, t0, b.to);
    const num = `${b.pre ?? ""}${fmt(v)}${b.suf ?? ""}`;
    const look: React.CSSProperties = st === "S7" ? { fontFamily: TYPE, color: "#1B1A17", background: "#ECE6DA", padding: "20px 40px", boxShadow: "0 14px 30px rgba(0,0,0,.45)", transform: "rotate(2deg)" }
      : st === "S5" ? { fontFamily: ANTON, color: "#ff4fa3" } : st === "S6" ? { fontFamily: ANTON, color: "#1B1A17" }
      : st === "S8" ? { fontFamily: ANTON, color: "#f5d48a", textShadow: "0 0 30px rgba(255,170,60,.5)" }
      : { fontFamily: ANTON, color: "#ffd23a", textShadow: Array.from({ length: 8 }, (_, i) => `${i + 1}px ${i + 1}px 0 #111`).join(",") };
    return (
      <div style={{ ...pos(430, 640), textAlign: "center", ...look }}>
        <div style={{ fontSize: 150, lineHeight: 1 }}>{num}</div>
        <div style={{ fontFamily: st === "S7" ? TYPE : SANS, fontWeight: 800, fontSize: 38, letterSpacing: 2, color: st === "S7" || st === "S6" ? "#1B1A17" : "#fff", textShadow: "0 3px 10px rgba(0,0,0,.6)", textTransform: "uppercase" }}>{b.label}</div>
      </div>
    );
  }
  if (b.k === "note") {
    const side = slot ? { left: 1380, top: 760 } : { left: 540, top: 770 };
    const look: React.CSSProperties =
      st === "S6" ? { fontFamily: SANS, fontWeight: 700, fontSize: 38, color: "#1B1A17", background: "#fff", borderRadius: 60, padding: "18px 34px 18px 80px", boxShadow: "0 10px 30px rgba(0,0,0,.18)" }
      : st === "S7" ? { fontFamily: TYPE, fontSize: 44, color: "#1B1A17", background: "#efe6cf", padding: "26px 40px", clipPath: "polygon(0 6%,8% 0,22% 5%,40% 0,57% 4%,75% 0,92% 5%,100% 1%,98% 92%,88% 100%,70% 95%,50% 100%,32% 94%,15% 100%,2% 95%)", boxShadow: "0 12px 26px rgba(0,0,0,.45)", transform: `rotate(${slot ? 3 : -3}deg)` }
      : st === "S2" ? { fontFamily: HAND, fontSize: 64, color: "#f4f1e6" }
      : st === "S3" ? { fontFamily: SERIF, fontSize: 52, color: "#fff", letterSpacing: 1, textShadow: "0 0 20px rgba(0,0,0,.8)" }
      : st === "S1" ? { fontFamily: SANS, fontWeight: 700, fontSize: 38, color: "#2a1b4a", background: "rgba(255,255,255,.55)", border: "2px solid rgba(255,255,255,.9)", borderRadius: 50, padding: "16px 34px" }
      : st === "S5" ? { fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#fff", border: "3px solid #ff4fa3", padding: "14px 30px", background: "rgba(0,0,0,.6)" }
      : st === "S8" ? { fontFamily: SERIF, fontSize: 60, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,.9)" }
      : { fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#fff", background: slot ? "#2f6fb8" : "#e3261c", padding: "10px 24px", borderRadius: 8, border: "3px solid #fff", textTransform: "uppercase", boxShadow: "0 8px 18px rgba(0,0,0,.45)" };
    return (
      <div style={{ position: "absolute", ...side, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * (slot ? 6 : -6)}deg)`, opacity: e, whiteSpace: "nowrap", ...look }}>
        {st === "S6" && <div style={{ position: "absolute", left: 30, top: "50%", width: 26, height: 26, marginTop: -13, borderRadius: 13, background: "#2f6fb8" }}><div style={{ position: "absolute", inset: -((lt * 40) % 30), borderRadius: "50%", border: "3px solid #2f6fb8", opacity: 1 - ((lt * 40) % 30) / 30 }} /></div>}
        {b.text}
      </div>
    );
  }
  if (b.k === "quote") {
    const card = st === "S3" && b.text.length < 26;
    const dark6 = st === "S6" || st === "S7";
    const fs = card ? 120 : b.text.length > 40 ? 64 : 86;
    const sel = b.sel && b.text.includes(b.sel) ? b.sel : "";
    const [pre, post] = sel ? [b.text.slice(0, b.text.indexOf(sel)), b.text.slice(b.text.indexOf(sel) + sel.length)] : [b.text, ""];
    const segs: { w: string; sel: boolean }[] = [];
    pre.split(" ").filter(Boolean).forEach((w) => segs.push({ w, sel: false }));
    if (sel) segs.push({ w: sel, sel: true });
    post.split(" ").filter(Boolean).forEach((w) => segs.push({ w, sel: false }));
    const nW = b.text.split(" ").length;
    const ksel = interpolate(lt, [nW * 0.11 + 0.2, nW * 0.11 + 0.8], [0, 1], clamp);
    let wi = 0;
    const inner = (
      <div style={{ fontFamily: st === "S7" ? TYPE : SERIF, fontSize: fs, lineHeight: 1.25, color: card || dark6 ? "#1B1A17" : "#fff", textAlign: st === "S6" ? "left" : "center", maxWidth: st === "S6" ? 820 : 1400, textShadow: card || dark6 ? undefined : "0 0 30px rgba(255,255,255,.3), 0 4px 18px rgba(0,0,0,.7)" }}>
        {segs.map((g, i) => {
          const k = interpolate(lt, [wi * 0.11, wi * 0.11 + 0.25], [0, 1], clamp); wi += g.w.split(" ").length;
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", marginRight: fs * 0.25, opacity: k, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined, whiteSpace: "nowrap" }}>
              {g.sel && st === "S6" && <span style={{ position: "absolute", left: -6, top: "8%", height: "88%", width: `calc(${ksel * 100}% + 12px)`, background: "rgba(59,130,246,.32)" }} />}
              {g.sel && st === "S6" && ksel > 0 && <><span style={{ position: "absolute", left: -10, top: -6, width: 4, height: "100%", background: "#3b82f6" }} /><span style={{ position: "absolute", left: -15, top: -14, width: 14, height: 14, borderRadius: 7, background: "#3b82f6" }} /></>}
              {g.w}
              {g.sel && st !== "S6" && (
                <svg viewBox="-110 -110 220 220" preserveAspectRatio="none" style={{ position: "absolute", left: "-14%", top: "-18%", width: "128%", height: "136%", overflow: "visible" }}>
                  <path d={ring(100, 100)} fill="none" stroke="#ffd23a" strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ksel} style={{ strokeWidth: 7 }} />
                </svg>
              )}
            </span>
          );
        })}
      </div>
    );
    const left = st === "S6" ? 500 : 960;
    return (
      <div style={{ position: "absolute", left, top: 520, transform: "translate(-50%,-50%)", opacity: e }}>
        {card ? <div style={{ background: "#ECE6DA", padding: "70px 110px", boxShadow: "0 30px 70px rgba(0,0,0,.6)", transform: `scale(${0.85 + 0.15 * p})` }}>{inner}</div>
          : st === "S7" ? <div style={{ background: "#efe6cf", padding: "50px 70px", boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `rotate(-2deg) scale(${0.85 + 0.15 * p})` }}>{inner}</div> : inner}
      </div>
    );
  }
  if (b.k === "burst") {
    const pink = st === "S5" || st === "S1";
    return <div style={{ position: "absolute", left: slot ? 1450 : 1500, top: slot ? 700 : 330, transform: `translate(-50%,-50%) scale(${p}) rotate(${(1 - p) * -40}deg)`, opacity: e }}>
      <Star size={420} color={pink ? "#ff4fa3" : "#ffd23a"} spin={lt * 12} textColor={pink ? "#fff" : "#111"} fs={b.text.length > 10 ? 52 : 70}>{b.text}</Star></div>;
  }
  if (b.k === "tape") {
    const k = interpolate(lt, [0, 0.35], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const txt = Array.from({ length: 8 }, () => b.text).join("   ■   ");
    return (
      <div style={{ position: "absolute", left: -300, top: 520, width: 2600, height: 120, transform: `rotate(-7deg) translateX(${(1 - k) * -2600}px)`, opacity: e, background: "#ffd400",
        borderTop: "16px solid", borderBottom: "16px solid", borderImage: "repeating-linear-gradient(45deg,#111 0 24px,#ffd400 24px 48px) 16", boxShadow: "0 18px 40px rgba(0,0,0,.6)", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ fontFamily: ANTON, fontSize: 64, color: "#111", whiteSpace: "nowrap", transform: `translateX(${-lt * 120}px)` }}>{txt}</div>
      </div>
    );
  }
  if (b.k === "chart") {
    return <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: e }}><Chart id={b.id} t={t} t0={t0} dark={dark} /></div>;
  }
  return null;
};

// ── fondo / tratamiento por estilo ──
const Spheres: React.FC<{ t: number; dark?: boolean }> = ({ t, dark }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: 7 }).map((_, i) => {
      const r = 40 + hash(i) * 110, x = 100 + hash(i + 9) * 1720 + Math.sin(t * 0.3 + i) * 40, y = 120 + hash(i + 3) * 800 + Math.cos(t * 0.25 + i * 2) * 30;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: i % 3 === 0 ? 14 : "50%", transform: `rotate(${t * 10 + i * 30}deg)`,
        background: `radial-gradient(circle at 30% 28%, #fff 0%, ${dark ? "#7fd3ff" : "#c18cff"} 28%, ${dark ? "#2b6fd6" : "#ff7a8a"} 72%, rgba(255,120,140,0) 100%)`, opacity: 0.75, boxShadow: "0 20px 40px rgba(80,40,140,.25)" }} />;
    })}
    <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.35 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={200 + hash(i) * 1500} y1={100 + hash(i + 1) * 800} x2={200 + hash(i + 2) * 1500} y2={100 + hash(i + 4) * 800} stroke="#fff" strokeWidth={1.5} />)}
      <circle cx={960} cy={540} r={380 + Math.sin(t) * 10} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={2} />
    </svg>
  </AbsoluteFill>
);
const Embers: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
    {Array.from({ length: 46 }).map((_, i) => {
      const sp = 40 + hash(i) * 90, x = hash(i + 7) * 1920 + Math.sin(t * 1.3 + i) * 30, y = 1100 - ((t * sp + hash(i + 2) * 1200) % 1250), r = 2 + hash(i + 5) * 5;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "#ffb347", boxShadow: `0 0 ${r * 3}px #ff7a1a`, opacity: 0.4 + 0.6 * hash(i + 11) }} />;
    })}
  </AbsoluteFill>
);

const StyleBG: React.FC<{ s: RScene; t: number; terr: any }> = ({ s, t, terr }) => {
  const st = s.style;
  if (s.terrain) {
    const mid = LN[16].start;
    return t < mid
      ? <Terrain3D tex={terr} name="rockies" t={t} t0={s.t0} t1={mid} label="" font={SANS} keys={[[s.t0, -121.5, 50.6, 0.75, -115.5, 51.4, 0.45], [mid, -112, 52.2, 1.6, -103, 52, 0]]} />
      : <Terrain3D tex={terr} name="andes" t={t} t0={mid} t1={s.t1} label="" font={SANS} keys={[[mid, -74.8, -33.2, 0.85, -69.5, -32.8, 0.55], [s.t1, -64.5, -34.8, 1.35, -59, -35.4, 0]]} />;
  }
  if (st === "S1") return (<><Heroes s={s} t={t} /><AbsoluteFill style={{ background: "linear-gradient(135deg, rgba(255,214,190,.28), rgba(120,80,200,.18))" }} /><Spheres t={t} /></>);
  if (st === "S2") return (
    <>
      <KB src="v5/img/k_chalkboard.png" t={t} t0={s.t0} t1={s.t1} i={0} />
      <Heroes s={{ ...s, bg: undefined }} t={t} render={(src, i, t0, t1, op) => (
        <div style={{ position: "absolute", right: 120, top: 300, width: 720, height: 480, border: "10px solid #c9a14a", boxShadow: "0 20px 40px rgba(0,0,0,.55)", opacity: op, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`, overflow: "hidden" }}>
          <KB src={src} t={t} t0={t0} t1={t1} i={i} imgStyle={{ filter: "sepia(.35)" }} />
        </div>)} />
    </>);
  if (st === "S3") return (<><Heroes s={s} t={t} render={(src, i, t0, t1, op) => <KB src={src} t={t} t0={t0} t1={t1} i={i} style={{ opacity: op }} imgStyle={{ filter: "grayscale(1) contrast(1.1) brightness(.55)" }} />} /></>);
  if (st === "S4") return (
    <Heroes s={s} t={t} render={(src, i, t0, t1, op) => {
      const k = i === 0 ? 1 : interpolate(t, [t0, t0 + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
      const R = 60 + k * 1400;
      return <AbsoluteFill style={{ WebkitMaskImage: k < 1 ? `radial-gradient(circle ${R}px at 50% 50%, #000 97%, transparent 100%)` : undefined }}>
        <KB src={src} t={t} t0={t0} t1={t1} i={i} imgStyle={{ filter: "saturate(1.25) contrast(1.05)", transform: `scale(${1.1 + (1 - k) * 0.35})` }} />
        {k < 1 && <div style={{ position: "absolute", left: 960 - R, top: 540 - R, width: R * 2, height: R * 2, borderRadius: "50%", border: "26px solid #111", boxShadow: "inset 0 0 80px rgba(0,0,0,.8)" }} />}
      </AbsoluteFill>;
    }} />);
  if (st === "S5") return (
    <>
      <AbsoluteFill style={{ background: "#050505" }} />
      <Heroes s={s} t={t} render={(src, i, t0, t1, op) => {
        const dk = /column|money|r_bank/.test(src);
        return dk ? <KB src={src} t={t} t0={t0} t1={t1} i={i} style={{ opacity: op }} />
          : <div style={{ position: "absolute", left: 960, top: 520, width: 1000, height: 620, transform: `translate(-50%,-50%) rotate(${i % 2 ? 1 : -1}deg)`, opacity: op, boxShadow: "0 0 120px rgba(255,79,163,.25), 0 30px 60px rgba(0,0,0,.9)", overflow: "hidden" }}>
            <KB src={src} t={t} t0={t0} t1={t1} i={i} imgStyle={{ filter: "contrast(1.1) brightness(.85)" }} /></div>;
      }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 40% 70% at 50% 0%, rgba(255,255,255,.10), transparent 70%)" }} />
    </>);
  if (st === "S6") return (
    <>
      <AbsoluteFill style={{ background: "#ECE6DA" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.18 }}>
        {Array.from({ length: 24 }).map((_, i) => <line key={"v" + i} x1={i * 80} x2={i * 80} y1={0} y2={1080} stroke="#2f6fb8" strokeWidth={1} />)}
        {Array.from({ length: 14 }).map((_, i) => <line key={"h" + i} y1={i * 80} y2={i * 80} x1={0} x2={1920} stroke="#2f6fb8" strokeWidth={1} />)}
        <circle cx={1500} cy={300} r={260} fill="none" stroke="#2f6fb8" strokeWidth={2} />
      </svg>
      <Heroes s={s} t={t} render={(src, i, t0, t1, op, h) => (
        <div style={{ position: "absolute", right: 90, top: 150, width: 860, height: 640, opacity: op, transform: `rotate(${i % 2 ? 1.2 : -1.2}deg) translateY(${(1 - op) * 40}px)`,
          clipPath: "polygon(0 3%,6% 0,15% 2%,30% 0,48% 3%,62% 0,80% 2%,94% 0,100% 4%,99% 30%,100% 60%,98% 97%,85% 100%,66% 97%,45% 100%,25% 97%,8% 100%,1% 96%,2% 60%,0 30%)", overflow: "hidden" }}>
          <KB src={src} t={t} t0={t0} t1={t1} i={i} imgStyle={{ filter: h.bw === false ? undefined : "grayscale(1) contrast(1.25)" }} />
        </div>)} />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 1px, transparent 1px 4px)" }} />
    </>);
  if (st === "S7") return (
    <>
      <KB src="v5/img/s7_table.png" t={t} t0={s.t0} t1={s.t1} i={1} imgStyle={{ filter: "brightness(.8)" }} />
      {(() => {
        const H = heroList({ ...s, bg: undefined } as RScene);
        return H.map((h, i) => {
          if (t < h.t - 0.05) return null;
          const age = H.filter((x) => x.t <= t).length - 1 - i;
          if (age > 2) return null;
          const p = pop(t, h.t, 14), w = 640;
          const x = [520, 1000, 1400][i % 3], y = [460, 520, 440][i % 3];
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: w, transform: `translate(-50%,-50%) rotate(${(hash(i) - 0.5) * 12}deg) scale(${(1 + (1 - p) * 0.5) * (1 - age * 0.06)})`, opacity: Math.min(1, p * 3) * (1 - age * 0.15),
              background: "#f4f1ea", padding: "26px 26px 90px", boxShadow: `0 ${20 + (1 - p) * 50}px ${30 + (1 - p) * 40}px rgba(0,0,0,.55)` }}>
              <Img src={sf(h.src)} style={{ width: "100%", height: w * 0.66, objectFit: "cover", filter: "sepia(.3) contrast(1.05)" }} />
              {(h as any).cap && <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 52, color: "#222" }}>{(h as any).cap}</div>}
              <svg width={60} height={120} style={{ position: "absolute", top: -50, left: w / 2 - 30 }}><path d="M20 110 V20 a12 12 0 0 1 24 0 V95 a8 8 0 0 1 -16 0 V30" stroke="#9a9a9a" strokeWidth={5} fill="none" /></svg>
            </div>
          );
        });
      })()}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 60% at 50% 45%, transparent 40%, rgba(0,0,0,.55) 100%)" }} />
    </>);
  if (st === "S8") return (
    <>
      <Heroes s={s} t={t} render={(src, i, t0, t1, op) => <KB src={src} t={t} t0={t0} t1={t1} i={i} style={{ opacity: op }} imgStyle={{ filter: "saturate(1.15) contrast(1.08)" }} />} />
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(0,0,0,.45))" }} />
      <Embers t={t} />
    </>);
  // S0 genérico: imagen + mapa
  return <Heroes s={s} t={t} />;
};

// S8: el texto gigante va DETRÁS del primer plano (se repinta la mitad baja de la imagen encima)
const FrontCut: React.FC<{ s: RScene; t: number }> = ({ s, t }) => (
  <AbsoluteFill style={{ WebkitMaskImage: "linear-gradient(transparent 58%, #000 78%)", pointerEvents: "none" }}>
    <Heroes s={s} t={t} render={(src, i, t0, t1, op) => <KB src={src} t={t} t0={t0} t1={t1} i={i} style={{ opacity: op }} imgStyle={{ filter: "saturate(1.15) contrast(1.08)" }} />} />
  </AbsoluteFill>
);

// S2: dibujos de línea dorada que se van sumando
const Draws: React.FC<{ s: RScene; t: number }> = ({ s, t }) => {
  const D = s.bt.filter((b) => b.k === "draw") as (Beat & { k: "draw"; t: number })[];
  return (
    <div style={{ position: "absolute", left: 90, top: 330, width: 950, display: "flex", flexWrap: "wrap", gap: 30 }}>
      {D.map((d, i) => {
        if (t < d.t) return null;
        const k = interpolate(t, [d.t, d.t + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        return (
          <div key={i} style={{ width: 210, textAlign: "center" }}>
            <svg width={200} height={200} viewBox="0 0 200 200"><path d={ICONS[d.icon] ?? ICONS.tree} fill="none" stroke="#d8b45a" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} style={{ filter: "drop-shadow(0 0 6px rgba(216,180,90,.5))" }} /></svg>
            <div style={{ fontFamily: HAND, fontSize: 40, color: "#f4f1e6", opacity: k }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// S9: escritorio de evidencia generado desde los beats de la escena
const deskFor = (s: RScene): DeskScene => {
  const T = (l: number, w?: string) => wordTime(l, w);
  const items: DeskScene["items"] = [
    { id: "lbl", kind: "label", caption: "CANADA", x: 300, y: 260, w: 520, rot: -3, t0: T(50, "Canada") },
    { id: "dla", kind: "photo", src: "desk/dla_map.jpg", x: 900, y: 300, w: 1050, h: 716, rot: 2, t0: T(50, "Dominion") },
    { id: "survey", kind: "photo", src: "v5/img/j_survey.png", x: 2100, y: 320, w: 900, h: 506, rot: -2, t0: T(51, "surveyed") },
    { id: "n6", kind: "note", caption: "6 × 6 MILES", x: 2200, y: 960, w: 340, rot: -6, t0: T(51, "six") },
    { id: "n36", kind: "note", caption: "36 SECTIONS", x: 2620, y: 980, w: 340, rot: 5, t0: T(51, "thirty"), color: "#a6e57f" },
    { id: "n160", kind: "note", caption: "160 ACRES", x: 1500, y: 1180, w: 380, rot: -5, t0: T(52, "hundred") },
    { id: "doc", kind: "doc", title: "Dominion Lands Act · 1872", lines: ["Office fee: $10", "Live on it 3 years", "Build a house", "Farm it. It's yours."], x: 360, y: 1150, w: 660, rot: -3, t0: T(53, "deal") },
    { id: "nfree", kind: "note", caption: "FREE!", x: 1100, y: 1250, w: 300, rot: 7, t0: T(54, "Free"), color: "#f4a6b8" },
    { id: "yours", kind: "label", caption: "YOURS", x: 1900, y: 1300, w: 420, rot: -4, t0: T(55, "Yours") },
    { id: "imm", kind: "polaroid", src: "desk/immigrants.jpg", caption: "Ukraine · Norway · 1900", x: 2700, y: 1450, w: 600, rot: 4, t0: T(56, "Ukraine") },
    { id: "home", kind: "polaroid", src: "desk/homestead.jpg", caption: "a homestead", x: 600, y: 1950, w: 560, rot: -4, t0: T(57, "families") },
    { id: "sod", kind: "polaroid", src: "v5/img/j_sod_house.png", caption: "sod house", x: 1300, y: 1900, w: 600, rot: 3, t0: T(58, "sod") },
    { id: "marq", kind: "polaroid", src: "v5/img/j_marquis.png", caption: "Marquis wheat · 1909", x: 2050, y: 1950, w: 560, rot: -3, t0: T(58, "Marquis") },
    { id: "plow", kind: "polaroid", src: "desk/plow.jpg", caption: "breaking the ground", x: 2750, y: 2050, w: 560, rot: 5, t0: T(58, "breadbaskets") },
  ];
  const cam: DeskScene["cam"] = [[s.t0 - 0.2, 560, 500, 1.2, 30, -4]];
  items.forEach((it, i) => {
    const h = it.h ?? it.w * 0.9;
    cam.push([it.t0 + 0.15, it.x + it.w / 2, it.y + h / 2 + 60, it.w > 800 ? 0.95 : 1.2, 28 + (i % 3) * 2, ((i % 3) - 1) * 2]);
  });
  cam.push([s.t1 - 1.2, 1700, 1400, 0.42, 18, 0]);
  return {
    items,
    marks: [{ item: "dla", t0: T(51, "grid") + 0.3, rx: 330, ry: 220, dx: -60, dy: 10 }, { item: "n160", t0: T(52, "acres"), rx: 190, ry: 80, dy: -95 }, { item: "marq", t0: T(58, "frost"), rx: 230, ry: 200, dy: -40 }],
    strings: [{ a: "n160", b: "nfree", t0: T(54, "Free") + 0.4 }, { a: "nfree", b: "yours", t0: T(55, "Yours") + 0.3 }, { a: "imm", b: "home", t0: T(57, "families") + 0.4 }],
    cam: cam.sort((a, b) => a[0] - b[0]),
  };
};

// ── transiciones entre estilos ──
const Transition: React.FC<{ t: number; at: number; to: Style }> = ({ t, at, to }) => {
  const k = (t - at) / 0.5;
  if (k < -1 || k > 1) return null;
  const a = 1 - Math.abs(k);
  if (to === "S2") return <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,.95), rgba(255,255,255,.6) 50%, transparent 80%)", opacity: a, filter: "blur(30px)" }} />;
  if (to === "S3") return (
    <AbsoluteFill style={{ opacity: a }}>
      {["#e3261c", "#ffd23a", "#2f6fb8", "#3bb54a", "#ff4fa3"].map((c, i) => <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${(k * 120 + i * 18) % 140 - 20}%`, width: "9%", background: c, mixBlendMode: "screen", filter: "blur(18px)", opacity: 0.8 }} />)}
    </AbsoluteFill>);
  if (to === "S5" || to === "S4") return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent, rgba(255,0,80,.55), transparent)", transform: `translateX(${k * 900}px)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent, rgba(0,220,255,.55), transparent)", transform: `translateX(${k * 900 + 40}px)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>);
  if (to === "S8") return <AbsoluteFill style={{ background: "#000", opacity: a * 0.9 }} />;
  return <AbsoluteFill style={{ background: "#fff", opacity: a * 0.55, filter: "blur(10px)" }} />;
};

// ── subtítulo palabra a palabra (serif itálica, igual en todo el video) ──
type Chunk = { s: number; e: number; w: Cap[] };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = []; let cur: Cap[] = [];
  CP.forEach((c, i) => {
    cur.push(c);
    const nx = CP[i + 1], gap = nx ? nx.startMs - c.endMs : 999;
    if (cur.length >= 6 || gap > 350 || /[.?!]$/.test(c.text.trim())) { out.push({ s: cur[0].startMs / 1000, e: c.endMs / 1000, w: cur }); cur = []; }
  });
  return out;
})();
const Subs: React.FC<{ t: number }> = ({ t }) => {
  const ch = CHUNKS.find((c) => t >= c.s - 0.05 && t <= c.e + 0.25);
  if (!ch) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: SERIF, fontSize: 58, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,.9), 0 0 24px rgba(0,0,0,.75)" }}>
      {ch.w.map((w, i) => <span key={i} style={{ opacity: t >= w.startMs / 1000 - 0.03 ? 1 : 0.35 }}>{w.text}</span>)}
    </div>
  );
};

// ── efectos de sonido ──
type Sfx = [number, string, number];
export const SFX: Sfx[] = (() => {
  const out: Sfx[] = [];
  SC.slice(1).forEach((s, i) => {
    out.push([s.t0 - 0.25, ["wh1", "wh2", "wh3", "wh6", "wh9", "wh10", "wh11"][i % 7], 0.16]);
    s.bt.forEach((b, j) => {
      const f = b.k === "img" ? ["pp1", "pp2", "pp3", "pp4"][j % 4] : b.k === "year" || b.k === "tape" ? "st1" : b.k === "count" ? "tk1" : b.k === "burst" ? "pop3" : b.k === "big" ? "im1" : b.k === "draw" ? "sw2" : ["pop1", "pop2", "pop4"][j % 3];
      out.push([b.t, f, b.k === "big" ? 0.12 : 0.09]);
    });
  });
  return out;
})();

export const V5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const terr = useTerrainTextures();
  const vis = SC.filter((s, i) => i > 0 && t >= s.t0 - 0.3 && t < s.t1 + 0.3);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={sf("v5/voz_v5.wav")} />
      {SFX.map(([t0, f, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(t0 * FPS))} durationInFrames={40} layout="none">
          <Audio src={sf(`sfx/${f}.wav`)} volume={v} />
        </Sequence>
      ))}
      {t < INTRO_END + 0.3 && <Sequence durationInFrames={Math.round((INTRO_END + 0.3) * FPS)}><Main tm={tmIntro as number[][]} intro /></Sequence>}
      {vis.map((s) => {
        const enter = interpolate(t, [s.t0 - 0.3, s.t0 + 0.2], [0, 1], clamp);
        const O = overlays(s);
        return (
          <AbsoluteFill key={s.idx} style={{ opacity: enter }}>
            {s.style === "S9" ? <EvidenceDesk scene={deskFor(s)} t={t} f={frame} t0={s.t0} t1={s.t1} tr={t} /> : <StyleBG s={s} t={t} terr={terr} />}
            {s.style === "S2" && <Draws s={s} t={t} />}
            {O.filter((o) => t >= o.t0 - 0.02 && t <= o.t1).map((o, i) => (
              <React.Fragment key={i}>
                <BeatView st={s.terrain ? "S0" : s.style} b={o.b as any} t={t} t0={o.t0} t1={o.t1} slot={o.slot} />
                {s.style === "S8" && (o.b.k === "big" || o.b.k === "year") && <FrontCut s={s} t={t} />}
              </React.Fragment>
            ))}
          </AbsoluteFill>
        );
      })}
      {SC.slice(1).map((s) => <Transition key={s.idx} t={t} at={s.t0} to={s.style} />)}
      {/* sin subtítulos corridos (16-oct) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.3) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
