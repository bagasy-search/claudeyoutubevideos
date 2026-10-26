// tz01 · planos 29-45 (112,4 → 211 s): la parábola. Vaishali, Amrapali, los monjes, el Buda y los 500.
import React from "react";
import { mira, useF } from "../anikit/camara";
import { Actor, ActorProps } from "../anikit/actor";
import { Pildora } from "../anikit/pantalla";
import { ALDEANA, ALDEANO, AMRAPALI, BUDA, ESC, LOTO, LOTO_ENSENA, MONJE_JOVEN, REY } from "../tenzo/elenco";
import { Look } from "../anikit/personaje";
import { Rotulo } from "../tenzo/hud";
import { Cuenco, Elefante } from "../tenzo/utileria";
import { VAI_PISO, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { kDe, Lav, LAV_PUNTOS, Vai } from "./base";
import { Hud } from "./planos1";

const VP = VAI_PISO, V = VAI_PUNTOS;
const A: React.FC<ActorProps> = (p) => <Actor escala={ESC} {...p} />;
// monjes de la arboleda / de la fila: variantes del joven (más viejos, otra piel)
export const MONJE = (k: number): Look => ({ ...MONJE_JOVEN, piel: ["#c98e5e", "#d9a273", "#b9855a", "#e0b080"][k % 4], miembro: ["#c98e5e", "#d9a273", "#b9855a", "#e0b080"][k % 4], accesorios: [{ t: "pelo", forma: "calvo", color: ["#c98e5e", "#d9a273", "#b9855a", "#e0b080"][k % 4] }, { t: "tunica", color: ["#e07a2c", "#d8702a", "#e88a34", "#d06a24"][k % 4], largo: 0.9 }] });
export const HOMBRE = (k: number): Look => ({ ...ALDEANO, camisa: ["#d9a86e", "#c8603a", "#a8723a", "#e0b040", "#8a6a4a"][k % 5], accesorios: [{ t: "pelo", forma: "corto", color: "#22160e" }, ...(k % 2 ? [{ t: "barba" as const, color: "#22160e" }] : [])] });
// el Buda bajo el árbol y el joven (posiciones fijas de la arboleda)
export const Buda: React.FC<Partial<ActorProps>> = (o) => <A look={BUDA} seed={11} ruta={[{ f: 0, x: V.buda, y: VP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: LOTO }]} caras={[{ f: 0, v: "neutral" }]} dir={[{ f: 0, v: -1 }]} {...o} />;
// monjes sentados con cara (primera fila de la arboleda)
export const MonjesCara: React.FC<{ caras?: string[]; habla?: [number, number][][]; giran?: number }> = ({ caras = [], habla = [], giran = 0 }) => (
  <>{[0, 1, 2, 3, 4].map((k) => {
    const x = V.monjes - 420 + k * 150 + (k > 2 ? 820 : 0);
    return <A key={k} look={MONJE(k)} seed={20 + k} escala={ESC * 0.92} ruta={[{ f: 0, x, y: VP + 60 }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: LOTO }]}
      caras={[{ f: 0, v: caras[k] ?? "neutral" }]} dir={[{ f: 0, v: k > 2 ? -1 : 1 }]} habla={habla[k]} giros={giran ? [{ f: 0, v: 0 }, { f: giran, v: k % 2 ? 0.5 : -0.5 }] : undefined} />;
  })}</>
);

