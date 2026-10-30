// ruth29d · 3ª vuelta (29-oct, notas del evaluador d1): 1ª mitad rehecha — un objeto grande y entero por pieza, volumen + sombra de contacto,
// UNA acción física desde el primer segundo, nada de rótulos chicos ni en la esquina. Helpers y 2ª mitad en ruth_d3.
import React from "react";
import { H, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK, STAMP } from "./ruth_a";
import { CShadow, Grain, Box, WOOD, WOODTOP, WOODSIDE } from "./obj";
import { HCD3, S, D, fall, rnd, Puff, Nutria3, Tail, WATER, Mano, Odo, Splash } from "./ruth_d3";

// piel estirada (forma de lágrima, pelaje con brillo)
const Pelt: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => <svg width={200} height={320} viewBox="0 0 200 320" style={{ position: "absolute", left: x - 100 * s, top: y - 160 * s, width: 200 * s, height: 320 * s, transform: `rotate(${r}deg)`, overflow: "visible", filter: "drop-shadow(8px 14px 10px rgba(0,0,0,.45))" }}>
  <defs><radialGradient id="plz" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#b88a5a" /><stop offset=".6" stopColor="#6a4a2e" /><stop offset="1" stopColor="#3a2414" /></radialGradient></defs>
  <path d="M100 6 Q20 50 30 170 Q40 290 100 314 Q160 290 170 170 Q180 50 100 6 Z" fill="url(#plz)" />{Array.from({ length: 30 }, (_, k) => <path key={k} d={`M${50 + (k % 6) * 20} ${40 + Math.floor(k / 6) * 52} l${4 + (k % 3)} 18`} stroke="rgba(255,230,190,.3)" strokeWidth={3} />)}
  {[[40, 90], [160, 90], [46, 250], [154, 250]].map(([a, b], k) => <path key={"p" + k} d={`M${a} ${b} l${a < 100 ? -22 : 22} ${k < 2 ? -8 : 14}`} stroke="#4a3220" strokeWidth={16} strokeLinecap="round" />)}</svg>;

// m0 · la línea de trampas al alba: la piragua grande corta el agua con estela; al pasar cada estaca, la jaula de alambre sube del agua con una nutria adentro
export const HTrapLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#e8a060 0%,#f0d0a0 34%,#6a8a6a 36%,#2a4a42 100%)" f={(tt) => {
  const cam = tt * 260, bx = 520 + 120 * eio(tt, 0, 1.2), bob = 6 * Math.sin(tt * 2.4);
  return <>
    <div style={{ position: "absolute", left: 1500, top: 210, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(#fff4c8,#ffb050 60%,transparent 72%)" }} />
    {Array.from({ length: 60 }, (_, k) => { const x = ((k * 53 - cam * 0.3) % 2100 + 2100) % 2100 - 90; return <div key={k} style={{ position: "absolute", left: x, top: 370 + (k % 5) * 10, width: 14, height: 80 + (k % 4) * 30, borderRadius: "50% 50% 0 0", background: "#3a5a2a", transform: "translateY(-100%)" }} />; })}
    {Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: ((k * 330 - cam) % 2100 + 2100) % 2100 - 90, top: 640 + k * 50, width: 200, height: 6, background: "rgba(255,220,170,.35)" }} />)}
    {[0, 1, 2, 3].map((i) => { const x = 1200 + i * 640 - cam, rise = eio(bx + 160 - x, -40, 160); if (x < -300 || x > 2200) return null;
      return <React.Fragment key={i}><div style={{ position: "absolute", left: x, top: 700, transform: "translate(-50%,-100%)" }}><div style={{ width: 14, height: 300, background: "linear-gradient(90deg,#3a2410,#7a5a32,#3a2410)" }} /><div style={{ position: "absolute", left: 14, top: 0, width: 70, height: 40, background: "#e86a1a" }} /></div>
        <div style={{ position: "absolute", left: x + 30, top: 790 - 190 * rise, width: 300, height: 190, background: "repeating-linear-gradient(90deg,rgba(200,205,210,.85) 0 4px,transparent 4px 26px), repeating-linear-gradient(0deg,rgba(200,205,210,.85) 0 4px,transparent 4px 26px)", border: "8px solid #8a8e92", boxShadow: "0 14px 20px rgba(0,0,0,.4)", overflow: "visible" }}>
          <Nutria3 x={150} y={110} s={0.6} tt={tt + i} /></div>
        <div style={{ position: "absolute", left: x - 30, top: 780, width: 420, height: 60, background: "linear-gradient(rgba(42,74,66,.95),rgba(42,74,66,.6))" }} />
        {rise > 0.05 && rise < 0.95 && <Splash x={x + 180} y={790} p={rise} s={0.8} />}</React.Fragment>; })}
    <div style={{ position: "absolute", left: bx - 760, top: 830, width: 760, height: 40, borderRadius: "50%", background: "linear-gradient(90deg,transparent,rgba(240,240,232,.5))", filter: "blur(4px)" }} />
    <div style={{ position: "absolute", left: bx, top: 860 + bob, width: 900, height: 34, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(8px)" }} />
    <svg width={960} height={320} viewBox="0 0 960 320" style={{ position: "absolute", left: bx - 480, top: 600 + bob, overflow: "visible" }}><defs><linearGradient id="tlb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8aa72" /><stop offset=".5" stopColor="#8a6238" /><stop offset="1" stopColor="#3a2410" /></linearGradient></defs>
      <path d="M0 180 Q480 290 960 170 L900 250 Q480 320 60 250 Z" fill="url(#tlb)" /><path d="M0 180 Q480 230 960 170" stroke="#3a2410" strokeWidth={8} fill="none" />{[200, 480, 760].map((x) => <line key={x} x1={x} y1={200 + (x === 480 ? 30 : 10)} x2={x} y2={270} stroke="#5a3a1e" strokeWidth={6} />)}
      <circle cx={340} cy={50} r={36} fill="#3a2a1e" /><path d="M290 26 L390 26 L380 6 L300 6 Z" fill="#8a7a5a" /><rect x={312} y={82} width={60} height={110} rx={18} fill="#4a5a3a" /><path d={`M370 110 L${520 + 20 * Math.sin(tt * 2)} -20`} stroke="#8a6238" strokeWidth={12} /></svg>
  </>;
}} />;

