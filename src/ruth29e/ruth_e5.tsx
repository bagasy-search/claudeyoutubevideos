// ruth29e · 4ª vuelta (29-oct): los seis más bajos de la ronda 2 (≤4,5). Todo entero en cuadro, acción desde 0,3 s, objetos apoyados con sombra.
import React from "react";
import { cl, eio, phys } from "./hkit";
import { S, D, bt, C, Prop, Dust, Cam, Mesa, Luz, land, swing, SER } from "./pk";

const SKY = "linear-gradient(#e8b070 0%,#f2d8a8 42%,#8a9a6a 52%,#4a5a2a 100%)";
const Suelo: React.FC<{ y0?: number; c1?: string; c2?: string }> = ({ y0 = 560, c1 = "#7a5a32", c2 = "#3a2812" }) => <div style={{ position: "absolute", left: -200, top: y0, width: 2320, height: 1300 - y0, background: `radial-gradient(circle at 30% 30%,rgba(0,0,0,.12) 2px,transparent 3px) 0 0/22px 22px, linear-gradient(${c1},${c2})`, transform: "perspective(900px) rotateX(42deg)", transformOrigin: "50% 0" }} />;

// m42 · el volante: tablero de camioneta con instrumentos; el espejo retrovisor cromado muestra la piara que crece en el reflejo; dos manos giran el volante entero
const HSteeringWheel: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8b890 0%,#e8d8b0 40%,#8a7a4a 60%,#5a4a2a)" f={(tt) => {
  const d = D(h), b0 = bt(h, 0, d * 0.55), near = 0.25 * eio(tt, 0, 1.1) + 0.75 * eio(tt, 1.1, b0), rot = -6 * Math.sin(tt * 1.3) + 55 * eio(tt, b0, b0 + 0.9) + swing(tt, b0 + 0.9, 7, 4, 1.4);
  return <Cam tt={tt} d={d} z={0.04} fy={600}>
    <div style={{ position: "absolute", left: -100, top: 0, width: 2120, height: 120, background: "linear-gradient(#2a2622,#4a4038)" }} />
    <div style={{ position: "absolute", left: 960 - 400, top: 50, width: 800, height: 300, borderRadius: 130, background: "linear-gradient(#e8ecf0,#7a7e82 50%,#d8dce0)", boxShadow: "0 18px 26px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 18, top: 18, width: 764, height: 264, borderRadius: 116, overflow: "hidden", background: "linear-gradient(#b8c4cc 0%,#e8dcc0 38%,#9a8a5a 52%,#6a5a32 100%)", boxShadow: "inset 0 0 40px rgba(0,0,0,.45)" }}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 764, height: 120, background: "linear-gradient(#4a4440,#2a2622)", clipPath: "polygon(38% 0,62% 0,100% 100%,0 100%)" }} />
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.06 * near}) perspective(600px) rotateY(0deg)`, transformOrigin: "50% 60%" }}><Prop id="sounder" x={382} y={816 + 200 + 50 * near} w={200 + 420 * near} sh={0} /></div>
        <div style={{ position: "absolute", left: -40, top: -60, width: 400, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,255,255,.35),transparent 70%)" }} /></div></div>
    <div style={{ position: "absolute", left: 950, top: 320, width: 20, height: 0 }} />
    <div style={{ position: "absolute", left: -100, top: 620, width: 2120, height: 520, borderRadius: "60px 60px 0 0", background: "linear-gradient(#3a3430,#1a1614)", boxShadow: "0 -10px 30px rgba(0,0,0,.5), inset 0 6px 0 rgba(255,255,255,.08)" }} />
    {[[700, 720], [1220, 720]].map(([x, y], j) => <div key={j} style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#1a1a1a 55%,#3a3a3a)", boxShadow: "0 0 0 10px #8a8e92, inset 0 0 20px #000" }}>
      {Array.from({ length: 7 }, (_, k) => <div key={k} style={{ position: "absolute", left: 88, top: 10, width: 4, height: 18, background: "#f0e8d0", transformOrigin: "2px 80px", transform: `rotate(${-120 + k * 40}deg)` }} />)}
      <div style={{ position: "absolute", left: 86, top: 24, width: 8, height: 70, background: "#e8501e", transformOrigin: "4px 66px", transform: `rotate(${(j ? -40 : 30) + 20 * Math.sin(tt * (j ? 2.3 : 1.1))}deg)` }} /></div>)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 900px", transform: `rotate(${rot}deg)` }}>
      <Prop id="steering_wheel" x={960} y={1250} w={700} sh={0} />
      <Prop id="hand_flannel" x={650} y={860} w={360} r={60} sh={0} />
      <Prop id="hand_flannel" x={1270} y={860} w={360} r={-60} flip sh={0} /></div>
  </Cam>;
}} />;

// m14 · dos tercios: manómetro de chapa con vidrio abombado; la aguja de latón sube y rebota sobre la raya roja del 66 %; seis chanchitos de arcilla adentro: al cruzar se apagan cuatro y después vuelven dos
const HTwoThirdsGauge: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = 0.3 * eio(tt, 0, 1.1) + 0.7 * eio(tt, 1.1, d * 0.45), ang = -120 + 240 * 0.66 * up + (up > 0.99 ? swing(tt, d * 0.45, 9, 6, 1.6) : 0), cross = d * 0.45, back = d * 0.72;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 960 - 400, top: 1000 - 30, width: 800, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.6),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 960 - 380, top: 160, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#d8dce0,#7a7e82 60%,#3a3e42)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle,#fbf6ea 60%,#e0d4b8)", boxShadow: "inset 0 10px 30px rgba(0,0,0,.35)" }}>
        <svg width={680} height={680} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 21 }, (_, k) => { const a = (-120 + k * 12 - 90) * Math.PI / 180; return <line key={k} x1={340 + Math.cos(a) * 300} y1={340 + Math.sin(a) * 300} x2={340 + Math.cos(a) * (k % 5 ? 270 : 245)} y2={340 + Math.sin(a) * (k % 5 ? 270 : 245)} stroke="#2a2a2a" strokeWidth={k % 5 ? 4 : 8} />; })}
          {(() => { const a0 = (-120 + 240 * 0.66 - 90) * Math.PI / 180, a1 = (120 - 90) * Math.PI / 180; return <path d={`M${340 + Math.cos(a0) * 290} ${340 + Math.sin(a0) * 290} A290 290 0 0 1 ${340 + Math.cos(a1) * 290} ${340 + Math.sin(a1) * 290}`} stroke="#c41e1e" strokeWidth={26} fill="none" />; })()}
          {(() => { const a = (-120 + 240 * 0.66 - 90) * Math.PI / 180; return <line x1={340 + Math.cos(a) * 310} y1={340 + Math.sin(a) * 310} x2={340 + Math.cos(a) * 220} y2={340 + Math.sin(a) * 220} stroke="#c41e1e" strokeWidth={12} />; })()}</svg>
        {Array.from({ length: 6 }, (_, k) => { const gone = k < 4 && tt > cross + k * 0.15, ret = k < 2 && tt > back + k * 0.4, o = gone && !ret ? 0.18 : 1, g = ret ? phys(tt, back + k * 0.4, 7, 0.4) : 1;
          return <div key={k} style={{ position: "absolute", inset: 0, filter: o < 1 ? "grayscale(1)" : "none" }}><Prop id="clay_hog" x={165 + (k % 3) * 175} y={400 + 470 + Math.floor(k / 3) * 110} w={150 * (o < 1 ? 1 : g)} o={o} sh={o} /></div>; })}
        <div style={{ position: "absolute", left: 330, top: 60, width: 20, height: 290, borderRadius: 10, background: "linear-gradient(90deg,#7a5214,#f0c870,#7a5214)", transformOrigin: "10px 280px", transform: `rotate(${ang}deg)`, boxShadow: "6px 8px 8px rgba(0,0,0,.4)" }} />
        <div style={{ position: "absolute", left: 300, top: 300, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#f0c870,#6a4a10)" }} /></div>
      <div style={{ position: "absolute", left: 40, top: 40, width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(ellipse at 32% 24%,rgba(255,255,255,.55),rgba(255,255,255,0) 30%), radial-gradient(circle,transparent 70%,rgba(255,255,255,.12))" }} /></div>
  </Cam>;
}} />;

// m7 · el cerco no aguantó: cuatro postes con malla; el jabalí embiste, la malla se estira como tela, los postes se quiebran de a uno con tierra y pasa por encima
const HBrokenFence: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), hit = 0.9, bx = 1700 - 600 * eio(tt, 0, hit), PX = [420, 760, 1100, 1440], br = PX.map((_, k) => hit + 0.25 + (3 - k) * 0.3), bulge = 160 * eio(tt, hit - 0.1, hit + 0.3) * (1 - eio(tt, br[0] + 0.3, br[0] + 0.8)), over = eio(tt, br[0], d - 0.3);
  const tilt = (k: number) => tt < br[k] ? swing(tt, hit, 4, 9, 2) : -70 * eio(tt, br[k], br[k] + 0.4) + 6 * swing(tt, br[k] + 0.4, 1, 6, 3);
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={600} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 7 }, (_, r) => { const y = 520 + r * 60; return <path key={r} d={`M${PX[0]} ${y} Q${930} ${y + bulge * 0.6} ${PX[3]} ${y}`} stroke="rgba(200,205,210,.9)" strokeWidth={4} fill="none" transform={`translate(${bulge * 0.2},0)`} opacity={1 - eio(tt, br[0], br[0] + 0.5)} />; })}
      {Array.from({ length: 12 }, (_, c) => { const x = PX[0] + c * (PX[3] - PX[0]) / 11; return <path key={c} d={`M${x} 520 Q${x + bulge * 0.1} 700 ${x} 880`} stroke="rgba(200,205,210,.9)" strokeWidth={4} fill="none" opacity={1 - eio(tt, br[0], br[0] + 0.5)} />; })}</svg>
    {PX.map((x, k) => <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${x}px 900px`, transform: `rotate(${tilt(k)}deg)` }}>
      <div style={{ position: "absolute", left: x - 26, top: 440, width: 52, height: 470, borderRadius: 6, background: "repeating-linear-gradient(180deg,rgba(0,0,0,.12) 0 3px,transparent 3px 40px), linear-gradient(90deg,#5a3e22,#a8784a 45%,#4a3018)", boxShadow: "10px 14px 14px rgba(0,0,0,.45)" }} /></div>)}
    {PX.map((x, k) => <Dust key={k} tt={tt} at={br[k]} x={x} y={900} w={220} col="rgba(170,140,100,.85)" />)}
    <Prop id="boar_run" x={bx - 1000 * over} y={930 - 120 * Math.sin(cl((tt - br[0]) / 0.8) * Math.PI) * (tt > br[0] ? 1 : 0)} w={600} flip r={tt > br[0] && tt < br[0] + 0.8 ? -8 : 0} />
  </Cam>;
}} />;

