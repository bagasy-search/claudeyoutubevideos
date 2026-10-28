// componentes únicos de mec28a · segunda mitad (la lámpara de prueba, el multímetro, el cambio, la manguera y la válvula, el cable al rojo,
// el relé por dentro, el corto, los 3 casos, la bolsita, los fusibles viejos y el ranking).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, Coin, FCOL, Fuse, Icon, Mark, Meter, Relay, TestLamp, Wire, rnd } from "./mkit";

// ---- 12:45 · LA LÁMPARA DE PRUEBA: batería → fusible → lámpara → masa, la corriente que corre ----
export const HCircuit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = eio(tt, 1.6, 2.4), on = eio(tt, 2.4, 2.8);
  return <>
    <Head tt={tt} kick="PUNTO 5" title="LA LÁMPARA DE PRUEBA" col={AMB} />
    <div style={{ position: "absolute", left: 200, top: 520, width: 260, height: 200, borderRadius: 16, background: "linear-gradient(180deg,#2a2b2f,#141518)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, top: -24, width: 50, height: 30, borderRadius: 6, background: "#c0392b" }} /><div style={{ position: "absolute", left: 180, top: -24, width: 50, height: 30, borderRadius: 6, background: "#333" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 48, color: TX }}>12 V</div></div>
    <Wire d="M255 500 C 300 360, 560 360, 760 420" tt={tt} flow={f} />
    <Fuse x={860} y={480} s={1.0} amp="15" holes />
    <TestLamp x={1180} y={560} s={0.9} on={on} rot={-20} cable={false} />
    <Wire d="M1250 340 C 1420 260, 1600 480, 1640 760" tt={tt} flow={on} col="#333" w={10} />
    <div style={{ position: "absolute", left: 1560, top: 760, width: 180, height: 80, borderRadius: 10, background: "linear-gradient(90deg,#6a6f75,#b8bec4,#6a6f75)" }} />
    <Tag tt={tt} at={0.8} x={1650} y={880} txt="MASA = METAL PELADO" col={ICE} size={34} />
    <Tag tt={tt} at={2.8} x={1300} y={250} txt="PRENDE = LLEGA CORRIENTE" col={GRN} size={42} />
  </>;
}}</Stage>;

// ---- 13:15 · LOS DOS AGUJERITOS: la punta toca izquierda y derecha; en el quemado, uno solo ----
export const HHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const side = (a: number) => cl((tt - a) / 0.2) * (1 - cl((tt - a - 0.7) / 0.2));
  const L1 = side(0.9), R1 = side(1.9), L2 = side(3.0), R2 = side(4.0);
  const tip = (x: number, y: number, on: number, k: number) => k <= 0 ? null : <div style={{ position: "absolute", left: x, top: y - 40 * (1 - k) }}><TestLamp x={0} y={0} s={0.55} on={on} cable={false} /></div>;
  return <>
    <Head tt={tt} kick="SIN SACAR NINGUNO" title="TOCAS LOS DOS AGUJERITOS" col={AMB} />
    <Fuse x={600} y={640} s={2.2} amp="15" holes />
    <Fuse x={1320} y={640} s={2.2} amp="15" holes blown={1} />
    {tip(541, 470, L1, L1)}{tip(659, 470, R1, R1)}{tip(1261, 470, L2, L2)}{tip(1379, 470, 0, R2)}
    <Tag tt={tt} at={2.4} x={600} y={950} txt="PRENDE EN LOS DOS = BUENO" col={GRN} size={36} />
    <Tag tt={tt} at={4.4} x={1320} y={950} txt="EN UNO SOLO = QUEMADO" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 14:05 · TOC, TOC, TOC: la punta salta por la fila y uno queda apagado ----
export const HTocToc: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const N = 9, BAD = 6, k = cl((tt - 0.8) / 3.6) * (N - 1), i = Math.round(k), hop = Math.abs(Math.sin((k - Math.floor(k)) * Math.PI));
  const AM = ["10", "15", "10", "20", "7.5", "15", "20", "10", "15"];
  return <>
    <Head tt={tt} kick="EN UN MINUTO" title="TOC, TOC, TOC… AHÍ ESTÁ" col={AMB} />
    {AM.map((a, j) => <Fuse key={j} x={300 + j * 165} y={680} s={0.9} amp={a} holes blown={j === BAD ? 1 : 0} glow={j === BAD && tt > 4.6 ? 0.9 : 0} />)}
    <div style={{ position: "absolute", left: 300 + k * 165, top: 520 - 80 * hop, width: 0, height: 0 }}><TestLamp x={0} y={0} s={0.6} on={i === BAD || hop > 0.3 ? 0 : 1} cable={false} /></div>
    {Array.from({ length: i + 1 }, (_, j) => j === BAD ? null : <div key={j} style={{ position: "absolute", left: 270 + j * 165, top: 860, width: 60, textAlign: "center", fontFamily: HAND, fontSize: 40, color: GRN }}>toc</div>)}
    <Mark x={300 + BAD * 165} y={900} p={cl((tt - 4.6) / 0.4)} s={140} />
  </>;
}}</Stage>;

