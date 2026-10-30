// ruth29c «Boll Weevil» · componentes únicos (uno por minuto), ninguno repite mecanismo de ruth29a / ruth29b.
// Algodón, deudas y veneno: cada pieza es un objeto que se entiende sin leer y cuenta lo que se dice en ese segundo.
import React from "react";
import { H, cl, eio, eIn, TX, DIM, AMB, RED, GRN, MARK, HAND } from "./hkit";
import { FONT } from "./lib";
import { pop, At, Stamp, PAPER, MANILA, INK } from "./ruth_a";
import { S, bt, shadow, rnd, Lbl } from "./ruth_b";

const COT = "#f7f3ea", LEAF = "#5f7f3a", BOLLG = "#7a9a46";
// gorgojo (vista lateral): cuerpo oval, hocico largo, patas que caminan
const Weevil: React.FC<{ x: number; y: number; s?: number; r?: number; tt?: number; col?: string; o?: number }> = ({ x, y, s = 1, r = 0, tt = 0, col = "#6b5236", o = 1 }) => <svg width={120} height={80} viewBox="-60 -40 120 80" style={{ position: "absolute", left: x - 60, top: y - 40, transform: `rotate(${r}deg) scale(${s})`, opacity: o, overflow: "visible" }}>
  {[-18, 0, 18].map((lx, i) => <path key={i} d={`M${lx} 8 l${-6 + 8 * Math.sin(tt * 14 + i * 2)} 18`} stroke="#3a2a1a" strokeWidth={3} />)}
  <ellipse cx={0} cy={0} rx={30} ry={18} fill={col} /><ellipse cx={-6} cy={-6} rx={14} ry={6} fill="rgba(255,255,255,.18)" />
  <circle cx={34} cy={-4} r={9} fill={col} /><path d="M40 -2 L62 10" stroke={col} strokeWidth={5} strokeLinecap="round" /><path d="M48 2 l2 -12 M52 4 l4 -10" stroke="#3a2a1a" strokeWidth={2} />
</svg>;
// mota de algodón abierta (5 lóbulos blancos sobre cáliz marrón)
const Boll: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => <svg width={100} height={100} viewBox="-50 -50 100 100" style={{ position: "absolute", left: x - 50, top: y - 50, transform: `scale(${s})`, opacity: o, overflow: "visible" }}>
  {[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0 0 L-14 -40 L14 -40 Z" fill="#6b4a2c" transform={`rotate(${a + 36})`} />)}
  {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={22 * Math.cos((a - 90) / 57.3)} cy={22 * Math.sin((a - 90) / 57.3)} r={20} fill={COT} />)}
</svg>;
const Bale: React.FC<{ x: number; y: number; s?: number; o?: number; col?: string }> = ({ x, y, s = 1, o = 1, col = "#efe7d4" }) => <div style={{ position: "absolute", left: x, top: y, width: 110 * s, height: 140 * s, opacity: o, background: `linear-gradient(90deg,#d8ccb2,${col},#d8ccb2)`, borderRadius: 8 * s, boxShadow: "0 12px 20px rgba(0,0,0,.4)" }}>
  {[0.25, 0.5, 0.75].map((f) => <div key={f} style={{ position: "absolute", left: 0, right: 0, top: `${f * 100}%`, height: 4 * s, background: "#7a6a4a" }} />)}</div>;

// m0 · la mota que se abre con la uña: adentro, donde debía estar la fibra, una larva gorda comiendo
export const HBollSplit: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const o = eio(tt, 1.2, 2.6), ch = Math.sin(tt * 9) * 2;
  return <>
    <div style={{ position: "absolute", left: 960 - 260 - o * 120, top: 300, width: 260, height: 460, borderRadius: "260px 0 0 260px", background: `radial-gradient(circle at 80% 50%,#f3f0dc,${BOLLG} 60%,#4f6a2a)`, transform: `rotate(${-o * 14}deg)`, transformOrigin: "100% 50%", boxShadow: shadow }} />
    <div style={{ position: "absolute", left: 960 + o * 120, top: 300, width: 260, height: 460, borderRadius: "0 260px 260px 0", background: `radial-gradient(circle at 20% 50%,#f3f0dc,${BOLLG} 60%,#4f6a2a)`, transform: `rotate(${o * 14}deg)`, transformOrigin: "0 50%", boxShadow: shadow }} />
    <svg width={260} height={160} viewBox="0 0 260 160" style={{ position: "absolute", left: 830, top: 460, opacity: o, transform: `scale(${0.6 + 0.4 * o}) translateY(${ch}px)` }}>
      {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={40 + i * 28} cy={80 + 10 * Math.sin(i + tt * 3)} rx={26} ry={34 - Math.abs(i - 3) * 3} fill="#fbf6e8" stroke="#e0d6bc" strokeWidth={2} />)}
      <circle cx={232} cy={80} r={18} fill="#a8742a" /></svg>
    <Lbl x={960} y={150} tt={tt} at={0.5} txt="Mississippi Delta · July 1922" size={58} />
    <Lbl x={960} y={860} tt={tt} at={3.4} txt="where the fiber should be: a grub, eating" size={58} col={AMB} />
  </>;
}} />;

