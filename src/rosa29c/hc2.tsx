// rosa29c · componentes únicos 11-20. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Steam, Tape, Big, Table, Shadow } from "./rkit";
import { P, sp, pos } from "./hc1";

// 11 · «La verdolaga crecía sola entre el maíz, y mi padre decía que era maleza»: entre los surcos de maíz brotan las verdolagas, hojitas gorditas que se abren
export const Sprout: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#bfe0f2,#e8f2e0 60%)">{(tt) => {
  return <>
    {[0, 1, 2].map((r) => <div key={r} style={pos(960, 700 + r * 130, "", { width: 2100, height: 70, borderRadius: 35, background: `linear-gradient(180deg,#7a5430,#5b3a22)`, opacity: 0.9 })} />)}
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 140 + i * 230, top: 220, width: 16, height: 520, background: "#6b8a3a", borderRadius: 8 }}>
      {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: j % 2 ? 10 : -90, top: 80 + j * 120, width: 100, height: 20, borderRadius: "50% 50% 50% 50% / 100% 100% 0 0", background: "#7aa04a", transform: `rotate(${j % 2 ? -25 : 25}deg)` }} />)}
    </div>)}
    {Array.from({ length: 9 }, (_, i) => { const a = 0.5 + (i % 3) * 0.8 + Math.floor(i / 3) * 0.25, g = sp(tt, a, 5, 0.5), x = 250 + (i % 3) * 230 * 2 + Math.floor(i / 3) * 140, y = 690 + Math.floor(i / 3) * 130;
      return <div key={i} style={pos(x, y - 20, `scale(${cl(g) * 1.1})`, { width: 160, height: 90 })}>
        <div style={{ position: "absolute", left: 76, top: 30, width: 8, height: 60, background: "#b84a5a", borderRadius: 4 }} />
        {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: 60, top: 20, width: 40, height: 26, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#8ad05a,#3a8a2a)", transform: `rotate(${j * 60}deg) translateX(30px)`, boxShadow: "0 3px 4px rgba(0,0,0,.25)" }} />)}
      </div>; })}
    <Tape txt="¿MALEZA?" x={1500} y={260} s={sp(tt, 1.6)} size={56} rot={-4} />
    <Big tt={tt} at={2.8} x={960} y={130} txt="CRECÍA SOLA" size={100} col="#2a5a1a" />
  </>;
}}</Stage>;

