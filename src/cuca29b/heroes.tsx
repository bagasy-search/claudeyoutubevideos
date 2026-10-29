// cuca29b · NIXTAMAL · 25 componentes únicos (1 por truco) + errores / rutina / nunca / repaso. Ninguno se repite en la tanda.
import React from "react";
import { BR, cl, DIM, eio, Flame, H, HAND, Head, lerp, MZ, Olla, phys, Photo, RED, rnd, Stage, Tag, TIN, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const im = (h: H, i: number) => h.imgs?.[i];
// grano de maíz (gota redondeada con brillo); col = amarillo nixtamal / blanco crudo / azul
const Kern: React.FC<{ x: number; y: number; s?: number; r?: number; col?: string; o?: number }> = ({ x, y, s = 1, r = 0, col = "#f2d27a", o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 30 * s, height: 36 * s, marginLeft: -15 * s, marginTop: -18 * s, borderRadius: "48% 48% 42% 42% / 60% 60% 38% 38%", transform: `rotate(${r}deg)`, opacity: o,
    background: `radial-gradient(ellipse at 38% 30%, rgba(255,255,255,.8) 0 9%, ${col} 34%, rgba(90,60,20,.95) 115%)`, boxShadow: "0 5px 9px rgba(0,0,0,.45)" }} />
);
// tortilla vista de frente (disco con manchitas de comal)
const Tort: React.FC<{ x: number; y: number; d: number; puff?: number; crack?: number; style?: React.CSSProperties }> = ({ x, y, d, puff = 0, crack = 0, style }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: "radial-gradient(circle at 42% 38%, #f6e3b0, #e2c27e 62%, #c79a52)", boxShadow: `0 ${20 + 40 * puff}px ${40 + 50 * puff}px rgba(0,0,0,.5), inset 0 ${-30 * puff}px ${60 * puff}px rgba(120,70,20,.35)`, transform: `scale(${1 + 0.06 * puff})`, overflow: "hidden", ...style }}>
    {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${12 + rnd(i) * 70}%`, top: `${12 + rnd(i + 30) * 70}%`, width: 10 + rnd(i + 5) * 22, height: 8 + rnd(i + 9) * 14, borderRadius: "50%", background: "rgba(120,70,25,.45)", filter: "blur(1px)" }} />)}
    {crack > 0 && <svg width={d} height={d} style={{ position: "absolute", inset: 0 }}><path d={`M ${d * 0.5} 0 L ${d * 0.46} ${d * 0.3} L ${d * 0.56} ${d * 0.5} L ${d * 0.44} ${d * 0.74} L ${d * 0.52} ${d}`} fill="none" stroke="#3a2410" strokeWidth={8} pathLength={1} strokeDasharray={`${crack} 1`} /></svg>}
  </div>
);

// 1 · MAZORCA: la mazorca gira y se desgrana; los granos criollos caen con peso y suenan secos
const HMazorca: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const rot = tt * 40, fall = (i: number) => phys(tt, 1.6 + i * 0.05, 5, 0.3);
  return <>
    <Head tt={tt} kick="TRUCO 1" title="CRIOLLO, SECO, QUE SUENE" />
    <div style={{ position: "absolute", left: 760, top: 210, width: 220, height: 560, borderRadius: "110px 110px 90px 90px", background: "#7a5a2a", transform: `perspective(900px) rotateY(${rot}deg) rotateZ(-14deg)`, boxShadow: "0 50px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {Array.from({ length: 13 * 6 }, (_, i) => { const r = Math.floor(i / 6), c = i % 6, gone = fall(i) > 0.5 && i % 3 === 0;
        return <div key={i} style={{ position: "absolute", left: 14 + c * 33, top: 14 + r * 41, width: 30, height: 38, borderRadius: 10, background: gone ? "#5a4020" : "radial-gradient(ellipse at 40% 30%, #fff6 0 10%, #f0cf72 40%, #b98a2e)", boxShadow: "inset 0 -3px 4px rgba(0,0,0,.3)" }} />; })}
    </div>
    {Array.from({ length: 26 }, (_, i) => { const f = cl(fall(i * 3)); return <Kern key={i} x={900 + rnd(i) * 520} y={lerp(420 + rnd(i + 4) * 200, 880 + rnd(i + 8) * 40, f)} r={rnd(i) * 360 * f} s={1.2} o={cl(f * 3)} />; })}
    <div style={{ position: "absolute", left: 760, top: 900, width: 900, height: 30, borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(10px)" }} />
    <Tag tt={tt} at={3.2} x={1420} y={330} txt="SUENA COMO PIEDRITA = SECO" col={MZ} size={38} />
  </>;
}}</Stage>;

// 2 · CUBETA EN CORTE: el agua se mueve; los granos huecos suben y se van por el borde
const HCubeta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Head tt={tt} kick="TRUCO 2" title="LO QUE FLOTA SE TIRA" />
  <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 620, borderRadius: "30px 30px 120px 120px", background: "linear-gradient(90deg,#5d6a70,#8b989e 45%,#4f5a60)", boxShadow: "0 60px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 24, right: 24, top: 60 + 6 * Math.sin(tt * 2), bottom: 24, borderRadius: "10px 10px 100px 100px", background: "linear-gradient(180deg, rgba(150,200,220,.55), rgba(70,110,130,.85))" }} />
    {Array.from({ length: 40 }, (_, i) => <Kern key={i} x={80 + rnd(i) * 640} y={470 + rnd(i + 3) * 110} r={rnd(i) * 200} s={1.1} />)}
    {Array.from({ length: 7 }, (_, i) => { const up = eio(tt, 1.2 + i * 0.25, 3.0 + i * 0.25), out = eio(tt, 3.6 + i * 0.2, 5.0 + i * 0.2);
      return <Kern key={i} x={180 + i * 80 + out * (520 - i * 60)} y={lerp(520, 70, up) - out * 120} r={tt * 60 + i * 40} s={1.1} col="#b9a87a" o={1 - out} />; })}
  </div>
  <Tag tt={tt} at={2.4} x={1560} y={360} txt="HUECO · PICADO · SE VA" col={RED} size={36} />
  <Tag tt={tt} at={3.4} x={1560} y={760} txt="EL BUENO SE QUEDA ABAJO" col={MZ} size={34} />
</>}</Stage>;

// 3 · BALANZA: platillos que se equilibran — un kilo de maíz contra una cucharada de cal
const HBalanza: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ang = 18 * Math.exp(-tt * 0.9) * Math.cos(tt * 3.2) * cl(tt - 1.4) + (tt < 1.4 ? -16 * cl(tt - 0.4) : 0);
  const arm = (s: number) => ({ x: 960 + s * 360 * Math.cos(ang * Math.PI / 180), y: 420 + s * 360 * Math.sin(ang * Math.PI / 180) });
  const L = arm(-1), R2 = arm(1);
  return <>
    <Head tt={tt} kick="TRUCO 3" title="LA CAL SE MIDE" />
    <div style={{ position: "absolute", left: 950, top: 420, width: 20, height: 480, background: "linear-gradient(90deg,#6b4a26,#a0723c)", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 960 - 380, top: 410, width: 760, height: 16, borderRadius: 8, background: "#b8893c", transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%" }} />
    {[L, R2].map((p, k) => <div key={k} style={{ position: "absolute", left: p.x - 150, top: p.y + 120, width: 300, height: 70, borderRadius: "0 0 150px 150px", background: "linear-gradient(180deg,#c9a45a,#7d5a26)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}>
      {k === 0 ? Array.from({ length: 30 }, (_, i) => <Kern key={i} x={40 + rnd(i) * 220} y={-10 - rnd(i + 2) * 70} s={0.9} r={rnd(i) * 180} col="#f4f0dc" />)
        : <div style={{ position: "absolute", left: 100, top: -48, width: 100, height: 50, borderRadius: "50% 50% 10px 10px", background: "radial-gradient(circle at 40% 30%,#fff,#e6e2d6)" }} />}
      <svg width={300} height={140} style={{ position: "absolute", left: 0, top: -140 }}><path d="M 10 140 L 150 0 L 290 140" fill="none" stroke="#8a6a30" strokeWidth={3} /></svg>
    </div>)}
    <Tag tt={tt} at={2.2} x={L.x} y={L.y + 270} txt="1 KG DE MAÍZ" col={TX} size={38} />
    <Tag tt={tt} at={2.8} x={R2.x} y={R2.y + 270} txt="1 CUCHARADA DE CAL" col={MZ} size={38} />
  </>;
}}</Stage>;

// 4 · BOLSA DE CAL: gira la bolsa; la etiqueta «apagada» se enciende y la «viva» queda tachada a mano
const HBolsaCal: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const ry = lerp(70, -12, eio(tt, 0.4, 2.2)) + 3 * Math.sin(tt * 0.8), tach = cl((tt - 3.4) / 0.8);
  return <>
    <Head tt={tt} kick="TRUCO 4" title="CUÁL CAL, Y CUÁL JAMÁS" />
    <div style={{ position: "absolute", left: 620, top: 230, width: 420, height: 620, borderRadius: "40px 40px 26px 26px", background: "linear-gradient(90deg,#d9cfb8,#f4ecda 45%,#bdb29a)", transform: `perspective(1400px) rotateY(${ry}deg)`, boxShadow: "0 60px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: -18, height: 50, background: "repeating-linear-gradient(90deg,#c8bca2 0 18px,#e6dcc4 18px 36px)", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 170, padding: "26px 10px", borderRadius: 16, background: "#1d4f3a", textAlign: "center", boxShadow: `0 0 ${60 * cl(tt - 1.8)}px rgba(255,214,110,${0.7 * cl(tt - 1.8)})` }}>
        <div style={{ fontWeight: 900, fontSize: 54, color: "#fff7df" }}>CAL</div><div style={{ fontWeight: 800, fontSize: 30, color: MZ }}>PARA NIXTAMAL</div></div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 420, fontFamily: HAND, fontSize: 40, color: TIN, textAlign: "center" }}>apagada · de mercado</div>
    </div>
    <div style={{ position: "absolute", left: 1180, top: 360, width: 360, height: 420, borderRadius: 26, background: "linear-gradient(135deg,#9aa0a2,#5f6668)", transform: `rotate(6deg) scale(${0.9 + 0.1 * cl(phys(tt, 2.6, 6, 0.5))})`, opacity: cl(phys(tt, 2.6, 6, 0.5)), boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 140, textAlign: "center", fontWeight: 900, fontSize: 46, color: "#2a2a2a" }}>CAL VIVA<br /><span style={{ fontSize: 28 }}>de construcción</span></div>
      <svg width={360} height={420} style={{ position: "absolute", inset: 0 }}><path d="M 30 120 Q 180 210 330 300" fill="none" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${tach} 1`} /></svg>
    </div>
    <Tag tt={tt} at={4.0} x={1360} y={860} txt="JAMÁS" col={RED} size={52} />
  </>;
}}</Stage>;

