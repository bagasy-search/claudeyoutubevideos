// rk29c · componentes únicos 24-45 (cada uno UNA vez en toda la tanda; registro en D:/rtmp/rk29_COMPONENTES.md).
// El mueble que esconde, los pernos que sostienen, el agujero derecho y sin polvo, los cables tensados, el carro rojo de Carl, la caja en la vereda…
import React from "react";
import { H, Stage, Tag, phys, cl, eio, TX } from "./hkit";
import { AMB, RED, ICE, GRN, rnd, At, Safe, Slab, Tool, Chest, Can, Box, Truck, GHouse, Anchor, Drop } from "./safedraw";

type P = { t: number; h: H };
const sp = (tt: number, a: number) => cl(phys(tt, a));

// 24 · el mueble se arma alrededor: laterales, tapa y puertas caen con peso y la caja desaparece adentro
export const HCabwrap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = sp(tt, 1.2), R = sp(tt, 1.7), T = sp(tt, 2.3), D = eio(tt, 3.2, 4.6);
  return <>
    <At x={960} y={600} s={sp(tt, 0.1)}><Safe w={240} bolts={1} /></At>
    <At x={960 - 190 - 500 * (1 - L)} y={560} o={L}><div style={{ width: 40, height: 420, background: "linear-gradient(90deg,#8a8f96,#5e636a)" }} /></At>
    <At x={960 + 190 + 500 * (1 - R)} y={560} o={R}><div style={{ width: 40, height: 420, background: "linear-gradient(90deg,#5e636a,#8a8f96)" }} /></At>
    <At x={960} y={340 - 400 * (1 - T)} o={T}><div style={{ width: 460, height: 40, background: "#a7682f", borderRadius: 4 }} /></At>
    {[-1, 1].map((s) => <At key={s} x={960 + s * 92} y={570} o={D}><div style={{ width: 180, height: 400, background: "linear-gradient(160deg,#7c8188,#50555c)", transform: `perspective(900px) rotateY(${s * 80 * (1 - D)}deg)`, transformOrigin: s < 0 ? "0 50%" : "100% 50%", boxShadow: "inset 0 0 0 4px rgba(0,0,0,.2)" }}><div style={{ position: "absolute", top: "45%", [s < 0 ? "right" : "left"]: 16, width: 10, height: 50, background: "#d7dade", borderRadius: 4 }} /></div></At>)}
    <Tag tt={tt} at={4.8} x={960} y={140} txt="JUST A CABINET" col={AMB} size={60} />
  </>;
}}</Stage>;

// 25 · rayos X: el mueble se vuelve fantasma y lo único que brilla son los pernos en el concreto
export const HXraybolts: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #0e2432, #03080c 75%)">{(tt) => {
  const x = eio(tt, 1, 2.6);
  return <>
    <At x={960} y={760} s={sp(tt, 0.1)}><div style={{ width: 900, height: 140, background: "rgba(143,214,255,.12)", border: "2px solid rgba(143,214,255,.4)" }} /></At>
    <At x={960} y={500} s={sp(tt, 0.2)} o={1 - 0.75 * x}><div style={{ width: 480, height: 420, border: "6px solid #9fc3dd", background: "rgba(143,214,255,.08)" }} /></At>
    <At x={960} y={520} s={sp(tt, 0.4)} o={0.35 + 0.3 * (1 - x)}><div style={{ width: 260, height: 300, border: "4px solid #9fc3dd" }} /></At>
    {[-1, 1].map((s) => <At key={s} x={960 + s * 100} y={720} s={sp(tt, 2.4)}><div style={{ width: 26, height: 170, borderRadius: 6, background: AMB, boxShadow: `0 0 ${30 + 16 * Math.sin(tt * 3)}px ${AMB}` }} /></At>)}
    <Tag tt={tt} at={1.4} x={600} y={170} txt="CABINET HIDES" col={ICE} size={52} />
    <Tag tt={tt} at={3} x={1320} y={950} txt="BOLTS HOLD" col={AMB} size={60} />
  </>;
}}</Stage>;

