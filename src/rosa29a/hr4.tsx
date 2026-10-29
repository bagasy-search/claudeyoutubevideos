// rosa29a · componentes únicos 38-44 (los minutos que quedaban sin pieza). Todo en código.
import React from "react";
import { Stage, cl, eio, AMB, DIM } from "./hkit";
import { Steam, Tape, Big, Cup, Bowl, Table, Shadow } from "./rkit";
import { P, sp, pos } from "./hr1";

// 38 · «No hay ninguna vergüenza en una mesa puesta para uno»: el individual se desenrolla y llegan plato, cubiertos, servilleta y taza, de a uno
export const Table1: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const mat = eio(tt, 0.2, 1.0), it = [1.0, 1.4, 1.8, 2.2].map((a) => sp(tt, a, 6, 0.5));
  return <>
    <Table y={300} />
    <div style={pos(960, 640, "perspective(1300px) rotateX(48deg)", { width: 1100, height: 640 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1100 * mat, height: 640, borderRadius: 18, overflow: "hidden", background: "repeating-linear-gradient(90deg,#e9dcc0 0 22px,#d8c8a4 22px 26px)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 1100 * mat - 30, top: -10, width: 60, height: 660, borderRadius: 30, background: "linear-gradient(90deg,#c8b48c,#efe2c4,#c8b48c)", opacity: 1 - eio(tt, 0.9, 1.1) }} />
      <div style={{ position: "absolute", left: 330, top: 100, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle,#fbf8f0,#e2dccd 66%,#b8b0a0)", boxShadow: "0 24px 40px rgba(0,0,0,.4)", transform: `translateY(${(1 - cl(it[0])) * -500}px) scale(${0.6 + 0.4 * it[0]})`, opacity: cl(it[0] * 3) }} />
      <div style={{ position: "absolute", left: 190, top: 130, width: 26, height: 380, borderRadius: 13, background: "linear-gradient(90deg,#8a9096,#eef1f4,#8a9096)", transform: `translateX(${(1 - cl(it[1])) * -400}px)`, opacity: cl(it[1] * 3) }} />
      <div style={{ position: "absolute", left: 860, top: 130, width: 26, height: 380, borderRadius: 13, background: "linear-gradient(90deg,#8a9096,#eef1f4,#8a9096)", transform: `translateX(${(1 - cl(it[1])) * 400}px)`, opacity: cl(it[1] * 3) }} />
      <div style={{ position: "absolute", left: 60, top: 160, width: 110, height: 300, borderRadius: 8, background: "linear-gradient(90deg,#b33a2c,#d65a46)", transform: `rotate(${(1 - cl(it[2])) * -40}deg) scaleY(${cl(it[2])})`, transformOrigin: "50% 0", boxShadow: "0 10px 20px rgba(0,0,0,.35)" }} />
    </div>
    <div style={pos(1400, 560 - (1 - cl(it[3])) * 300, "", { opacity: cl(it[3] * 3) })}><Cup w={150} /></div>
    <Steam tt={tt} x={1395} y={490} w={110} h={160} o={cl(it[3])} />
    <Big tt={tt} at={2.6} x={960} y={150} txt="UNA MESA PARA UNO" size={92} />
    <Tape txt="sin ninguna vergüenza" x={960} y={260} s={cl(sp(tt, 3.2, 5, 0.5))} size={56} />
  </>;
}}</Stage>;

// 39 · «Una pizca de sal, que es el secreto que nadie te dice»: los dedos sueltan la pizca y los granos caen brillando, en cámara lenta, sobre la avena
export const Salt: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), rub = eio(tt, 0.8, 1.2);
  return <>
    <Table y={820} />
    <div style={pos(960, 790, `scale(${0.5 + 0.5 * s})`)}><Bowl w={560} col="#e3d3a6" /></div>
    <div style={pos(960 + 6 * Math.sin(tt * 14) * rub * (1 - eio(tt, 2.6, 3.0)), 250, `rotate(${-10}deg)`, { width: 220, height: 160, opacity: cl(s * 2) })}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 190, height: 70, borderRadius: "35px 40px 40px 35px", background: "linear-gradient(180deg,#f0c6a2,#d59d76)", boxShadow: "0 10px 18px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 40, top: 90, width: 170, height: 60, borderRadius: "30px 36px 36px 30px", background: "linear-gradient(180deg,#e8bc96,#cf946c)", boxShadow: "0 10px 18px rgba(0,0,0,.35)" }} />
    </div>
    {Array.from({ length: 34 }, (_, i) => {
      const a = 0.9 + (i % 12) * 0.12, k = cl((tt - a) / 2.4); if (k <= 0) return null;
      const x = 960 + ((i * 53) % 120 - 60) * (1 + k), y = 330 + 420 * k, sz = 6 + (i % 4) * 3;
      return <div key={i} style={pos(x, y, `rotate(${i * 40 + tt * 90}deg)`, { width: sz, height: sz, background: "#fff", boxShadow: `0 0 ${8 + (i % 3) * 6}px rgba(255,255,255,.9)`, opacity: k < 0.95 ? 1 : (1 - k) * 20 })} />;
    })}
    <Big tt={tt} at={1.6} x={1460} y={420} txt="UNA PIZCA" size={92} />
    <Tape txt="el secreto que nadie dice" x={1460} y={530} s={cl(sp(tt, 2.2, 5, 0.5))} size={50} />
  </>;
}}</Stage>;

// 40 · «El error es dejar de revolver: se pega en el fondo… No te vayas de la olla»: la cuchara de palo dibuja la espiral en la olla vista desde arriba
export const Stir: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), a = tt * 3.2, r = 150;
  return <>
    <div style={pos(900, 560, `perspective(1400px) rotateX(30deg) scale(${0.5 + 0.5 * s})`, { width: 760, height: 760 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle,#4a4e54 0 70%, #8a9096 74%, #2a2e34 80%)", boxShadow: "0 60px 100px rgba(0,0,0,.7)" }} />
      <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #f4ead0, #e2cf9e 70%, #b89a5a)", overflow: "hidden" }}>
        <svg width={620} height={620} viewBox="-310 -310 620 620" style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2].map((k) => <path key={k} d={Array.from({ length: 60 }, (_, i) => { const q = a - i * 0.08 - k * 2.1, rr = r * (0.5 + 0.5 * Math.sin(q * 0.3 + k)) + 40; return `${i ? "L" : "M"} ${(rr * Math.cos(q)).toFixed(1)} ${(rr * Math.sin(q)).toFixed(1)}`; }).join(" ")}
            fill="none" stroke="rgba(150,110,50,.45)" strokeWidth={10} strokeLinecap="round" />)}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 380 + (r + 40) * Math.cos(a) * 0.9 - 30, top: 380 + (r + 40) * Math.sin(a) * 0.9 - 300, width: 60, height: 340, transformOrigin: "50% 300px", transform: `rotate(${-20 + 10 * Math.sin(a)}deg)` }}>
        <div style={{ position: "absolute", left: 18, top: 0, width: 24, height: 250, borderRadius: 12, background: "linear-gradient(90deg,#8a5a2a,#c8945a,#8a5a2a)" }} />
        <div style={{ position: "absolute", left: 0, top: 230, width: 60, height: 100, borderRadius: "50%", background: "linear-gradient(90deg,#8a5a2a,#c8945a,#8a5a2a)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
      </div>
    </div>
    <Steam tt={tt} x={900} y={360} w={240} h={220} o={0.7} />
    <Big tt={tt} at={1.2} x={1480} y={440} txt="NO DEJES" size={90} />
    <Big tt={tt} at={1.6} x={1480} y={550} txt="DE REVOLVER" size={90} col={AMB} />
  </>;
}}</Stage>;

