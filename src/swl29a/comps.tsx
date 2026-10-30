// swl29a · los componentes únicos del video (uno por minuto, ninguno repetido en la tanda: D:/rtmp/swl29_COMPONENTES.md).
// Cada uno es el OBJETO que la idea es, dentro del Stage. h.b = segundos (absolutos) de las palabras que lo disparan.
import React from "react";
import { Img } from "remotion";
import { Stage, Head, Tag, Photo, Shadow, Odo, H, K, cl, phys, eio, eIn, eOut, lerp, rnd, img, SERIF, HAND, MARK, SANS } from "./kit";

const r = (h: H, i: number, d = 0) => (h.b[i] ?? h.at + d) - h.at;   // beat i relativo a la entrada
type CP = { t: number; h: H };

// C01 · la libra al tacho: tacho de pedal, la tapa se abre, cae el paquete gris y detrás $4.50 en monedas
export const C01Trash: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lid = eio(tt, r(h, 0) - 0.3, r(h, 0) + 0.2) * (1 - eio(tt, r(h, 1) + 1.2, r(h, 1) + 1.6));
  const pk = phys(tt, r(h, 0), 5.5, 0.5), fall = eIn(tt, r(h, 0) + 0.15, r(h, 0) + 0.75);
  return <>
    <Head tt={tt} kick="EVERY SATURDAY" title="Right in the trash" col={K.red} />
    <div style={{ position: "absolute", left: 960, top: 640, transformStyle: "preserve-3d" }}>
      <Shadow x={0} y={330} w={420} k={1} />
      {/* paquete de carne gris que cae adentro */}
      <div style={{ position: "absolute", left: -120 + 40 * (1 - pk), top: -340 + 520 * fall, width: 240, height: 150, borderRadius: 14, transform: `rotate(${-24 + 60 * fall}deg)`, background: "linear-gradient(160deg,#c9cdd2,#eef0f2 40%,#b8bcc2)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 16, borderRadius: 10, background: "radial-gradient(ellipse at 40% 40%,#9b6b6b,#7d5f5c 55%,#6a6566)" }} />
        <div style={{ position: "absolute", right: 10, top: 10, background: "#fff7d6", color: K.ink, fontWeight: 900, fontSize: 26, padding: "4px 10px", borderRadius: 6 }}>$4.50</div>
      </div>
      {/* monedas que siguen al paquete, de a una */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = r(h, 1) + i * 0.13, f = eIn(tt, a, a + 0.55), sp = 1 - f;
        if (tt < a) return null;
        return <div key={i} style={{ position: "absolute", left: -30 + (rnd(i) - 0.5) * 180, top: -300 + 500 * f, width: 62, height: 62, borderRadius: "50%", transform: `rotateX(${60 + 300 * f}deg) rotate(${i * 40}deg)`, background: i % 3 ? "radial-gradient(circle at 35% 30%,#fff4c8,#d8b25a 45%,#8a6a28)" : "radial-gradient(circle at 35% 30%,#ffffff,#c6cbd0 45%,#7c8288)", opacity: sp > 0.05 ? 1 : 0, boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />;
      })}
      {/* cuerpo del tacho: cromo cepillado */}
      <div style={{ position: "absolute", left: -190, top: 0, width: 380, height: 330, borderRadius: "18px 18px 40px 40px", background: "linear-gradient(90deg,#6d7176,#d9dde2 28%,#f4f6f8 38%,#9aa0a6 62%,#5b5f64)", boxShadow: "inset 0 -30px 50px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: -150, top: 300, width: 300, height: 40, borderRadius: 12, background: "#3a3d41" }} />
      {/* tapa con bisagra atrás */}
      <div style={{ position: "absolute", left: -200, top: -26, width: 400, height: 44, borderRadius: "22px 22px 8px 8px", transformOrigin: "50% 100%", transform: `rotateX(${-100 * lid}deg)`, background: "linear-gradient(90deg,#7a7e83,#e6e9ec 30%,#ffffff 40%,#a3a8ad 65%,#62666b)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
    </div>
    <div style={{ position: "absolute", left: 1330, top: 520 }}><Odo tt={tt} a={r(h, 1)} b={r(h, 1) + 1.3} v={4.5} pre="$" size={110} col={K.red} /></div>
    <Tag tt={tt} at={r(h, 1) + 1.4} x={1600} y={700} txt="GONE" size={46} col={K.dim} />
  </>;
}}</Stage>;

// C02 · la libra se parte en 7: el bloque sobre papel encerado se divide en 7 bolitas que ruedan a su lugar, 2.3 oz cada una
export const C02Split: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sp = eio(tt, r(h, 0), r(h, 0) + 0.9);
  return <>
    <Head tt={tt} kick="THE MINUTE I GET HOME" title="One pound, seven suppers" />
    {/* papel encerado en perspectiva sobre la fórmica */}
    <div style={{ position: "absolute", left: 260, top: 470, width: 1400, height: 430, transform: "rotateX(58deg)", transformOrigin: "50% 100%", background: "linear-gradient(120deg,rgba(255,252,240,.92),rgba(236,230,214,.85) 50%,rgba(255,255,250,.9))", borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,.45)" }} />
    {Array.from({ length: 7 }, (_, i) => {
      const x0 = 960 + (i - 3) * 22, x1 = 960 + (i - 3) * 190, y = 690;
      const k = phys(tt, r(h, 0) + 0.15 + i * 0.09, 6, 0.48), x = lerp(x0, x1, cl(k)), sz = lerp(120, 132, sp);
      const lab = phys(tt, r(h, 1) + i * 0.1, 7, 0.5);
      return <React.Fragment key={i}>
        <Shadow x={x} y={y + sz * 0.42} w={sz * 1.1} k={1} />
        <div style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz * 0.82, borderRadius: "50% 50% 46% 46%", transform: `rotate(${(1 - cl(k)) * 180 * (i - 3)}deg)`, background: "radial-gradient(circle at 36% 30%,#e9a0a0,#b85a5e 40%,#7e3236 80%)", boxShadow: "inset -10px -14px 24px rgba(60,10,10,.45), inset 8px 8px 16px rgba(255,220,220,.25)" }}>
          {Array.from({ length: 10 }, (_, j) => <div key={j} style={{ position: "absolute", left: 14 + rnd(i * 20 + j) * (sz - 40), top: 10 + rnd(i * 31 + j) * (sz * 0.6), width: 9, height: 7, borderRadius: "50%", background: "rgba(255,235,230,.55)" }} />)}
        </div>
        {lab > 0.01 && <div style={{ position: "absolute", left: x, top: y + 110, transform: `translate(-50%,0) scale(${0.7 + 0.3 * lab})`, opacity: cl(lab * 2), fontFamily: HAND, fontSize: 40, fontWeight: 700, color: K.goldL }}>2.3 oz</div>}
      </React.Fragment>;
    })}
    {/* el cuchillo baja y corta: recién ahí se parte */}
    {tt < r(h, 0) + 0.5 && <div style={{ position: "absolute", left: lerp(560, 1360, eio(tt, r(h, 0) - 0.9, r(h, 0))), top: 470 + 60 * Math.sin(eio(tt, r(h, 0) - 0.9, r(h, 0)) * Math.PI * 6), width: 60, height: 300, transform: "rotate(14deg)", transformOrigin: "50% 100%", opacity: 1 - eIn(tt, r(h, 0) + 0.1, r(h, 0) + 0.5), zIndex: 9 }}>
      <div style={{ width: 60, height: 200, borderRadius: "40px 40px 4px 4px", background: "linear-gradient(90deg,#8d939a,#f4f6f8 45%,#b7bdc3)", boxShadow: "6px 10px 20px rgba(0,0,0,.45)" }} />
      <div style={{ width: 44, height: 100, marginLeft: 8, borderRadius: 8, background: "linear-gradient(90deg,#3a2414,#6b4426,#2e1c10)" }} />
    </div>}
    {/* el bloque entero antes de partirse */}
    <div style={{ position: "absolute", left: 960 - 300, top: 600, width: 600, height: 180, borderRadius: 40, background: "radial-gradient(ellipse at 40% 30%,#e8a2a2,#b45a5c 45%,#7a3034)", opacity: 1 - eIn(tt, r(h, 0) - 0.05, r(h, 0) + 0.2), boxShadow: "inset -20px -20px 40px rgba(60,10,10,.45)" }} />
    <Tag tt={tt} at={r(h, 1) + 0.8} x={960} y={930} txt="THE SIZE OF A HEN'S EGG" size={42} col={K.dim} />
  </>;
}}</Stage>;

// C03 · el estante del freezer: 7 paquetes planos entran de canto como libros, el marcador escribe el día en cada lomo
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const C03Freezer: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="cold">{(tt) => <>
  <Head tt={tt} kick="FLAT FREEZES FAST" title="A library in the freezer" col={K.ice} />
  {/* caja del freezer con escarcha */}
  <div style={{ position: "absolute", left: 360, top: 300, width: 1200, height: 560, borderRadius: 20, background: "linear-gradient(180deg,#dfe9f1,#b8c9d6 60%,#9fb3c3)", boxShadow: "inset 0 0 80px rgba(255,255,255,.7), 0 40px 80px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", left: 40, right: 40, top: 40, bottom: 120, borderRadius: 12, background: "linear-gradient(180deg,#eef4f8,#cfdde8)", boxShadow: "inset 0 20px 40px rgba(90,120,150,.4)" }} />
    {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + rnd(i) * 1100, top: 50 + rnd(i + 40) * 380, width: 30 + rnd(i + 9) * 60, height: 6, borderRadius: 3, background: "rgba(255,255,255,.8)", filter: "blur(2px)" }} />)}
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 110, height: 16, background: "linear-gradient(180deg,#f5f8fa,#a9b9c6)", borderRadius: 4 }} />
  </div>
  {DAYS.map((d, i) => {
    const a = r(h, 0) + i * 0.32, k = phys(tt, a, 6.5, 0.5), x = 520 + i * 140, wr = cl((tt - (r(h, 1) + i * 0.42)) / 0.45);
    return <div key={d} style={{ position: "absolute", left: x, top: 330 + (1 - cl(k)) * -420, width: 112, height: 400, transform: `rotate(${(1 - cl(k)) * 18 * (i % 2 ? 1 : -1)}deg)`, borderRadius: 8, background: "linear-gradient(90deg,#efe6cf,#fbf6e8 40%,#e2d6b8)", boxShadow: "6px 10px 18px rgba(30,50,70,.45), inset 0 0 0 2px rgba(255,255,255,.4)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 18, right: 18, top: 40, bottom: 40, borderRadius: 6, background: "radial-gradient(ellipse,rgba(170,90,95,.35),transparent 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: MARK, fontSize: 44, color: "#1b1b22", transform: "rotate(-90deg)", clipPath: `inset(0 ${(1 - wr) * 100}% 0 0)`, whiteSpace: "nowrap" }}>{d}</div>
    </div>;
  })}
  <Tag tt={tt} at={r(h, 1) + 3.2} x={960} y={940} txt="THAWS FAST, TOO" size={44} col={K.ice} />
</>}</Stage>;

// C04 · el tablero de precios de la cafetería de 1968: letras blancas de encastre sobre fieltro negro que se acomodan, 35¢
export const C04Board: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L1 = "SALISBURY STEAK", L2 = "W/ GRAVY & POTATOES";
  const letters = (s: string, a: number, y: number, sz: number) => s.split("").map((c, i) => {
    const k = phys(tt, a + i * 0.085, 8, 0.45);
    return <span key={i} style={{ display: "inline-block", width: sz * 0.66, textAlign: "center", transform: `translateY(${(1 - cl(k)) * -60}px) rotate(${(1 - cl(k)) * (rnd(i + y) - 0.5) * 40}deg)`, opacity: cl(k * 3) }}>{c}</span>;
  });
  return <>
    <Head tt={tt} kick="DES MOINES · 1968" title="The hospital cafeteria" />
    <div style={{ position: "absolute", left: 440, top: 270, width: 1040, height: 560, borderRadius: 14, background: "linear-gradient(180deg,#5b3d22,#3c2614)", padding: 26, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 6, background: "repeating-linear-gradient(0deg,#151515 0 22px,#0c0c0c 22px 26px)", boxShadow: "inset 0 0 50px rgba(0,0,0,.9)", position: "relative", fontFamily: SANS, fontWeight: 800, color: "#f2f2ea" }}>
        <div style={{ position: "absolute", left: 40, top: 30, fontSize: 40, letterSpacing: 6, color: "#e0c38a" }}>{letters("TODAY'S LUNCH", r(h, 0) - 0.4, 0, 40)}</div>
        <div style={{ position: "absolute", left: 40, top: 130, fontSize: 64 }}>{letters(L1, r(h, 0), 1, 64)}</div>
        <div style={{ position: "absolute", left: 40, top: 230, fontSize: 38, color: "#cfcfc4" }}>{letters(L2, r(h, 0) + 0.6, 2, 38)}</div>
        <div style={{ position: "absolute", right: 60, bottom: 50, fontSize: 170, color: "#fff7dc", textShadow: "0 0 30px rgba(255,230,160,.35)" }}>{letters("35¢", r(h, 1), 3, 170)}</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 120, top: 640, transform: `rotate(-7deg) scale(${0.7 + 0.3 * cl(phys(tt, 0.6, 5, 0.5))})` }}><Photo id={h.bg} w={300} h={220} border={10} r={4} /></div>
  </>;
}}</Stage>;