// m0-1 · la balanza del acopiador: las pieles caen de a una sobre el plato con rebote, el plato se hunde y el contador mecánico rueda hasta 1.8 millones
export const HPeltBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 9, F = Array.from({ length: N }, (_, i) => fall(tt, 0.2 + i * 0.55)), sink = F.reduce((a, f) => a + cl(f.s), 0) / N, v = 1800000 * eio(tt, 0.4, D(h) - 2.2), big = pop(tt, D(h) - 2, 8, 0.4);
  return <>
    <Box x={960} y={1060} w={1800} h={120} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={760} y={960} w={700} />
    <div style={{ position: "absolute", left: 730, top: 700 + 60 * sink, width: 60, height: 260 - 60 * sink, background: "linear-gradient(90deg,#5a5e62,#c8ccd0,#4a4e52)" }} />
    <div style={{ position: "absolute", left: 760, top: 690 + 60 * sink, width: 760, height: 40, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(ellipse,#d8dce0,#7a8086)", boxShadow: "0 18px 20px rgba(0,0,0,.5)" }} />
    {F.map((f, i) => f.s > 0.01 && <div key={i} style={{ position: "absolute", left: 0, top: f.y + 60 * sink }}><Pelt x={640 + (i % 3) * 120} y={640 - Math.floor(i / 3) * 56} s={0.95} r={90 + (i % 2 ? 7 : -7)} /></div>)}
    <svg width={340} height={340} viewBox="0 0 340 340" style={{ position: "absolute", left: 1200, top: 560, filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))" }}><circle cx={170} cy={170} r={160} fill="#e8e0c8" stroke="#8a6a2a" strokeWidth={18} />{Array.from({ length: 11 }, (_, k) => { const a = (-210 + k * 24) * Math.PI / 180; return <line key={k} x1={170 + Math.cos(a) * 120} y1={170 + Math.sin(a) * 120} x2={170 + Math.cos(a) * 146} y2={170 + Math.sin(a) * 146} stroke="#3a2a1a" strokeWidth={6} />; })}
      <line x1={170} y1={170} x2={170 + Math.cos((-210 + 240 * sink) * Math.PI / 180) * 130} y2={170 + Math.sin((-210 + 240 * sink) * Math.PI / 180) * 130} stroke="#c8202a" strokeWidth={10} strokeLinecap="round" /><circle cx={170} cy={170} r={16} fill="#3a2a1a" /></svg>
    <Odo x={960} y={230} v={v} n={7} size={120} />
    {big > 0.01 && <div style={{ position: "absolute", left: 960, top: 410, transform: `translate(-50%,-50%) scale(${big}) rotate(-3deg)`, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 110, color: "#f3e6c6", textShadow: "0 8px 18px #000" }}>1.8 MILLION</div>}
  </>;
}} />;

// m1 · la marisma se perfora: un bloque grande de marisma, centrado y entero; los agujeros se abren como iris a agua oscura, crecen y se juntan; el arquito de fútbol da la escala
export const HMarshHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const cx = 960, cy = 560, W = 760, Hh = 300, Ho = Array.from({ length: 8 }, (_, i) => ({ x: cx + (rnd(i) - 0.5) * 1100, y: cy + (rnd(i + 4) - 0.5) * 380, a: 0.2 + i * 0.75, r: 110 + rnd(i + 2) * 90 }));
  const top = `M${cx - W} ${cy} Q${cx - W + 40} ${cy - Hh} ${cx} ${cy - Hh} Q${cx + W - 40} ${cy - Hh} ${cx + W} ${cy} Q${cx + W - 40} ${cy + Hh} ${cx} ${cy + Hh} Q${cx - W + 40} ${cy + Hh} ${cx - W} ${cy} Z`;
  return <>
    <CShadow x={cx} y={cy + Hh + 210} w={1700} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><defs><clipPath id="mhc"><path d={top} /></clipPath><radialGradient id="mhg" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#9ab85a" /><stop offset=".6" stopColor="#6a8a32" /><stop offset="1" stopColor="#4a6a24" /></radialGradient>
      <linearGradient id="mhs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a4022" /><stop offset="1" stopColor="#2a1a0c" /></linearGradient></defs>
      <path d={`M${cx - W} ${cy} L${cx - W} ${cy + 180} Q${cx - W + 40} ${cy + Hh + 180} ${cx} ${cy + Hh + 180} Q${cx + W - 40} ${cy + Hh + 180} ${cx + W} ${cy + 180} L${cx + W} ${cy} Z`} fill="url(#mhs)" />
      {Array.from({ length: 30 }, (_, k) => <path key={k} d={`M${cx - W + 30 + k * 50} ${cy + Hh * Math.sqrt(Math.max(0, 1 - Math.pow((k * 50 + 30 - W) / W, 2)))} l${(k % 3 - 1) * 6} ${60 + (k * 13) % 80}`} stroke="#d8c8a0" strokeWidth={3} opacity={0.6} />)}
      <path d={top} fill="url(#mhg)" />
      <g clipPath="url(#mhc)">{Array.from({ length: 160 }, (_, k) => <path key={k} d={`M${cx - W + rnd(k) * 2 * W} ${cy - Hh + rnd(k + 1) * 2 * Hh} l${(rnd(k + 2) - 0.5) * 16} -22`} stroke={k % 2 ? "#4a6a24" : "#a8c86a"} strokeWidth={4} />)}
        {Ho.map((p, i) => { const g = eio(tt, p.a, p.a + 3.4), r = p.r * g * (1 + 0.04 * Math.sin(tt * 3 + i)); return g > 0 && <g key={i}><ellipse cx={p.x} cy={p.y} rx={r * 1.1 + 14} ry={r * 0.5 + 8} fill="#3a2a14" /><ellipse cx={p.x} cy={p.y + 4} rx={r * 1.1} ry={r * 0.5} fill="#16303a" /><ellipse cx={p.x - r * 0.3} cy={p.y - r * 0.1} rx={r * 0.4} ry={r * 0.1} fill="rgba(200,230,240,.25)" /></g>; })}</g>
    </svg>
    <svg width={220} height={160} viewBox="0 0 300 220" style={{ position: "absolute", left: cx + 380, top: cy - 300, filter: "drop-shadow(8px 12px 8px rgba(0,0,0,.5))" }}><path d="M30 220 L30 60 L270 60 L270 220" stroke="#f3f0e6" strokeWidth={14} fill="none" /><path d="M30 60 L60 30 L240 30 L270 60" stroke="#d8d4c8" strokeWidth={8} fill="none" />{Array.from({ length: 6 }, (_, k) => <line key={k} x1={40 + k * 40} y1={60} x2={60 + k * 36} y2={30} stroke="rgba(255,255,255,.5)" strokeWidth={3} />)}</svg>
  </>;
}} />;

// m1-2 · el tendedero: colas gruesas con pelo se cuelgan de broches de madera y se hamacan; abajo el frasco se llena de billetes enrollados con su banda
export const HTailTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 6, n = Array.from({ length: N }, (_, i) => pop(tt, 0.2 + i * 1.2, 7, 0.35)), fill = n.reduce((a, s) => a + cl(s), 0) / N;
  return <>
    <svg width={1920} height={400} style={{ position: "absolute", left: 0, top: 80 }}><path d="M80 60 Q960 150 1840 60" stroke="#d8c8a0" strokeWidth={8} fill="none" />{[80, 1840].map((x) => <rect key={x} x={x - 18} y={40} width={36} height={400} fill="#6a4626" />)}</svg>
    {n.map((s, i) => { if (s <= 0.01) return null; const x = 300 + i * 260, y = 150 + 80 * Math.sin((x - 80) / 1760 * Math.PI) * 0.9, sw = 12 * Math.sin((tt - 0.2 - i * 1.2) * 4) * Math.exp(-(tt - i * 1.2) * 0.5); return <div key={i} style={{ position: "absolute", left: x, top: y - (1 - cl(s)) * 260, transform: `translate(-50%,0) rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ width: 34, height: 90, margin: "0 auto", background: "linear-gradient(90deg,#a87a42,#f0c888,#a87a42)", borderRadius: 6, boxShadow: "4px 8px 8px rgba(0,0,0,.4)" }} />
      <div style={{ position: "relative", width: 10, height: 10, margin: "0 auto" }}><Tail x={5} y={170} s={1.5} r={90} /></div></div>; })}
    <CShadow x={1280} y={1000} w={480} />
    <div style={{ position: "absolute", left: 1280, top: 1000, width: 400, height: 440, transform: "translate(-50%,-100%)", borderRadius: "40px 40px 50px 50px", overflow: "hidden" }}>
      {Array.from({ length: Math.round(fill * 28) }, (_, k) => <div key={k} style={{ position: "absolute", left: 30 + (k % 4) * 86, bottom: 10 + Math.floor(k / 4) * 50, width: 84, height: 44, borderRadius: 22, background: "linear-gradient(#d8e8c0,#7a9a6a 60%,#5a7a4a)", transform: `rotate(${(k % 3 - 1) * 14}deg)` }}><div style={{ position: "absolute", left: 32, top: 0, bottom: 0, width: 16, background: "#f3ead6" }} /></div>)}</div>
    <div style={{ position: "absolute", left: 1280, top: 1000, width: 400, height: 440, transform: "translate(-50%,-100%)", borderRadius: "40px 40px 50px 50px", border: "8px solid rgba(220,235,240,.7)", background: "linear-gradient(100deg, rgba(255,255,255,.35), transparent 30%, transparent 70%, rgba(255,255,255,.2))" }}>
      <div style={{ position: "absolute", left: -14, right: -14, top: -40, height: 50, borderRadius: 10, background: "linear-gradient(#e8ecef,#8a8e92)" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 140, padding: "10px 0", textAlign: "center", background: "linear-gradient(#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 92, color: INK, boxShadow: "0 6px 10px rgba(0,0,0,.3)" }}>$4</div></div>
  </>;
}} />;

// m2 · la tarta: la espátula de plata levanta la porción «nutria» y se ve el relleno; el repasador a cuadros, con pliegues, cae y tapa el resto
export const HPieSlice: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lift = eio(tt, 0.3, 2.4), cloth = eio(tt, 3, 4.4), cx = 820, cy = 600, R = 420, ry = 0.42;
  const sector = (a0: number, a1: number, dy = 0) => `M${cx} ${cy + dy} L${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R * ry + dy} A${R} ${R * ry} 0 0 1 ${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R * ry + dy} Z`;
  const wx = 380 * lift, wy = -260 * lift;
  return <>
    <CShadow x={cx} y={cy + 260} w={1100} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}><defs><radialGradient id="pst" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#f0c078" /><stop offset=".6" stopColor="#c88a3a" /><stop offset="1" stopColor="#8a5a22" /></radialGradient></defs>
      <ellipse cx={cx} cy={cy + 70} rx={R + 70} ry={(R + 70) * ry} fill="#d8d4c8" /><ellipse cx={cx} cy={cy + 56} rx={R + 70} ry={(R + 70) * ry} fill="#f6f4ee" />
      <path d={`M${cx - R} ${cy} L${cx - R} ${cy + 70} A${R} ${R * ry} 0 0 0 ${cx + R} ${cy + 70} L${cx + R} ${cy} Z`} fill="#b8823a" />
      <path d={sector(-0.3, Math.PI * 2 - 0.9)} fill="url(#pst)" />{Array.from({ length: 6 }, (_, k) => { const a = -0.3 + k * 0.85; return <line key={k} x1={cx} y1={cy} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R * ry} stroke="#8a5a22" strokeWidth={6} />; })}
      <path d={`M${cx} ${cy} L${cx + Math.cos(-0.9) * R} ${cy + Math.sin(-0.9) * R * ry} L${cx + Math.cos(-0.9) * R} ${cy + Math.sin(-0.9) * R * ry + 70} L${cx} ${cy + 70} Z`} fill="#8a2a3a" opacity={lift > 0.05 ? 1 : 0} />
      <g transform={`translate(${wx} ${wy}) rotate(${-8 * lift} ${cx} ${cy})`} style={{ filter: "drop-shadow(18px 30px 20px rgba(0,0,0,.5))" }}>
        <path d={`M${cx} ${cy} L${cx + Math.cos(-0.9) * R} ${cy + Math.sin(-0.9) * R * ry} L${cx + Math.cos(-0.9) * R} ${cy + Math.sin(-0.9) * R * ry + 70} L${cx} ${cy + 70} Z`} fill="#9a2a3a" />
        <path d={`M${cx} ${cy + 70} L${cx + Math.cos(-0.3) * R} ${cy + Math.sin(-0.3) * R * ry + 70} L${cx + Math.cos(-0.3) * R} ${cy + Math.sin(-0.3) * R * ry} L${cx} ${cy} Z`} fill="#b83a4a" />
        <path d={sector(-0.9, -0.3)} fill="url(#pst)" />
        <text x={cx + 250} y={cy - 70} textAnchor="middle" fontFamily={HAND} fontSize={66} fill="#3a1a0a" transform={`rotate(-12 ${cx + 250} ${cy - 70})`}>nutria</text>
        <path d={`M${cx - 30} ${cy + 74} L${cx + 360} ${cy - 30} L${cx + 640} ${cy - 160}`} stroke="#c8ccd0" strokeWidth={22} strokeLinecap="round" /><path d={`M${cx + 360} ${cy - 30} L${cx + 640} ${cy - 160}`} stroke="#5a3a1e" strokeWidth={34} strokeLinecap="round" /></g>
      {cloth > 0 && <g transform={`translate(0 ${-500 * (1 - cloth)})`} opacity={cl(cloth * 3)}><defs><pattern id="gng" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><rect width="60" height="60" fill="#f3ece0" /><rect width="30" height="60" fill="rgba(179,34,26,.55)" /><rect width="60" height="30" fill="rgba(179,34,26,.55)" /></pattern></defs>
        <path d={`M${cx - R - 60} ${cy + 20} Q${cx - R} ${cy - 220} ${cx - 100} ${cy - 200} Q${cx + 60} ${cy - 240} ${cx + 110} ${cy - 120} Q${cx + 160} ${cy + 40} ${cx + R - 40} ${cy + 140} Q${cx} ${cy + 260} ${cx - R - 20} ${cy + 180} Z`} fill="url(#gng)" />
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M${cx - 300 + k * 110} ${cy - 150 + k * 10} Q${cx - 260 + k * 110} ${cy} ${cx - 320 + k * 120} ${cy + 180}`} stroke="rgba(0,0,0,.18)" strokeWidth={14} fill="none" />)}</g>}
    </svg>
  </>;
}} />;

