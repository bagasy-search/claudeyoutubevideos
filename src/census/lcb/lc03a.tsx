// lc03 · planos 0:00-2:46 (SEC 1-7 del plan MxM D:/rtmp/lc03_PLAN_MxM.md). Cuadros locales: l(segundo global).
// v1 (director creativo): actores grandes ACTUANDO, contadores con pop, onomatopeyas, manos en radios y cuaderno, cámara más cerca.
import React from "react";
import { interpolate, spring } from "remotion";
import { Clave, enPantalla, mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { EtiquetaFlotante, F_HUD, F_MANO, Globo } from "../../anikit/pantalla";
import { Libro, Walkie } from "../../anikit/props";
import { BORDE_FRIO, GUS, JUNE, JUNE_INV, PAL, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { CANAL_PISO, CANAL_PUNTOS, CanalPark } from "../mundo/puente";
import { BARRIO_PISO, BARRIO_PUNTOS, Barrio, LIV_PISO, LIV_PUNTOS, Living } from "../mundo/casa";
import { Edificio, Auto } from "../mundo/comun";
import { A, Rotulo, gestos, loc } from "./comun_ep";
import { BEN, DEV, DeEspaldas, FILA_10, LILY, MARCUS, NAN, NINO, Ore, OreEspaldas, PRIYA, ROSA } from "./elenco_lcb";
import { GRANJA_PISO, GRANJA_PUNTOS, Granja } from "./granja";
import { Mesa, Sotano, SOT_PISO, Techo, TECHO_PISO, CartelVerde } from "./insertos";
import { Fantasma, MIR_PISO, Mirador } from "./mirador";
import { SUB_PISO, Subsuelo } from "./subsuelo";
import { VIS_PISO, VIS_PUNTOS, Visitantes } from "./visitantes";
import { BarraRecorrido, CapaHud, CartelCanal, CasaTheo, Chispas, Contra, Cuenta, EspaldaGira, GloboEn, Huellas, Lagrimas, Llamarada, Mano, Onoma, Ondas, OreEspaldasAlza, PantallaRadio, Pastilla, PerillaMano, Pop, Sello, Senal, Silla, SillasTachadas, TapaPared, TapaVitrina, Tipeo, Vaho, palabrasHechas } from "./piezas_e3a";
import { osc } from "../../anikit/sets/comun";

const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const des = (f: number, a: number, d = 10) => 1 - ap(f, a, d);
const cl = (f: number, a: number, b: number, c0 = 0, c1 = 1) => interpolate(f, [a, b], [c0, c1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// etiqueta (número + rótulo) colgada de un punto del mundo: sigue al personaje aunque la cámara se mueva
const Sobre: React.FC<{ claves: Clave[]; pos: (f: number) => { X: number; Y: number }; rotulo: string; valor: number; desde: number; hasta: number; tam?: number }> = ({ claves, pos, rotulo, valor, desde, hasta, tam = 92 }) => {
  const f = useF();
  const p = pos(f);
  const s = enPantalla(claves, f, 30, p.X, p.Y);
  return <EtiquetaFlotante x={Math.max(220, Math.min(1700, s.x))} y={Math.max(200, s.y)} rotulo={rotulo} claves={valor} desde={desde} hasta={hasta} color="#ffcf6e" tam={tam} />;
};

// saltos de alegría: lista de cuadros de inicio → claves de ruta con y (el ajuste de piernas/brazos va en `saltoPose`)
const saltoRuta = (x: number, P: number, ts: number[], alto = 70) => [{ f: 0, x, y: P }, ...ts.flatMap((t) => [{ f: t, x, y: P }, { f: t + 7, x, y: P - alto, curva: "out" as const }, { f: t + 14, x, y: P, curva: "in" as const }])];
const saltoPose = (ts: number[]) => (p: any, f: number) => (ts.some((t) => f > t + 1 && f < t + 14) ? { ...p, hI: 150, cI: 20, hD: 150, cD: 20, pI: 22, rI: 50, pD: -22, rD: 50, tronco: -4 } : p);

// los 10 de espaldas en la cima (cuadro 0 = miniatura sin «10 vs 1 CITY»): se balancean y cambian de peso
export const FilaEspaldas: React.FC<{ f: number; y?: number; x0?: number; paso?: number; s?: number; amp?: number; giraDesde?: number }> = ({ f, y = MIR_PISO + 30, x0 = 90, paso = 168, s = 1, amp = 1, giraDesde }) => {
  const ramp = Math.min(1, f / 18) * amp;
  return (
    <>
      {FILA_10.map((e, i) => {
        const px = x0 + i * paso, py = y + (i % 2) * 8;
        const bal = Math.sin(f / 20 + i * 0.9) * 1.7 * ramp, dx = Math.sin(f / 31 + i * 1.7) * 4 * ramp;
        return (
          <g key={e.id} transform={`translate(${dx},0) rotate(${bal} ${px} ${py})`}>
            {e.perro ? (giraDesde === undefined ? <OreEspaldas x={px} y={y} s={0.95 * s} f={f + Math.round(Math.sin(f / 9) * 4)} /> : <OreEspaldasAlza x={px} y={y} s={0.95 * s} f={f + Math.round(Math.sin(f / 9) * 4)} alza={ap(f, 60, 10)} />)
              : giraDesde === undefined ? <DeEspaldas x={px} y={py} s={s} e={e} f={f} seed={i} />
              : <EspaldaGira x={px} y={py} s={s} e={e} f={f} seed={i} giro={(px < 960 ? 1 : -1) * 35 * ap(f, giraDesde + i * 5, 12)} torso={["gus", "june", "theo"].indexOf(e.id) >= 0 ? (px < 960 ? 1 : -1) * 15 * ap(f, giraDesde + i * 5, 14) : 0} />}
          </g>
        );
      })}
    </>
  );
};

// ---------- 1 · 0:00-3:9 · la colina: cuadro 0, la grúa sube sobre las cabezas hacia la ciudad ----------
export const P01: React.FC = () => {
  const f = useF();
  const l = loc(0);
  return (
    <Escena Set={Mirador} pal={PAL} setProps={{ luces: 0.1, nieve: 0.9 }} seed={11} mano={1.5}
      claves={[mira(0, 960, 540, 1), mira(l(0.4), 960, 535, 1.0), mira(l(3.9), 1010, 570, 1.12, { curva: "inout" })]}
      medio={<>
        <g opacity={ap(f, l(1.4), 14)}><CartelVerde x={1560} y={760} s={0.42} l1="DULUTH" l2="POP. 86,000" nieve={0.6} /></g>
      </>}
      frente={<FilaEspaldas f={f} giraDesde={l(1.0)} />}
      hud={<Cuenta x={1240} y={60} rotulo="DULUTH · POPULATION" claves={[{ f: 0, v: 0 }, { f: l(0.9), v: 86000, d: l(2.6) - l(0.9) }]} desde={l(0.9)} hasta={l(3.85)} tam={112} golpe={l(2.6)} />}
    />
  );
};

// ---------- 2 · 3:9-17:1 · la calle se abre: cables, caños, bombas; cientos de trabajadores fantasma → quedan los 10 ----------
const LOS10 = [
  { k: "gus", look: GUS, x: 700 }, { k: "theo", look: THEO_INV, x: 830 }, { k: "june", look: JUNE_INV, x: 950 }, { k: "marcus", look: MARCUS, x: 1080 },
  { k: "rosa", look: ROSA, x: 1200 }, { k: "dev", look: DEV, x: 1320, }, { k: "priya", look: PRIYA, x: 1440 }, { k: "nan", look: NAN, x: 1570 },
  { k: "ben", look: BEN, x: 1680, nino: true }, { k: "lily", look: LILY, x: 1775, nino: true },
];
export const P02: React.FC = () => {
  const f = useF();
  const l = loc(3.9);
  const diez = ap(f, l(12.15), 12);
  const luz = { cable: ap(f, l(6.4), 8), gas: ap(f, l(5.5), 8) * 0.6, agua: ap(f, l(5.5), 8), cloaca: ap(f, l(6.1), 8) };
  const f0 = l(10.3), f1 = l(12.0);
  const CL: Clave[] = [mira(0, 420, 520, 1.7), mira(l(8.0), 900, 520, 1.5), mira(l(12.0), 1500, 520, 1.3), mira(l(12.9), 1260, 520, 0.95), mira(l(13.7), 1260, 520, 0.9), mira(l(14.9), 1700, 480, 1.55), mira(l(15.6), 1680, 470, 1.58), mira(l(16.1), 1560, 450, 1.6), mira(l(16.9), 1230, 500, 0.92, { curva: "inout" })];
  return (
    <Escena Set={Subsuelo} pal={PAL} setProps={{ hora: "invierno", luz, flujo: 1, nieve: 0.5, luces: 0 }} seed={12} mano={2}
      claves={CL}
      medio={<>
        {f < f1 + 10 && <g>
          {Array.from({ length: 90 }).map((_, i) => {
            const ti = f0 + (((i * 37) % 90) / 90) * (f1 - f0);
            const o = 1 - ap(f, ti, 8);
            return o > 0.01 ? <g key={i} opacity={o}><Fantasma x={-500 + i * 46 + (i % 3) * 13} y={SUB_PISO + (i % 4) * 6} s={2.2 + (i % 5) * 0.12} f={f} seed={i} /></g> : null;
          })}
        </g>}
        {LOS10.map((p, i) => (
          <A key={p.k} look={p.look} escala={(p.nino ? NINO : 1) * 1.2} seed={20 + i} ruta={[{ f: 0, x: p.x, y: SUB_PISO }]} dir={[{ f: 0, v: i < 5 ? 1 : -1 }]}
            opacidad={() => diez}
            poses={p.k === "ben" || p.k === "lily" ? [{ f: 0, v: {} }, { f: l(13.9), v: "saludar" }, ...gestos(l(14.0), l(15.2), ["saludar", { hD: 125, cD: 50 }], 8), { f: l(15.3), v: {} }]
              : p.k === "nan" ? [{ f: 0, v: {} }, { f: l(15.7), v: { hD: 150, cD: 150, cabeza: -4 } }, { f: l(16.6), v: {} }]
              : [{ f: 0, v: {} }, ...gestos(l(12.4) + i * 4, l(17.1), [{ tronco: 2, hD: 10, cD: 12 }, {}, { tronco: -2, hI: -8, cI: 14 }, {}], 24)]}
            caras={p.k === "ben" || p.k === "lily" ? [{ f: 0, v: "neutral" }, { f: l(13.9), v: "feliz" }] : p.k === "nan" ? [{ f: 0, v: "neutral" }, { f: l(15.7), v: "picaro" }] : [{ f: 0, v: "duda" }]}
            giros={[{ f: 0, v: 0 }, { f: l(12.6) + i * 5, v: 0.9 }]}
            miradas={[{ f: 0, v: { x: 0, y: -0.2 } }]} />
        ))}
      </>}
      hud={<>
        <Pastilla texto="THOUSANDS OF WORKERS" x={1120} y={120} desde={l(4.6)} hasta={f1 + 4} color="#ffcf6e" tam={70} />
        <Pastilla texto="10 PEOPLE" x={1240} y={130} desde={f1 + 2} hasta={l(13.6)} color="#ffffff" tam={100} />
        <Sello claves={CL} X={1800} Y={SUB_PISO - 262} numero="12" rotulo="BEN & LILY" desde={l(14.3)} hasta={l(17.1) + 2} salida={3} fondo tam={72} xMin={300} xMax={1620} />
        <Sello claves={CL} X={1570} Y={SUB_PISO - 430} numero="80" rotulo="NAN" desde={l(15.6)} hasta={l(17.1) + 2} salida={3} fondo tam={72} xMin={300} xMax={1620} />
      </>}
    />
  );
};

// ---------- 3 · 17:1-22:9 · CONTRAPLANO: los 10 de frente en la cima iluminados por la ciudad, cámara baja; la pregunta se escribe y la ciudad se apaga palabra a palabra ----------
export const P03: React.FC = () => {
  const f = useF();
  const l = loc(17.1);
  const P = 840;
  const Q = "How long can 10 people\nkeep a city running?";
  const ph = palabrasHechas(Q, f, l(17.5), 0.8);
  const orden = [LOS10[0], LOS10[1], LOS10[2], LOS10[3], LOS10[4], LOS10[5], LOS10[6], LOS10[7], LOS10[8], LOS10[9]];
  const pos: Record<string, number> = { gus: 1040, theo: 880, june: 715, marcus: 1200, rosa: 550, dev: 1360, priya: 385, nan: 1520, ben: 1650, lily: 260 };
  const luzF = { lado: -1 as const, color: "#ff9a4a", fuerza: 0.9 };
  const poseDe = (k: string, i: number): any[] => {
    if (k === "gus") return [{ f: 0, v: {} }, { f: l(18.4), v: "brazosCruzados" }];
    if (k === "june") return [{ f: 0, v: {} }, { f: l(18.6), v: { hD: 70, cD: 95, hI: 10, cI: 40, cabeza: 6 } }, ...gestos(l(19.6), l(22.9), [{ hD: 62, cD: 105, hI: 10, cI: 40, cabeza: 8 }, { hD: 74, cD: 90, hI: 10, cI: 40, cabeza: 4 }], 26)];
    if (k === "ben" || k === "lily") return [{ f: 0, v: {} }, ...gestos(l(18.0), l(22.9), [{ hD: 20, cD: 20 }, {}, { hI: -12, cI: 20 }, {}], 30)];
    if (k === "theo") return [{ f: 0, v: {} }, ...gestos(l(18.0), l(22.9), ["pensar", {}, "manosCintura", {}], 36)];
    if (k === "rosa") return [{ f: 0, v: {} }, ...gestos(l(18.2), l(22.9), ["manosCintura", {}, "pensar", {}], 34)];
    if (k === "marcus") return [{ f: 0, v: {} }, ...gestos(l(18.0), l(22.9), ["manosCintura", { tronco: 3 }, {}], 30)];
    if (k === "dev") return [{ f: 0, v: {} }, { f: l(18.3), v: "encogerse" }, ...gestos(l(20.0), l(22.9), ["encogerse", "manosCara"], 40)];
    if (k === "nan") return [{ f: 0, v: {} }, ...gestos(l(18.5), l(22.9), [{ hD: 40, cD: 80, tronco: 2 }, {}, { hI: -20, cI: 30 }, {}], 32)];
    return [{ f: 0, v: {} }, ...gestos(l(18.0 + i * 0.1), l(22.9), ["pensar", {}, "manosCintura"], 40)];
  };
  return (
    <Escena Set={Contra} pal={PAL} setProps={{ apagadas: ph }} seed={13} mano={2}
      claves={[mira(0, 960, 680, 1.0), mira(l(22.9), 960, 640, 1.2, { curva: "inout" })]}
      medio={<>
        {orden.map((p, i) => (
          <A key={p.k} look={p.look} escala={(p.nino ? NINO : 1) * 1.05} seed={60 + i} ruta={[{ f: 0, x: pos[p.k], y: P + (i % 2) * 6 }]} dir={[{ f: 0, v: i % 2 ? -1 : 1 }]} luz={luzF}
            poses={poseDe(p.k, i)}
            caras={p.k === "dev" ? [{ f: 0, v: "triste" }] : p.k === "gus" ? [{ f: 0, v: "determinado" }] : p.k === "june" ? [{ f: 0, v: "neutral" }, { f: l(18.6), v: "duda" }] : [{ f: 0, v: "duda" }, { f: l(20.5), v: i % 2 ? "triste" : "duda" }]}
            giros={p.k === "ben" || p.k === "lily" ? [{ f: 0, v: 0 }, { f: l(18.4), v: -0.9 }] : p.k === "gus" || p.k === "nan" ? [{ f: 0, v: 0 }, { f: l(18.4), v: 0.5 }, { f: l(21), v: -0.3 }] : [{ f: 0, v: 0 }]}
            miradas={p.k === "ben" || p.k === "lily" ? [{ f: 0, v: { x: -0.8, y: 0 } }] : p.k === "june" ? [{ f: 0, v: { x: 0, y: 0.6 } }] : [{ f: 0, v: { x: 0, y: -0.15 } }, { f: l(20.5), v: { x: 0.2, y: -0.3 } }]}
            enManoD={p.k === "june" ? (ff: number) => (ff > l(18.6) ? <g transform="translate(14,-8) rotate(-14)"><Libro color="#c0352c" abierto /></g> : null) : undefined} />
        ))}
      </>}
      hud={<Tipeo texto={Q} x={960} y={90} desde={l(17.5)} cps={0.8} tam={84} />}
    />
  );
};

// ---------- 4 · 22:9-28:4 · recap: el living de 7th Ave, noche; el escáner se ilumina; June se inclina a tocarlo ----------
const SEN = { tronco: -4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 };
export const P04: React.FC = () => {
  const f = useF();
  const l = loc(22.9);
  const P = LIV_PISO;
  const CL: Clave[] = [mira(0, 2350, 680, 1.45), mira(l(25.3), 2400, 680, 1.55, { curva: "inout" }), mira(l(28.4), 2460, 650, 1.8, { curva: "inout" })];
  const lean = { tronco: 22, hD: 95, cD: 4, hI: 20, cI: 40, cabeza: 8 };
  const de = { tronco: 0, hD: 6, cD: 10, hI: -6, cI: 8, pI: -3, rI: 2, pD: 3, rD: 2 };
  return (
    <Escena Set={Living} pal={PAL} setProps={{ hora: "invierno", fuego: 1, lena: 0.3, latas: 0.4 }} seed={14}
      claves={CL}
      medio={<>
        {[2150, 2600].map((x) => <g key={x}><rect x={x - 50} y={P - 112} width={100} height={16} rx={5} fill="#5a3a26" /><rect x={x - 44} y={P - 96} width={12} height={96} fill="#4a2e1e" /><rect x={x + 32} y={P - 96} width={12} height={96} fill="#4a2e1e" /></g>)}
        <A look={THEO_CASA} ruta={[{ f: 0, x: 2150, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 104 }]}
          poses={[{ f: 0, v: SEN }, ...gestos(l(23.2), l(25.4), [{ ...SEN, hD: 30, cD: 135, cabeza: 6 }, SEN], 34), { f: l(25.5), v: { ...SEN, tronco: 14, hD: 95, cD: 3 } }, ...gestos(l(25.8), l(28.4), [{ ...SEN, tronco: 16, hD: 100, cD: 0 }, { ...SEN, tronco: 12, hD: 88, cD: 6 }], 12)]}
          caras={[{ f: 0, v: "cansado" }, { f: l(25.5), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0.1 } }, { f: l(25.5), v: { x: 0.8, y: 0.3 } }]} habla={[[l(26), l(28.3)]]} />
        <A look={JUNE} ruta={[{ f: 0, x: 2590, y: P }, { f: l(25.4), x: 2590, y: P }, { f: l(26.3), x: 2515, y: P, curva: "out" }]} dir={[{ f: 0, v: -1 }]}
          asiento={[{ f: 0, v: 104 }, { f: l(25.35), v: 104 }, { f: l(25.35) + 8, v: 168 }, { f: l(25.35) + 9, v: undefined }]}
          poses={[{ f: 0, v: SEN }, { f: l(25.35), v: SEN }, { f: l(25.35) + 8, v: { ...de, tronco: 6, hI: 60, cI: 20, hD: 70, cD: 20 } }, { f: l(26.3), v: lean }, ...gestos(l(26.6), l(28.4), [{ ...lean, hD: 100, cD: 0 }, { ...lean, hD: 84, cD: 14, tronco: 18 }], 9)]}
          caras={[{ f: 0, v: "triste" }, { f: l(25.4), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.2 } }, { f: l(25.6), v: { x: 0.8, y: 0.4 } }]} />
        <g transform={`translate(2440,${P - 205}) scale(0.9) rotate(-80)`}><Walkie color="#22242a" luz={f > l(25.4) && Math.floor(f / 6) % 2 === 0} /></g>
        {f > l(25.4) && <><Halo x={2440} y={P - 220} r={160 + 40 * Math.sin(f / 3)} color="#ffcf6e" fuerza={0.5} /><Ondas x={2440} y={P - 220} desde={l(25.4)} rmax={230} periodo={44} /></>}
        {f > l(25.4) && <Senal x={2580} y={P - 330} s={0.8} nivel={5 * cl(f, l(25.4), l(27.6)) * (0.8 + 0.2 * Math.sin(f / 2))} />}
      </>}
      hud={<GloboEn claves={CL} X={2450} Y={P - 395} texto="Gus?" desde={l(26.4)} hasta={l(28.3)} cola="abajo" tam={60} />}
    />
  );
};

// ---------- 5 · 28:4-31:9 · inserto del escáner: «Gus.» «Canal Park.» «Me and the dog.» (vibra con la voz; mano en los botones) ----------
export const P05: React.FC = () => {
  const f = useF();
  const l = loc(28.4);
  const z = (ff: number) => 1.2 + 0.3 * (ff / l(31.9));
  const claves = Array.from({ length: 19 }).map((_, k) => mira(k * 6, 940, 500 + (k % 2 ? 6 : -6), z(k * 6) + (k % 2 ? 0.03 : 0), { resorte: { damping: 12, stiffness: 140 } }));
  const bt = [[990, 620], [830, 540], [910, 620], [830, 700], [990, 700], [910, 540]];
  const fs = [0, 14, 30, 46, 62, 78, 94, 106];
  const tx = interpolate(f, fs, [1200, ...bt.map((b) => b[0]), 1100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, fs, [900, ...bt.map((b) => b[1]), 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const press = Math.abs(Math.sin(f * 0.22));
  // punta de los dedos: del grupo rotado (-8° sobre 960,560) al mundo y a pantalla
  const ca = Math.cos((-8 * Math.PI) / 180), sa = Math.sin((-8 * Math.PI) / 180);
  const wx = 960 + (tx - 960) * ca - (ty + press * 8 - 560) * sa, wy = 560 + (tx - 960) * sa + (ty + press * 8 - 560) * ca;
  const tip = enPantalla(claves, f, 30, wx, wy);
  const EJ = 2.33, JX = 380 + 30 * cl(f, l(30.0), l(31.9)), JY = 760 + 261 * EJ;
  const sorpresa = f > l(30.5);
  return (
    <Escena Set={Mesa} pal={PAL} setProps={{ obj: "escaner", luzRadio: 0.6 + 0.4 * Math.abs(Math.sin(f / 4)) }} seed={15} mano={2}
      claves={claves}
      medio={<g transform="rotate(-8 960 560)">
        <Ondas x={910} y={390} rmax={340} periodo={40} grosor={7} fuerza={0.7} />
        <rect x={792} y={312} width={236} height={156} rx={12} fill="#1a1a1e" />
        <rect x={800} y={320} width={220} height={140} rx={10} fill="#f0c25a" />
        <text x={910} y={412} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={58} fill="#241606">162.4</text>
      </g>}
      hud={<>
        <CapaHud>
          <A look={JUNE} escala={EJ} ruta={[{ f: 0, x: JX, y: JY }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: { tronco: 6, hD: 118, cD: 6, hI: 10, cI: 20 } }, { f: l(30.45), v: { tronco: 6, hD: 118, cD: 6, hI: 10, cI: 20 } }, { f: l(30.45) + 6, v: { tronco: 0, hD: 118, cD: 6, hI: 60, cI: 112, cabeza: -6 } }]}
            caras={[{ f: 0, v: "duda" }, { f: l(29.4), v: "feliz" }, { f: l(30.5), v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.3 } }]} habla={[[l(28.7), l(29.2)], [l(30.5), l(31.7)]]} />
          <Mano x={tip.x} y={tip.y} bx={JX + 20} by={JY - 212 * EJ + 14} manga="#2f9aa0" pinza={press} s={0.62} />
          {sorpresa && <Onoma texto="!" x={JX + 90} y={JY - 330 * EJ} tiempos={[l(30.55)]} dur={40} tam={110} color="#ffffff" rot={8} />}
        </CapaHud>
        <Globo texto="Gus." x={1340} y={280} desde={l(28.6)} hasta={l(31.9)} cola="izq" tam={56} />
        <Globo texto="Canal Park." x={1420} y={430} desde={l(29.4)} hasta={l(31.9)} cola="izq" tam={56} />
        <Globo texto="Me and the dog." x={1460} y={580} desde={l(30.5)} hasta={l(31.9)} cola="izq" tam={56} />
      </>}
    />
  );
};

// ---------- 6 · 31:9-36:4 · a la mañana siguiente caminan por la nieve hacia el edificio de Gus (travelling, huellas, 0,6 mi) ----------
export const P06: React.FC = () => {
  const l = loc(31.9);
  const P = CANAL_PISO;
  const F1 = l(36.4);
  const xT = (f: number) => 2100 - 1400 * Math.min(1, f / F1);
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "invierno", luces: 0, nieve: 0.9, ventanaGus: 0.3, hielo: 0.6, cae: true }} seed={16}
      claves={[mira(0, 1950, 660, 1.25), mira(l(33.9), 1700, 660, 1.25, { curva: "inout" }), mira(l(35.0), 1060, 640, 1.18, { curva: "inout" }), mira(F1, 820, 640, 1.3, { curva: "inout" })]}
      detras={<CartelCanal />}
      medio={<>
        <Huellas x0={2250} x1={760} paso={-70} y={P} xAct={(f) => 2250 - 1390 * Math.min(1, f / F1)} />
        <A look={THEO_INV} escala={1.4} ruta={[{ f: 0, x: 2100, y: P }, { f: F1, x: 700, y: P, curva: "lineal" }]} poses={[{ f: 0, v: "encogerse" }, { f: l(33.6), v: "encogerse" }, { f: l(33.9), v: { hD: 112, cD: 0, hI: 20, cI: 50, tronco: 10, cabeza: -4 } }, { f: l(35.6), v: { hD: 108, cD: 2, hI: 20, cI: 50, tronco: 8 } }, { f: l(35.9), v: "encogerse" }]} caras={[{ f: 0, v: "cansado" }, { f: l(33.9), v: "determinado" }]} giros={[{ f: 0, v: 0 }, { f: l(33.2), v: 0.8 }, { f: l(33.8), v: 0 }]} habla={[[l(34.0), l(34.8)]]}
          ajuste={(p, ff) => { const u = Math.min(cl(ff, l(33.8), l(34.1)), cl(ff, l(35.5), l(35.8), 1, 0)); return u > 0 ? { ...p, hD: p.hD + (118 - p.hD) * u, cD: p.cD * (1 - u), cabeza: p.cabeza - 4 * u } : p; }} />
        <A look={JUNE_INV} escala={1.4} ruta={[{ f: 0, x: 2250, y: P }, { f: F1, x: 860, y: P, curva: "lineal" }]} seed={2} poses={[{ f: 0, v: { hI: 40, cI: 110, hD: 45, cD: 105 } }, { f: l(34.0), v: { hI: 40, cI: 110, hD: 45, cD: 105 } }, { f: l(34.3), v: { hI: 20, cI: 60, hD: 100, cD: 10 } }, { f: l(35.4), v: { hI: 20, cI: 60, hD: 100, cD: 10 } }, { f: l(35.7), v: { hI: 40, cI: 110, hD: 45, cD: 105 } }]} caras={[{ f: 0, v: "duda" }, { f: l(34.3), v: "sorpresa" }]} />
      </>}
      hud={<BarraRecorrido x={1240} y={928} w={760} rotulo="TO GUS'S BUILDING" valor="0.6 MI" desde={l(32.2)} hasta={l(36.2)} fin={l(36.4)} pastilla />}
    />
  );
};