// m0-1 · el Cinturón del Algodón se tiñe de oeste a este bajo una ola de gorgojos
export const HBeltSweep: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.6, 7);
  const ST = ["TX", "LA", "MS", "AL", "GA", "SC"];
  return <>
    <div style={{ position: "absolute", left: 160, top: 300, display: "flex", gap: 12 }}>
      {ST.map((s, i) => { const on = cl(p * 7 - i); return <div key={s} style={{ width: 250, height: i === 0 ? 420 : 300 + (i % 2) * 40, background: `linear-gradient(${on > 0.5 ? "#7a4a2a" : "#d8ccb2"},${on > 0.5 ? "#4a2a14" : "#b8a888"})`, borderRadius: 14, boxShadow: shadow, position: "relative", transform: `translateY(${(1 - pop(tt, 0.1 + i * 0.08)) * 500}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: on > 0.5 ? "#f3ead6" : INK }}>{s}</div>
        {on > 0 && Array.from({ length: 6 }, (_, k) => <Weevil key={k} x={60 + (k % 3) * 70} y={140 + Math.floor(k / 3) * 90} s={0.7 * on} tt={tt} r={-10 + k * 7} />)}</div>; })}
    </div>
    <Lbl x={960} y={150} tt={tt} at={1} txt="Texas → the Carolinas · by the 1920s" size={60} />
  </>;
}} />;

// m1 · adelanto: la silueta de una estatua con un signo de pregunta, en medio de una calle principal
export const HStatueTease: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const r = eio(tt, 0.4, 3.2);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 320, background: "linear-gradient(#4a4a4a,#2a2a2a)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, height: 12, background: "repeating-linear-gradient(90deg,#e8d080 0 80px,transparent 80px 160px)" }} />
    <div style={{ position: "absolute", left: 860, top: 640, width: 200, height: 130, background: "#8a8478", boxShadow: shadow }} />
    <svg width={260} height={520} viewBox="0 0 260 520" style={{ position: "absolute", left: 830, top: 640 - 520 * r, clipPath: `inset(0 0 ${(1 - r) * 0}% 0)` }}><path d="M130 40 L130 30 M100 60 Q130 20 160 60 L170 110 L210 20 L225 30 L180 140 L170 300 L190 520 L70 520 L90 300 L80 140 Q60 110 100 60 Z" fill="#1a1a1a" />
      <circle cx={130} cy={40} r={26} fill="#1a1a1a" /><ellipse cx={218} cy={14} rx={24} ry={14} fill="#1a1a1a" /></svg>
    <div style={{ position: "absolute", left: 1150, top: 260, fontFamily: MARK, fontSize: 260, color: AMB, transform: `scale(${pop(tt, 2.8, 8, 0.35)}) rotate(8deg)` }}>?</div>
    <Lbl x={960} y={130} tt={tt} at={1.4} txt="a town in Alabama thanked the bug" size={62} />
  </>;
}} />;

// m1-2 · papeles con aros de café: boletines, registros, actas de audiencias, cada aro cae con el papel
export const HCoffeeRings: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const D = [["CROP BULLETIN Nº 44", -8, 380, 300], ["COUNTY RECORDS · 1923", 6, 980, 260], ["HEARING · COTTON PESTS", -3, 680, 520]] as [string, number, number, number][];
  return <>{D.map(([l, r, x, y], i) => { const s = pop(tt, 0.3 + i * 0.7, 7, 0.5), ring = eio(tt, 1 + i * 0.7, 1.8 + i * 0.7); return <div key={i} style={{ position: "absolute", left: x, top: y, width: 600, height: 420, background: PAPER, boxShadow: shadow, transform: `rotate(${r}deg) translateY(${(1 - s) * -700}px)` }}>
    <div style={{ padding: "30px 40px", fontFamily: FONT, fontWeight: 900, fontSize: 38, color: INK }}>{l}</div>
    {Array.from({ length: 7 }, (_, k) => <div key={k} style={{ margin: "14px 40px", height: 8, width: `${60 + rnd(k + i * 9) * 35}%`, background: "rgba(42,33,24,.25)" }} />)}
    <div style={{ position: "absolute", right: 60 + i * 30, bottom: 40, width: 150, height: 150, borderRadius: "50%", border: `${10 * ring}px solid rgba(120,70,30,${0.45 * ring})`, boxShadow: `inset 0 0 12px rgba(120,70,30,${0.3 * ring})` }} /></div>; })}
    <Lbl x={960} y={120} tt={tt} at={2.8} txt="the reports nobody else reads" size={58} /></>;
}} />;

// m2 · la telaraña del algodón: el fardo en el centro y todo cuelga de él (banco, almacén, valor de la tierra)
export const HCottonWeb: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = [["BANK LOANS", 420, 260, 0.6], ["STORE CREDIT", 1500, 300, bt(h, 0, 2.5)], ["LAND VALUE", 960, 880, bt(h, 1, 4.5)]] as [string, number, number, number][];
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{N.map(([, x, y, d], i) => { const l = eio(tt, d, d + 0.8); return <line key={i} x1={960} y1={540} x2={960 + (x - 960) * l} y2={540 + (y - 540) * l} stroke={AMB} strokeWidth={6} strokeDasharray="14 10" />; })}</svg>
    <Bale x={960 - 110} y={540 - 140} s={2} />
    {N.map(([l, x, y, d], i) => { const s = pop(tt, d + 0.6, 8, 0.4); return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, padding: "18px 30px", background: MANILA, boxShadow: shadow, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK, whiteSpace: "nowrap" }}>{l}</div>; })}
    <Lbl x={960} y={110} tt={tt} at={0.4} txt="the South was cotton · almost entirely" size={58} />
  </>;
}} />;

// m2-3 · el libro del almacén: lo que la familia «debe» se resta del algodón hasta dejar CERO
export const HStoreLedger: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [["house, seed, a mule", "advanced", 0.4], ["credit at the store", "advanced", 1.2], ["crop split at harvest", "½ to the owner", bt(h, 0, 2.6)], ["what they said was owed", "deducted", bt(h, 0, 2.6) + 0.9]] as [string, string, number][];
  const z = pop(tt, bt(h, 1, 5), 8, 0.35);
  return <At x={960} y={560} rx={18}>
    <div style={{ width: 1200, height: 800, background: "linear-gradient(#efe6cf,#ddd0b0)", boxShadow: shadow, padding: "50px 70px", backgroundImage: "repeating-linear-gradient(0deg,transparent 0 59px,rgba(80,110,160,.35) 59px 61px)", position: "relative" }}>
      <div style={{ fontFamily: MARK, fontSize: 64, color: "#5a2a1a" }}>COMMISSARY LEDGER</div>
      {R.map(([a, b, d], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: 30, fontFamily: HAND, fontSize: 50, color: "#22314f", opacity: cl(pop(tt, d) * 2) }}><span>{a}</span><span style={{ color: "#8a2a1a" }}>{b}</span></div>)}
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 150, borderTop: "4px solid #22314f" }} />
      <div style={{ position: "absolute", right: 80, bottom: 40, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: RED, transform: `scale(${z})` }}>$0.00</div>
      <div style={{ position: "absolute", left: 70, bottom: 60, fontFamily: HAND, fontSize: 48, color: "#22314f", opacity: cl(z * 2) }}>family's year:</div>
    </div>
  </At>;
}} />;

// m3 · sin piso: la familia parada sobre un piso de tablas; el algodón falla y las tablas caen una a una
export const HNoFloor: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fall = (i: number) => eIn(tt, 2 + i * 0.35, 3 + i * 0.35);
  return <>
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 460 + i * 128, top: 640 + fall(i) * 600, width: 120, height: 40, background: "linear-gradient(#a8743a,#7a4a20)", transform: `rotate(${fall(i) * (i % 2 ? 40 : -50)}deg)`, boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} />)}
    {[[700, 1], [860, 0.75], [980, 0.55], [1150, 1]].map(([x, s], i) => <svg key={i} width={120} height={300} style={{ position: "absolute", left: x - 60, top: 640 - 300 * s, transform: `scale(${s})`, transformOrigin: "50% 100%" }}><circle cx={60} cy={40} r={30} fill="#3a2f28" /><path d="M20 300 L30 90 Q60 70 90 90 L100 300 Z" fill="#4a3f36" /></svg>)}
    <Lbl x={960} y={150} tt={tt} at={0.6} txt="one crop · credit to the next harvest · no savings" size={54} />
    <Lbl x={960} y={860} tt={tt} at={3.6} txt="no floor underneath anybody" size={64} col={AMB} />
  </>;
}} />;

// m4 · el ciclo del gorgojo: pimpollo → huevo → larva → adulto, una rueda que gira y se acelera
export const HLifeCycle: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [["bud · a hole", 0.3], ["egg inside", 1.2], ["grub eats it", bt(h, 0, 2.6)], ["new adult", bt(h, 1, 4.4)]] as [string, number][];
  const spin = eio(tt, 0.3, 5) * 270 + Math.max(0, tt - 5) * 40;
  return <>
    <svg width={900} height={900} viewBox="-450 -450 900 900" style={{ position: "absolute", left: 510, top: 90 }}>
      <circle r={330} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={8} strokeDasharray="20 16" transform={`rotate(${spin})`} />
      {P.map(([, d], i) => { const a = (i * 90 - 90) / 57.3, s = pop(tt, d, 8, 0.4); return <g key={i} transform={`translate(${330 * Math.cos(a)} ${330 * Math.sin(a)}) scale(${s})`}><circle r={90} fill={i === 3 ? "#6b5236" : i === 2 ? "#fbf6e8" : i === 1 ? "#f3ead6" : BOLLG} stroke="#2a2118" strokeWidth={6} />
        {i === 1 && <ellipse rx={20} ry={28} fill="#fff" stroke="#cbbf9e" strokeWidth={3} />}{i === 0 && <circle cx={20} cy={-20} r={10} fill="#3a2a1a" />}</g>; })}
      <text textAnchor="middle" y={20} fontFamily={FONT} fontWeight={900} fontSize={60} fill={TX}>{Math.min(4, 1 + Math.floor(spin / 90))} / summer</text>
    </svg>
    {P.map(([l, d], i) => { const a = (i * 90 - 90) / 57.3; return <Lbl key={i} x={960 + 470 * Math.cos(a) * 1.15} y={540 + 470 * Math.sin(a) - 30} tt={tt} at={d + 0.3} txt={l} size={44} />; })}
    <Weevil x={960} y={340} s={1.2} tt={tt} o={cl(pop(tt, bt(h, 1, 4.4)))} />
  </>;
}} />;

// m4-5 · una pareja se vuelve millones: los gorgojos se duplican y tapan la pantalla
export const HWeevilMultiply: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = Math.min(9, Math.floor(eio(tt, 0.5, 6.5) * 10)), n = Math.pow(2, g + 1);
  return <>
    {Array.from({ length: Math.min(n, 420) }, (_, i) => <Weevil key={i} x={960 + (rnd(i) - 0.5) * Math.min(1800, 200 + i * 6)} y={540 + (rnd(i + 99) - 0.5) * Math.min(1000, 150 + i * 4)} s={Math.max(0.25, 1.4 - g * 0.13)} r={rnd(i + 3) * 360} tt={tt + i} />)}
    <div style={{ position: "absolute", left: 960, top: 80, transform: "translateX(-50%)", padding: "12px 36px", background: "rgba(10,8,6,.75)", borderRadius: 12, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: TX }}>{g >= 9 ? "MILLIONS" : n.toLocaleString("en-US")}</div>
    <Lbl x={960} y={940} tt={tt} at={3} txt="several generations in one summer" size={56} />
  </>;
}} />;

// m5 · el cruce del río Bravo: el gorgojo vuela la línea de la frontera, 1892
export const HRiverCross: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 1, 4.5), y = 560 - Math.sin(p * Math.PI) * 140;
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(90deg,#c9a46a 0 44%,#3a7aa0 44% 56%,#b9b07a 56%)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${860 + (tt * 40 + i * 30) % 200} ${i * 140} q20 30 0 60`} stroke="rgba(255,255,255,.35)" strokeWidth={4} fill="none" />)}</svg>
    <div style={{ position: "absolute", left: 240, top: 120, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#4a2a10" }}>MEXICO</div><div style={{ position: "absolute", right: 200, top: 120, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#2a3a10" }}>TEXAS</div>
    <Weevil x={400 + p * 1100} y={y} s={2.4} r={-10 + p * 20} tt={tt} />
    <Lbl x={960} y={860} tt={tt} at={2.5} txt="the Rio Grande near Brownsville · 1892" size={60} />
    <Lbl x={1460} y={700} tt={tt} at={4.5} txt="40–160 miles a year" size={50} col={AMB} />
  </>;
}} />;

// m5-6 · los estados caen como fichas de dominó, cada una con su año
export const HStateDominoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const D = [["LA", "1903", 0.6], ["MS", "1907", bt(h, 0, 1.8)], ["AL", "1909", bt(h, 1, 3)], ["GA", "1915", bt(h, 2, 4.2)], ["SC", "~1917", bt(h, 3, 5.4)]] as [string, string, number][];
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 780, height: 30, background: "linear-gradient(#6b4a2c,#3a2a1a)" }} />
    {D.map(([s, y, d], i) => { const f = eIn(tt, d, d + 0.55); return <div key={i} style={{ position: "absolute", left: 300 + i * 290, top: 360, width: 160, height: 420, transformOrigin: "100% 100%", transform: `rotate(${f * 72}deg)`, background: "linear-gradient(#f3ead6,#d8ccb2)", borderRadius: 12, boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: INK }}>{s}</div><div style={{ width: 120, height: 6, background: INK }} /><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#8a2a1a" }}>{y}</div></div>; })}
    <Weevil x={180 + Math.min(5, D.filter(([, , d]) => tt > d).length) * 290} y={300} s={1.3} tt={tt} />
  </>;
}} />;

// m6 · Georgia: la pila de fardos de 1914 se desarma hasta quedar un cuarto en 1923
export const HBaleShrink: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const k = eio(tt, bt(h, 0, 2.5), bt(h, 0, 2.5) + 2.5), v = (2.8 - 2.2 * k).toFixed(1);
  return <>
    {Array.from({ length: 28 }, (_, i) => { const gone = i >= 7 && rnd(i) < k * 1.15; const col = i % 7, row = Math.floor(i / 7); return <Bale key={i} x={340 + col * 130} y={760 - row * 150 - (gone ? -400 : 0) * eIn(k, 0, 1)} o={gone ? 1 - k : cl(pop(tt, 0.1 + i * 0.04) * 2)} />; })}
    <div style={{ position: "absolute", left: 1320, top: 300, fontFamily: FONT, fontWeight: 900, color: TX }}>
      <div style={{ fontSize: 60, color: DIM }}>GEORGIA</div><div style={{ fontSize: 150 }}>{k > 0.98 ? "0.6" : v}M</div><div style={{ fontSize: 50, color: DIM }}>bales · {k > 0.5 ? "1923" : "1914"}</div></div>
    <Lbl x={1460} y={720} tt={tt} at={bt(h, 1, 5.5)} txt="3 of every 4 bales · gone" size={58} col={AMB} />
  </>;
}} />;

