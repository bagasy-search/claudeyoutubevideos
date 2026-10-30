// ruth29e · 2ª vuelta (29-oct): 1ª mitad del video rehecha como OBJETOS 3D sobre la mesa (sombra de contacto, volumen, textura),
// una idea por pieza, texto grande y DENTRO de la escena. Helpers y 2ª mitad en ruth_e3.
import React from "react";
import { H, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, WOOD, WOODTOP, WOODSIDE } from "./obj";
import { HCE3, S, D, fall, rnd, Puff, Tag, Hog3, DIRT, CORN } from "./ruth_e3";

const Stalk: React.FC<{ x: number; y: number; s?: number; r?: number; ear?: boolean }> = ({ x, y, s = 1, r = 0, ear = true }) => <svg width={120} height={360} viewBox="0 0 120 360" style={{ position: "absolute", left: x - 60 * s, top: y - 360 * s, width: 120 * s, height: 360 * s, transform: `rotate(${r}deg)`, transformOrigin: "50% 100%", overflow: "visible" }}>
  <path d="M60 360 L60 20" stroke="#4a7a2a" strokeWidth={10} />{[80, 150, 220, 290].map((y, k) => <path key={k} d={`M60 ${y} Q${k % 2 ? 120 : 0} ${y - 40} ${k % 2 ? 116 : 4} ${y - 90}`} stroke={CORN} strokeWidth={12} fill="none" strokeLinecap="round" />)}
  {ear && <ellipse cx={74} cy={170} rx={14} ry={40} fill="#e8c040" transform="rotate(14 74 170)" />}</svg>;

// m0 · el maizal a la mañana: las hileras perfectas sobre la maqueta; pasa una ola de tierra y las plantas caen como si hubiera pasado un rotovator
export const HRootedRows: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#e8c890 0%,#f3e0b8 36%,#8a9a6a 38%,#5a6a3a 100%)" f={(tt) => {
  const wv = -200 + 2400 * eio(tt, 2, D(h) - 1);
  return <>
    {[0, 1, 2, 3, 4].map((row) => { const y = 520 + row * 120, sc = 0.5 + row * 0.18; return <React.Fragment key={row}>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 10, height: 30 * sc, background: "linear-gradient(#6a4a2a,#3a2614)", borderRadius: 14 }} />
      {Array.from({ length: 14 }, (_, k) => { const x = 60 + k * 136 + (row % 2) * 60, down = cl((wv - x) / 160); return <Stalk key={k} x={x} y={y} s={sc} r={90 * down * (k % 2 ? 1 : -1) * 0.9} ear={down < 0.5} />; })}
      {wv > 0 && wv < 2200 && Array.from({ length: 4 }, (_, k) => <Puff key={k} x={wv - k * 60} y={y - 20 - k * 10} r={40 * sc + k * 6} col="rgba(120,80,40,.7)" o={0.8} />)}</React.Fragment>; })}
    <Tag x={1500} y={100} txt="one night" s={pop(tt, 0.8, 7, 0.5)} size={70} tt={tt} />
  </>;
}} />;

