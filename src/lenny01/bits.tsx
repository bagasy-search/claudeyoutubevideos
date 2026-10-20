// lenny01 · piezas propias (las del kit se importan de kits/yanqui3d): agua gris que sube sobre el avatar, reloj de 15:00,
// la receta de la taza, el lápiz, la factura de $500 y el mundo 3D con blur de movimiento.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COL, FONT, e, ei, extrude, spr } from "../kits/yanqui3d/lib";
import { PipeWorld, K, FX, camSpeed } from "./pipe3d";

const op = (t: number, at: number, out: number) => e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));

// ---------- el mundo 3D con su cámara + blur de movimiento real ----------
export const W3: React.FC<{ t: number; kf: K[]; fx?: FX; blur?: number; dark?: number; night?: number }> = ({ t, kf, fx, blur = 0, dark = 0, night = 0 }) => {
  const v0 = camSpeed(t, kf), bx = Math.min(5, v0.bx * 0.5), by = Math.min(3.5, v0.by * 0.5), id = "lmb" + Math.round(t * 30);
  const f = blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : bx + by > 0.6 ? `url(#${id})` : dark > 0 ? `brightness(${1 - dark})` : undefined;
  return (
    <AbsoluteFill>
      {blur <= 0.2 && bx + by > 0.6 && <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>}
      <AbsoluteFill style={{ filter: f, transform: blur > 0.2 ? "scale(1.04)" : undefined }}><PipeWorld t={t} kf={kf} fx={fx} night={night} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- agua gris y grasosa que sube por la pantalla (el avatar "se inunda") ----------
export const GreyWater: React.FC<{ t: number; level: number }> = ({ t, level }) => {
  if (level <= 0.002) return null;
  const top = 1080 * (1 - level);
  const wave = (ph: number, amp: number) => Array.from({ length: 49 }, (_, i) => { const x = i * 40; return `${x},${top + Math.sin(x * 0.011 + t * 2.3 + ph) * amp + Math.sin(x * 0.027 - t * 3.1) * amp * 0.4}`; }).join(" ");
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d8774" stopOpacity={0.9} /><stop offset="0.25" stopColor="#5d5848" stopOpacity={0.93} /><stop offset="1" stopColor="#2c2a22" stopOpacity={0.97} /></linearGradient>
        </defs>
        <polygon points={`0,1080 ${wave(0, 9)} 1920,1080`} fill="url(#gw)" />
        <polyline points={wave(0, 9)} fill="none" stroke="rgba(235,228,200,.55)" strokeWidth={4} />
        <polyline points={wave(1.7, 6)} fill="none" stroke="rgba(180,200,210,.25)" strokeWidth={10} style={{ filter: "blur(4px)" }} />
        {/* brillo aceitoso + restos flotando */}
        {Array.from({ length: 14 }, (_, i) => { const x = (i * 157 + t * 18 * (i % 2 ? 1 : -1)) % 1920; return <ellipse key={i} cx={(x + 1920) % 1920} cy={top + 8 + Math.sin(t * 2 + i) * 5} rx={8 + (i % 4) * 4} ry={3} fill={i % 3 ? "#eee6c8" : "#7a8a3a"} opacity={0.85} />; })}
        {Array.from({ length: 5 }, (_, i) => <ellipse key={"o" + i} cx={300 + i * 330 + Math.sin(t + i) * 30} cy={top + 30 + i * 9} rx={120} ry={6} fill="none" stroke={`hsla(${40 + i * 50},60%,70%,.18)`} strokeWidth={3} />)}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- reloj de cocina 15:00 que corre (comprimido) ----------
export const Clock15: React.FC<{ t: number; at: number; run: [number, number]; out: number; x?: number; y?: number; label?: string; sc?: number }> = ({ t, at, run, out, x = 1500, y = 470, label = "15 MINUTES", sc = 1 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.9)), f = ei(t, run[0], run[1]), left = Math.round(900 * (1 - f));
  const mm = Math.floor(left / 60), ss = left % 60, R = 160, C = 2 * Math.PI * R, done = f >= 0.999;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(-12deg) scale(${(0.6 + 0.4 * k) * sc})`, fontFamily: FONT, textAlign: "center" }}>
      <svg width={380} height={380} style={{ filter: `drop-shadow(0 0 24px ${done ? "#5ee38f" : COL.amber}88) drop-shadow(0 30px 40px rgba(0,0,0,.6))` }}>
        <circle cx={190} cy={190} r={R} fill="rgba(10,10,12,.86)" stroke="rgba(255,255,255,.14)" strokeWidth={20} />
        <circle cx={190} cy={190} r={R} fill="none" stroke={done ? "#5ee38f" : COL.amber} strokeWidth={20} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={-C * f} transform="rotate(-90 190 190)" />
        <text x={190} y={222} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={104} fill={COL.ink}>{mm}:{String(ss).padStart(2, "0")}</text>
      </svg>
      <div style={{ marginTop: 8, fontWeight: 900, fontSize: 46, letterSpacing: 6, color: done ? "#5ee38f" : COL.ink, textShadow: extrude(6, "rgba(0,0,0,.75)"), whiteSpace: "nowrap" }}>{done ? "DONE ✓" : label}</div>
    </div>
  );
};

// ---------- la receta: ½ taza de bicarbonato + ½ taza de sal gruesa = LA TAZA ----------
export const Recipe: React.FC<{ t: number; at: number; at2: number; at3?: number; out: number; x?: number; y?: number; sc?: number }> = ({ t, at, at2, at3, out, x = 1420, y = 520, sc = 1 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const row = (a: number, n: string, sub: string, col: string) => {
    const k = Math.min(1.04, spr(t, a, 1)); if (t < a) return null;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: Math.min(1, k * 1.5), transform: `translateX(${(1 - k) * 160}px)` }}>
        <div style={{ width: 120, height: 120, borderRadius: 26, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 70, color: "#1d1a14", boxShadow: "inset 0 3px 0 rgba(255,255,255,.5), 0 16px 30px rgba(0,0,0,.5)" }}>½</div>
        <div><div style={{ fontWeight: 900, fontSize: 58, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.7)"), whiteSpace: "nowrap" }}>{n}</div><div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 4, color: COL.dim }}>{sub}</div></div>
      </div>
    );
  };
  const kk = at3 !== undefined ? Math.min(1.04, spr(t, at3, 1.2)) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateY(-10deg) scale(${sc})`, fontFamily: FONT }}>
      <div style={{ padding: "34px 44px", borderRadius: 30, background: "linear-gradient(180deg, rgba(24,22,18,.92), rgba(10,9,8,.92))", border: "3px solid rgba(255,255,255,.14)", boxShadow: "0 50px 90px rgba(0,0,0,.7)", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 8, color: COL.amber }}>THE CUP</div>
        {row(at, "BAKING SODA", "MILDLY ALKALINE · CUTS GREASE", "#f4f1ea")}
        {row(at2, "COARSE SALT", "KOSHER OR ROCK · SCRUBS", "#cfd8df")}
        {at3 !== undefined && t >= at3 && <div style={{ fontWeight: 900, fontSize: 44, letterSpacing: 4, color: "#5ee38f", opacity: Math.min(1, kk * 1.5), transform: `scale(${0.6 + 0.4 * kk})`, transformOrigin: "0 50%" }}>MIX DRY · THAT'S IT</div>}
      </div>
    </div>
  );
};

