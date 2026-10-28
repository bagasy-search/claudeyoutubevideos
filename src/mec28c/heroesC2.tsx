// componentes únicos de mec28c · segunda mitad (la película gastada, la norma, la foto al manual, la varilla, el grano de arena,
// el filtro a contraluz, la marcha alta, el picado, las paletitas, el ahorro falso, la zona buena, las semanas de aviso,
// las tres señales, el destornillador, el color del humo, el motor que se embala, la cuenta, los mitos, las 5 que sí y el start-stop).
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Big, Mark } from "./mkit";
import { Dial, Pedal } from "./dkit";
import { BarH, Blades, HOT, OIL, Ring, TurboX } from "./tkit";

const Card: React.FC<{ x: number; y: number; w: number; h: number; s: number; col?: string; children?: React.ReactNode; rot?: number }> = ({ x, y, w, h, s, col = "rgba(255,255,255,.14)", children, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 30, background: "rgba(0,0,0,.42)", border: `3px solid ${col}`, transform: `translateY(${(1 - s) * 220}px) rotate(${rot * (1 - s)}deg)`, opacity: cl(s * 2), boxShadow: "0 40px 80px rgba(0,0,0,.45)" }}>{children}</div>
);

// ---- 16:15 · LA PELÍCULA GASTADA: con aceite nuevo el eje flota en una capa gruesa; con el viejo, fina y con partículas ----
export const HFilm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 2.0, 4.0);
  return <>
    <Head tt={tt} kick="BAJO LA LUPA" title="ACEITE NUEVO vs. ACEITE VIEJO" col={OIL} />
    {[0, 1].map((i) => { const th = i === 0 ? 70 : 70 - 52 * k, col = i === 0 ? OIL : "#3a2a18", s = phys(tt, 0.4 + i * 0.6, 6, 0.5);
      return <Card key={i} x={200 + i * 820} y={330} w={700} h={540} s={s} col={i === 0 ? GRN : RED}>
        <div style={{ position: "absolute", left: 60, top: 150, width: 580, height: 240, borderRadius: 30, background: "#2a2d31" }} />
        <div style={{ position: "absolute", left: 60, top: 270 - th / 2 - 50, width: 580, height: th + 100, background: col, opacity: 0.9 }} />
        <div style={{ position: "absolute", left: 60, top: 220, width: 580, height: 100, borderRadius: 50, background: "linear-gradient(180deg,#eef1f4,#7d848c 55%,#b0b6bd)", transform: `translateY(${i === 1 ? 20 * k * Math.sin(tt * 30) : 0}px)` }} />
        {i === 1 && Array.from({ length: 16 }, (_, j) => <div key={j} style={{ position: "absolute", left: 80 + ((j * 37 + tt * 160) % 540), top: 205 + (j % 4) * 40, width: 10, height: 10, borderRadius: 3, background: "#b8c0c8", opacity: k }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontWeight: 900, fontSize: 40, color: TX }}>{i === 0 ? "CAPA GRUESA · FLOTA" : "FINA Y CON LIJA"}</div>
      </Card>; })}
  </>;
}}</Stage>;

