// te29d · PERÚ · componentes únicos, parte 2 de 2 (misma vara que ta.tsx: un objeto grande con volumen, de a uno con rebote, acción hasta la salida, un renglón)
import React from "react";
import { AMB, GRN, H, RED, Stage, TX, cl, eio, phys } from "./hkit";
import { Coin, Floor, GOLD, INK, K, LIN, Num, PAPER, PAPERD, Person, Sash, Slab, W, at, lerp } from "./tkit";

const stepsOf = (h: H, t: number, fb: [number, string][]) => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st = said.length >= fb.length ? said : fb;
  return { st, cur: st.reduce((a, s, i) => (t >= s[0] ? i : a), -1) };
};

// 14:10 · EL GLOBO: un globo aerostático rojo y blanco sube desde el piso sobre un cielo claro; a su lado una regla de altura marca el crecimiento año por año hasta 6 %
const XBalloon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#7fb6e0,#cfe6f4)">{(tt) => {
  const k = K(tt, h, 0.3), y = lerp(560, 150, k), sw = 3 * Math.sin(tt * 1.3);
  return <>
    {[0, 1, 2].map((i) => <div key={i} style={{ ...at(((i * 640 + tt * 30) % 2200) - 200, 160 + i * 220), width: 340, height: 90, borderRadius: 60, background: "rgba(255,255,255,.85)", filter: "blur(2px)" }} />)}
    <div style={{ ...at(0, 940), width: 1920, height: 140, background: "linear-gradient(180deg,#6a8a3a,#3a5a20)" }} />
    <div style={{ ...at(1480, 160), width: 70, height: 760, borderRadius: 10, background: "linear-gradient(90deg,#d8d2c4,#fff,#c9c2b0)", boxShadow: "0 10px 20px rgba(0,0,0,.3)" }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ ...at(0, 740 - i * 120), width: 70, height: 6, background: INK }} />)}
      {Array.from({ length: 7 }, (_, i) => <div key={"n" + i} style={{ ...at(84, 718 - i * 120), fontWeight: 900, fontSize: 40, color: INK }}>{i} %</div>)}
      <div style={{ ...at(-30, 740 - 720 * k - 14), width: 130, height: 28, background: RED, borderRadius: 6 }} /></div>
    <div style={{ ...at(700, y), transformOrigin: "50% 100%", transform: `rotate(${sw}deg)` }}>
      <svg width={460} height={640}><defs><radialGradient id="bal" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#ff8a7a" /><stop offset=".6" stopColor="#d91023" /><stop offset="1" stopColor="#6a0810" /></radialGradient></defs>
        <path d="M230 10 C30 10 0 200 60 320 Q120 420 170 470 L290 470 Q340 420 400 320 C460 200 430 10 230 10 Z" fill="url(#bal)" />
        <path d="M230 10 C170 60 160 300 190 470 L270 470 C300 300 290 60 230 10 Z" fill="rgba(255,255,255,.9)" />
        <line x1={175} y1={470} x2={185} y2={560} stroke="#5a3a20" strokeWidth={6} /><line x1={285} y1={470} x2={275} y2={560} stroke="#5a3a20" strokeWidth={6} />
        <rect x={170} y={555} width={120} height={80} rx={10} fill="#8a5a2a" stroke="#4a2d16" strokeWidth={6} /></svg></div>
    <Floor x={930} y={950} w={lerp(500, 120, k)} o={0.5} />
    <Num tt={tt} d={0.2} x={760} y={1010} txt="CRECIÓ CASI 6 % POR AÑO" size={76} col={INK} />
  </>;
}}</Stage>;

