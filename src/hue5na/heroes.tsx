// heroes.tsx · kit HuertoPlatano (sesD, hue5na «Entierra plátanos en el jardín»): componentes PROPIOS, uno por idea, dibujados
// como el OBJETO que la idea es (plátano, corte de tierra con raíces, palmo, rosal, maceta, frasco, regadera, calendario de patio…).
// Escenario = Stage de ckit (foto del momento desenfocada + mesa + cámara curva). Física con resorte (phys). Datos = los del guion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { cl, eio, FONT, H, HAND, phys, Stage } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const BAN = "#f3c623", BAND = "#b98a10", LEAF = "#4f9a3c", LEAFD = "#2f6b25", SOIL = "#5b3a22", SOILD = "#3b2414", ROSE = "#e35d84",
  INK = "#fbf6ea", NAVY = "#1b2416", RED = "#e2452f", GRN = "#6cc46a", SKY = "#7cc4e8", TERRA = "#c8663a", AMB = "#ffc23a";
const P = (tt: number, a: number, w = 7, z = 0.5) => phys(tt, a, w, z);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const W = (tt: number, a: number, b: number) => eio(tt, a, b);

const Lbl: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; bg?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, tx, col = NAVY, bg = INK, size = 46, hand }) => {
  const s = P(tt, at, 8, 0.5); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2.2),
    padding: hand ? "4px 18px" : "10px 26px", borderRadius: 14, background: bg, color: col, fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: hand ? size * 1.3 : size,
    letterSpacing: hand ? 0 : 1.5, whiteSpace: "nowrap", boxShadow: hand ? "none" : "0 14px 34px rgba(0,0,0,.45)", textShadow: hand ? "0 6px 18px rgba(0,0,0,.7)" : "none" }}>{tx}</div>;
};
const Big: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; size?: number }> = ({ tt, at, x, y, tx, col = AMB, size = 190 }) => {
  const s = P(tt, at, 7, 0.42); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: "6px #1b1206", textShadow: "0 18px 40px rgba(0,0,0,.6)", lineHeight: 1, whiteSpace: "nowrap" } as React.CSSProperties}>{tx}</div>;
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>{children}</svg>;
const Defs = () => <defs>
  <linearGradient id="ban" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0a0" /><stop offset=".45" stopColor={BAN} /><stop offset="1" stopColor={BAND} /></linearGradient>
  <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5233" /><stop offset=".3" stopColor={SOIL} /><stop offset="1" stopColor={SOILD} /></linearGradient>
  <linearGradient id="terra" x1="0" x2="1"><stop offset="0" stopColor="#9c4a26" /><stop offset=".5" stopColor={TERRA} /><stop offset="1" stopColor="#8a3f20" /></linearGradient>
  <linearGradient id="glass" x1="0" x2="1"><stop offset="0" stopColor="rgba(220,240,255,.35)" /><stop offset=".5" stopColor="rgba(255,255,255,.12)" /><stop offset="1" stopColor="rgba(220,240,255,.3)" /></linearGradient>
  <radialGradient id="sun"><stop offset="0" stopColor="#fff6c0" /><stop offset=".6" stopColor="#ffd23a" /><stop offset="1" stopColor="#ff9a1a" /></radialGradient>
  <pattern id="grit" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r="3" fill="rgba(0,0,0,.25)" /><circle cx="28" cy="26" r="2" fill="rgba(255,220,180,.18)" /><circle cx="18" cy="34" r="2.5" fill="rgba(0,0,0,.2)" /></pattern>
</defs>;
// plátano (ripe: 0 verde · 1 amarillo · 2 con pintas · 3 negro · 4 con moho)
const Banana: React.FC<{ x: number; y: number; s?: number; rot?: number; ripe?: number; op?: number }> = ({ x, y, s = 1, rot = 0, ripe = 2, op = 1 }) => {
  const fill = ripe === 0 ? "#8cbf3a" : ripe === 3 ? "#3a2a18" : ripe === 4 ? "#4a3a22" : "url(#ban)";
  return <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <path d="M -170 -20 C -120 70, 110 80, 175 -30 C 150 30, -110 40, -170 -20 Z" fill={fill} stroke="#4a3208" strokeWidth={5} />
    <path d="M -175 -26 l -18 -10 l 6 -10 l 20 12 Z" fill="#5a4010" /><path d="M 175 -30 l 12 -6 l 4 8 l -12 6 Z" fill="#3a2a08" />
    {ripe === 2 && [[-90, 22], [-30, 34], [40, 32], [100, 14], [-60, 28], [70, 26]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={5 + (i % 3) * 2} fill="#4a300c" opacity={0.8} />)}
    {ripe === 4 && [[-80, 20], [0, 30], [80, 20], [-30, 22], [40, 26]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={14 + (i % 2) * 6} fill="#e9eedf" opacity={0.85} />)}
  </g>;
};
const Chunk: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  <rect x={-34} y={-24} width={68} height={48} rx={18} fill="url(#ban)" stroke="#4a3208" strokeWidth={4} /><ellipse cx={34} cy={0} rx={10} ry={20} fill="#fff4cc" stroke="#c9a640" strokeWidth={3} /><circle cx={-8} cy={6} r={4} fill="#4a300c" />
</g>;
// corte de tierra: suelo + pasto arriba (y = superficie)
const Ground: React.FC<{ y: number; x0?: number; x1?: number; deep?: number }> = ({ y, x0 = 260, x1 = 1660, deep = 520 }) => <g>
  <rect x={x0} y={y} width={x1 - x0} height={deep} rx={24} fill="url(#soil)" /><rect x={x0} y={y} width={x1 - x0} height={deep} rx={24} fill="url(#grit)" />
  <rect x={x0} y={y - 10} width={x1 - x0} height={22} rx={10} fill="#5f8f3a" />
  {Array.from({ length: Math.floor((x1 - x0) / 34) }, (_, i) => <path key={i} d={`M ${x0 + 14 + i * 34} ${y} l ${-6 + (i % 3) * 5} -26`} stroke="#6fae45" strokeWidth={6} strokeLinecap="round" />)}
</g>;
const Roots: React.FC<{ x: number; y: number; k: number; fine?: boolean }> = ({ x, y, k, fine = true }) => <g opacity={cl(k * 1.5)}>
  {[-160, -90, -30, 40, 110, 170].map((dx, i) => <path key={i} d={`M ${x} ${y} C ${x + dx * 0.3} ${y + 60}, ${x + dx * 0.8} ${y + 120}, ${x + dx} ${y + 160 + (i % 2) * 60}`} stroke="#d8c3a0" strokeWidth={fine ? 5 : 12} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - k)} strokeLinecap="round" />)}
</g>;
// rosal (flores abiertas y botones)
const Rose: React.FC<{ x: number; y: number; s?: number; fl?: number; bud?: number; pale?: boolean; droop?: number }> = ({ x, y, s = 1, fl = 3, bud = 0, pale, droop = 0 }) => {
  const pts = [[-120, -260], [0, -330], [120, -270], [-60, -200], [70, -210], [-170, -180], [170, -170], [-20, -260], [40, -300], [-110, -320], [110, -330], [0, -220]];
  return <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-120, 0, 120, -60, 70].map((dx, i) => <path key={i} d={`M 0 0 Q ${dx * 0.4} -120 ${dx} ${-220 - (i % 2) * 70 + droop * 60}`} stroke={LEAFD} strokeWidth={10} fill="none" />)}
    {pts.map(([a, b], i) => <ellipse key={"l" + i} cx={a * 0.9 + 20} cy={b + 40} rx={26} ry={14} transform={`rotate(${-30 + i * 23} ${a * 0.9 + 20} ${b + 40})`} fill={LEAF} />)}
    {pts.slice(0, fl).map(([a, b], i) => <g key={"f" + i}><circle cx={a} cy={b + droop * 50} r={pale ? 22 : 34} fill={pale ? "#f0b8c8" : ROSE} /><circle cx={a} cy={b + droop * 50} r={pale ? 10 : 16} fill={pale ? "#e9a0b4" : "#b8325c"} /></g>)}
    {pts.slice(fl, fl + bud).map(([a, b], i) => <ellipse key={"b" + i} cx={a} cy={b} rx={11} ry={18} fill="#c0386a" stroke={LEAFD} strokeWidth={4} />)}
  </g>;
};
const Pot: React.FC<{ x: number; y: number; s?: number; cut?: boolean }> = ({ x, y, s = 1, cut }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M -200 -260 L 200 -260 L 160 120 L -160 120 Z" fill={cut ? "url(#soil)" : "url(#terra)"} stroke="#6e3216" strokeWidth={8} />
  {cut && <path d="M -200 -260 L 200 -260 L 160 120 L -160 120 Z" fill="url(#grit)" />}
  <rect x={-220} y={-300} width={440} height={60} rx={10} fill="url(#terra)" stroke="#6e3216" strokeWidth={8} />
</g>;
const Sun: React.FC<{ x: number; y: number; r?: number; k?: number }> = ({ x, y, r = 90, k = 1 }) => <g transform={`translate(${x},${y}) scale(${k})`}>
  {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-8} y={-r - 60} width={16} height={40} rx={8} fill="#ffd23a" transform={`rotate(${i * 30})`} />)}
  <circle r={r} fill="url(#sun)" />
