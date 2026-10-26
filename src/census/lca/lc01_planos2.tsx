// lc01 · planos 30-57 (173,9 → 433,9 s): el encuentro en el lobby, POPULATION 2, la comida y el agua, lo que mata,
// las reglas de June, la casa de ladrillo, la primera nevada, −30 °F, el día 41 en el puente y el apagón.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Calendario, Globo, Pildora, RelojDia, Temporizador } from "../../anikit/pantalla";
import { Lata } from "../../anikit/props";
import { Supermercado, SUPER_PISO, SUPER_PUNTOS } from "../../anikit/sets/super";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_INV, PAL, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { FRIO } from "../hud";
import { Panorama, PANO_PISO } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { Puente, PUENTE_PISO, PUENTE_PUNTOS } from "../mundo/puente";
import { Barrio, BARRIO_PISO, BARRIO_PUNTOS, Living, LIV_PISO, LIV_PUNTOS } from "../mundo/casa";
import { Lobby, LOBBY_DESCANSO, LOBBY_PISO, LOBBY_PUNTOS } from "../mundo/hospital";
import { Lakewood } from "../lcb/lakewood";
import { Bolsa, CuadernoGrande, CuadernoMano, DatoGrande, DuoFrente, kDe, Lapiz, Matafuego, NotaHeladera, Pj, Vela } from "./base";

// living de la casa de ladrillo, encuadre y estado base (otoño: sin leña apilada todavía)
const LIV_OTONO = { hora: "dia", luces: 0, fuego: 0.6, lena: 0.15, latas: 0.6, mantas: false, reglas: 0 };

// ---------- 30 · Theo entra al lobby; June arriba de la escalera con el matafuego ----------
export const P30Lobby: React.FC = () => {
  const k = kDe(173.93);
  const D = LOBBY_DESCANSO;
  return (
    <Escena Set={Lobby} pal={PAL} claves={[mira(0, 700, LOBBY_PISO - 300, 1.0), mira(k(176), 1400, LOBBY_PISO - 340, 0.95, { curva: "inout" }), mira(k(178.8), D.x - 40, D.y - 180, 1.6, { curva: "inout" })]} seed={30} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        <Pj look={THEO} ruta={[{ f: 0, x: 120, y: LOBBY_PISO }, { f: k(176.5), x: 1100 }]} caras={[{ f: 0, v: "duda" }, { f: k(176.5), v: "sorpresa" }]} miradas={[{ f: k(176.5), v: { x: 1, y: -0.6 } }]} />
        <Pj look={JUNE} ruta={[{ f: 0, x: D.x + 60, y: D.y }]} dir={[{ f: 0, v: -1 }]} enManoD={<Matafuego />} poses={[{ f: 0, v: { hD: -60, cD: -80, hI: -30, cI: -90 } }]} caras={[{ f: 0, v: "miedo" }, { f: k(177), v: "enojo" }]} />
      </>} />
  );
};

// ---------- 31 · la pizarra: DON'T COME CLOSER. / ARE YOU SICK? ----------
export const P31Pizarra: React.FC = () => {
  const f = useF();
  const k = kDe(178.85);
  const tr = interpolate(f, [k(179.4), k(183.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Lobby} pal={PAL} claves={[mira(0, LOBBY_PUNTOS.pizarra + 120, LOBBY_PISO - 380, 1.55), mira(150, LOBBY_PUNTOS.pizarra + 100, LOBBY_PISO - 390, 1.7)]} seed={31}
      setProps={{ luces: 1, afuera: "noche", pizarra: "DON'T COME CLOSER.\nARE YOU SICK?", trazo: tr }}
      medio={<Pj look={JUNE} ruta={[{ f: 0, x: LOBBY_PUNTOS.pizarra + 330, y: LOBBY_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: -120, cD: -40 } }, { f: k(184), v: "parado" }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: -1, y: -0.3 } }, { f: k(183), v: { x: 1, y: 0 } }]} seed={2} />} />
  );
};

