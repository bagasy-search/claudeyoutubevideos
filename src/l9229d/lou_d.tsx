// l9229d «Dreams» · componentes únicos (uno por minuto), parte 1: el cajón de los sueños, la mesa de nogal bajo la sábana, el violín de Olaf.
// Lo aprendido en a-c: objetos grandes y enteros, acción clave a ≈0,6 s y a la mitad, física (rebote, polvo, vapor), casi nada de texto.
import React from "react";
import { HAND, cl, eio, phys } from "./hkit";
import { Odo, Puff } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, Rings, land, swing } from "./pk";
import { BOX, Fondo, Formica, Ink, Nieve } from "./lk";

const WOODF = "repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 2px,transparent 2px 37px),linear-gradient(#a8743e,#7a5028)";

// el cajón: se abre, adentro el folleto y las pilas; a la mitad se cierra «un poco más rápido» con un golpe seco y polvo en la rendija
const HDrawerShut: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), open = eio(tt, 0.3, 1.2) * (1 - eio(tt, d / 2, d / 2 + 0.35)), z = 380 * open, hit = d / 2 + 0.35;
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="ld_e04" tt={tt} b={12} br={0.45} />
    <div style={{ position: "absolute", left: 360, top: 420, width: 1200, height: 660, background: WOODF, boxShadow: "inset 0 0 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 560, top: 560 - z * 0.3, width: 800, height: 260 + z * 0.55, background: "linear-gradient(#3a2614,#5a3c22)", boxShadow: "inset 0 30px 40px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 120, top: 40, width: 300, height: 200, background: "linear-gradient(135deg,#7fb6d8,#e8d8a8)", transform: "rotate(-6deg)", boxShadow: "6px 8px 10px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 20, top: 120, fontFamily: SER, fontWeight: 700, fontSize: 34, color: "#fff", textShadow: "0 2px 4px #0006" }}>Cannon Beach</div></div>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 500 + k * 70, top: 90 + 20 * k, width: 46, height: 120, borderRadius: 8, background: "linear-gradient(90deg,#222,#666 40%,#222)", transform: `rotate(${20 - 18 * k}deg)` }}><div style={{ height: 28, background: "#c8a030", borderRadius: "8px 8px 0 0" }} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 540, top: 820 + z * 0.25, width: 840, height: 200, background: WOODF, boxShadow: `0 ${20 + z * 0.1}px 30px rgba(0,0,0,.5)`, transform: `scale(${1 + z * 0.0004})` }}>
      <div style={{ position: "absolute", left: 360, top: 80, width: 120, height: 34, borderRadius: 17, background: "radial-gradient(circle at 40% 30%,#f2d27a,#8a6420)" }} /></div>
    {tt > hit && <Dust tt={tt} at={hit} x={960} y={830} w={900} />}
  </Cam>;
}} />;

// el bulto bajo la sábana: el polvo flota en el rayo de luz y a la mitad la sábana respira (una corriente la levanta y vuelve a caer)
const HSheetLump: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), br = Math.sin(cl((tt - d / 2) / 1.4) * Math.PI);
  return <Cam tt={tt} d={d} z={0.06} fy={620}>
    <Fondo id="ld_e02" tt={tt} b={10} br={0.4} />
    <div style={{ ...BOX, background: "linear-gradient(115deg,transparent 30%,rgba(255,230,180,.18) 42%,transparent 55%)", mixBlendMode: "screen" }} />
    <Prop id="drape_cloth" x={960} y={1000} w={1300 + 40 * br} sq={-0.06 * br} />
    {Array.from({ length: 40 }, (_, k) => { const q = (tt * 0.05 + rnd(k)) % 1; return <div key={k} style={{ position: "absolute", left: 600 + 600 * rnd(k + 3) + 80 * Math.sin(tt * 0.5 + k), top: 200 + 700 * q, width: 4, height: 4, borderRadius: "50%", background: "#fff3d0", opacity: 0.7 * Math.sin(q * Math.PI) }} />; })}
  </Cam>;
}} />;

// dos engranajes de bronce que engranan; a la mitad entra un tercero (Earl) y el tren entero gira junto
const Gear: React.FC<{ x: number; y: number; r: number; a: number; n: number; o?: number }> = ({ x, y, r, a, n, o = 1 }) => <svg width={r * 2.4} height={r * 2.4} style={{ position: "absolute", left: x - r * 1.2, top: y - r * 1.2, opacity: o, transform: `rotate(${a}deg)`, filter: "drop-shadow(10px 14px 12px rgba(0,0,0,.5))" }} viewBox="-120 -120 240 240">
  <defs><radialGradient id="br" cx=".35" cy=".3"><stop offset="0" stopColor="#f6d48a" /><stop offset=".6" stopColor="#b8862e" /><stop offset="1" stopColor="#6a4410" /></radialGradient></defs>
  {Array.from({ length: n }, (_, k) => <rect key={k} x={-11} y={-112} width={22} height={30} rx={4} fill="url(#br)" transform={`rotate(${(360 / n) * k})`} />)}
  <circle r={88} fill="url(#br)" /><circle r={30} fill="#3a2a10" />{[0, 1, 2, 3, 4].map((k) => <circle key={k} r={12} cx={56 * Math.cos(k * 1.256)} cy={56 * Math.sin(k * 1.256)} fill="#5a3a10" />)}