// ---- 14:25 · EL MULTÍMETRO: la perilla gira a continuidad y pita ----
export const HMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ang = -60 + 120 * eio(tt, 0.8, 1.8), beep = cl((tt - 2.6) / 0.2) * (0.6 + 0.4 * Math.sin(tt * 18));
  return <>
    <Head tt={tt} kick="PUNTO 6" title="EL MULTÍMETRO NO MIENTE" col={AMB} />
    <Meter x={640} y={560} s={1.05} read={tt > 2.6 ? "0.00" : "----"} ang={ang} beep={tt > 2.6 ? beep : 0} />
    <Fuse x={1300} y={520} s={1.6} amp="10" />
    <Wire d="M560 860 C 700 980, 1100 980, 1250 680" tt={tt} col="#c0392b" w={10} />
    <Wire d="M740 860 C 860 940, 1240 900, 1350 680" tt={tt} col="#222" w={10} />
    <Tag tt={tt} at={2.8} x={1320} y={260} txt="PITA = BUENO" col={GRN} size={50} />
    <Tag tt={tt} at={3.8} x={1320} y={330} txt="NO PITA = QUEMADO" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 15:20 · 12 Y 0: dos lecturas, una a cada lado del fusible ----
export const HVolts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const a = eio(tt, 0.8, 1.6), b = eio(tt, 2.0, 2.8);
  return <>
    <Head tt={tt} kick="CON EL FUSIBLE PUESTO" title="12 DE UN LADO · 0 DEL OTRO" col={RED} />
    <Fuse x={960} y={620} s={2.4} amp="15" holes blown={1} />
    <Meter x={420} y={600} s={0.75} read={(12.6 * a).toFixed(1)} ang={-60} />
    <Meter x={1500} y={600} s={0.75} read={b > 0 ? "0.00" : "----"} ang={-60} />
    <Arrow x1={560} y1={400} x2={880} y2={450} p={a} col={GRN} curve={-0.2} />
    <Arrow x1={1360} y1={400} x2={1040} y2={450} p={b} col={RED} curve={0.2} />
    <Tag tt={tt} at={3.2} x={960} y={970} txt="ENTRA PERO NO SALE = QUEMADO" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 16:10 · EL CAMBIO: tamaño, color y número que coinciden de a uno ----
export const HSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const out = eio(tt, 0.6, 1.4), inn = phys(tt, 3.6, 6, 0.55);
  const C = ["MISMO TAMAÑO", "MISMO COLOR", "MISMO NÚMERO"];
  return <>
    <Head tt={tt} kick="PUNTO 7" title="UNO IGUAL · AL MISMO LUGAR" col={GRN} />
    <Fuse x={520 - 120 * out} y={600} s={1.7} amp="15" blown={1} op={1 - 0.4 * out} />
    <Fuse x={1400 - 400 * cl(inn)} y={600 - 40 * (1 - cl(inn))} s={1.7} amp="15" />
    {C.map((c, i) => <div key={i}><Mark x={1260} y={360 + i * 140} p={cl((tt - 1.6 - i * 0.55) / 0.4)} ok s={90} /><Tag tt={tt} at={1.6 + i * 0.55} x={1330} y={360 + i * 140} txt={c} col={TX} size={40} anchor="l" /></div>)}
    <Tag tt={tt} at={4.3} x={960} y={960} txt="DERECHO · A LA ALTURA DE LOS VECINOS" col={GRN} size={38} />
  </>;
}}</Stage>;

