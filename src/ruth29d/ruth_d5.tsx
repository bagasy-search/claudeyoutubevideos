// ruth29d · 4ª vuelta (29-oct): lo que el evaluador dejó <8 en la ronda 3. Reglas: TODO entero dentro del cuadro (margen 80 px por la cámara),
// cada objeto APOYADO con sombra de contacto, la acción ya se ve a los 0,7 s y avanza visible en cada still, manos que hacen, nada de cartel.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { Odo, Splash, Sello, Puff } from "./obj";
import { S, D, rnd } from "./ruth_d3";
import { Prop, Drop, Dust, Cam, Mesa, Agua, Rings, Word, Glow, Luz, land, swing, SER } from "./pk";

const bt = (h: H, i: number, d: number) => h.bt?.[i] ?? d;
type C = React.FC<{ t: number; h: H }>;
const SKY = "linear-gradient(#e8a060 0%,#f2d2a2 40%,#7a9a7a 52%,#2a4a42 100%)";
const DUSK = "linear-gradient(#2a2440 0%,#a86a5a 38%,#e8b080 50%,#3a5a52 52%,#14261f 100%)";
const STORM = "linear-gradient(#1a222a 0%,#3a4652 55%,#2a3a24 58%,#0e160a 100%)";
const WALL = "repeating-linear-gradient(90deg,#4a3420 0 5px,#5c4028 5px 200px)";
// reflejo de un recorte en el agua (invertido, tenue, ondulado)
const Refl: React.FC<{ id: string; x: number; y: number; w: number; tt: number; o?: number }> = ({ id, x, y, w, tt, o = 0.22 }) => <Prop id={id} x={x} y={y} w={w} sh={0} style={{ transform: `scaleY(-1) skewX(${2 * Math.sin(tt * 2)}deg)`, transformOrigin: "50% 100%", opacity: o, filter: "blur(3px)" }} />;
// mano que entra desde abajo (prop de mano, muñeca hacia abajo)
const Mano: React.FC<{ id: string; x: number; y: number; w: number; p: number; r?: number }> = ({ id, x, y, w, p, r = -70 }) => p <= 0.01 ? null : <Prop id={id} x={x} y={y + 700 * (1 - p)} w={w} r={r} sh={0} />;
// tablón de pared con veta
const Pared: React.FC = () => <div style={{ position: "absolute", inset: 0, background: WALL }} />;

// m0 · la línea de trampas: la piragua grande cruza adelante sin cortes; la jaula cuelga de la estaca con cadena y sale del agua goteando
const HTrapLine: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), rise = eio(tt, 0.3, 1.6), cx = 1240, cy = 900 - 300 * rise, px = 760 + 400 * eio(tt, 0, d);
  return <Cam tt={tt} d={d} z={0.05}>
    <Glow x={1500} y={260} r={260} o={0.9} />
    <Agua tt={tt} y0={560} />
    <Prop id="stake_tall" x={cx + 170} y={1000} w={190} sh={0} />
    <Refl id="stake_tall" x={cx + 170} y={1000} w={190} tt={tt} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${cx + 150} 330 Q${cx + 60} 360 ${cx} ${cy - 520}`} stroke="#5a5a5a" strokeWidth={9} strokeDasharray="14 6" fill="none" /></svg>
    <Prop id="cage_nutria" x={cx} y={cy} w={540} r={-3 + 3 * Math.sin(tt * 1.6)} sh={0} />
    <div style={{ position: "absolute", left: cx - 330, top: 880, width: 660, height: 220, background: "linear-gradient(rgba(42,74,66,.0),rgba(30,58,52,.95) 25%)" }} />
    {rise > 0.05 && Array.from({ length: 14 }, (_, k) => { const p = ((tt * 1.3 + k / 14) % 1); return <div key={k} style={{ position: "absolute", left: cx - 230 + (k * 37) % 460, top: cy - 40 + 300 * p * p, width: 7, height: 18, borderRadius: 6, background: "rgba(220,240,245,.8)", opacity: 1 - p }} />; })}
    <Splash x={cx} y={890} p={(tt - 0.3) / 1.2} s={1.5} />
    <Rings tt={tt} at={1.2} x={cx} y={890} s={1.4} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${px - 430} 1010 L${Math.max(0, px - 1200)} 960 M${px - 430} 1030 L${Math.max(0, px - 1200)} 1075`} stroke="rgba(235,245,240,.5)" strokeWidth={6} fill="none" /></svg>
    <Prop id="pirogue" x={px} y={1060 + 5 * Math.sin(tt * 2)} w={1400} sh={0} />
  </Cam>;
}} />;