// 5 · VASO: la cal se deshace aparte; una nube blanca gira y se asienta antes de ir a la olla
const HVasoCal: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const settle = eio(tt, 2.4, 5.2);
  return <>
    <Head tt={tt} kick="TRUCO 5" title="LA CAL SE DESHACE APARTE" />
    <div style={{ position: "absolute", left: 760, top: 260, width: 400, height: 600, borderRadius: "16px 16px 60px 60px", background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.05) 40%,rgba(255,255,255,.2))", border: "4px solid rgba(255,255,255,.35)", overflow: "hidden", boxShadow: "0 50px 80px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, bottom: 0, background: "rgba(170,205,220,.35)" }} />
      {Array.from({ length: 34 }, (_, i) => { const a = tt * (1.4 - settle) * 2 + i, rr = 60 + rnd(i) * 110 * (1 - settle);
        return <div key={i} style={{ position: "absolute", left: 200 + Math.cos(a) * rr - 30, top: lerp(220 + Math.sin(a * 0.7) * 120, 520 + rnd(i) * 40, settle), width: 60 + rnd(i) * 50, height: 40 + rnd(i + 2) * 30, borderRadius: "50%", background: "rgba(255,255,255,.55)", filter: "blur(12px)" }} />; })}
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 20, height: 40 * settle, borderRadius: "50%", background: "#f2efe6" }} />
    </div>
    <div style={{ position: "absolute", left: 1010, top: 120, width: 18, height: 400, borderRadius: 9, background: "linear-gradient(90deg,#7a5530,#b07a44)", transform: `rotate(${20 * Math.sin(tt * 3) * (1 - settle)}deg)`, transformOrigin: "50% 0" }} />
    <Tag tt={tt} at={2.0} x={1440} y={420} txt="NUNCA EN TERRÓN" col={RED} size={38} />
    <Tag tt={tt} at={4.6} x={1440} y={620} txt="SE ASIENTA · SE CUELA" col={MZ} size={36} />
  </>;
}}</Stage>;

