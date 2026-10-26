// ycn01 · planos 1-32 (0 → 195 s): cold open de la persiana, Hollis Lanes, el elenco, CTA, la TV azul y el walkie de Ana.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, golpe, useF } from "../../anikit/camara";
import { Contador, Pildora, F_HUD } from "../../anikit/pantalla";
import { Walkie } from "../../anikit/props";
import { NELL, CAL, DOT, RAFI, MARLON, ANA, PINPAL, LIGA, LIGA2, LIGA3, RIM, ROJO, AMARILLO, zombi, WAFFLE } from "../elenco";
import { pistaX, PISTAS_PUNTOS as PP } from "../sets/pistas";
import { Bola, Linterna, Maletin, Pancho, Papas, Anotador } from "../utileria";
import { Mapa, Velo as VeloX } from "../../anikit/explica";
import { A, Afuera, Dice, Sacude, Foto, HudDia, kDe, Maquinas, P, Rotulo, Sala, Velo } from "../base";

const CH = PP.cadena, PU = PP.puerta;
const caeLenta = (f0: number, f1: number, a = 0.55, b = 0.93) => (f: number) => interpolate(f, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const tironCadena = (n: number) => Array.from({ length: n }).flatMap((_, i) => [{ f: i * 16, v: "agarrarAlto" }, { f: i * 16 + 8, v: { hD: 60, cD: 40, hI: 70, cI: 30, tronco: 12, bajar: 6 } }]);

// ---------- 1 · CUADRO 0: la mano en la manga amarilla bajo la persiana que baja (DAY 1) ----------
export const P01Mano: React.FC = () => {
  const f = useF();
  return (
    <Sala cl={[mira(0, PU - 60, P - 120, 2.9), mira(110, PU - 40, P - 110, 3.2, { curva: "inout" })]} sp={{ luz: "alerta", persiana: caeLenta(0, 110, 0.6, 0.84) }}
      gente={[
        { l: NELL, x: PU - 210, p: { tronco: 58, pI: 70, rI: 120, pD: 80, rD: 125, hD: 92, cD: 0, hI: 70, cI: 20, cabeza: -30 }, c: "miedo", mir: { x: 1, y: 0.3 }, d: 1 },
        { l: zombi(LIGA), x: PU + 300, p: "zombi", c: "zombi", d: -1, luz: RIM.neon, op: () => 0.85 },
      ]}
      extra={<g transform={`translate(${PU + 40},${P - 8})`}><Walkie s={1.1} luz={f % 30 < 15} /></g>}
      hud={<HudDia dia={1} rayas={1} />} />
  );
};

// ---------- 2 · Cal en la cadena, la persiana baja, algo tira del otro lado ----------
export const P02Cadena: React.FC = () => {
  const k = kDe(3.7);
  const f = useF();
  return (
    <Sacude en={[k(7)]} amp={6}><Sala cl={[mira(0, PU + 80, P - 260, 1.25), mira(k(8), PU + 120, P - 240, 1.45, { curva: "inout" }), mira(k(11.5), PU + 40, P - 200, 1.6, { curva: "inout" })]}
      sp={{ luz: "alerta", persiana: caeLenta(0, k(11.6), 0.5, 0.82) }}
      gente={[
        { l: CAL, x: CH - 40, p: tironCadena(16), c: "determinado", d: 1 },
        { l: NELL, x: PU - 200, p: { tronco: 58, pI: 70, rI: 120, pD: 80, rD: 125, hD: 92, cD: 0, hI: 70, cI: 20, cabeza: -30 }, c: "miedo", d: 1 },
        { l: DOT, x: PU - 640, p: [{ f: 0, v: "señalar" }, { f: 40, v: "hablar" }], c: "enojo", habla: [[0, 120]], d: 1 },
      ]}
      hud={<><HudDia dia={1} rayas={1} /><Dice quien="nell" t="(my walkie!)" x={300} y={200} desde={k(5)} hasta={k(11.4)} tam={56} /></>} /></Sacude>
  );
};

// ---------- 3 · Rafi corre a agarrarla; congelado con DAY 1 ----------
export const P03Agarra: React.FC = () => {
  const k = kDe(11.58);
  const f = useF();
  const congela = k(17.2);
  const ff = Math.min(f, congela);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, PU - 500, P - 260, 1.05), mira(k(15), PU - 260, P - 230, 1.35, { curva: "inout" })]} sp={{ luz: "alerta", persiana: () => 0.82 + 0.06 * Math.min(1, ff / congela) }}
        gente={[
          { l: RAFI, ruta: [{ f: 0, x: PU - 1500 }, { f: k(16.4), x: PU - 300, curva: "out" }], correr: 1, c: "miedo", d: 1, p: [{ f: 0, v: "parado" }, { f: k(16.4), v: { tronco: 40, hD: 80, cD: 10, hI: 70, cI: 20, pI: -20, pD: 30, rD: 40 } }] },
          { l: NELL, x: PU - 200, p: { tronco: 58, pI: 70, rI: 120, pD: 80, rD: 125, hD: 92, cD: 0, hI: 70, cI: 20, cabeza: -30 }, c: "miedo", d: 1 },
          { l: CAL, x: CH - 40, p: tironCadena(12), c: "determinado", d: 1 },
        ]}
        hud={<HudDia dia={1} rayas={1} />} />
      {f >= congela && <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [congela, congela + 6], [0.5, 0], { extrapolateRight: "clamp" }) }} />}
      {f >= congela && <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 64, letterSpacing: 6, color: "#f4efe4", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>THE FIRST NIGHT AT HOLLIS LANES</div>}
    </AbsoluteFill>
  );
};

