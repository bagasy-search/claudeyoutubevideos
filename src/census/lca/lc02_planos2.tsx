// lc02 · planos 41-80 (188,05 → 394,05 s): el reloj radiocontrolado y la Navidad, el diente (absceso, farmacia, las pinzas),
// el silencio y la regla 3, el lago que nunca se congela, el día 130, el escáner y la voz de Gus, el 3 en el cuaderno.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Calendario, Globo, Pildora, Temporizador } from "../../anikit/pantalla";
import { Lata } from "../../anikit/props";
import { Supermercado, SUPER_PISO, SUPER_PUNTOS } from "../../anikit/sets/super";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, GUS, JUNE, JUNE_INV, PAL, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { FRIO } from "../hud";
import { NieveCae } from "../mundo/comun";
import { Panorama } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { CanalPark, CANAL_PISO, CANAL_PUNTOS, Puente, PUENTE_PISO, PUENTE_PUNTOS } from "../mundo/puente";
import { Barrio, BARRIO_PISO, Living, LIV_PISO, LIV_PUNTOS } from "../mundo/casa";
import { Ore } from "../mundo/ore";
import { CuadernoGrande, DatoGrande, DuoFrente, kDe, Lapiz, NotaHeladera, Pj, Vela } from "./base";
import { Antartida, CabezaInf, Cartas, Diente, Escaner, Frasco, Libro, Linterna, Pinzas, RelojRadio, TorreWWVB } from "./lc02_props";
import { DosMantas, LIV_INV } from "./lc02_planos1";

const P = LIV_PISO;
const B = BARRIO_PISO;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const OSCURO: React.CSSProperties = { background: "radial-gradient(ellipse at 50% 50%, #2a2236 0%, #0d0b12 85%)" };
const RelojMano: React.FC = () => <g transform="translate(0,-26)"><rect x={-34} y={-24} width={68} height={48} rx={8} fill="#2a2a30" /><rect x={-26} y={-16} width={52} height={24} rx={3} fill="#9fe0a0" /></g>;

// ---------- 41 · Theo encuentra un reloj radiocontrolado ----------
export const P41Reloj: React.FC = () => {
  const k = kDe(188.05);
  return (
    <AbsoluteFill>
      <Escena Set={Supermercado} pal={PAL} claves={[mira(0, SUPER_PUNTOS.pasillo, SUPER_PISO - 300, 1.4), mira(185, SUPER_PUNTOS.pasillo + 60, SUPER_PISO - 330, 1.75, { curva: "inout" })]} seed={41} setProps={{}}
        medio={<Pj look={THEO_INV} ruta={[{ f: 0, x: SUPER_PUNTOS.pasillo, y: SUPER_PISO }]} enManoD={<RelojMano />} poses={[{ f: 0, v: "parado" }, { f: k(189.4), v: { hD: -60, cD: -110 } }]} caras={[{ f: 0, v: "duda" }, { f: k(190.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.3 } }]} />} />
      <Pildora texto="RADIO-CONTROLLED CLOCK" x={960} y={140} desde={k(188.7)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 42 · la señal de Colorado sigue sonando ----------
export const P42Torre: React.FC = () => {
  const f = useF();
  const k = kDe(194.41);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#141a2e, #2a3150)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 120], [1, 1.06])})` }}>
        <rect x={0} y={900} width={1920} height={180} fill="#3a3a2e" />
        <TorreWWVB f={f} x={960} piso={900} />
      </svg>
      <Pildora texto="FORT COLLINS · COLORADO" x={960} y={140} desde={k(194.6)} color={AMBAR} tam={44} />
      <Pildora texto="STILL TRANSMITTING · ON BACKUP POWER" x={960} y={980} desde={k(196.2)} color="#f6ecd2" tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 43 · 25 de diciembre ----------
export const P43Fecha: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={OSCURO}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Halo x={960} y={540} r={600} color="#ffb060" fuerza={0.25} />
        <RelojRadio x={960} y={540} s={interpolate(f, [0, 34], [1.6, 1.75])} fecha={f < 12 ? "DEC 24" : "DEC 25"} hora="7:42" f={f} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 44 · jamón en lata y duraznos junto a la estufa ----------
export const P44Cena: React.FC = () => {
  const k = kDe(199.6);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1740, P - 260, 1.55), mira(140, 1760, P - 250, 1.75)]} seed={44} setProps={{ ...LIV_INV, hora: "noche" }}
        medio={<DosMantas x={1600} caras={["feliz", "feliz"]} manos={[<Lata key="a" color="#c0352c" />, <Lata key="b" color="#e0a23a" />]} />} />
      <Pildora texto="CANNED HAM & PEACHES" x={960} y={140} desde={k(200.8)} color={AMBAR} tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 45 · June escribe solo la palabra Navidad ----------
export const P45Navidad: React.FC = () => {
  const k = kDe(204.38);
  return <CuadernoGrande renglones={[{ t: "Day 83", desde: -999, y: 260 }, { t: "Christmas", desde: k(206.9), color: "#c0352c", y: 400, tam: 96 }]} zoom={[0, 1.05, 1.15]} vela />;
};

// ---------- 46 · el diente: día 90, Theo con la cara hinchada ----------
export const P46Diente: React.FC = () => {
  const k = kDe(208.1);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1700, P - 280, 1.1), mira(k(211.6), 1700, P - 230, 2.8, { curva: "inout" })]} seed={46} setProps={{ ...LIV_INV, hora: "invierno" }}
        medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(212.6), v: "manosCara" }]} caras={[{ f: 0, v: "cansado" }, { f: k(212.6), v: "enojo" }]} luz={BORDE_CALIDO} />} />
      <Pildora texto="THE TOOTH" x={960} y={140} desde={k(208.4)} color="#e2483a" tam={50} />
    </AbsoluteFill>
  );
};

