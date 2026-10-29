// rk29d · componentes únicos 24-45 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
// La bolsita que se gasta en el doblez, la camioneta que es la llave de la casa, la barra amarilla que hace saltear, el escenario de luz…
import React from "react";
import { H, Stage, Tag, phys, cl, eio, TX } from "./hkit";
import { AMB, RED, ICE, GRN, YEL, rnd, At, Pickup, PickupTop, KFob, Wheel, Man, Bag } from "./truckdraw";

type P = { t: number; h: H };
const sp = (tt: number, a: number) => cl(phys(tt, a));

// 24 · mala y buena: una ficha gruesa gira en el aire; de un lado la cara roja, del otro la verde
export const HBadgood: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = 180 * eio(tt, 2.4, 3.6), back = r > 90;
  return <>
    <At x={960} y={540} s={sp(tt, 0.2)}><div style={{ width: 520, height: 520, borderRadius: "50%", transform: `perspective(1200px) rotateY(${r}deg)`, background: back ? "radial-gradient(circle at 40% 35%, #8af0b4, #1f6a3c)" : "radial-gradient(circle at 40% 35%, #ff8a7a, #7a1a12)", boxShadow: "0 50px 80px rgba(0,0,0,.6), inset 0 0 0 18px rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 90, color: "#fff", transform: back ? "scaleX(-1)" : undefined, letterSpacing: 4 }}>{back ? "GOOD" : "BAD"}</div></div></At>
    <Tag tt={tt} at={1} x={960} y={110} txt="NISSAN AND HONDA" col={TX} size={50} />
  </>;
}}</Stage>;

// 25 · el doblez: la bolsita se abre y cierra una y otra vez; en la línea del pliegue la tela se gasta y empieza a escapar luz
export const HCreasecrack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.floor(tt / 0.7), op = 0.5 - 0.5 * Math.cos(tt / 0.7 * Math.PI * 2), wear = cl(tt / 5);
  return <>
    <At x={960} y={560} s={sp(tt, 0.2) * 2}><Bag s={1} open={op * (tt < 5 ? 1 : 0)} crease={wear} leak={cl((tt - 4) / 1.5)} /></At>
    <At x={1460} y={300} s={sp(tt, 0.6)}><div style={{ fontWeight: 900, fontSize: 90, color: AMB, fontVariantNumeric: "tabular-nums" }}>{Math.min(n * 40, 400)}×</div></At>
    <Tag tt={tt} at={4.6} x={960} y={980} txt="WEARS OUT AT THE FOLD" col={RED} size={50} />
  </>;
}}</Stage>;

// 29 · la tapita del puerto: debajo del tablero, el enchufe del mecánico; la tapa de acero baja y traba
export const HPlugcap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = cl(phys(tt, 2, 8, 0.4));
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 420, background: "linear-gradient(180deg,#2a2b2e,#141416)", borderRadius: "0 0 120px 120px" }} />
    <At x={960} y={560} s={sp(tt, 0.3) * 1.6}><div style={{ width: 300, height: 140, borderRadius: "20px 20px 60px 60px", background: "linear-gradient(180deg,#1a1a1c,#08080a)", boxShadow: "0 20px 30px rgba(0,0,0,.6)", position: "relative" }}>
      {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i % 8) * 31, top: 36 + Math.floor(i / 8) * 40, width: 14, height: 22, borderRadius: 3, background: "#6a6a62" }} />)}</div></At>
    <At x={960} y={560 - 420 * (1 - c)} s={1.6}><div style={{ width: 330, height: 170, borderRadius: "24px 24px 66px 66px", background: "linear-gradient(160deg,#e3e6ea,#7d828a)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", opacity: cl(tt - 1.4) }}>
      <div style={{ position: "absolute", left: 140, top: 60, width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2a 40%,#9a9ea4 44%)" }} /></div></At>
    <Tag tt={tt} at={3} x={960} y={900} txt="COVERED AND LOCKED" col={AMB} size={54} />
  </>;
}}</Stage>;

