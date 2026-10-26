// lc01 · planos 1-29 (0 → 173,9 s): cuadro 0 = la miniatura, «vos» despertando, la calle vacía, 8B → 2, Theo, el bus 6,
// Superior Street, el cuaderno CENSUS, la red que sigue prendida, la ventana que titila y June en St. Mary's.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Calendario, Globo, Pildora, RelojDia } from "../../anikit/pantalla";
import { Taza } from "../../anikit/props";
import { Cocina, COCINA_PISO, COCINA_PUNTOS } from "../../anikit/sets/cocina";
import { Look } from "../../anikit/personaje";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_MOCHI, PAL, THEO, THEO_MOCHI } from "../elenco";
import { Panorama, PANO_PISO, VENT_HOSP } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { Barrio, BARRIO_PISO, BARRIO_PUNTOS, Living, LIV_PISO, LIV_PUNTOS } from "../mundo/casa";
import { Lobby, LOBBY_DESCANSO, LOBBY_PISO, LOBBY_PUNTOS, StMarys, SM_PISO } from "../mundo/hospital";
import { Represa } from "../lcb/represa";
import { AutoCerca, CuadernoGrande, CuadernoMano, DatoGrande, kDe, Lapiz, Matafuego, Pj, Rotulo } from "./base";

const P = PANO_PISO;
// «vos»: persona gris genérica del gancho
const VOS: Look = { estilo: "palo", camisa: "#8a8f9a", manga: "larga", pantalon: "#3a3f4a", zapatos: "#1a1410" };
// ventana del hospital que titila (on/off a mano)
export const titila = (f: number, desde = 0, cada = 16) => (f < desde ? 0 : Math.floor((f - desde) / cada) % 2 === 0 ? 1 : 0.05);

// ---------- 1 · CUADRO 0 = la miniatura sin texto ----------
export const P01Mini: React.FC = () => {
  const f = useF();
  return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1560, 600, 0.74), mira(36, 1565, 600, 0.75)]} seed={1}
        setProps={{ hora: "ocaso", luces: 0, ventana: 1, nieve: 1, vapor: 0.6, puenteLuz: 0.3 }} />
      {/* primer plano: baranda nevada y los dos mirando la ciudad (en pantalla, grandes como en la miniatura) */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(0,0)">
          <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: 430, y: 1240 }]} escala={2.5} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }]} luz={BORDE_CALIDO} />
          <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: 740, y: 1290 }]} escala={2.3} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }]} luz={BORDE_CALIDO} seed={2} />
        </g>
        <rect x={-20} y={860} width={1100} height={34} rx={10} fill="#4a3428" transform="rotate(4 500 870)" />
        <rect x={-20} y={846} width={1100} height={22} rx={11} fill="#f2e2da" transform="rotate(4 500 870)" />
        {[60, 360, 660, 960].map((x) => <rect key={x} x={x} y={880} width={30} height={260} fill="#3a2a22" transform="rotate(4 500 870)" />)}
        <path d="M-20,1000 Q400,960 1100,1080 L-20,1080 Z" fill="#f2e2da" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 2 · «vos» te despertás: la cafetera borbotea ----------
