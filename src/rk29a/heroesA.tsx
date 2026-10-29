// rk29a · componentes únicos 1-23 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
// Objetos y mecanismos, no carteles: la llave que escucha, el relevo, el rectángulo vacío, el corte de la casa, el cajón…
import React from "react";
import { H, Stage, Tag, phys, cl, eio, MARK, HAND, TX, DIM } from "./hkit";
import { Fob, Waves, Pouch, Coin, CarTop, Puck, AMB, RED, ICE, GRN } from "./rkdraw";

type P = { t: number; h: H };
const A = (s: number) => cl(s);
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// auto de costado (silueta limpia con faros que se encienden)
const CarSide: React.FC<{ w?: number; lights?: number; col?: string }> = ({ w = 520, lights = 0, col = "#c9ccd1" }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 250 105" style={{ overflow: "visible", filter: "drop-shadow(0 22px 22px rgba(0,0,0,.55))" }}>
    <path d="M10 78 Q12 58 40 54 L78 30 Q90 22 120 22 L170 24 Q190 26 206 46 L232 54 Q246 60 244 78 Z" fill={col} />
    <path d="M86 34 L120 28 L160 30 L176 50 L82 50 Z" fill="#2a3340" />
    <line x1="128" y1="28" x2="126" y2="50" stroke={col} strokeWidth="4" />
    <circle cx="62" cy="80" r="17" fill="#15161a" /><circle cx="62" cy="80" r="8" fill="#6d7178" />
    <circle cx="200" cy="80" r="17" fill="#15161a" /><circle cx="200" cy="80" r="8" fill="#6d7178" />
    <rect x="232" y="58" width="12" height="7" rx="3" fill={lights > 0.05 ? "#fff6c8" : "#8a8a80"} />
    {lights > 0.05 && <path d="M244 61 L330 40 L330 84 Z" fill="rgba(255,246,200,.35)" opacity={lights} />}
    <rect x="8" y="60" width="9" height="7" rx="3" fill={lights > 0.05 ? "#ff3b2a" : "#5a1a16"} />
  </svg>
);
const At: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, o = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o }}>{children}</div>
);

// 1 · la llave no grita: escucha. La pregunta del auto entra, la luz roja contesta, el auto se abre
export const HListen: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ask = cl((tt - 0.5) / 1.6), ans = cl((tt - 2.4) / 1.6), led = tt > 2.2 ? 0.6 + 0.4 * Math.sin(tt * 12) * (tt < 3.4 ? 1 : 0) : 0;
  return <>
    <At x={430} y={640} s={0.4 + 0.6 * A(phys(tt, 0.1))}><CarSide lights={tt > 4 ? 1 - cl((tt - 5) / 2) * 0.4 : 0} /></At>
    {ask > 0 && ask < 1 && <Waves x={640} y={600} k={tt * 0.7} n={3} r={900} col={ICE} ang={-8} spread={40} op={1 - ans} />}
    {ans > 0 && <Waves x={1380} y={560} k={tt * 0.8} n={3} r={900} col={AMB} ang={188} spread={40} op={1 - cl((tt - 4.2) / 1)} />}
    <At x={1420} y={560} s={A(phys(tt, 0.2))} rot={-8 + 2 * Math.sin(tt * 0.8)}><Fob w={230} led={led} /></At>
    <Tag tt={tt} at={0.7} x={520} y={380} txt="IS THAT YOU?" col={ICE} size={56} />
    <Tag tt={tt} at={2.5} x={1420} y={300} txt="YES, I AM." col={AMB} size={56} />
  </>;
}}</Stage>;

// 2 · el relevo visto desde arriba: uno junto al auto, otro contra la pared; la pregunta entra, el sí sale, el auto se va
export const HRelay: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const bWalk = eio(tt, 1.2, 3.0), hop = cl((tt - 3.2) / 2.4), carGo = eio(tt, 7.0, 9.0);
  const bx = 980 + 300 * bWalk, by = 760 - 260 * bWalk;
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(38deg) translateY(-60px)", transformOrigin: "50% 70%" }}>
    <div style={{ position: "absolute", left: 1180, top: 160, width: 560, height: 420, background: "#e9e1d1", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.5), inset 0 0 0 14px #3a2f25" }}>
      <div style={{ position: "absolute", left: 200, top: 0, width: 10, height: 260, background: "#3a2f25" }} /><div style={{ position: "absolute", left: 200, top: 250, width: 360, height: 10, background: "#3a2f25" }} />
      <div style={{ position: "absolute", left: 90, top: 300, transform: "scale(.35)", transformOrigin: "0 0" }}><Fob w={160} led={tt > 3.9 && tt < 6 ? 0.8 : 0} /></div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 120, width: 360, height: 820, background: "linear-gradient(90deg,#3d3f44,#4a4c52,#3d3f44)", borderRadius: 6 }} />
    <At x={480} y={520 - 700 * carGo} rot={0}><CarTop w={170} lights={tt > 6.2 ? 1 : 0} /></At>
    <At x={680} y={560 - 700 * carGo * 0} o={1 - carGo}><Puck s={80} /></At>
    <At x={bx} y={by}><Puck s={80} /></At>
    {hop > 0 && hop < 1 && <Waves x={bx} y={by} k={tt * 0.9} n={3} r={240} col={ICE} ang={-20} spread={60} />}
    {tt > 4.2 && tt < 6.4 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={bx} y1={by} x2={680} y2={560} stroke={AMB} strokeWidth={6} strokeDasharray="18 16" strokeDashoffset={-tt * 120} opacity={0.9} />
      <circle cx={bx + (680 - bx) * ((tt - 4.2) / 2.2 % 1)} cy={by + (560 - by) * ((tt - 4.2) / 2.2 % 1)} r={14} fill={AMB} /></svg>}
    <Tag tt={tt} at={0.4} x={700} y={460} txt="BY YOUR CAR" col={TX} size={40} />
    <Tag tt={tt} at={2.6} x={bx} y={by - 90} txt="BY YOUR WALL" col={TX} size={40} />
  </div>;
}}</Stage>;

