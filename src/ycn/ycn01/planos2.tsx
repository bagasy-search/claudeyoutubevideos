// ycn01 · planos 33-80 (195 → 466 s): el mordido, los once minutos, el caos, la persiana, el disyuntor, las dos reglas,
// el conteo, la primera rayita y DAY ONE, los golpes del freezer, Gus y la pantalla final.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { F_HUD, Pildora } from "../../anikit/pantalla";
import { Walkie } from "../../anikit/props";
import { NELL, CAL, DOT, RAFI, MARLON, GUS, LIGA, LIGA2, LIGA3, PINPAL, WAFFLE, RIM, ROJO, zombi } from "../elenco";
import { pistaX, PISTAS_PUNTOS as PP } from "../sets/pistas";
import { COCINA_YCN_PUNTOS as CP } from "../sets/cocina";
import { FREEZER_PUNTOS as FP } from "../sets/freezer";
import { Anotador, Bola, Linterna, Maletin, Papas, Tiza } from "../utileria";
import { Grafico } from "../../anikit/explica";
import { A, Afuera, Cocina, Dice, EnFreezer, Final, HudDia, kDe, Lista, Maquinas, P, Recuerdo, Rotulo, Sacude, Sala, Velo } from "../base";

const PU = PP.puerta, CH = PP.cadena, BA = PP.banco;
const TOALLA = <g transform="translate(-6,-6)"><rect x={-22} y={-14} width={44} height={26} rx={8} fill="#c9c2b4" /><rect x={-22} y={-2} width={44} height={10} rx={4} fill="#4a3a3a" opacity={0.7} /></g>;
const MORDIDO = { ...LIGA, camisa: "#2f8f7a" };
const brazoTapado = { hD: 70, cD: 120, hI: 60, cI: 130, tronco: 6 }; // sostiene el antebrazo contra el pecho
const gateo = { tronco: 58, pI: 70, rI: 120, pD: 80, rD: 125, hD: 92, cD: 0, hI: 70, cI: 20, cabeza: -30 };

// ---------- 33 · ella era la única que sabía cómo se ve una mordida ----------
export const P33Sabia: React.FC = () => (
  <Sala cl={[mira(0, pistaX(7) + 40, 663, 2.6), mira(108, pistaX(7) + 40, 656, 2.9, { curva: "inout" })]} sp={{ tv: "alerta" }}
    gente={[{ l: DOT, x: pistaX(7), p: "brazosCruzados", c: "determinado", d: 1, mir: { x: 1, y: 0 } }]}
    hud={<><HudDia dia={1} desde={9999} hora="8:13 PM" /><Rotulo t="30 years, ER" x={1150} y={250} desde={20} flecha="izq" color="#ff8fb8" /></>} />
);

// ---------- 34 · 8:14, entra un hombre de la liga (camiseta, pista 3) ----------
export const P34Entra: React.FC = () => {
  const k = kDe(198.9);
  return (
    <Sala cl={[mira(0, PU - 60, 620, 1.7), mira(k(203), PU - 480, 640, 1.9, { curva: "inout" })]} sp={{ tv: "alerta" }}
      gente={[
        { l: MORDIDO, ruta: [{ f: 0, x: PU + 40 }, { f: k(204.5), x: PU - 560, curva: "out" }], p: brazoTapado, c: "miedo", d: -1, mD: TOALLA },
        { l: LIGA2, x: PU - 820, p: "brazosCruzados", c: "neutral", d: 1 },
      ]}
      hud={<><HudDia dia={1} desde={9999} hora="8:14 PM" /><Rotulo t="lane 3 · I sold him a beer" x={260} y={160} desde={k(202.2)} flecha="der" /></>} />
  );
};

// ---------- 35 · el antebrazo contra el pecho, la toalla oscura ----------
export const P35Toalla: React.FC = () => {
  const k = kDe(205.8);
  return (
    <Sala cl={[mira(0, PU - 560, 669, 2.4), mira(k(210.5), PU - 560, 600, 3.0, { curva: "inout" })]} sp={{ tv: "alerta" }}
      gente={[{ l: MORDIDO, x: PU - 560, p: [{ f: 0, v: brazoTapado }, { f: 60, v: { ...brazoTapado, tronco: 10 } }], c: "miedo", d: -1, mD: TOALLA, mir: { x: 0.4, y: 0.6 } }]}
      hud={<Rotulo t="the towel was dark" x={1150} y={760} desde={k(209.4)} flecha="izq" />} />
  );
};

// ---------- 36 · «un tipo en el estacionamiento me agarró… no me soltaba» ----------
export const P36Cuenta: React.FC = () => {
  const k = kDe(211.7);
  return (
    <Sala cl={[mira(0, PU - 700, 560, 1.6), mira(k(215.8), PU - 760, 580, 1.8, { curva: "inout" })]} sp={{ tv: "alerta" }}
      gente={[
        { l: MORDIDO, x: PU - 600, p: brazoTapado, c: "miedo", d: -1, mD: TOALLA, habla: [[0, k(215.6)]] },
        { l: DOT, ruta: [{ f: 0, x: PU - 1300 }, { f: k(216), x: PU - 820 }], p: "parado", c: [{ f: 0, v: "duda" }, { f: k(214.5), v: "determinado" }], d: 1 },
      ]}
      hud={<><Dice quien="otro" t="A guy in the lot grabbed me." x={300} y={170} desde={k(211.9)} hasta={k(215.6)} /><Dice quien="otro" t="He wouldn't let go." x={500} y={300} desde={k(214)} hasta={k(215.6)} /></>} />
  );
};

// ---------- 37 · Dot lo sienta en el banco de los zapatos y desenvuelve la toalla ----------
export const P37Banco: React.FC = () => {
  const k = kDe(215.8);
  return (
    <Sala cl={[mira(0, BA + 140, 620, 1.7), mira(k(220.9), BA + 100, 640, 2.0, { curva: "inout" })]} banco zapatos sp={{ tv: "alerta" }}
      detras={[{ l: LIGA3, x: 4380, p: "manosCara", c: "miedo", d: -1 }]}
      gente={[
        { l: MORDIDO, ruta: [{ f: 0, x: BA + 400 }, { f: k(217.8), x: BA }], sent: [{ f: 0, v: undefined }, { f: k(218), v: 60 }], p: [{ f: 0, v: brazoTapado }, { f: k(218), v: "sentado" }, { f: k(219.5), v: { hD: 60, cD: 40, hI: 20, cI: 30 } }], c: "miedo", d: -1 },
        { l: DOT, ruta: [{ f: 0, x: BA + 700 }, { f: k(217.8), x: BA + 420 }], p: [{ f: 0, v: "parado" }, { f: k(218.2), v: "agacharse" }], c: "determinado", d: -1, mD: (ff: number) => (ff > k(219.6) ? TOALLA : null) },
      ]}
      hud={<HudDia dia={1} desde={9999} hora="8:17 PM" />} />
  );
};

