// lc02 · planos 1-40 (0 → 188,05 s): cuadro 0 = la miniatura (ventana escarchada, los dos bajo mantas junto a la estufa),
// enero a −28, un solo cuarto, la leña (cuerdas, motosierra de a dos, madera seca), el frío, el CO y la alarma de US$9, día 83.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Calendario, Globo, Pildora, RelojDia } from "../../anikit/pantalla";
import { Lata } from "../../anikit/props";
import { Cocina, COCINA_PISO, COCINA_PUNTOS } from "../../anikit/sets/cocina";
import { Supermercado, SUPER_PISO, SUPER_PUNTOS } from "../../anikit/sets/super";
import { Look } from "../../anikit/personaje";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_INV, PAL, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { FRIO } from "../hud";
import { NieveCae } from "../mundo/comun";
import { Panorama, PANO_PISO } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { Puente, PUENTE_PISO, PUENTE_PUNTOS } from "../mundo/puente";
import { Barrio, BARRIO_PISO, BARRIO_PUNTOS, Estufa, Living, LIV_PISO, LIV_PUNTOS } from "../mundo/casa";
import { StMarys } from "../mundo/hospital";
import { CuadernoGrande, DatoGrande, DuoFrente, kDe, NotaHeladera, Pj } from "./base";
import { BolsaDormir, CasaCorte, Cuerda, Manta, Motosierra, Pino, Tablas, Termometro } from "./lc02_props";

const P = LIV_PISO;
const B = BARRIO_PISO;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
// el living en pleno invierno (mantas en las puertas, plástico en la ventana, ventisca afuera)
export const LIV_INV = { hora: "tormenta", luces: 0, fuego: 1, lena: 0.45, latas: 0.8, mantas: true, plastico: true, reglas: 2, cae: true };
const VOS: Look = { estilo: "palo", camisa: "#8a8f9a", manga: "larga", pantalon: "#3a3f4a", zapatos: "#1a1410" };

// los dos sentados en el piso bajo mantas escocesas (coordenadas del mundo)
export const DosMantas: React.FC<{ x: number; caras?: [string, string]; theo?: Look; june?: Look; f?: number; manos?: [React.ReactNode, React.ReactNode] }> = ({ x, caras = ["neutral", "neutral"], theo = THEO, june = JUNE, manos }) => (
  <>
    <Pj look={theo} ruta={[{ f: 0, x, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: caras[0] }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} enManoD={manos?.[0]} />
    <Pj look={june} ruta={[{ f: 0, x: x + 170, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: caras[1] }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} enManoD={manos?.[1]} />
    <Manta x={x + 30} y={P + 6} w={230} h={120} id="t" />
    <Manta x={x + 200} y={P + 6} w={230} h={120} color="#3a4a7a" raya="#9a3a34" id="j" />
  </>
);

// escarcha de helecho en una ventana (pantalla)
const Escarcha: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g opacity={0.85}>
    {Array.from({ length: 9 }).map((_, i) => {
      const bx = i < 5 ? x + (i * w) / 9 : x + w - ((i - 5) * w) / 8;
      const by = i < 5 ? y + h : y;
      const d = i < 5 ? -1 : 1;
      const L = 90 + (i * 37) % 80;
      return <g key={i} stroke="#eef4ff" strokeWidth={4} fill="none" strokeLinecap="round">
        <path d={`M${bx},${by} L${bx + 14},${by + d * L}`} />
        {[0.3, 0.55, 0.8].map((t) => <path key={t} d={`M${bx + 14 * t},${by + d * L * t} l-22,${d * 18} M${bx + 14 * t},${by + d * L * t} l26,${d * 14}`} />)}
      </g>;
    })}
    <path d={`M${x},${y} h${w} v${h} h${-w} Z`} fill="#dfe8ff" opacity={0.12} />
  </g>
);

// ---------- 1 · CUADRO 0 = la miniatura sin texto ----------
export const P01Mini: React.FC = () => {
  const f = useF();
  // cámara: x 1650, y 520, zoom 0.95 → ventana (1060..1540, 230..650) en pantalla ≈ 400..855, 253..652
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1650, 520, 0.95), mira(30, 1652, 520, 0.96)]} seed={1} setProps={{ ...LIV_INV, lena: 0.6 }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Escarcha x={400} y={253} w={455} h={399} />
        <Halo x={1240} y={760} r={700} color="#ff9a4a" fuerza={0.35 + 0.04 * Math.sin(f / 3)} />
        <Pj look={THEO} ruta={[{ f: 0, x: 960, y: 1270 }]} escala={2.3} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} luz={BORDE_CALIDO} />
        <Pj look={JUNE} ruta={[{ f: 0, x: 1180, y: 1300 }]} escala={2.15} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        <Manta x={960} y={1110} w={520} h={340} id="mt" />
        <Manta x={1210} y={1120} w={480} h={300} color="#3a4a7a" raya="#9a3a34" id="mj" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 2 · enero en Duluth ----------
