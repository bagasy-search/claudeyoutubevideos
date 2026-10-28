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
import { CuadernoGrande, CuadernoMano, DatoGrande, kDe, Matafuego, Vela } from "./base";
import {
  anchoLin, Barras, Escalera, Escarcha, HeladeraJune, HumoVisible, Icono, ikClaves, ikEscribir,
  io, lerp, Lin, Lineas, LX, listaY, ManoLapiz, Marcador, Olla, Pan, Pin, Pistola, PjX, regla, REGLAS_HECHAS, tw, Vaso2, Vineta,
} from "./lc01_planos2_comp";
import { CartelColgante, Casilleros2, CartelER, CorteDedo, Dolor, Ecuacion2, LagoCielo, LataGrande, ManoLapizB, MatafuegoColgado, Mejilla, PizarraGrande, Silla, SoporteMatafuego, SuperSinCarro, TxtCartel } from "./v3c_v3";
import { CajaHerr, CartelTienda, Colchon, Desfase, durDe, EscarchaEsquina, Frasco, frenteOla, GloboA, GraficoFrio, LineaRota, Llave, Picto2, PuenteV3, PuertaCasa, Recorte, Rotulo3, SacoDormir, Tablero, Tocon, Venda } from "./v3d_v3";
import { spring as sprV3, useVideoConfig as vcV3 } from "remotion";
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

// aliento: bocanadas de vapor desde la boca (mundo)
const Aliento: React.FC<{ x: number; y: number; dir?: number; cada?: number; o?: number }> = ({ x, y, dir = 1, cada = 50, o = 1 }) => {
  const f = useF();
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {[0, 1].map((i) => {
        const t = ((f + i * cada * 0.5) % cada) / cada;
        if (t > 0.7) return null;
        const u = t / 0.7;
        return <circle key={i} cx={x + dir * (8 + u * 60)} cy={y - u * 26} r={6 + u * 20} fill="#eef4ff" opacity={(1 - u) * 0.55} />;
      })}
    </g>
  );
};

// ======================================================================================================
// 30 · Theo entra al lobby (medio que lo acompaña, frena en seco con las manos arriba) → CORTE a June arriba de la escalera
export const P30Lobby: React.FC = () => {
  const f = useF();
  const k = kDe(173.93);
  const D = LOBBY_DESCANSO;
  const JX = D.x + 40;
  const C = k(176.2);
  const pecho = ikClaves([{ f: 0, x: JX - 46, y: D.y - 196 }, { f: k(177.2), x: JX - 46, y: D.y - 196 }, { f: k(177.65), x: JX - 70, y: D.y - 246 }]);
  const pecho2 = ikClaves([{ f: 0, x: JX - 30, y: D.y - 176 }, { f: k(177.2), x: JX - 30, y: D.y - 176 }, { f: k(177.65), x: JX - 52, y: D.y - 222 }]);
  const pz = <PizarraGrande x={440} y={350} w={400} h={250} l1="DON'T COME CLOSER." l2="ARE YOU SICK?" s1={0} s2={0} />;
  if (f < C) return (
    <Escena Set={Lobby} pal={PAL} seed={30} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(0, 640, 610, 1.25), mira(k(175.7), 860, 610, 1.25, { curva: "inout" })]}
      medio={<>
        {pz}
        <PjX look={THEO} ruta={[{ f: 0, x: 470, y: LOBBY_PISO }, { f: k(175.5), x: 880 }]} caras={[{ f: 0, v: "duda" }, { f: k(175.3), v: "sorpresa" }, { f: k(175.9), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(175.2), v: { x: 1, y: -0.8 } }]} brz={[{ f: k(175.5), v: { hD: 150, cD: 30, hI: 140, cI: 35, tronco: -8 }, d: 7 }]} luz={BORDE_FRIO} />
      </>} />
  );
  return (
    <Escena Set={Lobby} pal={PAL} seed={130} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(C, D.x - 190, D.y - 150, 1.5), mira(k(178.85), D.x - 170, D.y - 160, 1.58, { curva: "inout" })]}
      medio={<>
        <SoporteMatafuego x={D.x + 300} y={D.y - 130} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX + 40, y: D.y }, { f: k(177.15), x: JX + 40 }, { f: k(177.6), x: JX }]} dir={[{ f: 0, v: -1 }]} ikD={pecho} ikI={pecho2} objD={{ el: <Matafuego />, rot: 0 }}
          caras={[{ f: 0, v: "miedo" }, { f: k(177.3), v: "enojo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(177.3), v: { x: 1, y: 0.75 } }]}
          brz={[{ f: k(177.3), v: { tronco: -8, cabeza: 6 }, d: 8 }]} luz={BORDE_FRIO} seed={2} />
      </>} />
  );
};

// 31 · la pizarra junto a la puerta (texto que entra en la pizarra); Theo lee, retrocede, se toca la frente, niega
export const P31Pizarra: React.FC = () => {
  const f = useF();
  const k = kDe(178.85);
  const s1 = tw(f, k(181.6), k(182.0), 0, 1), s2 = tw(f, k(182.9), k(183.3), 0, 1);
  const TX = 905;
  return (
    <Escena Set={Lobby} pal={PAL} seed={31} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(0, 720, 600, 1.3), mira(k(181.4), 720, 600, 1.3), mira(k(182.0), 700, 590, 1.48, { curva: "inout" })]}
      medio={<>
        <PizarraGrande x={440} y={350} w={400} h={250} l1="DON'T COME CLOSER." l2="ARE YOU SICK?" s1={s1} s2={s2} />
        <PjX look={THEO} ruta={[{ f: 0, x: TX, y: LOBBY_PISO }, { f: k(181.7), x: TX }, { f: k(182.15), x: TX + 50 }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(180.0), v: "pensar" }, { f: k(181.6), v: "parado" }]}
          ikD={ikClaves([{ f: k(182.9), x: TX + 50 - 30, y: LOBBY_PISO - 280, w: 0 }, { f: k(183.1), x: TX + 50 - 30, y: LOBBY_PISO - 280, w: 1 }, { f: k(183.5), x: TX + 50 - 30, y: LOBBY_PISO - 280, w: 1 }, { f: k(183.8), x: TX + 30, y: LOBBY_PISO - 150, w: 0 }])}
          caras={[{ f: 0, v: "duda" }, { f: k(181.7), v: "miedo" }, { f: k(183.0), v: "duda" }, { f: k(183.5), v: "triste" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.45 } }, { f: k(181.7), v: { x: 1, y: -0.2 } }, { f: k(183.0), v: { x: 1, y: -0.7 } }, { f: k(183.5), v: { x: 1, y: 0.1 } }]}
          brz={[{ f: k(181.7), v: { hD: 120, cD: 40, hI: 110, cI: 40, tronco: -10 }, d: 6 }, { f: k(182.6), v: { hD: 30, cD: 30, hI: 10, cI: 15, tronco: 0 }, d: 10 }]}
          giros={[{ f: k(183.5), v: 0 }, { f: k(183.62), v: -0.5 }, { f: k(183.74), v: 0.5 }, { f: k(183.86), v: -0.4 }, { f: k(183.97), v: 0 }]} luz={BORDE_FRIO} />
      </>} />
  );
};

// 32 · «He's not.» Theo niega con las palmas abiertas → CORTE a June: baja el extintor, cuelga de la manija, suelta el aire
export const P32Baja: React.FC = () => {
  const f = useF();
  const k = kDe(183.97);
  const D = LOBBY_DESCANSO;
  const JX = D.x + 40;
  const C = k(184.95);
  const TX = 1060;
  if (f < C) return (
    <Escena Set={Lobby} pal={PAL} seed={32} setProps={{ luces: 1, afuera: "noche", pizarra: "" }} claves={[mira(0, 1380, 660, 1.85), mira(C, 1360, 650, 1.9, { curva: "inout" })]}
      medio={<PjX look={THEO} ruta={[{ f: 0, x: TX, y: LOBBY_PISO }]} caras={[{ f: 0, v: "triste" }, { f: 12, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: -0.7 } }]}
        brz={[{ f: 0, v: { hD: 30, cD: 30, hI: 10, cI: 15 } }, { f: 3, v: { hD: 70, cD: 25, hI: 60, cI: 25, tronco: -4 }, d: 10 }]}
        giros={[{ f: 0, v: 0 }, { f: 5, v: 0.5 }, { f: 11, v: -0.5 }, { f: 17, v: 0.45 }, { f: 23, v: -0.3 }, { f: 29, v: 0 }]} luz={BORDE_FRIO} />} />
  );
  const baja = k(185.45);
  return (
    <Escena Set={Lobby} pal={PAL} seed={132} setProps={{ luces: 1, afuera: "noche", pizarra: "" }}
      claves={[mira(C, JX - 110, D.y - 165, 1.9), mira(k(186.77), JX - 110, D.y - 160, 1.95, { curva: "inout" })]}
      medio={<>
        <SoporteMatafuego x={D.x + 300} y={D.y - 130} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: D.y }]} dir={[{ f: 0, v: -1 }]}
          objD={(ff) => (ff < baja ? { el: <Matafuego />, rot: 0 } : { el: <MatafuegoColgado />, rot: 0 })}
          ikD={ikClaves([{ f: 0, x: JX - 70, y: D.y - 246 }, { f: k(185.1), x: JX - 70, y: D.y - 246 }, { f: k(185.8), x: JX - 18, y: D.y - 150 }])}
          ikI={ikClaves([{ f: 0, x: JX - 52, y: D.y - 222 }, { f: k(185.1), x: JX - 52, y: D.y - 222 }, { f: k(185.45), x: JX - 30, y: D.y - 170, w: 0 }])}
          caras={[{ f: 0, v: "enojo" }, { f: k(185.3), v: "cansado" }, { f: k(186.1), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: k(185.6), v: { x: 1, y: 0.9 } }, { f: k(186.2), v: { x: 1, y: 0.5 } }]}
          brz={[{ f: k(185.5), v: { tronco: 12, cabeza: 16 }, d: 14 }, { f: k(186.2), v: { tronco: 4, cabeza: 6 }, d: 14 }]} luz={BORDE_FRIO} seed={2} />
      </>} />
  );
};

