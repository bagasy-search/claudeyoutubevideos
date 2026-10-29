// rosa29c · componentes únicos 31-40. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Steam, Tape, Big, Jar, Table, Shadow } from "./rkit";
import { P, sp, pos, NIGHT } from "./hc1";

// 31 · «A la mañana, la cáscara estaba negra y dura como una piedra, y por dentro… blanda, dulce, naranja»: el cuchillo grande golpea la calabaza negra, se raja y se abre naranja
export const CrackShell: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), hit = eio(tt, 0.4, 0.7) * (1 - eio(tt, 0.9, 1.3)), crack = eio(tt, 0.7, 1.6), op = eio(tt, 1.8, 2.8);
  const half = (d: number) => <div style={{ position: "absolute", left: d < 0 ? 0 : 300, top: 0, width: 300, height: 440, overflow: "hidden", transformOrigin: d < 0 ? "100% 100%" : "0 100%", transform: `rotate(${d * 22 * op}deg) translateX(${d * 40 * op}px)` }}>
    <div style={{ position: "absolute", left: d < 0 ? 0 : -300, top: 0, width: 600, height: 440, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#3a3530,#151210 70%)", boxShadow: "inset 0 0 40px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: d < 0 ? 270 : 0, top: 30, width: 30 + 0, height: 380, background: "radial-gradient(ellipse,#ffb04a,#f08a1a)", opacity: op }} />
  </div>;
  return <>
    <Table y={860} />
    <Shadow x={960} y={860} w={640} s={s} />
    <div style={pos(960, 640, `scale(${s})`, { width: 600, height: 440 })}>
      {half(-1)}{half(1)}
      <svg width={600} height={440} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - op }}><path d="M 300 0 L 280 80 L 320 150 L 285 230 L 315 310 L 300 440" stroke="#f08a1a" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${crack} 1`} style={{ filter: "drop-shadow(0 0 8px #ffb04a)" }} /></svg>
    </div>
    <div style={pos(960 + 40, 300 + 120 * hit, "rotate(-8deg)", { width: 60, height: 360, background: "linear-gradient(90deg,#9aa3aa,#f4f6f8,#7a848c)", clipPath: "polygon(0 0,100% 0,100% 100%,0 85%)", opacity: 1 - eio(tt, 1.6, 2.0) })} />
    <Steam tt={tt} x={960} y={460} w={300} h={220} o={op} />
    <Big tt={tt} at={0.6} x={1560} y={300} txt="DURA COMO PIEDRA" size={60} />
    <Big tt={tt} at={2.6} x={960} y={160} txt="BLANDA Y DULCE" size={96} col={AMB} />
  </>;
}}</Stage>;

// 32 · «Y decía que las lentejas eran la carne de los pobres»: las lentejas caen y se acomodan hasta formar la silueta de un bife
export const LentilSteak: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), f = eio(tt, 0.3, 3.4);
  const N = 220, inside = (x: number, y: number) => ((x / 300) ** 2 + (y / 190) ** 2 < 1) && !(((x - 240) / 110) ** 2 + ((y + 60) / 90) ** 2 < 1);
  const pts: [number, number][] = [];
  for (let i = 0; pts.length < N && i < 4000; i++) { const x = ((i * 97) % 600) - 300, y = ((i * 61) % 380) - 190; if (inside(x, y)) pts.push([x, y]); }
  return <>
    <div style={pos(960, 600, `scale(${s})`, { width: 820, height: 560, borderRadius: "50%", background: "radial-gradient(ellipse,#fbfdff,#dfe6ec 60%,#c9d2da 70%)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" })} />
    {pts.map(([x, y], i) => { const sx = 960 + ((i * 131) % 900) - 450, sy = 120 + (i * 17) % 120, g = eio(f, (i % 40) / 80, (i % 40) / 80 + 0.5);
      return <div key={i} style={{ position: "absolute", left: sx + (960 + x - sx) * g - 9, top: sy + (600 + y - sy) * g - 6, width: 18, height: 12, borderRadius: "50%", background: i % 4 ? "#8a5a2a" : "#6a4018", transform: `rotate(${i * 37}deg)`, boxShadow: "0 2px 2px rgba(0,0,0,.3)" }} />; })}
    <div style={pos(1200, 560, "", { width: 70, height: 26, borderRadius: 13, background: "#f2ece0", opacity: cl((tt - 3.0) * 2), transform: "translate(-50%,-50%) rotate(-20deg)" })} />
    <Big tt={tt} at={3.2} x={960} y={1000} txt="LA CARNE DE LOS POBRES" size={76} col={AMB} />
  </>;
}}</Stage>;

// 33 · «La leche venía tibia del ordeñe de la mañana, con espuma»: el balde de lata se llena con el chorro y la espuma sube por encima del borde
export const Pail: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#f6e2b8,#d8b07a)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lv = eio(tt, 0.4, 4.4);
  return <>
    <div style={pos(960, 940, "", { width: 2000, height: 240, background: "repeating-linear-gradient(10deg,#c9a35a 0 10px,#b08a40 10px 16px)" })} />
    <div style={pos(960, 680, `scale(${s})`, { width: 440, height: 440 })}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 440, height: 400, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,#8a949c,#eef2f5 40%,#9aa3aa 70%,#5b636a)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
      {[120, 260].map((y) => <div key={y} style={{ position: "absolute", left: 12 + (y / 400) * 40, top: 40 + y, width: 416 - (y / 400) * 80, height: 10, background: "rgba(0,0,0,.18)" }} />)}
      <div style={{ position: "absolute", left: 10, top: 40 - 40 * lv, width: 420, height: 60 + 30 * lv, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 60%, #fffef8, #f6f2e6 70%)", opacity: cl(lv * 4) }}>
        {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i * 23) % 360, top: 10 + (i * 13) % 40 - 10 * Math.sin(tt * 2 + i), width: 30 + (i % 3) * 10, height: 30 + (i % 3) * 10, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #ece6d6)", opacity: lv }} />)}
      </div>
      <svg width={600} height={300} style={{ position: "absolute", left: -80, top: -220 }}><path d="M 80 260 C 80 40, 520 40, 520 260" stroke="#5b636a" strokeWidth={10} fill="none" /></svg>
    </div>
    {tt > 0.3 && tt < 4.6 && <div style={pos(960, 330, "", { width: 22, height: 420, borderRadius: 11, background: "linear-gradient(90deg,#f2ede0,#fff,#e8e2d2)", opacity: 0.95 })} />}
    <Steam tt={tt} x={960} y={500} w={300} h={200} o={0.5 * lv} />
    <Big tt={tt} at={2.0} x={1500} y={260} txt="TIBIA, CON ESPUMA" size={66} col="#6b2a14" />
  </>;
}}</Stage>;

// 34 · «Al final, aplastas dos o tres papas contra la pared de la olla para que el caldo espese»: en corte, la cuchara aplasta tres papas contra la pared y el caldo se vuelve espeso
export const Mash: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), th = eio(tt, 0.6, 3.4);
  const brothCol = `rgb(${Math.round(230 - 20 * th)},${Math.round(140 + 30 * th)},${Math.round(70 + 40 * th)})`;
  return <>
    <div style={pos(960, 620, `scale(${s})`, { width: 900, height: 560 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 560, borderRadius: "20px 20px 140px 140px", background: "linear-gradient(90deg,#5b636a,#c9d0d6 40%,#3a4048)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 30, top: 140, width: 840, height: 390, borderRadius: "0 0 120px 120px", background: `linear-gradient(180deg, ${brothCol}, rgb(200,110,50))`, opacity: 0.6 + 0.4 * th }} />
      {Array.from({ length: 9 }, (_, i) => { const sq = i < 3 ? eio(tt, 0.6 + i * 0.8, 1.0 + i * 0.8) : 0; return <div key={i} style={{ position: "absolute", left: i < 3 ? 40 : 140 + (i - 3) * 110, top: i < 3 ? 180 + i * 110 : 260 + ((i * 47) % 160), width: i < 3 ? 120 - 70 * sq : 100, height: i < 3 ? 100 + 20 * sq : 90, borderRadius: i < 3 ? "20%" : "26%", background: "radial-gradient(ellipse at 40% 30%,#f6dca0,#d8b060)", boxShadow: "0 6px 8px rgba(0,0,0,.25)" }} />; })}
    </div>
    {(() => { const k = Math.min(2, Math.floor(cl((tt - 0.4) / 2.4) * 3)), y = 470 + k * 110, push = Math.sin(Math.PI * ((((tt - 0.4) / 0.8) % 1 + 1) % 1)) * (tt > 0.4 && tt < 2.9 ? 1 : 0);
      return <div style={pos(700 - 120 * push, y, "rotate(70deg)", { width: 70, height: 460 })}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 70, height: 110, borderRadius: "50%", background: "linear-gradient(90deg,#8a5a34,#c79a68,#7a4a28)" }} />
        <div style={{ position: "absolute", left: 24, top: 100, width: 22, height: 360, borderRadius: 11, background: "linear-gradient(90deg,#8a5a34,#c79a68,#7a4a28)" }} />
      </div>; })()}
    <Big tt={tt} at={2.8} x={960} y={150} txt="ASÍ ESPESA" size={110} col={AMB} />
  </>;
}}</Stage>;

// 35 · «La repartes en bolsitas o frascos de a una taza, y al congelador»: la olla de salsa se reparte en ocho bolsitas que se acomodan paradas en el cajón del congelador
export const Bags8: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #2a3a4a, #0b0e12 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), dr = eio(tt, 3.6, 4.4);
  return <>
    <div style={pos(960, 760 - 40 * dr, `scale(${s})`, { width: 1320, height: 300, borderRadius: 20, background: "linear-gradient(180deg,#eef4f8,#b8c8d4)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 10px 30px rgba(255,255,255,.6)" })}>
      {Array.from({ length: 8 }, (_, i) => { const q = sp(tt, 0.5 + i * 0.35, 6, 0.45); return q > 0.01 ? <div key={i} style={{ position: "absolute", left: 60 + i * 152, top: 40 - 360 * (1 - cl(q)), width: 130, height: 220, borderRadius: "10px 10px 26px 26px", background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,.2)), linear-gradient(180deg,#e8463a,#b8281c)", boxShadow: "0 10px 16px rgba(0,0,0,.35)", opacity: cl(q * 3) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 130, height: 22, background: "#2f7fd8", borderRadius: "10px 10px 0 0" }} />
        <div style={{ position: "absolute", left: 14, top: 80, width: 100, height: 40, borderRadius: 4, background: "#fbfaf6", fontFamily: "'Caveat',cursive", fontSize: 30, fontWeight: 700, color: "#2b2620", textAlign: "center", lineHeight: "40px" }}>1 taza</div>
      </div> : null; })}
    </div>
    <div style={pos(960, 590 - 240 * (1 - dr), "", { width: 1360, height: 40, borderRadius: 10, background: "linear-gradient(180deg,#dfe6ec,#8a949c)", opacity: dr })} />
    {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 340 + (i * 43) % 1240, top: 640 + (i * 29) % 260, width: 8, height: 8, background: "#e8f4ff", transform: "rotate(45deg)", opacity: 0.5 * dr }} />)}
    <Big tt={tt} at={1.0} x={960} y={200} txt="OCHO COMIDAS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 36 · «El error es la sartén fría: la masa se pega y no se forma la costra»: la sartén de hierro vibra de calor; entra la masa y un anillo dorado de costra se forma desde el borde
export const Crust: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), heat = eio(tt, 0.2, 1.4), pour = eio(tt, 1.4, 2.2), cr = eio(tt, 2.2, 4.8);
  return <>
    <div style={pos(960, 600, `scale(${s})`, { width: 780, height: 780, borderRadius: "50%", background: `radial-gradient(circle, #1a1a1a 0 64%, #2a2a2a 66%, #0a0a0a 70%)`, boxShadow: `0 40px 70px rgba(0,0,0,.7), 0 0 ${80 * heat}px rgba(255,120,40,${0.35 * heat})` })}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 90, top: 160 + 30 * Math.sin(tt * 2 + i), width: 60, height: 300, background: "linear-gradient(0deg, transparent, rgba(255,200,150,.12), transparent)", filter: "blur(10px)", opacity: heat * (1 - pour) }} />)}
      <div style={{ position: "absolute", left: 390 - 270 * pour, top: 390 - 270 * pour, width: 540 * pour, height: 540 * pour, borderRadius: "50%", background: `radial-gradient(circle, #f6e08a 0 ${60 - 30 * cr}%, #e8a838 ${70 - 20 * cr}%, #a86418 ${78}%)` }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 270 + 180 * Math.cos(i * 0.45) * ((i % 5) / 5), top: 270 + 180 * Math.sin(i * 0.45) * ((i % 5) / 5), width: 30, height: 20, borderRadius: 6, background: "#b8742a", opacity: pour }} />)}
      </div>
      <div style={{ position: "absolute", left: 760, top: 360, width: 420, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#2a2a2a,#0d0d0d)" }} />
    </div>
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 1.6 + i * 0.1) % 1; return tt > 2.2 ? <div key={i} style={{ position: "absolute", left: 960 + 290 * Math.cos(i * 0.63) - 4, top: 600 + 290 * Math.sin(i * 0.63) - 40 * ph, width: 8, height: 8, borderRadius: "50%", background: "#fff3c0", opacity: 1 - ph }} /> : null; })}
    <Tape txt="BIEN CALIENTE" x={1580} y={280} s={sp(tt, 0.8)} size={48} col="#b33a2c" />
    <Big tt={tt} at={3.4} x={960} y={1010} txt="LA COSTRA" size={100} col={AMB} />
  </>;
}}</Stage>;