</g>;
const Drop: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = SKY }) => <path transform={`translate(${x},${y}) scale(${s})`} d="M 0 -40 C 20 -10, 30 6, 30 18 A 30 30 0 1 1 -30 18 C -30 6, -20 -10, 0 -40 Z" fill={col} stroke="#2e6d8c" strokeWidth={4} />;
const Jar: React.FC<{ x: number; y: number; s?: number; tea?: number; lvl?: number; children?: React.ReactNode }> = ({ x, y, s = 1, tea = 0, lvl = 0.75, children }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <rect x={-150} y={-200 + 400 * (1 - lvl)} width={300} height={400 * lvl} rx={30} fill={`rgba(${lp(170, 150, tea)},${lp(215, 110, tea)},${lp(240, 40, tea)},.75)`} />
  {children}
  <rect x={-160} y={-220} width={320} height={430} rx={40} fill="url(#glass)" stroke="rgba(255,255,255,.7)" strokeWidth={6} />
  <rect x={-130} y={-262} width={260} height={50} rx={10} fill="#9aa3ab" stroke="#5a636a" strokeWidth={5} />
</g>;
const Rat: React.FC<{ x: number; y: number; s?: number; op?: number }> = ({ x, y, s = 1, op = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
  <ellipse cx={0} cy={0} rx={90} ry={50} fill="#5c5650" /><circle cx={80} cy={-20} r={36} fill="#5c5650" /><circle cx={70} cy={-56} r={16} fill="#8a7f78" />
  <circle cx={100} cy={-28} r={6} fill="#111" /><path d="M -90 10 C -160 40, -200 -10, -250 20" stroke="#8a7f78" strokeWidth={8} fill="none" strokeLinecap="round" />
</g>;
const Card: React.FC<{ x: number; y: number; w: number; h: number; s: number; children?: React.ReactNode; bg?: string; rot?: number }> = ({ x, y, w, h, s, children, bg = INK, rot = 0 }) => s <= 0.01 ? null :
  <g transform={`translate(${x},${y}) rotate(${rot * (1 - s)}) scale(${0.7 + 0.3 * s})`} opacity={cl(s * 2)}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={bg} stroke="rgba(0,0,0,.25)" strokeWidth={4} />{children}</g>;
const T: React.FC<{ x: number; y: number; tx: string; size?: number; col?: string; anchor?: "start" | "middle" | "end"; hand?: boolean; op?: number }> = ({ x, y, tx, size = 44, col = NAVY, anchor = "middle", hand, op = 1 }) =>
  <text x={x} y={y} textAnchor={anchor} fontFamily={hand ? HAND : FONT} fontWeight={900} fontSize={size} fill={col} opacity={op}>{tx}</text>;
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; col?: string; w?: number }> = ({ x1, y1, x2, y2, k, col = AMB, w = 10 }) => {
  if (k <= 0.01) return null; const x = lp(x1, x2, k), y = lp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={x} y2={y} stroke={col} strokeWidth={w} strokeLinecap="round" />
    <path d={`M ${x} ${y} l ${-34 * Math.cos(a - 0.45)} ${-34 * Math.sin(a - 0.45)} M ${x} ${y} l ${-34 * Math.cos(a + 0.45)} ${-34 * Math.sin(a + 0.45)}`} stroke={col} strokeWidth={w} strokeLinecap="round" /></g>;
};
const Check: React.FC<{ x: number; y: number; ok: boolean; s: number }> = ({ x, y, ok, s }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${s})`}>
  <circle r={40} fill={ok ? GRN : RED} />{ok ? <path d="M -18 0 l 12 14 l 24 -28" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M -16 -16 l 32 32 M 16 -16 l -32 32" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}
</g>;

// 1 · pintas negras: tres plátanos del frutero, el de pintas se levanta
const Pintas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const up = P(tt, 2.2, 6, 0.5);
  return <AbsoluteFill><Svg><Defs />
    <ellipse cx={960} cy={760} rx={520} ry={90} fill="#8a5a34" /><ellipse cx={960} cy={740} rx={500} ry={70} fill="#a8723f" />
    <Banana x={700} y={680} s={1.1 * P(tt, 0.2)} rot={-8} ripe={1} />
    <Banana x={960} y={lp(690, 470, up)} s={1.25 * P(tt, 0.5)} rot={lp(4, -6, up)} ripe={2} />
    <Banana x={1220} y={680} s={1.1 * P(tt, 0.8)} rot={10} ripe={0} />
  </Svg><Lbl tt={tt} at={2.6} x={960} y={300} tx="ESTE · EL QUE NADIE SE COME" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 2 · la rata: plátano a flor de tierra, el olor sube y la rata entra
const Rata: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const r = W(tt, 2.4, 4.4);
  return <AbsoluteFill><Svg><Defs /><Ground y={620} />
    <Banana x={900} y={612} s={0.9} rot={-4} ripe={2} />
    {[0, 1, 2].map((i) => { const k = ((tt * 0.6 + i / 3) % 1); return <path key={i} d={`M ${860 + i * 40} ${590 - k * 260} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#c9b26a" strokeWidth={7} fill="none" opacity={(1 - k) * cl(tt - 0.6)} />; })}
    <Rat x={lp(1900, 1290, r)} y={560} s={1.15} op={cl(r * 3)} />
  </Svg><Lbl tt={tt} at={1.4} x={900} y={760} tx="A FLOR DE TIERRA" bg={INK} /><Lbl tt={tt} at={4.6} x={1320} y={380} tx="¡LA HUELE!" bg={RED} col={INK} /></AbsoluteFill>;
}}</Stage>;
// 3 · siete pasos: un sendero de 7 piedras en el patio
const SietePasos: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs />
  <path d="M 260 820 C 600 700, 700 520, 960 520 C 1220 520, 1340 360, 1680 300" stroke="#6b4a2c" strokeWidth={120} fill="none" strokeLinecap="round" opacity={0.6} />
  {Array.from({ length: 7 }, (_, i) => { const k = i / 6, x = lp(300, 1640, k), y = 820 - 520 * k + 120 * Math.sin(k * 3.14); const s = P(tt, 0.4 + i * 0.5, 9, 0.5);
    return <g key={i} transform={`translate(${x},${y}) scale(${s})`}><ellipse rx={80} ry={52} fill={i === 6 ? AMB : "#cfc6b4"} stroke="#6e6656" strokeWidth={5} /><T x={0} y={18} tx={String(i + 1)} size={56} /></g>; })}
</Svg><Lbl tt={tt} at={4.0} x={1600} y={180} tx="EL 7: MACETAS" bg={AMB} /></AbsoluteFill>}</Stage>;
// 4 · treinta años: línea de vida con la pala de mano
const Treinta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const k = W(tt, 0.6, 4.2);
  return <AbsoluteFill><Svg><Defs />
    <line x1={340} y1={600} x2={lp(340, 1580, k)} y2={600} stroke={LEAF} strokeWidth={22} strokeLinecap="round" />
    {[["25", "CUERNAVACA", 0], ["QUINTAS", "AYUDANTE", 0.35], ["PATIOS", "DE CASAS", 0.7], ["HOY", "30 AÑOS", 1]].map(([a, b, p], i) => {
      const s = P(tt, 0.6 + 3.6 * (p as number), 8); const x = lp(340, 1580, p as number);
      return <g key={i} opacity={cl(s * 2)}><circle cx={x} cy={600} r={34 * s} fill={i === 3 ? AMB : INK} /><T x={x} y={520} tx={a as string} size={46} col={INK} /><T x={x} y={690} tx={b as string} size={34} col={i === 3 ? AMB : "#d9e8c8"} /></g>; })}
    <g transform={`translate(${lp(340, 1580, k)},${470}) rotate(${-30 + 10 * Math.sin(tt * 3)})`}><rect x={-10} y={-120} width={20} height={110} rx={8} fill="#7b4a2a" /><path d="M -40 -10 L 40 -10 L 20 90 L -20 90 Z" fill="#9aa3ab" stroke="#4b535a" strokeWidth={5} /></g>
  </Svg></AbsoluteFill>;
}}</Stage>;
// 5 · potasio: medidor que sube a 420 mg
const Potasio: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = W(tt, 1.0, 4.0);
  return <AbsoluteFill><Svg><Defs />
    <Banana x={760} y={560} s={2.2} rot={-6} ripe={1} />
    <rect x={1260} y={260} width={120} height={520} rx={60} fill="rgba(255,255,255,.12)" stroke={INK} strokeWidth={6} />
    <rect x={1272} y={272 + 496 * (1 - k)} width={96} height={496 * k} rx={48} fill={AMB} />
    <T x={1320} y={850} tx="K" size={90} col={AMB} />
  </Svg><Big tt={tt} at={2.6} x={1580} y={420} tx={`${Math.round(420 * k)}`} size={150} /><Lbl tt={tt} at={3.0} x={1580} y={540} tx="mg DE POTASIO" /><Lbl tt={tt} at={4.6} x={760} y={830} tx="LA CÁSCARA, CASI EL DOBLE" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 6 · el trío: fósforo, magnesio, calcio — fichas que caen al pie de la planta
