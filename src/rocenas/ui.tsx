import React from "react";
import { AbsoluteFill } from "remotion";
import { CH, DrawX, FONT, HAND, SERIF, e, ei, extrude, spr } from "./lib";
export const SteamWipe: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.55 }) => {
  const k = 1 - Math.min(1, Math.abs(t - mid) / w);
  if (k <= 0.01) return null;
  const blobs = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 137) % 1920, y = 1100 - ((t - mid + w) / (2 * w)) * (900 + (i % 5) * 120) + (i % 3) * 140;
    const r = 420 + (i % 4) * 120;
    return `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(255,248,236,${0.75 * k}) 0%, rgba(255,248,236,0) 70%)`;
  });
  return <AbsoluteFill style={{ background: blobs.join(","), opacity: Math.min(1, k * 1.6), filter: "blur(18px)" }}><AbsoluteFill style={{ background: `rgba(255,246,232,${0.85 * Math.pow(k, 1.6)})` }} /></AbsoluteFill>;
};

// remolino de aroma: hilos de humo dibujados que suben y se enroscan
export const Aroma: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.4));
  if (o <= 0.01) return null;
  const d = (k: number) => { let p = `M ${x + (k - 1) * 60} ${y}`; for (let i = 1; i <= 14; i++) { const yy = y - i * 34, xx = x + (k - 1) * 60 + Math.sin(i * 0.7 + t * 2 + k) * (20 + i * 4); p += ` L ${xx.toFixed(1)} ${yy.toFixed(1)}`; } return p; };
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    {[0, 1, 2].map((k) => <path key={k} d={d(k)} fill="none" stroke="rgba(255,240,215,.75)" strokeWidth={7 - k} strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - e(t, at + k * 0.12, at + 1.1 + k * 0.12))} style={{ filter: "blur(2.5px) drop-shadow(0 0 12px rgba(255,220,170,.8))" }} />)}
  </svg>;
};

// frasco de pasta comercial (2.5D) que se tacha
export const Frasco: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1000 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * -60 - 12 + 4 * Math.sin(t)}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, width: 230, height: 300 }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 170, height: 46, borderRadius: 10, background: "linear-gradient(90deg,#8a1d1d,#d23a2a 45%,#7a1414)" }} />
      <div style={{ position: "absolute", left: 10, top: 40, width: 210, height: 260, borderRadius: "28px 28px 36px 36px", background: "linear-gradient(90deg,#2b0f08,#5a2412 40%,#3a1609 70%,#1c0904)", boxShadow: "inset 10px 0 20px rgba(255,255,255,.12), 0 30px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 22, top: 120, width: 186, height: 90, borderRadius: 8, background: "#f2c14e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#7a1f2b", letterSpacing: 2 }}>PASTA<br />LISTA</div>
    </div>
    <div style={{ position: "absolute", left: -150, top: -170 }}><DrawX t={t} at={at + 0.45} x={0} y={0} w={300} h={340} /></div>
  </div>;
};

// número extruido de barro que sale de cada plato (los 7)

// tarjetita escrita a mano (papel de cuaderno)
export const Nota: React.FC<{ t: number; at: number; out: number; x: number; y: number; lines: string[]; rot?: number; w?: number }> = ({ t, at, out, x, y, lines, rot = -4, w = 420 }) => {
  const k = Math.min(1.1, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 60}deg) rotate(${rot + 1.2 * Math.sin(t * 1.3)}deg)`, width: w, padding: "26px 34px 30px", background: `repeating-linear-gradient(180deg, transparent 0 55px, rgba(90,110,150,.22) 55px 57px), linear-gradient(180deg, ${CH.papel}, #e4d1a6)`, borderRadius: 6,
      boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 40px rgba(140,95,40,.18)" }}>
      <div style={{ position: "absolute", left: "50%", top: -14, width: 90, height: 28, transform: "translateX(-50%) rotate(-3deg)", background: "rgba(240,230,200,.7)", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }} />
      {lines.map((ln, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: i === 0 ? 62 : 50, lineHeight: "57px", color: CH.tinta, clipPath: `inset(0 ${100 - 100 * e(t, at + 0.15 + i * 0.25, at + 0.55 + i * 0.25)}% 0 0)` }}>{ln}</div>)}
    </div>
  </div>;
};