// ---------- el lápiz: "el caño queda del tamaño de un lápiz" ----------
export const Pencil: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1380, y = 860 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.9));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-6 + (1 - k) * -30}deg) scale(${0.5 + 0.5 * k})`, fontFamily: FONT, textAlign: "center" }}>
      <svg width={620} height={70} style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,.6))" }}>
        <polygon points="0,35 70,8 70,62" fill="#e8c9a0" /><polygon points="0,35 22,27 22,43" fill="#2a2a2a" />
        <rect x={70} y={8} width={470} height={54} fill="#f2b632" /><rect x={70} y={8} width={470} height={18} fill="#f7cb5a" />
        <rect x={540} y={8} width={34} height={54} fill="#b8b8b8" /><rect x={574} y={8} width={42} height={54} rx={10} fill="#e98a8a" />
      </svg>
      <div style={{ marginTop: 10, fontWeight: 900, fontSize: 44, letterSpacing: 5, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.75)") }}>THE SIZE OF A PENCIL</div>
    </div>
  );
};

// ---------- la factura del plomero: SERVICE CALL $500 ----------
export const Invoice: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; xAt?: number }> = ({ t, at, out, x = 1340, y = 540, xAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.8)), lines = [["SERVICE CALL", "$150"], ["SNAKE THE LINE", "$275"], ["PARTS & LABOR", "$75"]];
  const xk = xAt !== undefined ? ei(t, xAt, xAt + 0.35) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - k) * 50 - 10}deg) rotateZ(3deg) translateZ(${(1 - k) * -500}px)`, fontFamily: FONT }}>
      <div style={{ width: 560, padding: "34px 40px 30px", background: "linear-gradient(180deg,#fbf8f0,#ece6d6)", borderRadius: 8, boxShadow: "0 50px 90px rgba(0,0,0,.7)", color: "#2a241c", position: "relative" }}>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 8, color: "#8a2a1c" }}>INVOICE</div>
        <div style={{ height: 3, background: "#2a241c", margin: "14px 0 18px" }} />
        {lines.map(([a, b], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 30, margin: "8px 0", opacity: e(t, at + 0.25 + i * 0.22, at + 0.4 + i * 0.22) }}><span>{a}</span><span>{b}</span></div>)}
        <div style={{ height: 3, background: "#2a241c", margin: "16px 0 10px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 64, color: "#b3261a", opacity: e(t, at + 0.95, at + 1.1) }}><span>TOTAL</span><span>$500</span></div>
        {xk > 0 && <svg width={560} height={420} style={{ position: "absolute", left: 0, top: 0 }}><line x1={40} y1={60} x2={40 + 480 * xk} y2={60 + 300 * xk} stroke="#2fbf71" strokeWidth={16} strokeLinecap="round" /><line x1={520} y1={60} x2={520 - 480 * xk} y2={60 + 300 * xk} stroke="#2fbf71" strokeWidth={16} strokeLinecap="round" /></svg>}
      </div>
    </div>
  );
};