// 6 · DUELO DE OLLAS: aluminio que se mancha de gris contra peltre que queda limpio
const HAluminio: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1e1712">{(tt) => {
  const st = eio(tt, 1.4, 4.0);
  const pot = (x: number, a: string, b: string, stain: number, name: string, col: string, at: number) => <div style={{ position: "absolute", left: x, top: 380, opacity: cl(phys(tt, at, 6, 0.5)) }}>
    <div style={{ width: 460, height: 340, borderRadius: "20px 20px 140px 140px", background: `linear-gradient(90deg,${a},${b} 45%,${a})`, boxShadow: "0 50px 80px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
      {stain > 0 && Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 340, top: 60 + rnd(i + 3) * 220, width: 60 + rnd(i + 6) * 80, height: 40 + rnd(i + 8) * 60, borderRadius: "50%", background: "rgba(40,40,40,.6)", filter: "blur(8px)", opacity: stain }} />)}
    </div>
    <div style={{ position: "absolute", left: -30, right: -30, top: -30, height: 44, borderRadius: 22, background: a }} />
    <div style={{ textAlign: "center", marginTop: 40, fontWeight: 900, fontSize: 40, color: col }}>{name}</div>
  </div>;
  return <>
    <Head tt={tt} kick="TRUCO 6" title="NUNCA EN OLLA DE ALUMINIO" />
    {pot(330, "#8d9396", "#d6dadb", st, "ALUMINIO · SABE A METAL", RED, 0.4)}
    {pot(1130, "#1f3d5a", "#3f6f96", 0, "PELTRE · BARRO", MZ, 0.9)}
    <div style={{ position: "absolute", left: 1130, top: 380, width: 460, height: 340, borderRadius: "20px 20px 140px 140px", background: "repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,.9) 0 3px, transparent 3px 26px)", opacity: 0.25 }} />
  </>;
}}</Stage>;

// 7 · MUESTRARIO DE COLOR: el grano avanza del blanco al amarillo; el reloj arranca justo en el amarillo
const HMuestrario: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const COL = ["#f3efe2", "#f1e6c4", "#efdba2", "#edcf7e", "#e9c35c"], k = eio(tt, 0.8, 4.0) * 4;
  return <>
    <Head tt={tt} kick="TRUCO 7" title="EN AMARILLO EMPIEZA A CONTAR" />
    {COL.map((c, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 270, top: 420, width: 230, height: 300, borderRadius: 20, background: c, boxShadow: i <= k ? "0 30px 60px rgba(0,0,0,.6)" : "0 10px 20px rgba(0,0,0,.4)", transform: `translateY(${i <= k ? -30 : 0}px)`, border: Math.round(k) === i ? `6px solid ${MZ}` : "6px solid transparent" }}>
      <Kern x={115} y={130} s={3} col={c} />
    </div>)}
    <div style={{ position: "absolute", left: 300 + k * 270 + 115, top: 330, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `30px solid ${MZ}`, marginLeft: -22 }} />
    <div style={{ position: "absolute", left: 1520, top: 780, width: 160, height: 160, borderRadius: "50%", border: `8px solid ${MZ}`, opacity: cl(tt - 3.6) }}>
      <div style={{ position: "absolute", left: 72, top: 16, width: 8, height: 64, background: MZ, transformOrigin: "50% 100%", transform: `rotate(${cl(tt - 3.8) * 220}deg)` }} />
    </div>
    <Tag tt={tt} at={4.0} x={1300} y={860} txt="AHÍ EMPIEZA EL RELOJ" col={MZ} size={38} />
  </>;
}}</Stage>;

// 8 · LA UÑA: macro del grano; una uña lo aprieta y la piel se desprende sola
const HUna: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#2a1c10">{(tt) => {
  const press = eio(tt, 1.0, 2.0), peel = eio(tt, 2.2, 4.2);
  return <>
    <Head tt={tt} kick="TRUCO 8" title="LA PRUEBA DE LA UÑA" />
    <div style={{ position: "absolute", left: 960, top: 560, width: 420, height: 500, marginLeft: -210, marginTop: -250, borderRadius: "48% 48% 42% 42% / 60% 60% 38% 38%", background: "radial-gradient(ellipse at 40% 30%, #fff8 0 8%, #edcf7e 40%, #a87a2c)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960 - 210 + peel * 360, top: 560 - 250 - peel * 160, width: 420, height: 500, borderRadius: "48% 48% 42% 42% / 60% 60% 38% 38%", border: "10px solid rgba(255,240,200,.75)", transform: `rotate(${peel * 40}deg) scale(${1 + peel * 0.05})`, opacity: 1 - peel * 0.4, clipPath: "polygon(0 0,100% 0,100% 55%,0 40%)" }} />
    <div style={{ position: "absolute", left: 1220 - press * 60, top: 300 + press * 40, width: 280, height: 150, borderRadius: "140px 60px 60px 140px", background: "linear-gradient(180deg,#e7b394,#c98c6c)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 14, top: 22, width: 110, height: 100, borderRadius: "60px 20px 20px 60px", background: "linear-gradient(135deg,#fbe9df,#e8c3b2)" }} />
    </div>
    <Tag tt={tt} at={3.6} x={960} y={930} txt="LA PIEL SE VA SOLITA = YA" col={MZ} size={42} />
  </>;
}}</Stage>;

// 9 · RELOJ DE PARED: cada maíz se lleva su sector del reloj (criollo blanco, amarillo, cacahuacintle)
const HRelojPared: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => {
  const SEC = [["BLANCO", 40, "#f3efe2"], ["AMARILLO", 50, "#e9c35c"], ["AZUL", 30, "#5a6fb0"], ["CACAHUACINTLE", 60, "#e8dcc0"]] as const;
  let acc = 0;
  return <>
    <Head tt={tt} kick="TRUCO 9" title="CADA MAÍZ SU TIEMPO" />
    <div style={{ position: "absolute", left: 960 - 330, top: 560 - 330, width: 660, height: 660, borderRadius: "50%", background: "#f4ead2", border: "22px solid #6b4426", boxShadow: "0 60px 90px rgba(0,0,0,.6)" }}>
      <svg width={616} height={616} viewBox="-308 -308 616 616" style={{ position: "absolute", left: 0, top: 0 }}>
        {SEC.map(([n, m, c], i) => { const a0 = acc, a1 = acc + (m / 180) * 360 * cl(phys(tt, 0.8 + i * 0.7, 5, 0.6)); acc += (m / 180) * 360;
          const p = (a: number, r: number) => `${r * Math.sin(a * Math.PI / 180)} ${-r * Math.cos(a * Math.PI / 180)}`;
          return <path key={n} d={`M 0 0 L ${p(a0, 280)} A 280 280 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1, 280)} Z`} fill={c} stroke="#6b4426" strokeWidth={3} opacity={0.95} />; })}
        <line x1={0} y1={0} x2={0} y2={-230} stroke={TIN} strokeWidth={12} strokeLinecap="round" transform={`rotate(${tt * 50})`} />
        <circle r={20} fill={TIN} />
      </svg>
    </div>
    {SEC.map(([n, m], i) => <Tag key={n} tt={tt} at={1.2 + i * 0.7} x={1520} y={340 + i * 110} txt={`${n} · ${m} MIN`} col={i === 3 ? MZ : TX} size={32} />)}
  </>;
}}</Stage>;

// 10 · VENTANA: la luna cruza la ventana de la cocina sobre la olla tapada; el nixtamal duerme
const HVentanaLuna: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#0f1322">{(tt) => {
  const m = eio(tt, 0.4, 6.0);
  return <>
    <Head tt={tt} kick="TRUCO 10" title="TODA LA NOCHE, TAPADO" />
    <div style={{ position: "absolute", left: 560, top: 160, width: 800, height: 460, background: "linear-gradient(180deg,#0b1430,#1d2f5a)", border: "26px solid #5a3a22", boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 760, top: rnd(i + 4) * 400, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.3 + 0.5 * Math.abs(Math.sin(tt + i)) }} />)}
      <div style={{ position: "absolute", left: lerp(-100, 820, m), top: 220 - Math.sin(m * Math.PI) * 160, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#fffbe8,#d9d2b8)", boxShadow: "0 0 60px 20px rgba(255,250,220,.35)" }} />
      <div style={{ position: "absolute", left: 386, top: 0, width: 26, height: 460, background: "#5a3a22" }} /><div style={{ position: "absolute", left: 0, top: 210, width: 800, height: 22, background: "#5a3a22" }} />
    </div>
    <Olla x={960} y={860} w={460} lvl={0} steam={0.6 * (1 - m)} tt={tt} />
    <div style={{ position: "absolute", left: 720, top: 640, width: 480, height: 40, borderRadius: 12, background: "repeating-linear-gradient(90deg,#9a2a22 0 30px,#e8d6b0 30px 60px)", transform: "rotate(-2deg)" }} />
    <Tag tt={tt} at={2.4} x={1560} y={760} txt="8 A 12 HORAS" col={MZ} size={44} />
  </>;
}}</Stage>;

