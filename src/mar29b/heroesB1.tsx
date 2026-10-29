// mar29b · componentes únicos 1-16. Mecanismos que no están en mar29a (ver D:/rtmp/mar29_COMPONENTES.md).
import React from "react";
import { Img } from "remotion";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, img, phys } from "./hkit";

const C: React.FC<{ x?: number; y?: number; children: React.ReactNode }> = ({ x = 960, y = 560, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>{children}</div>;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const shadow = "0 50px 100px rgba(0,0,0,.65), 0 8px 18px rgba(0,0,0,.4)";

// 1 · dolor de cabeza: reloj 2:00 AM y ondas que laten desde la frente de una silueta
export const HHeadache: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <div style={{ position: "absolute", left: 1350, top: 250, fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 120, color: RED, textShadow: "0 0 30px rgba(255,90,74,.7)", opacity: cl(phys(tt, 0.2, 6, 0.6)) * (0.75 + 0.25 * Math.sin(tt * 3)) }}>2:00<span style={{ fontSize: 50 }}> AM</span></div>
  <svg width={1920} height={1080} style={{ position: "absolute" }}>
    <path d="M 700 900 C 690 760, 640 700, 650 560 C 660 400, 780 320, 900 320 C 1040 320, 1120 420, 1110 560 C 1105 640, 1150 680, 1130 720 L 1090 730 C 1100 800, 1060 840, 1000 830 L 1000 900 Z" fill="#1a1716" stroke="rgba(255,230,200,.25)" strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => { const ph = ((tt * 0.9 + i * 0.25) % 1), r = 30 + ph * 260;
      return <ellipse key={i} cx={960} cy={430} rx={r} ry={r * 0.55} fill="none" stroke={RED} strokeWidth={8 * (1 - ph)} opacity={(1 - ph) * cl((tt - 0.8) * 2)} />; })}
  </svg>
  <Tag tt={tt} at={2.6} x={960} y={960} txt="FOGGY · DULL · EVERY NIGHT" col={DIM} size={40} />
</>}</Stage>;

// 2 · el colgante de la puerta: se balancea en el picaporte, se da vuelta y del otro lado hay una llave
export const HDoorhanger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = Math.sin(tt * 3.2) * 9 * Math.exp(-tt * 0.5), fl = eio(tt, 3.4, 4.4);
  return <>
    <Head tt={tt} kick="NUMBER ONE" title="THE $49 TUNE-UP" col={AMB} />
    <div style={{ position: "absolute", left: 760, top: 160, width: 400, height: 860, borderRadius: 10, background: "linear-gradient(90deg,#5a3a22,#7a5232 50%,#5a3a22)", boxShadow: shadow }} />
    <div style={{ position: "absolute", left: 1090, top: 470, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#f5d78a,#a37a2a)" }} />
    <div style={{ position: "absolute", left: 1125, top: 505, transformOrigin: "50% 0", transform: `translate(-50%,0) rotate(${sw}deg)`, perspective: 1400 }}>
      <div style={{ width: 300, height: 560, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${fl * 180}deg)` }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(180deg,#ffd23a,#ff9f1a)", borderRadius: 18, boxShadow: shadow, textAlign: "center", paddingTop: 120, boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 110, top: 26, width: 80, height: 80, borderRadius: "50%", background: "#2a1b0e" }} />
          <div style={{ fontWeight: 900, fontSize: 40, color: "#3a1f05", letterSpacing: 2 }}>FURNACE<br />TUNE-UP</div>
          <div style={{ fontFamily: MARK, fontSize: 96, color: "#c0170c", marginTop: 30 }}>$49.99</div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#1f1b17", borderRadius: 18, boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{ width: 160, height: 60, borderRadius: 30, border: `16px solid ${AMB}`, boxSizing: "border-box" }} /><div style={{ fontWeight: 900, fontSize: 44, color: AMB, letterSpacing: 2 }}>DOOR OPENER</div>
        </div>
      </div>
    </div>
  </>;
}}</Stage>;

// 3 · el tester: el capacitor dice 45 µF y la pantalla del multímetro llega a 44.6 → coinciden
export const HMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const v = tt < 1.4 ? 0 : 44.6 * eio(tt, 1.4, 3.0) + (tt < 3.0 ? (rnd(Math.floor(tt * 14)) - 0.5) * 6 : 0), ok = cl((tt - 3.4) * 3);
  return <>
    <Head tt={tt} kick="SHOW ME, DON'T TELL ME" title="THE NUMBER ON THE SIDE" col={GRN} />
    <div style={{ position: "absolute", left: 480, top: 300, width: 300, height: 520, borderRadius: 40, background: "linear-gradient(90deg,#9ea3aa,#e4e7ea 45%,#8a8f96)", boxShadow: shadow }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 170, height: 170, background: "#f2efe6", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#2a2620" }}>
        <div style={{ fontWeight: 900, fontSize: 70 }}>45 µF</div><div style={{ fontSize: 24, fontWeight: 700 }}>RUN CAPACITOR</div></div>
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d="M 780 420 C 880 420, 900 520, 1080 520" stroke={RED} strokeWidth={10} fill="none" /><path d="M 780 700 C 880 700, 900 620, 1080 600" stroke="#222" strokeWidth={10} fill="none" /></svg>
    <div style={{ position: "absolute", left: 1080, top: 260, width: 420, height: 600, borderRadius: 40, background: "linear-gradient(160deg,#ffcf2a,#e0a800)", boxShadow: shadow }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 50, height: 200, borderRadius: 14, background: "#a9b89a", boxShadow: "inset 0 6px 14px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30, fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 96, color: "#1d2418" }}>{v.toFixed(1)}</div>
      <div style={{ position: "absolute", left: 130, top: 330, width: 160, height: 160, borderRadius: "50%", background: "#2a2a2a", border: "10px solid #444" }} />
    </div>
    <div style={{ position: "absolute", left: 1290, top: 940, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * ok})`, opacity: ok, fontWeight: 900, fontSize: 56, color: GRN }}>MATCHES = FINE</div>
  </>;
}}</Stage>;

