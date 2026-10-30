// ruth29d · 3ª vuelta (29-oct, notas del evaluador d1): cada pieza = UN objeto grande, entero en cuadro, con volumen, sombra de contacto
// y UNA acción física que arranca en el primer segundo. Sin rótulos chicos ni esquinas: la palabra vive dentro del objeto. Helpers compartidos con ruth_d2.
import React from "react";
import { H, Mode, Stage, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK, STAMP } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, WOOD, WOODTOP, WOODSIDE, Mano, Odo, Splash } from "./obj";

export const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode; bg?: string }> = ({ t, h, f, bg }) => <Stage t={t} h={h} bg={bg} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
export const D = (h: H) => Math.max(4, h.out - h.at);
export const fall = (tt: number, at: number) => { const s = pop(tt, at, 9, 0.38); return { s, y: (1 - s) * -520, k: cl(s) }; };
export const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
export const WATER = "linear-gradient(#5a7a6a,#2a4a42)", MARSH = "#6a8a3a";
export const Puff: React.FC<{ x: number; y: number; r: number; col?: string; o?: number }> = ({ x, y, r, col = "rgba(240,240,232,.9)", o = 1 }) =>
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 42% 36%, ${col}, transparent 68%)`, opacity: cl(o), filter: `blur(${r * 0.12}px)` }} />;
export const Tag: React.FC<{ x: number; y: number; txt: string; s?: number; size?: number; r?: number; tt?: number }> = ({ x, y, txt, s = 1, size = 66, r = 0, tt = 0 }) => s <= 0.01 ? null :
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) rotate(${r + 3 * Math.sin(tt * 2 + x)}deg) scale(${s})`, transformOrigin: "50% 0" }}>
    <div style={{ width: 3, height: 44, margin: "0 auto", background: "#8a7a5a" }} />
    <div style={{ padding: "12px 34px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: size, color: INK, boxShadow: "0 16px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap", clipPath: "polygon(8% 0,92% 0,100% 20%,100% 100%,0 100%,0 20%)" }}>{txt}</div>
  </div>;
// nutria 3D de perfil (mira a la derecha): pelaje con volumen, cola de rata, incisivos naranjas
export const Nutria3: React.FC<{ x: number; y: number; s?: number; r?: number; tt?: number; o?: number; flip?: boolean; swim?: boolean; glow?: number }> = ({ x, y, s = 1, r = 0, tt = 0, o = 1, flip, swim, glow = 0 }) => {
  const w = Math.sin(tt * 9) * 6, id = "nu" + Math.round(x) + "_" + Math.round(y);
  return <svg width={420} height={220} viewBox="-210 -110 420 220" style={{ position: "absolute", left: x - 210, top: y - 110, transform: `rotate(${r}deg) scale(${flip ? -s : s},${s})`, opacity: o, overflow: "visible" }}>
    <defs><radialGradient id={id} cx="40%" cy="25%" r="80%"><stop offset="0" stopColor="#b08a62" /><stop offset=".45" stopColor="#6a4a2e" /><stop offset="1" stopColor="#2a1a0e" /></radialGradient></defs>
    {!swim && <ellipse cx={0} cy={72} rx={170} ry={14} fill="rgba(0,0,0,.35)" />}
    <path d={`M-110 30 Q-170 ${40 + w} -205 ${70 + w}`} stroke="#4a3a32" strokeWidth={14} fill="none" strokeLinecap="round" />
    {!swim && [-60, 50].map((lx, i) => <path key={i} d={`M${lx} 40 l${(i ? w : -w)} 30`} stroke="#3a2a1e" strokeWidth={14} strokeLinecap="round" />)}
    <ellipse cx={-20} cy={0} rx={110} ry={62} fill={`url(#${id})`} /><ellipse cx={90} cy={-10} rx={56} ry={44} fill={`url(#${id})`} />
    {Array.from({ length: 16 }, (_, k) => <path key={k} d={`M${-110 + k * 13} ${-40 + (k % 3) * 18} l6 -10`} stroke="rgba(255,230,190,.25)" strokeWidth={3} />)}
    <circle cx={70} cy={-50} r={12} fill="#4a3424" /><circle cx={108} cy={-24} r={7} fill="#0a0604" /><circle cx={110} cy={-26} r={2} fill="#fff" />
    {glow > 0 && <circle cx={108} cy={-24} r={7 + 10 * glow} fill={`rgba(255,220,120,${0.8 * glow})`} style={{ filter: `blur(${4 * glow}px)` }} />}
    <ellipse cx={142} cy={-2} rx={10} ry={8} fill="#2a1a10" />{[-1, 1].map((k) => <path key={k} d={`M140 4 l40 ${k * 10}`} stroke="#e8dcc8" strokeWidth={2} />)}
    <rect x={126} y={6} width={14} height={20} rx={3} fill="#ff7a1a" /><line x1={133} y1={6} x2={133} y2={26} stroke="#c85a0a" strokeWidth={2} />
    {swim && <path d="M-200 30 Q-100 18 0 30 T200 30" stroke="rgba(200,230,230,.7)" strokeWidth={6} fill="none" />}
  </svg>;
};
// cola suelta de nutria (para las recompensas): gruesa, escamada, con pelo en la base
export const Tail: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) =>
  <svg width={260} height={60} viewBox="0 0 260 60" style={{ position: "absolute", left: x - 130, top: y - 30, transform: `rotate(${r}deg) scale(${s})`, overflow: "visible", filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.45))" }}>
    <defs><linearGradient id="tlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a6a60" /><stop offset=".45" stopColor="#5a4a42" /><stop offset="1" stopColor="#2a201c" /></linearGradient></defs>
    <path d="M10 18 Q120 6 252 28 Q120 52 10 44 Z" fill="url(#tlg)" />{Array.from({ length: 16 }, (_, k) => <path key={k} d={`M${30 + k * 14} ${16 + k * 0.6} q4 ${14 - k * 0.4} 0 ${26 - k * 1.1}`} stroke="#2e2420" strokeWidth={2} fill="none" />)}
    {Array.from({ length: 12 }, (_, k) => <path key={"f" + k} d={`M${4 + (k % 4) * 6} ${16 + k * 2.6} l-14 ${(k % 3) - 1}`} stroke="#6a4a2e" strokeWidth={3} />)}<ellipse cx={16} cy={31} rx={12} ry={15} fill="#8a6a5a" /></svg>;

// mano con manga (la punta de los dedos queda en x,y; r gira alrededor de la punta). children se dibuja en la punta (tiza, esponja…)
export { Mano, Odo, Splash } from "./obj";
const Pelt: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) =>
  <svg width={300} height={380} viewBox="0 0 300 380" style={{ position: "absolute", left: x - 150, top: y - 380, transform: `rotate(${r}deg) scale(${s})`, transformOrigin: "50% 100%", overflow: "visible", filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))" }}>
    <defs><radialGradient id="plt" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#b88a5a" /><stop offset=".5" stopColor="#6a4a2e" /><stop offset="1" stopColor="#2a1a0e" /></radialGradient></defs>
    <path d="M150 10 Q60 40 56 130 Q40 250 80 330 Q150 380 220 330 Q260 250 244 130 Q240 40 150 10 Z" fill="url(#plt)" />
    {Array.from({ length: 40 }, (_, k) => <path key={k} d={`M${80 + (k % 8) * 20} ${50 + Math.floor(k / 8) * 60} l${4 + (k % 3)} 22`} stroke="rgba(255,230,190,.28)" strokeWidth={3} />)}
    {[[70, 120], [230, 120], [80, 300], [220, 300]].map(([a, b], k) => <path key={"p" + k} d={`M${a} ${b} l${a < 150 ? -30 : 30} ${k < 2 ? -10 : 20}`} stroke="#4a3220" strokeWidth={22} strokeLinecap="round" />)}
  </svg>;