// m7 · la cerca de los vecinos: cabezas que se asoman a mirar el campo de demostración
export const HFenceWatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 560, background: `repeating-linear-gradient(90deg,${LEAF} 0 30px,#4f6a2a 30px 60px)` }}>
    {Array.from({ length: 24 }, (_, i) => <Boll key={i} x={40 + (i % 12) * 160} y={160 + Math.floor(i / 12) * 220} s={0.8 * pop(tt, 1 + i * 0.05)} />)}</div>
  {Array.from({ length: 7 }, (_, i) => { const up = eio(tt, 1.6 + i * 0.3, 2.2 + i * 0.3); return <svg key={i} width={140} height={200} style={{ position: "absolute", left: 220 + i * 230, top: 760 - 110 * up }}><circle cx={70} cy={60} r={44} fill={["#5a3a28", "#e0b48a", "#3a2a1a", "#c99a70"][i % 4]} /><path d="M10 50 Q70 -10 130 50 Z" fill={i % 2 ? "#a88a50" : "#6b5a3a"} /><rect x={4} y={44} width={132} height={10} rx={5} fill={i % 2 ? "#8a6a30" : "#4a3a28"} /></svg>; })}
  <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 320, background: "repeating-linear-gradient(90deg,#8a6a40 0 40px,#6b4a2c 40px 46px)" }}><div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 26, background: "#5a3a20" }} /><div style={{ position: "absolute", left: 0, right: 0, top: 180, height: 26, background: "#5a3a20" }} /></div>
  <Lbl x={960} y={70} tt={tt} at={0.6} txt="Terrell, Texas · 1903 · a demonstration farm" size={56} />
  <Lbl x={960} y={900} tt={tt} at={4} txt="the neighbors could watch" size={60} col={AMB} />
</>} />;

// m7-8 · la carrera: la curva del algodón (motas) contra la curva del gorgojo; plantar antes gana
export const HRaceClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.4, 3.4);
  const pts = (f: (x: number) => number) => Array.from({ length: 41 }, (_, i) => `${200 + i * 30 * p},${f(i / 40)}`).join(" ");
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={200} y1={820} x2={1440} y2={820} stroke={DIM} strokeWidth={4} /><text x={1440} y={870} textAnchor="end" fontFamily={FONT} fontSize={36} fill={DIM}>SUMMER →</text>
      <polyline points={pts((x) => 820 - 560 / (1 + Math.exp(-14 * (x - 0.35))))} stroke={COT} strokeWidth={10} fill="none" />
      <polyline points={pts((x) => 820 - 600 / (1 + Math.exp(-12 * (x - 0.62))))} stroke="#a8742a" strokeWidth={10} fill="none" strokeDasharray="20 12" />
    </svg>
    <Lbl x={560} y={240} tt={tt} at={1.6} txt="plant early, ripen fast" size={50} col={COT} />
    <Lbl x={1240} y={560} tt={tt} at={2.4} txt="weevils build up" size={50} col="#e8b070" />
    {[["burn the old stalks", bt(h, 0, 4)], ["grow corn · raise hogs · feed the family", bt(h, 1, 5.6)]].map(([l, d], i) => <div key={i} style={{ position: "absolute", left: 1500, top: 300 + i * 220, width: 380, padding: "20px 26px", background: PAPER, boxShadow: shadow, fontFamily: HAND, fontSize: 44, color: INK, transform: `rotate(${i ? 2 : -3}deg) scale(${pop(tt, d as number)})` }}>{l}</div>)}
  </>;
}} />;

// m8-9 · la insignia del agente del condado: nace el Servicio de Extensión (1914) de la demostración de Knapp
export const HAgentBadge: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.5, 6, 0.4), shine = (tt * 0.6) % 2;
  return <>
    <div style={{ position: "absolute", left: 960 - 300, top: 540 - 300, width: 600, height: 600, borderRadius: "50%", transform: `scale(${s}) rotateY(${(1 - s) * 180}deg)`, background: "radial-gradient(circle at 35% 30%,#f3e2a0,#b8902a 60%,#7a5a14)", boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "18px solid #8a6a1a" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#3a2a08", letterSpacing: 4 }}>COUNTY AGENT</div>
      <Boll x={300} y={300} s={1.4} /><div style={{ marginTop: 160, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#3a2a08" }}>EXTENSION SERVICE</div>
      <div style={{ position: "absolute", left: -300 + shine * 600, top: -100, width: 120, height: 900, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)", transform: "rotate(20deg)" }} /></div>
    <Stamp tt={tt} at={2.6} txt="CONGRESS · 1914" x={1450} y={300} r={10} size={64} />
    <Lbl x={960} y={960} tt={tt} at={3.6} txt="it came out of the boll weevil" size={58} />
  </>;
}} />;

// m9-10 · todos señalan el mismo cartel ALGODÓN: terrateniente, banco, almacén; la mano del inquilino queda chica
export const HHandsPoint: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const W = [["LANDLORD", 300, 0.3], ["BANK", 960, bt(h, 0, 1.8)], ["STORE", 1620, bt(h, 1, 3.3)]] as [string, number, number][];
  return <>
    <div style={{ position: "absolute", left: 960, top: 140, transform: `translateX(-50%) scale(${pop(tt, 0.1)})`, padding: "26px 70px", background: "#f3ead6", boxShadow: shadow, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: INK, letterSpacing: 6 }}>COTTON</div>
    {W.map(([l, x, d], i) => { const s = eio(tt, d, d + 0.6); return <div key={i} style={{ position: "absolute", left: x, top: 820 - 360 * s, transform: "translateX(-50%)", textAlign: "center" }}>
      <svg width={120} height={260} viewBox="0 0 120 260" style={{ transform: `rotate(${(960 - x) / 30}deg)` }}><rect x={40} y={60} width={40} height={200} rx={16} fill="#c99a70" /><rect x={50} y={0} width={20} height={80} rx={10} fill="#c99a70" /><rect x={30} y={100} width={60} height={160} fill="#3a3f4a" /></svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: TX, opacity: cl(s * 2) }}>{l}</div></div>; })}
    <div style={{ position: "absolute", left: 640, top: 900, transform: `scale(${pop(tt, bt(h, 2, 4.8))})`, fontFamily: HAND, fontSize: 48, color: AMB }}>the tenant: didn't own the land</div>
  </>;
}} />;

