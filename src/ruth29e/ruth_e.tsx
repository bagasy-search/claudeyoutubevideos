// ruth29e «Wild Hogs» · componentes únicos (uno por minuto), ninguno repite mecanismo de ruth29a/b/c/d.
// Chanchos, trampas, remolques y vecinos: cada pieza es un objeto que se entiende sin leer y cuenta lo que se dice en ese segundo.
import React from "react";
import { H, cl, eio, eIn, TX, DIM, AMB, RED, GRN, MARK, HAND } from "./hkit";
import { FONT } from "./lib";
import { pop, At, Stamp, PAPER, MANILA, INK } from "./ruth_a";
import { S, bt, shadow, rnd, Lbl } from "./ruth_b";

const DIRT = "#5a3e26", CORN = "#6a9a3a", HOGC = "#3a2e28";
// chancho salvaje de perfil: lomo alto con cerdas, hocico, colmillo
const Hog: React.FC<{ x: number; y: number; s?: number; tt?: number; flip?: boolean; o?: number; col?: string; tusk?: boolean }> = ({ x, y, s = 1, tt = 0, flip, o = 1, col = HOGC, tusk = true }) => <svg width={240} height={150} viewBox="-120 -80 240 150" style={{ position: "absolute", left: x - 120, top: y - 75, transform: `scale(${flip ? -s : s},${s})`, opacity: o, overflow: "visible" }}>
  {[-60, -30, 30, 56].map((lx, i) => <rect key={i} x={lx} y={20} width={14} height={36 + 6 * Math.sin(tt * 10 + i * 1.7)} rx={4} fill={col} />)}
  <path d="M-90 10 Q-96 -40 -40 -52 Q20 -64 60 -40 Q90 -24 92 6 Q80 40 -60 40 Q-92 36 -90 10 Z" fill={col} />
  {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-50 + i * 12} y1={-50 - (i < 5 ? i * 2 : (9 - i) * 2)} x2={-46 + i * 12} y2={-66 - (i < 5 ? i * 2 : (9 - i) * 2)} stroke={col} strokeWidth={4} />)}
  <path d="M60 -40 L118 -6 L118 14 L80 20 Z" fill={col} /><ellipse cx={118} cy={4} rx={6} ry={11} fill="#6a4a40" /><circle cx={78} cy={-20} r={4} fill="#111" /><path d="M66 -42 L58 -64 L74 -48 Z" fill={col} />
  {tusk && <path d="M100 14 Q108 2 104 -6" stroke="#f3ead6" strokeWidth={4} fill="none" />}<path d="M-90 0 q-14 -6 -10 -18" stroke={col} strokeWidth={4} fill="none" />
</svg>;
const Piglet: React.FC<{ x: number; y: number; s?: number; tt?: number }> = ({ x, y, s = 0.45, tt = 0 }) => <Hog x={x} y={y} s={s} tt={tt} col="#6a5040" tusk={false} />;

// m0 · el maizal a la mañana: las hileras perfectas se dan vuelta como si hubiera pasado un rotovator
export const HRootedRows: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const r = eio(tt, 1.4, 5);
  return <At x={960} y={580} rx={55}>
    <div style={{ width: 1600, height: 900, position: "relative", background: DIRT, boxShadow: shadow, overflow: "hidden" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 74, height: 30, background: "#4a321e" }}>
        {Array.from({ length: 40 }, (_, k) => { const torn = rnd(i * 40 + k) < r * 1.1; return <div key={k} style={{ position: "absolute", left: 10 + k * 40, top: torn ? -14 + rnd(k + i) * 30 : -10, width: torn ? 30 : 6, height: torn ? 18 : 22, background: torn ? "#6a4a2e" : CORN, borderRadius: torn ? "40%" : 3, transform: torn ? `rotate(${rnd(k) * 90}deg)` : "none" }} />; })}</div>)}
      {Array.from({ length: 30 }, (_, i) => <svg key={i} width={30} height={30} style={{ position: "absolute", left: rnd(i + 70) * 1560, top: rnd(i + 90) * 860, opacity: r }}><path d="M8 4 Q4 20 12 26 M18 4 Q24 20 16 26" stroke="#2a1a0a" strokeWidth={5} fill="none" /></svg>)}
    </div>
    <Lbl x={800} y={-120} tt={tt} at={0.6} txt="40 acres of corn · first light" size={58} />
  </At>;
}} />;

// m1 · el rastro: una fila de chanchos baja del arroyo y avanza por los surcos (vista de arriba con huellas)
export const HHoofTrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.3, 7);
  return <>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,#2f4a2a 0 18%,${DIRT} 18%)` }} />
    <div style={{ position: "absolute", left: 120, top: 0, width: 90, height: 1080, background: "#3a6a7a" }} />
    {Array.from({ length: 8 }, (_, i) => { const x = 200 + p * 1700 - i * 150; return x > 200 && <Hog key={i} x={x} y={540 + Math.sin(i * 2) * 40} s={i % 3 === 0 ? 0.9 : 0.55} tt={tt + i} />; })}
    {Array.from({ length: 60 }, (_, i) => { const x = 220 + i * 28; return x < 200 + p * 1700 - 200 && <svg key={i} width={24} height={24} style={{ position: "absolute", left: x, top: 600 + (i % 2) * 22 + Math.sin(i) * 12 }}><path d="M6 2 Q3 14 10 20 M15 2 Q19 14 12 20" stroke="#2a1a0a" strokeWidth={4} fill="none" /></svg>; })}
    <Lbl x={1100} y={140} tt={tt} at={1} txt="one night · out of the creek bottom" size={58} />
  </>;
}} />;

// m2 · el remolque de noche: luces traseras rojas, el portón se abre y bajan chanchos donde no había
export const HTrailerNight: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const op = eio(tt, 1.6, 2.6), out = eio(tt, 2.6, 6);
  return <>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 120%,#1a2a1a,#06080a 70%)" }} />
    {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1920, top: rnd(i + 3) * 400, width: 3, height: 3, background: "#fff", opacity: 0.5 + 0.5 * Math.sin(tt * 2 + i) }} />)}
    <div style={{ position: "absolute", left: 500, top: 420, width: 760, height: 340, background: "#4a4a4e", border: "8px solid #2a2a2e", boxShadow: "0 0 80px rgba(0,0,0,.8)" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 120, top: 40, width: 80, height: 30, background: "#111" }} />)}
      {[[-30, 280], [730, 280]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 40, height: 30, background: RED, boxShadow: `0 0 40px ${RED}` }} />)}</div>
    <div style={{ position: "absolute", left: 1260, top: 420, width: 20, height: 340, background: "#3a3a3e", transformOrigin: "0 100%", transform: `rotate(${op * 70}deg)` }} />
    {Array.from({ length: 5 }, (_, i) => <Hog key={i} x={1180 + out * (300 + i * 90)} y={720 + i * 14} s={0.6} tt={tt + i} o={cl(out * 3 - i * 0.3)} />)}
    <Lbl x={960} y={160} tt={tt} at={3.4} txt="people moved them · on purpose" size={62} col={AMB} />
  </>;
}} />;

// m3 · 1539: la carabela llega a Florida y baja una docena de chanchos por la rampa
export const HShipLanding: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = eio(tt, 0.2, 2.2), n = Math.round(12 * eio(tt, 2.4, 6));
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#f2c48a,#bfd8d8 50%,#3a7a8a 50%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 440, background: "linear-gradient(#e8d3a0,#c9a46a)" }} />
    <svg width={700} height={600} viewBox="0 0 700 600" style={{ position: "absolute", left: -500 + s * 600, top: 120 }}><path d="M40 420 L660 420 L600 520 L100 520 Z" fill="#6b3a1a" /><rect x={330} y={60} width={14} height={360} fill="#4a2a10" />
      <path d="M200 100 Q340 60 480 100 L470 300 Q340 270 210 300 Z" fill="#efe6d2" /><path d="M300 150 L380 150 M340 110 L340 260" stroke="#b8401f" strokeWidth={20} /></svg>
    {Array.from({ length: n }, (_, i) => <Piglet key={i} x={800 + (i % 6) * 150} y={720 + Math.floor(i / 6) * 110} s={0.5} tt={tt + i} />)}
    <div style={{ position: "absolute", left: 1500, top: 120, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: INK }}>{n}</div>
    <Lbl x={960} y={70} tt={tt} at={1} txt="Florida, 1539 · soldiers, horses, and pigs" size={56} col={INK} />
  </>;
}} />;

