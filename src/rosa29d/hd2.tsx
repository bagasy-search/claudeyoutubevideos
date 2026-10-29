// rosa29d · componentes únicos 11-20. Todo en código, ninguna familia de rosa29a, b ni c.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Big, Table, Shadow, Steam } from "./rkit";
import { P, sp, pos, TIN } from "./hd1";

// 11 · «La panela… en bloque, de color café. Mi madre la raspaba con un cuchillo»: el cuchillo raspa el bloque y caen virutas doradas que se apilan
export const Shave: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), k = (tt - 0.4) * 2.2, pile = eio(tt, 0.6, 4.0);
  return <>
    <Table y={840} />
    <Shadow x={860} y={840} w={520} s={s} />
    <div style={pos(860, 640, `scale(${s}) perspective(900px) rotateX(18deg)`, { width: 420, height: 260, borderRadius: 18, background: "radial-gradient(circle at 30% 30%, rgba(255,210,120,.35) 0 3px, transparent 4px) 0 0/22px 22px, linear-gradient(160deg,#c8823a,#8a4e1c 60%,#6a3410)", boxShadow: "inset 0 -20px 0 rgba(0,0,0,.2)" })} />
    <div style={pos(1100, 560 + 60 * Math.sin(k * Math.PI), `rotate(${-28 + 8 * Math.sin(k * Math.PI)}deg)`, { width: 420, height: 60, opacity: cl(tt * 3) })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 60, borderRadius: "4px 40px 0 4px", background: "linear-gradient(180deg,#f2f5f7,#9aa3aa)" }} />
      <div style={{ position: "absolute", left: 300, top: 8, width: 140, height: 44, borderRadius: 10, background: "linear-gradient(180deg,#6b4224,#3a2414)" }} />
    </div>
    {Array.from({ length: 22 }, (_, i) => { const st = 0.5 + i * 0.16, f = cl((tt - st) * 1.6); if (f <= 0) return null;
      return <div key={i} style={{ position: "absolute", left: 1000 + (i * 29) % 140, top: 640 + 160 * Math.min(1, f) - (i % 5) * 6 * pile, width: 30, height: 14, borderRadius: "60% 40% 60% 40%", background: "linear-gradient(90deg,#e8a858,#b8702a)", transform: `rotate(${i * 47 + 200 * (1 - f)}deg)` }} />; })}
    <Big tt={tt} at={2.0} x={960} y={190} txt="RASPADA CON CUCHILLO" size={84} col={AMB} />
  </>;
}}</Stage>;

