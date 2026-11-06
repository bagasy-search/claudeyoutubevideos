// ola1_C · ARQUETIPOS 39-50 (para los videos con más de 38 tomas C). Mismas reglas que arq.tsx.
import React from "react";
import { Stage, phys, cl, eio, TX, DIM, AMB, RED, GRN, HAND, MARK, FONT, type H } from "./hkit";

type P = { t: number; h: H };
const ICE = "#8fd6ff";
const sh = "0 4px 0 rgba(0,0,0,.85), 0 10px 30px rgba(0,0,0,.8)";
const card = "0 40px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.08)";
const dur = (h: H) => Math.max(2, h.out - h.at);
const stag = (h: H, i: number, n: number, d0 = 0.35) => d0 + (i * Math.max(0.35, (dur(h) * 0.72 - d0))) / Math.max(1, n);
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const Big: React.FC<{ s: number; children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ s, children, size = 90, col = TX, style }) =>
  <div style={{ opacity: cl(s * 1.8), transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})`, fontWeight: 900, fontSize: size, color: col, textShadow: sh, lineHeight: 1.05, ...style }}>{children}</div>;
const Lbl: React.FC<{ tt: number; at?: number; y?: number; children: React.ReactNode; col?: string; size?: number }> = ({ tt, at = 1.2, y = 900, children, col = AMB, size = 58 }) =>
  <div style={abs(960, y, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, at, 6, 0.5)} size={size} col={col}>{children}</Big></div>;

// 39 · mapa: un alfiler cae sobre el contorno de un lugar y se enciende su nombre
export const Mapa: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = phys(tt, 0.6, 7, 0.4), k = eio(tt, 0.2, 1.4);
  return <><svg width={1920} height={1080} style={abs(0, 0)}>
      <path d="M520 300 L900 260 L1180 290 L1420 360 L1460 560 L1380 760 L1060 820 L760 790 L560 700 L480 520 Z" fill="rgba(143,214,255,.08)" stroke={ICE} strokeWidth={6} strokeDasharray={3200} strokeDashoffset={3200 * (1 - k)} />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={480} y1={300 + i * 60} x2={1460} y2={300 + i * 60} stroke="rgba(255,255,255,.05)" strokeWidth={2} />)}</svg>
    <div style={abs(960, 520, { transform: `translate(-50%,-100%) translateY(${(1 - s) * -500}px)` })}>
      <svg width={90} height={130}><path d="M45 0 C80 0 90 30 90 45 C90 80 45 130 45 130 C45 130 0 80 0 45 C0 30 10 0 45 0 Z" fill={RED} /><circle cx={45} cy={45} r={18} fill="#fff" /></svg></div>
    <div style={abs(960, 540, { transform: `translate(-50%,-50%) scale(${1 + 2 * cl(tt - 0.9) % 1})`, width: 60, height: 20, borderRadius: "50%", border: `4px solid ${RED}`, opacity: 1 - cl((tt - 0.9) * 0.8) })} />
    <Lbl tt={tt} at={1.1} y={600} col={TX} size={96}>{h.place}</Lbl>{h.year && <Lbl tt={tt} at={1.6} y={720} col={AMB} size={70}>{h.year}</Lbl>}</>; }}</Stage>;

// 40 · candado: el arco baja y cierra con un golpe
export const Candado: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = phys(tt, Math.min(1.4, dur(h) * 0.35), 9, 0.5), y = 70 * (1 - cl(c)), sh2 = Math.exp(-6 * Math.max(0, tt - 1.6)) * Math.sin(tt * 40) * 6 * (tt > 1.5 ? 1 : 0);
  return <><svg width={520} height={640} style={abs(700, 140 + sh2)}>
      <path d={`M130 ${300 - y} L130 ${170 - y} A130 130 0 0 1 390 ${170 - y} L390 ${300 - y}`} stroke="#c9ced4" strokeWidth={46} fill="none" strokeLinecap="round" />
      <rect x={40} y={280} width={440} height={340} rx={40} fill="url(#cg)" /><defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e2b04a" /><stop offset="1" stopColor="#8a6418" /></linearGradient></defs>
      <circle cx={260} cy={420} r={34} fill="#3a2a10" /><rect x={248} y={430} width={24} height={90} rx={10} fill="#3a2a10" /></svg>
    <Lbl tt={tt} at={1.7} y={830} col={c > 0.9 ? GRN : TX} size={64}>{h.label}</Lbl></>; }}</Stage>;

// 41 · sobre: se abre la solapa y sube la tarjeta con la frase
export const Sobre: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.2, 6, 0.45), f = eio(tt, 0.7, 1.3), up = phys(tt, 1.3, 6, 0.5);
  return <div style={abs(960, 600, { transform: `translate(-50%,-50%) translateY(${(1 - s) * 500}px)`, width: 900, height: 520 })}>
    <div style={abs(70, 40 - 300 * cl(up), { width: 760, height: 440, background: "#fbfaf6", borderRadius: 10, boxShadow: card, padding: 50, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#1d2a4a", lineHeight: 1.1 })}>{h.note}</div>
    <div style={abs(0, 140, { width: 900, height: 380, background: "linear-gradient(180deg,#c8a878,#a88654)", borderRadius: 12, boxShadow: card, clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" })} />
    <div style={abs(0, 140, { width: 900, height: 300, background: "#b8966a", transformOrigin: "50% 0%", transform: `perspective(1400px) rotateX(${180 * f}deg)`, clipPath: "polygon(0 0, 100% 0, 50% 100%)", opacity: f > 0.5 ? 0.2 : 1 })} /></div>; }}</Stage>;

// 42 · escalera: cada escalón sube con su paso, la figura trepa
export const Escalera: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const st: string[] = h.steps ?? [], n = st.length, W = 1300 / n;
  return <>{st.map((x, i) => { const s = phys(tt, stag(h, i, n), 6, 0.45), hh = 140 + i * 110;
    return <div key={i} style={abs(310 + i * W, 900 - hh * cl(s), { width: W - 12, height: hh * cl(s), background: `linear-gradient(180deg, ${i === n - 1 ? GRN : "#5a6370"}, #2a2e35)`, borderRadius: "14px 14px 0 0", boxShadow: card })}>
      <div style={{ position: "absolute", top: -78, width: "100%", textAlign: "center", fontWeight: 900, fontSize: W > 300 ? 42 : 34, color: TX, textShadow: sh, opacity: cl(s * 2), lineHeight: 1.05 }}>{x}</div>
      <div style={{ position: "absolute", bottom: 16, width: "100%", textAlign: "center", fontFamily: MARK, fontSize: 70, color: "rgba(255,255,255,.35)" }}>{i + 1}</div></div>; })}</>; }}</Stage>;