// 41 · «Esta es la que me daba mi madre cuando me enfermaba… a cucharadas»: la cuchara sube de la taza con el pan blandito y la leche que gotea
export const Spoon: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), up = eio(tt, 0.8, 2.6), drip = (tt * 1.2) % 1;
  return <>
    <Table y={820} />
    <div style={pos(960, 790, `scale(${0.6 + 0.4 * s})`)}><Bowl w={600} col="#f4efe2" top={<>{[[90, 20], [210, 50], [330, 16], [420, 60]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 70, height: 40, borderRadius: 10, background: "linear-gradient(160deg,#ead2a0,#c8a068)", opacity: 0.85 }} />)}</>} /></div>
    <div style={pos(960, 700 - 380 * up, `rotate(${-14 + 10 * up}deg) scale(${1 + 0.25 * up})`, { width: 200, height: 520 })}>
      <div style={{ position: "absolute", left: 82, top: 140, width: 36, height: 380, borderRadius: 18, background: "linear-gradient(90deg,#8a9096,#eef1f4,#8a9096)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 200, height: 160, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%, #fffdf6, #f1ead8 60%, #b8bec4 64%, #8a9096)", boxShadow: "0 20px 34px rgba(0,0,0,.45)" }}>
        <div style={{ position: "absolute", left: 50, top: 40, width: 100, height: 64, borderRadius: 16, background: "linear-gradient(160deg,#f1dcb0,#d2ae78)" }} />
      </div>
      {up > 0.6 && <div style={{ position: "absolute", left: 92, top: 150 + 160 * drip, width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#fffdf6", opacity: 1 - drip }} />}
    </div>
    <Steam tt={tt} x={960} y={620} w={220} h={200} o={0.6} />
    <Tape txt="cuando me enfermaba" x={1480} y={420} s={cl(sp(tt, 1.4, 5, 0.5))} size={58} rot={-4} />
    <Big tt={tt} at={2.4} x={1480} y={540} txt="A CUCHARADAS" size={74} />
  </>;
}}</Stage>;

// 42 · «Tirar el pan era tirar el trabajo de alguien»: detrás del pan se encienden, de a una, la espiga, la piedra del molino y el horno
export const Work: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const st = [0.6, 1.4, 2.2].map((a) => sp(tt, a, 6, 0.5)), b = sp(tt, 3.0, 5, 0.5);
  const xs = [380, 760, 1140];
  return <>
    <Table y={760} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {xs.map((x, i) => <line key={i} x1={x + 100} y1={540} x2={x + 100 + 230 * cl(st[i] ?? 0) * (i < 2 ? 1 : 1.2)} y2={540} stroke={AMB} strokeWidth={5} strokeDasharray="10 14" opacity={i < 2 ? cl(st[i + 1] * 2) : cl(b * 2)} />)}
    </svg>
    <div style={pos(xs[0], 540, `scale(${cl(st[0])})`, { width: 160, height: 360 })}>
      <div style={{ position: "absolute", left: 76, top: 120, width: 8, height: 240, background: "#c8a050" }} />
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: i % 2 ? 82 : 42, top: 10 + Math.floor(i / 2) * 30, width: 36, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f1d890, #c8a050)", transform: `rotate(${i % 2 ? 24 : -24}deg)` }} />)}
    </div>
    <div style={pos(xs[1], 540, `scale(${cl(st[1])}) rotate(${tt * 30}deg)`, { width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2a 0 12%, #9a948a 14%, #c8c0b4 60%, #8a847a)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" })}>
      {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ position: "absolute", left: 118, top: 30, width: 4, height: 90, background: "rgba(0,0,0,.25)", transformOrigin: "2px 90px", transform: `rotate(${k * 60}deg)` }} />)}
    </div>
    <div style={pos(xs[2], 540, `scale(${cl(st[2])})`, { width: 280, height: 240 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 280, height: 240, borderRadius: "140px 140px 10px 10px", background: "linear-gradient(180deg,#b8642e,#7a3a16)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 80, top: 110, width: 120, height: 130, borderRadius: "60px 60px 0 0", background: `radial-gradient(circle at 50% 80%, #ffd27a, #ff8a2a ${50 + 10 * Math.sin(tt * 3)}%, #4a1a06)` }} />
    </div>
    <div style={pos(1560, 560 - (1 - cl(b)) * 300, "", { width: 300, height: 170, borderRadius: "85px 85px 22px 22px", background: "linear-gradient(180deg,#c88a45,#8a5422)", boxShadow: `0 30px 50px rgba(0,0,0,.5), 0 0 ${60 * cl(b)}px rgba(255,190,110,.5)`, opacity: cl(b * 3) })} />
    <Big tt={tt} at={3.4} x={960} y={220} txt="EL TRABAJO DE ALGUIEN" size={86} col={AMB} />
    <Tape txt="el pan no se tira" x={960} y={900} s={cl(sp(tt, 4.0, 5, 0.5))} size={56} />
  </>;
}}</Stage>;

// 43 · «A veces lo que nos falta a la mañana es algo lindo de ver»: junto al plato, la flor del vaso se abre pétalo por pétalo con el sol
export const Flower: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const g = sp(tt, 0.3, 3.5, 0.65), op = eio(tt, 1.2, 3.6);
  return <>
    <div style={{ position: "absolute", left: 1300, top: -200, width: 1000, height: 1400, background: `radial-gradient(ellipse at 30% 40%, rgba(255,214,140,${0.35 * op}), transparent 60%)` }} />
    <Table y={760} />
    <div style={pos(700, 720, "perspective(1000px) rotateX(55deg)", { width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,#fbf8f0,#e2dccd 66%,#b8b0a0)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" })}>
      <div style={{ position: "absolute", left: 100, top: 100, width: 220, height: 220, borderRadius: 30, background: "linear-gradient(160deg,#e9c48a,#b77d3c)" }}>
        <div style={{ position: "absolute", left: 50, top: 50, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#ffcf5a 0 35%, #fffef8 38%)" }} />
      </div>
    </div>
    <div style={pos(1260, 640, "", { width: 160, height: 260, borderRadius: "14px 14px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,.12), rgba(255,255,255,.03) 40%, rgba(255,255,255,.16))", border: "3px solid rgba(255,255,255,.4)" })} />
    <div style={{ position: "absolute", left: 1256, top: 640 - 330 * cl(g), width: 8, height: 330 * cl(g) + 100, background: "linear-gradient(90deg,#3a6a2a,#6a9a4a,#3a6a2a)", borderRadius: 4 }} />
    <div style={pos(1260, 640 - 330 * cl(g), `scale(${cl(g)})`, { width: 10, height: 10 })}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: -32, top: -100 * op - 10, width: 74, height: 110, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", transformOrigin: `37px ${100 * op + 10}px`, transform: `rotate(${i * 45}deg) scaleY(${0.35 + 0.65 * op})`, background: "radial-gradient(circle at 50% 80%, #fff3c8, #f5a8b8 50%, #e0607a)", boxShadow: "0 6px 12px rgba(0,0,0,.25)" }} />)}
      <div style={{ position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle,#ffe08a,#e9a83a)" }} />
    </div>
    <Big tt={tt} at={2.4} x={960} y={170} txt="ALGO LINDO DE VER" size={92} col={AMB} />
  </>;
}}</Stage>;

// 44 · «Todas las que te di hoy están pensadas para uno. Las medidas que te dije son para uno»: las tazas medidoras bajan de mayor a menor y queda la de uno
export const Measure: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sz = [320, 250, 190, 140], keep = eio(tt, 2.8, 3.6);
  return <>
    <Table y={760} />
    {sz.map((w, i) => {
      const s = sp(tt, 0.2 + i * 0.35, 6, 0.45), last = i === sz.length - 1;
      const x = last ? 960 : 960 - (1.5 - i) * 300 * (1 - keep * 0.2), o = last ? 1 : 1 - 0.75 * keep;
      return <React.Fragment key={i}>
        <Shadow x={x} y={790} w={w + 40} s={s} />
        <div style={pos(x, 790 - w * 0.4 - (1 - cl(s)) * 500, `scale(${last ? 1 + 0.35 * keep : 1})`, { width: w, height: w * 0.8, opacity: cl(s * 3) * o })}>
          <div style={{ position: "absolute", left: 0, top: 0, width: w, height: w * 0.8, borderRadius: `${w * 0.05}px ${w * 0.05}px ${w * 0.35}px ${w * 0.35}px`, background: "linear-gradient(90deg,#8a9096,#eef1f4 40%,#a8aeb4)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
          <div style={{ position: "absolute", left: w * 0.9, top: w * 0.18, width: w * 0.6, height: w * 0.12, borderRadius: w * 0.06, background: "linear-gradient(180deg,#eef1f4,#8a9096)" }} />
        </div>
      </React.Fragment>;
    })}
    <Tape txt="para uno" x={960} y={560} s={cl(sp(tt, 3.4, 5, 0.5))} size={70} />
    <Big tt={tt} at={1.4} x={960} y={190} txt="MEDIDAS PARA UNO" size={96} />
    <Big tt={tt} at={1.8} x={960} y={290} txt="TODAS LAS DE HOY" size={46} col={DIM} />
  </>;
}}</Stage>;
