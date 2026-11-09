// blt01 · un componente único por tema del apagón. 2D con resorte, dentro de Stage (hkit). Render SÓLO en el farm.
import React from "react";
import { AMB, DIM, GRN, H, HAND, ICE, MARK, RED, Stage, TX, cl, eio, phys } from "./hkit";

type P = { t: number; h: H };
const rise = (tt: number, at: number, d = 26): React.CSSProperties => ({ opacity: cl((tt - at) / 0.22), transform: `translateY(${(1 - phys(tt, at, 8, 0.62)) * d}px)` });
const pop = (tt: number, at: number): React.CSSProperties => { const k = phys(tt, at, 11, 0.5); return { opacity: cl((tt - at) / 0.1), transform: `scale(${Math.max(0.001, k)})` }; };
const abs = (x: number, y: number, w?: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w });
const T: React.FC<{ s: number; c?: string; w?: number; ls?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = TX, w = 900, ls = 0, style, children }) =>
  <div style={{ fontSize: s, color: c, fontWeight: w, letterSpacing: ls, lineHeight: 1.06, textShadow: "0 4px 18px rgba(0,0,0,.65)", ...style }}>{children}</div>;
const Center: React.FC<{ y: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ y, style, children }) => <div style={{ position: "absolute", top: y, left: 0, width: 1920, textAlign: "center", ...style }}>{children}</div>;
const X: React.FC<{ s?: number; c?: string }> = ({ s = 54, c = RED }) => <svg width={s} height={s} viewBox="0 0 10 10"><path d="M1.6 1.6 L8.4 8.4 M8.4 1.6 L1.6 8.4" stroke={c} strokeWidth={1.9} strokeLinecap="round" /></svg>;
const Check: React.FC<{ s?: number; c?: string }> = ({ s = 54, c = GRN }) => <svg width={s} height={s} viewBox="0 0 10 10"><path d="M1.2 5.6 L4 8.3 L8.9 1.9" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Stamp: React.FC<{ tt: number; at: number; txt: string; c?: string; size?: number; rot?: number }> = ({ tt, at, txt, c = RED, size = 120, rot = -8 }) => {
  const k = phys(tt, at, 13, 0.55);
  return <span style={{ display: "inline-block", opacity: cl((tt - at) / 0.06), transform: `rotate(${rot}deg) scale(${2.1 - 1.1 * k})`, border: `10px solid ${c}`, borderRadius: 16, padding: "4px 30px", fontFamily: MARK, fontSize: size, color: c, lineHeight: 1.1 }}>{txt}</span>;
};
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// 0:27 · el televisor viejo con las barras: sólo un minuto de prueba
export const HTest: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const bars = ["#d8d8d8", "#d8c63a", "#3ec7c9", "#44b84a", "#c13fb5", "#c8352c", "#3647bd"], fill = eio(tt, 1.1, 6.2);
  return <>
    <div style={{ ...abs(150, 150, 900), height: 680, background: "linear-gradient(160deg,#4a3a2a,#231a12)", borderRadius: 44, boxShadow: "0 40px 90px rgba(0,0,0,.7)", ...rise(tt, 0.05, 60) }}>
      <div style={{ position: "absolute", left: 44, top: 44, width: 690, height: 590, borderRadius: 34, overflow: "hidden", display: "flex", background: "#000" }}>
        {bars.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, background: "rgba(0,0,0,.9)", padding: "26px 0", textAlign: "center" }}><T s={52}>EMERGENCY ALERT</T><T s={92} c={AMB}>TEST</T></div>
      </div>
      {[150, 300].map((y) => <div key={y} style={{ position: "absolute", left: 776, top: y, width: 84, height: 84, borderRadius: 50, background: "radial-gradient(circle at 35% 30%,#a58d6a,#3b2c1d)" }} />)}
    </div>
    <div style={{ ...abs(1120, 130, 720) }}>
      <div style={rise(tt, 0.5)}><T s={40} c={DIM} ls={3}>NOVEMBER 17 · 2:20 PM ET</T></div>
      <div style={{ ...rise(tt, 0.9), marginTop: 18 }}><T s={104}>ABOUT<br />1 MINUTE</T></div>
      <div style={{ marginTop: 26, height: 26, width: 660, borderRadius: 13, background: "rgba(255,255,255,.16)", overflow: "hidden" }}><div style={{ height: "100%", width: `${fill * 100}%`, background: AMB }} /></div>
      {["RADIO", "TV", "CABLE", "SATELLITE"].map((x, i) => <span key={x} style={{ display: "inline-block", margin: "28px 16px 0 0", padding: "10px 24px", borderRadius: 12, background: "rgba(255,255,255,.12)", fontSize: 42, fontWeight: 800, ...pop(tt, 1.6 + i * 0.3) }}>{x}</span>)}
      <div style={{ marginTop: 38, ...rise(tt, 3.6) }}><T s={58} c={GRN}>NOT YOUR PHONE.<br />NOT YOUR POWER.</T></div>
    </div>
  </>;
}}</Stage>;