// ---------- rótulo de "cuidado" sobre la pantalla (una línea grande) ----------
export const Banner: React.FC<{ t: number; at: number; out: number; text: string; col?: string; y?: number; size?: number }> = ({ t, at, out, text, col = COL.ink, y = 130, size = 80 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 1));
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 8, color: col, textShadow: extrude(9, "rgba(0,0,0,.65)"), transform: `perspective(1000px) rotateX(${(1 - k) * -60}deg) scale(${0.85 + 0.15 * k})`, whiteSpace: "nowrap" }}>{text}</div>;
};

// ---------- toma agnes (ltx_<k>.mp4) que dura lo que la frase: si la toma es más corta, va en cámara lenta (≥0,55×) ----------
import { OffthreadVideo, Img, Sequence, staticFile } from "remotion";
import AVAIL from "./avail.json";
const AV_ = AVAIL as { clips: string[]; imgs: string[]; dur: Record<string, number> };
export const rateFor = (k: string, need: number) => { const d = AV_.dur[k] ?? 0; return d > 0 ? Math.max(0.55, Math.min(1, (d - 0.15) / Math.max(0.1, need))) : 1; };
export const Take: React.FC<{ t: number; k: string; a: number; need: number; from?: number; z?: [number, number] }> = ({ t, k, a, need, from = 0, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + Math.max(need, 3));
  const rate = rateFor(k, need + 0.7);
  const inner = AV_.clips.includes(k)
    ? <Sequence from={Math.round(a * 30)} layout="none"><OffthreadVideo src={staticFile("lenny01/ltx_" + k + ".mp4")} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : AV_.imgs.includes(k) ? <Img src={staticFile("lenny01/img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})`, overflow: "hidden" }}>{inner}</AbsoluteFill>;
};
