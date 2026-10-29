// rosa29b · componentes únicos 11-20. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB, RED } from "./hkit";
import { Steam, Tape, Big, Jar, Table, Shadow } from "./rkit";
import { P, sp, pos } from "./hb1";
const damp = (tt: number, a: number, f = 2, k = 2.2) => (tt < a ? 0 : Math.exp(-k * (tt - a)) * Math.sin((tt - a) * f * Math.PI * 2));

// 11 · «En tazas o en un recipiente, a la nevera»: la taza se da vuelta sobre el plato, sube, y la gelatina de leche queda temblando
export const Jiggle: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), turn = eio(tt, 0.4, 1.1), up = eio(tt, 1.3, 2.0), wb = damp(tt, 1.6, 1.4, 1.2);
  return <>
    <Table y={800} />
    <div style={pos(960, 780, `scale(${s})`, { width: 760, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%,#fbfdff,#dfe6ec 60%,#b9c3cc 72%,#1d4e8f 74%,#e9eef2 78%)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })} />
    <div style={pos(960, 640, "", { width: 380, height: 260, transformOrigin: "50% 100%", transform: `translateX(-50%) translateY(-50%) scaleX(${1 + 0.07 * wb}) scaleY(${1 - 0.07 * wb})`, left: 960, top: 640, opacity: up })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "48% 48% 12% 12% / 60% 60% 10% 10%", background: "radial-gradient(ellipse at 40% 30%,#ffffff,#f4ecdc 45%,#e2d4b4)", boxShadow: "inset -20px -10px 40px rgba(180,150,100,.35), 0 18px 26px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 90, top: 20, width: 200, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse,#9a5a2a,#c98a4a 50%,transparent 72%)", opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 60, top: 40, width: 50, height: 120, borderRadius: 30, background: "linear-gradient(180deg,rgba(255,255,255,.8),transparent)" }} />
    </div>
    <div style={{ position: "absolute", left: 960 - 210, top: 380 - 420 * up + (1 - turn) * -200, width: 420, height: 300, transform: `rotate(${180 * turn}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 120px 120px", background: "linear-gradient(90deg,#c9d2da,#fbfdff 35%,#e8eef3 60%,#b9c3cc)", boxShadow: "0 20px 30px rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", left: 0, top: -12, width: 420, height: 50, borderRadius: "50%", background: "#1d4e8f" }} />
    </div>
    <Big tt={tt} at={2.4} x={960} y={230} txt="GELATINA DE LECHE" size={84} col={AMB} />
  </>;
}}</Stage>;

// 12 · «Las rosquillas eran de las fiestas del pueblo»: dos cordeles de papel picado se mecen y la rosquilla sube azucarada
export const PapelPicado: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const C = ["#e2365b", "#f2b630", "#2f7fd8", "#3cb371", "#9b59d0", "#ff7a2f"], r = sp(tt, 1.6, 5, 0.5);
  const Row: React.FC<{ y: number; d: number; n: number }> = ({ y, d, n }) => <>
    <svg width={1920} height={80} style={{ position: "absolute", left: 0, top: y - 30 }}><path d={`M -20 10 Q 960 ${60 + 6 * Math.sin(tt * 0.8 + d)} 1940 10`} stroke="#e9e2d2" strokeWidth={4} fill="none" /></svg>
    {Array.from({ length: n }, (_, i) => {
      const a = 0.2 + d * 0.5 + i * 0.06, s = sp(tt, a, 6, 0.45), x = 40 + i * (1840 / (n - 1)), sag = 46 * Math.sin(Math.PI * (x / 1920));
      if (s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: x - 70, top: y + sag - 10, width: 140, height: 170, transformOrigin: "50% 0", transform: `rotate(${5 * Math.sin(tt * 0.9 + i * 0.7 + d)}deg) scaleY(${s})`, background: C[(i + d * 2) % 6], opacity: 0.92,
        clipPath: "polygon(0 0,100% 0,100% 82%,88% 100%,76% 82%,64% 100%,50% 82%,36% 100%,24% 82%,12% 100%,0 82%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 42%, transparent 0 18px, #000 19px), radial-gradient(circle at 22% 25%, transparent 0 10px, #000 11px)", WebkitMaskComposite: "source-in" } as React.CSSProperties} />;
    })}
  </>;
  return <>
    <Row y={90} d={0} n={13} />
    <Row y={330} d={1} n={11} />
    <Shadow x={960} y={880} w={420} s={r} />
    <div style={pos(960, 760 - 120 * r, `rotate(${-8 + 8 * r}deg) scale(${0.5 + 0.5 * r})`, { width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, transparent 0 22%, #e9a54a 23%, #c97a2a 52%, #9a5a1a 68%, transparent 70%)", boxShadow: "0 30px 40px rgba(0,0,0,.4)" })}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: 190 + 120 * Math.cos(i * 2.4) - 4, top: 190 + 120 * Math.sin(i * 2.4) - 4, width: 8, height: 8, borderRadius: 2, background: "#fff", opacity: 0.85 }} />)}
    </div>
    <Big tt={tt} at={2.6} x={960} y={1000} txt="FIESTA DEL PUEBLO" size={70} col={AMB} />
  </>;
}}</Stage>;

// 13 · «Nunca dejes la olla de aceite sola en el fuego. Ni para atender el teléfono»: el teléfono de disco suena y tiembla; la olla de aceite sigue en el fuego, sola
export const Phone: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), ring = (tt % 1.2) < 0.7 && tt < 3.0 ? Math.sin(tt * 2 * Math.PI * 9) * 3 : 0, hot = cl((tt - 1.5) / 2.5);
  return <>
    <Table y={790} />
    <Shadow x={560} y={790} w={460} s={s} />
    <div style={pos(560, 640, `scale(${s}) rotate(${ring}deg)`, { width: 440, height: 300 })}>
      <div style={{ position: "absolute", left: 20, top: 80, width: 400, height: 220, borderRadius: "60px 60px 24px 24px", background: "linear-gradient(170deg,#3a3a3a,#111 70%)", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.12)" }} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,#e9e2d2 0 22%,#222 23% 28%,#ddd 29%,#bbb 70%,#222 72%)" }}>
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 100 + 70 * Math.cos(i * 0.55 - 2.6) - 14, top: 100 + 70 * Math.sin(i * 0.55 - 2.6) - 14, width: 28, height: 28, borderRadius: "50%", background: "#2a2a2a" }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, top: 10 - 30 * Math.abs(ring) / 3, width: 440, height: 80, borderRadius: 40, background: "linear-gradient(180deg,#444,#0d0d0d)", boxShadow: "0 12px 20px rgba(0,0,0,.6)" }} />
    </div>
    {tt < 3 && [0, 1].map((i) => { const ph = (tt * 1.4 + i * 0.5) % 1; return <div key={i} style={pos(560, 560, "", { width: 300 + 300 * ph, height: 300 + 300 * ph, borderRadius: "50%", border: `5px solid rgba(255,90,74,${0.6 * (1 - ph)})` })} />; })}
    <Shadow x={1360} y={790} w={520} />
    <div style={pos(1360, 820, "", { width: 520, height: 60, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(80,140,255,.9), rgba(255,150,60,${0.4 + 0.4 * hot}) 50%, transparent 72%)`, filter: "blur(6px)" })} />
    <div style={pos(1360, 660, "", { width: 460, height: 260 })}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 460, height: 220, borderRadius: "10px 10px 60px 60px", background: "linear-gradient(90deg,#1a1a1a,#4a4a4a 40%,#222)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 10, top: 20, width: 440, height: 60, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,${200 - 80 * hot},${80 - 60 * hot},1), #8a5a10 70%)`, boxShadow: `0 0 ${50 * hot}px rgba(255,120,40,.7)` }} />
    </div>
    <svg width={460} height={200} style={{ position: "absolute", left: 1130, top: 440, overflow: "visible", opacity: hot }}>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${110 + i * 120} 180 q -20 -50 0 -90 q 20 -40 0 -80`} stroke="rgba(255,200,150,.35)" strokeWidth={10} fill="none" style={{ filter: "blur(3px)" }} transform={`translate(${6 * Math.sin(tt * 1.5 + i)} 0)`} />)}
    </svg>
    <Big tt={tt} at={2.2} x={960} y={230} txt="NI PARA EL TELÉFONO" size={80} col={RED} />
  </>;
}}</Stage>;

// 14 · «Un plátano muy maduro y una taza de avena»: el plátano y la avena llegan, se aplastan juntos y quedan en una galleta
export const Merge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = sp(tt, 0.1, 5, 0.55), b = sp(tt, 0.5, 5, 0.55), m = eio(tt, 1.6, 2.6), fl = eio(tt, 2.8, 3.6);
  return <>
    <Table y={790} />
    <Shadow x={960} y={790} w={520} s={fl} />
    <div style={pos(560 + 400 * m, 640, `rotate(${-20 + 20 * m}deg) scale(${a * (1 - m)})`, { width: 460, height: 150, borderRadius: "50% 50% 40% 40% / 80% 80% 30% 30%", background: "linear-gradient(180deg,#e8d24a,#c9a420 60%,#5a4210)", boxShadow: "0 20px 30px rgba(0,0,0,.45)" })}>
      {[80, 170, 260, 340].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 40 + (x % 3) * 10, width: 34, height: 22, borderRadius: "50%", background: "#3a2a0a", opacity: 0.7 }} />)}
    </div>
    <div style={pos(1360 - 400 * m, 680, `scale(${b * (1 - m)})`, { width: 420, height: 180 })}>
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: 210 + 180 * Math.cos(i * 2.39) * Math.sqrt((i + 1) / 60) - 13, top: 130 - 110 * Math.sqrt((i + 1) / 60) * Math.abs(Math.sin(i * 2.39)) + (i % 5) * 4, width: 26, height: 16, borderRadius: "50%", background: i % 3 ? "#e8d6a8" : "#d2bb84", transform: `rotate(${i * 37}deg)`, boxShadow: "0 2px 3px rgba(0,0,0,.3)" }} />)}
    </div>
    <div style={pos(960, 700 + 30 * fl, `scale(${cl(m * 2)}) scaleY(${1 - 0.55 * fl}) scaleX(${1 + 0.35 * fl})`, { width: 300, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#e8c88a,#c99a50 55%,#8a6020)", boxShadow: "0 24px 36px rgba(0,0,0,.5)" })}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 150 + 110 * Math.cos(i * 2.39) * Math.sqrt((i + 1) / 22) - 9, top: 130 + 100 * Math.sin(i * 2.39) * Math.sqrt((i + 1) / 22) - 6, width: 18, height: 12, borderRadius: "50%", background: "#f2e2b8", opacity: 0.85 }} />)}
    </div>
    <Big tt={tt} at={3.4} x={960} y={250} txt="SÓLO DOS COSAS" size={96} col={AMB} />
  </>;
}}</Stage>;

// 15 · «Si lo prendes, que sea para cuatro cosas a la vez»: se baja la puerta del horno y entran cuatro bandejas, una por una; un solo encendido
export const Oven4: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), door = eio(tt, 0.2, 0.8) * (1 - eio(tt, 3.6, 4.2)), fire = cl((tt - 4.0) * 2);
  const items = ["#e6b25e", "#c99a50", "#f2d9a0", "#c0392b"];
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 900, height: 700, borderRadius: 24, background: "linear-gradient(180deg,#e9e6df,#c9c4b8)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 10px #b5afa2" })}>
      <div style={{ position: "absolute", left: 90, top: 120, width: 720, height: 470, borderRadius: 12, background: `radial-gradient(ellipse at 50% 100%, rgba(255,140,40,${0.25 + 0.5 * fire}), #1a1410 70%)`, boxShadow: "inset 0 0 40px rgba(0,0,0,.9)", overflow: "hidden" }}>
        {[0, 1, 2, 3].map((i) => { const a = 0.9 + i * 0.6, f = eio(tt, a, a + 0.5); return <div key={i} style={{ position: "absolute", left: 40 + 720 * (1 - f), top: 40 + i * 108, width: 640, height: 80, opacity: cl(f * 4) }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 640, height: 14, borderRadius: 4, background: "linear-gradient(180deg,#9aa3aa,#5b636a)" }} />
          {Array.from({ length: i === 0 ? 1 : 5 }, (_, j) => <div key={j} style={{ position: "absolute", left: i === 0 ? 220 : 40 + j * 120, bottom: 14, width: i === 0 ? 200 : 80, height: i === 0 ? 70 : 40, borderRadius: i === 3 ? "50%" : i === 0 ? "30px 30px 6px 6px" : 40, background: items[i] }} />)}
        </div>; })}
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 58, bottom: 4, width: 30, height: 24 + 10 * Math.sin(tt * 3 + i), borderRadius: "50% 50% 20% 20%", background: "linear-gradient(0deg,#3a7bff,#9ad0ff)", opacity: fire * 0.9 }} />)}
      </div>
      <div style={{ position: "absolute", left: 70, top: 600, width: 760, height: 520, transformOrigin: "50% 0", transform: `perspective(1400px) rotateX(${-180 + 180 * (1 - door) + 0}deg)`, borderRadius: 14, background: "linear-gradient(180deg,#dcd8cf,#b5afa2)", boxShadow: "0 -10px 30px rgba(0,0,0,.4)", opacity: 0.97 }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 160 + i * 170, top: 36, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#9a948a)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />)}
    </div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={pos(1560, 300 + i * 110, `scale(${sp(tt, 1.1 + i * 0.6, 6, 0.5)})`, { width: 70, height: 70, borderRadius: "50%", background: AMB, color: "#2b2018", fontSize: 44, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" })}>{i + 1}</div>)}
    <Big tt={tt} at={4.4} x={960} y={1000} txt="UN SOLO ENCENDIDO" size={70} col={AMB} />
  </>;
}}</Stage>;

// 16 · «Las cáscaras de naranja no iban a la basura… las juntaba en un frasco con agua»: la naranja gira y su cáscara cae en una sola espiral al frasco
export const SpiralPeel: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), pr = eio(tt, 0.5, 3.6), jf = eio(tt, 2.6, 4.4);
  const pts = Array.from({ length: 70 }, (_, i) => { const u = i / 69; return [700 + 120 * Math.cos(u * 18) * (1 - 0.3 * u), 380 + u * 380 + 40 * Math.sin(u * 18)]; });
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
  return <>
    <Table y={850} />
    <div style={pos(700, 300, `scale(${s}) rotate(${tt * 60}deg)`, { width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${pr > 0.9 ? "#fff2d8" : "#ffb347"}, ${pr > 0.9 ? "#f6dcae" : "#f08a1a"} 60%, ${pr > 0.9 ? "#e8c48a" : "#b85a08"})`, boxShadow: "0 30px 40px rgba(0,0,0,.5)" })} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={d} stroke="#f08a1a" strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray={`${pr} 1`} style={{ filter: "drop-shadow(0 10px 10px rgba(0,0,0,.5))" }} />
      <path d={d} stroke="#ffd08a" strokeWidth={10} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${pr} 1`} opacity={0.6} />
    </svg>
    <div style={pos(1300, 640, `scale(${1.2 * s})`)}><Jar w={250} fill={0.55 + 0.3 * jf} col="rgba(255,170,70,.55)" lid="#1d4e8f" /></div>
    <Tape txt="NO VAN A LA BASURA" x={1300} y={300} s={sp(tt, 3.4)} size={52} />
  </>;
}}</Stage>;