// ---------- 7 · 36:4-46:4 · Gus abre la puerta (71), tose, se enoja ----------
export const P07: React.FC = () => {
  const f = useF();
  const l = loc(36.4);
  const P = CANAL_PISO;
  const tos = f > l(42.4) && f < l(44.6) ? Math.sin(f * 1.3) * 5 : 0;
  const gx = CANAL_PUNTOS.gus + 40;
  const toses = [l(42.5), l(43.1), l(43.7), l(44.3)];
  const CL: Clave[] = [mira(0, 560, 640, 1.25), mira(l(42.2), 560, 620, 1.4), mira(l(42.8), 600, 590, 1.7, { curva: "out" }), mira(l(46.4), 700, 600, 1.62)];
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "invierno", luces: 0, nieve: 0.9, ventanaGus: 0.3, hielo: 0.6 }} seed={17}
      claves={CL}
      detras={<CartelCanal />}
      medio={<>
        <A look={GUS} ruta={[{ f: 0, x: CANAL_PUNTOS.gus - 10, y: P }, { f: l(37.8), x: gx, y: P }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
          opacidad={(ff) => ap(ff, l(36.6), 8)}
          poses={[{ f: 0, v: {} }, ...gestos(l(38.2), l(42.3), [{ hD: 40, cD: 70, hI: -8, cI: 22 }, { hD: 20, cD: 120, cabeza: 6 }, {}, { hD: 60, cD: 50, tronco: 4 }], 30), { f: l(42.4), v: "encogerse" }, { f: l(44.6), v: "señalar" }, ...gestos(l(45.0), l(46.4), ["manosCintura", { hD: 100, cD: 0 }], 12)]}
          caras={[{ f: 0, v: "duda" }, { f: l(38), v: "cansado" }, { f: l(42.4), v: "cansado" }, { f: l(44.4), v: "enojo" }]}
          habla={[[l(38.4), l(42.2)], [l(44.6), l(46.3)]]} ajuste={(p) => ({ ...p, tronco: p.tronco + tos, cabeza: p.cabeza + tos * 1.4 })} />
        <A look={THEO_INV} ruta={[{ f: 0, x: 700, y: P }, { f: l(42.5), x: 700, y: P }, { f: l(43.3), x: 780, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: {} }, ...gestos(l(38.5), l(42.3), [{ hD: 15, cD: 25 }, {}], 40)]} caras={[{ f: 0, v: "sorpresa" }, { f: l(45), v: "duda" }]} giros={[{ f: 0, v: 0 }, { f: l(45.2), v: 0.6 }]} />
        <A look={JUNE_INV} ruta={[{ f: 0, x: 860, y: P }, { f: l(42.6), x: 860, y: P }, { f: l(43.4), x: 930, y: P }]} dir={[{ f: 0, v: -1 }]} seed={2} caras={[{ f: 0, v: "feliz" }, { f: l(42.6), v: "sorpresa" }, { f: l(45), v: "duda" }]} />
        <Vaho x={gx + 20} y={P - 262} tiempos={[l(38.5), l(40), l(41.4), ...toses]} tam={1.2} />
        <Onoma texto="COF!" x={gx + 190} y={P - 330} tiempos={toses} tam={64} color="#f6ecd2" />
      </>}
      hud={<Sello claves={CL} X={gx + 235} Y={P - 310} numero="71" rotulo="GUS · AGE" desde={l(37.6)} hasta={l(42.3)} tam={92} xMin={330} xMax={1500} />}
    />
  );
};