// lista del súper de Chayo: renglones con precio que se tachan uno por uno
export const Lista: React.FC<{ t: number; at: number; out: number; x: number; y: number; rows: [string, number][]; dt?: number }> = ({ t, at, out, x, y, rows, dt = 0.16 }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1200 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 50 - 6}deg) rotate(3deg)`, width: 470, padding: "24px 34px", background: `linear-gradient(180deg, #f6ecd4, #e6d4ab)`, boxShadow: "0 30px 60px rgba(0,0,0,.55)", borderRadius: 4 }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CH.guinda }}>Pa'l mole</div>
      {rows.map(([it, $], i) => { const tk = e(t, at + 0.15 + i * dt, at + 0.3 + i * dt); return (
        <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 500, fontSize: 46, lineHeight: "54px", color: CH.tinta }}>
          <span>{it}</span><span>${$}</span>
          <div style={{ position: "absolute", left: -6, top: 28, height: 4, width: `${104 * tk}%`, background: CH.guinda, borderRadius: 2, transform: "rotate(-1.5deg)" }} />
        </div>); })}
    </div>
  </div>;
};

// reloj de pared de la cocina: 5:00 y luego las manecillas corren seis horas
export const Reloj: React.FC<{ t: number; at: number; spin: number; out: number; x: number; y: number }> = ({ t, at, spin, out, x, y }) => {
  const k = Math.min(1.1, spr(t, at, 1)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const hrs = 5 + 6 * ei(t, spin, spin + 2.2), hA = (hrs % 12) * 30, mA = (hrs * 360) % 360;
  const lab = `${Math.floor(hrs)}:${String(Math.floor((hrs % 1) * 60)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})` }}>
    <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <circle r={170} fill="#7a3a1f" /><circle r={150} fill="#f3e6c8" />
      {Array.from({ length: 12 }, (_, i) => <text key={i} x={Math.sin(i * Math.PI / 6) * 118} y={-Math.cos(i * Math.PI / 6) * 118 + 14} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={36} fill={CH.tinta}>{i || 12}</text>)}
      <line x1={0} y1={0} x2={Math.sin(hA * Math.PI / 180) * 70} y2={-Math.cos(hA * Math.PI / 180) * 70} stroke={CH.tinta} strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.sin(mA * Math.PI / 180) * 110} y2={-Math.cos(mA * Math.PI / 180) * 110} stroke={CH.guinda} strokeWidth={7} strokeLinecap="round" />
      <circle r={10} fill={CH.tinta} />
    </svg>
    <div style={{ textAlign: "center", marginTop: 6, fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: CH.crema, textShadow: extrude(7, "#3a1a08") }}>{lab} <span style={{ fontSize: 40 }}>{hrs < 12 ? "a.m." : "p.m."}</span></div>
  </div>;
};

// letra a mano que se escribe sola (el pensamiento de la que cocinó)
export const Pensado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string }> = ({ t, at, out, x, y, text, size = 110, col = CH.crema }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, at, at + 1.1);
  if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-4deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, textShadow: "0 6px 20px rgba(0,0,0,.75)" }}>{text}</div>;
};

// palomitas sobre el avatar ("le puse los chiles ✓")
export const Palomita: React.FC<{ t: number; at: number; out: number; y: number; text: string }> = ({ t, at, out, y, text }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", right: 110, top: y, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * 160}px)`, display: "flex", alignItems: "center", gap: 20, padding: "14px 30px", borderRadius: 16, background: "rgba(42,18,12,.88)", boxShadow: `0 20px 40px rgba(0,0,0,.5), inset 0 0 0 3px ${CH.maiz}88` }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CH.crema }}>{text}</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: "#9ad35a", transform: `scale(${e(t, at + 0.25, at + 0.4)})` }}>✓</div>
  </div>;
};

