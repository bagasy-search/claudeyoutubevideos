// rosa29b · componentes únicos 1-10 (cada uno = la frase de ese segundo, hecho objeto). Todo en código, ninguna familia de rosa29a.
import React from "react";
import { Stage, H, phys, cl, eio, AMB, RED, ICE } from "./hkit";
import { Steam, Tape, Big, Cup, Table, Shadow } from "./rkit";

export type P = { t: number; h: H };
export const sp = (tt: number, a: number, w = 6, z = 0.5) => phys(tt, a, w, z);
export const pos = (x: number, y: number, tr = "", ex: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) ${tr}`, ...ex });
const damp = (tt: number, a: number, f = 2, k = 2.2) => (tt < a ? 0 : Math.exp(-k * (tt - a)) * Math.sin((tt - a) * f * Math.PI * 2));

// 1 · «En la radio de la cocina empieza la novela»: la radio de madera se enciende, la aguja corre por el dial hasta la novela y salen las ondas
export const RadioDial: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), nd = eio(tt, 0.5, 2.2), lamp = cl((tt - 2.0) * 2);
  return <>
    <Table y={800} />
    <Shadow x={820} y={800} w={760} s={s} />
    <div style={pos(820, 560, `scale(${s})`, { width: 720, height: 460, borderRadius: "70px 70px 26px 26px", background: "linear-gradient(160deg,#8a5a34,#5b3a22 55%,#3a2414)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 10px #4a2f1b, inset 0 6px 0 16px rgba(255,220,170,.08)" })}>
      <div style={{ position: "absolute", left: 60, top: 50, width: 600, height: 200, borderRadius: "50px 50px 12px 12px", background: "repeating-linear-gradient(90deg,#c9b48a 0 6px,#a8916a 6px 9px)", boxShadow: "inset 0 0 30px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 60, top: 280, width: 600, height: 90, borderRadius: 12, background: `linear-gradient(180deg, rgba(255,214,140,${0.25 + 0.55 * lamp}), rgba(170,110,40,${0.3 + 0.4 * lamp}))`, boxShadow: `inset 0 0 18px rgba(0,0,0,.6), 0 0 ${50 * lamp}px rgba(255,190,100,.55)`, overflow: "hidden" }}>
        {Array.from({ length: 21 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 28, top: i % 5 ? 52 : 40, width: 3, height: i % 5 ? 20 : 34, background: "#3a2414" }} />)}
        {["540", "700", "900", "1200", "1600"].map((v, i) => <div key={v} style={{ position: "absolute", left: 6 + i * 140, top: 6, fontSize: 22, fontWeight: 800, color: "#3a2414" }}>{v}</div>)}
        <div style={{ position: "absolute", left: 470, top: 4, padding: "2px 10px", borderRadius: 4, fontSize: 22, fontWeight: 900, color: "#fff", background: RED, opacity: lamp }}>NOVELA</div>
        <div style={{ position: "absolute", left: 30 + 470 * nd, top: 0, width: 6, height: 90, background: RED, boxShadow: "0 0 10px rgba(255,90,74,.8)" }} />
      </div>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 400, top: 385, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e8d5b0,#7a5a3a 70%)", boxShadow: "0 6px 12px rgba(0,0,0,.5)", transform: `rotate(${i ? nd * 300 : 0}deg)` }}>
        <div style={{ position: "absolute", left: 32, top: 6, width: 6, height: 22, borderRadius: 3, background: "#3a2414" }} /></div>)}
    </div>
    <svg width={500} height={500} style={{ position: "absolute", left: 1150, top: 260, overflow: "visible" }}>
      {[0, 1, 2].map((i) => { const ph = ((tt - 2.1) * 0.6 + i / 3) % 1; return tt > 2.1 ? <path key={i} d={`M 20 ${180 - 120 * ph} A ${80 + 220 * ph} ${80 + 220 * ph} 0 0 1 20 ${180 + 120 * ph}`} transform={`translate(${30 + 240 * ph} 0)`} fill="none" stroke={AMB} strokeWidth={8} strokeLinecap="round" opacity={(1 - ph) * 0.8} /> : null; })}
    </svg>
    <Big tt={tt} at={2.6} x={1480} y={760} txt="LAS CINCO" size={110} col={AMB} />
    <Big tt={tt} at={3.0} x={1480} y={860} txt="DE LA TARDE" size={50} />
  </>;
}}</Stage>;

// 2 · «Veinte. Las meriendas de la abuela»: veinte cucharas de palo caen colgadas de la barra, una por una, y se mecen
export const SpoonRack: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const bar = sp(tt, 0.05, 4, 0.6);
  return <>
    <div style={pos(960, 230, `scaleX(${bar})`, { width: 1640, height: 34, borderRadius: 17, background: "linear-gradient(180deg,#d8dde2,#8a949c 60%,#5b636a)", boxShadow: "0 14px 24px rgba(0,0,0,.5)" })} />
    {Array.from({ length: 20 }, (_, i) => {
      const a = 0.35 + i * 0.09, s = sp(tt, a, 6, 0.45), sw = 9 * damp(tt, a + 0.15, 0.7, 1.1) * (i % 2 ? 1 : -1), x = 190 + i * 81;
      if (s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: x - 22, top: 236, width: 44, height: 360 + (i % 3) * 30, transformOrigin: "50% 0", transform: `translateY(${(1 - s) * -420}px) rotate(${sw}deg)`, opacity: cl(s * 3) }}>
        <div style={{ position: "absolute", left: 16, top: -8, width: 12, height: 22, borderRadius: 6, border: "4px solid #8a949c" }} />
        <div style={{ position: "absolute", left: 14, top: 12, width: 16, height: "70%", borderRadius: 8, background: "linear-gradient(90deg,#8a5a34,#c79a68 45%,#7a4a28)" }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 44, height: "34%", borderRadius: "50% 50% 46% 46%", background: "radial-gradient(ellipse at 40% 35%,#d9b382,#9a6a3e 70%,#6b4224)", boxShadow: "0 12px 20px rgba(0,0,0,.45)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "12%", textAlign: "center", fontWeight: 900, fontSize: 20, color: "#3a2010", opacity: 0.85 }}>{20 - i}</div>
      </div>;
    })}
    <Big tt={tt} at={2.6} x={960} y={850} txt="20 MERIENDAS" size={120} col={AMB} />
    <Big tt={tt} at={3.0} x={960} y={950} txt="QUE DESAPARECIERON" size={52} />
  </>;
}}</Stage>;

// 3 · «Un bizcocho hecho el domingo esté como recién horneado el viernes»: el cartel de días pasa de DOM a VIE y el bizcocho sigue alto y humeando
export const SplitFlap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE"], st = cl((tt - 0.6) / 3.4) * 5, k = Math.min(5, Math.floor(st)), fr = st - Math.floor(st);
  const flip = k < 5 ? eio(fr, 0, 0.35) : 1, c = sp(tt, 0.1, 4.5, 0.6);
  const Half: React.FC<{ txt: string; top: boolean; rot?: number }> = ({ txt, top, rot = 0 }) => <div style={{ position: "absolute", left: 0, top: top ? 0 : 160, width: 420, height: 160, overflow: "hidden", borderRadius: top ? "18px 18px 0 0" : "0 0 18px 18px",
    background: top ? "linear-gradient(180deg,#2b2620,#1d1a16)" : "linear-gradient(180deg,#1a1713,#24201b)", transformOrigin: top ? "50% 100%" : "50% 0", transform: `perspective(900px) rotateX(${rot}deg)`, backfaceVisibility: "hidden" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: top ? 20 : -140, textAlign: "center", fontSize: 230, fontWeight: 900, lineHeight: "280px", color: k === 5 && txt === "VIE" ? AMB : "#f7f4ee" }}>{txt}</div></div>;
  const cur = D[k], nxt = D[Math.min(5, k + 1)];
  return <>
    <Table y={800} />
    <Shadow x={560} y={800} w={480} s={c} />
    <div style={pos(560, 640, `scale(${c})`, { width: 440, height: 260 })}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 440, height: 220, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(180deg,#e6b25e,#c98a3a 30%,#f2d9a0 34%,#f6e2b0 80%,#d9b070)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 10, top: 18, width: 420, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 40%,#f2c475,#c98a3a 70%)" }} />
    </div>
    <Steam tt={tt} x={560} y={560} w={240} h={240} o={cl(c)} />
    <div style={pos(1330, 470, `scale(${sp(tt, 0.2, 5, 0.55)})`, { width: 420, height: 320, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" })}>
      <Half txt={nxt} top />
      <Half txt={cur} top={false} />
      {k < 5 && <Half txt={cur} top rot={-180 * flip} />}
      {k < 5 && flip > 0.5 && <Half txt={nxt} top={false} rot={180 * (1 - flip)} />}
      <div style={{ position: "absolute", left: 0, top: 158, width: 420, height: 4, background: "#000" }} />
    </div>
    <Big tt={tt} at={4.4} x={1330} y={780} txt="COMO RECIÉN HECHO" size={62} col={AMB} />
  </>;
}}</Stage>;

// 4 · «Mi padre lo cortaba con su cuchillo de bolsillo, una tajada de queso y una de dulce»: la navaja se abre, corta el queso y el dulce y los apila
export const PenKnife: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), open = eio(tt, 0.4, 1.1), cut1 = eio(tt, 1.5, 2.1), cut2 = eio(tt, 2.5, 3.1), st = eio(tt, 3.3, 4.0);
  const kx = 960 + 300 * eio(tt, 1.2, 1.5) - 600 * eio(tt, 2.2, 2.5) + 300 * eio(tt, 3.1, 3.3);
  return <>
    <Table y={780} />
    <div style={pos(700, 640, `scale(${s})`, { width: 300, height: 170, borderRadius: 16, background: "linear-gradient(180deg,#fbf6e6,#e8dcbc)", boxShadow: "0 24px 40px rgba(0,0,0,.5), inset 0 0 0 2px #d8c89a" })} />
    <div style={pos(1220, 650, `scale(${s})`, { width: 280, height: 150, borderRadius: 10, background: "linear-gradient(180deg,#b8402a,#8a2a18)", boxShadow: "0 24px 40px rgba(0,0,0,.5)" })} />
    <div style={pos(700 + 260 * st, 520 - 40 * cut1 + 60 * st, `rotate(${-8 * (1 - st)}deg)`, { width: 300, height: 34, borderRadius: 6, background: "#fbf3dc", opacity: cut1, boxShadow: "0 10px 18px rgba(0,0,0,.4)" })} />
    <div style={pos(1220 - 260 * st, 540 - 40 * cut2 + 10 * st, `rotate(${6 * (1 - st)}deg)`, { width: 280, height: 30, borderRadius: 5, background: "#a8331f", opacity: cut2, boxShadow: "0 10px 18px rgba(0,0,0,.4)" })} />
    <div style={pos(kx, 380 + 80 * Math.max(cut1 * (1 - cut1), cut2 * (1 - cut2)) * 4, "", { width: 520, height: 80 })}>
      <div style={{ position: "absolute", left: 0, top: 22, width: 240, height: 46, borderRadius: 23, background: "linear-gradient(180deg,#9a6a3e,#5b3a22)", boxShadow: "0 16px 26px rgba(0,0,0,.5), inset 0 0 0 4px #c9a070" }} />
      <div style={{ position: "absolute", left: 230, top: 30, width: 280, height: 30, transformOrigin: "0 50%", transform: `rotate(${-180 + 180 * open}deg)`, clipPath: "polygon(0 0,100% 40%,92% 100%,0 100%)", background: "linear-gradient(180deg,#f2f5f7,#9aa3aa)" }} />
    </div>
    <Tape txt="EL DE MI PADRE" x={960} y={880} s={sp(tt, 3.6)} size={50} />
  </>;
}}</Stage>;

// 5 · «La cáscara es la olla del plátano. Lo cocina en su propio jugo»: la cáscara abierta se cierra como una tapa y adentro hierve el plátano
export const PeelPot: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cls = eio(tt, 0.5, 1.6), bub = cl((tt - 1.6) * 2);
  return <>
    <Table y={790} />
    <Shadow x={960} y={790} w={900} s={s} />
    <div style={pos(960, 600, `scale(${s})`, { width: 900, height: 300 })}>
      <div style={{ position: "absolute", left: 30, top: 140, width: 840, height: 140, borderRadius: "0 0 420px 420px / 0 0 140px 140px", background: "linear-gradient(180deg,#e0c050,#c9a030 50%,#5b4a1a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 80, top: 120, width: 740, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse,#f6e6a8,#e8c870 60%,#c9a040)" }}>
        {Array.from({ length: 9 }, (_, i) => { const ph = (tt * 0.8 + i * 0.37) % 1; return <div key={i} style={{ position: "absolute", left: 60 + i * 72, top: 40 - 30 * ph, width: 16, height: 16, borderRadius: "50%", border: "3px solid rgba(255,255,255,.7)", opacity: bub * (1 - ph) }} />; })}
      </div>
      <div style={{ position: "absolute", left: 30, top: 140, width: 840, height: 140, transformOrigin: "50% 0", transform: `perspective(1200px) rotateX(${180 - 180 * cls}deg)`, borderRadius: "420px 420px 0 0 / 140px 140px 0 0", background: "linear-gradient(0deg,#e8c84a,#b8902a 60%,#4a3a12)", boxShadow: "0 -10px 30px rgba(0,0,0,.4)" }}>
        {[200, 420, 640].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 30, width: 30, height: 14, borderRadius: "50%", background: "#3a2a0a", opacity: 0.6 }} />)}
      </div>
      <div style={{ position: "absolute", left: 870, top: 180, width: 40, height: 30, borderRadius: "0 16px 16px 0", background: "#5b4a1a" }} />
    </div>
    <Steam tt={tt} x={960} y={470} w={300} h={200} o={bub} />
    <Big tt={tt} at={2.4} x={960} y={250} txt="SU PROPIA OLLA" size={96} col={AMB} />
  </>;
}}</Stage>;

// 6 · «Mi madre ponía manzanas en la ceniza del fogón… y las sacaba tibias»: brasas que respiran; las tenazas sacan la manzana arrugada de la ceniza
export const Embers: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4, 0.6), lift = eio(tt, 2.4, 3.6), tg = eio(tt, 1.4, 2.4);
  return <>
    <div style={pos(960, 760, `scale(${s})`, { width: 1300, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,#8a8580 0 40%,#5a5550 70%,transparent 72%)" })}>
      {Array.from({ length: 22 }, (_, i) => { const g = 0.6 + 0.4 * Math.sin(tt * (1.2 + (i % 4) * 0.3) + i); return <div key={i} style={{ position: "absolute", left: 140 + (i * 197) % 1000, top: 90 + (i * 89) % 120, width: 60 + (i % 3) * 20, height: 34, borderRadius: "50%",
        background: `radial-gradient(ellipse, rgba(255,${120 + 60 * g},40,${0.9 * g}), rgba(160,40,10,${0.6 * g}) 60%, transparent 75%)`, filter: "blur(2px)" }} />; })}
    </div>
    <div style={pos(960, 690 - 330 * lift, `rotate(${-6 * lift}deg)`, { width: 230, height: 210 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "48% 52% 46% 54% / 55% 55% 45% 45%", background: "radial-gradient(circle at 38% 34%,#d8743a,#9a3a1a 55%,#5a2010)", boxShadow: "0 24px 30px rgba(0,0,0,.5)" }} />
      {[30, 80, 140].map((y, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 20, top: y, width: 150 - i * 30, height: 8, borderRadius: 4, background: "rgba(60,20,8,.5)", transform: `rotate(${i * 18 - 12}deg)` }} />)}
      <div style={{ position: "absolute", left: 100, top: -26, width: 10, height: 40, borderRadius: 4, background: "#4a2a12", transform: "rotate(12deg)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "48% 52% 46% 54%", background: "rgba(140,135,130,.55)", opacity: 1 - lift }} />
    </div>
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 960 + d * 70 * (1 - 0.35 * tg) - 8, top: -420 + 440 * tg + 690 - 330 * lift - 330, width: 16, height: 640, borderRadius: 8, background: "linear-gradient(90deg,#5b636a,#c9d0d6,#5b636a)", transform: `rotate(${d * 6}deg)`, transformOrigin: "50% 100%", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />)}
    <Big tt={tt} at={3.4} x={960} y={930} txt="EN LA CENIZA" size={90} col={AMB} />
  </>;
}}</Stage>;

// 7 · «Le sacas el corazón, pero sin atravesarla, que quede como un vasito»: la manzana cortada al medio; sale el corazón y el hueco se llena de azúcar y canela
export const AppleCup: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), core = eio(tt, 0.7, 1.7), fill = eio(tt, 2.1, 3.6);
  return <>
    <Table y={820} />
    <Shadow x={960} y={820} w={620} s={s} />
    <div style={pos(960, 580, `scale(${s})`, { width: 600, height: 560 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "46% 46% 44% 44% / 52% 52% 48% 48%", background: "radial-gradient(circle at 50% 45%,#fbf3d6,#f2e2b0 60%,#d8b870 78%,#a83a22 80%,#6a1a0e)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 300 - 5, top: -40, width: 12, height: 60, background: "#4a2a12", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 230, top: 90, width: 140, height: 330, borderRadius: "40px 40px 70px 70px", background: "linear-gradient(180deg,#4a2a12,#6a3a1a)", boxShadow: "inset 0 10px 30px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, borderRadius: "10px 10px 70px 70px", background: "repeating-radial-gradient(circle at 30% 30%, #f6ecd6 0 3px, #e4c58a 3px 6px), #e8cfa0" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 18, background: "rgba(150,80,30,.75)", opacity: cl(fill * 3 - 2) }} /></div>
      </div>
      <div style={{ position: "absolute", left: 240, top: 90 - 520 * core, width: 120, height: 320, borderRadius: "30px 30px 60px 60px", background: "linear-gradient(90deg,#efe0b0,#fbf3d6 50%,#e2cf98)", opacity: 1 - eio(tt, 1.6, 2.0) }}>
        {[90, 150, 210].map((y) => <div key={y} style={{ position: "absolute", left: 48, top: y, width: 20, height: 34, borderRadius: "50%", background: "#3a1a0a" }} />)}
      </div>
    </div>
    {Array.from({ length: 30 }, (_, i) => { const a = 2.0 + (i % 15) * 0.1, f = cl((tt - a) / 0.6); return f > 0 && f < 1 ? <div key={i} style={{ position: "absolute", left: 930 + (i * 13) % 60, top: 120 + 330 * f, width: 8, height: 8, borderRadius: 2, background: i % 4 ? "#f6ecd6" : "#8a4a1a" }} /> : null; })}
    <Tape txt="COMO UN VASITO" x={1450} y={420} s={sp(tt, 1.9)} size={56} />
  </>;
}}</Stage>;

// 8 · «Los ponía a levar en la ventana, tapados con un paño, y nosotros mirábamos cómo crecían»: en la ventana el sol se mueve y la masa levanta el paño
export const Rise: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = sp(tt, 0.05, 4, 0.6), gr = eio(tt, 0.6, 5.0), sun = eio(tt, 0, 6);
  return <>
    <div style={pos(960, 420, `scale(${s})`, { width: 1100, height: 640, borderRadius: 10, background: `linear-gradient(180deg, hsl(${200 + 10 * sun},60%,${62 - 10 * sun}%), hsl(${30 + 10 * sun},70%,${75 - 8 * sun}%))`, boxShadow: "inset 0 0 0 26px #e9e2d2, inset 0 0 0 30px #b9ad94, 0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" })}>
      <div style={{ position: "absolute", left: 120 + 800 * sun, top: 240 - 150 * Math.sin(Math.PI * sun), width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle,#fff6d0,#ffd27a 60%,transparent 72%)", boxShadow: "0 0 80px #ffd27a" }} />
      <div style={{ position: "absolute", left: 535, top: 0, width: 30, height: 640, background: "#e9e2d2" }} />
      <div style={{ position: "absolute", left: 0, top: 300, width: 1100, height: 30, background: "#e9e2d2" }} />
    </div>
    <div style={pos(960, 760, "", { width: 1240, height: 60, borderRadius: 8, background: "linear-gradient(180deg,#f2ece0,#c9bfa8)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" })} />
    <div style={pos(960, 660, `scale(${s})`, { width: 420, height: 200 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 420, height: 140, borderRadius: "0 0 210px 210px / 0 0 120px 120px", background: "linear-gradient(90deg,#c9d2da,#fbfdff 40%,#b9c3cc)" }} />
      <div style={{ position: "absolute", left: 30, top: 70 - 150 * gr, width: 360, height: 60 + 150 * gr, borderRadius: "50% 50% 10% 10% / 70% 70% 10% 10%", background: "linear-gradient(180deg,#d9363e 0 14%,#fff 14% 28%,#d9363e 28% 42%,#fff 42% 56%,#d9363e 56% 70%,#fff 70%)", backgroundSize: "60px 100%", boxShadow: "0 10px 20px rgba(0,0,0,.35)", transform: `scaleX(${1 + 0.06 * gr})` }} />
    </div>
    <Big tt={tt} at={3.2} x={960} y={930} txt="CRECE EN LA VENTANA" size={70} col={AMB} />
  </>;
}}</Stage>;

// 9 · «Tan espeso que la cuchara se quedaba parada en la taza»: la cuchara cae en el chocolate y queda de pie, temblando
export const SpoonStand: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), fall = eio(tt, 0.5, 1.0), wob = 7 * damp(tt, 1.0, 1.6, 1.6);
  return <>
    <Table y={800} />
    <Shadow x={940} y={800} w={480} s={s} />
    <div style={pos(940, 660, `scale(${2.2 * s})`)}><Cup w={190} /></div>
    <div style={pos(880, 520, "", { width: 230, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#6a3a1e,#3a1a0a 70%)", boxShadow: "inset 0 6px 14px rgba(0,0,0,.6)" })} />
    <div style={{ position: "absolute", left: 870, top: -560 + 900 * fall, width: 28, height: 440, transformOrigin: "50% 100%", transform: `rotate(${wob}deg)` }}>
      <div style={{ position: "absolute", left: 4, top: 0, width: 20, height: 330, borderRadius: 10, background: "linear-gradient(90deg,#8a949c,#eef2f5 45%,#7a848c)" }} />
      <div style={{ position: "absolute", left: -10, top: 300, width: 48, height: 100, borderRadius: "50%", background: "linear-gradient(90deg,#8a949c,#eef2f5 45%,#7a848c)" }} />
      <div style={{ position: "absolute", left: -12, top: 330, width: 52, height: 110, background: "#3a1a0a", borderRadius: "0 0 20px 20px", opacity: fall }} />
    </div>
    <Big tt={tt} at={2.0} x={1450} y={460} txt="PARADA" size={120} col={AMB} />
    <Big tt={tt} at={2.4} x={1450} y={560} txt="EN LA TAZA" size={60} />
  </>;
}}</Stage>;

// 10 · «El error es echar la maicena en polvo directo a la leche caliente… siempre disuelta en frío primero»: dos vasos; en el frío se disuelve liso, en el caliente quedan grumos
export const TwoGlass: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), f1 = eio(tt, 0.4, 1.4), mix = eio(tt, 1.4, 3.0);
  const Glass: React.FC<{ x: number; hot?: boolean; children?: React.ReactNode }> = ({ x, hot, children }) => <div style={pos(x, 560, `scale(${s})`, { width: 320, height: 420 })}>
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", background: "linear-gradient(90deg,rgba(255,255,255,.12),rgba(255,255,255,.04) 40%,rgba(255,255,255,.14))", border: "3px solid rgba(255,255,255,.35)" }} />
    <div style={{ position: "absolute", left: 20, right: 20, bottom: 10, height: 300, clipPath: "polygon(0 0,100% 0,92% 100%,8% 100%)", background: hot ? "linear-gradient(180deg,#f6efe0,#e9dcc0)" : "linear-gradient(180deg,#eef4f8,#dfe8ee)" }}>{children}</div>
  </div>;
  return <>
    <Table y={790} />
    <Glass x={620}>
      {f1 > 0 && <div style={{ position: "absolute", left: 120, top: -260 + 260 * f1, width: 40, height: 80, background: "#fff", borderRadius: 20, opacity: 1 - mix }} />}
      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from ${mix * 720}deg at 50% 50%, rgba(255,255,255,${0.5 * (1 - mix)}), transparent 30%, rgba(255,255,255,${0.4 * (1 - mix)}) 60%, transparent)` }} />
    </Glass>
    <Steam tt={tt} x={1300} y={340} w={200} h={160} />
    <Glass x={1300} hot>
      {Array.from({ length: 9 }, (_, i) => { const a = 3.2 + i * 0.07, f = eio(tt, a, a + 0.7); return f > 0 ? <div key={i} style={{ position: "absolute", left: 40 + (i * 53) % 200, top: -200 + (220 + (i * 37) % 60) * f, width: 34 + (i % 3) * 8, height: 30 + (i % 2) * 8, borderRadius: "45% 55% 50% 50%", background: "radial-gradient(circle at 35% 30%,#fff,#e8dcc0 70%)", boxShadow: "0 3px 6px rgba(0,0,0,.25)" }} /> : null; })}
    </Glass>
    <Tape txt="FRÍA" x={620} y={830} s={sp(tt, 0.6)} size={48} col="#1d4e8f" />
    <Tape txt="CALIENTE" x={1300} y={830} s={sp(tt, 3.0)} size={48} col="#8a2a18" />
    <Big tt={tt} at={2.4} x={620} y={230} txt="PRIMERO EN FRÍO" size={64} col={ICE} />
    <Big tt={tt} at={4.6} x={1300} y={230} txt="GRUMOS" size={64} col={RED} />
  </>;
}}</Stage>;