// 3 · el rectángulo vacío: el auto se desvanece de la entrada y queda el concreto limpio con la mancha de aceite
export const HEmpty: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const gone = eio(tt, 1.0, 3.2);
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1900px) rotateX(42deg)", transformOrigin: "50% 75%" }}>
    <div style={{ position: "absolute", left: 560, top: 60, width: 800, height: 960, background: "radial-gradient(ellipse at 50% 40%, #8d8a84, #6b6862)", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 760, top: rnd(i + 40) * 920, width: 30 + rnd(i + 9) * 90, height: 20 + rnd(i + 3) * 60, borderRadius: "50%", background: "rgba(40,36,30,.12)" }} />)}
      <div style={{ position: "absolute", left: 230, top: 220, width: 340, height: 600, background: "#a29f98", borderRadius: 30, opacity: gone }} />
      <div style={{ position: "absolute", left: 340, top: 470, width: 120, height: 90, borderRadius: "50%", background: "radial-gradient(#1c1a17, #2b2823 60%, transparent 72%)", opacity: gone }} />
      <div style={{ position: "absolute", left: 0, top: -40, width: 800, height: 120, background: "radial-gradient(ellipse at 50% 0%, rgba(255,214,150,.55), transparent 70%)" }} />
    </div>
    <At x={960} y={580} s={1 + 0.15 * gone} o={1 - gone}><CarTop w={300} /></At>
    {[1460, 1560].map((x, i) => <At key={i} x={x} y={420 + i * 40} s={A(phys(tt, 0.3 + i * 0.15))}><div style={{ width: 90, height: 130, borderRadius: 12, background: i ? "#2f5d3a" : "#3a3d44", boxShadow: "0 18px 24px rgba(0,0,0,.5), inset 0 10px 0 rgba(255,255,255,.08)" }} /></At>)}
    <Tag tt={tt} at={3.4} x={960} y={160} txt="NO GLASS. NO NOISE." col={TX} size={58} />
  </div>;
}}</Stage>;

