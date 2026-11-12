// gary11f · componentes propios (la primera hora de un apagón). Mismo look de la serie: hoja de trabajo crema, tinta carbónica, sello rojo,
// cobre, unifilar azul. Cada mecanismo se usa UNA vez en los 6 videos (registro D:/rtmp/gary11_COMPONENTES.md).
// m = cuadros (relativos al plano) en que se dice cada palabra ancla; dur = cuadros del plano.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONTS } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const io = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const pop = (f: number, a: number) => { const x = Math.max(0, (f - a) / 30) * 9; return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.7); };
const CARBON = "#2a3f8f", BLUEPRINT = "#14305c", LINE = "#cfe0ff", GRN = "#3f9d5a", COP = "#e09a5a", HOT = "#ff7a2f", COLD = "#5fb4ff";
type P = { dur: number; m: number[] };
const M = (m: number[], i: number, d: number) => (m[i] ?? d);
const Bg: React.FC<{ children?: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <AbsoluteFill style={{ background: dark ? "#0f1b30" : "#2b2117" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,230,190,.10), rgba(0,0,0,.5))" }} />{children}</AbsoluteFill>);
const Sheet: React.FC<{ title: string; no?: string; children?: React.ReactNode; tilt?: number }> = ({ title, no = "11F", children, tilt = -1 }) => {
  const f = useCurrentFrame(); const e = k(f, 0, 14);
  return <Bg><div style={{ position: "absolute", left: 130, top: 70, width: 1660, height: 940, transform: `translateY(${(1 - e) * 60}px) rotate(${tilt}deg)`, opacity: e,
    background: `repeating-linear-gradient(0deg, transparent 0 47px, rgba(47,95,168,.16) 47px 49px), ${C.paper}`, boxShadow: "0 40px 90px rgba(0,0,0,.6)", borderRadius: 6 }}>
    <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(198,42,34,.45)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 92, background: C.ink, display: "flex", alignItems: "center", padding: "0 44px", justifyContent: "space-between", borderRadius: "6px 6px 0 0" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: C.paper, letterSpacing: 3 }}>{title}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.gold, letterSpacing: 4 }}>WORK SHEET · No. {no}</div></div>
    <div style={{ position: "absolute", left: 0, top: 92, right: 0, bottom: 0 }}>{children}</div></div></Bg>;
};
const Hand: React.FC<{ text: string; at: number; len?: number; size?: number; col?: string; style?: React.CSSProperties }> = ({ text, at, len = 18, size = 54, col = CARBON, style }) => {
  const f = useCurrentFrame(); const p = cl((f - at) / len); if (p <= 0) return null;
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - p * 100}% -20% 0)`, ...style }}>{text}</div>;
};
const Stamp: React.FC<{ text: string; at: number; x: number; y: number; col?: string; rot?: number; size?: number }> = ({ text, at, x, y, col = C.ver, rot = -8, size = 64 }) => {
  const f = useCurrentFrame(); if (f < at) return null;
  const s = interpolate(f, [at, at + 5, at + 9], [2.2, 0.94, 1], CL), o = interpolate(f, [at, at + 4], [0, 0.92], CL);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, border: `7px solid ${col}`, borderRadius: 10, padding: "6px 26px",
    fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, letterSpacing: 6, whiteSpace: "nowrap", mixBlendMode: "multiply" }}>{text}</div>;
};
const Big: React.FC<{ x: number; y: number; at: number; size?: number; col?: string; children: React.ReactNode; font?: string; anchor?: "l" | "c" }> = ({ x, y, at, size = 70, col = C.paper, children, font = SERIF, anchor = "c" }) => {
  const f = useCurrentFrame(); const e = k(f, at, 10); if (e <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"},-50%) translateY(${(1 - e) * 26}px)`, opacity: e, fontFamily: font, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: col === C.paper ? "0 4px 16px rgba(0,0,0,.6)" : "none", letterSpacing: font === SERIF ? 1 : 0 }}>{children}</div>;
};
const Dots: React.FC<{ d: string; on: number; col: string; speed?: number; w?: number }> = ({ d, on, col, speed = 3, w = 9 }) => {
  const f = useCurrentFrame(); if (on <= 0) return null;
  return <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray="4 24" strokeDashoffset={-f * speed} opacity={on} style={{ filter: `drop-shadow(0 0 6px ${col})` }} />;
};


// ==================== cutaway — LA CASA CORTADA AL MEDIO EN LA OSCURIDAD (vuelve 8 veces, cada vez una acción nueva)
// planta alta (dormitorios), planta baja (cocina con heladera, living con tele y router), sótano (caldera, termotanque, tablero, caños en la pared exterior)
export const HouseSlice: React.FC<P & { act: string }> = ({ act, m, dur }) => {
  const f = useCurrentFrame(); const a = (i: number, d: number) => M(m, i, d);
  const X = 360, Y = 150, W = 1200, FL = 250; // tres niveles
  const lit = act === "wake" ? k(f, a(0, 20), 6) : act === "back" ? 0.6 : act === "day2" ? 0.15 : 0;
  const sky = act === "day2" ? "#3b5272" : "#0b1424";
  const fridgeT = act === "clock" ? 38 + 6 * cl((f - a(0, 10)) / Math.max(60, dur - 30)) : act === "fridge" ? 38 + 2 * cl(f / dur) : 40;
  const hi = (room: string) => (act === "fridge" && room === "kitchen") || (act === "pipes" && room === "pipes") || (act === "warm" && room === "bed2") || (act === "clock" && room === "kitchen");
  const box = (x: number, y: number, w: number, h: number, room: string, label: string) => { const on = hi(room);
    return <g key={room}><rect x={x} y={y} width={w} height={h} fill={on ? "rgba(255,214,120,.16)" : `rgba(255,230,170,${0.04 + 0.4 * lit})`} stroke={on ? C.gold : LINE} strokeWidth={on ? 6 : 3} />
      <text x={x + 18} y={y + 40} fontFamily={SANS} fontWeight={800} fontSize={26} fill={on ? C.gold : LINE} letterSpacing={3}>{label}</text></g>; };
  const order = ["FURNACE", "FRIDGE", "WATER HEATER", "TV", "ROUTER"];
  return <Bg dark>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect width={1920} height={1080} fill={sky} />
      {act === "day2" && <circle cx={1700} cy={140} r={70} fill="#ffd27a" opacity={0.8} />}
      <rect x={0} y={Y + FL * 2} width={1920} height={1080} fill="#2a2016" />
      <path d={`M ${X - 40} ${Y} L ${X + W / 2} ${Y - 120} L ${X + W + 40} ${Y} Z`} fill="#1b2638" stroke={LINE} strokeWidth={4} />
      {box(X, Y, W / 2, FL, "bed1", "BEDROOM")}{box(X + W / 2, Y, W / 2, FL, "bed2", act === "warm" ? "THE WARM ROOM" : "BEDROOM")}
      {box(X, Y + FL, W / 2, FL, "kitchen", "KITCHEN")}{box(X + W / 2, Y + FL, W / 2, FL, "living", "LIVING ROOM")}
      {box(X, Y + FL * 2, W, FL, "base", "BASEMENT")}
      {/* heladera */}
      <rect x={X + 400} y={Y + FL + 60} width={110} height={180} rx={10} fill="#d9dde3" stroke="#222" strokeWidth={3} />
      <text x={X + 455} y={Y + FL + 160} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} fill={fridgeT > 40 ? C.ver : "#1b2638"}>{Math.round(fridgeT)}°</text>
      {/* tele + router */}
      <rect x={X + W / 2 + 120} y={Y + FL + 110} width={200} height={110} rx={6} fill="#111" stroke={LINE} strokeWidth={3} />
      <rect x={X + W / 2 + 380} y={Y + FL + 190} width={90} height={30} rx={6} fill="#333" /><circle cx={X + W / 2 + 400} cy={Y + FL + 205} r={5} fill={lit ? GRN : "#222"} />
      {/* sótano: caldera, termotanque, tablero */}
      <rect x={X + 120} y={Y + FL * 2 + 60} width={140} height={170} rx={8} fill="#56606c" /><text x={X + 190} y={Y + FL * 2 + 160} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={22} fill="#fff">FURNACE</text>
      <rect x={X + 330} y={Y + FL * 2 + 50} width={100} height={180} rx={50} fill="#8a939e" />
      <rect x={X + W - 260} y={Y + FL * 2 + 50} width={130} height={170} rx={6} fill="#6f7884" stroke={LINE} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={X + W - 245 + (i % 2) * 58} y={Y + FL * 2 + 70 + Math.floor(i / 2) * 48} width={42} height={30} fill="#1b2638" />)}
      {/* caños en la pared exterior */}
      <path d={`M ${X + 20} ${Y + 40} L ${X + 20} ${Y + FL * 3 - 20} L ${X + 300} ${Y + FL * 3 - 20}`} fill="none" stroke={act === "pipes" ? COLD : "#b87333"} strokeWidth={act === "pipes" ? 14 : 9} style={{ filter: act === "pipes" ? `drop-shadow(0 0 ${10 + 6 * Math.sin(f / 8)}px ${COLD})` : "none" }} />
      {act === "pipes" && Array.from({ length: 6 }, (_, i) => <text key={i} x={X - 40} y={Y + 120 + i * 110 + ((f * 1.5) % 110)} fontFamily={SANS} fontSize={40} fill={COLD} opacity={0.7}>❄</text>)}
      {/* despertar: cada aparato salta a la vez */}
      {act === "wake" && order.map((t, i) => { const p = [[X + 190, Y + FL * 2 + 60], [X + 455, Y + FL + 60], [X + 380, Y + FL * 2 + 50], [X + W / 2 + 220, Y + FL + 110], [X + W / 2 + 425, Y + FL + 190]][i]; const e = pop(f, a(0, 20) + 2);
        return <g key={t} transform={`translate(${p[0]} ${p[1] - 30}) scale(${e})`}><path d="M -16 -50 L 6 -50 L -4 -20 L 16 -20 L -14 30 L -4 -6 L -20 -6 Z" fill="#ffe066" stroke="#000" strokeWidth={2} /></g>; })}
      {act === "back" && order.map((t, i) => { const at = 20 + i * Math.max(18, (dur - 60) / 5); const e = k(f, at, 8);
        return <g key={t} opacity={e}><rect x={1580} y={260 + i * 90} width={300} height={70} rx={10} fill={C.paper} /><text x={1600} y={308 + i * 90} fontFamily={SANS} fontWeight={900} fontSize={32} fill={C.ink}>{i + 1}. {t}</text></g>; })}
      {act === "warm" && <g opacity={k(f, a(0, 20), 12)}><rect x={X + W / 2 + 20} y={Y + 20} width={W / 2 - 40} height={FL - 40} fill="none" stroke={HOT} strokeWidth={8} strokeDasharray="20 12" strokeDashoffset={-f} />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={X + W / 2 + 150 + i * 90} cy={Y + 170} r={26} fill={HOT} opacity={0.7} />)}</g>}
      {act === "clock" && <g><circle cx={X + 455} cy={Y + FL - 70} r={60} fill={C.paper} stroke={C.ink} strokeWidth={5} />
        <line x1={X + 455} y1={Y + FL - 70} x2={X + 455 + 45 * Math.sin(f / 10)} y2={Y + FL - 70 - 45 * Math.cos(f / 10)} stroke={C.ver} strokeWidth={6} /></g>}
    </svg>
    {act === "dark" && <Big x={960} y={1010} at={a(0, 20)} size={54} col={LINE}>your house · cut in half · dark</Big>}
    {act === "day2" && <Big x={960} y={1010} at={10} size={60} col={C.gold}>DAY TWO · a different job</Big>}
    {act === "clock" && fridgeT > 40 && <Stamp text="ABOVE 40°" at={a(1, dur * 0.7)} x={1520} y={420} />}
    {act === "wake" && <Big x={960} y={1010} at={a(0, 20) + 10} size={62} col={HOT}>all at the same instant</Big>}
    {act === "back" && <Big x={960} y={1010} at={10} size={56} col={GRN}>one at a time · in order</Big>}
  </Bg>;
};

