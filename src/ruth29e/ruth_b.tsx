// ruth29b «Virgin Lands» · componentes únicos (uno por minuto), ninguno repite mecanismo de ruth29a.
// La estepa, el arado, el viento: cada pieza es un objeto o un corte de tierra que cuenta la idea de ese segundo.
import React from "react";
import { H, Mode, Stage, cl, eio, eIn, TX, DIM, AMB, RED, MARK, HAND } from "./hkit";
import { FONT } from "./lib";
import { pop, At, Stamp, PAPER, INK, STAMP } from "./ruth_a";

export const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode }> = ({ t, h, f }) => <Stage t={t} h={h} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
export const bt = (h: H, i: number, d: number) => (h.bt && h.bt[i] != null ? h.bt[i] : d);
export const shadow = "0 50px 110px rgba(0,0,0,.65)";
export const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
export const SOIL = "#2a1c12", GRASS = "#a8a25a", WHEAT = "#e3c27a";
export const Lbl: React.FC<{ x: number; y: number; tt: number; at: number; txt: string; size?: number; col?: string; hand?: boolean; c?: boolean }> = ({ x, y, tt, at, txt, size = 60, col = TX, hand = true, c = true }) => {
  const s = pop(tt, at, 7, 0.5); if (s <= 0.01) return null; size = Math.max(size, hand ? 58 : 50);   // legible en el celular
  return <div style={{ position: "absolute", left: x, top: y, transform: `${c ? "translateX(-50%)" : ""} translateY(${(1 - s) * 30}px)`, opacity: cl(s * 1.6), fontFamily: hand ? HAND : FONT, fontWeight: hand ? 400 : 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.7)" }}>{txt}</div>;
};
// tractor de perfil (oruga + cabina) en SVG
const Tractor: React.FC<{ x: number; y: number; s?: number; tt: number }> = ({ x, y, s = 1, tt }) => <svg width={220} height={150} viewBox="0 0 220 150" style={{ position: "absolute", left: x - 110 * s, top: y - 120 * s, transform: `scale(${s})`, transformOrigin: "0 0", overflow: "visible" }}>
  <rect x={20} y={95} width={170} height={44} rx={22} fill="#2a2a2a" />{Array.from({ length: 6 }, (_, i) => <circle key={i} cx={42 + i * 26} cy={117} r={10} fill="#555" transform={`rotate(${tt * 300} ${42 + i * 26} 117)`} />)}
  <rect x={40} y={50} width={110} height={48} rx={6} fill="#b8401f" /><rect x={110} y={14} width={60} height={70} rx={6} fill="#c9502a" /><rect x={120} y={22} width={40} height={30} fill="#9fc0dd" />
  <rect x={60} y={20} width={10} height={32} fill="#3a3a3a" /><circle cx={65} cy={14 - (tt * 30) % 12} r={6 + (tt * 30) % 12 * 0.6} fill="rgba(60,60,60,.4)" />
  <path d="M0 120 L-40 140 L-20 140 Z" fill="#7c8188" />
</svg>;

// m0 · la fila de tractores que abre surcos negros en un pasto que nunca se cortó
export const HTractorLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.3, 10);
  return <div style={{ position: "absolute", left: 120, top: 140, width: 1680, height: 820, borderRadius: 24, overflow: "hidden", boxShadow: shadow, background: "linear-gradient(#cfe0e8 0%,#eef0e0 34%,#c8bf78 36%,#a8a25a 100%)" }}>
    {Array.from({ length: 6 }, (_, i) => { const y = 360 + i * 80, w = (1680 + 400) * p - i * 120; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 1680 - Math.max(0, w), top: y, width: Math.max(0, w), height: 46 + i * 8, background: `repeating-linear-gradient(90deg,${SOIL} 0 30px,#3a281a 30px 36px)`, boxShadow: "inset 0 6px 10px rgba(0,0,0,.5)" }} />
      <Tractor x={1680 - w - 40} y={y + 40 + i * 6} s={0.45 + i * 0.12} tt={tt} /></React.Fragment>; })}
    <Lbl x={840} y={60} tt={tt} at={3} txt="northern Kazakhstan · spring 1955" size={58} col="#2a3a44" />
  </div>;
}} />;

// m0-1 · el cielo que se vuelve negro: la tierra arada sube en columnas y apaga el sol
export const HBlackSky: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = eio(tt, 0.8, 7);
  return <div style={{ position: "absolute", left: 120, top: 140, width: 1680, height: 820, borderRadius: 24, overflow: "hidden", boxShadow: shadow, background: `linear-gradient(rgb(${200 - 160 * d},${210 - 175 * d},${220 - 195 * d}) 0%,rgb(${230 - 180 * d},${220 - 175 * d},${190 - 160 * d}) 60%, ${SOIL} 62%, #1c120a 100%)` }}>
    <div style={{ position: "absolute", left: 1200, top: 120, width: 160, height: 160, borderRadius: "50%", background: "#fff6d8", opacity: 1 - 0.85 * d, boxShadow: `0 0 ${80 - 60 * d}px #fff2c0` }} />
    {Array.from({ length: 26 }, (_, i) => { const x = rnd(i) * 1800 - 60, r = 120 + rnd(i + 9) * 220, up = eio(tt, 0.6 + rnd(i + 3) * 3, 6 + rnd(i + 3) * 3);
      return <div key={i} style={{ position: "absolute", left: x - r, top: 520 - up * 500 - r * 0.5, width: r * 2, height: r * 1.6, borderRadius: "50%", background: "radial-gradient(#3a2a1a,rgba(40,28,18,0))", filter: "blur(20px)", opacity: up * 0.95, transform: `translateX(${tt * 30}px)` }} />; })}
    <Lbl x={840} y={700} tt={tt} at={4.5} txt="day after day · for most of ten years" size={60} />
  </div>;
}} />;

// m2 · el eco: dos mapas espejados, las Grandes Llanuras (1935) y la estepa (1955), unidos por «20 años»
export const HDustEcho: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = pop(tt, 0.3, 5, 0.5), R = pop(tt, 1.6, 5, 0.5), arc = eio(tt, 2.6, 4.2);
  const card = (x: number, s: number, ttl: string, yr: string, ry: number) => <div style={{ position: "absolute", left: x, top: 250, width: 640, height: 520, transform: `perspective(1600px) rotateY(${ry * (1 - s) + ry * 0.25}deg) translateY(${(1 - s) * 500}px)`, borderRadius: 16, background: "linear-gradient(#cdbf96,#a8946a)", boxShadow: shadow, overflow: "hidden" }}>
    <svg width={640} height={520}><path d="M80 120 Q260 60 420 110 Q560 150 580 300 Q520 430 330 420 Q140 440 90 300 Z" fill="#8a6a40" opacity={0.6} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={150 + (i * 53) % 380} cy={170 + (i * 71) % 220} r={30 + (i % 3) * 14} fill="#3a2a1a" opacity={0.35 * s} />)}</svg>
    <div style={{ position: "absolute", left: 30, bottom: 26, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK }}>{ttl}</div>
    <div style={{ position: "absolute", right: 30, top: 20, fontFamily: MARK, fontSize: 70, color: "#5a2a1a" }}>{yr}</div></div>;
  return <>
    {card(180, L, "GREAT PLAINS", "1935", 18)}{card(1100, R, "THE STEPPE", "1955", -18)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M500 250 Q960 30 1420 250" stroke={AMB} strokeWidth={8} fill="none" strokeDasharray={1100} strokeDashoffset={1100 * (1 - arc)} /></svg>
    <Lbl x={960} y={80} tt={tt} at={4} txt="20 years later · every chance to learn" size={60} col={AMB} />
  </>;
}} />;

