// Capítulo 2 (0:49.9 → 2:02.1), coreografiado a mano sobre la voz real (tiempos = palabras de Groq).
// Mismo mundo que el minuto 1: mapa continuo, cámara siempre en movimiento, cada frase = una acción nueva.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, MapSkins, Region, Tag, Icon, Flag, BigWord, Clouds, SANS, HAND, W, H, geo, FPS } from "../Main";
import { Terrain3D, useTerrainTextures } from "../v3";
import { K, camOf, World } from "./common";

import { sf } from "../sf";
// cámara principal (nunca quieta: entre viajes siempre hay deriva lenta)
const KEYS: K[] = [
  [49.9, -77, 6, 0.285],
  [53.9, -72, 8, 0.27],
  [55.3, -71, 8, 0.275],
  [59.8, -73, 9, 0.28],
  [61.3, -106, 52, 1.05],
  [62.3, -107, 52.5, 1.25],
  [66.6, -104, 52, 1.5],
  [69.9, -103.5, 51.6, 1.62],
  [72.5, -104.5, 52.2, 1.4],
  [75.6, -104, 52, 1.55],
  [76.6, -104, 52, 1.5],
  [77.9, -62, -35, 1.6],
  [80.9, -61, -35, 1.85],
  [82.9, -60.5, -35.4, 1.95],
  [86.0, -61.5, -34.6, 1.7],
  [89.4, -61, -35, 1.8],
  [103.3, -61, -35, 1.8],
  [105.2, -40, 20, 0.27],
  [107.2, -60, 12, 0.28],
  [109.2, -82, 9, 0.4],
  [113.9, -82, 9, 0.41],
  [115.8, -92, 28, 0.46],
  [116.5, -82, 9, 0.4],
  [120.2, -82, 9, 0.42],
  [122.2, -64, -33, 0.75],
];

