// rh29a · componentes únicos 17-29 (min 14-25).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PAPER = "#f3ecdc", INK = "#2b2620", MEAT = "#e89a8c";
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;

// ---- 14:00 · LA CUCHARA: la sartén se inclina, la manteca se junta y la cuchara la vuelca en arco sobre la chuleta (5 pasadas) ----
export const HBaste: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tilt = eio(tt, 0.4, 1.4), cyc = Math.max(0, tt - 1.5), ph = (cyc % 1.1) / 1.1, n = Math.min(5, Math.floor(cyc / 1.1) + (cyc > 0 ? 1 : 0));
  const sx = 1200 - 420 * eio(ph, 0, 0.5) , sy = 760 - 260 * Math.sin(ph * Math.PI);
  return <>
    <div style={{ position: "absolute", left: 960, top: 640, transform: `translate(-50%,-50%) rotate(${-9 * tilt}deg)` }}>
      <svg width={1100} height={420} viewBox="0 0 1100 420">
        <ellipse cx={480} cy={210} rx={440} ry={170} fill="#1a1a1c" stroke="#333" strokeWidth={16} />
        <ellipse cx={480 + 220 * tilt} cy={250} rx={200 + 40 * tilt} ry={90} fill="rgba(230,190,90,.55)" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={620 + (i * 47) % 200} cy={230 + (i * 31) % 60} r={8 + (i % 3) * 4} fill="rgba(255,240,200,.6)" opacity={0.5 + 0.5 * Math.sin(tt * 6 + i)} />)}
        <path d="M250 150 C 250 90 330 70 400 75 C 470 80 520 120 512 170 C 504 230 430 250 360 245 C 290 240 250 210 250 150 Z" fill="#8a4a22" />
        <rect x={900} y={190} width={200} height={40} rx={18} fill="#1a1a1c" />
      </svg>
    </div>
    {cyc > 0 && <div style={{ position: "absolute", left: sx, top: sy, width: 150, height: 70, borderRadius: "50%", background: "radial-gradient(#d8d8dc,#8b8b90)", transform: `rotate(${-30 + 70 * ph}deg)`, boxShadow: sh(10) }} />}
    {cyc > 0 && ph > 0.45 && ph < 0.8 && <div style={{ position: "absolute", left: sx + 20, top: sy + 50, width: 110, height: 140, background: "linear-gradient(180deg,rgba(240,200,110,.9),rgba(240,200,110,0))", borderRadius: "40% 40% 50% 50%", filter: "blur(2px)" }} />}
    <div style={{ position: "absolute", left: 1500, top: 280, fontWeight: 900, fontSize: 110, color: AMB }}>{n}×</div>
    <Tag tt={tt} at={0.5} x={420} y={240} txt="BUTTER · GARLIC · THYME" col={TX} size={46} anchor="l" />
    <Tag tt={tt} at={5.0} x={960} y={930} txt="ONLY AT THE END" col={GRN} size={52} />
  </>;
}}</Stage>;

