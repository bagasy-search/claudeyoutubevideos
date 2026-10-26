// lc03 · planos 0:00-2:46 (SEC 1-7 del plan MxM D:/rtmp/lc03_PLAN_MxM.md). Cuadros locales: l(segundo global).
import React from "react";
import { interpolate, spring } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { EtiquetaFlotante, Globo } from "../../anikit/pantalla";
import { Libro, Walkie } from "../../anikit/props";
import { BORDE_FRIO, GUS, JUNE, JUNE_INV, PAL, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { CANAL_PISO, CANAL_PUNTOS, CanalPark } from "../mundo/puente";
import { BARRIO_PISO, BARRIO_PUNTOS, Barrio, LIV_PISO, LIV_PUNTOS, Living } from "../mundo/casa";
import { Edificio, Auto } from "../mundo/comun";
import { A, Rotulo, loc } from "./comun_ep";
import { BEN, DEV, DeEspaldas, FILA_10, LILY, MARCUS, NAN, NINO, Ore, OreEspaldas, PRIYA, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, GRANJA_PUNTOS, Granja } from "./granja";
import { Mesa, Sotano, SOT_PISO, Techo, TECHO_PISO, CartelVerde } from "./insertos";
import { Fantasma, MIR_PISO, Mirador } from "./mirador";
import { SUB_PISO, Subsuelo } from "./subsuelo";
import { VIS_PISO, VIS_PUNTOS, Visitantes } from "./visitantes";

const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const des = (f: number, a: number, d = 10) => 1 - ap(f, a, d);

// los 10 de espaldas en la cima (cuadro 0 = miniatura sin «10 vs 1 CITY»)
export const FilaEspaldas: React.FC<{ f: number; y?: number; x0?: number; paso?: number; s?: number }> = ({ f, y = MIR_PISO + 30, x0 = 90, paso = 168, s = 1 }) => (
  <>
    {FILA_10.map((e, i) => e.perro
      ? <OreEspaldas key={e.id} x={x0 + i * paso} y={y} s={0.95 * s} f={f} />
      : <DeEspaldas key={e.id} x={x0 + i * paso} y={y + (i % 2) * 8} s={s} e={e} f={f} seed={i} />)}
  </>
);

// ---------- 1 · 0:00-3:9 · la colina: cuadro 0, la grúa sube sobre las cabezas hacia la ciudad ----------
export const P01: React.FC = () => {
  const f = useF();
  const l = loc(0);
  return (
    <Escena Set={Mirador} pal={PAL} setProps={{ luces: 0.1, nieve: 0.9 }} seed={11} mano={1.5}
      claves={[mira(0, 960, 540, 1), mira(l(0.4), 960, 535, 1.0), mira(l(3.9), 1000, 400, 1.42, { curva: "inout" })]}
      medio={<>
        <g opacity={ap(f, l(1.4), 14)}><CartelVerde x={1620} y={760} s={0.42} l1="DULUTH" l2="POP. 86,265" nieve={0.6} /></g>
      </>}
      frente={<FilaEspaldas f={f} />}
    />
  );
};

// ---------- 2 · 3:9-17:1 · la calle se abre: cables, caños, bombas; cientos de trabajadores fantasma → quedan los 10 ----------
const LOS10 = [
  { k: "gus", look: GUS, x: 760 }, { k: "theo", look: THEO_INV, x: 880 }, { k: "june", look: JUNE_INV, x: 990 }, { k: "marcus", look: MARCUS, x: 1110 },
  { k: "rosa", look: ROSA, x: 1220 }, { k: "dev", look: DEV, x: 1330 }, { k: "priya", look: PRIYA, x: 1440 }, { k: "nan", look: NAN, x: 1560 },
  { k: "ben", look: BEN, x: 1660, nino: true }, { k: "lily", look: LILY, x: 1750, nino: true },
];
export const P02: React.FC = () => {
  const f = useF();
  const l = loc(3.9);
  const fant = des(f, l(11.9), 9);
  const diez = ap(f, l(11.95), 12);
  const luz = { cable: ap(f, l(6.4), 8), gas: ap(f, l(5.5), 8) * 0.6, agua: ap(f, l(5.5), 8), cloaca: ap(f, l(6.1), 8) };
  return (
    <Escena Set={Subsuelo} pal={PAL} setProps={{ hora: "invierno", luz, flujo: 1, nieve: 0.5, luces: 0 }} seed={12} mano={2}
      claves={[mira(0, 300, 560, 0.62), mira(l(11.9), 1500, 560, 0.62), mira(l(12.6), 1260, 520, 0.95), mira(l(13.7), 1260, 520, 0.9), mira(l(14.9), 1700, 480, 1.55), mira(l(15.6), 1680, 470, 1.58), mira(l(16.4), 1560, 450, 1.65)]}
      medio={<>
        {fant > 0.01 && <g opacity={fant}>
          {Array.from({ length: 90 }).map((_, i) => <Fantasma key={i} x={-500 + i * 46 + (i % 3) * 13} y={SUB_PISO + (i % 4) * 6} s={2.2 + (i % 5) * 0.12} f={f} seed={i} />)}
        </g>}
        {LOS10.map((p, i) => (
          <A key={p.k} look={p.look} escala={p.nino ? NINO : 1} seed={20 + i} ruta={[{ f: 0, x: p.x, y: SUB_PISO }]} dir={[{ f: 0, v: i < 5 ? 1 : -1 }]}
            opacidad={() => diez}
            poses={p.k === "ben" || p.k === "lily" ? [{ f: 0, v: {} }, { f: l(13.9), v: "saludar" }, { f: l(15.2), v: {} }] : p.k === "nan" ? [{ f: 0, v: {} }, { f: l(15.7), v: { hD: 150, cD: 150, cabeza: -4 } }, { f: l(16.6), v: {} }] : [{ f: 0, v: {} }]}
            caras={p.k === "ben" || p.k === "lily" ? [{ f: 0, v: "neutral" }, { f: l(13.9), v: "feliz" }] : p.k === "nan" ? [{ f: 0, v: "neutral" }, { f: l(15.7), v: "picaro" }] : [{ f: 0, v: "duda" }]}
            miradas={[{ f: 0, v: { x: 0, y: -0.2 } }]} />
        ))}
      </>}
      hud={<>
        <EtiquetaFlotante x={1220} y={250} rotulo="AGE" claves={12} desde={l(14.3)} hasta={l(15.6)} color="#ffcf6e" tam={58} />
        <EtiquetaFlotante x={760} y={250} rotulo="AGE" claves={80} desde={l(16.1)} hasta={l(17.1)} color="#ffcf6e" tam={58} />
      </>}
    />
  );
};

// ---------- 3 · 17:1-22:9 · otra vez la colina, los 10 miran la ciudad; la pregunta escrita en el cielo ----------
export const P03: React.FC = () => {
  const f = useF();
  const l = loc(17.1);
  return (
    <Escena Set={Mirador} pal={PAL} setProps={{ luces: 0.08, nieve: 0.9, noche: ap(f, l(19), 120) * 0.4 }} seed={13} mano={2}
      claves={[mira(0, 1000, 470, 1.15), mira(l(22.9), 960, 520, 0.98, { curva: "inout" })]}
      frente={<FilaEspaldas f={f} />}
      hud={<Rotulo texto={"How long can 10 people\nkeep a city running?"} x={960} y={150} centro desde={l(17.5)} color="#ffcf6e" tam={84} vel={1.6} rot={0} />}
    />
  );
};

// ---------- 4 · 22:9-28:4 · recap: el living de 7th Ave, noche; el escáner se ilumina ----------
export const P04: React.FC = () => {
  const f = useF();
  const l = loc(22.9);
  const P = LIV_PISO;
  return (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "invierno", fuego: 1, lena: 0.3, latas: 0.4 }} seed={14}
      claves={[mira(0, 2350, 680, 1.45), mira(l(28.4), 2420, 650, 1.85, { curva: "inout" })]}
      medio={<>
        {[2150, 2640].map((x) => <g key={x}><rect x={x - 50} y={P - 112} width={100} height={16} rx={5} fill="#5a3a26" /><rect x={x - 44} y={P - 96} width={12} height={96} fill="#4a2e1e" /><rect x={x + 32} y={P - 96} width={12} height={96} fill="#4a2e1e" /></g>)}
        <A look={THEO_CASA} ruta={[{ f: 0, x: 2150, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 104 }]} poses={[{ f: 0, v: "sentado" }, { f: l(25.5), v: { ...{ tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92 }, hD: 60, cD: 40 } }]} caras={[{ f: 0, v: "cansado" }, { f: l(25.5), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0.1 } }, { f: l(25.5), v: { x: 0.8, y: 0.3 } }]} />
        <A look={JUNE} ruta={[{ f: 0, x: 2640, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 104 }]} poses={[{ f: 0, v: "sentado" }, { f: l(25.6), v: { tronco: 14, pI: 88, rI: 88, pD: 92, rD: 92, hI: 40, cI: 60 } }]} caras={[{ f: 0, v: "triste" }, { f: l(25.6), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.2 } }, { f: l(25.6), v: { x: 0.8, y: 0.4 } }]} />
        <g transform={`translate(2440,${P - 205}) scale(0.9) rotate(-80)`}><Walkie color="#22242a" luz={f > l(25.4) && Math.floor(f / 6) % 2 === 0} /></g>
        {f > l(25.4) && <Halo x={2440} y={P - 220} r={160} color="#ffcf6e" fuerza={0.5} />}
      </>}
    />
  );
};

