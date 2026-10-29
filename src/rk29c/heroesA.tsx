// rk29c · componentes únicos 1-23 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
// La caja fuerte en el garage: la losa, el portón que baja, las ventanitas que son un cuadro, dos hombres y un carrito, el agua en la esquina baja…
import React from "react";
import { H, Stage, Tag, phys, cl, eio, TX } from "./hkit";
import { AMB, RED, ICE, GRN, CONC, rnd, At, Safe, Slab, GDoor, Tool, Peg, Heater, Truck, Person, GHouse, Drop } from "./safedraw";

type P = { t: number; h: H };
const sp = (tt: number, a: number) => cl(phys(tt, a));

// 1 · la losa: corte de la casa; arriba la caja sobre alfombra y tablas finas, abajo la caja abrazada por 4 pulgadas de concreto
export const HSlabcore: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sag = 10 * Math.sin(Math.min(1, cl((tt - 2) / 2)) * Math.PI / 2);
  return <>
    <At x={560} y={470} s={sp(tt, 0.2)}><div style={{ width: 620, height: 40, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: sag, width: 620, height: 30, borderRadius: "0 0 50% 50% / 0 0 30% 30%", background: "repeating-linear-gradient(90deg,#9a7448 0 60px,#7c5a35 60px 64px)", transform: `scaleY(${1 + sag / 40})` }} />
      <div style={{ position: "absolute", left: 0, top: -14 + sag, width: 620, height: 16, background: "#b9ad97", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 200, bottom: 50 - sag }}><Safe w={180} /></div></div></At>
    <Tag tt={tt} at={1.2} x={560} y={160} txt="CARPET UPSTAIRS" col={RED} size={50} />
    <At x={1380} y={700} s={sp(tt, 0.8)}><Slab w={720} h={190}><div style={{ position: "absolute", left: 250, bottom: -2 }}><Safe w={180} bolts={eio(tt, 3, 4.5)} glowBolts={eio(tt, 4.5, 5.5)} /></div></Slab></At>
    <Tag tt={tt} at={2.4} x={1380} y={290} txt="SOLID CONCRETE SLAB" col={AMB} size={50} />
    <Tag tt={tt} at={5.4} x={1380} y={890} txt="STRONGEST THING YOU OWN" col={TX} size={44} />
  </>;
}}</Stage>;

// 2 · el portón baja detrás de él: la luz de la calle se achica a una raya y queda el garage cerrado
export const HDoordown: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = eio(tt, 0.6, 3.6);
  return <>
    <At x={960} y={540} s={sp(tt, 0.1)}><GDoor w={900} down={d} lit={1} inside={<div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220, background: "linear-gradient(180deg,transparent,rgba(255,230,180,.5))" }}><div style={{ position: "absolute", left: 420, bottom: 20 }}><Person s={1.1} col="#16120e" /></div></div>} /></At>
    <At x={960} y={895} o={cl(1 - d) * 0.9}><div style={{ width: 900, height: 30, background: "radial-gradient(ellipse, rgba(255,226,170,.7), transparent 70%)" }} /></At>
    <Tag tt={tt} at={3.8} x={960} y={130} txt="NOBODY SEES IN" col={AMB} size={58} />
  </>;
}}</Stage>;