// m10 · el matraz del laboratorio de Tallulah: polvo blanco y la calavera en la etiqueta
export const HLabFlask: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fill = eio(tt, 0.6, 3), lab = pop(tt, 2.4, 7, 0.45);
  return <>
    <svg width={600} height={760} viewBox="0 0 600 760" style={{ position: "absolute", left: 660, top: 180 }}>
      <defs><clipPath id="fl"><path d="M240 40 L360 40 L360 260 L560 700 Q570 740 520 740 L80 740 Q30 740 40 700 L240 260 Z" /></clipPath></defs>
      <g clipPath="url(#fl)"><rect x={0} y={740 - 420 * fill} width={600} height={420} fill="#efeee8" />{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={60 + rnd(i) * 480} cy={740 - 420 * fill + rnd(i + 4) * 40 - (tt * 30 + i * 9) % 60} r={4} fill="#fff" opacity={0.7} />)}</g>
      <path d="M240 40 L360 40 L360 260 L560 700 Q570 740 520 740 L80 740 Q30 740 40 700 L240 260 Z" fill="rgba(200,230,240,.12)" stroke="#d8e8ee" strokeWidth={10} />
      <g transform={`translate(300 520) scale(${lab})`}><rect x={-170} y={-90} width={340} height={180} rx={10} fill={PAPER.includes("gradient") ? "#efe4c8" : PAPER} stroke={INK} strokeWidth={4} />
        <circle cx={-100} cy={-10} r={34} fill={INK} /><rect x={-120} y={20} width={40} height={20} fill={INK} /><circle cx={-112} cy={-14} r={8} fill="#efe4c8" /><circle cx={-88} cy={-14} r={8} fill="#efe4c8" />
        <text x={-50} y={-10} fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>CALCIUM</text><text x={-50} y={30} fontFamily={FONT} fontWeight={900} fontSize={34} fill={INK}>ARSENATE</text></g>
    </svg>
    <Lbl x={1500} y={300} tt={tt} at={1} txt="Tallulah, Louisiana · ~1916" size={50} />
    <Lbl x={1500} y={380} tt={tt} at={3.6} txt="arsenic" size={90} col={RED} hand={false} />
  </>;
}} />;

// m11 · el fuelle a mano: cada apretón suelta una nube que cae sobre las plantas… y sobre quien camina el surco
export const HHandDuster: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const pump = Math.max(0, Math.sin(tt * 3)), x = 300 + eio(tt, 0.3, 8) * 900;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 440, background: `repeating-linear-gradient(90deg,#6b4a2c 0 60px,${LEAF} 60px 150px)` }} />
    {Array.from({ length: 12 }, (_, i) => <Boll key={i} x={100 + i * 150} y={640} s={0.9} />)}
    <svg width={260} height={420} viewBox="0 0 260 420" style={{ position: "absolute", left: x - 130, top: 300 }}><circle cx={130} cy={50} r={36} fill="#3a2f28" /><path d="M90 420 L100 110 Q130 90 160 110 L170 420 Z" fill="#5a4f46" />
      <g transform={`translate(180 200) rotate(${-10 + pump * 10})`}><path d={`M0 0 L${60 - pump * 20} -20 L${60 - pump * 20} 40 Z`} fill="#8a5a32" /><rect x={50} y={4} width={80} height={12} fill="#555" /></g></svg>
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.7 + i / 16) % 1; return <div key={i} style={{ position: "absolute", left: x + 140 + ph * 300 - 60, top: 400 + ph * 240 - 160 * ph * (1 - ph), width: 80 + ph * 180, height: 60 + ph * 120, borderRadius: "50%", background: "radial-gradient(rgba(245,245,240,.8),rgba(245,245,240,0))", opacity: 1 - ph }} />; })}
    <Lbl x={960} y={120} tt={tt} at={1.2} txt="on the cotton, on the ground, on the people" size={60} />
  </>;
}} />;

// m11-12 · días contra minutos: el almanaque de la cuadrilla a pie contra el cronómetro del avión
export const HDaysMinutes: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = Math.min(5, Math.floor(eio(tt, 0.6, 5) * 6)), sw = eio(tt, 0.6, 5) * 360 * 4;
  return <>
    <div style={{ position: "absolute", left: 300, top: 260, width: 520, height: 560, background: PAPER, boxShadow: shadow, textAlign: "center" }}>
      <div style={{ height: 110, background: "#8a2a1a", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 56, lineHeight: "110px" }}>BY HAND</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 260, color: INK, lineHeight: "330px" }}>{d + 1}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: INK }}>DAYS</div></div>
    <svg width={560} height={620} viewBox="-280 -330 560 620" style={{ position: "absolute", left: 1080, top: 230 }}><rect x={-30} y={-330} width={60} height={60} rx={10} fill="#bbb" /><circle r={260} fill="#f3ead6" stroke="#666" strokeWidth={20} />
      {Array.from({ length: 60 }, (_, i) => <line key={i} x1={0} y1={-240} x2={0} y2={i % 5 ? -226 : -210} stroke={INK} strokeWidth={i % 5 ? 3 : 7} transform={`rotate(${i * 6})`} />)}
      <line x1={0} y1={30} x2={0} y2={-220} stroke={RED} strokeWidth={8} transform={`rotate(${sw})`} /><circle r={16} fill={RED} /><text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={INK}>{Math.floor(sw / 360) + 1} min</text></svg>
    <Lbl x={1360} y={900} tt={tt} at={2} txt="from the air · 1922" size={56} />
  </>;
}} />;

// m12 · la tarjeta de embarque: de fumigar algodón con arsénico a llevar pasajeros
export const HBoardingPass: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.4, 6, 0.5), tear = eio(tt, 3.6, 4.6);
  return <At x={960} y={540} r={-4}>
    <div style={{ width: 1300, height: 480, display: "flex", transform: `translateY(${(1 - s) * 700}px)`, filter: "drop-shadow(0 40px 60px rgba(0,0,0,.6))" }}>
      <div style={{ width: 920, height: 480, background: "#fbf7ec", borderRadius: "24px 0 0 24px", padding: "40px 50px", position: "relative" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#7a6a4a", letterSpacing: 4 }}>BOARDING PASS</div>
        <div style={{ display: "flex", gap: 60, marginTop: 30, alignItems: "center" }}><div><div style={{ fontFamily: FONT, fontSize: 30, color: "#7a6a4a" }}>FROM</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: INK }}>MLU</div><div style={{ fontFamily: HAND, fontSize: 36, color: INK }}>Monroe, Louisiana</div></div>
          <div style={{ fontSize: 80, color: "#7a6a4a" }}>✈</div><div><div style={{ fontFamily: FONT, fontSize: 30, color: "#7a6a4a" }}>ORIGIN</div><div style={{ fontFamily: HAND, fontSize: 52, color: "#8a2a1a", width: 360 }}>a crop-dusting outfit · 1924</div></div></div>
        <div style={{ position: "absolute", left: 50, bottom: 40, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK, opacity: cl(pop(tt, 2.2) * 2) }}>TODAY: DELTA AIR LINES</div></div>
      <div style={{ width: 380, height: 480, background: "#efe6cf", borderRadius: "0 24px 24px 0", borderLeft: "6px dashed #b8a888", transform: `translate(${tear * 120}px,${tear * 60}px) rotate(${tear * 12}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 260, height: 300, background: "repeating-linear-gradient(90deg,#2a2118 0 6px,transparent 6px 10px,#2a2118 10px 12px,transparent 12px 20px)" }} /></div>
    </div>
  </At>;
}} />;

// m13 · la brecha se abre: la granja con plata fumiga y crece; la del inquilino a crédito se hunde
export const HGapWiden: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 1, 5.5);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 6, background: DIM }} />
    {[["FARMS WITH MONEY", 560, 1, "#6fe39a"], ["TENANTS ON CREDIT", 1360, -1, RED]].map(([l, x, d, c], i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: (x as number) - 160, top: (d as number) > 0 ? 640 - 420 * g : 646, width: 320, height: 420 * g, background: c as string, borderRadius: 10, boxShadow: shadow }} />
      <div style={{ position: "absolute", left: x as number, top: (d as number) > 0 ? 680 : 140, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: TX, whiteSpace: "nowrap" }}>{l as string}</div></React.Fragment>)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M720 ${640 - 420 * g} L1200 ${646 + 420 * g}`} stroke={AMB} strokeWidth={6} strokeDasharray="16 10" opacity={g} /></svg>
    <Lbl x={960} y={960} tt={tt} at={4} txt="the weevil made the gap wider" size={60} col={AMB} />
  </>;
}} />;

