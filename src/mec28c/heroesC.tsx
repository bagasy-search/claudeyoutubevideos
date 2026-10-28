// componentes únicos de mec28c · primera mitad (el giro, la 5 escondida, la insignia, la bomba de aire, el molino, las vueltas,
// el calor, los dos trabajos del aceite, la costra, el calor que queda, el minuto, el acelerón, el timer, la mañana fría,
// el camino del aceite, el desgaste por mañanas, los 400 m, la regla del frío, agua vs aceite y el intervalo del cambio).
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, Mark } from "./mkit";
import { Dial, Pedal } from "./dkit";
import { BarH, Blades, HOT, Jar, OIL, Ring, Thermo, TurboX } from "./tkit";

// ---- 0:23 · EL GIRO: la rueda del compresor acelera y el contador trepa hasta 150.000 vueltas por minuto ----
export const HRpm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #1a1410, #040404 72%)">{(tt) => {
  const v = eio(tt, 0.3, 4.2), ang = 60 * tt * tt * (0.4 + v);
  return <>
    <Head tt={tt} kick="HACE UN MINUTO" title="ESTO ESTABA GIRANDO ASÍ" col={HOT} />
    <Blades x={700} y={590} r={330} ang={ang} col="#d9dee3" blur={v} glow={0.3 * v} />
    <Big x={1430} y={540} txt={"+" + Math.round(100000 * v).toLocaleString("es-AR")} s={phys(tt, 0.4, 6, 0.6)} col={TX} size={150} sub="VUELTAS POR MINUTO" />
    <Tag tt={tt} at={3.6} x={1430} y={760} txt="AL LADO DE UN ESCAPE A +700 °C" col={HOT} size={42} />
  </>;
}}</Stage>;

// ---- 1:34 · LA QUINTA ESCONDIDA: cinco cartas se reparten, cuatro se dan vuelta, la 5 queda tapada con candado ----
export const HTeaser5: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = ["APAGAR EN CALIENTE", "EXIGIRLO EN FRÍO", "EL ACEITE", "LA MARCHA ALTA", "?"];
  return <>
    <Head tt={tt} kick="LAS 5 COSAS" title="LA 5 TE LA GUARDO" col={AMB} />
    {L.map((l, i) => { const s = phys(tt, 0.4 + i * 0.35, 7, 0.5), flip = i < 4 ? eio(tt, 1.6 + i * 0.4, 2.0 + i * 0.4) : 0;
      return <div key={i} style={{ position: "absolute", left: 170 + i * 330, top: 400, width: 280, height: 400, borderRadius: 24, transform: `translateY(${(1 - s) * 260}px) rotate(${(i - 2) * 3 * (1 - s)}deg) scaleX(${Math.abs(1 - 2 * flip) || 0.02})`, opacity: cl(s * 2),
        background: flip > 0.5 ? "linear-gradient(160deg,#f4efe4,#d9d1c0)" : `linear-gradient(160deg, ${i === 4 ? "#3a1d18" : "#262a30"}, #121417)`, boxShadow: `0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px ${i === 4 ? RED : "rgba(255,255,255,.12)"}` }}>
        <div style={{ position: "absolute", left: 24, top: 18, fontWeight: 900, fontSize: 80, color: flip > 0.5 ? "#2a2a2a" : AMB }}>{i + 1}</div>
        {flip > 0.5 && <div style={{ position: "absolute", left: 20, right: 20, bottom: 40, fontWeight: 900, fontSize: 34, lineHeight: 1.15, color: "#1d1d1d" }}>{l}</div>}
        {i === 4 && <svg viewBox="-50 -60 100 120" style={{ position: "absolute", left: 80, top: 130, width: 120, height: 150 }}>
          <path d="M-24 -10 v-18 a24 24 0 0 1 48 0 v18" stroke={RED} strokeWidth={9} fill="none" /><rect x={-36} y={-10} width={72} height={60} rx={10} fill={RED} /><circle cy={18} r={8} fill="#1a0c0a" />
        </svg>}
      </div>; })}
    <Tag tt={tt} at={4.4} x={1490} y={880} txt="AL FINAL · ES UN RUIDO" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 2:14 · ¿TIENE TURBO?: la lupa pasa por la tapa del motor y por el baúl y prende las tres insignias ----