// 3 · el ojo del ladrón recorre la pared: cada silueta del tablero se ilumina de a una, al final el bulto tapado en el piso
export const HEyescan: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ks = ["crowbar", "sledge", "grinder", "pry", "cutters", "hammer"], cur = Math.floor((tt - 0.8) / 0.9);
  const ex = 220 + 140 * Math.min(cur, 5) + 60 * Math.sin(tt * 2);
  return <>
    <At x={760} y={440} s={sp(tt, 0.1)}><Peg w={980} h={520}>{ks.map((k, i) => <div key={k} style={{ position: "absolute", left: 70 + i * 145, top: 120 }}><Tool k={k} s={1.15} glow={cur >= i ? 1 : 0} /></div>)}</Peg></At>
    <At x={ex} y={150} s={sp(tt, 0.5)}><svg width="150" height="80" viewBox="0 0 150 80"><path d="M5 40 Q75 -10 145 40 Q75 90 5 40Z" fill="#f4f2ee" /><circle cx={75 + 8 * Math.sin(tt * 3)} cy="40" r="22" fill="#2a2a2a" /><circle cx={70 + 8 * Math.sin(tt * 3)} cy="34" r="6" fill="#fff" /></svg></At>
    <At x={1580} y={720} s={sp(tt, 6.2)}><div style={{ width: 300, height: 360, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(160deg,#6c7178,#3a3e44)", boxShadow: `0 0 ${tt > 6.6 ? 40 : 0}px ${AMB}, 0 40px 60px rgba(0,0,0,.6)` }} /></At>
    <Tag tt={tt} at={6.8} x={1580} y={480} txt="BIG, SQUARE, COVERED" col={AMB} size={44} />
  </>;
}}</Stage>;

// 4 · una docena de veces: el portón de la casa sube y baja en loop, el contador del sábado llega a 12 y uno más un martes no suena distinto
export const HDozencycles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = Math.min(13, Math.floor(tt / 0.55)), d = 0.5 + 0.5 * Math.cos(tt / 0.55 * Math.PI * 2);
  return <>
    {[-1, 1].map((s) => <At key={s} x={960 + s * 560} y={600} s={0.9 * sp(tt, 0.3)}><GHouse w={460} col={s < 0 ? "#7d6a5a" : "#6a7a86"} /></At>)}
    <At x={960} y={560} s={sp(tt, 0.1)}><GHouse w={560} lit={0.2} /></At>
    <At x={1090} y={622} s={sp(tt, 0.1)}><div style={{ width: 150, height: 112 * d, background: "#ece8e0", transformOrigin: "top", boxShadow: "0 4px 0 rgba(0,0,0,.2)" }} /></At>
    <At x={960} y={250} s={sp(tt, 0.4)}><div style={{ fontWeight: 900, fontSize: 130, color: n >= 13 ? RED : AMB, fontVariantNumeric: "tabular-nums", textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{n >= 13 ? "13" : n}</div></At>
    <Tag tt={tt} at={7.2} x={960} y={900} txt="ONE MORE. NOBODY LOOKS." col={TX} size={50} />
  </>;
}}</Stage>;

// 5 · las ventanitas son un cuadro: la fila de vidrios se convierte en un marco dorado y adentro la caja fuerte es «la pintura»
export const HPicframe: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 2.2, 3.8), z = 1 + 0.9 * eio(tt, 1.2, 3.4);
  return <>
    <At x={960} y={560} s={sp(tt, 0.1) * z}><GDoor w={760} lit={1} /></At>
    <At x={960} y={520} s={sp(tt, 2.2)} o={g}><div style={{ width: 760, height: 430, borderRadius: 6, padding: 34, boxSizing: "border-box", background: "linear-gradient(135deg,#7a5a20,#e8c46a 30%,#9a7426 60%,#f0d48a)", boxShadow: "0 50px 90px rgba(0,0,0,.7)" }}>
      <div style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 50% 40%, #6a5638, #1a140c)", position: "relative", boxShadow: "inset 0 0 40px rgba(0,0,0,.8)" }}><div style={{ position: "absolute", left: 240, top: 50 }}><Safe w={200} /></div></div></div></At>
    <Tag tt={tt} at={4.2} x={960} y={140} txt="THE WINDOW IS A FRAME" col={AMB} size={56} />
  </>;
}}</Stage>;

// 6 · el cono de vista desde la entrada: mientras la caja está en el cono, se ve; se corre a la esquina ciega y desaparece
export const HSightcone: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const m = eio(tt, 4, 6), sx = 960 + 420 * m, seen = m < 0.55;
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(50deg)", transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", left: 360, top: 160, width: 1200, height: 760, background: "#2c2925", border: "8px solid #5e554b", boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: 360, top: 920, width: 1200, height: 18, background: "#ece8e0" }} />
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}><path d="M960 1060 L620 160 L1300 160 Z" fill={`rgba(255,214,140,${0.22 * sp(tt, 1)})`} stroke="rgba(255,214,140,.6)" strokeWidth="3" /></svg>
    <At x={960} y={1040} s={sp(tt, 0.4)}><Person s={0.8} col="#cfc6b6" /></At>
    <At x={sx} y={420} s={sp(tt, 0.8)}><div style={{ width: 150, height: 150, borderRadius: 8, background: seen ? "#58606a" : "#2f3439", boxShadow: seen ? `0 0 40px ${AMB}` : "none" }} /></At>
    <Tag tt={tt} at={2} x={960} y={90} txt={seen ? "IN VIEW = INVITED" : "OUT OF VIEW"} col={seen ? RED : GRN} size={60} />
  </div>;
}}</Stage>;