// 1:24 · el anillo del 13 %
export const HPct: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.4, 2.4), R0 = 300, L = 2 * Math.PI * R0;
  return <>
    <svg style={abs(200, 150)} width={780} height={780} viewBox="0 0 780 780"><circle cx={390} cy={390} r={R0} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={70} />
      <circle cx={390} cy={390} r={R0} fill="none" stroke={RED} strokeWidth={70} strokeLinecap="round" strokeDasharray={`${L * 0.13 * k} ${L}`} transform="rotate(-90 390 390)" /></svg>
    <div style={{ ...abs(200, 420, 780), textAlign: "center" }}><T s={220}>{Math.round(13 * k)}%</T></div>
    <div style={{ ...abs(1080, 300, 760), ...rise(tt, 1.2) }}><T s={46} c={DIM} ls={3}>BRITISH GOVERNMENT SURVEY</T><T s={108} style={{ marginTop: 24 }}>SAID THEY FELT PREPARED</T></div>
  </>;
}}</Stage>;

// 1:31 · rumor falso, problema real
export const HFake: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <>
  <Center y={140}><div style={rise(tt, 0.05)}><T s={100}>THE RUMOR</T></div><div style={{ marginTop: 26 }}><Stamp tt={tt} at={0.55} txt="FAKE" size={150} /></div></Center>
  <Center y={580}><div style={rise(tt, 1.9)}><T s={100}>THE PROBLEM</T></div><div style={{ marginTop: 26 }}><Stamp tt={tt} at={2.5} txt="REAL" c={AMB} size={150} rot={5} /></div></Center>
</>}</Stage>;

// 3:02 · 2003: las ventanas de la ciudad se apagan en ola y el contador llega a 50 millones
export const HGrid: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="#06080f">{(tt) => {
  const cols = 70, rows = 26, wave = eio(tt, 0.5, 5.2) * (cols + 12);
  return <>
    <svg style={abs(0, 300)} width={1920} height={780}>{Array.from({ length: cols * rows }, (_, i) => {
      const c = i % cols, r = Math.floor(i / cols), sky = 8 + 8 * Math.abs(Math.sin(c * 1.7) * Math.cos(c * 0.53)); if (r < rows - sky - 8) return null;
      const on = c + (i * 7 % 9) > wave; return <rect key={i} x={c * 27.4 + 6} y={r * 29 + 20} width={16} height={19} rx={2} fill={on ? (i % 5 ? "#ffd27a" : "#fff0c4") : "#141a26"} opacity={on ? 0.92 : 1} />;
    })}</svg>
    <Center y={70}><div style={rise(tt, 0.1)}><T s={46} c={DIM} ls={3}>AUGUST 2003 · U.S. AND CANADA</T></div><T s={170} c={AMB} style={{ marginTop: 8 }}>{fmt(50e6 * eio(tt, 0.5, 5.2))}</T><div style={rise(tt, 1.0)}><T s={62}>PEOPLE LOST POWER</T></div></Center>
  </>;
}}</Stage>;

