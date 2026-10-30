// ruth29b · 2ª vuelta tras el EVALUADOR (29-oct): 1ª mitad del video rehecha como OBJETOS 3D (sombra de contacto, volumen, textura),
// una idea por pieza, texto grande y DENTRO de la escena. La 2ª mitad y los helpers viven en ruth_b3.
import React from "react";
import { H, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, INK } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, WOOD, WOODTOP, WOODSIDE } from "./obj";
import { HCB3, S, bt, fall, rnd, Puff, Stake, SOILC, WHEATC } from "./ruth_b3";

// tractor de oruga con volumen (mira a la izquierda)
const Tractor3: React.FC<{ x: number; y: number; s?: number; tt: number; id: string }> = ({ x, y, s = 1, tt, id }) =>
  <svg width={300} height={200} viewBox="0 0 300 200" style={{ position: "absolute", left: x - 150 * s, top: y - 170 * s, width: 300 * s, height: 200 * s, overflow: "visible" }}>
    <defs><linearGradient id={id + "b"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e86a3a" /><stop offset=".5" stopColor="#b8401f" /><stop offset="1" stopColor="#6a2410" /></linearGradient>
      <linearGradient id={id + "c"} x1="0" x2="1"><stop offset="0" stopColor="#d8e8f2" /><stop offset="1" stopColor="#7a9ab0" /></linearGradient></defs>
    <ellipse cx={150} cy={186} rx={150} ry={14} fill="rgba(0,0,0,.4)" />
    <rect x={40} y={128} width={220} height={54} rx={27} fill="#222" />{Array.from({ length: 7 }, (_, i) => <circle key={i} cx={66 + i * 28} cy={155} r={13} fill="#4a4a4a" stroke="#777" strokeWidth={3} transform={`rotate(${-tt * 300} ${66 + i * 28} 155)`} />)}
    {Array.from({ length: 14 }, (_, i) => <rect key={"t" + i} x={40 + ((i * 16 - tt * 60) % 224 + 224) % 224} y={124} width={8} height={8} fill="#555" />)}
    <rect x={60} y={74} width={150} height={58} rx={8} fill={`url(#${id}b)`} /><rect x={150} y={20} width={86} height={110} rx={8} fill={`url(#${id}b)`} /><rect x={162} y={32} width={60} height={42} fill={`url(#${id}c)`} />
    <rect x={88} y={30} width={14} height={46} fill="#2a2a2a" /><path d="M60 140 L0 160 L-30 190 L10 186 Z" fill="#9aa2a8" stroke="#555" strokeWidth={3} />
    {[0, 1, 2].map((k) => { const ph = ((tt * 1.4 + k / 3) % 1); return <circle key={k} cx={95 - ph * 30} cy={24 - ph * 60} r={8 + ph * 20} fill="rgba(70,70,70,.45)" opacity={1 - ph} />; })}
  </svg>;

// m0 · cámara a ras del pasto: una fila de tractores en escalón cruza el cuadro y cada arado abre una cinta de tierra negra
export const HTractorLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c0cc 0%,#e6e4d0 44%,#b8ae6a 46%,#8a8a42 100%)" f={(tt) => {
  const T = [[0.3, 520, 0.55], [0.7, 640, 0.75], [1.1, 790, 1], [1.5, 960, 1.3]] as [number, number, number][];
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, bottom: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 3px, transparent 3px 22px)" }} />
    {T.map(([a, y, s], i) => { const x = 2100 - (tt - a) * (190 * s + 60); if (tt < a) return null;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, right: 0, top: y - 30 * s, height: 40 * s, background: `repeating-linear-gradient(90deg,${SOILC} 0 ${26 * s}px,#4a3220 ${26 * s}px ${34 * s}px)`, boxShadow: `inset 0 ${8 * s}px ${10 * s}px rgba(0,0,0,.55)`, borderRadius: 6 }} />
        {Array.from({ length: 8 }, (_, k) => { const ph = (tt * 2.2 + k / 8) % 1; return <div key={k} style={{ position: "absolute", left: x - 20 * s + ph * 160 * s, top: y - 40 * s - Math.sin(ph * Math.PI) * 60 * s, width: 14 * s, height: 11 * s, borderRadius: "40%", background: "#3a2614" }} />; })}
        <Puff x={x + 220 * s} y={y - 60 * s} r={90 * s} col="rgba(160,140,100,.6)" />
        <Tractor3 x={x} y={y} s={s} tt={tt} id={"tl" + i} />
      </React.Fragment>; })}
    <svg width={1920} height={220} style={{ position: "absolute", left: 0, top: 870 }}>{Array.from({ length: 150 }, (_, k) => { const x = (k * 13.3) % 1920, hh = 90 + (k * 37) % 110; return <path key={k} d={`M${x} 220 Q${x + 6 + 8 * Math.sin(tt * 2 + k)} ${220 - hh * 0.6} ${x + 14 + 14 * Math.sin(tt * 2 + k)} ${220 - hh}`} stroke={k % 3 ? "#9a9a4a" : "#c8c070"} strokeWidth={6} fill="none" />; })}</svg>
  </>;
}} />;

// m1 · el cielo que se vuelve negro: la tierra arada sube en columnas de polvo que giran y tapan el sol
export const HBlackSky: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="#1a140e" f={(tt) => {
  const d = eio(tt, 1, 8), sun = 1 - eio(tt, 2.5, 7.5);
  return <>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(rgb(${170 - 120 * d},${180 - 140 * d},${190 - 165 * d}) 0%, rgb(${220 - 140 * d},${200 - 140 * d},${150 - 120 * d}) 62%)` }} />
    <div style={{ position: "absolute", left: 1400, top: 200, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,245,200,${sun}), rgba(255,200,120,${0.6 * sun}) 50%, transparent 70%)`, boxShadow: `0 0 120px rgba(255,220,150,${0.6 * sun})` }} />
    {Array.from({ length: 5 }, (_, c) => { const cx = 200 + c * 380, grow = eio(tt, 0.6 + c * 0.6, 7 + c * 0.4);
      return Array.from({ length: 14 }, (_, k) => { const lvl = k / 14, y = 760 - lvl * 760 * grow, x = cx + Math.sin(tt * 1.4 + k * 0.7 + c) * (40 + lvl * 120); if (lvl > grow) return null;
        return <Puff key={c + "_" + k} x={x} y={y} r={110 + lvl * 160} col={`rgba(${60 + rnd(c * 9 + k) * 30},${42 + rnd(k) * 20},${26},.9)`} />; }); })}
    {/* el campo arado y el granero como escala */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: `repeating-linear-gradient(0deg,${SOILC} 0 14px,#4a3220 14px 24px)` }} />
    <svg width={420} height={300} viewBox="0 0 420 300" style={{ position: "absolute", left: 1240, top: 480 }}><path d="M40 300 L40 140 L210 40 L380 140 L380 300 Z" fill="#1e140c" /><rect x={170} y={190} width={80} height={110} fill="#0e0a06" />{Array.from({ length: 8 }, (_, k) => <rect key={k} x={-220 + k * 60} y={250} width={10} height={60} fill="#1e140c" />)}</svg>
    <div style={{ position: "absolute", inset: 0, background: `rgba(30,18,8,${0.45 * d})` }} />
  </>;
}} />;

