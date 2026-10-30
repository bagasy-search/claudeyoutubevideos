// ole29d · componentes únicos 25-35 (del repollo que se achica a las monedas de la última noche)
import React from "react";
import { AMB, DIM, H, HAND, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Skillet, rnd } from "./heroes_d1";

// 25 · 13:03 · EL REPOLLO QUE SE ACHICA: la montaña de cintas crudas baja a la mitad; queda la silueta fantasma de lo que era
export const DShrink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = eio(tt, 1.4, 7.6);
  return <>
    <Skillet x={960} y={720} r={340} heat={0.45} />
    {/* la silueta de antes, punteada */}
    <div style={{ position: "absolute", left: 960, top: 690, width: 600, height: 420, transform: "translate(-50%,-100%)", borderRadius: "50% 50% 12px 12px", border: "4px dashed rgba(247,244,238,.35)", opacity: cl(c * 3) }} />
    {Array.from({ length: 70 }, (_, i) => { const hh = 420 * (1 - 0.5 * c), x = 960 + (rnd(i) - 0.5) * 560 * (1 - 0.1 * c), y = 690 - rnd(i, 2) * hh * (1 - Math.abs(rnd(i) - 0.5));
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 90, height: 16, borderRadius: 8, background: `hsl(${95 - 55 * c * rnd(i, 3)},${40 + 20 * c}%,${72 - 22 * c}%)`, transform: `translate(-50%,-50%) rotate(${rnd(i, 4) * 180}deg)`, boxShadow: "0 3px 5px rgba(0,0,0,.25)" }} />; })}
    <Tag tt={tt} at={1.0} x={400} y={300} txt="A QUARTER HEAD" col={TX} size={42} />
    <Tag tt={tt} at={7.0} x={1520} y={300} txt="HALF ITS SIZE · SWEET" col={AMB} size={42} />
  </>;
}}</Stage>;

// 26 · 13:51 · LA VOTACIÓN DE LA CUADRILLA: palitos de tiza en la pared del galpón; los de los fideos le ganan al rosbif
export const DTally: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const a = Math.floor(eio(tt, 0.8, 8.0) * 34.99), b = Math.floor(eio(tt, 0.8, 6.0) * 6.99);
  const Marks = ({ n, x, y }: { n: number; x: number; y: number }) => <>{Array.from({ length: n }, (_, i) => { const g = Math.floor(i / 5), k = i % 5;
    return <div key={i} style={{ position: "absolute", left: x + (g % 4) * 150 + (k === 4 ? 0 : k * 26), top: y + Math.floor(g / 4) * 130 + (k === 4 ? 40 : 0), width: k === 4 ? 120 : 7, height: k === 4 ? 7 : 100, background: "rgba(245,245,240,.88)", borderRadius: 3, transform: k === 4 ? "rotate(-28deg)" : `rotate(${(rnd(i) - 0.5) * 6}deg)`, filter: "blur(.4px)" }} />; })}</>;
  return <>
    {/* tablas de la pared, pizarrón de tiza */}
    <div style={{ position: "absolute", left: 120, top: 140, right: 120, bottom: 120, borderRadius: 10, background: "linear-gradient(180deg,#24302a,#1a221e)", boxShadow: "inset 0 0 0 20px #5a3e24, 0 50px 110px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 240, top: 210, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#f2efe6" }}>cabbage noodles</div>
    <div style={{ position: "absolute", left: 1190, top: 210, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "rgba(242,239,230,.6)" }}>roast beef</div>
    <div style={{ position: "absolute", left: 1120, top: 200, width: 5, height: 700, background: "rgba(242,239,230,.4)" }} />
    <Marks n={a} x={250} y={330} />
    <Marks n={b} x={1200} y={330} />
    <Tag tt={tt} at={8.2} x={620} y={920} txt="THE CREW VOTED" col={AMB} size={46} />
  </>;
}}</Stage>;