// ---------- 5 · 28:4-31:9 · inserto del escáner: «Gus.» «Canal Park.» «Me and the dog.» ----------
export const P05: React.FC = () => {
  const f = useF();
  const l = loc(28.4);
  return (
    <Escena Set={Mesa} pal={PAL} setProps={{ obj: "escaner", luzRadio: 0.6 + 0.4 * Math.abs(Math.sin(f / 4)) }} seed={15} mano={2}
      claves={[mira(0, 960, 560, 1.2), mira(l(31.9), 940, 480, 1.5)]}
      hud={<>
        <Globo texto="Gus." x={1340} y={280} desde={l(28.6)} hasta={l(31.9)} cola="izq" tam={56} />
        <Globo texto="Canal Park." x={1420} y={430} desde={l(29.4)} hasta={l(31.9)} cola="izq" tam={56} />
        <Globo texto="Me and the dog." x={1460} y={580} desde={l(30.5)} hasta={l(31.9)} cola="izq" tam={56} />
      </>}
    />
  );
};

// ---------- 6 · 31:9-36:4 · a la mañana siguiente caminan por la nieve hacia el edificio de Gus ----------
export const P06: React.FC = () => {
  const l = loc(31.9);
  const P = CANAL_PISO;
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "invierno", luces: 0, nieve: 0.9, ventanaGus: 0.3, hielo: 0.6 }} seed={16}
      claves={[mira(0, 1350, 600, 0.95), mira(l(36.4), 820, 620, 1.25, { curva: "inout" })]}
      medio={<>
        <A look={THEO_INV} ruta={[{ f: 0, x: 2100, y: P }, { f: l(36.4), x: 700, y: P, curva: "lineal" }]} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "determinado" }]} />
        <A look={JUNE_INV} ruta={[{ f: 0, x: 2250, y: P }, { f: l(36.4), x: 860, y: P, curva: "lineal" }]} seed={2} caras={[{ f: 0, v: "duda" }]} />
      </>}
    />
  );
};