// 30 · dos interruptores en serie: el motor necesita los dos; uno escondido corta la corriente aunque el otro esté prendido
export const HSeries: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s2 = tt > 3.2 ? 0 : 1, flow = s2 ? (tt * 400) % 1600 : 0;
  const sw = (x: number, on: number, lab: string, at: number) => <At x={x} y={540} s={sp(tt, at)}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
    <div style={{ width: 160, height: 220, borderRadius: 20, background: "linear-gradient(180deg,#e9e6df,#a7a299)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", position: "relative" }}><div style={{ position: "absolute", left: 50, top: on ? 30 : 110, width: 60, height: 80, borderRadius: 10, background: on ? GRN : "#5a5a5a" }} /></div>
    <div style={{ fontWeight: 900, fontSize: 34, color: TX }}>{lab}</div></div></At>;
  return <>
    <div style={{ position: "absolute", left: 200, top: 530, width: 1520, height: 14, borderRadius: 7, background: "#3a3d44" }} />
    {s2 > 0 && <div style={{ position: "absolute", left: 200 + Math.min(flow, 1300), top: 524, width: 120, height: 26, borderRadius: 13, background: `linear-gradient(90deg, transparent, ${AMB})` }} />}
    {sw(620, 1, "KEY", 0.2)}{sw(1080, s2, "HIDDEN", 0.8)}
    <At x={1580} y={540} s={sp(tt, 1.2)}><div style={{ width: 200, height: 200, borderRadius: "50%", background: s2 ? "radial-gradient(circle,#ffd27a,#9c6a20)" : "radial-gradient(circle,#3a3a3a,#1a1a1a)", boxShadow: s2 ? `0 0 60px ${AMB}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, color: s2 ? "#2a1a08" : "#777" }}>ENGINE</div></At>
    <Tag tt={tt} at={3.6} x={960} y={200} txt="BOTH, OR NOTHING" col={RED} size={56} />
  </>;
}}</Stage>;

// 31 · al acero no le importa: la señal de la computadora rebota contra la barra amarilla del volante
export const HSteelchip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = (tt * 0.9) % 1, x = 1700 - 900 * Math.min(1, p * 1.6), back = p > 0.62;
  return <>
    <At x={760} y={560} s={sp(tt, 0.2) * 1.5}><Wheel s={1} bar={eio(tt, 0.6, 1.6)} /></At>
    {tt > 1.8 && <At x={back ? 800 + 900 * (p - 0.62) * 2.6 : x} y={480 + (back ? -200 * (p - 0.62) * 2.6 : 0)} rot={tt * 90}><div style={{ width: 90, height: 90, borderRadius: 10, background: "linear-gradient(160deg,#2a5a3a,#0e2416)", boxShadow: `0 0 0 4px ${GRN}, 0 0 30px ${GRN}` }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 18 + i * 22, top: 30, width: 12, height: 30, background: "#d8c070" }} />)}</div></At>}
    <Tag tt={tt} at={2.4} x={1400} y={200} txt="STEEL DOESN'T CARE" col={YEL} size={58} />
  </>;
}}</Stage>;

// 32 · menos que un tanque: el surtidor corre los dólares y frena justo antes del precio de la barra
export const HPumpprice: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const v = Math.min(80, Math.round(80 * eio(tt, 0.4, 3.6)));
  return <>
    <At x={640} y={560} s={sp(tt, 0.2)}><div style={{ width: 380, height: 640, borderRadius: 30, background: "linear-gradient(180deg,#c8322a,#6a1412)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", position: "relative" }}>
      <div style={{ position: "absolute", left: 40, top: 60, width: 300, height: 160, borderRadius: 12, background: "#0b1a10", boxShadow: "inset 0 0 0 4px #333", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 900, fontSize: 96, color: GRN, fontVariantNumeric: "tabular-nums" }}>${v}</div>
      <div style={{ position: "absolute", right: -60, top: 300, width: 80, height: 220, borderRadius: 20, background: "#1a1a1a" }} /></div></At>
    <At x={1340} y={560} s={sp(tt, 2.6)}><div style={{ position: "relative" }}><Wheel s={0.9} bar={1} />
      <div style={{ position: "absolute", left: 120, top: 380, fontWeight: 900, fontSize: 80, color: YEL }}>LESS</div></div></At>
  </>;
}}</Stage>;

// 33 · cuál saltean: seis camionetas desde arriba, la mira del ladrón pasa por todas y saltea la de la barra amarilla
export const HSixskip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="#06080d">{(tt) => {
  const i = Math.min(5, Math.floor(eio(tt, 0.8, 4.4) * 6)), skipX = 2;
  const pick = i === skipX ? skipX + 1 : i;
  return <>{Array.from({ length: 6 }, (_, k) => <At key={k} x={330 + k * 252} y={560} s={sp(tt, 0.1 + k * 0.1)}><div style={{ position: "relative" }}>
    <PickupTop w={140} col={["#5d6670", "#6a5a48", "#3a4a3e", "#5a3e4a", "#4a4f58", "#6a6e60"][k]} bar={k === skipX ? 1 : 0} dim={k === skipX ? 0 : 0.2} />
    <div style={{ position: "absolute", left: -40, top: -50, width: 220, height: 422, background: "radial-gradient(ellipse at 50% 40%, rgba(255,214,140,.14), transparent 70%)" }} /></div></At>)}
    <At x={330 + pick * 252} y={500} s={sp(tt, 0.6)}><div style={{ width: 200, height: 200, borderRadius: "50%", border: `5px solid ${RED}`, boxShadow: `0 0 30px ${RED}` }}>
      <div style={{ position: "absolute", left: 96, top: -20, width: 6, height: 240, background: RED }} /><div style={{ position: "absolute", top: 96, left: -20, height: 6, width: 240, background: RED }} /></div></At>
    <Tag tt={tt} at={3.4} x={330 + skipX * 252} y={930} txt="SKIPPED" col={YEL} size={56} />
  </>;
}}</Stage>;

// 34 · dos o diez: el cronómetro de la calle; la aguja de la camioneta fácil para en 2, la de la barra sigue a 10
export const HStopwatch2: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = Math.min(2, 10 * eio(tt, 0.6, 4.2)), b = 10 * eio(tt, 0.6, 4.2);
  const dial = (x: number, v: number, col: string, lab: string, at: number) => <At x={x} y={540} s={sp(tt, at)}><div style={{ width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,#f3f0ea,#c9c4b8)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 0 0 16px #2a2d33", position: "relative" }}>
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 226, top: 26, width: 8, height: 30, background: "#2a2a2a", transformOrigin: "4px 204px", transform: `rotate(${i * 36}deg)` }} />)}
    <div style={{ position: "absolute", left: 226, top: 50, width: 8, height: 180, background: col, borderRadius: 4, transformOrigin: "4px 180px", transform: `rotate(${v * 36}deg)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontWeight: 900, fontSize: 56, color: col, fontVariantNumeric: "tabular-nums" }}>{Math.floor(v)} MIN</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontWeight: 900, fontSize: 36, color: TX }}>{lab}</div></div></At>;
  return <>{dial(620, a, RED, "THE EASY ONE", 0.2)}{dial(1300, b, YEL, "THE YELLOW BAR", 0.6)}</>;
}}</Stage>;

