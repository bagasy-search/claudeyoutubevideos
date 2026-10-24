// mecdesemp · piezas 2D propias del resto: cada idea del guion con SU pieza (la cortina que sube, el punto de rocío,
// el botón del copito, la botonera del orden, el aire de afuera contra el de adentro) + el fondo de taller de las piezas.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COL, FONT, e, ei, extrude, spr } from "./lib";
import { Big, card, dark, pop } from "./kit2d";

const K = (k: number) => Math.min(1, k);

// fondo de las piezas: pizarrón azul noche con cuadrícula y una luz que se mueve despacio (sin desenfoque)
export const Fondo: React.FC<{ t: number; tone?: string }> = ({ t, tone = "#0f1b2c" }) => {
  const lx = 50 + 18 * Math.sin(t * 0.21), ly = 40 + 10 * Math.cos(t * 0.17);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${lx}% ${ly}%, ${tone} 0%, #070c14 70%)` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(143,214,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(143,214,255,.06) 1px, transparent 1px)", backgroundSize: "80px 80px", backgroundPosition: `${(t * 6) % 80}px ${(t * 3) % 80}px` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// LA CORTINA: un parabrisas dibujado, blanco de empañado, que se abre desde abajo como una cortina que sube
export const Cortina: React.FC<{ t: number; at: number; out: number; openAt: number; x?: number; y?: number }> = ({ t, at, out, openAt, x = 960, y = 500 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const up = ei(t, openAt, openAt + 3.2), sec = Math.min(30, Math.round(e(t, openAt, openAt + 3.2) * 30));
  const fogTop = 100 - up * 100; // % de vidrio todavía empañado medido desde arriba
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * K(k)})` }}>
      <svg width={1300} height={560} viewBox="0 0 1300 560" style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,.7))" }}>
        <defs>
          <clipPath id="vid"><path d="M120 60 Q650 -10 1180 60 L1270 520 Q650 470 30 520 Z" /></clipPath>
          <linearGradient id="calle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b4f66" /><stop offset=".55" stopColor="#9fb3c4" /><stop offset=".56" stopColor="#4a4f55" /><stop offset="1" stopColor="#2a2d31" /></linearGradient>
        </defs>
        <g clipPath="url(#vid)">
          <rect width={1300} height={560} fill="url(#calle)" />
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={260 + i * 160} cy={250 - i * 6} r={10} fill="#ffcf7a" opacity={0.9} />)}
          <rect x={560} y={320} width={180} height={70} rx={14} fill="#1b1f24" /><circle cx={590} cy={350} r={10} fill="#ffe7a8" /><circle cx={710} cy={350} r={10} fill="#ffe7a8" />
          <rect x={0} y={0} width={1300} height={(560 * fogTop) / 100} fill="#eef3f6" opacity={0.93} />
          <rect x={0} y={(560 * fogTop) / 100 - 30} width={1300} height={30} fill="#eef3f6" opacity={0.5 * (fogTop > 0 ? 1 : 0)} />
        </g>
        <path d="M120 60 Q650 -10 1180 60 L1270 520 Q650 470 30 520 Z" fill="none" stroke="#1a1d22" strokeWidth={26} />
        <rect x={0} y={500} width={1300} height={60} fill="#15181c" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${420 + i * 110} 540 q 12 -${30 + up * 40} 0 -${60 + up * 70}`} stroke={COL.ice} strokeWidth={6} fill="none" opacity={0.85 * e(t, openAt - 0.4, openAt)} strokeDasharray="10 12" strokeDashoffset={-t * 60} />)}
      </svg>
      <div style={{ position: "absolute", right: -40, top: -70, opacity: e(t, openAt, openAt + 0.2) }}><Big s={110} c="#7dff9e" edge="#0a3a1a">{sec} S</Big></div>
    </div>
  );
};