// 3:20 · Texas: 246 y de qué murieron
export const HTexas: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 1.6, 3.6);
  return <>
    <Center y={70}><div style={rise(tt, 0.05)}><T s={46} c={DIM} ls={3}>TEXAS · FEBRUARY 2021 · STATE COUNT</T></div><T s={240} style={{ marginTop: 6 }}>{Math.round(246 * eio(tt, 0.2, 1.6))}</T><div style={rise(tt, 0.7)}><T s={64}>DEATHS</T></div></Center>
    <div style={{ ...abs(190, 620, 1540), height: 110, borderRadius: 18, background: "rgba(255,255,255,.12)", overflow: "hidden" }}><div style={{ width: `${66 * k}%`, height: "100%", background: `linear-gradient(90deg,#6db9ee,${ICE})` }} /></div>
    <div style={{ ...abs(190, 770, 1540), ...rise(tt, 2.8) }}><T s={64} c={ICE}>CLOSE TO 2 OUT OF 3: THE COLD</T></div>
    <div style={{ ...abs(190, 880, 1540), ...rise(tt, 4.4) }}><T s={64} c={RED}>19 MORE: CARBON MONOXIDE</T></div>
  </>;
}}</Stage>;

// 4:08 · el Sol con su agujero coronal: real, común y sin fecha
export const HSun: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="#04050c">{(tt) => <>
  <svg style={abs(0, 0)} width={1920} height={1080}><defs><radialGradient id="sunG" cx="42%" cy="42%"><stop offset="0%" stopColor="#ffe9a6" /><stop offset="60%" stopColor="#ffab35" /><stop offset="100%" stopColor="#d9570f" /></radialGradient></defs>
    <circle cx={520} cy={540} r={400 * phys(tt, 0, 5, 0.8)} fill="url(#sunG)" />
    <path d="M430 300 C520 250 640 300 650 400 C660 480 620 620 560 690 C500 760 430 700 450 600 C465 520 390 470 395 390 C398 345 410 320 430 300Z" fill="#2a0f07" opacity={0.92 * cl((tt - 0.9) / 0.6)} />
    {Array.from({ length: 11 }, (_, i) => { const y = 310 + i * 46, x0 = 650 + 40 * Math.sin(i), p = ((tt * 1.1 + i * 0.27) % 1); return <line key={i} x1={x0 + p * 300} y1={y} x2={x0 + p * 300 + 110} y2={y} stroke="#ffc46b" strokeWidth={5} strokeLinecap="round" opacity={cl((tt - 1.3) / 0.4) * 0.75} />; })}
  </svg>
  <div style={{ ...abs(1110, 150, 760), ...rise(tt, 0.8) }}><T s={46} c={DIM} ls={3}>WHAT YOU ARE SEEING</T><T s={104} c={AMB} style={{ marginTop: 18 }}>A CORONAL HOLE</T></div>
  <div style={{ ...abs(1110, 560, 760), ...rise(tt, 2.1) }}><T s={72}>REAL. COMMON.</T></div>
  <div style={{ ...abs(1110, 680, 760), ...rise(tt, 3.4) }}><T s={56} c={GRN}>USUALLY: MINOR STORMS AND NORTHERN LIGHTS</T></div>
</>}</Stage>;

// 5:34 · la regla de los 20 pies y los cuatro nunca
export const HFeet: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(#101725,#1c2230 60%,#22262c)">{(tt) => {
  const k = eio(tt, 0.7, 2.5), x0 = 500, x1 = 1420, gx = x0 + (x1 - x0) * k;
  return <>
    <svg style={abs(0, 0)} width={1920} height={1080}>
      <line x1={0} y1={640} x2={1920} y2={640} stroke="rgba(255,255,255,.3)" strokeWidth={4} />
      <path d="M170 640 V380 L335 250 L500 380 V640 Z" fill="#44413d" stroke="#6b665f" strokeWidth={6} /><rect x={290} y={500} width={92} height={140} fill="#2a2724" /><rect x={208} y={420} width={70} height={70} fill="#c8a35a" />
      <g transform={`translate(${gx} 560)`}><rect x={-80} y={0} width={160} height={78} rx={10} fill="#b5301f" /><rect x={-58} y={-30} width={116} height={38} rx={8} fill="#2b2b2e" /><circle cx={-54} cy={80} r={12} fill="#111" /><circle cx={54} cy={80} r={12} fill="#111" />
        {[0, 1, 2].map((i) => { const p = (tt * 0.8 + i * 0.33) % 1; return <circle key={i} cx={100 + p * 150} cy={22 - p * 44} r={14 + p * 26} fill="#8d8d8d" opacity={0.42 * (1 - p)} />; })}</g>
      <g opacity={cl((tt - 2.2) / 0.3)}><line x1={510} y1={700} x2={1410} y2={700} stroke={AMB} strokeWidth={7} /><path d="M510 700 l26 -16 v32z M1410 700 l-26 -16 v32z" fill={AMB} /></g>
    </svg>
    <Center y={718}><div style={pop(tt, 2.4)}><T s={78} c={AMB}>AT LEAST 20 FEET FROM THE HOUSE</T></div></Center>
    <Center y={90}><div style={rise(tt, 0.1)}><T s={84}>A GENERATOR RUNS OUTSIDE</T></div></Center>
    <div style={{ position: "absolute", top: 880, left: 0, width: 1920, display: "flex", justifyContent: "center", gap: 46 }}>{["GARAGE", "BASEMENT", "PORCH", "DOOR CRACKED"].map((x, i) => <div key={x} style={{ display: "flex", alignItems: "center", gap: 10, ...pop(tt, 3.6 + i * 0.55) }}><X /><T s={58}>{x}</T></div>)}</div>
  </>;
}}</Stage>;