// ---- 17:37 · LA NORMA: el bidón con el número correcto igual se tacha si le falta la norma del manual ----
export const HNorm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const Jug: React.FC<{ x: number; ok: boolean; s: number }> = ({ x, ok, s }) => <div style={{ position: "absolute", left: x, top: 320, width: 380, height: 520, transform: `translateY(${(1 - s) * 300}px)`, opacity: cl(s * 2) }}>
    <div style={{ position: "absolute", left: 40, top: 60, width: 300, height: 440, borderRadius: "30px 60px 30px 30px", background: "linear-gradient(160deg,#3a4048,#1a1d21)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 240, top: 10, width: 70, height: 70, borderRadius: 14, background: "#2a2d31" }} />
    <div style={{ position: "absolute", left: 70, top: 160, width: 240, height: 260, borderRadius: 16, background: "#f2eee4", color: "#1d1d1d", padding: 18, boxSizing: "border-box" }}>
      <div style={{ fontWeight: 900, fontSize: 56 }}>5W-30</div>
      <div style={{ fontWeight: 800, fontSize: 22, marginTop: 14, letterSpacing: 1 }}>SINTÉTICO</div>
      <div style={{ marginTop: 18, padding: "8px 10px", borderRadius: 8, fontWeight: 900, fontSize: 26, background: ok ? "rgba(111,227,154,.35)" : "rgba(0,0,0,.06)", color: ok ? "#14532d" : "#999" }}>{ok ? "NORMA DEL MANUAL" : "— — —"}</div>
    </div>
  </div>;
  return <>
    <Head tt={tt} kick="NO ALCANZA EL NÚMERO" title="BUSCA LA NORMA" col={AMB} />
    <Jug x={380} ok={false} s={phys(tt, 0.4, 6, 0.5)} />
    <Jug x={1160} ok s={phys(tt, 1.2, 6, 0.5)} />
    <Mark x={570} y={600} p={eio(tt, 2.4, 3.0)} s={240} />
    <Mark x={1350} y={600} p={eio(tt, 3.2, 3.8)} ok s={240} />
    <Tag tt={tt} at={4.0} x={960} y={940} txt="MISMO NÚMERO · OTRO ACEITE" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 18:28 · LA FOTO AL MANUAL: el celular dibujado saca la foto a la página y la compara con la etiqueta del bidón ----
export const HPhoto: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fl = tt > 1.4 && tt < 1.6 ? 1 - Math.abs(tt - 1.5) * 10 : 0, m = eio(tt, 2.4, 3.8);
  return <>
    <Head tt={tt} kick="MI TRUCO" title="UNA FOTO A LA PÁGINA" col={ICE} />
    <div style={{ position: "absolute", left: 240, top: 330, width: 620, height: 500, borderRadius: 14, background: "#f2eee4", color: "#1d1d1d", padding: 40, boxSizing: "border-box", transform: "rotate(-4deg)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ fontWeight: 900, fontSize: 36 }}>ACEITE DEL MOTOR</div>
      <div style={{ marginTop: 30, height: 14, width: "80%", background: "#ccc", borderRadius: 7 }} /><div style={{ marginTop: 16, height: 14, width: "60%", background: "#ccc", borderRadius: 7 }} />
      <div style={{ marginTop: 40, display: "inline-block", padding: "14px 22px", border: "5px solid #c0392b", borderRadius: 12, fontWeight: 900, fontSize: 44 }}>NORMA XXX</div>
    </div>
    <div style={{ position: "absolute", left: 1080 - 300 * (1 - m), top: 280, width: 330, height: 620, borderRadius: 50, background: "#111", boxShadow: "0 40px 90px rgba(0,0,0,.7), inset 0 0 0 10px #2a2a2a" }}>
      <div style={{ position: "absolute", left: 22, top: 60, width: 286, height: 500, borderRadius: 20, background: `linear-gradient(180deg, #f2eee4, #e0dacd)`, overflow: "hidden", opacity: cl((tt - 1.5) * 3) }}>
        <div style={{ position: "absolute", left: 30, top: 200, padding: "10px 16px", border: "4px solid #c0392b", borderRadius: 10, fontWeight: 900, fontSize: 32, color: "#1d1d1d" }}>NORMA XXX</div>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 50, background: "#fff", opacity: fl }} />
    </div>
    <Arrow x1={1400} y1={600} x2={1640} y2={600} p={eio(tt, 3.6, 4.2)} col={GRN} />
    <Tag tt={tt} at={4.0} x={1700} y={480} txt="¿DICE LO MISMO?" col={GRN} size={36} />
    <Tag tt={tt} at={4.6} x={960} y={960} txt="SI NO LA TIENEN → OTRO LUBRICENTRO" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 19:09 · LA VARILLA: el nivel baja del máximo al mínimo; entre las dos rayas hay casi un litro ----
export const HDipstick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lv = 1 - 0.95 * eio(tt, 0.8, 3.0) + 0.9 * eio(tt, 4.0, 5.4);
  return <>
    <Head tt={tt} kick="UNA VEZ POR MES" title="LA VARILLA NO MIENTE" col={OIL} />
    <div style={{ position: "absolute", left: 300, top: 560, width: 1320, height: 46, borderRadius: 23, background: "linear-gradient(180deg,#e6eaee,#8d939a)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 600 + 420 * cl(lv), borderRadius: 23, background: `linear-gradient(180deg, ${OIL}, #8a5a10)`, opacity: 0.92 }} />
      {[600, 1020].map((x, i) => <div key={x} style={{ position: "absolute", left: x, top: -40, width: 8, height: 126, background: i ? GRN : RED, borderRadius: 4 }} />)}
    </div>
    <div style={{ position: "absolute", left: 1620, top: 520, width: 120, height: 126, borderRadius: 30, background: "#d9a020", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={0.6} x={1024} y={450} txt="MÁX" col={GRN} size={36} />
    <Tag tt={tt} at={0.6} x={604} y={450} txt="MÍN" col={RED} size={36} />
    <Tag tt={tt} at={2.0} x={812} y={720} txt="ENTRE RAYA Y RAYA ≈ 1 LITRO" col={AMB} size={40} />
    <Tag tt={tt} at={3.0} x={960} y={900} txt="ABAJO: LA BOMBA CHUPA AIRE" col={RED} size={42} />
    <Tag tt={tt} at={5.0} x={960} y={980} txt="COMPLETAS DE A POQUITO" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 20:01 · UN GRANO DE ARENA: un puntito entra por la toma y le arranca la punta a una aleta ----
export const HGrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #12161c, #030405 72%)">{(tt) => {
  const p = eio(tt, 0.8, 2.4), hit = tt > 2.4 ? 1 : 0;
  return <>
    <Head tt={tt} kick="SIN FILTRO DE AIRE" title="UN GRANO = UN BALAZO" col={RED} />
    <Blades x={1150} y={590} r={330} ang={tt * 400} col="#d9dee3" blur={0.6} chip={eio(tt, 2.4, 2.8)} />
    <div style={{ position: "absolute", left: 200 + 820 * p, top: 560 + 30 * p, width: 26, height: 22, borderRadius: "40% 60% 50% 45%", background: "#c9a46a", boxShadow: "0 0 20px rgba(255,220,150,.8)", opacity: 1 - hit }} />
    {hit > 0 && Array.from({ length: 10 }, (_, i) => { const a = i * 0.63, d = 160 * eio(tt, 2.4, 3.2); return <div key={i} style={{ position: "absolute", left: 1020 + Math.cos(a) * d, top: 580 + Math.sin(a) * d, width: 14, height: 6, borderRadius: 3, background: "#e8ecf0", opacity: 1 - eio(tt, 3.0, 3.8) }} />; })}
    <Tag tt={tt} at={1.0} x={360} y={430} txt="POLVO · ARENITA" col={AMB} size={36} />
    <Tag tt={tt} at={3.2} x={600} y={900} txt="ALETAS COMIDAS = TURBO CAMBIADO" col={RED} size={42} />
  </>;
}}</Stage>;

// ---- 21:11 · EL FILTRO A CONTRALUZ: el limpio deja pasar la luz, el gris no; y el que se lava se rompe ----
export const HFilterLight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const Pleats: React.FC<{ x: number; dirt: number; s: number; hole?: number }> = ({ x, dirt, s, hole = 0 }) => <div style={{ position: "absolute", left: x, top: 330, width: 460, height: 480, borderRadius: 18, background: "#2a2d31", boxShadow: "0 40px 80px rgba(0,0,0,.55)", transform: `scale(${0.8 + 0.2 * s})`, opacity: cl(s * 2), overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 20, background: `repeating-linear-gradient(90deg, rgb(${240 - 170 * dirt},${236 - 170 * dirt},${220 - 170 * dirt}) 0 18px, rgb(${210 - 160 * dirt},${204 - 160 * dirt},${188 - 160 * dirt}) 18px 36px)`, boxShadow: `0 0 ${80 * (1 - dirt)}px rgba(255,240,200,.6)` }} />
    {hole > 0 && <div style={{ position: "absolute", left: 180, top: 190, width: 90 * hole, height: 60 * hole, borderRadius: "40% 60% 50% 50%", background: "#000" }} />}
  </div>;
  return <>
    <Head tt={tt} kick="A CONTRALUZ" title="¿PASA LA LUZ?" col={ICE} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 760, background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(255,240,200,.2), transparent 70%)" }} />
    <Pleats x={160} dirt={0} s={phys(tt, 0.4, 6, 0.5)} />
    <Pleats x={730} dirt={eio(tt, 0.8, 2.4)} s={phys(tt, 0.9, 6, 0.5)} />
    <Pleats x={1300} dirt={0.6} s={phys(tt, 2.6, 6, 0.5)} hole={eio(tt, 3.4, 4.0)} />
    <Tag tt={tt} at={1.0} x={390} y={880} txt="NUEVO" col={GRN} size={38} />
    <Tag tt={tt} at={2.2} x={960} y={880} txt="GRIS = CAMBIARLO" col={AMB} size={38} />
    <Tag tt={tt} at={3.6} x={1530} y={880} txt="SOPLADO = ROTO" col={RED} size={38} />
    <Mark x={1530} y={570} p={eio(tt, 4.2, 4.8)} s={220} />
  </>;
}}</Stage>;

// ---- 21:57 · SEXTA A 1.200: el pie al fondo, la aguja casi no sube y el cilindro se llena de presión ----
export const HLug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ped = eio(tt, 0.6, 1.2), pr = eio(tt, 1.2, 4.0);
  return <>
    <Head tt={tt} kick="COSA NÚMERO 4" title="EN SEXTA Y A FONDO" col={RED} />
    <Dial x={420} y={560} r={210} v={0.15 + 0.05 * pr} n={8} labels={["0", "2", "4", "6", "8"]} />
    <Tag tt={tt} at={0.4} x={420} y={860} txt="1.200 VUELTAS · 6ª" col={TX} size={36} />
    <Pedal x={900} y={1000} press={ped} s={0.9} />
    <div style={{ position: "absolute", left: 1160, top: 280, width: 400, height: 620, borderRadius: 26, background: "linear-gradient(90deg,#3a3f45,#5c626a 50%,#3a3f45)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 320, height: 380, borderRadius: 16, background: `rgba(255,${150 - 100 * pr},60,${0.15 + 0.6 * pr})`, boxShadow: `inset 0 0 ${80 * pr}px rgba(255,80,40,${pr})` }} />
      <div style={{ position: "absolute", left: 50, top: 300 + 20 * Math.sin(tt * 2), width: 300, height: 120, borderRadius: 14, background: "linear-gradient(180deg,#c9ced4,#7d848c)" }} />
    </div>
    <Tag tt={tt} at={2.6} x={1360} y={210} txt="MUCHA PRESIÓN · PISTÓN LENTO" col={HOT} size={34} />
    <Tag tt={tt} at={4.2} x={960} y={970} txt="EL MOTOR SUFRE · NO AHORRA" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 23:04 · EL PICADO: la chispa empuja un frente de llama parejo; la mezcla explota sola por otro lado y se chocan ----
export const HKnock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #1a0d08, #030202 72%)">{(tt) => {
  const f1 = eio(tt, 0.6, 3.0), f2 = eio(tt, 1.6, 2.8), clash = eio(tt, 2.8, 3.0) * (1 - eio(tt, 3.6, 4.4));
  return <>
    <Head tt={tt} kick="EN EL CILINDRO" title="EL PICADO" col={RED} />
    <div style={{ position: "absolute", left: 560, top: 260, width: 800, height: 620, borderRadius: 40, background: "#141517", boxShadow: "inset 0 0 0 14px #3a3f45, 0 40px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 400 - 500 * f1, top: -60 - 500 * f1 + 60, width: 1000 * f1, height: 1000 * f1, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,90,.85), rgba(255,120,40,.4) 60%, transparent 70%)" }} />
      <div style={{ position: "absolute", left: 640 - 300 * f2, top: 480 - 300 * f2, width: 600 * f2, height: 600 * f2, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,90,60,.95), rgba(255,40,30,.4) 60%, transparent 70%)" }} />
      <div style={{ position: "absolute", left: 380, top: 0, width: 40, height: 70, borderRadius: 8, background: "#c9ced4" }} />
    </div>
    <div style={{ position: "absolute", left: 560, top: 260, width: 800, height: 620, borderRadius: 40, boxShadow: `0 0 ${140 * clash}px rgba(255,80,40,${clash})`, transform: `translateX(${8 * clash * Math.sin(tt * 90)}px)` }} />
    <Tag tt={tt} at={0.8} x={960} y={200} txt="LA CHISPA" col={AMB} size={34} />
    <Tag tt={tt} at={1.8} x={1600} y={760} txt="EXPLOTA SOLA" col={RED} size={38} />
    <Tag tt={tt} at={3.2} x={960} y={960} txt="GOLPE → PISTÓN PARTIDO" col={RED} size={46} />
  </>;
}}</Stage>;

// ---- 24:07 · LAS PALETITAS: abren y cierran según las vueltas; con hollín quedan trabadas ----
export const HVanes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const soot = eio(tt, 2.6, 4.2), ang = 25 * Math.sin(tt * 2.2) * (1 - soot);
  return <>
    <Head tt={tt} kick="LOS DIÉSEL CON TURBO" title="LAS PALETITAS MÓVILES" col={ICE} />
    <svg viewBox="-200 -200 400 400" style={{ position: "absolute", left: 560, top: 230, width: 800, height: 800, overflow: "visible" }}>
      <circle r={180} fill="#2a2d31" stroke="#5c626a" strokeWidth={10} /><circle r={70} fill="#0f1113" />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 360; return <g key={i} transform={`rotate(${a}) translate(0 -125) rotate(${ang})`}>
        <rect x={-10} y={-40} width={20} height={80} rx={10} fill={`rgb(${200 - 150 * soot},${206 - 156 * soot},${212 - 162 * soot})`} />
      </g>; })}
      {soot > 0 && Array.from({ length: 30 }, (_, i) => { const a = i * 0.61, r = 100 + (i % 5) * 16; return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={8 * soot} fill="#1a1410" />; })}
    </svg>
    <Tag tt={tt} at={0.8} x={360} y={560} txt="ABREN · CIERRAN" col={ICE} size={38} />
    <Tag tt={tt} at={3.4} x={1580} y={560} txt="HOLLÍN = TRABADAS" col={RED} size={38} />
    <Tag tt={tt} at={4.6} x={960} y={1000} txt="EL AUTO PIERDE FUERZA" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 24:32 · «ASÍ GASTO MENOS»: la gota de ahorro chiquita contra la cuenta del turbo y la limpieza ----