// EL PUNTO DE ROCÍO: un termómetro con la raya del rocío; el vidrio baja de la raya y se empaña
export const Rocio: React.FC<{ t: number; at: number; dropAt: number; out: number; x?: number; y?: number }> = ({ t, at, dropAt, out, x = 620, y = 560 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const H = 640, dew = 0.55, glass = 0.82 - 0.55 * ei(t, dropAt, dropAt + 1.2), fog = e(t, dropAt + 0.7, dropAt + 1.4);
  const Y = (v: number) => H * (1 - v);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * K(k)})`, display: "flex", alignItems: "center", gap: 60, fontFamily: FONT }}>
      <div style={{ position: "relative", width: 120, height: H }}>
        <div style={{ position: "absolute", left: 30, top: 0, width: 60, height: H, borderRadius: 30, background: "rgba(255,255,255,.12)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.3)" }} />
        <div style={{ position: "absolute", left: 40, bottom: 0, width: 40, height: H * glass, borderRadius: 20, background: `linear-gradient(0deg, ${COL.ice}, #e8f6ff)` }} />
        <div style={{ position: "absolute", left: -40, right: -40, top: Y(dew), height: 6, background: "#ffd60a", boxShadow: "0 0 18px #ffd60a" }} />
        <div style={{ position: "absolute", left: 150, top: Y(dew) - 30, whiteSpace: "nowrap", fontWeight: 900, fontSize: 44, color: "#ffd60a", textShadow: extrude(5, "#5a4500") }}>PUNTO DE ROCÍO</div>
        <div style={{ position: "absolute", left: 150, top: Y(glass) - 24, whiteSpace: "nowrap", fontWeight: 900, fontSize: 40, color: COL.ice, textShadow: extrude(5, "#0a2a40") }}>◀ EL VIDRIO</div>
      </div>
      <div style={{ ...card, width: 420, height: 300, marginLeft: 380, position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#5d7d96,#23384a)" }}>
        <div style={{ position: "absolute", inset: 0, background: `rgba(238,243,246,${0.92 * fog})` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 58, color: fog > 0.5 ? "#1d2733" : "#fff", opacity: 0.4 + 0.6 * fog }}>{fog > 0.5 ? "EMPAÑADO" : "LIMPIO"}</div>
      </div>
    </div>
  );
};

// EL BOTÓN DEL COPITO: un botón A/C gigante que se aprieta y prende su lucecita
export const AcBtn: React.FC<{ t: number; at: number; pressAt: number; out: number; x?: number; y?: number; sub?: string }> = ({ t, at, pressAt, out, x = 960, y = 520, sub }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const pr = Math.sin(Math.min(1, Math.max(0, (t - pressAt) / 0.35)) * Math.PI), on = e(t, pressAt + 0.15, pressAt + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})`, textAlign: "center", fontFamily: FONT }}>
      <div style={{ width: 520, height: 300, borderRadius: 40, margin: "0 auto", background: "linear-gradient(180deg,#3a4048,#1d2126)", boxShadow: `0 ${30 - 20 * pr}px ${60 - 30 * pr}px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.18)`, transform: `rotateX(${18 + 10 * pr}deg) translateY(${pr * 16}px)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 40, position: "relative" }}>
        <div style={{ position: "absolute", left: 50, top: 50, width: 44, height: 22, borderRadius: 11, background: on > 0.5 ? "#7dff9e" : "#2c3138", boxShadow: on > 0.5 ? "0 0 30px #7dff9e, 0 0 60px #7dff9e" : "none" }} />
        <span style={{ fontSize: 150, color: "#e6eef4" }}>❄</span>
        <span style={{ fontSize: 120, fontWeight: 900, color: "#e6eef4" }}>A/C</span>
      </div>
      {sub && <div style={{ marginTop: 40, opacity: on }}><Big s={70} c={COL.ice} edge="#0a2a40">{sub}</Big></div>}
    </div>
  );
};