// m3 · la cola del pan: siluetas que avanzan de a un paso hacia un mostrador vacío
export const HBreadLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const step = Math.floor(tt / 1.6) + eio(tt % 1.6, 0, 0.5);
  return <>
    <div style={{ position: "absolute", left: 1460, top: 420, width: 360, height: 300, background: "linear-gradient(#6b4a2c,#4a321e)", boxShadow: shadow, borderRadius: 8 }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 30, height: 120, background: "#2a1c12", borderRadius: 4 }} />
      <Lbl x={180} y={170} tt={tt} at={2.5} txt="NO BREAD TODAY" size={36} hand={false} col="#e8dcc0" />
    </div>
    {Array.from({ length: 11 }, (_, i) => { const x = 1380 - i * 120 + Math.min(step * 18, 120) * (i > 0 ? 1 : 0), bob = Math.abs(Math.sin(tt * 3 + i)) * 4;
      return <svg key={i} width={90} height={260} style={{ position: "absolute", left: x - 45, top: 470 - bob, opacity: cl(pop(tt, 0.1 + i * 0.12)) }}>
        <circle cx={45} cy={34} r={24} fill="#1d1a16" /><path d="M10 260 L18 90 Q45 66 72 90 L80 260 Z" fill={i % 3 ? "#2a2622" : "#3a2f28"} />{i % 2 ? <rect x={52} y={140} width={30} height={36} rx={4} fill="#6b5a40" /> : null}</svg>; })}
    <Lbl x={760} y={800} tt={tt} at={3.5} txt="a superpower that can't feed itself · 1953" size={58} />
  </>;
}} />;

// m3-4 · la muestra de suelo: el tubo sale de la tierra con la capa negra de miles de años y raíces
export const HSoilCore: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const up = eio(tt, 0.6, 2.6), ruler = eio(tt, 2.8, 4.4);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "linear-gradient(#a8a25a 0 18px,#3a281a 18px)" }} />
    <div style={{ position: "absolute", left: 830, top: 760 - 640 * up, width: 260, height: 640, borderRadius: 18, overflow: "hidden", boxShadow: shadow, border: "6px solid #c9cdd2" }}>
      <div style={{ height: 40, background: GRASS }} /><div style={{ height: 380, background: "linear-gradient(#1a120a,#2a1c12 70%,#3a2a1c)", position: "relative" }}>
        <svg width={260} height={380}>{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${20 + i * 15} 0 Q${30 + i * 15 + 20 * Math.sin(i)} 180 ${10 + i * 16} ${200 + (i * 37) % 170}`} stroke="#c9b48a" strokeWidth={2} fill="none" opacity={0.6} />)}</svg></div>
      <div style={{ height: 220, background: "linear-gradient(#8a6a40,#a8845a)" }} />
    </div>
    <div style={{ position: "absolute", left: 1130, top: 160, height: 400 * ruler, borderLeft: `5px solid ${AMB}` }} />
    <Lbl x={1160} y={300} tt={tt} at={3.6} txt="black earth · built by roots" size={58} c={false} col={AMB} />
    <Lbl x={1160} y={380} tt={tt} at={4.3} txt="over thousands of years" size={50} c={false} />
  </>;
}} />;

// m4 · el circuito de los pastores: pastura de verano ↔ de invierno, el rebaño gira y el pasto vuelve a crecer
export const HHerdLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const r = pop(tt, 0.2, 5, 0.55);
  return <At x={960} y={560} rx={52}>
    <div style={{ width: 1400, height: 900, position: "relative", borderRadius: "50%", background: `radial-gradient(#b7ae6a,#8f8a48)`, boxShadow: shadow, transform: `scale(${r})` }}>
      <svg width={1400} height={900} style={{ position: "absolute", inset: 0 }}><ellipse cx={700} cy={450} rx={480} ry={270} fill="none" stroke="#f3ead6" strokeWidth={6} strokeDasharray="22 18" strokeDashoffset={-tt * 60} /></svg>
      {Array.from({ length: 14 }, (_, i) => { const a = tt * 0.45 + i * 0.09; return <div key={i} style={{ position: "absolute", left: 700 + 480 * Math.cos(a) - 18, top: 450 + 270 * Math.sin(a) - 12, width: 36 + (i % 3) * 8, height: 24, borderRadius: "50%", background: i % 4 === 0 ? "#6b4a2c" : "#eee6d6", boxShadow: "0 6px 6px rgba(0,0,0,.3)" }} />; })}
      {[[260, 300, "SUMMER PASTURE"], [1140, 600, "WINTER PASTURE"]].map(([x, y, l], i) => <div key={i} style={{ position: "absolute", left: x as number, top: y as number, transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, background: PAPER, padding: "10px 20px", borderRadius: 8, opacity: cl(pop(tt, 1.2 + i)) }}>{l}</div>)}
      <Lbl x={700} y={420} tt={tt} at={3.5} txt="the herd moves on · the grass holds the soil" size={50} col="#2a3a20" />
    </div>
  </At>;
}} />;

// m5 · velas que se encienden de a una por la gran hambruna (sobrio, sin números grandes)
export const HCandles: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  {Array.from({ length: 21 }, (_, i) => { const x = 260 + i * 70, lit = pop(tt, 0.4 + i * 0.16, 6, 0.6), fl = 1 + 0.08 * Math.sin(tt * 9 + i * 2);
    return <div key={i} style={{ position: "absolute", left: x, top: 560 + (i % 2) * 40 }}>
      <div style={{ position: "absolute", left: -10, top: -54 * fl, width: 20, height: 46 * fl * lit, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(#fff6c8,#ffb340 60%,rgba(255,120,40,0))", filter: "blur(1px)" }} />
      <div style={{ position: "absolute", left: -60, top: -110, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(rgba(255,190,90,.35),transparent 70%)", opacity: lit }} />
      <div style={{ position: "absolute", left: -14, top: 0, width: 28, height: 150, borderRadius: 4, background: "linear-gradient(90deg,#d8cfb8,#f3ead6,#c9bfa6)" }} /></div>; })}
  <Lbl x={960} y={820} tt={tt} at={3.6} txt="ASHARSHYLYK · the great hunger · early 1930s" size={56} hand={false} col="#e8dcc0" />
  <Lbl x={960} y={900} tt={tt} at={4.6} txt="more than a million Kazakhs died" size={52} />
</>} />;

// m6 · la meta que crece: un cuadro arado que se expande hectárea por hectárea, y la conversión a acres
export const HHectareGrow: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 0.5, 4.5), side = 120 + 520 * Math.sqrt(g);
  return <>
    <At x={760} y={560} rx={60} r={-35}>
      <div style={{ width: 760, height: 760, background: GRASS, boxShadow: shadow, position: "relative" }}>
        <div style={{ position: "absolute", left: 380 - side / 2, top: 380 - side / 2, width: side, height: side, background: `repeating-linear-gradient(0deg,${SOIL} 0 18px,#3a281a 18px 22px)` }} />
      </div>
    </At>
    <div style={{ position: "absolute", left: 1220, top: 300, fontFamily: FONT, fontWeight: 900, fontSize: 150, color: TX }}>{Math.round(13 * g)}M</div>
    <Lbl x={1230} y={470} tt={tt} at={1} txt="HECTARES · first target, 1954" size={44} hand={false} c={false} col={DIM} />
    <div style={{ position: "absolute", left: 1220, top: 560, display: "flex", gap: 18, alignItems: "flex-end", opacity: cl(pop(tt, 3.6)) }}>
      <div style={{ width: 90, height: 90, background: "#c9b48a" }} /><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: TX }}>=</div>
      {[0, 1].map((i) => <div key={i} style={{ width: 57, height: 57, background: "#8fbf7a" }} />)}<div style={{ width: 28, height: 57, background: "#8fbf7a" }} /></div>
    <Lbl x={1230} y={680} tt={tt} at={4.2} txt="1 hectare ≈ 2½ acres → 30+ million acres" size={50} c={false} />
  </>;
}} />;