// ==================== series — LA FICHA DE LAS DIEZ COSAS (index card que se escribe renglón por renglón; el número en curso se marca con resaltador)
const TEN = ["the jug lantern", "is it just my house?", "report it once", "the fridge note", "unplug the sensitive things", "the labeled panel", "battery CO alarms", "the right cord", "water and pipes", "the one warm room"];
export const TenCard: React.FC<P & { n: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const half = n <= 5 ? 0 : 5;
  return <Bg><div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 820, background: C.white, borderRadius: 8, boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `rotate(${n % 2 ? -1.5 : 1.2}deg)`,
    backgroundImage: "repeating-linear-gradient(0deg, transparent 0 118px, rgba(47,95,168,.35) 118px 121px)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, borderBottom: `5px solid ${C.ver}`, display: "flex", alignItems: "center", padding: "0 50px", fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: C.ink }}>{half ? "THE SETUP · 6–10" : "THE FIRST HOUR · 1–5"}</div>
    {TEN.slice(half, half + 5).map((t, j) => { const i = half + j; const cur = i === n - 1, done = i < n - 1;
      return <div key={i} style={{ position: "absolute", left: 50, top: 150 + j * 121, height: 100, display: "flex", alignItems: "center", gap: 30, opacity: done || cur ? 1 : 0.18 }}>
        {cur && <div style={{ position: "absolute", left: 90, top: 22, height: 60, width: 900 * k(f, 18, 20), background: "rgba(255,220,60,.55)" }} />}
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: cur ? C.ver : C.ink, width: 80 }}>{i + 1}</div>
        {cur ? <Hand text={t} at={10} len={26} size={64} /> : <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CARBON }}>{t}</div>}
        {done && <div style={{ fontFamily: SANS, fontSize: 60, color: GRN }}>✓</div>}</div>; })}
  </div><Big x={960} y={1030} at={6} size={44} col={C.gold}>THING {n} OF 10</Big></Bg>;
};

// ==================== series — EL PEGBOARD DEL SÁBADO (ocho ganchos; el paso en curso cuelga su etiqueta y se balancea)
const SET8 = ["blackout box", "label the panel", "main & furnace switch", "CO alarms up", "the right cord", "fill the freezer", "the warm box", "a test night"];
export const SetupBoard: React.FC<P & { n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#c79a62", backgroundImage: "radial-gradient(circle, #6b4a2a 6px, transparent 7px)", backgroundSize: "60px 60px" }}>
    <div style={{ position: "absolute", left: 80, top: 50, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.ink, background: C.paper, padding: "10px 30px", borderRadius: 6 }}>ONE SATURDAY · STEP {n}</div>
    {SET8.map((t, i) => { const x = 180 + (i % 4) * 420, y = 260 + Math.floor(i / 4) * 380; const cur = i === n - 1, done = i < n - 1; const sw = cur ? 8 * Math.exp(-f / 30) * Math.sin(f / 4) : 0; const drop = cur ? ou(f / 14) : 1;
      return <div key={i} style={{ position: "absolute", left: x, top: y }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: "#333", marginLeft: 125 }} />
        {(done || cur) && <div style={{ transformOrigin: "140px -10px", transform: `rotate(${sw}deg) translateY(${(1 - drop) * -200}px)`, opacity: drop, width: 280, height: 200, marginTop: 10, background: cur ? C.white : C.paper2, border: `5px solid ${cur ? C.ver : C.ink}`, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: cur ? C.ver : C.ink }}>{i + 1}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: CARBON, textAlign: "center" }}>{t}</div></div>}</div>; })}
  </AbsoluteFill>;
};

// ==================== series — LAS CINCO SEÑALES DE PELIGRO (carteles de ruta en fila; el error en curso se da vuelta y aparece su dibujo)
const OOPS = ["CANDLES", "GRILL INDOORS", "GENERATOR IN GARAGE", "SUICIDE CORD", "THE WRONG FOOD CALL"];
export const OopsSign: React.FC<P & { n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <Bg dark>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 20, background: "#555" }} />
    {OOPS.map((t, i) => { const cur = i === n - 1, done = i < n - 1; const flip = cur ? io(f / 18) : done ? 1 : 0; const x = 120 + i * 350;
      return <div key={i} style={{ position: "absolute", left: x, top: cur ? 220 : 300, width: 280, transform: `scale(${cur ? 1.25 : 0.9})`, transformOrigin: "50% 100%" }}>
        <div style={{ width: 280, height: 280, transform: `rotateY(${180 - 180 * flip}deg) rotate(45deg)`, background: flip > 0.5 ? "#ffcc00" : "#556070", border: `10px solid ${C.ink}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {flip > 0.5 && <div style={{ transform: "rotate(-45deg)", fontFamily: SANS, fontWeight: 900, fontSize: 30, color: C.ink, textAlign: "center", width: 220 }}>{t}</div>}</div>
        <div style={{ width: 16, height: 300, background: "#999", marginLeft: 132 }} />
        {done && <div style={{ position: "absolute", left: 60, top: 60, fontFamily: SANS, fontWeight: 900, fontSize: 180, color: C.ver, opacity: 0.85 }}>✕</div>}</div>; })}
    <Big x={960} y={110} at={4} size={70} col="#ffcc00">MISTAKE {n} OF 5</Big>
  </Bg>;
};

// ==================== jugbeam — LA JARRA QUE DESPARRAMA LA LUZ: el haz angosto de la linterna entra a la jarra y sale en 360° hasta llenar la cocina
export const JugBeam: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15); const p = io((f - a) / 40);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect width={1920} height={1080} fill={`rgba(255,236,190,${0.25 * p})`} />
    <path d="M 760 620 Q 760 420 860 380 L 860 330 L 1060 330 L 1060 380 Q 1160 420 1160 620 L 1160 860 Q 1160 900 1120 900 L 800 900 Q 760 900 760 860 Z" fill={`rgba(220,240,255,${0.25 + 0.6 * p})`} stroke={LINE} strokeWidth={5} style={{ filter: `drop-shadow(0 0 ${60 * p}px #fff6d0)` }} />
    <rect x={740} y={560} width={440} height={40} rx={20} fill="#222" /><rect x={930} y={548} width={70} height={64} rx={10} fill="#444" /><circle cx={965} cy={580} r={20} fill="#fffbe6" />
    {Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * Math.PI * 2; const r = 200 + 700 * p; return <line key={i} x1={960 + 210 * Math.cos(t)} y1={640 + 210 * Math.sin(t)} x2={960 + r * Math.cos(t)} y2={640 + r * Math.sin(t)} stroke="#fff3c4" strokeWidth={6} opacity={0.35 * p} />; })}
    <path d={`M 965 580 L 965 ${580 + 260 * cl((f - 4) / 10)}`} stroke="#fffbe6" strokeWidth={22} opacity={1 - p} />
  </svg>
    <Big x={420} y={180} at={a + 30} size={60} col={C.gold}>no flame</Big><Big x={1500} y={180} at={a + 45} size={60} col={C.gold}>no fumes</Big>
    <Big x={960} y={1000} at={M(m, 1, dur * 0.7)} size={58} col={C.paper}>about $1 of batteries a night</Big></Bg>;
};

// ==================== porchrow — LA CUADRA DESDE TU VENTANA: las casas vecinas y los faroles se prenden o se apagan; la tuya queda a oscuras
export const PorchRow: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 20), b = M(m, 1, dur * 0.55); const nOn = f < b;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect width={1920} height={1080} fill="#081020" /><rect x={0} y={780} width={1920} height={300} fill="#dfe6ef" />
    {Array.from({ length: 5 }, (_, i) => { const x = 120 + i * 360, mine = i === 2; const on = !mine && (nOn ? k(f, a + i * 5, 6) : 0);
      return <g key={i}><path d={`M ${x} 520 L ${x + 130} 400 L ${x + 260} 520 Z`} fill="#26324a" /><rect x={x + 10} y={520} width={240} height={260} fill="#1b2638" />
        {[0, 1].map((j) => <rect key={j} x={x + 40 + j * 110} y={570} width={70} height={80} fill={on ? `rgba(255,214,120,${on})` : "#0d1626"} />)}
        {mine && <text x={x + 130} y={850} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} fill={C.ver}>YOU</text>}
        <rect x={x + 290} y={480} width={8} height={300} fill="#555" /><circle cx={x + 294} cy={478} r={18} fill={nOn && on ? "#ffe9a8" : "#333"} style={{ filter: nOn && on ? "drop-shadow(0 0 20px #ffe9a8)" : "none" }} /></g>; })}
  </svg>
    <Big x={960} y={150} at={a} size={56} col={C.paper}>{nOn ? "they're on · you're off → check your panel" : "they're dark too → it's the grid"}</Big></Bg>;
};