// 35 · de culata: vista de arriba, la camioneta entra marcha atrás y queda con la trompa a la calle; la luz de movimiento se prende
export const HNoseout: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="#06080d">{(tt) => {
  const m = eio(tt, 0.6, 4), rot = 180 * eio(tt, 0.6, 2.6), y = 900 - 420 * m, lit = tt > 4.4 ? eio(tt, 4.4, 4.7) : 0;
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(30deg)", transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "#1c1e22" }} />
    <div style={{ position: "absolute", left: 760, top: 300, width: 400, height: 560, background: "#3a3936" }} />
    <div style={{ position: "absolute", left: 640, top: 60, width: 640, height: 240, background: "#3a2e26", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 900, background: `radial-gradient(ellipse at 50% 15%, rgba(255,246,216,${0.4 * lit}), transparent 60%)` }} />
    <At x={1260} y={250} s={sp(tt, 0.2)}><div style={{ width: 60, height: 40, borderRadius: 8, background: lit ? "#fff6d8" : "#555", boxShadow: lit ? "0 0 50px #fff6d8" : "none" }} /></At>
    <At x={960} y={y} rot={rot}><PickupTop w={170} col="#7b2c27" lights={rot > 150 ? 0.4 : 0} /></At>
    <Tag tt={tt} at={4.6} x={960} y={1000} txt="NOSE OUT. LIGHT ON." col={AMB} size={50} />
  </div>;
}}</Stage>;

