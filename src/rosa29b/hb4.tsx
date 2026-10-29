// rosa29b · componentes únicos 31-40. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Steam, Tape, Big, Cup, Jar, Table, Shadow } from "./rkit";
import { P, sp, pos } from "./hb1";

// 31 · «Un paquete de galletas con relleno te cuesta lo mismo que un litro de leche, media docena de huevos y un kilo de harina»: el paquete se abre casi vacío y en su lugar caen la leche, los huevos y la harina
export const Swap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), op = eio(tt, 0.4, 1.2), go = eio(tt, 1.6, 2.3), a1 = sp(tt, 2.3, 6, 0.45), a2 = sp(tt, 2.7, 6, 0.45), a3 = sp(tt, 3.1, 6, 0.45), ar = eio(tt, 3.8, 4.6);
  return <>
    <Table y={800} />
    <div style={pos(560 - 120 * go, 620 + 40 * go, `scale(${s * (1 - 0.4 * go)}) rotate(${-4 - 6 * go}deg)`, { width: 420, height: 260, opacity: 1 - 0.55 * go })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(180deg,#2f7fd8,#1d4e8f)", boxShadow: "0 24px 40px rgba(0,0,0,.5)", clipPath: `polygon(0 ${30 * op}%,100% ${30 * op}%,100% 100%,0 100%)` }} />
      <div style={{ position: "absolute", left: 0, top: -40 * op, width: 420, height: 80, borderRadius: "18px 18px 0 0", background: "linear-gradient(180deg,#5aa0f0,#2f7fd8)", transformOrigin: "0 100%", transform: `rotate(${-24 * op}deg)` }} />
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 120, top: 60, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle,#f2e2c0 0 30%,#5a2a14 34% 60%,#c98a4a 64%)", opacity: op }} />)}
      <div style={{ position: "absolute", left: 30, bottom: 30, padding: "4px 14px", borderRadius: 6, background: "#f2b630", fontWeight: 900, fontSize: 30, color: "#2b2018" }}>$</div>
    </div>
    <svg width={300} height={100} style={{ position: "absolute", left: 760, top: 560, overflow: "visible" }}><path d="M 10 50 C 90 20, 180 80, 270 50" stroke={AMB} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ar} 1`} /><path d="M 240 30 L 275 50 L 240 72" stroke={AMB} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={cl(ar * 3 - 2)} /></svg>
    <Shadow x={1400} y={800} w={760} s={a1} />
    <div style={pos(1180, 610 - 400 * (1 - cl(a1)), "", { width: 160, height: 320, opacity: cl(a1 * 3) })}>
      <div style={{ position: "absolute", left: 40, top: 0, width: 80, height: 60, borderRadius: "10px 10px 0 0", background: "#1d4e8f" }} />
      <div style={{ position: "absolute", left: 0, top: 50, width: 160, height: 270, borderRadius: 14, background: "linear-gradient(90deg,#dfe6ec,#fff 40%,#c9d2da)", boxShadow: "0 20px 30px rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", left: 0, top: 140, width: 160, height: 60, background: "#2f7fd8" }} />
    </div>
    <div style={pos(1420, 720 - 400 * (1 - cl(a2)), "", { width: 280, height: 120, opacity: cl(a2 * 3) })}>
      <div style={{ position: "absolute", left: 0, top: 50, width: 280, height: 70, borderRadius: 8, background: "linear-gradient(180deg,#c9b48a,#9a8460)", boxShadow: "0 16px 24px rgba(0,0,0,.45)" }} />
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 14 + (i % 3) * 88, top: i < 3 ? 6 : 26, width: 76, height: 70, borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%", background: "radial-gradient(circle at 35% 30%,#f2d2a8,#c98a50 70%)", zIndex: i < 3 ? 0 : 1 }} />)}
    </div>
    <div style={pos(1660, 640 - 400 * (1 - cl(a3)), "rotate(3deg)", { width: 220, height: 300, borderRadius: "30px 30px 14px 14px", background: "linear-gradient(90deg,#efe6d2,#fbf7ee 40%,#e2d6bc)", boxShadow: "0 20px 30px rgba(0,0,0,.45)", opacity: cl(a3 * 3) })}>
      <div style={{ position: "absolute", left: 30, top: 110, width: 160, height: 70, borderRadius: 8, background: "#b33a2c", color: "#fff", fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>1 KG</div>
    </div>
    <Big tt={tt} at={4.4} x={960} y={220} txt="CUESTA LO MISMO" size={96} col={AMB} />
  </>;
}}</Stage>;

// 32 · «El lunes hay queso con dulce. El martes, plátano con canela…»: la bandeja giratoria de madera trae al frente la merienda de cada día
export const Wheel: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const D: [string, string][] = [["LUN", "#b8402a"], ["MAR", "#e8d24a"], ["MIÉ", "#c98a3a"], ["JUE", "#5a2a14"], ["VIE", "#f6ecd4"], ["SÁB", "#f08a1a"], ["DOM", "#e6b25e"]];
  const st = cl((tt - 0.4) / 8.6) * 6, k = Math.floor(st), fr = st - k, rot = -(k + eio(fr, 0, 0.35)) * (360 / 7);
  return <>
    <div style={pos(960, 640, `scale(${s}) perspective(1400px) rotateX(58deg)`, { width: 980, height: 980 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle,#9a6a3e 0 30%,#7a4a28 31%,#9a6a3e 60%,#6b4224 98%)", boxShadow: "0 50px 60px rgba(0,0,0,.6), inset 0 0 0 18px #5b3a22" }} />
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)` }}>
        {D.map(([d, c], i) => { const a = (i * 360) / 7 + 90; return <div key={d} style={{ position: "absolute", left: 490 + 330 * Math.cos((a * Math.PI) / 180) - 80, top: 490 + 330 * Math.sin((a * Math.PI) / 180) - 80, width: 160, height: 160, transform: `rotate(${a - 90}deg)` }}>
          <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: "radial-gradient(circle,#fbfdff,#dfe6ec 70%)", boxShadow: "0 10px 16px rgba(0,0,0,.4)" }} />
          <div style={{ position: "absolute", left: 40, top: 40, width: 80, height: 80, borderRadius: i === 1 ? "50% 50% 40% 40% / 80% 80% 20% 20%" : "40%", background: c }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: -40, textAlign: "center", fontSize: 36, fontWeight: 900, color: i === k + (fr > 0.35 ? 0 : 0) ? AMB : "#f7f4ee" }}>{d}</div>
        </div>; })}
      </div>
    </div>
    <div style={pos(960, 1000, "", { width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderBottom: `40px solid ${AMB}` })} />
    <Big tt={tt} at={0.8} x={960} y={140} txt="LA SEMANA ENTERA" size={84} col={AMB} />
  </>;
}}</Stage>;