// 4 · el frasco: cae una moneda por mes, 12 meses, hasta $180
export const HJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.min(12, Math.floor(Math.max(0, tt - 0.8) * 2.6));
  return <>
    <Head tt={tt} kick="NUMBER TWO" title="$15 A MONTH" col={AMB} />
    <C x={860} y={620}><div style={{ width: 420, height: 520, borderRadius: "40px 40px 60px 60px", border: "8px solid rgba(220,240,255,.55)", background: "linear-gradient(90deg, rgba(255,255,255,.12), rgba(255,255,255,.03) 40%, rgba(255,255,255,.14))", position: "relative", overflow: "hidden", boxShadow: shadow }}>
      {Array.from({ length: n + 1 }, (_, i) => { const land = i < n, y = land ? 460 - i * 34 : -60 + 520 * Math.min(1, ((tt - 0.8) * 2.6 % 1) ** 2);
        return i <= 11 ? <div key={i} style={{ position: "absolute", left: 90 + (i % 2) * 30, top: y, width: 220, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%, #ffe08a, #c9921a)", border: "3px solid #9a6d0e" }} /> : null; })}
    </div></C>
    <div style={{ position: "absolute", left: 1220, top: 420, fontFamily: HAND, fontSize: 64, color: DIM }}>month {Math.max(1, n)}</div>
    <div style={{ position: "absolute", left: 1220, top: 500, fontWeight: 900, fontSize: 140, color: n >= 12 ? RED : TX }}>${n * 15}</div>
    <Tag tt={tt} at={5.2} x={1420} y={760} txt="RENEWS ITSELF" col={RED} size={48} />
  </>;
}}</Stage>;

// 5 · el resaltador: barre el resumen de la tarjeta y se prenden HEATING, COOLING, COMFORT, AIR
const LINES = ["GROCERY MART", "HEATING PLAN", "PHARMACY", "COOLING CARE", "GAS STATION", "COMFORT CLUB", "AIR PRO SVC"];
export const HHighlighter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="ONCE A YEAR" title="READ YOUR STATEMENT" col={AMB} />
  <C x={960} y={600}><div style={{ width: 860, height: 620, background: "#fbf9f3", borderRadius: 8, boxShadow: shadow, padding: "40px 56px", boxSizing: "border-box", fontFamily: "Courier New, monospace", color: "#2a2620", transform: "rotate(-2deg)" }}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 3, borderBottom: "2px solid #2a2620", paddingBottom: 10 }}>CARD STATEMENT · NOV</div>
    {LINES.map((l, i) => { const hit = /HEAT|COOL|COMFORT|AIR/.test(l), p = hit ? eio(tt, 0.8 + i * 0.55, 1.3 + i * 0.55) : 0;
      return <div key={i} style={{ position: "relative", fontSize: 34, fontWeight: 700, marginTop: 22, display: "flex", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", left: -10, top: 4, height: 40, width: `${p * 104}%`, background: "rgba(255,230,40,.75)", borderRadius: 4 }} />
        <span style={{ position: "relative" }}>{l}</span><span style={{ position: "relative" }}>${(12 + i * 7) % 60 + 15}.00</span></div>; })}
  </div></C>
</>}</Stage>;

// 6 · la cámara de combustión en corte: el fuego de un lado, el aire de la casa del otro, una pared de metal en el medio
export const HChamber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const wall = eio(tt, 0.6, 1.6);
  return <>
    <Head tt={tt} kick="NUMBER THREE" title="THE HEAT EXCHANGER" col={RED} />
    <div style={{ position: "absolute", left: 360, top: 260, width: 560, height: 580, borderRadius: "30px 0 0 30px", background: "radial-gradient(ellipse at 50% 90%, #ff8a2a, #a8300c 45%, #2a0c05)", overflow: "hidden" }}>
      {Array.from({ length: 14 }, (_, i) => { const y = 580 - ((tt * 240 + i * 61) % 600); return <div key={i} style={{ position: "absolute", left: 40 + (i * 37) % 480, top: y, width: 40, height: 70, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle, #ffd27a, rgba(255,120,30,0))", opacity: 0.7 }} />; })}
    </div>
    <div style={{ position: "absolute", left: 1000, top: 260, width: 560, height: 580, borderRadius: "0 30px 30px 0", background: "linear-gradient(180deg,#1b2b3a,#24435a)", overflow: "hidden" }}>
      {Array.from({ length: 10 }, (_, i) => { const x = ((tt * 200 + i * 90) % 640) - 60; return <div key={i} style={{ position: "absolute", left: x, top: 60 + i * 50, width: 90, height: 6, borderRadius: 3, background: ICE, opacity: 0.6 }} />; })}
    </div>
    <div style={{ position: "absolute", left: 920, top: 260, width: 80, height: 580 * wall, background: "linear-gradient(90deg,#5c5f66,#b8bcc3,#5c5f66)", boxShadow: "0 0 30px rgba(0,0,0,.6)" }} />
    <Tag tt={tt} at={1.4} x={640} y={900} txt="FIRE & SMOKE" col={AMB} size={44} />
    <Tag tt={tt} at={1.8} x={1280} y={900} txt="YOUR AIR" col={ICE} size={44} />
  </>;
}}</Stage>;

// 7 · la cámara en el cable: un visor redondo que recorre la foto real del interior
export const HScope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const px = lerp(-180, 180, eio(tt, 0.6, 5.5)), py = 60 * Math.sin(tt * 0.9);
  return <>
    <Head tt={tt} kick="ASK THEM" title="CAN YOU SHOW ME?" col={GRN} />
    <C x={960} y={590}><div style={{ width: 600, height: 600, borderRadius: "50%", overflow: "hidden", border: "18px solid #1d1d1f", boxShadow: `${shadow}, inset 0 0 80px rgba(0,0,0,.9)`, position: "relative" }}>
      <Img src={img("n_b_soldadura")} style={{ position: "absolute", width: 1100, height: 620, left: -250 + px, top: -10 + py, objectFit: "cover", filter: "saturate(.7) contrast(1.1)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 45%, rgba(0,0,0,.85) 72%)" }} />
      <div style={{ position: "absolute", left: 290, top: 200, width: 2, height: 200, background: "rgba(111,227,154,.8)" }} /><div style={{ position: "absolute", left: 200, top: 290, width: 200, height: 2, background: "rgba(111,227,154,.8)" }} />
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: "Courier New, monospace", fontSize: 26, color: GRN }}>● REC</div>
    </div></C>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d="M 1240 700 C 1400 760, 1500 860, 1700 1080" stroke="#1d1d1f" strokeWidth={22} fill="none" /></svg>
  </>;
}}</Stage>;

// 8 · la tarjeta roja: cuelga del caño del gas y aparece la cotización
export const HRedtag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = Math.sin(tt * 2.6) * 14 * Math.exp(-tt * 0.6);
  return <>
    <div style={{ position: "absolute", left: 300, top: 300, width: 1320, height: 46, borderRadius: 23, background: "linear-gradient(180deg,#e8e2c9,#9e9675)", boxShadow: shadow }} />
    <div style={{ position: "absolute", left: 820, top: 320, transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ width: 4, height: 90, background: "#ddd", margin: "0 auto" }} />
      <div style={{ width: 320, height: 470, background: "linear-gradient(180deg,#e2241a,#a3150e)", clipPath: "polygon(20% 0,80% 0,100% 12%,100% 100%,0 100%,0 12%)", boxShadow: shadow, color: TX, textAlign: "center", paddingTop: 80, boxSizing: "border-box" }}>
        <div style={{ fontWeight: 900, fontSize: 52, letterSpacing: 3 }}>DANGER</div><div style={{ fontWeight: 800, fontSize: 30, marginTop: 14 }}>DO NOT<br />OPERATE</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1320, top: 640, transform: `translate(-50%,-50%) rotate(4deg) scale(${cl(phys(tt, 1.6, 6, 0.5))})`, width: 400, background: "#f6f3ea", padding: "30px 34px", boxShadow: shadow, fontFamily: "Courier New, monospace", color: "#2a2620" }}>
      <div style={{ fontWeight: 900, fontSize: 28 }}>QUOTE · FRI · FEB</div><div style={{ fontSize: 26, marginTop: 14 }}>New furnace</div><div style={{ fontWeight: 900, fontSize: 64, color: RED, marginTop: 10 }}>$11,000</div>
    </div>
  </>;
}}</Stage>;