// ---------- 4 · afuera: el letrero rosa bajo la lluvia ----------
export const P04Fachada: React.FC = () => (
  <Afuera cl={[mira(0, 2700, -110, 0.9), mira(130, 2050, 660, 1.1, { curva: "inout" })]} sp={{}}
    gente={[{ l: LIGA, ruta: [{ f: 0, x: 1500 }, { f: 130, x: 2150 }], c: "feliz", mD: <Bola s={0.8} /> }, { l: LIGA3, ruta: [{ f: 0, x: 1300 }, { f: 130, x: 1950 }], c: "risa", habla: [[30, 110]] }]}
    hud={<><Pildora texto="HOLLIS LANES · ROUTE 4 · HAMILTON, OH" x={960} y={960} desde={50} /><HudDia dia={1} desde={999} /></>} />
);

// ---------- 5 · la Route 4, cómo llegamos: autos, el letrero que zumba ----------
export const P05Ruta: React.FC = () => {
  const k = kDe(22.36);
  return (
    <Afuera cl={[mira(0, 450, 720, 1.4), mira(k(27.4), 1380, 720, 1.4, { curva: "lineal" })]} sp={{}}
      gente={[{ l: LIGA2, ruta: [{ f: 0, x: 300 }, { f: k(27.4), x: 1500 }], c: "feliz", mD: <Bola color="#2f6fd0" s={0.8} /> }, { l: PINPAL, ruta: [{ f: 0, x: 0 }, { f: k(27.4), x: 1250 }], c: "risa", habla: [[0, 120]] }]}
      hud={<><Rotulo t="Route 4 · Hamilton, Ohio" x={140} y={120} desde={k(23.5)} /></>} />
  );
};

// ---------- 6 · adentro: dieciséis pistas, bolas rodando ----------
export const P06Sala: React.FC = () => {
  const k = kDe(27.4);
  return (
    <Sala cl={[mira(0, pistaX(5), 620, 1.2), mira(k(31.5), pistaX(9), 630, 1.1, { curva: "inout" })]}
      sp={{ tiros: [{ pista: 3, f0: 10 }, { pista: 7, f0: 40, bola: "#ff5fa8" }, { pista: 11, f0: 70 }, { pista: 14, f0: 20 }] }}
      gente={[
        { l: LIGA, x: pistaX(3), p: "tirarSuelta", c: "determinado", d: 1 }, { l: PINPAL, x: pistaX(7) - 60, p: "celebrar", c: "risa" },
        { l: LIGA3, x: pistaX(11), p: "tirarSuelta", c: "feliz" }, { l: LIGA2, x: pistaX(14), p: "manosCintura", c: "neutral" },
      ]}
      hud={<Rotulo t="16 lanes" x={1300} y={150} desde={k(28.6)} />} />
  );
};

// ---------- 7 · el snack bar: la freidora, el olor ----------
export const P07Snack: React.FC = () => {
  const k = kDe(31.5);
  return (
    <Sala cl={[mira(0, -1100, 620, 1.2), mira(k(33.9), -900, 640, 1.35, { curva: "inout" })]} snack
      detras={[{ l: RAFI, x: -1250, p: [{ f: 0, v: "hablar" }, { f: 30, v: { hD: 70, cD: 60 } }], c: "cansado", d: -1 }]}
      hud={<Rotulo t="the snack bar" x={1200} y={200} desde={8} flecha="izq" />} />
  );
};

