// cmehel3d · MINUTO 1 (0 → 65,6 s). Un solo hilo visual, sin cortes secos:
// avatar "11 de la noche, día 2" → portal a la cuadra NEGRA → latigazo a la calle filmada por un vecino (perros, generador)
// → la carne que suda en la casa de al lado (termómetro que sube) → avatar "una sola ventana… es la mía"
// → la cámara vuela a la casa encendida, entra a la cocina: refrigerador a 4 °C → se abre y la luz se prende (toma de plata)
// → sigue el río de luz del enchufe al auto: el tanque lleno → avatar "sin paneles, sin generador"
// → el tanque de cerca, "SIN LITIO DE US$1000" → se aleja y el cielo gira 3 veces: 3 DÍAS → EL TESTER EN LA MANO (toma de plata)
// → avatar + rótulo → "esa batería SOLA no lo hace": el tanque se vacía con el reloj hasta 3 h 08 → "3 HORAS, NO 3 DÍAS".
// Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf, camSpeed } from "./casa3d";
import { BigNum, COL, Flash, FONT, HeatHaze, LowerThird, Portal, Tag, Thermo, e, ei, extrude, spr } from "../cme3d01/lib";
import { at, Avatar, Take, Stamp, Lcd, Head, s } from "./lib";

// anclas: el segundo exacto de cada frase en la voz
export const A = {
  calle: at("tu calle esta negra"), perros: at("se escuchan perros"), cocina: at("y en la cocina de tu casa"), carne: at("la carne del mes"), sudar: at("empezo a sudar"),
  cuadra: at("y en toda la cuadra"), mia: at("es la mia"), adentro: at("y adentro de esa ventana"), grados4: at("4 grados"), foquito: at("con el foquito"), abro: at("abro la puerta"),
  mantiene: at("lo que lo mantiene"), auto: at("auto la misma"), entrada: at("en tu entrada"), paneles: at("sin paneles solares"), generador: at("sin generador"),
  litio: at("sin comprar una bateria de litio"), mil: at("mil dolares"), tres: at("tres dias seguidos"), medi: at("y lo medi con el tester"), manana: at("cada manana"), noche: at("cada noche"),
  pero: at("pero te lo voy a decir"), pinza: at("con una pinza"), sola: at("esa bateria sola"), canal: at("en este canal ya la medi"), duro: at("duro 3 horas"), h3: at("3 horas no 3 dias"),
};
export const MIN1_END = 65.6;
export const MIN1_FRAMES = s(MIN1_END);