// 7 · film esmerilado: una lámina blanca se desliza sobre cada vidrio y la caja de adentro se vuelve sombra lechosa
export const HFrostfilm: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eio(tt, 1.6, 4.2);
  return <>
    <At x={960} y={520} s={1.25 * sp(tt, 0.1)}><GDoor w={820} lit={1} frost={f} /></At>
    <At x={1520 - 700 * f} y={260} s={sp(tt, 0.8)} rot={-8}><div style={{ width: 120, height: 60, borderRadius: 30, background: "linear-gradient(90deg,#e7ecf0,#fff)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} /></At>
    <Tag tt={tt} at={4.4} x={960} y={900} txt="LIGHT IN, PICTURE OUT" col={ICE} size={54} />
  </>;
}}</Stage>;

// 8 · dos hombres y un carrito: la palanca del carrito levanta 400 libras con un dedo
export const HTwomen: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const tilt = 28 * eio(tt, 1.8, 3.6), roll = 380 * eio(tt, 4.4, 7.4);
  return <>
    <At x={960} y={860} s={sp(tt, 0.1)}><div style={{ width: 1500, height: 16, background: CONC, borderRadius: 8 }} /></At>
    <At x={760 + roll} y={600} s={sp(tt, 0.2)}><div style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 100%", position: "relative" }}>
      <Safe w={220} /><div style={{ position: "absolute", left: 250, top: -40, width: 14, height: 360, background: RED, borderRadius: 6 }} /><div style={{ position: "absolute", left: 230, top: 330, width: 50, height: 50, borderRadius: "50%", background: "#111" }} /></div></At>
    {[0, 1].map((i) => <At key={i} x={1120 + roll + i * 110} y={680} s={sp(tt, 0.6 + i * 0.3)}><Person s={1.2} col="#d9d2c4" /></At>)}
    <At x={600} y={300} s={sp(tt, 1)}><div style={{ fontWeight: 900, fontSize: 96, color: AMB }}>400 LB</div></At>
    <Tag tt={tt} at={3.8} x={600} y={410} txt="TWO MEN, ONE DOLLY" col={TX} size={48} />
  </>;
}}</Stage>;

// 9 · la volcaron sobre la manta, la deslizaron al carrito y subió la rampa al camión
export const HTipslide: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tip = eio(tt, 0.8, 2.4), slide = eio(tt, 2.8, 5.4), up = eio(tt, 5.8, 8.4);
  const x = 520 + 520 * slide + 360 * up, y = 640 - 210 * up;
  return <>
    <At x={1540} y={480} s={sp(tt, 0.2)}><Truck w={620} /></At>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}><path d="M1050 820 L1330 610" stroke="#8a8f96" strokeWidth="18" strokeLinecap="round" opacity={sp(tt, 0.5)} /></svg>
    <At x={x} y={y + 160} s={sp(tt, 0.4)}><div style={{ width: 360, height: 26, borderRadius: 10, background: "repeating-linear-gradient(90deg,#3d5a80 0 18px,#2e4566 18px 36px)" }} /></At>
    <At x={x} y={y} s={sp(tt, 0.1)} rot={-90 * tip + (-36 * up)}><Safe w={200} /></At>
    <Tag tt={tt} at={3} x={760} y={200} txt="THE NEIGHBOR SAW MOVERS" col={AMB} size={52} />
  </>;
}}</Stage>;

// 10 · una caja con manijas: a la caja suelta le brotan dos manijas de mudanza a los costados
export const HHandles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <At x={960} y={560} s={1.3 * sp(tt, 0.1)} rot={2 * Math.sin(tt * 1.4) * eio(tt, 3, 4)}><Safe w={300} handles={eio(tt, 1, 2.4)} /></At>
  <Tag tt={tt} at={2.2} x={960} y={150} txt="A BOX WITH HANDLES" col={RED} size={64} />