// ---------- 8 · Rafi (yo): gorro, delantal, auriculares; el menú ----------
export const P08Rafi: React.FC = () => {
  const k = kDe(33.88);
  return (
    <Sala cl={[mira(0, -900, 663, 2.6), mira(k(36.3), -900, 669, 2.4), mira(k(36.9), -900, 600, 2.1, { curva: "inout" }), mira(k(39.3), -900, 600, 2.0), mira(k(40.1), -820, 731, 1.35, { curva: "inout" })]} snack
      detras={[{ l: RAFI, x: -900, p: [{ f: 0, v: "saludar" }, { f: k(36.5), v: "hablar" }, { f: k(39.5), v: { hD: 80, cD: 30 } }], c: [{ f: 0, v: "feliz" }, { f: k(39), v: "picaro" }], mD: (ff: number) => (ff > k(39.5) ? <Pancho /> : null), mir: { x: 0.2, y: 0 } }]}
      gente={[{ l: LIGA3, x: -620, p: "parado", c: "feliz", d: -1 }]}
      hud={<><Rotulo t="RAFI · 17 · me" x={1240} y={300} desde={k(34.3)} hasta={k(38.4)} flecha="izq" /><Pildora texto="CHILI DOG $5 · PRETZEL $2" x={960} y={900} desde={k(40)} /></>} />
  );
};

// ---------- 9 · martes de octubre: la noche de liga ----------
export const P09Martes: React.FC = () => {
  const k = kDe(42.42);
  return (
    <Sala cl={[mira(0, 1920, -250, 1.0), mira(k(45.6), 1700, 300, 0.75, { curva: "inout" })]} sp={{ tiros: [{ pista: 5, f0: 20 }, { pista: 9, f0: 60 }] }}
      gente={[{ l: LIGA, x: pistaX(5), p: "tirarSuelta", c: "feliz" }, { l: LIGA2, x: pistaX(9), p: "celebrar", c: "risa" }]}
      hud={<Dice quien="otro" t="Tuesday. October." x={1180} y={900} desde={10} tam={80} />} />
  );
};

// ---------- 10 · las Pin Pals en la 7 y la 8; Dot, la más ruidosa ----------
export const P10PinPals: React.FC = () => {
  const k = kDe(45.68);
  return (
    <Sala cl={[mira(0, 1680, 560, 0.9), mira(k(50), 1760, 600, 1.15, { curva: "inout" })]} sp={{ tiros: [{ pista: 7, f0: k(49), bola: "#ff5fa8" }] }}
      gente={[
        { l: PINPAL, x: 1300, p: "brazosCruzados", c: "feliz" }, { l: PINPAL, x: 1420, p: "celebrar", c: "risa", seed: 7 }, { l: PINPAL, x: 2000, p: "manosCintura", c: "feliz", d: -1, seed: 8 },
        { l: PINPAL, x: 2120, p: "hablar", c: "risa", habla: [[0, 200]], d: -1, seed: 9 }, { l: PINPAL, x: 1180, p: "pensar", c: "neutral", seed: 10 },
        { l: DOT, ruta: [{ f: 0, x: pistaX(7) - 120 }, { f: k(48.8), x: pistaX(7) - 20 }], p: [{ f: 0, v: "tirarCarga" }, { f: k(48.8), v: "tirarSuelta" }, { f: k(50.6), v: "celebrar" }], c: [{ f: 0, v: "determinado" }, { f: k(50.6), v: "risa" }], habla: [[k(50.6), k(52.4)]] },
      ]}
      hud={<><Rotulo t="the PIN PALS" x={600} y={170} desde={k(46.6)} /><Dice quien="dot" t="STRIKE, ladies!" x={1100} y={300} desde={k(50.6)} /></>} />
  );
};

// ---------- 11 · Dot con Lorraine ----------
export const P11Dot: React.FC = () => {
  const k = kDe(52.68);
  return (
    <Sala cl={[mira(0, pistaX(7) + 40, 640, 2.2), mira(k(56), pistaX(7) + 60, 600, 2.4, { curva: "inout" })]}
      gente={[{ l: DOT, x: pistaX(7), p: [{ f: 0, v: { hD: 100, cD: 60 } }, { f: k(56.2), v: { hD: 140, cD: 40, hI: 40, cI: 30 } }], c: [{ f: 0, v: "picaro" }, { f: k(56.2), v: "feliz" }], mD: <Bola color="#ff5fa8" s={1.1} />, mir: { x: 0.3, y: -0.3 }, d: 1 }]}
      hud={<><Rotulo t="DOT · 68" x={1150} y={190} desde={k(53)} flecha="izq" /><Dice quien="dot" t="This is Lorraine." x={1150} y={430} desde={k(56.2)} /></>} />
  );
};