export const P02Enero: React.FC = () => (
  <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1900, 560, 0.9), mira(60, 1900, 600, 1.05)]} seed={2} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true, humo: 0.8, ventanaCasa: 1 }} />
);

// ---------- 3 · −28 afuera ----------
export const P03Termo: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#22304e, #4a5a7a)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <NieveCae f={f} n={140} x0={0} w={1920} y0={0} h={1080} />
        <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#e8d9b5" strokeWidth={80} />
        <Termometro temp={interpolate(f, [4, 44], [12, -28], cl)} x={960} y={560} />
        <Escarcha x={40} y={40} w={1840} h={1000} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 4 · sin luz en toda la ciudad ----------
export const P04SinLuz: React.FC = () => (
  <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1700, 600, 0.82), mira(70, 1620, 610, 0.76)]} seed={4} setProps={{ hora: "noche", luces: 0, ventana: 0, nieve: 1, cae: true, vapor: 0.6 }} />
);

// ---------- 5 · sin caldera, sin hospital, nadie a quien llamar ----------
export const P05Nadie: React.FC = () => {
  const k = kDe(7.26);
  return (
    <AbsoluteFill>
      <Escena Set={StMarys} pal={PAL} claves={[mira(0, 1100, 520, 0.8), mira(95, 1100, 500, 0.9)]} seed={5} setProps={{ hora: "noche", luces: 0, ventana: 0, nieve: 1, cae: true }} />
      {["NO FURNACE", "NO HOSPITAL", "NO ONE TO CALL"].map((t, i) => <Pildora key={t} texto={t} x={420 + i * 540} y={860} desde={k([7.4, 8.3, 9.2][i])} color="#e2483a" tam={62} />)}
    </AbsoluteFill>
  );
};

// ---------- 6 · toda tu especie: dos personas en un cuarto, una estufa que hace tic ----------
export const P06Cuarto: React.FC = () => {
  const k = kDe(10.38);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1700, P - 300, 1.0), mira(k(13), 1760, P - 240, 1.55, { curva: "inout" })]} seed={6} setProps={LIV_INV}
      medio={<DosMantas x={1560} caras={["cansado", "triste"]} />} />
  );
};

// ---------- 7 · la última vez: el día 41 en el puente ----------
export const P07Dia41: React.FC = () => {
  const f = useF();
  const k = kDe(15.48);
  const l = f < k(16.9) ? 1 : 0;
  return (
    <Escena Set={Puente} pal={PAL} claves={[mira(0, PUENTE_PUNTOS.centro, PUENTE_PISO - 240, 1.6), mira(80, PUENTE_PUNTOS.centro, PUENTE_PISO - 260, 1.4)]} seed={7}
      setProps={{ hora: "noche", luces: l, nieve: 1, vapor: 1, hielo: 0.3 }}
      medio={<Pj look={THEO_INV} ruta={[{ f: 0, x: PUENTE_PUNTOS.centro - 40, y: PUENTE_PISO }]} caras={[{ f: 0, v: "neutral" }, { f: k(17), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} luz={BORDE_FRIO} />} />
  );
};

// ---------- 8 · una ciudad llena de comida y 90 días de invierno ----------
export const P08Comida: React.FC = () => {
  const k = kDe(18.26);
  return (
    <AbsoluteFill>
      <Escena Set={Supermercado} pal={PAL} claves={[mira(0, SUPER_PUNTOS.piramide - 300, SUPER_PISO - 330, 1.2), mira(146, SUPER_PUNTOS.piramide, SUPER_PISO - 340, 1.35)]} seed={8} setProps={{}}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: SUPER_PUNTOS.piramide - 420, y: SUPER_PISO }]} enManoD={<Lata color="#c0352c" />} poses={[{ f: 0, v: { hD: -40, cD: -110 } }]} caras={[{ f: 0, v: "feliz" }]} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: SUPER_PUNTOS.piramide - 240, y: SUPER_PISO }]} caras={[{ f: 0, v: "duda" }, { f: k(20.8), v: "miedo" }]} seed={2} />
        </>} />
      <Pildora texto="A CITY FULL OF FOOD" x={960} y={150} desde={k(19.0)} color={AMBAR} tam={44} />
      <Calendario texto="90 DAYS OF WINTER" x={1480} y={260} desde={k(20.8)} tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 9 · ¿dos personas sobreviven solas el primer invierno? ----------
export const P09Pregunta: React.FC = () => {
  const k = kDe(23.12);
  return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1700, 600, 0.78), mira(160, 1600, 610, 0.86)]} seed={9} setProps={{ hora: "invierno", luces: 0, ventana: 0, nieve: 1, cae: true, vapor: 0.8 }} />
      <DuoFrente looks={[THEO_INV, JUNE_INV]} xs={[300, 560]} y={1280} escala={2.2} caras={["determinado", "miedo"]} luz={BORDE_FRIO} />
      <Pildora texto="THE FIRST WINTER · ALONE" x={1260} y={160} desde={k(25.6)} color={FRIO} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 10 · contémoslo ----------
export const P10Cuenta: React.FC = () => <CuadernoGrande tapa zoom={[0, 1.08, 1.16]} luz="#2a2a3a" />;