// ---------- 7 · 36:4-46:4 · Gus abre la puerta (71), tose, se enoja ----------
export const P07: React.FC = () => {
  const f = useF();
  const l = loc(36.4);
  const P = CANAL_PISO;
  const tos = f > l(42.4) && f < l(44.6) ? Math.sin(f * 1.3) * 5 : 0;
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "invierno", luces: 0, nieve: 0.9, ventanaGus: 0.3, hielo: 0.6 }} seed={17}
      claves={[mira(0, 560, 640, 1.25), mira(l(42.2), 520, 620, 1.35), mira(l(42.8), 430, 560, 2.0, { curva: "out" }), mira(l(46.4), 470, 570, 2.1)]}
      medio={<>
        <A look={GUS} ruta={[{ f: 0, x: CANAL_PUNTOS.gus - 10, y: P }, { f: l(37.8), x: CANAL_PUNTOS.gus + 40, y: P }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
          opacidad={(ff) => ap(ff, l(36.6), 8)}
          poses={[{ f: 0, v: {} }, { f: l(42.4), v: "encogerse" }, { f: l(44.6), v: "señalar" }, { f: l(45.8), v: "manosCintura" }]}
          caras={[{ f: 0, v: "duda" }, { f: l(38), v: "cansado" }, { f: l(42.4), v: "cansado" }, { f: l(44.4), v: "enojo" }]}
          habla={[[l(44.6), l(46.3)]]} ajuste={(p) => ({ ...p, tronco: p.tronco + tos, cabeza: p.cabeza + tos * 1.4 })} />
        <A look={THEO_INV} ruta={[{ f: 0, x: 700, y: P }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "sorpresa" }, { f: l(45), v: "duda" }]} giros={[{ f: 0, v: 0 }, { f: l(45.2), v: 0.6 }]} />
        <A look={JUNE_INV} ruta={[{ f: 0, x: 860, y: P }]} dir={[{ f: 0, v: -1 }]} seed={2} caras={[{ f: 0, v: "feliz" }, { f: l(45), v: "duda" }]} />
      </>}
      hud={<EtiquetaFlotante x={760} y={220} rotulo="GUS · AGE" claves={71} desde={l(37.6)} hasta={l(41.5)} color="#ffcf6e" tam={58} />}
    />
  );
};