// 37 · «El error es poner todo a la vez… Por tiempos»: la olla en corte y una regla de tiempo al costado: entra la carne, después la mazorca, después las papas
export const Staged: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const ST: [number, string, string, number][] = [[0.5, "1 H 30", "#8a3a2a", 140], [2.0, "+ 20 MIN", "#f2c040", 110], [3.4, "+ 20 MIN", "#f6dca0", 100]];
  return <>
    <div style={pos(820, 640, `scale(${s})`, { width: 760, height: 520 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 520, borderRadius: "40px 40px 200px 200px", background: "radial-gradient(ellipse at 40% 30%,#c47040,#7a3b1f)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 40, top: 120, width: 680, height: 360, borderRadius: "0 0 170px 170px", background: "linear-gradient(180deg,#d8a060,#a86a30)", opacity: 0.9 }} />
      {ST.map(([a, , c, w], i) => { const q = sp(tt, a, 6, 0.45); return q > 0.01 ? <div key={i} style={{ position: "absolute", left: 120 + i * 190, top: 300 - i * 30 - 400 * (1 - cl(q)), width: w, height: w * 0.75, borderRadius: i === 1 ? 40 : "40%", background: i === 1 ? "radial-gradient(circle at 30% 30%, #ffe27a 0 6px, transparent 7px) 0 0/22px 22px, #f2c040" : `radial-gradient(ellipse at 40% 30%, ${c}cc, ${c})`, boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} /> : null; })}
    </div>
    <div style={pos(1500, 600, `scale(${s})`, { width: 24, height: 560, borderRadius: 12, background: "linear-gradient(180deg,#f2ece0,#c9bea4)" })} />
    {ST.map(([a, l], i) => <React.Fragment key={i}>
      <div style={pos(1500, 360 + i * 220, `scale(${sp(tt, a)})`, { width: 50, height: 50, borderRadius: "50%", background: AMB, boxShadow: "0 0 20px rgba(242,182,48,.6)" })} />
      <Tape txt={l} x={1680} y={360 + i * 220} s={sp(tt, a + 0.2)} size={40} />
    </React.Fragment>)}
    <Big tt={tt} at={4.0} x={820} y={190} txt="POR TIEMPOS" size={110} col={AMB} />
  </>;
}}</Stage>;

// 38 · «Mi madre se paró, fue a la despensa, y sacó dos frascos… Y dijo: con esto pasamos el invierno»: de noche, con nieve en la ventana, dos frascos salen del estante y brillan sobre la mesa
export const TwoJars: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg={NIGHT}>{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), j1 = eio(tt, 0.8, 1.8), j2 = eio(tt, 1.6, 2.6), gl = eio(tt, 2.8, 4.0);
  return <>
    <div style={pos(1560, 300, "", { width: 320, height: 300, background: "linear-gradient(180deg,#1a2a44,#2c3e5a)", border: "16px solid #4a2f1b", overflow: "hidden" })}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 47) % 300, top: ((i * 31) % 300 + tt * (30 + (i % 4) * 10)) % 300, width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />)}
    </div>
    <div style={pos(560, 360, `scale(${s})`, { width: 620, height: 20, borderRadius: 4, background: "linear-gradient(180deg,#8a5a34,#5b3a22)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" })} />
    {[["#f2c040", "MAÍZ", j1, 460], ["#5a1e10", "FRIJOL", j2, 660]].map(([c, l, f, x0]) => { const ff = f as number, xx = x0 as number;
      return <div key={l as string} style={pos(xx + (960 + (xx - 560) * 0.9 - xx) * ff, 250 + 440 * ff - 160 * Math.sin(Math.PI * ff), `scale(${s * (1 + 0.3 * ff)})`, { filter: `drop-shadow(0 0 ${40 * gl}px rgba(255,200,110,.8))` })}>
        <Jar w={150} fill={0.85} col={c as string} lid="#6b4224" label={l as string} />
      </div>; })}
    <div style={pos(960, 880, "", { width: 1400, height: 40, borderRadius: 10, background: "linear-gradient(180deg,#6b4224,#3a2414)" })} />
    <div style={pos(960, 520, "", { width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,200,110,.25), transparent 70%)", opacity: gl })} />
    <Tape txt="1953" x={360} y={180} s={sp(tt, 0.4)} size={70} rot={-4} />
    <Big tt={tt} at={3.2} x={960} y={1000} txt="CON ESTO PASAMOS EL INVIERNO" size={58} col={AMB} />
  </>;
}}</Stage>;

