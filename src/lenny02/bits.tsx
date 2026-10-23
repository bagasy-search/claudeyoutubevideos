// lenny02 · piezas propias (las del kit se importan de kits/yanqui3d): el mundo 3D con blur de movimiento, la factura de la
// visita nocturna, el reloj de pared, el rótulo grande y la toma agnes/LTX que dura lo que la frase.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { COL, FONT, e, ei, extrude, spr } from "../kits/yanqui3d/lib";
import { ToiletWorld, K, FX, camSpeed } from "./toilet3d";
import AVAIL from "./avail.json";

const op = (t: number, at: number, out: number) => e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));

// ---------- el mundo 3D con su cámara + blur de movimiento real ----------
export const W3: React.FC<{ t: number; kf: K[]; fx?: FX; blur?: number; dark?: number; night?: number }> = ({ t, kf, fx, blur = 0, dark = 0, night = 0 }) => {
  const v0 = camSpeed(t, kf), bx = Math.min(5, v0.bx * 0.5), by = Math.min(3.5, v0.by * 0.5), id = "lmb" + Math.round(t * 30);
  const f = blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : bx + by > 0.6 ? `url(#${id})` : dark > 0 ? `brightness(${1 - dark})` : undefined;
  return (
    <AbsoluteFill>
      {blur <= 0.2 && bx + by > 0.6 && <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>}
      <AbsoluteFill style={{ filter: f, transform: blur > 0.2 ? "scale(1.04)" : undefined }}><ToiletWorld t={t} kf={kf} fx={fx} night={night} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- la visita nocturna: AFTER-HOURS CALL $150 → $300 ----------
export const NightBill: React.FC<{ t: number; at: number; at2: number; out: number; x?: number; y?: number; more?: number }> = ({ t, at, at2, out, x = 1320, y = 540, more }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.8)), lo = Math.round(150 * Math.min(1, ei(t, at + 0.3, at + 0.9))), hi = Math.round(150 + 150 * ei(t, at2, at2 + 0.6));
  const mk = more !== undefined ? spr(t, more, 1) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - k) * 50 - 10}deg) rotateZ(3deg) translateZ(${(1 - k) * -500}px)`, fontFamily: FONT }}>
      <div style={{ width: 600, padding: "34px 40px 30px", background: "linear-gradient(180deg,#fbf8f0,#ece6d6)", borderRadius: 8, boxShadow: "0 50px 90px rgba(0,0,0,.7)", color: "#2a241c" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 30, letterSpacing: 6, color: "#8a2a1c" }}><span>INVOICE</span><span>9:00 PM</span></div>
        <div style={{ height: 3, background: "#2a241c", margin: "14px 0 18px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 32 }}><span>AFTER-HOURS CALL</span><span>TOILET</span></div>
        <div style={{ height: 3, background: "#2a241c", margin: "18px 0 10px" }} />
        <div style={{ fontWeight: 900, fontSize: 84, color: "#b3261a", textAlign: "right", whiteSpace: "nowrap" }}>${lo}{t >= at2 ? ` – $${hi}` : ""}</div>
        {mk > 0.01 && <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 4, color: "#b3261a", textAlign: "right", opacity: Math.min(1, mk), transform: `scale(${0.6 + 0.4 * Math.min(1, mk)})`, transformOrigin: "100% 50%" }}>+ PULL THE TOILET</div>}
      </div>
    </div>
  );
};

// ---------- reloj de pared: las 9 de la noche ----------
export const WallClock: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; label?: string }> = ({ t, at, out, x = 1480, y = 420, label = "9 O'CLOCK AT NIGHT" }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 0.9)), mn = (t - at) * 40, R = 150;
  const hand = (deg: number, len: number, w: number, c: string) => <line x1={180} y1={180} x2={180 + Math.sin(deg * Math.PI / 180) * len} y2={180 - Math.cos(deg * Math.PI / 180) * len} stroke={c} strokeWidth={w} strokeLinecap="round" />;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(-12deg) scale(${0.6 + 0.4 * k})`, fontFamily: FONT, textAlign: "center" }}>
      <svg width={360} height={360} style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <circle cx={180} cy={180} r={R} fill="#f4efe2" stroke="#2a241c" strokeWidth={14} />
        {Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return <line key={i} x1={180 + Math.sin(a) * 120} y1={180 - Math.cos(a) * 120} x2={180 + Math.sin(a) * 136} y2={180 - Math.cos(a) * 136} stroke="#2a241c" strokeWidth={i % 3 ? 4 : 9} />; })}
        {hand(270 + mn / 12, 70, 12, "#2a241c")}{hand(mn * 6, 108, 7, "#2a241c")}<circle cx={180} cy={180} r={10} fill="#b3261a" />
      </svg>
      <div style={{ marginTop: 6, fontWeight: 900, fontSize: 44, letterSpacing: 5, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.75)"), whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// ---------- rótulo grande de una línea ----------
export const Banner: React.FC<{ t: number; at: number; out: number; text: string; col?: string; y?: number; size?: number }> = ({ t, at, out, text, col = COL.ink, y = 130, size = 80 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.04, spr(t, at, 1));
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 8, color: col, textShadow: extrude(9, "rgba(0,0,0,.65)"), transform: `perspective(1000px) rotateX(${(1 - k) * -60}deg) scale(${0.85 + 0.15 * k})`, whiteSpace: "nowrap" }}>{text}</div>;
};

// ---------- toma (ltx_<k>.mp4) que dura lo que la frase: si es más corta va en cámara lenta (≥0,55×); sin toma → img_<k>.jpg o img_<alt>.jpg ----------
const AV_ = AVAIL as { clips: string[]; imgs: string[]; dur: Record<string, number> };
export const rateFor = (k: string, need: number) => { const d = AV_.dur[k] ?? 0; return d > 0 ? Math.max(0.55, Math.min(1, (d - 0.15) / Math.max(0.1, need))) : 1; };
export const Take: React.FC<{ t: number; k: string; a: number; need: number; from?: number; z?: [number, number]; alt?: string; rate?: number }> = ({ t, k, a, need, from = 0, z = [1.03, 1.1], alt, rate }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + Math.max(need, 3));
  const r = rate ?? rateFor(k, need + 0.7);
  const im = AV_.imgs.includes(k) ? k : alt && AV_.imgs.includes(alt) ? alt : null;
  const inner = AV_.clips.includes(k)
    ? <Sequence from={Math.round(a * 30)} layout="none"><OffthreadVideo src={staticFile("lenny02/ltx_" + k + ".mp4")} startFrom={Math.round(from * 30)} playbackRate={r} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : im ? <Img src={staticFile("lenny02/img_" + im + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})`, overflow: "hidden" }}>{inner}</AbsoluteFill>;
};
