// l9229e «Fears» · parte 1: el auto con el motor apagado, el baile de 1955 en el Legion Hall, el delantal de June, el techo y las lilas, la mesa para uno
import React from "react";
import { cl, eio } from "./hkit";
import { S, D, bt, C, SER, Prop, Cam, Mesa, Glow, Rings, land, swing, rnd } from "./pk";
import { Fondo } from "./lk";

const WOODTOP = "repeating-linear-gradient(90deg,rgba(0,0,0,.10) 0 3px,transparent 3px 160px),repeating-linear-gradient(90deg,rgba(255,230,190,.05) 0 1px,transparent 1px 23px),linear-gradient(180deg,#b08250,#8a6036)";
// vapor: tres jirones que suben y se abren
const Steam: React.FC<{ tt: number; x: number; y: number; s?: number; o?: number }> = ({ tt, x, y, s = 1, o = 1 }) => <>{[0, 1, 2].map((k) => { const p = ((tt * 0.45 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: x - 60 * s + 40 * Math.sin(tt * 1.5 + k * 2) * s, top: y - 320 * p * s, width: 120 * s, height: 180 * s, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.55), rgba(255,255,255,0) 70%)", opacity: o * Math.sin(p * Math.PI), filter: "blur(10px)" }} />; })}</>;
// cono de luz de reflector
const Beam: React.FC<{ x: number; y: number; a: number; len?: number; w?: number; o?: number }> = ({ x, y, a, len = 1100, w = 520, o = 0.5 }) => <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: len, transformOrigin: "50% 0", transform: `rotate(${a}deg)`, background: `linear-gradient(rgba(255,240,210,${o}),rgba(255,240,210,0))`, clipPath: "polygon(46% 0,54% 0,100% 100%,0 100%)", mixBlendMode: "screen", filter: "blur(6px)" }} />;

// «The engine is off»: la llave en el contacto gira hacia atrás y las luces del tablero se apagan; queda el estacionamiento quieto
const HEngineOff: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 0.7), p = eio(tt, at, at + 0.35), dash = 1 - eio(tt, at + 0.2, at + 0.8);
  return <Cam tt={tt} d={d} z={0.07} fx={1250} fy={700}>
    <Fondo id="le_e01" tt={tt} b={3} br={0.45 + 0.25 * dash} />
    <Glow x={700} y={900} r={420} o={0.8 * dash} col="255,170,80" />
    <div style={{ position: "absolute", left: 1250 - 70, top: 760, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#6a6a6a,#1a1a1a)", boxShadow: "0 10px 20px rgba(0,0,0,.6), inset 0 0 0 8px #2a2a2a" }} />
    <Prop id="ignition_key" x={1250 + 80} y={860} w={420} r={-38 * (1 - p) + swing(tt, at + 0.35, 4, 16, 3)} sh={0} style={{ transformOrigin: "20% 70%" }} />
  </Cam>;
}} />;

// «the dance I said no to in 1955»: la entrada de papel cae sobre la mesa frente al salón vacío y un sello «1955» la marca
const HTicketStub: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.3, 650, 9, 0.4), st = bt(h, 0, 1.3), sp = tt < st ? 0 : Math.max(1, 2.2 - 1.2 * eio(tt, st, st + 0.18));
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e02" tt={tt} b={8} br={0.55} />
    <Mesa y0={780} tone="#8a5e34" />
    {L.on && <div style={{ position: "absolute", left: 0, top: L.dy, width: 1920, height: 1080 }}>
      <Prop id="ticket_stub" x={960} y={960} w={760} r={-5} sq={L.sq} />
      {sp > 0 && <div style={{ position: "absolute", left: 960, top: 820, transform: `translate(-50%,-50%) rotate(-12deg) scale(${sp})`, opacity: tt < st ? 0 : 0.85, fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 130, color: "#7a1810", border: "10px solid #7a1810", borderRadius: 18, padding: "0 30px", mixBlendMode: "multiply" }}>1955</div>}
    </div>}
  </Cam>;
}} />;

