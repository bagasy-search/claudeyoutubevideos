// tz02 · planos 43-83 (198 s → final): las cuatro cosas en el camino, la caminata sin tel, día 3 en el lavadero, la llamada a mamá, día 4.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Pildora } from "../anikit/pantalla";
import { ALDEANA, ALDEANO, CHANNA, ENFERMO, LEO, LEO_CAPUCHA, MONJE_JOVEN, REY, SIDDHARTHA, VIEJO, VIEJO_36 } from "../tenzo/elenco";
import { Frase, ManoLeo, ManoMara, Rotulo } from "../tenzo/hud";
import { Baston, Carroza, Laptop, Tel, TelMesa } from "../tenzo/utileria";
import { TelGrande } from "../tenzo/graficos";
import { CTO_PUNTOS, Cto, CP, DOBLA_A, doblando, kDe, Lav, LP, SENTADO } from "../tz01/base";
import { Fondo, maraCuarto } from "../tz01/planos1";
import { A, Bebe, BP, BW, Bwy, Camilla, Hud2, K, Kap, KP } from "./base";


const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const MIRA_T = { x: 0.9, y: 0 }, MIRA_L = { x: -0.9, y: 0 };
const H3 = <Hud2 m={0} dia={3} est="congelado" />;
const CAMINA = { hD: 10, cD: 20, hI: 10, cI: 20 };
// la carroza con Siddhartha y Channa: avanza de x0 a x1 en n cuadros
const CarrozaViaje: React.FC<{ x0: number; x1: number; n: number; caraS?: string; hablaS?: [number, number][]; hablaC?: [number, number][]; miraS?: { x: number; y: number } }> = ({ x0, x1, n, caraS = "feliz", hablaS = [], hablaC = [], miraS = { x: 0.9, y: 0.1 } }) => {
  const f = useF();
  const x = interpolate(f, [0, n], [x0, x1], cl);
  return (
    <>
      <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: x - 40, y: KP - 70 }]} asiento={[{ f: 0, v: 50 }]} poses={[{ f: 0, v: SENTADO }]} caras={[{ f: 0, v: caraS }]} miradas={[{ f: 0, v: miraS }]} habla={hablaS} />
      <A look={CHANNA} seed={34} ruta={[{ f: 0, x: x + 90, y: KP - 70 }]} asiento={[{ f: 0, v: 50 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }]} caras={[{ f: 0, v: "neutral" }]} habla={hablaC} />
      <Carroza x={x} piso={KP} rueda={f * 6} paso={f} />
    </>
  );
};