export const HSaver: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tip = eio(tt, 2.0, 3.2);
  return <>
    <Head tt={tt} kick="EL VIAJANTE" title="«ASÍ GASTO MENOS»" col={AMB} />
    <div style={{ position: "absolute", left: 960, top: 560, width: 16, height: 360, marginLeft: -8, background: "#8d939a", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 960, top: 560, width: 1100, height: 14, marginLeft: -550, background: "linear-gradient(90deg,#8d939a,#e9edf1,#8d939a)", borderRadius: 7, transform: `rotate(${-14 * tip}deg)` }}>
      <div style={{ position: "absolute", left: 40, top: -150 + 0, width: 200, height: 150, borderRadius: 20, background: "rgba(111,227,154,.18)", border: `3px solid ${GRN}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 30, color: GRN, textAlign: "center" }}>UN POQUITO<br />DE COMBUSTIBLE</div>
      <div style={{ position: "absolute", right: 40, top: -260, width: 300, height: 260, borderRadius: 20, background: "rgba(255,90,74,.16)", border: `3px solid ${RED}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, color: RED, textAlign: "center", opacity: cl(phys(tt, 1.2, 6, 0.5) * 2) }}>TURBO TRABADO<br />+ LIMPIEZA<br />+ EMBRAGUE</div>
    </div>
    <Tag tt={tt} at={3.6} x={960} y={960} txt="BAJA UN CAMBIO EN LA SUBIDA" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 25:22 · LA ZONA BUENA: la franja de 2.000 a 4.000 se ilumina en el cuentavueltas ----