// 4 · el corte de la casa: arriba la bolsa dormida, abajo la de repuesto en el gancho, a 18 pulgadas de la pared
export const HCutaway: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const draw = eio(tt, 0.1, 1.2), meas = eio(tt, 2.6, 3.8);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M460 960 L460 420 L960 170 L1460 420 L1460 960 Z`} fill="rgba(233,225,209,.1)" stroke="#e9e1d1" strokeWidth={10} strokeDasharray={3600} strokeDashoffset={3600 * (1 - draw)} strokeLinejoin="round" />
      <line x1={460} y1={660} x2={1460} y2={660} stroke="#e9e1d1" strokeWidth={8} opacity={draw} />
      <line x1={1460} y1={980} x2={460} y2={980} stroke="#6b5a45" strokeWidth={14} opacity={draw} />
      {meas > 0 && <><line x1={1250} y1={900} x2={1250 + 200 * meas} y2={900} stroke={RED} strokeWidth={5} /><line x1={1250} y1={880} x2={1250} y2={920} stroke={RED} strokeWidth={5} /><line x1={1450} y1={880} x2={1450} y2={920} stroke={RED} strokeWidth={5} opacity={meas} /></>}
    </svg>
    <At x={760} y={600} s={A(phys(tt, 0.8))}><div style={{ width: 260, height: 70, background: "#6b4a2e", borderRadius: 6 }} /></At>
    <At x={760} y={520} s={A(phys(tt, 1.0)) * 0.55}><Pouch w={200} /></At>
    <At x={1250} y={800} s={A(phys(tt, 1.4)) * 0.5} rot={4 * Math.sin(tt * 2)}><Fob w={150} led={tt > 2 ? 0.5 + 0.5 * Math.sin(tt * 9) : 0} /></At>
    {tt > 2 && <Waves x={1250} y={790} k={tt * 0.7} n={3} r={420} col={AMB} ang={0} spread={70} />}
    <Tag tt={tt} at={1.3} x={760} y={380} txt="ASLEEP" col={ICE} size={46} />
    <Tag tt={tt} at={1.8} x={1100} y={720} txt="AWAKE" col={AMB} size={46} />
    <Tag tt={tt} at={3.6} x={1350} y={850} txt="18 IN" col={RED} size={44} />
  </>;
}}</Stage>;

// 5 · gemelas: dos llaves, el mismo código barra por barra; se superponen y son una sola
export const HTwins: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const bars = Array.from({ length: 22 }, (_, i) => 6 + Math.floor(rnd(i + 7) * 26));
  const drawn = cl((tt - 0.8) / 2.2), scan = cl((tt - 3.2) / 1.6), merge = eio(tt, 5.2, 6.6);
  const Code: React.FC<{ x: number }> = ({ x }) => <div style={{ position: "absolute", left: x - 230, top: 760, width: 460, height: 90, display: "flex", alignItems: "flex-end", gap: 8 }}>
    {bars.map((b, i) => <div key={i} style={{ width: 13, height: b * 2.6 * (i / bars.length < drawn ? 1 : 0), background: i / bars.length < scan ? GRN : TX, borderRadius: 3 }} />)}
  </div>;
  return <>
    <At x={620 + 340 * merge} y={460} rot={-6 * (1 - merge)} s={A(phys(tt, 0.1))}><Fob w={210} led={0} /></At>
    <At x={1300 - 340 * merge} y={460} rot={6 * (1 - merge)} s={A(phys(tt, 0.3))} o={1 - merge * 0.55}><Fob w={210} led={tt > 1 ? 0.6 : 0} /></At>
    <div style={{ opacity: 1 - merge }}><Code x={620} /><Code x={1300} /></div>
    {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: 380 + 1160 * scan, top: 700, width: 4, height: 200, background: GRN, boxShadow: `0 0 24px ${GRN}` }} />}
    <Tag tt={tt} at={0.6} x={620} y={160} txt="IN THE POUCH" col={ICE} size={40} />
    <Tag tt={tt} at={0.9} x={1300} y={160} txt="ON THE HOOK" col={AMB} size={40} />
    <Tag tt={tt} at={6.4} x={960} y={820} txt="SAME CODE" col={GRN} size={70} />
  </>;
}}</Stage>;

// 6 · el mapa de los casos: Oklahoma y Kansas, los alfileres de cada historia caen con peso; Broken Arrow se enciende
const OK_PTS = [[-103, 37], [-94.62, 37], [-94.43, 35.4], [-94.48, 33.64], [-95.5, 33.9], [-96.5, 33.8], [-97.2, 33.75], [-98.1, 34.1], [-99.2, 34.4], [-100, 34.56], [-100, 36.5], [-103, 36.5]];
const mx = (lon: number) => 230 + (lon + 103.2) * 168, my = (lat: number) => 60 + (38.6 - lat) * 168;
export const HOkMap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = OK_PTS.map(([a, b], i) => `${i ? "L" : "M"}${mx(a)} ${my(b)}`).join(" ") + " Z", draw = eio(tt, 0.1, 1.6);
  const pins: [string, number, number, number, string][] = [["TULSA", -95.99, 36.15, 1.6, "2019"], ["BROKEN ARROW", -95.79, 36.05, 2.2, "2020"], ["EDMOND", -97.48, 35.65, 2.8, "2022"], ["WICHITA", -97.33, 37.69, 3.4, "2017"]];
  return <div style={{ position: "absolute", inset: 0, transform: `perspective(2000px) rotateX(${22 - 4 * eio(tt, 0, 8)}deg) translate(-170px, 70px) scale(0.72)`, transformOrigin: "50% 50%" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={`M${mx(-102.05)} ${my(40)} L${mx(-102.05)} ${my(37)} L${mx(-94.62)} ${my(37)} L${mx(-94.6)} ${my(40)}`} fill="rgba(233,225,209,.06)" stroke="rgba(233,225,209,.35)" strokeWidth={4} strokeDasharray="14 10" opacity={draw} />
      <path d={d} fill="rgba(233,225,209,.13)" stroke="#e9e1d1" strokeWidth={7} strokeDasharray={5200} strokeDashoffset={5200 * (1 - draw)} strokeLinejoin="round" />
    </svg>
    {pins.map(([n, lo, la, a, y], i) => {
      const s = phys(tt, a, 8, 0.4), on = i === 1;
      return <div key={i} style={{ position: "absolute", left: mx(lo), top: my(la), transform: `translate(-50%,-100%) translateY(${(1 - s) * -160}px)`, opacity: cl(s * 3) }}>
        <svg width={on ? 70 : 48} height={on ? 92 : 64} viewBox="0 0 30 40"><path d="M15 39 C15 39 2 22 2 14 A13 13 0 0 1 28 14 C28 22 15 39 15 39 Z" fill={on ? RED : AMB} /><circle cx="15" cy="14" r="5" fill="#fff" /></svg>
        <div style={{ position: "absolute", left: on ? 80 : 56, top: 6, whiteSpace: "nowrap", fontWeight: 900, fontSize: on ? 50 : 38, color: on ? TX : "#c9c2b2", textShadow: "0 4px 14px #000" }}>{n}<span style={{ color: on ? RED : DIM, marginLeft: 12, fontSize: on ? 30 : 22 }}>{y}</span></div>
        {on && tt > a + 0.4 && <div style={{ position: "absolute", left: (70 - 160) / 2, top: 92 - 40, width: 160, height: 80, borderRadius: "50%", border: `4px solid ${RED}`, transform: `scale(${1 + ((tt - a) % 1.4) * 0.8})`, opacity: 1 - ((tt - a) % 1.4) / 1.4 }} />}
      </div>;
    })}
  </div>;
}}</Stage>;

// 7 · el cajón de siempre: sale con peso; adentro gomitas, velitas, pilas… y las dos llaves de repuesto despiertas
export const HDrawer: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const open = phys(tt, 0.3, 5, 0.55), wall = eio(tt, 5.2, 6.4);
  const junk: [string, number, number, number][] = [["band", 90, 70, 0], ["band", 520, 210, 1], ["candle", 200, 230, 20], ["candle", 240, 245, 35], ["aa", 380, 60, -15], ["aa", 420, 90, 70], ["soy", 600, 80, 12], ["clip", 140, 160, 40], ["clip", 660, 230, -30]];
  return <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
    <div style={{ position: "absolute", left: 510, top: 250, width: 900, height: 560, transform: `rotateX(52deg) translateZ(${-200 + 260 * open}px)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#c79a63,#a87a46)", borderRadius: 10, boxShadow: "inset 0 0 0 26px #8a5f33, 0 50px 90px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 50, top: 50, width: 800, height: 460 }}>
        {junk.map(([k, x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)` }}>
          {k === "band" && <div style={{ width: 110, height: 110, borderRadius: "50%", border: "9px solid #d9644a" }} />}
          {k === "candle" && <div style={{ width: 16, height: 120, borderRadius: 4, background: "repeating-linear-gradient(45deg,#7fc7ff 0 10px,#fff 10px 20px)" }} />}
          {k === "aa" && <div style={{ width: 130, height: 40, borderRadius: 8, background: "linear-gradient(90deg,#1d1d1f 70%,#c9a24a 70%)" }} />}
          {k === "soy" && <div style={{ width: 120, height: 80, borderRadius: 6, background: "#b9312b", boxShadow: "inset 0 0 0 6px #e0e0e0" }} />}
          {k === "clip" && <div style={{ width: 70, height: 22, borderRadius: 11, border: "4px solid #b8bec6" }} />}
        </div>)}
        {[300, 470].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 150 + i * 40, transform: `rotate(${-20 + i * 40}deg) scale(.55)` }}><Fob w={150} led={tt > 1.8 ? 0.5 + 0.5 * Math.sin(tt * 8 + i) : 0} /></div>)}
      </div>
    </div>
    {tt > 2 && <Waves x={960} y={560} k={tt * 0.6} n={4} r={560} col={AMB} op={0.8} />}
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 14, background: "#e9e1d1", opacity: wall, transform: `scaleX(${wall})` }} />
    <Tag tt={tt} at={2.4} x={960} y={900} txt="BATTERY IN" col={AMB} size={60} />
    <Tag tt={tt} at={5.6} x={960} y={80} txt="OUTSIDE WALL" col={TX} size={40} />
  </div>;
}}</Stage>;

// 8 · los lugares de siempre, por orden: cada objeto cae en su estante con el número tallado
const Icon: React.FC<{ k: string }> = ({ k }) => {
  if (k === "drawer") return <div style={{ width: 200, height: 120, background: "linear-gradient(#c79a63,#9a6c3c)", borderRadius: 10, boxShadow: "inset 0 0 0 10px #7a522b" }}><div style={{ width: 60, height: 14, borderRadius: 7, background: "#d8d2c4", margin: "52px auto 0" }} /></div>;
  if (k === "hook") return <svg width={200} height={170} viewBox="0 0 100 85"><rect x="5" y="5" width="90" height="16" rx="4" fill="#7a522b" /><path d="M50 21 L50 40 Q50 50 40 50" fill="none" stroke="#b8bec6" strokeWidth="5" strokeLinecap="round" /><rect x="34" y="48" width="18" height="30" rx="7" fill="#1b1c20" /></svg>;
  if (k === "bowl") return <svg width={210} height={120} viewBox="0 0 105 60"><path d="M5 18 Q52 70 100 18 Z" fill="#c9a77a" /><ellipse cx="52" cy="18" rx="47" ry="10" fill="#e3c99d" /><rect x="40" y="6" width="16" height="12" rx="5" fill="#1b1c20" /></svg>;
  if (k === "glove") return <div style={{ width: 220, height: 110, background: "#3a3d44", borderRadius: "14px 14px 40px 40px", boxShadow: "inset 0 -16px 0 #2a2c31" }}><div style={{ width: 50, height: 12, borderRadius: 6, background: "#8a8f98", margin: "26px auto 0" }} /></div>;
  return <svg width={150} height={190} viewBox="0 0 75 95"><rect x="8" y="16" width="59" height="76" rx="18" fill="#3f6fb6" /><path d="M22 18 Q37 0 53 18" fill="none" stroke="#2d4f85" strokeWidth="6" /><rect x="18" y="52" width="39" height="26" rx="8" fill="#355f9e" /><rect x="30" y="74" width="14" height="20" rx="5" fill="#1b1c20" /></svg>;
};
export const HSpots: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const its: { at: number }[] = h.items ?? [], ats = [its[0]?.at ?? h.at, (its[0]?.at ?? h.at) + 3.6, its[1]?.at ?? h.at + 7, (its[1]?.at ?? h.at) + 4.5, its[2]?.at ?? h.at + 15];
  const K = ["drawer", "glove", "hook", "bowl", "pack"];
  return <>
    {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 200, right: 200, top: 520 + r * 330, height: 26, background: "linear-gradient(#8a5f33,#5e3f20)", borderRadius: 6, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />)}
    {K.map((k, i) => {
      const a = ats[i] - h.at, s = phys(tt, a, 8, 0.38), x = [480, 960, 1440, 720, 1200][i], y = i < 3 ? 520 : 850;
      return s > 0.01 ? <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) translateY(${(1 - s) * -420}px) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: MARK, fontSize: 64, color: i === 0 ? RED : AMB, marginBottom: 6, textShadow: "0 4px 14px #000" }}>{i + 1}</div><Icon k={k} />
      </div> : null;
    })}
  </>;
}}</Stage>;

// 9 · la franja de alcance: desde las paredes de afuera entra una banda roja y prende cada lugar que toca
export const HReach: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const band = eio(tt, 0.8, 3.0), X0 = 420, Y0 = 170, W = 1080, Hh = 680, B = 150 * band;
  const spots: [string, number, number, number][] = [["DRAWER", 160, 120, 1.5], ["HOOK", 1000, 520, 2.4], ["BOWL", 560, 540, 3.0], ["NIGHTSTAND", 700, 300, 99]];
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(2000px) rotateX(30deg)", transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", left: X0, top: Y0, width: W, height: Hh, background: "#e9e1d1", borderRadius: 8, boxShadow: "inset 0 0 0 16px #3a2f25, 0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 16, boxShadow: `inset 0 0 0 ${B}px rgba(255,90,74,.32)` }} />
      {[[380, 16, 10, 420], [380, 420, 684, 10], [760, 16, 10, 404]].map(([x, y, w, hh], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: hh, background: "#3a2f25" }} />)}
      {spots.map(([n, x, y, a], i) => { const hot = tt > a; return <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", margin: "0 auto", background: hot ? RED : "#2f3a46", boxShadow: hot ? `0 0 30px ${RED}` : "none", transform: `scale(${hot ? 1 + 0.15 * Math.sin(tt * 6) : 1})` }} />
        <div style={{ fontWeight: 900, fontSize: 40, color: "#2a2018", marginTop: 6, letterSpacing: 2 }}>{n}</div></div>; })}
    </div>
    <Tag tt={tt} at={3.3} x={960} y={110} txt="ON AN OUTSIDE WALL" col={RED} size={50} />
  </div>;
}}</Stage>;

// 10 · un regalo para el ladrón: la llave en el gancho, la cinta roja la envuelve y el moño salta
export const HGift: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const r1 = eio(tt, 0.8, 1.5), r2 = eio(tt, 1.3, 2.0), bow = phys(tt, 2.0, 9, 0.35), sw = 6 * Math.sin(tt * 2.2) * Math.exp(-tt * 0.3);
  return <>
    <div style={{ position: "absolute", left: 660, top: 170, width: 600, height: 110, background: "linear-gradient(#8a5f33,#5e3f20)", borderRadius: 10, boxShadow: "0 24px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 960, top: 280, transformOrigin: "50% 0", transform: `translateX(-50%) rotate(${sw}deg)` }}>
      <svg width={60} height={120} viewBox="0 0 30 60"><path d="M15 0 L15 30 Q15 42 5 42" fill="none" stroke="#b8bec6" strokeWidth="5" strokeLinecap="round" /></svg>
      <div style={{ position: "relative", marginLeft: -80, marginTop: -20 }}><Fob w={200} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 34, background: RED, transform: `scaleX(${r1})`, boxShadow: "0 4px 10px rgba(0,0,0,.4)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 83, width: 34, background: RED, transform: `scaleY(${r2})`, transformOrigin: "50% 0", boxShadow: "4px 0 10px rgba(0,0,0,.4)" }} />
        <svg width={180} height={110} viewBox="0 0 90 55" style={{ position: "absolute", left: 10, top: 110, transform: `scale(${bow})` }}><path d="M45 28 C25 0 5 10 18 30 C5 48 30 50 45 28 C60 50 85 48 72 30 C85 10 65 0 45 28 Z" fill="#ff7a6a" stroke="#c23b2e" strokeWidth="2" /><circle cx="45" cy="28" r="7" fill="#c23b2e" /></svg>
      </div>
    </div>
    <Tag tt={tt} at={2.6} x={960} y={900} txt="A GIFT TO A THIEF" col={RED} size={64} />
  </>;
}}</Stage>;

// 11 · la cinta métrica: de la llave a la pared; si marca menos de 10 pies, es un lugar que se alcanza
export const HTape: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ext = eio(tt, 1.0, 3.4), x0 = 470, x1 = 1460, ft = 8 * ext;
  return <>
    <div style={{ position: "absolute", left: 300, right: 300, top: 640, height: 30, background: "linear-gradient(#cfc6b6,#a99f8c)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: x1, top: 220, width: 60, height: 700, background: "repeating-linear-gradient(0deg,#b4432f 0 40px,#9a3626 40px 44px)", boxShadow: "-20px 0 40px rgba(0,0,0,.5)" }} />
    <At x={330} y={560} s={A(phys(tt, 0.2)) * 0.85} rot={-20}><Fob w={170} led={0.6} /></At>
    <div style={{ position: "absolute", left: x0, top: 600, width: (x1 - x0 - 10) * ext, height: 34, background: "linear-gradient(#ffd34d,#e6b422)", boxShadow: "0 6px 12px rgba(0,0,0,.4)", overflow: "hidden" }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 24.5, top: 0, width: 3, height: i % 4 === 0 ? 22 : 12, background: "#2b2416" }} />)}
    </div>
    <div style={{ position: "absolute", left: x0 - 110 + (x1 - x0 - 10) * ext * 0, top: 560, width: 130, height: 120, borderRadius: 22, background: "radial-gradient(circle at 50% 50%, #3a3d44 0 18px, transparent 19px), linear-gradient(#ffd34d,#d9a514)", border: "6px solid #2b2416", boxShadow: "0 18px 30px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 960, top: 300, transform: "translateX(-50%)", fontFamily: MARK, fontSize: 150, color: ext > 0.98 ? RED : TX, textShadow: "0 10px 30px #000" }}>{ft.toFixed(0)} FT</div>
    <Tag tt={tt} at={3.8} x={960} y={860} txt="UNDER 10 FT = REACHABLE" col={RED} size={50} />
  </>;
}}</Stage>;

// 12 · sin pila no contesta: la llave abierta, la pila afuera; la pregunta llega y se apaga contra ella
export const HNoBatt: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pull = eio(tt, 0.4, 1.6);
  return <>
    <At x={500} y={560} s={0.7}><CarSide /></At>
    <Waves x={720} y={540} k={tt * 0.7} n={3} r={560} col={ICE} ang={0} spread={36} op={0.9} />
    <At x={1340} y={520} s={A(phys(tt, 0.1))}><Fob w={230} open={0.9} dim={0.25} /></At>
    <At x={1340 + 300 * pull} y={520 - 220 * pull} rot={pull * 30}><Coin d={130} label="CR" /></At>
    {tt > 2 && [0, 1, 2].map((i) => { const f = ((tt - 2) * 0.7 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: 1340 - 60 * f, top: 520, width: 30, height: 30, borderRadius: "50%", border: `3px solid ${ICE}`, transform: `translate(-50%,-50%) scale(${4 - 3.5 * f})`, opacity: f * 0.6 }} />; })}
    <Tag tt={tt} at={2.4} x={1340} y={860} txt="NO BATTERY. NO ANSWER." col={GRN} size={52} />
  </>;
}}</Stage>;

// 13 · la ranura del canto: la llave de perfil en macro, la ranura brilla y una moneda de diez entra justo
export const HNotch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const glow = cl((tt - 1.0) / 0.6), dime = eio(tt, 2.4, 3.8), drv = eio(tt, 5.0, 6.2);
  return <>
    <div style={{ position: "absolute", left: 360, top: 430, width: 1200, height: 230, borderRadius: 115, background: "linear-gradient(180deg,#3a3d44,#15161a 55%,#050506)", boxShadow: "0 50px 90px rgba(0,0,0,.65), inset 0 3px 0 rgba(255,255,255,.18)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 112, height: 5, background: "#0a0a0c", boxShadow: "0 1px 0 rgba(255,255,255,.12)" }} />
      <div style={{ position: "absolute", left: 1060, top: 92, width: 30, height: 46, borderRadius: 6, background: "#000", boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${AMB}, inset 0 0 0 3px rgba(255,178,87,${glow})` : "none" }} />
    </div>
    <At x={1435 + 300 * (1 - dime)} y={300 + 245 * dime} rot={90} o={dime > 0 ? 1 : 0}><Coin d={150} label="10¢" /></At>
    <div style={{ position: "absolute", left: 1435 - 250 + 600 * (1 - drv), top: 536, width: 260, height: 18, borderRadius: 9, background: "linear-gradient(#e6e8eb,#8f949b)", opacity: drv > 0 ? 1 : 0 }}><div style={{ position: "absolute", left: 250, top: -16, width: 160, height: 50, borderRadius: 14, background: "#d33a2c" }} /></div>
    <Tag tt={tt} at={1.4} x={1435} y={760} txt="THE NOTCH" col={AMB} size={50} />
    <Tag tt={tt} at={3.9} x={1150} y={220} txt="ABOUT A DIME WIDE" col={TX} size={44} />
  </>;
}}</Stage>;