// m2 · el eco: dos mapas de papel plegado sobre la mesa unidos por un hilo rojo tenso; del hilo cuelga la etiqueta «20 years»
const Plains = "M120 80 L320 70 L340 200 L330 330 L250 360 L140 330 L100 200 Z", Steppe = "M60 150 Q200 60 380 110 L420 230 Q300 330 140 300 L70 240 Z";
export const HDustEcho: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const m2 = fall(tt, 2.4), str = eio(tt, 4, 5.2), tag = pop(tt, 5.4, 6, 0.5);
  const map = (x: number, r: number, path: string, name: string, yr: string, id: string) => <Sheet x={x} y={700} w={640} h={480} rx={50} r={r} id={id} bg="linear-gradient(160deg,#efe6cf,#d8caa8)">
    {[1, 2].map((k) => <div key={k} style={{ position: "absolute", left: k * 213, top: 0, bottom: 0, width: 3, background: "linear-gradient(90deg,rgba(0,0,0,.15),rgba(255,255,255,.3))" }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 240, height: 3, background: "linear-gradient(rgba(0,0,0,.15),rgba(255,255,255,.3))" }} />
    <svg width={640} height={480} viewBox="0 0 480 400" style={{ position: "absolute", inset: 0 }}><path d={path} fill="#a07448" stroke="#5a3a1a" strokeWidth={4} opacity={0.9} /></svg>
    <div style={{ position: "absolute", left: 40, top: 30, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK }}>{name}</div>
    <div style={{ position: "absolute", right: 40, bottom: 40, fontFamily: MARK, fontSize: 84, color: "#8a2a1a" }}>{yr}</div>
  </Sheet>;
  return <>
    {map(520, -6, Plains, "GREAT PLAINS", "1935", "dea")}
    {m2.s > 0.01 && <div style={{ position: "absolute", inset: 0, transform: `translateY(${m2.y}px)` }}>{map(1400, 5, Steppe, "KAZAKH STEPPE", "1955", "deb")}</div>}
    {str > 0 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M560 640 Q960 ${640 + 120 * (1 - str) + 40} ${560 + 800 * str} ${640 - 20 * str}`} stroke="#c8102e" strokeWidth={7} fill="none" />
      {[[560, 640], [560 + 800 * str, 640 - 20 * str]].map(([x, y], k) => <g key={k}><circle cx={x} cy={y} r={20} fill="#d8302a" /><circle cx={x - 6} cy={y - 6} r={6} fill="#ffb0a0" /></g>)}</svg>}
    {tag > 0.01 && <div style={{ position: "absolute", left: 960, top: 690, transform: `translate(-50%,0) rotate(${4 * Math.sin(tt * 2)}deg) scale(${tag})`, transformOrigin: "50% 0" }}>
      <div style={{ width: 3, height: 50, margin: "0 auto", background: "#8a7a5a" }} />
      <div style={{ padding: "14px 40px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 84, color: INK, boxShadow: "0 16px 24px rgba(0,0,0,.45)" }}>20 years</div></div>}
  </>;
}} />;

// m3 · la cola del pan: siluetas de papel con abrigo y pañuelo avanzan de a un paso bajo la lámpara; el mostrador vacío y la persiana que baja
export const HBreadLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#3a3026,#1e1812)" f={(tt) => {
  const step = Math.floor(tt / 1.5), ph = cl((tt % 1.5) / 0.5), adv = (step + eio(ph, 0, 1)) * 70, shut = eio(tt, 6.6, 7.6);
  const P = [0, 1, 2, 3, 4, 5, 6];
  return <>
    <div style={{ position: "absolute", left: 1380, top: 0, width: 700, height: 900, transform: "translateX(-50%)", background: "conic-gradient(from 160deg at 50% 0%, transparent 0deg, rgba(255,220,160,.22) 20deg, rgba(255,220,160,.22) 40deg, transparent 60deg)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "linear-gradient(#4a3a2a,#2a2018)" }} />
    {/* la panadería: estantes vacíos, balanza sola */}
    <div style={{ position: "absolute", left: 1260, top: 250, width: 560, height: 420, background: "linear-gradient(#5a4632,#3a2c1e)", boxShadow: "inset 0 0 40px #000" }}>{[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 20, right: 20, top: 110 + k * 110, height: 16, background: "#8a6a42", boxShadow: "0 8px 10px rgba(0,0,0,.5)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 420 * shut, background: "repeating-linear-gradient(#8a8e92 0 22px,#5a5e62 22px 26px)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} /></div>
    <Box x={1540} y={880} w={620} h={230} d={200} rx={-12} ry={-8} front={WOOD} top={WOODTOP} side={WOODSIDE}>
      <div style={{ position: "absolute", left: 80, top: 50, padding: "10px 30px", background: "#1e2a24", border: "8px solid #6a4a2c", fontFamily: HAND, fontSize: 70, color: "#f3f0e6" }}>no bread</div></Box>
    <svg width={160} height={120} viewBox="0 0 160 120" style={{ position: "absolute", left: 1600, top: 540 }}><rect x={20} y={90} width={120} height={24} rx={6} fill="#9aa0a6" /><rect x={74} y={40} width={12} height={52} fill="#7a8088" /><ellipse cx={80} cy={40} rx={70} ry={12} fill="#c8ccd0" /></svg>
    {P.map((i) => { const x = 1120 - i * 150 + Math.min(adv, 140 * 3) * (i === 0 ? 0.2 : 1) - 0, bob = ph < 1 ? 8 * Math.sin(ph * Math.PI) : 0, scarf = i % 2;
      return <div key={i} style={{ position: "absolute", left: x, top: 880 - bob, transform: `translate(-50%,-100%) scale(${1 - i * 0.03})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: 30, bottom: -14, width: 220, height: 24, borderRadius: "50%", background: "rgba(0,0,0,.45)", filter: "blur(6px)" }} />
        <svg width={170} height={440} viewBox="0 0 170 440"><path d={scarf ? "M55 40 Q85 0 115 40 L120 90 Q85 110 50 90 Z" : "M60 30 Q85 10 110 30 L115 80 Q85 96 55 80 Z"} fill={scarf ? "#5a3a3a" : "#2a2420"} />
          <circle cx={85} cy={70} r={30} fill="#1e1814" /><path d="M30 110 Q85 90 140 110 L160 340 L110 340 L105 440 L80 440 L78 340 L62 340 L60 440 L36 440 L30 340 L10 340 Z" fill={["#2e2a26", "#3a2e24", "#2a2e30"][i % 3]} />
          {scarf ? null : <rect x={52} y={22} width={66} height={14} rx={4} fill="#1a1612" />}<path d="M140 180 L150 260 L170 270" stroke="#2a2420" strokeWidth={14} fill="none" /></svg></div>; })}
  </>;
}} />;

