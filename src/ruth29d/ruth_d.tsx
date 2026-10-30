// ruth29d «Nutria» · componentes únicos (uno por minuto), ninguno repite mecanismo de ruth29a/b/c.
// Marisma, pieles, canales y río: cada pieza es un objeto o un corte de agua que cuenta lo que se dice en ese segundo.
import React from "react";
import { H, cl, eio, eIn, TX, DIM, AMB, RED, GRN, MARK, HAND } from "./hkit";
import { FONT } from "./lib";
import { pop, At, Stamp, PAPER, MANILA, INK } from "./ruth_a";
import { S, bt, shadow, rnd, Lbl } from "./ruth_b";

const WATER = "#2c5d6a", MARSH = "#8f9a4a", MUD = "#5a4430", FUR = "#7a5236";
// nutria de perfil: cuerpo largo, cola de rata, dientes naranjas
const Nutria: React.FC<{ x: number; y: number; s?: number; tt?: number; flip?: boolean; o?: number }> = ({ x, y, s = 1, tt = 0, flip, o = 1 }) => <svg width={260} height={130} viewBox="-130 -70 260 130" style={{ position: "absolute", left: x - 130, top: y - 65, transform: `scale(${flip ? -s : s},${s})`, opacity: o, overflow: "visible" }}>
  <path d={`M-70 20 Q-120 ${30 + 6 * Math.sin(tt * 4)} -130 ${50 + 4 * Math.sin(tt * 4)}`} stroke="#5a4a3a" strokeWidth={9} fill="none" strokeLinecap="round" />
  <ellipse cx={-10} cy={6} rx={78} ry={42} fill={FUR} /><ellipse cx={-20} cy={-10} rx={50} ry={16} fill="rgba(255,255,255,.08)" />
  <ellipse cx={70} cy={-6} rx={34} ry={26} fill={FUR} /><circle cx={78} cy={-16} r={5} fill="#111" /><circle cx={56} cy={-30} r={9} fill="#5a3a26" />
  <rect x={96} y={2} width={6} height={13} rx={2} fill="#ff8a1a" /><rect x={103} y={2} width={6} height={13} rx={2} fill="#ff8a1a" />
  {[-50, 30].map((lx, i) => <rect key={i} x={lx} y={38} width={16} height={18 + 4 * Math.sin(tt * 8 + i)} rx={6} fill="#5a3a26" />)}
  {[104, 104, 104].map((wx, i) => <line key={i} x1={wx} y1={-4 + i * 5} x2={wx + 26} y2={-10 + i * 8} stroke="#ddd" strokeWidth={1.5} />)}
</svg>;
const Water: React.FC<{ tt: number; top?: number; col?: string }> = ({ tt, top = 600, col = WATER }) => <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0, background: `linear-gradient(${col},#173a44)` }}>
  {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((rnd(i) * 1920 + tt * 30) % 2000) - 80, top: 20 + rnd(i + 3) * 400, width: 120 + rnd(i) * 120, height: 3, background: "rgba(255,255,255,.18)" }} />)}</div>;
const Grass: React.FC<{ x: number; y: number; w: number; tt: number; o?: number; n?: number }> = ({ x, y, w, tt, o = 1, n = 20 }) => <svg width={w} height={140} style={{ position: "absolute", left: x, top: y - 140, opacity: o, overflow: "visible" }}>
  {Array.from({ length: n }, (_, i) => { const bx = (i + 0.5) * w / n; return <path key={i} d={`M${bx} 140 Q${bx + 4} 70 ${bx + 10 * Math.sin(tt * 1.5 + i)} ${20 + (i % 4) * 14}`} stroke={i % 3 ? MARSH : "#a8b05a"} strokeWidth={5} fill="none" />; })}</svg>;

// m0 · la línea de trampas al amanecer: el bote avanza por el canal y cada trampa tiene una nutria
export const HTrapLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const bx = -300 + eio(tt, 0.3, 9) * 1900;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#f2b27a 0%,#c8806a 30%,#6a5a6a 52%)" }} />
    <div style={{ position: "absolute", left: 1300, top: 380, width: 160, height: 160, borderRadius: "50%", background: "#ffd8a0", opacity: 0.9 }} />
    <Grass x={0} y={560} w={1920} tt={tt} n={60} /><Water tt={tt} top={560} col="#4a6a74" />
    {Array.from({ length: 6 }, (_, i) => { const x = 200 + i * 300, seen = bx > x - 200; return <div key={i}><div style={{ position: "absolute", left: x, top: 470, width: 8, height: 120, background: "#5a3a20" }} />
      <div style={{ position: "absolute", left: x - 40, top: 540, width: 90, height: 50, border: "4px solid #777", borderRadius: 6 }} />{seen && <Nutria x={x + 4} y={565} s={0.42} tt={tt} o={cl((bx - x + 200) / 100)} />}</div>; })}
    <div style={{ position: "absolute", left: bx, top: 590, width: 300, height: 50, background: "#4a3a2a", clipPath: "polygon(0 0,100% 0,90% 100%,4% 100%)" }} />
    <svg width={120} height={260} style={{ position: "absolute", left: bx + 120, top: 360 }}><circle cx={60} cy={40} r={26} fill="#2a2420" /><path d="M30 240 L40 70 Q60 56 80 70 L90 240 Z" fill="#3a3430" /><line x1={90} y1={80} x2={160} y2={260} stroke="#5a3a20" strokeWidth={6} /></svg>
    <Lbl x={960} y={110} tt={tt} at={1} txt="Louisiana marsh · winter 1976" size={60} />
  </>;
}} />;

// m0-1 · la tabla de secado con la piel y la etiqueta del comprador: 1,8 millones · $15M
export const HPeltBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const n = 1.8 * eio(tt, 0.6, 4), m = 15 * eio(tt, 1.6, 5);
  return <>
    <div style={{ position: "absolute", left: 420, top: 160, transform: `rotate(-6deg) translateY(${(1 - pop(tt, 0.2, 6, 0.5)) * -700}px)` }}>
      <div style={{ width: 320, height: 760, background: "linear-gradient(90deg,#c9a46a,#e8cf94,#c9a46a)", clipPath: "polygon(30% 0,70% 0,100% 18%,100% 100%,0 100%,0 18%)", boxShadow: shadow }} />
      <div style={{ position: "absolute", left: 40, top: 70, width: 240, height: 600, background: `repeating-linear-gradient(0deg,${FUR} 0 6px,#8a6244 6px 9px)`, clipPath: "polygon(35% 0,65% 0,95% 20%,90% 100%,10% 100%,5% 20%)" }} /></div>
    <div style={{ position: "absolute", left: 640, top: 520, width: 260, height: 140, background: MANILA, transform: `rotate(10deg) scale(${pop(tt, 1.2)})`, boxShadow: "0 14px 24px rgba(0,0,0,.5)", padding: 16, fontFamily: HAND, fontSize: 34, color: INK }}>fur buyer · prime pelt</div>
    <div style={{ position: "absolute", left: 1100, top: 300, fontFamily: FONT, fontWeight: 900, color: TX }}>
      <div style={{ fontSize: 130 }}>{n.toFixed(1)}M</div><div style={{ fontSize: 44, color: DIM }}>NUTRIA · ONE SEASON</div>
      <div style={{ fontSize: 130, color: AMB, marginTop: 30 }}>${Math.round(m)}M+</div><div style={{ fontSize: 44, color: DIM }}>TO THE PEOPLE OF THE COAST</div></div>
  </>;
}} />;

// m1 · la marisma se rompe: un césped entero se perfora en agua abierta, del tamaño de canchas de fútbol
export const HMarshHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 0.6, 6);
  return <At x={960} y={560} rx={50}>
    <div style={{ width: 1500, height: 860, position: "relative", background: `repeating-linear-gradient(80deg,${MARSH} 0 8px,#7f8a3a 8px 16px)`, boxShadow: shadow, overflow: "hidden" }}>
      {Array.from({ length: 12 }, (_, i) => { const r = (40 + rnd(i) * 160) * cl(g * 1.6 - rnd(i + 2) * 0.6); return <div key={i} style={{ position: "absolute", left: 100 + rnd(i + 5) * 1300 - r, top: 80 + rnd(i + 9) * 700 - r * 0.7, width: r * 2, height: r * 1.4, borderRadius: "46% 54% 50% 50%", background: WATER, boxShadow: "inset 0 0 20px rgba(0,0,0,.4)" }} />; })}
      <div style={{ position: "absolute", left: 1080, top: 640, width: 330, height: 180, border: "4px dashed #fff", opacity: cl(pop(tt, 3.6)) }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "#fff", padding: 10 }}>1 FOOTBALL FIELD</div></div>
    </div>
    <Lbl x={750} y={-110} tt={tt} at={1} txt="30 years later · grass turned to open water" size={56} />
  </At>;
}} />;