export const HBadge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const B = ["TSI", "T", "TURBO"], lx = 300 + 1300 * eio(tt, 0.8, 4.2);
  return <>
    <Head tt={tt} kick="¿TU AUTO TIENE?" title="BUSCA ESTAS LETRAS" col={ICE} />
    <div style={{ position: "absolute", left: 200, top: 420, width: 1520, height: 320, borderRadius: 60, background: "linear-gradient(180deg,#2e3238,#16181b)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.08)" }} />
    {B.map((b, i) => { const x = 450 + i * 500, on = lx > x - 60 ? phys(tt, 0.8 + (x - 300) / 1300 * 3.4, 7, 0.45) : 0;
      return <div key={b} style={{ position: "absolute", left: x, top: 580, transform: `translate(-50%,-50%) scale(${0.8 + 0.25 * cl(on)})`, padding: "18px 40px", borderRadius: 16, background: STEELBG, boxShadow: `0 0 ${70 * cl(on)}px rgba(140,210,255,${0.6 * cl(on)}), 0 20px 40px rgba(0,0,0,.6)`, fontWeight: 900, fontSize: 90, letterSpacing: 6, color: on > 0.3 ? "#0e1a26" : "#4a5058", fontStyle: "italic" }}>{b}</div>; })}
    <svg viewBox="-80 -80 160 160" style={{ position: "absolute", left: lx - 110, top: 420, width: 220, height: 220, overflow: "visible", opacity: cl(tt * 2) * (1 - eio(tt, 4.4, 4.8)) }}>
      <circle r={52} fill="rgba(160,215,255,.12)" stroke={TX} strokeWidth={9} /><line x1={38} y1={38} x2={78} y2={78} stroke={TX} strokeWidth={14} strokeLinecap="round" />
    </svg>
    <Tag tt={tt} at={4.6} x={960} y={880} txt="SI DICE ALGUNA → TIENES TURBO" col={GRN} size={44} />
  </>;
}}</Stage>;
const STEELBG = "linear-gradient(180deg,#f2f5f8,#9aa2ab 55%,#d7dce1)";

// ---- 3:02 · UNA BOMBA DE AIRE: entra aire por un lado, sale humo por el otro; más aire = más fuerza ----
export const HPump: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const st = Math.sin(tt * 5), pist = 60 * st;
  return <>
    <Head tt={tt} kick="LO BÁSICO" title="EL MOTOR RESPIRA" col={AMB} />
    <div style={{ position: "absolute", left: 790, top: 330, width: 340, height: 520, borderRadius: 30, background: "linear-gradient(90deg,#3a3f45,#5c626a 50%,#3a3f45)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 260, height: 440, borderRadius: 18, background: "#0f1113" }} />
      <div style={{ position: "absolute", left: 50, top: 210 + pist, width: 240, height: 120, borderRadius: 14, background: "linear-gradient(180deg,#c9ced4,#7d848c)" }} />
      <div style={{ position: "absolute", left: 155, top: 330 + pist, width: 30, height: 200, borderRadius: 15, background: "#6a7078" }} />
    </div>
    {Array.from({ length: 5 }, (_, i) => { const p = (tt * 0.8 + i / 5) % 1; return <div key={"a" + i} style={{ position: "absolute", left: 320 + p * 440, top: 420, width: 90, height: 18, borderRadius: 9, background: `rgba(140,210,255,${0.9 * (1 - p)})`, opacity: cl(tt - 0.6) }} />; })}
    {Array.from({ length: 5 }, (_, i) => { const p = (tt * 0.8 + i / 5) % 1; return <div key={"g" + i} style={{ position: "absolute", left: 1170 + p * 440, top: 420 + p * 40, width: 70 + p * 60, height: 40 + p * 40, borderRadius: "50%", background: `rgba(120,110,105,${0.7 * (1 - p)})`, opacity: cl(tt - 1.2) }} />; })}
    <Tag tt={tt} at={0.9} x={460} y={350} txt="ENTRA AIRE" col={ICE} size={40} />
    <Tag tt={tt} at={1.5} x={1460} y={350} txt="SALE HUMO CALIENTE" col={HOT} size={40} />
    <Tag tt={tt} at={3.2} x={960} y={950} txt="MÁS AIRE ADENTRO = MÁS FUERZA" col={AMB} size={48} />
  </>;
}}</Stage>;

