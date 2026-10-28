// componentes únicos de hdc28b · la fresa del súper (1 por minuto, ninguno repetido). Cada uno dibuja SU objeto en código
// (fresa con sus aquenios, semilla, brote con cotiledones, hoja de tres, bandeja en corte, maceta); nada de plantillas ni íconos.
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

export const SOIL = "#5b3f2b", SOIL2 = "#3e2a1c", LEAF = "#7dbf63", LEAF2 = "#4f8f3f", TERRA = "#b8653f", BERRY = "#e0303a", BERRY2 = "#9e1424", ACH = "#f2cf5b";

// ===== piezas de dibujo =====
// fresa: corazón con degradé, aquenios en tresbolillo (glow = se encienden), cáliz de 6 sépalos. ripe 0 = blanca/verde, 1 = roja
export const Berry: React.FC<{ x: number; y: number; s?: number; ripe?: number; glow?: number; rot?: number; op?: number; cut?: number }> = ({ x, y, s = 1, ripe = 1, glow = 0, rot = 0, op = 1, cut = 0 }) => {
  const mix = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * ripe)).join(",")})`;
  const c1 = mix([236, 238, 200], [232, 52, 62]), c2 = mix([170, 196, 120], [150, 20, 36]);
  const seeds: [number, number][] = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) { const sx = 40 + c * 27 + (r % 2) * 13, sy = 92 + r * 27; const dx = (sx - 120) / (100 - r * 9); if (Math.abs(dx) < 1 && sy < 270 - Math.abs(sx - 120) * 0.6) seeds.push([sx, sy]); }
  const id = `bg${Math.round(x)}${Math.round(y)}`;
  return <svg viewBox="0 0 240 300" style={{ position: "absolute", left: x - 120 * s, top: y - 150 * s, width: 240 * s, height: 300 * s, opacity: op, overflow: "visible", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 26px 30px rgba(0,0,0,.55))" }}>
    <defs><radialGradient id={id} cx="38%" cy="35%" r="70%"><stop offset="0%" stopColor="#ff8a8a" stopOpacity={ripe * 0.8} /><stop offset="35%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></radialGradient></defs>
    <path d="M120 290 C60 250 14 170 22 110 C28 66 70 52 120 64 C170 52 212 66 218 110 C226 170 180 250 120 290 Z" fill={`url(#${id})`} />
    {cut > 0 && <path d={`M${120 - 80 * cut} 120 C ${120 - 40 * cut} 140 ${120 + 40 * cut} 140 ${120 + 80 * cut} 120`} stroke="#ffd0d0" strokeWidth={10 * cut} fill="none" strokeLinecap="round" />}
    {seeds.map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={4.2} ry={6} fill={ACH} stroke="rgba(120,60,0,.4)" strokeWidth={1} style={{ filter: glow > 0 ? `drop-shadow(0 0 ${8 * glow}px rgba(255,230,120,${glow}))` : undefined }} />)}
    <path d="M60 100 C56 130 62 160 76 186" stroke="rgba(255,255,255,.55)" strokeWidth={9} fill="none" strokeLinecap="round" />
    {[-70, -35, 0, 35, 70, 180].map((a, i) => <path key={i} d="M120 66 q-14 -10 -6 -46 q14 18 6 46 Z" fill={i % 2 ? "#5c9e3e" : "#78b84f"} transform={`rotate(${a * 0.9} 120 66) scale(1 ${0.9 + (i % 3) * 0.08})`} style={{ transformOrigin: "120px 66px" }} />)}
    <rect x={115} y={30} width={10} height={36} rx={4} fill="#4f7f33" />
  </svg>;
};
export const Seed: React.FC<{ x: number; y: number; s?: number; op?: number; col?: string; glow?: number }> = ({ x, y, s = 1, op = 1, col = ACH, glow = 0 }) => (
  <div style={{ position: "absolute", left: x - 7 * s, top: y - 10 * s, width: 14 * s, height: 20 * s, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: `radial-gradient(circle at 35% 30%, #fff3b8, ${col} 55%, #a7782a)`, opacity: op, boxShadow: glow > 0 ? `0 0 ${18 * glow}px rgba(255,220,120,${glow})` : "0 3px 6px rgba(0,0,0,.4)" }} />
);
// brote: tallito + dos cotiledones redondos; p = crecimiento 0..1; lean = se inclina (grados); fall = se tumba en la base
export const Sprout: React.FC<{ x: number; y: number; s?: number; p: number; lean?: number; pale?: number; tall?: number }> = ({ x, y, s = 1, p, lean = 0, pale = 0, tall = 1 }) => {
  if (p <= 0.01) return null;
  const h = 70 * s * cl(p) * tall, cot = cl((p - 0.35) / 0.65), col = pale > 0 ? `rgb(${Math.round(125 + 90 * pale)},${Math.round(191 + 30 * pale)},${Math.round(99 + 60 * pale)})` : LEAF;
  return <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${lean}deg)`, transformOrigin: "0 0" }}>
    <div style={{ position: "absolute", left: -2.5 * s, top: -h, width: 5 * s, height: h, borderRadius: 3, background: pale > 0.3 ? "#c9d9a0" : "#8fbf62" }} />
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: d < 0 ? -30 * s * cot : 0, top: -h - 11 * s * cot, width: 30 * s * cot, height: 18 * s * cot, borderRadius: "50%", background: `linear-gradient(${d < 0 ? 200 : 160}deg, ${col}, ${LEAF2})`, transform: `rotate(${d * -18}deg)`, transformOrigin: d < 0 ? "100% 50%" : "0 50%" }} />)}
  </div>;
};
// hoja verdadera de fresa: tres folíolos dentados
export const Trifol: React.FC<{ x: number; y: number; s?: number; p?: number; rot?: number; col?: string }> = ({ x, y, s = 1, p = 1, rot = 0, col = "#5fae4a" }) => {
  if (p <= 0.01) return null;
  const leaf = "M0 0 C-26 -18 -34 -60 -16 -86 l6 6 l4 -9 l6 6 l4 -9 l6 6 l4 -9 l6 6 C34 -60 26 -18 0 0 Z";
  return <svg viewBox="-110 -120 220 140" style={{ position: "absolute", left: x - 110 * s * p, top: y - 120 * s * p, width: 220 * s * p, height: 140 * s * p, overflow: "visible", transform: `rotate(${rot}deg)`, transformOrigin: "50% 86%", filter: "drop-shadow(0 10px 12px rgba(0,0,0,.45))" }}>
    {[-48, 0, 48].map((a) => <g key={a} transform={`rotate(${a})`}><path d={leaf} fill={col} /><path d="M0 0 L0 -80" stroke="rgba(255,255,255,.35)" strokeWidth={3} /></g>)}
    <rect x={-3} y={0} width={6} height={20} fill="#6b9a3c" />
  </svg>;
};
// bandeja en corte: tierra con agujeros abajo
export const Tray: React.FC<{ x: number; y: number; w: number; h?: number; wet?: number; children?: React.ReactNode }> = ({ x, y, w, h = 120, wet = 0, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "6px 6px 14px 14px", background: "linear-gradient(180deg, #2b2b2e, #18181a)", boxShadow: "0 30px 50px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 10, right: 10, top: 14, bottom: 12, borderRadius: 6, background: `linear-gradient(180deg, ${wet > 0 ? `rgb(${Math.round(91 - 30 * wet)},${Math.round(63 - 20 * wet)},${Math.round(43 - 12 * wet)})` : SOIL}, ${SOIL2})`, overflow: "visible" }}>{children}</div>
    {Array.from({ length: Math.max(2, Math.floor(w / 90)) }, (_, i) => <div key={i} style={{ position: "absolute", bottom: -2, left: 40 + i * 90, width: 18, height: 8, borderRadius: 4, background: "#070708" }} />)}
  </div>
);
export const Pot: React.FC<{ x: number; y: number; w: number; h: number; col?: string; children?: React.ReactNode }> = ({ x, y, w, h, col = TERRA, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h }}>
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 91% 100%, 9% 100%)", background: `linear-gradient(90deg, ${col}, #d98a5e 45%, ${col})` }} />
    <div style={{ position: "absolute", left: "4%", right: "4%", top: 18, bottom: 14, clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)", background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }}>{children}</div>
    <div style={{ position: "absolute", left: -10, right: -10, top: 0, height: 22, borderRadius: 6, background: "#c97650" }} />
  </div>
);
export const Big: React.FC<{ x: number; y: number; txt: string; s: number; col?: string; size?: number }> = ({ x, y, txt, s, col = TX, size = 120 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 1.8), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{txt}</div>
);
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; col?: string }> = ({ x1, y1, x2, y2, p, col = AMB }) => {
  const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return <div style={{ position: "absolute", left: x1, top: y1 - 5, width: L * cl(p), height: 10, borderRadius: 5, background: col, transformOrigin: "0 50%", transform: `rotate(${a}deg)`, boxShadow: `0 0 18px ${col}` }}>
    {p > 0.95 && <div style={{ position: "absolute", right: -14, top: -12, width: 0, height: 0, borderLeft: `30px solid ${col}`, borderTop: "17px solid transparent", borderBottom: "17px solid transparent" }} />}
  </div>;
};
export const X: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 160 }) => p <= 0 ? null : <>
  {[45, -45].map((r, i) => <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - 7, width: s * cl(p * 2 - i), height: 14, borderRadius: 7, background: RED, transform: `rotate(${r}deg)`, transformOrigin: "50% 50%", boxShadow: `0 0 20px ${RED}` }} />)}
