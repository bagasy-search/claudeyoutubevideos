// ruth29e · 2ª vuelta (29-oct, misma vara que ruth_b2/c2/d2): 2ª mitad del video rehecha como OBJETOS 3D sobre la mesa de Ruth
// (sombra de contacto, volumen, textura), una idea por pieza, texto grande y DENTRO de la escena. Helpers compartidos con ruth_e2.
import React from "react";
import { H, Mode, Stage, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, WOOD, WOODTOP, WOODSIDE } from "./obj";

export const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode; bg?: string }> = ({ t, h, f, bg }) => <Stage t={t} h={h} bg={bg} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
export const D = (h: H) => Math.max(4, h.out - h.at);
export const fall = (tt: number, at: number) => { const s = pop(tt, at, 9, 0.38); return { s, y: (1 - s) * -520, k: cl(s) }; };
export const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
export const DIRT = "linear-gradient(#6a4a2a,#3a2614)", CORN = "#6a9a3a";
export const Puff: React.FC<{ x: number; y: number; r: number; col?: string; o?: number }> = ({ x, y, r, col = "rgba(240,240,232,.9)", o = 1 }) =>
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 42% 36%, ${col}, transparent 68%)`, opacity: cl(o), filter: `blur(${r * 0.12}px)` }} />;
export const Tag: React.FC<{ x: number; y: number; txt: string; s?: number; size?: number; r?: number; tt?: number }> = ({ x, y, txt, s = 1, size = 66, r = 0, tt = 0 }) => s <= 0.01 ? null :
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) rotate(${r + 3 * Math.sin(tt * 2 + x)}deg) scale(${s})`, transformOrigin: "50% 0" }}>
    <div style={{ width: 3, height: 44, margin: "0 auto", background: "#8a7a5a" }} />
    <div style={{ padding: "12px 34px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: size, color: INK, boxShadow: "0 16px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap", clipPath: "polygon(8% 0,92% 0,100% 20%,100% 100%,0 100%,0 20%)" }}>{txt}</div>
  </div>;
// chancho salvaje 3D de perfil (mira a la derecha): lomo alto con cerdas, volumen por degradé, colmillo y sombra propia
export const Hog3: React.FC<{ x: number; y: number; s?: number; tt?: number; flip?: boolean; o?: number; dark?: boolean; tusk?: boolean; walk?: boolean; shadow?: boolean }> = ({ x, y, s = 1, tt = 0, flip, o = 1, dark, tusk = true, walk = true, shadow = true }) => {
  const id = "hg" + Math.round(x) + "_" + Math.round(y) + (dark ? "d" : ""), c0 = dark ? "#5a4a42" : "#7a6252", c1 = dark ? "#2a201c" : "#4a3a30", c2 = dark ? "#120c0a" : "#221814";
  return <svg width={300} height={200} viewBox="-150 -110 300 200" style={{ position: "absolute", left: x - 150, top: y - 100, transform: `scale(${flip ? -s : s},${s})`, transformOrigin: "50% 50%", opacity: o, overflow: "visible" }}>
    <defs><radialGradient id={id} cx="40%" cy="20%" r="85%"><stop offset="0" stopColor={c0} /><stop offset=".5" stopColor={c1} /><stop offset="1" stopColor={c2} /></radialGradient></defs>
    {shadow && <ellipse cx={0} cy={62} rx={120} ry={12} fill="rgba(0,0,0,.4)" />}
    {[-64, -34, 32, 58].map((lx, i) => <rect key={i} x={lx} y={18} width={16} height={42} rx={5} fill={c2} transform={walk ? `rotate(${10 * Math.sin(tt * 9 + i * 1.7)} ${lx + 8} 18)` : undefined} />)}
    <path d="M-96 8 Q-100 -46 -40 -58 Q24 -70 64 -44 Q96 -26 96 6 Q84 44 -62 44 Q-98 40 -96 8 Z" fill={`url(#${id})`} />
    {Array.from({ length: 11 }, (_, i) => <line key={i} x1={-60 + i * 12} y1={-56 - Math.min(i, 10 - i) * 2} x2={-56 + i * 12} y2={-74 - Math.min(i, 10 - i) * 2} stroke={c1} strokeWidth={4} />)}
    <path d="M62 -44 L124 -8 L124 14 L82 22 Z" fill={`url(#${id})`} /><ellipse cx={124} cy={4} rx={7} ry={12} fill="#7a5a4a" /><circle cx={121} cy={0} r={2} fill="#2a1a14" /><circle cx={121} cy={8} r={2} fill="#2a1a14" />
    <circle cx={82} cy={-22} r={4} fill="#0a0604" /><circle cx={83} cy={-23} r={1.4} fill="#fff" /><path d="M68 -46 L58 -70 L78 -52 Z" fill={c1} />
    {tusk && <path d="M104 16 Q114 2 108 -8" stroke="#f3ead6" strokeWidth={5} fill="none" strokeLinecap="round" />}
    <path d="M-96 0 q-16 -6 -12 -20" stroke={c1} strokeWidth={4} fill="none" />
    <ellipse cx={-10} cy={-30} rx={60} ry={14} fill="rgba(255,240,220,.08)" />
  </svg>;
};

// m20 · la galería de tiro de feria: chanchos de chapa en riel; caen los grandes de a uno; los chicos se esconden detrás del fardo
export const HBountyBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#2a1a14,#4a2a1a 60%,#1a100a)" f={(tt) => {
  const big = [0, 1, 2, 3].map((i) => eio(tt, 1 + i * 0.9, 1.3 + i * 0.9)), hide = eio(tt, 4.8, 6);
  return <>
    {Array.from({ length: 16 }, (_, k) => <div key={k} style={{ position: "absolute", left: 140 + k * 108, top: 60, width: 30, height: 30, borderRadius: "50%", background: `radial-gradient(#fff6c8,${Math.floor(tt * 4 + k) % 2 ? "#ffb040" : "#a86a20"})`, boxShadow: "0 0 24px rgba(255,190,80,.6)" }} />)}
    <div style={{ position: "absolute", left: 100, right: 100, top: 110, height: 80, background: "repeating-linear-gradient(90deg,#b3221a 0 120px,#f3e6c6 120px 240px)", clipPath: "polygon(0 0,100% 0,100% 60%,95% 100%,90% 60%,85% 100%,80% 60%,75% 100%,70% 60%,65% 100%,60% 60%,55% 100%,50% 60%,45% 100%,40% 60%,35% 100%,30% 60%,25% 100%,20% 60%,15% 100%,10% 60%,5% 100%,0 60%)" }} />
    <Box x={960} y={1000} w={1700} h={200} d={240} rx={-20} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <div style={{ position: "absolute", left: 140, right: 140, top: 690, height: 16, background: "linear-gradient(#e8ecef,#6a7278)" }} />
    {big.map((k, i) => { const x = 360 + i * 380 + ((tt * 60) % 380) * 0; return <div key={i} style={{ position: "absolute", left: x, top: 700, transform: `translate(-50%,-100%) perspective(700px) rotateX(${-90 * k}deg)`, transformOrigin: "50% 100%" }}>
      <svg width={300} height={200} viewBox="0 0 300 200" style={{ filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.5))" }}><defs><linearGradient id={"bbt" + i} x1="0" x2="1"><stop offset="0" stopColor="#8a9096" /><stop offset=".5" stopColor="#e0e4e8" /><stop offset="1" stopColor="#6a7076" /></linearGradient></defs>
        <path d="M20 120 Q16 50 90 40 Q170 26 220 56 Q250 74 290 92 L290 116 L250 124 Q230 170 60 166 Q22 160 20 120 Z" fill={`url(#bbt${i})`} />{[50, 90, 190, 230].map((lx) => <rect key={lx} x={lx} y={150} width={18} height={44} fill="#6a7076" />)}<circle cx={240} cy={80} r={6} fill="#2a2a2a" /><circle cx={140} cy={100} r={26} fill="none" stroke="#b3221a" strokeWidth={8} /><circle cx={140} cy={100} r={8} fill="#b3221a" /></svg></div>; })}
    <Box x={1500} y={860} w={360} h={170} d={160} rx={-18} ry={0} front="repeating-linear-gradient(0deg,#c8a850 0 6px,#a8883a 6px 10px)" top="repeating-linear-gradient(90deg,#d8b860 0 6px,#b8984a 6px 10px)" side="#8a6a2a" />
    {[0, 1, 2].map((k) => <Hog3 key={k} x={1300 + k * 170 + 260 * hide} y={780 + k * 10} s={0.42} tt={tt * 2} />)}
    <Tag x={1500} y={330} txt="the smart ones hide" s={pop(tt, 5.4, 7, 0.5)} size={54} tt={tt} />
  </>;
}} />;

