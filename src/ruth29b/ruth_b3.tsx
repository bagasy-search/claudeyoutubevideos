// ruth29b · 2ª vuelta tras el EVALUADOR (29-oct): 2ª mitad del video rehecha como OBJETOS 3D sobre la mesa de Ruth
// (sombra de contacto, volumen, textura), una idea por pieza, texto grande y DENTRO de la escena. Helpers compartidos con ruth_b2.
import React from "react";
import { H, Mode, Stage, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK, STAMP } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, WOOD, WOODTOP, WOODSIDE } from "./obj";

export const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode; bg?: string }> = ({ t, h, f, bg }) => <Stage t={t} h={h} bg={bg} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
export const bt = (h: H, i: number, d: number) => (h.bt && h.bt[i] != null ? h.bt[i] : d);
export const fall = (tt: number, at: number) => { const s = pop(tt, at, 9, 0.38); return { s, y: (1 - s) * -520, k: cl(s) }; };
export const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
export const SOILC = "#2a1c12", WHEATC = "#e3c27a";
// bocanada de humo/polvo con volumen
export const Puff: React.FC<{ x: number; y: number; r: number; col?: string; o?: number }> = ({ x, y, r, col = "rgba(120,90,60,.9)", o = 1 }) =>
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 42% 36%, ${col}, transparent 68%)`, opacity: cl(o), filter: `blur(${r * 0.12}px)` }} />;
// estaca de madera clavada con texto tallado
export const Stake: React.FC<{ x: number; y: number; txt: string; s?: number; size?: number; r?: number }> = ({ x, y, txt, s = 1, size = 64, r = 0 }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) rotate(${r}deg) scale(${s})`, transformOrigin: "50% 100%" }}>
    <div style={{ padding: "12px 30px", background: "linear-gradient(160deg,#c9a06a,#8a6236)", borderRadius: 6, boxShadow: "0 14px 22px rgba(0,0,0,.5), inset 0 2px 0 rgba(255,230,190,.4)", fontFamily: HAND, fontSize: size, color: "#2a170a", whiteSpace: "nowrap", position: "relative" }}><Grain id={"stk" + Math.round(x)} o={0.25} f={0.6} />{txt}</div>
    <div style={{ width: 22, height: 120, margin: "0 auto", background: "linear-gradient(90deg,#6a4626,#a07448,#6a4626)" }} />
  </div>;
const CA = "M60 20 L230 20 L230 240 L420 450 L410 560 L320 620 L270 580 L140 430 L50 260 Z";

// m14 · el estante de las lecciones: cuatro objetos caen de a uno con peso (árboles, colina en curvas, rastrojo, pasto)
export const HLessonShelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const at = [0.6, bt(h, 0, 4.2), bt(h, 1, 6.75), bt(h, 2, 8.05)], X = [420, 780, 1140, 1500], tags = ["trees", "contour", "stubble", "grass"];
  const obj = (i: number) => i === 0 ? <svg width={260} height={260} viewBox="0 0 260 260"><defs><linearGradient id="lst" x1="0" x2="1"><stop offset="0" stopColor="#5f9a3a" /><stop offset="1" stopColor="#24461a" /></linearGradient></defs>{[50, 130, 210].map((x, k) => <g key={k}><rect x={x - 7} y={200} width={14} height={50} fill="#6a4626" /><path d={`M${x} ${40 + (k % 2) * 30} L${x + 46} 210 L${x - 46} 210 Z`} fill="url(#lst)" /></g>)}<rect x={0} y={244} width={260} height={16} rx={4} fill="#7a5a32" /></svg>
    : i === 1 ? <svg width={280} height={240} viewBox="0 0 280 240"><defs><radialGradient id="lsh" cx="40%" cy="30%"><stop offset="0" stopColor="#c9a66a" /><stop offset="1" stopColor="#6a4a26" /></radialGradient></defs><path d="M10 230 Q140 -20 270 230 Z" fill="url(#lsh)" />{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${30 + k * 22} ${230 - k * 42} Q140 ${210 - k * 46} ${250 - k * 22} ${230 - k * 42}`} stroke="#3a2a12" strokeWidth={4} fill="none" />)}</svg>
    : i === 2 ? <svg width={220} height={260} viewBox="0 0 220 260">{Array.from({ length: 26 }, (_, k) => <line key={k} x1={30 + k * 6.4} y1={250} x2={30 + k * 6.4 + (k % 3 - 1) * 4} y2={40 + (k * 37) % 50} stroke={k % 2 ? "#e3c27a" : "#b8944a"} strokeWidth={5} />)}<rect x={20} y={150} width={180} height={18} fill="#8a6a3a" /><rect x={10} y={244} width={200} height={16} rx={4} fill="#5a3a1e" /></svg>
    : <svg width={260} height={200} viewBox="0 0 260 200"><rect x={0} y={90} width={260} height={110} fill="#4a2e18" /><rect x={0} y={90} width={260} height={16} fill="#3a6a24" />{Array.from({ length: 60 }, (_, k) => <line key={k} x1={4 + k * 4.2} y1={96} x2={4 + k * 4.2 + (k % 5 - 2) * 3} y2={20 + (k * 29) % 50} stroke={k % 3 ? "#6aa83a" : "#4a8a2a"} strokeWidth={4} />)}{[0, 1, 2].map((k) => <path key={k} d={`M${40 + k * 80} 110 Q${30 + k * 80} 160 ${50 + k * 80} 196`} stroke="#c9a06a" strokeWidth={3} fill="none" />)}</svg>;
  return <>
    <CShadow x={960} y={790} w={1600} o={0.5} />
    <Box x={960} y={760} w={1560} h={50} d={240} rx={-24} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {X.map((x, i) => { const f = fall(tt, at[i]); if (f.s <= 0.01) return null; return <React.Fragment key={i}>
      <CShadow x={x} y={712} w={240} k={f.k} />
      <div style={{ position: "absolute", left: x, top: 712 + f.y, transform: `translate(-50%,-100%) scaleY(${1 - 0.08 * Math.max(0, 1 - f.s)})`, transformOrigin: "50% 100%", filter: "drop-shadow(10px 18px 14px rgba(0,0,0,.45))" }}>{obj(i)}</div>
      <div style={{ position: "absolute", left: x, top: 790, transform: `translate(-50%,0) rotate(${3 * Math.sin(tt * 2 + i)}deg) scale(${pop(tt, at[i] + 0.4)})`, transformOrigin: "50% 0" }}>
        <div style={{ width: 3, height: 40, margin: "0 auto", background: "#8a7a5a" }} />
        <div style={{ padding: "10px 28px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 64, color: INK, boxShadow: "0 12px 20px rgba(0,0,0,.45)" }}>{tags[i]}</div>
      </div></React.Fragment>; })}
  </>;
}} />;

// m15 · el parche de tierra arada (fieltro oscuro con surcos) crece sobre la mesa; cae encima el recorte de cartón de California y la tierra lo desborda por todos lados
export const HCaliOverlay: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 0.4, 3.4), c = pop(tt, 4, 8, 0.45), tag = pop(tt, 6, 7, 0.5);
  return <>
    <div style={{ position: "absolute", left: 960, top: 760, width: 1600, height: 760, transform: "translate(-50%,-50%) perspective(1500px) rotateX(56deg)", transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 800 - 790 * g, top: 380 - 370 * g, width: 1580 * g, height: 740 * g, borderRadius: "46% 54% 50% 44% / 50% 46% 54% 48%", background: `repeating-linear-gradient(8deg, #1e140c 0 14px, #3a281a 14px 24px)`, boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 40px rgba(0,0,0,.6)", overflow: "hidden" }}><Grain id="cog" o={0.4} f={1.1} /></div>
      {c > 0.01 && <svg width={460} height={640} viewBox="0 0 460 640" style={{ position: "absolute", left: 800 - 230, top: 380 - 320, transform: `translateZ(${(1 - c) * 600}px) rotate(-8deg)`, filter: "drop-shadow(16px 24px 14px rgba(0,0,0,.6))", overflow: "visible" }}>
        <path d={CA} fill="#e8dcc0" stroke="#a8946a" strokeWidth={6} /><text x={150} y={330} fontFamily="Georgia, serif" fontWeight={900} fontSize={54} fill="#5a4a32" transform="rotate(54 150 330)">CALIFORNIA</text></svg>}
    </div>
    {tag > 0.01 && <div style={{ position: "absolute", left: 1530, top: 540, transform: `translate(-50%,-50%) rotate(5deg) scale(${tag})`, padding: "16px 34px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", boxShadow: "0 18px 28px rgba(0,0,0,.5)", textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: INK, lineHeight: 1 }}>100 million</div><div style={{ fontFamily: HAND, fontSize: 64, color: INK }}>acres plowed</div></div>}
  </>;
}} />;