// m1 · el rastro: vista desde arriba de los surcos; las pisadas aparecen en fila desde el arroyo y la tropa avanza por ellas
export const HHoofTrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(0deg,#6a4a2a 0 40px,#4a3018 40px 90px)" f={(tt) => {
  const u = eio(tt, 0.4, D(h) - 0.6);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 300, bottom: 0, background: "linear-gradient(90deg,#2a5a7a,#4a8aaa 70%,#6a4a2a)" }}>{Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 30, top: ((k * 180 + tt * 60) % 1080), width: 180, height: 5, background: "rgba(255,255,255,.3)" }} />)}</div>
    {Array.from({ length: 30 }, (_, k) => { const x = 320 + k * 52, y = 540 + Math.sin(k * 0.5) * 120 + (k % 2 ? 26 : -26); return x < 320 + 1560 * u && <svg key={k} width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", left: x, top: y, transform: "rotate(90deg)" }}><path d="M8 4 Q2 22 10 40 Q20 42 20 28 Q20 12 8 4 Z M36 4 Q42 22 34 40 Q24 42 24 28 Q24 12 36 4 Z" fill="#1e1208" /></svg>; })}
    {[0, 1, 2, 3].map((k) => { const p = cl(u * 1.2 - k * 0.06), x = 320 + 1500 * p - k * 70; return <div key={k} style={{ position: "absolute", left: x, top: 500 + Math.sin(x / 104) * 120 + k * 10, width: 120, height: 60, transform: `translate(-50%,-50%) rotate(${Math.cos(x / 104) * 30}deg)`, borderRadius: "50% 40% 40% 50%", background: "radial-gradient(circle at 40% 30%,#6a5a4a,#2a1e18)", boxShadow: "10px 14px 8px rgba(0,0,0,.45)", opacity: cl(p * 10) }}><div style={{ position: "absolute", right: -12, top: 18, width: 22, height: 22, borderRadius: "50%", background: "#5a4a3a" }} /></div>; })}
  </>;
}} />;

// m2 · el remolque de noche: luces traseras rojas en la banquina; baja la rampa y salen chanchos donde antes no había ninguno
export const HTrailerNight: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#060a14 0%,#141c2a 55%,#1a1a14 57%,#0a0a08 100%)" f={(tt) => {
  const ramp = eio(tt, 1.4, 2.4), out = Math.max(0, tt - 2.4);
  return <>
    {Array.from({ length: 50 }, (_, k) => <div key={k} style={{ position: "absolute", left: rnd(k) * 1920, top: rnd(k + 5) * 500, width: 3, height: 3, borderRadius: "50%", background: "#fff", opacity: 0.3 + 0.5 * rnd(k + 2) }} />)}
    <div style={{ position: "absolute", left: 960, top: 300, width: 160, height: 160, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(#f3f0e6,#c8c4b8)", boxShadow: "0 0 80px rgba(240,240,220,.4)" }} />
    <svg width={900} height={500} viewBox="0 0 900 500" style={{ position: "absolute", left: 300, top: 360, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.6))" }}>
      <rect x={100} y={40} width={700} height={360} fill="#3a3e42" />{Array.from({ length: 10 }, (_, k) => <rect key={k} x={130 + k * 66} y={70} width={30} height={14} rx={7} fill="#1a1c1e" />)}
      <rect x={60} y={300} width={50} height={40} fill="#ff2a1a" style={{ filter: "drop-shadow(0 0 20px #ff2a1a)" }} /><rect x={790} y={300} width={50} height={40} fill="#ff2a1a" style={{ filter: "drop-shadow(0 0 20px #ff2a1a)" }} />
      <circle cx={260} cy={420} r={60} fill="#0a0a0a" /><circle cx={420} cy={420} r={60} fill="#0a0a0a" /></svg>
    <div style={{ position: "absolute", left: 400, top: 760, width: 700, height: 30, transformOrigin: "0 0", transform: `rotate(${90 - 72 * ramp}deg)`, background: "linear-gradient(#6a7076,#3a3e42)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 600, background: "radial-gradient(ellipse at 20% 0%,rgba(255,40,20,.18),transparent 50%)" }} />
    {[0, 1, 2, 3, 4].map((k) => { const p = cl((out - k * 0.6) / 2.2); return p > 0 && <Hog3 key={k} x={600 + 1100 * p} y={860 + (k % 2) * 60} s={0.7} tt={tt + k} dark o={cl(p * 6)} />; })}
  </>;
}} />;

// m3 · 1539: la carabela de madera ancla junto a la playa; por la plancha baja una docena de chanchos; en la popa tallado «1539»
export const HShipLanding: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c8d8 0%,#e0e8e0 50%,#3a7a9a 52%,#1a4a6a 100%)" f={(tt) => {
  const bob = 8 * Math.sin(tt * 1.6), N = 12, n = Math.floor(eio(tt, 1.6, D(h) - 1.2) * N);
  return <>
    <div style={{ position: "absolute", left: 900, right: 0, top: 640, bottom: 0, background: "linear-gradient(#e8d8a8,#c8b078)", clipPath: "polygon(10% 0,100% 0,100% 100%,0 100%)" }} />
    <svg width={900} height={720} viewBox="0 0 900 720" style={{ position: "absolute", left: 40, top: 60 + bob, filter: "drop-shadow(20px 30px 24px rgba(0,0,0,.5))" }}><defs><linearGradient id="shh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a87a4a" /><stop offset="1" stopColor="#4a2a12" /></linearGradient></defs>
      <path d="M40 500 Q450 560 860 480 L800 640 Q450 700 120 640 Z" fill="url(#shh)" />{Array.from({ length: 5 }, (_, k) => <path key={k} d={`M${70 + k * 10} ${520 + k * 26} Q450 ${580 + k * 22} ${850 - k * 12} ${500 + k * 26}`} stroke="rgba(0,0,0,.25)" strokeWidth={4} fill="none" />)}
      <rect x={380} y={60} width={16} height={460} fill="#4a2a12" /><rect x={620} y={140} width={14} height={360} fill="#4a2a12" />
      <path d="M220 90 Q390 70 560 90 L540 320 Q390 340 240 320 Z" fill="#efe6d2" /><path d="M520 170 Q630 160 740 170 L730 330 Q630 344 530 330 Z" fill="#efe6d2" /><path d="M380 160 h-90 v-60 h90 M380 230 h-130" stroke="#b3221a" strokeWidth={16} fill="none" />
      <rect x={60} y={430} width={170} height={70} fill="#6a4226" /><text x={145} y={482} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={50} fill="#e8c890">1539</text></svg>
    <div style={{ position: "absolute", left: 780, top: 600 + bob, width: 420, height: 20, transformOrigin: "0 50%", transform: "rotate(16deg)", background: "linear-gradient(#a87a4a,#5a3a1e)" }} />
    {Array.from({ length: n }, (_, i) => { const x = 1240 + (i % 4) * 150 + 30 * Math.sin(tt + i), y = 760 + Math.floor(i / 4) * 80; return <Hog3 key={i} x={x} y={y} s={0.4} tt={tt * 2 + i} />; })}
    <div style={{ position: "absolute", left: 1500, top: 120, fontFamily: MARK, fontSize: 130, color: "#1a2a3a", opacity: cl((tt - 2) * 2) }}>{n}</div>
  </>;
}} />;

// m3-4 · la marcha: un sendero de pisadas cruza la bandeja de arena; al costado el ábaco de madera corre cuentas: la piara crece de 12 a cientos
export const HMarchTrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 0.4, D(h) - 1), STATES = ["FLORIDA", "GEORGIA", "ALABAMA", "MISSISSIPPI", "ARKANSAS"], count = Math.round(12 + 688 * Math.pow(u, 2));
  return <>
    <CShadow x={760} y={960} w={1300} />
    <div style={{ position: "absolute", left: 120, top: 220, width: 1260, height: 720, borderRadius: 20, background: "linear-gradient(160deg,#e8d0a0,#c8a870)", boxShadow: "inset 0 0 0 30px #6a4626, 0 30px 40px rgba(0,0,0,.5)" }}><Grain id="mts" o={0.35} f={0.9} />
      <svg width={1260} height={720} viewBox="0 0 1260 720" style={{ position: "absolute", inset: 0 }}><path d="M80 600 Q300 400 520 520 T900 300 T1180 140" stroke="rgba(80,50,20,.6)" strokeWidth={14} strokeDasharray={`${1500 * u} 3000`} fill="none" /></svg>
      {STATES.map((s, i) => { const k = i / 4; return <div key={i} style={{ position: "absolute", left: 80 + 1100 * k, top: 600 - 460 * k + (i % 2 ? 40 : -60), fontFamily: HAND, fontSize: 46, color: "#4a2a12", opacity: cl((u - k * 0.9) * 6) }}>{s}</div>; })}</div>
    <Box x={1640} y={960} w={360} h={600} d={60} rx={-6} ry={-18} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {[0, 1, 2].map((r) => { const v = r === 0 ? count % 10 : r === 1 ? Math.floor(count / 10) % 10 : Math.floor(count / 100); return <React.Fragment key={r}>
      <div style={{ position: "absolute", left: 1490, top: 490 + r * 150, width: 300, height: 8, background: "linear-gradient(#e0e4e8,#7a8086)" }} />
      {Array.from({ length: 9 }, (_, b) => <div key={b} style={{ position: "absolute", left: (b < v ? 1500 + b * 28 : 1780 - (8 - b) * 28) - 14, top: 474 + r * 150, width: 30, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e86a4a,#8a1a0a)", boxShadow: "3px 6px 4px rgba(0,0,0,.45)" }} />)}</React.Fragment>; })}
    <div style={{ position: "absolute", left: 1640, top: 300, transform: "translate(-50%,0)", fontFamily: MARK, fontSize: 110, color: "#f3e6c6", textShadow: "0 8px 16px #000" }}>{count}</div>
  </>;
}} />;

// m4-5 · la oreja marcada: la oreja del chancho en primer plano; la pinza muesca corta y quedan las marcas de la familia
export const HEarNotch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = [[0.3, 1.2], [0.62, 2.4], [0.85, 3.6]];
  return <>
    <CShadow x={900} y={940} w={900} />
    <svg width={900} height={800} viewBox="0 0 900 800" style={{ position: "absolute", left: 450, top: 140, filter: "drop-shadow(24px 34px 24px rgba(0,0,0,.5))" }}>
      <defs><radialGradient id="enr" cx="40%" cy="40%" r="70%"><stop offset="0" stopColor="#c8907a" /><stop offset=".6" stopColor="#8a5a4a" /><stop offset="1" stopColor="#4a2a22" /></radialGradient>
        <mask id="enm"><rect width={900} height={800} fill="#fff" />{N.map(([p, a], i) => { const k = eio(tt, a, a + 0.3), x = 150 + 600 * p, y = 700 - 600 * Math.sin(p * Math.PI * 0.95) + 20; return <path key={i} d={`M${x - 40} ${y - 40} L${x} ${y + 20} L${x + 40} ${y - 40}`} transform={`translate(0 ${-30 * (1 - k)})`} fill="#000" opacity={k} />; })}</mask></defs>
      <path d="M100 760 Q60 300 450 60 Q840 300 800 760 Z" fill="url(#enr)" mask="url(#enm)" /><path d="M200 700 Q220 380 450 200 Q680 380 700 700" stroke="rgba(255,220,200,.3)" strokeWidth={30} fill="none" mask="url(#enm)" />
      {Array.from({ length: 40 }, (_, k) => <line key={k} x1={150 + rnd(k) * 600} y1={200 + rnd(k + 2) * 500} x2={156 + rnd(k) * 600} y2={186 + rnd(k + 2) * 500} stroke="rgba(40,20,10,.5)" strokeWidth={3} />)}</svg>
    {N.map(([p, a], i) => { const ph = tt - a; if (ph < -0.6 || ph > 0.8) return null; const x = 450 + 150 + 600 * p, y = 140 + 700 - 600 * Math.sin(p * Math.PI * 0.95) + 20, cl2 = ph > 0 && ph < 0.3 ? 0 : 1;
      return <svg key={i} width={300} height={200} viewBox="0 0 300 200" style={{ position: "absolute", left: x - 30, top: y - 160, filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><path d={`M20 100 L200 ${80 - 20 * cl2} L210 100 L20 110 Z`} fill="#a8b0b6" /><path d={`M20 110 L200 ${130 + 20 * cl2} L210 110 L20 100 Z`} fill="#7a8086" /><rect x={200} y={70} width={100} height={22} rx={10} fill="#b3221a" transform={`rotate(${-10 * cl2} 200 80)`} /><rect x={200} y={112} width={100} height={22} rx={10} fill="#b3221a" transform={`rotate(${10 * cl2} 200 120)`} /></svg>; })}
    <Tag x={1600} y={300} txt="family mark" s={pop(tt, 4.2, 7, 0.5)} size={60} tt={tt} />
  </>;
}} />;

// m5 · el bosque de bellotas: troncos de roble en la maqueta, caen bellotas; los chanchos se meten entre los troncos y la niebla los traga
export const HAcornForest: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#5a6a4a 0%,#8a9a6a 50%,#4a3a22 52%,#2a1e10 100%)" f={(tt) => {
  const fog = eio(tt, 3, 6);
  return <>
    {[180, 520, 820, 1160, 1480, 1780].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 0, width: 120 + (i % 3) * 30, height: 880, transform: "translateX(-50%)", background: "linear-gradient(90deg,#2a1a0e,#6a4a2a 40%,#3a2614)", boxShadow: "20px 0 30px rgba(0,0,0,.4)" }} />)}
    {Array.from({ length: 16 }, (_, k) => { const ph = ((tt + rnd(k) * 4) % 3) / 3; return <svg key={k} width={30} height={40} viewBox="0 0 30 40" style={{ position: "absolute", left: rnd(k + 1) * 1800 + 60, top: -40 + ph * 900 }}><ellipse cx={15} cy={26} rx={11} ry={13} fill="#8a5a22" /><path d="M2 14 Q15 0 28 14 Z" fill="#5a3a1a" /></svg>; })}
    {[0, 1, 2, 3].map((k) => { const p = eio(tt, 0.6 + k * 0.4, 4 + k * 0.4); return <Hog3 key={k} x={1900 - 1100 * p} y={830 + (k % 2) * 40} s={0.6 - p * 0.15} tt={tt * 2 + k} flip o={1 - cl((p - 0.7) * 3) * (k % 2 ? 1 : 0.3)} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, height: 500, background: `linear-gradient(transparent,rgba(220,225,215,${0.75 * fog}) 50%,transparent)` }} />
    <Tag x={400} y={200} txt="never came back out" s={pop(tt, 5, 7, 0.5)} size={54} tt={tt} />
  </>;
}} />;

// m6 · el museo: dos ejemplares sobre pedestales bajo campana de vidrio, chancho de granja y jabalí; los rasgos se iluminan con su tarjetita
export const HBoarCompare: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 30%,#3a3430,#141210)" f={(tt) => {
  const TR = [["bristles", 1.4, 1240, 380], ["long snout", 2.4, 1540, 470], ["tusks", 3.4, 1500, 560]] as [string, number, number, number][];
  return <>
    {[560, 1360].map((x, i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x, top: 0, width: 500, height: 900, transform: "translateX(-50%)", background: "linear-gradient(rgba(255,240,210,.18),transparent)", clipPath: "polygon(40% 0,60% 0,100% 100%,0 100%)" }} />
      <Box x={x} y={1000} w={460} h={300} d={200} rx={-16} ry={0} front="linear-gradient(#e8e4d8,#a8a498)" top="linear-gradient(#f3f0e6,#c8c4b8)" side="#8a867a" />
      <div style={{ position: "absolute", left: x, top: 700, width: 520, height: 520, transform: "translate(-50%,-100%)", borderRadius: "260px 260px 10px 10px", border: "4px solid rgba(220,235,245,.5)", background: "linear-gradient(100deg,rgba(255,255,255,.18),transparent 30%,transparent 70%,rgba(255,255,255,.12))" }} />
      {i === 0 ? <svg width={360} height={220} viewBox="-180 -110 360 220" style={{ position: "absolute", left: x - 180, top: 470 }}><ellipse cx={0} cy={90} rx={140} ry={12} fill="rgba(0,0,0,.4)" /><ellipse cx={-10} cy={10} rx={120} ry={70} fill="#e8a898" /><circle cx={110} cy={0} r={46} fill="#e8a898" /><ellipse cx={150} cy={10} rx={14} ry={18} fill="#c8786a" />{[-70, -30, 40, 80].map((lx) => <rect key={lx} x={lx} y={60} width={18} height={30} fill="#d8988a" />)}<path d="M-130 0 q-20 -20 0 -30 q20 -10 0 -30" stroke="#d8988a" strokeWidth={6} fill="none" /><circle cx={120} cy={-12} r={5} fill="#000" /></svg>
        : <Hog3 x={x} y={580} s={1.3} walk={false} dark />}
      <div style={{ position: "absolute", left: x, top: 880, transform: "translate(-50%,0)", padding: "6px 22px", background: "#f3e6c6", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#2a1a0a" }}>{i ? "EURASIAN BOAR" : "FARM PIG"}</div></React.Fragment>)}
    {TR.map(([l, a, x, y], i) => { const k = eio(tt, a, a + 0.4); return k > 0 && <React.Fragment key={i}><div style={{ position: "absolute", left: x, top: y, width: 90, height: 90, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `5px solid rgba(255,208,64,${k})`, boxShadow: `0 0 20px rgba(255,200,60,${0.6 * k})` }} />
      <div style={{ position: "absolute", left: x + 70, top: y - 40 - i * 20, padding: "6px 18px", background: "#ffd040", fontFamily: HAND, fontSize: 44, color: "#1a1a1a", opacity: k, boxShadow: "0 8px 10px rgba(0,0,0,.5)", transform: `rotate(${-4 + i * 4}deg)` }}>{l}</div></React.Fragment>; })}
  </>;
}} />;

// m6-7 · el alambrado cede: el jabalí embiste la red de alambre, los postes de madera se doblan hacia afuera y la malla se abre
export const HBrokenFence: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const run = eio(tt, 0.4, 2.2), bend = eio(tt, 2.2, 2.7), thru = eio(tt, 2.7, 4.4);
  return <>
    <Box x={960} y={1010} w={1900} h={70} d={260} rx={-24} ry={0} front="linear-gradient(#5a3e22,#2a1a0c)" top="linear-gradient(#7a9a4a,#4a6a2a)" side="#2a1a0c" />
    {[-1, 0, 1].map((k) => { const x = 960 + k * 300, b = bend * (k === 0 ? 34 : 14); return <div key={k} style={{ position: "absolute", left: x, top: 920, width: 30, height: 440, transform: `translate(-50%,-100%) rotate(${b}deg)`, transformOrigin: "50% 100%", background: "linear-gradient(90deg,#4a3220,#8a6238,#4a3220)", boxShadow: "10px 0 14px rgba(0,0,0,.35)" }} />; })}
    <svg width={800} height={440} viewBox="0 0 800 440" style={{ position: "absolute", left: 560, top: 480, overflow: "visible" }}>{Array.from({ length: 6 }, (_, r) => <path key={r} d={`M0 ${40 + r * 70} Q400 ${40 + r * 70 + 160 * bend * (r > 1 && r < 5 ? 1 : 0.4)} 800 ${40 + r * 70}`} stroke="#9aa0a6" strokeWidth={5} fill="none" strokeDasharray={bend > 0.9 && r > 1 && r < 5 ? "300 200" : undefined} />)}
      {Array.from({ length: 12 }, (_, c) => <path key={c} d={`M${c * 72} 40 L${c * 72} 390`} stroke="#9aa0a6" strokeWidth={3} />)}</svg>
    <Hog3 x={200 + 640 * run + 900 * thru} y={860} s={1.3} tt={tt * 1.6} dark />
    {bend > 0.2 && bend < 1 && <Puff x={960} y={760} r={120} col="rgba(200,170,120,.6)" />}
  </>;
}} />;

// m7 · el híbrido: dos latas de pintura (rosa granja y negro jabalí) se vuelcan en un balde; la mezcla sale oscura y forma un chancho más duro
export const HHybridMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tip = eio(tt, 0.6, 1.4) * (1 - eio(tt, 3.2, 3.8)), pour = tt > 1.2 && tt < 3.4, rise = eio(tt, 3.6, 5);
  const Can: React.FC<{ x: number; col: string; sgn: number }> = ({ x, col, sgn }) => <div style={{ position: "absolute", left: x, top: 260, transform: `rotate(${sgn * 100 * tip}deg)`, transformOrigin: "50% 100%" }}><svg width={220} height={260} viewBox="0 0 220 260" style={{ filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><defs><linearGradient id={"pc" + x} x1="0" x2="1"><stop offset="0" stopColor="#6a7076" /><stop offset=".5" stopColor="#e0e4e8" /><stop offset="1" stopColor="#6a7076" /></linearGradient></defs><rect x={20} y={30} width={180} height={220} rx={10} fill={`url(#pc${x})`} /><rect x={20} y={90} width={180} height={100} fill={col} /><ellipse cx={110} cy={30} rx={90} ry={20} fill={col} /></svg></div>;
  return <>
    <CShadow x={960} y={960} w={700} />
    <Can x={460} col="#e8a898" sgn={1} /><Can x={1240} col="#2a201c" sgn={-1} />
    {pour && <><div style={{ position: "absolute", left: 760, top: 420, width: 26, height: 360, background: "#e8a898", transform: "rotate(-20deg)", transformOrigin: "50% 0", borderRadius: 13 }} /><div style={{ position: "absolute", left: 1130, top: 420, width: 26, height: 360, background: "#2a201c", transform: "rotate(20deg)", transformOrigin: "50% 0", borderRadius: 13 }} /></>}
    <svg width={520} height={360} viewBox="0 0 520 360" style={{ position: "absolute", left: 700, top: 620, filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))" }}><defs><linearGradient id="hbk" x1="0" x2="1"><stop offset="0" stopColor="#6a7076" /><stop offset=".5" stopColor="#d0d4d8" /><stop offset="1" stopColor="#6a7076" /></linearGradient></defs><path d="M20 40 L500 40 L460 340 L60 340 Z" fill="url(#hbk)" /><ellipse cx={260} cy={40} rx={240} ry={34} fill={`rgb(${232 - 160 * eio(tt, 1.2, 3.4)},${168 - 120 * eio(tt, 1.2, 3.4)},${152 - 110 * eio(tt, 1.2, 3.4)})`} /></svg>
    {rise > 0 && <Hog3 x={960} y={620 - 200 * rise} s={1.3 * rise} tt={0} walk={false} dark />}
    <Tag x={1600} y={640} txt="tougher" s={pop(tt, 5, 7, 0.5)} size={66} tt={tt} />
  </>;
}} />;

// m8 · el afiche de feria: la lona se desenrolla de arriba sobre el tablón de madera: «HOG HUNTS · ALL YEAR · NO LIMIT»
export const HHuntPoster: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const un = eio(tt, 0.4, 2);
  return <>
    <div style={{ position: "absolute", left: 200, right: 200, top: 60, bottom: 60, background: "repeating-linear-gradient(90deg,#6a4626 0 6px,#8a6238 6px 170px)", boxShadow: "inset 0 0 60px rgba(0,0,0,.6), 0 30px 40px rgba(0,0,0,.5)" }}><Grain id="hpw" o={0.3} f={0.6} /></div>
    <div style={{ position: "absolute", left: 960, top: 130, width: 1100, height: 820 * un, transform: "translate(-50%,0)", overflow: "hidden", background: "linear-gradient(#f3e6c6,#e0c890)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", textAlign: "center" }}><Grain id="hpp" o={0.3} f={0.9} />
      <div style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 170, color: "#b3221a", marginTop: 50, letterSpacing: 6 }}>HOG HUNTS</div>
      <div style={{ margin: "10px auto", width: 300 }}><Hog3 x={150} y={110} s={1.2} walk={false} dark /></div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#1a1a1a", marginTop: 110 }}>ALL YEAR</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#1a1a1a", transform: `scale(${pop(tt, 2.8, 8, 0.5)})` }}>NO LIMIT</div></div>
    <div style={{ position: "absolute", left: 960, top: 110 + 820 * un, width: 1160, height: 60, transform: "translate(-50%,0)", borderRadius: 30, background: "linear-gradient(#a87a4a,#5a3a1e)", boxShadow: "0 14px 16px rgba(0,0,0,.5)" }} />
  </>;
}} />;

