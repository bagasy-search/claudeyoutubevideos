// mar29a · componentes únicos 15-28 (minuto a minuto). Mecanismos propios, ninguno repetido en la tanda (D:/rtmp/mar29_COMPONENTES.md).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const C: React.FC<{ x?: number; y?: number; children: React.ReactNode }> = ({ x = 960, y = 560, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>{children}</div>;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// 15 · moho: las manchas negras crecen desde las esquinas de la malla
export const HMold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Head tt={tt} kick="BLACK SPOTS IN THE CORNERS" title="THAT'S MOLD" col={GRN} />
  <C x={960} y={590}><div style={{ width: 720, height: 460, border: "22px solid #8d9196", position: "relative", overflow: "hidden", background: "repeating-linear-gradient(45deg, rgba(210,214,218,.55) 0 8px, rgba(120,125,130,.4) 8px 16px)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
    {Array.from({ length: 26 }, (_, i) => { const corner = i % 4, cx = corner % 2 ? 640 : 40, cy = corner > 1 ? 380 : 40;
      const x = cx + (rnd(i) - 0.5) * 260, y = cy + (rnd(i + 9) - 0.5) * 220, r = 60 * rnd(i + 3) * eio(tt, 0.6 + rnd(i + 5) * 2.2, 3.6 + rnd(i) * 1.5);
      return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: i % 3 ? "radial-gradient(circle, #141712 40%, rgba(30,50,25,.6) 70%, transparent)" : "radial-gradient(circle, #2c4426 30%, transparent 72%)" }} />; })}
  </div></C>
  <Tag tt={tt} at={3.4} x={960} y={900} txt="BLOWN INTO YOUR ROOMS" col={RED} size={52} />
</>}</Stage>;

// 16 · la ranura abierta aspira: el polvo del sótano entero corre hacia el agujero
export const HSuction: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <Head tt={tt} kick="NUMBER SEVEN" title="THE MISSING DOOR" col={AMB} />
  <div style={{ position: "absolute", left: 960, top: 560, width: 260, height: 90, transform: "translate(-50%,-50%)", background: "#050505", border: "8px solid #6c6c70", borderRadius: 6, boxShadow: "0 0 0 26px rgba(20,20,20,.7), 0 0 80px rgba(0,0,0,.9)" }} />
  {Array.from({ length: 260 }, (_, i) => {
    const a = rnd(i) * Math.PI * 2, sp = 0.3 + rnd(i + 4) * 0.35, ph = (rnd(i + 8) + tt * sp * eio(tt, 0.4, 1.6)) % 1, R = 900 * (1 - ph);
    const x = 960 + Math.cos(a) * R, y = 560 + Math.sin(a) * R * 0.6, s = 6 + rnd(i + 2) * 14 * (1 - ph * 0.6);
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "rgba(205,190,160,.85)", opacity: cl(ph * 4) * cl((1 - ph) * 8) }} />;
  })}
  <Tag tt={tt} at={2.4} x={960} y={790} txt="DUST GOES STRAIGHT IN" col={RED} size={54} />
</>}</Stage>;