// 14 · el giro de la moneda: entra en la ranura, gira con resorte, las dos mitades se abren y aparece la pila
export const HTwist: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ins = eio(tt, 0.4, 1.2), tw = phys(tt, 1.6, 7, 0.5), op = phys(tt, 2.4, 6, 0.45), up = eio(tt, 4.0, 5.2);
  return <>
    <At x={960} y={560} s={1.6} rot={-90}><Fob w={240} open={cl(op) * 1.4} /></At>
    {op > 0.3 && <At x={960 + 40 * up} y={560 - 200 * up} s={0.9 + 0.3 * up}><Coin d={190} label="CR2025" /></At>}
    <At x={960 + 330 - 120 * ins} y={430} rot={-35 * cl(tw) + 90} o={op > 0.5 ? 1 - cl((tt - 3) * 2) : 1}><Coin d={120} label="25¢" /></At>
    <Tag tt={tt} at={1.7} x={1460} y={280} txt="JUST A TWIST" col={AMB} size={50} />
    <Tag tt={tt} at={2.9} x={480} y={840} txt="NO PRYING" col={TX} size={44} />
  </>;
}}</Stage>;

// 15 · la foto del número: el visor enfoca la pila CR2025, el obturador destella y la foto queda clavada arriba
export const HSnap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const foc = eio(tt, 0.4, 1.6), fl = tt > 2.0 && tt < 2.25 ? 1 - (tt - 2.0) / 0.25 : 0, fly = eio(tt, 2.4, 3.6);
  const br = (x: number, y: number, r: number) => <div style={{ position: "absolute", left: x, top: y, width: 90, height: 90, borderTop: `8px solid ${TX}`, borderLeft: `8px solid ${TX}`, transform: `rotate(${r}deg)` }} />;
  return <>
    <At x={960} y={540} s={1 + 0.1 * (1 - foc)}><div style={{ width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #c9ced4 30%, #8b9097 70%, #5d6168)", display: "flex", alignItems: "center", justifyContent: "center", filter: `blur(${(1 - foc) * 10}px)`, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ fontWeight: 900, fontSize: 96, color: "#3d4148", letterSpacing: 4, textShadow: "0 2px 0 rgba(255,255,255,.6)" }}>CR2025</div></div></At>
    <div style={{ opacity: 1 - fly }}>{br(560, 180, 0)}{br(1270, 180, 90)}{br(1270, 820, 180)}{br(560, 820, 270)}</div>
    <div style={{ position: "absolute", left: 960 + 560 * fly, top: 540 - 330 * fly, transform: `translate(-50%,-50%) scale(${1 - 0.68 * fly}) rotate(${-6 * fly}deg)`, opacity: fly > 0 ? 1 : 0, width: 720, height: 720, background: "#fff", padding: 20, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle, #d7dade 30%, #7d838a)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 90, color: "#3d4148" }}>CR2025</div></div>
    {fl > 0 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: fl * 0.8 }} />}
    <Tag tt={tt} at={3.6} x={760} y={900} txt="SO YOU KNOW WHAT TO BUY" col={TX} size={46} />
  </>;
}}</Stage>;