</svg>;
const HGearsMesh: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = tt * 40, third = eio(tt, d / 2 - 0.4, d / 2 + 0.3);
  return <Cam tt={tt} d={d} z={0.08}>
    <Fondo id="ld_e03" tt={tt} b={10} br={0.4} />
    <Gear x={700} y={560} r={300} a={a} n={16} />
    <Gear x={1250} y={470} r={225} a={-a * 16 / 12 + 15} n={12} />
    <Gear x={1560 + 500 * (1 - third)} y={820} r={180} a={a * 16 / 10} n={10} o={third} />
    <Glow x={960} y={420} r={500} o={0.4} />
  </Cam>;
}} />;

const Eiffel: React.FC<{ x: number; y: number; s: number; sq: number }> = ({ x, y, s, sq }) => <svg width={260 * s} height={420 * s} viewBox="0 0 260 420" style={{ position: "absolute", left: x - 130 * s, top: y - 420 * s, transform: `scaleY(${1 - sq})`, transformOrigin: "50% 100%", filter: "drop-shadow(8px 12px 10px rgba(0,0,0,.5))" }}>
  <defs><linearGradient id="ef" x1="0" x2="1"><stop offset="0" stopColor="#6a5a40" /><stop offset=".5" stopColor="#c8a868" /><stop offset="1" stopColor="#5a4a30" /></linearGradient></defs>
  <path d="M130,0 L138,60 L150,160 L175,260 L250,420 L190,420 Q130,330 70,420 L10,420 L85,260 L110,160 L122,60 Z" fill="url(#ef)" />
  <rect x={92} y={250} width={76} height={14} fill="#4a3a20" /><rect x={112} y={150} width={36} height={10} fill="#4a3a20" />
  {[300, 340, 380].map((yy, k) => <path key={k} d={`M${70 - k * 18},${yy} L${190 + k * 18},${yy}`} stroke="#3a2a10" strokeWidth={3} />)}
</svg>;
// una palabra cada uno: boat, Paris, piano caen al cajón como objetos (barquito, Torre Eiffel, piano de juguete) con rebote
const HWordsDrawer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), it = [["toy_sailboat", 0.5, 620], ["paris_tower", d * 0.38, 960], ["toy_piano", d * 0.62, 1300]] as const;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="ld_e04" tt={tt} b={12} br={0.45} />
    <div style={{ position: "absolute", left: 300, top: 640, width: 1320, height: 440, background: "linear-gradient(#3a2614,#5a3c22)", boxShadow: "inset 0 40px 50px rgba(0,0,0,.6)" }} />
    {it.map(([id, at, x], k) => { const L = land(tt, at, 700, 9, 0.35); return L.on ? <React.Fragment key={k}>{k === 1 ? <Eiffel x={x} y={900 + L.dy} s={1} sq={L.sq} /> : <Prop id={id} x={x} y={900 + L.dy} w={380} sq={L.sq} r={(k - 1) * 6} />}<Dust tt={tt} at={at + 0.45} x={x} y={900} w={300} /></React.Fragment> : null; })}
    <div style={{ position: "absolute", left: 280, top: 940, width: 1360, height: 140, background: WOODF, boxShadow: "0 -10px 20px rgba(0,0,0,.4)" }} />
  </Cam>;
}} />;

// la lata de galletas azul: la tapa salta (resorte) y sale el abanico de folletos amarillentos, uno detrás de otro
const HCookieTin: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lid = phys(tt, 0.7, 6, 0.35), fan = eio(tt, d / 2 - 0.5, d / 2 + 1.2);
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="ld_e01" tt={tt} b={12} br={0.42} />
    <Mesa y0={820} tone="#6a4a2e" />
    {[0, 1, 2, 3, 4].map((k) => { const a = (-40 + 20 * k) * fan; return <div key={k} style={{ position: "absolute", left: 860, top: 300 - 160 * fan, width: 260, height: 360, transformOrigin: "50% 100%", transform: `rotate(${a}deg)`, background: ["#7fb6d8", "#d8b878", "#a8c8a0", "#e8c8a8", "#c8d8e8"][k], boxShadow: "6px 8px 14px rgba(0,0,0,.35)", opacity: cl(fan * 3) }}>
      <div style={{ margin: 16, height: 150, background: "linear-gradient(#4a7ab0,#d8c088)", opacity: 0.7 }} /></div>; })}
    <Prop id="cookie_tin" x={960} y={900 - 30 * Math.sin(cl((tt - 0.7) / 0.4) * Math.PI)} w={720} />
    {tt > 1.0 && <Dust tt={tt} at={1.0} x={960} y={900} w={600} />}
  </Cam>;
}} />;

