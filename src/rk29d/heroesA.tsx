// rk29d · componentes únicos 1-23 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
// La camioneta que se va de noche: la cinta que mide del gancho a la puerta, la mancha de aceite, el visor con la nota, el ojo de la cámara…
import React from "react";
import { H, Stage, Tag, phys, cl, eio, TX } from "./hkit";
import { AMB, RED, ICE, GRN, rnd, At, Pickup, KFob, NHouse, NightSky, Lamp } from "./truckdraw";

type P = { t: number; h: H };
const sp = (tt: number, a: number) => cl(phys(tt, a));

// 3 · marca por marca: seis parrillas en fila, cada una baja de a una con su nombre y queda una ficha de «la tuya»
export const HBadgerow: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const names = ["FORD", "CHEVY", "GMC", "RAM", "TOYOTA", "NISSAN · HONDA"];
  return <>{names.map((n, i) => {
    const s = sp(tt, 0.4 + i * 0.55), x = 260 + i * 280;
    return <At key={n} x={x} y={520 + (1 - s) * -200} o={cl(s * 1.5)}><div style={{ width: 230, height: 300, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 230, height: 190, borderRadius: 24, background: `linear-gradient(180deg, ${["#3a3e46", "#2e3138", "#3a3330", "#2b2f2a", "#3a3036", "#30343c"][i]}, #0f1013)`, boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.18)" }}>
        {[0, 1, 2, 3].map((r) => <div key={r} style={{ position: "absolute", left: 22, right: 22, top: 26 + r * 36, height: 18, borderRadius: 4, background: "linear-gradient(180deg,#c9ccd1,#5d6168)" }} />)}
        {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", top: 70, [d < 0 ? "left" : "right"]: -10, width: 30, height: 30, borderRadius: 8, background: "#fff3cc", boxShadow: "0 0 20px rgba(255,240,200,.7)" } as React.CSSProperties} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 214, textAlign: "center", fontWeight: 900, fontSize: i === 5 ? 28 : 40, color: i >= 5 ? RED : TX, letterSpacing: 2 }}>{n}</div>
    </div></At>;
  })}
    <Tag tt={tt} at={4.2} x={960} y={860} txt="FIND YOURS" col={AMB} size={64} />
  </>;
}}</Stage>;

// 4 · la cámara de Dale: el aparatito en la esquina del garage con su cono de visión, y la barra de grabación que corre hasta las 2:14
export const HDalecam: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sweep = 14 * Math.sin(tt * 0.6), scrub = eio(tt, 1.6, 6.5), mins = Math.round(scrub * 134);
  return <>
    <NightSky tt={tt} moon={false} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 1080, background: "linear-gradient(90deg,#2a2622,#3a342d)" }} />
    <At x={470} y={220} s={sp(tt, 0.2)} rot={sweep}><div style={{ width: 150, height: 80, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(180deg,#f2f2f0,#b9bbbd)" }} />
      <div style={{ position: "absolute", right: -16, top: 16, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #4b6a9a, #05070c 60%)", boxShadow: "0 0 0 6px #222" }} />
      <div style={{ position: "absolute", left: 16, top: 14, width: 12, height: 12, borderRadius: "50%", background: RED, opacity: 0.4 + 0.6 * (Math.floor(tt * 1.5) % 2) }} /></div></At>
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}><path d={`M540 230 L1900 ${180 + sweep * 8} L1900 ${940 + sweep * 8} Z`} fill={`rgba(170,210,255,${0.09 * sp(tt, 0.6)})`} stroke="rgba(170,210,255,.35)" strokeWidth="2" /></svg>
    <At x={1300} y={720} s={sp(tt, 0.8)}><Pickup w={700} col="#3a4a5c" /></At>
    <At x={1150} y={940} s={sp(tt, 1.2)}><div style={{ width: 1000, height: 54, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 22, width: 1000, height: 10, borderRadius: 5, background: "rgba(255,255,255,.18)" }} />
      <div style={{ position: "absolute", left: 1000 * scrub - 14, top: 13, width: 28, height: 28, borderRadius: "50%", background: RED, boxShadow: `0 0 20px ${RED}` }} /></div></At>
    <At x={1150} y={860} s={sp(tt, 1.4)}><div style={{ fontWeight: 900, fontSize: 70, fontVariantNumeric: "tabular-nums", color: TX }}>{`${Math.floor(mins / 60) + 0}:${String(mins % 60).padStart(2, "0")} AM`}</div></At>
  </>;
}}</Stage>;

// 5 · sale con las luces apagadas: la camioneta retrocede por la entrada en la oscuridad, la casa sigue dormida
export const HLightsoff: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="#05070d">{(tt) => {
  const m = eio(tt, 0.8, 6.5);
  return <>
    <NightSky tt={tt} />
    <At x={560} y={560} s={sp(tt, 0.1)}><NHouse w={720} lit={0} /></At>
    <At x={1500} y={330} s={sp(tt, 0.2)}><Lamp h={640} on={0.7} /></At>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "linear-gradient(180deg,#1c1e22,#0a0b0d)" }} />
    <At x={1060 + 760 * m} y={800} s={sp(tt, 0.4) * (1 - 0.2 * m)}><Pickup w={620} col="#3b3f46" lights={0} wheelRot={-m * 720} /></At>
    <Tag tt={tt} at={2.6} x={1300} y={180} txt="NO LIGHTS. NO SOUND." col={ICE} size={52} />
  </>;
}}</Stage>;