// ==================== halfmain — EL MAIN A MEDIO CAMINO: la palanca grande está en el medio; el dedo la empuja a OFF y después a ON
export const HalfMain: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.4), b = a + 30;
  const pos = f < a ? 0 : f < b ? -io((f - a) / 12) : -1 + 2 * io((f - b) / 12);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={660} y={140} width={600} height={800} rx={20} fill="#6f7884" stroke={LINE} strokeWidth={5} />
    <rect x={810} y={300} width={300} height={440} rx={14} fill="#1b2638" />
    <text x={960} y={280} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={36} fill={C.ink}>MAIN</text>
    <text x={1140} y={340} fontFamily={SANS} fontWeight={800} fontSize={36} fill={GRN}>ON</text><text x={1140} y={720} fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.ver}>OFF</text>
    <rect x={880} y={480 - pos * 150} width={160} height={80} rx={14} fill={pos === 0 ? C.gold : "#d9dde3"} stroke="#000" strokeWidth={4} />
  </svg>
    <Big x={420} y={500} at={10} size={56} col={C.gold}>tripped = halfway</Big>
    {f >= a && <Big x={1560} y={460} at={a} size={56} col={C.ver}>all the way OFF</Big>}
    {f >= b && <Big x={1560} y={560} at={b} size={56} col={GRN}>then ON</Big>}</Bg>;
};

// ==================== hotline — EL TECLADO DEL TELÉFONO: 9-1-1 se tacha y se marca el número de cortes; una sola llamada
export const Hotline: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15), b = M(m, 1, dur * 0.5);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  return <Bg dark>
    <div style={{ position: "absolute", left: 660, top: 90, width: 600, height: 900, background: "#111", borderRadius: 60, border: "6px solid #444" }}>
      <div style={{ margin: "60px 40px 30px", height: 120, background: "#1f2b40", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 64, color: f < b ? C.ver : GRN, textDecoration: f < b && f > a + 20 ? "line-through" : "none" }}>{f < b ? "9 1 1" : "OUTAGE LINE"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, padding: "0 60px" }}>{keys.map((t) => { const press = (f < b && ["9", "1"].includes(t) && f % 20 < 8 && f > a) || (f > b && f % 14 < 5);
        return <div key={t} style={{ height: 120, borderRadius: 60, background: press ? C.gold : "#2b2b2b", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 54, color: "#fff" }}>{t}</div>; })}</div></div>
    {f > b && <Stamp text="ONCE" at={b + 10} x={1560} y={540} col={GRN} />}</Bg>;
};

// ==================== funnel — EL EMBUDO DE LLAMADAS: la primera pasa; las siguientes se amontonan y tapan el cuello
export const Funnel: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame();
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 560 200 L 1360 200 L 1010 640 L 1010 900 L 910 900 L 910 640 Z" fill="none" stroke={LINE} strokeWidth={8} />
    {Array.from({ length: 22 }, (_, i) => { const t = (f - i * 6) / 30; if (t < 0) return null; const first = i === 0; const y = first ? 220 + 800 * cl(t) : Math.min(220 + 400 * t, 620 - Math.floor((i - 1) / 5) * 70); const x = first ? 960 : 700 + ((i * 97) % 520);
      const xx = first ? x : 960 + (x - 960) * (1 - cl((y - 220) / 500)) * 0.9;
      return <g key={i}><circle cx={xx} cy={y} r={30} fill={first ? GRN : C.ver} /><text x={xx} y={y + 12} textAnchor="middle" fontSize={32}>☎</text></g>; })}
  </svg><Big x={960} y={110} at={M(m, 0, 30)} size={56} col={C.paper}>every call after the first ties up the line</Big></Bg>;
};

// ==================== doorjump — EL TERMÓMETRO DE LA HELADERA QUE SALTA: la línea sube lenta y cada apertura de puerta le pega un escalón
export const DoorJump: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const opens = [0.25, 0.45, 0.65].map((x) => x * dur);
  const val = (t: number) => 36 + 3 * (t / dur) + opens.filter((o) => t > o).length * 1.8;
  const pts = Array.from({ length: 60 }, (_, i) => { const t = (i / 59) * Math.min(f, dur); return `${i ? "L" : "M"} ${300 + (i / 59) * 1320 * Math.min(1, f / dur)} ${860 - (val(t) - 34) * 60}`; }).join(" ");
  return <Sheet title="THE FRIDGE, EVERY TIME THE DOOR OPENS"><svg width={1660} height={850} style={{ position: "absolute" }}>
    <line x1={250} y1={860 - 6 * 60 - 92} x2={1600} y2={860 - 6 * 60 - 92} stroke={C.ver} strokeWidth={4} strokeDasharray="16 10" />
    <text x={1610} y={860 - 6 * 60 - 80} fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.ver}>40°</text>
    <path d={pts} transform="translate(0 -92)" fill="none" stroke={CARBON} strokeWidth={8} />
    {opens.map((o, i) => f > o && <text key={i} x={300 + (o / dur) * 1320} y={200} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill={C.ver}>door!</text>)}
  </svg></Sheet>;
};

// ==================== surgewave — LA OLA DE LA VUELTA: la luz vuelve como una ola por el cable y revienta contra lo que quedó enchufado
export const SurgeWave: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15); const x = -200 + 2300 * cl((f - a) / 50);
  const dev = [["TV", 700], ["COMPUTER", 1100], ["MICROWAVE", 1500]] as const;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 0 700 L 1920 700" stroke="#444" strokeWidth={14} />
    <path d={Array.from({ length: 40 }, (_, i) => { const xx = x - 400 + i * 10; const amp = 160 * Math.exp(-Math.pow((xx - x) / 140, 2)); return `${i ? "L" : "M"} ${xx} ${700 - amp * Math.abs(Math.sin(i / 2 + f / 3))}`; }).join(" ")} fill="none" stroke="#ffe066" strokeWidth={10} style={{ filter: "drop-shadow(0 0 16px #ffe066)" }} />
    {dev.map(([t, dx]) => { const hit = x > dx; const unplug = f > M(m, 1, dur) ; return <g key={t}><rect x={dx - 110} y={420} width={220} height={150} rx={12} fill={hit && !unplug ? C.ver : "#2c3a52"} stroke={LINE} strokeWidth={3} />
      <line x1={dx} y1={570} x2={dx} y2={700} stroke="#888" strokeWidth={6} /><text x={dx} y={510} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill="#fff">{t}</text>
      {hit && <path transform={`translate(${dx} 380)`} d="M0 -50 L14 -14 L50 -20 L22 6 L40 44 L0 22 L-40 44 L-22 6 L-50 -20 L-14 -14 Z" fill="#ffe066" stroke={C.ver} strokeWidth={4} />}</g>; })}
  </svg><Big x={960} y={150} at={a + 30} size={58} col={HOT}>the comeback is harder than the outage</Big></Bg>;
};

// ==================== leakbucket — EL BALDE AGUJEREADO: de los tres agujeros (comida, electrónica, llamada) se escapan billetes; el contador sube a $500
export const LeakBucket: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const v = Math.round(200 + 300 * cl(f / Math.max(60, dur - 20)));
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 700 260 L 1220 260 L 1150 820 L 770 820 Z" fill="#7d8792" stroke={C.ink} strokeWidth={6} />
    {["FOOD", "ELECTRONICS", "STORM CALL"].map((t, i) => { const y = 400 + i * 140; return <g key={t}><circle cx={1180 - i * 18} cy={y} r={16} fill="#111" />
      {Array.from({ length: 4 }, (_, j) => { const p = ((f + j * 15 + i * 7) % 60) / 60; return <rect key={j} x={1200 + p * 300} y={y + p * p * 200} width={70} height={36} rx={4} fill="#5c8a4a" transform={`rotate(${p * 60} ${1235 + p * 300} ${y + 18 + p * p * 200})`} />; })}
      <text x={600} y={y + 12} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.paper}>{t}</text></g>; })}
  </svg><Big x={960} y={940} at={10} size={110} col={C.ver}>${v}</Big><Big x={960} y={150} at={4} size={52} col={C.paper}>lost in the first hour</Big></Bg>;
};

// ==================== twojobs — LA BALANZA DE DOS PLATOS: en uno "keep the cold in", en el otro "get the sensitive things out"; el resto vuela como pluma
export const TwoJobs: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15), b = M(m, 1, dur * 0.45), c = M(m, 2, dur * 0.8);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={950} y={300} width={20} height={560} fill={LINE} /><rect x={760} y={860} width={400} height={30} rx={10} fill={LINE} />
    <line x1={460} y1={300} x2={1460} y2={300} stroke={LINE} strokeWidth={14} />
    {[[460, "KEEP THE COLD IN", a, COLD], [1460, "SENSITIVE THINGS OUT", b, HOT]].map(([x, t, at, col]) => <g key={t as string} opacity={k(f, at as number, 10)}>
      <line x1={x as number} y1={300} x2={(x as number) - 120} y2={520} stroke={LINE} strokeWidth={4} /><line x1={x as number} y1={300} x2={(x as number) + 120} y2={520} stroke={LINE} strokeWidth={4} />
      <rect x={(x as number) - 190} y={520} width={380} height={130} rx={14} fill={col as string} /><text x={x as number} y={600} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} fill="#111">{t as string}</text></g>)}
    {f > c && <text x={960 + 300 * Math.sin(f / 15)} y={260 - (f - c) * 3} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill={C.paper} opacity={0.8}>everything else is comfort</text>}
  </svg><Big x={960} y={120} at={a - 10} size={60} col={C.gold}>the first hour = two jobs</Big></Bg>;
};

