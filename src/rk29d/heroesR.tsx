// rk29d · 12 componentes rediseñados para no repetir mecanismos de rk29a/b/c (cinta métrica, mancha, linterna, cajón, corte de casa,
// círculo de alcance, control del parasol, hilos, huellas, reloj de rutina). Cada uno UNA vez en toda la tanda.
import React from "react";
import { H, Stage, Tag, phys, cl, eio, TX } from "./hkit";
import { AMB, RED, GRN, YEL, rnd, At, Pickup, KFob, Hook, NHouse, Man, Bag } from "./truckdraw";

type P = { t: number; h: H };
const sp = (tt: number, a: number) => cl(phys(tt, a));

// 1 · once baldosas: del gancho de la entrada a la manija, las baldosas del piso se encienden de a una, cada una un pie
export const HLantern: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.min(11, Math.floor(eio(tt, 1, 4.6) * 11.99));
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1700px) rotateX(52deg)", transformOrigin: "50% 68%" }}>
    <div style={{ position: "absolute", left: 120, top: 180, width: 1680, height: 820, background: "linear-gradient(180deg,#2a2622,#14110e)" }} />
    {Array.from({ length: 11 }, (_, i) => { const on = i < n; return <div key={i} style={{ position: "absolute", left: 300 + i * 118, top: 520, width: 110, height: 110, borderRadius: 6, background: on ? `rgba(255,210,58,${0.55 + 0.35 * (i === n - 1 ? 1 : 0)})` : "#3a342d", boxShadow: on ? `0 0 ${i === n - 1 ? 40 : 14}px rgba(255,210,58,.6)` : "inset 0 0 0 2px #241f1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, color: on ? "#2a1e04" : "#5a5248" }}>{i + 1}</div>; })}
    <div style={{ position: "absolute", left: 560, top: 180, width: 30, height: 820, background: "linear-gradient(90deg,#6b5a48,#2a221b)" }} />
    <At x={300} y={380} s={sp(tt, 0.2)}><Hook s={1} keys={1} awake={1} /></At>
    <At x={1640} y={560} s={sp(tt, 0.5)}><Pickup w={520} col="#7b2c27" flip /></At>
    <Tag tt={tt} at={4.8} x={960} y={300} txt="ELEVEN FEET" col={YEL} size={74} />
  </div>;
}}</Stage>;

// 2 · las huellas en la escarcha: la entrada blanca de helada con dos rayas oscuras de neumático que se van a la calle; el café humea
export const HOilspot: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = eio(tt, 0.8, 3.8);
  return <>
    <div style={{ position: "absolute", inset: 0, transform: "perspective(1500px) rotateX(55deg)", transformOrigin: "50% 75%" }}>
      <div style={{ position: "absolute", left: 300, top: 0, width: 1320, height: 1080, background: "radial-gradient(ellipse at 50% 70%, #e9eef3, #b9c4cf 80%)", boxShadow: "inset 0 0 160px rgba(80,100,130,.4)" }}>
        {Array.from({ length: 120 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1300, top: rnd(i + 50) * 1060, width: 3, height: 3, borderRadius: "50%", background: "#fff", opacity: 0.6 }} />)}
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>{[-150, 150].map((d) => <path key={d} d={`M${960 + d} 1080 C ${960 + d} 700, ${900 + d} 400, ${700 + d * 0.6} 0`} stroke="rgba(70,72,74,.85)" strokeWidth="64" fill="none" strokeDasharray="1500" strokeDashoffset={1500 * (1 - L)} />)}</svg>
    </div>
    <At x={1580} y={820} s={sp(tt, 1.6)}><div style={{ width: 230, height: 220, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 180, height: 180, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#d9d2c4,#f4efe4 40%,#b9b2a4)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 170, top: 80, width: 60, height: 90, borderRadius: "0 40px 40px 0", border: "16px solid #d9d2c4", borderLeft: "none" }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 40, top: -60 - 30 * ((tt * 0.5 + i * 0.3) % 1), width: 24, height: 80, borderRadius: 12, background: "rgba(255,255,255,.35)", filter: "blur(8px)", opacity: 1 - ((tt * 0.5 + i * 0.3) % 1) }} />)}</div></At>
    <Tag tt={tt} at={4.2} x={960} y={140} txt="GONE BEFORE SUNRISE" col={TX} size={58} />
  </>;
}}</Stage>;

// 3 · la sumadora: dos números se marcan en las teclas de una sumadora vieja y la tira de papel sale con el total
export const HAbacus: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const keys = [9, 14], pr = (i: number) => tt > 1 + i * 1.1 && tt < 1.4 + i * 1.1, roll = eio(tt, 3.4, 5);
  return <>
    <At x={960} y={660} s={sp(tt, 0.2)}><div style={{ width: 760, height: 380, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(170deg,#4a5a52,#1e2622)", boxShadow: "0 50px 80px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.15)", position: "relative" }}>
      {Array.from({ length: 12 }, (_, i) => { const hot = (i === 2 && pr(0)) || (i === 7 && pr(1)); return <div key={i} style={{ position: "absolute", left: 60 + (i % 4) * 120, top: 90 + Math.floor(i / 4) * 90 + (hot ? 8 : 0), width: 96, height: 70, borderRadius: 14, background: hot ? AMB : "linear-gradient(180deg,#e9e6df,#a7a299)", boxShadow: hot ? "inset 0 4px 8px rgba(0,0,0,.4)" : "0 8px 0 #5a564e" }} />; })}
      <div style={{ position: "absolute", right: 50, top: 90, width: 110, height: 250, borderRadius: 14, background: pr(2) || tt > 3.2 && tt < 3.6 ? RED : "linear-gradient(180deg,#c8322a,#7a1a12)", boxShadow: "0 8px 0 #4a0e0a" }} />
    </div></At>
    <At x={960} y={430 - 260 * roll} s={sp(tt, 0.6)}><div style={{ width: 320, height: 120 + 380 * roll, background: "linear-gradient(180deg,#fbf8f0,#eae4d4)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", padding: "0 30px 20px", boxSizing: "border-box", fontFamily: "monospace", fontWeight: 900, color: "#2a2a2a" }}>
      {tt > 1.4 && <div style={{ fontSize: 46 }}>{keys[0]} +</div>}{tt > 2.5 && <div style={{ fontSize: 46 }}>{keys[1]} +</div>}
      {tt > 3.6 && <div style={{ fontSize: 80, color: RED, borderTop: "4px solid #2a2a2a", marginTop: 8 }}>23 FT</div>}</div></At>
    <Tag tt={tt} at={5.4} x={1520} y={300} txt="INSIDE + OUTSIDE" col={AMB} size={48} />
  </>;
}}</Stage>;

// 4 · el placar de arriba: la llave sube al estante alto, adentro de una caja de zapatos; la tapa cae y la puerta del placar se cierra
export const HDollhouse: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const up = eio(tt, 0.8, 2.6), lid = eio(tt, 2.8, 3.4), door = eio(tt, 4, 5.2);
  return <>
    <At x={960} y={560} s={sp(tt, 0.2)}><div style={{ width: 760, height: 860, position: "relative", background: "linear-gradient(180deg,#3a2e24,#1c1610)", boxShadow: "inset 0 0 0 26px #5a4636, 0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 26, right: 26, top: 220, height: 22, background: "linear-gradient(180deg,#8a6a48,#5a4128)" }} />
      <div style={{ position: "absolute", left: 60, top: 300, width: 640, height: 10, background: "#8a8e95" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 100 + i * 150, top: 310, width: 110, height: 300, borderRadius: "40px 40px 6px 6px", background: ["#4a5a6a", "#6a4a3a", "#3a4a3a", "#5a5a5a"][i], opacity: 0.85 }} />)}
      <div style={{ position: "absolute", left: 420, top: 120, width: 220, height: 100, background: "linear-gradient(180deg,#c9b48a,#8a7650)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 410, top: 120 - 80 * (1 - lid), width: 240, height: 30, background: "linear-gradient(180deg,#e0cca0,#a8946a)", transform: `rotate(${-20 * (1 - lid)}deg)`, transformOrigin: "0 100%" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 380 * door, height: 860, background: "linear-gradient(90deg,#e9e3d6,#c4bcab)", boxShadow: "inset -6px 0 0 rgba(0,0,0,.2)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, width: 380 * door, height: 860, background: "linear-gradient(270deg,#e9e3d6,#c4bcab)", boxShadow: "inset 6px 0 0 rgba(0,0,0,.2)" }} />
    </div></At>
    <At x={1050} y={900 - 760 * up} s={0.5 * sp(tt, 0.4)} o={1 - lid}><KFob s={1} awake={1 - up * 0.6} /></At>
    <Tag tt={tt} at={5.4} x={1520} y={300} txt="UPSTAIRS CLOSET" col={AMB} size={50} />
  </>;
}}</Stage>;

// 5 · la rueda de medir: el odómetro de la rueda de agrimensor corre de 15 a 30 mientras rueda por el pasillo
export const HDoubler: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const m = eio(tt, 0.8, 4.6), ft = Math.round(15 + 15 * m), x = 360 + 1120 * m;
  return <>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "repeating-linear-gradient(90deg,#5a4430 0 180px,#4a3826 180px 184px)" }} />
    <At x={x} y={600} s={sp(tt, 0.2)}><div style={{ width: 300, height: 480, position: "relative" }}>
      <div style={{ position: "absolute", left: 60, bottom: 0, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#ffd23a 22%,#1a1a1a 26%,#1a1a1a 86%,#3a3a3a 90%)", transform: `rotate(${m * 1440}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
        {[0, 60, 120].map((a) => <div key={a} style={{ position: "absolute", left: 86, top: 20, width: 8, height: 140, background: "#ffd23a", transform: `rotate(${a}deg)` }} />)}</div>
      <div style={{ position: "absolute", left: 144, top: 0, width: 12, height: 330, background: "linear-gradient(90deg,#c9ccd1,#6a6e75)", transform: "rotate(-16deg)", transformOrigin: "50% 100%" }} />
      <div style={{ position: "absolute", left: 60, top: 150, width: 150, height: 70, borderRadius: 10, background: "#1a1a1a", boxShadow: "inset 0 0 0 4px #ffd23a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 900, fontSize: 44, color: "#ffd23a" }}>{String(ft).padStart(3, "0")}</div>
    </div></At>
    <At x={960} y={200} s={sp(tt, 1)}><div style={{ fontWeight: 900, fontSize: 130, color: ft >= 30 ? GRN : TX, fontVariantNumeric: "tabular-nums" }}>{ft} FT</div></At>
    <Tag tt={tt} at={4.8} x={960} y={360} txt="DOUBLE THE DISTANCE" col={GRN} size={48} />
  </>;
}}</Stage>;

// 6 · la de internet: la llave del bolsillo cierra el ojo; la de repuesto sale de una caja de envío y se queda despierta
export const HTwofobs: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const flap = eio(tt, 1.8, 2.6), rise = eio(tt, 2.4, 3.4);
  return <>
    <At x={600} y={520} s={sp(tt, 0.3) * 1.6}><KFob s={1} awake={cl(1 - (tt - 1.2) / 0.6)} /></At>
    <Tag tt={tt} at={1.6} x={600} y={900} txt="ORIGINAL: ASLEEP" col={GRN} size={46} />
    <At x={1320} y={760} s={sp(tt, 1)}><div style={{ width: 460, height: 260, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 460, height: 260, background: "linear-gradient(180deg,#c9a26a,#8a6a3a)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 210, top: 0, width: 40, height: 260, background: "rgba(220,200,150,.5)" }} />
        <div style={{ position: "absolute", left: 40, top: 120, width: 150, height: 90, background: "#f3f0ea", boxShadow: "inset 0 0 0 3px #888" }}>{[0, 1, 2].map((i) => <div key={i} style={{ height: 8, margin: "14px 14px 0", background: "#999", width: 120 - i * 30 }} />)}</div></div>
      {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", top: -2, left: d < 0 ? 0 : 230, width: 230, height: 120, background: "linear-gradient(180deg,#d8b47a,#a8844a)", transformOrigin: d < 0 ? "0 0" : "100% 0", transform: `perspective(600px) rotateX(${-150 * flap}deg)` }} />)}
    </div></At>
    <At x={1320} y={640 - 200 * rise} s={sp(tt, 2.4) * 1.3}><KFob s={1} awake={0.7 + 0.3 * Math.sin(tt * 3)} /></At>
    <Tag tt={tt} at={3.8} x={1320} y={150} txt="SPARE: WIDE AWAKE" col={RED} size={50} />
  </>;
}}</Stage>;

// 7 · la sombra de la llave: la llave de la camioneta bajo la lámpara proyecta en la puerta de la casa la sombra de una llave de casa; la puerta se abre
export const HTruckkey: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sh = eio(tt, 1, 2.8), open = eio(tt, 3.2, 4.6);
  return <>
    <At x={1300} y={560} s={sp(tt, 0.2)}><div style={{ width: 520, height: 860, position: "relative", background: "#1a1410", boxShadow: "inset 0 0 0 24px #5a4636" }}>
      <div style={{ position: "absolute", left: 24, top: 24, width: 472, height: 812, background: "radial-gradient(ellipse at 50% 30%, rgba(255,214,150,.6), #1a1410 70%)" }} />
      <div style={{ position: "absolute", left: 24, top: 24, width: 472, height: 812, background: "linear-gradient(90deg,#7a4a2a,#5a3418)", transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-75 * open}deg)`, boxShadow: "inset 0 0 0 10px rgba(0,0,0,.2)" }}>
        <div style={{ position: "absolute", right: 40, top: 400, width: 34, height: 34, borderRadius: "50%", background: "#c9a24a" }} />
        <svg width="472" height="812" style={{ position: "absolute", left: 0, top: 0, opacity: 0.75 * sh }}><g transform="translate(150 200) scale(1.6)"><circle cx="50" cy="50" r="44" fill="#120c06" /><circle cx="50" cy="44" r="14" fill="#5a3418" /><path d="M40 90 L60 90 L60 260 L50 274 L40 260 Z M60 150 L80 150 L80 170 L60 170 M60 200 L74 200 L74 218 L60 218" fill="#120c06" /></g></svg>
      </div></div></At>
    <At x={420} y={180} s={sp(tt, 0.4)}><div style={{ width: 180, height: 60, borderRadius: "90px 90px 10px 10px", background: "#2c2e33", boxShadow: "0 40px 100px rgba(255,236,190,.5)" }} /></At>
    <At x={560} y={480} s={sp(tt, 0.6)} rot={8 * Math.sin(tt * 1.2)}><KFob s={1.2} /></At>
    <Tag tt={tt} at={4.8} x={560} y={900} txt="KEY TO THE HOUSE" col={AMB} size={54} />
  </>;
}}</Stage>;

// 8 · el recital: telón rojo que se abre; mientras aplauden, en otra parte un tráiler ajeno se carga de a uno: cortadora, freezer, caja de herramientas
export const HRecital: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const c = eio(tt, 0.6, 2.2), it = (i: number) => eio(tt, 2.6 + i * 0.8, 3.3 + i * 0.8);
  const goods = [{ w: 150, h: 110, c: "#2f7a3a" }, { w: 170, h: 150, c: "#e9e6df" }, { w: 130, h: 80, c: "#c8322a" }];
  return <>
    <div style={{ position: "absolute", left: 80, top: 160, width: 760, height: 720, background: "radial-gradient(ellipse at 50% 30%, #fff1c8, #4a3420 70%)", overflow: "hidden" }}>
      {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", top: 0, [d < 0 ? "left" : "right"]: 0, width: 380 * (1 - 0.7 * c), height: 720, background: "repeating-linear-gradient(90deg,#7a0f12 0 40px,#a81e22 40px 70px,#7a0f12 70px 90px)", boxShadow: "0 0 40px rgba(0,0,0,.7)" } as React.CSSProperties} />)}
      <div style={{ position: "absolute", left: 340, top: 300, opacity: c }}><Man s={1} col="#2a1a2e" /></div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 160, width: 840, height: 720, background: "linear-gradient(180deg,#9ec4e8,#d8e6f0 60%,#7a8a6a 60%)" }} />
    <At x={1420} y={700} s={sp(tt, 1.6)}><div style={{ width: 620, height: 260, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 560, height: 180, background: "linear-gradient(180deg,#5a5e64,#2a2c30)", borderRadius: 6 }} />
      {[120, 440].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 190, width: 80, height: 80, borderRadius: "50%", background: "#111" }} />)}
      {goods.map((g, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 170 + 400 * (1 - it(i)), top: 210 - g.h, width: g.w, height: g.h, borderRadius: 10, background: g.c, opacity: cl(it(i) * 3), boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} />)}
    </div></At>
    <Tag tt={tt} at={5.2} x={1420} y={260} txt="BROAD DAYLIGHT" col={RED} size={54} />
  </>;
}}</Stage>;

// 9 · la cajita imantada: se abre como almeja y adentro está la llave; el contador mecánico de paletas gira de 1975 a 2025
export const HMagnet50: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 1, 2), yr = Math.round(1975 + 50 * eio(tt, 2.4, 5)), dg = String(yr).split("");
  return <>
    <At x={620} y={580} s={sp(tt, 0.2) * 1.4}><div style={{ width: 360, height: 220, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 110, width: 360, height: 110, borderRadius: "0 0 30px 30px", background: "linear-gradient(180deg,#2c2c2e,#0e0e10)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 90, top: 120, width: 180, opacity: op }}><div style={{ transform: "rotate(90deg) scale(.55)", transformOrigin: "50% 50%" }}><KFob s={1} /></div></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 110, borderRadius: "30px 30px 0 0", background: "linear-gradient(180deg,#3a3a3e,#1a1a1c)", transformOrigin: "50% 100%", transform: `perspective(700px) rotateX(${110 * op}deg)` }} />
      <div style={{ position: "absolute", left: 40, top: 210, width: 280, height: 22, borderRadius: 6, background: "repeating-linear-gradient(90deg,#8a8e95 0 20px,#5a5e64 20px 24px)" }} />
    </div></At>
    <At x={1360} y={520} s={sp(tt, 2.2)}><div style={{ display: "flex", gap: 14 }}>{dg.map((d, i) => <div key={i} style={{ width: 120, height: 180, borderRadius: 12, background: "linear-gradient(180deg,#2a2a2c 50%,#1a1a1c 50%)", boxShadow: "0 20px 30px rgba(0,0,0,.6), inset 0 0 0 3px #3a3a3e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 130, color: "#f3f0ea", fontVariantNumeric: "tabular-nums", position: "relative" }}>{d}<div style={{ position: "absolute", left: 0, right: 0, top: 89, height: 3, background: "#000" }} /></div>)}</div></At>
    <Tag tt={tt} at={5.2} x={1360} y={800} txt="50 YEARS. THEY KNOW." col={RED} size={54} />
  </>;
}}</Stage>;

// 10 · el rompecabezas: el correo, la credencial y el pase de estacionamiento son piezas; encajan de a una y arman la foto de la casa
export const HCabclues: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pcs = [{ l: "MAIL", dx: 0, dy: 0, fx: -600, fy: -200 }, { l: "WORK BADGE", dx: 1, dy: 0, fx: 500, fy: -300 }, { l: "PARKING PASS", dx: 0, dy: 1, fx: -500, fy: 300 }, { l: "", dx: 1, dy: 1, fx: 600, fy: 260 }];
  const S = 300;
  return <>
    {pcs.map((p, i) => { const e = eio(tt, 0.6 + i * 0.9, 1.4 + i * 0.9), x = 960 - S / 2 + p.dx * S - S / 2, y = 540 - S / 2 + p.dy * S - S / 2;
      return <div key={i} style={{ position: "absolute", left: x + p.fx * (1 - e), top: y + p.fy * (1 - e), width: S, height: S, transform: `rotate(${(1 - e) * (i % 2 ? 25 : -25)}deg)`, overflow: "hidden", boxShadow: e > 0.98 ? "none" : "0 20px 40px rgba(0,0,0,.6)", opacity: cl(e * 4) }}>
        <div style={{ position: "absolute", left: -p.dx * S, top: -p.dy * S, width: S * 2, height: S * 2, background: "linear-gradient(180deg,#2a3a5a,#121a2a 60%,#3a5a2a 60%)" }}>
          <div style={{ position: "absolute", left: 140, top: 220 }}><NHouse w={320} lit={0.8} /></div></div>
        {p.l && <div style={{ position: "absolute", left: 20, top: 20, padding: "8px 14px", borderRadius: 8, background: "#f3f0ea", color: "#1a1a1a", fontWeight: 900, fontSize: 24, opacity: 1 - eio(tt, 4.4, 5) }}>{p.l}</div>}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px rgba(0,0,0,.35)" }} />
      </div>; })}
    <Tag tt={tt} at={4.6} x={960} y={110} txt="WHERE YOU LIVE" col={RED} size={60} />
  </>;
}}</Stage>;

// 11 · el hábito: la bolsita cuelga del clavo junto a la puerta; cada noche se usa y la lengüeta de cuero se oscurece y brilla
export const HWornpath: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.min(30, Math.floor(eio(tt, 0.6, 5.2) * 30)), w = n / 30, cyc = (tt * 6) % 1, swing = 10 * Math.sin(cyc * Math.PI * 2) * (n < 30 ? 1 : 0);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(90deg,#3a3026,#2a221b)" }} />
    <div style={{ position: "absolute", left: 1180, top: 120, width: 420, height: 960, background: "linear-gradient(90deg,#5a3e28,#3a2818)", boxShadow: "inset 0 0 0 16px #2a1c10" }} />
    <At x={860} y={300} s={sp(tt, 0.2)}><div style={{ width: 24, height: 24, borderRadius: "50%", background: "#9a9ea4", boxShadow: "0 4px 6px rgba(0,0,0,.6)" }} /></At>
    <At x={860} y={560} s={sp(tt, 0.4) * 1.4} rot={swing}><div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 80, top: -150, width: 40, height: 160, borderRadius: 20, background: `linear-gradient(180deg, rgb(${200 - 110 * w},${150 - 90 * w},${100 - 60 * w}), rgb(${150 - 90 * w},${100 - 60 * w},${60 - 30 * w}))`, boxShadow: `inset 6px 0 ${10 * w}px rgba(255,255,255,${0.35 * w})` }} />
      <Bag s={1} /></div></At>
    <At x={420} y={540} s={sp(tt, 0.8)}><div style={{ fontWeight: 900, fontSize: 110, color: AMB, fontVariantNumeric: "tabular-nums" }}>NIGHT {n}</div></At>
    <Tag tt={tt} at={5.4} x={420} y={700} txt="A HABIT" col={TX} size={56} />
  </>;
}}</Stage>;

// 12 · las buenas noches: tres cosas se cuelgan de a una junto a la puerta (llave en la bolsita, barra amarilla, repuesto sin pila) y la tecla de la luz baja
export const HGoodnight30: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const e = (i: number) => sp(tt, 0.8 + i * 1.3), off = eio(tt, 5, 5.3);
  return <>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#4a3c2e,#2e241a)" }} />
    <div style={{ position: "absolute", left: 220, top: 340, width: 1240, height: 34, borderRadius: 6, background: "linear-gradient(180deg,#8a6a48,#5a4128)", boxShadow: "0 12px 20px rgba(0,0,0,.5)" }} />
    <At x={420} y={560 - 300 * (1 - e(0))} s={e(0)} o={cl(e(0) * 2)}><Bag s={0.9} /></At>
    <At x={840} y={520 - 300 * (1 - e(1))} s={e(1) * 0.5} o={cl(e(1) * 2)} rot={-90}><div style={{ width: 620, height: 90, borderRadius: 24, background: `linear-gradient(180deg,#ffe58a,${YEL} 40%,#c79a08)`, boxShadow: `0 0 40px rgba(255,210,58,.5)` }} /></At>
    <At x={1240} y={540 - 300 * (1 - e(2))} s={e(2) * 0.8} o={cl(e(2) * 2)}><div style={{ position: "relative" }}><KFob s={1} /><div style={{ position: "absolute", left: 130, top: 60, width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e9eaec, #8a8e95)", transform: `translateX(${60 * e(2)}px)` }} /></div></At>
    <At x={1640} y={560} s={sp(tt, 0.4)}><div style={{ width: 120, height: 190, borderRadius: 12, background: "#efe9dc", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}><div style={{ margin: "40px auto 0", width: 44, height: 110, borderRadius: 8, background: "#d8d0bf", position: "relative" }}><div style={{ position: "absolute", left: 4, top: off > 0.5 ? 60 : 6, width: 36, height: 44, borderRadius: 6, background: "#fff", boxShadow: "0 3px 4px rgba(0,0,0,.3)" }} /></div></div></At>
    <div style={{ position: "absolute", inset: 0, background: "#04050a", opacity: 0.55 * off }} />
    <Tag tt={tt} at={5.6} x={960} y={880} txt="30 SECONDS. GOOD NIGHT." col={AMB} size={54} />
  </>;
}}</Stage>;

export const HEROES_R: Record<string, React.FC<P>> = {
  lantern: HLantern, oilspot: HOilspot, abacus: HAbacus, dollhouse: HDollhouse, doubler: HDoubler, twofobs: HTwofobs,
  truckkey: HTruckkey, recital: HRecital, magnet50: HMagnet50, cabclues: HCabclues, wornpath: HWornpath, goodnight30: HGoodnight30,
};
