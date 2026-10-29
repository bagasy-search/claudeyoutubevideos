// rosa29c · componentes únicos 21-30. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Steam, Tape, Big, Table, Shadow } from "./rkit";
import { P, sp, pos } from "./hc1";

// 21 · «Un caldo que te da seis platos… Lo congelas en porciones»: el cucharón llena seis tazas y una escarcha blanca las cubre una por una
export const Freeze6: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #2a3a4a, #0b0e12 75%)">{(tt) => (
  <>
    <div style={pos(960, 860, "", { width: 1600, height: 30, borderRadius: 10, background: "linear-gradient(180deg,#dfe6ec,#8a949c)", boxShadow: "0 16px 30px rgba(0,0,0,.6)" })} />
    {Array.from({ length: 6 }, (_, i) => { const a = 0.3 + i * 0.4, q = sp(tt, a, 6, 0.45), fz = eio(tt, 2.4 + i * 0.25, 3.2 + i * 0.25), x = 460 + i * 200;
      return <div key={i} style={pos(x, 760 - 300 * (1 - cl(q)), "", { width: 170, height: 170, opacity: cl(q * 3) })}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 170, height: 170, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,#dfe6ec,#fff 40%,#c9d2da)" }} />
        <div style={{ position: "absolute", left: 14, top: 26, width: 142, height: 136, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: `linear-gradient(180deg, rgb(${Math.round(232 + 18 * fz)},${Math.round(176 + 70 * fz)},${Math.round(80 + 170 * fz)}), rgb(${Math.round(200 + 40 * fz)},${Math.round(140 + 90 * fz)},${Math.round(50 + 180 * fz)}))` }} />
        {Array.from({ length: 10 }, (_, j) => <div key={j} style={{ position: "absolute", left: 10 + (j * 37) % 150, top: (j * 53) % 160, width: 12, height: 12, background: "#e8f4ff", transform: "rotate(45deg)", opacity: fz * 0.9 }} />)}
      </div>; })}
    <Big tt={tt} at={1.2} x={960} y={200} txt="SEIS PORCIONES" size={96} col={AMB} />
    <Tape txt="AL CONGELADOR" x={960} y={330} s={sp(tt, 2.6)} size={44} />
  </>
)}</Stage>;

// 22 · «El repollo era la verdura del invierno. Aguantaba la helada en la huerta cuando todo lo demás se moría»: cae la helada, las plantas se marchitan y el repollo queda firme
export const Survivor: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#9ab4c8,#d8e4ec)">{(tt) => {
  const fr = eio(tt, 0.4, 3.0), wilt = eio(tt, 1.2, 3.4), win = eio(tt, 3.0, 3.8);
  return <>
    <div style={pos(960, 920, "", { width: 2000, height: 320, background: `linear-gradient(180deg, rgb(${Math.round(110 + 130 * fr)},${Math.round(80 + 160 * fr)},${Math.round(50 + 200 * fr)}), #5b3a22)` })} />
    {[300, 560, 1360, 1620].map((x, i) => <div key={x} style={{ position: "absolute", left: x - 70, top: 520, width: 140, height: 260, transformOrigin: "50% 100%", transform: `rotate(${(i % 2 ? 1 : -1) * 60 * wilt}deg) scaleY(${1 - 0.4 * wilt})` }}>
      <div style={{ position: "absolute", left: 64, top: 40, width: 12, height: 220, background: `rgb(${Math.round(70 + 80 * wilt)},${Math.round(140 - 40 * wilt)},${Math.round(50)})` }} />
      {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: j % 2 ? 70 : -10, top: 40 + j * 60, width: 80, height: 34, borderRadius: "50%", background: `rgb(${Math.round(80 + 90 * wilt)},${Math.round(160 - 60 * wilt)},60)` }} />)}
      <div style={{ position: "absolute", left: 40, top: 0, width: 60, height: 60, borderRadius: "50%", background: `rgb(${Math.round(220 - 60 * wilt)},${Math.round(60 + 30 * wilt)},${Math.round(40 + 40 * wilt)})`, opacity: i % 2 ? 0 : 1 }} />
    </div>)}
    <div style={pos(960, 700, `scale(${sp(tt, 0.1, 4.5, 0.6) * (1 + 0.08 * win)})`, { width: 380, height: 320 })}>
      {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: 190 - 150 + 40 * Math.cos(j * 0.7), top: 40 + (j % 3) * 30, width: 300 - j * 22, height: 240 - j * 18, borderRadius: "50%", background: `radial-gradient(ellipse at 40% 30%, ${j % 2 ? "#b8e08a" : "#8ac05a"}, #4a8a2a 80%)`, border: "3px solid rgba(255,255,255,.25)", transform: `translate(${j * 11}px, ${j * 9}px)` }} />)}
    </div>
    {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 211 + 30 * Math.sin(tt * 0.6 + i)) % 1920, top: ((i * 97) % 900 + tt * (50 + (i % 5) * 14)) % 900, width: 7, height: 7, borderRadius: "50%", background: "#fff", opacity: 0.7 * fr }} />)}
    <Big tt={tt} at={3.2} x={960} y={190} txt="AGUANTA LA HELADA" size={90} col="#1d4e8f" />
  </>;
}}</Stage>;