// ---------- 38 · la cara de Dot cambia (no vemos la herida) ----------
export const P38Cara: React.FC = () => {
  const k = kDe(220.9);
  return (
    <Sala cl={[mira(0, BA + 20, 700, 2.6), mira(k(226.4), BA + 30, 690, 3.1, { curva: "lineal" })]} banco zapatos sp={{ tv: "alerta" }}
      gente={[{ l: DOT, x: BA + 10, p: "agacharse", c: [{ f: 0, v: "determinado" }, { f: k(221.8), v: "sorpresa" }, { f: k(224.5), v: "miedo" }], d: -1, mD: TOALLA, mir: { x: -0.6, y: 0.7 } }]}
      hud={<Dice quien="rafi" t="she had never seen that." x={300} y={820} desde={k(225)} tam={64} />} />
  );
};

// ---------- 39 · la vuelve a envolver; me susurra ----------
export const P39Susurra: React.FC = () => {
  const k = kDe(226.46);
  return (
    <Sala cl={[mira(0, BA - 200, 560, 1.4), mira(k(230.5), BA - 300, 560, 1.9, { curva: "inout" })]} banco zapatos sp={{ tv: "alerta" }}
      gente={[
        { l: MORDIDO, x: BA, sent: 60, p: { ...brazoTapado, pI: 88, rI: 88, pD: 92, rD: 92 }, c: "cansado", d: -1, mD: TOALLA },
        { l: DOT, ruta: [{ f: 0, x: BA + 170 }, { f: k(229), x: BA - 380 }], p: [{ f: 0, v: "agacharse" }, { f: k(227.5), v: "parado" }, { f: k(229.2), v: "hablar" }], c: "determinado", d: -1, habla: [[k(229.5), k(232.8)]] },
        { l: RAFI, x: BA - 620, p: "parado", c: [{ f: 0, v: "duda" }, { f: k(231), v: "miedo" }], d: 1 },
      ]}
      hud={<Dice quien="dot" t="Get the kid away from him." x={360} y={200} desde={k(230.2)} tam={70} />} />
  );
};

// ---------- 40 · levanto a Nell del mostrador ----------
export const P40Levanto: React.FC = () => {
  const k = kDe(232.91);
  return (
    <Sala cl={[mira(0, -720, 600, 1.9), mira(k(237), -880, 620, 2.0, { curva: "inout" })]} snack sp={{ tv: "alerta" }}
      gente={[{ l: RAFI, ruta: [{ f: 0, x: -460 }, { f: k(235), x: -660 }, { f: k(239), x: -1000 }], p: [{ f: 0, v: "parado" }, { f: k(234.5), v: { hD: 80, cD: 60, hI: 80, cI: 60 } }], c: "miedo", d: [{ f: 0, v: -1 }] }]}
      sobre={<A l={NELL} ruta={[{ f: 0, x: -760, y: P }, { f: k(235), x: -700, y: P - 40 }, { f: k(239), x: -1040, y: P - 40 }]} sent={[{ f: 0, v: 184 }, { f: k(235), v: 120 }]} p={[{ f: 0, v: "sentado" }, { f: k(235), v: { hD: 60, cD: 120, pI: 60, rI: 80, pD: 70, rD: 90 } }]} c="miedo" d={-1} mD={<Walkie s={0.85} />} mir={{ x: 1, y: 0 }} />}
      hud={<><HudDia dia={1} desde={9999} hora="8:16 PM" /><Rotulo t="the score screens kept the time" x={1180} y={900} desde={k(238)} /></>} />
  );
};

