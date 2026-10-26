// ycn02 · planos 1-42 (0 → 178.8 s): cold open en la manija del freezer, el resumen, DAY NINE, CTA, las raciones de Dot,
// lo que hay en el freezer, Gus, «fue mi culpa», «morir de hambre con educación», la idea del ruido.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Pildora, F_HUD } from "../../anikit/pantalla";
import { Walkie, Bolsa } from "../../anikit/props";
import { NELL, CAL, DOT, RAFI, MARLON, GUS, LIGA, LIGA2, LIGA3, WAFFLE, PINPAL, RIM, ROJO, AMARILLO, zombi } from "../elenco";
import { pistaX, PISTAS_PUNTOS as PP } from "../sets/pistas";
import { COCINA_YCN_PUNTOS as CP } from "../sets/cocina";
import { FREEZER_PUNTOS as FP } from "../sets/freezer";
import { Anotador, Bola, Linterna, Pancho, Papas, Tiza } from "../utileria";
import { Comparacion, Mapa, Velo as VeloX } from "../../anikit/explica";
import { A, Afuera, Cocina, Dice, EnFreezer, Foto, HudDia, kDe, Lista, P, Recuerdo, Rotulo, Sacude, Sala, Velo } from "../base";

const PU = PP.puerta, CH = PP.cadena, SN = PP.snack;
// día 9 con la persiana abajo: la pista 8 dice DAY NINE, nueve rayitas en la columna
export const D9 = { persiana: 1, tv: "apagada" as const, dia: "DAY NINE", tiza: 9 };
export const N9 = { ...D9, luz: "noche" as const };
const tirarManija = { hD: 88, cD: 8, hI: 70, cI: 30, tronco: -8 };
const sentadoPiso = { tronco: -6, pI: 30, rI: 140, pD: 40, rD: 150, hD: 30, cD: 40, hI: 30, cI: 40 };

// ---------- 1 · CUADRO 0: la mano de Rafi en la manija del freezer, DAY 9, 3:10 AM ----------
export const P01Manija: React.FC = () => (
  <Cocina cl={[mira(0, CP.manija - 160, 640, 2.6), mira(60, CP.manija - 150, 640, 2.9, { curva: "inout" })]} sp={{ luz: "noche", golpes: [8, 22, 36, 50] }}
    gente={[{ l: RAFI, x: CP.manija - 120, p: { ...tirarManija, hD: 128, cD: -4 }, c: "miedo", d: 1, mI: <Linterna />, luz: RIM.linterna }]}
    hud={<HudDia dia={9} rayas={9} hora="3:10 AM" />} />
);

// ---------- 2 · Cal cuenta para atrás desde tres ----------
export const P02Tres: React.FC = () => {
  const k = kDe(2.08);
  return (
    <Cocina cl={[mira(0, 1400, 600, 1.8), mira(k(4.1), 1600, 600, 2.0, { curva: "inout" })]} sp={{ luz: "noche", golpes: [10, 30] }}
      gente={[
        { l: CAL, x: 1300, p: [{ f: 0, v: { hD: 150, cD: 20 } }, { f: 30, v: { hD: 150, cD: 10, tronco: 4 } }], c: "determinado", d: 1, habla: [[0, 40]], mI: <Linterna />, luz: RIM.linterna },
        { l: RAFI, x: CP.manija - 300, p: tirarManija, c: "miedo", d: 1, luz: RIM.linterna },
      ]}
      hud={<><Dice quien="cal" t="three…" x={260} y={200} desde={k(2.4)} tam={90} /><HudDia dia={9} hora="3:10 AM" /></>} />
  );
};

// ---------- 3 · detrás de esa puerta algo golpeaba cada noche, ocho noches, siempre a las 3:10 ----------
export const P03Golpes: React.FC = () => {
  const k = kDe(4.2);
  const gs = [k(4.6), k(5.3), k(6.0), k(7.4), k(8.1), k(8.8)];
  return (
    <Sacude en={gs} amp={5}>
      <Cocina cl={[mira(0, CP.puerta, 470, 2.0), mira(k(7), CP.puerta + 40, 470, 2.4, { curva: "inout" }), mira(k(9.9), CP.puerta + 60, 460, 2.6, { curva: "inout" })]} sp={{ luz: "noche", golpes: gs }}
        hud={<><Dice quien="otro" t="knock." x={1250} y={240} desde={k(4.6)} tam={70} /><Dice quien="otro" t="knock." x={1350} y={340} desde={k(5.3)} tam={70} /><Dice quien="otro" t="knock." x={1450} y={440} desde={k(6.0)} tam={70} />
          <Rotulo t="8 nights · always 3:10" x={180} y={760} desde={k(7.3)} flecha="der" /><HudDia dia={9} hora="3:10 AM" /></>} />
    </Sacude>
  );
};

// ---------- 4 · «y justo en el dos… los golpes pararon» ----------
export const P04Para: React.FC = () => {
  const k = kDe(9.98);
  return (
    <Cocina cl={[mira(0, CP.manija - 260, 640, 3.0), mira(k(13.2), CP.manija - 270, 650, 3.4, { curva: "lineal" })]} sp={{ luz: "noche" }}
      gente={[{ l: RAFI, x: CP.manija - 300, p: tirarManija, c: [{ f: 0, v: "miedo" }, { f: k(11.6), v: "sorpresa" }], d: 1, mir: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(11.8), v: { x: -0.6, y: 0 } }], luz: RIM.linterna }]}
      hud={<><Dice quien="cal" t="two—" x={200} y={220} desde={k(10.4)} tam={96} /><Dice quien="rafi" t="…it stopped." x={1180} y={820} desde={k(11.9)} tam={70} /><HudDia dia={9} hora="3:10 AM" /></>} />
  );
};

