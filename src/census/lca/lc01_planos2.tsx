// lc01 · planos 30-57 (173,9 → 433,9 s): el encuentro en el lobby, POPULATION 2, la comida y el agua, lo que mata,
// las reglas de June, la casa de ladrillo, la primera nevada, −30 °F, el día 41 en el puente y el apagón.
// Vuelta 2 (ojo del director): cuerpo entero actuando con IK (PjX), componentes que llevan cada idea (lc01_planos2_comp).
import React from "react";
import { AbsoluteFill, interpolate, Sequence } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { GranNumero, EtiquetaFlotante, Pildora, RelojDia, Temporizador, TextoMano, F_HUD, F_MANO } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { Carrito, Lata } from "../../anikit/props";
import { posRuta, Paso } from "../../anikit/actor";
import { SUPER_PISO } from "../../anikit/sets/super";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_INV, PAL, ROJO_CENSO, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { FRIO, F_MONO } from "../hud";
import { Panorama } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { PUENTE_PISO } from "../mundo/puente";
import { Barrio, BARRIO_PISO, Living } from "../mundo/casa";
import { Lobby, LOBBY_DESCANSO, LOBBY_PISO } from "../mundo/hospital";
import { Lakewood } from "../lcb/lakewood";
import { CuadernoGrande, CuadernoMano, kDe, Matafuego, Vela } from "./base";
import {
  anchoLin, Escalera, Escarcha, HeladeraJune, HumoVisible, Icono, ikClaves, ikEscribir,
  io, lerp, Lin, Lineas, LX, listaY, ManoLapiz, Marcador, Olla, Pin, Pistola, PjX, regla, REGLAS_HECHAS, tw, Vaso2, Vineta,
} from "./lc01_planos2_comp";
import { CartelColgante, CartelER, CorteDedo, Dolor, Ecuacion2, LataGrande, ManoLapizB, MatafuegoColgado, Mejilla, PizarraGrande, Silla, SoporteMatafuego, TxtCartel } from "./v3c_v3";
import { CajaHerr, CartelTienda, Colchon, Desfase, durDe, EscarchaEsquina, Frasco, GloboA, LineaRota, Llave, Picto2, PuenteV3, PuertaCasa, Rotulo3, SacoDormir, Tablero, Tocon, Venda } from "./v3d_v3";
import { spring as sprV3, useVideoConfig as vcV3 } from "remotion";
import { CanoEstufa, fundidoLuz, Generador, OlaApagon, PildoraNext, Vaho } from "./v4d_v4";
import { CartonLeche, ContadorPlaca, FreezerV4, PanMoho, PanRackV4, PasamanosCorto, Suspiro, SuperV4, TagTimer, tapaPunta } from "./v4c_v4";
import { NeonMuela } from "./v4d_v4";
import { Bidon, CuelloCampera, DisplayGalones, GraficoFrioV5, HumoV5, Num3230V5, SubTomas } from "./v5f_v5";
import { BarrasVida, CasillerosV5, LagoV5, LenaLiv as LenaV5e, ReaccionFx as ReaccionV5e, Tomas as TomasV5e } from "./v5e_v5";
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// estado del living en otoño (sin nieve afuera, sin mantas, sin la nota gigante del set)
const LIV_OTONO = { hora: "dia", luces: 0, fuego: 0.6, lena: 0.15, latas: 0.6, mantas: false, plastico: false, reglas: 0, nieveAfuera: 0 };
const LIV_INV = { hora: "invierno", luces: 0, fuego: 1, lena: 0.5, latas: 1, mantas: true, plastico: true, reglas: 0, nieveAfuera: 1 };
const P = 900;
const Svg: React.FC<{ children?: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>{children}</svg>;

// ---- trazos de mano (insertos): tramos que se dibujan y la punta que viaja entre ellos ----
type Pt = [number, number];
const trazo = (pts: Pt[], u: number) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const L = seg.reduce((a, b) => a + b, 0);
  let r = Math.max(0, Math.min(1, u)) * L;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (r >= seg[i]) { out.push(pts[i + 1]); r -= seg[i]; continue; }
    const t = r / seg[i];
    out.push([lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]);
    break;
  }
  return { d: "M" + out.map((p) => p.join(",")).join(" L"), tip: out[out.length - 1] };
};
type Tramo = { a: number; b: number; tip: (u: number) => Pt };
const tramoLin = (l: Lin): Tramo => ({ a: l.desde, b: l.hasta, tip: (u) => [l.x + anchoLin(l) * u, l.y - l.tam * 0.3] });
const tramoPts = (pts: Pt[], a: number, b: number): Tramo => ({ a, b, tip: (u) => trazo(pts, u).tip });
// punta de la mano: dentro de un tramo sigue la línea (con temblor de escritura); entre tramos viaja levantada
const puntaMano = (ts: Tramo[], f: number, entra: Pt, sale: Pt): Pt => {
  const ent = ts[0], ult = ts[ts.length - 1];
  if (f < ent.a) { const t = io(Math.max(0, Math.min(1, (f - (ent.a - 24)) / 24))); const p = ent.tip(0); return [lerp(entra[0], p[0], t), lerp(entra[1], p[1], t)]; }
  for (let i = 0; i < ts.length; i++) {
    const s = ts[i];
    if (f <= s.b) {
      if (f >= s.a) { const p = s.tip((f - s.a) / Math.max(1, s.b - s.a)); return [p[0], p[1] + Math.sin(f * 2.1) * 3]; }
      const pr = ts[i - 1];
      const t = io((f - pr.b) / Math.max(1, s.a - pr.b));
      const p0 = pr.tip(1), p1 = s.tip(0);
      return [lerp(p0[0], p1[0], t), lerp(p0[1], p1[1], t) - Math.sin(Math.PI * t) * 30];
    }
  }
  const t = io(Math.max(0, Math.min(1, (f - ult.b) / 20)));
  const p = ult.tip(1);
  return [lerp(p[0], sale[0], t), lerp(p[1], sale[1], t)];
};

// el cuaderno del censo: el 1 tachado y el 2 dibujado a mano (P33 y P56)
const TACHA_1: Pt[] = [[1236, 612], [1356, 500]];
const DOS: Pt[] = [[1400, 524], [1414, 500], [1442, 486], [1472, 494], [1490, 520], [1480, 552], [1452, 580], [1400, 628], [1500, 628]];
const PaginaCenso: React.FC<{ uT: number; uD: number }> = ({ uT, uD }) => (
  <g>
    {uT > 0 && <path d={trazo(TACHA_1, uT).d} stroke="#d8382c" strokeWidth={13} strokeLinecap="round" fill="none" />}
    {uD > 0 && <path d={trazo(DOS, uD).d} stroke="#1d2a4a" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
  </g>
);


// ======================================================================================================
// 30 · Theo entra al lobby (medio que lo acompaña, frena en seco con las manos arriba) → CORTE a June arriba de la escalera
export const P30Lobby: React.FC = () => {
  const k = kDe(173.93);
  const D = LOBBY_DESCANSO;
  const JX = D.x + 40;
  const C = k(176.2);
  // v5: Theo entra caminando GRANDE, FRENA en seco en «lobby» (174,95): manos arriba + rayitas de sorpresa, la cámara le empuja
  //     a la cara (inout 16 cuadros) y la sorpresa pasa a miedo mirando arriba → fundido corto (6) a June en la escalera
  const TS = k(174.95);
  const tomaA = (
    <Escena Set={Lobby} pal={PAL} seed={30} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(0, 1400, 650, 1.6), mira(TS, 1450, 650, 1.6, { curva: "inout" }), mira(TS + 16, 1470, 620, 1.9, { curva: "inout" }), mira(C + 6, 1474, 618, 1.95, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO} ruta={[{ f: 0, x: 1150, y: LOBBY_PISO }, { f: TS, x: 1440 }, { f: TS + 8, x: 1424 }]} dir={[{ f: 0, v: 1 }]}
          caras={[{ f: 0, v: "duda" }, { f: TS - 4, v: "sorpresa" }, { f: k(175.75), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: TS - 6, v: { x: 1, y: -0.85 } }, { f: k(175.75), v: { x: 1, y: -0.6 } }]}
          brz={[{ f: TS - 3, v: { hD: 80, cD: 70, hI: 66, cI: 82, tronco: -14, cabeza: -14 }, d: 6 }, { f: k(175.7), v: { hD: 40, cD: 120, hI: 50, cI: 110, tronco: -6, cabeza: -10 }, d: 12 }]} luz={BORDE_FRIO} />
        <ReaccionV5e tipo="sorpresa" f0={TS - 2} x={1440} y={LOBBY_PISO - 420} />
      </>} />
  );
  // CORTE a June arriba de la escalera: el pasamanos termina en un poste ANTES de ella (no le cruza las rodillas);
  // 3 claves: matafuego colgando (miedo) → da un paso atrás y lo sube al pecho → lo levanta amenazante (enojo)
  const sube1 = k(176.95), sube2 = k(177.65);
  const pD = ikClaves([{ f: 0, x: JX - 20, y: D.y - 150, w: 0 }, { f: sube1, x: JX - 20, y: D.y - 150, w: 0 }, { f: sube1 + 10, x: JX - 50, y: D.y - 200, w: 1 }, { f: sube2, x: JX - 50, y: D.y - 200 }, { f: sube2 + 10, x: JX - 70, y: D.y - 252 }, { f: k(178.2), x: JX - 70, y: D.y - 252 }, { f: k(178.2) + 8, x: JX - 120, y: D.y - 222 }, { f: k(178.2) + 18, x: JX - 80, y: D.y - 246 }]);
  const pI = ikClaves([{ f: sube1, x: JX - 30, y: D.y - 170, w: 0 }, { f: sube1 + 10, x: JX - 36, y: D.y - 180, w: 1 }, { f: sube2, x: JX - 36, y: D.y - 180 }, { f: sube2 + 10, x: JX - 52, y: D.y - 226 }]);
  return <TomasV5e cortes={[C]} tomas={[tomaA,
    <Escena key="b" Set={Lobby} pal={PAL} seed={130} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(C, D.x - 60, D.y - 175, 1.75), mira(k(178.85), D.x - 40, D.y - 180, 1.82, { curva: "inout" })]}
      medio={<>
        <PasamanosCorto D={D} />
        <SoporteMatafuego x={D.x + 300} y={D.y - 130} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX + 20, y: D.y }, { f: sube1, x: JX + 20 }, { f: sube1 + 12, x: JX + 70 }]} dir={[{ f: 0, v: -1 }]} ikD={pD} ikI={pI}
          objD={(ff) => (ff < sube1 + 4 ? { el: <MatafuegoColgado />, rot: 0 } : { el: <Matafuego />, rot: 0 })}
          caras={[{ f: 0, v: "miedo" }, { f: sube1, v: "sorpresa" }, { f: sube2, v: "enojo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: sube1, v: { x: 1, y: 0.4 } }, { f: sube2, v: { x: 1, y: 0.75 } }, { f: k(178.3), v: { x: 1, y: 0.55 } }]}
          brz={[{ f: sube1, v: { tronco: -10, cabeza: -6 }, d: 8 }, { f: sube2, v: { tronco: 6, cabeza: 8 }, d: 8 }, { f: k(178.2), v: { tronco: 14, cabeza: 10 }, d: 8 }]} luz={BORDE_FRIO} seed={2} />
      </>} />]} />;
};

// 31 · la pizarra junto a la puerta (texto que entra en la pizarra); Theo lee, retrocede, se toca la frente, niega
export const P31Pizarra: React.FC = () => {
  const f = useF();
  const k = kDe(178.85);
  const s1 = tw(f, k(181.6), k(182.0), 0, 1), s2 = tw(f, k(182.9), k(183.3), 0, 1);
  const TX = 905;
  return (
    <Escena Set={Lobby} pal={PAL} seed={31} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(0, 770, 610, 1.55), mira(k(181.4), 790, 610, 1.58, { curva: "inout" }), mira(k(182.0), 780, 600, 1.72, { curva: "inout" })]}
      medio={<>
        <PizarraGrande x={440} y={350} w={400} h={250} l1="DON'T COME CLOSER." l2="ARE YOU SICK?" s1={s1} s2={s2} />
        <PjX look={THEO} ruta={[{ f: 0, x: TX, y: LOBBY_PISO }, { f: k(181.7), x: TX }, { f: k(182.15), x: TX + 50 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { tronco: 6, cabeza: -10, hD: 20, cD: 40 } }, { f: k(179.9), v: "pensar" }, { f: k(180.9), v: { tronco: 12, cabeza: -6, hD: 25, cD: 150 } }, { f: k(181.6), v: "parado" }]}
          ikD={ikClaves([{ f: k(182.9), x: TX + 50 - 30, y: LOBBY_PISO - 280, w: 0 }, { f: k(183.1), x: TX + 50 - 30, y: LOBBY_PISO - 280, w: 1 }, { f: k(183.5), x: TX + 50 - 30, y: LOBBY_PISO - 280, w: 1 }, { f: k(183.8), x: TX + 30, y: LOBBY_PISO - 150, w: 0 }])}
          caras={[{ f: 0, v: "duda" }, { f: k(180.4), v: "neutral" }, { f: k(181.7), v: "miedo" }, { f: k(183.0), v: "duda" }, { f: k(183.5), v: "triste" }]}
          miradas={[{ f: 0, v: { x: -1, y: -0.9 } }, { f: k(180.0), v: { x: -1, y: -0.8 } }, { f: k(180.9), v: { x: -1, y: -0.7 } }, { f: k(181.7), v: { x: -1, y: -0.75 } }, { f: k(182.6), v: { x: -1, y: -0.85 } }, { f: k(183.5), v: { x: 1, y: 0.1 } }]}
          brz={[{ f: 0, v: { cabeza: -16 }, d: 10 }, { f: k(181.7), v: { hD: 120, cD: 40, hI: 110, cI: 40, tronco: -10, cabeza: -18 }, d: 6 }, { f: k(182.6), v: { hD: 30, cD: 30, hI: 10, cI: 15, tronco: 0, cabeza: -14 }, d: 10 }, { f: k(183.4), v: { cabeza: 2 }, d: 8 }]}
          giros={[{ f: k(183.5), v: 0 }, { f: k(183.62), v: -0.5 }, { f: k(183.74), v: 0.5 }, { f: k(183.86), v: -0.4 }, { f: k(183.97), v: 0 }]} luz={BORDE_FRIO} />
      </>} />
  );
};

// 32 · «He's not.» Theo niega con las palmas abiertas → CORTE a June: baja el extintor, cuelga de la manija, suelta el aire
export const P32Baja: React.FC = () => {
  const k = kDe(183.97);
  const D = LOBBY_DESCANSO;
  const JX = D.x + 40;
  const C = k(184.95);
  const TX = 1426;
  const tomaA = (
    <Escena Set={Lobby} pal={PAL} seed={32} setProps={{ luces: 1, afuera: "noche", pizarra: "" }} claves={[mira(0, 1640, 660, 1.85), mira(C, 1630, 650, 1.9, { curva: "inout" })]}
      medio={<PjX look={THEO} ruta={[{ f: 0, x: TX, y: LOBBY_PISO }]} caras={[{ f: 0, v: "triste" }, { f: 12, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: -0.7 } }]}
        brz={[{ f: 0, v: { hD: 30, cD: 30, hI: 10, cI: 15 } }, { f: 3, v: { hD: 50, cD: 75, hI: 45, cI: 75, tronco: -4 }, d: 10 }]}
        giros={[{ f: 0, v: 0 }, { f: 5, v: 0.5 }, { f: 11, v: -0.5 }, { f: 17, v: 0.45 }, { f: 23, v: -0.3 }, { f: 29, v: 0 }]} luz={BORDE_FRIO} />} />
  );
  // v5: June baja el matafuego, se ENDEREZA, hombros abajo, ojos entornados y suelta el aire (bocanada visible) → sonríe a Theo
  const baja = k(185.45);
  return <TomasV5e cortes={[C]} tomas={[tomaA,
    <Escena key="b" Set={Lobby} pal={PAL} seed={132} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(C, JX - 110, D.y - 165, 1.9), mira(k(186.77), JX - 110, D.y - 160, 1.95, { curva: "inout" })]}
      medio={<>
        <PasamanosCorto D={D} />
        <SoporteMatafuego x={D.x + 300} y={D.y - 130} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: D.y }]} dir={[{ f: 0, v: -1 }]}
          objD={(ff) => (ff < baja ? { el: <Matafuego />, rot: 0 } : { el: <MatafuegoColgado />, rot: 0 })}
          ikD={ikClaves([{ f: 0, x: JX - 70, y: D.y - 246 }, { f: k(185.1), x: JX - 70, y: D.y - 246 }, { f: k(185.8), x: JX - 18, y: D.y - 150 }])}
          ikI={ikClaves([{ f: 0, x: JX - 52, y: D.y - 222 }, { f: k(185.1), x: JX - 52, y: D.y - 222 }, { f: k(185.45), x: JX - 30, y: D.y - 170, w: 0 }])}
          caras={[{ f: 0, v: "enojo" }, { f: k(185.15), v: "duda" }, { f: k(185.55), v: "cansado" }, { f: k(186.05), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: k(185.3), v: { x: 1, y: 0.95 } }, { f: k(185.6), v: { x: 1, y: 0.2 } }, { f: k(186.05), v: { x: 1, y: 0.55 } }]}
          brz={[{ f: k(185.2), v: { tronco: 12, cabeza: 14, bajar: 4 }, d: 10 }, { f: k(185.55), v: { tronco: -4, cabeza: -12, bajar: 10 }, d: 12 }, { f: k(186.05), v: { tronco: 2, cabeza: 4, bajar: 8 }, d: 14 }]} luz={BORDE_FRIO} seed={2} />
        <Suspiro x={JX - 34} y={D.y - 268} f0={k(185.6)} dir={-1} dur={40} color="#7f93ab" />
      </>} />]} />;
};

// 33 · el cuaderno: la mano de Theo (desde abajo a la derecha, fuera de cuadro) tacha el 1 y escribe el 2; después los dos en el lobby
export const P33Dos: React.FC = () => {
  const f = useF();
  const k = kDe(186.77);
  // v5: la mano NUNCA se queda clavada: entra, tacha el 1 en «changes», se aparta apenas (el 1 tachado se lee), vuelve y
  //     escribe el 2 en «Two» (189,2-189,85), se retira y el 2 queda 0,6 s a la vista con el aro → fundido corto (6) al lobby;
  //     en el lobby Theo sostiene el cuaderno a la altura del PECHO (no tapa la cara). Empuje lento del inserto (1 → 1,06).
  const S = k(190.45);
  const uT = tw(f, k(188.3), k(188.75), 0, 1, (t) => t), uD = tw(f, k(189.2), k(189.85), 0, 1, (t) => t);
  const tip = puntaMano([tramoPts(TACHA_1, k(188.3), k(188.75)), tramoPts([[1462, 596], [1474, 606]], k(188.95), k(189.02)), tramoPts(DOS, k(189.2), k(189.85))], f, [2300, 1500], [2350, 1450]);
  const g = Math.max(0, 1 - Math.abs(f - k(190.0)) / 9);
  const z = interpolate(f, [0, S + 6], [1, 1.06], CL);
  const inserto = (
    <AbsoluteFill style={{ transform: `scale(${z})` }}>
      <CuadernoGrande renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }]} zoom={[0, 1, 1]} />
      <Svg><g transform="rotate(-3 960 540)">
        <PaginaCenso uT={uT} uD={uD} />
        {g > 0 && <circle cx={1448} cy={556} r={90 + 60 * (1 - g)} fill="none" stroke={AMBAR} strokeWidth={8} opacity={g} />}
        <ManoLapizB x={tip[0]} y={tip[1]} manga="#c8582b" giro={72} />
      </g></Svg>
    </AbsoluteFill>
  );
  const lobby = (
    <Escena key="b" Set={Lobby} pal={PAL} seed={33} setProps={{ luces: 1, afuera: "noche", pizarra: "" }} claves={[mira(S, 1330, 640, 1.6), mira(k(191.73), 1336, 640, 1.63, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO} ruta={[{ f: 0, x: 1210, y: LOBBY_PISO }]} objD={{ el: <CuadernoMano abierto />, rot: 0 }}
          ikD={ikClaves([{ f: S, x: 1268, y: LOBBY_PISO - 190 }, { f: k(190.9), x: 1268, y: LOBBY_PISO - 190 }, { f: k(191.25), x: 1296, y: LOBBY_PISO - 205 }])}
          caras={[{ f: 0, v: "feliz" }, { f: k(190.9), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(190.85), v: { x: 1, y: 0 } }]} brz={[{ f: k(190.8), v: { cabeza: -6 }, d: 10 }]} luz={BORDE_FRIO} />
        <PjX look={JUNE} ruta={[{ f: 0, x: 1450, y: LOBBY_PISO }]} dir={[{ f: 0, v: -1 }]} objD={{ el: <MatafuegoColgado />, rot: 0 }} ikD={() => ({ x: 1438, y: LOBBY_PISO - 150 })}
          ikI={ikClaves([{ f: k(190.8), x: 1410, y: LOBBY_PISO - 200, w: 0 }, { f: k(191.1), x: 1410, y: LOBBY_PISO - 230, w: 1 }])}
          caras={[{ f: 0, v: "neutral" }, { f: k(190.8), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(190.7), v: { x: 1, y: 0.1 } }]} brz={[{ f: k(190.7), v: { cabeza: -8 } }]} luz={BORDE_FRIO} seed={2} />
      </>} />
  );
  return <TomasV5e cortes={[S]} tomas={[inserto, lobby]} />;
};