// m0-1 · la balanza del acopiador: la balanza grande con su dial; cada piel cae, el plato baja y la aguja salta; la pila sube; el contador sube de a una
const HPeltBoard: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 8, at = (i: number) => 0.3 + i * (d - 1.6) / N, n = Array.from({ length: N }, (_, i) => tt > at(i) + 0.3 ? 1 : 0).reduce((a: number, b) => a + b, 0), sink = eio(tt, 0.2, at(N - 1) + 0.5) * 0 + n / N;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="scale_platform" x={720} y={1060 + 10 * sink} w={520} />
    {Array.from({ length: N }, (_, i) => <Drop key={i} tt={tt} at={at(i)} id="pelt_flat" x={720 + (i % 2 ? 24 : -18)} y={850 - i * 30 + 10 * sink} w={500} r={i % 2 ? 4 : -3} dust={i === 0} />)}
    <div style={{ position: "absolute", left: 1240, top: 240, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,#fbf6ea 60%,#d8ccb0)", border: "18px solid #8a8a8a", boxShadow: "0 24px 36px rgba(0,0,0,.55), inset 0 0 14px rgba(0,0,0,.3)" }}>
      {Array.from({ length: 11 }, (_, k) => <div key={k} style={{ position: "absolute", left: 211, top: 20, width: 4, height: 34, background: "#2a2a2a", transformOrigin: "2px 192px", transform: `rotate(${-120 + k * 24}deg)` }} />)}
      <div style={{ position: "absolute", left: 207, top: 40, width: 10, height: 180, borderRadius: 5, background: "#c41e1e", transformOrigin: "5px 174px", transform: `rotate(${-120 + 240 * sink + swing(tt, at(Math.max(0, Math.floor(n) - 1)) + 0.15, 6, 9, 3)}deg)` }} />
      <div style={{ position: "absolute", left: 192, top: 192, width: 40, height: 40, borderRadius: "50%", background: "#3a3a3a" }} /></div>
    <div style={{ position: "absolute", left: 1170, top: 760, width: 600, height: 170, borderRadius: 20, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    <Odo x={1470} y={845} v={Math.round(1800000 * n / N)} n={7} size={110} />
  </Cam>;
}} />;

// m1 · la marisma se perfora: el arco de pie arriba del bloque; en la cara de arriba se abren tres agujeros iris de agua negra que crecen y se unen; el arco se hunde
const HMarshHoles: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), Ho = [[760, 470, 0.4], [1000, 500, 1.0], [1200, 470, 1.6]], sinkG = eio(tt, d - 2.2, d - 0.6), grow = eio(tt, 2.2, d - 1.2);
  return <Cam tt={tt} d={d} z={0.07} fy={520}>
    <Agua tt={tt} y0={760} o={0.95} />
    <Prop id="marsh_chunk" x={960} y={1010} w={1260} />
    {Ho.map(([x, y, a], i) => { const g = phys(tt, a, 6, 0.6) * (1 + 0.9 * grow); return g <= 0.01 ? null : <div key={i} style={{ position: "absolute", left: x - 110 * g, top: y - 34 * g, width: 220 * g, height: 68 * g, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #050a08 45%, #1a2a22 66%, #4a3820 82%, #6a5230 100%)", boxShadow: "inset 0 8px 16px rgba(0,0,0,.9), 0 3px 0 rgba(120,90,50,.8)" }} />; })}
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${1080 - 520 - 100 * sinkG}px 0)` }}><Prop id="soccer_goal" x={1000} y={500 + 140 * sinkG} w={300} r={7 * sinkG} /></div>
    <Rings tt={tt} at={d - 1.6} x={1000} y={510} s={0.9} />
  </Cam>;
}} />;

// m1-2 · la recompensa por cola: tres colas se hamacan de sus broches; caen tres fajos al frasco y rebotan contra el vidrio hasta llenarlo un tercio
const HTailTag: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), A = [d * 0.3, d * 0.5, d * 0.7];
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={860} />
    <div style={{ position: "absolute", left: -20, top: 150, width: 1960, height: 6, background: "#c8b08a", transform: "rotate(1.2deg)", boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />
    {[0, 1, 2].map((i) => { const L = land(tt, 0.1 + i * 0.35, 500), a = swing(tt, 0.4 + i * 0.35, 16, 2.6 + i * 0.4, 0.5); return !L.on ? null : <div key={i} style={{ position: "absolute", left: 260 + i * 330, top: 160 + L.dy, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <Prop id="tail" x={0} y={700} w={620} sh={0} style={{ transform: "rotate(90deg)", transformOrigin: "50% 0" }} /><Prop id="clothespin" x={0} y={110} w={160} r={90} sh={0} /></div>; })}
    <Prop id="jar" x={1460} y={960} w={420} style={{ opacity: 0.55 }} />
    {A.map((a, i) => { const L = land(tt, a, 700, 10, 0.3); return L.on && <Prop key={i} id="bill_roll" x={1440 + (i - 1) * 50} y={925 - i * 120 + L.dy} w={300} r={-14 + i * 12} sq={L.sq} sh={0} />; })}
    <Prop id="jar" x={1460} y={960} w={420} sh={0} style={{ opacity: 0.32, mixBlendMode: "screen" }} />
    {A.map((a, i) => <Rings key={i} tt={tt} at={a + 0.1} x={1460} y={560} s={0.25} />)}
  </Cam>;
}} />;

// m2 · el pastel de causas: la pala de plata entra por debajo y levanta la porción (siempre en cuadro); el repasador grande cae y tapa el plato
const HPieSlice: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sv = eio(tt, 0.2, 0.9), up = eio(tt, 1.0, 2.0), tw = d * 0.7, T = land(tt, tw, 800, 7, 0.45);
  const sx = 1080 + 120 * up, sy = 880 - 200 * up;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={760} />
    <Prop id="pie" x={860} y={1000} w={1000} />
    <Prop id="pie_slice" x={sx} y={sy} w={440} r={-6 * up} sh={1 - up} />
    <div style={{ position: "absolute", left: sx - 180 + 460 * (1 - sv), top: sy - 20, width: 320, height: 26, borderRadius: "30px 8px 8px 30px", background: "linear-gradient(#f8f8f8,#a8acb0 60%,#6a6e72)", transform: `rotate(${-6 * up}deg)`, boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: sx + 130 + 460 * (1 - sv), top: sy - 22, width: 340, height: 30, borderRadius: 14, background: "linear-gradient(#5a3a22,#2a1a0e)", transform: `rotate(${-6 * up}deg)` }} />
    {up > 0.3 && T.on === false && Array.from({ length: 4 }, (_, k) => <Puff key={k} x={sx - 40 + k * 40} y={sy - 360 - 80 * ((tt * 0.6 + k * 0.25) % 1)} r={50} o={0.3 * (1 - ((tt * 0.6 + k * 0.25) % 1))} />)}
    {T.on && <Prop id="towel" x={860} y={1040 + T.dy} w={1300} sq={T.sq * 0.6} sh={0} />}
    <Dust tt={tt} at={tw + 0.12} x={860} y={1000} w={700} col="rgba(240,230,220,.6)" />
  </Cam>;
}} />;

// m2-3 · el animal: la cara enorme; un anillo de luz cálida sale de los dientes y recorre el pelaje; el globo gira y el alfiler grande cae en Sudamérica
const HIncisors: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ring = cl((tt - 0.5) / 1.4), pin = land(tt, d * 0.4, 600);
  return <Cam tt={tt} d={d} z={0.06} fx={600}>
    <Prop id="nutria_face" x={600} y={1090} w={980} />
    <div style={{ position: "absolute", left: 610 - 500 * ring, top: 840 - 500 * ring, width: 1000 * ring, height: 1000 * ring, borderRadius: "50%", border: `${30 * (1 - ring)}px solid rgba(255,180,80,${0.7 * (1 - ring)})`, filter: "blur(6px)", mixBlendMode: "screen" }} />
    <Glow x={610} y={840} r={220} o={0.5 + 0.5 * Math.exp(-2 * Math.abs(tt - 0.6))} col="255,170,60" />
    <div style={{ position: "absolute", left: 470, top: 880, width: 280, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.35),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1460px 700px", transform: `perspective(1400px) rotateY(${-25 + 50 * eio(tt, 0, d * 0.45)}deg)` }}><Prop id="globe" x={1460} y={1010} w={600} /></div>
    {pin.on && <div style={{ position: "absolute", left: 1415, top: 600 + pin.dy, transform: `scale(${1 + 0.25 * pin.sq},${1 - 0.25 * pin.sq})`, transformOrigin: "50% 100%" }}><div style={{ width: 84, height: 84, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#b3221a 60%,#5a0a06)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }} /><div style={{ width: 8, height: 90, margin: "0 auto", background: "linear-gradient(90deg,#888,#eee,#777)" }} /></div>}
    <Rings tt={tt} at={d * 0.4 + 0.2} x={1457} y={780} s={0.5} />
  </Cam>;
}} />;

// m4 · todos querían un tapado: el tapado cae al gancho; el perchero se inclina sobre su base y rebota; el cuello se acomoda en los hombros y el sombrero baja al gancho de arriba
const HCoatRack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), c = land(tt, 0.2, 700), tilt = tt < 0.45 ? 0 : 9 * Math.exp(-1.6 * (tt - 0.45)) * Math.sin((tt - 0.45) * 7), col = eio(tt, d * 0.4, d * 0.4 + 0.8), hat = land(tt, d * 0.62, 500);
  return <Cam tt={tt} d={d} z={0.05} fy={600}>
    <Mesa y0={940} tone="#7a5636" />
    <div style={{ position: "absolute", left: 960 - 300 + 20 * tilt, top: 1000, width: 600 + 40 * Math.abs(tilt), height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.5),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 1030px", transform: `rotate(${tilt}deg)` }}>
      <Prop id="coat_rack" x={960} y={1030} w={300} sh={0} />
      {c.on && <Prop id="fur_coat" x={968} y={890 + c.dy} w={470} sq={c.sq * 0.5} sh={0} />}
      {col > 0 && <Prop id="fur_collar" x={968 - 700 * (1 - col)} y={330 + 120 * (1 - col) * (1 - col)} w={380} sh={0} r={-20 * (1 - col)} />}
      {hat.on && <Prop id="fur_hat" x={960} y={215 + hat.dy} w={230} sq={hat.sq} sh={0} />}
    </div>
  </Cam>;
}} />;

// m5 · los corrales por el país: el mapa en piezas de cartón grueso; cada cerca cae dentro de su estado con polvo y un alfiler con banderita
const PCS = [[300, 200, 380, 300], [700, 170, 360, 330], [1080, 200, 340, 310], [1420, 260, 380, 300], [640, 560, 420, 300], [1080, 590, 400, 300]];
const HPenMap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 1.0), on = [0, 1, 3, 4, 5];
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={120} />
    {PCS.map(([x, y, w, hh], i) => { const L = land(tt, 0.05 + i * 0.08, 300); return L.on && <div key={i} style={{ position: "absolute", left: x - w / 2 + 120, top: y + L.dy, width: w, height: hh, background: `linear-gradient(135deg,${i % 2 ? "#d8ab72" : "#c89a62"},#a87a48)`, clipPath: "polygon(4% 8%,30% 0,70% 5%,100% 14%,96% 70%,80% 100%,30% 94%,0 80%)", boxShadow: "0 14px 0 #5a3a1c", filter: "drop-shadow(0 18px 14px rgba(0,0,0,.5))" }} />; })}
    {on.map((i, k) => { const [x, y, w, hh] = PCS[i], at = b0 + k * 0.6, cx = x + 120, cy = y + hh * 0.7; return <React.Fragment key={i}>
      <Drop tt={tt} at={at} id="fence" x={cx} y={cy} w={w * 0.62} />
      {tt > at + 0.3 && <Prop id="survey_flag" x={cx + w * 0.3} y={cy - 20 + 160 * (1 - eio(tt, at + 0.3, at + 0.5))} w={70} sh={0} />}</React.Fragment>; })}
  </Cam>;
}} />;

// m6 · el huracán: la puerta del corral se abre de golpe y rebota; tres nutrias saltan en arco dejando huellas; la rama cruza adelante; el viento se lleva el cartel
const HHurricanePen: C = ({ t, h }) => <S t={t} h={h} bg={STORM} f={(tt) => {
  const d = D(h), shake = 6 * Math.sin(tt * 23), op = 0.8, door = tt < op ? 0 : 100 - 100 * Math.exp(-3 * (tt - op)) * Math.cos((tt - op) * 9), sg = cl((tt - d * 0.6) / 1.4), br = (tt - 0.2) / 1.6;
  return <Cam tt={tt} d={d} z={0.05}>
    {Array.from({ length: 70 }, (_, k) => { const p = (tt * 1.8 + k / 70) % 1; return <div key={k} style={{ position: "absolute", left: (k * 97) % 2100 - 100 + 300 * p, top: -100 + 1200 * p, width: 3, height: 70, background: "rgba(200,215,230,.35)", transform: "rotate(18deg)" }} />; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${shake}px)` }}><Prop id="wire_pen" x={700} y={960} w={900} /></div>
    <div style={{ position: "absolute", left: 1150, top: 640, width: 260, height: 300, transformOrigin: "0 50%", transform: `perspective(1200px) rotateY(${-door}deg)`, background: "repeating-linear-gradient(0deg,rgba(200,200,200,.7) 0 3px,transparent 3px 30px), repeating-linear-gradient(90deg,rgba(200,200,200,.7) 0 3px,transparent 3px 30px)", border: "10px solid #b8945a", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }} />
    {[0, 1, 2].map((i) => { const a = op + 0.2 + i * 0.5, p = cl((tt - a) / 1.0), x = 1260 + 480 * p; return p <= 0 ? null : <React.Fragment key={i}>
      {p < 1 && <Prop id="nutria_run" x={x} y={930 - 220 * Math.sin(p * Math.PI) + i * 30} w={300} r={-16 + 32 * p} />}
      {Array.from({ length: Math.floor(p * 5) }, (_, j) => <div key={j} style={{ position: "absolute", left: 1280 + j * 100, top: 960 + i * 30, width: 26, height: 16, borderRadius: "50%", background: "rgba(40,30,20,.75)" }} />)}</React.Fragment>; })}
    <div style={{ position: "absolute", left: 1180 + 600 * sg, top: 420 - 300 * sg, transform: `rotate(${-8 + 300 * sg}deg)`, padding: "18px 34px", background: "linear-gradient(#e8d8b0,#c8b088)", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#3a2410", boxShadow: "0 14px 18px rgba(0,0,0,.5)", opacity: 1 - eio(sg, 0.85, 1) }}>LEGEND</div>
    {br > 0 && br < 1 && <Prop id="branch" x={-300 + 2600 * br} y={540 + 80 * Math.sin(br * 6)} w={900} r={-30 + 300 * br} sh={0} blur={7} />}
  </Cam>;
}} />;

// m6-7 · el mito: la hoja entera con margen; las barras golpean y el carro corre; la frase grande se tacha de lado a lado; el sello cae a la derecha sin tapar
const HMythCheck: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), txt = "STORM LET THEM OUT", n = Math.floor(cl((tt - 0.3) / 2.0) * txt.length), typing = n < txt.length && tt > 0.3, b2 = bt(h, 2, d * 0.6), st = cl((tt - b2) / 0.5), car = 60 * (n / txt.length);
  return <Cam tt={tt} d={d} z={0.04} fy={420}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 470 - car, top: 120, width: 980, height: 560, background: "linear-gradient(#fbf6ea,#ece2c8)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: 60, top: 150, width: 860, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 96, lineHeight: 1.15, color: "#1a1a1a" }}>{txt.slice(0, n)}</div>
      <div style={{ position: "absolute", left: 40, top: 210, width: 900 * st, height: 26, background: "#c41e1e", borderRadius: 12, transform: "rotate(-2deg)", opacity: 0.92 }} />
      <div style={{ position: "absolute", left: 40, top: 320, width: 900 * st, height: 26, background: "#c41e1e", borderRadius: 12, transform: "rotate(1deg)", opacity: 0.92 }} /></div>
    {typing && <div style={{ position: "absolute", left: 900, top: 640, width: 14, height: 120, background: "linear-gradient(90deg,#333,#999,#333)", transformOrigin: "50% 100%", transform: `rotate(${-40 + 40 * Math.abs(Math.sin(tt * 30))}deg)` }} />}
    <Prop id="typewriter" x={960 + (typing ? 2 * Math.sin(tt * 60) : 0)} y={1060} w={1000} />
    <Sello tt={tt} at={b2 + 0.6} x={1640} y={400} txt="MYTH" size={110} r={-14} />
  </Cam>;
}} />;

// m7 · muchas manos: UNA jaula grande al frente; manos de a una suben desde abajo y levantan el pestillo; la puerta cae con rebote y la nutria sale corriendo
const HManyHands: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hands = ["hand_glove", "hand_flannel", "hand_watch"], step = (d - 0.8) / 3, i = Math.min(2, Math.max(0, Math.floor((tt - 0.2) / step))), a = 0.2 + i * step, u = tt - a;
  const hp = eio(u, 0, 0.5) * (1 - eio(u, step - 0.5, step)), door = u < 0.7 ? 0 : 1 - Math.exp(-4 * (u - 0.7)) * Math.cos((u - 0.7) * 10), run = cl((u - 0.9) / 1.1);
  return <Cam tt={tt} d={d} z={0.05}>
    <Pared />
    <Mesa y0={760} />
    <Prop id="cage_open" x={330} y={760} w={400} blur={5} o={0.75} />
    <Prop id="cage_open" x={1600} y={760} w={400} blur={5} o={0.75} />
    <Prop id="cage_open" x={960} y={1000} w={880} />
    <div style={{ position: "absolute", left: 1400, top: 540, width: 30, height: 440, background: "repeating-linear-gradient(0deg,#6a6a6a 0 4px,transparent 4px 34px), linear-gradient(90deg,#4a4a4a,#9a9a9a,#4a4a4a)", transformOrigin: "50% 100%", transform: `perspective(1000px) rotateX(${-80 * cl(door)}deg)` }} />
    <Prop key={i} id={hands[i]} x={1520} y={760} w={440} r={-110} sh={0} style={{ transform: `translateY(${600 * (1 - hp)}px) rotate(-110deg)` }} />
    {run > 0 && run < 1 && <Prop id="nutria_run" x={1300 + 500 * run * (i % 2 ? 1 : 1) - (i === 1 ? 900 * run : 0)} y={985} w={300} flip={i === 1} />}
    {run > 0 && <Dust tt={tt} at={a + 0.9} x={1450} y={990} w={180} />}
  </Cam>;
}} />;

// m8 · el jacinto: la nutria entra nadando desde el primer segundo con estela en V que abre las flores; muerde una, el tallo se tuerce y se hunde con tres anillos
const HHyacinthDitch: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#b8c8d8 0%,#d8d8c8 30%,#5a7a5a 34%,#2a4a42)" f={(tt) => {
  const d = D(h), bite = d * 0.6, nx = 180 + 1000 * eio(tt, 0, bite), F = Array.from({ length: 8 }, (_, i) => ({ x: 260 + i * 210 + (i % 2) * 40, y: 640 + (i % 3) * 140, w: 240 + (i % 3) * 50 })), tw = cl((tt - bite) / 1.2);
  return <Cam tt={tt} d={d} z={0.05}>
    {[0, 1, 2].map((k) => <Prop key={k} id="hyacinth" x={300 + k * 600} y={370} w={180} sh={0} style={{ filter: "blur(3px) brightness(.8)" }} />)}
    <Agua tt={tt} y0={366} col="#5a7a5a" />
    <div style={{ position: "absolute", left: 0, top: 366, width: 1920, height: 140, background: "linear-gradient(rgba(220,230,220,.35),transparent)" }} />
    {F.map((f, i) => { const push = nx > f.x - 300 && nx < f.x + 100 ? (f.y > 760 ? 1 : -1) * 70 * Math.sin(cl((nx - f.x + 300) / 400) * Math.PI) : 0, hit = i === 4; return <React.Fragment key={i}>
      <Prop id="hyacinth" x={f.x} y={f.y + push + 4 * Math.sin(tt * 2 + i) + (hit ? 200 * eio(tw, 0.3, 1) : 0)} w={f.w} r={hit ? 50 * Math.sin(tw * 5) * (1 - tw) : 0} o={hit ? 1 - 0.9 * eio(tw, 0.5, 1) : 1} sh={0} />
      <Refl id="hyacinth" x={f.x} y={f.y + push} w={f.w} tt={tt} o={0.12} /></React.Fragment>; })}
    {[0, 0.3, 0.6].map((dl, k) => <Rings key={k} tt={tt} at={bite + 0.4 + dl} x={F[4].x} y={F[4].y} s={1.1} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${nx - 160} 800 L${Math.max(0, nx - 800)} 700 M${nx - 160} 820 L${Math.max(0, nx - 800)} 940`} stroke="rgba(235,245,240,.6)" strokeWidth={9} fill="none" strokeLinecap="round" /></svg>
    <Prop id="nutria_swim" x={nx} y={830} w={560} sh={0} />
  </Cam>;
}} />;

// m9 · a otros estados: el barco entra deslizando y queda entero; la red tensa baja tres cajones, golpean y el barco se escora con ondas; el sello SHIPPED cae en la tapa del cajón del frente
const HCrateShip: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8d4dc,#e8e0d0 45%,#5a7a8a 55%,#2a4050)" f={(tt) => {
  const d = D(h), sx = 1100 - 500 * (1 - eio(tt, 0, 0.8)), dn = eio(tt, 0.6, 2.0), a = swing(tt, 0.6, 5, 2.2, 0.5), hit = 2.0, tilt = tt > hit ? 2.5 * Math.exp(-2 * (tt - hit)) * Math.sin((tt - hit) * 6) : 0, st = d * 0.62;
  return <Cam tt={tt} d={d} z={0.04}>
    <Agua tt={tt} y0={600} col="#5a7a8a" deep="#1a2a36" />
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${sx}px 780px`, transform: `rotate(${tilt}deg)` }}><Prop id="cargo_ship" x={sx} y={800} w={1300} sh={0} /></div>
    <Rings tt={tt} at={hit} x={sx} y={790} s={2.2} />
    <div style={{ position: "absolute", left: sx + 40, top: 0, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: -4, top: 0, width: 8, height: 80 + 230 * dn, background: "linear-gradient(90deg,#333,#999,#333)" }} />
      <Prop id="net_crates" x={0} y={420 + 230 * dn} w={300} sh={0} /></div>
    <Drop tt={tt} at={st - 0.6} id="crate" x={520} y={1030} w={440} />
    <Sello tt={tt} at={st} x={460} y={800} txt="SHIPPED" size={78} r={-8} />
  </Cam>;
}} />;

// m10 · la cosecha por década: la balanza de platillo grande; los fardos caen al platillo y lo hunden con rebote, la aguja barre al tope con los 70; los que sobran ruedan
const HHarvestBars: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), Y = ["1940s", "1950s", "1960s", "1970s"], step = (d - 1.2) / 4, k = Math.min(3, Math.max(0, Math.floor((tt - 0.3) / step))), load = [0.15, 0.35, 0.6, 1.15][k], lv = eio(tt, 0.3 + k * step, 0.6 + k * step);
  const prev = k ? [0.15, 0.35, 0.6, 1.15][k - 1] : 0, w8 = prev + (load - prev) * lv, ang = -100 + 200 * Math.min(1, w8) + (tt > 0.3 ? swing(tt, 0.6 + k * step, 6, 8, 2.5) : 0), sink = 60 * Math.min(1, w8);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 1320, top: 180, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,#fbf6ea 60%,#d8ccb0)", border: "18px solid #6a6e72", boxShadow: "0 24px 36px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 186, top: 30, width: 12, height: 170, borderRadius: 6, background: "#c41e1e", transformOrigin: "6px 162px", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: 172, top: 172, width: 40, height: 40, borderRadius: "50%", background: "#333" }} />
      <div style={{ position: "absolute", left: 0, top: 260, width: 384, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 64, color: "#2a2a2a" }}>{Y[k]}</div></div>
    <div style={{ position: "absolute", left: 1510, top: 600, width: 24, height: 300, background: "linear-gradient(90deg,#4a4a4a,#9a9a9a,#4a4a4a)" }} />
    <div style={{ position: "absolute", left: 360, top: 790 + sink, width: 760, height: 40, borderRadius: "50%", background: "linear-gradient(#b8bcc0,#6a6e72)", boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 720, top: 810 + sink, width: 24, height: 120, background: "#5a5e62" }} />
    {Array.from({ length: [1, 2, 3, 5][k] }, (_, i) => { const at = 0.3 + k * step + i * 0.25, L = land(tt, at, 600); return L.on && <Prop key={k + "_" + i} id="pelt_bale" x={520 + (i % 3) * 220 + (i > 2 ? 110 : 0)} y={800 + sink - (i > 2 ? 180 : 0) + L.dy} w={240} sq={L.sq} />; })}
    {k === 3 && [0, 1].map((j) => { const p = cl((tt - (0.3 + 3 * step + 1.3 + j * 0.3)) / 1.0); return p > 0 && <Prop key={j} id="pelt_bale" x={1080 + 260 * p + j * 60} y={820 + sink + 160 * p * p} w={170} r={240 * p} />; })}
  </Cam>;
}} />;

// m11 · el campamento: la piragua grande atada al pilote se mece con reflejo; humo enroscado de la chimenea; farol en la ventana; la garza cruza la luna
const HStiltCamp: C = ({ t, h }) => <S t={t} h={h} bg={DUSK} f={(tt) => {
  const d = D(h), hx = 2000 - 2200 * cl((tt - 0.3) / (d - 0.5)), rock = 2 * Math.sin(tt * 1.4);
  return <Cam tt={tt} d={d} z={0.05} fx={1200}>
    <div style={{ position: "absolute", left: 640, top: 140, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#fff8e8,#e8d8b0)", boxShadow: "0 0 80px 30px rgba(255,240,210,.35)" }} />
    <Prop id="heron" x={hx} y={320} w={520} r={-4} sh={0} />
    <Agua tt={tt} y0={580} col="#3a5a52" deep="#0e1c18" />
    <div style={{ position: "absolute", left: 690, top: 600, width: 80, height: 300, background: "linear-gradient(rgba(255,240,210,.25),transparent)", filter: "blur(6px)" }} />
    <Prop id="stilt_camp" x={1320} y={770} w={680} sh={0} />
    <Refl id="stilt_camp" x={1320} y={770} w={680} tt={tt} />
    <Glow x={1290} y={560} r={80} o={0.8 + 0.2 * Math.sin(tt * 7)} col="255,190,90" />
    {Array.from({ length: 6 }, (_, k) => { const p = (tt * 0.35 + k / 6) % 1; return <Puff key={k} x={1395 + 60 * Math.sin(p * 7 + k) + 80 * p} y={430 - 360 * p} r={30 + 60 * p} col="rgba(200,200,210,.7)" o={0.6 * (1 - p)} />; })}
    <Prop id="piling" x={360} y={1060} w={130} sh={0} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M380 760 Q500 ${860 + 10 * rock} 620 ${905 + 6 * rock}`} stroke="#c8a870" strokeWidth={7} fill="none" /></svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 1000px", transform: `rotate(${rock * 0.6}deg)` }}><Prop id="pirogue" x={960} y={1010} w={1200} sh={0} /></div>
    <Refl id="pirogue" x={960} y={1010} w={1200} tt={tt} o={0.18} />
  </Cam>;
}} />;

// m12 · la cuenta en chapas: el aro de hierro cuelga del clavo grande; cada chapa cae, se enhebra con rebote y hamaca el aro; la 12 se acerca a cámara sin salir
const HTrapCount: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#5a3e24 0 6px,#6a4a2c 6px 180px)" f={(tt) => {
  const d = D(h), N = 7, at = (i: number) => 0.3 + i * (d - 2.2) / N, a = Array.from({ length: N }, (_, i) => swing(tt, at(i) + 0.2, 6, 3.4, 1.0)).reduce((x, y) => x + y, 0), fly = eio(tt, d - 1.5, d - 0.6);
  return <Cam tt={tt} d={d} z={0.04} fy={400}>
    <Luz />
    <div style={{ position: "absolute", left: 930, top: 130, width: 60, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.5),transparent 70%)" }} />
    <Prop id="iron_nail" x={960} y={170} w={70} r={90} sh={0} />
    <div style={{ position: "absolute", left: 960, top: 150, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: -230, top: 0, width: 460, height: 460, borderRadius: "50%", border: "20px solid #6a6e72", boxShadow: "0 14px 18px rgba(0,0,0,.55), inset 0 0 8px rgba(0,0,0,.6)" }} />
      {Array.from({ length: N }, (_, i) => { const L = land(tt, at(i), 400), ang = (200 + i * 23) * Math.PI / 180; if (!L.on) return null; const x = Math.cos(ang) * 225, y = 230 - Math.sin(ang) * 225 + 120, last = i === N - 1;
        return <Prop key={i} id={last ? "small_tin" : "brass_tag"} x={x + (last ? -x * fly : 0)} y={y + L.dy + (last ? (560 - y) * fly : 0)} w={(last ? 150 : 120) * (last ? 1 + 2.3 * fly : 1)} r={(i - 3) * 10 * (last ? 1 - fly : 1)} sh={0} />; })}
    </div>
  </Cam>;
}} />;