// ---------- 5 · lo que te perdiste: el día uno llegó a Hamilton ----------
export const P05Resumen: React.FC = () => {
  const k = kDe(13.34);
  const zs = [LIGA, WAFFLE, LIGA3, PINPAL];
  return (
    <AbsoluteFill>
      <Afuera cl={[mira(0, 1650, 520, 0.8), mira(k(18.6), 1900, 540, 1.0, { curva: "inout" })]} sp={{ sirenas: true, persiana: 1 }}
        gente={zs.map((l, i) => ({ l: zombi(l), ruta: [{ f: 0, x: 700 + i * 260, y: P + 80 + 14 * i }, { f: 200, x: 1100 + i * 230, y: P + 30 + 10 * i }], p: "zombi", c: "zombi", d: 1 as const, seed: i + 2 }))} />
      <Pildora texto="PREVIOUSLY · DAY ONE" x={960} y={140} desde={4} />
      <VeloX desde={k(14.3)} o={0.35} />
      <Mapa x={1360} y={600} w={860} h={560} desde={k(14.4)} dur={70} estilo="mapa" titulo="HAMILTON, OHIO" acento={ROJO}
        puntos={[{ x: 170, y: 380, rotulo: "HIGH ST" }, { x: 420, y: 300, via: true }, { x: 690, y: 170, rotulo: "HOLLIS LANES", lado: "izq" }]} />
    </AbsoluteFill>
  );
};

// ---------- 6 · cinco encerrados en Hollis Lanes, Route 4 ----------
export const P06Cinco: React.FC = () => {
  const k = kDe(18.4);
  const xs = [PU - 1300, PU - 1050, PU - 820, PU - 600, PU - 380];
  return (
    <Sala cl={[mira(0, PU - 820, 720, 1.5), mira(k(22.5), PU - 840, 730, 1.7, { curva: "inout" })]} sp={{ luz: "alerta", persiana: 1 }}
      gente={[{ l: CAL, x: xs[0], p: "brazosCruzados", c: "cansado", d: 1 }, { l: NELL, x: xs[1], p: "parado", c: "miedo", d: 1, mD: <Walkie s={0.8} /> }, { l: DOT, x: xs[2], p: "manosCintura", c: "determinado", d: 1, mD: <Bola s={0.8} /> }, { l: RAFI, x: xs[3], p: "parado", c: "miedo", d: 1 }, { l: MARLON, x: xs[4], p: "brazosCruzados", c: "duda", d: -1 }]}
      hud={<><Pildora texto="HOLLIS LANES · ROUTE 4" x={960} y={140} desde={k(19.6)} /><HudDia dia={1} rayas={1} /></>} />
  );
};

// ---------- 7-10 · el elenco, uno por uno ----------
export const P07Cal: React.FC = () => (
  <Sala cl={[mira(0, pistaX(8) - 200, 673, 2.3), mira(48, pistaX(8) - 180, 663, 2.6, { curva: "inout" })]} sp={D9}
    gente={[{ l: CAL, x: pistaX(8) - 200, p: [{ f: 0, v: "brazosCruzados" }, { f: 24, v: "pensar" }], c: "cansado", d: 1 }]}
    hud={<Rotulo t="CAL · the mechanic" x={1180} y={240} desde={4} flecha="izq" color="#8fc2ff" />} />
);
export const P08Nell: React.FC = () => (
  <Sala cl={[mira(0, 1860, 780, 2.8), mira(94, 1870, 790, 3.1, { curva: "inout" })]} sp={D9}
    gente={[{ l: NELL, x: 1860, sent: 0, p: sentadoPiso, c: [{ f: 0, v: "neutral" }, { f: 50, v: "feliz" }], d: 1, mD: <Walkie s={0.8} />, mir: { x: -1, y: -0.2 } }]}
    hud={<Rotulo t="NELL · 9 · the yellow raincoat" x={1150} y={250} desde={6} flecha="izq" color={AMARILLO} />} />
);
export const P09Dot: React.FC = () => (
  <Sala cl={[mira(0, pistaX(7), 669, 2.4), mira(46, pistaX(7) + 20, 660, 2.7, { curva: "inout" })]} sp={D9}
    gente={[{ l: DOT, x: pistaX(7), p: { hD: 100, cD: 60 }, c: "picaro", d: 1, mD: <Bola s={1.0} /> }]}
    hud={<Rotulo t="DOT · the old nurse" x={1150} y={240} desde={4} flecha="izq" color="#ff8fb8" />} />
);
export const P10Marlon: React.FC = () => {
  const k = kDe(28.9);
  return (
    <Sala cl={[mira(0, SN - 400, 690, 1.9), mira(k(31), SN - 380, 685, 2.0), mira(k(32.6), SN + 200, 685, 2.0, { curva: "inout" })]} snack sp={D9}
      detras={[{ l: RAFI, x: SN + 200, p: [{ f: 0, v: "parado" }, { f: k(31.4), v: "saludar" }], c: "feliz", d: -1 }]}
      gente={[{ l: MARLON, x: SN - 440, p: [{ f: 0, v: "brazosCruzados" }, { f: k(29.6), v: { hD: 70, cD: 60 } }, { f: k(30.6), v: "brazosCruzados" }], c: "picaro", d: 1, habla: [[0, 50]] }]}
      hud={<><Rotulo t="MARLON · insurance" x={200} y={220} desde={k(29.2)} hasta={k(31.2)} flecha="der" /><Rotulo t="RAFI · the cook (me)" x={1150} y={220} desde={k(31.4)} flecha="izq" color="#9be3a6" /></>} />
  );
};