// 34 · las cuentas: comida primero. Entran al súper; Theo agarra el carrito y lo empuja (IK); el cartel colgante del pasillo
//      cae con «FOOD FIRST» y se da vuelta en «NOT THE PROBLEM» (June lo señala). Zoom ≥ 1,2 todo el plano.
export const P34Super: React.FC = () => {
  const f = useF();
  const k = kDe(191.73);
  const PS = SUPER_PISO;
  const rT: Paso[] = [{ f: 0, x: -80, y: PS }, { f: k(193.6), x: 330 }, { f: k(197.0), x: 880 }];
  const tx = posRuta(rT, f).x;
  const agarra = f >= k(193.8);
  const cx = agarra ? Math.max(560, tx + 246) : 560;
  const manija = { x: cx - 186, y: PS - 222 };
  const ik = (dy: number) => (ff: number) => (ff < k(193.5) ? null : { x: manija.x, y: manija.y + dy, w: tw(ff, k(193.5), k(193.8), 0, 1) });
  return (
    <AbsoluteFill>
      <Escena Set={SuperV4} pal={PAL} seed={34} setProps={{}} zLejos={1}
        claves={[mira(0, 500, 640, 1.22), mira(k(193.6), 520, 640, 1.22), mira(k(197.0), 1010, 640, 1.22, { curva: "inout" }), mira(k(201.3), 1060, 640, 1.28, { curva: "inout" })]}
        medio={<>
          <CartelColgante x={760} y={330} w={440} h={124} desde={k(193.85)} voltea={k(198.3)} techo={-260}
            a={<><g transform="translate(-160,62) scale(0.8)"><Icono n="comida" /></g><TxtCartel t="FOOD" y={56} x={-90} ancla="start" tam={44} /><TxtCartel t="FIRST" y={104} x={-90} ancla="start" tam={44} color="#ffe08a" /></>}
            b={<><TxtCartel t="FOOD IS" y={52} tam={36} /><TxtCartel t="NOT THE PROBLEM" y={100} tam={38} color="#ffe08a" /><g transform="translate(196,6)"><circle r={26} fill="#3aa86a" stroke="#f6f1e2" strokeWidth={4} /><path d="M-12,0 l8,9 l15,-17" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" /></g></>} />
          <Carrito x={cx} y={PS} dir={1} lleno={0} rueda={cx * 1.2} />
          <PjX look={THEO} ruta={rT} ikD={ik(0)} ikI={ik(4)} caras={[{ f: 0, v: "duda" }, { f: k(192.15), v: "sorpresa" }, { f: k(193.9), v: "determinado" }, { f: k(196.9), v: "sorpresa" }, { f: k(198.5), v: "feliz" }]}
            brz={[{ f: k(192.15), v: { tronco: -8, cabeza: -12 }, d: 8 }, { f: k(193.2), v: { tronco: 0, cabeza: 0 }, d: 10 }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(192.15), v: { x: 1, y: -0.85 } }, { f: k(194.0), v: { x: 1, y: -0.7 } }, { f: k(195.0), v: { x: 1, y: 0 } }, { f: k(198.4), v: { x: -1, y: -0.6 } }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: -360, y: PS }, { f: k(196.0), x: 1330 }]} dir={[{ f: 0, v: 1 }, { f: k(196.8), v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(196.9), v: "celebrar" }, { f: k(198.3), v: { hD: 150, cD: 10, tronco: -4 } }, { f: k(200.3), v: "manosCintura" }]} caras={[{ f: 0, v: "neutral" }, { f: k(196.8), v: "risa" }, { f: k(198.4), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(198.3), v: { x: 1, y: -0.8 } }, { f: k(200.3), v: { x: 1, y: 0 } }]} seed={2} />
        </>} />
    </AbsoluteFill>
  );
};

// 35 · la góndola, en 3 tomas con CORTE seco:
//   A (201,4-205,0) dolly por el pasillo: Theo empuja el carrito, June mira las góndolas; el cartel colgante cuenta los productos
//   B (205,0-210,6) medio de los dos: Theo carga arroz, porotos, pasta, maní, carne (cada uno en la mano); June lee una lata y la tira;
//                   la lista colgante tilda cada producto
//   C (210,6-215,1) June levanta una lata: «BEST BY» rueda 2026 → 2031 (seguro por años); Theo admira el carrito lleno
export const P35Gondola: React.FC = () => {
  const f = useF();
  const k = kDe(201.37);
  const PS = SUPER_PISO;
  const CA = k(205.0), CB = k(210.6);
  const items: [string, string, number][] = [["arroz", "RICE", 206.9], ["porotos", "BEANS", 207.6], ["pasta", "PASTA", 208.3], ["mani", "P. BUTTER", 209.1], ["carne", "MEAT", 210.3]];
  // A · dolly por el pasillo (sin cambios)
  const rTA: Paso[] = [{ f: 0, x: 640, y: PS }, { f: CA + 6, x: 1080 + 440 * 6 / Math.max(1, CA) }];
  const txA = posRuta(rTA, f).x;
  const n = Math.round(interpolate(f, [k(202.1), k(204.4)], [0, 38000], { ...CL, easing: (t) => 1 - Math.pow(1 - t, 3) }));
  const tomaA = (
    <Escena Set={SuperV4} pal={PAL} seed={35} setProps={{}} zLejos={1} claves={[mira(0, 1080, 630, 1.25), mira(CA, 1330, 630, 1.25, { curva: "inout" })]}
      medio={<>
        <CartelColgante x={1500} y={330} w={440} h={124} desde={k(201.9)} techo={-260}
          a={<><TxtCartel t="ITEMS IN ONE STORE" y={42} tam={28} /><text x={0} y={104} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={56} fill="#ffe08a">{n.toLocaleString("en-US")}</text></>} />
        <Carrito x={txA + 246} y={PS} dir={1} lleno={0.1} rueda={txA * 1.2} />
        <PjX look={THEO} ruta={rTA} ikD={() => ({ x: txA + 60, y: PS - 222 })} ikI={() => ({ x: txA + 60, y: PS - 218 })} caras={[{ f: 0, v: "determinado" }, { f: k(203.4), v: "sorpresa" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(202.3), v: { x: 1, y: -0.7 } }, { f: k(203.6), v: { x: -1, y: -0.3 } }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: 1200, y: PS }, { f: CA + 6, x: 1600 + 400 * 6 / Math.max(1, CA) }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(203.2), v: { hD: 95, cD: 0, tronco: 3 } }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: k(203.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: -1, y: -0.5 } }, { f: k(202.4), v: { x: 1, y: -0.6 } }, { f: k(203.2), v: { x: 1, y: -0.2 } }]} seed={2} />
      </>} />
  );
  // B+C · UNA sola toma: medio de los dos cargando (la lista colgante tilda cada producto) y, sin corte, la cámara EMPUJA
  //        (inout 18 cuadros) al primer plano de June con la lata BEST BY que entra con resorte y rueda 2026 → 2031
  const TX = 1150, CX = 1340, JX = 1580;
  const cl: { f: number; x: number; y: number; w?: number }[] = [{ f: CA, x: TX - 40, y: PS - 300, w: 1 }];
  items.forEach(([, , t], i) => { cl.push({ f: k(t) - 16, x: TX - 46, y: PS - 300 - (i % 2) * 90 }); cl.push({ f: k(t) - 2, x: CX - 70, y: PS - 196 }); });
  cl.push({ f: k(210.75), x: CX - 60, y: PS - 230, w: 0 });
  const enMano = (ff: number) => { const it = items.find(([, , t]) => ff > k(t) - 15 && ff < k(t) - 1); return it ? { el: <g transform="translate(0,-26) scale(0.62)"><Icono n={it[0]} /></g>, rot: 0 } : undefined; };
  const cargadas = items.filter(([, , t]) => f >= k(t)).length;
  const jIk = ikClaves([{ f: CA + 4, x: JX + 70, y: PS - 330 }, { f: k(205.7), x: JX - 70, y: PS - 262 }, { f: k(207.3), x: JX - 70, y: PS - 262 }, { f: k(207.6), x: CX + 60, y: PS - 200 },
    { f: k(208.2), x: JX + 70, y: PS - 380 }, { f: k(208.7), x: JX - 70, y: PS - 262 }, { f: k(209.8), x: JX - 70, y: PS - 262 }, { f: k(210.1), x: CX + 70, y: PS - 200 },
    { f: k(210.6), x: JX + 80, y: PS - 330 }, { f: k(210.95), x: JX + 80, y: PS - 330 }, { f: k(211.45), x: JX - 80, y: PS - 236 }]);
  const anio = interpolate(f, [k(211.9), k(213.7)], [2026, 2031], { ...CL, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const sl = f < k(210.8) ? 0 : sprV3({ frame: f - k(210.8), fps: 30, config: { damping: 11, stiffness: 150 } });
  const jLata = (ff: number) => {
    if ((ff > CA + 6 && ff < k(207.55)) || (ff > k(208.25) && ff < k(210.05))) return { el: <Lata color={ff < k(208) ? "#c0352c" : "#5aa0d8"} />, rot: 0 };
    if (ff >= k(210.8)) return { el: <g transform={`scale(${-(0.55 + 0.45 * sl)},${0.55 + 0.45 * sl})`}><LataGrande anio={anio} s={1.35} /></g>, rot: 0 };
    return undefined;
  };
  const tomaB = (
    <Escena key="b" Set={SuperV4} pal={PAL} seed={235} setProps={{}} zLejos={1}
      claves={[mira(CA, 1330, 590, 1.4), mira(CB, 1340, 590, 1.42, { curva: "inout" }), mira(CB + 18, 1440, 630, 1.92, { curva: "inout" }), mira(k(215.1), 1446, 632, 1.98, { curva: "inout" })]}
      medio={<>
        <CartelColgante x={1560} y={318} w={600} h={156} desde={CA - 40} hasta={k(210.5)} techo={-260}
          a={<>{items.map(([ic, rot, t], i) => { const on = f >= k(t); return (
            <g key={ic} transform={`translate(${-236 + i * 118},4)`}>
              <g transform="translate(0,52) scale(0.78)" opacity={on ? 1 : 0.55}><Icono n={ic} apagado={on ? 0 : 0.8} /></g>
              <text x={0} y={128} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={21} letterSpacing={1} fill={on ? "#ffe08a" : "#bcd6c8"}>{rot}</text>
              {on && <g transform={`translate(40,18) scale(${tw(f, k(t), k(t) + 8, 0.2, 1)})`}><circle r={13} fill="#3aa86a" stroke="#f6f1e2" strokeWidth={2.5} /><path d="M-6,0 l4,5 l8,-9" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" /></g>}
            </g>); })}</>} />
        <Carrito x={CX} y={PS} dir={-1} lleno={Math.min(1, 0.15 + cargadas * 0.17)} />
        <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} ikD={ikClaves(cl)} objD={enMano}
          brz={items.reduce<any[]>((acc, [, , t]) => acc.concat([{ f: k(t) - 14, v: { tronco: -6 }, d: 6 }, { f: k(t) - 6, v: { tronco: 14 }, d: 6 }, { f: k(t) + 2, v: { tronco: 0 }, d: 8 }]), []).concat([{ f: k(212.2), v: { hD: 60, cD: 100, cabeza: -6 }, d: 12 }])}
          caras={[{ f: 0, v: "determinado" }, { f: k(207.0), v: "feliz" }, { f: k(208.4), v: "determinado" }, { f: k(209.2), v: "risa" }, { f: k(210.0), v: "feliz" }, { f: k(212.4), v: "sorpresa" }, { f: k(213.8), v: "risa" }]}
          miradas={[{ f: 0, v: { x: -1, y: -0.4 } }, { f: k(206.5), v: { x: 1, y: 0.4 } }, { f: k(207.2), v: { x: -1, y: -0.2 } }, { f: k(208.0), v: { x: 1, y: 0.4 } }, { f: k(208.9), v: { x: -1, y: -0.4 } }, { f: k(209.8), v: { x: 1, y: 0.3 } }, { f: k(211.2), v: { x: 1, y: -0.1 } }]}
          dir={[{ f: 0, v: 1 }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: PS }]} dir={[{ f: 0, v: -1 }]} ikD={jIk} objD={jLata}
          caras={[{ f: 0, v: "duda" }, { f: k(206.3), v: "sorpresa" }, { f: k(207.5), v: "feliz" }, { f: k(209.0), v: "duda" }, { f: k(210.0), v: "risa" }, { f: k(210.8), v: "duda" }, { f: k(212.0), v: "sorpresa" }, { f: k(213.6), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: -1, y: -0.6 } }, { f: k(205.6), v: { x: 1, y: 0.15 } }, { f: k(207.4), v: { x: 1, y: 0.6 } }, { f: k(208.6), v: { x: 1, y: 0.15 } }, { f: k(210.0), v: { x: 1, y: 0.5 } }, { f: k(210.6), v: { x: -1, y: -0.5 } }, { f: k(211.3), v: { x: 1, y: 0.4 } }, { f: k(213.8), v: { x: -1, y: -0.1 } }]}
          brz={[{ f: k(207.4), v: { tronco: 12 }, d: 6 }, { f: k(207.9), v: { tronco: 0 }, d: 8 }, { f: k(209.9), v: { tronco: 12 }, d: 6 }, { f: k(210.4), v: { tronco: 0 }, d: 8 }, { f: k(213.7), v: { cabeza: -8, tronco: -4 }, d: 10 }]} seed={2} />
      </>} />
  );
  return <TomasV5e cortes={[CA]} tomas={[tomaA, tomaB]} />;
};

// 36 · 2 × 2,000 × 365 = 1,5 millones: los dos SENTADOS a la mesa comiendo; la ecuación en la pared lisa (lejos del estante)
//      y la pila de latas crece sobre la mesa con el resultado
export const P36Calorias: React.FC = () => {
  const f = useF();
  const k = kDe(215.13);
  const para = k(219.4);
  const TX = 2290, JX = 2690;
  const comer = (plato: Pt, boca: Pt, fase: number) => {
    const cl: { f: number; x: number; y: number }[] = [];
    for (let t = fase; t < para + 40; t += 40) { cl.push({ f: t, x: plato[0], y: plato[1] }); cl.push({ f: t + 20, x: boca[0], y: boca[1] }); }
    const base = ikClaves(cl);
    return (ff: number) => (ff > para ? { x: plato[0], y: plato[1] - 4 } : base(ff));
  };
  const nL = f < k(216.0) ? 2 : f < k(217.7) ? 4 : f < k(219.2) ? 6 : Math.min(15, 6 + Math.floor((f - k(219.2)) / 4));
  const pila: [number, number][] = [];
  for (let i = 0; i < nL; i++) { const fila = i < 5 ? 0 : i < 9 ? 1 : i < 12 ? 2 : i < 14 ? 3 : 4; const enFila = [0, 5, 9, 12, 14][fila]; const nf = [5, 4, 3, 2, 1][fila]; pila.push([2440 + (i - enFila) * 30 + fila * 15 - (nf - 5) * 0, P - 170 - fila * 34]); }
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={36} setProps={LIV_OTONO} claves={[mira(0, 2480, 610, 1.62), mira(k(221.6), 2490, 610, 1.68, { curva: "inout" })]}
        medio={<>
          <Silla x={TX - 6} piso={P} dir={1} />
          <Silla x={JX + 6} piso={P} dir={-1} />
          {[2390, 2620].map((x) => <ellipse key={x} cx={x} cy={P - 174} rx={34} ry={7} fill="#f2ece0" />)}
          {pila.map(([x, y], i) => <Lata key={i} x={x} y={y} color={["#9aa4ac", "#c0352c", "#e0a23a", "#5aa0d8"][i % 4]} s={0.62} />)}
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} asiento={[{ f: 0, v: 60 }]} poses={[{ f: 0, v: "sentado" }]} ikD={comer([2392, P - 178], [2322, P - 196], 0)}
            caras={[{ f: 0, v: "feliz" }, { f: k(217.0), v: "duda" }, { f: para, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(216.4), v: { x: 1, y: 0 } }, { f: para, v: { x: 1, y: -0.7 } }]}
            brz={[{ f: para, v: { tronco: -8, cabeza: -10 }, d: 8 }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 60 }]} poses={[{ f: 0, v: "sentado" }]} ikD={comer([2618, P - 178], [2668, P - 196], 20)}
            ikI={ikClaves([{ f: k(216.0), x: 2600, y: P - 230, w: 0 }, { f: k(216.4), x: 2600, y: P - 250 }, { f: k(217.4), x: 2600, y: P - 250 }, { f: k(217.8), x: 2620, y: P - 190, w: 0 }])}
            caras={[{ f: 0, v: "neutral" }, { f: k(216.2), v: "determinado" }, { f: para + 6, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(216.2), v: { x: 1, y: 0 } }, { f: para + 6, v: { x: 1, y: -0.5 } }]}
            brz={[{ f: para + 6, v: { tronco: -6, cabeza: -8 }, d: 8 }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Ecuacion2 x={420} y={104} w={980} t={[k(215.3), k(216.1), k(217.7), k(219.1)]} />
    </AbsoluteFill>
  );
};