// ---------- 32 · «he's not»: June baja el matafuego ----------
export const P32Baja: React.FC = () => {
  const k = kDe(183.97);
  const D = LOBBY_DESCANSO;
  return (
    <Escena Set={Lobby} pal={PAL} claves={[mira(0, 1150, LOBBY_PISO - 230, 1.9), mira(k(184.9), 1150, LOBBY_PISO - 240, 2.0), mira(k(184.9) + 1, D.x + 40, D.y - 200, 1.9), mira(90, D.x + 40, D.y - 210, 2.0)]} seed={32} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        <Pj look={THEO} ruta={[{ f: 0, x: 1150, y: LOBBY_PISO }]} poses={[{ f: 0, v: { hD: -150, cD: -30, hI: 150, cI: 30 } }]} caras={[{ f: 0, v: "miedo" }]} giros={[{ f: 0, v: 0 }, { f: 6, v: 0.5 }, { f: 12, v: -0.5 }, { f: 18, v: 0.4 }, { f: 24, v: 0 }]} habla={[[0, k(184.9)]]} />
        <Pj look={JUNE} ruta={[{ f: 0, x: D.x + 60, y: D.y }]} dir={[{ f: 0, v: -1 }]} enManoD={<Matafuego />} poses={[{ f: 0, v: { hD: -60, cD: -80, hI: -30, cI: -90 } }, { f: k(185.2), v: "parado" }]} caras={[{ f: 0, v: "enojo" }, { f: k(185.5), v: "triste" }]} />
      </>} />
  );
};

// ---------- 33 · en el cuaderno el número cambia: 2 ----------
export const P33Dos: React.FC = () => {
  const k = kDe(186.77);
  return <CuadernoGrande renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }, { t: "2", desde: k(189.2), tam: 150, x: 1380, y: 470 }]} zoom={[0, 1.0, 1.1]} />;
};

// ---------- 34 · las cuentas: comida primero (el súper) ----------
export const P34Super: React.FC = () => {
  const k = kDe(191.73);
  return (
    <Escena Set={Supermercado} pal={PAL} claves={[mira(0, SUPER_PUNTOS.entrada + 300, SUPER_PISO - 320, 0.9), mira(k(198.4), SUPER_PUNTOS.pasillo, SUPER_PISO - 320, 0.95)]} seed={34} setProps={{}}
      medio={<>
        <Pj look={THEO} ruta={[{ f: 0, x: SUPER_PUNTOS.entrada, y: SUPER_PISO }, { f: k(197), x: SUPER_PUNTOS.pasillo - 150 }]} caras={[{ f: 0, v: "duda" }, { f: k(197), v: "feliz" }]} />
        <Pj look={JUNE} ruta={[{ f: 0, x: SUPER_PUNTOS.entrada - 180, y: SUPER_PISO }, { f: k(197.5), x: SUPER_PUNTOS.pasillo + 60 }]} caras={[{ f: 0, v: "neutral" }]} seed={2} />
      </>} />
  );
};