// m4 · la muestra de suelo: el tubo de acrílico sale de la tierra, gira hacia cámara y deja ver la capa negra con raíces finas como pelo
export const HSoilCore: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const up = pop(tt, 1, 5, 0.6), turn = eio(tt, 3.6, 4.8), tag = pop(tt, 5, 7, 0.5);
  const layers = (w: number, hh: number, id: string) => <svg width={w} height={hh} viewBox={`0 0 ${w} ${hh}`} style={{ position: "absolute", inset: 0 }}>
    <rect width={w} height={hh * 0.08} fill="#5a8a2a" /><rect y={hh * 0.08} width={w} height={hh * 0.62} fill="#14100a" /><rect y={hh * 0.7} width={w} height={hh * 0.3} fill="#8a6a42" />
    {Array.from({ length: Math.round(w / 9) }, (_, k) => <path key={k} d={`M${(k * 9.3) % w} ${hh * 0.08} q${(k % 5 - 2) * 6} ${hh * 0.2} ${(k % 7 - 3) * 5} ${hh * (0.3 + (k * 13 % 30) / 100)}`} stroke="#c8b08a" strokeWidth={1.6} fill="none" opacity={0.75} />)}
    <filter id={id}><feTurbulence baseFrequency=".9" numOctaves={2} /><feColorMatrix values="0 0 0 0 .3 0 0 0 0 .22 0 0 0 0 .12 0 0 0 .4 0" /></filter><rect width={w} height={hh} filter={`url(#${id})`} /></svg>;
  return <>
    <CShadow x={760} y={960} w={1000} />
    <Box x={760} y={960} w={880} h={340} d={300} rx={-16} ry={14} front="#14100a" top="linear-gradient(#6a9a3a,#4a7a2a)" side="#2a1c10">{layers(880, 340, "scf")}</Box>
    <div style={{ position: "absolute", left: 1400, top: 860 - 520 * cl(up), transform: `translate(-50%,-100%) perspective(900px) rotateY(${-30 + 30 * turn}deg) rotate(${(1 - turn) * 6}deg)`, width: 210, height: 620 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden" }}>{layers(210, 620, "scg")}</div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(90deg, rgba(255,255,255,.4), rgba(255,255,255,.06) 30%, rgba(255,255,255,.04) 70%, rgba(255,255,255,.35))", border: "4px solid rgba(230,240,245,.7)" }} />
      <div style={{ position: "absolute", left: -6, right: -6, top: -20, height: 40, borderRadius: "50%", border: "5px solid rgba(230,240,245,.8)", background: "rgba(255,255,255,.15)" }} />
    </div>
    <CShadow x={1400} y={960} w={260} k={1 - cl(up) * 0.7} />
    {tag > 0.01 && <div style={{ position: "absolute", left: 1640, top: 520, transform: `rotate(-4deg) scale(${tag})`, transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", left: -110, top: 46, width: 110, height: 3, background: "#8a7a5a" }} />
      <div style={{ padding: "14px 32px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 70, color: INK, boxShadow: "0 16px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>black earth</div></div>}
  </>;
}} />;

// m5 · la bandeja giratoria: mitad pastura de verano, mitad invierno nevado; el rebaño de papel da la vuelta y el pasto de atrás vuelve a crecer
export const HHerdLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const rot = eio(tt, 0.5, 6) * 200, cx = 960, cy = 700, rx = 680, ry = 250;
  const Sheep: React.FC<{ x: number; y: number; s: number; k: number }> = ({ x, y, s, k }) => <svg width={110} height={80} viewBox="0 0 110 80" style={{ position: "absolute", left: x - 55 * s, top: y - 70 * s, width: 110 * s, height: 80 * s, filter: "drop-shadow(4px 8px 4px rgba(0,0,0,.4))" }}>
    <ellipse cx={50} cy={38} rx={36} ry={24} fill={k % 4 ? "#f3ede0" : "#6a4a2a"} /><circle cx={88} cy={32} r={14} fill="#2a2018" /><path d="M30 56 L30 76 M46 58 L46 78 M60 58 L60 78 M74 56 L74 76" stroke="#2a2018" strokeWidth={6} /></svg>;
  return <>
    <CShadow x={cx} y={cy + 60} w={1500} />
    <div style={{ position: "absolute", left: cx - rx, top: cy - ry + 40, width: rx * 2, height: ry * 2, borderRadius: "50%", background: "linear-gradient(#6a4626,#3a2410)" }} />
    <div style={{ position: "absolute", left: cx - rx, top: cy - ry, width: rx * 2, height: ry * 2, borderRadius: "50%", overflow: "hidden", background: `conic-gradient(from ${rot}deg, #6aa83a 0deg, #8ac04a 170deg, #e8eef4 190deg, #ffffff 350deg, #6aa83a 360deg)`, boxShadow: "inset 0 -10px 30px rgba(0,0,0,.4)" }}><Grain id="hlg" o={0.3} f={0.8} /></div>
    <svg width={220} height={180} viewBox="0 0 220 180" style={{ position: "absolute", left: cx - 110, top: cy - 160, filter: "drop-shadow(10px 16px 10px rgba(0,0,0,.45))" }}><path d="M20 170 L20 90 Q110 20 200 90 L200 170 Z" fill="#e8dcc0" stroke="#8a7a5a" strokeWidth={4} /><path d="M20 90 Q110 20 200 90" stroke="#b3221a" strokeWidth={10} fill="none" /><rect x={90} y={110} width={40} height={60} fill="#6a4a2a" /></svg>
    {Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * 360 * 0.45 + 200 - rot * 0.9, ar = a / 57.3, x = cx + Math.cos(ar) * rx * 0.8, y = cy + Math.sin(ar) * ry * 0.8, s = 0.8 + 0.4 * (Math.sin(ar) + 1) / 2;
      return <Sheep key={k} x={x} y={y} s={s} k={k} />; })}
    <Stake x={360} y={1000} txt="summer" size={66} r={-4} /><Stake x={1560} y={1000} txt="winter" size={66} r={4} />
  </>;
}} />;