// m3 · el retrato de frente: la nutria mira a cámara y sus incisivos naranjas se encienden con un anillo de luz; el globo grande gira hasta Sudamérica y cae el alfiler
export const HIncisors: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const up = eio(tt, 0, 1.4), gl = eio(tt, 1.6, 2.6), gt = eio(tt, 0.4, D(h) - 3), pin = pop(tt, D(h) - 2.6, 9, 0.35), fx = 1240, fy = 560 + 200 * (1 - up);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 780, bottom: 0, background: WATER, boxShadow: "inset 0 14px 20px rgba(255,255,255,.18)" }}>{Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 260 + tt * 40) % 1920, top: 30 + k * 30, width: 160, height: 5, background: "rgba(255,255,255,.3)" }} />)}</div>
    {Array.from({ length: 34 }, (_, k) => <div key={k} style={{ position: "absolute", left: 820 + (k * 37) % 1100, top: 800, width: 12, height: 200 + (k * 53) % 200, borderRadius: "50% 50% 0 0", background: k % 2 ? "#6a8a3a" : "#4a6a2a", transform: `translateY(-100%) rotate(${(k % 5 - 2) * 4 + 2 * Math.sin(tt + k)}deg)`, transformOrigin: "50% 100%" }} />)}
    <svg width={700} height={640} viewBox="-350 -320 700 640" style={{ position: "absolute", left: fx - 350, top: fy - 320, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.5))" }}><defs><radialGradient id="ncf" cx="45%" cy="35%" r="70%"><stop offset="0" stopColor="#b8926a" /><stop offset=".55" stopColor="#7a5636" /><stop offset="1" stopColor="#3a2414" /></radialGradient></defs>
      <ellipse cx={0} cy={60} rx={300} ry={250} fill="url(#ncf)" /><circle cx={-190} cy={-160} r={46} fill="#5a3a22" /><circle cx={190} cy={-160} r={46} fill="#5a3a22" /><ellipse cx={0} cy={-40} rx={230} ry={200} fill="url(#ncf)" />
      {Array.from({ length: 40 }, (_, k) => <path key={k} d={`M${-200 + (k % 10) * 44} ${-170 + Math.floor(k / 10) * 60} l6 -16`} stroke="rgba(255,230,190,.25)" strokeWidth={4} />)}
      {[-1, 1].map((k) => <g key={k}><circle cx={k * 100} cy={-80} r={30} fill="#0a0604" /><circle cx={k * 100 + 8} cy={-90} r={9} fill="#fff" /></g>)}
      <ellipse cx={0} cy={40} rx={110} ry={80} fill="#5a3a26" /><ellipse cx={-36} cy={20} rx={16} ry={12} fill="#1a0a04" /><ellipse cx={36} cy={20} rx={16} ry={12} fill="#1a0a04" />
      {[-1, 1].map((k) => [0, 1, 2].map((j) => <path key={k + "" + j} d={`M${k * 80} ${50 + j * 12} l${k * 200} ${(j - 1) * 30}`} stroke="#e8dcc8" strokeWidth={3} />))}
      <circle cx={0} cy={150} r={110 * gl} fill="none" stroke={`rgba(255,180,80,${0.8 * gl})`} strokeWidth={10} style={{ filter: "blur(2px)" }} />
      {[-1, 1].map((k) => <rect key={k} x={k * 34 - 30} y={100} width={58} height={100} rx={10} fill="#ff7a1a" style={{ filter: gl > 0 ? `drop-shadow(0 0 ${30 * gl}px #ffa040)` : undefined }} />)}<line x1={0} y1={100} x2={0} y2={200} stroke="#a84a0a" strokeWidth={6} /></svg>
    <CShadow x={420} y={900} w={420} />
    <div style={{ position: "absolute", left: 420, top: 900, transform: "translate(-50%,-100%)" }}><div style={{ width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#b8e0f0,#3a7aa8 60%,#1a3a5a)", overflow: "hidden", position: "relative", boxShadow: "0 24px 30px rgba(0,0,0,.5), inset -40px -30px 60px rgba(0,0,0,.4)" }}>
      {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: ((k * 160 - 900 * gt) % 960 + 960) % 960 - 240, top: 0, width: 4, height: 480, background: "rgba(255,255,255,.2)", borderRadius: "50%" }} />)}
      <svg width={1200} height={480} viewBox="0 0 1200 480" style={{ position: "absolute", left: 120 - 760 * gt, top: 0 }}><path d="M100 80 Q240 40 330 110 Q300 200 230 210 Q160 180 100 80 Z" fill="#7aa84a" /><path d="M760 200 Q860 180 900 260 Q880 360 830 460 Q800 410 790 340 Q740 280 760 200 Z" fill="#7aa84a" /><path d="M560 40 Q660 20 700 90 Q660 150 600 130 Z" fill="#7aa84a" /></svg></div>
      <div style={{ width: 40, height: 80, margin: "0 auto", background: "linear-gradient(90deg,#8a6a1a,#e8c060,#8a6a1a)" }} /><div style={{ width: 220, height: 30, margin: "0 auto", borderRadius: "50%", background: "linear-gradient(#e8c060,#8a6a1a)" }} />
      {pin > 0.01 && <svg width={60} height={140} viewBox="0 0 60 140" style={{ position: "absolute", left: 230, top: 260 - 120 * (1 - cl(pin)) }}><line x1={30} y1={40} x2={30} y2={130} stroke="#c8ccd0" strokeWidth={6} /><circle cx={30} cy={30} r={26} fill="#d8302a" /><circle cx={22} cy={22} r={8} fill="#ff9a8a" /></svg>}</div>
  </>;
}} />;

// m3-4 · el nido entre los juncos: asoman de a una tres crías grandes; en la estaca de madera de al lado se tallan las muescas (una por camada)
export const HLitterTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [0.2, 1.4, 2.6];
  return <>
    {Array.from({ length: 40 }, (_, k) => <div key={k} style={{ position: "absolute", left: 160 + (k * 37) % 1500, top: 880, width: 12, height: 300 + (k * 53) % 260, borderRadius: "50% 50% 0 0", background: k % 2 ? "#6a8a3a" : "#4a6a2a", transform: `translateY(-100%) rotate(${(k % 5 - 2) * 4 + 2 * Math.sin(tt + k)}deg)`, transformOrigin: "50% 100%" }} />)}
    <CShadow x={840} y={920} w={1100} />
    {P.map((a, k) => { const s = pop(tt, a, 7, 0.4); return s > 0.01 && <div key={k} style={{ position: "absolute", left: 560 + k * 270, top: 760 - 140 * cl(s) }}><Nutria3 x={0} y={0} s={0.85} r={-14 + k * 12} flip={k === 1} tt={tt + k} /></div>; })}
    <svg width={1100} height={360} viewBox="0 0 1100 360" style={{ position: "absolute", left: 290, top: 600 }}><defs><linearGradient id="ltn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8a85a" /><stop offset="1" stopColor="#6a5a2a" /></linearGradient></defs>
      <path d="M0 120 Q550 260 1100 120 L1040 300 Q550 380 60 300 Z" fill="url(#ltn)" />{Array.from({ length: 60 }, (_, k) => <path key={k} d={`M${20 + k * 18} ${150 + (k % 4) * 30} q${30} -${20 + (k % 3) * 10} ${60} ${(k % 2) * 10}`} stroke={k % 2 ? "#8a7a3a" : "#e0c878"} strokeWidth={5} fill="none" />)}</svg>
    <div style={{ position: "absolute", left: 1600, top: 140, width: 110, height: 820, background: "linear-gradient(90deg,#6a4626,#c8925a 45%,#6a4626)", boxShadow: "20px 20px 30px rgba(0,0,0,.5)", borderRadius: "50% 50% 8px 8px / 60px 60px 8px 8px" }}>
      {P.map((a, k) => { const c = eio(tt, a + 0.3, a + 0.9); return <React.Fragment key={k}><div style={{ position: "absolute", left: 0, top: 160 + k * 140, width: 110 * c, height: 34, background: "linear-gradient(#3a2410,#7a5a32)", clipPath: "polygon(0 0,100% 50%,0 100%)" }} />{c > 0 && c < 1 && Array.from({ length: 4 }, (_, j) => <div key={j} style={{ position: "absolute", left: 100 + j * 30 * c, top: 170 + k * 140 + j * 20 * c, width: 16, height: 8, background: "#e8c890" }} />)}</React.Fragment>; })}</div>
  </>;
}} />;