const Cafetera: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-50} y={-150} width={100} height={150} rx={10} fill="#2a2630" />
    <rect x={-40} y={-70} width={80} height={60} rx={8} fill="#9fb4c8" opacity={0.6} />
    <rect x={-40} y={-40 + 4 * Math.sin(f / 3)} width={80} height={30} rx={6} fill="#5a3218" />
    <circle cx={34} cy={-130} r={6} fill={Math.floor(f / 10) % 2 ? "#ff5a3a" : "#c03a2a"} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${-14 + k * 14},-156 q8,-14 0,-28 q-8,-14 2,-26`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.35 + 0.2 * Math.sin(f / 7 + k)} />)}
  </g>
);
export const P02Despierta: React.FC = () => {
  const f = useF();
  const X = COCINA_PUNTOS.cocina;
  return (
    <Escena Set={Cocina} pal={PAL} claves={[mira(0, X - 80, COCINA_PISO - 280, 2.0), mira(150, X - 140, COCINA_PISO - 260, 1.7, { curva: "inout" })]} seed={2}
      medio={<>
        <g transform={`translate(${X},${COCINA_PISO - 330})`}><Cafetera f={f} /></g>
        <Pj look={VOS} ruta={[{ f: 0, x: X - 420, y: COCINA_PISO }, { f: 60, x: X - 200, y: COCINA_PISO }]} poses={[{ f: 0, v: "parado" }, { f: 70, v: "manosCintura" }]} caras={[{ f: 0, v: "cansado" }, { f: 90, v: "feliz" }]} enManoD={<Taza vapor={1} f={f} />} seed={4} />
      </>} />
  );
};

// ---------- 3 · la radio prendida, la calefacción prendida ----------
const Radio: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-80} y={-90} width={160} height={90} rx={12} fill="#7a4a2e" />
    <rect x={-66} y={-76} width={70} height={62} rx={6} fill="#3a2a22" />
    {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={-62} y={-70 + i * 12} width={62} height={4} fill="#1d1612" />)}
    <circle cx={44} cy={-56} r={14} fill="#e8d9b5" /><rect x={20} y={-30} width={48} height={10} rx={4} fill={AMBAR} />
    <path d="M-60,-90 L-90,-170" stroke="#2a2228" strokeWidth={4} />
    {[0, 1, 2].map((k) => { const r = 30 + (((f * 2 + k * 20) % 60)); return <path key={k} d={`M${100 + r * 0.2},${-80 - r * 0.6} q${r * 0.5},${r * 0.6} 0,${r * 1.2}`} stroke={AMBAR} strokeWidth={5} fill="none" opacity={1 - r / 90} />; })}
  </g>
);
export const P03Radio: React.FC = () => {
  const f = useF();
  const X = COCINA_PUNTOS.estantes;
  return (
    <Escena Set={Cocina} pal={PAL} claves={[mira(0, X - 300, COCINA_PISO - 420, 2.4), mira(28, X - 300, COCINA_PISO - 420, 2.5), mira(32, X + 250, COCINA_PISO - 120, 2.4, { curva: "inout" })]} seed={3}
      medio={<>
        <g transform={`translate(${X - 300},${COCINA_PISO - 380})`}><Radio f={f} /></g>
        {/* rejilla de la calefacción con aire caliente */}
        <g transform={`translate(${X + 250},${COCINA_PISO - 40})`}>
          <rect x={-130} y={-60} width={260} height={60} rx={6} fill="#cfc8bc" />
          {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-116 + i * 28} y={-52} width={12} height={44} fill="#8a847a" />)}
          {[0, 1, 2, 3].map((k) => <path key={k} d={`M${-90 + k * 60},-70 q12,-30 0,-60 q-12,-30 4,-60`} stroke="#ffb27a" strokeWidth={6} fill="none" opacity={0.35 + 0.25 * Math.sin(f / 6 + k)} transform={`translate(0,${-((f * 1.5 + k * 15) % 40)})`} />)}
        </g>
      </>} />
  );
};

// ---------- 4 · afuera: Superior Street de día, llena de autos y sin nadie ----------
export const P04Calle: React.FC = () => (
  <Escena Set={Superior} pal={PAL} claves={[mira(0, 1200, 640, 0.95), mira(170, 1750, 640, 1.0)]} seed={4} setProps={{ hora: "dia", luces: 0.2, nieve: 0 }} />
);
export const P05Vereda: React.FC = () => (
  <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.semaforo1, SUP_PISO - 200, 1.7), mira(40, SUP_PUNTOS.semaforo1 + 60, SUP_PISO - 190, 1.8)]} seed={5} setProps={{ hora: "dia", luces: 0.2 }} />
);
export const P06Autos: React.FC = () => (
  <Escena Set={Superior} pal={PAL} claves={[mira(0, 2600, SUP_PISO + 140, 1.9), mira(36, 3000, SUP_PISO + 140, 1.9)]} seed={6} setProps={{ hora: "dia", luces: 0.2 }} />
);
export const P07Ciudad: React.FC = () => (
  <Escena Set={Panorama} pal={PAL} claves={[mira(0, 2000, 620, 0.9), mira(40, 1900, 610, 0.8, { curva: "inout" })]} seed={7} setProps={{ hora: "dia", luces: 0.2, nieve: 0, vapor: 0 }} />
);

// ---------- 8 · 8,000,000,000 → 2 ----------
export const P08Ocho: React.FC = () => {
  const k = kDe(18.76);
  return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1500, 560, 0.8), mira(130, 1500, 580, 0.9)]} seed={8} setProps={{ hora: "noche", luces: 1, nieve: 0.4 }} />
      <AbsoluteFill style={{ background: "rgba(10,8,16,0.55)" }} />
      <DatoGrande claves={[{ f: 0, v: 8000000000 }, { f: k(20.4), v: 2, d: 40 }]} rotulo="PEOPLE ON EARTH" y={360} tam={150} />
    </AbsoluteFill>
  );
};

// ---------- 9 · la pregunta: dos personas, una ciudad entera ----------
export const P09Pregunta: React.FC = () => (
  <Escena Set={Panorama} pal={PAL} claves={[mira(0, 650, P - 200, 1.8), mira(190, 640, P - 210, 2.1)]} seed={9} setProps={{ hora: "noche", luces: 1, nieve: 0.8, vapor: 0.5 }}
    medio={<>
      <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: 560, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} />
      <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: 720, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} seed={2} />
    </>} />
);

// ---------- 10 · comida real, inviernos reales, cuentas reales ----------
export const P10Real: React.FC = () => {
  const k = kDe(29.4);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, 2000, 600, 0.9), mira(180, 2400, 600, 0.95)]} seed={10} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true }} />
      <Pildora texto="REAL FOOD" x={560} y={360} desde={k(30.9)} color={AMBAR} tam={46} />
      <Pildora texto="REAL WINTERS" x={960} y={440} desde={k(31.9)} color="#8fd3ff" tam={46} />
      <Pildora texto="REAL MATH" x={1360} y={520} desde={k(33.5)} color={AMBAR} tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 11 · «let's count it»: el cuaderno ----------
export const P11Cuenta: React.FC = () => <CuadernoGrande tapa zoom={[0, 1.1, 1.18]} />;

// ---------- 12 · 3:12 a.m., 3 de octubre: el barrio duerme ----------
export const P12Hora: React.FC = () => {
  const k = kDe(36.18);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 700, 560, 0.75), mira(180, 400, 640, 1.05, { curva: "inout" })]} seed={12} setProps={{ hora: "noche", luces: 0.15, nieve: 0 }} />
      <Calendario texto="OCT 3 · 3:12 AM" x={1380} y={80} desde={k(36.6)} />
    </AbsoluteFill>
  );
};

// ---------- 13 · Theo Lindgren, 34, liniero: sale del dúplex ----------
export const P13Theo: React.FC = () => {
  const k = kDe(42.28);
  const X = BARRIO_PUNTOS.duplex;
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, X, BARRIO_PISO - 220, 1.5), mira(k(50.7), X + 220, BARRIO_PISO - 230, 1.45)]} seed={13} setProps={{ hora: "alba", luces: 0.1 }}
        medio={<Pj look={THEO} ruta={[{ f: 0, x: X, y: BARRIO_PISO }, { f: k(44), x: X }, { f: k(52), x: X + 300 }]} caras={[{ f: 0, v: "cansado" }, { f: k(48.5), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(48.5), v: { x: -1, y: 0 } }]} />} />
      <Rotulo nombre="THEO LINDGREN · 34" bajada="LINEMAN · MINNESOTA POWER" desde={k(43)} hasta={k(50)} />
    </AbsoluteFill>
  );
};

// ---------- 14 · el bus 6 no llega ----------
export const P14Bus: React.FC = () => {
  const k = kDe(50.7);
  const X = BARRIO_PUNTOS.parada;
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, X - 60, BARRIO_PISO - 220, 1.6), mira(k(55), X - 30, BARRIO_PISO - 260, 1.9, { curva: "inout" })]} seed={14} setProps={{ hora: "alba", luces: 0.1 }}
        medio={<Pj look={THEO} ruta={[{ f: 0, x: X - 160, y: BARRIO_PISO }]} poses={[{ f: 0, v: "parado" }, { f: k(54), v: "brazosCruzados" }]} caras={[{ f: 0, v: "neutral" }, { f: k(57), v: "duda" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(55), v: { x: 1, y: -0.3 } }]} />} />
      <RelojDia min={6 * 60 + 40} x={1560} y={70} desde={k(53.7)} />
    </AbsoluteFill>
  );
};

// ---------- 15 · baja a Superior Street: la calle llena de autos ----------
export const P15Superior: React.FC = () => {
  const k = kDe(58.36);
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 900, 640, 1.15), mira(k(63.5), 1500, 660, 1.2)]} seed={15} setProps={{ hora: "dia", luces: 0.1 }}
      medio={<Pj look={THEO} ruta={[{ f: 0, x: 700, y: SUP_PISO }, { f: k(63.5), x: 1500 }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} />} />
  );
};

// ---------- 16 · motores apagados, una campera doblada en el asiento ----------
export const P16Campera: React.FC = () => {
  const f = useF();
  const z = interpolate(f, [0, 200], [0.78, 0.92]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#9fb4cc, #c8d4e4)" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={840} width={1920} height={240} fill="#3a3442" />
        <g transform={`translate(1060,560) scale(${z})`}><AutoCerca color="#6a2f36" /></g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 17 · camina una hora, grita ----------
export const P17Grita: React.FC = () => {
  const k = kDe(70.22);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, 1900, 680, 1.25), mira(k(71.6), 2150, 690, 1.3), mira(k(72.3), 2200, SUP_PISO - 200, 1.75, { curva: "inout" })]} seed={17} setProps={{ hora: "dia", luces: 0.1 }}
        medio={<Pj look={THEO} ruta={[{ f: 0, x: 1800, y: SUP_PISO }, { f: k(71.6), x: 2200 }]} poses={[{ f: 0, v: "parado" }, { f: k(71.9), v: { hD: -150, cD: -40, hI: 150, cI: 40 } }]} caras={[{ f: 0, v: "duda" }, { f: k(71.9), v: "sorpresa" }]} habla={[[k(71.9), k(72.7)]]} />} />
      <Globo texto="HELLO?!" x={1180} y={230} desde={k(71.9)} hasta={k(72.7) + 4} tam={72} cola="izq" />
    </AbsoluteFill>
  );
};

// ---------- 18 · policía, bomberos, la Holiday ----------
export const P18Lugares: React.FC = () => {
  const k = kDe(72.7);
  const a = k(73.8), b = k(75.0);
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.policia, 620, 1.2), mira(a - 2, SUP_PUNTOS.policia, 620, 1.2), mira(a + 4, SUP_PUNTOS.bomberos, 620, 1.2, { curva: "inout" }), mira(b - 2, SUP_PUNTOS.bomberos, 620, 1.2), mira(b + 5, SUP_PUNTOS.holiday, 640, 1.15, { curva: "inout" })]} seed={18} setProps={{ hora: "dia", luces: 0.1 }}
      medio={<Pj look={THEO} ruta={[{ f: 0, x: SUP_PUNTOS.policia - 120, y: SUP_PISO }, { f: a - 6, x: SUP_PUNTOS.policia - 120 }, { f: a + 6, x: SUP_PUNTOS.bomberos - 160 }, { f: b - 6, x: SUP_PUNTOS.bomberos - 160 }, { f: b + 8, x: SUP_PUNTOS.holiday + 140 }]} correr={1} caras={[{ f: 0, v: "determinado" }]} />} />
  );
};

// ---------- 19 · los surtidores andan, el café está tibio, no hay nadie ----------
export const P19Holiday: React.FC = () => {
  const f = useF();
  const k = kDe(77.54);
  const X = SUP_PUNTOS.holiday;
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, X, SUP_PISO - 200, 1.5), mira(k(80), X + 40, SUP_PISO - 180, 2.1, { curva: "inout" })]} seed={19} setProps={{ hora: "dia", luces: 0.1 }}
        medio={<>
          <Pj look={THEO} ruta={[{ f: 0, x: X - 240, y: SUP_PISO }]} enManoD={<Taza vapor={1} f={f} />} poses={[{ f: 0, v: "parado" }, { f: k(79.5), v: { hD: -40, cD: -110 } }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
        </>} />
      <Pildora texto="$3.19 · PUMP 4 ON" x={1300} y={240} desde={k(78)} color={AMBAR} tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 20 · esa noche: el cuaderno, CENSUS, «1» ----------
export const P20Censo: React.FC = () => {
  const k = kDe(82.6);
  const f = useF();
  if (f < k(89.3)) {
    return (
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.mesa, LIV_PISO - 260, 1.4), mira(k(89.3), LIV_PUNTOS.mesa - 60, LIV_PISO - 200, 2.0)]} seed={20} setProps={{ hora: "noche", luces: 1, fuego: 0, vela: true, lena: 0, latas: 0.3, mantas: false, reglas: 0 }}
        medio={<Pj look={THEO_MOCHI} ruta={[{ f: 0, x: LIV_PUNTOS.mesa - 220, y: LIV_PISO }]} poses={[{ f: 0, v: { hD: -60, cD: -70 } }]} enManoD={<Lapiz />} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }]} luz={BORDE_CALIDO} />} />
    );
  }
  return <CuadernoGrande tapa abre={k(89.6)} vela renglones={[{ t: "CENSUS", desde: k(90.6), tam: 92, x: 1130, y: 300 }, { t: "1", desde: k(94.9), tam: 150, x: 1260, y: 470 }]} zoom={[k(89.3), 1.0, 1.08]} />;
};

// ---------- 21 · el cuaderno todavía existe; la página 2 arrancada ----------
export const P21Existe: React.FC = () => {
  const k = kDe(95.7);
  const f = useF();
  return <CuadernoGrande viejo={1} arrancada={f > k(99.5)} renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470 }]} zoom={[0, 1.15, 1.0]} luz="#2a2a34" />;
};

// ---------- 22 · las luces no se apagan ----------
export const P22Luces: React.FC = () => {
  const f = useF();
  const k = kDe(103.44);
  const l = interpolate(f, [k(106.3), k(107.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Escena Set={Superior} pal={PAL} claves={[mira(0, 1700, 600, 0.95), mira(170, 1600, 600, 1.05)]} seed={22} setProps={{ hora: "ocaso", luces: l, nieve: 0 }} />;
};

// ---------- 23 · la red es automática: las represas del St. Louis giran solas ----------
export const P23Represa: React.FC = () => (
  <Escena Set={Represa} pal={PAL} claves={[mira(0, 900, 600, 0.8), mira(420, 1500, 600, 0.9)]} seed={23} setProps={{ hora: "dia", corte: 0.6, zumbido: 1, nieve: 0 }} />
);

// ---------- 24 · la ciudad sigue prendida; semáforos para nadie ----------
export const P24Semaforos: React.FC = () => (
  <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.semaforo2 - 200, SUP_PISO - 250, 1.5), mira(190, SUP_PUNTOS.semaforo2 + 400, SUP_PISO - 280, 1.2)]} seed={24} setProps={{ hora: "noche", luces: 1 }} />
);

// ---------- 25 · día 3: desde la colina, la ciudad prendida… salvo una ventana ----------
export const P25Colina: React.FC = () => {
  const k = kDe(129.83);
  return (
    <Escena Set={Panorama} pal={PAL} claves={[mira(0, 520, P - 200, 2.0), mira(k(136.5), 660, P - 210, 1.8, { curva: "inout" }), mira(k(141.9), 1700, 640, 0.8, { curva: "inout" })]} seed={25} setProps={{ hora: "noche", luces: 1, ventana: 0, nieve: 0.2 }}
      medio={<Pj look={THEO_MOCHI} ruta={[{ f: 0, x: 380, y: P - 6 }, { f: k(132), x: 640 }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(133), v: { x: 1, y: -0.1 } }]} caras={[{ f: 0, v: "cansado" }, { f: k(139), v: "sorpresa" }]} luz={BORDE_FRIO} />} />
  );
};

// ---------- 26 · St. Mary's: una ventana titila ----------
export const P26Ventana: React.FC = () => {
  const f = useF();
  const k = kDe(141.99);
  return (
    <Escena Set={Panorama} pal={PAL} claves={[mira(0, 2400, 560, 1.4), mira(k(145.9), VENT_HOSP.x + 12, VENT_HOSP.y + 16, 4.5, { curva: "inout" })]} seed={26} setProps={{ hora: "noche", luces: 1, ventana: titila(f, k(145.9), 14), nieve: 0.2 }} />
  );
};

// ---------- 27 · «somebody is»: June Okafor entre las camas vacías ----------
export const P27June: React.FC = () => {
  const k = kDe(151.37);
  const X = LOBBY_PUNTOS.guardia;
  return (
    <AbsoluteFill>
      <Escena Set={Lobby} pal={PAL} claves={[mira(0, X + 300, LOBBY_PISO - 260, 1.25), mira(k(162.5), X, LOBBY_PISO - 240, 1.1)]} seed={27} setProps={{ luces: 1, afuera: "noche" }}
        medio={<Pj look={JUNE} ruta={[{ f: 0, x: X - 500, y: LOBBY_PISO }, { f: k(158), x: X + 100 }]} caras={[{ f: 0, v: "cansado" }, { f: k(159.9), v: "triste" }]} miradas={[{ f: k(159), v: { x: 1, y: 0.4 } }]} />} />
      <Rotulo nombre="JUNE OKAFOR · 31" bajada="ER NURSE · ST. MARY'S" desde={k(152.4)} hasta={k(159.5)} />
    </AbsoluteFill>
  );
};

// ---------- 28 · se quedó tres días: donde están los insumos ----------
export const P28Quedo: React.FC = () => {
  const f = useF();
  const k = kDe(162.6);
  const X = LOBBY_PUNTOS.mostrador;
  return (
    <AbsoluteFill>
      <Escena Set={Lobby} pal={PAL} claves={[mira(0, X, LOBBY_PISO - 250, 1.4), mira(200, X + 120, LOBBY_PISO - 250, 1.5)]} seed={28} setProps={{ luces: 1, afuera: "noche" }}
        medio={<>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={X + 260 + (i % 2) * 90} y={LOBBY_PISO - 80 - Math.floor(i / 2) * 80} width={84} height={78} rx={4} fill="#c8a878" stroke="#8a6a48" strokeWidth={3} />)}
          <Pj look={JUNE} ruta={[{ f: 0, x: X - 200, y: LOBBY_PISO }]} poses={[{ f: 0, v: "brazosCruzados" }]} caras={[{ f: 0, v: "determinado" }]} />
        </>} />
      <Pildora texto={`HOURS IN THE HOSPITAL: ${Math.min(72, Math.floor(f * 0.36))}`} x={1300} y={120} desde={6} color={AMBAR} tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 29 · cada noche prendía y apagaba esa luz ----------
export const P29Interruptor: React.FC = () => {
  const f = useF();
  return <Escena Set={StMarys} pal={PAL} claves={[mira(0, 1150, 520, 0.85), mira(140, 1215, 420, 1.3)]} seed={29} setProps={{ hora: "noche", luces: 0.15, ventana: titila(f, 0, 15), nieve: 0.2 }} />;
};