// m15 · el pizarrón del acopiador: la mano escribe el precio con tiza (polvo), la esponja lo borra dejando estela húmeda; la piel de al lado se achica con cada precio
export const HPriceTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = ["$8", "$4", "$2", "$1"], seg = (D(h) - 0.6) / 4, i = Math.min(3, Math.floor(tt / seg)), ph = (tt - i * seg) / seg, wr = eio(ph, 0.02, 0.42), wipe = i < 3 ? eio(ph, 0.66, 0.96) : 0;
  const BX = 780, BY = 500, tx0 = BX - 300 + 600 * wr, ty0 = BY + 30 * Math.sin(wr * 18);
  const sx = BX - 420 + 840 * wipe, sy = BY + 70 * Math.sin(wipe * 16), pel = 1 - 0.14 * (i + eio(ph, 0, 0.3) * 0) ;
  return <>
    <CShadow x={BX} y={900} w={1150} o={0.5} />
    <div style={{ position: "absolute", left: BX, top: BY, width: 1060, height: 680, transform: "translate(-50%,-50%) perspective(1800px) rotateY(6deg)", background: "#1e2a24", border: "28px solid #6a4a2c", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 0 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <Grain id="ptb" o={0.25} f={0.7} blend="screen" />
      {wipe > 0 && <div style={{ position: "absolute", left: 0, top: 130, width: 840 * wipe + 100, height: 360, background: "linear-gradient(90deg,rgba(10,16,12,.55),rgba(10,16,12,.25))", filter: "blur(8px)" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: MARK, fontSize: 340, color: "#f3f0e6", clipPath: `inset(0 ${100 - wr * 100}% 0 0)`, WebkitMaskImage: wipe > 0 ? `linear-gradient(90deg, transparent ${wipe * 100}%, #000 ${wipe * 100 + 8}%)` : undefined, textShadow: "0 0 6px rgba(255,255,255,.4)" }}>{P[i]}</div>
      {P.slice(0, i).map((p, k) => <div key={k} style={{ position: "absolute", left: 80 + k * 190, bottom: 30, fontFamily: HAND, fontSize: 84, color: "rgba(243,240,230,.35)", textDecoration: "line-through" }}>{p}</div>)}</div>
    {wr > 0 && wr < 1 && Array.from({ length: 6 }, (_, k) => { const q = ((tt * 3 + k / 6) % 1); return <Puff key={k} x={tx0 + (k - 3) * 10} y={ty0 + 40 + q * 260} r={10 + q * 14} o={0.7 * (1 - q)} />; })}
    {wr < 1 && ph < 0.5 && <Mano x={tx0} y={ty0} s={1.15} r={-8}><rect x={-14} y={-50} width={26} height={90} rx={6} fill="#f6f2e6" transform="rotate(-40)" /></Mano>}
    {wipe > 0 && wipe < 1 && <Mano x={sx} y={sy} s={1.1} r={-14}><rect x={-120} y={-70} width={220} height={120} rx={22} fill="#e2b84a" stroke="#a8801a" strokeWidth={6} transform="rotate(-12)" />{Array.from({ length: 10 }, (_, k) => <circle key={k} cx={-90 + (k % 5) * 40} cy={-40 + Math.floor(k / 5) * 50} r={7} fill="#b88a20" />)}</Mano>}
    <CShadow x={1580} y={930} w={420} />
    <Pelt x={1580} y={930} s={pel * 1.15} r={4 * Math.sin(tt * 1.4)} />
  </>;
}} />;

// m15-16 · el bidón rojo se vuelca en el motor fuera de borda (cuerpo, embudo, eje, hélice que gira); el nivel de la mirilla cae debajo de la raya de «una piel»
export const HGasCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tilt = eio(tt, 0.3, 1.3) * (1 - eio(tt, D(h) - 1.6, D(h) - 0.6)), lvl = 1 - 0.78 * eio(tt, 1.3, D(h) - 2), pour = tilt > 0.85 && lvl > 0.24, rot = tt * 30;
  return <>
    <div style={{ position: "absolute", left: 1330, top: 290, width: 90, height: 520, background: WOOD, boxShadow: "16px 20px 30px rgba(0,0,0,.5)" }} />
    <CShadow x={1120} y={960} w={560} o={0.4} />
    <svg width={520} height={720} viewBox="0 0 520 720" style={{ position: "absolute", left: 880, top: 280, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id="gco" x1="0" x2="1"><stop offset="0" stopColor="#1a1e22" /><stop offset=".35" stopColor="#5a6066" /><stop offset=".55" stopColor="#9aa0a6" /><stop offset="1" stopColor="#22262a" /></linearGradient>
        <linearGradient id="gcs" x1="0" x2="1"><stop offset="0" stopColor="#2a2e32" /><stop offset=".5" stopColor="#7a7e82" /><stop offset="1" stopColor="#1a1e22" /></linearGradient></defs>
      <path d="M40 120 Q40 40 140 30 L360 30 Q440 40 450 120 L450 280 Q440 320 380 330 L100 330 Q40 320 40 280 Z" fill="url(#gco)" />
      <path d="M60 180 L430 180" stroke="#c8202a" strokeWidth={22} /><path d="M70 70 Q200 50 330 62" stroke="rgba(255,255,255,.35)" strokeWidth={12} fill="none" strokeLinecap="round" />
      <rect x={100} y={6} width={60} height={30} rx={6} fill="#3a3e42" /><path d="M70 -60 L190 -60 L148 6 L112 6 Z" fill="#c8a040" stroke="#7a5a1a" strokeWidth={4} />
      <rect x={200} y={330} width={70} height={250} fill="url(#gcs)" /><rect x={150} y={540} width={170} height={16} rx={6} fill="#3a3e42" />
      <path d="M200 580 L270 580 L290 640 Q235 676 180 640 Z" fill="url(#gcs)" /><path d="M222 650 L240 712 L258 650" fill="#2a2e32" />
      <g transform={`translate(235 640)`}>{[0, 120, 240].map((a) => <ellipse key={a} cx={0} cy={0} rx={18} ry={66 * Math.abs(Math.cos(((rot + a) * Math.PI) / 180)) + 8} fill="#b8bcc0" stroke="#5a5e62" strokeWidth={3} />)}<circle r={16} fill="#5a5e62" /></g>
      <rect x={430} y={60} width={80} height={60} rx={10} fill="#4a4e52" /></svg>
    <div style={{ position: "absolute", left: 640, top: 420, width: 360, height: 440, transform: `translate(-50%,-50%) rotate(${tilt * 70}deg)`, transformOrigin: "90% 20%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "linear-gradient(90deg,#7a120c,#e04a3a 38%,#ff8a7a 46%,#b82a1a 60%,#7a120c)", boxShadow: "0 24px 30px rgba(0,0,0,.55)" }} />
      <div style={{ position: "absolute", left: 30, top: 30, right: 30, height: 40, borderRadius: 12, border: "8px solid #8a1a10" }} />
      <div style={{ position: "absolute", left: 250, top: -70, width: 54, height: 100, background: "linear-gradient(90deg,#8a6a20,#f0c860,#8a6a20)", borderRadius: 10, transform: "rotate(30deg)" }} />
      <div style={{ position: "absolute", left: 60, top: 90, width: 90, height: 310, borderRadius: 14, background: "rgba(20,10,4,.85)", overflow: "hidden", border: "6px solid #d8dce0" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(90deg,#c89a20,#ffe080,#c89a20)" }} /></div>
      <div style={{ position: "absolute", left: 36, top: 90 + 310 * 0.5, width: 140, height: 10, background: "#fff", boxShadow: "0 2px 4px #000" }} />
      <div style={{ position: "absolute", left: 180, top: 90 + 310 * 0.5 - 70 }}><Pelt x={50} y={130} s={0.4} /></div></div>
    {pour && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M873 206 Q${960 + 6 * Math.sin(tt * 8)} 200 1000 ${250}`} stroke="rgba(255,214,90,.9)" strokeWidth={26} fill="none" strokeLinecap="round" /><path d="M873 200 Q955 192 996 246" stroke="rgba(255,255,230,.7)" strokeWidth={6} fill="none" />
      {Array.from({ length: 6 }, (_, k) => { const q = (tt * 2 + k / 6) % 1; return <circle key={k} cx={990 + 30 * (k % 3 - 1) * q} cy={240 + q * 60} r={8} fill="rgba(255,214,90,.85)" opacity={1 - q} />; })}</svg>}
  </>;
}} />;

// m16-17 · el «eat-out» en corte: el bloque de marisma con raíces; las nutrias comen las raíces de abajo, queda barro pelado y la marea se lo lleva
export const HEatOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const eat = eio(tt, 0.6, 5), wash = eio(tt, 6.4, D(h) - 1);
  return <>
    <CShadow x={960} y={960} w={1700} />
    <div style={{ position: "absolute", left: 160, top: 760 - 60 * wash, width: 1600, height: 240 + 60 * wash, background: WATER, opacity: 0.85, boxShadow: "inset 0 10px 20px rgba(255,255,255,.2)" }} />
    <div style={{ position: "absolute", left: 260, top: 480, width: 1400 * (1 - 0.65 * wash), height: 440, overflow: "hidden" }}>
      <svg width={1400} height={440} viewBox="0 0 1400 440" style={{ position: "absolute", inset: 0 }}><rect y={120} width={1400} height={320} fill="#3a2a1a" />
        {Array.from({ length: 120 }, (_, k) => { const x = k * 11.8, gone = x < 1400 * eat; return <g key={k}><path d={`M${x} 120 q${(k % 5 - 2) * 4} -60 ${(k % 7 - 3) * 6} -${70 + (k * 13) % 50}`} stroke={gone ? "#8a7a4a" : MARSH} strokeWidth={5} fill="none" opacity={gone ? 0.15 : 1} />
          {!gone && <path d={`M${x} 120 q${(k % 3 - 1) * 10} 80 ${(k % 5 - 2) * 8} ${120 + (k * 17) % 120}`} stroke="#d8c8a0" strokeWidth={3} fill="none" opacity={0.85} />}</g>; })}</svg><Grain id="eog" o={0.4} f={1} /></div>
    {[0, 1, 2].map((k) => <Nutria3 key={k} x={260 + 1400 * eat - k * 190} y={760 - (k % 2) * 30} s={0.55} tt={tt + k} />)}
    {wash > 0 && Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 260 + 1400 * (1 - 0.65 * wash) + k * 40 + 200 * wash, top: 700 + k * 30, width: 60, height: 20, borderRadius: 10, background: "#3a2a1a", opacity: 1 - wash }} />)}
    <Tag x={1560} y={260} txt="eat-out" s={pop(tt, 4.6, 7, 0.5)} size={72} tt={tt} />
  </>;
}} />;

// m17-18 · la ventanilla de bronce del avión de reconocimiento recorre la marisma; agranda cada zona rota y el lápiz rojo baja y la tacha
export const HAerialGrid: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const B = [[420, 380], [760, 640], [1080, 420], [1380, 660], [1560, 360]], seg = (D(h) - 0.8) / B.length, i = Math.min(B.length - 1, Math.floor(tt / seg)), ph = (tt - i * seg) / seg;
  const [px, py] = i ? B[i - 1] : [220, 520], m = eio(ph, 0, 0.32), lx = px + (B[i][0] - px) * m, ly = py + (B[i][1] - py) * m;
  const map = (k: string) => <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
    <div style={{ position: "absolute", left: 110, top: 160, width: 1700, height: 800, background: "radial-gradient(ellipse at 30% 30%,#8aa85a,#5a7a2a 60%,#4a6a24)", borderRadius: 24 }}><Grain id={"agm" + k} o={0.45} f={0.5} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M110 820 Q500 700 800 820 T1810 760" stroke="#3a6a7a" strokeWidth={30} fill="none" />{B.map(([x, y], j) => <path key={j} d={`M${x - 70} ${y} q20 -60 80 -50 q60 10 50 60 q-10 50 -70 46 q-70 -6 -60 -56 Z`} fill="#2a4a52" stroke="#6a8a6a" strokeWidth={6} />)}</svg></div>;
  return <>
    <div style={{ position: "absolute", inset: 0, filter: "saturate(.8) brightness(.8)" }}>{map("a")}</div>
    {B.map(([x, y], j) => { const p = j < i ? 1 : j === i ? eio(ph, 0.5, 0.85) : 0; return p > 0 && <svg key={j} width={200} height={200} viewBox="0 0 200 200" style={{ position: "absolute", left: x - 100, top: y - 100 }}><path d="M30 30 L170 170" stroke="#d81a20" strokeWidth={16} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - cl(p * 2))} /><path d="M170 30 L30 170" stroke="#d81a20" strokeWidth={16} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - cl(p * 2 - 1))} /></svg>; })}
    <div style={{ position: "absolute", left: lx - 230, top: ly - 180, width: 460, height: 360, borderRadius: 150, overflow: "hidden", boxShadow: "0 0 0 26px #a8803a, 0 0 0 34px #6a4a1a, 0 30px 50px 30px rgba(0,0,0,.55), inset 0 0 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 230 - lx * 1.7, top: 180 - ly * 1.7, width: 1920, height: 1080, transform: "scale(1.7)", transformOrigin: "0 0" }}>{map("b")}</div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg,rgba(255,255,255,.35),transparent 35%)" }} /></div>
    {(() => { const dn = eio(ph, 0.36, 0.5) * (1 - eio(ph, 0.86, 1)), dr = eio(ph, 0.5, 0.85); return <svg width={140} height={700} viewBox="0 0 140 700" style={{ position: "absolute", left: B[i][0] - 70 + 60 * Math.sin(dr * Math.PI * 2), top: B[i][1] - 690 - 500 * (1 - dn) + 40 * dr, transform: "rotate(28deg)", transformOrigin: "70px 690px", filter: "drop-shadow(16px 20px 12px rgba(0,0,0,.5))" }}>
      <rect x={34} y={0} width={72} height={560} fill="#c8201a" /><rect x={34} y={0} width={24} height={560} fill="#e84a3a" /><path d="M34 560 L106 560 L70 690 Z" fill="#e8c890" /><path d="M58 646 L82 646 L70 690 Z" fill="#c8201a" /><rect x={30} y={0} width={80} height={40} fill="#c8a040" /></svg>; })()}
  </>;
}} />;

// m18 · la ventanilla de pago: una cola gruesa entra por la ranura de la reja de bronce; la mano con guante empuja el billete hacia afuera; el contador de latón gira
export const HTailBounty: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 6, seg = (D(h) - 1) / N, i = Math.min(N - 1, Math.floor(tt / seg)), ph = (tt - i * seg) / seg, u = eio(ph, 0, 0.45), b = eio(ph, 0.45, 0.85), cnt = i + eio(ph, 0.4, 0.55);
  return <>
    <Box x={960} y={1040} w={1800} h={200} d={300} rx={-26} ry={0} front={WOOD} top="linear-gradient(#c8a070,#8a6238)" side={WOODSIDE} />
    <div style={{ position: "absolute", left: 960, top: 90, width: 980, height: 720, transform: "translate(-50%,0)", background: "linear-gradient(#5a4026,#3a2816)", boxShadow: "inset 0 0 50px rgba(0,0,0,.6), 0 30px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 120, right: 120, top: 200, bottom: 140, background: "radial-gradient(#3a2a1a,#140c06)" }} />
      {Array.from({ length: 13 }, (_, k) => <div key={k} style={{ position: "absolute", left: 130 + k * 56, top: 200, bottom: 140, width: 12, background: "linear-gradient(90deg,#8a6a1a,#f0d070,#8a6a1a)", boxShadow: "6px 0 8px rgba(0,0,0,.5)" }} />)}
      <div style={{ position: "absolute", left: 260, right: 260, bottom: 70, height: 70, background: "#0a0604", borderRadius: 8, boxShadow: "inset 0 10px 14px #000" }} /></div>
    <Odo x={960} y={190} v={cnt} n={3} size={200} />
    {i < N && u < 1 && <Tail x={300 + 600 * u} y={930 - 40 * u} s={3.5} r={-3} />}
    {b > 0 && <><div style={{ position: "absolute", left: 960 - 120 + 40 * b, top: 880 + 80 * b, width: 380, height: 170, transform: `translate(-50%,-50%) rotate(${-6 + 10 * b}deg) scale(${0.7 + 0.5 * b})`, background: "linear-gradient(160deg,#d8e8c0,#8aa878)", border: "6px solid #4a6a3a", boxShadow: "0 20px 24px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 90, color: "#2a3a1a", opacity: 1 - eio(ph, 0.9, 1) }}>$5</div>
      <Mano x={960 + 60 * b} y={830 + 40 * b} s={1.1} r={150} glove /></>}
  </>;
}} />;

// m19 · el daño se cierra: matas de junco crecen desde la orilla y cierran el agua como una cremallera; la plaqueta rueda de 80,000 a 6,000 y frena con golpe
export const HAcresFall: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 0.2, D(h) - 1.2), R = 1 - 0.94 * c, n = Math.round(80000 - 74000 * c), thud = pop(tt, D(h) - 1.2, 9, 0.3), cx = 860, cy = 640;
  const T = Array.from({ length: 70 }, (_, k) => { const rr = 1 - Math.floor(k / 14) * 0.2, a = (k % 14) / 14 * Math.PI * 2 + rr * 3; return { rr, x: cx + Math.cos(a) * 640 * rr * 0.92, y: cy + Math.sin(a) * 250 * rr * 0.92, k }; }).sort((p, q) => p.y - q.y);
  return <>
    <CShadow x={cx} y={940} w={1500} />
    <div style={{ position: "absolute", left: cx - 760, top: cy - 300, width: 1520, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse,#7a9a3a,#5a7a2a 70%,#3a2a1a 71%,#2a1e10)", boxShadow: "0 40px 0 #3a2a1a, 0 70px 50px rgba(0,0,0,.6)" }}><Grain id="acg" o={0.5} f={0.6} /></div>
    <div style={{ position: "absolute", left: cx - 640 * R, top: cy - 250 * R, width: 1280 * R, height: 500 * R, borderRadius: "48% 52% 50% 46%", background: "radial-gradient(#2a4a52,#3a5a62 60%,#5a6a4a)", boxShadow: "inset 0 10px 30px rgba(0,0,0,.6), inset 0 -6px 12px rgba(255,255,255,.2)" }} />
    {T.map((p) => { const g = cl((p.rr - R) * 6 + 0.2); return g > 0.02 && <svg key={p.k} width={120} height={150} viewBox="0 0 120 150" style={{ position: "absolute", left: p.x - 60, top: p.y - 140 * g, transform: `scale(${0.6 + 0.4 * (p.y - cy + 250) / 500})`, transformOrigin: "50% 100%", overflow: "visible" }}>
      {Array.from({ length: 7 }, (_, j) => <path key={j} d={`M60 150 Q${60 + (j - 3) * 10} ${150 - 70 * g} ${60 + (j - 3) * 22 + 6 * Math.sin(tt * 2 + j)} ${150 - 140 * g}`} stroke={j % 2 ? "#5a8a2a" : "#8ab84a"} strokeWidth={8} fill="none" strokeLinecap="round" />)}</svg>; })}
    <div style={{ position: "absolute", left: 1620, top: 300 + 10 * (1 - cl(thud)) * Math.sin(tt * 40), transform: `translate(-50%,-50%) rotate(4deg) scale(${1 + 0.06 * Math.sin(Math.PI * cl(thud))})`, padding: "26px 40px", background: "linear-gradient(120deg,#8a6a2a,#e8c870 50%,#8a6a2a)", boxShadow: "0 22px 30px rgba(0,0,0,.55)", textAlign: "center", fontFamily: "Georgia, serif", color: "#2a1a0a", borderRadius: 10 }}>
      <div style={{ fontWeight: 900, fontSize: 110, lineHeight: 1 }}>{n.toLocaleString("en-US")}</div><div style={{ fontSize: 56, fontWeight: 900 }}>ACRES</div></div>
  </>;
}} />;

// m19-20 · la lata de recetas: la mano saca la ficha «Nutria»; la cuchara de madera entera baja al guiso humeante, revuelve, sube… y se aparta
export const HRecipeCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const card = eio(tt, 0.2, 1.6), dip = eio(tt, 2.2, 3.2) * (1 - eio(tt, D(h) - 2.4, D(h) - 1.2)), away = eio(tt, D(h) - 1.4, D(h) - 0.3), stir = Math.sin(tt * 3) * dip;
  const spX = 1360 + 30 * stir + 300 * away, spY = 120 + 300 * dip - 200 * away;
  return <>
    <CShadow x={460} y={940} w={560} />
    <Box x={460} y={940} w={460} h={240} d={320} rx={-20} ry={14} front="linear-gradient(90deg,#3a6a7a,#7ab0b8 40%,#3a6a7a)" top="linear-gradient(#2a3a3a,#1a2424)" side="#2a4a52">
      {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 30 + k * 70, top: 60 + (k % 2) * 60, width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(#f3c8d8 30%,#d86a8a 32%,#d86a8a 50%,transparent 52%)" }} />)}</Box>
    <div style={{ position: "absolute", left: 460, top: 520, width: 460, height: 60, transform: "translate(-50%,-50%) rotateX(60deg) translateY(-160px) rotateX(-70deg)", background: "linear-gradient(90deg,#3a6a7a,#7ab0b8,#3a6a7a)" }} />
    <div style={{ position: "absolute", left: 460 + 120 * card, top: 700 - 420 * card, transform: `translate(-50%,-50%) rotate(${-4 + 8 * card}deg) scale(${0.7 + 0.3 * card})`, width: 600, height: 380, background: "repeating-linear-gradient(transparent 0 66px,#9ab8d8 66px 69px), linear-gradient(#fbf7ec,#efe6cf)", boxShadow: "0 22px 30px rgba(0,0,0,.5)", padding: "20px 40px", boxSizing: "border-box", fontFamily: HAND, color: "#23324f" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 4, background: "#c8202a" }} /><div style={{ fontSize: 96, lineHeight: 1 }}>Nutria</div><div style={{ fontSize: 66, marginTop: 50 }}>cook it like rabbit</div></div>
    {card < 1 && <Mano x={460 + 120 * card + 40} y={560 - 420 * card} s={1} r={-30} />}
    <CShadow x={1360} y={950} w={640} />
    <svg width={640} height={470} viewBox="0 0 640 470" style={{ position: "absolute", left: 1040, top: 480 }}><ellipse cx={320} cy={110} rx={250} ry={50} fill="#1a1a1a" /><ellipse cx={320} cy={118} rx={226} ry={40} fill="#6a3a1a" />{[0, 1, 2].map((k) => <circle key={k} cx={220 + k * 100 + 10 * Math.sin(tt * 2 + k)} cy={118} r={16} fill="#a8602a" />)}</svg>
    <svg width={140} height={640} viewBox="0 0 140 640" style={{ position: "absolute", left: spX - 70, top: spY, transform: `rotate(${-14 + 10 * stir}deg)`, transformOrigin: "70px 560px", filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.45))" }}><rect x={58} y={0} width={24} height={480} rx={10} fill="#c89a62" /><rect x={58} y={0} width={8} height={480} fill="#e8c08a" /><ellipse cx={70} cy={540} rx={56} ry={86} fill="#b88a52" /></svg>
    <svg width={640} height={470} viewBox="0 0 640 470" style={{ position: "absolute", left: 1040, top: 480, filter: "drop-shadow(16px 24px 16px rgba(0,0,0,.5))" }}><defs><linearGradient id="rcp" x1="0" x2="1"><stop offset="0" stopColor="#1a1a1a" /><stop offset=".45" stopColor="#5a5a5a" /><stop offset="1" stopColor="#1a1a1a" /></linearGradient></defs><path d="M70 118 Q320 178 570 118 L540 440 Q320 480 100 440 Z" fill="url(#rcp)" /><rect x={0} y={150} width={80} height={24} rx={12} fill="#2a2a2a" /><rect x={560} y={150} width={80} height={24} rx={12} fill="#2a2a2a" /></svg>
    {Array.from({ length: 4 }, (_, k) => { const ph = (tt * 0.5 + k / 4) % 1; return <Puff key={k} x={1260 + k * 60 + 30 * Math.sin(ph * 6 + k)} y={560 - ph * 380} r={40 + ph * 60} o={0.45 * (1 - ph)} />; })}
  </>;
}} />;

// m20-21 · el rompecabezas de madera de Luisiana (la bota): las piezas de la costa se caen al agua con salpicadura; la pieza «Delaware» entra entera y tapa el hueco
const LA = "M40 20 L560 20 L548 120 L520 230 L500 330 L790 330 L780 400 L730 470 L760 520 L820 600 L780 640 L700 610 L640 640 L560 600 L500 650 L420 610 L320 630 L200 600 L60 600 L70 480 L40 360 Z";
export const HDelawareOverlay: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const G = [] as { c: number; r: number; o: number }[]; for (let r = 0; r < 7; r++) for (let c = 0; c < 9; c++) G.push({ c, r, o: r >= 5 ? (r - 5) * 9 + c : -1 });
  const fallAt = (o: number) => 0.4 + o * ((D(h) - 5.2) / 18), del = eio(tt, D(h) - 3.6, D(h) - 1.8), dl = pop(tt, D(h) - 1.8, 9, 0.35);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "linear-gradient(#3a6a7a,#123040)", boxShadow: "inset 0 20px 30px rgba(255,255,255,.12)" }}>{Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 260 + tt * 40) % 1920, top: 20 + (k % 3) * 40, width: 140, height: 6, borderRadius: 3, background: "rgba(255,255,255,.3)" }} />)}</div>
    <CShadow x={760} y={800} w={1000} />
    <svg width={900} height={700} viewBox="0 0 900 700" style={{ position: "absolute", left: 320, top: 120, overflow: "visible" }}>
      <defs><clipPath id="laclip"><path d={LA} /></clipPath><linearGradient id="lawd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8c890" /><stop offset="1" stopColor="#b8905a" /></linearGradient></defs>
      <path d={LA} fill="#3a2a1a" transform="translate(10 22)" /><path d={LA} fill="#1a120a" />
      {G.map((p, k) => { const a = p.o >= 0 ? fallAt(p.o) : 99, d = Math.max(0, tt - a), y = d * d * 900, s = d > 0 ? cl(d / 1.1) : 0; if (s >= 1) return null;
        return <g key={k} transform={`translate(${(p.c - 4) * 30 * s} ${y}) rotate(${d * 60 * (k % 2 ? 1 : -1)} ${p.c * 100 + 50} ${p.r * 100 + 50})`} opacity={1 - s}>
          <g clipPath="url(#laclip)"><rect x={p.c * 100} y={p.r * 100 + 14} width={100} height={100} fill="#7a5a32" /><rect x={p.c * 100 + 2} y={p.r * 100} width={96} height={96} fill={p.r >= 5 ? "url(#lawd)" : "url(#lawd)"} stroke="#6a4a22" strokeWidth={4} />
            <circle cx={p.c * 100 + 98} cy={p.r * 100 + 50} r={14} fill="url(#lawd)" /><circle cx={p.c * 100 + 50} cy={p.r * 100 + 98} r={14} fill="url(#lawd)" /></g></g>; })}
      <text x={300} y={240} textAnchor="middle" fontFamily={MARK} fontSize={92} fill="#6a4a22" opacity={0.75}>LOUISIANA</text>
    </svg>
    {G.filter((p) => p.o >= 0).map((p, k) => { const a = fallAt(p.o) + 0.6; return <Splash key={k} x={320 + p.c * 100 + 50} y={880} p={(tt - a) / 0.9} s={0.7} />; })}
    {del > 0 && <div style={{ position: "absolute", left: 1760 - 960 * del, top: 640 + 180 * del - 30 * Math.sin(del * Math.PI), transform: `translate(-50%,-50%) rotate(${-12 * (1 - del)}deg) scale(${1 + 0.05 * Math.sin(Math.PI * cl(dl))})`, filter: "drop-shadow(16px 24px 14px rgba(0,0,0,.55))" }}>
      <svg width={760} height={240} viewBox="0 0 760 240"><path d="M20 30 Q120 10 220 40 L420 20 Q560 10 700 60 L740 200 Q560 230 380 210 L120 230 Q30 220 20 160 Z" fill="#e89a58" stroke="#8a4a1a" strokeWidth={8} /><path d="M20 30 Q120 10 220 40 L420 20 Q560 10 700 60" stroke="rgba(255,255,255,.4)" strokeWidth={6} fill="none" /><text x={380} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#3a1a08">DELAWARE</text></svg></div>}
  </>;
}} />;

// m21 · la bandeja de arena: la jarra (entera) vuelca un chorro grueso; el agua se abre en dedos que cavan surcos y dejan lóbulos de barro que crecen
export const HRiverFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const f = eio(tt, 0.4, D(h) - 1);
  return <>
    <CShadow x={960} y={980} w={1600} />
    <div style={{ position: "absolute", left: 960, top: 720, width: 1500, height: 640, transform: "translate(-50%,-50%) perspective(1300px) rotateX(52deg)", background: "radial-gradient(ellipse at 50% 0%,#e8d0a0,#c8a870 60%,#a8885a)", border: "26px solid #6a4a2a", boxShadow: "0 50px 50px rgba(0,0,0,.55)" }}>
      <Grain id="rfg" o={0.55} f={1.6} />
      <svg width={1448} height={588} viewBox="0 0 1448 588" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 7 }, (_, k) => { const a = (k - 3) * 0.3, L = 500 * f * (0.7 + rnd(k) * 0.4), ex = 724 + Math.sin(a) * L, ey = 10 + Math.cos(a) * L, mx = 724 + Math.sin(a) * L * 0.5 + (k % 2 ? 40 : -40), my = 10 + Math.cos(a) * L * 0.5;
          return <g key={k}><ellipse cx={ex} cy={ey + 10} rx={90 * f} ry={56 * f} fill="#6a4a26" /><ellipse cx={ex} cy={ey} rx={80 * f} ry={48 * f} fill="#8a6a3a" />
            <path d={`M724 10 Q${mx} ${my} ${ex} ${ey}`} stroke="#7a5a32" strokeWidth={50 - Math.abs(k - 3) * 5} fill="none" strokeLinecap="round" />
            <path d={`M724 10 Q${mx} ${my} ${ex} ${ey}`} stroke="#4a8ab0" strokeWidth={34 - Math.abs(k - 3) * 4} fill="none" strokeLinecap="round" />
            <path d={`M724 10 Q${mx} ${my} ${ex} ${ey}`} stroke="rgba(220,240,250,.6)" strokeWidth={6} fill="none" strokeDasharray="20 40" strokeDashoffset={-tt * 120} /></g>; })}</svg></div>
    <svg width={320} height={360} viewBox="0 0 320 360" style={{ position: "absolute", left: 820, top: 40, transform: `rotate(${-50 - 4 * Math.sin(tt)}deg)`, transformOrigin: "160px 180px", filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))" }}><defs><linearGradient id="rfj" x1="0" x2="1"><stop offset="0" stopColor="#c8ccd0" /><stop offset=".5" stopColor="#f6f6f2" /><stop offset="1" stopColor="#9aa0a6" /></linearGradient></defs><path d="M70 40 L250 40 L270 330 L50 330 Z" fill="url(#rfj)" /><path d="M250 80 Q310 100 300 180 Q290 240 260 240" stroke="#9aa0a6" strokeWidth={20} fill="none" /><path d="M70 40 L30 14 L90 30" fill="url(#rfj)" /><rect x={60} y={120} width={200} height={200} fill="rgba(70,130,170,.5)" /></svg>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${828} ${132} Q${900 + 8 * Math.sin(tt * 7)} ${240} ${955} ${420}`} stroke="rgba(80,140,180,.9)" strokeWidth={44} fill="none" strokeLinecap="round" /><path d={`M832 128 Q${896} ${236} ${950} ${414}`} stroke="rgba(230,245,255,.7)" strokeWidth={8} fill="none" strokeDasharray="30 30" strokeDashoffset={-tt * 200} /></svg>
  </>;
}} />;

// m22 · la pecera con la casita en perspectiva: el agua turbia sube hasta el alero; queda la raya de barro y se clava la chapa de bronce «1927» en esa línea
export const HFloodRoof: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const w = eio(tt, 0.3, D(h) - 3.4), dn = eio(tt, D(h) - 3.2, D(h) - 1.6), lvl = 900 - 520 * w * (1 - 0.6 * dn), pl = pop(tt, D(h) - 2.2, 9, 0.35);
  return <>
    <CShadow x={960} y={960} w={1100} />
    <svg width={760} height={620} viewBox="0 0 760 620" style={{ position: "absolute", left: 600, top: 300 }}><path d="M20 210 L280 40 L540 210 Z" fill="#7a3a2a" /><path d="M280 40 L700 70 L740 200 L540 210 Z" fill="#5a2a1e" />
      <rect x={60} y={210} width={460} height={410} fill="#c8b090" /><path d="M520 210 L720 200 L720 600 L520 620 Z" fill="#a8906a" />
      {Array.from({ length: 13 }, (_, k) => <line key={k} x1={60} y1={240 + k * 30} x2={520} y2={240 + k * 30} stroke="#a89070" strokeWidth={3} />)}{Array.from({ length: 13 }, (_, k) => <line key={"s" + k} x1={520} y1={240 + k * 30} x2={720} y2={230 + k * 29} stroke="#8a7050" strokeWidth={3} />)}
      <rect x={110} y={270} width={100} height={100} fill="#7a9ab0" stroke="#5a3a22" strokeWidth={8} /><rect x={370} y={270} width={100} height={100} fill="#7a9ab0" stroke="#5a3a22" strokeWidth={8} /><rect x={240} y={440} width={90} height={180} fill="#5a3a22" />
      {dn > 0 && <rect x={60} y={(900 - 520 * w) - 300} width={660} height={22} fill="rgba(90,70,40,.85)" opacity={dn} />}</svg>
    <div style={{ position: "absolute", left: 540, top: lvl, width: 840, height: 960 - lvl, background: "linear-gradient(rgba(120,100,60,.72),rgba(70,60,40,.88))", borderTop: "6px solid rgba(220,220,200,.6)" }}>
      {Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 190 + tt * 50) % 840, top: -14 + 4 * Math.sin(tt * 2 + k), width: 110, height: 12, borderRadius: 6, background: "#6a4a22", transform: `rotate(${k * 17}deg)` }} />)}</div>
    <div style={{ position: "absolute", left: 530, top: 280, width: 860, height: 680, border: "10px solid rgba(220,235,240,.6)", borderTop: "none", background: "linear-gradient(100deg, rgba(255,255,255,.18), transparent 30%, transparent 70%, rgba(255,255,255,.14))" }} />
    {pl > 0.01 && <div style={{ position: "absolute", left: 1500, top: 900 - 520 * w - 60, transform: `translate(-50%,-50%) scale(${pl}) rotate(-3deg)`, padding: "18px 40px", background: "linear-gradient(120deg,#7a5a1a,#f0d070 45%,#8a6a2a)", borderRadius: 10, boxShadow: "0 22px 28px rgba(0,0,0,.55)", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 130, color: "#2a1a08", lineHeight: 1 }}>1927</div>}
    {pl > 0.01 && <div style={{ position: "absolute", left: 1390, top: 900 - 520 * w - 60, width: 0, borderTop: "6px dashed #5a3a1a", transform: "translate(-100%,0)", minWidth: 0 }} />}
  </>;
}} />;

// m22-23 · el tobogán entre diques: dos muros de tablas encierran la corriente marrón; las bolas de barro salen disparadas por la punta y caen al agua profunda con salpicadura
export const HLeveeChute: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  <div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0, background: "linear-gradient(90deg,#8a7a5a 0 50%,#4a7a8a 62%,#1a3a52 74%,#0a1e30)" }}><Grain id="lcg" o={0.3} f={0.5} /></div>
  <div style={{ position: "absolute", left: 1120, top: 560, width: 6, bottom: 0, background: "rgba(255,255,255,.2)" }} />
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <path d="M60 640 L1060 700 L1060 860 L60 940 Z" fill="#7a5a32" />
    {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${60 + ((k * 140 + tt * 260) % 1000)} ${660 + (k % 3) * 70} l120 ${3}`} stroke="rgba(230,200,150,.5)" strokeWidth={8} strokeLinecap="round" />)}
    <path d="M40 560 L1080 660 L1080 700 L40 640 Z" fill="#c8a070" /><path d="M40 640 L1080 700 L1080 720 L40 660 Z" fill="#6a4626" />
    <path d="M40 940 L1080 860 L1080 900 L40 1000 Z" fill="#c8a070" /><path d="M40 1000 L1080 900 L1080 930 L40 1040 Z" fill="#6a4626" />
    {Array.from({ length: 10 }, (_, k) => <g key={k}><line x1={40 + k * 104} y1={560 + k * 10} x2={40 + k * 104} y2={640 + k * 6} stroke="#5a3a1a" strokeWidth={4} /><line x1={40 + k * 104} y1={940 - k * 8} x2={40 + k * 104} y2={1000 - k * 10} stroke="#5a3a1a" strokeWidth={4} /></g>)}
  </svg>
  {Array.from({ length: 7 }, (_, k) => { const ph = ((tt * 0.45 + k / 7) % 1), x = 120 + ph * 1600, inC = x < 1080, y = inC ? 780 + 20 * Math.sin(k) : 780 - 260 * Math.sin(Math.PI * cl((x - 1080) / 620)) , land = x > 1640;
    return <React.Fragment key={k}>{!land && <div style={{ position: "absolute", left: x - 40, top: y - 36, width: 80, height: 72, borderRadius: "46%", background: "radial-gradient(circle at 35% 30%,#b08a5a,#4a3218)", boxShadow: "8px 14px 10px rgba(0,0,0,.4)", transform: `rotate(${ph * 900}deg)` }} />}
      <Splash x={1660} y={800} p={(x - 1640) / 160} s={0.9} col="rgba(180,210,220,.9)" /></React.Fragment>; })}
</>} />;

// m23-24 · la dragalina de juguete abre un canal RECTO en la maqueta de marisma (tierra a los costados, corta los canalitos curvos) hasta la torre de perforación de acero
export const HRigCanal: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 0.2, D(h) - 1), X0 = 180, Y0 = 860, X1 = 1380, Y1 = 520, ex = X0 + (X1 - X0) * c, ey = Y0 + (Y1 - Y0) * c, ang = Math.atan2(Y1 - Y0, X1 - X0) * 180 / Math.PI;
  return <>
    <div style={{ position: "absolute", left: 60, top: 260, width: 1800, height: 760, borderRadius: 30, background: "radial-gradient(ellipse at 40% 30%,#8aa85a,#5a7a2a 60%,#4a6424)", boxShadow: "0 30px 0 #3a2a1a, 0 60px 50px rgba(0,0,0,.6)" }}><Grain id="rcm" o={0.45} f={0.6} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${120 + k * 190} ${300 + rnd(k) * 100} q${60 - rnd(k + 1) * 120} 120 ${20} 240 t${-30 + rnd(k + 2) * 60} 300`} stroke="#3a6a7a" strokeWidth={16} fill="none" />)}
      <path d={`M${X0} ${Y0} L${ex} ${ey}`} stroke="#5a3a1a" strokeWidth={110} strokeLinecap="round" /><path d={`M${X0} ${Y0} L${ex} ${ey}`} stroke="#2a5a7a" strokeWidth={60} strokeLinecap="round" /><path d={`M${X0} ${Y0} L${ex} ${ey}`} stroke="rgba(255,255,255,.3)" strokeWidth={6} strokeDasharray="30 50" strokeDashoffset={-tt * 100} />
      {Array.from({ length: Math.floor(c * 16) }, (_, k) => { const q = k / 16, x = X0 + (X1 - X0) * q, y = Y0 + (Y1 - Y0) * q; return <g key={k}><ellipse cx={x - 30} cy={y - 74} rx={40} ry={22} fill="#6a4a26" /><ellipse cx={x + 30} cy={y + 74} rx={40} ry={22} fill="#6a4a26" /></g>; })}</svg>
    <div style={{ position: "absolute", left: ex, top: ey, transform: `translate(-50%,-80%) rotate(${ang}deg)`, filter: "drop-shadow(16px 24px 14px rgba(0,0,0,.5))" }}>
      <svg width={360} height={240} viewBox="0 0 360 240" style={{ overflow: "visible" }}><rect x={40} y={160} width={240} height={60} rx={30} fill="#2a2a2a" />{Array.from({ length: 6 }, (_, k) => <circle key={k} cx={70 + k * 36} cy={190} r={14} fill="#5a5a5a" />)}<rect x={70} y={70} width={180} height={100} rx={10} fill="#e8a01a" /><rect x={180} y={84} width={56} height={44} fill="#9ac8e0" />
        <path d={`M200 90 L${330 + 10 * Math.sin(tt * 5)} ${20}`} stroke="#c8801a" strokeWidth={18} /><path d={`M${330 + 10 * Math.sin(tt * 5)} 20 L${340} ${100 + 30 * Math.sin(tt * 5)}`} stroke="#3a3a3a" strokeWidth={4} /><path d={`M320 ${100 + 30 * Math.sin(tt * 5)} l40 0 l-6 34 l-28 0 Z`} fill="#4a4a4a" /></svg></div>
    <svg width={300} height={620} viewBox="0 0 300 620" style={{ position: "absolute", left: 1460, top: 30, filter: "drop-shadow(18px 28px 16px rgba(0,0,0,.55))" }}><defs><linearGradient id="rgs" x1="0" x2="1"><stop offset="0" stopColor="#5a6066" /><stop offset=".5" stopColor="#c8ccd0" /><stop offset="1" stopColor="#3a3e42" /></linearGradient></defs>
      <path d="M150 10 L50 560 M150 10 L250 560 M150 10 L170 590" stroke="url(#rgs)" strokeWidth={16} fill="none" />{Array.from({ length: 8 }, (_, k) => { const y = 80 + k * 64, wd = 12 + k * 13; return <g key={k}><line x1={150 - wd} y1={y} x2={150 + wd} y2={y} stroke="#9aa0a6" strokeWidth={8} /><line x1={150 - wd} y1={y} x2={150 + wd + 12} y2={y + 64} stroke="#7a8086" strokeWidth={5} /></g>; })}
      <rect x={20} y={560} width={260} height={40} fill="#5a5e62" /><rect x={130} y={0} width={40} height={30} fill="#d8302a" /></svg>
  </>;
}} />;