// 12 · «Agua fría hasta llenar la jarra. Mucho hielo»: los cubos de hielo caen a la jarra, el agua salpica y el vidrio se empaña de gotitas
export const IceJug: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#f6e6c4,#e0b878)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), fog = eio(tt, 2.0, 3.6);
  return <>
    <Table y={860} />
    <Shadow x={960} y={860} w={420} s={s} />
    <div style={pos(960, 600, `scale(${s})`, { width: 360, height: 520 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 520, borderRadius: "30px 30px 60px 60px", background: "rgba(255,255,255,.22)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.7), 0 20px 30px rgba(0,0,0,.25)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 360, height: 400, background: "linear-gradient(180deg,rgba(214,150,60,.7),rgba(170,100,30,.85))" }} />
        {[0, 1, 2, 3].map((i) => { const q = cl(sp(tt, 0.3 + i * 0.45, 6, 0.4)); return <div key={i} style={{ position: "absolute", left: 50 + (i % 2) * 150 + i * 10, top: -120 + (230 + (i % 2) * 50) * q, width: 110, height: 100, borderRadius: 16, background: "linear-gradient(135deg,rgba(255,255,255,.95),rgba(200,230,250,.6))", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.9)", transform: `rotate(${i * 17}deg)` }} />; })}
        {[0.4, 0.4, 0.85, 1.3, 1.75].map((a, i) => { const f = cl((tt - a - 0.15) * 3); return f > 0 && f < 1 ? <div key={i} style={{ position: "absolute", left: 120 + i * 30, top: 110 - 80 * Math.sin(f * Math.PI), width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,.8)" }} /> : null; })}
        {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 53) % 340, top: 140 + (i * 97) % 360, width: 6 + (i % 3) * 2, height: 8 + (i % 3) * 3, borderRadius: "50%", background: "rgba(255,255,255,.75)", opacity: fog }} />)}
      </div>
      <div style={{ position: "absolute", left: 340, top: 120, width: 90, height: 240, borderRadius: "0 80px 80px 0", border: "14px solid rgba(255,255,255,.6)", borderLeft: "none" }} />
    </div>
    <Big tt={tt} at={1.8} x={960} y={160} txt="MUCHO HIELO" size={100} col="#6b2a14" />
  </>;
}}</Stage>;

// 13 · «Una tortilla de maíz recién hecha, caliente, enrollada, con sal»: la tortilla con sus manchitas del comal se enrolla sola como un pergamino y le cae la sal
export const RollUp: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), r = eio(tt, 0.8, 2.6), salt = eio(tt, 2.8, 3.6);
  const W = 560, rad = 50 + 10 * r;
  return <>
    <Table y={820} />
    <Shadow x={960} y={820} w={620} s={s} />
    <div style={pos(960, 650, `scale(${s})`, { width: W, height: 360 })}>
      <div style={{ position: "absolute", left: W * r * 0.82, top: 0, width: W * (1 - r * 0.82), height: 360, borderRadius: r > 0.05 ? "0 180px 180px 0 / 0 180px 180px 0" : "50%", background: "radial-gradient(circle at 30% 40%, rgba(140,90,30,.5) 0 8px, transparent 9px) 0 0/70px 60px, radial-gradient(ellipse,#f4dc98,#e2bc6a)", boxShadow: "0 10px 20px rgba(0,0,0,.3)" }} />
      {r > 0.02 && <div style={{ position: "absolute", left: W * r * 0.82 - rad, top: -6, width: rad * 2, height: 372, borderRadius: rad, background: "linear-gradient(90deg,#c89a4a,#f4dc98 40%,#e8c47a 60%,#b8883a)", boxShadow: "0 14px 24px rgba(0,0,0,.4)" }} />}
    </div>
    {Array.from({ length: 30 }, (_, i) => { const f = cl(salt * 1.4 - (i % 10) * 0.05); return f > 0 ? <div key={i} style={{ position: "absolute", left: 960 + W * 0.41 - 40 + (i * 17) % 80 - W / 2 + W * r * 0.82 - W * 0.41 + 20, top: 380 + 120 * f + (i % 3) * 6, width: 7, height: 7, background: "#fff", transform: "rotate(45deg)", opacity: f < 1 ? 1 : 0.9 }} /> : null; })}
    <Steam tt={tt} x={960} y={470} w={320} h={220} o={0.7} />
    <Big tt={tt} at={2.2} x={960} y={190} txt="CALIENTE Y CON SAL" size={88} col={AMB} />
  </>;
}}</Stage>;

// 14 · «Es de las comidas más antiguas del mundo»: el metate de piedra: la mano de piedra va y viene sobre el maíz y la masa sale por delante
export const Metate: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#e8d0a0,#b8884e)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), m = Math.sin((tt - 0.5) * 3.2) * (tt > 0.5 ? 1 : 0), masa = eio(tt, 0.8, 4.2);
  return <>
    <div style={pos(960, 920, "", { width: 2000, height: 240, background: "linear-gradient(180deg,#a8763e,#6b4224)" })} />
    <Shadow x={960} y={860} w={900} s={s} />
    <div style={pos(960, 720, `scale(${s}) rotate(-6deg)`, { width: 860, height: 240, borderRadius: "40px 40px 80px 80px", background: "radial-gradient(circle at 20% 30%, rgba(255,255,255,.12) 0 3px, transparent 4px) 0 0/26px 22px, linear-gradient(180deg,#8a8580,#5a5550)", boxShadow: "inset 0 18px 0 #a8a29a, 0 30px 40px rgba(0,0,0,.45)" })}>
      {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 360 + (i * 37) % 300, top: 10 + (i * 13) % 30, width: 22, height: 18, borderRadius: "50%", background: "#f2c84a", opacity: 1 - masa }} />)}
      <div style={{ position: "absolute", left: 40, top: 6, width: 300 * masa, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#f6e6b8,#e2c88a)" }} />
    </div>
    <div style={pos(1000 + 180 * m, 640 + 10 * Math.abs(m), `scale(${s}) rotate(-6deg)`, { width: 520, height: 80, borderRadius: 40, background: "linear-gradient(180deg,#9a948c,#5a5550)", boxShadow: "0 14px 20px rgba(0,0,0,.4)" })} />
    <Big tt={tt} at={1.6} x={960} y={200} txt="DE LAS MÁS ANTIGUAS" size={90} col="#6b2a14" />
  </>;
}}</Stage>;