// 37 · desde el mirador: general CORTO (≤2 s) con los pines cayendo sobre la ciudad → CORTE a medio de los dos (Theo señala, June se ríe);
//      el contador de tiendas y las barras «toda la ciudad / 2 personas, una vida» en el cielo limpio
export const P37Ciudad: React.FC = () => {
  const f = useF();
  const k = kDe(221.69);
  const CA = k(223.6);
  const pins: [number, number, string][] = [[1080, 560, "GROCERY"], [1300, 650, "WAREHOUSE"], [1500, 560, "GAS"], [1690, 700, "GROCERY"], [1880, 600, "FOOD DEPOT"], [2060, 690, "GAS"], [2200, 570, "GROCERY"], [985, 745, "GAS"], [1590, 640, "DELI"], [1980, 760, "GAS"]];
  const tiendas = Math.round(interpolate(f, [k(222.0), k(225.4)], [0, 34], CL));
  // v5: el contador (placa oscura) y después las barras GRANDES (texto 36 px) en la misma franja del cielo, borde de arriba a y = 124;
  //     el general corto pasa al medio con fundido corto (6), sin corte seco
  const conteo = <ContadorPlaca x={1240} y={124} rotulo="FOOD STORES IN DULUTH" valor={String(tiendas)} desde={k(222.0)} hasta={k(225.45)} color={AMBAR} tam={80} />;
  const tomaA = (
    <Escena Set={Panorama} pal={PAL} seed={37} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }} claves={[mira(0, 1480, 520, 0.95), mira(CA + 6, 1500, 520, 0.97, { curva: "inout" })]}
      medio={<>
        {pins.map(([x, y, t], i) => <Pin key={i} x={x} y={y} txt={t} desde={k(222.0) + i * 4} s={1.5} />)}
        <PjX look={JUNE} ruta={[{ f: 0, x: 640, y: P }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} seed={2} />
        <PjX look={THEO} ruta={[{ f: 0, x: 840, y: P }]} poses={[{ f: 0, v: "parado" }, { f: k(222.2), v: "señalar" }]} caras={[{ f: 0, v: "duda" }, { f: k(222.3), v: "sorpresa" }]} />
      </>} />
  );
  const tomaB = (
    <Escena key="b" Set={Panorama} pal={PAL} seed={137} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }} claves={[mira(CA, 920, 540, 1.35), mira(k(229.0), 930, 540, 1.4, { curva: "inout" })]}
      medio={<>
        {pins.filter(([x]) => x < 1460).map(([x, y, t], i) => <Pin key={i} x={x} y={y} txt={t} desde={-30} s={1.5} />)}
        <PjX look={JUNE} ruta={[{ f: 0, x: 640, y: P }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(226.2), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(226.4), v: { x: 1, y: 0 } }]}
          poses={[{ f: 0, v: { hD: 60, cD: 140, cabeza: -4 } }, { f: k(226.2), v: "manosCintura" }]} seed={2} luz={BORDE_CALIDO} />
        <PjX look={THEO} ruta={[{ f: 0, x: 860, y: P }]} poses={[{ f: 0, v: "señalar" }, { f: k(224.4), v: { hD: 120, cD: 0, tronco: -4 } }, { f: k(225.4), v: { hD: 75, cD: 0, tronco: 4 } }, { f: k(226.2), v: "celebrar" }]}
          dir={[{ f: 0, v: 1 }, { f: k(226.0), v: -1 }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(224.6), v: "determinado" }, { f: k(226.2), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(226.2), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <TomasV5e cortes={[CA]} tomas={[tomaA, tomaB]} />
      {conteo}
      <BarrasVida x={1240 - 400} y={112} w={800} desde={k(225.6)} d2={k(227.0)} />
    </AbsoluteFill>
  );
};

// 38 · lo fresco es una cuenta regresiva. v4: súper de góndolas bajas; los 3 carteles-temporizador cuelgan en la PARED LISA,
//      uno sobre cada sección (pan / leche / freezer) y ruedan en el objeto; 4 tomas con CORTE seco:
//   A (229,0-231,07) dos-plano: entran, caen los 3 carteles juntos · B pan: Theo agarra un pan, le crece el moho, asco
//   C leche: June saca un cartón, lo huele, asco · D la luz se corta (tubos se apagan), el freezer sube a 40 °F, June abre
//   la tapa (bisagra, se ve ENTERA), el olor; vuelve al general: los 3 carteles juntos (MOLD / SOUR / 40°F)
const Lechera: React.FC<{ x: number; luz: number }> = ({ x, luz }) => (
  <g>
    <rect x={x} y={P - 440} width={250} height={440} rx={10} fill="#cfd8de" />
    <rect x={x + 16} y={P - 420} width={218} height={380} fill={luz > 0.5 ? "#dff2ff" : "#5a6470"} />
    {[P - 300, P - 180].map((y) => <rect key={y} x={x + 16} y={y} width={218} height={8} fill="#9aa4ac" />)}
    {[P - 300, P - 180, P - 48].map((y) => Array.from({ length: 4 }).map((_, i) => <g key={`${y}${i}`} transform={`translate(${x + 46 + i * 52},${y}) scale(0.55)`}><Icono n="leche" f={0} /></g>))}
    <rect x={x + 16} y={P - 420} width={218} height={380} fill="#bfe4ff" opacity={0.18} />
    <rect x={x + 222} y={P - 320} width={8} height={120} rx={4} fill="#8a949a" />
  </g>
);
const F38 = { pan: 1760, leche: 2300, frz: 2800 };
export const P38Fresco: React.FC = () => {
  const f = useF();
  const k = kDe(229.01);
  const PS = SUPER_PISO;
  const CB = k(231.07), CC = k(233.2), CD = k(235.4);
  const dP = Math.ceil(interpolate(f, [k(231.6), k(232.8)], [7, 0], CL)), dL = Math.ceil(interpolate(f, [k(233.6), k(235.0)], [14, 0], CL));
  const apaga = k(235.65);
  const luz = tw(f, apaga, apaga + 10, 1, 0);
  const temp = Math.round(interpolate(f, [k(235.9), k(237.6)], [0, 40], CL));
  // tapa: June la levanta hasta 0,35 con la mano y la suelta: se abre sola hasta 1 (rebote)
  const agarra = k(237.25), suelta = k(237.85);
  const tapa = f < suelta ? tw(f, agarra + 4, suelta, 0, 0.35) : Math.min(1.04, 0.35 + 0.65 * (1 - Math.exp(-(f - suelta) / 5)) + 0.04 * Math.sin((f - suelta) / 3) * Math.exp(-(f - suelta) / 10));
  const olor = tw(f, k(238.0), k(238.5), 0, 1);
  const pPan = dP > 0 ? `${dP} DAYS` : "MOLD", pLeche = dL > 0 ? `${dL} DAYS` : "SOUR";
  const tags = (sinPan = false) => (
    <>
      {!sinPan && <TagTimer x={F38.pan + 230} y={300} rot="BREAD" valor={pPan} color={dP > 0 ? "#e0a23a" : "#8aa63a"} desde={k(229.5)} pop={dP > 0 ? -99 : k(232.8)} />}
      <TagTimer x={F38.leche + 125} y={300} rot="MILK" valor={pLeche} color={dL > 0 ? "#f6ecd2" : "#8aa63a"} desde={k(229.8)} pop={dL > 0 ? -99 : k(235.0)} />
      <TagTimer x={F38.frz + 100} y={300} rot="FREEZER" valor={f < apaga ? "0°F" : `${temp}°F`} color={f < apaga ? "#8fd3ff" : ROJO_CENSO} desde={k(230.1)} sub={f < apaga ? "POWER ON" : "POWER OFF"} pop={f < apaga ? -99 : apaga} />
    </>
  );
  const base = (sinPan = false) => (
    <>
      <PanRackV4 x={F38.pan} piso={PS} falta={f > k(231.75) ? 3 : -1} />
      <g transform={`translate(0,${PS - P})`}><Lechera x={F38.leche} luz={luz} /></g>
      <FreezerV4 x={F38.frz} piso={PS} tapa={tapa} olor={olor} luz={luz} carne={<g transform="scale(0.8)"><Icono n="carne" f={0} /></g>} />
      {tags(sinPan)}
    </>
  );
  const sp = { gondolas: false, piramide: false, caja: false, luz };
  const velo = <AbsoluteFill style={{ background: "rgba(14,18,32,1)", opacity: 0.3 * (1 - luz) }} />;
  if (f < CB) return (
    <Escena Set={SuperV4} pal={PAL} seed={38} setProps={sp} zLejos={1} claves={[mira(0, 2398, 600, 1.15), mira(CB, 2392, 600, 1.16, { curva: "inout" })]}
      medio={<>
        {base()}
        <PjX look={THEO} ruta={[{ f: 0, x: 1900, y: PS }, { f: k(230.2), x: 2130 }]} dir={[{ f: 0, v: 1 }, { f: k(230.4), v: -1 }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(229.6), v: "sorpresa" }, { f: k(230.5), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(229.6), v: { x: 1, y: -0.8 } }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: 2900, y: PS }, { f: k(230.2), x: 2640 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(230.3), v: { hD: 150, cD: 10, tronco: -4 } }, { f: k(230.9), v: "manosCintura" }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(230.3), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(229.9), v: { x: 1, y: -0.8 } }, { f: k(230.9), v: { x: -1, y: 0 } }]} seed={2} />
      </>} />
  );
  if (f < CC) {
    const TX = 2120;
    return (
      <Escena Set={SuperV4} pal={PAL} seed={138} setProps={sp} zLejos={1} claves={[mira(CB, 2000, 586, 1.45), mira(CC, 2010, 584, 1.47, { curva: "inout" })]}
        medio={<>
          {base()}
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} dir={[{ f: 0, v: -1 }]}
            ikD={ikClaves([{ f: CB, x: TX - 60, y: PS - 200, w: 0 }, { f: CB + 10, x: 1990, y: PS - 248, w: 1 }, { f: k(231.75), x: 1990, y: PS - 248 }, { f: k(232.15), x: TX - 52, y: PS - 270 }, { f: k(232.9), x: TX - 52, y: PS - 270 }, { f: k(233.1), x: TX - 80, y: PS - 220 }])}
            objD={(ff) => (ff > k(231.75) ? { el: <PanMoho moho={tw(ff, k(232.2), k(232.9), 0, 1)} />, rot: 0 } : undefined)}
            caras={[{ f: 0, v: "neutral" }, { f: k(231.6), v: "feliz" }, { f: k(232.3), v: "duda" }, { f: k(232.85), v: "asco" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(232.15), v: { x: 1, y: 0.35 } }, { f: k(232.9), v: { x: -1, y: -0.2 } }]}
            brz={[{ f: k(232.9), v: { tronco: -12, cabeza: -12 }, d: 6 }]} />
        </>} hud={velo} />
    );
  }
  if (f < CD) {
    const JX = 2640;
    return (
      <Escena Set={SuperV4} pal={PAL} seed={238} setProps={sp} zLejos={1} claves={[mira(CC, 2700, 586, 1.45), mira(CD, 2708, 584, 1.47, { curva: "inout" })]}
        medio={<>
          {base(true)}
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: PS }]} dir={[{ f: 0, v: -1 }]}
            ikD={ikClaves([{ f: CC, x: JX - 50, y: PS - 200, w: 0 }, { f: CC + 10, x: 2510, y: PS - 330, w: 1 }, { f: k(233.75), x: 2510, y: PS - 330 }, { f: k(234.05), x: JX - 46, y: PS - 288 }, { f: k(234.9), x: JX - 46, y: PS - 288 }, { f: k(235.15), x: JX - 90, y: PS - 230 }])}
            objD={(ff) => (ff > k(233.75) ? { el: <CartonLeche />, rot: 0 } : undefined)}
            caras={[{ f: 0, v: "neutral" }, { f: k(233.8), v: "duda" }, { f: k(234.6), v: "asco" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(234.1), v: { x: 1, y: 0.3 } }, { f: k(234.7), v: { x: -1, y: -0.1 } }]}
            brz={[{ f: k(234.15), v: { tronco: 8, cabeza: 6 }, d: 8 }, { f: k(234.65), v: { tronco: -12, cabeza: -14 }, d: 6 }]} seed={2} />
        </>} hud={velo} />
    );
  }
  const JD = 3100, TD = 2660;
  const pt = tapaPunta(F38.frz, PS, Math.min(tapa, 0.35));
  return (
    <Escena Set={SuperV4} pal={PAL} seed={338} setProps={sp} zLejos={1}
      claves={[mira(CD, 2398, 600, 1.15), mira(k(237.0) - 1, 2394, 600, 1.16), mira(k(237.0), 2880, 792, 1.6), mira(k(239.4) - 1, 2890, 794, 1.6), mira(k(239.4), 2398, 600, 1.15), mira(k(240.6), 2394, 600, 1.16)]}
      medio={<>
        {base()}
        <PjX look={THEO} ruta={[{ f: 0, x: TD, y: PS }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(238.4), v: { hD: 40, cD: 135, cabeza: -8, tronco: -10 } }, { f: k(239.6), v: { hD: 70, cD: 60, hI: 60, cI: 70, tronco: -8 } }]}
          caras={[{ f: 0, v: "neutral" }, { f: apaga + 2, v: "sorpresa" }, { f: k(237.0), v: "duda" }, { f: k(238.3), v: "asco" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: apaga + 2, v: { x: 1, y: -0.9 } }, { f: k(236.8), v: { x: 1, y: 0.3 } }, { f: k(238.4), v: { x: -1, y: -0.2 } }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JD, y: PS }, { f: k(238.2), x: JD }, { f: k(238.6), x: JD + 40 }]} dir={[{ f: 0, v: -1 }]}
          ikD={(ff) => (ff < agarra - 6 ? null : ff < suelta ? { x: pt.x + 4, y: pt.y, w: tw(ff, agarra - 6, agarra + 2, 0, 1) } : null)}
          poses={[{ f: 0, v: "parado" }, { f: k(238.3), v: { hD: 30, cD: 140, hI: 25, cI: 130, tronco: -14, cabeza: -12 } }, { f: k(239.6), v: "brazosCruzados" }]}
          caras={[{ f: 0, v: "neutral" }, { f: apaga + 4, v: "miedo" }, { f: k(237.0), v: "determinado" }, { f: k(238.1), v: "asco" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: apaga + 4, v: { x: 1, y: -0.9 } }, { f: k(236.9), v: { x: 1, y: 0.4 } }, { f: k(238.3), v: { x: -1, y: -0.3 } }]}
          brz={[{ f: agarra, v: { tronco: 14 }, d: 8 }, { f: suelta, v: { tronco: 4 }, d: 6 }]} seed={2} />
      </>} hud={velo} />
  );
};

// 39 · June escribe la regla 1 en la nota de la heladera (marcador con IK, nota a escala del mundo)
export const P39Regla1: React.FC = () => {
  const k = kDe(240.61);
  const ls = [regla(0, k(242.95), k(244.25)), regla(1, k(245.0), k(245.85))];
  const JX = 3128;
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={39} setProps={LIV_OTONO}
        claves={[mira(0, 3120, 600, 1.35), mira(k(241.9), 3120, 600, 1.35), mira(k(242.85), 3260, 640, 2.4, { curva: "inout" })]}
        medio={<>
          <HeladeraJune ls={ls} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 2940, y: P }, { f: k(242.4), x: JX }]} ikD={ikEscribir(ls)} objD={{ el: <Marcador />, rot: -90 }}
            brz={[{ f: k(242.6), v: { tronco: 14, cabeza: 4 }, d: 10 }, { f: k(244.3), v: { tronco: 4, cabeza: -6 }, d: 8 }, { f: k(244.9), v: { tronco: 14, cabeza: 4 }, d: 8 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(241.9), v: "determinado" }, { f: k(244.3), v: "picaro" }, { f: k(244.9), v: "determinado" }, { f: k(245.9), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(242.7), v: { x: 1, y: -0.6 } }, { f: k(244.3), v: { x: -1, y: 0 } }, { f: k(244.9), v: { x: 1, y: -0.6 } }]} seed={2} />
        </>} />
      <Vineta x={1500} y={360} icono="pan" rotulo="FRESH FIRST" desde={k(243.1)} rot={-4} />
      <Vineta x={1500} y={660} icono="lata" rotulo="CANS LATER" desde={k(245.1)} rot={4} />
    </AbsoluteFill>
  );
};

// 40 · el agua: el grifo de June → Lakewood (Theo sigue el caño); sin luz se paran las bombas y cae la presión
const Pileta: React.FC<{ x: number; chorro: number }> = ({ x, chorro }) => {
  const f = useF();
  const top = P - 150;
  return (
    <g>
      <rect x={x - 130} y={top} width={260} height={150} fill="#6a5a4a" /><rect x={x - 140} y={top - 14} width={280} height={18} rx={4} fill="#c8bca8" />
      {[x - 110, x + 10].map((xx) => <rect key={xx} x={xx} y={top + 24} width={100} height={110} rx={4} fill="#5a4a3e" />)}
      <path d={`M${x + 50},${top - 14} V${top - 70} Q${x + 50},${top - 92} ${x + 26},${top - 92} H${x - 6}`} stroke="#9aa4ac" strokeWidth={12} fill="none" strokeLinecap="round" />
      <rect x={x + 36} y={top - 44} width={30} height={10} rx={4} fill="#c0352c" />
      {chorro > 0.02 && <rect x={x - 10} y={top - 88} width={8 * chorro} height={78} rx={4} fill="#8fd3ff" opacity={0.85} />}
      {chorro > 0.02 && [0, 1, 2, 3].map((i) => <rect key={i} x={x - 9} y={top - 80 + ((f * 9 + i * 20) % 70)} width={5 * chorro} height={10} fill="#e6f6ff" opacity={0.8} />)}
    </g>
  );
};
export const P40Agua: React.FC = () => {
  const f = useF();
  const k = kDe(246.37);
  const S = k(250.0);
  const ks = (t: number) => k(t) - S;
  const chorro = tw(f, k(247.6), k(247.9), 0, 1);
  return (
    <TomasV5e cortes={[S]} tomas={[
      <Sequence key="a" durationInFrames={S + 6}>
        <Escena Set={Living} pal={PAL} seed={40} setProps={LIV_OTONO} claves={[mira(0, 1290, 640, 1.9), mira(k(249.9), 1300, 650, 2.05)]}
          medio={<>
            <Pileta x={1300} chorro={chorro} />
            <PjX look={JUNE} ruta={[{ f: 0, x: 1236, y: P }]} ikD={ikClaves([{ f: k(247.2), x: 1352, y: P - 190 }, { f: k(247.8), x: 1350, y: P - 192 }, { f: k(248.2), x: 1300, y: P - 245, w: 0 }])}
              ikI={() => ({ x: 1296, y: P - 196 })} objI={{ el: <Vaso2 lleno={tw(f, k(247.9), k(249.6), 0.05, 0.95)} />, rot: 0 }}
              brz={[{ f: k(247.0), v: { tronco: 16 }, d: 8 }]} caras={[{ f: 0, v: "neutral" }, { f: k(248.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]} seed={2} />
          </>} />
      </Sequence>,
      <Sequence key="b" from={S}>
        <SeqLakewood ks={ks} />
      </Sequence>]} />
  );
};
const SeqLakewood: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  // general CORTO (≤2 s) → CORTE a las bombas (Theo camina mirándolas) → CORTE al tablero y el manómetro del set (la aguja cae)
  const f = useF();
  const fl = f < ks(256.3) ? 1 : tw(f, ks(256.3), ks(257.3), 1, 0);
  const ag = f < ks(256.3) ? 0.72 : tw(f, ks(256.4), ks(257.6), 0.72, 0.04);
  const sp = { hora: "dia", corte: 1, flujo: fl, aguja: ag, nieve: 0 };
  const C1 = ks(252.0), C2 = ks(254.3);
  // v5: Theo GRANDE en las tres tomas (zoom 1,6: la cámara lo acompaña por las bombas); cambios de toma con fundido corto (6)
  const t1 = (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} seed={140} setProps={sp} claves={[mira(0, 1150, 640, 1.55), mira(C1 + 6, 1440, 640, 1.58, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 1100, y: P }, { f: C1, x: 1400 }]} caras={[{ f: 0, v: "neutral" }, { f: ks(251.0), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: ks(250.9), v: { x: 1, y: -0.3 } }]} poses={[{ f: 0, v: "parado" }, { f: ks(251.1), v: { hD: 100, cD: 10, tronco: -3 } }]} />} />
      <Pildora texto="LAKEWOOD PUMPING STATION" x={960} y={130} desde={ks(250.3)} hasta={C1 - 10} color={AMBAR} tam={38} />
    </AbsoluteFill>
  );
  const t2 = (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} seed={240} setProps={sp} claves={[mira(C1, 1980, 630, 1.6), mira(C2 + 6, 2470, 630, 1.6, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 1860, y: P }, { f: C2, x: 2400 }]} poses={[{ f: 0, v: "parado" }, { f: ks(253.2), v: { hD: 110, cD: 0, tronco: -4 } }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: ks(253.2), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: ks(252.8), v: { x: -1, y: -0.3 } }, { f: ks(253.6), v: { x: 1, y: 0 } }]} />} />
      <Vineta x={1500} y={300} tam={170} icono="rayo" rotulo="PUMPS NEED POWER" desde={ks(253.4)} />
    </AbsoluteFill>
  );
  const t3 = (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} seed={340} setProps={sp} claves={[mira(C2, 3480, 600, 1.6), mira(ks(258.8), 3496, 600, 1.66, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 3180, y: P }]} poses={[{ f: 0, v: "señalar" }, { f: ks(256.3), v: { hD: 60, cD: 120, hI: 60, cI: 120, cabeza: 6 } }, { f: ks(257.4), v: "encogerse" }]}
          caras={[{ f: 0, v: "determinado" }, { f: ks(256.4), v: "sorpresa" }, { f: ks(257.4), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: ks(255.4), v: { x: -1, y: 0 } }, { f: ks(256.4), v: { x: 1, y: -0.3 } }, { f: ks(257.6), v: { x: -1, y: 0.2 } }]} />} />
      <Vineta x={960} y={300} tam={170} icono="rayo" rotulo="NO POWER = NO PRESSURE" desde={C2 + 2} apagar={ks(256.3)} />
    </AbsoluteFill>
  );
  return <TomasV5e cortes={[C1, C2]} tomas={[t1, t2, t3]} />;
};