// «the old record player in the corner still works»: el tocadiscos de valija cae en la mesa y al lado un disco gira con su brillo corriendo
const HRecordSpin: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.3, 600), on = eio(tt, 1.0, 1.8), ang = 200 * Math.max(0, tt - 1.0) * on;
  return <Cam tt={tt} d={d} z={0.06} fx={1300}>
    <Fondo id="le_e03" tt={tt} b={10} br={0.5} />
    <Mesa y0={760} tone="#d0a64a" />
    {L.on && <Prop id="record_player" x={700} y={990 + L.dy} w={720} sq={L.sq} />}
    <div style={{ position: "absolute", left: 1400 - 290, top: 560 - 120 * (1 - on), width: 580, height: 580, opacity: cl((tt - 0.8) / 0.3), transform: `perspective(1200px) rotateX(${58 - 20 * on}deg)` }}>
      <Prop id="vinyl_record" x={290} y={1080} w={580} sh={0} r={ang} style={{ transformOrigin: "50% 50%" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${ang}deg, rgba(255,255,255,.0), rgba(255,255,255,.28) 8%, rgba(255,255,255,0) 16%, rgba(255,255,255,0) 50%, rgba(255,255,255,.22) 58%, rgba(255,255,255,0) 66%)`, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: 290 - 70, top: 290 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(#111 0 9%, #c0392b 10% 100%)", transform: `rotate(${ang}deg)` }} />
    </div>
  </Cam>;
}} />;

// «a band from Waterloo, paper streamers»: serpentinas de papel de colores caen girando delante del salón de baile, con luces cálidas
const HStreamersHall: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), COL = ["#e8c84a", "#d0453a", "#3a7ac0", "#f0f0e0", "#5aa05a"];
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="le_e04" tt={tt} b={4} br={0.6} />
    {Array.from({ length: 34 }, (_, k) => { const at = 0.1 + rnd(k) * 1.6, p = Math.max(0, tt - at), x = 60 + rnd(k + 7) * 1800 + 60 * Math.sin(p * 2 + k), y = -200 + p * (160 + rnd(k + 3) * 140), z = 0.6 + rnd(k + 11) * 0.8; return tt < at ? null : <div key={k} style={{ position: "absolute", left: x, top: y, width: 26 * z, height: 260 * z, background: `linear-gradient(${COL[k % 5]}, ${COL[k % 5]}cc)`, borderRadius: 6, transform: `rotate(${20 * Math.sin(p * 3 + k)}deg) skewY(${12 * Math.sin(p * 4 + k)}deg)`, boxShadow: "4px 8px 10px rgba(0,0,0,.35)", filter: z < 0.9 ? "blur(2px)" : "none" }} />; })}
    <Glow x={500 + 300 * Math.sin(tt)} y={300} r={360} o={0.5} col="255,200,140" />
    <Glow x={1400 - 300 * Math.sin(tt * 0.8)} y={260} r={320} o={0.45} col="200,220,255" />
  </Cam>;
}} />;

// «punch in a big glass bowl»: la ponchera de cristal en la mesa; el cucharón entra y salen anillos en el ponche rojo con reflejos
const HPunchLadle: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.3, 500, 8, 0.45), dip = bt(h, 0, 1.2);
  return <Cam tt={tt} d={d} z={0.08} fy={720}>
    <Fondo id="le_e02" tt={tt} b={14} br={0.4} />
    <Mesa y0={800} tone="#f2ece0" />
    {L.on && <Prop id="punch_bowl" x={960} y={1000 + L.dy} w={940} sq={L.sq} />}
    <Rings tt={tt} at={dip} x={940} y={640} s={1.4} />
    <Rings tt={tt} at={dip + 0.6} x={940} y={640} s={1.1} />
    <Glow x={960} y={700} r={380} o={0.5} col="255,120,120" />
  </Cam>;
}} />;

// «in a blue dress with white flowers»: un zapatito azul de 1955 cae en el piso de baile bajo un foco que lo encuentra
const HBlueShoe: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.5, 700, 8, 0.38), a = -30 + 30 * eio(tt, 0, 1.0);
  return <Cam tt={tt} d={d} z={0.08} fx={960} fy={860}>
    <Fondo id="le_e24" tt={tt} b={8} br={0.32} />
    <Beam x={960} y={-60} a={a} len={1200} w={900} o={0.45} />
    {L.on && <Prop id="dress_shoe" x={960} y={950 + L.dy} w={560} r={-6} sq={L.sq} />}
    <Glow x={960} y={880} r={360} o={0.6 * cl((tt - 0.5) / 0.4)} />
    {Array.from({ length: 9 }, (_, k) => { const at = 0.6 + k * 0.05, p = (tt - at) / 1.4; return p <= 0 || p >= 1 ? null : <div key={k} style={{ position: "absolute", left: 960 + Math.cos(k * 0.7) * 300 * p, top: 900 - 220 * p * Math.abs(Math.sin(k * 1.3)) + 200 * p * p, width: 22, height: 14, borderRadius: "50%", background: "#f8f4ea", opacity: 1 - p, transform: `rotate(${k * 40 + 300 * p}deg)` }} />; })}
  </Cam>;
}} />;

// «And the band started playing Tennessee Waltz»: la funda del disco entra deslizándose y el disco sale de adentro hacia la derecha, girando
const HWaltzSleeve: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), inn = eio(tt, 0.2, 0.9), out = eio(tt, 1.0, 1.9), ang = 120 * Math.max(0, tt - 1.0);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e26" tt={tt} b={12} br={0.45} />
    <Mesa y0={760} tone="#9a6c3e" />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${-900 * (1 - inn)}px)` }}>
      <Prop id="vinyl_record" x={820 + 520 * out} y={930} w={560} sh={out} r={ang} style={{ transformOrigin: "50% 50%" }} />
      <Prop id="record_sleeve" x={760} y={960} w={600} r={-3} />
    </div>
    {out > 0.95 && <Glow x={1340} y={650} r={320} o={0.5} />}
  </Cam>;
}} />;