// C05 · el timer de cocina: la perilla gira a 4 minutos y la aguja vuelve sola; la mano NO toca la sartén
export const C05Timer: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const wind = eio(tt, 0.4, 1.3), run = cl((tt - 1.5) / Math.max(2, h.out - h.at - 2));
  const ang = 4 * 6 * 6 * wind * (1 - run);   // 4 min = 144° (60 min = 360°)
  return <>
    <Head tt={tt} kick="FOUR MINUTES" title="Leave it alone" />
    <Shadow x={960} y={880} w={460} k={1} />
    <div style={{ position: "absolute", left: 960 - 230, top: 400, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%,#fff8ef,#f2e2c8 40%,#c9b08a 85%)", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 -18px 30px rgba(120,80,40,.35)" }}>
      <div style={{ position: "absolute", inset: 34, borderRadius: "50%", background: "radial-gradient(circle,#fffdf8,#f4ead8)", boxShadow: "inset 0 6px 14px rgba(0,0,0,.25)", transform: `rotate(${-ang}deg)` }}>
        {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: 6, width: i % 5 ? 3 : 6, height: i % 5 ? 16 : 30, marginLeft: i % 5 ? -1.5 : -3, background: i < 5 ? K.red : "#3a2a1a", transformOrigin: `50% ${196 - 6}px`, transform: `rotate(${i * 6}deg)` }} />)}
        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => <div key={m} style={{ position: "absolute", left: "50%", top: "50%", width: 60, marginLeft: -30, marginTop: -22, textAlign: "center", fontWeight: 900, fontSize: 30, color: "#3a2a1a", transform: `rotate(${m * 6}deg) translateY(-140px) rotate(${-m * 6 + ang}deg)` }}>{m}</div>)}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 70, height: 70, margin: -35, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#d8c7a8)", boxShadow: "0 6px 12px rgba(0,0,0,.35)" }} />
      </div>
      {/* marca fija arriba */}
      <div style={{ position: "absolute", left: "50%", top: -24, marginLeft: -16, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `30px solid ${K.red}` }} />
    </div>
    <Tag tt={tt} at={1.4} x={1460} y={560} txt="DON'T TOUCH IT" size={54} col={K.red} rot={-4} />
    <Tag tt={tt} at={2.2} x={1460} y={640} txt="the crust is the gravy" size={46} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// C06 · la lupa sobre el fondo de la sartén: la lupa pasa y lo marrón se agranda y brilla — «eso no es mugre, es la cena»
export const C06Lens: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lx = lerp(560, 1150, eio(tt, 0.5, 2.4)), ly = 600 + 40 * Math.sin(tt * 0.9);
  const fond = (sc: number) => Array.from({ length: 46 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + rnd(i) * 560 * sc, top: 120 + rnd(i + 7) * 300 * sc, width: (14 + rnd(i + 3) * 30) * sc, height: (10 + rnd(i + 5) * 18) * sc, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%,#c98a4a,#7a3f18 60%,#3d1d0a)`, boxShadow: `0 0 ${6 * sc}px rgba(255,170,90,.25)` }} />);
  return <>
    <Head tt={tt} kick="DON'T WASH THE PAN" title="That brown is the flavor" />
    <div style={{ position: "absolute", left: 960 - 460, top: 330, width: 920, height: 560, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#2c2a29,#141312 60%,#050505)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 26px #1e1d1c, inset 0 0 0 30px #3b3936" }}>{fond(1)}</div>
    <div style={{ position: "absolute", left: 1380, top: 560, width: 520, height: 46, borderRadius: 23, background: "linear-gradient(180deg,#3a3836,#141312)", transform: "rotate(8deg)" }} />
    {/* lupa con aumento real (la misma textura escalada adentro) */}
    <div style={{ position: "absolute", left: lx - 170, top: ly - 170, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 16px #c9a24a, 0 0 0 22px #6e5220, 0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 170 - 2 * (lx - 500), top: 170 - 2 * (ly - 330), width: 1840, height: 1120, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1840, height: 1120, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#34302c,#1a1714 60%,#070605)" }}>{fond(2)}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),transparent 40%)" }} />
    </div>
    <div style={{ position: "absolute", left: lx + 120, top: ly + 120, width: 60, height: 230, borderRadius: 30, background: "linear-gradient(90deg,#4a2e14,#8a5a2c,#3a220e)", transform: "rotate(-40deg)", transformOrigin: "50% 0" }} />
    <Tag tt={tt} at={r(h, 0)} x={1540} y={300} txt="NOT DIRT…" size={50} col={K.dim} />
    <Tag tt={tt} at={r(h, 1)} x={1540} y={380} txt="THAT'S SUPPER" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// C07 · el plato que suma: el plato bueno desde arriba, cada cosa cae con su precio colgando y el odómetro llega a $1.10
export const C07Plate: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const items: [string, string, number, number, number][] = [["steak", "75¢", 860, 560, 0], ["potato", "20¢", 1080, 520, 0.7], ["beans", "15¢", 1010, 700, 1.4]];
  return <>
    <Head tt={tt} kick="SUPPER NO. 1" title="What it really costs" />
    <Shadow x={960} y={880} w={720} k={1} />
    <div style={{ position: "absolute", left: 960 - 380, top: 250, width: 760, height: 620, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 38%,#ffffff,#f3eee6 55%,#d9d1c4)", boxShadow: "0 30px 70px rgba(0,0,0,.55), inset 0 0 0 30px #f7f3ec, inset 0 0 0 34px #d8b864, inset 0 0 0 38px #f7f3ec" }} />
    {items.map(([n, p, x, y, d], i) => {
      const k = phys(tt, 0.4 + d, 6, 0.5), z = (1 - cl(k)) * -260;
      const body = n === "steak" ? <div style={{ width: 240, height: 150, borderRadius: "48% 52% 45% 55%", background: "radial-gradient(ellipse at 40% 35%,#8a4a22,#5a2a10 60%,#3a1806)", boxShadow: "inset 0 -10px 20px rgba(0,0,0,.4)", position: "relative" }}><div style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(130,70,30,.7),transparent 70%)" }} />{Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: 20 + j * 26, top: 30 + (j % 3) * 30, width: 30, height: 8, borderRadius: 4, background: "#e7c27a", transform: `rotate(${j * 23}deg)` }} />)}</div>
        : n === "potato" ? <div style={{ width: 170, height: 130, borderRadius: "50% 45% 55% 50%", background: "radial-gradient(circle at 40% 35%,#fffbe6,#f1e2b4 60%,#d4c08a)", boxShadow: "inset -8px -10px 18px rgba(140,110,50,.35)" }} />
          : <div style={{ width: 200, height: 90, position: "relative" }}>{Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: j * 18, top: (j % 3) * 18, width: 90, height: 16, borderRadius: 8, background: "linear-gradient(180deg,#7fb05a,#4a7a30)", transform: `rotate(${-20 + j * 6}deg)` }} />)}</div>;
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: x, top: y + z, transform: "translate(-50%,-50%)", opacity: cl(k * 3) }}>{body}</div>
        <div style={{ position: "absolute", left: x + 90, top: y - 110 + z * 0.6, transform: `rotate(${8 * Math.sin(tt * 2 + i)}deg)`, transformOrigin: "0 0", zIndex: 5, opacity: cl(phys(tt, 0.7 + d, 7, 0.5) * 2) }}>
          <div style={{ width: 2, height: 40, background: "#c8b080", marginLeft: 20 }} />
          <div style={{ background: "#fff6d8", color: K.ink, fontWeight: 900, fontSize: 54, padding: "8px 18px", borderRadius: 8, boxShadow: "0 8px 16px rgba(0,0,0,.4)" }}>{p}</div>
        </div>
      </React.Fragment>;
    })}
    <div style={{ position: "absolute", left: 1450, top: 470 }}><Odo tt={tt} a={0.5} b={2.6} v={1.1} pre="$" size={120} /></div>
    <Tag tt={tt} at={2.8} x={1640} y={640} txt="THE WHOLE PLATE" size={50} col={K.dim} />
  </>;
}}</Stage>;

// C08 · la postal del barco: postal de 1954 del USS Bremerton que da vuelta y muestra la letra de Harold
export const C08Postcard: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  // postal con canto de cartón (capas) y sombra de contacto que se achica al apoyarse; da vuelta y la letra se escribe renglón a renglón
  const fl = eio(tt, r(h, 0), r(h, 0) + 1.0), k = phys(tt, 0.1, 4.5, 0.55), land = cl(k), dur = h.out - h.at;
  const lines = ["Dear Loretta,", "creamed beef on toast", "again this morning.", "I'd eat it every day", "if you made it. — H."];
  return <>
    <Shadow x={960 + 30 * fl} y={860} w={lerp(500, 860, land)} k={lerp(0.3, 1, land)} />
    <div style={{ position: "absolute", left: 960 - 420, top: 290 + (1 - land) * -520 + 10 * Math.sin(tt * 0.7), width: 840, height: 540, transformStyle: "preserve-3d", transform: `rotateX(${18 - 8 * land}deg) rotateY(${180 * fl + 6 * Math.sin(tt * 0.4)}deg) rotateZ(${-5 + 3 * Math.sin(tt * 0.5) + 2 * cl(tt / dur)}deg)` }}>
      {[6, 4, 2].map((z) => <div key={z} style={{ position: "absolute", inset: 0, borderRadius: 10, background: "#cdbf9c", transform: `translateZ(${-z}px)` }} />)}
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 10, background: "#f4ecd8", padding: 22, boxShadow: "0 50px 90px rgba(0,0,0,.65)" }}>
        <div style={{ width: "100%", height: 400, overflow: "hidden", borderRadius: 4, position: "relative" }}><Img src={img(h.bg ?? "f16")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.55) contrast(1.05)", transform: `scale(${1.05 + 0.04 * tt / dur})` }} /></div>
        <div style={{ marginTop: 14, fontFamily: SERIF, fontSize: 44, color: K.wine, textAlign: "center" }}>Greetings from the U.S.S. Bremerton</div>
      </div>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 10, background: "linear-gradient(160deg,#f7f0de,#ece0c4)", boxShadow: "0 50px 90px rgba(0,0,0,.65)", padding: 40 }}>
        <div style={{ position: "absolute", left: 500, top: 40, bottom: 40, width: 2, background: "rgba(90,60,30,.35)" }} />
        {lines.map((l, i) => { const a = r(h, 0) + 0.9 + i * 0.55; return <div key={i} style={{ fontFamily: HAND, fontSize: 52, color: "#1d2b5a", lineHeight: 1.18, whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - eio(tt, a, a + 0.5)) * 100}% 0 0)` }}>{l}</div>; })}
        <div style={{ position: "absolute", right: 50, top: 40, width: 110, height: 130, border: "3px dashed #9a6a3a", borderRadius: 4, background: "linear-gradient(135deg,#c64a3a,#8e1d2b)", color: "#fff", fontWeight: 900, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.25 * (1 - cl(phys(tt, r(h, 0) + 3.8, 7, 0.4)))})`, opacity: cl((tt - r(h, 0) - 3.6) * 4) }}>3¢</div>
        <div style={{ position: "absolute", right: 50, top: 250, fontFamily: HAND, fontSize: 44, color: "#333", lineHeight: 1.35 }}>Miss Loretta<br />Polk County, Iowa</div>
      </div>
    </div>
  </>;
}}</Stage>;