// m13-14 · la ficha del elemento: «As 33» no se descompone; los años pasan y la ficha sigue ahí
export const HElementTile: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.4), yr = 1920 + Math.round(eio(tt, 1.5, 6.5) * 100);
  return <>
    <div style={{ position: "absolute", left: 960 - 280, top: 220, width: 560, height: 600, transform: `scale(${s})`, background: "linear-gradient(160deg,#3a4a3a,#1f2a20)", border: "10px solid #9fe39a", borderRadius: 18, boxShadow: shadow, color: "#e8f3e0", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 36, top: 24, fontWeight: 900, fontSize: 64 }}>33</div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 280, marginTop: 70 }}>As</div><div style={{ textAlign: "center", fontWeight: 800, fontSize: 56 }}>ARSENIC</div></div>
    <div style={{ position: "absolute", left: 1350, top: 400, fontFamily: FONT, fontWeight: 900, fontSize: 120, color: TX }}>{yr}</div>
    <Lbl x={1360} y={560} tt={tt} at={2} txt="an element · it doesn't break down" size={48} c={false} />
    <Lbl x={300} y={880} tt={tt} at={4.4} txt="bees died by the hive · livestock poisoned" size={46} c={false} col={AMB} />
  </>;
}} />;

// m14-15 · el kit de análisis de suelo: el lote de casas sobre el viejo algodonal, el tubo cambia de color
export const HSoilTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = eio(tt, 2.2, 4.4);
  return <>
    <div style={{ position: "absolute", left: 120, top: 260, width: 900, height: 620, borderRadius: 16, boxShadow: shadow, background: "linear-gradient(#cfe0e8 0 40%,#8a6a40 40%)", overflow: "hidden" }}>
      {Array.from({ length: 4 }, (_, i) => <svg key={i} width={180} height={180} style={{ position: "absolute", left: 40 + i * 220, top: 120 + (i % 2) * 20, opacity: cl(pop(tt, 0.4 + i * 0.3)) }}><path d="M10 80 L90 10 L170 80 Z" fill="#8a3a2a" /><rect x={30} y={80} width={120} height={90} fill="#efe6d2" /></svg>)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 180, background: "repeating-linear-gradient(90deg,#7a5a32 0 40px,#6b4a2c 40px 80px)" }} />
      <div style={{ position: "absolute", left: 30, bottom: 30, fontFamily: HAND, fontSize: 40, color: "#f3ead6" }}>old cotton ground → house lots</div></div>
    <div style={{ position: "absolute", left: 1220, top: 200, width: 140, height: 620, borderRadius: "20px 20px 70px 70px", border: "8px solid #d8e8ee", background: "rgba(220,235,240,.12)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: `rgb(${240 - 20 * c},${230 - 120 * c},${200 - 160 * c})` }} /></div>
    <Lbl x={1470} y={420} tt={tt} at={2.8} txt="test the soil" size={60} c={false} />
    <Lbl x={1470} y={500} tt={tt} at={3.6} txt="your county office can help" size={44} c={false} col={AMB} />
  </>;
}} />;

// m15 · la cuenta que no cierra: el algodón falló pero el dueño y el almacén cobran igual → deuda roja que crece
export const HLedgerDebt: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = eio(tt, 1, 6);
  return <>
    {[["COTTON", 0.4, 0.15, GRN], ["OWNER'S SHARE", 1.4, 0.5, RED], ["STORE BILL", 2.4, 0.6, RED]].map(([l, at, v, c], i) => <div key={i} style={{ position: "absolute", left: 300, top: 260 + i * 140, display: "flex", alignItems: "center", gap: 30, opacity: cl(pop(tt, at as number) * 2) }}>
      <div style={{ width: 380, fontFamily: FONT, fontWeight: 900, fontSize: 48, color: TX }}>{l as string}</div><div style={{ height: 70, width: 1000 * (v as number) * eio(tt, at as number, (at as number) + 1), background: c as string, borderRadius: 8 }} /></div>)}
    <div style={{ position: "absolute", left: 300, top: 720, width: 1300, borderTop: `6px solid ${TX}` }} />
    <div style={{ position: "absolute", left: 300, top: 760, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: RED }}>−${Math.round(240 * d)} <span style={{ fontSize: 50, color: DIM }}>deeper in debt · or turned off the land</span></div>
  </>;
}} />;

// m16 · las flechas de la Gran Migración: del Sur a Chicago, Detroit, Nueva York, Filadelfia y Los Ángeles
export const HMigrationArrows: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const C = [["CHICAGO", 980, 300], ["DETROIT", 1200, 270], ["NEW YORK", 1600, 300], ["PHILADELPHIA", 1540, 400], ["LOS ANGELES", 240, 560]] as [string, number, number][];
  const n = Math.round(6 * eio(tt, 0.8, 6) * 10) / 10;
  return <>
    <div style={{ position: "absolute", left: 760, top: 640, width: 620, height: 260, borderRadius: 40, background: "rgba(200,160,100,.35)", border: "4px dashed #c9a46a" }}><div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#e8d3a0", marginTop: 90 }}>THE SOUTH</div></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><defs><marker id="ar" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={AMB} /></marker></defs>
      {C.map(([, x, y], i) => { const l = eio(tt, 0.6 + i * 0.5, 2 + i * 0.5); return <path key={i} d={`M1070 660 Q${(1070 + x) / 2} ${Math.min(y, 660) - 160} ${x} ${y}`} stroke={AMB} strokeWidth={8} fill="none" strokeDasharray={1400} strokeDashoffset={1400 * (1 - l)} markerEnd={l > 0.97 ? "url(#ar)" : undefined} />; })}</svg>
    {C.map(([c, x, y], i) => <Lbl key={i} x={x} y={y - 80} tt={tt} at={1.8 + i * 0.5} txt={c} size={40} hand={false} />)}
    <div style={{ position: "absolute", left: 960, top: 800, transform: "translateX(-50%)", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: TX, textShadow: "0 8px 30px rgba(0,0,0,.7)" }}>~{n.toFixed(1)}M<div style={{ fontSize: 40, color: DIM }}>1910–1970 · THE GREAT MIGRATION</div></div>
  </>;
}} />;