// 41 · el lago de agua dulce más grande (mapa que se dibuja) → «hervila»: la olla en el anafe → agua para siempre
export const P41Lago: React.FC = () => {
  const k = kDe(258.49);
  const S = k(262.75);
  const ks = (t: number) => k(t) - S;
  // v5: Theo más grande (zoom 1,46) y el lago Superior GRANDE en una placa del cielo a su derecha (no cortada, y ≥ 130);
  //     Theo la señala con el brazo arriba; cambio a la olla con fundido corto (6)
  const tA = (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} seed={41} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }} claves={[mira(0, 1170, 560, 1.46), mira(S + 6, 1186, 560, 1.5, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 1080, y: P }, { f: k(259.6), x: 1150 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(259.9), v: { hD: 135, cD: 6, tronco: -5, cabeza: -8 } }, { f: k(261.7), v: { hD: 120, cD: 10, hI: 40, cI: 60, tronco: -2, cabeza: -4 } }, { f: k(262.2), v: "manosCintura" }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(259.9), v: "sorpresa" }, { f: k(261.5), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(259.8), v: { x: 1, y: -0.8 } }, { f: k(261.9), v: { x: -1, y: 0 } }]} />} />
      <LagoV5 x={840} y={124} w={900} h={224} desde={k(259.7)} />
    </AbsoluteFill>
  );
  return <TomasV5e cortes={[S]} tomas={[tA, <Sequence key="b" from={S}><SeqHervir ks={ks} /></Sequence>]} />;
};
const SeqHervir: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  const f = useF();
  const hv = tw(f, ks(263.0), ks(263.5), 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={141} setProps={LIV_OTONO} claves={[mira(0, 2380, 640, 1.85), mira(ks(265.1), 2370, 640, 1.95)]}
        medio={<>
          <g transform={`translate(2392,${P - 170})`}><rect x={-34} y={-14} width={68} height={14} rx={3} fill="#3a3440" />{hv > 0 && [-16, 0, 16].map((x) => <path key={x} d={`M${x - 5},-14 q5,-${10 + 4 * Math.sin(f / 3 + x)} 10,0 Z`} fill="#5ab0ff" />)}</g>
          <g transform={`translate(2392,${P - 184})`}><Olla f={f} hierve={hv} /></g>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: 2296, y: P }]} ikD={ikClaves([{ f: 0, x: 2346, y: P - 214 }, { f: ks(263.6), x: 2346, y: P - 214 }, { f: ks(263.9), x: 2352, y: P - 238 }])}
            objD={(ff) => (ff > ks(263.8) ? { el: <Vaso2 lleno={0.8} />, rot: 0 } : undefined)} caras={[{ f: 0, v: "determinado" }, { f: ks(263.8), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: ks(263.8), v: { x: 1, y: -0.2 } }]} />
        </>} />
      <Vineta x={1480} y={190} tam={170} icono="agua" rotulo="BOIL IT" desde={ks(262.9)} check={ks(263.9)} acento="#5ab0ff" />
      <TextoMano texto="water, forever" x={1000} y={250} desde={ks(263.85)} color="#8fd3ff" tam={60} />
    </AbsoluteFill>
  );
};

// 42 · ¿qué mata de verdad a dos personas? 4 sub-tomas con fundido corto (6):
//   A (265,2-269,45) los dos en el living: Theo tira una lata al aire, June se cruza de brazos y duda; la tira de 4 «?» entra arriba
//   B (269,45-273,4) recuerdo: June en la guardia de emergencias; el cartel EMERGENCY cuenta 8 YEARS
//   C (273,4-274,6) v5: CONTRAPLANO de June hablando (zoom 1,85): «NOT STARVATION» a su lado, se tacha en «small things»
//   D (274,6-275,9) primer plano de Theo (traga saliva, mano al cuello); vuelve la tira vacía
// v5: tira más chica y más abajo (título a y 150, lejos de la alarma de CO); pila de leña con troncos de verdad (lena 0 en el set)
const STRIP = { x: 360, y: 140, tam: 112 };
const LIV42 = { ...LIV_OTONO, hora: "ocaso" as const, fuego: 0.9, lena: 0 };
export const P42Mata: React.FC = () => {
  const f = useF();
  const k = kDe(265.17);
  const CA = k(269.45), CB = k(273.4), CJ = k(274.6);
  const TX = 520, JX = 880;
  const lena = <LenaV5e lena={0.15} />;
  const vuelos = [[k(265.9), k(266.5)], [k(267.0), k(267.6)]];
  const vuela = vuelos.find(([a, b]) => f >= a && f < b);
  const mano = { x: TX + 70, y: P - 250 };
  const tA = (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={42} setProps={LIV42} detras={lena} claves={[mira(0, 700, 580, 1.35), mira(CA + 6, 710, 582, 1.38, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]}
            ikD={ikClaves([{ f: 0, x: mano.x, y: P - 205 }, { f: k(265.8), x: mano.x, y: mano.y }, { f: k(266.0), x: mano.x, y: P - 205 }, { f: k(266.45), x: mano.x, y: mano.y }, { f: k(266.7), x: mano.x, y: P - 205 }, { f: k(266.9), x: mano.x, y: mano.y }, { f: k(267.1), x: mano.x, y: P - 205 }, { f: k(267.55), x: mano.x, y: mano.y }, { f: k(268.0), x: mano.x - 10, y: P - 200 }])}
            objD={(ff) => (vuelos.some(([a, b]) => ff >= a && ff < b) ? undefined : { el: <Lata color="#c0352c" />, rot: 0 })}
            poses={[{ f: 0, v: "parado" }, { f: k(268.1), v: { hI: 150, cI: 120, cabeza: 6 } }]}
            caras={[{ f: 0, v: "feliz" }, { f: k(267.6), v: "duda" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.8 } }, { f: k(267.7), v: { x: 1, y: 0 } }, { f: k(268.6), v: { x: 1, y: -0.5 } }]} luz={BORDE_CALIDO} />
          {vuela && <Lata x={mano.x} y={mano.y - 14 - 150 * Math.sin(Math.PI * (f - vuela[0]) / (vuela[1] - vuela[0]))} color="#c0352c" rot={((f - vuela[0]) * 22) % 360} />}
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "hablar" }, { f: k(265.7), v: { hD: 60, cD: 80, hI: 40, cI: 70, tronco: -4 } }, { f: k(266.6), v: "brazosCruzados" }, { f: k(268.2), v: "pensar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(266.6), v: "duda" }, { f: k(268.2), v: "determinado" }]} habla={[[0, k(266.4)], [k(268.4), CA]]}
            miradas={[{ f: 0, v: { x: 1, y: -0.6 } }, { f: k(266.7), v: { x: 1, y: 0 } }, { f: k(268.3), v: { x: -1, y: -0.4 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <CasillerosV5 x={STRIP.x} y={STRIP.y} tam={STRIP.tam} desde={k(267.4)} hasta={CA - 4} llenos={[]} />
    </AbsoluteFill>
  );
  const JW = 2960;
  const anios = interpolate(f, [k(271.1), k(272.5)], [1, 8], { ...CL, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const tB = (
    <AbsoluteFill>
      <Escena Set={Lobby} pal={PAL} seed={142} setProps={{ luces: 1, afuera: "noche" }} claves={[mira(CA, 3130, 500, 1.15), mira(CB + 6, 3150, 500, 1.18, { curva: "inout" })]}
        medio={<>
          <CartelER x={3375} y={200} anios={anios} desdeAnios={k(271.0)} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 2700, y: LOBBY_PISO }, { f: k(270.3), x: JW }]} dir={[{ f: 0, v: 1 }, { f: k(272.6), v: -1 }]}
            ikD={ikClaves([{ f: k(270.3), x: JW + 60, y: LOBBY_PISO - 200, w: 0 }, { f: k(270.6), x: JW + 108, y: LOBBY_PISO - 352, w: 1 }, { f: k(271.9), x: JW + 108, y: LOBBY_PISO - 352 }, { f: k(272.3), x: JW + 50, y: LOBBY_PISO - 200, w: 0 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(272.6), v: "brazosCruzados" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(271.2), v: "neutral" }, { f: k(272.6), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(270.5), v: { x: 1, y: -0.6 } }, { f: k(271.6), v: { x: 1, y: -0.9 } }, { f: k(272.7), v: { x: 1, y: 0.1 } }]} seed={2} />
        </>} />
    </AbsoluteFill>
  );
  // C · contraplano de June (la voz es suya): habla, abre la mano en «small things», la vineta se tacha
  const tC = (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={242} setProps={LIV42} detras={lena} claves={[mira(CB, 830, 660, 1.85), mira(CJ + 6, 834, 662, 1.9, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 820, y: P }]} dir={[{ f: 0, v: -1 }]} habla={[[CB + 2, k(274.45)]]}
            poses={[{ f: 0, v: "brazosCruzados" }, { f: k(273.75), v: "hablar" }, { f: k(274.1), v: { hD: 70, cD: 60, hI: 50, cI: 80, tronco: -4, cabeza: 4 } }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(273.9), v: "neutral" }, { f: k(274.2), v: "triste" }]}
            miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(274.15), v: { x: -1, y: 0.4 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Vineta x={1560} y={700} tam={170} icono="comida" rotulo="NOT STARVATION" desde={CB + 2} tachar={k(274.0)} />
    </AbsoluteFill>
  );
  // D · primer plano de Theo: traga saliva, la mano al cuello; entra la tira vacía
  const tD = (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={342} setProps={LIV42} detras={lena} claves={[mira(CJ, 480, 650, 1.9), mira(k(275.9), 482, 655, 1.96, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }]}
            ikD={ikClaves([{ f: CJ, x: TX + 30, y: P - 200, w: 0 }, { f: k(274.85), x: TX + 22, y: P - 228, w: 1 }, { f: k(275.5), x: TX + 22, y: P - 228 }, { f: k(275.8), x: TX + 40, y: P - 200, w: 0 }])}
            brz={[{ f: k(274.95), v: { cabeza: 8 }, d: 5 }, { f: k(275.2), v: { cabeza: -2 }, d: 6 }]}
            caras={[{ f: 0, v: "miedo" }, { f: k(275.3), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(275.2), v: { x: 1, y: -0.2 } }]} luz={BORDE_CALIDO} />
        </>} />
      <CasillerosV5 x={STRIP.x} y={STRIP.y} tam={STRIP.tam} desde={CJ + 2} llenos={[]} />
    </AbsoluteFill>
  );
  return <TomasV5e cortes={[CA, CB, CJ]} tomas={[tA, tB, tC, tD]} />;
};

// 43 · las cosas chicas: 4 mímicas (corte, tobillo, frío, muela) con fundido corto (6) y la tira que se llena
// v5: la tira a y 150; la noche fría = Theo GRANDE junto a la ventana nevada (zoom 1,7); leña de troncos
export const P43Chicas: React.FC = () => {
  const f = useF();
  const k = kDe(275.91);
  const C1 = k(277.62), C2 = k(278.87), C3 = k(280.62);
  const TX = 520;
  const tira = <CasillerosV5 x={STRIP.x} y={STRIP.y} tam={STRIP.tam} desde={-30} llenos={[{ f: k(276.1), icono: "corte", rot: "INFECTED CUT" }, { f: k(277.75), icono: "tobillo", rot: "BROKEN ANKLE" }, { f: k(279.0), icono: "frio", rot: "COLD NIGHT" }, { f: k(280.75), icono: "muela", rot: "BAD TOOTH" }]} />;
  const LV = { ...LIV_OTONO, hora: "noche" as const, fuego: 0.9, lena: 0 };
  const lena = <LenaV5e lena={0.15} />;
  const dedo = { x: TX + 74, y: P - 212 };
  const t1 = (
    <Escena Set={Living} pal={PAL} seed={43} setProps={LV} detras={lena} claves={[mira(0, 480, 650, 1.9), mira(C1 + 6, 485, 645, 1.95, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]}
          ikD={ikClaves([{ f: 0, x: TX + 40, y: P - 200, w: 0 }, { f: k(276.2), x: dedo.x, y: dedo.y, w: 1 }, { f: k(276.9), x: dedo.x, y: dedo.y }, { f: k(277.2), x: dedo.x - 6, y: dedo.y + 20 }])}
          brz={[{ f: k(276.3), v: { tronco: -4, cabeza: -6 }, d: 6 }, { f: k(276.95), v: { cabeza: 10 }, d: 6 }]}
          caras={[{ f: 0, v: "duda" }, { f: k(276.3), v: "sorpresa" }, { f: k(276.95), v: "asco" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(276.25), v: { x: 1, y: 0.7 } }, { f: k(277.0), v: { x: 1, y: -0.1 } }]} luz={BORDE_CALIDO} />
        <CorteDedo x={dedo.x + 6} y={dedo.y - 18} o={tw(f, k(276.3), k(276.6), 0, 1)} />
      </>} />
  );
  const t2 = (
    <Escena Set={Living} pal={PAL} seed={143} setProps={LV} detras={lena} claves={[mira(C1, 520, 700, 1.75), mira(C2 + 6, 524, 702, 1.78, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "agacharse" }]}
          ikD={() => ({ x: TX + 52, y: P - 36 })} ikI={() => ({ x: TX + 40, y: P - 44 })}
          caras={[{ f: 0, v: "enojo" }, { f: k(278.3), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.9 } }, { f: k(278.3), v: { x: 1, y: -0.2 } }]}
          brz={[{ f: C1 + 8, v: { tronco: 6 }, d: 6 }, { f: k(278.4), v: { tronco: 0 }, d: 8 }]} luz={BORDE_CALIDO} />
        <Dolor x={TX + 46} y={P - 40} r={46} o={tw(f, C1 + 2, C1 + 10, 0, 1)} />
      </>} />
  );
  // noche fría: Theo cerca de la ventana nevada, se abraza y tirita, mira afuera y después a cámara con miedo
  const TV = 640;
  const t3 = (
    <Escena Set={Living} pal={PAL} seed={243} setProps={{ ...LV, fuego: 0, nieveAfuera: 1 }} detras={lena} claves={[mira(C2, 600, 630, 1.7), mira(C3 + 6, 606, 632, 1.74, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO_CASA} ruta={[{ f: 0, x: TV, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: C2 + 10, v: "encogerse" }]}
          brz={[{ f: k(279.4), v: { tronco: 4 }, d: 4 }, { f: k(279.55), v: { tronco: -2 }, d: 4 }, { f: k(279.7), v: { tronco: 4 }, d: 4 }, { f: k(279.85), v: { tronco: 0 }, d: 4 }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(279.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(280.0), v: { x: -1, y: 0 } }]} luz={BORDE_FRIO} />
      </>} />
  );
  const t4 = (
    <Escena Set={Living} pal={PAL} seed={343} setProps={LV} detras={lena} claves={[mira(C3, 480, 650, 1.9), mira(k(282.2), 480, 655, 1.95, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]}
          ikD={ikClaves([{ f: C3, x: TX + 40, y: P - 200, w: 0 }, { f: C3 + 10, x: TX + 36, y: P - 238, w: 1 }])}
          brz={[{ f: C3 + 10, v: { cabeza: 10 }, d: 6 }, { f: k(281.5), v: { cabeza: 4 }, d: 8 }]}
          caras={[{ f: 0, v: "asco" }, { f: k(281.4), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(281.4), v: { x: 1, y: -0.1 } }]} luz={BORDE_CALIDO} />
        <Mejilla x={TX + 46} y={P - 234} o={tw(f, C3 + 4, C3 + 16, 0, 1)} r={20} /><Dolor x={TX + 46} y={P - 234} r={30} o={tw(f, C3 + 10, C3 + 18, 0, 1)} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <TomasV5e cortes={[C1, C2, C3]} tomas={[t1, t2, t3, t4]} />
      {tira}
    </AbsoluteFill>
  );
};

// ======================================================================================================
// v3d · vuelta 3 (planos 44-57). Cortes internos = cambio de lista de claves en 1 cuadro (sin desenfoque de movimiento);
// los fundidos de Montaje (48→49, 52→53, 56→57) se vuelven corte: cada plano dibuja al vecino con Desfase en la zona encimada.

// 44 · la muela: Theo con venda, cachete hinchado y la mano en la mandíbula → CORTE al dos-plano frente al DENTAL apagado
export const P44Dentista: React.FC = () => {
  const f = useF();
  const k = kDe(282.21);
  const D = SUP_PUNTOS.dentista;
  const TX = D + 110, JX = D - 120, PS = SUP_PISO;
  const kB = k(285.45);
  // v5: 2 sub-tomas con fundido de 6 cuadros · (1) primer plano: la muela · (2) dos-plano con cielo libre arriba para el contador:
  //     «exactly two people» Theo señala a June y a sí mismo → le vuelve a doler → «neither of them is a dentist»: el neón OPEN
  //     del dentista se apaga con el 2 → 0, Theo abre las manos (no hay nadie), June niega con la cabeza mirando a un lado y al otro
  const rT: Paso[] = [{ f: 0, x: TX, y: PS }, { f: k(288.3), x: TX }, { f: k(288.9), x: TX - 60 }];
  const tx = posRuta(rT, f).x;
  const mand = ikClaves([
    { f: 0, x: TX - 42, y: PS - 236 }, { f: k(285.55), x: TX - 42, y: PS - 236 }, { f: k(285.8), x: TX - 80, y: PS - 170, w: 0 },
    { f: k(286.75), x: TX - 80, y: PS - 170, w: 0 }, { f: k(287.05), x: TX - 42, y: PS - 236 }, { f: k(287.75), x: TX - 42, y: PS - 236 },
    { f: k(287.95), x: TX - 80, y: PS - 160, w: 0 }, { f: k(288.9), x: TX - 120, y: PS - 160, w: 0 }, { f: k(289.2), x: TX - 102, y: PS - 236 },
  ]);
  const neon = 1 - tw(f, k(287.95), k(287.95) + 10, 0, 1);
  const ABRE = { hD: 40, cD: 80, hI: 40, cI: 80, cabeza: 8, tronco: -2 };
  const escena = (cl: ReturnType<typeof mira>[]) => (
    <Escena Set={Superior} pal={PAL} seed={44} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={cl}
      medio={<>
        <CartelTienda x={D} y={526} txt="DENTAL" />
        <NeonMuela x={D + 350} y={690} o={neon} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: PS }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "brazosCruzados" }, { f: k(284.45), v: "manosCara", d: 10 }, { f: k(285.55), v: "señalar", d: 10 }, { f: k(286.5), v: "hablar", d: 10 }, { f: k(287.9), v: "parado", d: 10 }, { f: k(288.7), v: "brazosCruzados", d: 12 }]}
          caras={[{ f: 0, v: "duda" }, { f: k(283.6), v: "miedo" }, { f: k(285.55), v: "determinado" }, { f: k(286.5), v: "duda" }, { f: k(287.9), v: "triste" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(284.45), v: { x: 1, y: 0.3 } }, { f: k(285.55), v: { x: 1, y: 0 } }, { f: k(287.95), v: { x: 0.6, y: -0.6 } },
            { f: k(288.2), v: { x: -1, y: 0.1 } }, { f: k(288.5), v: { x: 1, y: 0.1 } }, { f: k(288.8), v: { x: -1, y: 0.1 } }, { f: k(289.1), v: { x: 1, y: 0.2 } }]}
          giros={[{ f: k(287.95), v: 0 }, { f: k(288.2), v: -0.8 }, { f: k(288.5), v: 0.8 }, { f: k(288.8), v: -0.7 }, { f: k(289.1), v: 0.5 }, { f: k(289.4), v: 0 }]} seed={2} />
        <PjX look={THEO} ruta={rT} dir={[{ f: 0, v: -1 }]} ikD={mand}
          poses={[{ f: 0, v: "parado" }, { f: k(283.55), v: "encogerse", d: 12 }, { f: k(285.6), v: "señalar", d: 10 }, { f: k(286.8), v: "encogerse", d: 10 }, { f: k(287.95), v: ABRE, d: 10 }, { f: k(288.9), v: "encogerse", d: 12 }]}
          brz={[{ f: 0, v: { hI: 8, cI: 10 } }, { f: k(283.55), v: { hI: 30, cI: 100 }, d: 8 }, { f: k(284.43), v: { hI: 45, cI: 140 }, d: 6 }, { f: k(285.2), v: { hI: 8, cI: 10 }, d: 10 },
            { f: k(285.7), v: { hI: 40, cI: 120 }, d: 10 }, { f: k(286.75), v: null, d: 10 }]}
          caras={[{ f: 0, v: "asco" }, { f: k(283.55), v: "miedo" }, { f: k(285.6), v: "duda" }, { f: k(286.8), v: "asco" }, { f: k(287.95), v: "sorpresa" }, { f: k(288.65), v: "triste" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(284.4), v: { x: 0.4, y: -0.7 } }, { f: k(285.5), v: { x: 1, y: 0 } }, { f: k(286.8), v: { x: 0.6, y: 0.6 } }, { f: k(287.95), v: { x: -1, y: -0.3 } }, { f: k(288.6), v: { x: 1, y: 0.2 } }]} />
        <Venda hx={tx} hy={PS - 261} dir={-1} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <SubTomas tomas={[
        { desde: -999, el: () => escena([mira(0, TX - 40, 560, 1.75), mira(kB + 6, TX - 30, 566, 1.82)]) },
        { desde: kB, el: () => escena([mira(kB, D - 5, 540, 1.3), mira(k(289.7), D - 5, 544, 1.33)]) },
      ]} />
      <Vineta x={1270} y={230} icono="muela" rotulo="INFECTED TOOTH" desde={k(283.6)} hasta={kB - 10} tam={150} acento="#e2483a" />
      <Vineta x={1560} y={230} icono="cruz" rotulo="SEPSIS" desde={k(284.45)} hasta={kB - 10} tam={150} acento="#e2483a" />
      <GranNumero rotulo="DENTISTS LEFT · TWO PEOPLE" claves={[{ f: 0, v: 2 }, { f: k(287.95), v: 0, d: 14 }]} y={150} tam={120} desde={kB + 4} color="#e2483a" />
    </AbsoluteFill>
  );
};