// ---------- 11 · día 42: June cierra puertas ----------
const Hoja: React.FC<{ x: number; cierra: number }> = ({ x, cierra }) => <rect x={x} y={P - 620} width={240 * cierra} height={620} fill="#6a4a3a" stroke="#4a3228" strokeWidth={6} />;
export const P11Puertas: React.FC = () => {
  const f = useF();
  const k = kDe(29.58);
  const c = interpolate(f, [k(34.6), k(35.4)], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 2900, P - 300, 1.05), mira(k(34.6), 3380, P - 300, 1.3, { curva: "inout" })]} seed={11} setProps={{ ...LIV_INV, mantas: false, plastico: false, hora: "invierno", lena: 0.2 }}
        medio={<>
          <Hoja x={3550} cierra={c} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2700, y: P }, { f: k(34.4), x: 3480 }]} poses={[{ f: 0, v: "parado" }, { f: k(34.5), v: { hD: -90, cD: -10 } }, { f: k(35.6), v: "parado" }]} caras={[{ f: 0, v: "determinado" }]} seed={2} />
        </>} />
      {["EVERY BEDROOM", "THE BATHROOM", "THE UPSTAIRS HALL"].map((t, i) => <Pildora key={t} texto={`✕ ${t}`} x={520} y={300 + i * 80} desde={k([36.0, 37.3, 38.4][i])} color={FRIO} tam={36} />)}
    </AbsoluteFill>
  );
};

// ---------- 12 · mantas en las puertas, plástico en las ventanas ----------
export const P12Plastico: React.FC = () => {
  const f = useF();
  const k = kDe(39.4);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1250, P - 330, 1.9), mira(125, 1260, P - 330, 2.1)]} seed={12} setProps={{ ...LIV_INV, plastico: f > k(41.9), hora: "invierno" }}
      medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: 1180, y: P }]} poses={[{ f: 0, v: "agarrarAlto" }, { f: k(42.6), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: k(42.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} seed={2} />} />
  );
};

// ---------- 13 · no se calienta una casa: se calienta un cuarto ----------
export const P13Corte: React.FC = () => {
  const f = useF();
  const k = kDe(43.58);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a2440 0%, #0f0c16 85%)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 170], [1, 1.08])})` }}>
        <NieveCae f={f} n={80} x0={0} w={1920} y0={0} h={1080} />
        <CasaCorte f={f} frio={interpolate(f, [k(45.2), k(47.6)], [0, 1], cl)} />
        <rect x={300} y={830} width={1320} height={30} fill="#e9eef8" />
      </svg>
      <Pildora texto="YOU CAN'T HEAT A HOUSE" x={960} y={120} desde={k(45.2)} color={FRIO} tam={44} />
      <Pildora texto="YOU CAN HEAT ONE ROOM" x={960} y={930} desde={k(47.8)} color={AMBAR} tam={48} />
    </AbsoluteFill>
  );
};

// ---------- 14 · la casa se achica a un living ----------
export const P14Inventario: React.FC = () => {
  const k = kDe(49.44);
  const items: [string, number][] = [["A WOOD STOVE", 53.2], ["TWO MATTRESSES", 54.1], ["A TABLE", 55.7], ["A SHELF OF CANS", 56.6], ["THE RED NOTEBOOK", 58.2]];
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1500, P - 300, 1.15), mira(k(53), 1900, P - 300, 1.25, { curva: "inout" }), mira(k(55.6), 2450, P - 280, 1.3, { curva: "inout" }), mira(k(59.1), 2800, P - 300, 1.3, { curva: "inout" })]} seed={14} setProps={{ ...LIV_INV, lena: 0.15 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1760, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} caras={[{ f: 0, v: "cansado" }]} luz={BORDE_CALIDO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2480, y: P }]} poses={[{ f: 0, v: "pensar" }]} caras={[{ f: 0, v: "neutral" }]} dir={[{ f: 0, v: -1 }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      {items.map(([t, s], i) => <Pildora key={t} texto={t} x={1580} y={150 + i * 74} desde={k(s)} color={i === 4 ? "#e2483a" : AMBAR} tam={34} />)}
    </AbsoluteFill>
  );
};

// ---------- 15 · la estufa necesita leña ----------
const Lenio: React.FC = () => <g transform="translate(0,-20) rotate(-20)"><rect x={-50} y={-14} width={100} height={28} rx={12} fill="#8a5a3a" /><ellipse cx={50} cy={0} rx={10} ry={14} fill="#c89a6a" /></g>;
export const P15Lenia: React.FC = () => {
  const k = kDe(59.16);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1900, P - 230, 1.9), mira(85, 1920, P - 220, 2.1)]} seed={15} setProps={{ ...LIV_INV, fuego: 0.5 }}
      medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 1700, y: P }]} enManoD={<Lenio />} poses={[{ f: 0, v: "parado" }, { f: k(60.4), v: "tirarCarga" }, { f: k(61.1), v: "tirarSuelta" }]} caras={[{ f: 0, v: "determinado" }]} luz={BORDE_CALIDO} />} />
  );
};