// m4-5 · el perchero de pie: el tapado de piel cae al gancho y lo hace tambalear; suben el cuello y el sombrero de a uno; todo con sombra
export const HCoatRack: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const I: [number, number, string][] = [[0.3, -1, "coat"], [2.2, 1, "collar"], [4, 0, "hat"]], wob = I.reduce((a, [at]) => a + (tt > at + 0.3 ? 5 * Math.sin((tt - at - 0.3) * 7) * Math.exp(-(tt - at - 0.3) * 1.6) : 0), 0);
  return <>
    <CShadow x={960} y={980} w={600} />
    <div style={{ position: "absolute", left: 960, top: 980, transform: `rotate(${wob}deg)`, transformOrigin: "50% 100%" }}><div style={{ position: "absolute", left: -250, top: -900 }}>
      <svg width={500} height={900} viewBox="0 0 500 900" style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.5))" }}><defs><linearGradient id="crk" x1="0" x2="1"><stop offset="0" stopColor="#4a2e16" /><stop offset=".5" stopColor="#c8925a" /><stop offset="1" stopColor="#4a2e16" /></linearGradient></defs>
        <rect x={232} y={40} width={36} height={820} fill="url(#crk)" /><path d="M250 860 L90 900 M250 860 L410 900 M250 860 L250 900" stroke="url(#crk)" strokeWidth={26} strokeLinecap="round" /><circle cx={250} cy={36} r={28} fill="#c8925a" />
        {[-1, 1].map((k) => <path key={k} d={`M250 120 Q${250 + 80 * k} 100 ${250 + 120 * k} 150`} stroke="url(#crk)" strokeWidth={18} fill="none" strokeLinecap="round" />)}</svg>
      {I.map(([a, side, k], i) => { const s = pop(tt, a, 6, 0.35), sw = 10 * Math.sin((tt - a) * 4) * Math.exp(-(tt - a) * 0.8); if (s <= 0.01) return null; const x = 250 + side * 120, y = k === "hat" ? 0 : 140;
        return <div key={i} style={{ position: "absolute", left: x, top: y - (1 - cl(s)) * 400, transform: `translate(-50%,${k === "hat" ? "-60%" : "0"}) rotate(${sw}deg)`, transformOrigin: "50% 0", filter: "drop-shadow(14px 22px 16px rgba(0,0,0,.5))" }}>
          {k === "coat" ? <svg width={400} height={680} viewBox="0 0 360 620"><defs><radialGradient id="crc" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#b8926a" /><stop offset=".6" stopColor="#6a4a2e" /><stop offset="1" stopColor="#3a2414" /></radialGradient></defs><path d="M180 0 L100 40 Q20 80 30 300 L10 620 L350 620 L330 300 Q340 80 260 40 Z" fill="url(#crc)" /><path d="M180 40 L180 620" stroke="rgba(0,0,0,.35)" strokeWidth={6} />{Array.from({ length: 90 }, (_, j) => <path key={j} d={`M${30 + (j % 10) * 31} ${60 + Math.floor(j / 10) * 62} q4 10 ${(j % 3) - 1} 22`} stroke={j % 2 ? "rgba(255,230,190,.3)" : "rgba(30,15,5,.35)"} strokeWidth={3} fill="none" />)}</svg>
            : k === "collar" ? <svg width={340} height={240} viewBox="0 0 300 220"><defs><radialGradient id="crl" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#c8a07a" /><stop offset="1" stopColor="#5a3a22" /></radialGradient></defs><path d="M150 10 Q40 20 20 120 Q60 200 150 120 Q240 200 280 120 Q260 20 150 10 Z" fill="url(#crl)" />{Array.from({ length: 30 }, (_, j) => <path key={j} d={`M${40 + (j % 10) * 22} ${40 + Math.floor(j / 10) * 34} l4 14`} stroke="rgba(255,230,190,.35)" strokeWidth={3} />)}<circle cx={150} cy={130} r={16} fill="#e8c040" /></svg>
              : <svg width={320} height={220} viewBox="0 0 260 200"><defs><radialGradient id="crh" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#a8825a" /><stop offset="1" stopColor="#3a2414" /></radialGradient></defs><ellipse cx={130} cy={170} rx={120} ry={26} fill="#4a2e16" /><path d="M50 170 Q50 40 130 30 Q210 40 210 170 Z" fill="url(#crh)" /><path d="M54 140 Q130 160 206 140" stroke="#c8202a" strokeWidth={14} fill="none" /></svg>}</div>; })}
    </div></div>
  </>;
}} />;

// m5 · el mapa de EE.UU. en cartón por capas: caen las cerquitas de corral con sombra que crece y se clavan con rebote; el contador de madera suma granjas
const US = "M60 80 L700 90 L900 140 L1060 170 L1180 190 L1330 140 L1400 110 L1380 200 L1300 300 L1260 380 L1200 480 L1140 580 L1160 700 L1120 740 L1080 640 L1000 610 L900 620 L760 600 L700 690 L640 720 L560 620 L450 610 L330 600 L200 560 L120 470 L70 330 L40 200 Z";
export const HPenMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const F = [[160, 300], [130, 160], [520, 500], [760, 560], [880, 300], [1000, 470], [1180, 300], [620, 250]], seg = (D(h) - 1.6) / F.length;
  const n = F.filter((_, i) => tt > 0.3 + i * seg + 0.4).length;
  return <>
    <CShadow x={960} y={960} w={1500} />
    <svg width={1460} height={800} viewBox="0 0 1460 800" style={{ position: "absolute", left: 220, top: 170, overflow: "visible" }}>
      {[3, 2, 1, 0].map((l) => <path key={l} d={US} transform={`translate(${l * 6} ${l * 14})`} fill={l ? ["", "#a8885a", "#8a6a42", "#6a4a2a"][l] : "#e0cf9e"} stroke={l ? "none" : "#7a6a42"} strokeWidth={5} />)}
      {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${200 + k * 150} 110 L${180 + k * 150} 600`} stroke="#9a8a5a" strokeWidth={3} strokeDasharray="12 10" />)}
      <path d="M200 560 L330 600 L450 610" stroke="#9a8a5a" strokeWidth={3} strokeDasharray="12 10" fill="none" /></svg>
    {F.map(([x, y], i) => { const a = 0.3 + i * seg, s = pop(tt, a, 9, 0.35), u = cl((tt - a + 0.6) / 0.6); return u > 0 && <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 220 + x - 80 * (0.4 + 0.6 * u), top: 170 + y + 40, width: 160 * (0.4 + 0.6 * u), height: 30 * (0.4 + 0.6 * u), borderRadius: "50%", background: `rgba(0,0,0,${0.15 + 0.35 * u})`, filter: "blur(5px)" }} />
      {s > 0.01 && <svg width={170} height={120} viewBox="0 0 140 100" style={{ position: "absolute", left: 220 + x - 85, top: 170 + y - 80 - (1 - cl(s)) * 300, transform: `scale(${1 + 0.1 * (1 - cl(s))},${1 - 0.1 * (1 - cl(s))})`, transformOrigin: "50% 100%", overflow: "visible", filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.45))" }}>{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={10 + k * 28} y={20} width={12} height={74} fill="#d8b078" stroke="#8a6238" strokeWidth={2} />)}<rect x={0} y={38} width={140} height={12} fill="#a87a4a" /><rect x={0} y={66} width={140} height={12} fill="#a87a4a" /></svg>}</React.Fragment>; })}
    <Odo x={1680} y={860} v={n} n={2} size={130} />
  </>;
}} />;

// m6 · la leyenda en la maqueta: lluvia y viento; la puerta del corral se abre de golpe sobre su bisagra y rebota; tres nutrias saltan afuera dejando huellas; vuela una rama
export const HHurricanePen: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#2a3440 0%,#4a5460 58%,#3a4a2a 60%,#1a2410 100%)" f={(tt) => {
  const g = pop(tt, 0.8, 6, 0.3), gate = 100 * g;
  return <>
    {Array.from({ length: 120 }, (_, k) => { const ph = (tt * (1.6 + rnd(k)) + rnd(k + 3)) % 1; return <div key={k} style={{ position: "absolute", left: rnd(k + 1) * 2200 - ph * 500, top: -100 + ph * 1100, width: 3, height: 60, background: "rgba(200,215,230,.45)", transform: "rotate(30deg)" }} />; })}
    <CShadow x={760} y={900} w={1000} />
    <div style={{ position: "absolute", left: 300, top: 480, width: 900, height: 420, background: "repeating-linear-gradient(45deg,rgba(200,205,210,.7) 0 4px,transparent 4px 34px), repeating-linear-gradient(-45deg,rgba(200,205,210,.7) 0 4px,transparent 4px 34px)", border: "14px solid #8a8e92", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />
    {[300, 750, 1200].map((x) => <div key={x} style={{ position: "absolute", left: x - 14, top: 440, width: 28, height: 480, background: "linear-gradient(90deg,#3a2410,#8a6238,#3a2410)" }} />)}
    <div style={{ position: "absolute", left: 1200, top: 480, width: 300, height: 420, transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-gate}deg)`, background: "repeating-linear-gradient(45deg,rgba(220,225,230,.85) 0 4px,transparent 4px 34px), repeating-linear-gradient(-45deg,rgba(220,225,230,.85) 0 4px,transparent 4px 34px)", border: "16px solid #a8acb0", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }}>
      {[0.2, 0.8].map((f) => <div key={f} style={{ position: "absolute", left: -26, top: `${f * 100}%`, width: 30, height: 40, background: "#5a5e62" }} />)}</div>
    {[0, 1, 2].map((k) => { const a = 1.4 + k * 0.7, u = cl((tt - a) / 2.2), x = 1000 + 900 * u, y = 820 - k * 50 - 160 * Math.abs(Math.sin(u * Math.PI * 3)); return tt > a - 0.6 && <React.Fragment key={k}>
      {Array.from({ length: Math.floor(u * 6) }, (_, j) => <div key={j} style={{ position: "absolute", left: 1040 + j * 150, top: 880 - k * 50, width: 30, height: 16, borderRadius: "50%", background: "rgba(20,15,5,.55)" }} />)}
      <Nutria3 x={u > 0 ? x : 900 - k * 120} y={u > 0 ? y : 820 - k * 50} s={0.8} r={u > 0 ? -10 * Math.cos(u * Math.PI * 6) : 0} tt={tt + k} /></React.Fragment>; })}
    {(() => { const u = cl((tt - 2) / 2.4); return u > 0 && u < 1 && <svg width={300} height={120} viewBox="0 0 300 120" style={{ position: "absolute", left: -200 + 2300 * u, top: 300 + 120 * Math.sin(u * 8), transform: `rotate(${u * 900}deg)` }}><path d="M10 60 L290 60 M120 60 L170 20 M200 60 L240 100 M80 60 L60 20" stroke="#5a3a1e" strokeWidth={12} strokeLinecap="round" /><ellipse cx={170} cy={20} rx={20} ry={10} fill="#5a7a2a" /><ellipse cx={240} cy={100} rx={20} ry={10} fill="#5a7a2a" /></svg>; })()}
    <div style={{ position: "absolute", left: 420, top: 740, transform: "translate(-50%,-100%) rotate(-5deg)" }}><div style={{ padding: "12px 34px", background: WOODTOP, boxShadow: "0 16px 22px rgba(0,0,0,.5)", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 88, color: "#2a170a", letterSpacing: 6 }}>LEGEND</div><div style={{ width: 18, height: 100, margin: "0 auto", background: "#5a3a1e" }} /></div>
  </>;
}} />;