// m9 · el cartel de bombitas: la silueta de EE.UU. hecha de focos de marquesina; se prenden 17 estados y de golpe saltan a más de 35, con focos lejos unos de otros
export const HStateJump: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#141018,#22182a)" f={(tt) => {
  const B: [number, number][] = []; for (let r = 0; r < 9; r++) for (let c = 0; c < 18; c++) { const x = 280 + c * 80, y = 240 + r * 70; const inside = !(r < 2 && c > 14) && !(r > 6 && (c < 5 || c > 13)) && !(r > 7 && c > 11); if (inside) B.push([x, y]); }
  const ph = tt < 3 ? 0 : 1, nOn = ph ? 35 : Math.min(17, Math.floor(eio(tt, 0.4, 2.6) * 17.99));
  const lit = new Set<number>(); for (let i = 0; i < nOn; i++) lit.add(Math.floor(rnd(ph ? i + 40 : i) * B.length * (ph || i < 17 ? 1 : 1)) % B.length);
  for (let i = 0; i < 17 && ph; i++) lit.add(Math.floor(rnd(i) * B.length) % B.length);
  return <>
    <div style={{ position: "absolute", left: 200, top: 170, width: 1520, height: 760, borderRadius: 30, background: "linear-gradient(#3a2a1a,#1a120a)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 0 0 16px #6a4a2a" }} />
    {B.map(([x, y], i) => { const on = lit.has(i); return <div key={i} style={{ position: "absolute", left: x, top: y, width: 40, height: 40, transform: "translate(-50%,-50%)", borderRadius: "50%", background: on ? "radial-gradient(#fff8d8,#ffc040 60%,#a86a10)" : "radial-gradient(#4a4038,#2a2220)", boxShadow: on ? "0 0 26px rgba(255,190,80,.8)" : "inset 0 0 6px #000" }} />; })}
    <div style={{ position: "absolute", left: 1760, top: 380, transform: "translate(-50%,0)", fontFamily: MARK, fontSize: 160, color: ph ? "#ffd060" : "#f3e6c6", textShadow: "0 0 30px rgba(255,190,80,.6)" }}>{ph ? "35+" : nOn}</div>
    <div style={{ position: "absolute", left: 1760, top: 560, transform: "translate(-50%,0)", fontFamily: HAND, fontSize: 54, color: "#f3e6c6" }}>states</div>
  </>;
}} />;

