// stan29c · componentes únicos 1-14 (min 0-10). Pollo asado: cada uno es el OBJETO de la idea dentro del escenario Stage.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PALE = [238, 214, 190], GOLD = [176, 104, 40];
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
// pollo plano visto de arriba (mariposa)
const Flat: React.FC<{ x: number; y: number; w: number; k: number }> = ({ x, y, w, k }) => <svg width={w} height={w * 0.75} viewBox="0 0 400 300" style={{ position: "absolute", left: x, top: y }}>
  <path d="M200 40 C280 40 330 90 340 140 C390 160 395 230 350 260 C300 280 260 250 230 240 L170 240 C140 250 100 280 50 260 C5 230 10 160 60 140 C70 90 120 40 200 40 Z" fill={mix(PALE, GOLD, k)} stroke="rgba(0,0,0,.2)" strokeWidth={4} />
  <path d="M200 60 L200 230" stroke="rgba(0,0,0,.12)" strokeWidth={6} />
</svg>;

// ---- 0:08 · LA PIEL QUE CRUJE: un domo color miel; el cuchillo apoya y se abren grietas como vidrio ----
export const HCrackle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = eio(tt, 1.4, 3.2), kn = eio(tt, 0.4, 1.4);
  const cracks = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + rnd(i); let x = 960, y = 470, d = `M${x} ${y}`; for (let s = 1; s <= 5; s++) { x += Math.cos(a + (rnd(i * 7 + s) - 0.5)) * 60; y += Math.sin(a + (rnd(i * 5 + s) - 0.5)) * 40; d += ` L${x} ${y}`; } return d; });
  return <>
    <SV>
      <defs><radialGradient id="hon" cx="40%" cy="30%"><stop offset="0" stopColor="#e9a64e" /><stop offset="1" stopColor="#7a3d12" /></radialGradient></defs>
      <path d="M560 760 Q560 300 960 280 Q1360 300 1360 760 Z" fill="url(#hon)" />
      {cracks.map((d, i) => <path key={i} d={d} stroke="rgba(255,235,190,.85)" strokeWidth={3} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - c)} />)}
      <rect x={480} y={760} width={960} height={26} rx={10} fill="#e9e4dc" />
    </SV>
    <div style={{ position: "absolute", left: 960, top: 470 - 260 * (1 - kn), width: 30, height: 260, transform: "translate(-50%,-100%)", background: "linear-gradient(90deg,#c9d0d8,#8e979f)", borderRadius: "0 0 14px 14px" }} />
    <Tag tt={tt} at={2.4} x={1560} y={380} txt="DARK HONEY" col={AMB} size={50} />
    <Tag tt={tt} at={3.0} x={1560} y={460} txt="IT CRACKS" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 0:30 · EL FLOTADOR VIEJO: un salvavidas de pileta se bambolea en el agua y se arruga desinflándose ----
export const HFloat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#0e2b3a,#061218)">{(tt) => {
  const dfl = eio(tt, 1.6, 4.4), bob = 14 * Math.sin(tt * 2.2);
  return <>
    <SV>
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0 ${640 + i * 60} ${Array.from({ length: 13 }, (_, k) => `Q${k * 160 + 80} ${640 + i * 60 + 12 * Math.sin(tt * 2 + k + i)} ${(k + 1) * 160} ${640 + i * 60}`).join(" ")}`} stroke="rgba(143,214,255,.25)" strokeWidth={4} fill="none" />)}
      <g transform={`translate(960 ${600 + bob}) scale(1 ${1 - 0.45 * dfl})`}>
        <ellipse rx={300} ry={110} fill={mix([250, 240, 230], [215, 205, 190], dfl)} />
        <ellipse rx={140} ry={44} fill="#0e2b3a" />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-280 + i * 60} ${-60 + 10 * Math.sin(i)} q20 ${30 * dfl} 0 ${60 * dfl}`} stroke="rgba(0,0,0,.18)" strokeWidth={5} fill="none" />)}
      </g>
    </SV>
    <Tag tt={tt} at={2.2} x={960} y={300} txt="PALE · WET · RUBBERY" col={RED} size={52} />
  </>;
}}</Stage>;

