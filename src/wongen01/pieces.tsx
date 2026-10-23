// wongen01 · PIEZAS 2.5D de la cocina de takeout (rojo laca, dorado, papel de comanda, tinta).
// Todo entra con resorte y sale con fundido; los tiempos vienen de at("frase") en Main.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, HAND, SERIF, e, ei, extrude, spr } from "./lib";

export const K = { red: "#c8202a", red2: "#8f1219", gold: "#f2c14e", cream: "#f6ecd6", ink: "#1f1612", jade: "#2f7a5a", paper: "#fbf7ee", blue: "#4a7dff" };
const R = (i: number, n: number) => { const x = Math.sin(i * 91.7 + n * 47.3) * 43758.5; return x - Math.floor(x); };
const vis = (t: number, at: number, out: number, fin = 0.12, fout = 0.3) => e(t, at, at + fin) * (1 - e(t, out, out + fout));

// COMANDA: el ticket de pedido sale de la impresora y baja: "SECRET Nº n" + título escrito a mano. Es la tarjeta de capítulo.
export const Comanda: React.FC<{ t: number; at: number; out: number; n?: number | string; head?: string; title: string[]; x?: number; y?: number; sc?: number; dim?: boolean }> = ({ t, at, out, n, head, title, x = 960, y = 120, sc = 1, dim = true }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  const pr = ei(t, at, at + 0.9); // sale de la impresora
  const sw = 2.5 * Math.sin((t - at) * 2.2) * Math.exp(-(t - at) * 0.9);
  const H = 380 + title.length * 92;
  return <AbsoluteFill style={{ opacity: o }}>
    {dim && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,.25), rgba(0,0,0,.7))" }} />}
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) scale(${sc})`, transformOrigin: "50% 0" }}>
      {/* boca de la impresora */}
      <div style={{ position: "absolute", left: -330, top: -40, width: 660, height: 58, borderRadius: 14, background: "linear-gradient(180deg,#3a3d42,#17191c)", boxShadow: "0 20px 40px rgba(0,0,0,.6)", zIndex: 2 }}>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 10, height: 8, borderRadius: 4, background: "#050505" }} />
        <div style={{ position: "absolute", right: 22, top: 14, width: 12, height: 12, borderRadius: 6, background: "#4cff6a", boxShadow: "0 0 12px #4cff6a" }} />
      </div>
      <div style={{ position: "relative", width: 560, height: H * pr, marginLeft: -280, overflow: "hidden", transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 560, height: H, background: K.paper, boxShadow: "0 30px 60px rgba(0,0,0,.55)", padding: "40px 44px",
          WebkitMaskImage: "linear-gradient(180deg,#000 calc(100% - 16px), transparent)" } as React.CSSProperties}>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 30, color: "#333", letterSpacing: 4, display: "flex", justifyContent: "space-between", borderBottom: "3px dashed #999", paddingBottom: 14 }}>
            <span>{head ?? "ORDER"}</span><span>TABLE 0</span>
          </div>
          {n !== undefined && <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: K.red, lineHeight: 1.05, marginTop: 18 }}>{typeof n === "number" ? `#${n}` : n}</div>}
          {title.map((l, i) => { const w = e(t, at + 0.8 + i * 0.35, at + 1.3 + i * 0.35); return <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, lineHeight: "92px", color: K.ink, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)` }}>{l}</div>; })}
          <div style={{ position: "absolute", left: 44, right: 44, bottom: 36, height: 8, background: K.red, opacity: 0.85 }} />
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};

// GALLETA DE LA FORTUNA: las dos mitades se abren y sale el papelito con la frase (las frases de Mr. Lau)
export const Fortuna: React.FC<{ t: number; at: number; out: number; text: string; who?: string; x?: number; y?: number; size?: number }> = ({ t, at, out, text, who, x = 960, y = 780, size = 54 }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  const k = Math.min(1.08, spr(t, at, 1)), op = ei(t, at + 0.25, at + 0.75), w = e(t, at + 0.5, at + 1.1);
  const half = (sg: number) => <svg width={220} height={170} viewBox="0 0 220 170" style={{ position: "absolute", top: -85, left: sg < 0 ? -220 - op * 330 : op * 330, transform: `rotate(${sg * (8 + op * 22)}deg)`, filter: "drop-shadow(0 18px 24px rgba(0,0,0,.55))" }}>
    <defs><radialGradient id={"gk" + sg} cx="40%" cy="35%"><stop offset="0" stopColor="#f6d58a" /><stop offset=".6" stopColor="#d9a24a" /><stop offset="1" stopColor="#a8701e" /></radialGradient></defs>
    <path d={sg < 0 ? "M 220 85 C 200 10, 60 0, 20 60 C 0 95, 30 150, 90 160 C 150 168, 200 140, 220 85 Z" : "M 0 85 C 20 10, 160 0, 200 60 C 220 95, 190 150, 130 160 C 70 168, 20 140, 0 85 Z"} fill={`url(#gk${sg})`} />
    <path d={sg < 0 ? "M 210 85 C 170 70, 120 75, 60 100" : "M 10 85 C 50 70, 100 75, 160 100"} stroke="#9a6418" strokeWidth={4} fill="none" opacity={0.6} />
  </svg>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${k})` }}>
    {half(-1)}{half(1)}
    <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%)", width: 120 + op * 1180, maxWidth: 1300, overflow: "hidden", background: "linear-gradient(180deg,#fffdf6,#f1e9d6)", boxShadow: "0 20px 40px rgba(0,0,0,.45)", padding: "18px 0", borderRadius: 3 }}>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: size, color: K.red2, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)` }}>“{text}”</div>
      {who && <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: "#6a5a48", opacity: e(t, at + 1.1, at + 1.4) }}>— {who}</div>}
    </div>
  </div>;
};