// 16 · las tres llaves que más vi, en una bandeja giratoria: ranura de moneda, la que se pliega, la de tapa atrás
export const HKinds3: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const rot = eio(tt, 0, 9) * 240, act = tt < 3.4 ? 0 : tt < 6.6 ? 1 : 2, flip = phys(tt, 4.0, 6, 0.5), plate = eio(tt, 7.2, 8.2);
  return <div style={{ position: "absolute", inset: 0, perspective: 1800 }}>
    <div style={{ position: "absolute", left: 960 - 520, top: 640, width: 1040, height: 1040, marginTop: -520, borderRadius: "50%", background: "radial-gradient(#6b4a2e,#4a321d)", transform: `rotateX(72deg) rotateZ(${rot}deg)`, boxShadow: "0 0 0 18px #3a2716" }} />
    {[0, 1, 2].map((i) => {
      const a = (i * 120 + rot - 90) * Math.PI / 180, x = 960 + 420 * Math.cos(a), y = 600 + 110 * Math.sin(a), z = Math.sin(a), on = act === i;
      return <div key={i} style={{ position: "absolute", left: x, top: y - 160, transform: `translate(-50%,-50%) scale(${0.62 + 0.18 * z + (on ? 0.12 : 0)})`, zIndex: Math.round(z * 10) + 10, opacity: on ? 1 : 0.55, filter: on ? `drop-shadow(0 0 30px ${AMB})` : undefined }}>
        <div style={{ position: "relative" }}>
          {i === 1 && <div style={{ position: "absolute", left: 95, top: 220, width: 30, height: 200, background: "linear-gradient(90deg,#e6e8eb,#8f949b)", borderRadius: 6, transformOrigin: "50% 0", transform: `rotate(${180 - 180 * cl(flip)}deg)` }} />}
          <Fob w={220} />
          {i === 0 && <div style={{ position: "absolute", left: 90, top: 182, width: 40, height: 10, background: on ? AMB : "#000", boxShadow: on ? `0 0 20px ${AMB}` : undefined }} />}
          {i === 2 && <div style={{ position: "absolute", left: 40, top: 230, width: 140, height: 120, borderRadius: 16, background: "#2b2d33", border: "2px solid #60646c", transform: `translateY(${plate * 160}px) rotate(${plate * 14}deg)` }} />}
        </div>
      </div>;
    })}
    <Tag tt={tt} at={0.5} x={960} y={900} txt={["COIN SLOT", "FLIP KEY", "BACK PLATE"][act]} col={AMB} size={60} />
  </div>;
}}</Stage>;