// 9 · la lupa: pasa sobre la foto real; abajo la costura de fábrica, recta y limpia
export const HLoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const x = lerp(560, 1240, eio(tt, 0.5, 3.0));
  return <>
    <Head tt={tt} kick="NOT A CRACK" title="A FACTORY SEAM" col={GRN} />
    <C x={900} y={600}><Photo id="n_b_soldadura" w={1000} h={560} r={14} z={1.02} style={{ filter: "brightness(.7)" }} /></C>
    <div style={{ position: "absolute", left: x, top: 600, transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", overflow: "hidden", border: "16px solid #2b2724", boxShadow: shadow }}>
      <Img src={img("n_b_soldadura")} style={{ position: "absolute", width: 2000, height: 1120, left: -(x - 400) * 2 + 170 - 100, top: -(600 - 320) * 2 + 170 - 300, objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.25), transparent 50%)" }} />
    </div>
    <div style={{ position: "absolute", left: x + 160, top: 760, width: 40, height: 220, background: "linear-gradient(90deg,#3b2a1c,#6b4a2c)", borderRadius: 18, transform: "rotate(-38deg)", transformOrigin: "top" }} />
    <Tag tt={tt} at={3.6} x={1500} y={300} txt="STRAIGHT · CLEAN" col={GRN} size={46} />
  </>;
}}</Stage>;