// m6 · las velas (sobrio): en el estante de madera se prenden de a una velas de distintas alturas; el humo de las primeras sube y la pared se entibia
export const HCandles: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#2a221a,#14100c)" f={(tt) => {
  const N = 15, lit = Array.from({ length: N }, (_, i) => pop(tt, 0.4 + i * 0.22, 6, 0.6)), warm = lit.reduce((a, b) => a + cl(b), 0) / N, card = pop(tt, 4.4, 6, 0.5);
  return <>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,170,80,${0.32 * warm}), transparent 70%)` }} />
    <CShadow x={960} y={800} w={1600} o={0.5} />
    <Box x={960} y={790} w={1500} h={60} d={200} rx={-20} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE} />
    {lit.map((l, i) => { const x = 300 + i * 94, hh = 120 + ((i * 53) % 5) * 34, fl = 1 + 0.1 * Math.sin(tt * 9 + i * 2), sm = tt - (0.4 + i * 0.22);
      return <div key={i} style={{ position: "absolute", left: x, top: 740 - hh }}>
        {sm > 1.5 && [0, 1, 2].map((k) => { const ph = ((sm * 0.4 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: -10 + 20 * Math.sin(ph * 6 + i), top: -60 - ph * 260, width: 20 + ph * 30, height: 20 + ph * 30, borderRadius: "50%", background: "rgba(200,190,180,.18)", filter: "blur(6px)", opacity: 1 - ph }} />; })}
        <div style={{ position: "absolute", left: -12, top: -60 * fl, width: 24, height: 52 * fl * cl(l), borderRadius: "50% 50% 40% 40%", background: "radial-gradient(#fff6c8,#ffb340 60%,rgba(255,120,40,0))", filter: "blur(1px)" }} />
        <div style={{ position: "absolute", left: -70, top: -130, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(rgba(255,190,90,.4),transparent 70%)", opacity: cl(l) }} />
        <div style={{ position: "absolute", left: -2, top: -10, width: 4, height: 12, background: "#2a2018" }} />
        <div style={{ position: "absolute", left: -20, top: 0, width: 40, height: hh, borderRadius: "6px 6px 2px 2px", background: "linear-gradient(90deg,#c9bfa6,#f6efdc 40%,#d8cfb8)", boxShadow: `0 0 20px rgba(255,190,90,${0.3 * cl(l)})` }} />
      </div>; })}
    {card > 0.01 && <div style={{ position: "absolute", left: 960, top: 940, transform: `translate(-50%,-50%) scale(${card})`, textAlign: "center", fontFamily: HAND, fontSize: 70, color: "#f3e6c6", textShadow: "0 6px 20px #000" }}>more than a million Kazakhs died · 1930s</div>}
  </>;
}} />;

// m7 · la meta que crece: sobre el mapa la mancha arada se agranda; en el memo clavado la cifra se tacha con rojo y se escribe otra más grande
export const HHectareGrow: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 0.4, 9.5), N = [["13 million ha", 0.6], ["28 million ha", 4.4], ["more", 7.6]] as [string, number][];
  return <>
    <Sheet x={700} y={700} w={1000} h={620} rx={48} r={-4} id="hgm" bg="linear-gradient(160deg,#e8dcb8,#cdbb8e)">
      <svg width={1000} height={620} viewBox="0 0 1000 620" style={{ position: "absolute", inset: 0 }}>
        <path d="M80 200 Q300 80 620 120 Q860 140 930 300 Q860 520 560 540 Q260 560 110 440 Z" fill="#cfc08a" stroke="#7a6a42" strokeWidth={5} strokeDasharray="16 10" />
        <path d={`M${500 - 380 * g} ${330 - 50 * g} Q${500} ${330 - 200 * g} ${500 + 380 * g} ${330 - 60 * g} Q${500 + 420 * g} ${330 + 140 * g} ${500} ${330 + 180 * g} Q${500 - 400 * g} ${330 + 150 * g} ${500 - 380 * g} ${330 - 50 * g} Z`} fill="#2a1c12" opacity={0.92} />
        <text x={150} y={110} fontFamily={FONT} fontWeight={900} fontSize={48} fill="#5a4a2a">KAZAKHSTAN · VIRGIN LANDS</text></svg>
    </Sheet>
    <div style={{ position: "absolute", left: 1500, top: 470, transform: "translate(-50%,-50%) rotate(4deg)", width: 560, padding: "40px 40px 50px", background: "linear-gradient(#fdf8d8,#efe6b0)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: "50%", top: -14, width: 30, height: 30, marginLeft: -15, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#b3221a)" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#5a4a2a", letterSpacing: 3 }}>PLOW TARGET</div>
      {N.map(([v, a], i) => { const s = pop(tt, a, 7, 0.5), x = i < 2 ? eio(tt, N[i + 1][1] - 0.7, N[i + 1][1] - 0.1) : 0; if (s <= 0.01) return null;
        return <div key={i} style={{ position: "relative", fontFamily: HAND, fontSize: i === 2 ? 96 : 76, color: i === 2 ? "#8a1a12" : "#23324f", marginTop: 10, opacity: cl(s * 1.5), display: "inline-block", minWidth: "100%" }}>{i === 2 ? "and more…" : v}
          <div style={{ position: "absolute", left: -6, top: "52%", height: 8, width: `${x * 100}%`, background: "#c8202a", borderRadius: 4, transform: "rotate(-3deg)" }} /></div>; })}
    </div>
  </>;
}} />;

// m8 · la voz baja: el megáfono de chapa del Partido empuja ondas; la notita del científico se arruga como papel y cae a la mesa
export const HWhisper: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const mg = pop(tt, 2.4, 6, 0.5), cr = eio(tt, 4.4, 6), dropY = eIn3(tt, 6, 7) * 330, note = pop(tt, 0.4, 7, 0.5);
  return <>
    {/* la notita del científico */}
    {note > 0.01 && <div style={{ position: "absolute", left: 560, top: 470 + dropY, transform: `translate(-50%,-50%) scale(${note * (1 - 0.72 * cr)}) rotate(${cr * 160}deg)`, filter: `drop-shadow(10px 18px 12px rgba(0,0,0,.5))` }}>
      <div style={{ width: 620, padding: "36px 44px", background: "linear-gradient(160deg,#fbf7ec,#e8dcc0)", borderRadius: cr > 0.3 ? `${30 + 40 * cr}%` : 4, clipPath: cr > 0 ? `polygon(${[0, 8, 20, 35, 50, 65, 80, 92, 100].map((p, k) => `${p}% ${cr * (k % 2 ? 22 : 6)}%`).join(",")}, 100% 100%, 0 100%)` : undefined }}>
        <div style={{ fontFamily: HAND, fontSize: 70, color: "#23324f", lineHeight: 1.05, opacity: 1 - cr }}>"Plow the steppe and the wind will take it."</div>
        <div style={{ fontFamily: HAND, fontSize: 58, color: "#5a4a32", marginTop: 14, opacity: 1 - cr }}>— the soil scientists</div></div></div>}
    <CShadow x={560} y={810} w={260} k={eIn3(tt, 6, 7)} />
    {/* las ondas */}
    {mg > 0.3 && [0, 1, 2, 3].map((k) => { const ph = ((tt - 2.6) * 0.9 + k / 4) % 1; return <div key={k} style={{ position: "absolute", left: 1080 - ph * 560, top: 480, width: 120 + ph * 300, height: 300 + ph * 420, transform: "translate(-50%,-50%)", borderRadius: "50%", borderLeft: "14px solid rgba(255,214,140,.55)", opacity: (1 - ph) * cl(mg) }} />; })}
    {/* el megáfono de chapa roja */}
    {mg > 0.01 && <div style={{ position: "absolute", left: 1500 + (1 - mg) * 600, top: 480, transform: "translate(-50%,-50%) rotate(-4deg)" }}>
      <svg width={760} height={520} viewBox="0 0 760 520" style={{ overflow: "visible", filter: "drop-shadow(20px 34px 24px rgba(0,0,0,.55))" }}>
        <defs><linearGradient id="wmg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff7a5a" /><stop offset=".35" stopColor="#c8202a" /><stop offset="1" stopColor="#6a0a0a" /></linearGradient><radialGradient id="wmi" cx="50%" cy="50%"><stop offset="0" stopColor="#1a0a06" /><stop offset="1" stopColor="#5a1a10" /></radialGradient></defs>
        <path d="M120 40 L620 210 L620 310 L120 480 Z" fill="url(#wmg)" /><ellipse cx={120} cy={260} rx={70} ry={220} fill="url(#wmi)" stroke="#e8e0d0" strokeWidth={12} />
        <rect x={610} y={200} width={120} height={120} rx={14} fill="#3a3a3a" /><path d="M520 300 L560 440 L610 440 L590 300" fill="#2a2a2a" />
        <text x={400} y={282} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill="#fff4e0" transform="rotate(0 400 280)">PLOW IT!</text></svg></div>}
  </>;
}} />;
const eIn3 = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c; };

// m9 · el tren de vagones verdes frena en la estación de tierra; se abren las puertas y caen al andén valijas y un acordeón; en la pizarra sube la cuenta
export const HTrainCars: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#8a8a7a 0%,#c8bea0 52%,#7a6a4a 54%,#5a4a32 100%)" f={(tt) => {
  const arr = eio(tt, 0.3, 3.2), x0 = 2400 - 1900 * arr, door = eio(tt, 3.6, 4.2), cnt = Math.round(299883 * eio(tt, 4, 9.5));
  const bags = [[4.3, 620, "#7a4a22", 120], [4.9, 980, "#3a4a6a", 100], [5.5, 1300, "accordion", 140], [6.1, 820, "#6a2a1a", 90], [6.7, 1160, "#4a3a22", 110]] as [number, number, string, number][];
  return <>
    {[0, 1, 2].map((c) => { const x = x0 + c * 620; return <div key={c} style={{ position: "absolute", left: x, top: 330, width: 600, height: 380 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 6px 6px", background: "linear-gradient(#5a8a5a,#2e5a34 60%,#1e3a22)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
      {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 40 + k * 130, top: 60, width: 90, height: 80, background: "linear-gradient(#cfe0e8,#7a9aa8)", border: "6px solid #1e3a22" }} />)}
      <div style={{ position: "absolute", left: 230, top: 170, width: 140, height: 200, background: "#0e140e", transformOrigin: "0 50%", transform: `scaleX(${door})` }} />
      <div style={{ position: "absolute", left: 230 + 140 * door, top: 170, width: 140, height: 200, background: "linear-gradient(#4a7a4a,#2a4a2e)", border: "4px solid #1e3a22" }} />
      {[80, 480].map((wx) => <div key={wx} style={{ position: "absolute", left: wx, top: 350, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(#5a5a5a,#1a1a1a 60%)", transform: `rotate(${-arr * 900}deg)`, border: "6px dashed #3a3a3a" }} />)}
    </div>; })}
    {arr < 1 && [0, 1, 2].map((k) => <Puff key={k} x={x0 - 40 - k * 60} y={300 - k * 60} r={90 + k * 40} col="rgba(230,230,225,.8)" o={1 - arr * 0.6} />)}
    {/* el andén */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 60, background: "linear-gradient(#a89878,#7a6a4a)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />
    {bags.map(([a, x, c, w], i) => { const f = fall(tt, a); if (f.s <= 0.01) return null; return <React.Fragment key={i}><CShadow x={x} y={790} w={w + 40} k={f.k} />
      <div style={{ position: "absolute", left: x, top: 790 + f.y * 0.6, transform: `translate(-50%,-100%) rotate(${(1 - cl(f.s)) * 30}deg)`, transformOrigin: "50% 100%" }}>
        {c === "accordion" ? <svg width={150} height={130} viewBox="0 0 150 130"><rect x={0} y={20} width={36} height={100} rx={6} fill="#b3221a" /><rect x={114} y={20} width={36} height={100} rx={6} fill="#b3221a" />{Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${36 + k * 10} 24 L${41 + k * 10} 70 L${36 + k * 10} 116`} stroke="#2a2a2a" strokeWidth={4} fill="#e8dcc0" />)}{Array.from({ length: 9 }, (_, k) => <circle key={k} cx={18} cy={36 + k * 9} r={3} fill="#fff" />)}</svg>
          : <div style={{ width: w, height: w * 0.72, borderRadius: 10, background: `linear-gradient(160deg, ${c}, #1e140c)`, boxShadow: "inset 0 4px 0 rgba(255,255,255,.2)", position: "relative" }}><div style={{ position: "absolute", left: "35%", top: -16, width: "30%", height: 20, border: "6px solid #2a1a0c", borderBottom: "none", borderRadius: "10px 10px 0 0" }} /><div style={{ position: "absolute", left: 0, right: 0, top: "45%", height: 8, background: "rgba(0,0,0,.35)" }} /></div>}
      </div></React.Fragment>; })}
    {/* la pizarra de la estación */}
    <div style={{ position: "absolute", left: 1500, top: 900, transform: "translate(-50%,-50%)", padding: "16px 40px", background: "#1e2a24", border: "12px solid #6a4a2c", boxShadow: "0 20px 30px rgba(0,0,0,.5)", fontFamily: MARK, fontSize: 84, color: "#f3f0e6", opacity: cl((tt - 3.8) * 2) }}>{cnt.toLocaleString("en-US")}</div>
  </>;
}} />;