// C09 · el molinillo de pimienta: gira de verdad (las estrías corren), la pimienta llueve sobre la salsa y la cuenta de vueltas sube
export const C09Pepper: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const turns = Math.floor(cl((tt - 0.6) / 3.2) * 12), tw = tt * 3.2;
  return <>
    <Head tt={tt} kick="THE SECRET" title="More pepper than you think" />
    <div style={{ position: "absolute", left: 960 - 330, top: 760, width: 660, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#f2e6cf,#d9c49c 55%,#a88c5c)", boxShadow: "0 30px 60px rgba(0,0,0,.5), inset 0 0 0 16px #2c2a28" }}>
      {Array.from({ length: Math.min(160, Math.floor(cl((tt - 0.7) / 3.5) * 160)) }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + rnd(i) * 420, top: 50 + rnd(i + 99) * 100, width: 6, height: 6, borderRadius: "50%", background: "#1a1410" }} />)}
    </div>
    {/* granos cayendo */}
    {tt > 0.6 && Array.from({ length: 26 }, (_, i) => {
      const ph = ((tt * 1.6 + rnd(i)) % 1), x = 1110 + (rnd(i + 3) - 0.5) * 90 - ph * 120, y = 640 + ph * 170;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 7, height: 7, borderRadius: "40%", background: "#15100c", opacity: 1 - ph * 0.6 }} />;
    })}
    {/* molinillo de madera torneada */}
    <div style={{ position: "absolute", left: 960 + 60, top: 200, width: 180, height: 440, transform: `rotate(${-8 + 3 * Math.sin(tt * 1.4)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 60, height: 50, borderRadius: "50% 50% 10px 10px", background: "linear-gradient(90deg,#5a3518,#b07a44,#4a2a10)" }} />
      <div style={{ position: "absolute", left: 0, top: 40, width: 180, height: 330, clipPath: "polygon(8% 0,92% 0,100% 14%,78% 22%,66% 50%,74% 80%,90% 100%,10% 100%,26% 80%,34% 50%,22% 22%,0 14%)", background: `repeating-linear-gradient(90deg,#4a2a10 ${-(tw * 30) % 40}px,#a8743e ${20 - (tw * 30) % 40}px,#4a2a10 ${40 - (tw * 30) % 40}px)`, boxShadow: "inset -20px 0 30px rgba(0,0,0,.45), inset 20px 0 30px rgba(255,220,170,.15)" }} />
      <div style={{ position: "absolute", left: 40, top: 370, width: 100, height: 60, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#8a8f94,#e6e9ec,#70757a)" }} />
    </div>
    <div style={{ position: "absolute", left: 1380, top: 420, fontWeight: 900, fontSize: 180, color: K.goldL, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{turns}</div>
    <Tag tt={tt} at={1.2} x={1480} y={660} txt="TURNS · KEEP GOING" size={48} col={K.dim} />
  </>;
}}</Stage>;

// C10 · la escarapela azul de 1974: cuelga de un alfiler, se balancea en 3D y el año rueda hasta 1974 — «she was sixty»
export const C10Ribbon: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = Math.exp(-tt * 0.7) * Math.sin(tt * 3.4) * 22, yr = Math.round(lerp(1940, 1974, eOut(tt, r(h, 0), r(h, 0) + 2.2)));
  return <>
    <Head tt={tt} kick="POLK COUNTY FAIR" title="She tried for 34 years" />
    <div style={{ position: "absolute", left: 1120, top: 260, transform: `rotate(5deg) scale(${0.8 + 0.2 * cl(phys(tt, 0.3, 5, 0.5))})` }}><Photo id={h.bg} w={640} h={460} border={14} r={4} /></div>
    <div style={{ position: "absolute", left: 640, top: 200, transformOrigin: "50% 0", transform: `rotateZ(${sw}deg) rotateY(${18 * Math.sin(tt * 0.8)}deg)` }}>
      <div style={{ position: "absolute", left: -6, top: -20, width: 12, height: 44, borderRadius: 6, background: "linear-gradient(90deg,#999,#fff,#888)" }} />
      {/* colas */}
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: s < 0 ? -95 : 5, top: 190, width: 90, height: 360, background: "linear-gradient(90deg,#1a3f9a,#3c6be0 50%,#1a3f9a)", clipPath: "polygon(0 0,100% 0,100% 100%,50% 86%,0 100%)", transform: `rotate(${s * 8}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.4)" }} />)}
      {/* roseta plisada */}
      <div style={{ position: "absolute", left: -170, top: 20, width: 340, height: 340, borderRadius: "50%", background: "repeating-conic-gradient(#2b56c8 0 6deg,#1b3d9c 6deg 12deg)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: -112, top: 78, width: 224, height: 224, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%,#fffef6,#efe4c4)", boxShadow: "inset 0 -8px 16px rgba(0,0,0,.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#1b3d9c" }}>
        <div style={{ fontFamily: SERIF, fontSize: 40 }}>First</div>
        <div style={{ fontWeight: 900, fontSize: 62, transform: `perspective(300px) rotateX(${(lerp(1940, 1974, eOut(tt, r(h, 0), r(h, 0) + 2.2)) % 1) * -90}deg)`, textShadow: "0 3px 0 #9fb2e6, 0 6px 0 #6b84cc, 0 10px 14px rgba(0,0,0,.35)" }}>{yr}</div>
      </div>
    </div>
    <Tag tt={tt} at={r(h, 1)} x={640} y={900} txt="SHE WAS 60" size={56} col={K.goldL} />
  </>;
}}</Stage>;

// C11 · el microondas: el visor muestra la mitad de morrón girando en el plato, los números bajan de 2:00 y el morrón se ablanda
export const C11Micro: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const run = cl((tt - 0.8) / 3.6), secs = Math.ceil(120 * (1 - run)), soft = run;
  return <>
    <Head tt={tt} kick="MY MOTHER'S TRICK" title="Two minutes first" />
    <Shadow x={960} y={890} w={1000} k={1} />
    <div style={{ position: "absolute", left: 460, top: 330, width: 1000, height: 560, borderRadius: 26, background: "linear-gradient(180deg,#f4f1ea,#d9d4c8)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 -10px 20px rgba(0,0,0,.15)" }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 640, height: 480, borderRadius: 16, background: "radial-gradient(ellipse at 50% 60%,rgba(255,214,140,.9),rgba(140,90,30,.85) 70%,#2a1a08)", boxShadow: "inset 0 0 0 10px #262626, inset 0 0 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 320 - 230, top: 330, width: 460, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,255,255,.55),rgba(200,200,200,.3))" }} />
        <div style={{ position: "absolute", left: 320 - 120, top: 170, width: 240, height: 200, transform: `scaleX(${0.86 + 0.14 * Math.cos(tt * 1.3)}) scaleY(${1 - 0.12 * soft})`, borderRadius: "45% 45% 50% 50%", background: `radial-gradient(ellipse at ${40 + 22 * Math.sin(tt * 1.3)}% 30%,${soft > 0.5 ? "#8fc06a" : "#6fbf4a"},#2f7a22 70%)`, boxShadow: "inset -14px -18px 30px rgba(0,40,0,.5)" }} />
        <div style={{ position: "absolute", left: 320 - 14, top: 150, width: 28, height: 40, borderRadius: 8, background: "linear-gradient(90deg,#3d6a1e,#7aa040,#2f5414)", transform: `translateX(${18 * Math.sin(tt * 1.3)}px) rotate(${10 * Math.sin(tt * 1.3)}deg)` }} />
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 230 + i * 40, top: 140 - ((tt * 40 + i * 30) % 120), width: 30, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.18)", filter: "blur(8px)", opacity: soft }} />)}
      </div>
      <div style={{ position: "absolute", left: 720, top: 60, width: 240, height: 100, borderRadius: 10, background: "#0b120b", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 900, fontSize: 70, color: "#7dff8a", textShadow: "0 0 14px rgba(120,255,140,.7)" }}>{`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`}</div>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 740 + (i % 3) * 70, top: 200 + Math.floor(i / 3) * 70, width: 54, height: 48, borderRadius: 8, background: "linear-gradient(180deg,#fbfaf6,#d8d3c6)", boxShadow: "0 3px 6px rgba(0,0,0,.25)" }} />)}
    </div>
    <Tag tt={tt} at={4.6} x={960} y={970} txt="SOFT PEPPER · NEVER MUSHY" size={40} col={K.goldL} />
  </>;
}}</Stage>;

// C12 · la torre de 212 platos: los platos se apilan cada vez más rápido y el contador corre hasta 212
export const C12Plates: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const k = eIn(tt, 0.4, 3.4), n = Math.round(212 * k), shown = Math.min(60, Math.round(60 * k));
  return <>
    <Head tt={tt} kick="MRS. LINDQVIST · 1991" title="The funeral lunch" />
    {Array.from({ length: 3 }, (_, c) => <React.Fragment key={c}>
      <Shadow x={620 + c * 260} y={950} w={240} k={1} />
      {Array.from({ length: Math.round(shown / 60 * [21, 17, 13][c]) }, (_, j) => { const rim = ["rgba(216,184,100,.95)", "rgba(80,120,190,.9)", "rgba(110,150,90,.9)"][c], lean = [-0.5, 0.3, 0.8][c] * j;
        return <div key={j} style={{ position: "absolute", left: 620 + c * 260 - 110 + lean + (rnd(j * 7 + c) - 0.5) * 12, top: 930 - j * 30, width: [220, 200, 236][c], height: 28, borderRadius: "50%", transform: `rotate(${(rnd(j + c * 50) - 0.5) * 3}deg)`, background: "linear-gradient(180deg,#ffffff,#e5ded2)", boxShadow: `0 3px 0 #c8bfae, 0 0 0 3px ${rim} inset` }} />; })}
    </React.Fragment>)}
    <div style={{ position: "absolute", left: 1400, top: 360, fontWeight: 900, fontSize: 220, color: K.goldL, textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{n}</div>
    <Tag tt={tt} at={3.6} x={1530} y={640} txt="PEOPLE · I COUNTED" size={36} col={K.dim} />
  </>;
}}</Stage>;