// 33 · «Te sale menos de lo que gastas en dos visitas a la panadería»: salen dos tickets; el de la panadería larguísimo, el de la semana en casa cortito
export const Receipt: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = eio(tt, 0.3, 2.4), R = eio(tt, 2.2, 2.8);
  const Tk: React.FC<{ x: number; len: number; title: string; n: number }> = ({ x, len, title, n }) => <div style={{ position: "absolute", left: x - 180, top: 120, width: 360, height: len, overflow: "hidden", background: "linear-gradient(180deg,#fbfaf6,#efece4)", boxShadow: "0 20px 30px rgba(0,0,0,.5)",
    clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),92% 100%,84% calc(100% - 12px),76% 100%,68% calc(100% - 12px),60% 100%,52% calc(100% - 12px),44% 100%,36% calc(100% - 12px),28% 100%,20% calc(100% - 12px),12% 100%,4% calc(100% - 12px),0 100%)" }}>
    <div style={{ padding: "26px 24px 0", fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "#2b2620" }}>{title}</div>
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ margin: "14px 24px 0", height: 14, width: `${50 + (i * 23) % 40}%`, background: "#c9c2b2", borderRadius: 3 }} />)}
  </div>;
  return <>
    <div style={pos(960, 110, "", { width: 1100, height: 40, borderRadius: 20, background: "linear-gradient(180deg,#3a3a3a,#111)" })} />
    <Tk x={640} len={60 + 760 * L} title="PANADERÍA × 2" n={30} />
    <Tk x={1280} len={60 + 230 * R} title="EN CASA" n={6} />
    <Big tt={tt} at={3.2} x={1280} y={560} txt="MENOS" size={110} col={AMB} />
    <Big tt={tt} at={3.6} x={1280} y={660} txt="TODA LA SEMANA" size={50} />
  </>;
}}</Stage>;