// m6-7 · la máquina de escribir entera: el carro se corre letra a letra; cada frase de la leyenda se tipea, se tacha con XXX, y cae el sello rojo RECORD
export const HMythCheck: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = ["Third farm owner.", "Bought his first 20.", "Let some loose."], seg = (D(h) - 1.8) / 3, cur = Math.min(2, Math.floor(tt / seg)), ty = cl((tt - cur * seg) / (seg * 0.6)), car = -ty * 300 + 150, st = pop(tt, D(h) - 1.6, 9, 0.3);
  return <>
    <CShadow x={960} y={1000} w={1300} />
    <div style={{ position: "absolute", left: 960 + car, top: 80, width: 1040, height: 520, transform: "translate(-50%,0)", background: "linear-gradient(#fbf7ec,#ece2c8)", boxShadow: "0 20px 30px rgba(0,0,0,.45)", padding: "40px 60px", boxSizing: "border-box" }}>
      {L.map((l, i) => { const a = i * seg, tp = cl((tt - a) / (seg * 0.6)), x = eio(tt, a + seg * 0.7, a + seg * 0.95), n = Math.floor(l.length * tp);
        return <div key={i} style={{ position: "relative", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 70, color: "#1e1a14", marginBottom: 46, whiteSpace: "nowrap" }}>{l.slice(0, n)}{x > 0 && <span style={{ position: "absolute", left: 0, top: 0, color: "#b3221a" }}>{"X".repeat(Math.floor(l.length * x))}</span>}</div>; })}
      {st > 0.01 && <div style={{ position: "absolute", left: 600, top: 300, transform: `translate(-50%,-50%) rotate(-10deg) scale(${1.6 - 0.6 * cl(st)})`, opacity: cl(st * 2), padding: "10px 40px", border: `10px solid ${STAMP}`, borderRadius: 14, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 110, color: STAMP, mixBlendMode: "multiply" }}>RECORD</div>}</div>
    <div style={{ position: "absolute", left: 960 + car, top: 560, width: 1200, height: 80, transform: "translate(-50%,0)", borderRadius: 40, background: "linear-gradient(#5a5e62,#1a1c1e 50%,#3a3e42)", boxShadow: "0 12px 16px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: -60, top: 10, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(#c8ccd0,#4a4e52)" }} /><div style={{ position: "absolute", right: -60, top: 10, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(#c8ccd0,#4a4e52)" }} /></div>
    <svg width={1400} height={460} viewBox="0 0 1400 460" style={{ position: "absolute", left: 260, top: 620, filter: "drop-shadow(0 24px 24px rgba(0,0,0,.5))" }}><defs><linearGradient id="twb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4e52" /><stop offset="1" stopColor="#121416" /></linearGradient></defs>
      <path d="M120 0 L1280 0 L1400 420 L0 420 Z" fill="url(#twb)" /><path d="M120 0 L1280 0" stroke="rgba(255,255,255,.25)" strokeWidth={6} />
      {Array.from({ length: 36 }, (_, k) => { const r = Math.floor(k / 12), c = k % 12, x = 220 + c * 82 + r * 30, y = 120 + r * 90, down = Math.floor(tt * 12) % 36 === k && ty > 0 && ty < 1; return <g key={k}><line x1={x} y1={y + 30} x2={x - 20} y2={y + 70} stroke="#2a2a2a" strokeWidth={10} /><circle cx={x} cy={y + (down ? 8 : 0)} r={30} fill="#f3f0e6" stroke="#2a2a2a" strokeWidth={6} /></g>; })}
      <rect x={480} y={390} width={440} height={26} rx={12} fill="#f3f0e6" /></svg>
  </>;
}} />;

// m7 · muchas manos: tres jaulas grandes; de a una llega una mano distinta (guante de cuero, manga de franela, reloj) y sube el pestillo; la puerta cae y sale la nutria
export const HManyHands: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 3, seg = (D(h) - 1) / N;
  return <>
    <Box x={960} y={1000} w={1800} h={80} d={300} rx={-24} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {Array.from({ length: N }, (_, i) => { const x = 380 + i * 580, a = 0.2 + i * seg, hd = eio(tt, a, a + seg * 0.3) * (1 - eio(tt, a + seg * 0.7, a + seg * 0.95)), lt = eio(tt, a + seg * 0.3, a + seg * 0.45), op = pop(tt, a + seg * 0.45, 7, 0.35), out = cl((tt - a - seg * 0.55) / 1.4);
      return <React.Fragment key={i}>
        <CShadow x={x} y={930} w={460} />
        <div style={{ position: "absolute", left: x, top: 930, width: 420, height: 380, transform: "translate(-50%,-100%)", background: "repeating-linear-gradient(90deg,rgba(190,195,200,.85) 0 5px,transparent 5px 30px), repeating-linear-gradient(0deg,rgba(190,195,200,.85) 0 5px,transparent 5px 30px)", border: "10px solid #8a8e92", boxShadow: "0 14px 20px rgba(0,0,0,.4)" }} />
        {out < 1 && <Nutria3 x={x + 400 * out} y={850} s={0.75} tt={tt} />}
        <div style={{ position: "absolute", left: x - 210, top: 550, width: 420, height: 380, transformOrigin: "50% 100%", transform: `perspective(900px) rotateX(${-80 * cl(op)}deg)`, background: "repeating-linear-gradient(90deg,rgba(210,215,220,.9) 0 5px,transparent 5px 30px)", border: "10px solid #a8acb0" }} />
        <div style={{ position: "absolute", left: x + 140, top: 560 - 60 * lt, width: 60, height: 26, background: "linear-gradient(#e8c060,#8a6a1a)", borderRadius: 6, boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />
        {hd > 0.01 && <Mano x={x + 170} y={570 - 60 * lt - 500 * (1 - hd)} s={1} r={-60} glove={i === 0} sleeve={["#5a3a1a", "#a83a2a", "#3a4a6a"][i]}
          wrist={i === 2 ? <><rect x={-60} y={-30} width={120} height={60} rx={10} fill="#3a2a1a" /><circle r={36} fill="#e8e4d8" stroke="#c8a040" strokeWidth={8} /><line x1={0} y1={0} x2={0} y2={-24} stroke="#1a1a1a" strokeWidth={4} /></> : i === 1 ? <>{Array.from({ length: 5 }, (_, j) => <line key={j} x1={-80} y1={-60 + j * 30} x2={80} y2={-60 + j * 30} stroke="rgba(30,10,5,.6)" strokeWidth={8} />)}</> : undefined} />}
      </React.Fragment>; })}
  </>;
}} />;

// m8 · la zanja del jacinto: las flores violetas tapan el agua; la nutria grande llega nadando, muerde una flor, la flor se hunde y quedan anillos en el agua
export const HHyacinthDitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 22, bite = D(h) - 3.4, sw = eio(tt, 0.2, bite), sink = eio(tt, bite + 0.2, bite + 1.4), chomp = Math.max(0, Math.sin((tt - bite) * 14)) * (tt > bite && tt < bite + 0.8 ? 1 : 0);
  return <>
    <div style={{ position: "absolute", left: 960, top: 760, width: 2100, height: 560, transform: "translate(-50%,-50%) perspective(1200px) rotateX(58deg)", background: "linear-gradient(#5a8a8a,#1a3a3a)", boxShadow: "inset 0 20px 30px rgba(255,255,255,.18)" }} />
    {Array.from({ length: N }, (_, i) => { const s = pop(tt, 0.1 + i * 0.12, 8, 0.5), x = 120 + (i * 151) % 1700, y = 600 + ((i * 89) % 320), hero = i === 7; if (s <= 0.01) return null; const dn = hero ? sink : 0;
      return <React.Fragment key={i}><svg width={240} height={200} viewBox="0 0 200 170" style={{ position: "absolute", left: (hero ? 1100 : x) - 120, top: (hero ? 760 : y) - 140 + 80 * dn, transform: `scale(${s * (0.8 + (y - 600) / 800) * (1 - 0.6 * dn)})`, opacity: 1 - dn, overflow: "visible", filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.4))" }}>
        {[-1, 0, 1].map((k) => <ellipse key={k} cx={100 + k * 46} cy={130} rx={44} ry={26} fill="#3a9a3a" transform={`rotate(${k * 20} ${100 + k * 46} 130)`} />)}{[-1, 1].map((k) => <ellipse key={"g" + k} cx={100 + k * 30} cy={122} rx={18} ry={6} fill="rgba(255,255,255,.35)" />)}<path d="M100 120 L100 40" stroke="#4a7a2a" strokeWidth={8} />
        {Array.from({ length: 7 }, (_, k) => <circle key={k} cx={100 + Math.cos(k * 0.9) * 24} cy={14 + k * 9} r={19} fill={k % 2 ? "#9a6ad8" : "#c09af8"} />)}<circle cx={100} cy={22} r={8} fill="#f0d040" /></svg>
        {hero && sink > 0 && [0, 1, 2].map((r) => { const q = cl((tt - bite - 0.3 - r * 0.3) / 1.4); return q > 0 && q < 1 && <div key={r} style={{ position: "absolute", left: 1100 - 200 * q, top: 790 - 50 * q, width: 400 * q, height: 100 * q, borderRadius: "50%", border: "5px solid rgba(220,240,240,.7)", opacity: 1 - q }} />; })}</React.Fragment>; })}
    <Nutria3 x={-200 + 1120 * sw} y={800 - 20 * chomp} s={1.3} r={-6 * chomp} tt={tt} swim />
  </>;
}} />;