// 45 · la regla 2 (heladera, viñetas tachadas, el gag de la escalera) → CORTE al contraplano: una herida = la mitad de la humanidad
const P45C = { X: 2740, Y: 593, z: 1.6 };
const Contra45: React.FC<{ k: (t: number) => number; ls: Lin[] }> = ({ k, ls }) => (
  <PjX look={JUNE} ruta={[{ f: 0, x: 3128, y: P }]} ikD={ikEscribir(ls)} objD={{ el: <Marcador />, rot: -90 }} dir={[{ f: 0, v: 1 }, { f: k(295.2), v: -1 }]}
    poses={[{ f: 0, v: "parado" }, { f: k(295.3), v: "señalar" }, { f: k(296.6), v: "brazosCruzados" }, { f: k(297.5), v: "señalar" }, { f: k(298.7), v: "parado" }]} brz={[{ f: 0, v: { tronco: 14, cabeza: 4 } }, { f: k(294.4), v: null, d: 10 }]}
    caras={[{ f: 0, v: "determinado" }, { f: k(295.3), v: "enojo" }, { f: k(297.4), v: "determinado" }, { f: k(298.6), v: "triste" }]}
    miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(295.2), v: { x: 1, y: 0 } }, { f: k(297.5), v: { x: 1, y: -0.3 } }, { f: k(298.7), v: { x: 0.3, y: 0.4 } }]} seed={2} />
);
export const P45Regla2: React.FC = () => {
  const f = useF();
  const k = kDe(289.61);
  const ls = [regla(0), regla(1), regla(2, k(289.75), k(290.95)), regla(3, k(291.2), k(291.85)), regla(4, k(292.15), k(292.9)), regla(5, k(293.3), k(294.15))];
  const baja = k(296.7);
  const kC = k(297.35);
  const rT: Paso[] = [{ f: 0, x: 2350, y: P }, { f: k(294.6), x: 2350 }, { f: k(295.8), x: 2760 }];
  const cl = f < kC ? [mira(0, 3260, 640, 2.4), mira(k(294.5), 3260, 640, 2.4), mira(k(295.4), 2980, 610, 1.3, { curva: "inout" }), mira(kC, 2990, 610, 1.32)] : [mira(kC, P45C.X, P45C.Y, P45C.z), mira(k(299.5), P45C.X, P45C.Y, P45C.z + 0.03)];
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={45} setProps={LIV_OTONO} claves={cl}
        medio={<>
          <HeladeraJune ls={ls} />
          {f >= baja && <g transform={`translate(2800,${P})`}><Escalera /></g>}
          <PjX look={THEO_CASA} ruta={rT} objD={(ff) => (ff < baja ? { el: <Escalera />, rot: 0 } : undefined)}
            ikD={(ff) => (ff < baja - 6 ? { x: posRuta(rT, ff).x + 40, y: P - 150 } : null)}
            poses={[{ f: 0, v: "parado" }, { f: k(296.0), v: "encogerse" }, { f: k(297.6), v: "parado" }, { f: k(298.6), v: "manosCara" }]} caras={[{ f: 0, v: "feliz" }, { f: k(295.7), v: "sorpresa" }, { f: k(296.1), v: "duda" }, { f: k(297.6), v: "neutral" }, { f: k(298.6), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(297.6), v: { x: 1, y: 0.2 } }, { f: k(298.6), v: { x: 0.4, y: 0.6 } }]} />
          <Contra45 k={k} ls={ls} />
        </>} />
      <Vineta x={1640} y={300} icono="escalera" rotulo="NO LADDERS" desde={k(291.3)} tachar={k(291.8)} hasta={k(294.8)} tam={130} />
      <Vineta x={1640} y={530} icono="motosierra" rotulo="NO CHAINSAWS" desde={k(292.2)} tachar={k(292.7)} hasta={k(294.8)} tam={130} />
      <Vineta x={1640} y={760} icono="hielo" rotulo="NO ICE" desde={k(293.4)} tachar={k(294.0)} hasta={k(294.8)} tam={130} />
      {f >= kC && <Picto2 x={P45X} y={P45Y} desde={kC + 2} herida={k(297.6)} apaga={k(298.3)} texto={k(298.55)} />}
    </AbsoluteFill>
  );
};
const P45X = 640, P45Y = 372;

// 46 · (sigue el contraplano: «…la mitad de la humanidad») → días 10-30: la mudanza (colchón en alto, la puerta, la estufa, el lago) → la ferretería
export const P46Casa: React.FC = () => {
  const k = kDe(299.43);
  // v5: arranca DIRECTO en la calle de la casa (nada del living de P45). 3 sub-tomas con fundido de 6 cuadros:
  //   (1) llegan caminando: Theo con el colchón sobre la cabeza agarrado con LAS DOS manos, June con la llave
  //   (2) la puerta: June abre, Theo baja el colchón con las dos manos; en «wood stove» sale humo de la chimenea
  //   (3) la ferretería
  const kB2 = k(304.55), kB3 = k(308.45);
  return (
    <SubTomas tomas={[
      { desde: -999, el: () => <SeqMudanza ks={k} cl={[mira(0, 2980, 600, 1.15), mira(k(304.3), 2330, 620, 1.2, { curva: "inout" }), mira(kB2 + 8, 2320, 620, 1.21)]} /> },
      { desde: kB2, el: () => <SeqMudanza ks={k} cl={[mira(kB2, 2060, 660, 1.5), mira(k(306.3), 2070, 660, 1.52), mira(k(307.0), 2090, 520, 1.05, { curva: "inout" }), mira(kB3 + 8, 2095, 520, 1.06)]} vinetas /> },
      { desde: kB3, el: () => <Desfase d={kB3}><Ferreteria46 k={(t) => k(t) - kB3} /></Desfase> },
    ]} />
  );
};
const SeqMudanza: React.FC<{ ks: (t: number) => number; cl: ReturnType<typeof mira>[]; vinetas?: boolean }> = ({ ks, cl, vinetas }) => {
  const f = useF();
  const PB = BARRIO_PISO;
  const rT: Paso[] = [{ f: 0, x: 3230, y: PB }, { f: ks(304.4), x: 2260 }, { f: ks(307.6), x: 2260 }];
  const rJ: Paso[] = [{ f: 0, x: 2960, y: PB }, { f: ks(304.2), x: 2010 }];
  const tx = posRuta(rT, f).x;
  // colchón: sobre la cabeza (apoyado, las dos manos abajo del colchón) → lo baja y lo apoya contra la pared
  const baja = tw(f, ks(305.0), ks(305.7), 0, 1);
  const alto = PB - 314;
  const cx = lerp(tx, 2160, baja), cy = lerp(alto, PB - 128, baja), rot = lerp(0, -80, baja);
  const suelta = ks(305.8);
  const manos = (lado: number) => (ff: number) => {
    if (ff >= suelta + 8) return null;
    const b = tw(ff, ks(305.0), ks(305.7), 0, 1);
    const ccx = lerp(posRuta(rT, ff).x, 2160, b), ccy = lerp(alto, PB - 128, b), r = (lerp(0, -80, b) * Math.PI) / 180;
    const lx = lado * 64, ly = 22;
    return { x: ccx + lx * Math.cos(r) - ly * Math.sin(r), y: ccy + lx * Math.sin(r) + ly * Math.cos(r), w: 1 - tw(ff, suelta, suelta + 8, 0, 1) };
  };
  const abre = tw(f, ks(304.8), ks(305.3), 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={46} setProps={{ hora: "dia", luces: 0, nieve: 0, humo: 0 }} claves={cl}
        medio={<>
          <HumoV5 x={2090} y={142} o={tw(f, ks(306.5), ks(306.5) + 12, 0, 1)} />
          <PuertaCasa x={1900} piso={PB} abre={abre} />
          <CartelTienda x={1720} y={668} txt="7TH AVE E" fondo="#2f6a4a" color="#ffffff" tam={22} />
          <PjX look={JUNE} ruta={rJ} dir={[{ f: 0, v: -1 }, { f: ks(307.8), v: 1 }]} objD={(ff) => (ff < ks(305.4) ? { el: <Llave />, rot: -90 } : undefined)}
            objI={(ff) => (ff < ks(305.6) ? { el: <g transform="rotate(90)"><SacoDormir color="#7a3a5a" /></g>, rot: -90 } : undefined)}
            ikD={ikClaves([{ f: ks(304.4), x: 1946, y: PB - 112 }, { f: ks(305.3), x: 1946, y: PB - 112 }, { f: ks(305.6), x: 1990, y: PB - 120, w: 0 }])}
            poses={[{ f: 0, v: "parado" }, { f: ks(301.4), v: "señalar", d: 12 }, { f: ks(302.6), v: "parado", d: 12 }, { f: ks(306.4), v: "señalar" }, { f: ks(307.3), v: "manosCintura" }, { f: ks(307.85), v: "señalar" }]}
            caras={[{ f: 0, v: "determinado" }, { f: ks(301.4), v: "feliz" }, { f: ks(302.6), v: "determinado" }, { f: ks(305.2), v: "feliz" }, { f: ks(306.5), v: "risa" }, { f: ks(307.85), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: ks(301.4), v: { x: -1, y: -0.4 } }, { f: ks(302.6), v: { x: 1, y: 0 } }, { f: ks(306.4), v: { x: 0.6, y: -1 } }, { f: ks(307.4), v: { x: 1, y: 0 } }]} seed={2} />
          <PjX look={THEO} ruta={rT} dir={[{ f: 0, v: -1 }, { f: ks(307.85), v: 1 }]} ikD={manos(1)} ikI={manos(-1)}
            poses={[{ f: 0, v: "parado" }, { f: ks(306.3), v: "manosCintura" }, { f: ks(307.9), v: "celebrar" }]}
            caras={[{ f: 0, v: "determinado" }, { f: ks(301.5), v: "feliz" }, { f: ks(302.7), v: "determinado" }, { f: ks(305.8), v: "feliz" }, { f: ks(306.6), v: "sorpresa" }, { f: ks(307.9), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: ks(301.5), v: { x: 0.6, y: -0.8 } }, { f: ks(302.7), v: { x: 1, y: 0 } }, { f: ks(305.9), v: { x: 0.5, y: -1 } }, { f: ks(307.9), v: { x: 1, y: 0 } }]} />
          <Colchon x={cx} y={cy} rot={rot} />
        </>} />
      {vinetas && <>
        <Vineta x={1220} y={200} icono="casa" rotulo="BRICK HOUSE" desde={ks(306.35)} check={ks(306.6)} tam={130} acento="#3aa86a" />
        <Vineta x={1440} y={200} icono="techo" rotulo="WOOD STOVE" desde={ks(306.6)} check={ks(307.0)} tam={130} acento="#3aa86a" />
        <Vineta x={1660} y={200} icono="agua" rotulo="LAKE VIEW" desde={ks(307.85)} check={ks(308.2)} tam={130} acento="#3aa86a" />
      </>}
    </AbsoluteFill>
  );
};
const Ferreteria46: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const F = SUP_PUNTOS.ferreteria;
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={146} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(0, F + 150, 610, 1.3), mira(k(310.5), F + 180, 610, 1.32)]}
        medio={<>
          <CartelTienda x={F} y={560} txt="HARDWARE" fondo="#e0d6c2" color="#8a2420" />
          <PjX look={THEO} ruta={[{ f: 0, x: F + 70, y: SUP_PISO }, { f: k(310.5), x: F + 270 }]} dir={[{ f: 0, v: 1 }]} objD={{ el: <CajaHerr />, rot: 0 }}
            objI={{ el: <g transform="translate(0,10) rotate(80)"><rect x={-6} y={-60} width={12} height={90} rx={3} fill="#8a6a4a" /><rect x={-30} y={-78} width={60} height={22} rx={4} fill="#5a646c" /></g>, rot: 0 }}
            caras={[{ f: 0, v: "determinado" }, { f: k(309.9), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(309.4), v: { x: 1, y: 0.5 } }]} />
        </>} />
      <Vineta x={760} y={190} icono="herramientas" rotulo="TOOLS" desde={k(309.0)} check={k(309.9)} tam={115} acento="#3aa86a" />
    </AbsoluteFill>
  );
};

