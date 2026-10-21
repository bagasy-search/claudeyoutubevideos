// elmer01 · RESTO tramo 1 (61,6 → 256 s): herramientas en LA GUÍA 3D (CTA 1) → sellos HT/MB → roble pesado → feed store →
// largueros vs tacos → la palanca que raja → clavos anillados → la sierra sable entre tabla y larguero → tap tap → 21 + 9 →
// las 3 pilas → el error de los $40 → el imán con rayos X. Piezas NUEVAS de este tramo; todo entra con at("frase").
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Key, PT } from "./garage3d";
import { at, Pic, scr } from "./core";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

export const T1 = {
  saw: at("a circular saw", 65), recip: at("a reciprocating saw", 66), yard: at("yard sale", 69), drill: at("a drill", 71), hammer: at("a hammer", 73),
  nailset: at("a nail set", 74), hatchet: at("a hatchet", 75), chisel: at("a chisel", 76), square: at("a square", 77), tape: at("a tape measure", 78),
  thatsIt: at("that's it", 80), noTable: at("no table saw", 80), noPlaner: at("no planer", 81), noRouter: at("no router", 82),
  pallets: at("the pallets", 87), safe: at("not every pallet", 91), turn: at("turn it over", 94), stamp: at("little stamp", 96), two: at("two letters", 97), ht: at("ht", 98),
  good: at("good wood", 102), mb: at("mb", 104), chem: at("chemical", 107), cut: at("cut it", 108), sand: at("sand it", 109), breathe: at("breathe it", 109), leave: at("leave it", 110),
  stains: at("dark stains", 112), oily: at("oily smell", 113), heavy: at("heavy ones", 117),
  oak: at("oak stringers", 121), strong: at("strong", 123), feed: at("feed store", 125), give: at("give them away", 127), happy: at("happy", 128),
  blocks: at("some pallets have blocks", 139), corners: at("corners", 143), noGood: at("no good", 145), want: at("you want the stringers", 146),
  frame: at("your frame", 149), leg: at("your leg", 150), cleat: at("your cleat", 151), three: at("three stringer pallets", 151), quit: at("quit", 157),
  crowbar: at("crowbar", 158), crack: at("crack", 160), splits: at("it splits", 161), next: at("the next one splits", 163), junk: at("junk", 165),
  ringIn: at("those nails", 170), notPull: at("i don't pull", 173), recipT: at("reciprocating saw", 175), slide: at("slide it", 178), between: at("between the deck", 179), cutN: at("cut the nails", 181),
  whole: at("not a crack", 186), flip: at("flip it over", 188), nailSet2: at("a nail set", 189), tap1: at("tap", 193), tap2: at("tap", 193.8), fall: at("fall right out", 194),
  three21: at("three pallets gave", 196), b21: at("21", 197), nine: at("nine stringers", 198),
  sort: at("sort them", 205), piles: at("three piles", 206), first: at("first pile", 209), top: at("your top", 210), second: at("second pile", 216),
  shelf: at("the shelf", 218), burn: at("burn pile", 221), dont: at("don't try", 223), bad: at("one bad board", 226), years: at("20 years", 228),
  b40: at("$40", 232), string: at("on a string", 238), tips: at("broken nail tips", 240), see: at("you can't see", 243), finds: at("finds them", 244),
  both: at("both sides", 250), grabs: at("grabs", 252), dig: at("dig it out", 253), around: at("cut around", 254), meas: at("the measurements", 256),
};
const T = T1;
const TOOLT = [T.saw, T.recip, T.drill, T.hammer, T.nailset, T.hatchet, T.chisel, T.square, T.tape];
export const ticksAt = (t: number) => TOOLT.filter((x) => t >= x + 0.15).length;

// cámara del tramo 1 (sólo cuenta donde se ve el mundo)
export const K1: Key[] = [
  { t: 65.0, p: [-3.2, 6.2, 8.0], l: [-8.7, 2.8, 2.2], fov: 38 },
  { t: 65.6, p: [-3.4, 6.0, 7.8], l: [-8.7, 2.8, 2.2], fov: 38 },
  { t: T.saw + 0.6, p: [-3.0, 5.8, 8.2], l: [-9.0, 2.6, 2.6], fov: 38 },
  { t: T.thatsIt - 0.4, p: [-3.6, 5.2, 7.2], l: [-9.0, 2.5, 2.4], fov: 36 },
  { t: T.noRouter + 0.6, p: [-3.2, 5.6, 7.8], l: [-9.0, 2.6, 2.4], fov: 38 },
  // los pallets de la entrada
  { t: 87.3, p: [14.5, 6.0, 26.0], l: [6.5, 1.0, 15.5], fov: 38 },
  { t: T.safe, p: [11.6, 3.6, 21.0], l: [6.5, 1.0, 15.5], fov: 34 },
  { t: T.turn + 0.4, p: [10.4, 2.6, 19.4], l: [6.6, 0.8, 15.6], fov: 32 },
  // tramo final: vuelta al banco para las medidas (CTA 2)
  { t: 251.0, p: [-2.6, 7.0, 9.4], l: [-8.8, 2.6, 2.0], fov: 40 },
  { t: T.meas, p: [-3.4, 6.0, 7.8], l: [-8.7, 2.8, 2.2], fov: 38 },
];

