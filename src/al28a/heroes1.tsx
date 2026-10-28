// componentes únicos de al28a (grietas en la pared) · 1-16 (minutos 0-10). Cada uno = lo que se dice en ese segundo, dibujado en código.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

// ---------- piezas comunes ----------
// paño de pared pintada (látex crema con grano de revoque), con sombra de luz rasante desde la izquierda
export const Wall: React.FC<{ x: number; y: number; w: number; h: number; col?: string; rot?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, col = "#e8dfcc", rot = 0, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10, overflow: "hidden", transform: `rotate(${rot}deg)`, background: `linear-gradient(100deg, rgba(0,0,0,.18), transparent 35%), ${col}`, boxShadow: "0 40px 90px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.18)", ...style }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(90,70,40,.16) 1.2px, transparent 1.6px), radial-gradient(rgba(255,255,255,.25) 1px, transparent 1.4px)", backgroundSize: "9px 9px, 13px 13px", backgroundPosition: "0 0, 4px 6px" }} />
    {children}
  </div>
);
// grieta en SVG: d = path; p = cuánto se dibujó (0-1); w = grosor; glow = halo ámbar
export const CrackSvg: React.FC<{ d: string; p: number; w?: number; glow?: number; col?: string; len?: number; W?: number; Hh?: number; style?: React.CSSProperties }> = ({ d, p, w = 6, glow = 0, col = "#2a2018", len = 1400, W = 1920, Hh = 1080, style }) => (
  <svg width={W} height={Hh} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
    {glow > 0 && <path d={d} stroke={AMB} strokeWidth={w + 16} strokeOpacity={0.35 * glow} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - cl(p))} />}
    <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - cl(p))} />
  </svg>
);
export const Check: React.FC<{ x: number; y: number; s: number; p: number; col?: string }> = ({ x, y, s, p, col = GRN }) => <svg width={s} height={s} style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}>
  <circle cx={s / 2} cy={s / 2} r={s * 0.44} fill="none" stroke={col} strokeWidth={s * 0.07} strokeDasharray={s * 2.8} strokeDashoffset={s * 2.8 * (1 - cl(p * 1.5))} />
  <path d={`M${s * 0.28} ${s * 0.52} L${s * 0.45} ${s * 0.68} L${s * 0.74} ${s * 0.34}`} stroke={col} strokeWidth={s * 0.09} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s} strokeDashoffset={s * (1 - cl(p * 1.5 - 0.5))} />
</svg>;
export const Cross: React.FC<{ x: number; y: number; s: number; p: number; col?: string }> = ({ x, y, s, p, col = RED }) => <svg width={s} height={s} style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}>
  <circle cx={s / 2} cy={s / 2} r={s * 0.44} fill="none" stroke={col} strokeWidth={s * 0.07} strokeDasharray={s * 2.8} strokeDashoffset={s * 2.8 * (1 - cl(p * 1.5))} />
  <path d={`M${s * 0.32} ${s * 0.32} L${s * 0.68} ${s * 0.68} M${s * 0.68} ${s * 0.32} L${s * 0.32} ${s * 0.68}`} stroke={col} strokeWidth={s * 0.09} fill="none" strokeLinecap="round" strokeDasharray={s} strokeDashoffset={s * (1 - cl(p * 1.5 - 0.5))} />