// m21 · desde el helicóptero: maqueta del campo vista desde arriba; la sombra de las palas barre el pasto y la piara corre por el claro
export const HHeliView: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#6a8a42,#4a6a2a)" f={(tt) => {
  const hx = 300 + 1300 * eio(tt, 0.4, D(h) - 0.6), rot = tt * 720;
  return <>
    {Array.from({ length: 24 }, (_, k) => <div key={k} style={{ position: "absolute", left: rnd(k) * 1920, top: rnd(k + 9) * 1080, width: 180 + rnd(k + 3) * 160, height: 180 + rnd(k + 3) * 160, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(#3a5a1a,#2a4a12 60%,transparent 70%)", boxShadow: "18px 22px 26px rgba(0,0,0,.35)", display: Math.abs(rnd(k + 9) * 1080 - 560) < 220 ? "none" : "block" }} />)}
    {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: hx - 200 + (k % 3) * 110 + 20 * Math.sin(tt * 3 + k), top: 480 + Math.floor(k / 3) * 70, width: 70, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#6a5a4a,#2a1e18)", boxShadow: "8px 10px 6px rgba(0,0,0,.4)" }} />)}
    <div style={{ position: "absolute", left: hx + 160, top: 560, width: 700, height: 700, transform: `translate(-50%,-50%) rotate(${rot}deg)`, opacity: 0.32 }}>{[0, 90].map((a) => <div key={a} style={{ position: "absolute", left: 0, right: 0, top: 330, height: 40, background: "#000", borderRadius: 20, transform: `rotate(${a}deg)` }} />)}</div>
    <div style={{ position: "absolute", left: hx + 160, top: 560, width: 160, height: 90, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(6px)" }} />
    <Tag x={1600} y={120} txt="open fields only" s={pop(tt, 1.5, 7, 0.5)} size={56} tt={tt} />
  </>;
}} />;

// m21-22 · el saque de billar: las bolas-chancho en triángulo sobre el paño; el taco golpea, la piara se abre y cada bola cae en una tronera con nombre de condado nuevo
export const HScatterBurst: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const hit = 1.6, cue = eio(tt, 0.4, hit), sp = Math.max(0, tt - hit), POCK = [[260, 240], [960, 220], [1660, 240], [260, 900], [960, 920], [1660, 900]] as [number, number][];
  const NAMES = ["new county", "next creek", "the river", "state line", "the woods", "your farm"];
  return <>
    <CShadow x={960} y={1000} w={1800} />
    <div style={{ position: "absolute", left: 160, top: 160, width: 1600, height: 820, borderRadius: 40, background: "linear-gradient(160deg,#6a3a1a,#3a1a0a)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 70, background: "radial-gradient(#2a8a4a,#1a5a2a)", boxShadow: "inset 0 0 50px rgba(0,0,0,.6)" }}><Grain id="sbf" o={0.25} f={0.9} /></div></div>
    {POCK.map(([x, y], i) => <React.Fragment key={i}><div style={{ position: "absolute", left: x, top: y, width: 90, height: 90, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(#000,#1a1a1a 70%)" }} />
      <div style={{ position: "absolute", left: x, top: y + (y < 500 ? -110 : 60), transform: "translate(-50%,0)", fontFamily: HAND, fontSize: 40, color: "#f3e6c6", opacity: cl((sp - 0.6) * 2), whiteSpace: "nowrap", textShadow: "0 3px 6px #000" }}>{NAMES[i]}</div></React.Fragment>)}
    {Array.from({ length: 6 }, (_, i) => { const row = i < 1 ? 0 : i < 3 ? 1 : 2, col = i < 1 ? 0 : i < 3 ? i - 1 : i - 3, x0 = 1180 + row * 70, y0 = 570 + (col - row / 2) * 80;
      const [px, py] = POCK[i], k = eio(sp, 0, 1.2 + i * 0.1), x = x0 + (px - x0) * k, y = y0 + (py - y0) * k, sc = sp > 1.2 + i * 0.1 ? 0 : 1;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 76, height: 76, transform: `translate(-50%,-50%) scale(${sc})`, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#a8907a,#4a3a30 60%,#1a120e)", boxShadow: "6px 10px 8px rgba(0,0,0,.5)" }}>
        <svg width={76} height={76} viewBox="0 0 76 76"><ellipse cx={46} cy={40} rx={9} ry={6} fill="#7a5a4a" /><circle cx={40} cy={30} r={3} fill="#000" /></svg></div>; })}
    <div style={{ position: "absolute", left: 600 + 520 * cue - 40 * eio(tt, hit, hit + 0.3), top: 570, width: 76, height: 76, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#d8d4c8 60%,#9a968a)", boxShadow: "6px 10px 8px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: -240 + 600 * cue - 300 * eio(tt, hit + 0.2, hit + 1), top: 556, width: 760, height: 28, borderRadius: 14, background: "linear-gradient(90deg,#3a1a0a,#c89a62 70%,#f3e6c6 96%,#3a6a9a 96%)", boxShadow: "0 14px 14px rgba(0,0,0,.5)" }} />
    {sp > 0 && sp < 0.4 && <Puff x={1160} y={570} r={80} col="rgba(255,255,255,.7)" o={1 - sp * 2.5} />}
  </>;
}} />;

// m22-23 · el comedero con tapa: sólo el hocico del chancho la levanta; el mapache tira y no puede; al final cae el martillo del juez sobre la mesa
export const HBaitFeeder: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lid = eio(tt, 1.4, 2.2) * (1 - eio(tt, 4, 4.6)), rac = Math.sin(tt * 6) * 6 * (tt < 4 ? 1 : 0), gav = pop(tt, D(h) - 2.6, 10, 0.3);
  return <>
    <CShadow x={900} y={940} w={800} />
    <Box x={900} y={940} w={560} h={360} d={300} rx={-20} ry={0} front="linear-gradient(#5a7a4a,#2a4a2a)" top="linear-gradient(#6a8a5a,#3a5a3a)" side="#1a3a1a" />
    <div style={{ position: "absolute", left: 900, top: 580, width: 600, height: 60, transform: `translate(-50%,-50%) perspective(900px) rotateX(${-60 * lid}deg)`, transformOrigin: "50% 100%", background: "linear-gradient(#8a9a7a,#4a5a3a)", boxShadow: "0 14px 16px rgba(0,0,0,.45)" }} />
    {lid > 0.3 && Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: 760 + (k % 5) * 60, top: 560 + Math.floor(k / 5) * 20, width: 30, height: 18, borderRadius: "50%", background: "#e8c040" }} />)}
    <Hog3 x={470 + 80 * eio(tt, 0.4, 1.4)} y={860} s={1} tt={tt * (tt < 1.4 ? 1 : 0)} />
    <svg width={260} height={240} viewBox="0 0 260 240" style={{ position: "absolute", left: 1200, top: 660, transform: `rotate(${rac}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.5))" }}>
      <ellipse cx={120} cy={170} rx={80} ry={56} fill="#7a7a72" /><path d="M200 180 Q250 160 250 220" stroke="#3a3a36" strokeWidth={20} fill="none" strokeDasharray="14 10" /><circle cx={80} cy={100} r={50} fill="#8a8a82" /><path d="M40 92 Q80 76 120 92 L120 108 Q80 96 40 108 Z" fill="#1a1a18" /><circle cx={62} cy={100} r={6} fill="#fff" /><circle cx={98} cy={100} r={6} fill="#fff" /><path d="M40 80 L50 50 L66 70 Z M120 80 L110 50 L94 70 Z" fill="#5a5a52" /><path d="M30 150 L-10 110" stroke="#5a5a52" strokeWidth={16} strokeLinecap="round" /></svg>
    {gav > 0.01 && <div style={{ position: "absolute", left: 1500, top: 300 + 340 * cl(gav), transform: `rotate(${-40 + 40 * cl(gav)}deg)`, transformOrigin: "90% 50%", filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><svg width={360} height={120} viewBox="0 0 360 120"><rect x={0} y={20} width={150} height={80} rx={14} fill="#6a3a1a" /><rect x={20} y={20} width={14} height={80} fill="#c8a040" /><rect x={116} y={20} width={14} height={80} fill="#c8a040" /><rect x={150} y={50} width={210} height={20} rx={10} fill="#8a5a2a" /></svg></div>}
    {gav > 0.9 && <Puff x={1580} y={680} r={90} col="rgba(240,230,210,.6)" o={1 - (tt - (D(h) - 2.4))} />}
  </>;
}} />;

// m23 · tres faroles de kerosene en el estante; cada uno lleva su nombre en la chapa de la base y se apaga de a uno: bounty, hunting, poison
export const HThreeStrikes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#1a120c,#2a1a10)" f={(tt) => {
  const L = ["BOUNTY", "HUNTING", "POISON"];
  return <>
    <Box x={960} y={900} w={1600} h={60} d={220} rx={-20} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {L.map((l, i) => { const x = 480 + i * 480, off = eio(tt, 1.2 + i * 1.6, 1.8 + i * 1.6), fl = 1 - off, fk = 0.9 + 0.1 * Math.sin(tt * 13 + i * 3);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: 520, width: 700, height: 700, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(rgba(255,180,80,${0.35 * fl * fk}),transparent 60%)` }} />
        <svg width={260} height={520} viewBox="0 0 260 520" style={{ position: "absolute", left: x - 130, top: 380, filter: "drop-shadow(14px 22px 16px rgba(0,0,0,.6))" }}>
          <defs><linearGradient id={"lb" + i} x1="0" x2="1"><stop offset="0" stopColor="#5a4a2a" /><stop offset=".5" stopColor="#c8a050" /><stop offset="1" stopColor="#4a3a1a" /></linearGradient></defs>
          <path d="M100 0 Q130 -10 160 0 L160 40 L100 40 Z" fill={`url(#lb${i})`} /><path d="M70 40 L190 40 L210 80 L50 80 Z" fill={`url(#lb${i})`} />
          <path d="M60 80 Q20 200 70 300 L190 300 Q240 200 200 80 Z" fill={`rgba(255,240,210,${0.25 + 0.3 * fl})`} stroke="#8a7a5a" strokeWidth={4} />
          <ellipse cx={130} cy={230 - 10 * fk * fl} rx={22 * fl} ry={46 * fl * fk} fill="#ffd060" /><ellipse cx={130} cy={240 - 6 * fk * fl} rx={10 * fl} ry={22 * fl} fill="#fff6c8" />
          <path d="M40 300 L220 300 L240 400 L20 400 Z" fill={`url(#lb${i})`} /><rect x={50} y={330} width={160} height={50} rx={6} fill="#e8dcb8" /><text x={130} y={366} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#2a1a0a">{l}</text></svg>
        {off > 0 && [0, 1].map((k) => <Puff key={k} x={x + 20 * Math.sin(tt * 2 + k)} y={560 - (tt - 1.8 - i * 1.6) * 90 - k * 40} r={30 + k * 16} col="rgba(200,200,195,.5)" o={cl(2 - (tt - 1.8 - i * 1.6))} />)}
      </React.Fragment>; })}
  </>;
}} />;

// m24 · el retrato de familia: marco ovalado colgado en la pared; la piara posa, salta el flash de magnesio y queda la foto sepia con cada miembro contado
export const HSounderFamily: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fl = Math.max(0, 1 - Math.abs(tt - 2.4) * 3), sep = eio(tt, 2.4, 3.2), M = [[-260, 30, 1, 0], [30, 10, 1.1, 0], [300, 40, 0.9, 0], [-150, 150, 0.5, 1], [80, 160, 0.5, 1], [260, 170, 0.45, 1], [-20, 190, 0.4, 1]];
  const cnt = Math.min(M.length, Math.max(0, Math.floor((tt - 3.4) * 2.2)));
  return <>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,#7a5a3a 0 4px,#8a6a4a 4px 90px)", boxShadow: "inset 0 0 160px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960, top: 540, width: 1100, height: 780, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#e8c060,#a8781a 60%,#5a3a0a)", boxShadow: "0 40px 50px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960, top: 540, width: 960, height: 640, transform: "translate(-50%,-50%)", borderRadius: "50%", overflow: "hidden", background: `linear-gradient(rgba(${200 - 40 * sep},${190 - 50 * sep},${170 - 70 * sep},1),rgba(${120 - 20 * sep},${110 - 30 * sep},${90 - 40 * sep},1))`, filter: `sepia(${sep})` }}>
      {M.map(([x, y, s, pig], i) => <Hog3 key={i} x={480 + x} y={300 + y} s={s} tusk={!pig} walk={false} shadow={false} />)}
      {M.slice(0, cnt).map(([x, y], i) => <div key={i} style={{ position: "absolute", left: 480 + x, top: 230 + y, width: 50, height: 50, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "#f3e6c6", border: "4px solid #2a1a0a", fontFamily: FONT, fontWeight: 900, fontSize: 30, textAlign: "center", lineHeight: "42px", color: "#2a1a0a" }}>{i + 1}</div>)}</div>
    <div style={{ position: "absolute", left: 960, top: 910, transform: "translate(-50%,0)", padding: "6px 30px", background: "linear-gradient(#e8c060,#a8781a)", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 48, color: "#2a1a0a", boxShadow: "0 8px 10px rgba(0,0,0,.5)" }}>ONE SOUNDER</div>
    {fl > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,240,${fl * 0.8})` }} />}
  </>;
}} />;

// m24-25 · el chancho que aprendió: camina hacia la jaula trampa, ve las rejas, frena, aparece el «!» y retrocede
export const HTrapShy: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fw = eio(tt, 0.4, 2.4), bk = eio(tt, 3.6, 5.6), x = 300 + 560 * fw - 500 * bk, ex = pop(tt, 2.8, 9, 0.4) * (1 - eio(tt, 6, 6.4));
  return <>
    <CShadow x={1360} y={900} w={760} />
    <div style={{ position: "absolute", left: 1000, top: 900, width: 700, height: 400, transform: "translateY(-100%)", background: "repeating-linear-gradient(90deg,rgba(150,155,160,.95) 0 8px,transparent 8px 44px)", border: "12px solid #6a7076", boxShadow: "0 20px 26px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 8, background: "#8a9096" }} /><div style={{ position: "absolute", left: 0, right: 0, top: 250, height: 8, background: "#8a9096" }} /></div>
    {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 1150 + (k % 6) * 60, top: 860 - Math.floor(k / 6) * 20, width: 30, height: 18, borderRadius: "50%", background: "#e8c040" }} />)}
    <Hog3 x={x} y={840} s={1.1} tt={tt * (fw < 1 || (bk > 0 && bk < 1) ? 1 : 0)} />
    {ex > 0.01 && <div style={{ position: "absolute", left: x + 60, top: 560, transform: `translate(-50%,-50%) scale(${ex})`, width: 140, height: 140, borderRadius: "50%", background: "#f3e6c6", border: "6px solid #2a1a0a", fontFamily: MARK, fontSize: 120, lineHeight: "130px", textAlign: "center", color: "#b3221a", boxShadow: "0 12px 16px rgba(0,0,0,.5)" }}>!</div>}
    <Tag x={1700} y={200} txt="trap-shy" s={pop(tt, 4.6, 7, 0.5)} size={64} tt={tt} />
  </>;
}} />;

// m25 · el corral redondo: paneles en círculo con maíz al centro; entran todos de a uno y la compuerta guillotina cae sólo con el último adentro
export const HCorralGate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 7, drop = eio(tt, 0.8 + N * 0.55 + 0.3, 0.8 + N * 0.55 + 0.6);
  return <>
    <CShadow x={960} y={760} w={1400} />
    <div style={{ position: "absolute", left: 960, top: 600, width: 1300, height: 1300, transform: "translate(-50%,-50%) perspective(1600px) rotateX(66deg)" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(#7a5a32,#5a3e22 70%)", boxShadow: "inset 0 0 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "26px dashed #9aa0a6", boxShadow: "0 0 0 10px #6a7076" }} />
      {Array.from({ length: 40 }, (_, k) => <div key={k} style={{ position: "absolute", left: 620 + (k % 8) * 10 - 40, top: 620 + Math.floor(k / 8) * 10 - 25, width: 14, height: 9, borderRadius: "50%", background: "#e8c040" }} />)}</div>
    {Array.from({ length: N }, (_, i) => { const a = eio(tt, 0.8 + i * 0.55, 1.4 + i * 0.55), ang = (i / N) * Math.PI * 2, tx = 960 + 220 * Math.cos(ang), ty = 620 + 70 * Math.sin(ang);
      const x = 1700 + (tx - 1700) * a, y = 860 + (ty - 860) * a; return <Hog3 key={i} x={x} y={y} s={0.5} tt={tt * 1.5 + i} flip />; })}
    <div style={{ position: "absolute", left: 1560, top: 500 + 220 * drop, width: 200, height: 260, transform: "translate(-50%,-50%)", background: "repeating-linear-gradient(90deg,#9aa0a6 0 8px,transparent 8px 34px), linear-gradient(#5a5e62,#3a3e42) top/100% 14px no-repeat", border: "8px solid #6a7076", boxShadow: "0 14px 16px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1460, top: 200, width: 14, height: 520, background: "#4a3220" }} /><div style={{ position: "absolute", left: 1640, top: 200, width: 14, height: 520, background: "#4a3220" }} />
    {drop > 0.95 && tt < 0.8 + N * 0.55 + 1.4 && <Puff x={1560} y={760} r={110} col="rgba(200,170,130,.6)" o={1 - (tt - (0.8 + N * 0.55 + 0.6)) * 1.3} />}
    <div style={{ position: "absolute", left: 300, top: 200, width: 20, height: 600, background: "#4a3220" }} />
    <div style={{ position: "absolute", left: 270, top: 240, width: 90, height: 120, borderRadius: 14, background: "linear-gradient(#5a6a3a,#2a3a1a)", boxShadow: "0 10px 12px rgba(0,0,0,.5)" }}><div style={{ width: 40, height: 40, margin: "20px auto", borderRadius: "50%", background: "radial-gradient(#3a5a8a,#0a0a1a)", border: "4px solid #1a1a1a" }} /><div style={{ width: 10, height: 10, margin: "-10px auto", borderRadius: "50%", background: Math.floor(tt * 3) % 2 ? "#ff3020" : "#5a1a10" }} /></div>
  </>;
}} />;

// m26 · el teléfono sobre la mesa: llega la foto infrarroja de la cámara trampa; un dedo cuenta los chanchos y el contador llega a «ALL IN»
export const HTrailCam: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [[-180, 40], [-60, 80], [60, 30], [180, 70], [-120, 170], [100, 170], [0, 120]], c = Math.min(P.length, Math.floor(eio(tt, 1.4, D(h) - 2) * (P.length + 0.99))), all = c >= P.length;
  return <>
    <CShadow x={960} y={980} w={700} />
    <div style={{ position: "absolute", left: 960, top: 540, width: 560, height: 900, transform: "translate(-50%,-50%) rotate(-4deg)", borderRadius: 60, background: "linear-gradient(135deg,#3a3e42,#0a0c0e)", boxShadow: "0 40px 50px rgba(0,0,0,.6), inset 0 0 0 4px #6a6e72", padding: 26, boxSizing: "border-box" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: "#0a0a0a" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 460, background: "radial-gradient(ellipse at 50% 70%,#6a7a6a,#1a2a1a 80%)", filter: "grayscale(.6) brightness(1.1)", opacity: eio(tt, 0.4, 1) }}>
          {P.map(([x, y], i) => <div key={i} style={{ position: "absolute", left: 254 + x, top: 200 + y, transform: "translate(-50%,-50%)" }}><Hog3 x={0} y={0} s={0.42} walk={false} shadow={false} flip={i % 2 === 1} /><div style={{ position: "absolute", left: -40, top: -40, width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(#fff,#a8ffa8 50%,transparent 70%)" }} /></div>)}
          {P.slice(0, c).map(([x, y], i) => <div key={i} style={{ position: "absolute", left: 254 + x, top: 150 + y, width: 46, height: 46, transform: "translate(-50%,-50%)", borderRadius: "50%", border: "5px solid #ffd040", fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#ffd040", textAlign: "center", lineHeight: "36px" }}>{i + 1}</div>)}
          <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: "'Courier New', monospace", fontSize: 22, color: "#d8ffd8" }}>02:14 AM  CAM 3</div></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: MARK, fontSize: all ? 110 : 150, color: all ? "#6ae86a" : "#f3f0e6" }}>{all ? "ALL IN" : c}</div></div></div>
    <svg width={260} height={200} viewBox="0 0 260 200" style={{ position: "absolute", left: 1100 + 30 * Math.sin(tt * 4), top: 420 + 30 * Math.cos(tt * 3), opacity: cl(tt - 1.2) * (all ? 0 : 1), filter: "drop-shadow(10px 14px 10px rgba(0,0,0,.45))" }}><path d="M0 120 Q20 60 70 70 L200 60 Q230 60 230 80 Q230 96 200 96 L120 104 Q140 150 100 170 L20 170 Z" fill="#d8a888" /></svg>
  </>;
}} />;

// m27 · la guirnalda de faroles: un farol por estado colgado de la soga; los del norte y oeste se apagan uno tras otro: llegaron a cero
export const HProgramMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#0e1420,#1a2230)" f={(tt) => {
  const L = ["NEW YORK", "MAINE", "IDAHO", "IOWA", "NEW JERSEY", "WASHINGTON", "TEXAS", "FLORIDA"], OFF = [0, 1, 2, 3, 4, 5];
  return <>
    <svg width={1920} height={300} style={{ position: "absolute", left: 0, top: 80 }}><path d="M0 40 Q960 220 1920 40" stroke="#6a5a42" strokeWidth={6} fill="none" /></svg>
    {L.map((l, i) => { const x = 160 + i * 228, y = 120 + 150 * Math.sin((x / 1920) * Math.PI) * 0.95, k = OFF.includes(i) ? eio(tt, 1 + i * 0.7, 1.4 + i * 0.7) : 0, on = 1 - k, sw = 3 * Math.sin(tt * 1.5 + i);
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ width: 4, height: 60, margin: "0 auto", background: "#6a5a42" }} />
        <div style={{ position: "absolute", left: -120, top: 60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(rgba(255,190,90,${0.45 * on}),transparent 65%)` }} />
        <div style={{ width: 120, height: 170, margin: "0 auto", borderRadius: "40px 40px 30px 30px", background: on > 0.5 ? "radial-gradient(#fff6c8,#ffb040 60%,#c87a1a)" : "radial-gradient(#4a4440,#2a2420)", boxShadow: `0 16px 20px rgba(0,0,0,.5), 0 0 ${40 * on}px rgba(255,180,80,.6)`, border: "6px solid #3a2a1a" }} />
        <div style={{ marginTop: 14, padding: "4px 10px", background: "#e8dcb8", fontFamily: FONT, fontWeight: 900, fontSize: 24, color: "#2a1a0a", textAlign: "center", whiteSpace: "nowrap", boxShadow: "0 6px 8px rgba(0,0,0,.5)" }}>{l}</div>
        {k > 0.9 && <div style={{ textAlign: "center", fontFamily: MARK, fontSize: 60, color: "#9ad89a", marginTop: 6 }}>0</div>}</div>; })}
  </>;
}} />;

