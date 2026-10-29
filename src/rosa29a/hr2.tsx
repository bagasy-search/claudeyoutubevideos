// rosa29a · componentes únicos 13-25. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB, RED, DIM } from "./hkit";
import { Steam, Tape, Big, Jar, Bowl, Table, Shadow } from "./rkit";
import { P, sp, pos } from "./hr1";

const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * k)).join(",")})`;
const Banana: React.FC<{ k: number; w?: number }> = ({ k, w = 300 }) => {
  const col = k < 0.5 ? mix([242, 205, 60], [196, 150, 40], k * 2) : mix([196, 150, 40], [52, 36, 20], (k - 0.5) * 2);
  return <svg width={w} height={w * 0.5} viewBox="0 0 300 150" style={{ overflow: "visible" }}>
    <path d="M 20 40 C 60 140, 240 140, 285 30 C 250 95, 70 100, 20 40 Z" fill={col} stroke="rgba(0,0,0,.35)" strokeWidth={3} />
    {k > 0.25 && [60, 110, 150, 200, 240].map((x, i) => <circle key={i} cx={x} cy={88 + (i % 2) * 8} r={4 + k * 6} fill="#3a2410" opacity={Math.min(1, (k - 0.25) * 3)} />)}
    <rect x={8} y={30} width={22} height={16} rx={4} fill="#4a3a1a" transform="rotate(30 18 38)" />
  </svg>;
};

// 13 · «Los plátanos que se ponían negros… esos eran los mejores… dulces como caramelo»: el plátano madura hasta negro, se rebana y las rodajas se doran
export const Ripe: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ks = [0, eio(tt, 0.6, 1.6) * 0.5, eio(tt, 0.6, 2.4)];
  const cut = eio(tt, 3.6, 4.4), car = eio(tt, 4.6, 6.4);
  return <>
    <Table y={700} />
    {ks.map((k, i) => {
      const s = sp(tt, 0.1 + i * 0.25, 6, 0.5), x = 460 + i * 500, isB = i === 2;
      return <div key={i} style={pos(x, 560 - (1 - cl(s)) * 300, `rotate(${-8 + i * 4}deg)`, { opacity: isB ? 1 - cut : cl(s * 3) * (1 - 0.5 * cut) })}><Banana k={k} /></div>;
    })}
    {cut > 0.01 && Array.from({ length: 6 }, (_, i) => <div key={i} style={pos(1300 + (i - 2.5) * 70 * (1 + cut), 610 + (i % 2) * 20, `scale(${cut})`, { width: 86, height: 86, borderRadius: "50%",
      background: `radial-gradient(circle, ${mix([240, 225, 180], [214, 140, 50], car)} 0 30%, ${mix([228, 205, 150], [170, 95, 30], car)} 60%, ${mix([90, 70, 40], [110, 60, 20], car)} 64%)`, boxShadow: `0 10px 20px rgba(0,0,0,.4), 0 0 ${30 * car}px rgba(255,170,60,${0.5 * car})` })} />)}
    <Tape txt="no los tiraba" x={1460} y={360} s={cl(sp(tt, 2.4, 5, 0.5))} size={60} />
    <Big tt={tt} at={4.8} x={960} y={900} txt="DULCES COMO CARAMELO" size={76} col={AMB} />
  </>;
}}</Stage>;

// 14 · «La leche va caliente encima del pan, en la taza»: el jarro inclina y el chorro de leche cae sobre el pan
export const Pour: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), tilt = eio(tt, 0.7, 1.5) * (1 - eio(tt, 4.4, 5.2)), lvl = eio(tt, 1.3, 4.2);
  return <>
    <Table y={800} />
    <div style={pos(900, 590, `scale(${0.5 + 0.5 * s})`, { width: 340, height: 400, borderRadius: "10px 10px 70px 70px", overflow: "hidden", background: "linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.03) 40%, rgba(255,255,255,.14))", border: "4px solid rgba(255,255,255,.4)", boxShadow: "0 40px 80px rgba(0,0,0,.55)" })}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 70}%`, background: "linear-gradient(180deg,#fbf8f0,#e9e1d0)" }} />
      {[[60, 300], [160, 280], [240, 310], [110, 220], [210, 210]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 40, top: y - 40 - lvl * 30 * (i % 2), width: 84, height: 74, borderRadius: 14, transform: `rotate(${i * 23}deg)`, background: "linear-gradient(160deg,#e9c48a,#b77d3c)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,.15)" }} />)}
    </div>
    <div style={pos(1260, 250, `rotate(${-58 * tilt}deg)`, { width: 230, height: 260, transformOrigin: "20% 20%" })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "16px 16px 40px 40px", background: "linear-gradient(90deg,#8a9096,#e8ecef 40%,#9aa0a6)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", right: -60, top: 50, width: 80, height: 130, borderRadius: "0 50% 50% 0", border: "18px solid #9aa0a6", borderLeft: "none" }} />
    </div>
    {tilt > 0.6 && <div style={{ position: "absolute", left: 1090, top: 270, width: 26 * (tilt - 0.6) * 2.5, height: 470 - lvl * 120, borderRadius: 13, background: "linear-gradient(90deg,#e9e1d0,#fffdf8,#e9e1d0)", transform: "rotate(14deg)", transformOrigin: "50% 0" }} />}
    <Steam tt={tt} x={900} y={400} w={180} h={200} o={lvl} />
    <Big tt={tt} at={1.8} x={520} y={260} txt="LA LECHE" size={90} />
    <Big tt={tt} at={2.2} x={520} y={370} txt="ENCIMA DEL PAN" size={64} col={AMB} />
  </>;
}}</Stage>;