// m6-7 · la voz baja: el megáfono del Partido contra el globo del científico que se achica
export const HWhisper: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const shrink = eio(tt, 1.6, 4), boom = pop(tt, 2.4, 5, 0.4);
  return <>
    <svg width={520} height={360} style={{ position: "absolute", left: 1200, top: 260, transform: `scale(${0.6 + 0.4 * boom}) rotate(-8deg)` }}><path d="M40 140 L320 30 L320 330 L40 220 Z" fill="#b8401f" /><rect x={0} y={130} width={60} height={100} rx={10} fill="#7a2a14" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${360 + i * 40} ${80 - i * 20} Q${420 + i * 40} 180 ${360 + i * 40} ${280 + i * 20}`} stroke="#ffb340" strokeWidth={10} fill="none" opacity={0.5 + 0.5 * Math.sin(tt * 8 - i)} />)}</svg>
    <Lbl x={1460} y={660} tt={tt} at={2.8} txt="THE PARTY: PLOW IT" size={58} hand={false} col="#ffb340" />
    <div style={{ position: "absolute", left: 300, top: 360, transform: `scale(${1 - 0.72 * shrink})`, transformOrigin: "0 100%", padding: "34px 44px", background: "#f3ead6", borderRadius: 40, boxShadow: shadow, fontFamily: HAND, fontSize: 56, color: INK, width: 560, opacity: cl(pop(tt, 0.3) * 1.5) }}>
      “This much grassland, this fast… is a risk.”<div style={{ position: "absolute", left: 60, bottom: -40, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "50px solid #f3ead6" }} /></div>
    <Lbl x={500} y={760} tt={tt} at={1} txt="the scientists who knew the steppe" size={48} />
  </>;
}} />;

// m7 · los vagones llegan con valijas y acordeones; el contador de jóvenes sube
export const HTrainCars: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const x = 1920 - eio(tt, 0.2, 5) * 2300, n = Math.round(300000 * eio(tt, 0.5, 6));
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 14, background: "#7c8188" }} /><div style={{ position: "absolute", left: 0, right: 0, top: 660, height: 20, background: "repeating-linear-gradient(90deg,#5a3a20 0 30px,transparent 30px 70px)" }} />
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: x + i * 420, top: 430, width: 400, height: 210, borderRadius: 10, background: i === 0 ? "#3a3a3a" : "#4a6a3a", boxShadow: shadow }}>
      {i > 0 && Array.from({ length: 4 }, (_, k) => <div key={k} style={{ position: "absolute", left: 24 + k * 92, top: 30, width: 74, height: 70, background: "#f3e2b0", borderRadius: 4 }}><div style={{ margin: "26px auto 0", width: 30, height: 30, borderRadius: "50%", background: "#3a2a1a" }} /></div>)}
      {i > 0 && <div style={{ position: "absolute", left: 40 + (i * 70) % 200, top: 120, width: 70, height: 50, background: "#8a5a32", borderRadius: 6 }} />}
      {Array.from({ length: 2 }, (_, k) => <div key={k} style={{ position: "absolute", left: 50 + k * 260, bottom: -26, width: 52, height: 52, borderRadius: "50%", background: "#222", border: "6px solid #666" }} />)}</div>)}
    <div style={{ position: "absolute", left: 960, top: 150, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 140, color: TX, textShadow: "0 10px 30px #000" }}>{n.toLocaleString("en-US")}</div>
    <Lbl x={960} y={320} tt={tt} at={2.5} txt="students, factory hands, soldiers · suitcases and accordions" size={50} />
  </>;
}} />;

// m8 · la carpa en la nieve y el termómetro que cae a −40
export const HTentCold: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 1, 5), deg = Math.round(20 - 60 * c);
  return <>
    <div style={{ position: "absolute", left: 200, top: 260, width: 1100, height: 640, borderRadius: 20, overflow: "hidden", boxShadow: shadow, background: `linear-gradient(rgb(${180 - 80 * c},${190 - 70 * c},${200 - 40 * c}),#e8eef2)` }}>
      <svg width={1100} height={640}><path d="M300 520 L550 220 L800 520 Z" fill="#6b6a4a" /><path d="M550 220 L520 520 L580 520 Z" fill="#2a2a1a" /><rect x={0} y={510} width={1100} height={130} fill="#f3f6f8" /></svg>
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: (rnd(i) * 1100 + tt * (40 + i % 7 * 10)) % 1100, top: (rnd(i + 7) * 640 + tt * 90) % 640, width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: c }} />)}
    </div>
    <div style={{ position: "absolute", left: 1460, top: 200, width: 100, height: 660, borderRadius: 50, background: "rgba(255,255,255,.12)", border: "6px solid #d4d8dc" }}>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 40 + 540 * (1 - c * 0.92), borderRadius: 30, background: "linear-gradient(#8fd6ff,#3a7ab0)" }} /></div>
    <div style={{ position: "absolute", left: 1600, top: 420, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#cfeaff" }}>{deg}°</div>
    <Lbl x={1610} y={560} tt={tt} at={4} txt="tents & dugouts" size={52} c={false} />
  </>;
}} />;

// m8-9 · el mapa vacío donde brotan las granjas del estado, cada una con su número
export const HFarmPins: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <At x={960} y={560} rx={48}>
  <div style={{ width: 1500, height: 880, borderRadius: 18, background: "linear-gradient(135deg,#c9bf8a,#a89a62)", boxShadow: shadow, position: "relative" }}>
    {Array.from({ length: 18 }, (_, i) => { const x = 120 + rnd(i + 2) * 1260, y = 100 + rnd(i + 30) * 680, s = pop(tt, 0.5 + i * 0.25, 8, 0.4); return s > 0.01 && <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
      <div style={{ padding: "6px 14px", background: "#b8401f", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 28, borderRadius: 6, whiteSpace: "nowrap" }}>Nº {i + 1}</div>
      <div style={{ width: 4, height: 50, background: "#3a2a1a", margin: "0 auto" }} /><div style={{ width: 120, height: 60, margin: "-30px 0 0 -40px", background: `repeating-linear-gradient(0deg,${SOIL} 0 8px,#4a321e 8px 10px)`, opacity: 0.8, transform: "skewX(-30deg)" }} /></div>; })}
    <Lbl x={750} y={780} tt={tt} at={4.5} txt="state farms on empty ground · names, numbers, wheat targets" size={50} col={INK} />
  </div>
</At>} />;

// m9 · el almanaque de pared: 1954 → 1955 → 1956, las hojas se arrancan y vuelan
export const HTearCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [["1954", "THEY PLOW", "#3a281a"], ["1955", "DROUGHT · POOR CROP", "#8a5a32"], ["1956", "THE MIRACLE", "#b8901f"]] as const;
  const tear = [bt(h, 1, 3), bt(h, 2, 6), 99];
  return <At x={960} y={540}>
    <div style={{ width: 760, height: 860, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 80, background: "#2a2a2a", borderRadius: "12px 12px 0 0" }} />
      {P.map(([y, l, c], i) => { const k = 2 - i, tr = eio(tt, tear[k], tear[k] + 0.9); const [yy, ll, cc] = P[k]; return <div key={k} style={{ position: "absolute", left: 20, right: 20, top: 80, height: 760, background: PAPER, boxShadow: "0 20px 40px rgba(0,0,0,.4)", transformOrigin: "50% 0", transform: `translate(${tr * 900}px,${tr * -200}px) rotate(${tr * 50}deg)`, opacity: 1 - tr, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 210, color: cc }}>{yy}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK, marginTop: 10 }}>{ll}</div></div>; })}
    </div>
  </At>;
}} />;