// 27 · 14:37 · EL PAN DURO: el pan viejo golpea la tabla como una piedra; después absorbe el huevo y se pone dorado
export const DBread: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const knock = Math.max(0, Math.sin(cl((tt - 0.6) / 2.4) * Math.PI * 3)), soak = eio(tt, 4.0, 7.4);
  return <>
    {/* la fuente con huevo batido */}
    <div style={{ position: "absolute", left: 960, top: 740, width: 900, height: 300, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%, #e8ecf0, #8b9299 70%)", boxShadow: "0 40px 80px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: `rgba(250,${200 - 40 * soak},70,${0.9 - 0.6 * soak})` }} />
    </div>
    {/* la rebanada */}
    <div style={{ position: "absolute", left: 960, top: 520 - knock * 60 + soak * 200, transform: `translate(-50%,-50%) rotate(${-8 + knock * 4}deg)` }}>
      <div style={{ width: 380, height: 330, borderRadius: "46% 46% 10px 10px", background: `radial-gradient(circle at 50% 55%, hsl(${42 - 4 * soak},${40 + 40 * soak}%,${84 - 10 * soak}%), hsl(${38 - 8 * soak},${40 + 40 * soak}%,${72 - 14 * soak}%) 70%)`, boxShadow: `inset 0 0 0 18px hsl(28,${50 + 20 * soak}%,${42 - 6 * soak}%), 0 30px 50px rgba(0,0,0,.45)` }}>
        {soak < 0.4 && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + rnd(i) * 260, top: 60 + rnd(i, 2) * 220, width: 60, height: 4, background: "rgba(120,80,40,.6)", transform: `rotate(${rnd(i, 3) * 180}deg)` }} />)}
      </div>
    </div>
    {knock > 0.9 && tt < 3 && <div style={{ position: "absolute", left: 1260, top: 420, fontFamily: MARK, fontSize: 90, color: TX, transform: `rotate(-8deg) scale(${knock})` }}>TOK</div>}
    <Tag tt={tt} at={1.0} x={420} y={300} txt="HARD AS A ROCK" col={DIM} size={40} />
    <Tag tt={tt} at={6.6} x={1500} y={300} txt="FRENCH TOAST" col={AMB} size={52} />
  </>;
}}</Stage>;

// 28 · 15:44 · LA CENA DE LIMPIEZA: los cuencos de cada día se inclinan desde arriba y vuelcan lo que quedó en una sola sartén
export const DCleanout: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const B = [["#c27a3a", "beans"], ["#c8402a", "tomato"], ["#a44a2a", "sausage"], ["#f2d488", "potato"], ["#9ac060", "cabbage"], ["#e8c070", "rice"]];
  return <>
    <Skillet x={960} y={780} r={300} heat={0.5}>
      {B.map(([c], i) => { const s = cl((tt - 1.6 - i * 1.0) / 0.6); return Array.from({ length: 12 }, (_, k) => <div key={i * 20 + k} style={{ position: "absolute", left: 80 + rnd(i * 12 + k) * 340, top: 80 + rnd(i * 12 + k, 2) * 340, width: 40, height: 34, borderRadius: 10, background: c, transform: `scale(${s})` }} />); })}
    </Skillet>
    {B.map(([c, w], i) => { const a = 0.6 + i * 1.0, tip = eio(tt, a, a + 0.8), x = 300 + i * 264;
      return <div key={i} style={{ position: "absolute", left: x, top: 230, transform: `translate(-50%,-50%) translateY(${(1 - phys(tt, 0.1 + i * 0.12, 6, 0.5)) * -300}px) rotate(${tip * (x < 960 ? 70 : -70)}deg)` }}>
        <div style={{ width: 170, height: 90, borderRadius: "10px 10px 85px 85px", background: "linear-gradient(180deg,#e8ecf0,#8b9299)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", position: "relative" }}><div style={{ position: "absolute", left: 14, right: 14, top: 8, height: 30, borderRadius: "50%", background: c, opacity: 1 - tip }} /></div>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: HAND, fontWeight: 700, fontSize: 36, color: DIM }}>day {i + 1}</div>
        {tip > 0.3 && tip < 1 && <div style={{ position: "absolute", left: 70, top: 60, width: 24, height: 300, background: `linear-gradient(180deg, ${c}, transparent)`, transform: `rotate(${x < 960 ? -55 : 55}deg)`, transformOrigin: "50% 0", opacity: 0.8, borderRadius: 12 }} />}
      </div>; })}
    <Tag tt={tt} at={7.6} x={960} y={1010} txt="THE CLEAN-OUT SUPPER" col={AMB} size={46} />
  </>;
}}</Stage>;