// «I was a farm boy with big feet»: dos botas de campo enormes caen de golpe junto al zapatito; la cámara tiembla con el pisotón
const HBigBoots: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 0.9), L = land(tt, at, 900, 7, 0.32), sh = tt > at + 0.12 ? 14 * Math.exp(-7 * (tt - at - 0.12)) * Math.sin(50 * tt) : 0;
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${sh}px)` }}>
      <Fondo id="le_e24" tt={tt} b={10} br={0.5} />
      <Mesa y0={760} tone="#a07446" />
      <Prop id="dress_shoe" x={1450} y={980} w={300} r={-4} />
      {L.on && <Prop id="work_boots" x={760} y={1010 + L.dy} w={820} sq={L.sq * 1.6} />}
    </div>
  </Cam>;
}} />;

// «Three minutes that felt like three years»: el reloj de arena da vuelta en cámara lenta y la arena cae grano a grano
const HHourglassSlow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fl = eio(tt, 0.3, 1.4), r = 180 * fl;
  return <Cam tt={tt} d={d} z={0.08} fy={560}>
    <Fondo id="le_e04" tt={tt} b={18} br={0.3} />
    <Mesa y0={820} tone="#6a4a2e" />
    <Prop id="hourglass" x={960} y={560 + 300} w={330} r={r} sh={0} style={{ transformOrigin: "50% 50%" }} />
    <div style={{ position: "absolute", left: 960 - 200, top: 1000, width: 400, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.45)", filter: "blur(10px)" }} />
    {fl >= 1 && Array.from({ length: 14 }, (_, k) => { const p = ((tt * 0.35 + k / 14) % 1); return <div key={k} style={{ position: "absolute", left: 958 + Math.sin(k) * 2, top: 520 + 90 * p, width: 4, height: 6, borderRadius: 2, background: "#e8d4a8", opacity: 0.9 }} />; })}
    <Glow x={960} y={540} r={300} o={0.35} />
  </Cam>;
}} />;

// «They're all standing by their own wall»: travelling lateral lento por la pared del salón: silla plegable tras silla plegable, cada una sola
const HWallChairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), px = -1500 * eio(tt, 0, d);
  return <div style={{ position: "absolute", inset: 0 }}>
    <Fondo id="le_e02" tt={tt} b={16} br={0.4} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${px * 0.3}px)` }}>
      <div style={{ position: "absolute", left: -400, top: 140, width: 4000, height: 720, background: "repeating-linear-gradient(90deg,#8a7458 0 300px,#7a6448 300px 306px)", boxShadow: "inset 0 -30px 40px rgba(0,0,0,.4)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "linear-gradient(#6a4a2e,#3a2414)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${px}px)` }}>
      {Array.from({ length: 7 }, (_, k) => <Prop key={k} id="folding_chair" x={360 + k * 520} y={900} w={300} r={(k % 3 - 1) * 2} />)}
    </div>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,.55))" }} />
  </div>;
}} />;