// ---------- 35 · la góndola: arroz, porotos, pasta, mantequilla de maní, carne en lata ----------
export const P35Gondola: React.FC = () => {
  const k = kDe(201.37);
  const items = ["RICE", "BEANS", "PASTA", "PEANUT BUTTER", "CANNED MEAT"];
  const t = [206.9, 207.6, 208.3, 209.1, 210.3];
  return (
    <AbsoluteFill>
      <Escena Set={Supermercado} pal={PAL} claves={[mira(0, SUPER_PUNTOS.pasillo - 300, SUPER_PISO - 380, 1.35), mira(k(214), SUPER_PUNTOS.piramide, SUPER_PISO - 360, 1.4)]} seed={35} setProps={{}}
        medio={<Pj look={JUNE} ruta={[{ f: 0, x: SUPER_PUNTOS.pasillo - 250, y: SUPER_PISO }, { f: k(214), x: SUPER_PUNTOS.piramide - 200 }]} enManoD={<Lata color="#c0352c" />} poses={[{ f: 0, v: "parado" }]} seed={2} />} />
      {items.map((it, i) => <Pildora key={it} texto={it} x={300 + i * 330} y={170 + (i % 2) * 70} desde={k(t[i])} color={AMBAR} tam={32} />)}
      <Pildora texto="SAFE FOR YEARS" x={960} y={880} desde={k(212.4)} color="#f6ecd2" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 36 · 2,000 calorías por día cada uno → 1,5 millones por año ----------
export const P36Calorias: React.FC = () => {
  const k = kDe(215.13);
  const f = useF();
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.estufa, LIV_PISO - 350, 0.85)]} seed={36} setProps={LIV_OTONO} />
      <AbsoluteFill style={{ background: "rgba(14,10,20,0.6)" }} />
      {f < k(219) ? <DatoGrande claves={[{ f: 0, v: 0 }, { f: 2, v: 2000 }]} rotulo="CALORIES A DAY · EACH" y={330} tam={170} />
        : <DatoGrande claves={[{ f: 0, v: 4000 }, { f: k(219.4), v: 1500000, d: 40 }]} rotulo="CALORIES A YEAR · FOR TWO" y={330} tam={170} desde={k(219)} />}
    </AbsoluteFill>
  );
};

// ---------- 37 · docenas de súper y depósitos: no se la comen en una vida ----------
export const P37Ciudad: React.FC = () => {
  const k = kDe(221.69);
  return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} claves={[mira(0, 2000, 640, 1.2), mira(220, 1800, 620, 0.8)]} seed={37} setProps={{ hora: "dia", luces: 0.2, nieve: 0, vapor: 0 }} />
      <DuoFrente looks={[THEO, JUNE]} xs={[260, 500]} y={1300} escala={2.0} caras={["sorpresa", "feliz"]} />
      <Pildora texto="DOZENS OF GROCERY STORES" x={960} y={140} desde={k(222.4)} color={AMBAR} tam={40} />
      <Pildora texto="NOT IN A LIFETIME" x={960} y={880} desde={k(227.3)} color="#f6ecd2" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 38 · lo fresco es una cuenta regresiva ----------
export const P38Fresco: React.FC = () => {
  const k = kDe(229.01);
  return (
    <AbsoluteFill>
      <Escena Set={Supermercado} pal={PAL} claves={[mira(0, SUPER_PUNTOS.caja - 300, SUPER_PISO - 360, 1.2), mira(330, SUPER_PUNTOS.caja, SUPER_PISO - 360, 1.35)]} seed={38} setProps={{ variante: "zombi" }}
        medio={<>
          <Pj look={JUNE} ruta={[{ f: 0, x: SUPER_PUNTOS.caja - 520, y: SUPER_PISO }, { f: 200, x: SUPER_PUNTOS.caja - 380 }]} poses={[{ f: 0, v: "pensar" }]} caras={[{ f: 0, v: "duda" }, { f: k(236.4), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }]} seed={2} />
          <Pj look={THEO} ruta={[{ f: 0, x: SUPER_PUNTOS.caja - 150, y: SUPER_PISO }]} enManoD={<Lata color="#e0a23a" />} poses={[{ f: 0, v: { hD: -40, cD: -110 } }]} caras={[{ f: 0, v: "asco" }]} dir={[{ f: 0, v: -1 }]} />
        </>} />
      <Pildora texto="BREAD · ~7 DAYS" x={480} y={200} desde={k(231.6)} color="#e0a23a" tam={40} />
      <Pildora texto="MILK · 7-14 DAYS" x={960} y={280} desde={k(233.6)} color="#f6ecd2" tam={40} />
      <Pildora texto="FREEZERS · WHEN THE POWER GOES" x={1300} y={360} desde={k(236.4)} color="#e2483a" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 39 · June escribe la regla 1 ----------
export const P39Regla1: React.FC = () => {
  const k = kDe(240.61);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.heladera - 100, LIV_PISO - 330, 1.3)]} seed={39} setProps={LIV_OTONO}
        medio={<Pj look={JUNE} ruta={[{ f: 0, x: LIV_PUNTOS.heladera - 280, y: LIV_PISO }]} enManoD={<Lapiz />} poses={[{ f: 0, v: { hD: -110, cD: -60 } }]} caras={[{ f: 0, v: "determinado" }]} />} />
      <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: k(243.0) }, { t: "   save the cans", desde: k(245.3) }]} x={700} y={180} w={760} />
    </AbsoluteFill>
  );
};