// ---------- 16 · tres a seis cuerdas ----------
export const P16Cuerdas: React.FC = () => {
  const k = kDe(62.02);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1950, P - 300, 1.2)]} seed={16} setProps={{ ...LIV_INV, fuego: 0.8 }} />
      <AbsoluteFill style={{ background: "rgba(14,10,20,0.62)" }} />
      <DatoGrande claves={[{ f: 0, v: 3 }, { f: k(64.4), v: 6, d: 20 }]} prefijo="3 – " sufijo=" CORDS" rotulo="OF WOOD · ONE NORTHERN WINTER" y={330} tam={170} />
    </AbsoluteFill>
  );
};

// ---------- 17 · una cuerda: 4 × 4 × 8 pies ----------
export const P17Cuerda: React.FC = () => {
  const f = useF();
  const k = kDe(66.82);
  return (
    <Escena Set={Barrio} pal={PAL} claves={[mira(0, 2660, B - 260, 1.05), mira(140, 2640, B - 250, 1.1)]} seed={17} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0.6 }}
      medio={<>
        <Cuerda x={2300} piso={B} prog={interpolate(f, [k(67.4), k(70.6)], [0, 1], cl)} />
        <Pj look={THEO_INV} ruta={[{ f: 0, x: 2180, y: B }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} />
      </>} />
  );
};

// ---------- 18 · noviembre y casi nada partido ----------
export const P18Noviembre: React.FC = () => {
  const k = kDe(71.4);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 450, P - 300, 1.25), mira(96, 470, P - 280, 1.4)]} seed={18} setProps={{ ...LIV_INV, lena: 0.04, hora: "invierno" }}
        medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 760, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "duda" }, { f: k(73.2), v: "triste" }]} />} />
      <Calendario texto="NOVEMBER" x={1480} y={90} desde={k(71.8)} tam={50} />
      <Pildora texto="ALMOST NOTHING SPLIT" x={960} y={900} desde={k(72.9)} color="#e2483a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 19 · Theo es liniero: motosierras y árboles ----------
export const P19Liniero: React.FC = () => {
  const f = useF();
  const k = kDe(74.62);
  return (
    <Escena Set={Barrio} pal={PAL} claves={[mira(0, 2440, B - 240, 1.5), mira(146, 2480, B - 250, 1.7)]} seed={19} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0.6 }}
      medio={<>
        <Pino x={2700} piso={B} h={520} nieve={0.8} /><Pino x={2860} piso={B} h={420} nieve={0.8} />
        <Pj look={THEO_INV} ruta={[{ f: 0, x: 2420, y: B }]} enManoD={<Motosierra f={f} on={f > k(77.2)} />} poses={[{ f: 0, v: { hD: -30, cD: -80 } }]} caras={[{ f: 0, v: "determinado" }]} />
      </>} />
  );
};

// ---------- 20 · la regla de June en la heladera: nada de motosierra a solas ----------
export const P20Regla: React.FC = () => {
  const k = kDe(79.5);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.heladera - 100, P - 330, 1.3)]} seed={20} setProps={LIV_INV} />
      <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: -999 }, { t: "2. NOTHING RISKY ALONE", desde: -999 }, { t: "   no chainsaws alone!", desde: k(81.6) }]} x={640} y={170} w={820} />
    </AbsoluteFill>
  );
};

// ---------- 21 · cortan de a dos: uno con la sierra, otro mira ----------
const Cerco: React.FC<{ x: number; n: number }> = ({ x, n }) => <g>{Array.from({ length: n }).map((_, i) => <rect key={i} x={x + i * 46} y={B - 220} width={34} height={220} fill="#a8875a" stroke="#6a5030" strokeWidth={3} />)}<rect x={x - 10} y={B - 170} width={n * 46 + 10} height={18} fill="#8f7048" /></g>;
export const P21DeADos: React.FC = () => {
  const f = useF();
  const k = kDe(83.64);
  return (
    <Escena Set={Barrio} pal={PAL} claves={[mira(0, 2420, B - 240, 1.4), mira(k(85.2), 2380, B - 240, 1.5), mira(k(86.5), 2560, B - 250, 1.55, { curva: "inout" })]} seed={21} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0.6 }}
      medio={<>
        <Cerco x={2420} n={Math.max(2, 7 - Math.floor(Math.max(0, f - k(84.6)) / 30))} />
        <Pj look={THEO_INV} ruta={[{ f: 0, x: 2340, y: B }]} enManoD={<Motosierra f={f} on />} poses={[{ f: 0, v: { hD: -20, cD: -70 } }]} caras={[{ f: 0, v: "determinado" }]} giros={[{ f: 0, v: 0.04 }, { f: 3, v: -0.04 }, { f: 6, v: 0.04 }, { f: 9, v: -0.04 }, { f: 12, v: 0 }]} />
        <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2860, y: B }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "brazosCruzados" }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} seed={2} />
      </>} />
  );
};

