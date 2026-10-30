// ole29d · componentes únicos 13-24 (de los panqueques a la postal de Eslovaquia)
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eIn, eio, phys } from "./hkit";
import { Skillet, rnd } from "./heroes_d1";

// 13 · 5:09 · LOS PANQUEQUES AL AIRE: saltan de la sartén dando vuelta y aterrizan en la pila; tres se van al repasador
export const DFlip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const N = 6;
  return <>
    <Skillet x={520} y={760} r={230} heat={0.6} />
    {/* el plato de lata y el repasador a cuadros */}
    <div style={{ position: "absolute", left: 1060, top: 820, width: 380, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%, #e8ecf0, #8b9299)", transform: "translate(-50%,-50%)" }} />
    <div style={{ position: "absolute", left: 1520, top: 810, width: 380, height: 160, transform: "translate(-50%,-50%) rotate(-6deg)", background: "repeating-linear-gradient(0deg, rgba(200,40,40,.85) 0 22px, transparent 22px 44px), repeating-linear-gradient(90deg, rgba(200,40,40,.6) 0 22px, #f2ede2 22px 44px)", borderRadius: 10, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    {Array.from({ length: N }, (_, i) => { const a = 0.6 + i * 1.3, p = eio(tt, a, a + 1.1), toTowel = i >= 3;
      const x1 = toTowel ? 1520 : 1060, y1 = (toTowel ? 770 : 800) - (toTowel ? (i - 3) : i) * 26;
      const x = 520 + (x1 - 520) * p, y = 720 + (y1 - 720) * p - Math.sin(p * Math.PI) * 420;
      return tt > a - 0.6 ? <div key={i} style={{ position: "absolute", left: x, top: y, width: 280, height: 80, transform: `translate(-50%,-50%) rotateX(${p * 540}deg)`, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%, #f2c070, #c27a2a 70%, #8a4e16)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} /> : null; })}
    <Tag tt={tt} at={2.0} x={1060} y={420} txt="SIX PANCAKES" col={TX} size={46} />
    <Tag tt={tt} at={6.0} x={1520} y={560} txt="3 FOR DAY SIX" col={AMB} size={38} />
  </>;
}}</Stage>;

// 14 · 5:57 · LA VÍA DEL TREN: una línea de ferrocarril se dibuja entre los pinos y el vagón cocina avanza humeando
export const DRail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const d = eio(tt, 0.4, 3.6), car = eio(tt, 2.6, 9.0);
  const pts = (u: number) => [160 + u * 1600, 700 - Math.sin(u * Math.PI * 1.4) * 180];
  return <>
    {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1900, top: 230 + rnd(i, 2) * 300, width: 0, height: 0, borderLeft: "34px solid transparent", borderRight: "34px solid transparent", borderBottom: `${120 + rnd(i, 3) * 90}px solid #142219`, opacity: cl(phys(tt, rnd(i, 5) * 1.5, 6, 0.5)) }} />)}
    {/* durmientes + rieles */}
    {Array.from({ length: 60 }, (_, i) => { const u = i / 60; if (u > d) return null; const [x, y] = pts(u); return <div key={i} style={{ position: "absolute", left: x, top: y, width: 12, height: 60, background: "#4a3420", transform: "translate(-50%,-50%) rotate(8deg)" }} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[-18, 18].map((o) => <path key={o} d={Array.from({ length: 80 }, (_, i) => { const u = (i / 79) * d; const [x, y] = pts(u); return `${i ? "L" : "M"}${x},${y + o}`; }).join(" ")} stroke="#9aa0a6" strokeWidth={6} fill="none" />)}
    </svg>
    {/* el vagón cocina con su chimenea */}
    {(() => { const [x, y] = pts(car); return <div style={{ position: "absolute", left: x, top: y - 70, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 260, height: 120, background: "linear-gradient(180deg,#7a2a1a,#4a160c)", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.6)", position: "relative" }}>
        {[30, 110, 190].map((wx) => <div key={wx} style={{ position: "absolute", left: wx, top: 26, width: 44, height: 40, background: "#ffc46a", boxShadow: "0 0 20px #ff9a3a" }} />)}
        <div style={{ position: "absolute", left: 200, top: -50, width: 22, height: 50, background: "#222" }} />
      </div>
      {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.5 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 200 - ph * 160, top: -60 - ph * 160, width: 50 + ph * 70, height: 50 + ph * 70, borderRadius: "50%", background: "rgba(220,220,220,.5)", filter: "blur(10px)", opacity: 1 - ph }} />; })}
    </div>; })()}
    <Tag tt={tt} at={1.2} x={960} y={160} txt="THE RAILROAD CAMP COOK" col={AMB} size={50} />
  </>;
}}</Stage>;

// 15 · 6:13 · EL ARROZ AL AIRE: un salto de sartén; los granos fríos vuelan sueltos en arco, cada uno por su lado
export const DToss: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = (tt - 1.0) % 2.6, up = k > 0 && tt > 1.0 ? Math.sin(cl(k / 1.3) * Math.PI) : 0;
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(0, ${-up * 40}px) rotate(${-up * 6}deg)`, transformOrigin: "900px 760px" }}><Skillet x={900} y={760} r={280} heat={0.7} /></div>
    {Array.from({ length: 90 }, (_, i) => { const ph = cl((k - 0.1) / 1.6), ang = -Math.PI / 2 + (rnd(i) - 0.5) * 1.4, v = 300 + rnd(i, 2) * 260;
      const air = tt > 1.0 && ph > 0 && ph < 1;
      const x = 900 + (air ? Math.cos(ang) * v * ph : (rnd(i, 3) - 0.5) * 420), y = 760 + (air ? Math.sin(ang) * v * ph + 700 * ph * ph : (rnd(i, 4) - 0.5) * 360);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 16, height: 7, borderRadius: 4, background: i % 9 === 0 ? "#f5c84a" : i % 13 === 0 ? "#7ab04a" : "#fbf6e8", transform: `rotate(${rnd(i, 5) * 180 + tt * 200 * (air ? 1 : 0)}deg)`, boxShadow: "0 2px 3px rgba(0,0,0,.3)" }} />; })}
    <Tag tt={tt} at={1.6} x={1500} y={360} txt="YESTERDAY'S COLD RICE" col={ICE} size={42} />
    <Tag tt={tt} at={4.0} x={1500} y={430} txt="EVERY GRAIN LOOSE" col={AMB} size={42} />
  </>;
}}</Stage>;

// 16 · 6:31 · UNA SOLA CUCHARADA: la cuchara vierte su grasa y la mancha queda fina; la que vierte de más inunda y el panqueque nada
export const DSpoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = eio(tt, 0.8, 2.6), b = eio(tt, 3.6, 7.6);
  const Spoon = ({ x, tip }: { x: number; tip: number }) => <div style={{ position: "absolute", left: x, top: 300, transform: `rotate(${-20 - tip * 50}deg)`, transformOrigin: "0 50%" }}>
    <div style={{ width: 120, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #eef1f4, #8b9299)" }} /><div style={{ position: "absolute", left: 110, top: 34, width: 260, height: 14, borderRadius: 7, background: "#9aa0a6" }} />
  </div>;
  return <>
    <Skillet x={520} y={680} r={250}><div style={{ position: "absolute", left: "50%", top: "50%", width: 120 + 200 * a, height: 110 + 180 * a, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,170,.35), rgba(255,220,150,.08) 70%, transparent)" }} /></Skillet>
    <Skillet x={1380} y={680} r={250}><div style={{ position: "absolute", inset: 0, background: `rgba(240,200,120,${0.5 * b})`, boxShadow: `inset 0 0 40px rgba(255,240,200,${0.4 * b})` }}><div style={{ position: "absolute", left: 100, top: 120, width: 220, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #e8d2a0, #c8a060)", transform: `translateY(${Math.sin(tt * 2) * 6 * b}px)`, opacity: b }} /></div></Skillet>
    <Spoon x={420} tip={a} />
    {Array.from({ length: 4 }, (_, i) => <Spoon key={i} x={1260 + i * 10} tip={cl(b * 4 - i)} />).slice(0, 1 + Math.floor(b * 3.99))}
    <Tag tt={tt} at={2.4} x={520} y={980} txt="ONE SPOON" col={AMB} size={50} />
    <Tag tt={tt} at={6.4} x={1380} y={980} txt="GREASY PANCAKE" col={RED} size={50} />
  </>;
}}</Stage>;

// 17 · 7:37 · DE ITALIA AL CAMPAMENTO: un mapa de pergamino; la bolsa de harina de maíz cruza el océano en una línea punteada
export const DItaly: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 1.0, 7.0);
  const A = [1500, 520], B = [430, 430], C = [(A[0] + B[0]) / 2, 140];
  const q = (u: number) => [(1 - u) * (1 - u) * A[0] + 2 * u * (1 - u) * C[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * u * (1 - u) * C[1] + u * u * B[1]];
  const [bx, by] = q(p);
  return <>
    <div style={{ position: "absolute", left: 120, top: 120, right: 120, bottom: 120, borderRadius: 16, background: "radial-gradient(ellipse at 50% 45%, #efe2c4, #cdb98e 80%)", boxShadow: "0 50px 110px rgba(0,0,0,.6), inset 0 0 80px rgba(110,80,30,.35)", transform: `rotate(${-1.5 + Math.sin(tt * 0.3) * 0.5}deg)` }}>
      {/* costas dibujadas a mano */}
      <svg width={1680} height={840} style={{ position: "absolute", inset: 0 }}>
        <path d="M60,200 C180,140 300,180 360,260 C420,340 380,480 300,560 C240,620 160,660 90,640" stroke="#6a4e2a" strokeWidth={4} fill="rgba(140,110,60,.18)" />
        <path d="M1240,260 C1320,220 1420,240 1480,300 L1500,380 C1520,440 1560,500 1600,560 L1560,600 C1500,560 1460,500 1420,450 C1380,400 1300,360 1240,330 Z" stroke="#6a4e2a" strokeWidth={4} fill="rgba(140,110,60,.18)" />
        <path d={Array.from({ length: 60 }, (_, i) => { const u = (i / 59) * p; const [x, y] = q(u); return `${i ? "L" : "M"}${x - 120},${y - 120}`; }).join(" ")} stroke="#8a2a1a" strokeWidth={5} strokeDasharray="14 12" fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 1260, top: 420, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#4a3418" }}>Italy</div>
      <div style={{ position: "absolute", left: 180, top: 180, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#4a3418" }}>Minnesota</div>
    </div>
    {/* la bolsita de harina de maíz que viaja */}
    <div style={{ position: "absolute", left: bx, top: by, transform: `translate(-50%,-50%) rotate(${Math.sin(tt * 2) * 8}deg) scale(${0.8 + 0.3 * Math.sin(p * Math.PI)})` }}>
      <div style={{ width: 110, height: 140, borderRadius: "30% 30% 12% 12%", background: "repeating-linear-gradient(90deg,#d8c08a 0 6px,#c8ad74 6px 12px)", boxShadow: "0 16px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#6a4a1a" }}>CORN</div>
    </div>
    <Tag tt={tt} at={6.8} x={960} y={940} txt="POLENTA CAME WITH THEM" col={AMB} size={44} />
  </>;
}}</Stage>;

// 18 · 8:25 · NO LLENES LA SARTÉN: vista cenital; las papas apretadas largan una nube de vapor, separadas chisporrotean
export const DCrowd: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = eio(tt, 0.6, 2.0);
  return <>
    <Skillet x={520} y={620} r={280} heat={0.5}>{Array.from({ length: 46 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i % 7) * 66 + rnd(i) * 8, top: 30 + Math.floor(i / 7) * 66, width: 64, height: 60, borderRadius: 12, background: "radial-gradient(circle at 35% 30%, #f8ecc4, #d8c088)", transform: `scale(${s}) rotate(${rnd(i, 2) * 30}deg)` }} />)}</Skillet>
    <Skillet x={1400} y={620} r={280} heat={0.9}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 70 + (i % 4) * 110, top: 90 + Math.floor(i / 4) * 130, width: 66, height: 60, borderRadius: 12, background: "radial-gradient(circle at 35% 30%, #f5cf7a, #b8742a)", transform: `scale(${s}) rotate(${rnd(i, 3) * 30}deg)` }} />)}</Skillet>
    {/* vapor de la llena */}
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.45 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 400 + rnd(i) * 240, top: 560 - ph * 420, width: 120 + ph * 120, height: 120 + ph * 120, borderRadius: "50%", background: "rgba(240,244,250,.5)", filter: "blur(26px)", opacity: Math.sin(ph * Math.PI) * cl(tt - 2) }} />; })}
    {/* chisporroteo de la que tiene lugar */}
    {Array.from({ length: 26 }, (_, i) => { const ph = (tt * 2.2 + rnd(i)) % 1, a = rnd(i, 2) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: 1400 + Math.cos(a) * (120 + ph * 160), top: 620 + Math.sin(a) * (100 + ph * 140) - ph * 60, width: 5, height: 5, borderRadius: "50%", background: "#ffe4a0", opacity: (1 - ph) * cl(tt - 2) }} />; })}
    <Tag tt={tt} at={2.4} x={520} y={970} txt="CROWDED · IT STEAMS" col={RED} size={44} />
    <Tag tt={tt} at={3.6} x={1400} y={970} txt="ROOM · IT FRIES" col={AMB} size={44} />
  </>;
}}</Stage>;

// 19 · 9:00 · LA SALCHICHA EN MONEDAS: el cuchillo corta un cuarto en rodajas; los tres cuartos se envuelven solos en papel con hilo
export const DWrap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const cuts = Math.floor(eio(tt, 0.8, 4.0) * 6.99), wrap = eio(tt, 5.0, 8.4);
  return <>
    {/* tabla */}
    <div style={{ position: "absolute", left: 960, top: 620, width: 1300, height: 420, transform: "translate(-50%,-50%)", borderRadius: 30, background: "repeating-linear-gradient(90deg,#a87a4a 0 30px,#9a6e40 30px 60px)", boxShadow: "0 50px 100px rgba(0,0,0,.6)" }} />
    {/* tres cuartos de salchicha */}
    <div style={{ position: "absolute", left: 1100, top: 600, width: 560, height: 110, transform: "translate(-50%,-50%)", borderRadius: 55, background: "linear-gradient(180deg,#a44a2a,#6a2614 70%,#4a180c)" }} />
    {/* el papel de carnicero que se cierra encima */}
    <div style={{ position: "absolute", left: 1100, top: 600, width: 620, height: 200, transform: `translate(-50%,-50%) scaleY(${wrap})`, transformOrigin: "50% 100%", background: "linear-gradient(180deg,#f6f2ea,#e2dccd)", borderRadius: 20, boxShadow: "0 16px 30px rgba(0,0,0,.35)" }}>
      {wrap > 0.9 && [180, 440].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 6, height: "100%", background: "#c8a070" }} />)}
    </div>
    {/* las monedas */}
    {Array.from({ length: cuts }, (_, i) => { const s = phys(tt, 0.8 + i * 0.46, 8, 0.45); return <div key={i} style={{ position: "absolute", left: 640 - i * 84, top: 600 + (1 - s) * -60 + (i % 2) * 20, width: 100, height: 100, transform: `translate(-50%,-50%) rotate(${i * 20}deg)`, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, #e8a07a, #b85a3a 50%, #6a2614 72%)", boxShadow: "0 8px 14px rgba(0,0,0,.4)" }}>{Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 20 + rnd(i * 7 + k) * 56, top: 20 + rnd(i * 7 + k, 2) * 56, width: 8, height: 8, borderRadius: "50%", background: "#f6dcc8" }} />)}</div>; })}
    {/* cuchillo */}
    <div style={{ position: "absolute", left: 760 - cuts * 84, top: 470 + Math.abs(Math.sin(tt * 4)) * 60 * (tt < 4 ? 1 : 0), width: 40, height: 260, background: "linear-gradient(90deg,#d8dde2,#9aa0a6)", borderRadius: "0 0 20px 0", transform: "rotate(6deg)" }} />
    <Tag tt={tt} at={2.0} x={420} y={340} txt="ONE QUARTER" col={AMB} size={46} />
    <Tag tt={tt} at={6.4} x={1100} y={340} txt="THE REST FOR LATER" col={TX} size={42} />
  </>;
}}</Stage>;

// 20 · 10:05 · LA LATA DE GRASA: lata de café en corte; cada día que pasa el nivel blanco sube un poco más
export const DGreaseCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const days = eio(tt, 0.8, 8.0) * 5;
  return <>
    <div style={{ position: "absolute", left: 760, top: 580, transform: "translate(-50%,-50%)", width: 440, height: 560, borderRadius: "22px 22px 30px 30px", background: "linear-gradient(90deg,#5a5e62,#9aa0a6 30%,#6a6e72 70%,#3a3e42)", boxShadow: "0 50px 110px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 40 + i * 52, height: 4, background: "rgba(0,0,0,.2)" }} />)}
      {/* el corte: adentro la grasa en capas por día */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, bottom: 30, background: "#1a1a1c", borderRadius: 14, overflow: "hidden" }}>
        {Array.from({ length: Math.ceil(days) }, (_, i) => { const f = cl(days - i); return <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: i * 90, height: 90 * f, background: `linear-gradient(180deg, hsl(45,40%,${94 - i * 3}%), hsl(40,35%,${84 - i * 3}%))`, boxShadow: "inset 0 3px 0 rgba(255,255,255,.4)" }} />; })}
      </div>
    </div>
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1050, top: 790 - i * 90, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: days > i ? AMB : "rgba(247,244,238,.18)" }}>day {i + 1}</div>)}
    {/* chorrito que cae */}
    <div style={{ position: "absolute", left: 750, top: 120, width: 14, height: 200, borderRadius: 7, background: "linear-gradient(180deg, rgba(240,200,120,.0), rgba(240,200,120,.9))", opacity: tt < 8 ? 0.9 : 0 }} />
    <Tag tt={tt} at={2.0} x={1450} y={300} txt="NEVER THROWN OUT" col={AMB} size={44} />
  </>;
}}</Stage>;

// 21 · 10:37 · APLASTAR LA PAPA: el fondo de la taza baja y la papa hervida se abre en grietas que luego se doran
export const DSmash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 1.0, 2.2), br = eio(tt, 3.4, 8.0);
  return <>
    <Skillet x={960} y={700} r={330} heat={0.7}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 260 + 160 * p, height: 230 + 150 * p, transform: "translate(-50%,-50%)", borderRadius: `${50 - 10 * p}% ${46 + 8 * p}% ${52 - 6 * p}% ${48 + 4 * p}%`, background: `radial-gradient(circle at 40% 35%, hsl(${45 - br * 10},${60 + br * 20}%,${80 - br * 25}%), hsl(${35 - br * 10},${50 + br * 20}%,${60 - br * 25}%))`, boxShadow: "inset 0 -10px 20px rgba(0,0,0,.25)" }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2 + rnd(i) * 0.4; return <path key={i} d={`M50,50 L${50 + Math.cos(a) * 20 * p},${50 + Math.sin(a) * 20 * p} L${50 + Math.cos(a + 0.2) * 44 * p},${50 + Math.sin(a + 0.2) * 44 * p}`} stroke={`hsl(30,60%,${30 - br * 10}%)`} strokeWidth={1.6} fill="none" />; })}</svg>
      </div>
    </Skillet>
    {/* la taza de lata que aprieta */}
    <div style={{ position: "absolute", left: 960, top: 230 + 300 * p - 260 * eio(tt, 2.6, 3.4), transform: "translate(-50%,-50%)", width: 300, height: 260, borderRadius: "16px 16px 40px 40px", background: "linear-gradient(90deg,#6a6e72,#c8ccd0 35%,#8a8e92 70%,#4a4e52)", boxShadow: "0 40px 60px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={2.4} x={1560} y={500} txt="FLATTEN" col={TX} size={52} />
    <Tag tt={tt} at={5.6} x={1560} y={570} txt="CRISP EVERY CRACK" col={AMB} size={40} />
  </>;
}}</Stage>;

// 22 · 11:26 · EL PIEROGI DESARMADO: la empanadita se despliega en el aire y deja sus partes sueltas: fideo, papa y cebolla
export const DPierogi: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const o = eio(tt, 2.0, 4.4);
  const parts = [["NOODLE", "#f6ecd0", -420], ["POTATO", "#f2d488", 0], ["ONION", "#e0a24a", 420]] as const;
  return <>
    {/* la masa cerrada en medialuna que se abre */}
    <div style={{ position: "absolute", left: 960, top: 420, transform: `translate(-50%,-50%) scale(${phys(tt, 0.2, 5, 0.6) * (1 - o * 0.5)})`, opacity: 1 - o * 0.85 }}>
      <div style={{ width: 420, height: 210, borderRadius: "210px 210px 20px 20px", background: "radial-gradient(ellipse at 45% 60%, #fbf0d6, #e2cfa2)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: `rotateX(${o * 70}deg)` }}>
        <div style={{ position: "absolute", left: 10, right: 10, bottom: 6, height: 26, background: "repeating-linear-gradient(90deg,#d8c08a 0 14px,transparent 14px 28px)", borderRadius: 13 }} />
      </div>
    </div>
    {parts.map(([w, c, dx], i) => { const s = phys(tt, 2.4 + i * 0.4, 6, 0.45); return <div key={w} style={{ position: "absolute", left: 960 + dx * s, top: 420 + 300 * s, transform: "translate(-50%,-50%)", opacity: cl(s * 2) }}>
      <div style={{ width: 230, height: 150, borderRadius: i === 0 ? 30 : "50%", background: i === 0 ? `repeating-linear-gradient(20deg, ${c} 0 16px, #e8d8b0 16px 22px)` : `radial-gradient(circle at 40% 35%, ${c}, #8a5a20)`, boxShadow: "0 24px 40px rgba(0,0,0,.45)" }} />
      <div style={{ textAlign: "center", marginTop: 18, fontWeight: 900, fontSize: 38, letterSpacing: 3, color: TX }}>{w}</div>
    </div>; })}
    <Tag tt={tt} at={6.4} x={960} y={160} txt="LAZY PIEROGI · NO FOLDING" col={AMB} size={48} />
  </>;
}}</Stage>;

