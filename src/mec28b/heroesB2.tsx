// componentes únicos de mec28b · segunda mitad (las luces de noche, la herradura, los dos sistemas, el reset, la presión correcta, el clavo,
// el limitador, las multas, el puente con hielo, el vaso en el techo, el modo eco, la rampa, los COLORES, el que parpadea, los rojos,
// la cuenta del motor fundido, la prueba de lamparitas y la cinta sobre el testigo).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, Mark, rnd } from "./mkit";
import { BLUE, CarTop, Dial, LCOL, Lamp, Pedal, Screen, WIcon, Wheel } from "./dkit";

// ---- 12:50 · TABLERO PRENDIDO ≠ LUCES PRENDIDAS: el tablero brilla, los faros apagados; mira el testigo verde ----
export const HNoLights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #0b1220, #020203 72%)">{(tt) => {
  const fix = eio(tt, 3.8, 4.4);
  return <>
    <Head tt={tt} kick="DE NOCHE" title="EL TABLERO SE PRENDE SOLO" col={ICE} />
    <Dial x={560} y={600} r={210} v={0.3} n={6} glow={1} />
    <CarTop x={1340} y={620} s={0.9} rot={-90} side={1} />
    {[-1, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: 1520, top: 590 + sd * 60, width: 360, height: 80, background: `linear-gradient(90deg, rgba(255,240,190,${0.7 * fix}), transparent)`, transform: `skewY(${sd * 8}deg)` }} />)}
    <Tag tt={tt} at={1.2} x={1600} y={420} txt="FAROS: APAGADOS" col={RED} size={34} />
    <Lamp k="high" x={560} y={920} col={GRN} on={fix} s={0.8} label="MIRA ESTE" />
  </>;
}}</Stage>;

// ---- 13:45 · LA HERRADURA: el dibujito se dibuja trazo a trazo y aparece el signo de admiración ----
export const HTpmsIcon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = eio(tt, 0.6, 3.0), on = tt > 3.0 ? 1 : 0;
  return <>
    <Head tt={tt} kick="FUNCIÓN 4" title="EL TESTIGO DE LOS NEUMÁTICOS" col={AMB} />
    <svg viewBox="-60 -60 120 120" style={{ position: "absolute", left: 660, top: 280, width: 600, height: 600, overflow: "visible", filter: on ? `drop-shadow(0 0 30px ${LCOL.amber})` : "none" }}>
      <path d="M-34 -32 q-14 32 0 64 h68 q14 -32 0 -64" stroke={on ? LCOL.amber : TX} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={260} strokeDashoffset={260 * (1 - d)} />
      <path d="M-34 32 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7 l8 -7 l8 7" stroke={on ? LCOL.amber : TX} strokeWidth={5} fill="none" strokeLinecap="round" opacity={eio(tt, 2.2, 2.8)} />
      <path d="M0 -20 v22 M0 12 v3" stroke={on ? LCOL.amber : TX} strokeWidth={7} strokeLinecap="round" opacity={eio(tt, 2.6, 3.0)} />
    </svg>
    <Tag tt={tt} at={1.4} x={460} y={520} txt="UNA HERRADURA" col={TX} size={36} />
    <Tag tt={tt} at={2.3} x={1480} y={760} txt="EL ZIGZAG = EL DIBUJO" col={TX} size={34} />
    <Tag tt={tt} at={3.4} x={960} y={960} txt="UNA RUEDA TIENE MENOS PRESIÓN" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 14:20 · DOS SISTEMAS: el sensor adentro de la rueda vs la rueda baja que gira más rápido ----
export const HTwoSys: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s1 = phys(tt, 0.5, 6, 0.5), s2 = phys(tt, 2.2, 6, 0.5);
  return <>
    <Head tt={tt} kick="TU AUTO TIENE UNO U OTRO" title="DOS SISTEMAS DISTINTOS" col={ICE} />
    <div style={{ position: "absolute", left: 0, top: 0, opacity: cl(s1 * 2) }}>
      <Wheel x={520} y={600} r={200} ang={tt * 40} />
      <div style={{ position: "absolute", left: 600, top: 470, width: 46, height: 30, borderRadius: 8, background: ICE, boxShadow: `0 0 40px ${ICE}`, opacity: 0.6 + 0.4 * Math.sin(tt * 6) }} />
      <Tag tt={tt} at={1.0} x={520} y={870} txt="1 · DIRECTO: UN SENSOR EN CADA RUEDA" col={ICE} size={32} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, opacity: cl(s2 * 2) }}>
      <Wheel x={1260} y={600} r={150} ang={tt * 60} />
      <Wheel x={1600} y={606} r={144} ang={tt * 66} low={1} />
      <Tag tt={tt} at={2.8} x={1430} y={870} txt="2 · INDIRECTO: LA BAJA GIRA MÁS RÁPIDO" col={AMB} size={32} />
    </div>
  </>;
}}</Stage>;