// m16-17 · la barra de razones: el gorgojo es UNA franja angosta entre muchas
export const HReasonBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [["JIM CROW", 26, "#6b5a8a"], ["VIOLENCE", 22, "#8a3a3a"], ["NO VOTE", 16, "#4a5a7a"], ["NORTHERN JOBS", 24, "#3a6a5a"], ["WEEVIL", 12, "#a8742a"]] as [string, number, string][];
  let acc = 0;
  return <>
    <div style={{ position: "absolute", left: 160, top: 420, width: 1600, height: 180, display: "flex", borderRadius: 14, overflow: "hidden", boxShadow: shadow }}>
      {R.map(([l, w, c], i) => { const g = eio(tt, 0.4 + i * 0.6, 1.2 + i * 0.6); acc += w; return <div key={i} style={{ width: `${w * g}%`, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", outline: i === 4 ? `6px solid ${AMB}` : "none", outlineOffset: -6 }}>{l}</div>; })}
    </div>
    <Lbl x={960} y={240} tt={tt} at={0.3} txt="why six million left" size={64} />
    <Lbl x={1640} y={660} tt={tt} at={3.6} txt="one push among many" size={54} col={AMB} />
  </>;
}} />;

// m17 · el disco de pasta de 78 que gira: la gente cantaba lo que vivía
export const HRecord78: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.5), arm = eio(tt, 1, 2.2);
  return <>
    <div style={{ position: "absolute", left: 960 - 380, top: 160, width: 760, height: 760, borderRadius: "50%", transform: `scale(${s}) rotate(${tt * 280}deg)`, background: "repeating-radial-gradient(#141414 0 3px,#222 3px 6px)", boxShadow: shadow }}>
      <div style={{ position: "absolute", left: 230, top: 230, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(#d84a2a,#9a2a14)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#f3e2b0", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 30 }}>BOLL WEEVIL</div><div style={{ fontSize: 30 }}>BLUES</div><div style={{ fontSize: 22, marginTop: 10 }}>78 RPM</div></div>
      <div style={{ position: "absolute", left: 370, top: 370, width: 20, height: 20, borderRadius: "50%", background: "#ddd" }} /></div>
    <div style={{ position: "absolute", left: 1400, top: 140, width: 30, height: 560, background: "linear-gradient(90deg,#999,#ddd,#999)", transformOrigin: "50% 0", transform: `rotate(${30 - 12 * arm}deg)`, borderRadius: 14 }} />
    <Lbl x={960} y={960} tt={tt} at={2.4} txt="they sang about it because they lived it" size={58} />
  </>;
}} />;

// m18 · las rayitas de fumigadas por temporada: cada año más latas de aerosol en la fila
export const HSprayCount: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  {[1946, 1949, 1952, 1955].map((y, r) => { const n = 2 + r * 4; return <div key={r} style={{ position: "absolute", left: 160, top: 220 + r * 170, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 180, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: TX, opacity: cl(pop(tt, 0.3 + r * 1.1) * 2) }}>{y}</div>
    {Array.from({ length: n }, (_, k) => { const s = pop(tt, 0.5 + r * 1.1 + k * 0.08, 9, 0.4); return <svg key={k} width={70} height={130} viewBox="0 0 70 130" style={{ transform: `scale(${s})` }}><rect x={12} y={30} width={46} height={96} rx={10} fill={r > 2 ? "#c23a1a" : "#5a7a9a"} /><rect x={24} y={12} width={22} height={20} fill="#999" /><rect x={36} y={4} width={20} height={10} fill="#555" /><rect x={12} y={60} width={46} height={26} fill="#efe6d2" /></svg>; })}</div>; })}
  <Lbl x={960} y={110} tt={tt} at={0.4} txt="DDT and its cousins · more sprays every season" size={56} />
</>} />;

// m18-19 · el colador de la resistencia: cada rociada deja pasar a los pocos que sobreviven, y la generación siguiente es de ellos
export const HResistSieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const G = 4;
  return <>{Array.from({ length: G }, (_, g) => { const at = 0.4 + g * 1.4, on = pop(tt, at, 7, 0.5), kill = eio(tt, at + 0.6, at + 1.2); const resist = Math.min(1, 0.1 + g * 0.3);
    return <div key={g} style={{ position: "absolute", left: 140 + g * 430, top: 260, width: 380, height: 520, background: "rgba(255,255,255,.05)", border: "3px solid rgba(255,255,255,.2)", borderRadius: 16, opacity: cl(on * 2) }}>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: TX, marginTop: 16 }}>GENERATION {g + 1}</div>
      {Array.from({ length: 30 }, (_, i) => { const r = rnd(i + g * 31) < resist; const dead = !r && rnd(i + 5) < 0.95 * kill; return <Weevil key={i} x={50 + (i % 6) * 56} y={110 + Math.floor(i / 6) * 76} s={0.5} r={dead ? 180 : 0} col={r ? "#c2621a" : "#6b5236"} o={dead ? 0.25 : 1} tt={tt + i} />; })}</div>; })}
    <Lbl x={960} y={860} tt={tt} at={5.6} txt="by the mid-1950s: they stopped dying" size={62} col={AMB} /></>;
}} />;

// m19-20 · la cinta del gimnasio: el granjero corre y la cinta se acelera; cada vuelta, otra plaga
export const HTreadmill: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sp = 1 + tt * 0.6, run = Math.sin(tt * 6 * sp);
  const P = ["weevil", "bollworm", "aphids", "mites"];
  return <>
    <div style={{ position: "absolute", left: 360, top: 720, width: 1200, height: 70, borderRadius: 35, background: `repeating-linear-gradient(90deg,#222 0 40px,#333 40px 80px)`, backgroundPosition: `${-tt * 300 * sp}px 0`, boxShadow: shadow }} />
    <div style={{ position: "absolute", left: 1500, top: 380, width: 30, height: 360, background: "#666" }} /><div style={{ position: "absolute", left: 1440, top: 360, width: 160, height: 60, background: "#444", borderRadius: 10, color: RED, fontFamily: FONT, fontWeight: 900, fontSize: 40, textAlign: "center", lineHeight: "60px" }}>{sp.toFixed(1)}×</div>
    <svg width={260} height={420} viewBox="0 0 260 420" style={{ position: "absolute", left: 830, top: 310 }}><circle cx={130} cy={50} r={38} fill="#3a2f28" /><path d="M120 90 L140 250" stroke="#5a4f46" strokeWidth={46} strokeLinecap="round" />
      <path d={`M140 250 L${140 + 60 * run} 410`} stroke="#3a3f4a" strokeWidth={30} strokeLinecap="round" /><path d={`M140 250 L${140 - 60 * run} 410`} stroke="#3a3f4a" strokeWidth={30} strokeLinecap="round" />
      <path d={`M130 120 L${130 + 70 * -run} 210`} stroke="#5a4f46" strokeWidth={22} strokeLinecap="round" /></svg>
    {P.map((p, i) => <Lbl key={i} x={420 + i * 300} y={180 + (i % 2) * 70} tt={tt} at={0.8 + i * 1.1} txt={p} size={50} col={i ? RED : AMB} />)}
    <Lbl x={960} y={880} tt={tt} at={4.8} txt="once you get on, it's hard to get off" size={58} />
  </>;
}} />;

// m20-21 · la grilla de trampas con feromona: cada cono verde se enciende donde hay gorgojos
export const HTrapGrid: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <At x={960} y={580} rx={52}>
  <div style={{ width: 1500, height: 820, position: "relative", background: `repeating-linear-gradient(90deg,${LEAF} 0 26px,#4f6a2a 26px 52px)`, boxShadow: shadow }}>
    {Array.from({ length: 24 }, (_, i) => { const x = 120 + (i % 8) * 180, y = 120 + Math.floor(i / 8) * 260, s = pop(tt, 0.3 + i * 0.08, 8, 0.45), hit = rnd(i + 7) < 0.3 && tt > 3 + rnd(i) * 2;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
        {hit && <div style={{ position: "absolute", left: -60, top: -60, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(rgba(255,90,74,.6),transparent 70%)" }} />}
        <svg width={60} height={110} viewBox="0 0 60 110"><path d="M30 0 L56 70 L4 70 Z" fill="#9adf3a" stroke="#4a7a1a" strokeWidth={3} /><rect x={27} y={70} width={6} height={40} fill="#5a3a20" /></svg></div>; })}
    <Lbl x={750} y={-110} tt={tt} at={1} txt="traps baited with the weevil's own scent" size={56} />
  </div>
</At>} />;

// m21 · región por región: el mapa pasa de rojo a verde de las Carolinas hacia el oeste
export const HRegionClear: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [["TX", "2000s →", 230], ["OK", "", 210], ["LA", "1990s", 180], ["MS", "1990s", 180], ["AL", "1980s–90s", 180], ["GA", "1980s", 200], ["SC", "1980s", 180], ["NC · VA", "1978", 260]] as [string, string, number][];
  return <>
    <div style={{ position: "absolute", left: 120, top: 360, display: "flex", gap: 10, alignItems: "flex-end" }}>
      {R.map(([s, y, w], i) => { const on = eio(tt, 0.6 + (7 - i) * 0.6, 1.4 + (7 - i) * 0.6); return <div key={i} style={{ width: w, height: 300 + (i % 3) * 40, borderRadius: 12, background: `rgb(${200 - 120 * on},${70 + 140 * on},${60 + 40 * on})`, boxShadow: shadow, textAlign: "center", paddingTop: 30 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff" }}>{s}</div><div style={{ fontFamily: HAND, fontSize: 38, color: "#fff", opacity: on }}>{y}</div></div>; })}
    </div>
    <Lbl x={960} y={180} tt={tt} at={0.4} txt="eradication · east to west" size={62} />
    <Lbl x={330} y={860} tt={tt} at={6} txt="last holdout: the lower Rio Grande" size={46} col={AMB} c={false} />
  </>;
}} />;

// m22 · la boleta: los productores votan cobrarse a sí mismos una tasa por acre
export const HSelfTax: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 6, 0.5), x = eio(tt, 2, 2.6), drop = eIn(tt, 3.4, 4.2);
  return <>
    <div style={{ position: "absolute", left: 760, top: 700, width: 400, height: 300, background: "linear-gradient(#5a6a7a,#3a4a5a)", boxShadow: shadow, borderRadius: 10 }}><div style={{ position: "absolute", left: 80, top: -6, width: 240, height: 20, background: "#111", borderRadius: 4 }} /><div style={{ textAlign: "center", marginTop: 120, fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff" }}>GROWERS' VOTE</div></div>
    <div style={{ position: "absolute", left: 960 - 280, top: 160 + drop * 520, width: 560, height: 420, transform: `scale(${s * (1 - 0.6 * drop)}) rotate(${-3 + drop * 3}deg)`, transformOrigin: "50% 100%", background: "#fbf7ec", boxShadow: shadow, padding: "40px 50px", opacity: 1 - eio(tt, 4, 4.3) }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK }}>A FEE ON EVERY ACRE</div><div style={{ fontFamily: HAND, fontSize: 40, color: INK, marginTop: 10 }}>to pay for eradication</div>
      {["YES", "NO"].map((v, i) => <div key={v} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 30, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: INK }}><div style={{ width: 70, height: 70, border: `6px solid ${INK}`, position: "relative" }}>{i === 0 && <svg width={70} height={70} style={{ position: "absolute", left: -6, top: -6 }}><path d="M10 35 L30 58 L64 10" stroke="#2a5a8a" strokeWidth={10} fill="none" strokeDasharray={90} strokeDashoffset={90 * (1 - x)} /></svg>}</div>{v}</div>)}</div>
    <Lbl x={1520} y={420} tt={tt} at={4.4} txt="billions of dollars, over the years" size={50} />
  </>;
}} />;

// m22-23 · cien años en cien cuadritos: se llenan de 1892 al final del siglo
export const HCenturyBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.6, 6);
  return <>
    <div style={{ position: "absolute", left: 460, top: 180, display: "grid", gridTemplateColumns: "repeat(10,92px)", gap: 8 }}>
      {Array.from({ length: 100 }, (_, i) => { const on = cl(p * 100 - i); return <div key={i} style={{ width: 92, height: 62, borderRadius: 6, background: on > 0.5 ? (i < 90 ? "#a8742a" : GRN) : "rgba(255,255,255,.08)", transform: `scale(${0.8 + 0.2 * on})` }} />; })}
    </div>
    <div style={{ position: "absolute", left: 160, top: 360, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: TX }}>{1892 + Math.round(p * 108)}</div>
    <Lbl x={960} y={930} tt={tt} at={4.8} txt="generations paid for the shortcut" size={60} col={AMB} />
  </>;
}} />;