// m13 · el cuereado: la mano del chico (manga arremangada) entra desde abajo con la cuchilla y raspa; cada pasada suelta virutas y pelos; las hormas se hamacan
const HStretchBoards: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), seg = (d - 0.6) / 3, i = Math.min(2, Math.floor(Math.max(0, tt - 0.3) / seg)), u = (Math.max(0, tt - 0.3) % seg) / seg, ky = 420 + 360 * (0.5 - 0.5 * Math.cos(u * Math.PI * 4)), hin = eio(tt, 0, 0.5);
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <div style={{ position: "absolute", left: 200, top: 210, width: 1520, height: 34, background: "linear-gradient(#8a6238,#4a2e16)", boxShadow: "0 12px 18px rgba(0,0,0,.5)" }} />
    {[0, 1, 2].map((k) => { const a = swing(tt, 0.1, 3, 2.4 + k * 0.3, 0.3) + (k === i ? 2 * Math.sin(tt * 18) : 0); return <div key={k} style={{ position: "absolute", left: 500 + k * 460, top: 244, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <Prop id="stretch_board" x={0} y={760} w={220} sh={0} /><div style={{ position: "absolute", left: 30, top: 60, width: 160, height: 700, background: "radial-gradient(ellipse,rgba(0,0,0,.3),transparent 70%)", zIndex: -1 }} /></div>; })}
    <Prop id="child_hand" x={500 + i * 460 + 190} y={ky + 480 + 600 * (1 - hin)} w={420} r={-80} sh={0} />
    {Array.from({ length: 14 }, (_, k) => { const p = ((tt * 1.6 + k / 14) % 1); return <div key={k} style={{ position: "absolute", left: 500 + i * 460 + (k - 7) * 16 + 120 * p * (k % 2 ? 1 : -1), top: ky + 60 + 420 * p * p, width: k % 3 ? 14 : 22, height: 5, borderRadius: 3, background: k % 3 ? "#7a5232" : "#e8d8b8", opacity: hin * (1 - p), transform: `rotate(${k * 40 + p * 300}deg)` }} />; })}
  </Cam>;
}} />;