// amargómetro: medidor de barro con aguja que sube con cada cucharada de azúcar
export const Amargometro: React.FC<{ t: number; at: number; steps: number[]; out: number; x: number; y: number; peorAt: number }> = ({ t, at, steps, out, x, y, peorAt }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = 0.35 + steps.reduce((acc, s0) => acc + 0.22 * Math.min(1.08, spr(t, s0, 1.1)), 0) + 0.1 * spr(t, peorAt, 1);
  const ang = -90 + 180 * Math.min(1.02, v);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={460} height={290} viewBox="-230 -240 460 290" style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,.6))" }}>
      <path d="M -200 0 A 200 200 0 0 1 200 0 L 160 0 A 160 160 0 0 0 -160 0 Z" fill="#3a1a0c" />
      {Array.from({ length: 30 }, (_, i) => { const a = Math.PI * (1 - i / 29); const c = i < 10 ? "#9ad35a" : i < 20 ? CH.maiz : "#d8402c"; return <path key={i} d={`M ${Math.cos(a) * 196} ${-Math.sin(a) * 196} L ${Math.cos(a) * 166} ${-Math.sin(a) * 166}`} stroke={c} strokeWidth={12} />; })}
      <line x1={0} y1={0} x2={Math.sin(ang * Math.PI / 180) * 175} y2={-Math.cos(ang * Math.PI / 180) * 175} stroke={CH.crema} strokeWidth={9} strokeLinecap="round" />
      <circle r={20} fill={CH.crema} />
      <text x={0} y={42} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={40} fill={CH.crema} letterSpacing={4}>AMARGO</text>
    </svg>
  </div>;
};

// sello de barro que cae
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -8, size = 120, col = "#d8402c" }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
    <div style={{ border: `10px solid ${col}`, borderRadius: 16, padding: "4px 34px", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>{text}</div>
  </div>;
};

// etiqueta de precio colgada de un hilo que se mece
export const Precio: React.FC<{ t: number; at: number; out: number; x: number; y: number; top: string; sub: string }> = ({ t, at, out, x, y, top, sub }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = (1 - Math.min(1, k)) * 28 + 5 * Math.sin((t - at) * 3) * Math.exp(-(t - at) * 0.8);
  return <div style={{ position: "absolute", left: x, top: -20, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - Math.min(1, k)) * -300}px)` }}>
    <div style={{ width: 4, height: y, margin: "0 auto", background: "#d9c7a0" }} />
    <div style={{ position: "relative", padding: "26px 44px 22px 70px", background: CH.maiz, clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 30, top: "50%", width: 22, height: 22, borderRadius: "50%", background: "#2a120c", transform: "translateY(-50%)" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 108, color: CH.guinda, lineHeight: 1 }}>{top}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 38, color: CH.negro, letterSpacing: 3 }}>{sub}</div>
    </div>
  </div>;
};

// letrero de la fonda pintado a mano + tachaduras
export const Pill: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; col?: string }> = ({ t, at, out, x, y, text, col = "#d8402c" }) => {
  const k = Math.min(1.12, spr(t, at, 1.2)), o = e(t, at, at + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(-3deg)`, padding: "10px 34px", borderRadius: 12, background: "rgba(25,10,6,.86)", border: `4px solid ${col}`, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CH.crema, letterSpacing: 3, boxShadow: "0 18px 40px rgba(0,0,0,.55)" }}>
    {text}<div style={{ position: "absolute", left: "6%", top: "52%", height: 7, width: `${88 * e(t, at + 0.4, at + 0.6)}%`, background: col, transform: "rotate(-4deg)", borderRadius: 3 }} /></div>;
};

// ---------------- EL MINUTO ----------------