// ---------- 11 · la primera noche alguien empezó a golpear desde adentro del freezer ----------
export const P11Primera: React.FC = () => {
  const k = kDe(32.74);
  const gs = [k(34.6), k(35.2), k(35.8)];
  return (
    <AbsoluteFill>
      <Sacude en={gs} amp={4}>
        <Cocina cl={[mira(0, 1450, 680, 1.6), mira(k(36.6), CP.puerta - 150, 709, 1.7, { curva: "inout" })]} sp={{ luz: "noche", golpes: gs }}
          gente={[{ l: RAFI, x: 1500, p: "encogerse", c: "miedo", d: 1, mD: <Linterna />, luz: RIM.linterna }]} />
      </Sacude>
      <Recuerdo />
      <HudDia dia={1} rayas={1} hora="3:10 AM" />
    </AbsoluteFill>
  );
};

// ---------- 12 · yo tenía diecisiete; Nell, nueve ----------
export const P12Edades: React.FC = () => {
  const k = kDe(36.66);
  return (
    <Sala cl={[mira(0, 1700, 730, 2.0), mira(k(40.6), 1780, 740, 2.3, { curva: "inout" })]} sp={D9}
      gente={[{ l: RAFI, x: 1640, sent: 0, p: sentadoPiso, c: "cansado", d: 1 }, { l: NELL, x: 1860, sent: 0, p: sentadoPiso, c: "neutral", d: -1, mD: <Walkie s={0.8} /> }]}
      hud={<><Rotulo t="me · 17" x={300} y={260} desde={k(37.6)} flecha="der" color="#9be3a6" /><Rotulo t="Nell · 9" x={1250} y={260} desde={k(39.5)} flecha="izq" color={AMARILLO} /></>} />
  );
};

// ---------- 13 · para el día nueve: nueve rayas de tiza detrás de la pista 8 ----------
export const P13Nueve: React.FC = () => {
  const k = kDe(40.7);
  return (
    <Sala cl={[mira(0, 1880, 640, 2.2), mira(k(44.9), 1880, 660, 1.8, { curva: "inout" })]} sp={D9}
      gente={[{ l: CAL, x: 1920 - 150, p: [{ f: 0, v: { hD: 150, cD: 10 } }, { f: 10, v: { hD: 140, cD: 30 } }, { f: 20, v: { hD: 155, cD: 5 } }, { f: 30, v: { hD: 140, cD: 30 } }, { f: 40, v: "parado" }], c: "cansado", d: 1, mD: <Tiza />, mir: { x: 0.6, y: -0.5 } }]}
      hud={<><HudDia dia={9} rayas={9} desde={k(42)} /><Dice quien="rafi" t="nine chalk lines." x={1200} y={800} desde={k(42.8)} tam={70} /></>} />
  );
};

// ---------- 14 · Nell traza una cada mañana, cuando entra la luz por debajo de la persiana ----------
export const P14Luz: React.FC = () => {
  const k = kDe(44.98);
  const f = useF();
  const t = 8 + interpolate(f, [k(46.6), k(48.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Nell cruza la franja de luz que entra bajo la persiana, tiza en mano, y traza la raya 9 (plano medio que la sigue)
  return (
    <Sala cl={[mira(0, 1560, 700, 2.3), mira(k(46.4), 1820, 690, 2.4, { curva: "inout" }), mira(k(49), 1850, 680, 2.6, { curva: "inout" })]} sp={{ ...D9, persiana: 0.97, tiza: t, dia: "DAY EIGHT" }}
      gente={[{ l: NELL, ruta: [{ f: 0, x: 1420 }, { f: k(46.3), x: 1860, curva: "inout" }], p: [{ f: 0, v: "parado" }, { f: k(46.4), v: "agarrarAlto" }, { f: k(48.3), v: "parado" }], c: "determinado", d: 1, mD: <Tiza /> }]}
      extra={<path d={`M1200,${P - 2} L2100,${P - 2} L2300,${P + 60} L1000,${P + 60} Z`} fill="#ffd38a" opacity={0.3} />}
      hud={<HudDia dia={9} rayas={9} />} />
  );
};

// ---------- 15 · el marcador de la pista 8: Cal cambia el 8 por el 9 (DAY NINE en naranja); Nell al lado de su raya ----------
export const P15Marcador: React.FC = () => {
  const k = kDe(49.12);
  const f = useF();
  return (
    <Sala cl={[mira(0, 1760, 560, 1.45), mira(k(52.9), 1760, 540, 1.6, { curva: "inout" })]} sp={{ ...D9, dia: f < k(50.85) ? "DAY EIGHT" : "DAY NINE" }}
      gente={[{ l: CAL, x: 1640, p: [{ f: 0, v: "señalar" }, { f: k(50.4), v: "agarrarAlto" }, { f: k(51.3), v: "señalar" }], c: [{ f: 0, v: "cansado" }, { f: k(51), v: "determinado" }], d: 1, mir: { x: 0.4, y: -0.9 } },
        { l: NELL, x: 1880, p: "parado", c: "feliz", d: -1, mir: { x: -0.3, y: -0.6 }, mD: <Tiza /> }]}
      hud={<HudDia dia={9} rayas={9} />} />
  );
};

// ---------- 16 · Cal lo actualiza en el desayuno, todos los días, como un ritual ----------
export const P16Ritual: React.FC = () => {
  const typing = Array.from({ length: 10 }).flatMap((_, i) => [{ f: i * 10, v: { hD: 60, cD: 60, hI: 55, cI: 65, tronco: 8 } }, { f: i * 10 + 5, v: { hD: 62, cD: 56, hI: 52, cI: 70, tronco: 8 } }]);
  return (
    <Sala cl={[mira(0, pistaX(8) - 160, 640, 2.1), mira(104, pistaX(8) - 320, 660, 1.75, { curva: "inout" })]} sp={D9}
      gente={[{ l: CAL, x: pistaX(8) - 60, p: typing, c: "determinado", d: 1, luz: RIM.pantalla }, { l: NELL, x: 1500, sent: 0, p: sentadoPiso, c: "feliz", d: 1, mD: <Papas s={0.7} /> }, { l: RAFI, x: 1250, p: "parado", c: "cansado", d: 1, mD: <Pancho /> }]}
      hud={<><Rotulo t="every breakfast" x={250} y={900} desde={20} flecha="der" /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 17-18 · CTA: suscribite + UNA pregunta ----------
export const P17Cta: React.FC = () => {
  const k = kDe(56.52);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, 1820, 680, 1.7), mira(k(61.6), 1830, 690, 1.85, { curva: "inout" })]} sp={D9}
        gente={[{ l: NELL, x: 1860, sent: 0, p: sentadoPiso, c: "neutral", d: 1, mD: <Walkie s={0.8} /> }, { l: CAL, x: pistaX(8) - 60, p: "brazosCruzados", c: "cansado", d: -1 }]} />
      <Velo color="#0b0a0c" o={0.4} />
      <Pildora texto="NEW HERE? SUBSCRIBE" x={960} y={110} desde={k(56.7)} color={ROJO} />
      <Dice quien="nell" t="one day at a time." x={960} y={210} desde={k(58.6)} centro tam={72} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};
export const P18Pregunta: React.FC = () => {
  const k = kDe(61.7);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, CP.puerta - 420, 560, 2.0), mira(k(66), CP.puerta - 430, 570, 2.4, { curva: "inout" })]} sp={{ luz: "noche" }}
        gente={[
          { l: RAFI, x: CP.puerta - 520, p: { hD: 40, cD: 60 }, c: "duda", d: 1, mir: [{ f: 0, v: { x: 1, y: 0 } }, { f: k(63.6), v: { x: 0, y: 0 } }], luz: RIM.linterna, mD: <Linterna /> },
          { l: NELL, x: CP.puerta - 350, p: { hI: 20, cI: 30 }, c: "miedo", d: -1, mir: [{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(64.2), v: { x: 0, y: 0 } }], luz: RIM.linterna },
        ]} />
      <Velo color="#0b0a0c" o={0.2} />
      <Pildora texto="KEEP THIS QUESTION" x={960} y={150} desde={k(62)} />
      <Dice quien="nell" t={"Would you have opened\nthat freezer?"} x={960} y={240} desde={k(64.2)} centro tam={92} rot={-2} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 19 · el problema era el desayuno: el día uno conté 41 papas y 96 panchos ----------
export const P19Desayuno: React.FC = () => {
  const k = kDe(66.04);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, SN - 120, 647, 2.6), mira(k(71.9), SN - 140, 647, 2.85, { curva: "inout" })]} snack sp={D9}
        detras={[{ l: RAFI, ruta: [{ f: 0, x: SN - 80 }, { f: k(68), x: SN - 300, curva: "inout" }], p: "celular", c: "duda", d: -1, mD: <Anotador /> }]} />
      <Lista x={1180} y={180} tam={58} lineas={[{ t: "DAY 1", desde: k(67.4), color: AMARILLO }, { t: "41  CHIPS", desde: k(68.6) }, { t: "96  HOT DOGS", desde: k(70.1) }]} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 20 · la mañana del día 9 conté de nuevo, en el mismo anotador ----------