export const HSweet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const z = eio(tt, 0.8, 2.0), v = 0.12 + 0.3 * eio(tt, 2.2, 3.4) + 0.03 * Math.sin(tt * 3);
  return <>
    <Head tt={tt} kick="PARA PEDIR FUERZA" title="ENTRE 2.000 Y 4.000" col={GRN} />
    <Dial x={960} y={600} r={330} v={v} n={8} labels={["0", "1", "2", "3", "4", "5", "6", "7", "8"]} col={GRN}>
      <svg viewBox="-400 -400 800 800" style={{ position: "absolute", left: -400, top: -400, width: 800, height: 800, overflow: "visible" }}>
        <path d={(() => { const a = (k: number) => Math.PI * 0.75 + k * Math.PI * 1.5, r = 300, a1 = a(2 / 8), a2 = a(2 / 8 + (2 / 8) * z); return `M${Math.cos(a1) * r} ${Math.sin(a1) * r} A ${r} ${r} 0 0 1 ${Math.cos(a2) * r} ${Math.sin(a2) * r}`; })()} stroke={GRN} strokeWidth={30} fill="none" strokeLinecap="round" opacity={0.75} />
      </svg>
    </Dial>
    <Tag tt={tt} at={3.6} x={1560} y={420} txt="GASOLINA: 2.000–4.000" col={TX} size={36} />
    <Tag tt={tt} at={4.2} x={1560} y={480} txt="DIÉSEL: 1.800–3.000" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 26:25 · AVISA CON SEMANAS: la línea del tiempo con el silbido, el humo y la rotura; cuánto cuesta en cada punto ----