// m10 · la carpa de lona en la nieve con su farolito adentro; el termómetro de chapa clavado al poste cae de +20 a −40 y la lona se escarcha
export const HTentCold: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#1a2434 0%,#3a4a5e 56%,#c8d2dc 58%,#9aa8b4 100%)" f={(tt) => {
  const c = eio(tt, 1.4, 8), temp = 20 - 60 * c, frost = c, ang = -120 + 240 * (temp + 40) / 80;
  return <>
    {Array.from({ length: 80 + Math.round(80 * c) }, (_, k) => { const ph = (tt * (0.12 + rnd(k) * 0.1) * (1 + c) + rnd(k + 5)) % 1; return <div key={k} style={{ position: "absolute", left: rnd(k + 1) * 1920 + 30 * Math.sin(tt + k) - c * ph * 200, top: -20 + ph * 1100, width: 6 + rnd(k) * 8, height: 6 + rnd(k) * 8, borderRadius: "50%", background: "#fff", opacity: 0.85 }} />; })}
    <CShadow x={820} y={900} w={1000} o={0.4} />
    <svg width={1000} height={560} viewBox="0 0 1000 560" style={{ position: "absolute", left: 320, top: 360, overflow: "visible" }}>
      <defs><linearGradient id="tcf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c8b88a" /><stop offset="1" stopColor="#7a6a42" /></linearGradient><linearGradient id="tcs" x1="0" x2="1"><stop offset="0" stopColor="#a89868" /><stop offset="1" stopColor="#5a4a2a" /></linearGradient>
        <linearGradient id="tcx" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#f4f8ff" /><stop offset={frost} stopColor="rgba(240,248,255,.7)" /><stop offset={Math.min(1, frost + 0.05)} stopColor="rgba(240,248,255,0)" /></linearGradient></defs>
      <path d="M260 40 L760 40 L960 540 L460 540 Z" fill="url(#tcs)" /><path d="M260 40 L60 540 L460 540 Z" fill="url(#tcf)" />
      <path d="M260 120 L200 540 L320 540 Z" fill={`rgba(255,${190 + 40 * Math.sin(tt * 7)},110,.9)`} /><path d="M260 40 L60 540 L460 540 Z" fill="url(#tcx)" /><path d="M260 40 L760 40 L960 540 L460 540 Z" fill="url(#tcx)" />
      <path d="M260 40 L-60 560 M760 40 L1080 560" stroke="#e8dcc0" strokeWidth={4} /><path d="M60 540 L460 540 L960 540" stroke="#e8eef4" strokeWidth={20} /></svg>
    {/* el termómetro de chapa */}
    <div style={{ position: "absolute", left: 1500, top: 220, width: 30, height: 700, background: "linear-gradient(90deg,#4a3a22,#8a6a42,#4a3a22)" }} />
    <svg width={340} height={340} viewBox="-170 -170 340 340" style={{ position: "absolute", left: 1345, top: 260, filter: "drop-shadow(12px 20px 14px rgba(0,0,0,.5))" }}>
      <circle r={160} fill="#c8ccd0" /><circle r={140} fill="#f3f0e6" />
      {[-40, -20, 0, 20, 40].map((v) => { const a = (-120 + 240 * (v + 40) / 80 - 90) / 57.3; return <g key={v}><line x1={Math.cos(a) * 100} y1={Math.sin(a) * 100} x2={Math.cos(a) * 128} y2={Math.sin(a) * 128} stroke={INK} strokeWidth={6} /><text x={Math.cos(a) * 74} y={Math.sin(a) * 74 + 12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={v < 0 ? "#2a5a9a" : "#b3221a"}>{v}</text></g>; })}
      <line x1={0} y1={0} x2={0} y2={-118} stroke="#b3221a" strokeWidth={8} strokeLinecap="round" transform={`rotate(${ang})`} /><circle r={14} fill="#3a3a3a" /></svg>
    <div style={{ position: "absolute", left: 1515, top: 660, transform: "translateX(-50%)", fontFamily: MARK, fontSize: 110, color: temp < -20 ? "#9ac8ff" : "#f3f0e6", textShadow: "0 8px 20px #000" }}>{Math.round(temp)}°</div>
  </>;
}} />;

// m11 · el mapa de papel plegado: chinches de verdad se clavan con un golpe, cada una con su banderín de granja numerado
export const HFarmPins: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = Array.from({ length: 9 }, (_, i) => ({ x: 420 + (i % 5) * 270 + (Math.floor(i / 5) ? 135 : 0) + (rnd(i) - 0.5) * 60, y: 520 + Math.floor(i / 5) * 220 + (rnd(i + 3) - 0.5) * 60, a: 1.2 + i * 0.7, n: [1, 4, 7, 12, 19, 23, 31, 38, 44][i] }));
  return <>
    <Sheet x={960} y={680} w={1560} h={760} rx={46} r={-2} id="fpm" bg="linear-gradient(160deg,#ede2c4,#d4c49c)">
      {[1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: k * 390, top: 0, bottom: 0, width: 4, background: "linear-gradient(90deg,rgba(0,0,0,.18),rgba(255,255,255,.35))" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 4, background: "linear-gradient(rgba(0,0,0,.18),rgba(255,255,255,.35))" }} />
      <svg width={1560} height={760} style={{ position: "absolute", inset: 0 }}><path d="M120 300 Q500 80 1000 160 Q1400 200 1460 420 Q1300 680 820 660 Q300 660 140 520 Z" fill="#d8c88e" stroke="#8a7a52" strokeWidth={5} strokeDasharray="18 10" /></svg>
      <div style={{ position: "absolute", left: 80, top: 40, fontFamily: HAND, fontSize: 80, color: "#5a4a2a" }}>the virgin lands</div>
    </Sheet>
    {P.map((p, i) => { const s = pop(tt, p.a, 10, 0.32), z = (1 - cl(s)) * 260; if (s <= 0.01) return null;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: p.x + 10 + z * 0.3, top: p.y + 8 + z * 0.2, width: 50, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(4px)" }} />
        <div style={{ position: "absolute", left: p.x, top: p.y - z, transform: "translate(-50%,-100%)" }}>
          <div style={{ position: "absolute", left: 30, top: -64, padding: "6px 18px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: FONT, fontWeight: 900, fontSize: 50, color: INK, boxShadow: "0 8px 12px rgba(0,0,0,.4)", whiteSpace: "nowrap", transform: `scale(${pop(tt, p.a + 0.3)})`, transformOrigin: "0 100%" }}>Nº {p.n}</div>
          <div style={{ position: "absolute", left: 28, top: -64, width: 4, height: 70, background: "#6a6a6a" }} />
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#c8202a 55%,#6a0a0a)", boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />
          <div style={{ width: 6, height: 26, margin: "0 auto", background: "linear-gradient(90deg,#8a8a8a,#e8e8e8)" }} />
        </div></React.Fragment>; })}
  </>;
}} />;

