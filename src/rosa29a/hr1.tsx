// rosa29a · componentes únicos 1-12 (cada uno = la frase de ese segundo, hecho objeto). Todo en código.
import React from "react";
import { Stage, H, phys, cl, eio, eIn, AMB, RED, DIM } from "./hkit";
import { Steam, Tape, Big, Cup, Coin, Bowl, Table, Shadow, HAND } from "./rkit";

export type P = { t: number; h: H };
export const sp = (tt: number, a: number, w = 6, z = 0.5) => phys(tt, a, w, z);
export const pos = (x: number, y: number, tr = "", ex: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) ${tr}`, ...ex });

// 1 · «Son las siete y diez… pones el agua para el café»: el reloj de la cocina gira hasta las 7:10 y la taza humea
export const Clock: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sw = eio(tt, 0.2, 2.6);
  const mA = 60 + 360 * (1 - sw), hA = 215 - 30 * (1 - sw);
  const c = sp(tt, 1.2, 5, 0.5);
  return <>
    <Table y={790} />
    <div style={pos(700, 450, `scale(${s})`, { width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf6ea, #e9dfc8 68%, #b9a785)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 0 20px #6b4a30, inset 0 0 0 27px #3a2414" })}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 266, top: 40, width: 8, height: i % 3 ? 22 : 40, borderRadius: 4, background: "#3a2414", transformOrigin: "4px 230px", transform: `rotate(${i * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 262, top: 270 - 140, width: 16, height: 140, borderRadius: 8, background: "#2b2018", transformOrigin: "50% 100%", transform: `rotate(${hA}deg)` }} />
      <div style={{ position: "absolute", left: 265, top: 270 - 215, width: 10, height: 215, borderRadius: 5, background: "#2b2018", transformOrigin: "50% 100%", transform: `rotate(${mA}deg)` }} />
      <div style={{ position: "absolute", left: 270 - 3, top: 270 - 200, width: 6, height: 235, background: RED, transformOrigin: "50% 200px", transform: `rotate(${tt * 36}deg)` }} />
      <div style={{ position: "absolute", left: 252, top: 252, width: 36, height: 36, borderRadius: "50%", background: "#b33a2c" }} />
    </div>
    <Shadow x={1300} y={790} w={260} s={c} />
    <div style={pos(1300, 720 - (1 - cl(c)) * 260, `scale(${0.6 + 0.4 * c})`)}><Cup w={190} glow={0.4 * cl(c)} /></div>
    <Steam tt={tt} x={1290} y={640} w={130} h={200} o={cl(c)} />
    <Big tt={tt} at={1.9} x={1300} y={300} txt="7:10" size={130} col={AMB} />
    <Big tt={tt} at={2.3} x={1300} y={410} txt="DE LA MAÑANA" size={52} />
  </>;
}}</Stage>;