// ---------- 47 · June lo sabe ----------
export const P47Sabe: React.FC = () => {
  const k = kDe(216.08);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1780, P - 300, 1.9), mira(135, 1790, P - 310, 2.1)]} seed={47} setProps={{ ...LIV_INV, hora: "invierno" }}
      medio={<>
        <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "triste" }]} luz={BORDE_CALIDO} />
        <Pj look={JUNE} ruta={[{ f: 0, x: 1870, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "agacharse" }]} caras={[{ f: 0, v: "duda" }, { f: k(218.4), v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: 0.2 } }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};

// ---------- 48 · un absceso ----------
export const P48Absceso: React.FC = () => {
  const f = useF();
  const k = kDe(220.54);
  return (
    <AbsoluteFill style={OSCURO}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Diente f={f} inf={interpolate(f, [k(220.6), k(224)], [0, 1], cl)} /></svg>
      <Pildora texto="ABSCESS" x={960} y={130} desde={k(220.6)} color="#e2483a" tam={52} />
    </AbsoluteFill>
  );
};

// ---------- 49 · a la mandíbula, al cuello, a la sangre ----------
export const P49Cabeza: React.FC = () => {
  const f = useF();
  const k = kDe(225.16);
  const p = (a: number) => interpolate(f, [k(a), k(a) + 18], [0, 1], cl);
  return (
    <AbsoluteFill style={OSCURO}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><CabezaInf prog={[p(228.4), p(229.1), p(229.8)]} /></svg>
      {["JAW", "NECK", "BLOOD"].map((t, i) => <Pildora key={t} texto={t} x={1500} y={300 + i * 140} desde={k([228.4, 229.1, 229.8][i])} color="#e2483a" tam={46} />)}
    </AbsoluteFill>
  );
};

// ---------- 50 · ningún dentista en la Tierra ----------
export const P50Dentista: React.FC = () => {
  const k = kDe(230.4);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.dentista, SUP_PISO - 320, 1.2), mira(105, SUP_PUNTOS.dentista, SUP_PISO - 330, 1.35)]} seed={50} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true }} />
      <Pildora texto="NO DENTIST ON EARTH" x={960} y={900} desde={k(231.2)} color="#e2483a" tam={64} />
    </AbsoluteFill>
  );
};