</svg>;
// moneda de canto o de frente (dorada, con reflejo que corre)
export const Coin: React.FC<{ x: number; y: number; r: number; edge?: number; rot?: number; tt?: number }> = ({ x, y, r, edge = 0, rot = 0, tt = 0 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, transform: `rotate(${rot}deg) scaleX(${1 - 0.9 * edge})` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${tt * 40}deg, #b8862a, #ffe39a, #c9952e, #f6d27a, #b8862a)`, boxShadow: `0 ${r * 0.25}px ${r * 0.6}px rgba(0,0,0,.55), inset 0 0 0 ${r * 0.08}px #9a6f1e` }} />
    <div style={{ position: "absolute", inset: r * 0.22, borderRadius: "50%", border: `${r * 0.04}px solid rgba(120,80,20,.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: r * 0.7, color: "rgba(110,72,18,.75)" }}>1</div>
  </div>
);
// testigo de yeso (pastilla blanca) con la fecha a lápiz; crack = rayita que lo cruza
export const Pill: React.FC<{ x: number; y: number; r: number; s?: number; crack?: number; date?: string; open?: number }> = ({ x, y, r, s = 1, crack = 0, date, open = 0 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, transform: `scale(${s})` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #ffffff, #efebe2 55%, #d8d2c4)", boxShadow: `0 ${r * 0.12}px ${r * 0.3}px rgba(0,0,0,.45)` }} />
    <div style={{ position: "absolute", left: -r * 0.6, right: -r * 0.6, top: r - 2, height: 4, background: "#3a3a42", opacity: 0.85 }} />
    {crack > 0 && <svg width={2 * r} height={2 * r} style={{ position: "absolute", inset: 0 }}><path d={`M${r * 0.75} 0 L${r * 1.05} ${r * 0.6} L${r * 0.85} ${r * 1.1} L${r * 1.2} ${r * 2}`} stroke="#1a1410" strokeWidth={3 + 8 * open} fill="none" strokeDasharray={r * 2.4} strokeDashoffset={r * 2.4 * (1 - cl(crack))} /></svg>}
    {date && <div style={{ position: "absolute", left: 2 * r + 14, top: r - 30, fontFamily: HAND, fontWeight: 700, fontSize: r * 0.42, color: "#3a3a42", whiteSpace: "nowrap" }}>{date}</div>}
  </div>
);

// ---- 0:00 · TRES VECES: la grieta, tres parches (yeso, enduido, masilla) que caen encima y la grieta vuelve a abrirse por el mismo camino ----
export const HThree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 40% 45%, #3a3226, #0b0907 78%)">{(tt) => {
  const D = "M960 210 L985 300 L955 380 L1000 470 L975 560 L1020 660 L990 760 L1030 860";
  const P = [{ c: "#f6f3ec", l: "YESO", a: 1.0 }, { c: "#e4ddcd", l: "ENDUIDO", a: 2.8 }, { c: "#d6cdb8", l: "MASILLA", a: 4.6 }];
  return <>
    <Wall x={560} y={150} w={800} h={780}>
      <CrackSvg d={D.replace(/(\d+) (\d+)/g, (_, a, b) => `${+a - 560} ${+b - 150}`)} p={1} w={7} />
      {P.map((q, i) => { const s = phys(tt, q.a, 7, 0.5), back = cl((tt - q.a - 1.0) / 0.6);
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 330 - 20 * i, top: 40 + 10 * i, width: 140 + 40 * i, height: 700, borderRadius: 30, background: q.c, opacity: cl(s * 2) * 0.96, transform: `translateY(${(1 - cl(s)) * -80}px)`, boxShadow: "0 10px 30px rgba(0,0,0,.25)" }} />
          {back > 0 && <CrackSvg d={D.replace(/(\d+) (\d+)/g, (_, a, b) => `${+a - 560} ${+b - 150}`)} p={back} w={6 + i} col="#3a2a1a" />}
        </React.Fragment>; })}
    </Wall>
    <Head tt={tt} kick="DOÑA MARTA · EN DOS AÑOS" title="LA TAPÓ TRES VECES" />
    {P.map((q, i) => <Tag key={i} tt={tt} at={q.a + 0.3} x={1580} y={330 + i * 170} txt={`${i + 1} · ${q.l}`} col={i === 2 ? AMB : TX} size={46} />)}
    <Tag tt={tt} at={6.2} x={1580} y={850} txt="Y VOLVIÓ IGUAL" col={RED} size={50} />
  </>;
}}</Stage>;

// ---- 0:40 · EL DETECTOR SIN PILA: tapar una grieta que avisa = sacarle la pila al detector de humo ----
export const HSmoke: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pull = eio(tt, 1.6, 2.8), blink = tt < 1.6 ? 0.5 + 0.5 * Math.sin(tt * 3) : 0;
  return <>
    <Head tt={tt} kick="TAPAR UNA GRIETA QUE AVISA" title="ES SACARLE LA PILA" col={RED} />
    {/* el detector en el techo */}
    <div style={{ position: "absolute", left: 960 - 230, top: 300, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #e2e0da 60%, #b9b6ae)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: "absolute", left: 230 + Math.cos(i / 24 * 6.28) * 150 - 6, top: 230 + Math.sin(i / 24 * 6.28) * 150 - 20, width: 12, height: 40, borderRadius: 6, background: "rgba(0,0,0,.12)", transform: `rotate(${i * 15 + 90}deg)` }} />)}
      <div style={{ position: "absolute", left: 210, top: 210, width: 40, height: 40, borderRadius: 20, background: blink > 0.5 ? "#ff3b2a" : "#5a1a14", boxShadow: blink > 0.5 ? "0 0 30px #ff3b2a" : "none" }} />
    </div>
    {/* la pila que sale */}
    <div style={{ position: "absolute", left: 1290 + pull * 260, top: 470 + pull * 160, width: 120, height: 200, borderRadius: 14, background: "linear-gradient(90deg,#1a1a1a,#3a3a3a 50%,#1a1a1a)", transform: `rotate(${pull * 35}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: -16, height: 20, borderRadius: 4, background: "#9a9a9a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 40, color: AMB }}>9V</div>
    </div>
    {/* el humo sigue */}
    {tt > 3.0 && Array.from({ length: 8 }, (_, i) => { const ph = ((tt - 3) * 0.3 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 500 + i * 120 + Math.sin(ph * 6 + i) * 40, top: 940 - ph * 300, width: 220, height: 160, borderRadius: "50%", background: "rgba(160,160,170,.35)", filter: "blur(30px)", opacity: Math.sin(ph * 3.14) }} />; })}
    <Tag tt={tt} at={3.4} x={960} y={880} txt="EL PROBLEMA SIGUE · YA NO TE AVISA" col={TX} size={44} />
  </>;
}}</Stage>;

// ---- 1:05 · SIETE GRIETAS: el plano de la casa de Doña Marta con siete chinches; la del dormitorio en rojo ----
export const HSeven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #1c2733, #06090d 80%)">{(tt) => {
  const R = [["LIVING", 380, 330, 520, 330], ["COCINA", 900, 330, 360, 330], ["PASILLO", 380, 660, 880, 110], ["DORMITORIO", 1260, 330, 330, 440], ["AFUERA", 1590, 330, 150, 440]] as const;
  const PINS: [number, number, string][] = [[520, 470, AMB], [700, 420, AMB], [600, 600, AMB], [1000, 380, AMB], [780, 715, AMB], [1420, 520, RED], [1660, 560, AMB]];
  return <>
    <Head tt={tt} kick="LA CASA DE DOÑA MARTA" title="SIETE GRIETAS" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {R.map(([n, x, y, w, hh], i) => { const s = cl(phys(tt, 0.3 + i * 0.18, 6, 0.6)); return <g key={i} opacity={s}><rect x={x} y={y} width={w} height={hh} fill={i === 4 ? "rgba(120,160,90,.12)" : "rgba(140,190,255,.06)"} stroke="rgba(160,210,255,.8)" strokeWidth={6} strokeDasharray={i === 4 ? "14 10" : undefined} /><text x={x + 18} y={y + 42} fontSize={28} fontWeight={800} fill="rgba(200,230,255,.85)" letterSpacing={3}>{n}</text></g>; })}
    </svg>
    {PINS.map(([x, y, c], i) => { const s = phys(tt, 1.6 + i * 0.4, 8, 0.4); return s > 0.01 ? <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22 - (1 - cl(s)) * 60, width: 44, height: 44, borderRadius: 22, background: `radial-gradient(circle at 35% 35%, #fff6, ${c})`, boxShadow: `0 0 ${c === RED ? 40 : 14}px ${c}`, transform: `scale(${s})` }} /> : null; })}
    <Tag tt={tt} at={4.9} x={1420} y={890} txt="ÉSTA NO SE TOCA" col={RED} size={40} />
    <Tag tt={tt} at={1.6} x={1560} y={210} txt={`${Math.min(7, Math.max(0, Math.floor((tt - 1.4) / 0.4) + 1))} / 7`} col={AMB} size={60} />
  </>;
}}</Stage>;