// 26 · derecho contra torcido: dos agujeros en corte; tiran de los dos pernos y el torcido sale con la cuña rota
export const HStraighthole: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pull = eio(tt, 3, 5);
  return <>
    <At x={960} y={720} s={sp(tt, 0.1)}><Slab w={1300} h={300} /></At>
    <At x={640} y={640 - 260 * pull} s={sp(tt, 0.6)} rot={14}><Anchor len={260} /></At>
    <At x={1280} y={640} s={sp(tt, 0.8)}><Anchor len={260} spread={eio(tt, 1.6, 2.4)} /></At>
    <Tag tt={tt} at={1} x={640} y={240} txt="CROOKED" col={RED} size={58} />
    <Tag tt={tt} at={1.4} x={1280} y={240} txt="STRAIGHT" col={GRN} size={58} />
  </>;
}}</Stage>;

// 27 · el polvo: el ancla aprieta contra polvo y patina; se aspira el agujero y la cuña muerde la piedra
export const HDustgrip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const vac = eio(tt, 3.4, 5.2), slip = tt < 3.4 ? 14 * Math.abs(Math.sin(tt * 4)) : 0;
  return <>
    <At x={960} y={720} s={sp(tt, 0.1)}><Slab w={1000} h={320} /></At>
    <At x={960} y={720} s={sp(tt, 0.2)}><div style={{ width: 90, height: 280, background: "#3b3935", position: "relative", top: -20 }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 80, top: 280 - rnd(i + 3) * 130 * (1 - vac) - 4, width: 8, height: 8, borderRadius: "50%", background: "#cfcac1", opacity: 1 - vac }} />)}</div></At>
    <At x={960} y={650 - slip} s={sp(tt, 0.6)}><Anchor len={240} spread={vac} /></At>
    {vac > 0 && vac < 1 && Array.from({ length: 12 }, (_, i) => <At key={i} x={960 + Math.sin(i) * 40} y={500 - ((tt * 300 + i * 60) % 300)}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#cfcac1" }} /></At>)}
    <Tag tt={tt} at={1} x={960} y={200} txt={vac > 0.6 ? "CLEAN HOLE, TIGHT GRIP" : "DUST = NO GRIP"} col={vac > 0.6 ? GRN : RED} size={56} />
  </>;
}}</Stage>;

// 28 · la prueba: dos manos tiran del borde; la caja ni se mueve y los pernos se iluminan bajo tensión
export const HPulltest: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const tug = Math.max(0, Math.sin((tt - 1) * 3)) * (tt > 1 ? 1 : 0);
  return <>
    <At x={960} y={820} s={sp(tt, 0.1)}><div style={{ width: 1100, height: 30, background: "#8d8a84", borderRadius: 6 }} /></At>
    <At x={960} y={560} s={1.2 * sp(tt, 0.2)}><Safe w={260} bolts={1} glowBolts={tug} /></At>
    {[-1, 1].map((s) => <At key={s} x={960 + s * 150 - 30 * tug * s} y={330} s={sp(tt, 0.6)}><div style={{ width: 120, height: 70, borderRadius: 30, background: "#c99a78", boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} /></At>)}
    <Tag tt={tt} at={3.4} x={960} y={150} txt="NOT A WIGGLE" col={GRN} size={64} />
  </>;
}}</Stage>;

// 29 · taquito de plástico contra perno de expansión: el taco sale con un tirón, el de acero no
export const HSleeves: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const p = eio(tt, 2.4, 4.2);
  return <>
    <At x={960} y={760} s={sp(tt, 0.1)}><Slab w={1200} h={260} /></At>
    <At x={620} y={640 - 420 * p} s={1.4 * sp(tt, 0.5)} rot={30 * p}><Anchor k="sleeve" /></At>
    <At x={1300} y={640} s={sp(tt, 0.7)}><Anchor len={250} spread={1} /></At>
    <Tag tt={tt} at={1.2} x={620} y={200} txt="PICTURE HANGER" col={RED} size={48} />
    <Tag tt={tt} at={1.6} x={1300} y={200} txt="CONCRETE ANCHOR" col={GRN} size={48} />
  </>;
}}</Stage>;