</>;
export const Ok: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => p <= 0 ? null : (
  <svg viewBox="0 0 100 100" style={{ position: "absolute", left: x - 50 * s, top: y - 50 * s, width: 100 * s, height: 100 * s, overflow: "visible" }}>
    <circle cx={50} cy={50} r={46} fill="rgba(111,227,154,.16)" stroke={GRN} strokeWidth={6} opacity={cl(p * 2)} />
    <path d="M28 52 L44 68 L74 34" stroke={GRN} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - cl(p * 1.5 - 0.3))} />
  </svg>
);
const rnd = (i: number) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---- 0:05 · 200 PUNTITOS = 200 PLANTAS: la fresa gira, los aquenios se encienden y vuelan a una bandeja donde cada uno brota ----
export const HSeeds200: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const b = phys(tt, 0.3, 5, 0.5), g = cl((tt - 1.2) / 0.8), fly = eio(tt, 2.2, 4.0), gr = cl((tt - 4.0) / 1.6);
  return <>
    <Head tt={tt} kick="LO QUE CASI NADIE MIRA" title="CADA PUNTITO ES UNA SEMILLA" col={RED} />
    <Berry x={520} y={560} s={1.5 * b + 0.01} glow={g} rot={4 * Math.sin(tt * 0.8)} />
    <Tray x={1350} y={640} w={720} h={130}>{null}</Tray>
    {Array.from({ length: 40 }, (_, i) => {
      const sx = 470 + rnd(i) * 110, sy = 470 + rnd(i + 9) * 200, tx = 1020 + (i % 10) * 72, ty = 664 + Math.floor(i / 10) * 0 + (Math.floor(i / 10) % 2) * 6;
      const k = cl((fly - i * 0.012) / 0.6), x = sx + (tx - sx) * k, y = sy + (ty - sy) * k - Math.sin(k * Math.PI) * 220;
      return k < 0.98 ? (fly > 0 ? <Seed key={i} x={x} y={y} s={1.2} glow={1 - k} /> : null) : <Sprout key={i} x={tx} y={668} p={cl(gr * 1.4 - (i % 10) * 0.05)} s={0.9} lean={3 * Math.sin(tt + i)} />;
    })}
    <Big x={1350} y={430} txt={`${Math.round(200 * cl(fly * 1.05))}`} s={phys(tt, 2.2, 5, 0.6)} col={ACH} size={150} />
    <Tag tt={tt} at={4.6} x={1350} y={880} txt="UNA FRESA DEL SÚPER · 200 SEMILLAS" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 0:45 · LA VERDAD: lo que SÍ pasa en una semana (brotes) contra lo que NO (planta con fresas) ----