// ---------- 12 · «ER nurse, thirty years» antes que su nombre ----------
export const P12Enfermera: React.FC = () => {
  const k = kDe(58.3);
  return (
    <Sala cl={[mira(0, pistaX(7) + 120, 650, 1.6), mira(k(63.6), pistaX(7) + 160, 640, 1.75, { curva: "inout" })]}
      gente={[
        { l: DOT, x: pistaX(7), p: [{ f: 0, v: "hablar" }, { f: 50, v: "señalar" }, { f: 100, v: "hablar" }], c: "determinado", habla: [[0, 150]], mD: <Bola color="#ff5fa8" s={0.9} />, d: 1 },
        { l: LIGA2, x: pistaX(7) + 300, p: "parado", c: [{ f: 0, v: "neutral" }, { f: 70, v: "duda" }], d: -1 },
      ]}
      hud={<Dice quien="dot" t={"Thirty years, ER.\nI'm Dot."} x={1100} y={800} desde={10} />} />
  );
};

// ---------- 13 · la pista 8 rota otra vez ----------
export const P13Rota: React.FC = () => {
  const k = kDe(63.82);
  return (
    <Sala cl={[mira(0, pistaX(8), 580, 1.9), mira(k(66), pistaX(8), 610, 1.6, { curva: "inout" })]} sp={{ cerradas: [8] }}
      gente={[{ l: LIGA, x: pistaX(8) - 60, p: "manosCintura", c: "enojo", d: 1 }]}
      hud={<><Rotulo t="LANE 8" x={1150} y={130} desde={8} flecha="izq" /><Dice quien="otro" t="...always broken." x={1100} y={720} desde={k(66)} /></>} />
  );
};

// ---------- 14 · Cal en el cuarto de máquinas, linterna en la boca ----------
export const P14Cal: React.FC = () => {
  const k = kDe(67.86);
  return (
    <Maquinas cl={[mira(0, 1700, 600, 1.4), mira(k(71.5), 1880, 600, 1.8, { curva: "inout" }), mira(k(74.7), 1900, 600, 2.0, { curva: "inout" })]} sp={{ encendidas: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16] }}
      gente={[{ l: CAL, x: 1830, p: [{ f: 0, v: "agarrarAlto" }, { f: 40, v: { hD: 120, cD: 40, hI: 100, cI: 30 } }, { f: 80, v: "agarrarAlto" }, { f: 130, v: { hD: 100, cD: 60, hI: 110, cI: 30 } }], c: "determinado", mI: <Linterna />, d: 1 }]}
      hud={<><div style={{ position: "absolute", left: 0, right: 0, top: 90, height: 150, background: "rgba(8,6,10,0.7)" }} /><Rotulo t="CAL · 36 · Nell's dad" x={1100} y={130} desde={k(69.5)} flecha="izq" /><Pildora texto="THE MACHINE ROOM" x={960} y={960} desde={10} /></>} />
  );
};

// ---------- 15 · el parche «CAL», hilo rojo ----------
export const P15Parche: React.FC = () => {
  const k = kDe(74.78);
  return (
    <Maquinas cl={[mira(0, 1860, 640, 1.9), mira(k(79.6), 1870, 650, 2.2, { curva: "inout" })]} sp={{ encendidas: true }}
      gente={[{ l: CAL, x: 1830, p: { hD: 100, cD: 60, hI: 40, cI: 90 }, c: [{ f: 0, v: "determinado" }, { f: 60, v: "feliz" }], mI: <Linterna />, d: -1 }]}
      hud={<Dice quien="cal" t="CAL" x={1150} y={330} desde={k(76.4)} tam={110} />} />
  );
};

// ---------- 16 · Nell en el mostrador, botas rojas, capucha puesta ----------
const balanceo = (n: number) => Array.from({ length: n }).flatMap((_, i) => [{ f: i * 20, v: { pI: 70, rI: 60, pD: 95, rD: 100 } }, { f: i * 20 + 10, v: { pI: 95, rI: 100, pD: 70, rD: 60 } }]);
export const P16Nell: React.FC = () => {
  const k = kDe(79.74);
  return (
    <Sala cl={[mira(0, -760, 600, 1.9), mira(k(84), -760, 620, 2.2, { curva: "inout" }), mira(k(88.5), -760, 660, 2.5, { curva: "inout" })]} snack
      detras={[{ l: RAFI, x: -1050, p: "hablar", c: "feliz", d: 1 }]}
      sobre={<A l={NELL} x={-720} sent={184} p={balanceo(30)} c={[{ f: 0, v: "neutral" }, { f: k(85), v: "feliz" }]} mir={{ x: -0.6, y: 0.3 }} d={-1} mD={<Walkie s={0.8} />} />}
      hud={<><Rotulo t="NELL · 9" x={1150} y={180} desde={k(83.6)} flecha="izq" /><HudDia dia={1} desde={9999} /></>} />
  );
};