// 34 · «A las cinco, se deja todo. La ropa a medio planchar, la costura, la tierra de la huerta… se ponía la jarra en el medio»: la plancha, el carretel y la pala se apartan; llega la jarra
export const DropAll: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), d = (a: number) => eio(tt, a, a + 0.6), j = sp(tt, 2.9, 5.5, 0.5);
  return <>
    <Table y={790} />
    <div style={pos(420 - 120 * d(0.5), 660 + 40 * d(0.5), `scale(${s}) rotate(${-10 * d(0.5)}deg)`, { width: 300, height: 170, opacity: 1 - 0.6 * d(0.5) })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 300, height: 100, borderRadius: "150px 20px 20px 20px / 100px 20px 20px 20px", background: "linear-gradient(180deg,#e8edf0,#8a949c)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 90, top: 0, width: 170, height: 70, borderRadius: "40px 40px 0 0", border: "18px solid #b33a2c", borderBottom: "none" }} />
    </div>
    <div style={pos(720 - 60 * d(1.1), 680 + 50 * d(1.1), `scale(${s}) rotate(${30 * d(1.1)}deg)`, { width: 120, height: 150, opacity: 1 - 0.6 * d(1.1) })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 26, borderRadius: 6, background: "#c9a070" }} />
      <div style={{ position: "absolute", left: 14, top: 26, width: 92, height: 98, background: "repeating-linear-gradient(180deg,#2f7fd8 0 6px,#1d4e8f 6px 9px)" }} />
      <div style={{ position: "absolute", left: 0, top: 124, width: 120, height: 26, borderRadius: 6, background: "#c9a070" }} />
      <div style={{ position: "absolute", left: 100, top: -60, width: 4, height: 120, background: "#d8dde2", transform: "rotate(25deg)" }} />
    </div>
    <div style={pos(1500 + 120 * d(1.7), 640 + 40 * d(1.7), `scale(${s}) rotate(${30 + 20 * d(1.7)}deg)`, { width: 90, height: 380, opacity: 1 - 0.6 * d(1.7) })}>
      <div style={{ position: "absolute", left: 35, top: 0, width: 20, height: 220, borderRadius: 10, background: "linear-gradient(90deg,#8a5a34,#c79a68,#7a4a28)" }} />
      <div style={{ position: "absolute", left: 0, top: 210, width: 90, height: 170, borderRadius: "10px 10px 45px 45px", background: "linear-gradient(90deg,#5b636a,#c9d0d6,#5b636a)" }} />
      <div style={{ position: "absolute", left: 10, top: 300, width: 70, height: 70, borderRadius: "50%", background: "#5a3a1a", opacity: 0.8 }} />
    </div>
    <Shadow x={1050} y={790} w={300} s={j} />
    <div style={pos(1050, 640 - 500 * (1 - cl(j)), "", { width: 230, height: 300, opacity: cl(j * 3) })}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 190, height: 270, borderRadius: "30px 30px 60px 60px", background: "linear-gradient(90deg,#7a3b1f,#c47040 40%,#5e2c16)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 180, top: 80, width: 60, height: 130, borderRadius: "0 40px 40px 0", border: "16px solid #9a4d2a", borderLeft: "none" }} />
      <div style={{ position: "absolute", left: 30, top: 10, width: 170, height: 40, borderRadius: "50%", background: "#3a1a0a" }} />
    </div>
    <Steam tt={tt} x={1050} y={420} w={180} h={180} o={cl(j)} />
    <Big tt={tt} at={2.6} x={960} y={210} txt="A LAS CINCO" size={120} col={AMB} />
    <Big tt={tt} at={3.0} x={960} y={320} txt="SE DEJA TODO" size={56} />
  </>;
}}</Stage>;