</>}</Stage>;

// 11 · el tope de la póliza: una tapa baja sobre las pilas de efectivo y joyas; lo que queda arriba se cae fuera
export const HPolicycap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lid = eio(tt, 2.2, 3.6), fall = eio(tt, 3.6, 5.4);
  const stacks = [[620, 9, "#7fb069"], [960, 7, AMB], [1300, 8, "#c0c4ca"]] as const;
  return <>
    {stacks.map(([x, n, c], s) => <React.Fragment key={s}>{Array.from({ length: n }, (_, i) => {
      const over = i >= 3, k = over ? fall : 0;
      return <At key={i} x={x + (over ? (i % 2 ? 1 : -1) * 260 * k : 0)} y={780 - i * 48 * sp(tt, 0.3 + i * 0.08) + (over ? 360 * k * k : 0)} rot={over ? 50 * k * (i % 2 ? 1 : -1) : 0} o={1 - (over ? k * 0.6 : 0)}>
        <div style={{ width: 210, height: 40, borderRadius: s === 2 ? 20 : 6, background: c, boxShadow: "0 6px 0 rgba(0,0,0,.35)" }} /></At>;
    })}</React.Fragment>)}
    <At x={960} y={180 + 470 * lid} s={sp(tt, 1.6)}><div style={{ width: 1100, height: 30, borderRadius: 8, background: "linear-gradient(180deg,#f4f2ee,#bfb8ab)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} /></At>
    <Tag tt={tt} at={1.6} x={960} y={110} txt="THE POLICY LIMIT" col={TX} size={56} />
    <Tag tt={tt} at={5} x={960} y={960} txt="THE REST IS GONE" col={RED} size={48} />
  </>;
}}</Stage>;

// 12 · la foto con fecha: el obturador se cierra como iris sobre la mesa de la cocina y queda una polaroid con la fecha
export const HTablephoto: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const shut = tt > 2.4 && tt < 2.7 ? Math.sin((tt - 2.4) / 0.3 * Math.PI) : 0, pr = eio(tt, 3, 4.6);
  return <>
    <div style={{ position: "absolute", left: 260, top: 520, width: 1400, height: 400, transform: "perspective(1400px) rotateX(55deg)", background: "linear-gradient(180deg,#8a6a4a,#5d4530)", borderRadius: 20 }} />
    {[[600, "#e8c46a"], [860, "#c0c4ca"], [1120, "#7fb069"], [1340, "#d9d2c4"]].map(([x, c], i) => <At key={i} x={x as number} y={640} s={sp(tt, 0.3 + i * 0.2)}><div style={{ width: 120, height: 90, borderRadius: i === 0 ? "50%" : 10, background: c as string, boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} /></At>)}
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, transparent ${(1 - shut) * 900}px, #000 ${(1 - shut) * 900 + 2}px)` }} />
    <At x={1480 - 220 * pr} y={360} s={pr} rot={-6 + 4 * pr}><div style={{ width: 360, height: 300, background: "#f7f4ee", padding: 16, boxSizing: "border-box", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ width: "100%", height: 200, background: "linear-gradient(180deg,#6a5038,#3e2e20)" }} /><div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 36, color: "#e2574c", marginTop: 14, textAlign: "right" }}>10 · 29</div></div></At>
    <Tag tt={tt} at={4.6} x={700} y={200} txt="PICTURES, WITH THE DATE" col={AMB} size={52} />
  </>;
}}</Stage>;