// C13 · la fuente de hotel se encoge hasta la cazuelita de una taza — «el mismo pastel, dice la verdad sobre cuántos vienen»
export const C13Shrink: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  // la FOTO real del almuerzo de 212 (fuentes de hotel) se encoge dentro de un marco de acero hasta volverse la cazuelita de una taza (otra foto real)
  const s = eio(tt, 1.0, 2.8), dur = h.out - h.at, w = lerp(1240, 380, s), hh = lerp(560, 380, s), rad = lerp(16, 190, s);
  return <>
    <Shadow x={960} y={560 + hh / 2 + 40} w={w * 0.85} k={1} />
    <div style={{ position: "absolute", left: 960 - w / 2, top: 560 - hh / 2, width: w, height: hh, borderRadius: rad, background: s < 0.5 ? "linear-gradient(180deg,#e4e8ec,#8f969d)" : "linear-gradient(180deg,#ffffff,#d9cfbf)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: lerp(20, 26, s) }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: rad * 0.85, overflow: "hidden" }}>
        <Img src={img("f27")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - eio(tt, 1.6, 2.4), transform: `scale(${1.1 - 0.06 * s})` }} />
        <Img src={img("f28")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: eio(tt, 1.6, 2.4), transform: `scale(${1.05 + 0.05 * cl((tt - 2.4) / Math.max(1, dur - 2.4))})` }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 40px rgba(0,0,0,.45)", borderRadius: rad * 0.85 }} />
      </div>
    </div>
    <Tag tt={tt} at={0.3} x={960} y={190} txt="212 PEOPLE · 4 HOTEL PANS" size={52} col={K.tx} />
    <Tag tt={tt} at={2.7} x={960} y={930} txt="1 CUP · 1 PERSON" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// C14 · el tenedor dibuja surcos en el puré visto desde arriba y las crestas se doran como en el horno
export const C14Fork: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rows = 7, brown = eio(tt, 3.2, 5.2);
  return <>
    <Head tt={tt} kick="THE WHOLE POINT" title="Rows that go crispy" />
    <div style={{ position: "absolute", left: 960 - 400, top: 260, width: 800, height: 640, borderRadius: 90, background: "linear-gradient(180deg,#fffaf0,#e9e0cf)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: 34 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 70, overflow: "hidden", background: "radial-gradient(ellipse at 40% 30%,#fffbea,#f2e6c4 70%)" }}>
        {Array.from({ length: 70 }, (_, i) => <div key={"m" + i} style={{ position: "absolute", left: rnd(i) * 720, top: rnd(i + 33) * 560, width: 30 + rnd(i + 5) * 60, height: 18 + rnd(i + 8) * 30, borderRadius: "50%", background: "radial-gradient(ellipse at 35% 30%,rgba(255,255,250,.9),rgba(222,204,160,.55) 70%,transparent)" }} />)}
        {Array.from({ length: rows }, (_, i) => {
          const a = 0.4 + i * 0.36, k = cl((tt - a) / 0.45), y = 40 + i * 78;
          return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 20, top: y, height: 26, width: `${k * 100}%`, borderRadius: 13, background: `linear-gradient(180deg, rgba(${lerp(250, 160, brown)},${lerp(236, 92, brown)},${lerp(200, 30, brown)},1), rgba(255,250,232,.9))` }} />
            <div style={{ position: "absolute", left: 20, top: y + 30, height: 14, width: `${k * 100}%`, borderRadius: 7, background: "rgba(190,160,110,.45)" }} />
          </React.Fragment>;
        })}
      </div>
    </div>
    {/* el tenedor recorre la fila actual */}
    {(() => { const i = Math.min(rows - 1, Math.floor(cl((tt - 0.4) / (rows * 0.36)) * rows)), k = cl((tt - 0.4 - i * 0.36) / 0.45); if (tt > 0.4 + rows * 0.36 + 0.4) return null;
      return <div style={{ position: "absolute", left: 600 + k * 680 + (1 - eOut(tt, 0, 0.45)) * 900, top: 300 + i * 78, width: 70, height: 420, transform: "rotate(-62deg)", transformOrigin: "50% 0" }}>
        <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2, 3].map((j) => <div key={j} style={{ width: 9, height: 110, borderRadius: 5, background: "linear-gradient(90deg,#9aa0a6,#f5f7f9,#80868c)" }} />)}</div>
        <div style={{ width: 66, height: 290, borderRadius: 20, marginTop: -6, background: "linear-gradient(90deg,#8a9096,#eef1f3,#767c82)" }} />
      </div>; })()}
    <Tag tt={tt} at={3.4} x={1580} y={540} txt="400°F" size={90} col={K.goldL} />
    <Tag tt={tt} at={3.8} x={1580} y={640} txt="15 MINUTES" size={38} col={K.dim} />
  </>;
}}</Stage>;

// C15 · la balanza: el pack familiar de 3 libras contra una sola persona; el plato de la carne se hunde y aparece «sólo si te lo comés»
export const C15Scale: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  // balanza de cocina: el pack familiar (foto real) cae con peso y hunde su plato; el plato de una cena (foto real) sube y se balancea
  const fall = eIn(tt, r(h, 0) - 0.5, r(h, 0) + 0.05), hit = phys(tt, r(h, 0) + 0.05, 3.0, 0.3), tip = 15 * cl(hit) + 1.5 * Math.sin(tt * 1.3) * cl(hit);
  const pan = (side: number, child: React.ReactNode) => <div style={{ position: "absolute", left: side * 430 - 170, top: 0, transform: `rotate(${tip}deg)`, transformOrigin: "170px 0" }}>
    <div style={{ position: "absolute", left: 168, top: 0, width: 4, height: 220, background: "#b89a50" }} />
    <div style={{ position: "absolute", left: 0, top: 220, width: 340, height: 46, borderRadius: "0 0 170px 170px", background: "linear-gradient(180deg,#f1d68e,#8a6a2c)", boxShadow: "0 14px 24px rgba(0,0,0,.45)" }} />
    {child}
  </div>;
  return <>
    <Shadow x={960} y={890} w={420} k={1} />
    <div style={{ position: "absolute", left: 948, top: 340, width: 24, height: 520, background: "linear-gradient(90deg,#7a5a24,#e3c27a,#7a5a24)", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 840, top: 840, width: 240, height: 56, borderRadius: 16, background: "linear-gradient(180deg,#d9b25a,#6e5220)" }} />
    <div style={{ position: "absolute", left: 960, top: 360, transform: `rotate(${-tip}deg)` }}>
      <div style={{ position: "absolute", left: -470, top: -9, width: 940, height: 18, borderRadius: 9, background: "linear-gradient(180deg,#f1d68e,#8a6a2c)" }} />
      {pan(-1, <div style={{ position: "absolute", left: 30, top: 222 - 360 * (1 - fall) - 170, opacity: cl(fall * 4) }}><Photo id="f33" w={280} h={170} r={14} border={6} /></div>)}
      {pan(1, <div style={{ position: "absolute", left: 70, top: 222 - 150 }}><Photo id="f15" w={200} h={150} r={75} border={6} /></div>)}
    </div>
    <Tag tt={tt} at={r(h, 0) + 0.2} x={500} y={220} txt="CHEAPER BY THE POUND…" size={46} col={K.tx} />
    <Tag tt={tt} at={r(h, 1)} x={960} y={985} txt="ONLY IF YOU EAT IT" size={62} col={K.red} />
  </>;
}}</Stage>;