// letra a mano que se escribe sola (lo que piensa el que mira)
export const Pensado: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string; rot?: number }> = ({ t, at, out, x, y, text, size = 96, col = K.cream, rot = -4 }) => {
  const o = 1 - e(t, out, out + 0.3), w = e(t, at, at + Math.max(0.5, text.length * 0.035));
  if (w <= 0.01 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, textShadow: "0 6px 20px rgba(0,0,0,.85)" }}>{text}</div>;
};

// sello de tinta roja que cae
export const Sello: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at, text, x, y, out = 1e9, rot = -8, size = 120, col = K.red }) => {
  const k = spr(t, at, 1.3), o = vis(t, at, out, 0.06, 0.25);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
    <div style={{ border: `10px solid ${col}`, borderRadius: 16, padding: "4px 34px", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.28)", whiteSpace: "nowrap", textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>{text}</div>
  </div>;
};

// MEDIDA: la cantidad exacta, en una tapa de envase de takeout que cae girando
export const Medida: React.FC<{ t: number; at: number; out: number; x: number; y: number; big: string; sub?: string; col?: string; size?: number }> = ({ t, at, out, x, y, big, sub, col = K.gold, size = 150 }) => {
  const k = Math.min(1.1, spr(t, at, 1.05)), o = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -120}px) scale(${0.6 + 0.4 * k}) rotate(${(1 - Math.min(1, k)) * 14}deg)`, textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, whiteSpace: "nowrap", textShadow: extrude(12, "#5a1208") }}>{big}</div>
    {sub && <div style={{ display: "inline-block", marginTop: 14, padding: "6px 22px", background: K.red, color: K.cream, fontFamily: FONT, fontWeight: 900, fontSize: 36, letterSpacing: 4, boxShadow: "0 10px 20px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{sub}</div>}
  </div>;
};

// RECETA en la libreta verde de comandas: renglones que se escriben solos (cantidad en rojo + ingrediente)
export const Libreta: React.FC<{ t: number; out: number; x: number; y: number; title: string; rows: { at: number; amt: string; item: string }[]; w?: number; sc?: number; rot?: number }> = ({ t, out, x, y, title, rows, w = 640, sc = 1, rot = -2 }) => {
  const at0 = rows[0].at - 0.3, k = Math.min(1.08, spr(t, at0, 0.9)), o = vis(t, at0, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,0) scale(${sc * (0.7 + 0.3 * k)}) rotate(${rot}deg)`, transformOrigin: "50% 0" }}>
    <div style={{ width: w, background: "repeating-linear-gradient(180deg, #eef5e9 0 62px, #9cc3a8 62px 64px)", borderTop: `34px solid ${K.jade}`, boxShadow: "0 30px 60px rgba(0,0,0,.55)", padding: "16px 34px 26px", borderRadius: 4 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: K.jade, height: 64, lineHeight: "64px" }}>{title}</div>
      {rows.map((r, i) => { const ww = e(t, r.at, r.at + 0.5); return ww <= 0 ? <div key={i} style={{ height: 64 }} /> : <div key={i} style={{ height: 64, lineHeight: "64px", whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * ww}% -20% 0)`, fontFamily: HAND, fontWeight: 700, fontSize: 52 }}>
        <span style={{ color: K.red, marginRight: 18 }}>{r.amt}</span><span style={{ color: K.ink }}>{r.item}</span></div>; })}
    </div>
  </div>;
};

// BTU: dos barras de fuego que crecen (la hornalla de casa vs. la turbina del restaurante)
export const Btu: React.FC<{ t: number; at1: number; at2: number; out: number; x?: number; y?: number; x10?: number }> = ({ t, at1, at2, out, x = 960, y = 760, x10 }) => {
  const o = vis(t, at1 - 0.2, out);
  if (o <= 0.01) return null;
  const bar = (yy: number, a: number, len: number, col: string, lab: string, num: string) => {
    const g = ei(t, a, a + 1.0), fl = 1 + 0.04 * Math.sin(t * 30 + yy);
    return <div style={{ position: "absolute", left: -760, top: yy, opacity: e(t, a - 0.1, a + 0.1) }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 4, color: K.cream, textShadow: extrude(3, "#000") }}>{lab}</div>
      <div style={{ position: "relative", marginTop: 8, width: len * g, height: 74, borderRadius: 37, background: `linear-gradient(90deg, ${col}, #ffd27a)`, boxShadow: `0 0 ${30 * fl}px ${col}, 0 16px 30px rgba(0,0,0,.5)` }}>
        <div style={{ position: "absolute", right: 22, top: 0, lineHeight: "74px", fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: K.ink, opacity: e(t, a + 0.6, a + 0.9), whiteSpace: "nowrap" }}>{num}</div>
      </div>
    </div>;
  };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <div style={{ position: "absolute", left: -820, top: -40, width: 1640, height: 330, borderRadius: 28, background: "rgba(14,8,6,.72)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    {bar(-10, at1, 300, K.blue, "YOUR STOVE", "10–15K BTU")}
    {bar(130, at2, 1500, "#ff6a1a", "RESTAURANT WOK BURNER", "100,000+ BTU")}
    {x10 !== undefined && <div style={{ position: "absolute", left: 560, top: -150, transform: `translate(-50%,0) scale(${Math.min(1.1, spr(t, x10, 1.1))})`, opacity: e(t, x10, x10 + 0.1), fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: K.gold, textShadow: extrude(12, "#5a1208") }}>10×</div>}
  </div>;
};

// contador grande (cuente hasta 20) con anillo que se llena
export const Cuenta: React.FC<{ t: number; at: number; dur: number; to: number; out: number; x: number; y: number; label?: string }> = ({ t, at, dur, to, out, x, y, label }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  const u = Math.max(0, Math.min(1, (t - at) / dur)), n = Math.max(1, Math.ceil(u * to));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.08, spr(t, at, 1))})` }}>
    <svg width={340} height={340} style={{ position: "absolute", left: -170, top: -170 }}>
      <circle cx={170} cy={170} r={150} fill="rgba(14,8,6,.72)" stroke="rgba(255,255,255,.15)" strokeWidth={16} />
      <circle cx={170} cy={170} r={150} fill="none" stroke={K.gold} strokeWidth={16} strokeDasharray={942} strokeDashoffset={942 * (1 - u)} transform="rotate(-90 170 170)" strokeLinecap="round" />
    </svg>
    <div style={{ position: "relative", width: 0, textAlign: "center" }}>
      <div style={{ position: "absolute", left: -150, width: 300, top: -95, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: K.cream, lineHeight: 1 }}>{n}</div>
      {label && <div style={{ position: "absolute", left: -200, width: 400, top: 190, fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 5, color: K.gold, textShadow: extrude(3, "#000") }}>{label}</div>}
    </div>
  </div>;
};

// TICKET de cuenta (takeout vs casa): renglones con su importe en texto, total en rojo
export const Cuenta$: React.FC<{ t: number; out: number; x: number; y: number; title: string; rows: { at: number; item: string; v: string }[]; total: { at: number; v: string }; rot?: number; sc?: number; col?: string }> = ({ t, out, x, y, title, rows, total, rot = 2, sc = 1, col = K.red }) => {
  const at0 = rows[0].at - 0.3, o = vis(t, at0, out), k = Math.min(1.06, spr(t, at0, 0.9));
  if (o <= 0.01) return null;
  const shown = rows.filter((r) => t >= r.at);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,0) scale(${sc * (0.75 + 0.25 * k)}) rotate(${rot}deg)`, transformOrigin: "50% 0" }}>
    <div style={{ width: 500, background: "linear-gradient(180deg,#fbfaf6,#efece3)", boxShadow: "0 40px 80px rgba(0,0,0,.65)", padding: "28px 34px 30px", fontFamily: "'Courier New', monospace", color: "#1c1c1c",
      WebkitMaskImage: "linear-gradient(180deg,#000 calc(100% - 12px), transparent)" } as React.CSSProperties}>
      <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 4, textAlign: "center", borderBottom: "2px dashed #999", paddingBottom: 10, marginBottom: 10 }}>{title}</div>
      {shown.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 700, lineHeight: "54px", opacity: e(t, r.at, r.at + 0.15) }}><span>{r.item}</span><span>{r.v}</span></div>)}
      {t >= total.at && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 50, fontWeight: 900, borderTop: "2px dashed #999", marginTop: 10, paddingTop: 12, color: col, transform: `scale(${Math.min(1.08, spr(t, total.at))})`, transformOrigin: "100% 50%" }}><span>TOTAL</span><span>{total.v}</span></div>}
    </div>
  </div>;
};