// m12 · año por año en el cantero: 1954 sale verde, 1955 se queda flaco y seco, 1956 la espiga dorada pesa tanto que se dobla
export const HTearCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [["1954", 0.4, "g"], ["1955", 2.4, "d"], ["1956", 4.8, "w"]] as [string, number, string][];
  return <>
    <CShadow x={960} y={960} w={1600} />
    <Box x={960} y={960} w={1500} h={140} d={380} rx={-26} ry={0} front={WOOD} top="linear-gradient(#4a3220,#2a1c12)" side={WOODSIDE} />
    {Y.map(([yr, a, k], i) => { const x = 460 + i * 500, gr = eio(tt, a + 0.3, a + 2.2), big = k === "w" ? eio(tt, a + 1.6, a + 3.6) : 0;
      const hh = (k === "d" ? 200 : 340) * gr + 80 * big, lean = k === "w" ? 26 * big : k === "d" ? -8 * gr : 4 * Math.sin(tt * 1.5), col = k === "d" ? "#a8945a" : k === "w" ? "#c9a24a" : "#5aa03a";
      return <React.Fragment key={i}>
        <Stake x={x - 150} y={900} txt={yr} size={70} s={pop(tt, a, 7, 0.5)} r={-3 + i * 2} />
        {gr > 0 && <svg width={300} height={560} viewBox="0 0 300 560" style={{ position: "absolute", left: x - 30, top: 840 - 560 + 20, overflow: "visible" }}>
          {[-14, 0, 14].map((o, j) => { const L = hh * (1 - Math.abs(o) / 60), tx = 150 + o + lean * L / 120, ty = 540 - L;
            return <g key={j}><path d={`M${150 + o * 0.3} 540 Q${150 + o * 0.6} ${540 - L * 0.5} ${tx} ${ty}`} stroke={col} strokeWidth={k === "d" ? 5 : 8} fill="none" />
              {k !== "d" && gr > 0.6 && <ellipse cx={tx} cy={ty - (k === "w" ? 30 + 20 * big : 16)} rx={k === "w" ? 18 + 10 * big : 10} ry={k === "w" ? 48 + 30 * big : 26} fill={k === "w" ? "url(#tcw)" : "#7ac04a"} transform={`rotate(${lean} ${tx} ${ty})`} />}
              {k === "d" && <path d={`M${tx} ${ty} l-14 20 M${tx} ${ty + 20} l12 16`} stroke="#8a7440" strokeWidth={4} />}</g>; })}
          <defs><linearGradient id="tcw" x1="0" x2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset=".5" stopColor="#d8a83a" /><stop offset="1" stopColor="#8a6a1a" /></linearGradient></defs></svg>}
        {k === "w" && big > 0.8 && Array.from({ length: 12 }, (_, j) => { const ph = cl((tt - a - 3.4) * 1.2 - rnd(j) * 0.3); if (ph <= 0 || ph >= 1) return null; return <div key={j} style={{ position: "absolute", left: x + 160 + rnd(j + 1) * 80, top: 600 + ph * 300, width: 10, height: 16, borderRadius: "50%", background: WHEATC }} />; })}
      </React.Fragment>; })}
  </>;
}} />;

// m13 · la montaña de grano en el suelo: empieza a llover, la base se moja, se pone verde de moho, sale vapor y la pila se hunde
export const HGrainRot: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const rain = eio(tt, 1.6, 2.6), rot = eio(tt, 2.6, bt(h, 0, 8.1)), sl = eio(tt, bt(h, 0, 8.1) - 1, bt(h, 0, 8.1) + 0.6), tag = pop(tt, 0.8, 7, 0.5);
  return <>
    <CShadow x={960} y={930} w={1300} />
    <svg width={1300} height={620} viewBox="0 0 1300 620" style={{ position: "absolute", left: 310, top: 330, transform: `scaleY(${1 - 0.12 * sl}) scaleX(${1 + 0.05 * sl})`, transformOrigin: "50% 100%", overflow: "visible" }}>
      <defs><radialGradient id="grg" cx="40%" cy="20%" r="90%"><stop offset="0" stopColor="#ffe8a8" /><stop offset=".45" stopColor="#d8b468" /><stop offset="1" stopColor="#8a6a2a" /></radialGradient>
        <linearGradient id="grm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="rgba(40,60,30,.95)" /><stop offset={rot * 0.7} stopColor="rgba(70,90,40,.7)" /><stop offset={Math.min(1, rot * 0.7 + 0.12)} stopColor="rgba(70,90,40,0)" /></linearGradient>
        <filter id="grt"><feTurbulence baseFrequency="1.6" numOctaves={2} seed={3} /><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .4 0 0 0 0 .15 0 0 0 .7 -.1" /></filter>
        <clipPath id="grc"><path d="M0 620 Q300 380 560 60 Q650 0 740 60 Q1000 380 1300 620 Z" /></clipPath></defs>
      <path d="M0 620 Q300 380 560 60 Q650 0 740 60 Q1000 380 1300 620 Z" fill="url(#grg)" />
      <g clipPath="url(#grc)"><rect width={1300} height={620} filter="url(#grt)" /><rect width={1300} height={620} fill="url(#grm)" />
        {Array.from({ length: 30 }, (_, k) => <circle key={k} cx={100 + rnd(k) * 1100} cy={620 - rnd(k + 2) * 300 * rot} r={10 + rnd(k + 4) * 30} fill="rgba(110,140,60,.45)" opacity={rot} />)}</g>
    </svg>
    {rot > 0.2 && Array.from({ length: 10 }, (_, k) => { const ph = (tt * 0.3 + k / 10) % 1; return <div key={k} style={{ position: "absolute", left: 400 + rnd(k) * 1100 + 30 * Math.sin(ph * 6), top: 880 - ph * 400, width: 60 + ph * 80, height: 60 + ph * 80, borderRadius: "50%", background: "rgba(230,230,220,.25)", filter: "blur(10px)", opacity: (1 - ph) * rot }} />; })}
    {rain > 0 && Array.from({ length: 120 }, (_, k) => { const ph = (tt * (1.6 + rnd(k)) + rnd(k + 2)) % 1; return <div key={k} style={{ position: "absolute", left: rnd(k + 1) * 1920 - ph * 80, top: -100 + ph * 1100, width: 3, height: 50, background: "rgba(200,215,230,.55)", transform: "rotate(10deg)", opacity: rain }} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: `rgba(30,40,50,${0.25 * rain})` }} />
    {tag > 0.01 && <Stake x={1560} y={920} txt="no barns" size={70} s={tag} r={6} />}
  </>;
}} />;