// ---------- 41 · once minutos (el reloj corre) ----------
export const P41Once: React.FC = () => {
  const k = kDe(241.13);
  const f = useF();
  const min = Math.round(interpolate(f, [0, k(244.4)], [16, 27], { extrapolateRight: "clamp" }));
  const seg = Math.round(interpolate(f, [0, k(244.4)], [0, 660], { extrapolateRight: "clamp" })); // el cronómetro corre 0:00 → 11:00
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, BA + 180, 640, 1.9), mira(k(244.8), BA + 200, 650, 2.1, { curva: "inout" })]} banco zapatos sp={{ tv: "alerta" }}
        gente={[{ l: MORDIDO, x: BA, sent: 60, p: { tronco: 30, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60, cD: 130, hI: 50, cI: 120, cabeza: 30 }, c: "cansado", d: -1, mD: TOALLA }]} />
      <div style={{ position: "absolute", left: 1250, top: 110, fontFamily: F_HUD, fontWeight: 600, fontSize: 110, color: ROJO, fontVariantNumeric: "tabular-nums", textShadow: "0 0 30px rgba(255,74,61,0.6)" }}>8:{String(min).padStart(2, "0")} PM</div>
      <div style={{ position: "absolute", left: 1300, top: 300, width: 300, height: 300, borderRadius: 150, border: "10px solid #f4efe4", background: "rgba(10,12,20,0.75)" }}>
        <div style={{ position: "absolute", left: 140, top: 20, width: 10, height: 130, background: ROJO, transformOrigin: "5px 130px", transform: `rotate(${interpolate(f, [0, k(244.4)], [0, 330], { extrapolateRight: "clamp" })}deg)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 56, color: "#f4efe4", fontVariantNumeric: "tabular-nums" }}>{Math.floor(seg / 60)}:{String(seg % 60).padStart(2, "0")}</div>
      </div>
      <Dice quien="rafi" t="11 minutes" x={1600} y={620} desde={k(243)} tam={80} />
      <HudDia dia={1} desde={9999} />
    </AbsoluteFill>
  );
};

// ---------- 42 · se para despacio, la cabeza caída hacia un lado ----------
export const P42Despacio: React.FC = () => {
  const k = kDe(244.83);
  return (
    <Sala cl={[mira(0, BA, 560, 1.8), mira(k(249.3), BA - 60, 676, 2.2, { curva: "inout" })]} banco zapatos sp={{ tv: "alerta" }}
      gente={[
        { l: MORDIDO, x: BA, sent: [{ f: 0, v: 60 }, { f: k(246.5), v: undefined }], p: [{ f: 0, v: { tronco: 30, pI: 88, rI: 88, pD: 92, rD: 92, hD: 60, cD: 130, cabeza: 30 } }, { f: k(247), v: { cabeza: 38, tronco: 8, hD: -10, cD: 10, hI: -14, cI: 12 } }], c: [{ f: 0, v: "cansado" }, { f: k(246.8), v: "zombi" }], d: -1 },
        { l: DOT, x: BA - 360, p: "parado", c: [{ f: 0, v: "duda" }, { f: k(247.5), v: "miedo" }], d: 1 },
      ]} />
  );
};

// ---------- 43 · strike en la 5: gira hacia el ruido como un perro que oye su nombre ----------
export const P43Ruido: React.FC = () => {
  const k = kDe(249.39);
  return (
    <Sala cl={[mira(0, pistaX(5), 717, 1.5), mira(k(252.2), pistaX(5), 709, 1.6, { curva: "inout" }), mira(k(252.3), BA - 120, 640, 2.0), mira(k(256.8), BA - 320, 640, 1.8, { curva: "inout" })]} banco zapatos sp={{ tv: "alerta", tiros: [{ pista: 5, f0: 6 }] }}
      gente={[
        { l: LIGA2, x: pistaX(5), p: [{ f: 0, v: "tirarSuelta" }, { f: 50, v: "celebrar" }], c: "risa" },
        { l: zombi(MORDIDO), ruta: [{ f: 0, x: BA - 60 }, { f: k(253), x: BA - 60 }, { f: k(256.8), x: BA - 520, curva: "lineal" }], p: "zombi", c: "zombi", d: [{ f: 0, v: -1 }] },
      ]}
      hud={<Pildora texto="THEY COME TO NOISE" x={960} y={140} desde={k(253.5)} color={ROJO} />} />
  );
};

// ---------- 44 · todo a la vez: alguien grita ----------
export const P44Grito: React.FC = () => {
  const k = kDe(256.81);
  return (
    <Sacude en={[k(259.6)]} amp={7}>
      <Sala cl={[mira(0, 2500, 620, 1.3), mira(k(260.8), 2900, 640, 1.45, { curva: "inout" })]} sp={{ luz: "alerta", tv: "alerta" }}
        gente={[
          { l: LIGA3, ruta: [{ f: 0, x: 2300 }, { f: 120, x: 3800 }], correr: 1, c: "miedo", p: "manosCara" }, { l: PINPAL, ruta: [{ f: 0, x: 1800 }, { f: 120, x: 3200 }], correr: 1, c: "miedo" },
          { l: LIGA, ruta: [{ f: 0, x: 2700 }, { f: 120, x: 4200 }], correr: 1, c: "miedo" }, { l: zombi(MORDIDO), ruta: [{ f: 0, x: 3600 }, { f: 120, x: 3300 }], p: "zombi", c: "zombi", d: -1 },
        ]}
        hud={<Dice quien="otro" t="AAAH—" x={960} y={170} desde={k(259.6)} tam={120} />} />
    </Sacude>
  );
};

// ---------- 45 · las puertas ya llenas de gente que entra… y algunos ya no eran gente ----------
export const P45Puertas: React.FC = () => {
  const k = kDe(260.83);
  return (
    <Sala cl={[mira(0, PU - 400, 560, 1.0), mira(k(265), PU - 200, 560, 1.25, { curva: "inout" }), mira(k(268), PU - 80, 560, 1.5, { curva: "inout" })]} sp={{ luz: "alerta" }}
      gente={[
        { l: LIGA2, ruta: [{ f: 0, x: PU - 300 }, { f: 200, x: PU + 100 }], correr: 1, c: "miedo", d: 1 }, { l: PINPAL, ruta: [{ f: 0, x: PU - 500 }, { f: 220, x: PU - 50 }], correr: 1, c: "miedo", d: 1, seed: 6 },
        { l: LIGA, ruta: [{ f: 0, x: PU + 300 }, { f: 220, x: PU - 600 }], correr: 1, c: "miedo", d: -1, seed: 7 },
        { l: zombi(LIGA3), ruta: [{ f: 0, x: PU + 420 }, { f: 250, x: PU - 120 }], p: "zombi", c: "zombi", d: -1, op: (ff) => (ff > k(266) ? 1 : 0) },
        { l: zombi(WAFFLE), ruta: [{ f: 0, x: PU + 200 }, { f: 250, x: PU + -260 }], p: "zombi", c: "zombi", d: -1, seed: 11, esc: 0.95 },
        { l: zombi(LIGA), ruta: [{ f: 0, x: PU + 520 }, { f: 250, x: PU + 40 }], p: "zombi", c: "zombi", d: -1, seed: 12, esc: 1.0 },
        { l: PINPAL, ruta: [{ f: 0, x: PU + -800 }, { f: 250, x: PU + -200 }], correr: 1, c: "miedo", d: 1, seed: 13, esc: 0.92 },
        { l: LIGA2, ruta: [{ f: 0, x: PU + -1000 }, { f: 250, x: PU + -120 }], correr: 1, c: "miedo", d: 1, seed: 14, esc: 1.0 },
        { l: zombi(PINPAL), ruta: [{ f: 0, x: PU + 650 }, { f: 250, x: PU + 150 }], p: "zombi", c: "zombi", d: -1, seed: 15, esc: 0.9 },
        { l: LIGA3, ruta: [{ f: 0, x: PU + -650 }, { f: 250, x: PU + 350 }], correr: 1, c: "miedo", d: 1, seed: 16, esc: 1.0 },
        { l: zombi(LIGA2), ruta: [{ f: 0, x: PU + 800 }, { f: 250, x: PU + 300 }], p: "zombi", c: "zombi", d: -1, seed: 17, esc: 1.05 },
      ]}
      hud={<Dice quien="rafi" t="some weren't people anymore" x={260} y={160} desde={k(266)} tam={62} />} />
  );
};

// ---------- 46 · el cocinero del waffle de enfrente, todavía con el delantal ----------
export const P46Waffle: React.FC = () => {
  const k = kDe(269.19);
  return (
    <Sala cl={[mira(0, PU, 560, 1.6), mira(k(274.7), PU - 180, 560, 2.0, { curva: "lineal" })]} sp={{ luz: "alerta" }}
      gente={[{ l: zombi(WAFFLE), ruta: [{ f: 0, x: PU + 240 }, { f: k(274.7), x: PU - 140, curva: "lineal" }], p: "zombi", c: "zombi", d: -1, luz: RIM.neon }]}
      hud={<Rotulo t="the waffle cook from across Route 4" x={240} y={150} desde={k(270.5)} flecha="der" />} />
  );
};

// ---------- 47 · una mujer con camiseta de liga, su nombre en la espalda ----------
export const P47Nombre: React.FC = () => {
  const k = kDe(274.75);
  return (
    <Sala cl={[mira(0, PU - 300, 560, 1.9), mira(k(277.8), PU - 340, 676, 2.2, { curva: "inout" })]} sp={{ luz: "alerta" }}
      gente={[{ l: zombi(LIGA3), ruta: [{ f: 0, x: PU - 200 }, { f: k(277.8), x: PU - 420, curva: "lineal" }], p: "zombi", c: "zombi", d: [{ f: 0, v: 1 }, { f: k(276.5), v: -1 }], luz: RIM.neon }]}
      hud={<Dice quien="otro" t="SHERRY" x={1150} y={380} desde={8} hasta={k(276.4)} tam={80} rot={0} />} />
  );
};

// ---------- 48 · Cal sale corriendo del cuarto de máquinas: no a las puertas, a la cadena ----------
export const P48Cal: React.FC = () => {
  const k = kDe(277.85);
  return (
    <Sala cl={[mira(0, CH - 1820, 695, 1.8), mira(k(282.9), CH - 60, 695, 1.8, { curva: "lineal" })]} sp={{ luz: "alerta" }}
      gente={[
        { l: CAL, ruta: [{ f: 0, x: CH - 1900 }, { f: k(282.9), x: CH - 60, curva: "lineal" }], correr: 1, c: "determinado", d: 1, mI: <Linterna prendida={false} /> },
        { l: zombi(LIGA2), ruta: [{ f: 0, x: CH + 900 }, { f: k(282.9), x: CH + 380 }], p: "zombi", c: "zombi", d: -1 },
        { l: zombi(PINPAL), ruta: [{ f: 0, x: CH + 1150 }, { f: k(282.9), x: CH + 600 }], p: "zombi", c: "zombi", d: -1 },
      ]}
      hud={<Dice quien="rafi" t="not the doors. the chain." x={960} y={150} desde={k(280.2)} tam={66} />} />
  );
};

// ---------- 49 · afuera: la persiana enrollable de la entrada (explicación) ----------
export const P49Persiana: React.FC = () => {
  const k = kDe(282.95);
  return (
    <Afuera cl={[mira(0, 1650, 500, 1.1), mira(k(288.5), 1650, 560, 1.3, { curva: "inout" })]} sp={{ sirenas: true, persiana: (ff: number) => interpolate(ff, [0, k(288.5)], [0, 0.4]) }}
      gente={[{ l: zombi(LIGA2), ruta: [{ f: 0, x: 900 }, { f: k(288.5), x: 1350 }], p: "zombi", c: "zombi" }, { l: zombi(PINPAL), ruta: [{ f: 0, x: 2400 }, { f: k(288.5), x: 1950 }], p: "zombi", c: "zombi", d: -1 }]}
      hud={<Pildora texto="ROLL-DOWN METAL SHUTTER" x={960} y={140} desde={k(284)} />} />
  );
};

// ---------- 50 · Cal tira de la cadena con todo el cuerpo ----------
export const P50Tira: React.FC = () => {
  const k = kDe(288.53);
  const tiron = Array.from({ length: 10 }).flatMap((_, i) => [{ f: i * 14, v: "agarrarAlto" }, { f: i * 14 + 7, v: { hD: 60, cD: 40, hI: 70, cI: 30, tronco: 14, bajar: 8 } }]);
  return (
    <Sala cl={[mira(0, CH - 260, 560, 1.8), mira(k(291.3), CH - 300, 600, 1.6, { curva: "inout" })]} sp={{ luz: "alerta", persiana: (ff: number) => interpolate(ff, [0, k(291.4)], [0.3, 0.55]) }}
      gente={[{ l: CAL, x: CH - 90, p: tiron, c: "enojo", d: 1 }]} />
  );
};

// ---------- 51 · Dot grita «lock it, lock it now» — y ahí vi la manga amarilla ----------
export const P51Grita: React.FC = () => {
  const k = kDe(291.41);
  return (
    <Sala cl={[mira(0, PU - 500, 560, 1.4), mira(k(295), PU - 250, 760, 2.2, { curva: "inout" })]} sp={{ luz: "alerta", persiana: (ff: number) => interpolate(ff, [0, k(296.3)], [0.55, 0.7]) }}
      gente={[
        { l: DOT, x: PU - 700, p: [{ f: 0, v: "señalar" }, { f: 30, v: "hablar" }, { f: 60, v: "señalar" }], c: "enojo", habla: [[0, k(294.5)]], d: 1 },
        { l: NELL, ruta: [{ f: 0, x: PU - 420 }, { f: k(296.2), x: PU - 300 }], p: gateo, c: "miedo", d: 1 },
        { l: CAL, x: CH - 40, p: "agarrarAlto", c: "enojo", d: 1 },
      ]}
      hud={<Dice quien="dot" t="LOCK IT! LOCK IT NOW!" x={260} y={160} desde={k(291.6)} tam={84} />} />
  );
};

// ---------- 52 · Nell soltó el walkie, se deslizó a la puerta; de rodillas, bajo la persiana ----------
export const P52Walkie: React.FC = () => {
  const k = kDe(296.27);
  const f = useF();
  const wx = interpolate(f, [0, k(300.7)], [PU - 380, PU + 30], { extrapolateRight: "clamp" });
  return (
    <Sala cl={[mira(0, PU - 200, P - 160, 2.0), mira(k(303.8), PU - 40, P - 120, 2.8, { curva: "inout" })]} sp={{ luz: "alerta", persiana: (ff: number) => interpolate(ff, [0, k(303.8)], [0.7, 0.86]) }}
      gente={[{ l: NELL, ruta: [{ f: 0, x: PU - 420 }, { f: k(302), x: PU - 200, curva: "lineal" }], p: gateo, c: "miedo", d: 1 }]}
      extra={<g transform={`translate(${wx},${P - 8}) rotate(${f * 6})`}><Walkie s={1} luz /></g>}
      hud={<Rotulo t="her walkie" x={1150} y={600} desde={k(297.5)} hasta={k(301)} flecha="abajo" />} />
  );
};

// ---------- 53 · me tiré: la capucha, el abrigo, tiré — y la persiana pegó donde estaba su mano ----------
export const P53Tiro: React.FC = () => {
  const k = kDe(303.87);
  const f = useF();
  return (
    <Sacude en={[k(309.9)]} amp={14}>
      <Sala cl={[mira(0, PU - 260, P - 200, 1.6), mira(k(309.9), PU - 400, P - 150, 2.0, { curva: "in" })]} sp={{ luz: "alerta", persiana: (ff: number) => interpolate(ff, [0, k(309.9)], [0.86, 1], { extrapolateRight: "clamp" }) }}
        gente={[
          { l: RAFI, ruta: [{ f: 0, x: PU - 900 }, { f: k(305.6), x: PU - 360, curva: "out" }, { f: k(310.5), x: PU - 720, curva: "out" }], correr: 1, p: [{ f: 0, v: "parado" }, { f: k(305.6), v: { tronco: 78, hD: 95, cD: 0, hI: 90, cI: 10, pI: -40, rI: 30, pD: -50, rD: 20 } }, { f: k(307.5), v: { tronco: -14, hD: 40, cD: 60, hI: 40, cI: 60, pI: -30, pD: 20 } }], c: [{ f: 0, v: "miedo" }, { f: k(307.5), v: "determinado" }], d: [{ f: 0, v: 1 }] },
          { l: NELL, ruta: [{ f: 0, x: PU - 200 }, { f: k(306), x: PU - 200 }, { f: k(310.5), x: PU - 560, curva: "out" }], p: [{ f: 0, v: gateo }, { f: k(307), v: "sentadoSuelo" }], c: "miedo", d: 1 },
        ]}
        hud={<Dice quien="rafi" t="I dove." x={1250} y={180} desde={k(304)} tam={90} />} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [k(309.9), k(310.3)], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </Sacude>
  );
};

// ---------- 54 · metal contra baldosa ----------
export const P54Metal: React.FC = () => (
  <AbsoluteFill>
    <Sala cl={[mira(0, PU - 60, P - 80, 3.0), mira(96, PU - 80, P - 80, 3.3, { curva: "inout" })]} sp={{ luz: "alerta", persiana: 1 }}
      gente={[{ l: NELL, x: PU - 230, p: "sentadoSuelo", c: "miedo", d: 1, mir: { x: 1, y: 0.2 } }]} />
    <Dice quien="rafi" t="metal on tile." x={960} y={300} desde={20} centro tam={80} />
  </AbsoluteFill>
);

// ---------- 55 · Marlon entra rodando por el último hueco, agarrándose el brazo izquierdo ----------
export const P55Rueda: React.FC = () => {
  const k = kDe(314.33);
  return (
    <Sala cl={[mira(0, PU - 100, P - 120, 1.7), mira(k(318), PU - 320, P - 20, 1.7, { curva: "inout" }), mira(k(321), PU - 360, P, 1.8, { curva: "inout" })]} sp={{ luz: "alerta", persiana: (ff: number) => interpolate(ff, [0, k(317.2)], [0.88, 1], { extrapolateRight: "clamp" }) }}
      gente={[{ l: MARLON, ruta: [{ f: 0, x: PU + 120, y: P }, { f: k(317.2), x: PU - 420, curva: "out" }], p: [{ f: 0, v: { tronco: 80, pI: 60, rI: 90, pD: 70, rD: 100, hD: 90, cD: 10, hI: 60, cI: 120 } }, { f: k(317.2), v: { ...{ tronco: -70, pI: -80, rI: 10, pD: -70, rD: 20 }, hI: 50, cI: 130, hD: 20, cD: 30, bajar: 120 } }], c: "miedo", d: -1, mD: <Maletin /> }]}
      hud={<Rotulo t="his LEFT arm" x={1150} y={720} desde={k(320.5)} flecha="izq" />} />
  );
};

// ---------- 56 · «me resbalé… estoy bien, chief» ----------
export const P56Bien: React.FC = () => {
  const k = kDe(323.11);
  return (
    <Sala cl={[mira(0, PU - 500, P - 220, 2.0), mira(k(328), PU - 520, P - 220, 2.3, { curva: "inout" })]} sp={{ luz: "alerta", persiana: 1 }}
      gente={[
        { l: MARLON, x: PU - 420, sent: 40, p: { tronco: -10, pI: 30, rI: 40, pD: 20, rD: 30, hI: 50, cI: 130, hD: 30, cD: 50 }, c: [{ f: 0, v: "miedo" }, { f: k(325), v: "picaro" }], habla: [[0, k(328)]], d: -1 },
        { l: RAFI, x: PU - 760, p: "parado", c: "duda", d: 1 },
      ]}
      hud={<><Dice quien="marlon" t="I slipped in the lot." x={250} y={150} desde={k(323.2)} /><Dice quien="marlon" t="I'm fine, chief. I'm fine." x={330} y={270} desde={k(325.1)} /></>} />
  );
};

// ---------- 57 · empiezan los golpes: manos en el metal, docenas ----------
// palma oscura que pega contra la persiana desde afuera: aparece en el golpe y se apaga
const Mano: React.FC<{ g: number; x: number; y: number }> = ({ g, x, y }) => {
  const f = useF();
  const o = interpolate(f, [g - 2, g, g + 16], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${1 + (f - g > 0 ? 0 : 0.15)})` }} width={130} height={150} viewBox="0 0 130 150">
      <ellipse cx={65} cy={95} rx={42} ry={48} fill="#0b0d14" />
      {[18, 42, 66, 90].map((cx, i) => <rect key={i} x={cx} y={14 + Math.abs(i - 1.5) * 8} width={20} height={60} rx={10} fill="#0b0d14" />)}
      <rect x={100} y={70} width={20} height={44} rx={10} fill="#0b0d14" transform="rotate(30 110 92)" />
    </svg>
  );
};
export const P57Golpes: React.FC = () => {
  const k = kDe(328.07);
  const gs = Array.from({ length: 14 }).map((_, i) => 8 + i * 13 + (i % 3) * 4);
  return (
    <Sacude en={gs} amp={4}>
      <Sala cl={[mira(0, PU - 420, 620, 1.8), mira(k(334.4), PU - 560, 630, 1.7, { curva: "inout" })]} sp={{ luz: "alerta", persiana: 1 }}
        gente={[{ l: DOT, ruta: [{ f: 0, x: PU - 380 }, { f: 120, x: PU - 560 }], c: "miedo", d: 1, p: "parado" }, { l: RAFI, ruta: [{ f: 0, x: PU - 560 }, { f: 120, x: PU - 760 }], c: "miedo", d: 1, mD: undefined }, { l: NELL, ruta: [{ f: 0, x: PU - 680 }, { f: 120, x: PU - 880 }], c: "miedo", d: 1, p: "encogerse" }]}
        hud={<>{gs.map((g, i) => <Mano key={i} g={g} x={1380 + ((i * 137) % 380)} y={240 + ((i * 89) % 380)} />)}<Dice quien="otro" t="BANG  BANG  BANG" x={960} y={130} desde={10} centro tam={80} rot={-4} /></>} />
    </Sacude>
  );
};