// 17 · dos máscaras a la vez: la barra de aire cae a la mitad por cada capa
export const HTwoMasks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const m2 = phys(tt, 2.2, 6, 0.55), air = lerp(100, 55, eio(tt, 0.9, 1.8)) - 25 * eio(tt, 2.4, 3.6);
  const Mask: React.FC<{ x: number; s: number; d: number }> = ({ x, s, d }) => <div style={{ position: "absolute", left: x, top: 560, width: 380, height: 300, transform: `translate(-50%,-50%) scale(${s})`, borderRadius: "48% 48% 44% 44%", background: `radial-gradient(circle at 50% 40%, #ffffff, #d8d4ca)`, filter: `brightness(${d})`, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }} />;
  return <>
    <Head tt={tt} kick="NUMBER EIGHT" title="TWO FILTERS AT ONCE" col={AMB} />
    <Mask x={760} s={1} d={0.85} />
    {m2 > 0.01 && <Mask x={760 + 160 * m2} s={0.92} d={0.7} />}
    <div style={{ position: "absolute", left: 1330, top: 300, width: 110, height: 520, borderRadius: 18, background: "rgba(255,255,255,.1)", border: "4px solid rgba(255,255,255,.3)", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${air}%`, background: air > 60 ? ICE : RED }} /></div>
    <Tag tt={tt} at={0.8} x={1385} y={870} txt="AIR" col={DIM} size={34} />
    <Tag tt={tt} at={2.8} x={1620} y={560} txt="DOUBLE THE FIGHT" col={RED} size={44} />
  </>;
}}</Stage>;

// 18 · la etiqueta vieja: se despega el precio de una tienda que ya cerró
export const HSticker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const peel = eio(tt, 2.6, 4.2);
  return <>
    <Head tt={tt} kick="THE FORGOTTEN ONE" title="A STORE LONG GONE" col={AMB} />
    <C x={960} y={590}><div style={{ width: 700, height: 440, border: "24px solid #b8a578", background: "repeating-linear-gradient(90deg,#8d8370 0 22px,#6d6455 22px 26px)", position: "relative", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 240, top: 120, width: 260, height: 170, background: "linear-gradient(135deg,#f59a3b,#d7731c)", borderRadius: 10, transformOrigin: "left bottom", transform: `perspective(800px) rotateY(${-70 * peel}deg) rotateZ(${-8 * peel}deg)`, boxShadow: `${12 * peel}px 10px 20px rgba(0,0,0,.5)`, color: "#3a1f05", textAlign: "center", paddingTop: 22, boxSizing: "border-box", filter: "sepia(.4)" }}>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 2 }}>HAMMER & CO.</div>
        <div style={{ fontWeight: 900, fontSize: 66 }}>$3.99</div>
      </div>
    </div></C>
    <Tag tt={tt} at={1.4} x={960} y={900} txt="CLOSED IN 2011" col={RED} size={56} />
  </>;
}}</Stage>;

// 19 · las reglas de Earl, a máquina de escribir, letra por letra
const RULES = ["1. Thermostat off first.", "2. Wait for the blower.", "3. Never on the floor.", "4. Set it on its box."];
export const HRules: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  let left = Math.max(0, (tt - 0.8) * 22);
  return <>
    <C x={960} y={560}><div style={{ width: 920, height: 620, background: "#f1ead6", padding: "56px 70px", boxSizing: "border-box", transform: "rotate(-1.5deg)", boxShadow: "0 50px 100px rgba(0,0,0,.7)", fontFamily: "Courier New, monospace", color: "#2a2620" }}>
      <div style={{ fontWeight: 900, fontSize: 46, letterSpacing: 6, borderBottom: "3px solid #2a2620", paddingBottom: 14 }}>EARL'S RULES · 1984</div>
      {RULES.map((r, i) => { const n = Math.min(r.length, Math.floor(left)); left -= r.length + 4; return <div key={i} style={{ fontSize: 44, fontWeight: 700, marginTop: 34 }}>{r.slice(0, Math.max(0, n))}{n > 0 && n < r.length ? "▌" : ""}</div>; })}
    </div></C>
  </>;
}}</Stage>;

// 20 · cámara térmica: el motor pasa de azul a rojo y cuelga la etiqueta de $650
export const HThermal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const heat = eio(tt, 0.6, 3.4), sw = phys(tt, 3.6, 5, 0.18);
  return <>
    <Head tt={tt} kick="NUMBER TEN" title="THE BLOWER MOTOR" col={RED} />
    <C x={860} y={590}><div style={{ position: "absolute", left: 470, top: 190, width: 140, height: 40, borderRadius: 10, background: "#8b8f96" }} />{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + i * 52, top: -26, width: 18, height: 472, borderRadius: 9, background: `hsl(${lerp(220, 10, heat)},70%,${lerp(30, 40, heat)}%)` }} />)}<div style={{ position: "relative", width: 560, height: 420, borderRadius: 200, background: `radial-gradient(circle at 50% 50%, hsl(${lerp(220, 0, heat)},90%,${lerp(45, 58, heat)}%), hsl(${lerp(240, 30, heat)},85%,35%) 60%, hsl(${lerp(260, 50, heat)},70%,18%))`, boxShadow: `0 0 ${120 * heat}px rgba(255,80,40,${0.5 * heat}), 0 40px 90px rgba(0,0,0,.6)` }} /></C>
    <div style={{ position: "absolute", left: 860, top: 590, transform: "translate(-50%,-50%)", fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 100, color: TX }}>{Math.round(lerp(90, 210, heat))}°F</div>
    <div style={{ position: "absolute", left: 1330, top: 360, transformOrigin: "top center", transform: `rotate(${(1 - sw) * 40}deg)`, opacity: cl((tt - 3.5) * 4) }}>
      <div style={{ width: 4, height: 90, background: "#ccc", margin: "0 auto" }} />
      <div style={{ width: 300, height: 170, background: "#f3ecd9", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 84, color: RED, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>$650</div>
    </div>
  </>;
}}</Stage>;

// 21 · la grieta: nace en un remache y se ramifica por la chapa del intercambiador; por la rendija se ve la llama
const BR: [number, number, number, number][] = [[0, 0, 13, 0], [5, 0.15, 6, -1], [9, 0.45, 5, 1], [3, 0.7, 4, 1]];
export const HCrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const main: [number, number][] = [[880, 300]]; for (let i = 1; i < 14; i++) main.push([880 + (rnd(i) - 0.5) * 90 + i * 8, 300 + i * 38]);
  const paths = BR.map(([from, d0, len, dir], b) => { const o = b ? main[from] : main[0]; const pts: [number, number][] = [o];
    for (let i = 1; i <= len; i++) pts.push(b ? [o[0] + dir * i * 34 + (rnd(b * 9 + i) - 0.5) * 30, o[1] + i * 22 + (rnd(i + b) - 0.5) * 20] : main[i]);
    const n = Math.floor(len * eio(tt, 0.8 + d0 * 3, 3.2 + d0 * 2)); return pts.slice(0, n + 1).map((q, i) => `${i ? "L" : "M"} ${q[0]} ${q[1]}`).join(" "); });
  const glow = eio(tt, 2.0, 4.0);
  return <>
    <Head tt={tt} kick="THE HEAT EXCHANGER" title="A WHOLE NEW FURNACE" col={RED} />
    <div style={{ position: "absolute", left: 560, top: 230, width: 800, height: 640, borderRadius: 26, background: "radial-gradient(ellipse at 40% 30%, #6a6c72, #34363b 55%, #1d1e21)", boxShadow: "0 50px 100px rgba(0,0,0,.6), inset 0 0 80px rgba(0,0,0,.7)" }}>
      {[[40, 40], [760, 40], [40, 600], [760, 600], [400, 40], [400, 600]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 14, top: y - 14, width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #9a9ca2, #3a3c40)" }} />)}
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "repeating-linear-gradient(100deg, transparent 0 40px, rgba(255,255,255,.03) 40px 42px)" }} />
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {paths.map((d, i) => <g key={i}><path d={d} fill="none" stroke="#ff5a1a" strokeWidth={22} opacity={0.45 * glow} style={{ filter: "blur(10px)" }} />
        <path d={d} fill="none" stroke="#0a0705" strokeWidth={i ? 6 : 10} strokeLinejoin="bevel" /><path d={d} fill="none" stroke="#ffb070" strokeWidth={i ? 1.5 : 3} opacity={glow} /></g>)}
    </svg>
    <Tag tt={tt} at={3.8} x={960} y={950} txt="CRACKED = REPLACED" col={RED} size={60} />
  </>;
}}</Stage>;

// 22 · hielo: las aletas del serpentín se cubren de escarcha de abajo hacia arriba
export const HIce: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ice = eio(tt, 0.8, 4.4);
  return <>
    <Head tt={tt} kick="NUMBER ELEVEN" title="ICE IN JULY" col={ICE} />
    <C x={960} y={590}><div style={{ width: 760, height: 460, position: "relative", background: "#2b2d30", borderRadius: 12, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 38 }, (_, i) => <div key={i} style={{ position: "absolute", left: 10 + i * 20, top: 0, width: 6, height: 460, background: "linear-gradient(90deg,#9aa0a6,#d8dde2,#8c9298)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${ice * 100}%`, background: "linear-gradient(0deg, rgba(240,250,255,.97), rgba(215,236,250,.85) 80%, rgba(215,236,250,0))", boxShadow: "0 -10px 30px rgba(200,230,255,.5)" }} />
    </div></C>
    <Tag tt={tt} at={1.0} x={960} y={880} txt="NO AIR = FROZEN COIL" col={ICE} size={56} />
  </>;
}}</Stage>;