// m1-2 · la cola con etiqueta: «$ por cola» cuelga de un hilo y la cuenta sube
export const HTailTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sw = Math.sin(tt * 1.8) * 8 * (1 - eio(tt, 0, 4) * 0.6);
  return <>
    <svg width={200} height={900} viewBox="0 0 200 900" style={{ position: "absolute", left: 620, top: -60, transformOrigin: "100px 0", transform: `rotate(${sw}deg)` }}><line x1={100} y1={0} x2={100} y2={300} stroke="#ddd" strokeWidth={3} />
      <path d="M100 300 Q120 500 90 700 Q80 800 100 880" stroke="#4a3a2e" strokeWidth={26} fill="none" strokeLinecap="round" />{Array.from({ length: 16 }, (_, i) => <line key={i} x1={86} y1={320 + i * 34} x2={114} y2={326 + i * 34} stroke="#2a1e16" strokeWidth={3} />)}</svg>
    <div style={{ position: "absolute", left: 770, top: 260, width: 300, height: 160, background: MANILA, boxShadow: shadow, transform: `rotate(${sw * 1.5 + 6}deg) scale(${pop(tt, 0.8)})`, transformOrigin: "0 50%", padding: "20px 26px" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: INK }}>$ / TAIL</div><div style={{ fontFamily: HAND, fontSize: 34, color: INK }}>paid by the state</div></div>
    <Lbl x={1450} y={560} tt={tt} at={2.6} txt="just to slow the damage down" size={58} />
  </>;
}} />;

// m2 · el pastel de las causas: la nutria es una tajada; el resto queda tapado con un paño hasta el final
export const HPieSlice: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.45), out = eio(tt, 1.8, 3);
  const arc = (a0: number, a1: number, r: number) => `M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`;
  return <>
    <svg width={900} height={900} viewBox="-450 -450 900 900" style={{ position: "absolute", left: 360, top: 90, transform: `scale(${s})` }}>
      <path d={arc(-0.4, 5.6, 360)} fill="#3a3a44" stroke="#22222a" strokeWidth={6} />
      <path d={arc(-0.4, 5.6, 360)} fill="url(#cloth)" opacity={0.9} /><defs><pattern id="cloth" width={40} height={40} patternUnits="userSpaceOnUse"><rect width={40} height={40} fill="#5a4a5a" /><path d="M0 20 L40 20 M20 0 L20 40" stroke="#4a3a4a" strokeWidth={6} /></pattern></defs>
      <g transform={`translate(${out * 160 * Math.cos(-0.4 - 0.4)} ${out * 160 * Math.sin(-0.8)})`}><path d={arc(-0.8, -0.4, 360)} fill={FUR} stroke="#3a2a1a" strokeWidth={6} /></g>
      <text x={0} y={60} textAnchor="middle" fontFamily={MARK} fontSize={140} fill="#e8dcc0" opacity={cl(pop(tt, 3.2))}>?</text>
    </svg>
    <Lbl x={1440} y={300} tt={tt} at={2.2} txt="the nutria: one piece" size={58} col={AMB} c={false} />
    <Lbl x={1440} y={380} tt={tt} at={3.4} txt="not the biggest piece" size={52} c={false} />
    <Lbl x={1440} y={700} tt={tt} at={4.4} txt="built on purpose · still there" size={48} c={false} col={DIM} />
  </>;
}} />;

// m3 · retrato de la nutria: entra nadando y los dientes naranjas se iluminan; Sudamérica señalada
export const HIncisors: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const x = -200 + eio(tt, 0.2, 2.4) * 1100, zoom = eio(tt, 2.8, 4.2);
  return <>
    <Water tt={tt} top={560} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 + zoom * 0.9})`, transformOrigin: `${x + 140}px 540px` }}><Nutria x={x} y={560} s={2.2} tt={tt} /></div>
    <div style={{ position: "absolute", left: 1350, top: 180, width: 360, height: 520, borderRadius: "40% 60% 50% 50%/30% 30% 70% 70%", background: "rgba(143,154,74,.4)", border: "4px solid #a8b05a", opacity: cl(pop(tt, 1.4)) }}>
      <div style={{ position: "absolute", left: 120, top: 300, width: 160, height: 180, background: "rgba(255,90,74,.6)", borderRadius: "40%" }} /></div>
    <Lbl x={1530} y={740} tt={tt} at={1.8} txt="Argentina · Chile · S. Brazil" size={44} />
    <Lbl x={760} y={120} tt={tt} at={3.6} txt="it eats the roots that hold a marsh together" size={54} col={AMB} />
  </>;
}} />;

// m3-4 · el árbol de camadas: 2-3 camadas al año, cada una se ramifica en más nutrias
export const HLitterTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [1, 3, 9, 27];
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {L.slice(1).map((n, lv) => Array.from({ length: n }, (_, i) => { const px = 960 + ((Math.floor(i / 3) + 0.5) / L[lv] - 0.5) * 1700, x = 960 + ((i + 0.5) / n - 0.5) * 1700, l = eio(tt, 0.6 + lv * 1.4, 1.4 + lv * 1.4); return <line key={lv + "-" + i} x1={px} y1={200 + lv * 230} x2={px + (x - px) * l} y2={200 + lv * 230 + 230 * l} stroke={DIM} strokeWidth={3} />; }))}
    </svg>
    {L.map((n, lv) => Array.from({ length: n }, (_, i) => { const x = 960 + ((i + 0.5) / n - 0.5) * 1700; return <Nutria key={lv + "_" + i} x={x} y={200 + lv * 230} s={[0.9, 0.6, 0.38, 0.22][lv] * pop(tt, 0.2 + lv * 1.4 + i * 0.02, 8, 0.4)} tt={tt + i} />; }))}
    <Lbl x={1640} y={120} tt={tt} at={1} txt="2–3 litters a year" size={50} />
  </>;
}} />;

// m4-5 · el perchero de pieles: abrigo, cuello, sombrero se cuelgan uno tras otro
export const HCoatRack: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const I = [["COAT", 0.4, 380, 520], ["COLLAR", 1.2, 260, 200], ["HAT", 2, 220, 180]] as [string, number, number, number][];
  return <>
    <div style={{ position: "absolute", left: 240, top: 220, width: 1440, height: 22, background: "linear-gradient(#c9cdd2,#7a7e84)", borderRadius: 11 }} />
    {I.map(([l, d, w, hh], i) => { const s = pop(tt, d, 6, 0.5), sw = Math.sin(tt * 2 + i) * 3 * s; return <div key={i} style={{ position: "absolute", left: 420 + i * 460, top: 230, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - s) * -600}px)` }}>
      <svg width={60} height={60} style={{ marginLeft: w / 2 - 30 }}><path d="M30 0 Q50 0 50 18 Q50 30 30 34 L30 60" stroke="#999" strokeWidth={5} fill="none" /></svg>
      <div style={{ width: w, height: hh, background: `repeating-linear-gradient(170deg,${FUR} 0 7px,#8a6244 7px 11px)`, borderRadius: i === 2 ? "50% 50% 12px 12px" : i === 1 ? 60 : "40px 40px 20px 20px", boxShadow: shadow }} />
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: TX, marginTop: 20 }}>{l}</div></div>; })}
    <Lbl x={960} y={960} tt={tt} at={3} txt="soft and thick underneath · like beaver" size={56} col={AMB} />
  </>;
}} />;