// 47 · cinco eventos: June sale del OUTDOOR con dos bolsas → lee la etiqueta −30°F → Theo carga nafta (el surtidor cuenta galones)
//      → tres frascos: hoy, 3 meses, 1 año (la nafta se pudre) → la llave en el arranque: cada viaje es una decisión
// camioneta (mundo): caja a la izquierda (x … x+180), cabina a la derecha; tapa de nafta en (x+24, piso-132)
const Pickup: React.FC<{ x: number; color: string }> = ({ x, color }) => (
  <g>
    <ellipse cx={x + 190} cy={SUP_PISO + 4} rx={200} ry={12} fill="#000" opacity={0.3} />
    <rect x={x} y={SUP_PISO - 160} width={180} height={90} rx={6} fill={color} />
    <path d={`M${x + 176},${SUP_PISO - 70} V${SUP_PISO - 220} H${x + 290} L${x + 330},${SUP_PISO - 150} H${x + 386} V${SUP_PISO - 70} Z`} fill={color} />
    <path d={`M${x + 190},${SUP_PISO - 206} H${x + 282} L${x + 314},${SUP_PISO - 152} H${x + 190} Z`} fill="#bfe4ff" opacity={0.85} />
    <rect x={x} y={SUP_PISO - 90} width={386} height={14} fill="#2a2228" opacity={0.6} />
    <circle cx={x + 24} cy={SUP_PISO - 132} r={9} fill="#2a2228" />
    {[x + 70, x + 310].map((cx) => <g key={cx}><circle cx={cx} cy={SUP_PISO - 34} r={36} fill="#26262a" /><circle cx={cx} cy={SUP_PISO - 34} r={15} fill="#8a949a" /></g>)}
  </g>
);
const NAF = { S2: 312.3, S3: 313.95, S4: 318.2, S5: 324.45 };
export const P47Nafta: React.FC = () => {
  const k = kDe(310.5);
  const s5 = k(NAF.S5);
  // v5f: 5 sub-tomas con fundido de 6 cuadros, cada una con su evento: OUTDOOR (bolsas → etiqueta) · surtidor (descuelga la
  // manguera, camina, carga, galones que ruedan, señala la 2ª pickup) · caja (sube el bidón, frascos) · generador · tablero
  return (
    <SubTomas tomas={[
      { desde: -999, el: () => <Outdoor47 k={k} /> },
      { desde: k(NAF.S3), el: () => <Surtidor47 k={k} /> },
      { desde: k(NAF.S4), el: () => <Frascos47 k={k} /> },
      { desde: k(NAF_B), el: () => <Generador47 k={k} /> },
      { desde: s5, el: () => <Desfase d={s5}><Tablero47 k={(t) => k(t) - s5} /></Desfase> },
    ]} />
  );
};
const Outdoor47: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const O = 5560, JX = 5420, PS = SUP_PISO;
  const kS2 = k(NAF.S2);
  const rJ: Paso[] = [{ f: 0, x: O + 80, y: PS }, { f: k(311.9), x: JX }];
  const lee = { x: JX - 58, y: PS - 300 };
  // v5f: el empuje a la etiqueta es un mira() inout de 16 cuadros (antes: corte seco)
  const cl = [mira(0, O - 40, 610, 1.3), mira(kS2 - 16, O - 60, 612, 1.32), mira(kS2, JX - 40, 640, 2.2, { curva: "inout" }), mira(k(NAF.S3) + 8, JX - 40, 646, 2.25)];
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={47} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={cl}
        medio={<>
          <CartelTienda x={O} y={548} txt="OUTDOOR" fondo="#2f4a3a" color="#e8e2c8" />
          {f >= kS2 - 8 && <g transform={`translate(${lee.x},${lee.y})`}><SacoDormir etiqueta /></g>}
          <PjX look={JUNE} ruta={rJ} dir={[{ f: 0, v: -1 }]}
            objD={(ff) => (ff < kS2 - 8 ? { el: <g transform="rotate(90)"><SacoDormir /></g>, rot: -90 } : undefined)} objI={{ el: <g transform="rotate(90)"><SacoDormir color="#7a3a5a" /></g>, rot: -90 }}
            ikD={(ff) => (ff < kS2 - 8 ? null : { x: lee.x, y: lee.y, w: tw(ff, kS2 - 8, kS2, 0, 1) })}
            poses={[{ f: 0, v: "parado" }, { f: k(313.0), v: "manosCintura" }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(311.7), v: "feliz" }, { f: k(312.35), v: "duda" }, { f: k(313.03), v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: kS2 - 6, v: { x: 1, y: -0.5 } }, { f: k(313.3), v: { x: 0.2, y: 0 } }]} seed={2} />
        </>} />
      {f < kS2 && <Vineta x={760} y={210} icono="bolsa" rotulo="SLEEPING BAGS" desde={k(311.65)} hasta={kS2 - 10} tam={120} acento={FRIO} />}
    </AbsoluteFill>
  );
};
// v5f: Theo DESCUELGA la pistola del surtidor (gancho 294,PS−100), camina a la tapa (504,PS−132), carga mirando el visor
// grande (poste arriba del surtidor), la saca, señala la 2ª pickup y va hacia ella
const Surtidor47: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const PS = SUP_PISO;
  const CAP = { x: 504, y: PS - 132 }, GANCHO = { x: 294, y: PS - 100 };
  const agarra = k(314.25), llega = k(314.8), saca = k(316.95);
  const rT: Paso[] = [{ f: 0, x: 345, y: PS }, { f: agarra + 2, x: 345 }, { f: llega, x: 440 }, { f: k(317.35), x: 440 }, { f: k(318.25), x: 700 }];
  const lleva = (ff: number) => ({ x: posRuta(rT, ff).x + 44, y: PS - 156 });
  const boca = { x: CAP.x - 14, y: CAP.y - 4 };
  const ik = (ff: number) => {
    if (ff < agarra) return { x: GANCHO.x + 6, y: GANCHO.y - 6, w: tw(ff, k(313.95), k(314.15), 0, 1) };
    if (ff < llega) { const u = tw(ff, agarra, llega, 0, 1); const a = lleva(ff); const q = u < 0.55 ? 0 : (u - 0.55) / 0.45; return { x: lerp(a.x, boca.x, q), y: lerp(a.y, boca.y, q) }; }
    if (ff < saca) return boca;
    const u = tw(ff, saca, saca + 10, 0, 1); const a = lleva(ff);
    return { x: lerp(boca.x, a.x, u), y: lerp(boca.y, a.y, u) };
  };
  const m = ik(f);
  const gal = interpolate(f, [llega + 4, saca - 6], [0, 26.4], CL);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={147} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(k(NAF.S3), 560, 640, 1.2), mira(k(316.9), 570, 640, 1.22), mira(k(NAF.S4) + 8, 660, 640, 1.22, { curva: "inout" })]}
        medio={<>
          <Pickup x={480} color="#3a5a8a" />
          <Pickup x={920} color="#7a2a2a" />
          <rect x={242} y={PS - 236} width={12} height={90} fill="#5a5a66" />
          <DisplayGalones x={248} y={PS - 290} gal={gal} />
          <path d={`M282,${PS - 60} Q${(282 + m.x) / 2},${PS + 14} ${m.x - 4},${m.y + 10}`} stroke="#1a1a1e" strokeWidth={8} fill="none" />
          {f < agarra && <g transform={`translate(${GANCHO.x},${GANCHO.y}) rotate(-90)`}><Pistola /></g>}
          <PjX look={THEO} ruta={rT} dir={[{ f: 0, v: -1 }, { f: agarra + 2, v: 1 }]} ikD={ik} objD={(ff) => (ff >= agarra ? { el: <Pistola />, rot: -90 } : undefined)}
            brz={[{ f: 0, v: null }, { f: llega + 6, v: { hI: -35, cI: -95 }, d: 10 }, { f: saca, v: { hI: 95, cI: 0, tronco: 3 }, d: 10 }, { f: k(317.75), v: null, d: 10 }]}
            caras={[{ f: 0, v: "determinado" }, { f: llega + 10, v: "neutral" }, { f: k(315.7), v: "feliz" }, { f: saca, v: "determinado" }, { f: k(317.6), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: agarra + 2, v: { x: 1, y: 0.2 } }, { f: llega + 10, v: { x: -1, y: -0.5 } }, { f: k(315.7), v: { x: 1, y: 0 } }, { f: saca, v: { x: 1, y: -0.1 } }]} />
        </>} />
    </AbsoluteFill>
  );
};
// v5f: 2 sub-tomas · (a) la caja de la pickup: Theo sube el bidón desde el piso → frascos (hoy / 3 meses) y levanta el de 3 meses
//     contra la luz · (b) «within a year most engines won't run»: el generador tose y no arranca
const NAF_B = 321.3;
const EtiqFrasco: React.FC<{ r: string; s: number }> = ({ r, s }) => (
  <g transform={`scale(${s})`}>
    <rect x={-27} y={-38} width={54} height={22} rx={4} fill="#f6ecd2" stroke="#1a1620" strokeWidth={2} />
    <text x={0} y={-21} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={15} letterSpacing={1} fill="#1a1620">{r}</text>
  </g>
);
const Frascos47: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const { fps } = vcV3();
  const PS = SUP_PISO;
  const TX = 430, S = 1.15;
  const BID = { x0: 466, x1: 500, y1: PS - 160 };
  const mano = ikClaves([
    { f: k(318.2), x: BID.x0, y: PS - 80 }, { f: k(318.4), x: BID.x0, y: PS - 80 }, { f: k(318.85), x: BID.x1, y: BID.y1 - 82 }, { f: k(319.0), x: BID.x1, y: BID.y1 - 82 },
    { f: k(319.3), x: TX + 50, y: PS - 150, w: 0 }, { f: k(319.85), x: TX + 60, y: PS - 170, w: 0 }, { f: k(320.15), x: 645, y: PS - 205 }, { f: k(320.6), x: TX + 92, y: PS - 330 },
  ]);
  const alza = k(320.15);
  const mb = mano(f);
  const bid = f < k(318.4) ? { x: BID.x0, y: PS } : f < k(319.0) && mb ? { x: mb.x, y: mb.y + 80 } : { x: BID.x1, y: BID.y1 };
  const jarras = [{ x: 584, u: 0, t: 319.0, r: "NOW" }, { x: 645, u: 0.5, t: 319.4, r: "3 MO" }];
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={148} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(k(NAF.S4), 560, 660, 1.85), mira(k(NAF_B) + 8, 566, 662, 1.88)]}
        medio={<>
          <Pickup x={480} color="#3a5a8a" />
          <g transform={`translate(${bid.x},${bid.y})`}><Bidon /></g>
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} dir={[{ f: 0, v: 1 }]} ikD={mano}
            poses={[{ f: 0, v: "agacharse" }, { f: k(318.45), v: "parado", d: 12 }, { f: k(319.15), v: "señalar", d: 12 }, { f: k(319.75), v: "parado", d: 12 }, { f: k(320.7), v: "manosCintura", d: 12 }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(319.15), v: "duda" }, { f: k(320.7), v: "asco" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(318.6), v: { x: 1, y: 0.2 } }, { f: k(319.15), v: { x: 1, y: 0.5 } }, { f: k(320.15), v: { x: 1, y: 0.4 } }, { f: k(320.5), v: { x: 1, y: -0.5 } }]} />
          {jarras.map((j) => {
            if (f < k(j.t)) return null;
            const sp = sprV3({ frame: f - k(j.t), fps, config: { damping: 12, stiffness: 160 } });
            const enMano = j.u > 0 && f >= alza;
            const m = enMano ? mano(f) : null;
            const x = m ? m.x : j.x, y = m ? m.y + 30 * S : PS - 160 - 24 * S;
            return <g key={j.r} transform={`translate(${x},${y})`}><g transform={`scale(${sp})`}><Frasco u={j.u} s={S} /><EtiqFrasco r={j.r} s={S} /></g></g>;
          })}
        </>} />
    </AbsoluteFill>
  );
};
const Generador47: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const PS = SUP_PISO;
  const GX = 620, TX = 850;
  const { fps } = vcV3();
  const mango = { x: GX + 96, y: PS - 150 + 44 };
  const tiros = [k(321.95), k(322.75)];
  // la mano: agarra el mango y tira dos veces (hacia atrás y arriba), después suelta
  const mano = ikClaves([{ f: k(321.45), x: mango.x + 22, y: mango.y + 6 }, { f: k(321.8), x: mango.x + 22, y: mango.y + 6 }, { f: tiros[0], x: TX + 50, y: PS - 270 }, { f: k(322.35), x: mango.x + 22, y: mango.y + 6 }, { f: k(322.6), x: mango.x + 22, y: mango.y + 6 }, { f: tiros[1], x: TX + 50, y: PS - 270 }, { f: k(323.2), x: mango.x + 22, y: mango.y + 6 }, { f: k(323.45), x: TX - 30, y: PS - 140, w: 0 }]);
  const tiene = (ff: number) => ff < k(323.3);
  const m = mano(f);
  const sp = f < k(321.5) ? 0 : sprV3({ frame: f - k(321.5), fps, config: { damping: 12, stiffness: 160 } });
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={149} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(k(NAF_B), 730, 730, 2.0), mira(k(NAF.S5), 736, 732, 2.04)]}
        medio={<>
          <Generador x={GX} piso={PS} tiros={tiros} soga={tiene(f) && m ? { x: m.x, y: m.y } : null} />
          {sp > 0 && <g transform={`translate(${GX - 20},${PS - 186 - 24 * 1.15})`}><g transform={`scale(${sp})`}><Frasco u={1} s={1.15} /><EtiqFrasco r="1 YR" s={1.15} /></g></g>}
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} dir={[{ f: 0, v: -1 }]} ikD={mano}
            brz={[{ f: 0, v: null }, { f: tiros[0] - 4, v: { tronco: -10 }, d: 6 }, { f: k(322.35), v: { tronco: 6 }, d: 8 }, { f: tiros[1] - 4, v: { tronco: -12 }, d: 6 }, { f: k(323.2), v: null, d: 10 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(323.5), v: "manosCintura", d: 12 }, { f: k(324.0), v: "brazosCruzados", d: 12 }]}
            caras={[{ f: 0, v: "determinado" }, { f: tiros[0] + 6, v: "duda" }, { f: tiros[1] + 6, v: "enojo" }, { f: k(323.4), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: tiros[0] + 6, v: { x: 1, y: 0.2 } }, { f: k(323.4), v: { x: 0.4, y: 0.6 } }]} />
        </>} />
      <Rotulo3 texto="1 YEAR · ENGINES WON'T RUN" x={960} y={170} desde={k(322.3)} color="#ffffff" tam={40} />
    </AbsoluteFill>
  );
};
const Tablero47: React.FC<{ k: (t: number) => number }> = ({ k }) => (
  <AbsoluteFill>
    <Tablero gira={k(324.8)} nivel={0.62} manga="#c8582b" />
    <Rotulo3 texto="EVERY DRIVE IS A DECISION" x={960} y={200} desde={k(324.7)} color="#ffffff" tam={44} />
  </AbsoluteFill>
);

// 48 · la lista de la heladera (June la escribe; cada renglón se tacha) · Theo: se rasca la nuca, cruza los brazos, mira para otro lado
const DUR48 = durDe(326.52, 339.96);
export const P48Lista: React.FC = () => {
  const f = useF();
  return f >= DUR48 ? <Desfase d={DUR48}><P49In /></Desfase> : <P48In />;
};
const P48In: React.FC = () => {
  const k = kDe(326.52);
  const t = (s: string, i: number, a: number, b: number, tach?: number): Lin => ({ t: s, x: LX, y: listaY(i), tam: i === 0 ? 13 : 14.5, desde: k(a), hasta: k(b), color: i === 0 ? ROJO_CENSO : "#1d3a8a", tachado: tach === undefined ? undefined : k(tach), ancho: Math.min(104, s.length * (i === 0 ? 13 : 14.5) * 0.46) });
  const ls2 = [t("ONLY HUMANS DID:", 0, 329.45, 330.7), t("fix the pumps", 1, 331.5, 332.35, 336.0), t("clear the roads", 2, 332.76, 333.7, 337.0), t("treat the water", 3, 333.9, 334.85, 338.0)];
  const JX = 3215;
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={48} setProps={LIV_OTONO}
        claves={[mira(0, 3060, 630, 1.55), mira(k(328.6), 3070, 630, 1.56), mira(k(329.4), 3440, 650, 2.35, { curva: "inout" }), mira(k(335.0), 3450, 650, 2.36), mira(k(335.9), 3110, 630, 1.55, { curva: "inout" })]}
        medio={<>
          <HeladeraJune ls={REGLAS_HECHAS(6)} lista ls2={ls2} />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: 2860, y: P }]} ikI={ikClaves([{ f: k(335.6), x: 2876, y: P - 232 }, { f: k(337.0), x: 2876, y: P - 232 }, { f: k(337.4), x: 2860, y: P - 120, w: 0 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(331.6), v: "pensar" }, { f: k(333.0), v: "parado" }, { f: k(337.4), v: "brazosCruzados" }, { f: k(338.6), v: "manosCintura" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(331.6), v: "duda" }, { f: k(336.0), v: "triste" }, { f: k(338.4), v: "cansado" }, { f: k(339.1), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(338.4), v: { x: -1, y: 0.3 } }, { f: k(339.1), v: { x: 1, y: 0 } }]}
            giros={[{ f: k(335.7), v: 0 }, { f: k(336.1), v: -0.3 }, { f: k(336.6), v: 0.2 }, { f: k(337.1), v: 0 }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 3150, y: P }, { f: k(328.0), x: 3150 }, { f: k(329.2), x: JX }, { f: k(335.5), x: JX }, { f: k(336.4), x: 3050 }]} ikD={ikEscribir(ls2)} objD={{ el: <Marcador />, rot: -90 }}
            brz={[{ f: k(329.0), v: { tronco: 14, cabeza: 4 }, d: 10 }, { f: k(335.4), v: null, d: 12 }]} dir={[{ f: 0, v: 1 }, { f: k(335.6), v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(338.4), v: "brazosCruzados" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(329.4), v: "determinado" }, { f: k(336.0), v: "triste" }, { f: k(339.1), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(335.6), v: { x: 1, y: 0 } }]} seed={2} />
        </>} />
      <Vineta x={1680} y={260} icono="bomba" rotulo="PUMPS" desde={k(331.6)} apagar={k(336.0)} tachar={k(336.3)} tam={120} />
      <Vineta x={1680} y={490} icono="quitanieve" rotulo="PLOWS" desde={k(332.85)} apagar={k(337.0)} tachar={k(337.3)} tam={120} />
      <Vineta x={1680} y={720} icono="planta" rotulo="WATER PLANT" desde={k(334.0)} apagar={k(338.0)} tachar={k(338.3)} tam={120} />
    </AbsoluteFill>
  );
};

// 49 · día 33: la primera nevada. General corto → CORTE al dos-plano: June ataja un copo; Theo se cierra la campera y tirita
export const P49Nieve: React.FC = () => {
  const f = useF();
  return f < 0 ? <Desfase d={-DUR48}><P48In /></Desfase> : <P49In />;
};
const P49In: React.FC = () => {
  const f = useF();
  const k = kDe(339.96);
  const JX = 1560, TX = 1130, PB = BARRIO_PISO;
  const nevando = f >= k(341.1);
  const copoY = interpolate(f, [k(341.3), k(342.2)], [380, PB - 214], CL);
  // v5f: sin cortes ni saltos: general (humo en la chimenea, Theo mira el cielo) → empuje inout 16 cuadros al dos-plano →
  // Theo se sube el cierre despacio (342,6-344,2) y tirita abrazándose → empuje inout 16 cuadros al primer plano de June
  const cl = [mira(0, 1640, 470, 0.95), mira(k(340.9), 1630, 480, 0.97), mira(k(341.45), 1350, 640, 1.45, { curva: "inout" }), mira(k(344.6), 1350, 640, 1.48),
    mira(k(345.15), JX + 130, 610, 2.1, { curva: "inout" }), mira(k(347.48), JX + 130, 612, 2.14)];
  const kZ0 = k(342.6), kZ1 = k(344.2);
  const zip = tw(f, kZ0 + 6, kZ1, 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={49} setProps={{ hora: "invierno", luces: 0, nieve: tw(f, k(341.1), k(347), 0, 0.25), cae: nevando, humo: 1, ventanaCasa: 1 }} claves={cl}
        medio={<>
          <PuertaCasa x={1900} piso={PB} abre={0} />
          <HumoV5 x={2090} y={142} oscuro="#3a3646" claro="#e6e3ee" alto={210} />
          {f >= k(341.3) && <g transform={`translate(${JX + 52 + Math.sin(f / 6) * 8 * (1 - tw(f, k(341.9), k(342.2), 0, 1))},${copoY})`} opacity={1 - tw(f, k(344.0), k(345.0), 0, 1)}>{[0, 60, 120].map((r) => <rect key={r} x={-1.5} y={-9} width={3} height={18} fill="#fff" transform={`rotate(${r})`} />)}</g>}
          <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: PB }]} ikD={(ff) => (ff < k(340.9) ? null : { x: JX + 52, y: PB - 205, w: tw(ff, k(340.9), k(341.3), 0, 1) * (1 - tw(ff, k(344.6), k(345.0), 0, 1)) })}
            poses={[{ f: 0, v: "parado" }, { f: k(344.7), v: "manosCintura" }, { f: k(345.7), v: "pensar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(341.2), v: "sorpresa" }, { f: k(342.3), v: "feliz" }, { f: k(344.78), v: "duda" }, { f: k(345.7), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(341.2), v: { x: 0.4, y: -1 } }, { f: k(342.2), v: { x: 1, y: 0.8 } }, { f: k(344.78), v: { x: -1, y: -0.2 } }, { f: k(346.6), v: { x: 1, y: 0 } }]} seed={2} />
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PB }]}
            ikD={ikClaves([{ f: kZ0, x: TX + 18, y: PB - 112 }, { f: kZ0 + 6, x: TX + 18, y: PB - 112 }, { f: kZ1, x: TX + 16, y: PB - 238 }, { f: kZ1 + 8, x: TX + 16, y: PB - 238 }, { f: kZ1 + 18, x: TX + 10, y: PB - 150, w: 0 }])}
            ikI={ikClaves([{ f: kZ0, x: TX + 6, y: PB - 104 }, { f: kZ1, x: TX + 6, y: PB - 104 }, { f: kZ1 + 12, x: TX, y: PB - 104, w: 0 }])}
            ajuste={(p, ff) => (ff < kZ1 + 10 ? p : { ...p, tronco: p.tronco + Math.sin(ff * 1.9) * 1.8, cabeza: (p.cabeza ?? 0) + Math.sin(ff * 2.6) * 1.2 })}
            poses={[{ f: 0, v: "parado" }, { f: k(341.4), v: "señalar", d: 12 }, { f: k(342.3), v: "parado", d: 10 }, { f: kZ1 + 10, v: "brazosCruzados", d: 12 }, { f: k(345.0), v: "encogerse", d: 12 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(341.3), v: "sorpresa" }, { f: k(342.0), v: "feliz" }, { f: kZ0 + 6, v: "determinado" }, { f: kZ1, v: "cansado" }]}
            miradas={[{ f: 0, v: { x: 0.3, y: -1 } }, { f: k(341.7), v: { x: 1, y: -0.3 } }, { f: kZ0 + 6, v: { x: 0.3, y: 0.9 } }, { f: kZ1, v: { x: 1, y: 0 } }]} />
          <CuelloCampera x={TX + 2} y={PB - 204} u={zip * 0.62} color="#9a4220" />
          <Vaho x={TX + 22} y={PB - 252} cada={60} o={nevando ? tw(f, k(343.6), k(344), 0, 1) : 0} />
          <Vaho x={JX + 22} y={PB - 252} cada={70} o={nevando ? tw(f, k(342.4), k(342.8), 0, 1) : 0} />
        </>} />
      {f >= k(341.3) && <EtiquetaFlotante x={560} y={230} rotulo="OUTSIDE · OCTOBER" claves={[{ f: k(341.5), v: 38 }, { f: k(343.4), v: 27, d: 40 }]} sufijo="°F" color={FRIO} tam={64} hasta={k(344.7)} />}
    </AbsoluteFill>
  );
};