// 7:32 · cuánto aguanta la comida con la puerta cerrada
export const HFridge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const rows: [string, string, number][] = [["FRIDGE", "4 HOURS", 4], ["HALF-FULL FREEZER", "24 HOURS", 24], ["FULL FREEZER", "48 HOURS", 48]];
  return <>
    <Center y={70}><div style={rise(tt, 0.05)}><T s={92}>KEEP THE DOOR SHUT</T></div></Center>
    {rows.map(([a, b, n], i) => { const at = 0.8 + i * 1.2, k = eio(tt, at, at + 0.9); return <div key={a} style={{ ...abs(170, 270 + i * 240, 1580), ...rise(tt, at) }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><T s={66}>{a}</T><T s={78} c={i ? ICE : AMB}>{b}</T></div>
      <div style={{ marginTop: 16, height: 62, borderRadius: 14, background: "rgba(255,255,255,.12)", overflow: "hidden" }}><div style={{ height: "100%", width: `${(n / 48) * 100 * k}%`, background: i ? ICE : AMB }} /></div>
    </div>; })}
  </>;
}}</Stage>;

// 8:48 · la cuenta del agua, con jarras
const Jug: React.FC<{ s?: number }> = ({ s = 130 }) => <svg width={s} height={s * 1.25} viewBox="0 0 40 50"><path d="M15 3h10v6c8 3 10 8 10 13v21c0 3-2 5-5 5H10c-3 0-5-2-5-5V22c0-5 2-10 10-13z" fill="#bfe6ff" opacity=".9" stroke="#eaf7ff" strokeWidth="2" /><rect x="14" y="1" width="12" height="5" rx="2" fill="#2f7fd0" /></svg>;
export const HWater: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tiles: [string, string][] = [["1", "GALLON"], ["2", "PEOPLE"], ["3", "DAYS"]];
  return <>
    <div style={{ position: "absolute", top: 110, left: 0, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
      {tiles.map(([a, b], i) => <React.Fragment key={b}>{i > 0 && <div style={pop(tt, 0.4 + i * 0.8 - 0.25)}><T s={110} c={DIM}>×</T></div>}<div style={{ width: 360, textAlign: "center", padding: "24px 0", borderRadius: 26, background: "rgba(255,255,255,.1)", ...pop(tt, 0.4 + i * 0.8) }}><T s={150} c={ICE}>{a}</T><T s={58}>{b}</T></div></React.Fragment>)}
    </div>
    <div style={{ position: "absolute", top: 510, left: 0, width: 1920, display: "flex", justifyContent: "center", gap: 28 }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={pop(tt, 3.0 + i * 0.2)}><Jug /></div>)}</div>
    <Center y={800}><div style={pop(tt, 4.6)}><T s={124} c={AMB}>= 6 GALLONS</T></div></Center>
  </>;
}}</Stage>;