// ---------- 51 · la farmacia, a tres cuadras ----------
export const P51Farmacia: React.FC = () => {
  const k = kDe(233.98);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.farmacia - 150, SUP_PISO - 300, 1.3), mira(100, SUP_PUNTOS.farmacia - 80, SUP_PISO - 310, 1.4)]} seed={51} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true }}
        medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: SUP_PUNTOS.farmacia - 520, y: SUP_PISO }, { f: 100, x: SUP_PUNTOS.farmacia - 300 }]} enManoD={<Linterna largo={380} />} poses={[{ f: 0, v: { hD: 0, cD: -10 } }]} caras={[{ f: 0, v: "determinado" }]} luz={BORDE_FRIO} seed={2} />} />
      <Pildora texto="PHARMACY · 3 BLOCKS" x={960} y={900} desde={k(234.9)} color={AMBAR} tam={62} />
    </AbsoluteFill>
  );
};

// ---------- 52 · en la tormenta, con linterna y bolsa ----------
export const P52Tormenta: React.FC = () => {
  const k = kDe(237.38);
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.farmacia - 500, SUP_PISO - 280, 1.5), mira(145, SUP_PUNTOS.farmacia - 200, SUP_PISO - 280, 1.6)]} seed={52} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
      medio={<>
        <Halo x={SUP_PUNTOS.farmacia - 10} y={SUP_PISO - 300} r={420} color="#fff2c8" fuerza={0.3} />
        <Pj look={JUNE_INV} ruta={[{ f: 0, x: SUP_PUNTOS.farmacia - 700, y: SUP_PISO }, { f: 145, x: SUP_PUNTOS.farmacia - 300 }]} enManoD={<Linterna />} poses={[{ f: 0, v: { hD: 0, cD: -10 } }]} caras={[{ f: 0, v: "determinado" }]} luz={BORDE_FRIO} seed={2} />
      </>} />
  );
};