// 29 · 16:35 · LA CUENTA EN LA PIZARRA: la columna de tiza se suma sola; el total se subraya dos veces y se parte en 21
export const DChalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = [["breakfasts", "2.10"], ["dinners", "4.05"], ["suppers", "4.70"]];
  const sum = eio(tt, 4.0, 6.0) * 10.85, div = eio(tt, 7.4, 9.0);
  const w = (i: number) => `inset 0 0 0 0 transparent`; void w;
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 1200, height: 760, transform: `translate(-50%,-50%) rotate(-1deg) scale(${phys(tt, 0, 4.5, 0.6)})`, borderRadius: 10, background: "radial-gradient(ellipse at 50% 40%, #2c3a32, #1a241e)", boxShadow: "inset 0 0 0 24px #6a4a2a, 0 50px 120px rgba(0,0,0,.65)", padding: "70px 110px", fontFamily: HAND, color: "rgba(245,245,238,.92)" }}>
      {L.map(([a, b], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 76, clipPath: `inset(0 ${(1 - cl((tt - 0.6 - i * 1.0) / 0.9)) * 100}% 0 0)` }}><span>{a}</span><span>${b}</span></div>)}
      <div style={{ height: 6, background: "rgba(245,245,238,.8)", margin: "16px 0", width: `${cl((tt - 3.6) / 0.5) * 100}%` }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 96, fontWeight: 700, color: sum > 10 ? "#ffd88a" : undefined }}><span>the week</span><span>${sum.toFixed(2)}</span></div>
      {[0, 1].map((k) => <div key={k} style={{ height: 5, background: "#ffd88a", marginTop: 8, marginLeft: "auto", width: `${cl((tt - 6.2 - k * 0.4) / 0.4) * 40}%` }} />)}
      <div style={{ marginTop: 26, fontSize: 70, textAlign: "right", opacity: div, transform: `translateY(${(1 - div) * 30}px)` }}>÷ 21 = about 50¢</div>
    </div>
    {/* polvo de tiza */}
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.3 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 600 + rnd(i, 2) * 800, top: 300 + ph * 600, width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.5)", opacity: (1 - ph) * 0.6 }} />; })}
  </>;
}}</Stage>;

// 30 · 17:28 · LA BOLSA CONTRA LA CAJITA: la bolsa grande de arroz y la cajita «instant» se miden con la sombra de lo que rinden
export const DBagBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.4, 5, 0.5), m = eio(tt, 3.0, 7.6);
  return <>
    <div style={{ position: "absolute", left: 620, top: 860, transform: `translate(-50%,-100%) translateY(${(1 - s) * -400}px)` }}>
      <div style={{ width: 460, height: 560, borderRadius: "40% 40% 14% 14% / 20% 20% 8% 8%", background: "repeating-linear-gradient(90deg,#e6dcc4 0 8px,#d8ccb0 8px 16px)", boxShadow: "0 50px 100px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 64, color: "#5a4a2a" }}>RICE · 5 LB</div>
    </div>
    <div style={{ position: "absolute", left: 1320, top: 860, transform: `translate(-50%,-100%) translateY(${(1 - phys(tt, 0.9, 5, 0.5)) * -400}px)` }}>
      <div style={{ width: 200, height: 260, borderRadius: 10, background: "linear-gradient(160deg,#e8402a,#a81a10)", boxShadow: "0 40px 80px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: 900, fontSize: 30, color: "#fff4d8" }}>INSTANT<br />RICE</div>
    </div>
    {/* lo que rinde cada uno: pilas de cuencos que salen de abajo */}
    {Array.from({ length: Math.floor(m * 24) }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + (i % 8) * 80, top: 900 + Math.floor(i / 8) * 40, width: 70, height: 30, borderRadius: "0 0 35px 35px", background: "#c8ccd0" }} />)}
    {Array.from({ length: Math.floor(m * 4) }, (_, i) => <div key={i} style={{ position: "absolute", left: 1200 + i * 80, top: 900, width: 70, height: 30, borderRadius: "0 0 35px 35px", background: "#c8ccd0" }} />)}
    <Tag tt={tt} at={3.4} x={620} y={220} txt="$4.29 · 50 BOWLS" col={AMB} size={44} />
    <Tag tt={tt} at={4.4} x={1320} y={420} txt="$3.49 · 4 BOWLS" col={RED} size={40} />
  </>;
}}</Stage>;