// 15 · «Un sobre era para dos personas, y en mi casa éramos nueve»: el sobre se abre en una sola olla y de la olla salen nueve platitos en abanico, cada uno con menos caldo
export const Stretch9: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), env = eio(tt, 0.3, 1.0);
  return <>
    <Table y={880} />
    <div style={pos(960, 440 - 120 * env, `scale(${s * (1 - 0.5 * eio(tt, 1.0, 1.6))}) rotate(${-8 + 8 * env}deg)`, { width: 220, height: 150, background: "linear-gradient(180deg,#e85a3a,#b8381e)", borderRadius: 10, boxShadow: "0 14px 20px rgba(0,0,0,.4)", opacity: 1 - eio(tt, 1.3, 1.7) })}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontWeight: 900, fontSize: 34, color: "#fff4d8" }}>SOPA · 2</div>
    </div>
    {Array.from({ length: 9 }, (_, i) => { const a = -80 + i * 20, q = cl(sp(tt, 1.4 + i * 0.22, 6.5, 0.45)), x = 960 + 640 * Math.sin(a * Math.PI / 180) * q, y = 860 - 360 * Math.cos(a * Math.PI / 180) * q + 200;
      return <div key={i} style={pos(x, y, `scale(${0.5 + 0.5 * q})`, { width: 150, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse,#f6f1e6 0 56%,#d8cfbe 58%,#efe8da 72%)", boxShadow: "0 10px 14px rgba(0,0,0,.35)", opacity: cl(q * 3) })}>
        <div style={{ position: "absolute", left: 75 - 50 * (1 - i * 0.07), top: 35 - 20 * (1 - i * 0.07), width: 100 * (1 - i * 0.07), height: 40 * (1 - i * 0.07), borderRadius: "50%", background: "radial-gradient(ellipse,#e8b860,#c08a30)" }} />
      </div>; })}
    <Big tt={tt} at={1.2} x={960} y={150} txt="PARA DOS, ÉRAMOS NUEVE" size={84} col={AMB} />
  </>;
}}</Stage>;

// 16 · «Un huevo batido al final, que se cuaja en hilos»: vista desde arriba: el caldo gira y el chorrito de huevo dibuja una espiral que se vuelve hilos blancos
export const EggThreads: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #3a2a1c, #120c08 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), p = eio(tt, 0.5, 3.0), set = eio(tt, 2.0, 3.6), rot = tt * 40;
  const pts = Array.from({ length: 90 }, (_, i) => { const u = i / 89, a = u * 12 + 0.4, r = 40 + 260 * u; return [960 + r * Math.cos(a), 560 + r * Math.sin(a) * 0.92]; });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 760, height: 720, borderRadius: "50%", background: "radial-gradient(circle,#3a3a3a 0 66%,#666 68%,#222 74%)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" })} />
    <div style={pos(960, 560, `scale(${s}) rotate(${rot}deg)`, { width: 640, height: 600, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #e8b860, #c8862a 70%, #9a5e18)" })}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + 240 * Math.cos(i * 1.7) * ((i % 5) / 5), top: 280 + 230 * Math.sin(i * 1.7) * ((i % 5) / 5), width: 50, height: 12, borderRadius: 6, background: "#f2d07a", transform: `rotate(${i * 40}deg)` }} />)}
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${rot * 0.6}deg)`, transformOrigin: "960px 560px" }}>
      <path d={d} fill="none" stroke={`rgba(${Math.round(255 - 10 * set)},${Math.round(220 + 30 * set)},${Math.round(120 + 120 * set)},.95)`} strokeWidth={10 - 4 * set} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} style={{ filter: set > 0 ? `url(#rough)` : undefined }} />
      <defs><filter id="rough"><feTurbulence baseFrequency="0.04" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale={14 * set} /></filter></defs>
    </svg>
    <Big tt={tt} at={2.4} x={960} y={130} txt="SE CUAJA EN HILOS" size={90} col={AMB} />
  </>;
}}</Stage>;

// 17 · «La freía en la sartén, hasta que se doraban las orillas y se inflaba en el medio como un platito»: la rodaja de mortadela se arquea en la sartén y queda como un platito; el huevo cae adentro
export const CupSlice: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 55%, #2a1c12, #0b0806 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cup = eio(tt, 0.5, 2.6), egg = cl(sp(tt, 3.0, 5, 0.5));
  return <>
    <div style={pos(900, 640, `scale(${s})`, { width: 760, height: 520, borderRadius: "50%", background: "radial-gradient(ellipse,#2a2a2a 0 64%,#3a3a3a 66%,#111 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" })}>
      <div style={{ position: "absolute", left: 740, top: 230, width: 360, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#2a2a2a,#0d0d0d)" }} />
    </div>
    <div style={pos(900, 640 - 50 * cup, `scale(${s}) perspective(800px) rotateX(${55 - 10 * cup}deg)`, { width: 440, height: 440 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,.0) 0 ${60 - 20 * cup}%, rgba(120,50,30,${0.3 + 0.5 * cup}) 70%, rgba(80,30,10,${0.6 * cup}) 76%), radial-gradient(circle at 30% 30%, #fff 0 4px, transparent 5px) 0 0/60px 54px, #e89a8a`, transform: `scale(${1 - 0.08 * cup})`, boxShadow: `inset 0 ${-40 * cup}px ${50 * cup}px rgba(120,40,20,.5), 0 ${30 * cup}px ${30 * cup}px rgba(0,0,0,.6)` }} />
      {egg > 0.01 && <div style={{ position: "absolute", left: 220 - 150 * egg, top: 220 - 140 * egg, width: 300 * egg, height: 280 * egg, borderRadius: "48% 52% 50% 50%", background: "radial-gradient(circle at 50% 50%, #ffb81e 0 22%, #fbf8f0 24%)" }} />}
    </div>
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 1.4 + i * 0.1) % 1; return <div key={i} style={{ position: "absolute", left: 700 + i * 44, top: 560 - 120 * ph, width: 8, height: 8, borderRadius: "50%", background: "#ffd88a", opacity: (1 - ph) * cup }} />; })}
    <Big tt={tt} at={2.0} x={1440} y={220} txt="COMO UN PLATITO" size={84} col={AMB} />
  </>;
}}</Stage>;