export const HMyth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const l = phys(tt, 0.4, 5, 0.55), r = phys(tt, 1.4, 5, 0.55), x = cl((tt - 3.0) / 0.6), ok = cl((tt - 3.8) / 0.6);
  return <>
    <Head tt={tt} kick="UNA VERDAD ANTES DE EMPEZAR" title="EN 7 DÍAS, ¿QUÉ VES?" />
    <div style={{ position: "absolute", left: 960, top: 230, width: 3, height: 640, background: "rgba(255,255,255,.12)" }} />
    <div style={{ opacity: cl(l * 2) }}>
      <Tray x={520} y={560} w={560}>{null}</Tray>
      {Array.from({ length: 14 }, (_, i) => <Sprout key={i} x={270 + i * 37} y={588} p={cl(l * 1.3 - (i % 4) * 0.08)} s={0.8} lean={4 * Math.sin(tt * 0.9 + i)} />)}
      <Tag tt={tt} at={0.8} x={520} y={790} txt="BROTES CHIQUITOS" col={GRN} size={44} />
      <Ok x={520} y={420} p={ok} s={1.2} />
    </div>
    <div style={{ opacity: cl(r * 2) * (1 - 0.45 * x) }}>
      <Pot x={1400} y={560} w={320} h={240}>{null}</Pot>
      {Array.from({ length: 6 }, (_, i) => <Trifol key={i} x={1280 + i * 48} y={570} s={1.1} p={r} rot={(i - 2.5) * 16} />)}
      {[0, 1, 2].map((i) => <Berry key={i} x={1250 + i * 150} y={700 + (i % 2) * 30} s={0.38 * r} rot={-10 + i * 10} />)}
      <Tag tt={tt} at={1.8} x={1400} y={880} txt="PLANTAS CON FRESAS" col={RED} size={44} />
    </div>
    <X x={1400} y={560} p={x} s={300} />
  </>;
}}</Stage>;

// ---- 1:20 · LA LÍNEA DEL TIEMPO REAL: semilla → brote → hoja dentada → trasplante → flor → fresa ----
export const HTimeline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const st = [["SEMILLA", "DÍA 0"], ["BROTE", "7-21 DÍAS"], ["HOJA DENTADA", "2-3 SEMANAS"], ["MACETA", "4-6 SEMANAS"], ["FRESA", "4-6 MESES"]];
  const run = eio(tt, 0.5, 5.2);
  return <>
    <Head tt={tt} kick="SIN CUENTOS" title="CUÁNDO PASA CADA COSA" col={GRN} />
    <div style={{ position: "absolute", left: 200, top: 700, width: 1520, height: 8, borderRadius: 4, background: "rgba(255,255,255,.1)" }}><div style={{ width: `${run * 100}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${ACH}, ${GRN} 60%, ${RED})` }} /></div>
    {st.map(([n, d], i) => {
      const x = 200 + i * 380, k = phys(tt, 0.5 + i * 1.0, 6, 0.5), on = run * 4 >= i - 0.02;
      return <div key={i} style={{ opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", left: x - 16, top: 688, width: 32, height: 32, borderRadius: "50%", background: on ? (i === 4 ? RED : GRN) : "#333", boxShadow: on ? `0 0 24px ${i === 4 ? RED : GRN}` : undefined }} />
        {i === 0 && <Seed x={x} y={560} s={3 * k} />}
        {i === 1 && <Sprout x={x} y={640} p={k} s={1.6} />}
        {i === 2 && <Trifol x={x} y={640} s={0.9} p={k} />}
        {i === 3 && <><Pot x={x} y={560} w={140} h={110}>{null}</Pot><Trifol x={x - 20} y={575} s={0.55} p={k} rot={-14} /><Trifol x={x + 22} y={575} s={0.55} p={k} rot={14} /></>}
        {i === 4 && <Berry x={x} y={570} s={0.62 * k} />}
        <div style={{ position: "absolute", left: x, top: 770, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 900, fontSize: 34, color: TX }}>{n}</div><div style={{ fontWeight: 800, fontSize: 30, color: i === 4 ? RED : AMB, marginTop: 4 }}>{d}</div>
        </div>
      </div>;
    })}
  </>;
}}</Stage>;

// ---- 2:05 · EL CANDADO DEL FRÍO: la semilla tiene un candado; el termómetro baja a 4 °C, el candado se abre y brota ----
export const HLock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const cold = eio(tt, 0.8, 3.2), open = cl((tt - 3.3) / 0.5), sp = cl((tt - 3.9) / 1.6), T = Math.round(22 - 18 * cold);
  return <>
    <Head tt={tt} kick="EL PASO 2 · EL SECRETO" title="EL FRÍO ABRE EL CANDADO" col={ICE} />
    <div style={{ position: "absolute", left: 360, top: 260, width: 70, height: 520, borderRadius: 35, background: "rgba(255,255,255,.08)", border: "4px solid rgba(255,255,255,.3)" }}>
      <div style={{ position: "absolute", left: 13, right: 13, bottom: 12, height: `${(1 - cold * 0.75) * 85}%`, borderRadius: 20, background: `linear-gradient(0deg, ${cold > 0.5 ? ICE : RED}, ${cold > 0.5 ? "#bfe8ff" : "#ff8d7d"})` }} />
    </div>
    <div style={{ position: "absolute", left: 470, top: 470, fontWeight: 900, fontSize: 90, color: cold > 0.5 ? ICE : RED }}>{T}°C</div>
    <Seed x={1240} y={560} s={11} />
    <div style={{ position: "absolute", left: 1180, top: 330 - open * 60, width: 120, height: 110, border: "18px solid #b9b9c4", borderBottom: "none", borderRadius: "60px 60px 0 0", transform: `rotate(${open * 28}deg)`, transformOrigin: "100% 100%" }} />
    <div style={{ position: "absolute", left: 1160, top: 430, width: 160, height: 120, borderRadius: 18, background: "linear-gradient(180deg, #d9d9e2, #8d8d99)", opacity: 1 - open * 0.9, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 66, top: 40, width: 28, height: 40, borderRadius: 14, background: "#333" }} />
    </div>
    {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 900 + rnd(i) * 700, top: (120 + rnd(i + 3) * 800 + tt * 60 * (0.6 + rnd(i + 7))) % 900, width: 10, height: 10, borderRadius: "50%", background: "#e6f6ff", opacity: cold * 0.6 * (1 - open) }} />)}
    <Sprout x={1240} y={470} p={sp} s={3.2} />
    <Tag tt={tt} at={4.3} x={1240} y={860} txt="CON FRÍO BROTAN CASI TODAS, JUNTAS" col={ICE} size={42} />
  </>;
}}</Stage>;