// Haystack Rock: las olas de espuma rompen contra la roca en capas; a la mitad una ola grande sube y la espuma se abre
const HHaystackWaves: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), big = Math.sin(cl((tt - d / 2) / 1.6) * Math.PI);
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="ld_e05" tt={tt} b={2} br={0.8} />
    {[0, 1, 2].map((k) => { const ph = (tt * 0.35 + k / 3) % 1, y = 1000 - 260 * ph - (k === 0 ? 120 * big : 0); return <svg key={k} width={2200} height={300} style={{ position: "absolute", left: -140 + 60 * Math.sin(tt + k), top: y, opacity: 0.85 * Math.sin(ph * Math.PI) }}>
      <path d={`M0,60 ${Array.from({ length: 23 }, (_, i) => `Q${i * 100 + 50},${20 + 30 * Math.sin(i * 1.7 + tt * 2 + k)} ${i * 100 + 100},60`).join(" ")} L2200,300 L0,300 Z`} fill="rgba(240,248,250,.85)" />
      <path d={`M0,90 ${Array.from({ length: 23 }, (_, i) => `Q${i * 100 + 50},${60 + 20 * Math.sin(i * 2.3 + tt * 2)} ${i * 100 + 100},90`).join(" ")} L2200,300 L0,300 Z`} fill="rgba(180,210,215,.5)" /></svg>; })}
    {big > 0.3 && Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: 700 + 500 * rnd(k), top: 640 - 260 * big * rnd(k + 5), width: 14, height: 14, borderRadius: "50%", background: "#fff", opacity: big * 0.9 }} />)}
  </Cam>;
}} />;

// la carta al hotel: el sobre se cierra, la estampilla cae con golpe y el matasellos «1961» la marca con tinta corrida
const HStampPost: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), flap = eio(tt, 0.4, 1.2), st = land(tt, 1.6, 500, 9, 0.3), pm = cl((tt - d / 2) / 0.25), pr = tt > d / 2 && tt < d / 2 + 0.5 ? Math.sin((tt - d / 2) / 0.5 * Math.PI) : 0;
  return <Cam tt={tt} d={d} z={0.07} fy={600}>
    <Fondo id="ld_e06" tt={tt} b={12} br={0.42} />
    <Mesa y0={760} tone="#7a5a3a" />
    <div style={{ position: "absolute", left: 460, top: 380, width: 1000, height: 560, background: "linear-gradient(#f4ecd8,#e4d8bc)", boxShadow: "16px 24px 30px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 80, top: 260, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#22314f", lineHeight: 1.3 }}>The Hotel with Blue Shutters<br />Cannon Beach, Oregon</div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 280, background: "linear-gradient(#e8dcc0,#d8cbab)", clipPath: "polygon(0 0,100% 0,50% 100%)", transform: `perspective(1200px) rotateX(${180 - 180 * flap}deg)`, transformOrigin: "50% 0", boxShadow: "0 6px 10px rgba(0,0,0,.2)" }} />
      {st.on && <div style={{ position: "absolute", left: 800, top: 40 + st.dy * 0.3, width: 140, height: 170, background: "#c84a3a", border: "8px dotted #f4ecd8", transform: `rotate(4deg) scale(${1 + st.sq})` }}><div style={{ margin: 18, height: 100, background: "linear-gradient(#e8a888,#8a2a1a)" }} /></div>}
      {pm > 0 && <div style={{ position: "absolute", left: 680, top: 50, width: 240, height: 240, borderRadius: "50%", border: "8px solid rgba(30,40,70,.75)", opacity: pm, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SER, fontWeight: 900, fontSize: 60, color: "rgba(30,40,70,.75)", filter: "blur(.6px)" }}>1961</div>}
    </div>
    {pr > 0 && <div style={{ position: "absolute", left: 1140, top: 360 - 200 * (1 - pr), width: 200, height: 300, background: "linear-gradient(90deg,#3a2a1a,#6a4a2a,#3a2a1a)", borderRadius: "20px 20px 6px 6px", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />}
  </Cam>;
}} />;

// el almanaque de la heladera: la lupa recorre los días buscando «someday» y no aparece; a la mitad se detiene sobre un casillero vacío
const HCalendarSearch: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d / 2), mx = 560 + 820 * Math.sin(p * Math.PI * 1.5) * 0.5 + 400 * p, my = 380 + 360 * p, stop = eio(tt, d / 2, d / 2 + 0.6);
  const x = mx * (1 - stop) + 1130 * stop, y = my * (1 - stop) + 700 * stop;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e07" tt={tt} b={12} br={0.45} />
    <div style={{ position: "absolute", left: 420, top: 200, width: 1080, height: 800, background: "#fbf8ee", boxShadow: "14px 20px 30px rgba(0,0,0,.45)" }}>
      <div style={{ height: 120, background: "#b3322a", color: "#fff", fontFamily: SER, fontWeight: 900, fontSize: 80, textAlign: "center", lineHeight: "120px" }}>JUNE</div>
      {Array.from({ length: 35 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k % 7) * 154, top: 120 + Math.floor(k / 7) * 136, width: 154, height: 136, border: "1px solid #c8c0b0", fontFamily: SER, fontSize: 34, color: "#5a5048", padding: 8, boxSizing: "border-box", background: k === 30 && stop > 0.5 ? `rgba(255,230,150,${stop * 0.6})` : "transparent" }}>{k < 30 ? k + 1 : ""}</div>)}
    </div>
    <Prop id="magnifying_glass" x={x + 120} y={y + 260} w={460} r={-30} />
  </Cam>;
}} />;