// 11 · TIRA DE pH: el nejayote pinta la tira de violeta (alcalino): por eso no va a las plantas
const HTiraPh: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const dip = eio(tt, 0.6, 1.6), col = cl((tt - 1.8) / 1.4);
  return <>
    <Head tt={tt} kick="TRUCO 11" title="EL NEJAYOTE NO VA A LAS PLANTAS" />
    <div style={{ position: "absolute", left: 620, top: 600, width: 520, height: 340, borderRadius: "10px 10px 200px 200px", background: "linear-gradient(180deg,#e9e2c8,#c9bd94)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 870, top: lerp(160, 420, dip), width: 60, height: 420, borderRadius: 8, background: `linear-gradient(180deg,#f3e9c0 0 55%, rgb(${lerp(240, 110, col)},${lerp(220, 60, col)},${lerp(140, 160, col)}) 55%)`, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 1250, top: 300, display: "flex", gap: 8, opacity: cl(tt - 2.2) }}>
      {["#e94b3c", "#f08a3c", "#f2d03c", "#7cc04a", "#3aa0a0", "#5a5ac0", "#7a3cb0"].map((c, i) => <div key={i} style={{ width: 60, height: 90, borderRadius: 8, background: c, border: i === 6 ? `5px solid ${TX}` : "none" }} />)}
    </div>
    <Tag tt={tt} at={3.0} x={1460} y={460} txt="MUY ALCALINO" col={TX} size={36} />
    <Tag tt={tt} at={3.8} x={1460} y={560} txt="QUEMA LA RAÍZ" col={RED} size={40} />
  </>;
}}</Stage>;

// 12 · GRANO EN CAPAS: vista explotada (piel, cuerpo, germen); la piel se va a medias, no toda
const HCapasGrano: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const ex = eio(tt, 0.8, 2.6), half = eio(tt, 3.0, 4.4);
  const layer = (dx: number, w: number, hh: number, bg: string, label: string, at: number, op = 1) => <>
    <div style={{ position: "absolute", left: 960 + dx * ex - w / 2, top: 560 - hh / 2, width: w, height: hh, borderRadius: "48% 48% 42% 42% / 60% 60% 38% 38%", background: bg, opacity: op, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={at} x={960 + dx * ex} y={560 + hh / 2 + 60} txt={label} col={TX} size={30} />
  </>;
  return <>
    <Head tt={tt} kick="TRUCO 12" title="SE FROTA, PERO NO SE PELA TODO" />
    {layer(-480, 300, 380, "rgba(240,220,170,.55)", "PIEL", 1.8, 1 - half * 0.5)}
    {layer(0, 260, 330, "radial-gradient(ellipse at 40% 30%, #fff8 0 8%, #edcf7e 40%, #b8892e)", "CUERPO", 2.1)}
    {layer(420, 110, 150, "radial-gradient(circle at 40% 40%,#f6e7a8,#c9a23e)", "GERMEN", 2.4)}
    <div style={{ position: "absolute", left: 300, top: 860, width: 1320, textAlign: "center", fontFamily: HAND, fontSize: 52, color: MZ, opacity: cl(tt - 3.4) }}>un poquito de piel = la tortilla amarra</div>
  </>;
}}</Stage>;