// 36 · el escenario: el hombre en la entrada a oscuras; se prende la luz y queda en un círculo blanco como en un teatro
export const HStagelight: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="#030406">{(tt) => {
  const on = cl((tt - 1.6) * 6);
  return <>
    <At x={1250} y={620} s={sp(tt, 0.2)} o={0.25 + 0.75 * on}><Pickup w={720} col="#3a4a5c" /></At>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `conic-gradient(from 160deg at 760px -100px, transparent 0deg, rgba(255,250,235,${0.25 * on}) 14deg, transparent 28deg)` }} />
    <At x={760} y={940} s={1}><div style={{ width: 560, height: 120, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,250,235,${0.65 * on}), transparent 70%)` }} /></At>
    <At x={760} y={790} s={sp(tt, 0.4) * 1.3}><Man s={1.1} col={on > 0.5 ? "#2a2a30" : "#0a0a0c"} hood /></At>
    <Tag tt={tt} at={2.2} x={760} y={160} txt="ON A STAGE" col={TX} size={64} />
  </>;
}}</Stage>;

// 37 · más difícil que el vecino: dos vallas en la vereda, la del vecino baja y la tuya alta; la silueta da la vuelta y va a la otra
export const HHurdles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const m = eio(tt, 1.6, 5), x = 1000 - 760 * m;
  return <>
    <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "linear-gradient(180deg,#3a3936,#1a1a18)" }} />
    {[{ x: 500, hh: 140, c: "#9a9ea4", l: "NEIGHBOR" }, { x: 1400, hh: 420, c: YEL, l: "YOU" }].map((b, i) => <At key={i} x={b.x} y={860 - b.hh / 2} s={sp(tt, 0.2 + i * 0.4)}><div style={{ width: 300, height: b.hh, position: "relative" }}>
      {[0, 1].map((j) => <div key={j} style={{ position: "absolute", left: j * 270, top: 0, width: 30, height: b.hh, background: "#5a5a5a" }} />)}
      {Array.from({ length: Math.max(1, Math.round(b.hh / 110)) }, (_, j) => <div key={j} style={{ position: "absolute", left: 0, top: 10 + j * 110, width: 300, height: 40, borderRadius: 6, background: `repeating-linear-gradient(90deg, ${b.c} 0 40px, #1a1a1a 40px 80px)` }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: b.hh + 30, textAlign: "center", fontWeight: 900, fontSize: 36, color: b.c }}>{b.l}</div></div></At>)}
    <At x={x} y={760} s={sp(tt, 0.6)}><div style={{ transform: `scaleX(${m > 0.02 ? -1 : 1})` }}><Man s={1} col="#0b0b0d" ph={tt * 8 * (m > 0.02 && m < 0.98 ? 1 : 0)} hood /></div></At>
    <Tag tt={tt} at={3} x={960} y={150} txt="JUST HARDER THAN NEXT DOOR" col={AMB} size={48} />
  </>;
}}</Stage>;