// el horizonte de una ruta plana: el Buick avanza y la línea del horizonte se aleja igual de rápido; a la mitad el auto frena y el polvo lo pasa
const HHorizonRoad: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), brake = eio(tt, d / 2, d / 2 + 0.8), sp = 1 - brake;
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Fondo id="ld_e08" tt={tt} b={1} br={0.75} s={1.08 + 0.05 * tt * sp} />
    {Array.from({ length: 8 }, (_, k) => { const q = ((tt * 0.8 * sp + k / 8) % 1); return <div key={k} style={{ position: "absolute", left: 950 - 4 - 60 * q * q, top: 620 + 460 * q * q, width: 8 + 120 * q * q, height: 6 + 80 * q * q, background: "#f2e8c0", opacity: 0.9 }} />; })}
    <Prop id="buick_rear" x={960 + 6 * Math.sin(tt * 9) * sp} y={1040} w={760 - 120 * brake} />
    {brake > 0 && <Dust tt={tt} at={d / 2 + 0.2} x={960} y={1000} w={900} col="rgba(220,200,160,.8)" />}
  </Cam>;
}} />;

// en tinta: la pluma escribe «June 12» en el almanaque y la tinta se corre por las fibras; a la mitad un círculo firme la encierra
const HInkDate: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), w = eio(tt, 0.4, 1.8), c = eio(tt, d / 2, d / 2 + 0.9);
  return <Cam tt={tt} d={d} z={0.08} fx={900} fy={560}>
    <Fondo id="ld_e07" tt={tt} b={14} br={0.4} />
    <div style={{ position: "absolute", left: 360, top: 240, width: 1200, height: 700, background: "radial-gradient(ellipse at 50% 40%,#fdfaf0,#ece4cc)", boxShadow: "14px 20px 30px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 520, top: 460, fontFamily: HAND, fontWeight: 700, fontSize: 200, color: "#1a2a5a", clipPath: `inset(0 ${100 - 100 * w}% 0 0)`, textShadow: "0 0 6px rgba(26,42,90,.45)" }}>June 12</div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><ellipse cx={900} cy={570} rx={470} ry={170} fill="none" stroke="#b3322a" strokeWidth={14} strokeLinecap="round" strokeDasharray={`${2000 * c} 4000`} transform="rotate(-4 900 570)" /></svg>
    <Prop id="hand_pen" x={c > 0 ? 900 + 470 * Math.cos(c * 6.28 - 1.57) + 170 : 540 + 760 * w + 170} y={c > 0 ? 570 + 170 * Math.sin(c * 6.28 - 1.57) + 330 : 640 + 330 + 20 * Math.sin(tt * 14)} w={460} r={-10} sh={0.3} />
  </Cam>;
}} />;

// el violín sale del estuche: la tapa se abre con luz cálida y el violín se eleva girando apenas, el arco detrás
const HFiddleRise: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lid = eio(tt, 0.3, 1.1), up = eio(tt, d / 2 - 0.6, d / 2 + 0.8);
  return <Cam tt={tt} d={d} z={0.07} fy={620}>
    <Fondo id="ld_e09" tt={tt} b={12} br={0.38} />
    <Glow x={960} y={700} r={500} o={lid} />
    <Prop id="violin_case" x={960} y={1080} w={1100} />
    <Prop id="violin_bow" x={1120} y={900 - 140 * up} w={820} r={-30 + 10 * up} o={up} />
    <Prop id="violin" x={900} y={960 - 180 * up} w={520 + 80 * up} r={-62 + 40 * up + swing(tt, d / 2 + 0.8, 4, 4, 1)} o={lid} />
  </Cam>;
}} />;

// 70 años en el estuche: telarañas se tejen de esquina a esquina y el polvo se asienta; a la mitad una mano sopla y todo vuela
const HCobwebCase: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), web = eio(tt, 0.3, d / 2), blow = eio(tt, d / 2 + 0.2, d / 2 + 1.0);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e09" tt={tt} b={8} br={0.4} />
    <Prop id="violin_case" x={960} y={980} w={1300} style={{ filter: `sepia(${0.6 * (1 - blow)}) brightness(${0.8 + 0.2 * blow})` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - blow, transform: `translate(${300 * blow}px,${-80 * blow}px)` }}>
      {[[260, 240], [1660, 260]].map(([cx, cy], q) => <g key={q} stroke="rgba(240,240,240,.7)" strokeWidth={2} fill="none">
        {Array.from({ length: 8 }, (_, k) => { const a = (q ? Math.PI / 2 : 0) + k * 0.22; return <line key={k} x1={cx} y1={cy} x2={cx + Math.cos(a) * 420 * web * (q ? -1 : 1)} y2={cy + Math.sin(a) * 420 * web} />; })}
        {[80, 160, 240, 320].map((r, k) => web * 420 > r && <path key={"r" + k} d={`M${cx + (q ? -r : r)},${cy} Q${cx + (q ? -r : r) * 0.8},${cy + r * 0.8} ${cx},${cy + r}`} />)}
      </g>)}
    </svg>
    {Array.from({ length: 50 }, (_, k) => <div key={k} style={{ position: "absolute", left: 500 + 900 * rnd(k) + 900 * blow * rnd(k + 9), top: 640 + 200 * rnd(k + 3) - 300 * blow * rnd(k + 2), width: 5, height: 5, borderRadius: "50%", background: "#e8e0d0", opacity: (0.4 + 0.5 * web) * (1 - blow * 0.8) }} />)}
  </Cam>;
}} />;