// m28 · tres parcelas con cerco de juguete vistas desde arriba: la piara duerme en una, toma agua en otra, come en la tercera; la trampa de un solo dueño vacía sólo su cuadro
export const HPropertyLines: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [["SLEEP", "#5a6a3a"], ["DRINK", "#4a6a6a"], ["EAT", "#7a7a3a"]] as [string, string][], ph = Math.min(2, Math.floor(eio(tt, 0.4, 5.2) * 2.99)), tr = eio(tt, 5.6, 6.4);
  return <>
    <CShadow x={960} y={960} w={1700} />
    {P.map(([l, c], i) => <div key={i} style={{ position: "absolute", left: 140 + i * 560, top: 240, width: 520, height: 620, background: `repeating-linear-gradient(80deg,${c} 0 8px,rgba(0,0,0,.1) 8px 14px)`, border: "14px solid #c8a070", boxShadow: "0 20px 26px rgba(0,0,0,.45), inset 0 0 40px rgba(0,0,0,.35)", transform: "perspective(1400px) rotateX(18deg)", transformOrigin: "50% 100%" }}>
      {i === 1 && <div style={{ position: "absolute", left: 120, top: 220, width: 280, height: 180, borderRadius: "50%", background: "radial-gradient(#5a8aaa,#2a5a7a)" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: MARK, fontSize: 70, color: "#f3e6c6", textShadow: "0 4px 8px #000" }}>{l}</div></div>)}
    {Array.from({ length: 6 }, (_, k) => { const inTrap = i0(k) && tr > 0.5; const x = 400 + ph * 560 + (k % 3) * 80 - 80 + 10 * Math.sin(tt * 3 + k), y = 520 + Math.floor(k / 3) * 90;
      return inTrap ? null : <Hog3 key={k} x={x} y={y} s={0.36} tt={tt * 2 + k} />; })}
    {tr > 0 && <div style={{ position: "absolute", left: 1460, top: 300, width: 280, height: 200, transform: `scale(${pop(tt, 5.6, 8, 0.4)})`, background: "repeating-linear-gradient(90deg,rgba(150,155,160,.9) 0 6px,transparent 6px 30px)", border: "8px solid #6a7076", boxShadow: "0 14px 16px rgba(0,0,0,.45)" }} />}
    <Tag x={1600} y={120} txt="one trap, one fence" s={pop(tt, 6.2, 7, 0.5)} size={50} tt={tt} />
  </>;
}} />;
const i0 = (k: number) => k === 0;