// 6 · la nota del visor: baja el parasol y se desliza el papelito escrito a mano, flota hacia la cámara y se queda
export const HGlovebox: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const v = eio(tt, 0.6, 1.8), n = eio(tt, 1.8, 4.2);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 300, background: "linear-gradient(180deg,#2b2a28,#1a1918)" }} />
    <div style={{ position: "absolute", left: 300, top: 280, width: 1320, height: 620, borderRadius: "40px 40px 0 0", background: "linear-gradient(180deg,#5a7590,#1d2633)", opacity: 0.55 }} />
    <At x={760} y={300 + 120 * v} s={sp(tt, 0.2)}><div style={{ width: 620, height: 240, borderRadius: 20, background: "linear-gradient(180deg,#8b8478,#5b554c)", transformOrigin: "50% 0", transform: `perspective(800px) rotateX(${80 - 80 * v}deg)`, boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, top: 30, width: 200, height: 140, borderRadius: 10, background: "#3c3a36", boxShadow: "inset 0 0 0 3px #222" }} /></div></At>
    <At x={760 + 300 * n} y={420 + 140 * n} s={(0.5 + 0.8 * n) * sp(tt, 1.8)} rot={-8 + 14 * n + 3 * Math.sin(tt * 1.4)} o={cl(n * 3)}><div style={{ width: 300, height: 380, background: "linear-gradient(180deg,#fbf6e8,#e9dfc6)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", padding: "34px 30px", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 38px, rgba(90,140,200,.35) 38px 40px)" }}>
      <svg width="240" height="300" viewBox="0 0 240 300">{[40, 78, 116, 154, 192].map((y, i) => <path key={i} d={`M10 ${y} q ${20 + rnd(i) * 10} -14 ${40 + rnd(i + 1) * 30} 0 t ${50 + rnd(i + 2) * 40} 0 t ${30 + rnd(i + 3) * 40} 0`} stroke="#2c3a5c" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="400" strokeDashoffset={400 * (1 - cl((tt - 2.4 - i * 0.3) / 0.8))} />)}</svg></div></At>
    <Tag tt={tt} at={4.6} x={1340} y={160} txt="WHAT YOU DON'T GET BACK" col={AMB} size={46} />
  </>;
}}</Stage>;