// ---- 3:43 · EL MOLINO: el humo mueve la turbina, el eje arrastra al compresor que mete aire a presión ----
export const HWindmill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => (<>
  <Head tt={tt} kick="DOS VENTILADORES Y UN EJE" title="EL TURBO POR DENTRO" col={HOT} />
  <TurboX x={960} y={600} s={0.95} tt={tt} spin={eio(tt, 0.5, 2.5)} hot={0.7} oil={1} gas={eio(tt, 0.3, 1.2)} air={eio(tt, 2.2, 3.2)} labels={eio(tt, 3.0, 3.6)} />
  <Tag tt={tt} at={1.0} x={420} y={920} txt="EL HUMO LA HACE GIRAR" col={HOT} size={36} />
  <Tag tt={tt} at={2.4} x={1500} y={920} txt="ESTA METE AIRE A PRESIÓN" col={ICE} size={36} />
  <Tag tt={tt} at={4.4} x={960} y={1010} txt="USA LA BASURA DEL MOTOR" col={AMB} size={40} />
</>)}</Stage>;

// ---- 4:19 · LAS VUELTAS: el motor a 2.500 contra el turbo a 150.000; la barra del turbo se sale de la pantalla ----
export const HRpmCmp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => (<>
  <Head tt={tt} kick="NÚMERO 1" title="LAS VUELTAS" col={AMB} />
  <BarH x={180} y={420} w={30} p={eio(tt, 0.5, 1.2)} col={ICE} label="TU MOTOR EN LA RUTA" val="2.000–3.000" />
  <BarH x={180} y={650} w={1360} p={eio(tt, 1.6, 4.0)} col={HOT} label="EL TURBO" val={tt > 3.9 ? "150.000" : ""} />
  <Tag tt={tt} at={4.4} x={960} y={950} txt="UNAS 50 VECES MÁS RÁPIDO" col={TX} size={52} />
</>)}</Stage>;

// ---- 4:45 · EL CALOR: el termómetro de la turbina pasa al horno de la cocina y sigue de largo ----
export const HHeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #241008, #050303 72%)">{(tt) => {
  const v = eio(tt, 0.6, 3.6);
  return <>
    <Head tt={tt} kick="NÚMERO 2" title="LA TEMPERATURA" col={HOT} />
    <Thermo x={760} y={860} h={560} v={v} val={`${Math.round(900 * v)} °C`} />
    <div style={{ position: "absolute", left: 640, top: 860 - 560 * (250 / 900) - 2, width: 260, height: 4, background: "rgba(255,255,255,.5)" }} />
    <Tag tt={tt} at={1.4} x={1180} y={860 - 560 * (250 / 900)} txt="EL HORNO DE TU COCINA" col={DIM} size={30} anchor="l" />
    <Tag tt={tt} at={3.8} x={1180} y={430} txt="+800 · 900 EN ALGUNOS" col={HOT} size={44} anchor="l" />
    <Tag tt={tt} at={4.6} x={1180} y={520} txt="DE NOCHE SE VE BRILLAR ROJA" col={AMB} size={34} anchor="l" />
  </>;
}}</Stage>;