// 50 · −30: el número (Theo de cuerpo entero en el puente) → CORTE primer plano tiritando → CORTE las mínimas de cada mes → CORTE la casa sin calor
export const P50Menos30: React.FC = () => {
  const k = kDe(347.48);
  const k4 = k(357.4);
  // v5f: el puente es UNA sola Escena (número → primer plano tiritando → gráfico) unida por empujes inout de 16 cuadros;
  // a la casa sin calor entra con fundido de 6 cuadros (SubTomas)
  return <SubTomas tomas={[{ desde: -999, el: () => <Puente50 k={k} /> }, { desde: k4, el: () => <Casa50 k={k} /> }]} />;
};
const Puente50: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const TX = 1650, PP = PUENTE_PISO;
  const k2 = k(350.4), k3 = k(353.3), k4 = k(357.4);
  const cl = [mira(0, TX - 40, 600, 1.25), mira(k2 - 8, TX - 30, 604, 1.28), mira(k2 + 8, TX + 20, 610, 2.1, { curva: "inout" }), mira(k3 - 8, TX + 20, 614, 2.16),
    mira(k3 + 8, TX - 8, 520, 1.1, { curva: "inout" }), mira(k4, TX - 2, 522, 1.12)];
  return (
    <AbsoluteFill>
      <Escena Set={PuenteV3} pal={PAL} seed={50} setProps={{ hora: "noche", luces: 1, nieve: 1, vapor: 1, cae: true, hielo: 0.6 }} claves={cl}
        medio={<>
          <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PP }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "parado" }, { f: k(348.4), v: "manosCintura", d: 12 }, { f: k(349.55), v: "manosCara", d: 12 }, { f: k2, v: "encogerse", d: 12 }, { f: k(352.1), v: "brazosCruzados", d: 12 }, { f: k3, v: "parado", d: 12 }, { f: k(354.5), v: "señalar", d: 12 }, { f: k(355.84), v: "encogerse", d: 12 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(348.6), v: "duda" }, { f: k(349.55), v: "miedo" }, { f: k(351.4), v: "cansado" }, { f: k3, v: "duda" }, { f: k(354.5), v: "sorpresa" }, { f: k(355.84), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 0.4, y: -1 } }, { f: k(349.55), v: { x: 1, y: 0 } }, { f: k(351.4), v: { x: 1, y: 0.5 } }, { f: k(352.6), v: { x: -1, y: 0.2 } }, { f: k3, v: { x: 0.3, y: -1 } }, { f: k(355.84), v: { x: 1, y: 0 } }]}
            ajuste={(p, ff) => (ff < k2 ? p : { ...p, tronco: p.tronco + Math.sin(ff * 2.1) * 1.8, cabeza: (p.cabeza ?? 0) + Math.sin(ff * 2.7) * 1.2 })} />
          <g opacity={tw(f, k(350.6), k(351.6), 0, 1)}>{[[-26, -300], [-8, -318], [14, -312], [28, -296], [0, -330]].map(([dx, dy], i) => <circle key={i} cx={TX + dx} cy={PP + dy} r={4} fill="#ffffff" />)}</g>
          <Vaho x={TX + 24} y={PP - 252} cada={44} o={tw(f, k(349.3), k(349.8), 0, 1)} />
        </>} />
      <Num3230V5 y={130} cambia={k(349.5)} desde={k(347.6)} hasta={k2 - 14} rotulo="THE NUMBER THAT MATTERS UP HERE" />
      <Rotulo3 texto="JANUARY NIGHTS · NORTH SHORE" x={960} y={150} desde={k(351.0)} hasta={k3 - 14} color={FRIO} tam={40} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 52% 46% at 50% 34%, rgba(8,10,22,0.55), rgba(8,10,22,0) 100%)", opacity: tw(f, k3, k3 + 10, 0, 1) * (1 - tw(f, k4 - 10, k4, 0, 1)) }} />
      <GraficoFrioV5 x={450} y={110} desde={k3 + 8} marca={k(354.4)} hasta={k4 - 10} />
    </AbsoluteFill>
  );
};
const Casa50: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const TX = 1330;
  const fro = (ff: number, lado: number) => ({ x: TX - 18 + lado * 6 + Math.sin(ff / 3.2 + lado) * 14, y: P - 196 + Math.cos(ff / 3.2 + lado) * 8 });
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={150} setProps={{ ...LIV_INV, hora: "noche", fuego: 0, cae: true }} claves={[mira(k(357.4), 1480, 600, 1.4), mira(k(360.6), 1490, 604, 1.45)]}
        medio={<>
          <CanoEstufa />
          <Escarcha x={1072} y={242} w={456} h={396} u={tw(f, k(357.4), k(360.5), 0.2, 0.7, (t) => t)} />
          <EscarchaEsquina />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} ikD={(ff) => fro(ff, 1)} ikI={(ff) => fro(ff, -1)} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "cansado" }, { f: k(358.7), v: "miedo" }, { f: k(359.9), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(358.7), v: { x: 1, y: -0.5 } }, { f: k(359.9), v: { x: -1, y: 0.2 } }]} />
          <Vaho x={TX + 24} y={P - 252} cada={50} />
        </>} />
      <EtiquetaFlotante x={1300} y={330} rotulo="INSIDE THE HOUSE" claves={[{ f: k(357.6), v: 65 }, { f: k(358.0), v: 12, d: 66 }]} sufijo="°F" color={FRIO} tam={72} desde={k(357.5)} />
    </AbsoluteFill>
  );
};

// 51 · congelamiento en 10 minutos: sin estufa, la escarcha avanza; Theo se sopla las manos → se le escarchan las puntas de los dedos
export const P51Helada: React.FC = () => {
  const f = useF();
  const k = kDe(360.54);
  const seg = Math.max(0, 600 - Math.floor(Math.max(0, f - k(362.2)) * 3.2));
  const TX = 1640; // v5f: fuera de la ventana (la cabeza ya no pisa el marco), a 310 de la estufa
  const boca = { x: TX + 24, y: P - 250 };
  const mira2 = k(364.0);
  // v5f: sopla (0) → se frota las manos frente al pecho (362,2) → las mira (364,0) → las esconde bajo los brazos (365,0)
  const kR = k(362.2), kE = k(366.5); // (kE fuera del plano: se queda mirando los dedos escarchados)
  const frota = (ff: number, l: number) => ({ x: TX + 30 + l * 4 + Math.sin(ff * 0.9) * 12 * l, y: P - 176 + Math.cos(ff * 0.9) * 4 });
  const sopla = (ff: number) => (ff < kR ? { x: boca.x, y: boca.y + 6 } : ff < mira2 ? frota(ff, 1) : ff < kE ? { x: TX + 70, y: P - 236 } : { x: TX + 70, y: P - 236, w: 1 - tw(ff, kE, kE + 10, 0, 1) });
  const sopla2 = (ff: number) => (ff < kR ? { x: boca.x - 8, y: boca.y + 14 } : ff < mira2 ? frota(ff, -1) : ff < kE ? { x: TX + 50, y: P - 214 } : { x: TX + 50, y: P - 214, w: 1 - tw(ff, kE, kE + 10, 0, 1) });
  const hielo = tw(f, mira2 + 4, mira2 + 20, 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={51} setProps={{ ...LIV_INV, hora: "noche", fuego: 0, cae: true }} claves={[mira(0, 1700, 600, 1.45), mira(k(366.0), 1690, 606, 1.55)]}
        medio={<>
          <CanoEstufa />
          <Escarcha x={1072} y={242} w={456} h={396} u={tw(f, 0, k(365.9), 0.4, 1, (t) => t)} />
          <EscarchaEsquina />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} ikD={sopla} ikI={sopla2}
            poses={[{ f: 0, v: "encogerse" }, { f: kE, v: "brazosCruzados", d: 12 }]} caras={[{ f: 0, v: "miedo" }, { f: k(362.2), v: "cansado" }, { f: mira2, v: "sorpresa" }, { f: k(364.8), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: kR, v: { x: -1, y: -0.2 } }, { f: mira2, v: { x: 1, y: 0.7 } }, { f: kE, v: { x: 1, y: 0 } }]} luz={BORDE_FRIO}
            ajuste={(p, ff) => ({ ...p, tronco: p.tronco + Math.sin(ff * 2.3) * 1.4 })} />
          <Vaho x={boca.x + 6} y={boca.y} cada={30} o={f < mira2 ? 1 : 0} />
          {hielo > 0 && [[TX + 82, P - 240], [TX + 76, P - 228], [TX + 62, P - 216], [TX + 56, P - 206]].map(([x, y], i) => <g key={i} opacity={hielo}><circle cx={x} cy={y} r={7 * hielo} fill="#eaf6ff" /><path d={`M${x - 9},${y} h18 M${x},${y - 9} v18`} stroke="#ffffff" strokeWidth={2} /></g>)}
        </>} />
      <Pildora texto="FROSTBITE AT −30°F" x={1660} y={250} desde={k(361.2)} color={FRIO} tam={32} />
      <Temporizador seg={seg} x={1660} y={390} desde={k(362.2)} color={FRIO} tam={56} />
    </AbsoluteFill>
  );
};