// ---------- 17 · tarea de mates y mis papas sin pagar ----------
export const P17Papas: React.FC = () => {
  const k = kDe(91.12);
  const come = Array.from({ length: 8 }).flatMap((_, i) => [{ f: i * 24, v: { hD: 60, cD: 120, hI: 30, cI: 60 } }, { f: i * 24 + 12, v: { hD: 30, cD: 60, hI: 30, cI: 60 } }]);
  return (
    <Sala cl={[mira(0, -820, 600, 2.1), mira(k(94.3), -760, 640, 2.6, { curva: "inout" })]} snack
      detras={[{ l: RAFI, x: -1000, p: [{ f: 0, v: "brazosCruzados" }, { f: 60, v: "pensar" }], c: "picaro", d: 1 }]}
      sobre={<>
        <A l={NELL} x={-760} sent={184} p={come} c="feliz" mir={{ x: 0.3, y: 0.5 }} d={-1} mD={<Papas s={0.8} />} mI={<Anotador />} />
      </>}
      hud={<><Dice quien="rafi" t="$0.00" x={1200} y={250} desde={k(93)} tam={84} /><Rotulo t="her mom's walkie" x={1150} y={520} desde={k(94.6)} flecha="izq" /></>} />
  );
};

// ---------- 18 · Ana: la foto, enfermera del Fort Hamilton, turno noche ----------
export const P18Ana: React.FC = () => {
  const k = kDe(96.72);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, -760, 600, 2.5), mira(k(103), -740, 620, 2.7, { curva: "inout" })]} snack
        sobre={<A l={NELL} x={-760} sent={184} p={{ hD: 100, cD: 150, hI: 30, cI: 60, cabeza: 10 }} c="triste" d={-1} mD={<Walkie s={0.8} />} mir={{ x: -0.4, y: 0.4 }} />} />
      <Velo color="#000" o={0.35} />
      <Foto l={ANA} x={1130} y={150} desde={k(98.3)} pie="Mom · night shift" />
      <Rotulo t="ANA · Fort Hamilton Hospital" x={250} y={120} desde={k(99.9)} color="#9fd3ff" flecha="der" />
    </AbsoluteFill>
  );
};

// ---------- 19 · las ocho: el walkie hace clic, buenas noches desde 3 millas ----------
export const P19Ocho: React.FC = () => {
  const k = kDe(103.3);
  const f = useF();
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, -760, 663, 2.6), mira(k(108.6), -760, 656, 2.9, { curva: "inout" })]} snack
        sobre={<A l={NELL} x={-760} sent={184} p={[{ f: 0, v: { hD: 30, cD: 60 } }, { f: k(104.5), v: { hD: 60, cD: 150, cabeza: 6 } }]} c={[{ f: 0, v: "neutral" }, { f: k(104.6), v: "feliz" }]} d={-1} mD={<Walkie s={0.8} luz={f > k(104.4)} />} />} />
      <Dice quien="ana" t="Goodnight, baby." x={1120} y={280} desde={k(105.6)} />
      <Rotulo t="3 miles away" x={1200} y={520} desde={k(107.2)} color="#9fd3ff" flecha="izq" />
      <HudDia dia={1} desde={9999} hora="8:00 PM" />
    </AbsoluteFill>
  );
};

// ---------- 20 · «funciona mejor con lluvia» — no; ella quería que sí ----------
export const P20Lluvia: React.FC = () => {
  const k = kDe(108.74);
  return (
    <Sala cl={[mira(0, PU - 200, 560, 1.4), mira(k(112.7), PU - 150, 600, 1.8, { curva: "inout" })]}
      gente={[{ l: NELL, x: PU - 220, p: { hD: 70, cD: 120 }, c: [{ f: 0, v: "feliz" }, { f: k(112.7), v: "triste" }], d: 1, mD: <Walkie s={0.8} />, mir: { x: 1, y: -0.2 }, luz: RIM.neon }]}
      hud={<><Dice quien="nell" t="It works better in the rain." x={300} y={200} desde={k(110.8)} hasta={k(112.7)} /><Dice quien="rafi" t="(it didn't)" x={1250} y={760} desde={k(112.8)} tam={56} /></>} />
  );
};

// ---------- 21 · 7:30, Marlon Pike entra con el maletín ----------
export const P21Marlon: React.FC = () => {
  const k = kDe(115.32);
  return (
    <Sala cl={[mira(0, PU - 100, 560, 1.1), mira(k(118.8), PU - 400, 600, 1.5, { curva: "inout" }), mira(k(121.5), PU - 520, 560, 1.9, { curva: "inout" })]}
      gente={[{ l: MARLON, ruta: [{ f: 0, x: PU + 60 }, { f: k(119.5), x: PU - 520, curva: "out" }], c: [{ f: 0, v: "picaro" }, { f: k(120), v: "feliz" }], mD: <Maletin />, d: -1, p: [{ f: 0, v: "parado" }, { f: k(120.5), v: "saludar" }] }]}
      hud={<><HudDia dia={1} desde={9999} hora="7:30 PM" /><Rotulo t="MARLON PIKE · 45" x={240} y={170} desde={k(117.8)} flecha="der" /><Pildora texto="LIFE INSURANCE" x={960} y={930} desde={k(121.5)} /></>} />
  );
};