// ---------- 40 · el agua: la estación de bombeo de Lakewood ----------
export const P40Agua: React.FC = () => {
  const k = kDe(246.37);
  return (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} claves={[mira(0, 600, 640, 0.75), mira(k(256.2), 2100, 640, 0.85, { curva: "inout" })]} seed={40} setProps={{ hora: "dia", corte: 1, flujo: 1, aguja: 0.7, nieve: 0 }}
        hud={<svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Pj look={THEO} ruta={[{ f: 0, x: 260, y: 1240 }]} escala={2.1} caras={[{ f: 0, v: "duda" }, { f: k(256.4), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]} /></svg>} />
      <Pildora texto="LAKEWOOD PUMPING STATION" x={960} y={120} desde={k(250.3)} color={AMBAR} tam={38} />
      <Pildora texto="NO POWER = NO PRESSURE" x={960} y={900} desde={k(256.4)} color="#e2483a" tam={38} />
    </AbsoluteFill>
  );
};

// ---------- 41 · el lago de agua dulce más grande: hervirla y hay agua para siempre ----------
export const P41Lago: React.FC = () => {
  const k = kDe(258.49);
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} claves={[mira(0, PUENTE_PUNTOS.centro + 60, PUENTE_PISO - 230, 1.7), mira(200, PUENTE_PUNTOS.centro + 160, PUENTE_PISO - 260, 1.3)]} seed={41} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0.3 }}
        medio={<Pj look={THEO} ruta={[{ f: 0, x: PUENTE_PUNTOS.centro - 100, y: PUENTE_PISO }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} />} />
      <Pildora texto="BOIL IT" x={960} y={140} desde={k(263.3)} color={AMBAR} tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 42 · ¿qué mata de verdad a dos personas? ----------
export const P42Mata: React.FC = () => {
  const k = kDe(265.17);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1500, LIV_PISO - 300, 1.0), mira(k(275.9), 1350, LIV_PISO - 260, 1.4)]} seed={42} setProps={{ ...LIV_OTONO, hora: "ocaso", fuego: 0.9 }}
      medio={<>
        <Pj look={JUNE} ruta={[{ f: 0, x: 1250, y: LIV_PISO }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(273.4), v: "hablar" }]} caras={[{ f: 0, v: "neutral" }, { f: k(273.4), v: "determinado" }]} habla={[[k(273.4), k(275.9)]]} luz={BORDE_CALIDO} />
        <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1580, y: LIV_PISO }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }]} luz={BORDE_CALIDO} />
      </>} />
  );
};

