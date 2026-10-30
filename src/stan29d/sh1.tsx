// stan29d · componentes únicos 1-18 (min 0-9). Mundo: salchicha fresca polaca casera.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PINK = [226, 140, 140], FAT = [246, 240, 228];
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 0:04 · PARED DE LADRILLO: los ladrillos caen de a uno con rebote y sobre la pared queda pintado el precio ----
export const HBrick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#1b120d,#0c0806)">{(tt) => <>
  {Array.from({ length: 48 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8, d = phys(tt, 0.1 + (5 - r) * 0.12 + rnd(i) * 0.15, 9, 0.45); return <div key={i} style={{ position: "absolute", left: 340 + c * 156 + (r % 2) * 78, top: 260 + r * 84 - (1 - cl(d)) * 700, width: 148, height: 76, borderRadius: 6, background: `rgb(${150 + rnd(i) * 40},${70 + rnd(i + 3) * 25},${45 + rnd(i + 5) * 15})`, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.25)", opacity: cl(d * 3) }} />; })}
  <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) rotate(-4deg) scale(${0.6 + 0.4 * phys(tt, 1.7, 7, 0.4)})`, opacity: cl((tt - 1.7) * 3), fontFamily: MARK, fontSize: 210, color: "#fff4dc", textShadow: "0 8px 0 rgba(0,0,0,.35)" }}>$25</div>
  <Tag tt={tt} at={2.6} x={960} y={880} txt="TWO LINKS · RIVER NORTH BRUNCH" col={AMB} size={42} />
</>}</Stage>;

// ---- 0:34 · LA PELOTA DE GOMA: la salchicha de góndola rebota estirándose y aplastándose como goma ----
export const HBounce: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = (tt * 1.6) % 1, y = 4 * p * (1 - p), sq = p < 0.08 || p > 0.92 ? 1 : 0;
  return <>
    <div style={{ position: "absolute", left: 300, right: 300, top: 860, height: 6, background: "rgba(255,255,255,.25)" }} />
    <div style={{ position: "absolute", left: 960, top: 860 - 430 * y, transform: `translate(-50%,-100%) scale(${sq ? 1.35 : 0.9},${sq ? 0.6 : 1.12})`, transformOrigin: "50% 100%", width: 420, height: 120, borderRadius: 60, background: "linear-gradient(180deg,#ffb6c0,#e88a98)", boxShadow: "inset 0 12px 20px rgba(255,255,255,.4)" }} />
    <Tag tt={tt} at={0.6} x={960} y={150} txt="STORE SAUSAGE" col={TX} size={56} />
    <Tag tt={tt} at={2.0} x={960} y={950} txt="PINK · SMOOTH · LIKE RUBBER" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 0:55 · LA VIDRIERA: azulejos blancos que se arman y kielbasas colgando que se balancean en el gancho ----
export const HWindow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  {Array.from({ length: 96 }, (_, i) => { const c = i % 16, r = Math.floor(i / 16), k = cl((tt - 0.1 - (c + r) * 0.03) * 4); return <div key={i} style={{ position: "absolute", left: 480 + c * 60, top: 200 + r * 60, width: 56, height: 56, background: "#f1f1ee", opacity: 0.85 * k, transform: `scale(${k})` }} />; })}
  <div style={{ position: "absolute", left: 520, top: 230, width: 880, height: 300, background: "linear-gradient(180deg,#26313a,#141a1f)", borderRadius: 8, border: "10px solid #d9d4c6" }}>
    <div style={{ position: "absolute", left: 30, right: 30, top: 30, height: 8, background: "#9aa3ab", borderRadius: 4 }} />
    {Array.from({ length: 6 }, (_, i) => { const a = 8 * Math.sin(tt * 2.2 + i) * (1 - eio(tt, 3, 5)); return <div key={i} style={{ position: "absolute", left: 80 + i * 130, top: 36, transformOrigin: "50% 0", transform: `rotate(${a}deg)` }}>
      <div style={{ width: 4, height: 26, margin: "0 auto", background: "#bbb" }} />
      <div style={{ width: 60, height: 200, borderRadius: 30, background: "linear-gradient(90deg,#7a3a1e,#b36034,#7a3a1e)" }} />
    </div>; })}
  </div>
  <Tag tt={tt} at={1.4} x={960} y={640} txt="STAN'S · ARCHER AVE" col={TX} size={60} />
  <Tag tt={tt} at={2.4} x={960} y={720} txt="52 YEARS OF SAUSAGE" col={AMB} size={40} />
</>}</Stage>;

// ---- 1:06 · EL CANDADO: el gancho del candado salta y adentro aparece el secreto ----
export const HPadlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const op = phys(tt, 1.3, 9, 0.35), sh2 = Math.sin(tt * 30) * 6 * (tt > 0.6 && tt < 1.3 ? 1 : 0);
  return <>
    <SV><path d="M840 470 L840 360 A120 120 0 0 1 1080 360 L1080 470" transform={`translate(${sh2} ${-50 * cl(op)}) rotate(${-25 * cl(op)} 1080 470)`} fill="none" stroke="#c9d0d8" strokeWidth={40} strokeLinecap="round" /></SV>
    <div style={{ position: "absolute", left: 960 + sh2, top: 650, transform: "translate(-50%,-50%)", width: 400, height: 340, borderRadius: 40, background: "linear-gradient(180deg,#e2b04a,#a8761c)", boxShadow: sh(30) }}>
      <div style={{ position: "absolute", left: 175, top: 110, width: 50, height: 50, borderRadius: 25, background: "#3a2a10" }} />
      <div style={{ position: "absolute", left: 188, top: 150, width: 24, height: 70, background: "#3a2a10", borderRadius: 6 }} />
    </div>
    <Tag tt={tt} at={1.8} x={960} y={130} txt="EASIEST THING IN THE KITCHEN" col={AMB} size={48} />
    <Tag tt={tt} at={2.6} x={960} y={920} txt="NO MACHINE · NO CASINGS" col={TX} size={42} />
  </>;
}}</Stage>;

// ---- 1:58 · EL CARTEL DE DOS FLECHAS: FRESH va derecho y verde; SMOKED / CURED se tacha y gira ----
export const HSignpost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = phys(tt, 0.3, 7, 0.4), b = phys(tt, 0.7, 7, 0.4), x = eio(tt, 2.2, 2.8);
  const arrow = (txt: string, col: string, dir: number, k: number, y: number) => <div style={{ position: "absolute", left: 960 + (dir > 0 ? 0 : -560), top: y, width: 560, height: 120, transformOrigin: dir > 0 ? "0 50%" : "100% 50%", transform: `rotate(${(1 - cl(k)) * 80 * dir}deg)`, background: col, clipPath: dir > 0 ? "polygon(0 0,86% 0,100% 50%,86% 100%,0 100%)" : "polygon(14% 0,100% 0,100% 100%,14% 100%,0 50%)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 52, color: "#1a1410" }}>{txt}</div>;
  return <>
    <div style={{ position: "absolute", left: 945, top: 260, width: 30, height: 720, background: "linear-gradient(90deg,#6b4a2b,#8a6238)" }} />
    {arrow("FRESH", "#8fe3a8", 1, a, 330)}
    {arrow("SMOKED · CURED", "#d6c4ad", -1, b, 520)}
    <div style={{ position: "absolute", left: 420, top: 575, width: 520 * x, height: 12, background: RED, transform: "rotate(-6deg)" }} />
    <Tag tt={tt} at={2.8} x={960} y={860} txt="TODAY: FRESH ONLY · SAFE" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 2:32 · LOS TRES NOMBRES: tres etiquetas de góndola caen y se enganchan con signos «=» ----
export const HAka: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  {["PORK BUTT", "BOSTON BUTT", "SHOULDER"].map((s, i) => { const d = phys(tt, 0.3 + i * 0.5, 8, 0.4); return <div key={i} style={{ position: "absolute", left: 300 + i * 480, top: 440 - (1 - cl(d)) * 500, width: 400, height: 180, borderRadius: 14, background: i === 2 ? AMB : "#f3efe6", color: "#1d1712", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 52, boxShadow: sh(20), transform: `rotate(${(i - 1) * 3}deg)` }}>{s}</div>; })}
  {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 700 + i * 480 + 10, top: 490, fontWeight: 900, fontSize: 90, color: TX, opacity: cl((tt - 1.8 - i * 0.3) * 3) }}>=</div>)}
  <Tag tt={tt} at={2.6} x={960} y={780} txt="SAME CUT · FROM THE FRONT" col={AMB} size={44} />
</>}</Stage>;

// ---- 2:46 · EL BRAZO QUE HACE FUERZA: un bíceps se infla y se vuelve el mapa de marmoleo ----
export const HFlex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = eio(tt, 0.4, 1.6) - 0.3 * Math.max(0, Math.sin(tt * 4)) * (tt > 1.6 && tt < 3.2 ? 1 : 0), m = eio(tt, 3.0, 4.4);
  return <>
    <SV>
      <path d={`M560 700 L860 700 Q${960 + 80 * f} ${560 - 140 * f} 1100 560 L1120 360 L1220 360 L1220 600 Q1100 ${780 + 30 * f} 860 800 L560 800 Z`} fill={mix([226, 180, 150], PINK, m)} stroke="#2a1d16" strokeWidth={10} strokeLinejoin="round" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${640 + rnd(i) * 420} ${690 + rnd(i + 1) * 90} q30 -${10 + rnd(i + 2) * 30} 70 0`} stroke="#fbf5ea" strokeWidth={8} fill="none" opacity={m} strokeLinecap="round" />)}
    </SV>
    <Tag tt={tt} at={1.2} x={960} y={240} txt="HARD-WORKING MUSCLE = FLAVOR" col={AMB} size={46} />
    <Tag tt={tt} at={3.4} x={960} y={920} txt="FAT MARBLED ALL THROUGH" col={TX} size={42} />
  </>;
}}</Stage>;