// 7 · las piezas valen: la camioneta se abre en vista explotada; portón, rines, faros, pantalla se separan flotando
export const HPartsburst: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const e = eio(tt, 1.4, 3.6);
  const parts = [
    { x: -420, y: -40, el: <div style={{ width: 120, height: 150, borderRadius: 10, background: "linear-gradient(180deg,#8a2f2a,#3a1412)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.12)" }} />, l: "TAILGATE" },
    { x: -260, y: 300, el: <div style={{ width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle,#b9bdc2 30%,#121212 34%)" }} />, l: "WHEELS" },
    { x: 380, y: -60, el: <div style={{ width: 90, height: 60, borderRadius: 12, background: "#fff3cc", boxShadow: "0 0 30px rgba(255,240,200,.8)" }} />, l: "HEADLIGHTS" },
    { x: 60, y: -300, el: <div style={{ width: 180, height: 110, borderRadius: 10, background: "linear-gradient(160deg,#2a3a52,#0b1018)", boxShadow: "inset 0 0 0 4px #333" }} />, l: "SCREEN" },
    { x: 260, y: 300, el: <div style={{ width: 160, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#d0d3d8,#6a6e75)" }} />, l: "CONVERTER" },
  ];
  return <>
    <At x={960} y={560} s={sp(tt, 0.2)} o={1 - 0.55 * e}><Pickup w={760} col="#7b2c27" /></At>
    {parts.map((p, i) => { const s = sp(tt, 1.4 + i * 0.25); return <At key={i} x={960 + p.x * e} y={560 + p.y * e} s={0.6 + 0.6 * s} rot={(1 - s) * 30}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>{p.el}<div style={{ fontWeight: 900, fontSize: 30, color: AMB, letterSpacing: 2, opacity: cl((tt - 2.4 - i * 0.25) * 2) }}>{p.l}</div></div></At>; })}
    <Tag tt={tt} at={4.8} x={960} y={110} txt="WORTH MORE IN PIECES" col={TX} size={54} />
  </>;
}}</Stage>;

// 8 · arriba de la lista: los techos del barrio se achican y la camioneta sube sola a la cima de una pila de vehículos
export const HCart: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 1.6, 3.8);
  const stack = ["#4b5560", "#6a5a48", "#3a4a3e", "#5a3e4a"];
  return <>
    {stack.map((c, i) => <At key={i} x={960 + (i % 2 ? 40 : -40)} y={900 - i * 120} s={0.85 * sp(tt, 0.2 + i * 0.2)}><div style={{ width: 520, height: 110, borderRadius: 22, background: `linear-gradient(180deg, ${c}, #121315)`, boxShadow: "0 20px 30px rgba(0,0,0,.55)", position: "relative" }}>
      {[0.2, 0.8].map((x, j) => <div key={j} style={{ position: "absolute", left: `${x * 100}%`, bottom: -20, width: 56, height: 56, borderRadius: "50%", background: "#111", transform: "translateX(-50%)" }} />)}
      <div style={{ position: "absolute", left: 140, top: 14, width: 220, height: 44, borderRadius: 10, background: "rgba(90,117,144,.6)" }} /></div></At>)}
    <At x={960} y={900 - 4 * 120 - 360 * r + 360} s={sp(tt, 1.4)}><Pickup w={600} col="#8a2f2a" /></At>
    <At x={960} y={170} s={sp(tt, 3.6)}><div style={{ width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderTop: `60px solid ${RED}`, filter: `drop-shadow(0 0 20px ${RED})`, transform: `translateY(${8 * Math.sin(tt * 3)}px)` }} /></At>
    <Tag tt={tt} at={3.9} x={1500} y={300} txt="BEFORE THE HOUSE" col={AMB} size={52} />
  </>;
}}</Stage>;

// 9 · se destraba: corte de la puerta por dentro; la varilla sube, el seguro asoma en la ventanilla
export const HPinpop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const u = cl(phys(tt, 2.2, 9, 0.35));
  return <>
    <At x={960} y={560} s={sp(tt, 0.2)}><div style={{ width: 900, height: 640, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 260, borderRadius: "30px 120px 0 0", background: "linear-gradient(160deg,#5a7590,#1a2330)", boxShadow: "inset 0 0 0 10px #2a2d33" }} />
      <div style={{ position: "absolute", left: 0, top: 250, width: 900, height: 390, borderRadius: "0 0 30px 30px", background: "linear-gradient(180deg,#3a3f46,#1a1c20)", boxShadow: "0 50px 70px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 60, top: 40, width: 780, height: 300, borderRadius: 20, background: "#101114", boxShadow: "inset 0 0 40px rgba(0,0,0,.9)" }} />
        <div style={{ position: "absolute", left: 640, top: 60 - 60 * u, width: 14, height: 260, borderRadius: 7, background: "linear-gradient(90deg,#d8dbe0,#7a7e85)" }} />
        <div style={{ position: "absolute", left: 600, top: 300 - 30 * u, width: 140, height: 50, borderRadius: 10, background: "linear-gradient(180deg,#8a8e95,#3a3c40)", transform: `rotate(${-18 * u}deg)` }} />
        <div style={{ position: "absolute", left: 200, top: 140, width: 300, height: 40, borderRadius: 20, background: "linear-gradient(90deg,#2d3036,#4a4e55)" }} />
      </div>
      <div style={{ position: "absolute", left: 636, top: 214 - 46 * u, width: 22, height: 50, borderRadius: "11px 11px 4px 4px", background: "linear-gradient(90deg,#e9e9e9,#9a9a9a)", boxShadow: u > 0.5 ? `0 0 ${26 * u}px ${ICE}` : "none" }} />
    </div></At>
    <Tag tt={tt} at={2.6} x={960} y={130} txt="CLICK. OPEN." col={RED} size={64} />
  </>;
}}</Stage>;

// 13 · el sensor de movimiento: la llave en corte; la bolita rueda mientras se mueve, se queda quieta y el ojito se apaga
export const HBallsensor: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const still = tt > 4.2, b = still ? 0.5 + 0.5 * Math.sin(4.2 * 4) * Math.exp(-(tt - 4.2) * 3) : 0.5 + 0.5 * Math.sin(tt * 4), awake = still ? cl(1 - (tt - 5.2) / 0.6) : 1;
  return <>
    <At x={960 + (still ? 0 : 30 * Math.sin(tt * 4))} y={560} s={sp(tt, 0.2) * 2.2} rot={still ? 0 : 8 * Math.sin(tt * 4)}><KFob s={1.4} cut={eio(tt, 0.8, 1.6)} ball={b} awake={awake} /></At>
    <Tag tt={tt} at={1.8} x={1460} y={360} txt="IT FEELS MOTION" col={ICE} size={46} />
    <Tag tt={tt} at={5.4} x={1460} y={720} txt="STILL = ASLEEP" col={GRN} size={50} />
  </>;
}}</Stage>;