// 2 · «La primera mañana sin mi Antonio, el tres de marzo de 2019»: el taco de almanaque arranca hojas hasta el 3 de marzo; café negro y pan seco
export const Calendar: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const pages: [string, string][] = [["FEBRERO", "27"], ["FEBRERO", "28"], ["MARZO", "1"], ["MARZO", "2"]];
  const Page: React.FC<{ m: string; d: string; style?: React.CSSProperties }> = ({ m, d, style }) => <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#fbf7ee,#ece2cc)", borderRadius: 8, overflow: "hidden", ...style }}>
    <div style={{ height: 96, background: "#b33a2c", color: "#fff", fontWeight: 900, fontSize: 44, letterSpacing: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>{m}</div>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 250, color: "#2b2018", lineHeight: 1.25 }}>{d}</div>
    <div style={{ textAlign: "center", fontWeight: 800, fontSize: 34, color: "#7a6a52", letterSpacing: 6 }}>2019</div>
  </div>;
  const c = sp(tt, 2.4, 5, 0.5);
  return <>
    <Table y={820} />
    <div style={pos(640, 470, `scale(${s}) rotate(-2deg)`, { width: 400, height: 520, perspective: 1400 })}>
      <div style={{ position: "absolute", inset: 0, boxShadow: "0 50px 90px rgba(0,0,0,.6)", borderRadius: 8 }} />
      <Page m="MARZO" d="3" />
      {pages.map(([m, d], i) => {
        const k = eIn(tt, 0.35 + (3 - i) * 0.32, 0.35 + (3 - i) * 0.32 + 0.55);
        if (k >= 1) return null;
        return <Page key={i} m={m} d={d} style={{ transformOrigin: "50% 0", transform: `rotateX(${k * 110}deg) translateY(${k * 260}px) rotate(${k * (i % 2 ? 14 : -12)}deg)`, opacity: 1 - k * 0.6, boxShadow: "0 6px 12px rgba(0,0,0,.25)" }} />;
      })}
      <div style={{ position: "absolute", left: 40, right: 40, top: -14, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#8a8f96,#4a4e54)" }} />
    </div>
    <Shadow x={1290} y={800} w={240} s={c} />
    <div style={pos(1240, 735 - (1 - cl(c)) * 200)}><Cup w={170} /></div>
    <div style={pos(1480, 770 - (1 - cl(sp(tt, 2.7, 5, 0.5))) * 200, "rotate(-8deg)", { width: 170, height: 70, borderRadius: "34px 40px 20px 26px", background: "linear-gradient(180deg,#d9b37a,#a7763d)", boxShadow: "0 18px 30px rgba(0,0,0,.5), inset 0 -10px 0 rgba(0,0,0,.15)", opacity: cl(sp(tt, 2.7) * 3) })} />
    <Tape txt="sin mi Antonio" x={1330} y={360} s={cl(sp(tt, 1.6, 5, 0.5))} size={70} rot={-4} />
  </>;
}}</Stage>;

// 3 · «Ella nos daba el desayuno a siete hermanos»: siete tazas de esmalte caen de a una sobre la mesa larga
export const SevenCups: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <Table y={700} />
  {Array.from({ length: 7 }, (_, i) => {
    const s = sp(tt, 0.35 + i * 0.24, 6, 0.45), x = 330 + i * 210, w = 96 + (i % 3) * 14;
    return <React.Fragment key={i}>
      <Shadow x={x} y={760} w={150} s={s} />
      <div style={pos(x, 700 - (1 - cl(s)) * 380, `rotate(${(1 - cl(s)) * (i % 2 ? 18 : -18)}deg)`, { opacity: cl(s * 3) })}><Cup w={w} /></div>
      <Big tt={tt} at={0.55 + i * 0.24} x={x - 10} y={860} txt={String(i + 1)} size={48} col={DIM} hand />
    </React.Fragment>;
  })}
  <Big tt={tt} at={2.4} x={960} y={330} txt="SIETE HERMANOS" size={96} />
</>}</Stage>;

// 4 · «Veinticinco. Los desayunos que el mundo se olvidó… presta atención a la catorce… la ocho»: abanico de 25 fichas de receta escritas a mano
export const Deck: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const hi = eio(tt, 3.6, 4.4);
  return <>
    {Array.from({ length: 25 }, (_, i) => {
      const s = cl(sp(tt, 0.2 + i * 0.055, 6, 0.6)), ang = (-66 + i * 5.5) * s, n = 25 - i;
      const star = n === 14 || n === 8;
      const lift = star ? hi * 120 : 0;
      return <div key={i} style={{ position: "absolute", left: 960 - 85, top: 1060 - 560, width: 170, height: 240, transformOrigin: "50% 560px",
        transform: `rotate(${ang}deg) translateY(${-lift}px) scale(${star ? 1 + 0.18 * hi : 1 - 0.05 * hi})`, borderRadius: 10, background: "linear-gradient(170deg,#fbf6e8,#e9dcbf)",
        boxShadow: star && hi > 0 ? `0 0 ${50 * hi}px ${AMB}, 0 20px 40px rgba(0,0,0,.5)` : "0 14px 30px rgba(0,0,0,.45)", opacity: star ? 1 : 1 - 0.45 * hi }}>
        <div style={{ position: "absolute", top: 18, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: star ? "#b33a2c" : "#3a2414" }}>{n}</div>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 22, right: 22 + (k * 17) % 40, top: 128 + k * 24, height: 4, borderRadius: 2, background: "rgba(58,36,20,.35)" }} />)}
      </div>;
    })}
    <Big tt={tt} at={1.8} x={960} y={170} txt="25 DESAYUNOS" size={100} />
    <Big tt={tt} at={2.3} x={960} y={270} txt="QUE EL MUNDO OLVIDÓ" size={46} col={AMB} />
  </>;
}}</Stage>;