// ---- 2:45 · ENTRA EN CUALQUIER LADO: una maceta en el balcón, una ventana, un cajón colgado ----
export const HAnywhere: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const spots = [["BALCÓN", 420], ["VENTANA", 960], ["MACETA COLGANTE", 1500]] as const;
  return <>
    <Head tt={tt} kick="LA PLANTA MÁS AGRADECIDA" title="ENTRA EN CUALQUIER LADO" col={RED} />
    {spots.map(([n, x], i) => {
      const k = phys(tt, 0.5 + i * 0.9, 6, 0.5);
      return <div key={i} style={{ opacity: cl(k * 2), transform: `translateY(${(1 - k) * 80}px)` }}>
        {i === 0 && <div style={{ position: "absolute", left: x - 220, top: 700, width: 440, height: 14, background: "#8b8b93" }}>{Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: j * 54, top: -110, width: 8, height: 110, background: "#8b8b93" }} />)}</div>}
        {i === 1 && <div style={{ position: "absolute", left: x - 200, top: 300, width: 400, height: 410, border: "16px solid #d8cdb8", borderRadius: 8, background: "linear-gradient(180deg, rgba(160,210,255,.25), rgba(160,210,255,.05))" }}><div style={{ position: "absolute", left: 176, top: 0, width: 16, height: "100%", background: "#d8cdb8" }} /></div>}
        {i === 2 && <div style={{ position: "absolute", left: x - 2, top: 220, width: 4, height: 330, background: "#9a8a70" }} />}
        <Pot x={x} y={i === 2 ? 540 : 590} w={200} h={130}>{null}</Pot>
        {[-1, 0, 1].map((d) => <Trifol key={d} x={x + d * 46} y={i === 2 ? 550 : 600} s={0.6} p={k} rot={d * 22 + 3 * Math.sin(tt + i)} />)}
        <Berry x={x + 80} y={i === 2 ? 700 : 720} s={0.24 * k} rot={-8} />
        <Tag tt={tt} at={0.9 + i * 0.9} x={x} y={860} txt={n} col={AMB} size={40} />
      </div>;
    })}
  </>;
}}</Stage>;

// ---- 3:25 · ¿QUÉ FRESA ELIGES?: con hombros blancos (no), cosechada verde (no), roja de punta a punta (sí) ----
export const HPick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = [["HOMBROS BLANCOS", 0.55], ["COSECHADA VERDE", 0.2], ["ROJA DE PUNTA A PUNTA", 1]] as const;
  return <>
    <Head tt={tt} kick="PASO 1 · LA FRESA" title="¿CUÁL ELIGES?" col={RED} />
    {c.map(([n, rp], i) => {
      const x = 420 + i * 540, k = phys(tt, 0.4 + i * 0.5, 6, 0.5), v = cl((tt - 2.6 - i * 0.6) / 0.5), win = i === 2;
      return <div key={i}>
        <div style={{ position: "absolute", left: x - 200, top: 250, width: 400, height: 560, borderRadius: 30, background: win && v > 0 ? "rgba(111,227,154,.08)" : "rgba(255,255,255,.03)", border: `3px solid ${win && v > 0 ? GRN : "rgba(255,255,255,.08)"}` }} />
        <Berry x={x} y={500} s={1.05 * k} ripe={rp} rot={(i - 1) * 6 + 3 * Math.sin(tt * 0.7 + i)} />
        <Tag tt={tt} at={1.0 + i * 0.5} x={x} y={740} txt={n} col={win ? GRN : DIM} size={32} />
        {win ? <Ok x={x + 130} y={300} p={v} /> : <X x={x} y={500} p={v} s={220} />}
      </div>;
    })}
  </>;
}}</Stage>;