// 30 · el borde: un agujero pegado al canto de la losa; al apretar, se desprende un triángulo de concreto
export const HEdgespall: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = eio(tt, 3, 4.2);
  return <>
    <At x={900} y={680} s={sp(tt, 0.1)}><Slab w={900} h={300} /></At>
    <At x={1300 + 140 * c} y={620 + 300 * c * c} rot={40 * c} s={sp(tt, 0.3)}><div style={{ width: 150, height: 210, background: "linear-gradient(160deg,#a19d96,#6c6964)", clipPath: "polygon(0 0,100% 0,100% 100%)" }} /></At>
    <At x={1270} y={580 - 30 * c} s={sp(tt, 0.6)} rot={22 * c}><Anchor len={200} spread={eio(tt, 1.6, 3)} /></At>
    <Tag tt={tt} at={1.4} x={900} y={200} txt="A FEW INCHES IN" col={AMB} size={56} />
  </>;
}}</Stage>;

// 31 · cables tensados: corte de la losa con dos cables que vibran; la broca baja, ve el cartel y se detiene
export const HTendons: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const drill = 200 * eio(tt, 1.6, 3.4) - 120 * eio(tt, 4.8, 6);
  return <>
    <At x={960} y={700} s={sp(tt, 0.1)}><Slab w={1300} h={300} cables={sp(tt, 0.6)} hum={tt} /></At>
    <At x={960} y={340 + drill} s={sp(tt, 0.4)}><div style={{ width: 26, height: 260, background: "repeating-linear-gradient(160deg,#c9ccd1 0 10px,#7d8288 10px 18px)", borderRadius: "0 0 13px 13px" }} /></At>
    <At x={960} y={170 + drill} s={sp(tt, 0.4)}><div style={{ width: 140, height: 120, borderRadius: 16, background: "#d8a52c" }} /></At>
    <At x={1460} y={330} s={sp(tt, 3.6)}><div style={{ padding: "16px 30px", borderRadius: 10, background: "#f2c14e", color: "#1d1f24", fontWeight: 900, fontSize: 40, border: "6px solid #1d1f24" }}>POST-TENSION</div></At>
    <Tag tt={tt} at={4.8} x={960} y={960} txt="STOP. CALL A PRO." col={RED} size={58} />
  </>;
}}</Stage>;

// 32 · el armado de Carl, desarmado en el aire: caja abulonada, caja de terciado gris, carro rojo delante, latas arriba
export const HCarlstack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ex = 1 - eio(tt, 5, 7.6);
  return <>
    <At x={960 - 420 * ex} y={560} s={0.8 * sp(tt, 0.2)}><Safe w={220} bolts={1} /></At>
    <At x={960 - 140 * ex} y={540} s={sp(tt, 1)} o={0.92}><div style={{ width: 340, height: 360, background: "linear-gradient(160deg,#9a9a96,#6e6e6a)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} /></At>
    {[0, 1, 2].map((i) => <At key={i} x={890 + i * 80 - 140 * ex + 200 * ex * (i - 1)} y={330 - 240 * ex} s={sp(tt, 1.8 + i * 0.3)}><Can w={80} col={["#6a8fb0", "#b0706a", "#8aa06a"][i]} /></At>)}
    <At x={960 + 380 * ex} y={640} s={sp(tt, 2.8)}><Chest w={280} /></At>
    {ex > 0.2 && [["SAFE", 540], ["GRAY BOX", 820], ["PAINT", 1080], ["RED CHEST", 1340]].map(([n, x], i) => <Tag key={i} tt={tt} at={1 + i * 0.6} x={x as number} y={900} txt={n as string} col={TX} size={36} />)}
    <Tag tt={tt} at={7.8} x={960} y={130} txt="LOOKS LIKE NOTHING" col={AMB} size={58} />
  </>;
}}</Stage>;