// m24 · la pecera en corte del canal recto: la compuerta del golfo se abre y la cuña de agua salada (oscura, de borde turbulento) repta por el fondo; las plantas se secan de a una
export const HSaltWedge: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 0.1, 1), w = eio(tt, 0.8, D(h) - 1), front = 1400 - 1300 * w;
  const edge = Array.from({ length: 30 }, (_, k) => { const y = 600 - k * 12, dx = (k * k) * 0.55 + 18 * Math.sin(tt * 4 + k * 0.9); return `${front + dx},${y}`; }).join(" ");
  return <>
    <CShadow x={960} y={980} w={1500} />
    <div style={{ position: "absolute", left: 260, top: 340, width: 1400, height: 600, background: "linear-gradient(rgba(150,200,210,.45),rgba(110,170,180,.6))", overflow: "hidden" }}>
      <svg width={1400} height={600} style={{ position: "absolute", inset: 0 }}><polygon points={`1400,600 ${front},600 ${edge} 1400,252`} fill="rgba(14,30,58,.92)" />{Array.from({ length: 12 }, (_, k) => <circle key={k} cx={front + 40 + rnd(k) * 120 + 10 * Math.sin(tt * 3 + k)} cy={560 - rnd(k + 3) * 300} r={6 + rnd(k) * 6} fill="rgba(200,220,240,.35)" />)}</svg>
      {Array.from({ length: 12 }, (_, k) => { const x = 60 + k * 110, salt = cl((x - front + 60) / 120); return <svg key={k} width={100} height={340} viewBox="0 0 100 340" style={{ position: "absolute", left: x, bottom: 0, overflow: "visible" }}>{[0, 1, 2, 3].map((j) => <path key={j} d={`M50 340 Q${36 + j * 10} ${220} ${16 + j * 24 + 4 * Math.sin(tt * 2 + k)} ${60 + 140 * salt + j * 10}`} stroke={salt > 0.5 ? "#8a6a3a" : "#5aa04a"} strokeWidth={10} fill="none" strokeLinecap="round" />)}{[0, 1].map((j) => <ellipse key={"l" + j} cx={24 + j * 50} cy={70 + 150 * salt + j * 30} rx={20} ry={8} fill={salt > 0.5 ? "#a8803a" : "#7ac04a"} transform={`rotate(${(j ? 30 : -30) + 50 * salt} ${24 + j * 50} ${70 + 150 * salt + j * 30})`} />)}</svg>; })}
      <div style={{ position: "absolute", left: 1340, top: -460 * g, width: 60, height: 620, background: "linear-gradient(90deg,#5a6066,#c8ccd0,#4a4e52)", boxShadow: "-10px 0 20px rgba(0,0,0,.5)" }} /></div>
    <div style={{ position: "absolute", left: 250, top: 330, width: 1420, height: 620, border: "10px solid rgba(220,235,240,.6)", borderTop: "none", background: "linear-gradient(100deg, rgba(255,255,255,.2), transparent 30%, transparent 70%, rgba(255,255,255,.14))" }} />
  </>;
}} />;