// m14 · la pesa de hierro de un pud apoyada en la mesa; se clona en filas que se pierden hasta el fondo y entra el diario con los mil millones
export const HPoodWeight: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const m = eio(tt, 3, 7), news = pop(tt, 7.4, 6, 0.55);
  const KB: React.FC<{ s: number; id: string; txt?: boolean }> = ({ s, id, txt }) => <svg width={300 * s} height={330 * s} viewBox="0 0 300 330" style={{ overflow: "visible" }}>
    <defs><radialGradient id={id} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#8a8e92" /><stop offset=".4" stopColor="#3a3e42" /><stop offset="1" stopColor="#101214" /></radialGradient></defs>
    <path d="M90 120 Q80 20 150 20 Q220 20 210 120" stroke={`url(#${id})`} strokeWidth={38} fill="none" /><circle cx={150} cy={210} r={120} fill={`url(#${id})`} /><ellipse cx={150} cy={322} rx={90} ry={10} fill="#0a0a0a" />
    <ellipse cx={110} cy={160} rx={30} ry={18} fill="rgba(255,255,255,.18)" />
    {txt && <><text x={150} y={215} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#c8ccd0" opacity={0.85}>1 POOD</text><text x={150} y={270} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#a8acb0" opacity={0.8}>≈ 36 lb</text></>}</svg>;
  return <>
    {m > 0 && Array.from({ length: 5 }, (_, r) => Array.from({ length: 9 + r * 4 }, (_, c) => { const n = 9 + r * 4, s = 0.42 - r * 0.07, x = 960 + (c - (n - 1) / 2) * 240 * s * 1.15, y = 640 - r * 52; const v = cl(m * 6 - (r + c / n) * 0.9);
      return v > 0 && <div key={r + "_" + c} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${v})`, transformOrigin: "50% 100%", opacity: cl(v * 2), filter: `blur(${r * 0.8}px) brightness(${1 - r * 0.12})` }}><KB s={s} id={`pw${r}_${c}`} /></div>; }))}
    <CShadow x={960} y={930} w={420} />
    <div style={{ position: "absolute", left: 960, top: 930 + fall(tt, 0.3).y, transform: "translate(-50%,-100%)", filter: "drop-shadow(16px 26px 20px rgba(0,0,0,.55))" }}><KB s={1.15} id="pwm" txt /></div>
    {news > 0.01 && <div style={{ position: "absolute", left: 1500, top: 880, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - news) * 60 + 20}deg) rotate(-6deg) scale(${news})`, width: 640, padding: "24px 34px", background: "linear-gradient(160deg,#efe8d6,#d8cfb8)", boxShadow: "0 30px 40px rgba(0,0,0,.55)", fontFamily: "Georgia, serif", color: "#1e1a14" }}>
      <div style={{ fontSize: 30, letterSpacing: 4, borderBottom: "3px double #1e1a14", paddingBottom: 6, textAlign: "center" }}>PRAVDA · 1956</div>
      <div style={{ fontWeight: 900, fontSize: 76, lineHeight: 1, textAlign: "center", marginTop: 12 }}>1 BILLION POODS</div></div>}
  </>;
}} />;

// m15 · el dado de madera: rueda por la mesa mostrando sol, grieta, lluvia… y se queda con la nube de lluvia arriba. Ese año fue suerte.
const DFace: React.FC<{ k: number }> = ({ k }) => <svg width={300} height={300} viewBox="0 0 300 300">
  {k === 0 ? <><ellipse cx={150} cy={120} rx={90} ry={50} fill="#5a7a9a" /><circle cx={100} cy={110} r={44} fill="#6a8aaa" /><circle cx={190} cy={104} r={50} fill="#6a8aaa" />{[90, 130, 170, 210].map((x, j) => <path key={j} d={`M${x} ${180 + (j % 2) * 20} q-8 22 0 30 q8 -8 0 -30`} fill="#2a6ac0" />)}</>
    : k === 1 ? <><circle cx={150} cy={150} r={60} fill="#e8a020" />{Array.from({ length: 12 }, (_, j) => <line key={j} x1={150} y1={70} x2={150} y2={40} stroke="#e8a020" strokeWidth={10} transform={`rotate(${j * 30} 150 150)`} />)}</>
      : <path d="M40 150 L110 140 L130 90 L170 160 L230 120 L260 170 M110 140 L120 220 M170 160 L190 240" stroke="#5a3a1a" strokeWidth={10} fill="none" />}</svg>;