export const P20Recuento: React.FC = () => {
  const k = kDe(71.94);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, SN - 400, 680, 2.1), mira(k(75.1), SN - 420, 673, 2.3, { curva: "inout" }), mira(k(75.2), SN - 120, 650, 3.0), mira(k(78.8), SN - 130, 652, 3.2, { curva: "lineal" }), mira(k(78.9), SN - 450, 669, 2.4), mira(k(81.3), SN - 460, 660, 2.7, { curva: "inout" })]} snack sp={D9}
        detras={[{ l: RAFI, x: SN - 300, p: "celular", c: [{ f: 0, v: "determinado" }, { f: k(77.7), v: "miedo" }], d: -1, mD: <Anotador /> }]} />
      <VeloX desde={k(75.1)} hasta={k(79)} o={0.3} />
      <Comparacion x={1270} y={560} w={420} h={470} desde={k(75.2)} hasta={k(77.6)} izq={{ titulo: "DAY 1", dato: "41", sub: "bags of chips" }} der={{ titulo: "DAY 9", dato: "6", sub: "bags of chips", color: "#ff5a5a" }} />
      <Comparacion x={1270} y={560} w={420} h={470} desde={k(77.6)} hasta={k(79)} izq={{ titulo: "DAY 1", dato: "96", sub: "hot dogs" }} der={{ titulo: "DAY 9", dato: "11", sub: "hot dogs", color: "#ff5a5a" }} />
      <Lista x={110} y={560} tam={66} lineas={[{ t: "18 → 3  PRETZELS", desde: k(79.1) }, { t: "CANDY  0", desde: k(80.1), color: ROJO }]} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 21 · Marlon: «las golosinas desaparecieron» ----------
export const P21Golosinas: React.FC = () => {
  const k = kDe(81.36);
  return (
    <Sala cl={[mira(0, SN - 700, 680, 2.1), mira(k(83.6), SN - 720, 669, 2.4, { curva: "inout" })]} snack sp={D9}
      gente={[{ l: MARLON, x: SN - 760, p: [{ f: 0, v: "hablar" }, { f: 30, v: { hD: 60, cD: 100, hI: 60, cI: 100 } }], c: "picaro", d: 1, habla: [[0, k(83.5)]] }]}
      hud={<Dice quien="marlon" t="The candy just… disappeared." x={1060} y={200} desde={k(81.6)} tam={64} />} />
  );
};