// 23 · «El error es echar el pimentón con el fuego fuerte… Siempre fuera del fuego»: la olla sale de la hornalla, cae el pimentón y vuelve al fuego
export const OffHeat: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), off = eio(tt, 0.3, 0.9) * (1 - eio(tt, 2.6, 3.2)), pap = eio(tt, 1.2, 2.2), x = 960 + 420 * off;
  return <>
    <div style={pos(960, 840, `scale(${s})`, { width: 420, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,#1a1a1a,#3a3a3a 60%,#111)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" })} />
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 790 + i * 30, top: 800 - 30 * (1 - off) - 6 * Math.sin(tt * 2 + i), width: 20, height: 40 * (1 - off) + 8, borderRadius: "50% 50% 30% 30%", background: "radial-gradient(ellipse at 50% 80%, #bfe0ff, #2f7fd8 60%, transparent 70%)", opacity: 1 - 0.8 * off }} />)}
    <div style={pos(x, 700, `scale(${s})`, { width: 520, height: 230 })}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 520, height: 200, borderRadius: "10px 10px 60px 60px", background: "linear-gradient(90deg,#8a949c,#eef2f5 40%,#5b636a)", boxShadow: "0 24px 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 20, top: 10, width: 480, height: 50, borderRadius: "50%", background: `radial-gradient(ellipse, rgb(${Math.round(240 - 40 * pap)},${Math.round(210 - 130 * pap)},${Math.round(150 - 110 * pap)}), #6b4422 75%)` }} />
      <div style={{ position: "absolute", left: 500, top: 70, width: 160, height: 26, borderRadius: 13, background: "#1a1a1a" }} />
    </div>
    <div style={pos(x - 40, 380, `rotate(${-30 * pap}deg) scale(${s})`, { width: 120, height: 160, borderRadius: 12, background: "linear-gradient(180deg,#d8282c,#a01818)", boxShadow: "0 14px 20px rgba(0,0,0,.35)", opacity: 1 - eio(tt, 2.4, 2.8) })} />
    {Array.from({ length: 40 }, (_, i) => { const ph = cl((tt - 1.2 - (i % 10) * 0.08) / 0.8); return ph > 0 && ph < 1 ? <div key={i} style={{ position: "absolute", left: x - 70 + (i * 17) % 80, top: 460 + 240 * ph, width: 8, height: 8, borderRadius: 2, background: "#c8281c" }} /> : null; })}
    <Big tt={tt} at={1.0} x={760} y={180} txt="FUERA DEL FUEGO" size={90} col={AMB} />
  </>;
}}</Stage>;