// ---- 3:21 · ASERRÍN: una salchicha magra se desarma en polvillo que cae como aserrín ----
export const HSawdust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = eio(tt, 1.0, 3.0);
  return <>
    {Array.from({ length: 140 }, (_, i) => { const x0 = 620 + (i % 28) * 24, y0 = 440 + Math.floor(i / 28) * 24, fall = cl(d * 1.6 - rnd(i) * 0.6); return <div key={i} style={{ position: "absolute", left: x0 + (rnd(i + 7) - 0.5) * 140 * fall, top: y0 + fall * fall * 460, width: 22, height: 22, borderRadius: 4, background: mix([214, 150, 130], [200, 168, 120], fall), transform: `rotate(${fall * 300 * (rnd(i) - 0.5)}deg)` }} />; })}
    <div style={{ position: "absolute", left: 560, right: 560, top: 960, height: 40 * d, borderRadius: "50% 50% 0 0", background: "#c8a878" }} />
    <Tag tt={tt} at={0.4} x={960} y={300} txt="TOO LEAN" col={RED} size={60} />
    <Tag tt={tt} at={2.6} x={1500} y={600} txt="= SAWDUST" col={TX} size={50} />
  </>;
}}</Stage>;

// ---- 3:42 · LA GEMA: un cubo de grasa blanca gira como un diamante con destellos ----
export const HGem: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(circle at 50% 50%,#1d2430,#06080b 70%)">{(tt) => {
  const r = tt * 40;
  return <>
    <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", perspective: 1400 }}>
      <div style={{ position: "relative", width: 300, height: 300, transformStyle: "preserve-3d", transform: `rotateX(-20deg) rotateY(${r}deg)` }}>
        {[0, 90, 180, 270].map((a, i) => <div key={i} style={{ position: "absolute", inset: 0, transform: `rotateY(${a}deg) translateZ(150px)`, background: i % 2 ? "linear-gradient(135deg,#fffaf0,#e8dfcc)" : "linear-gradient(135deg,#f3eadb,#ffffff)", border: "2px solid rgba(255,255,255,.6)" }} />)}
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(90deg) translateZ(150px)", background: "#fff" }} />
      </div>
    </div>
    {Array.from({ length: 6 }, (_, i) => { const k = (tt * 0.8 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 760 + rnd(i + 2) * 400, top: 330 + rnd(i + 4) * 380, fontSize: 60 * Math.sin(k * Math.PI), color: "#fff", textShadow: "0 0 20px #fff" }}>✦</div>; })}
    <Tag tt={tt} at={1.4} x={960} y={860} txt="HE LOOKED AT FAT LIKE A JEWELER" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 4:08 · LA ETIQUETA QUE CAE A CERO: el precio de la grasa de lomo baja girando los dígitos hasta FREE ----