// 33 · el cuaderno: la mano de Theo (desde abajo a la derecha, fuera de cuadro) tacha el 1 y escribe el 2; después los dos en el lobby
export const P33Dos: React.FC = () => {
  const f = useF();
  const k = kDe(186.77);
  const S = k(190.0);
  const uT = tw(f, k(187.97), k(188.25), 0, 1, (t) => t), uD = tw(f, k(189.2), k(189.85), 0, 1, (t) => t);
  const tip = puntaMano([tramoPts(TACHA_1, k(187.97), k(188.25)), tramoPts(DOS, k(189.2), k(189.85))], f, [2300, 1500], [2300, 1400]);
  const g = Math.max(0, 1 - Math.abs(f - k(189.6)) / 6);
  const ks = (t: number) => k(t) - S;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <CuadernoGrande renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }]} zoom={[0, 1, 1]} />
        <Svg><g transform="rotate(-3 960 540)">
          <PaginaCenso uT={uT} uD={uD} />
          {g > 0 && <circle cx={1448} cy={556} r={90 + 60 * (1 - g)} fill="none" stroke={AMBAR} strokeWidth={8} opacity={g} />}
          <ManoLapizB x={tip[0]} y={tip[1]} manga="#c8582b" giro={72} />
        </g></Svg>
      </Sequence>
      <Sequence from={S}>
        <Escena Set={Lobby} pal={PAL} seed={33} setProps={{ luces: 1, afuera: "noche", pizarra: "" }} claves={[mira(0, 1490, 640, 1.5)]}
          medio={<>
            <PjX look={THEO} ruta={[{ f: 0, x: 1120, y: LOBBY_PISO }]} objD={{ el: <CuadernoMano abierto />, rot: 0 }}
              ikD={ikClaves([{ f: 0, x: 1180, y: 700 }, { f: ks(190.4), x: 1180, y: 700 }, { f: ks(190.8), x: 1230, y: 640 }])}
              caras={[{ f: 0, v: "feliz" }, { f: ks(190.9), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: ks(190.4), v: { x: 1, y: 0 } }]} brz={[{ f: ks(190.4), v: { cabeza: -6 }, d: 10 }]} luz={BORDE_FRIO} />
            <PjX look={JUNE} ruta={[{ f: 0, x: 1410, y: LOBBY_PISO }]} dir={[{ f: 0, v: -1 }]} objD={{ el: <MatafuegoColgado />, rot: 0 }} ikD={() => ({ x: 1398, y: LOBBY_PISO - 150 })}
              ikI={ikClaves([{ f: ks(190.7), x: 1370, y: LOBBY_PISO - 200, w: 0 }, { f: ks(191.0), x: 1370, y: LOBBY_PISO - 230, w: 1 }])}
              caras={[{ f: 0, v: "neutral" }, { f: ks(190.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: ks(190.6), v: { x: 1, y: 0.1 } }]} brz={[{ f: ks(190.6), v: { cabeza: -8 } }]} luz={BORDE_FRIO} seed={2} />
          </>} />
      </Sequence>
    </AbsoluteFill>
  );
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
      <Escena Set={SuperSinCarro} pal={PAL} seed={34} setProps={{}}
        claves={[mira(0, 500, 640, 1.22), mira(k(193.6), 520, 640, 1.22), mira(k(197.0), 1010, 640, 1.22, { curva: "inout" }), mira(k(201.3), 1060, 640, 1.28, { curva: "inout" })]}
        medio={<>
          <CartelColgante x={760} y={330} w={440} h={124} desde={k(193.85)} voltea={k(198.3)} techo={-260}
            a={<><g transform="translate(-160,62) scale(0.8)"><Icono n="comida" /></g><TxtCartel t="FOOD" y={56} x={-90} ancla="start" tam={44} /><TxtCartel t="FIRST" y={104} x={-90} ancla="start" tam={44} color="#ffe08a" /></>}
            b={<><TxtCartel t="FOOD IS" y={52} tam={36} /><TxtCartel t="NOT THE PROBLEM" y={100} tam={38} color="#ffe08a" /><g transform="translate(196,6)"><circle r={26} fill="#3aa86a" stroke="#f6f1e2" strokeWidth={4} /><path d="M-12,0 l8,9 l15,-17" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" /></g></>} />
          <Carrito x={cx} y={PS} dir={1} lleno={0} rueda={cx * 1.2} />
          <PjX look={THEO} ruta={rT} ikD={ik(0)} ikI={ik(4)} caras={[{ f: 0, v: "duda" }, { f: k(193.9), v: "determinado" }, { f: k(196.9), v: "sorpresa" }, { f: k(198.5), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(194.0), v: { x: 1, y: -0.7 } }, { f: k(195.0), v: { x: 1, y: 0 } }, { f: k(198.4), v: { x: -1, y: -0.6 } }]} />
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
  if (f < CA) {
    const rT: Paso[] = [{ f: 0, x: 640, y: PS }, { f: CA, x: 1080 }];
    const tx = posRuta(rT, f).x;
    const n = Math.round(interpolate(f, [k(202.1), k(204.4)], [0, 38000], { ...CL, easing: (t) => 1 - Math.pow(1 - t, 3) }));
    return (
      <Escena Set={SuperSinCarro} pal={PAL} seed={35} setProps={{}} claves={[mira(0, 1080, 630, 1.25), mira(CA, 1330, 630, 1.25, { curva: "inout" })]}
        medio={<>
          <CartelColgante x={1500} y={330} w={440} h={124} desde={k(201.9)} techo={-260}
            a={<><TxtCartel t="ITEMS IN ONE STORE" y={42} tam={28} /><text x={0} y={104} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={56} fill="#ffe08a">{n.toLocaleString("en-US")}</text></>} />
          <Carrito x={tx + 246} y={PS} dir={1} lleno={0.1} rueda={tx * 1.2} />
          <PjX look={THEO} ruta={rT} ikD={() => ({ x: tx + 60, y: PS - 222 })} ikI={() => ({ x: tx + 60, y: PS - 218 })} caras={[{ f: 0, v: "determinado" }, { f: k(203.4), v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(202.3), v: { x: 1, y: -0.7 } }, { f: k(203.6), v: { x: -1, y: -0.3 } }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 1200, y: PS }, { f: CA, x: 1600 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(203.2), v: { hD: 95, cD: 0, tronco: 3 } }]}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(203.2), v: "feliz" }]} miradas={[{ f: 0, v: { x: -1, y: -0.5 } }, { f: k(202.4), v: { x: 1, y: -0.6 } }, { f: k(203.2), v: { x: 1, y: -0.2 } }]} seed={2} />
        </>} />
    );
  }
  if (f < CB) {
    const TX = 1150, CX = 1340, JX = 1580;
    const cl: { f: number; x: number; y: number; w?: number }[] = [{ f: CA, x: TX - 40, y: PS - 300, w: 1 }];
    items.forEach(([, , t], i) => { cl.push({ f: k(t) - 16, x: TX - 46, y: PS - 300 - (i % 2) * 90 }); cl.push({ f: k(t) - 2, x: CX - 70, y: PS - 196 }); });
    const enMano = (ff: number) => { const it = items.find(([, , t]) => ff > k(t) - 15 && ff < k(t) - 1); return it ? { el: <g transform="translate(0,-26) scale(0.62)"><Icono n={it[0]} /></g>, rot: 0 } : undefined; };
    const cargadas = items.filter(([, , t]) => f >= k(t)).length;
    const jIk = ikClaves([{ f: CA + 4, x: JX + 70, y: PS - 330 }, { f: k(205.7), x: JX - 70, y: PS - 262 }, { f: k(207.3), x: JX - 70, y: PS - 262 }, { f: k(207.6), x: CX + 60, y: PS - 200 }, { f: k(208.2), x: JX + 70, y: PS - 380 }, { f: k(208.7), x: JX - 70, y: PS - 262 }, { f: k(209.8), x: JX - 70, y: PS - 262 }, { f: k(210.1), x: CX + 70, y: PS - 200 }]);
    const jLata = (ff: number) => ((ff > CA + 6 && ff < k(207.55)) || (ff > k(208.25) && ff < k(210.05)) ? { el: <Lata color={ff < k(208) ? "#c0352c" : "#5aa0d8"} />, rot: 0 } : undefined);
    return (
      <Escena Set={SuperSinCarro} pal={PAL} seed={235} setProps={{}} claves={[mira(CA, 1330, 590, 1.4), mira(CB, 1340, 590, 1.42, { curva: "inout" })]}
        medio={<>
          <CartelColgante x={1600} y={318} w={640} h={156} desde={CA - 40} techo={-260}
            a={<>{items.map(([ic, rot, t], i) => { const on = f >= k(t); return (
              <g key={ic} transform={`translate(${-256 + i * 128},4)`}>
                <g transform="translate(0,52) scale(0.78)" opacity={on ? 1 : 0.55}><Icono n={ic} apagado={on ? 0 : 0.8} /></g>
                <text x={0} y={128} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={21} letterSpacing={1} fill={on ? "#ffe08a" : "#bcd6c8"}>{rot}</text>
                {on && <g transform={`translate(40,18) scale(${tw(f, k(t), k(t) + 8, 0.2, 1)})`}><circle r={13} fill="#3aa86a" stroke="#f6f1e2" strokeWidth={2.5} /><path d="M-6,0 l4,5 l8,-9" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" /></g>}
              </g>); })}</>} />
          <Carrito x={CX} y={PS} dir={-1} lleno={Math.min(1, 0.15 + cargadas * 0.17)} />
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} ikD={ikClaves(cl)} objD={enMano}
            brz={items.reduce<any[]>((acc, [, , t]) => acc.concat([{ f: k(t) - 14, v: { tronco: -6 }, d: 6 }, { f: k(t) - 6, v: { tronco: 14 }, d: 6 }, { f: k(t) + 2, v: { tronco: 0 }, d: 8 }]), [])}
            caras={[{ f: 0, v: "determinado" }, { f: k(207.0), v: "feliz" }, { f: k(208.4), v: "determinado" }, { f: k(209.2), v: "risa" }, { f: k(210.0), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: -1, y: -0.4 } }, { f: k(206.5), v: { x: 1, y: 0.4 } }, { f: k(207.2), v: { x: -1, y: -0.2 } }, { f: k(208.0), v: { x: 1, y: 0.4 } }, { f: k(208.9), v: { x: -1, y: -0.4 } }, { f: k(209.8), v: { x: 1, y: 0.3 } }]}
            dir={[{ f: 0, v: 1 }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: PS }]} dir={[{ f: 0, v: -1 }]} ikD={jIk} objD={jLata}
            caras={[{ f: 0, v: "duda" }, { f: k(206.3), v: "sorpresa" }, { f: k(207.5), v: "feliz" }, { f: k(209.0), v: "duda" }, { f: k(210.0), v: "risa" }]}
            miradas={[{ f: 0, v: { x: -1, y: -0.6 } }, { f: k(205.6), v: { x: 1, y: 0.15 } }, { f: k(207.4), v: { x: 1, y: 0.6 } }, { f: k(208.6), v: { x: 1, y: 0.15 } }, { f: k(210.0), v: { x: 1, y: 0.5 } }]}
            brz={[{ f: k(207.4), v: { tronco: 12 }, d: 6 }, { f: k(207.9), v: { tronco: 0 }, d: 8 }, { f: k(209.9), v: { tronco: 12 }, d: 6 }, { f: k(210.4), v: { tronco: 0 }, d: 8 }]} seed={2} />
        </>} />
    );
  }
  const anio = interpolate(f, [k(211.9), k(213.7)], [2026, 2031], { ...CL, easing: (t) => 1 - Math.pow(1 - t, 2) });
  return (
    <Escena Set={SuperSinCarro} pal={PAL} seed={335} setProps={{}} claves={[mira(CB, 1365, 690, 1.45), mira(k(215.1), 1370, 690, 1.47, { curva: "inout" })]}
      medio={<>
        <Carrito x={1330} y={PS} dir={-1} lleno={1} />
        <PjX look={THEO} ruta={[{ f: 0, x: 1110, y: PS }]} poses={[{ f: 0, v: "manosCintura" }, { f: k(213.0), v: { hD: 60, cD: 30, hI: 50, cI: 30 } }]}
          caras={[{ f: 0, v: "feliz" }, { f: k(213.2), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: k(212.0), v: { x: 1, y: -0.1 } }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: 1580, y: PS }]} dir={[{ f: 0, v: -1 }]}
          ikD={ikClaves([{ f: CB, x: 1520, y: PS - 170 }, { f: k(211.5), x: 1495, y: PS - 222 }])} objD={{ el: <g transform="scale(-1,1)"><LataGrande anio={anio} s={1.9} /></g>, rot: 0 }}
          caras={[{ f: 0, v: "duda" }, { f: k(212.0), v: "sorpresa" }, { f: k(213.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(213.8), v: { x: -1, y: -0.1 } }]}
          brz={[{ f: k(213.7), v: { cabeza: -8, tronco: -4 }, d: 10 }]} seed={2} />
      </>} />
  );
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
  const pins: [number, number, string][] = [[1080, 560, "GROCERY"], [1300, 650, "WAREHOUSE"], [1500, 560, "GAS"], [1690, 700, "GROCERY"], [1880, 600, "FOOD DEPOT"], [2060, 690, "GAS"], [2200, 570, "GROCERY"], [1190, 740, "GAS"], [1590, 640, "DELI"], [1980, 760, "GAS"]];
  const tiendas = Math.round(interpolate(f, [k(222.0), k(225.4)], [0, 34], CL));
  const conteo = f >= k(222.0) && f < k(225.5) && <GranNumero rotulo="FOOD STORES IN DULUTH" claves={[{ f: 0, v: tiendas }]} x={f < CA ? 1240 : 1250} y={f < CA ? 120 : 108} tam={86} color={AMBAR} desde={k(222.0)} hasta={k(225.5)} />;
  if (f < CA) return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} seed={37} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }} claves={[mira(0, 1480, 520, 0.95), mira(CA, 1500, 520, 0.97, { curva: "inout" })]}
        medio={<>
          {pins.map(([x, y, t], i) => <Pin key={i} x={x} y={y} txt={t} desde={k(222.0) + i * 4} s={1.5} />)}
          <PjX look={JUNE} ruta={[{ f: 0, x: 640, y: P }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }]} seed={2} />
          <PjX look={THEO} ruta={[{ f: 0, x: 840, y: P }]} poses={[{ f: 0, v: "parado" }, { f: k(222.2), v: "señalar" }]} caras={[{ f: 0, v: "duda" }, { f: k(222.3), v: "sorpresa" }]} />
        </>} />
      {conteo}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} seed={137} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }} claves={[mira(CA, 920, 520, 1.35), mira(k(229.0), 930, 520, 1.4, { curva: "inout" })]}
        medio={<>
          {pins.filter(([x]) => x < 1460).map(([x, y, t], i) => <Pin key={i} x={x} y={y} txt={t} desde={-30} s={1.5} />)}
          <PjX look={JUNE} ruta={[{ f: 0, x: 640, y: P }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(226.2), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(226.4), v: { x: 1, y: 0 } }]}
            poses={[{ f: 0, v: { hD: 60, cD: 140, cabeza: -4 } }, { f: k(226.2), v: "manosCintura" }]} seed={2} luz={BORDE_CALIDO} />
          <PjX look={THEO} ruta={[{ f: 0, x: 860, y: P }]} poses={[{ f: 0, v: "señalar" }, { f: k(224.4), v: { hD: 120, cD: 0, tronco: -4 } }, { f: k(225.4), v: { hD: 75, cD: 0, tronco: 4 } }, { f: k(226.2), v: "celebrar" }]}
            dir={[{ f: 0, v: 1 }, { f: k(226.0), v: -1 }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(224.6), v: "determinado" }, { f: k(226.2), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(226.2), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
        </>} />
      {conteo}
      <Barras x={900} y={120} w={600} alto={54} paso={84} hasta={1e9} items={[
        { rot: "THE CITY", v: 1, color: AMBAR, desde: k(225.7), fin: "" },
        { rot: "2 PEOPLE", v: 0.06, color: "#2a7fd0", desde: k(227.0), fin: "ONE LIFETIME" },
      ]} />
    </AbsoluteFill>
  );
};