// m5 · el mapa de corrales: estados con granjas de nutria se marcan con una cerquita
export const HPenMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [["LA", 1180, 760, 0.4], ["CA", 220, 540, bt(h, 0, 1.6)], ["OR", 260, 260, bt(h, 0, 1.6) + 0.3], ["WA", 300, 120, bt(h, 0, 1.6) + 0.6], ["MI", 1300, 330, bt(h, 0, 1.6) + 0.9], ["OH", 1420, 450, bt(h, 0, 1.6) + 1.2], ["TX", 900, 780, bt(h, 0, 1.6) + 1.5]] as [string, number, number, number][];
  return <At x={960} y={560} rx={40}>
    <div style={{ width: 1700, height: 900, position: "relative", borderRadius: 30, background: "linear-gradient(135deg,#c9bf8a,#a89a62)", boxShadow: shadow }}>
      {P.map(([s, x, y, d], i) => { const sc = pop(tt, d, 8, 0.4); return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})` }}>
        <svg width={140} height={100}>{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={10 + k * 28} y={20} width={8} height={70} fill="#6b4a2c" />)}<rect x={6} y={36} width={128} height={6} fill="#8a6a40" /><rect x={6} y={66} width={128} height={6} fill="#8a6a40" /></svg>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK }}>{s}</div></div>; })}
      <Lbl x={850} y={-110} tt={tt} at={0.8} txt="1930s · fur farms · raise them in pens, get rich" size={54} />
    </div>
  </At>;
}} />;

// m6 · la leyenda: el huracán rompe el corral (dibujado como historieta, con el sello LEGEND)
export const HHurricanePen: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const w = eio(tt, 0.8, 3), br = eIn(tt, 2.4, 3.4);
  return <>
    <div style={{ position: "absolute", left: 260, top: 180, width: 1400, height: 720, background: "#efe6cf", boxShadow: shadow, border: "10px solid #2a2118", overflow: "hidden" }}>
      <svg width={1400} height={720}>{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-200 + ((tt * 600 + i * 220) % 1800)} ${80 + i * 70} q120 -40 240 0`} stroke="#2a2118" strokeWidth={6} fill="none" opacity={w} />)}
        {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={480 + k * 80 + (k > 2 ? br * 300 : -br * 200)} y={360 - br * (k * 30)} width={16} height={240} fill="#6b4a2c" transform={`rotate(${br * (k - 2.5) * 30} ${488 + k * 80} 600)`} />)}</svg>
      {[0, 1, 2].map((k) => <Nutria key={k} x={700 + br * (300 + k * 200)} y={560 + k * 30} s={0.6} tt={tt} o={cl(br * 2)} />)}
    </div>
    <Stamp tt={tt} at={3.8} txt="LEGEND" x={1500} y={240} r={12} size={90} />
  </>;
}} />;

// m6-7 · verificación de la leyenda: tres afirmaciones, cada una tachada por el registro
export const HMythCheck: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [["he was the first", "he was the THIRD", bt(h, 0, 1.6)], ["from Argentina", "bought 20 in south Louisiana · 1938", bt(h, 1, 3.4)], ["a hurricane broke the pens", "some set loose ON PURPOSE", bt(h, 2, 5.2)]] as [string, string, number][];
  return <>{R.map(([a, b, d], i) => { const x = eio(tt, d, d + 0.5), s = pop(tt, 0.3 + i * 0.3); return <div key={i} style={{ position: "absolute", left: 200, top: 220 + i * 230, opacity: cl(s * 2), display: "flex", alignItems: "center", gap: 50 }}>
    <div style={{ position: "relative", fontFamily: HAND, fontSize: 64, color: TX, width: 720 }}>{a}<div style={{ position: "absolute", left: 0, top: "52%", height: 8, width: `${x * 90}%`, background: RED }} /></div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: AMB, opacity: cl(pop(tt, d + 0.4) * 2), transform: `translateX(${(1 - pop(tt, d + 0.4)) * 200}px)` }}>{b}</div></div>; })}
    <Lbl x={960} y={110} tt={tt} at={0.4} txt="what the old papers say" size={58} /></>;
}} />;

// m7 · muchas manos abren muchas jaulas: no fue un hombre ni una tormenta
export const HManyHands: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  {Array.from({ length: 8 }, (_, i) => { const x = 200 + (i % 4) * 440, y = 260 + Math.floor(i / 4) * 340, op = eio(tt, 0.6 + i * 0.4, 1.2 + i * 0.4); return <div key={i} style={{ position: "absolute", left: x, top: y }}>
    <div style={{ width: 260, height: 180, border: "6px solid #8a8e94", background: "repeating-linear-gradient(90deg,transparent 0 30px,#8a8e94 30px 34px)" }} />
    <div style={{ position: "absolute", left: 254, top: 0, width: 10, height: 180, background: "#8a8e94", transformOrigin: "0 50%", transform: `perspective(400px) rotateY(${op * -80}deg)` }} />
    <Nutria x={130 + op * 260} y={110} s={0.5} tt={tt} o={op} /></div>; })}
  <Lbl x={960} y={120} tt={tt} at={1} txt="a lot of people, in a lot of places" size={60} />
  <Lbl x={960} y={960} tt={tt} at={4} txt="easier to blame one rich man and one storm" size={54} col={AMB} />
</>} />;

// m8 · la zanja tapada de jacinto de agua: flores violetas que cubren el agua
export const HHyacinthDitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 0.5, 5);
  return <>
    <Water tt={tt} top={420} />
    {Array.from({ length: 70 }, (_, i) => { const on = cl(c * 70 - i) ; const x = rnd(i) * 1920, y = 440 + rnd(i + 3) * 600; return <div key={i} style={{ position: "absolute", left: x - 70, top: y - 50, transform: `scale(${on})` }}>
      <div style={{ width: 140, height: 90, borderRadius: "50%", background: "radial-gradient(#6a9a3a,#3f6a24)" }} />{i % 3 === 0 && <div style={{ position: "absolute", left: 46, top: -30, width: 46, height: 60, borderRadius: "40%", background: "radial-gradient(#c9a0ff,#7a4ab0)" }} />}</div>; })}
    <Lbl x={960} y={140} tt={tt} at={0.8} txt="water hyacinth · choking ditches, canals and bayous" size={56} />
  </>;
}} />;

// m8-9 · las cajas de envío: «WEED EATERS» sale a otros estados; la nutria prefiere lo nativo
export const HCrateShip: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  {Array.from({ length: 5 }, (_, i) => { const s = pop(tt, 0.3 + i * 0.35, 7, 0.5), slide = eio(tt, 2.6 + i * 0.2, 4 + i * 0.2); return <div key={i} style={{ position: "absolute", left: 200 + i * 300 + slide * 1800, top: 360 + (i % 2) * 60, width: 260, height: 220, transform: `translateY(${(1 - s) * -600}px) rotate(${(i - 2) * 2}deg)`, background: "repeating-linear-gradient(0deg,#c9a46a 0 40px,#a8844a 40px 44px)", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
    <div style={{ fontFamily: MARK, fontSize: 40, color: "#5a2a1a" }}>WEED EATERS</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#5a2a1a" }}>LIVE · THIS SIDE UP</div></div>; })}
  <Lbl x={960} y={120} tt={tt} at={0.6} txt="sold and sent to other states" size={58} />
  <Lbl x={960} y={860} tt={tt} at={4.6} txt="they ate the native plants instead" size={60} col={AMB} />
</>} />;

// m9-10 · la cosecha que sube: columnas de pieles apiladas por década
export const HHarvestBars: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const D = [["1950s", 0.3], ["1960s", 0.55], ["1976", 1]] as [string, number][];
  return <>
    {D.map(([l, v], i) => { const g = eio(tt, 0.4 + i * 0.9, 1.6 + i * 0.9); const n = Math.round(14 * v * g); return <div key={i} style={{ position: "absolute", left: 460 + i * 380, bottom: 200, width: 260 }}>
      {Array.from({ length: n }, (_, k) => <div key={k} style={{ height: 40, marginTop: 4, background: `repeating-linear-gradient(90deg,${FUR} 0 8px,#8a6244 8px 12px)`, borderRadius: 20, transform: `rotate(${(k % 2 ? 1 : -1) * 2}deg)` }} />)}
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: TX, marginTop: 12 }}>{l}</div></div>; })}
    <Lbl x={1560} y={200} tt={tt} at={3.2} txt="~1.8M pelts" size={64} col={AMB} />
    <Lbl x={960} y={110} tt={tt} at={0.6} txt="the dumped animal became a business" size={56} />
  </>;
}} />;