// m14 · el balancín: la nutria grande cae con squash, la tabla se hunde con polvo; las ratas salen de a una en arco girando y caen al pasto con sombra
const HSeesawMusk: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c4d8,#e8e4d0 50%,#7a9a4a 52%,#3a5a22)" f={(tt) => {
  const d = D(h), at = 0.6, L = land(tt, at, 700), ang = -12 + 24 * eio(tt, at + 0.05, at + 0.3) + swing(tt, at + 0.3, 3, 6, 2);
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: -200, top: 560, width: 2320, height: 700, background: "repeating-linear-gradient(95deg,rgba(0,0,0,.06) 0 3px,transparent 3px 22px)", transform: "perspective(900px) rotateX(40deg)", transformOrigin: "50% 0" }} />
    {[[300, 600], [1600, 590]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x, top: y, width: 260, height: 120, borderRadius: "50% 50% 10% 10%", background: "radial-gradient(ellipse at 50% 30%,#6a8a3a,#3a5a22)", filter: "blur(2px)" }} />)}
    <div style={{ position: "absolute", left: 830, top: 960, width: 280, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.5),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 900, top: 780, width: 0, height: 0, borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderBottom: "190px solid #6a4626", filter: "drop-shadow(0 12px 10px rgba(0,0,0,.5))" }} />
    <div style={{ position: "absolute", left: 970, top: 790, height: 1080, transformOrigin: "0 0", transform: `rotate(${ang}deg)` }}>
      <div style={{ position: "absolute", left: -640, top: -24, width: 1280, height: 48, borderRadius: 8, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 70px), linear-gradient(#c89a62,#7a5230)", boxShadow: "0 14px 16px rgba(0,0,0,.45)" }} />
      {L.on && <Prop id="nutria_big" x={420} y={-24 + Math.min(0, L.dy)} w={500} sq={L.sq} sh={0} />}
      {[0, 1, 2].map((k) => tt < at + 0.3 + k * 0.35 && <Prop key={k} id="muskrat" x={-560 + k * 160} y={-24} w={220} sh={0} />)}
    </div>
    <Dust tt={tt} at={at + 0.1} x={1390} y={720} w={340} />
    {[0, 1, 2].map((k) => { const s = at + 0.3 + k * 0.35, p = cl((tt - s) / 1.1), x0 = 410 + k * 160, x1 = 220 + k * 260, x = x0 + (x1 - x0) * p, y = 760 - (380 + k * 60) * Math.sin(p * Math.PI) + (980 - 760) * p; return p <= 0 ? null : <React.Fragment key={k}>
      <div style={{ position: "absolute", left: x - 90, top: 990, width: 180, height: 30, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(0,0,0,${0.15 + 0.35 * p}),transparent 70%)` }} />
      <Prop id="muskrat" x={x} y={y} w={220} r={p < 1 ? 360 * p * (k % 2 ? -1 : 1) : 0} sh={0} />{p >= 1 && <Dust tt={tt} at={s + 1.1} x={x1} y={990} w={120} />}</React.Fragment>; })}
  </Cam>;
}} />;

// m15-16 · la canilla: nutrias el doble bajan por la manguera de goma al barril; salen en tropel por la canilla; la mano gira la canilla, el chorro se corta y el nivel sube sobre la raya
const HCheckValve: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = d * 0.55, lvl = cl(0.3 + 0.55 * eio(tt, cut + 0.2, cut + 1.6)) + (tt > cut + 1.6 ? 0.02 * Math.sin((tt - cut) * 8) * Math.exp(-(tt - cut - 1.6)) : 0), hand = eio(tt, cut - 0.6, cut) * (1 - eio(tt, cut + 1.0, cut + 1.5));
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={920} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M300 -20 Q300 200 560 300" stroke="#1e1e1e" strokeWidth={70} fill="none" strokeLinecap="round" /><path d="M300 -20 Q300 200 560 300" stroke="rgba(255,255,255,.12)" strokeWidth={16} fill="none" transform="translate(-14 -6)" /></svg>
    <Prop id="barrel" x={760} y={1020} w={620} />
    <div style={{ position: "absolute", left: 1150, top: 330, width: 80, height: 560, borderRadius: 40, background: "linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.08) 40%,rgba(255,255,255,.3))", border: "4px solid rgba(220,220,220,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 560 * lvl, background: "linear-gradient(90deg,#6a4a2a,#a07040,#6a4a2a)" }} /></div>
    <div style={{ position: "absolute", left: 1120, top: 330 + 560 * 0.42, width: 140, height: 10, background: "#d42a1e" }} />
    {Array.from({ length: 4 }, (_, k) => { const p = (tt * 0.8 + k / 4) % 1; return p < 0.75 && <Prop key={k} id="nutria_run" x={300 + 260 * p} y={40 + 300 * p} w={300} r={40} sh={0} o={eio(p, 0, 0.1)} />; })}
    {tt < cut + 0.2 && Array.from({ length: 4 }, (_, k) => { const p = (tt * 0.6 + k / 4) % 1; return <Prop key={"o" + k} id="nutria_run" x={860 + 760 * p} y={1000 - 30 * Math.sin(p * 9)} w={320} sh={0.6} o={1 - eio(p, 0.85, 1)} />; })}
    <Prop id="lever_hand" x={990} y={980 + 500 * (1 - hand)} w={360} r={-20 + 70 * eio(tt, cut - 0.2, cut + 0.4)} sh={0} />
  </Cam>;
}} />;

// m16 · el precio se derrumba: la piel cuelga del clavo con cuerda y se achica en tres pasos; la mano con tiza escribe; la esponja cruza dejando estela húmeda
const HPriceTag: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 1.4), b1 = bt(h, 1, d * 0.6), st = tt < b0 ? 0 : tt < b1 ? 1 : 2, s0 = [0.2, b0, b1][st], P = ["$8", "$3", "50¢"], sc = [1, 0.7, 0.42][st];
  const wr = cl((tt - s0 - 0.1) / 0.9), wipe = (a: number) => cl((tt - a + 0.6) / 0.6) * (tt < a ? 1 : 0), wx = Math.max(wipe(b0), wipe(b1));
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <Prop id="iron_nail" x={480} y={200} w={70} r={90} sh={0} />
    <div style={{ position: "absolute", left: 480, top: 190, height: 1080, transformOrigin: "0 0", transform: `rotate(${swing(tt, s0, 6, 3, 0.8)}deg)` }}>
      <svg width={40} height={80} style={{ position: "absolute", left: -20, top: 0 }}><path d="M20 0 L8 80 M20 0 L32 80" stroke="#c8a870" strokeWidth={5} /></svg>
      <Prop id="pelt_flat" x={0} y={80 + 560 * sc * phys(tt, s0, 7, 0.5)} w={540 * sc * phys(tt, s0, 7, 0.5)} sh={0} style={{ transform: "rotate(90deg)", transformOrigin: "50% 0" }} /></div>
    <Prop id="chalkboard" x={1300} y={900} w={760} />
    <div style={{ position: "absolute", left: 1300, top: 600, transform: "translate(-50%,-50%)", fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontSize: 220, color: "rgba(245,245,240,.92)", clipPath: `inset(0 ${100 - 100 * wr}% 0 0)` }}>{P[st]}</div>
    {wr > 0 && wr < 1 && <><Prop id="chalk_hand" x={1110 + 380 * wr} y={760 + 20 * Math.sin(wr * 30)} w={360} r={-20} sh={0} /><Puff x={1120 + 360 * wr} y={620} r={30} col="rgba(250,250,245,.6)" o={0.6} /></>}
    {wx > 0 && <><div style={{ position: "absolute", left: 970, top: 470, width: 660 * wx, height: 260, background: "linear-gradient(90deg,rgba(40,50,50,.0),rgba(60,70,70,.55))", filter: "blur(4px)" }} /><Prop id="sponge" x={960 + 680 * wx} y={720} w={240} r={-10 + 20 * wx} sh={0} /></>}
  </Cam>;
}} />;

// m16-17 · no vale la nafta: el bidón vierte un chorro ámbar continuo al motor; en la mirilla del bidón el nivel baja hasta la raya de «una piel»
const HGasCan: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tilt = eio(tt, 0.3, 1.0), pour = tt > 0.9, lv = 1 - 0.78 * eio(tt, 0.9, d - 0.6), cough = Math.max(0, Math.sin(tt * 5)) ** 6;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="outboard" x={560 + 5 * cough} y={1050} w={560} r={-2 * cough} />
    {[0, 1, 2].map((k) => <Puff key={k} x={400 - 40 * k - 60 * ((tt * 0.8 + k / 3) % 1)} y={760 - 140 * ((tt * 0.8 + k / 3) % 1)} r={50 + 50 * ((tt * 0.8 + k / 3) % 1)} col="rgba(120,120,120,.7)" o={0.6 * (1 - ((tt * 0.8 + k / 3) % 1))} />)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1380px 900px", transform: `rotate(${-48 * tilt}deg)` }}>
      <Prop id="gas_can" x={1380} y={980} w={420} sh={0} />
      <div style={{ position: "absolute", left: 1460, top: 480, width: 56, height: 400, borderRadius: 28, background: "rgba(30,20,10,.55)", border: "6px solid #c8c8c8", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 400 * lv, background: "linear-gradient(90deg,#c88a20,#f8d070,#c88a20)" }} />
        <div style={{ position: "absolute", left: 0, top: 400 * 0.78 - 4, width: "100%", height: 8, background: "#d42a1e" }} /></div></div>
    {pour && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><defs><linearGradient id="d5gas" x1="0" x2="1"><stop offset="0" stopColor="#f8e8a0" /><stop offset="1" stopColor="#d8a030" /></linearGradient></defs><path d="M1150 520 Q900 520 690 610" stroke="url(#d5gas)" strokeWidth={24} fill="none" strokeLinecap="round" opacity={0.92} /><path d="M1150 520 Q900 520 690 610" stroke="rgba(255,255,255,.6)" strokeWidth={6} fill="none" strokeDasharray="30 40" strokeDashoffset={-tt * 400} /></svg>}
    {pour && <Splash x={690} y={620} p={((tt * 1.5) % 1)} s={0.5} col="rgba(248,220,120,.9)" />}
    <Prop id="pelt_flat" x={1560} y={1060} w={300} r={-4} />
  </Cam>;
}} />;

// m17 · el «eat-out»: las nutrias comen y las raíces se acortan una a una; el pasto se hunde y queda barro liso; la marea sube y se lo lleva fundiendo
const HEatOut: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, d * 0.3), b1 = bt(h, 1, d * 0.62), eat = eio(tt, 0.3, b1), tide = eio(tt, b1, d - 0.2);
  return <Cam tt={tt} d={d} z={0.05}>
    <Agua tt={tt} y0={760 - 300 * tide} o={0.95} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - eio(tide, 0.5, 1) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(${100 * eat * 0.5 + 40}px 0 0 0)` }}><Prop id="marsh_chunk" x={960} y={1010} w={1260} /></div>
      <div style={{ position: "absolute", left: 960 - 560, top: 470 + 120 * eat, width: 1120, height: 200, borderRadius: "40% 40% 30% 30%", background: "radial-gradient(ellipse at 50% 30%,#6a4a2a,#3a2a18 80%)", opacity: eat, boxShadow: "inset 0 10px 20px rgba(0,0,0,.5)" }} />
      {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 420 + k * 95, top: 880, width: 5, height: 160 * (1 - cl(eat * 12 - k)), background: "#c8b08a", borderRadius: 3 }} />)}
      {[0, 1, 2].map((k) => <Prop key={k} id="nutria_eat" x={700 + k * 270} y={560 + 120 * eat + (k % 2) * 30 + 4 * Math.sin(tt * 8 + k)} w={320} flip={k === 1} />)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 760 - 380 * tide, width: 1920, height: 30, background: "linear-gradient(rgba(235,245,240,.5),transparent)", opacity: tide }} />
  </Cam>;
}} />;