// 17 · «El error es no hervirlas tres veces. Si no, queda tan amarga…»: la olla hierve tres veces y el agua pasa de amarga a clara; tres rayas de tiza
export const ThreeBoils: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), n = Math.min(3, Math.floor(cl(tt / 5.1) * 3 + 0.0001) + (tt > 0.3 ? 1 : 0)), k = cl((tt - 0.3) / 5.1);
  const col = ["#5a3a12", "#8a5a1a", "#c98a2a", "#f0b850"][Math.min(3, Math.floor(k * 3.999))];
  return <>
    <div style={pos(900, 860, "", { width: 520, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(80,140,255,.9), transparent 70%)", filter: "blur(6px)" })} />
    <div style={pos(900, 640, `scale(${s})`, { width: 560, height: 360 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 560, height: 300, borderRadius: "10px 10px 80px 80px", background: "linear-gradient(90deg,#8a949c,#e8edf0 40%,#9aa3aa 70%,#5b636a)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 14, top: 40, width: 532, height: 70, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, ${col}, #2a1a08 120%)` }}>
        {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 1.5 + i * 0.29) % 1, on = ((tt - 0.3) % 1.7) < 1.2; return <div key={i} style={{ position: "absolute", left: 30 + i * 40, top: 30 - 20 * ph, width: 18, height: 18, borderRadius: "50%", border: "3px solid rgba(255,255,255,.6)", opacity: on ? 1 - ph : 0 }} />; })}
      </div>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 56, top: 50, width: 40, height: 14, borderRadius: 7, background: "#f08a1a", transform: `rotate(${i * 40}deg)`, opacity: 0.8 }} />)}
    </div>
    <Steam tt={tt} x={900} y={560} w={320} h={220} />
    {[0, 1, 2].map((i) => { const a = 0.3 + i * 1.7, f = eio(tt, a, a + 0.5); return <div key={i} style={{ position: "absolute", left: 1350 + i * 70, top: 420, width: 16, height: 220, borderRadius: 8, background: "#f4efe3", transformOrigin: "50% 0", transform: `scaleY(${f}) rotate(${4 - i * 3}deg)`, boxShadow: "0 0 6px rgba(255,255,255,.4)" }} />; })}
    <Big tt={tt} at={1.0} x={1420} y={340} txt={`${n} DE 3`} size={70} col={AMB} />
    <Big tt={tt} at={4.6} x={960} y={200} txt="TRES HERVORES" size={90} col={AMB} />
  </>;
}}</Stage>;

