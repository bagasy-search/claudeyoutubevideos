// ruth29b · 3ª vuelta (29-oct): props fotorrecortados sobre la mesa de Ruth; todo entero en cuadro, apoyado con sombra de contacto,
// la acción se ve desde el segundo 0,7 y avanza en cada still; manos que hacen; nada de cartel que reemplace la acción.
import React from "react";
import { Img, staticFile } from "remotion";
import { H, cl, eio, phys, HAND } from "./hkit";
import { P } from "./lib";
import { Odo, Splash, Sello } from "./obj";
import { S, D, rnd, bt, C, SER, land, swing, Dust, Drop, Cam, Mesa, Rings, Word, Glow, Luz, Prop, Puff } from "./pk";

const PLAINS = "linear-gradient(#c8b48a 0%,#ead6aa 44%,#6a5434 46%,#2a1c12 100%)";
const WALL = "repeating-linear-gradient(90deg,#3e2c1c 0 5px,#4e3824 5px 190px)";
const SOIL = "repeating-linear-gradient(178deg,rgba(0,0,0,.25) 0 6px,transparent 6px 34px), linear-gradient(#3a2818,#1a120a)";
// tablita de madera con texto quemado
const Tab: React.FC<{ x: number; y: number; txt: string; size?: number; r?: number; s?: number; sub?: string }> = ({ x, y, txt, size = 64, r = 0, s = 1, sub }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) rotate(${r}deg) scale(${s})`, transformOrigin: "50% 100%", padding: "12px 30px", background: "repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 40px), linear-gradient(160deg,#d0a870,#8a6236)", borderRadius: 8, boxShadow: "0 16px 22px rgba(0,0,0,.55), inset 0 2px 0 rgba(255,230,190,.45)", fontFamily: SER, fontWeight: 900, fontSize: size, color: "#2a170a", whiteSpace: "nowrap", textAlign: "center" }}>{txt}{sub && <div style={{ fontFamily: HAND, fontWeight: 400, fontSize: size * 0.45 }}>{sub}</div>}</div>;
const Shade: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.5 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.05, width: w, height: w * 0.1, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(0,0,0,${o}),transparent 70%)`, filter: "blur(3px)" }} />;
const Field: React.FC<{ y0: number; tt: number; v?: number }> = ({ y0, tt, v = 0 }) => <div style={{ position: "absolute", left: -300, top: y0, width: 2520, height: 1400 - y0, transform: "perspective(900px) rotateX(46deg)", transformOrigin: "50% 0", background: `repeating-linear-gradient(90deg,rgba(0,0,0,.28) 0 10px,rgba(255,220,170,.06) 10px 22px,transparent 22px 60px) ${-v * tt}px 0, linear-gradient(#4a3420,#1e140a)` }} />;

// m0 · UN tractor grande a ras del suelo abre una cinta ancha de tierra negra con terrones y polvo; otros cuatro escalonados al fondo entran con retraso
const HTractorLine: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#cdb88c 0%,#ecdcb4 46%,#a89a5a 47%,#7a7040 100%)" f={(tt) => {
  const d = D(h), x = 600 + 760 * eio(tt, 0, d);
  return <Cam tt={tt} d={d} z={0.04}>
    {[0, 1, 2, 3].map((k) => { const xk = -160 + (980 + 160 * k) * eio(tt, 0.2 + 0.5 * k, d), yk = 560 + k * 22, wk = 200 + 26 * k; return <React.Fragment key={k}>
      <div style={{ position: "absolute", left: 0, top: yk - 10, width: Math.max(0, xk - wk * 0.4), height: 12 + k * 3, background: "#22160c" }} />
      <Prop id="tractor_plow" x={xk} y={yk + 4} w={wk} sh={0.4} blur={1.6 - 0.3 * k} style={{ opacity: 0.85 }} /></React.Fragment>; })}
    <div style={{ position: "absolute", left: -40, top: 760, width: Math.max(0, x - 340), height: 320, background: "repeating-linear-gradient(176deg,rgba(255,220,170,.07) 0 4px,transparent 4px 30px), linear-gradient(#2a1c10,#120a04)", boxShadow: "inset 0 18px 20px rgba(0,0,0,.6)", clipPath: "polygon(0 6%,100% 0,100% 100%,0 100%)" }} />
    {Array.from({ length: 16 }, (_, k) => { const cx = 60 + k * 90 + (k % 3) * 20; return cx < x - 380 && <Prop key={k} id="clod" x={cx} y={830 + (k % 4) * 60} w={90 + (k % 3) * 40} r={k * 40} sh={0.6} />; })}
    {[0, 1, 2].map((k) => { const p = (tt * 0.9 + k / 3) % 1; return <Puff key={k} x={x - 420 - 220 * p} y={880 - 160 * p} r={60 + 90 * p} col="rgba(110,82,52,.9)" o={0.7 * (1 - p)} />; })}
    <Prop id="tractor_plow" x={x} y={1000 + 3 * Math.sin(tt * 18)} w={1000} />
  </Cam>;
}} />;

// m1 · la columna de polvo nace del surco: partículas que se enroscan, sube en bocanadas y el cielo se pone pardo hasta tapar el sol
const HBlackSky: C = ({ t, h }) => <S t={t} h={h} bg={PLAINS} f={(tt) => {
  const d = D(h), dk = eio(tt, 1.5, d - 0.5);
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <div style={{ position: "absolute", left: 1420, top: 140, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#fff6d8,#f0c870 70%)", boxShadow: "0 0 90px 40px rgba(255,220,150,.4)", opacity: 1 - 0.85 * dk }} />
    <Field y0={500} tt={tt} />
    {Array.from({ length: 7 }, (_, k) => { const g = phys(tt, 0.3 + k * 0.55, 5, 0.6), sw = 30 * Math.sin(tt * 1.4 + k); return g > 0.01 && <Prop key={k} id="dust_cloud" x={940 + sw + (k % 2 ? 60 : -60) * k * 0.4} y={800 - k * 95 * g} w={(320 + k * 130) * Math.min(1, g)} r={k * 9} sh={0} o={0.92} />; })}
    {Array.from({ length: 46 }, (_, k) => { const p = ((tt * 0.35 + k / 46) % 1), a = tt * 2.6 + k * 1.7, rr = 40 + 380 * p; return <div key={k} style={{ position: "absolute", left: 960 + rr * Math.cos(a), top: 800 - 640 * p + 40 * Math.sin(a), width: 6 + (k % 3) * 3, height: 6 + (k % 3) * 3, borderRadius: "50%", background: "rgba(80,56,32,.85)", opacity: 1 - p }} />; })}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(70,48,26,.85),rgba(40,26,12,.55))", opacity: 0.8 * dk }} />
  </Cam>;
}} />;

// m2 · el eco: dos mapas grandes espejados ocupando la mesa; el hilo rojo se tensa; el odómetro va de 0 a 20 años; la 2ª tarjeta cae con peso
const MAPCLIP = "polygon(6% 22%,22% 6%,48% 10%,70% 4%,94% 18%,98% 52%,86% 88%,58% 96%,30% 90%,8% 74%,2% 46%)";
const HDustEcho: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), str = eio(tt, 0.5, 1.6), yrs = Math.floor(20 * eio(tt, 1.6, d * 0.62) + 0.001), c2 = land(tt, d * 0.66, 600);
  const M = (x: number, ttl: string, k: number) => <div style={{ position: "absolute", left: x, top: 150, width: 780, height: 560, background: "linear-gradient(135deg,#efe2c0,#d8c49a)", boxShadow: "0 24px 30px rgba(0,0,0,.45)", backgroundImage: "linear-gradient(90deg,transparent 49.6%,rgba(0,0,0,.12) 50%,transparent 50.4%), linear-gradient(transparent 49.4%,rgba(0,0,0,.1) 50%,transparent 50.6%), linear-gradient(135deg,#efe2c0,#d8c49a)" }}>
    <div style={{ position: "absolute", left: 90, top: 90, width: 600, height: 380, clipPath: MAPCLIP, background: k ? "radial-gradient(circle at 60% 50%,#a07a48,#7a5a32)" : "radial-gradient(circle at 40% 50%,#b08a52,#7a5a32)", transform: k ? "scaleX(-1)" : undefined }} />
    <div style={{ position: "absolute", left: 0, top: 22, width: 780, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 46, color: "#3a2410", letterSpacing: 3 }}>{ttl}</div></div>;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={60} />
    {M(110, "GREAT PLAINS", 0)}{M(1030, "KAZAKH STEPPE", 1)}
    <Tab x={500} y={690} txt="1935" size={70} r={-4} />
    {c2.on && <Tab x={1420} y={690 + c2.dy} txt="1955" size={70} r={4} s={1 + 0.06 * c2.sq} />}
    {c2.on && c2.k > 0.95 && <Dust tt={tt} at={d * 0.66 + 0.12} x={1420} y={690} w={260} col="rgba(240,230,210,.7)" />}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M560 420 Q960 ${420 + 220 * (1 - str)} 1360 420`} stroke="#c41e1e" strokeWidth={9} fill="none" />{[560, 1360].map((x) => <circle key={x} cx={x} cy={420} r={18} fill="#d8d8d8" stroke="#555" strokeWidth={4} />)}</svg>
    <div style={{ position: "absolute", left: 760, top: 780, width: 400, height: 190, borderRadius: 22, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 22px 30px rgba(0,0,0,.6)" }} />
    <Odo x={960} y={875} v={yrs} n={2} size={130} />
    <div style={{ position: "absolute", left: 760, top: 976, width: 400, textAlign: "center", fontFamily: SER, fontWeight: 700, fontSize: 40, color: "#f3e6c6", textShadow: "0 3px 6px #000" }}>years apart</div>
  </Cam>;
}} />;

// m3 · la cola del pan: cada persona llega bajo su lámpara, que se enciende al llegar; sombras largas; la última frente a la balanza vacía
const HBreadLine: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#2a2018,#1a120c)" f={(tt) => {
  const d = D(h), ppl = ["person_coat", "person_man", "person_coat"], X = [420, 840, 1260], A = [0.2, 0.2 + (d - 2) / 3, 0.2 + 2 * (d - 2) / 3];
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 0, top: 940, width: 1920, height: 140, background: "linear-gradient(#5a4028,#2a1c10)" }} />
    <div style={{ position: "absolute", left: 1500, top: 760, width: 420, height: 320, background: "linear-gradient(#7a5434,#4a301a)", boxShadow: "inset 0 6px 0 #a07a50, 0 -10px 20px rgba(0,0,0,.4)" }} />
    <Prop id="empty_scale" x={1690} y={770} w={230} />
    {X.map((x, i) => { const p = eio(tt, A[i], A[i] + 1.3), lit = eio(tt, A[i] + 1.1, A[i] + 1.4), px = -200 + (x + 200) * p, bob = p < 1 ? 8 * Math.abs(Math.sin(tt * 7)) : 0; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 1, top: 0, width: 3, height: 130, background: "#222" }} />
      <div style={{ position: "absolute", left: x - 260, top: 230, width: 520, height: 720, background: "linear-gradient(rgba(255,230,170,.42),rgba(255,230,170,.04))", clipPath: "polygon(38% 0,62% 0,100% 100%,0 100%)", opacity: lit }} />
      <Glow x={x} y={940} r={260} o={0.6 * lit} />
      <Prop id="lamp_cone" x={x} y={240} w={250} sh={0} style={{ filter: `brightness(${0.55 + 0.6 * lit})` }} />
      {p > 0 && <><div style={{ position: "absolute", left: px, top: 970, width: 420, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse at 10% 50%,rgba(0,0,0,.6),transparent 70%)", transform: "skewX(-40deg)", opacity: 0.4 + 0.6 * lit }} />
        <Prop id={ppl[i]} x={px} y={985 - bob} w={i === 1 ? 300 : 250} sh={0} style={{ filter: `brightness(${0.45 + 0.6 * lit})` }} /></>}</React.Fragment>; })}
  </Cam>;
}} />;

// m4 · la muestra: el tubo centrado; el cuchillo baja por el costado y el corte abre la tierra negra con raíces finas que se ve al lado
const HSoilCore: C = ({ t, h }) => <S t={t} h={h} bg={PLAINS} f={(tt) => {
  const d = D(h), k = eio(tt, 0.3, 2.4), op = eio(tt, 0.6, 2.0);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={760} />
    <Prop id="soil_tube" x={620} y={1010} w={270} />
    <div style={{ position: "absolute", left: 620 + 520 * op - 300, top: 300, width: 600, height: 640, transform: `perspective(1400px) rotateY(${-40 * (1 - op)}deg)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 40px rgba(0,0,0,.55)", clipPath: `inset(0 0 ${100 - 100 * k}% 0)` }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#5a7a2a 0 6%,#16100a 6% 70%,#6a4e30 70%)" }} />
      <svg width={600} height={640} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 26 }, (_, j) => { const x = 20 + j * 22; return <path key={j} d={`M${x} 40 q${10 * Math.sin(j)} 120 ${-6 + 12 * rnd(j)} ${220 + 160 * rnd(j + 4)}`} stroke="rgba(220,200,160,.75)" strokeWidth={2 + (j % 3)} fill="none" />; })}</svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 640, background: "linear-gradient(90deg,rgba(255,255,255,.18),transparent 20%,transparent 80%,rgba(0,0,0,.3))" }} /></div>
    <Prop id="field_knife" x={720 + 30 * Math.sin(tt * 9) * (k < 1 ? 1 : 0)} y={360 + 620 * k} w={460} r={-70} sh={0} o={1 - eio(tt, 2.6, 3.0)} />
    {tt > 2.4 && <Tab x={1220} y={1040} txt="BLACK EARTH" size={56} r={-2} s={phys(tt, 2.4, 7, 0.5)} />}
  </Cam>;
}} />;