// 9:06 · las gotas de lavandina
export const HBleach: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.min(8, Math.floor(cl((tt - 0.5) / 2.4) * 9)), p = ((tt - 0.5) * 3.4) % 1, y = 180 + p * 330;
  return <>
    <svg style={abs(170, 90)} width={640} height={930} viewBox="0 0 640 930">
      {tt > 0.5 && tt < 2.9 && <path d={`M320 ${y} c-16 26 -24 40 -24 54 a24 24 0 0 0 48 0 c0 -14 -8 -28 -24 -54z`} fill="#dff4ff" />}
      <path d="M240 310h160v70c120 40 140 110 140 170v290c0 36-24 60-60 60H160c-36 0-60-24-60-60V550c0-60 20-130 140-170z" fill="#8ccdf6" opacity=".5" stroke="#dff4ff" strokeWidth={8} />
    </svg>
    <div style={{ ...abs(900, 70, 900), ...rise(tt, 0.2) }}><T s={46} c={DIM} ls={3}>PLAIN UNSCENTED BLEACH · 6%</T><T s={230} c={AMB} style={{ marginTop: 10 }}>{n || 1}</T><T s={82}>DROPS PER GALLON</T></div>
    <div style={{ ...abs(900, 590, 960), ...rise(tt, 3.3) }}><T s={54} c={ICE}>CLOUDY WATER: 16 DROPS</T></div>
    <div style={{ ...abs(900, 668, 960), ...rise(tt, 4.4) }}><T s={54}>WAIT 30 MINUTES</T></div>
    <div style={{ ...abs(900, 746, 960), ...rise(tt, 5.5) }}><T s={54} c={GRN}>8.25% BLEACH: ONLY 6 DROPS</T></div>
    <div style={{ ...abs(900, 836, 900), ...rise(tt, 6.4) }}><T s={46} c={RED}>FUEL OR CHEMICALS IN IT? DO NOT DRINK IT.</T></div>
  </>;
}}</Stage>;

// 9:44 · más de 40 grados por más de 2 horas: a la basura
export const HToss: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.4, 2.2), f = Math.round(34 + 12 * k), hrs = 2 * eio(tt, 2.0, 3.5);
  return <>
    <svg style={abs(180, 110)} width={260} height={860} viewBox="0 0 260 860"><rect x={95} y={20} width={70} height={680} rx={35} fill="rgba(255,255,255,.14)" /><rect x={110} y={640 - 520 * k} width={40} height={90 + 520 * k} fill={k > 0.5 ? RED : ICE} /><circle cx={130} cy={740} r={90} fill={k > 0.5 ? RED : ICE} /></svg>
    <div style={{ ...abs(520, 140, 600) }}><T s={190} c={k > 0.5 ? RED : ICE}>{f}°F</T><div style={rise(tt, 1.2)}><T s={58}>ABOVE 40°</T></div></div>
    <div style={{ ...abs(1130, 140, 680), ...rise(tt, 2.0) }}><T s={190} c={AMB}>{hrs.toFixed(1)}</T><T s={58}>HOURS OR MORE</T></div>
    <div style={{ position: "absolute", top: 520, left: 520, display: "flex", gap: 24 }}>{["MEAT", "MILK", "EGGS", "LEFTOVERS"].map((x, i) => <span key={x} style={{ padding: "14px 28px", borderRadius: 14, background: "rgba(255,255,255,.12)", fontSize: 54, fontWeight: 800, ...pop(tt, 3.6 + i * 0.3) }}>{x}</span>)}</div>
    <div style={{ position: "absolute", top: 700, left: 520, width: 1240, textAlign: "center" }}><Stamp tt={tt} at={5.2} txt="THROW IT OUT" size={124} /></div>
  </>;
}}</Stage>;

// 11:17 · la línea: cuándo te vas
export const HLine: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const rows = ["ANYONE IN MEDICAL DANGER", "BELOW FREEZING AND NO WARM ROOM", "WATER OUT, DOWN TO ONE DAY"];
  return <>
    <Center y={70}><div style={rise(tt, 0.05)}><T s={120}>WE LEAVE IF:</T></div></Center>
    {rows.map((x, i) => <div key={x} style={{ ...abs(160, 300 + i * 220, 1600), display: "flex", alignItems: "center", gap: 36, background: "rgba(255,255,255,.08)", borderRadius: 22, padding: "34px 40px", ...rise(tt, 1 + i * 1.5, 50) }}><div style={pop(tt, 1.3 + i * 1.5)}><Check s={82} c={AMB} /></div><T s={70}>{x}</T></div>)}
  </>;
}}</Stage>;