// PASOS en fila (fichas de comanda unidas por flechas) que se encienden de a una
export const Pasos: React.FC<{ t: number; out: number; y?: number; items: { at: number; txt: string }[]; size?: number }> = ({ t, out, y = 860, items, size = 34 }) => {
  const o = vis(t, items[0].at - 0.2, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, opacity: o }}>
    {items.map((it, i) => { const k = Math.min(1.1, spr(t, it.at, 1.2)), on = t >= it.at; return <React.Fragment key={i}>
      {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: on ? K.gold : "rgba(255,255,255,.25)" }}>›</div>}
      <div style={{ padding: "12px 20px", borderRadius: 10, background: on ? K.paper : "rgba(250,245,235,.18)", color: on ? K.ink : "rgba(255,255,255,.4)", fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 2, whiteSpace: "nowrap",
        transform: `translateY(${on ? (1 - Math.min(1, k)) * 30 : 0}px)`, boxShadow: on ? "0 14px 28px rgba(0,0,0,.5)" : "none", borderBottom: on ? `6px solid ${K.red}` : "6px solid transparent" }}>{it.txt}</div>
    </React.Fragment>; })}
  </div>;
};

// CALENDARIO de la semana: domingo se hace el arroz, lunes/miércoles/viernes arroz frito
export const Semana: React.FC<{ t: number; out: number; x: number; y: number; marks: { at: number; d: number; txt: string; col: string }[] }> = ({ t, out, x, y, marks }) => {
  const o = vis(t, marks[0].at - 0.4, out);
  if (o <= 0.01) return null;
  const D = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, marks[0].at - 0.4, 0.9))})`, display: "flex", gap: 14 }}>
    {D.map((d, i) => { const m = marks.find((q) => q.d === i && t >= q.at); const k = m ? Math.min(1.1, spr(t, m.at, 1.2)) : 0;
      return <div key={i} style={{ width: 196, height: 250, borderRadius: 14, background: "rgba(251,247,238,.95)", boxShadow: "0 20px 40px rgba(0,0,0,.55)", overflow: "hidden", position: "relative" }}>
        <div style={{ height: 56, background: K.red, color: K.cream, fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: 4, textAlign: "center", lineHeight: "56px" }}>{d}</div>
        {m && <div style={{ position: "absolute", left: 10, right: 10, top: 80, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 44, lineHeight: "46px", color: m.col, transform: `scale(${k})` }}>{m.txt}</div>}
      </div>; })}
  </div>;
};

// la FIESTA de bacterias: puntitos que se multiplican sobre el arroz tibio
export const Bacterias: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  const n = Math.min(90, Math.floor(Math.pow(2, (t - at) * 2.2)));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {Array.from({ length: n }, (_, i) => { const a = R(i, 1) * 6.28, r = 40 + R(i, 2) * 260, s = 14 + R(i, 3) * 26; return <div key={i} style={{ position: "absolute", left: Math.cos(a) * r * 1.5, top: Math.sin(a) * r * 0.7, width: s, height: s * 0.7, borderRadius: "50%",
      background: `radial-gradient(circle at 35% 35%, #d8ff8a, ${i % 3 ? "#5aa83a" : "#a8c83a"})`, boxShadow: "0 0 10px rgba(160,255,90,.6)", transform: `rotate(${R(i, 4) * 180 + t * 40}deg) scale(${Math.min(1, (t - at) * 3 - i * 0.02 + 1)})` }} />; })}
  </div>;
};