// m5 · el rebaño de papel con volumen cruza la pastura; atrás de cada animal el pasto vuelve a crecer en matas
const HHerdLoop: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#bcd0d8,#e8e2c8 44%,#8a7a4a 46%,#5a4a2a)" f={(tt) => {
  const d = D(h), sh = 240 * (tt / d), A = Array.from({ length: 7 }, (_, k) => ({ id: k % 2 ? "cow_black" : "sheep", x: 1580 - k * 215 + sh, y: 860 + (k % 2) * 40, w: k % 2 ? 290 : 240 })), last = A[6].x;
  return <Cam tt={tt} d={d} z={0.04}>
    {Array.from({ length: 30 }, (_, j) => { const x = 70 + j * 62, y = 880 + (j % 3) * 50, g = cl((last - x) / 260) * eio(tt, 0.1, 1.2); return g > 0.02 && <div key={j} style={{ position: "absolute", left: x - 30 * g, top: y - 70 * g, width: 60 * g, height: 70 * g, background: "radial-gradient(ellipse at 50% 100%,#6a9a3a,#3a6a22 70%,transparent 72%)", clipPath: "polygon(0 100%,10% 20%,25% 70%,40% 0,55% 60%,70% 10%,85% 70%,100% 100%)" }} />; })}
    {A.map((a, k) => { const b = 10 * Math.abs(Math.sin(tt * 5 + k)); return <Prop key={k} id={a.id} x={a.x} y={a.y - b} w={a.w} r={2 * Math.sin(tt * 5 + k)} />; })}
  </Cam>;
}} />;

// m6 · las velas en la repisa: cera derretida que gotea, humo que sube y el halo de cada una en la pared
const HCandles: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), Cs = [[560, 200], [900, 250], [1260, 180]];
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} />
    {Cs.map(([x, w], i) => { const hh = w * 1.38, top = 760 - hh, f = 0.85 + 0.15 * Math.sin(tt * 11 + i * 2) * Math.sin(tt * 7.3 + i); return <React.Fragment key={i}>
      <Glow x={x} y={top + 10} r={340 * f} o={0.9} col="255,190,110" />
      <Prop id="candle" x={x} y={760} w={w} sh={0} />
      {[0, 1].map((j) => { const p = ((tt * 0.22 + j * 0.5 + i * 0.3) % 1); return <div key={j} style={{ position: "absolute", left: x - w * 0.3 + j * w * 0.55, top: top + hh * 0.18 + hh * 0.6 * p, width: 12, height: 20 + 10 * p, borderRadius: "40% 40% 50% 50%", background: "linear-gradient(#fbf6ea,#e8dcc4)", boxShadow: "1px 2px 2px rgba(0,0,0,.3)" }} />; })}
      {Array.from({ length: 4 }, (_, j) => { const p = ((tt * 0.3 + j / 4 + i * 0.2) % 1); return <Puff key={j} x={x + 40 * Math.sin(p * 7 + i)} y={top - 30 - 360 * p} r={20 + 50 * p} col="rgba(200,195,190,.6)" o={0.5 * (1 - p)} />; })}</React.Fragment>; })}
    <div style={{ position: "absolute", left: 300, top: 760, width: 1320, height: 46, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 90px), linear-gradient(#8a6238,#4a2e16)", boxShadow: "0 22px 26px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,220,170,.35)" }} />
    <div style={{ position: "absolute", left: 330, top: 806, width: 1260, height: 40, background: "linear-gradient(rgba(0,0,0,.5),transparent)" }} />
  </Cam>;
}} />;