// m10 · las montañas de grano en el suelo: llueve y la base se pudre
export const HGrainRot: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = pop(tt, 0.2, 4, 0.6), rain = eio(tt, bt(h, 0, 3), bt(h, 0, 3) + 1), rot = eio(tt, bt(h, 0, 3) + 1, bt(h, 0, 3) + 5);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={WHEAT} /><stop offset={1 - 0.6 * rot} stopColor="#c9a050" /><stop offset={Math.min(1, 1.02 - 0.6 * rot)} stopColor="#4a4a2a" /><stop offset="1" stopColor="#2a2a1a" /></linearGradient></defs>
      <rect x={0} y={860} width={1920} height={220} fill="#4a3a28" />
      {[[560, 440], [1060, 520], [1500, 380]].map(([x, w], i) => <path key={i} d={`M${x - w / 2} 862 Q${x} ${862 - 560 * g * (1 - 0.15 * i)} ${x + w / 2} 862 Z`} fill="url(#gr)" />)}
    </svg>
    {Array.from({ length: 80 }, (_, i) => { const ph = (tt * 1.4 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: rnd(i + 5) * 1920, top: ph * 900, width: 3, height: 40, background: "rgba(200,220,240,.5)", opacity: rain }} />; })}
    <Lbl x={960} y={120} tt={tt} at={1.4} txt="not enough barns · not enough trucks" size={60} />
    <Lbl x={960} y={950} tt={tt} at={(bt(h, 0, 3) as number) + 2} txt="wet → hot → sprouted → rotten" size={58} col="#ffb07a" />
  </>;
}} />;

// m10-11 · la pesa de un pud (36 libras) que se multiplica por mil millones
export const HPoodWeight: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.35), zoom = eio(tt, 2.6, 5);
  return <>
    <At x={760 - 260 * zoom} y={560} s={1 - 0.45 * zoom}>
      <svg width={420} height={460} viewBox="0 0 420 460" style={{ transform: `translateY(${(1 - s) * -600}px)` }}><path d="M150 60 Q210 -10 270 60" stroke="#555" strokeWidth={24} fill="none" />
        <path d="M80 100 L340 100 L390 440 L30 440 Z" fill="#3a3c40" /><path d="M80 100 L340 100 L360 160 L60 160 Z" fill="#5a5d62" />
        <text x={210} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#c9cdd2">1 POOD</text></svg>
    </At>
    <Lbl x={760 - 260 * zoom} y={840} tt={tt} at={1.2} txt="≈ 36 lb" size={64} />
    <div style={{ position: "absolute", left: 1000, top: 360, opacity: cl(zoom * 2), fontFamily: FONT, fontWeight: 900, color: TX }}>
      <div style={{ fontSize: 120 }}>× 1,000,000,000</div><div style={{ fontSize: 70, color: AMB, marginTop: 10 }}>= 16+ million tons</div>
      <div style={{ fontFamily: HAND, fontWeight: 400, fontSize: 52, marginTop: 14 }}>Kazakhstan alone · 1956</div></div>
  </>;
}} />;

// m11 · la moneda al aire: de un lado LLUVIA, del otro SEQUÍA; ese año cayó lluvia
export const HCoinRain: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fl = eio(tt, 0.4, 3.2), y = 560 - Math.sin(fl * Math.PI) * 360, ang = fl * 360 * 5;
  const face = Math.cos(ang / 57.3) > 0;
  return <>
    <div style={{ position: "absolute", left: 960 - 200, top: y - 200, width: 400, height: 400, borderRadius: "50%", transform: `scaleY(${Math.abs(Math.cos(ang / 57.3))})`, background: face ? "radial-gradient(#e8d08a,#a8843a)" : "radial-gradient(#c9a26a,#7a5a2a)", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#3a2a10", border: "14px solid #8a6a2a" }}>{face ? "RAIN" : "DROUGHT"}</div>
    <Lbl x={960} y={860} tt={tt} at={3.4} txt="the record year was mostly luck" size={64} />
    <Lbl x={960} y={940} tt={tt} at={4.4} txt="+ fresh soil, a hundred years of stored fertility" size={48} col={AMB} />
  </>;
}} />;

// m12 · el arado de vertedera en corte: la cuchilla curva da vuelta la tierra, entierra lo verde y deja suelo pelado arriba
export const HMoldboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.6, 7);
  const bx = 160 + p * 1600;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={560} width={1920} height={520} fill="#3a281a" />
      {Array.from({ length: 70 }, (_, i) => { const x = 20 + i * 27, done = x < bx - 60; return done ? <path key={i} d={`M${x} 560 Q${x + 13} 528 ${x + 26} 560`} fill="#4a321e" stroke="#2a1c12" strokeWidth={2} /> : <path key={i} d={`M${x} 560 L${x + 6} ${520 - (i % 3) * 10} M${x + 10} 560 L${x + 16} ${528 - (i % 2) * 12}`} stroke={GRASS} strokeWidth={5} />; })}
      {bx > 300 && Array.from({ length: Math.floor((bx - 260) / 60) }, (_, i) => <path key={i} d={`M${200 + i * 60} 600 l20 30 M${210 + i * 60} 600 l6 34`} stroke="#6a7a3a" strokeWidth={4} opacity={0.6} />)}
      <g transform={`translate(${bx} 520)`}><path d="M-40 40 Q40 -40 120 -10 L100 10 Q40 -10 -10 60 Z" fill="#9aa1aa" stroke="#555" strokeWidth={4} /><rect x={-10} y={-200} width={16} height={200} fill="#5a3a20" transform="rotate(-25)" /></g>
      <path d={`M${bx + 80} 520 q40 -50 90 -10`} fill="#3a281a" opacity={0.9} />
    </svg>
    <Lbl x={960} y={200} tt={tt} at={1.2} txt="the moldboard flips the soil — green goes under" size={58} />
    <Lbl x={960} y={290} tt={tt} at={3.5} txt="on a dry, windy steppe: you took off the land's coat" size={52} col={AMB} />
  </>;
}} />;