// m18 · la vista aérea: la ventanilla del avión; dentro la marisma desde arriba con sus manchas de barro; el lápiz rojo grueso encierra cada una y la tacha
const SPOTS = [[380, 360], [620, 560], [420, 720], [700, 300]];
const HAerialGrid: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#cfd8de,#9aa8b0)" f={(tt) => {
  const d = D(h), step = (d - 1.0) / SPOTS.length, k = Math.min(SPOTS.length - 1, Math.max(0, Math.floor((tt - 0.4) / step))), u = cl((tt - 0.4 - k * step) / step);
  const zx = SPOTS[k][0], zy = SPOTS[k][1], zz = 1 + 0.35 * Math.sin(u * Math.PI) * (tt > 0.4 ? 1 : 0);
  return <Cam tt={tt} d={d} z={0.03}>
    <div style={{ position: "absolute", left: 500, top: 90, width: 920, height: 900, borderRadius: "46%", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -80, top: -60, width: 1080, height: 1020, transformOrigin: `${zx + 80}px ${zy + 60}px`, transform: `scale(${zz})`, background: "radial-gradient(circle at 30% 40%,#7a9a4a,transparent 40%), radial-gradient(circle at 70% 70%,#5a7a3a,transparent 40%), repeating-linear-gradient(120deg,#5a7a3a 0 22px,#6a8a42 22px 60px)" }}>
        <svg width={1080} height={1020} style={{ position: "absolute", inset: 0 }}><path d="M0 500 C200 420 300 640 520 560 S860 380 1080 460" stroke="#3a5a6a" strokeWidth={34} fill="none" /><path d="M300 0 C340 200 260 300 360 500" stroke="#3a5a6a" strokeWidth={18} fill="none" /></svg>
        {SPOTS.map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x + 80 - 70, top: y + 60 - 45, width: 140, height: 90, borderRadius: "48% 52% 40% 60%", background: "radial-gradient(#3a2a18,#6a4a2a 70%)", transform: `rotate(${i * 37}deg)` }} />)}
        <svg width={1080} height={1020} style={{ position: "absolute", inset: 0 }}>{SPOTS.map(([x, y], i) => { const p = i < k ? 1 : i === k ? cl(u * 1.6) : 0, x2 = i < k ? 1 : i === k ? cl(u * 2.4 - 1.4) : 0; return <g key={i} transform={`translate(${x + 80} ${y + 60})`}>
          <ellipse rx={110} ry={80} stroke="#d41e1e" strokeWidth={12} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - p)} strokeLinecap="round" transform="rotate(-8)" />
          <path d="M-60 -45 L60 45 M60 -45 L-60 45" stroke="#d41e1e" strokeWidth={14} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - x2)} strokeLinecap="round" /></g>; })}</svg>
      </div>
      {tt > 0.4 && <div style={{ position: "absolute", left: (zx - 80) + 240 * (1 - cl(u * 1.6)), top: zy - 40 + 120 * Math.cos(u * 6), width: 34, height: 380, transform: "rotate(30deg)", transformOrigin: "50% 0", background: "linear-gradient(90deg,#a01414,#e83a2a,#a01414)", borderRadius: "0 0 6px 6px", boxShadow: "8px 14px 14px rgba(0,0,0,.4)" }}><div style={{ width: 0, height: 0, borderLeft: "17px solid transparent", borderRight: "17px solid transparent", borderBottom: "40px solid #e8c89a", marginTop: -40 }} /></div>}
    </div>
    <Prop id="plane_window" x={960} y={1060} w={1180} sh={0} style={{ mixBlendMode: "multiply" }} />
  </Cam>;
}} />;

// m19 · la recompensa: la cola gruesa grande resbala por la ranura de la reja; la mano con guante empuja el billete por la bandeja; el contador de latón está en el marco
const HTailBounty: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 3, per = (d - 0.6) / N, i = Math.min(N - 1, Math.floor(Math.max(0, tt - 0.2) / per)), u = Math.max(0, tt - 0.2 - i * per), tp = eio(u, 0, 0.9), bp = eio(u, 1.0, 1.7), paid = Math.min(N, i + (u > 1.0 ? 1 : 0));
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 560, background: "repeating-linear-gradient(90deg,#5a3e24 0 6px,#6a4a2c 6px 180px)" }} />
    <div style={{ position: "absolute", left: 560, top: 60, width: 800, height: 500, border: "26px solid #b8904a", borderBottom: "none", background: "repeating-linear-gradient(90deg,transparent 0 70px,#a8803a 70px 82px), rgba(20,14,8,.85)", boxShadow: "inset 0 0 40px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 270, top: 20, width: 210, height: 110, borderRadius: 10, background: "linear-gradient(#e8c070,#a8802c)", boxShadow: "0 8px 12px rgba(0,0,0,.5)" }} /></div>
    <Odo x={935} y={135} v={5 * paid} n={2} size={80} />
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, height: 60, background: "linear-gradient(#e8c070,#a8802c)", boxShadow: "0 6px 0 #6a4a1a" }} />
    <div style={{ position: "absolute", left: 0, top: 620, width: 1920, height: 460, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 160px), linear-gradient(#8a5a32,#3a2210)" }} />
    <div style={{ position: "absolute", left: 760, top: 566, width: 400, height: 40, borderRadius: 8, background: "#0e0a06", boxShadow: "inset 0 6px 10px #000" }} />
    {tp < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "inset(0 0 494px 0)" }}><Prop id="tail" x={1000 - 300 * tp} y={590} w={700} r={-12} sh={0} /></div>}
    {bp > 0 && <><Prop id="bill5" x={960} y={760 + 160 * bp} w={460} r={-4} sh={0} /><Prop id="hand_glove" x={760 - 100 * (1 - bp)} y={900 + 160 * bp} w={420} r={10} sh={0} /></>}
  </Cam>;
}} />;

// m20 · los acres bajan: juncos crecen desde las dos orillas con resorte hasta cerrar el agua; el contador recortado limpio baja a 6,000; la garza aterriza entera
const HAcresFall: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), v = Math.round((100000 - 94000 * eio(tt, 0.3, d - 1.6)) / 1000) * 1000, hp = eio(tt, d - 2.0, d - 0.6), N = 7;
  return <Cam tt={tt} d={d} z={0.04}>
    <Agua tt={tt} y0={600} col="#6a8a6a" deep="#2a4a32" />
    {Array.from({ length: N }, (_, k) => [0, 1].map((s) => { const g = phys(tt, 0.4 + k * (d - 2.4) / N, 7, 0.45); return <Prop key={k + "_" + s} id="reed_clump" x={s ? 1820 - k * 120 : 100 + k * 120} y={760 + (k % 2) * 80} w={260 * g + 1} sh={0} />; }))}
    <div style={{ position: "absolute", left: 610, top: 120, width: 700, height: 210, borderRadius: 24, background: "linear-gradient(#c8a050,#7a5a20)", boxShadow: "0 24px 36px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,240,200,.5)" }} />
    <Odo x={960} y={225} v={v} n={6} size={130} />
    <Prop id="heron" x={1500 - 400 * hp} y={300 + 520 * hp} w={420} r={-10 + 10 * hp} sh={hp} />
  </Cam>;
}} />;