// m28-29 · el arroyo de los vecinos: una cinta de agua cruza la maqueta y todas las casitas a su orilla prenden la luz del porche juntas
export const HCreekNeighbors: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#1a2030,#2a3040 50%,#2a3a22 52%,#1a2a12)" f={(tt) => {
  const on = eio(tt, 2.6, 3.2), Hs = [[300, 420], [620, 640], [940, 450], [1260, 660], [1580, 440]];
  return <>
    <svg width={1920} height={600} style={{ position: "absolute", left: 0, top: 480 }}><path d="M-20 140 Q300 60 620 200 T1260 220 T1940 160" stroke="#3a6a8a" strokeWidth={90} fill="none" /><path d="M-20 140 Q300 60 620 200 T1260 220 T1940 160" stroke="rgba(200,230,255,.3)" strokeWidth={8} strokeDasharray="30 60" strokeDashoffset={-tt * 80} fill="none" /></svg>
    {Hs.map(([x, y], i) => { const lit = cl(on * 1.2 - i * 0.05); return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x, top: y, width: 380, height: 380, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(rgba(255,200,110,${0.4 * lit}),transparent 60%)` }} />
      <svg width={220} height={200} viewBox="0 0 220 200" style={{ position: "absolute", left: x - 110, top: y - 150, filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.6))" }}><path d="M10 80 L110 10 L210 80 Z" fill="#6a3a2a" /><rect x={30} y={80} width={160} height={110} fill="#c8b898" /><rect x={50} y={110} width={40} height={36} fill={lit > 0.5 ? "#ffd070" : "#2a2a30"} /><rect x={130} y={110} width={40} height={36} fill={lit > 0.5 ? "#ffd070" : "#2a2a30"} /><rect x={92} y={140} width={36} height={50} fill="#4a2a1a" /></svg></React.Fragment>; })}
    <Tag x={960} y={60} txt="same creek, same hogs" s={pop(tt, 3.6, 7, 0.5)} size={54} tt={tt} />
  </>;
}} />;

// m29-30 · el alambre eléctrico a la altura del hocico: aisladores en los postes, el chancho lo toca, chispazo, retrocede; el maíz de atrás queda en pie
export const HHotWire: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const app = eio(tt, 0.4, 2.2), zap = tt > 2.2 && tt < 2.7, bk = eio(tt, 2.4, 3.6), x = 200 + 640 * app - 420 * bk;
  return <>
    {Array.from({ length: 22 }, (_, k) => <div key={k} style={{ position: "absolute", left: 1060 + (k % 11) * 76, top: 860 - Math.floor(k / 11) * 50, width: 16, height: 440, transform: `translateY(-100%) rotate(${2 * Math.sin(tt + k)}deg)`, transformOrigin: "50% 100%", background: "linear-gradient(90deg,#4a7a2a,#7aaa3a,#4a7a2a)", borderRadius: 8 }}><div style={{ position: "absolute", left: -10, top: 60, width: 36, height: 90, borderRadius: "50%", background: "linear-gradient(#e8c040,#a8801a)" }} /></div>)}
    <Box x={960} y={1010} w={1900} h={70} d={260} rx={-24} ry={0} front="linear-gradient(#5a3e22,#2a1a0c)" top={DIRT} side="#2a1a0c" />
    {[960, 1860].map((px) => <div key={px} style={{ position: "absolute", left: px, top: 940, width: 22, height: 260, transform: "translate(-50%,-100%)", background: "linear-gradient(90deg,#4a3220,#8a6238,#4a3220)" }}><div style={{ position: "absolute", left: -6, top: 140, width: 34, height: 28, borderRadius: 8, background: "#f3d040" }} /></div>)}
    <div style={{ position: "absolute", left: 960, right: 60, top: 834, height: 5, background: zap ? "#fff" : "#c8ccd0", boxShadow: zap ? "0 0 20px #8ad0ff" : "none" }} />
    <Hog3 x={x} y={860} s={1.1} tt={tt * ((app > 0 && app < 1) || (bk > 0 && bk < 1) ? 1 : 0)} />
    {zap && <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ position: "absolute", left: 960 - 150 + 20, top: 836 - 150 }}>{Array.from({ length: 8 }, (_, k) => <path key={k} d={`M0 0 L${Math.cos(k) * 60} ${Math.sin(k) * 60} L${Math.cos(k + 0.3) * 120} ${Math.sin(k + 0.3) * 120}`} stroke="#d8f0ff" strokeWidth={5} fill="none" />)}<circle r={30} fill="#fff" /></svg>}
    <Tag x={500} y={160} txt="snout height" s={pop(tt, 1.2, 7, 0.5)} size={60} tt={tt} />
  </>;
}} />;

// m30 · la caja de herramientas: se levantan y salen el rifle y el helicóptero de juguete; entran la trampa, la cámara, la bolsa de maíz y el apretón de manos
export const HHeroSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const outK = eio(tt, 0.6, 2), inK = [0, 1, 2, 3].map((i) => fall(tt, 2.4 + i * 0.6));
  const IN = ["trap", "camera", "corn", "neighbors"], C = ["#8a9096", "#3a4a2a", "#e8c040", "#d8a888"];
  return <>
    <Box x={960} y={980} w={1400} h={260} d={460} rx={-30} ry={0} front="linear-gradient(#b3221a,#6a120a)" top="linear-gradient(#3a0a06,#1a0402)" side="#4a0a06" />
    <div style={{ position: "absolute", left: 960, top: 720, width: 1400, height: 60, transform: "translate(-50%,-100%) perspective(1200px) rotateX(70deg)", transformOrigin: "50% 100%", background: "linear-gradient(#c8322a,#8a1a12)", boxShadow: "0 -10px 20px rgba(0,0,0,.4)" }} />
    <svg width={700} height={120} viewBox="0 0 700 120" style={{ position: "absolute", left: 300 - 200 * outK, top: 620 - 600 * outK, transform: `rotate(${-20 * outK}deg)`, opacity: 1 - outK, filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><rect x={0} y={40} width={520} height={20} fill="#3a3a3a" /><path d="M500 30 L700 40 L700 90 L560 100 L520 60 Z" fill="#6a3a1a" /></svg>
    <svg width={400} height={200} viewBox="0 0 400 200" style={{ position: "absolute", left: 1200 + 300 * outK, top: 560 - 600 * outK, opacity: 1 - outK, filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}><ellipse cx={160} cy={110} rx={110} ry={60} fill="#3a5a3a" /><rect x={260} y={100} width={140} height={18} fill="#3a5a3a" /><rect x={20} y={30} width={280} height={8} fill="#1a1a1a" transform={`rotate(${tt * 900} 160 34)`} /></svg>
    {inK.map((f, i) => f.s > 0.01 && <div key={i} style={{ position: "absolute", left: 470 + i * 330, top: 560 + f.y, transform: "translate(-50%,-50%)", filter: "drop-shadow(12px 18px 12px rgba(0,0,0,.5))" }}>
      <div style={{ width: 240, height: 170, borderRadius: i === 2 ? "30px 30px 20px 20px" : 16, background: i === 0 ? `repeating-linear-gradient(90deg,${C[0]} 0 6px,transparent 6px 26px), linear-gradient(#5a5e62,#3a3e42)` : i === 2 ? "linear-gradient(#e8dcb8,#b8a878)" : `linear-gradient(${C[i]},rgba(0,0,0,.5))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {i === 1 && <div style={{ width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(#3a5a8a,#0a0a1a)", border: "6px solid #1a1a1a" }} />}
        {i === 2 && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#6a4a1a" }}>CORN</div>}
        {i === 3 && <svg width={200} height={110} viewBox="0 0 200 110"><path d="M0 40 L80 40 Q110 30 130 50 L200 50 L200 80 L120 90 Q90 100 70 80 L0 80 Z" fill="#8a5a3a" /><path d="M60 60 Q100 40 140 66" stroke="#c89070" strokeWidth={16} fill="none" /></svg>}</div>
      <div style={{ textAlign: "center", marginTop: 8, fontFamily: HAND, fontSize: 48, color: "#f3e6c6", textShadow: "0 4px 8px #000" }}>{IN[i]}</div></div>)}
  </>;
}} />;

// m31 · el cartel de chapa de la ruta: se atornilla al poste con dos tuercas que giran: «NO LIVE HOG TRANSPORT · FINE»
export const HNoTransport: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c0d8 0%,#d8e0e0 55%,#8a9a6a 57%,#5a6a3a 100%)" f={(tt) => {
  const up = pop(tt, 0.4, 7, 0.45), bolt = eio(tt, 1.2, 2.6);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 120, background: "linear-gradient(#4a4a4a,#2a2a2a)" }}><div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 10, background: "repeating-linear-gradient(90deg,#f3d040 0 80px,transparent 80px 160px)", backgroundPosition: `${-tt * 300}px 0` }} /></div>
    <div style={{ position: "absolute", left: 960, top: 1080, width: 34, height: 780, transform: "translate(-50%,-100%)", background: "linear-gradient(90deg,#6a7076,#d0d4d8,#6a7076)" }} />
    <div style={{ position: "absolute", left: 960, top: 420 - (1 - cl(up)) * 300, width: 1000, height: 420, transform: `translate(-50%,-50%) rotate(${(1 - bolt) * -6}deg)`, borderRadius: 24, background: "linear-gradient(135deg,#fbfaf4,#d8d8d0)", border: "16px solid #b3221a", boxShadow: "0 30px 40px rgba(0,0,0,.45)", textAlign: "center", fontFamily: FONT, fontWeight: 900, color: "#1a1a1a", paddingTop: 50, boxSizing: "border-box" }}>
      <div style={{ fontSize: 86, lineHeight: 1 }}>NO LIVE HOG</div><div style={{ fontSize: 86, lineHeight: 1.1 }}>TRANSPORT</div><div style={{ fontSize: 64, color: "#b3221a", marginTop: 16 }}>FINE</div>
      {[[-1, 1], [1, 1]].map(([sx], k) => <div key={k} style={{ position: "absolute", left: 470 + sx * 0, top: k ? 300 : 20, width: 44, height: 44, transform: `rotate(${bolt * 540}deg)`, background: "conic-gradient(#e0e4e8,#7a8086,#e0e4e8,#7a8086,#e0e4e8)", clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" }} />)}</div>
  </>;
}} />;

// m32-33 · la huella del tiempo: un sendero de pisadas de chancho en el barro que se pierde hacia el fondo; en cada pisada brilla un año
export const HHogTrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#8a9aa0 0%,#c8c0a8 30%,#6a4a2a 32%,#3a2614 100%)" f={(tt) => {
  const Y = [1539, 1700, 1900, 1980, 1990, 2000, 2010, 2025];
  return <>
    {Y.map((y, i) => { const k = i / (Y.length - 1), sc = 1.3 - k * 1.05, x = 960 + (i % 2 ? 90 : -90) * sc + Math.sin(k * 4) * 120, yy = 1000 - 640 * Math.pow(k, 0.7), s = pop(tt, 0.4 + i * 0.6, 8, 0.4);
      return s > 0.01 && <div key={i} style={{ position: "absolute", left: x, top: yy, transform: `translate(-50%,-50%) scale(${sc * cl(s)})` }}>
        <svg width={180} height={180} viewBox="0 0 180 180"><path d="M40 20 Q20 90 50 160 Q80 170 84 120 Q86 60 40 20 Z" fill="#2a1a0c" /><path d="M140 20 Q160 90 130 160 Q100 170 96 120 Q94 60 140 20 Z" fill="#2a1a0c" /><path d="M48 30 Q34 90 56 150" stroke="rgba(255,230,190,.15)" strokeWidth={6} fill="none" /></svg>
        <div style={{ position: "absolute", left: 90, top: 90, transform: "translate(-50%,-50%)", fontFamily: MARK, fontSize: 52, color: "#f3d080", textShadow: "0 0 14px rgba(255,200,90,.8)" }}>{y}</div></div>; })}
  </>;
}} />;