// m12-13 · trigo, trigo, trigo: el mismo sello de espiga golpea año tras año la misma parcela
export const HWheatRepeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  {Array.from({ length: 8 }, (_, i) => { const s = pop(tt, 0.3 + i * 0.55, 9, 0.35); return <div key={i} style={{ position: "absolute", left: 200 + (i % 4) * 400, top: 220 + Math.floor(i / 4) * 330, width: 340, height: 280, background: PAPER, boxShadow: "0 20px 40px rgba(0,0,0,.45)", opacity: cl(pop(tt, 0.1 + i * 0.55) * 2) }}>
    <div style={{ position: "absolute", left: 20, top: 14, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#7a6a4a" }}>{1955 + i}</div>
    {s > 0.01 && <svg width={160} height={200} viewBox="0 0 160 200" style={{ position: "absolute", left: 90, top: 50, transform: `scale(${2 - s})`, opacity: cl(s * 1.5) }}><line x1={80} y1={200} x2={80} y2={30} stroke="#b07a2a" strokeWidth={6} />
      {Array.from({ length: 6 }, (_, k) => <g key={k}><ellipse cx={62} cy={50 + k * 22} rx={14} ry={9} fill="#c9902a" transform={`rotate(-30 62 ${50 + k * 22})`} /><ellipse cx={98} cy={50 + k * 22} rx={14} ry={9} fill="#c9902a" transform={`rotate(30 98 ${50 + k * 22})`} /></g>)}</svg>}
  </div>; })}
  <Lbl x={960} y={900} tt={tt} at={4.8} txt="one crop · same ground · no rest" size={64} />
</>} />;

// m13 · barbecho negro: una cortina recoge el pasto y deja la tierra suelta; pasa el viento
export const HBareFallow: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 0.6, 3), w = eio(tt, 3.4, 7);
  return <At x={960} y={580} rx={58}>
    <div style={{ width: 1500, height: 820, position: "relative", boxShadow: shadow, background: `repeating-linear-gradient(90deg,#4a321e 0 26px,#3a281a 26px 32px)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 1500 * c, right: 0, background: `repeating-linear-gradient(90deg,${GRASS} 0 8px,#8f8a48 8px 14px)` }} />
      {Array.from({ length: 30 }, (_, i) => { const x = ((rnd(i) * 1500 + w * 2000 + i * 13) % 1700) - 100; return <div key={i} style={{ position: "absolute", left: x, top: rnd(i + 3) * 800, width: 120 + rnd(i) * 160, height: 4, background: "rgba(255,240,210,.55)", opacity: w > 0 ? 0.8 : 0 }} />; })}
      {Array.from({ length: 50 }, (_, i) => <div key={"d" + i} style={{ position: "absolute", left: (rnd(i + 40) * 1500 + w * 1400 * (0.5 + rnd(i))) % 1500, top: rnd(i + 70) * 800 - w * 200 * rnd(i), width: 8, height: 8, borderRadius: "50%", background: "#8a6a40", opacity: w * c }} />)}
    </div>
    <Lbl x={750} y={-120} tt={tt} at={1.5} txt="BLACK FALLOW · bare, loose, dry on top" size={58} hand={false} />
  </At>;
}} />;

// m14 · 1935: la nube del oeste rueda hasta la cúpula del Capitolio mientras el científico declara
export const HCapitolDust: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const r = eio(tt, 0.5, 5.5);
  return <>
    <div style={{ position: "absolute", left: 160, top: 160, width: 1600, height: 780, borderRadius: 20, overflow: "hidden", boxShadow: shadow, background: `linear-gradient(rgb(${190 - 90 * r},${200 - 110 * r},${210 - 140 * r}),#d8cfb8)` }}>
      <svg width={1600} height={780} style={{ position: "absolute", inset: 0 }}><g transform="translate(980 300)" fill="#efe6d2"><rect x={-260} y={260} width={520} height={220} /><rect x={-140} y={150} width={280} height={120} /><path d="M-130 155 Q0 -40 130 155 Z" /><rect x={-10} y={-60} width={20} height={70} />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-240 + i * 58} y={290} width={22} height={170} fill="#c9bfa6" />)}</g></svg>
      {Array.from({ length: 18 }, (_, i) => { const x = -900 + r * 1500 + rnd(i) * 600, rr = 160 + rnd(i + 2) * 220; return <div key={i} style={{ position: "absolute", left: x - rr, top: 380 - rnd(i + 5) * 380, width: rr * 2, height: rr * 1.5, borderRadius: "50%", background: "radial-gradient(#5a4028,rgba(90,64,40,0))", filter: "blur(18px)", opacity: 0.9 }} />; })}
    </div>
    <Lbl x={960} y={70} tt={tt} at={2} txt="Washington, 1935 · the dust arrives during the hearing" size={56} />
    <Lbl x={960} y={960} tt={tt} at={4.6} txt="that same year: the Soil Conservation Service" size={56} col={AMB} />
  </>;
}} />;

// m15 · el estante de lecciones: cuatro objetos llegan de a uno (árboles, curvas de nivel, rastrojo, pasto)
export const HLessonShelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const at = [0.4, bt(h, 0, 2), bt(h, 1, 3.6), bt(h, 2, 5.2)];
  const item = (i: number, el: React.ReactNode, l: string) => { const s = pop(tt, at[i], 7, 0.45); return <div key={i} style={{ position: "absolute", left: 220 + i * 390, top: 520, transform: `translate(-50%,-100%) translateY(${(1 - s) * -500}px)`, opacity: cl(s * 2), textAlign: "center" }}>{el}
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: TX, marginTop: 14, whiteSpace: "nowrap" }}>{l}</div></div>; };
  return <>
    <div style={{ position: "absolute", left: 60, right: 60, top: 600, height: 40, background: "linear-gradient(#8a5a32,#5a3a20)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 160, top: 0, width: 1600, height: 600 }}>
      {item(0, <svg width={220} height={220}>{[40, 110, 180].map((x, k) => <g key={k}><rect x={x - 6} y={150} width={12} height={70} fill="#5a3a20" /><circle cx={x} cy={110} r={50} fill="#4a7a3a" /></g>)}</svg>, "SHELTERBELTS")}
      {item(1, <svg width={220} height={220}>{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M10 ${60 + k * 34} Q110 ${20 + k * 34} 210 ${70 + k * 34}`} stroke="#c9b48a" strokeWidth={8} fill="none" />)}</svg>, "PLOW ON THE CONTOUR")}
      {item(2, <svg width={220} height={220}>{Array.from({ length: 14 }, (_, k) => <line key={k} x1={15 + k * 14} y1={210} x2={15 + k * 14 + 4} y2={110 + (k % 3) * 18} stroke={WHEAT} strokeWidth={6} />)}</svg>, "LEAVE STUBBLE")}
      {item(3, <svg width={220} height={220}>{Array.from({ length: 30 }, (_, k) => <path key={k} d={`M${10 + k * 7} 210 Q${14 + k * 7} 150 ${6 + k * 7 + 10 * Math.sin(k + tt)} ${100 + (k % 4) * 14}`} stroke="#6a9a3a" strokeWidth={4} fill="none" />)}</svg>, "BACK TO GRASS")}
    </div>
    <Lbl x={960} y={720} tt={tt} at={(at[3] as number) + 1.4} txt="all in print before the first Soviet tractor rolled" size={56} col={AMB} />
  </>;
}} />;

// m16 · la mancha de 40 millones de hectáreas se derrama sobre la silueta de California y la desborda
export const HCaliOverlay: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 1.6, 5);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M700 180 L900 180 L900 420 L1180 700 L1160 880 L1020 900 L960 820 L760 640 L700 460 Z" fill="none" stroke="#f3ead6" strokeWidth={8} strokeDasharray="20 14" opacity={pop(tt, 0.3)} />
      <ellipse cx={940} cy={540} rx={60 + 420 * g} ry={50 + 400 * g} fill="#3a281a" opacity={0.85} />
    </svg>
    <Lbl x={960} y={100} tt={tt} at={0.6} txt="CALIFORNIA" size={50} hand={false} col="#f3ead6" />
    <div style={{ position: "absolute", left: 1500, top: 420, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: TX, opacity: cl(g * 2) }}>~40M<div style={{ fontSize: 40, color: DIM }}>HECTARES PLOWED</div></div>
    <Lbl x={1600} y={680} tt={tt} at={4.6} txt="mostly in a few years" size={54} />
  </>;
}} />;

// m17 · el mismo viento sobre dos suelos: el pasto se peina, la tierra pelada se levanta
export const HWindComb: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const w = eio(tt, 0.8, 2);
  return <>
    {[0, 1].map((side) => <div key={side} style={{ position: "absolute", left: 120 + side * 860, top: 220, width: 820, height: 640, borderRadius: 18, overflow: "hidden", boxShadow: shadow, background: "linear-gradient(#cfd8dc 0 55%," + (side ? "#5a3e26" : "#8f8a48") + " 55%)", transform: `translateY(${(1 - pop(tt, 0.2 + side * 0.5)) * 600}px)` }}>
      {side === 0 ? Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: 10 + i * 13.5, top: 300, width: 4, height: 90 + (i % 4) * 20, background: "#6a7a2a", transformOrigin: "50% 100%", transform: `rotate(${(20 + 10 * Math.sin(tt * 4 + i * 0.3)) * w}deg)`, borderRadius: 2 }} />)
        : Array.from({ length: 70 }, (_, i) => { const ph = (tt * 0.7 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: ph * 900 - 40, top: 360 - ph * 260 * rnd(i + 3) + rnd(i) * 200, width: 10, height: 10, borderRadius: "50%", background: "#8a6a40", opacity: w * Math.sin(ph * Math.PI) }} />; })}
      {Array.from({ length: 8 }, (_, i) => <div key={"w" + i} style={{ position: "absolute", left: ((tt * 500 + i * 130) % 1000) - 160, top: 60 + i * 34, width: 140, height: 3, background: "rgba(255,255,255,.7)", opacity: w }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: "#fff", textShadow: "0 4px 14px #000" }}>{side ? "BARE SOIL: IT LIFTS" : "GRASS: IT COMBS"}</div>
    </div>)}
  </>;
}} />;

// m18 · mediodía y de noche: el reloj marca las 12 y el cielo de la ventana está negro
export const HNoonDark: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = eio(tt, 1, 4.5), hand = eio(tt, 0.2, 2) * 360 * 2;
  return <>
    <div style={{ position: "absolute", left: 260, top: 200, width: 660, height: 680, borderRadius: 12, background: `linear-gradient(rgb(${210 - 180 * d},${200 - 175 * d},${170 - 150 * d}),rgb(${180 - 160 * d},${150 - 130 * d},${110 - 95 * d}))`, border: "28px solid #6b4a2c", boxShadow: shadow }}>
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 20, marginLeft: -10, background: "#6b4a2c" }} /><div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 20, marginTop: -10, background: "#6b4a2c" }} />
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: (rnd(i) * 600 + tt * 160) % 640, top: rnd(i + 4) * 620, width: 160, height: 60, borderRadius: "50%", background: "rgba(60,40,20,.6)", filter: "blur(14px)", opacity: d }} />)}
    </div>
    <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", left: 1120, top: 250 }}><circle r={240} fill="#f3ead6" stroke="#6b4a2c" strokeWidth={18} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-200} x2={0} y2={-176} stroke={INK} strokeWidth={8} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-120} stroke={INK} strokeWidth={14} strokeLinecap="round" transform={`rotate(${hand / 12})`} /><line x1={0} y1={0} x2={0} y2={-180} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${hand})`} /><circle r={14} fill={INK} /></svg>
    <Lbl x={1380} y={820} tt={tt} at={3} txt="12 noon · 1963" size={64} />
  </>;
}} />;

// m18-19 · los barcos de grano que llegan al revés: banderas de Canadá, Australia y EE. UU. entran al puerto soviético
export const HGrainShips: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const SH = [["CANADA", "#c8102e", 0.3], ["AUSTRALIA", "#00247d", bt(h, 0, 2.2)], ["UNITED STATES", "#3c3b6e", bt(h, 1, 4)]] as [string, string, number][];
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "linear-gradient(#2c5d7a,#173548)" }} />
    <div style={{ position: "absolute", right: 0, top: 520, width: 360, height: 140, background: "#5a5d62" }}><div style={{ position: "absolute", left: 30, top: -90, width: 30, height: 90, background: "#7c8188" }} /></div>
    {SH.map(([n, c, d], i) => { const x = -700 + eio(tt, d, d + 4) * (1100 - i * 380); return <div key={i} style={{ position: "absolute", left: x, top: 540 + i * 70 }}>
      <div style={{ width: 560, height: 110, background: "#2a2a2a", clipPath: "polygon(0 0,100% 0,92% 100%,6% 100%)" }} />
      <div style={{ position: "absolute", left: 80, top: -60, width: 360, height: 70, background: WHEAT, borderRadius: "40px 40px 0 0" }} />
      <div style={{ position: "absolute", left: 470, top: -110, width: 6, height: 110, background: "#ddd" }} /><div style={{ position: "absolute", left: 476, top: -110, width: 90, height: 56, background: c, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1 }}>{n}</div></div>; })}
    <Lbl x={960} y={150} tt={tt} at={1} txt="1963 · the breadbasket buys bread from its rivals" size={58} />
  </>;
}} />;