// ---- 4:05 · LA TIRITA: el cuchillo pela una espiral finita de piel roja con los puntitos ----
export const HPeel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.8, 4.4), n = 16;
  return <>
    <Head tt={tt} kick="LA MANERA DEL CUCHILLO" title="SÓLO LA PIEL, BIEN FINITA" col={RED} />
    <Berry x={640} y={540} s={1.7} cut={0} rot={-6} />
    {Array.from({ length: n }, (_, i) => {
      const k = cl(p * n - i); if (k <= 0) return null;
      const a = i * 0.55, x = 820 + i * 52, y = 470 + Math.sin(a) * 60 + i * 12;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 56, height: 26, borderRadius: 10, background: `linear-gradient(180deg, ${BERRY}, ${BERRY2})`, transform: `rotate(${Math.cos(a) * 30}deg) scale(${k})`, boxShadow: "0 6px 10px rgba(0,0,0,.4)" }}>
        {[10, 26, 42].map((sx) => <div key={sx} style={{ position: "absolute", left: sx, top: 8, width: 6, height: 9, borderRadius: "50%", background: ACH }} />)}
      </div>;
    })}
    <div style={{ position: "absolute", left: 760 + p * 840, top: 420 + p * 180, width: 260, height: 26, borderRadius: "4px 40px 40px 4px", background: "linear-gradient(180deg, #f2f2f6, #9c9ca8)", transform: "rotate(-24deg)", boxShadow: "0 12px 20px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: -110, top: -4, width: 110, height: 34, borderRadius: 10, background: "#3a2a20" }} /></div>
    <Tag tt={tt} at={2.5} x={1200} y={860} txt="COMO PELAR UNA MANZANA, PERO FINO" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 4:30 · LA TIRA SE SECA: sobre la servilleta se encoge, se oscurece y las semillas caen al platito ----
export const HDryStrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const dr = eio(tt, 0.6, 3.2), fall = cl((tt - 3.3) / 1.6), day = Math.min(2, Math.floor(dr * 2.2));
  return <>
    <Head tt={tt} kick="UNO O DOS DÍAS, SIN SOL" title="SE SECA Y LAS SUELTA SOLA" col={AMB} />
    <div style={{ position: "absolute", left: 300, top: 330, width: 900, height: 360, background: "repeating-linear-gradient(45deg, #f5f1ea 0 22px, #ece6dc 22px 44px)", borderRadius: 8, transform: "rotateX(52deg)", transformOrigin: "50% 100%", boxShadow: "0 30px 50px rgba(0,0,0,.4)" }} />
    {[0, 1, 2].map((i) => {
      const w = 520 * (1 - 0.35 * dr), x = 750 - w / 2;
      return <div key={i} style={{ position: "absolute", left: x, top: 420 + i * 70, width: w, height: 30 - 10 * dr, borderRadius: 12, background: `rgb(${Math.round(224 - 90 * dr)},${Math.round(48 - 10 * dr)},${Math.round(58 - 20 * dr)})` }}>
        {Array.from({ length: 12 }, (_, j) => { const f = cl(fall * 1.6 - j * 0.05 - i * 0.1); return <div key={j} style={{ position: "absolute", left: 10 + j * (w - 20) / 12, top: 6 + f * (300 - i * 70) + f * f * 40, width: 7, height: 10, borderRadius: "50%", background: ACH, opacity: 1 - (f > 0.98 ? 0.3 : 0) }} />; })}
      </div>;
    })}
    <div style={{ position: "absolute", left: 560, top: 740, width: 380, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, #fafafa, #c9c9cf)", boxShadow: "0 18px 30px rgba(0,0,0,.45)" }} />
    <div style={{ position: "absolute", left: 1350, top: 330, fontWeight: 900, fontSize: 120, color: AMB }}>DÍA {day}</div>
    <div style={{ position: "absolute", left: 1350, top: 480, width: 420, fontWeight: 800, fontSize: 36, color: DIM, lineHeight: 1.3 }}>LA PULPA SE ENCOGE · LAS SEMILLAS SE SUELTAN CON LA UÑA</div>
  </>;
}}</Stage>;

// ---- 4:50 · LA LICUADORA: perilla en la velocidad 1, cronómetro de 5-6 s; la pulpa se separa, las semillas quedan enteras ----
export const HBlender: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const on = tt > 1.4 && tt < 4.4, sec = cl((tt - 1.4) / 3) * 6, spin = on ? tt * 900 : 0, dial = phys(tt, 0.6, 6, 0.5);
  return <>
    <Head tt={tt} kick="LA MANERA DE LA LICUADORA" title="VELOCIDAD MÁS BAJA" col={AMB} />
    <div style={{ position: "absolute", left: 620, top: 230, width: 300, height: 420, clipPath: "polygon(6% 0, 94% 0, 82% 100%, 18% 100%)", background: "linear-gradient(90deg, rgba(220,240,255,.25), rgba(255,255,255,.08) 50%, rgba(220,240,255,.22))", border: "3px solid rgba(255,255,255,.3)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "62%", background: `linear-gradient(180deg, rgba(235,80,90,.75), rgba(200,40,60,.9))` }} />
      {Array.from({ length: 24 }, (_, i) => { const a = (spin / 180 * Math.PI) * (0.6 + rnd(i)) + i; return <div key={i} style={{ position: "absolute", left: 150 + Math.cos(a) * (20 + rnd(i + 2) * 90) - 4, top: 270 + Math.sin(a) * 50 + rnd(i + 5) * 80, width: 8, height: 11, borderRadius: "50%", background: ACH }} />; })}
    </div>
    <div style={{ position: "absolute", left: 590, top: 650, width: 360, height: 170, borderRadius: "20px 20px 40px 40px", background: "linear-gradient(180deg, #e9e9ee, #9a9aa6)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 140, top: 50, width: 80, height: 80, borderRadius: "50%", background: "#2a2a30", transform: `rotate(${-120 + 40 * dial}deg)` }}><div style={{ position: "absolute", left: 36, top: 6, width: 8, height: 26, borderRadius: 4, background: AMB }} /></div>
      {["0", "1", "2", "3"].map((n, i) => <div key={n} style={{ position: "absolute", left: 120 + i * 40, top: 10, fontWeight: 900, fontSize: 22, color: i === 1 ? AMB : "#555" }}>{n}</div>)}
    </div>
    <div style={{ position: "absolute", left: 1170, top: 330, width: 330, height: 330, borderRadius: "50%", border: "14px solid rgba(255,255,255,.1)" }}>
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: -14, width: 358, height: 358, transform: "rotate(-90deg)" }}><circle cx={50} cy={50} r={46} fill="none" stroke={AMB} strokeWidth={4} strokeDasharray={289} strokeDashoffset={289 * (1 - sec / 6)} /></svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 110, color: TX }}>{sec.toFixed(0)}s</div>
    </div>
    <Tag tt={tt} at={4.5} x={1335} y={760} txt="5-6 SEGUNDOS, NO UN LICUADO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 5:35 · ENJUAGAR: el vaso en tres vueltas; el agua se aclara y las semillas buenas quedan en el fondo ----
export const HRinse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="AGUA LIMPIA, REVOLVER, REPOSAR" title="DOS O TRES VUELTAS" col={ICE} />
  {[0, 1, 2].map((i) => {
    const x = 480 + i * 480, k = phys(tt, 0.5 + i * 1.1, 6, 0.5), murk = [0.85, 0.45, 0.08][i];
    return <div key={i} style={{ opacity: cl(k * 2), transform: `translateY(${(1 - k) * 60}px)` }}>
      <div style={{ position: "absolute", left: x - 120, top: 300, width: 240, height: 380, clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)", background: "rgba(220,240,255,.12)", border: "3px solid rgba(255,255,255,.35)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "80%", background: `linear-gradient(180deg, rgba(${Math.round(230 - 60 * (1 - murk))},${Math.round(120 + 100 * (1 - murk))},${Math.round(130 + 110 * (1 - murk))},${0.25 + murk * 0.6}), rgba(200,230,255,.25))` }} />
        {Array.from({ length: Math.round(18 * murk) }, (_, j) => <div key={j} style={{ position: "absolute", left: 20 + rnd(j + i * 20) * 190, top: 90 + rnd(j + 4) * 40 + 4 * Math.sin(tt * 2 + j), width: 16, height: 8, borderRadius: 4, background: "rgba(240,90,100,.85)" }} />)}
        {Array.from({ length: 22 }, (_, j) => <div key={j} style={{ position: "absolute", left: 40 + rnd(j * 3 + 1) * 150, bottom: 6 + rnd(j * 5) * 18, width: 8, height: 11, borderRadius: "50%", background: ACH }} />)}
      </div>
      <Tag tt={tt} at={0.9 + i * 1.1} x={x} y={740} txt={`VUELTA ${i + 1}`} col={i === 2 ? GRN : DIM} size={38} />
    </div>;
  })}
  <Tag tt={tt} at={4.4} x={960} y={850} txt="AL FONDO, SÓLO SEMILLAS LIMPIAS" col={ICE} size={44} />
</>}</Stage>;