// 35 · «No hay niño en el mundo que no quiera apretar la manga»: la manga de tela se aprieta y la masa estriada dibuja un corazón
export const Piping: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), p = eio(tt, 0.4, 3.6), sq = 1 - 0.12 * Math.abs(Math.sin(tt * 2.4)) * (p < 1 ? 1 : 0);
  const pts = Array.from({ length: 80 }, (_, i) => { const u = (i / 79) * Math.PI * 2; return [960 + 220 * Math.pow(Math.sin(u), 3), 640 - (170 * Math.cos(u) - 70 * Math.cos(2 * u) - 26 * Math.cos(3 * u) - 10 * Math.cos(4 * u))]; });
  const d = "M " + pts.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join(" L ");
  const idx = Math.min(79, Math.floor(p * 79)), tip = pts[idx];
  return <>
    <Table y={860} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={d} stroke="#a8641e" strokeWidth={50} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} style={{ filter: "drop-shadow(0 10px 8px rgba(0,0,0,.5))" }} />
      <path d={d} stroke="#e8b060" strokeWidth={36} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      {[-12, 0, 12].map((o) => <path key={o} d={d} stroke="#f6d090" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${p} 1`} transform={`translate(${o * 0.3} ${o})`} opacity={0.8} />)}
    </svg>
    <div style={{ position: "absolute", left: tip[0] - 120, top: tip[1] - 420, width: 240, height: 420, transform: `scale(${s}) scaleX(${sq})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 240, height: 360, clipPath: "polygon(0 0,100% 0,62% 100%,38% 100%)", background: "linear-gradient(90deg,#d8cdb4,#f6f0e2 40%,#c9bea4)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: 96, top: 350, width: 48, height: 70, clipPath: "polygon(0 0,100% 0,80% 100%,20% 100%)", background: "linear-gradient(90deg,#8a949c,#eef2f5,#7a848c)" }} />
    </div>
    <Big tt={tt} at={2.6} x={960} y={150} txt="APRETAR LA MANGA" size={84} col={AMB} />
  </>;
}}</Stage>;

// 36 · «La de naranja iba a la mermelada, la de limón al arroz con leche, la de manzana se secaba en la ventana para el té»: cada cáscara vuela a su lugar
export const Peels3: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const PEEL: [string, number, number][] = [["#f08a1a", 0.4, 300], ["#f6e04a", 1.5, 560], ["#c0392b", 2.6, 820]];
  return <>
    <Table y={860} />
    {PEEL.map(([c, a, y], i) => { const f = eio(tt, a, a + 1.0), x0 = 330, y0 = y, x1 = 1420, y1 = [520, 600, 640][i]; const x = x0 + (x1 - x0) * f, yy = y0 + (y1 - y0) * f - 220 * Math.sin(Math.PI * f);
      return <React.Fragment key={i}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 440} ${x1} ${y1}`} stroke={c} strokeWidth={4} strokeDasharray="12 14" fill="none" opacity={0.45 * cl(f * 4) * (1 - eio(tt, a + 1.0, a + 1.4))} /></svg>
        <div style={pos(x, yy, `rotate(${f * 360}deg) scale(${s * (1 - 0.5 * eio(tt, a + 0.9, a + 1.1))})`, { width: 160, height: 40, borderRadius: 20, background: `linear-gradient(180deg, ${c}, #0003)`, opacity: 1 - eio(tt, a + 0.95, a + 1.1) })} />
      </React.Fragment>; })}
    <div style={pos(1420, 540, `scale(${s})`)}><Jar w={150} fill={0.6 + 0.2 * eio(tt, 1.3, 1.6)} col="#f08a1a" lid="#b33a2c" /></div>
    <div style={pos(1640, 680, `scale(${s})`, { width: 240, height: 140, borderRadius: "10px 10px 80px 80px", background: "linear-gradient(90deg,#8a949c,#eef2f5 40%,#5b636a)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" })}>
      <div style={{ position: "absolute", left: 10, top: -14, width: 220, height: 40, borderRadius: "50%", background: "#f6ecd4" }} /></div>
    <div style={pos(1200, 700, `scale(${1.2 * s})`)}><Cup w={130} /></div>
    <Tape txt="MERMELADA" x={1420} y={350} s={sp(tt, 1.4)} size={34} />
    <Tape txt="ARROZ" x={1660} y={560} s={sp(tt, 2.5)} size={34} />
    <Tape txt="TÉ" x={1190} y={570} s={sp(tt, 3.6)} size={34} />
    <Big tt={tt} at={4.0} x={760} y={980} txt="NINGUNA CÁSCARA SE TIRA" size={66} col={AMB} />
  </>;
}}</Stage>;