// 43 · dominó: una ficha empuja a la otra (causa → efecto)
export const Domino: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L: string[] = h.chain ?? [], n = L.length, gap = 1300 / n;
  return <>{L.map((x, i) => { const a = 0.6 + i * 0.45, r = 72 * eio(tt, a, a + 0.35) * (i < n - 1 ? 1 : 0.0), on = tt > a;
    return <div key={i} style={abs(330 + i * gap, 300, { width: 120, height: 420, transformOrigin: "100% 100%", transform: `rotate(${r}deg)` })}>
      <div style={{ width: 120, height: 420, borderRadius: 16, background: on ? (i === n - 1 ? RED : "#f4f1ea") : "#cfcac0", boxShadow: card }} />
      <div style={{ position: "absolute", top: 450, left: 60, transform: "translateX(-50%)", fontWeight: 900, fontSize: 38, color: on ? TX : DIM, textShadow: sh, whiteSpace: "nowrap", textAlign: "center" }}>{x}</div></div>; })}</>; }}</Stage>;

// 44 · cronómetro digital grande: corre de a en b
export const Cronometro: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = h.from ?? 0, b = h.to ?? 60, v = a + (b - a) * eio(tt, 0.3, Math.max(1, dur(h) * 0.8)), sec = Math.floor(v), cs = Math.floor((v - sec) * 100), done = v >= b - 0.01;
  return <><div style={abs(960, 430, { transform: "translate(-50%,-50%)", padding: "40px 80px", borderRadius: 40, background: "#0d0f12", border: `6px solid ${done ? GRN : "#2c3038"}`, boxShadow: done ? `0 0 80px ${GRN}66` : card })}>
      <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 220, color: done ? GRN : "#ff6a4a", letterSpacing: 6 }}>{String(Math.floor(sec / 60)).padStart(1, "0")}:{String(sec % 60).padStart(2, "0")}<span style={{ fontSize: 110 }}>.{String(cs).padStart(2, "0")}</span></div></div>
    <Lbl tt={tt} at={0.8} y={780} col={TX} size={66}>{h.label}</Lbl></>; }}</Stage>;