// ---- 1:35 · LA CAMIONETA DE ARNE: entra desde la derecha con patente de Wisconsin y frena con rebote ----
export const HTruck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = phys(tt, 0.3, 4, 0.55), x = 1400 * (1 - p), wh = (1 - cl(p)) * 900;
  return <>
    <Tag tt={tt} at={2.4} x={420} y={240} txt="1968 · EVERY THURSDAY" col={AMB} size={46} anchor="l" />
    <div style={{ position: "absolute", left: 560 + x, top: 420, width: 820, height: 380, transform: `rotate(${(1 - p) * -1.5}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 140, width: 520, height: 170, background: "#3d6b4a", borderRadius: "10px 0 0 10px" }} />
      <div style={{ position: "absolute", left: 500, top: 30, width: 300, height: 280, background: "#4a7d58", borderRadius: "60px 30px 10px 10px" }}>
        <div style={{ margin: "30px 0 0 40px", width: 200, height: 110, background: "rgba(180,220,240,.6)", borderRadius: "40px 10px 6px 6px" }} />
      </div>
      {[120, 640].map((wx) => <div key={wx} style={{ position: "absolute", left: wx, top: 250, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle,#999 0 22%,#151515 24%)", transform: `rotate(${wh}deg)` }}><div style={{ position: "absolute", left: 60, top: 10, width: 10, height: 40, background: "#777" }} /></div>)}
      <div style={{ position: "absolute", left: 20, top: 200, width: 200, height: 56, background: "#f4ecd2", border: "4px solid #233", borderRadius: 6, fontWeight: 900, fontSize: 24, textAlign: "center", lineHeight: "48px", color: "#233" }}>WISCONSIN</div>
      {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 120, top: 60, width: 100, height: 90, background: "#c49a63", border: "4px solid #6d4c26" }} />)}
    </div>
  </>;
}}</Stage>;

// ---- 2:05 · EL BAÑO DE AGUA HELADA: el pollo baja al tanque y se llena de agua de abajo hacia arriba ----
export const HDunk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const d = eio(tt, 0.4, 1.6), soak = eio(tt, 1.6, 4.6);
  return <>
    <Head tt={tt} kick="BIG PLANTS" title="A BATH OF ICE WATER" col={ICE} />
    <div style={{ position: "absolute", left: 520, top: 420, width: 880, height: 520, border: "10px solid #9aa3ad", borderTop: "none", borderRadius: "0 0 30px 30px", background: "linear-gradient(180deg, rgba(143,214,255,.15), rgba(143,214,255,.4))" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 780, top: 40 + rnd(i + 3) * 360, width: 70, height: 60, background: "rgba(230,245,255,.5)", borderRadius: 8, transform: `rotate(${i * 20 + tt * 5}deg)` }} />)}
    </div>
    <div style={{ position: "absolute", left: 760, top: 160 + 420 * d, width: 400, height: 300, borderRadius: "45% 45% 40% 40%", overflow: "hidden", background: mix(PALE, [240, 220, 200], 0) }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${soak * 100}%`, background: "rgba(120,190,240,.55)" }} />
    </div>
    <div style={{ position: "absolute", left: 1460, top: 520, fontWeight: 900, fontSize: 110, color: ICE, fontVariantNumeric: "tabular-nums" }}>+{Math.round(12 * soak)}%</div>
    <div style={{ position: "absolute", left: 1460, top: 660, fontWeight: 800, fontSize: 30, color: DIM, letterSpacing: 3 }}>WATER YOU PAY FOR</div>
  </>;
}}</Stage>;