// ---- 14:53 · TABLA FRÍA vs PLATO TIBIO: dos chuletas; bajo la de la tabla crece un charco, bajo la del plato no ----
export const HPuddle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = eio(tt, 1.2, 4.6);
  const chop = <div style={{ width: 380, height: 260, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(ellipse at 40% 40%, #a8622f, #6e3a18)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />;
  return <>
    <div style={{ position: "absolute", left: 180, top: 360, width: 700, height: 460, borderRadius: 24, background: "linear-gradient(135deg,#d9b27a,#b98c55)", boxShadow: sh(30) }}>
      <div style={{ position: "absolute", left: 90, top: 130, width: 520 * (0.6 + 0.4 * p), height: 280 * (0.6 + 0.4 * p), borderRadius: "50%", background: "rgba(170,60,50,.55)", filter: "blur(4px)", opacity: p }} />
      <div style={{ position: "absolute", left: 160, top: 100 }}>{chop}</div>
    </div>
    <div style={{ position: "absolute", left: 1080, top: 340, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,#ffffff 55%,#e8e4dc 56%,#f6f3ee 70%)", boxShadow: `${sh(30)}, 0 0 ${60 * p}px rgba(255,170,90,${0.35 * p})` }}>
      <div style={{ position: "absolute", left: 120, top: 180 }}>{chop}</div>
    </div>
    <Tag tt={tt} at={0.4} x={530} y={290} txt="COLD MAPLE BOARD" col={ICE} size={42} />
    <Tag tt={tt} at={0.7} x={1390} y={290} txt="WARM PLATE" col={AMB} size={42} />
    <Tag tt={tt} at={4.2} x={530} y={880} txt="JUICE ON THE BOARD" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 15:25 · EL MAPA DE CALOR: el corte por dentro; el jugo empujado al centro (rojo) se reparte hacia los bordes en 5 min ----
export const HRelax: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r = eio(tt, 1.0, 4.6), m = Math.round(5 * r);
  return <>
    <Head tt={tt} kick="NUMBER TEN" title="FIVE MINUTES" />
    <div style={{ position: "absolute", left: 960 - 520, top: 380, width: 1040, height: 360, borderRadius: 120, overflow: "hidden", boxShadow: sh(30),
      background: `radial-gradient(ellipse ${30 + 70 * r}% ${40 + 60 * r}% at 50% 50%, rgba(220,60,60,${0.95 - 0.45 * r}), ${MEAT} ${60 + 30 * r}%, #c98a7a)` }}>
      <div style={{ position: "absolute", inset: 0, border: "26px solid #7a3e1a", borderRadius: 120 }} />
    </div>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2, d = 60 + 300 * r; return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(a) * d * 1.3, top: 560 + Math.sin(a) * d * 0.4, width: 22, height: 22, borderRadius: "50%", background: "rgba(255,120,110,.8)", opacity: 1 - r * 0.7 }} />; })}
    <div style={{ position: "absolute", left: 960, top: 820, transform: "translateX(-50%)", fontWeight: 900, fontSize: 100, color: TX, fontVariantNumeric: "tabular-nums" }}>{m}:00</div>
    <Tag tt={tt} at={4.4} x={960} y={970} txt="THE JUICE STAYS IN" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 15:57 · EL SOBRE DE WALT: un sobre lacrado cae, el lacre se rompe y asoma la tarjeta con el truco Nº 11 ----