// C16 · dos sartenes en corte: la libra entera hierve en su agua gris (el nivel sube) y la medallita sola se dora
export const C16Pans: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  // dos sartenes de hierro vistas desde arriba con la FOTO real adentro: la libra entera hierve gris (burbujas que revientan, vapor) y la medallita se dora (chispas de aceite)
  const dur = h.out - h.at, k = eio(tt, 0.5, dur - 0.6);
  const pan = (x: number, ph: string, bub: boolean, at: number, lab: string, col: string) => <>
    <Shadow x={x} y={850} w={560} k={1} />
    <div style={{ position: "absolute", left: x + 230, top: 520, width: 300, height: 52, borderRadius: 26, background: "linear-gradient(180deg,#3a3734,#0e0d0c)", transform: "rotate(-18deg)" }} />
    <div style={{ position: "absolute", left: x - 290, top: 310, width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#3a3734,#0b0a09 70%)", boxShadow: "0 40px 80px rgba(0,0,0,.65)", padding: 34 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
        <Img src={img(ph)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.2 + 0.08 * k}) rotate(${6 * k}deg)`, filter: bub ? `saturate(${1 - 0.6 * k}) brightness(${1 - 0.1 * k})` : `saturate(${1 + 0.3 * k})` }} />
        {bub ? Array.from({ length: 16 }, (_, i) => { const ph2 = (tt * (0.8 + rnd(i) * 0.6) + rnd(i + 3)) % 1, s = 10 + 40 * ph2; return <div key={i} style={{ position: "absolute", left: `${12 + rnd(i + 1) * 70}%`, top: `${15 + rnd(i + 2) * 65}%`, width: s, height: s, borderRadius: "50%", border: "3px solid rgba(235,235,230,.7)", opacity: (1 - ph2) * cl(k * 3) }} />; })
          : Array.from({ length: 14 }, (_, i) => { const ph2 = (tt * 1.7 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: `${35 + rnd(i + 5) * 30 + (rnd(i + 8) - 0.5) * 60 * ph2}%`, top: `${45 - 40 * ph2}%`, width: 6, height: 6, borderRadius: "50%", background: "#ffe6a0", boxShadow: "0 0 10px #ffb040", opacity: (1 - ph2) * cl(k * 3) }} />; })}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 50px rgba(0,0,0,.7)" }} />
      </div>
    </div>
    {Array.from({ length: bub ? 6 : 3 }, (_, i) => { const ph2 = (tt * 0.45 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: x - 140 + i * 50, top: 320 - 200 * ph2, width: 120, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.16)", filter: "blur(22px)", opacity: Math.sin(ph2 * Math.PI) * cl(k * 2) }} />; })}
    <Tag tt={tt} at={at} x={x} y={960} txt={lab} size={50} col={col} />
  </>;
  return <>
    {pan(540, "f34", true, 1.2, "A WHOLE POUND · GRAY", K.red)}
    {pan(1380, "f17", false, 2.0, "ONE PATTY · BROWN", K.goldL)}
  </>;
}}</Stage>;

// C17 · el caño en corte: la grasa se pega en las paredes y lo tapa, sello del plomero $90; la flecha la manda a la lata
export const C17Pipe: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  // el caño en U en corte: gotas de grasa caen por la pileta y se pegan en la curva hasta taparla; sello del plomero al costado; a la derecha, la foto real: la grasa va a la lata
  const clog = eio(tt, 0.3, 2.6), can = eio(tt, r(h, 0), r(h, 0) + 1.0);
  return <>
    <div style={{ position: "absolute", left: 260, top: 250, width: 900, height: 620 }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 230, height: 40, borderRadius: 8, background: "linear-gradient(180deg,#e9edf0,#9aa0a6)" }} />
      <div style={{ position: "absolute", left: 100, top: 40, width: 150, height: 390, background: "linear-gradient(90deg,#8d939a,#e2e6ea 40%,#7a8087)" }} />
      <div style={{ position: "absolute", left: 100, top: 350, width: 600, height: 220, borderRadius: "0 0 110px 110px", border: "34px solid #b9bfc5", borderTop: "none" }} />
      <div style={{ position: "absolute", left: 550, top: 170, width: 150, height: 260, background: "linear-gradient(90deg,#8d939a,#e2e6ea 40%,#7a8087)" }} />
      {Array.from({ length: 7 }, (_, i) => { const a = 0.2 + i * 0.32, f = eIn(tt, a, a + 0.5); if (tt < a || f >= 1) return null; return <div key={i} style={{ position: "absolute", left: 160 + rnd(i) * 30, top: -40 + 470 * f, width: 26, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#f2e6c0", boxShadow: "inset -4px -4px 6px rgba(160,130,70,.5)" }} />; })}
      <div style={{ position: "absolute", left: 134, top: 350, width: 532, height: 186, borderRadius: "0 0 80px 80px", border: `${8 + 70 * clog}px solid rgba(238,226,190,.97)`, borderTop: "none", boxShadow: "inset 0 0 20px rgba(180,160,110,.6)" }} />
    </div>
    <div style={{ position: "absolute", left: 560, top: 140, transform: `rotate(-8deg) scale(${cl(phys(tt, 2.0, 6, 0.45))})`, border: `6px solid ${K.red}`, color: K.red, fontWeight: 900, fontSize: 72, padding: "6px 24px", borderRadius: 10, background: "rgba(20,10,8,.55)" }}>PLUMBER · $90</div>
    <div style={{ position: "absolute", left: 1270, top: 300 + 40 * (1 - cl(phys(tt, r(h, 0), 5, 0.5))), opacity: cl(can * 2), transform: `rotate(${3 - 2 * can}deg)` }}><Photo id="f35" w={480} h={480} r={18} border={8} /></div>
    <Tag tt={tt} at={r(h, 0) + 0.5} x={1510} y={880} txt="AN EMPTY CAN" size={54} col={K.goldL} />
  </>;
}}</Stage>;

// C18 · el reloj de pared y el termómetro: las agujas barren la tarde y el termómetro de la carne sube a la zona roja
export const C18Danger: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.5, 4.2), post = Math.max(0, tt - 4.2), hr = 12 + 5 * k + 0.35 * post, temp = lerp(38, 78, k) + 1.6 * post, dz = temp > 40;
  return <>
    <Head tt={tt} kick="MISTAKE NO. 5" title="On the counter all afternoon" col={K.red} />
    <div style={{ position: "absolute", left: 420, top: 300, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffdf6,#ece2cc)", boxShadow: "0 0 0 20px #8e1d2b, 0 0 0 26px #4d0c16, 0 40px 80px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 60, marginLeft: -30, marginTop: -26, textAlign: "center", fontFamily: SERIF, fontSize: 44, color: K.ink, transform: `rotate(${(i + 1) * 30}deg) translateY(-200px) rotate(${-(i + 1) * 30}deg)` }}>{i + 1}</div>)}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 14, height: 140, marginLeft: -7, marginTop: -140, borderRadius: 7, background: K.ink, transformOrigin: "50% 100%", transform: `rotate(${hr * 30}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 8, height: 200, marginLeft: -4, marginTop: -200, borderRadius: 4, background: K.wine, transformOrigin: "50% 100%", transform: `rotate(${k * 5 * 360 + post * 140}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 30, height: 30, margin: -15, borderRadius: "50%", background: K.ink }} />
    </div>
    {/* termómetro */}
    <div style={{ position: "absolute", left: 1220, top: 250, width: 110, height: 620, borderRadius: 55, background: "linear-gradient(90deg,#d8dde2,#fff 40%,#c2c8ce)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, height: 260, background: "rgba(224,74,54,.18)" }} />
      <div style={{ position: "absolute", left: 40, width: 30, bottom: 90, height: (temp - 30) * 8.5, borderRadius: 15, background: dz ? K.red : "#5aa0e0" }} />
      <div style={{ position: "absolute", left: 20, bottom: 30, width: 70, height: 70, borderRadius: "50%", background: dz ? K.red : "#5aa0e0" }} />
    </div>
    <div style={{ position: "absolute", left: 1380, top: 290, fontWeight: 900, fontSize: 56, color: K.red, opacity: cl((temp - 40) / 6), transform: `scale(${1 + 0.05 * Math.sin(tt * 4) * cl(post)})`, transformOrigin: "0 50%" }}>DANGER ZONE</div>
    <div style={{ position: "absolute", left: 1380, top: 350, fontWeight: 800, fontSize: 44, color: K.dim, opacity: cl((temp - 40) / 6) }}>40°F – 140°F</div>
    <div style={{ position: "absolute", left: 1380, top: 640, fontWeight: 900, fontSize: 110, color: dz ? K.red : K.ice }}>{Math.round(temp)}°F</div>
  </>;
}}</Stage>;

// C19 · el pizarrón de la escuela dominical: la tiza marca palitos de a cinco hasta 22 años
export const C19Tally: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  // el pizarrón: la tiza (que se ve, con su polvo) marca palitos de a cinco hasta 22; abajo se escribe la frase
  const n = Math.round(22 * eio(tt, 0.6, 3.6)), cur = Math.max(0, n - 1), g = Math.floor(cur / 5), j = cur % 5;
  const cx = 330 + 26 + 90 + g * 220 + (j < 4 ? j * 34 : 60), cy = 290 + 26 + (j < 4 ? 120 : 200), wr = tt > 3.6 && tt < 4.7, wx = 330 + 26 + 90 + 900 * eio(tt, 3.6, 4.6);
  return <>
    <div style={{ position: "absolute", left: 330, top: 290, width: 1260, height: 560, borderRadius: 10, background: "linear-gradient(180deg,#6b4a2a,#3e2a16)", padding: 26, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", background: "radial-gradient(ellipse at 40% 40%,#2f4a3a,#1c2e24)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 60%,rgba(255,255,255,.07),transparent 50%), radial-gradient(ellipse at 75% 30%,rgba(255,255,255,.05),transparent 40%)" }} />
        {Array.from({ length: n }, (_, i) => {
          const g2 = Math.floor(i / 5), j2 = i % 5, x = 90 + g2 * 220 + (j2 < 4 ? j2 * 34 : -20), y = 110;
          return j2 < 4 ? <div key={i} style={{ position: "absolute", left: x, top: y + rnd(i) * 10, width: 10, height: 170, borderRadius: 5, background: "rgba(245,245,235,.92)", transform: `rotate(${(rnd(i + 5) - 0.5) * 8}deg)`, filter: "blur(.5px)" }} />
            : <div key={i} style={{ position: "absolute", left: x, top: y + 80, width: 170, height: 10, borderRadius: 5, background: "rgba(245,245,235,.92)", transform: "rotate(-28deg)" }} />;
        })}
        <div style={{ position: "absolute", left: 90, top: 350, fontFamily: HAND, fontSize: 84, whiteSpace: "nowrap", color: "rgba(245,245,235,.92)", clipPath: `inset(0 ${(1 - eio(tt, 3.6, 4.6)) * 100}% 0 0)` }}>22 years of sloppy joes</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "linear-gradient(180deg,#5a3e22,#3a2814)" }} />
      </div>
    </div>
    {/* la tiza y su polvo */}
    <div style={{ position: "absolute", left: (wr ? wx : cx) - 10, top: (wr ? 290 + 26 + 420 : cy) - 60 + 6 * Math.sin(tt * 18), width: 26, height: 90, borderRadius: 6, background: "linear-gradient(90deg,#e8e6dc,#ffffff,#d6d3c6)", transform: "rotate(28deg)", boxShadow: "0 10px 16px rgba(0,0,0,.4)", opacity: cl((tt - 0.4) * 4) }} />
    {Array.from({ length: 10 }, (_, i) => { const ph2 = (tt * 1.3 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: (wr ? wx : cx) + (rnd(i) - 0.5) * 40, top: (wr ? 290 + 26 + 440 : cy) + 60 * ph2, width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,250,.6)", opacity: (1 - ph2) * cl((tt - 0.6) * 3) }} />; })}
  </>;
}}</Stage>;

// C20 · las cucharas de medir: cinco cucharas en fila se inclinan de a una y cada chorro tiñe la salsa en la sartén
export const C20Spoons: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  // de a UNA: cada cuchara entra grande, se inclina sobre la sartén y su chorro espeso tiñe la salsa; el nombre del ingrediente es uno solo y grande; las usadas quedan apoyadas en la mesa
  const ing: [string, string][] = [["2 TBSP KETCHUP", "#c4281c"], ["1 TSP MUSTARD", "#e0b81c"], ["1 TSP BROWN SUGAR", "#8a5a2a"], ["A SPLASH OF WORCESTERSHIRE", "#3a1e0e"], ["2 TBSP WATER", "#bfe2f0"]];
  const dur = h.out - h.at, st = Math.max(0.65, (dur - 1.2) / 5), cur = Math.min(4, Math.max(0, Math.floor((tt - 0.3) / st)));
  const doneN = ing.filter((_, i) => tt > 0.3 + i * st + st * 0.7).length;
  const sauce = ["#7a4a30", "#a3402c", "#a8502a", "#9a4a26", "#8a3a22", "#9c3f24"][doneN];
  const a = 0.3 + cur * st, inn = eio(tt, a, a + st * 0.3), tip = eio(tt, a + st * 0.25, a + st * 0.5), out = eio(tt, a + st * 0.75, a + st);
  const [lab, col] = ing[cur];
  return <>
    <div style={{ position: "absolute", left: 960 - 380, top: 640, width: 760, height: 250, borderRadius: "50%", background: "radial-gradient(ellipse,#2a2826,#050505)", boxShadow: "0 40px 70px rgba(0,0,0,.65)", padding: 34 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(ellipse at ${45 + 5 * Math.sin(tt)}% 40%, ${sauce}, #3a160a)`, boxShadow: "inset 0 0 30px rgba(0,0,0,.6)" }} />
    </div>
    <div style={{ position: "absolute", left: 960 + 330, top: 700, width: 340, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#3a3734,#0e0d0c)", transform: "rotate(-10deg)" }} />
    {/* la cuchara actual, grande */}
    <div style={{ position: "absolute", left: lerp(1500, 860, inn) - 130 + 380 * out, top: lerp(260, 400, inn) - 60 * out, transform: `rotate(${-10 - 55 * tip + 50 * out}deg)`, transformOrigin: "20% 50%", opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 230, height: 140, borderRadius: "50%", background: "linear-gradient(180deg,#f4f6f8,#9aa0a6)", boxShadow: "inset 0 14px 20px rgba(0,0,0,.25), 0 20px 30px rgba(0,0,0,.4)" }}><div style={{ position: "absolute", left: 26, top: 22, right: 26, bottom: 32, borderRadius: "50%", background: col, transform: `scaleY(${1 - 0.8 * tip})` }} /></div>
      <div style={{ position: "absolute", left: 210, top: 55, width: 300, height: 30, borderRadius: 15, background: "linear-gradient(180deg,#eef1f3,#8a9096)" }} />
    </div>
    {tip > 0.3 && out < 0.5 && <div style={{ position: "absolute", left: 905, top: 470, width: 26 * (1 - out * 2), height: 290, borderRadius: 13, background: `linear-gradient(180deg, ${col}, ${col}cc)` }} />}
    <div key={cur} style={{ position: "absolute", left: 960, top: 210, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * inn})`, opacity: inn * (1 - out), fontWeight: 900, fontSize: 64, letterSpacing: 2, color: K.tx, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.65)" }}>{lab}</div>
  </>;
}}</Stage>;

// C21 · 2.132 viernes: una grilla de cuadraditos (41 años × 52 viernes) se llena; la foto del casamiento en el rincón
export const C21Fridays: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="night">{(tt) => {
  const k = eIn(tt, 0.6, 4.2), N = 41 * 52, on = Math.round(N * k);
  return <>
    <Head tt={tt} kick="JUNE 11, 1965 · A FRIDAY" title="Every Friday, meatloaf" />
    <div style={{ position: "absolute", left: 110, top: 300, transform: `rotate(-6deg) scale(${0.6 + 0.4 * cl(phys(tt, 0.2, 5, 0.5))})` }}><Photo id={h.bg} w={330} h={420} border={12} r={4} /></div>
    <div style={{ position: "absolute", left: 560, top: 260, width: 52 * 23, display: "flex", flexWrap: "wrap", gap: 3 }}>
      {Array.from({ length: N }, (_, i) => <div key={i} style={{ width: 20, height: 6, borderRadius: 2, background: i < on ? (i === on - 1 ? "#fff" : K.gold) : "rgba(255,255,255,.07)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 560, top: 930, fontWeight: 900, fontSize: 64, color: K.goldL }}>{on.toLocaleString("en-US")} <span style={{ fontSize: 34, color: K.dim, letterSpacing: 3 }}>FRIDAYS · 41 YEARS</span></div>
  </>;
}}</Stage>;

// C22 · la budinera que se parte en dos moldes de muffin: el pan de carne grande se divide y cae en dos huecos
export const C22Muffin: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  // el pan de carne entero baja a la tabla, el cuchillo lo parte por el medio y cada mitad cae con rebote en un hueco del molde de muffins; queda humeando
  const dur = h.out - h.at, land = phys(tt, 0.1, 5, 0.5), kn = eio(tt, 0.7, 1.2), s = eio(tt, 1.2, 1.9), dropk = phys(tt, 1.9, 6, 0.5);
  return <>
    <div style={{ position: "absolute", left: 960 - 470, top: 560, width: 940, height: 360, borderRadius: 30, background: "linear-gradient(180deg,#c7ccd1,#6f757b)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: "rotateX(40deg)", transformOrigin: "50% 100%" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + (i % 3) * 300, top: 26 + Math.floor(i / 3) * 165, width: 240, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%,#3d4146,#80868c 70%)", boxShadow: "inset 0 14px 20px rgba(0,0,0,.6)" }} />)}
    </div>
    {[-1, 1].map((sd) => {
      const x = 960 + sd * lerp(4, 300, s) + sd * 130 * (1 - s) * 0, y = lerp(lerp(-200, 380, cl(land)), 640, cl(dropk)), w = lerp(250, 230, s);
      return <React.Fragment key={sd}>
        <Shadow x={x + sd * (s < 0.01 ? 125 : 0)} y={y + 110} w={w * lerp(0.7, 1, cl(dropk))} k={lerp(0.4, 1, cl(dropk))} />
        <div style={{ position: "absolute", left: sd < 0 ? x - w : x, top: y - 80, width: w, height: 150, borderRadius: sd < 0 ? `${lerp(22, 80, s)}px ${lerp(4, 80, s)}px ${lerp(4, 80, s)}px ${lerp(22, 80, s)}px` : `${lerp(4, 80, s)}px ${lerp(22, 80, s)}px ${lerp(22, 80, s)}px ${lerp(4, 80, s)}px`, background: "linear-gradient(180deg,#6a1c10,#8a2c18 30%,#7a4a2a 45%,#5a3018)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 14px 10px rgba(255,120,90,.25)" }} />
      </React.Fragment>;
    })}
    <div style={{ position: "absolute", left: 960 - 20, top: lerp(-120, 300, kn) - 260 * eio(tt, 1.3, 1.8), width: 40, height: 300, borderRadius: "4px 4px 20px 20px", background: "linear-gradient(90deg,#9aa0a6,#f4f6f8 40%,#b9bfc5)", boxShadow: "0 10px 20px rgba(0,0,0,.4)", opacity: 1 - eio(tt, 1.6, 1.9) }} />
    {Array.from({ length: 6 }, (_, i) => { const ph2 = (tt * 0.5 + i / 6) % 1, sd = i % 2 ? 1 : -1; return <div key={i} style={{ position: "absolute", left: 960 + sd * 300 - 60 + (rnd(i) - 0.5) * 80, top: 520 - 220 * ph2, width: 110, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.16)", filter: "blur(20px)", opacity: Math.sin(ph2 * Math.PI) * cl((tt - 2.2) * 2) }} />; })}
    <Tag tt={tt} at={2.4} x={960} y={970} txt="TWO LITTLE MEATLOAVES" size={56} col={K.goldL} />
  </>;
}}</Stage>;

// C23 · la taza que aplasta: de perfil, la base de la taza baja sobre la bolsita y la bola se vuelve medallón (squash con peso)
export const C23Mug: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  // de perfil sobre la mesada: la taza de la iglesia baja con peso, la bola en su bolsa se aplasta (squash con rebote) y la taza se va: queda el medallón parejo
  const dur = h.out - h.at, p = eio(tt, 0.6, 1.3) * (1 - eio(tt, 2.4, 3.0)), sq = cl(phys(tt, 1.0, 7, 0.35)), th = lerp(170, 70, sq);
  return <>
    <div style={{ position: "absolute", left: 300, top: 820, width: 1320, height: 34, borderRadius: 6, background: "linear-gradient(180deg,#f0d34a,#b89a2a)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <Shadow x={960} y={830} w={lerp(320, 640, sq)} k={1} />
    <div style={{ position: "absolute", left: 960 - lerp(160, 320, sq), top: 820 - th, width: lerp(320, 640, sq), height: th, borderRadius: lerp(90, 36, sq), background: "linear-gradient(160deg,rgba(255,255,255,.6),rgba(220,230,240,.35))", border: "3px solid rgba(255,255,255,.65)" }}>
      <div style={{ position: "absolute", inset: 12, borderRadius: lerp(80, 28, sq), background: "radial-gradient(ellipse at 40% 35%,#e59a9a,#a84a4e 60%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 80, left: `${-20 + 140 * ((tt * 0.25) % 1)}%`, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 960 - 170, top: lerp(180, 820 - th - 320, p) - 30 * eio(tt, 2.4, 3.0), width: 340, height: 320, opacity: 1 - eio(tt, 2.6, 3.0) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 340, height: 320, borderRadius: "16px 16px 40px 40px", background: "linear-gradient(90deg,#c9b38a,#fbf2dc 35%,#e7d6b0 60%,#a88e62)", boxShadow: "0 24px 44px rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", left: 318, top: 60, width: 130, height: 160, borderRadius: "0 75px 75px 0", border: "30px solid #e3cfa6", borderLeft: "none" }} />
      <div style={{ position: "absolute", left: 40, top: 100, fontFamily: SERIF, fontSize: 56, color: K.wine }}>Zion UMC</div>
    </div>
    <Tag tt={tt} at={2.9} x={960} y={600} txt="HANDS NEVER TOUCH IT" size={58} col={K.goldL} />
  </>;
}}</Stage>;

// C24 · la toalla de papel: una pasada sobre la sartén de hierro y detrás queda el brillo curado — sin jabón
export const C24Wipe: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  // la sartén de hierro desde arriba: la toalla entra desde afuera y barre en arco las migas (se las lleva), detrás queda el brillo; al final cae UNA gota de aceite y se abre en espejo
  const dur = h.out - h.at, k = eio(tt, 0.4, 2.4), ang = lerp(200, -20, k), x = 960 + 330 * Math.cos(ang * Math.PI / 180), y = 610 + 200 * Math.sin(ang * Math.PI / 180) - 600 * (1 - eio(tt, 0, 0.5)) - 500 * eio(tt, 2.4, 2.9);
  const drop = eIn(tt, 2.7, 3.2), spread = eio(tt, 3.2, dur - 0.3);
  return <>
    <div style={{ position: "absolute", left: 960 + 400, top: 560, width: 380, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#3a3734,#0e0d0c)", transform: "rotate(-12deg)" }} />
    <div style={{ position: "absolute", left: 960 - 440, top: 330, width: 880, height: 560, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#3a3632,#1a1715 60%,#070605)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 26px #24211f", overflow: "hidden" }}>
      {Array.from({ length: 30 }, (_, i) => { const px = 100 + rnd(i) * 660, py = 100 + rnd(i + 9) * 340, a2 = Math.atan2(py - 280, px - 440) * 180 / Math.PI, gone = (a2 + 360) % 360 > ((ang + 360) % 360) && k > 0.05 ? 1 : 0; return <div key={i} style={{ position: "absolute", left: px, top: py, width: 20 + rnd(i + 2) * 30, height: 14, borderRadius: "50%", background: "#5a3a1a", opacity: k > 0.98 ? 0 : 0.9 * (1 - gone * k) }} />; })}
      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from ${ang + 90}deg at 50% 50%, rgba(255,240,210,.0) 0deg, rgba(255,240,210,${0.22 * k}) 40deg, rgba(255,255,255,0) 120deg)`, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: 440 - 260 * spread, top: 280 - 160 * spread, width: 520 * spread, height: 320 * spread, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%,rgba(255,236,190,.55),rgba(220,170,60,.18) 60%,transparent 72%)", opacity: tt > 3.2 ? 1 : 0 }} />
    </div>
    {drop < 1 && tt > 2.7 && <div style={{ position: "absolute", left: 960 - 14, top: lerp(120, 590, drop), width: 28, height: 38, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#fff6c8,#e0b040 60%,#a07010)", boxShadow: "0 0 16px rgba(255,200,80,.6)" }} />}
    <div style={{ position: "absolute", left: x - 130, top: y - 110, width: 260, height: 220, transform: `rotate(${ang - 90}deg)`, borderRadius: 18, backgroundColor: "#f7f4ee", backgroundImage: `radial-gradient(ellipse 60% 45% at 50% 70%, rgba(110,62,24,${0.75 * k}), transparent 70%), radial-gradient(circle, rgba(0,0,0,.07) 2px, transparent 2px)`, backgroundSize: "100% 100%, 16px 16px", boxShadow: "0 24px 40px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={3.3} x={960} y={970} txt="ONE DROP OF OIL · NO SOAP" size={52} col={K.goldL} />
  </>;
}}</Stage>;

// C25 · el mapa: la paprika vuela de Hungría y se tacha; el pin cae en Iowa — «la de Iowa»
export const C25Map: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fly = eio(tt, 0.6, 2.2), x = lerp(1500, 560, fly), y = 470 - Math.sin(fly * Math.PI) * 220, cross = cl((tt - 2.3) / 0.6), pin = phys(tt, 2.6, 6, 0.45);
  return <>
    <Head tt={tt} kick="NOT THE HUNGARIAN KIND" title="The Iowa kind" />
    <div style={{ position: "absolute", left: 240, top: 270, width: 1440, height: 600, borderRadius: 14, background: "linear-gradient(160deg,#f1e6c8,#dccb9e)", boxShadow: "0 40px 80px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 120, top: 160, width: 520, height: 300, background: "#c9b47c", borderRadius: "40% 30% 45% 35%", opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 280, top: 240, width: 130, height: 90, background: K.wine, borderRadius: 8, opacity: cl(pin * 2) * 0.85 }} />
      <div style={{ position: "absolute", left: 1120, top: 140, width: 240, height: 200, background: "#c9b47c", borderRadius: "35% 45% 40% 30%", opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 1180, top: 210, width: 90, height: 50, background: "#8a7a4e", borderRadius: 6 }} />
      <svg width={1440} height={600} style={{ position: "absolute", inset: 0 }}><path d={`M 1225 235 Q 820 ${60} 345 285`} stroke="#8e1d2b" strokeWidth={5} fill="none" strokeDasharray="14 12" strokeDashoffset={-tt * 30} opacity={0.6 * fly} /></svg>
      <div style={{ position: "absolute", left: 1150, top: 300, fontFamily: SERIF, fontSize: 40, color: "#5a4a2e" }}>Hungary</div>
      <div style={{ position: "absolute", left: 290, top: 350, fontFamily: SERIF, fontSize: 48, color: K.wine }}>Iowa</div>
    </div>
    {/* frasco de paprika volando */}
    <div style={{ position: "absolute", left: x - 50, top: y - 80, width: 100, height: 160, transform: `rotate(${fly * 360}deg)`, opacity: 1 - eIn(tt, 2.6, 3.0) }}>
      <div style={{ width: 100, height: 30, borderRadius: 6, background: "#8e1d2b" }} />
      <div style={{ width: 100, height: 130, borderRadius: "10px 10px 20px 20px", background: "linear-gradient(90deg,#c0361e,#e86a3a,#a02a14)" }} />
    </div>
    {/* Hungría tachada con una X roja de marcador, trazo por trazo */}
    {cross > 0 && [-32, 32].map((d, i) => <div key={i} style={{ position: "absolute", left: 1380, top: 590, width: 230 * cl(cross * 2 - i), height: 18, background: K.red, transformOrigin: "0 50%", transform: `translate(${i ? 0 : 0}px, ${i ? 120 : 0}px) rotate(${i ? -d : d}deg)`, borderRadius: 9, boxShadow: "0 3px 6px rgba(0,0,0,.3)" }} />)}
    <div style={{ position: "absolute", left: 590 - 30, top: 470 - 120 * (1 - cl(pin)), width: 60, height: 60, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: K.red, boxShadow: "0 10px 20px rgba(0,0,0,.4)", opacity: cl(pin * 3) }} />
    <Tag tt={tt} at={3.0} x={960} y={950} txt="MACARONI · BEEF · TOMATOES · ONE POT" size={38} col={K.goldL} />
  </>;
}}</Stage>;

// C26 · la olla en corte: los coditos secos caen al tomate, el líquido baja y los fideos se inflan
export const C26Pot: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const drop = cl((tt - 0.5) / 1.4), cook = eio(tt, 2.2, 4.6), lvl = lerp(250, 150, cook);
  return <>
    <Head tt={tt} kick="NO COLANDER" title="The pasta cooks in the sauce" />
    <div style={{ position: "absolute", left: 960 - 330, top: 420, width: 660, height: 440, borderRadius: "0 0 70px 70px", background: "linear-gradient(90deg,#6f757b,#e4e8ec 35%,#9aa0a6 60%,#5e646a)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, height: lvl + 100, borderRadius: "0 0 50px 50px", background: "linear-gradient(180deg,#c2381e,#8a2010)" }} />
      {Array.from({ length: 34 }, (_, i) => {
        const a = 0.5 + rnd(i) * 1.3, f = cl((tt - a) / 0.6), sz = lerp(1, 1.5, cook);
        if (tt < a) return null;
        const pc = cook > 0.5 ? "#f2d79a" : "#e3b955";
        return <svg key={i} width={64 * sz} height={50 * sz} viewBox="0 0 64 50" style={{ position: "absolute", left: 60 + rnd(i + 3) * 500, top: lerp(-120, 200 + rnd(i + 7) * (lvl), f), transform: `rotate(${rnd(i) * 360 + tt * 30}deg)`, filter: "drop-shadow(0 3px 3px rgba(60,10,0,.45))" }}>
          <path d="M10,40 C10,14 54,14 54,40" stroke={pc} strokeWidth={15} strokeLinecap="round" fill="none" />
          <path d="M14,34 C16,20 48,20 50,34" stroke="rgba(255,250,220,.6)" strokeWidth={3} strokeLinecap="round" fill="none" />
          <ellipse cx={54} cy={41} rx={6.5} ry={4} fill="#b88a3a" />
        </svg>;
      })}
    </div>
    <div style={{ position: "absolute", left: 960 - 350, top: 404, width: 700, height: 30, borderRadius: 14, background: "linear-gradient(180deg,#f4f6f8,#8a9096)" }} />
    <div style={{ position: "absolute", left: 1350, top: 470 }}><Odo tt={tt} a={2.2} b={4.6} v={10} dec={0} size={110} /></div>
    <Tag tt={tt} at={2.5} x={1480} y={640} txt="MINUTES · LID ON" size={46} col={K.dim} />
    <div style={{ position: "absolute", left: 960 - 300, top: 360, height: 30, width: 30 + 600 * (1 - lvl / 250), opacity: 0 }} />
  </>;
}}</Stage>;

// C27 · el bol de agua fría: el medallón congelado en su bolsa se descongela (la escarcha se va), el arco de 30 min se completa
export const C27Thaw: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="cold">{(tt) => {
  // la FOTO real del bol de agua fría con el medallón adentro; encima la escarcha se derrite gota a gota y un temporizador de cocina gira sus 30 minutos completos
  const dur = h.out - h.at, k = eio(tt, 0.5, dur - 0.5);
  return <>
    <div style={{ position: "absolute", left: 230, top: 250, transform: `rotate(-3deg) scale(${1 + 0.04 * k})` }}>
      <Photo id="f49" w={900} h={620} r={20} border={8} />
      <div style={{ position: "absolute", left: 8, top: 8, width: 900, height: 620, borderRadius: 20, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 70 }, (_, i) => { const gone = cl((k - rnd(i + 30) * 0.8) * 4); return <div key={i} style={{ position: "absolute", left: `${rnd(i) * 100}%`, top: `${rnd(i + 4) * 100 + 30 * gone}%`, width: 14 + rnd(i + 2) * 16, height: 14 + rnd(i + 2) * 16, background: "rgba(235,248,255,.85)", clipPath: gone > 0.2 ? "circle(40%)" : "polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)", opacity: 1 - gone }} />; })}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(220,240,255,${0.35 * (1 - k)}), rgba(220,240,255,${0.15 * (1 - k)}))` }} />
      </div>
    </div>
    {/* temporizador de cocina de cuerda: la perilla gira y la marca recorre los 30 min */}
    <div style={{ position: "absolute", left: 1290, top: 360, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ffffff,#d6dde3)", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 0 14px #9fb4c4" }}>
      <svg width={420} height={420} style={{ position: "absolute", inset: 0 }}>
        <path d={`M210 210 L210 40 A170 170 0 ${k > 0.5 ? 1 : 0} 1 ${210 + 170 * Math.sin(k * 2 * Math.PI)} ${210 - 170 * Math.cos(k * 2 * Math.PI)} Z`} fill="rgba(90,170,230,.35)" />
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={210 + 150 * Math.sin(i * Math.PI / 15)} y1={210 - 150 * Math.cos(i * Math.PI / 15)} x2={210 + (i % 5 ? 165 : 140) * Math.sin(i * Math.PI / 15)} y2={210 - (i % 5 ? 165 : 140) * Math.cos(i * Math.PI / 15)} stroke="#2a3a48" strokeWidth={i % 5 ? 3 : 6} />)}
        <line x1={210} y1={210} x2={210 + 130 * Math.sin(k * 2 * Math.PI)} y2={210 - 130 * Math.cos(k * 2 * Math.PI)} stroke={K.red} strokeWidth={10} strokeLinecap="round" />
        <circle cx={210} cy={210} r={26} fill="#2a3a48" />
      </svg>
    </div>
    <div style={{ position: "absolute", left: 1500, top: 830, transform: "translateX(-50%)", fontWeight: 900, fontSize: 96, color: K.tx, fontVariantNumeric: "tabular-nums" }}>{Math.round(30 * k)}<span style={{ fontSize: 44, color: K.dim }}> MIN</span></div>
    <Tag tt={tt} at={r(h, 0)} x={680} y={950} txt="COLD WATER, NOT HOT" size={56} col={K.ice} />
  </>;
}}</Stage>;

// C28 · la semana en CoverFlow: 7 tarjetas 9:16 con la foto de cada cena, en 3D con reflejo; avanza el día que se nombra
export const C28Week: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ph: string[] = h.imgs ?? [];
  const names = ["SALISBURY STEAK", "GRAVY ON TOAST", "STUFFED PEPPER", "SHEPHERD'S PIE", "HAROLD'S MEATLOAF", "SLOPPY JOE", "GOULASH"];
  const act = h.b.reduce((n: number, b: number, i: number) => (t >= b ? i : n), 0);
  const pos = act + 0 * tt;
  return <>
    <Head tt={tt} kick="ONE POUND · ONE WEEK" title="Monday to Sunday" />
    {names.map((nm, i) => {
      const d = i - pos, ad = Math.abs(d), x = 960 + d * 250 + Math.sign(d) * (ad > 0 ? 120 : 0), ry = -Math.sign(d) * Math.min(ad, 1) * 55, z = ad === 0 ? 120 : -160 - ad * 40;
      return <div key={i} style={{ position: "absolute", left: x - 150, top: 290, width: 300, height: 533, transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateY(${ry}deg)`, zIndex: 20 - ad, transition: "none" }}>
        <Photo id={ph[i]} w={300} h={533} r={20} z={1.12} dim={ad === 0 ? 0 : 0.45} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 545, height: 160, borderRadius: 20, overflow: "hidden", transform: "scaleY(-1)", opacity: 0.18, WebkitMaskImage: "linear-gradient(0deg,#000,transparent 70%)" } as React.CSSProperties}>{ph[i] && <Img src={img(ph[i])} style={{ width: "100%", height: 533, objectFit: "cover" }} />}</div>
        <div style={{ position: "absolute", left: 18, top: 18, background: K.wine, color: K.cream, fontWeight: 900, fontSize: 26, letterSpacing: 3, padding: "6px 14px", borderRadius: 8 }}>{DAYS[i]}</div>
        {ad === 0 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: SERIF, fontSize: 36, color: "#fff", textShadow: "0 4px 18px rgba(0,0,0,.9)" }}>{nm}</div>}
      </div>;
    })}
    <div style={{ position: "absolute", right: 120, top: 120, fontWeight: 900, fontSize: 40, color: K.dim }}>{act + 1}/7</div>
  </>;
}}</Stage>;