// 38 · la vidriera: la caja de la camioneta vista desde la calle como una vidriera iluminada con etiquetas colgando
export const HShopwindow: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const items = [{ l: "HITCH", x: 520 }, { l: "TOOLBOX", x: 860 }, { l: "STICKERS", x: 1200 }];
  return <>
    <At x={960} y={540} s={sp(tt, 0.2)}><div style={{ width: 1200, height: 640, position: "relative", borderRadius: 16, background: "linear-gradient(180deg,#5a4a36,#241a10)", boxShadow: "inset 0 0 0 22px #1a1a1c, 0 50px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 22, background: "radial-gradient(ellipse at 50% 0%, rgba(255,230,180,.55), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 22, right: 22, top: 22, height: 16, background: "repeating-linear-gradient(90deg,#c8322a 0 60px,#f3f0ea 60px 120px)" }} />
      <div style={{ position: "absolute", left: 22, top: 22, width: 300, height: 596, background: "linear-gradient(110deg, rgba(255,255,255,.12), transparent 60%)" }} />
    </div></At>
    {items.map((it, i) => { const s = sp(tt, 1 + i * 0.6), sw = 6 * Math.sin(tt * 2 + i); return <React.Fragment key={i}>
      <At x={it.x} y={560} s={s}><div style={{ width: 200, height: 160, borderRadius: 14, background: ["linear-gradient(180deg,#b9bcc1,#5a5e64)", "linear-gradient(180deg,#c8322a,#5a1412)", "linear-gradient(135deg,#2a5aa8,#ffd23a)"][i], boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} /></At>
      <At x={it.x + 70} y={420} s={s} rot={sw}><div style={{ padding: "10px 18px", borderRadius: 8, background: "#f3f0ea", color: "#1a1a1a", fontWeight: 900, fontSize: 28, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>{it.l}</div></At></React.Fragment>; })}
    <Tag tt={tt} at={3.4} x={960} y={950} txt="BACK IN. WINDOW CLOSED." col={GRN} size={48} />
  </>;
}}</Stage>;

// 40 · no entra: la llave vieja de girar baja hacia el tablero, que sólo tiene un botón liso; rebota sin lugar donde entrar
export const HNofit: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = eio(tt, 0.8, 2.2), bounce = tt > 2.2 ? 40 * Math.abs(Math.sin((tt - 2.2) * 6)) * Math.exp(-(tt - 2.2) * 2) : 0;
  return <>
    <At x={1100} y={560} s={sp(tt, 0.2)}><div style={{ width: 760, height: 420, borderRadius: 40, background: "linear-gradient(180deg,#2c2e33,#121316)", boxShadow: "0 40px 60px rgba(0,0,0,.6)", position: "relative" }}>
      <div style={{ position: "absolute", left: 300, top: 130, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #4a4e55, #1a1b1e)", boxShadow: "0 0 0 8px #c9ccd1, 0 0 30px rgba(255,90,74,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 28, color: RED }}>START</div></div></At>
    <At x={500 + 420 * d} y={560 - bounce} rot={-90 + 10 * Math.sin(tt * 2)} s={sp(tt, 0.4) * 1.4}><svg width="120" height="320" viewBox="0 0 120 320"><circle cx="60" cy="60" r="50" fill="#c9a24a" /><circle cx="60" cy="50" r="14" fill="#1a1a1a" /><path d="M48 105 L72 105 L72 300 L60 316 L48 300 Z" fill="#d8b860" /><path d="M72 160 L86 160 L86 180 L72 180 M72 210 L82 210 L82 226 L72 226 M72 256 L88 256 L88 272 L72 272" fill="#d8b860" /></svg></At>
    <Tag tt={tt} at={3.2} x={960} y={140} txt="NOWHERE TO TURN IT" col={TX} size={56} />
  </>;
}}</Stage>;

// 41 · el motel: corte de la pared fina; la llave en la mesita de luz, la camioneta en el estacionamiento a 40 pies
export const HMotelwall: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = eio(tt, 1.6, 3.6);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 1080, background: "linear-gradient(180deg,#3a3040,#1a1420)" }} />
    <div style={{ position: "absolute", left: 750, top: 0, width: 20, height: 1080, background: "repeating-linear-gradient(180deg,#c9b8a0 0 30px,#a8977e 30px 32px)" }} />
    <At x={380} y={700} s={sp(tt, 0.2)}><div style={{ width: 260, height: 200, borderRadius: 10, background: "linear-gradient(180deg,#6a4e33,#3a2a1a)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} /></At>
    <At x={300} y={460} s={sp(tt, 0.4)}><div style={{ width: 120, height: 160, borderRadius: "60px 60px 10px 10px", background: "radial-gradient(ellipse at 50% 30%, #ffe3a8, #b98a40)", boxShadow: "0 0 60px rgba(255,214,150,.6)" }} /></At>
    <At x={430} y={570} s={sp(tt, 0.8) * 0.7}><KFob s={0.6} awake={1} /></At>
    <At x={1400} y={720} s={sp(tt, 0.6)}><Pickup w={600} col="#3a4a5c" /></At>
    <div style={{ position: "absolute", left: 460, top: 620, width: 820 * L, height: 6, background: `repeating-linear-gradient(90deg, ${RED} 0 20px, transparent 20px 32px)` }} />
    <At x={870} y={560} s={sp(tt, 2.4)}><div style={{ fontWeight: 900, fontSize: 96, color: RED }}>40 FT</div></At>
    <Tag tt={tt} at={3.8} x={1400} y={260} txt="A LOT FULL OF STRANGERS" col={AMB} size={46} />
  </>;
}}</Stage>;