// ---- 15:05 · EL RESET: inflas las 4 → dejas apretado → el auto aprende manejando ----
export const HLearn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S: [string, string][] = [["1", "INFLAS LAS 4"], ["2", "DEJAS APRETADO"], ["3", "MANEJAS Y APRENDE"]];
  return <>
    <Head tt={tt} kick="EL TRUCO QUE NADIE TE DICE" title="AVÍSALE AL AUTO" col={GRN} />
    {S.map(([n, l], i) => { const s = phys(tt, 0.6 + i * 1.2, 7, 0.5);
      return <div key={n} style={{ position: "absolute", left: 300 + i * 560, top: 440, width: 420, height: 380, borderRadius: 30, background: "rgba(0,0,0,.4)", border: `3px solid ${i === 2 ? GRN : "rgba(255,255,255,.15)"}`, transform: `translateY(${(1 - s) * 200}px)`, opacity: cl(s * 2) }}>
        <div style={{ position: "absolute", left: 30, top: 20, fontWeight: 900, fontSize: 90, color: AMB }}>{n}</div>
        {i === 0 && <div style={{ position: "absolute", left: 120, top: 120, display: "grid", gridTemplateColumns: "80px 80px", gap: 20 }}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ width: 80, height: 80, borderRadius: "50%", background: "#1a1b1d", border: `6px solid ${tt > 1.4 + k * 0.25 ? GRN : "#3a3d42"}` }} />)}</div>}
        {i === 1 && <WIcon k="tpms" x={210} y={190} s={1.4} col={tt > 3.2 ? LCOL.amber : TX} op={tt > 3.2 ? (Math.sin(tt * 8) > 0 ? 1 : 0.3) : 1} />}
        {i === 2 && <div style={{ position: "absolute", left: 60, top: 170, width: 300, height: 14, borderRadius: 7, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${100 * eio(tt, 3.4, 6)}%`, height: "100%", borderRadius: 7, background: GRN }} /></div>}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontWeight: 900, fontSize: 32, color: TX }}>{l}</div>
      </div>; })}
    <Tag tt={tt} at={4.8} x={960} y={960} txt="SIEMPRE DESPUÉS DE INFLAR · NUNCA ANTES" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 16:15 · LA PRESIÓN CORRECTA: la del costado del neumático (MAX) se tacha; la de la calcomanía de la puerta, sí ----
export const HMaxPress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <>
  <Head tt={tt} kick="¿CUÁL ES LA PRESIÓN?" title="NO ES LA DEL NEUMÁTICO" col={RED} />
  <div style={{ position: "absolute", left: 260, top: 360, width: 620, height: 520, borderRadius: 40, background: "radial-gradient(circle at 50% 50%, #2a2b2e 0 40%, #141517 41%)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `scale(${phys(tt, 0.4, 6, 0.5)})` }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontWeight: 900, fontSize: 40, color: "#8a8f96", letterSpacing: 4 }}>MAX. PRESS 44 PSI</div>
  </div>
  <Mark x={570} y={620} p={eio(tt, 1.8, 2.4)} s={220} />
  <div style={{ position: "absolute", left: 1060, top: 380, width: 600, height: 460, borderRadius: 16, background: "#f4f2ea", boxShadow: "0 40px 80px rgba(0,0,0,.6)", color: "#1d1d1d", padding: 34, boxSizing: "border-box", transform: `translateY(${(1 - phys(tt, 2.6, 6, 0.5)) * 400}px)`, opacity: cl(phys(tt, 2.6, 6, 0.5) * 2) }}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 2 }}>PRESIÓN DE NEUMÁTICOS</div>
    {[["ADELANTE", "32 PSI"], ["ATRÁS", "30 PSI"], ["CARGADO", "35 PSI"]].map(([a, b], i) => <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontSize: 40, fontWeight: 800, opacity: cl((tt - 3.2 - i * 0.3) * 3) }}><span>{a}</span><span style={{ color: "#1a7a3a" }}>{b}</span></div>)}
  </div>
  <Tag tt={tt} at={4.6} x={1360} y={920} txt="LA CALCOMANÍA DE LA PUERTA · EN FRÍO" col={GRN} size={34} />
</>}</Stage>;

// ---- 17:20 · EL CLAVO: la presión baja de a poquito, la inflan, vuelve a bajar… y aparece el clavito ----
export const HNail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const W = 1100, p = eio(tt, 0.5, 4.5);
  const pts = Array.from({ length: 41 }, (_, i) => { const x = i / 40, cyc = (x * 4) % 1; return [x * W, 360 - 220 * (1 - cyc) * 0 - 200 * cyc]; });
  const path = pts.filter(([x]) => x <= p * W).map(([x, y], i) => `${i ? "L" : "M"}${x} ${y + 20}`).join(" ");
  return <>
    <Head tt={tt} kick="4 VECES A LA VULCANIZADORA" title="EL TESTIGO NO ESTABA LOCO" col={AMB} />
    <svg style={{ position: "absolute", left: 300, top: 360, width: W, height: 420, overflow: "visible" }}>
      <line x1={0} y1={380} x2={W} y2={380} stroke="rgba(255,255,255,.2)" strokeWidth={3} />
      <path d={path} stroke={AMB} strokeWidth={8} fill="none" strokeLinejoin="round" />
      {[0, 1, 2, 3].map((k) => <text key={k} x={k * W / 4 + 10} y={0} fill={GRN} fontSize={28} fontWeight={900} fontFamily="sans-serif" opacity={p > k / 4 ? 1 : 0}>INFLADO</text>)}
    </svg>
    <div style={{ position: "absolute", left: 1500, top: 420, width: 300, height: 300, borderRadius: "50%", background: "repeating-conic-gradient(#1c1d1f 0 10deg, #2a2b2e 10deg 20deg)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: `scale(${phys(tt, 4.4, 6, 0.5)})` }}>
      <div style={{ position: "absolute", left: 140, top: 120, width: 16, height: 70, background: "linear-gradient(90deg,#8a8f96,#e0e4e8,#8a8f96)", borderRadius: 4, transform: "rotate(30deg)" }} />
    </div>
    <Tag tt={tt} at={5.0} x={1650} y={780} txt="UN CLAVITO DE PUNTA" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 18:20 · CRUCERO vs LIMITADOR: un pie se va del pedal y el auto sigue; el otro pisa y la aguja se clava en 40 ----
export const HLimiter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const push = eio(tt, 2.6, 4.0), v = Math.min(0.2, 0.05 + 0.3 * push);
  return <>
    <Head tt={tt} kick="FUNCIÓN 5 · NO ES LO MISMO" title="CRUCERO vs LIMITADOR" col={GRN} />
    <Dial x={520} y={580} r={190} v={0.42} n={6} labels={["0", "40", "80", "120", "160", "200", "240"]} />
    <Pedal x={520} y={1000} press={0.05} s={0.7} />
    <Tag tt={tt} at={1.0} x={520} y={330} txt="CRUCERO: SACAS EL PIE" col={ICE} size={32} />
    <Dial x={1380} y={580} r={190} v={v} n={6} labels={["0", "40", "80", "120", "160", "200", "240"]} col={push > 0.6 ? GRN : "#ff4a2a"} />
    <Pedal x={1380} y={1000} press={push} s={0.7} />
    <Tag tt={tt} at={2.4} x={1380} y={330} txt="LIMITADOR: PISAS Y NO PASA" col={GRN} size={32} />
    <Big x={1380} y={830} txt="40" s={phys(tt, 4.0, 6, 0.5)} col={GRN} size={70} sub="LIM" />
  </>;
}}</Stage>;

// ---- 20:00 · LAS MULTAS: tres papeles que se apilan y a los seis meses: cero ----
export const HFines: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const gone = eio(tt, 3.8, 4.6);
  return <>
    <Head tt={tt} kick="UN TAXISTA" title="3 MULTAS EN UN MES" col={RED} />
    {[0, 1, 2].map((i) => { const s = phys(tt, 0.5 + i * 0.5, 7, 0.45);
      return <div key={i} style={{ position: "absolute", left: 640 + i * 60, top: 380 + i * 40, width: 420, height: 300, borderRadius: 10, background: "#f4efe2", boxShadow: "0 20px 50px rgba(0,0,0,.5)", transform: `translateY(${(1 - s) * -400 + gone * 700}px) rotate(${(rnd(i) - 0.5) * 12 + gone * 40}deg)`, opacity: cl(s * 2) * (1 - gone), color: "#7a1a14", padding: 26, boxSizing: "border-box", fontWeight: 900, fontSize: 34 }}>EXCESO DE VELOCIDAD<div style={{ color: "#3a3a3a", fontSize: 26, marginTop: 14 }}>AV. · 58 km/h EN ZONA 40</div></div>; })}
    <Big x={1500} y={560} txt="6 MESES DESPUÉS" s={phys(tt, 4.2, 6, 0.5)} col={DIM} size={44} />
    <Big x={1500} y={700} txt="0 MULTAS" s={phys(tt, 4.8, 6, 0.45)} col={GRN} size={110} />
  </>;
}}</Stage>;

// ---- 20:50 · EL PUENTE: aire frío por arriba y por abajo; el sensor marca 3 °C y el asfalto del puente ya está bajo cero ----
export const HBridge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 70% 60% at 50% 46%, #0e1620, #040506 72%)">{(tt) => {
  const ice = eio(tt, 2.6, 4.2);
  return <>
    <Head tt={tt} kick="FUNCIÓN 6 · EL COPITO" title="EL PUENTE SE CONGELA PRIMERO" col={ICE} />
    <div style={{ position: "absolute", left: 200, top: 640, width: 500, height: 40, background: "#3a3d42" }} />
    <div style={{ position: "absolute", left: 1220, top: 640, width: 500, height: 40, background: "#3a3d42" }} />
    <div style={{ position: "absolute", left: 700, top: 630, width: 520, height: 30, background: `linear-gradient(90deg, #4a5058, rgba(200,235,255,${0.85 * ice}), #4a5058)`, boxShadow: `0 0 ${50 * ice}px rgba(180,230,255,${0.5 * ice})` }} />
    {[760, 1160].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 660, width: 30, height: 280, background: "#2a2d31" }} />)}
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.25 + rnd(i)) % 1, up = i % 2; return <div key={i} style={{ position: "absolute", left: 700 + ph * 520, top: up ? 560 - 20 * Math.sin(ph * 6) : 720 + 30 * Math.sin(ph * 5), width: 40, height: 4, borderRadius: 2, background: ICE, opacity: 0.6 * Math.sin(Math.PI * ph) }} />; })}
    <Screen x={460} y={360} w={340} h={170} title="AFUERA" val="3 °C" />
    <WIcon k="snow" x={650} y={360} s={0.8} col={ICE} op={Math.sin(tt * 5) > 0 ? 1 : 0.3} />
    <Big x={960} y={480} txt="−1 °C" s={phys(tt, 3.0, 6, 0.5)} col={ICE} size={80} sub="EL ASFALTO DEL PUENTE" />
  </>;
}}</Stage>;