export const HCoinRain: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 0.3, 3.4), x = -300 + 1260 * u, bounce = Math.abs(Math.sin(u * Math.PI * 3)) * 260 * (1 - u), rx = (1 - u) * 720 + 0, ry = (1 - u) * -540, tag = pop(tt, 4.4, 7, 0.5), cloud = eio(tt, 3.6, 4.4);
  const faceS = (bg: string) => ({ position: "absolute" as const, inset: 0, background: bg, borderRadius: 30, boxShadow: "inset 0 0 30px rgba(0,0,0,.35)" });
  return <>
    <CShadow x={x} y={900} w={380} k={1 - bounce / 300} />
    <div style={{ position: "absolute", left: x, top: 900 - 160 - bounce, width: 300, height: 300, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${-18 + rx}deg) rotateY(${22 + ry}deg)`, transformStyle: "preserve-3d" }}>
      {[["translateZ(150px)", 0], ["rotateY(180deg) translateZ(150px)", 2], ["rotateY(90deg) translateZ(150px)", 1], ["rotateY(-90deg) translateZ(150px)", 2], ["rotateX(90deg) translateZ(150px)", 1], ["rotateX(-90deg) translateZ(150px)", 2]].map(([tr, k], i) =>
        <div key={i} style={{ ...faceS(i === 0 ? "linear-gradient(160deg,#f0d6a8,#c9a06a)" : "linear-gradient(160deg,#e0c08a,#a87a46)"), transform: tr as string, backfaceVisibility: "hidden" }}><DFace k={k as number} /></div>)}
    </div>
    {cloud > 0 && <>{[[-80, 0, 90], [20, -30, 110], [120, 0, 90]].map(([dx, dy, r], k) => <Puff key={k} x={960 + dx} y={330 + dy - 30 * (1 - cloud)} r={r * cloud} col="rgba(110,130,160,.95)" />)}
      {Array.from({ length: 24 }, (_, k) => { const ph = (tt * 1.6 + rnd(k)) % 1; return <div key={k} style={{ position: "absolute", left: 860 + rnd(k + 1) * 220, top: 380 + ph * 300, width: 4, height: 34, background: "rgba(140,180,230,.8)", opacity: cloud * (1 - ph) }} />; })}</>}
    {tag > 0.01 && <Stake x={1500} y={900} txt="mostly luck" size={70} s={tag} r={4} />}
  </>;
}} />;

// m16 · la vertedera de acero en primer plano: corta un terrón con pasto, lo sube por la curva, lo da vuelta y lo deja con las raíces arriba
export const HMoldboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const blocks = [0.8, 3.2, 5.6];
  const P = (u: number) => ({ x: 560 + 760 * u, y: 760 - Math.sin(u * Math.PI) * 360, r: 180 * eio(u, 0.15, 0.85) });
  return <>
    <CShadow x={960} y={940} w={1700} />
    <Box x={960} y={950} w={1600} h={180} d={260} rx={-14} ry={0} front="linear-gradient(#4a3220,#2a1c10)" top="linear-gradient(#5a8a2a,#3a6a1a)" side="#2a1c10" />
    {/* los terrones ya dados vuelta, apilados a la derecha */}
    {blocks.map((a, i) => { const u = eio(tt, a, a + 2.2); if (tt < a) return null; const p = P(u);
      return <div key={i} style={{ position: "absolute", left: u >= 1 ? 1320 + i * 90 : p.x, top: u >= 1 ? 760 - i * 10 : p.y, transform: `translate(-50%,-50%) rotate(${u >= 1 ? 180 : p.r}deg)`, filter: "drop-shadow(10px 18px 12px rgba(0,0,0,.5))" }}>
        <svg width={240} height={130} viewBox="0 0 240 130"><rect y={30} width={240} height={100} rx={10} fill="#3a2614" /><rect y={14} width={240} height={26} rx={8} fill="#4a8a2a" />{Array.from({ length: 30 }, (_, k) => <line key={k} x1={6 + k * 8} y1={20} x2={4 + k * 8 + (k % 3 - 1) * 4} y2={-10 - (k * 7) % 14} stroke="#6aa83a" strokeWidth={4} />)}{Array.from({ length: 10 }, (_, k) => <path key={"r" + k} d={`M${14 + k * 23} 128 q${(k % 3 - 1) * 8} 16 ${(k % 2 ? 6 : -6)} 30`} stroke="#c8b08a" strokeWidth={3} fill="none" />)}</svg></div>; })}
    {/* la vertedera: chapa curva brillante */}
    <svg width={900} height={620} viewBox="0 0 900 620" style={{ position: "absolute", left: 360, top: 280, filter: "drop-shadow(20px 34px 24px rgba(0,0,0,.55))", overflow: "visible" }}>
      <defs><linearGradient id="mbs" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#3a4248" /><stop offset=".45" stopColor="#e8f0f4" /><stop offset=".6" stopColor="#9aa4ac" /><stop offset="1" stopColor="#4a5258" /></linearGradient></defs>
      <path d="M100 520 Q300 520 460 300 Q560 140 760 110 L800 170 Q620 200 540 340 Q400 560 140 580 Z" fill="url(#mbs)" stroke="#2a3238" strokeWidth={5} />
      <path d="M80 520 L180 520 L150 590 L40 600 Z" fill="#5a6268" stroke="#2a3238" strokeWidth={4} />
      <rect x={560} y={-200} width={40} height={360} fill="#3a3e42" transform="rotate(14 580 0)" /></svg>
  </>;
}} />;

// m17 · trigo, trigo, trigo: cae un costal de semilla por año en fila y la misma parcela de adelante se pone gris y se raja
export const HWheatRepeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 8, per = 1.15, n = Array.from({ length: N }, (_, i) => fall(tt, 0.5 + i * per)), worn = cl((tt - 0.5) / (per * N));
  return <>
    {n.map((f, i) => { if (f.s <= 0.01) return null; const x = 300 + i * 190; return <React.Fragment key={i}>
      <CShadow x={x} y={560} w={170} k={f.k} />
      <div style={{ position: "absolute", left: x, top: 560 + f.y, transform: "translate(-50%,-100%)" }}>
        <svg width={160} height={210} viewBox="0 0 160 210"><defs><linearGradient id={"wr" + i} x1="0" x2="1"><stop offset="0" stopColor="#8a7448" /><stop offset=".5" stopColor="#c8b080" /><stop offset="1" stopColor="#7a6440" /></linearGradient></defs>
          <path d="M20 40 Q10 120 18 200 L142 200 Q150 120 140 40 Q80 20 20 40 Z" fill={`url(#wr${i})`} /><path d="M30 34 Q80 0 130 34" stroke="#6a5430" strokeWidth={10} fill="none" />
          <text x={80} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#3a2a12">WHEAT</text><text x={80} y={170} textAnchor="middle" fontFamily={MARK} fontSize={34} fill="#8a1a12">{1955 + i}</text></svg></div></React.Fragment>; })}
    {/* la parcela: cada año más gris y rajada */}
    <CShadow x={960} y={1000} w={1300} />
    <div style={{ position: "absolute", left: 960, top: 830, width: 1200, height: 380, transform: "translate(-50%,-50%) perspective(1200px) rotateX(55deg)", background: `linear-gradient(rgb(${74 + 70 * worn},${52 + 62 * worn},${34 + 64 * worn}),rgb(${54 + 70 * worn},${38 + 60 * worn},${24 + 60 * worn}))`, boxShadow: "0 30px 50px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <Grain id="wrg" o={0.45} f={0.9} />
      <svg width={1200} height={380} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 14 }, (_, k) => { const s = cl(worn * 16 - k); return s > 0 && <path key={k} d={`M${rnd(k) * 1200} ${rnd(k + 1) * 380} l${(rnd(k + 2) - 0.5) * 300 * s} ${(rnd(k + 3) - 0.5) * 160 * s} l${(rnd(k + 4) - 0.5) * 200 * s} ${(rnd(k + 5) - 0.5) * 120 * s}`} stroke="#2a1c10" strokeWidth={6} fill="none" />; })}</svg>
    </div>
  </>;
}} />;

// m18 · barbecho negro: la púa del cultivador pasa arrollando el pasto y deja tierra negra suelta; después una ráfaga la levanta en polvo
export const HBareFallow: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 0.6, 5), x = 200 + 1520 * u, gust = eio(tt, 5.8, 6.6), tag = pop(tt, 4.6, 7, 0.5);
  return <>
    <CShadow x={960} y={960} w={1700} />
    <div style={{ position: "absolute", left: 960, top: 780, width: 1600, height: 520, transform: "translate(-50%,-50%) perspective(1300px) rotateX(58deg)", overflow: "hidden", boxShadow: "0 40px 60px rgba(0,0,0,.6)", background: "linear-gradient(#2e2014,#1e140c)" }}>
      <Grain id="bfg" o={0.55} f={1} />
      <div style={{ position: "absolute", left: x - 160, right: 0, top: 0, bottom: 0, background: "repeating-linear-gradient(86deg,#5aa03a 0 5px,#4a8a2a 5px 9px,#6ab04a 9px 13px)" }} />
    </div>
    {u < 1 && <div style={{ position: "absolute", left: 960 - 800 + 1600 * ((x - 200) / 1520) - 30, top: 520, width: 90 + 40 * u, height: 480, borderRadius: 50, background: "repeating-linear-gradient(0deg,#5aa03a 0 6px,#3a6a22 6px 10px)", boxShadow: "16px 20px 24px rgba(0,0,0,.5), inset -14px 0 18px rgba(0,0,0,.35)", transform: "skewX(-16deg)" }} />}
    {u < 1 && <svg width={260} height={520} viewBox="0 0 260 520" style={{ position: "absolute", left: 960 - 800 + 1600 * ((x - 200) / 1520) - 220, top: 120, filter: "drop-shadow(16px 26px 18px rgba(0,0,0,.55))" }}><defs><linearGradient id="bft" x1="0" x2="1"><stop offset="0" stopColor="#5a6268" /><stop offset=".5" stopColor="#e0e8ee" /><stop offset="1" stopColor="#6a7278" /></linearGradient></defs><path d="M120 0 L150 0 Q160 260 230 420 Q240 470 200 500 L180 480 Q200 440 160 360 Q110 240 120 0 Z" fill="url(#bft)" /></svg>}
    {gust > 0 && Array.from({ length: 80 }, (_, k) => { const ph = ((tt - 5.8) * (0.5 + rnd(k) * 0.4) + rnd(k + 6)) % 1; return <div key={k} style={{ position: "absolute", left: 200 + rnd(k + 1) * 1400 + ph * 600, top: 760 - ph * 500 * (0.3 + rnd(k + 2)), width: 10 + rnd(k) * 16, height: 10 + rnd(k) * 16, borderRadius: "50%", background: "rgba(80,58,36,.85)", opacity: Math.sin(ph * Math.PI) * gust, filter: "blur(1.5px)" }} />; })}
    {tag > 0.01 && <Stake x={360} y={980} txt="black fallow" size={66} s={tag} r={-4} />}
  </>;
}} />;

export const HCB2: Record<string, React.FC<{ t: number; h: H }>> = {
  tractorLine: HTractorLine, blackSky: HBlackSky, dustEcho: HDustEcho, breadLine: HBreadLine, soilCore: HSoilCore, herdLoop: HHerdLoop, candles: HCandles,
  hectareGrow: HHectareGrow, whisper: HWhisper, trainCars: HTrainCars, tentCold: HTentCold, farmPins: HFarmPins, tearCalendar: HTearCalendar, grainRot: HGrainRot,
  poodWeight: HPoodWeight, coinRain: HCoinRain, moldboard: HMoldboard, wheatRepeat: HWheatRepeat, bareFallow: HBareFallow,
  ...HCB3,
};