export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// latigazo horizontal entre dos capas (sale prev, entra cur), con estela de luz
const Whip: React.FC<{ k: number; prev: React.ReactNode; cur: React.ReactNode; dir?: 1 | -1 }> = ({ k, prev, cur, dir = -1 }) => {
  const mb = Math.sin(k * Math.PI) * 40;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dir * k * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{prev}</AbsoluteFill>
      {k > 0 && <AbsoluteFill style={{ transform: `translateX(${-dir * (1 - k) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{cur}</AbsoluteFill>}
      {mb > 6 && <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.45) 50%, transparent 80%)", opacity: mb / 40, mixBlendMode: "screen" }} />}
    </AbsoluteFill>
  );
};

// reloj de prueba: corre de 0:00 a 3:08 mientras el tanque se vacía
const Clock: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const mins = Math.round(188 * e(t, a, b)), hh = Math.floor(mins / 60), mm = mins % 60;
  const ang = (mins / 60) * 360;
  return (
    <div style={{ position: "absolute", left: 1180, top: 300, opacity: o, perspective: 1100 }}>
      <div style={{ transform: "rotateY(16deg)", display: "flex", alignItems: "center", gap: 28 }}>
        <svg width={220} height={220} viewBox="0 0 220 220" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
          <circle cx={110} cy={110} r={100} fill="rgba(12,16,24,.9)" stroke={COL.ink} strokeWidth={6} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={110} y1={18} x2={110} y2={32} stroke={COL.dim} strokeWidth={4} transform={`rotate(${i * 30} 110 110)`} />)}
          <path d={`M110 110 L110 10 A100 100 0 ${ang % 360 > 180 ? 1 : 0} 1 ${110 + 100 * Math.sin((ang % 360) * Math.PI / 180)} ${110 - 100 * Math.cos((ang % 360) * Math.PI / 180)} Z`} fill="rgba(255,74,61,.35)" />
          <line x1={110} y1={110} x2={110} y2={24} stroke={COL.red} strokeWidth={6} strokeLinecap="round" transform={`rotate(${ang} 110 110)`} />
          <circle cx={110} cy={110} r={9} fill={COL.ink} />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: COL.ink, textShadow: extrude(8, "#000") }}>{hh}:{String(mm).padStart(2, "0")}<span style={{ fontSize: 46, color: COL.dim, marginLeft: 8 }}>h</span></div>
      </div>
    </div>
  );
};

export const Min1Body: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];

  // ===== A · 0 → calle · avatar "11 de la noche del segundo día"; portal a la cuadra negra =====
  if (t < A.calle + 0.1) {
    L.push(<Avatar key="avA" t={t} blur={6 * e(t, A.calle - 0.55, A.calle)} />);
    L.push(<Stamp key="d2" t={t} at={0.5} text="DÍA 2 · 23:00" x={1430} y={250} out={A.calle - 0.6} rot={-6} size={84} col={COL.amber} />);
    const r = ei(t, A.calle - 0.6, A.calle);
    if (r > 0) L.push(<Portal key="pA" x={1460} y={250} r={r}><World t={Math.max(A.calle - 0.6, t)} /></Portal>);
  }
  // ===== B · calle → perros · la cuadra negra; latigazo a la calle filmada =====
  if (t >= A.calle && t < A.perros + 0.55) {
    const k = ei(t, A.perros, A.perros + 0.5);
    L.push(<Whip key="wB" k={k} prev={<><World t={t} /><Head t={t} at={A.calle + 0.4} out={A.perros - 0.3} text="TU CALLE · NEGRA" y={150} size={76} /></>} cur={<Take k="h_calle" a={A.perros} />} />);
  }
  // ===== C · perros → cocina · la calle filmada (perros, generador lejos); zoom a la ventana del vecino =====
  if (t >= A.perros + 0.5 && t < A.cocina + 0.6) {
    const z = ei(t, A.cocina, A.cocina + 0.55);
    L.push(<AbsoluteFill key="tC" style={{ transformOrigin: "1150px 470px", transform: `scale(${1 + z * z * 6})`, filter: z > 0.05 ? `blur(${z * 18}px)` : undefined, opacity: 1 - e(t, A.cocina + 0.3, A.cocina + 0.55) }}><Take k="h_calle" a={A.perros} /></AbsoluteFill>);
    if (z > 0.3) L.unshift(<AbsoluteFill key="cIn"><Take k="h_carne" a={A.cocina} /></AbsoluteFill>);
  }
  // ===== D · cocina → cuadra · la carne del mes suda; el termómetro sube; latigazo al avatar =====
  if (t >= A.cocina + 0.3 && t < A.cuadra + 0.55) {
    const k = ei(t, A.cuadra, A.cuadra + 0.5);
    L.push(<Whip key="wD" k={k} prev={
      <HeatHaze t={t} amt={e(t, A.carne, A.sudar + 1) * 0.55}>
        <Take k="h_carne" a={A.cocina} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, transparent 45%, rgba(0,0,0,.55) 100%)" }} />
        <Tag t={t} at={A.carne} x={700} y={560} dx={-180} dy={170} text="LA CARNE DEL MES" col={COL.red} out={A.cuadra - 0.3} size={46} />
        <Thermo t={t} at={A.cocina + 0.4} x={1600} y={470} from={4} to={11} dur={A.sudar - A.cocina} out={A.cuadra - 0.3} />
      </HeatHaze>} cur={<Avatar t={t} />} />);
  }
  // ===== E · cuadra → adentro · avatar "una sola ventana con luz. Es la mía"; zoom por la ventana al mundo =====
  if (t >= A.cuadra + 0.45 && t < A.adentro + 0.6) {
    const z = ei(t, A.adentro - 0.15, A.adentro + 0.45);
    L.push(<AbsoluteFill key="avE" style={{ transformOrigin: "960px 380px", transform: `scale(${1 + z * z * 7})`, filter: z > 0.05 ? `blur(${z * 18}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Stamp key="mia" t={t} at={A.mia} text="ES LA MÍA" x={1420} y={300} out={A.adentro - 0.3} rot={6} size={96} col={COL.amber} />);
    if (z > 0.35) L.push(<AbsoluteFill key="wE" style={{ opacity: (z - 0.35) / 0.65 }}><World t={A.adentro + 0.45} /></AbsoluteFill>);
  }
  // ===== F · adentro → foquito · la casa encendida, la cámara entra a la cocina: 4 °C =====
  if (t >= A.adentro + 0.45 && t < A.foquito + 0.6) {
    L.push(<World key="wF" t={t} />);
    const h = screenOf(t, PT.house), fr = screenOf(t, PT.fridge);
    L.push(<Tag key="un" t={t} at={A.adentro + 0.6} x={h.x} y={h.y - 140} dx={230} dy={-130} text="UNA SOLA VENTANA" col={COL.amber} out={A.grados4 - 0.5} size={50} />);
    L.push(<Tag key="fr" t={t} at={A.grados4} x={fr.x} y={fr.y} dx={-260} dy={-120} text="ANDANDO" sub="REFRIGERADOR VIEJO" col={COL.ice} out={A.foquito - 0.1} size={46} />);
    L.push(<Thermo key="t4" t={t} at={A.grados4 - 0.1} x={260} y={330} from={4} to={4} dur={0.4} out={A.foquito + 0.2} />);
    const r = ei(t, A.foquito, A.foquito + 0.55);
    if (r > 0) L.push(<Portal key="pF" x={fr.x} y={fr.y} r={r}><Take k="c_abrir_luz" a={A.foquito} /></Portal>);
  }
  // ===== G · foquito → mantiene · TOMA DE PLATA 2: se abre la puerta y la luz se prende =====
  if (t >= A.foquito + 0.5 && t < A.mantiene + 0.6) {
    const z = ei(t, A.mantiene, A.mantiene + 0.55);
    L.push(<AbsoluteFill key="gG" style={{ opacity: 1 - z, transform: `scale(${1 - 0.25 * z})`, filter: z > 0.05 ? `blur(${z * 14}px)` : undefined }}><Take k="c_abrir_luz" a={A.foquito} /></AbsoluteFill>);
    if (z > 0) L.unshift(<AbsoluteFill key="wG"><World t={A.mantiene + 0.55} /></AbsoluteFill>);
  }
  // ===== H · mantiene → avatar · el río de luz del enchufe al auto: el tanque lleno =====
  if (t >= A.mantiene + 0.5 && t < A.auto + 0.6) {
    L.push(<World key="wH" t={t} />);
    const pl = screenOf(t, PT.plug), b = screenOf(t, PT.bat);
    L.push(<Tag key="en" t={t} at={A.mantiene + 0.6} x={pl.x} y={pl.y} dx={160} dy={-160} text="UN CABLE" sub="UNA EXTENSIÓN · UN APARATO" col="#ff9a4a" out={A.mantiene + 1.9} size={44} />);
    L.push(<Tag key="bt" t={t} at={A.auto - 1.0} x={b.x} y={b.y} dx={-250} dy={-170} text="LA BATERÍA DE MI AUTO" col="#7dff9e" out={1e9} size={54} />);
    L.push(<Flash key="flH" t={t} at={A.auto + 0.45} col="#eaf6ff" peak={0.8} w={0.3} />);
  }
  // ===== I · avatar "la misma que está en tu entrada… sin paneles, sin generador" =====
  if (t >= A.auto + 0.45 && t < A.litio + 0.6) {
    const z = ei(t, A.litio - 0.1, A.litio + 0.45);
    L.push(<AbsoluteFill key="avI" style={{ transform: `scale(${1 - z * 0.3})`, opacity: 1 - z, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    L.push(<Stamp key="sp" t={t} at={A.paneles} text="SIN PANELES ✗" x={560} y={860} out={A.litio - 0.3} rot={-5} size={72} />);
    L.push(<Stamp key="sg" t={t} at={A.generador} text="SIN GENERADOR ✗" x={1360} y={860} out={A.litio - 0.3} rot={4} size={72} />);
    if (z > 0) L.unshift(<AbsoluteFill key="wI"><World t={A.litio + 0.45} /></AbsoluteFill>);
  }
  // ===== J · litio → medí · el tanque de cerca; "sin litio de US$1000"; se aleja: el cielo gira 3 veces = 3 DÍAS =====
  if (t >= A.litio + 0.4 && t < A.medi + 0.6) {
    const r = ei(t, A.medi, A.medi + 0.55);
    L.push(<World key="wJ" t={t} />);
    L.push(<Stamp key="li" t={t} at={A.mil} text="SIN LITIO DE US$1000" x={960} y={170} out={A.tres - 0.2} rot={-4} size={78} />);
    L.push(<BigNum key="3d" t={t} at={A.tres + 0.1} text="3 DÍAS" size={230} y={500} out={A.medi - 0.25} sub="SEGUIDOS" />);
    if (r > 0) L.push(<Portal key="pJ" x={960} y={560} r={r}><Take k="c_tester" a={A.medi} /></Portal>);
  }
  // ===== K · medí → pero · TOMA DE PLATA 1: EL TESTER EN LA MANO (las piezas al costado, nunca encima) =====
  if (t >= A.medi + 0.5 && t < A.pero + 0.55) {
    const k = ei(t, A.pero, A.pero + 0.5);
    L.push(<Whip key="wK" k={k} prev={<>
      <Take k="c_tester" a={A.medi} z={[1.0, 1.04]} />
      <Lcd t={t} at={A.medi + 0.6} out={A.noche - 0.1} v="12,63" x={1560} y={230} label="DÍA 1 · 6:00" />
      <Lcd t={t} at={A.noche} out={A.pero - 0.2} v="12,10" x={1560} y={230} label="DÍA 1 · 24 H" col="#ffd36a" />
      <Head t={t} at={A.medi + 0.2} out={A.pero - 0.2} text="LO MEDÍ" y={880} size={64} col={COL.ink} />
    </>} cur={<Avatar t={t} />} dir={1} />);
  }
  // ===== L · pero → sola · avatar + rótulo "un tipo con una pinza en la mano" =====
  if (t >= A.pero + 0.45 && t < A.sola + 0.6) {
    const z = ei(t, A.sola - 0.1, A.sola + 0.45);
    L.push(<AbsoluteFill key="avL" style={{ transform: `scale(${1 - z * 0.3})`, opacity: 1 - z, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined }}><Avatar t={t} /></AbsoluteFill>);
    if (z > 0) L.unshift(<AbsoluteFill key="wL"><World t={A.sola + 0.45} /></AbsoluteFill>);
  }
  if (t >= A.pero + 0.6 && t < A.sola + 0.5) L.push(<LowerThird key="lt" t={t} at={A.pero + 0.6} out={A.sola} name="CLAUDIO MENDOZA" l2="CONSTRUCTOR · LO MEDÍ YO" l2at={A.pinza - 0.3} />);
  // ===== M · sola → fin del minuto · "esa batería SOLA no lo hace"; la prueba vieja: el tanque se vacía, 3 h 08 =====
  if (t >= A.sola + 0.4) {
    L.push(<World key="wM" t={t} />);
    const b = screenOf(t, PT.bat);
    L.push(<Stamp key="so" t={t} at={A.sola + 0.5} text="SOLA, NO" x={b.x - 520} y={b.y - 330} out={A.canal - 0.1} rot={-7} size={110} />);
    L.push(<Clock key="ck" t={t} a={A.canal + 0.6} b={A.duro + 0.4} out={A.h3 - 0.2} />);
    L.push(<Tag key="vc" t={t} at={A.duro} x={b.x} y={b.y - 40} dx={-260} dy={-150} text="11,8 V" sub="VACÍA" col={COL.red} out={A.h3 - 0.2} size={58} />);
    L.push(<BigNum key="308" t={t} at={A.duro + 0.5} text="3 h 08 min" size={150} x={760} y={760} out={A.h3 - 0.2} col={COL.red} edge="#4a0f0a" />);
    L.push(<Head key="h3" t={t} at={A.h3} out={1e9} text="3 HORAS, NO 3 DÍAS" y={170} size={88} col={COL.amber} />);
  }
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};

export const Min1: React.FC = () => <Min1Body t={useCurrentFrame() / 30} />;