// 38 · lo fresco es una cuenta regresiva: pan, leche, el freezer cuando se corta la luz (carteles anclados al estante)
const PanRack: React.FC<{ x: number; moho: number; falta: boolean }> = ({ x, moho, falta }) => (
  <g>
    <rect x={x} y={P - 380} width={300} height={380} fill="#6a4a32" />
    {[P - 330, P - 230, P - 130, P - 30].map((y) => <rect key={y} x={x - 6} y={y} width={312} height={12} fill="#4a3222" />)}
    {[P - 330, P - 230, P - 130].map((y, r) => Array.from({ length: 4 }).map((_, i) => (falta && r === 1 && i === 1 ? null :
      <g key={`${r}${i}`} transform={`translate(${x + 40 + i * 72},${y})`}><path d="M-30,0 Q-32,-34 0,-36 Q32,-34 30,0 Z" fill="#d89a4a" />
        {moho > 0 && <g fill="#6a8a3a" opacity={moho}><circle cx={-12} cy={-14} r={6} /><circle cx={10} cy={-22} r={5} /><circle cx={16} cy={-8} r={4} /></g>}</g>)))}
    <rect x={x + 60} y={P - 420} width={180} height={34} rx={6} fill="#f2ece0" /><text x={x + 150} y={P - 396} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#6a4a32">BAKERY</text>
  </g>
);
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
const Freezer: React.FC<{ x: number; tapa: number; apestoso: number }> = ({ x, tapa, apestoso }) => {
  const f = useF();
  const hx = x + 230, hy = P - 170;
  return (
    <g>
      <rect x={x} y={hy} width={230} height={170} rx={10} fill="#e6eaee" />
      {tapa > 0.05 && <rect x={x + 10} y={hy + 6} width={210} height={30} fill="#2a3440" />}
      {tapa > 0.05 && <g transform={`translate(${x + 110},${hy + 14}) scale(0.5)`}><Icono n="carne" f={0} /></g>}
      {apestoso > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${x + 70 + i * 45},${hy - 10} q-14,-20 0,-40 q14,-20 0,-40`} stroke="#8aa63a" strokeWidth={9} fill="none" opacity={apestoso * (0.7 + 0.3 * Math.sin(f / 5 + i))} transform={`translate(0,${-((f + i * 10) % 30)})`} />)}
      <rect x={x + 20} y={hy + 60} width={80} height={30} rx={4} fill="#5ab0ff" /><text x={x + 60} y={hy + 82} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#fff">FROZEN</text>
      <g transform={`rotate(${tapa * 100} ${hx} ${hy})`}><rect x={x - 6} y={hy - 16} width={242} height={22} rx={6} fill="#cfd6dc" /><rect x={x - 6} y={hy - 10} width={14} height={20} rx={4} fill="#8a949a" /></g>
    </g>
  );
};
const tapaBorde = (x: number, tapa: number) => { const a = (tapa * 100 * Math.PI) / 180; return { x: x + 230 - 236 * Math.cos(a), y: P - 170 - 236 * Math.sin(a) }; };
const Cartel: React.FC<{ x: number; y: number; rot: string; desde: number; hasta?: number; valor: string; color: string; sub?: string }> = ({ x, y, rot, desde, hasta = 1e9, valor, color, sub }) => {
  const f = useF();
  if (f < desde || f > hasta) return null;
  const s = tw(f, desde, desde + 10, 0, 1);
  return (
    <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * s})`} opacity={s}>
      <rect x={-118} y={-60} width={236} height={sub ? 124 : 110} rx={14} fill="#120f18" stroke={color} strokeWidth={5} />
      <text x={0} y={-24} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={24} letterSpacing={3} fill="#f6ecd2">{rot}</text>
      <text x={0} y={26} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={42} fill={color}>{valor}</text>
      {sub && <text x={0} y={54} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#c8bfae">{sub}</text>}
    </g>
  );
};
export const P38Fresco: React.FC = () => {
  const f = useF();
  const k = kDe(229.01);
  const PS = SUPER_PISO;
  const dP = Math.ceil(interpolate(f, [k(231.4), k(233.3)], [7, 0], CL)), dL = Math.ceil(interpolate(f, [k(233.7), k(235.4)], [14, 0], CL));
  const off = f >= k(235.7);
  const temp = Math.round(interpolate(f, [k(235.9), k(237.4)], [0, 40], CL));
  const tapa = tw(f, k(237.3), k(237.9), 0, 1);
  const tb = tapaBorde(2900, tapa);
  return (
    <AbsoluteFill>
      <Escena Set={SuperSinCarro} pal={PAL} seed={38} setProps={{}}
        claves={[mira(0, 2380, 560 + PS - P, 0.92), mira(k(231.0), 2380, 560 + PS - P, 0.92), mira(k(231.8), 1880, 600 + PS - P, 1.45, { curva: "inout" }), mira(k(233.4), 1880, 600 + PS - P, 1.45), mira(k(234.1), 2660, 590 + PS - P, 1.45, { curva: "inout" }), mira(k(235.5), 2660, 590 + PS - P, 1.45), mira(k(236.3), 3150, 620 + PS - P, 1.55, { curva: "inout" })]}
        medio={<g transform={`translate(0,${PS - P})`}>
          <PanRack x={1740} moho={tw(f, k(232.6), k(233.3), 0, 1)} falta={f > k(231.9)} />
          <Lechera x={2540} luz={off ? 0 : 1} />
          <Freezer x={2900} tapa={tapa} apestoso={tw(f, k(237.9), k(238.4), 0, 1)} />
          <Cartel x={1890} y={P - 490} rot="BREAD" desde={k(231.2)} hasta={k(234.0)} valor={dP > 0 ? `${dP} DAYS` : "MOLD"} color={dP > 0 ? "#e0a23a" : "#8aa63a"} />
          <Cartel x={2665} y={P - 520} rot="MILK" desde={k(233.6)} hasta={k(235.8)} valor={dL > 0 ? `${dL} DAYS` : "SOUR"} color={dL > 0 ? "#f6ecd2" : "#8aa63a"} />
          <Cartel x={3015} y={P - 330} rot="FREEZER" desde={k(235.6)} valor={off ? `${temp}°F` : "0°F"} color={off ? ROJO_CENSO : "#8fd3ff"} sub={off ? "POWER OFF" : "POWER ON"} />
          <PjX look={THEO} ruta={[{ f: 0, x: 2110, y: P }]} dir={[{ f: 0, v: -1 }]} ikD={ikClaves([{ f: k(231.4), x: 2026, y: P - 240 }, { f: k(231.9), x: 2026, y: P - 240 }, { f: k(232.4), x: 2072, y: P - 262 }])}
            objD={(ff) => (ff > k(231.9) ? { el: <Pan />, rot: 0 } : undefined)} caras={[{ f: 0, v: "neutral" }, { f: k(232.3), v: "duda" }, { f: k(233.2), v: "asco" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(232.3), v: { x: 1, y: 0.5 } }]} brz={[{ f: k(233.3), v: { tronco: -12, cabeza: -10 }, d: 6 }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 2820, y: P }, { f: k(238.3), x: 2820 }, { f: k(238.9), x: 2740 }]} dir={[{ f: 0, v: 1 }]}
            ikD={(ff) => (ff < k(236.9) ? null : ff < k(238.4) ? { x: tb.x + 4, y: tb.y - 6, w: tw(ff, k(236.9), k(237.3), 0, 1) } : null)}
            ikI={(ff) => (ff < k(238.4) ? null : { x: 2830, y: P - 255, w: tw(ff, k(238.4), k(238.7), 0, 1) })}
            caras={[{ f: 0, v: "duda" }, { f: k(236.0), v: "miedo" }, { f: k(238.2), v: "asco" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]}
            brz={[{ f: k(237.0), v: { tronco: 18 }, d: 8 }, { f: k(238.3), v: { tronco: -14, cabeza: -12 }, d: 6 }]} seed={2} />
        </g>} />
    </AbsoluteFill>
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
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(242.7), v: { x: 1, y: 0.3 } }, { f: k(244.3), v: { x: -1, y: 0 } }, { f: k(244.9), v: { x: 1, y: 0.3 } }]} seed={2} />
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
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <Escena Set={Living} pal={PAL} seed={40} setProps={LIV_OTONO} claves={[mira(0, 1290, 640, 1.9), mira(k(249.9), 1300, 650, 2.05)]}
          medio={<>
            <Pileta x={1300} chorro={chorro} />
            <PjX look={JUNE} ruta={[{ f: 0, x: 1236, y: P }]} ikD={ikClaves([{ f: k(247.2), x: 1352, y: P - 190 }, { f: k(247.8), x: 1350, y: P - 192 }, { f: k(248.2), x: 1300, y: P - 245, w: 0 }])}
              ikI={() => ({ x: 1296, y: P - 196 })} objI={{ el: <Vaso2 lleno={tw(f, k(247.9), k(249.6), 0.05, 0.95)} />, rot: 0 }}
              brz={[{ f: k(247.0), v: { tronco: 16 }, d: 8 }]} caras={[{ f: 0, v: "neutral" }, { f: k(248.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]} seed={2} />
          </>} />
      </Sequence>
      <Sequence from={S}>
        <SeqLakewood ks={ks} />
      </Sequence>
    </AbsoluteFill>
  );
};
const SeqLakewood: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  // general CORTO (≤2 s) → CORTE a las bombas (Theo camina mirándolas) → CORTE al tablero y el manómetro del set (la aguja cae)
  const f = useF();
  const fl = f < ks(256.3) ? 1 : tw(f, ks(256.3), ks(257.3), 1, 0);
  const ag = f < ks(256.3) ? 0.72 : tw(f, ks(256.4), ks(257.6), 0.72, 0.04);
  const sp = { hora: "dia", corte: 1, flujo: fl, aguja: ag, nieve: 0 };
  const C1 = ks(252.0), C2 = ks(254.3);
  if (f < C1) return (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} seed={140} setProps={sp} claves={[mira(0, 1500, 560, 0.72), mira(C1, 1560, 560, 0.74, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 1100, y: P }, { f: C1, x: 1400 }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }]} />} />
      <Pildora texto="LAKEWOOD PUMPING STATION" x={960} y={130} desde={ks(250.3)} hasta={C1 - 10} color={AMBAR} tam={38} />
    </AbsoluteFill>
  );
  if (f < C2) return (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} seed={240} setProps={sp} claves={[mira(C1, 2150, 610, 1.3), mira(C2, 2260, 610, 1.3, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 1860, y: P }, { f: C2, x: 2400 }]} poses={[{ f: 0, v: "parado" }, { f: ks(253.2), v: { hD: 110, cD: 0, tronco: -4 } }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: ks(253.2), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: ks(252.8), v: { x: -1, y: -0.3 } }, { f: ks(253.6), v: { x: 1, y: 0 } }]} />} />
      <Vineta x={1500} y={300} icono="rayo" rotulo="PUMPS NEED POWER" desde={ks(253.4)} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} seed={340} setProps={sp} claves={[mira(C2, 3640, 600, 1.35), mira(ks(258.8), 3660, 600, 1.4, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 3180, y: P }]} poses={[{ f: 0, v: "señalar" }, { f: ks(256.3), v: { hD: 60, cD: 120, hI: 60, cI: 120, cabeza: 6 } }, { f: ks(257.4), v: "encogerse" }]}
          caras={[{ f: 0, v: "determinado" }, { f: ks(256.4), v: "sorpresa" }, { f: ks(257.4), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: ks(255.4), v: { x: -1, y: 0 } }, { f: ks(256.4), v: { x: 1, y: -0.3 } }, { f: ks(257.6), v: { x: -1, y: 0.2 } }]} />} />
      <Vineta x={560} y={300} icono="rayo" rotulo="NO POWER = NO PRESSURE" desde={C2 + 2} apagar={ks(256.3)} />
    </AbsoluteFill>
  );
};