export const HEnvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = phys(tt, 0.2, 4.5, 0.45), op = eio(tt, 1.8, 2.8), card = eio(tt, 2.6, 3.8);
  return <>
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) translateY(${(1 - f) * -700}px) rotate(${-3 + (1 - f) * 15}deg)` }}>
      <div style={{ position: "relative", width: 820, height: 500 }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 40 - 300 * card, height: 380, background: PAPER, borderRadius: 8, boxShadow: sh(20), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: INK }}>
          <div style={{ fontFamily: MARK, fontSize: 120, color: "#b2261b" }}>Nº 11</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60 }}>Walt's trick</div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#cdb38a,#a98c60)", borderRadius: 10, boxShadow: sh(40), clipPath: "polygon(0 22%, 50% 62%, 100% 22%, 100% 100%, 0 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 320, background: "linear-gradient(180deg,#b99c70,#a2865b)", clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformOrigin: "50% 0", transform: `perspective(1200px) rotateX(${-170 * op}deg)`, zIndex: op > 0.5 ? 0 : 2 }} />
        <div style={{ position: "absolute", left: 360, top: 260, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(#c23a2e,#7a1a12)", boxShadow: "0 6px 14px rgba(0,0,0,.5)", opacity: 1 - op, transform: `scale(${1 + 0.3 * op}) rotate(${40 * op}deg)`, zIndex: 3 }} />
      </div>
    </div>
    <Tag tt={tt} at={3.6} x={960} y={950} txt="IT COSTS NOTHING" col={AMB} size={54} />
  </>;
}}</Stage>;

// ---- 17:40 · LA HELADERA: la puerta se abre, la rejilla con las chuletas sin tapar y el aire frío que da la vuelta por debajo ----
export const HFridge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const op = eio(tt, 0.4, 1.6), air = Math.max(0, tt - 1.6);
  return <>
    <div style={{ position: "absolute", left: 560, top: 140, width: 800, height: 860, borderRadius: 26, background: "linear-gradient(180deg,#e9eef2,#c9d1d8)", boxShadow: sh(40), perspective: 1800 }}>
      <div style={{ position: "absolute", inset: 28, borderRadius: 14, background: "linear-gradient(180deg,#f8fbff,#dfe8f1)", boxShadow: "inset 0 0 60px rgba(160,200,255,.6)" }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 360, height: 8, background: "#b7c3cf" }} />
        <div style={{ position: "absolute", left: 120, right: 120, top: 300, height: 60, background: "repeating-linear-gradient(90deg,#9aa3ad 0 4px,transparent 4px 28px)", borderTop: "4px solid #9aa3ad" }} />
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 170 + i * 250, top: 230, width: 200, height: 80, borderRadius: "48% 52% 44% 56%", background: "radial-gradient(ellipse at 40% 40%, #d98a7c, #b86b5e)", boxShadow: "0 10px 20px rgba(0,0,0,.25)", filter: `saturate(${1 - 0.3 * cl(air / 4)}) brightness(${1 - 0.15 * cl(air / 4)})` }} />)}
        <svg width={744} height={804} style={{ position: "absolute", left: 0, top: 0 }}>
          {[0, 1, 2].map((i) => { const o = ((air * 0.35 + i / 3) % 1); return <path key={i} d="M 120 200 C 300 140 460 140 620 200 C 700 260 660 420 560 420 C 400 430 300 430 160 420 C 90 400 80 260 120 200" fill="none" stroke="rgba(120,180,255,.7)" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="0.12 0.88" strokeDashoffset={-o} opacity={cl(air)} />; })}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 860, borderRadius: 26, background: "linear-gradient(90deg,#f1f4f7,#d3dbe2)", transformOrigin: "100% 50%", transform: `rotateY(${100 * op}deg)`, boxShadow: sh(20), backfaceVisibility: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 300, width: 20, height: 240, borderRadius: 10, background: "#9aa3ad" }} />
      </div>
    </div>
    <Tag tt={tt} at={1.8} x={1560} y={420} txt="UNCOVERED" col={ICE} size={52} />
    <Tag tt={tt} at={2.6} x={1560} y={520} txt="ON A RACK" col={TX} size={52} />
    <Tag tt={tt} at={3.4} x={1560} y={620} txt="ONE NIGHT" col={AMB} size={52} />
  </>;
}}</Stage>;

// ---- 18:36 · LA NOCHE EN LA HELADERA: una línea de tiempo 8 pm → 8 am; las gotas de la superficie se evaporan y la carne se pone mate ----
export const HNight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 80% 70% at 50% 40%, #182030, #06080c 75%)">{(tt) => {
  const s = eio(tt, 0.6, 4.6), hr = 20 + Math.round(12 * s), lab = `${((hr - 1) % 12) + 1} ${hr % 24 >= 12 ? "PM" : "AM"}`;
  return <>
    <div style={{ position: "absolute", left: 240, top: 220, width: 1440, height: 8, borderRadius: 4, background: "rgba(255,255,255,.15)" }} />
    <div style={{ position: "absolute", left: 240, top: 220, width: 1440 * s, height: 8, borderRadius: 4, background: ICE }} />
    <div style={{ position: "absolute", left: 240 + 1440 * s, top: 224, transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: "50%", background: s < 0.85 ? "#e9e6c9" : AMB, boxShadow: `0 0 40px ${s < 0.85 ? "rgba(233,230,201,.7)" : "rgba(255,178,87,.8)"}` }} />
    <div style={{ position: "absolute", left: 960, top: 300, transform: "translateX(-50%)", fontWeight: 900, fontSize: 90, color: TX, fontVariantNumeric: "tabular-nums" }}>{lab}</div>
    <div style={{ position: "absolute", left: 960 - 330, top: 480, width: 660, height: 380, borderRadius: "46% 54% 44% 56%", background: `radial-gradient(ellipse at 40% 40%, rgb(${217 - 30 * s},${138 - 30 * s},${124 - 30 * s}), rgb(${184 - 30 * s},${107 - 25 * s},${94 - 20 * s}))`, boxShadow: sh(30) }}>
      {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + (i * 97) % 480, top: 60 + (i * 61) % 250, width: 22, height: 16, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, rgba(200,225,255,.5))", opacity: cl(1 - s * 1.6 + (i % 5) * 0.05) }} />)}
    </div>
    <Tag tt={tt} at={4.4} x={960} y={950} txt="DRY · TACKY · DARKER" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 19:36 · EL FIN DE SEMANA: tres hojas de calendario (vie · sáb · dom) caen y en cada una se escribe la tarea ----
export const HWeekend: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D: [string, string, string, number][] = [["FRI", "Buy 2 thick chops", "the butcher", 0.4], ["SAT", "Brine 1 hr · dry · rack", "5 PM", 2.6], ["SUN", "Sear · baste · rest", "6 PM", 5.2]];
  return <>
    {D.map(([d, a, b, at], i) => { const k = phys(tt, at, 5, 0.45), w = cl((tt - at - 0.6) * 1.2); return <div key={d} style={{ position: "absolute", left: 260 + i * 490, top: 300, transform: `translateY(${(1 - k) * -700}px) rotate(${(i - 1) * 3 + (1 - k) * 18}deg)`, opacity: cl(k * 3) }}>
      <div style={{ width: 420, height: 520, background: PAPER, borderRadius: 12, boxShadow: sh(40), overflow: "hidden", color: INK }}>
        <div style={{ height: 120, background: "#b2261b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 80, letterSpacing: 6 }}>{d}</div>
        <div style={{ padding: "30px 30px", fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.15, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{a}</div>
        <div style={{ position: "absolute", left: 30, bottom: 30, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#7a6f5a", opacity: w }}>{b}</div>
      </div>
    </div>; })}
    <Head tt={tt} kick="THE WHOLE ROUTINE" title="START TO FINISH" />
  </>;
}}</Stage>;

// ---- 20:50 · LOS SELLOS «NEVER»: cuatro objetos (tenedor, tapa, aceite caro, canilla) y el sello rojo que cae sobre cada uno ----
export const HNever: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const O: [string, number, React.ReactNode][] = [
    ["A FORK", 0.6, <svg width={200} height={200} viewBox="0 0 200 200"><rect x={92} y={90} width={16} height={100} rx={8} fill="#c9ced3" />{[60, 80, 100, 120, 140].slice(0, 4).map((x) => <rect key={x} x={x - 4 + 10} y={10} width={10} height={90} rx={5} fill="#c9ced3" />)}<rect x={66} y={80} width={72} height={24} rx={10} fill="#c9ced3" /></svg>],
    ["A LID", 2.0, <svg width={200} height={200} viewBox="0 0 200 200"><ellipse cx={100} cy={120} rx={90} ry={34} fill="#9aa3ad" /><ellipse cx={100} cy={110} rx={90} ry={30} fill="#c9ced3" /><rect x={84} y={70} width={32} height={26} rx={8} fill="#2b2b2e" /></svg>],
    ["FANCY OIL", 3.4, <svg width={200} height={200} viewBox="0 0 200 200"><rect x={70} y={60} width={60} height={130} rx={14} fill="#4f6b2a" /><rect x={86} y={20} width={28} height={44} rx={6} fill="#4f6b2a" /><rect x={78} y={110} width={44} height={40} fill="#efe3c8" /></svg>],
    ["THE SINK", 4.8, <svg width={200} height={200} viewBox="0 0 200 200"><path d="M40 80 L160 80 L150 170 L50 170 Z" fill="#c9ced3" /><path d="M100 20 L100 60 L140 60" stroke="#9aa3ad" strokeWidth={14} fill="none" strokeLinecap="round" />{[0, 1, 2].map((i) => <rect key={i} x={136} y={70 + ((tt * 140 + i * 30) % 90)} width={6} height={16} rx={3} fill="rgba(160,200,255,.9)" />)}</svg>]];
  return <>
    <Head tt={tt} kick="WHAT WALT" title="NEVER DID" col={RED} />
    {O.map(([n, at, svg], i) => { const k = phys(tt, at - 0.4, 6, 0.5), st = phys(tt, at + 0.5, 8, 0.35); return <div key={n} style={{ position: "absolute", left: 230 + i * 390, top: 360, width: 320, height: 420, transform: `translateY(${(1 - k) * 400}px)`, opacity: cl(k * 3) }}>
      <div style={{ width: 320, height: 320, borderRadius: 30, background: "radial-gradient(circle at 50% 40%, #2c2a26, #151412)", boxShadow: sh(30), display: "flex", alignItems: "center", justifyContent: "center" }}>{svg}</div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 40, marginTop: 24 }}>{n}</div>
      <div style={{ position: "absolute", left: 30, top: 110, fontFamily: MARK, fontSize: 62, color: RED, border: `6px solid ${RED}`, borderRadius: 12, padding: "0 16px", transform: `rotate(-14deg) scale(${Math.max(0.0001, 2.2 - 1.2 * st)})`, opacity: cl(st * 3) }}>NEVER</div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 21:57 · EL TABLERO DE CORCHO: las preguntas del mostrador, escritas en tickets de carnicería, se clavan con chinche ----
export const HCork: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #2a2118, #0c0907 75%)">{(tt) => {
  const Q: [string, number][] = [["Frozen chops?", 0.6], ["No cast iron?", 2.2], ["Shoulder steak?", 3.8], ["Sugar in the brine?", 5.4]];
  return <>
    <div style={{ position: "absolute", left: 220, top: 170, width: 1480, height: 780, borderRadius: 16, background: "radial-gradient(#b7895a,#946a40)", boxShadow: `${sh(30)}, inset 0 0 0 22px #6e4a26` }} />
    <Head tt={tt} kick="ACROSS THE COUNTER" title="YOUR QUESTIONS" />
    {Q.map(([q, at], i) => { const k = phys(tt, at, 6, 0.42); return <div key={q} style={{ position: "absolute", left: 330 + (i % 2) * 680, top: 320 + Math.floor(i / 2) * 300, transform: `translateZ(0) scale(${1.6 - 0.6 * k}) rotate(${(i % 2 ? 3 : -4) + (1 - k) * 10}deg)`, opacity: cl(k * 3) }}>
      <div style={{ width: 580, padding: "28px 34px", background: "#fffdf4", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,.45)", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: INK }}>"Stan, {q}"</div>
      <div style={{ position: "absolute", left: 270, top: -14, width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ff7a6e, #b2261b)", boxShadow: "0 6px 10px rgba(0,0,0,.5)" }} />
    </div>; })}
  </>;
}}</Stage>;

// ---- 22:30 · EL DIAL DEL HORNO: la perilla gira a 400 y la puerta se ilumina por dentro; la sartén entra ----
export const HOven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 0.5, 2.0), glow = eio(tt, 1.6, 3.4), pan = eio(tt, 2.8, 4.2);
  return <>
    <div style={{ position: "absolute", left: 420, top: 220, width: 1080, height: 760, borderRadius: 24, background: "linear-gradient(180deg,#3a3a3f,#202024)", boxShadow: sh(40) }}>
      <div style={{ position: "absolute", left: 120, top: 200, width: 840, height: 480, borderRadius: 18, background: `radial-gradient(ellipse at 50% 60%, rgba(255,${150 + 40 * glow},60,${0.15 + 0.65 * glow}), #0d0d0f 75%)`, border: "14px solid #4a4a50" }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 6, background: "#777" }} />
        <div style={{ position: "absolute", left: 220 + 700 * (1 - pan), top: 230, width: 400, height: 70, borderRadius: 35, background: "#1a1a1c", boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(#e9e9ec,#9a9aa0)", transform: `rotate(${-120 + 240 * r}deg)` }}>
        <div style={{ position: "absolute", left: 64, top: 8, width: 12, height: 50, borderRadius: 6, background: RED }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1560, top: 300, fontWeight: 900, fontSize: 110, color: AMB, fontVariantNumeric: "tabular-nums" }}>{Math.round(200 + 200 * r)}°</div>
    <Tag tt={tt} at={3.2} x={1640} y={470} txt="2-INCH CHOPS" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 22:47 · EL MAPA DEL CERDO: el contorno del animal; se ilumina el LOMO (145) y después la PALETA (185) ----
export const HPig: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = cl((tt - 0.8) * 1.5), b = cl((tt - 2.8) * 1.5);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M420 560 C 420 380 620 300 900 300 C 1180 300 1420 330 1500 430 C 1560 420 1600 470 1580 520 C 1620 600 1560 690 1470 700 L 1440 860 L 1370 860 L 1360 720 L 760 730 L 740 860 L 670 860 L 640 700 C 500 690 420 640 420 560 Z" fill="rgba(240,200,190,.12)" stroke="#f1d9cf" strokeWidth={8} />
      <path d="M760 320 L1240 318 L1250 470 L760 480 Z" fill={GRN} opacity={0.18 + 0.55 * a} stroke={GRN} strokeWidth={6} />
      <path d="M1250 330 C 1380 340 1460 380 1500 440 L 1480 600 L1260 600 Z" fill={AMB} opacity={0.18 + 0.55 * b} stroke={AMB} strokeWidth={6} />
      <circle cx={1530} cy={480} r={10} fill="#f1d9cf" />
    </svg>
    <Tag tt={tt} at={0.9} x={1000} y={260} txt="LOIN · 145°" col={GRN} size={50} />
    <Tag tt={tt} at={2.9} x={1400} y={660} txt="SHOULDER · 185°" col={AMB} size={50} />
    <Tag tt={tt} at={4.2} x={960} y={950} txt="DIFFERENT CUT, DIFFERENT RULE" col={TX} size={44} />
  </>;
}}</Stage>;