// ---------- 22 · lo inteligente: no talar árboles verdes ----------
export const P22Bosque: React.FC = () => {
  const f = useF();
  const k = kDe(87.56);
  const x = interpolate(f, [k(91.4), k(91.9)], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#9fb4cc, #dfe6f0)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `scale(${interpolate(f, [0, 170], [1.0, 1.08])})` }}>
        <rect x={0} y={860} width={1920} height={220} fill="#eef2fa" />
        {Array.from({ length: 13 }).map((_, i) => <Pino key={i} x={80 + i * 150 + ((i * 53) % 40)} piso={880 + (i % 3) * 20} h={420 + ((i * 71) % 220)} color={i % 2 ? "#2f6a44" : "#3a7a50"} nieve={0.3} />)}
        <Pj look={THEO_INV} ruta={[{ f: 0, x: 1500, y: 1010 }]} escala={1.6} dir={[{ f: 0, v: -1 }]} enManoD={<Motosierra />} caras={[{ f: 0, v: "duda" }, { f: k(91.5), v: "determinado" }]} miradas={[{ f: 0, v: { x: -1, y: -0.3 } }]} />
        <g opacity={x} stroke="#e2483a" strokeWidth={40} strokeLinecap="round"><path d={`M560,240 L${560 + 800 * x},${240 + 560 * x}`} /><path d={`M1360,240 L${1360 - 800 * x},${240 + 560 * x}`} /></g>
      </svg>
      <Pildora texto="NO GREEN TREES" x={960} y={140} desde={k(91.6)} color="#e2483a" tam={50} />
    </AbsoluteFill>
  );
};

// ---------- 23 · madera seca: cercos, pallets, muebles viejos ----------
export const P23Seca: React.FC = () => {
  const k = kDe(93.14);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1100, B - 260, 1.2), mira(178, 1350, B - 260, 1.3)]} seed={23} setProps={{ hora: "invierno", luces: 0, nieve: 1, humo: 0.6 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 900, y: B }, { f: k(98.6), x: 1500 }]} enManoD={<Tablas />} poses={[{ f: 0, v: { hD: -50, cD: -100, hI: -40, cI: -100 } }]} caras={[{ f: 0, v: "determinado" }]} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1400, y: B }, { f: k(98.6), x: 1700 }]} enManoD={<Tablas />} poses={[{ f: 0, v: { hD: -50, cD: -100 } }]} caras={[{ f: 0, v: "feliz" }]} seed={2} />
        </>} />
      <Pildora texto="DRY WOOD" x={960} y={130} desde={k(93.4)} color={AMBAR} tam={50} />
      {["FENCES", "PALLETS", "OLD FURNITURE"].map((t, i) => <Pildora key={t} texto={t} x={560 + i * 400} y={230} desde={k([94.5, 95.4, 97.2][i])} color="#f6ecd2" tam={38} />)}
    </AbsoluteFill>
  );
};

// ---------- 24 · la seca arde fuerte; la verde silba y humea ----------
export const P24DosEstufas: React.FC = () => {
  const f = useF();
  const k = kDe(99.09);
  return (
    <AbsoluteFill style={{ background: "#2a2028" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={958} height={1080} fill="#3a2a2a" /><rect x={962} y={0} width={958} height={1080} fill="#2a2a32" />
        <rect x={0} y={880} width={1920} height={200} fill="#3a2a22" />
        <Estufa x={480} piso={880} f={f} fuego={1} />
        <Estufa x={1440} piso={880} f={f} fuego={f > k(100.6) ? 0.22 : 0} />
        {f > k(100.6) && Array.from({ length: 8 }).map((_, i) => { const t = ((f - k(100.6)) * 2 + i * 22) % 180; return <circle key={i} cx={1440 + Math.sin(i + t / 20) * 40} cy={640 - t * 2.4} r={26 + t / 4} fill="#8a8a92" opacity={0.6 * (1 - t / 180)} />; })}
        <rect x={958} y={0} width={4} height={1080} fill="#120f18" />
      </svg>
      <Pildora texto="DRY · BURNS HOT" x={480} y={150} desde={k(99.3)} color={AMBAR} tam={44} />
      <Pildora texto="GREEN · HISSES & SMOKES" x={1440} y={150} desde={k(100.8)} color="#b8bcc4" tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 25 · día 60: la pila más alta que Theo ----------
export const P25Pila: React.FC = () => {
  const f = useF();
  const k = kDe(103.65);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 520, P - 340, 1.15), mira(130, 540, P - 360, 1.3)]} seed={25} setProps={{ ...LIV_INV, lena: interpolate(f, [0, 60], [0.55, 1], cl) }}
      medio={<Pj look={THEO_CASA} ruta={[{ f: 0, x: 820, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: k(105.5), v: { hD: -150, cD: -20 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(105.5), v: "risa" }]} miradas={[{ f: 0, v: { x: -1, y: -0.6 } }]} luz={BORDE_CALIDO} />} />
  );
};

// ---------- 26 · ahora el frío ----------
export const P26Frio: React.FC = () => (
  <Escena Set={Superior} pal={PAL} claves={[mira(0, 2000, SUP_PISO - 260, 1.35), mira(140, 2300, SUP_PISO - 260, 1.45)]} seed={26} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
    medio={<>
      <Pj look={THEO_INV} ruta={[{ f: 0, x: 1800, y: SUP_PISO }, { f: 140, x: 2250 }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "cansado" }]} luz={BORDE_FRIO} />
      <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1620, y: SUP_PISO }, { f: 140, x: 2060 }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "triste" }]} luz={BORDE_FRIO} seed={2} />
    </>} />
);