// ---------- 8 · 46:4-53:5 · flashback: el sótano, Gus enfermo quema muebles en la caldera ----------
export const P08: React.FC = () => {
  const f = useF();
  const l = loc(46.4);
  const P = SOT_PISO;
  return (
    <Escena Set={Sotano} pal={PAL} setProps={{ fuego: 0.6 + ap(f, l(50.5), 20) * 0.4 }} seed={18}
      claves={[mira(0, 1000, 320, 1.0), mira(l(48.2), 1200, 640, 1.45, { curva: "inout" }), mira(l(53.5), 1240, 660, 1.6)]}
      medio={<A look={GUS} ruta={[{ f: 0, x: 1600, y: P }, { f: l(49.5), x: 1300, y: P }]} dir={[{ f: 0, v: -1 }]} luz={{ lado: -1, color: "#ff9a3a", fuerza: 0.9 }}
        poses={[{ f: 0, v: "agacharse" }, { f: l(48.6), v: { hD: 40, cD: 60, hI: 30, cI: 50, tronco: 10 } }, { f: l(50.2), v: "tirarCarga" }, { f: l(50.9), v: "tirarSuelta" }, { f: l(52), v: "encogerse" }]}
        caras={[{ f: 0, v: "cansado" }]}
        enManoD={(ff) => ff < l(50.9) ? <rect x={-6} y={-90} width={18} height={120} rx={5} fill="#6a4a32" /> : null} />}
    />
  );
};

// ---------- 9 · 53:5-59:2 · de noche: su farol mira al lago, no a la colina; la línea de visión choca ----------
export const P09: React.FC = () => {
  const f = useF();
  const l = loc(53.5);
  const linea = interpolate(f, [l(56.2), l(57.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.9, ventanaGus: 1, hielo: 0.6 }} seed={19}
      claves={[mira(0, 900, 520, 0.7), mira(l(59.2), 760, 520, 0.82)]}
      medio={<>
        <path d={`M-900,-300 L${-900 + (CANAL_PUNTOS.ventanaGus.x - 140 + 900) * linea},${-300 + (CANAL_PUNTOS.ventanaGus.y + 300) * linea}`} stroke="#ffcf6e" strokeWidth={8} strokeDasharray="22 18" fill="none" opacity={0.9} />
        {linea >= 1 && <g transform={`translate(${CANAL_PUNTOS.ventanaGus.x - 150},${CANAL_PUNTOS.ventanaGus.y})`}><path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke="#e23a2e" strokeWidth={14} strokeLinecap="round" /></g>}
        {/* el farol tira la luz hacia el lago (derecha) */}
        <path d={`M${CANAL_PUNTOS.ventanaGus.x + 20},${CANAL_PUNTOS.ventanaGus.y} L2600,${CANAL_PUNTOS.ventanaGus.y - 260} L2600,${CANAL_PUNTOS.ventanaGus.y + 380} Z`} fill="#ffcf6e" opacity={0.1 + 0.03 * Math.sin(f / 9)} />
      </>}
      hud={<Rotulo texto="facing the lake" x={1180} y={760} desde={l(55.0)} color="#ffcf6e" tam={64} rot={-3} />}
    />
  );
};

// ---------- 10 · 59:2-67:7 · Ore espera en la puerta desde el DÍA 4; Gus lo bautiza ----------
export const P10: React.FC = () => {
  const f = useF();
  const l = loc(59.2);
  const P = CANAL_PISO;
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "invierno", luces: 0, nieve: 1, ventanaGus: 0.2, hielo: 0.6, cae: true }} seed={20}
      claves={[mira(0, 470, 720, 1.7), mira(l(64.5), 430, 700, 1.75), mira(l(66.4), 470, 690, 2.05, { curva: "out" })]}
      medio={<>
        <Ore x={CANAL_PUNTOS.gus + 60} y={P} s={1.1} dir={1} f={f} sentado={1} cola={f > l(66.4) ? 1.4 : 0.15} cabeza={f < l(64) ? Math.sin(f / 50) * 8 : -10} />
        <A look={GUS} ruta={[{ f: 0, x: CANAL_PUNTOS.gus - 60, y: P }]} dir={[{ f: 0, v: 1 }]} opacidad={(ff) => ap(ff, l(64.8), 10)}
          poses={[{ f: 0, v: {} }, { f: l(65.6), v: { hD: 70, cD: 30, tronco: 18, cabeza: 12 } }]}
          ajuste={(p, ff) => (ff > l(65.6) ? { ...p, cD: p.cD + 12 * Math.sin(ff / 2.5) } : p)} caras={[{ f: 0, v: "feliz" }]} />
      </>}
      hud={<>
        <Rotulo texto="DAY 4" x={1250} y={300} desde={l(60.8)} hasta={l(64.5)} color="#f6ecd2" tam={72} rot={-3} brillo={false} />
        <Rotulo texto="ORE" x={1250} y={330} desde={l(66.6)} color="#ffcf6e" tam={120} rot={-4} />
      </>}
    />
  );
};