// ---- 2:55 · ABRIRLO COMO UN LIBRO: la tapa del libro se abre en 3D y adentro el pollo queda plano ----
export const HBook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const o = eio(tt, 0.8, 3.0);
  return <>
    <Head tt={tt} kick="NUMBER TWO" title="OPEN IT LIKE A BOOK" />
    <div style={{ position: "absolute", left: 960, top: 300, width: 520, height: 560, perspective: 1800 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 560, background: "#f1e9d6", borderRadius: "0 12px 12px 0", boxShadow: sh(30) }} />
      <Flat x={30} y={150} w={460} k={0.15} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 560, transformOrigin: "0 50%", transform: `rotateY(${-178 * o}deg)`, background: "linear-gradient(90deg,#6e2a1e,#8b3a2a)", borderRadius: "0 12px 12px 0", display: "grid", placeItems: "center", fontFamily: HAND, fontSize: 80, color: "#f3dcb0", backfaceVisibility: "hidden", boxShadow: sh(20) }}>Spatchcock</div>
    </div>
  </>;
}}</Stage>;

// ---- 3:15 · LAS TIJERAS: las hojas cortan por la línea punteada dos veces, snip snip, y el espinazo sale ----
export const HShears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c1 = eio(tt, 0.4, 1.8), c2 = eio(tt, 1.9, 3.2), up = phys(tt, 3.4, 6, 0.5), ang = 22 * Math.abs(Math.sin(tt * 9)) * (tt < 3.2 ? 1 : 0);
  const y1 = 260 + 520 * c1, y2 = 260 + 520 * c2;
  return <>
    <SV>
      <path d="M960 240 C1220 250 1300 420 1290 560 C1280 720 1180 820 960 830 C740 820 640 720 630 560 C620 420 700 250 960 240 Z" fill={mix(PALE, [230, 196, 170], 0.3)} />
      <line x1={900} y1={260} x2={900} y2={800} stroke="rgba(0,0,0,.4)" strokeWidth={4} strokeDasharray="14 10" />
      <line x1={1020} y1={260} x2={1020} y2={800} stroke="rgba(0,0,0,.4)" strokeWidth={4} strokeDasharray="14 10" />
      <line x1={900} y1={260} x2={900} y2={y1} stroke="#7a1f15" strokeWidth={6} />
      <line x1={1020} y1={260} x2={1020} y2={y2} stroke="#7a1f15" strokeWidth={6} />
      <g transform={`translate(0 ${-500 * cl(up)})`}><rect x={912} y={270} width={96} height={520} rx={40} fill="#e8cdb4" stroke="#b98c6c" strokeWidth={4} />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={926} y={300 + i * 54} width={68} height={22} rx={10} fill="#d7b394" />)}</g>
    </SV>
    <div style={{ position: "absolute", left: tt < 1.9 ? 900 : 1020, top: tt < 1.9 ? y1 : y2, transform: "translate(-50%,-30%)", opacity: tt < 3.3 ? 1 : 0 }}>
      <div style={{ position: "absolute", width: 26, height: 200, background: "#c9d0d8", transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${-ang}deg)`, borderRadius: 12 }} />
      <div style={{ position: "absolute", width: 26, height: 200, background: "#aeb6be", transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${ang}deg)`, borderRadius: 12 }} />
      <div style={{ position: "absolute", left: -60, top: 10, width: 120, height: 80, border: "14px solid #b8261b", borderRadius: "50%" }} />
    </div>
    <Tag tt={tt} at={1.0} x={1500} y={340} txt="SNIP" col={AMB} size={70} />
    <Tag tt={tt} at={2.4} x={1560} y={440} txt="SNIP" col={AMB} size={70} />
  </>;
}}</Stage>;