// C29 · el recibo del súper: la tira se imprime línea por línea y el total de la semana cae con el sello «NOTHING IN THE TRASH»
export const C29Receipt: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rows: [string, string][] = [["1 LB GROUND BEEF", "4.50"], ["ONION · POTATOES", "1.10"], ["MACARONI · TOMATOES", "0.80"], ["BREAD · BUNS", "0.60"]];
  const pr = eio(tt, 0.3, 2.6), st = phys(tt, r(h, 0), 6, 0.45);
  return <>
    <Head tt={tt} kick="THE WHOLE WEEK" title="Seven suppers, about $7" />
    <div style={{ position: "absolute", left: 960 - 260, top: 250, width: 520, height: 120 + 640 * pr, background: "linear-gradient(180deg,#fbfaf4,#efeadc)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", overflow: "hidden", fontFamily: "monospace", color: "#2a2a2a", padding: "30px 40px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),95% 100%,90% calc(100% - 14px),85% 100%,80% calc(100% - 14px),75% 100%,70% calc(100% - 14px),65% 100%,60% calc(100% - 14px),55% 100%,50% calc(100% - 14px),45% 100%,40% calc(100% - 14px),35% 100%,30% calc(100% - 14px),25% 100%,20% calc(100% - 14px),15% 100%,10% calc(100% - 14px),5% 100%,0 calc(100% - 14px))" }}>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 34 }}>HY-VEE · DES MOINES</div>
      <div style={{ textAlign: "center", fontSize: 22, marginBottom: 24 }}>- - - - - - - - - - - - - - -</div>
      {rows.map(([a, b], i) => <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, margin: "12px 0", opacity: cl((pr * 6 - i - 0.3) * 2) }}><span>{a}</span><span>{b}</span></div>)}
      <div style={{ borderTop: "3px dashed #555", margin: "20px 0", opacity: cl((pr * 6 - 4.3) * 2) }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 44, fontWeight: 900, opacity: cl((pr * 6 - 4.6) * 2) }}><span>7 SUPPERS</span><span>$7.00</span></div>
    </div>
    <div style={{ position: "absolute", left: 1260, top: 560, transform: `rotate(-14deg) scale(${lerp(1.6, 1, cl(st))})`, opacity: cl(st * 3), border: `7px solid ${K.green}`, color: K.green, fontWeight: 900, fontSize: 46, padding: "10px 22px", borderRadius: 12, textAlign: "center", lineHeight: 1.1 }}>NOTHING IN<br />THE TRASH</div>
  </>;
}}</Stage>;