// 15:02 · LA MONEDA QUIETA: un sol de plata gira sobre su canto, firme, al centro; alrededor otras monedas giran, tambalean y caen de plano, una por una
const XSpinCoin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), others = [[300, 620], [560, 760], [1360, 760], [1620, 620]];
  return <>
    <div style={{ ...at(0, 700), width: 1920, height: 380, background: "linear-gradient(180deg,#2a4a3a,#0e1e16)" }} />
    {others.map(([x, y], i) => { const fall = eio(tt, 0.8 + i * (w - 1.8) / 4, 1.5 + i * (w - 1.8) / 4), wob = (1 - fall) * 18 * Math.sin(tt * (5 + i)) , sp = Math.cos(tt * (6 + i)) * (1 - fall) + fall;
      return <div key={i} style={{ ...at(x - 90, y - 180 + 120 * fall) }}><Floor x={90} y={190} w={200} />
        <div style={{ transformOrigin: "50% 100%", transform: `rotate(${wob + (i % 2 ? 1 : -1) * 0 * fall}deg) scaleX(${Math.max(0.1, Math.abs(sp))}) ${fall > 0.5 ? `scaleY(${1 - 0.7 * eio(fall, 0.5, 1)})` : ""}` }}><Coin r={90} copper /></div></div>; })}
    <div style={{ ...at(960 - 180, 300) }}><Floor x={180} y={380} w={300} />
      <div style={{ transform: `scaleX(${Math.max(0.08, Math.abs(Math.cos(tt * 4)))})` }}><Coin r={180} silver txt="S/" /></div></div>
    <Num tt={tt} d={0.2} x={960} y={160} txt="EL SOL, FIRME" size={110} col={AMB} />
  </>;
}}</Stage>;

// 15:40 · EL CARRETE DE COBRE: un carrete de madera gigante se desenrolla y el cable de cobre brillante corre por el piso hacia un barco que espera en el puerto
const XCopperSpool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.3), rot = tt * 140 * (0.4 + k), len = 1300 * k, R = 300 - 110 * k;
  return <>
    <div style={{ ...at(0, 760), width: 1920, height: 320, background: "linear-gradient(180deg,#5a5048,#2a2420)" }} />
    <div style={{ ...at(1480, 520) }}><svg width={420} height={260}><path d="M0 140 L420 140 L380 240 L40 240 Z" fill="#3a3d41" /><rect x={120} y={60} width={160} height={80} fill="#c9cdd1" /><rect x={300} y={20} width={30} height={120} fill="#b8261e" /></svg></div>
    <div style={{ ...at(420, 774), width: len, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#ffd2a8,#c9733a 50%,#6a3414)", boxShadow: "0 8px 10px rgba(0,0,0,.5)" }} />
    <Floor x={360} y={800} w={600} />
    <div style={{ ...at(360 - 320, 790 - 640) }}>
      <svg width={640} height={640} style={{ transform: `rotate(${rot}deg)` }}><circle cx={320} cy={320} r={310} fill="#8a5a2a" stroke="#4a2d16" strokeWidth={20} />
        <circle cx={320} cy={320} r={R} fill="url(#cu)" /><defs><radialGradient id="cu"><stop offset=".3" stopColor="#6a3414" /><stop offset=".7" stopColor="#e08a4a" /><stop offset="1" stopColor="#8a4a1a" /></radialGradient></defs>
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={320} cy={320} r={R - i * (R - 80) / 12} fill="none" stroke="rgba(255,210,160,.35)" strokeWidth={3} />)}
        <circle cx={320} cy={320} r={70} fill="#4a2d16" />{[0, 120, 240].map((a) => <circle key={a} cx={320 + 200 * Math.cos(a * Math.PI / 180)} cy={320 + 200 * Math.sin(a * Math.PI / 180)} r={34} fill="#3a2410" />)}</svg></div>
    <Num tt={tt} d={0.2} x={1000} y={170} txt="COBRE" size={130} col="#e8955a" />
  </>;
}}</Stage>;