// ---- 4:00 · EL NIVEL DE ALBAÑIL: sobre el pollo redondo la burbuja se va a un costado; sobre el plano queda al centro ----
export const HSpirit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const f = eio(tt, 2.4, 3.6), tilt = 14 * (1 - f), bub = 200 * (1 - f) * (1 + 0.05 * Math.sin(tt * 3));
  return <>
    <Head tt={tt} kick="WHY FLAT" title="ONE LEVEL · ONE SPEED" />
    <SV>
      <path d={`M560 820 Q${960 - 380 * f} ${360 + 300 * f} 960 ${330 + 340 * f} Q${960 + 380 * f} ${360 + 300 * f} 1360 820 Z`} fill={mix(PALE, GOLD, 0.25)} />
      <g transform={`translate(960 ${300 + 340 * f}) rotate(${tilt})`}>
        <rect x={-420} y={-50} width={840} height={70} rx={12} fill="#e2b13a" stroke="#8a6a1a" strokeWidth={5} />
        <rect x={-110} y={-36} width={220} height={42} rx={21} fill="#cbe9a8" stroke="#557a2a" strokeWidth={4} />
        <line x1={-40} x2={-40} y1={-36} y2={6} stroke="#333" strokeWidth={3} /><line x1={40} x2={40} y1={-36} y2={6} stroke="#333" strokeWidth={3} />
        <ellipse cx={Math.min(90, bub * 0.45)} cy={-15} rx={30} ry={14} fill="#f6fff0" />
      </g>
    </SV>
    <Tag tt={tt} at={0.6} x={420} y={900} txt="ROUND: BREAST HIGH, THIGHS LOW" col={RED} size={38} anchor="l" />
    <Tag tt={tt} at={3.6} x={1500} y={900} txt="FLAT: ALL AT ONCE" col={GRN} size={42} />
  </>;
}}</Stage>;