export const HFreebie: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const v = 3.49 * (1 - eio(tt, 0.6, 2.6)), free = tt > 2.8;
  return <>
    <Head tt={tt} kick="ASK THE BUTCHER" title="FATBACK" />
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) rotate(${-6 + 6 * phys(tt, 2.8, 8, 0.4)}deg)`, width: 620, height: 300, borderRadius: "30px 140px 140px 30px", background: free ? "#8fe3a8" : "#f3efe6", boxShadow: sh(30), display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", right: 70, top: 120, width: 50, height: 50, borderRadius: 25, background: "#1a1410" }} />
      <div style={{ fontWeight: 900, fontSize: 150, color: "#1a1410", fontVariantNumeric: "tabular-nums", marginRight: 90 }}>{free ? "FREE" : "$" + v.toFixed(2)}</div>
    </div>
    <Tag tt={tt} at={3.2} x={960} y={880} txt="NOBODY ASKS FOR IT" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 4:50 · EL DOMINÓ: una ficha gira y muestra 1 punto blanco contra 3 rosados ----
export const HDomino: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = 180 * (1 - eio(tt, 0.3, 1.6)), pip = (x: number, y: number, c: string, i: number) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 70, height: 70, borderRadius: 35, background: c, transform: `scale(${cl(phys(tt, 1.7 + i * 0.18, 9, 0.4))})`, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.2)" }} />;
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${r}deg)`, width: 360, height: 680, borderRadius: 30, background: "#1b1b1d", border: "8px solid #3a3a3d", boxShadow: sh(40) }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 332, height: 8, background: "#3a3a3d" }} />
      {pip(145, 130, "#fbf5ea", 0)}
      {pip(60, 410, mix(PINK, PINK, 0), 1)}{pip(145, 480, mix(PINK, PINK, 0), 2)}{pip(230, 550, mix(PINK, PINK, 0), 3)}
    </div>
    <Tag tt={tt} at={2.4} x={480} y={420} txt="1 WHITE" col={TX} size={56} />
    <Tag tt={tt} at={2.7} x={1440} y={660} txt="3 PINK" col={RED} size={56} />
  </>;
}}</Stage>;