// 37 · «Esa casa todavía tiene mesa»: la casita de noche; se prende la ventana y adentro aparece la mesa con su lámpara
export const HouseWin: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 90% 70% at 50% 40%, #1c2a44, #070a12 75%)" cam={1.3}>{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), on = cl((tt - 0.8) * 2.5), z = 1 + 0.25 * eio(tt, 1.2, 5.5);
  return <>
    {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 197) % 1920, top: (i * 61) % 380, width: 3, height: 3, borderRadius: "50%", background: "#fff", opacity: 0.4 + 0.3 * Math.sin(tt * 0.8 + i) }} />)}
    <div style={pos(960, 600, `scale(${s * z})`, { width: 800, height: 620 })}>
      <div style={{ position: "absolute", left: 40, top: 0, width: 0, height: 0, borderLeft: "360px solid transparent", borderRight: "360px solid transparent", borderBottom: "220px solid #4a2a20" }} />
      <div style={{ position: "absolute", left: 80, top: 220, width: 640, height: 400, background: "linear-gradient(180deg,#e8dcc4,#c9b994)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 480, top: 380, width: 140, height: 240, borderRadius: "70px 70px 0 0", background: "#6b4224" }} />
      <div style={{ position: "absolute", left: 160, top: 300, width: 260, height: 200, background: `rgba(255,${200 + 30 * on},${110 + 40 * on},${0.15 + 0.85 * on})`, boxShadow: `0 0 ${90 * on}px rgba(255,200,110,.7), inset 0 0 0 10px #f2ece0`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 110, top: 20, width: 40, height: 50, borderRadius: "20px 20px 6px 6px", background: "#fff6d0", opacity: on }} />
        <div style={{ position: "absolute", left: 128, top: 0, width: 4, height: 22, background: "#3a2414", opacity: on }} />
        <div style={{ position: "absolute", left: 40, top: 130, width: 180, height: 16, background: "#3a2414", opacity: on }} />
        {[50, 200].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 146, width: 10, height: 50, background: "#3a2414", opacity: on }} />)}
        {[20, 210].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 90, width: 30, height: 110, borderRadius: "8px 8px 0 0", border: "6px solid #3a2414", borderBottom: "none", opacity: on }} />)}
        <div style={{ position: "absolute", left: 125, top: 118, width: 20, height: 14, borderRadius: "0 0 8px 8px", background: "#fff", opacity: on }} />
        <div style={{ position: "absolute", left: 125, top: 0, width: 4, height: 200, background: "#f2ece0" }} />
        <div style={{ position: "absolute", left: 0, top: 96, width: 260, height: 4, background: "#f2ece0" }} />
      </div>
    </div>
    <Big tt={tt} at={2.2} x={960} y={140} txt="TODAVÍA TIENE MESA" size={90} col={AMB} />
  </>;
}}</Stage>;

// 38 · «El vasito del yogur es la medida… dos vasitos de azúcar, tres de harina, uno de aceite»: el vasito se multiplica en tres columnas
export const YogurtCups: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const COL: [string, number, string, number][] = [["AZÚCAR", 2, "#fbfaf6", 1.0], ["HARINA", 3, "#efe6d2", 2.0], ["ACEITE", 1, "#e8c84a", 3.4]];
  const YC: React.FC<{ fill: string }> = ({ fill }) => <div style={{ position: "relative", width: 150, height: 170 }}>
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0,100% 0,86% 100%,14% 100%)", background: "linear-gradient(90deg,#dfe6ec,#fff 40%,#c9d2da)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 18, right: 18, top: 22, bottom: 6, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: fill }} />
    <div style={{ position: "absolute", left: -6, top: -10, width: 162, height: 24, borderRadius: "50%", background: "#2f7fd8" }} />
  </div>;
  return <>
    <Table y={860} />
    <div style={pos(960, 200, `scale(${s})`)}><YC fill="rgba(255,255,255,.2)" /></div>
    {COL.map(([n, c, f, a], i) => <React.Fragment key={n}>
      {Array.from({ length: c }, (_, j) => { const q = sp(tt, a + j * 0.35, 6, 0.45); return q > 0.01 ? <div key={j} style={pos(560 + i * 400, 760 - j * 180 - 400 * (1 - cl(q)), "", { opacity: cl(q * 3) })}><YC fill={f} /></div> : null; })}
      <Tape txt={`${n} × ${c}`} x={560 + i * 400} y={930} s={sp(tt, a + 0.2)} size={42} />
    </React.Fragment>)}
    <Big tt={tt} at={0.6} x={1500} y={200} txt="LA MEDIDA" size={80} col={AMB} />
  </>;
}}</Stage>;