// m16 · el mismo viento sobre dos bandejas: el pasto se dobla y aguanta; la tierra pelada se levanta en polvo
export const HWindComb: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const w = eio(tt, 1.2, 3), gust = w * (0.75 + 0.25 * Math.sin(tt * 3.4)), lost = eio(tt, 3, 10);
  const tray = (x: number, grass: boolean) => <>
    <CShadow x={x} y={900} w={720} />
    <Box x={x} y={900} w={660} h={110} d={360} rx={-30} ry={0} front={WOOD} top={grass ? "linear-gradient(#3a5a22,#2a4416)" : `linear-gradient(rgb(${74 + 30 * lost},${52 + 22 * lost},${30 + 12 * lost}),#3a2716)`} side={WOODSIDE}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: HAND, fontSize: 66, color: "#f3e6c6", textShadow: "0 3px 0 #3a2410" }}>{grass ? "grass" : "bare"}</div></Box>
    {grass ? <svg width={640} height={260} viewBox="0 0 640 260" style={{ position: "absolute", left: x - 320, top: 560, overflow: "visible" }}>{Array.from({ length: 90 }, (_, k) => { const bx = 10 + (k * 7.1) % 620, by = 180 + (k * 13) % 70, hh = 90 + (k * 31) % 80, bend = gust * (60 + (k % 7) * 6) + 6 * Math.sin(tt * 6 + k);
      return <path key={k} d={`M${bx} ${by} Q${bx + bend * 0.3} ${by - hh * 0.6} ${bx + bend} ${by - hh * (1 - 0.25 * gust)}`} stroke={k % 3 ? "#6aa83a" : "#8ac04a"} strokeWidth={5} fill="none" strokeLinecap="round" />; })}</svg>
      : Array.from({ length: 70 }, (_, k) => { const ph = ((tt - 3) * (0.35 + rnd(k) * 0.3) + rnd(k + 9)) % 1; if (tt < 3) return null;
        return <div key={k} style={{ position: "absolute", left: x - 300 + rnd(k + 1) * 600 + ph * 700, top: 720 - ph * 420 * (0.4 + rnd(k + 3)), width: 10 + rnd(k) * 14, height: 10 + rnd(k) * 14, borderRadius: "50%", background: "rgba(150,110,70,.85)", opacity: Math.sin(ph * Math.PI) * w, filter: "blur(1.5px)" }} />; })}
  </>;
  return <>
    {tray(560, true)}{tray(1360, false)}
    {Array.from({ length: 8 }, (_, k) => { const ph = (tt * 0.6 + k / 8) % 1; return <div key={k} style={{ position: "absolute", left: -200 + ph * 2300, top: 300 + k * 50, width: 260, height: 4, borderRadius: 2, background: "linear-gradient(90deg,transparent,rgba(240,230,210,.55),transparent)", opacity: w }} />; })}
  </>;
}} />;