// m9-10 · la autopista: un chancho llega al borde de la interestatal y frena; el remolque pasa a toda velocidad y lo cruza de un lado al otro
export const HInterstate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8b8c8 0%,#d0d8d8 30%,#7a8a5a 32%,#5a6a3a 100%)" f={(tt) => {
  const tr = -600 + 3000 * eio(tt, 2.6, 5.4), car = (tt * 1400) % 2600 - 300;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 480, height: 360, background: "linear-gradient(#4a4a4a,#2a2a2a)", boxShadow: "0 -6px 0 #d8d4c8, 0 6px 0 #d8d4c8" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, height: 14, background: "repeating-linear-gradient(90deg,#f3d040 0 100px,transparent 100px 200px)", backgroundPosition: `${-tt * 600}px 0` }} /></div>
    {tt < 2.4 && <div style={{ position: "absolute", left: car, top: 540, width: 220, height: 90, borderRadius: 20, background: "linear-gradient(#3a6a9a,#1a3a5a)", boxShadow: "0 14px 10px rgba(0,0,0,.5)" }} />}
    <Hog3 x={500 + 120 * eio(tt, 0.3, 1.6)} y={430} s={0.8} tt={tt * (tt < 1.6 ? 2 : 0)} />
    {tt > 1.6 && tt < 2.6 && <div style={{ position: "absolute", left: 640, top: 280, fontFamily: MARK, fontSize: 90, color: "#b3221a", transform: `scale(${pop(tt, 1.6, 9, 0.4)})` }}>✕</div>}
    <svg width={760} height={300} viewBox="0 0 760 300" style={{ position: "absolute", left: tr - 380, top: 520, filter: "drop-shadow(14px 22px 12px rgba(0,0,0,.5))" }}><rect x={0} y={60} width={200} height={140} rx={16} fill="#b3221a" /><rect x={30} y={80} width={110} height={60} fill="#8ab0d0" /><rect x={220} y={30} width={520} height={190} fill="#c8ccd0" />{Array.from({ length: 8 }, (_, k) => <rect key={k} x={250 + k * 60} y={60} width={30} height={12} rx={6} fill="#3a3e42" />)}{[80, 320, 420, 640].map((x) => <circle key={x} cx={x} cy={230} r={40} fill="#1a1a1a" />)}</svg>
    {tr > 1200 && <Hog3 x={1300 + 200 * eio(tt, 5, 6)} y={920} s={0.8} tt={tt * 2} />}
    <Tag x={1500} y={100} txt="they don't cross alone" s={pop(tt, 1.8, 7, 0.5)} size={52} tt={tt} />
  </>;
}} />;