// m10-11 · el campamento sobre pilotes: casita de madera en la marisma, sólo se llega en bote
export const HStiltCamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.5), smoke = (tt * 0.5) % 1;
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#9fb4c0,#d8dfd0 55%)" }} />
    <Grass x={0} y={620} w={1920} tt={tt} n={70} /><Water tt={tt} top={620} />
    <div style={{ position: "absolute", left: 700, top: 300, transform: `translateY(${(1 - s) * 400}px)` }}>
      {[30, 170, 310, 450].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 230, width: 18, height: 220, background: "#5a3a20" }} />)}
      <div style={{ position: "absolute", left: 0, top: 220, width: 500, height: 20, background: "#6b4a2c" }} />
      <div style={{ position: "absolute", left: 40, top: 60, width: 420, height: 170, background: "repeating-linear-gradient(0deg,#8a6a4a 0 24px,#7a5a3a 24px 28px)" }}><div style={{ position: "absolute", left: 60, top: 50, width: 70, height: 70, background: "#f3d890" }} /><div style={{ position: "absolute", left: 260, top: 40, width: 80, height: 130, background: "#4a3020" }} /></div>
      <div style={{ position: "absolute", left: 10, top: -10, width: 480, height: 80, background: "#5a5a5a", clipPath: "polygon(10% 0,90% 0,100% 100%,0 100%)" }} />
      <div style={{ position: "absolute", left: 380, top: -60 - smoke * 120, width: 40 + smoke * 60, height: 40 + smoke * 60, borderRadius: "50%", background: "rgba(200,200,200,.5)", opacity: 1 - smoke }} /></div>
    <Lbl x={960} y={120} tt={tt} at={1.2} txt="late November → early spring · by boat only" size={56} />
  </>;
}} />;

// m11 · el contador de trampas: cada día se revisa la línea, la cuenta corre como odómetro de bolsillo
export const HTrapCount: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.4, 6), n = Math.round(300 * p);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M100 900 C500 700 300 400 800 420 S1400 700 1820 200" stroke={DIM} strokeWidth={6} fill="none" strokeDasharray="4 18" />
      {Array.from({ length: 30 }, (_, i) => { const u = i / 29, on = p > u; const x = 100 + u * 1720, y = 900 - u * 700 + Math.sin(u * 7) * 120; return <g key={i} transform={`translate(${x} ${y})`} opacity={on ? 1 : 0.25}><rect x={-14} y={-14} width={28} height={28} fill="none" stroke={on ? AMB : DIM} strokeWidth={4} /></g>; })}</svg>
    <div style={{ position: "absolute", left: 1300, top: 640, padding: "20px 40px", background: "#111", borderRadius: 16, fontFamily: "monospace", fontSize: 110, color: "#ffd27a", boxShadow: shadow }}>{String(n).padStart(3, "0")}</div>
    <Lbl x={1460} y={820} tt={tt} at={2} txt="traps · checked every single day" size={48} />
  </>;
}} />;

// m12 · las hormas de estirar: tablas en fila con las pieles secándose; manos chicas raspan
export const HStretchBoards: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 260, background: "#4a3a28" }} />
  {Array.from({ length: 9 }, (_, i) => { const s = pop(tt, 0.3 + i * 0.3, 7, 0.5), dry = eio(tt, 1 + i * 0.3, 5 + i * 0.3); return <div key={i} style={{ position: "absolute", left: 120 + i * 190, top: 260, transform: `translateY(${(1 - s) * -700}px) rotate(${(i % 2 ? 1 : -1) * 3}deg)` }}>
    <div style={{ width: 120, height: 560, background: "linear-gradient(90deg,#c9a46a,#e8cf94,#c9a46a)", clipPath: "polygon(30% 0,70% 0,100% 18%,100% 100%,0 100%,0 18%)" }} />
    <div style={{ position: "absolute", left: 12, top: 50, width: 96, height: 440, background: `rgb(${122 + 60 * dry},${82 + 50 * dry},${54 + 40 * dry})`, clipPath: "polygon(35% 0,65% 0,95% 20%,90% 100%,10% 100%,5% 20%)" }} /></div>; })}
  <Lbl x={960} y={130} tt={tt} at={1.4} txt="skinning · scraping · stretching — the whole family" size={54} />
</>} />;

// m13 · el sube y baja: la nutria grande baja de golpe y la ratas almizcleras salen volando del otro lado
export const HSeesawMusk: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const a = -14 + 28 * eio(tt, 1.6, 2.6);
  return <>
    <div style={{ position: "absolute", left: 930, top: 700, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "120px solid #6b4a2c", marginLeft: -30 }} />
    <div style={{ position: "absolute", left: 360, top: 690, width: 1200, transformOrigin: "50% 50%", transform: `rotate(${-a}deg)` }}>
      <div style={{ height: 24, background: "linear-gradient(#a8743a,#7a4a20)", borderRadius: 12 }} />
      {[0, 1, 2].map((i) => <svg key={i} width={120} height={70} viewBox="0 0 120 70" style={{ position: "absolute", left: 30 + i * 120, top: -70 - Math.max(0, a - 10) * 30 * (i + 1) * 0.3 }}><ellipse cx={60} cy={40} rx={44} ry={24} fill="#5a4a3a" /><circle cx={100} cy={32} r={14} fill="#5a4a3a" /><path d="M16 46 Q0 60 -10 50" stroke="#3a2a1a" strokeWidth={5} fill="none" /></svg>)}
      <div style={{ position: "absolute", left: 860, top: -160 + pop(tt, 1, 6, 0.4) * 0 }}><Nutria x={130} y={80} s={1.3 * pop(tt, 1, 6, 0.4)} tt={tt} flip /></div></div>
    <Lbl x={500} y={300} tt={tt} at={0.4} txt="MUSKRAT" size={56} hand={false} />
    <Lbl x={1400} y={300} tt={tt} at={1.2} txt="NUTRIA · bigger" size={56} hand={false} col={AMB} />
    <Lbl x={960} y={920} tt={tt} at={3.4} txt="the trappers switched" size={60} />
  </>;
}} />;

// m14 · el cartel que se da vuelta: «UNDO» se gira y del otro lado dice «ADAPT»
export const HAdaptSign: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const f = eio(tt, 1.6, 2.8), face = f < 0.5;
  return <>
    <div style={{ position: "absolute", left: 950, top: 560, width: 20, height: 520, background: "#5a3a20" }} />
    <div style={{ position: "absolute", left: 960 - 380, top: 200, width: 760, height: 380, transform: `perspective(1600px) rotateY(${f * 180}deg)`, background: face ? "#8a2a1a" : "#2a5a3a", boxShadow: shadow, borderRadius: 18, border: "12px solid #f3ead6", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: face ? "none" : "scaleX(-1)", fontFamily: FONT, fontWeight: 900, fontSize: 170, color: "#f3ead6", letterSpacing: 10 }}>{face ? "UNDO" : "ADAPT"}</div></div>
    <Lbl x={960} y={720} tt={tt} at={3.2} txt="a mistake made by somebody else" size={56} />
    <Lbl x={960} y={800} tt={tt} at={4.2} txt="make a living out of it if they can" size={56} col={AMB} />
  </>;
}} />;

// m14-15 · la válvula de control: cada invierno la canilla de trampas saca un millón y el nivel de la marisma se sostiene
export const HCheckValve: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lvl = 0.55 + 0.05 * Math.sin(tt * 2);
  return <>
    <div style={{ position: "absolute", left: 560, top: 180, width: 520, height: 680, borderRadius: 20, border: "10px solid rgba(220,235,240,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: `repeating-linear-gradient(170deg,${FUR} 0 10px,#8a6244 10px 16px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "20%", borderTop: `6px dashed ${RED}` }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: RED, padding: 6 }}>MARSH DAMAGE</div></div></div>
    <div style={{ position: "absolute", left: 1080, top: 780, width: 200, height: 50, background: "#9aa1aa" }} />
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.8 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 1280 + ph * 300, top: 790 + ph * ph * 200, width: 30, height: 18, borderRadius: "50%", background: FUR, opacity: 1 - ph }} />; })}
    <Lbl x={1500} y={600} tt={tt} at={1.2} txt="−1,000,000 / winter" size={60} col={AMB} />
    <Lbl x={820} y={110} tt={tt} at={2.6} txt="nobody called it pest control · but it was" size={54} />
  </>;
}} />;