// 17 · el tornillito: el destornillador de anteojos gira, el tornillo sube girando y cae en la taza; la tapa sale
export const HScrew: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const turn = cl((tt - 0.6) / 2.0), out = eio(tt, 2.6, 3.6), fall = eio(tt, 3.6, 4.6), back = eio(tt, 5.0, 6.0);
  const rise = eio(tt, 1.8, 2.6), lift = eio(tt, 2.4, 3.2), sx = 900 + 520 * out, sy = 470 - 110 * rise - 160 * Math.sin(out * Math.PI) + 440 * fall;
  return <>
    <div style={{ position: "absolute", left: 560, top: 230, width: 680, height: 620, borderRadius: 120, background: "linear-gradient(160deg,#3a3d44,#141518)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: `translateY(${back * 40}px) rotate(${back * -8}deg) translateX(${-back * 120}px)` }}>
      <div style={{ position: "absolute", left: 260, top: 60, width: 160, height: 160, borderRadius: "50%", border: "10px solid #9aa0a8" }} /></div>
    <div style={{ position: "absolute", left: sx, top: sy, width: 100, height: 100, borderRadius: "50%", transform: `translate(-50%,-50%) rotate(${turn * 900 + out * 400}deg)`, background: "radial-gradient(#e6e8eb,#8f949b)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 45, top: 14, width: 10, height: 72, background: "#3d4148" }} /><div style={{ position: "absolute", left: 14, top: 45, width: 72, height: 10, background: "#3d4148" }} /></div>
    <div style={{ position: "absolute", left: 900, top: 470 - 460 - 110 * rise - 520 * lift, width: 26, height: 420, transform: `translateX(-50%) rotate(${turn * 900}deg)`, transformOrigin: "50% 100%", background: "linear-gradient(90deg,#e6e8eb,#8f949b)", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 1330, top: 760, width: 190, height: 170, borderRadius: "0 0 50px 50px", background: "linear-gradient(90deg,#d9d4ca,#f4efe6,#cfc8bb)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", right: -50, top: 30, width: 60, height: 90, borderRadius: "0 40px 40px 0", border: "16px solid #e3ddd1", borderLeft: "none" }} /></div>
    <Tag tt={tt} at={4.4} x={1425} y={680} txt="INTO A CUP" col={TX} size={44} />
  </>;
}}</Stage>;

// 18 · la pila suelta: rueda entre los clips del cajón; una manito asoma y la pila late en rojo
export const HLoose: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = cl(tt / 4), px = 520 + 900 * k + 40 * Math.sin(k * 12), py = 520 + 140 * Math.sin(k * 7), hand = eio(tt, 5.2, 6.4);
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(48deg)", transformOrigin: "50% 70%" }}>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 720, background: "linear-gradient(#c79a63,#a87a46)", borderRadius: 10, boxShadow: "inset 0 0 0 28px #8a5f33, 0 50px 90px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 440 + rnd(i) * 1000, top: 260 + rnd(i + 20) * 600, width: 90, height: 28, borderRadius: 14, border: "5px solid #b8bec6", transform: `rotate(${rnd(i + 5) * 180}deg)` }} />)}
    <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) rotate(${k * 1440}deg)` }}><Coin d={90} label="" /></div>
    {tt > 4.6 && <div style={{ position: "absolute", left: px - 110, top: py - 110, width: 220, height: 220, borderRadius: "50%", border: `8px solid ${RED}`, transform: `scale(${0.8 + ((tt * 1.4) % 1) * 0.6})`, opacity: 1 - ((tt * 1.4) % 1) }} />}
    <div style={{ position: "absolute", left: px - 70, top: 1040 - 360 * hand, width: 140, height: 260, borderRadius: "70px 70px 30px 30px", background: "linear-gradient(#f2c7a6,#d9a07c)", boxShadow: "0 20px 40px rgba(0,0,0,.4)" }} />
    <Tag tt={tt} at={5.6} x={960} y={120} txt="NOT NEAR LITTLE HANDS" col={RED} size={54} />
  </div>;
}}</Stage>;

// 19 · la bolsita pegada arriba: sube por la puerta del mueble, dos cintas la clavan; la manito no llega
export const HTapeUp: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const up = eio(tt, 0.4, 1.8), t1 = phys(tt, 2.0, 10, 0.4), t2 = phys(tt, 2.4, 10, 0.4), kid = eio(tt, 3.6, 4.8);
  return <>
    <div style={{ position: "absolute", left: 640, top: 90, width: 640, height: 920, background: "linear-gradient(90deg,#b98a55,#d1a56f,#b98a55)", borderRadius: 10, boxShadow: "inset 0 0 0 24px #9a6c3c, 0 40px 80px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 960, top: 820 - 620 * up, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 230, height: 180, borderRadius: 10, background: "rgba(230,240,250,.45)", border: "3px solid rgba(255,255,255,.7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 30px rgba(0,0,0,.35)" }}><Coin d={100} label="CR" /></div>
      <div style={{ position: "absolute", left: -40, top: -14, width: 120, height: 40, background: "rgba(245,235,200,.85)", transform: `rotate(-12deg) scale(${t1})` }} />
      <div style={{ position: "absolute", right: -40, top: -14, width: 120, height: 40, background: "rgba(245,235,200,.85)", transform: `rotate(10deg) scale(${t2})` }} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 1080 - 520 * kid, width: 200, height: 520, opacity: kid }}>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#3a3d44", margin: "0 auto" }} /><div style={{ width: 200, height: 400, borderRadius: "80px 80px 0 0", background: "#3a3d44", marginTop: 8 }} /></div>
    <div style={{ position: "absolute", left: 300, right: 1100, top: 1080 - 560 * kid, borderTop: `5px dashed ${RED}`, opacity: kid }} />
    <Tag tt={tt} at={2.6} x={1460} y={200} txt="UP HIGH" col={GRN} size={64} />
  </>;
}}</Stage>;

// 20 · la llave escondida: se aprieta el botón, la hoja de metal sale con resorte y la tapita de la manija salta
export const HBlade: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const press = tt > 0.8 && tt < 1.3 ? 1 : 0, out = phys(tt, 1.2, 7, 0.45), cap = phys(tt, 4.2, 8, 0.4), fly = eio(tt, 5.4, 6.8);
  return <>
    <div style={{ position: "absolute", left: 560 + 560 * fly, top: 220 + 180 * fly, transform: `rotate(${-90 * fly}deg) scale(${1 - 0.3 * fly})`, transformOrigin: "50% 80%" }}>
      <div style={{ position: "absolute", left: 95, top: 330, width: 30, height: 260 * cl(out), background: "linear-gradient(90deg,#f0f2f4,#8f949b)", borderRadius: "4px 4px 10px 10px", clipPath: "polygon(0 0,100% 0,100% 70%,60% 78%,100% 86%,40% 100%,0 100%)" }} />
      <Fob w={220} /><div style={{ position: "absolute", left: 160, top: 300, width: 40, height: 18, borderRadius: 6, background: press ? AMB : "#60646c", transform: `translateX(${press * -6}px)` }} />
    </div>
    <div style={{ position: "absolute", left: 1180, top: 560, width: 460, height: 120, borderRadius: 60, background: "linear-gradient(#d5d8dc,#9aa0a8)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 70, height: 60, borderRadius: 14, background: "#25272c" }}><div style={{ width: 10, height: 30, borderRadius: 4, background: "#000", margin: "15px auto" }} /></div>
      <div style={{ position: "absolute", left: 16, top: 24, width: 80, height: 72, borderRadius: 16, background: "linear-gradient(#c9ccd1,#8f949b)", transform: `translate(${-90 * cl(cap)}px, ${-140 * cl(cap)}px) rotate(${-40 * cl(cap)}deg)` }} />
    </div>
    <Tag tt={tt} at={1.6} x={560} y={960} txt="HIDDEN METAL KEY" col={AMB} size={50} />
    <Tag tt={tt} at={4.4} x={1400} y={460} txt="UNDER THE CAP" col={TX} size={44} />
  </>;
}}</Stage>;

// 21 · el botón de arranque: la llave sin pila se apoya y la bobina de adentro toma energía del auto
export const HStartBtn: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const app = eio(tt, 0.4, 1.8), on = cl((tt - 1.9) / 0.8), lit = cl((tt - 3.0) / 0.5);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 360, height: 360, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(#2a2c31,#101114)", boxShadow: `0 0 0 16px #8f949b, 0 0 ${60 * lit}px ${GRN}, 0 40px 80px rgba(0,0,0,.6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={120} height={120} viewBox="0 0 40 40"><path d="M20 6 L20 20" stroke={lit > 0.5 ? GRN : "#9aa0a8"} strokeWidth="4" strokeLinecap="round" /><path d="M11 11 A12 12 0 1 0 29 11" fill="none" stroke={lit > 0.5 ? GRN : "#9aa0a8"} strokeWidth="4" strokeLinecap="round" /></svg></div>
    {on > 0 && Array.from({ length: 5 }, (_, i) => { const f = ((tt * 1.2 + i / 5) % 1); return <div key={i} style={{ position: "absolute", left: 960, top: 560, width: 380 - 260 * f, height: 380 - 260 * f, borderRadius: "50%", transform: "translate(-50%,-50%)", border: `4px solid ${ICE}`, opacity: f * on }} />; })}
    <At x={960 + 520 * (1 - app)} y={560 - 40 * (1 - app)} s={0.9} rot={-20 + 20 * app}><div style={{ position: "relative" }}><Fob w={220} dim={0.3} />
      <svg width={120} height={120} viewBox="0 0 40 40" style={{ position: "absolute", left: 50, top: 200, opacity: on }}><path d="M20 20 m0 -2 a2 2 0 1 1 0 4 a5 5 0 1 1 0 -10 a8 8 0 1 1 0 16 a11 11 0 1 1 0 -22" fill="none" stroke={ICE} strokeWidth="2" /></svg></div></At>
    <Tag tt={tt} at={2.0} x={960} y={160} txt="HOLD IT RIGHT AGAINST IT" col={ICE} size={48} />
  </>;
}}</Stage>;