// m10-11 · la pirámide de bloques: cada generación es una fila de bloques de madera tallados; la cerda arriba, sus camadas abajo y las hijas que ya empiezan la suya
export const HSowCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const ROWS = [1, 4, 8, 16], LBL = ["sow", "6-8 months", "2 litters a year", "daughters too"];
  return <>
    <Box x={960} y={1010} w={1700} h={60} d={260} rx={-22} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {ROWS.map((n, r) => { const y = 260 + r * 170, w = Math.min(100, 1500 / n - 8); return <React.Fragment key={r}>
      {Array.from({ length: n }, (_, k) => { const f = fall(tt, 0.4 + r * 1.2 + k * 0.05); if (f.s <= 0.01) return null; const x = 960 + (k - (n - 1) / 2) * (w + 8);
        return <div key={k} style={{ position: "absolute", left: x, top: y + f.y, width: w, height: 130, transform: "translate(-50%,0)", background: WOODTOP, boxShadow: "0 10px 0 #6a4626, 0 18px 14px rgba(0,0,0,.45)", borderRadius: 8, overflow: "hidden" }}><Hog3 x={w / 2} y={70} s={w / 300} walk={false} shadow={false} tusk={false} /></div>; })}
      <div style={{ position: "absolute", left: 1500, top: y + 30, fontFamily: HAND, fontSize: 50, color: "#f3e6c6", opacity: cl((tt - 0.6 - r * 1.2) * 3), textShadow: "0 4px 8px #000", display: r ? "block" : "none" }}>{LBL[r]}</div></React.Fragment>; })}
  </>;
}} />;

// m11 · el manómetro: la aguja tiene que pasar la raya roja del 66 % cada año; cuando no llega, la piara vuelve a crecer en el vidrio
export const HTwoThirdsGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const v = tt < 3 ? 0.66 * eio(tt, 0.4, 2.6) - 0.02 * Math.sin(tt * 8) * eio(tt, 2, 3) : 0.5 + 0.08 * Math.sin(tt * 6) * Math.exp(-(tt - 3)), a = -120 + 240 * v, miss = tt > 3;
  return <>
    <CShadow x={960} y={940} w={900} />
    <div style={{ position: "absolute", left: 960, top: 520, width: 760, height: 760, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f0f4f6,#a8b0b6 60%,#5a6268)", boxShadow: "0 40px 50px rgba(0,0,0,.6)" }} />
    <svg width={640} height={640} viewBox="-320 -320 640 640" style={{ position: "absolute", left: 640, top: 200 }}><circle r={300} fill="#fbfaf4" />
      {Array.from({ length: 21 }, (_, k) => { const an = (-120 + k * 12 - 90) / 57.3; return <line key={k} x1={Math.cos(an) * 250} y1={Math.sin(an) * 250} x2={Math.cos(an) * (k % 5 ? 270 : 290)} y2={Math.sin(an) * (k % 5 ? 270 : 290)} stroke="#1a1a1a" strokeWidth={k % 5 ? 3 : 7} />; })}
      <path d={`M${Math.cos((-120 + 240 * 0.66 - 90) / 57.3) * 290} ${Math.sin((-120 + 240 * 0.66 - 90) / 57.3) * 290} A290 290 0 0 1 ${Math.cos((120 - 90) / 57.3) * 290} ${Math.sin((120 - 90) / 57.3) * 290}`} stroke="#b3221a" strokeWidth={22} fill="none" />
      <text x={0} y={140} textAnchor="middle" fontFamily={MARK} fontSize={90} fill={miss ? "#b3221a" : "#1a1a1a"}>{Math.round(v * 100)}%</text><text x={150} y={-180} textAnchor="middle" fontFamily={HAND} fontSize={50} fill="#b3221a">66%</text>
      <g transform={`rotate(${a})`}><path d="M-12 20 L0 -260 L12 20 Z" fill="#1a1a1a" /></g><circle r={30} fill="#3a3e42" /></svg>
    {miss && Array.from({ length: Math.floor(eio(tt, 3.4, D(h) - 1) * 8) }, (_, k) => <Hog3 key={k} x={1450 + (k % 4) * 110} y={700 + Math.floor(k / 4) * 120} s={0.36} tt={tt + k} />)}
    {miss && <Tag x={1620} y={420} txt="they bounce back" s={pop(tt, 3.6, 7, 0.5)} size={52} tt={tt} />}
  </>;
}} />;