// ---------- 53 · antibióticos, todavía vigentes ----------
export const P53Frasco: React.FC = () => {
  const f = useF();
  const k = kDe(242.14);
  const pot = interpolate(f, [k(244.4), k(250)], [100, 82], cl);
  return (
    <AbsoluteFill style={OSCURO}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 300], [1, 1.07])})` }}>
        <Halo x={700} y={560} r={420} color="#fff2c8" fuerza={0.25} />
        <Frasco x={700} y={560} />
        <rect x={1150} y={460} width={560} height={60} rx={30} fill="#2a2a36" stroke="#f6ecd2" strokeWidth={4} />
        <rect x={1156} y={466} width={548 * pot / 100} height={48} rx={24} fill={pot > 90 ? "#7ad08a" : AMBAR} />
      </svg>
      <Pildora texto="STILL IN DATE" x={1430} y={340} desde={k(243.4)} color="#7ad08a" tam={60} />
      <Pildora texto={`POTENCY ${Math.round(pot)}%`} x={1430} y={640} desde={k(244.4)} color="#f6ecd2" tam={54} />
    </AbsoluteFill>
  );
};

// ---------- 54 · el consultorio: June con las pinzas ----------
export const P54Pinzas: React.FC = () => {
  const k = kDe(252.28);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.dentista, SUP_PISO - 300, 1.35), mira(k(257.8), SUP_PUNTOS.dentista + 40, SUP_PISO - 330, 2.2, { curva: "inout" })]} seed={54} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true }}
        medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: SUP_PUNTOS.dentista - 200, y: SUP_PISO }, { f: k(255), x: SUP_PUNTOS.dentista + 30 }]} enManoD={<Pinzas />} poses={[{ f: 0, v: "parado" }, { f: k(258.1), v: { hD: 70, cD: -30 } }]} caras={[{ f: 0, v: "determinado" }, { f: k(258.1), v: "miedo" }]} seed={2} />} />
      <Pildora texto="FORCEPS" x={960} y={140} desde={k(258.2)} color="#e2483a" tam={48} />
    </AbsoluteFill>
  );
};

// ---------- 55 · lo salteamos: cuatro minutos a la luz de la vela ----------
export const P55Vela: React.FC = () => {
  const f = useF();
  const k = kDe(259.28);
  const seg = Math.max(0, 240 - Math.floor(Math.max(0, f - k(260.6)) / 30) * 15);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1780, P - 300, 2.0), mira(120, 1790, P - 300, 2.25)]} seed={55} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.4, vela: true }}
        medio={<>
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "miedo" }]} luz={BORDE_CALIDO} />
          <Pj look={JUNE} ruta={[{ f: 0, x: 1880, y: P }]} dir={[{ f: 0, v: -1 }]} enManoD={<Pinzas />} poses={[{ f: 0, v: "agacharse" }]} caras={[{ f: 0, v: "determinado" }]} luz={BORDE_CALIDO} seed={2} />
          <g transform={`translate(1800,${P - 20})`}><Vela f={f} /></g>
          <Halo x={1800} y={P - 90} r={300} color="#ffcf6e" fuerza={0.4} />
        </>} />
      <Temporizador seg={seg} x={1560} y={110} desde={k(260.6)} color={AMBAR} tam={64} />
    </AbsoluteFill>
  );
};

// ---------- 56 · los minutos más largos: June se lava las manos con nieve ----------
export const P56Nieve: React.FC = () => {
  const k = kDe(263.32);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1950, B - 240, 1.7), mira(240, 1960, B - 230, 1.95)]} seed={56} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0.7, ventanaCasa: 1 }}
        medio={<>
          <Halo x={1900} y={B - 120} r={300} color="#ffcf6e" fuerza={0.3} />
          <Pj look={JUNE} ruta={[{ f: 0, x: 2000, y: B }]} poses={[{ f: 0, v: "arrodillado" }, { f: k(266.5), v: { hD: -40, cD: -40, hI: -40, cI: -40 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }]} luz={BORDE_FRIO} seed={2} />
        </>} />
      <Pildora texto="THE LONGEST MINUTES" x={960} y={140} desde={k(264)} color="#f6ecd2" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 57 · la hinchazón se fue: día 100 ----------
export const P57Sonrie: React.FC = () => {
  const k = kDe(271.3);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1760, P - 300, 2.0), mira(k(274.1), 1760, P - 290, 1.35, { curva: "inout" })]} seed={57} setProps={{ ...LIV_INV, hora: "invierno", cae: false }}
      medio={<>
        <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(272.6), v: { hD: 150, cD: 15 } }]} caras={[{ f: 0, v: "feliz" }, { f: k(272.6), v: "risa" }]} luz={BORDE_CALIDO} />
        <Pj look={JUNE} ruta={[{ f: 0, x: 1880, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "feliz" }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};

// ---------- 58 · el silencio ----------
export const P58Silencio: React.FC = () => (
  <Escena Set={Living} pal={PAL} claves={[mira(0, 1900, P - 280, 1.3), mira(220, 1900, P - 280, 1.2)]} seed={58} setProps={{ ...LIV_INV, hora: "invierno" }}
    medio={<>
      <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1420, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -1, y: 0.4 } }]} luz={BORDE_CALIDO} />
      <Pj look={JUNE} ruta={[{ f: 0, x: 2400, y: P }]} dir={[{ f: 0, v: 1 }]} enManoD={<Lapiz />} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }]} luz={BORDE_CALIDO} seed={2} />
    </>} />
);

// ---------- 59 · los investigadores polares tienen nombre para eso ----------
export const P59Antartida: React.FC = () => {
  const f = useF();
  const k = kDe(284.2);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#3a4a6a, #c8d4e6)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 280], [1, 1.07])})` }}>
        <Antartida f={f} />
        <NieveCae f={f} n={90} x0={0} w={1920} y0={0} h={1080} />
      </svg>
      <Pildora texto="POLAR RESEARCHERS" x={960} y={120} desde={k(284.3)} color="#f6ecd2" tam={58} />
      {["TROUBLE SLEEPING", "IRRITABILITY", "LOSING TIME", "THE STARE"].map((t, i) => <Pildora key={t} texto={t} x={420 + (i % 2) * 1080} y={760 + Math.floor(i / 2) * 110} desde={k([287.6, 288.7, 289.4, 291.1][i])} color={FRIO} tam={52} />)}
    </AbsoluteFill>
  );
};