// «her apron was hanging on the hook by the stove»: el delantal a cuadros cuelga del gancho y se hamaca solo, como si alguien acabara de pasar
const HApronHook: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = swing(tt, 0.4, 9, 2.6, 0.5);
  return <Cam tt={tt} d={d} z={0.07} fy={400}>
    <Fondo id="le_e05" tt={tt} b={10} br={0.5} />
    <div style={{ position: "absolute", left: 960 - 30, top: 150, width: 60, height: 40, borderRadius: 8, background: "linear-gradient(#cfcfcf,#7a7a7a)", boxShadow: "0 8px 12px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 170px", transform: `rotate(${a}deg)` }}>
      <Prop id="apron_check" x={960} y={170 + 780} w={600} sh={0} style={{ filter: "drop-shadow(20px 30px 24px rgba(0,0,0,.5))" }} />
    </div>
    <Glow x={700} y={500} r={400} o={0.35} />
  </Cam>;
}} />;

// «things out of cans»: latas de conserva entran rodando por la mesa, chocan una con otra y quedan en fila; la última se tumba
const HCanStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="le_e06" tt={tt} b={10} br={0.5} />
    <Mesa y0={760} tone="#9a7046" />
    {[0, 1, 2, 3].map((k) => { const at = 0.3 + k * 0.45, p = eio(tt, at, at + 0.7), x = 2200 - (2200 - (460 + k * 360)) * p, wob = swing(tt, at + 0.7, 6, 14, 3), last = k === 3, tip = last ? 80 * eio(tt, at + 1.1, at + 1.5) : 0;
      return tt < at ? null : <Prop key={k} id="tin_can" x={x} y={990} w={340} r={(1 - p) * -360 * 0 + wob + tip} />; })}
  </Cam>;
}} />;

// «she taught me to make a meatloaf»: el pan de carne en su molde cae humeante sobre la mesa de la cocina, con vapor y luz cálida
const HMeatloafPan: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.3, 600, 9, 0.42);
  return <Cam tt={tt} d={d} z={0.08} fy={760}>
    <Fondo id="le_e25" tt={tt} b={10} br={0.55} />
    <Mesa y0={760} tone="#d4ab50" />
    {L.on && <Prop id="meatloaf_pan" x={960} y={990 + L.dy} w={820} sq={L.sq} />}
    {tt > 0.7 && <Steam tt={tt} x={960} y={760} s={1.6} o={cl((tt - 0.7) / 0.6)} />}
    <Glow x={960} y={760} r={420} o={0.45} />
  </Cam>;
}} />;

// «Make a list of the people»: una libreta abierta; una mano escribe renglones-nombre y al lado de cada uno dibuja un corazón… menos uno, que se tacha
const HLovesList: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 5, step = (d - 1.5) / N, k = Math.min(N - 1, Math.max(0, Math.floor((tt - 0.6) / step))), q = cl((tt - 0.6 - k * step) / step);
  const hx = 820 + 340 * q, hy = 330 + k * 110;
  return <Cam tt={tt} d={d} z={0.08} fx={hx} fy={hy}>
    <div style={{ position: "absolute", inset: 0, background: WOODTOP }} />
    <Prop id="notebook_open" x={960} y={1060} w={1300} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: N }, (_, i) => { const p = i < k ? 1 : i === k ? q : 0, y = 330 + i * 110, bad = i === 3; return p <= 0 ? null : <g key={i}>
        <path d={`M640 ${y} q30 -24 60 0 t60 0 t60 0 t60 0`} fill="none" stroke="#24305a" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl(p / 0.6)} 1`} />
        {!bad && p > 0.65 && <path d={`M1000 ${y - 6} c-20 -30 -60 -6 -30 26 l30 26 l30 -26 c30 -32 -10 -56 -30 -26z`} fill="#c0281c" opacity={cl((p - 0.65) / 0.2)} />}
        {bad && p > 0.7 && <path d={`M630 ${y} L900 ${y - 4}`} stroke="#24305a" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl((p - 0.7) / 0.25)} 1`} />}
      </g>; })}
    </svg>
    <Prop id="hand_pen" x={hx + 120} y={hy + 260} w={520} sh={0.4} />
  </Cam>;
}} />;