// m12 · el trono vacío: un sillón de madera tallado; las figuritas de lobo y puma se caen del asiento y el chancho sube y se sienta arriba
export const HEmptyThrone: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 30%,#4a2a2a,#1a0e0e)" f={(tt) => {
  const wolf = eio(tt, 0.8, 1.6), puma = eio(tt, 1.8, 2.6), up = eio(tt, 3, 4.4);
  return <>
    <CShadow x={960} y={960} w={800} />
    <svg width={700} height={900} viewBox="0 0 700 900" style={{ position: "absolute", left: 610, top: 80, filter: "drop-shadow(24px 34px 24px rgba(0,0,0,.6))" }}><defs><linearGradient id="etw" x1="0" x2="1"><stop offset="0" stopColor="#5a2e12" /><stop offset=".5" stopColor="#a8682a" /><stop offset="1" stopColor="#4a240e" /></linearGradient></defs>
      <path d="M120 600 L120 120 Q350 -20 580 120 L580 600 Z" fill="url(#etw)" /><path d="M180 560 L180 180 Q350 80 520 180 L520 560 Z" fill="#8a1a1a" /><circle cx={350} cy={60} r={40} fill="#e8c040" /><rect x={60} y={560} width={580} height={90} fill="url(#etw)" />{[80, 580].map((x) => <rect key={x} x={x} y={640} width={50} height={260} fill="url(#etw)" />)}<rect x={40} y={420} width={80} height={200} fill="url(#etw)" /><rect x={580} y={420} width={80} height={200} fill="url(#etw)" /></svg>
    <svg width={200} height={160} viewBox="0 0 200 160" style={{ position: "absolute", left: 780 - 400 * wolf, top: 520 + 420 * wolf * wolf, transform: `rotate(${-200 * wolf}deg)`, opacity: 1 - cl((wolf - 0.9) * 10) * 0, filter: "drop-shadow(8px 12px 8px rgba(0,0,0,.5))" }}><path d="M20 120 L40 60 L120 50 L170 20 L180 50 L160 70 L150 120 Z" fill="#7a7a82" /><path d="M150 20 L160 0 L170 20 Z" fill="#7a7a82" /></svg>
    <svg width={200} height={160} viewBox="0 0 200 160" style={{ position: "absolute", left: 960 + 420 * puma, top: 520 + 420 * puma * puma, transform: `rotate(${200 * puma}deg)`, filter: "drop-shadow(8px 12px 8px rgba(0,0,0,.5))" }}><path d="M10 110 Q60 60 140 70 Q180 60 190 80 Q180 100 150 100 L140 130 L30 130 Z" fill="#c8985a" /><path d="M10 110 Q-10 80 10 50" stroke="#c8985a" strokeWidth={10} fill="none" /></svg>
    {wolf > 0.95 && <div style={{ position: "absolute", left: 380, top: 900, fontFamily: HAND, fontSize: 50, color: "#f3e6c6" }}>wolf</div>}
    {puma > 0.95 && <div style={{ position: "absolute", left: 1380, top: 900, fontFamily: HAND, fontSize: 50, color: "#f3e6c6" }}>cougar</div>}
    <Hog3 x={1500 - 540 * up} y={960 - 340 * up} s={1.2} tt={tt * (up > 0 && up < 1 ? 2 : 0)} flip />
  </>;
}} />;