// 31 · 18:01 · COCINAR UNA VEZ, COMER TRES: la sartén grande se parte en tres paneles que avanzan como días de calendario
export const DThree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sp = eio(tt, 2.2, 4.2);
  const X = [960 - 560 * sp, 960, 960 + 560 * sp], L = ["TONIGHT", "TOMORROW", "THE DAY AFTER"];
  return <>
    {X.map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 560, transform: `translate(-50%,-50%) scale(${1 - 0.38 * sp})` }}>
      <div style={{ position: "absolute", left: 0, top: 0 }}><Skillet x={0} y={0} r={300} heat={i === 0 ? 0.6 : 0.2}>
        {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: 60 + rnd(k + i * 30) * 400, top: 60 + rnd(k + i * 30, 2) * 400, width: 54, height: 48, borderRadius: 10, background: i === 0 ? "radial-gradient(circle at 35% 30%, #f5cf7a, #b8742a)" : i === 1 ? "radial-gradient(circle at 35% 30%, #c87a3a, #6a3414)" : "radial-gradient(circle at 35% 30%, #e8a060, #8a4a1a)", transform: `rotate(${rnd(k, 3) * 90}deg)` }} />)}
      </Skillet></div>
      <div style={{ position: "absolute", left: 0, top: 380, transform: "translateX(-50%)", fontWeight: 900, fontSize: 56, letterSpacing: 3, color: i === 0 ? AMB : TX, whiteSpace: "nowrap", opacity: cl(sp * 1.5) }}>{L[i]}</div>
    </div>)}
    <Tag tt={tt} at={0.6} x={960} y={130} txt="COOK ONCE · EAT THREE TIMES" col={AMB} size={50} />
  </>;
}}</Stage>;