// «an audience that isn't even in the theater»: un reflector barre la platea vacía buscando a alguien; no hay nadie
const HEmptyTheater: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = -38 + 76 * (0.5 - 0.5 * Math.cos(Math.PI * cl(tt / (d - 0.5))));
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e07" tt={tt} b={2} br={0.28} />
    <Beam x={960} y={-80} a={a} len={1400} w={760} o={0.55} />
    <Glow x={960 - 1000 * Math.tan(a * Math.PI / 180) * 0.9} y={820} r={300} o={0.6} />
  </Cam>;
}} />;

// «My chili's still terrible»: la olla de chile humea y burbujea; de golpe escupe un globo de humo oscuro
const HChiliSteam: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), boom = bt(h, 0, 1.4), bp = (tt - boom) / 1.2;
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="le_e05" tt={tt} b={14} br={0.45} />
    <Mesa y0={800} tone="#3a3a3a" />
    <Prop id="chili_pot" x={960} y={1000} w={760} r={tt > boom && tt < boom + 0.4 ? 3 * Math.sin(tt * 60) : 0} />
    <Steam tt={tt} x={960} y={640} s={1.4} o={0.8} />
    {bp > 0 && bp < 1 && <div style={{ position: "absolute", left: 960 - 220 * (0.4 + bp), top: 560 - 380 * bp - 220 * (0.4 + bp), width: 440 * (0.4 + bp), height: 440 * (0.4 + bp), borderRadius: "50%", background: "radial-gradient(circle, rgba(60,50,45,.85), rgba(60,50,45,0) 70%)", opacity: 1 - bp, filter: "blur(6px)" }} />}
  </Cam>;
}} />;

// «the roof on this house needed to be redone»: tejas grises se van colocando hilera por hilera sobre el techo, de abajo hacia arriba
const HShingleRoof: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d - 1.4) / 15;
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 3px,transparent 3px 120px),repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 2px,transparent 2px 480px),linear-gradient(#a88a62,#7a5e3e)" }} />
    {Array.from({ length: 15 }, (_, i) => { const r = Math.floor(i / 5), c = i % 5, at = 0.3 + i * step, L = land(tt, at, 260, 10, 0.4); return L.on ? <Prop key={i} id="roof_shingle" x={180 + c * 390 + (r % 2) * 195} y={1120 - r * 300 + L.dy} w={430} sq={L.sq} sh={0.7} r={(i % 3 - 1) * 1.2} /> : null; })}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(140,190,255,.18),rgba(0,0,0,0) 40%,rgba(0,0,0,.35))" }} />
  </Cam>;
}} />;