// ---------- 8 · 46:4-53:5 · flashback: el sótano, Gus enfermo arrastra muebles a la caldera y los quema ----------
const Mueble: React.FC<{ k: number }> = ({ k }) => {
  const m = k % 6;
  const c = "#6a4a32", c2 = "#4a2e1e";
  if (m === 0) return <g><rect x={-30} y={-10} width={60} height={14} rx={4} fill={c} /><rect x={-30} y={-62} width={12} height={54} fill={c2} /><rect x={-28} y={4} width={10} height={40} fill={c2} /><rect x={18} y={4} width={10} height={40} fill={c2} /></g>;
  if (m === 1) return <rect x={-70} y={-9} width={140} height={18} rx={5} fill={c} />;
  if (m === 2) return <g><rect x={-42} y={-26} width={84} height={52} rx={5} fill={c} /><rect x={-14} y={-6} width={28} height={8} rx={3} fill="#c9a36a" /></g>;
  if (m === 3) return <g><rect x={-8} y={-52} width={16} height={104} rx={4} fill={c2} /></g>;
  if (m === 4) return <g><rect x={-30} y={-24} width={60} height={12} rx={4} fill={c} /><rect x={-26} y={-12} width={9} height={42} fill={c2} /><rect x={17} y={-12} width={9} height={42} fill={c2} /></g>;
  return <g><rect x={-38} y={-30} width={76} height={60} rx={4} fill="#3a2a1e" /><rect x={-30} y={-22} width={60} height={44} fill="#8a8f98" /></g>;
};
export const P08: React.FC = () => {
  const f = useF();
  const l = loc(46.4);
  const P = SOT_PISO;
  // 3 ciclos: va a la pila, se agacha, levanta la SILLA sobre la cabeza (pose clave de 10 cuadros en 1,5 / 3,5 / 5,5 s) y la arroja
  const CEN = [45, 105, 165];
  const ruta: { f: number; x: number; y: number; curva?: "lineal" }[] = [{ f: 0, x: 1340, y: P }];
  const poses: { f: number; v: any }[] = [{ f: 0, v: "encogerse" }];
  const ARRIBA = { tronco: -4, hD: 158, cD: 14, hI: 160, cI: -14, cabeza: -6 };
  CEN.forEach((c) => {
    ruta.push({ f: c - 36, x: 1340, y: P }, { f: c - 26, x: 1490, y: P, curva: "lineal" }, { f: c - 14, x: 1490, y: P }, { f: c - 4, x: 1340, y: P, curva: "lineal" });
    poses.push({ f: c - 27, v: {} }, { f: c - 22, v: "agacharse" }, { f: c - 15, v: { tronco: 6, hD: 70, cD: 60, hI: 70, cI: 60 } }, { f: c - 5, v: { tronco: 0, hD: 120, cD: 40, hI: 120, cI: 40 } }, { f: c, v: ARRIBA }, { f: c + 10, v: ARRIBA }, { f: c + 14, v: "tirarCarga" }, { f: c + 18, v: "tirarSuelta" }, { f: c + 26, v: "encogerse" });
  });
  const gxA = (ff: number) => interpolate(ff, ruta.map((r) => r.f), ruta.map((r) => r.x), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // la silla cargada (en el mundo): al pecho mientras vuelve, SOBRE LA CABEZA en la pose clave, luego vuela
  const sillaCargada = (() => {
    for (const c of CEN) {
      if (f >= c - 15 && f < c + 14) {
        const x = gxA(f);
        const u = cl(f, c - 6, c);
        return <g transform={`translate(${x - 34 * (1 - u)},${P - 250 - 178 * u})`}><Silla s={1.25} rot={-8 * (1 - u)} /></g>;
      }
    }
    return null;
  })();
  const llega = CEN.map((c) => c + 24);
  const hechas = llega.filter((t) => f >= t).length;
  return (
    <Escena Set={Sotano} pal={PAL} setProps={{ fuego: Math.min(1, 0.6 + hechas * 0.14) }} seed={18}
      claves={[mira(0, 1200, 600, 1.3), mira(l(49.5), 1190, 590, 1.38, { curva: "inout" }), mira(l(53.5), 1180, 585, 1.45, { curva: "inout" })]}
      medio={<>
        <A look={GUS} escala={1.15} ruta={ruta} luz={{ lado: -1, color: "#ff9a3a", fuerza: 0.9 }} poses={poses} caras={[{ f: 0, v: "cansado" }, { f: 40, v: "determinado" }, { f: 70, v: "cansado" }, { f: 100, v: "determinado" }, { f: 130, v: "cansado" }, { f: 160, v: "determinado" }, { f: 190, v: "cansado" }]}
          />
        {sillaCargada}
        {/* pila de muebles junto a la pared */}
        <g transform={`translate(1600,${P - 64})`}><Silla s={0.8} rot={-12} /></g>
        <g transform={`translate(1660,${P - 40})`}><rect x={-60} y={-30} width={120} height={70} rx={6} fill="#6a4a32" stroke="#3a2214" strokeWidth={4} /></g>
        {llega.map((t, k) => {
          const u = (f - (t - 10)) / 10;
          if (u < 0 || u >= 1) return null;
          return <g key={k} transform={`translate(${1340 + (975 - 1340) * u},${P - 428 + 190 * u - 90 * Math.sin(Math.PI * u)}) rotate(${-u * 300})`}><Silla s={1.25 - 0.45 * u} /></g>;
        })}
        {llega.map((t, k) => <Chispas key={k} x={960} y={P - 235} t0={t} n={16} dur={18} />)}
        {llega.map((t, k) => <Llamarada key={k} x={960} y={P - 150} t0={t} dur={18} amp={0.4} />)}
      </>}
      detras={<g><rect x={740} y={P - 480} width={440} height={60} rx={10} fill="#2a2218" stroke="#c9a36a" strokeWidth={4} /><text x={960} y={P - 435} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={44} fill="#f0d9a0" letterSpacing={6}>COAL FURNACE</text></g>}
      hud={<SillasTachadas x={1570} y={60} tiempos={llega} desde={l(46.8)} hasta={l(53.4)} />}
    />
  );
};

// ---------- 9 · 53:5-59:2 · de noche: su farol mira al lago, no a la colina; la línea de visión choca ----------
export const P09: React.FC = () => {
  const f = useF();
  const l = loc(53.5);
  const linea = interpolate(f, [l(57.2), l(58.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tx = -370, ty = 560; // ventana de la casa de Theo
  const wx = 410, wy = 495; // ventana de Gus (fila 1, columna 1 del edificio: 370..450 × 450..540)
  const lamp = Math.sin((f / 40) * Math.PI * 2) * 8;
  const gira = l(55.9);
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "noche", luces: 0, nieve: 0.9, ventanaGus: 1, hielo: 0.6 }} seed={19}
      claves={[mira(0, 412, 500, 4.6), mira(l(56.9), 405, 500, 4.9), mira(l(58.0), 60, 540, 0.78, { curva: "inout" }), mira(l(59.2), 60, 540, 0.8)]}
      medio={<>
        {/* Gus de cintura arriba DENTRO de la ventana, mira el farol (el lago) y gira la cabeza hacia la colina */}
        <defs><clipPath id="ventGus9"><rect x={370} y={450} width={80} height={90} /></clipPath></defs>
        <g clipPath="url(#ventGus9)">
          <A look={GUS} escala={0.44} ruta={[{ f: 0, x: 396, y: 592 }]} dir={[{ f: 0, v: 1 }, { f: gira, v: -1 }]} luz={{ lado: 1, color: "#ffcf6e", fuerza: 1 }}
            poses={[{ f: 0, v: { hD: 60, cD: 70, tronco: 4 } }, ...gestos(10, gira - 4, [{ hD: 64, cD: 74, tronco: 5 }, { hD: 52, cD: 86, tronco: 2, cabeza: 4 }], 22), { f: gira, v: { hD: 20, cD: 30, tronco: -2, cabeza: -4 } }, { f: gira + 20, v: { hD: 30, cD: 40, cabeza: -6 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: gira, v: "duda" }]} miradas={[{ f: 0, v: { x: 0.7, y: 0.1 } }, { f: gira, v: { x: 0.8, y: -0.2 } }]} />
        </g>
        <g transform={`translate(${wx + 26},${wy - 22}) rotate(${lamp})`}>
          <rect x={-1.5} y={-14} width={3} height={18} fill="#1a1218" />
          <rect x={-8} y={2} width={16} height={22} rx={4} fill="#ffe9a8" stroke="#1a1218" strokeWidth={2.4} />
          <rect x={-5} y={7} width={10} height={12} rx={2} fill="#ffb84a" opacity={0.7 + 0.3 * Math.sin(f / 3)} />
        </g>
        <Halo x={wx + 26 + Math.sin((lamp * Math.PI) / 180) * 20} y={wy - 8} r={70} color="#ffcf6e" fuerza={0.6} />
        <CasaTheo x={-330} y={640} luz={0.25 + 0.2 * Math.sin(f / 15)} rotulo={false} />
        <path d={`M${wx - 40},${wy - 10} L${wx - 40 + (tx - wx + 40) * linea},${wy - 10 + (ty - wy + 10) * linea}`} stroke="#ffcf6e" strokeWidth={9} strokeDasharray="22 18" fill="none" opacity={linea > 0 ? 0.95 : 0} />
        {linea >= 1 && <g transform={`translate(${-10},${532}) scale(${0.6 + 0.4 * spring({ frame: f - l(58.3), fps: 30, config: { damping: 8, stiffness: 200 } })})`}><path d="M-34,-34 L34,34 M34,-34 L-34,34" stroke="#e23a2e" strokeWidth={16} strokeLinecap="round" /></g>}
        {/* el farol tira la luz hacia el lago (derecha) */}
        <path d={`M${wx + 40},${wy + 10} L2600,${wy - 260} L2600,${wy + 380} Z`} fill="#ffcf6e" opacity={0.1 + 0.03 * Math.sin(f / 9) + 0.04 * Math.abs(lamp) / 8} />
      </>}
      hud={<>
        <Rotulo texto="facing the lake" x={1380} y={760} centro desde={l(55.0)} hasta={l(57.4)} color="#ffcf6e" tam={64} />
        <Pastilla texto="THEO'S HOUSE" x={470} y={640} desde={l(57.6)} tam={36} />
      </>}
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
      claves={[mira(0, 490, 700, 1.3), mira(l(64.5), 470, 690, 1.35), mira(l(66.4), 490, 680, 1.5, { curva: "out" })]}
      detras={<CartelCanal />}
      medio={<>
        <Ore x={CANAL_PUNTOS.gus + 135} y={P} s={1.55} dir={1} f={f} sentado={1} cola={f > l(64.8) ? 1.8 : 0.15} cabeza={f < l(64) ? Math.sin(f / 50) * 8 : -10} />
        <A look={GUS} ruta={[{ f: 0, x: 90, y: P }, { f: l(64.6), x: 90, y: P }, { f: l(65.8), x: CANAL_PUNTOS.gus - 25, y: P }]} dir={[{ f: 0, v: 1 }]} opacidad={(ff) => ap(ff, l(64.6), 8)}
          poses={[{ f: 0, v: {} }, { f: l(65.9), v: { hD: 70, cD: 30, tronco: 18, cabeza: 12 } }]}
          ajuste={(p, ff) => (ff > l(65.9) ? { ...p, hD: p.hD + 14 * Math.sin(ff / 2.5), cD: p.cD + 12 * Math.sin(ff / 2.5) } : p)} caras={[{ f: 0, v: "feliz" }]} />
      </>}
      hud={<>
        <Cuenta x={1250} y={170} rotulo="DAY" claves={[{ f: 0, v: 1 }, { f: l(61.5), v: 2, d: 5 }, { f: l(62.5), v: 3, d: 5 }, { f: l(63.5), v: 4, d: 5 }]} desde={l(60.6)} hasta={l(64.7)} tam={150} color="#f6ecd2" />
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
  const mic = <rect x={-8} y={-18} width={16} height={34} rx={6} fill="#1d1d22" />;
  const CL: Clave[] = [mira(0, 720, 560, 1.4), mira(l(70.0), 1150, 580, 1.1, { curva: "inout" }), mira(l(74.8), 1100, 640, 1.5), mira(l(76.2), 1000, 470, 0.95, { curva: "inout" }), mira(l(77.6), 1000, 470, 0.97), mira(l(78.6), 1040, 700, 1.7, { curva: "inout" }), mira(l(82.2), 1040, 690, 2.05, { curva: "inout" }), mira(l(84.4), 1040, 690, 2.1)];
  const tr = [l(71.4), l(72.8), l(74.2)];
  return (
    <Escena Set={Techo} pal={PAL} setProps={{ onda: noches, luna: interpolate(f, [l(75), l(82.3)], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) % 1 }} seed={21}
      claves={CL}
      medio={<>
        <A look={GUS} ruta={[{ f: 0, x: 225, y: P }, { f: l(70.0), x: 1330, y: P }, { f: l(74.8), x: 1330, y: P }, { f: l(75.5), x: 1000, y: P }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: {} }, { f: l(70.3), v: { hD: 60, cD: 80, tronco: 10 } }, ...gestos(l(70.6), l(75.4), ["agarrarAlto", { hD: 150, cD: 10, cabeza: -12 }, { hD: 120, cD: 40, tronco: 4 }], 14), ...gestos(l(75.4), l(84.4), [{ hD: 105, cD: 122, cabeza: -3 }, { hD: 55, cD: 75 }], 40)]}
        enManoD={(ff) => (ff > l(75.3) ? <g transform="translate(6,-4)">{mic}</g> : null)}
        caras={[{ f: 0, v: "determinado" }, { f: l(71), v: "feliz" }]} habla={[[l(75.6), l(76.6)], [l(77.9), l(78.9)], [l(80.2), l(81.2)]]} />
        {tr.map((t, k) => { const u = Math.min(1, Math.max(0, (f - t) / 8)); return u > 0 ? <g key={k} transform={`translate(1400,${300 - 60 * k}) scale(1,${u})`}><rect x={-(10 - 2 * k)} y={-60} width={2 * (10 - 2 * k)} height={62} fill="#e8e2d2" stroke="#55525e" strokeWidth={2} /><rect x={-(13 - 2 * k)} y={-6} width={2 * (13 - 2 * k)} height={10} fill="#55525e" />{k === 2 && <circle cx={0} cy={-62} r={8} fill="#ff3a2e" />}</g> : null; })}
      </>}
      hud={<>
        {[l(75.6), l(77.9), l(80.2)].map((t, k) => <GloboEn key={k} claves={CL} X={1000} Y={P - 345} texto="CQ CQ" desde={t} hasta={t + 34} cola="abajo" tam={60} />)}
        <Pastilla texto="50 YEARS ON THE AIR" x={1240} y={130} desde={l(72.0)} hasta={l(75.4)} tam={64} color="#ffcf6e" />
        <Pastilla texto="NIGHT AFTER NIGHT" x={1240} y={130} desde={l(75.8)} hasta={l(84.3)} tam={64} />
      </>}
    />
  );
};

// ---------- 12 y 16 · inserto de la radio de Gus (DÍA 152 / DÍA 180): una mano gira la perilla, el LED parpadea ----------
export const PRadio: React.FC<{ s0: number; s1: number; dial?: number; tono?: "calido" | "frio"; pob?: [number, number]; senal?: boolean }> = ({ s0, s1, dial = 0, tono = "frio", pob, senal }) => {
  const f = useF();
  const l = loc(s0);
  const d = dial + f * 0.03;
  const ang = d * 40 - 40;
  const led = senal ? Math.floor(f / 4) % 2 === 0 : (f < 36 ? f % 12 < 6 : true); // E12: el LED parpadea 3 veces y queda prendido
  const MANGA_GUS = "#8a6b3e";
  // E12: Gus a la derecha, de perfil, se inclina hacia la radio y gira la 3ª perilla con SU brazo (hombro → perilla)
  const E12 = !senal;
  const gx = E12 ? interpolate(f, [0, l(s1)], [1590, 1545], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const EG = 2.0, GY = 1022;
  return (
    <Escena Set={Mesa} pal={PAL} setProps={{ obj: "radio", luzRadio: led ? 1 : 0.25, dial: d, tono }} seed={Math.round(s0)} mano={2}
      claves={E12 ? [mira(0, 1080, 520, 1.25), mira(l(s1), 1060, 505, 1.42)] : [mira(0, 980, 520, 1.25), mira(l(s1), 920, 500, 1.55)]}
      medio={<>
        <PantallaRadio valor={(146.52 + d).toFixed(2)} />
        {E12 && <A look={GUS} escala={EG} ruta={[{ f: 0, x: gx, y: GY }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: { tronco: 10, cabeza: 6, hD: 128, cD: 4, hI: 20, cI: 40 } }, { f: l(s1), v: { tronco: 18, cabeza: 10, hD: 132, cD: 2, hI: 26, cI: 50 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: 24, v: "duda" }]} miradas={[{ f: 0, v: { x: 0.9, y: -0.1 } }]} />}
        {E12 ? <PerillaMano x={1370} y={440} ang={ang} manga={MANGA_GUS} bx={gx - 8} by={GY - 212 * EG + 16} ms={0.75} />
          : <PerillaMano x={1130} y={440} ang={ang} manga={MANGA_GUS} />}
        {senal && <><Senal x={960} y={735} s={1.15} nivel={5 * cl(f, 4, l(s1) - 6)} /><Ondas x={720} y={300} rmax={260} periodo={48} /></>}
        {senal && <A look={GUS} escala={1.9} ruta={[{ f: 0, x: 395, y: 1150 }, { f: 12, x: 395, y: 1150 }, { f: l(s1) - 6, x: 470, y: 1150, curva: "inout" }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { tronco: 6 } }, { f: l(s1) - 6, v: { tronco: 20, cabeza: 6 } }]} caras={[{ f: 0, v: "sorpresa" }, { f: 18, v: "determinado" }, { f: l(s1) - 40, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.1 } }]} habla={[[0, 16]]} />}
      </>}
      hud={pob ? <Cuenta x={1320} y={70} rotulo="POPULATION" claves={[{ f: 0, v: pob[0] }, { f: 6, v: pob[1], d: 1 }]} desde={0} hasta={l(s1)} tam={130} /> : undefined}
    />
  );
};

// ---------- 13 · 85:8-100:8 · Hermantown: la granja en invierno, Rosa en el walkie, Marcus apila leña (3 → 5) ----------
export const P13: React.FC = () => {
  const f = useF();
  const l = loc(85.8);
  const P = GRANJA_PISO;
  const px = GRANJA_PUNTOS.porche;
  const CL: Clave[] = [mira(0, px + 230, P - 190, 2.0), mira(l(88.0), px + 235, P - 190, 2.0, { curva: "inout" }), mira(l(95), px + 250, P - 190, 2.05), mira(l(100.8), px + 290, P - 200, 1.9, { curva: "inout" })];
  const t0 = l(88.8) + 18;
  const n = Math.max(0, Math.min(14, Math.floor((f - t0) / 20) + 1));
  const SX = px + 430;
  return (
    <Escena Set={Granja} pal={PAL} setProps={{ hora: "invierno", estacion: "invierno", humo: 1 }} seed={23}
      claves={CL}
      medio={<>
        <A look={ROSA} ruta={[{ f: 0, x: px, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 30, cD: 130, cabeza: -6 } }, ...gestos(l(87), l(93), [{ hD: 30, cD: 130, cabeza: -6 }, { hD: 52, cD: 108, cabeza: -2 }, { hD: 38, cD: 122, cabeza: -8 }], 20), ...gestos(l(93), l(100.8), [{ hD: 100, cD: 0 }, "manosCintura", { hD: 70, cD: 50 }], 30)]}
          caras={[{ f: 0, v: "sorpresa" }, { f: l(87.5), v: "feliz" }]} habla={[[l(86.2), l(90.5)], [l(93), l(98)]]}
          enManoD={(ff) => (ff < l(93) ? <Walkie s={0.8} luz={Math.floor(ff / 6) % 2 === 0} /> : null)} />
        <A look={MARCUS} ruta={[{ f: 0, x: 1100, y: P }, { f: l(88.6), x: px + 230, y: P }]} seed={5}
          poses={[{ f: 0, v: { hD: 60, cD: 80, hI: 60, cI: 80 } }, { f: l(88.7), v: "parado" }, ...gestos(l(88.8), l(97.6), ["agacharse", "tirarSuelta"], 10), { f: l(97.8), v: "manosCintura" }]}
          caras={[{ f: 0, v: "neutral" }, { f: l(92), v: "feliz" }]}
          enManoD={(ff) => (ff < l(88.6) ? <g>{[0, 1, 2].map((k) => <rect key={k} x={-60} y={-14 - k * 22} width={120} height={20} rx={8} fill="#6a4a32" />)}</g> : null)} />
        {Array.from({ length: n }).map((_, m) => <rect key={m} x={SX - 60 + (m % 2) * 66 + (m % 3) * 3} y={P - 24 - Math.floor(m / 2) * 22} width={120} height={20} rx={8} fill={m % 2 ? "#6a4a32" : "#7a5a3c"} />)}
      </>}
      hud={<>
        <Sello claves={CL} X={px} Y={P - 296} numero="45" rotulo="ROSA · BAKER" desde={l(91.6)} hasta={l(95)} tam={84} xMin={300} xMax={1500} />
        <Sello claves={CL} X={px + 230} Y={P - 296} numero="52" rotulo="MARCUS · FARMER" desde={l(90.0)} hasta={l(95)} tam={84} xMin={300} xMax={1500} />
        <Cuenta fondo x={1560} y={140} rotulo="POPULATION" claves={[{ f: 0, v: 3 }, { f: l(100.0), v: 5, d: 1 }]} desde={l(97.6)} hasta={l(100.75)} tam={120} />
      </>}
    />
  );
};

// ---------- 14 · 100:8-116:3 · UMD: Dev en la caja de la pickup gira el dial del CB; el dormitorio con 1 ventana; llora (5 → 6) ----------
export const P14: React.FC = () => {
  const f = useF();
  const l = loc(100.8);
  const P = BARRIO_PISO;
  const llora = f > l(113.3);
  const vib = Math.sin(f * 1.9) * (f > l(104) ? 6 : 2);
  const dialAng = f > l(104) ? -30 * Math.cos((Math.PI * (f - l(104))) / 15) : 0;
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "invierno", luces: 0, nieve: 0.8, ventanaCasa: 0 }} seed={24}
      claves={[mira(0, 1480, 610, 1.1), mira(l(103.5), 1460, 640, 1.3, { curva: "inout" }), mira(l(108.0), 1460, 640, 1.35), mira(l(108.5), 1900, 570, 1.3, { curva: "inout" }), mira(l(109.7), 1910, 570, 1.32), mira(l(110.3), 1490, 600, 1.9, { curva: "inout" }), mira(l(113.0), 1490, 600, 1.95), mira(l(113.4), 1500, 600, 2.1, { curva: "out" }), mira(l(116.3), 1500, 600, 2.2)]}
      detras={<g>
        <Edificio x={2150} y={P} w={900} h={760} color="#4a3a48" luces={0} seed="umd" techoNieve={1} />
        <rect x={2150 + 12 + 46 * 6} y={P - 760 + 30 + 62 * 4} width={24} height={32} fill="#ffcf6e" opacity={ap(f, l(108.5), 8)} />
        <rect x={2350} y={P - 820} width={500} height={70} fill="#2a2430" /><text x={2600} y={P - 770} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={44} fill="#f6ecd2" letterSpacing={4}>UMD · RESIDENCE HALL</text>
      </g>}
      medio={<>
        <Auto x={1450} y={P} color="#6a2f36" tipo="pickup" s={2.2} dir={-1} nieve={0.7} />
        <A look={DEV} ruta={[{ f: 0, x: 1560, y: P - 120 }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 0 }]} luz={BORDE_FRIO}
          poses={[{ f: 0, v: { ...{ tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92 }, hD: 30, cD: 130, cabeza: 8 } }, ...gestos(l(104), l(113), [{ tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 62, cD: 70, cabeza: 8 }, { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hD: 78, cD: 40, cabeza: 4 }, { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 130, cabeza: 8 }], 15)]}
          caras={[{ f: 0, v: "cansado" }, { f: l(106), v: "sorpresa" }, { f: l(113.3), v: "triste" }, { f: l(114.4), v: "risa" }, { f: l(115.0), v: "triste" }]} habla={[[l(106.2), l(116.3)]]}
          ajuste={(p, ff) => (llora ? { ...p, tronco: p.tronco + 2.5 * Math.sin(ff * 1.1) } : p)} />
        {/* el CB: caja con dial y luz, antena que vibra */}
        <g transform="translate(1465,60)">
          <rect x={-50} y={P - 330} width={100} height={60} rx={8} fill="#1d1d22" stroke="#3a3a42" strokeWidth={3} />
          <rect x={-40} y={P - 322} width={42} height={20} rx={3} fill={f > l(106) ? "#7cff9a" : "#2a4a30"} opacity={0.8} />
          <g transform={`translate(26,${P - 300}) rotate(${dialAng})`}><circle r={16} fill="#55555e" /><rect x={-2} y={-14} width={4} height={12} fill="#f6ecd2" /></g>
        </g>
        <path d={`M1592,${P - 300} Q${1592 + vib * 0.6},${P - 520} ${1592 + vib},${P - 740}`} stroke="#c9c4b8" strokeWidth={5} fill="none" strokeLinecap="round" />
        <circle cx={1592 + vib} cy={P - 740} r={8} fill="#ff3a2e" />
        {f > l(106.2) && <g><circle cx={1330} cy={P - 330} r={10} fill="#ff3a2e" opacity={Math.floor(f / 5) % 2 ? 1 : 0.4} /><Halo x={1330} y={P - 330} r={60} color="#ff3a2e" fuerza={0.6} /></g>}
        {f > l(106.2) && <Ondas x={1592 + vib} y={P - 740} desde={l(106.2)} rmax={170} n={3} color="#ff9a6a" periodo={42} fuerza={0.6} />}
        {/* caja de la PICKUP: barandas de la caja delante de las piernas de Dev */}
        <g>
          <rect x={1494} y={P - 152} width={250} height={86} rx={6} fill="#6a2f36" stroke="#3a161c" strokeWidth={5} />
          <rect x={1494} y={P - 160} width={250} height={14} rx={5} fill="#8a4048" />
          <rect x={1730} y={P - 150} width={18} height={80} rx={4} fill="#4a1e24" />
          <rect x={1520} y={P - 126} width={60} height={10} rx={4} fill="#4a1e24" />
        </g>
        <Lagrimas x={1522} y={P - 392} ancho={20} desde={l(113.3)} s={1.3} />
      </>}
      hud={<>
        <EtiquetaFlotante x={1000} y={230} rotulo="DEV · AGE" claves={20} desde={l(103.4)} hasta={l(107)} color="#ffcf6e" tam={78} />
        <Cuenta fondo x={1500} y={110} rotulo="POPULATION" claves={[{ f: 0, v: 5 }, { f: l(115.6), v: 6, d: 1 }]} desde={l(114.0)} hasta={l(116.25)} tam={110} />
      </>}
    />
  );
};