// 32 · 19:19 · UN SOLO FUEGO: una fila de ingredientes espera turno y entra a la misma sartén, uno detrás del otro
export const DOneFire: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const Q = [["#f2d488", "POTATOES"], ["#e0b070", "ONIONS"], ["#fbf8f0", "EGGS"], ["#c27a3a", "BEANS"]];
  return <>
    <Skillet x={1340} y={640} r={280} heat={0.7}>{Q.map(([c], i) => { const s = cl((tt - 1.6 - i * 2.0) / 0.5), gone = cl((tt - 3.4 - i * 2.0) / 0.4);
      return <div key={i} style={{ position: "absolute", inset: 60, borderRadius: "50%", background: c, opacity: s * (1 - gone) * 0.9, boxShadow: "inset 0 0 40px rgba(0,0,0,.3)" }} />; })}</Skillet>
    {Q.map(([c, w], i) => { const go = eio(tt, 1.0 + i * 2.0, 1.8 + i * 2.0), x = 260 + (3 - i) * 0 + i * 190 * (1 - go) + 1080 * go - i * 0;
      return go < 1 ? <div key={i} style={{ position: "absolute", left: 220 + i * 210 + (1340 - 220 - i * 210) * go, top: 640 - Math.sin(go * Math.PI) * 220, transform: `translate(-50%,-50%) scale(${1 - 0.5 * go})` }}>
        <div style={{ width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${c}, rgba(0,0,0,.4))`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
        <div style={{ textAlign: "center", marginTop: 14, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: DIM }}>{w}</div>
      </div> : null; })}
    <Tag tt={tt} at={0.6} x={600} y={260} txt="ONE PAN · ONE FIRE" col={AMB} size={50} />
  </>;
}}</Stage>;

// 33 · 20:09 · POR CUATRO: un plato se multiplica en cuatro alrededor de la mesa y el precio de la semana se multiplica con él
export const DFamily: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sp = eio(tt, 1.4, 4.0), money = 10 + 30 * eio(tt, 4.2, 6.6);
  return <>
    {/* la mesa redonda vista desde arriba */}
    <div style={{ position: "absolute", left: 760, top: 560, width: 720, height: 720, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-radial-gradient(circle, #8a6440 0 18px, #7a5634 18px 36px)", boxShadow: "0 60px 120px rgba(0,0,0,.65)" }} />
    {[0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2 - Math.PI / 2, r = 230 * sp; return <div key={i} style={{ position: "absolute", left: 760 + Math.cos(a) * r, top: 560 + Math.sin(a) * r, transform: `translate(-50%,-50%) scale(${i === 0 ? 1 : sp})` }}>
      <div style={{ width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #eef1f4, #8b9299)", boxShadow: "inset 0 0 0 14px #b8bec5, 0 14px 30px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f2c46a, #9a5a1a)" }} /></div>
    </div>; })}
    <div style={{ position: "absolute", left: 1440, top: 460, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 170, color: AMB }}>${Math.round(money)}</div>
    <Tag tt={tt} at={4.6} x={1440} y={600} txt="A WEEK · FAMILY OF 4" col={TX} size={40} />
  </>;
}}</Stage>;

// 34 · 20:26 · DIEZ CONTRA DOCE PULGADAS: dos sartenes se superponen; el aro de dos pulgadas que sobra se ilumina
export const DSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const m = eio(tt, 1.6, 4.0), glow = eio(tt, 4.4, 5.6);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 }}><Skillet x={960 + 380 * (1 - m)} y={600} r={330} rot={-8} /></div>
    <div style={{ position: "absolute", left: 960 + 380 * (1 - m) - 330, top: 600 - 330, width: 660, height: 660, borderRadius: "50%", boxShadow: `inset 0 0 0 55px rgba(255,190,90,${0.45 * glow})`, transform: "rotate(-8deg)" }} />
    <div style={{ position: "absolute", left: 0, top: 0 }}><Skillet x={960 - 380 * (1 - m)} y={600} r={275} rot={12} /></div>
    <Tag tt={tt} at={0.8} x={960 - 380} y={200} txt='10"' col={TX} size={70} />
    <Tag tt={tt} at={1.2} x={960 + 380} y={200} txt='12"' col={AMB} size={70} />
    <Tag tt={tt} at={5.4} x={960} y={1000} txt="ONE PERSON · OR A FAMILY" col={DIM} size={36} />
  </>;
}}</Stage>;

// 35 · 21:34 · LO QUE QUEDÓ EN LA LATA: la última noche se cuentan las monedas una por una sobre la tabla, a la luz del farol
export const DCount: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 60% 55% at 50% 50%, #2a1e12, #060504 75%)">{(tt) => {
  const n = Math.floor(eio(tt, 1.2, 7.6) * 11.99), V = [25, 25, 10, 10, 10, 5, 5, 10, 5, 1, 1, 1];
  const tot = V.slice(0, n).reduce((a, b) => a + b, 0);
  return <>
    {/* el farol, luz que respira lento */}
    <div style={{ position: "absolute", left: 1500, top: 300, width: 600, height: 600, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(circle, rgba(255,190,100,${0.4 + 0.05 * Math.sin(tt * 1.2)}), transparent 65%)` }} />
    <div style={{ position: "absolute", left: 1470, top: 220, width: 60, height: 120, borderRadius: 12, background: "radial-gradient(circle at 50% 60%, #ffe0a0, #f0a040)", boxShadow: "0 0 0 8px #3a3a3e" }} />
    {/* la lata volcada */}
    <div style={{ position: "absolute", left: 420, top: 640, width: 260, height: 320, transform: "translate(-50%,-50%) rotate(-80deg)", borderRadius: 18, background: "linear-gradient(90deg,#5a5e62,#9aa0a6 35%,#5a5e62)" }} />
    {Array.from({ length: n }, (_, i) => { const s = phys(tt, 1.2 + i * 0.53, 8, 0.4), d = V[i]; return <div key={i} style={{ position: "absolute", left: 680 + (i % 6) * 120, top: 560 + Math.floor(i / 6) * 130 + (1 - s) * -80, width: d >= 25 ? 100 : d >= 10 ? 76 : d >= 5 ? 88 : 80, height: d >= 25 ? 100 : d >= 10 ? 76 : d >= 5 ? 88 : 80, transform: "translate(-50%,-50%)", borderRadius: "50%", background: d === 1 ? "radial-gradient(circle at 40% 35%, #f0a070, #8a4220)" : "radial-gradient(circle at 40% 35%, #f4f6f8, #8b9299)", boxShadow: "0 8px 16px rgba(0,0,0,.6)" }} />; })}
    <div style={{ position: "absolute", left: 1000, top: 300, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 150, color: AMB }}>${(tot / 100).toFixed(2)}</div>
    <Tag tt={tt} at={7.8} x={1000} y={420} txt="LEFT OVER" col={ICE} size={40} />
  </>;
}}</Stage>;