// m19 · la estación de Barayev: parcelas en franjas, rastrojo parado que atrapa la nieve
export const HStripPlots: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const st = eio(tt, bt(h, 0, 2), bt(h, 0, 2) + 1), sp = eio(tt, bt(h, 1, 4), bt(h, 1, 4) + 1), sn = eio(tt, bt(h, 2, 6), bt(h, 2, 6) + 2);
  return <At x={960} y={580} rx={56}>
    <div style={{ width: 1500, height: 880, position: "relative", boxShadow: shadow, background: "#4a321e", overflow: "hidden" }}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 110, height: 110, background: i % 2 ? `repeating-linear-gradient(90deg,${WHEAT} 0 4px,transparent 4px 16px)` : `rgba(106,154,58,${sp})`, opacity: i % 2 ? st : 1 }} />)}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,rgba(255,255,255,${0.85 * sn}) 0%,rgba(255,255,255,${0.6 * sn}) 100%)`, maskImage: "repeating-linear-gradient(0deg,#000 0 110px,transparent 110px 220px)", WebkitMaskImage: "repeating-linear-gradient(0deg,#000 0 110px,transparent 110px 220px)" } as React.CSSProperties} />
    </div>
    <div style={{ position: "absolute", left: 40, top: -150, width: 640, padding: "26px 34px", background: PAPER, boxShadow: shadow, transform: `rotate(-2deg) translateY(${(1 - pop(tt, 0.3)) * -400}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: INK }}>SHORTANDY STATION</div><div style={{ fontFamily: HAND, fontSize: 44, color: "#5a2a2a" }}>A. Barayev: "you're doing it wrong"</div></div>
  </At>;
}} />;

// m20 · la cuchilla plana en corte: pasa por debajo, corta raíces, y el rastrojo queda PARADO arriba
export const HFlatCutter: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const bx = 100 + eio(tt, 0.6, 7) * 1800;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={560} width={1920} height={520} fill="#3a281a" />
      {Array.from({ length: 64 }, (_, i) => { const x = 30 + i * 30, cut = x < bx; return <g key={i}><line x1={x} y1={560} x2={x + 3} y2={470 + (i % 3) * 12} stroke={WHEAT} strokeWidth={6} />
        <path d={`M${x} 562 q${cut ? 0 : 6} 40 ${cut ? -4 : 2} ${cut ? 24 : 80}`} stroke="#c9b48a" strokeWidth={3} fill="none" /></g>; })}
      <g transform={`translate(${bx} 610)`}><path d="M-160 0 L80 0 L60 14 L-140 14 Z" fill="#c9cdd2" stroke="#555" strokeWidth={3} /><rect x={-20} y={-160} width={18} height={160} fill="#5a3a20" /></g>
    </svg>
    <Lbl x={960} y={200} tt={tt} at={1.2} txt="FLAT-CUTTER: cuts the roots, leaves the soil on top" size={56} hand={false} />
    <Lbl x={960} y={290} tt={tt} at={3.4} txt="the plow that doesn't turn the ground over" size={56} col={AMB} />
  </>;
}} />;