// m3-4 · la marcha de De Soto: la ruta se dibuja por los estados y la piara crece de 12 a cientos
export const HMarchTrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.4, 6.5), n = Math.round(12 + 300 * p * p);
  const pts = [[1500, 900], [1500, 600], [1300, 520], [1100, 360], [900, 420], [760, 600], [560, 640], [420, 420]];
  const d = "M" + pts.map((q) => q.join(" ")).join(" L");
  return <>
    <div style={{ position: "absolute", left: 160, top: 140, width: 1600, height: 860, borderRadius: 20, background: "linear-gradient(135deg,#d8c79a,#b8a26a)", boxShadow: shadow }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={d} stroke="#8a2a1a" strokeWidth={10} fill="none" strokeDasharray={3000} strokeDashoffset={3000 * (1 - p)} strokeLinecap="round" />
      {["FL", "GA", "SC/NC", "TN", "AL", "MS", "AR"].map((s, i) => <text key={s} x={pts[i + 1][0]} y={pts[i + 1][1] - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK} opacity={cl(p * 8 - i)}>{s}</text>)}</svg>
    <div style={{ position: "absolute", left: 240, top: 820, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: INK }}>{n} <span style={{ fontSize: 40 }}>PIGS</span></div>
    <Lbl x={1100} y={200} tt={tt} at={3} txt="some escaped · some traded · some left behind" size={46} col={INK} />
  </>;
}} />;

// m4-5 · la marca en la oreja: la oreja del chancho recibe las muescas de la familia
export const HEarNotch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const n = [eio(tt, 1, 1.4), eio(tt, 1.8, 2.2), eio(tt, 2.6, 3)];
  return <>
    <svg width={900} height={800} viewBox="0 0 900 800" style={{ position: "absolute", left: 300, top: 140 }}>
      <path d="M100 760 Q60 420 280 120 Q360 20 440 60 Q520 120 600 300 Q700 520 640 760 Z" fill="#c99a88" stroke="#8a5a4a" strokeWidth={8} />
      <path d="M200 700 Q200 420 340 200 Q420 120 480 200 Q560 360 560 700 Z" fill="#e8b8a8" />
      <path d={`M${280 - 0} 130 l${30 * n[0]} ${40 * n[0]} l${30 * n[0]} ${-40 * n[0]}`} fill="#06080a" />
      <path d={`M600 300 l${-50 * n[1]} ${20 * n[1]} l${40 * n[1]} ${30 * n[1]}`} fill="#06080a" />
      <circle cx={420} cy={420} r={26 * n[2]} fill="#06080a" />
    </svg>
    <div style={{ position: "absolute", left: 1220, top: 300, width: 520, padding: "34px 40px", background: PAPER, boxShadow: shadow, transform: `rotate(3deg) scale(${pop(tt, 3.4)})` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK }}>FAMILY MARK</div><div style={{ fontFamily: HAND, fontSize: 44, color: INK, marginTop: 10 }}>top notch · side cut · hole</div></div>
    <Lbl x={1480} y={700} tt={tt} at={4.4} txt="turned out, rounded up in the fall" size={46} />
  </>;
}} />;

// m5 · el bosque de bellotas: chanchos que se meten entre los robles y algunos nunca vuelven a salir
export const HAcornForest: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#2a3a24,#1a2418)" }} />
  {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 170 - 20, top: 0, width: 60 + (i % 3) * 20, height: 1080, background: "linear-gradient(90deg,#3a2a1a,#5a4028,#3a2a1a)" }} />)}
  {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1920, top: 860 + rnd(i + 2) * 180, width: 22, height: 28, borderRadius: "40% 40% 50% 50%", background: "#8a5a2a", borderTop: "8px solid #5a3a1a" }} />)}
  {Array.from({ length: 6 }, (_, i) => { const go = eio(tt, 0.4 + i * 0.4, 4 + i * 0.4); return <Hog key={i} x={200 + i * 120 + go * 1100} y={860 + (i % 2) * 40} s={0.6} tt={tt + i} o={i % 2 ? 1 - cl(go * 1.4 - 0.4) : 1} />; })}
  <Lbl x={960} y={160} tt={tt} at={2} txt="a lot of them never got rounded up" size={60} />
  <Lbl x={960} y={240} tt={tt} at={3.6} txt="they went wild" size={60} col={AMB} />
</>} />;

// m6 · ficha comparativa: chancho de granja vs. jabalí euroasiático, lado a lado, con los rasgos que se iluminan
export const HBoarCompare: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const F = ["BIGGER", "FASTER", "LONG TUSKS", "BRISTLY COAT"];
  return <>
    <div style={{ position: "absolute", left: 160, top: 220, width: 760, height: 560, background: PAPER, boxShadow: shadow }}><Hog x={380} y={300} s={1.4} tt={0} col="#e8b8a8" tusk={false} /><div style={{ position: "absolute", bottom: 30, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK }}>FARM PIG</div></div>
    <div style={{ position: "absolute", left: 1000, top: 220, width: 760, height: 560, background: PAPER, boxShadow: shadow, transform: `translateX(${(1 - pop(tt, 0.6, 6, 0.5)) * 900}px)` }}><Hog x={380} y={290} s={1.8} tt={tt} col="#2a221e" /><div style={{ position: "absolute", bottom: 30, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK }}>EURASIAN WILD BOAR</div></div>
    {F.map((f, i) => <div key={f} style={{ position: "absolute", left: 1040 + (i % 2) * 360, top: 820 + Math.floor(i / 2) * 80, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: AMB, transform: `scale(${pop(tt, 1.6 + i * 0.5)})`, transformOrigin: "0 50%" }}>✓ {f}</div>)}
    <Lbl x={960} y={130} tt={tt} at={0.4} txt="Hooper Bald, N. Carolina · 1912 · for wealthy hunters" size={50} />
  </>;
}} />;

// m6-7 · el alambrado cede: el jabalí embiste y los postes se doblan hacia afuera
export const HBrokenFence: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const hit = eIn(tt, 1.4, 2.2), out = eio(tt, 2.2, 5);
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#5a7a8a,#2a3a2a 60%,#2a2418 60%)" }} />
    {Array.from({ length: 9 }, (_, i) => { const mid = Math.abs(i - 4) < 1.5; return <div key={i} style={{ position: "absolute", left: 200 + i * 190, top: 420, width: 18, height: 300, background: "#5a3a20", transformOrigin: "50% 100%", transform: `rotate(${mid ? hit * (i - 4 || 1) * 40 : 0}deg)` }} />; })}
    {[480, 560, 640].map((y, k) => <svg key={k} width={1920} height={80} style={{ position: "absolute", left: 0, top: y - 40 }}><path d={`M200 40 L${950 - 10} ${40 + hit * 60} M${970} ${40 + hit * 60} L1720 40`} stroke="#aaa" strokeWidth={4} fill="none" /></svg>)}
    <Hog x={960 + out * 600} y={640 + out * 120} s={1.6 + out * 0.4} tt={tt} />
    <Lbl x={960} y={150} tt={tt} at={2.6} txt="within a few years: into the mountains" size={58} />
  </>;
}} />;

// m7 · el híbrido: dos siluetas se funden en una tercera más dura (mezcla de colores)
export const HHybridMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const m = eio(tt, 0.8, 3);
  return <>
    <Hog x={560 + m * 400} y={480} s={1.5} tt={tt} col="#7a5a4a" o={1 - m} tusk={false} />
    <Hog x={1360 - m * 400} y={480} s={1.5} tt={tt} col="#1e1a18" o={1 - m} flip />
    <Hog x={960} y={480} s={1.5 + 0.5 * m} tt={tt} col="#4a3a2e" o={m} />
    <Lbl x={560} y={260} tt={tt} at={0.3} txt="feral pigs" size={50} />
    <Lbl x={1360} y={260} tt={tt} at={0.3} txt="European boar" size={50} />
    {["tougher", "smarter", "lives anywhere"].map((w, i) => <Lbl key={w} x={660 + i * 300} y={760} tt={tt} at={3.2 + i * 0.5} txt={w} size={54} col={AMB} />)}
  </>;
}} />;