// ---------- 27 · bajo cero de promedio; las peores noches pasan −30 ----------
export const P27Bajo: React.FC = () => {
  const f = useF();
  const k = kDe(112.69);
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} claves={[mira(0, 1200, 560, 0.75), mira(190, 1200, 560, 0.85)]} seed={27} setProps={{ hora: "invierno", luces: 0, nieve: 1, vapor: 1, cae: true, hielo: 0.6 }} />
      <AbsoluteFill style={{ background: "rgba(10,14,30,0.5)" }} />
      {f < k(117.9) ? <DatoGrande claves={[{ f: 0, v: 20 }, { f: k(114.9), v: -4, d: 30 }]} sufijo="°F" color={FRIO} rotulo="AVERAGE JANUARY LOW" y={330} tam={190} />
        : <DatoGrande claves={[{ f: 0, v: -4 }, { f: k(118.0), v: -31, d: 24 }]} sufijo="°F" color={FRIO} rotulo="THE WORST NIGHTS" y={330} tam={190} desde={k(117.9)} />}
    </AbsoluteFill>
  );
};

// ---------- 28 · la piel expuesta se congela en minutos ----------
export const P28Piel: React.FC = () => {
  const k = kDe(119.15);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1620, B - 290, 3.0), mira(110, 1620, B - 290, 3.3)]} seed={28} setProps={{ hora: "tormenta", luces: 0, nieve: 1, cae: true }}
        medio={<Pj look={THEO_INV} ruta={[{ f: 0, x: 1600, y: B }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "miedo" }]} giros={Array.from({ length: 30 }).map((_, i) => ({ f: i * 4, v: i % 2 ? 0.05 : -0.05 }))} luz={BORDE_FRIO} />} />
      <Pildora texto="EXPOSED SKIN FREEZES IN MINUTES" x={960} y={900} desde={k(119.8)} color={FRIO} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 29 · caños que revientan: un crack como un tiro ----------