// 33 · cómo entra Carl: el carro rueda un pie, las latas suben, la tapa se abre y asoma el dial
export const HRollaside: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const r = eio(tt, 0.6, 2.2), c = eio(tt, 2.6, 4), l = eio(tt, 4.4, 5.8);
  return <>
    <At x={960} y={540} s={sp(tt, 0.1)}><div style={{ width: 380, height: 380, background: "linear-gradient(160deg,#9a9a96,#6e6e6a)", position: "relative", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 50, top: 30, transform: "scale(.9)", transformOrigin: "0 0", opacity: l }}><Safe w={260} /></div>
      <div style={{ position: "absolute", left: -10, top: -20, width: 400, height: 30, background: "#8a8a86", transformOrigin: "0 100%", transform: `rotate(${-70 * l}deg)` }} /></div></At>
    {[0, 1, 2].map((i) => <At key={i} x={880 + i * 80 + 400 * c} y={300 - 160 * c} s={sp(tt, 0.3)}><Can w={80} /></At>)}
    <At x={960 - 420 * r} y={660} s={sp(tt, 0.2)}><Chest w={300} /></At>
    <At x={960 - 210 * r} y={900} o={r}><div style={{ fontWeight: 900, fontSize: 40, color: AMB }}>ONE FOOT</div></At>
    <Tag tt={tt} at={6} x={1400} y={170} txt="THIRTY SECONDS IN" col={GRN} size={50} />
  </>;
}}</Stage>;

// 34 · el recorrido del ladrón visto de arriba: huellas que pasan por el carro y siguen de largo a 18 pulgadas
export const HPathpast: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.min(18, Math.floor((tt - 0.8) / 0.3));
  const pts = Array.from({ length: 18 }, (_, i) => [420 + i * 70, 860 - 280 * Math.sin(i / 17 * Math.PI) - (i > 8 && i < 13 ? 60 : 0)]);
  return <div style={{ position: "absolute", inset: 0, transform: "perspective(1800px) rotateX(48deg)", transformOrigin: "50% 60%" }}>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 760, background: "#2f2c28", boxShadow: "inset 0 0 0 8px #5e554b" }} />
    <At x={1000} y={420} s={sp(tt, 0.2)}><div style={{ width: 180, height: 120, borderRadius: 10, background: "#c7342a" }} /></At>
    <At x={1000} y={300} s={sp(tt, 0.3)}><div style={{ width: 220, height: 100, background: "#8a8a86", boxShadow: tt > 6 ? `0 0 40px ${AMB}` : "none" }} /></At>
    {pts.slice(0, Math.max(0, n)).map(([x, y], i) => <At key={i} x={x} y={y + (i % 2 ? -18 : 18)} rot={90 - 20 * Math.cos(i / 17 * Math.PI)}><div style={{ width: 26, height: 54, borderRadius: "45%", background: "#e7dfcf", opacity: 0.85 }} /></At>)}
    <Tag tt={tt} at={6} x={1000} y={170} txt="18 INCHES AWAY" col={AMB} size={54} />
  </div>;
}}</Stage>;

// 35 · el ojo que tasa: bicis, herramientas y generador se encienden con valor; las latas de pintura quedan grises
export const HValuescan: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const scan = 260 + 1400 * eio(tt, 0.6, 5.4);
  const items: [number, React.ReactNode, boolean][] = [
    [380, <Tool k="grinder" s={1.2} />, true], [700, <Tool k="sledge" s={1.2} />, true],
    [1040, <div style={{ display: "flex", gap: 10 }}><Can w={100} dull={1} /><Can w={100} dull={1} /></div>, false], [1420, <Truck w={300} col="#3a6a8a" />, true]];
  return <>
    {items.map(([x, el, hot], i) => { const on = scan > x; return <At key={i} x={x} y={560} s={sp(tt, 0.2 + i * 0.2)}><div style={{ filter: on && hot ? `drop-shadow(0 0 24px ${AMB})` : on ? "grayscale(1) brightness(.7)" : undefined }}>{el}</div></At>; })}
    <div style={{ position: "absolute", left: scan, top: 260, width: 6, height: 600, background: `linear-gradient(180deg,transparent,${AMB},transparent)` }} />
    <Tag tt={tt} at={5.6} x={1040} y={860} txt="NOT WORTH A LOOK" col={TX} size={44} />
  </>;
}}</Stage>;