// m17 · mediodía y de noche: la ventana se oscurece con la pared de polvo, el reloj marca las 12 y alguien prende el farol
export const HNoonDark: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(90deg,#4a3c2a,#5c4a34 50%,#4a3c2a)" f={(tt) => {
  const d = eio(tt, 1.5, 6.5), lamp = eio(tt, 7, 7.6), sw = Math.sin(tt * 3.2) * 14, dk = 0.75 * d * (1 - 0.6 * lamp);
  return <>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.06) 0 2px, transparent 2px 60px)" }} />
    {/* la ventana con marco de madera */}
    <div style={{ position: "absolute", left: 220, top: 170, width: 720, height: 620, background: "linear-gradient(#6a4626,#3a2410)", padding: 30, boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: `linear-gradient(rgb(${200 - 170 * d},${210 - 185 * d},${220 - 205 * d}), rgb(${220 - 160 * d},${200 - 160 * d},${160 - 140 * d}))` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, bottom: 0, background: "#7a6a40" }} />
        {Array.from({ length: 14 }, (_, k) => <Puff key={k} x={-100 + k * 70 + 200 * d} y={460 - d * 260 - rnd(k) * 100} r={140 + rnd(k + 2) * 120} col="rgba(70,48,28,.95)" o={eio(tt, 1.5 + k * 0.15, 3 + k * 0.2)} />)}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 16, marginLeft: -8, background: "#4a2e16" }} /><div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 16, marginTop: -8, background: "#4a2e16" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg, rgba(255,255,255,.18), transparent 40%)" }} />
      </div>
    </div>
    {/* el reloj de pared clavado en las 12 */}
    <div style={{ position: "absolute", left: 1400, top: 140, width: 300, height: 740, transform: "translateX(-50%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 740, borderRadius: "150px 150px 20px 20px", background: "linear-gradient(90deg,#4a2a12,#7a4a22 40%,#4a2a12)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ position: "absolute", left: 0, top: 0 }}>
        <circle r={120} fill="#efe6cf" stroke="#c9a24a" strokeWidth={12} />{Array.from({ length: 12 }, (_, k) => <line key={k} x1={0} y1={-100} x2={0} y2={-84} stroke={INK} strokeWidth={6} transform={`rotate(${k * 30})`} />)}
        <text y={-58} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={40} fill={INK}>XII</text>
        <line x1={0} y1={10} x2={0} y2={-92} stroke={INK} strokeWidth={8} strokeLinecap="round" /><line x1={0} y1={10} x2={0} y2={-66} stroke={INK} strokeWidth={12} strokeLinecap="round" /><circle r={10} fill="#c9a24a" /></svg>
      <div style={{ position: "absolute", left: 150, top: 300, transform: `rotate(${sw}deg)`, transformOrigin: "0 0" }}><div style={{ width: 6, height: 300, marginLeft: -3, background: "#c9a24a" }} /><div style={{ width: 70, height: 70, marginLeft: -35, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff1b8,#c9a24a 50%,#7a5a1a)" }} /></div>
    </div>
    <div style={{ position: "absolute", inset: 0, background: `rgba(10,6,2,${dk})`, pointerEvents: "none" }} />
    {/* el farol prendido a mediodía */}
    {lamp > 0 && <div style={{ position: "absolute", left: 1040, top: 640, width: 500, height: 500, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(circle, rgba(255,190,90,${0.55 * lamp}), transparent 65%)`, mixBlendMode: "screen" }} />}
    <div style={{ position: "absolute", left: 1040, top: 830, transform: "translate(-50%,-100%)" }}>
      <svg width={140} height={220} viewBox="0 0 140 220"><rect x={30} y={190} width={80} height={24} rx={6} fill="#3a3a3a" /><path d="M40 190 Q20 120 70 70 Q120 120 100 190 Z" fill={`rgba(255,${200 + 40 * lamp},${120 + 60 * lamp},${0.25 + 0.6 * lamp})`} stroke="#555" strokeWidth={5} /><ellipse cx={70} cy={150} rx={10} ry={22 * lamp} fill="#fff4c0" /><rect x={50} y={50} width={40} height={20} rx={4} fill="#3a3a3a" /><path d="M50 50 Q70 10 90 50" stroke="#3a3a3a" strokeWidth={5} fill="none" /></svg></div>
  </>;
}} />;

// m19 · la maqueta del puerto: entran tres cargueros cargados de grano, cada uno con su bandera grande, hasta el muelle de la grúa
const Flag: React.FC<{ c: "ca" | "au" | "us" }> = ({ c }) => <svg width={150} height={96} viewBox="0 0 150 96" style={{ boxShadow: "0 6px 12px rgba(0,0,0,.4)" }}>
  {c === "ca" ? <><rect width={150} height={96} fill="#fff" /><rect width={38} height={96} fill="#d52b1e" /><rect x={112} width={38} height={96} fill="#d52b1e" /><path d="M75 18 L82 36 L94 30 L89 52 L100 50 L90 62 L80 60 L80 78 L70 78 L70 60 L60 62 L50 50 L61 52 L56 30 L68 36 Z" fill="#d52b1e" /></>
    : c === "au" ? <><rect width={150} height={96} fill="#012169" /><path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth={9} /><path d="M30 0 V40 M0 20 H60" stroke="#c8102e" strokeWidth={10} />{[[110, 20], [125, 48], [100, 58], [112, 80], [40, 74]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={k === 4 ? 9 : 6} fill="#fff" />)}</>
      : <>{Array.from({ length: 13 }, (_, k) => <rect key={k} y={k * 96 / 13} width={150} height={96 / 13} fill={k % 2 ? "#fff" : "#b22234"} />)}<rect width={66} height={52} fill="#3c3b6e" />{Array.from({ length: 12 }, (_, k) => <circle key={k} cx={9 + (k % 4) * 16} cy={10 + Math.floor(k / 4) * 16} r={3.5} fill="#fff" />)}</>}
</svg>;
export const HGrainShips: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#8a9aa4 0%,#b8c0bc 48%,#3a5a6a 50%,#1e3442 100%)" f={(tt) => {
  const ships: ["ca" | "au" | "us", number, number][] = [["ca", 0.4, 1380], ["au", 2.8, 930], ["us", 5.2, 480]];
  return <>
    {Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: -100 + ((k * 230 + tt * 30) % 2100), top: 600 + k * 44, width: 240, height: 5, borderRadius: 3, background: "rgba(220,235,240,.35)" }} />)}
    {/* el muelle y la grúa con la hoz y el martillo */}
    <div style={{ position: "absolute", left: 1640, top: 520, width: 320, height: 560, background: "linear-gradient(90deg,#6a6a66,#9a9a92)", boxShadow: "-20px 0 40px rgba(0,0,0,.5)" }} />
    <svg width={420} height={520} viewBox="0 0 420 520" style={{ position: "absolute", left: 1540, top: 40 }}>
      <path d="M220 480 L240 60 L270 60 L290 480 Z" fill="#b8401f" /><path d="M240 70 L20 130 L20 150 L250 100" fill="#c9502a" stroke="#7a2a10" strokeWidth={4} /><line x1={40} y1={150} x2={40} y2={300} stroke="#333" strokeWidth={4} /><rect x={20} y={300} width={40} height={30} fill="#555" />
      <circle cx={330} cy={200} r={70} fill="#c8102e" stroke="#ffd34a" strokeWidth={6} /><path d="M300 230 L350 180 M340 170 Q370 200 340 235 Q325 240 315 230" stroke="#ffd34a" strokeWidth={10} fill="none" strokeLinecap="round" /></svg>
    {ships.map(([c, at, xe], i) => { const u = eio(tt, at, at + 2.6); if (tt < at) return null; const x = -700 + (xe + 700) * u, bob = 6 * Math.sin(tt * 2 + i), sc = 0.82 + 0.1 * i;
      return <div key={c} style={{ position: "absolute", left: x, top: 660 + i * 70 + bob, transform: `translate(-50%,-100%) scale(${sc})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: -40, bottom: -20, width: 120 + 300 * (1 - u), height: 20, borderRadius: "50%", background: "rgba(240,248,250,.6)", filter: "blur(4px)", opacity: 1 - u * 0.7 }} />
        <svg width={560} height={300} viewBox="0 0 560 300" style={{ overflow: "visible", display: "block" }}>
          <defs><linearGradient id={"hull" + i} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3a3e" /><stop offset=".5" stopColor="#242428" /><stop offset=".52" stopColor="#8a2a1a" /><stop offset="1" stopColor="#5a1a10" /></linearGradient></defs>
          <path d="M10 200 L550 200 L520 290 L60 290 Z" fill={`url(#hull${i})`} />
          <path d="M120 200 Q200 120 280 200 Z M290 200 Q360 130 430 200 Z" fill={WHEATC} stroke="#b8944a" strokeWidth={3} />
          {Array.from({ length: 30 }, (_, k) => <circle key={k} cx={140 + (k * 47) % 280} cy={180 - (k * 13) % 30} r={3} fill="#b8944a" />)}
          <rect x={440} y={110} width={90} height={90} fill="#efe6d2" /><rect x={450} y={124} width={70} height={20} fill="#6a8aa0" /><rect x={470} y={70} width={22} height={40} fill="#2a2a2a" />
          <line x1={100} y1={200} x2={100} y2={40} stroke="#2a2a2a" strokeWidth={6} /></svg>
        <div style={{ position: "absolute", left: 104, top: 36, transform: `skewY(${4 * Math.sin(tt * 4 + i)}deg)`, transformOrigin: "0 50%" }}><Flag c={c} /></div>
      </div>; })}
  </>;
}} />;

// m20 · la estación de Barayev: hileras de rastrojo parado; cae la nieve y queda atrapada detrás de cada hilera, la tierra no se vuela
export const HStripPlots: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#7a8690 0%,#b8bcb6 50%,#5a4a32 52%,#2e2214 100%)" f={(tt) => {
  const snow = eio(tt, bt(h, 1, 3.1), bt(h, 2, 7)), rows = [0, 1, 2, 3, 4, 5];
  return <>
    {rows.map((i) => { const y0 = 560 + Math.pow(i / 6, 1.4) * 520, y1 = 560 + Math.pow((i + 1) / 6, 1.4) * 520, sc = 0.35 + i * 0.16, stub = i % 2 === 0;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 0, right: 0, top: y0, height: y1 - y0 + 1, background: stub ? "#6a5232" : "#4a3420" }} />
        {stub ? <svg width={1920} height={y1 - y0 + 60 * sc} style={{ position: "absolute", left: 0, top: y0 - 60 * sc }}>{Array.from({ length: Math.round(140 / sc) }, (_, k) => { const x = (k * 13.7 * sc) % 1920 + (k % 3) * 2, hh = (50 + (k * 17) % 26) * sc;
          return <line key={k} x1={x} y1={60 * sc + (y1 - y0) * 0.8} x2={x + 2} y2={60 * sc + (y1 - y0) * 0.8 - hh} stroke={k % 2 ? "#e3c27a" : "#b8944a"} strokeWidth={Math.max(1.5, 4 * sc)} />; })}</svg>
          : <div style={{ position: "absolute", left: 0, right: 0, top: y0, height: (y1 - y0) * snow * 0.85, background: "linear-gradient(#f4f6f8,#d8dee4)", borderRadius: "0 0 40% 40% / 0 0 30% 30%", boxShadow: "0 6px 10px rgba(0,0,0,.25)" }} />}
      </React.Fragment>; })}
    {snow > 0 && Array.from({ length: 90 }, (_, k) => { const ph = (tt * (0.18 + rnd(k) * 0.12) + rnd(k + 4)) % 1; return <div key={k} style={{ position: "absolute", left: rnd(k + 2) * 1920 + 40 * Math.sin(tt + k), top: -20 + ph * 1100, width: 8 + rnd(k) * 8, height: 8 + rnd(k) * 8, borderRadius: "50%", background: "#fff", opacity: 0.85 * cl(snow * 3) }} />; })}
    <Stake x={1560} y={760} txt="Shortandy, 1957" size={64} r={-3} />
  </>;
}} />;