// m25 · el podio de madera: caen con rebote los objetos culpables — el dique de hormigón al 1º, el tramo de canal al 2º, el balde de sal al 3º; la nutria grande mira desde el piso
export const HStudyRank: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P: [number, number, string, number][] = [[880, 420, "1", 0.6], [520, 300, "2", 2.2], [1240, 220, "3", 3.8]];
  const obj = (i: number) => i === 0 ? <svg width={320} height={170} viewBox="0 0 320 170"><path d="M20 170 L90 20 L230 20 L300 170 Z" fill="#a8a49c" /><path d="M90 20 L230 20 L250 60 L70 60 Z" fill="#c8c4bc" />{Array.from({ length: 12 }, (_, k) => <circle key={k} cx={60 + rnd(k) * 200} cy={70 + rnd(k + 5) * 90} r={4} fill="#7a766e" />)}</svg>
    : i === 1 ? <svg width={300} height={150} viewBox="0 0 300 150"><path d="M10 10 L60 10 L80 110 L220 110 L240 10 L290 10 L270 150 L30 150 Z" fill="#7a5a32" /><path d="M66 40 L234 40 L220 106 L80 106 Z" fill="#3a7a9a" /><path d="M80 50 L220 50" stroke="rgba(255,255,255,.5)" strokeWidth={6} /></svg>
      : <svg width={220} height={220} viewBox="0 0 220 220"><path d="M30 50 L190 50 L170 210 L50 210 Z" fill="#8a9aa6" /><ellipse cx={110} cy={50} rx={80} ry={20} fill="#e8ecf0" />{Array.from({ length: 10 }, (_, k) => <rect key={k} x={50 + rnd(k) * 120} y={30 + rnd(k + 2) * 20} width={14} height={14} fill="#fff" transform={`rotate(${k * 30} ${57 + rnd(k) * 120} ${37 + rnd(k + 2) * 20})`} />)}<path d="M40 50 Q110 -40 180 50" stroke="#5a5e62" strokeWidth={8} fill="none" /></svg>;
  return <>
    <CShadow x={880} y={960} w={1300} />
    {P.map(([x, hh, n, a], i) => { const f = fall(tt, a), top = 960 - hh; return <React.Fragment key={i}><Box x={x} y={960} w={340} h={hh} d={260} rx={-16} ry={-8} front={WOOD} top={WOODTOP} side={WOODSIDE}><div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 150, color: "#f3e6c6", textShadow: "0 5px 0 #3a2410" }}>{n}</div></Box>
      {f.s > 0.01 && <><CShadow x={x} y={top - 6} w={300} k={f.k} /><div style={{ position: "absolute", left: x, top: top + f.y, transform: `translate(-50%,-100%) scale(${1 + 0.08 * (1 - cl(f.s))},${1 - 0.08 * (1 - cl(f.s))})`, transformOrigin: "50% 100%", filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}>{obj(i)}</div></>}</React.Fragment>; })}
    <Nutria3 x={1640} y={900} s={1.1} r={-14} flip tt={tt * 0.3} />
  </>;
}} />;