// m33 · el fichero rotativo: el tambor gira y cada ficha que queda arriba trae una pregunta, su respuesta y un triángulo de alerta
export const HTuskCards: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q = [["Seen rooting?", "call it in"], ["Sold a live hog?", "it's a fine"], ["One trap?", "talk to neighbors"]], seg = (D(h) - 1) / 3, i = Math.min(2, Math.floor(tt / seg)), ph = (tt % seg) / seg, rot = i * 40 + 40 * eio(ph, 0, 0.18);
  return <>
    <CShadow x={960} y={960} w={1000} />
    <svg width={1100} height={300} viewBox="0 0 1100 300" style={{ position: "absolute", left: 410, top: 700, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.5))" }}><path d="M100 280 L200 40 L240 40 L160 280 Z M1000 280 L900 40 L860 40 L940 280 Z" fill="#2a2e32" /><rect x={160} y={40} width={780} height={30} rx={15} fill="#6a7076" /><circle cx={1000} cy={55} r={50} fill="#3a3e42" /></svg>
    {[-2, -1, 0, 1, 2].map((k) => { const a = (k * 40 - (rot % 40)) / 57.3; if (Math.cos(a) < 0.2) return null; return <div key={k} style={{ position: "absolute", left: 960, top: 770 - 380 * Math.cos(a), width: 760, height: 440, transform: `translate(-50%,-100%) perspective(1600px) rotateX(${-a * 57.3}deg)`, transformOrigin: "50% 100%", background: "linear-gradient(#fbf7ec,#e8dcc0)", boxShadow: "0 10px 16px rgba(0,0,0,.35)", opacity: k === 0 ? 1 : 0.7, zIndex: 10 - Math.abs(k), padding: "40px 50px", boxSizing: "border-box", borderTop: "14px solid #b3221a" }}>
      {k === 0 && <><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#1a1a1a" }}>{Q[i][0]}</div><div style={{ fontFamily: HAND, fontSize: 80, color: "#1a5a2a", marginTop: 30, opacity: cl((ph - 0.3) * 4) }}>→ {Q[i][1]}</div>
        <svg width={110} height={100} viewBox="0 0 110 100" style={{ position: "absolute", right: 40, top: 40 }}><path d="M55 6 L104 94 L6 94 Z" fill="#f3c020" stroke="#1a1a1a" strokeWidth={6} /><rect x={50} y={36} width={10} height={32} fill="#1a1a1a" /><rect x={50} y={74} width={10} height={10} fill="#1a1a1a" /></svg></>}</div>; })}
  </>;
}} />;