// diez minutos: el reloj de cocina se da cuerda (gira hasta 10) y descuenta; a la mitad suena y salta sobre la mesa
const HEggTimer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), wind = eio(tt, 0.4, 1.4), run = cl((tt - 1.4) / (d / 2 - 1.4)), ring = tt > d / 2 ? Math.sin(tt * 60) * 8 * Math.exp(-(tt - d / 2) * 0.8) : 0, ang = 300 * wind * (1 - run);
  return <Cam tt={tt} d={d} z={0.08} fy={640}>
    <Fondo id="ld_e10" tt={tt} b={12} br={0.45} />
    <Formica y0={800} />
    <div style={{ position: "absolute", left: 960 - 220 + ring, top: 380, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff6e0,#e8c070 60%,#a8782a)", boxShadow: "14px 24px 30px rgba(0,0,0,.45)", transform: `rotate(${ring}deg)` }}>
      <div style={{ position: "absolute", inset: 50, borderRadius: "50%", background: "#fbf6ea", transform: `rotate(${-ang}deg)` }}>
        {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 167, top: 0, width: 6, height: 170, transformOrigin: "3px 170px", transform: `rotate(${k * 30}deg)` }}><div style={{ width: 6, height: k % 2 ? 18 : 34, background: "#3a3020" }} /><div style={{ position: "absolute", top: 36, left: -20, width: 46, textAlign: "center", fontFamily: SER, fontWeight: 700, fontSize: 30, color: "#3a3020", transform: `rotate(${-k * 30}deg)` }}>{k * 5}</div></div>)}
      </div>
      <div style={{ position: "absolute", left: 210, top: 10, width: 20, height: 70, background: "#b3322a", borderRadius: 6 }} />
    </div>
    {tt > d / 2 && <Rings tt={tt} at={d / 2} x={960} y={600} s={1.3} />}
    {tt > d / 2 && <Rings tt={tt} at={d / 2 + 0.6} x={960} y={600} s={1.3} />}
  </Cam>;
}} />;

// la parte más chica: un sobre de semillas se inclina y deja caer semillas en el surco, de a una, en fila; a la mitad brota la primera
const HSeedRow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d / 2), px = 400 + 1100 * p, sp = eio(tt, d / 2, d / 2 + 1.4);
  return <Cam tt={tt} d={d} z={0.06} fx={px} fy={700}>
    <Fondo id="ld_e11" tt={tt} b={6} br={0.55} />
    <div style={{ position: "absolute", left: 0, top: 780, width: 1920, height: 300, background: "linear-gradient(#5a3e26,#3a2814)" }} />
    <div style={{ position: "absolute", left: 300, top: 800, width: 1400, height: 30, borderRadius: 15, background: "#2a1a0c", boxShadow: "inset 0 6px 10px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 10 }, (_, k) => { const sx = 420 + k * 120, at = 0.4 + (sx - 400) / 1100 * (d / 2 - 0.4); const f = cl((tt - at) / 0.35); return f > 0 ? <div key={k} style={{ position: "absolute", left: sx, top: 520 + 290 * f * f, width: 14, height: 20, borderRadius: "50%", background: "#d8c088" }} /> : null; })}
    {sp > 0 && <svg width={200} height={300} style={{ position: "absolute", left: 320, top: 520 }}><path d={`M100,290 Q${100 + 10 * Math.sin(tt * 2)},${290 - 140 * sp} 100,${290 - 200 * sp}`} stroke="#5aa040" strokeWidth={10} fill="none" />
      <ellipse cx={100 - 40 * sp} cy={290 - 200 * sp} rx={46 * sp} ry={20 * sp} fill="#6ab84a" transform={`rotate(-30 ${100 - 40 * sp} ${290 - 200 * sp})`} /><ellipse cx={100 + 40 * sp} cy={290 - 200 * sp} rx={46 * sp} ry={20 * sp} fill="#6ab84a" transform={`rotate(30 ${100 + 40 * sp} ${290 - 200 * sp})`} /></svg>}
    <Prop id="seed_packet" x={px} y={600} w={300} r={-50} />
  </Cam>;
}} />;

// el arco sobre las cuerdas: primer plano del violín, las cuatro cuerdas vibran (se desdibujan) cuando el arco pasa; a la mitad cambia de cuerda
const HBowStrings: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), bx = 960 + 300 * Math.sin(tt * 1.6), on = cl((tt - 0.6) / 0.3);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e09" tt={tt} b={14} br={0.35} />
    <Glow x={900} y={560} r={520} o={0.6} />
    <Prop id="violin" x={880} y={1000} w={760} r={-78} />
    <Prop id="violin_bow" x={bx} y={760} w={1100} r={-8} />
    {on > 0 && [0, 1, 2, 3].map((k) => <Rings key={k} tt={tt} at={0.6 + k * (d / 4)} x={880} y={520} s={1.2} />)}
    {Array.from({ length: 14 }, (_, k) => { const q = (tt * 0.7 + k / 14) % 1; return <div key={k} style={{ position: "absolute", left: bx - 100 + 60 * Math.sin(k + q * 4), top: 560 - 420 * q, width: 5, height: 5, borderRadius: "50%", background: "#fff1c8", opacity: (1 - q) * on }} />; })}
  </Cam>;
}} />;