// 52 · las cuentas: sentados en tocones junto a la estufa, Theo le pasa el cuaderno → el gráfico a mano (sin saltos) → los tres riesgos en la pared
const SENTADO = { TX: 1430, JX: 1770 };
const DUR52 = durDe(365.98, 383.32);
export const P52Cuentas: React.FC = () => {
  const f = useF();
  const k = kDe(365.98);
  const A = k(368.1), B = k(376.1);
  if (f >= DUR52) return <Desfase d={DUR52}><P53In /></Desfase>;
  // v5f: sub-tomas con fundido de 6 cuadros (antes: corte seco)
  return (
    <SubTomas tomas={[
      { desde: -999, el: () => <SeqEntrega k={k} /> },
      { desde: A, el: () => <Desfase d={A}><SeqGrafico k={(t) => k(t) - A} /></Desfase> },
      { desde: B, el: () => <Desfase d={B}><SeqRiesgos k={(t) => k(t) - B} /></Desfase> },
    ]} />
  );
};
const Tocones: React.FC = () => <><Tocon x={SENTADO.TX} piso={P} alto={58} /><Tocon x={SENTADO.JX} piso={P} alto={58} w={90} /></>;
const SeqEntrega: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const { TX, JX } = SENTADO;
  const pasa = k(367.3);
  return (
    <Escena Set={Living} pal={PAL} seed={52} setProps={{ ...LIV_INV, hora: "noche", fuego: 1 }} claves={[mira(0, 1600, 640, 1.6), mira(k(368.1), 1600, 646, 1.66)]}
      detras={<Tocones />}
      medio={<>
        <CanoEstufa />
        <EscarchaEsquina />
        <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 58 }]}
          ikD={ikClaves([{ f: k(366.2), x: TX + 70, y: P - 120 }, { f: k(367.0), x: 1596, y: P - 150 }, { f: pasa, x: 1596, y: P - 150 }, { f: k(367.7), x: TX + 60, y: P - 110, w: 0 }])}
          objD={(ff) => (ff < pasa ? { el: <CuadernoMano />, rot: 0 } : undefined)}
          caras={[{ f: 0, v: "determinado" }, { f: k(366.7), v: "duda" }, { f: pasa, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(366.7), v: { x: 1, y: 0.5 } }, { f: pasa, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 58 }]}
          ikD={ikClaves([{ f: k(366.9), x: 1620, y: P - 150 }, { f: pasa, x: 1620, y: P - 150 }, { f: k(367.8), x: JX - 70, y: P - 130 }])} objD={(ff) => (ff >= pasa ? { el: <CuadernoMano abierto />, rot: 0 } : undefined)}
          caras={[{ f: 0, v: "neutral" }, { f: pasa, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: pasa, v: { x: 1, y: 0.6 } }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};
const SeqGrafico: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const { fps } = vcV3();
  const titulo: Lin = { t: "2 careful people + 1 city", x: 400, y: 380, tam: 50, desde: k(368.4), hasta: k(369.85), color: "#1d2a4a", ancho: 540 };
  const anos: Lin = { t: "= YEARS", x: 480, y: 520, tam: 96, desde: k(370.5), hasta: k(371.7), color: ROJO_CENSO, ancho: 380 };
  const filas: [string, number, number, string][] = [["food", 372.52, 290, "years"], ["water", 373.28, 380, "∞"], ["shelter", 373.9, 250, "✓"], ["tools", 374.46, 230, "✓"]];
  const tip = puntaMano([tramoLin(titulo), tramoLin(anos)], f, [1760, 1040], [1900, 1300]);
  const todo = tw(f, k(374.8), k(375.3), 0, 1);
  return (
    <AbsoluteFill>
      <CuadernoGrande renglones={[]} zoom={[0, 1, 1]} />
      <Svg><g transform="rotate(-3 960 540)">
        <Lineas ls={[titulo, anos]} />
        {filas.map(([n, t, w, fin], i) => {
          const y = 360 + i * 100;
          const a = k(t) - 4;
          if (f < a) return null;
          const o = tw(f, a, a + 8, 0, 1);
          const s = sprV3({ frame: f - a - 3, fps, config: { damping: 15, stiffness: 120 } });
          const c = i === 0 ? AMBAR : i === 1 ? "#5ab0ff" : "#3aa86a";
          return <g key={n} opacity={o}>
            <text x={1000} y={y} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#1d2a4a">{n}</text>
            <rect x={1150} y={y - 36} width={Math.max(0, w * s)} height={44} rx={6} fill={c} opacity={0.85} />
            <rect x={1150} y={y - 36} width={Math.max(0, w * s)} height={44} rx={6} fill="none" stroke="#1d2a4a" strokeWidth={3} />
            {s > 0.85 && <text x={1150 + w + 16} y={y} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#1d2a4a" opacity={tw(f, a + 12, a + 20, 0, 1)}>{fin}</text>}
          </g>;
        })}
        {todo > 0 && <rect x={970} y={300} width={760 * todo} height={420} rx={30} fill="none" stroke="#3aa86a" strokeWidth={8} opacity={0.9} />}
        <ManoLapiz x={tip[0]} y={tip[1]} manga="#2f7f86" />
      </g></Svg>
    </AbsoluteFill>
  );
};
const SeqRiesgos: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const { TX, JX } = SENTADO;
  const junta = tw(f, k(380.3), k(381.1), 0, 1);
  const xs = [1000, 1180, 1360].map((x) => lerp(x, 1180 + (x - 1180) * 0.86, junta));
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={152} setProps={{ ...LIV_INV, hora: "noche", fuego: 1 }} claves={[mira(0, 1590, 600, 1.5), mira(k(383.4), 1590, 606, 1.56)]}
        detras={<Tocones />}
        medio={<>
          <CanoEstufa />
          <EscarchaEsquina />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 58 }]}
            ikD={ikClaves([{ f: k(377.9), x: TX + 34, y: P - 196 }, { f: k(378.9), x: TX + 34, y: P - 196 }, { f: k(379.3), x: TX + 50, y: P - 110, w: 0 }, { f: k(381.9), x: TX + 50, y: P - 110, w: 0 }, { f: k(382.3), x: TX - 16, y: P - 146 }])}
            ikI={ikClaves([{ f: k(377.9), x: TX + 4, y: P - 192 }, { f: k(378.9), x: TX + 4, y: P - 192 }, { f: k(379.3), x: TX + 30, y: P - 110, w: 0 }, { f: k(381.9), x: TX + 30, y: P - 110, w: 0 }, { f: k(382.3), x: TX + 34, y: P - 150 }])}
            ajuste={(p, ff) => (ff < k(382.2) ? p : { ...p, tronco: p.tronco + Math.sin(ff * 2.2) * 1.6 })}
            caras={[{ f: 0, v: "neutral" }, { f: k(377.98), v: "miedo" }, { f: k(379.7), v: "duda" }, { f: k(380.4), v: "triste" }, { f: k(381.98), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(377.98), v: { x: 1, y: -0.6 } }, { f: k(380.4), v: { x: 1, y: 0 } }, { f: k(381.98), v: { x: -1, y: -0.3 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 58 }]} ikD={() => ({ x: JX - 70, y: P - 130 })}
            ikI={ikClaves([{ f: k(378.0), x: JX - 60, y: P - 300, w: 0 }, { f: k(378.4), x: JX - 70, y: P - 330 }, { f: k(380.2), x: JX - 70, y: P - 330 }, { f: k(380.6), x: JX - 20, y: P - 160, w: 0 }])}
            objD={{ el: <CuadernoMano abierto />, rot: 0 }} caras={[{ f: 0, v: "duda" }, { f: k(378.0), v: "determinado" }, { f: k(381.2), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(378.0), v: { x: 1, y: -0.5 } }, { f: k(381.0), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Vineta x={xs[0]} y={240} icono="tobillo" rotulo="INJURY" desde={k(378.0)} acento="#e2483a" tam={140} />
      <Vineta x={xs[1]} y={240} icono="corte" rotulo="INFECTION" desde={k(378.84)} acento="#e2483a" tam={140} />
      <Vineta x={xs[2]} y={240} icono="frio" rotulo="COLD" desde={k(379.66)} acento={FRIO} tam={140} />
      {junta > 0 && <Svg><path d={`M${xs[0] - 84},380 Q${xs[0] - 84},402 ${xs[0] - 60},402 H${xs[2] + 60} Q${xs[2] + 84},402 ${xs[2] + 84},380`} stroke={FRIO} strokeWidth={6} fill="none" opacity={junta} /></Svg>}
      <Rotulo3 texto="ONE SEASON: WINTER" x={1180} y={470} desde={k(381.98)} color={FRIO} tam={36} />
    </AbsoluteFill>
  );
};

// 53 · invierno, día 41, 9:14 pm: Theo cruza el puente (faro anclado al muelle) → CORTE plano medio: manos en los bolsillos, el lago humea → algo pasa
export const P53Puente: React.FC = () => {
  const f = useF();
  return f < 0 ? <Desfase d={-DUR52}><SeqRiesgosLap /></Desfase> : <P53In />;
};
const SeqRiesgosLap: React.FC = () => {
  const k = kDe(365.98);
  const B = k(376.1);
  return <Desfase d={B}><SeqRiesgos k={(t) => k(t) - B} /></Desfase>;
};
const P53In: React.FC = () => {
  const f = useF();
  const k = kDe(383.32);
  const TX = 1650, PP = PUENTE_PISO;
  const kB = k(387.3);
  const tit = fundidoLuz(f, [[k(391.6), 1], [k(391.6) + 9, 0.4], [k(391.6) + 18, 1], [k(392.25), 1], [k(392.25) + 9, 0.55], [k(392.25) + 18, 1]]);
  // v5f: sin general ni salto en 385,0: arranca en plano medio (zoom 1,45) y acompaña a Theo con claves inout
  const cl = [mira(0, 1420, 640, 1.45), mira(k(386.95), TX + 40, 640, 1.6, { curva: "inout" }), mira(k(392.7), TX + 30, 640, 1.7, { curva: "inout" })];
  return (
    <AbsoluteFill>
      <Escena Set={PuenteV3} pal={PAL} seed={53} setProps={{ hora: "noche", luces: 1, farolas: tit, nieve: 1, vapor: 1, hielo: 0.3, cae: true }} claves={cl}
        medio={<>
          <PjX look={THEO_INV} ruta={[{ f: 0, x: 1370, y: PP }, { f: k(386.9), x: TX }]} dir={[{ f: 0, v: 1 }]}
            brz={[{ f: k(387.3), v: { hD: 40, cD: 60, hI: 35, cI: 65 }, d: 12 }, { f: k(391.2), v: null, d: 12 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(391.22), v: "encogerse" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(387.6), v: "cansado" }, { f: k(390.0), v: "feliz" }, { f: k(391.22), v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(388.3), v: { x: 1, y: -0.3 } }, { f: k(389.7), v: { x: -1, y: -0.1 } }, { f: k(391.22), v: { x: 1, y: -0.6 } }]} luz={BORDE_FRIO} />
          <Vaho x={TX + 24} y={PP - 252} cada={56} o={tw(f, k(386.8), k(387.4), 0, 1)} />
        </>} />
      {f < kB && <RelojDia min={21 * 60 + 14} x={1200} y={170} desde={k(383.9)} />}
    </AbsoluteFill>
  );
};

// 54 · el apagón (v5f: 5 sub-tomas con fundido de 6 cuadros, cada una con su evento)
//   T1 Superior Street general: la ola apaga manzana por manzana (izq → der, 1 franja cada 6 cuadros, fundido de 6)
//   T2 primer plano de Theo en el puente: la farola sobre él se apaga → sorpresa → miedo (el GOLPE)
//   T3 UN general desde el puente, Theo en primer término: la ciudad de enfrente se apaga en ola (12 franjas); señala los
//      carteles, se agarra la cabeza con el hospital, se encoge con la ciudad entera; gira río arriba y señala
//   T4 río arriba: la línea que se corta (sin nadie en la casilla)    T5 Theo sale CORRIENDO y la cámara lo sigue
const AP = { c2: 394.6, c3: 395.95, c5: 400.9, c6: 405.0 };
export const P54Apagon: React.FC = () => {
  const k = kDe(392.68);
  const c5 = k(AP.c5);
  return (
    <SubTomas tomas={[
      { desde: -999, el: () => <Calle54 k={k} /> },
      { desde: k(AP.c2), el: () => <Farola54 k={k} /> },
      { desde: k(AP.c3), el: () => <Ola54 k={k} /> },
      { desde: c5, el: () => <Desfase d={c5}><LineaRota rotura={k(403.06) - c5} nadie={k(403.95) - c5} /></Desfase> },
      { desde: k(AP.c6), el: () => <Corre54 k={k} /> },
    ]} />
  );
};
const Calle54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const cl = [mira(0, 2330, 560, 0.8), mira(k(AP.c2) + 6, 2345, 562, 0.83)];
  const esc = (luces: number) => <Escena Set={Superior} pal={PAL} seed={154} setProps={{ hora: "noche", luces, rotulos: true }} claves={cl} />;
  return <OlaApagon on={esc(1)} off={esc(0)} f0={k(392.85)} n={8} paso={6} fade={6} />;
};
const P54_TX = 1650;
const Farola54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const TX = P54_TX, PP = PUENTE_PISO;
  const kL = k(395.1);
  const l = fundidoLuz(f, [[kL, 1], [kL + 8, 0]]);
  return (
    <AbsoluteFill>
      <Escena Set={PuenteV3} pal={PAL} seed={155} setProps={{ hora: "noche", luces: 1, farolas: l, nieve: 1, vapor: 0.8, cae: true, ciudad: true }} claves={[mira(k(AP.c2), TX + 30, 600, 2.4), mira(k(AP.c3) + 6, TX + 30, 606, 2.46)]}
        medio={<>
          {l > 0.02 && <Halo x={TX + 120} y={PP - 420} r={460} color="#ffcf6e" fuerza={0.5 * l} />}
          <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PP }]} dir={[{ f: 0, v: 1 }]} brz={[{ f: 0, v: { hD: 40, cD: 60, hI: 35, cI: 65 } }, { f: kL + 10, v: null, d: 12 }]}
            poses={[{ f: 0, v: "parado" }, { f: kL + 10, v: { tronco: -6 }, d: 10 }, { f: k(395.6), v: "manosCara", d: 10 }]}
            caras={[{ f: 0, v: "neutral" }, { f: kL + 2, v: "sorpresa" }, { f: k(395.55), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: kL + 2, v: { x: 0.7, y: -0.9 } }, { f: k(395.6), v: { x: 1, y: -0.1 } }]}
            giros={[{ f: 0, v: 0 }, { f: k(395.6), v: 0.3 }]} luz={l > 0.5 ? BORDE_CALIDO : BORDE_FRIO} />
          <Vaho x={TX + 26} y={PP - 250} cada={40} o={tw(f, k(395.5), k(395.7), 0, 1)} />
        </>} />
      <Rotulo3 texto="STREETLIGHTS" x={960} y={170} desde={kL + 4} color="#f6ecd2" tam={40} />
    </AbsoluteFill>
  );
};
const Ola54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const TX = 980, PP = PUENTE_PISO;
  const cl = [mira(k(AP.c3), 1350, 610, 1.3), mira(k(AP.c5) + 6, 1370, 612, 1.34)];
  const theo = <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PP }]} dir={[{ f: 0, v: 1 }, { f: k(399.95), v: -1 }]} luz={BORDE_FRIO}
    poses={[{ f: 0, v: "manosCara" }, { f: k(396.85), v: "señalar", d: 12 }, { f: k(397.7), v: "manosCara", d: 12 }, { f: k(398.85), v: "encogerse", d: 12 }, { f: k(399.95), v: "parado", d: 10 }, { f: k(400.35), v: "señalar", d: 12 }]}
    caras={[{ f: 0, v: "miedo" }, { f: k(396.85), v: "sorpresa" }, { f: k(397.7), v: "miedo" }, { f: k(398.85), v: "triste" }, { f: k(399.95), v: "duda" }, { f: k(400.4), v: "determinado" }]}
    miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(396.85), v: { x: 1, y: -0.5 } }, { f: k(397.7), v: { x: 1, y: -0.2 } }, { f: k(398.85), v: { x: 0.4, y: 0.5 } }, { f: k(399.95), v: { x: 1, y: -0.3 } }]}
    giros={[{ f: k(399.4), v: 0 }, { f: k(399.55), v: -0.5 }, { f: k(399.7), v: 0.5 }, { f: k(399.85), v: 0 }]} />;
  const esc = (vivo: boolean) => (
    <Escena Set={PuenteV3} pal={PAL} seed={156} setProps={{ hora: "noche", luces: 1, farolas: 0, nieve: 1, vapor: 0.8, cae: true, ciudad: true, apagaDesde: vivo ? 1e9 : -1e9, hospital: vivo ? 1 : 0 }}
      claves={cl} medio={theo} />
  );
  return (
    <AbsoluteFill>
      <OlaApagon on={esc(true)} off={esc(false)} f0={k(396.27)} n={12} paso={7} fade={8} />
      <Rotulo3 texto="SIGNS" x={1300} y={170} desde={k(396.86)} hasta={k(397.45)} color="#f6ecd2" tam={40} />
      <Rotulo3 texto="ST. MARY'S HOSPITAL" x={1300} y={170} desde={k(397.72)} hasta={k(398.5)} color="#f6ecd2" tam={40} />
      <Rotulo3 texto="THE WHOLE CITY · ONE SECOND" x={1300} y={170} desde={k(398.82)} color="#f6ecd2" tam={40} />
    </AbsoluteFill>
  );
};
const Corre54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const TX = P54_TX, PP = PUENTE_PISO;
  const a = k(AP.c6), b = k(406.26) + 6;
  return (
    <Escena Set={PuenteV3} pal={PAL} seed={159} setProps={{ hora: "noche", luces: 0, farolas: 0, nieve: 1, vapor: 1, cae: true, hielo: 0.3, ciudad: true, apagaDesde: -1e9, hospital: 0 }}
      claves={[mira(a, TX + 60, 610, 1.45), mira(a + 8, TX + 70, 610, 1.45), mira(b, TX + 640, 610, 1.45, { curva: "in" })]}
      medio={<PjX look={THEO_INV} ruta={[{ f: a, x: TX, y: PP }, { f: a + 6, x: TX - 14 }, { f: b, x: TX + 700, curva: "in" }]} dir={[{ f: 0, v: -1 }, { f: a + 6, v: 1 }]} luz={BORDE_FRIO}
        poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "miedo" }, { f: a + 6, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />} />
  );
};
// 55 · corre a casa: entra corriendo; June en la ventana con la vela; se abrazan
export const P55Vela: React.FC = () => {
  const f = useF();
  const k = kDe(406.26);
  const JX = 1300, TX = 1400;
  const ab = k(408.9);
  const rT: Paso[] = [{ f: 0, x: 2250, y: P }, { f: k(408.4), x: TX }];
  const w = (ff: number) => tw(ff, ab - 6, ab + 4, 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={55} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.25, cae: true }}
        claves={[mira(0, 1560, 610, 1.4), mira(k(408.2), 1420, 610, 1.6, { curva: "inout" }), mira(k(410.3), 1380, 600, 1.8, { curva: "inout" })]}
        medio={<>
          <CanoEstufa />
          <EscarchaEsquina />
          <Halo x={JX - 40} y={P - 270} r={360} color="#ffcf6e" fuerza={0.55} />
          <PjX look={THEO_INV} ruta={rT} dir={[{ f: 0, v: -1 }]} ikD={(ff) => (ff < ab - 6 ? null : { x: JX - 30, y: P - 200, w: w(ff) })} ikI={(ff) => (ff < ab - 6 ? null : { x: JX - 20, y: P - 175, w: w(ff) })}
            caras={[{ f: 0, v: "miedo" }, { f: k(407.6), v: "sorpresa" }, { f: ab, v: "triste" }, { f: k(409.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(409.6), v: { x: 1, y: 0.4 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }, { f: k(407.4), v: 1 }]} objI={{ el: <Vela f={f} />, rot: 0 }}
            ikI={(ff) => (ff < k(407.4) ? { x: JX - 44, y: P - 236 } : { x: JX - 40, y: P - 170 })} ikD={(ff) => (ff < ab - 6 ? null : { x: TX + 20, y: P - 200, w: w(ff) })}
            poses={[{ f: 0, v: "parado" }, { f: k(407.5), v: "manosCara" }, { f: ab - 6, v: "parado" }]}
            caras={[{ f: 0, v: "triste" }, { f: k(407.5), v: "sorpresa" }, { f: ab, v: "triste" }, { f: k(409.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(409.6), v: { x: 1, y: 0.4 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
    </AbsoluteFill>
  );
};

// 56 · no dice nada: con la vela al pecho toma el cuaderno → inserto: bajo el 2 escribe una línea más → los dos en la ventana
const DUR56 = durDe(410.22, 421.8);
export const P56Linea: React.FC = () => {
  const f = useF();
  const k = kDe(410.22);
  const S = k(412.0), C = k(420.45);
  if (f >= DUR56) return <Desfase d={DUR56}><P57In /></Desfase>;
  // v5f: sub-tomas con fundido de 6 cuadros (antes: cortes secos)
  const linea = () => <Desfase d={S}><SeqLinea k={(t) => k(t) - S} /></Desfase>;
  return (
    <SubTomas tomas={[
      { desde: -999, el: () => <SeqJuneVentana k={k} /> },
      { desde: S, el: linea },
      { desde: k(416.9), el: () => <CaraJune56 k={k} /> },
      { desde: k(418.6), el: linea },
      { desde: C, el: () => <DosVentana k={k} /> },
    ]} />
  );
};
const SeqJuneVentana: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const JX = 1300;
  return (
    <Escena Set={Living} pal={PAL} seed={56} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.2, cae: true }} claves={[mira(0, JX + 20, 600, 2.2), mira(k(412.0), JX + 40, 620, 2.3)]}
      medio={<>
        <EscarchaEsquina />
        <Halo x={JX + 30} y={P - 250} r={300} color="#ffcf6e" fuerza={0.55} />
        <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: P }]} objI={{ el: <Vela f={f} />, rot: 0 }} ikI={() => ({ x: JX + 40, y: P - 190 })}
          ikD={(ff) => (ff < k(411.4) ? null : { x: JX + 90, y: P - 150, w: tw(ff, k(411.4), k(411.9), 0, 1) })}
          caras={[{ f: 0, v: "triste" }, { f: k(410.8), v: "cansado" }, { f: k(411.3), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(410.8), v: { x: -1, y: 0.2 } }, { f: k(411.2), v: { x: 1, y: 0.8 } }]}
          brz={[{ f: k(411.4), v: { tronco: 12 }, d: 10 }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};
const SeqLinea: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const l1: Lin = { t: "90 days of winter.", x: 1060, y: 730, tam: 56, desde: k(413.6), hasta: k(415.5), color: "#1d2a4a", ancho: 430 };
  const l2: Lin = { t: "No power. Two people.", x: 1060, y: 810, tam: 56, desde: k(418.7), hasta: k(419.6), color: "#1d2a4a", ancho: 500 };
  const sub = tw(f, k(419.7), k(420.3), 0, 1);
  const tip = puntaMano([tramoLin(l1), tramoLin(l2), { a: k(419.7), b: k(420.3), tip: (u) => [1560 - 500 * u, 836] }], f, [1780, 1060], [2300, 1500]);
  return (
    <AbsoluteFill>
      <CuadernoGrande renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }]} zoom={[0, 1, 1]} vela />
      <Svg><g transform="rotate(-3 960 540)">
        <PaginaCenso uT={1} uD={1} />
        <Lineas ls={[l1, l2]} />
        {sub > 0 && <path d={`M1560,834 L${1560 - 500 * sub},838`} stroke={ROJO_CENSO} strokeWidth={6} strokeLinecap="round" />}
        <ManoLapiz x={tip[0]} y={tip[1]} manga="#2f7f86" tiembla={1} />
      </g></Svg>
    </AbsoluteFill>
  );
};
// v4: entre las dos líneas, CORTE seco al primer plano de June: levanta la vista del cuaderno hacia la ventana a oscuras, traga, vuelve a escribir
const CaraJune56: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const JX = 1300;
  return (
    <Escena Set={Living} pal={PAL} seed={256} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.2, cae: true }} claves={[mira(k(416.9), JX + 10, 560, 3.0), mira(k(418.6), JX + 10, 556, 3.08)]}
      medio={<>
        <EscarchaEsquina />
        <Halo x={JX + 30} y={P - 250} r={300} color="#ffcf6e" fuerza={0.6} />
        <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: 1 }]} objI={{ el: <Vela f={f} />, rot: 0 }} ikI={() => ({ x: JX + 40, y: P - 190 })}
          brz={[{ f: k(416.9), v: { tronco: 12, cabeza: 10 } }, { f: k(417.3), v: { tronco: 2, cabeza: -6 }, d: 12 }, { f: k(418.2), v: { tronco: 10, cabeza: 8 }, d: 10 }]}
          caras={[{ f: 0, v: "determinado" }, { f: k(417.35), v: "triste" }, { f: k(418.0), v: "cansado" }, { f: k(418.3), v: "determinado" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.8 } }, { f: k(417.3), v: { x: -1, y: -0.2 } }, { f: k(418.2), v: { x: 1, y: 0.8 } }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};
const DosVentana: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const JX = 1300, TX = 1480;
  const c = k(420.45);
  return (
    <Escena Set={Living} pal={PAL} seed={156} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.2, cae: true }} claves={[mira(c, 1390, 620, 1.6), mira(k(421.9), 1390, 616, 1.64)]}
      medio={<>
        <EscarchaEsquina />
        <Halo x={JX + 30} y={P - 250} r={320} color="#ffcf6e" fuerza={0.55} />
        <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: 1 }]} objI={{ el: <Vela f={f} />, rot: 0 }} ikI={() => ({ x: JX + 40, y: P - 190 })}
          objD={{ el: <CuadernoMano />, rot: 0 }} ikD={ikClaves([{ f: c, x: JX + 70, y: P - 150 }, { f: k(421.0), x: JX + 60, y: P - 120 }])}
          caras={[{ f: 0, v: "determinado" }, { f: k(421.1), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: k(421.0), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} ikD={ikClaves([{ f: k(420.7), x: JX + 30, y: P - 205, w: 0 }, { f: k(421.1), x: JX + 30, y: P - 205 }])}
          caras={[{ f: 0, v: "cansado" }, { f: k(421.1), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(421.1), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
      </>} />
  );
};

// 57 · la pregunta al público: los dos frente a la casa de noche; el globo sale de la boca de June; levantan el cuaderno y la vela
//      → se abre el plano a la casa entera → entran, la ventana de la vela se prende → lo que viene
export const P57Cta: React.FC = () => {
  const f = useF();
  return f < 0 ? <Desfase d={-DUR56}><DosVentanaLap /></Desfase> : <P57In />;
};
const DosVentanaLap: React.FC = () => <DosVentana k={kDe(410.22)} />;
const P57In: React.FC = () => {
  const f = useF();
  const k = kDe(421.8);
  const PB = BARRIO_PISO;
  const TX = 1690, JX = 2120;
  const entra = k(430.14);
  const rT: Paso[] = [{ f: 0, x: TX, y: PB }, { f: entra, x: TX }, { f: k(431.0), x: 1895 }];
  const rJ: Paso[] = [{ f: 0, x: JX, y: PB }, { f: k(430.85), x: JX }, { f: k(431.65), x: 1915 }];
  const abre = tw(f, k(430.6), k(431.0), 0, 1) * (1 - tw(f, k(432.0), k(432.4), 0, 1));
  const adentro = (ff: number) => (ff < k(431.75) ? 1 : 0);
  const adentroT = (ff: number) => (ff < k(431.05) ? 1 : 0);
  const ventana = tw(f, k(432.1), k(432.6), 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={57} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: ventana }}
        claves={[mira(0, 1905, 660, 1.5), mira(k(428.3), 1905, 660, 1.54), mira(k(429.3), 1900, 570, 1.1, { curva: "inout" }), mira(entra, 1900, 570, 1.11), mira(k(433.9), 1860, 600, 1.15, { curva: "inout" })]}
        medio={<>
          <HumoVisible x={2090} y={150} color="#8a8698" o={0.8} />
          <PuertaCasa x={1900} piso={PB} abre={abre} />
          {f < k(431.5) && <Halo x={JX - 40} y={PB - 190} r={260} color="#ffcf6e" fuerza={0.5} />}
          <PjX look={THEO_INV} ruta={rT} objD={{ el: <CuadernoMano />, rot: 0 }} opacidad={adentroT} dir={[{ f: 0, v: 1 }, { f: entra, v: 1 }]}
            ikD={ikClaves([{ f: 0, x: TX + 40, y: PB - 160 }, { f: k(424.0), x: TX + 40, y: PB - 160 }, { f: k(424.4), x: TX + 34, y: PB - 330 }, { f: k(425.4), x: TX + 34, y: PB - 330 }, { f: k(425.9), x: TX + 40, y: PB - 160 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(426.94), v: "saludar" }, { f: k(427.8), v: "parado" }, { f: k(428.4), v: "señalar", d: 12 }, { f: k(429.5), v: "parado", d: 12 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(424.3), v: "determinado" }, { f: k(426.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(424.3), v: { x: 1, y: -0.5 } }, { f: k(425.6), v: { x: 0.2, y: 0 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE_INV} ruta={rJ} dir={[{ f: 0, v: -1 }]} objD={{ el: <Vela f={f} />, rot: 0 }} opacidad={adentro}
            ikD={ikClaves([{ f: 0, x: JX - 40, y: PB - 180 }, { f: k(424.0), x: JX - 40, y: PB - 180 }, { f: k(424.4), x: JX - 50, y: PB - 300 }, { f: k(425.4), x: JX - 50, y: PB - 300 }, { f: k(425.9), x: JX - 40, y: PB - 180 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(422.9), v: "señalar" }, { f: k(423.7), v: "parado" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(422.9), v: "picaro" }, { f: k(424.3), v: "determinado" }, { f: k(426.0), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 0.1, y: 0 } }, { f: k(424.3), v: { x: 1, y: -0.5 } }, { f: k(425.6), v: { x: 0.1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <GloboA texto="WHAT WOULD YOU GRAB FIRST?" x={960} y={250} tx={1250} ty={500} desde={k(422.0)} hasta={k(425.4)} tam={44} />
      <Pildora texto="TELL ME IN THE COMMENTS" x={1560} y={230} desde={k(425.7)} hasta={k(429.9)} color={AMBAR} tam={34} />
      <AbsoluteFill style={{ background: "#000", opacity: tw(f, k(432.4), k(433.95), 0, 1, (t) => t) }} />
      <PildoraNext texto="NEXT · CAN TWO PEOPLE SURVIVE THE FIRST WINTER?" x={960} y={960} desde={k(430.3)} tam={34} />
    </AbsoluteFill>
  );
};