// ==================== misclabel — LAS ETIQUETAS QUE MIENTEN: en la tapa del tablero "misc", "bedroom", "?" se despegan y en su lugar se escribe lo que alimenta de verdad
export const MiscLabel: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.4);
  const OLD = ["misc", "bedroom", "?", "", "misc", "lights"], NEW = ["KITCHEN COUNTER L", "FURNACE", "FRIDGE", "WELL PUMP", "WATER HEATER", "BATH GFCI"];
  return <Sheet title="THE PANEL DIRECTORY">{OLD.map((t, i) => { const peel = k(f, a + i * 10, 10); const x = 120 + (i % 2) * 740, y = 70 + Math.floor(i / 2) * 230;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 640, height: 170, background: "#f6f6f2", border: `4px solid ${C.ink}`, borderRadius: 8 }}>
      <div style={{ position: "absolute", left: 20, top: 20, fontFamily: HAND, fontSize: 60, color: "#999", transformOrigin: "0 0", transform: `rotate(${-40 * peel}deg) translateY(${-200 * peel}px)`, opacity: 1 - peel }}>{t || "—"}</div>
      <Hand text={NEW[i]} at={a + i * 10 + 10} len={14} size={52} style={{ position: "absolute", left: 20, top: 50 }} /></div>; })}</Sheet>;
};