// m21 · la cuchilla plana en corte: pasa por debajo, corta las raíces una por una y el rastrojo queda PARADO arriba
export const HFlatCutter: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const bx = -160 + 1800 * eio(tt, 1, 8.5), depth = 170;
  const weeds = Array.from({ length: 9 }, (_, i) => 120 + i * 160);
  return <>
    <CShadow x={960} y={960} w={1640} />
    <Box x={960} y={960} w={1500} h={460} d={180} rx={-12} ry={-6} front="linear-gradient(#5a3e24,#3a2614 60%,#2a1a0c)" top="linear-gradient(#6a5232,#4a3820)" side={WOODSIDE}>
      <svg width={1500} height={460} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="fcb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8eef2" /><stop offset=".5" stopColor="#9aa4ac" /><stop offset="1" stopColor="#4a5258" /></linearGradient><filter id="fcg"><feTurbulence baseFrequency=".8" numOctaves={2} /><feColorMatrix values="0 0 0 0 .2 0 0 0 0 .13 0 0 0 0 .07 0 0 0 .5 0" /></filter></defs>
        <rect width={1500} height={460} filter="url(#fcg)" />
        {weeds.map((x, i) => { const cut = bx > x; return <g key={i}>
          {[-24, 0, 26].map((o, k) => <path key={k} d={`M${x} 40 Q${x + o} ${depth - 40} ${x + o * 1.6} ${depth} L${x + o * 2} ${depth + 140}`} stroke="#d8c09a" strokeWidth={4} fill="none" opacity={cut ? 0.3 : 0.9} strokeDasharray={cut ? "10 8" : "none"} />)}
          {cut && <circle cx={x} cy={depth} r={14 * cl((bx - x) / 60) * (1 - cl((bx - x - 120) / 80))} fill="#fff4c0" />}
        </g>; })}
        {/* rastrojo parado arriba */}
        {Array.from({ length: 70 }, (_, k) => <line key={k} x1={10 + k * 21.3} y1={40} x2={12 + k * 21.3} y2={-50 - (k * 17) % 30} stroke={k % 2 ? WHEATC : "#b8944a"} strokeWidth={5} />)}
        <rect x={0} y={34} width={1500} height={10} fill="#6a5232" />
        {/* la cuchilla y su vástago */}
        <rect x={bx - 14} y={-200} width={28} height={depth + 200} fill="url(#fcb)" />
        <path d={`M${bx - 220} ${depth + 4} L${bx + 40} ${depth - 14} L${bx + 70} ${depth + 2} L${bx + 40} ${depth + 16} L${bx - 220} ${depth + 14} Z`} fill="url(#fcb)" stroke="#2a3238" strokeWidth={3} />
      </svg>
    </Box>
    {/* las malezas de arriba se marchitan cuando les cortan la raíz */}
    {weeds.map((x, i) => { const wilt = cl((bx - x - 40) / 200); return <svg key={i} width={120} height={140} viewBox="0 0 120 140" style={{ position: "absolute", left: 960 - 750 + x - 60, top: 360, transform: `rotate(${wilt * 40}deg)`, transformOrigin: "50% 100%", opacity: 1 - 0.3 * wilt }}>
      <path d="M60 140 Q50 70 20 40 M60 140 Q70 60 100 30 M60 140 L60 20" stroke={wilt > 0.5 ? "#8a7a3a" : "#4a8a2a"} strokeWidth={6} fill="none" />{[[20, 40], [100, 30], [60, 20]].map(([a, b], k) => <ellipse key={k} cx={a} cy={b} rx={18} ry={9} fill={wilt > 0.5 ? "#9a8a4a" : "#5aa03a"} />)}</svg>; })}
    <div style={{ position: "absolute", left: Math.min(1700, Math.max(220, 960 - 750 + bx)), top: 200, transform: "translate(-50%,-100%) rotate(-3deg)", padding: "10px 26px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 64, color: INK, boxShadow: "0 12px 20px rgba(0,0,0,.45)", opacity: cl(tt * 2 - 1) }}>flat-cutter</div>
  </>;
}} />;

// m22 · Canadá, años 30: el plano azul (cianotipo) se despliega sobre la mesa y la cuchilla ancha se dibuja trazo por trazo
export const HNobleBlade: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const un = eio(tt, 0.4, 2), d1 = eio(tt, 2.2, 4), d2 = eio(tt, 4, 6.4), d3 = eio(tt, 6.6, 8);
  const ln = (d: string, p: number, w = 9) => <path d={d} stroke="#f2f6fa" strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />;
  return <>
    <CShadow x={960} y={900} w={1600} o={0.5} />
    <div style={{ position: "absolute", left: 960, top: 600, width: 1500, height: 820, transform: "translate(-50%,-50%) perspective(1700px) rotateX(38deg)", transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 750, height: 820, background: "linear-gradient(135deg,#2a5a9a,#1a3e74)", boxShadow: "20px 30px 40px rgba(0,0,0,.5)" }}><Grain id="nbl" o={0.25} f={1} blend="screen" /></div>
      <div style={{ position: "absolute", left: 750, top: 0, width: 750, height: 820, transformOrigin: "0 50%", transform: `rotateY(${-170 * (1 - un)}deg)`, background: `linear-gradient(${un < 0.5 ? 270 : 90}deg,#1a3e74,#2a5a9a)`, boxShadow: "20px 30px 40px rgba(0,0,0,.5)" }}><Grain id="nbr" o={0.25} f={1} blend="screen" /></div>
      <div style={{ position: "absolute", left: 749, top: 0, width: 3, height: 820, background: "rgba(0,0,0,.35)" }} />
      {un > 0.95 && <svg width={1500} height={820} viewBox="0 0 1500 820" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 16 }, (_, k) => <line key={k} x1={k * 100} y1={0} x2={k * 100} y2={820} stroke="rgba(240,246,250,.12)" strokeWidth={2} />)}
        {ln("M300 220 L1200 220 L1200 300 L300 300 Z M420 300 L420 470 M1080 300 L1080 470", d1)}
        {ln("M180 520 L750 430 L1320 520 L1240 560 L750 480 L260 560 Z", d2, 12)}
        {ln("M180 660 L1320 660 M180 630 L180 690 M1320 630 L1320 690", d3, 7)}
        <text x={750} y={740} textAnchor="middle" fontFamily={HAND} fontSize={96} fill="#f2f6fa" opacity={d3}>6 ft wide</text>
        <g opacity={cl(d1 * 2)}><rect x={1060} y={40} width={400} height={130} fill="none" stroke="#f2f6fa" strokeWidth={4} /><text x={1260} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#f2f6fa">C. S. NOBLE</text><text x={1260} y={150} textAnchor="middle" fontFamily={FONT} fontSize={36} fill="#f2f6fa">ALBERTA · 1936</text></g>
      </svg>}
    </div>
  </>;
}} />;