// ---------- 22 · Dot lo miró a Marlon cuando lo dijo ----------
export const P22Mira: React.FC = () => {
  const k = kDe(83.7);
  return (
    <Sala cl={[mira(0, SN - 300, 650, 2.6), mira(k(85.2), SN - 320, 650, 2.9, { curva: "lineal" })]} snack sp={D9}
      detras={[{ l: DOT, x: SN - 280, p: "brazosCruzados", c: [{ f: 0, v: "neutral" }, { f: 20, v: "duda" }], d: -1, mir: { x: -1, y: 0 } }]}
      gente={[{ l: MARLON, x: SN - 760, p: "brazosCruzados", c: "picaro", d: 1 }]} />
  );
};

// ---------- 23 · Dot manejaba las raciones; su regla era simple ----------
export const P23Regla: React.FC = () => {
  const k = kDe(85.26);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, SN - 230, 600, 2.0), mira(k(88.3), SN - 250, 605, 2.15, { curva: "inout" }), mira(k(93.9), SN - 270, 610, 2.3, { curva: "inout" })]} snack sp={D9}
        detras={[{ l: DOT, x: SN, p: [{ f: 0, v: "señalar" }, { f: k(90), v: "hablar" }], c: "determinado", d: -1, habla: [[k(88.3), k(93.9)]], mD: <Anotador /> }]}
        gente={[{ l: NELL, x: SN - 500, sent: 184, p: "sentado", c: "feliz", d: 1, mD: <Pancho /> }]} />
      <Lista x={1120} y={150} tam={74} lineas={[{ t: "1 · THE KID", desde: k(88.6) }, { t: "2 · THE COOK", desde: k(90.1) }, { t: "   (stays awake)", desde: k(91.2), color: "#9be3a6" }, { t: "3 · EVERYBODY ELSE", desde: k(92.6) }]} />
    </AbsoluteFill>
  );
};