// ---------- 15 · 116:3-126:0 · Priya llega a pie a Canal Park, acelera al oír los ladridos de Ore ----------
export const P15: React.FC = () => {
  const f = useF();
  const l = loc(116.3);
  const P = CANAL_PISO;
  const oreX = interpolate(f, [l(123.4), l(124.6)], [CANAL_PUNTOS.gus + 80, 1180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const oreAt = (t: number) => interpolate(t, [l(123.4), l(124.6)], [CANAL_PUNTOS.gus + 80, 1180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const priya = (ff: number) => interpolate(ff, [0, l(119.3), l(121.8), l(123.2), l(124.6)], [3000, 2650, 2250, 1850, 1380], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const CL: Clave[] = [mira(0, 2850, 660, 1.0), mira(l(119.3), 2680, 660, 1.0), mira(l(121.8), 2300, 660, 1.1, { curva: "inout" }), mira(l(123.2), 1900, 670, 1.2, { curva: "inout" }), mira(l(124.8), 1300, 690, 1.45, { curva: "out" }), mira(l(126), 1290, 700, 1.5)];
  const ladridos = [l(123.3), l(123.9), l(124.5)];
  return (
    <Escena Set={CanalPark} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.5, ventanaGus: 0.1, hielo: 0.2 }} seed={25}
      claves={CL}
      medio={<>
        <A look={PRIYA} escala={1.5} ruta={[{ f: 0, x: 3000, y: P }, { f: l(119.3), x: 2650, y: P, curva: "lineal" }, { f: l(121.8), x: 2250, y: P, curva: "lineal" }, { f: l(123.2), x: 1850, y: P, curva: "lineal" }, { f: l(124.6), x: 1380, y: P, curva: "lineal" }]}
          caras={[{ f: 0, v: "cansado" }, { f: l(119.4), v: "sorpresa" }, { f: l(120.4), v: "duda" }, { f: l(122.0), v: "feliz" }, { f: l(124.8), v: "risa" }]}
          giros={[{ f: 0, v: 0 }, { f: l(119.3), v: -0.9 }, { f: l(120.2), v: 0.2 }, { f: l(120.8), v: -0.9 }, { f: l(121.6), v: 0.2 }, { f: l(122.3), v: -0.9 }]}
          poses={[{ f: 0, v: {} }, { f: l(124.7), v: "agacharse" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0 } }, { f: l(124.7), v: { x: -0.6, y: 0.6 } }]} />
        <Ore x={oreX} y={P} s={1.1} dir={1} f={f} paso={oreX} sentado={f < l(123.4) ? 1 : 0} ladra={f > l(123.2) && f < l(125.2) ? 1 : 0} cola={1.4} />
        {ladridos.map((t, i) => <Onoma key={i} texto="WOOF!" x={oreAt(t) + 120} y={P - 260} tiempos={[t]} tam={92} color="#ffcf6e" rot={-8 + i * 6} />)}
      </>}
      hud={<>
        <Sello claves={CL} X={priya(f)} Y={P - 440} numero="38" rotulo="PRIYA · TEACHER" desde={l(117.6)} hasta={l(122)} tam={88} xMin={300} xMax={1620} />
        <CapaHud><Onoma texto="WOOF!" x={300} y={520} tiempos={[l(119.3), l(120.8), l(122.3)]} dur={26} tam={110} color="#ffcf6e" rot={-8} /></CapaHud>
      </>}
    />
  );
};

// ---------- 17 · 129:8-137:6 · el porche de Nan con los mellizos (seña, saltos, edades al doble) ----------
export const P17: React.FC = () => {
  const l = loc(129.8);
  const P = BARRIO_PISO;
  const X = BARRIO_PUNTOS.casa;
  const CL: Clave[] = [mira(0, X, P - 190, 1.7), mira(l(132.5), X, P - 190, 1.8, { curva: "inout" }), mira(l(137.6), X + 40, P - 190, 1.9)];
  const sB = [l(132.6), l(133.4), l(134.2), l(135.0), l(135.8)], sL = [l(132.9), l(133.7), l(134.5), l(135.3), l(136.1)];
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, humo: 0.5 }} seed={27}
      claves={CL}
      medio={<>
        <A look={NAN} ruta={[{ f: 0, x: X, y: P }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: {} }, ...gestos(l(130.6), l(132.3), [{ hD: 150, cD: 150, cabeza: -4 }, { hD: 130, cD: 100 }], 12), ...gestos(l(132.4), l(137.6), [{ hD: 160, cD: 25 }, { hD: 95, cD: 0 }, { hD: 50, cD: 70 }], 16)]}
          caras={[{ f: 0, v: "feliz" }]} habla={[[l(130), l(134)]]} />
        <A look={BEN} escala={NINO} ruta={saltoRuta(X - 190, P, sB)} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCintura" }, ...gestos(l(133.8), l(137.5), ["manosCintura", { hD: 40, cD: 80 }], 20)]} ajuste={saltoPose(sB)} caras={[{ f: 0, v: "picaro" }, { f: l(132.6), v: "feliz" }]} seed={8} />
        <A look={LILY} escala={NINO} ruta={saltoRuta(X + 190, P, sL)} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "saludar" }, ...gestos(l(131), l(134), ["saludar", { hD: 130, cD: 40 }], 9), { f: l(134.1), v: {} }]} ajuste={saltoPose(sL)} caras={[{ f: 0, v: "feliz" }]} seed={9} />
      </>}
      hud={<>
        <Sello claves={CL} X={X} Y={P - 345} numero="80" rotulo="NAN · LIBRARIAN" desde={l(130.6)} hasta={l(134)} tam={88} xMin={300} xMax={1620} />
        <Sello claves={CL} X={X - 190} Y={P - 262} numero="12" rotulo="BEN & LILY" desde={l(133.8)} hasta={l(137.6) - 7} tam={72} fijo={{ x: 1690, y: 310 }} />
      </>}
    />
  );
};