// m23 · la tribuna del desfile: sillas vacías, banderines; el único banderín rojo se suelta y cae al piso
export const HEmptyStand: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fl = eio(tt, 4, 6.4), fx = 1360 + 120 * fl + 40 * Math.sin(fl * 6), fy = 230 + 640 * fl, fr = fl * 260;
  return <>
    <CShadow x={960} y={900} w={1500} />
    {[0, 1, 2].map((r) => <Box key={r} x={960} y={900 - r * 150} w={1300 - r * 160} h={150} d={260 - r * 40} rx={-10} ry={0} front="repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 40px),linear-gradient(#b8401f,#8a2a14)" top={WOODTOP} side={WOODSIDE}>
      <svg width={1300 - r * 160} height={60} style={{ position: "absolute", top: 0 }}>{Array.from({ length: 14 }, (_, k) => <path key={k} d={`M${k * (1300 - r * 160) / 14} 0 Q${(k + 0.5) * (1300 - r * 160) / 14} 56 ${(k + 1) * (1300 - r * 160) / 14} 0`} fill={k % 2 ? "#e8dcc0" : "#c8102e"} />)}</svg></Box>)}
    {[0, 1, 2].map((r) => Array.from({ length: 7 - r }, (_, k) => { const x = 960 - (6 - r) * 85 + k * 170, y = 900 - r * 150 - 150; return <svg key={r + "c" + k} width={90} height={120} viewBox="0 0 90 120" style={{ position: "absolute", left: x - 45, top: y - 112, filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.45))" }}>
      <rect x={14} y={4} width={62} height={56} rx={6} fill="#8a6236" /><rect x={10} y={58} width={70} height={14} fill="#a87a46" /><rect x={14} y={70} width={8} height={48} fill="#6a4626" /><rect x={68} y={70} width={8} height={48} fill="#6a4626" /></svg>; }))}
    <div style={{ position: "absolute", left: 1360, top: 150, width: 10, height: 330, background: "linear-gradient(90deg,#8a8a8a,#d8d8d8,#8a8a8a)" }} />
    {fl < 0.98 ? <svg width={200} height={120} viewBox="0 0 200 120" style={{ position: "absolute", left: fx, top: fy, transform: `rotate(${fr}deg) skewY(${8 * Math.sin(tt * 5)}deg)`, transformOrigin: "0 0" }}><path d="M0 0 L200 30 Q150 60 200 90 L0 110 Z" fill="#c8102e" /><path d="M30 30 L42 54 L20 40 L44 40 L22 54 Z" fill="#ffd34a" /></svg>
      : <svg width={220} height={80} viewBox="0 0 220 80" style={{ position: "absolute", left: 1450, top: 860, transform: `skewX(${3 * Math.sin(tt * 2)}deg)` }}><ellipse cx={110} cy={60} rx={110} ry={14} fill="rgba(0,0,0,.4)" /><path d="M0 40 Q60 20 110 44 Q160 64 220 40 L210 60 Q150 76 100 62 Q50 50 10 60 Z" fill="#c8102e" /></svg>}
  </>;
}} />;

// m24 · el escritorio: el almanaque pasa a OCTUBRE 1964 y la placa de bronce con el nombre se desliza hasta el borde y cae
export const HDeskPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const cal = eio(tt, 1.2, 2), sl = eio(tt, 3.2, 5.4), tip = eIn2(tt, 5.4, 6.4), x = 1040 + 520 * sl, y = 720 + 520 * tip;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 830, height: 260, background: "linear-gradient(#4a2c14,#2a180a)", boxShadow: "0 -6px 0 #6a4224" }} />
    <CShadow x={460} y={800} w={360} />
    <div style={{ position: "absolute", left: 460, top: 800, transform: "translate(-50%,-100%)", width: 330, height: 300, background: "linear-gradient(#efe6cf,#d6c8a8)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", perspective: 900 }}>
      <div style={{ height: 80, background: "#b3221a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff" }}>{cal > 0.5 ? "OCT" : "SEP"}</div>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 130, color: INK, lineHeight: "200px" }}>{cal > 0.5 ? "14" : "30"}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 300, transformOrigin: "50% 0", transform: `rotateX(${cal * 170}deg)`, background: "linear-gradient(#e6dcc4,#cbbd9c)", opacity: cal > 0 && cal < 1 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -70, textAlign: "center", fontFamily: HAND, fontSize: 64, color: "#f3e6c6" }}>1964</div>
    </div>
    {tip < 0.6 && <CShadow x={x} y={724} w={640} k={1 - tip} />}
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) rotate(${tip * 70}deg)`, transformOrigin: "100% 100%", opacity: 1 - cl((tip - 0.8) * 5) }}>
      <Box x={0} y={0} w={600} h={120} d={70} rx={-22} ry={0} front="linear-gradient(#f3d98a,#c9a24a 45%,#8a6a1a)" top="linear-gradient(#5a3a1a,#3a2410)" side="linear-gradient(90deg,#8a6a1a,#5a4210)">
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 56, color: "#4a3408", letterSpacing: 3, textShadow: "0 1px 0 rgba(255,240,200,.6)" }}>N. S. KHRUSHCHEV</div></Box>
    </div>
  </>;
}} />;
const eIn2 = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c; };

// m25 · la manga de viento en el poste: 1963 tiesa y llena de polvo; año a año se va cayendo hasta colgar quieta en 1970
export const HErosionNeedle: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a89a7a 0%,#d0c4a4 56%,#6a5a3a 58%,#3e3020 100%)" f={(tt) => {
  const yrs = [["1963", 0.3], ["1967", 3], ["1970", 6]] as [string, number][], k = eio(tt, 2.4, 7.4), yi = yrs.filter(([, a]) => tt > a).length - 1, dust = 1 - k;
  const segs = 6, base = 6 + 70 * k;
  let x = 1000, y = 330, ang = 0;
  const parts = Array.from({ length: segs }, (_, i) => { ang = (base * (0.4 + i * 0.22)) + (1 - k) * 6 * Math.sin(tt * 9 + i) + k * 2 * Math.sin(tt * 2 + i); const len = 120, hh = 150 - i * 12, p = { x, y, ang, hh, i };
    x += len * Math.cos(ang / 57.3); y += len * Math.sin(ang / 57.3); return p; });
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 626, bottom: 0, background: `linear-gradient(rgba(90,140,50,${0.7 * k}),transparent)` }} />
    {dust > 0.05 && Array.from({ length: 60 }, (_, j) => { const ph = (tt * 0.5 + rnd(j)) % 1; return <div key={j} style={{ position: "absolute", left: -100 + ph * 2200, top: 300 + rnd(j + 3) * 520, width: 90 + rnd(j) * 120, height: 30, borderRadius: "50%", background: "rgba(120,90,60,.35)", filter: "blur(10px)", opacity: dust }} />; })}
    <div style={{ position: "absolute", left: 980, top: 300, width: 26, height: 700, background: "linear-gradient(90deg,#6a6a6a,#cfcfcf,#6a6a6a)" }} />
    <CShadow x={993} y={1000} w={200} />
    {parts.map((p) => <div key={p.i} style={{ position: "absolute", left: p.x, top: p.y, width: 124, height: p.hh, marginTop: -p.hh / 2, transform: `rotate(${p.ang}deg)`, transformOrigin: "0 50%", background: p.i % 2 ? "linear-gradient(#fff,#d8d8d8 60%,#b8b8b8)" : "linear-gradient(#ff7a2a,#e85a10 60%,#b8400a)", borderRadius: p.i === segs - 1 ? "0 30% 30% 0" : 0, boxShadow: "0 10px 14px rgba(0,0,0,.3)" }} />)}
    <div style={{ position: "absolute", left: 870, top: 560, transform: "translate(-50%,-50%) rotate(-2deg)", padding: "14px 34px", background: "linear-gradient(160deg,#c9a06a,#8a6236)", borderRadius: 8, fontFamily: MARK, fontSize: 96, color: "#2a170a", boxShadow: "0 16px 26px rgba(0,0,0,.5)" }}>{yrs[Math.max(0, yi)][0]}</div>
  </>;
}} />;

// m26 · ¿quién pagó?: la registradora vieja de bronce imprime el ticket renglón por renglón y al final se abre el cajón vacío
export const HBillEnvelopes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [["THE LAND", 0.8], ["THE YOUNG", bt(h, 0, 3.2)], ["THE HERDERS", bt(h, 1, 5.6)], ["THE COUNTRY", bt(h, 2, 9.9) - 1.6]] as [string, number][];
  const n = L.filter(([, a]) => tt > a).length, len = 120 + n * 100 + 40 * Math.min(1, ...L.map(([, a]) => cl((tt - a) * 3)).filter((v) => v > 0 && v < 1).concat([1])), drawer = eio(tt, bt(h, 2, 9.9) - 0.4, bt(h, 2, 9.9) + 0.2);
  return <>
    <CShadow x={960} y={960} w={820} />
    {/* el cajón que salta */}
    <div style={{ position: "absolute", left: 960, top: 900 + 80 * drawer, transform: "translate(-50%,0)", width: 640, height: 70, background: "linear-gradient(#8a6a1a,#5a4210)", boxShadow: "0 14px 20px rgba(0,0,0,.5)", opacity: drawer > 0 ? 1 : 0 }}><div style={{ margin: "14px auto", width: 560, height: 40, background: "#2a1a0a", boxShadow: "inset 0 6px 10px #000" }} /></div>
    <Box x={960} y={920} w={700} h={400} d={420} rx={-14} ry={-10} front="linear-gradient(135deg,#f3d98a,#c9a24a 40%,#8a6a1a)" top="linear-gradient(#d8b860,#a08030)" side="linear-gradient(90deg,#8a6a1a,#5a4210)">
      <div style={{ position: "absolute", left: 60, top: 40, right: 60, height: 90, background: "#1a1208", borderRadius: 8, boxShadow: "inset 0 4px 10px #000", fontFamily: MARK, fontSize: 70, color: "#e8d08a", textAlign: "center", lineHeight: "90px" }}>PAID BY</div>
      {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 80 + (k % 6) * 92, top: 180 + Math.floor(k / 6) * 90, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#d8d0c0 60%,#8a8270)", boxShadow: `0 ${6 - 4 * (k === n * 2 ? 1 : 0)}px 0 #4a4232` }} />)}
    </Box>
    {/* el ticket que sale por arriba */}
    <div style={{ position: "absolute", left: 960, top: 560 - len, transform: "translateX(-50%) rotate(-1.5deg)", width: 470, height: len, background: "linear-gradient(90deg,#efeadc,#fffdf6 30%,#efeadc)", boxShadow: "0 16px 24px rgba(0,0,0,.45)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {L.slice(0, n).map(([w], i) => <div key={i} style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 60, color: "#2a2118", height: 100, lineHeight: "100px" }}>{w}</div>)}</div>
    </div>
  </>;
}} />;