// m8-9 · el muelle: la red de la grúa envuelve tres cajones; baja con golpe sobre la cubierta del barco y cae el sello rojo gigante en la tapa
export const HCrateShip: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const dn = eio(tt, 0.2, 3), thud = pop(tt, 3, 9, 0.3), sw = Math.sin(tt * 2.2) * 5 * (1 - dn), st = pop(tt, 4.2, 9, 0.3), cx = 1060, cy = 160 + 380 * dn;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: WATER }}>{Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 260 + tt * 40) % 1920, top: 30 + (k % 3) * 40, width: 160, height: 5, background: "rgba(255,255,255,.3)" }} />)}</div>
    <svg width={1500} height={420} viewBox="0 0 1500 420" style={{ position: "absolute", left: 300, top: 620, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.5))" }}><path d="M0 140 L1500 140 L1380 360 L100 360 Z" fill="#3a4a5a" /><rect x={0} y={120} width={1500} height={30} fill="#b3221a" /><rect x={1160} y={0} width={260} height={120} fill="#e8e4d8" />{[1190, 1260, 1330].map((x) => <rect key={x} x={x} y={30} width={50} height={36} fill="#5a7a9a" />)}</svg>
    <div style={{ position: "absolute", left: cx, top: -20, width: 6, height: cy + 40, background: "#2a2a2a", transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: cx, top: cy + 20 * (1 - cl(thud)) * 0, transform: `translate(-50%,0) rotate(${sw}deg) scale(${1 + 0.04 * Math.sin(Math.PI * cl(thud))},${1 - 0.04 * Math.sin(Math.PI * cl(thud))})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "relative", width: 620, height: 600 }}>
        {[[0, 300], [310, 300], [155, 0]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y + 20, width: 300, height: 280, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.14) 0 4px,transparent 4px 56px), linear-gradient(#d8b07a,#8a6238)", boxShadow: "0 12px 16px rgba(0,0,0,.45), inset 0 0 0 12px rgba(90,58,30,.6)" }}>
          {i === 2 && st > 0.01 && <div style={{ position: "absolute", left: 150, top: 140, transform: `translate(-50%,-50%) rotate(-8deg) scale(${1.8 - 0.8 * cl(st)})`, opacity: cl(st * 2), padding: "6px 14px", border: `8px solid ${STAMP}`, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 52, lineHeight: 1, color: STAMP, textAlign: "center", mixBlendMode: "multiply" }}>WEED<br />EATERS</div>}</div>)}
        <svg width={640} height={640} viewBox="0 0 640 640" style={{ position: "absolute", left: -10, top: -20 }}>{Array.from({ length: 9 }, (_, k) => <path key={k} d={`M320 0 L${k * 80} 620`} stroke="rgba(40,30,20,.75)" strokeWidth={6} />)}{Array.from({ length: 5 }, (_, k) => <path key={"h" + k} d={`M${160 - k * 34} ${120 + k * 120} Q320 ${150 + k * 120} ${480 + k * 34} ${120 + k * 120}`} stroke="rgba(40,30,20,.75)" strokeWidth={6} fill="none" />)}</svg></div></div>
    {thud > 0.01 && thud < 1.2 && Array.from({ length: 6 }, (_, k) => <Puff key={k} x={cx - 300 + k * 120} y={cy + 600 - 40 * cl(thud)} r={40 + 50 * cl(thud)} col="rgba(200,190,170,.8)" o={1 - cl(tt - 3)} />)}
  </>;
}} />;

// m9-10 · la cosecha por década: fardos de pieles con pelo, atados, caen con peso y se apilan; la pila de los 70 desborda y la aguja de la balanza marca el pico
export const HHarvestBars: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Dc: [string, number][] = [["1940s", 2], ["1950s", 4], ["1960s", 6], ["1970s", 9]], seg = (D(h) - 2) / 4, pk = eio(tt, 0.3 + 3 * seg + 1, 0.3 + 3 * seg + 1.8);
  return <>
    <Box x={960} y={1010} w={1700} h={80} d={340} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {Dc.map(([d, n], i) => { const x = 320 + i * 400; return <React.Fragment key={i}>
      {Array.from({ length: n }, (_, k) => { const f = fall(tt, 0.3 + i * seg + k * 0.12); if (f.s <= 0.01) return null; const top = k === 8 ? 1 : 0; return <div key={k} style={{ position: "absolute", left: x + (top ? 40 * pk : 0), top: 940 - k * 78 + f.y + (top ? 30 * pk : 0), width: 300, height: 76, transform: `translate(-50%,-100%) rotate(${(k % 2 ? 2 : -2) + (top ? 18 * pk : 0)}deg)`, borderRadius: 34, background: "radial-gradient(ellipse at 40% 30%,#b88a5a,#5a3a22 70%)", boxShadow: "0 8px 10px rgba(0,0,0,.45), inset 0 -8px 0 rgba(0,0,0,.25)", overflow: "hidden" }}>
        {Array.from({ length: 14 }, (_, j) => <div key={j} style={{ position: "absolute", left: 14 + j * 20, top: 8 + (j % 3) * 14, width: 3, height: 18, background: "rgba(255,230,190,.35)", transform: "rotate(20deg)" }} />)}{[0.3, 0.7].map((f2) => <div key={f2} style={{ position: "absolute", left: `${f2 * 100}%`, top: 0, bottom: 0, width: 10, background: "#c8a870" }} />)}</div>; })}
      <div style={{ position: "absolute", left: x, top: 975, transform: "translate(-50%,-50%)", padding: "2px 22px", background: "linear-gradient(120deg,#8a6a2a,#e8c870 50%,#8a6a2a)", borderRadius: 6, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 56, color: "#2a1a0a", opacity: cl((tt - 0.3 - i * seg) * 3), boxShadow: "0 8px 10px rgba(0,0,0,.4)" }}>{d}</div></React.Fragment>; })}
    <svg width={260} height={260} viewBox="0 0 340 340" style={{ position: "absolute", left: 1640, top: 80, filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))" }}><circle cx={170} cy={170} r={160} fill="#e8e0c8" stroke="#8a6a2a" strokeWidth={18} /><path d="M60 110 A130 130 0 0 1 280 110" stroke="#c8202a" strokeWidth={14} fill="none" opacity={0.5} />
      <line x1={170} y1={170} x2={170 + Math.cos((-200 + 180 * eio(tt, 0.3, 0.3 + 3 * seg + 1.6)) * Math.PI / 180) * 130} y2={170 + Math.sin((-200 + 180 * eio(tt, 0.3, 0.3 + 3 * seg + 1.6)) * Math.PI / 180) * 130} stroke="#c8202a" strokeWidth={10} strokeLinecap="round" /><circle cx={170} cy={170} r={16} fill="#3a2a1a" /></svg>
  </>;
}} />;

// m10-11 · el campamento sobre pilotes: la casilla de madera en la marisma con su piragua atada; sale humo de la chimenea y pasa una garza
export const HStiltCamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8a880 0%,#e8d8b8 46%,#6a8a6a 48%,#2a4a42 100%)" f={(tt) => {
  const hx = 2100 - 2400 * eio(tt, 1, D(h) - 1);
  return <>
    {Array.from({ length: 50 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 41) % 1920, top: 530 + (k % 4) * 10, width: 12, height: 70 + (k % 5) * 20, borderRadius: "50% 50% 0 0", background: "#4a6a2a", transform: "translateY(-100%)" }} />)}
    {[0, 1, 2].map((k) => { const ph = (tt * 0.25 + k / 3) % 1; return <Puff key={k} x={1080 + 40 * ph + 20 * Math.sin(ph * 6)} y={220 - ph * 200} r={50 + ph * 70} col="rgba(220,220,215,.6)" o={1 - ph} />; })}
    <svg width={760} height={720} viewBox="0 0 760 720" style={{ position: "absolute", left: 600, top: 180, filter: "drop-shadow(18px 26px 20px rgba(0,0,0,.45))" }}><defs><linearGradient id="scw" x1="0" x2="1"><stop offset="0" stopColor="#8a6a42" /><stop offset=".5" stopColor="#b8946a" /><stop offset="1" stopColor="#6a4a2a" /></linearGradient></defs>
      {[100, 260, 500, 660].map((x) => <rect key={x} x={x} y={360} width={22} height={360} fill="#4a3220" />)}<rect x={60} y={360} width={640} height={24} fill="#5a3a22" />
      <rect x={100} y={150} width={560} height={210} fill="url(#scw)" />{Array.from({ length: 18 }, (_, k) => <line key={k} x1={100 + k * 31} y1={150} x2={100 + k * 31} y2={360} stroke="rgba(0,0,0,.2)" strokeWidth={3} />)}
      <path d="M60 160 L380 30 L700 160 Z" fill="#6a6e72" /><rect x={460} y={0} width={40} height={90} fill="#3a3a3a" /><rect x={160} y={210} width={90} height={80} fill="#e8c070" style={{ filter: `drop-shadow(0 0 ${14 + 6 * Math.sin(tt * 3)}px #ffc860)` }} /><rect x={340} y={230} width={90} height={130} fill="#3a2410" /></svg>
    <svg width={500} height={120} viewBox="0 0 500 120" style={{ position: "absolute", left: 640, top: 820, transform: `rotate(${2 * Math.sin(tt * 1.5)}deg)` }}><path d="M0 40 Q250 110 500 40 L470 80 Q250 120 30 80 Z" fill="#8a6238" /><path d="M480 50 L560 -60" stroke="#c8b07a" strokeWidth={4} /></svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: "rgba(42,74,66,.6)" }} />
    <svg width={340} height={180} viewBox="0 0 260 140" style={{ position: "absolute", left: hx, top: 120 + 20 * Math.sin(tt) }}><path d={`M60 70 Q130 ${30 + 40 * Math.sin(tt * 5)} 220 70 Q130 80 60 70 Z`} fill="#e8eef2" /><path d="M60 70 L0 60" stroke="#e8eef2" strokeWidth={8} /><path d="M200 74 L260 90" stroke="#3a3a3a" strokeWidth={4} /></svg>
  </>;
}} />;