// 15 · «Si te quedó polenta de ayer, la cortas en bastones»: el cuchillo corre por el bloque y los bastones se separan
export const CutGrid: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), spread = eio(tt, 3.2, 4.2);
  const cuts = [0, 1, 2, 3].map((k) => eio(tt, 0.8 + k * 0.5, 1.2 + k * 0.5));
  return <>
    <Table y={680} />
    <div style={pos(960, 640, `perspective(1200px) rotateX(48deg) scale(${0.5 + 0.5 * s})`, { width: 1000, height: 560, borderRadius: 24, background: "linear-gradient(90deg,#8a5a30,#b07a44 40%,#9a6638)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 140 + k * 148 + (k - 2) * 60 * spread, top: 80, width: 140, height: 400, borderRadius: 8,
        background: "linear-gradient(180deg,#f2cf6a,#e2b54a)", boxShadow: "0 18px 24px rgba(0,0,0,.35), inset 0 6px 0 rgba(255,250,200,.6)" }} />)}
      {cuts.map((c, k) => c > 0 && c < 1 ? <div key={k} style={{ position: "absolute", left: 282 + k * 148, top: 80 - 120 + 520 * c, width: 18, height: 220, borderRadius: 4, background: "linear-gradient(90deg,#9aa0a6,#f4f6f8,#9aa0a6)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} /> : null)}
      {cuts.map((c, k) => <div key={"l" + k} style={{ position: "absolute", left: 286 + k * 148 + (k - 1.5) * 60 * spread, top: 80, width: 6, height: 400 * c, background: "rgba(90,60,20,.55)" }} />)}
    </div>
    <Big tt={tt} at={3.4} x={960} y={200} txt="EN BASTONES" size={100} />
    <Tape txt="la de ayer" x={1500} y={330} s={cl(sp(tt, 0.6, 5, 0.5))} size={54} rot={4} />
  </>;
}}</Stage>;

// 16 · «Yo le hacía tortitas de avena y se las envolvía en papel para el camino»: dos tortitas caen sobre el papel madera, que se enrolla y se ata con hilo
export const Wrap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), roll = eio(tt, 2.0, 3.4), tie = eio(tt, 3.6, 4.4);
  return <>
    <Table y={700} />
    <div style={pos(960, 640, `perspective(1200px) rotateX(${50 - 10 * roll}deg) scale(${0.5 + 0.5 * s})`, { width: 700, height: 520 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 520, borderRadius: 6, background: "linear-gradient(135deg,#c9a26a,#b48a52 50%,#a07a46)", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }} />
      {[0, 1].map((k) => { const d = sp(tt, 0.6 + k * 0.4, 6, 0.45); return <div key={k} style={{ position: "absolute", left: 210 + k * 40, top: 120 + k * 30 - (1 - cl(d)) * 400 - k * 30 * 0, width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #e9c88e, #c48d4a 70%, #9a6430)", boxShadow: "0 16px 24px rgba(0,0,0,.35)", opacity: cl(d * 3), transform: `translateZ(${k * 14}px)` }} />; })}
      <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 520, transformOrigin: "50% 0", transform: `rotateX(${-170 * roll}deg)`, borderRadius: 6, background: "linear-gradient(180deg,#d8b47e,#b48a52)", opacity: roll > 0.02 ? 1 : 0, boxShadow: "0 -10px 30px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 340, top: -20, width: 10, height: 560 * tie, background: "#f4efe6", boxShadow: "0 2px 4px rgba(0,0,0,.3)" }} />
    </div>
    <Tape txt="para Tomás" x={1420} y={330} s={cl(sp(tt, 1.4, 5, 0.5))} size={62} rot={-5} />
    <Big tt={tt} at={3.8} x={960} y={190} txt="PARA EL CAMINO" size={92} />
  </>;
}}</Stage>;

// 17 · «Las mojas apenas con agua, con los dedos, como quien riega una planta»: gotas caen de a una sobre los cubitos de pan, que se oscurecen apenas
export const Drops: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  return <>
    <Table y={640} />
    <div style={pos(960, 660, `perspective(1200px) rotateX(52deg) scale(${0.5 + 0.5 * s})`, { width: 900, height: 600 })}>
      {Array.from({ length: 20 }, (_, i) => {
        const r = Math.floor(i / 5), c = i % 5, hit = 0.6 + ((i * 7) % 20) * 0.2, wet = eio(tt, hit + 0.35, hit + 0.9);
        return <div key={i} style={{ position: "absolute", left: 60 + c * 165, top: 40 + r * 140, width: 120, height: 110, borderRadius: 12, transform: `rotate(${(i * 13) % 20 - 10}deg)`,
          background: `linear-gradient(160deg, ${mix([236, 206, 150], [196, 160, 105], wet)}, ${mix([200, 150, 85], [160, 115, 60], wet)})`, boxShadow: "0 14px 0 rgba(120,80,40,.6), 0 26px 30px rgba(0,0,0,.4)" }} />;
      })}
    </div>
    {Array.from({ length: 20 }, (_, i) => {
      const r = Math.floor(i / 5), c = i % 5, hit = 0.6 + ((i * 7) % 20) * 0.2, k = cl((tt - (hit - 0.4)) / 0.4);
      if (k <= 0 || k >= 1) return null;
      return <div key={i} style={pos(560 + c * 200 - r * 10, 120 + (440 + r * 70) * k * k, "", { width: 22, height: 32, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 35%, #fff, #9fd0f0 50%, #5a9cc8)", boxShadow: "0 0 10px rgba(160,210,240,.6)" })} />;
    })}
    <Big tt={tt} at={2.6} x={960} y={160} txt="HÚMEDAS, NO EMPAPADAS" size={80} />
  </>;
}}</Stage>;

// 18 · «Tres ingredientes. Pan, ajo, aceite»: pan, una cabeza de ajo y la botella de aceite giran a su lugar con un «+» entre cada uno
export const Trio: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const items = [0.3, 0.9, 1.5].map((a) => sp(tt, a, 6, 0.45));
  return <>
    <Table y={720} />
    <div style={pos(480, 600 - (1 - cl(items[0])) * 300, `rotate(${(1 - cl(items[0])) * -30}deg)`, { width: 340, height: 190, borderRadius: "95px 95px 26px 26px", background: "linear-gradient(180deg,#c88a45,#8a5422)", boxShadow: "0 30px 50px rgba(0,0,0,.5), inset 0 14px 20px rgba(255,220,160,.35)", opacity: cl(items[0] * 3) })} />
    <div style={pos(960, 590 - (1 - cl(items[1])) * 300, `rotate(${(1 - cl(items[1])) * 30}deg)`, { width: 220, height: 220, opacity: cl(items[1] * 3) })}>
      {[-60, -30, 0, 30, 60].map((dx, i) => <div key={i} style={{ position: "absolute", left: 80 + dx, top: 30 + Math.abs(dx) * 0.3, width: 70, height: 170 - Math.abs(dx) * 0.6, borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%", background: "linear-gradient(90deg,#e9e2d4,#fffdf8,#d9d0bd)", boxShadow: "0 10px 20px rgba(0,0,0,.35)" }} />)}
      <div style={{ position: "absolute", left: 100, top: 0, width: 20, height: 40, borderRadius: 6, background: "#cbbf9f" }} />
    </div>
    <div style={pos(1440, 520 - (1 - cl(items[2])) * 300, `rotate(${(1 - cl(items[2])) * -20}deg)`, { width: 150, height: 420, opacity: cl(items[2] * 3) })}>
      <div style={{ position: "absolute", left: 55, top: 0, width: 40, height: 80, borderRadius: 6, background: "linear-gradient(90deg,#3a5a1a,#7a9a3a,#3a5a1a)" }} />
      <div style={{ position: "absolute", left: 0, top: 70, width: 150, height: 350, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(90deg, rgba(150,170,40,.75), rgba(230,210,90,.85) 40%, rgba(150,150,30,.8))", boxShadow: "0 30px 50px rgba(0,0,0,.5), inset 0 0 0 3px rgba(255,255,255,.3)" }} />
    </div>
    {[720, 1200].map((x, i) => { const s = sp(tt, 0.6 + i * 0.6, 7, 0.4); return <div key={i} style={pos(x, 600, `scale(${s}) rotate(${(1 - cl(s)) * 180}deg)`, { fontWeight: 900, fontSize: 110, color: AMB })}>+</div>; })}
    <Big tt={tt} at={2.2} x={960} y={220} txt="TRES INGREDIENTES" size={92} />
  </>;
}}</Stage>;

// 19 · «El error es tirar el caldo de los frijoles… guárdalo siempre»: la olla inclina y el caldo va al frasco, no a la pileta
export const BrothJar: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), tilt = eio(tt, 0.6, 1.4), fill = eio(tt, 1.2, 3.6), lab = sp(tt, 3.4, 5, 0.5);
  return <>
    <Table y={760} />
    <div style={pos(700, 360, `rotate(${42 * tilt}deg) scale(${0.5 + 0.5 * s})`, { width: 420, height: 280, transformOrigin: "85% 20%" })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 70px 70px", background: "linear-gradient(90deg,#3a2a20,#6a4a34 40%,#4a3426)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, top: -20, width: 420, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,#5a3018,#3a1e0c 70%,#7a5a44 72%)" }} />
    </div>
    {tilt > 0.7 && fill < 0.98 && <div style={{ position: "absolute", left: 1030, top: 330, width: 22, height: 360, borderRadius: 11, background: "linear-gradient(90deg,#4a2810,#8a5a30,#4a2810)" }} />}
    <Shadow x={1040} y={800} w={280} s={s} />
    <div style={pos(1040, 640)}><Jar w={230} fill={fill * 0.8} col="#6a3a1a" lid="#7a5a3a" label="caldo" ls={cl(lab)} /></div>
    <Big tt={tt} at={2.4} x={1500} y={460} txt="GUÁRDALO" size={86} col={AMB} />
    <Big tt={tt} at={2.8} x={1500} y={560} txt="SIEMPRE" size={86} />
  </>;
}}</Stage>;

// 20 · «Una tableta de chocolate que mi madre guardaba arriba del ropero»: la cámara sube por el ropero hasta la tableta escondida, que brilla
export const Wardrobe: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#2a2018,#120d09)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), up = eio(tt, 0.6, 3.0), ch = sp(tt, 2.6, 5, 0.5);
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-560 + 1100 * up - 500}px)` }}>
    <div style={{ position: "absolute", left: 560, top: 400, width: 800, height: 1500, borderRadius: 10, background: "linear-gradient(90deg,#4a2c18,#6b4226 30%,#5a361e 70%,#3a2212)", boxShadow: "0 60px 120px rgba(0,0,0,.7)", transform: `scale(${0.8 + 0.2 * s})` }}>
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 40 + k * 370, top: 120, width: 350, height: 1260, borderRadius: 6, border: "6px solid rgba(0,0,0,.25)", boxShadow: "inset 0 0 40px rgba(0,0,0,.35)" }}>
        <div style={{ position: "absolute", left: k ? 20 : 300, top: 600, width: 24, height: 24, borderRadius: "50%", background: "radial-gradient(circle,#f1d27a,#8a6a1a)" }} />
      </div>)}
      <div style={{ position: "absolute", left: -30, top: -40, width: 860, height: 70, borderRadius: 8, background: "linear-gradient(180deg,#7a4e2c,#4a2c18)" }} />
    </div>
    <div style={{ position: "absolute", left: 1020, top: 300 - (1 - cl(ch)) * 20, width: 260, height: 70, transform: "rotate(-4deg)", opacity: cl(ch * 3) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "repeating-linear-gradient(90deg,#4a2410 0 60px,#2e140a 60px 64px)", boxShadow: `0 0 ${60 * cl(ch)}px rgba(255,190,110,.55), 0 10px 20px rgba(0,0,0,.5)` }} />
      <div style={{ position: "absolute", right: 0, top: -4, width: 120, height: 78, borderRadius: 4, background: "linear-gradient(180deg,#d9c39a,#b89a6a)" }} />
    </div>
    <Tape txt="chocolate de mesa" x={1150} y={180} s={cl(sp(tt, 3.0, 5, 0.5))} size={54} />
    <div style={{ position: "absolute", left: 960, top: 640 }}><Big tt={tt} at={3.4} x={0} y={0} txt="ARRIBA DEL ROPERO" size={84} /></div>
  </div>;
}}</Stage>;

// 21 · «Si cocinas papas para la cena, haz dos de más»: la olla con papas; caen dos más con su «+2»
export const PlusTwo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const Potato: React.FC<{ r?: number }> = ({ r = 0 }) => <div style={{ width: 150, height: 110, borderRadius: "48% 52% 46% 54% / 55% 50% 50% 45%", transform: `rotate(${r}deg)`, background: "radial-gradient(circle at 35% 30%, #d9b07a, #a87a44 60%, #7a5428)", boxShadow: "0 12px 20px rgba(0,0,0,.4), inset 0 0 0 2px rgba(0,0,0,.1)" }} />;
  return <>
    <Table y={760} />
    <div style={pos(860, 620, `scale(${0.5 + 0.5 * s})`, { width: 700, height: 360 })}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 700, height: 290, borderRadius: "0 0 90px 90px", background: "linear-gradient(90deg,#2a2a2a,#5a5a5a 35%,#3a3a3a 70%,#1a1a1a)", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, top: 30, width: 700, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse,#3a2a1a,#1a120a 70%,#6a6a6a 72%)" }} />
      {[[120, 10, 12], [250, 0, -18], [380, 14, 30], [500, 4, -6]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y - 10 }}><Potato r={r} /></div>)}
    </div>
    {[0, 1].map((k) => { const d = sp(tt, 1.0 + k * 0.45, 6, 0.4); return <div key={k} style={{ position: "absolute", left: 1220 + k * 170, top: 560 - (1 - cl(d)) * 500, opacity: cl(d * 3) }}><Potato r={k ? 24 : -12} /><Shadow x={75} y={130} w={160} s={d} /></div>; })}
    <Big tt={tt} at={1.9} x={1380} y={400} txt="+2" size={150} col={AMB} />
    <Big tt={tt} at={2.6} x={860} y={190} txt="DOS DE MÁS" size={96} />
    <Tape txt="el desayuno de mañana" x={1380} y={880} s={cl(sp(tt, 3.4, 5, 0.5))} size={50} />
  </>;
}}</Stage>;

// 22 · «Lo dejas en remojo toda la noche»: la luna cruza el cielo sobre el bol de maíz, que se hincha; amanece
export const Moon: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="#000">{(tt) => {
  const n = eio(tt, 0.4, 5.6), dawn = eio(tt, 4.4, 6.6), sw = eio(tt, 0.8, 5.6);
  const mx = 300 + 1320 * n, my = 520 - 380 * Math.sin(Math.PI * n);
  return <>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${mix([10, 16, 40], [90, 130, 190], dawn)}, ${mix([20, 24, 50], [240, 170, 110], dawn)})` }} />
    {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 211) % 1900, top: (i * 97) % 560, width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: "50%", background: "#fff", opacity: (0.4 + 0.4 * Math.sin(tt * 0.9 + i)) * (1 - dawn) }} />)}
    <div style={pos(mx, my, "", { width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #fffbe8, #e9e2c4 60%, #c9c0a0)", boxShadow: "0 0 80px rgba(255,250,220,.5)", opacity: 1 - dawn })} />
    <div style={pos(960, 1060 - 260 * dawn, "", { width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,#fff3c0,#ffb44a 60%,#ff8a2a)", boxShadow: "0 0 140px rgba(255,170,60,.8)", opacity: dawn })} />
    <Table y={820} o={0.95} />
    <div style={pos(960, 820)}><Bowl w={420} col="#e9e2c8" top={<>{Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + (i * 47) % 330, top: 10 + (i * 29) % 60, width: 22 + 10 * sw, height: 18 + 8 * sw, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fffbe8, #f1e2b0)", boxShadow: "0 2px 3px rgba(0,0,0,.2)" }} />)}</>} /></div>
    <Big tt={tt} at={1.2} x={960} y={210} txt="TODA LA NOCHE" size={100} />
  </>;
}}</Stage>;

// 23 · «El error es el aceite muy caliente: se doran por fuera y quedan crudos por dentro»: el termómetro sube al rojo y el buñuelo cortado muestra el centro crudo
export const Thermo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lv = eio(tt, 0.4, 2.2), cut = eio(tt, 2.8, 3.6);
  return <>
    <div style={pos(560, 520, `scale(${0.5 + 0.5 * s})`, { width: 120, height: 720 })}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 60, height: 620, borderRadius: 30, background: "linear-gradient(90deg,#d8dde2,#fff,#c8ced4)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 46, bottom: 90, width: 28, height: 40 + 470 * lv, borderRadius: 14, background: `linear-gradient(0deg, ${AMB}, ${RED})` }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #ff9a8a, ${RED})`, boxShadow: `0 0 ${50 * lv}px ${RED}` }} />
      <div style={{ position: "absolute", left: 96, top: 40, width: 60, height: 160, background: "repeating-linear-gradient(180deg, rgba(255,90,74,.7) 0 6px, transparent 6px 26px)" }} />
    </div>
    <div style={pos(1200, 560, `scale(${0.5 + 0.5 * s})`, { width: 560, height: 420 })}>
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: k ? 290 : 0, top: 40, width: 270, height: 340, overflow: "hidden", transform: `translateX(${(k ? 1 : -1) * 60 * cut}px) rotate(${(k ? 1 : -1) * 6 * cut}deg)` }}>
        <div style={{ position: "absolute", left: k ? -290 : 0, top: 0, width: 560, height: 340, borderRadius: "50%", background: cut > 0.02 ? "radial-gradient(ellipse, #f4ecd0 0 45%, #e8c98a 55%, #6a3510 70%, #4a2208)" : "radial-gradient(circle at 40% 35%, #b06a2a, #6a3510 70%, #4a2208)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      </div>)}
    </div>
    <Tape txt="crudo por dentro" x={1200} y={880} s={cl(sp(tt, 3.6, 5, 0.5))} size={58} />
    <Big tt={tt} at={1.2} x={1200} y={230} txt="ACEITE MUY CALIENTE" size={82} col={RED} />
  </>;
}}</Stage>;

// 24 · «Si haces la cuenta de la semana, son dos o tres panes que vuelven a tu plato»: siete platos de la semana; tres panes salen del tacho y vuelven
export const BreadBack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const days = ["L", "M", "M", "J", "V", "S", "D"], back = [1, 3, 5];
  return <>
    <Table y={660} />
    <div style={pos(1700, 560, `scale(${cl(sp(tt, 0.1, 5, 0.6))})`, { width: 200, height: 260 })}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 200, height: 230, borderRadius: "10px 10px 26px 26px", background: "repeating-linear-gradient(90deg,#6a6f75 0 18px,#8a9096 18px 36px)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: -12, top: 0, width: 224, height: 40, borderRadius: 10, background: "#9aa0a6", transform: `rotate(${-24 * eio(tt, 0.8, 1.2)}deg)`, transformOrigin: "0 100%" }} />
    </div>
    {days.map((d, i) => {
      const x = 200 + i * 205, s = sp(tt, 0.2 + i * 0.1, 6, 0.5), bi = back.indexOf(i);
      const k = bi >= 0 ? eio(tt, 1.3 + bi * 0.6, 2.2 + bi * 0.6) : 0;
      const bx = 1700 + (x - 1700) * k, by = 520 + (640 - 520) * k - Math.sin(Math.PI * k) * 300;
      return <React.Fragment key={i}>
        <div style={pos(x, 660, `scale(${cl(s)})`, { width: 170, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,#fbf8f0,#e2dccd 66%,#b8b0a0)", boxShadow: "0 16px 24px rgba(0,0,0,.45)" })} />
        <Big tt={tt} at={0.4 + i * 0.1} x={x} y={770} txt={d} size={54} col={bi >= 0 && k > 0.95 ? AMB : DIM} />
        {bi >= 0 && k > 0 && <div style={pos(bx, by - 30, `rotate(${(1 - k) * 220}deg)`, { width: 120, height: 70, borderRadius: "34px 34px 14px 14px", background: "linear-gradient(180deg,#d9a35a,#9a6028)", boxShadow: "0 12px 20px rgba(0,0,0,.4)" })} />}
      </React.Fragment>;
    })}
    <Big tt={tt} at={3.4} x={860} y={260} txt="2 O 3 PANES" size={100} col={AMB} />
    <Big tt={tt} at={3.8} x={860} y={370} txt="VUELVEN A TU PLATO" size={54} />
  </>;
}}</Stage>;

// 25 · «Es la rutina del domingo, y me lleva cuarenta minutos»: el reloj de arena de la cocina corre
export const Sunday: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), k = eio(tt, 0.6, 7.0);
  return <>
    <Table y={820} />
    <div style={pos(960, 520, `scale(${0.5 + 0.5 * s}) rotate(${(1 - cl(s)) * 180}deg)`, { width: 380, height: 640 })}>
      {[0, 1].map((b) => <div key={b} style={{ position: "absolute", left: 10, top: b ? 610 : 0, width: 360, height: 30, borderRadius: 10, background: "linear-gradient(180deg,#7a4e2c,#4a2c18)" }} />)}
      {[0, 1].map((b) => <div key={b} style={{ position: "absolute", left: b ? 330 : 20, top: 20, width: 30, height: 600, borderRadius: 8, background: "linear-gradient(90deg,#5a361e,#8a5a34,#5a361e)" }} />)}
      <svg width={300} height={580} style={{ position: "absolute", left: 40, top: 30 }} viewBox="0 0 300 580">
        <defs><clipPath id="hgTop"><path d="M 20 10 L 280 10 C 280 160, 160 230, 156 290 L 144 290 C 140 230, 20 160, 20 10 Z" /></clipPath>
          <clipPath id="hgBot"><path d="M 144 290 L 156 290 C 160 350, 280 420, 280 570 L 20 570 C 20 420, 140 350, 144 290 Z" /></clipPath></defs>
        <rect x={0} y={10 + 270 * k} width={300} height={290} fill="#e2b96a" clipPath="url(#hgTop)" />
        <path d={`M 20 570 L 280 570 L ${150 + 130 * Math.sqrt(k)} ${570 - 200 * k} L ${150 - 130 * Math.sqrt(k)} ${570 - 200 * k} Z`} fill="#e2b96a" clipPath="url(#hgBot)" />
        {k > 0 && k < 0.99 && <rect x={147} y={288} width={6} height={280 - 200 * k} fill="#e2b96a" />}
        <path d="M 20 10 L 280 10 C 280 160, 160 230, 156 290 C 160 350, 280 420, 280 570 L 20 570 C 20 420, 140 350, 144 290 C 140 230, 20 160, 20 10 Z" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.45)" strokeWidth={5} />
      </svg>
    </div>
    <Big tt={tt} at={1.0} x={480} y={420} txt="DOMINGO" size={92} col={AMB} />
    <Tape txt="40 minutos" x={1440} y={460} s={cl(sp(tt, 1.6, 5, 0.5))} size={66} rot={4} />
    <Big tt={tt} at={2.2} x={960} y={960} txt="PARA NO COCINAR CADA DÍA" size={58} />
  </>;
}}</Stage>;