// ---- 5:31 · LOS DOS TRABAJOS DEL ACEITE: 1 el eje flota sobre una película · 2 se lleva el calor ----
export const HOilJobs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.5, 6, 0.5), b = phys(tt, 2.4, 6, 0.5), ang = tt * 700;
  return <>
    <Head tt={tt} kick="EL ACEITE HACE" title="DOS TRABAJOS A LA VEZ" col={OIL} />
    <div style={{ position: "absolute", left: 160, top: 300, width: 740, height: 600, borderRadius: 34, background: "rgba(0,0,0,.4)", border: `3px solid ${OIL}`, opacity: cl(a * 2), transform: `translateY(${(1 - a) * 160}px)` }}>
      <div style={{ position: "absolute", left: 30, top: 20, fontWeight: 900, fontSize: 80, color: OIL }}>1</div>
      <div style={{ position: "absolute", left: 120, top: 210, width: 500, height: 190, borderRadius: 95, background: `rgba(224,169,58,${0.3 + 0.1 * Math.sin(tt * 8)})`, boxShadow: `0 0 50px ${OIL}` }} />
      <div style={{ position: "absolute", left: 150, top: 262, width: 440, height: 86, borderRadius: 43, background: "linear-gradient(180deg,#e6eaee,#7d848c 55%,#b0b6bd)", backgroundSize: "60px 100%", backgroundPositionX: `${ang}px` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontWeight: 900, fontSize: 40, color: TX }}>EL EJE FLOTA · NO TOCA METAL</div>
    </div>
    <div style={{ position: "absolute", left: 1020, top: 300, width: 740, height: 600, borderRadius: 34, background: "rgba(0,0,0,.4)", border: `3px solid ${ICE}`, opacity: cl(b * 2), transform: `translateY(${(1 - b) * 160}px)` }}>
      <div style={{ position: "absolute", left: 30, top: 20, fontWeight: 900, fontSize: 80, color: ICE }}>2</div>
      <Thermo x={300} y={460} h={300} v={1 - 0.6 * eio(tt, 3.0, 5.4)} val="" />
      {Array.from({ length: 6 }, (_, i) => { const p = (tt * 0.7 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 420 + p * 260, top: 200 + i * 40, width: 60, height: 14, borderRadius: 7, background: `rgba(255,140,60,${(1 - p) * cl(b)})` }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontWeight: 900, fontSize: 40, color: TX }}>SE LLEVA EL CALOR</div>
    </div>
  </>;
}}</Stage>;

// ---- 7:05 · LA COSTRA: el aceite dorado se oscurece gota a gota hasta hacerse carbón (coquizado) ----
export const HCrust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.6, 4.0), c = (a: string, b: string) => `color-mix(in srgb, ${b} ${Math.round(100 * k)}%, ${a})`;
  return <>
    <Head tt={tt} kick="LO QUE VI EN LA MESA" title="ESO NO ERA ACEITE" col={RED} />
    {[0, 1, 2, 3].map((i) => { const kk = cl(k * 1.6 - i * 0.25); return <div key={i} style={{ position: "absolute", left: 300 + i * 360, top: 420, width: 260, height: 260, borderRadius: i < 2 ? "50% 50% 46% 54%" : "34% 50% 40% 46%", background: kk < 0.5 ? `radial-gradient(circle at 35% 30%, #ffe6a0, ${OIL} 60%, #8a5a10)` : `radial-gradient(circle at 35% 30%, #4a3a2a, #1a120c 70%)`, boxShadow: `0 30px 60px rgba(0,0,0,.6)`, transform: `scale(${1 - 0.2 * kk}) rotate(${kk * 12}deg)`, opacity: cl(phys(tt, 0.3 + i * 0.25, 7, 0.5) * 2) }} />; })}
    <Arrow x1={300} y1={760} x2={1640} y2={760} p={eio(tt, 0.6, 4.0)} col={c(OIL, RED)} />
    <Tag tt={tt} at={0.8} x={430} y={850} txt="ACEITE" col={OIL} size={36} />
    <Tag tt={tt} at={3.6} x={1510} y={850} txt="CARBÓN DURO" col={RED} size={36} />
    <Tag tt={tt} at={4.4} x={960} y={970} txt="ACEITE CARBONIZADO" col={TX} size={50} />
  </>;
}}</Stage>;