// 5 · «Al final de este video te voy a dar la regla de las tres cosas»: la lata de galletas de la abuela con candado; se entreabre y sale luz
export const Lockbox: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.55), open = eio(tt, 3.0, 4.2) * 0.22, shake = tt > 2.2 && tt < 2.9 ? Math.sin(tt * 40) * 3 : 0;
  return <>
    <Table y={760} />
    <Shadow x={960} y={790} w={640} s={s} />
    <div style={pos(960, 600, `scale(${0.4 + 0.6 * s}) rotate(${shake}deg)`, { width: 580, height: 330, perspective: 1200 })}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 580, height: 260, borderRadius: 18, background: "linear-gradient(90deg,#1d4e8f,#2f6fb8 40%,#245a9e 70%,#163a6b)", boxShadow: "inset 0 0 0 8px rgba(255,255,255,.12)" }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 40, bottom: 40, borderRadius: 12, border: "4px solid rgba(255,214,140,.55)" }} />
        {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 80 + k * 100, top: 100, width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,214,140,.5)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 90, height: 40, background: `radial-gradient(ellipse at 50% 0, rgba(255,214,140,${open * 4}), transparent 70%)`, filter: "blur(6px)" }} />
      <div style={{ position: "absolute", left: -10, top: 30, width: 600, height: 80, borderRadius: 18, transformOrigin: "50% 100%", transform: `rotateX(${open * 120}deg)`, background: "linear-gradient(180deg,#3c7cc6,#1d4e8f)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: 250, top: 150, width: 80, height: 90, borderRadius: 12, background: "linear-gradient(90deg,#b8902c,#f1d27a,#a87e22)", boxShadow: "0 10px 18px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: 14, top: -46, width: 52, height: 60, borderRadius: "26px 26px 0 0", border: "10px solid #9aa0a6", borderBottom: "none" }} />
        <div style={{ position: "absolute", left: 34, top: 30, width: 12, height: 26, borderRadius: 6, background: "#3a2a10" }} />
      </div>
    </div>
    {open > 0.01 && <div style={pos(960, 440, "", { width: 900, height: 600, background: `conic-gradient(from 160deg at 50% 100%, transparent, rgba(255,214,140,${open * 2}) 10deg, transparent 20deg, rgba(255,214,140,${open * 1.6}) 30deg, transparent 40deg)`, filter: "blur(10px)", mixBlendMode: "screen" })} />}
    <Big tt={tt} at={1.0} x={960} y={190} txt="AL FINAL DEL VIDEO" size={84} />
    <Tape txt="la regla de las 3 cosas" x={960} y={930} s={cl(sp(tt, 2.0, 5, 0.5))} size={54} />
  </>;
}}</Stage>;

// 6 · «¿Cuánto cuesta? Menos de diez centavos la taza»: una moneda de 10¢ cae girando y se acuesta junto a la taza
export const Coins: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eIn(tt, 0.4, 1.3), land = sp(tt, 1.3, 7, 0.35);
  const y = tt < 1.3 ? -200 + 860 * f : 660 - 40 * Math.abs(Math.sin((tt - 1.3) * 9)) * Math.exp(-(tt - 1.3) * 4);
  const rx = tt < 1.3 ? tt * 900 : 62 + 18 * Math.exp(-(tt - 1.3) * 3) * Math.cos((tt - 1.3) * 14);
  return <>
    <Table y={700} />
    <div style={pos(700, 600)}><Cup w={220} /></div>
    <Steam tt={tt} x={690} y={500} w={150} h={220} />
    <Shadow x={1180} y={700} w={220} s={land} />
    <div style={pos(1180, y, `perspective(800px) rotateX(${rx}deg)`)}><Coin d={200} v="10¢" /></div>
    <Big tt={tt} at={1.5} x={1180} y={300} txt="MENOS DE 10¢" size={96} col={AMB} />
    <Tape txt="la taza" x={1180} y={410} s={cl(sp(tt, 1.9, 5, 0.5))} size={50} />
  </>;
}}</Stage>;