// 13 · la esquina baja: el piso del garage se inclina apenas y las gotas ruedan todas hacia la esquina donde está la caja
export const HLowcorner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pool = eio(tt, 3, 7);
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(55deg) rotateZ(-6deg)", transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", left: 360, top: 180, width: 1200, height: 760, background: "#7d7a74", boxShadow: "inset 0 0 0 10px #5e5b56" }} />
    <At x={560} y={330} s={sp(tt, 0.2)}><Heater w={110} /></At>
    {Array.from({ length: 16 }, (_, i) => { const k = cl((tt - 0.6 - i * 0.18) / 2.6), x0 = 520 + rnd(i) * 300, y0 = 360 + rnd(i + 4) * 160; return k > 0 && k < 1 ? <At key={i} x={x0 + (1380 - x0) * k * k} y={y0 + (800 - y0) * k * k}><Drop s={22} /></At> : null; })}
    <div style={{ position: "absolute", left: 1500 - 420 * pool, top: 900 - 260 * pool, width: 440 * pool, height: 280 * pool, borderRadius: "60% 40% 0 50%", background: "rgba(74,168,224,.55)" }} />
    <At x={1400} y={760} s={sp(tt, 0.4)}><div style={{ width: 170, height: 170, borderRadius: 8, background: "#4a5059", boxShadow: "0 0 0 4px #2a2e33" }} /></At>
    <Tag tt={tt} at={4} x={960} y={90} txt="WATER FINDS THE LOW CORNER" col={ICE} size={54} />
  </div>;
}}</Stage>;

// 14 · la pared de la caja es una esponja: corte de la puerta, el relleno gris guarda gotitas que salen hacia adentro
export const HSponge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <>
  <At x={960} y={540} s={sp(tt, 0.1)}><div style={{ width: 900, height: 520, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 60, height: 520, background: "linear-gradient(90deg,#b9bec5,#6d737b)" }} />
    <div style={{ position: "absolute", left: 60, top: 0, width: 300, height: 520, background: "#a7a39b", backgroundImage: "radial-gradient(circle, rgba(70,68,64,.6) 3px, transparent 4px)", backgroundSize: "26px 26px" }} />
    <div style={{ position: "absolute", left: 360, top: 0, width: 60, height: 520, background: "linear-gradient(90deg,#6d737b,#b9bec5)" }} />
    <div style={{ position: "absolute", left: 420, top: 0, width: 480, height: 520, background: "linear-gradient(90deg,#3a2e22,#20180f)" }} />
    {Array.from({ length: 14 }, (_, i) => { const k = ((tt * 0.35 + rnd(i)) % 1); return tt > 1.4 ? <div key={i} style={{ position: "absolute", left: 90 + rnd(i + 2) * 240 + 360 * k, top: 40 + rnd(i + 8) * 440, opacity: Math.sin(k * Math.PI) }}><Drop s={20} /></div> : null; })}
    <div style={{ position: "absolute", left: 560, top: 240, width: 200, height: 150, background: "#e8dcc0", transform: `rotate(-4deg) skewX(${4 * Math.sin(tt)}deg)`, boxShadow: "0 10px 14px rgba(0,0,0,.4)", filter: `sepia(${cl((tt - 3) / 4)})` }} /></div></At>
  <Tag tt={tt} at={1} x={380} y={170} txt="FIRE FILL HOLDS WATER" col={AMB} size={46} />
  <Tag tt={tt} at={4} x={1300} y={900} txt="PAPERS GET DAMP" col={ICE} size={46} />
</>}</Stage>;

// 15 · los círculos mojados: termotanque, lavarropas y pileta irradian anillos de agua; la caja salta afuera de todos
export const HWetrings: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const m = eio(tt, 4.2, 6.2);
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(52deg)", transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", left: 360, top: 180, width: 1200, height: 760, background: "#2e2b27", boxShadow: "inset 0 0 0 8px #5e554b" }} />
    {[[520, 320, "HEATER"], [800, 300, "WASHER"], [1060, 310, "SINK"]].map(([x, y, n], i) => <React.Fragment key={i}>
      {[0, 1, 2].map((r) => { const k = ((tt * 0.5 + r / 3) % 1); return <div key={r} style={{ position: "absolute", left: (x as number) - 220 * k, top: (y as number) - 220 * k, width: 440 * k, height: 440 * k, borderRadius: "50%", border: `4px solid rgba(74,168,224,${0.8 * (1 - k) * sp(tt, 0.4 + i * 0.3)})` }} />; })}
      <div style={{ position: "absolute", left: (x as number) - 50, top: (y as number) - 50, width: 100, height: 100, borderRadius: 12, background: "#c9ccd1" }} /><Tag tt={tt} at={0.8 + i * 0.3} x={x as number} y={(y as number) + 100} txt={n as string} col={ICE} size={34} /></React.Fragment>)}
    <At x={900 + 460 * m} y={520 + 260 * m} s={sp(tt, 1.6)}><div style={{ width: 140, height: 140, borderRadius: 8, background: "#4a5059", boxShadow: m > 0.9 ? `0 0 40px ${GRN}` : `0 0 30px ${RED}` }} /></At>
    <Tag tt={tt} at={6.2} x={1360} y={980} txt="DRY GROUND" col={GRN} size={48} />
  </div>;
}}</Stage>;