// 18 · «Medio dedo de grosor, y se inflan solas»: el disco de masa entra al aceite y se infla
export const Puff: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), dn = eio(tt, 0.9, 1.4), pf = sp(tt, 1.7, 2.6, 0.5);
  return <>
    <div style={pos(960, 760, `scale(${s})`, { width: 1100, height: 260, borderRadius: "0 0 200px 200px", background: "linear-gradient(180deg,#d8a030,#a86a10 60%,#5a3a08)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 10px 0 #f2c050" })}>
      {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 1.6 + i * 0.31) % 1; return <div key={i} style={{ position: "absolute", left: 80 + i * 70, top: 40 - 26 * ph, width: 14, height: 14, borderRadius: "50%", border: "3px solid rgba(255,240,200,.7)", opacity: (tt > 1.3 ? 1 : 0.2) * (1 - ph) }} />; })}
    </div>
    <div style={pos(960, 380 + 270 * dn - 40 * cl(pf), "", { width: 380, height: 50 + 90 * cl(pf), borderRadius: `190px 190px ${80 * cl(pf) + 20}px ${80 * cl(pf) + 20}px / ${40 + 60 * cl(pf)}px ${40 + 60 * cl(pf)}px 30px 30px`, background: `radial-gradient(ellipse at 40% 30%, #ffd890, ${tt > 1.4 ? "#e8a040" : "#f2b860"} 60%, #b86a18)`, boxShadow: "0 16px 26px rgba(0,0,0,.45)" })} />
    {dn < 1 && <div style={pos(1260, 400, "", { width: 6, height: 50, background: AMB })} />}
    {dn < 1 && <Tape txt="½ DEDO" x={1380} y={400} s={sp(tt, 0.2)} size={44} />}
    <Big tt={tt} at={2.6} x={960} y={200} txt="SE INFLAN SOLAS" size={96} col={AMB} />
  </>;
}}</Stage>;