// 16:30 · LA PUERTA GIRATORIA: una puerta giratoria de vidrio; por ella entran y salen siluetas con banda (presidentes), mientras un hombre de anteojos queda siempre adentro, en el mismo lugar
const XRevolvingDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = LIN(tt, h, 0.3), ang = 220 * k + 20 * tt, N = 4;
  return <>
    <div style={{ ...at(0, 880), width: 1920, height: 200, background: "linear-gradient(180deg,#8a8272,#4a443c)" }} />
    <div style={{ ...at(560, 180), width: 800, height: 90, borderRadius: "50%", background: "linear-gradient(180deg,#c9cdd1,#6a6e72)" }} />
    <div style={{ ...at(560, 820), width: 800, height: 90, borderRadius: "50%", background: "linear-gradient(180deg,#9aa0a6,#3a3d41)" }} />
    {Array.from({ length: N }, (_, i) => { const a = ((ang + i * 90) % 360) * Math.PI / 180, x = Math.sin(a) * 380, z = Math.cos(a);
      return <div key={i} style={{ ...at(960 + Math.min(x, 0), 230), width: Math.abs(x), height: 620, background: `rgba(190,225,245,${0.15 + 0.15 * (z + 1) / 2})`, borderLeft: x < 0 ? "8px solid #c9cdd1" : "none", borderRight: x > 0 ? "8px solid #c9cdd1" : "none", zIndex: Math.round(z * 10) + 10 }} />; })}
    <div style={{ ...at(940, 230), width: 40, height: 620, background: "linear-gradient(90deg,#6a6e72,#f0f2f4,#5a5e62)", zIndex: 30 }} />
    {[0, 1, 2].map((i) => { const p = (tt * 0.45 + i / 3) % 1, x = lerp(120, 1800, p), op = Math.sin(Math.PI * p);
      return <div key={i} style={{ ...at(x, 560), opacity: op, zIndex: 25 }}><Person w={120} col="#1d1a16" /><div style={{ ...at(-10, 110) }}><Sash w={150} /></div></div>; })}
    <div style={{ ...at(1000, 520), zIndex: 28 }}><Person w={130} col="#3a3430" />
      <svg width={130} height={60} style={at(0, 20)}><circle cx={48} cy={30} r={18} fill="none" stroke={GOLD} strokeWidth={7} /><circle cx={92} cy={30} r={18} fill="none" stroke={GOLD} strokeWidth={7} /><line x1={66} y1={30} x2={74} y2={30} stroke={GOLD} strokeWidth={6} /></svg></div>
    <Num tt={tt} d={0.2} x={960} y={110} txt="ÉL SE QUEDA" size={100} col={AMB} />
  </>;
}}</Stage>;

// 17:12 · EL TANQUE: un tanque de agua de chapa sobre una torre, en corte; se llena de monedas-gota durante el sol, después pasa una nube de tormenta y baja apenas un poco
const XCistern: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#8ab8d8,#d8ecf4)">{(tt) => {
  const w = W(h), fill = eio(tt, 0.4, w * 0.65), storm = eio(tt, w * 0.65, w - 0.5), lvl = fill * 0.9 - storm * 0.15;
  return <>
    <div style={{ ...at(1500 - 200 * storm, 120), width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#fff6c8,#ffd34a 55%,rgba(255,200,60,0))", opacity: 1 - storm }} />
    <div style={{ ...at(lerp(1960, 1150, storm), 100), width: 560, height: 200, borderRadius: 100, background: "radial-gradient(ellipse at 40% 40%,#8a8e94,#3a3d41)", opacity: storm }} />
    {storm > 0.1 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ ...at(lerp(1960, 1150, storm) + 40 + i * 34, 280 + ((tt * 600 + i * 70) % 300)), width: 5, height: 40, background: "rgba(220,235,255,.8)", opacity: storm }} />)}
    <div style={{ ...at(0, 940), width: 1920, height: 140, background: "linear-gradient(180deg,#8a7a5a,#4a3a2a)" }} />
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M760 940 L820 600 M1160 940 L1100 600 M780 820 L1140 700 M1140 820 L780 700" stroke="#5a5e62" strokeWidth={18} /></svg>
    <Floor x={960} y={950} w={600} />
    <div style={{ ...at(700, 170), width: 520, height: 440, borderRadius: "30px 30px 20px 20px", background: "linear-gradient(90deg,#6a7076,#c9cdd1 40%,#5a5e62)", boxShadow: "0 30px 50px rgba(0,0,0,.4)", overflow: "hidden" }}>
      <div style={{ ...at(40, 40), width: 440, height: 360, background: "#1a1c1e", overflow: "hidden" }}>
        <div style={{ ...at(0, 360 * (1 - lvl)), width: 440, height: 360, background: "linear-gradient(180deg,#ffe58a,#e9b949 40%,#a87a1c)" }} />
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ ...at(20 + (i % 5) * 84, 360 * (1 - lvl) + 20 + Math.floor(i / 5) * 60), width: 60, height: 22, borderRadius: "50%", background: "rgba(255,255,255,.35)", opacity: lvl > 0.1 ? 1 : 0 }} />)}</div></div>
    {fill < 0.98 && storm < 0.05 && [0, 1, 2].map((i) => { const p = (tt * 1.6 + i / 3) % 1; return <div key={i} style={{ ...at(940, lerp(-60, 210 + 360 * (1 - lvl), p)) }}><Coin r={30} /></div>; })}
    {storm > 0.3 && <div style={{ ...at(1220, 560), width: 14, height: 380 * storm, background: "linear-gradient(180deg,#e9b949,rgba(233,185,73,0))" }} />}
    <Num tt={tt} d={0.2} x={430} y={200} txt="RESERVAS" size={100} col={INK} />
  </>;
}}</Stage>;