// m8 · la voz baja: el megáfono de chapa empuja ondas; la tarjeta de la cita se despega, se arruga en bola, rueda y queda aplastada
const HWhisper: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), g = 1.8, peel = eio(tt, g, g + 1.0), ball = tt > g + 1.0, fall = land(tt, g + 1.0, 420), roll = eio(tt, g + 1.6, g + 3.4), sm = eio(tt, d - 2.2, d - 1.6);
  const bx = 1380 + 180 * roll, by = 960 + (ball ? fall.dy : 0);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={880} />
    {[0, 1, 2, 3].map((k) => { const p = ((tt - 0.4) * 0.8 + k / 4) % 1; return tt > 0.4 && <div key={k} style={{ position: "absolute", left: 900 + 420 * p - 120, top: 600 - 260 * (0.3 + p), width: 240, height: 520 * (0.3 + p), border: "8px solid rgba(255,235,200,.55)", borderLeft: "none", borderTop: "none", borderBottom: "none", borderRadius: "0 50% 50% 0", opacity: 1 - p }} />; })}
    <Prop id="megaphone" x={600} y={930} w={640} flip />
    {!ball && <div style={{ position: "absolute", left: 1380, top: 430, width: 520, height: 320, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${-50 * peel}deg) rotateZ(${8 * Math.sin(tt * 9) * peel}deg) scale(${1 - 0.6 * peel})`, transformOrigin: "100% 0", background: "repeating-linear-gradient(180deg,transparent 0 46px,rgba(90,120,200,.3) 46px 48px), linear-gradient(#fbf6ea,#eee2c4)", boxShadow: "0 20px 26px rgba(0,0,0,.5)", padding: "40px 36px", boxSizing: "border-box", fontFamily: HAND, fontSize: 50, color: "#2a2018", lineHeight: 1.15 }}>
      “Plow the steppe and the wind will take it.”<div style={{ position: "absolute", left: 250, top: -20, width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff8a7a,#b3221a)" }} /></div>}
    {ball && <Prop id="paper_ball" x={bx} y={by} w={200} r={roll * 400} sh={fall.k} style={{ transform: `rotate(${roll * 400}deg) scale(${1 + 0.6 * sm},${1 - 0.55 * sm})`, transformOrigin: "50% 100%" }} />}
    {sm > 0 && sm < 1 && <Dust tt={tt} at={d - 2.0} x={bx} y={960} w={200} col="rgba(240,230,210,.7)" />}
    {tt > d - 2.4 && <Prop id="desk_bell" x={bx} y={960 - 700 * (1 - eio(tt, d - 2.4, d - 1.6)) - 120 * (1 - sm)} w={300} sh={sm} o={1} />}
  </Cam>;
}} />;

// m9 · el vagón verde grande en 3/4 frena con vapor; la puerta corre; valijas y acordeón caen de a uno; odómetro de voluntarios en primer plano
const HTrainCars: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8b890,#e8d8b0 50%,#8a7450 52%,#5a4630)" f={(tt) => {
  const d = D(h), br = eio(tt, 0, 1.6), x = 1000 + 700 * (1 - br), door = eio(tt, 1.7, 2.4), at = [2.4, 3.1, 3.8, 4.5], ids = ["suitcase", "accordion", "canvas_bag", "suitcase"], v = Math.min(300, 50 * Math.floor(eio(tt, 0.4, d - 1.0) * 6 + 0.001)) * 1000;
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 160px), linear-gradient(#b89a6a,#7a6040)" }} />
    <div style={{ position: "absolute", left: 0, top: 770, width: 1920, height: 18, background: "linear-gradient(#9a9a9a,#4a4a4a)" }} />
    <Prop id="train_car" x={x} y={790} w={1250} ry={-14} sh={0.6} />
    <div style={{ position: "absolute", left: x - 70, top: 520, width: 150, height: 210, background: "#0e0a06", boxShadow: "inset 0 0 30px #000", clipPath: `inset(0 ${100 - 100 * door}% 0 0)` }} />
    {Array.from({ length: 5 }, (_, k) => { const p = ((tt * 0.9 + k / 5) % 1); return br < 1 && <Puff key={k} x={x - 500 + k * 220 + 40 * p} y={770 - 120 * p} r={50 + 70 * p} col="rgba(240,240,240,.85)" o={0.8 * (1 - p) * (1 - br * 0.7)} />; })}
    {at.map((a, i) => <Drop key={i} tt={tt} at={a} id={ids[i]} x={760 + i * 210} y={1000} w={i === 1 ? 210 : 240} r={(i - 1.5) * 6} h={380} />)}
    <div style={{ position: "absolute", left: 60, top: 880, width: 600, height: 170, borderRadius: 20, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 22px 30px rgba(0,0,0,.6)" }} />
    <Odo x={360} y={965} v={v} n={6} size={110} />
  </Cam>;
}} />;

// m10 · la carpa en la nieve con el farolito adentro; el termómetro de vidrio baja de +20 a −40 y la escarcha sube por la lona hasta tapar la luz
const HTentCold: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#1a2030,#3a4660 50%,#c8d0dc 52%,#8a94a4)" f={(tt) => {
  const d = D(h), c = eio(tt, 0.3, d - 0.8), fr = eio(tt, 1.0, d - 0.4), T = Math.round(20 - 60 * c);
  return <Cam tt={tt} d={d} z={0.04}>
    {Array.from({ length: 60 }, (_, k) => { const p = (tt * 0.25 + k / 60) % 1; return <div key={k} style={{ position: "absolute", left: (k * 131) % 1920 + 40 * Math.sin(tt + k), top: -20 + 1100 * p, width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />; })}
    <Prop id="snow_pile" x={260} y={1000} w={520} sh={0} />
    <Glow x={830} y={830} r={260} o={1 - 0.85 * fr} col="255,190,90" />
    <Prop id="tent" x={830} y={960} w={960} />
    <Prop id="kerosene_lamp" x={830} y={930} w={80} sh={0} style={{ opacity: 1 - 0.7 * fr }} />
    <div style={{ position: "absolute", left: 350, top: 440, width: 960, height: 520, clipPath: "polygon(50% 0,100% 100%,0 100%)", background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0 2px,transparent 3px) 0 0/22px 22px, linear-gradient(rgba(230,240,255,.85),rgba(210,225,245,.7))", opacity: fr * 0.85, maskImage: `linear-gradient(to top, #000 ${100 * fr}%, transparent ${100 * fr + 10}%)`, WebkitMaskImage: `linear-gradient(to top, #000 ${100 * fr}%, transparent ${100 * fr + 10}%)` }} />
    <div style={{ position: "absolute", left: 1580, top: 260, width: 26, height: 760, background: "linear-gradient(90deg,#4a3420,#8a6a42,#4a3420)" }} />
    <div style={{ position: "absolute", left: 1500, top: 280, width: 190, height: 600, borderRadius: 20, background: "linear-gradient(90deg,#e8e8e8,#ffffff 40%,#c8c8c8)", boxShadow: "0 18px 24px rgba(0,0,0,.5)" }}>
      {[20, 0, -20, -40].map((v, k) => <div key={v} style={{ position: "absolute", left: 100, top: 40 + k * 150, fontFamily: SER, fontWeight: 900, fontSize: 40, color: "#2a2a2a" }}>{v > 0 ? "+" + v : v}<div style={{ position: "absolute", left: -40, top: 22, width: 30, height: 4, background: "#2a2a2a" }} /></div>)}
      <div style={{ position: "absolute", left: 40, top: 40, width: 22, height: 480, borderRadius: 11, background: "rgba(200,220,230,.6)", border: "3px solid #9aa" }} />
      <div style={{ position: "absolute", left: 43, top: 40 + 480 * (20 - T) / 60 + 22, width: 16, height: 480 - 480 * (20 - T) / 60, background: "#d01a1a", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 28, top: 510, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff6a5a,#a01010)" }} /></div>
  </Cam>;
}} />;

// m11 · el mapa grande: las chinches caen con su aguja y sombra; cada una con un banderín que sólo lleva el número de la granja
const PINS = [[520, 360, 7], [820, 520, 12], [1100, 380, 23], [1360, 560, 31], [700, 720, 48], [1180, 760, 56]];
const HFarmPins: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d - 1.2) / PINS.length;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={40} />
    <div style={{ position: "absolute", left: 170, top: 120, width: 1580, height: 860, backgroundImage: "linear-gradient(90deg,transparent 33%,rgba(0,0,0,.1) 33.2%,transparent 33.5%,transparent 66%,rgba(0,0,0,.1) 66.2%,transparent 66.5%), linear-gradient(transparent 49.5%,rgba(0,0,0,.12) 50%,transparent 50.5%), linear-gradient(135deg,#f0e4c4,#d8c49a)", boxShadow: "0 26px 34px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 160, top: 120, width: 1260, height: 640, clipPath: MAPCLIP, background: "repeating-linear-gradient(120deg,rgba(255,255,255,.08) 0 4px,transparent 4px 30px), radial-gradient(circle at 50% 50%,#c8a862,#9a7a42)" }} />
      <svg width={1580} height={860} style={{ position: "absolute", inset: 0 }}><path d="M200 600 C500 520 700 700 1000 620 S1300 520 1450 560" stroke="#4a7a9a" strokeWidth={10} fill="none" /></svg></div>
    {PINS.map(([x, y, n], i) => { const a = 0.4 + i * step, L = land(tt, a, 500, 10, 0.3), f = land(tt, a + 0.3, 140); return L.on && <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 10, top: y + 6, width: 50, height: 16, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.45),transparent 70%)", opacity: L.k }} />
      <div style={{ position: "absolute", left: x - 3, top: y - 60 + L.dy, width: 6, height: 66, background: "linear-gradient(90deg,#888,#eee,#777)" }} />
      <div style={{ position: "absolute", left: x - 22, top: y - 100 + L.dy, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#b3221a 60%,#5a0a06)", boxShadow: "0 8px 10px rgba(0,0,0,.5)" }} />
      {f.on && <div style={{ position: "absolute", left: x + 18, top: y - 200 + f.dy, transformOrigin: "0 100%", transform: `rotate(${swing(tt, a + 0.4, 10, 5, 1.4)}deg)` }}>
        <div style={{ width: 6, height: 120, background: "#6a4a2a", position: "absolute", left: 0, top: 0 }} />
        <div style={{ position: "absolute", left: 6, top: 0, width: 130, height: 76, background: "linear-gradient(#c8302a,#901a14)", clipPath: "polygon(0 0,100% 50%,0 100%)", boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />
        <div style={{ position: "absolute", left: 14, top: 12, fontFamily: SER, fontWeight: 900, fontSize: 44, color: "#fff4d8" }}>{n}</div></div>}</React.Fragment>; })}
  </Cam>;
}} />;

// m12 · año por año: tres macetas grandes entran con rebote; 1954 brota, 1955 mata seca, 1956 la espiga dorada enorme se dobla y suelta granos
const HTearCalendar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), X = [470, 960, 1450], A = [0.2, 0.6, 1.0], Y = ["1954", "1955", "1956"], g = [phys(tt, 1.2, 6, 0.5), phys(tt, 2.0, 6, 0.5), phys(tt, 2.8, 6, 0.5)], bend = eio(tt, 3.6, 5.0);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={760} />
    {X.map((x, i) => { const L = land(tt, A[i], 600); return L.on && <React.Fragment key={i}>
      {i === 0 && <Prop id="seedling" x={x} y={700 + L.dy} w={200 * Math.max(0.05, g[0])} sh={0} />}
      {i === 1 && <Prop id="wheat_dry" x={x} y={700 + L.dy} w={300 * Math.max(0.05, g[1])} sh={0} style={{ filter: "sepia(.6) brightness(.85)" }} />}
      {i === 2 && <Prop id="wheat" x={x} y={700 + L.dy} w={420 * Math.max(0.05, g[2])} sh={0} r={22 * bend + swing(tt, 5.0, 4, 3, 0.8)} />}
      <Prop id="flower_pot" x={x} y={1010 + L.dy} w={380} sq={L.sq} />
      <div style={{ position: "absolute", left: x - 90, top: 820 + L.dy, width: 180, height: 76, background: "linear-gradient(#f4ead0,#d8c8a0)", boxShadow: "0 6px 10px rgba(0,0,0,.4)", fontFamily: SER, fontWeight: 900, fontSize: 58, color: "#3a2410", textAlign: "center", lineHeight: "76px", transform: `rotate(${(i - 1) * 3}deg)` }}>{Y[i]}</div></React.Fragment>; })}
    {bend > 0.4 && Array.from({ length: 10 }, (_, k) => { const p = ((tt - 4.2) * 0.8 + k / 10) % 1; return tt > 4.2 && <div key={k} style={{ position: "absolute", left: 1560 + k * 12, top: 420 + 590 * p * p, width: 18, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f8dc90,#b88a30)", transform: `rotate(${k * 50 + p * 300}deg)`, opacity: 1 - eio(p, 0.85, 1) }} />; })}
  </Cam>;
}} />;

// m13 · la montaña de grano bajo la lluvia: la base se moja y se pone verde de moho, sale vapor, la pila se hunde y cientos de granos brillantes se desprenden
const HGrainRot: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#3a4048,#5a6066 55%,#4a4034 56%,#2a2218)" f={(tt) => {
  const d = D(h), wet = eio(tt, 0.4, d * 0.6), sink = eio(tt, d * 0.35, d - 0.4);
  return <Cam tt={tt} d={d} z={0.04}>
    {Array.from({ length: 80 }, (_, k) => { const p = (tt * 1.6 + k / 80) % 1; return <div key={k} style={{ position: "absolute", left: (k * 97) % 1920, top: -80 + 1100 * p, width: 3, height: 60, background: "rgba(200,215,230,.45)", transform: "rotate(8deg)" }} />; })}
    <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 1000px", transform: `scale(${1 + 0.12 * sink},${1 - 0.38 * sink})` }}>
      <Prop id="grain_heap" x={960} y={1000} w={1300} style={{ filter: `brightness(${1 - 0.35 * wet}) saturate(${1 - 0.3 * wet})` }} />
      <div style={{ position: "absolute", left: 330, top: 760 - 160 * wet, width: 1260, height: 240 + 160 * wet, background: "linear-gradient(rgba(70,110,50,0),rgba(70,110,50,.55) 40%,rgba(40,60,30,.8))", clipPath: "polygon(8% 100%,30% 30%,50% 0,70% 30%,92% 100%)", mixBlendMode: "multiply", opacity: wet }} /></div>
    {Array.from({ length: 5 }, (_, k) => { const p = (tt * 0.35 + k / 5) % 1; return wet > 0.3 && <Puff key={k} x={600 + k * 180 + 30 * Math.sin(p * 6)} y={760 - 340 * p} r={50 + 80 * p} col="rgba(230,230,225,.6)" o={0.6 * (1 - p) * wet} />; })}
    {Array.from({ length: 120 }, (_, k) => { const s = 0.6 + rnd(k) * (d - 1.4), p = cl((tt - s) / 1.2), side = k % 2 ? 1 : -1; return p > 0 && p < 1 && <div key={k} style={{ position: "absolute", left: 960 + side * (200 + 420 * rnd(k + 9) * (0.5 + p)), top: 700 + 300 * p * p + 60 * rnd(k + 3), width: 14, height: 20, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff2c0,#c8963a 60%,#7a5420)", transform: `rotate(${k * 40 + p * 400}deg)` }} />; })}
  </Cam>;
}} />;

// m14 · las pesas de un pud caen fila por fila, cada fila más atrás, más oscura y desenfocada; entra el diario grande con el contador de mil millones
const HPoodWeight: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), np = eio(tt, d * 0.5, d * 0.5 + 0.9), v = Math.floor(10 * eio(tt, d * 0.5 + 0.6, d - 0.6) + 0.001) * 100000000;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={540} />
    {[4, 3, 2, 1].map((r) => Array.from({ length: 3 + 2 * r }, (_, k) => { const n = 3 + 2 * r, s = 1 - r * 0.17, x = 960 + (k - (n - 1) / 2) * 190 * s, y = 980 - r * 110; return <div key={r + "_" + k} style={{ filter: `blur(${r * 1.4}px) brightness(${1 - r * 0.15})` }}><Drop tt={tt} at={0.4 + r * 0.55} id="weights" x={x} y={y} w={140 * s} h={500} dust={false} /></div>; }))}
    <Drop tt={tt} at={0.2} id="weights" x={960} y={1050} w={230} h={500} />
    {np > 0 && <div style={{ position: "absolute", left: 960 - 330, top: 160 + 900 * (1 - np), width: 660, height: 520, transform: `rotate(${-3 + 3 * np}deg)`, background: "repeating-linear-gradient(180deg,transparent 0 30px,rgba(0,0,0,.07) 30px 32px), linear-gradient(#f0e8d4,#d8ccb0)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 0, top: 24, width: 660, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 64, color: "#1a1a1a", borderBottom: "4px double #333", paddingBottom: 10 }}>THE HARVEST</div>
      <div style={{ position: "absolute", left: 30, top: 170, width: 600, height: 170, background: "#1a1612", borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 0, top: 380, width: 660, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#1a1a1a" }}>POODS</div></div>}
    {np > 0 && <Odo x={960} y={415 + 900 * (1 - np)} v={v} n={10} size={70} />}
  </Cam>;
}} />;

// m15 · la moneda de latón: lanzada gira con brillo en el canto, cae con rebote y sombra (cara gota / cara grieta), frena en la gota y la nube llueve sobre la bandeja
const HCoinRain: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fl = cl((tt - 0.2) / 1.8), ang = tt < 2.0 ? fl * 9.5 * Math.PI : 9.5 * Math.PI + 0.25 * Math.exp(-4 * (tt - 2)) * Math.sin((tt - 2) * 20), sy = Math.cos(ang), face = sy >= 0 ? "drop" : "crack";
  const cy = 990 - 620 * Math.sin(fl * Math.PI) - (tt > 2 ? 60 * Math.abs(Math.sin((tt - 2) * 8)) * Math.exp(-3 * (tt - 2)) : 0), rain = eio(tt, 2.8, 3.6);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={780} />
    <Shade x={640} y={1000} w={420 * (0.5 + 0.5 * (cy - 370) / 620)} o={0.55} />
    <div style={{ position: "absolute", inset: 0, transformOrigin: `640px ${cy - 120}px`, transform: `translateY(${cy - 990}px) scaleY(${Math.max(0.08, Math.abs(sy))})` }}>
      <Prop id="coin_big" x={640} y={990} w={400} sh={0} style={{ filter: `brightness(${0.8 + 0.4 * Math.abs(Math.sin(ang * 2))})` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{face === "drop" ? <path d="M640 790 C590 860 600 900 640 910 C680 900 690 860 640 790 Z" fill="#3a78b8" stroke="#6a4a10" strokeWidth={6} /> : <path d="M600 800 L630 850 L612 880 L650 920 M630 850 L670 830" stroke="#4a3008" strokeWidth={10} fill="none" />}</svg></div>
    {Array.from({ length: 6 }, (_, k) => <Puff key={k} x={1180 + k * 90} y={260 + (k % 2) * 40} r={120} col="rgba(90,100,110,.95)" o={rain} />)}
    {rain > 0 && Array.from({ length: 40 }, (_, k) => { const p = (tt * 1.8 + k / 40) % 1; return <div key={k} style={{ position: "absolute", left: 1180 + (k * 37) % 520, top: 330 + 520 * p, width: 4, height: 40, background: "rgba(150,190,230,.7)", opacity: rain }} />; })}
    <Prop id="grass_tray" x={1420} y={980} w={680} style={{ filter: `saturate(${0.4 + 0.8 * eio(tt, 3.4, d - 0.5)}) brightness(${0.85 + 0.2 * eio(tt, 3.4, d - 0.5)})` }} />
  </Cam>;
}} />;

// m16 · la vertedera: el terrón 3D con raíces sube por la chapa curva, gira 180° y cae raíces arriba sobre el surco abierto con sombra
const HMoldboard: C = ({ t, h }) => <S t={t} h={h} bg={PLAINS} f={(tt) => {
  const d = D(h), per = (d - 0.6) / 2, i = Math.min(1, Math.floor(Math.max(0, tt - 0.3) / per)), u = cl((tt - 0.3 - i * per) / 1.6), L = land(tt, 0.3 + i * per + 1.6, 0, 9, 0.3);
  const x = 560 + 700 * u, y = 860 - 260 * Math.sin(u * Math.PI * 0.9) + 60 * u, rot = 180 * eio(u, 0.15, 0.9);
  return <Cam tt={tt} d={d} z={0.04}>
    <Field y0={600} tt={tt} v={80} />
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 120, background: "linear-gradient(#0a0604,#2a1c10)", boxShadow: "inset 0 20px 30px rgba(0,0,0,.8)", clipPath: "polygon(0 30%,100% 0,100% 100%,0 70%)" }} />
    {i === 1 && <Prop id="clod" x={1260} y={940} w={360} r={180 * 0} sh={1} style={{ transform: "scaleY(-1)", transformOrigin: "50% 50%" }} />}
    <Prop id="moldboard" x={820 + 4 * Math.sin(tt * 20)} y={930} w={900} />
    <div style={{ position: "absolute", left: x - 180, top: y - 200, width: 360, height: 210, transformOrigin: "50% 50%", transform: `rotate(${rot}deg) scaleY(${-1})` }}><Prop id="clod" x={180} y={210} w={360} sh={0} /></div>
    {u >= 1 && <Dust tt={tt} at={0.3 + i * per + 1.6} x={1260} y={960} w={300} col="rgba(110,82,52,.85)" />}
    <Shade x={x} y={970} w={360 * (0.4 + 0.6 * u)} o={0.4} />
  </Cam>;
}} />;

// m17 · cinco parcelas en fila: un costal de semilla cae sobre cada una con rebote y la tierra pasa de oscura a gris agrietada; la de adelante blanca y rota
const HWheatRepeat: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d - 1.4) / 5;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={600} />
    {[0, 1, 2, 3, 4].map((i) => { const a = 0.3 + i * step, s = 0.72 + i * 0.07, x = 260 + i * 350, y = 700 + i * 55, gr = eio(tt, a + 0.3, a + 1.2) * (0.25 + 0.19 * i), w = 300 * s; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: 120 * s, borderRadius: 10, background: `linear-gradient(rgb(${42 + 180 * gr},${30 + 170 * gr},${20 + 160 * gr}),rgb(${26 + 150 * gr},${18 + 140 * gr},${10 + 130 * gr}))`, boxShadow: `0 ${14 * s}px 0 #4a2e16, 0 26px 26px rgba(0,0,0,.45)` }}>
        <svg width={w} height={120 * s} style={{ position: "absolute", inset: 0, opacity: cl(gr * 1.6 - 0.3) }}><path d={`M${w * 0.1} ${30 * s} L${w * 0.35} ${60 * s} L${w * 0.3} ${100 * s} M${w * 0.35} ${60 * s} L${w * 0.7} ${50 * s} L${w * 0.9} ${90 * s} M${w * 0.7} ${50 * s} L${w * 0.62} ${12 * s}`} stroke="rgba(40,30,20,.75)" strokeWidth={4} fill="none" /></svg></div>
      <Drop tt={tt} at={a} id="jute_sack" x={x} y={y + 60 * s} w={190 * s} h={500} />
      <div style={{ position: "absolute", left: x - 70, top: y + 130 * s + 18, width: 140, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 40 * s + 6, color: "#f3e6c6", textShadow: "0 3px 6px #000" }}>{1954 + i}</div></React.Fragment>; })}
  </Cam>;
}} />;

// m18 · barbecho negro: terrones y surcos con relieve bajo luz rasante; la ráfaga levanta una nube densa que barre el campo
const HBareFallow: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#d0b080,#e8d0a0 40%,#4a3420 42%,#1a120a)" f={(tt) => {
  const d = D(h), g = cl((tt - 0.5) / (d - 1.0));
  return <Cam tt={tt} d={d} z={0.05} fy={800}>
    <Field y0={440} tt={tt} />
    {Array.from({ length: 22 }, (_, k) => { const x = 80 + (k * 173) % 1760, y = 640 + ((k * 71) % 380), w = 110 + (k % 4) * 50 + (y - 640) * 0.3, lift = cl(g * 1.6 - (1 - x / 1920)) * (k % 3 === 0 ? 1 : 0); return <Prop key={k} id="clod" x={x - 200 * lift} y={y - 120 * lift} w={w} r={k * 30 - 90 * lift} o={1 - lift} />; })}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg,rgba(255,200,130,.35),transparent 40%,rgba(0,0,0,.35))", mixBlendMode: "overlay" }} />
    {Array.from({ length: 8 }, (_, k) => { const x = 2200 - 2600 * g + k * 160; return <Prop key={k} id="dust_cloud" x={x} y={900 - (k % 3) * 120} w={520 + (k % 3) * 160} sh={0} o={0.85} r={k * 5} />; })}
    {Array.from({ length: 50 }, (_, k) => { const x = 2100 - 2700 * g + (k * 53) % 900; return <div key={k} style={{ position: "absolute", left: x, top: 560 + (k * 37) % 460, width: 6, height: 4, borderRadius: 2, background: "rgba(60,40,20,.8)" }} />; })}
  </Cam>;
}} />;

// m19 · Washington, 1935: diorama de tres capas de cartón; la pared de polvo avanza entre la cúpula y el primer plano hasta taparla; la luz se pone parda
const HCapitolDust: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9ab8d0,#d8e0e0)" f={(tt) => {
  const d = D(h), w = eio(tt, 0.3, d - 1.0), br = eio(tt, 1.0, d - 0.4);
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "linear-gradient(#7a8a5a,#4a5a32)" }} />
    <Prop id="capitol" x={960} y={850} w={1050} />
    {Array.from({ length: 7 }, (_, k) => <Prop key={k} id="dust_cloud" x={2400 - 2000 * w + k * 230} y={880 - (k % 3) * 130} w={700 + (k % 2) * 200} sh={0} r={k * 7} o={0.95} />)}
    {Array.from({ length: 60 }, (_, k) => <div key={k} style={{ position: "absolute", left: 2200 - 2100 * w + (k * 61) % 700 - 200, top: 200 + (k * 43) % 700, width: 8, height: 6, borderRadius: 3, background: "rgba(80,56,32,.8)" }} />)}
    <div style={{ position: "absolute", inset: 0, background: "rgba(110,76,40,.6)", mixBlendMode: "multiply", opacity: br }} />
    <Prop id="fence_rail" x={330} y={1080} w={700} />
    <Prop id="fence_rail" x={1600} y={1080} w={700} flip />
    <Tab x={960} y={1050} txt="WASHINGTON, 1935" size={54} />
  </Cam>;
}} />;

