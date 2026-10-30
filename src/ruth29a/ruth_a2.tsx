// ruth29a · 3ª vuelta (29-oct, notas a2 del evaluador): cada pieza = UN objeto grande y entero en cuadro, con volumen y sombra de contacto,
// y una acción física desde el primer segundo. La palabra vive DENTRO del objeto (nada de rótulos chicos ni esquinas). Pisa a ruth_a3 donde coinciden.
import React from "react";
import { H, Mode, Stage, cl, eio, HAND, MARK, img } from "./hkit";
import { FONT } from "./lib";
import { pop, INK, STAMP } from "./ruth_a";
import { CShadow, Grain, Box, Coin, Ant3, Mound, Boot, WOOD, WOODTOP, WOODSIDE, Mano, Odo, Splash, Puff, Sello } from "./obj";
import { HCA3 } from "./ruth_a3";

const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode; bg?: string }> = ({ t, h, f, bg }) => <Stage t={t} h={h} bg={bg} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
const D = (h: H) => Math.max(4, h.out - h.at);
const bt = (h: H, i: number, d: number) => (h.bt && h.bt[i] != null ? h.bt[i] : d);
const fall = (tt: number, at: number) => { const s = pop(tt, at, 9, 0.38); return { s, y: (1 - s) * -520, k: cl(s) }; };
const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;

// m0 · el avión fumigador amarillo pasa bajo sobre el potrero; justo debajo, la nube blanca va tapando cada vaca de a una
export const HPlaneDust: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8d8e0 0%,#e8e4d0 44%,#8aa058 46%,#4e6c28 100%)" f={(tt) => {
  const T = D(h) - 1.5, px = -500 + 2900 * eio(tt, 0.1, T), py = 250 + 30 * Math.sin(tt * 1.4), cows = [[300, 760], [620, 860], [940, 790], [1260, 880], [1580, 800]];
  return <>
    {Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 500 + k * 70, height: 4, background: "rgba(0,0,0,.08)" }} />)}
    {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: k * 360 - 40, top: 470, width: 300, height: 60, borderRadius: "50% 50% 0 0", background: "#5a7a32" }} />)}
    {cows.map(([x, y], i) => { const hit = cl((px - x + 100) / 300); const s = 0.9 + (y - 760) / 600;
      return <React.Fragment key={i}><CShadow x={x} y={y + 6} w={260 * s} />
        <svg width={300} height={210} viewBox="0 0 180 130" style={{ position: "absolute", left: x - 150 * s, top: y - 200 * s, width: 300 * s, height: 210 * s, transform: `scaleX(${i % 2 ? -1 : 1})`, overflow: "visible" }}><defs><radialGradient id={"cw" + i} cx="40%" cy="30%" r="80%"><stop offset="0" stopColor={i % 2 ? "#6a4a32" : "#fbf6ec"} /><stop offset="1" stopColor={i % 2 ? "#2a1a10" : "#b8ae9e"} /></radialGradient></defs>
          <path d="M20 40 Q30 20 70 26 L130 24 Q150 18 160 30 L172 34 L168 54 L150 52 L148 92 L138 92 L136 64 L70 66 L66 96 L54 96 L52 64 Q30 64 24 56 Z" fill={`url(#cw${i})`} stroke="#2a1e14" strokeWidth={2} />
          {i % 2 === 0 && <><ellipse cx={80} cy={44} rx={14} ry={10} fill="#2a1e14" /><ellipse cx={112} cy={38} rx={10} ry={8} fill="#2a1e14" /></>}<path d="M60 96 L60 124 M142 92 L142 124 M70 96 L72 122 M150 92 L148 122" stroke="#2a1e14" strokeWidth={6} /><circle cx={164} cy={38} r={3} fill="#000" /></svg>
        {hit > 0 && Array.from({ length: 6 }, (_, k) => <Puff key={k} x={x - 120 + k * 50 + 30 * Math.sin(tt + k)} y={y - 120 + 40 * (k % 2) + 30 * hit} r={110 * hit + 20} o={0.85 * hit} />)}</React.Fragment>; })}
    {Array.from({ length: 18 }, (_, k) => { const ag = k * 0.12, x = px - 160 - k * 70, d = cl((k * 0.12) / 1.2); return <Puff key={"t" + k} x={x} y={py + 120 + 380 * d + 20 * Math.sin(tt * 3 + k)} r={40 + 120 * d} o={0.9 - 0.4 * d + 0 * ag} />; })}
    <div style={{ position: "absolute", left: px - 260, top: 920, width: 520, height: 60, borderRadius: "50%", background: "rgba(0,0,0,.25)", filter: "blur(12px)" }} />
    <svg width={640} height={300} viewBox="0 0 640 300" style={{ position: "absolute", left: px - 320, top: py - 150, transform: `rotate(${3 * Math.sin(tt * 1.4)}deg)`, filter: "drop-shadow(18px 30px 18px rgba(0,0,0,.4))" }}><defs><linearGradient id="pdy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff07a" /><stop offset=".5" stopColor="#f0c020" /><stop offset="1" stopColor="#a87a0a" /></linearGradient></defs>
      <rect x={120} y={40} width={420} height={26} rx={12} fill="url(#pdy)" /><rect x={120} y={170} width={420} height={26} rx={12} fill="url(#pdy)" />{[220, 440].map((x) => <line key={x} x1={x} y1={66} x2={x} y2={170} stroke="#5a4a2a" strokeWidth={8} />)}
      <path d="M80 110 Q300 70 560 100 L600 130 Q300 170 80 150 Z" fill="url(#pdy)" /><path d="M40 90 L90 110 L90 150 L40 160 Z" fill="#d8a020" /><rect x={300} y={84} width={70} height={30} rx={8} fill="#3a4a5a" />
      <ellipse cx={612} cy={124} rx={14} ry={70 * Math.abs(Math.sin(tt * 40))} fill="rgba(60,60,60,.5)" /><circle cx={600} cy={124} r={10} fill="#5a5e62" />
      <path d="M200 160 L200 200 L220 200 M440 160 L440 200 L460 200" stroke="#3a3a3a" strokeWidth={6} fill="none" /><circle cx={210} cy={210} r={14} fill="#1a1a1a" /><circle cx={450} cy={210} r={14} fill="#1a1a1a" />
      {[260, 320, 380].map((x) => <rect key={x} x={x} y={150} width={10} height={14} fill="#5a5e62" />)}</svg>
  </>;
}} />;