// ---- 1:30 · MENOS QUE UN CAFÉ: la pastillita de yeso en un platito al lado de la taza; la balanza se inclina hacia "lo que te ahorra" ----
export const HCoffee: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 40%, #2e2418, #080605 80%)">{(tt) => {
  const tilt = eio(tt, 2.6, 4.2) * 14;
  return <>
    <Head tt={tt} kick="EL TESTIGO DE YESO" title="CUESTA MENOS QUE UN CAFÉ" />
    <div style={{ position: "absolute", left: 960, top: 360, width: 20, height: 480, marginLeft: -10, background: "linear-gradient(90deg,#6a5236,#a8865a,#6a5236)", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 960 - 520, top: 360, width: 1040, height: 18, background: "linear-gradient(#c9a873,#7e6440)", borderRadius: 9, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }}>
      {/* plato izquierdo: taza + pastilla */}
      <div style={{ position: "absolute", left: -40, top: 10, width: 300, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 300, height: 30, borderRadius: "50%", background: "#d9d2c2" }} />
        <div style={{ position: "absolute", left: 60, top: 20, width: 130, height: 110, borderRadius: "0 0 50px 50px", background: "linear-gradient(90deg,#e9e4da,#ffffff 40%,#cfc8ba)" }} />
        <div style={{ position: "absolute", left: 186, top: 40, width: 40, height: 50, borderRadius: "0 30px 30px 0", border: "10px solid #ece7dd", borderLeft: "none" }} />
        <div style={{ position: "absolute", left: 200, top: 110, width: 60, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%, #fff, #e6e1d6)" }} />
      </div>
      {/* plato derecho: la casa */}
      <div style={{ position: "absolute", left: 780, top: 10, width: 300, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ position: "absolute", left: 0, top: 200, width: 300, height: 30, borderRadius: "50%", background: "#d9d2c2" }} />
        <svg width={300} height={220} style={{ position: "absolute", left: 0, top: -10 }}><path d="M40 210 L40 110 L150 30 L260 110 L260 210 Z" fill="#e8dfcc" stroke="#3a2a1a" strokeWidth={6} /><rect x={125} y={140} width={50} height={70} fill="#7a5638" /><path d="M200 120 L180 150 L195 175" stroke="#2a2018" strokeWidth={4} fill="none" /></svg>
      </div>
    </div>
    <Tag tt={tt} at={1.2} x={590} y={300} txt="UNA PASTILLA DE YESO" col={TX} size={36} />
    <Tag tt={tt} at={3.2} x={1340} y={300} txt="LO QUE TE PUEDE AHORRAR" col={AMB} size={36} />
    <Tag tt={tt} at={4.4} x={960} y={930} txt="TE DICE SI ES LA PINTURA O LA CASA" col={TX} size={42} />
  </>;
}}</Stage>;