// ---- 16:50 · LA RADIO VUELVE: pantallita que se prende, las ondas, 2:00 y 50 ¢ ----
export const HRadio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const on = eio(tt, 0.8, 1.2), clock = Math.min(120, Math.floor(eio(tt, 1.2, 3.6) * 120));
  return <>
    <Head tt={tt} kick="LA LLAVE EN CONTACTO" title="Y LA RADIO PRENDE" col={GRN} />
    <div style={{ position: "absolute", left: 460, top: 360, width: 1000, height: 300, borderRadius: 24, background: "linear-gradient(180deg,#26272b,#111214)", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 220, top: 70, width: 560, height: 150, borderRadius: 12, background: on ? `rgba(80,190,255,${0.15 + 0.2 * on})` : "#050607", boxShadow: on ? `0 0 ${70 * on}px rgba(80,190,255,.6)` : undefined, color: "#bfe8ff", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 80, textAlign: "center", paddingTop: 26, boxSizing: "border-box", opacity: 0.3 + 0.7 * on }}>FM 98.5</div>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? 860 : 60, top: 90, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#555,#1a1a1a)" }} />)}
    </div>
    {on > 0.5 && [0, 1, 2].map((i) => { const k = ((tt * 0.8 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 960 - 520 - k * 300, top: 510 - 150 - k * 150, width: 1040 + k * 600, height: 300 + k * 300, borderRadius: "50%", border: `4px solid rgba(80,190,255,${0.5 * (1 - k)})` }} />; })}
    <Big x={640} y={850} txt={`${Math.floor(clock / 60)}:${String(clock % 60).padStart(2, "0")}`} s={phys(tt, 1.2, 6, 0.6)} col={TX} size={110} sub="MINUTOS" />
    <Coin x={1280} y={850} s={phys(tt, 3.6, 7, 0.45)} />
  </>;
}}</Stage>;