// m20-21 · Canadá, años 30: el plano de Charles Noble se despliega con la cuchilla ancha
export const HNobleBlade: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 0.3, 1.8), d = eio(tt, 1.6, 4.5);
  return <At x={960} y={560} rx={30}>
    <div style={{ width: 1400 * u + 60, height: 820, overflow: "hidden", background: "#1f4a7a", boxShadow: shadow, position: "relative", borderRadius: 8, backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0 1px,transparent 1px 40px)" }}>
      <svg width={1400} height={820} style={{ position: "absolute", inset: 0 }}>
        <path d="M200 520 L700 400 L1200 520" stroke="#e8f0f8" strokeWidth={6} fill="none" strokeDasharray={1400} strokeDashoffset={1400 * (1 - d)} />
        <path d="M200 520 L1200 520" stroke="#e8f0f8" strokeWidth={4} fill="none" strokeDasharray="10 10" opacity={d} />
        {[300, 700, 1100].map((x, i) => <path key={i} d={`M${x} 400 L${x} 300`} stroke="#e8f0f8" strokeWidth={4} opacity={cl(d * 3 - i)} />)}
        <text x={700} y={620} textAnchor="middle" fontFamily={HAND} fontSize={56} fill="#e8f0f8" opacity={d}>wide blade · 6 ft · trash stays on top</text>
      </svg>
      <div style={{ position: "absolute", right: 40, bottom: 30, border: "3px solid #e8f0f8", padding: "14px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#e8f0f8", letterSpacing: 2, opacity: cl(pop(tt, 3.5)) }}>C. NOBLE · ALBERTA · 1930s</div>
    </div>
  </At>;
}} />;

// m21 · la tribuna vacía: no hay desfile para el campo que no se voló
export const HEmptyStand: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const b = eio(tt, 1.5, 7);
  return <>
    <div style={{ position: "absolute", left: 360, top: 360, width: 1200, height: 380, background: "linear-gradient(#b8401f,#7a2a14)", boxShadow: shadow, clipPath: "polygon(0 30%,100% 30%,100% 100%,0 100%)" }} />
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 380 + i * 240, top: 470, width: 200, height: 26, background: "#5a2a14" }} />)}
    <div style={{ position: "absolute", left: 900, top: 470 - b * 420, width: 70, height: 86, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#c23a1a)", transform: `rotate(${6 * Math.sin(tt * 1.5)}deg)` }} />
    <svg width={40} height={460} style={{ position: "absolute", left: 915, top: 556 - b * 420 }}><path d={`M20 0 Q${20 + 10 * Math.sin(tt * 3)} 60 20 120`} stroke="#ddd" strokeWidth={2} fill="none" /></svg>
    <Lbl x={960} y={820} tt={tt} at={2} txt="no parades for a field that didn't blow away" size={62} />
  </>;
}} />;

// m22 · la placa del escritorio que se desliza y cae: 1964
export const HDeskPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sl = eio(tt, 1.2, 2.6), fall = eIn(tt, 2.6, 3.4);
  return <>
    <div style={{ position: "absolute", left: 160, top: 620, width: 1100, height: 60, background: "linear-gradient(#6b4226,#4a2c16)", boxShadow: shadow }} />
    <div style={{ position: "absolute", left: 420 + sl * 760, top: 540 + fall * 520, width: 460, height: 90, transform: `rotate(${fall * 70}deg)`, transformOrigin: "0 100%", background: "linear-gradient(#d9b46a,#a8843a)", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#2a1a08", letterSpacing: 3 }}>N. S. KHRUSHCHEV</div>
    <Stamp tt={tt} at={3.4} txt="OCTOBER 1964" x={1450} y={400} r={8} size={70} />
    <Lbl x={1450} y={540} tt={tt} at={4.4} txt="farm failures were one reason" size={52} />
  </>;
}} />;

// m22-23 · el anemómetro de la erosión: la aguja baja de ROJO a VERDE año a año
export const HErosionNeedle: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const a = 70 - 140 * eio(tt, 1.2, 5) + 3 * Math.sin(tt * 6) * (1 - eio(tt, 4, 6)), yr = 1965 + Math.round(5 * eio(tt, 1.2, 5));
  return <>
    <svg width={900} height={560} viewBox="-450 -470 900 560" style={{ position: "absolute", left: 510, top: 200 }}>
      <path d="M-380 0 A380 380 0 0 1 380 0" fill="none" stroke="#6fe39a" strokeWidth={60} strokeDasharray="400 2000" />
      <path d="M-380 0 A380 380 0 0 1 380 0" fill="none" stroke="#ffd27a" strokeWidth={60} strokeDasharray="0 400 400 2000" />
      <path d="M-380 0 A380 380 0 0 1 380 0" fill="none" stroke="#ff5a4a" strokeWidth={60} strokeDasharray="0 800 400 2000" />
      <line x1={0} y1={0} x2={0} y2={-340} stroke="#f3ead6" strokeWidth={14} strokeLinecap="round" transform={`rotate(${a})`} /><circle r={30} fill="#f3ead6" />
    </svg>
    <div style={{ position: "absolute", left: 960, top: 820, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: TX }}>WIND EROSION · {yr}</div>
    <Lbl x={960} y={920} tt={tt} at={4.6} txt="the troublemaker becomes the honored scientist" size={52} col={AMB} />
  </>;
}} />;

// m23 · ¿quién pagó?: cuatro sobres con la factura, cada uno a su destinatario
export const HBillEnvelopes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const E = [["THE LAND", "soil of thousands of years", 0.3], ["THE YOUNG", "tents, mud, a dream blown away", bt(h, 0, 2.5)], ["THE HERDERS", "pastures plowed under", bt(h, 1, 4.5)], ["THE COUNTRY", "bread from rivals' wheat", bt(h, 2, 6.5)]] as [string, string, number][];
  return <>{E.map(([to, why, d], i) => { const s = pop(tt, d, 6, 0.5), op = eio(tt, d + 0.7, d + 1.5); return s > 0.01 && <div key={i} style={{ position: "absolute", left: 140 + i * 420, top: 330 + (i % 2) * 50, transform: `translateY(${(1 - s) * 700}px) rotate(${-4 + i * 3}deg)` }}>
    <div style={{ width: 380, height: 260, background: "linear-gradient(#e9dcc0,#d5c4a0)", boxShadow: shadow, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 380, height: 150, background: "#cdb994", clipPath: "polygon(0 0,100% 0,50% 100%)", transformOrigin: "50% 0", transform: `rotateX(${op * 180}deg)` }} />
      <div style={{ position: "absolute", left: 30, top: -150 * op, width: 320, height: 180, background: "#fffaf0", opacity: op, padding: 18, fontFamily: HAND, fontSize: 34, color: "#5a2a2a", zIndex: -1 }}>{why}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK }}>TO: {to}</div></div></div>; })}
    <Lbl x={960} y={860} tt={tt} at={1} txt="the bill came anyway" size={60} /></>;
}} />;

// m25 · el surco de los años: el arado avanza y deja al descubierto los años enterrados en la tierra
export const HFurrowYears: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [["1953", "Khrushchev · no food", 0.3], ["1954", "plan · youth · plows", bt(h, 0, 2)], ["1955", "first dry year", bt(h, 1, 3.5)], ["1956", "miracle harvest", bt(h, 2, 5)], ["late 50s", "~40M ha, dust", bt(h, 3, 7)],
    ["1962–63", "black storms", bt(h, 4, 9)], ["1963", "buys grain abroad", bt(h, 5, 11)], ["1964", "Khrushchev out", bt(h, 6, 13)], ["late 60s", "flat-cutters · wind slows", bt(h, 7, 15)]] as [string, string, number][];
  const n = Y.filter(([, , d]) => tt > d).length, px = 140 + Math.min(n, 9) * 196;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 520, height: 300, background: `repeating-linear-gradient(90deg,${GRASS} 0 10px,#8f8a48 10px 16px)` }} />
    <div style={{ position: "absolute", left: 0, top: 560, width: px, height: 220, background: `repeating-linear-gradient(0deg,${SOIL} 0 14px,#3a281a 14px 18px)`, transition: "none" }} />
    <Tractor x={px + 80} y={640} s={1} tt={tt} />
    {Y.map(([y, d, at], i) => { const s = pop(tt, at, 7, 0.45); return s > 0.01 && <div key={i} style={{ position: "absolute", left: 140 + i * 196 + 98, top: 600, transform: `translate(-50%,0) translateY(${(1 - s) * 80}px)`, opacity: cl(s * 2), textAlign: "center", width: 190 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: i === 8 ? "#9fe39a" : i >= 5 && i <= 6 ? "#ff8a7a" : TX }}>{y}</div><div style={{ fontFamily: HAND, fontSize: 30, color: AMB, lineHeight: 1 }}>{d}</div></div>; })}
  </>;
}} />;