// m15 · la etiqueta de precio que se tacha y se tacha y se tacha
export const HPriceTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = ["$8", "$5", "$2", "$1", "¢"];
  const at = [0.3, 1.2, bt(h, 0, 2.6), 3.6, bt(h, 1, 4.8)];
  return <At x={900} y={560} r={-8}>
    <div style={{ width: 760, height: 460, background: "#fbf7ec", boxShadow: shadow, clipPath: "polygon(16% 0,100% 0,100% 100%,16% 100%,0 50%)", position: "relative", padding: "50px 0 0 170px" }}>
      <div style={{ position: "absolute", left: 60, top: 210, width: 40, height: 40, borderRadius: "50%", background: "#333" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#7a6a4a" }}>NUTRIA PELT</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, marginTop: 20 }}>{P.map((p, i) => { const on = pop(tt, at[i]), x = i < 4 ? eio(tt, at[i + 1] - 0.3, at[i + 1]) : 0; return <div key={i} style={{ position: "relative", fontFamily: HAND, fontSize: 90, color: i === 4 ? RED : INK, opacity: cl(on * 2), transform: `scale(${on})` }}>{p}<div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 8, background: RED, transform: `scaleX(${x}) rotate(-8deg)`, transformOrigin: "0 50%" }} /></div>; })}</div></div>
  </At>;
}} />;

// m15-16 · el bidón de nafta que pesa más que la piel en la balanza de mano
export const HGasCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tip = eio(tt, 1, 2.6) * 18;
  return <>
    <div style={{ position: "absolute", left: 960, top: 160, width: 14, height: 140, background: "#888", marginLeft: -7 }} />
    <div style={{ position: "absolute", left: 960 - 520, top: 300, width: 1040, transform: `rotate(${tip}deg)` }}><div style={{ height: 18, background: "#9aa1aa", borderRadius: 9 }} />
      <div style={{ position: "absolute", left: 40, top: 18, transform: `rotate(${-tip}deg)`, transformOrigin: "50% 0" }}><div style={{ width: 4, height: 120, margin: "0 auto", background: "#888" }} /><div style={{ width: 200, height: 60, background: `repeating-linear-gradient(90deg,${FUR} 0 6px,#8a6244 6px 10px)`, borderRadius: 30 }} /><div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: TX }}>PELT</div></div>
      <div style={{ position: "absolute", right: 40, top: 18, transform: `rotate(${-tip}deg)`, transformOrigin: "50% 0" }}><div style={{ width: 4, height: 80, margin: "0 auto", background: "#888" }} />
        <svg width={200} height={240} viewBox="0 0 200 240"><path d="M20 40 L150 40 L180 80 L180 230 L20 230 Z" fill="#c23a1a" /><rect x={130} y={10} width={30} height={34} fill="#999" /><rect x={50} y={110} width={100} height={60} fill="#f3ead6" /><text x={100} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#c23a1a">GAS</text></svg></div></div>
    <Lbl x={960} y={900} tt={tt} at={2.8} txt="not worth the gas to go get it" size={62} col={AMB} />
  </>;
}} />;

// m16-17 · el «eat-out» en corte: el grupo come raíces, queda barro pelado y la marea se lo lleva
export const HEatOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const eat = eio(tt, 0.6, bt(h, 0, 3)), wash = eio(tt, bt(h, 1, 5), bt(h, 1, 5) + 2);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={560} width={1920} height={520} fill={MUD} />
      <path d={`M560 560 Q960 ${560 + 220 * wash} 1360 560 Z`} fill={WATER} />
      {Array.from({ length: 70 }, (_, i) => { const x = 20 + i * 27, inPatch = x > 560 && x < 1360, gone = inPatch && eat > (x - 560) / 800; return gone ? null : <g key={i}><path d={`M${x} 560 Q${x + 4} 480 ${x + 8 * Math.sin(tt + i)} ${420 + (i % 4) * 16}`} stroke={MARSH} strokeWidth={6} fill="none" />
        {Array.from({ length: 4 }, (_, k) => <path key={k} d={`M${x} 562 q${(k - 1.5) * 8} 40 ${(k - 1.5) * 12} 90`} stroke="#c9b48a" strokeWidth={2} fill="none" />)}</g>; })}
    </svg>
    {[0, 1, 2].map((i) => <Nutria key={i} x={600 + eat * 700 + i * 70} y={530 + i * 14} s={0.55} tt={tt} o={1 - wash} />)}
    <Lbl x={960} y={150} tt={tt} at={bt(h, 0, 3) as number} txt="EAT-OUT · roots and all" size={64} hand={false} />
    <Lbl x={960} y={240} tt={tt} at={(bt(h, 1, 5) as number) + 1} txt="bare mud → open water, for good" size={56} col={AMB} />
  </>;
}} />;

// m17-18 · la grilla de reconocimiento aéreo: la mira recorre la marisma y cuenta las celdas dañadas
export const HAerialGrid: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.4, 6), n = Math.round(100 * p);
  return <>
    <div style={{ position: "absolute", left: 160, top: 140, width: 1200, height: 800, background: `repeating-linear-gradient(80deg,${MARSH} 0 8px,#7f8a3a 8px 16px)`, boxShadow: shadow, display: "grid", gridTemplateColumns: "repeat(12,1fr)" }}>
      {Array.from({ length: 96 }, (_, i) => { const dmg = rnd(i + 3) < 0.45, on = p * 96 > i; return <div key={i} style={{ border: "1px solid rgba(255,255,255,.25)", background: on && dmg ? "rgba(44,93,106,.85)" : "transparent" }} />; })}
    </div>
    <div style={{ position: "absolute", left: 160 + (Math.floor(p * 96) % 12) * 100, top: 140 + Math.floor(Math.min(95, p * 96) / 12) * 100, width: 100, height: 100, border: `6px solid ${RED}` }} />
    <div style={{ position: "absolute", left: 1420, top: 360, fontFamily: FONT, fontWeight: 900, color: TX }}><div style={{ fontSize: 40, color: DIM }}>1990s · FROM THE AIR</div><div style={{ fontSize: 120 }}>~{n}K</div><div style={{ fontSize: 44, color: DIM }}>ACRES DAMAGED</div></div>
  </>;
}} />;

// m18 · la ventanilla del pago: cada cola que entra por el mostrador suma su billete; 4 → 5 → 6 dólares
export const HTailBounty: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const st = Math.min(2, Math.floor(eio(tt, 0.8, 5.5) * 3)), px = ["$4", "$5", "~$6"][st], yr = ["2002", "2006", "later"][st];
  return <>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 640, background: "linear-gradient(#6b4a2c,#4a321e)", boxShadow: shadow, borderRadius: 14 }}>
      <div style={{ position: "absolute", left: 300, top: 60, width: 600, height: 300, background: "#1c2a30", border: "14px solid #3a2a1a", borderRadius: "300px 300px 0 0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: GRN }}>{px}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: TX }}>PER TAIL · {yr}</div></div>
      <div style={{ position: "absolute", left: 100, right: 100, bottom: 60, height: 120, background: "#8a6a4a", borderRadius: 8 }} /></div>
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.6 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 300 + ph * 760, top: 770 - Math.sin(ph * Math.PI) * 40, width: 160, height: 14, borderRadius: 7, background: "#4a3a2e", opacity: Math.sin(ph * Math.PI) }} />; })}
    <Lbl x={960} y={110} tt={tt} at={0.4} txt="Coastwide Nutria Control Program" size={56} />
  </>;
}} />;