// ---- 7:30 · APAGAS Y EL CALOR SIGUE: la bomba de aceite cae a cero, la turbina sigue roja y el eje se cocina ----
export const HSoak: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #1c0e08, #040303 72%)">{(tt) => {
  const off = eio(tt, 0.6, 1.2), spin = 1 - eio(tt, 1.0, 4.0), coke = eio(tt, 2.4, 5.4);
  return <>
    <Head tt={tt} kick="GIRASTE LA LLAVE" title="EL TURBO SIGUE AL ROJO" col={HOT} />
    <TurboX x={960} y={590} s={0.8} tt={tt} spin={spin} hot={0.9} oil={1 - off} coke={coke} />
    <Tag tt={tt} at={1.0} x={1500} y={330} txt="ACEITE: 0" col={RED} size={44} />
    <Tag tt={tt} at={2.2} x={420} y={930} txt="CIENTOS DE GRADOS" col={HOT} size={38} />
    <Tag tt={tt} at={3.4} x={1500} y={930} txt="EL ACEITE QUIETO SE COCINA" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 8:19 · EL MINUTO: el reloj da la vuelta y la temperatura del turbo baja de rojo a tibio ----
export const HMinute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const p = eio(tt, 0.6, 5.0), sec = Math.round(60 * p);
  return <>
    <Head tt={tt} kick="LA REGLA DEL MINUTO" title="UN MINUTO REGULANDO" col={GRN} />
    <Ring x={600} y={590} r={280} p={p} txt={`${sec} s`} sub="EL MOTOR ANDANDO" col={GRN} />
    <Thermo x={1260} y={860} h={520} v={1 - 0.62 * p} val={`${Math.round(900 - 560 * p)} °C`} col={p > 0.7 ? AMB : HOT} />
    <Tag tt={tt} at={1.6} x={1320} y={300} txt="EL ACEITE SIGUE CIRCULANDO" col={OIL} size={34} />
    <Tag tt={tt} at={5.0} x={960} y={1000} txt="APAGAS CON EL TURBO TIBIO" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 10:04 · EL ACELERÓN ANTES DE APAGAR: la aguja salta, la llave se apaga y el eje queda girando sin aceite ----
export const HRevMyth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const rev = eio(tt, 0.4, 1.0) * (1 - eio(tt, 2.0, 3.6)), off = tt > 1.6 ? 1 : 0;
  return <>
    <Head tt={tt} kick="LO VEO AL REVÉS" title="EL ACELERÓN ANTES DE APAGAR" col={RED} />
    <Dial x={460} y={600} r={220} v={0.1 + 0.55 * rev} n={8} labels={["0", "2", "4", "6", "8"]} glow={1 - 0.6 * off} />
    <Pedal x={460} y={1020} press={rev} s={0.8} />
    <TurboX x={1340} y={620} s={0.6} tt={tt} spin={1} hot={0.95} oil={1 - off} />
    <Tag tt={tt} at={1.7} x={1340} y={330} txt="LLAVE: APAGADA" col={RED} size={40} />
    <Tag tt={tt} at={2.6} x={1340} y={900} txt="GIRA A FONDO · SIN ACEITE" col={HOT} size={38} />
    <Mark x={460} y={600} p={eio(tt, 3.6, 4.2)} s={260} />
  </>;
}}</Stage>;

// ---- 10:34 · EL TURBO TIMER: el aparatito cuenta para atrás con el auto andando y nadie adentro ----
export const HTimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const left = Math.max(0, 60 - Math.floor(eio(tt, 0.8, 5.0) * 60));
  return <>
    <Head tt={tt} kick="UN APARATITO" title="EL TURBO TIMER" col={ICE} />
    <div style={{ position: "absolute", left: 360, top: 360, width: 560, height: 300, borderRadius: 30, background: "linear-gradient(180deg,#24282d,#101215)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 4px #3a3f45", transform: `scale(${phys(tt, 0.3, 6, 0.5)})` }}>
      <div style={{ position: "absolute", left: 50, top: 50, width: 460, height: 200, borderRadius: 14, background: "#071016", color: "#7fe0ff", fontFamily: "monospace", fontWeight: 900, fontSize: 140, textAlign: "center", lineHeight: "200px", textShadow: "0 0 30px #3cc8ff" }}>{`0:${String(left).padStart(2, "0")}`}</div>
    </div>
    <Tag tt={tt} at={1.4} x={640} y={740} txt="SACAS LA LLAVE · EL MOTOR SIGUE" col={TX} size={34} />
    <div style={{ position: "absolute", left: 1100, top: 360, width: 620, height: 400, borderRadius: 28, background: "rgba(255,90,74,.08)", border: `3px solid ${RED}`, opacity: cl(phys(tt, 2.6, 6, 0.5) * 2) }}>
      <div style={{ padding: 40, fontWeight: 900, fontSize: 40, lineHeight: 1.5, color: TX }}>• CABLES EMPALMADOS<br />• AUTO ANDANDO SIN LLAVE<br />• EL SEGURO, ¿LO CUBRE?</div>
    </div>
    <Tag tt={tt} at={4.4} x={960} y={950} txt="MEJOR: TU MINUTO AL VOLANTE" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 11:27 · LA NOCHE EN LA CALLE: 3 grados, escarcha que crece en el borde y el pie que va al fondo ----