// 36 · el foco del ladrón barre el garage y salta sobre el rincón aburrido sin detenerse
export const HSpotskip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="#050506">{(tt) => {
  const x = 400 + 1100 * ((Math.sin(tt * 0.9 - 1.4) + 1) / 2), atCorner = Math.abs(x - 1400) < 160;
  return <>
    <At x={500} y={600}><Tool k="crowbar" s={1.3} /></At><At x={800} y={600}><Chest w={220} /></At>
    <At x={1400} y={640}><div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}><div style={{ width: 240, height: 240, background: "#6e6e6a" }} /><Can w={70} /></div></At>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${x}px 600px, transparent ${atCorner ? 60 : 230}px, rgba(0,0,0,.94) ${atCorner ? 110 : 280}px)` }} />
    <Tag tt={tt} at={2} x={960} y={150} txt="BORING BEATS CLEVER" col={AMB} size={64} />
  </>;
}}</Stage>;

// 37 · el garage respira calor y frío: el sol sube y baja, el termómetro de pared va de 100 °F a bajo cero
export const HHeatswing: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ph = Math.sin(tt * 0.9), temp = Math.round(45 + 60 * ph), hot = ph > 0;
  return <>
    <At x={960 + 600 * Math.cos(tt * 0.9 + Math.PI / 2)} y={300 - 140 * ph}><div style={{ width: 150, height: 150, borderRadius: "50%", background: hot ? "radial-gradient(#fff3c4,#ffb257)" : "radial-gradient(#f4f6fa,#9fb4c8)", boxShadow: `0 0 80px ${hot ? AMB : ICE}` }} /></At>
    <At x={760} y={640} s={sp(tt, 0.1)}><GHouse w={600} /></At>
    <At x={1420} y={600} s={sp(tt, 0.3)}><div style={{ width: 70, height: 420, borderRadius: 35, background: "#e8e6e2", position: "relative", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 20, bottom: 50, width: 30, height: 40 + 2.6 * (temp + 15), borderRadius: 15, background: hot ? RED : ICE }} /><div style={{ position: "absolute", left: 5, bottom: 5, width: 60, height: 60, borderRadius: "50%", background: hot ? RED : ICE }} /></div></At>
    <At x={1620} y={420} s={sp(tt, 0.5)}><div style={{ fontWeight: 900, fontSize: 80, color: hot ? RED : ICE, fontVariantNumeric: "tabular-nums" }}>{temp}°F</div></At>
    <Tag tt={tt} at={1} x={760} y={930} txt="WORST WEATHER IN THE HOUSE" col={TX} size={42} />
  </>;
}}</Stage>;

// 38 · el reloj del incendio: llamas afuera de la caja, adentro el papel aguanta mientras la aguja recorre los minutos del rating
export const HFiretime: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const m = Math.min(60, Math.floor(tt * 8)), burn = cl((tt - 8) / 2);
  return <>
    {Array.from({ length: 10 }, (_, i) => <At key={i} x={620 + i * 76} y={830 - 40 * Math.abs(Math.sin(tt * 1.6 + i))}><div style={{ width: 60, height: 160 + 50 * Math.sin(tt * 1.3 + i * 2), borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 80%, #fff1b0, #ff8a3d 50%, rgba(255,60,30,0) 75%)", opacity: 0.85 }} /></At>)}
    <At x={960} y={560} s={sp(tt, 0.2)}><Safe w={300} open={0.6} /></At>
    <At x={960} y={590} s={sp(tt, 0.6)}><div style={{ width: 150, height: 110, background: "#efe6cf", filter: `sepia(${burn}) brightness(${1 - 0.6 * burn})`, transform: "rotate(-3deg)" }} /></At>
    <At x={1520} y={360} s={sp(tt, 0.4)}><div style={{ width: 240, height: 240, borderRadius: "50%", background: "#f4f2ee", position: "relative", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 117, top: 20, width: 6, height: 100, background: RED, transformOrigin: "3px 100px", transform: `rotate(${m * 6}deg)`, borderRadius: 3 }} />
      <div style={{ position: "absolute", width: "100%", top: 150, textAlign: "center", fontWeight: 900, fontSize: 38, color: "#1d1f24" }}>{m} MIN</div></div></At>
    <Tag tt={tt} at={1.2} x={1520} y={140} txt="RATED, NOT FOREVER" col={AMB} size={46} />
  </>;
}}</Stage>;

// 39 · la base de concreto: el agua sube por el garage hasta su marca; la caja, sobre cuatro pulgadas, queda arriba
export const HRaisedpad: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pad = eio(tt, 0.8, 2.6), water = 3 * Math.sin(Math.PI * cl((tt - 3) / 6)) * 30;
  return <>
    <At x={960} y={880} s={sp(tt, 0.1)}><div style={{ width: 1500, height: 30, background: "#8d8a84" }} /></At>
    <At x={1060} y={866 - 60 * pad} o={pad}><div style={{ width: 420, height: 120 * pad, background: "linear-gradient(180deg,#b5b1aa,#8d8a84)" }} /></At>
    <At x={1060} y={630 - 120 * pad} s={sp(tt, 0.3)}><Safe w={240} bolts={1} /></At>
    <div style={{ position: "absolute", left: 210, right: 210, top: 865 - water, height: water, background: "rgba(74,168,224,.55)", borderTop: "4px solid rgba(200,235,255,.8)" }} />
    {Array.from({ length: 6 }, (_, i) => <At key={i} x={300 + i * 230} y={860 - water + 6 * Math.sin(tt * 3 + i)}><Drop s={16} /></At>)}
    <At x={1420} y={760 - 120 * pad} s={sp(tt, 2.6)}><div style={{ fontWeight: 900, fontSize: 46, color: GRN }}>+4 IN</div></At>
    <Tag tt={tt} at={4} x={700} y={240} txt="ABOVE THE WATER LINE" col={ICE} size={52} />
  </>;
}}</Stage>;

// 40 · la caja en la vereda es un cartel: los autos pasan y cada uno «lee» la foto de la caja fuerte
export const HBillboard: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const cx = -300 + ((tt * 420) % 2500);
  return <>
    <At x={760} y={520} s={0.9 * sp(tt, 0.1)}><GHouse w={640} /></At>
    <At x={1380} y={640} s={sp(tt, 0.4)} rot={-4}><Box w={300} /></At>
    <At x={1520} y={760} s={sp(tt, 0.3)}><div style={{ width: 110, height: 150, borderRadius: "10px 10px 4px 4px", background: "#3a5a3a" }} /></At>
    <At x={960} y={900}><div style={{ width: 2000, height: 120, background: "#3a3a3c" }} /></At>
    <At x={cx} y={880}><Truck w={360} col="#7a3a3a" /></At>
    {Math.abs(cx - 1380) < 300 && <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}><line x1={cx} y1={860} x2={1380} y2={640} stroke={AMB} strokeWidth="5" strokeDasharray="14 10" /></svg>}
    <Tag tt={tt} at={1.4} x={960} y={130} txt="A SIGN FOR THE STREET" col={RED} size={56} />
  </>;
}}</Stage>;

// 41 · cortala en pedazos: la caja se despliega, se corta en baldosas y cada una se da vuelta del lado liso
export const HCuttiles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const cut = eio(tt, 1.6, 2.6);
  return <>{Array.from({ length: 12 }, (_, i) => {
    const c = i % 4, r = Math.floor(i / 4), f = eio(tt, 3 + i * 0.25, 3.6 + i * 0.25);
    return <At key={i} x={720 + c * 160 + (c - 1.5) * 40 * cut} y={380 + r * 180 + (r - 1) * 40 * cut} s={sp(tt, 0.2)}>
      <div style={{ width: 160, height: 180, transform: `perspective(800px) rotateY(${180 * f}deg)`, background: f < 0.5 ? "#b88a52" : "#a47a46", overflow: "hidden", position: "relative", boxShadow: "inset 0 0 0 2px rgba(0,0,0,.15)" }}>
        {f < 0.5 && <div style={{ position: "absolute", left: -c * 160 + 140, top: -r * 180 + 60, transform: "scale(1.6)", transformOrigin: "0 0" }}><Safe w={200} /></div>}</div></At>;
  })}
    <Tag tt={tt} at={6.6} x={960} y={950} txt="PRINTED SIDE IN" col={AMB} size={54} />
  </>;
}}</Stage>;

// 42 · la cadena del parasol: control del portón → registro en la guantera → dirección → el portón que sube solo
export const HVisorchain: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const steps = [[360, "REMOTE"], [760, "REGISTRATION"], [1160, "ADDRESS"], [1560, "DOOR OPENS"]] as const;
  return <>
    {steps.map(([x, n], i) => { const k = sp(tt, 0.6 + i * 1.6); return <React.Fragment key={i}>
      <At x={x} y={520} s={k}><div style={{ width: 230, height: 230, borderRadius: 30, background: "#1d1f24", boxShadow: `0 0 0 4px ${i === 3 ? RED : AMB}, 0 30px 50px rgba(0,0,0,.6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {i === 0 && <div style={{ width: 90, height: 130, borderRadius: 18, background: "#3a3d42", display: "flex", flexDirection: "column", gap: 10, alignItems: "center", justifyContent: "center" }}>{[0, 1].map((j) => <div key={j} style={{ width: 40, height: 26, borderRadius: 6, background: "#8d9096" }} />)}</div>}
        {i === 1 && <div style={{ width: 150, height: 110, background: "#efe6cf", padding: 12, boxSizing: "border-box" }}>{[0, 1, 2, 3].map((j) => <div key={j} style={{ height: 8, marginBottom: 12, width: `${90 - j * 15}%`, background: "#8a7a5a" }} />)}</div>}
        {i === 2 && <svg width="120" height="150" viewBox="0 0 40 50"><path d="M20 48 C 6 30, 4 22, 4 16 A 16 16 0 0 1 36 16 C 36 22, 34 30, 20 48Z" fill={AMB} /><circle cx="20" cy="16" r="6" fill="#1d1f24" /></svg>}
        {i === 3 && <div style={{ width: 160, height: 120, background: "#2a2622", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120 * (1 - eio(tt, 6, 7.4)), background: "#ece8e0" }} /></div>}
      </div></At>
      <Tag tt={tt} at={0.9 + i * 1.6} x={x} y={720} txt={n} col={TX} size={36} />
      {i < 3 && <At x={x + 200} y={520} s={sp(tt, 1.4 + i * 1.6)}><svg width="80" height="40" viewBox="0 0 80 40"><path d="M0 20 L60 20 M44 6 L64 20 L44 34" stroke={AMB} strokeWidth="7" fill="none" strokeLinecap="round" /></svg></At>}
    </React.Fragment>; })}
    <Tag tt={tt} at={7.6} x={960} y={200} txt="KEEP IT ON YOUR KEYS" col={GRN} size={54} />
  </>;
}}</Stage>;

