// rosa29d · componentes únicos 1-10 (cada uno = la frase de ese segundo, hecho objeto). Todo en código, ninguna familia de rosa29a, b ni c.
import React from "react";
import { Stage, H, phys, cl, eio, AMB } from "./hkit";
import { Big, Tape, Table, Shadow } from "./rkit";

export type P = { t: number; h: H };
export const sp = (tt: number, a: number, w = 6, z = 0.5) => phys(tt, a, w, z);
export const pos = (x: number, y: number, tr = "", ex: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) ${tr}`, ...ex });
export const NEWS = "repeating-linear-gradient(180deg, rgba(60,50,40,.45) 0 3px, transparent 3px 11px), linear-gradient(180deg,#ece4d2,#d9cfb8)";
export const TIN = "linear-gradient(180deg,#c9d0d6,#8e979f 45%,#b8c0c7 55%,#6f777e)";
export const SCHOOL = "linear-gradient(180deg,#b9d4e8,#e8eef0 55%,#c9b48a 56%,#a8915e)";

// 1 · «Abres tu lonchera de lata en el patio de la escuela, y adentro está el pan con grasa y sal, envuelto en papel de periódico»: la lonchera abre la tapa con bisagra y el diario se despliega mostrando el pan
export const Lunchbox: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg={SCHOOL}>{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), lid = eio(tt, 0.5, 1.6), unf = eio(tt, 1.6, 3.0);
  return <>
    <Shadow x={960} y={860} w={820} s={s} />
    <div style={pos(960, 700, `scale(${s})`, { width: 760, height: 300 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 300, borderRadius: 26, background: TIN, boxShadow: "0 30px 50px rgba(0,0,0,.45), inset 0 0 0 6px rgba(0,0,0,.12)" }} />
      <div style={{ position: "absolute", left: 300, top: -70, width: 160, height: 80, borderRadius: "80px 80px 0 0", border: "14px solid #6f777e", borderBottom: "none" }} />
      <div style={{ position: "absolute", left: 80, top: 30, width: 600, height: 240, borderRadius: 14, background: "#3a352e", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 300 - 260 * (0.4 + 0.6 * unf), top: 40, width: 520 * (0.4 + 0.6 * unf), height: 170, background: NEWS, transform: `rotate(${-4 + 4 * unf}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.35)" }} />
        <div style={{ position: "absolute", left: 160, top: 70, width: 280, height: 120, borderRadius: "40px 40px 18px 18px", background: "linear-gradient(180deg,#e8c48a,#c08a4c)", opacity: unf, boxShadow: "inset 0 -10px 0 #a8743e" }}>
          <div style={{ position: "absolute", left: 20, top: 14, width: 240, height: 30, borderRadius: 14, background: "rgba(250,246,236,.9)" }} />
          {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i * 37) % 220, top: 18 + (i * 13) % 22, width: 6, height: 6, background: "#fff", transform: "rotate(45deg)" }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: -6, width: 760, height: 300, borderRadius: 26, background: TIN, transformOrigin: "50% 0", transform: `perspective(1400px) rotateX(${-110 * lid}deg)`, boxShadow: "inset 0 0 0 6px rgba(0,0,0,.12)", backfaceVisibility: "hidden" }} />
    </div>
    <Big tt={tt} at={2.6} x={960} y={190} txt="PAN CON GRASA Y SAL" size={86} col="#6b2a14" />
  </>;
}}</Stage>;