// ---------- 11 · 67:7-84:4 · el techo: antena, 50 años de radio, la llamada cada noche ----------
export const P11: React.FC = () => {
  const f = useF();
  const l = loc(67.7);
  const P = TECHO_PISO;
  const noches = [l(75.6), l(77.9), l(80.2)];
  return (
    <Escena Set={Techo} pal={PAL} setProps={{ onda: noches, luna: interpolate(f, [l(75), l(82.3)], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) % 1 }} seed={21}
      claves={[mira(0, 260, 780, 1.4), mira(l(70.0), 900, 650, 1.15, { curva: "inout" }), mira(l(74.8), 1180, 660, 1.4), mira(l(76.2), 1000, 400, 0.62, { curva: "inout" }), mira(l(82.2), 1000, 420, 0.66)]}
      medio={<A look={GUS} ruta={[{ f: 0, x: 225, y: P }, { f: l(70.0), x: 1000, y: P }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: {} }, { f: l(70.3), v: { hD: 60, cD: 80, tronco: 10 } }, { f: l(75.4), v: { hD: 30, cD: 130, cabeza: -4 } }]}
        caras={[{ f: 0, v: "determinado" }, { f: l(71), v: "feliz" }]} habla={[[l(75.6), l(76.6)], [l(77.9), l(78.9)], [l(80.2), l(81.2)]]} />}
      hud={<Rotulo texto={"50 YEARS ON THE AIR"} x={960} y={190} centro desde={l(72.0)} hasta={l(75.4)} color="#ffcf6e" tam={78} rot={0} />}
    />
  );
};

// ---------- 12 · 84:4-85:8 · inserto de la radio de Gus, DÍA 152 ----------
export const PRadio: React.FC<{ s0: number; s1: number; dial?: number; tono?: "calido" | "frio" }> = ({ s0, s1, dial = 0, tono = "frio" }) => {
  const f = useF();
  const l = loc(s0);
  return <Escena Set={Mesa} pal={PAL} setProps={{ obj: "radio", luzRadio: 0.5 + 0.5 * Math.abs(Math.sin(f / 5)), dial: dial + f * 0.002, tono }} seed={Math.round(s0)} mano={2} claves={[mira(0, 960, 520, 1.25), mira(l(s1), 900, 480, 1.5)]} />;
};

// ---------- 13 · 85:8-100:8 · Hermantown: la granja en invierno, Rosa en el walkie, Marcus con leña ----------
export const P13: React.FC = () => {
  const f = useF();
  const l = loc(85.8);
  const P = GRANJA_PISO;
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", humo: 1 }} seed={23}
      claves={[mira(0, 900, 560, 0.62), mira(l(88.2), 420, 640, 1.2, { curva: "inout" }), mira(l(91), 420, 640, 1.25), mira(l(95), 480, 620, 1.2), mira(l(100.8), 900, 520, 0.6, { curva: "inout" })]}
      medio={<>
        <A look={ROSA} ruta={[{ f: 0, x: GRANJA_PUNTOS.porche, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 30, cD: 130, cabeza: -6 } }, { f: l(93), v: {} }]} caras={[{ f: 0, v: "sorpresa" }, { f: l(87.5), v: "feliz" }]} habla={[[l(86.2), l(90.5)]]}
          enManoD={(ff) => (ff < l(93) ? <Walkie s={0.8} luz={Math.floor(ff / 6) % 2 === 0} /> : null)} />
        <A look={MARCUS} ruta={[{ f: 0, x: 1300, y: P }, { f: l(91.2), x: GRANJA_PUNTOS.porche + 160, y: P }]} poses={[{ f: 0, v: { hD: 60, cD: 80, hI: 60, cI: 80 } }, { f: l(91.4), v: { hD: 30, cD: 30, hI: 30, cI: 30, tronco: 18 } }, { f: l(92.4), v: {} }]} caras={[{ f: 0, v: "neutral" }, { f: l(92), v: "feliz" }]} seed={5}
          enManoD={(ff) => (ff < l(91.4) ? <g>{[0, 1, 2].map((k) => <rect key={k} x={-60} y={-14 - k * 22} width={120} height={20} rx={8} fill="#6a4a32" />)}</g> : null)} />
        {f > l(91.4) && [0, 1, 2].map((k) => <rect key={k} x={GRANJA_PUNTOS.porche + 120 + k * 30} y={P - 22 - (k % 2) * 18} width={120} height={20} rx={8} fill="#6a4a32" transform={`rotate(${k * 9 - 9} ${GRANJA_PUNTOS.porche + 160} ${P - 20})`} />)}
      </>}
      hud={<>
        <EtiquetaFlotante x={760} y={230} rotulo="ROSA · BAKER" claves={45} desde={l(91.6)} hasta={l(95)} color="#ffcf6e" tam={54} />
        <EtiquetaFlotante x={1160} y={230} rotulo="MARCUS · FARMER" claves={52} desde={l(90.0)} hasta={l(95)} color="#ffcf6e" tam={54} />
      </>}
    />
  );
};