// 39 · «Lo envuelves en un paño limpio de algodón y lo guardas en una lata cerrada… te dura seis días blando»: el paño envuelve el bizcocho y la lata se cierra
export const Bundle: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), f = (a: number) => eio(tt, a, a + 0.5), drop = eio(tt, 2.4, 3.0), lid = sp(tt, 3.2, 5.5, 0.5);
  const cloth = "repeating-linear-gradient(0deg,#f4efe3 0 30px,#d9363e 30px 34px,#f4efe3 34px 64px), repeating-linear-gradient(90deg,transparent 0 30px,rgba(217,54,62,.6) 30px 34px,transparent 34px 64px)";
  return <>
    <Table y={860} />
    <div style={pos(960, 720, `scale(${s})`, { width: 620, height: 300 })}>
      <div style={{ position: "absolute", left: 0, top: 100, width: 620, height: 200, borderRadius: 18, background: "linear-gradient(90deg,#1d4e8f,#3a7bd0 40%,#173f75)", boxShadow: "0 30px 40px rgba(0,0,0,.5), inset 0 0 0 6px rgba(255,255,255,.25)" }} />
      <div style={{ position: "absolute", left: 60, top: 160, width: 500, height: 60, fontFamily: "serif", fontSize: 40, fontWeight: 900, color: "#f2e2b0", textAlign: "center" }}>GALLETAS</div>
    </div>
    <div style={pos(960, 480 + 200 * drop, `scale(${s * (1 - 0.15 * drop)})`, { width: 440, height: 220 })}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 400, height: 180, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(180deg,#e6b25e,#c98a3a 30%,#f2d9a0 34%,#d9b070)" }} />
      <div style={{ position: "absolute", left: -40, top: 0, width: 260, height: 240, background: cloth, transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-180 + 180 * f(0.3)}deg)`, opacity: cl(f(0.3) * 3), boxShadow: "0 10px 20px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 220, top: 0, width: 260, height: 240, background: cloth, transformOrigin: "100% 50%", transform: `perspective(900px) rotateY(${180 - 180 * f(0.9)}deg)`, opacity: cl(f(0.9) * 3), boxShadow: "0 10px 20px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: -30, top: -30, width: 500, height: 150, background: cloth, transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${-180 + 180 * f(1.5)}deg)`, opacity: cl(f(1.5) * 3), borderRadius: 10 }} />
    </div>
    <div style={pos(960, 760 - 520 * (1 - cl(lid)), "", { width: 660, height: 70, borderRadius: 16, background: "linear-gradient(180deg,#3a7bd0,#1d4e8f)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", opacity: cl(lid * 3) })} />
    <Tape txt="6 DÍAS BLANDO" x={1500} y={420} s={sp(tt, 3.8)} size={56} />
  </>;
}}</Stage>;

// 40 · «El error es abrir el horno antes de los treinta minutos: el bizcocho se baja y no vuelve a subir. Paciencia»: se abre la puerta, entra el frío y el bizcocho se hunde
export const OvenDoor: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), op = eio(tt, 0.5, 1.1) * (1 - eio(tt, 3.2, 3.8)), sink = eio(tt, 1.2, 2.6);
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 900, height: 640, borderRadius: 24, background: "linear-gradient(180deg,#e9e6df,#c9c4b8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 90, top: 100, width: 720, height: 460, borderRadius: 12, background: "radial-gradient(ellipse at 50% 100%, rgba(255,150,50,.7), #1a1410 75%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 200, top: 300, width: 320, height: 14, background: "#5b636a" }} />
        <div style={{ position: "absolute", left: 220, top: 300 - (190 - 110 * sink), width: 280, height: 190 - 110 * sink, borderRadius: `${140 - 100 * sink}px ${140 - 100 * sink}px 10px 10px / ${120 - 90 * sink}px ${120 - 90 * sink}px 10px 10px`, background: "linear-gradient(180deg,#e6b25e,#c98a3a 30%,#f2d9a0)" }} />
        {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.8 + i * 0.2) % 1; return <div key={i} style={{ position: "absolute", left: 80 + i * 130, top: -40 + 300 * ph, width: 120, height: 30, borderRadius: 15, background: "rgba(170,210,255,.5)", filter: "blur(6px)", opacity: op * (1 - ph) }} />; })}
      </div>
      <div style={{ position: "absolute", left: 70, top: 580, width: 760, height: 480, transformOrigin: "50% 0", transform: `perspective(1400px) rotateX(${-180 + 180 * (1 - op)}deg)`, borderRadius: 14, background: "linear-gradient(180deg,#dcd8cf,#b5afa2)" }} />
      <div style={{ position: "absolute", left: 90, top: 100, width: 720, height: 460, borderRadius: 12, border: "16px solid #b5afa2", opacity: 1 - op, background: "rgba(40,30,20,.25)" }} />
    </div>
    <Tape txt="ANTES DE 30 MIN" x={1550} y={300} s={sp(tt, 0.8)} size={48} />
    <Big tt={tt} at={3.6} x={960} y={1000} txt="PACIENCIA" size={110} col={AMB} />
  </>;
}}</Stage>;