// la cuenta en la servilleta: la pluma escribe 6 × 52 y el resultado aparece subrayado dos veces; la servilleta se arruga al final
const HNapkinMath: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="ld_e12" tt={tt} b={10} br={0.45} />
    <Formica y0={700} />
    <Prop id="paper_napkin" x={960} y={1000} w={1000} r={-3} />
    <Ink tt={tt} at={0.4} dur={0.9} x={620} y={480} txt="$11 a week" size={110} w={800} />
    <Ink tt={tt} at={d / 2 - 0.4} dur={0.9} x={620} y={640} txt="= $572 a year" size={110} w={900} col="#b3322a" />
    <Prop id="hand_pen" x={tt > d / 2 - 0.4 ? 790 + 700 * cl((tt - d / 2 + 0.4) / 0.9) : 790 + 600 * cl((tt - 0.4) / 0.9)} y={tt < d / 2 - 0.4 ? 920 : 1080} w={420} r={-10} sh={0.3} />
  </Cam>;
}} />;

// lo que gasté en café: monedas de plata caen y se apilan en torres; a la mitad la torre más alta pasa a la taza de café que se vacía
const HCoinStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="ld_e12" tt={tt} b={12} br={0.45} />
    <Mesa y0={820} tone="#6a4a2e" />
    {Array.from({ length: 22 }, (_, k) => { const col = k % 3, row = Math.floor(k / 3), at = 0.4 + k * (d * 0.75 / 22), L = land(tt, at, 500, 10, 0.3); return L.on ? <div key={k} style={{ position: "absolute", left: 560 + col * 400 - 160, top: 880 - row * 50 + L.dy * 0.5, width: 320, height: 74, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#ffffff,#c8c8d0 50%,#7a7a88)", boxShadow: "0 6px 8px rgba(0,0,0,.4), inset 0 -8px 0 #9a9aa8" }} /> : null; })}
    {tt > 0.4 && <Rings tt={tt} at={d * 0.4} x={960} y={600} />}
  </Cam>;
}} />;

// el frasco de la heladera: billetes doblados entran por la ranura de la tapa y el nivel sube; a la mitad, la etiqueta «JUNE · OREGON» se pega
const HJarFill: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lvl = eio(tt, 0.4, d - 1), lab = phys(tt, d / 2, 7, 0.35);
  return <Cam tt={tt} d={d} z={0.08} fy={600}>
    <Fondo id="ld_e13" tt={tt} b={12} br={0.45} />
    <Prop id="mason_jar" x={960} y={960} w={560} />
    <div style={{ position: "absolute", left: 780, top: 920 - 440 * lvl, width: 360, height: 440 * lvl, overflow: "hidden", opacity: 0.9 }}>
      {Array.from({ length: 16 }, (_, k) => <div key={k} style={{ position: "absolute", left: 20 + 220 * rnd(k), bottom: 8 + 26 * k, width: 150, height: 60, background: "linear-gradient(#cfdcb8,#a8bc8a)", borderRadius: 6, transform: `rotate(${(rnd(k + 3) - 0.5) * 60}deg)`, boxShadow: "0 3px 5px rgba(0,0,0,.3)" }} />)}
    </div>

    {Array.from({ length: 4 }, (_, k) => { const at = 0.8 + k * (d - 2) / 4, f = cl((tt - at) / 0.6); return f > 0 && f < 1 ? <div key={"b" + k} style={{ position: "absolute", left: 900, top: 200 + 300 * f, width: 130, height: 50, background: "linear-gradient(#cfdcb8,#a8bc8a)", borderRadius: 6, transform: `rotate(${80 - 70 * f}deg)` }} /> : null; })}
    <div style={{ position: "absolute", left: 790, top: 620, width: 340, height: 140, background: "#f4ecd8", border: "4px solid #8a6a3a", transform: `scale(${lab}) rotate(-3deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#22314f", boxShadow: "0 4px 6px rgba(0,0,0,.3)" }}>OREGON</div>
  </Cam>;
}} />;

// la cinta en la heladera: un trozo de cinta de papel se despega del rollo, se estira y se pega; a la mitad la mano escribe «ROUTE 66»
const HTapeRoute: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = eio(tt, 0.4, 1.6), stick = phys(tt, 1.8, 8, 0.4);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="ld_e13" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 260, top: 200, width: 1400, height: 700, background: "linear-gradient(90deg,#e8ecea,#fbfdfc 50%,#e2e6e4)", boxShadow: "inset 0 0 40px rgba(0,0,0,.15)" }} />
    <div style={{ position: "absolute", left: 420, top: 440, width: 1080 * st, height: 160, background: "linear-gradient(#efe2b8,#e2d2a0)", boxShadow: `0 ${10 * (1 - stick)}px ${16 * (1 - stick)}px rgba(0,0,0,.3)`, transform: `rotate(-2deg) translateY(${-20 * (1 - stick)}px)`, clipPath: "polygon(0 4%,3% 0,6% 6%,9% 0,100% 0,97% 50%,100% 100%,0 100%,2% 50%)" }}>
      <Ink tt={tt} at={d / 2} dur={1.0} x={90} y={18} txt="ROUTE 66" size={130} w={900} />
    </div>
    <div style={{ position: "absolute", left: 300 + 1080 * st, top: 400, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,#8a7a5a 0 30%,#efe2b8 31%,#d8c898 80%)", boxShadow: "10px 16px 20px rgba(0,0,0,.4)", opacity: 1 - cl((tt - 1.6) / 0.4) }} />
    {tt > d / 2 && <Prop id="hand_pen" x={500 + 900 * cl((tt - d / 2) / 1.0)} y={900} w={460} r={-10} sh={0.3} />}
  </Cam>;
}} />;

// «guardá eso»: la punta de la sábana se levanta sola y deja ver un borde de madera oscura con veta; a la mitad vuelve a caer
const HSheetPeek: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.6, 1.8) * (1 - eio(tt, d / 2 + 0.6, d / 2 + 1.3));
  return <Cam tt={tt} d={d} z={0.08} fx={1200} fy={700}>
    <Fondo id="ld_e02" tt={tt} b={12} br={0.38} />
    <Prop id="walnut_table" x={960} y={1020} w={1200} style={{ filter: `brightness(${0.5 + 0.5 * up})` }} />
    <Glow x={1300} y={820} r={300} o={up} />
    <Prop id="drape_cloth" x={960 - 120 * up} y={1020 - 260 * up} w={1350} r={-8 * up} />
  </Cam>;
}} />;

// las mecedoras del museo de Amana: un marco dorado se arma alrededor de una mecedora que se mece sola, con la luz del museo
const HFrameChair: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fr = eio(tt, 0.3, 1.2), rock = 8 * Math.sin(tt * 1.8) * cl((tt - d / 2 + 1) / 1);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e18" tt={tt} b={14} br={0.35} />
    <div style={{ position: "absolute", left: 960 - 460 * fr, top: 540 - 420 * fr, width: 920 * fr, height: 840 * fr, border: `${40 * fr}px solid transparent`, borderImage: "linear-gradient(135deg,#f8e08a,#a8781e,#f2d070,#7a5410) 1", boxShadow: "inset 0 0 60px rgba(0,0,0,.6), 0 20px 40px rgba(0,0,0,.5)", background: "radial-gradient(ellipse at 50% 30%,#5a4630,#2a1e12)" }} />
    <Glow x={960} y={300} r={360} o={fr * 0.8} />
    <Prop id="rocking_chair" x={960} y={900} w={560} r={rock} o={fr} />
  </Cam>;
}} />;

// afilar formones que no usé: el formón va y viene sobre la piedra, la pasta gris crece; a la mitad el filo brilla y se queda en el estante
const HChiselStone: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), go = tt < d / 2, x = go ? 960 + 220 * Math.sin(tt * 4) : 960, put = eio(tt, d / 2, d / 2 + 0.8), sl = cl(tt / (d / 2));
  return <Cam tt={tt} d={d} z={0.08} fy={720}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.4} />
    <Mesa y0={820} tone="#6a4a2e" />
    <Prop id="whetstone" x={960} y={940} w={900} />
    <div style={{ position: "absolute", left: 600, top: 790, width: 720, height: 40, borderRadius: 20, background: `rgba(90,90,96,${0.6 * sl})`, filter: "blur(4px)" }} />
    <Prop id="chisel" x={x + 300 * put} y={820 - 300 * put} w={700} r={-12 + 12 * put} />
    {put > 0.6 && <Glow x={x + 300 * put - 300} y={820 - 300 * put - 40} r={80} o={Math.sin(cl((tt - d / 2 - 0.5) / 0.6) * Math.PI)} col="255,255,255" />}
  </Cam>;
}} />;

// el cheque en el cartón de huevos: se abre la tapa, los huevos quedan y bajo ellos asoma un cheque doblado que se despliega: $2,200
const HEggCheck: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lid = eio(tt, 0.3, 1.0), ch = eio(tt, d / 2 - 0.3, d / 2 + 0.8);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="ld_e04" tt={tt} b={12} br={0.45} />
    <Formica y0={760} />
    <Prop id="egg_carton" x={960} y={980} w={1000} style={{ filter: `brightness(${1 - 0.3 * ch})` }} />
    <div style={{ position: "absolute", left: 960 - 480 * ch, top: 560 - 260 * ch, width: 960 * ch + 40, height: 420 * ch + 20, background: "linear-gradient(#e8f0e0,#cfe0c8)", border: "3px solid #8aa880", boxShadow: "14px 20px 26px rgba(0,0,0,.4)", transform: `perspective(1200px) rotateX(${60 * (1 - ch)}deg)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 50, top: 50, fontFamily: SER, fontSize: 40, color: "#3a5a3a", opacity: ch }}>PAY TO THE ORDER OF</div>
      <div style={{ position: "absolute", right: 60, top: 150, fontFamily: HAND, fontWeight: 700, fontSize: 140, color: "#1a2a5a", opacity: ch }}>$2,200</div>
      <div style={{ position: "absolute", right: 60, bottom: 40, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#1a2a5a", opacity: ch }}>June</div>
    </div>
    <div style={{ position: "absolute", left: 460, top: 560 - 420 * lid, width: 1000, height: 160, background: "linear-gradient(#c8b898,#a89878)", transform: `perspective(1000px) rotateX(${-100 * lid}deg)`, transformOrigin: "50% 100%", opacity: 1 - lid }} />
  </Cam>;
}} />;

// «empezá en marzo»: las hojas del almanaque se arrancan y vuelan una tras otra hasta MARCH, que queda clavada
const HMarchPages: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), M = ["OCTOBER", "NOVEMBER", "DECEMBER", "JANUARY", "FEBRUARY", "MARCH"], seg = (d / 2) / 5;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e07" tt={tt} b={12} br={0.42} />
    {M.map((m, k) => { const at = 0.4 + (4 - k) * 0 + (k) * seg, gone = k < 5 ? cl((tt - (0.4 + k * seg)) / 0.6) : 0; return gone >= 1 ? null : <div key={k} style={{ position: "absolute", left: 560, top: 220, width: 800, height: 700, background: "#fbf8ee", boxShadow: "10px 16px 24px rgba(0,0,0,.4)", zIndex: 10 - k, transform: `translate(${600 * gone}px,${-500 * gone + 400 * gone * gone}px) rotate(${50 * gone}deg)`, opacity: 1 - gone * 0.6 }}>
      <div style={{ height: 140, background: k === 5 ? "#3a8a3a" : "#b3322a", color: "#fff", fontFamily: SER, fontWeight: 900, fontSize: 84, textAlign: "center", lineHeight: "140px" }}>{m}</div>
      {Array.from({ length: 28 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i % 7) * 114, top: 140 + Math.floor(i / 7) * 140, width: 114, height: 140, border: "1px solid #d8d0c0", fontFamily: SER, fontSize: 30, color: "#6a6058", padding: 6, boxSizing: "border-box" }}>{i + 1}</div>)}
    </div>; })}
    {tt > 0.4 + 5 * seg && <Prop id="push_pin" x={960} y={330} w={120} />}
  </Cam>;
}} />;