// m34 · el repaso en el remolque: cada cajón que se sube por la rampa al remolque es un paso de la historia
export const HTrailerRecap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const ST = ["1539", "escaped", "hunting", "trailers", "traps"], seg = (D(h) - 0.8) / ST.length;
  return <>
    <CShadow x={1300} y={900} w={1000} />
    <svg width={1100} height={560} viewBox="0 0 1100 560" style={{ position: "absolute", left: 800, top: 360, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.5))" }}><defs><linearGradient id="trs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8ccd0" /><stop offset="1" stopColor="#6a7076" /></linearGradient></defs>
      <rect x={100} y={60} width={900} height={400} fill="url(#trs)" />{Array.from({ length: 14 }, (_, k) => <rect key={k} x={130 + k * 62} y={90} width={30} height={14} rx={7} fill="#3a3e42" />)}<rect x={100} y={460} width={900} height={30} fill="#3a3e42" />{[300, 460].map((x) => <circle key={x} cx={x} cy={500} r={56} fill="#1a1a1a" />)}<path d="M100 470 L-60 560" stroke="#6a7076" strokeWidth={30} /></svg>
    {ST.map((s, i) => { const a = 0.4 + i * seg, k = eio(tt, a, a + seg * 0.8); if (tt < a) return null; const x = 500 + 500 * k + (k >= 1 ? i * 0 : 0), y = 900 - 160 * k, inside = k >= 1;
      return <div key={i} style={{ position: "absolute", left: inside ? 1000 + (i % 3) * 170 : x, top: inside ? 780 - Math.floor(i / 3) * 140 : y, width: 160, height: 130, transform: "translate(-50%,-100%)", background: "repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 3px,transparent 3px 32px), linear-gradient(#c8a070,#8a6238)", boxShadow: "0 12px 14px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 40, color: "#2a170a", display: "flex", alignItems: "center", justifyContent: "center", opacity: inside ? 0.9 : 1 }}>{s}</div>; })}
  </>;
}} />;

// m35 · el volante: vista desde el asiento; las manos giran el volante y en el espejo retrovisor aparece la piara que llevamos atrás
export const HSteeringWheel: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8a880 0%,#e8d0a0 40%,#8a7a5a 42%,#5a4a32 100%)" f={(tt) => {
  const r = 40 * Math.sin(eio(tt, 0.6, 3) * Math.PI), mir = eio(tt, 2.4, 3.4);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: "linear-gradient(#2a2420,#3a3430)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 620, bottom: 0, background: "linear-gradient(#3a3430,#1a1614)", borderRadius: "60px 60px 0 0" }} />
    <div style={{ position: "absolute", left: 960, top: 210, width: 520, height: 170, transform: "translate(-50%,0)", borderRadius: 30, background: "#1a1a1a", padding: 14, boxSizing: "border-box", boxShadow: "0 14px 20px rgba(0,0,0,.5)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 20, overflow: "hidden", background: "linear-gradient(#c8b898,#8a7a5a)" }}>
        <div style={{ position: "absolute", left: 30, top: 30, width: 400, height: 110, background: "linear-gradient(#b8bcc0,#6a7076)" }} />
        {Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: 60 + k * 70, top: 50 + (k % 2) * 20, opacity: mir }}><Hog3 x={0} y={40} s={0.26} walk={false} shadow={false} flip /></div>)}</div></div>
    <svg width={900} height={900} viewBox="-450 -450 900 900" style={{ position: "absolute", left: 510, top: 520, transform: `rotate(${r}deg)`, filter: "drop-shadow(20px 30px 20px rgba(0,0,0,.6))" }}>
      <circle r={380} fill="none" stroke="#2a2420" strokeWidth={60} /><circle r={380} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={6} /><path d="M-370 40 L-90 40 L-70 120 L70 120 L90 40 L370 40" stroke="#2a2420" strokeWidth={50} fill="none" /><circle r={100} fill="#3a3430" /><circle r={40} fill="#c8a040" />
      {[-1, 1].map((k) => <path key={k} d={`M${k * 380} -40 q${k * 40} 30 ${k * 30} 120 l${-k * 60} 20 q${-k * 30} -60 ${-k * 20} -130 Z`} fill="#d8a888" />)}</svg>
    <Sheet x={1560} y={780} w={460} h={200} r={-6} id="sws"><div style={{ padding: "30px 30px", fontFamily: HAND, fontSize: 56, color: INK, lineHeight: 1.1 }}>they didn't spread.<br />we carried them.</div></Sheet>
  </>;
}} />;

export const HCE3: Record<string, React.FC<{ t: number; h: H }>> = {
  bountyBoard: HBountyBoard, heliView: HHeliView, scatterBurst: HScatterBurst, baitFeeder: HBaitFeeder, threeStrikes: HThreeStrikes, sounderFamily: HSounderFamily,
  trapShy: HTrapShy, corralGate: HCorralGate, trailCam: HTrailCam, programMap: HProgramMap, propertyLines: HPropertyLines, creekNeighbors: HCreekNeighbors,
  hotWire: HHotWire, heroSwap: HHeroSwap, noTransport: HNoTransport, hogTrack: HHogTrack, tuskCards: HTuskCards, trailerRecap: HTrailerRecap, steeringWheel: HSteeringWheel,
};