// ---------- 29 · «2,500 years ago, the old man says» ----------
const k29 = kDe(112.36);
export const P29Cuenta: React.FC = () => (
  <Lav cl={[mira(0, 1660, 640, 2.3), mira(78, 1640, 650, 2.6)]} leo={{ no: true }} sp={{ luzFarol: 1.3 }} toalla={0.5}
    tenzo={{ habla: [[0, k29(115)]], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], poses: [{ f: 0, v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 50, cD: 60, hI: 40, cI: 40 } }] }} hud={<Hud />} />
);
// ---------- 29b · Vaishali: oro en las puertas, música cada noche ----------
export const P29Calle: React.FC = () => (
  <Vai cl={[mira(0, 700, 400, 0.75), mira(90, 600, 560, 1.05), mira(180, 590, 700, 2.0, { curva: "inout" }), mira(200, 590, 700, 2.1)]} sp={{ noche: false }}
    medio={<>{[0, 1, 2, 3].map((k) => <A key={k} look={k % 2 ? ALDEANA : HOMBRE(k)} seed={30 + k} ruta={[{ f: 0, x: -200 + k * 380, y: VP }, { f: 200, x: 100 + k * 380, y: VP, curva: "lineal" }]} caras={[{ f: 0, v: "feliz" }]} />)}</>}
    hud={<Rotulo texto="VAISHALI, INDIA · 2,500 YEARS AGO" desde={8} />} />
);
// ---------- 30 · una mujer llamada Amrapali ----------
export const P30Amrapali: React.FC = () => (
  <Vai cl={[mira(0, V.pabellon, 560, 1.1), mira(110, V.pabellon, 640, 1.8)]} sp={{ noche: true }}
    medio={<A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.pabellon, y: VP - 40 }]} asiento={[{ f: 0, v: 40 }]} poses={[{ f: 0, v: { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 60, hI: 20, cI: 40 } }]} caras={[{ f: 0, v: "feliz" }]} giros={[{ f: 0, v: 0.3 }]} />}
    hud={<Pildora texto="AMRAPALI" x={960} y={980} desde={30} color="#ffe2a6" />} />
);
// ---------- 31 · el farol titila ----------
export const P31Titila: React.FC = () => {
  const f = useF();
  return <Lav cl={[mira(0, LAV_PUNTOS.farol, 660, 3.0), mira(70, LAV_PUNTOS.farol, 660, 3.6)]} leo={{ no: true }} sp={{ luzFarol: f % 9 < 3 ? 0.5 : 1.4 }} toalla={0.5} hud={<Hud />} />;
};
// ---------- 31b · viento caliente, elefantes en la calle ----------
export const P31Elefantes: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, 300, 520, 0.95), mira(118, 700, 520, 1.0)]} sp={{}}
      medio={<>
        <Elefante x={-300 + f * 4} piso={VP} dir={1} s={1.3} paso={f / 28} />
        <Elefante x={-900 + f * 4} piso={VP} dir={1} s={1.1} paso={f / 28 + 0.4} />
        {[0, 1, 2].map((k) => <A key={k} look={HOMBRE(k + 2)} seed={40 + k} ruta={[{ f: 0, x: 900 + k * 260, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: "parado" }]} />)}
      </>} />
  );
};
// ---------- 32 · el jardín de mangos y la mujer más bella de la India ----------
export const P32Mangos: React.FC = () => (
  <Vai cl={[mira(0, 2350, 460, 1.3), mira(80, 2700, 560, 1.2, { curva: "inout" }), mira(160, 2900, 600, 1.6)]}
    medio={<A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: 2600, y: VP }, { f: 160, x: 2950, y: VP }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: { hD: 30, cD: 50, hI: 20, cI: 30 } }]} />} />
);
// ---------- 33 · príncipes cruzaban ríos; reyes hacían guerras ----------
export const P33Reyes: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, 1300, 520, 0.95), mira(125, 1600, 520, 1.05)]}
      medio={<>
        <Elefante x={800 + Math.min(f, 90) * 6} piso={VP} dir={1} s={1.3} paso={f < 90 ? f / 28 : 0} />
        {[0, 1, 2].map((k) => <A key={k} look={REY} seed={50 + k} ruta={[{ f: 0, x: 1100 + k * 160, y: VP }, { f: 100, x: 1500 + k * 120, y: VP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: k === 1 ? "enojo" : "determinado" }]} poses={[{ f: 0, v: k === 0 ? "brazosCruzados" : "parado" }]} />)}
        <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal + 40, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "neutral" }]} />
      </>} />
  );
};
// ---------- 34 · todos sabían su nombre ----------
export const P34Todos: React.FC = () => (
  <Vai cl={[mira(0, 1300, 560, 1.2), mira(172, 1450, 580, 1.4)]}
    medio={<>
      {[0, 1, 2, 3, 4].map((k) => <A key={k} look={HOMBRE(k)} seed={60 + k} ruta={[{ f: 0, x: 900 + k * 170, y: VP }]} dir={[{ f: 0, v: k % 2 ? -1 : 1 }, { f: 20 + k * 8, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: 24 + k * 8, v: "sorpresa" }]} miradas={[{ f: 24 + k * 8, v: { x: 1, y: 0 } }]} />)}
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} />
    </>} />
);
// ---------- 35 · una fila de monjes con cuencos por su calle ----------
export const P35Monjes: React.FC = () => (
  <Vai cl={[mira(0, 900, 580, 1.15), mira(216, 1500, 580, 1.15)]}
    medio={<>{[0, 1, 2, 3, 4].map((k) => (
      <A key={k} look={k === 4 ? MONJE_JOVEN : MONJE(k)} seed={70 + k} ruta={[{ f: 0, x: 450 - k * 190, y: VP }, { f: 216, x: 1650 - k * 190, y: VP, curva: "lineal" }]}
        caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }]} enManoD={<Cuenco />} />
    ))}</>}
    hud={<Pildora texto="SHAVED HEADS · ORANGE ROBES · BOWLS" x={960} y={980} desde={20} hasta={120} color="#ffe2a6" />} />
);
// ---------- 36 · el joven, tan calmo; ella lo para en su portón ----------
export const P36Joven: React.FC = () => (
  <Vai cl={[mira(0, V.portal - 300, 560, 2.4), mira(110, V.portal - 280, 560, 2.5), mira(150, V.portal - 160, 600, 1.5, { curva: "inout" }), mira(222, V.portal - 150, 600, 1.6)]}
    medio={<>
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 420, y: VP }, { f: 160, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }]} enManoD={<Cuenco />} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal + 120, y: VP }, { f: 150, x: V.portal + 120, y: VP }, { f: 175, x: V.portal - 40, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: "parado" }, { f: 170, v: { hD: 80, cD: 10 } }]} />
    </>} />
);
// ---------- 37 · «stay here, in my house» ----------
export const P37Lluvias: React.FC = () => (
  <Vai cl={[mira(0, V.portal - 130, 560, 1.9), mira(213, V.portal - 130, 560, 2.15)]}
    medio={<>
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }]} enManoD={<Cuenco />} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 40, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: 100, v: "picaro" }]} habla={[[0, 80], [90, 200]]} poses={[{ f: 0, v: { hD: 40, cD: 60 } }, { f: 110, v: { hD: 100, cD: 20 } }]} />
    </>} />
);
// ---------- 38 · toda la calle contiene el aliento ----------
export const P38Aliento: React.FC = () => (
  <Vai cl={[mira(0, 1350, 560, 1.0), mira(76, 1450, 560, 1.15)]}
    medio={<>
      {[0, 1, 2, 3, 4].map((k) => <A key={k} look={HOMBRE(k)} seed={60 + k} ruta={[{ f: 0, x: 900 + k * 150, y: VP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "sorpresa" }]} poses={[{ f: 0, v: k % 2 ? "manosCara" : "parado" }]} />)}
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }]} enManoD={<Cuenco />} poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }]} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 40, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} />
    </>} />
);
// ---------- 39 · se inclina: «I will ask my teacher» ----------
const k39 = kDe(171.04);
export const P39Reverencia: React.FC = () => (
  <Vai cl={[mira(0, V.portal - 200, 620, 2.2), mira(100, V.portal - 200, 620, 2.4)]}
    medio={<>
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.portal - 220, y: VP }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }, { f: 20, v: { tronco: 38, cabeza: 10, hD: 60, cD: 100, hI: 60, cI: 100 } }, { f: 46, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }]} habla={[[k39(172.7), k39(174.4)]]} enManoD={<Cuenco />} />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.portal - 40, y: VP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} />
    </>} />
);
// ---------- 40 · vuelve a la arboleda: el Buda y 500 monjes esperan ----------
const k40 = kDe(174.4);
export const P40Arboleda: React.FC = () => (
  <Vai cl={[mira(0, 4900, 380, 0.7), mira(120, 5100, 640, 0.95, { curva: "inout" }), mira(250, 5250, 720, 1.5), mira(373, 5280, 730, 1.65)]}
    medio={<>
      <Buda miradas={[{ f: 0, v: { x: -0.8, y: 0.1 } }]} />
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: 4400, y: VP }, { f: 200, x: V.buda - 260, y: VP }]} asiento={[{ f: 0, v: undefined }, { f: 215, v: 8 }]}
        poses={[{ f: 0, v: "parado" }, { f: 215, v: { ...LOTO, tronco: 20 } }]} habla={[[k40(181), k40(186.2)]]} caras={[{ f: 0, v: "neutral" }]} />
    </>} />
);
// ---------- 41 · los monjes cuchichean; se ríen, se enojan ----------
export const P41Murmullo: React.FC = () => (
  <Vai cl={[mira(0, 4700, 800, 1.6), mira(135, 5000, 800, 1.7)]} sp={{ murmullo: 1 }}
    medio={<MonjesCara caras={["risa", "enojo", "duda", "risa", "enojo"]} habla={[[[0, 60]], [[20, 100]], [], [[40, 130]], [[10, 90]]]} giran={10} />} />
);
// ---------- 42 · ¿un monje en la casa de una cortesana? escándalo ----------
export const P42Escandalo: React.FC = () => (
  <Vai cl={[mira(0, 4580, 810, 2.4), mira(100, 4730, 810, 2.4, { curva: "inout" }), mira(197, 5560, 810, 2.3, { curva: "inout" })]} sp={{ murmullo: 0.8 }}
    medio={<MonjesCara caras={["enojo", "asco", "enojo", "duda", "enojo"]} habla={[[[0, 90]], [[60, 140]], [], [], [[120, 197]]]} />} />
);
// ---------- 43 · el Buda lo mira mucho rato: «Do you want to go?» ----------
const k43 = kDe(197.96);
export const P43Pregunta: React.FC = () => (
  <Vai cl={[mira(0, V.buda - 40, 740, 2.0), mira(150, V.buda - 10, 760, 2.6)]}
    medio={<>
      <Buda habla={[[k43(203.1), k43(204.4)]]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} />
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 260, y: VP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { ...LOTO, tronco: 10 } }]} caras={[{ f: 0, v: "neutral" }]} />
    </>} />
);
// ---------- 44 · «I will do what you say» · «Then go» ----------
const k44 = kDe(204.62);
export const P44Ve: React.FC = () => (
  <Vai cl={[mira(0, V.buda - 260, 760, 2.4), mira(80, V.buda - 260, 760, 2.4), mira(86, V.buda - 30, 760, 2.4), mira(119, V.buda - 30, 760, 2.55)]}
    medio={<>
      <Buda habla={[[k44(207.4), k44(208.4)]]} poses={[{ f: 0, v: LOTO }, { f: k44(207.3), v: LOTO_ENSENA }]} caras={[{ f: 0, v: "neutral" }, { f: k44(207.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} />
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: V.buda - 260, y: VP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { ...LOTO, tronco: 22 } }]} habla={[[0, k44(207.4)]]} caras={[{ f: 0, v: "neutral" }]} />
    </>} />
);
// ---------- 45 · quinientos monjes no lo pueden creer ----------
export const P45NoCreen: React.FC = () => (
  <Vai cl={[mira(0, 5200, 640, 0.85), mira(71, 5200, 640, 0.75)]} sp={{ murmullo: 1 }}
    medio={<><MonjesCara caras={["sorpresa", "sorpresa", "sorpresa", "sorpresa", "sorpresa"]} /><Buda /></>} />
);