// ---------- 43 · las cosas chicas: un corte, un tobillo, una noche fría, una muela ----------
export const P43Chicas: React.FC = () => {
  const k = kDe(275.91);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1350, LIV_PISO - 260, 1.4), mira(180, 1350, LIV_PISO - 250, 1.6)]} seed={43} setProps={{ ...LIV_OTONO, hora: "noche", fuego: 0.9 }}
        medio={<Pj look={JUNE} ruta={[{ f: 0, x: 1250, y: LIV_PISO }]} poses={[{ f: 0, v: "hablar" }]} caras={[{ f: 0, v: "determinado" }]} habla={[[0, 300]]} luz={BORDE_CALIDO} />} />
      <AbsoluteFill style={{ background: "rgba(14,10,20,0.35)" }} />
      <Pildora texto="AN INFECTED CUT" x={420} y={240} desde={k(276.0)} color="#e2483a" tam={40} />
      <Pildora texto="A BROKEN ANKLE" x={1500} y={320} desde={k(277.7)} color="#e2483a" tam={40} />
      <Pildora texto="ALONE · ON A COLD NIGHT" x={500} y={760} desde={k(278.9)} color={FRIO} tam={40} />
      <Pildora texto="A BAD TOOTH" x={1450} y={820} desde={k(280.7)} color="#e2483a" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 44 · ninguno es dentista ----------
export const P44Dentista: React.FC = () => (
  <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.dentista - 200, SUP_PISO - 300, 1.2), mira(120, SUP_PUNTOS.dentista - 240, SUP_PISO - 250, 1.6)]} seed={44} setProps={{ hora: "ocaso", luces: 0.4 }}
    medio={<>
      <Pj look={THEO} ruta={[{ f: 0, x: SUP_PUNTOS.dentista - 300, y: SUP_PISO }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} caras={[{ f: 0, v: "duda" }]} />
      <Pj look={JUNE} ruta={[{ f: 0, x: SUP_PUNTOS.dentista - 470, y: SUP_PISO }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }]} caras={[{ f: 0, v: "triste" }]} seed={2} />
    </>} />
);

// ---------- 45 · la regla 2: nada peligroso a solas ----------
export const P45Regla2: React.FC = () => {
  const k = kDe(289.61);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.heladera - 100, LIV_PISO - 330, 1.3)]} seed={45} setProps={{ ...LIV_OTONO, reglas: 1 }} />
      <NotaHeladera titulo="JUNE'S RULES" renglones={[{ t: "1. FRESH FOOD FIRST", desde: -999 }, { t: "2. NOTHING RISKY ALONE", desde: k(289.9) }, { t: "   no ladders", desde: k(291.2) }, { t: "   no chainsaws", desde: k(292.1) }, { t: "   no ice", desde: k(293.4) }]} x={640} y={110} w={860} tam={56} />
    </AbsoluteFill>
  );
};

// ---------- 46 · días 10-30: la casa de ladrillo de la 7th Ave East ----------
export const P46Casa: React.FC = () => {
  const f = useF();
  const k = kDe(299.43);
  const X = BARRIO_PUNTOS.casa;
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, X - 600, BARRIO_PISO - 300, 1.0), mira(k(309.5), X, BARRIO_PISO - 300, 1.05)]} seed={46} setProps={{ hora: "dia", luces: 0, nieve: 0, humo: interpolate(f, [k(306), k(308)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
        medio={<>
          <Pj look={THEO} ruta={[{ f: 0, x: X - 900, y: BARRIO_PISO }, { f: k(305), x: X - 60 }]} enManoD={<Bolsa />} caras={[{ f: 0, v: "feliz" }]} />
          <Pj look={JUNE} ruta={[{ f: 0, x: X - 1100, y: BARRIO_PISO }, { f: k(306), x: X - 220 }]} enManoD={<Bolsa color="#7a5a3a" />} caras={[{ f: 0, v: "neutral" }, { f: k(305), v: "feliz" }]} seed={2} />
        </>} />
      <Pildora texto="7TH AVENUE EAST · WOOD STOVE · LAKE VIEW" x={960} y={140} desde={k(303)} color={AMBAR} tam={34} />
    </AbsoluteFill>
  );
};

// ---------- 47 · ferretería, outdoor, dos camionetas con nafta ----------
export const P47Nafta: React.FC = () => {
  const k = kDe(310.5);
  const f = useF();
  const a = k(312.5);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, SUP_PUNTOS.ferreteria, SUP_PISO - 300, 1.1), mira(a - 4, SUP_PUNTOS.ferreteria, SUP_PISO - 300, 1.1), mira(a + 10, SUP_PUNTOS.holiday, SUP_PISO - 300, 1.15, { curva: "inout" }), mira(k(324.6), SUP_PUNTOS.holiday + 120, SUP_PISO - 280, 1.3)]} seed={47} setProps={{ hora: "dia", luces: 0 }}
        medio={f < a
          ? <Pj look={JUNE} ruta={[{ f: 0, x: SUP_PUNTOS.ferreteria - 250, y: SUP_PISO }, { f: a, x: SUP_PUNTOS.ferreteria + 120 }]} enManoD={<Bolsa color="#2f5a8a" />} seed={2} />
          : <Pj look={THEO} ruta={[{ f: 0, x: SUP_PUNTOS.holiday - 120, y: SUP_PISO }]} poses={[{ f: 0, v: { hD: -70, cD: -40 } }]} caras={[{ f: 0, v: "determinado" }]} />} />
      <Pildora texto="SLEEPING BAGS · RATED −30°F" x={960} y={140} desde={k(311)} hasta={a} color={FRIO} tam={36} />
      <Pildora texto="GAS GOES STALE IN MONTHS" x={960} y={140} desde={k(318.4)} color="#e2483a" tam={36} />
    </AbsoluteFill>
  );
};