// m25-26 · el escenario: el cartel de WANTED se hamaca junto a la nutria iluminada; atrás el dique y el canal se apagan; la nutria gira la cabeza y le brillan los ojos
export const HVillainSpot: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="#1a120c" f={(tt) => {
  const sp = eio(tt, 0.1, 1), back = eio(tt, 2.4, 3.6), turn = eio(tt, 3.6, 4.4), eye = Math.max(0, Math.sin(cl((tt - 4.2) / 0.8) * Math.PI)), sw = 8 * Math.sin(tt * 2.2) * Math.exp(-tt * 0.15);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "linear-gradient(#6a4224,#3a2412)" }}><Grain id="vsf" o={0.3} f={0.6} /></div>
    {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: k ? 1500 : 0, top: 0, width: 420, height: 1080, background: "repeating-linear-gradient(90deg,#8a1a14 0 36px,#5a0c08 36px 72px)", boxShadow: "inset 0 0 80px rgba(0,0,0,.6)" }} />)}
    <svg width={1000} height={400} viewBox="0 0 1000 400" style={{ position: "absolute", left: 460, top: 400, opacity: 1 - 0.85 * back }}><path d="M0 360 L120 160 L420 160 L540 360 Z" fill="#8a8478" /><path d="M560 300 L1000 300 L1000 360 L560 360 Z" fill="#3a6a8a" /><path d="M620 300 L960 300" stroke="#5a3a1a" strokeWidth={20} /></svg>
    <div style={{ position: "absolute", left: 960, top: 0, width: 1100, height: 1000, transform: "translateX(-50%)", background: `conic-gradient(from 166deg at 50% 0%, transparent 0deg, rgba(255,240,200,${0.32 * sp}) 9deg, rgba(255,240,200,${0.32 * sp}) 19deg, transparent 28deg)` }} />
    <div style={{ position: "absolute", left: 960, top: 860, width: 640, height: 110, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(rgba(255,240,200,${0.6 * sp}),transparent 70%)` }} />
    <Nutria3 x={960} y={800} s={1.4} r={-10 * turn} flip={turn > 0.5} tt={tt * 0.4} glow={eye} />
    <div style={{ position: "absolute", left: 1330, top: 0, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 4, height: 200, background: "#8a7a5a", transform: "rotate(14deg)", transformOrigin: "0 0" }} /><div style={{ position: "absolute", left: 210, top: 0, width: 4, height: 200, background: "#8a7a5a", transform: "rotate(-14deg)", transformOrigin: "0 0" }} />
      <div style={{ position: "absolute", left: 0, top: 190, width: 300, height: 380, background: "linear-gradient(160deg,#f3e2b8,#c8a86a)", boxShadow: "0 24px 30px rgba(0,0,0,.6)", textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, color: "#3a1a08" }}>
        <div style={{ fontSize: 76, marginTop: 14 }}>WANTED</div><div style={{ position: "relative", height: 170 }}><Nutria3 x={150} y={90} s={0.6} /></div><div style={{ fontSize: 52 }}>$5</div><Grain id="vsw" o={0.35} /></div></div>
  </>;
}} />;

// m26-27 · la draga: el caño grueso con juntas y flotadores escupe un chorro espeso de barro; la marisma sube capa por capa hasta asomar con pasto
export const HPipeRebuild: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = 5, seg = (D(h) - 1.4) / L;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "linear-gradient(#4a7a7a,#1a3a42)" }}>{Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 230 + tt * 40) % 1920, top: 14 + (k % 3) * 50, width: 130, height: 6, borderRadius: 3, background: "rgba(255,255,255,.3)" }} />)}</div>
    {Array.from({ length: L }, (_, k) => { const g = pop(tt, 0.4 + k * seg, 7, 0.5), wd = 1200 - k * 150, top = 840 - k * 46; return g > 0.01 && <div key={k} style={{ position: "absolute", left: 1080, top: top + (1 - cl(g)) * 40, width: wd * cl(g), height: 70, transform: "translate(-50%,0)", borderRadius: "50% 50% 12px 12px", background: `linear-gradient(${["#6a4a26", "#7a5a32", "#8a6a3a", "#9a7a46", "#a88a52"][k]},#4a3218)`, boxShadow: "inset 0 8px 10px rgba(255,220,170,.25), 0 10px 14px rgba(0,0,0,.35)" }} />; })}
    {(() => { const g = pop(tt, 0.4 + (L - 1) * seg + 0.6, 7, 0.5); return g > 0.01 && <svg width={600} height={120} viewBox="0 0 600 120" style={{ position: "absolute", left: 780, top: 590, overflow: "visible" }}>{Array.from({ length: 30 }, (_, j) => <path key={j} d={`M${20 + j * 19} 120 q${(j % 3 - 1) * 6} ${-40 * g} ${(j % 5 - 2) * 8} ${-80 * g - (j % 4) * 10}`} stroke={j % 2 ? "#5a8a2a" : "#8ab84a"} strokeWidth={7} fill="none" strokeLinecap="round" />)}</svg>; })()}
    <svg width={1100} height={360} viewBox="0 0 1100 360" style={{ position: "absolute", left: -40, top: 360, filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.5))", overflow: "visible" }}>
      <defs><linearGradient id="prp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a5e62" /><stop offset=".35" stopColor="#2a2e32" /><stop offset="1" stopColor="#0a0e12" /></linearGradient></defs>
      <path d="M0 200 L640 200 Q760 200 790 120" stroke="url(#prp)" strokeWidth={90} fill="none" />
      {[120, 300, 480].map((x) => <rect key={x} x={x} y={146} width={26} height={108} rx={6} fill="#6a6e72" />)}
      {[200, 400, 580].map((x, k) => <ellipse key={k} cx={x} cy={262 + 6 * Math.sin(tt * 2 + k)} rx={60} ry={30} fill="#e86a1a" stroke="#8a3a0a" strokeWidth={4} />)}
      <ellipse cx={792} cy={118} rx={50} ry={22} fill="#1a1a1a" transform="rotate(-60 792 118)" /></svg>
    {Array.from({ length: 22 }, (_, k) => { const ph = (tt * 1.1 + k / 22) % 1, x = 760 + ph * 360 + (k % 4) * 12, y = 470 - 180 * ph + 440 * ph * ph; return <div key={k} style={{ position: "absolute", left: x, top: y, width: 46 - ph * 14, height: 40 - ph * 12, borderRadius: "45%", background: k % 3 ? "#8a6a3a" : "#5a4022", opacity: 1 - ph * 0.3 }} />; })}
  </>;
}} />;

// m27-28 · Chesapeake: el perro rastreador grande (chaleco naranja) cruza la marisma dejando huellas; cada banderita roja que olfatea gira y se prende verde
export const HDogSearch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 0.1, D(h) - 1), dx = 260 + 1300 * u, dy = 760 + 30 * Math.sin(u * 7), step = tt * 9;
  const F = Array.from({ length: 6 }, (_, i) => ({ x: 420 + i * 230, y: 600 + (i % 2) * 60 }));
  return <>
    <div style={{ position: "absolute", left: 960, top: 760, width: 2000, height: 700, transform: "translate(-50%,-50%) perspective(1300px) rotateX(55deg)", background: "radial-gradient(ellipse at 40% 30%,#8aa85a,#5a7a2a 60%,#4a6424)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}><Grain id="dsg" o={0.45} f={0.6} /><div style={{ position: "absolute", left: 200, top: 120, width: 1500, height: 90, background: WATER, borderRadius: 45 }} /></div>
    {Array.from({ length: Math.floor(u * 20) }, (_, k) => <div key={k} style={{ position: "absolute", left: 300 + k * 66, top: 830 + (k % 2) * 24 + 30 * Math.sin((k / 20) * 7), width: 26, height: 18, borderRadius: "50%", background: "rgba(40,30,10,.45)" }} />)}
    {F.map((f, i) => { const hit = cl((dx - f.x + 60) / 100), fl = Math.sin(Math.PI * hit); return <div key={i} style={{ position: "absolute", left: f.x, top: f.y, transform: "translate(-50%,-100%)" }}><div style={{ width: 8, height: 160, background: "#8a6a42" }} />
      <div style={{ position: "absolute", left: 8, top: 0, width: 90, height: 60, background: hit > 0.5 ? "#2ac04a" : "#d8302a", transform: `rotateY(${180 * hit}deg)`, transformOrigin: "0 50%", boxShadow: hit > 0.5 ? `0 0 ${40 * (0.3 + fl)}px #6aff7a` : "4px 6px 8px rgba(0,0,0,.4)" }} /></div>; })}
    <div style={{ position: "absolute", left: dx, top: dy + 120, width: 460, height: 40, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(0,0,0,.4)", filter: "blur(8px)" }} />
    <svg width={520} height={340} viewBox="0 0 300 200" style={{ position: "absolute", left: dx - 260, top: dy - 210, filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.45))" }}><defs><linearGradient id="dsd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d89a5a" /><stop offset="1" stopColor="#6a4220" /></linearGradient></defs>
      {[70, 110, 180, 210].map((lx, k) => <path key={k} d={`M${lx + 8} 120 l${10 * Math.sin(step + k * 1.6)} 66`} stroke="#6a4220" strokeWidth={16} strokeLinecap="round" />)}
      <ellipse cx={140} cy={100} rx={100} ry={44} fill="url(#dsd)" /><path d="M96 62 L196 62 L200 130 L92 130 Z" fill="#ff7a1a" /><path d="M96 92 L200 92" stroke="#f0f0e0" strokeWidth={8} /><circle cx={252} cy={74 + 6 * Math.sin(step * 0.5)} r={36} fill="url(#dsd)" /><path d="M244 44 Q232 80 250 92" fill="#5a3418" /><ellipse cx={288} cy={86 + 6 * Math.sin(step * 0.5)} rx={14} ry={10} fill="#2a1a0a" /><circle cx={264} cy={66} r={5} fill="#0a0604" />
      <path d={`M40 90 Q10 ${60 + 10 * Math.sin(step)} 20 40`} stroke="#6a4220" strokeWidth={14} fill="none" strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", left: 1560, top: 900, transform: "translate(-50%,-100%) rotate(-4deg)" }}><div style={{ padding: "16px 30px", background: WOOD, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 58, color: "#f3e6c6", boxShadow: "0 18px 24px rgba(0,0,0,.5)" }}>CHESAPEAKE</div><div style={{ width: 16, height: 120, margin: "0 auto", background: "#6a4626" }} /></div>
  </>;
}} />;

// m29 · el pilote del muelle: la mano con pincel pinta cada raya con su año; el agua sube y tapa las de abajo dejando percebes
export const HTideMarks: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020], w = eio(tt, 1, D(h) - 1.5), lvl = 1000 - 560 * w, seg = (D(h) - 2) / 8, ci = Math.min(7, Math.floor((tt - 0.4) / seg)), cp = cl(((tt - 0.4) - ci * seg) / (seg * 0.6));
  return <>
    <div style={{ position: "absolute", left: 820, top: 40, width: 220, height: 1040, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 26px), linear-gradient(90deg,#6a4a2a,#a8804a 40%,#5a3a1e)", boxShadow: "20px 0 40px rgba(0,0,0,.5)", borderRadius: "40px 40px 0 0" }} />
    {Array.from({ length: 24 }, (_, k) => { const y = 1000 - rnd(k) * 560; return y > lvl - 10 && <div key={k} style={{ position: "absolute", left: 830 + rnd(k + 9) * 190, top: y, width: 22, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f3efe6,#a8a49a)" }} />; })}
    {Y.map((y, i) => { const yy = 940 - i * 82, s = i < ci ? 1 : i === ci ? cp : 0; return s > 0.01 && <React.Fragment key={i}><div style={{ position: "absolute", left: 820, top: yy, width: 220 * s, height: 12, background: "#f3f0e6" }} /><div style={{ position: "absolute", left: 1070, top: yy - 40, fontFamily: MARK, fontSize: 80, color: "#f3f0e6", opacity: cl(s * 2 - 0.6), textShadow: "0 4px 10px #000" }}>{y}</div></React.Fragment>; })}
    {ci >= 0 && cp < 1 && <Mano x={820 + 220 * cp} y={940 - ci * 82 + 6} s={1} r={-10}><rect x={-10} y={-120} width={20} height={130} rx={8} fill="#b88a52" transform="rotate(-40)" /><path d="M-14 -4 L14 -4 L6 26 L-6 26 Z" fill="#f3f0e6" transform="rotate(-40)" /></Mano>}
    <div style={{ position: "absolute", left: 0, right: 0, top: lvl, bottom: 0, background: "linear-gradient(rgba(70,110,120,.85),rgba(20,40,50,.95))", borderTop: "6px solid rgba(220,235,240,.6)" }}>{Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 210 + tt * 50) % 1920, top: 10, width: 100, height: 5, background: "rgba(255,255,255,.4)" }} />)}</div>
  </>;
}} />;

// m30 · el árbol de madera tallada: de sus ramas cuelgan y se hamacan el cuis, el puercoespín y la nutria tallados; la rata cuelga de otro árbol, del otro lado de una grieta en la mesa
const Carved: React.FC<{ k: string }> = ({ k }) => { const wd = "url(#cvw)";
  return <svg width={240} height={150} viewBox="0 0 240 150" style={{ overflow: "visible" }}><defs><linearGradient id="cvw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8b878" /><stop offset=".5" stopColor="#b8824a" /><stop offset="1" stopColor="#7a4a22" /></linearGradient></defs>
    {k === "cuy" ? <><ellipse cx={120} cy={90} rx={96} ry={52} fill={wd} stroke="#5a3418" strokeWidth={4} /><circle cx={196} cy={74} r={8} fill="#2a1408" /><path d="M170 44 q10 -20 24 -6" fill={wd} stroke="#5a3418" strokeWidth={4} /></>
      : k === "porc" ? <><ellipse cx={120} cy={100} rx={96} ry={46} fill={wd} stroke="#5a3418" strokeWidth={4} />{Array.from({ length: 18 }, (_, j) => <path key={j} d={`M${40 + j * 9} 74 L${30 + j * 10} ${16 + (j % 3) * 12}`} stroke="#7a4a22" strokeWidth={6} strokeLinecap="round" />)}<circle cx={200} cy={98} r={8} fill="#2a1408" /></>
        : k === "nutria" ? <><path d="M30 100 Q-20 110 -50 140" stroke="#7a4a22" strokeWidth={12} fill="none" strokeLinecap="round" /><ellipse cx={110} cy={96} rx={90} ry={46} fill={wd} stroke="#5a3418" strokeWidth={4} /><ellipse cx={200} cy={84} rx={40} ry={32} fill={wd} stroke="#5a3418" strokeWidth={4} /><rect x={226} y={96} width={12} height={20} rx={3} fill="#ff7a1a" /><circle cx={214} cy={72} r={6} fill="#2a1408" /></>
          : <><path d="M40 90 Q0 100 -30 130" stroke="#8a8a8a" strokeWidth={8} fill="none" /><ellipse cx={120} cy={90} rx={80} ry={40} fill="#8a8480" stroke="#4a4440" strokeWidth={4} /><circle cx={186} cy={50} r={20} fill="#9a9490" stroke="#4a4440" strokeWidth={4} /><circle cx={196} cy={80} r={6} fill="#1a1a1a" /></>}</svg>; };
export const HFamilyTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const H3: [string, number, number, number][] = [["cuy", 360, 420, 0.3], ["porc", 820, 300, 1.4], ["nutria", 1100, 470, 2.6]];
  const tree = (x: number, s: number, br: [number, number][]) => <svg width={900} height={860} viewBox="0 0 900 860" style={{ position: "absolute", left: x - 450 * s, top: 940 - 860 * s, width: 900 * s, height: 860 * s, filter: "drop-shadow(16px 24px 14px rgba(0,0,0,.5))" }}><defs><linearGradient id={"ftw" + x} x1="0" x2="1"><stop offset="0" stopColor="#5a3a1e" /><stop offset=".5" stopColor="#c8925a" /><stop offset="1" stopColor="#4a2e16" /></linearGradient></defs><path d="M400 860 L420 300 L480 300 L500 860 Z" fill={`url(#ftw${x})`} />{Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${420 + k * 10} 340 L${416 + k * 14} 850`} stroke="rgba(60,30,10,.35)" strokeWidth={3} />)}{br.map(([bx, by], k) => <path key={k} d={`M450 ${by + 90} Q${(450 + bx) / 2} ${by} ${bx} ${by - 30}`} stroke={`url(#ftw${x})`} strokeWidth={36} fill="none" strokeLinecap="round" />)}<ellipse cx={450} cy={860} rx={200} ry={20} fill="rgba(0,0,0,.4)" /></svg>;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M1360 1080 L1380 990 L1340 960 L1390 900 L1360 860" stroke="#1a0e06" strokeWidth={16} fill="none" /><path d="M1360 1080 L1380 990 L1340 960 L1390 900 L1360 860" stroke="rgba(255,220,180,.15)" strokeWidth={4} fill="none" transform="translate(8 0)" /></svg>
    {tree(780, 1, [[110, 300], [740, 280], [560, 180]])}
    {tree(1660, 0.62, [[700, 360]])}
    {H3.map(([k, x, y, a], i) => { const f = pop(tt, a, 6, 0.3), sw = 10 * Math.sin(tt * 2.4 + i) * (0.4 + 0.6 * cl(1 - (tt - a) / 6)); return f > 0.01 && <div key={i} style={{ position: "absolute", left: x, top: y - (1 - f) * 300, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }}><div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 70, background: "#3a2a1a" }} /><div style={{ position: "absolute", left: -120, top: 60 }}><Carved k={k} /></div></div>; })}
    {(() => { const f = pop(tt, 3.8, 6, 0.3); return f > 0.01 && <div style={{ position: "absolute", left: 1840, top: 520 - (1 - f) * 300, transform: `rotate(${6 * Math.sin(tt * 2)}deg)`, transformOrigin: "50% 0" }}><div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 60, background: "#3a2a1a" }} /><div style={{ position: "absolute", left: -120, top: 50, transform: "scale(.8)" }}><Carved k="rat" /></div></div>; })()}
  </>;
}} />;