// «I caught the gutter on the way down»: la canaleta se dobla desde un extremo, rebota colgando y gotea
const HGutterHang: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 0.6), a = tt < at ? 0 : 28 * eio(tt, at, at + 0.3) + swing(tt, at + 0.3, 8, 7, 1.4);
  return <Cam tt={tt} d={d} z={0.06} fx={600} fy={360}>
    <Fondo id="le_e22" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "310px 330px", transform: `rotate(${a}deg)` }}>
      <Prop id="rain_gutter" x={860} y={460} w={1100} sh={0} />
    </div>
    {tt > at + 0.4 && Array.from({ length: 6 }, (_, k) => { const p = ((tt - at) * 0.9 + k / 6) % 1, gx = 310 + Math.cos(a * Math.PI / 180) * 1080, gy = 330 + Math.sin(a * Math.PI / 180) * 1080; return <div key={k} style={{ position: "absolute", left: Math.min(1880, gx) - 6, top: Math.min(1000, gy) + 700 * p * p, width: 12, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(200,220,240,.8)", opacity: 1 - p }} />; })}
  </Cam>;
}} />;

// «dropped into June's lilac bushes»: tejas que caen dando vueltas entre las lilas, y al golpe salta una nube de pétalos lila
const HLilacDrop: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hit = bt(h, 0, 0.9);
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="le_e09" tt={tt} b={4} br={0.6} />
    {[0, 1, 2].map((k) => { const at = 0.1 + k * 0.18, p = cl((tt - at) / (hit - 0.1)), x = 760 + k * 220 + 80 * Math.sin(k), y = -200 + 1100 * p * p; return tt < at || p >= 1 ? null : <Prop key={k} id="roof_shingle" x={x} y={y} w={340} r={540 * p + k * 60} sh={0} />; })}
    {Array.from({ length: 80 }, (_, k) => { const p = (tt - hit) / 1.6; if (p <= 0 || p >= 1) return null; const a = rnd(k) * Math.PI, v = 300 + rnd(k + 4) * 500; return <div key={k} style={{ position: "absolute", left: 960 + Math.cos(a) * v * p * (k % 2 ? 1 : -1), top: 800 - Math.sin(a) * v * p + 600 * p * p, width: 34, height: 22, borderRadius: "50%", background: k % 3 ? "#b48ad8" : "#e0c8f0", opacity: 1 - p, transform: `rotate(${k * 50 + 400 * p}deg)` }} />; })}
  </Cam>;
}} />;

// «Earl and my two sons and the neighbor were all on that roof»: tres escaleras se levantan de a una desde el pasto y se apoyan contra el techo
const HLaddersUp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.3, bt(h, 0, 0.9), bt(h, 1, 1.5), bt(h, 2, 2.1)];
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="le_e10" tt={tt} b={12} br={0.55} />
    <div style={{ position: "absolute", left: 0, top: 960, width: 1920, height: 120, background: "linear-gradient(#5a7a3a,#3a5a24)" }} />
    {at.map((a, k) => { const p = eio(tt, a, a + 0.5), r = -80 + 70 * p + (tt > a + 0.5 ? swing(tt, a + 0.5, 3, 12, 3) : 0); return tt < a ? null : <Prop key={k} id="ladder" x={420 + k * 380} y={1000} w={260} r={r} sh={p} />; })}
  </Cam>;
}} />;

// «changes my light bulbs, and I pay him in cookies»: la bombilla colgante parpadea y se enciende; abajo, unas manos viejas ofrecen la galleta
const HCookieBulb: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), on = bt(h, 0, 0.9), fl = tt < on ? 0.08 : tt < on + 0.35 ? (Math.sin(tt * 70) > 0 ? 1 : 0.2) : 1, a = swing(tt, 0.2, 5, 2.4, 0.6), hu = eio(tt, on + 0.5, on + 1.1);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e18" tt={tt} b={12} br={0.25 + 0.3 * fl} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "640px 0px", transform: `rotate(${a}deg)` }}>
      <Prop id="light_bulb" x={640} y={560} w={320} sh={0} style={{ filter: `brightness(${0.6 + 0.8 * fl})` }} />
      <Glow x={640} y={470} r={420} o={fl} />
    </div>
    <Prop id="old_hands_hold" x={1300} y={1080 + 500 * (1 - hu)} w={680} sh={0} />
  </Cam>;
}} />;