// ---------- 14 · 100:8-116:3 · UMD: Dev en la caja de la pickup con el CB; el dormitorio con 1 ventana; llora ----------
export const P14: React.FC = () => {
  const f = useF();
  const l = loc(100.8);
  const P = BARRIO_PISO;
  const llora = f > l(113.3);
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "invierno", luces: 0, nieve: 0.8, ventanaCasa: 0 }} seed={24}
      claves={[mira(0, 1200, 520, 0.6), mira(l(103.5), 1450, 660, 1.2, { curva: "inout" }), mira(l(107.3), 1450, 660, 1.25), mira(l(109.0), 2550, 460, 0.8, { curva: "inout" }), mira(l(113.0), 2600, 450, 0.82), mira(l(113.4), 1480, 600, 2.3, { curva: "out" }), mira(l(116.3), 1480, 600, 2.4)]}
      detras={<g>
        <Edificio x={2150} y={P} w={900} h={760} color="#4a3a48" luces={0} seed="umd" techoNieve={1} />
        <rect x={2150 + 12 + 46 * 6} y={P - 760 + 30 + 62 * 4} width={24} height={32} fill="#ffcf6e" opacity={ap(f, l(108.5), 8)} />
        <rect x={2350} y={P - 820} width={500} height={70} fill="#2a2430" /><text x={2600} y={P - 770} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={44} fill="#f6ecd2" letterSpacing={4}>UMD · RESIDENCE HALL</text>
      </g>}
      medio={<>
        <Auto x={1450} y={P} color="#6a2f36" tipo="pickup" s={2.2} dir={-1} nieve={0.7} />
        <A look={DEV} ruta={[{ f: 0, x: 1560, y: P - 120 }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 0 }]} luz={BORDE_FRIO}
          poses={[{ f: 0, v: { ...{ tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92 }, hD: 30, cD: 130, cabeza: 8 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: l(106), v: "sorpresa" }, { f: l(113.3), v: "triste" }, { f: l(114.4), v: "risa" }, { f: l(115.0), v: "triste" }]} habla={[[l(106.2), l(116.3)]]}
          ajuste={(p, ff) => (llora ? { ...p, tronco: p.tronco + 2 * Math.sin(ff * 1.1) } : p)}
          enManoD={<rect x={-14} y={-24} width={28} height={40} rx={10} fill="#1d1d22" />} />
        {f > l(106.2) && <g><circle cx={1300} cy={P - 230} r={10} fill="#ff3a2e" /><Halo x={1300} y={P - 230} r={60} color="#ff3a2e" fuerza={0.6} /></g>}
        {llora && [0, 1].map((k) => <circle key={k} cx={1528 + k * 4} cy={P - 395 + ((f * 3 + k * 20) % 50)} r={4} fill="#9bd8ff" />)}
      </>}
      hud={<EtiquetaFlotante x={1000} y={230} rotulo="DEV · AGE" claves={20} desde={l(103.4)} hasta={l(107)} color="#ffcf6e" tam={54} />}
    />
  );
};

// ---------- 15 · 116:3-126:0 · Priya llega a pie a Canal Park siguiendo los ladridos de Ore ----------
export const P15: React.FC = () => {
  const f = useF();
  const l = loc(116.3);
  const P = CANAL_PISO;
  const oreX = interpolate(f, [l(123.4), l(124.6)], [CANAL_PUNTOS.gus + 80, 1180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.5, ventanaGus: 0.1, hielo: 0.2 }} seed={25}
      claves={[mira(0, 1700, 560, 0.7), mira(l(123.2), 1300, 620, 0.85, { curva: "inout" }), mira(l(124.8), 1260, 680, 1.4, { curva: "out" }), mira(l(126), 1270, 690, 1.45)]}
      medio={<>
        <A look={PRIYA} ruta={[{ f: 0, x: 2700, y: P }, { f: l(124.6), x: 1350, y: P, curva: "out" }]} caras={[{ f: 0, v: "cansado" }, { f: l(123.6), v: "sorpresa" }, { f: l(124.8), v: "risa" }]}
          poses={[{ f: 0, v: {} }, { f: l(124.7), v: "agacharse" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0 } }, { f: l(124.7), v: { x: -0.6, y: 0.6 } }]} />
        <Ore x={oreX} y={P} s={1} dir={1} f={f} paso={oreX} sentado={f < l(123.4) ? 1 : 0} ladra={f > l(123.2) && f < l(125.2) ? 1 : 0} cola={1.4} />
      </>}
      hud={<EtiquetaFlotante x={1000} y={230} rotulo="PRIYA · TEACHER" claves={38} desde={l(117.6)} hasta={l(122)} color="#ffcf6e" tam={54} />}
    />
  );
};