// m23 · la estatua de Enterprise se revela: la mujer levanta el gorgojo sobre la cabeza, placa «heraldo de la prosperidad»
export const HStatueReveal: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const cl_ = eio(tt, 0.6, 2.4), pl = pop(tt, 3.2, 7, 0.45);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 30%,#3a3a44,#121216)" }} />
    <svg width={500} height={700} viewBox="0 0 500 700" style={{ position: "absolute", left: 710, top: 120 }}>
      <rect x={110} y={540} width={280} height={160} fill="#8a8478" /><rect x={90} y={520} width={320} height={30} fill="#a8a296" />
      <path d="M250 110 Q220 130 214 180 L200 300 L170 520 L330 520 L300 300 L286 180 Q280 130 250 110 Z" fill="#c9cdd2" />
      <path d="M220 160 L170 60 M280 160 L330 60" stroke="#c9cdd2" strokeWidth={28} strokeLinecap="round" /><circle cx={250} cy={92} r={30} fill="#c9cdd2" />
      <ellipse cx={250} cy={40} rx={90} ry={22} fill="#b8bcc2" /><g transform="translate(250 10)"><ellipse rx={40} ry={22} fill="#2a2a2a" /><path d="M36 0 L70 14" stroke="#2a2a2a" strokeWidth={8} /></g>
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920 * (1 - cl_) / 2, height: 1080, background: "#5a1a1a" }} /><div style={{ position: "absolute", right: 0, top: 0, width: 1920 * (1 - cl_) / 2, height: 1080, background: "#5a1a1a" }} />
    <div style={{ position: "absolute", left: 1220, top: 560, width: 560, padding: "26px 34px", background: "linear-gradient(#c9a050,#8a6a20)", boxShadow: shadow, transform: `scale(${pl}) rotate(2deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#2a1a08", textAlign: "center" }}>IN PROFOUND APPRECIATION OF THE BOLL WEEVIL<div style={{ fontFamily: HAND, fontSize: 40, marginTop: 8 }}>herald of prosperity · 1919</div></div>
    <Lbl x={400} y={200} tt={tt} at={2} txt="Enterprise, Alabama" size={60} />
  </>;
}} />;

// m23-24 · la mota se cambia por un maní en la balanza del condado: el maní pesa más
export const HPeanutSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sw = eio(tt, 1, 2.4), up = eio(tt, 2.4, 4.2);
  return <>
    <Boll x={960 - sw * 600} y={540 - sw * 200} s={3 * (1 - sw * 0.5)} o={1 - sw * 0.7} />
    <svg width={420} height={260} viewBox="0 0 420 260" style={{ position: "absolute", left: 750 + (1 - sw) * 800, top: 410, transform: `rotate(${-20 + 20 * sw}deg)`, opacity: sw }}><path d="M60 130 Q60 30 160 50 Q210 70 260 50 Q360 30 360 130 Q360 230 260 210 Q210 190 160 210 Q60 230 60 130 Z" fill="#d8a868" stroke="#a87838" strokeWidth={8} />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={100 + i * 24} cy={130 + (i % 2) * 20 - 10} r={5} fill="#b88848" />)}</svg>
    <div style={{ position: "absolute", left: 1300, top: 700 - up * 380, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: GRN }}>↑</div>
    <Lbl x={960} y={120} tt={tt} at={0.4} txt="Coffee County tried something else" size={58} />
    <Lbl x={960} y={880} tt={tt} at={3} txt="peanuts did better than cotton had" size={62} col={AMB} />
  </>;
}} />;

// m24 · la escuela sobre ruedas: el carro de Carver rueda con su cartel hacia las granjas los sábados
export const HSchoolWagon: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const x = -500 + eio(tt, 0.3, 4) * 1300, rot = tt * 200;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 320, background: "linear-gradient(#b8945a,#8a6a40)" }} />
    <div style={{ position: "absolute", left: x, top: 470 }}>
      <div style={{ width: 620, height: 230, background: "linear-gradient(#7a4a2a,#5a3018)", borderRadius: 10, boxShadow: shadow, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: -100, width: 560, height: 90, background: "#f3ead6", borderRadius: 8, fontFamily: MARK, fontSize: 44, color: "#5a2a1a", textAlign: "center", lineHeight: "90px" }}>MOVABLE SCHOOL</div>
        {["SWEET POTATOES", "COWPEAS", "PEANUTS"].map((c, i) => <div key={c} style={{ position: "absolute", left: 30 + i * 190, top: 40, width: 170, height: 150, background: "#e8d3a0", borderRadius: 6, fontFamily: FONT, fontWeight: 900, fontSize: 22, color: INK, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, textAlign: "center" }}>{c}</div>)}</div>
      {[90, 500].map((wx) => <svg key={wx} width={160} height={160} viewBox="-80 -80 160 160" style={{ position: "absolute", left: wx - 80, top: 170 }}><circle r={70} fill="none" stroke="#3a2a1a" strokeWidth={14} />{Array.from({ length: 8 }, (_, k) => <line key={k} x1={0} y1={0} x2={0} y2={-66} stroke="#3a2a1a" strokeWidth={8} transform={`rotate(${k * 45 + rot})`} />)}</svg>)}
    </div>
    <Lbl x={960} y={120} tt={tt} at={1.4} txt="Tuskegee · G. W. Carver · Saturdays, farm to farm" size={54} />
    <Lbl x={960} y={960} tt={tt} at={4} txt="how to plant, how to can, how to cook it" size={56} col={AMB} />
  </>;
}} />;

// m24-25 · oír, ver, hacer: tres íconos; las dudas se tachan hasta que sólo queda la mano que cosecha
export const HHearSeeDo: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const A = [["HEARS", "may doubt", 0.3, "M40 70 Q40 20 80 20 Q120 20 120 70 Q120 100 95 115 Q85 125 85 140"], ["SEES", "may possibly doubt", bt(h, 0, 2.4), "M10 80 Q80 10 150 80 Q80 150 10 80 Z M80 80 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0"], ["DOES HIMSELF", "cannot doubt", bt(h, 1, 4.6), "M40 150 L40 70 Q40 55 52 55 L52 40 Q52 28 64 28 Q76 28 76 40 L76 30 Q76 18 88 18 Q100 18 100 30 L100 40 Q100 30 112 30 Q124 30 124 44 L124 110 Q124 150 90 150 Z"]] as [string, string, number, string][];
  return <>{A.map(([l, d, at, p], i) => { const s = pop(tt, at, 7, 0.45), x = eio(tt, at + 1, at + 1.5); return <div key={i} style={{ position: "absolute", left: 340 + i * 620, top: 260, transform: `translateX(-50%) scale(${s})`, textAlign: "center", width: 520 }}>
    <svg width={260} height={220} viewBox="0 0 160 160"><path d={p} fill={i === 2 ? "#d8b48a" : "none"} stroke={TX} strokeWidth={8} /></svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: TX }}>{l}</div>
    <div style={{ position: "relative", display: "inline-block", fontFamily: HAND, fontSize: 52, color: i === 2 ? GRN : AMB, marginTop: 10 }}>{d}{i < 2 && <div style={{ position: "absolute", left: 0, top: "50%", height: 6, width: `${x * 100}%`, background: RED }} />}</div></div>; })}
    <Lbl x={960} y={860} tt={tt} at={(bt(h, 1, 4.6) as number) + 1.4} txt="you can't argue with your own harvest" size={60} /></>;
}} />;

// m25-26 · el surco de algodón: cada mota que se abre muestra un año de la historia
export const HCottonRow: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [["1892", "crosses at Brownsville"], ["1903", "Knapp's demo farm"], ["1914", "extension service"], ["~1916", "calcium arsenate"], ["1919", "the statue"], ["1922", "airplanes"], ["1923", "Georgia: 600K bales"], ["1924", "dusters → Delta"], ["1940s–50s", "DDT → resistance"], ["1978", "eradication trial"], ["2000s", "weevil gone"]];
  const at = [0.3, ...Array.from({ length: 10 }, (_, i) => bt(h, i, 1.5 + i * 1.6))];
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 40, background: "#5a3a20" }} />
    {Y.map(([y, d], i) => { const o = eio(tt, at[i], at[i] + 0.6), x = 110 + i * 170, up = i % 2 ? 0 : 1; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 3, top: 470, width: 6, height: 140, background: LEAF }} />
      <Boll x={x} y={460} s={0.4 + 0.8 * o} />
      <div style={{ position: "absolute", left: x, top: up ? 220 : 680, transform: `translateX(-50%) translateY(${(1 - o) * (up ? 60 : -60)}px)`, opacity: o, width: 180, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: i === 10 ? GRN : TX }}>{y}</div><div style={{ fontFamily: HAND, fontSize: 30, color: AMB, lineHeight: 1.05 }}>{d}</div></div></React.Fragment>; })}
  </>;
}} />;

// m26 · la radio de válvulas: las preguntas entran por el dial y la respuesta se escribe en la tarjeta
export const HRadioCall: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q = [["Is it really gone?", "From most of the U.S., yes."], ["Did it cause the Great Migration?", "One push among many."], ["Arsenic still in old fields?", "Some places. Test the soil."], ["Why did this work, not fire ants?", "One pest had a weak spot."]];
  const i = Math.min(3, Math.floor(tt / 3.1)), lt = tt - i * 3.1, dial = 120 + i * 120 + 20 * Math.sin(tt * 2);
  return <>
    <div style={{ position: "absolute", left: 180, top: 300, width: 600, height: 460, borderRadius: "220px 220px 30px 30px", background: "linear-gradient(#8a5a32,#5a3a20)", boxShadow: shadow }}>
      <div style={{ position: "absolute", left: 80, top: 90, width: 440, height: 200, borderRadius: "200px 200px 10px 10px", background: "repeating-linear-gradient(90deg,#3a2a1a 0 6px,#c9a46a 6px 12px)" }} />
      <div style={{ position: "absolute", left: 80, top: 320, width: 440, height: 50, background: "#f3e2b0", borderRadius: 8 }}><div style={{ position: "absolute", left: dial, top: 4, width: 6, height: 42, background: RED }} /></div>
      {[140, 460].map((x) => <div key={x} style={{ position: "absolute", left: x - 30, top: 390, width: 60, height: 60, borderRadius: "50%", background: "#2a1a0a" }} />)}</div>
    <div key={i} style={{ position: "absolute", left: 900, top: 320, width: 860, padding: "34px 44px", background: "#fbf7ec", boxShadow: shadow, transform: `translateX(${(1 - pop(lt, 0.1, 7, 0.5)) * 700}px) rotate(-1.5deg)` }}>
      <div style={{ fontFamily: HAND, fontSize: 56, color: "#22314f" }}>{Q[i][0]}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK, marginTop: 16, opacity: cl(pop(lt, 1.1) * 2) }}>{Q[i][1]}</div></div>
  </>;
}} />;

// m27 · la colcha del repaso: cada retazo cosido es un paso de la historia
export const HQuiltRecap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [["one crop", "#c9a46a"], ["no floor", "#8a5a3a"], ["1892 · the weevil", "#6b5236"], ["Knapp: diversify", "#6a8a4a"], ["arsenic & airplanes", "#a8a8a0"], ["families paid · left", "#7a4a5a"], ["resistance · treadmill", "#8a3a2a"], ["100 years · eradicated", "#4a7a5a"], ["a statue to the lesson", "#b8902a"]];
  return <At x={960} y={560} rx={20}>
    <div style={{ width: 1260, height: 840, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, boxShadow: shadow, background: "#3a2a1a", padding: 14 }}>
      {P.map(([l, c], i) => { const s = pop(tt, 0.3 + i * 1.2, 8, 0.45); return <div key={i} style={{ margin: 6, background: c, transform: `scale(${s}) rotate(${(1 - s) * 30}deg)`, border: "4px dashed rgba(255,240,210,.7)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: HAND, fontSize: 46, color: "#fff8e8", padding: 16, textShadow: "0 3px 8px rgba(0,0,0,.5)" }}>{l}</div>; })}
    </div>
  </At>;
}} />;

// m28 · todos los huevos en una canasta: la canasta ALGODÓN se vuelca; el gorgojo sólo vino a cobrar
export const HEggBasket: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tip = eIn(tt, 2.2, 3.2);
  return <>
    <div style={{ position: "absolute", left: 760, top: 420, transformOrigin: "100% 100%", transform: `rotate(${tip * 70}deg)` }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i % 4) * 90, top: -60 - Math.floor(i / 4) * 60 + tip * (200 + i * 40), width: 70, height: 90, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 35% 30%,#fffaf0,#e8dcc0)", transform: `rotate(${tip * (i * 30)}deg)`, opacity: 1 - eio(tt, 3.6, 4.4) }} />)}
      <div style={{ width: 400, height: 220, borderRadius: "0 0 160px 160px", background: "repeating-linear-gradient(45deg,#a8743a 0 14px,#8a5a28 14px 28px)", boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff2d8" }}>COTTON</div></div>
    <Weevil x={1350} y={560} s={2.2} tt={tt} />
    <div style={{ position: "absolute", left: 1240, top: 380, padding: "10px 20px", background: "#fbf7ec", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: INK, transform: `scale(${pop(tt, 3.8)}) rotate(6deg)` }}>COLLECTING</div>
    <Lbl x={960} y={120} tt={tt} at={0.6} txt="the bug didn't ruin the South" size={62} />
    <Lbl x={960} y={900} tt={tt} at={2.6} txt="putting everything on one crop did" size={62} col={AMB} />
  </>;
}} />;

export const HCC: Record<string, React.FC<{ t: number; h: H }>> = {
  bollSplit: HBollSplit, beltSweep: HBeltSweep, statueTease: HStatueTease, coffeeRings: HCoffeeRings, cottonWeb: HCottonWeb, storeLedger: HStoreLedger, noFloor: HNoFloor,
  lifeCycle: HLifeCycle, weevilMultiply: HWeevilMultiply, riverCross: HRiverCross, stateDominoes: HStateDominoes, baleShrink: HBaleShrink, fenceWatch: HFenceWatch,
  raceClock: HRaceClock, agentBadge: HAgentBadge, handsPoint: HHandsPoint, labFlask: HLabFlask, handDuster: HHandDuster, daysMinutes: HDaysMinutes,
  boardingPass: HBoardingPass, gapWiden: HGapWiden, elementTile: HElementTile, soilTest: HSoilTest, ledgerDebt: HLedgerDebt, migrationArrows: HMigrationArrows,
  reasonBar: HReasonBar, record78: HRecord78, sprayCount: HSprayCount, resistSieve: HResistSieve, treadmill: HTreadmill, trapGrid: HTrapGrid, regionClear: HRegionClear,
  selfTax: HSelfTax, centuryBar: HCenturyBar, statueReveal: HStatueReveal, peanutSwap: HPeanutSwap, schoolWagon: HSchoolWagon, hearSeeDo: HHearSeeDo,
  cottonRow: HCottonRow, radioCall: HRadioCall, quiltRecap: HQuiltRecap, eggBasket: HEggBasket,
};