// 10 · la fórmula: edad × costo; la aguja cae en FIX o en REPLACE (dos ejemplos)
export const HMultiply: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const two = tt > 4.4, age = two ? 22 : 10, cost = two ? 900 : 200, v = age * cost * eio(tt, two ? 4.8 : 1.0, two ? 6.2 : 2.6);
  const ang = -90 + 180 * Math.min(1, v / 20000);
  return <>
    <Head tt={tt} kick="NUMBER FOUR" title="AGE × COST" col={AMB} />
    <div style={{ position: "absolute", left: 300, top: 360, display: "flex", gap: 30, alignItems: "center", fontWeight: 900, fontSize: 84 }}>
      <div style={{ background: "#f3ecda", color: "#2a2620", padding: "20px 34px", borderRadius: 16, boxShadow: shadow }}>{age}<span style={{ fontSize: 36 }}> YRS</span></div>
      <span style={{ color: DIM }}>×</span>
      <div style={{ background: "#f3ecda", color: "#2a2620", padding: "20px 34px", borderRadius: 16, boxShadow: shadow }}>${cost}</div>
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 1100 760 A 300 300 0 0 1 1350 466" stroke={GRN} strokeWidth={46} fill="none" />
      <path d="M 1350 466 A 300 300 0 0 1 1700 760" stroke={RED} strokeWidth={46} fill="none" />
      <g transform={`rotate(${ang} 1400 760)`}><line x1={1400} y1={760} x2={1400} y2={500} stroke={TX} strokeWidth={10} strokeLinecap="round" /></g>
      <circle cx={1400} cy={760} r={24} fill={TX} />
    </svg>
    <div style={{ position: "absolute", left: 1400, top: 820, transform: "translateX(-50%)", fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 70, color: v > 5000 ? RED : GRN }}>{Math.round(v).toLocaleString("en-US")}</div>
    <Tag tt={tt} at={2.8} x={1180} y={420} txt="FIX IT" col={GRN} size={40} />
    <Tag tt={tt} at={6.4} x={1640} y={420} txt="GET 3 QUOTES" col={RED} size={40} />
  </>;
}}</Stage>;