const Trio: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={760} deep={300} />
  {[["P", "RAÍZ Y FLOR", "#e9a23b"], ["Mg", "HOJA VERDE", GRN], ["Ca", "UN POQUITO", "#cfd8e0"]].map(([a, b, c], i) => {
    const s = P(tt, 0.6 + i * 1.1, 7, 0.45), x = 560 + i * 400, y = lp(-200, 520, cl(s));
    return <g key={i} transform={`translate(${x},${y})`}><circle r={110} fill={c} stroke="#1b1206" strokeWidth={6} /><T x={0} y={30} tx={a} size={96} /><T x={0} y={200} tx={b} size={40} col={INK} op={cl(s * 2)} /></g>; })}
</Svg><Lbl tt={tt} at={4.4} x={960} y={200} tx="TODO EN POQUITO" hand bg="transparent" col={AMB} size={60} /></AbsoluteFill>}</Stage>;
// 7 · nitrógeno casi cero: dos medidores
const Gauge: React.FC<{ x: number; v: number; l: string; c: string }> = ({ x, v, l, c }) => <g transform={`translate(${x},620)`}>
  <path d="M -230 0 A 230 230 0 0 1 230 0" stroke="rgba(255,255,255,.18)" strokeWidth={46} fill="none" />
  <path d="M -230 0 A 230 230 0 0 1 230 0" stroke={c} strokeWidth={46} fill="none" strokeDasharray={723} strokeDashoffset={723 * (1 - v)} />
  <line x1={0} y1={0} x2={-200 * Math.cos(Math.PI * v)} y2={-200 * Math.sin(Math.PI * v)} stroke={INK} strokeWidth={12} strokeLinecap="round" /><circle r={22} fill={INK} />
  <T x={0} y={110} tx={l} size={80} col={c} /></g>;
const Nitro: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs /><Gauge x={600} v={0.85 * W(tt, 0.8, 3.0)} l="K" c={AMB} /><Gauge x={1320} v={0.06 * W(tt, 1.6, 3.2)} l="N" c={SKY} /></Svg>
  <Lbl tt={tt} at={3.4} x={1320} y={250} tx="CASI NADA" bg={SKY} /><Lbl tt={tt} at={4.6} x={960} y={900} tx="NO ES ABONO COMPLETO · ES UN EMPUJÓN" bg={INK} /></AbsoluteFill>}</Stage>;
// 8 · el reloj de la tierra
const Reloj: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = W(tt, 0.6, 5.0);
  return <AbsoluteFill><Svg><Defs />
    <rect x={260} y={560} width={1400} height={26} rx={13} fill="rgba(255,255,255,.18)" /><rect x={260} y={560} width={1400 * k} height={26} rx={13} fill={LEAF} />
    {[["DÍA 1", "NADA", 0, 1], ["DÍA 10-15", "YA NO ESTÁ", 0.45, 3], ["SEM 3-6", "BOTONES", 1, -1]].map(([a, b, p, r], i) => {
      const x = lp(330, 1590, p as number), s = P(tt, 0.6 + 4.4 * (p as number), 8);
      return <g key={i} opacity={cl(s * 2)}><T x={x} y={520} tx={a as string} size={44} col={INK} /><T x={x} y={680} tx={b as string} size={40} col={i === 2 ? AMB : "#d9e8c8"} />
        {(r as number) >= 0 ? <Banana x={x} y={420} s={0.5 * s} ripe={r as number} op={i === 1 ? 0.45 : 1} /> : <Rose x={x} y={470} s={0.45 * s} fl={5} bud={4} />}</g>; })}
  </Svg><Lbl tt={tt} at={1.6} x={560} y={820} tx="AL OTRO DÍA NO PASA NADA" bg={RED} col={INK} /></AbsoluteFill>;
}}</Stage>;
// 9 · la época: rueda del año
const Epoca: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const rot = 200 * W(tt, 0.6, 4.6);
  return <AbsoluteFill><Svg><Defs /><g transform={`translate(960,560) rotate(${rot})`}>
    {[["PRIMAVERA", GRN], ["VERANO", AMB], ["OTOÑO", "#d9873e"], ["INVIERNO", SKY]].map(([n, c], i) => <g key={i} transform={`rotate(${i * 90})`}>
      <path d="M 0 0 L 0 -330 A 330 330 0 0 1 330 0 Z" fill={c as string} opacity={0.85} stroke="#1b1206" strokeWidth={5} /><T x={170} y={-140} tx={n as string} size={34} /></g>)}
  </g><circle cx={960} cy={560} r={80} fill="#1b1206" /><path d="M 960 210 l -30 -50 l 60 0 Z" fill={INK} /></Svg>
    <Lbl tt={tt} at={2.2} x={420} y={360} tx="DORMIDO: NO COME" bg={SKY} /><Lbl tt={tt} at={4.4} x={1500} y={360} tx="EN SU ÉPOCA: FLORECE" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 10 · madurez: verde / pintas / negro / moho
const Madurez: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[[0, "VERDE", "TARDA EL DOBLE", 1, AMB], [2, "CON PINTAS", "PERFECTO", 1, GRN], [3, "NEGRO BLANDO", "DE LOS MEJORES", 1, GRN], [4, "CON MOHO", "NO", 0, RED]].map(([r, a, b, ok, c], i) => {
    const s = P(tt, 0.4 + i * 1.3, 8), x = 360 + i * 400;
    return <g key={i} opacity={cl(s * 2)}><Banana x={x} y={460} s={0.85 * s} rot={-20} ripe={r as number} /><T x={x} y={640} tx={a as string} size={38} col={INK} /><T x={x} y={700} tx={b as string} size={32} col={c as string} />
      <Check x={x} y={800} ok={!!ok} s={P(tt, 1.0 + i * 1.3, 9)} /></g>; })}