// ---------- 48 · la lista de la heladera: lo que sólo hacían los humanos ----------
export const P48Lista: React.FC = () => {
  const k = kDe(326.52);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, LIV_PUNTOS.heladera, LIV_PISO - 330, 1.3)]} seed={48} setProps={{ ...LIV_OTONO, reglas: 2 }} />
      <NotaHeladera titulo="THINGS ONLY HUMANS DID" renglones={[{ t: "fix the pumps", desde: k(331.5), tachado: k(336.5) }, { t: "clear the roads", desde: k(332.8), tachado: k(337.5) }, { t: "treat the water", desde: k(333.9), tachado: k(338.5) }]} x={620} y={180} w={880} tam={62} />
    </AbsoluteFill>
  );
};

// ---------- 49 · día 33: la primera nevada ----------
export const P49Nieve: React.FC = () => {
  const X = BARRIO_PUNTOS.casa;
  return (
    <Escena Set={Barrio} pal={PAL} claves={[mira(0, X - 200, BARRIO_PISO - 320, 0.95), mira(220, X - 100, BARRIO_PISO - 340, 1.05)]} seed={49} setProps={{ hora: "invierno", luces: 0, nieve: 0.5, cae: true, humo: 1, ventanaCasa: 1 }}
      medio={<>
        <Pj look={THEO_INV} ruta={[{ f: 0, x: X - 500, y: BARRIO_PISO }]} miradas={[{ f: 0, v: { x: 0.3, y: -1 } }]} caras={[{ f: 0, v: "sorpresa" }]} />
        <Pj look={JUNE_INV} ruta={[{ f: 0, x: X - 680, y: BARRIO_PISO }]} miradas={[{ f: 0, v: { x: 0.3, y: -1 } }]} caras={[{ f: 0, v: "neutral" }]} seed={2} />
      </>} />
  );
};

// ---------- 50 · el número que importa acá arriba: −30 ----------
export const P50Menos30: React.FC = () => {
  const k = kDe(347.48);
  const f = useF();
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} claves={[mira(0, 1200, 560, 0.75), mira(k(353), 1200, 560, 0.82), mira(k(353) + 1, 1160, PUENTE_PISO - 220, 1.8), mira(k(360.5), 1150, PUENTE_PISO - 230, 2.0)]} seed={50} setProps={{ hora: "invierno", luces: 0, nieve: 1, vapor: 1, cae: true, hielo: 0.6 }}
        medio={<Pj look={THEO_INV} ruta={[{ f: 0, x: 1160, y: PUENTE_PISO }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "miedo" }]} giros={Array.from({ length: 60 }).map((_, i) => ({ f: k(353) + i * 4, v: i % 2 ? 0.06 : -0.06 }))} luz={BORDE_FRIO} />} />
      <AbsoluteFill style={{ background: "rgba(10,14,30,0.45)", opacity: f < k(353) ? 1 : 0 }} />
      <DatoGrande claves={[{ f: 0, v: 32 }, { f: k(348.6), v: -30, d: 40 }]} sufijo="°F" color={FRIO} rotulo="JANUARY NIGHTS · NORTH SHORE" y={330} tam={190} hasta={k(352.8)} />
    </AbsoluteFill>
  );
};