// ---- 24:55 · LA BALANZA DE PLATILLOS: $40 del restaurante contra $6 de carnicería + 11 trucos; se inclina y queda pareja ----
export const HBalance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const add = phys(tt, 2.4, 4, 0.35), ang = 14 * (1 - add) * cl(phys(tt, 0.8, 4, 0.35));
  const pan = (x: number, y: number, kids: React.ReactNode) => <div style={{ position: "absolute", left: x - 200, top: y }}>
    <svg width={400} height={260}><line x1={200} y1={0} x2={40} y2={180} stroke="#c9a66b" strokeWidth={4} /><line x1={200} y1={0} x2={360} y2={180} stroke="#c9a66b" strokeWidth={4} /><ellipse cx={200} cy={190} rx={180} ry={34} fill="#c9a66b" /></svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center" }}>{kids}</div>
  </div>;
  const r = (ang * Math.PI) / 180, lx = 960 - 420 * Math.cos(r), ly = 330 + 420 * Math.sin(r), rx = 960 + 420 * Math.cos(r), ry = 330 - 420 * Math.sin(r);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={945} y={330} width={30} height={600} fill="#a8854f" /><rect x={820} y={920} width={280} height={40} rx={10} fill="#a8854f" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#c9a66b" strokeWidth={18} strokeLinecap="round" /><circle cx={960} cy={330} r={24} fill="#e0c48a" />
    </svg>
    {pan(lx, ly, <div style={{ fontWeight: 900, fontSize: 80, color: RED }}>$40</div>)}
    {pan(rx, ry, <div><div style={{ fontWeight: 900, fontSize: 70, color: GRN }}>$6</div><div style={{ fontWeight: 900, fontSize: 34, color: AMB, opacity: cl(add * 2) }}>+ 11 TRICKS</div></div>)}
    <Tag tt={tt} at={4.0} x={960} y={1000} txt="SAME CHOP" col={TX} size={50} />
  </>;
}}</Stage>;

// ---- 25:08 · LA PREGUNTA EN EL TICKET: la máquina de números del mostrador saca un ticket con la pregunta para los comentarios ----
export const HTicket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.6, 2.4), n = 1 + Math.floor(eio(tt, 0.2, 1.0) * 51);
  return <>
    <div style={{ position: "absolute", left: 960 - 260, top: 180, width: 520, height: 220, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(180deg,#c7342a,#8e1f17)", boxShadow: sh(30), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 64, color: "#fff", letterSpacing: 4 }}>NOW SERVING</div>
    <div style={{ position: "absolute", left: 960 - 300, top: 370, width: 600, height: 560 * p, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 600, height: 560, background: "#fff6d8", borderRadius: "0 0 14px 14px", boxShadow: sh(20), padding: "40px 46px", color: INK, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 120, color: "#c7342a", lineHeight: 1 }}>Nº {n}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, lineHeight: 1.1, marginTop: 30 }}>What cut did your family swear by?</div>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4, marginTop: 30, color: "#7a6f5a" }}>TELL ME IN THE COMMENTS</div>
      </div>
    </div>
  </>;
}}</Stage>;