// ---------- 24 · corta cada pancho a la mitad con un cuchillo de manteca y anota cada mitad ----------
const PanchoCortado: React.FC<{ x: number; y: number; abre: number }> = ({ x, y, abre }) => (
  <g transform={`translate(${x},${y}) scale(2.4)`}>
    <g transform={`translate(${-abre * 14},0)`}><g transform="translate(-14,0)"><Pancho /></g></g>
    <g transform={`translate(${abre * 14},0)`}><g transform="translate(14,0) scale(-1,1)"><Pancho /></g></g>
  </g>
);
export const P24Mitad: React.FC = () => {
  const k = kDe(94.0);
  const f = useF();
  const abre = interpolate(f, [k(95.4), k(96)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Sala cl={[mira(0, SN - 120, P - 300, 3.4), mira(k(97.8), SN - 160, P - 300, 3.7, { curva: "inout" })]} snack sp={D9}
      detras={[{ l: DOT, x: SN, p: [{ f: 0, v: { hD: 80, cD: 40, tronco: 20 } }, { f: k(95.4), v: { hD: 76, cD: 70, tronco: 22 } }, { f: k(96.3), v: "celular" }], c: "determinado", d: -1 }]}
      sobre={<PanchoCortado x={SN - 160} y={P - 296} abre={abre} />}
      hud={<Dice quien="dot" t="½ · ½ · ½ …" x={1150} y={200} desde={k(96.4)} tam={70} />} />
  );
};

// ---------- 25 · once panchos, veintidós mitades, cinco personas ----------
// fila de 11 panchos que entran uno por uno, se parten en 22 mitades y se reparten en 5 grupos
const FilaPanchos: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const abre = interpolate(f, [k(99.4), k(99.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rep = interpolate(f, [k(100.6), k(101.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={150} y={800} width={1620} height={230} rx={28} fill="#0b0a0c" opacity={0.7} />
      {Array.from({ length: 11 }).map((_, i) => {
        const u = interpolate(f, [k(98) + i * 3, k(98) + i * 3 + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x0 = 260 + i * 140, g = Math.floor((i * 2) / 4.4), ini = [0, 3, 5, 7, 9][g], xg = 310 + g * 330 + (i - ini) * 100 - (g === 0 ? 50 : 0);
        const x = x0 + (xg - x0) * rep;
        return <g key={i} opacity={u} transform={`translate(${x},${900 - (1 - u) * 60}) scale(0.62)`}><PanchoCortado x={0} y={0} abre={abre * 1.6} /></g>;
      })}
      {rep > 0 && [0, 1, 2, 3, 4].map((g) => <text key={g} x={360 + g * 330} y={1005} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={38} fill={AMARILLO} opacity={rep}>{["NELL", "RAFI", "DOT", "CAL", "MARLON"][g]}</text>)}
    </svg>
  );
};
export const P25Cuenta: React.FC = () => {
  const k = kDe(97.88);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, SN + 150, 640, 2.6), mira(k(101.5), SN + 130, 640, 2.8, { curva: "inout" })]} snack sp={D9}
        detras={[{ l: DOT, x: SN + 100, p: [{ f: 0, v: { hD: 80, cD: 40, tronco: 20 } }, { f: 12, v: { hD: 76, cD: 70, tronco: 22 } }, { f: 24, v: { hD: 80, cD: 40, tronco: 20 } }, { f: 36, v: "celular" }], c: "determinado", d: -1, mD: <Anotador /> }]} />
      <FilaPanchos k={k} />
      <Dice quien="dot" t="11 hot dogs" x={250} y={150} desde={k(98)} tam={80} />
      <Dice quien="dot" t="= 22 halves" x={250} y={260} desde={k(99.4)} tam={80} />
      <Dice quien="dot" t="÷ 5 people" x={250} y={370} desde={k(100.6)} tam={80} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 26 · «hacé la cuenta»: cuatro días, salvo que abriéramos el freezer ----------
export const P26Cuatro: React.FC = () => {
  const k = kDe(101.52);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, SN, 736, 1.3), mira(k(104.6), PP.puertaCocina + 300, 717, 1.5, { curva: "inout" }), mira(k(106.2), PP.puertaCocina, 690, 1.9, { curva: "inout" })]} snack sp={D9}
        detras={[{ l: DOT, x: SN, p: "brazosCruzados", c: "triste", d: -1 }]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 150, color: ROJO, opacity: interpolate(useF(), [k(103), k(103.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 0 34px rgba(255,74,61,0.55)" }}>4 DAYS LEFT</div>
      <Dice quien="rafi" t="…unless we opened the freezer." x={960} y={330} desde={k(104.6)} centro tam={64} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 27 · todos sabían qué había ahí; yo mejor que nadie ----------
export const P27Sabia: React.FC = () => {
  const k = kDe(106.3);
  return (
    <Sala cl={[mira(0, PP.puertaCocina + 300, 650, 2.4), mira(k(109.3), PP.puertaCocina + 320, 660, 2.8, { curva: "lineal" })]} sp={D9}
      gente={[{ l: RAFI, x: PP.puertaCocina + 340, p: "parado", c: [{ f: 0, v: "cansado" }, { f: k(107.7), v: "triste" }], d: -1, mir: { x: -1, y: 0 } }]}
      hud={<Dice quien="rafi" t="I knew it best." x={1150} y={760} desde={k(107.8)} tam={70} />} />
  );
};

// ---------- 28 · doscientas hamburguesas, papas, panes, helado: comida para un mes ----------
export const P28Comida: React.FC = () => {
  const k = kDe(109.39);
  return (
    <AbsoluteFill>
      <EnFreezer cl={[mira(0, 300, 709, 1.6), mira(k(114), 900, 717, 1.5, { curva: "inout" }), mira(k(117.8), 1650, 726, 1.4, { curva: "inout" })]} sp={{ vacio: 0 }}
        gente={[{ l: RAFI, ruta: [{ f: 0, x: 250 }, { f: k(117), x: 1400 }], p: [{ f: 0, v: { hD: 150, cD: 30, hI: 150, cI: 30 } }, { f: 45, v: { hD: 120, cD: 20, hI: 130, cI: 20 } }, { f: 90, v: { hD: 150, cD: 30, hI: 150, cI: 30 } }], mD: <Bolsa />, c: "neutral", d: 1, luz: RIM.frio }]} />
      <Lista x={110} y={150} tam={56} lineas={[{ t: "200  PATTIES", desde: k(109.6) }, { t: "CASES OF FRIES", desde: k(111.5) }, { t: "HOT DOG BUNS", desde: k(113) }, { t: "ICE CREAM", desde: k(114.5) }]} />
      <Dice quien="rafi" t="a month. maybe more." x={1180} y={830} desde={k(115.6)} tam={66} />
      <HudDia dia={9} rayas={9} />
    </AbsoluteFill>
  );
};

// ---------- 29 · detrás de una puerta de acero con una perilla roja que nadie vivo apretó en ocho días ----------
export const P29Perilla: React.FC = () => {
  const k = kDe(117.8);
  return (
    <EnFreezer cl={[mira(0, FP.puerta, 736, 1.3), mira(k(120.2), FP.perilla, 663, 2.6, { curva: "inout" }), mira(k(123.4), FP.perilla, 580, 3.2, { curva: "lineal" })]} sp={{ vacio: 0 }}
      gente={[{ l: zombi(GUS), x: FP.der - 320, p: "zombi", c: "zombi", d: -1, mir: { x: -1, y: 0 }, luz: RIM.frio }]}
      hud={<><Rotulo t="red safety knob" x={330} y={650} desde={k(119.6)} flecha="der" color={AMARILLO} /><Dice quien="rafi" t="nobody alive. 8 days." x={240} y={860} desde={k(121.4)} tam={70} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 30 · y Gus: Gus Pruitt, 61, encargado de la noche, 31 años en Hollis ----------
export const P30Gus: React.FC = () => {
  const k = kDe(123.47);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, 1000, 520, 1.2), mira(k(130.2), 1100, 726, 1.4, { curva: "inout" })]} sp={{ luz: "noche" }} />
      <Velo color="#0b0a0c" o={0.45} />
      <Foto l={GUS} x={180} y={90} w={640} rot={-4} cara="feliz" pie="GUS PRUITT" fondo="#e9c98e" busto desde={k(123.8)} />
      <Lista x={960} y={300} tam={76} lineas={[{ t: "night manager", desde: k(125.6) }, { t: "61 years old", desde: k(127.2) }, { t: "31 years at Hollis", desde: k(128.6), color: AMARILLO }]} />
    </AbsoluteFill>
  );
};

// ---------- 31-33 · recuerdos: el chili, la plata en negro, «traeme una caja de papas» ----------
const Olla: React.FC = () => <g transform="translate(0,-6)"><rect x={-26} y={-30} width={52} height={34} rx={6} fill="#7a7a84" /><rect x={-30} y={-34} width={60} height={8} rx={4} fill="#9a9aa4" /><path d="M-10,-40 q4,-12 0,-22 M6,-40 q4,-12 0,-22" stroke="#fff" strokeWidth={3} fill="none" opacity={0.5} /></g>;
export const P31Chili: React.FC = () => {
  const k = kDe(130.23);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, CP.freidora - 200, 696, 1.8), mira(k(132), CP.freidora - 260, 680, 2.1, { curva: "inout" })]} sp={{ luz: "prendida" }}
        gente={[{ l: GUS, x: CP.freidora - 60, p: [{ f: 0, v: { hD: 70, cD: 50 } }, { f: 20, v: { hD: 60, cD: 70 } }, { f: 40, v: { hD: 70, cD: 50 } }], c: "feliz", d: -1, mD: <Olla />, habla: [[0, 50]] }, { l: RAFI, x: CP.freidora - 420, p: "parado", c: "feliz", d: 1 }]} />
      <Recuerdo />
      <Rotulo t="the chili" x={1200} y={200} desde={k(131.2)} flecha="izq" />
    </AbsoluteFill>
  );
};
const Billete: React.FC = () => <rect x={-18} y={-10} width={36} height={18} rx={2} fill="#6fae6a" stroke="#3e6e3a" strokeWidth={2} />;
export const P32Plata: React.FC = () => {
  const k = kDe(132.1);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, SN - 200, 685, 2.0), mira(k(134.4), SN - 240, 673, 2.3, { curva: "inout" })]} snack sp={{ luz: "liga", tv: "normal" }}
        detras={[{ l: GUS, x: SN - 100, p: [{ f: 0, v: "parado" }, { f: 16, v: { hD: 80, cD: 10 } }], c: "picaro", d: -1, mD: <Billete /> }, { l: RAFI, x: SN - 420, p: [{ f: 0, v: "parado" }, { f: 30, v: { hD: 70, cD: 20 } }], c: "feliz", d: 1 }]} />
      <Recuerdo />
      <Dice quien="rafi" t="cash, when the register was short" x={250} y={780} desde={k(132.5)} tam={58} />
    </AbsoluteFill>
  );
};
export const P33Papas: React.FC = () => {
  const k = kDe(134.4);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, 860, 690, 1.9), mira(k(137.6), 900, 690, 1.95, { curva: "inout" }), mira(k(139.4), CP.puerta - 120, 680, 2.1, { curva: "inout" }), mira(k(141.2), CP.puerta - 100, 680, 2.25, { curva: "lineal" })]}
        sp={{ luz: "prendida", puerta: (ff: number) => interpolate(ff, [k(138.4), k(139), k(140.2), k(140.9)], [0, 0.8, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
        gente={[
          { l: RAFI, x: 700, p: [{ f: 0, v: "hablar" }, { f: k(137), v: "señalar" }], c: "feliz", habla: [[k(136.2), k(138)]], d: 1 },
          { l: GUS, ruta: [{ f: 0, x: 1000 }, { f: k(137.6), x: 1000 }, { f: k(139.6), x: CP.puerta, curva: "lineal" }], p: [{ f: 0, v: "parado" }, { f: k(137.4), v: "saludar" }, { f: k(137.9), v: "parado" }], c: "cansado", d: [{ f: 0, v: -1 }, { f: k(137.8), v: 1 }], op: (ff: number) => interpolate(ff, [k(140.1), k(140.5)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) },
        ]} />
      <Recuerdo />
      <HudDia dia={1} rayas={1} desde={9999} hora="8:10 PM" />
      <VeloX desde={k(139.8)} o={0.4} />
      <Dice quien="rafi" t="…and he never came out." x={960} y={150} desde={k(139.8)} centro tam={76} />
    </AbsoluteFill>
  );
};

// ---------- 34 · el día nueve por fin lo dije en voz alta: fue mi culpa ----------
export const P34Culpa: React.FC = () => {
  const k = kDe(141.23);
  return (
    <Sala cl={[mira(0, 1640, 700, 1.8), mira(k(144.2), 1640, 760, 3.0, { curva: "inout" }), mira(k(145.5), 1640, 770, 3.3, { curva: "lineal" })]} sp={D9}
      gente={[{ l: RAFI, x: 1640, sent: 0, p: { ...sentadoPiso, cabeza: 18 }, c: [{ f: 0, v: "cansado" }, { f: k(144.2), v: "triste" }], d: 1, habla: [[k(144.2), k(145.5)]] }]}
      hud={<><Dice quien="rafi" t="It was my fault." x={960} y={160} desde={k(144.3)} centro tam={96} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 35 · Cal dijo que no, Dot dijo que no; Nell vino y se apoyó en mi brazo ----------
export const P35Apoya: React.FC = () => {
  const k = kDe(145.55);
  return (
    <Sala cl={[mira(0, 1600, 600, 1.2), mira(k(149), 1680, 620, 1.6, { curva: "inout" }), mira(k(153), 1720, 640, 2.2, { curva: "inout" })]} sp={D9}
      gente={[
        { l: CAL, x: 1250, p: [{ f: 0, v: "hablar" }, { f: k(147), v: "brazosCruzados" }], c: "triste", d: 1, habla: [[0, k(146.8)]] },
        { l: DOT, x: 2150, p: [{ f: 0, v: "manosCintura" }, { f: k(147), v: "hablar" }], c: "triste", d: -1, habla: [[k(146.8), k(148)]] },
        { l: RAFI, x: 1640, sent: 0, p: { ...sentadoPiso, cabeza: 18 }, c: "triste", d: 1 },
        { l: NELL, ruta: [{ f: 0, x: 2000 }, { f: k(150.2), x: 1760 }], sent: [{ f: 0, v: undefined }, { f: k(150.5), v: 0 }], p: [{ f: 0, v: "parado" }, { f: k(150.5), v: { ...sentadoPiso, tronco: -18, cabeza: -16 } }], c: "triste", d: -1, mD: <Walkie s={0.8} /> },
      ]}
      hud={<><Dice quien="cal" t="No." x={300} y={240} desde={k(145.7)} hasta={k(147.4)} tam={80} /><Dice quien="dot" t="No." x={1400} y={240} desde={k(146.9)} hasta={k(148.6)} tam={80} /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 36 · eso fue peor, la verdad ----------
export const P36Peor: React.FC = () => (
  <Sala cl={[mira(0, 1700, 760, 3.0), mira(52, 1700, 770, 3.2, { curva: "lineal" })]} sp={D9}
    gente={[{ l: RAFI, x: 1640, sent: 0, p: { ...sentadoPiso, cabeza: 18 }, c: "triste", d: 1 }, { l: NELL, x: 1760, sent: 0, p: { ...sentadoPiso, tronco: -18, cabeza: -16 }, c: "triste", d: -1 }]}
    hud={<Dice quien="rafi" t="That was worse, honestly." x={960} y={140} desde={4} centro tam={70} />} />
);

// ---------- 37 · Marlon: «entonces lo dejamos ahí y nos morimos de hambre con educación» ----------
export const P37Educacion: React.FC = () => {
  const k = kDe(154.77);
  return (
    <Sala cl={[mira(0, 1300, 560, 1.4), mira(k(156.8), 1100, 560, 2.0, { curva: "inout" }), mira(k(160.5), 1080, 673, 2.3, { curva: "lineal" })]} sp={D9}
      gente={[{ l: MARLON, x: 1050, p: [{ f: 0, v: "brazosCruzados" }, { f: k(157), v: "hablar" }, { f: k(159), v: { hD: 60, cD: 100, hI: 60, cI: 100 } }], c: [{ f: 0, v: "duda" }, { f: k(157), v: "picaro" }], d: 1, habla: [[k(157), k(160.5)]] }, { l: RAFI, x: 1640, sent: 0, p: sentadoPiso, c: "triste", d: -1 }]}
      hud={<><Dice quien="marlon" t="So we leave him in there…" x={1080} y={200} desde={k(157.2)} hasta={k(158.7)} tam={62} /><Dice quien="marlon" t="…and we starve politely." x={1080} y={200} desde={k(158.8)} tam={62} /></>} />
  );
};

// ---------- 38 · Dot no llegó a la primavera ----------
export const P38Primavera: React.FC = () => (
  <AbsoluteFill>
    <Sala cl={[mira(0, pistaX(7), 650, 2.8), mira(54, pistaX(7), 655, 3.2, { curva: "lineal" })]} sp={N9}
      gente={[{ l: DOT, x: pistaX(7), p: "brazosCruzados", c: "triste", d: 1, mir: { x: 1, y: -0.2 }, luz: RIM.noche }]} />
    <Velo color="#000" o={0.3} />
    <Dice quien="rafi" t="Dot didn't make it to spring." x={960} y={850} desde={4} centro tam={72} />
  </AbsoluteFill>
);

// ---------- 39 · pero el día nueve fue ella la que pensó cómo sacar a Gus sin tocarlo ----------
export const P39Idea: React.FC = () => {
  const k = kDe(162.41);
  return (
    <Sala cl={[mira(0, SN, 736, 1.3), mira(k(167.3), SN - 100, 702, 1.7, { curva: "inout" })]} snack sp={D9}
      detras={[{ l: DOT, x: SN, p: [{ f: 0, v: "pensar" }, { f: k(165.5), v: "señalar" }], c: [{ f: 0, v: "duda" }, { f: k(165.5), v: "determinado" }], d: -1 }]}
      gente={[{ l: CAL, x: SN - 600, p: "brazosCruzados", c: "duda", d: 1 }, { l: RAFI, x: SN + 500, p: "parado", c: "duda", d: -1 }]}
      hud={<><Rotulo t="without anybody touching him" x={250} y={200} desde={k(165.6)} flecha="der" /><HudDia dia={9} rayas={9} /></>} />
  );
};

// ---------- 40 · su idea era el ruido ----------
export const P40Ruido: React.FC = () => (
  <Sala cl={[mira(0, SN, 700, 2.4), mira(52, SN, 710, 2.8, { curva: "inout" })]} snack sp={D9}
    detras={[{ l: DOT, x: SN, p: "señalar", c: "determinado", d: -1, habla: [[10, 50]] }]}
    hud={<Dice quien="dot" t="NOISE." x={1200} y={200} desde={8} tam={120} />} />
);

// ---------- 41 · el día uno aprendimos que siguen el sonido: cuando Cal cortó los pinsetters, se fueron ----------
export const P41Siguen: React.FC = () => {
  const k = kDe(169.15);
  const zs = [LIGA, WAFFLE, LIGA3, PINPAL, LIGA2];
  return (
    <AbsoluteFill>
      <Afuera cl={[mira(0, 1700, 690, 1.5), mira(k(175.4), 1250, 720, 1.3, { curva: "inout" })]} sp={{ sirenas: true, persiana: 1 }}
        gente={zs.map((l, i) => ({ l: zombi(l), ruta: [{ f: 0, x: 1400 + i * 150, y: P + 10 * i }, { f: k(171.6), x: 1380 + i * 150, y: P + 10 * i }, { f: k(175.4), x: 600 + i * 170, y: P + 120 + 10 * i }], p: "zombi", c: "zombi", d: [{ f: 0, v: 1 as const }, { f: k(171.8), v: -1 as const }], seed: i + 3 }))} />
      <Recuerdo />
      <Dice quien="rafi" t="they follow sound." x={960} y={140} desde={k(170)} centro tam={72} />
      <HudDia dia={1} rayas={1} />
    </AbsoluteFill>
  );
};

// ---------- 42 · Dot: «bueno, démosle un sonido para seguir» ----------
export const P42Sonido: React.FC = () => {
  const k = kDe(175.45);
  return (
    <Sala cl={[mira(0, SN - 60, 630, 2.0), mira(k(178.7), SN + 300, 600, 1.5, { curva: "inout" })]} snack sp={D9}
      detras={[{ l: DOT, x: SN, p: [{ f: 0, v: "hablar" }, { f: 50, v: "manosCintura" }], c: "picaro", d: -1, habla: [[k(176), k(178.7)]] }]}
      gente={[{ l: CAL, x: SN + 600, p: [{ f: 0, v: "brazosCruzados" }, { f: k(177.6), v: "pensar" }], c: "determinado", d: -1 }]}
      hud={<><Dice quien="dot" t="Fine. Give him a sound to follow." x={260} y={200} desde={k(176.3)} tam={64} /><HudDia dia={9} rayas={9} /></>} />
  );
};