// KNOCK! blanco OPACO con contorno negro de 6 px: uno por golpe (escala 1.3→1 en 6 cuadros), queda entero hasta el golpe siguiente
const Knock: React.FC<{ tiempos: number[]; x: number; y: number }> = ({ tiempos, x, y }) => {
  const f = useF();
  const i = tiempos.findIndex((t, k) => f >= t && f < (tiempos[k + 1] ?? t + 18));
  if (i < 0) return null;
  const u = f - tiempos[i];
  const s = interpolate(u, [0, 6], [1.3, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x + ((i % 2) * 2 - 1) * 40, top: y, transform: `translate(-50%,-50%) rotate(${i % 2 ? 4 : -4}deg) scale(${s})`, fontFamily: F_HUD, fontWeight: 600, fontSize: 80, letterSpacing: 3, color: "#ffffff", opacity: 1,
      WebkitTextStroke: "12px #000", paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: "0 6px 0 #000" }}>KNOCK!</div>
  );
};

// ---------- 18 · 137:6-141:4 · flashback DÍA 1, madrugada: los mellizos en pijama golpean su puerta ----------
export const P18: React.FC = () => {
  const f = useF();
  const l = loc(137.6);
  const P = BARRIO_PISO;
  const X = BARRIO_PUNTOS.casa;
  const golpes = [l(138.4), l(139.0), l(139.6), l(140.2)];
  const PIJ_B = { ...BEN, camisa: "#9ab8e8", pantalon: "#9ab8e8" };
  const PIJ_L = { ...LILY, camisa: "#f0b8c8", pantalon: "#f0b8c8" };
  const tiritar = (a: number) => (p: any, f: number) => ({ ...p, tronco: p.tronco + a * Math.sin(f * 2.9), cabeza: p.cabeza + a * 0.8 * Math.sin(f * 2.9 + 1) });
  const abre = cl(f, golpes[3] + 8, golpes[3] + 20); // en el último golpe la puerta se abre y asoma la mano de Nan
  const sh = golpes.reduce((a, t) => a + (f >= t && f < t + 10 ? Math.sin((f - t) * 2.6) * 3 * (1 - (f - t) / 10) : 0), 0);
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "alba", luces: 0, nieve: 0, humo: 0 }} seed={28}
      claves={[mira(0, X - 110, P - 190, 1.7), mira(l(141.4), X - 90, P - 190, 1.95)]}
      medio={<>
        <g>
          <rect x={X - 30} y={P - 130} width={60} height={130} fill="#120a0c" />
          {abre > 0 && <Mano x={X - 30 + 4 * abre} y={P - 96} bx={X + 24} by={P - 92} manga="#7a4a8a" s={0.5} pinza={0.3} opacidad={abre} />}
          <g transform={`translate(${X + 30 + sh},0) scale(${1 - 0.42 * abre},1) translate(${-X - 30},0)`}>
            <rect x={X - 30} y={P - 130} width={60} height={130} fill="#4a2018" stroke="#2a1410" strokeWidth={4} />
            <rect x={X - 20} y={P - 118} width={40} height={50} fill="#5a2a20" />
            <circle cx={X - 18} cy={P - 62} r={5} fill="#d8b46a" />
          </g>
        </g>
        <A look={PIJ_B} escala={NINO} ruta={[{ f: 0, x: X - 58, y: P }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} poses={[{ f: 0, v: { hD: 60, cD: 80 } }, ...golpes.flatMap((t) => [{ f: t - 4, v: { hD: 100, cD: 70, tronco: -2 } }, { f: t, v: { hD: 112, cD: 4, tronco: 6 } }, { f: t + 5, v: { hD: 90, cD: 60 } }]), { f: golpes[3] + 10, v: { hD: 30, cD: 30, tronco: -4 } }]} ajuste={tiritar(1.6)} caras={[{ f: 0, v: "miedo" }, { f: golpes[3] + 12, v: "sorpresa" }]} />
        <A look={PIJ_L} escala={NINO} ruta={[{ f: 0, x: X - 150, y: P }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} poses={[{ f: 0, v: { hI: 25, cI: 100, hD: 30, cD: 95, cabeza: 5, tronco: 5, bajar: 4 } }, ...gestos(l(139.0), l(141.4), [{ hI: 14, cI: 112, hD: 20, cD: 106, cabeza: 7, tronco: 7, bajar: 6 }, { hI: 30, cI: 96, hD: 34, cD: 92, cabeza: 4, tronco: 4, bajar: 4 }], 7)]} ajuste={tiritar(1.3)} caras={[{ f: 0, v: "triste" }, { f: golpes[3] + 12, v: "sorpresa" }]} seed={9} />
      </>}
      hud={<>
        <Knock tiempos={golpes} x={1100} y={360} />
        <Pop cx={1600} cy={210} desde={l(137.9)}><Rotulo texto="DAY 1" x={1600} y={150} centro desde={0} color="#f6ecd2" tam={110} rot={-3} brillo={false} /></Pop>
      </>}
    />
  );
};