// ---------- 60 · Theo mirando la ventana ----------
export const P60Mirada: React.FC = () => {
  const k = kDe(293.5);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1400, P - 250, 2.6), mira(160, 1405, P - 255, 2.95)]} seed={60} setProps={{ ...LIV_INV, hora: "invierno", cae: true }}
        medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 1420, y: P }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: -1, y: -0.2 } }]} luz={BORDE_FRIO} />} />
      <Pildora texto="NOT IN A STATION · NO PLANE IN SPRING" x={960} y={930} desde={k(296.4)} color={FRIO} tam={36} />
    </AbsoluteFill>
  );
};

// ---------- 61 · nadie viene, nunca ----------
export const P61Nadie: React.FC = () => (
  <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1600, 600, 0.9), mira(60, 1700, 610, 0.78)]} seed={61} setProps={{ hora: "invierno", luces: 0, ventana: 1, nieve: 1, cae: true, vapor: 0.8 }} />
);

// ---------- 62 · la tercera regla ----------
export const P62Regla3: React.FC = () => {
  const k = kDe(300.87);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.heladera - 100, P - 330, 1.3)]} seed={62} setProps={{ ...LIV_INV, reglas: 3 }} />
      <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: -999 }, { t: "2. NOTHING RISKY ALONE", desde: -999 }, { t: "3. A DAILY ROUTINE", desde: k(301.9) }]} x={640} y={170} w={820} />
    </AbsoluteFill>
  );
};

// ---------- 63 · Theo lee libros de la biblioteca ----------
export const P63Lee: React.FC = () => (
  <Escena Set={Living} pal={PAL} claves={[mira(0, 1700, P - 280, 1.7), mira(73, 1710, P - 280, 1.8)]} seed={63} setProps={{ ...LIV_INV, hora: "invierno" }}
    medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} enManoD={<Libro />} poses={[{ f: 0, v: "sentadoSuelo" }, { f: 1, v: { hD: -70, cD: -120 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 0.5, y: 0.6 } }]} luz={BORDE_CALIDO} />} />
);

// ---------- 64 · June le toma el pulso ----------
export const P64Pulso: React.FC = () => (
  <Escena Set={Living} pal={PAL} claves={[mira(0, 1780, P - 280, 2.1)]} seed={64} setProps={{ ...LIV_INV, hora: "invierno" }}
    medio={<>
      <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "neutral" }]} luz={BORDE_CALIDO} />
      <Pj look={JUNE} ruta={[{ f: 0, x: 1860, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "agacharse" }]} caras={[{ f: 0, v: "determinado" }]} luz={BORDE_CALIDO} seed={2} />
    </>} />
);

// ---------- 65 · juegan a las cartas ----------
export const P65Cartas: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 2510, P - 260, 1.7)]} seed={65} setProps={{ ...LIV_INV, hora: "noche", vela: true }}
      medio={<>
        <Pj look={THEO_CASA} ruta={[{ f: 0, x: 2320, y: P }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "picaro" }]} luz={BORDE_CALIDO} />
        <Pj look={JUNE} ruta={[{ f: 0, x: 2700, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} caras={[{ f: 0, v: "risa" }]} luz={BORDE_CALIDO} seed={2} />
        <Cartas x={2510} y={P - 175} f={f} />
      </>} />
  );
};