// m8 · el afiche de caza: «HOG HUNTS · ALL YEAR · NO LIMIT» se despliega como cartel de feria
export const HHuntPoster: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.5);
  return <At x={960} y={540} r={-2}>
    <div style={{ width: 900, height: 900, background: "linear-gradient(#efe0b8,#d8c08a)", boxShadow: shadow, transform: `translateY(${(1 - s) * -900}px)`, textAlign: "center", padding: 50, position: "relative" }}>
      <div style={{ fontFamily: MARK, fontSize: 110, color: "#8a2a1a", lineHeight: 1 }}>HOG HUNTS</div>
      <div style={{ position: "relative", height: 300 }}><Hog x={400} y={160} s={2.4} tt={tt} /></div>
      {["WITH DOGS", "AT NIGHT", "FENCED RANCH · BY THE DAY"].map((l, i) => <div key={l} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: INK, marginTop: 10, opacity: cl(pop(tt, 1.2 + i * 0.5) * 2) }}>{l}</div>)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", background: "#8a2a1a", padding: 10, transform: `scaleX(${pop(tt, 3.2)})` }}>ALL YEAR · NO SEASON · NO LIMIT</div>
    </div>
  </At>;
}} />;

// m9 · el mapa que salta: de 17 estados a más de 35, con puntos que aparecen lejos, de golpe
export const HStateJump: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const n = Math.round(17 + 18 * eio(tt, 1.6, 6));
  return <>
    <div style={{ position: "absolute", left: 160, top: 160, display: "grid", gridTemplateColumns: "repeat(10,140px)", gap: 14 }}>
      {Array.from({ length: 50 }, (_, i) => { const order = Math.floor(rnd(i + 11) * 50); const on = order < n; const jump = order >= 17 && on; return <div key={i} style={{ width: 140, height: 120, borderRadius: 10, background: on ? (jump ? "#c23a1a" : "#7a3a2a") : "rgba(255,255,255,.07)", transform: `scale(${jump ? pop(tt, 1.6 + (order - 17) * 0.25, 9, 0.35) : 1})` }} />; })}
    </div>
    <div style={{ position: "absolute", left: 1640, top: 400, fontFamily: FONT, fontWeight: 900, color: TX, textAlign: "center" }}><div style={{ fontSize: 160 }}>{n}</div><div style={{ fontSize: 40, color: DIM }}>STATES</div></div>
    <Lbl x={1700} y={680} tt={tt} at={4.8} txt="it didn't creep. it jumped." size={44} col={AMB} />
  </>;
}} />;

// m9-10 · la autopista: un chancho no cruza la interestatal solo; el remolque sí
export const HInterstate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tr = eio(tt, 1.8, 5.2);
  return <>
    <div style={{ position: "absolute", inset: 0, background: "#3a4a2a" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 320, background: "#2a2a2e" }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 180 - tt * 400) % 2160 + 2160) % 2160 - 120, top: 150, width: 100, height: 14, background: "#e8d080" }} />)}</div>
    <Hog x={300} y={330} s={0.9} tt={tt * 0.2} />
    <div style={{ position: "absolute", left: 250, top: 230, fontFamily: MARK, fontSize: 90, color: RED, transform: `scale(${pop(tt, 0.8)})` }}>✕</div>
    <div style={{ position: "absolute", left: -500 + tr * 2400, top: 460, width: 420, height: 140 }}><div style={{ position: "absolute", left: 0, top: 30, width: 260, height: 100, background: "#5a5a5e" }} /><div style={{ position: "absolute", left: 270, top: 10, width: 150, height: 120, background: "#8a2a1a", borderRadius: "10px 30px 6px 6px" }} />
      {[40, 200, 330].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 116, width: 40, height: 40, borderRadius: "50%", background: "#111" }} />)}</div>
    <Lbl x={960} y={860} tt={tt} at={2.4} txt="200 miles and an interstate? somebody drives them" size={54} />
  </>;
}} />;

// m10-11 · el calendario de la cerda: a los 6-8 meses ya pare; dos camadas por año; las hijas empiezan atrás
export const HSowCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const M = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const l1 = pop(tt, bt(h, 0, 1.6)), l2 = pop(tt, bt(h, 1, 3.2)), dg = pop(tt, bt(h, 2, 4.8));
  return <>
    <div style={{ position: "absolute", left: 160, top: 260, display: "grid", gridTemplateColumns: "repeat(12,124px)", gap: 8 }}>
      {M.map((m, i) => <div key={i} style={{ height: 300, background: PAPER, boxShadow: "0 10px 20px rgba(0,0,0,.4)", position: "relative" }}><div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, marginTop: 8 }}>{m}</div>
        {i === 0 && <div style={{ position: "absolute", left: 10, top: 80, fontFamily: HAND, fontSize: 30, color: "#8a2a1a", opacity: cl(pop(tt, 0.4) * 2) }}>born</div>}
        {i === 7 && <div style={{ position: "absolute", left: 6, top: 70 }}>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "relative", height: 36, transform: `scale(${l1})` }}><Piglet x={56} y={14} s={0.24} tt={tt + k} /></div>)}</div>}
        {i === 11 && <div style={{ position: "absolute", left: 6, top: 70 }}>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "relative", height: 36, transform: `scale(${l2})` }}><Piglet x={56} y={14} s={0.24} tt={tt + k} /></div>)}</div>}</div>)}
    </div>
    <Lbl x={960} y={150} tt={tt} at={0.6} txt="breeding at 6–8 months" size={58} />
    <Lbl x={960} y={680} tt={tt} at={bt(h, 1, 3.2) as number} txt="4–6 a litter · 2 litters a year" size={56} col={AMB} />
    <div style={{ position: "absolute", left: 960, top: 780, transform: `translateX(-50%) scale(${dg})`, fontFamily: HAND, fontSize: 52, color: TX }}>…and her daughters start a few months later</div>
  </>;
}} />;

// m11 · el medidor de dos tercios: la aguja tiene que pasar la marca de 66 % cada año o la piara vuelve a crecer
export const HTwoThirdsGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const v = 0.4 + 0.22 * eio(tt, 0.6, 3) + 0.04 * Math.sin(tt * 3);
  const a = -90 + 180 * v;
  return <>
    <svg width={1000} height={600} viewBox="-500 -500 1000 600" style={{ position: "absolute", left: 460, top: 160 }}>
      <path d="M-420 0 A420 420 0 0 1 420 0" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={70} />
      <path d="M-420 0 A420 420 0 0 1 420 0" fill="none" stroke={GRN} strokeWidth={70} strokeDasharray={`0 ${Math.PI * 420 * 0.667} ${Math.PI * 420}`} />
      <line x1={0} y1={0} x2={0} y2={-470} stroke={AMB} strokeWidth={6} strokeDasharray="12 8" transform={`rotate(${-90 + 180 * 0.667})`} />
      <line x1={0} y1={0} x2={0} y2={-380} stroke="#f3ead6" strokeWidth={16} strokeLinecap="round" transform={`rotate(${a})`} /><circle r={30} fill="#f3ead6" />
    </svg>
    <div style={{ position: "absolute", left: 960, top: 800, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: TX, whiteSpace: "nowrap" }}>REMOVED THIS YEAR: {Math.round(v * 100)}%</div>
    <Lbl x={1240} y={180} tt={tt} at={1.4} txt="⅔ every year, just to stay even" size={46} col={AMB} c={false} />
    <Lbl x={960} y={900} tt={tt} at={4.2} txt="most places don't come close" size={56} col={RED} />
  </>;
}} />;

// m12 · el trono vacío: lobo y puma tachados en la cadena alimentaria; el chancho arriba de todo
export const HEmptyThrone: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const up = eio(tt, 2.4, 4);
  return <>
    {[["WOLVES", 560], ["BIG CATS", 1360]].map(([l, x], i) => { const g = eio(tt, 0.6 + i * 0.6, 1.4 + i * 0.6); return <div key={i} style={{ position: "absolute", left: x as number, top: 260, transform: "translateX(-50%)", textAlign: "center", opacity: 1 - 0.6 * g }}>
      <div style={{ width: 300, height: 220, border: "6px dashed rgba(255,255,255,.4)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: TX }}>{l as string}</div>
      <div style={{ position: "absolute", left: -20, right: -20, top: 100, height: 10, background: RED, transform: `rotate(-12deg) scaleX(${g})` }} /></div>; })}
    <div style={{ position: "absolute", left: 760, top: 700 - up * 200, width: 400, height: 40, background: "#b8902a", borderRadius: 8 }} />
    <Hog x={960} y={640 - up * 200} s={1.6} tt={tt} />
    <Lbl x={960} y={900} tt={tt} at={3.8} txt="200+ lb · not much in the woods takes one on" size={52} col={AMB} />
  </>;
}} />;