// 16 · el taller del ladrón: diez pasos marcados entre el tablero y la caja, se cuentan de a uno
export const HWorkshop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.min(10, Math.floor((tt - 1) / 0.45));
  return <>
    <At x={330} y={460} s={0.62 * sp(tt, 0.1)}><Peg w={420} h={560}>{["crowbar", "sledge", "grinder"].map((k, i) => <div key={k} style={{ position: "absolute", left: 40 + i * 120, top: 120 }}><Tool k={k} s={1.2} /></div>)}</Peg></At>
    {Array.from({ length: n }, (_, i) => <At key={i} x={560 + i * 98} y={760 + (i % 2 ? -26 : 26)} s={sp(tt, 1 + i * 0.45)} rot={90}><div style={{ width: 36, height: 74, borderRadius: "45% 45% 40% 40%", background: "#e7dfcf", opacity: 0.85 }} /><div style={{ position: "absolute", left: -40, top: 18, fontWeight: 900, fontSize: 30, color: AMB, transform: "rotate(-90deg)" }}>{i + 1}</div></At>)}
    <At x={1640} y={600} s={sp(tt, 0.6)}><Safe w={220} /></At>
    <Tag tt={tt} at={6} x={960} y={160} txt="A WORKSHOP FOR HIM" col={RED} size={58} />
  </>;
}}</Stage>;

// 17 · para un ladrón son llaves: la palanca, la maza y la amoladora se funden en siluetas de llave
export const HToolkeys: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const m = eio(tt, 2, 4);
  return <>{["crowbar", "sledge", "grinder"].map((k, i) => <React.Fragment key={k}>
    <At x={560 + i * 400} y={520} s={1.4 * sp(tt, 0.2 + i * 0.3)} o={1 - m}><Tool k={k} /></At>
    <At x={560 + i * 400} y={520} s={1.2 * m} o={m} rot={-30 + i * 30}><svg width="120" height="300" viewBox="0 0 40 100"><circle cx="20" cy="16" r="14" fill="none" stroke="#e8c46a" strokeWidth="6" /><path d="M17 30 L23 30 L23 90 L30 90 L30 82 L36 82 L36 74 L23 74 L23 30" fill="#e8c46a" stroke="#e8c46a" strokeWidth="2" /></svg></At>
  </React.Fragment>)}
    <Tag tt={tt} at={4.2} x={960} y={160} txt="TOOLS ARE KEYS" col={AMB} size={64} />
  </>;
}}</Stage>;

// 18 · una cadena larga: la cadena viaja enhebrando la palanca, la escalera y el cortapernos, y el candado cierra
export const HChainloop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = eio(tt, 0.8, 5.2), lock = eio(tt, 5.6, 6.4);
  const path = "M300 700 C 500 500, 640 900, 820 640 S 1140 460, 1260 700 S 1560 820, 1620 640";
  return <>
    <At x={680} y={560} s={sp(tt, 0.2)} rot={8}><Tool k="pry" s={1.6} /></At>
    <At x={1000} y={540} s={sp(tt, 0.3)}><svg width="200" height="460" viewBox="0 0 50 115"><rect x="4" y="0" width="6" height="115" fill="#c9ccd1" /><rect x="40" y="0" width="6" height="115" fill="#c9ccd1" />{[10, 30, 50, 70, 90].map((y) => <rect key={y} x="4" y={y} width="42" height="5" fill="#a7abb1" />)}</svg></At>
    <At x={1360} y={560} s={sp(tt, 0.4)} rot={-8}><Tool k="cutters" s={1.6} /></At>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}><defs><mask id="rk29c_chain"><rect x="0" y="0" width={300 + 1340 * k} height="1080" fill="#fff" /></mask></defs><g mask="url(#rk29c_chain)"><path d={path} fill="none" stroke="#8d9096" strokeWidth="22" strokeLinecap="round" /><path d={path} fill="none" stroke="#e1e4e8" strokeWidth="14" strokeDasharray="26 10" strokeLinecap="round" /></g></svg>
    <At x={1640} y={640 + 20 * (1 - lock)} s={sp(tt, 5.2)}><svg width="120" height="150" viewBox="0 0 40 50"><path d={`M10 ${22 - 6 * lock} L10 12 Q20 0 30 12 L30 22`} fill="none" stroke="#c9ccd1" strokeWidth="5" /><rect x="4" y="20" width="32" height="28" rx="4" fill="#c9a24a" /></svg></At>
    <Tag tt={tt} at={6.4} x={960} y={170} txt="TWENTY SECONDS" col={AMB} size={60} />
  </>;
}}</Stage>;