// 15 · el código impreso: la tarjetita sale de la guantera y los cinco botones del teclado del parante se encienden en orden
export const HCodecard: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = eio(tt, 0.6, 2), seq = [2, 4, 1, 3, 5];
  return <>
    <At x={620} y={560 - 120 * c} s={sp(tt, 0.4)} rot={-6 + 6 * c}><div style={{ width: 420, height: 260, borderRadius: 14, background: "linear-gradient(180deg,#f4f1ea,#d9d3c6)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", padding: 30, boxSizing: "border-box" }}>
      <div style={{ height: 14, width: 260, background: "#b9b3a6", borderRadius: 7 }} /><div style={{ height: 14, width: 180, background: "#b9b3a6", borderRadius: 7, marginTop: 14 }} />
      <div style={{ marginTop: 40, fontWeight: 900, fontSize: 74, letterSpacing: 18, color: "#1c1c1c", fontVariantNumeric: "tabular-nums" }}>• • • • •</div></div></At>
    <At x={1340} y={540} s={sp(tt, 1.2)}><div style={{ width: 200, height: 640, borderRadius: 30, background: "linear-gradient(180deg,#24272d,#0d0e10)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", position: "relative" }}>
      {[1, 2, 3, 4, 5].map((n, i) => { const on = seq.findIndex((v) => v === n), lit = tt > 2.6 + on * 0.5 ? 1 : 0; return <div key={n} style={{ position: "absolute", left: 40, top: 50 + i * 112, width: 120, height: 80, borderRadius: 14, background: lit ? "rgba(255,178,87,.9)" : "#1a1c20", boxShadow: lit ? `0 0 30px ${AMB}` : "inset 0 0 0 2px #333", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 40, color: lit ? "#1a1208" : "#666" }}>{`${n * 2 - 1}·${n * 2}`}</div>; })}
    </div></At>
    <Tag tt={tt} at={5.6} x={960} y={130} txt="IN THE GLOVE BOX" col={RED} size={56} />
  </>;
}}</Stage>;