// m13 · el hocico excavador en corte: la nariz entra en la tierra y saca raíces, larvas y semilla
export const HSnoutDig: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const dig = (Math.sin(tt * 3) + 1) / 2;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={560} width={1920} height={520} fill={DIRT} /><rect x={0} y={540} width={1920} height={24} fill={CORN} />
      {Array.from({ length: 18 }, (_, i) => <g key={i}><ellipse cx={200 + i * 90} cy={700 + (i % 3) * 60} rx={16} ry={10} fill={i % 3 === 0 ? "#f3ead6" : i % 3 === 1 ? "#e8c860" : "#c9b48a"} opacity={cl(1 - eio(tt, 1 + i * 0.25, 1.6 + i * 0.25))} /></g>)}
    </svg>
    {Array.from({ length: 30 }, (_, i) => { const ph = (tt * 1.1 + i / 30) % 1; return <div key={i} style={{ position: "absolute", left: 960 + (rnd(i) - 0.5) * 300 + ph * 200, top: 560 - ph * 160 + ph * ph * 200, width: 14, height: 14, borderRadius: "50%", background: "#6a4a2e", opacity: 1 - ph }} />; })}
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${0}px,${dig * 60}px) rotate(${20 + dig * 8}deg)`, transformOrigin: "960px 400px" }}><Hog x={860} y={420} s={2.2} tt={tt} /></div>
    <Lbl x={960} y={120} tt={tt} at={1} txt="roots · grubs · seed corn, right out of the ground" size={54} />
  </>;
}} />;

// m14 · el plato del chancho: maní, arroz, sorgo, sandía caen en un comedero que se vacía igual de rápido
export const HCropPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const C = [["PEANUTS", "#d8a868"], ["RICE", "#f3ead6"], ["SORGHUM", "#b8502a"], ["WATERMELON", "#3a8a3a"], ["HAY", "#c9b45a"]];
  return <>
    <div style={{ position: "absolute", left: 460, top: 640, width: 1000, height: 200, background: "linear-gradient(#7a7e84,#4a4e54)", borderRadius: "0 0 100px 100px", boxShadow: shadow }} />
    {C.map(([l, c], i) => { const at = 0.4 + i * 0.9, f = eIn(tt, at, at + 0.6), gone = eio(tt, at + 1.4, at + 2.4); return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 560 + i * 180, top: 200 + f * 460, width: 120, height: 90 * (1 - gone), borderRadius: i === 3 ? "50%" : 20, background: c, opacity: f > 0 ? 1 : 0 }} />
      <Lbl x={620 + i * 180} y={130} tt={tt} at={at} txt={l} size={32} hand={false} /></React.Fragment>; })}
    <Hog x={1580} y={660} s={1.3} tt={tt} flip />
    <Lbl x={960} y={920} tt={tt} at={4.8} txt="fences down · ponds muddied · mowers broken on the ruts" size={48} col={AMB} />
  </>;
}} />;

// m14-15 · el medidor de la luz pero de dólares: los dígitos giran hasta $1.500.000.000 / año
export const HBillionMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const v = 1.5e9 * eio(tt, 0.6, 5), s = Math.round(v).toString().padStart(10, "0");
  return <>
    <div style={{ position: "absolute", left: 260, top: 300, width: 1400, height: 400, borderRadius: 40, background: "linear-gradient(#d8dce0,#9aa1aa)", boxShadow: shadow, padding: 50 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK }}>USDA ESTIMATE · DAMAGE PER YEAR</div>
      <div style={{ display: "flex", gap: 12, marginTop: 40, justifyContent: "center" }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: INK }}>$</div>
        {s.split("").map((d, i) => <div key={i} style={{ width: 100, height: 160, background: i < 1 ? "#111" : "#1a1a1a", color: i < 1 ? AMB : "#f3ead6", fontFamily: "monospace", fontSize: 130, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, boxShadow: "inset 0 10px 20px rgba(0,0,0,.6)" }}>{d}</div>)}</div></div>
    <Lbl x={960} y={820} tt={tt} at={3.6} txt="every estimate is in the billions" size={58} col={AMB} />
  </>;
}} />;

// m15-16 · la etiqueta de laboratorio: tubo con la muestra y la lista de enfermedades que pasa a cerdos y a personas
export const HGermTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const D = ["swine brucellosis", "pseudorabies", "others"];
  return <>
    <svg width={260} height={760} viewBox="0 0 260 760" style={{ position: "absolute", left: 360, top: 160, transform: `rotate(-8deg) translateY(${(1 - pop(tt, 0.3, 6, 0.5)) * -800}px)` }}><rect x={60} y={80} width={140} height={620} rx={70} fill="rgba(220,235,240,.18)" stroke="#d8e8ee" strokeWidth={8} /><rect x={50} y={40} width={160} height={60} rx={10} fill="#c23a1a" />
      <rect x={68} y={420} width={124} height={270} rx={60} fill="#8a3a3a" />{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={90 + rnd(i) * 80} cy={450 + rnd(i + 5) * 220} r={6 + 4 * Math.sin(tt * 3 + i)} fill="#c26a6a" />)}</svg>
    <div style={{ position: "absolute", left: 760, top: 260, width: 900, padding: "40px 50px", background: "#fbf7ec", boxShadow: shadow }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK }}>WILD HOG · SAMPLE</div>
      {D.map((d, i) => <div key={d} style={{ fontFamily: HAND, fontSize: 56, color: "#8a2a1a", marginTop: 14, opacity: cl(pop(tt, 1 + i * 0.6) * 2) }}>+ {d}</div>)}
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, opacity: cl(pop(tt, 3.2) * 2) }}>→ farm pigs · → hunters who butcher</div></div>
  </>;
}} />;

// m16-17 · la bolsa de espinaca de 2006: la etiqueta de alerta se pega encima
export const HSpinachBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.5);
  return <>
    <div style={{ position: "absolute", left: 660, top: 160, width: 600, height: 760, borderRadius: "30px 30px 50px 50px", background: "linear-gradient(90deg,rgba(220,235,220,.4),rgba(255,255,255,.6),rgba(220,235,220,.4))", boxShadow: shadow, transform: `scale(${s}) rotate(-3deg)`, overflow: "hidden" }}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 520, top: 160 + rnd(i + 4) * 560, width: 120, height: 80, borderRadius: "60% 10% 60% 10%", background: i % 2 ? "#3a7a2a" : "#4f8f3a", transform: `rotate(${rnd(i) * 180}deg)` }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#2a5a1a" }}>BABY SPINACH</div></div>
    <Stamp tt={tt} at={1.6} txt="E. COLI · 2006" x={960} y={480} r={-12} size={90} />
    <Lbl x={1560} y={300} tt={tt} at={2.8} txt="hundreds sick" size={56} c={false} />
    <Lbl x={1560} y={380} tt={tt} at={3.6} txt="several died" size={56} c={false} col={RED} />
  </>;
}} />;

// m17 · el agujero en el alambrado del campo de verdura: la cámara sigue el rastro hasta el chancho
export const HFenceGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const z = eio(tt, 1.6, 4);
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + z * 0.8})`, transformOrigin: "960px 640px" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#c9d8e0,#e8e0c0 40%,#6a9a3a 40%)" }} />
    {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 460 + i * 40, height: 14, background: "repeating-linear-gradient(90deg,#3a7a2a 0 30px,#5a9a3a 30px 60px)" }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 520, height: 240, backgroundImage: "linear-gradient(45deg,#999 2px,transparent 2px),linear-gradient(-45deg,#999 2px,transparent 2px)", backgroundSize: "40px 40px", WebkitMaskImage: "radial-gradient(ellipse 130px 100px at 960px 180px,transparent 98%,#000 100%)", maskImage: "radial-gradient(ellipse 130px 100px at 960px 180px,transparent 98%,#000 100%)" } as React.CSSProperties} />
    <Hog x={960} y={660} s={1} tt={tt} />
    <Lbl x={960} y={200} tt={tt} at={0.6} txt="California fields · the same strain in wild pigs nearby" size={50} col={INK} />
  </div>;
}} />;