</Svg></AbsoluteFill>}</Stage>;
// 11 · Doña Chela: el jazmín contra la pared, contador de flores
const Chela: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = W(tt, 3.0, 6.0), n = Math.round(lp(3, 40, k));
  return <AbsoluteFill><Svg><Defs />
    <rect x={460} y={160} width={1000} height={700} fill="#e9e1cf" /><rect x={460} y={160} width={1000} height={700} fill="url(#grit)" opacity={0.3} />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${960 + (i - 7) * 50} 860 C ${960 + (i - 7) * 70} 600, ${960 + (i - 7) * 30} 400, ${960 + (i - 7) * 64} ${260 + (i % 3) * 30}`} stroke={LEAFD} strokeWidth={8} fill="none" />)}
    {Array.from({ length: n }, (_, i) => <g key={"f" + i} transform={`translate(${560 + ((i * 197) % 800)},${240 + ((i * 131) % 520)})`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-12} rx={8} ry={14} fill="#fffaf0" transform={`rotate(${a})`} />)}<circle r={5} fill={AMB} /></g>)}
  </Svg><Lbl tt={tt} at={0.8} x={960} y={110} tx="EL JAZMÍN DE DOÑA CHELA" bg={INK} /><Big tt={tt} at={1.4} x={1660} y={520} tx={String(n)} size={160} col={INK} /><Lbl tt={tt} at={1.6} x={1660} y={640} tx="FLORES" /></AbsoluteFill>;
}}</Stage>;
// 12 · cada corte es una puerta
const Trozos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const c = W(tt, 1.6, 3.0);
  return <AbsoluteFill><Svg><Defs />
    <Banana x={520} y={520} s={1.2} rot={-8} ripe={2} /><T x={520} y={720} tx="ENTERO: 2 MESES" size={46} col={RED} />
    {[0, 1, 2, 3, 4].map((i) => <Chunk key={i} x={lp(1360, 1080 + i * 140, c)} y={lp(520, 520 + (i % 2) * 50, c)} s={1.6} rot={(i - 2) * 8 * c} />)}
    {c > 0.9 && [0, 1, 2, 3, 4].map((i) => <circle key={"g" + i} cx={1080 + i * 140 + 50} cy={520 + (i % 2) * 50} r={20 + 10 * Math.sin(tt * 4 + i)} fill="none" stroke={GRN} strokeWidth={5} />)}
  </Svg><Lbl tt={tt} at={3.2} x={1360} y={720} tx="5 TROZOS: 2 SEMANAS" bg={GRN} /><Lbl tt={tt} at={4.4} x={1360} y={300} tx="CON CÁSCARA" hand bg="transparent" col={AMB} size={60} /></AbsoluteFill>;
}}</Stage>;
// 13 · el palmo: mano abierta y regla 18-20 cm
const Palmo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const o = W(tt, 0.5, 2.0), rl = W(tt, 1.6, 2.8);
  return <AbsoluteFill><Svg><Defs />
    <g transform="translate(960,470)">
      <ellipse cx={0} cy={60} rx={170} ry={150} fill="#c48a5e" />
      {[[-300, -40], [-150, -260], [-30, -300], [90, -280], [200, -200]].map(([x, y], i) =>
        <line key={i} x1={i === 0 ? -120 : (i - 2) * 60} y1={-40} x2={lp(i === 0 ? -150 : x * 0.5, x, o)} y2={lp(-120, y, o)} stroke="#c48a5e" strokeWidth={i === 0 ? 70 : 58} strokeLinecap="round" />)}
    </g>
    <rect x={620} y={720} width={680 * rl} height={80} rx={8} fill={AMB} stroke="#7a5a08" strokeWidth={4} />
    {Array.from({ length: 21 }, (_, i) => i * 34 < 680 * rl && <line key={i} x1={620 + i * 34} y1={720} x2={620 + i * 34} y2={i % 5 ? 750 : 770} stroke="#1b1206" strokeWidth={4} />)}
  </Svg><Big tt={tt} at={3.0} x={1580} y={540} tx="18-20" size={140} /><Lbl tt={tt} at={3.2} x={1580} y={650} tx="CENTÍMETROS" /><Lbl tt={tt} at={4.4} x={960} y={900} tx="TU PALMO ES TU MEDIDA" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 14 · un palmo de hondo: el hoyo baja y aparecen las raíces finas
const Hondo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const d = W(tt, 0.6, 2.6), r = W(tt, 2.4, 4.4);
  return <AbsoluteFill><Svg><Defs /><Ground y={340} deep={640} />
    <path d={`M 860 340 L 860 ${340 + 300 * d} Q 960 ${380 + 300 * d} 1060 ${340 + 300 * d} L 1060 340 Z`} fill="#2a180c" />
    {d > 0.95 && [0, 1, 2, 3, 4].map((i) => <Chunk key={i} x={890 + i * 35} y={600 + (i % 2) * 20} s={0.7} rot={i * 20} />)}
    <Roots x={760} y={560} k={r} /><Roots x={1180} y={560} k={r} />
    <line x1={1140} y1={340} x2={1140} y2={340 + 300 * d} stroke={AMB} strokeWidth={8} /><T x={1170} y={340 + 160 * d} tx="15-20 cm" size={44} col={AMB} anchor="start" op={d} />
  </Svg><Lbl tt={tt} at={3.6} x={560} y={900} tx="AHÍ COMEN LAS RAÍCES FINAS" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 15 · el olor: a 5 cm sube y llega a la rata; a un palmo la tierra lo tapa
const Smell: React.FC<{ x: number; tt: number; top: boolean }> = ({ x, tt, top }) => <g>{[0, 1, 2].map((i) => { const k = (tt * 0.5 + i / 3) % 1, hi = top ? 300 : 70;
  return <path key={i} d={`M ${x + i * 36} ${top ? 520 : 760} q 18 -26 0 -52 q -18 -26 0 -52`} stroke="#c9b26a" strokeWidth={7} fill="none" transform={`translate(0,${-k * hi})`} opacity={(1 - k) * cl(tt - 0.6)} />; })}</g>;
const Olor: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={520} x0={160} x1={940} deep={420} /><Ground y={520} x0={980} x1={1760} deep={420} />
  <Banana x={540} y={548} s={0.6} ripe={2} /><Smell x={500} tt={tt} top /><Rat x={760} y={300} s={0.8} op={cl(W(tt, 1.6, 2.6) * 2)} />
  <Banana x={1370} y={800} s={0.6} ripe={2} /><Smell x={1330} tt={tt} top={false} />
</Svg><Lbl tt={tt} at={0.6} x={550} y={980} tx="A 5 CM" bg={RED} col={INK} /><Lbl tt={tt} at={2.8} x={1370} y={980} tx="A UN PALMO" bg={GRN} /><Lbl tt={tt} at={3.6} x={1370} y={330} tx="NO SALE NADA" hand bg="transparent" col={GRN} size={56} /></AbsoluteFill>}</Stage>;
// 16 · el segundo palmo: vista desde arriba, anillo a un palmo del tallo
const Costado: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const r = W(tt, 0.8, 2.4);
  return <AbsoluteFill><Svg><Defs /><circle cx={960} cy={540} r={430} fill="url(#soil)" /><circle cx={960} cy={540} r={430} fill="url(#grit)" />
    <circle cx={960} cy={540} r={60} fill={LEAFD} stroke="#1b1206" strokeWidth={6} /><circle cx={960} cy={540} r={120} fill="rgba(226,69,47,.35)" stroke={RED} strokeWidth={6} strokeDasharray="14 10" />
    <circle cx={960} cy={540} r={280 * r} fill="none" stroke={AMB} strokeWidth={10} strokeDasharray="30 18" />
    <Arrow x1={1020} y1={540} x2={1240} y2={540} k={r} />
    {[0, 180].map((a, i) => { const s = P(tt, 2.6 + i * 0.6, 9); return <circle key={i} cx={960 + 280 * Math.cos(a * Math.PI / 180)} cy={540 + 280 * Math.sin(a * Math.PI / 180)} r={50 * s} fill="#2a180c" stroke={AMB} strokeWidth={5} />; })}
  </Svg><Lbl tt={tt} at={1.4} x={960} y={360} tx="NUNCA PEGADO" bg={RED} col={INK} /><Lbl tt={tt} at={2.8} x={1540} y={540} tx="UN PALMO" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 17 · el cuello: raíces gruesas cerca, finas lejos
const Cuello: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const g = 0.5 + 0.5 * Math.sin(tt * 3), r = W(tt, 2.4, 4.4);
  return <AbsoluteFill><Svg><Defs /><Ground y={560} deep={460} />
    <Rose x={960} y={560} s={1.0} fl={3} bud={2} />
    <ellipse cx={960} cy={566} rx={70} ry={26} fill="none" stroke={RED} strokeWidth={8} opacity={(0.5 + 0.5 * g) * cl(tt - 0.8)} />
    {[-50, 0, 50].map((dx, i) => <path key={i} d={`M 960 570 Q ${960 + dx} 660 ${960 + dx * 1.6} 760`} stroke="#b89a70" strokeWidth={22} fill="none" opacity={cl(tt - 1.4)} />)}
    <Roots x={720} y={700} k={r} /><Roots x={1200} y={700} k={r} />
  </Svg><Lbl tt={tt} at={1.0} x={620} y={470} tx="EL CUELLO" bg={RED} col={INK} /><Lbl tt={tt} at={2.0} x={960} y={880} tx="RAÍCES GRUESAS: NO COMEN" bg={INK} /><Lbl tt={tt} at={3.6} x={1450} y={680} tx="LAS FINAS, SÍ" bg={GRN} /></AbsoluteFill>;
}}</Stage>;
// 18 · Don Aurelio: 4 días en fichas
const Aurelio: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["DÍA 1", "PEGADO AL TALLO"], ["DÍA 2", "A 5 CM"], ["DÍA 3", "OLOR"], ["DÍA 4", "LA RATA"]].map(([a, b], i) => {
    const s = P(tt, 0.4 + i * 1.1, 8); const x = 420 + i * 360;
    return <Card key={i} x={x} y={520} w={300} h={380} s={s} rot={-8} bg={i === 3 ? "#f6d7cf" : INK}>
      <rect x={-150} y={-190} width={300} height={70} rx={20} fill={i === 3 ? RED : LEAFD} /><T x={0} y={-140} tx={a} size={40} col={INK} /><T x={0} y={140} tx={b} size={30} />
      {i === 3 ? <Rat x={20} y={20} s={0.8} /> : i === 2 ? <g>{[0, 1, 2].map((j) => <path key={j} d={`M ${-40 + j * 40} 60 q 16 -26 0 -52 q -16 -26 0 -52`} stroke="#b89a40" strokeWidth={7} fill="none" />)}</g> : <Banana x={0} y={20} s={0.55} ripe={2} />}
    </Card>; })}
</Svg><Lbl tt={tt} at={5.2} x={960} y={860} tx="EL ROSAL PERDIÓ DOS RAMAS" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 19 · la dosis
const Dosis: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <Rose x={560} y={760} s={1.0} fl={4} bud={3} /><Rose x={1360} y={760} s={1.45} fl={7} bud={4} />
  <Banana x={560} y={330} s={0.7 * P(tt, 1.2)} ripe={2} />
  {[0, 1].map((i) => <Banana key={i} x={1280 + i * 170} y={200} s={0.6 * P(tt, 3.0 + i * 0.4)} ripe={2} rot={i ? 10 : -10} />)}
  {[-1, 1].map((sd) => <circle key={sd} cx={560 + sd * 190} cy={800} r={34 * P(tt, 2.0)} fill="#2a180c" stroke={AMB} strokeWidth={5} />)}
</Svg><Lbl tt={tt} at={1.4} x={560} y={900} tx="MEDIANA: 1 AL MES" bg={INK} /><Lbl tt={tt} at={3.4} x={1360} y={900} tx="GRANDE: 2" bg={AMB} /><Lbl tt={tt} at={2.2} x={560} y={180} tx="2 HOYOS" hand bg="transparent" col={AMB} size={54} /></AbsoluteFill>}</Stage>;
// 20 · demasiado: el hoyo lleno, el aire se apaga, la acidez sube
const Demasiado: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const n = Math.min(7, Math.floor(tt * 2.2)), a = W(tt, 2.6, 4.6);
  return <AbsoluteFill><Svg><Defs /><Ground y={380} deep={600} />
    <path d="M 640 380 L 680 800 L 1240 800 L 1280 380 Z" fill="#2a180c" />
    {Array.from({ length: n }, (_, i) => <Banana key={i} x={760 + (i % 3) * 200} y={740 - Math.floor(i / 3) * 110} s={0.55} rot={(i % 2 ? 1 : -1) * 12} ripe={i > 3 ? 3 : 2} />)}
    {Array.from({ length: 10 }, (_, i) => <circle key={"b" + i} cx={380 + (i % 5) * 50 + (i > 4 ? 1100 : 0)} cy={520 + (i * 47) % 300} r={14} fill="none" stroke="#d8f0ff" strokeWidth={4} opacity={1 - a} />)}
    <rect x={1700} y={300} width={60} height={400} rx={30} fill="rgba(255,255,255,.15)" stroke={INK} strokeWidth={5} /><rect x={1708} y={308 + 384 * (1 - a)} width={44} height={384 * a} rx={22} fill={RED} />
  </Svg><Lbl tt={tt} at={3.4} x={1730} y={780} tx="ÁCIDA" bg={RED} col={INK} /><Lbl tt={tt} at={4.4} x={960} y={250} tx="SE PUDRE · LA RAÍZ SIN AIRE" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 21 · cuándo: la tira de meses
const Calendario: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const M = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return <AbsoluteFill><Svg><Defs />
    {M.map((m, i) => { const s = P(tt, 0.3 + i * 0.12, 9), fl = i >= 2 && i <= 9, st = i === 1;
      return <g key={i} opacity={cl(s * 2)} transform={`translate(${300 + i * 120},${520})`}><rect x={-52} y={-90} width={104} height={180} rx={16} fill={st ? AMB : fl ? "#f6d7e1" : INK} stroke="#1b1206" strokeWidth={4} /><T x={0} y={-30} tx={m} size={50} />
        {fl && <Banana x={0} y={40} s={0.2 * P(tt, 2.6 + i * 0.18, 9)} ripe={2} />}</g>; })}
  </Svg><Lbl tt={tt} at={1.6} x={460} y={320} tx="HOJITAS ROJIZAS: EMPIEZA" bg={AMB} /><Lbl tt={tt} at={3.8} x={1200} y={760} tx="UNA VEZ AL MES MIENTRAS FLORECE" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 22 · la cuenta: 4 plátanos al año que salen del bote
const Cuenta: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <path d="M 1340 480 L 1640 480 L 1610 840 L 1370 840 Z" fill="#6a7178" stroke="#3a4148" strokeWidth={8} /><rect x={1320} y={450} width={340} height={40} rx={10} fill="#848c93" />
  {[0, 1, 2, 3].map((i) => { const k = W(tt, 0.6 + i * 0.8, 1.4 + i * 0.8); return <Banana key={i} x={lp(1490, 380 + i * 250, k)} y={560 - 200 * Math.sin(k * Math.PI)} s={0.7} rot={k * 36} ripe={2} />; })}
</Svg><Big tt={tt} at={3.8} x={760} y={820} tx="4 AL AÑO" size={130} /><Lbl tt={tt} at={4.6} x={1490} y={330} tx="NO A LA BASURA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 23 · sí / no
const SiNo: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={220} y={200} width={700} height={700} rx={30} fill="rgba(108,196,106,.16)" stroke={GRN} strokeWidth={6} /><rect x={1000} y={200} width={700} height={700} rx={30} fill="rgba(226,69,47,.12)" stroke={RED} strokeWidth={6} />
  {["ROSAL", "BUGAMBILIA", "HIBISCO", "JAZMÍN", "TOMATE · LIMÓN"].map((n, i) => <g key={n} opacity={cl(P(tt, 0.6 + i * 0.5) * 2)}><circle cx={300} cy={340 + i * 120} r={22} fill={ROSE} /><T x={350} y={356 + i * 120} tx={n} size={44} col={INK} anchor="start" /></g>)}
  {["HELECHO", "COSTILLA DE ADÁN", "PASTO · LECHUGA", "CACTUS"].map((n, i) => <g key={n} opacity={cl(P(tt, 3.4 + i * 0.5) * 2)}><circle cx={1080} cy={340 + i * 120} r={22} fill={LEAF} /><T x={1130} y={356 + i * 120} tx={n} size={44} col={INK} anchor="start" /></g>)}
  <Check x={870} y={250} ok s={P(tt, 0.4)} /><Check x={1650} y={250} ok={false} s={P(tt, 3.2)} />
</Svg></AbsoluteFill>}</Stage>;
// 24 · seis horas de sol
const Sol: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = W(tt, 0.6, 4.6), a = Math.PI * (1 - k);
  return <AbsoluteFill><Svg><Defs />
    <path d="M 360 760 A 600 520 0 0 1 1560 760" stroke="rgba(255,210,58,.4)" strokeWidth={8} fill="none" strokeDasharray="20 16" />
    <Sun x={960 + 600 * Math.cos(a)} y={760 - 520 * Math.sin(a)} r={70} />
    <Rose x={960} y={900} s={0.8} fl={Math.round(lp(1, 8, k))} bud={3} />
  </Svg><Big tt={tt} at={1.0} x={1660} y={300} tx={`${Math.max(1, Math.round(6 * k))} H`} size={150} /><Lbl tt={tt} at={4.6} x={960} y={140} tx="EL PLÁTANO NO REEMPLAZA AL SOL" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 25 · tapar: capas que se apilan
const Tapar: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const L = [["TROZOS", "#e8c23a"], ["PUÑITO Y APRIETO", "#6b4428"], ["EL RESTO, FIRME", "#5a3820"], ["ACOLCHADO", "#c9a060"]];
  return <AbsoluteFill><Svg><Defs />
    <path d="M 640 260 L 680 860 L 1120 860 L 1160 260" fill="none" stroke="#3b2414" strokeWidth={14} />
    {L.map(([n, c], i) => { const s = P(tt, 0.4 + i * 1.3, 7, 0.45), y0 = 860 - (i + 1) * 140;
      return <g key={i} transform={`translate(0,${(1 - cl(s)) * -500})`} opacity={cl(s * 3)}><rect x={685 + i * 6} y={y0} width={430 - i * 12} height={136} rx={10} fill={c} />
        {i === 0 && [0, 1, 2, 3, 4].map((j) => <Chunk key={j} x={740 + j * 80} y={y0 + 70} s={0.7} rot={j * 25} />)}
        {i === 3 && Array.from({ length: 9 }, (_, j) => <ellipse key={j} cx={720 + j * 45} cy={y0 + 50 + (j % 2) * 30} rx={30} ry={12} fill="#9a6a30" transform={`rotate(${j * 40} ${720 + j * 45} ${y0 + 60})`} />)}
        <T x={1230} y={y0 + 82} tx={n} size={44} col={INK} anchor="start" /></g>; })}
  </Svg></AbsoluteFill>;
}}</Stage>;
// 26 · el agua lleva el potasio
const Riego: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={300} deep={700} />
  <Roots x={960} y={760} k={1} />{[0, 1, 2, 3].map((i) => <Chunk key={i} x={880 + i * 50} y={470} s={0.7} rot={i * 30} />)}
  {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 0.35 + i / 6) % 1), x = 860 + (i % 3) * 100, y = lp(220, 860, k);
    return <g key={i} opacity={cl(tt - 0.5) * (k < 0.9 ? 1 : (1 - k) * 10)}><Drop x={x} y={y} s={0.7} />{y > 480 && <g><circle cx={x + 30} cy={y + 10} r={20} fill={AMB} /><T x={x + 30} y={y + 20} tx="K" size={26} /></g>}</g>; })}
</Svg><Lbl tt={tt} at={1.4} x={480} y={200} tx="SIN AGUA, NO LLEGA" bg={RED} col={INK} /><Lbl tt={tt} at={3.2} x={1450} y={900} tx="RIEGO LENTO Y HONDO" bg={SKY} /></AbsoluteFill>}</Stage>;
// 27 · esponja exprimida
const Esponja: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = W(tt, 0.6, 3.0);
  return <AbsoluteFill><Svg><Defs />
    {[["SECA", "#c9a070", 0], ["ESPONJA EXPRIMIDA", "#e9cf6a", 1], ["ENCHARCADA", "#7cb4d6", 2]].map(([n, c, i]) => <g key={n as string} transform={`translate(${520 + (i as number) * 440},540)`}>
      <rect x={-170} y={-120} width={340} height={200} rx={40} fill={c as string} stroke="#1b1206" strokeWidth={5} opacity={i === 1 ? 1 : 0.55} />
      {Array.from({ length: 10 }, (_, j) => <circle key={j} cx={-120 + (j % 5) * 60} cy={-60 + Math.floor(j / 5) * 70} r={14} fill="rgba(0,0,0,.18)" />)}
      <T x={0} y={160} tx={n as string} size={38} col={INK} /></g>)}
    <path d={`M ${lp(520, 960, k)} 390 l -30 -50 l 60 0 Z`} fill={AMB} />
  </Svg><Lbl tt={tt} at={3.6} x={960} y={860} tx="NI ENCHARCADA NI SECA" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 28 · maceta de 20 L
const Maceta: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = W(tt, 1.0, 2.6);
  return <AbsoluteFill><Svg><Defs /><Pot x={860} y={640} s={1.25} cut />
    <Rose x={860} y={330} s={0.6} fl={3} bud={2} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={1040 + (i % 2) * 34} y={lp(200, 400 + i * 22, k)} width={24} height={18} rx={6} fill={BAN} stroke="#4a3208" strokeWidth={3} />)}
    <line x1={1180} y1={320} x2={1180} y2={460} stroke={AMB} strokeWidth={7} /><T x={1200} y={410} tx="10 cm" size={42} col={AMB} anchor="start" />
  </Svg><Lbl tt={tt} at={0.6} x={460} y={300} tx="20 LITROS O MÁS" bg={INK} /><Lbl tt={tt} at={3.0} x={1500} y={600} tx="MEDIO PLÁTANO · AL BORDE" bg={AMB} /><Lbl tt={tt} at={4.6} x={1500} y={720} tx="UNA VEZ AL MES" bg={INK} /></AbsoluteFill>;
}}</Stage>;
// 29 · el fermentado: el agua se pone color té en 3 días
const Fermentado: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const d = W(tt, 0.6, 4.0), day = Math.min(3, 1 + Math.floor(d * 3));
  return <AbsoluteFill><Svg><Defs /><Jar x={760} y={580} s={1.1} tea={d}>{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-80 + (i % 3) * 80} cy={40 + Math.floor(i / 3) * 90 + 6 * Math.sin(tt + i)} r={36} fill="#f6e7a8" stroke="#c9a640" strokeWidth={4} opacity={1 - 0.4 * d} />)}</Jar></Svg>
    <Big tt={tt} at={0.6} x={760} y={170} tx={`DÍA ${day}`} size={110} col={INK} />
    <Lbl tt={tt} at={4.2} x={1420} y={420} tx="HUELE DULCE: SIRVE" bg={GRN} /><Lbl tt={tt} at={5.2} x={1420} y={560} tx="A HUEVO: SE TIRA" bg={RED} col={INK} /></AbsoluteFill>;
}}</Stage>;
// 30 · la dilución: una taza en dos litros
const Dilucion: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = W(tt, 1.2, 2.6);
  return <AbsoluteFill><Svg><Defs />
    <g transform={`translate(${lp(640, 900, p)},${lp(560, 360, p)}) rotate(${110 * p})`}><path d="M -70 -80 L 70 -80 L 56 80 L -56 80 Z" fill="#f4f1ea" stroke="#9a8f80" strokeWidth={6} /><rect x={-60} y={-40} width={120} height={110} fill="#a8742f" opacity={1 - p * 0.8} /></g>
    {p > 0.6 && <path d={`M 1000 420 Q 1030 520 1060 ${lp(560, 620, p)}`} stroke="#a8742f" strokeWidth={22} fill="none" opacity={1 - W(tt, 3.0, 3.6)} />}
    <path d="M 900 560 L 1300 560 L 1260 900 L 940 900 Z" fill="#3d8f4a" stroke="#1f5a2a" strokeWidth={8} /><rect x={930} y={600} width={340} height={280} fill="rgba(200,160,90,.55)" />
  </Svg><Big tt={tt} at={0.4} x={560} y={820} tx="1 TAZA" size={110} col={INK} /><Big tt={tt} at={1.8} x={1100} y={260} tx="+ 2 LITROS" size={110} col={SKY} /><Lbl tt={tt} at={3.6} x={1560} y={760} tx="NUNCA PURO" bg={RED} col={INK} /></AbsoluteFill>;
}}</Stage>;
// 31 · semana por semana
const Semanas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["SEM 1", "HILITOS BLANCOS", 2, 0, 0], ["SEM 2", "PASTA OSCURA", 3, 2, 0], ["SEM 3-4", "BOTONES", -1, 3, 5], ["SEM 5-6", "ABRE TODO", -1, 9, 3]].map(([a, b, r, f, bd], i) => {
    const s = P(tt, 0.4 + i * 1.5, 8); const x = 360 + i * 400;
    return <Card key={i} x={x} y={540} w={340} h={560} s={s} rot={6}>
      <rect x={-170} y={-280} width={340} height={70} rx={22} fill={i >= 2 ? ROSE : LEAFD} /><T x={0} y={-230} tx={a as string} size={42} col={INK} />
      <Rose x={0} y={20} s={0.45} fl={f as number} bud={bd as number} />
      <rect x={-150} y={40} width={300} height={140} rx={14} fill={SOIL} />{(r as number) >= 0 && <Banana x={0} y={100} s={0.4} ripe={r as number} op={i === 1 ? 0.5 : 1} />}
      {i === 0 && [0, 1, 2, 3].map((j) => <path key={j} d={`M ${-60 + j * 40} 70 q 10 30 -10 60`} stroke="#fff" strokeWidth={2} fill="none" />)}
      <T x={0} y={240} tx={b as string} size={30} /></Card>; })}
</Svg></AbsoluteFill>}</Stage>;
// 32 · cinco plantas, cinco medidas
const Plantas5: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={300} y={160} width={1320} height={800} rx={26} fill="#f3ead6" stroke="#8a6a40" strokeWidth={8} />
  {[["ROSAL", "1 AL MES · 2 HOYOS"], ["BUGAMBILIA", "1 AL MES, NO MÁS"], ["HIBISCO", "1 CADA 3 SEMANAS"], ["TOMATE", "½ CON EL 1er RACIMO"], ["JAZMÍN", "1 AL MES + PODA"]].map(([a, b], i) => {
    const s = P(tt, 0.5 + i * 0.9, 9);
    return <g key={a} opacity={cl(s * 2)} transform={`translate(${(1 - s) * -80},0)`}><circle cx={400} cy={270 + i * 150} r={44} fill={[ROSE, "#c2338a", RED, "#e2452f", "#fffaf0"][i]} stroke="#1b1206" strokeWidth={4} />
      <T x={480} y={290 + i * 150} tx={a} size={52} anchor="start" /><T x={1560} y={290 + i * 150} tx={b} size={44} col={LEAFD} anchor="end" /><line x1={360} y1={340 + i * 150} x2={1560} y2={340 + i * 150} stroke="#c9b48a" strokeWidth={3} /></g>; })}
</Svg></AbsoluteFill>}</Stage>;
// 33 · la bugambilia: tres perillas
const Knob: React.FC<{ x: number; v: number; l: string; c: string }> = ({ x, v, l, c }) => <g transform={`translate(${x},560)`}><circle r={130} fill="#2b3640" stroke={INK} strokeWidth={6} />
  <line x1={0} y1={0} x2={110 * Math.cos(Math.PI * (0.75 + 1.5 * v))} y2={110 * Math.sin(Math.PI * (0.75 + 1.5 * v))} stroke={c} strokeWidth={16} strokeLinecap="round" /><circle r={20} fill={c} /><T x={0} y={200} tx={l} size={44} col={INK} /></g>;
const Bugambilia: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs /><Knob x={520} v={W(tt, 0.6, 2.0)} l="SOL: MUCHO" c={AMB} /><Knob x={960} v={0.2 * W(tt, 1.6, 2.6)} l="AGUA: POCA" c={SKY} /><Knob x={1400} v={0.15 * W(tt, 2.4, 3.2)} l="COMIDA: POCA" c={GRN} /></Svg>
  <Lbl tt={tt} at={3.4} x={960} y={220} tx="FLORECE CUANDO SUFRE UN POQUITO" bg={INK} /><Lbl tt={tt} at={4.8} x={960} y={900} tx="DE MÁS: HOJAS Y ESPINAS" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 34 · cinco errores
const Errores: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {["PEGADO AL TALLO", "EN LA SUPERFICIE", "ENTERO", "DEMASIADOS", "SIN SOL / FUERA DE ÉPOCA"].map((n, i) => {
    const s = P(tt, 0.4 + i * 0.4, 9), x = i < 3 ? 440 + i * 520 : 700 + (i - 3) * 520, y = i < 3 ? 380 : 700, cr = W(tt, 2.6 + i * 0.9, 3.0 + i * 0.9);
    return <Card key={n} x={x} y={y} w={460} h={220} s={s} bg={i === 4 ? "#ffe9b0" : INK}><T x={0} y={-30} tx={String(i + 1)} size={70} col={RED} /><T x={0} y={60} tx={n} size={i === 4 ? 30 : 38} />
      <line x1={-200} y1={-80} x2={lp(-200, 200, cr)} y2={lp(-80, 80, cr)} stroke={RED} strokeWidth={12} strokeLinecap="round" opacity={cr > 0.01 ? 1 : 0} /></Card>; })}
</Svg></AbsoluteFill>}</Stage>;
// 35 · la rutina del sábado
const Rutina: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <AbsoluteFill><Svg><Defs />
  <circle cx={430} cy={520} r={220} fill={INK} stroke="#1b1206" strokeWidth={10} />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={426} y={316} width={8} height={30} fill="#1b1206" transform={`rotate(${i * 30} 430 520)`} />)}
  <line x1={430} y1={520} x2={430 + 150 * Math.sin(tt * 1.2)} y2={520 - 150 * Math.cos(tt * 1.2)} stroke={RED} strokeWidth={10} strokeLinecap="round" /><line x1={430} y1={520} x2={430} y2={400} stroke="#1b1206" strokeWidth={14} strokeLinecap="round" />
  {["VIERNES: SEPARO 3 PLÁTANOS", "SÁBADO: CORTO EN 5", "UN PALMO Y UN PALMO", "RIEGO Y PALITO", "MARTES: CUELO EL FRASCO", "APUNTO LA FECHA"].map((n, i) => {
    const s = P(tt, 0.6 + i * 1.0, 9);
    return <g key={n} opacity={cl(s * 2)}><Check x={800} y={250 + i * 120} ok s={s} /><T x={870} y={266 + i * 120} tx={n} size={46} col={INK} anchor="start" /></g>; })}
</Svg><Lbl tt={tt} at={0.4} x={430} y={840} tx="15 MINUTOS" bg={AMB} /></AbsoluteFill>}</Stage>;
// 36 · el palito: cada mes el hoyo nuevo gira como un reloj
const Palito: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <circle cx={960} cy={540} r={420} fill="url(#soil)" /><circle cx={960} cy={540} r={420} fill="url(#grit)" /><circle cx={960} cy={540} r={60} fill={LEAFD} />
  {Array.from({ length: 6 }, (_, i) => { const s = P(tt, 0.5 + i * 0.8, 9), a = -Math.PI / 2 + i * Math.PI / 3, x = 960 + 280 * Math.cos(a), y = 540 + 280 * Math.sin(a);
    return <g key={i} opacity={cl(s * 2)}><circle cx={x} cy={y} r={46} fill="#2a180c" /><rect x={x + 30} y={y - 90 * s} width={12} height={90 * s} rx={4} fill="#c9a060" /><T x={x} y={y + 90} tx={["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"][i]} size={34} col={INK} /></g>; })}
</Svg><Lbl tt={tt} at={4.8} x={960} y={90} tx="GIRA COMO UN RELOJ" bg={AMB} /></AbsoluteFill>}</Stage>;
// 37 · las tres de Don Tomás: cuaderno
const Tomas3: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform="rotate(-2 960 540)"><rect x={480} y={180} width={960} height={720} rx={14} fill="#f6efdc" stroke="#9a8a6a" strokeWidth={6} />{Array.from({ length: 9 }, (_, i) => <line key={i} x1={480} y1={300 + i * 70} x2={1440} y2={300 + i * 70} stroke="#bcd0e0" strokeWidth={3} />)}
    <line x1={580} y1={180} x2={580} y2={900} stroke="#e08a8a" strokeWidth={4} /><T x={620} y={260} tx="Don Tomás — nunca:" size={56} col="#8a3020" anchor="start" hand />
    {["1. en invierno, con la tierra fría", "2. a la recién trasplantada", "3. en lugar de la composta"].map((n, i) => <T key={n} x={620} y={420 + i * 140} tx={n} size={52} col={NAVY} anchor="start" hand op={cl(P(tt, 0.8 + i * 1.4) * 2)} />)}
  </g></Svg></AbsoluteFill>}</Stage>;
// 38 · el postre y la comida
const Postre: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`translate(700,560) scale(${P(tt, 0.3)})`}><ellipse rx={330} ry={110} fill="#f4f1ea" stroke="#9a8f80" strokeWidth={6} /><ellipse rx={260} ry={80} fill="#4a2e18" /><ellipse rx={260} ry={80} fill="url(#grit)" /></g>
  <g transform={`translate(1380,600) scale(${P(tt, 1.6)})`}><ellipse rx={190} ry={66} fill="#f4f1ea" stroke="#9a8f80" strokeWidth={6} />{[0, 1, 2].map((i) => <Chunk key={i} x={-60 + i * 60} y={-10} s={0.8} rot={i * 20} />)}</g>
</Svg><Lbl tt={tt} at={0.8} x={700} y={790} tx="LA COMPOSTA ES LA COMIDA" bg={INK} /><Lbl tt={tt} at={2.0} x={1380} y={790} tx="EL PLÁTANO, EL POSTRE" bg={AMB} /></AbsoluteFill>}</Stage>;
// 39 · señal 1: la hoja vieja con el borde quemado
const Leaf: React.FC<{ x: number; burn: number; yel: number }> = ({ x, burn, yel }) => <g transform={`translate(${x},520)`}>
  <path d="M 0 -300 C 190 -200, 210 160, 0 300 C -210 160, -190 -200, 0 -300 Z" fill={`rgb(${lp(79, 214, yel)},${lp(154, 196, yel)},${lp(60, 70, yel)})`} stroke={`rgb(${lp(79, 120, burn)},${lp(154, 70, burn)},${lp(60, 30, burn)})`} strokeWidth={10 + 34 * burn} />
  <line x1={0} y1={-280} x2={0} y2={300} stroke="#2f6b25" strokeWidth={8} /></g>;
const Hoja: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs /><Leaf x={640} burn={W(tt, 0.8, 2.8)} yel={0} /><Leaf x={1280} burn={0} yel={W(tt, 2.0, 3.6)} /></Svg>
  <Lbl tt={tt} at={2.4} x={640} y={920} tx="BORDE QUEMADO: FALTA POTASIO" bg={AMB} /><Lbl tt={tt} at={3.8} x={1280} y={920} tx="TODA AMARILLA: OTRA COSA" bg={INK} /></AbsoluteFill>}</Stage>;
// 40 · señal 2: los botones caen sin abrir
const Boton: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs /><Ground y={860} deep={200} />
  <path d="M 960 860 C 940 600, 980 420, 960 220" stroke={LEAFD} strokeWidth={16} fill="none" />{[300, 420, 540].map((y, i) => <path key={i} d={`M 960 ${y} q ${i % 2 ? 140 : -140} -30 ${i % 2 ? 200 : -200} 20`} stroke={LEAFD} strokeWidth={10} fill="none" />)}
  {[[760, 340], [1160, 460], [760, 560], [1100, 260]].map(([x, y], i) => { const f = W(tt, 1.2 + i * 0.8, 2.2 + i * 0.8), yy = lp(y, 840, f * f); return <ellipse key={i} cx={x} cy={yy} rx={16} ry={26} fill="#c0386a" stroke={LEAFD} strokeWidth={5} transform={`rotate(${f * 120} ${x} ${yy})`} />; })}
</Svg><Lbl tt={tt} at={3.8} x={1450} y={300} tx="SE CAEN SIN ABRIR" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 41 · señal 3: el tallo
const Tallo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const b = W(tt, 0.8, 2.4);
  return <AbsoluteFill><Svg><Defs /><Ground y={880} deep={200} />
    <path d={`M 640 880 Q 640 ${lp(560, 640, b)} ${lp(640, 860, b)} ${lp(340, 620, b)}`} stroke="#7ab85a" strokeWidth={14} fill="none" /><circle cx={lp(640, 860, b)} cy={lp(320, 620, b)} r={46} fill={ROSE} />
    <path d="M 1280 880 L 1280 340" stroke={LEAFD} strokeWidth={26} fill="none" /><circle cx={1280} cy={320} r={56} fill={ROSE} /><circle cx={1280} cy={320} r={24} fill="#b8325c" />
  </Svg><Lbl tt={tt} at={2.4} x={640} y={180} tx="FINITO: SE AGACHA" bg={RED} col={INK} /><Lbl tt={tt} at={3.4} x={1280} y={180} tx="FIRME: LA AGUANTA" bg={GRN} /></AbsoluteFill>;
}}</Stage>;
// 42 · las preguntas: mapa con alfileres
const Preguntas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={300} y={160} width={1320} height={800} rx={20} fill="#e8dcc0" stroke="#8a6a40" strokeWidth={8} />
  <path d="M 520 300 C 700 280, 900 360, 1000 480 C 1060 560, 1100 600, 1180 640 C 1240 700, 1300 760, 1400 820" stroke="#b8a070" strokeWidth={70} fill="none" strokeLinecap="round" opacity={0.6} />
  {[["GUADALAJARA", 700, 520, "¿HORMIGAS?"], ["MONTERREY", 860, 360, "¿LICUADO?"], ["BOGOTÁ", 1160, 860, "¿Y A LA SEMANA?"]].map(([n, x, y, q], i) => {
    const s = P(tt, 0.6 + i * 1.3, 9, 0.4);
    return <g key={n as string} opacity={cl(s * 2)}><circle cx={x as number} cy={(y as number) - 100 * s} r={34} fill={RED} stroke="#fff" strokeWidth={5} />
      <T x={(x as number) + 50} y={(y as number) - 90} tx={n as string} size={36} anchor="start" /><T x={(x as number) + 50} y={(y as number) - 40} tx={q as string} size={34} col="#8a3020" anchor="start" hand /></g>; })}
</Svg></AbsoluteFill>}</Stage>;
// 43 · el perro: piedra plana o malla
const Perro: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const s = P(tt, 1.0, 6, 0.4);
  return <AbsoluteFill><Svg><Defs /><Ground y={640} deep={380} /><Banana x={760} y={800} s={0.6} ripe={2} />
    <ellipse cx={760} cy={lp(200, 630, cl(s))} rx={220} ry={46} fill="#8f8a82" stroke="#4e4a44" strokeWidth={6} />
    <g opacity={cl(P(tt, 2.4) * 2)}>{Array.from({ length: 8 }, (_, i) => <line key={i} x1={1040 + i * 50} y1={600} x2={1240 + i * 50} y2={660} stroke="#c9ced3" strokeWidth={5} />)}{Array.from({ length: 8 }, (_, i) => <line key={"b" + i} x1={1240 + i * 50} y1={600} x2={1040 + i * 50} y2={660} stroke="#c9ced3" strokeWidth={5} />)}</g>
  </Svg><Lbl tt={tt} at={1.6} x={760} y={480} tx="PIEDRA PLANA" bg={INK} /><Lbl tt={tt} at={2.8} x={1400} y={480} tx="O MALLA" bg={INK} /><Lbl tt={tt} at={4.0} x={960} y={160} tx="LAS PRIMERAS 2 SEMANAS" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 44 · licuado encima: se agria y trae moscas
const Licuado: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = W(tt, 1.6, 3.4);
  return <AbsoluteFill><Svg><Defs />
    <g transform="translate(560,520)"><path d="M -120 -260 L 120 -260 L 90 120 L -90 120 Z" fill="url(#glass)" stroke="#fff" strokeWidth={5} /><path d={`M -110 ${-120 + 40 * Math.sin(tt * 8)} L 110 -120 L 90 120 L -90 120 Z`} fill="#e8d590" opacity={0.85} /><rect x={-140} y={120} width={280} height={140} rx={20} fill="#2b3640" /></g>
    <Ground y={760} x0={860} x1={1700} deep={260} /><ellipse cx={1280} cy={756} rx={200} ry={26} fill="#c9b060" opacity={k} />
    {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={1180 + i * 50 + 20 * Math.sin(tt * 6 + i)} cy={640 + 30 * Math.cos(tt * 5 + i)} r={9} fill="#111" opacity={k} />)}
  </Svg><Lbl tt={tt} at={2.6} x={1280} y={480} tx="ENCIMA: SE AGRIA EN UN DÍA" bg={RED} col={INK} /><Lbl tt={tt} at={4.2} x={1280} y={920} tx="MEJOR EL FERMENTADO" bg={GRN} /></AbsoluteFill>;
}}</Stage>;
// 45 · el limonero: el árbol come mucho más que el rosal
const Limonero: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const g = P(tt, 0.8, 6, 0.5);
  return <AbsoluteFill><Svg><Defs /><Ground y={880} deep={200} />
    <Rose x={520} y={880} s={0.7} fl={4} bud={2} />
    <g transform={`translate(1240,880) scale(${g})`}><rect x={-30} y={-300} width={60} height={300} fill="#6b4a2c" /><circle cx={0} cy={-420} r={250} fill={LEAFD} /><circle cx={-120} cy={-360} r={150} fill={LEAF} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-180 + (i % 3) * 170} cy={-520 + Math.floor(i / 3) * 130} r={26} fill="#e6e23a" stroke="#8a8a10" strokeWidth={3} />)}</g>
  </Svg><Lbl tt={tt} at={2.0} x={520} y={500} tx="ROSAL: 1 PLÁTANO" bg={INK} /><Lbl tt={tt} at={3.2} x={1240} y={140} tx="ÁRBOL: COMPOSTA + PLÁTANO" bg={AMB} /></AbsoluteFill>;
}}</Stage>;
// 46 · repaso: siete fichas
const Repaso: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["MADURO, SIN MOHO", "5 TROZOS CON CÁSCARA", "DOS PALMOS", "1 POR MES · 2 SI ES GRANDE", "SÓLO FLOR Y FRUTA", "TAPAR · ACOLCHAR · REGAR", "MACETA: FERMENTADO"].map((n, i) => {
    const s = P(tt, 0.4 + i * 1.1, 9), x = i < 4 ? 420 + i * 360 : 600 + (i - 4) * 360, y = i < 4 ? 400 : 720;
    return <Card key={n} x={x} y={y} w={330} h={240} s={s} rot={-6} bg={i === 2 ? "#ffe9b0" : INK}><rect x={-165} y={-120} width={330} height={60} rx={22} fill={LEAFD} /><T x={0} y={-76} tx={String(i + 1)} size={44} col={INK} /><T x={0} y={40} tx={n} size={n.length > 18 ? 24 : 30} /></Card>; })}
</Svg></AbsoluteFill>}</Stage>;

export const MAP: Record<string, C> = {
  pintas: Pintas, rata: Rata, sietepasos: SietePasos, treinta: Treinta, potasio: Potasio, trio: Trio, nitro: Nitro, reloj: Reloj, epoca: Epoca,
  madurez: Madurez, chela: Chela, trozos: Trozos, palmo: Palmo, hondo: Hondo, olor: Olor, costado: Costado, cuello: Cuello, aurelio: Aurelio,
  dosis: Dosis, demasiado: Demasiado, calendario: Calendario, cuenta: Cuenta, siono: SiNo, sol: Sol, tapar: Tapar, riego: Riego, esponja: Esponja,
  maceta: Maceta, fermentado: Fermentado, dilucion: Dilucion, semanas: Semanas, plantas5: Plantas5, bugambilia: Bugambilia, errores: Errores,
  rutina: Rutina, palito: Palito, tomas3: Tomas3, postre: Postre, hoja: Hoja, boton: Boton, tallo: Tallo, preguntas: Preguntas, perro: Perro,
  licuado: Licuado, limonero: Limonero, repaso: Repaso,
};