// 16 · el menú: la pantalla del tablero y las ventanas una adentro de otra, la cámara se zambulle hasta el interruptor del fondo
export const HMenudive: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const z = eio(tt, 0.8, 5.6) * 3, labels = ["SETTINGS", "VEHICLE", "LOCKS", "PASSIVE UNLOCK"];
  return <>{labels.map((l, i) => {
    const d = i - z, s = Math.pow(1.9, -d), o = d < -0.6 ? 0 : cl(1 - Math.abs(d + 0.2) * 0.4) + (i === 3 ? 0.3 : 0);
    return <At key={l} x={960} y={540} s={s} o={cl(o)}><div style={{ width: 900, height: 520, borderRadius: 30, background: "linear-gradient(160deg,#1b2a3e,#070b12)", boxShadow: `0 0 0 4px rgba(143,214,255,${0.35 + 0.3 * (i === 3 ? 1 : 0)}), 0 40px 80px rgba(0,0,0,.6)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ fontWeight: 900, fontSize: 70, color: i === 3 ? AMB : ICE, letterSpacing: 4 }}>{l}</div>
      {i === 3 && <div style={{ width: 220, height: 100, borderRadius: 50, background: tt > 6.2 ? "#3a3d44" : "#2f7a4a", position: "relative", transition: "none" }}><div style={{ position: "absolute", top: 10, left: tt > 6.2 ? 10 : 130, width: 80, height: 80, borderRadius: "50%", background: "#f2f2f2" }} /></div>}
    </div></At>;
  })}</>;
}}</Stage>;

// 17 · una sola presión: el pulgar baja sobre el botón de la llave y el contador marca 1, al lado de 30 años de hacerlo así
export const HOnecoin: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pr = tt > 1.6 && tt < 2.2 ? 1 : 0;
  return <>
    <At x={760} y={560} s={sp(tt, 0.2) * 2}><KFob s={1} press={pr} awake={pr} /></At>
    <At x={760} y={300 + (pr ? 40 : 0) - 60 * cl(1 - (tt - 0.4))} s={sp(tt, 0.6)}><div style={{ width: 120, height: 170, borderRadius: "60px 60px 40px 40px", background: "linear-gradient(180deg,#d9a882,#a8775a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} /></At>
    <At x={1340} y={480} s={sp(tt, 2)}><div style={{ fontWeight: 900, fontSize: 260, color: AMB, lineHeight: 1, textShadow: "0 20px 50px rgba(0,0,0,.6)" }}>1</div></At>
    <Tag tt={tt} at={2.6} x={1340} y={700} txt="PRESS, LIKE 30 YEARS" col={TX} size={46} />
  </>;
}}</Stage>;

// 18 · dos perfiles: dos asientos en la cabina; el de él apagado, el de ella con el destrabe todavía prendido
export const HTwoseats: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const seat = (x: number, on: number, lab: string, at: number) => <At x={x} y={600} s={sp(tt, at)}><div style={{ width: 380, height: 520, position: "relative" }}>
    <div style={{ position: "absolute", left: 40, top: 0, width: 300, height: 340, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(180deg,#4a4038,#2a241e)", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 0 6px rgba(255,255,255,.04)" }} />
    <div style={{ position: "absolute", left: 0, top: 330, width: 380, height: 150, borderRadius: 30, background: "linear-gradient(180deg,#3a322a,#1c1814)" }} />
    <div style={{ position: "absolute", left: 140, top: 60, width: 100, height: 100, borderRadius: "50%", background: on ? "rgba(255,90,74,.9)" : "rgba(111,227,154,.85)", boxShadow: `0 0 40px ${on ? RED : GRN}` }}>
      <div style={{ position: "absolute", left: 32, top: 18, width: 36, height: 36, borderRadius: "50%", background: "#1a1a1a" }} /><div style={{ position: "absolute", left: 18, top: 58, width: 64, height: 30, borderRadius: "30px 30px 6px 6px", background: "#1a1a1a" }} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontWeight: 900, fontSize: 40, color: on ? RED : GRN }}>{lab}</div>
  </div></At>;
  return <>{seat(700, 0, "HIS: OFF", 0.3)}{seat(1220, 1, "HERS: STILL ON", 1.4)}<Tag tt={tt} at={3} x={960} y={140} txt="EACH DRIVER, ITS OWN" col={AMB} size={52} /></>;
}}</Stage>;

// 19 · las herramientas del asiento de atrás: las cajas salen volando de la cabina; la camioneta queda trabada detrás del tractor
export const HToolstack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fl = eio(tt, 1.6, 3.6), n = Math.round(4000 * fl);
  return <>
    <At x={760} y={680} s={sp(tt, 0.2)}><Pickup w={720} col="#3a4a5c" door={eio(tt, 1, 1.6)} /></At>
    <At x={1460} y={640} s={sp(tt, 0.6)}><div style={{ width: 420, height: 360, position: "relative" }}>
      <div style={{ position: "absolute", left: 40, top: 60, width: 300, height: 200, borderRadius: 18, background: "linear-gradient(180deg,#2f7a3a,#14361a)" }} />
      <div style={{ position: "absolute", left: 0, top: 160, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,#c9a24a 20%,#111 24%)" }} />
      <div style={{ position: "absolute", right: 0, top: 230, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle,#c9a24a 20%,#111 24%)" }} /></div></At>
    {[0, 1, 2, 3].map((i) => <At key={i} x={900 + 300 * fl + i * 40} y={600 - 360 * fl + i * 70 * fl} rot={20 * fl * (i % 2 ? 1 : -1)} o={cl(fl * 3)}><div style={{ width: 120, height: 70, borderRadius: 10, background: ["#c8322a", "#d8a21a", "#2a5aa8", "#c8322a"][i], boxShadow: "0 14px 20px rgba(0,0,0,.5), inset 0 -10px 0 rgba(0,0,0,.25)" }} /></At>)}
    <At x={760} y={210} s={sp(tt, 2)}><div style={{ fontWeight: 900, fontSize: 110, color: RED, fontVariantNumeric: "tabular-nums" }}>${n.toLocaleString("en-US")}</div></At>
    <Tag tt={tt} at={4.4} x={1460} y={360} txt="BLOCKED IN = STILL THERE" col={GRN} size={40} />
  </>;
}}</Stage>;

// 20 · la alarma: cuando fuerzan la puerta, ondas rojas y bocina; cuando abre la llave, silencio total
export const HSirentwo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ring = (tt * 1.2) % 1;
  return <>
    <At x={520} y={600} s={sp(tt, 0.2)}><Pickup w={600} col="#4a4f58" tail={tt > 1 ? 0.5 + 0.5 * Math.round(0.5 + 0.5 * Math.sin(tt * 6)) : 0} /></At>
    {tt > 1 && [0, 0.33, 0.66].map((o, i) => { const r = (ring + o) % 1; return <At key={i} x={520} y={560}><div style={{ width: 300 + 600 * r, height: 300 + 600 * r, borderRadius: "50%", border: `6px solid rgba(255,90,74,${0.7 * (1 - r)})` }} /></At>; })}
    <Tag tt={tt} at={1.2} x={520} y={180} txt="FORCED: SCREAMS" col={RED} size={50} />
    <div style={{ position: "absolute", left: 958, top: 120, width: 4, height: 840, background: "rgba(255,255,255,.15)" }} />
    <At x={1420} y={600} s={sp(tt, 1.6)}><Pickup w={600} col="#4a4f58" door={eio(tt, 2.6, 3.4)} /></At>
    <At x={1220} y={520} s={sp(tt, 2)}><KFob s={0.5} awake={1} /></At>
    <Tag tt={tt} at={3.6} x={1420} y={180} txt="KEY: NOT A SOUND" col={ICE} size={50} />
  </>;
}}</Stage>;

// 21 · el manual en la tormenta: nieve contra la ventana, el libro abierto en la mesa pasa páginas hasta la que importa
export const HSnowmanual: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flip = Math.min(5, Math.floor(eio(tt, 1, 4.4) * 5.99)), f = (eio(tt, 1, 4.4) * 5.99) % 1;
  return <>
    <div style={{ position: "absolute", left: 360, top: 90, width: 1200, height: 520, borderRadius: 10, background: "linear-gradient(180deg,#2a3546,#0f141c)", boxShadow: "inset 0 0 0 16px #3a2e22" }}>
      {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: 16 + ((rnd(i) * 1170 + tt * 30 * (0.5 + rnd(i + 5))) % 1170), top: 16 + ((rnd(i + 20) * 490 + tt * 70 * (0.6 + rnd(i + 8))) % 490), width: 5 + rnd(i) * 6, height: 5 + rnd(i) * 6, borderRadius: "50%", background: "#eef4fb", opacity: 0.8 }} />)}
    </div>
    <At x={960} y={790} s={sp(tt, 0.4)}><div style={{ width: 860, height: 380, position: "relative", perspective: 1400 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 430, height: 380, background: "linear-gradient(90deg,#efe9dc,#d8d0bf)", borderRadius: "10px 0 0 10px", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 430, top: 0, width: 430, height: 380, background: "linear-gradient(90deg,#d8d0bf,#efe9dc)", borderRadius: "0 10px 10px 0", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
        {flip >= 5 && <div style={{ position: "absolute", left: 50, top: 70, width: 330, fontWeight: 900, fontSize: 36, color: "#2a2a2a", lineHeight: 1.3 }}>LOCK<br />PRESS TWICE<div style={{ display: "flex", gap: 20, marginTop: 24 }}>{[0, 1].map((i) => <div key={i} style={{ width: 60, height: 60, borderRadius: 14, background: "#222", boxShadow: tt > 5 + i * 0.4 ? `0 0 24px ${AMB}` : "none" }} />)}</div></div>}
      </div>
      {flip < 5 && <div style={{ position: "absolute", left: 430, top: 0, width: 430, height: 380, background: "linear-gradient(90deg,#e6dfd0,#f6f1e6)", transformOrigin: "0 50%", transform: `rotateY(${-180 * f}deg)`, borderRadius: "0 10px 10px 0" }} />}
    </div></At>
    <Tag tt={tt} at={5.4} x={960} y={1010} txt="NOTHING ELSE TO READ" col={ICE} size={40} />
  </>;
}}</Stage>;

// 22 · la de enfrente: dos casas cara a cara con dos camionetas iguales; un mes de febrero pasa en el almanaque y una entrada queda vacía
export const HNeighbortrucks: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const day = Math.min(28, Math.floor(eio(tt, 0.8, 4) * 28) + 1), gone = tt > 3.4 ? eio(tt, 3.4, 4.6) : 0;
  return <>
    <NightSky tt={tt} />
    <At x={460} y={520} s={sp(tt, 0.2) * 0.8}><NHouse w={600} lit={0.4} /></At>
    <At x={1460} y={520} s={sp(tt, 0.4) * 0.8}><NHouse w={600} lit={0.4} col="#3e4650" /></At>
    <At x={500} y={850} s={sp(tt, 0.6)}><Pickup w={440} col="#6a6e60" /></At>
    <At x={1420 + 500 * gone} y={850} s={sp(tt, 0.8)} o={1 - gone}><Pickup w={440} col="#6a6e60" flip /></At>
    {gone > 0 && <At x={1420} y={850}><div style={{ width: 440, height: 185, borderRadius: 30, border: "4px dashed rgba(255,255,255,.4)", opacity: gone }} /></At>}
    <At x={960} y={280} s={sp(tt, 0.6)}><div style={{ width: 220, height: 240, borderRadius: 14, background: "#f3f0ea", boxShadow: "0 20px 40px rgba(0,0,0,.6)", overflow: "hidden", textAlign: "center" }}>
      <div style={{ height: 60, background: RED, color: "#fff", fontWeight: 900, fontSize: 32, lineHeight: "60px" }}>FEB</div>
      <div style={{ fontWeight: 900, fontSize: 120, color: "#1a1a1a", fontVariantNumeric: "tabular-nums" }}>{day}</div></div></At>
    <Tag tt={tt} at={4.8} x={960} y={1010} txt="SAME TRUCK. NOT HIS." col={AMB} size={46} />
  </>;
}}</Stage>;

export const HEROES_A: Record<string, React.FC<P>> = {
  badgerow: HBadgerow, dalecam: HDalecam, lightsoff: HLightsoff, glovebox: HGlovebox,
  partsburst: HPartsburst, cart: HCart, pinpop: HPinpop, 
  ballsensor: HBallsensor, codecard: HCodecard, menudive: HMenudive, onecoin: HOnecoin, twoseats: HTwoseats,
  toolstack: HToolstack, sirentwo: HSirentwo, snowmanual: HSnowmanual, neighbortrucks: HNeighbortrucks, 
};