// ---------- 58 · Cal baja el disyuntor general de los pinsetters ----------
export const P58Palanca: React.FC = () => {
  const k = kDe(334.51);
  const f = useF();
  return (
    <Maquinas cl={[mira(0, -700, 520, 1.1), mira(k(337.5), -1020, 690, 1.9, { curva: "inout" })]} sp={{ encendidas: true, palanca: (ff: number) => interpolate(ff, [k(337.6), k(338.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), luz: f > k(338.2) ? "noche" : "prendida" }}
      gente={[{ l: CAL, ruta: [{ f: 0, x: 300 }, { f: k(337.3), x: -960, curva: "out" }], correr: 1, p: [{ f: 0, v: "parado" }, { f: k(337.3), v: "agarrarAlto" }, { f: k(338.2), v: { hD: 60, cD: 30, tronco: 10 } }], c: "determinado", d: -1 }]} />
  );
};

// ---------- 59 · dieciséis máquinas se paran ----------
export const P59Paran: React.FC = () => (
  <Maquinas cl={[mira(0, 1880, 709, 1.6), mira(160, 1930, 721, 1.45, { curva: "inout" })]} sp={{ encendidas: [], luz: "noche" }}
    gente={[{ l: CAL, x: 1800, p: [{ f: 0, v: "agarrarAlto" }, { f: 40, v: "manosCara" }], c: [{ f: 0, v: "determinado" }, { f: 40, v: "sorpresa" }], d: 1, mI: <Linterna />, luz: RIM.linterna }]}
    hud={<><div style={{ position: "absolute", left: 0, right: 0, top: 40, height: 170, background: "rgba(8,6,10,0.72)" }} /><Dice quien="rafi" t="all sixteen stopped." x={960} y={80} desde={4} centro tam={76} /></>} />
);

// ---------- 60 · los golpes se vuelven lentos, más bajos… ----------
export const P60Silencio: React.FC = () => {
  const gs = [6, 30, 70, 120];
  return (
    <Sacude en={gs} amp={3}>
      <Sala cl={[mira(0, PU - 700, 560, 1.0), mira(100, PU - 800, 560, 1.1, { curva: "inout" })]} sp={{ luz: "noche", persiana: 1, pinos: true }}
        gente={[{ l: DOT, x: PU - 900, c: "duda", d: 1, mir: { x: 1, y: 0 } }, { l: RAFI, x: PU - 1100, c: "miedo", d: 1, p: [{ f: 0, v: "encogerse" }, { f: 90, v: "parado" }] }, { l: NELL, x: PU - 1220, c: "miedo", d: 1, p: "encogerse" }, { l: MARLON, x: PU - 600, sent: 40, p: { tronco: -10, pI: 30, rI: 40, pD: 20, rD: 30, hI: 50, cI: 130 }, c: "cansado", d: -1 }]} />
    </Sacude>
  );
};

// ---------- 61 · afuera se van, hacia las sirenas de la Route 4 ----------
export const P61SeVan: React.FC = () => {
  const zs = [LIGA, WAFFLE, LIGA3, PINPAL, LIGA2];
  return (
    <Afuera cl={[mira(0, 1650, 560, 0.75), mira(115, 1300, 700, 0.62, { curva: "inout" })]} sp={{ sirenas: true, persiana: 1 }}
      gente={zs.map((l, i) => ({ l: zombi(l), ruta: [{ f: 0, x: 1350 + i * 140, y: P + 10 * i }, { f: 115, x: 700 + i * 160, y: P + 120 + 10 * i }], p: "zombi", c: "zombi", d: -1 as const, seed: i + 3 }))} />
  );
};

// ---------- 62 · regla 1: el ruido ----------
export const P62Regla1: React.FC = () => {
  const k = kDe(351.41);
  return (
    <Sala cl={[mira(0, 1900, 520, 0.7), mira(k(356), 1900, 560, 0.85, { curva: "inout" })]} sp={{ luz: "noche", persiana: 1 }}
      gente={[{ l: CAL, x: 1500, p: "brazosCruzados", c: "cansado" }, { l: NELL, x: 1700, p: "sentadoSuelo", c: "triste", mD: <Walkie s={0.8} /> }, { l: DOT, x: 2100, p: "manosCintura", c: "determinado", d: -1 }]}
      hud={<><HudDia dia={1} desde={9999} /><Dice quien="cal" t="RULE 1: NOISE." x={960} y={140} desde={k(352)} centro tam={100} /><Dice quien="rafi" t="they come to noise" x={960} y={280} desde={k(353.4)} centro tam={60} /></>} />
  );
};

// ---------- 63 · medianoche: Dot nos hace contar · regla 2 ----------
export const P63Regla2: React.FC = () => {
  const k = kDe(356);
  return (
    <Sala cl={[mira(0, -560, 630, 1.6), mira(k(361.2), -540, 640, 1.8, { curva: "inout" })]} snack sp={{ luz: "noche", tv: "apagada" }}
      detras={[{ l: RAFI, x: -860, p: "pensar", c: "cansado", d: 1 }]}
      gente={[{ l: DOT, x: -300, p: [{ f: 0, v: "señalar" }, { f: 60, v: "hablar" }], c: "determinado", habla: [[k(357.2), k(361)]], d: -1 }, { l: CAL, x: -100, p: "brazosCruzados", c: "cansado", d: -1 }]}
      hud={<><HudDia dia={1} desde={9999} hora="12:00 AM" /><Dice quien="dot" t="RULE 2: COUNT EVERYTHING." x={960} y={150} desde={k(358.9)} centro tam={86} /></>} />
  );
};

// ---------- 64-65 · el conteo en el reverso de un anotador ----------
export const P64Cuento: React.FC = () => {
  const k = kDe(361.3);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, -1380, 676, 2.2), mira(k(369.3), -1300, 669, 2.4, { curva: "inout" })]} snack sp={{ luz: "noche", tv: "apagada" }}
        detras={[{ l: RAFI, ruta: [{ f: 0, x: -1500 }, { f: k(369), x: -1300 }], p: "celular", c: "determinado", d: 1, mD: <Anotador /> }]} luzAct={RIM.linterna} />
      <Lista x={1180} y={180} tam={58} lineas={[{ t: "41  CHIPS", desde: k(366.1) }, { t: "96  HOT DOGS", desde: k(369.4) }]} />
    </AbsoluteFill>
  );
};
export const P65Cuento2: React.FC = () => {
  const k = kDe(369.4);
  return (
    <AbsoluteFill>
      <Sala cl={[mira(0, -720, 640, 1.8), mira(k(376.2), -620, 640, 2.0, { curva: "inout" })]} snack sp={{ luz: "noche", tv: "apagada" }}
        detras={[{ l: RAFI, ruta: [{ f: 0, x: -800 }, { f: k(376), x: -560 }], p: "celular", c: "determinado", d: 1, mD: <Anotador /> }]}
        gente={[{ l: DOT, x: -380, p: "brazosCruzados", c: "picaro", d: -1, habla: [[k(374.3), k(376)]] }]} luzAct={RIM.linterna} />
      <Grafico x={30} y={200} w={840} h={480} desde={k(369.5)} paso={18} tema="oscuro" titulo="THE COUNT" destacar={1} acento={ROJO}
        datos={[{ rotulo: "CHIPS", v: 41 }, { rotulo: "HOT DOGS", v: 96 }, { rotulo: "PRETZELS", v: 18 }, { rotulo: "CANDY", v: 12 }]} />
      <Dice quien="dot" t="soda doesn't count." x={1220} y={170} desde={k(374.3)} tam={70} />
    </AbsoluteFill>
  );
};