// 23 · 11:44 · CEBOLLA EN CORTE: fuego alto = negra por fuera y blanca adentro; fuego bajo = dorada pareja hasta el centro
export const DBurn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = eio(tt, 0.8, 7.4);
  const Ring = ({ x, hot }: { x: number; hot: boolean }) => <div style={{ position: "absolute", left: x, top: 560, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)})` }}>
    {Array.from({ length: 7 }, (_, i) => { const k = 1 - i / 7, col = hot ? (i < 2 ? `hsl(20,${20 + 20 * p}%,${60 - 52 * p}%)` : "#f3eee0") : `hsl(${45 - 15 * p * k},${30 + 50 * p}%,${88 - 38 * p}%)`;
      return <div key={i} style={{ position: "absolute", left: -260 * k, top: -260 * k, width: 520 * k, height: 520 * k, borderRadius: "50%", background: col, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.25)" }} />; })}
  </div>;
  return <>
    <Ring x={540} hot />
    <Ring x={1380} hot={false} />
    {/* llamas: altas a la izquierda, bajitas a la derecha (≤2 Hz) */}
    {[[540, 1], [1380, 0.35]].map(([x, k], j) => <div key={j} style={{ position: "absolute", left: (x as number) - 220, top: 880, width: 440, height: 120 * (k as number) * (1 + 0.08 * Math.sin(tt * 2 * Math.PI * 1.6 + j)), borderRadius: "50% 50% 10px 10px", background: "radial-gradient(ellipse at 50% 100%, #ffd27a, #ff6a1a 60%, transparent 72%)", transform: "translateY(-100%)" }} />)}
    <Tag tt={tt} at={3.0} x={540} y={200} txt="TOO HOT · BURNT" col={RED} size={46} />
    <Tag tt={tt} at={4.4} x={1380} y={200} txt="LOW AND SLOW · SWEET" col={AMB} size={46} />
  </>;
}}</Stage>;

// 24 · 12:32 · LA POSTAL DE ESLOVAQUIA: una postal vieja vuela, se da vuelta y muestra la receta de la abuela de Arvid a mano
export const DPostcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fl = phys(tt, 0.3, 4.5, 0.55), turn = eio(tt, 2.6, 4.0);
  const lines = ["cabbage, slow in butter", "wide egg noodles", "pepper, lots", "a little sausage if any"];
  return <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) translateX(${(1 - fl) * 900}px) rotate(${(1 - fl) * 30 - 4}deg)`, perspective: 1800 }}>
    <div style={{ width: 860, height: 540, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${turn * 180}deg)` }}>
      {/* frente: un paisaje de aldea pintado */}
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 12, overflow: "hidden", background: "linear-gradient(180deg,#9ab8c8,#e8d8b0 60%,#7a8a4a)", boxShadow: "0 50px 110px rgba(0,0,0,.6)" }}>
        {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 140, top: 300, width: 100, height: 90, background: "#f2ead8", boxShadow: "inset 0 -20px 0 rgba(0,0,0,.1)" }}><div style={{ position: "absolute", left: -10, top: -60, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "60px solid #8a3a24" }} /></div>)}
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: MARK, fontSize: 52, color: "#3a2a1a" }}>Slovakia</div>
      </div>
      {/* dorso: receta a mano, estampilla y matasellos */}
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 12, background: "linear-gradient(160deg,#f4ead2,#e2d2ac)", boxShadow: "0 50px 110px rgba(0,0,0,.6)", padding: "50px 60px" }}>
        <div style={{ position: "absolute", right: 50, top: 40, width: 120, height: 150, background: "repeating-linear-gradient(45deg,#b84a3a 0 6px,#c85a4a 6px 12px)", boxShadow: "0 0 0 8px #f4ead2, 0 0 0 10px #b8a27a" }} />
        <div style={{ position: "absolute", right: 120, top: 120, width: 170, height: 170, borderRadius: "50%", border: "4px solid rgba(40,30,80,.45)", transform: "rotate(-18deg)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#2a1e12" }}>Haluski</div>
        {lines.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 46, color: "#3a2a1a", marginTop: 8, clipPath: `inset(0 ${(1 - cl((tt - 4.4 - i * 0.9) / 0.9)) * 100}% 0 0)` }}>{l}</div>)}
      </div>
    </div>
  </div>;
}}</Stage>;