export const HCold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #0c1622, #020305 72%)">{(tt) => {
  const fr = eio(tt, 0.2, 2.4);
  return <>
    <Head tt={tt} kick="COSA NÚMERO 2" title="LA MAÑANA FRÍA" col={ICE} />
    {Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2, r = 470 + 30 * Math.sin(i * 3.1); return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(a) * r * 1.6 - 50, top: 560 + Math.sin(a) * r - 50, width: 100 * fr, height: 100 * fr, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,240,255,.5), transparent 70%)" }} />; })}
    <Big x={960} y={500} txt="3 °C" s={phys(tt, 0.4, 6, 0.6)} col={ICE} size={260} sub="AFUERA · EL AUTO DURMIÓ EN LA CALLE" />
    <Pedal x={1500} y={1020} press={eio(tt, 3.0, 3.6)} s={0.8} />
    <Tag tt={tt} at={3.2} x={960} y={880} txt="Y EN LA PRIMERA SUBIDA… A FONDO" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 12:00 · EL CAMINO DEL ACEITE: sale de la bomba, llena el motor y al turbo (lo más alto y lejano) llega último ----
export const HOilPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 0.6, 5.2), sec = (p * 30).toFixed(0);
  const pts: [number, number, string][] = [[300, 860, "BOMBA"], [700, 860, "CIGÜEÑAL"], [1000, 560, "ÁRBOL DE LEVAS"], [1560, 300, "TURBO"]];
  return <>
    <Head tt={tt} kick="EN FRÍO EL ACEITE ES ESPESO" title="AL TURBO LLEGA ÚLTIMO" col={OIL} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      <path d="M300 860 L700 860 Q850 860 1000 560 Q1200 300 1560 300" stroke="rgba(255,255,255,.12)" strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d="M300 860 L700 860 Q850 860 1000 560 Q1200 300 1560 300" stroke={OIL} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={1800} strokeDashoffset={1800 * (1 - p)} />
    </svg>
    {pts.map(([x, y, l], i) => { const on = p > [0, 0.25, 0.55, 0.98][i]; return <div key={l}>
      <div style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: "50%", background: on ? OIL : "#2a2d31", boxShadow: on ? `0 0 50px ${OIL}` : "none", border: "6px solid #4a4f55" }} />
      <div style={{ position: "absolute", left: x, top: y + 70, transform: "translateX(-50%)", fontWeight: 900, fontSize: 32, color: on ? TX : DIM, whiteSpace: "nowrap" }}>{l}</div>
    </div>; })}
    <Big x={1560} y={560} txt={`${sec} s`} s={phys(tt, 1.0, 6, 0.6)} col={tt > 5 ? GRN : AMB} size={110} sub="HASTA QUE LLEGA" />
  </>;
}}</Stage>;