// 12:36 · plano de la casa: el camino de la cama al baño
export const HPath: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="#12100d">{(tt) => {
  const items: [number, number, string][] = [[800, 500, "RUG"], [1020, 690, "CORD"], [1260, 520, "SHOES"]];
  return <>
    <svg style={abs(0, 0)} width={1920} height={1080}>
      <rect x={200} y={230} width={1520} height={760} fill="#1d1a15" stroke="#6d6250" strokeWidth={12} />
      <rect x={260} y={330} width={300} height={470} rx={18} fill="#46506a" /><rect x={285} y={350} width={250} height={120} rx={14} fill="#dcd8cc" />
      <rect x={1460} y={640} width={200} height={290} rx={30} fill="#d6d8d8" />
      <path d="M570 620 C760 700 900 400 1080 590 S1320 860 1460 790" fill="none" stroke={AMB} strokeWidth={12} strokeDasharray="10 34" strokeLinecap="round" />
      <g transform="translate(590 780)"><rect width={80} height={34} rx={10} fill="#d84" opacity={cl((tt - 2.9) / 0.3)} /><path d="M80 17 L330 -60 L330 94 Z" fill="#ffd98a" opacity={0.3 * cl((tt - 2.9) / 0.3)} /></g>
    </svg>
    {items.map(([x, y, s], i) => { const out = cl((tt - (1.1 + i * 0.6)) / 0.4); return <div key={s} style={{ ...abs(x - 120, y - 50, 240), textAlign: "center", opacity: 1 - out, transform: `translateY(${out * 70}px) scale(${1 - 0.3 * out})` }}><div style={{ background: RED, borderRadius: 14, padding: "12px 0", fontSize: 56, fontWeight: 900 }}>{s}</div></div>; })}
    <Center y={68}><div style={rise(tt, 0.05)}><T s={92}>CLEAR THE PATH TONIGHT</T></div></Center>
    <div style={{ position: "absolute", left: 620, top: 860, width: 800, ...rise(tt, 3.0) }}><T s={56} c={AMB}>FLASHLIGHT WHERE YOUR HAND LANDS</T></div>
  </>;
}}</Stage>;

// 13:00 · la hoja de los remedios
export const HSheet: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="#13110e">{(tt) => {
  const rows = ["Name", "Dose", "Time", "Doctor's phone"];
  return <>
    <div style={{ ...abs(250, 70, 760), height: 950, background: "#f5eedc", borderRadius: 10, padding: "70px 60px", transform: `rotate(-2deg) translateY(${(1 - phys(tt, 0, 6, 0.7)) * 70}px)`, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
      <div style={{ fontFamily: HAND, fontSize: 92, fontWeight: 700, color: "#27221a" }}>My Medicines</div>
      {rows.map((x, i) => <div key={x} style={{ marginTop: 50, borderBottom: "4px solid #8d8268", paddingBottom: 26, fontFamily: HAND, fontSize: 80, color: "#27221a", opacity: cl((tt - (0.7 + i * 0.75)) / 0.3) }}>{x}</div>)}
    </div>
    <div style={{ ...abs(1120, 250, 680), ...rise(tt, 3.6) }}><T s={94}>YOUR PHONE WILL DIE.</T></div>
    <div style={{ ...abs(1120, 560, 680), ...rise(tt, 4.8) }}><T s={94} c={AMB}>PAPER WILL NOT.</T></div>
  </>;
}}</Stage>;

// 15:26 · la lista corta
export const HKit: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const all = ["Flashlight for every bed", "Battery CO alarm", "Battery or crank radio", "Charged power bank", "Water for 3 days", "No-cook food", "Manual can opener", "First aid kit", "Your medicines", "Documents, one bag"];
  return <>
    <Center y={46}><div style={rise(tt, 0.05)}><T s={88}>YOUR THREE DAYS</T></div></Center>
    {all.map((x, i) => { const at = 0.6 + i * 0.85; return <div key={x} style={{ ...abs(i < 5 ? 120 : 1000, 200 + (i % 5) * 164, 840), display: "flex", alignItems: "center", gap: 24, ...rise(tt, at, 30) }}><div style={pop(tt, at + 0.15)}><Check s={68} /></div><T s={56} w={800}>{x}</T></div>; })}
  </>;
}}</Stage>;