// 7 · «Una rebanada de pan de dos dedos de grosor»: del pan sale una rebanada y dos dedos miden el grosor
export const Ruler: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sl = eio(tt, 0.9, 1.9), fg = sp(tt, 2.1, 5, 0.5);
  return <>
    <Table y={720} />
    <Shadow x={800} y={760} w={760} s={s} />
    <div style={pos(760 - 60 * sl, 620, `scale(${0.5 + 0.5 * s})`, { width: 660, height: 280, borderRadius: "130px 130px 30px 30px", background: "linear-gradient(180deg,#c88a45,#9a5f28 60%,#7a4718)", boxShadow: "inset 0 18px 30px rgba(255,220,160,.35)" })}>
      {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 90 + k * 110, top: 30, width: 18, height: 90, borderRadius: 9, background: "rgba(255,230,180,.45)", transform: "rotate(28deg)" }} />)}
    </div>
    <div style={pos(1180 + 180 * sl, 620, `rotate(${-6 * sl}deg)`, { width: 90, height: 280, borderRadius: "45px 45px 12px 12px", background: "radial-gradient(ellipse at 50% 45%, #f6e2b5, #e6c98d 70%, #a7703a 76%)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", opacity: cl(sl * 4) })} />
    {[0, 1].map((k) => <div key={k} style={pos(1360 + 300 * (1 - cl(fg)), 545 + k * 52, "", { width: 300, height: 48, borderRadius: "24px 30px 30px 24px", background: "linear-gradient(180deg,#f0c6a2,#d59d76)", boxShadow: "0 8px 14px rgba(0,0,0,.35), inset -40px 0 0 rgba(255,235,220,.25)", opacity: cl(fg * 2) })} />)}
    <Tape txt="dos dedos" x={1450} y={410} s={cl(sp(tt, 2.5, 5, 0.5))} size={58} />
    <Big tt={tt} at={1.0} x={760} y={250} txt="UNA REBANADA" size={92} />
  </>;
}}</Stage>;

// 8 · «Si no tienes comal, una sartén… la das vuelta, otros treinta»: la tortilla salta y da vuelta dos veces en la sartén
export const Flip: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const f1 = eio(tt, 1.6, 2.3), f2 = eio(tt, 3.6, 4.3), fp = Math.max(f1 * (1 - f2), f2);
  const up = Math.sin(Math.PI * f1) * 300 + Math.sin(Math.PI * f2) * 300, rot = 180 * f1 + 180 * f2;
  const puff = eio(tt, 4.4, 5.6);
  return <>
    <Table y={700} />
    <div style={pos(900, 680, `scale(${0.5 + 0.5 * s})`, { width: 720, height: 300 })}>
      <div style={{ position: "absolute", left: 640, top: 120, width: 420, height: 56, borderRadius: 28, background: "linear-gradient(180deg,#3a3a3a,#111)", transform: "rotate(-6deg)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 720, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%, #2a2a2a, #121212 70%, #3a3a3a 72%, #0a0a0a)", boxShadow: "0 40px 70px rgba(0,0,0,.7)" }} />
    </div>
    <div style={pos(900, 660 - up, `perspective(900px) rotateX(${60 + rot}deg) scale(${1 + 0.08 * puff})`, { width: 420, height: 420, borderRadius: "50%",
      background: `radial-gradient(circle at 30% 40%, #8a5a2a 0 4%, transparent 5%), radial-gradient(circle at 62% 58%, #8a5a2a 0 3%, transparent 4%), radial-gradient(circle at 48% 30%, #9a6a3a 0 3%, transparent 4%), radial-gradient(circle, ${fp > 0.5 ? "#e8cf98" : "#f1dfb4"}, #d9b878)`,
      boxShadow: "0 10px 20px rgba(0,0,0,.4)" })} />
    <Steam tt={tt} x={900} y={560} w={200} h={220} o={0.7} />
    <Tape txt="30 segundos" x={1450} y={560} s={cl(sp(tt, 1.9, 5, 0.5))} size={54} rot={3} />
    <Tape txt="y otros 30" x={1450} y={660} s={cl(sp(tt, 3.9, 5, 0.5))} size={54} rot={-2} />
    <Big tt={tt} at={0.6} x={900} y={220} txt="SIN COMAL: LA SARTÉN" size={84} />
  </>;
}}</Stage>;