// 22 · sábado de sol contra las 2 de la mañana: el mismo descubrimiento, dos lugares muy distintos
export const HSunny: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sun = cl(tt / 10), take = eio(tt, 8.5, 10);
  const sx = 200 + 1500 * sun, sy = 330 - 220 * Math.sin(sun * Math.PI);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${50 + 50 * take}%`, overflow: "hidden", background: "linear-gradient(#7fc3ec,#cfe9f7 70%,#9ab07a 70%)" }}>
      <div style={{ position: "absolute", left: sx * 0.5 * (1 + take), top: sy, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(#fffbe0,#ffd34d)", boxShadow: "0 0 80px #ffd34d", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "absolute", left: 260, top: 560 }}><CarSide w={460} col="#c94a3a" /></div>
    </div>
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${50 - 50 * take}%`, overflow: "hidden", background: "linear-gradient(#05070d,#121826 70%,#1b1d22 70%)" }}>
      <div style={{ position: "absolute", left: 140, top: 140, width: 18, height: 420, background: "#3a3d44" }} /><div style={{ position: "absolute", left: 90, top: 120, width: 120, height: 30, borderRadius: 10, background: "#ffd9a0", boxShadow: "0 30px 120px 40px rgba(255,200,120,.25)" }} />
      <div style={{ position: "absolute", left: 220, top: 600 }}><CarSide w={420} col="#6d7178" /></div>
      <div style={{ position: "absolute", right: 70, top: 80, fontFamily: MARK, fontSize: 90, color: RED, opacity: 0.6 + 0.4 * Math.sin(tt * 3) }}>2:00</div>
    </div>
    <Tag tt={tt} at={0.6} x={480} y={940} txt="SUNNY SATURDAY" col="#1d2a12" size={52} />
    <div style={{ opacity: 1 - take }}><Tag tt={tt} at={1.4} x={1440} y={940} txt="2 AM PARKING LOT" col={RED} size={48} /></div>
  </>;
}}</Stage>;