const PRA = ["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("");
const PAM = geo.prov.Pampas.d;
const RECT_PRA = { L: -114, R: -97, T: 55.5, B: 49 };
const RECT_PAM = { L: -64.5, R: -57.5, T: -31, B: -39 };

// ── año que rebobina (hoy → 1880) ──
const YearRewind: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (!vis(t, 50.2, 55.2)) return null;
  const k = interpolate(t, [51.3, 53.9], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const yr = Math.round(2026 - (2026 - 1880) * k);
  const s = pop(f, 50.2, 10) * fadeOut(t, 55.2);
  const shake = k > 0 && k < 1 ? Math.sin(f * 2.1) * 2 : 0;
  return (
    <div style={{ position: "absolute", left: 960, top: 190, transform: `translate(-50%,-50%) scale(${s}) rotate(${-2 + shake * 0.3}deg)`, padding: "0 46px", height: 150, display: "flex", alignItems: "center", gap: 22,
      backgroundImage: "repeating-linear-gradient(transparent 0 30px, rgba(80,110,160,.25) 30px 31px), linear-gradient(#fbf6e6,#efe4c4)", backgroundColor: "#f6efd9", border: "4px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,.4)" }}>
      <Img src={sf("icons/hourglass.png")} style={{ width: 92, transform: `rotate(${k * 540}deg)` }} />
      <span style={{ fontFamily: HAND, fontSize: 118, color: "#26314a", fontVariantNumeric: "tabular-nums" }}>{yr}</span>
    </div>
  );
};

// ── pantalla partida: dos ventanas al mismo mundo ──
const SPLIT_L: K[] = [[55.3, -104, 52, 0.75], [60, -106, 52.5, 1.0]];
const SPLIT_R: K[] = [[55.3, -62, -35, 1.05], [60, -60, -35.6, 1.35]];
const SPLIT2_L: K[] = [[89.4, -105, 52, 1.2], [92.5, -104, 51.6, 1.5]];
const SPLIT2_R: K[] = [[89.4, -61, -35, 1.6], [92.5, -60.6, -35.3, 1.9]];
const Split: React.FC<{ t: number; f: number; t0: number; t1: number; L: K[]; R: K[]; sink?: number }> = ({ t, f, t0, t1, L, R, sink = 0 }) => {
  if (!vis(t, t0, t1)) return null;
  const open = interpolate(t, [t0, t0 + 0.55], [0, 1], { ...clamp, easing: ease });
  const close = interpolate(t, [t1 - 0.5, t1], [1, 0], { ...clamp, easing: ease });
  const k = Math.min(open, close);
  const gap = 960 * k;
  const cl = camOf(L, t), cr = camOf(R, t);
  const win = (side: "L" | "R") => {
    const c = side === "L" ? cl : cr;
    const clip = side === "L" ? `inset(0 ${1920 - gap + 6}px 0 0)` : `inset(0 0 0 ${1920 - gap + 6}px)`;
    // cada ventana se centra en su mitad
    const shift = side === "L" ? -480 : 480;
    return (
      <AbsoluteFill style={{ clipPath: clip, transform: `translateY(${-sink * 1080}px)` }}>
        <AbsoluteFill style={{ transform: `translateX(${shift}px)` }}>
          <World c={c} modern={1}>
            <Region d={side === "L" ? PRA : PAM} op={interpolate(t, [t0 + 0.6, t0 + 1.1], [0, 1], clamp) * close} z={c.z} color="#9ad13a" />
          </World>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };
  return (
    <AbsoluteFill>
      {win("L")}
      {win("R")}
      <div style={{ position: "absolute", left: 957, top: 0, width: 6, height: 1080 * k, background: "#fff", boxShadow: "0 0 20px rgba(0,0,0,.5)", transform: `translateY(${-sink * 1080}px)` }} />
    </AbsoluteFill>
  );
};

// ── columna de suelo que sale del mapa ──
const SoilColumn: React.FC<{ t: number; f: number; x: number; y: number; t0: number; t1: number; label: string; ghost?: boolean; left?: boolean }> = ({ t, f, x, y, t0, t1, label, ghost, left }) => {
  if (!vis(t, t0, t1)) return null;
  const rise = interpolate(t, [t0, t0 + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) }) * fadeOut(t, t1);
  const Hh = 430 * rise;
  return (
    <div style={{ position: "absolute", left: x - 90, top: y - Hh, width: 180, height: Hh, opacity: ghost ? 0.75 : 1 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, overflow: "hidden", border: "4px solid #fff", boxShadow: "0 18px 40px rgba(0,0,0,.5)",
        background: "linear-gradient(#5fa832 0 7%, #1a120b 7% 62%, #3b2a1a 62% 82%, #8a6a45 82% 100%)" }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 14 + i * 18, top: "7%", width: 2, height: `${30 + (i * 37) % 28}%`, background: "rgba(214,190,140,.55)", transformOrigin: "top", transform: `scaleY(${interpolate(t, [t0 + 0.4 + i * 0.05, t0 + 1.2 + i * 0.05], [0, 1], clamp)})` }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: left ? undefined : 200, right: left ? 200 : undefined, top: Hh * 0.3, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", background: "#111", padding: "6px 14px", borderRadius: 6, border: "2px solid #fff", whiteSpace: "nowrap", textTransform: "uppercase", transform: `scale(${pop(f, t0 + 0.5)})`, transformOrigin: left ? "right" : "left" }}>{label}</div>
    </div>
  );
};

// ── termómetro ──
const Thermo: React.FC<{ t: number; f: number; x: number; y: number; t0: number; t1: number; value: number; label: string }> = ({ t, f, x, y, t0, t1, value, label }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 10) * fadeOut(t, t1);
  const k = interpolate(t, [t0 + 0.2, t0 + 1.0], [0, 1], { ...clamp, easing: ease });
  const v = Math.round(20 + (value - 20) * k);
  const lvl = (v + 30) / 60; // -30..+30
  const cold = value < 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ position: "relative", width: 46, height: 260, borderRadius: 23, background: "#fff", boxShadow: "0 10px 24px rgba(0,0,0,.45)" }}>
        <div style={{ position: "absolute", left: 11, right: 11, bottom: 14, height: 232 * lvl, borderRadius: 12, background: cold ? "#39a0ff" : "#ff5a36" }} />
        <div style={{ position: "absolute", left: -9, bottom: -26, width: 64, height: 64, borderRadius: 32, background: cold ? "#39a0ff" : "#ff5a36", border: "6px solid #fff" }} />
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 900, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>
        <div style={{ fontSize: 92, lineHeight: 1 }}>{v > 0 ? "+" : v < 0 ? "−" : ""}{Math.abs(v)}°C</div>
        <div style={{ fontSize: 30, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      </div>
    </div>
  );
};