// 18 · «Cada uno encontraba dos o tres rodajitas en su plato, y las buscábamos como si fueran tesoros»: la lupa recorre el plato de arroz con salsa; donde pasa, brilla una rodajita de salchicha
export const Treasure: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), u = eio(tt, 0.4, 4.4), lx = 960 + 300 * Math.cos(u * 5.2 + 2), ly = 600 + 180 * Math.sin(u * 5.2 + 2);
  const T: [number, number][] = [[760, 520], [1150, 660], [980, 720]];
  return <>
    <Table y={860} />
    <Shadow x={960} y={860} w={900} s={s} />
    <div style={pos(960, 620, `scale(${s})`, { width: 880, height: 440, borderRadius: "50%", background: "radial-gradient(ellipse,#f6f1e6 0 60%,#d8cfbe 62%,#efe8da 74%)", boxShadow: "0 30px 40px rgba(0,0,0,.4)" })}>
      <div style={{ position: "absolute", left: 120, top: 70, width: 640, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,#c83a1e 0 40%,#d8562e 60%, transparent 62%), radial-gradient(circle,#fbf8f0 0 4px,#ece4d2 5px) 0 0/14px 10px" }} />
    </div>
    {T.map(([x, y], i) => { const d = Math.hypot(lx - x, ly - y), g = cl(1 - d / 160), seen = tt > 1 + i * 1.2 ? 1 : 0;
      return <div key={i} style={pos(x, y, `scale(${0.9 + 0.3 * g})`, { width: 60, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#e8907a,#b8503a)", boxShadow: `0 0 ${40 * Math.max(g, seen * 0.4)}px rgba(255,220,120,.9)`, border: "3px solid #8a3020" })} />; })}
    <div style={pos(lx, ly, `scale(${s})`, { width: 260, height: 260, borderRadius: "50%", border: "20px solid #3a2a1a", background: "rgba(220,240,255,.18)", boxShadow: "inset 0 0 40px rgba(255,255,255,.4), 0 20px 30px rgba(0,0,0,.4)" })}>
      <div style={{ position: "absolute", left: 200, top: 200, width: 40, height: 200, borderRadius: 20, background: "linear-gradient(90deg,#3a2a1a,#6b4a2a)", transform: "rotate(-45deg)", transformOrigin: "50% 0" }} />
    </div>
    <Big tt={tt} at={2.0} x={960} y={170} txt="COMO TESOROS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 19 · «Mezclas los fideos con la mantequilla y un chorrito de esa agua, y se forma una cremita que los envuelve»: el tenedor gira y arma un nido de fideos que se vuelve brillante
export const Twirl: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), w = eio(tt, 0.4, 3.0), gl = eio(tt, 2.0, 3.6), rot = 720 * w;
  return <>
    <Table y={840} />
    <Shadow x={960} y={840} w={700} s={s} />
    <div style={pos(960, 680, `scale(${s})`, { width: 700, height: 320, borderRadius: "50%", background: "radial-gradient(ellipse,#f6f1e6 0 58%,#d8cfbe 60%,#efe8da 74%)" })} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 16 }, (_, i) => { const r0 = 40 + i * 10 * (1 - 0.55 * w), a0 = i * 0.9 + rot * Math.PI / 180;
        const d = Array.from({ length: 30 }, (_, j) => { const a = a0 + j * 0.22, r = r0 + 120 * (1 - w) * (j / 30); return `${j ? "L" : "M"} ${960 + r * Math.cos(a)} ${640 + r * Math.sin(a) * 0.5 - 30 * w}`; }).join(" ");
        return <path key={i} d={d} fill="none" stroke={`rgb(${240},${Math.round(210 + 20 * gl)},${Math.round(130 + 30 * gl)})`} strokeWidth={9} strokeLinecap="round" />; })}
      <ellipse cx={940} cy={600 - 30 * w} rx={140 * w} ry={50 * w} fill={`rgba(255,250,220,${0.35 * gl})`} />
    </svg>
    <div style={pos(960, 470 - 30 * w, `rotate(${rot * 0.15}deg)`, { width: 70, height: 360, opacity: cl(tt * 3) })}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 4 + i * 18, top: 220, width: 8, height: 120, borderRadius: "0 0 4px 4px", background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />)}
      <div style={{ position: "absolute", left: 22, top: 0, width: 26, height: 230, borderRadius: 13, background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />
    </div>
    <Big tt={tt} at={2.4} x={960} y={190} txt="UNA CREMITA QUE ENVUELVE" size={80} col={AMB} />
  </>;
}}</Stage>;

// 20 · «Una vecina vio a mi madre friéndolas y le dijo: ¿ni las cáscaras tiran?»: el tacho de basura abre la tapa y las cáscaras de papa vuelan de vuelta a la sartén
export const BinReturn: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#d8c8a8,#a88a60)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lid = eio(tt, 0.4, 0.9), fly = eio(tt, 1.0, 2.8), fry = eio(tt, 2.6, 4.2);
  return <>
    <Table y={880} />
    <div style={pos(460, 650, `scale(${s})`, { width: 300, height: 380, borderRadius: "10px 10px 30px 30px", background: "repeating-linear-gradient(90deg,#8e979f 0 30px,#b8c0c7 30px 60px)", boxShadow: "0 24px 30px rgba(0,0,0,.4)" })}>
      <div style={{ position: "absolute", left: -20, top: -40, width: 340, height: 40, borderRadius: 20, background: TIN, transformOrigin: "0 100%", transform: `rotate(${-70 * lid}deg)` }} />
    </div>
    {Array.from({ length: 9 }, (_, i) => { const st = i * 0.08, f = cl((fly - st) / (1 - st)), x = 460 + (1340 - 460) * f + (i % 3 - 1) * 60 * f, y = 480 - 380 * Math.sin(f * Math.PI) + (i % 3) * 20 * f;
      return f > 0 ? <div key={i} style={{ position: "absolute", left: x - 50, top: y - 18, width: 100, height: 36, borderRadius: "60% 40% 55% 45% / 70% 60% 40% 30%", background: `linear-gradient(180deg, rgb(${Math.round(180 + 40 * fry)},${Math.round(130 + 30 * fry)},${Math.round(80 - 40 * fry)}), rgb(${Math.round(150 + 50 * fry)},${Math.round(100 + 20 * fry)},40))`, transform: `rotate(${i * 50 + 360 * f}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,.3)" }} /> : null; })}
    <div style={pos(1340, 760, `scale(${s})`, { width: 560, height: 220, borderRadius: "50%", background: "radial-gradient(ellipse,#2a2a2a 0 62%,#3a3a3a 64%,#111 70%)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" })} />
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 1.6 + i * 0.13) % 1; return <div key={i} style={{ position: "absolute", left: 1200 + i * 36, top: 700 - 90 * ph, width: 8, height: 8, borderRadius: "50%", background: "#ffd88a", opacity: (1 - ph) * fry }} />; })}
    <Big tt={tt} at={1.4} x={960} y={190} txt="«¿NI LAS CÁSCARAS TIRAN?»" size={80} col="#6b2a14" hand />
  </>;
}}</Stage>;