// ---- 12:38 · CADA MAÑANA UN POQUITO: 365 rayitas de mañanas frías y el cojinete que se gasta ----
export const HWear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const p = eio(tt, 0.4, 4.6), n = Math.floor(p * 180);
  return <>
    <Head tt={tt} kick="NO SE ROMPE DE UN DÍA PARA EL OTRO" title="SE GASTA DE A POQUITO" col={AMB} />
    <div style={{ position: "absolute", left: 160, top: 320, width: 980, display: "flex", flexWrap: "wrap", gap: 8 }}>
      {Array.from({ length: 180 }, (_, i) => <div key={i} style={{ width: 40, height: 16, borderRadius: 4, background: i < n ? ICE : "rgba(255,255,255,.08)", opacity: i < n ? 0.9 : 1 }} />)}
    </div>
    <Tag tt={tt} at={0.6} x={650} y={880} txt="CADA RAYITA = UNA MAÑANA FRÍA A FONDO" col={ICE} size={30} />
    <svg viewBox="-110 -110 220 220" style={{ position: "absolute", left: 1300, top: 340, width: 440, height: 440 }}>
      <circle r={96} fill="#2a2d31" stroke="#6a7078" strokeWidth={10} />
      <circle r={58} fill="#0f1113" />
      <circle r={58 + 26 * p} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="10 8" opacity={p} />
      <circle r={40} cx={8 * p} fill="url(#sh)" /><defs><radialGradient id="sh"><stop offset="0" stopColor="#eef1f4" /><stop offset="1" stopColor="#7d848c" /></radialGradient></defs>
    </svg>
    <Tag tt={tt} at={3.8} x={1520} y={850} txt="EL EJE YA TIENE JUEGO" col={RED} size={38} />
  </>;
}}</Stage>;