// ---- 5:52 · LA PLACA DE PETRI: dos placas bajo el microscopio; la fría muestra granos sueltos, la tibia una mancha ----
export const HPetri: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sm = eio(tt, 1.2, 3.4);
  const dish = (x: number, warm: boolean) => <div style={{ position: "absolute", left: x, top: 300, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#2a1212,#120707)", border: "10px solid rgba(220,240,255,.5)", overflow: "hidden" }}>
    {Array.from({ length: 40 }, (_, i) => { const s = warm ? 1 + sm * 2.4 : 1; return <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 420, top: 40 + rnd(i + 9) * 420, width: 30 * s, height: 22 * s, borderRadius: warm ? 30 * sm + 6 : 6, background: `rgba(248,242,230,${warm ? 1 - 0.5 * sm : 1})`, filter: warm ? `blur(${sm * 6}px)` : undefined }} />; })}
  </div>;
  return <>
    {dish(340, false)}{dish(1060, true)}
    <Tag tt={tt} at={0.6} x={600} y={240} txt="COLD · SEPARATE" col={ICE} size={46} />
    <Tag tt={tt} at={0.9} x={1320} y={240} txt="WARM · SMEARED" col={RED} size={46} />
    <Tag tt={tt} at={3.4} x={600} y={900} txt="= JUICE" col={GRN} size={50} />
  </>;
}}</Stage>;

// ---- 6:10 · LA HELADERA DE CAMPING: la tapa se cierra de golpe con las bandejas adentro y sale escarcha ----
export const HCooler: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const c = cl(phys(tt, 1.0, 9, 0.35)), puff = cl((tt - 1.15) * 1.6);
  return <>
    <div style={{ position: "absolute", left: 560, top: 520, width: 800, height: 360, borderRadius: 30, background: "linear-gradient(180deg,#2f86c9,#1d5f94)", boxShadow: sh(40) }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 120, borderRadius: 16, background: "#eaf4fb" }} />
    </div>
    <div style={{ position: "absolute", left: 540, top: 470, width: 840, height: 80, borderRadius: 24, background: "#f3f6f8", transformOrigin: "50% 100%", transform: `perspective(1200px) rotateX(${-100 * (1 - c)}deg)`, boxShadow: sh(20) }} />
    {tt > 1.1 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 560 + i * 60, top: 480 - puff * (80 + rnd(i) * 80), width: 70, height: 70, borderRadius: 35, background: "rgba(220,240,255,.6)", opacity: 1 - puff, filter: "blur(8px)" }} />)}
    <Tag tt={tt} at={1.6} x={960} y={300} txt="«SAUSAGE IS MADE IN WINTER»" col={ICE} size={52} />
  </>;
}}</Stage>;