// ---------- 22 · café, un dólar de propina, «chief» ----------
export const P22Chief: React.FC = () => {
  const k = kDe(122.92);
  return (
    <Sala cl={[mira(0, -560, 600, 1.7), mira(k(127), -620, 600, 2.0, { curva: "inout" })]} snack
      detras={[{ l: RAFI, x: -800, p: [{ f: 0, v: { hD: 80, cD: 30 } }, { f: k(127), v: "brazosCruzados" }], c: [{ f: 0, v: "neutral" }, { f: k(128.6), v: "duda" }], d: 1 }]}
      gente={[{ l: MARLON, x: -440, p: [{ f: 0, v: "hablar" }, { f: k(126.5), v: { hD: 90, cD: 20 } }, { f: k(128), v: "señalar" }], c: "picaro", d: -1, habla: [[k(127.5), k(130)]] }]}
      hud={<><Dice quien="marlon" t="Thanks, chief." x={1050} y={260} desde={k(128)} /><Pildora texto="TIP: $1" x={760} y={880} desde={k(126.5)} /></>} />
  );
};

// ---------- 23 · los cinco desconocidos (rótulos uno por uno) ----------
export const P23Cinco: React.FC = () => {
  const k = kDe(130.48);
  const xs = [1550, 1700, 1900, 2100, 2300];
  return (
    <Sala cl={[mira(0, 1925, 640, 1.6), mira(k(137.5), 1925, 650, 1.5, { curva: "inout" })]} sp={{}}
      gente={[
        { l: CAL, x: xs[0], p: "brazosCruzados", c: "neutral", mI: <Linterna prendida={false} /> }, { l: NELL, x: xs[1], p: "parado", c: "neutral", mD: <Walkie s={0.8} /> },
        { l: DOT, x: xs[2], p: "manosCintura", c: "picaro", mD: <Bola color="#ff5fa8" s={0.8} />, d: -1 }, { l: RAFI, x: xs[3], p: "parado", c: "feliz", d: -1 }, { l: MARLON, x: xs[4], p: "parado", c: "picaro", d: -1, mD: <Maletin /> },
      ]}
      hud={<>
        {["a mechanic", "his kid", "a retired nurse", "a cook", "a salesman"].map((t, i) => <Dice key={t} quien="otro" t={t} x={330 + i * 290} y={i % 2 ? 300 : 230} desde={k(130.6 + i * 1.1)} tam={52} rot={-4 + i * 2} />)}
        <Dice quien="otro" t="5 strangers. 1 bowling alley." x={960} y={80} desde={k(135.2)} centro tam={76} />
      </>} />
  );
};

// ---------- 24 · CTA (min ~2:20): suscribite + UNA pregunta, sobre la persiana del cold open ----------
export const P24Cta: React.FC = () => {
  const k = kDe(140.04);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, PU - 100, P - 200, 1.7), mira(k(152), PU - 60, P - 160, 1.9, { curva: "inout" })]} sp={{ luz: "alerta", persiana: 0.86 }}
        gente={[{ l: NELL, x: PU - 210, p: { tronco: 58, pI: 70, rI: 120, pD: 80, rD: 125, hD: 92, cD: 0, hI: 70, cI: 20, cabeza: -30 }, c: "miedo", d: 1 }, { l: CAL, x: CH - 40, p: "agarrarAlto", c: "determinado", d: 1 }]} />
      <Velo color="#0b0a0c" o={0.45} />
      <Pildora texto="A SERIES · ONLY FORWARD" x={960} y={150} desde={k(141.7)} hasta={k(145)} />
      <Pildora texto="SUBSCRIBE FOR DAY 2" x={960} y={130} desde={k(145.1)} color={ROJO} tam={78} />
      <Dice quien="otro" t={"Would you have pulled\nthat shutter down\nwith people still outside?"} x={960} y={330} desde={k(147.7)} centro tam={64} rot={-2} />
      <HudDia dia={1} rayas={1} />
    </AbsoluteFill>
  );
};

// ---------- 25 · «porque nosotros sí»: la persiana pega en el piso ----------
export const P25Golpe: React.FC = () => {
  const f = useF();
  return (
    <Sacude en={[12]} amp={12}><Sala cl={[mira(0, PU, P - 60, 3.2)]} sp={{ luz: "alerta", persiana: (ff: number) => interpolate(ff, [0, 12], [0.9, 1], { extrapolateRight: "clamp" }) }} hud={<HudDia dia={1} rayas={1} />} /></Sacude>
  );
};