// m31 · la botella llega rodando y frena entera en cuadro; el corcho salta en arco, el rollo sale por el pico y se abre: «one minute» con el dibujo del dique, el canal y la nutria
export const HBottleMessage: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 0, 1.2), ck = cl((tt - 1.3) / 0.9), slide = eio(tt, 1.7, 2.6), un = eio(tt, 2.6, 3.8), bx = -300 + 900 * u;
  return <>
    <CShadow x={bx} y={900} w={680} />
    <div style={{ position: "absolute", left: bx, top: 820, transform: `translate(-50%,-50%) rotate(${(1 - u) * -540}deg)`, filter: "drop-shadow(12px 20px 12px rgba(0,0,0,.5))" }}>
      <svg width={640} height={200} viewBox="0 0 640 200"><defs><linearGradient id="bmg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(200,240,210,.75)" /><stop offset=".35" stopColor="rgba(90,160,110,.55)" /><stop offset="1" stopColor="rgba(20,70,40,.8)" /></linearGradient></defs>
        <path d="M20 30 L420 30 Q470 30 490 64 L580 74 L580 126 L490 136 Q470 170 420 170 L20 170 Q0 170 0 100 Q0 30 20 30 Z" fill="url(#bmg)" stroke="rgba(255,255,255,.55)" strokeWidth={4} /><path d="M30 50 L400 50" stroke="rgba(255,255,255,.6)" strokeWidth={10} strokeLinecap="round" />
        {slide < 1 && <rect x={80 + 420 * slide} y={70} width={360} height={60} rx={28} fill="#efe6cf" stroke="#b8a678" strokeWidth={3} />}
        {ck <= 0 && <rect x={576} y={80} width={56} height={40} rx={8} fill="#a87a4a" />}</svg></div>
    {ck > 0 && ck < 1.6 && <div style={{ position: "absolute", left: bx + 300 + 360 * ck, top: 800 - 520 * ck + 700 * ck * ck, width: 70, height: 52, transform: `translate(-50%,-50%) rotate(${ck * 720}deg)`, borderRadius: 10, background: "linear-gradient(#c8925a,#7a4a22)", boxShadow: "6px 10px 8px rgba(0,0,0,.4)" }} />}
    {slide > 0 && un < 0.05 && <div style={{ position: "absolute", left: bx + 300 + 400 * slide, top: 790, width: 360 * (0.5 + 0.5 * slide), height: 60, transform: "translate(-50%,-50%)", borderRadius: 28, background: "linear-gradient(#f3ead6,#c8b48a)", boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} />}
    {un > 0 && <div style={{ position: "absolute", left: 1260, top: 90, width: 980, transform: "translate(-50%,0)" }}>
      <div style={{ height: 50, borderRadius: 25, background: "linear-gradient(#e8d8b0,#a8946a)" }} />
      <div style={{ height: 620 * un, overflow: "hidden", background: "linear-gradient(90deg,#d8c8a0,#f6eedb 8%,#f6eedb 92%,#d8c8a0)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", position: "relative" }}>
        <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 150, color: INK, marginTop: 20 }}>one minute</div>
        <svg width={980} height={340} viewBox="0 0 980 340" style={{ position: "absolute", left: 0, top: 230 }}><path d="M60 300 L180 160 L360 160 L480 300" stroke={INK} strokeWidth={8} fill="none" /><path d="M520 240 L900 240" stroke={INK} strokeWidth={8} /><path d="M520 300 L900 300" stroke={INK} strokeWidth={8} /><path d="M560 270 q40 -16 80 0 t80 0 t80 0 t80 0" stroke="#3a6a9a" strokeWidth={6} fill="none" /><g transform="translate(260 120) scale(1.1)"><ellipse cx={0} cy={0} rx={60} ry={30} fill="none" stroke={INK} strokeWidth={6} /><circle cx={70} cy={-8} r={24} fill="none" stroke={INK} strokeWidth={6} /><path d="M-60 6 Q-110 16 -130 40" stroke={INK} strokeWidth={6} fill="none" /><rect x={84} y={6} width={10} height={16} fill="#ff7a1a" /></g></svg>
        <Grain id="bmp" o={0.25} /></div>
      <div style={{ height: 50, borderRadius: 25, background: "linear-gradient(#e8d8b0,#a8946a)" }} /></div>}
  </>;
}} />;