// ---- 21:30 · EL VASO EN EL TECHO: el agua se derrama con el volantazo y no con el manejo suave ----
export const HGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const jerk = tt > 3.6 ? Math.sin((tt - 3.6) * 9) * 18 * Math.exp(-(tt - 3.6) * 0.8) : 0, smooth = Math.sin(tt * 1.4) * 3;
  const G: React.FC<{ x: number; tilt: number; spill: number }> = ({ x, tilt, spill }) => <div style={{ position: "absolute", left: x, top: 470, width: 0, height: 0, transform: `rotate(${tilt}deg)` }}>
    <div style={{ position: "absolute", left: -70, top: -180, width: 140, height: 180, borderRadius: "6px 6px 22px 22px", border: "5px solid rgba(220,240,255,.7)", overflow: "hidden" }}><div style={{ position: "absolute", left: -30, right: -30, bottom: 0, height: `${80 - 30 * spill}%`, background: "rgba(120,190,255,.55)", transform: `rotate(${-tilt * 1.6}deg)` }} /></div>
    {spill > 0.05 && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 12, top: -170 + (tt * 300 + i * 40) % 260, width: 12, height: 12, borderRadius: "50%", background: "rgba(120,190,255,.7)" }} />)}
  </div>;
  return <>
    <Head tt={tt} kick="CON EL COPITO PRENDIDO" title="MANEJA COMO CON UN VASO EN EL TECHO" col={ICE} />
    <CarTop x={600} y={650} s={0.9} rot={-90} />
    <G x={600} tilt={smooth} spill={0} />
    <Tag tt={tt} at={1.0} x={600} y={900} txt="TODO SUAVE" col={GRN} size={40} />
    <CarTop x={1320} y={650} s={0.9} rot={-90} />
    <G x={1320} tilt={jerk} spill={tt > 3.6 ? 1 : 0} />
    <Tag tt={tt} at={3.6} x={1320} y={900} txt="DE GOLPE" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 22:45 · EL MODO ECO: la curva del pedal; normal sube rápido, eco sube suave ----