// m19 · el área dañada se encoge: la mancha de agua sobre la marisma se cierra de 80K a unos pocos miles de acres
export const HAcresFall: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.8, 5.5), n = Math.round(80 - 76 * p);
  return <>
    <div style={{ position: "absolute", left: 200, top: 200, width: 900, height: 700, background: `repeating-linear-gradient(80deg,${MARSH} 0 8px,#7f8a3a 8px 16px)`, boxShadow: shadow, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 450 - 380 * (1 - p * 0.9), top: 350 - 300 * (1 - p * 0.9), width: 760 * (1 - p * 0.9), height: 600 * (1 - p * 0.9), borderRadius: "45% 55% 50% 50%", background: WATER, opacity: 0.85 }} /></div>
    <div style={{ position: "absolute", left: 1240, top: 320, fontFamily: FONT, fontWeight: 900, color: TX }}><div style={{ fontSize: 160, color: p > 0.9 ? GRN : TX }}>{n}K</div><div style={{ fontSize: 44, color: DIM }}>DAMAGED ACRES</div></div>
    <Lbl x={1420} y={640} tt={tt} at={3.6} txt="it worked better than expected" size={52} col={AMB} />
  </>;
}} />;

// m19-20 · la ficha de receta: «nutria, como conejo»; la mayoría no se animó (la cuchara se aleja)
export const HRecipeCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.5), no = eio(tt, 3, 4);
  return <>
    <At x={760} y={560} r={-4}><div style={{ width: 860, height: 560, background: "#fbf7ec", boxShadow: shadow, padding: "40px 50px", transform: `translateY(${(1 - s) * 700}px)`, backgroundImage: "repeating-linear-gradient(0deg,transparent 0 55px,rgba(80,110,160,.3) 55px 57px)", borderTop: "50px solid #c23a1a" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: INK }}>RECIPE · LOUISIANA</div>
      {["lean meat — like rabbit", "cook it all the way through", "serve with rice"].map((l, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 50, color: "#22314f", marginTop: 22, opacity: cl(pop(tt, 1 + i * 0.5) * 2) }}>• {l}</div>)}</div></At>
    <div style={{ position: "absolute", left: 1400, top: 380, fontSize: 0 }}>
      <svg width={300} height={300} viewBox="0 0 300 300" style={{ transform: `translateX(${no * 200}px) rotate(${no * 30}deg)`, opacity: 1 - no * 0.6 }}><ellipse cx={80} cy={80} rx={60} ry={40} fill="#c9cdd2" /><rect x={130} y={72} width={160} height={16} rx={8} fill="#c9cdd2" /></svg></div>
    <Lbl x={1520} y={760} tt={tt} at={4} txt="some tried it · most didn't" size={52} />
  </>;
}} />;

// m20-21 · la mancha de tierra perdida = Delaware: la silueta del estado se apoya encima y queda chica
export const HDelawareOverlay: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 0.6, 3.6), d = pop(tt, 3.8, 6, 0.4);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 380, background: "linear-gradient(#8f9a4a,#7f8a3a)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M0 380 ${Array.from({ length: 25 }, (_, i) => `L${i * 80} ${380 + g * (120 + 80 * Math.sin(i * 1.7))}`).join(" ")} L1920 380 Z`} fill={MARSH} /><rect x={0} y={380} width={1920} height={700} fill={WATER} opacity={0.6} /></svg>
    <svg width={360} height={560} viewBox="0 0 120 200" style={{ position: "absolute", left: 1400, top: 360, transform: `scale(${d})`, transformOrigin: "50% 0" }}><path d="M40 0 L60 0 L64 40 L100 120 L118 196 L10 196 L14 60 Z" fill="none" stroke="#f3ead6" strokeWidth={4} strokeDasharray="6 4" /><text x={60} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={16} fill="#f3ead6">DELAWARE</text></svg>
    <div style={{ position: "absolute", left: 200, top: 560, fontFamily: FONT, fontWeight: 900, color: TX }}><div style={{ fontSize: 150 }}>~{Math.round(2000 * g).toLocaleString("en-US")}</div><div style={{ fontSize: 44, color: DIM }}>SQUARE MILES SINCE 1932 · USGS</div></div>
    <Lbl x={500} y={880} tt={tt} at={4.4} txt="a quarter of the coast's land" size={56} col={AMB} c={false} />
  </>;
}} />;

// m21 · el abanico del río: cada primavera el agua se abre en dedos y deja barro que levanta la tierra
export const HRiverFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.4, 4), lay = eio(tt, 2, 6);
  return <>
    <div style={{ position: "absolute", inset: 0, background: WATER }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M960 0 L960 380`} stroke="#8a6a40" strokeWidth={80} />
      {Array.from({ length: 9 }, (_, i) => { const a = -0.9 + i * 0.225; return <path key={i} d={`M960 380 Q${960 + 300 * Math.sin(a)} ${520} ${960 + 900 * Math.sin(a) * p} ${380 + 600 * p * Math.cos(a)}`} stroke="#a8844a" strokeWidth={28 - Math.abs(i - 4) * 3} fill="none" />; })}
      <path d={`M300 1080 Q960 ${700 - 200 * lay} 1620 1080 Z`} fill={MARSH} opacity={0.4 + 0.5 * lay} />
    </svg>
    <Lbl x={960} y={120} tt={tt} at={1} txt="for thousands of years, the river built this land" size={56} />
    <Lbl x={960} y={940} tt={tt} at={3.6} txt="mud from half a continent" size={56} col={AMB} />
  </>;
}} />;

// m22 · 1927: el agua sube por la pared de una casa hasta el techo; luego llega el muro
export const HFloodRoof: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const w = eio(tt, 0.5, 4), lev = eio(tt, 4.5, 6);
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#7a8a96,#c9cfd2)" }} />
    <svg width={600} height={500} style={{ position: "absolute", left: 660, top: 320 }}><path d="M40 200 L300 40 L560 200 Z" fill="#6b3a2a" /><rect x={80} y={200} width={440} height={300} fill="#e8dcc0" /><rect x={260} y={330} width={90} height={170} fill="#6b4a2c" /><rect x={120} y={260} width={90} height={80} fill="#9fc0dd" /><rect x={390} y={260} width={90} height={80} fill="#9fc0dd" /></svg>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120 + 560 * w, background: "rgba(110,90,60,.85)" }}>{Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((tt * 60 + i * 200) % 2100) - 100, top: 10, width: 140, height: 4, background: "rgba(255,255,255,.3)" }} />)}</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260 * lev, background: "linear-gradient(#8a8478,#5a5448)", clipPath: "polygon(0 30%,100% 30%,100% 100%,0 100%)" }} />
    <Lbl x={960} y={120} tt={tt} at={1} txt="the Great Flood of 1927" size={64} />
    <Lbl x={960} y={200} tt={tt} at={4.6} txt="never again → levees for hundreds of miles" size={52} col={AMB} />
  </>;
}} />;

// m22-23 · el tobogán del barro: la corriente encerrada entre diques lanza el barro de largo, más allá de la plataforma
export const HLeveeChute: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,${MARSH} 0 30%,${WATER} 30% 70%,#173548 70%)` }} />
  <div style={{ position: "absolute", left: 0, top: 440, width: 1500, height: 40, background: "#7a7468" }} /><div style={{ position: "absolute", left: 0, top: 600, width: 1500, height: 40, background: "#7a7468" }} />
  <div style={{ position: "absolute", left: 0, top: 480, width: 1500, height: 120, background: "#8a6a40" }} />
  {Array.from({ length: 30 }, (_, i) => { const ph = (tt * 0.6 + i / 30) % 1; return <div key={i} style={{ position: "absolute", left: ph * 1900, top: 520 + (rnd(i) - 0.5) * 60 + (ph > 0.78 ? (ph - 0.78) * 1200 : 0), width: 22, height: 22, borderRadius: "50%", background: "#c9a46a", opacity: ph > 0.78 ? 1 - (ph - 0.78) * 4 : 1 }} />; })}
  <div style={{ position: "absolute", left: 1480, top: 380, height: 700, borderLeft: "4px dashed rgba(255,255,255,.6)" }} />
  <Lbl x={500} y={320} tt={tt} at={0.8} txt="the marsh: no mud" size={52} col="#e8f0d0" />
  <Lbl x={1700} y={300} tt={tt} at={2.4} txt="past the shelf · deep water" size={44} />
</>} />;