// ── anillo de estaciones: meses cultivables ──
const SeasonRing: React.FC<{ t: number; f: number; x: number; y: number; t0: number; t1: number; months: number; start: number; label: string }> = ({ t, f, x, y, t0, t1, months, start, label }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 11) * fadeOut(t, t1);
  const k = interpolate(t, [t0 + 0.25, t0 + 1.1], [0, 1], { ...clamp, easing: ease });
  const R = 120, C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})` }}>
      <svg width={320} height={320} viewBox="-160 -160 320 320" style={{ overflow: "visible", filter: "drop-shadow(0 10px 18px rgba(0,0,0,.45))" }}>
        <circle r={R} fill="rgba(15,18,26,.82)" stroke="#fff" strokeWidth={5} />
        <circle r={R - 18} fill="none" stroke="#3a4152" strokeWidth={28} />
        <circle r={R - 18} fill="none" stroke="#8fd13a" strokeWidth={28} strokeDasharray={`${(2 * Math.PI * (R - 18)) * (months / 12) * k} ${C}`} transform={`rotate(${-90 + start * 30})`} />
        {Array.from({ length: 12 }).map((_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <line key={i} x1={Math.cos(a) * (R - 32)} y1={Math.sin(a) * (R - 32)} x2={Math.cos(a) * (R - 4)} y2={Math.sin(a) * (R - 4)} stroke="#0f121a" strokeWidth={3} />; })}
        <text y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={54} fill="#fff">{Math.max(1, Math.round(months * k))}</text>
        <text y={50} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} fill="#cfd6e4">MONTHS</text>
      </svg>
      <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", textTransform: "uppercase", textShadow: "0 3px 10px rgba(0,0,0,.6)" }}>{label}</div>
    </div>
  );
};

// ── nieve / lluvia sobre la pantalla ──
const Weather: React.FC<{ t: number; f: number; t0: number; t1: number; kind: "snow" | "rain" }> = ({ t, f, t0, t1, kind }) => {
  if (!vis(t, t0, t1)) return null;
  const o = Math.min(interpolate(t, [t0, t0 + 0.4], [0, 1], clamp), fadeOut(t, t1, 0.5));
  const N = kind === "snow" ? 120 : 160;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      {Array.from({ length: N }).map((_, i) => {
        const sp = kind === "snow" ? 2.2 + (i % 5) * 0.5 : 26 + (i % 7) * 3;
        const x0 = (i * 137.5) % 1920, y0 = (i * 71.3) % 1080;
        const x = (x0 + (kind === "snow" ? Math.sin((f + i * 9) / 18) * 30 : -f * 3)) % 1920;
        const y = (y0 + f * sp) % 1180 - 50;
        return kind === "snow"
          ? <div key={i} style={{ position: "absolute", left: (x + 1920) % 1920, top: y, width: 6 + (i % 4) * 3, height: 6 + (i % 4) * 3, borderRadius: "50%", background: "#fff", opacity: 0.85 }} />
          : <div key={i} style={{ position: "absolute", left: (x + 1920) % 1920, top: y, width: 3, height: 46, background: "linear-gradient(transparent, rgba(220,235,255,.85))", transform: "rotate(12deg)" }} />;
      })}
    </AbsoluteFill>
  );
};

// ── lluvia vs cultivo: barras de lluvia mes a mes bajo la curva del cultivo ──
const RAIN = [95, 105, 110, 90, 70, 45, 40, 50, 65, 100, 100, 100]; // Pampa húmeda, mm/mes aprox (ene→dic)
const CROP = [0.9, 0.8, 0.55, 0.25, 0.1, 0.05, 0.05, 0.1, 0.3, 0.6, 0.85, 0.95];
const RainChart: React.FC<{ t: number; f: number; t0: number; t1: number }> = ({ t, f, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const k = interpolate(t, [t0 + 0.3, t0 + 1.3], [0, 1], clamp);
  const pts = CROP.map((v, i) => `${30 + i * 50},${230 - v * 190}`).join(" ");
  return (
    <div style={{ position: "absolute", left: 1450, top: 560, transform: `translate(-50%,-50%) scale(${s})`, background: "rgba(250,247,238,.97)", border: "4px solid #fff", borderRadius: 12, padding: "16px 20px 10px", boxShadow: "0 16px 36px rgba(0,0,0,.45)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#1b2433", marginBottom: 6 }}>RAIN <span style={{ color: "#2f7fd6" }}>■</span> &nbsp;CROP NEEDS <span style={{ color: "#3c9a2e" }}>●</span></div>
      <svg width={620} height={260}>
        {RAIN.map((r, i) => { const h = r * 1.8 * interpolate(k, [i / 14, i / 14 + 0.25], [0, 1], clamp); return <rect key={i} x={12 + i * 50} y={230 - h} width={36} height={h} rx={4} fill="#2f7fd6" opacity={0.85} />; })}
        <polyline points={pts} fill="none" stroke="#3c9a2e" strokeWidth={6} strokeLinejoin="round" strokeDasharray={900} strokeDashoffset={900 * (1 - k)} />
        {"JFMAMJJASOND".split("").map((m, i) => <text key={i} x={30 + i * 50} y={254} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} fill="#4a5466">{m}</text>)}
      </svg>
    </div>
  );
};

// ── corte del subsuelo: el mundo sube y aparece el mollisol ──
const ROOTS = Array.from({ length: 16 }).map((_, i) => {
  const x = 80 + i * 112;
  let d = `M${x},300`, y = 300, xx = x;
  for (let j = 0; j < 6; j++) { y += 60 + ((i * 7 + j * 13) % 30); xx += ((i * 31 + j * 17) % 60) - 30; d += ` L${xx},${y}`; }
  return d;
});
const Underground: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const t0 = 91.3, t1 = 103.8;
  if (!vis(t, t0, t1 + 0.6)) return null;
  const up = interpolate(t, [t0, t0 + 0.9], [1, 0], { ...clamp, easing: ease }) + interpolate(t, [t1, t1 + 0.6], [0, -1], { ...clamp, easing: ease });
  const years = Math.round(interpolate(t, [97.7, 99.1], [0, 10000], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const grow = interpolate(t, [99.2, 100.2], [0, 1], { ...clamp, easing: ease });
  const die = interpolate(t, [100.86, 101.3], [0, 1], clamp);
  const rot = interpolate(t, [101.32, 102.2], [0, 1], { ...clamp, easing: ease });
  const thick = interpolate(t, [97.7, 102.4], [0, 1], { ...clamp, easing: ease });
  const darkTop = 300, darkH = 330 + 170 * thick;
  const drift = (t - t0) * 6;
  return (
    <AbsoluteFill style={{ transform: `translateY(${up * 1080}px)` }}>
      <svg width={1920} height={1080} viewBox={`0 ${drift} 1920 1080`}>
        <defs>
          <pattern id="crumb" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="5" cy="6" r="3" fill="#2c2016" /><circle cx="15" cy="15" r="2.4" fill="#0c0805" /><circle cx="17" cy="4" r="1.6" fill="#3a2a1c" /></pattern>
          <linearGradient id="sky2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9fcff2" /><stop offset="1" stopColor="#dcefff" /></linearGradient>
        </defs>
        <rect x={0} y={-200} width={1920} height={430} fill="url(#sky2)" />
        <rect x={0} y={230} width={1920} height={70} fill="#6db33f" />
        {Array.from({ length: 140 }).map((_, i) => <path key={i} d={`M${i * 14},300 q${4 + (i % 3) * 2},-${40 + (i * 13) % 40} ${8 + (i % 4)},-${60 + (i * 7) % 50}`} stroke={i % 2 ? "#5aa232" : "#7cc447"} strokeWidth={4} fill="none" transform={`rotate(${Math.sin((f + i * 5) / 16) * 3} ${i * 14} 300)`} />)}
        <rect x={0} y={darkTop} width={1920} height={darkH} fill="#16100a" />
        <rect x={0} y={darkTop} width={1920} height={darkH} fill="url(#crumb)" opacity={0.9} />
        <rect x={0} y={darkTop + darkH} width={1920} height={260} fill="#5b4329" />
        <rect x={0} y={darkTop + darkH + 260} width={1920} height={400} fill="#8d6c45" />
        {ROOTS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={die > 0 ? `rgb(${Math.round(120 + 70 * (1 - die))},${Math.round(190 - 100 * die)},${Math.round(90 - 40 * die)})` : "#c9e07a"} strokeWidth={7 - 4 * rot} strokeLinecap="round"
            strokeDasharray={700} strokeDashoffset={700 * (1 - grow)} opacity={1 - rot * 0.85} />
        ))}
        {rot > 0 && Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={(i * 97) % 1920} cy={darkTop + 40 + ((i * 53) % Math.max(60, darkH - 60))} r={6 * rot} fill="#000" opacity={0.6 * rot} />)}
      </svg>
      <BigWord f={f} t={t} t0={92.9} t1={97.4} text={<span style={{ fontFamily: HAND, fontSize: 150, color: "#ffd23a" }}>Mollisol</span>} y={560} size={150} />
      {[["DARK", 95.12, 380, 760], ["CRUMBLY", 95.92, 960, 830], ["DEEP", 96.46, 1540, 760]].map(([w, t0, x, y]) => (
        vis(t, t0 as number, 97.5) ? <div key={w as string} style={{ position: "absolute", left: x as number, top: y as number, transform: `translate(-50%,-50%) scale(${pop(f, t0 as number, 8) * fadeOut(t, 97.5)})`, fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", padding: "4px 24px", border: "5px solid #fff", borderRadius: 10, background: "rgba(0,0,0,.35)" }}>{w}</div> : null
      ))}
      {vis(t, 97.6, 103.4) && (
        <div style={{ position: "absolute", right: 70, top: 390, transform: `scale(${pop(f, 97.6, 10) * fadeOut(t, 103.4)})`, transformOrigin: "right", textAlign: "right", fontFamily: SANS, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.7)" }}>
          <div style={{ fontWeight: 900, fontSize: 104, fontVariantNumeric: "tabular-nums" }}>{years.toLocaleString("en-US")}</div>
          <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: 1 }}>YEARS OF GRASS</div>
        </div>
      )}
      {[["GREW", 100.16, "#9be05a"], ["DIED", 100.86, "#d9a35a"], ["ROTTED", 101.32, "#c8c8c8"]].map(([w, t0, col], i) => (
        vis(t, t0 as number, 102.9) ? <div key={w as string} style={{ position: "absolute", left: 420 + i * 300, top: 720, transform: `translate(-50%,-50%) rotate(${-4 + i * 3}deg) scale(${pop(f, t0 as number, 8) * fadeOut(t, 102.9)})`, fontFamily: HAND, fontSize: 84, color: col as string, textShadow: "0 4px 10px rgba(0,0,0,.5)" }}>{w}</div> : null
      ))}
    </AbsoluteFill>
  );
};

// ── cinturones de mollisol en el planeta ──
const BELTS: [number, number, number, number][] = [[-102, 48, 14, 8], [-98, 40, 8, 6], [-61, -34, 6, 5], [38, 49, 18, 5], [60, 52, 8, 3]];

// ── rectángulos espejo ──
const rectPath = (r: typeof RECT_PRA) => { const [x0, y0] = P(r.L, r.T), [x1, y1] = P(r.R, r.B); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };

// ── cartas ──
const Card: React.FC<{ f: number; t: number; x: number; y: number; t0: number; flip: number; face: string; back: string; label: string; rot: number }> = ({ f, t, x, y, t0, flip, face, back, label, rot }) => {
  if (t < t0) return null;
  const k = interpolate(t, [t0, t0 + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fl = interpolate(t, [flip, flip + 0.45], [0, 180], { ...clamp, easing: ease });
  const showBack = fl > 90;
  const cx = 960 + (x - 960) * k, cy = 1300 + (y - 1300) * k;
  return (
    <div style={{ position: "absolute", left: cx, top: cy, width: 210, height: 300, transform: `translate(-50%,-50%) rotate(${rot * k + (1 - k) * 30}deg) rotateY(${fl}deg)`, perspective: 900 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "#fbf7ec", border: "6px solid #fff", boxShadow: "0 18px 40px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: showBack ? "scaleX(-1)" : undefined }}>
        <Img src={sf(`icons/${showBack ? back : face}.png`)} style={{ width: 130 }} />
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 22, color: "#1b2433", marginTop: 8, textTransform: "uppercase" }}>{showBack ? label : "Fertile land"}</div>
        <div style={{ position: "absolute", left: 12, top: 6, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#b22" }}>A</div>
        <div style={{ position: "absolute", right: 12, bottom: 6, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#b22", transform: "rotate(180deg)" }}>A</div>
      </div>
    </div>
  );
};

export const Ch2: React.FC = () => {
  const tex = useTerrainTextures();
  const t = useCurrentFrame() / FPS;
  const f = t * FPS;
  const c = camOf(KEYS, t);
  const c0 = camOf(KEYS, t - 1 / FPS);
  const v = Math.hypot(c.x - c0.x, c.y - c0.y) * c.z + Math.abs(Math.log(c.z / c0.z)) * 900;
  const blur = Math.min(10, v * 0.25);
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);
  const modern = interpolate(t, [105.4, 107.0, 116.4, 117.4], [0, 1, 1, 0.35], clamp);
  const life = interpolate(t, [72.6, 75.4], [0, 1], { ...clamp, easing: ease });
  const rP = rectPath(RECT_PRA), rA = rectPath(RECT_PAM);
  const draw = (t0: number) => interpolate(t, [t0, t0 + 0.9], [1, 0], { ...clamp, easing: ease });
  const mir = interpolate(t, [113.96, 115.3], [0, 1], { ...clamp, easing: ease });
  // copia espejada de la Pampa: se da vuelta y vuela sobre las Praderas
  const mx = rA.x + (rP.x - rA.x) * mir, my = rA.y + (rP.y - rA.y) * mir, mw = rA.w + (rP.w - rA.w) * mir, mh = rA.h + (rP.h - rA.h) * mir;
  const [eqx0, eqy] = P(-200, 0), [eqx1] = P(60, 0);
  const [pcx, pcy] = proj(c, ...P(-104, 52)), [acx, acy] = proj(c, ...P(-61, -35));
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb2"><feGaussianBlur stdDeviation={blur.toFixed(2)} /></filter></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#mb2)" : undefined }}>
        <World c={c} modern={modern}>
          <Region d={PRA} op={at(62.4) * off(76.4)} z={c.z} color={life > 0 ? `rgb(${Math.round(201 - 80 * life)},${Math.round(180 + 30 * life)},${Math.round(80 - 20 * life)})` : "#c9b450"} />
          <Region d={PAM} op={at(77.6) * off(89.3)} z={c.z} color="#9ad13a" />
          {BELTS.map(([lo, la, rx, ry], i) => { const [x, y] = P(lo, la); const o = at(103.6 + i * 0.15, 0.4) * off(106.3); return o > 0 ? <ellipse key={i} cx={x} cy={y} rx={rx * 30} ry={ry * 30} fill="#3a2a14" fillOpacity={0.75 * o} stroke="#ffd23a" strokeWidth={4 / c.z} strokeOpacity={o} style={{ filter: `drop-shadow(0 0 ${10 / c.z}px #ffd23a)` }} /> : null; })}
          {/* dos rectángulos dorados */}
          {t > 109.3 && t < 117 && <>
            <rect x={rP.x} y={rP.y} width={rP.w} height={rP.h} fill="#ffd23a" fillOpacity={0.18 * off(116.2)} stroke="#ffd23a" strokeWidth={7 / c.z} strokeDasharray={2 * (rP.w + rP.h)} strokeDashoffset={2 * (rP.w + rP.h) * draw(109.88)} opacity={off(116.2)} />
            <rect x={rA.x} y={rA.y} width={rA.w} height={rA.h} fill="#9ad13a" fillOpacity={0.18 * off(116.2)} stroke="#9ad13a" strokeWidth={7 / c.z} strokeDasharray={2 * (rA.w + rA.h)} strokeDashoffset={2 * (rA.w + rA.h) * draw(110.4)} opacity={off(116.2)} />
            <line x1={eqx0} y1={eqy} x2={eqx0 + (eqx1 - eqx0) * (1 - draw(112.54))} y2={eqy} stroke="#fff" strokeWidth={4 / c.z} strokeDasharray={`${24 / c.z} ${14 / c.z}`} opacity={off(116.2)} />
            {mir > 0 && <rect x={mx} y={my} width={mw} height={mh} fill="#9ad13a" fillOpacity={0.3 * off(116.2)} stroke="#fff" strokeWidth={6 / c.z} opacity={off(116.2)}
              transform={`translate(0 ${my + mh / 2}) scale(1 ${Math.cos(mir * Math.PI)}) translate(0 ${-(my + mh / 2)})`} />}
          </>}
        </World>
      </AbsoluteFill>

      {/* capa de pantalla que sigue a la cámara */}
      <Clouds c={c} f={f} t={t} />
      <YearRewind t={t} f={f} />
      {[[-104, 52], [-61, -34]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="wheat" lon={lo} lat={la} t0={53.6 + i * 0.2} t1={55.2} size={120} />)}
      <Tag c={c} f={f} t={t} lon={-72} lat={30} t0={53.7} t1={55.2} text="Farming giants" bg="#2a7d2e" size={34} />
      <Split t={t} f={f} t0={55.6} t1={60.1} L={SPLIT_L} R={SPLIT_R} />
      {vis(t, 56.3, 59.9) && <>
        {[["CANADA", 480, "ca", 56.3], ["ARGENTINA", 1440, "ar", 56.64]].map(([n, x, cc, t0]) => (
          <div key={n as string} style={{ position: "absolute", left: x as number, top: 120, transform: `translate(-50%,-50%) scale(${pop(f, t0 as number, 9) * fadeOut(t, 59.9)})`, display: "flex", alignItems: "center", gap: 16, background: "#111", padding: "8px 24px", borderRadius: 8, border: "3px solid #fff" }}>
            <Img src={sf(`flag_${cc}.png`)} style={{ width: 70, border: "2px solid #fff" }} />
            <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 2 }}>{n}</span>
          </div>
        ))}
        <BigWord f={f} t={t} t0={57.7} t1={59.9} text={<span style={{ fontSize: 64 }}>SIDE <span style={{ color: "#ffd23a" }}>BY</span> SIDE</span>} y={960} />
      </>}
      <Tag c={c} f={f} t={t} lon={-104} lat={57} t0={60.9} t1={62.2} text="The land" bg="#2a7d2e" size={36} />

      {/* Praderas: vuelo rasante desde las Rocosas hacia la llanura */}
      {vis(t, 62.3, 66.7) && <Terrain3D tex={tex} name="rockies" t={t} t0={62.3} t1={66.7} label="The Prairies" font={SANS}
        keys={[[62.3, -123, 50.8, 1.0, -115, 51.2, 0.25], [64.1, -118, 51.2, 0.7, -108, 51.6, 0.05], [66.7, -113.5, 51.5, 0.5, -102, 51.8, 0.0]]}>
        {vis(t, 64.1, 66.5) && <div style={{ position: "absolute", left: 960, top: 220, transform: `translate(-50%,-50%) scale(${pop(f, 64.1, 9) * fadeOut(t, 66.5)})`, fontFamily: HAND, fontSize: 96, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,.55)" }}>a sea of grass</div>}
        {vis(t, 65.4, 66.5) && <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 4, background: "#fff", boxShadow: "0 0 12px #fff", transformOrigin: "center", transform: `scaleX(${interpolate(t, [65.4, 66.0], [0, 1], clamp)})`, opacity: 0.9 * fadeOut(t, 66.5) }} />}
      </Terrain3D>}

      <SoilColumn t={t} f={f} x={pcx} y={pcy + 60} t0={67.5} t1={69.9} label="Deep black soil" />
      <Weather t={t} f={f} t0={69.9} t1={72.5} kind="snow" />
      <Thermo t={t} f={f} x={1450} y={430} t0={70.0} t1={72.5} value={-15} label="January average" />
      <SeasonRing t={t} f={f} x={470} y={560} t0={71.26} t1={74.2} months={4} start={5} label="Growing season" />
      {Array.from({ length: 14 }).map((_, i) => <Icon key={i} c={c} f={f} t={t} src="wheat" lon={-113 + (i % 7) * 2.6} lat={50 + Math.floor(i / 7) * 2.6 + (i % 2) * 0.6} t0={74.3 + i * 0.06} t1={76.4} size={64} />)}
      <BigWord f={f} t={t} t0={74.6} t1={76.4} text={<span>EXPLODES WITH <span style={{ color: "#9be05a" }}>LIFE</span></span>} y={900} size={84} />

      {/* Pampa: el mismo vuelo, el mismo suelo */}
      {vis(t, 78.0, 80.9) && <Terrain3D tex={tex} name="andes" t={t} t0={78.0} t1={80.9} label="The Pampas" font={SANS}
        keys={[[78.0, -74.8, -33.2, 0.85, -69.5, -32.8, 0.55], [80.9, -67.5, -34.4, 0.9, -61, -35.2, 0]]}>
        {vis(t, 78.5, 80.7) && <div style={{ position: "absolute", left: 960, top: 220, transform: `translate(-50%,-50%) scale(${pop(f, 78.5, 9) * fadeOut(t, 80.7)})`, fontFamily: HAND, fontSize: 96, color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,.55)" }}>another sea of grass</div>}
      </Terrain3D>}
      <SoilColumn t={t} f={f} x={acx + 120} y={acy + 60} t0={80.95} t1={82.9} label="Just as rich" />
      <SoilColumn t={t} f={f} x={acx - 140} y={acy + 60} t0={81.3} t1={82.9} label="Prairies" ghost left />
      <Thermo t={t} f={f} x={430} y={430} t0={83.1} t1={86.0} value={9} label="July average" />
      <SeasonRing t={t} f={f} x={1460} y={520} t0={84.34} t1={86.0} months={8} start={8} label="Growing season" />
      <Weather t={t} f={f} t0={86.0} t1={89.2} kind="rain" />
      <RainChart t={t} f={f} t0={86.4} t1={89.2} />

      {/* debajo de las dos: el mismo tesoro */}
      <Split t={t} f={f} t0={89.45} t1={92.0} L={SPLIT2_L} R={SPLIT2_R} sink={interpolate(t, [91.3, 92.0], [0, 1], { ...clamp, easing: ease })} />
      {vis(t, 90.2, 91.3) && <BigWord f={f} t={t} t0={90.8} t1={91.3} text={<span>SAME <span style={{ color: "#ffd23a" }}>TREASURE</span></span>} y={540} size={110} />}
      <Underground t={t} f={f} />
      <Tag c={c} f={f} t={t} lon={-45} lat={60} t0={104.4} t1={106.2} text="Most fertile ground on Earth" bg="#7a5a12" size={34} />

      {/* desde el espacio */}
      {vis(t, 106.4, 109.2) && <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 48%, rgba(2,6,18,.85) 80%)", opacity: interpolate(t, [106.4, 107.1, 108.6, 109.2], [0, 1, 1, 0], clamp) }} />}
      <BigWord f={f} t={t} t0={107.8} t1={109.2} text="FROM SPACE" y={150} size={90} />
      <Tag c={c} f={f} t={t} lon={-82} lat={2.5} t0={112.6} t1={116.2} text="Equator" bg="#111" size={26} />
      <Tag c={c} f={f} t={t} lon={-105.5} lat={58} t0={110.0} t1={116.2} text="Prairies" bg="#8a6a00" size={28} />
      <Tag c={c} f={f} t={t} lon={-61} lat={-42} t0={110.5} t1={116.2} text="Pampas" bg="#2a7d2e" size={28} />
      <BigWord f={f} t={t} t0={114.3} t1={116.2} text={<span>MIRROR <span style={{ color: "#9be05a" }}>IMAGES</span></span>} y={960} size={84} />

      {/* la misma mano */}
      <Card f={f} t={t} x={pcx} y={pcy} t0={116.6} flip={120.3} face="wheat" back="farmer" label="Owners" rot={-6} />
      <Card f={f} t={t} x={acx} y={acy} t0={116.9} flip={120.55} face="wheat" back="tophat" label="A few families" rot={5} />
      <BigWord f={f} t={t} t0={118.3} t1={120.2} text={<span>SAME <span style={{ color: "#ffd23a" }}>HAND</span></span>} y={540} size={110} />
      <BigWord f={f} t={t} t0={121.3} t1={122.3} text={<span>THE WHOLE <span style={{ color: "#ffd23a" }}>STORY</span></span>} y={960} size={84} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.28) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