// ---------- 19 · 141:4-144:3 · Nan les da la mano a los dos. «Ten.» (7 → 9 → 10) ----------
export const P19: React.FC = () => {
  const l = loc(141.4);
  const P = BARRIO_PISO;
  const X = BARRIO_PUNTOS.casa;
  const sac = (f: number) => Math.sin(f * 1.5);
  return (
    <Escena Set={Barrio} pal={PAL} setProps={{ hora: "dia", luces: 0, nieve: 0.3, humo: 0.5 }} seed={29}
      claves={[mira(0, X, P - 190, 2.0), mira(l(142.2), X, P - 170, 2.45, { curva: "inout" }), mira(l(144.3), X, P - 170, 2.55)]}
      medio={<>
        <A look={NAN} ruta={[{ f: 0, x: X, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hI: -40, cI: -10, hD: 40, cD: 10 } }, { f: l(141.6), v: { hD: 52, cD: 4, hI: 10, cI: 30, tronco: 4 } }, { f: l(142.7), v: { hD: 40, cD: 10, hI: 10, cI: 30 } }, { f: l(142.9), v: { hI: -52, cI: 4, hD: 30, cD: 20, tronco: -4 } }, { f: l(143.9), v: { hI: -40, cI: -10, hD: 40, cD: 10 } }]}
          ajuste={(p, f) => (f > l(141.7) && f < l(142.6) ? { ...p, hD: p.hD + 9 * sac(f) } : f > l(143.0) && f < l(143.8) ? { ...p, hI: p.hI + 9 * sac(f) } : p)}
          caras={[{ f: 0, v: "feliz" }]} habla={[[l(142.8), l(144)]]} />
        <A look={BEN} escala={NINO} ruta={[{ f: 0, x: X - 140, y: P }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 40, cD: 10 } }, { f: l(142.9), v: { hD: 128, cD: 4 } }, { f: l(143.9), v: { hD: 40, cD: 10 } }]}
          ajuste={(p, f) => (f > l(143.0) && f < l(143.8) ? { ...p, hD: p.hD + 9 * sac(f) } : p)} caras={[{ f: 0, v: "feliz" }]} seed={8} />
        <A look={LILY} escala={NINO} ruta={[{ f: 0, x: X + 140, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 40, cD: 10 } }, { f: l(141.6), v: { hD: 128, cD: 4 } }, { f: l(142.7), v: { hD: 40, cD: 10 } }]}
          ajuste={(p, f) => (f > l(141.7) && f < l(142.6) ? { ...p, hD: p.hD - 9 * sac(f) } : p)} caras={[{ f: 0, v: "feliz" }]} seed={9} />
      </>}
      hud={<>
        <Globo texto="Ten." x={1130} y={250} desde={l(142.5)} hasta={l(144.3)} cola="izq" tam={66} />
        <Cuenta x={1560} y={120} rotulo="POPULATION" claves={[{ f: 0, v: 7 }, { f: l(142.3), v: 9, d: 3 }, { f: l(143.8), v: 10, d: 3 }]} desde={l(141.5)} hasta={l(144.25)} tam={100} />
      </>}
    />
  );
};