// ---- 2:30 · LOS CUATRO TIPOS: cuatro paños de pared que caen como cartas, cada uno con su grieta dibujándose ----
const TIPOS = [
  { n: "DE PELO", d: "M40 60 L90 110 L70 170 M90 110 L160 120 L200 80 M160 120 L170 200 L120 250 M170 200 L240 230", c: GRN },
  { n: "ESQUINA DE VENTANA", d: "M150 120 L180 90 L195 55 L225 25", c: GRN, win: true },
  { n: "DIAGONAL", d: "M240 30 L210 70 L215 100 L180 130 L170 170 L130 200 L110 240", c: RED },
  { n: "HORIZONTAL", d: "M20 60 L80 62 L140 58 L200 63 L260 60", c: AMB },
];
export const HFour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="PUNTO 1" title="LOS CUATRO TIPOS DE GRIETA" />
  {TIPOS.map((q, i) => { const s = phys(tt, 0.6 + i * 0.7, 6, 0.45), x = 150 + i * 420;
    return <div key={i} style={{ position: "absolute", left: x, top: 280, width: 360, transform: `translateY(${(1 - cl(s)) * 400}px) rotate(${(1 - cl(s)) * (i % 2 ? 12 : -12)}deg)`, opacity: cl(s * 2) }}>
      <Wall x={0} y={0} w={360} h={300}>
        {q.win && <div style={{ position: "absolute", left: 40, top: 120, width: 110, height: 150, background: "linear-gradient(#9fc3e0,#d8ebf7)", border: "8px solid #6a4a32" }} />}
        <CrackSvg d={q.d} p={eio(tt, 1.0 + i * 0.7, 2.2 + i * 0.7)} w={5} W={360} Hh={300} />
      </Wall>
      <div style={{ marginTop: 330, fontWeight: 900, fontSize: 34, textAlign: "center", color: q.c }}>{q.n}</div>
      <div style={{ margin: "10px auto 0", width: 60, height: 6, borderRadius: 3, background: q.c }} />
    </div>; })}
</>}</Stage>;