// ---- 17:05 · POR QUÉ SE QUEMÓ: la aguja de la corriente pega un pico y el puentecito se corta ----
export const HSpike: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sp = Math.exp(-Math.pow((tt - 2.2) * 3, 2)), base = 0.35 + 0.04 * Math.sin(tt * 3), v = Math.min(1.1, base + 0.75 * sp), blown = tt > 2.25 ? 1 : 0;
  const ang = -120 + 240 * cl(v / 1.1);
  return <>
    <Head tt={tt} kick="NO SE QUEMA POR VIEJO" title="SE QUEMA POR UN PICO" col={AMB} />
    <svg viewBox="-300 -300 600 400" style={{ position: "absolute", left: 260, top: 300, width: 720, height: 480, overflow: "visible" }}>
      <path d="M-240 0 A240 240 0 0 1 240 0" stroke="#3a3c42" strokeWidth={30} fill="none" />
      <path d="M120 -208 A240 240 0 0 1 240 0" stroke={RED} strokeWidth={30} fill="none" />
      <line x1={0} y1={0} x2={Math.cos((ang - 90) * Math.PI / 180) * 220} y2={Math.sin((ang - 90) * Math.PI / 180) * 220} stroke={TX} strokeWidth={10} strokeLinecap="round" />
      <circle r={22} fill={TX} />
      <text x={0} y={80} textAnchor="middle" fontSize={40} fontWeight={900} fill={DIM} fontFamily="Arial">CORRIENTE</text>
    </svg>
    <Fuse x={1400} y={560} s={2.0} amp="15" blown={blown} />
    {blown > 0 && tt < 2.6 && <div style={{ position: "absolute", left: 1320, top: 360, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,#fff6c0,rgba(255,180,40,.4) 40%,transparent 70%)", opacity: 1 - (tt - 2.25) / 0.35 }} />}
    <Tag tt={tt} at={2.8} x={1400} y={900} txt="UN CARGADOR BARATO · UNA MONEDA" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 17:35 · EL CÓDIGO DE LA RADIO: candado en la pantallita y la tarjetita con los números ----
export const HCode: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = Math.min(4, Math.floor(cl((tt - 2.4) / 1.6) * 4.99)), open = eio(tt, 4.2, 4.8);
  return <>
    <Head tt={tt} kick="NO LA ROMPISTE" title="TE PIDE UN CÓDIGO" col={ICE} />
    <div style={{ position: "absolute", left: 300, top: 400, width: 760, height: 220, borderRadius: 20, background: "#141518", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 120, top: 50, width: 520, height: 120, borderRadius: 10, background: "rgba(80,190,255,.2)", color: "#bfe8ff", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 72, textAlign: "center", paddingTop: 16, boxSizing: "border-box" }}>{"CODE " + "1234".slice(0, d) + "____".slice(d)}</div></div>
    <div style={{ position: "absolute", left: 1220, top: 380 - (1 - phys(tt, 1.0, 6, 0.5)) * 300, width: 420, height: 260, borderRadius: 14, background: "#f3eedf", transform: "rotate(-6deg)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", color: "#3a2a1a", padding: 30, boxSizing: "border-box" }}>
      <div style={{ fontWeight: 900, fontSize: 30 }}>CÓDIGO DE LA RADIO</div><div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 90, marginTop: 20 }}>1234</div></div>
    <Icon k="lock" x={680} y={780} s={2.2} col={open > 0.5 ? GRN : AMB} />
    <Tag tt={tt} at={4.4} x={680} y={920} txt="SISTEMA CONTRA EL ROBO" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 18:05 · LA MANGUERA Y LA VÁLVULA: el agua aprieta, la válvula se rompe primero, la manguera queda sana ----
export const HHose: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 1.0, 3.0), pop = tt > 3.0 ? 1 : 0, flow = pop ? Math.max(0, 1 - (tt - 3.0) * 3) : 0.4 + 0.6 * p;
  return <>
    <Head tt={tt} kick="EL DIBUJO QUE NO TE VAS A OLVIDAR" title="EL FUSIBLE ES UNA VÁLVULA" col={ICE} />
    <Wire d="M200 600 C 500 600, 700 600, 820 600" tt={tt} flow={flow} col="#2f8a3a" w={40} speed={1 + p} />
    <div style={{ position: "absolute", left: 820, top: 540, width: 140, height: 120, borderRadius: 16, background: pop ? "linear-gradient(180deg,#7a5a20,#4a3410)" : "linear-gradient(180deg,#e0b040,#a07a10)", transform: `scale(${1 + 0.1 * p * (1 - pop)}) rotate(${pop * 12}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    {pop > 0 && <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M860 540 l20 40 l-16 20 l24 30" stroke="#1a1408" strokeWidth={6} fill="none" /></svg>}
    <Wire d="M960 600 C 1200 600, 1500 600, 1720 600" tt={tt} flow={pop ? 0 : flow} col="#2f8a3a" w={40} speed={1 + p} />
    <Tag tt={tt} at={0.6} x={500} y={500} txt="EL CABLE = LA MANGUERA" col={TX} size={36} />
    <Tag tt={tt} at={1.2} x={890} y={760} txt="EL FUSIBLE" col={AMB} size={36} />
    <Mark x={1400} y={760} p={cl((tt - 3.6) / 0.4)} ok s={140} />
    <Tag tt={tt} at={3.8} x={1400} y={880} txt="LA MANGUERA QUEDA SANA" col={GRN} size={38} />
  </>;
}}</Stage>;

// ---- 18:55 · LA VÁLVULA DEL DOBLE: ahora no se rompe la válvula… revienta la manguera ----
export const HBurst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #2a0e0a, #070708 72%)">{(tt) => {
  const p = eio(tt, 0.8, 3.0), burst = tt > 3.0 ? cl((tt - 3.0) / 0.4) : 0, sw = 40 + 18 * p * (1 - burst);
  return <>
    <Head tt={tt} kick="PONES UNO DE 30" title="LA VÁLVULA AGUANTA EL DOBLE" col={RED} />
    <Wire d="M200 600 C 500 600, 700 600, 820 600" tt={tt} flow={1} col="#2f8a3a" w={sw} speed={2} />
    <div style={{ position: "absolute", left: 800, top: 520, width: 180, height: 160, borderRadius: 18, background: "linear-gradient(180deg,#5aa04a,#2a6a2a)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}><div style={{ textAlign: "center", fontWeight: 900, fontSize: 54, marginTop: 44, color: "#fff" }}>30</div></div>
    <Wire d="M980 600 C 1200 600, 1500 600, 1720 600" tt={tt} flow={1} col="#2f8a3a" w={sw} speed={2} />
    {burst > 0 && Array.from({ length: 18 }, (_, i) => { const a = rnd(i) * Math.PI * 2, r = 40 + 260 * burst * rnd(i, 2); return <div key={i} style={{ position: "absolute", left: 1350 + Math.cos(a) * r, top: 600 + Math.sin(a) * r * 0.6, width: 18, height: 18, borderRadius: "50%", background: `rgba(140,200,255,${1 - burst * 0.7})` }} />; })}
    <Tag tt={tt} at={1.0} x={1350} y={460} txt="EL CABLE SIGUE SIENDO PARA 15" col={TX} size={36} />
    <Big x={1350} y={860} txt="REVIENTA" s={phys(tt, 3.1, 7, 0.4)} col={RED} size={100} sub="LO QUE NO SE CORTA, SE CALIENTA" />
  </>;
}}</Stage>;

// ---- 19:15 · EL CABLE AL ROJO: termómetro que sube y el plástico que se derrite y humea ----
export const HWireHeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #1e0c08, #070708 72%)">{(tt) => {
  const heat = eio(tt, 0.6, 4.0), temp = Math.round(25 + 175 * heat);
  return <>
    <Head tt={tt} kick="DENTRO DEL TABLERO" title="SE CALIENTA EL CABLE" col={RED} />
    {[0, 1, 2, 3, 4].map((i) => <Wire key={i} d={`M200 ${470 + i * 40} C 700 ${430 + i * 50}, 1100 ${520 + i * 30}, 1500 ${480 + i * 40}`} tt={tt} heat={i === 2 ? heat : heat * 0.35 * (i === 1 || i === 3 ? 1 : 0)} w={i === 2 ? 22 : 16} col={["#2f6fe0", "#f2c623", "#c0392b", "#3cb04a", "#444"][i]} />)}
    {Array.from({ length: 12 }, (_, i) => { const k = ((tt * 0.45 + rnd(i)) % 1); return heat < 0.55 ? null : <div key={i} style={{ position: "absolute", left: 600 + rnd(i, 3) * 700 - 40, top: 520 - k * 380, width: 80 + k * 140, height: 80 + k * 140, borderRadius: "50%", background: `rgba(120,120,120,${(heat - 0.55) * 0.9 * (1 - k)})`, filter: "blur(12px)" }} />; })}
    <div style={{ position: "absolute", left: 1640, top: 300, width: 60, height: 520, borderRadius: 30, background: "rgba(255,255,255,.1)", border: "3px solid rgba(255,255,255,.3)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${12 + 88 * heat}%`, background: `linear-gradient(0deg,${RED},#ffb04a)` }} /></div>
    <Big x={1670} y={900} txt={`${temp} °C`} s={phys(tt, 0.6, 6, 0.6)} col={heat > 0.6 ? RED : AMB} size={70} />
    <Tag tt={tt} at={3.0} x={860} y={880} txt="DERRITE EL PLÁSTICO · Y EL DE AL LADO" col={RED} size={38} />
  </>;
}}</Stage>;