export const HEcoPedal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 0.6, 3.4), W = 900, Hh = 460;
  const curve = (k: number) => Array.from({ length: 31 }, (_, i) => { const x = i / 30; return `${i ? "L" : "M"}${x * W * p} ${Hh - Hh * Math.pow(x * p, k)}`; }).join(" ");
  return <>
    <Head tt={tt} kick="FUNCIÓN 7" title="EL ECO NO CAMBIA EL MOTOR" col={GRN} />
    <svg style={{ position: "absolute", left: 340, top: 360, width: W, height: Hh, overflow: "visible" }}>
      <line x1={0} y1={Hh} x2={W} y2={Hh} stroke="rgba(255,255,255,.3)" strokeWidth={3} /><line x1={0} y1={0} x2={0} y2={Hh} stroke="rgba(255,255,255,.3)" strokeWidth={3} />
      <path d={curve(0.6)} stroke={AMB} strokeWidth={8} fill="none" />
      <path d={curve(1.8)} stroke={GRN} strokeWidth={8} fill="none" />
      <text x={W - 10} y={Hh + 50} fill={DIM} fontSize={28} fontWeight={800} textAnchor="end" fontFamily="sans-serif">CUÁNTO PISAS</text>
    </svg>
    <Tag tt={tt} at={2.0} x={1440} y={420} txt="NORMAL" col={AMB} size={40} />
    <Tag tt={tt} at={2.6} x={1440} y={640} txt="ECO: MÁS SUAVE" col={GRN} size={40} />
    <Lamp k="leaf" x={1500} y={880} col={GRN} on={eio(tt, 3, 3.5)} s={0.7} />
  </>;
}}</Stage>;