// m20 · el estante de las lecciones: cuatro maquetas al 70 % del ancho caen con rebote y sombra; al aterrizar cuelga su tarjeta y se hamaca
const LS = ["trees", "contour", "stubble", "grass"];
const HLessonShelf: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), A = [0.3, bt(h, 0, 4.2), bt(h, 1, 6.7), bt(h, 2, 8.0)], X = [430, 790, 1150, 1510];
  const M = (i: number) => i === 0 ? <svg width={320} height={300}>{[0, 1, 2].map((k) => <g key={k}><rect x={70 + k * 90} y={190} width={16} height={90} fill="#5a3a1c" /><path d={`M${78 + k * 90} ${30 + (k % 2) * 30} L${130 + k * 90} 210 L${26 + k * 90} 210 Z`} fill={k % 2 ? "#4a7a32" : "#3a6a28"} stroke="#2a4a1a" strokeWidth={4} /></g>)}</svg>
    : i === 1 ? <svg width={320} height={300}><path d="M10 290 Q160 20 310 290 Z" fill="#8a9a4a" stroke="#4a5a22" strokeWidth={5} />{[0, 1, 2, 3].map((k) => <path key={k} d={`M${40 + k * 30} 290 Q160 ${70 + k * 50} ${280 - k * 30} 290`} stroke="#4a5a22" strokeWidth={4} fill="none" />)}</svg>
      : i === 2 ? <svg width={320} height={300}><rect x={10} y={230} width={300} height={60} fill="#4a3018" />{Array.from({ length: 22 }, (_, k) => <path key={k} d={`M${22 + k * 13} 232 L${24 + k * 13} ${150 + (k % 3) * 20}`} stroke="#d8b870" strokeWidth={6} />)}</svg>
        : null;
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <div style={{ position: "absolute", left: 230, top: 760, width: 1460, height: 50, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 100px), linear-gradient(#a07448,#5a3a1c)", boxShadow: "0 26px 30px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,220,170,.4)" }} />
    {X.map((x, i) => { const L = land(tt, A[i], 600); return L.on && <React.Fragment key={i}>
      {i < 3 ? <div style={{ position: "absolute", left: x - 160, top: 460 + L.dy, transformOrigin: "50% 100%", transform: `scale(${1 + 0.12 * L.sq},${1 - 0.12 * L.sq})`, filter: "drop-shadow(10px 18px 12px rgba(0,0,0,.5))" }}>{M(i)}</div> : <Prop id="grass_tray" x={x} y={762 + L.dy} w={330} sq={L.sq} />}
      <Shade x={x} y={762} w={300} o={0.5 * L.k} />
      {L.k > 0.9 && <div style={{ position: "absolute", left: x, top: 810, transformOrigin: "50% 0", transform: `rotate(${swing(tt, A[i] + 0.3, 14, 4, 1.0)}deg)` }}>
        <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 50, background: "#c8a870" }} />
        <div style={{ position: "absolute", left: -110, top: 50, width: 220, height: 90, background: "linear-gradient(#f4ead0,#d8c8a0)", boxShadow: "0 10px 14px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 54, color: "#2a1a0c", textAlign: "center", lineHeight: "90px" }}>{LS[i]}</div></div>}</React.Fragment>; })}
  </Cam>;
}} />;

// m21 · el parche de tierra arada: California de cartón cae en la mesa; la mancha de fieltro oscuro con surcos crece encima y la desborda con borde levantado
const CALI = "polygon(8% 0,46% 0,46% 34%,96% 76%,92% 88%,84% 100%,58% 98%,52% 86%,34% 72%,20% 52%,10% 30%,4% 12%)";
const HCaliOverlay: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 500), g = eio(tt, 1.0, d - 0.8);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={60} />
    <div style={{ position: "absolute", left: 760, top: 160 + L.dy, width: 420, height: 760, clipPath: CALI, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 9px), linear-gradient(135deg,#d8b888,#a8885a)", filter: "drop-shadow(0 14px 0 #6a4a26)", opacity: L.on ? 1 : 0 }} />
    <div style={{ position: "absolute", left: 960 - 760 * g, top: 540 - 470 * g, width: 1520 * g, height: 940 * g, borderRadius: "46% 54% 40% 60% / 50% 44% 56% 50%", background: "repeating-linear-gradient(170deg,rgba(255,220,170,.08) 0 6px,rgba(0,0,0,.3) 6px 14px,transparent 14px 46px), radial-gradient(circle at 40% 40%,#3a2818,#160e08)", boxShadow: `0 ${18 * g}px 0 #0a0604, 0 ${30 * g}px ${40 * g}px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,220,170,.18)` }} />
  </Cam>;
}} />;

// m22 · el mismo viento sobre dos bandejas enteras: el pasto plantado se dobla y aguanta; la tierra pelada se vuela en polvo; la cinta de viento cruza desde el primer segundo
const HWindComb: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), gust = 0.6 + 0.4 * Math.sin(tt * 3);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={700} />
    <Prop id="grass_tray" x={540} y={930} w={720} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 34 }, (_, k) => { const x = 230 + k * 18; return <path key={k} d={`M${x} 860 Q${x + 20 * gust} 800 ${x + 46 * gust} ${770 + (k % 3) * 10}`} stroke={k % 2 ? "#4a8a2a" : "#5a9a32"} strokeWidth={6} fill="none" strokeLinecap="round" />; })}</svg>
    <div style={{ position: "absolute", left: 1060, top: 820, width: 720, height: 110, borderRadius: 12, background: "linear-gradient(#8a6a42,#5a3e22)", boxShadow: "0 22px 26px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 18, top: 12, width: 684, height: 60, borderRadius: 8, background: "radial-gradient(circle at 30% 50%,#4a3420,#2a1c10)", opacity: 1 - 0.5 * eio(tt, 0.5, d) }} /></div>
    {Array.from({ length: 5 }, (_, k) => { const p = ((tt * 0.7 + k / 5) % 1); return <Puff key={k} x={1300 + 500 * p + k * 30} y={820 - 200 * p} r={50 + 90 * p} col="rgba(110,82,52,.85)" o={0.8 * (1 - p)} />; })}
    {[0, 1, 2].map((k) => { const p = ((tt * 0.5 + k / 3) % 1); return <svg key={k} width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.6 * Math.sin(p * Math.PI) }}><path d={`M${-400 + 2400 * p} ${600 + k * 60} q300 -60 600 0 t600 0`} stroke="rgba(255,250,235,.85)" strokeWidth={10} fill="none" strokeLinecap="round" /></svg>; })}
  </Cam>;
}} />;