// ---- 13:18 · LOS 400 METROS: de la puerta a la rampa con camiones, el turbo al máximo con el aceite frío ----
export const HRamp400: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.6, 3.8), cx = 260 + 1280 * p;
  return <>
    <Head tt={tt} kick="EL CLIENTE JOVEN" title="400 METROS Y A LA AUTOPISTA" col={AMB} />
    <div style={{ position: "absolute", left: 200, top: 700, width: 1520, height: 120, borderRadius: 20, background: "linear-gradient(180deg,#2c2e31,#1a1b1d)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 56, height: 8, background: "repeating-linear-gradient(90deg,#d9c37a 0 60px, transparent 60px 120px)" }} />
    </div>
    <div style={{ position: "absolute", left: 160, top: 520, width: 160, height: 180, background: "linear-gradient(180deg,#5a4a3a,#3a2e24)", borderRadius: "10px 10px 0 0" }}><div style={{ position: "absolute", left: 30, top: -60, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "60px solid #6a4a32" }} /></div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1500 + i * 70 - ((tt * 120) % 70), top: 560 - i * 10, width: 160, height: 130, borderRadius: 12, background: "linear-gradient(180deg,#9aa1a8,#5a6066)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />)}
    <div style={{ position: "absolute", left: cx - 80, top: 690, width: 160, height: 70, borderRadius: 30, background: "linear-gradient(180deg,#e9ecef,#9aa1a8)", boxShadow: `0 0 ${40 * p}px rgba(255,120,60,.6)` }} />
    <Big x={960} y={420} txt={`${Math.round(400 * p)} m`} s={phys(tt, 0.4, 6, 0.6)} col={TX} size={120} sub="CON EL MOTOR FRÍO" />
    <Tag tt={tt} at={4.2} x={960} y={930} txt="A LOS 70 MIL KM: TURBO GASTADO" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 13:55 · LA REGLA DEL FRÍO: arrancas → 30 segundos → sales tranquilo bajo 3.000 → la aguja al medio ----
export const HWarmRule: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const S: [string, string, string][] = [["1", "ARRANCAS", "Y ESPERAS 30 s"], ["2", "SALES TRANQUILO", "MENOS DE 3.000"], ["3", "10 MINUTOS", "SIN EXIGIRLO"]];
  return <>
    <Head tt={tt} kick="NI 10 MINUTOS EN LA PUERTA" title="LA REGLA DEL FRÍO" col={GRN} />
    {S.map(([n, a, b], i) => { const s = phys(tt, 0.5 + i * 1.1, 7, 0.5); return <div key={n} style={{ position: "absolute", left: 200 + i * 540, top: 380, width: 440, height: 400, borderRadius: 30, background: "rgba(0,0,0,.42)", border: `3px solid ${i === 2 ? GRN : "rgba(255,255,255,.14)"}`, transform: `translateY(${(1 - s) * 200}px)`, opacity: cl(s * 2) }}>
      <div style={{ position: "absolute", left: 30, top: 20, fontWeight: 900, fontSize: 90, color: AMB }}>{n}</div>
      {i === 0 && <Ring x={300} y={170} r={90} p={eio(tt, 1.0, 3.0)} txt={`${Math.round(30 * eio(tt, 1.0, 3.0))}`} col={GRN} />}
      {i === 1 && <Dial x={300} y={170} r={90} v={0.3 + 0.05 * Math.sin(tt * 2)} n={4} glow={0.6} col={GRN} />}
      {i === 2 && <div style={{ position: "absolute", left: 140, top: 120, width: 260, height: 20, borderRadius: 10, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${100 * eio(tt, 3.0, 6.0)}%`, height: "100%", borderRadius: 10, background: GRN }} /></div>}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontWeight: 900, fontSize: 38, color: TX }}>{a}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontWeight: 800, fontSize: 30, color: DIM }}>{b}</div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 14:31 · AGUA vs ACEITE: la aguja del agua llega al medio y el aceite todavía va por la mitad ----
export const HTwoTemps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = eio(tt, 0.5, 2.6), o = eio(tt, 0.5, 5.6) * 0.98;
  return <>
    <Head tt={tt} kick="OJO CON LA AGUJA" title="EL AGUA LLEGA PRIMERO" col={ICE} />
    <BarH x={220} y={380} w={1300} p={w} col={ICE} label="AGUA DEL MOTOR (LA AGUJA)" val={w > 0.98 ? "LISTA" : ""} />
    <BarH x={220} y={620} w={1300} p={o} col={OIL} label="EL ACEITE" val={o > 0.95 ? "LISTO" : `${Math.round(100 * o)} %`} />
    <Tag tt={tt} at={2.8} x={960} y={900} txt="AGUJA EN EL MEDIO ≠ ACEITE CALIENTE" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 15:42 · CADA CUÁNTO: la tabla normal (15.000) se tacha; uso severo = 7.500 a 10.000 ----
export const HInterval: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = phys(tt, 0.4, 6, 0.5), b = phys(tt, 2.0, 6, 0.5);
  return <>
    <Head tt={tt} kick="LAS DOS TABLAS DEL MANUAL" title="¿CADA CUÁNTO EL CAMBIO?" col={AMB} />
    <div style={{ position: "absolute", left: 260, top: 360, width: 620, height: 440, borderRadius: 26, background: "#f2eee4", color: "#1d1d1d", padding: 40, boxSizing: "border-box", boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `rotate(-3deg) translateY(${(1 - a) * 300}px)`, opacity: cl(a * 2) }}>
      <div style={{ fontWeight: 900, fontSize: 36, letterSpacing: 3 }}>USO NORMAL</div>
      <div style={{ fontWeight: 900, fontSize: 130, marginTop: 40 }}>15.000</div><div style={{ fontWeight: 800, fontSize: 32 }}>KM</div>
    </div>
    <Mark x={570} y={580} p={eio(tt, 1.4, 2.0)} s={300} />
    <div style={{ position: "absolute", left: 1040, top: 340, width: 660, height: 480, borderRadius: 26, background: "#fff6d8", color: "#1d1d1d", padding: 40, boxSizing: "border-box", boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 0 6px ${GRN}`, transform: `rotate(2deg) translateY(${(1 - b) * 300}px)`, opacity: cl(b * 2) }}>
      <div style={{ fontWeight: 900, fontSize: 36, letterSpacing: 3 }}>USO SEVERO · LA CIUDAD</div>
      <div style={{ fontWeight: 900, fontSize: 110, marginTop: 40 }}>7.500–10.000</div><div style={{ fontWeight: 800, fontSize: 32 }}>KM · CON FILTRO NUEVO</div>
    </div>
    <Tag tt={tt} at={4.0} x={960} y={950} txt="VIAJES CORTOS Y TRÁFICO = SEVERO" col={GRN} size={44} />
  </>;
}}</Stage>;
export { Jar, OIL };