// ---------- 66 · y el freezer walk-in con la comida de verdad ----------
export const P66Freezer: React.FC = () => {
  const k = kDe(376.2);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, 800, 620, 1.6), mira(k(384.1), CP.puerta - 260, 620, 1.85, { curva: "inout" })]} sp={{ luz: "noche" }}
        gente={[{ l: RAFI, ruta: [{ f: 0, x: 600 }, { f: k(382), x: CP.puerta - 300 }], c: "determinado", mD: <Linterna />, luz: RIM.linterna }]} />
      <Lista x={1180} y={180} tam={54} lineas={[{ t: "BURGER PATTIES", desde: k(379.9) }, { t: "FRIES", desde: k(381.1) }, { t: "ICE CREAM", desde: k(381.9) }]} />
      <Dice quien="dot" t="enough for weeks" x={1180} y={880} desde={k(382.8)} tam={64} />
    </AbsoluteFill>
  );
};

// ---------- 67 · Nell encuentra una tiza blanca ----------
export const P67Tiza: React.FC = () => {
  const k = kDe(384.23);
  return (
    <Sala cl={[mira(0, 1500, 560, 1.4), mira(k(386.8), 1820, 709, 1.6, { curva: "inout" })]} sp={{ luz: "noche", persiana: 1 }}
      gente={[{ l: NELL, ruta: [{ f: 0, x: 1400 }, { f: k(386), x: 1400 }, { f: k(386.9), x: 1830 }], p: [{ f: 0, v: "agacharse" }, { f: 30, v: "parado" }], c: [{ f: 0, v: "triste" }, { f: k(385.6), v: "determinado" }], mD: <Tiza />, d: 1 }]}
      hud={<HudDia dia={1} desde={9999} />} />
  );
};