// 9 · «Cuando hierve, bajas el huevo con una cuchara… tres minutos y medio»: el huevo baja a la olla y el reloj de cocina marca 3½
export const EggDial: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), dn = eio(tt, 0.4, 1.8), d = sp(tt, 2.0, 5, 0.5), arc = 210 * eio(tt, 2.3, 4.8);
  return <>
    <Table y={760} />
    <div style={pos(720, 640, `scale(${0.5 + 0.5 * s})`, { width: 520, height: 340 })}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 520, height: 280, borderRadius: "0 0 60px 60px", background: "linear-gradient(90deg,#6a6f75,#c9cfd5 35%,#8a9096 70%,#4a4e54)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, top: 30, width: 520, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse, #9cc4d8, #5f8aa0 70%, #d6dbe0 73%)", overflow: "hidden" }}>
        {Array.from({ length: 9 }, (_, i) => { const ph = (tt * 1.6 + i * 0.37) % 1; return <div key={i} style={{ position: "absolute", left: 40 + (i * 53) % 440, top: 50 - ph * 40, width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,.7)", opacity: 1 - ph }} />; })}
      </div>
    </div>
    <div style={pos(720, 180 + 470 * dn, "", { width: 120, height: 150, borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%", background: "radial-gradient(circle at 35% 30%, #fffaf0, #efe2c8 60%, #cdb894)", boxShadow: "0 16px 26px rgba(0,0,0,.45)", clipPath: `inset(0 0 ${dn > 0.85 ? (dn - 0.85) * 6 * 100 : 0}% 0)` })} />
    <div style={pos(720, 120 + 470 * dn, "rotate(-12deg)", { width: 30, height: 260, borderRadius: 15, background: "linear-gradient(90deg,#8a9096,#e8ecef,#8a9096)", opacity: 1 - eIn(tt, 1.8, 2.3) })} />
    <div style={pos(1360, 520, `scale(${cl(d) * 0.4 + 0.6 * d})`, { width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,#fff 0 58%, #b33a2c 59%)", boxShadow: "0 40px 70px rgba(0,0,0,.55)", opacity: cl(d * 3) })}>
      <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: `conic-gradient(${AMB} 0deg ${arc}deg, rgba(0,0,0,.06) ${arc}deg)` }} />
      <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: "#fbf6ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 110, color: "#2b2018" }}>3½</div>
    </div>
    <Big tt={tt} at={2.6} x={1360} y={860} txt="MINUTOS" size={60} />
  </>;
}}</Stage>;

// 10 · «Un kilo de avena te da veinticinco desayunos»: la bolsa de un kilo se vacía en 25 platitos que se ordenan
export const Bowls: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const b = sp(tt, 0.05, 4.5, 0.6), tilt = eio(tt, 0.8, 1.4) * 38;
  return <>
    <Table y={780} />
    <div style={pos(420, 560, `rotate(${-tilt}deg) scale(${0.5 + 0.5 * b})`, { width: 280, height: 380, borderRadius: "14px 14px 24px 24px", background: "linear-gradient(90deg,#c9b48a,#efe0bd 40%,#d8c49b 70%,#a8956d)", boxShadow: "0 40px 70px rgba(0,0,0,.55)" })}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 50, background: "repeating-linear-gradient(90deg,#b8a274 0 10px,#d8c49b 10px 20px)", borderRadius: "14px 14px 0 0" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 120, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse, #e9d9a8, #c7ad6c)" }} />
    </div>
    <Tape txt="1 kilo" x={420} y={330} s={cl(sp(tt, 0.4, 5, 0.5))} size={60} />
    {Array.from({ length: 25 }, (_, i) => {
      const r = Math.floor(i / 5), c = i % 5, s = sp(tt, 1.2 + i * 0.07, 7, 0.5);
      return <div key={i} style={pos(880 + c * 190 - r * 26, 290 + r * 120, `scale(${0.4 + 0.6 * s}) translateY(${(1 - cl(s)) * -140}px)`, { opacity: cl(s * 3) })}><Bowl w={130} /></div>;
    })}
    <Big tt={tt} at={3.2} x={1240} y={930} txt="25 DESAYUNOS" size={80} col={AMB} />
  </>;
}}</Stage>;

// 11 · «Mi tía Carmen… llegaba caminando desde el otro lado del río»: mapa de papel; el camino punteado cruza el río por el puente
export const River: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #2a231a, #0b0907 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4, 0.65), wk = eio(tt, 0.9, 5.4);
  const path = "M 1480 760 C 1300 720, 1220 560, 1060 540 S 900 470, 860 470 S 640 420, 470 300";
  return <div style={pos(960, 540, `perspective(1600px) rotateX(${38 - 6 * s}deg) scale(${0.7 + 0.3 * s})`, { width: 1500, height: 860, borderRadius: 16, background: "linear-gradient(160deg,#efe4c8,#dccba2)", boxShadow: "0 60px 120px rgba(0,0,0,.65)" })}>
    <svg width={1500} height={860} style={{ position: "absolute", left: 0, top: 0 }} viewBox="0 0 1500 860">
      <path d="M 820 -20 C 760 200, 940 340, 860 470 S 760 700, 880 900" fill="none" stroke="#6f9fc0" strokeWidth={90} strokeLinecap="round" opacity={0.85} />
      <path d="M 820 -20 C 760 200, 940 340, 860 470 S 760 700, 880 900" fill="none" stroke="#a8cbe0" strokeWidth={20} strokeDasharray="40 60" strokeDashoffset={-tt * 60} opacity={0.7} />
      <rect x={790} y={445} width={140} height={50} rx={6} fill="#7a4a24" transform="rotate(-8 860 470)" />
      <path d={path} transform="translate(-260 0)" fill="none" stroke="#7a2a1c" strokeWidth={9} strokeDasharray="4 22" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${wk} 1` }} />
      <path d={path} transform="translate(-260 0)" fill="none" stroke="#efe4c8" strokeWidth={12} strokeDasharray="0.012 0.012" pathLength={1} />
    </svg>
    {[[1220, 760], [210, 300]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 50, top: y - 70, width: 100, height: 80 }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 100, height: 60, background: "#b33a2c", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: -10, top: -10, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "50px solid #5a2a1a" }} />
    </div>)}
    <Tape txt="tía Carmen" x={1220} y={640} s={cl(sp(tt, 0.6, 5, 0.5))} size={56} />
    <Tape txt="casa de mamá" x={210} y={180} s={cl(sp(tt, 4.6, 5, 0.5))} size={50} rot={3} />
    <div style={{ position: "absolute", left: 880, top: 60, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#2f5f80", transform: "rotate(-70deg)", opacity: cl(s) }}>el río</div>
  </div>;
}}</Stage>;

// 12 · «Dejas reposar diez minutos… la harina descansa»: el paño a rayas cae sobre el bol de masa y respira
export const Rest: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cloth = sp(tt, 1.0, 4.5, 0.55), br = Math.sin(tt * 1.4) * 4 * cl(cloth);
  return <>
    <Table y={760} />
    <Shadow x={960} y={800} w={600} s={s} />
    <div style={pos(960, 680, `scale(${0.5 + 0.5 * s})`)}><Bowl w={560} col="#efe3c4" top={<div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, #fff6 0 3%, transparent 4%), radial-gradient(circle at 60% 40%, #fff5 0 2%, transparent 3%)" }} />} /></div>
    <div style={pos(960, 560 - (1 - cl(cloth)) * 600 + br, `perspective(1000px) rotateX(${(1 - cl(cloth)) * 50 + 8}deg) skewX(${(1 - cl(cloth)) * 10}deg)`, { width: 700, height: 300, borderRadius: "40px 40px 120px 120px / 40px 40px 60px 60px",
      background: "repeating-linear-gradient(90deg,#f4efe6 0 60px,#c43d32 60px 74px,#f4efe6 74px 88px,#c43d32 88px 96px)", boxShadow: "0 30px 50px rgba(0,0,0,.45), inset 0 -30px 40px rgba(0,0,0,.18)", opacity: cl(cloth * 3) })} />
    <Big tt={tt} at={2.0} x={960} y={230} txt="QUE DESCANSE" size={100} />
    <Tape txt="diez minutos" x={960} y={340} s={cl(sp(tt, 2.5, 5, 0.5))} size={58} />
  </>;
}}</Stage>;