// 19 · cuatro casas sobre el camino: tres pierden la caja, el generador y las herramientas; la de ella, una bolsa de tierra
export const HFourhouses: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const lost = ["SAFE", "GENERATOR", "POWER TOOLS", "POTTING SOIL"];
  return <>
    <At x={960} y={760} s={sp(tt, 0.1)}><div style={{ width: 1700, height: 40, background: "#5a5650", borderRadius: 10 }} /></At>
    {lost.map((n, i) => { const k = eio(tt, 1.6 + i * 1.1, 2.6 + i * 1.1); return <React.Fragment key={i}>
      <At x={330 + i * 420} y={600} s={0.8 * sp(tt, 0.3 + i * 0.2)}><GHouse w={340} col={i === 3 ? "#7a8a6a" : "#8a6a5a"} /></At>
      <At x={330 + i * 420} y={460 - 200 * k} o={k}><div style={{ padding: "10px 20px", borderRadius: 10, background: i === 3 ? "#3a5a3a" : "#5a2a24", fontWeight: 900, fontSize: 30, color: TX }}>{n}</div></At></React.Fragment>; })}
    <Tag tt={tt} at={6.4} x={1590} y={900} txt="HERS: A BAG OF SOIL" col={GRN} size={42} />
  </>;
}}</Stage>;

// 20 · el camino de vuelta a la camioneta: cada viaje suma minutos y en las ventanas de los vecinos se prenden ojos
export const HTruckwalk: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const trip = (tt % 2.4) / 2.4, dir = Math.floor(tt / 2.4) % 2, x = dir ? 1500 - 1000 * trip : 500 + 1000 * trip, mins = Math.min(9, Math.floor(tt * 1.1));
  return <>
    <At x={420} y={560} s={sp(tt, 0.1)}><GHouse w={420} /></At>
    <At x={1580} y={640} s={sp(tt, 0.2)}><Truck w={380} /></At>
    <At x={x} y={720} s={sp(tt, 0.3)}><Person s={0.9} col="#16120e" /></At>
    {[0, 1, 2].map((i) => <At key={i} x={760 + i * 260} y={300} s={sp(tt, 2 + i * 1.6)}><div style={{ width: 120, height: 90, borderRadius: 6, background: "rgba(255,214,140,.85)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2a2a2a" }} /></div></At>)}
    <At x={960} y={140} s={sp(tt, 0.5)}><div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 70, color: AMB }}>{mins} MIN</div></At>
    <Tag tt={tt} at={5} x={960} y={920} txt="EVERY TRIP, MORE EYES" col={TX} size={46} />
  </>;
}}</Stage>;