// el remate: el martillo de subasta baja con golpe (polvo y ondas) y la sierra de cinta queda iluminada como vendida
const HGavelSold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hit = d / 2 - 0.5, raise = eio(tt, 0.4, hit - 0.25), down = eio(tt, hit - 0.25, hit), a = -40 * raise + 40 * down;
  return <Cam tt={tt} d={d} z={0.07} fy={620}>
    <Fondo id="ld_e16" tt={tt} b={10} br={0.42} />
    <Prop id="band_saw" x={1320} y={1000} w={620} style={{ filter: `brightness(${tt > hit ? 1.1 : 0.7})` }} />
    {tt > hit && <Glow x={1320} y={560} r={400} o={0.8} />}
    <Mesa y0={860} tone="#5a3a22" />
    <div style={{ position: "absolute", left: 520, top: 760, width: 260, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#8a5a2a,#4a2a10)" }} />
    <Prop id="auction_gavel" x={700} y={900} w={760} r={a} />
    {tt > hit && <Dust tt={tt} at={hit} x={650} y={820} w={500} />}
    {tt > hit && <Rings tt={tt} at={hit} x={650} y={800} s={1.2} />}
  </Cam>;
}} />;

// cablear el galpón: la lamparita parpadea, prende, y el aserrín del aire queda iluminado en un cono; a la mitad se balancea
const HBulbSawdust: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), on = eio(tt, 0.8, 1.3), sw = swing(tt, d / 2, 10, 2.6, 0.5);
  return <Cam tt={tt} d={d} z={0.06} fy={400}>
    <Fondo id="ld_e17" tt={tt} b={10} br={0.2 + 0.3 * on} />
    <div style={{ position: "absolute", left: 958, top: 0, width: 4, height: 330, background: "#222", transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 960 - 900, top: 360, width: 1800, height: 720, background: `radial-gradient(ellipse 40% 100% at 50% 0,rgba(255,220,150,${0.35 * on}),transparent 70%)`, transform: `rotate(${sw * 0.8}deg)`, transformOrigin: "50% 0", mixBlendMode: "screen" }} />
    <div style={{ transform: `rotate(${sw}deg)`, transformOrigin: "960px 0", position: "absolute", inset: 0 }}><Prop id="light_bulb" x={960} y={560} w={240} style={{ filter: `brightness(${0.6 + 0.8 * on}) drop-shadow(0 0 ${40 * on}px rgba(255,220,140,.9))` }} /></div>
    {Array.from({ length: 50 }, (_, k) => { const q = (tt * 0.06 + rnd(k)) % 1, x = 960 + (rnd(k + 4) - 0.5) * 900 * q; return <div key={k} style={{ position: "absolute", left: x + 30 * Math.sin(tt + k), top: 400 + 640 * q, width: 5, height: 5, borderRadius: "50%", background: "#ffe8b8", opacity: on * 0.8 * (1 - Math.abs(x - 960) / 700) }} />; })}
  </Cam>;
}} />;

export const HCD: Record<string, C> = {
  drawerShut: HDrawerShut, sheetLump: HSheetLump, gearsMesh: HGearsMesh, wordsDrawer: HWordsDrawer, cookieTin: HCookieTin, haystackWaves: HHaystackWaves,
  stampPost: HStampPost, calendarSearch: HCalendarSearch, horizonRoad: HHorizonRoad, inkDate: HInkDate, fiddleRise: HFiddleRise, cobwebCase: HCobwebCase,
  eggTimer: HEggTimer, seedRow: HSeedRow, bowStrings: HBowStrings, napkinMath: HNapkinMath, coinStack: HCoinStack, jarFill: HJarFill, tapeRoute: HTapeRoute,
  sheetPeek: HSheetPeek, frameChair: HFrameChair, chiselStone: HChiselStone, eggCheck: HEggCheck, marchPages: HMarchPages, gavelSold: HGavelSold, bulbSawdust: HBulbSawdust,
};