// ---- 7:01 · LA REGLA DE TAMAÑOS: arveja · grava · pasta; el puntero elige la arveja ----
export const HPea: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const sel = eio(tt, 1.6, 2.6);
  const it = (x: number, lbl: string, el: React.ReactNode, i: number, ok: boolean) => <div key={i} style={{ position: "absolute", left: x, top: 420, width: 360, textAlign: "center", opacity: cl((tt - 0.3 - i * 0.25) * 3) }}>
    <div style={{ height: 220, display: "grid", placeItems: "center" }}>{el}</div>
    <div style={{ fontWeight: 900, fontSize: 44, color: ok ? GRN : DIM }}>{lbl}</div>
  </div>;
  return <>
    <Head tt={tt} kick="NUMBER FOUR" title="GRIND IT COARSE" />
    {it(300, "PEA", <div style={{ width: 90, height: 90, borderRadius: 45, background: "radial-gradient(circle at 35% 35%,#c9f08a,#5c9a2a)" }} />, 0, true)}
    {it(780, "GRAVEL", <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: 200 }}>{Array.from({ length: 10 }, (_, k) => <div key={k} style={{ width: 34, height: 28, borderRadius: 8, background: k % 3 ? mix(PINK, PINK, 0) : "#fbf5ea" }} />)}</div>, 1, true)}
    {it(1260, "PASTE", <div style={{ width: 220, height: 90, borderRadius: 45, background: "#f0a8b4" }} />, 2, false)}
    <div style={{ position: "absolute", left: 1320, top: 520, width: 240 * sel, height: 14, background: RED, transform: "rotate(-20deg)" }} />
    <Tag tt={tt} at={2.6} x={960} y={860} txt="WHITE FAT STAYS IN BITS" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 7:38 · EL BATERISTA: dos cuchillas de carnicero golpean como palillos sobre la tabla, con ondas de cada golpe ----
export const HDrummer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const b = (o: number) => Math.abs(Math.sin(tt * 7 + o));
  return <>
    <div style={{ position: "absolute", left: 460, top: 700, width: 1000, height: 90, borderRadius: 20, background: "linear-gradient(180deg,#c99a5e,#8e6436)", boxShadow: sh(30) }} />
    {[0, 1].map((i) => { const k = b(i * 1.57); return <div key={i} style={{ position: "absolute", left: i ? 1080 : 620, top: 420 - 200 * k, transformOrigin: "50% 100%", transform: `rotate(${(i ? 1 : -1) * (10 + 20 * k)}deg)` }}>
      <div style={{ width: 220, height: 160, borderRadius: "10px 10px 4px 60px", background: "linear-gradient(135deg,#eef2f5,#9aa3ab)" }} />
      <div style={{ width: 46, height: 140, margin: "0 0 0 160px", background: "#3a2414", borderRadius: 10 }} />
    </div>; })}
    {[0, 1].map((i) => { const k = b(i * 1.57); return k < 0.15 && <div key={"w" + i} style={{ position: "absolute", left: (i ? 1180 : 720) - 80, top: 690, width: 160, height: 30, borderRadius: "50%", border: `5px solid ${AMB}` }} />; })}
    <Tag tt={tt} at={0.8} x={960} y={220} txt="GRANDMA'S WAY · TWO CLEAVERS" col={AMB} size={46} />
    <Tag tt={tt} at={2.4} x={960} y={900} txt="20 MINUTES · TIRED ARMS" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 7:47 · EL BOTÓN APRETADO: un dedo aprieta el botón y el medidor de calor sube a rojo ----