// m23-24 · torre de perforación y canal recto: la regla traza líneas rectas a través del laberinto de canalitos
export const HRigCanal: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [[200, 300, 1700, 340], [400, 900, 1500, 160], [900, 100, 960, 1000], [100, 700, 1800, 760]];
  return <At x={960} y={560} rx={44}>
    <div style={{ width: 1700, height: 900, position: "relative", background: `repeating-linear-gradient(80deg,${MARSH} 0 8px,#7f8a3a 8px 16px)`, boxShadow: shadow, overflow: "hidden" }}>
      <svg width={1700} height={900} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${rnd(i) * 1700} 0 C${rnd(i + 1) * 1700} 300 ${rnd(i + 2) * 1700} 600 ${rnd(i + 3) * 1700} 900`} stroke={WATER} strokeWidth={10} fill="none" opacity={0.7} />)}
        {L.map(([x1, y1, x2, y2], i) => { const l = eio(tt, 0.6 + i * 1, 1.6 + i * 1); return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * l} y2={y1 + (y2 - y1) * l} stroke="#1f4a56" strokeWidth={26} />; })}
      </svg>
      {[[1700, 340], [1500, 160]].map(([x, y], i) => <svg key={i} width={90} height={160} style={{ position: "absolute", left: x - 100, top: y - 150, opacity: cl(pop(tt, 1.6 + i)) }}><path d="M45 0 L80 150 L10 150 Z" fill="none" stroke="#333" strokeWidth={6} /><line x1={20} y1={100} x2={70} y2={100} stroke="#333" strokeWidth={4} /></svg>)}
      <Lbl x={850} y={800} tt={tt} at={4.4} txt="thousands of miles of canals" size={58} col="#fff" />
    </div>
  </At>;
}} />;

// m24 · la cuña salada: el agua salada (oscura) avanza por el canal recto y las plantas dulces se marchitan
export const HSaltWedge: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = eio(tt, 0.6, 5);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={480} width={1920} height={140} fill="#7fb0b8" />
      <rect x={1920 - 1920 * s} y={480} width={1920 * s} height={140} fill="#1f3f5a" />
      {Array.from({ length: 34 }, (_, i) => { const x = 30 + i * 56, salted = x > 1920 - 1920 * s; return [380, 720].map((y, k) => <path key={i + "_" + k} d={`M${x} ${y + 100} Q${x + 4} ${y + 40} ${x + (salted ? 30 : 6)} ${y + (salted ? 70 : 0)}`} stroke={salted ? "#8a7a4a" : "#6a9a3a"} strokeWidth={6} fill="none" />); })}
    </svg>
    <Lbl x={300} y={420} tt={tt} at={0.4} txt="FRESH" size={50} hand={false} col="#bfe8ef" />
    <Lbl x={1640} y={420} tt={tt} at={0.8} txt="SALT ←" size={50} hand={false} col="#9fb8ff" />
    <Lbl x={960} y={140} tt={tt} at={2} txt="a straight canal is a highway for salt water" size={56} />
    <Lbl x={960} y={960} tt={tt} at={4} txt="plants die · roots let go · soil washes out" size={52} col={AMB} />
  </>;
}} />;

// m25 · el ranking de los estudios: tres podios; diques y canales arriba, la nutria abajo de todo
export const HStudyRank: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [["LEVEES · SINKING", 520, 1], ["CANALS", 420, 2], ["STORMS", 300, 3], ["NUTRIA", 120, 4]] as [string, number, number][];
  return <>{R.map(([l, hh, n], i) => { const g = eio(tt, 0.4 + (3 - i) * 0.7, 1.4 + (3 - i) * 0.7); return <div key={i} style={{ position: "absolute", left: 260 + i * 370, bottom: 160, width: 320, textAlign: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: i === 3 ? FUR.replace("7a", "c9") : TX, marginBottom: 14, opacity: g }}>{l}</div>
    <div style={{ height: hh * g, background: i === 3 ? "#7a5236" : `linear-gradient(#5a6a7a,#3a4a5a)`, boxShadow: shadow, borderRadius: "10px 10px 0 0", display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#fff", paddingTop: 10 }}>{n}</div></div>; })}
    <Lbl x={960} y={120} tt={tt} at={3.6} txt="almost every serious study: levees and canals way ahead" size={52} /></>;
}} />;

// m25-26 · el foco en el villano visible: un reflector ilumina a la nutria y el resto (diques, canales) queda en sombra
export const HVillainSpot: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sweep = eio(tt, 3, 5.5);
  const cx = 960 + sweep * 520;
  return <>
    <div style={{ position: "absolute", left: 200, top: 560, width: 480, height: 90, background: "#7a7468" }}><div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#ddd", lineHeight: "90px" }}>LEVEES</div></div>
    <div style={{ position: "absolute", left: 1240, top: 540, width: 480, height: 120, background: "#1f4a56" }}><div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#ddd", lineHeight: "120px" }}>CANALS</div></div>
    <Nutria x={960} y={600} s={1.6} tt={tt} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle 300px at ${cx}px 600px,transparent 0,transparent 70%,rgba(0,0,0,.88) 100%)` }} />
    <Lbl x={960} y={180} tt={tt} at={0.8} txt="the part you could see" size={60} />
    <Lbl x={960} y={900} tt={tt} at={4} txt="the decisions are harder to look at" size={58} col={AMB} />
  </>;
}} />;

// m26-27 · la cañería que rellena: la draga bombea arena y barro y la marisma vuelve a subir; un corte en el dique
export const HPipeRebuild: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const f = eio(tt, 0.6, bt(h, 0, 3)), isl = eio(tt, bt(h, 0, 3), bt(h, 0, 3) + 1.5), cut = eio(tt, bt(h, 1, 5), bt(h, 1, 5) + 1);
  return <>
    <Water tt={tt} top={480} />
    <div style={{ position: "absolute", left: 0, top: 380, width: 1920, height: 100, background: MARSH }} />
    <div style={{ position: "absolute", left: 300, top: 480 + 220 * (1 - f), width: 800, height: 220 * f, background: "linear-gradient(#c9a46a,#a8844a)", borderRadius: "50% 50% 0 0" }} />
    <div style={{ position: "absolute", left: 1000, top: 520, width: 900, height: 40, background: "#555", borderRadius: 20 }} />
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.8 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 1000 - ph * 300, top: 520 + ph * 80, width: 30, height: 30, borderRadius: "50%", background: "#c9a46a", opacity: 1 - ph }} />; })}
    <div style={{ position: "absolute", left: 1380, top: 760, width: 400 * isl, height: 60, borderRadius: 30, background: "#e8d3a0" }} />
    <div style={{ position: "absolute", left: 120, top: 120, width: 600, height: 60, background: "#7a7468", clipPath: `polygon(0 0,${45 - cut * 8}% 0,${45 - cut * 8}% 100%,0 100%,0 0,100% 0,100% 100%,${55 + cut * 8}% 100%,${55 + cut * 8}% 0)` }} />
    <Lbl x={1320} y={150} tt={tt} at={bt(h, 1, 5) as number} txt="let the river's mud back in? fought in court" size={46} />
  </>;
}} />;

// m27-28 · Chesapeake: el perro rastreador cruza la marisma y cada punto rojo se apaga
export const HDogSearch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.4, 6.5);
  const pts = Array.from({ length: 18 }, (_, i) => [200 + rnd(i) * 1500, 220 + rnd(i + 30) * 640]);
  const dx = 200 + p * 1500, dy = 540 + Math.sin(p * 9) * 260;
  return <>
    <div style={{ position: "absolute", left: 160, top: 160, width: 1600, height: 760, background: `repeating-linear-gradient(80deg,${MARSH} 0 8px,#7f8a3a 8px 16px)`, boxShadow: shadow }} />
    {pts.map(([x, y], i) => { const gone = Math.hypot(x - dx, y - dy) < 220 || x < dx - 100; return <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: "50%", background: gone ? "transparent" : RED, border: `4px solid ${gone ? GRN : RED}`, opacity: gone ? 0.6 : 1 }} />; })}
    <svg width={160} height={110} viewBox="0 0 160 110" style={{ position: "absolute", left: dx - 80, top: dy - 55 }}><ellipse cx={70} cy={60} rx={56} ry={26} fill="#3a2a1a" /><circle cx={130} cy={44} r={20} fill="#3a2a1a" /><path d="M140 30 L150 14" stroke="#3a2a1a" strokeWidth={8} /><path d="M16 50 Q0 30 6 20" stroke="#3a2a1a" strokeWidth={8} fill="none" />
      {[30, 50, 90, 110].map((lx, i) => <rect key={i} x={lx} y={78} width={8} height={26 + 4 * Math.sin(tt * 12 + i)} fill="#3a2a1a" />)}</svg>
    <Lbl x={960} y={90} tt={tt} at={0.6} txt="Maryland · Chesapeake Bay · trained dogs & traps" size={52} />
    <Lbl x={960} y={990} tt={tt} at={4.8} txt="start early and keep at it" size={56} col={AMB} />
  </>;
}} />;