// ---------- 51 · una casa sin calor es un freezer; congelamiento en 10 minutos ----------
export const P51Helada: React.FC = () => {
  const k = kDe(360.54);
  const f = useF();
  const seg = Math.max(0, 600 - Math.floor(Math.max(0, f - k(363)) * 4));
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1000, BARRIO_PISO - 300, 1.0), mira(170, 1100, BARRIO_PISO - 300, 1.1)]} seed={51} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true }}
        medio={<Pj look={THEO_INV} ruta={[{ f: 0, x: 1000, y: BARRIO_PISO }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "miedo" }]} luz={BORDE_FRIO} />} />
      <Pildora texto="FROSTBITE" x={960} y={140} desde={k(363)} color={FRIO} tam={44} />
      <Temporizador seg={seg} x={820} y={210} desde={k(363)} color={FRIO} tam={64} />
    </AbsoluteFill>
  );
};

// ---------- 52 · donde caen las cuentas: años… salvo el invierno ----------
export const P52Cuentas: React.FC = () => {
  const k = kDe(365.98);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 1900, LIV_PISO - 300, 0.85), mira(k(383.3), 1950, LIV_PISO - 280, 1.15)]} seed={52} setProps={{ hora: "invierno", luces: 0, fuego: 1, lena: 0.5, latas: 1, mantas: true, plastico: true, reglas: 2 }}
        medio={<>
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: 1600, y: LIV_PISO }]} enManoD={<CuadernoMano abierto />} caras={[{ f: 0, v: "feliz" }, { f: k(376.1), v: "triste" }]} luz={BORDE_CALIDO} />
          <Pj look={JUNE} ruta={[{ f: 0, x: 2280, y: LIV_PISO }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "neutral" }, { f: k(376.1), v: "determinado" }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Pildora texto="TWO CAREFUL PEOPLE → YEARS" x={960} y={140} desde={k(368.1)} color={AMBAR} tam={40} />
      <Pildora texto="INJURY · INFECTION · COLD" x={960} y={220} desde={k(378.0)} color="#e2483a" tam={40} />
    </AbsoluteFill>
  );
};

// ---------- 53 · invierno, día 41, 9:14 de la noche: Theo en el puente ----------
export const P53Puente: React.FC = () => {
  const k = kDe(383.32);
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} claves={[mira(0, PUENTE_PUNTOS.centro, 520, 1.0), mira(k(387.3), PUENTE_PUNTOS.centro, 560, 0.85, { curva: "inout" }), mira(k(392.6), PUENTE_PUNTOS.centro - 40, PUENTE_PISO - 220, 1.5, { curva: "inout" })]} seed={53}
        setProps={{ hora: "noche", luces: 1, nieve: 1, vapor: 1, hielo: 0.3 }}
        medio={<Pj look={THEO_INV} ruta={[{ f: 0, x: PUENTE_PUNTOS.centro - 40, y: PUENTE_PISO }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]} caras={[{ f: 0, v: "neutral" }]} luz={BORDE_FRIO} />} />
      <RelojDia min={21 * 60 + 14} x={1560} y={70} desde={k(384)} />
    </AbsoluteFill>
  );
};