// ---- 6:25 · EL FRENO DE LA NATURALEZA: la semilla cae en otoño, espera el invierno y brota en primavera (rueda de estaciones) ----
export const HSeasons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const rot = eio(tt, 0.8, 4.6) * 240, S = [["OTOÑO", "#d9822b"], ["INVIERNO", "#9fd3ff"], ["PRIMAVERA", "#6fe39a"]] as const, now = Math.min(2, Math.floor(rot / 90 + 0.3));
  return <>
    <Head tt={tt} kick="LATENCIA" title="LA SEMILLA ESPERA EL INVIERNO" col={ICE} />
    <div style={{ position: "absolute", left: 460, top: 230, width: 600, height: 600, borderRadius: "50%", transform: `rotate(${-rot}deg)`, background: "conic-gradient(from -45deg, rgba(217,130,43,.35) 0 90deg, rgba(159,211,255,.35) 90deg 180deg, rgba(111,227,154,.35) 180deg 270deg, rgba(255,220,120,.25) 270deg 360deg)", border: "4px solid rgba(255,255,255,.15)" }}>
      {S.map(([n, c], i) => <div key={n} style={{ position: "absolute", left: 300, top: 300, transform: `rotate(${i * 90}deg) translateY(-240px) rotate(${-i * 90 + rot}deg)`, transformOrigin: "0 0" }}><div style={{ transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 34, color: c, whiteSpace: "nowrap" }}>{n}</div></div>)}
    </div>
    <div style={{ position: "absolute", left: 745, top: 190, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `28px solid ${TX}` }} />
    <div style={{ position: "absolute", left: 1220, top: 600, width: 480, height: 150, background: `linear-gradient(180deg, ${now === 1 ? "#e9f4ff" : SOIL}, ${SOIL2})`, borderRadius: 10 }} />
    <Seed x={1460} y={598} s={3} />
    <Sprout x={1460} y={600} p={now === 2 ? cl((rot - 170) / 60) : 0} s={2.6} />
    <Big x={1460} y={360} txt={S[now][0]} s={1} col={S[now][1]} size={80} />
    <Tag tt={tt} at={1.2} x={1460} y={820} txt={now === 2 ? "AHORA SÍ: ES SEGURO BROTAR" : "TODAVÍA NO..."} col={now === 2 ? GRN : DIM} size={36} />
  </>;
}}</Stage>;

// ---- 7:25 · LA HELADERA EN CORTE: congelador (no), estantes, y el cajón de las verduras con el sobre a 2-5 °C ----
export const HFridge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const op = eio(tt, 0.4, 1.6), x = cl((tt - 1.8) / 0.5), env = phys(tt, 2.6, 6, 0.5), glow = cl((tt - 3.4) / 0.6);
  return <>
    <Head tt={tt} kick="UN INVIERNO FALSO" title="EN EL CAJÓN DE LAS VERDURAS" col={ICE} />
    <div style={{ position: "absolute", left: 620, top: 190, width: 480, height: 740, borderRadius: 26, background: "linear-gradient(90deg, #e8edf2, #c7cfd8)", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 20, height: 170, borderRadius: 12, background: "linear-gradient(180deg, #dff2ff, #b6dcf5)" }}><div style={{ position: "absolute", left: 20, top: 16, fontWeight: 900, fontSize: 30, color: "#4a6f8c" }}>CONGELADOR −18°</div></div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 210, bottom: 20, borderRadius: 12, background: `linear-gradient(180deg, rgba(255,250,230,${0.5 + 0.4 * op}), #f2f0e8)` }}>
        {[120, 240].map((y) => <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 6, background: "rgba(150,170,190,.6)" }} />)}
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, height: 170, borderRadius: 12, background: "rgba(190,230,200,.5)", border: `4px solid ${glow > 0 ? ICE : "rgba(120,160,140,.5)"}`, boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${ICE}` : undefined }}>
          <div style={{ position: "absolute", left: 120 - (1 - env) * 300, top: 40, width: 150, height: 100, background: "#f4ecd8", borderRadius: 6, transform: `rotate(${-6 + (1 - env) * 20}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.3)", opacity: cl(env * 2) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 50, clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "#e2d7bd" }} /><div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: "#6b5a3a" }}>FRESA · 14 DÍAS</div>
          </div>
        </div>
      </div>
    </div>
    <X x={860} y={290} p={x} s={200} />
    <Big x={1460} y={720} txt="2-5 °C" s={glow} col={ICE} size={130} />
    <Tag tt={tt} at={1.9} x={1460} y={330} txt="EN EL CONGELADOR, NO" col={RED} size={44} />
    <Tag tt={tt} at={3.6} x={1460} y={560} txt="14 DÍAS · HASTA 4 SEMANAS" col={ICE} size={40} />
  </>;
}}</Stage>;