// m18 · el nido saqueado: huevos de pavo y codorniz en el suelo; el hocico pasa y los cascarones quedan
export const HNestRaid: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 1, 4);
  return <>
    <div style={{ position: "absolute", left: 560, top: 380, width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(#8a6a3a,#5a4020)", boxShadow: shadow }} />
    {Array.from({ length: 9 }, (_, i) => { const x = 760 + (i % 3) * 140 + (Math.floor(i / 3) % 2) * 60, y = 480 + Math.floor(i / 3) * 80, broken = p > (i + 1) / 10; return <div key={i} style={{ position: "absolute", left: x, top: y, width: 90, height: 110, borderRadius: "50% 50% 46% 46%", background: broken ? "transparent" : "radial-gradient(circle at 35% 30%,#fffaf0,#e8d8b0)", border: broken ? "4px dashed #e8d8b0" : "none", clipPath: broken ? "polygon(0 40%,20% 30%,40% 45%,60% 28%,80% 42%,100% 35%,100% 100%,0 100%)" : "none" }}>{!broken && Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: 20 + rnd(k + i) * 50, top: 20 + rnd(k + i + 3) * 60, width: 8, height: 8, borderRadius: "50%", background: "#a88a5a" }} />)}</div>; })}
    <Hog x={560 + p * 900} y={560} s={1.2} tt={tt} />
    <Lbl x={960} y={150} tt={tt} at={0.6} txt="turkeys · quail · sea turtle eggs" size={58} />
    <Lbl x={960} y={920} tt={tt} at={3.6} txt="stream banks rooted up · rare plants dug out" size={50} col={AMB} />
  </>;
}} />;

// m19 · la bellota que no llega a roble: el brote crece y el hocico se la come antes
export const HOakStop: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: DIRT }} />
  {[0, 1, 2, 3].map((i) => { const g = eio(tt, 0.4 + i * 0.8, 2 + i * 0.8), eat = eio(tt, 2.2 + i * 0.8, 2.6 + i * 0.8); const x = 360 + i * 400; return <React.Fragment key={i}>
    <div style={{ position: "absolute", left: x - 20, top: 740, width: 40, height: 46, borderRadius: "40% 40% 50% 50%", background: "#8a5a2a", borderTop: "12px solid #5a3a1a", opacity: 1 - eat }} />
    <svg width={160} height={400} style={{ position: "absolute", left: x - 80, top: 360, opacity: 1 - eat }}><path d={`M80 400 L80 ${400 - 340 * g}`} stroke="#6a8a3a" strokeWidth={8} />{g > 0.4 && <><ellipse cx={50} cy={400 - 300 * g} rx={30} ry={14} fill="#5a8a3a" /><ellipse cx={110} cy={400 - 260 * g} rx={30} ry={14} fill="#5a8a3a" /></>}</svg>
    {eat > 0.01 && eat < 0.99 && <Hog x={x + 60} y={720} s={0.8} tt={tt} flip />}</React.Fragment>; })}
  <Lbl x={960} y={150} tt={tt} at={1} txt="so many acorns eaten" size={60} />
  <Lbl x={960} y={230} tt={tt} at={3.6} txt="young oaks don't get a chance to grow" size={56} col={AMB} />
</>} />;

// m20 · la pizarra de recompensas: tachan a los grandes de la vista; los listos y los chicos se esconden detrás
export const HBountyBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const ez = eio(tt, bt(h, 0, 2), bt(h, 0, 2) + 1.4), bf = pop(tt, bt(h, 1, 4.4));
  return <>
    <div style={{ position: "absolute", left: 160, top: 160, width: 760, height: 420, background: "#2a3a2e", border: "18px solid #6b4a2c", boxShadow: shadow, padding: "30px 40px" }}>
      <div style={{ fontFamily: HAND, fontSize: 70, color: "#f3f0e6" }}>BOUNTY: $ / HOG</div><div style={{ fontFamily: HAND, fontSize: 50, color: "#f3f0e6", marginTop: 20 }}>paid at the courthouse</div></div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "relative" }}><Hog x={1200 + i * 220} y={300} s={1.1} tt={tt} o={1 - ez} /><div style={{ position: "absolute", left: 1120 + i * 220, top: 290, width: 160, height: 8, background: RED, transform: `scaleX(${ez})` }} /></div>)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 680, height: 400, background: "linear-gradient(#2a3a24,#1a2418)" }} />
    {Array.from({ length: 6 }, (_, i) => <Piglet key={i} x={1100 + i * 120} y={800 + (i % 2) * 40} s={0.5} tt={tt} />)}
    <Hog x={980} y={800} s={1} tt={tt} />
    <Lbl x={960} y={1000} tt={tt} at={(bt(h, 0, 2) as number) + 1} txt="the smart sows and the young ones learn to hide" size={50} col={AMB} />
    <div style={{ position: "absolute", left: 300, top: 640, transform: `scale(${bf}) rotate(-6deg)`, padding: "16px 26px", background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 44 }}>…IT CAN BACKFIRE</div>
  </>;
}} />;

// m21 · desde el helicóptero: vista cenital con la sombra de las palas sobre el campo abierto
export const HHeliView: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const r = tt * 900;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(20deg,#a89a5a 0 60px,#988a4a 60px 120px)", transform: `translateY(${(tt * 40) % 120}px)` }} />
    {Array.from({ length: 8 }, (_, i) => <svg key={i} width={70} height={40} viewBox="0 0 70 40" style={{ position: "absolute", left: 500 + rnd(i) * 900 + Math.sin(tt + i) * 20, top: 300 + rnd(i + 4) * 500 }}><ellipse cx={30} cy={20} rx={28} ry={14} fill={HOGC} /><ellipse cx={60} cy={20} rx={10} ry={8} fill={HOGC} /></svg>)}
    <svg width={900} height={900} viewBox="-450 -450 900 900" style={{ position: "absolute", left: 510, top: 90, opacity: 0.4 }}><g transform={`rotate(${r})`}>{[0, 90, 180, 270].map((a) => <rect key={a} x={-20} y={-430} width={40} height={430} fill="#111" transform={`rotate(${a})`} />)}</g></svg>
    <div style={{ position: "absolute", right: 140, bottom: 220, padding: "22px 34px", background: PAPER, boxShadow: shadow, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK, transform: `rotate(-3deg) scale(${pop(tt, 1.6, 7, 0.5)})` }}>TEXAS · 2011 · “PORK CHOPPER” LAW</div>
    <Lbl x={960} y={960} tt={tt} at={3} txt="helps in open country · rarely reaches two-thirds" size={50} col={AMB} />
  </>;
}} />;

// m21-22 · el estallido: un disparo y la piara se dispersa en todas direcciones, hacia zonas nuevas
export const HScatterBurst: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const b = eio(tt, 1, 4);
  return <>
    <div style={{ position: "absolute", left: 960 - 200 * pop(tt, 0.9, 10, 0.3), top: 540 - 200 * pop(tt, 0.9, 10, 0.3), width: 400 * pop(tt, 0.9, 10, 0.3), height: 400 * pop(tt, 0.9, 10, 0.3), borderRadius: "50%", border: `6px solid ${AMB}`, opacity: 1 - eio(tt, 1, 2) }} />
    {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return <div key={i} style={{ position: "relative" }}><Hog x={960 + Math.cos(a) * 820 * b} y={540 + Math.sin(a) * 440 * b} s={0.6} tt={tt + i} flip={Math.cos(a) < 0} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><line x1={960} y1={540} x2={960 + Math.cos(a) * 820 * b} y2={540 + Math.sin(a) * 440 * b} stroke="rgba(255,255,255,.15)" strokeWidth={3} strokeDasharray="8 10" /></svg></div>; })}
    <Lbl x={960} y={120} tt={tt} at={2.4} txt="survivors scatter, learn, go nocturnal" size={58} />
  </>;
}} />;