// ---------- 68 · la primera rayita detrás de la 8; se sienta abajo, prueba el walkie: estática ----------
export const P68Raya: React.FC = () => {
  const k = kDe(386.91);
  const f = useF();
  const t = interpolate(f, [k(389.5), k(391)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Sala cl={[mira(0, 1890, 640, 1.8), mira(k(391.5), 1900, 640, 2.2, { curva: "inout" }), mira(k(393.5), 1880, 620, 1.9, { curva: "inout" })]} sp={{ luz: "noche", persiana: 1, tiza: t }}
      gente={[{ l: NELL, ruta: [{ f: 0, x: 1860 }, { f: k(392.5), x: 1860 }], sent: [{ f: 0, v: undefined }, { f: k(393), v: 0 }], p: [{ f: 0, v: "agarrarAlto" }, { f: k(391.5), v: "parado" }, { f: k(393), v: { tronco: -6, pI: 30, rI: 140, pD: 40, rD: 150, hD: 70, cD: 150, hI: 50, cI: 120 } }], c: [{ f: 0, v: "determinado" }, { f: k(394), v: "triste" }], mD: (ff: number) => (ff < k(392.5) ? <Tiza /> : <Walkie s={0.8} luz={ff % 8 < 4} />), d: 1 }]}
      hud={<><HudDia dia={1} rayas={1} desde={k(391)} /><Dice quien="rafi" t="static." x={1200} y={760} desde={k(395.6)} tam={64} /></>} />
  );
};

// ---------- 69 · Cal la mira un largo rato ----------
export const P69Mira: React.FC = () => {
  const k = kDe(396.77);
  return (
    <Sala cl={[mira(0, 1560, 650, 1.8), mira(k(401.8), 1660, 640, 1.7, { curva: "inout" })]} sp={{ luz: "noche", persiana: 1, tiza: 1 }}
      gente={[{ l: NELL, x: 1860, sent: 0, p: { tronco: -6, pI: 30, rI: 140, pD: 40, rD: 150, hD: 70, cD: 150 }, c: "triste", d: 1, mD: <Walkie s={0.8} /> }, { l: CAL, ruta: [{ f: 0, x: 1250 }, { f: k(399.5), x: 1250 }, { f: k(401.8), x: 1680 }], p: [{ f: 0, v: "brazosCruzados" }, { f: k(399), v: "parado" }], c: [{ f: 0, v: "triste" }, { f: k(399), v: "determinado" }], d: 1 }]}
      hud={<HudDia dia={1} />} />
  );
};

// ---------- 70 · teclea donde va el primer cuadro: la pantalla dice DAY ONE ----------
export const P70DayOne: React.FC = () => {
  const k = kDe(401.91);
  const f = useF();
  const letras = Math.floor(interpolate(f, [k(402.4), k(405.6)], [0, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Sala cl={[mira(0, 1760, 560, 2.0), mira(k(405.4), pistaX(8), 160, 2.4, { curva: "inout" }), mira(k(407.4), pistaX(8), 260, 1.7, { curva: "inout" })]} sp={{ luz: "noche", persiana: 1, tiza: 1, dia: f > k(405.7) ? "DAY ONE" : "DAY ONE".slice(0, letras) || undefined }}
      gente={[{ l: CAL, x: pistaX(8) - 60, p: Array.from({ length: 8 }).flatMap((_, i) => [{ f: i * 12, v: { hD: 60, cD: 60, hI: 55, cI: 65, tronco: 8 } }, { f: i * 12 + 6, v: { hD: 62, cD: 56, hI: 52, cI: 70, tronco: 8 } }]), c: "determinado", d: 1, luz: RIM.pantalla }]}
      hud={<HudDia dia={1} />} />
  );
};

// la pantalla de la pista 8 en grande (inserto): DAY ONE en naranja con brillo, entra con un rebote corto
const Pantallon: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  if (f < desde) return null;
  const u = interpolate(f, [desde, desde + 8, desde + 12], [0.6, 1.06, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 960, top: 300, transform: `translateX(-50%) scale(${u})`, width: 760, height: 300, borderRadius: 18, background: "#14100c", border: "10px solid #3a3530", boxShadow: "0 0 80px rgba(255,150,40,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 150, color: "#ffa23a", letterSpacing: 6, textShadow: "0 0 30px rgba(255,150,40,0.9)" }}>DAY ONE</div>
  );
};

// ---------- 71 · «para que lo vea desde cualquier lado» ----------
export const P71Lado: React.FC = () => {
  const k = kDe(408.3);
  return (
    <Sala cl={[mira(0, pistaX(8) - 40, 721, 1.45), mira(k(410.6), pistaX(8) - 60, 480, 1.25, { curva: "inout" })]} sp={{ luz: "noche", persiana: 1, tiza: 1, dia: "DAY ONE" }}
      gente={[{ l: CAL, x: pistaX(8) - 60, p: "parado", c: "triste", d: -1, luz: RIM.pantalla }, { l: NELL, x: 1860, sent: 0, p: "sentadoSuelo", c: "neutral", d: 1, mir: { x: 0, y: -1 }, mD: <Walkie s={0.8} /> }]}
      hud={<><HudDia dia={1} /><Dice quien="cal" t="So she can see it from anywhere." x={960} y={150} desde={k(408.5)} centro tam={64} /><Pantallon desde={k(409.4)} /></>} />
  );
};

// ---------- 72 · 3:10 AM, medio dormido detrás del mostrador ----------
export const P72Tres: React.FC = () => {
  const k = kDe(410.6);
  return (
    <Sala cl={[mira(0, -900, 560, 1.6), mira(k(414.8), -960, 600, 2.0, { curva: "inout" })]} snack sp={{ luz: "noche", tv: "apagada", dia: "DAY ONE" }}
      detras={[{ l: RAFI, x: -1000, sent: 70, p: { tronco: 30, pI: 88, rI: 88, pD: 92, rD: 92, hD: 40, cD: 130, cabeza: 30 }, c: [{ f: 0, v: "cansado" }, { f: k(413.5), v: "sorpresa" }], d: 1 }]}
      hud={<HudDia dia={1} hora="3:10 AM" />} />
  );
};

// ---------- 73 · toc, toc, toc: no en la persiana — detrás, en la cocina ----------
export const P73Toc: React.FC = () => {
  const k = kDe(414.75);
  const gs = [k(415), k(415.6), k(416.2)];
  return (
    <Sacude en={gs} amp={5}>
      <Sala cl={[mira(0, -1100, 663, 2.6), mira(k(416.6), -1100, 669, 2.4), mira(k(418.5), PP.puertaCocina + 200, 560, 1.6, { curva: "inout" })]} snack sp={{ luz: "noche", tv: "apagada" }}
        detras={[{ l: RAFI, x: -1100, p: "parado", c: "miedo", d: [{ f: 0, v: 1 }, { f: k(417), v: -1 }], mir: { x: -1, y: 0 } }]}
        hud={<><Dice quien="otro" t="knock." x={300} y={300} desde={k(415)} tam={70} /><Dice quien="otro" t="knock." x={460} y={400} desde={k(415.6)} tam={70} /><Dice quien="otro" t="knock." x={620} y={500} desde={k(416.2)} tam={70} /><HudDia dia={1} hora="3:10 AM" /></>} />
    </Sacude>
  );
};

// ---------- 74 · camino hacia el ruido a oscuras: cuanto más cerca, más frío ----------
export const P74Frio: React.FC = () => {
  const k = kDe(419.95);
  return (
    <Cocina cl={[mira(0, 640, 640, 1.8), mira(k(426.5), CP.puerta - 400, 640, 1.9, { curva: "lineal" })]} sp={{ luz: "noche", golpes: [k(424), k(424.6), k(425.2)] }}
      gente={[{ l: RAFI, ruta: [{ f: 0, x: 500 }, { f: k(426.5), x: CP.puerta - 400, curva: "lineal" }], c: "miedo", mD: <Linterna />, luz: RIM.linterna, d: 1 }]}
      hud={<><Dice quien="rafi" t="colder." x={1300} y={300} desde={k(423)} tam={70} /><Dice quien="rafi" t="the walk-in freezer." x={1100} y={420} desde={k(425.4)} tam={64} /></>} />
  );
};

// ---------- 75 · por ley: una perilla roja del lado de adentro ----------
export const P75Ley: React.FC = () => {
  const k = kDe(427.13);
  return (
    <EnFreezer cl={[mira(0, 1060, 420, 0.95), mira(k(433.4), FP.perilla + 80, 600, 2.2, { curva: "inout" })]} sp={{ vacio: 0 }}
      gente={[{ l: GUS, x: FP.perilla + 280, p: "parado", c: "cansado", d: -1, mir: { x: -1, y: 0 }, luz: RIM.frio }]}
      hud={<><Pildora texto="SAFETY RELEASE · BY LAW" x={960} y={140} desde={k(430.5)} /><Rotulo t="push it → the door opens" x={1250} y={740} desde={k(433.8)} flecha="izq" color={ROJO} /></>} />
  );
};

// ---------- 76 · cualquiera vivo puede apretar esa perilla ----------
export const P76Vivo: React.FC = () => {
  const k = kDe(433.49);
  return (
    <EnFreezer cl={[mira(0, FP.perilla, 600, 2.8), mira(k(439.6), FP.perilla + 60, 620, 2.9, { curva: "lineal" })]} sp={{ vacio: 0 }}
      gente={[{ l: GUS, x: FP.perilla + 280, p: "parado", c: "cansado", d: -1, mir: { x: -1, y: 0 }, luz: RIM.frio }]}
      hud={<Dice quien="rafi" t="anyone alive can push that knob." x={960} y={860} desde={k(437.7)} centro tam={66} />} />
  );
};

// ---------- 77 · lo que golpeaba no podía ----------
export const P77NoPodia: React.FC = () => {
  const k = kDe(439.71);
  return (
    <Sacude en={[8, 18, 28]} amp={6}>
      <Cocina cl={[mira(0, CP.puerta - 200, 620, 1.6), mira(k(441.1), CP.puerta - 200, 630, 1.8, { curva: "lineal" })]} sp={{ luz: "noche", golpes: [8, 18, 28] }}
        gente={[{ l: RAFI, x: CP.puerta - 420, c: "miedo", mD: <Linterna />, luz: RIM.linterna, d: 1, p: "encogerse" }]}
        hud={<Dice quien="otro" t="KNOCK.  KNOCK.  KNOCK." x={1300} y={200} desde={8} tam={64} rot={-4} />} />
    </Sacude>
  );
};

// ---------- 78 · recuerdo, 8:10: le pedí a Gus una caja de papas del freezer ----------
export const P78Gus: React.FC = () => {
  const k = kDe(441.1);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, 900, 540, 1.1), mira(k(446.8), 1300, 736, 1.3, { curva: "inout" }), mira(k(450.2), CP.puerta - 100, 540, 1.2, { curva: "inout" })]} sp={{ luz: "prendida", puerta: (ff: number) => interpolate(ff, [k(449.5), k(450.5)], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
        gente={[
          { l: RAFI, x: 700, p: [{ f: 0, v: "hablar" }, { f: k(448), v: "señalar" }], c: "feliz", habla: [[k(446.4), k(449.5)]], d: 1 },
          { l: GUS, ruta: [{ f: 0, x: 1000 }, { f: k(447), x: 1000 }, { f: k(450.8), x: CP.puerta, curva: "lineal" }], p: [{ f: 0, v: "brazosCruzados" }, { f: k(447.2), v: "saludar" }, { f: k(447.8), v: "parado" }], c: [{ f: 0, v: "feliz" }, { f: k(447.8), v: "cansado" }], d: [{ f: 0, v: -1 }, { f: k(447.8), v: 1 }] },
        ]} />
      <Recuerdo />
      <HudDia dia={1} desde={9999} hora="8:10 PM" />
      <Rotulo t="GUS · night manager" x={240} y={170} desde={k(447.3)} flecha="der" />
      <Dice quien="rafi" t="Gus, grab me a case of fries?" x={960} y={300} centro desde={k(448)} tam={60} />
    </AbsoluteFill>
  );
};

// ---------- 79 · nunca lo vi salir. Y ese fue el día uno ----------
export const P79Uno: React.FC = () => {
  const k = kDe(451.21);
  return (
    <AbsoluteFill>
      <Cocina cl={[mira(0, CP.puerta, 696, 1.8), mira(k(455.5), CP.puerta, 726, 1.4, { curva: "inout" })]} sp={{ luz: "noche", golpes: [k(453.9), k(454.5)] }} />
      <Velo color="#000" o={0.25} />
      <Dice quien="rafi" t="I never saw him come out." x={960} y={140} desde={k(451.3)} centro tam={70} />
      <Dice quien="nell" t="DAY ONE" x={960} y={760} desde={k(453.8)} centro tam={150} rot={-2} />
      <HudDia dia={1} />
    </AbsoluteFill>
  );
};

// ---------- 80 · pantalla final: el Ep. 2 (tarjeta a la izquierda; la puerta del freezer golpea y Rafi retrocede a la derecha) ----------
const GOLPES = [40, 52, 64, 160, 172, 184];
const Toc: React.FC = () => {
  const f = useF();
  return (
    <>
      {GOLPES.map((g) => {
        const u = interpolate(f, [g, g + 4, g + 14], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return u > 0 ? <div key={g} style={{ position: "absolute", left: 900, top: 300, fontFamily: F_HUD, fontWeight: 800, fontSize: 90 + 30 * u, color: "#f4efe4", opacity: u, transform: `rotate(${g % 3 === 0 ? -6 : 5}deg)`, textShadow: "0 0 24px rgba(159,196,255,0.7)" }}>KNOCK</div> : null;
      })}
    </>
  );
};
export const P80Final: React.FC = () => (
  <Final ep={2} lado titulo={"Someone Is Knocking\nFrom Inside The Freezer"} encima={<Toc />} fondo={<Cocina cl={[mira(0, CP.puerta - 26, 715, 1.52), mira(300, CP.puerta + 40, 705, 1.6, { curva: "inout" })]} sp={{ luz: "noche", golpes: GOLPES }}
    gente={[{ l: RAFI, ruta: [{ f: 0, x: CP.puerta + 420 }, { f: 60, x: CP.puerta + 470, curva: "out" }, { f: 160, x: CP.puerta + 470 }, { f: 200, x: CP.puerta + 490, curva: "out" }], p: "encogerse", c: "miedo", d: -1, mI: <Linterna />, luz: RIM.linterna }]} />} />
);