// ================= PIEZAS NUEVAS =================
// foto Polaroid que cae y rebota sobre la escena (la sierra de $20 de la venta de garaje)
export const Polaroid: React.FC<{ t: number; at: number; out: number; img: string; x: number; y: number; cap: string; rot?: number }> = ({ t, at, out, img, x, y, cap, rot = 6 }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -500}px) rotate(${rot + (1 - Math.min(1, k)) * 18}deg)` }}>
      <div style={{ background: "#fbf8f0", padding: "18px 18px 70px", boxShadow: "0 40px 70px rgba(0,0,0,.65)" }}>
        <Img src={staticFile(P + "img_" + img + ".jpg")} style={{ width: 560, height: 315, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: "'Segoe Script','Brush Script MT',cursive", fontSize: 40, color: "#2a2014" }}>{cap}</div>
      </div>
    </div>
  );
};
// sellos "NO ___" que se estampan en fila
const NoStamps: React.FC<{ t: number; items: [string, number][]; out: number; y: number }> = ({ t, items, out, y }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 40, opacity: 1 - e(t, out, out + 0.3) }}>
    {items.map(([n, a], i) => {
      const k = spr(t, a, 1.3); if (t < a) return <div key={i} style={{ width: 360 }} />;
      return <div key={i} style={{ width: 360, transform: `rotate(${-7 + i * 5}deg) scale(${2.2 - 1.2 * Math.min(1, k)})`, opacity: Math.min(1, (t - a) * 8), border: `8px solid ${COL.red}`, borderRadius: 14, padding: "10px 0", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 50, color: COL.red, letterSpacing: 3, background: "rgba(20,8,6,.55)", textShadow: "0 2px 0 rgba(0,0,0,.4)" }}>NO {n}</div>;
    })}
  </div>
);
// sello de goma que baja y deja la tinta (HT verde / MB rojo)
const StampPress: React.FC<{ t: number; at: number; out: number; x: number; y: number; txt: string; sub: string; ok: boolean }> = ({ t, at, out, x, y, txt, sub, ok }) => {
  const o = e(t, at - 0.3, at - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const down = t < at ? ei(t, at - 0.35, at) : 1 - ei(t, at + 0.12, at + 0.45);
  const ink = t >= at ? 1 : 0, col = ok ? "#24c27a" : COL.red;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {ink > 0 && <div style={{ position: "absolute", left: -230, top: -110, width: 460, height: 220, border: `12px solid ${col}`, borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(-4deg) scale(${1 + 0.15 * (1 - e(t, at, at + 0.15))})`, fontFamily: FONT, color: col, background: "rgba(10,10,10,.35)", mixBlendMode: "normal" }}>
        <div style={{ fontWeight: 900, fontSize: 120, lineHeight: 1, letterSpacing: 10 }}>{txt}</div>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 5, opacity: e(t, at + 0.3, at + 0.5) }}>{sub}</div>
      </div>}
      {down > 0.01 && <div style={{ position: "absolute", left: -150, top: -330 - (1 - down) * 400, width: 300, transform: "rotate(-4deg)" }}>
        <div style={{ margin: "0 auto", width: 90, height: 150, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(90deg,#5b3a1c,#9a6a3a 50%,#5b3a1c)" }} />
        <div style={{ height: 50, borderRadius: 8, background: "linear-gradient(180deg,#3a3d42,#1d1f22)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
      </div>}
    </div>
  );
};
// fila de peligros tachados (cortar / lijar / respirar)
const HazardRow: React.FC<{ t: number; items: [string, string, number][]; out: number; x: number; y: number }> = ({ t, items, out, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 34, opacity: 1 - e(t, out, out + 0.3) }}>
    {items.map(([ic, n, a], i) => {
      if (t < a) return null; const k = Math.min(1, spr(t, a, 1.2)), x2 = e(t, a + 0.15, a + 0.35);
      return (
        <div key={i} style={{ width: 200, height: 230, borderRadius: 24, background: "rgba(20,10,8,.78)", boxShadow: `0 0 0 4px ${COL.red}, 0 20px 40px rgba(0,0,0,.6)`, transform: `scale(${k})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: FONT }}>
          <div style={{ fontSize: 100 }}>{ic}</div>
          <div style={{ fontWeight: 900, fontSize: 30, color: COL.ink, letterSpacing: 3 }}>{n}</div>
          <svg width={200} height={230} style={{ position: "absolute", inset: 0 }}><line x1={30} y1={200} x2={170} y2={30} stroke={COL.red} strokeWidth={12} strokeLinecap="round" strokeDasharray={230} strokeDashoffset={230 * (1 - x2)} /></svg>
        </div>
      );
    })}
  </div>
);
// líneas de olor que suben (aceitoso) + mancha que se expande
const Smell: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <svg width={500} height={420} style={{ position: "absolute", left: x - 250, top: y - 380, opacity: o, overflow: "visible", filter: "drop-shadow(0 0 8px rgba(120,200,60,.6))" }}>
      {[0, 1, 2].map((i) => { const ph = (t - at) * 1.6 + i * 0.33; const k = ph % 1; return <path key={i} d={`M ${170 + i * 80} 380 C ${130 + i * 80} 300, ${210 + i * 80} 240, ${170 + i * 80} 160 S ${210 + i * 80} 60, ${170 + i * 80} 10`} fill="none" stroke="#9bd66b" strokeWidth={10} strokeLinecap="round" opacity={0.85 * Math.sin(k * Math.PI)} transform={`translate(0 ${-k * 60})`} />; })}
    </svg>
  );
};
// balanza colgante: la aguja se va a "OAK"
const HangScale: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = spr(t, at, 0.9), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ang = -70 + 140 * Math.min(1.08, ei(t, at + 0.2, at + 1.0)) + Math.sin((t - at) * 9) * 5 * Math.exp(-(t - at) * 2.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,0) scale(${Math.min(1.05, k)})` }}>
      <svg width={360} height={420} viewBox="0 0 360 420" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <line x1={180} y1={0} x2={180} y2={60} stroke="#ccc" strokeWidth={6} />
        <circle cx={180} cy={210} r={150} fill="#f2eee4" stroke="#3a3d42" strokeWidth={16} />
        {Array.from({ length: 15 }, (_, i) => { const a = (-70 + i * 10) * Math.PI / 180; return <line key={i} x1={180 + Math.sin(a) * 120} y1={210 - Math.cos(a) * 120} x2={180 + Math.sin(a) * 138} y2={210 - Math.cos(a) * 138} stroke="#333" strokeWidth={i % 7 === 0 ? 6 : 3} />; })}
        <text x={95} y={150} fontFamily="Arial" fontWeight={900} fontSize={30} fill="#888">PINE</text>
        <text x={215} y={150} fontFamily="Arial" fontWeight={900} fontSize={36} fill="#b3261e">OAK</text>
        <line x1={180} y1={210} x2={180 + Math.sin(ang * Math.PI / 180) * 125} y2={210 - Math.cos(ang * Math.PI / 180) * 125} stroke="#b3261e" strokeWidth={9} strokeLinecap="round" />
        <circle cx={180} cy={210} r={16} fill="#3a3d42" />
        <path d="M150 360 Q180 410 210 360" fill="none" stroke="#3a3d42" strokeWidth={10} />
      </svg>
    </div>
  );
};
// mapita vectorial: casa → feed store con la camioneta que recorre la ruta
const MiniMap: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const d = ei(t, at + 0.2, at + 1.6), path = "M 60 300 C 160 300, 170 160, 300 170 S 420 70, 520 80";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
      <div style={{ transform: "rotateX(38deg) rotateZ(-6deg)", width: 600, height: 380, borderRadius: 22, background: "linear-gradient(160deg,#dfe9c9,#c8d8a8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
        <svg width={600} height={380} style={{ position: "absolute", inset: 0 }}>
          {[[0, 60, 600, 120], [0, 250, 600, 330]].map(([a, b, c, dd], i) => <path key={i} d={`M ${a} ${b} L ${c} ${dd}`} stroke="rgba(120,140,90,.5)" strokeWidth={14} />)}
          <path d={path} fill="none" stroke="#fff" strokeWidth={18} strokeLinecap="round" />
          <path d={path} fill="none" stroke="#e8613a" strokeWidth={10} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - d)} />
          <rect x={30} y={270} width={60} height={50} fill="#8a5a2e" /><polygon points="25,272 60,240 95,272" fill="#5b3a1c" />
          <rect x={490} y={40} width={80} height={60} fill="#b3261e" /><rect x={505} y={70} width={22} height={30} fill="#fff" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 470, top: -40, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 3, textShadow: extrude(5, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>FEED STORE</div>
      <div style={{ position: "absolute", left: 10, top: 380, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.amber, letterSpacing: 4, textShadow: extrude(6, "rgba(0,0,0,.6)"), opacity: e(t, at + 1.2, at + 1.5), whiteSpace: "nowrap" }}>3 PALLETS · $0</div>
    </div>
  );
};
// veredicto sobre la foto: recuadros con ✓ / ✗ (largueros vs tacos)
const Verdict: React.FC<{ t: number; boxes: { at: number; x: number; y: number; w: number; h: number; ok: boolean; label: string }[]; out: number }> = ({ t, boxes, out }) => (
  <AbsoluteFill style={{ opacity: 1 - e(t, out, out + 0.3), pointerEvents: "none" }}>
    {boxes.map((b, i) => {
      if (t < b.at) return null; const k = e(t, b.at, b.at + 0.35), col = b.ok ? "#24c27a" : COL.red;
      return (
        <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h }}>
          <svg width={b.w} height={b.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}><rect x={4} y={4} width={b.w - 8} height={b.h - 8} rx={20} fill={b.ok ? "rgba(36,194,122,.12)" : "rgba(255,74,61,.12)"} stroke={col} strokeWidth={9} strokeDasharray={2 * (b.w + b.h)} strokeDashoffset={2 * (b.w + b.h) * (1 - k)} /></svg>
          <div style={{ position: "absolute", left: "50%", top: -95, transform: `translateX(-50%) scale(${Math.min(1.08, spr(t, b.at + 0.25))})`, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: col, letterSpacing: 4, textShadow: extrude(6, "rgba(0,0,0,.7)"), whiteSpace: "nowrap" }}>{b.ok ? "✓ " : "✗ "}{b.label}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);
// larguero que se parte en 3 destinos: BASTIDOR / PATA / CLEAT
const StringerSplit: React.FC<{ t: number; at: [number, number, number]; out: number; y: number }> = ({ t, at, out, y }) => {
  const o = e(t, at[0] - 0.3, at[0]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const names = ["FRAME", "LEG", "CLEAT"], cols = [COL.amber, COL.ice, "#fff"];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 300, opacity: o, perspective: 1400 }}>
      {names.map((n, i) => {
        const k = ei(t, at[i], at[i] + 0.5), xs = 960 + (i - 1) * 520 * k;
        return (
          <div key={n} style={{ position: "absolute", left: xs - 230, top: 40 + (i === 1 ? 0 : 30) * k, width: 460, transform: `rotateX(25deg) rotateZ(${(i - 1) * 6 * k}deg)` }}>
            <div style={{ height: 70, borderRadius: 6, background: "repeating-linear-gradient(90deg, rgba(90,55,25,.18) 0 2px, transparent 2px 22px), linear-gradient(180deg,#d6aa72,#a87a48)", boxShadow: "0 25px 40px rgba(0,0,0,.6)", opacity: i === 0 || k > 0.02 ? 1 : 0 }} />
            <div style={{ textAlign: "center", marginTop: 26, fontFamily: FONT, fontWeight: 900, fontSize: 60, color: cols[i], letterSpacing: 6, textShadow: extrude(6, "rgba(0,0,0,.6)"), opacity: e(t, at[i] + 0.2, at[i] + 0.4) }}>{n}</div>
          </div>
        );
      })}
    </div>
  );
};
// la rajadura: línea quebrada que corre por la tabla + "JUNK?" que se tacha después
const Crack: React.FC<{ t: number; at: number; x: number; y: number; len: number; out: number }> = ({ t, at, x, y, len, out }) => {
  const o = e(t, at - 0.05, at) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pts = Array.from({ length: 14 }, (_, i) => `${x + (len / 13) * i},${y + (i % 2 ? 18 : -14) * (i % 3 === 0 ? 1.6 : 1)}`).join(" ");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, filter: "drop-shadow(0 0 10px rgba(255,255,255,.7))" }}>
      <polyline points={pts} fill="none" stroke="#fff" strokeWidth={7} strokeLinejoin="bevel" strokeDasharray={len * 1.4} strokeDashoffset={len * 1.4 * (1 - ei(t, at, at + 0.22))} />
    </svg>
  );
};
export const BigWord: React.FC<{ t: number; at: number; out: number; txt: string; x: number; y: number; col?: string; size?: number; strike?: number; rot?: number }> = ({ t, at, out, txt, x, y, col = COL.ink, size = 150, strike, rot = -4 }) => {
  const k = spr(t, at, 1.2), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sk = strike !== undefined ? e(t, strike, strike + 0.25) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${Math.min(1.08, k)})`, fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 6, textShadow: extrude(10, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>
      {txt}
      {sk > 0 && <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 18, background: COL.red, transform: `scaleX(${sk}) rotate(-3deg)`, transformOrigin: "0 50%", borderRadius: 9 }} />}
    </div>
  );
};
// clavo anillado gigante (vector): los anillos agarran la fibra
const RingNail: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = spr(t, at, 0.9), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pull = Math.max(0, Math.sin((t - at - 1.0) * 5)) * 14 * (t > at + 1 ? 1 : 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-90deg) scale(${Math.min(1.05, k)})` }}>
      <svg width={900} height={260} viewBox="0 0 900 260" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <rect x={360} y={0} width={540} height={260} fill="#b98a55" />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M 360 ${20 + i * 24} Q 620 ${10 + i * 26} 900 ${22 + i * 24}`} stroke="rgba(90,55,25,.35)" strokeWidth={3} fill="none" />)}
        <g transform={`translate(${-pull} 0)`}>
          <rect x={60} y={95} width={40} height={70} rx={6} fill="#8f969e" />
          <rect x={100} y={116} width={700} height={28} fill="#a9b0b8" />
          {Array.from({ length: 18 }, (_, i) => <polygon key={i} points={`${380 + i * 22},110 ${398 + i * 22},130 ${380 + i * 22},150`} fill="#7d848c" />)}
          <polygon points="800,116 860,130 800,144" fill="#a9b0b8" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 300, top: -90, transform: "rotate(90deg)", transformOrigin: "0 0", fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.amber, letterSpacing: 4, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>RING SHANK</div>
    </div>
  );
};
// corte de la unión (CSS 3D): tabla sobre larguero con 3 clavos; la hoja de la sierra sable entra por el medio y los corta
const NailCut: React.FC<{ t: number; at: number; cut: number; out: number; x: number; y: number }> = ({ t, at, cut, out, x, y }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const bl = ei(t, at + 0.4, cut), lift = ei(t, cut + 0.4, cut + 1.1) * 60;
  const wood = (l: number) => `repeating-linear-gradient(90deg, rgba(90,55,25,.16) 0 2px, transparent 2px 19px), linear-gradient(180deg, hsl(32,48%,${l}%), hsl(30,45%,${l - 9}%))`;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", perspective: 1600 }}>
      <div style={{ position: "relative", width: 1100, height: 440, transformStyle: "preserve-3d", transform: `rotateX(-12deg) rotateY(${-18 + 4 * Math.sin(t * 0.6)}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 70 - lift, width: 1100, height: 80, backgroundImage: wood(66), boxShadow: "0 18px 30px rgba(0,0,0,.45)", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 0, top: 170, width: 1100, height: 230, backgroundImage: wood(56), borderRadius: 4 }} />
        {[220, 550, 880].map((nx, i) => {
          const cutK = bl * 1100 > nx + 30 ? 1 : 0;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: nx - 9, top: 50 - lift, width: 18, height: 30, borderRadius: 4, background: "#8f969e" }} />
              <div style={{ position: "absolute", left: nx - 5, top: 80 - lift, width: 10, height: 75, background: "repeating-linear-gradient(180deg,#a9b0b8 0 6px,#7d848c 6px 9px)" }} />
              <div style={{ position: "absolute", left: nx - 5, top: 170 + (cutK ? 0 : -15), width: 10, height: 120 + (cutK ? 0 : 15), background: "repeating-linear-gradient(180deg,#a9b0b8 0 6px,#7d848c 6px 9px)" }} />
              {cutK > 0 && t < cut + 0.6 && <div style={{ position: "absolute", left: nx - 30, top: 140, width: 60, height: 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,140,.95), transparent 70%)", opacity: 1 - e(t, cut - 0.3, cut + 0.6) }} />}
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: -1150 + bl * 1150, top: 152, width: 1150, height: 16, background: "linear-gradient(180deg,#e6e9ec,#9aa1a8)", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)", boxShadow: "0 0 18px rgba(255,255,255,.5)" }}>
          <div style={{ position: "absolute", right: 0, top: 16, width: 1150, height: 8, background: "repeating-linear-gradient(90deg,#9aa1a8 0 8px,transparent 8px 14px)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: -90, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: COL.amber, letterSpacing: 4, textShadow: extrude(6, "rgba(0,0,0,.6)"), opacity: e(t, cut, cut + 0.3), whiteSpace: "nowrap" }}>CUT THE NAILS · NOT THE BOARD</div>
    </div>
  );
};
// "TAP" que salta con onda
const Tap: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const k = (t - at) / 0.6; if (k < 0 || k > 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y - 70 * k, opacity: 1 - k * k, transform: `translate(-50%,-50%) scale(${0.7 + 0.6 * Math.min(1, k * 5)}) rotate(-8deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#fff", letterSpacing: 4, textShadow: extrude(7, "rgba(0,0,0,.6)") }}>TAP</div>
  );
};
// conteo de tablas: cada tabla cae a la pila y suma (21 tablas + 9 largueros)
export const Tally: React.FC<{ t: number; at: number; at2: number; out: number; x: number; y: number }> = ({ t, at, at2, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = Math.min(21, Math.floor(ei(t, at, at + 1.3) * 21)), m = Math.min(9, Math.floor(ei(t, at2, at2 + 0.8) * 9));
  const col = (cnt: number, max: number, h: number, c: string, lbl: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: c, lineHeight: 1, textShadow: extrude(10, "rgba(0,0,0,.6)") }}>{cnt}</div>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 3, height: max * (h + 3), marginTop: 10, width: 200 }}>
        {Array.from({ length: cnt }, (_, i) => <div key={i} style={{ width: 200, height: h, borderRadius: 3, background: `linear-gradient(180deg, hsl(32,50%,${64 - (i % 3) * 4}%), hsl(30,45%,52%))`, boxShadow: "0 3px 5px rgba(0,0,0,.4)" }} />)}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 4, marginTop: 14 }}>{lbl}</div>
    </div>
  );
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 70, alignItems: "flex-end" }}>{col(n, 21, 14, COL.amber, "DECK BOARDS")}{t > at2 && col(m, 9, 30, COL.ice, "STRINGERS")}</div>;
};
// 3 carteles de estaca clavados en las pilas (1 TOP · 2 SHELF · 3 BURN)
const PileSign: React.FC<{ t: number; at: number; out: number; x: number; y: number; n: string; lbl: string; col: string; fire?: boolean }> = ({ t, at, out, x, y, n, lbl, col, fire }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-100%) translateY(${(1 - Math.min(1, k)) * -260}px) rotate(${Math.sin((t - at) * 6) * 4 * Math.exp(-(t - at) * 2)}deg)` }}>
      <div style={{ padding: "12px 30px", borderRadius: 10, background: "linear-gradient(180deg,#e9d3a8,#c8a46e)", boxShadow: `0 20px 30px rgba(0,0,0,.55), inset 0 0 0 4px ${col}`, fontFamily: FONT, fontWeight: 900, color: "#2a1a08", textAlign: "center", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 70, lineHeight: 1, color: col }}>{n}</div><div style={{ fontSize: 34, letterSpacing: 4 }}>{lbl}</div>
      </div>
      <div style={{ margin: "0 auto", width: 18, height: 140, background: "linear-gradient(90deg,#6b4a2a,#9a6a3a)" }} />
      {fire && <div style={{ position: "absolute", left: "50%", top: 120, transform: "translateX(-50%)", fontSize: 110, filter: `brightness(${1 + 0.2 * Math.sin(t * 20)})` }}>🔥</div>}
    </div>
  );
};
// etiqueta de precio que se rompe en dos ($40 la hoja)
export const PriceRip: React.FC<{ t: number; at: number; out: number; x: number; y: number; txt: string }> = ({ t, at, out, x, y, txt }) => {
  const k = spr(t, at, 1.1), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const rip = ei(t, at + 0.55, at + 1.0);
  const half = (side: number) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: 420, height: 220, clipPath: side < 0 ? "polygon(0 0,52% 0,46% 30%,54% 55%,47% 80%,52% 100%,0 100%)" : "polygon(52% 0,100% 0,100% 100%,52% 100%,47% 80%,54% 55%,46% 30%)", transform: `translateX(${side * rip * 60}px) rotate(${side * rip * 12}deg)` }}>
      <div style={{ width: 420, height: 220, borderRadius: 18, background: "linear-gradient(180deg,#fff2a8,#f1c21b)", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 130, color: "#2a1a08" }}>{txt}</div>
    </div>
  );
  return <div style={{ position: "absolute", left: x - 210, top: y - 110, width: 420, height: 220, opacity: o, transform: `scale(${Math.min(1.05, k)})`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>{half(-1)}{half(1)}</div>;
};
// tabla con banda de RAYOS X que la recorre: aparecen las puntas de clavo escondidas
const XRayBoard: React.FC<{ t: number; at: number; out: number; y: number; hits: number[] }> = ({ t, at, out, y, hits }) => {
  const o = e(t, at, at + 0.25) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sx = 120 + ((t - at) * 520) % 1680, W2 = 1680;
  const tips = [[300, 40], [690, 95], [1060, 30], [1420, 80]];
  return (
    <div style={{ position: "absolute", left: 120, top: y, width: W2, height: 170, opacity: o, perspective: 1500 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(30deg)", borderRadius: 6, background: "repeating-linear-gradient(90deg, rgba(90,55,25,.16) 0 2px, transparent 2px 24px), linear-gradient(180deg,#b9936a,#8d6a46)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: sx - 120 - 90, top: 0, width: 180, height: 170, background: "linear-gradient(90deg, transparent, rgba(120,220,255,.55), transparent)", mixBlendMode: "screen" }} />
        {tips.map(([px, py], i) => {
          const seen = sx - 120 > px || hits.some((h) => t > h);
          return seen ? <div key={i} style={{ position: "absolute", left: px - 22, top: py, width: 44, height: 12, borderRadius: 6, background: "#dff6ff", boxShadow: "0 0 18px 6px rgba(140,220,255,.9)", transform: `rotate(${i * 23 - 30}deg)` }} /> : null;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: -90, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: COL.ice, letterSpacing: 5, textShadow: extrude(6, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>HIDDEN NAIL TIPS</div>
    </div>
  );
};
const Dark: React.FC<{ o: number }> = ({ o }) => (o > 0.005 ? <AbsoluteFill style={{ background: `rgba(8,6,4,${o})` }} /> : null);

// la lista de herramientas escrita a lápiz en un retazo de terciado, se tilda por palabra
const TOOLN = ["CIRCULAR SAW", "RECIP SAW", "DRILL", "HAMMER", "NAIL SET", "HATCHET", "CHISEL", "SQUARE", "TAPE"];
const ToolList: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = ticksAt(t);
  return (
    <div style={{ position: "absolute", left: 1230, top: 140, width: 560, opacity: o, transform: `rotate(3deg) translateY(${(1 - Math.min(1, spr(t, at))) * 300}px)`, padding: "26px 34px", borderRadius: 10, backgroundImage: "repeating-linear-gradient(90deg, rgba(120,80,40,.10) 0 2px, transparent 2px 31px), linear-gradient(180deg,#e7cfa3,#d2b07a)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT }}>
      {TOOLN.map((s, i) => <div key={s} style={{ display: "flex", gap: 16, alignItems: "center", fontWeight: 800, fontSize: 40, color: "#3a2a18", opacity: i < n + 1 ? 1 : 0.3, lineHeight: 1.35 }}><span style={{ width: 40, color: "#1a7a4c", fontWeight: 900 }}>{i < n ? "✓" : "□"}</span>{s}</div>)}
    </div>
  );
};

// ================= TRAMO 1 =================
export const seg1 = (t: number, L: React.ReactNode[], World: (k: string) => React.ReactNode) => {
  // --- herramientas sobre LA GUÍA (65,6-83,8) ---
  if (t >= 65.4 && t < 84.2) {
    L.push(World("w1"));
    L.push(<Polaroid key="pol" t={t} at={T.yard - 0.6} out={T.drill - 0.2} img="r02_yardsale" x={1460} y={330} cap="$20 · yard sale" />);
    L.push(<ToolList key="tl" t={t} at={T.saw - 0.4} out={83.6} />);
    L.push(<NoStamps key="ns" t={t} items={[["TABLE SAW", T.noTable], ["PLANER", T.noPlaner], ["ROUTER", T.noRouter]]} out={83.6} y={150} />);
  }
  // --- pallets de la entrada → portal a la foto del sello → HT ---
  if (t >= 87.2 && t < 97.6) {
    L.push(World("w2"));
    const pp = scr(K1, t, PT.pallets);
    const r = ei(t, T.turn - 0.1, T.turn + 0.45);
    if (r > 0) L.push(<AbsoluteFill key="pS" style={{ clipPath: `circle(${r * 2300}px at ${pp.x}px ${pp.y}px)` }}><Pic id="r03_stamp" t={t} a={T.turn} mv="in" ox="40% 60%" /></AbsoluteFill>);
  }
  if (t >= T.stamp - 0.4 && t < 97.6) L.push(<AbsoluteFill key="ht0" style={{ opacity: e(t, T.stamp - 0.4, T.stamp) }}><Pic id="n01_ht" t={t} a={T.stamp - 0.4} mv="out" /></AbsoluteFill>);
  // --- (avatar 97,4-101,2) → HT bueno / MB malo ---
  if (t >= 101.0 && t < 115.4) {
    const mbK = e(t, T.mb - 0.3, T.mb);
    L.push(<AbsoluteFill key="ht1" style={{ opacity: 1 - mbK }}><Pic id="n01_ht" t={t} a={101} mv="l" /></AbsoluteFill>);
    L.push(<AbsoluteFill key="mb1" style={{ opacity: mbK }}><Pic id="n02_mb" t={t} a={T.mb - 0.3} mv="in" /></AbsoluteFill>);
    L.push(<Dark key="dk1" o={0.25 * e(t, T.cut - 0.3, T.cut)} />);
    L.push(<StampPress key="spH" t={t} at={T.good - 0.3} out={T.mb - 0.35} x={960} y={520} txt="HT" sub="HEAT TREATED · GOOD" ok />);
    L.push(<StampPress key="spM" t={t} at={T.mb + 0.05} out={T.leave + 0.3} x={960} y={300} txt="MB" sub="METHYL BROMIDE" ok={false} />);
    L.push(<HazardRow key="hz" t={t} items={[["🪚", "CUT", T.cut], ["🧽", "SAND", T.sand], ["🫁", "BREATHE", T.breathe]]} out={T.leave + 0.3} x={630} y={560} />);
    L.push(<Smell key="sm" t={t} at={T.oily} out={115.2} x={960} y={760} />);
    L.push(<BigWord key="sk" t={t} at={T.stains} out={115.2} txt="SKIP IT" x={960} y={330} col={COL.red} size={170} />);
  }
  // --- (avatar 115,2-118,8) → roble pesado → feed store ---
  if (t >= 118.6 && t < 130.2) {
    const fK = e(t, T.feed - 0.35, T.feed);
    L.push(<AbsoluteFill key="hv" style={{ opacity: 1 - fK }}><Pic id="r04_heavy" t={t} a={118.6} mv="in" ox="50% 35%" /></AbsoluteFill>);
    L.push(<HangScale key="hs" t={t} at={T.oak - 0.6} out={T.feed - 0.35} x={1560} y={120} />);
    L.push(<BigWord key="st" t={t} at={T.strong} out={T.feed - 0.35} txt="STRONG" x={560} y={860} col={COL.amber} size={130} />);
    L.push(<AbsoluteFill key="fs" style={{ opacity: fK }}><Pic id="r05_feedstore" t={t} a={T.feed - 0.35} mv="r" /></AbsoluteFill>);
    L.push(<MiniMap key="mm" t={t} at={T.feed} out={129.7} x={1180} y={480} />);
  }
  // --- (avatar 129,9-133,7) → largueros vs tacos → el larguero se reparte ---
  if (t >= 133.5 && t < 147.3) {
    L.push(<Pic key="sv" id="n03_stringer" t={t} a={133.5} mv="out" />);
    L.push(<Verdict key="vd" t={t} out={147.0} boxes={[{ at: 134.3, x: 140, y: 230, w: 780, h: 720, ok: true, label: "STRINGERS" }, { at: T.blocks + 0.2, x: 1000, y: 230, w: 780, h: 720, ok: false, label: "BLOCKS" }]} />);
    L.push(<BigWord key="ng" t={t} at={T.noGood} out={147.0} txt="NO GOOD" x={1390} y={590} col={COL.red} size={120} rot={6} />);
  }
  if (t >= 150.4 && t < 163.6) {
    // (avatar 147-150,5 cubre "frame"/"leg"; el reparto entra al salir del avatar con "your cleat")
    const crK = e(t, T.quit - 0.4, T.quit);
    L.push(<AbsoluteFill key="sb" style={{ background: "radial-gradient(circle at 50% 40%, #3b2c1e, #120c08)", opacity: 1 - crK }} />);
    L.push(<StringerSplit key="ss" t={t} at={[150.5, 150.7, T.cleat]} out={T.quit - 0.4} y={300} />);
    L.push(<BigWord key="3s" t={t} at={T.three} out={T.quit - 0.4} txt="3-STRINGER PALLETS" x={960} y={170} col={COL.ink} size={86} rot={0} />);
    L.push(<AbsoluteFill key="cb" style={{ opacity: crK }}><Pic id="r06_crowbar" t={t} a={T.quit - 0.4} mv="in" ox="50% 70%" /></AbsoluteFill>);
    L.push(<Crack key="ck" t={t} at={T.crack} x={520} y={760} len={900} out={163.4} />);
    L.push(<BigWord key="crk" t={t} at={T.crack} out={T.splits + 0.6} txt="CRACK!" x={1400} y={300} col="#fff" size={150} rot={8} />);
  }
  // --- (avatar 163,4-168,1 "...junk. It's not junk") → clavo anillado → la sierra entre tabla y larguero ---
  if (t >= 167.9 && t < 179.3) {
    L.push(<Pic key="rn" id="n04_ringnail" t={t} a={167.9} mv="in" />);
    L.push(<Dark key="dk2" o={0.45 * e(t, 168.0, 168.4)} />);
    L.push(<RingNail key="rnl" t={t} at={168.1} out={T.recipT - 0.3} x={1350} y={560} />);
    L.push(<BigWord key="dnp" t={t} at={T.notPull} out={T.recipT - 0.3} txt="DON'T PULL THEM" x={620} y={520} col={COL.amber} size={92} rot={-3} strike={undefined} />);
    const nK = e(t, T.recipT - 0.4, T.recipT);
    L.push(<AbsoluteFill key="nc0" style={{ background: "radial-gradient(circle at 50% 45%, #2c3540, #0b0e12)", opacity: nK }} />);
    L.push(<NailCut key="nc" t={t} at={T.recipT - 0.2} cut={T.cutN + 0.5} out={179.1} x={960} y={600} />);
  }
  // --- (avatar 179,1-183,3) → la tabla sale entera → tap tap → 21 + 9 ---
  if (t >= 183.1 && t < 196.6) {
    const nsK = e(t, T.flip - 0.3, T.flip);
    L.push(<AbsoluteFill key="rc" style={{ opacity: 1 - nsK }}><Pic id="r07_recip" t={t} a={183.1} mv="l" /></AbsoluteFill>);
    L.push(<BigWord key="10s" t={t} at={183.5} out={T.flip - 0.3} txt="10 SEC / BOARD" x={960} y={170} col={COL.ink} size={92} rot={0} />);
    L.push(<BigWord key="nc2" t={t} at={T.whole} out={T.flip - 0.3} txt="NOT A CRACK" x={1300} y={880} col={COL.amber} size={92} rot={-3} />);
    L.push(<AbsoluteFill key="nsx" style={{ opacity: nsK }}><Pic id="r08_nailset" t={t} a={T.flip - 0.3} mv="in" ox="55% 60%" /></AbsoluteFill>);
    L.push(<Tap key="tp1" t={t} at={T.tap1} x={1250} y={330} />);
    L.push(<Tap key="tp2" t={t} at={T.tap2} x={1420} y={420} />);
    L.push(<Tap key="tp3" t={t} at={191.5} x={1180} y={280} />);
  }
  if (t >= 196.2 && t < 196.7) L.push(<Dark key="dk3" o={0.4} />);
  // --- (avatar 196,4-201,4) → 21 + 9 sobre la salida del avatar → las 3 pilas ---
  if (t >= 201.2 && t < 214.0) {
    L.push(<Pic key="pl" id="r09_piles" t={t} a={201.2} mv="out" />);
    L.push(<PileSign key="p1" t={t} at={T.first} out={213.7} x={420} y={640} n="1" lbl="TOP" col="#24c27a" />);
    L.push(<PileSign key="p2" t={t} at={T.second - 0.2} out={213.7} x={960} y={640} n="2" lbl="SHELF" col={COL.amber} />);
  }
  // --- (avatar 213,7-217,9) → la pila de quemar → 20 años → $40 ---
  if (t >= 217.7 && t < 229.8) {
    const bK = e(t, 229.0, 229.6);
    L.push(<Pic key="pl2" id="r09_piles" t={t} a={217.7} mv="r" />);
    L.push(<PileSign key="p1b" t={t} at={217.7} out={T.bad - 0.2} x={420} y={640} n="1" lbl="TOP" col="#24c27a" />);
    L.push(<PileSign key="p2b" t={t} at={217.7} out={T.bad - 0.2} x={960} y={640} n="2" lbl="SHELF" col={COL.amber} />);
    L.push(<PileSign key="p3" t={t} at={T.burn - 0.1} out={T.bad - 0.2} x={1500} y={640} n="3" lbl="BURN" col={COL.red} fire />);
    L.push(<Dark key="dk5" o={0.5 * e(t, T.bad - 0.3, T.bad)} />);
    L.push(<BigWord key="20y" t={t} at={T.years} out={229.6} txt="20 YEARS" x={960} y={520} col={COL.ink} size={200} rot={-2} />);
    if (bK > 0) L.push(<AbsoluteFill key="bk" style={{ background: "#000", opacity: bK }} />);
  }
  // --- (avatar 229,6-234) → $40 la hoja (sobre la salida) → imán con rayos X ---
  if (t >= 233.8 && t < 245.5) {
    const mK = e(t, 236.6, 237.1);
    L.push(<AbsoluteFill key="nt" style={{ opacity: 1 - mK }}><Pic id="n05_nailtip" t={t} a={233.8} mv="in" /></AbsoluteFill>);
    L.push(<AbsoluteFill key="mg" style={{ opacity: mK }}><Pic id="r10_magnet" t={t} a={236.6} mv="in" ox="50% 55%" /></AbsoluteFill>);
    L.push(<Dark key="dk6" o={0.5 * e(t, T.tips - 0.4, T.tips)} />);
    L.push(<XRayBoard key="xr" t={t} at={T.tips - 0.2} out={245.3} y={560} hits={[T.finds]} />);
  }
  // --- (avatar 245,3-249,4) → ambos lados / si agarra: sacalo → vuelta al banco (medidas) ---
  if (t >= 249.2 && t < 260.4) {
    const wK = e(t, 254.6, 255.4);
    L.push(<AbsoluteFill key="mg2" style={{ opacity: 1 - wK }}><Pic id="r10_magnet" t={t} a={249.2} mv="l" /></AbsoluteFill>);
    L.push(<BigWord key="bs" t={t} at={T.both} out={254.6} txt="BOTH SIDES" x={960} y={200} col={COL.ice} size={120} rot={0} />);
    L.push(<BigWord key="dg" t={t} at={T.dig} out={254.6} txt="DIG IT OUT" x={700} y={860} col={COL.amber} size={92} rot={-3} />);
    L.push(<BigWord key="ca" t={t} at={T.around} out={254.6} txt="OR CUT AROUND" x={1300} y={860} col={COL.amber} size={92} rot={3} />);
    if (wK > 0) L.unshift(World("w3"));
  }
};