// m22-23 · el comedero con tapa: sólo el hocico de un chancho la levanta; el mapache se queda afuera… y el tribunal
export const HBaitFeeder: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lid = eio(tt, bt(h, 0, 2), bt(h, 0, 2) + 0.8), court = pop(tt, bt(h, 1, 4.4), 7, 0.45);
  return <>
    <div style={{ position: "absolute", left: 660, top: 420, width: 600, height: 380, background: "linear-gradient(#5a6a5a,#3a4a3a)", boxShadow: shadow, borderRadius: 14 }}>
      <div style={{ position: "absolute", left: 40, top: 140, fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#f3ead6" }}>WARFARIN BAIT</div><div style={{ position: "absolute", left: 40, top: 210, fontFamily: HAND, fontSize: 40, color: "#f3ead6" }}>hog-only lid</div></div>
    <div style={{ position: "absolute", left: 660, top: 380, width: 600, height: 50, background: "#2a3a2a", transformOrigin: "0 100%", transform: `rotate(${-lid * 35}deg)` }} />
    <Hog x={1440} y={700} s={1.2} tt={tt} flip />
    <svg width={160} height={120} viewBox="0 0 160 120" style={{ position: "absolute", left: 380, top: 680 }}><ellipse cx={80} cy={70} rx={60} ry={34} fill="#7a7a7a" /><circle cx={130} cy={50} r={24} fill="#7a7a7a" /><rect x={116} y={42} width={30} height={12} fill="#222" /><path d="M20 70 Q-10 40 10 20" stroke="#555" strokeWidth={12} fill="none" /></svg>
    <div style={{ position: "absolute", left: 300, top: 640, fontSize: 60, color: AMB, opacity: cl(pop(tt, bt(h, 0, 2) as number)) }}>?</div>
    <div style={{ position: "absolute", left: 1320, top: 160, transform: `scale(${court}) rotate(6deg)`, padding: "20px 30px", background: PAPER, boxShadow: shadow, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK }}>LAWSUIT · TEXAS 2017<div style={{ fontFamily: HAND, fontWeight: 400, fontSize: 36 }}>maker backed off</div></div>
  </>;
}} />;