// m21 · a comerla: la mano saca la ficha de la lata y la apoya contra la olla; la cuchara baja, gira dos veces con remolino y vapor, y sube
const HRecipeCard: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), take = eio(tt, 0.2, 1.4), sp = eio(tt, 1.6, d - 0.6), dip = Math.sin(sp * Math.PI), ang = sp * 720;
  const cx = 600 + 520 * take, cy = 700 - 160 * Math.sin(take * Math.PI);
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: -200, top: 760, width: 2320, height: 600, background: "repeating-linear-gradient(90deg,rgba(200,40,40,.55) 0 60px,transparent 60px 120px), repeating-linear-gradient(0deg,rgba(200,40,40,.55) 0 60px,#f4ece0 60px 120px)", transform: "perspective(900px) rotateX(40deg)", transformOrigin: "50% 0" }} />
    <Prop id="recipe_tin" x={500} y={1000} w={520} />
    <Prop id="pot" x={1380} y={1010} w={640} />
    <div style={{ position: "absolute", left: 1380 - 230, top: 720, width: 460, height: 90, borderRadius: "50%", background: `conic-gradient(from ${ang}deg,#6a2a14,#9a4a24,#6a2a14,#9a4a24,#6a2a14)`, opacity: 0.6 * dip }} />
    <div style={{ position: "absolute", left: 1380 + 140 * Math.cos(ang * Math.PI / 180), top: 760 - 260 * (1 - dip), height: 1080, transformOrigin: "0 0", transform: `rotate(${-10 + 10 * Math.sin(ang * Math.PI / 180)}deg)` }}><Prop id="spoon" x={0} y={-60} w={460} r={80} sh={0} /></div>
    {Array.from({ length: 5 }, (_, k) => { const p = (tt * 0.5 + k / 5) % 1; return <Puff key={k} x={1340 + 60 * Math.sin(p * 6 + k)} y={680 - 340 * p} r={50 + 70 * p} o={(0.3 + 0.4 * dip) * (1 - p)} />; })}
    <div style={{ position: "absolute", left: cx, top: cy, width: 520, height: 320, transform: `translate(-50%,-50%) rotate(${-14 + 22 * take}deg) scale(${0.55 + 0.45 * take})`, background: "repeating-linear-gradient(180deg,transparent 0 50px,rgba(80,120,200,.35) 50px 52px), linear-gradient(#fbf6ea,#eee2c4)", boxShadow: "0 24px 30px rgba(0,0,0,.5)", borderTop: "8px solid #c84a3a" }}>
      <div style={{ position: "absolute", left: 0, top: 80, width: 520, textAlign: "center", fontFamily: "'Segoe Print', 'Comic Sans MS', cursive", fontSize: 120, color: "#2a2018" }}>Nutria</div></div>
    <Prop id="hand_flannel" x={cx - 300} y={cy + 160} w={460} r={-6} sh={0} style={{ opacity: take < 0.97 ? 1 : 1 - eio(tt, 1.4, 1.8) }} />
  </Cam>;
}} />;

// m22 · más grande que Delaware: la maqueta de la costa con el hueco azul de tierra perdida; Delaware de madera baja y queda centrado, más chico que el hueco
const HDelawareOverlay: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hole = eio(tt, 0.2, d * 0.35), L = land(tt, d * 0.42, 700);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 220, top: 200, width: 1480, height: 760, transform: "perspective(1600px) rotateX(32deg)", transformOrigin: "50% 100%", background: "repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 3px,transparent 3px 120px), linear-gradient(#e8c898,#c8a070)", boxShadow: "0 26px 0 #5a3a1c, 0 46px 50px rgba(0,0,0,.5)", borderRadius: 18 }}>
      <div style={{ position: "absolute", left: 0, top: 560, width: 1480, height: 200, background: "linear-gradient(#5a8aa0,#2a4a5a)" }} />
      <div style={{ position: "absolute", left: 740 - 480 * hole, top: 560 - 380 * hole, width: 960 * hole, height: 420 * hole, background: "linear-gradient(#4a7a90,#2a4a5a)", borderRadius: "46% 52% 0 0 / 60% 64% 0 0", boxShadow: "inset 0 14px 22px rgba(0,0,0,.45)" }} />
    </div>
    {L.on && <Prop id="delaware_cut" x={960} y={830 + L.dy} w={260} sq={L.sq * 0.4} sh={L.k} />}
    <Dust tt={tt} at={d * 0.42 + 0.12} x={960} y={820} w={200} col="rgba(200,230,240,.7)" />
    {tt > d * 0.6 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M560 760 L700 760 M1220 760 L1360 760" stroke="#fff4d8" strokeWidth={8} strokeDasharray="20 12" opacity={eio(tt, d * 0.6, d * 0.7)} /><path d="M590 740 L560 760 L590 780 M1330 740 L1360 760 L1330 780" stroke="#fff4d8" strokeWidth={8} fill="none" opacity={eio(tt, d * 0.6, d * 0.7)} /></svg>}
  </Cam>;
}} />;

// m23 · el río construyó la tierra: la bandeja de arena; el chorro grueso de la jarra golpea; el agua se abre en cuatro dedos que cavan surcos y depositan lóbulos que crecen
const HRiverFan: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g = eio(tt, 0.5, d - 0.4), fingers = [-40, -14, 14, 40];
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Mesa y0={820} />
    <Prop id="sand_tray" x={960} y={1050} w={1500} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{fingers.map((a, k) => { const L = 520 * cl(g * 1.3 - k * 0.08), r = a * Math.PI / 180, x2 = 960 + Math.sin(r) * L, y2 = 640 + Math.cos(r) * L * 0.55; return <g key={k}>
      <path d={`M960 640 Q${960 + Math.sin(r) * L * 0.5} ${640 + L * 0.3} ${x2} ${y2}`} stroke="rgba(90,60,30,.55)" strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={`M960 640 Q${960 + Math.sin(r) * L * 0.5} ${640 + L * 0.3} ${x2} ${y2}`} stroke="rgba(120,170,190,.85)" strokeWidth={16} fill="none" strokeLinecap="round" />
      <ellipse cx={x2} cy={y2 + 10} rx={60 * cl(g * 1.3 - k * 0.08) + 4} ry={26 * cl(g * 1.3 - k * 0.08) + 2} fill="#8a6a3e" stroke="rgba(60,40,20,.5)" strokeWidth={4} /></g>; })}</svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1050px 330px", transform: `rotate(${-55 * eio(tt, 0, 0.5)}deg)` }}><Prop id="jug" x={1100} y={420} w={300} sh={0} /></div>
    {tt > 0.4 && <div style={{ position: "absolute", left: 932, top: 360, width: 56, height: 290, borderRadius: 28, background: "linear-gradient(90deg,rgba(120,90,60,.55),rgba(200,170,120,.85),rgba(120,90,60,.55))" }} />}
    {tt > 0.4 && <Splash x={960} y={650} p={(tt * 2) % 1} s={0.6} col="rgba(170,140,100,.8)" />}
  </Cam>;
}} />;