// ───────────── v6 (ronda 3 del evaluador): el OBJETO es una foto real de la cocina de Loretta; la cámara viaja en curva hacia él,
// un elemento físico en código actúa sobre la foto y una sola palabra grande vive dentro de la escena (nunca arriba a la izquierda).
const FA: React.CSSProperties = { position: "absolute" };
type Fx = (tt: number, d: number) => React.ReactNode;   // d = duración del componente
const Foto: React.FC<CP & { id: string; fx: number; fy: number; z?: number; word: string; wx?: number; wy?: number; wa?: number; mode?: "iris" | "wipe" | "blinds" | "split" | "drop" | "rise"; fx2?: Fx }> = ({ t, h, id, fy, word, wa = 1.4, mode = "iris", fx2 }) => <Stage t={t} h={h} mode={mode} table={false}>{(tt) => {
  const d = h.out - h.at, k = eio(tt, 0, d), s = lerp(1.0, 1.1, k), pan = 0.6 * 960 * (s - 1) * (1 - 2 * k), oy = fy * 1080;
  const ca = phys(tt, 0.05, 6, 0.55), sweep = cl((tt - 0.6) / 2.2), CW = 1540, CH = 866, CX = (1920 - CW) / 2, CY = 34;
  const fs = Math.min(104, 1640 / (word.length * 0.6));
  return <>
    <Img src={img(id)} style={{ ...FA, left: -160, top: -90, width: 2240, height: 1260, objectFit: "cover", filter: "blur(34px) brightness(.42) saturate(1.15)", transform: `scale(${lerp(1.06, 1.0, k)})` }} />
    <div style={{ ...FA, left: CX, top: CY, width: CW, height: CH, transform: `translateY(${(1 - ca) * 60}px) rotate(${lerp(-1.1, 0, ca) + lerp(0, 0.35, k)}deg)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6), 0 6px 14px rgba(0,0,0,.45)", outline: "6px solid rgba(250,244,230,.92)" }}>
      <div style={{ ...FA, left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `translate(${(CW - 1920) / 2 + pan}px, ${(CH - 1080) / 2}px) scale(${s * CW / 1920 * 1.0})`, }}>
        <Img src={img(id)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        {fx2 && fx2(tt, d)}
      </div>
      <div style={{ ...FA, inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 140 - 40}%, rgba(255,246,220,.16) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)` }} />
    </div>
    <div style={{ ...FA, left: 960, top: CY + CH + (1080 - CY - CH) / 2 + 4, transform: `translate(-50%,-50%) translateY(${(1 - phys(tt, wa, 7, 0.5)) * 40}px) scale(${0.88 + 0.12 * phys(tt, wa, 7, 0.5)})`, opacity: cl((tt - wa) * 4), fontFamily: SERIF, fontWeight: 900, fontSize: fs, color: K.goldL, letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 5px 0 rgba(60,30,0,.55), 0 12px 30px rgba(0,0,0,.8)" }}>{word}</div>
  </>;
}}</Stage>;
// monedas que caen con rebote y se apilan
const Coins = (tt: number, a: number, x: number, y: number, n = 6): React.ReactNode => tt < -1e9 && Array.from({ length: n }, (_, i) => {
  const st = a + i * 0.18, dd = tt - st; if (dd < 0) return null;
  const T = 0.42, yy = dd < T ? lerp(-500, 0, (dd / T) ** 2) : -Math.abs(Math.sin((dd - T) * 12)) * 26 * Math.exp(-(dd - T) * 6);
  return <div key={i} style={{ ...FA, left: x + (i % 3) * 22 - 30, top: y + yy - i * 9, width: 118, height: 40, borderRadius: "50%", background: "linear-gradient(180deg,#f4f0e8,#a8a49a 60%,#6a665e)", boxShadow: "0 3px 0 #5a564e, 0 8px 10px rgba(0,0,0,.4)" }} />;
});
// vapor en volutas sobre la foto
const Vapor = (tt: number, x: number, y: number, w = 220, k = 1): React.ReactNode => Array.from({ length: 6 }, (_, i) => {
  const p = (tt * 0.42 + i / 6) % 1, sz = 70 + 120 * p;
  return <div key={i} style={{ ...FA, left: x - w / 2 + rnd(i) * w + Math.sin(tt * 1.3 + i) * 34 * p - sz / 2, top: y - p * 380 - sz / 2, width: sz, height: sz * 1.3, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.4),transparent 68%)", filter: "blur(9px)", opacity: k * Math.sin(p * Math.PI) }} />;
});
// granos / partículas que caen desde un punto
const Lluvia = (tt: number, a: number, x: number, y: number, h0: number, col: string, n = 40, sz = 9): React.ReactNode => Array.from({ length: n }, (_, i) => {
  if (tt < a) return null;
  const p = ((tt - a) * 1.1 + rnd(i)) % 1;
  return <div key={i} style={{ ...FA, left: x + (rnd(i + 5) - 0.5) * 40 * (1 + p), top: y + p * p * h0, width: sz, height: sz, borderRadius: "40%", background: col, transform: `rotate(${i * 50}deg)`, opacity: 1 - p * 0.6 }} />;
});
// aro de cuenta regresiva alrededor de un objeto de la foto
const Aro = (tt: number, a: number, b: number, x: number, y: number, r0: number, col = "#f8dda4"): React.ReactNode => { if (tt > -1) return null;
  const p = 1 - eio(tt, a, b), C = 2 * Math.PI * r0;
  return <svg width={r0 * 2 + 40} height={r0 * 2 + 40} style={{ ...FA, left: x - r0 - 20, top: y - r0 - 20, transform: "rotate(-90deg)", opacity: cl((tt - a + 0.3) * 4) }}><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={16} /><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke={col} strokeWidth={12} strokeDasharray={`${C * p} ${C}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>;
};
// destello que pulsa sobre un punto de la foto
const Pulso = (tt: number, a: number, x: number, y: number, col = "rgba(255,240,190,.9)"): React.ReactNode => tt < -1e9 && tt > a && [0, 1].map((i) => { const p = ((tt - a) * 0.8 + i * 0.5) % 1; return <div key={i} style={{ ...FA, left: x - 30 - p * 120, top: y - 30 - p * 120, width: 60 + p * 240, height: 60 + p * 240, borderRadius: "50%", border: `6px solid ${col}`, opacity: 1 - p }} />; });
// contador de rodillos dentro de la escena
const Rodillo: React.FC<{ tt: number; d: number; a: number; b: number; v: number; x: number; y: number; pre?: string; dec?: number; size?: number }> = ({ tt, d, a, b, v, x, y, pre, dec = 0, size = 120 }) => tt < -1e9 && <div style={{ ...FA, left: x, top: y, opacity: 1 - cl((tt - d + 0.45) * 3), transform: `translate(-50%,-50%) scale(${phys(tt, a - 0.3, 7, 0.5)})` }}><Odo tt={tt} a={a} b={b} v={v} pre={pre} dec={dec} size={size} /></div>;

export const K01: React.FC<CP> = (p) => <Foto {...p} id="k01" fx={0.27} fy={0.5} word="$4.50 IN THE TRASH" wx={960} wy={180} fx2={(tt) => Coins(tt, 1.2, 380, 880, 9)} />;
export const K02: React.FC<CP> = (p) => <Foto {...p} id="k02" fx={0.55} fy={0.5} word="7 × 2.3 OZ" wy={950} mode="wipe" fx2={(tt) => [0, 1, 2, 3, 4, 5, 6].map((i) => Pulso(tt, 1.0 + i * 0.35, 1020 + i * 60, 470))} />;
export const K03: React.FC<CP> = (p) => <Foto {...p} id="k03" fx={0.45} fy={0.5} word="A WEEK OF SUPPERS" wy={950} mode="rise" fx2={(tt) => Lluvia(tt, 0.3, 860, 140, 700, "rgba(230,245,255,.85)", 46, 7)} />;
export const K04: React.FC<CP> = (p) => <Foto {...p} id="k04" fx={0.5} fy={0.42} z={1.3} word="35¢" wx={960} wy={950} wa={1.3} mode="blinds" fx2={(tt) => Coins(tt, 1.6, 1200, 800, 2)} />;
export const K05: React.FC<CP> = (p) => <Foto {...p} id="k05" fx={0.55} fy={0.5} word="DON'T TOUCH IT" wy={950} fx2={(tt, d) => <>{Vapor(tt, 920, 400, 260)}{Aro(tt, 0.6, d - 0.4, 1775, 285, 90)}</>} />;
export const K06: React.FC<CP> = (p) => <Foto {...p} id="k06" fx={0.6} fy={0.45} z={1.6} word="THAT'S SUPPER" wx={960} wy={950} mode="iris" fx2={(tt) => Pulso(tt, 1.4, 1150, 470)} />;
export const K07: React.FC<CP> = (p) => <><Foto {...p} id="k07" fx={0.42} fy={0.55} z={1.25} word="$1.10 A PLATE" wx={960} wy={950} /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={1.0} b={3.4} v={1.1} pre="$" dec={2} x={1420} y={520} size={130} /></>;
export const K08: React.FC<CP> = (p) => <Foto {...p} id="k08" fx={0.6} fy={0.55} z={1.55} word="USS BREMERTON · 1954" wx={960} wy={950} mode="split" />;
export const K09: React.FC<CP> = (p) => <Foto {...p} id="k09" fx={0.48} fy={0.6} word="MORE PEPPER" wx={960} wy={950} mode="drop" fx2={(tt) => Lluvia(tt, 0.5, 790, 300, 380, "#1a1410", 60, 8)} />;
export const K10: React.FC<CP> = (p) => <><Foto {...p} id="k10" fx={0.47} fy={0.35} z={1.5} word="SHE WAS 60 IN 1974" wx={960} wy={950} mode="rise" fx2={(tt) => Pulso(tt, 1.0, 900, 330, "rgba(120,170,255,.9)")} /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.8} b={3.0} v={1974} x={460} y={900} size={110} /></>;
export const K11: React.FC<CP> = (p) => <Foto {...p} id="k11" fx={0.5} fy={0.5} word="TWO MINUTES" wy={950} mode="wipe" fx2={(tt, d) => <>{Vapor(tt, 960, 520, 300, 0.8)}{Aro(tt, 0.5, d - 0.4, 1385, 395, 70, "#7af0a0")}</>} />;
export const K12: React.FC<CP> = (p) => <><Foto {...p} id="k12" fx={0.78} fy={0.45} z={1.35} word="212 PEOPLE" wx={960} wy={950} mode="blinds" /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.6} b={3.6} v={212} x={600} y={380} size={150} /></>;
export const K13: React.FC<CP> = (p) => <Foto {...p} id="k13" fx={0.42} fy={0.68} z={1.7} word="FOUR HOTEL PANS" wx={960} wy={950} mode="drop" fx2={(tt) => Pulso(tt, 1.8, 760, 760)} />;
export const K14: React.FC<CP> = (p) => <Foto {...p} id="k14" fx={0.5} fy={0.5} z={1.5} word="LITTLE ROWS" wy={950} mode="iris" fx2={(tt) => Vapor(tt, 960, 560, 600, 0.6)} />;
export const K15: React.FC<CP> = (p) => <Foto {...p} id="k15" fx={0.38} fy={0.55} z={1.3} word="ONLY IF YOU EAT IT" wx={960} wy={180} mode="split" fx2={(tt) => Pulso(tt, 2.0, 1700, 930)} />;
export const K16: React.FC<CP> = (p) => <Foto {...p} id="k16" fx={0.62} fy={0.5} z={1.35} word="BROWN, NOT GRAY" wy={950} mode="wipe" fx2={(tt) => <>{Vapor(tt, 690, 420, 300, 1)}{Vapor(tt + 0.5, 1250, 430, 200, 0.5)}</>} />;
export const K17: React.FC<CP> = (p) => <Foto {...p} id="k17" fx={0.46} fy={0.55} z={1.4} word="NOT DOWN THE DRAIN" wx={960} wy={180} mode="rise" fx2={(tt) => Pulso(tt, 1.6, 1110, 830)} />;
export const K18: React.FC<CP> = (p) => <Foto {...p} id="k18" fx={0.62} fy={0.45} z={1.3} word="TWO HOURS, TOPS" wx={960} wy={950} mode="blinds" fx2={(tt, d) => Aro(tt, 0.5, d - 0.4, 1590, 345, 105, "#ff7a6a")} />;
export const K19: React.FC<CP> = (p) => <><Foto {...p} id="k19" fx={0.38} fy={0.42} z={1.35} word="22 YEARS" wx={960} wy={950} wa={2.0} mode="iris" /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.6} b={3.2} v={22} x={1520} y={430} size={170} /></>;
export const K20: React.FC<CP> = (p) => <Foto {...p} id="k20" fx={0.5} fy={0.72} z={1.45} word="THE SAUCE" wx={960} wy={180} mode="drop" fx2={(tt) => [0, 1, 2, 3, 4].map((i) => Pulso(tt, 0.8 + i * 0.5, 680 + i * 160, 790))} />;
export const K21: React.FC<CP> = (p) => <><Foto {...p} id="k21" fx={0.55} fy={0.5} z={1.3} word="JUNE 11, 1965" wx={960} wy={950} wa={2.2} mode="split" /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.6} b={3.6} v={2132} x={500} y={460} size={130} /></>;
export const K22: React.FC<CP> = (p) => <Foto {...p} id="k22" fx={0.42} fy={0.6} z={1.5} word="TWO LITTLE LOAVES" wy={950} mode="rise" fx2={(tt) => Vapor(tt, 800, 560, 360, 1)} />;
export const K23: React.FC<CP> = (p) => <Foto {...p} id="k23" fx={0.5} fy={0.62} z={1.4} word="HANDS NEVER TOUCH IT" wx={960} wy={180} mode="wipe" fx2={(tt) => Lluvia(tt, 0.4, 960, 760, 120, "rgba(240,250,255,.8)", 24, 6)} />;
export const K24: React.FC<CP> = (p) => <Foto {...p} id="k24" fx={0.5} fy={0.58} z={1.45} word="NO SOAP" wx={960} wy={950} mode="iris" fx2={(tt) => { const s = cl((tt - 1.2) / 2); return <div style={{ ...FA, left: 760, top: 420, width: 700, height: 420, borderRadius: "50%", background: `linear-gradient(115deg,transparent ${s * 140 - 30}%,rgba(255,255,255,.55) ${s * 140 - 18}%,transparent ${s * 140 - 6}%)`, mixBlendMode: "screen" }} />; }} />;
export const K25: React.FC<CP> = (p) => <Foto {...p} id="k25" fx={0.38} fy={0.6} z={1.6} word="THE IOWA KIND" wx={960} wy={180} mode="blinds" fx2={(tt) => Pulso(tt, 1.2, 640, 600, "rgba(255,90,70,.95)")} />;
export const K26: React.FC<CP> = (p) => <Foto {...p} id="k26" fx={0.4} fy={0.58} z={1.45} word="ONE POT" wx={960} wy={180} mode="drop" fx2={(tt, d) => <>{Vapor(tt, 760, 450, 320, 1)}{Aro(tt, 0.6, d - 0.4, 1590, 820, 80)}</>} />;
export const K27: React.FC<CP> = (p) => <Foto {...p} id="k27" fx={0.45} fy={0.62} z={1.45} word="COLD, NOT HOT" wx={960} wy={180} mode="rise" fx2={(tt) => [0, 1, 2].map((i) => { const q = ((tt * 0.7 + i / 3) % 1); return <div key={i} style={{ ...FA, left: 900 - q * 260, top: 700 - q * 80, width: q * 520, height: q * 160, borderRadius: "50%", border: "4px solid rgba(220,240,255,.7)", opacity: 1 - q }} />; })} />;
export const K28: React.FC<CP> = (p) => <Foto {...p} id="k28" fx={0.5} fy={0.62} z={1.2} word="SEVEN SUPPERS" wx={960} wy={180} mode="split" fx2={(tt) => [0, 1, 2, 3, 4, 5, 6].map((i) => Pulso(tt, 0.6 + i * 0.45, 140 + i * 230 + 120, 790))} />;
export const K29: React.FC<CP> = (p) => <><Foto {...p} id="k29" fx={0.5} fy={0.55} z={1.35} word="$7.00 · NOTHING WASTED" wx={960} wy={180} wa={2.6} mode="iris" /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.6} b={2.8} v={7} pre="$" dec={2} x={500} y={440} size={140} /></>;