// m11 · el aro de chapitas colgado de un clavo: cada chapa de latón cae, se enhebra con rebote y hace hamacar el aro; la última se agranda con su número
export const HTrapCount: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 12, seg = (D(h) - 2.2) / N, n = Math.min(N, Math.floor(tt / seg) + 1), last = pop(tt, D(h) - 1.8, 8, 0.35);
  const swing = Array.from({ length: n }, (_, i) => { const d = tt - i * seg; return d > 0 ? 6 * Math.sin(d * 5) * Math.exp(-d * 1.2) : 0; }).reduce((a, b) => a + b, 0);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "repeating-linear-gradient(90deg,#6a5a42 0 6px,#8a7a5a 6px 180px)", boxShadow: "inset 0 0 120px rgba(0,0,0,.6)" }}><Grain id="tcw" o={0.3} f={0.5} /></div>
    <div style={{ position: "absolute", left: 950, top: 90, width: 20, height: 60, background: "linear-gradient(90deg,#5a5e62,#c8ccd0,#4a4e52)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 960, top: 120, transform: `rotate(${swing}deg)`, transformOrigin: "0 0" }}>
      <svg width={800} height={800} viewBox="-400 -40 800 800" style={{ position: "absolute", left: -400, top: -40, overflow: "visible", filter: "drop-shadow(16px 24px 12px rgba(0,0,0,.5))" }}><defs><linearGradient id="tcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8e0a0" /><stop offset=".5" stopColor="#c8a040" /><stop offset="1" stopColor="#7a5a1a" /></linearGradient></defs>
        <circle cx={0} cy={340} r={300} fill="none" stroke="#9aa0a6" strokeWidth={16} /><circle cx={0} cy={340} r={300} fill="none" stroke="#e8ecef" strokeWidth={4} strokeDasharray="20 40" />
        {Array.from({ length: n }, (_, i) => { const a = (150 - i * (300 / N)) * Math.PI / 180, f = i === n - 1 ? pop(tt, i * seg, 9, 0.35) : 1, x = Math.cos(a) * 300, y = 340 + Math.sin(a) * 300 - (1 - cl(f)) * 400, sw = 8 * Math.sin(tt * 3 + i);
          return f > 0.01 && <g key={i} transform={`translate(${x} ${y}) rotate(${sw})`}><circle cx={0} cy={0} r={14} fill="none" stroke="#9aa0a6" strokeWidth={6} /><rect x={-44} y={12} width={88} height={64} rx={10} fill="url(#tcg)" /><text x={0} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#3a2a0a">{i + 1}</text></g>; })}</svg></div>
    {last > 0.01 && <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${cl(last)}) rotate(-4deg)`, width: 340, height: 250, borderRadius: 26, background: "linear-gradient(135deg,#f8e0a0,#c8a040 50%,#7a5a1a)", boxShadow: "0 30px 40px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 170, color: "#3a2a0a" }}><div style={{ position: "absolute", top: 18, width: 40, height: 40, borderRadius: "50%", border: "8px solid #7a5a1a" }} />{N}</div>}
  </>;
}} />;

// m12 · las hormas: un travesaño con cuatro hormas de madera y su piel con pelo, que se hamacan; la mano de un chico raspa con la cuchilla curva y cae la viruta
export const HStretchBoards: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 4, cur = Math.min(N - 1, Math.floor((tt - 0.6) / ((D(h) - 1) / N))), sc = (tt * 1.6) % 1, kx = 360 + Math.max(0, cur) * 400;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "repeating-linear-gradient(90deg,#6a5a42 0 6px,#8a7a5a 6px 180px)", boxShadow: "inset 0 0 120px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 140, top: 90, width: 1640, height: 50, background: "linear-gradient(#a87a4a,#5a3a1e)", boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} />
    {Array.from({ length: N }, (_, i) => { const s = pop(tt, 0.1 + i * 0.3, 7, 0.35), x = 360 + i * 400, sw = 4 * Math.sin(tt * 1.6 + i); if (s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: x, top: 130 - (1 - cl(s)) * 300, transform: `translate(-50%,0) rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
        <svg width={280} height={820} viewBox="0 0 220 640" style={{ filter: "drop-shadow(18px 26px 14px rgba(0,0,0,.5))" }}><defs><linearGradient id={"sb" + i} x1="0" x2="1"><stop offset="0" stopColor="#c8a070" /><stop offset=".5" stopColor="#e8c890" /><stop offset="1" stopColor="#a87a4a" /></linearGradient><radialGradient id={"sp" + i} cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#b88a5a" /><stop offset=".6" stopColor="#6a4a2e" /><stop offset="1" stopColor="#3a2414" /></radialGradient></defs>
          <rect x={100} y={0} width={20} height={40} fill="#5a3a1e" /><path d="M80 30 L140 30 L200 620 L20 620 Z" fill={`url(#sb${i})`} /><path d="M110 70 Q46 150 46 330 Q56 500 110 560 Q164 500 174 330 Q174 150 110 70 Z" fill={`url(#sp${i})`} />
          {Array.from({ length: 30 }, (_, k) => <path key={k} d={`M${66 + (k % 5) * 20} ${120 + Math.floor(k / 5) * 70} l5 16`} stroke="rgba(255,230,190,.3)" strokeWidth={3} />)}</svg></div>; })}
    {cur >= 0 && <><Mano x={kx + 40 * Math.sin(sc * Math.PI * 2)} y={420 + 200 * sc} s={1.1} r={-30} skin="#e0b090" sleeve="#4a6a9a"><path d="M-60 -30 Q20 -80 90 -10" stroke="#c8ccd0" strokeWidth={14} fill="none" strokeLinecap="round" /><rect x={-90} y={-46} width={50} height={26} rx={8} fill="#5a3a1e" /></Mano>
      {Array.from({ length: 6 }, (_, k) => { const q = ((tt * 1.6 + k / 6) % 1); return <div key={k} style={{ position: "absolute", left: kx - 40 + k * 14, top: 500 + q * 480, width: 20, height: 8, background: "#e8d0a8", transform: `rotate(${q * 400 + k * 30}deg)`, opacity: 1 - q }} />; })}</>}
  </>;
}} />;