// m24 · la gran inundación: la casita dentro de la pecera; el agua turbia sube con ondas hasta el alero y baja; queda la raya de barro y el martillo clava la chapa 1927 ahí
const HFloodRoof: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.2, d * 0.4) * (1 - eio(tt, d * 0.5, d * 0.68)), mark = cl((tt - d * 0.5) / 0.3), hm = d * 0.75, hk = cl((tt - hm + 0.6) / 0.6);
  const top = 920 - 420 * up;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={940} />
    <Prop id="house_glass" x={960} y={920} w={640} />
    {mark > 0 && <div style={{ position: "absolute", left: 690, top: 560, width: 540, height: 18, background: "linear-gradient(rgba(90,60,30,.85),rgba(90,60,30,.2))", opacity: mark, filter: "blur(1px)" }} />}
    <div style={{ position: "absolute", left: 520, top, width: 880, height: 920 - top, background: "linear-gradient(rgba(140,115,80,.62),rgba(90,70,50,.82))" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M520 ${top} ${Array.from({ length: 12 }, (_, k) => `Q${555 + k * 73} ${top + 10 * Math.sin(tt * 4 + k)} ${593 + k * 73} ${top}`).join(" ")}`} stroke="rgba(240,230,210,.7)" strokeWidth={5} fill="none" /></svg>
    <Prop id="aquarium" x={960} y={950} w={980} sh={0} style={{ opacity: 0.85 }} />
    {tt > hm - 0.1 && <Prop id="plaque" x={960} y={600} w={170} sh={0} sq={tt < hm + 0.15 ? 0.3 : 0} />}
    {tt > hm - 0.1 && <div style={{ position: "absolute", left: 960, top: 568, transform: "translate(-50%,-50%)", fontFamily: SER, fontWeight: 900, fontSize: 40, color: "#4a3010" }}>1927</div>}
    {hk > 0 && hk < 1 && <Prop id="hammer" x={1180 - 60 * Math.sin(hk * Math.PI)} y={600} w={300} r={-60 + 60 * Math.sin(hk * Math.PI)} sh={0} />}
  </Cam>;
}} />;

// m25 · el río encerrado: el canal en U de dos muros altos en perspectiva con la corriente marrón; las bolas de barro salen en arco y caen a la cuba oscura con salpicadura y anillos
const HLeveeChute: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={760} />
    <div style={{ position: "absolute", left: 1220, top: 700, width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%,#0a1418,#1a2a32 60%,#3a4a52)", boxShadow: "0 0 0 20px #5a5e62, 0 30px 40px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: -60, top: 300, width: 1340, height: 420, transform: "perspective(1200px) rotateY(28deg) rotateX(18deg)", transformOrigin: "100% 50%" }}>
      <div style={{ position: "absolute", left: 0, top: 150, width: 1340, height: 140, background: `repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 40px,transparent 40px 90px) ${(tt * 400) % 90}px 0, linear-gradient(#8a6a3a,#5a3e1e)` }} />
      {[40, 290].map((y) => <div key={y} style={{ position: "absolute", left: 0, top: y, width: 1340, height: 110, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 3px,transparent 3px 130px), linear-gradient(#c89a62,#7a5230)", boxShadow: "0 12px 14px rgba(0,0,0,.45)" }} />)}
    </div>
    {Array.from({ length: 4 }, (_, k) => { const p = ((tt * 0.55 + k / 4) % 1), x = 1150 + 370 * p, y = 520 - 160 * Math.sin(p * Math.PI * 0.8) + 300 * p * p; return p > 0.9 ? <React.Fragment key={k}><Splash x={1520} y={830} p={(p - 0.9) / 0.1} s={1.3} /><Rings tt={tt} at={tt - (p - 0.9) * 1.8} x={1520} y={840} s={0.9} /></React.Fragment> : <Prop key={k} id="mud_ball" x={x} y={y} w={110} r={p * 400} sh={0} />; })}
  </Cam>;
}} />;

// m26 · el petróleo y los canales: la maqueta de marisma con canalitos curvos; la dragalina entra entera, cava un canal recto que los corta, apila tierra y entra agua marrón; la torre espera al final
const HRigCanal: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dig = eio(tt, 0.8, d - 0.6), enter = eio(tt, 0, 0.8), dx = 220 + 1180 * dig;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={880} />
    <div style={{ position: "absolute", left: 120, top: 380, width: 1680, height: 640, transform: "perspective(1400px) rotateX(38deg)", transformOrigin: "50% 100%", background: "repeating-linear-gradient(100deg,#6a8a3a 0 20px,#5a7a32 20px 50px)", boxShadow: "0 22px 0 #4a3418, 0 40px 40px rgba(0,0,0,.5)", borderRadius: 16, overflow: "hidden" }}>
      <svg width={1680} height={640} style={{ position: "absolute", inset: 0 }}>{[160, 520, 900, 1300].map((x, k) => <path key={k} d={`M${x} 0 C${x + 120} 160 ${x - 100} 320 ${x + 60} 640`} stroke="#4a7a8a" strokeWidth={26} fill="none" />)}</svg>
      <div style={{ position: "absolute", left: 100, top: 300, width: Math.max(0, dx - 220), height: 70, background: "linear-gradient(#5a4a30,#3a3020)", boxShadow: "inset 0 10px 14px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", inset: "12px 0 0 0", background: "linear-gradient(90deg,#6a5a3a,#7a6040)", opacity: cl(dig * 1.4 - 0.1) }} /></div>
      {Array.from({ length: Math.floor(13 * dig) }, (_, k) => [0, 1].map((s) => <div key={k + "_" + s} style={{ position: "absolute", left: 110 + k * 100, top: s ? 372 : 250, width: 110, height: 50, borderRadius: "50% 50% 20% 20%", background: "radial-gradient(ellipse at 40% 30%,#8a6a42,#4a3418)" }} />))}
    </div>
    <Prop id="derrick" x={1660} y={820} w={200} />
    <Prop id="dragline" x={Math.min(1440, dx - 300 * (1 - enter))} y={760} w={420} o={enter} />
    <Dust tt={tt} at={Math.floor(tt * 1.5) / 1.5} x={dx + 80} y={700} w={160} col="rgba(120,90,60,.8)" />
  </Cam>;
}} />;

// m27 · la cuña de sal: la compuerta oxidada sube dentro del cuadro; en la pecera de corte entra por el fondo la cuña oscura de agua salada con remolinos y las plantas se marchitan de a una
const HSaltWedge: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.2, 1.2), w = eio(tt, 1.0, d - 0.6);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={920} />
    <div style={{ position: "absolute", left: 300, top: 360, width: 1320, height: 560, background: "linear-gradient(rgba(170,210,220,.35),rgba(120,170,180,.45))", border: "8px solid rgba(220,230,230,.7)", boxShadow: "0 30px 40px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 0, top: 440, width: 1320, height: 120, background: "linear-gradient(#8a6a42,#5a4024)" }} />
      <svg width={1320} height={560} style={{ position: "absolute", inset: 0 }}><path d={`M0 440 L0 ${440 - 260 * Math.min(1, w * 1.3)} Q${300 * w} ${440 - 200 * w} ${1320 * w} 440 Z`} fill="rgba(20,40,60,.75)" />{Array.from({ length: 6 }, (_, k) => { const x = 1320 * w * (k / 6) + 40, y = 440 - 100 * w + 30 * Math.sin(k); return w > 0.05 && <circle key={k} cx={x} cy={y} r={24} stroke="rgba(200,230,240,.6)" strokeWidth={5} fill="none" strokeDasharray="90 60" transform={`rotate(${tt * 300 + k * 50} ${x} ${y})`} />; })}</svg>
      {[0, 1, 2, 3].map((k) => { const x = 420 + k * 230, dry = eio(1320 * w - x, 0, 200); return <Prop key={k} id="marsh_plant" x={x} y={450} w={200} sh={0} r={30 * dry} style={{ filter: `saturate(${1 - dry}) sepia(${dry}) brightness(${1 - 0.3 * dry})` }} />; })}
    </div>
    <div style={{ position: "absolute", left: 160, top: 200, width: 200, height: 740, background: "linear-gradient(90deg,#4a4a46,#7a7a76,#4a4a46)" }} />
    <Prop id="gate" x={260} y={940 - 300 * up} w={300} sh={0} />
    <Prop id="salt_bucket" x={1760} y={1050} w={220} />
  </Cam>;
}} />;

// m28 · el podio: cada causa cae y rebota en su escalón con polvo (bloque, canal con agua, balde de sal); la nutria entera sentada mira hacia arriba
const HStudyRank: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), s = (d - 1.2) / 3;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={900} />
    <Prop id="podium" x={900} y={1020} w={1200} />
    <Drop tt={tt} at={0.3} id="concrete_block" x={900} y={668} w={260} />
    <Drop tt={tt} at={0.3 + s} id="canal_piece" x={510} y={760} w={300} />
    {tt > 0.3 + s + 0.4 && <div style={{ position: "absolute", left: 430, top: 700, width: 150, height: 14, background: "#5a9ab0", transform: "skewX(-40deg)", opacity: eio(tt, 0.3 + s + 0.4, 0.3 + s + 0.8) }} />}
    <Drop tt={tt} at={0.3 + 2 * s} id="salt_bucket" x={1300} y={810} w={220} />
    <Prop id="pup" x={1680} y={1050} w={330} r={-8} />
  </Cam>;
}} />;

// m29 · el villano visible: la nutria al triple gira en el plato y frena de frente con ojos que brillan; WANTED colgado al centro de un clavo; el foco deja la maqueta del dique y la busca a ella
const HVillainSpot: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 40%,#2a2420,#060606 70%)" f={(tt) => {
  const d = D(h), stop = d * 0.45, sp = tt < stop ? Math.cos(tt * 2.2) : 1, sw = eio(tt, 0.3, stop), lx = 360 + 700 * sw;
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ filter: `brightness(${1 - 0.6 * sw})` }}><Prop id="dam_model" x={360} y={860} w={420} /></div>
    <div style={{ position: "absolute", left: lx - 260, top: 0, width: 520, height: 1000, background: "linear-gradient(rgba(255,240,200,.35),rgba(255,240,200,.04))", clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} />
    <Prop id="turntable" x={1060} y={1030} w={700} />
    <Prop id="pup" x={1060} y={930} w={520} style={{ transform: `scaleX(${sp})` }} />
    {tt > stop + 0.3 && [1000, 1118].map((x) => <Glow key={x} x={x} y={640} r={40} o={0.6 + 0.4 * Math.sin(tt * 6)} col="255,230,140" />)}
    <Prop id="iron_nail" x={1560} y={190} w={60} r={90} sh={0} />
    <div style={{ position: "absolute", left: 1560, top: 180, height: 1080, transformOrigin: "0 0", transform: `rotate(${swing(tt, 0.2, 7, 2.4, 0.3)}deg)` }}>
      <svg width={200} height={120} style={{ position: "absolute", left: -100, top: 0 }}><path d="M100 0 L20 120 M100 0 L180 120" stroke="#c8a870" strokeWidth={5} /></svg>
      <Prop id="wanted_poster" x={0} y={560} w={330} sh={0} />
      <div style={{ position: "absolute", left: -165, top: 150, width: 330, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 64, color: "#3a2410" }}>WANTED</div>
      <Prop id="nutria_face" x={0} y={480} w={220} sh={0} style={{ filter: "sepia(.7)" }} /></div>
  </Cam>;
}} />;

// m30 · reconstruir: la draga al frente; el caño grueso con flotadores amarillos escupe un abanico espeso con salpicadura; la isla sube en cuatro capas y brota pasto
const HPipeRebuild: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), isl = eio(tt, 0.5, d * 0.7), gr = eio(tt, d * 0.65, d - 0.3);
  return <Cam tt={tt} d={d} z={0.04}>
    <Agua tt={tt} y0={560} />
    <Prop id="dredge" x={420} y={700} w={700} sh={0} />
    <Prop id="pipe_float" x={900} y={790} w={700} sh={0} />
    {tt > 0.2 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 7 }, (_, k) => <path key={k} d={`M1230 720 Q${1320 + k * 20} ${620 - k * 8} ${1300 + k * 50} ${800 - 40 * isl}`} stroke="rgba(110,80,45,.75)" strokeWidth={22 - k * 2} fill="none" strokeLinecap="round" strokeDasharray="40 14" strokeDashoffset={-tt * 300 - k * 20} />)}</svg>}
    {tt > 0.2 && <Splash x={1460} y={800 - 40 * isl} p={(tt * 1.6) % 1} s={1.1} col="rgba(130,100,60,.85)" />}
    {[0, 1, 2, 3].map((k) => { const g = cl(isl * 4 - k); return <div key={k} style={{ position: "absolute", left: 1460 - (300 - k * 50) * g, top: 860 - (30 + k * 36) * g, width: (600 - k * 100) * g, height: (60 + k * 30) * g, borderRadius: "50% 50% 12% 12%", background: ["#6a4a2a", "#8a6a42", "#b8946a", "#d8c098"][k], boxShadow: "0 6px 8px rgba(0,0,0,.3)" }} />; })}
    {Array.from({ length: 22 }, (_, k) => { const g = cl(gr * 22 - k * 0.6); return g > 0 && <div key={k} style={{ position: "absolute", left: 1290 + k * 16, top: 742 - 70 * g + Math.abs(k - 11) * 5, width: 6, height: 70 * g, background: "#6a9a3a", transform: `rotate(${(k - 11) * 4}deg)`, transformOrigin: "50% 100%" }} />; })}
  </Cam>;
}} />;

// m31 · Chesapeake: el mojón entero a la izquierda; el perro cruza completo por el centro con sombra; cada banderita grande gira a verde con un anillo cuando llega la nariz
const HDogSearch: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dx = 1500 - 900 * eio(tt, 0, d - 0.4), nose = dx - 320, fl = [1350, 1100, 850, 600];
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: -100, top: 520, width: 2120, height: 700, background: "repeating-linear-gradient(95deg,#7a8a4a 0 18px,#6a7a3a 18px 44px)", transform: "perspective(1000px) rotateX(36deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 90, top: 300, width: 340, height: 100, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 60px), linear-gradient(#c89a62,#8a6238)", boxShadow: "0 12px 14px rgba(0,0,0,.45)", fontFamily: SER, fontWeight: 900, fontSize: 46, color: "#2a1a0c", textAlign: "center", lineHeight: "100px" }}>CHESAPEAKE</div>
    <div style={{ position: "absolute", left: 248, top: 400, width: 24, height: 360, background: "linear-gradient(90deg,#4a3420,#8a6a42,#4a3420)" }} />
    {fl.map((x, k) => { const on = nose < x + 40, p = cl((x + 40 - nose) / 140); return <React.Fragment key={k}><Prop id="survey_flag" x={x} y={820} w={150} sh={0.5} style={{ filter: on ? `hue-rotate(${110 * p}deg) saturate(1.6) brightness(1.1)` : undefined }} />{on && p < 1 && <div style={{ position: "absolute", left: x - 120 * p, top: 760 - 50 * p, width: 240 * p, height: 100 * p, borderRadius: "50%", border: `6px solid rgba(140,255,140,${1 - p})` }} />}<Glow x={x + 20} y={640} r={80} o={on ? 0.6 : 0} col="140,255,140" /></React.Fragment>; })}
    <div style={{ position: "absolute", left: dx - 360, top: 990, width: 720, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.45),transparent 70%)" }} />
    <Prop id="dog" x={dx} y={1020} w={820} r={1.2 * Math.sin(tt * 4)} />
  </Cam>;
}} />;