// 2 · «Le dije a mi madre que no tenía hambre. Era mentira»: el plato con el caldo se desliza despacio por la mesa, lejos de la silla; la sombra de la niña queda quieta
export const PlateAway: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#3a2a1c,#1a120c)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), mv = eio(tt, 0.5, 3.4);
  return <>
    <div style={pos(960, 720, "", { width: 2200, height: 560, background: "linear-gradient(180deg,#8a5a34,#5a3a1e)", transform: "translate(-50%,-50%) perspective(900px) rotateX(48deg)" })} />
    <div style={pos(1620, 470, `scale(${s})`, { width: 300, height: 380, borderRadius: "140px 140px 20px 20px", background: "linear-gradient(180deg,#2a1c12,#140c06)", opacity: 0.85 })} />
    <div style={pos(1360 - 760 * mv, 720 - 40 * mv, `scale(${s * (1 - 0.25 * mv)})`, { width: 300, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse,#f6f1e6 0 52%,#d8cfbe 54%,#efe8da 70%)", boxShadow: "0 20px 26px rgba(0,0,0,.5)" })}>
      <div style={{ position: "absolute", left: 70, top: 32, width: 160, height: 76, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 40%,#e0b060,#b07a30)" }} />
    </div>
    <div style={pos(1360 - 760 * mv + 160, 690, "", { width: 40, height: 6, opacity: mv > 0.05 && mv < 0.95 ? 0.5 : 0, background: "linear-gradient(90deg,transparent,#d8b88a)" })} />
    <Big tt={tt} at={2.2} x={960} y={190} txt="«NO TENGO HAMBRE»" size={92} col={AMB} hand />
  </>;
}}</Stage>;

// 3 · «Presta atención a la número once… a la número seis… y a la número uno»: tres latas en un estante; un foco de luz se enciende sobre cada una, la del uno queda iluminada
export const SpotCans: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#141018,#0a080c)">{(tt) => {
  const C: [number, string, number][] = [[11, "LA DEL MÉDICO", 0.6], [6, "LA CARÍSIMA", 2.2], [1, "LA VERGÜENZA", 3.8]];
  return <>
    <div style={pos(960, 760, "", { width: 1600, height: 34, background: "linear-gradient(180deg,#8a5a34,#4a2a14)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" })} />
    {C.map(([n, lab, a], i) => { const on = eio(tt, a, a + 0.35) * (i < 2 ? 1 - 0.65 * eio(tt, a + 1.4, a + 1.9) : 1), x = 520 + i * 440, s = sp(tt, 0.1 + i * 0.12, 5.5, 0.5);
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: x - 260, top: 0, width: 520, height: 760, background: `linear-gradient(180deg, rgba(255,230,170,${0.32 * on}), rgba(255,230,170,${0.05 * on}))`, clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)" }} />
        <div style={pos(x, 600, `scale(${s})`, { width: 220, height: 290, borderRadius: 16, background: TIN, filter: `brightness(${0.35 + 0.75 * on})`, boxShadow: "0 18px 26px rgba(0,0,0,.5)" })}>
          <div style={{ position: "absolute", left: 0, top: 70, width: 220, height: 150, background: i === 2 ? "#b33a2c" : i === 1 ? "#2c5a8a" : "#3a7a4a" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", fontFamily: "'Caveat',cursive", fontWeight: 700, fontSize: 110, color: "#fbf4e2", lineHeight: 1 }}>{n}</div>
        </div>
        <Tape txt={lab} x={x} y={860} s={cl(on * 1.2)} size={32} rot={(i - 1) * 3} />
      </React.Fragment>; })}
  </>;
}}</Stage>;

// 4 · «Soy la menor de siete hermanos»: siete pares de zapatos gastados caen en fila del más grande al más chico; el último par, chiquito, es el mío
export const Shoes7: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#e8dcc4,#c9b48a)">{(tt) => {
  const S = [1, 0.93, 0.86, 0.78, 0.7, 0.62, 0.52];
  return <>
    <div style={pos(960, 900, "", { width: 2000, height: 260, background: "repeating-linear-gradient(90deg,#9a6a3a 0 180px,#8a5a2e 180px 184px)" })} />
    {S.map((k, i) => { const q = sp(tt, 0.3 + i * 0.32, 6, 0.45), x = 200 + i * 250 + (1 - k) * 60, w = 190 * k, last = i === 6, glow = last ? eio(tt, 3.0, 3.6) : 0;
      return <div key={i} style={{ position: "absolute", left: x, top: 820 - 70 * k - 320 * (1 - cl(q)), width: w + 30, height: 80 * k, opacity: cl(q * 3), filter: last ? `drop-shadow(0 0 ${24 * glow}px ${AMB})` : "none" }}>
        {[0, 1].map((j) => <div key={j} style={{ position: "absolute", left: j * 22 * k, top: j * 6, width: w, height: 70 * k, borderRadius: `${40 * k}px ${70 * k}px ${12 * k}px ${12 * k}px`, background: j ? "linear-gradient(180deg,#5a3a22,#3a2414)" : "linear-gradient(180deg,#6b4628,#46301a)", boxShadow: "inset 0 -10px 0 #2a1a0c, 0 8px 10px rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: w * 0.55, top: 8 * k, width: w * 0.3, height: 20 * k, borderRadius: 10, background: "#2a1a0c" }} />
        </div>)}
      </div>; })}
    <Big tt={tt} at={2.4} x={960} y={200} txt="LA MENOR DE SIETE" size={96} col="#6b2a14" />
    <Tape txt="YO" x={1770} y={640} s={sp(tt, 3.2)} size={44} col="#b33a2c" />
  </>;
}}</Stage>;

// 5 · «Le untaba un poquito de mantequilla… y le echaba una cucharada de azúcar. Y lo doblaba»: la cuchara vuelca el azúcar sobre la rebanada y el pan se dobla por la mitad con peso
export const SugarFold: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), tip = eio(tt, 0.4, 1.0), pile = eio(tt, 0.6, 1.8), fold = cl(sp(tt, 2.2, 5, 0.5));
  return <>
    <Table y={820} />
    <Shadow x={960} y={820} w={600} s={s} />
    <div style={pos(960, 660, `scale(${s})`, { width: 560, height: 300, perspective: 1200 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 280, height: 300, borderRadius: "60px 0 0 30px", background: "linear-gradient(90deg,#c08a4c,#f2e2c0 14%,#f7ecd4)", boxShadow: "inset 0 0 0 12px #c08a4c" }}>
        <div style={{ position: "absolute", left: 40, top: 60, width: 200, height: 180, borderRadius: 30, background: "rgba(255,226,140,.55)" }} />
        <div style={{ position: "absolute", left: 70, top: 110 - 20 * pile, width: 160 * pile, height: 60 * pile, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #fff 0 2px, transparent 3px) 0 0/12px 12px, #f4f1ea" }} />
      </div>
      <div style={{ position: "absolute", left: 280, top: 0, width: 280, height: 300, borderRadius: "0 60px 30px 0", background: "linear-gradient(270deg,#c08a4c,#f2e2c0 14%,#f7ecd4)", boxShadow: "inset 0 0 0 12px #c08a4c", transformOrigin: "0 50%", transform: `rotateY(${-178 * fold}deg)`, filter: `brightness(${1 - 0.3 * fold})` }} />
    </div>
    <div style={pos(1160 - 60 * tip, 380, `rotate(${-30 - 70 * tip}deg) scale(${s})`, { width: 70, height: 320, opacity: 1 - eio(tt, 1.6, 2.1) })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 70, height: 90, borderRadius: "50%", background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />
      <div style={{ position: "absolute", left: 28, top: 80, width: 14, height: 240, borderRadius: 7, background: "linear-gradient(90deg,#9aa3aa,#eef2f5,#7a848c)" }} />
    </div>
    {tip > 0.3 && pile < 1 && Array.from({ length: 24 }, (_, i) => { const ph = ((tt * 2 + i * 0.07) % 1); return <div key={i} style={{ position: "absolute", left: 1080 + (i % 6) * 8, top: 440 + 200 * ph, width: 6, height: 6, background: "#fff", opacity: 1 - ph }} />; })}
    <Big tt={tt} at={2.6} x={960} y={200} txt="EL SÁNDWICH DE AZÚCAR" size={84} col={AMB} />
  </>;
}}</Stage>;

// 6 · «La achicoria es una raíz tostada y molida»: la raíz entra al molinillo de manivela, la manivela gira y abajo el cajoncito se llena de polvo café
export const RootMill: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#e9d7b4,#b8946a)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), feed = eio(tt, 0.3, 1.2), ang = 360 * eio(tt, 0.8, 4.6) * 2.2, lvl = eio(tt, 1.2, 4.6);
  return <>
    <Table y={860} />
    <Shadow x={960} y={860} w={420} s={s} />
    <div style={pos(960, 620, `scale(${s})`, { width: 360, height: 480 })}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 300, height: 120, borderRadius: "150px 150px 10px 10px", background: "linear-gradient(90deg,#8a6a2a,#e6c870,#8a6a2a)" }} />
      <div style={{ position: "absolute", left: 0, top: 120, width: 360, height: 360, background: "linear-gradient(90deg,#6b4224,#a8743e 40%,#6b4224)", boxShadow: "inset 0 0 0 10px #4a2a14" }} />
      <div style={{ position: "absolute", left: 80, top: 360, width: 200, height: 90, background: "#3a2414", boxShadow: "inset 0 0 0 6px #2a1a0c" }}>
        <div style={{ position: "absolute", left: 10, bottom: 6, width: 180, height: 70 * lvl, borderRadius: "40% 40% 0 0", background: "radial-gradient(circle at 30% 30%,#6a4022 0 2px,transparent 3px) 0 0/9px 9px, #4a2a14" }} />
        <div style={{ position: "absolute", left: 86, top: 34, width: 28, height: 20, borderRadius: 10, background: "#d8b860" }} />
      </div>
      <div style={{ position: "absolute", left: 172, top: -10, width: 16, height: 16, borderRadius: "50%", background: "#3a2a14" }} />
      <div style={{ position: "absolute", left: 180, top: -2, width: 0, height: 0, transform: `rotate(${ang}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: -7, width: 190, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#5a5a5a,#1a1a1a)" }} />
        <div style={{ position: "absolute", left: 172, top: -50, width: 34, height: 60, borderRadius: 17, background: "linear-gradient(90deg,#6b4224,#c79a68,#6b4224)" }} />
      </div>
    </div>
    <div style={pos(960, 420 - 260 * (1 - feed), `rotate(${70 + 20 * feed}deg) scale(${s * (1 - 0.6 * eio(tt, 1.0, 1.6))})`, { width: 70, height: 260, borderRadius: "35px 35px 10px 10px", background: "linear-gradient(90deg,#7a4a22,#b8844a,#6a3a18)", opacity: 1 - eio(tt, 1.3, 1.7) })} />
    <Big tt={tt} at={2.2} x={960} y={150} txt="RAÍZ TOSTADA Y MOLIDA" size={80} col="#6b2a14" />
  </>;
}}</Stage>;

// 7 · «En el almacén del barrio, el almacenero sabía quién compraba qué»: la libreta de fiado del almacén se abre, las hojas pasan solas y el lápiz subraya una línea
export const Ledger: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#5a3a1e,#2a1a0c)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), fl = (tt - 0.5) * 2.4, ul = eio(tt, 2.4, 3.4);
  const page = (x: number, k: number) => <div style={{ position: "absolute", left: x, top: 0, width: 520, height: 680, background: "repeating-linear-gradient(180deg, transparent 0 56px, rgba(70,110,170,.35) 56px 58px), linear-gradient(90deg,#efe6cf,#f8f1de)", boxShadow: k ? "inset 30px 0 40px rgba(0,0,0,.12)" : "inset -30px 0 40px rgba(0,0,0,.12)" }}>
    <div style={{ position: "absolute", left: 70, top: 0, width: 3, height: 680, background: "rgba(200,60,60,.45)" }} />
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 90, top: 70 + i * 58, width: 160 + ((i * 71 + k * 30) % 220), height: 10, borderRadius: 5, background: "rgba(40,30,20,.55)" }} />)}
  </div>;
  return <>
    <div style={pos(960, 560, `scale(${s}) perspective(1600px) rotateX(18deg)`, { width: 1040, height: 680 })}>
      {page(0, 0)}{page(520, 1)}
      {[0, 1, 2, 3].map((i) => { const f = cl(fl - i * 0.45); return f > 0 && f < 1 ? <div key={i} style={{ position: "absolute", left: 520, top: 0, width: 520, height: 680, transformOrigin: "0 50%", transform: `rotateY(${-180 * eio(f, 0, 1)}deg)`, background: "linear-gradient(90deg,#f8f1de,#e6dcc2)", boxShadow: "0 0 30px rgba(0,0,0,.25)" }} /> : null; })}
      <div style={{ position: "absolute", left: 610, top: 350, width: 360 * ul, height: 8, borderRadius: 4, background: "#b33a2c" }} />
    </div>
    <div style={pos(1180 + 360 * ul, 400 + 30 * Math.sin(tt * 8) * (ul > 0 && ul < 1 ? 1 : 0), "rotate(35deg)", { width: 26, height: 300, borderRadius: "4px 4px 13px 13px", background: "linear-gradient(90deg,#d8a020,#f6d060,#c08a10)", opacity: cl((tt - 2.0) * 3) })} />
    <Big tt={tt} at={1.4} x={960} y={130} txt="LA LIBRETA DEL ALMACÉN" size={80} col={AMB} />
  </>;
}}</Stage>;

// 8 · «La untas fina, si la dejas ablandar fuera de la nevera»: el bloque de mantequilla se ablanda y se hunde despacio en el platito; el cuchillo la unta fina sobre el pan
export const ButterSlump: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), soft = eio(tt, 0.4, 2.4), spread = eio(tt, 2.6, 4.2);
  return <>
    <Table y={820} />
    <Shadow x={700} y={820} w={460} s={s} />
    <div style={pos(700, 720, `scale(${s})`, { width: 440, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse,#f6f1e6 0 56%,#d8cfbe 58%,#efe8da 72%)" })} />
    <div style={pos(700, 650 + 30 * soft, `scale(${s})`, { width: 240 + 70 * soft, height: 130 - 50 * soft, borderRadius: `${14 + 50 * soft}px ${14 + 50 * soft}px ${30 * soft + 6}px ${30 * soft + 6}px`, background: "linear-gradient(180deg,#fff2b0,#f4dc80)", boxShadow: "inset 0 -12px 0 rgba(200,160,60,.35)" })} />
    <div style={pos(1260, 700, `scale(${s})`, { width: 420, height: 260, borderRadius: "70px 70px 24px 24px", background: "linear-gradient(180deg,#c08a4c,#e8c48a)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" })}>
      <div style={{ position: "absolute", left: 24, top: 20, width: 372 * spread, height: 210, borderRadius: "60px 20px 20px 20px", background: "rgba(255,236,150,.75)" }} />
    </div>
    <div style={pos(1080 + 360 * spread, 600 + 10 * Math.sin(tt * 10) * (spread > 0 && spread < 1 ? 1 : 0), "rotate(-12deg)", { width: 300, height: 34, borderRadius: "4px 20px 20px 4px", background: "linear-gradient(180deg,#eef2f5,#9aa3aa)", opacity: cl((tt - 2.4) * 3) })} />
    <Big tt={tt} at={1.4} x={960} y={190} txt="FUERA DE LA NEVERA" size={86} col={AMB} />
  </>;
}}</Stage>;

// 9 · «Repartía leche en polvo en las escuelas… y en la fila para recibirla, todos sabían quién era quién»: una fila de niños con tacitas avanza hacia el costal; a la primera le cae la leche
export const Queue: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg={SCHOOL}>{(tt) => {
  const adv = eio(tt, 0.3, 3.2), pour = eio(tt, 3.2, 4.2);
  return <>
    <div style={pos(1560, 640, `scale(${sp(tt, 0.1, 5, 0.5)})`, { width: 260, height: 340, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,#d8ccb0,#f2ead6,#c9bea4)", boxShadow: "0 24px 30px rgba(0,0,0,.35)" })}>
      <div style={{ position: "absolute", left: 30, top: 120, width: 200, height: 70, background: "#2c5a8a", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 100, top: 140, width: 60, height: 30, borderRadius: 15, background: "#fbf4e2" }} />
    </div>
    {Array.from({ length: 7 }, (_, i) => { const x = 1300 - i * 150 - 200 * (1 - adv), b = Math.abs(Math.sin(tt * 6 + i)) * 8 * (adv < 1 ? 1 : 0), hh = 240 + ((i * 37) % 60);
      return <div key={i} style={{ position: "absolute", left: x - 50, top: 860 - hh - b, width: 100, height: hh, opacity: cl(sp(tt, i * 0.08, 6, 0.5) * 2) }}>
        <div style={{ position: "absolute", left: 22, top: 0, width: 56, height: 56, borderRadius: "50%", background: "#3a2a1e" }} />
        <div style={{ position: "absolute", left: 10, top: 54, width: 80, height: hh - 110, borderRadius: "30px 30px 8px 8px", background: i % 2 ? "#e8e4dc" : "#2c4a6a" }} />
        <div style={{ position: "absolute", left: 22, top: hh - 60, width: 20, height: 60, background: "#2a1e14" }} /><div style={{ position: "absolute", left: 58, top: hh - 60, width: 20, height: 60, background: "#2a1e14" }} />
        <div style={{ position: "absolute", left: 70, top: 90, width: 46, height: 40, borderRadius: "0 0 14px 14px", background: TIN }} />
      </div>; })}
    {pour > 0 && <div style={{ position: "absolute", left: 1386, top: 610, width: 14, height: 120 * pour, borderRadius: 7, background: "#fbf8f0", opacity: 1 - eio(tt, 4.6, 5.2) }} />}
    <Big tt={tt} at={1.6} x={760} y={200} txt="LA FILA DE LA LECHE" size={90} col="#2c3e5a" />
  </>;
}}</Stage>;

// 10 · «Una bolsa te dura un mes, y nunca tiras leche cortada»: la bolsa de leche en polvo se desinfla mientras se llenan, uno tras otro, treinta vasitos en hilera
export const BagDeflate: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#e6eef2,#b8c8d2)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), d = eio(tt, 0.6, 4.2), n = Math.floor(30 * d);
  return <>
    <Table y={880} />
    <div style={pos(340, 640 + 60 * d, `scale(${s}) scaleY(${1 - 0.45 * d}) scaleX(${1 - 0.12 * d})`, { width: 300, height: 380, borderRadius: `${60 + 60 * d}px ${60 + 60 * d}px 30px 30px`, background: "linear-gradient(90deg,#d8dfe4,#ffffff,#c9d2d8)", boxShadow: "0 24px 30px rgba(0,0,0,.3)" })}>
      <div style={{ position: "absolute", left: 40, top: 130, width: 220, height: 90, background: "#2c5a8a", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 146, textAlign: "center", fontWeight: 900, fontSize: 46, color: "#fff" }}>LECHE</div>
    </div>
    {Array.from({ length: 30 }, (_, i) => { const r = Math.floor(i / 10), c = i % 10, on = i < n, q = on ? cl(sp(tt, 0.6 + (i / 30) * 3.6, 7, 0.45)) : 0;
      return <div key={i} style={{ position: "absolute", left: 640 + c * 120, top: 470 + r * 140, width: 70, height: 100, borderRadius: "6px 6px 18px 18px", background: "rgba(255,255,255,.35)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.8)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 70, height: 90 * q, background: "#fbf8f0" }} />
      </div>; })}
    <Big tt={tt} at={1.4} x={1180} y={240} txt="UNA BOLSA, UN MES" size={92} col="#2c3e5a" />
  </>;
}}</Stage>;