// 43 · el botón de vacaciones: se aprieta LOCK en el panel de pared y los controles de afuera rebotan sin efecto
export const HVacationbtn: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lk = eio(tt, 1.4, 1.8);
  return <>
    <At x={700} y={540} s={1.2 * sp(tt, 0.1)}><div style={{ width: 260, height: 380, borderRadius: 24, background: "linear-gradient(160deg,#f2efe9,#cfcac1)", position: "relative", boxShadow: "0 30px 50px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 50, top: 50, width: 160, height: 160, borderRadius: 20, background: "#ddd8cf", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.15)" }} />
      <div style={{ position: "absolute", left: 70, top: 260, width: 120, height: 60, borderRadius: 14, background: lk > 0.5 ? RED : "#bdb7ac", color: "#fff", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${4 * Math.sin(lk * Math.PI)}px)`, boxShadow: lk > 0.5 ? `0 0 30px ${RED}` : "none" }}>LOCK</div></div></At>
    {[0, 1, 2].map((i) => { const k = cl((tt - 2.4 - i * 1.4) / 1.2); return k > 0 ? <At key={i} x={1660 - 460 * Math.sin(k * Math.PI)} y={380 + i * 160}><div style={{ width: 70, height: 100, borderRadius: 16, background: "#3a3d42", boxShadow: `0 0 0 3px ${k > 0.4 && k < 0.6 ? RED : "#555"}` }} /></At> : null; })}
    <Tag tt={tt} at={2.6} x={1300} y={180} txt="REMOTES GO DEAD" col={RED} size={54} />
  </>;
}}</Stage>;

// 44 · nunca la llave al lado del candado: la llave del clavo vuela lejos, a un libro en otro cuarto
export const HKeyhook: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const f = eio(tt, 2.4, 4.8), x = 760 + 820 * f, y = 460 - 260 * Math.sin(f * Math.PI);
  return <>
    <At x={620} y={540} s={sp(tt, 0.1)}><div style={{ width: 420, height: 520, background: "#8a6542", backgroundImage: "radial-gradient(circle, #3a2716 3px, transparent 3.5px)", backgroundSize: "34px 34px", borderRadius: 6 }} /></At>
    <At x={560} y={560} s={sp(tt, 0.3)}><svg width="140" height="180" viewBox="0 0 40 50"><path d="M10 22 L10 12 Q20 0 30 12 L30 22" fill="none" stroke="#c9ccd1" strokeWidth="5" /><rect x="4" y="20" width="32" height="28" rx="4" fill="#c9a24a" /></svg></At>
    <At x={760} y={420} s={sp(tt, 0.3)}><div style={{ width: 10, height: 30, background: "#555" }} /></At>
    <At x={x} y={y} rot={f * 300} s={sp(tt, 0.5)}><svg width="70" height="170" viewBox="0 0 40 100"><circle cx="20" cy="16" r="14" fill="none" stroke="#e8c46a" strokeWidth="6" /><path d="M17 30 L23 30 L23 90 L30 90 L30 82 L36 82 L36 74 L23 74 L23 30" fill="#e8c46a" /></svg></At>
    <At x={1600} y={620} s={sp(tt, 2)}><div style={{ width: 220, height: 280, borderRadius: "6px 14px 14px 6px", background: "linear-gradient(90deg,#4a2a20,#7a3a2a)", boxShadow: "0 30px 40px rgba(0,0,0,.55)" }} /></At>
    <Tag tt={tt} at={0.9} x={620} y={200} txt="WALT'S RULE" col={AMB} size={52} />
    <Tag tt={tt} at={5} x={1500} y={940} txt="SOMEWHERE BORING" col={GRN} size={48} />
  </>;
}}</Stage>;

// 45 · las dos mitades: originales viajan a la bóveda del banco, copias y lo de todos los días quedan en casa
export const HBankhome: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = eio(tt, 1.6, 3.8);
  return <>
    <At x={460} y={560} s={sp(tt, 0.1)}><div style={{ width: 420, height: 380, background: "linear-gradient(180deg,#c9c4b8,#8e8a80)", clipPath: "polygon(0 22%,50% 0,100% 22%,100% 100%,0 100%)", position: "relative" }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 50 + i * 90, top: 130, width: 30, height: 220, background: "#e8e4d8" }} />)}</div></At>
    <At x={1460} y={600} s={sp(tt, 0.2)}><GHouse w={460} lit={0.4} /></At>
    {["DEED", "WILL", "TITLE"].map((n, i) => <At key={i} x={960 - 420 * go} y={420 + i * 110 - 160 * Math.sin(go * Math.PI)} s={sp(tt, 0.6 + i * 0.2)} rot={-6 + i * 6}><div style={{ padding: "10px 24px", background: "#efe6cf", color: "#3a2e22", fontWeight: 900, fontSize: 32, boxShadow: "0 10px 16px rgba(0,0,0,.45)" }}>{n}</div></At>)}
    {["COPIES", "CASH", "PASSPORTS"].map((n, i) => <At key={i} x={960 + 420 * go} y={420 + i * 110 - 160 * Math.sin(go * Math.PI)} s={sp(tt, 0.8 + i * 0.2)} rot={6 - i * 6}><div style={{ padding: "10px 24px", background: "#dfe8f0", color: "#22303a", fontWeight: 900, fontSize: 32, boxShadow: "0 10px 16px rgba(0,0,0,.45)" }}>{n}</div></At>)}
    <Tag tt={tt} at={4.2} x={960} y={150} txt="FOR MOST PEOPLE, BOTH" col={AMB} size={56} />
  </>;
}}</Stage>;

export const HEROES_B = {
  cabwrap: HCabwrap, xraybolts: HXraybolts, straighthole: HStraighthole, dustgrip: HDustgrip, pulltest: HPulltest, sleeves: HSleeves,
  edgespall: HEdgespall, tendons: HTendons, carlstack: HCarlstack, rollaside: HRollaside, pathpast: HPathpast, valuescan: HValuescan,
  spotskip: HSpotskip, heatswing: HHeatswing, firetime: HFiretime, raisedpad: HRaisedpad, billboard: HBillboard, cuttiles: HCuttiles,
  visorchain: HVisorchain, vacationbtn: HVacationbtn, keyhook: HKeyhook, bankhome: HBankhome,
};