// 13 · MOLINO DE MANO: la manivela gira en 3D y la masa sale por la boca en dos pasadas
const HMolino: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = tt * 220, pas = tt > 3.4 ? 2 : 1, flow = cl((tt - 0.8) / 2.4) - (tt > 3.4 ? 0 : 0);
  return <>
    <Head tt={tt} kick="TRUCO 13" title="MOLINO DE MANO: DOS PASADAS" />
    <div style={{ position: "absolute", left: 700, top: 240, width: 360, height: 300, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(90deg,#3a3d40,#6d7276 45%,#2c2f32)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 760, top: 140, width: 240, height: 130, background: "linear-gradient(180deg,#5a5e62,#3a3d40)", clipPath: "polygon(0 0,100% 0,75% 100%,25% 100%)" }} />
    <div style={{ position: "absolute", left: 1060, top: 390, width: 0, height: 0, transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: -12, width: 230, height: 24, borderRadius: 12, background: "#7d8286" }} />
      <div style={{ position: "absolute", left: 200, top: -40, width: 46, height: 80, borderRadius: 20, background: "linear-gradient(90deg,#6b4426,#a87044)" }} />
    </div>
    <div style={{ position: "absolute", left: 640, top: 540, width: 140, height: 60 + 260 * flow, borderRadius: "0 0 70px 70px", background: "linear-gradient(180deg,#e9d39a,#d6b56a)", filter: "url(#none)" }} />
    <div style={{ position: "absolute", left: 520, top: 820, width: 380, height: 120, borderRadius: "0 0 190px 190px", background: "linear-gradient(180deg,#b35a32,#6b2f17)" }} />
    <Tag tt={tt} at={1.4} x={1460} y={680} txt={`PASADA ${pas}`} col={MZ} size={56} />
    <Tag tt={tt} at={3.8} x={1460} y={790} txt="LA SEGUNDA, MÁS FINA" col={TX} size={34} />
  </>;
}}</Stage>;

// 14 · BOLITA: dos bolitas se aplastan entre palmas; la seca se agrieta en el borde, la buena queda lisa
const HBolita: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sq = eio(tt, 1.0, 2.2);
  const ball = (x: number, crack: boolean, at: number) => <div style={{ position: "absolute", left: x - 170, top: 560 - 170 * (1 - sq * 0.55), width: 340 + sq * 120, marginLeft: -sq * 60, height: 340 * (1 - sq * 0.55), borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f3dfa6, #d7b467 70%, #b08a3e)", boxShadow: "0 40px 60px rgba(0,0,0,.55)", opacity: cl(phys(tt, at, 6, 0.5)) }}>
    {crack && Array.from({ length: 7 }, (_, i) => { const an = i * 51; return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 120 * cl(tt - 2.4), height: 6, background: "#7a5222", transformOrigin: "0 50%", transform: `rotate(${an}deg) translateX(${120 + 60 * sq}px)` }} />; })}
  </div>;
  return <>
    <Head tt={tt} kick="TRUCO 14" title="LA BOLITA QUE NO SE AGRIETA" />
    {ball(580, true, 0.3)}{ball(1340, false, 0.6)}
    <Tag tt={tt} at={2.8} x={580} y={900} txt="SE AGRIETA = LE FALTA AGUA" col={RED} size={34} />
    <Tag tt={tt} at={3.4} x={1340} y={900} txt="LISITA = LISTA" col={MZ} size={38} />
  </>;
}}</Stage>;