// VAPOR: un golpe de vapor blanco barre la pantalla (transición de cocina, ida y vuelta)
export const Vapor: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.35 }) => {
  const u = (t - mid + w) / (2 * w);
  if (u <= 0 || u >= 1) return null;
  const k = 1 - Math.abs(u - 0.5) * 2;
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: `rgba(245,242,236,${0.85 * Math.pow(k, 1.5)})` }} />
    {Array.from({ length: 34 }, (_, i) => { const sz = 300 + R(i, 3) * 600, x = -300 + R(i, 1) * 2300 + (u - 0.5) * 500 * (R(i, 5) - 0.5), y = 1200 - u * 1500 * (0.6 + R(i, 2) * 0.8);
      return <div key={i} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.85), rgba(255,255,255,0) 65%)", opacity: k }} />; })}
  </AbsoluteFill>;
};

// CTA: botón rojo de suscribirse que se hunde · campana dorada que suena · la pregunta en un ticket
export const Suscribir: React.FC<{ t: number; at: number; press: number; out: number; x: number; y: number }> = ({ t, at, press, out, x, y }) => {
  const k = spr(t, at, 0.7), o = vis(t, at, out);
  if (o <= 0.01) return null;
  const pr = e(t, press, press + 0.08) * (1 - e(t, press + 0.12, press + 0.3)), done = t >= press + 0.15;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 260 + pr * 12}px)` }}>
    <div style={{ padding: "26px 70px", borderRadius: 20, background: done ? "linear-gradient(180deg,#5a5450,#3a3430)" : `linear-gradient(180deg,${K.red},${K.red2})`,
      boxShadow: `0 ${18 - pr * 12}px 0 ${done ? "#221e1b" : "#4a0a0e"}, 0 ${40 - pr * 20}px 60px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,255,255,.25)`,
      fontFamily: FONT, fontWeight: 900, fontSize: 80, letterSpacing: 4, color: K.cream, whiteSpace: "nowrap" }}>{done ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
  </div>;
};
export const Campana: React.FC<{ t: number; at: number; ring: number; out: number; x: number; y: number }> = ({ t, at, ring, out, x, y }) => {
  const k = spr(t, at, 0.8), o = vis(t, at, out);
  if (o <= 0.01) return null;
  const dt = t - ring, sw = dt > 0 ? Math.sin(dt * 14) * 26 * Math.exp(-dt * 1.6) : 0;
  return <div style={{ position: "absolute", left: x, top: y - (1 - Math.min(1, k)) * 600, opacity: o }}>
    <svg width={360} height={420} viewBox="-180 -60 360 420" style={{ overflow: "visible", position: "absolute", left: -180, top: -60 }}>
      <defs><linearGradient id="oroC" x1="0" x2="1"><stop offset="0" stopColor="#7a4e14" /><stop offset=".35" stopColor="#e9b44c" /><stop offset=".55" stopColor="#fff0b8" /><stop offset=".75" stopColor="#c48a2a" /><stop offset="1" stopColor="#6a400e" /></linearGradient></defs>
      <rect x={-6} y={-60} width={12} height={90} rx={4} fill={K.red} />
      {dt > 0 && [0, 1, 2].map((i) => { const d2 = dt - i * 0.18, u = (d2 % 0.9) / 0.9; return d2 > 0 ? <path key={i} d={`M ${-120 - u * 70} ${150 - u * 40} Q ${-150 - u * 90} 210 ${-120 - u * 70} ${270 + u * 40} M ${120 + u * 70} ${150 - u * 40} Q ${150 + u * 90} 210 ${120 + u * 70} ${270 + u * 40}`} fill="none" stroke="#f6d27a" strokeWidth={7} strokeLinecap="round" opacity={(1 - u) * Math.exp(-dt * 0.5)} /> : null; })}
      <g transform={`rotate(${sw} 0 30)`}>
        <circle cx={0} cy={30} r={16} fill="url(#oroC)" />
        <path d="M -30 50 C -36 120 -60 190 -112 240 L 112 240 C 60 190 36 120 30 50 Z" fill="url(#oroC)" stroke="#5a360c" strokeWidth={4} />
        <rect x={-122} y={232} width={244} height={22} rx={11} fill="url(#oroC)" stroke="#5a360c" strokeWidth={4} />
        <circle cx={-sw * 1.3} cy={272} r={20} fill="#5a360c" />
      </g>
    </svg>
  </div>;
};

// tarjeta con una palabra que se tacha (lo que NO se usa: aceite de oliva, manteca, antiadherente…)
export const NoCard: React.FC<{ t: number; at: number; x: number; out: number; y?: number; txt: string; cross?: number; w?: number }> = ({ t, at, x, out, y = 760, txt, cross, w = 380 }) => {
  const k = Math.min(1.1, spr(t, at, 1)), o = vis(t, at, out);
  if (o <= 0.01) return null;
  const c = cross ?? at + 0.4, g = e(t, c, c + 0.25);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotateY(${(1 - Math.min(1, k)) * 70}deg) scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
    <div style={{ width: w, padding: "26px 0", borderRadius: 18, textAlign: "center", background: "rgba(251,247,238,.96)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 3, color: K.ink, whiteSpace: "nowrap", position: "relative" }}>
      {txt}
      <svg width={w} height={120} style={{ position: "absolute", left: 0, top: "50%", marginTop: -60 }}>
        <line x1={20} y1={100} x2={20 + (w - 40) * Math.min(1, g * 2)} y2={100 - 80 * Math.min(1, g * 2)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
        {g > 0.5 && <line x1={20} y1={20} x2={20 + (w - 40) * (g * 2 - 1)} y2={20 + 80 * (g * 2 - 1)} stroke={K.red} strokeWidth={14} strokeLinecap="round" />}
      </svg>
    </div>
  </div>;
};

// tarjeta con tilde verde (lo que sí)
export const SiCard: React.FC<{ t: number; at: number; x: number; out: number; y?: number; txt: string; w?: number }> = ({ t, at, x, out, y = 760, txt, w = 420 }) => {
  const k = Math.min(1.1, spr(t, at, 1)), o = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)})` }}>
    <div style={{ width: w, padding: "26px 0", borderRadius: 18, textAlign: "center", background: "rgba(251,247,238,.96)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 3, color: K.ink, whiteSpace: "nowrap", borderBottom: `8px solid ${K.jade}` }}>
      <span style={{ color: K.jade, marginRight: 14 }}>✓</span>{txt}
    </div>
  </div>;
};

// grano largo vs grano corto (siluetas a escala con su etiqueta)
export const Granos: React.FC<{ t: number; at: number; out: number; x: number; y: number; items: { at: number; name: string; L: number; W: number; ok: boolean; note: string }[] }> = ({ t, at, out, x, y, items }) => {
  const o = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 30, transform: "translate(-50%,-50%)" }}>
    {items.map((it, i) => { const k = Math.min(1.1, spr(t, it.at, 1)), on = t >= it.at; return <div key={i} style={{ width: 400, height: 380, borderRadius: 24, background: "rgba(14,8,6,.8)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", opacity: on ? 1 : 0, transform: `scale(${0.7 + 0.3 * Math.min(1, k)})`, position: "relative", textAlign: "center" }}>
      <svg width={400} height={200} style={{ marginTop: 20 }}>{[0, 1, 2].map((j) => <ellipse key={j} cx={200} cy={50 + j * 50} rx={it.L} ry={it.W} fill="#f2ecdc" stroke="#c9bfa6" strokeWidth={3} transform={`rotate(${-8 + j * 8} 200 ${50 + j * 50})`} />)}</svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: K.cream, letterSpacing: 3 }}>{it.name}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: it.ok ? "#8fe08a" : "#ff7a6a" }}>{it.ok ? "✓ " : "✗ "}{it.note}</div>
    </div>; })}
  </div>;
};