// 11 · las pilas: las dos AA se vacían y la pantalla del termostato se apaga
export const HCells: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const lv = 1 - eio(tt, 0.8, 4.0);
  return <>
    <Head tt={tt} kick="NUMBER FIVE" title="TWO LITTLE BATTERIES" col={AMB} />
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 170, top: 330, width: 130, height: 440, borderRadius: 20, background: "#2a2a2c", boxShadow: shadow, overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${lv * 100}%`, background: lv > 0.3 ? "linear-gradient(90deg,#3fb56c,#7fe3a2)" : "linear-gradient(90deg,#c0170c,#ff5a4a)" }} />
      <div style={{ position: "absolute", top: -20, left: 40, width: 50, height: 30, borderRadius: 6, background: "#888" }} /></div>)}
    <div style={{ position: "absolute", left: 1000, top: 330, width: 520, height: 440, borderRadius: 40, background: "#ecebe6", boxShadow: shadow }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 200, borderRadius: 14, background: `rgba(160,200,150,${0.15 + 0.85 * lv})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 110, color: `rgba(20,30,20,${lv})` }}>68°</div>
      <div style={{ position: "absolute", left: 200, top: 320, width: 120, height: 60, borderRadius: 30, background: "#d5d3cc" }} />
    </div>
    <Tag tt={tt} at={4.2} x={1260} y={850} txt="NO HEAT" col={RED} size={60} />
  </>;
}}</Stage>;

// 12 · el subibaja: $150 de un lado, $2 del otro, y el lado de $150 se hunde
export const HSeesaw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = -14 * phys(tt, 1.4, 4, 0.3);
  return <>
    <Head tt={tt} kick="A COLD HOUSE" title="$150 FOR A $2 FIX" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><polygon points="960,700 890,860 1030,860" fill="#6d655a" /></svg>
    <div style={{ position: "absolute", left: 960, top: 700, transform: `translate(-50%,-50%) rotate(${-a}deg)` }}>
      <div style={{ width: 1100, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#b8946a,#7a5a36)", boxShadow: shadow, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, bottom: 26, width: 260, height: 170, borderRadius: 14, background: "#f3ecda", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 80, color: RED, boxShadow: shadow }}>$150</div>
        <div style={{ position: "absolute", right: 70, bottom: 26, width: 140, height: 90, borderRadius: 12, background: "#f3ecda", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 52, color: GRN, boxShadow: shadow }}>$2</div>
      </div>
    </div>
    <Tag tt={tt} at={2.6} x={1460} y={420} txt="SERVICE CALL" col={DIM} size={36} />
  </>;
}}</Stage>;

// 13 · el interruptor: una mano lo baja sin querer y lo tapa una cinta escrita a mano
export const HSwitchtape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const off = tt > 0.9 && tt < 2.4, tape = eio(tt, 2.6, 3.4);
  return <>
    <Head tt={tt} kick="NUMBER SIX" title="THE FURNACE SWITCH" col={AMB} />
    <C x={960} y={590}><div style={{ width: 360, height: 560, borderRadius: 24, background: "linear-gradient(180deg,#d82a1e,#a81710)", boxShadow: shadow, position: "relative" }}>
      <div style={{ position: "absolute", left: 140, top: 180, width: 80, height: 200, borderRadius: 10, background: "#ece8df", boxShadow: "inset 0 0 12px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 10, top: off ? 110 : 10, width: 60, height: 80, borderRadius: 8, background: "#fbf9f4", boxShadow: "0 6px 12px rgba(0,0,0,.4)" }} /></div>
      <div style={{ position: "absolute", left: -60, top: 230, width: 480, height: 110, background: "rgba(232,215,160,.96)", transform: `rotate(-6deg) scaleX(${tape})`, transformOrigin: "left", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 40, color: "#2a2620", boxShadow: "0 8px 18px rgba(0,0,0,.35)" }}>{tape > 0.9 ? "FURNACE · LEAVE ON" : ""}</div>
    </div></C>
    <Tag tt={tt} at={1.0} x={1450} y={560} txt={off ? "OFF = NO HEAT" : "ON"} col={off ? RED : GRN} size={56} />
  </>;
}}</Stage>;