// 24 · «La tortilla de papa se hacía gorda, de tres dedos de alto»: la tortilla cortada de canto y tres dedos que se apilan a su lado y miden la altura
export const Fingers3: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  return <>
    <Table y={820} />
    <Shadow x={820} y={820} w={760} s={s} />
    <div style={pos(820, 690, `scale(${s})`, { width: 760, height: 260, borderRadius: "130px 30px 30px 130px / 130px 20px 20px 130px", background: "linear-gradient(180deg,#c98a3a,#f2d080 12%,#f6e0a0 50%,#e8c070 88%,#b8742a)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })}>
      {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + (i * 47) % 640, top: 40 + (i * 31) % 180, width: 40 + (i % 3) * 14, height: 12, borderRadius: 6, background: "#f2e2b0", border: "2px solid #d8b870" }} />)}
    </div>
    {[0, 1, 2].map((i) => { const q = sp(tt, 0.7 + i * 0.6, 6, 0.45); return <div key={i} style={pos(1340 + 300 * (1 - cl(q)), 780 - i * 86, "", { width: 300, height: 82, borderRadius: "40px 50px 50px 40px", background: "linear-gradient(180deg,#f0cca8,#d8a47c)", boxShadow: "0 8px 12px rgba(0,0,0,.3)", opacity: cl(q * 3) })}>
      <div style={{ position: "absolute", left: 220, top: 14, width: 66, height: 54, borderRadius: "20px 30px 30px 20px", background: "#f8e2d0", border: "2px solid #d8a47c" }} /></div>; })}
    <svg width={80} height={300} style={{ position: "absolute", left: 1520, top: 540, opacity: cl((tt - 2.4) * 2) }}><path d="M 40 10 L 40 290 M 20 10 L 60 10 M 20 290 L 60 290" stroke={AMB} strokeWidth={8} strokeLinecap="round" /></svg>
    <Big tt={tt} at={2.6} x={960} y={190} txt="TRES DEDOS DE ALTO" size={90} col={AMB} />
  </>;
}}</Stage>;