// ---------- 26 · 7:52 la TV se pone azul: transmisión de emergencia ----------
export const P26Tv: React.FC = () => {
  const k = kDe(153.44);
  return (
    <Sala cl={[mira(0, PP.tv, 120, 2.2), mira(k(158), PP.tv, 160, 2.6, { curva: "inout" }), mira(k(161), PP.tv - 80, 430, 1.4, { curva: "inout" })]} snack sp={{ tv: "alerta" }}
      gente={[{ l: LIGA, x: -380, p: "parado", c: "feliz", d: 1, mD: <Bola s={0.8} /> }, { l: LIGA2, x: -230, p: "hablar", c: "risa", d: -1, habla: [[0, 400]] }, { l: LIGA3, x: -90, p: "brazosCruzados", c: "feliz", d: -1 }, { l: PINPAL, x: 60, p: "celebrar", c: "risa", d: 1 }]}
      detras={[{ l: RAFI, x: -800, p: "pensar", c: [{ f: 0, v: "neutral" }, { f: k(160), v: "duda" }], mir: { x: 0.3, y: -0.8 }, d: 1 }]}
      hud={<><HudDia dia={1} desde={9999} hora="7:52 PM" /><Dice quien="tv" t="STAY INDOORS." x={1250} y={560} desde={k(160.5)} tam={72} /><Dice quien="tv" t="AVOID CONTACT WITH ANYONE WHO APPEARS ILL." x={960} y={980} desde={k(163.5)} centro tam={56} /></>} />
  );
};

// ---------- 27 · nadie levanta la vista: los jugadores nunca miran ----------
export const P27Nadie: React.FC = () => {
  const k = kDe(165.96);
  return (
    <Sala cl={[mira(0, pistaX(5) + 120, 640, 1.5), mira(k(168.8), pistaX(5) + 40, 650, 1.6, { curva: "inout" })]} sp={{ tv: "alerta", tiros: [{ pista: 4, f0: 15 }, { pista: 6, f0: 45 }] }}
      gente={[{ l: LIGA, x: pistaX(4), p: "celebrar", c: "risa" }, { l: LIGA3, x: pistaX(6), p: "tirarSuelta", c: "determinado" }, { l: PINPAL, x: pistaX(7), p: "hablar", c: "risa", habla: [[0, 90]] }, { l: LIGA2, x: pistaX(5), p: "brazosCruzados", c: "feliz" }]}
      hud={<Dice quien="rafi" t="bowlers never look up" x={1100} y={150} desde={k(167.3)} tam={60} />} />
  );
};

