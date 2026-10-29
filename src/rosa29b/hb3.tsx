// rosa29b · componentes únicos 21-30. Todo en código.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Steam, Tape, Big, Table, Shadow } from "./rkit";
import { P, sp, pos } from "./hb1";

// 21 · «La merienda de los cumpleaños pobres… la misma crema siete veces al año»: el vasito de crema con galletas al fondo; cae la vela y se prende
export const Candle: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cd = sp(tt, 0.9, 5, 0.5), lit = cl((tt - 1.8) * 3), fl = 1 + 0.08 * Math.sin(tt * 2 * Math.PI * 1.6);
  return <>
    <Table y={820} />
    <Shadow x={960} y={820} w={420} s={s} />
    <div style={pos(960, 640, `scale(${s})`, { width: 360, height: 420 })}>
      <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(180deg,#f6cf4a 0 55%,#e8c070 55% 60%,#c9954a 60% 72%,#f0d8a0 72% 76%,#b98040 76%)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.35)" }} />
      <div style={{ position: "absolute", left: 30, top: 0, width: 50, height: 400, background: "linear-gradient(180deg,rgba(255,255,255,.5),transparent)", clipPath: "polygon(0 0,100% 0,60% 100%,40% 100%)" }} />
    </div>
    <div style={pos(960, 380 - 500 * (1 - cl(cd)), "", { width: 30, height: 150, borderRadius: 6, background: "repeating-linear-gradient(135deg,#f2f2f2 0 12px,#e2365b 12px 22px)" })} />
    {lit > 0 && <div style={pos(960, 280, `scale(${lit * fl})`, { width: 44, height: 90, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 70%,#fff 0 20%,#ffd060 45%,rgba(255,120,30,.7) 70%,transparent 72%)", boxShadow: "0 0 80px 30px rgba(255,190,90,.45)" })} />}
    {Array.from({ length: 24 }, (_, i) => { const f = cl((tt - 2.2 - (i % 8) * 0.18) / 3); return f > 0 ? <div key={i} style={{ position: "absolute", left: 300 + (i * 157) % 1320, top: -20 + 900 * f, width: 18, height: 10, borderRadius: 2, background: ["#e2365b", "#f2b630", "#2f7fd8", "#3cb371"][i % 4], transform: `rotate(${tt * 90 + i * 40}deg)`, opacity: 0.8 }} /> : null; })}
    <Big tt={tt} at={2.6} x={960} y={960} txt="PARA CADA CUMPLEAÑOS" size={70} col={AMB} />
  </>;
}}</Stage>;

// 22 · «El invierno del cincuenta y seis se nos murieron casi todas las gallinas. No había huevos»: el nido de paja vacío bajo la nieve; las plumas caen
export const Nest: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #2a3440, #0b0e12 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), ghost = eio(tt, 1.6, 2.4) * (1 - eio(tt, 3.6, 4.6));
  return <>
    <div style={pos(960, 700, `scale(${s})`, { width: 760, height: 300 })}>
      {Array.from({ length: 70 }, (_, i) => <div key={i} style={{ position: "absolute", left: 380 + 330 * Math.cos(i * 0.9) * (0.6 + 0.4 * ((i * 7) % 10) / 10) - 70, top: 150 + 90 * Math.sin(i * 0.9) * (0.6 + 0.4 * ((i * 3) % 10) / 10), width: 140, height: 8, borderRadius: 4, background: ["#c9a35a", "#a8823a", "#e0c070"][i % 3], transform: `rotate(${(i * 47) % 180}deg)`, boxShadow: "0 3px 4px rgba(0,0,0,.4)" }} />)}
      <div style={{ position: "absolute", left: 200, top: 90, width: 360, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse,#3a2a14,#6a4a24 70%,transparent 72%)" }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 270 + i * 80, top: 40, width: 90, height: 120, borderRadius: "50% 50% 48% 48% / 60% 60% 40% 40%", border: "4px dashed rgba(255,255,255,.7)", opacity: ghost }} />)}
    </div>
    {Array.from({ length: 6 }, (_, i) => { const f = cl((tt - 0.3 - i * 0.45) / 3.2); return f > 0 && f < 1 ? <div key={i} style={{ position: "absolute", left: 700 + (i * 113) % 500 + 60 * Math.sin(f * 7 + i), top: 120 + 520 * f, width: 26, height: 80, borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", background: "linear-gradient(90deg,#f2ede2,#c9c0ae)", transform: `rotate(${40 * Math.sin(f * 6 + i)}deg)` }} /> : null; })}
    {Array.from({ length: 50 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 211 + 30 * Math.sin(tt * 0.6 + i)) % 1920, top: ((i * 97) % 1080 + tt * (40 + (i % 5) * 12)) % 1080, width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, borderRadius: "50%", background: "#fff", opacity: 0.6 }} />)}
    <Tape txt="1956" x={1450} y={300} s={sp(tt, 1.0)} size={72} rot={4} />
    <Big tt={tt} at={2.6} x={960} y={960} txt="SIN HUEVOS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 23 · «El error es dejar que el agua hierva fuerte: salta dentro del molde. Que apenas tiemble»: el baño María visto desde arriba; el agua apenas tiembla alrededor del molde
export const Ripple: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 820, height: 820, borderRadius: "50%", background: "radial-gradient(circle,#2f4a5a 0 60%,#9aa3aa 61% 66%,#e8edf0 67% 70%,#5b636a 71%)", boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden" })}>
      {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.35 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 410 - (130 + 230 * ph), top: 410 - (130 + 230 * ph), width: 2 * (130 + 230 * ph), height: 2 * (130 + 230 * ph), borderRadius: "50%", border: `3px solid rgba(200,230,255,${0.35 * (1 - ph)})` }} />; })}
      {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.5 + i * 0.37) % 1, a = i * 0.63; return <div key={i} style={{ position: "absolute", left: 410 + 330 * Math.cos(a) - 6, top: 410 + 330 * Math.sin(a) - 6, width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,.6)", opacity: (1 - ph) * 0.8, transform: `scale(${0.5 + ph})` }} />; })}
      <div style={{ position: "absolute", left: 270, top: 270, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#e8edf0,#9aa3aa 70%,#5b636a)", boxShadow: "0 0 0 8px rgba(0,0,0,.25)" }}>
        <div style={{ position: "absolute", left: 30, top: 30, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%,#f6e6b0,#e8c878 70%)" }} /></div>
    </div>
    <Big tt={tt} at={1.4} x={960} y={1000} txt="QUE APENAS TIEMBLE" size={80} col={AMB} />
  </>;
}}</Stage>;

// 24 · «Cuando sobraba calabaza del puchero»: la calabaza se abre en dos y una tajada naranja cae al plato
export const Pumpkin: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), op = eio(tt, 0.7, 1.6), wd = sp(tt, 1.8, 5, 0.5);
  const ribs = (o: number) => Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 100 + o, top: 20, width: 120, height: 420, borderRadius: "50%", background: "linear-gradient(90deg,#c25a10,#f28a2a 45%,#b8500a)", boxShadow: "inset -6px 0 12px rgba(0,0,0,.25)" }} />);
  return <>
    <Table y={820} />
    <div style={pos(1360, 800, `scale(${s})`, { width: 420, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse,#fbfdff,#dfe6ec 60%,#1d4e8f 66%,#e9eef2 70%)" })} />
    <div style={pos(700, 600, `scale(${s})`, { width: 560, height: 460 })}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-90 * op}px) rotate(${-12 * op}deg)`, clipPath: "inset(0 50% 0 0)" }}>{ribs(0)}
        <div style={{ position: "absolute", left: 230, top: 40, width: 50, height: 380, background: "radial-gradient(ellipse,#ffb04a,#f08a1a)", opacity: op }} /></div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${90 * op}px) rotate(${12 * op}deg)`, clipPath: "inset(0 0 0 50%)" }}>{ribs(0)}
        <div style={{ position: "absolute", left: 280, top: 40, width: 50, height: 380, background: "radial-gradient(ellipse,#ffb04a,#f08a1a)", opacity: op }} /></div>
      <div style={{ position: "absolute", left: 260, top: -40, width: 40, height: 70, borderRadius: 10, background: "#4a6a1a", transform: `translateX(${-90 * op}px)` }} />
    </div>
    <div style={pos(700 + 660 * cl(wd), 560 + 220 * cl(wd) - 160 * Math.sin(Math.PI * cl(wd)), `rotate(${-90 + 90 * cl(wd)}deg) scale(${cl(wd * 3)})`, { width: 300, height: 120, borderRadius: "150px 150px 20px 20px / 120px 120px 20px 20px", background: "linear-gradient(180deg,#f6a43a,#f08a1a 60%,#3a6a1a 62%,#2a4a10)", boxShadow: "0 20px 30px rgba(0,0,0,.45)" })} />
    <Big tt={tt} at={2.8} x={960} y={220} txt="LA QUE SOBRABA" size={96} col={AMB} />
  </>;
}}</Stage>;

// 25 · «Escúrrela en un colador antes, si no, las tortitas no se arman»: el colador con el puré naranja gotea en el bol
export const Colander: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lv = eio(tt, 0.6, 5);
  return <>
    <Table y={860} />
    <div style={pos(960, 800, `scale(${s})`, { width: 560, height: 160, borderRadius: "0 0 280px 280px / 0 0 160px 160px", background: "linear-gradient(90deg,#7a3b1f,#b4623a 40%,#5e2c16)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })}>
      <div style={{ position: "absolute", left: 30, top: -10, width: 500, height: 60, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,170,60,${0.2 + 0.5 * lv}), #5a2a10 75%)` }} />
    </div>
    <div style={pos(960, 470, `scale(${s})`, { width: 600, height: 300 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 300, borderRadius: "0 0 300px 300px / 0 0 280px 280px", background: "linear-gradient(90deg,#8a949c,#eef2f5 40%,#9aa3aa 70%,#5b636a)", boxShadow: "0 30px 40px rgba(0,0,0,.5)",
        WebkitMaskImage: "radial-gradient(circle, transparent 0 7px, #000 8px)", WebkitMaskSize: "36px 36px" } as React.CSSProperties} />
      <div style={{ position: "absolute", left: 40, top: -50 + 26 * lv, width: 520, height: 120 - 20 * lv, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 40% 30%,#ffb85a,#f08a1a 60%,#b85a08)" }} />
      {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: d < 0 ? -80 : 600, top: 0, width: 80, height: 22, borderRadius: 11, background: "#8a949c" }} />)}
    </div>
    {Array.from({ length: 9 }, (_, i) => { const ph = ((tt * 0.9 + i * 0.27) % 1); return tt > 0.6 ? <div key={i} style={{ position: "absolute", left: 760 + i * 50, top: 640 + 130 * ph * ph, width: 12, height: 18, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(255,190,110,.85)", opacity: 1 - ph }} /> : null; })}
    <Tape txt="SIN AGUA" x={1440} y={420} s={sp(tt, 1.6)} size={60} />
  </>;
}}</Stage>;

// 26 · «Fuego mínimo y la tapa puesta, que la sartén trabaje como un horno»: la sartén tapada en corte; el calor da vueltas adentro como en un horno
export const Convect: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lid = sp(tt, 0.3, 5, 0.5), go = cl((tt - 1.2) * 1.5);
  return <>
    <div style={pos(960, 860, "", { width: 360, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(80,140,255,.9), transparent 70%)", filter: "blur(4px)" })} />
    <div style={pos(960, 700, `scale(${s})`, { width: 900, height: 360 })}>
      <div style={{ position: "absolute", left: 0, top: 250, width: 900, height: 90, borderRadius: "0 0 60px 60px", background: "linear-gradient(180deg,#2a2a2a,#0d0d0d)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 120, top: 170, width: 660, height: 100, borderRadius: "50% 50% 10% 10% / 80% 80% 10% 10%", background: "radial-gradient(ellipse at 40% 30%,#f2c475,#c98a3a 60%,#8a5a1a)" }}>
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 58, top: 30 + (i % 3) * 14, width: 16, height: 12, borderRadius: "50%", background: "#3a1a0a" }} />)}
      </div>
      <div style={{ position: "absolute", left: 20, top: -100 - 300 * (1 - cl(lid)), width: 860, height: 360, borderRadius: "430px 430px 0 0 / 300px 300px 0 0", border: "16px solid #3a3a3a", borderBottom: "none", boxShadow: "0 -10px 30px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 380, top: -46, width: 80, height: 34, borderRadius: 12, background: "#1a1a1a" }} /></div>
    </div>
    <svg width={900} height={420} style={{ position: "absolute", left: 510, top: 360, overflow: "visible", opacity: go }}>
      {[0, 1].map((i) => <ellipse key={i} cx={450} cy={210} rx={330 - i * 90} ry={150 - i * 50} fill="none" stroke={i ? "#ffb04a" : "#ff7a2f"} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="0.18 0.07" strokeDashoffset={-(tt * 0.35) * (i ? -1 : 1)} opacity={0.8} />)}
    </svg>
    <Big tt={tt} at={2.4} x={960} y={190} txt="COMO UN HORNO" size={100} col={AMB} />
  </>;
}}</Stage>;

// 27 · «A las cuatro prendo el horno. Entra primero el bizcocho… las galletas… los pancitos… las manzanas»: el trencito de madera entra al horno con sus cuatro vagones
export const Train: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), x = -900 + 2300 * eio(tt, 0.3, 8.0);
  const W: [string, string, string][] = [["#e6b25e", "BIZCOCHO", "40 MIN"], ["#c99a50", "GALLETAS", "15 MIN"], ["#f2d9a0", "PANCITOS", "20 MIN"], ["#c0392b", "MANZANAS", "HORNO APAGADO"]];
  return <>
    <div style={pos(960, 760, `scale(${s})`, { width: 2000, height: 30, background: "repeating-linear-gradient(90deg,#6b4a30 0 40px,#3a2414 40px 60px)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" })} />
    <div style={pos(1700, 560, `scale(${s})`, { width: 420, height: 420, borderRadius: "210px 210px 20px 20px", background: "linear-gradient(180deg,#c9c4b8,#8a8478)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 60, top: 140, width: 300, height: 280, borderRadius: "150px 150px 0 0", background: "radial-gradient(ellipse at 50% 100%, #ff9a3a, #3a1a08 75%)" }} />
    </div>
    <div style={{ position: "absolute", left: x, top: 560, width: 1500, height: 200 }}>
      {W.map(([c, n, m], i) => <div key={n} style={{ position: "absolute", left: (3 - i) * 300, top: 40, width: 260, height: 140 }}>
        <div style={{ position: "absolute", left: 0, top: 50, width: 260, height: 90, borderRadius: 10, background: "linear-gradient(180deg,#9a6a3e,#5b3a22)", boxShadow: "0 16px 24px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 50, top: 0, width: 160, height: 70, borderRadius: i === 3 ? "50%" : "40px 40px 8px 8px", background: c }} />
        {[30, 190].map((wx) => <div key={wx} style={{ position: "absolute", left: wx, top: 120, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle,#c9a070 0 25%,#3a2414 30%)", transform: `rotate(${tt * 200}deg)` }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: -70, textAlign: "center", fontSize: 30, fontWeight: 900, color: AMB }}>{m}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 74, textAlign: "center", fontSize: 24, fontWeight: 900, color: "#f7f4ee" }}>{n}</div>
      </div>)}
      <div style={{ position: "absolute", left: 1200, top: 20, width: 240, height: 160 }}>
        <div style={{ position: "absolute", left: 0, top: 60, width: 240, height: 100, borderRadius: "10px 50px 10px 10px", background: "linear-gradient(180deg,#b33a2c,#6a1a10)", boxShadow: "0 16px 24px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 150, top: 0, width: 50, height: 70, borderRadius: 6, background: "#2b2018" }} />
      </div>
    </div>
    <Steam tt={tt} x={x + 1375} y={560} w={120} h={160} />
    <Big tt={tt} at={1.0} x={760} y={220} txt="UN SOLO ENCENDIDO" size={70} col={AMB} />
  </>;
}}</Stage>;

// 28 · «Pan del día anterior en rebanadas finitas»: el cuchillo pasa y las rebanadas caen una sobre otra como fichas; cae el azúcar con canela
export const Domino: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), dust = cl((tt - 3.4) * 1.5);
  return <>
    <Table y={800} />
    <div style={pos(500, 640, `scale(${s})`, { width: 420, height: 260, borderRadius: "130px 130px 30px 30px", background: "linear-gradient(180deg,#b8742a,#8a4a14 40%,#f0d8a8 42%,#e8cc90)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })} />
    {Array.from({ length: 8 }, (_, i) => { const a = 0.6 + i * 0.32, f = eio(tt, a, a + 0.5); return f > 0 ? <div key={i} style={{ position: "absolute", left: 760 + i * 120 + 0, top: 520, width: 26, height: 250, transformOrigin: "50% 100%", transform: `rotate(${62 * f}deg)`, borderRadius: "14px 14px 4px 4px", background: "linear-gradient(90deg,#8a4a14,#f2dcae 20%,#e8cc90 80%,#8a4a14)", boxShadow: "0 10px 16px rgba(0,0,0,.4)" }} /> : null; })}
    <div style={pos(720 + 120 * Math.min(7, Math.floor(cl((tt - 0.4) / 2.6) * 8)), 470, "rotate(-8deg)", { width: 30, height: 340, background: "linear-gradient(90deg,#9aa3aa,#f4f6f8,#7a848c)", clipPath: "polygon(0 0,100% 0,100% 100%,0 80%)", opacity: tt < 3.3 ? 1 : 0 })} />
    {Array.from({ length: 50 }, (_, i) => { const f = cl(dust - (i % 10) * 0.05); return f > 0 ? <div key={i} style={{ position: "absolute", left: 800 + (i * 37) % 900, top: 260 + 470 * f, width: 7, height: 7, borderRadius: 2, background: i % 3 ? "#f6ecd6" : "#8a4a1a", opacity: 0.9 }} /> : null; })}
    <Big tt={tt} at={2.2} x={1180} y={230} txt="FINITAS" size={110} col={AMB} />
  </>;
}}</Stage>;

// 29 · «Primero el caramelo: tres cucharadas de azúcar en una sartén hasta que se dore»: el azúcar blanco se derrite en un charco ámbar que brilla
export const Caramel: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), m = eio(tt, 0.6, 4.2), r = 120 + 200 * m;
  const col = `rgb(${Math.round(250 - 70 * m)},${Math.round(245 - 135 * m)},${Math.round(235 - 205 * m)})`;
  return <>
    <div style={pos(960, 600, `scale(${s})`, { width: 820, height: 820, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2a 0 64%,#3a3a3a 66%,#111 70%)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" })}>
      <div style={{ position: "absolute", left: 410 - r, top: 410 - r, width: 2 * r, height: 2 * r, borderRadius: "48% 52% 50% 50%", background: `radial-gradient(circle at 40% 35%, #fff8, ${col} 30%, ${col})`, boxShadow: `0 0 ${60 * m}px rgba(220,140,40,.5)` }} />
      {Array.from({ length: 80 }, (_, i) => { const a = i * 2.39, d = 130 * Math.sqrt((i + 1) / 80); return <div key={i} style={{ position: "absolute", left: 410 + d * Math.cos(a) - 6, top: 410 + d * Math.sin(a) - 6, width: 12, height: 12, borderRadius: 2, background: "#fff", opacity: 1 - eio(tt, 0.8 + (i % 10) * 0.12, 2.6 + (i % 10) * 0.12), transform: `rotate(${i * 30}deg)` }} />; })}
      <div style={{ position: "absolute", left: 300, top: 300, width: 120, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.35)", filter: "blur(8px)", opacity: m }} />
      <div style={{ position: "absolute", left: 820, top: 380, width: 500, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#2a2a2a,#0d0d0d)" }} />
    </div>
    <Big tt={tt} at={1.4} x={960} y={110} txt="PRIMERO EL CARAMELO" size={74} col={AMB} />
  </>;
}}</Stage>;

// 30 · «Tan cremoso que se movía como una ola en el plato»: el plato se inclina y el arroz con leche se mueve como una ola
export const Wave: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), tilt = 6 * Math.sin(Math.max(0, tt - 0.6) * 1.6) * Math.exp(-0.25 * Math.max(0, tt - 0.6));
  const pts = Array.from({ length: 41 }, (_, i) => { const x = i * 20; return `${x},${70 + 22 * Math.sin(i * 0.35 - tt * 3.2) * Math.exp(-0.18 * Math.max(0, tt - 0.6)) + tilt * (i - 20) * 0.6}`; }).join(" ");
  return <>
    <Table y={820} />
    <Shadow x={960} y={820} w={900} s={s} />
    <div style={pos(960, 640, `scale(${s}) rotate(${tilt}deg)`, { width: 900, height: 300 })}>
      <div style={{ position: "absolute", left: 0, top: 80, width: 900, height: 220, borderRadius: "0 0 450px 450px / 0 0 200px 200px", background: "linear-gradient(90deg,#c9d2da,#fbfdff 40%,#b9c3cc)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
      <svg width={820} height={200} style={{ position: "absolute", left: 40, top: 30 }}>
        <polygon points={`0,200 ${pts} 800,200`} fill="#f6ecd4" />
        <polyline points={pts} fill="none" stroke="#fff" strokeWidth={6} opacity={0.6} />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={30 + (i * 53) % 760} cy={110 + (i * 29) % 60} r={5} fill="#a0602a" opacity={0.7} />)}
      </svg>
      <div style={{ position: "absolute", left: 520, top: 70, width: 160, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#f6e04a,#d8b820)", transform: `rotate(${-10 + 6 * Math.sin(tt * 2)}deg)` }} />
    </div>
    <Big tt={tt} at={2.0} x={960} y={230} txt="COMO UNA OLA" size={110} col={AMB} />
  </>;
}}</Stage>;