// ---------- 66 · al mediodía caminan al lago ----------
export const P66Caminan: React.FC = () => {
  const k = kDe(311.67);
  return (
    <AbsoluteFill>
      <Escena Set={CanalPark} pal={PAL} claves={[mira(0, 1200, CANAL_PISO - 260, 1.2), mira(137, 1500, CANAL_PISO - 260, 1.25)]} seed={66} setProps={{ hora: "invierno", luces: 0, nieve: 1, vapor: 0.8, hielo: 0.7, ventanaGus: 0 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1000, y: CANAL_PISO }, { f: 137, x: 1500 }]} caras={[{ f: 0, v: "neutral" }]} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 860, y: CANAL_PISO }, { f: 137, x: 1360 }]} caras={[{ f: 0, v: "feliz" }]} seed={2} />
        </>} />
      <Pildora texto="NOON · THE LAKE" x={960} y={140} desde={k(312)} color={AMBAR} tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 67 · el puerto se congela; el lago casi nunca ----------
export const P67Hielo: React.FC = () => {
  const k = kDe(316.23);
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} claves={[mira(0, PUENTE_PUNTOS.centro, PUENTE_PISO - 200, 0.85), mira(190, PUENTE_PUNTOS.centro + 300, PUENTE_PISO - 160, 0.95)]} seed={67} setProps={{ hora: "invierno", luces: 0, nieve: 1, vapor: 1, hielo: 1 }} />
      <Pildora texto="THE HARBOR FREEZES" x={600} y={140} desde={k(316.4)} color={FRIO} tam={40} />
      <Pildora texto="THE LAKE ALMOST NEVER DOES" x={1300} y={230} desde={k(319.4)} color="#f6ecd2" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 68 · agua abierta, humeando ----------
export const P68Lago: React.FC = () => {
  const k = kDe(322.53);
  return (
    <AbsoluteFill>
      <Escena Set={CanalPark} pal={PAL} claves={[mira(0, CANAL_PUNTOS.lago, CANAL_PISO - 200, 0.9), mira(176, CANAL_PUNTOS.lago + 200, CANAL_PISO - 220, 1.0)]} seed={68} setProps={{ hora: "invierno", luces: 0, nieve: 1, vapor: 1, hielo: 0.3, ventanaGus: 0 }} />
      <DuoFrente looks={[THEO_INV, JUNE_INV]} xs={[320, 580]} y={1280} escala={2.2} caras={["sorpresa", "feliz"]} luz={BORDE_FRIO} />
      <Pildora texto="OPEN WATER · STEAMING" x={1300} y={140} desde={k(324.6)} color="#f6ecd2" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 69 · día 130: más de once horas de luz ----------
export const P69Sol: React.FC = () => {
  const k = kDe(328.39);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1900, B - 300, 0.95), mira(211, 1950, B - 300, 1.05)]} seed={69} setProps={{ hora: "dia", luces: 0, nieve: 0.8, humo: 0.5 }}
        medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: 2050, y: B }]} poses={[{ f: 0, v: "parado" }, { f: k(332), v: { hD: -150, cD: -10 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.4, y: -1 } }]} seed={2} />} />
      <Pildora texto="11+ HOURS OF LIGHT" x={960} y={140} desde={k(333.3)} color={AMBAR} tam={48} />
    </AbsoluteFill>
  );
};

// ---------- 70 · la última fila de leña ----------
export const P70Ultima: React.FC = () => (
  <Escena Set={Living} pal={PAL} claves={[mira(0, 520, P - 320, 1.4), mira(135, 540, P - 300, 1.6)]} seed={70} setProps={{ ...LIV_INV, lena: 0.07, hora: "dia", cae: false }}
    medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 780, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "agacharse" }]} caras={[{ f: 0, v: "feliz" }]} />} />
);