// LA BOTONERA: el tablero dibujado; con cada número de la voz se mueve su control (A/C, recirculación, calor, ventilador, parabrisas)
export const Botonera: React.FC<{ t: number; at: number; out: number; steps: number[]; x?: number; y?: number; sc?: number }> = ({ t, at, out, steps, x = 960, y = 600, sc = 1 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const s = (i: number) => (steps[i] === undefined ? 0 : e(t, steps[i], steps[i] + 0.4));
  const knob = (ang: number, col: string, label: string, n: number, lit: number) => (
    <div style={{ textAlign: "center", position: "relative" }}>
      <div style={{ width: 210, height: 210, borderRadius: 105, background: "radial-gradient(circle at 40% 35%, #4b525c, #1a1d22 70%)", boxShadow: `0 20px 40px rgba(0,0,0,.6), 0 0 0 8px ${lit > 0.5 ? col : "#2a2f36"}`, position: "relative", transform: `rotate(${ang}deg)` }}>
        <div style={{ position: "absolute", left: 99, top: 14, width: 12, height: 70, borderRadius: 6, background: "#f4efe6" }} />
      </div>
      <div style={{ marginTop: 18, fontWeight: 900, fontSize: 34, color: lit > 0.5 ? col : COL.dim }}>{label}</div>
      <Num n={n} v={lit} />
    </div>);
  const btn = (txt: string, light: boolean, label: string, n: number, lit: number) => (
    <div style={{ textAlign: "center", position: "relative" }}>
      <div style={{ width: 230, height: 120, borderRadius: 22, background: "linear-gradient(180deg,#3a4048,#1d2126)", boxShadow: `0 20px 40px rgba(0,0,0,.6), 0 0 0 6px ${lit > 0.5 ? "#7dff9e" : "#2a2f36"}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontSize: 56, color: "#e6eef4", fontWeight: 900, position: "relative" }}>
        <div style={{ position: "absolute", left: 18, top: 16, width: 30, height: 14, borderRadius: 7, background: light ? "#ffb257" : "#2c3138", boxShadow: light ? "0 0 20px #ffb257" : "none" }} />{txt}
      </div>
      <div style={{ marginTop: 18, fontWeight: 900, fontSize: 34, color: lit > 0.5 ? "#7dff9e" : COL.dim }}>{label}</div>
      <Num n={n} v={lit} />
    </div>);
  const acOn = s(0) > 0.5, recOff = s(1) > 0.5;
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, opacity: o, padding: "50px 60px 60px", transform: `translate(-50%,-50%) scale(${sc * (0.7 + 0.3 * K(k))}) perspective(1600px) rotateX(10deg)`, fontFamily: FONT }}>
      <div style={{ display: "flex", gap: 70, justifyContent: "center", marginBottom: 60 }}>
        <div style={{ position: "relative" }}>{btn("❄ A/C", acOn, "1 · A/C PRENDIDO", 1, s(0))}{acOn && <div style={{ position: "absolute", left: 18, top: 16, width: 30, height: 14, borderRadius: 7, background: "#7dff9e", boxShadow: "0 0 24px #7dff9e" }} />}</div>
        {btn("🚗↻", !recOff, "2 · RECIRCULACIÓN OFF", 2, s(1))}
      </div>
      <div style={{ display: "flex", gap: 70, justifyContent: "center" }}>
        {knob(-120 + 240 * s(2), COL.red, "3 · CALOR", 3, s(2))}
        {knob(-120 + 240 * s(3), COL.ice, "4 · VENTILADOR ALTO", 4, s(3))}
        {knob(-60 + 150 * s(4), "#ffd60a", "5 · AL PARABRISAS", 5, s(4))}
      </div>
    </div>
  );
};
const Num: React.FC<{ n: number; v: number }> = ({ n, v }) => v < 0.01 ? null : (
  <div style={{ position: "absolute", right: -26, top: -36, width: 76, height: 76, borderRadius: 38, background: "linear-gradient(180deg,#ffe28a,#f2b632)", color: "#3a2400", fontWeight: 900, fontSize: 52, lineHeight: "76px", textAlign: "center", transform: `scale(${v})`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>{n}</div>
);

// AFUERA CONTRA ADENTRO: dos frascos de aire; el de afuera (helado) casi sin agua, el de adentro (respirado) cargado
export const Jarras: React.FC<{ t: number; at: number; inAt: number; out: number }> = ({ t, at, inAt, out }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const jar = (title: string, sub: string, lvl: number, col: string, a: number) => {
    const kk = K(spr(t, a, 0.9)), f = ei(t, a + 0.2, a + 1.2) * lvl;
    return (
      <div style={{ textAlign: "center", opacity: kk, transform: `translateY(${(1 - kk) * 120}px)` }}>
        <Big s={60} c={col} edge="#0a1a2a">{title}</Big>
        <div style={{ fontWeight: 800, fontSize: 30, color: COL.dim, margin: "8px 0 20px" }}>{sub}</div>
        <div style={{ width: 300, height: 420, margin: "0 auto", borderRadius: "40px 40px 60px 60px", border: "6px solid rgba(220,240,255,.6)", position: "relative", overflow: "hidden", background: "rgba(255,255,255,.05)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 100}%`, background: "linear-gradient(0deg,#2f7fd8,#8fd6ff)", opacity: 0.85 }} />
          {Array.from({ length: Math.round(f * 14) }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + ((i * 53) % 230), bottom: 10 + ((i * 37) % 300) * f, width: 14, height: 14, borderRadius: 7, background: "#e8f6ff", opacity: 0.6 }} />)}
        </div>
        <div style={{ marginTop: 16, fontWeight: 900, fontSize: 44, color: col }}>{lvl < 0.3 ? "POCA AGUA" : "CARGADO"}</div>
      </div>);
  };
  return (
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${0.75 + 0.25 * K(k)})`, display: "flex", gap: 160, fontFamily: FONT }}>
      {jar("AFUERA", "AIRE HELADO", 0.16, COL.ice, at)}
      {jar("ADENTRO", "EL QUE YA RESPIRASTE", 0.82, "#ffb257", inAt)}
    </div>
  );
};