// ---------- 17 · 129:8-137:6 · el porche de Nan con los mellizos ----------
export const P17: React.FC = () => {
  const f = useF();
  const l = loc(129.8);
  const P = BARRIO_PISO;
  const X = BARRIO_PUNTOS.casa;
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, humo: 0.5 }} seed={27}
      claves={[mira(0, X, 520, 0.7), mira(l(132.5), X, 640, 1.25, { curva: "inout" }), mira(l(137.6), X + 40, 650, 1.35)]}
      medio={<>
        <A look={NAN} ruta={[{ f: 0, x: X, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: {} }, { f: l(131.4), v: { hD: 150, cD: 150, cabeza: -4 } }, { f: l(132.3), v: {} }]} caras={[{ f: 0, v: "feliz" }]} />
        <A look={BEN} escala={NINO} ruta={[{ f: 0, x: X - 190, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }]} caras={[{ f: 0, v: "picaro" }]} seed={8} />
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: X + 190, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "saludar" }, { f: l(134), v: {} }]} caras={[{ f: 0, v: "feliz" }]} seed={9} />
      </>}
      hud={<>
        <EtiquetaFlotante x={780} y={210} rotulo="NAN · LIBRARIAN" claves={80} desde={l(130.6)} hasta={l(134)} color="#ffcf6e" tam={54} />
        <EtiquetaFlotante x={1180} y={210} rotulo="BEN & LILY" claves={12} desde={l(133.8)} hasta={l(137.4)} color="#ffcf6e" tam={54} />
      </>}
    />
  );
};

// ---------- 18 · 137:6-141:4 · flashback DÍA 1, madrugada: los mellizos en pijama golpean su puerta ----------
export const P18: React.FC = () => {
  const f = useF();
  const l = loc(137.6);
  const P = BARRIO_PISO;
  const X = BARRIO_PUNTOS.casa;
  const golpe = (ff: number) => [l(138.6), l(139.2), l(139.8)].some((t) => ff > t && ff < t + 6);
  const PIJ_B = { ...BEN, camisa: "#9ab8e8", pantalon: "#9ab8e8" };
  const PIJ_L = { ...LILY, camisa: "#f0b8c8", pantalon: "#f0b8c8" };
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "alba", luces: 0, nieve: 0, humo: 0 }} seed={28}
      claves={[mira(0, X - 40, 700, 1.5), mira(l(141.4), X - 20, 690, 1.6)]}
      medio={<>
        <A look={PIJ_B} escala={NINO} ruta={[{ f: 0, x: X - 90, y: P }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} poses={[{ f: 0, v: {} }, ...[l(138.6), l(139.2), l(139.8)].flatMap((t) => [{ f: t, v: { hD: 100, cD: 60 } }, { f: t + 6, v: { hD: 70, cD: 80 } }])]} caras={[{ f: 0, v: "miedo" }]} />
        <A look={PIJ_L} escala={NINO} ruta={[{ f: 0, x: X - 210, y: P }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "triste" }]} seed={9} />
      </>}
      hud={<Rotulo texto="DAY 1" x={1300} y={240} desde={l(137.9)} color="#f6ecd2" tam={84} rot={-3} brillo={false} />}
    />
  );
};

// ---------- 19 · 141:4-144:3 · Nan les da la mano a los dos. «Ten.» ----------
export const P19: React.FC = () => {
  const l = loc(141.4);
  const P = BARRIO_PISO;
  const X = BARRIO_PUNTOS.casa;
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, humo: 0.5 }} seed={29}
      claves={[mira(0, X, 640, 1.3), mira(l(144.3), X, 600, 1.1)]}
      medio={<>
        <A look={NAN} ruta={[{ f: 0, x: X, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hI: -40, cI: -10, hD: 40, cD: 10 } }]} caras={[{ f: 0, v: "feliz" }]} />
        <A look={BEN} escala={NINO} ruta={[{ f: 0, x: X - 120, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 40, cD: 10 } }]} caras={[{ f: 0, v: "feliz" }]} seed={8} />
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: X + 120, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 40, cD: 10 } }]} caras={[{ f: 0, v: "feliz" }]} seed={9} />
      </>}
    />
  );
};

