// rosa29a · componentes únicos 26-37. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB, RED, ICE } from "./hkit";
import { Steam, Tape, Big, Jar, Bowl, Table, Shadow, HAND } from "./rkit";
import { P, sp, pos } from "./hr1";

// 26 · «La cocino, y la reparto en tres frascos de vidrio para el lunes, el martes y el miércoles»: tres frascos se llenan de a uno
export const Jars3: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const dd = ["lunes", "martes", "miércoles"];
  return <>
    <Table y={780} />
    {dd.map((d, i) => {
      const s = sp(tt, 0.1 + i * 0.25, 6, 0.5), f = eio(tt, 0.9 + i * 1.0, 1.8 + i * 1.0), x = 560 + i * 400;
      return <React.Fragment key={i}>
        <Shadow x={x} y={810} w={260} s={s} />
        <div style={pos(x, 600 - (1 - cl(s)) * 400, "", { opacity: cl(s * 3) })}><Jar w={220} fill={f * 0.85} col="#e3d3a6" lid={["#b33a2c", "#1d4e8f", "#3a7a3a"][i]} label={d} ls={cl(sp(tt, 1.6 + i * 1.0, 5, 0.5))} /></div>
        {f > 0.02 && f < 0.98 && <div style={{ position: "absolute", left: x - 14, top: 120, width: 28, height: 330 - f * 140, borderRadius: 14, background: "linear-gradient(90deg,#c9b480,#efe0b6,#c9b480)" }} />}
      </React.Fragment>;
    })}
    <Big tt={tt} at={3.8} x={960} y={190} txt="TRES FRASCOS" size={96} />
  </>;
}}</Stage>;