// m26 · la bolsa de correo: se sacan las preguntas de a una, con su respuesta escrita debajo
export const HMailbag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q = [["As bad as the Dust Bowl?", "Some years, yes — and bigger."], ["Did people die?", "No solid numbers. I won't invent any."], ["Is the land still damaged?", "Parts of it. Some went back to grass."]];
  return <>
    <svg width={520} height={520} style={{ position: "absolute", left: 120, top: 420 }}><path d="M60 120 Q260 40 460 120 L500 500 L20 500 Z" fill="#8a6a40" stroke="#5a3a20" strokeWidth={6} /><text x={260} y={360} textAnchor="middle" fontFamily={MARK} fontSize={70} fill="#e8d3a0">MAIL</text></svg>
    {Q.map(([q, a], i) => { const at = 0.6 + i * 3, s = eio(tt, at, at + 0.9), ans = pop(tt, at + 1.4); return <div key={i} style={{ position: "absolute", left: 380 + s * (520 + i * 40), top: 520 - s * (330 - i * 170), width: 700, padding: "22px 30px", background: "#fbf7ec", boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `rotate(${(1 - s) * -30 + (i - 1) * 2}deg)`, opacity: cl(s * 3) }}>
      <div style={{ fontFamily: HAND, fontSize: 48, color: "#22314f" }}>{q}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: INK, opacity: cl(ans * 1.5), marginTop: 6 }}>{a}</div></div>; })}
  </>;
}} />;

// m27 · el pizarrón de la cuota: el que ara menos recibe el reto, el que ara más recibe la medalla
export const HQuotaBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const r = [["Farm Nº 7", 62, "REPRIMAND"], ["Farm Nº 12", 100, ""], ["Farm Nº 31", 138, "MEDAL"]] as [string, number, string][];
  return <At x={960} y={540} rx={10}>
    <div style={{ width: 1400, height: 760, background: "radial-gradient(ellipse at 40% 30%,#2f4a3a,#1c2e24)", border: "24px solid #6b4a2c", boxShadow: shadow, position: "relative", padding: "50px 70px" }}>
      <div style={{ fontFamily: HAND, fontSize: 70, color: "#f3f0e6" }}>Hectare plan, 1960</div>
      {r.map(([n, v, aw], i) => { const g = eio(tt, 0.6 + i * 0.6, 2.2 + i * 0.6); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 44 }}>
        <div style={{ width: 260, fontFamily: HAND, fontSize: 52, color: "#f3f0e6" }}>{n}</div>
        <div style={{ height: 50, width: 6 * v * g, background: v < 100 ? "#ff8a7a" : v > 100 ? "#ffd27a" : "#f3f0e6", borderRadius: 4 }} />
        <div style={{ fontFamily: HAND, fontSize: 50, color: "#f3f0e6" }}>{Math.round(v * g)}%</div>
        {aw && <div style={{ marginLeft: 20, fontFamily: MARK, fontSize: 54, color: v < 100 ? "#ff8a7a" : "#ffd27a", transform: `scale(${pop(tt, 3.6 + i * 0.3, 9, 0.35)})` }}>{aw}</div>}</div>; })}
      <div style={{ position: "absolute", left: 70, bottom: 40, fontFamily: HAND, fontSize: 52, color: "#f3f0e6", opacity: cl(pop(tt, 5)) }}>pay for plowing, and they plow — even as the soil leaves</div>
    </div>
  </At>;
}} />;

// m28 · el frasco del repaso: cada capa de tierra que cae es un paso de la historia
export const HSoilJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [["hunger", "#6b5a40"], ["300,000 young people", "#8a6a40"], ["40M ha plowed", "#3a281a"], ["one lucky harvest", WHEAT], ["bare soil, one crop", "#5a3e26"], ["black storms · 1963", "#2a1c12"], ["grain bought abroad", "#a89a62"], ["Barayev's flat-cutter", "#6a9a3a"]];
  return <>
    <div style={{ position: "absolute", left: 560, top: 140, width: 420, height: 800, borderRadius: "40px 40px 60px 60px", border: "10px solid rgba(220,235,240,.6)", background: "rgba(220,235,240,.1)", overflow: "hidden", boxShadow: shadow }}>
      {L.map(([, c], i) => { const s = eio(tt, 0.4 + i * 1.2, 1.2 + i * 1.2); return <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: i * 92 + (1 - s) * 700, height: 92, background: c, opacity: s, borderTop: "3px solid rgba(0,0,0,.2)" }} />; })}
    </div>
    {L.map(([n], i) => <Lbl key={i} x={1040} y={840 - i * 92 - 30} tt={tt} at={0.9 + i * 1.2} txt={n} size={44} c={false} />)}
  </>;
}} />;

// m29 · la frase final: una mano tapa la tierra con una manta de rastrojo y el viento ya no levanta nada
export const HCoverSoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 0.8, 3.4);
  return <>
    <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 520, background: "#4a321e", boxShadow: shadow, overflow: "hidden" }}>
      {Array.from({ length: 50 }, (_, i) => { const ph = (tt * 0.8 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 1600 * c + ph * 1200, top: 400 - ph * 300 * rnd(i + 2), width: 8, height: 8, borderRadius: "50%", background: "#8a6a40", opacity: (1 - c) * Math.sin(ph * Math.PI) }} />; })}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1600 * c, background: `repeating-linear-gradient(80deg,${WHEAT} 0 5px,#b8944a 5px 9px,transparent 9px 14px),#7a5a32` }} />
    </div>
    <Lbl x={960} y={120} tt={tt} at={1} txt="soil doesn't care how big your plan is" size={62} />
    <Lbl x={960} y={880} tt={tt} at={3.6} txt="only whether something's holding it down" size={62} col={AMB} />
  </>;
}} />;

export const HCB: Record<string, React.FC<{ t: number; h: H }>> = {
  tractorLine: HTractorLine, blackSky: HBlackSky, dustEcho: HDustEcho, breadLine: HBreadLine, soilCore: HSoilCore, herdLoop: HHerdLoop, candles: HCandles,
  hectareGrow: HHectareGrow, whisper: HWhisper, trainCars: HTrainCars, tentCold: HTentCold, farmPins: HFarmPins, tearCalendar: HTearCalendar, grainRot: HGrainRot,
  poodWeight: HPoodWeight, coinRain: HCoinRain, moldboard: HMoldboard, wheatRepeat: HWheatRepeat, bareFallow: HBareFallow, capitolDust: HCapitolDust,
  lessonShelf: HLessonShelf, caliOverlay: HCaliOverlay, windComb: HWindComb, noonDark: HNoonDark, grainShips: HGrainShips, stripPlots: HStripPlots,
  flatCutter: HFlatCutter, nobleBlade: HNobleBlade, emptyStand: HEmptyStand, deskPlate: HDeskPlate, erosionNeedle: HErosionNeedle, billEnvelopes: HBillEnvelopes,
  furrowYears: HFurrowYears, mailbag: HMailbag, quotaBoard: HQuotaBoard, soilJar: HSoilJar, coverSoil: HCoverSoil,
};