const Chorro: React.FC<{ x: number; y: number; f: number; desde: number }> = ({ x, y, f, desde }) => {
  if (f < desde) return null;
  const t = Math.min(1, (f - desde) / 8);
  return <g>{Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${x},${y} l${(i - 3) * 30 * t},${-80 * t - (i % 2) * 30 * t}`} stroke="#eef4ff" strokeWidth={10} strokeLinecap="round" />)}<Halo x={x} y={y} r={180 * t} color="#cfe6ff" fuerza={0.7 * (1 - t) + 0.2} /></g>;
};
export const P29Canios: React.FC = () => {
  const f = useF();
  const k = kDe(122.81);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1700, 560, 0.72), mira(k(127.2), 1800, 580, 0.8), mira(k(127.7), 2700, B - 300, 1.5, { curva: "inout" })]} seed={29} setProps={{ hora: "noche", luces: 0, nieve: 1, humo: 0.8, ventanaCasa: 1 }}
        medio={<>
          <Chorro x={-300} y={B - 200} f={f} desde={k(123.6)} />
          <Chorro x={3550} y={B - 150} f={f} desde={k(124.4)} />
          <Chorro x={300} y={B - 250} f={f} desde={k(125.2)} />
          <Chorro x={2720} y={B - 220} f={f} desde={k(127.6)} />
        </>} />
      <Globo texto="CRACK!" x={1240} y={300} desde={k(127.6)} hasta={k(130.4)} tam={80} />
    </AbsoluteFill>
  );
};

// ---------- 30 · cada salida, una misión: capas, lana y no algodón ----------
export const P30Capas: React.FC = () => {
  const k = kDe(130.67);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1700, P - 280, 1.5), mira(250, 1720, P - 280, 1.7)]} seed={30} setProps={LIV_INV}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1600, y: P }]} poses={[{ f: 0, v: "parado" }, { f: k(133.6), v: { hD: -60, cD: -120, hI: -60, cI: -120 } }, { f: k(135), v: "firme" }]} caras={[{ f: 0, v: "determinado" }]} luz={BORDE_CALIDO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1820, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "hablar" }]} habla={[[k(134.4), k(139)]]} caras={[{ f: 0, v: "determinado" }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Pildora texto="A MISSION" x={960} y={120} desde={k(131.5)} color={AMBAR} tam={46} />
      <Pildora texto="LAYERS" x={420} y={300} desde={k(133.6)} color="#f6ecd2" tam={38} />
      <Pildora texto="WOOL, NOT COTTON" x={420} y={380} desde={k(134.5)} color="#f6ecd2" tam={38} />
      <Pildora texto="WET CLOTHES STEAL HEAT" x={420} y={460} desde={k(137.4)} color={FRIO} tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 31 · la cara tapada, nunca solos, nunca de noche, de vuelta antes de las 4:45 ----------
export const P31Salida: React.FC = () => {
  const k = kDe(139.13);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1900, B - 280, 1.3), mira(230, 2200, B - 280, 1.25)]} seed={31} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true, humo: 0.8 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1900, y: B }, { f: 230, x: 2500 }]} caras={[{ f: 0, v: "determinado" }]} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1740, y: B }, { f: 230, x: 2330 }]} caras={[{ f: 0, v: "determinado" }]} seed={2} />
        </>} />
      {["FACE COVERED", "NEVER ALONE", "NEVER AFTER DARK"].map((t, i) => <Pildora key={t} texto={t} x={420} y={300 + i * 80} desde={k([139.2, 140.2, 141.2][i])} color="#f6ecd2" tam={38} />)}
      <RelojDia min={16 * 60 + 45} x={1500} y={80} desde={k(142.6)} tam={52} />
      <Pildora texto="BACK BEFORE SUNSET" x={1560} y={190} desde={k(143.6)} color={AMBAR} tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 32 · el peligro invisible: monóxido de carbono ----------
export const P32Invisible: React.FC = () => {
  const f = useF();
  const k = kDe(146.95);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1500, P - 300, 1.0), mira(140, 1650, P - 300, 1.2)]} seed={32} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.6 }}
        medio={<>
          <DosMantas x={1500} caras={["cansado", "duda"]} />
          {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={1300 + i * 90 + Math.sin(f / 30 + i) * 60} cy={P - 360 + Math.cos(f / 25 + i) * 50} r={110} fill="#9aa0aa" opacity={0.13} />)}
        </>} />
      <Pildora texto="INVISIBLE" x={960} y={140} desde={k(149.5)} color="#b8bcc4" tam={42} />
      <Pildora texto="CARBON MONOXIDE" x={960} y={900} desde={k(151.1)} color="#e2483a" tam={50} />
    </AbsoluteFill>
  );
};

// ---------- 33 · generadores y parrillas adentro: sin olor, sin aviso, te da sueño ----------
const Parrilla: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-70} y={-120} width={140} height={70} rx={20} fill="#2a2a30" /><rect x={-60} y={-130} width={120} height={14} fill="#5a5a62" />
    {[-40, 40].map((d) => <rect key={d} x={d - 4} y={-50} width={8} height={50} fill="#2a2a30" />)}
    {Array.from({ length: 6 }).map((_, i) => { const t = (f * 1.5 + i * 25) % 150; return <circle key={i} cx={Math.sin(i + t / 18) * 50} cy={-140 - t * 2} r={30 + t / 3} fill="#a0a4ac" opacity={0.25 * (1 - t / 150)} />; })}
  </g>
);
export const P33Parrilla: React.FC = () => {
  const f = useF();
  const k = kDe(151.73);
  const X = COCINA_PUNTOS.cocina;
  return (
    <AbsoluteFill>
      <Escena Set={Cocina} pal={PAL} claves={[mira(0, X - 200, COCINA_PISO - 300, 1.2), mira(280, X - 260, COCINA_PISO - 260, 1.6)]} seed={33} setProps={{}}
        medio={<>
          <g transform={`translate(${X - 20},${COCINA_PISO})`}><Parrilla f={f} /></g>
          <Pj look={VOS} ruta={[{ f: 0, x: X - 400, y: COCINA_PISO }]} poses={[{ f: 0, v: "parado" }, { f: k(159.3), v: "sentadoSuelo" }]} caras={[{ f: 0, v: "neutral" }, { f: k(157.5), v: "cansado" }]} seed={4} />
        </>} />
      <AbsoluteFill style={{ background: "#0a0810", opacity: interpolate(f, [k(159.5), k(161.1)], [0, 0.7], cl) }} />
      <Pildora texto="NO SMELL" x={700} y={160} desde={k(157.5)} color="#e2483a" tam={44} />
      <Pildora texto="NO WARNING" x={1220} y={160} desde={k(158.4)} color="#e2483a" tam={44} />
      <Pildora texto="YOU JUST GET SLEEPY" x={960} y={900} desde={k(159.4)} color="#f6ecd2" tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 34 · June saquea la ferretería: alarmas de CO a pilas ----------
const Bolsita: React.FC = () => <g transform="translate(0,-10)"><rect x={-40} y={-10} width={80} height={64} rx={10} fill="#c0352c" /><path d="M-20,-10 q20,-30 40,0" stroke="#c0352c" strokeWidth={8} fill="none" /><circle cx={0} cy={22} r={14} fill="#f2ece0" /></g>;
export const P34Ferreteria: React.FC = () => {
  const k = kDe(161.17);
  const X = SUP_PUNTOS.ferreteria;
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, X, SUP_PISO - 280, 1.4), mira(100, X - 150, SUP_PISO - 270, 1.5)]} seed={34} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true }}
        medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: X + 60, y: SUP_PISO }, { f: 100, x: X - 300 }]} enManoD={<Bolsita />} caras={[{ f: 0, v: "determinado" }]} seed={2} />} />
      <Pildora texto="BATTERY CO ALARMS" x={960} y={140} desde={k(163.6)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};

// ---------- 35 · dos alarmas al lado de los colchones ----------
export const P35Alarmas: React.FC = () => {
  const k = kDe(164.5);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 820, P - 330, 1.6), mira(90, 820, P - 340, 1.8)]} seed={35} setProps={LIV_INV}
      medio={<Pj look={JUNE_INV} ruta={[{ f: 0, x: 640, y: P }]} poses={[{ f: 0, v: "agarrarAlto" }, { f: k(166.3), v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: k(166.3), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} seed={2} />} />
  );
};

// ---------- 36 · una noche de diciembre una grita ----------
export const P36Grita: React.FC = () => {
  const f = useF();
  const k = kDe(167.57);
  const al = f > k(169.3);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 900, P - 260, 1.4), mira(k(169.3), 900, P - 270, 1.45), mira(k(169.6) + 6, 880, P - 280, 2.1, { curva: "inout" })]} seed={36} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.3, alarma: al }}
        medio={<>
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 740, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(169.9), v: "agacharse" }]} caras={[{ f: 0, v: "cansado" }, { f: k(169.6), v: "miedo" }]} />
          <Halo x={760} y={P - 400} r={900} color="#ff2a2a" fuerza={al ? 0.35 + 0.25 * Math.sin(f / 2) : 0} />
          <Pj look={JUNE} ruta={[{ f: 0, x: 1060, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentadoSuelo" }, { f: k(169.8), v: "manosCara" }]} caras={[{ f: 0, v: "cansado" }, { f: k(169.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: -1, y: -0.5 } }]} seed={2} />
        </>} />
      <Calendario texto="DECEMBER" x={1480} y={90} desde={k(167.8)} tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 37 · el caño de la estufa tapado de hollín ----------
export const P37Hollin: React.FC = () => {
  const f = useF();
  const k = kDe(170.81);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1950, P - 360, 1.6), mira(56, 1950, P - 420, 1.8)]} seed={37} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.3, alarma: true }}
        medio={<>
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={1950 + (i % 2 ? 10 : -12)} cy={P - 480 - i * 60} rx={20} ry={26} fill="#0c0a0c" />)}
          {Array.from({ length: 12 }).map((_, i) => { const t = (f * 2 + i * 14) % 160; return <circle key={i} cx={1980 + t * 1.2 + Math.sin(i + t / 15) * 20} cy={P - 520 - t * 0.4} r={30 + t / 3} fill="#5a5a62" opacity={0.6 * (1 - t / 160)} />; })}
        </>} />
      <Pildora texto="STOVEPIPE CLOGGED WITH SOOT" x={1300} y={900} desde={k(171)} color="#e2483a" tam={42} />
    </AbsoluteFill>
  );
};

// ---------- 38 · abren la puerta a −20 y se sientan en la nieve en bolsas de dormir ----------
export const P38Nieve: React.FC = () => {
  const k = kDe(172.69);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1950, B - 280, 1.1), mira(175, 2000, B - 250, 1.5)]} seed={38} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
        medio={<>
          <Halo x={1900} y={B - 100} r={260} color="#ffcf6e" fuerza={0.35} />
          <BolsaDormir x={2120} y={B + 60} />
          <BolsaDormir x={2360} y={B + 60} color="#7a3a3a" />
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 2100, y: B + 60 }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "cansado" }]} luz={BORDE_FRIO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 2340, y: B + 60 }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "triste" }]} luz={BORDE_FRIO} seed={2} />
          <BolsaDormir x={2120} y={B + 64} />
          <BolsaDormir x={2360} y={B + 64} color="#7a3a3a" />
        </>} />
      <Pildora texto="UNTIL THE ROOM CLEARS" x={960} y={900} desde={k(176.5)} color="#f6ecd2" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 39 · esa alarma costó 9 dólares: salvó a media humanidad ----------
export const P39Nueve: React.FC = () => {
  const k = kDe(178.53);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 800, P - 400, 1.6)]} seed={39} setProps={LIV_INV} />
      <AbsoluteFill style={{ background: "rgba(14,10,20,0.6)" }} />
      <DatoGrande claves={[{ f: 0, v: 9 }]} prefijo="$" rotulo="ONE CO ALARM" y={300} tam={200} />
      <Pildora texto="SAVED HALF OF HUMANITY" x={960} y={760} desde={k(181.4)} color={AMBAR} tam={52} />
    </AbsoluteFill>
  );
};

// ---------- 40 · día 83: Navidad, probablemente ----------
export const P40Dia83: React.FC = () => {
  const k = kDe(182.89);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1720, P - 280, 1.2), mira(155, 1760, P - 260, 1.45)]} seed={40} setProps={{ ...LIV_INV, hora: "noche" }}
        medio={<DosMantas x={1560} caras={["duda", "duda"]} />} />
      <Calendario texto="DEC ??" x={1480} y={90} desde={k(184.2)} tam={50} />
    </AbsoluteFill>
  );
};