// 25 · «Y esa olla duraba tres días, y cada día era una comida distinta»: la misma olla de frijoles sirve tres platos que cambian: frijoles, sopa, tacos
export const Pot3Days: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lvl = 1 - 0.7 * eio(tt, 0.4, 4.4);
  const DD: [string, string][] = [["DÍA 1", "beans"], ["DÍA 2", "soup"], ["DÍA 3", "taco"]];
  return <>
    <Table y={860} />
    <div style={pos(420, 650, `scale(${s})`, { width: 420, height: 360 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 420, height: 300, borderRadius: "40px 40px 200px 200px", background: "radial-gradient(ellipse at 40% 30%,#c47040,#7a3b1f)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 20, top: 40 + 80 * (1 - lvl), width: 380, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse, #6a2a14, #3a140a 75%)" }} />
    </div>
    <Steam tt={tt} x={420} y={560} w={260} h={200} o={0.6} />
    {DD.map(([d, k], i) => { const a = 0.4 + i * 1.6, q = sp(tt, a, 5.5, 0.45), x = 900 + i * 360;
      return <React.Fragment key={d}>
        <div style={pos(x, 780, `scale(${cl(q)})`, { width: 300, height: 90, borderRadius: "0 0 150px 150px / 0 0 90px 90px", background: "linear-gradient(90deg,#c47040,#e8a070 40%,#a85a30)", boxShadow: "0 20px 30px rgba(0,0,0,.45)" })}>
          {k === "beans" && <div style={{ position: "absolute", left: 20, top: -14, width: 260, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 30% 40%, #5a1e10 0 8px, transparent 9px) 0 0/22px 18px, #7a2a18" }} />}
          {k === "soup" && <div style={{ position: "absolute", left: 20, top: -14, width: 260, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse,#9a4a2a,#6a2a14)" }} />}
          {k === "taco" && <div style={{ position: "absolute", left: 50, top: -60, width: 200, height: 90, borderRadius: "100px 100px 10px 10px", background: "linear-gradient(180deg,#f2d080,#d8a840)", boxShadow: "inset 0 -20px 0 #6a2a14" }} />}
        </div>
        <Tape txt={d} x={x} y={600} s={sp(tt, a + 0.3)} size={40} rot={(i - 1) * 3} />
      </React.Fragment>; })}
    <Big tt={tt} at={1.2} x={1260} y={200} txt="UNA OLLA, TRES COMIDAS" size={72} col={AMB} />
  </>;
}}</Stage>;

// 26 · «El error es la sal al principio: el frijol se pone duro… La sal, al final»: los ingredientes entran a la olla en fila; el salero espera último y entra al final
export const SaltLast: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), run = eio(tt, 0.3, 4.6);
  const IT: [string, number, number, string][] = [["#5a1e10", 120, 80, "50%"], ["#f2ece0", 100, 100, "50%"], ["#f6f0e2", 70, 90, "40%"], ["#3a8a2a", 90, 40, "50% 0"], ["#d8a070", 140, 50, "20px"]];
  return <>
    <Table y={860} />
    <div style={pos(1560, 700, `scale(${s})`, { width: 420, height: 320 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 420, height: 260, borderRadius: "40px 40px 200px 200px", background: "radial-gradient(ellipse at 40% 30%,#c47040,#7a3b1f)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 20, top: 40, width: 380, height: 50, borderRadius: "50%", background: "#3a140a" }} />
    </div>
    {IT.map(([c, w, hh, br], i) => { const p = cl(run * 6 - i), x = 260 + i * 170 + (1560 - 260 - i * 170) * eio(p, 0, 1), y = 760 - 260 * Math.sin(Math.PI * eio(p, 0, 1));
      return <div key={i} style={pos(x, y, `scale(${1 - 0.6 * eio(p, 0.85, 1)})`, { width: w, height: hh, borderRadius: br, background: c, boxShadow: "0 10px 14px rgba(0,0,0,.35)", opacity: 1 - eio(p, 0.9, 1) })} />; })}
    {(() => { const p = cl(run * 6 - 5), x = 1110 + 450 * eio(p, 0, 1), y = 740 - 280 * Math.sin(Math.PI * eio(p, 0, 1));
      return <div style={pos(x, y, `rotate(${-120 * eio(p, 0.6, 1)}deg)`, { width: 90, height: 150, opacity: 1 - eio(p, 0.95, 1) })}>
        <div style={{ position: "absolute", left: 0, top: 40, width: 90, height: 110, borderRadius: "16px 16px 22px 22px", background: "linear-gradient(90deg,#dfe6ec,#fff 40%,#c9d2da)", boxShadow: "0 10px 14px rgba(0,0,0,.35)" }} />
        <div style={{ position: "absolute", left: 6, top: 0, width: 78, height: 50, borderRadius: "40px 40px 6px 6px", background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />
      </div>; })()}
    <Tape txt="ÚLTIMA" x={1110} y={560} s={sp(tt, 0.8) * (1 - eio(tt, 3.6, 4.0))} size={40} col="#b33a2c" />
    <Big tt={tt} at={3.8} x={960} y={190} txt="LA SAL, AL FINAL" size={100} col={AMB} />
  </>;
}}</Stage>;

// 27 · «Mi madre las rallaba en el rallador de lata. Quedaba una pasta dulce, amarilla, lechosa»: la mazorca sube y baja por el rallador y cae la pasta amarilla al plato
export const Grater: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), stroke = Math.sin(tt * 4.2) * (tt > 0.4 && tt < 5.5 ? 1 : 0), pile = eio(tt, 0.6, 5.4), len = 1 - 0.45 * eio(tt, 0.4, 5.6);
  return <>
    <Table y={880} />
    <div style={pos(960, 820, `scale(${s})`, { width: 520, height: 110, borderRadius: "0 0 260px 260px / 0 0 110px 110px", background: "linear-gradient(90deg,#c9d2da,#fbfdff 40%,#b9c3cc)", boxShadow: "0 24px 30px rgba(0,0,0,.45)" })}>
      <div style={{ position: "absolute", left: 260 - 200 * pile, top: -10 - 60 * pile, width: 400 * pile, height: 20 + 80 * pile, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 40% 30%,#fff2b0,#f2d060 70%)" }} />
    </div>
    <div style={pos(960, 480, `scale(${s}) rotate(-12deg)`, { width: 300, height: 560, clipPath: "polygon(12% 0,88% 0,100% 100%,0 100%)", background: "radial-gradient(circle, #3a3a3a 0 4px, transparent 5px) 0 0/30px 30px, linear-gradient(90deg,#8a949c,#eef2f5 40%,#9aa3aa 70%,#5b636a)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" })} />
    <div style={pos(1000 + 20 * stroke, 440 + 110 * stroke, `rotate(-12deg) scale(${s})`, { width: 150, height: 380 * len, borderRadius: 75, background: "radial-gradient(circle at 30% 30%, #ffe27a 0 7px, transparent 8px) 0 0/28px 28px, linear-gradient(90deg,#e8b830,#ffd860 50%,#d8a020)", boxShadow: "0 16px 24px rgba(0,0,0,.4)" })} />
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 1.2 + i * 0.0625) % 1; return tt > 0.5 ? <div key={i} style={{ position: "absolute", left: 900 + (i * 13) % 120, top: 700 + 90 * ph, width: 10, height: 10, borderRadius: "50%", background: "#f6e08a", opacity: 1 - ph }} /> : null; })}
    <Big tt={tt} at={2.0} x={960} y={150} txt="PASTA DE ELOTE" size={90} col={AMB} />
  </>;
}}</Stage>;

// 28 · «Mi abuelo, que cuidaba ovejas, la hacía en el monte, en una sartén colgada sobre el fuego»: de noche en el monte, la sartén se mece colgada de la cadena sobre la fogata; ovejas a lo lejos
export const Shepherd: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#0d1424,#2a2a3a 60%,#3a2a20)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sw = 5 * Math.sin(tt * 1.2);
  return <>
    <svg width={1920} height={400} style={{ position: "absolute", left: 0, top: 560 }}><path d="M 0 200 Q 400 40 800 160 T 1920 120 L 1920 400 L 0 400 Z" fill="#1a1e24" /><path d="M 0 300 Q 600 180 1200 260 T 1920 240 L 1920 400 L 0 400 Z" fill="#2a2018" /></svg>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 1360 + i * 110 + 6 * Math.sin(tt * 0.6 + i), top: 690 + (i % 2) * 20, width: 80, height: 46, borderRadius: "50%", background: "#d8d2c4", boxShadow: "inset -10px -6px 0 rgba(0,0,0,.2)" }}><div style={{ position: "absolute", left: -16, top: 6, width: 26, height: 22, borderRadius: "50%", background: "#3a3530" }} /></div>)}
    {[[760, 1], [1160, -1]].map(([x, d]) => <div key={x} style={{ position: "absolute", left: x, top: 420, width: 16, height: 420, background: "#4a2f1b", transform: `rotate(${d * 14}deg)`, transformOrigin: "50% 100%" }} />)}
    <div style={pos(960, 380, "", { width: 520, height: 14, borderRadius: 7, background: "#4a2f1b" })} />
    <div style={{ position: "absolute", left: 960 - 200, top: 380, width: 400, height: 300, transformOrigin: "50% 0", transform: `rotate(${sw}deg) scale(${s})` }}>
      <svg width={400} height={200} style={{ position: "absolute", top: 0 }}><path d="M 200 0 L 70 180 M 200 0 L 330 180" stroke="#8a8580" strokeWidth={5} strokeDasharray="10 6" /></svg>
      <div style={{ position: "absolute", left: 40, top: 170, width: 320, height: 70, borderRadius: "0 0 160px 160px / 0 0 70px 70px", background: "linear-gradient(180deg,#2a2a2a,#0d0d0d)" }}>
        <div style={{ position: "absolute", left: 20, top: -10, width: 280, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse,#f2d29a,#c99a5a)" }} /></div>
    </div>
    <Steam tt={tt} x={960 + sw * 4} y={520} w={220} h={200} o={0.5} />
    {Array.from({ length: 7 }, (_, i) => { const f = 1 + 0.12 * Math.sin(tt * 2 * Math.PI * 1.3 + i); return <div key={i} style={pos(880 + i * 26, 780, `scale(${f})`, { width: 70, height: 140, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 80%,#fff2a0,#ff9a2a 50%,rgba(255,80,20,.6) 70%,transparent 72%)", transformOrigin: "50% 100%" })} />; })}
    <div style={pos(960, 780, "", { width: 460, height: 160, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,150,60,.35), transparent 70%)" })} />
    <Big tt={tt} at={2.2} x={960} y={150} txt="LA COMIDA DE LOS PASTORES" size={68} col={AMB} />
  </>;
}}</Stage>;

// 29 · «Era un trabajo de todas las mujeres de la familia… armando cien tamales»: los tamales se apilan en una pirámide y el número sube hasta cien
export const TamalStack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.round(100 * eio(tt, 0.3, 4.6)), rows = [8, 7, 6, 5, 4, 3, 2, 1];
  let k = 0;
  return <>
    <Table y={880} />
    {rows.map((cnt, r) => Array.from({ length: cnt }, (_, c) => { const idx = k++, f = cl(n / 100 * 36 - idx); return f > 0 ? <div key={`${r}-${c}`} style={pos(960 - (cnt - 1) * 70 + c * 140, 820 - r * 76 - 80 * (1 - f), `rotate(${(idx % 3 - 1) * 4}deg)`, { width: 130, height: 70, borderRadius: "30px 30px 14px 14px",
      background: "repeating-linear-gradient(90deg,#e8d8a0 0 10px,#d8c488 10px 14px)", boxShadow: "0 8px 12px rgba(0,0,0,.35)", opacity: f })}>
      <div style={{ position: "absolute", left: 56, top: 0, width: 18, height: 70, background: "#c9b070" }} /></div> : null; }))}
    <div style={pos(1620, 460, "", { fontSize: 200, fontWeight: 900, color: AMB, textShadow: "0 8px 24px rgba(0,0,0,.5)" })}>{n}</div>
    <Big tt={tt} at={1.0} x={1620} y={620} txt="TAMALES" size={60} />
  </>;
}}</Stage>;

// 30 · «El error es dejar que la olla se quede sin agua. Revisa cada veinte minutos»: en corte, la olla al vapor; el agua del fondo baja, la tapa se levanta y entra agua nueva
export const WaterLine: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lv = 1 - 0.8 * eio(tt, 0.3, 2.0) + 0.8 * eio(tt, 2.6, 3.6), lid = eio(tt, 1.8, 2.3) * (1 - eio(tt, 3.8, 4.3));
  return <>
    <div style={pos(960, 600, `scale(${s})`, { width: 640, height: 640 })}>
      <div style={{ position: "absolute", left: 0, top: 80, width: 640, height: 560, borderRadius: "20px 20px 60px 60px", background: "linear-gradient(90deg,#5b636a,#c9d0d6 40%,#3a4048)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 20, top: 20, width: 600, height: 520, borderRadius: "10px 10px 50px 50px", background: "#1a1e24" }} />
        <div style={{ position: "absolute", left: 20, top: 540 - 120 * lv, width: 600, height: 120 * lv, background: "linear-gradient(180deg,#8ac4e0,#4a8ab0)" }} />
        <div style={{ position: "absolute", left: 60, top: 380, width: 520, height: 12, background: "repeating-linear-gradient(90deg,#9aa3aa 0 20px,transparent 20px 30px)" }} />
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + i * 84, top: 150, width: 64, height: 230, borderRadius: "30px 30px 10px 10px", background: "repeating-linear-gradient(90deg,#e8d8a0 0 8px,#d8c488 8px 12px)" }} />)}
      </div>
      <div style={{ position: "absolute", left: -20, top: 40 - 160 * lid, width: 680, height: 60, borderRadius: "50% 50% 10px 10px / 100% 100% 10px 10px", background: "linear-gradient(180deg,#c9d0d6,#5b636a)", transform: `rotate(${-10 * lid}deg)` }} />
    </div>
    <Steam tt={tt} x={960} y={360} w={300} h={200} o={0.4 + 0.5 * lid} />
    {lid > 0.5 && <div style={pos(1180, 330, "rotate(-30deg)", { width: 160, height: 120, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#8a949c,#eef2f5,#5b636a)" })} />}
    {lid > 0.5 && Array.from({ length: 6 }, (_, i) => { const ph = (tt * 1.5 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 1120 - 40 * ph, top: 360 + 300 * ph, width: 14, height: 22, borderRadius: "50%", background: "#8ac4e0", opacity: 1 - ph }} />; })}
    <Tape txt="CADA 20 MIN" x={1550} y={300} s={sp(tt, 1.0)} size={50} rot={3} />
  </>;
}}</Stage>;