// ---- 3:00 · COMO EL BARRO SECO: un charco que se seca y se cuartea, y el mismo dibujo pasa a la pared ----
export const HMud: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 50%, #3a2c1c, #0a0806 80%)">{(tt) => {
  const dry = eio(tt, 0.5, 3.2), wall = eio(tt, 3.6, 5.2);
  const net = "M60 80 L150 60 L240 110 L330 70 L420 120 M150 60 L170 160 L90 220 L60 300 M170 160 L270 200 L240 110 M270 200 L360 230 L420 120 M270 200 L250 300 L150 320 M360 230 L400 330 M90 220 L150 320";
  return <>
    <Head tt={tt} kick="LA GRIETA DE PELO" title="COMO EL BARRO DE UN CHARCO" />
    <div style={{ position: "absolute", left: 220, top: 300, width: 680, height: 520, borderRadius: "48% 52% 46% 54%", background: `radial-gradient(ellipse, ${dry < 0.5 ? "#4a3a28" : "#8a7354"}, #3a2c1c 90%)`, overflow: "hidden", boxShadow: "inset 0 0 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 0, background: `rgba(120,150,170,${0.55 * (1 - dry)})` }} />
      <svg width={680} height={520} style={{ position: "absolute", left: 120, top: 80, transform: "scale(1.2)" }}><path d={net} stroke="#2a1c0e" strokeWidth={6} fill="none" strokeDasharray={2600} strokeDashoffset={2600 * (1 - dry)} /></svg>
    </div>
    <div style={{ position: "absolute", left: 1020, top: 300, opacity: cl(wall * 2), transform: `translateX(${(1 - wall) * -120}px)` }}>
      <Wall x={0} y={0} w={680} h={520}><svg width={680} height={520} style={{ position: "absolute", left: 120, top: 80, transform: "scale(1.2)" }}><path d={net} stroke="#4a3a28" strokeWidth={3} fill="none" strokeDasharray={2600} strokeDashoffset={2600 * (1 - wall)} /></svg></Wall>
    </div>
    <Tag tt={tt} at={1.0} x={560} y={880} txt="SE SECÓ RÁPIDO · SE ENCOGIÓ" col={DIM} size={34} />
    <Tag tt={tt} at={4.2} x={1360} y={880} txt="EL MISMO DIBUJO EN LA PINTURA" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 3:20 · PIEL O HUESO: la pared en capas como un brazo: pintura y revoque = la piel; ladrillo y estructura = el hueso ----
export const HSkin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = [{ n: "PINTURA", h: 22, c: "#efe6d2", sk: true }, { n: "REVOQUE", h: 90, c: "#c9c0ae", sk: true }, { n: "LADRILLO", h: 220, c: "#b8664a", sk: false }, { n: "VIGA · CIMIENTO", h: 120, c: "#8f8f8a", sk: false }];
  let y = 280;
  return <>
    <Head tt={tt} kick="LA DE PELO" title="ES LA PIEL, NO EL HUESO" col={GRN} />
    {L.map((q, i) => { const s = phys(tt, 0.4 + i * 0.35, 6, 0.6), top = y; y += q.h + 10;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 300, top, width: 860, height: q.h, borderRadius: 8, background: q.c, transform: `translateX(${(1 - cl(s)) * -300}px)`, opacity: cl(s * 2), boxShadow: "0 10px 30px rgba(0,0,0,.4)", backgroundImage: q.n === "LADRILLO" ? "repeating-linear-gradient(90deg, transparent 0 200px, rgba(220,200,170,.6) 200px 210px)" : undefined }}>
          {i === 0 && <CrackSvg d="M120 0 L135 22 M300 0 L290 22 M520 0 L540 22 M700 0 L690 22" p={eio(tt, 2.2, 3.2)} w={4} W={860} Hh={22} />}
          {i === 1 && <CrackSvg d="M300 0 L310 40 L290 70" p={eio(tt, 2.6, 3.6)} w={4} W={860} Hh={90} />}
        </div>
        <Tag tt={tt} at={0.6 + i * 0.35} x={1200} y={top + q.h / 2} txt={q.n} col={q.sk ? GRN : DIM} size={34} anchor="l" />
      </React.Fragment>; })}
    <div style={{ position: "absolute", left: 1520, top: 280, width: 8, height: 122, background: GRN, borderRadius: 4, opacity: cl(eio(tt, 2.8, 3.4)) }} />
    <Tag tt={tt} at={3.0} x={1560} y={340} txt="PIEL" col={GRN} size={56} anchor="l" />
    <div style={{ position: "absolute", left: 1520, top: 412, width: 8, height: 350, background: RED, borderRadius: 4, opacity: cl(eio(tt, 3.6, 4.2)) }} />
    <Tag tt={tt} at={3.8} x={1560} y={590} txt="HUESO" col={RED} size={56} anchor="l" />
    <Tag tt={tt} at={4.8} x={730} y={930} txt="FIJADOR · ENDUIDO · PINTURA · RESPIRA TRANQUILO" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 3:50 · DONDE SE JUNTAN LAS FUERZAS: líneas de esfuerzo que rodean el hueco de la ventana y se amontonan en la esquina ----