// 21 · la caja vista de arriba: cuatro flechas de ataque; entran dos paredes y quedan dos lados nada más
export const HCornertop: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w1 = eio(tt, 2, 3.4), w2 = eio(tt, 3.2, 4.6);
  const arr = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  return <>
    <At x={960} y={540} s={sp(tt, 0.1)}><div style={{ width: 220, height: 220, borderRadius: 10, background: "linear-gradient(135deg,#5b626b,#2b2f34)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} /></At>
    {arr.map(([dx, dy], i) => { const blocked = (i === 0 && w1 > 0.8) || (i === 3 && w2 > 0.8); return <At key={i} x={960 + dx * 260} y={540 + dy * 260} s={sp(tt, 0.5 + i * 0.2)} rot={Math.atan2(dy, dx) * 180 / Math.PI + 180} o={blocked ? 0.15 : 1}><svg width="140" height="60" viewBox="0 0 140 60"><path d="M0 30 L100 30 M80 8 L110 30 L80 52" stroke={RED} strokeWidth="12" fill="none" strokeLinecap="round" /></svg></At>; })}
    <At x={960} y={540 - 150 - 600 * (1 - w1)} o={w1}><div style={{ width: 760, height: 60, background: "#c8bba6", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} /></At>
    <At x={960 - 150 - 800 * (1 - w2)} y={540} o={w2}><div style={{ width: 60, height: 640, background: "#c8bba6", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} /></At>
    <Tag tt={tt} at={5} x={1380} y={860} txt="TWO SIDES GONE" col={GRN} size={54} />
  </>;
}}</Stage>;

// 22 · el lugar para atacar: palanca detrás, empujón para volcar, maza al costado, carrito abajo; cada uno se tacha cuando la caja va a la esquina con pernos
export const HAttackroom: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const go = eio(tt, 4.6, 6.4);
  const items: [string, number, number, number][] = [["pry", 640, 360, 30], ["sledge", 1300, 420, -40], ["crowbar", 700, 760, -60]];
  return <>
    <At x={960 + 300 * go} y={560 - 120 * go} s={sp(tt, 0.1)}><Safe w={230} bolts={go} /></At>
    {go > 0 && <><At x={1460} y={260} o={go}><div style={{ width: 30, height: 700, background: "#c8bba6" }} /></At><At x={1160} y={240} o={go}><div style={{ width: 600, height: 30, background: "#c8bba6" }} /></At></>}
    {items.map(([k, x, y, r], i) => <React.Fragment key={i}><At x={x} y={y} s={sp(tt, 0.6 + i * 0.6)} rot={r + 6 * Math.sin(tt * 3 + i)} o={1 - go}><Tool k={k} s={1.1} /></At>
      {go > 0.3 && <At x={x} y={y} o={go}><div style={{ width: 200, height: 12, background: RED, transform: "rotate(-30deg)", borderRadius: 6 }} /></At>}</React.Fragment>)}
    <Tag tt={tt} at={0.8} x={960} y={140} txt="ROOM TO WORK" col={RED} size={56} />
    <Tag tt={tt} at={6.6} x={960} y={950} txt="NO ROOM LEFT" col={GRN} size={56} />
  </>;
}}</Stage>;

// 23 · las marcas: rayones que se dibujan solos sobre el canto y el piso, y la caja que nunca se movió una pulgada
export const HGouges: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = eio(tt, 0.8, 4.4);
  return <>
    <At x={960} y={520} s={1.3 * sp(tt, 0.1)}><Safe w={300} bolts={1} dent={d} /></At>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 9 }, (_, i) => { const k = cl(d * 9 - i); return <line key={i} x1={760 + rnd(i) * 360} y1={860 + rnd(i + 2) * 70} x2={760 + rnd(i) * 360 + 120 * k} y2={860 + rnd(i + 2) * 70 + 18 * k} stroke="rgba(230,232,235,.8)" strokeWidth="4" />; })}</svg>
    <At x={960} y={980} s={sp(tt, 4.8)}><div style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 900, fontSize: 44, color: GRN }}><div style={{ width: 120, height: 6, background: GRN }} />0 INCHES MOVED<div style={{ width: 120, height: 6, background: GRN }} /></div></At>
    <Tag tt={tt} at={1.4} x={960} y={130} txt="HOURS OF MARKS" col={AMB} size={54} />
  </>;
}}</Stage>;

export const HEROES_A = {
  slabcore: HSlabcore, doordown: HDoordown, eyescan: HEyescan, dozencycles: HDozencycles, picframe: HPicframe, sightcone: HSightcone,
  frostfilm: HFrostfilm, twomen: HTwomen, tipslide: HTipslide, handles: HHandles, policycap: HPolicycap, tablephoto: HTablephoto,
  lowcorner: HLowcorner, sponge: HSponge, wetrings: HWetrings, workshop: HWorkshop, toolkeys: HToolkeys, chainloop: HChainloop,
  fourhouses: HFourhouses, truckwalk: HTruckwalk, cornertop: HCornertop, attackroom: HAttackroom, gouges: HGouges,
};