// 41 · el lago de agua dulce más grande (mapa que se dibuja) → «hervila»: la olla en el anafe → agua para siempre
export const P41Lago: React.FC = () => {
  const k = kDe(258.49);
  const S = k(262.75);
  const ks = (t: number) => k(t) - S;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <Escena Set={Panorama} pal={PAL} seed={41} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }} claves={[mira(0, 1240, 520, 1.3), mira(S, 1250, 520, 1.32, { curva: "inout" })]}
          medio={<PjX look={THEO} ruta={[{ f: 0, x: 1100, y: P }, { f: k(259.6), x: 1220 }]} poses={[{ f: 0, v: "parado" }, { f: k(259.9), v: { hD: 145, cD: 8, tronco: -5, cabeza: -6 } }, { f: k(261.6), v: "manosCintura" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(259.9), v: "sorpresa" }, { f: k(261.5), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(259.8), v: { x: 1, y: -0.8 } }, { f: k(261.6), v: { x: -1, y: 0 } }]} />} />
        <LagoCielo x={1110} y={80} w={340} desde={k(259.7)} />
      </Sequence>
      <Sequence from={S}>
        <SeqHervir ks={ks} />
      </Sequence>
    </AbsoluteFill>
  );
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
      <Vineta x={1300} y={290} icono="agua" rotulo="BOIL IT" desde={ks(262.9)} check={ks(263.9)} acento="#5ab0ff" />
      <TextoMano texto="water, forever" x={1340} y={560} desde={ks(263.85)} color="#8fd3ff" tam={70} />
    </AbsoluteFill>
  );
};

// 42 · ¿qué mata de verdad a dos personas? 3 tomas con CORTE seco:
//   A (265,2-269,45) los dos en el living (alarma de CO entera, entre las cabezas): Theo tira una lata al aire, June se cruza de brazos y duda;
//                    la tira de 4 casilleros vacíos entra arriba (zona lisa, sobre la alarma)
//   B (269,45-273,4) recuerdo: June en la guardia de emergencias revisando un monitor; el cartel EMERGENCY cuenta 8 YEARS
//   C (273,4-275,9) primer plano de Theo (traga saliva); «NOT STARVATION» tachado a su derecha; vuelve la tira
const STRIP = { x: 420, y: 100 };
export const P42Mata: React.FC = () => {
  const f = useF();
  const k = kDe(265.17);
  const CA = k(269.45), CB = k(273.4);
  const TX = 520, JX = 880;
  if (f < CA) {
    const vuelos = [[k(265.9), k(266.5)], [k(267.0), k(267.6)]];
    const vuela = vuelos.find(([a, b]) => f >= a && f < b);
    const mano = { x: TX + 70, y: P - 250 };
    return (
      <AbsoluteFill>
        <Escena Set={Living} pal={PAL} seed={42} setProps={{ ...LIV_OTONO, hora: "ocaso", fuego: 0.9 }} claves={[mira(0, 700, 580, 1.35), mira(CA, 710, 582, 1.38, { curva: "inout" })]}
          medio={<>
            <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]}
              ikD={ikClaves([{ f: 0, x: mano.x, y: P - 205 }, { f: k(265.8), x: mano.x, y: mano.y }, { f: k(266.0), x: mano.x, y: P - 205 }, { f: k(266.45), x: mano.x, y: mano.y }, { f: k(266.7), x: mano.x, y: P - 205 }, { f: k(266.9), x: mano.x, y: mano.y }, { f: k(267.1), x: mano.x, y: P - 205 }, { f: k(267.55), x: mano.x, y: mano.y }, { f: k(268.0), x: mano.x - 10, y: P - 200 }])}
              objD={(ff) => (vuelos.some(([a, b]) => ff >= a && ff < b) ? undefined : { el: <Lata color="#c0352c" />, rot: 0 })}
              poses={[{ f: 0, v: "parado" }, { f: k(268.1), v: { hI: 150, cI: 120, cabeza: 6 } }]}
              caras={[{ f: 0, v: "feliz" }, { f: k(267.6), v: "duda" }]}
              miradas={[{ f: 0, v: { x: 1, y: -0.8 } }, { f: k(267.7), v: { x: 1, y: 0 } }, { f: k(268.6), v: { x: 1, y: -0.5 } }]} luz={BORDE_CALIDO} />
            {vuela && <Lata x={mano.x} y={mano.y - 14 - 150 * Math.sin(Math.PI * (f - vuela[0]) / (vuela[1] - vuela[0]))} color="#c0352c" rot={((f - vuela[0]) * 22) % 360} />}
            <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "manosCintura" }, { f: k(266.6), v: "brazosCruzados" }, { f: k(268.2), v: "pensar" }]}
              caras={[{ f: 0, v: "neutral" }, { f: k(266.6), v: "duda" }, { f: k(268.2), v: "determinado" }]}
              miradas={[{ f: 0, v: { x: 1, y: -0.6 } }, { f: k(266.7), v: { x: 1, y: 0 } }, { f: k(268.3), v: { x: -1, y: -0.4 } }]} luz={BORDE_CALIDO} seed={2} />
          </>} />
        <Casilleros2 x={STRIP.x} y={STRIP.y} tam={150} gap={70} desde={k(267.4)} llenos={[]} />
      </AbsoluteFill>
    );
  }
  if (f < CB) {
    const JW = 2960;
    const anios = interpolate(f, [k(271.1), k(272.5)], [1, 8], { ...CL, easing: (t) => 1 - Math.pow(1 - t, 2) });
    return (
      <AbsoluteFill>
        <Escena Set={Lobby} pal={PAL} seed={142} setProps={{ luces: 1, afuera: "noche" }} claves={[mira(CA, 3130, 500, 1.15), mira(CB, 3150, 500, 1.18, { curva: "inout" })]}
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
  }
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={242} setProps={{ ...LIV_OTONO, hora: "ocaso", fuego: 0.9 }} claves={[mira(CB, 470, 650, 1.9), mira(k(275.9), 470, 655, 1.96, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }]}
            ikD={ikClaves([{ f: k(274.0), x: TX + 30, y: P - 200, w: 0 }, { f: k(274.3), x: TX + 22, y: P - 228, w: 1 }, { f: k(275.3), x: TX + 22, y: P - 228 }, { f: k(275.6), x: TX + 40, y: P - 200, w: 0 }])}
            brz={[{ f: k(274.4), v: { cabeza: 8 }, d: 5 }, { f: k(274.6), v: { cabeza: -2 }, d: 6 }]}
            caras={[{ f: 0, v: "sorpresa" }, { f: k(273.9), v: "miedo" }, { f: k(275.3), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(274.0), v: { x: 1, y: 0.6 } }, { f: k(275.2), v: { x: 1, y: -0.2 } }]} luz={BORDE_CALIDO} />
        </>} />
      <Vineta x={1580} y={600} icono="comida" rotulo="NOT STARVATION" desde={CB + 2} tachar={k(274.0)} />
      <Casilleros2 x={STRIP.x} y={STRIP.y} tam={150} gap={70} desde={k(274.6)} llenos={[]} />
    </AbsoluteFill>
  );
};