// ---------- 54 · todas las luces se apagan de golpe ----------
export const P54Apagon: React.FC = () => {
  const f = useF();
  const k = kDe(392.68);
  const l = f < k(393.6) ? 1 : f < k(393.7) ? 0.6 : f < k(393.8) ? 1 : 0;
  return (
    <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1700, 600, 0.95), mira(k(395), 1700, 600, 0.95), mira(k(406.2), 1400, 620, 0.7)]} seed={54} setProps={{ hora: "noche", luces: l, nieve: 1, vapor: 0.6, ventana: 0 }}
      hud={<svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Pj look={THEO_INV} ruta={[{ f: 0, x: 300, y: 1230 }]} escala={2.2} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "neutral" }, { f: k(394), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }]} luz={BORDE_FRIO} />
        <rect x={-20} y={890} width={1000} height={26} fill="#2a2a34" /><rect x={-20} y={878} width={1000} height={14} fill="#e9eef8" />
        {[80, 380, 680].map((x) => <rect key={x} x={x} y={910} width={22} height={200} fill="#2a2a34" />)}
      </svg>} />
  );
};

// ---------- 55 · corre a casa: June ya está en la ventana con una vela ----------
export const P55Vela: React.FC = () => {
  const f = useF();
  const k = kDe(406.26);
  return (
    <Escena Set={Living} pal={PAL} claves={[mira(0, 1240, LIV_PISO - 270, 1.9), mira(k(408.5), 1300, LIV_PISO - 290, 1.6, { curva: "inout" })]} seed={55} setProps={{ hora: "noche", luces: 0, fuego: 0.25, lena: 0.5, latas: 1, mantas: true, plastico: true, reglas: 2, cae: true }}
      medio={<>
        <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1230, y: LIV_PISO }]} enManoD={<Vela f={f} />} poses={[{ f: 0, v: { hD: -40, cD: -110 } }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: k(409), v: { x: 1, y: 0 } }]} caras={[{ f: 0, v: "triste" }]} luz={BORDE_CALIDO} seed={2} />
        <Pj look={THEO_INV} ruta={[{ f: 0, x: 3700, y: LIV_PISO }, { f: k(409.5), x: 1600 }]} correr={1} caras={[{ f: 0, v: "miedo" }]} />
      </>} />
  );
};

// ---------- 56 · bajo el 2, una línea más ----------
export const P56Linea: React.FC = () => {
  const k = kDe(410.22);
  return <CuadernoGrande vela luz="#3a2a1a" renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }, { t: "2", desde: -999, tam: 150, x: 1380, y: 470 }, { t: "90 days of winter.", desde: k(416.0), tam: 50, x: 1080, y: 690, vel: 1.6 }, { t: "No power. Two people.", desde: k(418.3), tam: 50, x: 1080, y: 760, vel: 1.6 }]} zoom={[0, 1.05, 1.12]} />;
};

// ---------- 57 · ¿qué agarrarías primero? (ciudad a oscuras, una vela en una ventana) ----------
export const P57Cta: React.FC = () => {
  const k = kDe(421.8);
  const f = useF();
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1900, 640, 1.0), mira(360, 1900, 680, 1.2)]} seed={57} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0.8, ventanaCasa: 1 }}
        medio={<>
          <Pj look={THEO_INV} ruta={[{ f: 0, x: 1780, y: BARRIO_PISO }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]} luz={BORDE_CALIDO} />
          <Pj look={JUNE_INV} ruta={[{ f: 0, x: 1990, y: BARRIO_PISO }]} dir={[{ f: 0, v: -1 }]} enManoD={<Vela f={f} />} poses={[{ f: 0, v: { hD: -40, cD: -110 } }]} caras={[{ f: 0, v: "triste" }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Globo texto="WHAT WOULD YOU GRAB FIRST?" x={960} y={170} desde={k(422)} hasta={k(429.9)} tam={44} />
      <Pildora texto="THE CENSUS CONTINUES" x={960} y={860} desde={k(428.4)} color={AMBAR} tam={44} />
    </AbsoluteFill>
  );
};