// 39 · «Esa olla nunca se vaciaba del todo. Se le iba agregando»: el cucharón saca y el nivel baja; entra una papa, una calabaza, y el nivel vuelve a subir
export const NeverEmpty: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cyc = (tt - 0.4) / 1.4, ph = ((cyc % 1) + 1) % 1, k = Math.floor(Math.max(0, cyc));
  const lv = 0.75 + 0.15 * Math.cos(Math.PI * 2 * cl(cyc / 4) * 4) * (tt > 0.4 ? 1 : 0);
  const adds = ["#f6dca0", "#f08a1a", "#8ac05a", "#f6dca0"];
  return <>
    <Table y={880} />
    <div style={pos(960, 680, `scale(${s})`, { width: 700, height: 460 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 700, height: 400, borderRadius: "40px 40px 300px 300px", background: "radial-gradient(ellipse at 40% 30%,#c47040,#7a3b1f)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 30, top: 50 + 160 * (1 - lv), width: 640, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse, #b8742a, #6a3a14 75%)" }}>
        {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 70, top: 18 + (i % 2) * 14, width: 30, height: 22, borderRadius: "50%", background: i % 2 ? "#f2c040" : "#5a1e10" }} />)}
      </div>
    </div>
    <Steam tt={tt} x={960} y={520} w={360} h={240} o={0.6} />
    {k % 2 === 0 ? <div style={pos(1200 - 120 * Math.sin(Math.PI * ph), 520 - 180 * Math.sin(Math.PI * ph), `rotate(${-30 + 30 * Math.sin(Math.PI * ph)}deg)`, { width: 120, height: 380 })}>
      <div style={{ position: "absolute", left: 0, top: 280, width: 120, height: 90, borderRadius: "0 0 60px 60px", background: "linear-gradient(90deg,#8a949c,#eef2f5,#5b636a)" }} />
      <div style={{ position: "absolute", left: 52, top: 0, width: 16, height: 290, background: "linear-gradient(90deg,#8a949c,#eef2f5,#5b636a)" }} />
    </div> : <div style={pos(720 + 240 * ph, 300 + 300 * ph * ph, `rotate(${ph * 200}deg)`, { width: 110, height: 90, borderRadius: "40%", background: adds[(k >> 1) % 4], boxShadow: "0 8px 12px rgba(0,0,0,.35)", opacity: 1 - eio(ph, 0.85, 1) })} />}
    <Big tt={tt} at={1.6} x={960} y={190} txt="NUNCA SE VACIABA" size={100} col={AMB} />
  </>;
}}</Stage>;