// 27 · «Con un vaso, cortas un círculo en el medio… en el agujero rompes el huevo»: el vaso baja y corta; el círculo sale y cae el huevo en el hueco
export const Cutter: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), press = eio(tt, 0.6, 1.4), lift = eio(tt, 1.6, 2.4), out = eio(tt, 2.4, 3.2), egg = sp(tt, 3.4, 5, 0.45);
  return <>
    <Table y={260} />
    <div style={pos(900, 580, `scale(${0.5 + 0.5 * s}) rotate(-4deg)`, { width: 560, height: 560, borderRadius: "90px 90px 26px 26px", background: "linear-gradient(160deg,#c88a45,#9a5f28)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", inset: 26, borderRadius: "70px 70px 14px 14px", background: "radial-gradient(circle at 40% 40%, #f6e6c2, #e9cf9c)" }} />
      {out > 0.02 && <div style={{ position: "absolute", left: 130, top: 140, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#2a1a10,#120a06)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.6)" }} />}
      {egg > 0.01 && <div style={{ position: "absolute", left: 130, top: 140, width: 300, height: 300, transform: `scale(${0.3 + 0.7 * egg})`, opacity: cl(egg * 3) }}>
        <div style={{ position: "absolute", inset: 10, borderRadius: "48% 52% 50% 50%", background: "radial-gradient(circle at 45% 45%, #fffef8, #f1ece0)" }} />
        <div style={{ position: "absolute", left: 100, top: 96, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 38% 35%, #ffe08a, #f5a623 60%, #d9861a)", boxShadow: "0 6px 12px rgba(0,0,0,.25)" }} />
      </div>}
    </div>
    <div style={pos(900 + 520 * out, 570 - 260 * (1 - press) * (1 - lift) - 200 * lift * (1 - out), "", { width: 330, height: 330 })}>
      {lift > 0 && <div style={{ position: "absolute", left: 15, top: 15, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #f6e6c2, #e0c08a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "14px solid rgba(220,240,255,.55)", boxShadow: "0 0 30px rgba(200,230,255,.35), inset 0 0 40px rgba(255,255,255,.2)", opacity: 1 - out }} />
    </div>
    <Big tt={tt} at={0.8} x={1460} y={300} txt="UN VASO" size={92} />
    <Big tt={tt} at={3.6} x={1460} y={410} txt="Y EL HUEVO" size={70} col={AMB} />
  </>;
}}</Stage>;

// 28 · «El arroz cocido se guarda en la nevera, tapado… y se usa en uno o dos días»: la heladera se abre con su luz fría y entra el bol tapado
export const Fridge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), op = eio(tt, 0.5, 1.4) * (1 - eio(tt, 3.6, 4.4)), go = eio(tt, 1.6, 3.0);
  return <>
    <div style={pos(820, 540, `scale(${0.5 + 0.5 * s})`, { width: 560, height: 900, perspective: 1600 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(90deg,#c9d2da,#f4f7fa 40%,#dfe5ea)", boxShadow: "0 60px 100px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 30, top: 30, right: 30, bottom: 30, borderRadius: 16, background: `radial-gradient(ellipse at 50% 20%, rgba(220,240,255,${0.9 * op}), rgba(120,170,210,${0.6 * op}) 70%), #1a2228`, boxShadow: "inset 0 0 40px rgba(0,0,0,.5)" }}>
        {[260, 520].map((y) => <div key={y} style={{ position: "absolute", left: 10, right: 10, top: y, height: 10, borderRadius: 5, background: "rgba(255,255,255,.55)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 140 + 700 * (1 - go), top: 300 + 120 * (1 - go), width: 240, opacity: cl(go * 4) }}>
        <Bowl w={240} col="#f4f0e6" />
        <div style={{ position: "absolute", left: -6, top: -6, width: 252, height: 70, borderRadius: "50%", background: "rgba(220,235,245,.55)", border: "3px solid rgba(255,255,255,.6)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, transformOrigin: "100% 50%", transform: `rotateY(${op * 115}deg)`, background: "linear-gradient(90deg,#dfe5ea,#f8fafc 40%,#cfd7de)", boxShadow: "inset 0 0 0 3px rgba(0,0,0,.06)" }}>
        <div style={{ position: "absolute", left: 40, top: 330, width: 22, height: 240, borderRadius: 11, background: "linear-gradient(90deg,#8a9096,#e8ecef)" }} />
      </div>
    </div>
    <Big tt={tt} at={1.0} x={1440} y={420} txt="A LA NEVERA" size={84} col={ICE} />
    <Big tt={tt} at={1.5} x={1440} y={520} txt="Y TAPADO" size={64} />
    <Tape txt="uno o dos días" x={1440} y={660} s={cl(sp(tt, 3.2, 5, 0.5))} size={56} />
  </>;
}}</Stage>;

// 29 · «El tomate que nadie quiere en el mercado, el muy maduro, es el mejor… te lo dejan más barato»: el tomate duro y el maduro; la etiqueta del maduro baja de precio
export const PriceTag: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = [0.1, 0.4].map((a) => sp(tt, a, 6, 0.45)), cheap = eio(tt, 2.6, 3.4), gl = eio(tt, 1.4, 2.4);
  const Tag2: React.FC<{ x: number; y: number; txt: string; sw: number; red?: boolean }> = ({ x, y, txt, sw, red }) => <div style={pos(x, y, `rotate(${sw}deg)`, { transformOrigin: "50% -60px" })}>
    <div style={{ position: "absolute", left: 0, top: -70, width: 3, height: 70, background: "#c9c0a8" }} />
    <div style={{ padding: "12px 28px", background: red ? "#b33a2c" : "#f3e7c4", color: red ? "#fff" : "#2b2620", fontFamily: HAND, fontWeight: 700, fontSize: 56, borderRadius: "8px 8px 8px 30px", boxShadow: "0 10px 20px rgba(0,0,0,.4)", whiteSpace: "nowrap" }}>{txt}</div>
  </div>;
  return <>
    <Table y={680} />
    <div style={pos(620, 580 - (1 - cl(s[0])) * 300, "", { width: 300, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffe9b0, #e9b04a 50%, #9ab04a 90%)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", opacity: cl(s[0] * 3) })} />
    <div style={pos(1260, 600 - (1 - cl(s[1])) * 300, `scale(1.05, ${0.92})`, { width: 330, height: 280, borderRadius: "48% 52% 44% 56%", background: "radial-gradient(circle at 35% 30%, #ff9a7a, #d42a1a 50%, #8a1408 90%)", boxShadow: `0 30px 50px rgba(0,0,0,.5), 0 0 ${70 * gl}px rgba(255,90,60,.55)`, opacity: cl(s[1] * 3) })} />
    <Tag2 x={620} y={330} txt="dura" sw={4 * Math.sin(tt * 1.6)} />
    <div style={{ opacity: 1 - cheap }}><Tag2 x={1260} y={330} txt="madura" sw={4 * Math.sin(tt * 1.6 + 1)} /></div>
    <div style={{ opacity: cheap }}><Tag2 x={1260} y={330 - 16 * (1 - cheap)} txt="más barato" sw={-6 * (1 - cheap) + 3 * Math.sin(tt * 1.6 + 1)} red /></div>
    <Big tt={tt} at={1.2} x={960} y={900} txt="EL QUE NADIE QUIERE" size={84} col={AMB} />
  </>;
}}</Stage>;

// 30 · «Una sola quesadilla partida en dos. Él siempre me dejaba la mitad más grande»: la quesadilla se parte y la mitad más grande se desliza hacia ella
export const Split: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cut = eio(tt, 1.2, 2.0), slide = eio(tt, 2.6, 3.8);
  const half = (w: number, flip: boolean) => <div style={{ width: w, height: w / 2, borderRadius: flip ? "0 0 999px 999px" : "999px 999px 0 0", background: "radial-gradient(ellipse at 50% 80%, #fff3c0 0 18%, #f1c86a 30%, #e2a84a 60%, #b8782e)", boxShadow: "0 18px 30px rgba(0,0,0,.45)" }} />;
  return <>
    <Table y={560} />
    <div style={pos(960, 660, `perspective(1200px) rotateX(50deg) scale(${0.5 + 0.5 * s})`, { width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,#fbf8f0,#e2dccd 66%,#b8b0a0)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 210 - 120 * cut - 60 * slide, top: 160 - 60 * slide, transform: `rotate(${-6 * cut}deg)` }}>{half(440, false)}</div>
      <div style={{ position: "absolute", left: 230 + 140 * cut + 160 * slide, top: 160 + 220 + 30 * cut + 80 * slide, transform: `rotate(${8 * cut}deg)` }}>{half(520, true)}</div>
    </div>
    <Tape txt="1964" x={420} y={260} s={cl(sp(tt, 0.4, 5, 0.5))} size={70} rot={-6} />
    <Big tt={tt} at={3.2} x={1220} y={200} txt="LA MITAD MÁS GRANDE" size={80} col={AMB} />
    <Tape txt="para mí" x={1560} y={880} s={cl(sp(tt, 3.8, 5, 0.5))} size={60} rot={3} />
  </>;
}}</Stage>;

// 31 · «En el norte, de donde era mi abuela, la avena se comía salada»: la brújula busca el norte; aparece el plato de avena con cebolla dorada
export const Compass: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), ang = 140 * Math.exp(-tt * 1.3) * Math.cos(tt * 5), b = sp(tt, 2.4, 5, 0.5);
  return <>
    <Table y={780} />
    <div style={pos(640, 520, `scale(${0.5 + 0.5 * s})`, { width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#f6efdc,#e2d4b0 70%,#b8902c 72%,#8a6a1a 80%,#5a4410)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" })}>
      {["N", "E", "S", "O"].map((d, i) => <div key={d} style={{ position: "absolute", left: 260 - 30, top: 260 - 30, width: 60, height: 60, textAlign: "center", fontWeight: 900, fontSize: 52, color: d === "N" ? "#b33a2c" : "#3a2414", transform: `rotate(${i * 90}deg) translateY(-190px) rotate(${-i * 90}deg)` }}>{d}</div>)}
      <div style={{ position: "absolute", left: 245, top: 70, width: 30, height: 380, transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderBottom: "190px solid #b33a2c" }} />
        <div style={{ position: "absolute", left: 0, top: 190, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderTop: "190px solid #3a3a3a" }} />
      </div>
      <div style={{ position: "absolute", left: 238, top: 238, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle,#f1d27a,#8a6a1a)" }} />
    </div>
    <Shadow x={1330} y={810} w={480} s={b} />
    <div style={pos(1330, 700 - (1 - cl(b)) * 300, "", { opacity: cl(b * 3) })}><Bowl w={460} col="#d9c8a0" top={<>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i * 53) % 330, top: 8 + (i * 31) % 50, width: 46, height: 18, borderRadius: "50%", border: "6px solid #a8641e", opacity: 0.9 }} />)}</>} /></div>
    <Steam tt={tt} x={1330} y={620} w={200} h={200} o={cl(b)} />
    <Big tt={tt} at={1.4} x={1330} y={260} txt="EN EL NORTE" size={92} />
    <Big tt={tt} at={2.8} x={1330} y={370} txt="SALADA" size={92} col={AMB} />
  </>;
}}</Stage>;

// 32 · «Un cajón de fruta golpeada que nadie quiere… mi madre compraba ese cajón por casi nada»: el cajón cae con su fruta machucada y la etiqueta «casi nada»
export const Crate: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = sp(tt, 0.2, 5.5, 0.4), jig = tt > 0.7 && tt < 1.4 ? Math.sin(tt * 30) * 6 * (1.4 - tt) : 0;
  const fr: [number, number, string, number][] = [[90, 40, "#c83a2a", 120], [230, 30, "#d9b44a", 110], [380, 46, "#e8925a", 120], [520, 34, "#c83a2a", 115], [160, 110, "#e8925a", 110], [310, 104, "#9ab04a", 120], [460, 112, "#d9b44a", 110]];
  return <>
    <Table y={720} />
    <Shadow x={960} y={770} w={820} s={c} />
    <div style={pos(960, 600 - (1 - cl(c)) * 500, `rotate(${jig * 0.3}deg)`, { width: 760, height: 330 })}>
      {fr.map(([x, y, col, d], i) => <div key={i} style={{ position: "absolute", left: x, top: y - 70 + jig * (i % 2 ? 1 : -1), width: d, height: d * 0.92, borderRadius: "50%", background: `radial-gradient(circle at 70% 60%, rgba(70,40,10,.75) 0 12%, transparent 16%), radial-gradient(circle at 35% 30%, #fff8, ${col} 45%, rgba(0,0,0,.35))`, boxShadow: "0 10px 16px rgba(0,0,0,.4)" }} />)}
      <div style={{ position: "absolute", left: 0, top: 70, width: 760, height: 260, borderRadius: 8, background: "repeating-linear-gradient(180deg,#b8864e 0 60px,transparent 60px 74px)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: k ? 720 : 0, top: 50, width: 40, height: 290, background: "linear-gradient(90deg,#8a5a2a,#a87440)", borderRadius: 4 }} />)}
    </div>
    <div style={pos(1440, 400, `rotate(${-8 + 3 * Math.sin(tt * 1.5)}deg) scale(${cl(sp(tt, 1.6, 6, 0.45))})`, { padding: "14px 30px", background: "#f3e7c4", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#b33a2c", borderRadius: "8px 8px 8px 30px", boxShadow: "0 12px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap" })}>casi nada</div>
    <Big tt={tt} at={2.4} x={960} y={200} txt="FRUTA GOLPEADA" size={96} />
    <Tape txt="compota para toda la semana" x={960} y={920} s={cl(sp(tt, 3.6, 5, 0.5))} size={52} />
  </>;
}}</Stage>;

// 33 · «Mi madre nunca compraba nada en caja… eso era pagar por el cartón y por el dibujo»: la caja de cereal se abre por delante y adentro hay casi nada; al lado, la bolsa de avena
export const BoxBag: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), peel = eio(tt, 1.6, 2.6), bag = sp(tt, 3.0, 5, 0.5);
  return <>
    <Table y={820} />
    <div style={pos(700, 520, `scale(${0.5 + 0.5 * s})`, { width: 420, height: 600, perspective: 1400 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "#2a1e14", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 110, borderRadius: "40% 40% 6px 6px", background: "radial-gradient(circle at 30% 40%, #e8c070 0 6%, transparent 7%), radial-gradient(circle at 60% 50%, #d8a050 0 6%, transparent 7%), linear-gradient(180deg,#e2b060,#b8823a)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 6, transformOrigin: "0 50%", transform: `rotateY(${-150 * peel}deg)`, overflow: "hidden",
        background: "radial-gradient(circle at 30% 30%, #ffe04a 0 10%, transparent 11%), radial-gradient(circle at 70% 60%, #4ad0ff 0 12%, transparent 13%), radial-gradient(circle at 40% 80%, #ff4a8a 0 9%, transparent 10%), linear-gradient(160deg,#ff6a2a,#e8302a 50%,#a81e5a)" }}>
        {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 97) % 360, top: 40 + (i * 131) % 520, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderBottom: "40px solid rgba(255,255,255,.75)", transform: `rotate(${i * 40}deg)` }} />)}
      </div>
    </div>
    <Big tt={tt} at={2.4} x={700} y={110} txt="PAGAS EL CARTÓN" size={84} col={RED} />
    <div style={pos(1360, 620 - (1 - cl(bag)) * 300, "", { width: 360, height: 420, borderRadius: "30px 30px 40px 40px", background: "linear-gradient(90deg,#c9b48a,#efe0bd 40%,#d8c49b 70%,#a8956d)", boxShadow: "0 40px 70px rgba(0,0,0,.55)", opacity: cl(bag * 3) })}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -30, height: 60, borderRadius: "40%", background: "repeating-linear-gradient(90deg,#b8a274 0 12px,#d8c49b 12px 24px)" }} />
    </div>
    <Tape txt="avena: casi un mes" x={1360} y={620} s={cl(sp(tt, 3.6, 5, 0.5))} size={50} />
  </>;
}}</Stage>;

// 34 · «Quiero contestar algunas cosas que me escribieron en los comentarios… las leo todas»: sobres y papelitos bajan flotando y se apilan en la mesa
export const Letters: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Table y={700} />
  {Array.from({ length: 16 }, (_, i) => {
    const a = 0.2 + i * 0.22, k = eio(tt, a, a + 1.5), sx = 200 + (i * 331) % 1500, ex = 760 + (i * 47) % 400, ey = 720 - i * 7;
    const x = sx + (ex - sx) * k + 60 * Math.sin(k * 6 + i), y = -200 + (ey + 200) * k, r = (i * 37) % 60 - 30 + 200 * (1 - k);
    const env = i % 3 !== 1;
    if (k <= 0) return null;
    return <div key={i} style={pos(x, y, `perspective(900px) rotateX(${50 * k}deg) rotate(${r}deg)`, { width: env ? 260 : 200, height: env ? 170 : 240, borderRadius: 6, background: env ? "linear-gradient(160deg,#f6efdf,#e2d6bc)" : "linear-gradient(180deg,#fffdf6,#f1ead6)", boxShadow: "0 16px 26px rgba(0,0,0,.45)" })}>
      {env ? <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "130px solid transparent", borderRight: "130px solid transparent", borderTop: "90px solid #d6c8a8" }} />
        : [0, 1, 2, 3, 4].map((l) => <div key={l} style={{ position: "absolute", left: 24, right: 24 + (l * 23) % 50, top: 40 + l * 34, height: 4, borderRadius: 2, background: "rgba(30,60,120,.45)" }} />)}
    </div>;
  })}
  <Big tt={tt} at={1.6} x={960} y={200} txt="SUS PREGUNTAS" size={100} />
  <Tape txt="las leo todas" x={960} y={310} s={cl(sp(tt, 2.4, 5, 0.5))} size={58} />
</>}</Stage>;

// 35 · «Un domingo, sin pensarlo, saqué la sartén de hierro y lo hice»: la sartén de hierro sube a la luz con el pan de maíz dorado
export const Skillet: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #2a1a0e, #070504 75%)">{(tt) => {
  const s = sp(tt, 0.1, 3.6, 0.65), gl = eio(tt, 1.2, 3.0);
  return <>
    <div style={pos(960, 600 + (1 - cl(s)) * 300, `perspective(1400px) rotateX(${56 - 10 * gl}deg) scale(${0.6 + 0.4 * s})`, { width: 760, height: 760 })}>
      <div style={{ position: "absolute", left: 700, top: 320, width: 420, height: 110, borderRadius: 55, background: "linear-gradient(180deg,#3a3a3a,#0a0a0a)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle,#1a1a1a 0 70%, #2e2e2e 76%, #0a0a0a 82%)", boxShadow: `0 60px 100px rgba(0,0,0,.7), 0 0 ${140 * gl}px rgba(255,150,60,${0.35 * gl})` }} />
      <div style={{ position: "absolute", inset: 90, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffe08a, #e9a83a 50%, #b8701e 80%, #8a4a10)", boxShadow: "inset 0 -20px 40px rgba(120,60,10,.5)" }}>
        {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ position: "absolute", left: 290, top: 0, width: 4, height: 290, background: "rgba(120,60,10,.35)", transformOrigin: "50% 100%", transform: `rotate(${k * 60}deg)` }} />)}
      </div>
    </div>
    <Steam tt={tt} x={960} y={420} w={260} h={260} o={gl} />
    <Big tt={tt} at={1.6} x={960} y={150} txt="LA SARTÉN DE HIERRO" size={84} col={AMB} />
    <Tape txt="desde ese domingo" x={1500} y={900} s={cl(sp(tt, 3.0, 5, 0.5))} size={54} rot={-3} />
  </>;
}}</Stage>;

// 36 · «Fuego mínimo y tapa. Y nunca lo destapes antes de los veinte minutos»: la tapa tiembla con el vapor pero no se levanta; la llama azul chiquita; el reloj de 20
export const Lid: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), jit = Math.sin(tt * 9) * 2.5 * eio(tt, 1.0, 1.6), arc = 360 * eio(tt, 0.8, 5.6);
  return <>
    <div style={pos(760, 560, `scale(${0.5 + 0.5 * s})`, { width: 560, height: 520 })}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 38, top: 450 - 4 * Math.sin(tt * 1.8 + i), width: 18, height: 34 + 4 * Math.sin(tt * 1.6 + i * 2), borderRadius: "50% 50% 40% 40% / 70% 70% 30% 30%", background: "radial-gradient(circle at 50% 70%, #fff, #6ab0ff 40%, rgba(40,90,220,.2))", filter: "blur(1px)" }} />)}
      <div style={{ position: "absolute", left: 30, top: 160, width: 500, height: 280, borderRadius: "0 0 70px 70px", background: "linear-gradient(90deg,#2a2a2a,#5a5a5a 35%,#3a3a3a 70%,#1a1a1a)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 10, top: 110 + jit, width: 540, height: 80, borderRadius: "50% 50% 20% 20%", background: "linear-gradient(180deg,#7a7a7a,#3a3a3a)", transform: `rotate(${jit * 0.6}deg)`, boxShadow: "0 8px 16px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 240, top: -30, width: 60, height: 40, borderRadius: 12, background: "#1a1a1a" }} />
      </div>
      <Steam tt={tt} x={280} y={130} w={300} h={180} o={0.5 * eio(tt, 1.0, 1.6)} />
    </div>
    <div style={pos(1380, 480, `scale(${cl(sp(tt, 0.5, 5, 0.5))})`, { width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#fbf6ea 0 62%, #2b2018 63%)", boxShadow: "0 40px 70px rgba(0,0,0,.55)" })}>
      <div style={{ position: "absolute", inset: 24, borderRadius: "50%", background: `conic-gradient(${RED} 0deg ${arc}deg, transparent ${arc}deg)`, opacity: 0.3 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 120, color: "#2b2018" }}>20</div>
    </div>
    <Big tt={tt} at={1.6} x={1380} y={760} txt="NUNCA LO DESTAPES" size={70} col={RED} />
    <Tape txt="fuego mínimo y tapa" x={760} y={160} s={cl(sp(tt, 0.4, 5, 0.5))} size={56} />
  </>;
}}</Stage>;

// 37 · «Todo desayuno tenía que tener tres cosas. Algo caliente que llene… algo que sostenga… algo dulce de verdad»: tres platos que se llenan cuando lo dice
export const Plates3: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const rows: number[] = (h.rows as number[] | undefined)?.map((r) => r - h.at) ?? [0.4, 3.0, 5.6];
  const lab = ["caliente que llene", "que sostenga", "dulce de verdad"];
  return <>
    <Table y={640} />
    {[0, 1, 2].map((i) => {
      const x = 400 + i * 560, p = sp(tt, 0.1 + i * 0.15, 6, 0.5), f = sp(tt, rows[i] ?? 0.4 + i * 2.6, 6, 0.45), on = cl(f);
      return <React.Fragment key={i}>
        <div style={pos(x, 680, `perspective(1000px) rotateX(55deg) scale(${cl(p)})`, { width: 430, height: 430, borderRadius: "50%", background: "radial-gradient(circle,#fbf8f0,#e2dccd 66%,#b8b0a0)", boxShadow: `0 40px 70px rgba(0,0,0,.55), 0 0 ${60 * on}px rgba(255,190,110,${0.35 * on})` })} />
        <div style={pos(x, 600 - (1 - on) * 260, "", { opacity: cl(f * 3) })}>
          {i === 0 && <><Bowl w={240} col="#e9d9b0" /><Steam tt={tt} x={120} y={10} w={140} h={160} o={on} /></>}
          {i === 1 && <div style={{ width: 230, height: 190, borderRadius: "48% 52% 50% 50%", background: "radial-gradient(circle at 50% 50%, #ffcf5a 0 22%, #fffef8 24%, #f1ece0 70%, transparent 72%)" }} />}
          {i === 2 && <div style={{ display: "flex", gap: 10 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle,#fff3c8 0 30%,#f1d890 60%,#c8a050 64%)", boxShadow: "0 8px 14px rgba(0,0,0,.35)" }} />)}</div>}
        </div>
        <Tape txt={lab[i]} x={x} y={880} s={cl(sp(tt, (rows[i] ?? 0) + 0.4, 5, 0.5))} size={50} rot={i % 2 ? 2 : -3} />
      </React.Fragment>;
    })}
    <Big tt={tt} at={0.5} x={960} y={170} txt="LAS TRES COSAS" size={96} col={AMB} />
  </>;
}}</Stage>;