// 19 · «Se llaman así porque por dentro están huecos, llenos de aire»: el buñuelo se abre en dos y por dentro hay aire que se escapa en remolinos
export const Hollow: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), op = eio(tt, 0.8, 1.6), air = cl((tt - 1.4) / 2.5);
  const half = (d: number) => <div style={pos(960 + d * 170 * op, 600, `rotate(${d * 14 * op}deg) scale(${s})`, { width: 420, height: 400, clipPath: d < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" })}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 32%,#f6c878,#d88a30 55%,#8a4a10)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 50, top: 50, width: 320, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#1a0e06 0 50%,#3a2010 72%,#f2d6a0 74%,#e8c080)", opacity: op }} />
    {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 200 + 180 * Math.cos(i * 0.4) - 5, top: 200 + 175 * Math.sin(i * 0.4) - 5, width: 10, height: 10, borderRadius: 3, background: "#fff", opacity: 0.8 }} />)}
  </div>;
  return <>
    <Table y={820} />
    {half(-1)}{half(1)}
    <svg width={800} height={600} style={{ position: "absolute", left: 560, top: 100, overflow: "visible" }}>
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M 400 ${480 - i * 10} c ${-60 + i * 40} -80 ${120 - i * 60} -140 ${20 * (i - 1.5)} -260 c -40 -50 30 -80 60 -40`} stroke="rgba(220,235,255,.75)" strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1}
        strokeDasharray={`${0.35} 1`} strokeDashoffset={-air * 1.2 + i * 0.12} opacity={air > 0 ? 1 - air * 0.7 : 0} style={{ filter: "blur(1px)" }} />)}
    </svg>
    <Big tt={tt} at={2.4} x={960} y={950} txt="LLENOS DE AIRE" size={96} col={AMB} />
  </>;
}}</Stage>;

// 20 · «El error es el fuego alto… Fuego medio, y que se inflen con calma»: la perilla gira de ALTO a MEDIO y la llama baja
export const Knob: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), k = eio(tt, 1.2, 2.2), fl = 1 - 0.55 * k;
  return <>
    <div style={pos(1240, 600, `scale(${s})`, { width: 560, height: 560 })}>
      <div style={{ position: "absolute", left: 80, top: 420, width: 400, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse,#3a3a3a,#111)" }} />
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, x = 280 + 170 * Math.cos(a), hh = (110 + 30 * Math.sin(tt * 3 + i * 1.7)) * fl; return <div key={i} style={{ position: "absolute", left: x - 16, top: 440 - hh + 18 * Math.sin(a), width: 32, height: hh, borderRadius: "50% 50% 30% 30%",
        background: `linear-gradient(0deg,#2a5bff,#7ab0ff 40%,rgba(255,${180 - 100 * (1 - k)},60,${0.8 - 0.6 * k}))`, opacity: 0.85, filter: "blur(1px)" }} />; })}
    </div>
    <div style={pos(620, 600, `scale(${s})`, { width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f4f6f8,#b9c3cc 70%,#7a848c)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 60, top: 160, width: 300, height: 100, borderRadius: 30, background: "linear-gradient(180deg,#2b2b2b,#0d0d0d)", transformOrigin: "50% 50%", transform: `rotate(${-60 + 80 * k}deg)` }}>
        <div style={{ position: "absolute", right: 14, top: 40, width: 24, height: 20, borderRadius: 4, background: RED }} /></div>
      {[["ALTO", -60], ["MEDIO", 20], ["BAJO", 100]].map(([w, a]) => <div key={w as string} style={{ position: "absolute", left: 210 + 250 * Math.cos(((a as number) * Math.PI) / 180) - 70, top: 210 + 250 * Math.sin(((a as number) * Math.PI) / 180) - 20, width: 140, textAlign: "center", fontSize: 34, fontWeight: 900, color: w === "MEDIO" ? AMB : "rgba(247,244,238,.6)" }}>{w}</div>)}
    </div>
    <Big tt={tt} at={2.6} x={960} y={180} txt="FUEGO MEDIO" size={110} col={AMB} />
  </>;
}}</Stage>;