export const HButton: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.3, 0.7), heat = eio(tt, 0.8, 4.0);
  return <>
    <div style={{ position: "absolute", left: 520, top: 560, width: 380, height: 160, borderRadius: 30, background: "#2a2c30", boxShadow: sh(30) }}>
      <div style={{ position: "absolute", left: 110, top: 30 + 20 * p, width: 160, height: 100 - 20 * p, borderRadius: 24, background: RED, boxShadow: `0 ${12 - 10 * p}px 0 #8a1f15` }} />
    </div>
    <div style={{ position: "absolute", left: 610, top: 300 + 60 * p, width: 120, height: 280, borderRadius: "60px 60px 20px 20px", background: "#e7c3a6" }} />
    <div style={{ position: "absolute", left: 1120, top: 260, width: 120, height: 560, borderRadius: 60, background: "#1a1b1e", border: "6px solid #444", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${10 + 85 * heat}%`, background: `linear-gradient(0deg, ${ICE}, ${AMB} 50%, ${RED})` }} />
    </div>
    <Tag tt={tt} at={2.4} x={1280} y={400} txt="BLADE HEATS · FAT SMEARS" col={RED} size={30} anchor="l" />
    <Tag tt={tt} at={3.2} x={960} y={900} txt="SHORT PULSES · COUNT THEM" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 8:10 · LA LIBRETA NEGRA: la gomita salta, la tapa se abre y aparecen las columnas carne / sal ----
export const HNotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const snap = phys(tt, 0.7, 9, 0.35), op = eio(tt, 1.1, 2.0);
  return <>
    <div style={{ position: "absolute", left: 960, top: 300, width: 520, height: 640, background: "#f4ecd8", borderRadius: "4px 16px 16px 4px", boxShadow: sh(30), padding: "60px 50px", boxSizing: "border-box", fontFamily: HAND, fontSize: 48, color: "#2b241c" }}>
      {["PORK  ·  SALT", "4 lb  ·  7 tsp", "10 lb  ·  17½", "200 lb  ·  …"].map((l, i) => <div key={i} style={{ borderBottom: "2px solid #c9bfa8", padding: "14px 0", opacity: cl((tt - 2.0 - i * 0.3) * 3) }}>{l}</div>)}
    </div>
    <div style={{ position: "absolute", left: 960, top: 300, width: 520, height: 640, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-170 * op}deg)`, background: "linear-gradient(90deg,#141414,#2a2a2a)", borderRadius: "4px 16px 16px 4px", boxShadow: sh(30) }} />
    <div style={{ position: "absolute", left: 1040 - 600 * cl(snap), top: 300 + 280 - 380 * cl(snap), width: 30, height: 660, borderRadius: 15, background: "#b33a2a", transform: `rotate(${60 * cl(snap)}deg)`, opacity: 1 - cl((tt - 1.4) * 2) }} />
    <Tag tt={tt} at={3.4} x={960} y={1000} txt="HE DIDN'T GUESS" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 8:24 · EL TERMÓMETRO DE SABOR: una aguja entre «SOSO» y «CASTIGO» que se queda en el centro ----
export const HGoldilocks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = -70 + 140 * eio(tt, 0.4, 1.0) - 140 * eio(tt, 1.0, 1.6) + 70 * eio(tt, 1.6, 2.6);
  return <>
    <SV>
      <path d="M560 760 A400 400 0 0 1 1360 760" fill="none" stroke="#2c2f35" strokeWidth={70} />
      <path d="M560 760 A400 400 0 0 1 760 413" fill="none" stroke={ICE} strokeWidth={70} />
      <path d="M760 413 A400 400 0 0 1 1160 413" fill="none" stroke={GRN} strokeWidth={70} />
      <path d="M1160 413 A400 400 0 0 1 1360 760" fill="none" stroke={RED} strokeWidth={70} />
      <g transform={`rotate(${a} 960 760)`}><path d="M950 760 L960 410 L970 760 Z" fill="#fff" /><circle cx={960} cy={760} r={30} fill="#fff" /></g>
    </SV>
    <Tag tt={tt} at={0.4} x={520} y={860} txt="TASTELESS" col={ICE} size={40} />
    <Tag tt={tt} at={0.6} x={1400} y={860} txt="A PUNISHMENT" col={RED} size={40} />
    <Tag tt={tt} at={2.6} x={960} y={250} txt="PEOPLE COME BACK" col={GRN} size={52} />
  </>;
}}</Stage>;