// ---- 24:25 · LA RAMPA: el auto no sube con la hojita prendida; la apagas y sube como si nada ----
export const HRamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const off = tt > 3.4, p = off ? eio(tt, 3.6, 5.4) : 0.18 * Math.sin(Math.PI * cl(tt / 3.2));
  const x = 380 + 900 * p, y = 860 - 400 * p;
  return <>
    <Head tt={tt} kick="«ESTÁ SIN FUERZA»" title="NO SUBÍA LA RAMPA DEL GARAJE" col={AMB} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M300 900 L1340 440 L1700 440 L1700 980 L300 980 Z" fill="#3a3d42" /></svg>
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: "rotate(-24deg)" }}><CarTop x={0} y={-50} s={0.5} rot={90} col="#c0392b" /></div>
    <Lamp k="leaf" x={1560} y={260} col={GRN} on={off ? 0 : 1} s={0.9} label={off ? "ECO APAGADO" : "ECO PRENDIDO"} />
    <Tag tt={tt} at={5.2} x={960} y={1010} txt="NO LE COBRÉ · LE ENSEÑÉ A MIRAR LA HOJITA" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 25:00 · LA 8, EL PREMIO: la tabla de colores, columna por columna ----
export const HColorsTab: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 46%, #1a1410, #050506 72%)">{(tt) => {
  const C: [string, string, string, string][] = [["green", "VERDE", "leaf", "ESTÁ PRENDIDO LO QUE PEDISTE"], ["blue", "AZUL", "high", "LUZ ALTA · INFORMA"], ["amber", "AMARILLO", "engine", "REVISAR PRONTO"], ["red", "ROJO", "oil", "PARÁS Y APAGÁS"]];
  return <>
    <Head tt={tt} kick="FUNCIÓN 8 · LA MÁS IMPORTANTE" title="EL COLOR DEL TESTIGO" col={RED} />
    {C.map(([c, n, k, l], i) => { const s = phys(tt, 0.6 + i * 0.7, 7, 0.5);
      return <div key={c} style={{ position: "absolute", left: 210 + i * 390, top: 300, width: 340, height: 660, borderRadius: 30, background: `linear-gradient(180deg, ${LCOL[c]}26, rgba(0,0,0,.4))`, border: `3px solid ${LCOL[c]}88`, transform: `translateY(${(1 - s) * 500}px)`, opacity: cl(s * 2) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontWeight: 900, fontSize: 48, color: LCOL[c] }}>{n}</div>
        <Lamp k={k} x={170} y={260} col={LCOL[c]} on={cl(s)} s={1} />
        <div style={{ position: "absolute", left: 20, right: 20, top: 400, textAlign: "center", fontWeight: 900, fontSize: 34, lineHeight: 1.2, color: TX }}>{l}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 26:10 · EL QUE PARPADEA: fijo = en unos días; parpadeando = el catalizador se recalienta, ese mismo día ----
export const HBlink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #241a08, #070708 72%)">{(tt) => {
  const bl = Math.sin(tt * 7) > 0 ? 1 : 0.1, hot = eio(tt, 3.0, 5.0);
  return <>
    <Head tt={tt} kick="LA EXCEPCIÓN" title="EL MOTOR AMARILLO QUE PARPADEA" col={AMB} />
    <Lamp k="engine" x={480} y={540} col={LCOL.amber} on={1} s={1.4} label="FIJO · EN UNOS DÍAS" />
    <Lamp k="engine" x={960} y={540} col={LCOL.amber} on={bl} s={1.4} label="PARPADEA · HOY" />
    <div style={{ position: "absolute", left: 1300, top: 440, width: 420, height: 200, borderRadius: 100, background: `linear-gradient(90deg,#5a5e64, rgb(${90 + 165 * hot},${94 - 40 * hot},${100 - 70 * hot}), #5a5e64)`, boxShadow: `0 0 ${110 * hot}px rgba(255,90,30,${0.6 * hot})` }} />
    <Tag tt={tt} at={3.4} x={1510} y={720} txt="EL CATALIZADOR SE RECALIENTA" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 26:45 · LOS ROJOS: aceite, temperatura, freno, batería; cada uno con lo que se rompe ----
export const HReds: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #2a0a08, #070708 72%)">{(tt) => {
  const R: [string, string][] = [["oil", "ACEITE"], ["temp", "TEMPERATURA"], ["brake", "FRENO"], ["battery", "BATERÍA"]];
  return <>
    <Head tt={tt} kick="ROJO = PARAR" title="LOS 4 ROJOS QUE IMPORTAN" col={RED} />
    {R.map(([k, l], i) => { const s = phys(tt, 0.5 + i * 0.8, 7, 0.45);
      return <div key={k} style={{ position: "absolute", left: 330 + i * 420, top: 560, transform: `scale(${0.5 + 0.5 * s})`, opacity: cl(s * 2) }}><Lamp k={k} x={0} y={0} col={RED} on={cl((tt - 0.8 - i * 0.8) * 3)} s={1.3} label={l} /></div>; })}
    <Big x={960} y={900} txt="APAGAS · NO SIGUES" s={phys(tt, 4.4, 6, 0.5)} col={RED} size={64} />
  </>;
}}</Stage>;

// ---- 27:55 · LA CUENTA: 40 km con la lucecita = un motor; parar a tiempo = una junta y un litro de aceite ----
export const HMath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tilt = 16 * eio(tt, 3.4, 4.4);
  return <>
    <Head tt={tt} kick="UN MUCHACHO JOVEN · 40 KM MÁS" title="UNA LUCECITA ROJA = UN MOTOR" col={RED} />
    <div style={{ position: "absolute", left: 960, top: 380, width: 0, height: 0, transform: `rotate(${-tilt}deg)` }}>
      <div style={{ position: "absolute", left: -560, top: -8, width: 1120, height: 16, borderRadius: 8, background: "linear-gradient(90deg,#8d939a,#e9edf1 45%,#9aa1a8)" }} />
      <div style={{ position: "absolute", left: -520, top: 20, width: 340, height: 220, borderRadius: 20, background: "linear-gradient(180deg,#4a4f55,#2a2d31)", transform: `rotate(${tilt}deg)`, opacity: cl(phys(tt, 0.6, 6, 0.5) * 2), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 40, color: RED }}>MOTOR FUNDIDO</div>
      <div style={{ position: "absolute", left: 220, top: 20, width: 300, height: 140, transform: `rotate(${tilt}deg)`, opacity: cl(phys(tt, 2.0, 6, 0.5) * 2), display: "flex", gap: 16 }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", border: "16px solid #2a2a2a" }} />
        <div style={{ width: 90, height: 140, borderRadius: 12, background: "linear-gradient(180deg,#e8c04a,#a8801a)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 930, top: 380, width: 60, height: 520, background: "linear-gradient(90deg,#4a4d52,#8a9096,#4a4d52)", borderRadius: 10 }} />
    <Tag tt={tt} at={2.4} x={1330} y={680} txt="UNA JUNTA + 1 LITRO" col={GRN} size={36} />
    <Lamp k="oil" x={300} y={860} col={RED} on={Math.sin(tt * 4) > 0 ? 1 : 0.5} s={0.7} />
  </>;
}}</Stage>;

// ---- 28:35 · LA PRUEBA DE LAMPARITAS: al dar contacto se prenden todas 2 segundos… y una no prende ----
export const HBulbTest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const K: [string, string][] = [["oil", "red"], ["battery", "red"], ["brake", "red"], ["temp", "red"], ["engine", "amber"], ["tpms", "amber"], ["abs", "amber"], ["airbag", "red"], ["belt", "red"], ["glow", "amber"]];
  const on = tt > 1.0 && tt < 3.4 ? 1 : 0;
  return <>
    <Head tt={tt} kick="UN TRUCO MÁS · AL DAR CONTACTO" title="SE PRENDEN TODAS, UN PAR DE SEGUNDOS" col={AMB} />
    {K.map(([k, c], i) => { const miss = k === "engine"; return <Lamp key={k} k={k} x={330 + (i % 5) * 315} y={470 + Math.floor(i / 5) * 260} col={LCOL[c]} on={miss ? 0 : on} s={0.95} />; })}
    <div style={{ position: "absolute", left: 1500 - 330 + 330 - 95 + 0, top: 0, width: 0, height: 0 }} />
    <div style={{ position: "absolute", left: 1590 - 95 - 315 * 0, top: 375, width: 190, height: 190, borderRadius: 34, border: `6px solid ${RED}`, opacity: eio(tt, 3.6, 4.0) * (0.6 + 0.4 * Math.sin(tt * 6)) }} />
    <Tag tt={tt} at={4.0} x={960} y={950} txt="SI EL DEL MOTOR NO PRENDE NUNCA, ALGUIEN LO APAGÓ" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 31:00 · EL ERROR: la cinta negra que tapa el testigo; se despega y la luz sigue ahí ----
export const HTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const put = phys(tt, 0.6, 6, 0.5), peel = eio(tt, 3.2, 4.4);
  return <>
    <Head tt={tt} kick="ERROR 2" title="TAPAR EL TESTIGO CON CINTA" col={RED} />
    <Lamp k="engine" x={960} y={580} col={LCOL.amber} on={1} s={2} />
    <div style={{ position: "absolute", left: 960 - 200, top: 580 - 70, width: 400, height: 140, borderRadius: 8, background: "linear-gradient(180deg,#1b1b1d,#0d0d0e)", boxShadow: "0 10px 30px rgba(0,0,0,.6)", transformOrigin: "100% 50%", transform: `translateX(${(1 - put) * -900}px) rotate(${-55 * peel}deg) scaleX(${1 - 0.3 * peel})`, opacity: 1 - 0.2 * peel }} />
    <Tag tt={tt} at={4.6} x={960} y={900} txt="LA FALLA SIGUE · SÓLO DEJAS DE VERLA" col={RED} size={40} />
  </>;
}}</Stage>;
export { BLUE, Screen, Arrow, Big, Mark, HAND, ICE };