// m29 · las marcas de marea en el pilote: cada año es una raya pintada en el poste que el agua va tapando
export const HTideMarks: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [["1927", "flood → levees"], ["1930s", "fur farms"], ["1938", "first 20 bought"], ["1940s–50s", "weed eaters · canals"], ["1976", "1.8M pelts"], ["late 80s", "fur market falls"], ["1990s", "~100K acres eaten"], ["2002", "tail bounty"], ["2005", "Katrina & Rita"], ["today", "master plan · river fight"]];
  const at = [0.3, ...Array.from({ length: 9 }, (_, i) => bt(h, i, 1.4 + i * 1.5))];
  const n = Y.filter((_, i) => tt > at[i]).length;
  return <>
    <Water tt={tt} top={1000 - n * 80} />
    <div style={{ position: "absolute", left: 300, top: 40, width: 80, height: 1040, background: "linear-gradient(90deg,#5a3a20,#8a6a40,#5a3a20)" }} />
    {Y.map(([y, d], i) => { const o = pop(tt, at[i], 8, 0.45); return <div key={i} style={{ position: "absolute", left: 300, top: 940 - i * 92, display: "flex", alignItems: "center", opacity: cl(o * 2) }}>
      <div style={{ width: 80, height: 10, background: i === 9 ? GRN : "#f3ead6" }} /><div style={{ width: 60 * o, height: 3, background: DIM }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: TX, width: 230, marginLeft: 10 }}>{y}</div><div style={{ fontFamily: HAND, fontSize: 42, color: AMB }}>{d}</div></div>; })}
  </>;
}} />;

// m30 · el árbol familiar: la nutria NO va con las ratas; va con el cuis y el puercoespín
export const HFamilyTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = eio(tt, 0.6, 2.4), move = eio(tt, 2.6, 3.8);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M960 920 L960 640 M960 640 L520 420 M960 640 L1400 420" stroke={DIM} strokeWidth={8} fill="none" strokeDasharray={1200} strokeDashoffset={1200 * (1 - s)} /></svg>
    {[["RATS & MICE", 520, 300], ["GUINEA PIGS · PORCUPINES", 1400, 300]].map(([l, x, y], i) => <div key={i} style={{ position: "absolute", left: x as number, top: y as number, transform: `translate(-50%,-50%) scale(${pop(tt, 1 + i * 0.4)})`, padding: "18px 30px", background: PAPER, boxShadow: shadow, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: INK, whiteSpace: "nowrap" }}>{l as string}</div>)}
    <Nutria x={520 + move * 880} y={500 - Math.sin(move * Math.PI) * 160} s={1.1} tt={tt} />
    <Lbl x={960} y={960} tt={tt} at={4} txt="a large rodent — not a rat" size={60} col={AMB} />
  </>;
}} />;

// m31 · el mensaje en la botella: el repaso se desenrolla línea por línea
export const HBottleMessage: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = ["1930s: fur farms bring the nutria", "turned loose on purpose — fur, weeds", "40 years of trapping held the marsh", "fur collapsed → eat-outs → mud", "a tail bounty brought it way down", "but 2,000 sq mi: levees & canals"];
  const u = eio(tt, 0.4, 1.6);
  return <>
    <svg width={500} height={260} viewBox="0 0 500 260" style={{ position: "absolute", left: 120, top: 420, transform: `rotate(-14deg) translateX(${-u * 60}px)` }}><path d="M20 80 Q20 40 60 40 L330 40 Q360 40 380 70 L460 90 L460 170 L380 190 Q360 220 330 220 L60 220 Q20 220 20 180 Z" fill="rgba(160,210,190,.35)" stroke="#bfe0d0" strokeWidth={6} /><rect x={458} y={98} width={30} height={64} fill="#8a6a40" /></svg>
    <div style={{ position: "absolute", left: 640, top: 140, width: 1080, height: 140 + 680 * u, background: "linear-gradient(#efe2c0,#dccaa0)", boxShadow: shadow, overflow: "hidden", padding: "40px 60px", borderRadius: 10 }}>
      {L.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 52, color: "#3a2a1a", marginBottom: 22, opacity: cl(pop(tt, 1.6 + i * 1.6) * 2), transform: `translateX(${(1 - pop(tt, 1.6 + i * 1.6)) * 60}px)` }}>{l}</div>)}</div>
  </>;
}} />;

// m32 · la frase: la etiqueta de recompensa se pega en la cola… y no hay dónde pegarla en la decisión
export const HBountyDecision: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const a = pop(tt, 0.6, 7, 0.45), b = eio(tt, 3, 4.4);
  return <>
    <div style={{ position: "absolute", left: 360, top: 360, width: 440, height: 30, borderRadius: 15, background: "#4a3a2e" }} />
    <div style={{ position: "absolute", left: 440, top: 230, width: 300, height: 120, background: MANILA, transform: `rotate(-6deg) scale(${a})`, boxShadow: shadow, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK, textAlign: "center", lineHeight: "120px" }}>BOUNTY</div>
    <div style={{ position: "absolute", left: 1080, top: 280, width: 560, height: 360, background: "#fbf7ec", boxShadow: shadow, padding: 40, fontFamily: HAND, fontSize: 50, color: INK, transform: "rotate(2deg)" }}>DECISION<div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#7a6a4a", marginTop: 20 }}>levees · canals · fur trade</div></div>
    <div style={{ position: "absolute", left: 1160 + (1 - b) * 400, top: 520 + (1 - b) * -300, width: 260, height: 100, background: MANILA, opacity: 0.9 * b, transform: `rotate(${(1 - b) * 40 - 4}deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK, textAlign: "center", lineHeight: "100px" }}>BOUNTY</div>
    <svg width={300} height={300} style={{ position: "absolute", left: 1240, top: 440, opacity: cl((b - 0.8) * 5) }}><line x1={20} y1={20} x2={280} y2={280} stroke={RED} strokeWidth={18} /><line x1={280} y1={20} x2={20} y2={280} stroke={RED} strokeWidth={18} /></svg>
    <Lbl x={960} y={860} tt={tt} at={4.6} txt="you can't put a bounty on a decision" size={62} col={AMB} />
  </>;
}} />;

export const HCD: Record<string, React.FC<{ t: number; h: H }>> = {
  trapLine: HTrapLine, peltBoard: HPeltBoard, marshHoles: HMarshHoles, tailTag: HTailTag, pieSlice: HPieSlice, incisors: HIncisors, litterTree: HLitterTree,
  coatRack: HCoatRack, penMap: HPenMap, hurricanePen: HHurricanePen, mythCheck: HMythCheck, manyHands: HManyHands, hyacinthDitch: HHyacinthDitch, crateShip: HCrateShip,
  harvestBars: HHarvestBars, stiltCamp: HStiltCamp, trapCount: HTrapCount, stretchBoards: HStretchBoards, seesawMusk: HSeesawMusk, adaptSign: HAdaptSign,
  checkValve: HCheckValve, priceTag: HPriceTag, gasCan: HGasCan, eatOut: HEatOut, aerialGrid: HAerialGrid, tailBounty: HTailBounty, acresFall: HAcresFall,
  recipeCard: HRecipeCard, delawareOverlay: HDelawareOverlay, riverFan: HRiverFan, floodRoof: HFloodRoof, leveeChute: HLeveeChute, rigCanal: HRigCanal,
  saltWedge: HSaltWedge, studyRank: HStudyRank, villainSpot: HVillainSpot, pipeRebuild: HPipeRebuild, dogSearch: HDogSearch, tideMarks: HTideMarks,
  familyTree: HFamilyTree, bottleMessage: HBottleMessage, bountyDecision: HBountyDecision,
};