// 23 · la bolsa en corte: el forro de malla de metal; las ondas pegan y rebotan, la llave adentro duerme
export const HFaraday: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const cut = eio(tt, 0.4, 1.6);
  return <>
    <At x={1200} y={540} s={1.7}><div style={{ position: "relative" }}><Pouch w={300} lining={cut} />
      <div style={{ position: "absolute", left: 60, top: 120, transform: "scale(.45)", transformOrigin: "0 0", opacity: cut }}><Fob w={360} dim={0.35} /></div>
      <svg width={300} height={375} viewBox="0 0 100 125" style={{ position: "absolute", left: 0, top: 0, opacity: cut * 0.7 }}>{Array.from({ length: 14 }, (_, i) => <g key={i}><line x1={14 + i * 5.5} y1="28" x2={14 + i * 5.5 - 20} y2="116" stroke="#cfd6de" strokeWidth=".6" /><line x1={14 + i * 5.5 - 20} y1="28" x2={14 + i * 5.5} y2="116" stroke="#cfd6de" strokeWidth=".6" /></g>)}</svg>
    </div></At>
    <Waves x={260} y={540} k={tt * 0.7} n={4} r={640} col={ICE} ang={0} spread={34} />
    {tt > 1.2 && <Waves x={880} y={540} k={tt * 0.7 + 0.5} n={3} r={420} col={ICE} ang={180} spread={60} op={0.6} />}
    <Tag tt={tt} at={1.6} x={1200} y={150} txt="METAL FABRIC LINING" col={TX} size={48} />
  </>;
}}</Stage>;

export const HEROES_A: Record<string, React.FC<P>> = { listen: HListen, relay: HRelay, empty: HEmpty, cutaway: HCutaway, twins: HTwins, okmap: HOkMap, drawer: HDrawer, spots: HSpots, reach: HReach,
  gift: HGift, tape: HTape, nobatt: HNoBatt, notch: HNotch, twist: HTwist, snap: HSnap, kinds3: HKinds3, screw: HScrew, loose: HLoose, tapeup: HTapeUp, blade: HBlade, startbtn: HStartBtn, sunny: HSunny, faraday: HFaraday };
void HAND;