// ---------- 71 · lo lograron: se abrazan ----------
export const P71Abrazo: React.FC = () => {
  const k = kDe(339.97);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1780, P - 320, 1.4), mira(119, 1780, P - 270, 2.2, { curva: "inout" })]} seed={71} setProps={{ ...LIV_INV, hora: "dia", cae: false }}
        medio={<>
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1600, y: P }, { f: k(340.6), x: 1755 }]} poses={[{ f: 0, v: "parado" }, { f: k(340.6), v: { hD: 60, cD: 80, hI: 40, cI: 70 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(340.6), v: "feliz" }]} />
          <Pj look={JUNE} ruta={[{ f: 0, x: 1960, y: P }, { f: k(340.6), x: 1805 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: k(340.6), v: { hD: 60, cD: 80, hI: 40, cI: 70 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(340.6), v: "feliz" }]} seed={2} />
        </>} />
      <Pildora texto="THEY DID IT" x={960} y={140} desde={k(340.2)} color={AMBAR} tam={56} />
    </AbsoluteFill>
  );
};

// ---------- 72 · la radio: el escáner ----------
export const P72Escaner: React.FC = () => {
  const f = useF();
  const k = kDe(343.93);
  return (
    <AbsoluteFill style={OSCURO}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 260], [1, 1.1])})` }}>
        <Halo x={960} y={560} r={520} color="#9fe0a0" fuerza={0.15} />
        <Escaner f={f} x={960} y={560} s={1.5} freq={interpolate(f, [0, 260], [151.2, 162.4])} />
      </svg>
      <Pildora texto="THE SCANNER" x={960} y={130} desde={k(348.3)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 73 · 130 noches de estática ----------
export const P73Estatica: React.FC = () => {
  const f = useF();
  const k = kDe(352.63);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1720, P - 290, 1.7), mira(160, 1730, P - 290, 1.95)]} seed={73} setProps={{ ...LIV_INV, hora: "noche" }}
        medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} enManoD={<g transform="scale(0.35)"><Escaner f={f} x={0} y={-60} s={1} /></g>} poses={[{ f: 0, v: "sentadoSuelo" }, { f: 1, v: { hD: -60, cD: -110 } }]} caras={[{ f: 0, v: "cansado" }]} luz={BORDE_CALIDO} />} />
      <Pildora texto="130 NIGHTS OF STATIC" x={960} y={930} desde={k(353.2)} color="#b8bcc4" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 74 · una voz ----------
export const P74Voz: React.FC = () => {
  const f = useF();
  const k = kDe(357.97);
  return (
    <AbsoluteFill style={OSCURO}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 125], [1.15, 1.3])})` }}>
        <Escaner f={f} x={960} y={560} s={1.5} freq={162.4} voz={interpolate(f, [k(361.1), k(361.5)], [0, 1], cl)} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 75 · «Viejo, áspero, cansado… me llamo Gus» ----------
export const P75Gus: React.FC = () => {
  const k = kDe(362.09);
  const G = CANAL_PUNTOS.ventanaGus;
  return (
    <AbsoluteFill>
      <Escena Set={CanalPark} pal={PAL} claves={[mira(0, 1300, CANAL_PISO - 300, 0.85), mira(k(365.5), G.x + 200, G.y + 60, 1.6, { curva: "inout" })]} seed={75} setProps={{ hora: "noche", luces: 0, nieve: 1, vapor: 0.6, hielo: 0.4, ventanaGus: 1 }} />
      {["OLD", "ROUGH", "TIRED"].map((t, i) => <Pildora key={t} texto={t} x={560 + i * 400} y={900} desde={k([362.1, 362.8, 363.5][i])} color="#f6ecd2" tam={60} />)}
      <Globo texto="Anyone? My name is Gus." x={1240} y={240} desde={k(364.8)} hasta={k(368.5)} tam={56} />
    </AbsoluteFill>
  );
};