// «at five o'clock when she would have been setting the table»: el reloj de pared avanza sus agujas rápido hasta las cinco y la luz de la tarde se pone naranja
const HFiveClock: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, Math.min(d - 0.5, 2.6)), mins = 10 * 60 + 10 + p * (6 * 60 + 50), hA = (mins / 60) % 12 * 30, mA = (mins % 60) * 6, CX = 960, CY = 520, R = 300;
  return <Cam tt={tt} d={d} z={0.06} fy={CY}>
    <Fondo id="le_e11" tt={tt} b={12} br={0.5} />
    <div style={{ position: "absolute", inset: 0, background: `rgba(255,140,40,${0.22 * p})`, mixBlendMode: "multiply" }} />
    <Prop id="wall_clock" x={CX} y={CY + R * 1.02} w={R * 2.04} sh={0} style={{ filter: "drop-shadow(16px 26px 20px rgba(0,0,0,.5))" }} />
    <div style={{ position: "absolute", left: CX - R * 0.6, top: CY - R * 0.6, width: R * 1.2, height: R * 1.2, borderRadius: "50%", background: "radial-gradient(#f4f1ea,#e8e2d4)" }} />
    <div style={{ position: "absolute", left: CX - 9, top: CY - R * 0.48, width: 18, height: R * 0.5, background: "#1a1a1a", borderRadius: 9, transformOrigin: "50% 100%", transform: `rotate(${hA}deg)` }} />
    <div style={{ position: "absolute", left: CX - 6, top: CY - R * 0.72, width: 12, height: R * 0.74, background: "#1a1a1a", borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${mA}deg)` }} />
    <div style={{ position: "absolute", left: CX - 16, top: CY - 16, width: 32, height: 32, borderRadius: "50%", background: "#1a1a1a" }} />
  </Cam>;
}} />;

// «you could hear the refrigerator thinking»: la heladera vieja zumba: tiembla apenas y de ella salen ondas de sonido en la cocina en silencio
const HFridgeHum: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 400, 9, 0.5), v = 1.5 * Math.sin(tt * 90);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e28" tt={tt} b={12} br={0.32} />
    <Mesa y0={900} tone="#5a4632" />
    {L.on && <Prop id="old_fridge" x={760 + v} y={1000 + L.dy} w={480} sq={L.sq} />}
    {[0, 1, 2, 3].map((k) => { const p = ((tt * 0.6 + k / 4) % 1); return tt < 0.8 ? null : <div key={k} style={{ position: "absolute", left: 1000 + 600 * p - 60, top: 560 - 180 - 200 * p, width: 120 + 400 * p, height: 360 + 400 * p, borderRadius: "50%", border: `${6 * (1 - p)}px solid rgba(255,255,255,${0.5 * (1 - p)})`, clipPath: "inset(0 0 0 50%)" }} />; })}
  </Cam>;
}} />;

// «I set the table for one»: vista desde arriba de la mesa: plato, tenedor, cuchillo, vaso y servilleta llegan deslizándose de a uno a su lugar
const HTableForOne: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.2, bt(h, 0, 1.2), bt(h, 1, 2.0), bt(h, 2, 2.8), bt(h, 3, 3.6)];
  const it = [{ id: "dinner_plate", x: 960, y: 760, w: 560, fx: 960, fy: -500, r: 0 }, { id: "fork", x: 600, y: 700, w: 420, fx: -400, fy: 700, r: 90 }, { id: "table_knife", x: 1320, y: 700, w: 440, fx: 2400, fy: 700, r: 90 }, { id: "water_glass", x: 1400, y: 420, w: 200, fx: 2300, fy: 200, r: 0 }, { id: "cloth_napkin", x: 400, y: 740, w: 300, fx: -400, fy: 900, r: 90 }];
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", inset: 0, background: WOODTOP }} />
    <div style={{ position: "absolute", left: 160, top: 160, width: 1600, height: 760, background: "linear-gradient(#e8c050,#d0a838)", boxShadow: "0 0 0 10px #b89028, 0 30px 60px rgba(0,0,0,.4)", borderRadius: 8 }} />
    {it.map((o, k) => { const p = eio(tt, at[k], at[k] + 0.45); return tt < at[k] ? null : <Prop key={k} id={o.id} x={o.fx + (o.x - o.fx) * p} y={o.fy + (o.y - o.fy) * p} w={o.w} r={o.r} sh={0.6} />; })}
  </Cam>;
}} />;

// «look out the window at the bird feeder»: el comedero cuelga y se hamaca; un cardenal rojo llega volando en arco y se posa
const HFeederBird: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 0.8), p = eio(tt, at, at + 0.9), bx = 1900 - (1900 - 1070) * p, by = 200 + (560 - 200) * p - 160 * Math.sin(p * Math.PI), a = swing(tt, 0.2, 4, 2.2, 0.5) + swing(tt, at + 0.9, 6, 4, 1.2);
  return <Cam tt={tt} d={d} z={0.07} fx={960} fy={500}>
    <Fondo id="le_e12" tt={tt} b={5} br={0.6} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 0", transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: 958, top: 0, width: 4, height: 330, background: "#3a3a3a" }} />
      <Prop id="bird_feeder" x={960} y={760} w={460} sh={0} style={{ filter: "drop-shadow(14px 22px 16px rgba(0,0,0,.45))" }} />
      {p >= 1 && <Prop id="cardinal_bird" x={1070} y={560} w={240} sh={0} />}
    </div>
    {p < 1 && tt > at && <Prop id="cardinal_bird" x={bx} y={by} w={240} sh={0} r={-15 * Math.sin(tt * 30)} />}
  </Cam>;
}} />;

// «green jello with things in it»: la gelatina verde en su plato tiembla como un resorte al apoyarse
const HJelloWobble: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.3, 600, 8, 0.38), wb = tt < 0.5 ? 0 : 0.12 * Math.exp(-1.2 * (tt - 0.5)) * Math.sin(16 * (tt - 0.5)) + 0.02 * Math.sin(tt * 9);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="le_e14" tt={tt} b={12} br={0.5} />
    <Mesa y0={760} tone="#e8e2d2" />
    {L.on && <Prop id="dinner_plate" x={960} y={1010 + L.dy} w={760} sh={1} style={{ transform: "scaleY(.32)", transformOrigin: "50% 100%" }} />}
    {L.on && <Prop id="green_jello" x={960} y={960 + L.dy} w={560} sh={0} style={{ transform: `scale(${1 + wb},${1 - wb})`, transformOrigin: "50% 100%" }} />}
    <Glow x={900} y={700} r={260} o={0.35} col="200,255,200" />
  </Cam>;
}} />;

// «And I sat in the parking lot for 20 minutes»: el estacionamiento de la iglesia va oscureciendo y las ventanas del sótano se encienden una por una
const HParkLot: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0, d);
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1.08 - 0.06 * p})` }}><Fondo id="le_e13" tt={tt} b={1} br={0.62 - 0.3 * p} /></div>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(rgba(10,20,50,${0.5 * p}),rgba(0,0,0,${0.3 * p}))` }} />
    {[0, 1, 2].map((k) => { const at = 0.5 + k * (d - 1) / 3, q = cl((tt - at) / 0.8); return q <= 0 ? null : <div key={k} style={{ position: "absolute", left: 140 + k * 70, top: 120 + k * 60 + 40 * q, width: 90, height: 6, borderRadius: 3, background: "rgba(200,220,255,.5)", opacity: 1 - q, transform: "rotate(70deg)" }} />; })}
    <div style={{ position: "absolute", left: -200, top: -200, width: 2320, height: 1480, borderRadius: "46% 46% 30% 30% / 30% 30% 22% 22%", boxShadow: "0 0 0 400px #0a0a0c, inset 0 0 120px rgba(0,0,0,.8)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d="M560 1080 Q 960 760 1360 1080" stroke="#141416" strokeWidth={70} fill="none" /><rect x={0} y={1000} width={1920} height={80} fill="#121214" /></svg>
  </div>;
}} />;

// «at the long table by the furnace»: la mesa larga del sótano; ocho tazas de café aterrizan en fila a lo largo, de la más lejana a la más cerca
const HFurnaceTable: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = Math.min(0.3, (d - 1.5) / 8), fl = 0.8 + 0.2 * Math.sin(tt * 2 * Math.PI * 0.9);
  return <Cam tt={tt} d={d} z={0.06} fx={1100} fy={820}>
    <Fondo id="le_e14" tt={tt} b={12} br={0.45} />
    <Mesa y0={760} tone="#ece6d6" />
    {Array.from({ length: 8 }, (_, k) => { const at = 0.3 + k * step, L = land(tt, at, 400, 10, 0.4), x = 170 + k * 225, y = 850 + (k % 2) * 70; return L.on ? <Prop key={k} id="coffee_cup" x={x} y={y + L.dy} w={250} sq={L.sq} /> : null; })}
    <Glow x={1800} y={600} r={520} o={0.55 * fl} col="255,150,70" />
  </Cam>;
}} />;

export const HCE: Record<string, C> = {
  engineOff: HEngineOff, ticketStub: HTicketStub, recordSpin: HRecordSpin, streamersHall: HStreamersHall, punchLadle: HPunchLadle, blueShoe: HBlueShoe,
  waltzSleeve: HWaltzSleeve, bigBoots: HBigBoots, hourglassSlow: HHourglassSlow, wallChairs: HWallChairs, apronHook: HApronHook, canStack: HCanStack,
  meatloafPan: HMeatloafPan, lovesList: HLovesList, emptyTheater: HEmptyTheater, chiliSteam: HChiliSteam, shingleRoof: HShingleRoof, gutterHang: HGutterHang,
  lilacDrop: HLilacDrop, laddersUp: HLaddersUp, cookieBulb: HCookieBulb, fiveClock: HFiveClock, fridgeHum: HFridgeHum, tableForOne: HTableForOne,
  feederBird: HFeederBird, jelloWobble: HJelloWobble, parkLot: HParkLot, furnaceTable: HFurnaceTable,
};