// ==================== laminator — LA PLASTIFICADORA: la hoja escrita entra por los rodillos y sale brillante con un borde transparente
export const Laminator: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = cl((f - 15) / Math.max(40, dur * 0.6));
  return <Bg><div style={{ position: "absolute", left: 360, top: 470, width: 1200, height: 150, background: "#2b3547", borderRadius: 30, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#9aa3ad", letterSpacing: 6 }}>LAMINATOR · {p < 1 ? "HOT" : "DONE"}</div>
    <div style={{ position: "absolute", left: 610, top: -160 + p * 1000, width: 700, height: 600, background: C.white, borderRadius: 10, boxShadow: p > 0.5 ? "0 0 0 18px rgba(220,240,255,.55), 0 30px 60px rgba(0,0,0,.5)" : "0 30px 60px rgba(0,0,0,.5)", padding: 40, zIndex: 1 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: C.ink }}>POWER OUT</div>
      {["1 · main = top", "2 · furnace = #14", "3 · fridge = #7", "4 · report once"].map((t) => <div key={t} style={{ fontFamily: HAND, fontSize: 46, color: CARBON, marginTop: 20 }}>{t}</div>)}
      {p > 0.5 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${110 + f}deg, transparent 40%, rgba(255,255,255,.6) 50%, transparent 60%)` }} />}</div></Bg>;
};

// ==================== plugalarm — LAS DOS ALARMAS: la enchufada se apaga con la luz; la de pilas sigue titilando verde
export const PlugAlarm: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const out = M(m, 1, dur * 0.4); const dark = f > out; const blink = f % 30 < 12;
  return <AbsoluteFill style={{ background: dark ? "#0b1220" : "#e8e2d4" }}>
    {[["PLUG-IN", 560, false], ["BATTERY", 1360, true]].map(([t, x, bat]) => { const alive = bat || !dark;
      return <div key={t as string} style={{ position: "absolute", left: (x as number) - 200, top: 300, width: 400, height: 400, borderRadius: 200, background: "#f4f4f0", boxShadow: "0 30px 60px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: alive && blink ? GRN : "#333", boxShadow: alive && blink ? `0 0 30px ${GRN}` : "none" }} />
        <div style={{ marginTop: 30, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.ink }}>CO</div>
        <div style={{ position: "absolute", bottom: -110, fontFamily: SANS, fontWeight: 900, fontSize: 48, color: dark ? C.paper : C.ink }}>{t as string}</div>
        {!alive && <div style={{ position: "absolute", fontFamily: SANS, fontWeight: 900, fontSize: 300, color: C.ver, opacity: 0.8 }}>✕</div>}</div>; })}
    <Big x={960} y={140} at={out} size={58} col={dark ? C.gold : C.ink}>no power · no alarm</Big></AbsoluteFill>;
};

// ==================== gaugeruler — EL CALIBRE DE CABLE: tres cables cortados de frente, el 12, el 14 y el cordón de lámpara; la regla mide el cobre
export const GaugeRuler: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const W = [["12 GA", 120, GRN], ["14 GA", 96, GRN], ["LAMP CORD", 46, C.ver]] as const;
  return <Sheet title="HOW MUCH COPPER IS IN THE CORD">{W.map(([t, d, col], i) => { const e = k(f, 10 + i * 20, 12); const x = 260 + i * 520;
    return <div key={t} style={{ position: "absolute", left: x, top: 150, opacity: e, textAlign: "center", width: 300 }}>
      <svg width={300} height={300}><circle cx={150} cy={150} r={d + 40} fill="#222" /><circle cx={150} cy={150} r={d} fill={COP} /></svg>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: col }}>{t}</div>
      <div style={{ fontFamily: HAND, fontSize: 44, color: CARBON }}>{i < 2 ? "fridge OK" : "never for a fridge"}</div></div>; })}
    <div style={{ position: "absolute", left: 160, right: 160, top: 640, height: 70, background: "#e9d36a", backgroundImage: "repeating-linear-gradient(90deg, #222 0 3px, transparent 3px 40px)", border: "3px solid #222" }} /></Sheet>;
};

// ==================== malemale — EL CABLE DE DOS MACHOS: los dos enchufes se miran, una chispa salta entre las patas peladas y cae la cruz roja
export const MaleMale: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.5);
  const plug = (x: number, flip: number) => <g transform={`translate(${x} 540) scale(${flip} 1)`}><rect x={-120} y={-70} width={160} height={140} rx={20} fill="#222" /><rect x={40} y={-45} width={90} height={18} fill="#d8d8d8" /><rect x={40} y={27} width={90} height={18} fill="#d8d8d8" /><path d="M -120 0 L -500 0" stroke="#222" strokeWidth={34} /></g>;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>{plug(760, 1)}{plug(1160, -1)}
    {f % 14 < 7 && <path d="M 890 540 L 930 500 L 960 560 L 1000 510 L 1030 540" stroke="#ffe066" strokeWidth={8} fill="none" style={{ filter: "drop-shadow(0 0 16px #ffe066)" }} />}
    {f > a && <g opacity={k(f, a, 8)}><line x1={560} y1={240} x2={1360} y2={840} stroke={C.ver} strokeWidth={40} /><line x1={1360} y1={240} x2={560} y2={840} stroke={C.ver} strokeWidth={40} /></g>}
  </svg><Big x={960} y={140} at={10} size={62} col={C.gold}>two male ends</Big><Big x={960} y={960} at={a + 10} size={56} col={C.paper}>it can kill you · or a lineman</Big></Bg>;
};

// ==================== dripdrop — LA REGLA DE UNA HORA: el reloj de la cocina completa una vuelta, el termómetro de afuera baja a 20 °F y la canilla empieza a gotear
export const DripDrop: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const h = cl(f / (dur * 0.45)), t = cl((f - dur * 0.2) / (dur * 0.3)); const go = h >= 1 && t >= 1;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <circle cx={460} cy={480} r={220} fill={C.paper} stroke={C.ink} strokeWidth={10} /><path d={`M 460 480 L 460 260 A 220 220 0 ${h > 0.5 ? 1 : 0} 1 ${460 + 220 * Math.sin(h * 6.283)} ${480 - 220 * Math.cos(h * 6.283)} Z`} fill="rgba(198,42,34,.35)" />
    <text x={460} y={790} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={48} fill={C.paper}>1 HOUR OUT</text>
    <rect x={920} y={200} width={60} height={520} rx={30} fill="#eee" /><rect x={930} y={210 + 500 * (0.3 + 0.5 * t)} width={40} height={500 - 500 * (0.3 + 0.5 * t)} fill={COLD} /><circle cx={950} cy={740} r={60} fill={COLD} />
    <text x={950} y={860} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={48} fill={COLD}>{Math.round(40 - 20 * t)}°F</text>
    <path d="M 1300 300 L 1540 300 L 1540 380 L 1600 380 L 1600 440" fill="none" stroke="#c0c6cc" strokeWidth={40} strokeLinejoin="round" />
    {go && Array.from({ length: 3 }, (_, i) => { const p = ((f + i * 12) % 36) / 36; return <ellipse key={i} cx={1600} cy={480 + p * 380} rx={12} ry={18} fill={COLD} opacity={1 - p * 0.6} />; })}
  </svg>{go && <Big x={1560} y={940} at={Math.ceil(dur * 0.5)} size={60} col={GRN}>start the drip</Big>}</Bg>;
};

// ==================== teeter — EL SUBIBAJA DE LA PLATA: de un lado se apilan $15, $60, $25; del otro cae el bloque de $300-$700 y el lado barato sale disparado para arriba
export const Teeter: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 0, dur * 0.4); const tilt = -10 + 24 * io((f - b) / 20);
  const cheap = ["$15", "$60", "$25"];
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 960 760 L 900 900 L 1020 900 Z" fill={C.ink} />
    <g transform={`rotate(${tilt} 960 760)`}><rect x={360} y={740} width={1200} height={30} rx={10} fill="#8a5a32" />
      {cheap.map((t, i) => <g key={t} opacity={k(f, 8 + i * 10, 8)}><rect x={420 + i * 130} y={620 - 0} width={120} height={120} rx={10} fill={GRN} /><text x={480 + i * 130} y={695} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={40} fill="#fff">{t}</text></g>)}
      <g opacity={k(f, b - 10, 8)} transform={`translate(0 ${-300 * (1 - io((f - b + 10) / 12))})`}><rect x={1160} y={500} width={360} height={240} rx={14} fill={C.ver} /><text x={1340} y={640} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill="#fff">$300–700</text></g>
    </g></svg><Big x={960} y={140} at={10} size={56} col={C.paper}>the honest money</Big></Bg>;
};

// ==================== shuffle — LAS ETIQUETAS DE HACE VEINTE AÑOS: las fichas del tablero se mezclan como cartas y quedan cada una en un lugar equivocado
export const Shuffle: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const L = ["FURNACE", "FRIDGE", "DRYER", "WELL", "BATH", "KITCHEN"]; const perm = [3, 5, 0, 4, 1, 2]; const p = io((f - 20) / 40);
  return <Sheet title="TWENTY YEARS AGO, SOMEBODY MOVED THINGS">{L.map((t, i) => { const j = perm[i]; const y0 = 60 + i * 120, y1 = 60 + j * 120; const y = y0 + (y1 - y0) * p; const x = 400 + 200 * Math.sin(p * Math.PI) * (i % 2 ? 1 : -1);
    return <div key={t} style={{ position: "absolute", left: x, top: y, width: 520, height: 96, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 8, display: "flex", alignItems: "center", paddingLeft: 30, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: p > 0.9 ? C.ver : C.ink }}>#{i + 1} {t}</div>; })}
    {p > 0.95 && <Stamp text="HALF ARE WRONG" at={70} x={1300} y={420} />}</Sheet>;
};

// ==================== redtape — LA CINTA ROJA: dos tiras de cinta se estiran y se pegan sobre el main y sobre el interruptor de la caldera; aparecen los nombres de la familia
export const RedTape: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 0, 15);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={300} y={200} width={460} height={680} rx={16} fill="#6f7884" /><rect x={420} y={260} width={220} height={110} rx={10} fill="#d9dde3" />
    <rect x={1200} y={380} width={300} height={300} rx={14} fill="#e8e2d4" /><rect x={1310} y={440} width={80} height={140} rx={10} fill={C.ver} />
    <rect x={400} y={300} width={260 * k(f, a, 12)} height={44} fill="#e0312a" transform="rotate(-6 400 300)" />
    <rect x={1180} y={500} width={340 * k(f, a + 20, 12)} height={44} fill="#e0312a" transform="rotate(5 1180 500)" />
  </svg><Big x={530} y={950} at={a + 10} size={50} col={C.paper}>MAIN</Big><Big x={1350} y={760} at={a + 30} size={50} col={C.paper}>FURNACE SWITCH</Big>
    <Big x={960} y={120} at={a + 50} size={52} col={C.gold}>everybody in the house knows</Big></Bg>;
};

// ==================== coilheat — EL ROLLO QUE SE CALIENTA: el cable enrollado bajo carga se pone rojo de adentro hacia afuera; desenrollado queda frío
export const CoilHeat: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const a = M(m, 1, dur * 0.55); const heat = cl(f / (dur * 0.5)); const un = io((f - a) / 30);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    {Array.from({ length: 7 }, (_, i) => { const r = 60 + i * 34; const hot = heat * (1 - i / 9) * (1 - un);
      return <circle key={i} cx={960 - un * 400} cy={540} r={r * (1 - un) + 1} fill="none" stroke={`rgb(${Math.round(70 + 185 * hot)},${Math.round(70 + 20 * (1 - hot))},40)`} strokeWidth={22} opacity={1 - un} style={{ filter: hot > 0.5 ? `drop-shadow(0 0 ${20 * hot}px ${HOT})` : "none" }} />; })}
    {un > 0 && <path d={`M 160 540 Q 560 ${540 - 80 * Math.sin(f / 20)} 960 540 T ${160 + 1600 * un} 540`} fill="none" stroke="#e86a1a" strokeWidth={22} opacity={un} />}
  </svg><Big x={960} y={140} at={10} size={56} col={HOT}>coiled under load → heats up</Big>{un > 0.5 && <Big x={960} y={940} at={a + 15} size={60} col={GRN}>unroll it</Big>}</Bg>;
};

// ==================== freezertetris — EL FREEZER QUE SE LLENA: el aire tibio ocupa el hueco; los bidones de agua congelada caen como fichas y lo desplazan
export const FreezerTetris: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const n = Math.min(10, Math.floor(f / Math.max(8, (dur - 30) / 10)));
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={560} y={240} width={800} height={660} rx={20} fill="#dfe6ef" stroke={LINE} strokeWidth={6} /><rect x={590} y={270} width={740} height={600} fill="#9fb8d6" />
    <rect x={590} y={570} width={740} height={300} fill="#c8a37a" />
    <rect x={590} y={270} width={740} height={Math.max(0, 300 - n * 30)} fill="rgba(255,140,60,.35)" />
    {Array.from({ length: n }, (_, i) => <g key={i}><rect x={600 + (i % 5) * 146} y={420 - Math.floor(i / 5) * 150} width={130} height={140} rx={16} fill="#e9f4ff" stroke="#7aa6d6" strokeWidth={4} /><text x={665 + (i % 5) * 146} y={505 - Math.floor(i / 5) * 150} textAnchor="middle" fontSize={50}>❄</text></g>)}
  </svg><Big x={960} y={140} at={6} size={56} col={C.paper}>empty space = warm air</Big><Big x={960} y={980} at={Math.round(dur * 0.6)} size={52} col={GRN}>frozen jugs · and drinking water later</Big></Bg>;
};

// ==================== heatloss — DOS CUARTOS Y SUS FLECHAS: el living con ventanales pierde calor por todos lados; el cuarto chico interior apenas
export const HeatLoss: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const arrows = (x: number, y: number, w: number, h: number, n: number, at: number) => Array.from({ length: n }, (_, i) => { const p = ((f - at + i * 9) % 45) / 45; const side = i % 4; const ox = side === 0 ? x - p * 120 : side === 1 ? x + w + p * 120 : x + ((i * 53) % w); const oy = side < 2 ? y + ((i * 71) % h) : side === 2 ? y - p * 120 : y + h + p * 120;
    return f > at && <circle key={i} cx={ox} cy={oy} r={14} fill={HOT} opacity={1 - p} />; });
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={180} y={300} width={760} height={480} fill="#1b2638" stroke={LINE} strokeWidth={4} />{[0, 1, 2].map((i) => <rect key={i} x={230 + i * 240} y={300} width={180} height={20} fill={COLD} />)}
    <rect x={1240} y={400} width={420} height={300} fill="#1b2638" stroke={LINE} strokeWidth={4} /><rect x={1400} y={400} width={90} height={14} fill={COLD} />
    {arrows(180, 300, 760, 480, 26, 6)}{arrows(1240, 400, 420, 300, 5, 30)}
  </svg><Big x={560} y={860} at={10} size={46} col={C.ver}>big living room · big windows</Big><Big x={1450} y={790} at={30} size={46} col={GRN}>small inside room</Big></Bg>;
};

// ==================== candlecat — LA CADENA DE LA VELA: vela → cortina → gato; cada eslabón se enciende y la línea termina en la casa en llamas
export const CandleCat: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const L = ["a candle on a counter", "a curtain", "a cat", "a house fire"];
  const fl = (x: number, y: number, s: number) => <path transform={`translate(${x} ${y}) scale(${s * (1 + 0.08 * Math.sin(f / 3))})`} d="M 0 -60 C 30 -20 30 10 0 20 C -30 10 -30 -20 0 -60 Z" fill={HOT} style={{ filter: `drop-shadow(0 0 14px ${HOT})` }} />;
  const ico = [<g key="c"><rect x={130} y={110} width={40} height={110} fill="#f4ecd8" />{fl(150, 100, 0.6)}</g>,
    <g key="w"><rect x={60} y={40} width={180} height={180} fill="#26324a" stroke={LINE} strokeWidth={4} /><path d={`M 60 40 Q 100 ${130 + 10 * Math.sin(f / 10)} 80 220 L 60 220 Z`} fill="#b04848" /><path d="M 240 40 Q 200 130 220 220 L 240 220 Z" fill="#b04848" /></g>,
    <g key="k"><ellipse cx={150} cy={170} rx={70} ry={45} fill="#c88a3a" /><circle cx={200} cy={120} r={34} fill="#c88a3a" /><path d="M 178 96 L 186 66 L 200 92 M 206 92 L 222 66 L 226 100" fill="#c88a3a" stroke="#c88a3a" strokeWidth={6} /><path d={`M 80 170 Q 40 ${120 + 20 * Math.sin(f / 6)} 60 90`} fill="none" stroke="#c88a3a" strokeWidth={14} /></g>,
    <g key="h"><path d="M 50 130 L 150 50 L 250 130 Z" fill="#26324a" /><rect x={70} y={130} width={160} height={100} fill="#1b2638" />{fl(110, 130, 1.1)}{fl(190, 120, 1.3)}{fl(150, 70, 0.9)}</g>];
  return <Bg dark>{ico.map((g, i) => { const at = 10 + i * Math.max(14, (dur - 40) / 4); const e = k(f, at, 10);
    return <div key={i} style={{ position: "absolute", left: 160 + i * 420, top: 340, width: 300, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * pop(f, at)})` }}>
      <svg width={300} height={260}>{g}</svg><div style={{ fontFamily: HAND, fontSize: 46, color: i === 3 ? HOT : C.paper }}>{L[i]}</div>
      {i < 3 && <div style={{ position: "absolute", left: 310, top: 90, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: C.gold, opacity: k(f, at + 8, 6) }}>→</div>}</div>; })}</Bg>;
};