// m27 · el surco de los años: la reja pasa y da vuelta la tierra; de cada terrón se levanta una tablita con el año, de a una
export const HFurrowYears: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [["1953", "no food", 0.3], ["1954", "the plan", bt(h, 0, 2)], ["1955", "first dry year", bt(h, 1, 3.5)], ["1956", "miracle harvest", bt(h, 2, 5)], ["late 50s", "dust", bt(h, 3, 7)],
    ["1962–63", "black storms", bt(h, 4, 9)], ["1963", "buys grain abroad", bt(h, 5, 11)], ["1964", "Khrushchev out", bt(h, 6, 13)], ["late 60s", "flat-cutters", bt(h, 7, 15)]] as [string, string, number][];
  const i = Math.max(0, Y.filter(([, , a]) => tt > a).length - 1), a = Y[i][2], up = pop(tt, a + 0.25, 8, 0.45), sw = eio(tt, a - 0.1, a + 0.5), prev = i > 0 ? 1 - eio(tt, a, a + 0.45) : 0;
  return <>
    <div style={{ position: "absolute", left: 960, top: 820, width: 2400, height: 700, transform: "translate(-50%,-50%) perspective(1200px) rotateX(64deg)", background: "repeating-linear-gradient(90deg,#2a1c12 0 40px,#4a3220 40px 60px,#3a281a 60px 90px)", boxShadow: "inset 0 80px 120px rgba(0,0,0,.6)" }}><Grain id="fyg" o={0.4} f={0.9} /></div>
    {Array.from({ length: 16 }, (_, k) => { const ph = cl((tt - a) * 2.2 - rnd(k) * 0.3); if (ph <= 0 || ph >= 1) return null; return <div key={k} style={{ position: "absolute", left: 960 + (rnd(k + 1) - 0.5) * 500, top: 800 - Math.sin(ph * Math.PI) * (120 + rnd(k) * 140), width: 26 + rnd(k) * 20, height: 20 + rnd(k) * 16, borderRadius: "40%", background: "#4a3018" }} />; })}
    {prev > 0.01 && <div style={{ position: "absolute", left: 960, top: 800, transform: `translate(-50%,-100%) perspective(900px) rotateX(${(1 - prev) * 80}deg) translateY(${(1 - prev) * 80}px)`, transformOrigin: "50% 100%", opacity: prev }}><Plate y={Y[i - 1][0]} s={Y[i - 1][1]} /></div>}
    <div style={{ position: "absolute", left: 960, top: 800, transform: `translate(-50%,-100%) perspective(900px) rotateX(${(1 - up) * 85}deg)`, transformOrigin: "50% 100%" }}><Plate y={Y[i][0]} s={Y[i][1]} /></div>
    <CShadow x={960} y={810} w={720} k={up} />
    {/* la reja de acero barre el frente */}
    {sw > 0 && sw < 1 && <svg width={520} height={260} viewBox="0 0 520 260" style={{ position: "absolute", left: -500 + 2900 * sw, top: 820, filter: "drop-shadow(10px 20px 12px rgba(0,0,0,.5))" }}><defs><linearGradient id="fys" x1="0" x2="1"><stop offset="0" stopColor="#5a6268" /><stop offset=".6" stopColor="#d8e0e6" /><stop offset="1" stopColor="#7a8288" /></linearGradient></defs><path d="M0 200 Q240 60 520 40 L480 120 Q260 140 40 240 Z" fill="url(#fys)" /><rect x={300} y={0} width={30} height={90} fill="#3a3a3a" /></svg>}
  </>;
}} />;
const Plate: React.FC<{ y: string; s: string }> = ({ y, s }) => <div style={{ position: "relative", width: 640, padding: "26px 0 30px", background: "linear-gradient(160deg,#c9a06a,#8a6236)", borderRadius: 10, boxShadow: "0 30px 40px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,230,190,.4)", textAlign: "center", overflow: "hidden" }}>
  <Grain id="plg" o={0.3} f={0.5} /><div style={{ fontFamily: MARK, fontSize: 130, color: "#2a170a", lineHeight: 1 }}>{y}</div><div style={{ fontFamily: HAND, fontSize: 70, color: "#2a170a", marginTop: 6 }}>{s}</div>
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: "linear-gradient(transparent,rgba(42,28,18,.7))" }} /></div>;