// 14 · el fantasma: el gas no se ve; sólo aparece donde pasa la linterna (y el ojo y la nariz no lo detectan)
export const HGhost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const bx = lerp(400, 1500, eio(tt, 0.6, 5.0));
  return <>
    <Head tt={tt} kick="NUMBER SEVEN" title="YOU CAN'T SEE IT" col={RED} />
    {Array.from({ length: 160 }, (_, i) => { const x = 300 + rnd(i) * 1320 + 40 * Math.sin(tt * 0.6 + i), y = 300 + rnd(i + 3) * 600 + 30 * Math.cos(tt * 0.5 + i), d = Math.abs(x - bx);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: 14, borderRadius: "50%", background: "#ff8a7a", opacity: cl(1 - d / 160) * 0.9 }} />; })}
    <div style={{ position: "absolute", left: bx - 160, top: 260, width: 320, height: 680, background: "radial-gradient(ellipse, rgba(255,240,200,.18), transparent 70%)" }} />
    <Tag tt={tt} at={1.0} x={560} y={980} txt="EYES: NO" col={DIM} size={50} />
    <Tag tt={tt} at={1.8} x={1360} y={980} txt="NOSE: NO" col={DIM} size={50} />
  </>;
}}</Stage>;

// 15 · el caño de la chimenea: la unión se separa y la mitad del humo vuelve a la casa
export const HFlue: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const g = eio(tt, 0.8, 2.2);
  return <>
    <Head tt={tt} kick="MRS. PATTERSON · 1997" title="A PIPE CAME APART" col={RED} />
    <div style={{ position: "absolute", left: 860, top: 140, width: 140, height: 340, background: "linear-gradient(90deg,#6a6d73,#c7cbd1,#6a6d73)", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 860 + 60 * g, top: 500 + 20 * g, width: 140, height: 360, background: "linear-gradient(90deg,#6a6d73,#c7cbd1,#6a6d73)", borderRadius: 10, transform: `rotate(${12 * g}deg)`, transformOrigin: "50% 100%" }} />
    {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 0.5 + i / 40) % 1, back = i % 2 === 0 && g > 0.5, x = back ? 960 - ph * 520 + 30 * Math.sin(i + tt) : 930 + 20 * Math.sin(i + tt), y = back ? 480 + ph * 340 : 860 - ph * 760;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 50, height: 50, borderRadius: "50%", background: back ? "rgba(255,110,90,.4)" : "rgba(200,200,200,.35)", filter: "blur(8px)" }} />; })}
    <Tag tt={tt} at={2.6} x={520} y={900} txt="BACK INTO THE HOUSE" col={RED} size={48} />
  </>;
}}</Stage>;

// 16 · el plano de la casa visto de arriba: cae una alarma por piso y el pasillo de los dormitorios se ilumina
export const HFloorplan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fl = ["BASEMENT", "MAIN FLOOR", "UPSTAIRS"], hall = eio(tt, 4.0, 5.0);
  return <>
    <Head tt={tt} kick="ONE ON EVERY LEVEL" title="+ BY THE BEDROOMS" col={GRN} />
    {fl.map((f, i) => { const d = phys(tt, 0.6 + i * 0.9, 6, 0.5);
      return <div key={i} style={{ position: "absolute", left: 420 + i * 30, top: 720 - i * 190, width: 1000, height: 160, transform: "perspective(1400px) rotateX(58deg)", background: "rgba(240,236,226,.1)", border: "4px solid rgba(240,236,226,.45)", borderRadius: 10 }}>
        <div style={{ position: "absolute", left: 30, top: 50, fontWeight: 900, fontSize: 40, color: DIM }}>{f}</div>
        {i === 2 && <div style={{ position: "absolute", left: 520, top: 0, width: 300, height: 160, background: `rgba(111,227,154,${0.5 * hall})` }} />}
        <div style={{ position: "absolute", left: 640, top: 40 - (1 - d) * 300, width: 80, height: 80, borderRadius: "50%", background: "#f6f6f2", border: `6px solid ${GRN}`, opacity: cl(d * 2) }} />
      </div>; })}
    <Tag tt={tt} at={4.4} x={1500} y={300} txt="THE HALLWAY" col={GRN} size={44} />
  </>;
}}</Stage>;