// 43 · las cosas chicas: 4 mímicas con CORTE seco y la tira que se llena (corte, tobillo, frío, muela)
export const P43Chicas: React.FC = () => {
  const f = useF();
  const k = kDe(275.91);
  const C1 = k(277.62), C2 = k(278.87), C3 = k(280.62);
  const TX = 520;
  const tira = <Casilleros2 x={STRIP.x} y={STRIP.y} tam={150} gap={70} desde={-30} llenos={[{ f: k(276.1), icono: "corte", rot: "INFECTED CUT" }, { f: k(277.75), icono: "tobillo", rot: "BROKEN ANKLE" }, { f: k(279.0), icono: "frio", rot: "COLD NIGHT" }, { f: k(280.75), icono: "muela", rot: "BAD TOOTH" }]} />;
  const LV = { ...LIV_OTONO, hora: "noche" as const, fuego: 0.9 };
  if (f < C1) {
    const dedo = { x: TX + 64, y: P - 300 };
    return (
      <AbsoluteFill>
        <Escena Set={Living} pal={PAL} seed={43} setProps={LV} claves={[mira(0, 470, 650, 1.9), mira(C1, 475, 645, 1.95, { curva: "inout" })]}
          medio={<>
            <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]}
              ikD={ikClaves([{ f: 0, x: TX + 40, y: P - 200, w: 0 }, { f: k(276.2), x: dedo.x, y: dedo.y, w: 1 }, { f: k(276.9), x: dedo.x, y: dedo.y }, { f: k(277.2), x: dedo.x - 6, y: dedo.y + 20 }])}
              brz={[{ f: k(276.3), v: { tronco: -4, cabeza: -6 }, d: 6 }, { f: k(276.95), v: { cabeza: 10 }, d: 6 }]}
              caras={[{ f: 0, v: "duda" }, { f: k(276.3), v: "sorpresa" }, { f: k(276.95), v: "asco" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(276.25), v: { x: 1, y: 0.3 } }, { f: k(277.0), v: { x: 1, y: -0.1 } }]} luz={BORDE_CALIDO} />
            <CorteDedo x={dedo.x + 6} y={dedo.y - 18} o={tw(f, k(276.3), k(276.6), 0, 1)} />
          </>} />
        {tira}
      </AbsoluteFill>
    );
  }
  if (f < C2) return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={143} setProps={LV} claves={[mira(C1, 680, 580, 1.3), mira(C2, 685, 582, 1.32, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "agacharse" }]}
            ikD={() => ({ x: TX + 52, y: P - 36 })} ikI={() => ({ x: TX + 40, y: P - 44 })}
            caras={[{ f: 0, v: "enojo" }, { f: k(278.3), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.9 } }, { f: k(278.3), v: { x: 1, y: -0.2 } }]}
            brz={[{ f: C1 + 8, v: { tronco: 6 }, d: 6 }, { f: k(278.4), v: { tronco: 0 }, d: 8 }]} luz={BORDE_CALIDO} />
          <Dolor x={TX + 46} y={P - 40} r={46} o={tw(f, C1 + 2, C1 + 10, 0, 1)} />
        </>} />
      {tira}
    </AbsoluteFill>
  );
  if (f < C3) return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={243} setProps={{ ...LV, fuego: 0, nieveAfuera: 1 }} claves={[mira(C2, 480, 700, 1.6), mira(C3, 485, 700, 1.64, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: C2 + 6, v: "encogerse" }]}
            brz={[{ f: k(279.4), v: { tronco: 4 }, d: 4 }, { f: k(279.55), v: { tronco: -2 }, d: 4 }, { f: k(279.7), v: { tronco: 4 }, d: 4 }, { f: k(279.85), v: { tronco: 0 }, d: 4 }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(279.6), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(279.6), v: { x: -1, y: -0.2 } }]} luz={BORDE_FRIO} />
          <Aliento x={TX + 24} y={P - 252} dir={1} cada={34} o={1} />
        </>} />
      {tira}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={343} setProps={LV} claves={[mira(C3, 470, 650, 1.9), mira(k(282.2), 470, 655, 1.95, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: 1 }]}
            ikD={ikClaves([{ f: C3, x: TX + 40, y: P - 200, w: 0 }, { f: C3 + 8, x: TX + 36, y: P - 238, w: 1 }])}
            brz={[{ f: C3 + 8, v: { cabeza: 10 }, d: 6 }, { f: k(281.5), v: { cabeza: 4 }, d: 8 }]}
            caras={[{ f: 0, v: "asco" }, { f: k(281.4), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(281.4), v: { x: 1, y: -0.1 } }]} luz={BORDE_CALIDO} />
          <Mejilla x={TX + 46} y={P - 234} o={tw(f, C3 + 4, C3 + 16, 0, 1)} r={20} /><Dolor x={TX + 46} y={P - 234} r={30} o={tw(f, C3 + 10, C3 + 18, 0, 1)} />
        </>} />
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
  const cl = f < kB ? [mira(0, TX - 40, 560, 1.75), mira(kB, TX - 30, 566, 1.82)] : [mira(kB, D - 5, 592, 1.3), mira(k(289.7), D - 5, 596, 1.33)];
  const mand = ikClaves([{ f: 0, x: TX - 42, y: PS - 236 }, { f: k(287.7), x: TX - 42, y: PS - 236 }, { f: k(288.0), x: TX - 80, y: PS - 160, w: 0 }, { f: k(288.5), x: TX - 80, y: PS - 160, w: 0 }, { f: k(288.85), x: TX - 42, y: PS - 236 }]);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={44} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={cl}
        medio={<>
          <CartelTienda x={D} y={526} txt="DENTAL" />
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: PS }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "brazosCruzados" }, { f: k(284.45), v: "manosCara" }, { f: k(285.6), v: "parado" }, { f: k(286.5), v: "saludar" }, { f: k(287.5), v: "parado" }, { f: k(288.7), v: "brazosCruzados" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(283.6), v: "miedo" }, { f: k(285.6), v: "triste" }, { f: k(286.5), v: "determinado" }, { f: k(287.9), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(284.45), v: { x: 1, y: 0.3 } }, { f: k(285.6), v: { x: 1, y: 0 } }]}
            giros={[{ f: k(287.9), v: 0 }, { f: k(288.1), v: -0.6 }, { f: k(288.3), v: 0.6 }, { f: k(288.5), v: -0.5 }, { f: k(288.7), v: 0.3 }, { f: k(288.9), v: 0 }]} seed={2} />
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} dir={[{ f: 0, v: -1 }]} ikD={mand}
            brz={[{ f: 0, v: { hI: 8, cI: 10 } }, { f: k(283.55), v: { hI: 30, cI: 100 }, d: 8 }, { f: k(284.43), v: { hI: 45, cI: 140 }, d: 6 }, { f: k(285.2), v: { hI: 8, cI: 10 }, d: 10 }, { f: k(287.9), v: { hI: 75, cI: 55 }, d: 8 }, { f: k(288.6), v: { hI: 8, cI: 10 }, d: 10 }]}
            caras={[{ f: 0, v: "asco" }, { f: k(283.55), v: "miedo" }, { f: k(285.6), v: "duda" }, { f: k(287.9), v: "sorpresa" }, { f: k(288.65), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(284.4), v: { x: 0.4, y: -0.7 } }, { f: k(285.5), v: { x: 1, y: 0 } }, { f: k(287.9), v: { x: 1, y: 0.3 } }]} />
          <Venda hx={TX} hy={PS - 261} dir={-1} />
        </>} />
      <Vineta x={1330} y={200} icono="muela" rotulo="INFECTED TOOTH" desde={k(283.6)} hasta={kB - 10} tam={110} acento="#e2483a" />
      <Vineta x={1600} y={200} icono="cruz" rotulo="SEPSIS" desde={k(284.45)} hasta={kB - 10} tam={110} acento="#e2483a" />
      <GranNumero rotulo="DENTISTS LEFT · TWO PEOPLE" claves={[{ f: 0, v: 2 }, { f: k(287.9), v: 0, d: 18 }]} y={110} tam={96} desde={kB + 2} color="#e2483a" />
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
      {f >= kC && <Picto2 x={P45X} y={P45Y} desde={kC + 2} herida={k(297.6)} apaga={k(298.6)} texto={1e9} />}
    </AbsoluteFill>
  );
};
const P45X = 560, P45Y = 330;