// ---------- 76 · Canal Park, una luz en mi ventana: yo y el perro ----------
export const P76Ventana: React.FC = () => {
  const f = useF();
  const k = kDe(368.57);
  return (
    <AbsoluteFill style={{ background: "#0d0b14" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 198], [1.35, 1.9])})`, transformOrigin: "960px 380px" }}>
        <rect x={360} y={120} width={1200} height={840} fill="#4a3a32" />
        {[0, 1, 2].map((c) => [0, 1].map((r) => <rect key={`${c}${r}`} x={420 + c * 380} y={170 + r * 400} width={320} height={340} fill={c === 1 && r === 0 ? "#ffcf6e" : "#1a1820"} />))}
        <Halo x={960} y={340} r={420} color="#ffcf6e" fuerza={interpolate(f, [k(371.2), k(371.8)], [0.2, 0.5], cl)} />
        <Pj look={GUS} ruta={[{ f: 0, x: 910, y: 640 }]} escala={1.45} poses={[{ f: 0, v: "parado" }, { f: k(371.3), v: "saludar" }]} caras={[{ f: 0, v: "cansado" }, { f: k(372.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0, y: 0 } }]} />
        <Ore x={1030} y={510} dir={-1} s={0.9} f={f} cola={1} />
        <NieveCae f={f} n={90} x0={0} w={1920} y0={0} h={1080} />
      </svg>
      <Pildora texto="CANAL PARK" x={960} y={60} desde={k(368.8)} color={AMBAR} tam={40} />
      <Globo texto="Me and the dog. Anyone?" x={1500} y={240} desde={k(372.7)} hasta={k(375.2)} tam={52} cola="izq" />
    </AbsoluteFill>
  );
};

// ---------- 77 · June agarra el cuaderno ----------
export const P77Agarra: React.FC = () => {
  const k = kDe(375.19);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1780, P - 290, 1.9), mira(k(377.2), 1840, P - 330, 2.4, { curva: "inout" })]} seed={77} setProps={{ ...LIV_INV, hora: "noche" }}
      medio={<>
        <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(377.2), v: "feliz" }]} luz={BORDE_CALIDO} />
        <Pj look={JUNE} ruta={[{ f: 0, x: 1880, y: P }]} dir={[{ f: 0, v: -1 }]} enManoD={<g transform="translate(0,-20)"><rect x={-40} y={-30} width={80} height={60} rx={4} fill="#c0352c" /></g>} poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(375.3), v: { hD: -70, cD: -110 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(377.2), v: "triste" }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};

// ---------- 78 · bajo el 2 escribe: Three ----------
export const P78Tres: React.FC = () => {
  const k = kDe(378.75);
  return <CuadernoGrande renglones={[{ t: "POPULATION", desde: -999, y: 200, tam: 56 }, { t: "1", desde: -999, y: 300, tam: 110 }, { t: "2", desde: -999, y: 440, tam: 110 }, { t: "3", desde: k(381.4), color: "#c0352c", y: 580, tam: 130 }]} zoom={[0, 1.1, 1.3]} vela />;
};

// ---------- 79 · CTA: ¿qué regla los salvó? ----------
export const P79Cta: React.FC = () => {
  const k = kDe(382.59);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.heladera - 100, P - 330, 1.3)]} seed={79} setProps={{ ...LIV_INV, reglas: 3 }} />
      <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: -999 }, { t: "2. NOTHING RISKY ALONE", desde: -999 }, { t: "3. A DAILY ROUTINE", desde: -999 }]} x={640} y={170} w={820} />
      <Globo texto="Which rule saved them? Comment!" x={1400} y={700} desde={k(383)} hasta={k(391)} tam={50} />
      <Pildora texto="SUBSCRIBE · DON'T MISS EP. 3" x={960} y={930} desde={k(386.5)} color={AMBAR} tam={58} />
    </AbsoluteFill>
  );
};

// ---------- 80 · lo que viene: diez personas, una ciudad ----------
export const P80Next: React.FC = () => {
  const k = kDe(391.05);
  return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1700, 600, 0.82), mira(90, 1650, 600, 0.9)]} seed={80} setProps={{ hora: "ocaso", luces: 0, ventana: 1, nieve: 0.6, vapor: 0.5 }} />
      <AbsoluteFill style={{ background: "rgba(10,8,16,0.45)" }} />
      <Pildora texto="NEXT: 10 PEOPLE · 1 CITY" x={960} y={500} desde={k(391.2)} color={AMBAR} tam={64} />
    </AbsoluteFill>
  );
};