// m25 · desde el helicóptero: maqueta cenital del campo; la sombra del rotor barre en cono; la piara corre desde el cono hacia el claro del monte
const HHeliView: C = ({ t, h }) => <S t={t} h={h} bg="#5a6a32" f={(tt) => {
  const d = D(h), hx = 300 + 900 * eio(tt, 0, d * 0.8), hy = 380 + 120 * Math.sin(tt * 0.6), run = 0.25 * eio(tt, 0.2, 1.1) + 0.75 * eio(tt, 1.1, d - 0.5);
  const HG = Array.from({ length: 9 }, (_, k) => ({ x: 360 + (k % 3) * 110 + (k * 37) % 50, y: 560 + Math.floor(k / 3) * 110 + (k * 23) % 40 }));
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", inset: -100, background: "radial-gradient(circle at 20% 30%,rgba(255,255,255,.07) 3px,transparent 4px) 0 0/34px 34px, repeating-linear-gradient(12deg,#6a7a3a 0 40px,#5a6a30 40px 90px)" }} />
    <div style={{ position: "absolute", left: 1350, top: 330, width: 460, height: 380, borderRadius: "50%", background: "radial-gradient(ellipse,#a89a62,#8a7a48 70%,transparent 72%)" }} />
    {Array.from({ length: 14 }, (_, k) => { const a = k / 14 * Math.PI * 2; return <div key={k} style={{ position: "absolute", left: 1580 + Math.cos(a) * 280 - 90, top: 520 + Math.sin(a) * 240 - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#4a6a2a,#1e3210 70%)", boxShadow: "14px 18px 18px rgba(0,0,0,.45)" }} />; })}
    <div style={{ position: "absolute", left: hx - 420, top: hy - 280, width: 840, height: 560, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.42),rgba(0,0,0,.18) 55%,transparent 72%)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><g transform={`translate(${hx},${hy}) rotate(${tt * 900})`}>{[0, 90].map((a) => <rect key={a} x={-300} y={-14} width={600} height={28} rx={14} fill="rgba(0,0,0,.4)" transform={`rotate(${a})`} />)}</g>
      <ellipse cx={hx + 40} cy={hy + 10} rx={110} ry={50} fill="rgba(0,0,0,.45)" /></svg>
    {HG.map((p, k) => { const r = cl(run * 1.2 - k * 0.03), x = p.x + (1520 - p.x) * r, y = p.y + (500 + (k % 3) * 40 - p.y) * r, hide = eio(r, 0.85, 1);
      return <div key={k} style={{ position: "absolute", left: x - 75, top: y - 42, width: 150, height: 84, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 40%,#5a4232,#2a1c12 70%)", boxShadow: "8px 10px 8px rgba(0,0,0,.45)", transform: `rotate(${Math.atan2(500 - p.y, 1520 - p.x) * 57}deg) scale(${1 - 0.5 * hide})`, opacity: 1 - hide }}>
        <div style={{ position: "absolute", left: 126, top: 27, width: 38, height: 30, borderRadius: "50%", background: "#3a2a1c" }} /></div>; })}
    {HG.map((p, k) => <Dust key={k} tt={tt} at={0.2 + k * 0.05} x={p.x} y={p.y + 20} w={90} col="rgba(170,150,100,.7)" />)}
  </Cam>;
}} />;

// m34 · los cercos no los paran: maqueta cenital con tres parcelas y cercos de palitos con cartel de dueño; la piara hoza en las tres; la jaula cae sólo en la del medio, sube con los suyos y esa parcela queda vacía
const HPropertyLines: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), drop = d * 0.45, lift = eio(tt, drop + 1.4, drop + 2.4), cage = land(tt, drop, 700), PL = [[160, "SMITH"], [700, "JONES"], [1240, "DAVIS"]] as [number, string][];
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={60} tone="#6a4a2c" />
    {PL.map(([x, nm], k) => <div key={nm} style={{ position: "absolute", left: x, top: 220, width: 520, height: 660, background: `radial-gradient(circle at 30% 30%,rgba(255,255,255,.06) 3px,transparent 4px) 0 0/26px 26px, ${["#7a8a42", "#8a9a4a", "#6a7a38"][k]}`, boxShadow: "0 18px 0 #4a3418, 0 30px 30px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 20, top: 16, padding: "4px 18px", background: "linear-gradient(#e8d0a0,#b89460)", fontFamily: SER, fontWeight: 900, fontSize: 40, color: "#3a2410", boxShadow: "0 6px 8px rgba(0,0,0,.45)" }}>{nm}</div></div>)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[680, 1220].map((x) => <g key={x}><line x1={x + 10} y1={220} x2={x + 10} y2={880} stroke="#8a6238" strokeWidth={6} />{Array.from({ length: 8 }, (_, j) => <rect key={j} x={x} y={230 + j * 90} width={20} height={20} rx={4} fill="#5a3a1c" />)}</g>)}</svg>
    {Array.from({ length: 9 }, (_, k) => { const pc = k % 3, mid = pc === 1, hx = PL[pc][0] + 130 + (Math.floor(k / 3)) * 130 + 60 * Math.sin(tt * 1.3 + k * 2), hy = 420 + (Math.floor(k / 3)) * 150 + 40 * Math.cos(tt * 1.1 + k), cross = k === 0 ? 1100 * eio(tt, 0.2, drop - 0.3) : 0, up = mid && cage.on ? -900 * lift : 0;
      return <Prop key={k} id="clay_hog" x={hx + cross} y={hy + up} w={150} flip={Math.cos(tt * 1.3 + k * 2) < 0} o={mid && cage.on ? 1 - lift : 1} />; })}
    {cage.on && <div style={{ position: "absolute", left: 690, top: 210 + cage.dy - 900 * lift, width: 540, height: 680, border: "14px solid #4a4e52", background: "repeating-linear-gradient(0deg,rgba(60,64,68,.85) 0 6px,transparent 6px 60px), repeating-linear-gradient(90deg,rgba(60,64,68,.85) 0 6px,transparent 6px 60px)", boxShadow: `0 ${30 * cage.k}px 30px rgba(0,0,0,.5)` }} />}
    <Dust tt={tt} at={drop + 0.1} x={960} y={880} w={520} />
  </Cam>;
}} />;

// m41 · todo en un minuto: el remolque ganadero de costado; los cajones con su objeto suben de a uno por la rampa y frenan adentro
const HTrailerRecap: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), its = ["pink_pig", "galleon", "cast_net", "trail_cam", "boar_stand"], step = (d - 1.2) / its.length;
  return <Cam tt={tt} d={d} z={0.04}>
    <Suelo y0={640} />
    <div style={{ position: "absolute", left: 640, top: 1010, width: 1200, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 660, top: 360, width: 1160, height: 560, borderRadius: 16, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 6px,transparent 6px 110px), linear-gradient(#c8ccd0,#8a8e92 60%,#6a6e72)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 4px 0 rgba(255,255,255,.5)" }}>
      {Array.from({ length: 3 }, (_, r) => <div key={r} style={{ position: "absolute", left: 40, top: 40 + r * 70, width: 1080, height: 26, borderRadius: 13, background: "#2a2e32" }} />)}
      <div style={{ position: "absolute", left: 30, top: 250, width: 1100, height: 280, background: "linear-gradient(#3a3020,#1e1a12)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.6)" }} /></div>
    {[880, 1580].map((x) => <div key={x} style={{ position: "absolute", left: x - 90, top: 860, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#8a8e92 22%,#1a1a1a 26%,#2a2a2a 60%,#0a0a0a)", transform: `rotate(${tt * 30}deg)`, boxShadow: "0 10px 14px rgba(0,0,0,.5)" }} />)}
    <div style={{ position: "absolute", left: 60, top: 860, width: 660, height: 34, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.25) 0 4px,transparent 4px 60px), linear-gradient(#a8784a,#6a4a28)", transform: "rotate(-24deg)", transformOrigin: "100% 0", boxShadow: "0 14px 16px rgba(0,0,0,.45)" }} />
    {its.map((id, k) => { const a = -0.2 + k * step, p = eio(tt, a, a + 1.1); if (p <= 0) return null; const ramp = cl(p / 0.6), inside = cl((p - 0.6) / 0.4), bx = 180 + 520 * ramp + (180 + k * 200 - 0) * inside, by = 1040 - 260 * ramp - 30 * inside, st = swing(tt, a + 1.1, 4, 7, 2);
      return <div key={id} style={{ position: "absolute", left: bx - 90, top: by - 170, width: 180, height: 170, transform: `rotate(${(1 - inside) * -24 * (ramp < 1 ? 1 : 0) + st}deg)`, transformOrigin: "50% 100%", borderRadius: 8, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 4px,transparent 4px 42px), linear-gradient(90deg,#b8844a,#d8a868,#a8743a)", boxShadow: "0 12px 14px rgba(0,0,0,.5)" }}>
        <Prop id={id} x={90} y={910 + 150} w={150} sh={0} /></div>; })}
  </Cam>;
}} />;

export const HCE5: Record<string, C> = {
  steeringWheel: HSteeringWheel, twoThirdsGauge: HTwoThirdsGauge, brokenFence: HBrokenFence, heliView: HHeliView, propertyLines: HPropertyLines, trailerRecap: HTrailerRecap,
};