// 46 · (sigue el contraplano: «…la mitad de la humanidad») → días 10-30: la mudanza (colchón en alto, la puerta, la estufa, el lago) → la ferretería
export const P46Casa: React.FC = () => {
  const f = useF();
  const k = kDe(299.43);
  const A = k(301.1);
  return f < A ? <Regla46 k={k} /> : <Desfase d={A}><SeqMudanza ks={(t) => k(t) - A} /></Desfase>;
};
const Regla46: React.FC<{ k: (t: number) => number }> = ({ k }) => (
  <AbsoluteFill>
    <Escena Set={Living} pal={PAL} seed={45} setProps={LIV_OTONO} claves={[mira(0, P45C.X, P45C.Y, P45C.z + 0.03), mira(k(301.1), P45C.X, P45C.Y, P45C.z + 0.06)]}
      medio={<>
        <HeladeraJune ls={REGLAS_HECHAS(6)} />
        <g transform={`translate(2800,${P})`}><Escalera /></g>
        <PjX look={THEO_CASA} ruta={[{ f: 0, x: 2760, y: P }]} poses={[{ f: 0, v: "manosCara" }, { f: k(300.0), v: "brazosCruzados" }]} caras={[{ f: 0, v: "triste" }, { f: k(300.1), v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.6 } }, { f: k(300.0), v: { x: 1, y: 0 } }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: 3128, y: P }]} objD={{ el: <Marcador />, rot: -90 }} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: k(299.9), v: "brazosCruzados" }]}
          caras={[{ f: 0, v: "triste" }, { f: k(300.0), v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.4 } }, { f: k(299.9), v: { x: 1, y: 0 } }]} seed={2} />
      </>} />
    <Picto2 x={P45X} y={P45Y} desde={-60} herida={-50} apaga={-40} texto={k(299.75)} />
  </AbsoluteFill>
);
const SeqMudanza: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  const f = useF();
  const PB = BARRIO_PISO;
  const kB2 = ks(304.55), kB3 = ks(308.45);
  if (f >= kB3) return <Ferreteria46 k={(t) => ks(t) - kB3} />;
  const rT: Paso[] = [{ f: 0, x: 2960, y: PB }, { f: ks(304.4), x: 2260 }, { f: ks(307.6), x: 2260 }];
  const rJ: Paso[] = [{ f: 0, x: 2720, y: PB }, { f: ks(304.2), x: 2010 }];
  const tx = posRuta(rT, f).x;
  // colchón: en alto sobre la cabeza → lo baja y lo apoya contra la pared (girado, con la punta en el piso)
  const baja = tw(f, ks(305.0), ks(305.7), 0, 1);
  const cx = lerp(tx, 2160, baja), cy = lerp(PB - 338, PB - 128, baja), rot = lerp(0, -80, baja);
  const suelta = ks(305.8);
  const manos = (lado: number) => (ff: number) => {
    if (ff >= suelta + 8) return null;
    const b = tw(ff, ks(305.0), ks(305.7), 0, 1);
    const ccx = lerp(posRuta(rT, ff).x, 2160, b), ccy = lerp(PB - 338, PB - 128, b), r = (lerp(0, -80, b) * Math.PI) / 180;
    const lx = lado * 70, ly = 22;
    return { x: ccx + lx * Math.cos(r) - ly * Math.sin(r), y: ccy + lx * Math.sin(r) + ly * Math.cos(r), w: 1 - tw(ff, suelta, suelta + 8, 0, 1) };
  };
  const abre = tw(f, ks(304.8), ks(305.3), 0, 1);
  const cl = f < kB2
    ? [mira(0, 2420, 640, 1.2), mira(kB2, 2340, 640, 1.24)]
    : [mira(kB2, 2060, 660, 1.5), mira(ks(306.3), 2070, 660, 1.52), mira(ks(307.0), 2080, 500, 1.0, { curva: "inout" }), mira(kB3, 2090, 500, 1.02)];
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={46} setProps={{ hora: "dia", luces: 0, nieve: 0, humo: 0 }} claves={cl}
        medio={<>
          <PuertaCasa x={1900} piso={PB} abre={abre} />
          <CartelTienda x={1720} y={668} txt="7TH AVE E" fondo="#2f6a4a" color="#ffffff" tam={22} />
          <HumoVisible x={2090} y={150} o={tw(f, ks(306.5), ks(307.2), 0, 1)} color="#6e6a7a" />
          <PjX look={JUNE} ruta={rJ} dir={[{ f: 0, v: -1 }, { f: ks(307.8), v: 1 }]} objD={(ff) => (ff < ks(305.4) ? { el: <Llave />, rot: -90 } : undefined)}
            ikD={ikClaves([{ f: ks(304.4), x: 1946, y: PB - 112 }, { f: ks(305.3), x: 1946, y: PB - 112 }, { f: ks(305.6), x: 1990, y: PB - 120, w: 0 }])}
            poses={[{ f: 0, v: "parado" }, { f: ks(306.4), v: "señalar" }, { f: ks(307.3), v: "manosCintura" }, { f: ks(307.85), v: "señalar" }]}
            caras={[{ f: 0, v: "determinado" }, { f: ks(305.2), v: "feliz" }, { f: ks(306.5), v: "risa" }, { f: ks(307.85), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: ks(306.4), v: { x: 0.6, y: -1 } }, { f: ks(307.4), v: { x: 1, y: 0 } }]} seed={2} />
          <PjX look={THEO} ruta={rT} dir={[{ f: 0, v: -1 }, { f: ks(307.85), v: 1 }]} ikD={manos(1)} ikI={manos(-1)}
            poses={[{ f: 0, v: "parado" }, { f: ks(306.3), v: "manosCintura" }, { f: ks(307.9), v: "celebrar" }]}
            caras={[{ f: 0, v: "determinado" }, { f: ks(305.8), v: "feliz" }, { f: ks(306.6), v: "sorpresa" }, { f: ks(307.9), v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: ks(305.9), v: { x: 0.5, y: -1 } }, { f: ks(307.9), v: { x: 1, y: 0 } }]} />
          <Colchon x={cx} y={cy} rot={rot} />
        </>} />
      {f >= kB2 && <>
        <Vineta x={1220} y={180} icono="casa" rotulo="BRICK HOUSE" desde={ks(306.35)} check={ks(306.6)} tam={115} acento="#3aa86a" />
        <Vineta x={1430} y={180} icono="techo" rotulo="WOOD STOVE" desde={ks(306.6)} check={ks(307.0)} tam={115} acento="#3aa86a" />
        <Vineta x={1640} y={180} icono="agua" rotulo="LAKE VIEW" desde={ks(307.85)} check={ks(308.2)} tam={115} acento="#3aa86a" />
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
  const f = useF();
  const k = kDe(310.5);
  if (f >= k(NAF.S5)) return <Desfase d={k(NAF.S5)}><Tablero47 k={(t) => k(t) - k(NAF.S5)} /></Desfase>;
  if (f >= k(NAF.S3)) return <Surtidor47 k={k} />;
  return <Outdoor47 k={k} />;
};
const Outdoor47: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const O = 5560, JX = 5420, PS = SUP_PISO;
  const kS2 = k(NAF.S2);
  const rJ: Paso[] = [{ f: 0, x: O + 80, y: PS }, { f: k(311.9), x: JX }];
  const lee = { x: JX - 58, y: PS - 300 };
  const cl = f < kS2 ? [mira(0, O - 40, 610, 1.3), mira(kS2, O - 60, 612, 1.32)] : [mira(kS2, JX - 40, 640, 2.2), mira(k(NAF.S3), JX - 40, 646, 2.25)];
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
      {f < kS2 && <Vineta x={760} y={200} icono="bolsa" rotulo="SLEEPING BAGS" desde={k(311.65)} hasta={kS2 - 10} tam={110} acento={FRIO} />}
    </AbsoluteFill>
  );
};
const Surtidor47: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const PS = SUP_PISO;
  const TX = 420, CAP = { x: 504, y: PS - 132 };
  const kS4 = k(NAF.S4);
  if (f >= kS4) return <Frascos47 k={k} />;
  const gal = interpolate(f, [k(314.3), k(317.3)], [0, 26.4], CL);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={147} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(k(NAF.S3), 700, 640, 1.15), mira(kS4, 720, 640, 1.18)]}
        medio={<>
          <Pickup x={480} color="#3a5a8a" />
          <Pickup x={920} color="#7a2a2a" />
          <g transform={`translate(250,${PS - 300})`}>
            <rect x={-70} y={-40} width={140} height={74} rx={8} fill="#1a1a22" stroke="#5a5a66" strokeWidth={4} />
            <text x={0} y={-6} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={30} fill="#7dff6a">{gal.toFixed(1)}</text>
            <text x={0} y={24} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={18} letterSpacing={2} fill="#c8bfae">GALLONS</text>
          </g>
          <path d={`M300,${PS - 52} Q${(300 + CAP.x) / 2},${PS + 10} ${CAP.x - 14},${CAP.y + 6}`} stroke="#1a1a1e" strokeWidth={8} fill="none" />
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} ikD={() => ({ x: CAP.x - 14, y: CAP.y - 4 })} objD={{ el: <Pistola />, rot: -90 }}
            brz={[{ f: 0, v: { hI: 8, cI: 10 } }, { f: k(314.4), v: { hI: -35, cI: -95 }, d: 8 }, { f: k(316.5), v: { hI: 25, cI: 150 }, d: 8 }, { f: k(317.4), v: { hI: -35, cI: -95 }, d: 8 }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(315.3), v: "feliz" }, { f: k(316.5), v: "duda" }, { f: k(317.3), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(314.4), v: { x: -1, y: -0.3 } }, { f: k(315.3), v: { x: 1, y: 0 } }, { f: k(316.5), v: { x: 1, y: -0.4 } }]} />
        </>} />
    </AbsoluteFill>
  );
};
const Frascos47: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const PS = SUP_PISO;
  const TX = 430;
  const jarras = [{ x: 520, u: 0, t: 318.4, r: "NOW" }, { x: 585, u: 0.5, t: 320.37, r: "3 MO" }, { x: 650, u: 1, t: 321.5, r: "1 YR" }];
  const f = useF();
  const { fps } = vcV3();
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={148} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(k(NAF.S4), 560, 660, 1.85), mira(k(NAF.S5), 570, 664, 1.9)]}
        medio={<>
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} dir={[{ f: 0, v: 1 }]}
            ikD={ikClaves([{ f: k(318.3), x: TX + 60, y: PS - 170, w: 0 }, { f: k(319.6), x: 585, y: PS - 175 }, { f: k(320.9), x: 585, y: PS - 175 }, { f: k(321.5), x: 650, y: PS - 175 }, { f: k(322.4), x: 650, y: PS - 175 }, { f: k(322.8), x: TX + 40, y: PS - 120, w: 0 }])}
            brz={[{ f: 0, v: { hI: 8, cI: 10 } }, { f: k(321.5), v: { hI: 40, cI: 140 }, d: 8 }, { f: k(322.6), v: { hI: -35, cI: -95 }, d: 8 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(319.75), v: "asco" }, { f: k(321.4), v: "miedo" }, { f: k(322.45), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: k(321.5), v: { x: 1, y: 0.6 } }, { f: k(322.45), v: { x: 1, y: 0 } }]}
            giros={[{ f: k(322.5), v: 0 }, { f: k(322.7), v: -0.5 }, { f: k(322.9), v: 0.5 }, { f: k(323.1), v: -0.4 }, { f: k(323.3), v: 0 }]} />
          <Pickup x={480} color="#3a5a8a" />
          {jarras.map((j) => {
            if (f < k(j.t)) return null;
            const s = sprV3({ frame: f - k(j.t), fps, config: { damping: 12, stiffness: 160 } });
            return <g key={j.r}>
              <g transform={`translate(${j.x},${PS - 160 - 24 * 0.8}) scale(${0.8 * s})`}><Frasco u={j.u} /></g>
              <text x={j.x} y={PS - 112} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#ffffff" opacity={s}>{j.r}</text>
            </g>;
          })}
        </>} />
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
  const JX = 3262;
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={48} setProps={LIV_OTONO}
        claves={[mira(0, 3080, 620, 1.3), mira(k(328.6), 3080, 620, 1.3), mira(k(329.4), 3330, 650, 2.35, { curva: "inout" }), mira(k(335.0), 3330, 650, 2.35), mira(k(335.9), 3110, 630, 1.55, { curva: "inout" })]}
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
  const JX = 1500, TX = 1120, PB = BARRIO_PISO;
  const nevando = f >= k(341.1);
  const kB = k(341.2);
  const copoY = interpolate(f, [k(341.3), k(342.2)], [380, PB - 214], CL);
  const cl = f < kB ? [mira(0, 1600, 560, 0.95), mira(kB, 1580, 560, 0.97)] : [mira(kB, 1310, 640, 1.45), mira(k(344.8), 1310, 640, 1.48), mira(k(345.7), JX + 130, 610, 2.1, { curva: "inout" })];
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={49} setProps={{ hora: "invierno", luces: 0, nieve: tw(f, k(341.1), k(347), 0, 0.25), cae: nevando, humo: 1, ventanaCasa: 1 }} claves={cl}
        medio={<>
          <PuertaCasa x={1900} piso={PB} abre={0} />
          <HumoVisible x={2090} y={150} color="#7a7686" />
          {f >= k(341.3) && <g transform={`translate(${JX + 52 + Math.sin(f / 6) * 8 * (1 - tw(f, k(341.9), k(342.2), 0, 1))},${copoY})`} opacity={1 - tw(f, k(344.0), k(345.0), 0, 1)}>{[0, 60, 120].map((r) => <rect key={r} x={-1.5} y={-9} width={3} height={18} fill="#fff" transform={`rotate(${r})`} />)}</g>}
          <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: PB }]} ikD={(ff) => (ff < k(340.9) ? null : { x: JX + 52, y: PB - 205, w: tw(ff, k(340.9), k(341.3), 0, 1) * (1 - tw(ff, k(344.6), k(345.0), 0, 1)) })}
            poses={[{ f: 0, v: "parado" }, { f: k(344.7), v: "manosCintura" }, { f: k(345.7), v: "pensar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(341.2), v: "sorpresa" }, { f: k(342.3), v: "feliz" }, { f: k(344.78), v: "duda" }, { f: k(345.7), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(341.2), v: { x: 0.4, y: -1 } }, { f: k(342.2), v: { x: 1, y: 0.8 } }, { f: k(344.78), v: { x: -1, y: -0.2 } }, { f: k(346.6), v: { x: 1, y: 0 } }]} seed={2} />
          <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PB }]} ikD={ikClaves([{ f: k(342.6), x: TX + 16, y: PB - 130 }, { f: k(343.4), x: TX + 16, y: PB - 236 }, { f: k(343.8), x: TX + 10, y: PB - 120, w: 0 }])}
            ajuste={(p, ff) => (ff < k(343.7) ? p : { ...p, tronco: p.tronco + Math.sin(ff * 1.9) * 1.6 })}
            poses={[{ f: 0, v: "parado" }, { f: k(343.7), v: "encogerse" }]} caras={[{ f: 0, v: "neutral" }, { f: k(341.3), v: "sorpresa" }, { f: k(343.6), v: "cansado" }]}
            miradas={[{ f: 0, v: { x: 0.3, y: -1 } }, { f: k(343.6), v: { x: 1, y: 0 } }]} />
          <Aliento x={TX + 22} y={PB - 252} cada={60} o={nevando ? tw(f, k(343.6), k(344), 0, 1) : 0} />
          <Aliento x={JX + 22} y={PB - 252} cada={70} o={nevando ? tw(f, k(342.4), k(342.8), 0, 1) : 0} />
        </>} />
      {f >= kB && <EtiquetaFlotante x={560} y={230} rotulo="OUTSIDE · OCTOBER" claves={[{ f: kB + 3, v: 38 }, { f: k(343.4), v: 27, d: 40 }]} sufijo="°F" color={FRIO} tam={64} hasta={k(344.7)} />}
    </AbsoluteFill>
  );
};