// m28 · la bolsa de correo de lona: sale UNA carta por vez, se abre la solapa y la respuesta aparece escrita debajo de la pregunta
export const HMailbag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q = [["As bad as the Dust Bowl?", "Some years, yes. And bigger."], ["Did people die?", "No solid numbers. I won't invent any."], ["Is the land still hurt?", "Parts of it. Some went back to grass."]];
  const at = [0.5, 4, 7.4], i = Math.max(0, at.filter((a) => tt > a).length - 1), a = at[i], up = pop(tt, a, 6, 0.55), op = eio(tt, a + 0.8, a + 1.4), ans = pop(tt, a + 1.6, 7, 0.5), out = i < 2 ? eio(tt, at[i + 1] - 0.4, at[i + 1]) : 0;
  return <>
    <CShadow x={420} y={950} w={520} />
    <svg width={520} height={560} viewBox="0 0 520 560" style={{ position: "absolute", left: 160, top: 400, filter: "drop-shadow(14px 20px 16px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id="mbg" x1="0" x2="1"><stop offset="0" stopColor="#6a5a3a" /><stop offset=".45" stopColor="#a8946a" /><stop offset="1" stopColor="#5a4a2e" /></linearGradient><filter id="mbt"><feTurbulence baseFrequency="1.4" numOctaves={2} /><feColorMatrix values="0 0 0 0 .2 0 0 0 0 .16 0 0 0 0 .1 0 0 0 .35 0" /></filter></defs>
      <path d="M60 120 Q20 340 50 540 L470 540 Q500 340 460 120 Q260 80 60 120 Z" fill="url(#mbg)" /><rect x={40} y={110} width={440} height={440} filter="url(#mbt)" opacity={0.8} />
      <path d="M60 120 Q260 170 460 120" stroke="#3a2e1a" strokeWidth={10} fill="none" /><path d="M70 150 Q60 340 80 520" stroke="#e8dcc0" strokeWidth={3} strokeDasharray="12 10" fill="none" />
      <text x={260} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill="#3a2e1a" opacity={0.75}>MAIL</text>
      <path d="M90 130 Q260 -60 430 130" stroke="#4a3418" strokeWidth={18} fill="none" /></svg>
    <div style={{ position: "absolute", left: 420 + (1140 - 420) * cl(up) + out * 1400, top: 640 - 260 * cl(up), transform: `translate(-50%,-50%) rotate(${(1 - up) * -20 + out * 20}deg) scale(${0.4 + 0.6 * cl(up)})` }}>
      <div style={{ position: "relative", width: 1000, height: 600, background: "linear-gradient(160deg,#f3ead6,#dccba4)", boxShadow: "0 40px 60px rgba(0,0,0,.55)", perspective: 1200 }}>
        <div style={{ position: "absolute", left: 60, top: 60 - 40 * op, right: 60, height: 480, background: "#fffdf6", boxShadow: "0 6px 14px rgba(0,0,0,.25)", padding: "40px 50px", opacity: op }}>
          <div style={{ fontFamily: HAND, fontSize: 76, color: "#23324f", lineHeight: 1.05 }}>{Q[i][0]}</div>
          <div style={{ fontFamily: HAND, fontSize: 70, color: "#8a2a1a", marginTop: 40, opacity: cl(ans * 1.5), transform: `translateY(${(1 - ans) * 20}px)` }}>{Q[i][1]}</div></div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, transformOrigin: "50% 0", transform: `rotateX(${op * 175}deg)`, clipPath: "polygon(0 0,100% 0,50% 100%)", background: "linear-gradient(#e6d8b8,#cdbb94)", opacity: op < 0.98 ? 1 : 0 }} />
        <div style={{ position: "absolute", right: 50, top: 40, width: 120, height: 140, background: "repeating-linear-gradient(45deg,#c8102e 0 8px,#e8dcc0 8px 16px)", padding: 8, opacity: 1 - op }}><div style={{ width: "100%", height: "100%", background: "#2a5a9a" }} /></div>
      </div></div>
  </>;
}} />;