// 17:58 · LOS CEROS: un billete viejo de intis enorme; a la derecha de la cifra van cayendo ceros uno por uno, con golpe, hasta que el número no entra en el billete
const XZeros: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), N = 6, step = (w - 1.2) / N, n = Math.min(N, Math.max(0, Math.floor((tt - 0.5) / step) + 1)), sq = Math.min(1, 7 / (1 + n + 0.0001) * 0.9);
  return <>
    <Floor x={960} y={880} w={1500} />
    <div style={{ ...at(260, 300), width: 1400, height: 560, borderRadius: 24, background: "linear-gradient(135deg,#e8d8b8,#c9a87a 60%,#a8865a)", border: "14px solid #6a4a2a", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ ...at(40, 40), width: 1300, height: 460, border: "4px dashed rgba(90,60,30,.5)", borderRadius: 14 }} />
      <div style={{ ...at(80, 80), width: 260, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#d8c09a,#a8865a)", border: "6px solid #6a4a2a" }}><div style={{ ...at(60, 60) }}><Person w={140} col="#6a4a2a" /></div></div>
      <div style={{ ...at(80, 470), fontWeight: 900, fontSize: 40, color: "#4a2d16", letterSpacing: 6 }}>BANCO CENTRAL DE RESERVA · INTIS</div>
      <div style={{ ...at(420, 150), display: "flex", alignItems: "flex-end", transformOrigin: "0 50%", transform: `scale(${Math.max(0.55, Math.min(1, sq * 1.4))})` }}>
        <span style={{ fontWeight: 900, fontSize: 220, color: "#4a2d16", fontFamily: "'Courier New', monospace" }}>5</span>
        {Array.from({ length: n }, (_, i) => { const s = phys(tt, 0.5 + i * step, 8, 0.4); return <span key={i} style={{ fontWeight: 900, fontSize: 220, color: i === n - 1 ? "#b8261e" : "#4a2d16", fontFamily: "'Courier New', monospace", display: "inline-block", transform: `translateY(${-160 * (1 - Math.min(1, s))}px)`, opacity: cl(s * 4) }}>0</span>; })}
      </div>
    </div>
    <Num tt={tt} d={0.2} x={960} y={170} txt={`${n} ${n === 1 ? "CERO" : "CEROS"}`} size={110} col={AMB} />
  </>;
}}</Stage>;