// ---------- 20 · 144:3-148:0 · el cuaderno rojo: June escribe «10» y lo subraya dos veces ----------
export const PCuaderno: React.FC<{ s0: number; s1: number; escritos: { t: string; g: number; x: number; y: number; tam?: number; sub?: number[]; color?: string }[] }> = ({ s0, s1, escritos }) => {
  const l = loc(s0);
  return (
    <Escena Set={Mesa} pal={PAL} setProps={{ obj: "cuaderno", escritos: escritos.map((e) => ({ t: e.t, desde: l(e.g), x: e.x, y: e.y, tam: e.tam, color: e.color, sub: (e.sub ?? []).map(l) })) }} seed={Math.round(s0)} mano={1.5}
      claves={[mira(0, 980, 540, 1.15), mira(l(s1), 1040, 520, 1.35)]} />
  );
};

// ---------- 21 · 148:0-152:2 · los 10 en el centro de visitantes, el puente detrás (dolly out) ----------
const ENFILA = (x0: number, paso: number) => [GUS, THEO_INV, JUNE_INV, MARCUS, ROSA, DEV, PRIYA, NAN, BEN, LILY].map((look, i) => ({ look, x: x0 + i * paso, nino: i >= 8 }));
export const P21: React.FC = () => {
  const f = useF();
  const l = loc(148.0);
  const P = VIS_PISO;
  return (
    <Escena Set={Visitantes} pal={PAL} setProps={{ hora: "dia" }} seed={31}
      claves={[mira(0, 1700, 640, 1.7), mira(l(152.2), 1700, 560, 0.72, { curva: "inout" })]}
      medio={<>
        {ENFILA(1180, 115).map((p, i) => <A key={i} look={p.look} escala={p.nino ? NINO : 1} seed={40 + i} ruta={[{ f: 0, x: p.x, y: P }]} dir={[{ f: 0, v: i % 2 ? -1 : 1 }]} caras={[{ f: 0, v: i % 3 ? "feliz" : "neutral" }]} />)}
        <Ore x={2400} y={P} s={0.95} dir={-1} f={f} echado={1} cola={0.6} />
      </>}
    />
  );
};

// ---------- 22 · 152:2-165:8 · la pizarra: Gus escribe los 6 sistemas; salen a mirarlos ----------
export const P22: React.FC = () => {
  const f = useF();
  const l = loc(152.2);
  const P = VIS_PISO;
  const filas = [["WATER", 159.0], ["POWER", 159.8], ["SEWER", 160.6], ["HEAT", 161.3], ["ROADS", 162.0], ["FOOD", 162.7]] as const;
  return (
    <Escena Set={Visitantes} pal={PAL} seed={32}
      setProps={{ hora: "dia", pizarra: [{ t: "DULUTH", desde: l(156.6), fila: -1, tam: 64, color: "#c0352c" }, ...filas.map(([t, g], i) => ({ t, desde: l(g), fila: i }))], tachas: [] }}
      claves={[mira(0, 640, 600, 1.25), mira(l(156.4), 560, 480, 1.6, { curva: "inout" }), mira(l(162.9), 560, 470, 1.65), mira(l(165.8), 1700, 600, 0.8, { curva: "inout" })]}
      medio={<>
        <A look={GUS} ruta={[{ f: 0, x: 1000, y: P }, { f: l(163.4), x: 1000, y: P }, { f: l(165.8), x: 2800, y: P }]} dir={[{ f: 0, v: -1 }, { f: l(163.4), v: 1 }]}
          poses={[{ f: 0, v: { hD: 120, cD: 30 } }, ...filas.map(([, g], i) => ({ f: l(g), v: { hD: 110 - i * 8, cD: 30 + (i % 2) * 20 } })), { f: l(163.4), v: {} }]}
          caras={[{ f: 0, v: "determinado" }]} habla={[[l(152.4), l(156)]]} enManoD={<rect x={-6} y={-30} width={12} height={36} rx={4} fill="#2a2a6a" />} />
        {ENFILA(1300, 120).slice(1).map((p, i) => <A key={i} look={p.look} escala={p.nino ? NINO : 1} seed={50 + i} ruta={[{ f: 0, x: p.x, y: P }, { f: l(163.3 + i * 0.12), x: p.x, y: P }, { f: l(165.8), x: p.x + 1500, y: P }]} dir={[{ f: 0, v: -1 }, { f: l(163.3), v: 1 }]} caras={[{ f: 0, v: "neutral" }]} />)}
      </>}
    />
  );
};