// ---- 21:15 · EL RELÉ POR DENTRO: corriente chiquita del botón, el contacto que cierra y la corriente grande a la bocina ----
export const HRelayIn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 0.6, 1.4), small = eio(tt, 1.6, 2.2), cl0 = eio(tt, 2.4, 2.6), big = eio(tt, 2.6, 3.0);
  return <>
    <Head tt={tt} kick="PUNTO 9" title="EL RELÉ: UN INTERRUPTOR CON BOBINA" col={AMB} />
    <div style={{ position: "absolute", left: 210, top: 500, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#3a3c42,#16171a)", border: `4px solid ${small > 0.5 ? ICE : "#333"}` }}><Icon k="horn" x={80} y={80} s={1.1} col={TX} /></div>
    <Wire d="M370 580 C 520 580, 640 520, 790 520" tt={tt} flow={small * 0.6} col="#2f6fe0" w={8} />
    <Relay x={960} y={560} s={1.5} n="87" open={op} closed={cl0} />
    <Wire d="M1100 620 C 1300 620, 1450 600, 1560 600" tt={tt} flow={big} col="#c0392b" w={22} speed={2} />
    <Icon k="horn" x={1680} y={600} s={2.2} col={big > 0.5 ? AMB : DIM} />
    {big > 0.5 && [0, 1, 2].map((i) => { const k = ((tt * 1.4 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 1740 + k * 80, top: 520 - k * 60, width: 40 + k * 60, height: 160 + k * 120, borderRadius: "50%", borderRight: `5px solid rgba(242,180,60,${1 - k})` }} />; })}
    <Tag tt={tt} at={1.8} x={560} y={460} txt="CORRIENTE CHIQUITA" col={ICE} size={30} />
    <Tag tt={tt} at={3.0} x={1330} y={720} txt="CORRIENTE GRANDE" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 22:00 · EL TRUCO DEL CAMBIO: dos relés iguales que se cambian de lugar en arco ----
export const HRelaySwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 1.2, 2.6), arc = Math.sin(k * Math.PI);
  return <>
    <Head tt={tt} kick="UN TRUCO DE TALLER" title="CAMBIALOS DE LUGAR" col={GRN} />
    <Relay x={700 + 520 * k} y={560 - 220 * arc} s={1.3} n="87" />
    <Relay x={1220 - 520 * k} y={560 + 160 * arc} s={1.3} n="87" />
    <Icon k="horn" x={700} y={860} s={1.6} col={tt > 3.0 ? GRN : RED} />
    <Icon k="bulb" x={1220} y={860} s={1.6} col={tt > 3.0 ? RED : GRN} />
    <Tag tt={tt} at={0.6} x={700} y={330} txt="BOCINA" col={TX} size={36} />
    <Tag tt={tt} at={0.6} x={1220} y={330} txt="LUCES ALTAS" col={TX} size={36} />
    <Tag tt={tt} at={3.4} x={960} y={1000} txt="LA FALLA SE MUDÓ = EL RELÉ ESTABA MALO" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 22:20 · EL CLIC: el dedo arriba del relé y la onda del clic ----
export const HClick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const hits = [1.6, 2.6, 3.6], c = hits.reduce((m, a) => Math.max(m, Math.exp(-Math.pow((tt - a) * 8, 2))), 0);
  return <>
    <Head tt={tt} kick="SI NO HAY OTRO IGUAL" title="TIENE QUE HACER CLIC" col={AMB} />
    <Relay x={960} y={600 + 6 * c} s={1.8} n="87" />
    <div style={{ position: "absolute", left: 860, top: 300 + 10 * c - (1 - phys(tt, 0.6, 6, 0.5)) * 200, width: 200, height: 160, borderRadius: "90px 90px 40px 40px", background: "linear-gradient(180deg,#c99a78,#a77a58)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    {hits.map((a, i) => { const k = cl((tt - a) / 0.6); return k <= 0 || k >= 1 ? null : <div key={i} style={{ position: "absolute", left: 960 - 160 - k * 200, top: 600 - 160 - k * 200, width: 320 + k * 400, height: 320 + k * 400, borderRadius: "50%", border: `5px solid rgba(242,180,60,${1 - k})` }} />; })}
    {hits.map((a, i) => <Tag key={i} tt={tt} at={a} x={1340 + i * 120} y={420 + i * 50} txt="clic" col={GRN} size={44} />)}
    <Tag tt={tt} at={4.2} x={960} y={980} txt="SIN CLIC: NO LE LLEGA LA ORDEN O ESTÁ MUERTO" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 22:55 · EL CORTO: el fusible nuevo se vuelve a quemar, la flecha da la vuelta y se busca ----
export const HShort: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #241310, #070708 72%)">{(tt) => {
  const sp = (a: number) => Math.exp(-Math.pow((tt - a) * 6, 2));
  return <>
    <Head tt={tt} kick="PUNTO 10" title="SE VUELVE A QUEMAR = HAY UN CORTO" col={RED} />
    {[0, 1, 2].map((i) => <Fuse key={i} x={440 + i * 220} y={560} s={1.2 * phys(tt, 0.4 + i * 0.9, 7, 0.45)} amp="15" blown={tt > 0.9 + i * 0.9 ? 1 : 0} />)}
    <Wire d="M1100 500 C 1300 420, 1500 560, 1700 480" tt={tt} col="#c0392b" w={14} />
    <Wire d="M1100 640 C 1300 700, 1460 520, 1700 620" tt={tt} col="#2f6fe0" w={14} />
    <div style={{ position: "absolute", left: 1380, top: 470, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,#fffbe0,rgba(255,200,60,.5) 35%,transparent 70%)", opacity: Math.max(sp(1.0), sp(1.9), sp(2.8)) }} />
    <Tag tt={tt} at={3.2} x={1450} y={760} txt="DOS CABLES PELADOS QUE SE TOCAN" col={AMB} size={32} />
    <Big x={960} y={930} txt="SE BUSCA, NO SE TAPA" s={phys(tt, 3.8, 6, 0.5)} col={GRN} size={72} />
  </>;
}}</Stage>;

// ---- 24:30 · LOS 3 CASOS: tres fichas del taller que caen con su sello ----
export const HCases: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const C = [["wiper", "LA SEÑORA", "EL LIMPIA · VIDRIO CONGELADO", "FUSIBLE 20"], ["usb", "EL MUCHACHO", "EL USB · CARGADOR EN CORTO", "FUSIBLE 10"], ["brake", "EL CAMIONCITO", "LUCES DE FRENO", "EL INTERRUPTOR"]];
  return <>
    <Head tt={tt} kick="LA ÚLTIMA SEMANA" title="3 CASOS DEL TALLER" col={AMB} />
    {C.map(([k, who, what, sol], i) => { const s = phys(tt, 0.6 + i * 0.7, 6.5, 0.45), st = cl((tt - 3.2 - i * 0.35) / 0.25);
      return <div key={i} style={{ position: "absolute", left: 190 + i * 540, top: 300 - (1 - s) * 400, width: 480, height: 600, borderRadius: 18, background: "#f3eedf", color: "#2a2016", boxShadow: "0 40px 80px rgba(0,0,0,.55)", transform: `rotate(${(i - 1) * 3}deg)`, opacity: cl(s * 2) }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontWeight: 900, fontSize: 26, color: "#8a7458" }}>CASO {i + 1}</div>
        <Icon k={k} x={240} y={170} s={2} col="#2a2016" w={5} />
        <div style={{ position: "absolute", left: 30, right: 30, top: 270, fontWeight: 900, fontSize: 40 }}>{who}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 330, fontWeight: 700, fontSize: 30, color: "#5a4a3a" }}>{what}</div>
        <div style={{ position: "absolute", left: 60, top: 450, padding: "10px 22px", border: `5px solid ${i === 2 ? "#2a6ad0" : "#2a8a4a"}`, borderRadius: 10, color: i === 2 ? "#2a6ad0" : "#2a8a4a", fontWeight: 900, fontSize: 34, transform: `rotate(-8deg) scale(${1.6 - 0.6 * st})`, opacity: st }}>{sol}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 26:50 · LA BOLSITA DE LA GUANTERA: las cosas caen adentro y cierra ----
export const HKit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const I = [["FUSIBLES SURTIDOS", 0.6], ["LA PINZA", 1.3], ["LA LÁMPARA DE PRUEBA", 2.0], ["UNA LINTERNA", 2.7], ["FOTO DE LAS 2 TAPAS", 3.4]];
  const zip = eio(tt, 4.4, 5.0);
  return <>
    <Head tt={tt} kick="LO QUE LLEVO YO" title="LA BOLSITA DE LA GUANTERA" col={GRN} />
    <div style={{ position: "absolute", left: 760, top: 580, width: 800, height: 380, borderRadius: "30px 30px 60px 60px", background: "linear-gradient(180deg,#2c3a4a,#1a2430)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 20, top: -6, width: 760 * zip, height: 14, borderRadius: 7, background: METALC }} /></div>
    {I.map(([l, a], i) => { const k = eio(tt, a as number, (a as number) + 0.6); return <div key={i}>
      {i === 0 && <Fuse x={900} y={300 + 380 * k} s={0.8} amp="10" op={1 - 0.8 * cl(k * 1.2 - 0.2)} />}
      {i === 1 && <div style={{ position: "absolute", left: 1060, top: 280 + 380 * k, width: 30, height: 180, borderRadius: 10, background: "#efeee8", opacity: 1 - 0.8 * cl(k * 1.2 - 0.2) }} />}
      {i === 2 && <div style={{ position: "absolute", left: 1200, top: 540 + 380 * k, opacity: 1 - 0.8 * cl(k * 1.2 - 0.2) }}><TestLamp x={0} y={0} s={0.5} cable={false} /></div>}
      {i === 3 && <div style={{ position: "absolute", left: 1320, top: 280 + 380 * k, width: 60, height: 200, borderRadius: 14, background: "linear-gradient(90deg,#222,#555,#222)", opacity: 1 - 0.8 * cl(k * 1.2 - 0.2) }} />}
      {i === 4 && <div style={{ position: "absolute", left: 1420, top: 280 + 380 * k, width: 120, height: 180, borderRadius: 12, background: "#111", border: "4px solid #333", opacity: 1 - 0.8 * cl(k * 1.2 - 0.2) }} />}
      <Tag tt={tt} at={a as number} x={140} y={300 + i * 70} txt={`${i + 1}. ${l}`} col={TX} size={32} anchor="l" />
    </div>; })}
    <Tag tt={tt} at={4.8} x={960} y={1010} txt="DEL TAMAÑO DE UNA BILLETERA" col={GRN} size={40} />
  </>;
}}</Stage>;
const METALC = "linear-gradient(90deg,#8d939a,#e9edf1 45%,#9aa1a8)";

// ---- 27:40 · LOS FUSIBLES VIEJOS: el de vidrio, el de cerámica y el de cuchilla, la misma regla ----
export const HOld: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 46%, #2a2418, #070708 72%)">{(tt) => {
  const a = phys(tt, 0.6, 6, 0.5), b = phys(tt, 1.4, 6, 0.5), c = phys(tt, 2.2, 6, 0.5);
  return <>
    <Head tt={tt} kick="AUTOS DE LOS 70 Y 80" title="OTRA FORMA · LA MISMA REGLA" col={AMB} />
    <div style={{ position: "absolute", left: 300, top: 520, width: 360, height: 90, transform: `scale(${a})`, opacity: cl(a * 2) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 70, height: 90, borderRadius: 8, background: "linear-gradient(180deg,#e9edf1,#9aa1a8)" }} /><div style={{ position: "absolute", left: 290, top: 0, width: 70, height: 90, borderRadius: 8, background: "linear-gradient(180deg,#e9edf1,#9aa1a8)" }} />
      <div style={{ position: "absolute", left: 60, top: 10, width: 240, height: 70, borderRadius: 30, background: "rgba(220,240,255,.25)", border: "3px solid rgba(255,255,255,.5)" }} />
      <div style={{ position: "absolute", left: 70, top: 43, width: tt > 3.6 ? 90 : 220, height: 4, background: "#ddd" }} />{tt > 3.6 && <div style={{ position: "absolute", left: 200, top: 43, width: 90, height: 4, background: "#ddd" }} />}
    </div>
    <div style={{ position: "absolute", left: 800, top: 500, width: 140, height: 220, borderRadius: 20, background: "linear-gradient(90deg,#f2efe8,#d8d2c6)", transform: `scale(${b})`, opacity: cl(b * 2) }}><div style={{ position: "absolute", left: 50, top: 0, width: 40, height: 220, background: METALC }} /></div>
    <Fuse x={1380} y={600} s={1.4 * c} amp="15" />
    <Tag tt={tt} at={1.0} x={480} y={720} txt="VIDRIO" col={TX} size={36} />
    <Tag tt={tt} at={1.8} x={870} y={790} txt="CERÁMICA" col={TX} size={36} />
    <Tag tt={tt} at={2.6} x={1380} y={790} txt="CUCHILLA" col={TX} size={36} />
    <Big x={960} y={950} txt="1975 = HOY · MISMO NÚMERO" s={phys(tt, 4.2, 6, 0.5)} col={GRN} size={60} />
  </>;
}}</Stage>;

// ---- 28:30 · LOS 10 QUE MÁS SE QUEMAN: escalera de íconos que se ordenan ----
export const HTop10: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const K = [["plug", "ENCENDEDOR · 12 V"], ["radio", "RADIO"], ["bulb", "LUCES DE ADENTRO"], ["wiper", "LIMPIAPARABRISAS"], ["horn", "BOCINA"], ["defrost", "DESEMPAÑADOR"], ["brake", "LUCES DE FRENO"], ["window", "VIDRIOS"], ["fan", "CALEFACCIÓN"], ["usb", "USB · AUTOS NUEVOS"]];
  return <>
    <Head tt={tt} kick="EMPEZÁ POR ACÁ" title="LOS 10 QUE MÁS SE QUEMAN" col={AMB} />
    {K.map(([k, l], i) => { const s = phys(tt, 0.5 + i * 0.28, 7, 0.5), c = i % 2, r = Math.floor(i / 2);
      return <div key={i} style={{ position: "absolute", left: 200 + c * 800, top: 230 + r * 160 - (1 - s) * 120, width: 720, height: 130, borderRadius: 20, background: i === 0 ? "rgba(242,180,60,.2)" : "rgba(0,0,0,.4)", border: `2px solid ${i === 0 ? AMB : "rgba(255,255,255,.12)"}`, opacity: cl(s * 2) }}>
        <div style={{ position: "absolute", left: 24, top: 20, fontWeight: 900, fontSize: 70, color: i < 3 ? AMB : TX, width: 100 }}>{i + 1}</div>
        <Icon k={k} x={190} y={65} s={1} col={TX} />
        <div style={{ position: "absolute", left: 260, top: 42, fontWeight: 800, fontSize: 38 }}>{l}</div>
      </div>; })}
  </>;
}}</Stage>;