export const HForces: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 45%, #18222c, #05080b 80%)">{(tt) => {
  const f = eio(tt, 0.6, 3.0), cr = eio(tt, 3.4, 4.8);
  const lines = Array.from({ length: 9 }, (_, i) => { const dy = -200 + i * 50, bend = Math.max(0, 1 - Math.abs(dy) / 220) * 180; return `M260 ${560 + dy} C 700 ${560 + dy}, 760 ${560 + dy - Math.sign(dy || 1) * bend}, 960 ${560 + dy - Math.sign(dy || 1) * bend} S 1220 ${560 + dy}, 1660 ${560 + dy}`; });
  return <>
    <Head tt={tt} kick="LA ESQUINA DE LA VENTANA" title="AHÍ SE JUNTAN LAS FUERZAS" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {lines.map((d, i) => <path key={i} d={d} stroke={i === 4 ? "transparent" : `rgba(120,200,255,${0.25 + 0.06 * Math.abs(i - 4)})`} strokeWidth={4} fill="none" strokeDasharray="22 14" strokeDashoffset={-tt * 60} opacity={f} />)}
    </svg>
    <div style={{ position: "absolute", left: 830, top: 470, width: 260, height: 200, background: "linear-gradient(#5d88a8,#a9cbe2)", border: "12px solid #6a4a32", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    {/* las esquinas brillan (concentración) */}
    {[[830, 470], [1102, 470], [830, 682], [1102, 682]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,90,60,${0.7 * f}), transparent 70%)` }} />)}
    <CrackSvg d="M1102 470 L1130 430 L1142 395 L1172 362 L1186 322" p={cr} w={7} glow={cr} />
    <Tag tt={tt} at={3.8} x={1360} y={330} txt="CON EL CALOR Y EL FRÍO" col={AMB} size={36} />
    <Tag tt={tt} at={4.8} x={960} y={900} txt="LA ESQUINA ES LA QUE PAGA" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 4:30 · EL ASENTAMIENTO: la casa en corte, un lado del cimiento baja en tierra blanda y la diagonal se abre MÁS ARRIBA ----
export const HSettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg, #24303c 0%, #101418 62%, #2a1e12 62%, #120c06 100%)">{(tt) => {
  const sink = eio(tt, 1.0, 4.0), drop = 46 * sink;
  return <>
    <Head tt={tt} kick="LA DIAGONAL" title="UNA PARTE DE LA CASA BAJA" col={RED} />
    {/* tierra blanda bajo la derecha */}
    <div style={{ position: "absolute", left: 1080, top: 680, width: 520, height: 330, borderRadius: "40% 40% 0 0", background: `radial-gradient(ellipse at 50% 20%, rgba(40,60,90,${0.6 * sink}), transparent 70%)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {/* la casa: la mitad derecha rota alrededor de la esquina de abajo-izquierda */}
      <path d="M420 670 L420 360 L760 170 L760 670 Z" fill="#e8dfcc" />
      <g transform={`rotate(${2.6 * sink} 760 670) translate(0 ${drop * 0.25})`}>
        <path d="M760 670 L760 170 L1100 360 L1500 360 L1500 670 Z" fill="#e3d9c4" />
        <rect x={1180} y={440} width={150} height={130} fill="#9fc3e0" stroke="#6a4a32" strokeWidth={8} />
      </g>
      <rect x={400} y={670} width={380} height={60} fill="#8f8a80" />
      <rect x={760} y={670 + drop} width={760} height={60} fill="#8f8a80" />
      {/* la diagonal: más ancha arriba */}
      <path d={`M770 250 L790 250 L${830 + 12 * sink} 330 L${812 + 8 * sink} 400 L${860 + 5 * sink} 470 L${848 + 3 * sink} 540 L882 610 L878 610 L840 540 L850 470 L800 400 L820 330 Z`} fill="#1a1410" opacity={cl(sink * 3)} />
    </svg>
    <Tag tt={tt} at={2.6} x={1640} y={250} txt="MÁS ANCHA ARRIBA" col={RED} size={44} />
    <Tag tt={tt} at={3.4} x={1340} y={920} txt="EL SUELO SE ABLANDÓ CON AGUA" col={ICE} size={36} />
    <Tag tt={tt} at={4.6} x={560} y={920} txt="ÉSA ES DEL HUESO" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 5:05 · LA HORIZONTAL: depende de la altura (bajo la losa, a media altura, abajo con salitre) ----
export const HHoriz: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 45%, #22201c, #070706 80%)">{(tt) => {
  const R = [{ y: 330, l: "BAJO LA LOSA", s: "la losa se estira con el sol", c: AMB, a: 0.8 }, { y: 560, l: "A MEDIA ALTURA", s: "la tierra empuja del otro lado", c: RED, a: 2.4 }, { y: 800, l: "ABAJO, A 20-30 CM", s: "agua del suelo · salitre", c: ICE, a: 4.0 }];
  const sun = eio(tt, 0.8, 1.8);
  return <>
    <Head tt={tt} kick="LA HORIZONTAL" title="DEPENDE DE DÓNDE ESTÁ" />
    <Wall x={260} y={260} w={760} h={620}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 50, background: "#bdb6a8" }} />
      {R.map((q, i) => <CrackSvg key={i} d={`M20 ${q.y - 260} L200 ${q.y - 258} L380 ${q.y - 262} L560 ${q.y - 259} L740 ${q.y - 261}`} p={eio(tt, q.a, q.a + 1)} w={5} glow={cl(tt - q.a) * (1 - cl(tt - q.a - 1.6))} W={760} Hh={620} />)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: `linear-gradient(transparent, rgba(250,250,245,${0.7 * eio(tt, 4.0, 5.0)}))` }} />
    </Wall>
    <div style={{ position: "absolute", left: 300 + sun * 60, top: 150, width: 80, height: 80, borderRadius: 40, background: "radial-gradient(circle,#fff3c4,#ffb02e)", boxShadow: "0 0 60px #ffb02e", opacity: sun * (1 - cl(tt - 2.4)) }} />
    {R.map((q, i) => <React.Fragment key={i}><Tag tt={tt} at={q.a + 0.3} x={1090} y={q.y - 20} txt={q.l} col={q.c} size={40} anchor="l" /><Tag tt={tt} at={q.a + 0.6} x={1090} y={q.y + 30} txt={q.s} col={DIM} size={30} anchor="l" /></React.Fragment>)}
  </>;
}}</Stage>;