// ---- 8:50 · JUNTAS = PAREJAS: bandeja sin frío (cinco tamaños) contra con frío (todas iguales) ----
export const HEven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const g = eio(tt, 0.6, 3.6), v = cl((tt - 3.8) / 0.6);
  return <>
    <Head tt={tt} kick="LO QUE YO VI" title="BROTAN JUNTAS, CRECEN PAREJAS" col={GRN} />
    {[0, 1].map((b) => {
      const x = b ? 1380 : 540;
      return <div key={b}>
        <Tray x={x} y={600} w={600} h={120}>{null}</Tray>
        {Array.from({ length: 14 }, (_, i) => { const p = b ? g : cl(g * (0.2 + rnd(i) * 1.2) - rnd(i + 4) * 0.4); const hide = !b && rnd(i + 9) > 0.55; return hide ? null : <Sprout key={i} x={x - 270 + i * 40} y={628} p={p} s={1.15} tall={b ? 1 : 0.6 + rnd(i) * 0.9} lean={3 * Math.sin(tt + i)} />; })}
        <Tag tt={tt} at={0.8 + b * 0.6} x={x} y={800} txt={b ? "CON 2 SEMANAS DE FRÍO" : "SIN FRÍO"} col={b ? ICE : DIM} size={40} />
        {b ? <Ok x={x} y={330} p={v} s={1.1} /> : <X x={x} y={420} p={v} s={180} />}
      </div>;
    })}
    <Tag tt={tt} at={4.4} x={960} y={900} txt="TODAS EL MISMO DÍA · TODAS EL MISMO CUIDADO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 9:10 · QUÉ SIRVE DE BANDEJA: almácigo, bandeja del súper, caja de huevos, vasito de yogur; la gota sale por abajo ----