export const HWeeks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.5, 4.4), E: [number, string, string, string][] = [[0.1, "SEMANA 1", "SILBIDO NUEVO", AMB], [0.5, "SEMANA 4", "HUMO AZUL", ICE], [0.92, "UN DÍA", "SE ROMPE EN LA RUTA", RED]];
  return <>
    <Head tt={tt} kick="LA COSA NÚMERO 5" title="EL TURBO TE AVISA" col={AMB} />
    <div style={{ position: "absolute", left: 200, top: 600, width: 1520 * p, height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${AMB}, ${RED})` }} />
    {E.map(([k, a, b, c]) => { const s = p > k ? phys(tt, 0.5 + k * 3.9, 7, 0.5) : 0; return <div key={a} style={{ position: "absolute", left: 200 + 1520 * k, top: 606, opacity: cl(s * 2) }}>
      <div style={{ position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: "50%", background: c, boxShadow: `0 0 40px ${c}` }} />
      <div style={{ position: "absolute", left: 0, top: -170, transform: `translateX(-50%) translateY(${(1 - s) * -40}px)`, textAlign: "center", whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3, color: DIM }}>{a}</div><div style={{ fontWeight: 900, fontSize: 40, color: c }}>{b}</div>
      </div>
    </div>; })}
    <Tag tt={tt} at={2.0} x={560} y={760} txt="ACÁ SE ARREGLA BARATO" col={GRN} size={36} />
    <Tag tt={tt} at={4.6} x={1500} y={760} txt="ACÁ, MOTOR Y TURBO" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 27:05 · LAS TRES SEÑALES: el chillido, el humo azul y la falta de fuerza, cada una con su dibujo ----
export const HThree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => (<>
  <Head tt={tt} kick="LO QUE NO ES NORMAL" title="TRES SEÑALES" col={RED} />
  {[0, 1, 2].map((i) => { const s = phys(tt, 0.5 + i * 1.1, 7, 0.5); return <Card key={i} x={200 + i * 540} y={340} w={440} h={500} s={s} col={[AMB, ICE, RED][i]}>
    {i === 0 && <svg viewBox="-100 -100 200 200" style={{ position: "absolute", left: 70, top: 40, width: 300, height: 300 }}>{[0, 1, 2].map((k) => <path key={k} d={`M${-20 + k * 30} ${-60 - k * 10} q ${30 + k * 10} ${60 + k * 10} 0 ${120 + k * 20}`} stroke={AMB} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(tt * 8 - k)} />)}<rect x={-80} y={-30} width={40} height={60} rx={8} fill={AMB} /></svg>}
    {i === 1 && Array.from({ length: 6 }, (_, k) => { const p = (tt * 0.5 + k / 6) % 1; return <div key={k} style={{ position: "absolute", left: 100 + p * 160, top: 240 - p * 180, width: 80 + p * 120, height: 60 + p * 90, borderRadius: "50%", background: `rgba(130,160,210,${0.6 * (1 - p)})` }} />; })}
    {i === 2 && <div style={{ position: "absolute", left: 80, top: 120, width: 280, height: 40, borderRadius: 20, background: "rgba(255,255,255,.1)" }}><div style={{ width: `${100 - 70 * eio(tt, 3.0, 4.6)}%`, height: "100%", borderRadius: 20, background: RED }} /></div>}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontWeight: 900, fontSize: 38, color: TX }}>{["CHILLIDO NUEVO", "HUMO AZUL", "PIERDE FUERZA"][i]}</div>
  </Card>; })}
</>)}</Stage>;

// ---- 28:21 · EL DESTORNILLADOR ESTETOSCOPIO: la onda del turbo sano es pareja; la del gastado, rugosa ----
export const HStetho: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const wave = (rough: number, y: number, col: string, p: number) => { let d = `M200 ${y}`; for (let x = 0; x <= 1180 * p; x += 8) { const yy = y + 40 * Math.sin((x + tt * 300) / 40) + rough * 40 * Math.sin(x * 1.7 + tt * 20) * Math.sin(x * 0.31); d += ` L${200 + x} ${yy}`; } return <path d={d} stroke={col} strokeWidth={6} fill="none" />; };
  return <>
    <Head tt={tt} kick="EL TRUCO DE MI TÍO" title="ESCUCHAR EL TURBO" col={AMB} />
    <div style={{ position: "absolute", left: 200, top: 260, width: 520, height: 26, borderRadius: 13, background: "linear-gradient(90deg,#c9a46a,#8a6a3a 30%,#c9ced4 31%,#7d848c)", transform: `rotate(-8deg) translateX(${(1 - phys(tt, 0.3, 6, 0.5)) * -400}px)` }} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      {wave(0, 520, GRN, eio(tt, 0.8, 2.4))}
      {wave(1, 800, RED, eio(tt, 2.4, 4.0))}
    </svg>
    <Tag tt={tt} at={1.0} x={1420} y={520} txt="SANO: PAREJO" col={GRN} size={34} anchor="l" />
    <Tag tt={tt} at={2.6} x={1420} y={800} txt="RASPA: REVISAR" col={RED} size={34} anchor="l" />
    <Tag tt={tt} at={4.4} x={960} y={1000} txt="LEJOS DE LAS CORREAS Y EL VENTILADOR" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 28:53 · EL COLOR DEL HUMO: vapor blanco en la mañana fría (normal) contra el humo azul (aceite quemándose) ----
export const HSmoke: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const puff = (x: number, col: string, t0: number) => Array.from({ length: 8 }, (_, k) => { const p = ((tt - t0) * 0.45 + k / 8) % 1; return tt < t0 ? null : <div key={k} style={{ position: "absolute", left: x + p * 300, top: 600 - p * 260 + 10 * Math.sin(k), width: 90 + p * 200, height: 70 + p * 150, borderRadius: "50%", background: col.replace("A", String(0.55 * (1 - p))) }} />; });
  return <>
    <Head tt={tt} kick="POR EL ESCAPE" title="¿QUÉ COLOR TIENE?" col={ICE} />
    {[300, 1100].map((x) => <div key={x} style={{ position: "absolute", left: x - 40, top: 590, width: 120, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#9aa1a8,#4a4f55)" }} />)}
    {puff(380, "rgba(240,244,248,A)", 0.4)}
    {puff(1180, "rgba(110,140,200,A)", 1.6)}
    <Tag tt={tt} at={0.8} x={480} y={760} txt="BLANCO, MAÑANA FRÍA: NORMAL" col={GRN} size={34} />
    <Tag tt={tt} at={2.2} x={1300} y={760} txt="AZUL: QUEMA ACEITE" col={RED} size={38} />
    <Tag tt={tt} at={4.0} x={960} y={950} txt="EL AZUL, AL TALLER ESA SEMANA" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 30:21 · SE EMBALA: la aguja se clava en rojo sola; los 3 pasos: lugar seguro, cambio alto, freno y soltar embrague ----
export const HRunaway: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #200a08, #030202 72%)">{(tt) => {
  const v = 0.2 + 0.78 * eio(tt, 0.3, 1.6) * (1 - eio(tt, 4.6, 5.6)), S = ["FRENA EN UN LUGAR SEGURO", "PON UN CAMBIO ALTO", "PIE EN EL FRENO · SUELTA EL EMBRAGUE"];
  return <>
    <Head tt={tt} kick="SI TE PASA" title="EL MOTOR SE EMBALA" col={RED} />
    <Dial x={480} y={600} r={260} v={v + 0.01 * Math.sin(tt * 40)} n={8} labels={["0", "2", "4", "6", "8"]} col={RED} />
    {S.map((s, i) => { const k = phys(tt, 1.8 + i * 0.9, 7, 0.5); return <div key={i} style={{ position: "absolute", left: 900, top: 340 + i * 170, width: 860, height: 130, borderRadius: 22, background: "rgba(0,0,0,.45)", border: `3px solid ${i === 2 ? GRN : "rgba(255,255,255,.15)"}`, transform: `translateX(${(1 - k) * 300}px)`, opacity: cl(k * 2), display: "flex", alignItems: "center", gap: 24, paddingLeft: 30, boxSizing: "border-box" }}>
      <div style={{ fontWeight: 900, fontSize: 70, color: AMB }}>{i + 1}</div><div style={{ fontWeight: 900, fontSize: 36, color: TX }}>{s}</div>
    </div>; })}
    <Tag tt={tt} at={5.0} x={480} y={940} txt="EL MOTOR SE AHOGA Y PARA" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 31:14 · LA CUENTA: aceite + filtro de un lado, de mil a cinco mil dólares del otro ----
export const HCost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => (<>
  <Head tt={tt} kick="HAZ LA CUENTA" title="CUIDARLO vs. CAMBIARLO" col={AMB} />
  <BarH x={200} y={380} w={120} p={eio(tt, 0.5, 1.2)} col={GRN} label="ACEITE + FILTRO A TIEMPO" val="POCO" />
  <BarH x={200} y={620} w={1150} p={eio(tt, 1.6, 4.0)} col={RED} label="TURBO NUEVO + LIMPIEZA + INTERCOOLER" val={tt > 3.8 ? "US$1.000–5.000" : ""} />
  <Tag tt={tt} at={4.4} x={960} y={950} txt="Y SIEMPRE: CAÑO DEL ACEITE NUEVO" col={AMB} size={42} />
</>)}</Stage>;

// ---- 31:51 · LOS 5 MITOS: cinco tarjetas que se dan vuelta y todas dicen FALSO ----
export const HMyths: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const M = ["EL TURBO DURA POCO", "CALENTAR 10 MINUTOS", "5 MINUTOS EN RALENTÍ", "SI SILBA, SE ROMPE", "PREMIUM LO CUIDA"];
  return <>
    <Head tt={tt} kick="LO QUE SE DICE" title="5 MITOS DEL TURBO" col={RED} />
    {M.map((m, i) => { const s = phys(tt, 0.3 + i * 0.25, 7, 0.5), f = eio(tt, 1.8 + i * 0.5, 2.1 + i * 0.5); return <div key={i} style={{ position: "absolute", left: 140 + i * 336, top: 360, width: 300, height: 420, borderRadius: 24, transform: `translateY(${(1 - s) * 260}px) scaleX(${Math.abs(1 - 2 * f) || 0.02})`, opacity: cl(s * 2), background: f > 0.5 ? "linear-gradient(160deg,#3a1512,#1a0807)" : "linear-gradient(160deg,#f4efe4,#d9d1c0)", boxShadow: `0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px ${f > 0.5 ? RED : "rgba(0,0,0,.1)"}` }}>
      {f <= 0.5 ? <div style={{ position: "absolute", left: 20, right: 20, top: 140, fontWeight: 900, fontSize: 34, lineHeight: 1.2, color: "#1d1d1d", textAlign: "center" }}>{m}</div>
        : <div style={{ position: "absolute", left: 0, right: 0, top: 170, fontWeight: 900, fontSize: 60, color: RED, textAlign: "center", transform: "rotate(-12deg)" }}>FALSO</div>}
    </div>; })}
  </>;
}}</Stage>;

// ---- 32:56 · LAS 5 QUE SÍ: la lista que se tilda de a una ----
export const HDoList: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = ["UN MINUTO ANTES DE APAGAR", "EN FRÍO, TRANQUILO", "ACEITE CON LA NORMA", "BAJAR UN CAMBIO", "ESCUCHARLO UNA VEZ POR MES"];
  return <>
    <Head tt={tt} kick="LO QUE SÍ TIENES QUE HACER" title="LAS 5 QUE SÍ" col={GRN} />
    {L.map((l, i) => { const s = phys(tt, 0.4 + i * 0.7, 7, 0.5); return <div key={i} style={{ position: "absolute", left: 360, top: 280 + i * 140, display: "flex", alignItems: "center", gap: 30, opacity: cl(s * 2), transform: `translateX(${(1 - s) * -200}px)` }}>
      <div style={{ width: 90, height: 90, borderRadius: 20, border: `5px solid ${GRN}`, position: "relative" }}><Mark x={45} y={45} p={eio(tt, 0.9 + i * 0.7, 1.3 + i * 0.7)} ok s={80} /></div>
      <div style={{ fontWeight: 900, fontSize: 52, color: TX, whiteSpace: "nowrap" }}>{l}</div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 33:58 · EL START-STOP: el botón con la A se apaga a mano cuando vienes de exigirlo ----
export const HStartStop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const press = eio(tt, 2.0, 2.3) * (1 - eio(tt, 2.4, 2.7)), led = tt > 2.3 ? 1 : 0;
  return <>
    <Head tt={tt} kick="ARRANQUE Y PARADA" title="SI VIENES DE EXIGIRLO" col={AMB} />
    <div style={{ position: "absolute", left: 760, top: 340, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3a3f45, #121417)", boxShadow: `0 40px 90px rgba(0,0,0,.65), inset 0 0 0 10px #2a2d31`, transform: `scale(${1 - 0.06 * press})` }}>
      <svg viewBox="-100 -100 200 200" style={{ position: "absolute", inset: 60 }}>
        <path d="M-50 -20 A 55 55 0 1 0 30 -50" stroke={TX} strokeWidth={10} fill="none" strokeLinecap="round" /><path d="M30 -50 l-4 -26 M30 -50 l-24 8" stroke={TX} strokeWidth={10} strokeLinecap="round" />
        <text x={0} y={18} textAnchor="middle" fontSize={56} fontWeight={900} fill={TX} fontFamily="sans-serif">A</text>
      </svg>
      <div style={{ position: "absolute", left: 180, top: 330, width: 40, height: 14, borderRadius: 7, background: led ? AMB : "#2a2d31", boxShadow: led ? `0 0 30px ${AMB}` : "none" }} />
    </div>
    <Tag tt={tt} at={2.6} x={960} y={830} txt="LO APAGAS ANTES DE LLEGAR" col={AMB} size={42} />
    <Tag tt={tt} at={3.8} x={960} y={930} txt="Y TU MINUTO, IGUAL" col={GRN} size={40} />
  </>;
}}</Stage>;
export { Blades, Ring, TurboX };