// 15 · AGUA TIBIA: hilo de vapor sobre la jarra y una mano que cuenta con los dedos lo que aguanta
const HTibia: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Head tt={tt} kick="TRUCO 15" title="EL AGUA DE LA MASA, TIBIA" />
  <div style={{ position: "absolute", left: 640, top: 480, width: 380, height: 420, borderRadius: "40px 40px 120px 120px", background: "linear-gradient(90deg,#6b2f17,#b35a32 45%,#4a1f0f)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }} />
  <div style={{ position: "absolute", left: 980, top: 560, width: 120, height: 180, borderRadius: "0 80px 80px 0", border: "26px solid #8a3e1f", borderLeft: "none" }} />
  <svg width={600} height={420} style={{ position: "absolute", left: 530, top: 60 }}>{[0, 1].map((i) => <path key={i} d={`M ${270 + i * 60} 420 c -30 -50 30 -100 0 -150 c -30 -50 30 -100 0 -150`} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="0.35 0.65" strokeDashoffset={-((tt * 0.25 + i * 0.5) % 1)} />)}</svg>
  <div style={{ position: "absolute", left: 1260, top: 380, width: 220, height: 260, borderRadius: "50px 50px 40px 40px", background: "linear-gradient(180deg,#e7b394,#c98c6c)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 10 + i * 52, top: -150 * cl(phys(tt, 1.6 + i * 0.45, 7, 0.5)), width: 44, height: 160, borderRadius: 22, background: "linear-gradient(180deg,#e7b394,#cf9474)" }} />)}
  </div>
  <Tag tt={tt} at={3.8} x={1370} y={760} txt="QUE AGUANTE LA MANO" col={MZ} size={38} />
</>}</Stage>;

// 16 · TORTILLA 3D QUE SE INFLA: tres vueltas en el comal; a la tercera, el globo
const HInfla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#2a150a">{(tt) => {
  const v = Math.min(3, Math.floor(tt / 1.6) + 1), flip = (tt % 1.6) / 1.6, puff = eio(tt, 4.0, 5.2);
  return <>
    <Head tt={tt} kick="TRUCO 16" title="COMAL CALIENTE Y TRES VUELTAS" />
    <div style={{ position: "absolute", left: 960 - 470, top: 680, width: 940, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #3a3330, #161210)", boxShadow: "0 40px 70px rgba(0,0,0,.7), inset 0 0 40px rgba(255,120,40,.15)" }} />
    <Flame x={960} y={960} k={0.7} tt={tt} s={1.6} />
    <div style={{ position: "absolute", left: 960, top: 640, transform: `perspective(1200px) rotateX(${tt < 4 ? 70 + Math.sin(flip * Math.PI) * 110 : 70}deg) translateY(${tt < 4 ? -Math.sin(flip * Math.PI) * 160 : 0}px)` }}>
      <Tort x={0} y={0} d={520} puff={puff} style={{ borderRadius: "50%" }} />
      {puff > 0 && <div style={{ position: "absolute", left: -230, top: -230, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, rgba(255,240,200,.7), transparent 60%)", transform: `translateZ(${120 * puff}px)` }} />}
    </div>
    <Tag tt={tt} at={0.6} x={1560} y={300} txt={`VUELTA ${v}`} col={MZ} size={56} />
    <Tag tt={tt} at={4.4} x={1560} y={420} txt="¡SE INFLA!" col={TX} size={50} hand />
  </>;
}}</Stage>;

// 17 · CALIBRE: un calibre de taller cierra sobre la tortilla y marca el grosor de una moneda
const HCalibre: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const c = eio(tt, 0.8, 2.6);
  return <>
    <Head tt={tt} kick="TRUCO 17" title="EL GROSOR DE UNA MONEDA" />
    <div style={{ position: "absolute", left: 360, top: 540, width: 1100, height: 40, borderRadius: 20, background: "linear-gradient(180deg,#e2c27e,#b98f48)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 700, top: 300, width: 900, height: 70, background: "linear-gradient(180deg,#d9dde0,#8d9396)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: 10 + i * 14.6, top: 0, width: 2, height: i % 5 ? 18 : 32, background: "#222" }} />)}
    </div>
    <div style={{ position: "absolute", left: 720, top: 300, width: 60, height: lerp(140, 240, c), background: "linear-gradient(90deg,#b8bcbf,#e8ebed)" }} />
    <div style={{ position: "absolute", left: 980, top: 300, width: 60, height: lerp(140, 240, c), background: "linear-gradient(90deg,#b8bcbf,#e8ebed)", transform: `translateX(${lerp(260, -200, c)}px)` }} />
    <div style={{ position: "absolute", left: 1500, top: 480, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f4e2a0,#b8902e)", border: "8px solid #9a7422", opacity: cl(tt - 2.8), transform: `rotateY(${70 - 70 * cl(tt - 2.8)}deg)` }} />
    <Tag tt={tt} at={3.0} x={960} y={720} txt="2 MM" col={MZ} size={72} />
    <Tag tt={tt} at={3.6} x={1575} y={680} txt="= UNA MONEDA" col={TX} size={34} />
  </>;
}}</Stage>;

// 18 · CHIQUIHUITE: la canasta se cierra en capas (servilleta, tortillas, servilleta) y guarda el vapor
const HChiquihuite: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="TRUCO 18" title="CHIQUIHUITE Y SERVILLETA" />
  <div style={{ position: "absolute", left: 560, top: 520, width: 800, height: 360, borderRadius: "0 0 400px 400px", background: "repeating-linear-gradient(45deg,#a97a3e 0 18px,#7d5526 18px 36px)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }} />
  {Array.from({ length: 6 }, (_, i) => { const k = cl(phys(tt, 0.8 + i * 0.35, 6, 0.45)); return <Tort key={i} x={960} y={lerp(80, 540 - i * 10, k)} d={560} style={{ transform: "perspective(900px) rotateX(70deg)", opacity: cl(k * 2) }} />; })}
  <div style={{ position: "absolute", left: 520, top: 380, width: 880, height: 300, background: "repeating-linear-gradient(90deg,#f4efe2 0 40px,#e6dcc6 40px 80px)", borderRadius: 30, transformOrigin: "0 50%", transform: `perspective(1200px) rotateY(${lerp(-95, 0, eio(tt, 3.2, 4.4))}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.4)" }}>
    <div style={{ position: "absolute", left: 30, right: 30, top: 20, height: 26, background: "repeating-linear-gradient(90deg,#c0392b 0 20px,transparent 20px 40px)" }} />
  </div>
  <Tag tt={tt} at={4.6} x={1580} y={360} txt="EL VAPOR LAS ABLANDA" col={MZ} size={36} />
</>}</Stage>;

// 19 · EMBUDO: entra 1 kg de maíz, sale 1,8 kg de masa, y la masa se vuelve una pila de tortillas
const HEmbudo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = eio(tt, 0.6, 3.0), n = Math.floor(cl((tt - 2.6) / 2) * 30);
  return <>
    <Head tt={tt} kick="TRUCO 19" title="CUÁNTO RINDE UN KILO" />
    <div style={{ position: "absolute", left: 520, top: 200, width: 560, height: 360, background: "linear-gradient(90deg,#6b4426,#a87044 45%,#5a3a22)", clipPath: "polygon(0 0,100% 0,60% 100%,40% 100%)" }} />
    {Array.from({ length: 36 }, (_, i) => <Kern key={i} x={600 + rnd(i) * 400} y={lerp(160 + rnd(i + 1) * 80, 520, cl(f * 1.2 - rnd(i) * 0.3))} s={1} col="#f3efe2" o={1 - cl(f * 1.2 - rnd(i) * 0.3)} />)}
    <div style={{ position: "absolute", left: 750, top: 560, width: 100, height: 200 * f, borderRadius: "0 0 50px 50px", background: "linear-gradient(180deg,#e9d39a,#d6b56a)" }} />
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: 1220, top: 860 - i * 12, width: 360, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#f6e3b0,#d9b46e)", boxShadow: "0 4px 6px rgba(0,0,0,.35)" }} />)}
    <Tag tt={tt} at={1.0} x={800} y={130} txt="1 KG DE MAÍZ" col={TX} size={36} />
    <Tag tt={tt} at={2.6} x={800} y={850} txt="1,8 KG DE MASA" col={MZ} size={38} />
    <Tag tt={tt} at={4.4} x={1400} y={420} txt="UNAS 30 TORTILLAS" col={TX} size={36} />
  </>;
}}</Stage>;

// 20 · ALCANCÍA: cochinito de barro que se llena con monedas que caen con física; la tortillería al lado
const HAlcancia: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.floor(cl((tt - 1.0) / 3.6) * 14);
  return <>
    <Head tt={tt} kick="TRUCO 20" title="LA CUENTA CONTRA LA TORTILLERÍA" />
    <div style={{ position: "absolute", left: 760, top: 480, width: 460, height: 340, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #d9774a, #9b3f1c 70%)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 180, top: 20, width: 100, height: 14, borderRadius: 7, background: "#3a160a" }} />
      <div style={{ position: "absolute", left: -50, top: 130, width: 90, height: 90, borderRadius: "50%", background: "#b8552a" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 100, top: 300, width: 50, height: 70, borderRadius: 14, background: "#8a3818" }} />)}
    </div>
    {Array.from({ length: 14 }, (_, i) => { const k = cl(phys(tt, 1.0 + i * 0.26, 9, 0.3)); return i < n + 1 ? <div key={i} style={{ position: "absolute", left: 975, top: lerp(160, 490, k), width: 70, height: 70 * Math.abs(Math.cos(tt * 6 + i)) + 8, marginLeft: -35, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ffe9a6,#c99a2e)", border: "4px solid #9a7422", opacity: k < 0.98 ? 1 : 0 }} /> : null; })}
    <Tag tt={tt} at={1.2} x={460} y={420} txt="TORTILLERÍA $25 EL KILO" col={TX} size={34} />
    <Tag tt={tt} at={2.4} x={460} y={520} txt="EN SU CASA $12" col={MZ} size={40} />
    <Tag tt={tt} at={4.4} x={1460} y={420} txt="LA MITAD SE QUEDA" col={MZ} size={38} />
  </>;
}}</Stage>;

// 21 · TARJETAS QUE SE VOLTEAN: maíz blanco contra maíz azul (menos cal, menos tiempo)
const HVoltea: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#141a2a">{(tt) => {
  const card = (x: number, fl: number, front: string, back: string, col: string, kcol: string) => <div style={{ position: "absolute", left: x, top: 300, width: 420, height: 560, transformStyle: "preserve-3d", transform: `perspective(1600px) rotateY(${fl * 180}deg)` }}>
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 26, background: "#efe2c4", boxShadow: "0 40px 70px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 52, color: TIN }}>{front}</div>
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 26, background: col, boxShadow: "0 40px 70px rgba(0,0,0,.6)", padding: 30 }}>
      {Array.from({ length: 12 }, (_, i) => <Kern key={i} x={70 + (i % 4) * 90} y={80 + Math.floor(i / 4) * 90} s={1.6} col={kcol} />)}
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 30, textAlign: "center", fontWeight: 900, fontSize: 34, color: TX, whiteSpace: "pre-line" }}>{back}</div>
    </div>
  </div>;
  return <>
    <Head tt={tt} kick="TRUCO 21" title="EL AZUL PIDE MENOS" />
    {card(420, eio(tt, 0.8, 1.8), "BLANCO", "1 CDA DE CAL\n50 MIN", "#4a4436", "#f3efe2")}
    {card(1080, eio(tt, 2.0, 3.0), "AZUL", "MEDIA CDA\n30 MIN", "#1e2a52", "#5a6fb0")}
  </>;
}}</Stage>;

// 22 · PIZARRA: una curva con tiza (masa que mejora, punto justo, y se pasa: chiclosa)
const HPizarra: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#14201a">{(tt) => {
  const d = eio(tt, 0.6, 3.6);
  return <>
    <Head tt={tt} kick="TRUCO 22" title="EL NIXTAMAL PASADO" col={RED} />
    <div style={{ position: "absolute", left: 300, top: 230, width: 1320, height: 700, borderRadius: 16, background: "radial-gradient(ellipse at 40% 40%,#2e4436,#1a2a20)", border: "28px solid #6b4426", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      <svg width={1264} height={644} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M 80 560 L 80 60 M 80 560 L 1200 560" stroke="rgba(255,255,255,.7)" strokeWidth={6} fill="none" />
        <path d="M 90 520 C 300 480, 460 140, 620 130 S 900 260, 1180 520" stroke="rgba(255,255,255,.92)" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
        <circle cx={620} cy={130} r={22 * cl(tt - 2.2)} fill={MZ} />
        <circle cx={1100} cy={460} r={22 * cl(tt - 3.4)} fill={RED} />
      </svg>
      <div style={{ position: "absolute", left: 520, top: 40, fontFamily: HAND, fontSize: 46, color: MZ, opacity: cl(tt - 2.4) }}>el punto</div>
      <div style={{ position: "absolute", left: 960, top: 380, fontFamily: HAND, fontSize: 46, color: "#ff9c8a", opacity: cl(tt - 3.6) }}>chiclosa</div>
      <div style={{ position: "absolute", left: 1000, top: 580, fontFamily: HAND, fontSize: 34, color: "rgba(255,255,255,.7)" }}>tiempo en la olla</div>
    </div>
  </>;
}}</Stage>;

// 23 · PINZA: macro del grano cacahuacintle; la pinza le quita la cabecita y el grano «florea»
const HPinza: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 1.0, 2.2), fl = eio(tt, 3.0, 4.6);
  return <>
    <Head tt={tt} kick="TRUCO 23" title="PARA POZOLE: SE DESCABEZA" />
    <div style={{ position: "absolute", left: 960 - 200, top: 560 - 230, width: 400, height: 460, borderRadius: `${48 + fl * 10}% ${48 + fl * 10}% 42% 42% / 60% 60% 38% 38%`, background: "radial-gradient(ellipse at 40% 30%, #fff 0 8%, #f1ead6 40%, #c9b88a)", transform: `scale(${1 + fl * 0.35})`, boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      {fl > 0 && [0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 200, top: 40, width: 150 * fl, height: 160 * fl, marginLeft: -75 * fl, borderRadius: "50%", background: "radial-gradient(circle,#fffdf6,#efe6cf)", transform: `rotate(${i * 90 + 45}deg) translateY(${-60 * fl}px)` }} />)}
    </div>
    <div style={{ position: "absolute", left: 960 - 50, top: lerp(560 + 230, 560 + 520, cl((tt - 2.2) / 0.8)), width: 100, height: 70, borderRadius: "50% 50% 30% 30%", background: "#8a6a3a", opacity: g }} />
    {[1, -1].map((s) => <div key={s} style={{ position: "absolute", left: 960 + s * lerp(90, 20, g) - 10, top: lerp(260, 760, g) - 520, width: 20, height: 560, borderRadius: 10, background: "linear-gradient(90deg,#9aa0a3,#dfe3e5)", transform: `rotate(${s * 6}deg)`, transformOrigin: "50% 0" }} />)}
    <Tag tt={tt} at={2.6} x={1460} y={820} txt="SIN CABECITA, FLOREA" col={MZ} size={38} />
  </>;
}}</Stage>;

// 24 · MAPA DE MESOAMÉRICA: la ruta del maíz se dibuja sobre papel amate; 3.500 años
const HMapa: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#24180c">{(tt) => {
  const d = eio(tt, 0.8, 4.2), yr = Math.round(lerp(1500, 3500, eio(tt, 1.0, 4.4)));
  return <>
    <Head tt={tt} kick="TRUCO 24" title="POR QUÉ ALIMENTA MÁS" />
    <div style={{ position: "absolute", left: 320, top: 220, width: 1280, height: 720, borderRadius: 10, background: "radial-gradient(ellipse at 40% 40%,#b48a5a,#7d5a36)", boxShadow: "0 50px 80px rgba(0,0,0,.6)", transform: `perspective(1800px) rotateX(${14 - 4 * Math.sin(tt * 0.3)}deg)` }}>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <path d="M 160 120 C 360 200, 480 260, 620 330 C 760 400, 820 470, 980 520 C 1060 545, 1120 600, 1180 660" fill="rgba(60,40,20,.25)" stroke="rgba(40,25,10,.6)" strokeWidth={4} />
        <path d="M 300 220 Q 520 300 640 360 T 980 520" fill="none" stroke={MZ} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
        {[[300, 220], [640, 360], [980, 520]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={18 * cl(d * 3 - i)} fill={RED} />)}
      </svg>
      <div style={{ position: "absolute", left: 860, top: 80, fontFamily: HAND, fontSize: 64, color: TIN }}>{yr.toLocaleString("es-MX")} años</div>
    </div>
    <Tag tt={tt} at={4.0} x={960} y={1000} txt="LA CAL SUELTA LO QUE ALIMENTA" col={MZ} size={34} />
  </>;
}}</Stage>;

// 25 · TIMELAPSE: el sol se va y la luna cruza sobre la olla del nixtamal; amanece: masa lista
const HSolLuna: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a1420">{(tt) => {
  const k = eio(tt, 0.3, 6.0), sky = k < 0.5 ? lerp(0.8, 0.05, k * 2) : lerp(0.05, 0.7, (k - 0.5) * 2);
  const orb = (ph: number, c: string) => { const a = Math.PI * cl(ph); return { left: 960 - Math.cos(a) * 760 - 70, top: 760 - Math.sin(a) * 520 - 70, background: c }; };
  return <>
    <Head tt={tt} kick="TRUCO 25" title="LA NOCHE ENTERA" />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(255,170,90,${sky * 0.5}), rgba(20,20,60,${0.6 - sky * 0.5}))` }} />
    <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", boxShadow: "0 0 80px 30px rgba(255,200,90,.45)", ...orb(k * 2, "#ffcf6a"), opacity: k < 0.5 ? 1 : 0 }} />
    <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", boxShadow: "0 0 60px 20px rgba(230,230,255,.35)", ...orb(k * 2 - 0.6, "#eef0ff"), opacity: k > 0.3 ? 1 : 0 }} />
    <Olla x={960} y={900} w={520} lvl={0} steam={0.5} tt={tt} />
    <Tag tt={tt} at={5.2} x={960} y={300} txt="AMANECE: LA MASA, OTRA" col={MZ} size={46} />
  </>;
}}</Stage>;

// A · ERRORES: pila de cinco tortillas rotas; cada una se levanta al nombrarse y muestra su foto debajo
const HErroresTort: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#2a0f0a">{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LOS 5 ERRORES" title="LA TORTILLA QUEBRADIZA" col={RED} />
    {E.map((e, i) => { const up = cl(phys(t, e.a, 6, 0.55)), x = 300 + i * 330, cur = E.reduce((c, q, j) => (t >= q.a ? j : c), -1) === i;
      return <div key={i} style={{ position: "absolute", left: x, top: 380 }}>
        <div style={{ position: "absolute", left: 10, top: 80, opacity: up }}><Photo id={im(h, i)} w={280} h={340} r={18} dim={cur ? 0 : 0.45} /></div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${-260 * up}px) rotate(${(i % 2 ? 1 : -1) * 14 * up}deg)` }}><Tort x={150} y={260} d={300} crack={1} style={{ transform: "perspective(900px) rotateX(55deg)" }} /></div>
        <div style={{ position: "absolute", left: 0, width: 300, top: 450, textAlign: "center", fontWeight: 900, fontSize: 26, color: cur ? TX : DIM, opacity: up }}><span style={{ color: RED, fontSize: 40 }}>{i + 1} </span>{e.tx}</div>
      </div>; })}
  </>;
}}</Stage>;

// B · RUTINA: escalera de cinco escalones 3D; Cuca sube un escalón por paso y cada escalón lleva su foto
const HEscalera: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[];
  return <>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="EN CINCO PASOS" />
    {S.map((s, i) => { const k = cl(phys(t, s.a, 6, 0.5)), x = 220 + i * 320, y = 820 - i * 120;
      return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 200}px)` }}>
        <div style={{ width: 300, height: 60, background: "linear-gradient(180deg,#b08a5a,#6b4a2a)", boxShadow: "0 30px 40px rgba(0,0,0,.5)", transform: "perspective(900px) rotateX(40deg)" }} />
        <div style={{ position: "absolute", left: 30, top: -250 }}><Photo id={im(h, i)} w={240} h={220} r={14} /></div>
        <div style={{ position: "absolute", left: 0, width: 300, top: 70, textAlign: "center", fontWeight: 900, fontSize: 26, color: TX }}><span style={{ color: MZ }}>{i + 1} · </span>{s.tx}</div>
      </div>; })}
  </>;
}}</Stage>;

// C · LO QUE NUNCA HACÍA: puertas de alacena que se abren una por una; adentro su foto y un cerrojo rojo
const HAlacena: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#24140c">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], n = S.length, w = Math.min(330, 1500 / n);
  return <>
    <Head tt={tt} kick="LO QUE MI ABUELA" title="NUNCA HACÍA" col={RED} />
    {S.map((s, i) => { const o = eio(t, s.a, s.a + 0.9), x = 960 - (n * w) / 2 + i * w;
      return <div key={i} style={{ position: "absolute", left: x, top: 300, width: w - 20, height: 520 }}>
        <div style={{ position: "absolute", inset: 0, background: "#1a0f08", borderRadius: 8, overflow: "hidden" }}><Photo id={im(h, i)} w={w - 20} h={400} r={0} /><div style={{ padding: 10, fontFamily: HAND, fontSize: 32, color: TX, textAlign: "center" }}>{s.tx}</div></div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "repeating-linear-gradient(90deg,#7d5526 0 22px,#6b4622 22px 44px)", border: "6px solid #4a2e14", transformOrigin: "0 50%", transform: `perspective(1200px) rotateY(${-100 * o}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: (w - 20) / 2 - 50, top: 470, width: 100, padding: "6px 0", borderRadius: 8, background: RED, textAlign: "center", fontWeight: 900, fontSize: 24, color: TX, transform: `scale(${cl(phys(t, s.a + 0.9, 8, 0.4))})` }}>NUNCA</div>
      </div>; })}
  </>;
}}</Stage>;

// D · REPASO: un rollo de papel de estraza se desenrolla y va escribiendo los trucos a mano
const HRollo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0), sc = lerp(Math.max(0, cur - 7), Math.max(0, cur - 6), cl(phys(t, S[cur]?.a ?? 0, 5, 0.6))) * 78;
  return <>
    <Head tt={tt} kick="REPASO RÁPIDO" title="LOS 24, EN EL ROLLO" />
    <div style={{ position: "absolute", left: 560, top: 200, width: 800, height: 760, overflow: "hidden", background: "linear-gradient(90deg,#c9a878,#e2c79a 50%,#c9a878)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
      {S.map((s, i) => <div key={i} style={{ position: "absolute", left: 60, top: 40 + i * 78 - sc, fontFamily: HAND, fontSize: 44, color: TIN, opacity: t >= s.a ? 1 : 0, clipPath: `inset(0 ${100 - 100 * cl((t - s.a) / 0.6)}% 0 0)` }}><span style={{ color: BR }}>{i + 1}.</span> {s.tx}</div>)}
    </div>
    <div style={{ position: "absolute", left: 530, top: 930, width: 860, height: 90, borderRadius: 45, background: "linear-gradient(180deg,#e2c79a,#9c7a4a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
  </>;
}}</Stage>;

export const MAP: Record<string, C> = { mazorca: HMazorca, cubeta: HCubeta, balanza: HBalanza, bolsacal: HBolsaCal, vasocal: HVasoCal, aluminio: HAluminio, muestrario: HMuestrario,
  una: HUna, relojpared: HRelojPared, ventanaluna: HVentanaLuna, tiraph: HTiraPh, capasgrano: HCapasGrano, molino: HMolino, bolita: HBolita, tibia: HTibia, infla: HInfla,
  calibre: HCalibre, chiquihuite: HChiquihuite, embudo: HEmbudo, alcancia: HAlcancia, voltea: HVoltea, pizarra: HPizarra, pinza: HPinza, mapa: HMapa, solluna: HSolLuna,
  errorestort: HErroresTort, escalera: HEscalera, alacena: HAlacena, rollo: HRollo };

import { MAP3 } from "./heroes3d";
Object.assign(MAP, MAP3);