// m29 · las dos carpetas de granja sobre el escritorio: a la Nº 7 le cae la carta con lacre rojo, a la Nº 31 le cuelgan la medalla
export const HQuotaBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const l = fall(tt, 2.4), m = fall(tt, 5.2), sw = m.s > 0.5 ? 18 * Math.exp(-(tt - 5.6) * 1.4) * Math.sin((tt - 5.6) * 5) : 0;
  const folder = (x: number, n: string, r: number) => <Sheet x={x} y={720} w={640} h={460} rx={46} r={r} id={"qb" + n} bg="linear-gradient(160deg,#e4c88c,#c9a866)">
    <div style={{ position: "absolute", left: 40, top: -2, width: 260, height: 70, background: "#d8b878", borderRadius: "0 0 14px 14px" }} />
    <div style={{ position: "absolute", left: 60, top: 110, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#3a2a12" }}>Farm Nº {n}</div>
    {Array.from({ length: 4 }, (_, k) => <div key={k} style={{ position: "absolute", left: 60, top: 240 + k * 44, height: 10, width: 480 - k * 60, background: "rgba(58,42,18,.3)" }} />)}
  </Sheet>;
  return <>
    {folder(560, "7", -4)}{folder(1360, "31", 3)}
    {l.s > 0.01 && <div style={{ position: "absolute", left: 560, top: 640 + l.y, transform: "translate(-50%,-50%) rotate(-10deg)" }}>
      <div style={{ width: 460, height: 300, background: "linear-gradient(160deg,#f6efdc,#e0d2ae)", boxShadow: "0 24px 30px rgba(0,0,0,.5)", padding: "40px 40px", position: "relative" }}>
        <div style={{ fontFamily: HAND, fontSize: 84, color: "#8a1a12", transform: "rotate(-4deg)" }}>Reprimand.</div>
        <div style={{ position: "absolute", left: 180, top: 180, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e04030,#8a1208 70%)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, height: 20, background: "#b3221a", opacity: 0.85 }} /></div></div>}
    {m.s > 0.01 && <div style={{ position: "absolute", left: 1360, top: 380 + m.y, transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <svg width={220} height={420} viewBox="0 0 220 420" style={{ marginLeft: -110, filter: "drop-shadow(10px 20px 14px rgba(0,0,0,.5))" }}><defs><radialGradient id="qbm" cx="35%" cy="30%"><stop offset="0" stopColor="#fff1b8" /><stop offset=".5" stopColor="#d8a83a" /><stop offset="1" stopColor="#7a5a1a" /></radialGradient></defs>
        <path d="M60 0 L160 0 L140 230 L80 230 Z" fill="#c8102e" /><path d="M100 0 L120 0 L115 230 L105 230 Z" fill="#ffd34a" />
        <circle cx={110} cy={310} r={100} fill="url(#qbm)" stroke="#8a6a1a" strokeWidth={8} /><path d="M110 240 L128 290 L180 292 L138 322 L154 372 L110 342 L66 372 L82 322 L40 292 L92 290 Z" fill="#b8401f" /></svg></div>}
  </>;
}} />;

// m30 · el frasco del repaso: cae una cucharada de tierra distinta por paso, se asienta en su capa y la etiqueta muestra sólo la de ahora
export const HSoilJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [["hunger", "#6b5a40"], ["300,000 young people", "#8a6a40"], ["40 million ha plowed", "#3a281a"], ["one lucky harvest", WHEATC], ["bare soil, one crop", "#5a3e26"], ["black storms", "#2a1c12"], ["grain bought abroad", "#a89a62"], ["the flat-cutter", "#6a9a3a"]];
  const per = 1.1, n = L.map((_, i) => cl((tt - 0.5 - i * per) / 0.6)), cur = Math.min(L.length - 1, Math.max(0, Math.floor((tt - 0.5) / per))), lh = 62;
  let acc = 0;
  return <>
    <CShadow x={900} y={980} w={620} />
    <div style={{ position: "absolute", left: 1300, top: 980, transform: "translate(-50%,-100%) rotate(-8deg)" }}><svg width={240} height={80} viewBox="0 0 240 80"><ellipse cx={120} cy={60} rx={118} ry={18} fill="rgba(0,0,0,.4)" /><rect x={10} y={10} width={220} height={50} rx={10} fill="#a8b0b6" /><rect x={10} y={10} width={220} height={14} rx={6} fill="#d8e0e6" /></svg></div>
    <svg width={560} height={720} viewBox="0 0 560 720" style={{ position: "absolute", left: 620, top: 270, overflow: "visible" }}>
      <defs><clipPath id="sjc"><path d="M70 120 Q60 140 60 200 L60 660 Q60 700 100 700 L460 700 Q500 700 500 660 L500 200 Q500 140 490 120 Z" /></clipPath>
        <linearGradient id="sjg" x1="0" x2="1"><stop offset="0" stopColor="rgba(200,225,235,.5)" /><stop offset=".15" stopColor="rgba(255,255,255,.08)" /><stop offset=".85" stopColor="rgba(255,255,255,.05)" /><stop offset="1" stopColor="rgba(160,190,200,.5)" /></linearGradient></defs>
      <g clipPath="url(#sjc)">{L.map(([, c], i) => { const v = n[i]; if (v <= 0) return null; const top = 700 - acc - lh * v; acc += lh * v;
        return <path key={i} d={`M40 ${top + 10} Q140 ${top - 6} 280 ${top + 6} Q420 ${top + 16} 520 ${top} L520 ${top + lh + 20} L40 ${top + lh + 20} Z`} fill={c as string} stroke="rgba(0,0,0,.25)" strokeWidth={2} />; })}</g>
      {L.map(([, c], i) => { const ph = (tt - 0.5 - i * per) / 0.6; if (ph <= 0 || ph >= 1) return null; return Array.from({ length: 14 }, (_, k) => <circle key={i + "p" + k} cx={250 + (rnd(k) - 0.5) * 70} cy={20 + ph * (560 - i * 60) * (0.7 + rnd(k + 2) * 0.3)} r={6 + rnd(k) * 6} fill={c as string} />); })}
      <path d="M70 120 Q60 140 60 200 L60 660 Q60 700 100 700 L460 700 Q500 700 500 660 L500 200 Q500 140 490 120 Z" fill="url(#sjg)" stroke="rgba(235,245,250,.7)" strokeWidth={6} />
      <rect x={80} y={80} width={400} height={50} rx={10} fill="rgba(220,235,240,.35)" stroke="rgba(235,245,250,.7)" strokeWidth={5} />
      <path d="M100 220 L100 620" stroke="rgba(255,255,255,.55)" strokeWidth={14} strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", left: 1220, top: 520, transform: `rotate(${4 + 2 * Math.sin(tt * 2)}deg)`, transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", left: -80, top: 40, width: 90, height: 3, background: "#8a7a5a" }} />
      <div key={cur} style={{ padding: "18px 34px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 70, color: INK, boxShadow: "0 16px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap", opacity: cl(pop(tt, 0.5 + cur * per) * 1.5) }}>{L[cur][0]}</div></div>
  </>;
}} />;

// m31 · la frase final: una estera de paja se desenrolla sobre la tierra pelada y el polvo deja de volar; la frase en la etiqueta de arpillera
export const HCoverSoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 0.6, 3.6), rx = 260 + 1400 * c, tag = pop(tt, 3.8, 7, 0.5);
  return <>
    <CShadow x={960} y={940} w={1600} />
    <div style={{ position: "absolute", left: 960, top: 760, width: 1500, height: 520, transform: "translate(-50%,-50%) perspective(1400px) rotateX(58deg)", background: "linear-gradient(#5a3e24,#3a2614)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <Grain id="csg2" o={0.5} f={0.9} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: rx - 210, background: `repeating-linear-gradient(84deg, ${WHEATC} 0 4px, #b8944a 4px 7px, #8a6a32 7px 10px)`, boxShadow: "8px 0 16px rgba(0,0,0,.4)" }} />
    </div>
    {Array.from({ length: 50 }, (_, k) => { const ph = (tt * 0.7 + rnd(k)) % 1, x0 = 260 + rnd(k + 1) * 1400; if (x0 < rx) return null; return <div key={k} style={{ position: "absolute", left: x0 + ph * 300, top: 760 - ph * 320, width: 12, height: 12, borderRadius: "50%", background: "rgba(150,110,70,.85)", opacity: Math.sin(ph * Math.PI) }} />; })}
    {c < 1 && <div style={{ position: "absolute", left: rx - 60, top: 600, width: 120, height: 340, borderRadius: 60, background: `repeating-linear-gradient(0deg, ${WHEATC} 0 5px, #8a6a32 5px 9px)`, boxShadow: "20px 20px 30px rgba(0,0,0,.5), inset -16px 0 20px rgba(0,0,0,.35)", transform: "skewX(-14deg)" }} />}
    {tag > 0.01 && <div style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) rotate(-2deg) scale(${tag})`, padding: "26px 54px", background: "repeating-linear-gradient(45deg,#c9a876 0 3px,#b8966a 3px 6px)", boxShadow: "0 24px 34px rgba(0,0,0,.5)", textAlign: "center", fontFamily: HAND, fontSize: 78, color: "#2a170a", lineHeight: 1.1 }}>Soil doesn't care<br />how big your plan is.</div>}
  </>;
}} />;

// m13 · Washington, 1935: diorama de papel en capas; la pared de polvo rueda desde atrás y se come la cúpula mientras la luz se pone parda
export const HCapitolDust: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#5a5048,#2a241e)" f={(tt) => {
  const r = eio(tt, 0.8, 6.5), clip = pop(tt, 6.8, 7, 0.5);
  return <>
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 780, overflow: "hidden", borderRadius: 10, boxShadow: "0 40px 70px rgba(0,0,0,.6)", background: `linear-gradient(rgb(${190 - 80 * r},${205 - 110 * r},${220 - 150 * r}), rgb(${230 - 60 * r},${215 - 80 * r},${180 - 90 * r}))` }}>
      {Array.from({ length: 22 }, (_, k) => <Puff key={k} x={-500 + r * 1500 + rnd(k) * 700} y={560 - rnd(k + 4) * 420 * r} r={150 + rnd(k + 1) * 160} col="rgba(110,76,44,.95)" o={cl(r * 2 - rnd(k) * 0.5)} />)}
      <svg width={1600} height={780} viewBox="0 0 1600 780" style={{ position: "absolute", inset: 0, filter: "drop-shadow(-14px 20px 14px rgba(0,0,0,.45))" }}>
        <g transform="translate(980 0)" fill="#efe6d2" stroke="#b8ac90" strokeWidth={3}>
          <rect x={-400} y={560} width={800} height={220} /><rect x={-170} y={440} width={340} height={130} /><path d="M-160 445 Q0 160 160 445 Z" /><rect x={-24} y={140} width={48} height={70} /><path d="M-30 150 L0 100 L30 150 Z" />
          {Array.from({ length: 13 }, (_, k) => <rect key={k} x={-380 + k * 60} y={590} width={24} height={170} fill="#d8cfb8" />)}{Array.from({ length: 7 }, (_, k) => <rect key={"d" + k} x={-150 + k * 50} y={460} width={18} height={100} fill="#d8cfb8" />)}</g>
        <rect x={0} y={740} width={1600} height={40} fill="#6a7a50" /></svg>
      {Array.from({ length: 12 }, (_, k) => <Puff key={"f" + k} x={-700 + r * 1900 + rnd(k + 8) * 500} y={420 - rnd(k + 9) * 300} r={180 + rnd(k) * 140} col="rgba(90,62,36,.9)" o={cl(r * 1.6 - 0.4)} />)}
      <div style={{ position: "absolute", inset: 0, background: `rgba(90,60,30,${0.45 * r})`, mixBlendMode: "multiply" }} />
    </div>
    {clip > 0.01 && <div style={{ position: "absolute", left: 420, top: 900, transform: `translate(-50%,-50%) rotate(-4deg) scale(${clip})`, padding: "14px 34px", background: "linear-gradient(160deg,#efe8d6,#d8cfb8)", boxShadow: "0 18px 28px rgba(0,0,0,.5)", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 64, color: INK }}>WASHINGTON, 1935</div>}
  </>;
}} />;

export const HCB3: Record<string, React.FC<{ t: number; h: H }>> = {
  lessonShelf: HLessonShelf, caliOverlay: HCaliOverlay, windComb: HWindComb, noonDark: HNoonDark, grainShips: HGrainShips, stripPlots: HStripPlots, flatCutter: HFlatCutter,
  nobleBlade: HNobleBlade, emptyStand: HEmptyStand, deskPlate: HDeskPlate, erosionNeedle: HErosionNeedle, billEnvelopes: HBillEnvelopes, furrowYears: HFurrowYears,
  mailbag: HMailbag, quotaBoard: HQuotaBoard, soilJar: HSoilJar, coverSoil: HCoverSoil, capitolDust: HCapitolDust,
};