// 23 · preguntas de los vecinos: tarjetas que se dan vuelta y muestran la respuesta corta
const QS: [string, string][] = [["Filter if I clean ducts?", "YES"], ["Just vacuum it?", "BUYS A WEEK"], ["Pricey = savings?", "ONLY IF IT BREATHES"]];
export const HFaq: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="YOUR QUESTIONS" title="ASK MARCUS" col={AMB} />
  {QS.map(([q, a], i) => { const r = 180 * eio(tt, 1.6 + i * 2.2, 2.4 + i * 2.2), inn = phys(tt, 0.4 + i * 0.25, 6, 0.55);
    return <div key={i} style={{ position: "absolute", left: 420 + i * 540, top: 600, width: 460, height: 340, transform: `translate(-50%,-50%) translateY(${(1 - inn) * 200}px)`, opacity: cl(inn * 2), perspective: 1400 }}>
      <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "#f4efe3", borderRadius: 20, padding: 36, boxSizing: "border-box", fontFamily: HAND, fontSize: 56, color: "#2a2620", display: "flex", alignItems: "center", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>{q}</div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#1d2a22", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 30, boxSizing: "border-box", fontWeight: 900, fontSize: 48, color: GRN, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>{a}</div>
      </div></div>; })}
</>}</Stage>;