// m32 · las marcas de la marea: la mano con el pincel arrastra cada raya en el pilote y gotea; el año grande pegado a la raya nueva; el agua sube y deja percebes en las rayas de abajo
const YRS = ["1930s", "1938", "1940s", "1962", "1980s", "1990s", "2002", "2005", "2007"];
const HTideMarks: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), B = YRS.map((_, i) => bt(h, i, 0.4 + i * (d - 1) / 9)), cur = Math.max(0, B.filter((b) => tt >= b).length - 1), bp = cl((tt - B[cur]) / 0.7), wl = eio(tt, d * 0.3, d - 0.5), yOf = (i: number) => 920 - i * 78, wy = 1080 - 260 * wl;
  return <Cam tt={tt} d={d} z={0.03} fy={500}>
    <Prop id="piling" x={900} y={1130} w={330} sh={0} />
    {YRS.map((y, i) => i > cur ? null : <div key={y} style={{ position: "absolute", left: 790, top: yOf(i), width: 230 * (i === cur ? bp : 1), height: 16, borderRadius: 8, background: "linear-gradient(#ffffff,#d8d8d0)", boxShadow: "0 3px 4px rgba(0,0,0,.35)" }} />)}
    {cur >= 0 && <Word key={cur} tt={tt} at={B[cur]} x={1360} y={yOf(cur) + 8} txt={YRS[cur]} size={130} r={0} />}
    {bp < 1 && <Prop id="brush_hand" x={760 + 230 * bp + 200} y={yOf(cur) + 120} w={420} r={-10} sh={0} />}
    {bp > 0.2 && bp < 1 && [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 820 + k * 70, top: yOf(cur) + 16 + 60 * ((tt * 2 + k / 3) % 1), width: 7, height: 14, borderRadius: 5, background: "#f4f4ee" }} />)}
    {wl > 0.3 && [0, 1].map((i) => <Prop key={i} id="barnacles" x={900} y={yOf(i) + 50} w={200} sh={0} o={eio(wl, 0.3, 0.6)} />)}
    <div style={{ position: "absolute", left: 0, top: wy, width: 1920, height: 400, background: "linear-gradient(rgba(70,110,110,.6),rgba(20,40,40,.95))" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M0 ${wy} ${Array.from({ length: 16 }, (_, k) => `Q${60 + k * 120} ${wy + 12 * Math.sin(tt * 3 + k)} ${120 + k * 120} ${wy}`).join(" ")}`} stroke="rgba(230,240,240,.7)" strokeWidth={5} fill="none" /></svg>
  </Cam>;
}} />;

// m33 · ¿es una rata?: el árbol con tres ramas; el cuis y el puercoespín apoyados en ramas; la rata en un tocón aparte tras la grieta; la soga gruesa se corta de un tijeretazo
const HFamilyTree: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = d * 0.6, sc = cl((tt - cut + 0.5) / 0.5), rp = eio(tt, cut, cut + 0.7);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 1270, top: 900, width: 30, height: 200, background: "linear-gradient(90deg,#1a0e06,#3a2412)", clipPath: "polygon(40% 0,70% 0,55% 30%,80% 60%,50% 100%,20% 100%,45% 60%,25% 30%)" }} />
    <Prop id="tree" x={700} y={1060} w={760} />
    <div style={{ position: "absolute", left: 700, top: 300, width: 300, height: 26, borderRadius: 13, background: "linear-gradient(#6a5a4a,#3a2e22)", transform: "rotate(-30deg)", transformOrigin: "0 50%" }} />
    <Drop tt={tt} at={0.4} id="guinea_pig" x={420} y={430} w={220} h={500} dust={false} />
    <Drop tt={tt} at={0.9} id="porcupine" x={990} y={410} w={300} h={500} dust={false} />
    <Prop id="pup" x={700} y={1050} w={300} />
    <Prop id="tree_stump" x={1640} y={1040} w={360} />
    <Drop tt={tt} at={1.3} id="rat" x={1640} y={870} w={280} h={500} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M840 940 Q1060 ${900 + 160 * rp} ${1220 - 40 * rp} ${880 + 180 * rp}`} stroke="#c8a870" strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d={`M1500 840 Q1420 ${880 + 160 * rp} ${1340 + 40 * rp} ${880 + 180 * rp}`} stroke="#c8a870" strokeWidth={18} fill="none" strokeLinecap="round" /></svg>
    {sc > 0 && sc < 1.3 && <Prop id="scissors" x={1280} y={880 + 30 * Math.sin(sc * 10)} w={340} r={-30 + 20 * Math.sin(sc * 12)} sh={0} o={1 - eio(tt, cut + 0.4, cut + 0.8)} />}
  </Cam>;
}} />;

// m34 · el mensaje en la botella: la botella grande entra rodando y frena; el corcho salta en arco y rebota; el rollo sale enroscado por el pico y se despliega con el dibujo
const HBottleMessage: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), roll = eio(tt, 0, 1.0), bx = 160 + 560 * roll, ck = cl((tt - 1.1) / 0.8), cb = land(tt, 1.9, 0, 9, 0.3), out = eio(tt, 1.6, 2.4), un = eio(tt, 2.4, 3.4);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={820} />
    <Prop id="bottle" x={bx} y={1000} w={880} r={(1 - roll) * -10} />
    {ck > 0 && <Prop id="cork" x={bx + 460 + 340 * ck} y={930 - 340 * Math.sin(ck * Math.PI) + (ck >= 1 ? -40 * Math.abs(Math.sin((tt - 1.9) * 9)) * Math.exp(-3 * (tt - 1.9)) : 0)} w={100} r={ck * 720} sh={ck >= 1 ? 1 : 0} />}
    {out > 0 && un < 0.05 && <div style={{ position: "absolute", left: bx + 400, top: 900 - 60 * out, width: 60 + 200 * out, height: 60, borderRadius: 30, background: "linear-gradient(#f4ead0,#d8c8a0)", boxShadow: "0 8px 10px rgba(0,0,0,.4)" }} />}
    {un > 0 && <div style={{ position: "absolute", left: 1200, top: 470, width: 1000 * un + 60, height: 560, transform: `translate(-50%,-50%) rotate(${-4 + 4 * un}deg)`, background: "linear-gradient(90deg,#c8b890,#f4ead0 6%,#f4ead0 94%,#c8b890)", boxShadow: "0 30px 40px rgba(0,0,0,.5)", overflow: "hidden", borderRadius: 12 }}>
      <svg width={1060} height={560} style={{ position: "absolute", inset: 0, opacity: cl(un * 2 - 0.6) }}><g stroke="#3a2a1a" strokeWidth={6} fill="none" strokeLinecap="round"><path d="M80 420 L280 420 L280 260 L80 260 Z" /><path d="M100 280 L260 280 M100 320 L260 320 M100 360 L260 360" /><path d="M360 420 C460 380 520 460 640 400 S820 380 980 420" /><path d="M360 450 C460 410 520 490 640 430 S820 410 980 450" /></g>
        <ellipse cx={760} cy={240} rx={110} ry={60} stroke="#3a2a1a" strokeWidth={6} fill="none" /><circle cx={860} cy={210} r={36} stroke="#3a2a1a" strokeWidth={6} fill="none" /><path d="M650 250 Q560 300 520 260" stroke="#3a2a1a" strokeWidth={6} fill="none" /><path d="M880 220 L900 228" stroke="#c84a1a" strokeWidth={10} /></svg></div>}
  </Cam>;
}} />;

// m35 · la decisión: la nutria grande cruza completa arrastrando con la cola el cartel BOUNTY atado con soga, que raspa la mesa; atrás el dique de cartón y el canal azul quedan sin cartel
const HBountyDecision: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), nx = 1500 - 900 * eio(tt, 0, d - 0.4), bob = 6 * Math.abs(Math.sin(tt * 6)), px = nx + 560;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={760} />
    <Prop id="dam_model" x={420} y={760} w={420} />
    <div style={{ position: "absolute", left: 900, top: 700, width: 900, height: 50, background: "linear-gradient(#6aa8c8,#3a7898)", transform: "perspective(800px) rotateX(50deg)", boxShadow: "0 6px 8px rgba(0,0,0,.3)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${nx + 250} 980 Q${nx + 380} ${1020 + 10 * Math.sin(tt * 5)} ${px - 120} 950`} stroke="#c8a870" strokeWidth={10} fill="none" /></svg>
    <div style={{ position: "absolute", left: px - 140, top: 830, width: 280, height: 200, transform: `rotate(${-6 + 4 * Math.sin(tt * 5)}deg)`, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 60px), linear-gradient(#e8d0a0,#b89a68)", boxShadow: "0 14px 16px rgba(0,0,0,.5)", fontFamily: SER, fontWeight: 900, fontSize: 56, color: "#3a2410", textAlign: "center", lineHeight: "200px" }}>BOUNTY</div>
    {Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: px + 150 + k * 60 + ((tt * 200) % 60), top: 1020, width: 40, height: 4, background: "rgba(90,60,30,.35)" }} />)}
    <Prop id="nutria_big" x={nx} y={1000 - bob} w={620} />
  </Cam>;
}} />;

export const HCD5: Record<string, C> = {
  trapLine: HTrapLine, peltBoard: HPeltBoard, marshHoles: HMarshHoles, tailTag: HTailTag, pieSlice: HPieSlice, incisors: HIncisors, coatRack: HCoatRack, penMap: HPenMap,
  hurricanePen: HHurricanePen, mythCheck: HMythCheck, manyHands: HManyHands, hyacinthDitch: HHyacinthDitch, crateShip: HCrateShip, harvestBars: HHarvestBars,
  stiltCamp: HStiltCamp, trapCount: HTrapCount, stretchBoards: HStretchBoards, seesawMusk: HSeesawMusk, checkValve: HCheckValve, priceTag: HPriceTag, gasCan: HGasCan,
  eatOut: HEatOut, aerialGrid: HAerialGrid, tailBounty: HTailBounty, acresFall: HAcresFall, recipeCard: HRecipeCard, delawareOverlay: HDelawareOverlay, riverFan: HRiverFan,
  floodRoof: HFloodRoof, leveeChute: HLeveeChute, rigCanal: HRigCanal, saltWedge: HSaltWedge, studyRank: HStudyRank, villainSpot: HVillainSpot, pipeRebuild: HPipeRebuild,
  dogSearch: HDogSearch, tideMarks: HTideMarks, familyTree: HFamilyTree, bottleMessage: HBottleMessage, bountyDecision: HBountyDecision,
};