// luces de patrullero barriendo la pared (rojo / azul)
const Balizas: React.FC = () => {
  const f = useF();
  const a = Math.sin(f / 4), b = Math.sin(f / 4 + Math.PI);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${30 + 25 * Math.sin(f / 11)}% 60%, rgba(255,40,40,${0.35 * Math.max(0, a)}) 0%, rgba(0,0,0,0) 55%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${70 - 25 * Math.sin(f / 13)}% 55%, rgba(40,90,255,${0.4 * Math.max(0, b)}) 0%, rgba(0,0,0,0) 55%)` }} />
    </AbsoluteFill>
  );
};

// ---------- 28 · las sirenas en la Route 4: todas ----------
export const P28Sirenas: React.FC = () => {
  const k = kDe(168.76);
  return (
    <Afuera cl={[mira(0, 1200, 760, 1.2), mira(k(172.7), 1450, 740, 1.05, { curva: "inout" })]} sp={{ sirenas: true }}
      gente={[{ l: zombi(WAFFLE), ruta: [{ f: 0, x: 900 }, { f: 130, x: 1500 }], p: "zombi", c: "zombi", d: 1, luz: RIM.neon }, { l: zombi(LIGA2), ruta: [{ f: 0, x: 2200 }, { f: 130, x: 1750 }], p: "zombi", c: "zombi", d: -1, luz: RIM.neon }]}
      hud={<><Balizas /><VeloX desde={2} o={0.3} /><Mapa x={1370} y={560} w={860} h={560} desde={4} dur={80} estilo="mapa" titulo="SIRENS · ALL OF THEM" acento={ROJO} seed={7}
        puntos={[{ x: 90, y: 420, rotulo: "ROUTE 4", lado: "der" }, { x: 250, y: 360, via: true }, { x: 400, y: 300, rotulo: "HIGH ST" }, { x: 560, y: 240, via: true }, { x: 720, y: 150, rotulo: "HOSPITAL", lado: "izq" }]} />
        <Dice quien="rafi" t="not one." x={120} y={200} desde={k(170.7)} tam={70} /><Dice quien="rafi" t="all of them." x={120} y={320} desde={k(171.7)} tam={84} /></>} />
  );
};

// ---------- 29 · 8:00, el walkie hace clic; Nell lo agarra ----------
export const P29Clic: React.FC = () => {
  const k = kDe(172.78);
  const f = useF();
  return (
    <Sala cl={[mira(0, -760, 560, 2.0), mira(k(175.2), -760, 669, 2.4, { curva: "inout" })]} snack sp={{ tv: "alerta" }}
      sobre={<A l={NELL} x={-760} sent={184} p={[{ f: 0, v: { hD: 30, cD: 50 } }, { f: k(175.2), v: { hD: 70, cD: 150, cabeza: 6 } }]} c={[{ f: 0, v: "neutral" }, { f: k(175.3), v: "sorpresa" }]} d={-1} mD={<Walkie s={0.85} luz={f % 20 < 10} />} />}
      hud={<HudDia dia={1} desde={9999} hora="8:00 PM" />} />
  );
};

// ---------- 30 · la voz de mamá, rara: rápida, sin aire (a mano, celeste) ----------
export const P30Mama: React.FC = () => {
  const k = kDe(176.2);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, -740, 669, 2.4), mira(k(188.5), -740, 658, 2.8, { curva: "lineal" })]} snack sp={{ tv: "alerta" }}
        sobre={<A l={NELL} x={-760} sent={184} p={{ hD: 70, cD: 150, cabeza: 8 }} c={[{ f: 0, v: "sorpresa" }, { f: k(184), v: "miedo" }]} d={-1} mD={<Walkie s={0.85} luz />} mir={{ x: -0.3, y: 0.2 }} />} />
      <Dice quien="ana" t="Nell, baby, listen to me." x={250} y={130} desde={k(180.6)} hasta={k(188.4)} tam={60} />
      <Dice quien="ana" t="Stay with your dad." x={1200} y={300} desde={k(183.3)} hasta={k(188.4)} tam={60} />
      <Dice quien="ana" t="Do NOT come to the hospital." x={230} y={760} desde={k(184.5)} hasta={k(188.4)} tam={60} />
      <Dice quien="ana" t="They're not sick. They're—" x={1100} y={860} desde={k(186)} hasta={k(188.4)} tam={60} />
    </AbsoluteFill>
  );
};

// ---------- 31 · estática; «Mom. Mom.» ----------
export const P31Estatica: React.FC = () => {
  const k = kDe(188.52);
  const f = useF();
  const pulsa = Array.from({ length: 8 }).flatMap((_, i) => [{ f: i * 18, v: { hD: 70, cD: 150, cabeza: 8 } }, { f: i * 18 + 9, v: { hD: 75, cD: 145, cabeza: 10 } }]);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, -760, 663, 2.6), mira(k(193.5), -760, 676, 2.2, { curva: "inout" })]} snack sp={{ tv: "alerta" }}
        sobre={<A l={NELL} x={-760} sent={184} p={pulsa} c="triste" d={-1} mD={<Walkie s={0.85} luz={f % 6 < 3} />} habla={[[k(191.4), k(193.6)]]} />} />
      {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 397 + f * 53) % 1920, top: (i * 211 + f * 31) % 1080, width: 60, height: 2, background: "#f4efe4", opacity: 0.18 }} />)}
      <Dice quien="nell" t="Mom?" x={1150} y={260} desde={k(191.4)} tam={56} />
      <Dice quien="nell" t="Mom." x={1300} y={400} desde={k(192.2)} tam={78} />
      <Dice quien="nell" t="MOM." x={1440} y={580} desde={k(192.9)} tam={104} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, height: 40, background: "repeating-linear-gradient(90deg,#f4efe4 0 6px,transparent 6px 14px)", opacity: f % 4 < 2 ? 0.35 : 0.15, transform: `translateX(${(f * 23) % 14}px)` }} />
    </AbsoluteFill>
  );
};

// ---------- 32 · re-gancho: «Dot didn't make it to spring» ----------
export const P32Primavera: React.FC = () => {
  const k = kDe(193.52);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, pistaX(7), 580, 2.0), mira(k(195.3), pistaX(7), 673, 2.3, { curva: "inout" })]} sp={{ luz: "noche" }}
        gente={[{ l: DOT, x: pistaX(7), p: "brazosCruzados", c: "determinado", d: 1, mD: <Bola color="#ff5fa8" s={0.8} />, luz: RIM.neon }]} />
      <Velo color="#1a1020" o={0.35} />
      <Dice quien="rafi" t="She didn't make it to spring." x={960} y={820} desde={4} centro tam={70} />
    </AbsoluteFill>
  );
};