export const HContainers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const N = ["ALMÁCIGO", "BANDEJA DEL SÚPER", "CAJA DE HUEVOS", "VASITO DE YOGUR"];
  return <>
    <Head tt={tt} kick="CUALQUIER COSA BAJITA" title="CON AGUJEROS ABAJO" col={AMB} />
    {N.map((n, i) => {
      const x = 330 + i * 420, k = phys(tt, 0.4 + i * 0.6, 6, 0.5), d = ((tt - 2.4 - i * 0.3) % 1.4 + 1.4) % 1.4;
      return <div key={i} style={{ opacity: cl(k * 2), transform: `translateY(${(1 - k) * -90}px)` }}>
        {i === 0 && <div style={{ position: "absolute", left: x - 150, top: 500, width: 300, height: 110, background: "#1f1f22", borderRadius: 6, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, padding: 8 }}>{Array.from({ length: 4 }, (_, j) => <div key={j} style={{ background: SOIL, borderRadius: 4 }} />)}</div>}
        {i === 1 && <div style={{ position: "absolute", left: x - 150, top: 500, width: 300, height: 110, background: "rgba(220,235,240,.5)", border: "3px solid rgba(255,255,255,.6)", borderRadius: 10 }}><div style={{ position: "absolute", left: 8, right: 8, top: 20, bottom: 8, background: SOIL, borderRadius: 6 }} /></div>}
        {i === 2 && <div style={{ position: "absolute", left: x - 150, top: 500, width: 300, height: 110, background: "#b9a98c", borderRadius: 10, display: "flex", gap: 8, padding: 10 }}>{Array.from({ length: 3 }, (_, j) => <div key={j} style={{ flex: 1, background: SOIL, borderRadius: "40% 40% 10px 10px" }} />)}</div>}
        {i === 3 && <div style={{ position: "absolute", left: x - 70, top: 450, width: 140, height: 160, clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)", background: "linear-gradient(90deg, #f4f4f4, #d6d6d6)" }}><div style={{ position: "absolute", left: 6, right: 6, top: 20, bottom: 6, background: SOIL }} /></div>}
        {tt > 2.4 + i * 0.3 && <div style={{ position: "absolute", left: x - 7, top: 616 + d * 120, width: 14, height: 20, borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%", background: ICE, opacity: 1 - d / 1.4 }} />}
        <Tag tt={tt} at={0.8 + i * 0.6} x={x} y={820} txt={n} col={TX} size={30} />
      </div>;
    })}
    <Tag tt={tt} at={4.2} x={960} y={330} txt="4-5 CM DE TIERRA · QUE DRENE" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 9:40 · LA COSTRA: en tierra del jardín el brote choca con la costra; en sustrato liviano sale derecho ----
export const HCrust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const g = eio(tt, 0.8, 4.0), push = Math.min(g, 0.45);
  return <>
    <Head tt={tt} kick="TIERRA DEL JARDÍN, NO" title="LA COSTRA NO LA DEJA SALIR" col={RED} />
    {[0, 1].map((b) => {
      const x = b ? 1380 : 540;
      return <div key={b}>
        <div style={{ position: "absolute", left: x - 280, top: 430, width: 560, height: 360, borderRadius: 14, background: b ? "radial-gradient(circle at 30% 30%, #6b4a33 0 3px, transparent 4px), radial-gradient(circle at 70% 60%, #4a3020 0 4px, transparent 5px), #5b3f2b" : "#4a3628", backgroundSize: b ? "26px 26px" : undefined }} />
        {!b && <div style={{ position: "absolute", left: x - 280, top: 430, width: 560, height: 36, borderRadius: "14px 14px 0 0", background: "repeating-linear-gradient(90deg, #8a6d55 0 40px, #6e5644 40px 44px)" }} />}
        <Seed x={x} y={600} s={2.4} />
        {b ? <Sprout x={x} y={600} p={g} s={3} tall={2.6} /> : <div style={{ position: "absolute", left: x - 3, top: 600 - 150 * push, width: 6, height: 150 * push, background: "#c9d9a0", borderRadius: 3, transform: g > 0.45 ? `rotate(${(g - 0.45) * 160}deg)` : undefined, transformOrigin: "50% 100%" }} />}
        <Tag tt={tt} at={1 + b * 0.6} x={x} y={850} txt={b ? "SUSTRATO LIVIANO" : "TIERRA DEL JARDÍN"} col={b ? GRN : RED} size={40} />
        {b ? <Ok x={x + 220} y={350} p={cl((tt - 4.2) / 0.5)} /> : <X x={x} y={440} p={cl((tt - 3.4) / 0.5)} s={140} />}
      </div>;
    })}
  </>;
}}</Stage>;

// ---- 10:15 · EL PUÑADO: seco se desarma, encharcado gotea, el justo queda armado como un bollo ----
export const HSqueeze: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Head tt={tt} kick="EL SUSTRATO SE MOJA ANTES" title="LA PRUEBA DEL PUÑADO" col={AMB} />
  {["SECO", "ENCHARCADO", "JUSTO"].map((n, i) => {
    const x = 420 + i * 540, k = phys(tt, 0.4 + i * 0.9, 6, 0.5), sq = eio(tt, 0.9 + i * 0.9, 1.6 + i * 0.9), ok = i === 2;
    return <div key={i} style={{ opacity: cl(k * 2) }}>
      {/* el bollo de tierra, apretado */}
      <div style={{ position: "absolute", left: x - 110 + sq * 10, top: 420 + sq * 10, width: 220 - sq * 20, height: 180 - sq * 30, borderRadius: i === 0 ? "40% 30% 45% 35%" : "50%", background: i === 0 ? "#8c6b4f" : i === 1 ? "#2f1f15" : SOIL, boxShadow: i === 1 ? "inset 0 0 30px rgba(120,180,255,.35)" : "inset -10px -10px 20px rgba(0,0,0,.35)" }} />
      {i === 0 && Array.from({ length: 12 }, (_, j) => { const f = cl(sq * 1.4 - j * 0.04); return <div key={j} style={{ position: "absolute", left: x - 90 + rnd(j) * 180, top: 560 + f * 160 + rnd(j + 2) * 20, width: 14, height: 12, borderRadius: 4, background: "#8c6b4f", opacity: f > 0 ? 1 : 0 }} />; })}
      {i === 1 && sq > 0.3 && Array.from({ length: 4 }, (_, j) => { const d = ((tt * 1.4 + j * 0.3) % 1); return <div key={j} style={{ position: "absolute", left: x - 40 + j * 26, top: 590 + d * 150, width: 12, height: 18, borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%", background: ICE, opacity: 1 - d }} />; })}
      <Tag tt={tt} at={0.8 + i * 0.9} x={x} y={800} txt={n} col={ok ? GRN : RED} size={44} />
      {ok ? <Ok x={x} y={330} p={cl((tt - 3.4) / 0.5)} /> : <X x={x} y={500} p={cl((tt - 2.0 - i * 0.9) / 0.5)} s={120} />}
    </div>;
  })}
</>}</Stage>;

// ---- 10:50 · NECESITAN LUZ: enterrada a 1 cm queda a oscuras; apoyada arriba recibe los rayos y brota ----
export const HLight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ray = cl((tt - 0.8) / 0.8), g = eio(tt, 2.2, 4.6);
  return <>
    <Head tt={tt} kick="EL DETALLE QUE CASI NADIE SABE" title="NO SE ENTIERRAN" col={ACH} />
    {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 220, top: 160, width: 30, height: 380 * ray, background: "linear-gradient(180deg, rgba(255,230,150,.0), rgba(255,230,150,.35))", transform: `rotate(${(i - 3) * 4}deg)`, transformOrigin: "50% 0" }} />)}
    <div style={{ position: "absolute", left: 180, top: 560, width: 1560, height: 300, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 960, top: 560, width: 3, height: 300, background: "rgba(255,255,255,.12)" }} />
    <Seed x={560} y={650} s={2.6} op={0.7} />
    <div style={{ position: "absolute", left: 470, top: 590, width: 180, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.4), transparent 70%)" }} />
    <div style={{ position: "absolute", left: 580, top: 600, fontWeight: 900, fontSize: 28, color: DIM }}>1 CM</div>
    <div style={{ position: "absolute", left: 556, top: 560, width: 4, height: 90, background: "repeating-linear-gradient(180deg, #ddd 0 8px, transparent 8px 14px)" }} />
    <Seed x={1360} y={556} s={2.6} glow={ray * 0.8} />
    <Sprout x={1360} y={556} p={g} s={2.8} />
    <Tag tt={tt} at={1.6} x={560} y={800} txt="ENTERRADA: NO BROTA" col={RED} size={40} />
    <Tag tt={tt} at={2.4} x={1360} y={800} txt="ARRIBA, APENAS APRETADA" col={GRN} size={40} />
    <X x={560} y={650} p={cl((tt - 3.2) / 0.5)} s={130} />
  </>;
}}</Stage>;

// ---- 11:10 · EL PALILLO: toca, se pega, se apoya; grilla de un centímetro que se va llenando ----
export const HToothpick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const n = Math.floor(cl((tt - 0.8) / 4.4) * 30), cx = 520 + (n % 10) * 90, cy = 420 + Math.floor(n / 10) * 90, bob = Math.abs(Math.sin(tt * 6.8));
  return <>
    <Head tt={tt} kick="LENTO, PERO PERFECTO" title="UNA POR UNA, CON UN PALILLO" col={AMB} />
    <div style={{ position: "absolute", left: 460, top: 360, width: 1000, height: 340, borderRadius: 14, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    {Array.from({ length: 30 }, (_, i) => i < n ? <Seed key={i} x={520 + (i % 10) * 90} y={420 + Math.floor(i / 10) * 90} s={1.5} /> : <div key={i} style={{ position: "absolute", left: 516 + (i % 10) * 90, top: 416 + Math.floor(i / 10) * 90, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />)}
    <div style={{ position: "absolute", left: cx - 4, top: cy - 330 - bob * 30, width: 8, height: 320, borderRadius: 4, background: "linear-gradient(90deg, #e8d3a6, #c6a76d)", transform: "rotate(14deg)", transformOrigin: "50% 100%" }} />
    <div style={{ position: "absolute", left: 520, top: 760, width: 90, height: 4, background: AMB }} /><div style={{ position: "absolute", left: 535, top: 772, fontWeight: 900, fontSize: 28, color: AMB }}>1 CM</div>
    <Tag tt={tt} at={1.2} x={1150} y={840} txt="PUNTA MOJADA: LA SEMILLA SE PEGA" col={TX} size={38} />
  </>;
}}</Stage>;