// 40 · «La despensa de los siete frascos. Lo que mi madre tenía siempre en el estante»: la alacena de madera abre sus puertas y los siete frascos se encienden de a uno
export const Shelf7: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), dr = eio(tt, 0.3, 1.2);
  const J: [string, string][] = [["#f2c040", "MAÍZ"], ["#5a1e10", "FRIJOL"], ["#8a5a2a", "LENTEJA"], ["#f6f2e6", "ARROZ"], ["#e8c84a", "ACEITE"], ["#f2ece0", "AJO"], ["#ffffff", "SAL"]];
  return <>
    <div style={pos(960, 580, `scale(${s})`, { width: 1300, height: 760 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1300, height: 760, borderRadius: 18, background: "linear-gradient(180deg,#7a4a28,#5b3a22)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 20px #4a2f1b" }} />
      {[260, 520].map((y) => <div key={y} style={{ position: "absolute", left: 30, top: y + 200, width: 1240, height: 18, background: "linear-gradient(180deg,#a8763e,#6b4224)" }} />)}
      {J.map(([c, l], i) => { const on = cl((tt - 1.4 - i * 0.45) * 2.5), x = i < 4 ? 120 + i * 280 : 260 + (i - 4) * 300, y = i < 4 ? 270 : 530;
        return <div key={l} style={{ position: "absolute", left: x, top: y, transform: `scale(${0.9 + 0.1 * on})`, filter: `drop-shadow(0 0 ${30 * on}px rgba(255,210,120,.8))`, opacity: 0.4 + 0.6 * on }}><Jar w={150} fill={0.85} col={c} lid="#6b4224" label={l} /></div>; })}
      <div style={{ position: "absolute", left: 20, top: 20, width: 630, height: 720, background: "repeating-linear-gradient(90deg,#8a5a34 0 70px,#7a4a28 70px 74px)", transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-100 * dr}deg)`, boxShadow: "inset 0 0 0 10px #4a2f1b" }} />
      <div style={{ position: "absolute", left: 650, top: 20, width: 630, height: 720, background: "repeating-linear-gradient(90deg,#8a5a34 0 70px,#7a4a28 70px 74px)", transformOrigin: "100% 50%", transform: `perspective(1600px) rotateY(${100 * dr}deg)`, boxShadow: "inset 0 0 0 10px #4a2f1b" }} />
    </div>
    <Big tt={tt} at={4.6} x={960} y={1010} txt="LOS SIETE FRASCOS" size={90} col={AMB} />
  </>;
}}</Stage>;