// ---------- 43 · a los 29, Siddhartha le ruega a Channa: afuera de los muros, una sola vez ----------
export const Q43Ruega: React.FC = () => (
  <Kap cl={[mira(0, 2700, 600, 1.2), mira(248, 2780, 610, 1.4)]}
    medio={<><A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: 2640, y: KP }]} caras={[{ f: 0, v: "triste" }, { f: 120, v: "determinado" }]} poses={[{ f: 0, v: { hD: 70, cD: 60, hI: 70, cI: 60, tronco: 10 } }, { f: 140, v: { hD: 140, cD: 20, hI: 10, cI: 10 } }]} habla={[[10, 240]]} />
      <A look={CHANNA} seed={34} ruta={[{ f: 0, x: 2860, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }]} /></>}
    hud={<Pildora texto="AGE 29" x={960} y={980} desde={6} color="#ffe2a6" />} />
);
// ---------- 44 · el rey se entera: calles limpias, viejos y enfermos escondidos, flores en cada ventana ----------
const k44 = kDe(206.33);
export const Q44Ordena: React.FC = () => {
  const f = useF();
  const flor = f < k44(211.6);
  return flor
    ? <Kap cl={[mira(0, K.trono - 100, 600, 1.7), mira(k44(211.5), K.trono - 120, 610, 1.9)]}
      medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 100, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "enojo" }]} poses={[{ f: 0, v: "parado" }, { f: 50, v: { hD: 150, cD: 10, hI: 10, cI: 10 } }]} habla={[[40, 150]]} />} />
    : <Kap cl={[mira(0, 3500, 560, 1.0), mira(200, 3600, 560, 1.05)]} sp={{ flores: 1, portonAbierto: 1 }} medio={<CarrozaViaje x0={3100} x1={3600} n={190} />} />;
};
// ---------- 45 · pero en el camino… cuatro cosas ----------
export const Q45Cuatro: React.FC = () => (
  <Kap cl={[mira(0, 3700, 420, 0.7), mira(60, 3760, 430, 0.75)]} sp={{ flores: 0.3, portonAbierto: 1 }}
    medio={<CarrozaViaje x0={3550} x1={3700} n={60} />} hud={<Pildora texto="FOUR THINGS" x={960} y={980} desde={4} color="#ffe2a6" />} />
);
// ---------- 46 · lo primero: un viejo. Doblado. Un bastón. La piel como corteza ----------
const k46 = kDe(219.0);
export const Q46Viejo: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, K.viejo - 150, 680, 1.4), mira(k46(220.7), K.viejo, 720, 1.9, { curva: "inout" }), mira(k46(223.3), K.viejo + 10, 720, 2.6), mira(k46(225.4), K.viejo + 10, 720, 2.8)]}
      medio={<A look={VIEJO} seed={53} ruta={[{ f: 0, x: K.viejo, y: KP }, { f: 190, x: K.viejo - 40, y: KP, curva: "lineal" }]} dir={[{ f: 0, v: -1 }]}
        poses={[{ f: 0, v: { tronco: 34, cabeza: 26, hD: 40, cD: 20, hI: 10, cI: 10 } }]} enManoD={f > k46(221.8) ? <Baston largo={170} /> : null} caras={[{ f: 0, v: "cansado" }]} />}
      hud={<Pildora texto="I · AN OLD MAN" x={960} y={980} desde={4} color="#ffe2a6" />} />
  );
};
// ---------- 47 · «Channa, what is wrong with that man?» ----------
export const Q47QueLePasa: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 380, 620, 2.0), mira(76, K.viejo - 370, 615, 2.2)]} sp={{ portonAbierto: 1 }}
    medio={<CarrozaViaje x0={K.viejo - 340} x1={K.viejo - 330} n={76} caraS="sorpresa" hablaS={[[0, 70]]} />} />
);
// ---------- 48 · «nothing is wrong with him, my prince. He is old. It happens to everyone» ----------
const k48 = kDe(228.01);
export const Q48Viejo: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 240, 620, 2.4), mira(136, K.viejo - 240, 615, 2.6)]} sp={{ portonAbierto: 1 }}
    medio={<CarrozaViaje x0={K.viejo - 330} x1={K.viejo - 330} n={1} caraS="duda" hablaC={[[0, k48(229.8)], [k48(229.97), k48(230.9)], [k48(231.01), k48(232.5)]]} />} />
);
// ---------- 49 · «to everyone? to my father? to my wife?» ----------
const k49 = kDe(232.55);
export const Q49ATodos: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 380, 620, 2.6), mira(95, K.viejo - 380, 615, 3.0)]} sp={{ portonAbierto: 1 }}
    medio={<CarrozaViaje x0={K.viejo - 330} x1={K.viejo - 330} n={1} caraS="miedo" hablaS={[[0, k49(233.3)], [k49(233.39), k49(234.5)], [k49(234.61), k49(235.6)]]} />} />
);
// ---------- 50 · «to everyone, my prince. To you too» ----------
const k50 = kDe(235.71);
export const Q50ATi: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 290, 620, 2.0), mira(60, K.viejo - 300, 620, 2.1), mira(61, K.viejo - 380, 610, 3.0), mira(88, K.viejo - 380, 610, 3.2)]} sp={{ portonAbierto: 1 }}
    medio={<CarrozaViaje x0={K.viejo - 330} x1={K.viejo - 330} n={1} caraS="miedo" miraS={{ x: 0.2, y: 0.6 }} hablaC={[[0, k50(237.2)], [k50(237.31), k50(238.6)]]} />} />
);
// ---------- 51 · Leo vuelve a casa por Broadway a las 4, sin tel; mira todo ----------
const k51 = kDe(238.65);
export const Q51Camina: React.FC = () => (
  <Bwy cl={[mira(0, 1000, 560, 1.0), mira(k51(242.4), 1500, 560, 1.0), mira(k51(242.45), 1900, 380, 0.6), mira(209, 2500, 400, 0.65)]} sp={{ tren: 160 }}
    medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: 900, y: BP }, { f: 209, x: 2700, y: BP, curva: "lineal" }]} poses={[{ f: 0, v: CAMINA }]} caras={[{ f: 0, v: "neutral" }, { f: k51(242.45), v: "sorpresa" }]}
      miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: k51(243), v: { x: 0.3, y: -0.7 } }, { f: k51(244.2), v: { x: -0.6, y: -0.3 } }]} />}
    hud={<><Hud2 m={0} est="congelado" /><Rotulo texto="4:00 AM · NO PHONE" desde={6} /></>} />
);
// ---------- 52 · en la parada del 36, un viejo con campera finita espera un bus que tarda una hora ----------
export const Q52Parada: React.FC = () => (
  <Bwy cl={[mira(0, BW.parada36 - 300, 560, 1.1), mira(208, BW.parada36 - 120, 600, 1.45)]}
    medio={<>
      <A look={VIEJO_36} seed={57} ruta={[{ f: 0, x: BW.banco36 - 30, y: BP }]} asiento={[{ f: 0, v: 70 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 40, cD: 120, hI: 40, cI: 120, tronco: 14, cabeza: 10 } }]} caras={[{ f: 0, v: "cansado" }]} />
      <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.parada36 - 600, y: BP }, { f: 150, x: BW.parada36 - 260, y: BP }]} poses={[{ f: 0, v: CAMINA }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: MIRA_T }]} />
    </>} hud={<Hud2 m={0} est="congelado" />} />
);
// ---------- 53 · le tiemblan las manos de frío ----------
export const Q53Manos: React.FC = () => {
  const f = useF();
  const t = Math.sin(f * 1.7) * 4;
  return (
    <Bwy cl={[mira(0, BW.banco36 - 30, 760, 3.2), mira(65, BW.banco36 - 30, 760, 3.4)]}
      medio={<A look={VIEJO_36} seed={57} ruta={[{ f: 0, x: BW.banco36 - 30, y: BP }]} asiento={[{ f: 0, v: 70 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 40 + t, cD: 120 - t, hI: 40 - t, cI: 120 + t, tronco: 14, cabeza: 10 } }]} caras={[{ f: 0, v: "cansado" }]} />} hud={<Hud2 m={0} est="congelado" />} />
  );
};
// ---------- 54 · pasó por esa parada mil veces. Nunca lo vio ----------
export const Q54NuncaLoVio: React.FC = () => (
  <Bwy cl={[mira(0, BW.parada36 - 260, 600, 2.4), mira(137, BW.parada36 - 260, 600, 2.7)]}
    medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.parada36 - 260, y: BP }]} poses={[{ f: 0, v: { hD: 10, cD: 120, hI: 10, cI: 120 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: MIRA_T }]} />}
    hud={<><Hud2 m={0} est="congelado" /><ManoLeo texto="1,000 times" x={1260} y={250} desde={50} tam={74} /></>} />
);
// ---------- 55 · lo segundo: un enfermo tirado en el polvo, ardiendo de fiebre ----------
export const Q55Enfermo: React.FC = () => (
  <Kap cl={[mira(0, K.enfermo - 200, 640, 1.5), mira(140, K.enfermo, 700, 2.1, { curva: "inout" })]} sp={{ portonAbierto: 1 }}
    medio={<A look={ENFERMO} seed={58} ruta={[{ f: 0, x: K.enfermo, y: KP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { tronco: -60, cabeza: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 60, cD: 120, hI: 10, cI: 20 } }]} caras={[{ f: 0, v: "cansado" }]} />}
    hud={<Pildora texto="II · A SICK MAN" x={960} y={980} desde={4} color="#ffe2a6" />} />
);
// ---------- 56 · a las 5, Leo no duerme; por primera vez en meses escucha los mensajes en la laptop vieja ----------
const LAP = { x: CTO_PUNTOS.colchon + 60, y: CP - 70 };
export const Q56Laptop: React.FC = () => (
  <Cto cl={[mira(0, CTO_PUNTOS.colchon, 560, 1.2), mira(230, CTO_PUNTOS.colchon - 20, 640, 1.8)]}
    leo={{ poses: [{ f: 0, v: { tronco: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 60, cD: 40, hI: 50, cI: 40, cabeza: 22 } }], enManoD: null, caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.6 } }] }}
    medio={<Laptop x={LAP.x} y={LAP.y} brillo={1} />} hud={<><Hud2 m={0} est="congelado" /><Rotulo texto="5:00 AM" desde={6} /></>} />
);
// ---------- 57 · tres de su madre, Diane, en Peoria; en el último tose: «call me when you can, baby» ----------
const k57 = kDe(271.93);
export const Q57Diane: React.FC = () => {
  const f = useF();
  const n = f < k57(275.3) ? Math.min(3, 1 + Math.floor(f / 30)) : 3;
  return (
    <Fondo>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={460} y={160} width={1000} height={640} rx={26} fill="#1b1e24" stroke="#3a3f48" strokeWidth={6} />
        <text x={520} y={250} fill="#9aa3ad" fontFamily="Inter, sans-serif" fontSize={40} fontWeight={700}>VOICEMAIL</text>
        {Array.from({ length: n }).map((_, i) => (
          <g key={i} transform={`translate(520,${310 + i * 140})`}>
            <rect width={880} height={110} rx={18} fill={i === n - 1 && f > k57(275.3) ? "#3a2418" : "#262a31"} />
            <circle cx={60} cy={55} r={30} fill="#ff6a2b" />
            <text x={120} y={50} fill="#f4efe6" fontFamily="Inter, sans-serif" fontSize={40} fontWeight={700}>MOM · DIANE</text>
            <text x={120} y={92} fill="#9aa3ad" fontFamily="Inter, sans-serif" fontSize={30}>Peoria, IL</text>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((b) => <rect key={b} x={560 + b * 24} y={55 - (6 + ((b * 7 + i * 5 + (i === n - 1 ? f : 0)) % 9) * 4)} width={12} height={2 * (6 + ((b * 7 + i * 5 + (i === n - 1 ? f : 0)) % 9) * 4)} rx={6} fill="#ff6a2b" opacity={0.8} />)}
          </g>
        ))}
      </svg>
      {f > k57(277.5) && <Frase texto="“call me when you can, baby”" desde={k57(277.6)} y={920} tam={58} />}
      <Hud2 m={0} est="congelado" />
    </Fondo>
  );
};
// ---------- 58 · el mensaje tiene 19 días ----------
export const Q58Diecinueve: React.FC = () => <Fondo><TelGrande modo="hora" texto="19" sub="DAYS AGO" /><Hud2 m={0} est="congelado" /></Fondo>;
// ---------- 59 · lo tercero: un muerto en andas por la calle, y una familia llorando detrás ----------
export const Q59Funeral: React.FC = () => {
  const f = useF();
  const x = interpolate(f, [0, 185], [K.funeral - 300, K.funeral + 200], cl);
  return (
    <Kap cl={[mira(0, K.funeral - 300, 600, 1.2), mira(185, K.funeral + 100, 610, 1.35)]} sp={{ portonAbierto: 1 }}
      medio={<>
        <A look={ALDEANO} seed={61} ruta={[{ f: 0, x: x + 120, y: KP }]} poses={[{ f: 0, v: { hD: 150, cD: 10, hI: 150, cI: 10 } }]} caras={[{ f: 0, v: "triste" }]} />
        <A look={ALDEANO} seed={62} ruta={[{ f: 0, x: x - 120, y: KP }]} poses={[{ f: 0, v: { hD: 150, cD: 10, hI: 150, cI: 10 } }]} caras={[{ f: 0, v: "triste" }]} />
        <Camilla x={x} y={KP - 230} />
        {[0, 1, 2].map((q) => <A key={q} look={q === 1 ? ALDEANO : ALDEANA} seed={63 + q} ruta={[{ f: 0, x: x - 330 - q * 130, y: KP }]} poses={[{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "triste" }]} />)}
      </>} hud={<Pildora texto="III · A DEAD MAN" x={960} y={980} desde={4} color="#ffe2a6" />} />
  );
};
// ---------- 60 · al mediodía, Broadway y Argyle: una bici pintada de blanco, flores, una foto ----------
const k60 = kDe(289.73);
export const Q60Bici: React.FC = () => (
  <Bwy dia cl={[mira(0, BW.argyle - 400, 560, 0.95), mira(k60(297.1), BW.ghostbike - 100, 600, 1.3), mira(k60(301.0), BW.ghostbike, 720, 2.4, { curva: "inout" }), mira(k60(305.8), BW.ghostbike + 10, 740, 3.0)]}
    medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.argyle - 700, y: BP }, { f: k60(296), x: BW.ghostbike - 260, y: BP }]} poses={[{ f: 0, v: CAMINA }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: MIRA_T }]} />}
    hud={<><Hud2 m={0} est="congelado" /><Rotulo texto="NOON · BROADWAY & ARGYLE" desde={6} hasta={k60(297)} />{<ManoLeo texto="a rider · hit by a car" x={1240} y={240} desde={k60(303)} tam={66} />}</>} />
);
// ---------- 61 · «a bike just like his» ----------
export const Q61ComoLaSuya: React.FC = () => (
  <Bwy dia cl={[mira(0, BW.ghostbike - 260, 620, 2.4), mira(45, BW.ghostbike - 260, 615, 2.6)]}
    medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.ghostbike - 260, y: BP }]} poses={[{ f: 0, v: { hD: 10, cD: 30, hI: 10, cI: 30 } }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.4 } }]} />}
    hud={<Hud2 m={0} est="congelado" />} />
);
// ---------- 62 · Leo se queda parado mucho tiempo ----------
export const Q62Parado: React.FC = () => (
  <Bwy dia cl={[mira(0, BW.ghostbike - 150, 500, 0.9), mira(75, BW.ghostbike - 150, 500, 0.92)]}
    medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.ghostbike - 260, y: BP }]} poses={[{ f: 0, v: { hD: 10, cD: 30, hI: 10, cI: 30 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.4 } }]} />}
    hud={<Hud2 m={0} est="congelado" />} />
);
// ---------- 63 · lo cuarto: un monje que camina despacio, sin nada, con una cara tan calma ----------
const k63 = kDe(313.2);
export const Q63Monje: React.FC = () => (
  <Kap cl={[mira(0, K.monje - 300, 600, 1.2), mira(k63(318.9), K.monje - 60, 620, 1.6, { curva: "inout" }), mira(k63(319.0), K.monje - 40, 640, 2.6), mira(k63(325), K.monje - 30, 640, 2.8)]} sp={{ portonAbierto: 1 }}
    medio={<>
      <A look={MONJE_JOVEN} seed={70} ruta={[{ f: 0, x: K.monje - 200, y: KP }, { f: 354, x: K.monje + 40, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 30, cD: 120, hI: 30, cI: 120 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.2 } }]} />
    </>} hud={<Pildora texto="IV · A MONK" x={960} y={980} desde={4} color="#ffe2a6" />} />
);
// ---------- 64 · «who is that, Channa?» ----------
export const Q64Quien: React.FC = () => (
  <Kap cl={[mira(0, K.monje - 620, 620, 2.2), mira(49, K.monje - 620, 615, 2.4)]} sp={{ portonAbierto: 1 }}
    medio={<CarrozaViaje x0={K.monje - 580} x1={K.monje - 580} n={1} caraS="sorpresa" hablaS={[[0, 45]]} />} />
);
// ---------- 65 · «a man who left everything, to find out why we suffer» ----------
export const Q65Dejo: React.FC = () => (
  <Kap cl={[mira(0, K.monje - 500, 620, 2.0), mira(135, K.monje - 500, 615, 2.3)]} sp={{ portonAbierto: 1 }}
    medio={<CarrozaViaje x0={K.monje - 580} x1={K.monje - 580} n={1} caraS="duda" hablaC={[[0, 130]]} />} hud={<Pildora texto="WHY WE SUFFER" x={960} y={980} desde={80} color="#ffe2a6" />} />
);
// ---------- 66 · esa noche mira su palacio: la música, la seda, el jardín… una jaula hermosa ----------
export const Q66Jaula: React.FC = () => {
  const f = useF();
  const r = interpolate(f, [150, 262], [0, 1], cl);
  return (
    <>
      <Kap cl={[mira(0, K.jardin, 560, 1.2), mira(262, K.jardin, 440, 0.7)]} sp={{ noche: true, flores: 0.5 }}
        medio={<A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.jardin, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.5, y: -0.3 } }]} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: r }}>
        {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={120 + i * 140} y={interpolate(r, [0, 1], [-1080, 0])} width={14} height={1080} fill="#f2c14a" opacity={0.85} />)}
      </svg>
    </>
  );
};
// ---------- 67 · besa a su hijo dormido y sale a la oscuridad ----------
export const Q67Sale: React.FC = () => (
  <Kap cl={[mira(0, K.cuna, 700, 2.2), mira(60, K.cuna + 40, 690, 2.3), mira(61, K.porton, 560, 1.0), mira(117, K.porton + 80, 560, 1.05)]} sp={{ noche: true, portonAbierto: 1 }}
    medio={<><Bebe />
      <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.cuna + 150, y: KP }, { f: 60, x: K.cuna + 150, y: KP }, { f: 61, x: K.porton - 200, y: KP }, { f: 117, x: K.porton + 140, y: KP, curva: "lineal" }]} dir={[{ f: 0, v: -1 }, { f: 61, v: 1 }]}
        poses={[{ f: 0, v: { tronco: 34, cabeza: 24, hD: 30, cD: 20, hI: 30, cI: 20 } }, { f: 61, v: CAMINA }]} caras={[{ f: 0, v: "triste" }, { f: 61, v: "determinado" }]} /></>} />
);
// ---------- 68 · tres de la mañana. Día tres ----------
export const Q68Dia3: React.FC = () => <Fondo><TelGrande modo="hora" texto="3:00" sub="AM" />{H3}<Rotulo texto="DAY 3" desde={40} /></Fondo>;
// ---------- 69 · Leo entra; Tenzo dobla una toalla, despacio, punta con punta ----------
export const Q69Toalla: React.FC = () => (
  <Lav cl={[mira(0, 1900, 560, 1.0), mira(120, 1550, 600, 1.3), mira(173, 1550, 600, 1.35)]} toalla={(f) => Math.min(1, f / 170)}
    tenzo={{ poses: doblando(0, 173, 40) }} leo={{ ruta: [{ f: 0, x: 2400, y: LP }, { f: 150, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: CAMINA }], enManoD: null, caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }} hud={H3} />
);
// ---------- 70 · le tiende el tel: «here, like I promised» ----------
const k70 = kDe(352.16);
const TIENDE = { ...SENTADO, hD: 85, cD: 5, hI: 20, cI: 40, tronco: 4, cabeza: 2 };
export const Q70Tiende: React.FC = () => (
  <Lav cl={[mira(0, 1780, 600, 1.6), mira(150, 1790, 600, 1.75)]} toalla={1}
    tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 20, v: TIENDE }], enManoD: <Tel s={1.1} prendido={false} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], dir: [{ f: 0, v: 1 }], habla: [[k70(353.86), k70(355.6)]] }}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: CAMINA }], enManoD: null, caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.4, y: 0.4 } }] }} hud={H3} />
);
// ---------- 71 · ochenta y siete notificaciones ----------
export const Q71Ochenta: React.FC = () => <Fondo><TelGrande modo="hora" texto="87" sub="NOTIFICATIONS" />{H3}</Fondo>;
// ---------- 72 · no lo agarra ----------
export const Q72NoAgarra: React.FC = () => (
  <Lav cl={[mira(0, 1900, 620, 2.4), mira(41, 1900, 615, 2.5)]} toalla={1}
    tenzo={{ poses: [{ f: 0, v: TIENDE }], enManoD: <Tel s={1.1} />, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }] }}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 10, cD: 120, hI: 10, cI: 120 } }], enManoD: null, caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: -0.9, y: 0.3 } }] }} hud={H3} />
);
// ---------- 73 · «I saw an old man… my mom is sick… a white bike on Argyle… how did I not see any of it?» ----------
const k73 = kDe(360.32);
export const Q73Vi: React.FC = () => (
  <Lav cl={[mira(0, 1960, 690, 2.4), mira(k73(367.4), 1955, 685, 2.6), mira(k73(367.5), 1955, 680, 3.0), mira(323, 1955, 680, 3.2)]} tenzo={{ no: true }} toalla={1}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 10, cD: 120, hI: 10, cI: 120 } }, { f: k73(366), v: { hD: 30, cD: 140, hI: 30, cI: 140, cabeza: 10 } }], enManoD: null,
      caras: [{ f: 0, v: "duda" }, { f: k73(363), v: "triste" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, k73(365.24)], [k73(365.32), k73(367.38)], [k73(369.18), k73(370.56)]] }}
    hud={<>{H3}<ManoLeo texto="how did I not see it?" x={260} y={250} desde={k73(369.2)} tam={70} /></>} />
);
// ---------- 74 · «because the palace was very beautiful… it just never shows you the road» ----------
const k74 = kDe(371.1);
export const Q74Hermoso: React.FC = () => (
  <Lav cl={[mira(0, 1700, 650, 2.4), mira(266, 1710, 640, 2.8)]} leo={{ no: true }} toalla={1}
    tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, hD: 40, cD: 30 } }], enManoD: <Tel s={1.1} prendido={false} />, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_T }], habla: [[0, k74(372.6)], [k74(374.28), k74(375.8)], [k74(375.9), k74(377.4)], [k74(377.46), k74(379.08)]] }}
    hud={<>{H3}<Pildora texto="IT JUST NEVER SHOWS YOU THE ROAD" x={960} y={980} desde={k74(377.5)} color="#ffe2a6" /></>} />
);
// ---------- 75 · «so what do I do? Throw it in the lake?» ----------
export const Q75Lago: React.FC = () => (
  <Lav cl={[mira(0, 1960, 690, 2.6), mira(78, 1960, 685, 2.7)]} tenzo={{ no: true }} toalla={1}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 60, cI: 60 } }], enManoD: null, caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, 70]] }} hud={H3} />
);
// ---------- 76 · Tenzo se ríe bajito: «el príncipe no quemó el palacio, salió por el portón… todos los días, una vez» ----------
const k76 = kDe(382.58);
export const Q76Porton: React.FC = () => (
  <Lav cl={[mira(0, 1700, 650, 2.6), mira(k76(385.5), 1700, 650, 2.6), mira(k76(385.58), 1800, 620, 1.7), mira(370, 1800, 615, 1.9)]} toalla={1}
    tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, hD: 40, cD: 30, tronco: -4 } }, { f: k76(389.4), v: { ...DOBLA_A, hD: 110, cD: 20 } }], enManoD: <Tel s={1.1} prendido={false} />, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "risa" }, { f: k76(385.5), v: "feliz" }], miradas: [{ f: 0, v: MIRA_T }],
      habla: [[k76(385.58), k76(389.28)], [k76(389.36), k76(394.9)]] }}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 10, cD: 120, hI: 10, cI: 120 } }], enManoD: null, caras: [{ f: 0, v: "duda" }, { f: k76(390), v: "neutral" }], miradas: [{ f: 0, v: MIRA_L }] }}
    hud={<>{H3}<Pildora texto="WALK OUT OF THE GATE · ONCE A DAY" x={960} y={980} desde={k76(389.6)} color="#ffe2a6" /></>} />
);
// ---------- 77 · Leo agarra el tel. No lo abre ----------
const k77 = kDe(395.1);
export const Q77Agarra: React.FC = () => (
  <Lav cl={[mira(0, 1880, 640, 2.2), mira(93, 1885, 640, 2.4)]} toalla={1}
    tenzo={{ poses: [{ f: 0, v: TIENDE }, { f: 30, v: DOBLA_A }], enManoD: (fr: number) => (fr < 26 ? <Tel s={1.1} prendido={false} /> : null), dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }] }}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 80, cD: 10 } }, { f: 30, v: { hD: 30, cD: 110, hI: 10, cI: 20 } }], enManoD: (fr: number) => (fr >= 26 ? <Tel prendido={false} /> : null), caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }] }}
    hud={<>{H3}<ManoLeo texto="doesn't open it" x={1260} y={250} desde={k77(396.6)} tam={66} /></>} />
);
// ---------- 78 · hace algo que no hizo en 19 días: llama a su madre. Suena. Una. Dos. «Leo, baby, is that you?» ----------
const k78 = kDe(398.2);
export const Q78Llama: React.FC = () => {
  const f = useF();
  const pant = f >= k78(400.9) && f < k78(405.9);
  return pant
    ? <Fondo><TelGrande modo="hora" texto="MOM" sub={f < k78(403.22) ? "CALLING…" : f < k78(404.96) ? "RINGING · 1" : "RINGING · 2"} />{H3}</Fondo>
    : <Lav cl={[mira(0, 1960, 690, 2.6), mira(310, 1960, 685, 2.9)]} tenzo={{ no: true }} toalla={1}
      leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 30, cD: 110, hI: 10, cI: 20 } }, { f: k78(405.9), v: { hD: 20, cD: 150, hI: 10, cI: 20, cabeza: 6 } }], enManoD: <Tel />,
        caras: [{ f: 0, v: "duda" }, { f: k78(405.94), v: "triste" }], miradas: [{ f: 0, v: { x: -0.2, y: 0.6 } }, { f: k78(405.9), v: { x: 0.2, y: 0 } }] }}
      hud={<>{H3}{f >= k78(405.94) && <Frase texto="“Leo, baby… is that you?”" desde={k78(406)} y={920} tam={60} />}</>} />;
};
// ---------- 79 · día cuatro. Screen time: 2 h 06 m ----------
export const Q79Dia4: React.FC = () => <Fondo><TelGrande modo="screentime" min={126} desde={10} /><Hud2 m={126} dia={4} /><Rotulo texto="DAY 4 · 2H 06M" desde={4} /></Fondo>;
// ---------- 80 · esa noche, a las 2, solo en su cuarto: el tel se prende; la sombra se inclina, más grande que nunca ----------
const k80 = kDe(412.88);
export const Q80Noche: React.FC = () => {
  const f = useF();
  const prende = f >= k80(416.2);
  const esc = interpolate(f, [k80(418.2), k80(421.4)], [1.3, 2.1], cl);
  return (
    <Cto cl={[mira(0, CTO_PUNTOS.colchon, 520, 1.0), mira(k80(416.1), CTO_PUNTOS.colchon + 100, 600, 1.4), mira(k80(421.4), CTO_PUNTOS.colchon - 50, 520, 1.25, { curva: "inout" }), mira(323, CTO_PUNTOS.colchon - 50, 520, 1.3)]}
      leo={{ poses: [{ f: 0, v: { tronco: -60, cabeza: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 10, cD: 20, hI: 10, cI: 20 } }], enManoD: null, caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: prende ? { x: 0.8, y: 0.2 } : { x: 0, y: -0.6 } }] }}
      medio={<TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={prende ? 1 : 0} />}
      detras={f >= k80(418.2) ? maraCuarto(esc, CTO_PUNTOS.colchon - 40, { opacidad: () => Math.min(0.96, (f - k80(418.2)) / 30), caras: [{ f: 0, v: "picaro" }], habla: [[k80(421.5), k80(423.6)]] }) : null}
      hud={<><Hud2 m={126} dia={4} /><Rotulo texto="2:00 AM" desde={6} hasta={90} />{f >= k80(422.7) && <ManoMara texto="you did so well" x={300} y={230} desde={k80(422.7)} tam={84} />}</>} />
  );
};
// ---------- 81 · «you deserve a reward. Just ten minutes» ----------
const k81 = kDe(423.72);
export const Q81Premio: React.FC = () => (
  <Cto cl={[mira(0, CTO_PUNTOS.colchon - 40, 420, 1.5), mira(114, CTO_PUNTOS.colchon - 40, 410, 1.7)]}
    leo={{ poses: [{ f: 0, v: { tronco: -60, cabeza: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 10, cD: 20, hI: 10, cI: 20 } }], enManoD: null, caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.2 } }] }}
    medio={<TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={1} />}
    detras={maraCuarto(2.1, CTO_PUNTOS.colchon - 40, { caras: [{ f: 0, v: "picaro" }], habla: [[0, k81(425.8)], [k81(425.88), k81(426.7)]] })}
    hud={<><Hud2 m={126} dia={4} /><ManoMara texto="you deserve a reward" x={300} y={230} desde={2} hasta={k81(425.8)} tam={84} /><ManoMara texto="just ten minutes" x={300} y={230} desde={k81(425.9)} tam={84} /></>} />
);
// ---------- 82 · Leo agarra el tel ----------
export const Q82Agarra: React.FC = () => (
  <Cto cl={[mira(0, CTO_PUNTOS.colchon + 120, 720, 2.6), mira(54, CTO_PUNTOS.colchon + 130, 720, 2.8)]}
    leo={{ poses: [{ f: 0, v: { tronco: -60, cabeza: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: 14, v: { tronco: -40, cabeza: 6, pI: 88, rI: 4, pD: 84, rD: 10, hD: 90, cD: 20, hI: 10, cI: 20 } }, { f: 40, v: { tronco: -30, cabeza: 18, pI: 88, rI: 4, pD: 84, rD: 10, hD: 30, cD: 125, hI: 10, cI: 20 } }],
      enManoD: (fr: number) => (fr >= 26 ? <Tel /> : null), caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.3 } }, { f: 40, v: { x: 0.3, y: 0.7 } }] }}
    medio={<>{useF() < 26 && <TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={1} />}</>} hud={<Hud2 m={126} dia={4} est="sube" />} />
);
// ---------- 83 · CTA: «What is in your palace?» + suscribirse ----------
export const Q83Cta: React.FC = () => (
  <Fondo>
    <Frase texto="What is in your palace?" desde={4} y={460} tam={84} />
    <Frase texto="What would you see if you walked out of the gate?" desde={50} y={580} tam={46} color="#c9c3b8" />
    <Pildora texto="SUBSCRIBE · DAY 5 TOMORROW" x={960} y={800} desde={170} color="#ff6a2b" />
  </Fondo>
);

export { LEO, AbsoluteFill, BW };