// 42 · el papel de aluminio: la llave envuelta brilla; en el doblez se abre una rendija y el ojito se ve por ahí
export const HFoilgap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = eio(tt, 2.2, 3.4);
  return <>
    <At x={960} y={540} s={sp(tt, 0.2) * 1.8}><div style={{ width: 300, height: 400, position: "relative" }}>
      <div style={{ position: "absolute", left: 90, top: 100 }}><KFob s={1} awake={g} /></div>
      <svg width="300" height="400" viewBox="0 0 300 400" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><linearGradient id="rk29d_foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2f4f6" /><stop offset=".3" stopColor="#9ca3ab" /><stop offset=".55" stopColor="#eef0f2" /><stop offset="1" stopColor="#7a8189" /></linearGradient></defs>
        <path d={`M40 60 L260 50 L270 210 L${160 + 30 * g} ${200 - 30 * g} L${150} ${200 + 20 * g} L30 210 Z`} fill="url(#rk29d_foil)" />
        <path d="M30 220 L270 220 L265 370 L45 375 Z" fill="url(#rk29d_foil)" />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${50 + rnd(i) * 200} ${70 + rnd(i + 3) * 290} l ${20 + rnd(i + 5) * 30} ${-10 + rnd(i + 7) * 20}`} stroke="rgba(255,255,255,.7)" strokeWidth="2" />)}
      </svg></div></At>
    <Tag tt={tt} at={3.6} x={960} y={960} txt="A GAP AT THE FOLD" col={RED} size={56} />
  </>;
}}</Stage>;

// 43 · el seguro no te devuelve el sábado: un cheque llena el colador; las herramientas, las fotos y el sábado se escurren por los agujeros
export const HSieve: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const drop = (i: number) => cl((tt - 2 - i * 0.6) / 1.4);
  const things = [{ l: "TOOLS", c: "#c8322a" }, { l: "PHOTOS", c: "#f3f0ea" }, { l: "SATURDAY", c: AMB }];
  return <>
    <At x={960} y={420} s={sp(tt, 0.2)}><div style={{ width: 720, height: 300, borderRadius: "0 0 360px 360px", background: "radial-gradient(circle at 50% 0%, #c9ccd1, #6a6e75)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + (i % 10) * 62, top: 30 + Math.floor(i / 10) * 60, width: 26, height: 26, borderRadius: "50%", background: "#141416" }} />)}</div></At>
    <At x={960} y={250 + 60 * eio(tt, 0.8, 1.6)} s={sp(tt, 0.8)}><div style={{ width: 420, height: 160, borderRadius: 10, background: "linear-gradient(180deg,#dfeedd,#b9d2b4)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", padding: 20, boxSizing: "border-box", fontWeight: 900, fontSize: 40, color: "#1e3a1e" }}>INSURANCE CHECK</div></At>
    {things.map((th, i) => <At key={i} x={760 + i * 200} y={540 + 420 * drop(i)} o={drop(i) > 0 ? 1 - drop(i) * 0.6 : 0} rot={20 * drop(i) * (i - 1)}><div style={{ padding: "14px 24px", borderRadius: 10, background: th.c, color: "#1a1a1a", fontWeight: 900, fontSize: 34, boxShadow: "0 14px 20px rgba(0,0,0,.5)" }}>{th.l}</div></At>)}
    <Tag tt={tt} at={4.8} x={960} y={110} txt="IT DOESN'T COVER THAT" col={RED} size={52} />
  </>;
}}</Stage>;

// 45 · menos que lavarse los dientes: el cepillo y la rutina de la puerta corren lado a lado; la puerta llega primero
export const HBrushrace: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = eio(tt, 0.6, 3.4), b = eio(tt, 0.6, 5.8);
  return <>
    {[{ y: 400, v: a, l: "LOCK UP", c: GRN, s: "30s" }, { y: 680, v: b, l: "BRUSH TEETH", c: ICE, s: "2 MIN" }].map((r, i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 300, top: r.y, width: 1320, height: 90, borderRadius: 45, background: "rgba(255,255,255,.07)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.1)" }} />
      <At x={300 + 1320 * r.v} y={r.y + 45} s={sp(tt, 0.2 + i * 0.3)}>{i === 0 ? <KFob s={0.5} /> : <svg width="220" height="60" viewBox="0 0 220 60"><rect x="0" y="22" width="160" height="16" rx="8" fill="#f3f0ea" /><rect x="150" y="10" width="64" height="30" rx="8" fill="#8fd6ff" />{Array.from({ length: 8 }, (_, k) => <rect key={k} x={154 + k * 7} y="2" width="4" height="14" fill="#fff" />)}</svg>}</At>
      <div style={{ position: "absolute", left: 300, top: r.y - 60, fontWeight: 900, fontSize: 40, color: r.c }}>{r.l}</div>
      <div style={{ position: "absolute", left: 1520, top: r.y - 60, fontWeight: 900, fontSize: 40, color: r.c, opacity: r.v > 0.98 ? 1 : 0 }}>{r.s}</div></React.Fragment>)}
  </>;
}}</Stage>;

export const HEROES_B: Record<string, React.FC<P>> = {
  badgood: HBadgood, creasecrack: HCreasecrack, plugcap: HPlugcap,
  series: HSeries, steelchip: HSteelchip, pumpprice: HPumpprice, sixskip: HSixskip, stopwatch2: HStopwatch2, noseout: HNoseout,
  stagelight: HStagelight, hurdles: HHurdles, shopwindow: HShopwindow, nofit: HNofit, motelwall: HMotelwall,
  foilgap: HFoilgap, sieve: HSieve, brushrace: HBrushrace,
};