// 24 · los ayudantes: tres contactos que se abren en abanico con la lista prendida
const HELP = [["👦", "GRANDKID"], ["🏡", "NEIGHBOR"], ["⛪", "CHURCH FRIEND"]];
export const HHelpers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fan = eio(tt, 0.6, 2.2), pin = phys(tt, 3.0, 7, 0.4);
  return <>
    <Head tt={tt} kick="CAN'T DO THE STAIRS?" title="HAND OFF THE LIST" col={GRN} />
    {HELP.map(([e, n], i) => <div key={i} style={{ position: "absolute", left: 760, top: 620, width: 320, height: 420, transformOrigin: "50% 120%", transform: `translate(-50%,-50%) rotate(${(i - 1) * 22 * fan}deg)`, background: "#f6f1e6", borderRadius: 22, boxShadow: "0 30px 70px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ fontSize: 130 }}>{e}</div><div style={{ fontWeight: 900, fontSize: 36, color: "#2a2620", letterSpacing: 2 }}>{n}</div></div>)}
    <div style={{ position: "absolute", left: 1400, top: 560, width: 380, height: 460, transform: `translate(-50%,-50%) translateY(${(1 - pin) * -500}px) rotate(4deg)`, background: "#fff27a", boxShadow: "0 30px 60px rgba(0,0,0,.5)", padding: 34, boxSizing: "border-box", fontFamily: HAND, fontSize: 48, color: "#2a2620", lineHeight: 1.35 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: RED, margin: "-20px auto 10px" }} />
      ☐ System off<br />☐ Arrow → furnace<br />☐ Write the date<br />☐ Once a month
    </div>
  </>;
}}</Stage>;

// 25 · el oído: la onda del soplador pasa de áspera a suave
export const HWave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sm = eio(tt, 1.6, 3.8);
  const d = Array.from({ length: 160 }, (_, i) => { const x = 260 + i * 9; const y = 560 + (1 - sm) * 140 * (rnd(i + Math.floor(tt * 12)) - 0.5) + 70 * Math.sin(i * 0.18 - tt * 6) * (0.4 + 0.6 * sm); return `${i ? "L" : "M"} ${x} ${y}`; }).join(" ");
  return <>
    <Head tt={tt} kick="EIGHTH · LISTEN" title="IT SHOULD SOUND SMOOTH" col={GRN} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={d} fill="none" stroke={sm > 0.5 ? GRN : RED} strokeWidth={8} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${sm > 0.5 ? "rgba(111,227,154,.6)" : "rgba(255,90,74,.6)"})` }} /></svg>
    <Tag tt={tt} at={0.6} x={600} y={820} txt="STRAINING" col={RED} size={44} />
    <Tag tt={tt} at={3.0} x={1320} y={820} txt="SMOOTH" col={GRN} size={44} />
  </>;
}}</Stage>;

// 26 · el fuelle: el filtro de 4" se despliega y el papel se multiplica
export const HAccordion: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 0.8, 3.4), n = 24, w = lerp(14, 52, op);
  const d = Array.from({ length: n + 1 }, (_, i) => `${i ? "L" : "M"} ${960 - (n * w) / 2 + i * w} ${i % 2 ? 380 : 760}`).join(" ");
  return <>
    <Head tt={tt} kick="NUMBER TWELVE" title="THE THICK FILTER" col={GRN} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={d + ` L ${960 + (n * w) / 2} 760 L ${960 - (n * w) / 2} 760 Z`} fill="rgba(240,236,226,.18)" stroke="none" />
      <path d={d} fill="none" stroke="#efe9dc" strokeWidth={6} strokeLinejoin="round" />
    </svg>
    <Tag tt={tt} at={2.6} x={960} y={880} txt={`${Math.round(lerp(1, 9, op))}x THE PAPER`} col={GRN} size={70} />
    <Tag tt={tt} at={3.6} x={960} y={300} txt="ONCE A YEAR" col={AMB} size={44} />
  </>;
}}</Stage>;

// 27 · el libro de cuentas: los renglones se escriben solos y suman $400
const LED: [string, string][] = [["Up to 10% of the bill", "$200"], ["A blower motor you keep", "✓"], ["A coil you don't clean", "✓"], ["Calls that don't happen", "✓"]];
export const HLedger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const tot = 400 * eio(tt, 1.0, 5.2);
  return <>
    <C x={960} y={560}><div style={{ width: 1000, height: 660, background: "#f1ecdc", borderRadius: 10, boxShadow: "0 50px 100px rgba(0,0,0,.7)", padding: "50px 70px", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 78px, rgba(60,110,170,.25) 78px 80px)", color: "#2a2620" }}>
      <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 6, color: RED }}>WHAT A $6 FILTER SAVES</div>
      {LED.map(([n, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontSize: 64, marginTop: 14, clipPath: `inset(0 ${(1 - eio(tt, 1.0 + i * 1.1, 1.8 + i * 1.1)) * 100}% 0 0)` }}><span>{n}</span><span>{v}</span></div>)}
      <div style={{ borderTop: "4px double #2a2620", marginTop: 20, paddingTop: 6, display: "flex", justifyContent: "space-between", fontFamily: MARK, fontSize: 78, color: GRN }}><span>UP TO / YEAR</span><span>${Math.round(tot)}</span></div>
    </div></C>
  </>;
}}</Stage>;

// 28 · dominó: un filtro tapado tira al soplador, al intercambiador y al serpentín
const DOM = ["FILTER", "BLOWER", "HEAT EXCH.", "COIL"];
export const HDomino: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <Head tt={tt} kick="ONE CLOGGED FILTER" title="EVERYTHING FALLS" col={RED} />
  <div style={{ position: "absolute", left: 160, right: 160, top: 820, height: 8, borderRadius: 4, background: "rgba(255,255,255,.25)" }} />
  {DOM.map((n, i) => { const f = eio(tt, 1.2 + i * 0.75, 1.8 + i * 0.75);
    return <div key={i} style={{ position: "absolute", left: 360 + i * 360, top: 820, width: 150, height: 380, transformOrigin: "100% 100%", transform: `translate(-50%,-100%) rotate(${f * 72}deg)`, background: i ? "#f3ecda" : "#7a7268", borderRadius: 14, boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap", fontWeight: 900, fontSize: 40, color: i ? "#2a2620" : TX, letterSpacing: 2 }}>{n}</div></div>; })}
  <Tag tt={tt} at={4.6} x={960} y={930} txt="IT ALL STARTS HERE" col={AMB} size={46} />
</>}</Stage>;