// ==================== twentyfeet — LA CINTA MÉTRICA DE VEINTE PIES: el generador se arrastra desde el garaje hasta el patio mientras la cinta se estira
export const TwentyFeet: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = io((f - 15) / Math.max(40, dur * 0.5)); const gx = 420 + 1000 * p;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={60} y={300} width={400} height={500} fill="#26324a" stroke={LINE} strokeWidth={4} /><text x={260} y={360} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={LINE}>HOUSE</text>
    <rect x={0} y={800} width={1920} height={280} fill="#dfe6ef" />
    <rect x={460} y={760} width={gx - 460} height={40} fill="#ffd400" stroke="#222" strokeWidth={3} />
    {Array.from({ length: 21 }, (_, i) => 460 + i * 50 < gx && <line key={i} x1={460 + i * 50} y1={760} x2={460 + i * 50} y2={i % 5 ? 775 : 790} stroke="#222" strokeWidth={3} />)}
    <rect x={gx} y={640} width={200} height={160} rx={12} fill={C.ver} /><text x={gx + 100} y={735} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} fill="#fff">GEN</text>
    {Array.from({ length: 4 }, (_, i) => { const q = ((f + i * 10) % 40) / 40; return <circle key={i} cx={gx + 220 + q * 160} cy={680 - q * 80} r={20 + q * 30} fill="#888" opacity={0.6 * (1 - q)} />; })}
  </svg><Big x={960} y={150} at={10} size={70} col={C.gold}>{Math.round(20 * p)} FT · exhaust away</Big></Bg>;
};

// ==================== fortyline — LA RAYA DE LOS 40°: el termómetro de heladera gigante con la franja verde hasta 40 y la roja arriba; la aguja decide
export const FortyLine: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 1, dur * 0.5); const v = f < b ? 38 : 38 + 8 * io((f - b) / 30); const ang = -120 + (v - 20) * 6;
  return <Bg><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <circle cx={960} cy={560} r={360} fill={C.white} stroke={C.ink} strokeWidth={14} />
    <path d={`M 960 560 L ${960 + 320 * Math.sin((-120 * Math.PI) / 180)} ${560 - 320 * Math.cos((-120 * Math.PI) / 180)} A 320 320 0 0 1 ${960 + 320 * Math.sin((0 * Math.PI) / 180)} ${560 - 320 * Math.cos(0)} Z`} fill="rgba(63,157,90,.35)" />
    <path d={`M 960 560 L 960 240 A 320 320 0 0 1 ${960 + 320 * Math.sin((120 * Math.PI) / 180)} ${560 - 320 * Math.cos((120 * Math.PI) / 180)} Z`} fill="rgba(198,42,34,.3)" />
    <line x1={960} y1={560} x2={960 + 300 * Math.sin((ang * Math.PI) / 180)} y2={560 - 300 * Math.cos((ang * Math.PI) / 180)} stroke={C.ink} strokeWidth={12} strokeLinecap="round" /><circle cx={960} cy={560} r={26} fill={C.ink} />
    <text x={960} y={220} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill={C.ink}>40°</text>
  </svg><Big x={960} y={990} at={6} size={56} col={v > 40 ? C.ver : GRN}>{v > 40 ? "above 40 for 2+ hours → it goes" : "40 or below → you're fine"}</Big></Bg>;
};

// ==================== sortbins — LOS DOS TACHOS: leche, carne y sobras caen al rojo; queso duro, manteca, fruta y verdura al verde
export const SortBins: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const items = [["MILK", 0], ["MEAT", 0], ["LEFTOVERS", 0], ["HARD CHEESE", 1], ["BUTTER", 1], ["FRUIT", 1], ["VEGGIES", 1]] as const;
  return <Bg>{[["TOSS", 520, C.ver], ["KEEP", 1400, GRN]].map(([t, x, col]) => <div key={t as string} style={{ position: "absolute", left: (x as number) - 220, top: 620, width: 440, height: 360, background: col as string, borderRadius: "10px 10px 40px 40px", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 30, fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff" }}>{t as string}</div>)}
    {items.map(([e, side], i) => { const at = 10 + i * Math.max(10, (dur - 40) / 7); const p = io((f - at) / 18); const x0 = 960, x1 = side ? 1400 : 520; const x = x0 + (x1 - x0) * p, y = 200 + 520 * p - 200 * Math.sin(p * Math.PI);
      return f > at && <div key={i} style={{ position: "absolute", left: x - 140, top: y - 40, width: 280, textAlign: "center", background: C.white, border: `4px solid ${C.ink}`, borderRadius: 40, padding: "10px 0", fontFamily: SANS, fontWeight: 900, fontSize: 38, color: C.ink, opacity: p < 0.98 ? 1 : 0.0 }}>{e}</div>; })}</Bg>;
};

// ==================== twohouses — LAS DOS CASAS DE LA MISMA CALLE: en la de Jenny las jarras brillan y la caldera arranca; en la de al lado velas, heladera abierta tres veces y la placa que se quema
export const TwoHouses: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 1, dur * 0.6);
  const house = (x: number, good: boolean) => <g><path d={`M ${x} 500 L ${x + 300} 300 L ${x + 600} 500 Z`} fill="#26324a" /><rect x={x + 20} y={500} width={560} height={360} fill="#1b2638" stroke={LINE} strokeWidth={3} />
    {[0, 1].map((i) => <rect key={i} x={x + 80 + i * 280} y={580} width={160} height={140} fill={good ? `rgba(255,236,190,${0.7 + 0.05 * Math.sin(f / 6)})` : `rgba(255,${150 + 40 * Math.sin(f / 3 + i)},60,${0.5 + 0.2 * Math.sin(f / 2 + i)})`} />)}
    {f > b && <text x={x + 300} y={840} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={90} fill={good ? GRN : C.ver}>{good ? "✓" : "✕"}</text>}</g>;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>{house(120, true)}{house(1200, false)}</svg>
    <Big x={420} y={180} at={10} size={50} col={GRN}>the card</Big><Big x={1500} y={180} at={20} size={50} col={C.ver}>candles · fridge open 3×</Big>
    {f > b && <Big x={1500} y={980} at={b} size={48} col={C.ver}>furnace board fried</Big>}{f > b && <Big x={420} y={980} at={b} size={48} col={GRN}>everything started</Big>}</Bg>;
};

// ==================== snowcooler — LA CONSERVADORA AL SOL Y A LA SOMBRA: dos termómetros; la del sol sube aunque haya nieve, la del porche sombreado se queda fría
export const SnowCooler: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = cl(f / dur);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={0} y={760} width={1920} height={320} fill="#eef3f8" /><circle cx={320} cy={180} r={90} fill="#ffd27a" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={320} y1={180} x2={320 + 180 * Math.cos(i * 0.785 + f / 40)} y2={180 + 180 * Math.sin(i * 0.785 + f / 40)} stroke="#ffd27a" strokeWidth={6} opacity={0.6} />)}
    <rect x={1100} y={300} width={760} height={460} fill="#26324a" /><rect x={1060} y={260} width={840} height={60} fill="#3a465e" />
    {[[420, 34 + 14 * p, "IN THE SUN"], [1420, 34, "SHADED PORCH"]].map(([x, t, l]) => <g key={l as string}><rect x={(x as number) - 160} y={600} width={320} height={180} rx={20} fill="#2f6fd6" /><rect x={(x as number) - 170} y={580} width={340} height={40} rx={10} fill="#fff" />
      <text x={x as number} y={540} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={72} fill={(t as number) > 40 ? C.ver : GRN}>{Math.round(t as number)}°</text>
      <text x={x as number} y={880} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={C.ink}>{l as string}</text></g>)}
    {Array.from({ length: 4 }, (_, i) => <g key={i} transform={`translate(${200 + i * 90} ${880 + (i % 2) * 40})`} opacity={k(f, 20 + i * 12, 8)}><ellipse rx={18} ry={14} fill="#6b5a4a" /><circle cx={-16} cy={-20} r={7} fill="#6b5a4a" /><circle cx={0} cy={-26} r={7} fill="#6b5a4a" /><circle cx={16} cy={-20} r={7} fill="#6b5a4a" /></g>)}
  </svg></Bg>;
};

// ==================== startrun — EL PICO DE ARRANQUE: el gráfico de vatios de la heladera salta a 800 un instante y se asienta en 100-150
export const StartRun: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const n = Math.min(120, Math.floor(f * 1.5));
  const w = (i: number) => (i < 8 ? 0 : i < 14 ? 800 : 130 + 15 * Math.sin(i / 4));
  const d = Array.from({ length: n }, (_, i) => `${i ? "L" : "M"} ${180 + i * 12} ${880 - w(i) * 0.8}`).join(" ");
  return <Sheet title="THE FRIDGE ON A WATT METER"><svg width={1660} height={850} style={{ position: "absolute" }}>
    <line x1={150} y1={788} x2={1600} y2={788} stroke={C.ink} strokeWidth={4} />
    <path d={d} transform="translate(0 -92)" fill="none" stroke={C.ver} strokeWidth={8} />
    {n > 14 && <text x={300} y={130} fontFamily={HAND} fontWeight={700} fontSize={54} fill={C.ver}>800 W · starting</text>}
    {n > 40 && <text x={900} y={600} fontFamily={HAND} fontWeight={700} fontSize={54} fill={GRN}>100–150 W · running</text>}
  </svg></Sheet>;
};