// m23 · tres fichas que se tachan en fila: bounty ✗, hunting ✗, poison ✗
export const HThreeStrikes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  {["BOUNTIES", "HUNTING", "POISON"].map((l, i) => { const s = pop(tt, 0.3 + i * 0.5, 7, 0.5), x = eio(tt, 1.6 + i * 0.6, 2 + i * 0.6); return <div key={l} style={{ position: "absolute", left: 300 + i * 460, top: 360, width: 400, height: 320, background: PAPER, boxShadow: shadow, transform: `scale(${s}) rotate(${(i - 1) * 4}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: INK }}>{l}</div>
    <svg width={400} height={320} style={{ position: "absolute", inset: 0 }}><path d="M40 40 L360 280" stroke={RED} strokeWidth={22} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - x)} /><path d="M360 40 L40 280" stroke={RED} strokeWidth={22} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - x)} /></svg></div>; })}
  <Lbl x={960} y={860} tt={tt} at={3.8} txt="all sound like a fix · none of them fixed it" size={58} col={AMB} />
</>} />;

// m24 · la piara como familia: el grupo se dibuja dentro de un círculo con cada miembro contado
export const HSounderFamily: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const M = [[760, 460, 1, 0], [1060, 440, 1, 0], [900, 600, 1, 0], ...Array.from({ length: 9 }, (_, i) => [700 + (i % 5) * 120, 720 + Math.floor(i / 5) * 90, 0, 1])];
  return <>
    <div style={{ position: "absolute", left: 960 - 520, top: 540 - 380, width: 1040, height: 760, borderRadius: "50%", border: `6px dashed ${AMB}`, transform: `scale(${pop(tt, 0.2, 6, 0.5)}) rotate(${tt * 4}deg)` }} />
    {M.map(([x, y, sow], i) => <div key={i} style={{ position: "relative", opacity: cl(pop(tt, 0.6 + i * 0.2) * 2) }}>{sow ? <Hog x={x} y={y} s={0.9} tt={tt + i} /> : <Piglet x={x} y={y} s={0.42} tt={tt + i} />}
      <div style={{ position: "absolute", left: x - 16, top: y - 80 * (sow ? 1.2 : 0.7), width: 32, height: 32, borderRadius: "50%", background: GRN, color: "#111", fontFamily: FONT, fontWeight: 900, fontSize: 20, textAlign: "center", lineHeight: "32px", transform: `scale(${pop(tt, 3 + i * 0.12)})` }}>{i + 1}</div></div>)}
    <Lbl x={960} y={90} tt={tt} at={0.4} txt="SOUNDER: a few sows and all their young" size={56} />
  </>;
}} />;

// m24-25 · el chancho que aprendió: se acerca a la trampa, ve la reja, retrocede y se lleva el miedo (cara con «!»)
export const HTrapShy: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const app = eio(tt, 0.3, 1.8), back = eio(tt, 2.4, 4);
  const x = 400 + app * 500 - back * 700;
  return <>
    <div style={{ position: "absolute", left: 1200, top: 400, width: 500, height: 360, border: "8px solid #9aa1aa", backgroundImage: "linear-gradient(90deg,#9aa1aa 4px,transparent 4px)", backgroundSize: "50px 100%" }}><div style={{ position: "absolute", left: 200, top: 260, width: 100, height: 70, background: "#e8c860", borderRadius: "50%" }} /></div>
    <Hog x={x} y={680} s={1.2} tt={tt} flip={back > 0.1} />
    <div style={{ position: "absolute", left: x - 30, top: 520, fontFamily: MARK, fontSize: 120, color: AMB, transform: `scale(${pop(tt, 2, 9, 0.3)})` }}>!</div>
    {["TRAP-SHY", "GUN-SHY"].map((l, i) => <Lbl key={l} x={500 + i * 500} y={200} tt={tt} at={2.8 + i * 0.6} txt={l} size={70} hand={false} col={RED} />)}
    <Lbl x={960} y={940} tt={tt} at={4.4} txt="half a job makes the survivors smarter" size={56} />
  </>;
}} />;

// m25 · el corral con portón: cebo, cámara, y el portón cae cuando TODOS están adentro
export const HCorralGate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const bait = pop(tt, bt(h, 0, 1.6)), cam = pop(tt, bt(h, 1, 3.2)), gate = eIn(tt, bt(h, 2, 5.2), bt(h, 2, 5.2) + 0.4);
  const inside = eio(tt, bt(h, 0, 1.6) + 0.6, bt(h, 2, 5.2) - 0.3);
  return <At x={960} y={560} rx={48}>
    <div style={{ width: 1400, height: 900, position: "relative", background: "#7a6a3a" }}>
      <div style={{ position: "absolute", left: 300, top: 150, width: 800, height: 600, borderRadius: "50%", border: "14px solid #9aa1aa" }} />
      <div style={{ position: "absolute", left: 680, top: 440, width: 120, height: 80, borderRadius: "50%", background: "#e8c860", transform: `scale(${bait})` }} />
      <div style={{ position: "absolute", left: 640, top: 730 + (1 - gate) * -0, width: 140, height: 30, background: gate > 0.5 ? "#c9cdd2" : "transparent", border: "4px solid #c9cdd2", transform: `translateY(${(1 - gate) * -120}px)` }} />
      {Array.from({ length: 9 }, (_, i) => { const a = i / 9 * Math.PI * 2; const r = 180 + (1 - inside) * 500; return <Hog key={i} x={700 + Math.cos(a) * r * 1.2} y={460 + Math.sin(a) * r * 0.7} s={i < 3 ? 0.7 : 0.4} tt={tt + i} />; })}
      <svg width={120} height={100} style={{ position: "absolute", left: 1180, top: 60, transform: `scale(${cam})` }}><rect x={10} y={20} width={90} height={70} rx={10} fill="#3a4a3a" /><circle cx={55} cy={55} r={20} fill="#111" /><circle cx={90} cy={30} r={6} fill={RED} opacity={0.5 + 0.5 * Math.sin(tt * 6)} /></svg>
    </div>
    <Lbl x={700} y={-110} tt={tt} at={0.4} txt="corral trap · soaked corn · days or weeks" size={54} />
  </At>;
}} />;

// m26 · la pantalla del teléfono con la foto de la cámara trampa: se cuentan los chanchos hasta «TODOS»
export const HTrailCam: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const n = Math.min(9, Math.floor(eio(tt, 0.6, 4.6) * 10));
  return <>
    <div style={{ position: "absolute", left: 660, top: 80, width: 600, height: 940, borderRadius: 60, background: "#111", boxShadow: shadow, padding: 30 }}>
      <div style={{ width: 540, height: 760, borderRadius: 30, background: "#2a3428", position: "relative", overflow: "hidden", filter: "grayscale(.6) contrast(1.2)" }}>
        <div style={{ position: "absolute", left: 10, top: 10, fontFamily: "monospace", fontSize: 26, color: "#ddd" }}>CAM 2 · 03:14 · 61°F</div>
        {Array.from({ length: n }, (_, i) => <Hog key={i} x={110 + (i % 3) * 160} y={240 + Math.floor(i / 3) * 170} s={i < 3 ? 0.65 : 0.4} tt={tt + i} />)}</div>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 50, color: n >= 9 ? GRN : TX, marginTop: 30 }}>{n >= 9 ? "ALL 9 IN · DROP IT" : `${n} / 9 in`}</div></div>
    <Lbl x={1550} y={500} tt={tt} at={4.6} txt="none of them get away" size={50} col={AMB} />
  </>;
}} />;

// m27 · el mapa del programa nacional: estados del norte y oeste que se apagan a cero
export const HProgramMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const ZERO = [2, 7, 11, 15, 19];
  return <>
    <div style={{ position: "absolute", left: 200, top: 340, display: "grid", gridTemplateColumns: "repeat(8,170px)", gap: 14 }}>
      {Array.from({ length: 24 }, (_, i) => { const z = ZERO.includes(i); const off = z ? eio(tt, 2 + ZERO.indexOf(i) * 0.6, 2.6 + ZERO.indexOf(i) * 0.6) : 0; return <div key={i} style={{ height: 150, borderRadius: 12, background: z ? `rgb(${200 - 140 * off},${70 + 150 * off},${60 + 60 * off})` : (i > 15 ? "#8a2a1a" : "#5a3a2a"), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff" }}>{z && off > 0.9 ? "0" : ""}</div>; })}
    </div>
    <div style={{ position: "absolute", left: 960, top: 180, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: TX }}>2014 · NATIONAL FERAL SWINE PROGRAM</div>
    <Lbl x={960} y={900} tt={tt} at={1} txt="~$20M a year to start · catch early, catch whole sounders" size={46} col={AMB} />
  </>;
}} />;

// m28 · las líneas de propiedad: la piara duerme en una, toma agua en otra y come en la tercera; la trampa de uno sólo vacía su parcela
export const HPropertyLines: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = (tt * 0.25) % 1, x = 300 + p * 1300, refill = eio(tt, 4, 6);
  return <>
    {["SLEEPS", "DRINKS", "FEEDS"].map((l, i) => <div key={l} style={{ position: "absolute", left: 160 + i * 540, top: 260, width: 520, height: 560, background: ["#3a4a2a", "#3a5a6a", "#6a7a3a"][i], border: "6px dashed rgba(255,255,255,.4)" }}><div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: "#fff", marginTop: 20 }}>{l}</div>
      <div style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 40, color: "#fff" }}>{["creek bottom", "the next place", "a third man's corn"][i]}</div></div>)}
    {[0, 1, 2, 3].map((k) => <Hog key={k} x={x + k * 50} y={540 + k * 30} s={0.5} tt={tt + k} />)}
    <div style={{ position: "absolute", left: 1240, top: 680, padding: "10px 20px", background: GRN, color: "#111", fontFamily: FONT, fontWeight: 900, fontSize: 30, transform: `scale(${pop(tt, 2.6)})` }}>TRAPPED HARD</div>
    <Lbl x={1500} y={920} tt={tt} at={4.2} txt="fills right back up in a season or two" size={50} col={AMB} />
    {refill > 0 && [0, 1].map((k) => <Hog key={"r" + k} x={1500 + k * 120} y={480} s={0.5 * refill} tt={tt} />)}
  </>;
}} />;

// m28-29 · el arroyo de los vecinos: todas las granjas a lo largo del mismo arroyo se encienden juntas
export const HCreekNeighbors: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const on = eio(tt, 1.6, 3);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M0 200 C400 300 300 600 800 560 S1500 700 1920 900" stroke="#3a7a8a" strokeWidth={40} fill="none" /></svg>
    {Array.from({ length: 10 }, (_, i) => { const u = i / 9, x = 120 + u * 1680, y = 200 + Math.sin(u * 3) * 120 + u * 600 + (i % 2 ? -160 : 160); return <div key={i} style={{ position: "absolute", left: x - 60, top: y - 50, width: 120, height: 100, background: on > 0.5 ? "#e8c860" : "#5a5a5a", borderRadius: 10, boxShadow: on > 0.5 ? "0 0 40px #e8c860" : "none", transform: `scale(${pop(tt, 0.3 + i * 0.1)})` }}>
      <svg width={120} height={100}><path d="M10 50 L60 10 L110 50 Z" fill="#8a3a2a" /><rect x={25} y={50} width={70} height={46} fill={on > 0.5 ? "#f3ead6" : "#888"} /></svg></div>; })}
    <Lbl x={960} y={110} tt={tt} at={2.2} txt="organized by watershed · same time, shared traps & cameras" size={46} />
    <Lbl x={960} y={980} tt={tt} at={4} txt="nobody gets a trophy · the numbers stay down" size={52} col={AMB} />
  </>;
}} />;

// m29-30 · el alambre eléctrico a la altura del hocico: chispa, el chancho retrocede, el maíz queda
export const HHotWire: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const app = eio(tt, 0.5, 2), zap = tt > 2 && tt < 2.4, back = eio(tt, 2.3, 3.6);
  return <>
    <div style={{ position: "absolute", left: 1100, top: 300, right: 0, bottom: 200, background: `repeating-linear-gradient(90deg,${CORN} 0 20px,transparent 20px 60px)` }} />
    {[600, 680].map((y) => <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 4, background: "#e8d080" }} />)}
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1040 + 0, top: 540, width: 10, height: 200, background: "#e8e8e8" }} />)}
    <Hog x={600 + app * 380 - back * 500} y={640} s={1.3} tt={tt} flip={back > 0.1} />
    {zap && <svg width={200} height={200} style={{ position: "absolute", left: 1000, top: 520 }}><path d="M100 0 L80 80 L120 80 L90 200" stroke="#fff6a0" strokeWidth={10} fill="none" /></svg>}
    <Lbl x={960} y={160} tt={tt} at={1} txt="a few strands of electric wire, set low" size={56} />
    <Lbl x={960} y={900} tt={tt} at={3.8} txt="it saves the crop while the trapping works" size={56} col={AMB} />
  </>;
}} />;

// m30 · el cambio de héroe: el rifle y el helicóptero se van y entran trampa, cámara, bolsa de maíz y vecinos
export const HHeroSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sw = eio(tt, 1.8, 3.2);
  const A = [["RIFLE", "#5a5a5e"], ["HELICOPTER", "#3a4a5a"]], B = [["CORRAL TRAP", "#9aa1aa"], ["CAMERA", "#3a4a3a"], ["BAG OF CORN", "#e8c860"], ["NEIGHBORS", "#8a5a3a"]];
  return <>
    <div style={{ position: "absolute", left: 960, top: 120, transform: "translateX(-50%)", fontFamily: MARK, fontSize: 80, color: TX }}>THE HERO</div>
    {A.map(([l, c], i) => <div key={l} style={{ position: "absolute", left: 560 + i * 440, top: 360 - sw * 700, width: 380, height: 220, background: c, boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: "#fff", transform: `rotate(${sw * (i ? 30 : -30)}deg)` }}>{l}</div>)}
    {B.map(([l, c], i) => { const s = pop(tt, 2.4 + i * 0.4, 7, 0.45); return <div key={l} style={{ position: "absolute", left: 180 + i * 400, top: 400 + (1 - s) * 700, width: 360, height: 220, background: c, boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: i === 2 ? INK : "#fff" }}>{l}</div>; })}
    <Lbl x={960} y={820} tt={tt} at={4.6} txt="and a lot of patience" size={62} col={AMB} />
  </>;
}} />;

// m31 · el cartel de la ruta: «PROHIBIDO TRANSPORTAR CHANCHOS VIVOS · MULTA»
export const HNoTransport: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.4, 6, 0.45);
  return <>
    <div style={{ position: "absolute", left: 950, top: 560, width: 20, height: 520, background: "#888" }} />
    <div style={{ position: "absolute", left: 960 - 420, top: 140, width: 840, height: 520, background: "#fbf7ec", border: "16px solid #111", borderRadius: 20, boxShadow: shadow, transform: `scale(${s})`, textAlign: "center", padding: 30 }}>
      <svg width={300} height={220} viewBox="0 0 300 220"><g transform="translate(20 20)"><rect x={0} y={60} width={180} height={90} fill="#5a5a5e" /><rect x={190} y={70} width={70} height={80} fill="#8a2a1a" /><circle cx={40} cy={160} r={18} fill="#111" /><circle cx={140} cy={160} r={18} fill="#111" /></g>
        <circle cx={150} cy={110} r={100} fill="none" stroke={RED} strokeWidth={18} /><line x1={80} y1={40} x2={220} y2={180} stroke={RED} strokeWidth={18} /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK }}>NO TRANSPORTING LIVE WILD HOGS</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: RED, marginTop: 10, opacity: cl(pop(tt, 2) * 2) }}>REAL FINES</div></div>
    <Lbl x={960} y={960} tt={tt} at={3.4} txt="they finally understood where the new ones came from" size={50} />
  </>;
}} />;

// m32-33 · la huella del tiempo: un sendero de pisadas de chancho; cada pisada es un año
export const HHogTrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [["1539", "de Soto · a dozen pigs"], ["1600s–1800s", "let loose in the woods"], ["1912", "Hooper Bald boar"], ["1980s–90s", "hunting boom · trailers"], ["2006", "spinach outbreak"], ["2011", "pork chopper law"], ["2014", "national program"], ["2017", "warfarin fight"], ["today", "35+ states"]];
  const at = [0.3, ...Array.from({ length: 8 }, (_, i) => bt(h, i, 1.4 + i * 1.6))];
  return <>
    <div style={{ position: "absolute", inset: 0, background: DIRT }} />
    {Y.map(([y, d], i) => { const o = pop(tt, at[i], 8, 0.45), x = 140 + i * 205, yy = 540 + (i % 2 ? 90 : -90); return <React.Fragment key={i}>
      <svg width={90} height={90} viewBox="0 0 90 90" style={{ position: "absolute", left: x - 45, top: yy - 45, transform: `scale(${o})` }}><path d="M30 10 Q14 50 36 80 M60 10 Q76 50 54 80" stroke="#2a1a0a" strokeWidth={14} fill="none" strokeLinecap="round" /></svg>
      <div style={{ position: "absolute", left: x, top: i % 2 ? yy + 60 : yy - 170, transform: "translateX(-50%)", width: 200, textAlign: "center", opacity: cl(o * 2) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: i === 8 ? RED : TX }}>{y}</div><div style={{ fontFamily: HAND, fontSize: 30, color: AMB, lineHeight: 1.05 }}>{d}</div></div></React.Fragment>; })}
  </>;
}} />;

// m33 · las cartas con colmillo: cada pregunta en una tarjeta de cartón con su respuesta y una señal de alerta
export const HTuskCards: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q = [["Can you eat them?", "Yes — cook it through, wear gloves.", GRN], ["Dangerous to people?", "Usually they run. Cornered ones charge.", AMB], ["Just let hunters handle it?", "They help. Alone, they can't take ⅔.", AMB], ["Legal to move them?", "In many states, no. Fines.", RED]];
  const ats = [0.3, bt(h, 0, 5.6) as number], D = h.out - h.at;   // sólo las preguntas que se dicen DENTRO de esta ventana
  return <>{Q.slice(0, 2).map(([q, a, c], i) => { const at = ats[i], nx = i === 0 ? ats[1] : D + 1, s = pop(tt, at, 7, 0.5), done = eio(tt, nx - 0.5, nx); return <div key={i} style={{ position: "absolute", left: 360, top: 200 + i * 8, width: 1200, height: 600, background: MANILA, boxShadow: shadow, padding: "60px 80px", transform: `translateY(${(1 - s) * 900 + done * -40}px) translateX(${done * -1400}px) rotate(${(i % 2 ? 2 : -2)}deg)`, zIndex: i }}>
    <div style={{ fontFamily: HAND, fontSize: 80, color: INK }}>{q}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: INK, marginTop: 40, opacity: cl(pop(tt, at + 1.1) * 2) }}>{a}</div>
    <div style={{ position: "absolute", right: 60, top: 50, width: 70, height: 70, borderRadius: "50%", background: c as string, transform: `scale(${pop(tt, at + 1.4)})` }} /></div>; })}</>;
}} />;

// m34 · el repaso en el remolque: cada caja que se sube al remolque es un paso de la historia
export const HTrailerRecap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const B = ["de Soto 1539", "loose for 300 yrs", "boar 1912", "trailers 80s–90s", "35+ states", "⅔ a year", "bounties ✗", "whole sounders ✓"];
  return <>
    <div style={{ position: "absolute", left: 120, top: 640, width: 1500, height: 30, background: "#5a5a5e" }} /><div style={{ position: "absolute", left: 1620, top: 520, width: 200, height: 150, background: "#8a2a1a", borderRadius: "10px 40px 6px 6px" }} />
    {[220, 700, 1200, 1700].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 650, width: 70, height: 70, borderRadius: "50%", background: "#111", border: "8px solid #666" }} />)}
    {B.slice(0, 4).map((l, i) => { const st = Math.max(0.6, (h.out - h.at - 1.2) / 4), at = 0.3 + i * st, f = eIn(tt, at, at + 0.5); return <div key={i} style={{ position: "absolute", left: 160 + (i % 4) * 360, top: -200 + f * (440 - Math.floor(i / 4) * 200 + 200) - (Math.floor(i / 4) ? 0 : 0), width: 340, height: 190, background: "repeating-linear-gradient(0deg,#c9a46a 0 30px,#a8844a 30px 34px)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 46, color: "#3a2a1a", opacity: f > 0 ? 1 : 0 }}>{l}</div>; })}
  </>;
}} />;

// m35 · el volante: «no se esparcieron, los llevamos» — el volante gira y deja ver la piara en el espejo
export const HSteeringWheel: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const r = Math.sin(tt * 0.8) * 25;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0a0c10,#1a1e26)" }} />
    <div style={{ position: "absolute", left: 1180, top: 100, width: 520, height: 180, borderRadius: 30, background: "#2a3038", border: "10px solid #111", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#1a2418,#2a3424)" }} />{[0, 1, 2, 3].map((k) => <Hog key={k} x={120 + k * 100} y={110} s={0.4} tt={tt + k} />)}</div>
    <svg width={760} height={760} viewBox="-380 -380 760 760" style={{ position: "absolute", left: 580, top: 380, transform: `rotate(${r}deg)` }}><circle r={330} fill="none" stroke="#2a2a2e" strokeWidth={60} /><circle r={90} fill="#2a2a2e" />{[90, 210, 330].map((a) => <rect key={a} x={-26} y={80} width={52} height={230} fill="#2a2a2e" transform={`rotate(${a})`} />)}</svg>
    <Lbl x={960} y={200} tt={tt} at={0.5} txt="catch the whole family · stop moving them" size={56} />
    <Lbl x={960} y={300} tt={tt} at={bt(h, 0, 3.8) as number} txt="wild hogs didn't spread across America" size={58} col={AMB} />
  </>;
}} />;

export const HCE: Record<string, React.FC<{ t: number; h: H }>> = {
  rootedRows: HRootedRows, hoofTrail: HHoofTrail, trailerNight: HTrailerNight, shipLanding: HShipLanding, marchTrail: HMarchTrail, earNotch: HEarNotch,
  acornForest: HAcornForest, boarCompare: HBoarCompare, brokenFence: HBrokenFence, hybridMix: HHybridMix, huntPoster: HHuntPoster, stateJump: HStateJump,
  interstate: HInterstate, sowCalendar: HSowCalendar, twoThirdsGauge: HTwoThirdsGauge, emptyThrone: HEmptyThrone, snoutDig: HSnoutDig, cropPlate: HCropPlate,
  billionMeter: HBillionMeter, germTag: HGermTag, spinachBag: HSpinachBag, fenceGap: HFenceGap, nestRaid: HNestRaid, oakStop: HOakStop, bountyBoard: HBountyBoard,
  heliView: HHeliView, scatterBurst: HScatterBurst, baitFeeder: HBaitFeeder, threeStrikes: HThreeStrikes, sounderFamily: HSounderFamily, trapShy: HTrapShy,
  corralGate: HCorralGate, trailCam: HTrailCam, programMap: HProgramMap, propertyLines: HPropertyLines, creekNeighbors: HCreekNeighbors, hotWire: HHotWire,
  heroSwap: HHeroSwap, noTransport: HNoTransport, hogTrack: HHogTrack, tuskCards: HTuskCards, trailerRecap: HTrailerRecap, steeringWheel: HSteeringWheel,
};