// 50 · −30: el número (Theo de cuerpo entero en el puente) → CORTE primer plano tiritando → CORTE las mínimas de cada mes → CORTE la casa sin calor
export const P50Menos30: React.FC = () => {
  const f = useF();
  const k = kDe(347.48);
  const TX = 1650, PP = PUENTE_PISO;
  const k2 = k(350.4), k3 = k(353.3), k4 = k(357.4);
  if (f >= k4) return <Casa50 k={k} />;
  const cl = f < k2 ? [mira(0, TX - 60, 560, 1.05), mira(k2, TX - 60, 566, 1.1)] : f < k3 ? [mira(k2, TX + 20, 610, 2.1), mira(k3, TX + 20, 614, 2.16)] : [mira(k3, 930, 560, 1.2), mira(k4, 937, 560, 1.22)];
  return (
    <AbsoluteFill>
      <Escena Set={PuenteV3} pal={PAL} seed={50} setProps={{ hora: "noche", luces: 1, nieve: 1, vapor: 1, cae: true, hielo: 0.6 }} claves={cl}
        medio={<>
          <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PP }]} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "parado" }, { f: k(348.42), v: "manosCintura" }, { f: k(349.3), v: "parado" }, { f: k2, v: "encogerse" }, { f: k(353.9), v: "pensar" }, { f: k(355.84), v: "encogerse" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(348.6), v: "sorpresa" }, { f: k(349.3), v: "miedo" }, { f: k(351.4), v: "cansado" }, { f: k(353.9), v: "duda" }, { f: k(355.84), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 0.4, y: -1 } }, { f: k(349.3), v: { x: 1, y: 0 } }, { f: k(352.6), v: { x: 1, y: 0.4 } }, { f: k3, v: { x: -1, y: -0.6 } }, { f: k(355.84), v: { x: -1, y: 0 } }]}
            ajuste={(p, ff) => (ff < k2 ? p : { ...p, tronco: p.tronco + Math.sin(ff * 2.1) * 1.8, cabeza: (p.cabeza ?? 0) + Math.sin(ff * 2.7) * 1.2 })} />
          <g opacity={tw(f, k(350.4), k(351.4), 0, 1)}>{[[-26, -300], [-8, -318], [14, -312], [28, -296], [0, -330]].map(([dx, dy], i) => <circle key={i} cx={TX + dx} cy={PP + dy} r={4} fill="#ffffff" />)}</g>
          <Aliento x={TX + 24} y={PP - 252} cada={44} o={tw(f, k(349.3), k(349.8), 0, 1)} />
        </>} />
      <DatoGrande claves={[{ f: 0, v: 32 }, { f: k(348.5), v: -30, d: 40 }]} sufijo="°F" color={FRIO} rotulo="THE NUMBER THAT MATTERS UP HERE" y={170} tam={170} hasta={k2 - 10} />
      {f >= k2 && f < k3 && <Rotulo3 texto="JANUARY NIGHTS · NORTH SHORE" x={960} y={140} desde={k(351.4)} color={FRIO} tam={34} />}
      {f >= k3 && <GraficoFrio x={380} y={140} desde={k3 + 2} marca={k(354.4)} />}
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
          <Escarcha x={1072} y={242} w={456} h={396} u={tw(f, k(357.4), k(360.5), 0.2, 0.7, (t) => t)} />
          <EscarchaEsquina />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} ikD={(ff) => fro(ff, 1)} ikI={(ff) => fro(ff, -1)} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "cansado" }, { f: k(358.7), v: "miedo" }, { f: k(359.9), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(358.7), v: { x: 1, y: -0.5 } }, { f: k(359.9), v: { x: -1, y: 0.2 } }]} />
          <Aliento x={TX + 24} y={P - 252} cada={50} />
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
  const TX = 1300;
  const boca = { x: TX + 24, y: P - 250 };
  const mira2 = k(364.0);
  const sopla = (ff: number) => (ff < mira2 ? { x: boca.x, y: boca.y + 6 } : { x: TX + 70, y: P - 236 });
  const sopla2 = (ff: number) => (ff < mira2 ? { x: boca.x - 8, y: boca.y + 14 } : { x: TX + 50, y: P - 214 });
  const hielo = tw(f, mira2 + 4, mira2 + 20, 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={51} setProps={{ ...LIV_INV, hora: "noche", fuego: 0, cae: true }} claves={[mira(0, 1380, 600, 1.45), mira(k(366.0), 1390, 606, 1.55)]}
        medio={<>
          <Escarcha x={1072} y={242} w={456} h={396} u={tw(f, 0, k(365.9), 0.4, 1, (t) => t)} />
          <EscarchaEsquina />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} ikD={sopla} ikI={sopla2}
            poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "miedo" }, { f: k(362.2), v: "cansado" }, { f: mira2, v: "sorpresa" }, { f: k(364.8), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: mira2, v: { x: 1, y: 0.7 } }]} luz={BORDE_FRIO}
            ajuste={(p, ff) => ({ ...p, tronco: p.tronco + Math.sin(ff * 2.3) * 1.4 })} />
          <Aliento x={boca.x + 6} y={boca.y} cada={30} o={f < mira2 ? 1 : 0} />
          {hielo > 0 && [[TX + 82, P - 240], [TX + 76, P - 228], [TX + 62, P - 216], [TX + 56, P - 206]].map(([x, y], i) => <g key={i} opacity={hielo}><circle cx={x} cy={y} r={7 * hielo} fill="#eaf6ff" /><path d={`M${x - 9},${y} h18 M${x},${y - 9} v18`} stroke="#ffffff" strokeWidth={2} /></g>)}
        </>} />
      <Pildora texto="FROSTBITE AT −30°F" x={1490} y={250} desde={k(361.2)} color={FRIO} tam={32} />
      <Temporizador seg={seg} x={1490} y={390} desde={k(362.2)} color={FRIO} tam={56} />
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
  if (f >= B) return <Desfase d={B}><SeqRiesgos k={(t) => k(t) - B} /></Desfase>;
  if (f >= A) return <Desfase d={A}><SeqGrafico k={(t) => k(t) - A} /></Desfase>;
  return <SeqEntrega k={k} />;
};
const Tocones: React.FC = () => <><Tocon x={SENTADO.TX} piso={P} alto={58} /><Tocon x={SENTADO.JX} piso={P} alto={58} w={90} /></>;
const SeqEntrega: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const { TX, JX } = SENTADO;
  const pasa = k(367.3);
  return (
    <Escena Set={Living} pal={PAL} seed={52} setProps={{ ...LIV_INV, hora: "noche", fuego: 1 }} claves={[mira(0, 1600, 640, 1.6), mira(k(368.1), 1600, 646, 1.66)]}
      detras={<Tocones />}
      medio={<>
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
  const xs = [1010, 1180, 1350].map((x) => lerp(x, 1180 + (x - 1180) * 0.7, junta));
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={152} setProps={{ ...LIV_INV, hora: "noche", fuego: 1 }} claves={[mira(0, 1590, 600, 1.5), mira(k(383.4), 1590, 606, 1.56)]}
        detras={<Tocones />}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} poses={[{ f: 0, v: "sentado" }, { f: k(377.9), v: "manosCara" }, { f: k(379.0), v: "sentado" }]} asiento={[{ f: 0, v: 58 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(377.98), v: "miedo" }, { f: k(379.7), v: "duda" }, { f: k(380.4), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(377.98), v: { x: 1, y: -0.6 } }, { f: k(380.4), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentado" }]} asiento={[{ f: 0, v: 58 }]} ikD={() => ({ x: JX - 70, y: P - 130 })}
            ikI={ikClaves([{ f: k(378.0), x: JX - 60, y: P - 300, w: 0 }, { f: k(378.4), x: JX - 70, y: P - 330 }, { f: k(380.2), x: JX - 70, y: P - 330 }, { f: k(380.6), x: JX - 20, y: P - 160, w: 0 }])}
            objD={{ el: <CuadernoMano abierto />, rot: 0 }} caras={[{ f: 0, v: "duda" }, { f: k(378.0), v: "determinado" }, { f: k(381.2), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(378.0), v: { x: 1, y: -0.5 } }, { f: k(381.0), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Vineta x={xs[0]} y={240} icono="tobillo" rotulo="INJURY" desde={k(378.0)} acento="#e2483a" tam={110} />
      <Vineta x={xs[1]} y={240} icono="corte" rotulo="INFECTION" desde={k(378.84)} acento="#e2483a" tam={110} />
      <Vineta x={xs[2]} y={240} icono="frio" rotulo="COLD" desde={k(379.66)} acento={FRIO} tam={110} />
      {junta > 0 && <Svg><path d={`M${xs[0] - 70},350 Q${xs[0] - 70},372 ${xs[0] - 46},372 H${xs[2] + 46} Q${xs[2] + 70},372 ${xs[2] + 70},350`} stroke={FRIO} strokeWidth={6} fill="none" opacity={junta} /></Svg>}
      <Rotulo3 texto="ONE SEASON: WINTER" x={1180} y={440} desde={k(381.98)} color={FRIO} tam={36} />
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
  const tit = f < k(391.9) ? 1 : f < k(392.0) ? 0.3 : f < k(392.15) ? 1 : f < k(392.3) ? 0.4 : 1;
  const cl = f < kB ? [mira(0, 1500, 560, 1.05), mira(kB, 1540, 560, 1.07)] : [mira(kB, TX + 40, 640, 1.6), mira(k(392.7), TX + 30, 640, 1.66)];
  return (
    <AbsoluteFill>
      <Escena Set={PuenteV3} pal={PAL} seed={53} setProps={{ hora: "noche", luces: 1, farolas: tit, nieve: 1, vapor: 1, hielo: 0.3, cae: true }} claves={cl}
        medio={<>
          <PjX look={THEO_INV} ruta={[{ f: 0, x: 1250, y: PP }, { f: k(386.9), x: TX }]} dir={[{ f: 0, v: 1 }]}
            brz={[{ f: k(387.3), v: { hD: 40, cD: 60, hI: 35, cI: 65 }, d: 12 }, { f: k(391.2), v: null, d: 6 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(391.22), v: "encogerse" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(387.6), v: "cansado" }, { f: k(390.0), v: "feliz" }, { f: k(391.22), v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(388.3), v: { x: 1, y: -0.3 } }, { f: k(389.7), v: { x: -1, y: -0.1 } }, { f: k(391.22), v: { x: 1, y: -0.6 } }]} luz={BORDE_FRIO} />
          <Aliento x={TX + 24} y={PP - 252} cada={56} o={tw(f, k(386.8), k(387.4), 0, 1)} />
        </>} />
      {f < kB && <RelojDia min={21 * 60 + 14} x={1200} y={170} desde={k(384.6)} />}
    </AbsoluteFill>
  );
};

// 54 · el apagón: Superior Street se apaga en OLA → Theo (la farola sobre él se apaga) → del puente ve cómo la ola cruza la ciudad
//      (faroles de la costa, carteles, St. Mary's, todo) → río arriba se corta la línea → Theo sale corriendo
const AP = { c2: 395.0, c3: 395.8, c4: 400.9, c5: 405.0 };
export const P54Apagon: React.FC = () => {
  const f = useF();
  const k = kDe(392.68);
  if (f >= k(AP.c5)) return <Corre54 k={k} />;
  if (f >= k(AP.c4)) return <Desfase d={k(AP.c4)}><LineaRota rotura={k(403.06) - k(AP.c4)} nadie={k(403.95) - k(AP.c4)} /></Desfase>;
  if (f >= k(AP.c3)) return <Ola54 k={k} />;
  if (f >= k(AP.c2)) return <Farola54 k={k} />;
  return <Calle54 k={k} />;
};
const Calle54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const cl = [mira(0, 2100, 560, 0.78), mira(k(AP.c2), 2140, 560, 0.82)];
  const x = frenteOla(f, k(394.06), k(394.9), -40, 1960, 8);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={154} setProps={{ hora: "noche", luces: 0, rotulos: false }} claves={cl} />
      <Recorte x={x}><Escena Set={Superior} pal={PAL} seed={154} setProps={{ hora: "noche", luces: 1, rotulos: true }} claves={cl} /></Recorte>
      {f >= k(394.06) && f < k(394.95) && <AbsoluteFill style={{ top: 300, height: 560, background: `linear-gradient(90deg, rgba(0,0,0,0) ${x - 120}px, rgba(255,240,200,0.18) ${x - 6}px, rgba(0,0,0,0) ${x + 4}px)` }} />}
    </AbsoluteFill>
  );
};
const Farola54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const TX = 1650, PP = PUENTE_PISO;
  const l = f < k(395.15) ? 1 : f < k(395.2) ? 0.2 : f < k(395.27) ? 0.8 : 0;
  return (
    <Escena Set={PuenteV3} pal={PAL} seed={155} setProps={{ hora: "noche", luces: 1, farolas: l, nieve: 1, vapor: 0.8, cae: true, ciudad: true }} claves={[mira(k(AP.c2), TX + 10, 620, 2.2), mira(k(AP.c3), TX + 10, 624, 2.26)]}
      medio={<>
        {l > 0.5 && <Halo x={TX - 200} y={PP - 380} r={420} color="#ffcf6e" fuerza={0.45} />}
        <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PP }]} dir={[{ f: 0, v: 1 }]} brz={[{ f: 0, v: { hD: 40, cD: 60, hI: 35, cI: 65 } }, { f: k(395.2), v: null, d: 5 }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: k(395.25), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }, { f: k(395.25), v: { x: -1, y: -0.8 } }]} luz={l > 0.5 ? BORDE_CALIDO : BORDE_FRIO} />
      </>} />
  );
};
const Ola54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const TX = 1650, PP = PUENTE_PISO;
  const a = k(395.95), h = k(397.66), z = k(398.95);
  const fr = f < h ? frenteOla(f, a, h, 2300, 960, 6) : frenteOla(f, h, z, 960, 250, 9);
  const farolas = f < k(395.84) ? 1 : f < k(395.9) ? 0.3 : f < k(395.97) ? 0.9 : 0;
  const hosp = f < h ? 1 : f < h + 2 ? 0 : f < h + 4 ? 1 : 0;
  const rTx: Paso[] = [{ f: 0, x: TX, y: PP }, { f: k(396.86), x: TX }, { f: k(397.3), x: TX + 60 }];
  const rot = (t: string, a2: number, b2: number) => <Rotulo3 texto={t} x={960} y={235} desde={k(a2)} hasta={k(b2)} color="#f6ecd2" tam={40} />;
  return (
    <AbsoluteFill>
      <Escena Set={PuenteV3} pal={PAL} seed={156} setProps={{ hora: "noche", luces: 1, farolas, nieve: 1, vapor: 0.8, cae: true, ciudad: true, apagaDesde: fr, hospital: hosp }}
        claves={[mira(k(AP.c3), TX - 380, 600, 1.12), mira(k(AP.c4), TX - 400, 600, 1.16)]}
        medio={<PjX look={THEO_INV} ruta={rTx} dir={[{ f: 0, v: -1 }]} luz={BORDE_FRIO}
          poses={[{ f: 0, v: "parado" }, { f: k(395.84), v: "encogerse" }, { f: k(396.86), v: "señalar" }, { f: k(397.66), v: "manosCara" }, { f: k(399.74), v: "agarrarAlto" }, { f: k(400.4), v: "parado" }]}
          caras={[{ f: 0, v: "sorpresa" }, { f: k(396.86), v: "miedo" }, { f: k(398.78), v: "sorpresa" }, { f: k(399.74), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(397.66), v: { x: 1, y: -0.5 } }, { f: k(400.4), v: { x: 0.5, y: 0.3 } }]} />} />
      {rot("STREETLIGHTS", 395.84, 396.4)}
      {rot("SIGNS", 396.86, 397.25)}
      {rot("ST. MARY'S HOSPITAL", 397.66, 398.4)}
      {rot("THE WHOLE CITY · ONE SECOND", 398.78, 400.7)}
    </AbsoluteFill>
  );
};
const Corre54: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const TX = 1650, PP = PUENTE_PISO;
  const a = k(AP.c5);
  return (
    <Escena Set={PuenteV3} pal={PAL} seed={159} setProps={{ hora: "noche", luces: 0, farolas: 0, nieve: 1, vapor: 1, cae: true, hielo: 0.3, ciudad: true, apagaDesde: -1e9, hospital: 0 }}
      claves={[mira(a, TX + 120, 600, 1.15), mira(k(406.3), TX + 160, 600, 1.15)]}
      medio={<PjX look={THEO_INV} ruta={[{ f: a, x: TX, y: PP }, { f: a + 6, x: TX + 20 }, { f: k(406.3), x: TX + 900 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
        caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />} />
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
  if (f >= C) return <DosVentana k={k} />;
  if (f >= S) return <Desfase d={S}><SeqLinea k={(t) => k(t) - S} /></Desfase>;
  return <SeqJuneVentana k={k} />;
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
  const l1: Lin = { t: "90 days of winter.", x: 1060, y: 730, tam: 56, desde: k(413.6), hasta: k(416.9), color: "#1d2a4a", ancho: 430 };
  const l2: Lin = { t: "No power. Two people.", x: 1060, y: 810, tam: 56, desde: k(417.4), hasta: k(419.0), color: "#1d2a4a", ancho: 500 };
  const sub = tw(f, k(419.5), k(420.2), 0, 1);
  const tip = puntaMano([tramoLin(l1), tramoLin(l2), { a: k(419.5), b: k(420.2), tip: (u) => [1060 + 500 * u, 836] }], f, [1780, 1060], [2300, 1500]);
  return (
    <AbsoluteFill>
      <CuadernoGrande renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }]} zoom={[0, 1, 1]} vela />
      <Svg><g transform="rotate(-3 960 540)">
        <PaginaCenso uT={1} uD={1} />
        <Lineas ls={[l1, l2]} />
        {sub > 0 && <path d={`M1060,838 L${1060 + 500 * sub},834`} stroke={ROJO_CENSO} strokeWidth={6} strokeLinecap="round" />}
        <ManoLapiz x={tip[0]} y={tip[1]} manga="#2f7f86" tiembla={1} />
      </g></Svg>
    </AbsoluteFill>
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
          caras={[{ f: 0, v: "determinado" }, { f: k(421.1), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: k(421.0), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
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
        claves={[mira(0, 1905, 640, 1.25), mira(k(425.4), 1905, 640, 1.27), mira(k(426.3), 1900, 570, 1.1, { curva: "inout" }), mira(entra, 1900, 570, 1.11), mira(k(433.9), 1860, 600, 1.15, { curva: "inout" })]}
        medio={<>
          <HumoVisible x={2090} y={150} color="#8a8698" o={0.8} />
          <PuertaCasa x={1900} piso={PB} abre={abre} />
          {f < k(431.5) && <Halo x={JX - 40} y={PB - 190} r={260} color="#ffcf6e" fuerza={0.5} />}
          <PjX look={THEO_INV} ruta={rT} objD={{ el: <CuadernoMano />, rot: 0 }} opacidad={adentroT} dir={[{ f: 0, v: 1 }, { f: entra, v: 1 }]}
            ikD={ikClaves([{ f: 0, x: TX + 40, y: PB - 160 }, { f: k(424.0), x: TX + 40, y: PB - 160 }, { f: k(424.4), x: TX + 34, y: PB - 330 }, { f: k(425.4), x: TX + 34, y: PB - 330 }, { f: k(425.9), x: TX + 40, y: PB - 160 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(426.94), v: "saludar" }, { f: k(427.8), v: "parado" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(424.3), v: "determinado" }, { f: k(426.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(424.3), v: { x: 1, y: -0.5 } }, { f: k(425.6), v: { x: 0.2, y: 0 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE_INV} ruta={rJ} dir={[{ f: 0, v: -1 }]} objD={{ el: <Vela f={f} />, rot: 0 }} opacidad={adentro}
            ikD={ikClaves([{ f: 0, x: JX - 40, y: PB - 180 }, { f: k(424.0), x: JX - 40, y: PB - 180 }, { f: k(424.4), x: JX - 50, y: PB - 300 }, { f: k(425.4), x: JX - 50, y: PB - 300 }, { f: k(425.9), x: JX - 40, y: PB - 180 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(422.9), v: "señalar" }, { f: k(423.7), v: "parado" }]}
            caras={[{ f: 0, v: "duda" }, { f: k(422.9), v: "picaro" }, { f: k(424.3), v: "determinado" }, { f: k(426.0), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 0.1, y: 0 } }, { f: k(424.3), v: { x: 1, y: -0.5 } }, { f: k(425.6), v: { x: 0.1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <GloboA texto="WHAT WOULD YOU GRAB FIRST?" x={1000} y={300} tx={1190} ty={450} desde={k(422.0)} hasta={k(425.4)} tam={44} />
      <Pildora texto="TELL ME IN THE COMMENTS" x={1500} y={150} desde={k(425.7)} hasta={k(429.9)} color={AMBAR} tam={34} />
      <Pildora texto="NEXT · CAN TWO PEOPLE SURVIVE THE FIRST WINTER?" x={960} y={990} desde={k(430.3)} color="#f6ecd2" tam={28} />
      <AbsoluteFill style={{ background: "#000", opacity: tw(f, k(432.4), k(433.95), 0, 1, (t) => t) }} />
    </AbsoluteFill>
  );
};