// m23 · mediodía y de noche: por la ventana sube la pared de polvo con partículas; el reloj limpio marca las 12; la llama del farol crece con su halo
const HNoonDark: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), w = eio(tt, 0.2, d * 0.6), fl = eio(tt, d * 0.55, d - 0.4);
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 220, top: 170, width: 760, height: 560, background: "linear-gradient(#a8c4dc,#e8dcc0)", overflow: "hidden", boxShadow: "inset 0 0 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, top: 440, width: 760, height: 120, background: "#8a7448" }} />
      <div style={{ position: "absolute", left: -60, top: 560 - 600 * w, width: 880, height: 700, borderRadius: "40% 50% 0 0", background: "radial-gradient(circle at 30% 20%,#6a4a2a,#3a2614 60%)" }} />
      {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 53) % 760, top: 560 - 640 * w + (k * 29) % 120 - 40 * Math.sin(tt * 2 + k), width: 8, height: 8, borderRadius: "50%", background: "rgba(90,60,30,.8)" }} />)}</div>
    <div style={{ position: "absolute", left: 200, top: 150, width: 800, height: 600, border: "22px solid #6a4a2a", boxShadow: "0 16px 22px rgba(0,0,0,.6)", background: "linear-gradient(90deg,transparent 48.5%,#6a4a2a 48.5% 51.5%,transparent 51.5%), linear-gradient(transparent 48.5%,#6a4a2a 48.5% 51.5%,transparent 51.5%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "rgba(20,12,6,.6)", opacity: w }} />
    <div style={{ position: "absolute", left: 1220, top: 150, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#fbf6ea 70%,#d8ccb0)", border: "16px solid #5a3a1c", boxShadow: "0 18px 24px rgba(0,0,0,.6)" }}>
      {["XII", "III", "VI", "IX"].map((n, k) => <div key={n} style={{ position: "absolute", left: 164 + 130 * Math.sin(k * Math.PI / 2) - 40, top: 164 - 130 * Math.cos(k * Math.PI / 2) - 26, width: 80, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 46, color: "#1a1a1a" }}>{n}</div>)}
      <div style={{ position: "absolute", left: 160, top: 60, width: 9, height: 110, background: "#1a1a1a", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 162, top: 30, width: 5, height: 140, background: "#1a1a1a", transformOrigin: "2px 140px", transform: `rotate(${6 * Math.floor(tt)}deg)` }} />
      <div style={{ position: "absolute", left: 150, top: 150, width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a" }} /></div>
    <Glow x={1400} y={760} r={180 + 300 * fl} o={0.3 + 0.7 * fl} col="255,180,80" />
    <Prop id="kerosene_lamp" x={1400} y={1000} w={190} style={{ filter: `brightness(${0.6 + 0.6 * fl})` }} />
    <div style={{ position: "absolute", left: 1386, top: 830 - 30 * fl, width: 28, height: 30 + 40 * fl, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 50% 70%,#fff4c0,#ffa020 60%,transparent 72%)", transform: `scaleX(${1 + 0.15 * Math.sin(tt * 13)})` }} />
    <div style={{ position: "absolute", left: 1100, top: 1000, width: 700, height: 80, background: "linear-gradient(#6a4a2a,#3a2614)" }} />
  </Cam>;
}} />;

// m24 · el muelle de cartón: el cartel con la hoz y el martillo; pasan barcos en diagonal con bandera y estela; el de Estados Unidos frena al centro
const FLAGS: Record<string, React.ReactNode> = {
  ca: <div style={{ width: 90, height: 56, background: "linear-gradient(90deg,#d42a1e 0 25%,#fff 25% 75%,#d42a1e 75%)", position: "relative" }}><div style={{ position: "absolute", left: 34, top: 14, width: 22, height: 26, background: "#d42a1e", clipPath: "polygon(50% 0,65% 30%,100% 25%,80% 60%,90% 100%,50% 80%,10% 100%,20% 60%,0 25%,35% 30%)" }} /></div>,
  au: <div style={{ width: 90, height: 56, background: "#1a2a7a", position: "relative" }}>{[[60, 12], [74, 30], [56, 40], [20, 38]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x, top: y, width: 8, height: 8, background: "#fff", borderRadius: "50%" }} />)}<div style={{ position: "absolute", left: 0, top: 0, width: 40, height: 26, background: "linear-gradient(#c8102e 40%,#fff 40% 60%,#c8102e 60%)" }} /></div>,
  us: <div style={{ width: 96, height: 56, background: "repeating-linear-gradient(180deg,#b22234 0 8px,#fff 8px 16px)", position: "relative" }}><div style={{ position: "absolute", left: 0, top: 0, width: 40, height: 32, background: "radial-gradient(circle,#fff 0 2px,transparent 3px) 0 0/10px 10px, #3c3b6e" }} /></div>,
};
const HGrainShips: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#b8c8d0,#e0dcd0 40%,#5a7a8a 42%,#2a4050)" f={(tt) => {
  const d = D(h), Sh = [["ca", 0.2], ["au", (d - 2) * 0.33], ["us", (d - 2) * 0.62]] as [string, number][];
  return <Cam tt={tt} d={d} z={0.04}>
    {Sh.map(([f, a], i) => { const last = i === 2, p = last ? eio(tt, a, a + 2.6) * 0.62 : cl((tt - a) / 3.6), x = -300 + 2500 * p, y = 520 + 260 * p, s = 0.45 + 0.6 * p; if (p <= 0 || p >= 1) return null; return <React.Fragment key={f}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${x - 300 * s} ${y + 10} L${x - 800 * s} ${y - 60 * s} M${x - 300 * s} ${y + 14} L${x - 800 * s} ${y + 80 * s}`} stroke="rgba(235,245,250,.6)" strokeWidth={6} fill="none" /></svg>
      <Prop id="cargo_ship" x={x} y={y} w={720 * s} sh={0} />
      <div style={{ position: "absolute", left: x + 160 * s, top: y - 250 * s, transform: `scale(${s * 1.3})`, transformOrigin: "0 0" }}><div style={{ position: "absolute", left: -4, top: 0, width: 5, height: 120, background: "#333" }} /><div style={{ transform: `skewY(${4 * Math.sin(tt * 4 + i)}deg)` }}>{FLAGS[f]}</div></div></React.Fragment>; })}
    <div style={{ position: "absolute", left: 1080, top: 860, width: 900, height: 240, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 4px,transparent 4px 90px), linear-gradient(#a8885a,#6a4e2e)", boxShadow: "0 -6px 0 #c8a878, 0 26px 30px rgba(0,0,0,.6)" }} />
    <Prop id="dock_crane" x={1700} y={870} w={360} />
    <div style={{ position: "absolute", left: 1170, top: 640, width: 330, height: 200, background: "linear-gradient(#c8302a,#901a14)", boxShadow: "0 16px 20px rgba(0,0,0,.55)", border: "8px solid #6a4a2a" }}>
      <svg width={314} height={184} viewBox="0 0 314 184"><g stroke="#f8d040" strokeWidth={12} fill="none" strokeLinecap="round"><path d="M120 40 A50 50 0 1 0 170 120" /><path d="M150 150 L110 110" /></g><g fill="#f8d040"><rect x={130} y={60} width={56} height={18} transform="rotate(-45 158 69)" /><rect x={150} y={70} width={10} height={80} transform="rotate(-45 155 110)" /></g>
        <text x={235} y={110} fontFamily={SER} fontWeight={900} fontSize={44} fill="#f8d040" textAnchor="middle">USSR</text></svg></div>
    <div style={{ position: "absolute", left: 1330, top: 840, width: 10, height: 30, background: "#4a3420" }} />
  </Cam>;
}} />;

// m25 · la estación de Barayev: hileras de tallos de tres alturas con sombra; la nieve cae y se amontona en cuña detrás de cada hilera; en primavera, la franja verde
const HStripPlots: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9aa8b8,#d8dce0 40%,#c8bca8 42%,#8a7a62)" f={(tt) => {
  const d = D(h), sn = eio(tt, 0.5, bt(h, 2, 7) - 0.4), gr = eio(tt, bt(h, 2, 7), bt(h, 2, 7) + 1.6), R = [600, 760, 940];
  return <Cam tt={tt} d={d} z={0.04}>
    {Array.from({ length: 60 }, (_, k) => { const p = (tt * 0.3 + k / 60) % 1; return <div key={k} style={{ position: "absolute", left: (k * 113) % 1920 + 60 * Math.sin(tt + k), top: -20 + 1100 * p, width: 7, height: 7, borderRadius: "50%", background: "#fff", opacity: 0.85 * (1 - gr) }} />; })}
    {R.map((y, r) => { const s = 0.7 + r * 0.18; return <React.Fragment key={r}>
      <div style={{ position: "absolute", left: 0, top: y - 70 * s * sn, width: 1920, height: 70 * s * sn + 4, background: "linear-gradient(rgba(255,255,255,.95),#e8ecf0)", clipPath: "polygon(0 100%,0 40%,100% 0,100% 100%)", boxShadow: "0 4px 6px rgba(0,0,0,.2)", opacity: 1 - gr }} />
      {gr > 0 && <div style={{ position: "absolute", left: 0, top: y - 20 * s, width: 1920, height: 30 * s * gr, background: "repeating-linear-gradient(90deg,#6a9a3a 0 6px,#4a7a2a 6px 12px,transparent 12px 18px)" }} />}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 48 }, (_, k) => { const x = 20 + k * 40, hh = [60, 90, 120][k % 3] * s; return <g key={k}><path d={`M${x + 6} ${y + 2} l12 4`} stroke="rgba(0,0,0,.35)" strokeWidth={6} /><path d={`M${x} ${y + 4} L${x + 2} ${y - hh}`} stroke="#d8b870" strokeWidth={5 * s} strokeLinecap="round" /></g>; })}</svg></React.Fragment>; })}
    <Tab x={1640} y={1050} txt="Shortandy, 1957" size={50} />
  </Cam>;
}} />;

// m26 · la cuchilla plana de acero cruza la caja de tierra por debajo; cada raíz se parte con destello y el rastrojo queda parado arriba
const HFlatCutter: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), bx = 160 + 1600 * eio(tt, 0.4, d - 0.8);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 200, top: 420, width: 1520, height: 480, border: "10px solid rgba(220,230,235,.6)", background: "linear-gradient(#3a2818,#1a120a)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 0 0 4px rgba(255,255,255,.12)" }}>
      <svg width={1500} height={460} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 30 }, (_, k) => { const x = 30 + k * 50, cut = bx - 200 > x; return <g key={k}><path d={`M${x} 10 q${8 * Math.sin(k)} 150 ${4 * Math.cos(k)} 300`} stroke="rgba(220,200,160,.8)" strokeWidth={3} fill="none" transform={cut ? "translate(0 0)" : undefined} /><path d={`M${x + 4 * Math.cos(k)} 330 q-6 60 ${6 * Math.sin(k)} 120`} stroke="rgba(220,200,160,.8)" strokeWidth={3} fill="none" transform={cut ? "translate(4 14)" : undefined} /></g>; })}</svg>
      {Array.from({ length: 30 }, (_, k) => { const x = 30 + k * 50, p = (bx - 200 - x) / 60; return p > 0 && p < 1 && <Glow key={k} x={x} y={330} r={60} o={1 - p} col="255,240,200" />; })}</div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 50 }, (_, k) => { const x = 220 + k * 30; return <path key={k} d={`M${x} 432 L${x + 2} ${300 + (k % 3) * 30}`} stroke="#d8b870" strokeWidth={6} strokeLinecap="round" />; })}</svg>
    <div style={{ position: "absolute", left: bx - 520, top: 740, width: 520, height: 22, background: "linear-gradient(#f4f6f8,#9aa0a6 60%,#5a6066)", clipPath: "polygon(0 0,92% 0,100% 50%,92% 100%,0 100%)", boxShadow: "0 0 18px rgba(255,255,255,.5)" }} />
    <div style={{ position: "absolute", left: bx - 300, top: 420, width: 26, height: 330, background: "linear-gradient(90deg,#4a4e52,#9aa0a6,#4a4e52)" }} />
  </Cam>;
}} />;

// m27 · Canadá, años 30: el cianotipo se despliega en dos tiempos con sombra y la cuchilla ancha blanca, al 70 % del plano, se dibuja trazo a trazo
const HNobleBlade: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), f1 = eio(tt, 0.2, 0.9), f2 = eio(tt, 0.9, 1.6), dr = cl((tt - 1.7) / (d - 3.2));
  const strokes = ["M300 470 L960 300 L1620 470", "M300 470 L360 520 L960 360 L1560 520 L1620 470", "M960 300 L960 200", "M760 250 L760 170 L1160 170 L1160 250", "M420 600 L1500 600"];
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={60} />
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 840, transformOrigin: "50% 50%", transform: `perspective(1600px) scaleX(${0.25 + 0.75 * f1}) rotateX(${50 * (1 - f2)}deg)`, background: "linear-gradient(90deg,transparent 49.7%,rgba(255,255,255,.12) 50%,transparent 50.3%), linear-gradient(transparent 49.7%,rgba(255,255,255,.12) 50%,transparent 50.3%), repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 1px,transparent 1px 40px), repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 1px,transparent 1px 40px), linear-gradient(#1e4a8a,#14366a)", boxShadow: `0 ${30 * f2 + 6}px ${40 * f2 + 8}px rgba(0,0,0,.6)` }}>
      <svg width={1600} height={840} viewBox="160 120 1600 840" style={{ position: "absolute", inset: 0 }}>{strokes.map((s, k) => { const p = cl(dr * strokes.length - k); return <path key={k} d={s} stroke="#f4f8ff" strokeWidth={k < 2 ? 16 : 8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />; })}
        <path d="M420 590 l20 -10 M420 590 l20 10 M1500 590 l-20 -10 M1500 590 l-20 10" stroke="#f4f8ff" strokeWidth={6} opacity={cl(dr * 5 - 4)} />
        <text x={960} y={660} textAnchor="middle" fontFamily={SER} fontWeight={900} fontSize={64} fill="#f4f8ff" opacity={cl(dr * 5 - 4)}>6 ft wide</text></svg>
      <div style={{ position: "absolute", right: 30, bottom: 30, width: 420, height: 130, border: "4px solid #f4f8ff", color: "#f4f8ff", fontFamily: SER, fontWeight: 900, fontSize: 52, textAlign: "center", lineHeight: "130px", opacity: f2 }}>C. S. NOBLE</div></div>
  </Cam>;
}} />;

// m28 · la tribuna vacía: la cámara se acerca al mástil; el banderín rojo se suelta, flamea, rebota en un escalón y queda grande y arrugado adelante
const HEmptyStand: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#8a98a8,#c8ccc8)" f={(tt) => {
  const d = D(h), a = d * 0.3, p = cl((tt - a) / 2.2), lnd = tt > a + 2.2, bx = 960 + 300 * p, by = lnd ? 1040 : 220 + 600 * p * p + (p > 0.55 && p < 0.8 ? -120 * Math.sin((p - 0.55) / 0.25 * Math.PI) : 0), s = 1 + 1.6 * p;
  return <Cam tt={tt} d={d} z={0.14} fx={960} fy={400}>
    {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 200 - k * 60, top: 600 + k * 120, width: 1520 + k * 120, height: 120, background: `linear-gradient(#${["9a8a70", "8a7a60", "7a6a50"][k]},#4a3a28)`, boxShadow: "0 12px 14px rgba(0,0,0,.4)" }} />)}
    {Array.from({ length: 18 }, (_, k) => { const r = Math.floor(k / 6), x = 360 + (k % 6) * 240 - r * 40; return <div key={k} style={{ position: "absolute", left: x, top: 520 + r * 120, width: 80, height: 90, borderTop: "14px solid #5a4030", borderLeft: "8px solid #5a4030", borderRight: "8px solid #5a4030", boxSizing: "border-box" }} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M180 420 Q960 520 1740 420" stroke="#5a4a3a" strokeWidth={4} fill="none" />{Array.from({ length: 12 }, (_, k) => { const x = 240 + k * 130, y = 424 + 90 * Math.sin((x - 180) / 1560 * Math.PI) * 0.9; return <path key={k} d={`M${x} ${y} l40 0 l-20 ${50 + 6 * Math.sin(tt * 4 + k)} Z`} fill={["#d8c8a0", "#6a8aa0", "#c8b070"][k % 3]} />; })}</svg>
    <Prop id="flagpole" x={960} y={830} w={56} sh={0.6} />
    {!lnd ? <div style={{ position: "absolute", left: bx - 10, top: by - 30, transformOrigin: "0 50%", transform: `scale(${s}) rotate(${p * 200 + 30 * Math.sin(tt * 8)}deg) skewY(${10 * Math.sin(tt * 9)}deg)` }}><div style={{ width: 150, height: 90, background: "linear-gradient(#d42a1e,#901a14)", clipPath: "polygon(0 0,100% 50%,0 100%)", boxShadow: "0 8px 10px rgba(0,0,0,.4)" }} /></div>
      : <><Shade x={bx + 140} y={1050} w={460} o={0.55} /><div style={{ position: "absolute", left: bx - 100, top: 900, width: 460, height: 160, background: "linear-gradient(160deg,#e03a2a,#a01a12 50%,#c82a1e)", clipPath: "polygon(0 30%,20% 10%,35% 40%,55% 0,70% 30%,100% 60%,80% 80%,60% 70%,40% 100%,10% 90%)", filter: "drop-shadow(0 10px 8px rgba(0,0,0,.5))", transform: `scale(${1 + 0.06 * Math.exp(-4 * (tt - a - 2.2))})` }} /></>}
  </Cam>;
}} />;

// m29 · el escritorio: la placa de bronce se desliza al borde y cae con rebote; el sello de goma estampa OCTOBER 1964 en la carpeta; 1964 grande
const HDeskPlate: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), sl = eio(tt, 0.3, 1.6), fall = land(tt, 1.6, 300), st = d * 0.5, sd = Math.sin(cl((tt - st + 0.5) / 0.9) * Math.PI);
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 320, top: 620, width: 1700, height: 300, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 160px), linear-gradient(#7a4e2a,#4a2c14)", boxShadow: "inset 0 4px 0 rgba(255,220,170,.35)" }} />
    <div style={{ position: "absolute", left: 320, top: 920, width: 1700, height: 160, background: "linear-gradient(#3a2210,#1a0e06)" }} />
    <div style={{ position: "absolute", left: 0, top: 1050, width: 1920, height: 30, background: "#2a1a0e" }} />
    {tt < 1.6 ? <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${-380 * sl}px)` }}><Prop id="plaque" x={760} y={800} w={420} /><div style={{ position: "absolute", left: 600, top: 680, width: 320, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 30, color: "#3a2a08" }}>N. S. KHRUSHCHEV</div></div>
      : <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "240px 1050px", transform: `translate(${-140}px,${250 + fall.dy * 0.3}px) rotate(${-18 * (1 - fall.k)}deg)` }}><Prop id="plaque" x={380} y={800} w={420} sq={fall.sq} /><div style={{ position: "absolute", left: 220, top: 680, width: 320, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 30, color: "#3a2a08" }}>N. S. KHRUSHCHEV</div></div>}
    {tt > 1.6 && <Dust tt={tt} at={1.7} x={240} y={1050} w={240} />}
    <Prop id="folder" x={1260} y={900} w={400} r={-4} />
    <Sello tt={tt} at={st + 0.05} x={1260} y={650} txt="OCTOBER 1964" size={62} r={-8} />
    {sd > 0.01 && <div style={{ position: "absolute", left: 1170, top: 340 + 230 * sd, width: 180, height: 300 }}><div style={{ position: "absolute", left: 70, top: 0, width: 40, height: 80, borderRadius: "50% 50% 20% 20%", background: "linear-gradient(#a0582a,#5a2e12)" }} /><div style={{ position: "absolute", left: 20, top: 80, width: 140, height: 40, background: "linear-gradient(#6a3a1a,#3a1e0a)" }} /><div style={{ position: "absolute", left: 14, top: 120, width: 152, height: 26, background: "#2a2a2a" }} /></div>}
    <Word tt={tt} at={st + 0.7} x={1260} y={260} txt="1964" size={210} r={-2} />
  </Cam>;
}} />;

// m30 · ¿quién pagó?: la registradora de bronce imprime un renglón grande por vez con campanilla; al final el cajón se abre de golpe, vacío, con sombra adentro
const BL: [string, number][] = [["THE LAND", 0.8], ["THE YOUNG", 3.2], ["THE HERDERS", 5.6], ["THE COUNTRY", 8.3]];
const HBillEnvelopes: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), A = [0.8, bt(h, 0, 3.2), bt(h, 1, 5.6), bt(h, 2, 9.9) - 1.6], k = A.filter((a) => tt >= a).length - 1, pr = k >= 0 ? eio(tt, A[k], A[k] + 0.5) : 0, dr = tt > d - 1.3 ? 1 - Math.exp(-6 * (tt - d + 1.3)) * Math.cos((tt - d + 1.3) * 10) : 0;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={880} />
    {k >= 0 && <div style={{ position: "absolute", left: 600, top: 460 - 110 * (k + pr), width: 360, height: 110 * (k + pr) + 20, background: "linear-gradient(#fbf8f0,#efe8d8)", boxShadow: "0 10px 16px rgba(0,0,0,.4)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 8, width: 360, textAlign: "center", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 30, color: "#555" }}>PAID BY</div>
      {A.slice(0, k + 1).map((_, j) => <div key={j} style={{ position: "absolute", left: 0, top: 50 + j * 110, width: 360, textAlign: "center", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: j === k ? 46 : 34, color: j === k ? "#111" : "#777" }}>{BL[j][0]}</div>)}</div>}
    <Prop id="cash_drawer" x={780} y={1000} w={640} />
    {dr > 0 && <div style={{ position: "absolute", left: 540, top: 880 + 40 * dr, width: 480, height: 110, background: "linear-gradient(#8a5a30,#5a3618)", boxShadow: "0 18px 22px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", left: 20, top: 10, width: 440, height: 70, background: "linear-gradient(#0a0604,#2a1a0e)", boxShadow: "inset 0 10px 18px #000" }} /></div>}
    <Prop id="desk_bell" x={1420} y={1000 - (k >= 0 ? 30 * Math.max(0, Math.sin((tt - A[k]) * 18)) * Math.exp(-5 * (tt - A[k])) : 0)} w={280} />
    {A.map((a, j) => <Rings key={j} tt={tt} at={a} x={1420} y={780} s={0.5} />)}
  </Cam>;
}} />;

// m31 · el surco de los años: la reja de acero avanza; el terrón se abre y empuja una tablita con el año que se inclina con rebote; la anterior se hunde
const FY: [string, string][] = [["1953", "no food"], ["1954", "the plan"], ["1955", "first dry year"], ["1956", "miracle harvest"], ["late 50s", "dust"], ["1962–63", "black storms"], ["1963", "buys grain abroad"], ["1964", "Khrushchev out"], ["late 60s", "flat-cutters"]];
const HFurrowYears: C = ({ t, h }) => <S t={t} h={h} bg={PLAINS} f={(tt) => {
  const d = D(h), B = [0.3, ...FY.slice(1).map((_, i) => bt(h, i, 1.5 + i * 1.4))], k = Math.max(0, B.filter((b) => tt >= b).length - 1), nx = k + 1 < B.length ? B[k + 1] : d, u = cl((tt - B[k]) / Math.max(0.6, nx - B[k])), sx = 300 + 1300 * u;
  return <Cam tt={tt} d={d} z={0.04}>
    <Field y0={480} tt={tt} />
    <div style={{ position: "absolute", left: 0, top: 830, width: Math.max(0, sx - 200), height: 70, background: "linear-gradient(#0a0604,#2a1c10)", clipPath: "polygon(0 20%,100% 0,100% 100%,0 80%)" }} />
    {[k - 1, k].map((j) => { if (j < 0) return null; const up = j === k ? phys(tt, B[j] + 0.15, 7, 0.45) : 1, sink = j === k ? 0 : eio(tt, B[k], B[k] + 0.6), x = 960 + (j === k ? 0 : -500 * sink); return <div key={j} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 860, overflow: "hidden" }}><Tab x={x} y={850 + 420 * (1 - Math.min(1, up)) + 400 * sink} txt={FY[j][0]} sub={FY[j][1]} size={110} r={j === k ? swing(tt, B[j] + 0.4, 10, 5, 1.2) : 0} /></div>; })}
    <Prop id="clod" x={960} y={880} w={260 * phys(tt, B[k] + 0.1, 8, 0.5)} r={20} />
    <Prop id="moldboard" x={sx} y={900} w={460} />
    <Dust tt={tt} at={B[k] + 0.1} x={960} y={870} w={260} col="rgba(110,82,52,.85)" />
  </Cam>;
}} />;

// m32 · la bolsa de correo de lona: la mano saca UN sobre, la solapa gira en 3D, la respuesta se escribe en tinta roja; el sobre sale y entra el siguiente
const QA: [string, string][] = [["As bad as the Dust Bowl?", "Some years, yes. And bigger."], ["Did people die?", "No solid numbers. I won't invent any."], ["Is the land still hurt?", "Parts of it. Some went back to grass."]];
const HMailbag: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), per = (d - 0.3) / 3, i = Math.min(2, Math.floor(Math.max(0, tt - 0.15) / per)), u = Math.max(0, tt - 0.15 - i * per), up = eio(u, 0, 0.7), fl = eio(u, 0.7, 1.1), out = eio(u, per - 0.5, per), wr = cl((u - 1.3) / (per - 2.0));
  const ex = 420 + 560 * up + 900 * out, ey = 820 - 360 * up, ans = QA[i][1];
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={900} />
    <Prop id="canvas_bag" x={400} y={1040} w={600} />
    <div style={{ position: "absolute", left: ex - 300, top: ey - 200, width: 600, height: 400, transform: `rotate(${-8 + 8 * up}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#f4ead4,#e0d2b0)", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 30, top: 20 - 220 * fl, width: 540, height: 340, background: "repeating-linear-gradient(180deg,transparent 0 54px,rgba(90,120,200,.3) 54px 56px), #fbf8ee", boxShadow: "0 6px 10px rgba(0,0,0,.25)", opacity: fl, padding: "26px 30px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: HAND, fontSize: 46, color: "#1a1a1a", lineHeight: 1.15 }}>{QA[i][0]}</div>
        <div style={{ fontFamily: HAND, fontSize: 46, color: "#b3221a", lineHeight: 1.15, marginTop: 18 }}>{ans.slice(0, Math.floor(ans.length * wr))}</div></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 230, transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${180 * fl}deg)`, background: "linear-gradient(#ece0c0,#d4c49c)", clipPath: "polygon(0 0,100% 0,50% 100%)", backfaceVisibility: "hidden" }} /></div>
    <Prop id="hand_flannel" x={ex - 250} y={ey + 260} w={520} r={-10} sh={0} style={{ opacity: 1 - eio(u, 0.8, 1.2) }} />
  </Cam>;
}} />;

// m33 · las dos carpetas se deslizan de a una; el lacre cae con rebote sobre la Nº 7; la medalla cuelga de la solapa de la Nº 31 sin tapar el nombre
const HQuotaBoard: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), s1 = eio(tt, 0.1, 0.8), s2 = eio(tt, 0.7, 1.4), seal = land(tt, d * 0.35, 600), med = land(tt, d * 0.62, 400);
  const F = (x: number, n: string, s: number) => <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${-900 * (1 - s)}px)` }}><Prop id="folder" x={x} y={1000} w={440} /><div style={{ position: "absolute", left: x - 170, top: 530, width: 340, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 60, color: "#3a2410" }}>FARM Nº {n}</div></div>;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={360} />
    {F(620, "7", s1)}{F(1300, "31", s2)}
    {seal.on && <Prop id="wax_seal" x={620} y={830 + seal.dy} w={210} sq={seal.sq} />}
    {seal.k > 0.95 && <div style={{ position: "absolute", left: 470, top: 860, width: 300, textAlign: "center", fontFamily: HAND, fontSize: 52, color: "#8a1a12" }}>Reprimand.</div>}
    {med.on && <div style={{ position: "absolute", left: 1450, top: 470 + med.dy, transformOrigin: "50% 0", transform: `rotate(${swing(tt, d * 0.62 + 0.2, 12, 4, 1)}deg)` }}><Prop id="medal" x={0} y={260} w={180} sh={0} /></div>}
  </Cam>;
}} />;

// m34 · el frasco del repaso: la pala echa una cucharada por paso con nube de polvo; cada capa se asienta; la etiqueta grande pegada con cinta muestra la de ahora
const SJ: [string, string][] = [["SOD", "#3a5a22"], ["PLOWED", "#2a1a0e"], ["BLOWN", "#a08a62"], ["KEPT", "#4a3420"]];
const HSoilJar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d - 1.0) / 4, A = SJ.map((_, i) => 0.75 + i * step), k = Math.max(0, A.filter((a) => tt >= a - 0.4).length - 1);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={800} />
    {SJ.map(([, c], i) => { const f = eio(tt, A[i], A[i] + 0.6); return f > 0 && <div key={i} style={{ position: "absolute", left: 790, top: 930 - (i + f) * 90, width: 340, height: 90 * f + 4, background: `linear-gradient(${c},${c}dd)`, borderRadius: "40% 40% 6px 6px / 20px 20px 6px 6px" }} />; })}
    <Prop id="glass_jar" x={960} y={1010} w={440} sh={1} style={{ opacity: 0.7 }} />
    {SJ.map((_, i) => { const p = cl((tt - A[i] + 0.5) / 0.9); return p > 0 && p < 1 && <React.Fragment key={i}><Prop id="shovel" x={1200 - 60 * Math.sin(p * Math.PI)} y={450 + 40 * Math.sin(p * Math.PI)} w={330} r={-80 + 60 * Math.sin(p * Math.PI)} sh={0} /><Puff x={980} y={380 + 100 * p} r={70 + 60 * p} col="rgba(120,90,60,.8)" o={Math.sin(p * Math.PI)} /></React.Fragment>; })}
    <div style={{ position: "absolute", left: 960, top: 700, transform: `translate(-50%,-50%) rotate(-3deg) scale(${phys(tt, A[k] + 0.2, 8, 0.5)})`, padding: "16px 34px", background: "linear-gradient(#fbf6ea,#e8dcc0)", boxShadow: "0 10px 14px rgba(0,0,0,.4)", fontFamily: SER, fontWeight: 900, fontSize: 84, color: "#2a1a0c" }}>{SJ[k][0]}
      <div style={{ position: "absolute", left: -20, top: -14, width: 90, height: 34, background: "rgba(240,230,190,.7)", transform: "rotate(-30deg)" }} /><div style={{ position: "absolute", right: -20, top: -14, width: 90, height: 34, background: "rgba(240,230,190,.7)", transform: "rotate(30deg)" }} /></div>
  </Cam>;
}} />;

// m35 · la frase final: sobre la foto del campo pelado, la mano arrastra el rollo de paja con briznas sueltas; el polvo se asienta y asoma el pasto
const HCoverSoil: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), r = eio(tt, 0.2, d - 1.6), rx = 200 + 1300 * r, gr = eio(tt, 1.6, d - 0.3);
  return <Cam tt={tt} d={d} z={0.05}>
    <Img src={staticFile("img/" + P + "L_campo.jpg")} style={{ position: "absolute", inset: 0, width: 1920, height: 1080, objectFit: "cover", filter: "saturate(.7) brightness(.85)" }} />
    <div style={{ position: "absolute", left: 0, top: 760, width: Math.max(0, rx - 120), height: 120, background: "repeating-linear-gradient(100deg,#e8cc80 0 6px,#c8a050 6px 12px,#d8b868 12px 20px)", boxShadow: "0 10px 14px rgba(0,0,0,.45)", clipPath: "polygon(0 20%,100% 0,100% 100%,0 90%)" }} />
    {Array.from({ length: 30 }, (_, k) => { const x = 40 + k * 60, g = cl((rx - 200 - x) / 300) * gr; return g > 0.02 && <div key={k} style={{ position: "absolute", left: x, top: 770 - 50 * g, width: 8, height: 50 * g, background: "#6a9a3a", transform: `rotate(${(k % 5 - 2) * 8}deg)`, transformOrigin: "50% 100%" }} />; })}
    {Array.from({ length: 16 }, (_, k) => { const p = ((tt * 0.8 + k / 16) % 1); return <div key={k} style={{ position: "absolute", left: rx - 100 - 260 * p + (k % 4) * 20, top: 800 + 160 * p * p - 30 * Math.sin(k), width: 40, height: 4, background: "#e0c070", transform: `rotate(${k * 33 + p * 200}deg)`, opacity: 1 - p }} />; })}
    {[0, 1, 2].map((k) => <Puff key={k} x={1300 + k * 200} y={760 - 40 * k} r={120} col="rgba(150,120,80,.7)" o={0.8 * (1 - r)} />)}
    <Prop id="straw_roll" x={rx} y={890} w={300} r={r * 600} />
    <Prop id="hand_glove" x={rx + 230} y={760} w={380} r={-160} sh={0} flip />
    <div style={{ position: "absolute", left: 0, top: 950, width: 1920, textAlign: "center", fontFamily: SER, fontWeight: 700, fontSize: 64, color: "#fff4dc", textShadow: "0 4px 10px #000", opacity: eio(tt, 1.2, 1.8) }}>Soil doesn't care about the plan.</div>
  </Cam>;
}} />;

export const HCB4: Record<string, C> = {
  tractorLine: HTractorLine, blackSky: HBlackSky, dustEcho: HDustEcho, breadLine: HBreadLine, soilCore: HSoilCore, herdLoop: HHerdLoop, candles: HCandles, whisper: HWhisper,
  trainCars: HTrainCars, tentCold: HTentCold, farmPins: HFarmPins, tearCalendar: HTearCalendar, grainRot: HGrainRot, poodWeight: HPoodWeight, coinRain: HCoinRain,
  moldboard: HMoldboard, wheatRepeat: HWheatRepeat, bareFallow: HBareFallow, capitolDust: HCapitolDust, lessonShelf: HLessonShelf, caliOverlay: HCaliOverlay,
  windComb: HWindComb, noonDark: HNoonDark, grainShips: HGrainShips, stripPlots: HStripPlots, flatCutter: HFlatCutter, nobleBlade: HNobleBlade, emptyStand: HEmptyStand,
  deskPlate: HDeskPlate, billEnvelopes: HBillEnvelopes, furrowYears: HFurrowYears, mailbag: HMailbag, quotaBoard: HQuotaBoard, soilJar: HSoilJar, coverSoil: HCoverSoil,
};