// m1 · la carpeta del caso: entera sobre la mesa; se levantan de a una tres pestañas y de cada una salta su objeto (mazo que golpea, campana que se hamaca, moneda que gira)
export const HCaseFile: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const at = [0.5, bt(h, 0, 3), bt(h, 1, 5.6)], open = eio(tt, 0.1, 0.6);
  return <>
    <Box x={960} y={1060} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={960} y={940} w={1400} />
    <div style={{ position: "absolute", left: 960, top: 640, width: 1300, height: 560, transform: "translate(-50%,-50%) perspective(1600px) rotateX(38deg)", transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(160deg,#e8cf94,#c9a965)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}><Grain id="cfg" o={0.3} /></div>
      {at.map((a, i) => { const u = pop(tt, a, 7, 0.4); return <div key={i} style={{ position: "absolute", left: 120 + i * 380, top: -90, width: 320, height: 120, borderRadius: "18px 18px 0 0", background: "linear-gradient(#f0d8a0,#c9a965)", transformOrigin: "50% 100%", transform: `rotateX(${-70 * cl(u)}deg)`, boxShadow: "0 -6px 10px rgba(0,0,0,.2)" }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 130, color: "#5a3a1a", opacity: 0.85 * open, letterSpacing: 8 }}>CASE FILE</div></div>
    {at.map((a, i) => { const u = pop(tt, a + 0.2, 7, 0.4), x = 480 + i * 480, y = 380 - 120 * cl(u); if (u <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${cl(u)})`, filter: "drop-shadow(16px 26px 16px rgba(0,0,0,.5))" }}>
        {i === 0 ? <svg width={300} height={260} viewBox="0 0 300 260" style={{ transform: `rotate(${-30 + 40 * Math.max(0, Math.sin((tt - a) * 6)) * Math.exp(-(tt - a))}deg)`, transformOrigin: "40px 230px" }}><rect x={30} y={120} width={200} height={26} rx={10} fill="#8a5a30" transform="rotate(-30 40 230)" /><rect x={170} y={20} width={110} height={170} rx={20} fill="#6a3a1a" transform="rotate(-30 40 230)" /><rect x={170} y={60} width={110} height={18} fill="#d8b06a" transform="rotate(-30 40 230)" /></svg>
          : i === 1 ? <svg width={260} height={280} viewBox="0 0 260 280" style={{ transform: `rotate(${18 * Math.sin((tt - a) * 5) * Math.exp(-(tt - a) * 0.6)}deg)`, transformOrigin: "50% 0" }}><defs><linearGradient id="cfb" x1="0" x2="1"><stop offset="0" stopColor="#8a6a1a" /><stop offset=".4" stopColor="#f8e08a" /><stop offset="1" stopColor="#6a4a0a" /></linearGradient></defs><rect x={120} y={0} width={20} height={40} fill="#5a3a1a" /><path d="M130 40 Q50 50 46 170 L20 220 L240 220 L214 170 Q210 50 130 40 Z" fill="url(#cfb)" /><circle cx={130 + 20 * Math.sin((tt - a) * 5)} cy={238} r={22} fill="#8a6a1a" /></svg>
            : <div style={{ transform: `rotateY(${(tt - a) * 400}deg)` }}><Coin x={0} y={0} s={2.4} tilt={0} /></div>}</div>; })}
  </>;
}} />;

// m11-12 · la botella de leche: vidrio con reflejos, la leche sube con su menisco; la etiqueta de cartón cuelga del cordel y se hamaca; cae el sello «NOT FOR SALE»
export const HMilkBottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lv = eio(tt, 0.3, 3.2), sw = 14 * Math.sin(tt * 2.4) * Math.exp(-tt * 0.25), bx = 760, by = 960;
  return <>
    <Box x={960} y={1060} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={bx} y={by} w={460} />
    <svg width={460} height={820} viewBox="0 0 460 820" style={{ position: "absolute", left: bx - 230, top: by - 820 }}><defs>
      <clipPath id="mbc"><path d="M150 20 L310 20 L310 120 Q420 200 420 330 L420 760 Q420 810 370 810 L90 810 Q40 810 40 760 L40 330 Q40 200 150 120 Z" /></clipPath>
      <linearGradient id="mbm" x1="0" x2="1"><stop offset="0" stopColor="#d8d4c8" /><stop offset=".35" stopColor="#fffdf6" /><stop offset="1" stopColor="#c8c4b8" /></linearGradient></defs>
      <g clipPath="url(#mbc)"><rect x={0} y={810 - 640 * lv} width={460} height={820} fill="url(#mbm)" /><ellipse cx={230} cy={810 - 640 * lv} rx={200} ry={16} fill="#f6f2e6" stroke="#d8d4c8" strokeWidth={3} /></g>
      <path d="M150 20 L310 20 L310 120 Q420 200 420 330 L420 760 Q420 810 370 810 L90 810 Q40 810 40 760 L40 330 Q40 200 150 120 Z" fill="rgba(220,235,240,.18)" stroke="rgba(230,240,245,.85)" strokeWidth={8} />
      <path d="M80 340 Q80 240 160 170" stroke="rgba(255,255,255,.75)" strokeWidth={18} fill="none" strokeLinecap="round" /><rect x={84} y={380} width={20} height={360} rx={10} fill="rgba(255,255,255,.55)" /><rect x={360} y={360} width={10} height={380} rx={5} fill="rgba(255,255,255,.3)" />
      <rect x={140} y={0} width={180} height={40} rx={10} fill="#c8ccd0" /><rect x={140} y={0} width={180} height={12} rx={6} fill="#e8ecef" /></svg>
    <svg width={500} height={400} viewBox="0 0 500 400" style={{ position: "absolute", left: bx + 40, top: by - 720, overflow: "visible" }}><path d={`M10 10 Q${120 + sw * 3} 80 ${190 + sw * 6} 150`} stroke="#c8a870" strokeWidth={5} fill="none" /></svg>
    <div style={{ position: "absolute", left: bx + 230 + sw * 6, top: by - 570, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0", filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.45))" }}>
      <div style={{ width: 520, height: 300, borderRadius: "18px 60px 60px 18px", background: "linear-gradient(160deg,#e8d8b0,#c8b080)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: HAND, color: INK }}>
        <div style={{ position: "absolute", right: 30, top: 126, width: 44, height: 44, borderRadius: "50%", background: "#8a6a3a", boxShadow: "inset 0 4px 6px rgba(0,0,0,.5)" }} />
        <div style={{ fontSize: 66 }}>Sprayed pasture</div><div style={{ fontSize: 96, fontWeight: 700 }}>Lot 1959</div></div>
      <Sello tt={tt} at={D(h) - 2.2} x={250} y={150} txt="NOT FOR SALE" size={70} r={-12} /></div>
  </>;
}} />;

// m12 · la cinchada: soga de cáñamo tensa entre dos sellos de goma gigantes (USDA y FDA); del nudo cuelga el balde de lata del tambero, que se bambolea a cada tirón
export const HTugOfWar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tug = 70 * Math.sin(tt * 1.6) * eio(tt, 0.2, 1.2), kx = 960 + tug, ky = 470, sw = -tug * 0.4 + 10 * Math.sin(tt * 4.4);
  const SB = ({ x, txt, dir }: { x: number; txt: string; dir: number }) => <><CShadow x={x} y={960} w={520} />
    <div style={{ position: "absolute", left: x, top: 960, transform: `translate(-50%,-100%) rotate(${dir * (4 + tug * 0.05)}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(18px 26px 18px rgba(0,0,0,.5))" }}>
      <div style={{ width: 200, height: 260, margin: "0 auto", borderRadius: "100px 100px 30px 30px", background: "radial-gradient(circle at 35% 30%,#b8844e,#5a3418 70%)" }} /><div style={{ width: 110, height: 80, margin: "0 auto", background: "linear-gradient(90deg,#3a3e42,#b8bcc0,#3a3e42)" }} />
      <div style={{ width: 480, height: 150, borderRadius: 14, background: "linear-gradient(#7a4a26,#3a2410)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 110, color: "#f3e6c6", letterSpacing: 8, boxShadow: "inset 0 -20px 0 #a8322a" }}>{txt}</div></div></>;
  return <>
    <Box x={960} y={1060} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <SB x={330} txt="USDA" dir={1} /><SB x={1590} txt="FDA" dir={-1} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><defs><pattern id="rope" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="40" height="40" fill="#c8a060" /><rect width="16" height="40" fill="#8a6a3a" /></pattern></defs>
      <path d={`M430 520 Q${(430 + kx) / 2} ${ky + 18} ${kx} ${ky} Q${(kx + 1490) / 2} ${ky + 18} 1490 520`} stroke="#5a4020" strokeWidth={42} fill="none" /><path d={`M430 520 Q${(430 + kx) / 2} ${ky + 18} ${kx} ${ky} Q${(kx + 1490) / 2} ${ky + 18} 1490 520`} stroke="url(#rope)" strokeWidth={34} fill="none" />
      <circle cx={kx} cy={ky} r={44} fill="url(#rope)" stroke="#5a4020" strokeWidth={6} /></svg>
    <div style={{ position: "absolute", left: kx, top: ky + 30, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <svg width={300} height={420} viewBox="0 0 300 420" style={{ position: "absolute", left: -150, top: 0, overflow: "visible", filter: "drop-shadow(16px 26px 16px rgba(0,0,0,.45))" }}><defs><linearGradient id="tbk" x1="0" x2="1"><stop offset="0" stopColor="#6a6e72" /><stop offset=".35" stopColor="#e0e4e8" /><stop offset="1" stopColor="#4a4e52" /></linearGradient></defs>
        <path d="M150 0 L60 180 M150 0 L240 180" stroke="#3a3a3a" strokeWidth={6} /><path d="M40 180 L260 180 L230 400 L70 400 Z" fill="url(#tbk)" /><ellipse cx={150} cy={180} rx={110} ry={22} fill="#f6f2e6" stroke="#8a8e92" strokeWidth={6} />{[240, 320].map((y) => <path key={y} d={`M${50 + (y - 180) / 7} ${y} L${250 - (y - 180) / 7} ${y}`} stroke="rgba(0,0,0,.25)" strokeWidth={6} />)}
        {Math.abs(Math.sin(tt * 4.4)) > 0.92 && <circle cx={150 + 120 * Math.sign(Math.sin(tt * 4.4))} cy={170} r={10} fill="#fffdf6" />}</svg></div>
  </>;
}} />;

// m16 · la bolsa del presupuesto: bolsa de cuero con costuras sobre la mesa; caen monedas adentro, una mano tira del cordón y la boca se frunce; la etiqueta grande cuelga del cordón
export const HPurse: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const T = D(h), pull = eio(tt, T - 3.2, T - 2), mouth = 1 - 0.75 * pull, bx = 860, by = 960;
  return <>
    <Box x={960} y={1060} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={bx} y={by} w={680} />
    {Array.from({ length: 12 }, (_, k) => { const a = 0.3 + k * 0.32; if (a > T - 3.4) return null; const u = cl((tt - a) / 0.5); return u > 0 && u < 1 && <Coin key={k} x={bx - 60 + (k % 4) * 40} y={-80 + 560 * u * u} s={1.2} r={k * 40} tilt={40 + 30 * u} />; })}
    <svg width={760} height={720} viewBox="0 0 760 720" style={{ position: "absolute", left: bx - 380, top: by - 700, filter: "drop-shadow(18px 28px 20px rgba(0,0,0,.5))" }}><defs><radialGradient id="plg" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#b8784a" /><stop offset=".6" stopColor="#7a4626" /><stop offset="1" stopColor="#3a1e0c" /></radialGradient></defs>
      <path d={`M${380 - 210 * mouth} 210 Q100 300 90 480 Q100 690 380 700 Q660 690 670 480 Q660 300 ${380 + 210 * mouth} 210 Z`} fill="url(#plg)" />
      <ellipse cx={380} cy={210} rx={210 * mouth} ry={50 * mouth} fill="#2a140a" />{mouth > 0.5 && Array.from({ length: 7 }, (_, k) => <ellipse key={k} cx={300 + k * 26} cy={210 + (k % 2) * 10} rx={24} ry={10} fill="#e8c860" opacity={mouth} />)}
      <path d={`M${380 - 210 * mouth} 210 Q380 ${240 + 30 * pull} ${380 + 210 * mouth} 210`} stroke="#e0c090" strokeWidth={10} strokeDasharray="18 14" fill="none" />
      <path d="M150 460 Q380 520 610 460" stroke="#e0c090" strokeWidth={6} strokeDasharray="16 12" fill="none" /><path d="M200 300 Q260 500 220 640" stroke="rgba(255,220,180,.25)" strokeWidth={22} fill="none" />
      {[-1, 1].map((k) => <path key={k} d={`M${380 + k * 30 * mouth} 230 Q${380 + k * 60} ${300 + 90 * pull} ${380 + k * (80 + 180 * pull)} ${260 - 160 * pull}`} stroke="#d8b070" strokeWidth={16} fill="none" strokeLinecap="round" />)}</svg>
    {pull > 0 && <Mano x={bx + 80 + 180 * pull} y={by - 440 - 160 * pull} s={0.9} r={-20} sleeve="#3a3a4a" />}
    <div style={{ position: "absolute", left: bx + 380, top: by - 420 + 40 * Math.sin(tt * 2), transform: `rotate(${8 * Math.sin(tt * 2)}deg)`, transformOrigin: "0 0", filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.45))" }}>
      <div style={{ width: 560, padding: "26px 30px", borderRadius: "14px 50px 50px 14px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 70, lineHeight: 1.05, color: INK, textAlign: "center" }}>House<br />Appropriations</div></div>
  </>;
}} />;

// m19 · el lago Ontario en una lámina inclinada: el río de tinta roja baja desde la fábrica, entra al lago y se abre como una gota; el pescado de papel cae al centro; cruz roja
export const HLakeMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const rv = eio(tt, 0.3, 2.8), dr = eio(tt, 2.6, 4.4), fs = pop(tt, 4.2, 7, 0.4), x = pop(tt, D(h) - 2, 9, 0.35);
  const LAKE = "M140 260 Q300 150 620 170 Q900 130 1100 200 Q1210 260 1120 330 Q900 380 640 360 Q360 400 180 360 Q90 320 140 260 Z";
  return <>
    <CShadow x={960} y={980} w={1500} />
    <div style={{ position: "absolute", left: 960, top: 560, width: 1500, height: 840, transform: "translate(-50%,-50%) perspective(1600px) rotateX(30deg) rotate(-3deg)", background: "linear-gradient(160deg,#f3ead6,#ddd0b0)", boxShadow: "0 40px 60px rgba(0,0,0,.5)" }}>
      <Grain id="lmg" o={0.3} />
      <svg width={1500} height={840} viewBox="0 0 1300 700" style={{ position: "absolute", inset: 0 }}><defs><clipPath id="lmc"><path d={LAKE} /></clipPath></defs>
        <path d={LAKE} fill="#7aa8c0" stroke="#3a5a6a" strokeWidth={6} /><path d={LAKE} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={3} transform="translate(-6 -6)" />
        <text x={640} y={290} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={70} fill="#2a4a5a" letterSpacing={6}>LAKE ONTARIO</text>
        <path d="M1100 680 Q1080 560 1120 480 Q1150 400 1110 330" stroke="#7aa8c0" strokeWidth={26} fill="none" />
        <path d="M1100 680 Q1080 560 1120 480 Q1150 400 1110 330" stroke="#b3221a" strokeWidth={18} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - rv)} />
        <g clipPath="url(#lmc)"><circle cx={1080} cy={320} r={420 * dr} fill="rgba(179,34,26,.45)" /><circle cx={1080} cy={320} r={260 * dr} fill="rgba(179,34,26,.35)" /></g>
        <g transform="translate(1110 640)"><rect x={-60} y={-80} width={120} height={80} fill="#7a6a5a" /><rect x={20} y={-160} width={30} height={90} fill="#5a4a3a" /><path d="M-60 -80 L0 -120 L60 -80" fill="#5a4a3a" /></g>
        <text x={1110} y={690} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={INK}>Niagara</text></svg>
      {fs > 0.01 && <svg width={360} height={180} viewBox="0 0 360 180" style={{ position: "absolute", left: 560, top: 230 - 400 * (1 - cl(fs)), transform: `rotate(${-10 + 10 * cl(fs)}deg)`, filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.45))" }}><path d="M20 90 Q120 10 260 70 L340 20 L320 90 L340 160 L260 110 Q120 170 20 90 Z" fill="#c8ccd0" stroke="#5a5e62" strokeWidth={5} /><circle cx={70} cy={80} r={10} fill="#1a1a1a" /><path d="M120 60 Q140 90 120 120 M170 56 Q190 90 170 124" stroke="#8a8e92" strokeWidth={4} fill="none" /></svg>}
      {x > 0.01 && <svg width={420} height={420} viewBox="0 0 420 420" style={{ position: "absolute", left: 530, top: 120, transform: `scale(${1.8 - 0.8 * cl(x)})`, opacity: cl(x * 2) }}><path d="M60 60 L360 360 M360 60 L60 360" stroke={STAMP} strokeWidth={46} strokeLinecap="round" opacity={0.85} /></svg>}</div>
  </>;
}} />;

// m22 · la balanza de bronce: arriba de un platillo, una sola hormiga; en el otro caen de a uno codorniz, pescado, botella de leche, vaca de juguete y moneda, y el cartel cambia
export const HPayScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const A = [0.4, bt(h, 0, 2.2), bt(h, 1, 4.2), bt(h, 1, 4.2) + 1, bt(h, 2, 6.2)], n = A.filter((a) => tt > a + 0.3).length, tilt = -6 + 3.4 * n, cx = 960, cy = 330;
  const lbl = n <= 2 ? "the birds paid" : n <= 4 ? "the farmers paid" : "the taxpayers paid";
  const a = tilt * Math.PI / 180, lx = cx - 560 * Math.cos(a), ly = cy - 560 * Math.sin(a), rx = cx + 560 * Math.cos(a), ry = cy + 560 * Math.sin(a);
  const ITEM = (k: number) => k === 0 ? <svg width={200} height={150} viewBox="0 0 200 150"><ellipse cx={100} cy={90} rx={80} ry={50} fill="#8a6a4a" /><circle cx={160} cy={50} r={30} fill="#7a5a3a" /><path d="M186 50 L206 56 L186 60" fill="#e8a040" /><circle cx={166} cy={44} r={5} fill="#000" />{[60, 90, 120].map((x) => <path key={x} d={`M${x} 70 q10 20 0 40`} stroke="#f3ead6" strokeWidth={5} fill="none" />)}</svg>
    : k === 1 ? <svg width={240} height={110} viewBox="0 0 240 110"><path d="M10 55 Q80 0 180 40 L230 10 L220 55 L230 100 L180 70 Q80 110 10 55 Z" fill="#9aa8b0" /><circle cx={50} cy={48} r={7} fill="#000" /></svg>
      : k === 2 ? <svg width={110} height={220} viewBox="0 0 110 220"><path d="M30 0 L80 0 L80 40 Q110 70 110 110 L110 210 L0 210 L0 110 Q0 70 30 40 Z" fill="#fbf8ee" stroke="#c8ccd0" strokeWidth={6} /></svg>
        : k === 3 ? <svg width={220} height={160} viewBox="0 0 180 130"><path d="M20 40 Q30 20 70 26 L130 24 Q150 18 160 30 L172 34 L168 54 L150 52 L148 92 L138 92 L136 64 L70 66 L66 96 L54 96 L52 64 Q30 64 24 56 Z" fill="#f3ece0" stroke="#2a1e14" strokeWidth={3} /><ellipse cx={80} cy={44} rx={14} ry={10} fill="#2a1e14" /><path d="M60 96 L60 124 M142 92 L142 124" stroke="#2a1e14" strokeWidth={8} /></svg>
          : <div style={{ position: "relative", width: 200, height: 120 }}><Coin x={100} y={60} s={2.2} /></div>;
  return <>
    <Box x={960} y={1060} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={cx} y={960} w={500} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(16px 24px 16px rgba(0,0,0,.45))" }}><defs><linearGradient id="brz" x1="0" x2="1"><stop offset="0" stopColor="#6a4a1a" /><stop offset=".45" stopColor="#f0c870" /><stop offset="1" stopColor="#7a5a1a" /></linearGradient></defs>
      <path d={`M${cx - 160} 960 L${cx + 160} 960 L${cx + 60} 900 L${cx - 60} 900 Z`} fill="url(#brz)" /><rect x={cx - 22} y={cy} width={44} height={580} fill="url(#brz)" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="url(#brz)" strokeWidth={26} strokeLinecap="round" /><circle cx={cx} cy={cy} r={34} fill="url(#brz)" />
      {[[lx, ly], [rx, ry]].map(([x, y], k) => <g key={k}><path d={`M${x} ${y} L${x - 200} ${y + 260} M${x} ${y} L${x + 200} ${y + 260}`} stroke="#8a6a2a" strokeWidth={5} /><path d={`M${x - 240} ${y + 260} Q${x} ${y + 330} ${x + 240} ${y + 260} Z`} fill="url(#brz)" /></g>)}</svg>
    <Ant3 x={lx} y={ly + 200} s={0.9} tt={tt} />
    {A.map((at, k) => { const f = fall(tt, at); return f.s > 0.01 && <div key={k} style={{ position: "absolute", left: rx - 130 + (k % 3) * 60 - 40, top: ry + 270 - 90 - (k > 2 ? 70 : 0) + f.y, transform: `translate(0,-100%) rotate(${(k % 2 ? 8 : -8)}deg)` }}>{ITEM(k)}</div>; })}
    <div style={{ position: "absolute", left: cx, top: 740, transform: `translate(-50%,-50%) rotate(-2deg) scale(${0.9 + 0.1 * pop(tt % 99, 0, 6, 0.4)})`, padding: "12px 40px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", boxShadow: "0 16px 24px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 88, color: INK, whiteSpace: "nowrap" }}>{lbl}</div>
  </>;
}} />;

// m23 · el taco de almanaque: cada año se arranca del taco y vuela a clavarse en el corcho con rebote; el último, 1978, en rojo
export const HTimelineRail: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = ["1918", "1930s", "1942", "1957", "1958", "1959", "1962", "1978"], W = ["ant lands", "red ant", "a boy notes it", "planes start", "birds die", "milk rule", "Silent Spring", "mirex banned"];
  const A = [0.4, ...Array.from({ length: 6 }, (_, i) => bt(h, i, 2.4 + i * 2.4)), bt(h, 6, 17.5)];
  return <>
    <div style={{ position: "absolute", left: 60, top: 60, width: 1800, height: 560, borderRadius: 10, background: "radial-gradient(ellipse at 40% 40%,#c89a62,#8a6238)", border: "22px solid #5a3a1e", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}><Grain id="crk" o={0.5} f={1.4} /></div>
    <Box x={960} y={1070} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={960} y={950} w={500} />
    <div style={{ position: "absolute", left: 960, top: 950, transform: "translate(-50%,-100%)", width: 420, height: 300, borderRadius: 8, background: "linear-gradient(#e8e0cc,#b8ae96)", boxShadow: "0 -6px 0 #3a2a1a, 0 20px 30px rgba(0,0,0,.5)" }}>
      {(() => { const n = A.filter((a) => tt > a).length, nx = Math.min(7, n); return <div style={{ position: "absolute", inset: 14, background: "#fbf7ec", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 120, color: nx === 7 ? STAMP : INK }}>{n < 8 ? Y[nx] : ""}</div>; })()}</div>
    {A.map((a, i) => { const u = eio(tt, a, a + 0.7), land = pop(tt, a + 0.6, 8, 0.4), px = 220 + i * 210, py = 330 + (i % 2) * 70; if (tt < a) return null;
      const x = 960 + (px - 960) * u, y = 800 + (py - 800) * u - 260 * Math.sin(u * Math.PI);
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${(1 - u) * 200 + (i % 2 ? 4 : -4) + 6 * Math.sin((tt - a) * 7) * Math.exp(-(tt - a))}deg) scale(${0.6 + 0.4 * u})`, filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.45))" }}>
        <div style={{ width: 200, height: 210, background: "#fbf7ec", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderTop: "10px solid #b8ae96" }}>
          <div style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: Y[i].length > 4 ? 56 : 70, color: i === 7 ? STAMP : INK }}>{Y[i]}</div><div style={{ fontFamily: HAND, fontSize: 36, color: "#4a3a2a", textAlign: "center", lineHeight: 1 }}>{W[i]}</div></div>
        {land > 0.01 && <div style={{ position: "absolute", left: 88, top: -6, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#a8221a)", boxShadow: "0 4px 4px rgba(0,0,0,.5)" }} />}</div>; })}
  </>;
}} />;

// m24 · el método de dos pasos: dos peldaños de madera; en el 1 se vuelca la bolsa de cebo y se desparraman los gránulos; en el 2, el hormiguero con la lupa y el termómetro de suelo
export const HTwoStep: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tip = eio(tt, 0.4, 1.4), b2 = bt(h, 0, 4), b3 = bt(h, 1, 7), lp = eio(tt, b2, b2 + 1), th = eio(tt, b3, b3 + 2);
  return <>
    <Box x={620} y={1000} w={760} h={220} d={360} rx={-24} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <Box x={1340} y={1000} w={760} h={460} d={360} rx={-24} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {["1", "2"].map((n, k) => <div key={n} style={{ position: "absolute", left: k ? 1340 : 620, top: k ? 800 : 920, transform: "translate(-50%,-50%)", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 130, color: "rgba(40,20,5,.55)" }}>{n}</div>)}
    <div style={{ position: "absolute", left: 520, top: 720, transform: `translate(-50%,-100%) rotate(${-70 * tip}deg)`, transformOrigin: "80% 100%", filter: "drop-shadow(14px 22px 14px rgba(0,0,0,.45))" }}>
      <svg width={260} height={340} viewBox="0 0 260 340"><path d="M30 40 Q20 30 40 20 L220 20 Q240 30 230 40 L240 320 L20 320 Z" fill="#d8c8a0" stroke="#8a7a50" strokeWidth={5} /><path d="M30 40 L230 40" stroke="#8a7a50" strokeWidth={6} strokeDasharray="10 8" /><rect x={50} y={120} width={160} height={90} fill="#b3221a" /><text x={130} y={182} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={54} fill="#f3e6c6">BAIT</text></svg></div>
    {Array.from({ length: 40 }, (_, k) => { const u = cl((tt - 1 - k * 0.03) / 0.8); return u > 0 && <div key={k} style={{ position: "absolute", left: 470 + 40 * u + (rnd(k) - 0.5) * 520 * u, top: 640 + 230 * Math.min(1, u * 1.4) - 120 * Math.sin(u * Math.PI) * rnd(k + 9), width: 14, height: 10, borderRadius: 4, background: k % 3 ? "#e8c070" : "#b8903a", boxShadow: "2px 3px 3px rgba(0,0,0,.4)" }} />; })}
    <Mound x={1300} y={730} w={420} id="tsm" />
    {Array.from({ length: 5 }, (_, k) => <Ant3 key={k} x={1180 + k * 50 + 30 * Math.sin(tt + k)} y={700 - (k % 2) * 40} s={0.35} r={k * 50} tt={tt} />)}
    {lp > 0.01 && <div style={{ position: "absolute", left: 1290 - 300 * (1 - lp), top: 480, transform: "translate(-50%,-50%) rotate(-20deg)", filter: "drop-shadow(16px 26px 16px rgba(0,0,0,.45))" }}><div style={{ width: 280, height: 280, borderRadius: "50%", border: "22px solid #3a2a1a", background: "radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),rgba(220,235,240,.15) 50%,rgba(220,235,240,.05))" }} /><div style={{ width: 44, height: 200, margin: "0 auto", background: "linear-gradient(90deg,#3a2a1a,#8a5a30,#3a2a1a)", borderRadius: 14 }} /></div>}
    {th > 0.01 && <div style={{ position: "absolute", left: 1560, top: 760 - 300 * (1 - pop(tt, b3, 7, 0.4)), transform: "translate(-50%,-100%)", filter: "drop-shadow(12px 20px 12px rgba(0,0,0,.45))" }}>
      <div style={{ width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(#fbf7ec,#d8d0b8)", border: "14px solid #a8acb0", position: "relative" }}><div style={{ position: "absolute", left: 70, top: 20, width: 6, height: 66, background: "#b3221a", transformOrigin: "50% 100%", transform: `rotate(${-90 + 150 * th}deg)` }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: INK }}>{Math.round(60 + 20 * th)}°F</div></div>
      <div style={{ width: 12, height: 220, margin: "0 auto", background: "linear-gradient(90deg,#8a8e92,#e0e4e8,#8a8e92)" }} /></div>}
  </>;
}} />;

// m25 · la patada: la bota de cuero baja con peso y revienta el montículo en una nube de tierra; las hormigas salen en fila y levantan un montículo nuevo un poco más allá
export const HKickedMound: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const K = 1.2, k1 = eio(tt, 0.2, K), back = eio(tt, K + 0.3, K + 1), sm = tt > K ? 1 : 0, nm = eio(tt, K + 2.4, D(h) - 1);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "linear-gradient(#8a6a42,#5a4026)" }}><Grain id="kmg" o={0.4} f={0.7} /></div>
    {Array.from({ length: 40 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 53) % 1920, top: 630 + (k % 4) * 6, width: 10, height: 60 + (k % 5) * 20, borderRadius: "50% 50% 0 0", background: "#5a7a2a", transform: "translateY(-100%)" }} />)}
    <Mound x={620} y={900} w={560} sy={sm ? 0.35 : 1} sx={sm ? 1.3 : 1} id="km1" />
    {sm > 0 && Array.from({ length: 14 }, (_, k) => { const q = cl((tt - K) / 1.2); return q < 1 && <div key={k} style={{ position: "absolute", left: 620 + Math.cos(k * 0.45 + 3.3) * 500 * q, top: 820 - Math.sin(k * 0.45 + 3.3) * 300 * q + 500 * q * q, width: 24 + (k % 3) * 10, height: 20, borderRadius: 6, background: "#7a5230", opacity: 1 - q }} />; })}
    {sm > 0 && [0, 1, 2, 3].map((k) => <Puff key={k} x={560 + k * 60} y={820 - 40 * cl((tt - K) * 2)} r={90 + 120 * cl(tt - K)} col="rgba(190,160,120,.75)" o={1 - cl((tt - K) / 1.6)} />)}
    <Mound x={1460} y={880} w={420 * nm + 1} sy={nm} id="km2" o={nm > 0.02 ? 1 : 0} />
    {sm > 0 && Array.from({ length: 18 }, (_, k) => { const p = cl((tt - K - 0.6 - k * 0.12) / 2.2); return p > 0 && p < 1 && <Ant3 key={k} x={700 + 740 * p} y={880 - 30 * Math.sin(p * 9 + k)} s={0.4} tt={tt + k} />; })}
    <div style={{ position: "absolute", left: 560 - 300 * back, top: 920 - 720 * (1 - k1) - 400 * back }}><Boot x={0} y={0} s={1.2} r={-10 + 20 * k1} /></div>
  </>;
}} />;

// m29 · el reloj de arena sobre la mesa: arriba, hundido en la arena, el avioncito de 1957; abajo se junta el montón; al vaciarse gira y en la base queda tallado el 40
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const T = D(h), u = eio(tt, 0.2, T - 2.4), flip = eio(tt, T - 2.2, T - 1.2), cx = 860, cy = 540, n40 = pop(tt, T - 1, 8, 0.35);
  return <>
    <Box x={960} y={1060} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={cx} y={960} w={560} />
    <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) rotate(${180 * flip}deg)` }}>
      <svg width={520} height={860} viewBox="0 0 520 860" style={{ filter: "drop-shadow(18px 28px 20px rgba(0,0,0,.5))" }}><defs><linearGradient id="hgw" x1="0" x2="1"><stop offset="0" stopColor="#4a2e16" /><stop offset=".5" stopColor="#b8885a" /><stop offset="1" stopColor="#4a2e16" /></linearGradient>
        <clipPath id="hgc"><path d="M80 70 L440 70 Q440 300 280 420 L280 440 Q440 560 440 790 L80 790 Q80 560 240 440 L240 420 Q80 300 80 70 Z" /></clipPath></defs>
        <g clipPath="url(#hgc)"><rect x={0} y={70 + 340 * u} width={520} height={360 * (1 - u)} fill="#d8b878" /><path d={`M80 790 L440 790 L440 ${790 - 300 * u} Q260 ${700 - 330 * u} 80 ${790 - 300 * u} Z`} fill="#d8b878" />{u > 0 && u < 1 && <rect x={254} y={420} width={12} height={370} fill="#d8b878" />}</g>
        <path d="M80 70 L440 70 Q440 300 280 420 L280 440 Q440 560 440 790 L80 790 Q80 560 240 440 L240 420 Q80 300 80 70 Z" fill="rgba(220,235,240,.18)" stroke="rgba(230,240,245,.85)" strokeWidth={8} /><path d="M120 120 Q130 260 220 380" stroke="rgba(255,255,255,.6)" strokeWidth={14} fill="none" strokeLinecap="round" />
        <rect x={20} y={20} width={480} height={56} rx={12} fill="url(#hgw)" /><rect x={20} y={784} width={480} height={56} rx={12} fill="url(#hgw)" />{[40, 470].map((x) => <rect key={x} x={x} y={70} width={14} height={720} fill="url(#hgw)" />)}
        <g transform={`translate(260 ${110 + 300 * u}) rotate(-12)`} opacity={u < 0.85 ? 1 : 0}><path d="M-80 0 L80 0 L60 14 L-60 14 Z" fill="#f0c020" /><rect x={-40} y={-30} width={80} height={10} fill="#f0c020" /><text x={0} y={-40} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={30} fill="#5a3a1a">1957</text></g>
        <g transform={`translate(${300 + 30 * u} ${770 - 290 * u})`} opacity={u > 0.3 ? 1 : 0}><ellipse cx={0} cy={6} rx={18} ry={8} fill="#2a2a2a" /><ellipse cx={-14} cy={-4} rx={14} ry={7} fill="rgba(220,235,240,.7)" transform="rotate(-30)" /><ellipse cx={14} cy={-4} rx={14} ry={7} fill="rgba(220,235,240,.7)" transform="rotate(30)" /></g></svg></div>
    {n40 > 0.01 && <div style={{ position: "absolute", left: cx, top: 940, transform: `translate(-50%,-50%) scale(${cl(n40)})`, fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 150, color: "#3a1e0a", textShadow: "0 2px 0 rgba(255,220,170,.45), 0 -2px 2px rgba(0,0,0,.5)" }}>40 years</div>}
  </>;
}} />;

// m30 · el fichero de madera: la ficha grande sale del cajón, se da vuelta (pregunta → respuesta) y cae el sello rojo REAL; después la segunda
export const HQCards: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q: [string, string, string][] = [["A real threat?", "Yes. It still is.", "REAL"], ["Did it kill people?", "No documented case.", "CHECKED"], ["Is mirex still around?", "Traces, for years.", "TRACES"]], seg = (D(h) - 0.6) / Q.length, i = Math.min(Q.length - 1, Math.floor(tt / seg)), lt = tt - i * seg;
  const out = eio(lt, 0.1, 0.8), fl = eio(lt, seg * 0.35, seg * 0.35 + 0.6), gone = eio(lt, seg - 0.5, seg);
  return <>
    <Box x={960} y={1060} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={760} y={960} w={760} />
    <Box x={760} y={960} w={700} h={300} d={420} rx={-20} ry={-14} front={WOOD} top={WOODTOP} side={WOODSIDE}><div style={{ position: "absolute", left: 270, top: 130, width: 160, height: 46, borderRadius: 10, background: "linear-gradient(#e6c47a,#8a6224)" }} /></Box>
    <div style={{ position: "absolute", left: 760 + 420 * out + 700 * gone, top: 620 - 260 * out, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${12 - 12 * out}deg) rotateY(${180 * fl}deg) rotate(${-4 + 6 * gone}deg)`, transformStyle: "preserve-3d", opacity: 1 - gone }}>
      {[0, 1].map((b) => <div key={b} style={{ position: "absolute", left: -480, top: -290, width: 960, height: 580, backfaceVisibility: "hidden", transform: `rotateY(${b * 180}deg)`, background: "repeating-linear-gradient(180deg,transparent 0 68px,rgba(80,120,180,.35) 68px 71px), linear-gradient(160deg,#fbf7ec,#e8dec4)", borderTop: b ? "none" : "12px solid #b3221a", boxShadow: "0 30px 50px rgba(0,0,0,.5)", padding: "70px 70px", boxSizing: "border-box", fontFamily: HAND, fontSize: b ? 108 : 100, color: b ? "#23324f" : INK, lineHeight: 1.1 }}>
        {b ? Q[i][1] : Q[i][0]}{b === 1 && <Sello tt={lt} at={seg * 0.35 + 1.2} x={660} y={420} txt={Q[i][2]} size={80} r={-10} />}</div>)}</div>
  </>;
}} />;

// m31 · «¿quién está abajo?»: la foto aérea del potrero con Ruth parada y su sombra; la sombra nítida del avión cruza con parallax y la oscurece al pasar
export const HUnderneath: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="#3c5220" f={(tt) => {
  const u = eio(tt, 0.6, D(h) - 1.4), sx = -700 + 3200 * u, over = cl(1 - Math.abs(sx - 960) / 420), cam = 1 + 0.06 * eio(tt, 0, D(h));
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})` }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(100deg,rgba(0,0,0,.08) 0 10px,transparent 10px 70px), radial-gradient(ellipse at 40% 40%,#8aae52,#4a6a24)" }}><Grain id="ung" o={0.4} f={0.6} /></div>
    {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: 200 + k * 190, top: 120 + (k % 3) * 300, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(#3a5a1a,#2a4010 70%)", boxShadow: "30px 30px 0 rgba(0,0,0,.25)" }} />)}
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 50, borderRadius: "50%", background: "rgba(0,0,0,.4)", transform: "rotate(30deg)", transformOrigin: "0 50%", filter: "blur(3px)" }} />
      <svg width={120} height={120} viewBox="-60 -60 120 120" style={{ position: "absolute", left: -60, top: -60 }}><circle r={34} fill="#5a3a5a" /><circle r={22} fill="#8a5a3a" /><circle r={16} fill="#3a2414" /><ellipse cx={-30} cy={4} rx={10} ry={20} fill="#5a3a5a" /><ellipse cx={30} cy={4} rx={10} ry={20} fill="#5a3a5a" /></svg></div>
    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.35 * over})` }} />
    <svg width={900} height={600} viewBox="0 0 640 300" style={{ position: "absolute", left: sx - 450, top: 260 + 120 * u, transform: "rotate(18deg)", opacity: 0.55, filter: "blur(1.5px)" }}><rect x={120} y={40} width={420} height={40} rx={14} fill="#000" /><rect x={120} y={190} width={420} height={40} rx={14} fill="#000" /><path d="M80 110 Q300 80 560 100 L600 130 Q300 160 80 150 Z" fill="#000" /><path d="M40 90 L90 110 L90 150 L40 160 Z" fill="#000" /></svg>
  </div>;
}} />;

// m32 · el resumen en un minuto: la tira de película cuelga del proyector; el haz recorre los cuadros (fotos del video) y el activo sale hacia cámara con su leyenda escrita a mano
export const HRecapReel: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const caps = ["a ship to Mobile", "panic", "planes of poison", "birds & fish die", "milk flagged", "native ants gone", "mirex till 1978", "370 million acres", "control, not war"];
  const per = (D(h) - 0.8) / caps.length, a = Math.min(caps.length - 1, Math.max(0, Math.floor((tt - 0.3) / per))), lt = tt - 0.3 - a * per, slide = a - 1 + eio(lt, 0, 0.4), s = pop(lt, 0.25, 8, 0.45);
  const im = h.imgs || [];
  return <>
    <Box x={960} y={1070} w={1900} h={160} d={300} rx={-26} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    <CShadow x={260} y={960} w={380} />
    <div style={{ position: "absolute", left: 260, top: 840, transform: "translate(-50%,-50%)", width: 320, height: 230, borderRadius: 30, background: "linear-gradient(160deg,#5a5f66,#22252a)", boxShadow: "inset 0 5px 0 rgba(255,255,255,.2), 0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", right: -46, top: 64, width: 96, height: 96, borderRadius: "50%", background: "radial-gradient(#fff8e0,#ffcf6a 40%,#5a4a2a 72%)", boxShadow: "0 0 60px 20px rgba(255,220,140,.4)" }} />
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 150, top: -140, width: 130, height: 130, borderRadius: "50%", border: "12px solid #2a2a2a", background: "radial-gradient(#5a5a5a 20%,#2a2a2a 22%,#3a3a3a)", transform: `rotate(${tt * 200}deg)` }}><div style={{ width: 10, height: 54, background: "#888", margin: "26px auto" }} /></div>)}</div>
    <div style={{ position: "absolute", left: 300, top: 300, width: 1500, height: 560, background: "linear-gradient(90deg, rgba(255,230,170,.35), rgba(255,230,170,.04))", clipPath: "polygon(0 92%, 100% 0, 100% 100%, 0 100%)", filter: "blur(8px)", mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", left: 0, top: 120, width: 1920, height: 620, perspective: 1600 }}>
      <div style={{ position: "absolute", left: 1060 - slide * 560 - 250, top: 60, height: 480, width: caps.length * 560 + 100, transform: "rotateY(-12deg)", background: "#141414", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
        {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: r ? 436 : 14, height: 30, backgroundImage: "repeating-linear-gradient(90deg,transparent 0 30px,#f3ead6 30px 54px,transparent 54px 84px)" }} />)}
        {caps.map((_, i) => { const act = i === a, z = act ? s : 0; return <div key={i} style={{ position: "absolute", left: 50 + i * 560, top: 58, width: 500, height: 364, borderRadius: 8, overflow: "hidden", background: "#3a352e", transform: `translateZ(${140 * z}px) scale(${1 + 0.14 * z})`, boxShadow: act ? "0 30px 50px rgba(0,0,0,.6)" : "none", filter: act ? "none" : "brightness(.45) sepia(.4)" }}>
          {im[i] && <img src={img(im[i] as string)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>; })}</div></div>
    <div style={{ position: "absolute", left: 1120, top: 880, transform: `translate(-50%,-50%) rotate(-1.5deg) scale(${0.85 + 0.15 * s})`, padding: "10px 44px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", fontFamily: HAND, fontSize: 84, color: INK, whiteSpace: "nowrap" }}>{caps[a]}</div>
  </>;
}} />;

export const HCA2: Record<string, React.FC<{ t: number; h: H }>> = {
  ...HCA3,
  planeDust: HPlaneDust, caseFile: HCaseFile, milkBottle: HMilkBottle, tugOfWar: HTugOfWar, purse: HPurse, lakeMap: HLakeMap, payScale: HPayScale,
  timelineRail: HTimelineRail, twoStep: HTwoStep, kickedMound: HKickedMound, hourglass: HHourglass, qCards: HQCards, underneath: HUnderneath, recapReel: HRecapReel,
};