// ---------- 20 · 144:3-148:0 · el cuaderno rojo: June escribe «10» y lo subraya dos veces (mano con lápiz) ----------
export const PCuaderno: React.FC<{ s0: number; s1: number; escritos: { t: string; g: number; x: number; y: number; tam?: number; sub?: number[]; color?: string; vel?: number }[]; mano?: boolean }> = ({ s0, s1, escritos, mano }) => {
  const f = useF();
  const l = loc(s0);
  // punta del lápiz (mundo) en el cuaderno de la escena 20
  const ts = [l(144.3), l(144.5), l(145.4), l(145.55), l(146.5), l(146.58), l(146.75), l(146.85), l(147.3), l(147.45), l(147.65)];
  const px = interpolate(f, ts, [1150, 560, 870, 1060, 1240, 1054, 1254, 1054, 1054, 1254, 1250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const py = interpolate(f, ts, [900, 322, 322, 520, 520, 534, 536, 548, 548, 550, 940], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + (f > l(144.5) && f < l(145.4) ? Math.sin(f * 1.6) * 10 : f > l(145.55) && f < l(146.5) ? Math.sin(f * 1.1) * 55 : 0);
  return (
    <Escena Set={Mesa} pal={PAL} setProps={{ obj: "cuaderno", escritos: escritos.map((e) => ({ t: e.t, desde: l(e.g), x: e.x, y: e.y, tam: e.tam, color: e.color, vel: e.vel, sub: (e.sub ?? []).map(l) })) }} seed={Math.round(s0)} mano={1.5}
      claves={[mira(0, 980, 540, 1.15, { rot: -1.2 }), mira(l(s1), 1040, 520, 1.35, { rot: 1.0 })]}
      medio={mano ? <Mano x={px} y={py} bx={px + 760} by={py + 560} manga="#2f9aa0" lapiz opacidad={cl(f, 0, 6)} rot={-4} /> : undefined} />
  );
};

// ---------- 21 · 148:0-152:2 · los 10 en el centro de visitantes, el puente detrás (dolly out); giran la cabeza en cascada ----------
const ENFILA = (x0: number, paso: number) => [GUS, THEO_INV, JUNE_INV, MARCUS, ROSA, DEV, PRIYA, NAN, BEN, LILY].map((look, i) => ({ look, x: x0 + i * paso, nino: i >= 8 }));
export const P21: React.FC = () => {
  const f = useF();
  const l = loc(148.0);
  const P = VIS_PISO;
  return (
    <Escena Set={Visitantes} pal={PAL} setProps={{ hora: "dia" }} seed={31}
      claves={[mira(0, 1700, 640, 1.7), mira(l(152.2), 1690, 580, 0.82, { curva: "inout" })]}
      detras={<TapaVitrina />}
      medio={<>
        {ENFILA(1180, 115).map((p, i) => {
          const giros: { f: number; v: number }[] = [{ f: 0, v: 0 }];
          for (let c = 0; c < 4; c++) { const t = 6 + i * 8 + c * 90; giros.push({ f: t, v: 0.9 }, { f: t + 45, v: 0 }); }
          return <A key={i} look={p.look} escala={p.nino ? NINO : 1} seed={40 + i} ruta={[{ f: 0, x: p.x, y: P }]} dir={[{ f: 0, v: i % 2 ? -1 : 1 }]}
            poses={[{ f: 0, v: {} }, ...gestos(10 + i * 8, l(152.2), [{ tronco: 2, hD: 8, cD: 10 }, {}, { tronco: -2, hI: -8, cI: 12 }, {}], 28)]}
            giros={giros} caras={[{ f: 0, v: i % 3 ? "feliz" : "neutral" }]} />;
        })}
        <Ore x={interpolate(f, [l(149.0), l(151.4)], [2400, 1560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={P} s={0.95} dir={-1} f={f} paso={interpolate(f, [l(149.0), l(151.4)], [0, 840], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} echado={f < l(149.0) ? 1 : 0} cola={1.5} />
      </>}
    />
  );
};

// ---------- 22 · 152:2-165:8 · la pizarra: Gus escribe los 6 sistemas letra a letra; salen a mirarlos ----------
const FILAS22 = [["WATER", 159.0], ["POWER", 159.9], ["SEWER", 160.8], ["HEAT", 161.6], ["ROADS", 162.4], ["FOOD", 163.1]] as const;
const RenglonPiz: React.FC<{ t: string; x: number; y: number; desde: number; dur: number; tam?: number; color?: string; num?: string }> = ({ t, x, y, desde, dur, tam = 48, color = "#1d2a6a", num }) => {
  const f = useF();
  const pr = cl(f, desde, desde + dur);
  if (pr <= 0) return null;
  const id = `rp${Math.round(x)}${Math.round(y)}`;
  return (
    <g>
      {num && <text x={x - 56} y={y} fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill="#c0352c" opacity={cl(f, desde - 4, desde + 4)}>{num}</text>}
      <defs><clipPath id={id}><rect x={x - 6} y={y - tam} width={(t.length * tam * 0.62 + 20) * pr} height={tam * 1.5} /></clipPath></defs>
      <text x={x} y={y} clipPath={`url(#${id})`} fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={color}>{t}</text>
    </g>
  );
};
export const P22: React.FC = () => {
  const f = useF();
  const l = loc(152.2);
  const P = VIS_PISO;
  const GX = 760;
  const rowY = (i: number) => 392 + i * 50;
  const ruta = [{ f: 0, x: 880, y: P }, { f: l(154.2), x: 880, y: P }, { f: l(155.4), x: GX, y: P }, { f: l(165.8), x: GX, y: P }];
  const posesG: { f: number; v: any }[] = [{ f: 0, v: "hablar" }, ...gestos(l(152.6), l(154.1), ["hablar", "manosCintura", { hD: 100, cD: 0 }], 22), { f: l(155.6), v: { hD: 125, cD: 10 } }];
  FILAS22.forEach(([, g], i) => posesG.push({ f: l(g), v: { hD: 142 - i * 9, cD: 8 } }, { f: l(g) + 9, v: { hD: 128 - i * 9, cD: 14 } }, { f: l(g) + 17, v: { hD: 142 - i * 9, cD: 8 } }));
  posesG.push(...gestos(l(163.5), l(165.8), [{ hD: 142, cD: 8, tronco: 2 }, { hD: 124, cD: 10 }, { hD: 108, cD: 8 }, { hD: 94, cD: 6 }, { hD: 84, cD: 6 }, { hD: 74, cD: 8 }], 13));
  return (
    <Escena Set={Visitantes} pal={PAL} seed={32}
      setProps={{ hora: "dia", pizarra: [], tachas: [] }}
      claves={[mira(0, 900, 620, 1.1), mira(l(155.4), 600, 520, 1.45, { curva: "inout" }), mira(l(162.9), 900, 520, 1.15, { curva: "inout" }), mira(l(165.8), 910, 530, 1.12)]}
      detras={<><TapaVitrina /><TapaPared x0={1290} y0={12} x1={2110} y1={92} id="tapacartel22" /></>}
      medio={<>
        <RenglonPiz t="DULUTH" x={440} y={336} desde={l(156.6)} dur={22} tam={56} color="#c0352c" />
        {FILAS22.map(([t, g], i) => <RenglonPiz key={t} t={t} x={500} y={rowY(i)} desde={l(g)} dur={16} num={`${i + 1}.`} />)}
        <A look={GUS} escala={1.3} ruta={ruta} dir={[{ f: 0, v: -1 }]}
          poses={posesG} caras={[{ f: 0, v: "determinado" }, { f: l(163.5), v: "feliz" }]} habla={[[l(152.4), l(156)]]} enManoD={<rect x={-6} y={-30} width={12} height={36} rx={4} fill="#2a2a6a" />} />
        <g><rect x={940} y={P - 112} width={720} height={18} rx={6} fill="#6a4a32" />{[960, 1290, 1630].map((x) => <rect key={x} x={x} y={P - 94} width={14} height={94} fill="#4a2e1e" />)}</g>
        {ENFILA(1000, 76).slice(1).map((p, i) => <A key={i} look={p.look} escala={p.nino ? NINO : 1} seed={50 + i} asiento={[{ f: 0, v: 104 }]}
          ruta={[{ f: 0, x: 1000 + i * 76, y: P }]} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: SEN }, ...gestos(l(156), l(165.8), [{ ...SEN, tronco: 0, hD: 38, cD: 80 }, SEN, { ...SEN, tronco: -8, cabeza: 5 }], 34 + i * 3)]} caras={[{ f: 0, v: "neutral" }, { f: l(157 + i * 0.3), v: i % 2 ? "sorpresa" : "duda" }]} giros={[{ f: 0, v: 0 }, { f: l(157 + i * 0.3), v: 0.8 }]} />)}
      </>}
    />
  );
};