// 45 · dos ondas de sonido: la mala se aplana en la buena
export const Onda: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = eio(tt, 1.2, 2.4), pts = (amp: (x: number) => number, y0: number) => Array.from({ length: 160 }, (_, i) => `${200 + i * 9.5},${y0 + amp(i)}`).join(" ");
  return <><svg width={1920} height={1080} style={abs(0, 0)}>
      <polyline points={pts((i) => (h.a2 ? 80 : 60) * Math.sin(i * 0.5 + tt * 8) * (0.5 + 0.5 * Math.sin(i * 0.07)) * (1 - 0.7 * k), 360)} fill="none" stroke={RED} strokeWidth={8} />
      <polyline points={pts((i) => 14 * Math.sin(i * 0.12 + tt * 2), 700)} fill="none" stroke={GRN} strokeWidth={8} opacity={0.3 + 0.7 * k} /></svg>
    <div style={abs(200, 230)}><Big s={phys(tt, 0.3, 6, 0.5)} size={52} col={RED}>{h.a}</Big></div>
    <div style={abs(200, 580)}><Big s={phys(tt, 1.4, 6, 0.5)} size={52} col={GRN}>{h.b}</Big></div></>; }}</Stage>;

// 46 · caño en corte: el agua corre y se frena en el tapón (o pasa)
export const Cano: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ok = eio(tt, Math.min(2, dur(h) * 0.45), Math.min(2.8, dur(h) * 0.6)), cx = 960;
  return <><svg width={1920} height={1080} style={abs(0, 0)}>
      <rect x={200} y={420} width={1520} height={220} rx={30} fill="#2b2f36" stroke="#9aa3ab" strokeWidth={10} />
      {Array.from({ length: 18 }, (_, i) => { const x = 220 + ((i * 90 + tt * 260) % 1480), blocked = x > cx - 40 && ok < 0.5; return x < cx - 40 || ok > 0.5 ? <circle key={i} cx={x} cy={530 + 40 * Math.sin(i * 1.7)} r={16} fill="#4ab8e0" opacity={blocked ? 0 : 0.9} /> : null; })}
      <g opacity={1 - ok}><ellipse cx={cx} cy={530} rx={70} ry={100} fill={h.plugCol ?? "#6b5a3a"} />{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${cx - 60 + i * 9} 440 Q${cx + 30 * Math.sin(i)} 530 ${cx - 50 + i * 8} 620`} stroke="#3a3328" strokeWidth={4} fill="none" />)}</g></svg>
    <div style={abs(960, 260, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 0.3, 6, 0.5)} size={64} col={ok > 0.5 ? GRN : RED}>{ok > 0.5 ? h.b : h.a}</Big></div>
    <Lbl tt={tt} at={0.8} y={720} col={DIM} size={48}>{h.label}</Lbl></>; }}</Stage>;

// 47 · escudo: los golpes (fuego / agua / mano) rebotan contra el escudo
export const Escudo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const th: string[] = h.threats ?? ["FIRE", "WATER", "THIEF"], s = phys(tt, 0.2, 6, 0.45);
  return <><svg width={480} height={560} style={abs(720, 220)}><path d="M240 10 L460 90 L440 320 Q400 470 240 550 Q80 470 40 320 L20 90 Z" fill="url(#eg)" stroke="#e8ecef" strokeWidth={10} transform={`scale(${s})`} style={{ transformOrigin: "240px 280px" }} />
      <defs><linearGradient id="eg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3a7a5a" /><stop offset="1" stopColor="#173326" /></linearGradient></defs></svg>
    {th.map((x, i) => { const a = 0.6 + i * 0.6, p = cl((tt - a) / 0.5), back = cl((tt - a - 0.5) / 0.6), ang = (-150 + 120 * i) * Math.PI / 180;
      const r = 620 - 320 * p + 260 * back; return <div key={i} style={abs(960 + r * Math.cos(ang), 500 + r * 0.7 * Math.sin(ang), { transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 52, color: [RED, ICE, AMB][i % 3], textShadow: sh, opacity: tt > a ? 1 - 0.6 * back : 0, whiteSpace: "nowrap" })}>{x}</div>; })}
    <Lbl tt={tt} at={2.2} y={840} col={GRN} size={62}>{h.label}</Lbl></>; }}</Stage>;

// 48 · el nivel del agua en un tanque: baja/sube hasta la marca
export const Nivel: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.6, Math.min(3, dur(h) * 0.6)), v = (h.from ?? 0.95) + ((h.to ?? 0.72) - (h.from ?? 0.95)) * k, H0 = 620, mark = h.mark ?? 0.75;
  return <><div style={abs(560, 200, { width: 800, height: H0, border: "14px solid #e8ecef", borderTop: "none", borderRadius: "0 0 40px 40px", overflow: "hidden" })}>
      <div style={abs(0, H0 * (1 - v), { width: 800, height: H0 * v, background: "linear-gradient(180deg,#5fc6ef,#2a7ea8)" })}><div style={{ height: 14, background: "rgba(255,255,255,.4)", transform: `translateY(${4 * Math.sin(tt * 3)}px)` }} /></div>
      <div style={abs(0, H0 * (1 - mark), { width: 800, borderTop: `6px dashed ${AMB}` })} /></div>
    <div style={abs(1390, 200 + H0 * (1 - mark) - 30)}><Big s={phys(tt, 0.8, 6, 0.5)} size={46} col={AMB}>{h.markLabel ?? "WATER LINE"}</Big></div>
    <Lbl tt={tt} at={1.4} y={880} col={TX} size={62}>{h.label}</Lbl></>; }}</Stage>;

// 49 · lluvia sobre dos cajas: una se ablanda, la otra queda seca
export const Lluvia: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = eio(tt, 1, 3);
  return <><svg width={1920} height={1080} style={abs(0, 0)}>{Array.from({ length: 70 }, (_, i) => { const x = (i * 137) % 1920, y = ((tt * 900 + i * 211) % 1100) - 60; return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 40} stroke="rgba(160,200,255,.45)" strokeWidth={3} />; })}</svg>
    <div style={abs(380, 520 + 60 * w, { width: 460, height: 300 - 60 * w, background: "#b08a5a", borderRadius: `${6 + 40 * w}px`, boxShadow: card, filter: `brightness(${1 - 0.4 * w})`, transform: `skewX(${-6 * w}deg)` })} />
    <div style={abs(1080, 480, { width: 460, height: 340, background: "linear-gradient(180deg,#5a6370,#2a2e35)", borderRadius: 16, boxShadow: card, border: "6px solid #8a939e" })} />
    <div style={abs(610, 880, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.6, 6, 0.5)} size={52} col={RED}>{h.a}</Big></div>
    <div style={abs(1310, 880, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 2, 6, 0.5)} size={52} col={GRN}>{h.b}</Big></div></>; }}</Stage>;

// 50 · bolsa: las cosas caen adentro una por una (todo junto = todo perdido)
export const Bolsa: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const it: string[] = h.items ?? [], n = it.length;
  return <><svg width={620} height={560} style={abs(650, 420)}><path d="M60 120 Q40 520 310 540 Q580 520 560 120 Z" fill="#2a2420" stroke="#6a5a48" strokeWidth={8} /><path d="M60 120 Q310 40 560 120" stroke="#6a5a48" strokeWidth={8} fill="none" /></svg>
    {it.map((x, i) => { const a = stag(h, i, n, 0.3), p = eio(tt, a, a + 0.7), y = 140 + p * 400, inside = p > 0.95;
      return <div key={i} style={abs(960 + (i - (n - 1) / 2) * 60 * (1 - p), y, { transform: `translate(-50%,-50%) rotate(${(1 - p) * (i % 2 ? 20 : -20)}deg) scale(${1 - 0.5 * p})`, opacity: inside ? 0 : cl((tt - a) * 4), padding: "14px 26px", borderRadius: 14, background: "#f4f1ea", color: "#222", fontWeight: 900, fontSize: 40, whiteSpace: "nowrap", boxShadow: card })}>{x}</div>; })}
    <Lbl tt={tt} at={dur(h) * 0.7} y={140} col={RED} size={60}>{h.label}</Lbl></>; }}</Stage>;

export const ARQ2: Record<string, React.FC<P>> = { Mapa, Candado, Sobre, Escalera, Domino, Cronometro, Onda, Cano, Escudo, Nivel, Lluvia, Bolsa };
void FONT;