// 12 · «Bien lavadas, en tres aguas, porque traen tierra»: tres palanganas en fila; el agua sale marrón, después turbia y al final clara
export const ThreeWash: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const W = ["#7a5a30", "#a8a070", "#bfe0f0"];
  return <>
    <Table y={860} />
    {W.map((c, i) => { const a = 0.4 + i * 1.4, q = sp(tt, a, 5, 0.5), x = 480 + i * 480, hop = eio(tt, a + 0.6, a + 1.3);
      return <React.Fragment key={i}>
        <Shadow x={x} y={860} w={420} s={cl(q)} />
        <div style={pos(x, 760, `scale(${cl(q)})`, { width: 420, height: 170, borderRadius: "0 0 210px 210px / 0 0 120px 120px", background: "linear-gradient(90deg,#8a949c,#eef2f5 40%,#9aa3aa 70%,#5b636a)", boxShadow: "0 24px 40px rgba(0,0,0,.45)" })}>
          <div style={{ position: "absolute", left: 20, top: -10, width: 380, height: 50, borderRadius: "50%", background: `radial-gradient(ellipse, ${c}, ${c}cc 70%)`, boxShadow: "inset 0 0 0 6px #c9d0d6" }} />
        </div>
        {[0, 1, 2, 3].map((j) => <div key={j} style={pos(x - 70 + j * 46 + 600 * hop * (i < 2 ? 1 : 0), 700 - 160 * Math.sin(Math.PI * hop) * (i < 2 ? 1 : 0) - 8 * Math.sin(tt * 3 + j), `rotate(${j * 40 + tt * 20}deg)`, { width: 60, height: 34, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#8ad05a,#3a8a2a)", opacity: cl(q) * (i < 2 ? 1 - eio(tt, a + 1.2, a + 1.4) : 1) })} />)}
        <Tape txt={["1ª", "2ª", "3ª"][i]} x={x} y={560} s={sp(tt, a + 0.2)} size={50} />
      </React.Fragment>; })}
    <Big tt={tt} at={4.0} x={960} y={200} txt="EN TRES AGUAS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 13 · «Los sábados, en el horno de barro del patio. Doce panes grandes, redondos, con la cruz marcada arriba»: el horno de barro con forma de colmena se llena de panes con la pala
export const MudOven: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#f2d9a8,#d8a868)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), n = Math.floor(cl((tt - 0.6) / 4.5) * 12.99), pp = ((tt - 0.6) / (4.5 / 12)) % 1;
  return <>
    <div style={pos(960, 940, "", { width: 2000, height: 240, background: "linear-gradient(180deg,#b88850,#7a5430)" })} />
    <div style={pos(1100, 600, `scale(${s})`, { width: 820, height: 600 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 600, borderRadius: "410px 410px 40px 40px / 480px 480px 40px 40px", background: "radial-gradient(ellipse at 35% 30%,#d8a070,#a86a3a 60%,#7a4a22)", boxShadow: "0 40px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 250, top: 300, width: 320, height: 300, borderRadius: "160px 160px 0 0", background: "radial-gradient(ellipse at 50% 100%, #ff9a3a, #2a0e04 80%)", overflow: "hidden" }}>
        {Array.from({ length: 12 }, (_, i) => i < n ? <div key={i} style={{ position: "absolute", left: 30 + (i % 4) * 66, top: 120 + Math.floor(i / 4) * 50, width: 60, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#f2c475,#b8742a)", boxShadow: "0 3px 4px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 26, top: 8, width: 6, height: 24, background: "#8a4a14" }} /><div style={{ position: "absolute", left: 16, top: 17, width: 26, height: 6, background: "#8a4a14" }} /></div> : null)}
      </div>
      <div style={{ position: "absolute", left: 360, top: -120, width: 100, height: 140, background: "linear-gradient(90deg,#a86a3a,#7a4a22)" }} />
    </div>
    <Steam tt={tt} x={1110} y={330} w={140} h={260} o={0.6} />
    {n < 12 && <div style={pos(420 + 380 * Math.sin(Math.PI * pp) , 820, "rotate(-4deg)", { width: 640, height: 60 })}>
      <div style={{ position: "absolute", left: 0, top: 24, width: 460, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#c79a68,#7a4a28)" }} />
      <div style={{ position: "absolute", left: 440, top: 0, width: 200, height: 60, borderRadius: 14, background: "linear-gradient(180deg,#c79a68,#7a4a28)" }} />
      <div style={{ position: "absolute", left: 480, top: -40, width: 110, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#f6dca8,#d8b070)" }} />
    </div>}
    <div style={pos(320, 280, "", { fontSize: 170, fontWeight: 900, color: AMB, textShadow: "0 8px 20px rgba(0,0,0,.4)" })}>{n}</div>
    <Big tt={tt} at={1.0} x={320} y={420} txt="PANES" size={60} col="#6b2a14" />
  </>;
}}</Stage>;

// 14 · «El del lunes era tierno, el del jueves se tostaba, y el del sábado se hacía sopa»: el mismo pan recorre la semana: blandito, tostado, y cae en un plato de sopa
export const BreadWeek: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), x = 360 + 1200 * eio(tt, 0.6, 4.6), age = eio(tt, 0.6, 4.6), dip = eio(tt, 4.4, 5.4);
  const D: [string, number][] = [["LUNES", 360], ["JUEVES", 960], ["SÁBADO", 1560]];
  return <>
    <Table y={820} />
    {D.map(([d, dx], i) => <Tape key={d} txt={d} x={dx} y={260} s={sp(tt, 0.3 + i * 1.6)} size={46} col={x > dx - 80 ? AMB : undefined} />)}
    <div style={pos(1560, 760, `scale(${s})`, { width: 440, height: 120, borderRadius: "0 0 220px 220px / 0 0 120px 120px", background: "linear-gradient(90deg,#c9d2da,#fbfdff 40%,#b9c3cc)", boxShadow: "0 24px 30px rgba(0,0,0,.45)" })}>
      <div style={{ position: "absolute", left: 20, top: -12, width: 400, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse,#d8a050,#a86a28)" }} /></div>
    <Steam tt={tt} x={1560} y={600} w={260} h={200} o={0.7} />
    <div style={pos(x, 560 + 150 * dip, `scale(${s * (1 - 0.3 * dip)}) rotate(${-8 + 30 * dip}deg)`, { width: 260, height: 180, borderRadius: "40px 40px 16px 16px",
      background: `linear-gradient(180deg, rgb(${Math.round(220 - 90 * age)},${Math.round(160 - 90 * age)},${Math.round(90 - 60 * age)}), rgb(${Math.round(250 - 60 * age)},${Math.round(225 - 70 * age)},${Math.round(180 - 70 * age)}) 25%)`, boxShadow: "0 20px 30px rgba(0,0,0,.45)" })}>
      {age > 0.45 && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 36, top: 60 + (i % 2) * 40, width: 24, height: 4, background: "rgba(80,40,10,.6)", transform: `rotate(${i * 30}deg)` }} />)}
    </div>
    {Array.from({ length: 6 }, (_, i) => { const ph = cl((tt - 1.0 - i * 0.4) / 1.4); return ph > 0 && ph < 1 ? <div key={i} style={{ position: "absolute", left: x - 100 + i * 30, top: 660 + 160 * ph, width: 10, height: 10, borderRadius: 3, background: "#c9935a", opacity: 1 - ph }} /> : null; })}
    <Big tt={tt} at={1.2} x={960} y={130} txt="UN PAN, TODA LA SEMANA" size={70} col={AMB} />
  </>;
}}</Stage>;

// 15 · «El error es el agua muy caliente: mata la levadura… Tibia, como para bañar a un bebé»: la palangana con agua tibia y el patito flotando; el codo prueba el agua
export const Duck: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), bob = 8 * Math.sin(tt * 2.2), el = eio(tt, 1.6, 2.4) * (1 - eio(tt, 3.6, 4.4));
  return <>
    <Table y={860} />
    <Shadow x={960} y={860} w={820} s={s} />
    <div style={pos(960, 740, `scale(${s})`, { width: 820, height: 260, borderRadius: "0 0 410px 410px / 0 0 220px 220px", background: "linear-gradient(90deg,#b8c4cc,#f2f6f8 40%,#a8b4bc)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" })}>
      <div style={{ position: "absolute", left: 30, top: -20, width: 760, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse,#bfe4f6,#8ac4e0 70%)", boxShadow: "inset 0 0 0 8px #e2e8ec" }} />
    </div>
    {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.4 + i * 0.25) % 1; return <div key={i} style={{ position: "absolute", left: 960 - 60 - 180 * ph, top: 690 - 50 * ph, width: 120 + 360 * ph, height: 40 + 100 * ph, borderRadius: "50%", border: `3px solid rgba(255,255,255,${0.5 * (1 - ph)})` }} />; })}
    <div style={pos(960, 660 + bob, `rotate(${3 * Math.sin(tt * 1.7)}deg) scale(${sp(tt, 0.4, 6, 0.4)})`, { width: 200, height: 160 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 190, height: 100, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: "radial-gradient(ellipse at 40% 30%,#ffe46a,#f2b630)" }} />
      <div style={{ position: "absolute", left: 110, top: 0, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#ffe46a,#f2b630)" }} />
      <div style={{ position: "absolute", left: 180, top: 44, width: 44, height: 22, borderRadius: "0 50% 50% 0", background: "#f08a1a" }} />
      <div style={{ position: "absolute", left: 160, top: 26, width: 14, height: 14, borderRadius: "50%", background: "#2b1a0c" }} />
    </div>
    <div style={pos(1300 - 160 * el, 480 + 140 * el, "rotate(-30deg)", { width: 360, height: 120, borderRadius: 60, background: "linear-gradient(180deg,#e8c4a0,#c99a74)", boxShadow: "0 16px 24px rgba(0,0,0,.35)", opacity: cl(el * 3) })} />
    <Big tt={tt} at={1.0} x={960} y={190} txt="TIBIA" size={130} col={AMB} />
  </>;
}}</Stage>;

// 16 · «Le echaba un chorrito de jugo de limón, y la leche se cortaba en grumos blancos»: el limón se exprime sobre la olla de leche y florecen los grumos
export const Curdle: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sq = eio(tt, 0.4, 1.2), cur = eio(tt, 1.4, 4.4);
  return <>
    <div style={pos(960, 640, `scale(${s})`, { width: 820, height: 820, borderRadius: "50%", background: `radial-gradient(circle, rgb(${Math.round(250 - 10 * cur)},${Math.round(250 - 6 * cur)},${Math.round(240 - 40 * cur)}) 0 60%, #c9d0d6 61% 66%, #8a949c 70%)`, boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden" })}>
      {Array.from({ length: 34 }, (_, i) => { const a = i * 2.39, d = 280 * Math.sqrt((i + 1) / 34), g = cl(cur * 1.6 - (d / 280) * 0.6); return <div key={i} style={{ position: "absolute", left: 410 + d * Math.cos(a) - 30, top: 410 + d * Math.sin(a) - 24, width: 60, height: 48, borderRadius: "44% 56% 50% 50%", background: "radial-gradient(ellipse at 40% 30%,#ffffff,#ece6d6)", boxShadow: "0 3px 5px rgba(120,110,80,.4)", transform: `scale(${g})`, opacity: g }} />; })}
    </div>
    <div style={pos(960, 230, `rotate(${-20 + 10 * sq}deg) scaleY(${1 - 0.18 * sq})`, { width: 220, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#fff7a0,#f6e04a 50%,#c8b020)", boxShadow: "0 14px 20px rgba(0,0,0,.35)" })} />
    {Array.from({ length: 6 }, (_, i) => { const ph = cl((tt - 0.5 - i * 0.12) / 0.6); return ph > 0 && ph < 1 ? <div key={i} style={{ position: "absolute", left: 950 + (i - 3) * 6, top: 300 + 280 * ph, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(250,240,140,.9)" }} /> : null; })}
    <Big tt={tt} at={2.6} x={960} y={1010} txt="SE CORTA SOLA" size={84} col={AMB} />
  </>;
}}</Stage>;

// 17 · «El error es revolver mucho después del limón: los grumos se rompen»: la cuchara gira rápido y los grumos grandes se hacen migas
export const Shatter: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sp2 = eio(tt, 0.3, 1.0) * (1 - eio(tt, 3.6, 4.2)), br = eio(tt, 0.8, 2.6), ang = tt * 380 * sp2;
  return <>
    <div style={pos(960, 600, `scale(${s})`, { width: 780, height: 780, borderRadius: "50%", background: "radial-gradient(circle,#efeadc 0 60%,#c9d0d6 61% 66%,#8a949c 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden" })}>
      {Array.from({ length: 10 }, (_, i) => { const a = i * 0.63 + ang / 300, d = 120 + (i % 3) * 70; return <div key={i} style={{ position: "absolute", left: 390 + d * Math.cos(a) - 50, top: 390 + d * Math.sin(a) - 40, width: 100, height: 80, borderRadius: "46% 54% 50% 50%", background: "radial-gradient(ellipse at 40% 30%,#ffffff,#ece6d6)", opacity: 1 - br, transform: `scale(${1 - 0.5 * br})` }} />; })}
      {Array.from({ length: 90 }, (_, i) => { const a = i * 2.39 + ang / 200, d = 40 + (i * 37) % 260; return <div key={i} style={{ position: "absolute", left: 390 + d * Math.cos(a), top: 390 + d * Math.sin(a), width: 12, height: 10, borderRadius: 3, background: "#f6f2e8", opacity: br }} />; })}
      <div style={{ position: "absolute", left: 370, top: 390, width: 40, height: 340, borderRadius: 20, background: "linear-gradient(90deg,#8a5a34,#c79a68,#7a4a28)", transformOrigin: "50% 0", transform: `rotate(${ang}deg)` }} />
    </div>
    <Tape txt="UNA SOLA VEZ" x={1550} y={300} s={sp(tt, 3.2)} size={50} rot={3} />
    <Big tt={tt} at={1.6} x={960} y={1010} txt="SE ROMPEN" size={100} col={AMB} />
  </>;
}}</Stage>;

// 18 · «La polenta se servía en la tabla de madera… siete hermanos alrededor de una tabla»: vista de arriba: la tabla con la polenta y la salsa, y siete tenedores llegan desde los bordes
export const Forks7: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sauce = eio(tt, 0.3, 1.2);
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 1100, height: 700, borderRadius: 40, background: "repeating-linear-gradient(90deg,#a8763e 0 90px,#9a6a34 90px 94px)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 14px #7a5030" })}>
      <div style={{ position: "absolute", left: 150, top: 110, width: 800, height: 480, borderRadius: "48% 52% 50% 50%", background: "radial-gradient(ellipse at 40% 35%,#ffe27a,#f2c040 70%)" }} />
      <div style={{ position: "absolute", left: 550 - 330 * sauce, top: 350 - 190 * sauce, width: 660 * sauce, height: 380 * sauce, borderRadius: "46% 54% 52% 48%", background: "radial-gradient(ellipse at 40% 35%,#e2463a,#b8281c 70%)" }} />
    </div>
    {Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7, q = sp(tt, 1.0 + i * 0.25, 6, 0.45), r = 720 - 300 * cl(q), x = 960 + r * Math.cos(a) * 1.15, y = 560 + r * Math.sin(a) * 0.75;
      return <div key={i} style={pos(x, y, `rotate(${(a * 180) / Math.PI + 90}deg)`, { width: 70, height: 360 })}>
        {[0, 1, 2, 3].map((j) => <div key={j} style={{ position: "absolute", left: 6 + j * 16, top: 0, width: 8, height: 90, borderRadius: "4px 4px 0 0", background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />)}
        <div style={{ position: "absolute", left: 0, top: 86, width: 70, height: 40, borderRadius: "0 0 30px 30px", background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />
        <div style={{ position: "absolute", left: 24, top: 120, width: 22, height: 240, borderRadius: 11, background: "linear-gradient(90deg,#8a949c,#dfe6ec,#6b747c)" }} />
      </div>; })}
    <Big tt={tt} at={3.0} x={960} y={1000} txt="SIETE HERMANOS, UNA TABLA" size={66} col={AMB} />
  </>;
}}</Stage>;

// 19 · «El error es echar la harina de golpe… En lluvia, y batiendo»: la harina de maíz cae como lluvia fina en el agua que gira con el batidor
export const Rain: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), th = eio(tt, 0.5, 4.5);
  return <>
    <div style={pos(960, 680, `scale(${s})`, { width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, rgb(${Math.round(200 + 50 * th)},${Math.round(220 + 0 * th)},${Math.round(230 - 150 * th)}) 0 60%, #8a949c 64%, #3a3a3a 70%)`, boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden" })}>
      <svg width={760} height={760} style={{ position: "absolute", left: 0, top: 0 }}>
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={380} cy={380} r={60 + i * 60} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={6} strokeDasharray="40 30" strokeDashoffset={-tt * (80 + i * 30)} />)}
      </svg>
      <div style={{ position: "absolute", left: 380, top: 380, width: 30, height: 300, transformOrigin: "50% 0", transform: `rotate(${tt * 300}deg)` }}>
        {[-1, 0, 1].map((k) => <div key={k} style={{ position: "absolute", left: k * 18, top: 60, width: 30, height: 220, borderRadius: "50%", border: "5px solid #c9d0d6" }} />)}
      </div>
    </div>
    <div style={pos(960, 170, `scale(${s})`, { width: 300, height: 150, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 40% 30%,#f2d27a,#d8a838)", boxShadow: "0 14px 20px rgba(0,0,0,.35)" })} />
    {Array.from({ length: 60 }, (_, i) => { const ph = (tt * 1.4 + i * 0.137) % 1; return tt > 0.4 ? <div key={i} style={{ position: "absolute", left: 900 + (i * 23) % 120, top: 240 + 300 * ph, width: 5, height: 9, borderRadius: 2, background: "#f2d27a", opacity: 0.9 * (1 - eio(tt, 4.6, 5.4)) }} /> : null; })}
    <Big tt={tt} at={1.4} x={1500} y={300} txt="EN LLUVIA" size={90} col={AMB} />
  </>;
}}</Stage>;

// 20 · «La gallina que dejaba de poner huevos no se tiraba… Se hacía caldo»: el nido da tres huevos, después ninguno; la gallina camina hasta la olla de barro que humea
export const HenRetire: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#f2d9a8,#c99a64)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), walk = eio(tt, 2.4, 4.6), x = 560 + 700 * walk, b = walk > 0 && walk < 1 ? Math.abs(Math.sin(tt * 8)) * 8 : 0;
  return <>
    <div style={pos(960, 940, "", { width: 2000, height: 240, background: "linear-gradient(180deg,#a87848,#7a5430)" })} />
    <div style={pos(520, 760, `scale(${s})`, { width: 360, height: 140, borderRadius: "50%", background: "repeating-linear-gradient(30deg,#c9a35a 0 8px,#a8823a 8px 14px)", boxShadow: "0 16px 24px rgba(0,0,0,.4)" })} />
    {[0, 1, 2].map((i) => { const on = tt > 0.4 + i * 0.4 && tt < 1.9 - i * 0.25; return <div key={i} style={pos(440 + i * 80, 720, `scale(${on ? 1 : 0})`, { width: 70, height: 86, borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%", background: "radial-gradient(circle at 35% 30%,#fbf3e4,#e0c9a0 70%)", transition: "none" })} />; })}
    <div style={pos(1400, 730, `scale(${s})`, { width: 380, height: 300 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 380, height: 240, borderRadius: "40px 40px 180px 180px", background: "radial-gradient(ellipse at 40% 30%,#c47040,#7a3b1f)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 20, top: 40, width: 340, height: 50, borderRadius: "50%", background: "#5a2a10" }} />
    </div>
    <Steam tt={tt} x={1400} y={620} w={260} h={240} o={0.7} />
    <div style={pos(x, 600 - b, `scale(${s * (walk > 0.95 ? 1 - eio(tt, 4.6, 5.2) : 1)})`, { width: 220, height: 220 })}>
      <div style={{ position: "absolute", left: 20, top: 60, width: 170, height: 130, borderRadius: "60% 40% 50% 50%", background: "radial-gradient(ellipse at 40% 30%,#c9824a,#8a4a20)" }} />
      <div style={{ position: "absolute", left: 140, top: 10, width: 70, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#c9824a,#8a4a20)" }} />
      <div style={{ position: "absolute", left: 160, top: -14, width: 34, height: 30, borderRadius: "50% 50% 30% 30%", background: "#d8282c" }} />
      <div style={{ position: "absolute", left: 200, top: 40, width: 24, height: 14, background: "#f2b630", clipPath: "polygon(0 0,100% 50%,0 100%)" }} />
      <div style={{ position: "absolute", left: 180, top: 34, width: 10, height: 10, borderRadius: "50%", background: "#1a0e04" }} />
      {[70, 120].map((lx, i) => <div key={lx} style={{ position: "absolute", left: lx, top: 180, width: 8, height: 40, background: "#f2b630", transform: `rotate(${walk > 0 && walk < 1 ? 20 * Math.sin(tt * 8 + i * 3) : 0}deg)`, transformOrigin: "50% 0" }} />)}
    </div>
    <Tape txt="SIN HUEVOS" x={520} y={520} s={sp(tt, 1.9)} size={44} rot={-3} />
    <Big tt={tt} at={3.4} x={1200} y={200} txt="EL MEJOR CALDO" size={90} col="#6b2a14" />
  </>;
}}</Stage>;