// ---- 4:50 · LA OLLA DE LAS SEÑORAS DEL VIERNES: caen espinazo, cebolla, zanahoria, apio y laurel; sube el vapor ----
export const HPot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const items = [["BACK", "#e8cdb4"], ["ONION", "#e9d9a6"], ["CARROT", "#e7822e"], ["CELERY", "#8cc66b"], ["BAY", "#4f7d3a"]];
  return <>
    <Head tt={tt} kick="NUMBER THREE" title="THE BACKBONE IS SOUP" />
    {items.map(([n, c], i) => { const f = cl((tt - 0.5 - i * 0.55) / 0.7); return f < 1 && tt > 0.5 + i * 0.55 && <div key={n} style={{ position: "absolute", left: 760 + i * 90, top: 180 + f * f * 420, width: 120, height: 70, borderRadius: 30, background: c, transform: `rotate(${f * 200}deg)`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20, color: "#222" }}>{n}</div>; })}
    <div style={{ position: "absolute", left: 660, top: 600, width: 600, height: 320, background: "linear-gradient(90deg,#5d6268,#9aa3ad 40%,#5d6268)", borderRadius: "0 0 60px 60px", boxShadow: sh(40) }} />
    <div style={{ position: "absolute", left: 640, top: 580, width: 640, height: 50, borderRadius: 25, background: "#3a3d42" }} />
    {Array.from({ length: 6 }, (_, i) => { const d = ((tt * 0.5 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: 760 + i * 70 + 30 * Math.sin(tt + i), top: 560 - d * 380, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.14)", filter: "blur(14px)", opacity: (1 - d) * cl(tt - 2) }} />; })}
    <Tag tt={tt} at={3.4} x={1560} y={700} txt="EVERY FRIDAY" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 5:28 · EL BILLETE A LA BASURA: un dólar se arruga en bollo y cae al tacho; el contador del año suma ----
export const HTrash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cr = eio(tt, 0.6, 1.6), fall = eio(tt, 1.6, 2.4), n = Math.round(52 * eio(tt, 2.4, 4.6));
  return <>
    <div style={{ position: "absolute", left: 760, top: 260 + fall * 420, width: 420 - 300 * cr, height: 180 - 80 * cr, borderRadius: 8 + 60 * cr, background: "linear-gradient(135deg,#9fc29a,#6c9a6a)", border: "4px solid #3f6a3e", transform: `rotate(${cr * 120 + fall * 200}deg)`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 70 - 40 * cr, color: "#234a22", opacity: 1 - eio(tt, 2.2, 2.5) }}>$1</div>
    <div style={{ position: "absolute", left: 800, top: 680, width: 340, height: 300, background: "linear-gradient(90deg,#4b5157,#7b838b,#4b5157)", clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)" }} />
    <div style={{ position: "absolute", left: 780, top: 660, width: 380, height: 34, borderRadius: 10, background: "#2f3338" }} />
    <div style={{ position: "absolute", left: 1300, top: 420, fontWeight: 900, fontSize: 140, color: RED, fontVariantNumeric: "tabular-nums" }}>${n}</div>
    <div style={{ position: "absolute", left: 1300, top: 590, fontWeight: 800, fontSize: 30, color: DIM, letterSpacing: 3 }}>A CHICKEN A WEEK · A YEAR</div>
  </>;
}}</Stage>;

// ---- 6:00 · EL MAPA DE SALPICADURAS: vista de arriba de la pileta; las gotas llegan al repasador, la mesada y la ensalada ----
export const HSplash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 0.5, 3.8);
  const spots: [number, number, string][] = [[520, 330, "DISH TOWEL"], [1420, 320, "COUNTER"], [1460, 760, "SALAD"], [470, 760, "SPONGE"]];
  return <>
    <div style={{ position: "absolute", left: 760, top: 380, width: 400, height: 300, borderRadius: 40, background: "#9aa3ad", boxShadow: "inset 0 20px 40px rgba(0,0,0,.5)" }} />
    <SV>
      {[1, 2, 3].map((k) => <circle key={k} cx={960} cy={530} r={200 * k * r} fill="none" stroke="rgba(255,90,74,.5)" strokeWidth={3} strokeDasharray="8 10" />)}
      {Array.from({ length: 60 }, (_, i) => { const a = rnd(i) * Math.PI * 2, d = (160 + rnd(i + 9) * 520) * r; return <circle key={i} cx={960 + Math.cos(a) * d} cy={530 + Math.sin(a) * d * 0.8} r={4 + 5 * rnd(i + 2)} fill="#ff8a7a" opacity={0.75} />; })}
    </SV>
    {spots.map(([x, y, s], i) => <Tag key={s} tt={tt} at={1.6 + i * 0.4} x={x} y={y} txt={s} col={RED} size={34} />)}
    <Tag tt={tt} at={3.8} x={960} y={950} txt="2-3 FEET · DON'T WASH IT" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 7:25 · CUCHARITAS POR LIBRA: aparecen 4 pesas de una libra y al lado de cada una cae una cucharadita ----
export const HSpoons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="NUMBER FIVE" title="1 TSP PER POUND" />
  {Array.from({ length: 4 }, (_, i) => { const w = phys(tt, 0.4 + i * 0.4, 7, 0.45), s = phys(tt, 1.0 + i * 0.4, 7, 0.45); return <React.Fragment key={i}>
    <div style={{ position: "absolute", left: 420 + i * 300, top: 600, transform: `translateY(${(1 - cl(w)) * -500}px)`, opacity: cl(w * 3), width: 180, height: 150, background: "linear-gradient(180deg,#5d6268,#2f3338)", clipPath: "polygon(18% 0,82% 0,100% 100%,0 100%)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 40, color: TX }}>1 LB</div>
    <div style={{ position: "absolute", left: 470 + i * 300, top: 430, transform: `translateY(${(1 - cl(s)) * -400}px) rotate(${-20 + 20 * cl(s)}deg)`, opacity: cl(s * 3) }}>
      <div style={{ width: 80, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #fff 0 45%, #c9d0d8 47%)" }} />
      <div style={{ marginLeft: 70, marginTop: -30, width: 120, height: 14, borderRadius: 7, background: "#c9d0d8", transform: "rotate(-12deg)" }} />
    </div>
  </React.Fragment>; })}
  <Tag tt={tt} at={3.2} x={960} y={880} txt="4 LB CHICKEN = 4 TSP KOSHER" col={AMB} size={46} />
</>}</Stage>;

// ---- 7:45 · EL BOLSILLO DE PIEL: corte transversal; los dedos levantan la piel, las membranas se estiran y ceden, entra la sal ----
export const HPocket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lift = eio(tt, 0.6, 2.4), salt = eio(tt, 2.6, 4.4);
  return <>
    <Head tt={tt} kick="UNDER THE SKIN" title="SALT THE MEAT, NOT THE SKIN" />
    <SV>
      <path d="M300 820 Q960 560 1620 820 L1620 980 L300 980 Z" fill="#e7b9a6" />
      <path d={`M300 ${810 - 40 * lift} Q960 ${540 - 120 * lift} 1620 ${810 - 40 * lift}`} stroke="#f2dcc0" strokeWidth={24} fill="none" />
      {Array.from({ length: 9 }, (_, i) => { const x = 420 + i * 135, base = 820 - 260 * Math.sin(((x - 300) / 1320) * Math.PI) * 0.92, top = base - 10 - 90 * lift * Math.sin(((x - 300) / 1320) * Math.PI); const snap = lift > 0.55 + i * 0.03; return !snap && <line key={i} x1={x} y1={base} x2={x} y2={top} stroke="rgba(255,255,255,.6)" strokeWidth={3} />; })}
      {Array.from({ length: 40 }, (_, i) => { const x = 380 + rnd(i) * 1160, base = 820 - 260 * Math.sin(((x - 300) / 1320) * Math.PI) * 0.92; return <rect key={i} x={x} y={base - 16 - 40 * (1 - salt) * rnd(i + 3)} width={10} height={10} fill="#fff" opacity={cl(salt * 2 - rnd(i))} transform={`rotate(45 ${x} ${base})`} />; })}
    </SV>
  </>;
}}</Stage>;

// ---- 8:35 · NAVIDAD DEL 74: la vidriera del negocio con nieve que cae, guirnalda y una fila de clientes en sombra ----
export const HSnow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#0b1424,#05070c)">{(tt) => {
  const n = Math.round(1 + 11 * eio(tt, 0.6, 3.6));
  return <>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 560, background: "linear-gradient(180deg,#3a2a18,#1d150c)", border: "16px solid #5a4028", boxShadow: "0 0 120px rgba(255,190,110,.25)" }}>
      <div style={{ position: "absolute", inset: 40, background: "radial-gradient(ellipse at 50% 60%, #ffcf8a, #b06a2a 70%)", opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 110, color: "#5a1d12" }}>Stan's Meats</div>
      <div style={{ position: "absolute", left: 940, top: 290, width: 200, height: 200, borderRadius: "50%", border: "30px solid #2f6b3a" }} />
    </div>
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 112, top: 720 + 8 * Math.sin(tt * 2 + i), width: 80, height: 220, borderRadius: "40px 40px 10px 10px", background: "#0a0c10" }} />)}
    {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: (rnd(i) * 1920 + 30 * Math.sin(tt + i)) % 1920, top: ((rnd(i + 5) * 1080 + tt * (60 + 40 * rnd(i))) % 1100) - 20, width: 6 + 6 * rnd(i + 1), height: 6 + 6 * rnd(i + 1), borderRadius: "50%", background: "#fff", opacity: 0.8 }} />)}
    <Tag tt={tt} at={1.0} x={960} y={140} txt="CHRISTMAS WEEK · 1974" col={TX} size={48} />
  </>;
}}</Stage>;

// ---- 9:05 · PIEL A CONTRALUZ: la lámina de piel se levanta frente a una lámpara y de a poco la luz la atraviesa ----
export const HBacklit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.8, 4.0);
  return <>
    <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,240,200,${0.3 + 0.7 * k}), transparent 70%)`, filter: "blur(10px)" }} />
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) rotate(${-4 + 2 * Math.sin(tt * 0.8)}deg) perspective(1200px) rotateY(${8 * Math.sin(tt * 0.5)}deg)`, width: 620, height: 440, borderRadius: "40% 50% 45% 55%", background: `rgba(${238 - 20 * k},${214 - 10 * k},${170 - 30 * k},${1 - 0.55 * k})`, boxShadow: `inset 0 0 80px rgba(255,220,150,${0.6 * k})` }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 540, top: 40 + rnd(i + 3) * 360, width: 8, height: 8, borderRadius: 4, background: "rgba(120,80,40,.4)" }} />)}
    </div>
    <Tag tt={tt} at={2.6} x={960} y={860} txt="DRY · TIGHT · LIKE PARCHMENT" col={AMB} size={48} />
  </>;
}}</Stage>;