// ---- 5:40 · EL MAPA: el semáforo de las cuatro ----
export const HTraffic: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const R = [{ n: "DE PELO", v: "TRANQUILO", c: GRN }, { n: "ESQUINA DE VENTANA", v: "TRANQUILO · VIGILA", c: "#c9e04a" }, { n: "DIAGONAL", v: "ATENCIÓN", c: RED }, { n: "HORIZONTAL", v: "DEPENDE DE DÓNDE", c: AMB }];
  return <>
    <Head tt={tt} kick="YA TIENES EL MAPA" title="EL SEMÁFORO DE LAS GRIETAS" />
    {R.map((q, i) => { const s = phys(tt, 0.5 + i * 0.75, 6, 0.55), y = 300 + i * 160;
      return <div key={i} style={{ position: "absolute", left: 300, top: y, width: 1320, height: 130, borderRadius: 65, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", transform: `translateX(${(1 - cl(s)) * 200}px)`, opacity: cl(s * 2), display: "flex", alignItems: "center" }}>
        <div style={{ width: 96, height: 96, marginLeft: 17, borderRadius: 48, background: q.c, boxShadow: `0 0 ${40 * cl(s)}px ${q.c}` }} />
        <div style={{ marginLeft: 40, fontWeight: 900, fontSize: 46, width: 620 }}>{q.n}</div>
        <div style={{ fontWeight: 800, fontSize: 38, color: q.c }}>{q.v}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 6:30 · EL CANTO DE LA MONEDA: la moneda gira de canto y el calibre marca 1,5 mm (la frontera fisura / grieta) ----
export const HCoinEdge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #2a2418, #070605 80%)">{(tt) => {
  const turn = eio(tt, 0.6, 2.0), cal = eio(tt, 2.2, 3.4);
  return <>
    <Head tt={tt} kick="PUNTO 2 · LA PRUEBA DE LA MONEDA" title="EL CANTO MIDE 1,5 MM" />
    <Coin x={760} y={560} r={260} edge={turn * 0.97} tt={tt} />
    {/* el calibre */}
    <div style={{ position: "absolute", left: 700 - 260 * (1 - cal), top: 230, width: 40, height: 230, background: "linear-gradient(90deg,#9aa3ad,#e9eef2,#9aa3ad)", borderRadius: 6, opacity: cl(cal * 3) }} />
    <div style={{ position: "absolute", left: 820 + 260 * (1 - cal), top: 230, width: 40, height: 230, background: "linear-gradient(90deg,#9aa3ad,#e9eef2,#9aa3ad)", borderRadius: 6, opacity: cl(cal * 3) }} />
    <Tag tt={tt} at={3.2} x={780} y={190} txt="1,5 MM" col={AMB} size={64} />
    <div style={{ position: "absolute", left: 1160, top: 380, width: 560, opacity: cl(eio(tt, 3.8, 4.4)) }}>
      <div style={{ fontWeight: 900, fontSize: 40, color: GRN }}>MENOS · FISURA</div>
      <div style={{ height: 3, background: "rgba(255,255,255,.3)", margin: "26px 0" }} />
      <div style={{ fontWeight: 900, fontSize: 40, color: AMB }}>MÁS · GRIETA</div>
    </div>
  </>;
}}</Stage>;

// ---- 7:00 · ENTRA O NO ENTRA: dos grietas; en la fina la moneda rebota (fisura → punto 5); en la ancha se hunde (grieta → vigilar) ----
export const HCoinTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = eio(tt, 0.6, 1.6), bounce = Math.abs(Math.sin(cl(tt - 1.6) * 9)) * Math.exp(-cl(tt - 1.6) * 4) * 40, b = eio(tt, 3.0, 4.2);
  return <>
    <Head tt={tt} kick="SIN FORZAR, SIN HACER PALANCA" title="¿ENTRA O NO ENTRA?" />
    <Wall x={200} y={260} w={700} h={560}><CrackSvg d="M350 0 L360 140 L345 280 L365 420 L350 560" p={1} w={3} W={700} Hh={560} /></Wall>
    <Wall x={1020} y={260} w={700} h={560}><CrackSvg d="M350 0 L370 140 L340 280 L372 420 L350 560" p={1} w={14} W={700} Hh={560} /></Wall>
    <div style={{ position: "absolute", left: 550 - 70, top: 160 + 230 * a - bounce, width: 140, height: 30, borderRadius: 8, background: "linear-gradient(#ffe39a,#b8862a)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1370 - 70, top: 160 + 230 * b, width: 140, height: 30, borderRadius: 8, background: "linear-gradient(#ffe39a,#b8862a)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", clipPath: `inset(0 0 ${Math.max(0, (160 + 230 * b) - 380) * 0.6}px 0)` }} />
    <Cross x={550} y={900} s={90} p={eio(tt, 2.0, 2.8)} />
    <Tag tt={tt} at={2.2} x={550} y={990} txt="FISURA · ARREGLALA HOY (PUNTO 5)" col={GRN} size={32} />
    <Check x={1370} y={900} s={90} p={eio(tt, 4.2, 5.0)} col={AMB} />
    <Tag tt={tt} at={4.4} x={1370} y={990} txt="GRIETA · ANTES, SABER SI SE MUEVE" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 7:50 · LAS CUATRO DE DOÑA MARTA: la moneda en cada pieza (living mitad, pasillo no, cocina no, dormitorio ENTERA) + el latido ----
export const HFourCoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #2a1c18, #080505 80%)">{(tt) => {
  const R = [{ n: "LIVING", v: "ENTRA JUSTO, HASTA LA MITAD", k: 0.5, c: AMB }, { n: "PASILLO", v: "NO ENTRA", k: 0, c: GRN }, { n: "COCINA", v: "NO ENTRA", k: 0, c: GRN }, { n: "DORMITORIO", v: "ENTERA · ARRIBA MÁS", k: 1, c: RED }];
  const beat = tt > 4.8 ? 1 + 0.06 * Math.max(0, Math.sin(tt * 7)) : 1;
  return <>
    <Head tt={tt} kick="EN LA CASA DE DOÑA MARTA" title="LA MONEDA, PIEZA POR PIEZA" />
    {R.map((q, i) => { const s = phys(tt, 0.5 + i * 1.0, 6, 0.5), x = 140 + i * 430, dn = eio(tt, 0.9 + i * 1.0, 1.7 + i * 1.0) * q.k;
      return <div key={i} style={{ position: "absolute", left: x, top: 300, width: 370, opacity: cl(s * 2), transform: `translateY(${(1 - cl(s)) * 120}px) scale(${i === 3 ? beat : 1})` }}>
        <Wall x={0} y={0} w={370} h={400}><CrackSvg d={`M185 0 L195 130 L180 260 L190 400`} p={1} w={i === 3 ? 18 : i === 0 ? 9 : 3} W={370} Hh={400} />
          <div style={{ position: "absolute", left: 185 - 55, top: 60 + 120 * dn, width: 110, height: 24, borderRadius: 6, background: "linear-gradient(#ffe39a,#b8862a)", clipPath: `inset(0 0 ${dn * 22}px 0)` }} />
        </Wall>
        <div style={{ marginTop: 420, fontWeight: 900, fontSize: 36, textAlign: "center" }}>{q.n}</div>
        <div style={{ marginTop: 6, fontWeight: 800, fontSize: 26, textAlign: "center", color: q.c }}>{q.v}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 8:40 · LA FOTO CON FECHA: el celular dispara al lado de la grieta (moneda de escala); un mes después, la misma foto muestra lo que el ojo no ve ----
export const HPhoto: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const later = eio(tt, 3.0, 4.6);
  const Ph = ({ x, grow, date }: { x: number; grow: number; date: string }) => <div style={{ position: "absolute", left: x, top: 280, width: 560, height: 560, borderRadius: 30, background: "#111", padding: 18, boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
    <Wall x={18} y={18} w={524} h={480}><CrackSvg d={`M262 0 L280 ${160 + 40 * grow} L250 ${300 + 60 * grow} L272 480`} p={1} w={6 + 8 * grow} W={524} Hh={480} /><Coin x={380} y={300} r={40} /><div style={{ position: "absolute", left: 30, top: 400, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#3a3a42" }}>{date}</div></Wall>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", fontWeight: 800, fontSize: 26, color: DIM }}>{grow ? "HOY + 1 MES" : "HOY"}</div>
  </div>;
  return <>
    <Head tt={tt} kick="EL DETALLE QUE CASI NADIE HACE" title="ANOTA Y SACA UNA FOTO" />
    <Ph x={330 + 300 * (1 - later)} grow={0} date="12/3 · entró" />
    {later > 0.01 && <div style={{ opacity: later }}><Ph x={1030} grow={later} date="12/4 · entró" /></div>}
    <Tag tt={tt} at={4.8} x={960} y={930} txt="LA MEMORIA TE ENGAÑA · LA FOTO SÍ LO NOTA" col={AMB} size={42} />
  </>;
}}</Stage>;

export { eio };