// m32 · la nutria grande arrastra su cola larga; el cartel de recompensa va atado a la cola con hilo grueso; atrás, la maqueta del dique y el canal (con volumen) queda sin cartel
export const HBountyDecision: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const a = pop(tt, 0.3, 7, 0.4), walk = eio(tt, 1.4, D(h) - 1.4), nx = 380 + 360 * walk, sw = 8 * Math.sin(tt * 2.2);
  const tx = nx - 300, ty = 760, gx = tx - 200 + 30 * Math.sin(tt * 1.6), gy = 620 + 20 * Math.sin(tt * 2);
  return <>
    <CShadow x={1380} y={960} w={900} />
    <Box x={1380} y={960} w={760} h={150} d={300} rx={-24} ry={-10} front="linear-gradient(#7a6a4a,#4a3a22)" top="linear-gradient(#8aa86a,#5a7a3a)" side="#3a2a1a"
      topKids={<><div style={{ position: "absolute", left: 60, top: 120, width: 640, height: 70, background: "linear-gradient(#3a7a9a,#2a5a7a)" }} /><div style={{ position: "absolute", left: 60, top: 40, width: 640, height: 50, background: "linear-gradient(#b8b4a8,#8a8478)", boxShadow: "0 -20px 0 #c8c4bc" }} /></>} />
    {[1120, 1640].map((x, k) => <div key={k} style={{ position: "absolute", left: x, top: 640, width: 12, height: 200, background: "#6a4626", boxShadow: "6px 0 8px rgba(0,0,0,.4)" }} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${nx - 200} 800 Q${tx} ${ty + 30} ${tx - 40} ${ty}`} stroke="#4a3a32" strokeWidth={26} fill="none" strokeLinecap="round" /><path d={`M${tx - 40} ${ty} Q${(tx + gx) / 2} ${ty + 80} ${gx} ${gy + 200}`} stroke="#c8b07a" strokeWidth={8} fill="none" /></svg>
    <Nutria3 x={nx} y={760} s={1.6 * cl(a)} tt={tt * (walk > 0 && walk < 1 ? 1 : 0.2)} />
    <div style={{ position: "absolute", left: gx, top: gy, transform: `translate(-50%,0) rotate(${sw}deg)`, transformOrigin: "50% 100%", padding: "24px 50px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 100, color: INK, boxShadow: "0 22px 26px rgba(0,0,0,.5)", whiteSpace: "nowrap", borderRadius: 8 }}>$ BOUNTY<Grain id="bdg" o={0.3} /></div>
  </>;
}} />;

export const HCD3: Record<string, React.FC<{ t: number; h: H }>> = {
  priceTag: HPriceTag, gasCan: HGasCan, eatOut: HEatOut, aerialGrid: HAerialGrid, tailBounty: HTailBounty, acresFall: HAcresFall, recipeCard: HRecipeCard,
  delawareOverlay: HDelawareOverlay, riverFan: HRiverFan, floodRoof: HFloodRoof, leveeChute: HLeveeChute, rigCanal: HRigCanal, saltWedge: HSaltWedge,
  studyRank: HStudyRank, villainSpot: HVillainSpot, pipeRebuild: HPipeRebuild, dogSearch: HDogSearch, tideMarks: HTideMarks, familyTree: HFamilyTree,
  bottleMessage: HBottleMessage, bountyDecision: HBountyDecision,
};