// m13 · el hocico excavador en corte: un terrario de vidrio muestra la tierra en capas; el hocico entra y saca raíces, larvas y semillas
export const HSnoutDig: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const dig = eio(tt, 0.6, 2.4) * (1 - eio(tt, 5, 6)), IT = [["roots", 2.6], ["grubs", 3.4], ["seeds", 4.2]] as [string, number][];
  return <>
    <CShadow x={960} y={1000} w={1300} />
    <div style={{ position: "absolute", left: 360, top: 360, width: 1200, height: 620, background: "linear-gradient(#7a9a4a 0 40px,#6a4a2a 40px 260px,#5a3a1e 260px 440px,#4a2e16 440px)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}><Grain id="sdt" o={0.4} f={0.9} />
      {Array.from({ length: 14 }, (_, k) => <path key={k} />)}
      <svg width={1200} height={620} viewBox="0 0 1200 620" style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${120 + k * 140} 40 q${rnd(k) * 60 - 30} 120 ${rnd(k + 2) * 80 - 40} 260`} stroke="#c8a870" strokeWidth={6} fill="none" />)}{Array.from({ length: 6 }, (_, k) => <ellipse key={k} cx={160 + k * 180} cy={360 + (k % 2) * 60} rx={20} ry={12} fill="#f3e6c6" />)}</svg>
      <div style={{ position: "absolute", left: 520, top: 0, width: 180, height: 300 * dig, borderRadius: "0 0 90px 90px", background: "rgba(30,18,8,.7)" }} /></div>
    <div style={{ position: "absolute", left: 340, top: 340, width: 1240, height: 660, border: "14px solid rgba(210,230,240,.55)", background: "linear-gradient(100deg,rgba(255,255,255,.18),transparent 25%,transparent 75%,rgba(255,255,255,.1))" }} />
    <div style={{ position: "absolute", left: 950, top: 140 + 260 * dig, transform: "translate(-50%,-50%) rotate(90deg)" }}><Hog3 x={0} y={0} s={1.2} walk={false} shadow={false} /></div>
    {IT.map(([l, a], i) => { const s = pop(tt, a, 8, 0.45), x = 1700, y = 380 + i * 190; return s > 0.01 && <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: HAND, fontSize: 64, color: "#f3e6c6", textShadow: "0 4px 8px #000" }}>{l}</div>; })}
  </>;
}} />;

// m14 · el comedero: maní, arroz, sorgo y rodajas de sandía caen en la batea de chapa; el hocico la vacía igual de rápido
export const HCropPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const F = [["#c89a5a", "peanuts"], ["#f3ead6", "rice"], ["#a8502a", "sorghum"], ["#e8504a", "watermelon"]] as [string, string][], eat = eio(tt, 4.4, D(h) - 1);
  return <>
    <CShadow x={960} y={940} w={1300} />
    <svg width={1300} height={300} viewBox="0 0 1300 300" style={{ position: "absolute", left: 310, top: 640, filter: "drop-shadow(16px 24px 16px rgba(0,0,0,.5))" }}><defs><linearGradient id="cpt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d0d4d8" /><stop offset="1" stopColor="#6a7076" /></linearGradient></defs><path d="M0 20 L1300 20 L1200 280 L100 280 Z" fill="url(#cpt)" /><ellipse cx={650} cy={20} rx={650} ry={30} fill="#3a3e42" /></svg>
    {F.map(([c, l], i) => { const x = 460 + i * 300; return <React.Fragment key={i}>
      {Array.from({ length: 14 }, (_, k) => { const f = fall(tt, 0.4 + i * 0.8 + k * 0.04); if (f.s <= 0.01 || cl((eat * 4 - (3 - i)) ) >= 1) return null; return <div key={k} style={{ position: "absolute", left: x + (k % 5) * 40 - 80, top: 640 + f.y - Math.floor(k / 5) * 18, width: i === 3 ? 60 : 28, height: i === 3 ? 36 : 18, borderRadius: i === 3 ? "60px 60px 0 0" : "50%", background: i === 3 ? "linear-gradient(#e8504a 70%,#3a8a3a 70%)" : c, boxShadow: "2px 4px 3px rgba(0,0,0,.4)" }} />; })}
      <div style={{ position: "absolute", left: x, top: 360, transform: "translate(-50%,0)", fontFamily: HAND, fontSize: 52, color: "#f3e6c6", opacity: cl((tt - 0.6 - i * 0.8) * 3), textShadow: "0 4px 8px #000" }}>{l}</div></React.Fragment>; })}
    {eat > 0 && <Hog3 x={1700 - 1100 * eat} y={640} s={1} tt={tt * 2} flip />}
  </>;
}} />;

// m14-15 · el medidor de la luz: los tambores numerados del medidor de chapa giran hasta $1.500.000.000 por año
export const HBillionMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const v = 1.5e9 * Math.pow(eio(tt, 0.4, D(h) - 2), 1.6), digits = Math.floor(v).toString().padStart(10, "0").split("");
  return <>
    <CShadow x={960} y={960} w={1300} />
    <div style={{ position: "absolute", left: 960, top: 540, width: 1400, height: 700, transform: "translate(-50%,-50%)", borderRadius: 50, background: "linear-gradient(160deg,#c8ccd0,#6a7076)", boxShadow: "0 40px 50px rgba(0,0,0,.55), inset 0 0 0 10px #8a9096" }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 80, bottom: 80, borderRadius: 340, background: "linear-gradient(100deg,rgba(255,255,255,.35),rgba(255,255,255,.06) 40%,rgba(255,255,255,.2))", border: "6px solid rgba(220,235,245,.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: "#1a1a1a" }}>CROP DAMAGE · PER YEAR</div>
      <div style={{ position: "absolute", left: 120, top: 250, display: "flex", gap: 6 }}><div style={{ fontFamily: MARK, fontSize: 130, color: "#1a1a1a", marginRight: 8 }}>$</div>
        {digits.map((d, i) => <div key={i} style={{ width: 100, height: 170, background: "linear-gradient(#1a1a1a,#3a3a3a 50%,#1a1a1a)", color: "#f3f0e6", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 130, textAlign: "center", lineHeight: "170px", boxShadow: "inset 0 10px 14px rgba(0,0,0,.8)", marginRight: (10 - i) % 3 === 1 && i < 9 ? 16 : 0 }}>{d}</div>)}</div>
      <div style={{ position: "absolute", left: 640, top: 480, width: 120, height: 120, borderRadius: "50%", background: "#fbfaf4", border: "6px solid #3a3e42" }}><div style={{ position: "absolute", left: 56, top: 10, width: 8, height: 52, background: "#b3221a", transformOrigin: "50% 100%", transform: `rotate(${tt * 720}deg)` }} /></div></div>
  </>;
}} />;

// m15-16 · la gradilla del laboratorio: el tubo con la muestra entra en la gradilla y cuelga la etiqueta con lo que pasa a cerdos y a personas
export const HGermTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = ["brucellosis", "swine fever", "E. coli", "trichinosis"], dn = eio(tt, 0.4, 1.4);
  return <>
    <CShadow x={760} y={960} w={800} />
    <Box x={760} y={960} w={700} h={140} d={220} rx={-20} ry={0} front="linear-gradient(#e8ecef,#9aa0a6)" top="linear-gradient(#f3f6f8,#c8ccd0)" side="#8a9096"
      topKids={<>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 80 + k * 130, top: 70, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(#3a3e42,#6a7076)" }} />)}</>} />
    {[0, 1, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 500 + k * 130, top: 840, width: 54, height: 360, transform: "translate(-50%,-100%)", borderRadius: "0 0 27px 27px", border: "4px solid rgba(220,235,245,.7)", background: `linear-gradient(transparent 40%,${["#8ac0e0", "#e8d070", "", "#a8d8a8", "#e0a0c0"][k]} 40%)`, opacity: 0.8 }} />)}
    <div style={{ position: "absolute", left: 760, top: 840 - 600 * (1 - dn), width: 64, height: 420, transform: "translate(-50%,-100%)", borderRadius: "0 0 32px 32px", border: "5px solid rgba(220,235,245,.85)", background: "linear-gradient(100deg,rgba(255,255,255,.4),transparent 40%), linear-gradient(transparent 35%,#b3221a 35%)", boxShadow: "8px 0 10px rgba(0,0,0,.3)" }}><div style={{ position: "absolute", left: -10, right: -10, top: -20, height: 30, borderRadius: 6, background: "#3a6a9a" }} /></div>
    <Sheet x={1400} y={540} w={620} h={560} r={4} id="gtl"><div style={{ padding: "40px 46px" }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#b3221a", marginBottom: 20 }}>⚠ CARRIES</div>
      {L.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 60, color: INK, opacity: cl((tt - 1.6 - i * 0.7) * 3), transform: `translateX(${(1 - cl((tt - 1.6 - i * 0.7) * 3)) * 40}px)` }}>· {l}</div>)}</div></Sheet>
    <div style={{ position: "absolute", left: 1090, top: 440, width: 6, height: 160, background: "#8a7a5a", transform: "rotate(-60deg)", transformOrigin: "0 0" }} />
  </>;
}} />;

// m16-17 · la bolsa de espinaca de 2006: la bolsa de plástico con hojas verdes está sobre la mesa; una mano le estampa la etiqueta roja de alerta encima
export const HSpinachBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const st = pop(tt, 2, 10, 0.3), hand = eio(tt, 1.2, 2) * (1 - eio(tt, 2.4, 3.2));
  return <>
    <CShadow x={960} y={960} w={800} />
    <div style={{ position: "absolute", left: 960, top: 540, width: 680, height: 820, transform: "translate(-50%,-50%) rotate(-4deg)", borderRadius: "30px 30px 50px 50px", background: "linear-gradient(100deg,rgba(255,255,255,.45),rgba(255,255,255,.1) 30%,rgba(255,255,255,.05) 70%,rgba(255,255,255,.35))", border: "4px solid rgba(255,255,255,.6)", boxShadow: "0 30px 40px rgba(0,0,0,.5)", overflow: "hidden" }}>
      {Array.from({ length: 34 }, (_, k) => <div key={k} style={{ position: "absolute", left: rnd(k) * 600 - 40, top: 160 + rnd(k + 4) * 640, width: 160, height: 100, borderRadius: "50% 0 50% 0", transform: `rotate(${rnd(k + 1) * 360}deg)`, background: `linear-gradient(${rnd(k) * 360}deg,#2a6a2a,#5aaa4a)`, boxShadow: "inset 0 0 10px rgba(0,0,0,.4)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, background: "linear-gradient(#3a7a3a,#1a5a1a)", textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 70, color: "#f3f0e6", lineHeight: "150px" }}>BABY SPINACH</div></div>
    {st > 0.01 && <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(${10 + (1 - cl(st)) * 20}deg) scale(${0.5 + 0.5 * st})`, padding: "24px 50px", background: "#b3221a", border: "8px solid #f3f0e6", outline: "6px solid #b3221a", boxShadow: "0 14px 20px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#f3f0e6", textAlign: "center", lineHeight: 1 }}>RECALL<div style={{ fontSize: 56, marginTop: 10 }}>2006</div></div>}
    <svg width={400} height={240} viewBox="0 0 400 240" style={{ position: "absolute", left: 1100 + 200 * (1 - hand), top: 360 - 300 * (1 - hand), opacity: cl(hand * 4), transform: "rotate(160deg)", filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><rect x={0} y={80} width={180} height={90} fill="#3a4a6a" /><path d="M180 86 Q260 70 300 100 L340 110 Q352 128 334 136 L290 140 Q284 180 240 180 L180 170 Z" fill="#d8a888" /></svg>
  </>;
}} />;

// m17 · el agujero en el alambrado de la huerta: la cámara recorre el cerco, encuentra el boquete y sigue el rastro hasta el chancho
export const HFenceGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c0b0 0%,#d8e0c8 40%,#6a8a3a 42%,#3a5a1a 100%)" f={(tt) => {
  const cam = -1600 * eio(tt, 0.4, D(h) - 1.2);
  return <div style={{ position: "absolute", left: cam, top: 0, width: 3800, height: 1080 }}>
    {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: 40 + k * 120, top: 840, width: 90, height: 120, transform: "translateY(-100%)", borderRadius: "50% 50% 20% 20%", background: "radial-gradient(circle at 40% 30%,#8ac85a,#3a7a2a)", boxShadow: "10px 14px 10px rgba(0,0,0,.35)" }} />)}
    {Array.from({ length: 16 }, (_, k) => <div key={k} style={{ position: "absolute", left: 100 + k * 240, top: 700, width: 20, height: 280, transform: "translateY(-50%)", background: "linear-gradient(90deg,#4a3220,#8a6238,#4a3220)" }} />)}
    <svg width={3800} height={300} viewBox="0 0 3800 300" style={{ position: "absolute", left: 0, top: 560 }}>{Array.from({ length: 5 }, (_, r) => <path key={r} d={`M0 ${30 + r * 50} L1880 ${30 + r * 50} M2240 ${30 + r * 50} L3800 ${30 + r * 50}`} stroke="#9aa0a6" strokeWidth={4} />)}<path d="M1880 30 Q1900 160 1870 250 M2240 30 Q2210 140 2250 250" stroke="#9aa0a6" strokeWidth={4} fill="none" /></svg>
    {Array.from({ length: 10 }, (_, k) => <svg key={k} width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", left: 2000 + k * 120, top: 900 + (k % 2) * 30 }}><path d="M8 4 Q2 22 10 40 Q20 42 20 28 Q20 12 8 4 Z M36 4 Q42 22 34 40 Q24 42 24 28 Q24 12 36 4 Z" fill="#1e1208" /></svg>)}
    <Hog3 x={3400} y={900} s={1.1} tt={tt * 0.5} walk={false} />
  </div>;
}} />;

// m18 · el nido saqueado: huevos de pavo y de codorniz en la hojarasca; el hocico pasa y quedan sólo cáscaras rotas
export const HNestRaid: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sn = eio(tt, 2, 4.4), gone = (x: number) => cl((sn * 1400 + 300 - x) / 80);
  return <>
    <CShadow x={960} y={880} w={1000} />
    <div style={{ position: "absolute", left: 960, top: 760, width: 1000, height: 380, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(#8a6a3a 0 8deg,#a8884a 8deg 16deg,#6a4a22 16deg 22deg)", boxShadow: "inset 0 30px 40px rgba(0,0,0,.5)" }} />
    {Array.from({ length: 9 }, (_, k) => { const x = 680 + (k % 5) * 130 + (Math.floor(k / 5) ? 60 : 0), y = 700 + Math.floor(k / 5) * 90, quail = k > 5, g = gone(x);
      return <div key={k} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>
        {g < 1 ? <div style={{ width: quail ? 60 : 90, height: quail ? 78 : 118, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: quail ? "radial-gradient(circle at 35% 30%,#f3ead6,#c8b898), radial-gradient(#5a4a3a 20%,transparent 22%) 0 0/16px 16px" : "radial-gradient(circle at 35% 30%,#f3ead6,#c8b090)", boxShadow: "4px 10px 8px rgba(0,0,0,.4)" }} />
          : <svg width={100} height={70} viewBox="0 0 100 70"><path d="M10 60 L20 30 L30 44 L40 20 L50 40 L60 24 L70 46 L80 30 L90 60 Z" fill="#e8dcc0" /></svg>}</div>; })}
    <div style={{ position: "absolute", left: -200 + 1400 * sn, top: 620 }}><Hog3 x={0} y={0} s={1} tt={tt * 2} /></div>
    <Tag x={400} y={220} txt="turkey & quail" s={pop(tt, 0.8, 7, 0.5)} size={56} tt={tt} />
  </>;
}} />;

// m19 · la bellota que no llega a roble: la bellota brota en una maceta de barro, sale el tallito con dos hojas… y el hocico se lo come antes
export const HOakStop: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const gr = eio(tt, 0.6, 3.6), eat = eio(tt, 4.2, 5), sn = eio(tt, 3.8, 4.4) * (1 - eio(tt, 5.4, 6.4));
  return <>
    <CShadow x={960} y={960} w={600} />
    <svg width={500} height={420} viewBox="0 0 500 420" style={{ position: "absolute", left: 710, top: 560, filter: "drop-shadow(20px 30px 20px rgba(0,0,0,.5))" }}><defs><linearGradient id="osp" x1="0" x2="1"><stop offset="0" stopColor="#8a3a1a" /><stop offset=".5" stopColor="#d8784a" /><stop offset="1" stopColor="#7a2e12" /></linearGradient></defs><path d="M40 60 L460 60 L400 400 L100 400 Z" fill="url(#osp)" /><rect x={20} y={30} width={460} height={60} rx={10} fill="url(#osp)" /><ellipse cx={250} cy={34} rx={220} ry={20} fill="#3a2614" /></svg>
    {eat < 1 && <svg width={400} height={600} viewBox="0 0 400 600" style={{ position: "absolute", left: 760, top: 0, transform: `scaleY(${1 - eat})`, transformOrigin: "50% 100%" }}>
      <ellipse cx={200} cy={580} rx={26} ry={30} fill="#8a5a22" /><path d="M176 566 Q200 540 224 566 Z" fill="#5a3a1a" />
      <path d={`M200 570 L200 ${570 - 440 * gr}`} stroke="#6a8a3a" strokeWidth={10} />
      {gr > 0.6 && [-1, 1].map((k) => <path key={k} d={`M200 ${570 - 440 * gr + 30} q${k * 90} -40 ${k * 140} 20 q${-k * 70} 40 ${-k * 140} -20 Z`} fill="#5a9a3a" transform={`scale(${cl((gr - 0.6) * 2.5)})`} style={{ transformOrigin: `200px ${570 - 440 * gr + 30}px` }} />)}</svg>}
    <div style={{ position: "absolute", left: 1600 - 500 * sn, top: 380 }}><Hog3 x={0} y={0} s={1.2} tt={0} walk={false} flip /></div>
    <Tag x={500} y={200} txt="never an oak" s={pop(tt, 5.2, 7, 0.5)} size={60} tt={tt} />
  </>;
}} />;

export const HCE2: Record<string, React.FC<{ t: number; h: H }>> = {
  rootedRows: HRootedRows, hoofTrail: HHoofTrail, trailerNight: HTrailerNight, shipLanding: HShipLanding, marchTrail: HMarchTrail, earNotch: HEarNotch,
  acornForest: HAcornForest, boarCompare: HBoarCompare, brokenFence: HBrokenFence, hybridMix: HHybridMix, huntPoster: HHuntPoster, stateJump: HStateJump,
  interstate: HInterstate, sowCalendar: HSowCalendar, twoThirdsGauge: HTwoThirdsGauge, emptyThrone: HEmptyThrone, snoutDig: HSnoutDig, cropPlate: HCropPlate,
  billionMeter: HBillionMeter, germTag: HGermTag, spinachBag: HSpinachBag, fenceGap: HFenceGap, nestRaid: HNestRaid, oakStop: HOakStop,
  ...HCE3,
};