// ==================== indexcard — LA TARJETA DE LA PRIMERA HORA: la ficha se escribe a mano renglón por renglón al ritmo de lo que dice Gary
export const IndexCard: React.FC<P> = ({ m, dur }) => {
  const L = ["1 · headlamps on the jugs", "2 · look outside · main breaker", "3 · report it once", "4 · tape the fridge", "5 · unplug TV, computer, microwave", "6 · furnace switch OFF", "7 · <20° after 1 hr → drip", "8 · warm room · hot water bottles", "POWER BACK → wait 5 min · furnace ON · one at a time"];
  const step = Math.max(12, (dur - 30) / L.length);
  return <Bg><div style={{ position: "absolute", left: 300, top: 60, width: 1320, height: 960, background: C.white, borderRadius: 8, boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: "rotate(-1deg)",
    backgroundImage: "repeating-linear-gradient(0deg, transparent 0 88px, rgba(47,95,168,.3) 88px 90px)" }}>
    <div style={{ height: 130, borderBottom: `5px solid ${C.ver}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: C.ver, letterSpacing: 6 }}>POWER OUT</div>
    {L.map((t, i) => <Hand key={i} text={t} at={10 + i * step} len={16} size={i === 8 ? 40 : 50} col={i === 8 ? GRN : CARBON} style={{ position: "absolute", left: 50, top: 150 + i * 90 }} />)}
  </div></Bg>;
};

// ==================== fuelgauge — EL MEDIDOR DE NAFTA: la aguja no baja de la mitad; a su alrededor aparecen los tres usos del auto (calor, cargador, cargar la estación)
export const FuelGauge: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const ang = -60 + 60 * io(f / 30);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 660 640 A 300 300 0 0 1 1260 640" fill="none" stroke="#444" strokeWidth={40} /><path d="M 660 640 A 300 300 0 0 1 960 340" fill="none" stroke={C.ver} strokeWidth={40} opacity={0.5} />
    <text x={640} y={720} fontFamily={SANS} fontWeight={900} fontSize={50} fill={C.ver}>E</text><text x={1250} y={720} fontFamily={SANS} fontWeight={900} fontSize={50} fill={LINE}>F</text><text x={960} y={300} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={40} fill={C.gold}>½</text>
    <line x1={960} y1={640} x2={960 + 260 * Math.sin((ang * Math.PI) / 180)} y2={640 - 260 * Math.cos((ang * Math.PI) / 180)} stroke={HOT} strokeWidth={14} strokeLinecap="round" /><circle cx={960} cy={640} r={30} fill="#ddd" />
  </svg>{["heater", "phone charger", "power station charger"].map((t, i) => <Big key={t} x={480 + i * 480} y={900} at={30 + i * 15} size={46} col={C.paper}>{t}</Big>)}
    <Big x={960} y={120} at={8} size={56} col={C.gold}>at least half · all winter</Big></Bg>;
};

// ==================== meterscreen — LA PANTALLITA DEL MEDIDOR: apagada = la red; prendida con la casa a oscuras = tu main
export const MeterScreen: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 0, dur * 0.5); const on = f > b;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <circle cx={960} cy={520} r={330} fill="#c9d1da" stroke="#888" strokeWidth={10} /><circle cx={960} cy={520} r={290} fill="rgba(220,240,255,.25)" />
    <rect x={780} y={430} width={360} height={150} rx={10} fill={on ? "#9fdc8a" : "#1a1f1a"} />
    {on && <text x={960} y={530} textAnchor="middle" fontFamily="monospace" fontWeight={900} fontSize={72} fill="#1a3a1a">04218 kWh</text>}
  </svg><Big x={960} y={950} at={10} size={52} col={on ? GRN : C.ver}>{on ? "screen on · house dark → your side · the main" : "screen dark → it's the grid"}</Big></Bg>;
};

// ==================== lighterplug — EL ENCHUFE DEL ENCENDEDOR: 12 V × amperes = 100-150 W; dos horas llenan una barra de unos cientos de Wh
export const LighterPlug: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = cl((f - 30) / Math.max(40, dur - 60));
  return <Sheet title="THE CAR'S 12-VOLT SOCKET"><div style={{ position: "absolute", left: 120, top: 80, fontFamily: SANS, fontWeight: 900, fontSize: 90, color: C.ink }}>
    <span style={{ opacity: k(f, 6, 8) }}>12 V</span><span style={{ opacity: k(f, 16, 8) }}> → </span><span style={{ color: C.ver, opacity: k(f, 26, 8) }}>100–150 W</span></div>
    <div style={{ position: "absolute", left: 120, top: 330, width: 1400, height: 160, border: `6px solid ${C.ink}`, borderRadius: 20 }}><div style={{ width: `${p * 30}%`, height: "100%", background: GRN, borderRadius: 14 }} /></div>
    <Hand text={`${Math.round(p * 2 * 10) / 10} hours → ~${Math.round(p * 280)} Wh`} at={30} len={10} size={60} style={{ position: "absolute", left: 120, top: 540 }} />
    <Hand text="the lights and the phones for the night" at={Math.round(dur * 0.7)} len={20} size={54} col={GRN} style={{ position: "absolute", left: 120, top: 660 }} /></Sheet>;
};

// ==================== restart — LA ESCALERA DEL REGRESO: seis escalones que se prenden en orden, cada uno con su aparato; ninguno antes de tiempo
export const Restart: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const S = ["WAIT 5 MIN", "FURNACE", "FRIDGE + FREEZER", "WATER HEATER", "TV · PC · MICROWAVE", "CHECK THE FOOD"];
  const step = Math.max(10, (dur - 30) / S.length);
  return <Bg dark>{S.map((t, i) => { const on = k(f, 10 + i * step, 8); return <div key={t} style={{ position: "absolute", left: 180 + i * 260, top: 820 - i * 120, width: 300, height: 110, background: on ? (i === 0 ? C.gold : GRN) : "#2c3a52", borderRadius: 8, boxShadow: on ? `0 0 30px ${GRN}` : "none",
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 28, color: on ? "#111" : "#7a8696", textAlign: "center" }}>{i + 1} · {t}</div>; })}
    <Big x={420} y={140} at={6} size={56} col={C.paper}>the right order</Big></Bg>;
};

// ==================== phonesave — LA BATERÍA QUE ESTIRA: cuatro perillas (brillo, ahorro, apps, avión) y la barra de días pasa de 1 a 3
export const PhoneSave: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const T = ["brightness down", "low power mode", "close the apps", "airplane mode"]; const step = Math.max(12, (dur - 40) / 4); const n = Math.min(4, Math.floor((f - 10) / step) + 1);
  const days = 1 + 2 * cl((f - 10) / (step * 4));
  return <Bg dark>
    <div style={{ position: "absolute", left: 220, top: 120, width: 480, height: 860, background: "#111", borderRadius: 60, border: "6px solid #444", padding: 50 }}>
      {T.map((t, i) => <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 50, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#ddd" }}>{t}
        <div style={{ width: 90, height: 50, borderRadius: 25, background: i < n ? GRN : "#444", position: "relative" }}><div style={{ position: "absolute", top: 5, left: i < n ? 45 : 5, width: 40, height: 40, borderRadius: 20, background: "#fff" }} /></div></div>)}</div>
    <div style={{ position: "absolute", left: 900, top: 420, width: 800, height: 200, border: `8px solid ${C.paper}`, borderRadius: 24 }}><div style={{ width: `${(days / 3) * 100}%`, height: "100%", background: GRN, borderRadius: 14 }} /></div>
    <Big x={1300} y={740} at={6} size={90} col={C.paper}>{days.toFixed(1)} days</Big></Bg>;
};

// ==================== snowpipe — EL CAÑO DE ESCAPE ENTERRADO: la nieve tapa la salida y el humo gris vuelve por debajo hacia la cabina; la pala lo despeja
export const SnowPipe: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const b = M(m, 1, dur * 0.55); const clear = io((f - b) / 20);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 300 700 L 400 520 L 1100 520 L 1300 640 L 1500 660 L 1500 800 L 300 800 Z" fill="#3a4a66" /><rect x={460} y={540} width={260} height={120} fill="#9fb8d6" opacity={0.6} />
    <rect x={1460} y={760} width={120} height={30} fill="#666" />
    <path d={`M 1400 ${800 - 160 * (1 - clear)} Q 1600 ${700 - 160 * (1 - clear)} 1800 ${800 - 160 * (1 - clear)} L 1800 1080 L 1400 1080 Z`} fill="#eef3f8" />
    {Array.from({ length: 6 }, (_, i) => { const q = ((f + i * 8) % 48) / 48; return clear < 0.5 ? <circle key={i} cx={1460 - q * 900} cy={780 - q * 160} r={30 + q * 20} fill="#777" opacity={0.5 * (1 - q)} /> : <circle key={i} cx={1600 + q * 200} cy={760 - q * 200} r={20 + q * 30} fill="#999" opacity={0.5 * (1 - q)} />; })}
  </svg><Big x={960} y={150} at={10} size={56} col={clear < 0.5 ? C.ver : GRN}>{clear < 0.5 ? "buried tailpipe → exhaust comes back in" : "clear the snow first"}</Big></Bg>;
};

// ==================== busfeet — EL COLECTIVO ESCOLAR ACOSTADO: entre el cable caído y la familia entra un micro escolar de 35 pies; esa es la distancia
export const BusFeet: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = io((f - 15) / 30);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={0} y={760} width={1920} height={320} fill="#eef3f8" />
    <path d={`M 140 760 Q 220 ${720 + 20 * Math.sin(f / 4)} 300 760`} stroke="#111" strokeWidth={10} fill="none" />{f % 16 < 6 && <path transform="translate(300 700)" d="M -10 -40 L 10 -40 L 0 -10 L 18 -10 L -14 40 L -4 4 L -20 4 Z" fill="#ffe066" />}
    <g transform={`translate(${-1200 + 1550 * p} 0)`}><rect x={0} y={560} width={1200} height={200} rx={20} fill="#f2b705" /><rect x={40} y={590} width={1100} height={70} fill="#2b3547" opacity={0.7} />
      <circle cx={200} cy={770} r={46} fill="#222" /><circle cx={1000} cy={770} r={46} fill="#222" /></g>
    {[0, 1, 2].map((i) => { const h = i === 2 ? 0.65 : 1; return <g key={i} transform={`translate(${1640 + i * 70} 760) scale(${h})`} stroke={C.paper} strokeWidth={8} fill="none"><circle cx={0} cy={-150} r={22} /><line x1={0} y1={-128} x2={0} y2={-60} /><line x1={0} y1={-60} x2={-20} y2={0} /><line x1={0} y1={-60} x2={20} y2={0} /><line x1={-26} y1={-110} x2={26} y2={-110} /></g>; })}
    <line x1={340} y1={900} x2={340 + 1210 * p} y2={900} stroke={C.ver} strokeWidth={8} />
  </svg><Big x={960} y={980} at={40} size={70} col={C.ver}>35 FEET · a school bus</Big><Big x={960} y={130} at={10} size={54} col={C.paper}>every wire on the ground is live</Big></Bg>;
};

// ==================== tankhours — EL TUBO DE OXÍGENO COMO RELOJ DE ARENA: el manómetro baja y al lado se cuentan las seis horas que da a su caudal
export const TankHours: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const p = cl(f / Math.max(60, dur - 20)); const h = 6 * p;
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={620} y={260} width={220} height={680} rx={110} fill="#3f9d5a" /><rect x={680} y={180} width={100} height={100} rx={20} fill="#999" />
    <circle cx={730} cy={150} r={70} fill={C.white} stroke="#333" strokeWidth={6} /><line x1={730} y1={150} x2={730 + 55 * Math.sin(((60 - 120 * p) * Math.PI) / 180)} y2={150 - 55 * Math.cos(((60 - 120 * p) * Math.PI) / 180)} stroke={C.ver} strokeWidth={6} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={1060 + i * 120} y={480} width={100} height={140} rx={10} fill={h > i + 0.5 ? C.gold : "#2c3a52"} />)}
  </svg><Big x={1360} y={720} at={10} size={80} col={C.gold}>{h.toFixed(1)} h</Big><Big x={1360} y={380} at={6} size={44} col={C.paper}>one backup tank · at her setting</Big></Bg>;
};

// ==================== dotcard — LA TARJETA DE TORMENTA DE DOT: se arma pegando cinco papelitos uno por uno sobre una ficha y se pega en la puerta del placard
export const DotCard: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const L = ["OXYGEN CO. · 24-hr line", "6 hrs per tank", "SON · cell", "GARY · two doors down", "WARMING CENTER · address"]; const step = Math.max(14, (dur - 40) / 5);
  return <AbsoluteFill style={{ background: "#d8c7a6" }}>
    <div style={{ position: "absolute", left: 1500, top: 0, width: 420, height: 1080, background: "#b8945e" }} />
    <div style={{ position: "absolute", left: 360, top: 100, width: 1100, height: 880, background: C.white, borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,.4)", transform: "rotate(1deg)" }}>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: C.ver, marginTop: 30 }}>DOT'S STORM CARD</div>
      {L.map((t, i) => { const e = k(f, 20 + i * step, 8); return <div key={t} style={{ position: "absolute", left: 80, top: 200 + i * 130, opacity: e, transform: `translateX(${(1 - e) * -200}px) rotate(${(i % 2 ? 1 : -1) * 1.5}deg)`, background: "#fff7c2", padding: "14px 30px", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CARBON, boxShadow: "0 6px 14px rgba(0,0,0,.2)" }}>{t}</div>; })}</div></AbsoluteFill>;
};

// ==================== redcord — EL TIRADOR ROJO DEL PORTÓN: la manija baja y hacia la puerta, el carro se suelta del riel y el portón sube a mano
export const RedCord: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const pull = io((f - 20) / 14); const up = io((f - 60) / 40);
  return <Bg dark><svg width={1920} height={1080} style={{ position: "absolute" }}>
    <rect x={200} y={180} width={1500} height={24} fill="#888" /><rect x={1500 - 0} y={150} width={240} height={110} rx={10} fill="#ccc" />
    <rect x={800 + pull * 40} y={200} width={120} height={40} fill="#555" />
    <line x1={860} y1={240} x2={860 - pull * 60} y2={540 + pull * 40} stroke={C.ver} strokeWidth={6} /><circle cx={860 - pull * 60} cy={560 + pull * 40} r={30} fill={C.ver} />
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={140} y={300 + i * 170 - up * 520} width={360} height={160} fill="#e8e2d4" stroke="#999" strokeWidth={4} />)}
  </svg><Big x={1300} y={500} at={20} size={52} col={C.paper}>down · and back toward the door</Big>{up > 0.3 && <Big x={1300} y={640} at={60} size={52} col={GRN}>lift it by hand · slow</Big>}</Bg>;
};

// ==================== drillquiz — LAS TRES PREGUNTAS DEL SIMULACRO: tres tarjetas de examen que se dan vuelta y cada una muestra la respuesta con una carita
export const DrillQuiz: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const Q = [["Where's the main breaker?", "the basement · red tape"], ["What do we never bring inside?", "grill · generator · camp stove"], ["Who do we call if it's long?", "the card on the fridge"]];
  const step = Math.max(20, (dur - 30) / 3);
  return <Bg>{Q.map(([q, a], i) => { const at = 10 + i * step; const fl = io((f - at - step * 0.5) / 12);
    return <div key={q} style={{ position: "absolute", left: 120 + i * 580, top: 260, width: 520, height: 560, perspective: 1200, opacity: k(f, at, 8) }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${180 * fl}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.white, border: `6px solid ${C.ink}`, borderRadius: 18, padding: 40, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CARBON }}>{i + 1}. {q}</div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#e9f5ea", border: `6px solid ${GRN}`, borderRadius: 18, padding: 40, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: GRN }}>{a}<svg width={140} height={140} style={{ marginTop: 30 }}><circle cx={70} cy={70} r={60} fill="none" stroke={GRN} strokeWidth={8} /><circle cx={50} cy={55} r={7} fill={GRN} /><circle cx={90} cy={55} r={7} fill={GRN} /><path d="M 40 85 Q 70 115 100 85" fill="none" stroke={GRN} strokeWidth={8} /></svg></div></div></div>; })}
    <Big x={960} y={140} at={6} size={58} col={C.paper}>blackout night · three questions</Big></Bg>;
};

// ==================== boxcost — EL TICKET DE LA CAJA: la lista de la caja se imprime como ticket de supermercado y suma $125
export const BoxCost: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const L = [["4 headlamps + batteries", 40], ["2 battery CO alarms", 50], ["weather radio", 30], ["fridge thermometer", 5], ["gallon jugs", 0], ["socks & hats", 0]] as const;
  const step = Math.max(12, (dur - 40) / (L.length + 1)); const n = Math.min(L.length, Math.floor((f - 10) / step) + 1); const tot = L.slice(0, Math.max(0, n)).reduce((s, x) => s + x[1], 0);
  return <Bg><div style={{ position: "absolute", left: 640, top: 60, width: 640, height: 120 + n * 110 + 160, maxHeight: 980, background: "#fbfaf5", boxShadow: "0 30px 60px rgba(0,0,0,.5)", padding: "40px 50px", fontFamily: "monospace", fontSize: 38, color: "#222", overflow: "hidden" }}>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 44 }}>BLACKOUT BOX</div>
    {L.slice(0, Math.max(0, n)).map(([t, v]) => <div key={t} style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}><span>{t}</span><span>{v ? `$${v}` : "—"}</span></div>)}
    {n >= L.length && <div style={{ borderTop: "4px dashed #222", marginTop: 40, paddingTop: 20, display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 52, color: C.ver }}><span>TOTAL</span><span>~${tot}</span></div>}</div></Bg>;
};

// ---------- overlays de una vez (esquina, ≤15 s)
export const FridgeTemp: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", right: 140, top: 140, opacity: o, background: "#eef3f8", border: `6px solid ${COLD}`, borderRadius: 60, padding: "14px 34px", fontFamily: SANS, fontWeight: 900, fontSize: 50, color: C.ink }}>❄ {text}</div>;
};
export const OutClock: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", left: 140, top: 140, opacity: o, background: "rgba(10,16,30,.9)", border: `4px solid ${C.gold}`, borderRadius: 12, padding: "12px 28px", fontFamily: "monospace", fontWeight: 900, fontSize: 50, color: C.gold }}>{text}</div>;
};
export const PhoneBat: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const f = useCurrentFrame(); const o = k(f, 0, 8) * (1 - k(f, dur - 10, 10));
  return <div style={{ position: "absolute", right: 160, bottom: 140, opacity: o, display: "flex", alignItems: "center", gap: 16, background: "rgba(245,245,240,.95)", padding: "16px 30px", borderRadius: 20 }}>
    <div style={{ width: 90, height: 44, border: `5px solid ${C.ink}`, borderRadius: 8, padding: 4 }}><div style={{ width: `${30 + 60 * k(f, 6, 40)}%`, height: "100%", background: GRN }} /></div><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink }}>{text}</div></div>;
};

// ---------- despacho de los planos C
export const CompC: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const c: string = s.comp, m: number[] = s.m || [];
  if (c.startsWith("houseslice:")) return <HouseSlice act={c.slice(11)} m={m} dur={dur} />;
  if (c.startsWith("tencard:")) return <TenCard n={Number(c.slice(8))} m={m} dur={dur} />;
  if (c.startsWith("setup:")) return <SetupBoard n={Number(c.slice(6))} m={m} dur={dur} />;
  if (c.startsWith("oops:")) return <OopsSign n={Number(c.slice(5))} m={m} dur={dur} />;
  const T: Record<string, React.FC<P>> = { jugbeam: JugBeam, porchrow: PorchRow, halfmain: HalfMain, hotline: Hotline, funnel: Funnel, doorjump: DoorJump, surgewave: SurgeWave, leakbucket: LeakBucket, twojobs: TwoJobs, misclabel: MiscLabel, laminator: Laminator, plugalarm: PlugAlarm, gaugeruler: GaugeRuler, malemale: MaleMale, dripdrop: DripDrop, teeter: Teeter, shuffle: Shuffle, redtape: RedTape, coilheat: CoilHeat, freezertetris: FreezerTetris, heatloss: HeatLoss, candlecat: CandleCat, twentyfeet: TwentyFeet, fortyline: FortyLine, sortbins: SortBins, twohouses: TwoHouses, snowcooler: SnowCooler, startrun: StartRun, indexcard: IndexCard, fuelgauge: FuelGauge, meterscreen: MeterScreen, lighterplug: LighterPlug, restart: Restart, phonesave: PhoneSave, snowpipe: SnowPipe, busfeet: BusFeet, tankhours: TankHours, dotcard: DotCard, redcord: RedCord, drillquiz: DrillQuiz, boxcost: BoxCost };
  const X = T[c]; return X ? <X m={m} dur={dur} /> : null;
};