// 18:44 · LAS TARJETAS DE FICHAR: un reloj de fichar de fábrica y un estante con diez tarjetas; sólo tres reciben el sello; las otras siete quedan en blanco y se vuelven grises
const XTimecards: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), step = (w * 0.55) / 3, gray = eio(tt, w * 0.62, w - 0.45);
  return <>
    <div style={{ ...at(200, 200), width: 1520, height: 700, borderRadius: 20, background: "linear-gradient(180deg,#6a5a48,#3a2e24)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 10 }, (_, i) => { const st = i < 3, s = phys(tt, 0.3 + i * 0.12, 7, 0.45), stamp = st ? phys(tt, 0.9 + i * step, 9, 0.35) : 0;
      return <div key={i} style={{ ...at(260 + i * 145, 300 + (1 - Math.min(1, s)) * -80), width: 125, height: 520, borderRadius: 8, opacity: cl(s * 3),
        background: st ? `linear-gradient(180deg,${PAPER},${PAPERD})` : `linear-gradient(180deg,${lerpCol(gray)},${lerpCol(gray * 0.9)})`, boxShadow: "0 10px 14px rgba(0,0,0,.45)" }}>
        {Array.from({ length: 8 }, (_, j) => <div key={j} style={{ ...at(12, 70 + j * 52), width: 100, height: 3, background: "rgba(60,40,20,.35)" }} />)}
        <div style={{ ...at(12, 20), width: 100, height: 26, background: "rgba(60,40,20,.6)", borderRadius: 3 }} />
        {stamp > 0.01 && <div style={{ ...at(8, 180), width: 108, height: 108, borderRadius: "50%", border: "8px solid #2a6a3a", color: "#2a6a3a", fontWeight: 900, fontSize: 30, textAlign: "center", lineHeight: "92px", transform: `scale(${1.6 - 0.6 * Math.min(1, stamp)}) rotate(-14deg)`, opacity: cl(stamp * 3) }}>OK</div>}
      </div>; })}
    <Num tt={tt} d={0.2} x={960} y={130} txt="7 DE CADA 10, SIN CONTRATO" size={88} col={gray > 0.5 ? RED : AMB} />
  </>;
}}</Stage>;
const lerpCol = (g: number) => { const a = [241, 234, 217], b = [120, 118, 112]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * g)).join(",")})`; };

// 19:30 · EL EXPEDIENTE: una carpeta de causa gruesa se abre al centro; por cada paso que se nombra entra una hoja con su sello y se apila; arriba, el paso actual
const XDossier: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fb: [number, string][] = ["HABLA UN COLABORADOR", "APORTA PRUEBAS", "SE SIGUE LA PLATA", "PRISIÓN PREVENTIVA", "EL JUICIO", "LA CONDENA"].map((s, i) => [h.at + 0.4 + i * (W(h) - 1.2) / 6, s]);
  const { st, cur } = stepsOf(h, t, fb), open = eio(tt, 0.2, 0.9);
  return <>
    <Floor x={960} y={950} w={1300} />
    <div style={{ ...at(360, 360), width: 1200, height: 560, borderRadius: 16, background: "linear-gradient(180deg,#c9a46a,#8a6a3a)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
    <div style={{ ...at(360, 360), width: 1200, height: 560, transformOrigin: "50% 0", transform: `perspective(1800px) rotateX(${-170 * open}deg)`, borderRadius: 16, background: "linear-gradient(180deg,#d8b47a,#a8844a)", backfaceVisibility: "hidden", zIndex: open < 0.5 ? 50 : 0 }}>
      <div style={{ ...at(420, 220), fontWeight: 900, fontSize: 70, color: "#4a2d16" }}>CAUSA</div></div>
    {st.map(([s0, txt], i) => { if (t < s0) return null; const p = phys(t, s0, 8, 0.45); return <div key={i} style={{ ...at(440 + i * 14, 400 - i * 16 - (1 - Math.min(1, p)) * 300), width: 1040, height: 480, background: `linear-gradient(180deg,${PAPER},${PAPERD})`, boxShadow: "0 10px 16px rgba(0,0,0,.4)", borderRadius: 6, transform: `rotate(${(i % 2 ? 1 : -1) * 1.5}deg)` }}>
      <div style={{ ...at(60, 60), fontWeight: 900, fontSize: 90, color: INK }}>{i + 1}</div>
      {Array.from({ length: 5 }, (_, j) => <div key={j} style={{ ...at(200, 90 + j * 60), width: 700 - j * 60, height: 18, background: "rgba(60,40,20,.35)", borderRadius: 4 }} />)}
      <div style={{ ...at(760, 320), width: 220, height: 110, border: "8px solid #b8261e", color: "#b8261e", fontWeight: 900, fontSize: 40, textAlign: "center", lineHeight: "94px", transform: "rotate(-10deg)", opacity: cl((t - s0 - 0.4) * 4) }}>FISCAL</div></div>; })}
    {cur >= 0 && <Num key={cur} tt={t - st[cur][0]} d={0.05} x={960} y={190} txt={`${cur + 1} · ${st[cur][1]}`} size={86} col={cur === st.length - 1 ? RED : AMB} />}
  </>;
}}</Stage>;

// 20:40 · EL SÁNDWICH: sobre una tabla de madera se arma un pan con chicharrón capa por capa (pan, chicharrón, camote, salsa criolla, tapa) con peso y rebote
const XSandwich: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), step = (w - 1.0) / 5;
  const L: [number, number, string, number][] = [[0, 90, "linear-gradient(180deg,#e8b070,#b8783a)", 760], [1, 70, "linear-gradient(180deg,#c9703a,#7a3a14)", 700], [2, 50, "linear-gradient(180deg,#ffb84a,#d8782a)", 680], [3, 40, "repeating-linear-gradient(90deg,#c2261e 0 30px,#f4f1ea 30px 50px,#2a8a3a 50px 70px)", 720], [4, 130, "radial-gradient(ellipse at 50% 20%,#f4c88a,#c9883a 60%,#8a5a2a)", 780]];
  let y = 780;
  return <>
    <Floor x={960} y={890} w={1200} />
    <div style={{ ...at(460, 800), width: 1000, height: 80, borderRadius: 20, background: "linear-gradient(180deg,#a8743a,#6a4420)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    {L.map(([i, hh, bg, ww]) => { y -= hh - 6; const s = phys(tt, 0.3 + i * step, 7, 0.45); if (s <= 0.001) return null;
      return <div key={i} style={{ ...at(960 - ww / 2, y - (1 - Math.min(1, s)) * 500), width: ww, height: hh, borderRadius: i === 4 ? "50% 50% 20px 20px / 90% 90% 20px 20px" : i === 0 ? "20px 20px 40px 40px" : 30, background: bg, boxShadow: "0 10px 14px rgba(0,0,0,.4)", opacity: cl(s * 4) }} />; })}
    <Num tt={tt} d={0.2} x={960} y={170} txt="PAN CON CHICHARRÓN" size={100} col={AMB} />
  </>;
}}</Stage>;

// 21:22 · EL CARTEL: el cartel de una empresa en lo alto de un edificio; las letras de ODEBRECHT se descuelgan y caen de a una, y bajan colgadas de una grúa las de NOVONOR
const XSignSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#3a4a6a,#8aa0b8)">{(tt) => {
  const w = W(h), A = "ODEBRECHT".split(""), B = "NOVONOR".split(""), half = w * 0.45, sa = (half - 0.5) / A.length, sb = (w - 0.6 - half) / B.length;
  return <>
    <div style={{ ...at(360, 420), width: 1200, height: 660, background: "linear-gradient(90deg,#4a5260,#6a7280 50%,#3a424e)" }}>{Array.from({ length: 24 }, (_, i) => <div key={i} style={{ ...at(40 + (i % 8) * 145, 60 + Math.floor(i / 8) * 180), width: 100, height: 120, background: "rgba(255,220,140,.35)" }} />)}</div>
    <div style={{ ...at(300, 400), width: 1320, height: 24, background: "#2a2c2e" }} />
    {A.map((c, i) => { const f = eio(tt, 0.4 + i * sa, 0.4 + i * sa + 0.7); return <div key={"a" + i} style={{ ...at(360 + i * 132, 250 + 900 * f * f), transform: `rotate(${(i % 2 ? 1 : -1) * 40 * f}deg)`, fontWeight: 900, fontSize: 150, color: "#e8eaec", textShadow: "0 8px 0 #6a6e72, 0 14px 20px rgba(0,0,0,.6)", opacity: 1 - cl((f - 0.8) * 5) }}>{c}</div>; })}
    {B.map((c, i) => { const s = phys(tt, half + i * sb, 6, 0.5), y = 250 - 500 * (1 - Math.min(1, s)); return <div key={"b" + i} style={{ ...at(460 + i * 150, y) }}>
      <div style={{ ...at(60, -600), width: 4, height: 600 - 0, background: "#1a1c1e", opacity: 1 - cl((s - 0.9) * 5) }} />
      <div style={{ fontWeight: 900, fontSize: 150, color: AMB, textShadow: "0 8px 0 #8a6414, 0 14px 20px rgba(0,0,0,.6)" }}>{c}</div></div>; })}
    <Num tt={tt} d={0.2} x={960} y={110} txt="MISMA EMPRESA, OTRO NOMBRE" size={80} col={TX} />
  </>;
}}</Stage>;

// 22:05 · LA RUEDA DE RECONOCIMIENTO: la pared con las rayas de altura de una comisaría; entran siluetas con banda de a una y se paran; la última recibe un sello DESTITUIDO
const XLineup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#d8d4c8,#a8a498)">{(tt) => {
  const w = W(h), N = 4, step = (w * 0.6) / N, stamp = phys(tt, w * 0.72, 9, 0.35);
  return <>
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ ...at(0, 140 + i * 90), width: 1920, height: 4, background: "rgba(40,40,40,.5)" }} />)}
    {Array.from({ length: 9 }, (_, i) => <div key={"n" + i} style={{ ...at(30, 116 + i * 90), fontWeight: 900, fontSize: 36, color: "rgba(40,40,40,.7)" }}>{(2.0 - i * 0.1).toFixed(1).replace(".", ",")}</div>)}
    <div style={{ ...at(0, 900), width: 1920, height: 180, background: "linear-gradient(180deg,#6a6658,#3a382e)" }} />
    {Array.from({ length: N }, (_, i) => { const p = eio(tt, 0.3 + i * step, 0.3 + i * step + 0.8), x = lerp(-300, 300 + i * 380, p), last = i === N - 1;
      return <div key={i} style={{ ...at(x, 420) }}><Person w={200} col={last ? "#2a2622" : "#4a463e"} /><div style={{ ...at(10, 170) }}><Sash w={210} /></div>
        <div style={{ ...at(30, 500), width: 140, height: 50, background: "#1a1814", color: "#fff", fontWeight: 900, fontSize: 32, textAlign: "center", lineHeight: "50px" }}>{i + 1}</div>
        {last && stamp > 0.01 && <div style={{ ...at(-80, 160), width: 380, height: 110, border: "10px solid #b8261e", color: "#b8261e", fontWeight: 900, fontSize: 50, textAlign: "center", lineHeight: "90px", background: "rgba(255,255,255,.6)", transform: `scale(${1.8 - 0.8 * Math.min(1, stamp)}) rotate(-12deg)`, opacity: cl(stamp * 3) }}>DESTITUIDO</div>}</div>; })}
    <Num tt={tt} d={0.2} x={1150} y={1000} txt="VIZCARRA, DESTITUIDO" size={76} col={TX} />
  </>;
}}</Stage>;

// 22:51 · LA BANDA QUE PASA: siete siluetas en fila de perfil; la banda presidencial salta de hombro en hombro, de izquierda a derecha, cada vez más rápido; un contador 1 → 7
const XSashPass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = LIN(tt, h, 0.4), p = 6 * Math.pow(k, 0.8), i0 = Math.min(6, Math.floor(p)), f = p - i0, x0 = 180 + i0 * 255, x1 = 180 + Math.min(6, i0 + 1) * 255, arc = Math.sin(Math.PI * f) * 220;
  return <>
    <div style={{ ...at(0, 860), width: 1920, height: 220, background: "linear-gradient(180deg,#5a1a1a,#2a0808)" }} />
    {Array.from({ length: 7 }, (_, i) => { const s = phys(tt, 0.1 + i * 0.1, 7, 0.45); return <div key={i} style={{ ...at(140 + i * 255, 440 + (1 - Math.min(1, s)) * 120), opacity: cl(s * 3) }}><Floor x={80} y={420} w={200} /><Person w={170} col={i === i0 ? "#2a2622" : "#5a544a"} />
      <div style={{ ...at(30, 440), fontWeight: 900, fontSize: 40, color: i <= i0 ? AMB : "rgba(255,255,255,.4)", width: 110, textAlign: "center" }}>{2016 + Math.round(i * 1.4)}</div></div>; })}
    <div style={{ ...at(lerp(x0, x1, i0 >= 6 ? 0 : f), 600 - (i0 >= 6 ? 0 : arc)) }}><Sash w={200} /></div>
    <Num tt={tt} d={0.2} x={960} y={170} txt={`${Math.max(1, Math.min(7, i0 + 1))} ${i0 === 0 ? "PRESIDENTE" : "PRESIDENTES"}`} size={100} col={i0 >= 6 ? RED : AMB} />
  </>;
}}</Stage>;

// 23:40 · LA CAMPANA DE VIDRIO: la moneda de sol bajo una campana de vidrio sobre un pedestal; una mano gigante entra a manotazos y rebota contra el vidrio una y otra vez
const XGlassDome: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), P = Math.max(1.2, (w - 1) / 3), c = Math.max(0, tt - 0.7), f = (c % P) / P, hit = f < 0.4 ? eio(f, 0, 0.4) : 1 - eio(f, 0.4, 1), flash = c > 0 && f > 0.36 && f < 0.48 ? 1 : 0;
  return <>
    <Floor x={960} y={940} w={800} />
    <Slab w={600} h={180} depth={40} top="linear-gradient(180deg,#e8e2d2,#b8b09a)" side="#7a7260" />
    <div style={{ ...at(660, 740) }}><Slab w={600} h={160} depth={40} top="linear-gradient(180deg,#e8e2d2,#b8b09a)" side="#7a7260" /></div>
    <div style={{ ...at(960 - 120, 520) }}><Coin r={120} silver txt="S/" /></div>
    <div style={{ ...at(700, 250), width: 520, height: 500, borderRadius: "260px 260px 20px 20px", background: "linear-gradient(90deg, rgba(255,255,255,.28), rgba(255,255,255,.04) 30%, rgba(255,255,255,.2) 72%, rgba(255,255,255,.05))", border: "6px solid rgba(230,245,255,.85)", boxShadow: `0 0 ${60 * flash}px rgba(200,230,255,${0.8 * flash})` }}>
      <div style={{ ...at(80, 60), width: 40, height: 260, borderRadius: 20, background: "rgba(255,255,255,.5)" }} /></div>
    <div style={{ ...at(lerp(1700, 1190, hit), 380 + 20 * Math.sin(tt * 2)), transform: `rotate(${-10 + 10 * hit}deg)` }}><svg width={420} height={200}><path d="M60 40 Q20 40 20 80 L20 120 Q20 160 60 160 L260 160 L420 140 L420 60 L260 40 Z" fill="#c9a07a" /><path d="M60 40 L60 160 M110 40 L110 160 M160 40 L160 160" stroke="#a8805a" strokeWidth={4} /><rect x={320} y={50} width={100} height={100} fill="#2a2a30" /></svg></div>
    <Num tt={tt} d={0.2} x={960} y={150} txt="NADIE LA PUDO TOCAR" size={100} col={AMB} />
  </>;
}}</Stage>;

export const HC2: Record<string, React.FC<{ t: number; h: H }>> = { balloon: XBalloon, spincoin: XSpinCoin, copperspool: XCopperSpool, revolvingdoor: XRevolvingDoor, cistern: XCistern, zeros: XZeros,
  timecards: XTimecards, dossier: XDossier, sandwich: XSandwich, signswap: XSignSwap, lineup: XLineup, sash: XSashPass, glassdome: XGlassDome };
void GRN;