// m13 · el subibaja: la nutria grande cae desde arriba con aplaste y rebote, la tabla se hunde y las tres ratas almizcleras salen volando en arco de a una
export const HSeesawMusk: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const T0 = 1.2, land = eio(tt, T0, T0 + 0.25), ang = -14 + 28 * land, sq = tt > T0 ? Math.exp(-(tt - T0) * 5) * Math.sin((tt - T0) * 20) : 0;
  return <>
    <CShadow x={960} y={940} w={1500} />
    <svg width={300} height={260} viewBox="0 0 300 260" style={{ position: "absolute", left: 810, top: 700 }}><defs><linearGradient id="ssw" x1="0" x2="1"><stop offset="0" stopColor="#6a4626" /><stop offset=".5" stopColor="#a87a4a" /><stop offset="1" stopColor="#4a2e16" /></linearGradient></defs><path d="M150 20 L40 240 L260 240 Z" fill="url(#ssw)" /></svg>
    <div style={{ position: "absolute", left: 960, top: 720, width: 1400, height: 44, transform: `translate(-50%,-50%) rotate(${ang}deg)`, background: WOODTOP, boxShadow: "0 14px 0 #6a4626, 0 26px 20px rgba(0,0,0,.5)" }} />
    {(() => { const a = ang / 57.3, ex = 960 - 620 * Math.cos(a), ey = 720 - 620 * Math.sin(a), dropY = tt < T0 ? -560 * (1 - Math.pow(tt / T0, 2)) : 0; return <div style={{ position: "absolute", left: ex, top: ey - 110 + dropY, transform: `scale(${1 + 0.25 * sq},${1 - 0.25 * sq})`, transformOrigin: "50% 100%" }}><Nutria3 x={0} y={0} s={1.3} tt={tt * 0.3} /></div>; })()}
    {[0, 1, 2].map((k) => { const a = ang / 57.3, fly = Math.max(0, tt - T0 - 0.15 - k * 0.45), bx = 960 + (480 + k * 70) * Math.cos(a), by = 720 + (480 + k * 70) * Math.sin(a) - 60, x = bx + fly * (260 + k * 120), y = by - fly * 1100 + fly * fly * 560;
      return y < 1200 && <svg key={k} width={220} height={124} viewBox="0 0 160 90" style={{ position: "absolute", left: x - 110, top: y - 62, transform: `rotate(${fly * (220 + k * 60)}deg)`, filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.45))" }}><defs><radialGradient id="msr" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#a8825a" /><stop offset="1" stopColor="#4a3220" /></radialGradient></defs><ellipse cx={80} cy={50} rx={50} ry={30} fill="url(#msr)" /><path d="M30 50 Q0 50 -14 84" stroke="#3a2a1a" strokeWidth={8} fill="none" /><circle cx={124} cy={40} r={22} fill="url(#msr)" /><circle cx={132} cy={34} r={4} fill="#000" /><circle cx={112} cy={22} r={7} fill="#6a4a2e" /></svg>; })}
  </>;
}} />;

// m14 · el cartel colgante de dos cadenas, con canto: dice UNDO; una ráfaga (hojas que cruzan) lo hace girar mostrando el canto; oscila y se asienta en ADAPT
export const HAdaptSign: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = pop(tt, 0.6, 5, 0.32), r = 180 * p, gust = cl((tt - 0.3) / 1.6);
  return <>
    <div style={{ position: "absolute", left: 360, top: 100, width: 1200, height: 40, background: "linear-gradient(#8a6238,#3a2410)", boxShadow: "0 14px 20px rgba(0,0,0,.5)" }} />
    {[700, 1220].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 140, width: 12, height: 180, background: "repeating-linear-gradient(#c8ccd0 0 14px,#5a5e62 14px 20px)", borderRadius: 4 }} />)}
    <div style={{ position: "absolute", left: 960, top: 940, width: 820 * Math.abs(Math.cos(r * Math.PI / 180)) + 60, height: 40, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(10px)" }} />
    <div style={{ position: "absolute", left: 960, top: 320, width: 820, height: 400, transform: `translate(-50%,0) perspective(1600px) rotateY(${r}deg)`, transformStyle: "preserve-3d" }}>
      {[0, 180].map((ry) => <div key={ry} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: `rotateY(${ry}deg) translateZ(22px)`, background: WOODTOP, boxShadow: "inset 0 0 0 16px #6a4626, inset 0 0 60px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 200, color: ry ? "#1a5a2a" : "#8a1a12", letterSpacing: 10 }}>{ry ? "ADAPT" : "UNDO"}</div>)}
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: k ? 820 - 22 : -22, top: 0, width: 44, height: 400, background: "linear-gradient(90deg,#5a3a1e,#8a6238,#5a3a1e)", transform: `rotateY(90deg)`, transformOrigin: "50% 50%" }} />)}</div>
    {Array.from({ length: 12 }, (_, k) => { const q = gust * 1.4 - k * 0.06; return q > 0 && q < 1 && <div key={k} style={{ position: "absolute", left: -100 + 2200 * q, top: 260 + rnd(k) * 520 + 60 * Math.sin(q * 9 + k), width: 40, height: 22, borderRadius: "50% 0", background: k % 2 ? "#a8802a" : "#6a8a2a", transform: `rotate(${q * 900 + k * 40}deg)` }} />; })}
  </>;
}} />;

// m14-15 · el barril de roble: por la manguera de arriba entran nutrias, por la canilla de abajo salen en tropel; el tubo de vidrio muestra el nivel parado en la raya; al cerrar la canilla, el nivel trepa
export const HCheckValve: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const cut = D(h) - 4, shut = eio(tt, cut, cut + 0.5), lvl = 0.5 + 0.03 * Math.sin(tt * 2) + 0.35 * eio(tt, cut + 0.3, D(h) - 0.6), bx = 860, top = 260, H_ = 640;
  return <>
    <CShadow x={bx} y={top + H_ + 20} w={760} />
    <div style={{ position: "absolute", left: bx, top, width: 560, height: H_, transform: "translateX(-50%)", borderRadius: "70px / 40px", background: "repeating-linear-gradient(90deg,#8a5a30 0 64px,#5a3a1e 64px 68px), #8a5a30", boxShadow: "inset -60px 0 70px rgba(0,0,0,.55), inset 50px 0 50px rgba(255,220,170,.18), 0 30px 40px rgba(0,0,0,.4)" }}>
      {[0.12, 0.5, 0.88].map((f) => <div key={f} style={{ position: "absolute", left: -6, right: -6, top: `${f * 100}%`, height: 30, borderRadius: 8, background: "linear-gradient(#8a8e92,#2a2e32)" }} />)}<Grain id="cvb" o={0.35} f={0.5} /></div>
    <div style={{ position: "absolute", left: bx, top: top - 40, width: 560, height: 90, transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(#7a4a26,#3a2410)", border: "10px solid #5a5e62" }} />
    <div style={{ position: "absolute", left: bx + 300, top: top + 60, width: 56, height: H_ - 120, borderRadius: 28, border: "6px solid rgba(220,235,240,.8)", background: "rgba(20,30,30,.5)", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(#8ab08a,#3a6a4a)" }} /></div>
    <div style={{ position: "absolute", left: bx + 290, top: top + 60 + (H_ - 120) * 0.5, width: 80, height: 10, background: "#f3e6c6", boxShadow: "0 2px 4px #000" }} />
    <svg width={900} height={420} viewBox="0 0 900 420" style={{ position: "absolute", left: 60, top: -40, overflow: "visible" }}><path d="M0 100 Q500 40 760 230 L800 320" stroke="#2a5a2a" strokeWidth={70} fill="none" /><path d="M0 84 Q500 24 760 214" stroke="rgba(255,255,255,.18)" strokeWidth={12} fill="none" /></svg>
    {[0, 1, 2].map((k) => { const ph = (tt * 0.7 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 100 + ph * 760, top: 40 + 160 * ph * ph + 60 * ph }}><Nutria3 x={0} y={0} s={0.42} r={20 + 40 * ph} tt={tt} /></div>; })}
    <svg width={300} height={240} viewBox="0 0 300 240" style={{ position: "absolute", left: bx + 230, top: top + H_ - 200, filter: "drop-shadow(10px 14px 10px rgba(0,0,0,.5))" }}><rect x={0} y={50} width={180} height={60} rx={8} fill="#c8a040" /><rect x={0} y={50} width={180} height={18} fill="#f0d070" /><g transform={`rotate(${90 * (1 - shut)} 110 36)`}><rect x={60} y={24} width={110} height={26} rx={12} fill="#b3221a" /></g><rect x={160} y={80} width={50} height={80} fill="#a88030" /></svg>
    {Array.from({ length: 4 }, (_, k) => { const ph = (tt * 0.8 + k / 4) % 1; return (1 - shut) > 0.3 && <div key={k} style={{ position: "absolute", left: bx + 440 + ph * 600, top: top + H_ - 60 + 200 * ph * ph }}><Nutria3 x={0} y={0} s={0.42} r={30 * ph} tt={tt + k} /></div>; })}
  </>;
}} />;

export const HCD2: Record<string, React.FC<{ t: number; h: H }>> = {
  trapLine: HTrapLine, peltBoard: HPeltBoard, marshHoles: HMarshHoles, tailTag: HTailTag, pieSlice: HPieSlice, incisors: HIncisors, litterTree: HLitterTree,
  coatRack: HCoatRack, penMap: HPenMap, hurricanePen: HHurricanePen, mythCheck: HMythCheck, manyHands: HManyHands, hyacinthDitch: HHyacinthDitch,
  crateShip: HCrateShip, harvestBars: HHarvestBars, stiltCamp: HStiltCamp, trapCount: HTrapCount, stretchBoards: HStretchBoards, seesawMusk: HSeesawMusk,
  adaptSign: HAdaptSign, checkValve: HCheckValve,
  ...HCD3,
};
