// SET pintado: la calle de Londres hecha con ilustraciones 2D (agnes 2K, fondo magenta recortado → webp con alfa)
// en capas de profundidad. Lo que se mueve o se agarra sigue en código (sobre/frente de la escena).
//   lejos (z .25): panorama de techos y la aguja de San Pablo · tras (z .6): fila de casas de atrás, más chicas
//   medio (z 1): suelo + fila de casas + puestos · frente (z 1.4): heno, carreta, barriles que pasan por delante
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { Halo } from "../../anikit/luz";
import { Carro, MURALLA_M, PISO, PUERTO_M, TABERNA_M } from "./londres";

const lento = (f: number, hz: number, fase = 0) => Math.sin((f / 30) * hz * 2 * Math.PI + fase); // ≤2 Hz siempre
type Capa = "lejos" | "tras" | "medio" | "frente";
const DIR = "blanco/fondos/";
// tamaño en px de cada webp (para escalar por alto sin medir en runtime)
const TAM: Record<string, [number, number]> = {
  barriles: [1419, 1202], cajas: [1500, 1326], carreta: [1500, 873], heno: [1500, 969], poste: [710, 1500], pozo: [1151, 1500], puesto: [1272, 1500],
  casa_a: [913, 1500], casa_b: [1089, 1500], casa_c: [1119, 1500], casa_d: [1272, 1500], casa_e: [1022, 1500], casa_f: [1136, 1500], casa_g: [653, 1500],
  lejos: [2624, 1472], suelo: [2624, 1031],
  arbol: [1260, 1423], barco: [1422, 1462], barra: [1700, 721], cama: [1700, 637], casa_posada: [1259, 1700], fogon: [1062, 1700], mesa: [1700, 727],
  muelle: [1700, 494], muralla: [1700, 478], puente: [1700, 726], puerta_aldgate: [1317, 1700],
  pared_taberna: [2624, 1472], pared_posada: [2624, 1472], puerto_lejos: [2624, 1472], campo_dia: [2624, 1472], campo_tarde: [2624, 1472],
  pasto: [2624, 1472], agua: [2624, 890],
};
// dónde está la puerta en cada casa (fracción del ancho y del alto): ahí va la cruz roja de la peste
const PUERTA: Record<string, [number, number]> = { casa_a: [0.47, 0.86], casa_b: [0.5, 0.84], casa_d: [0.6, 0.84], casa_posada: [0.46, 0.87] };

// <image> de SVG no lo espera Remotion: se bloquea el cuadro hasta que la imagen está decodificada
export const Pieza: React.FC<{ n: string; cx: number; base: number; alto: number; espejo?: boolean; tinte?: number; cruz?: boolean; ancho?: number }> = ({ n, cx, base, alto, espejo, tinte = 0, cruz, ancho: anchoFijo }) => {
  const src = staticFile(DIR + n + ".webp");
  const [h] = useState(() => delayRender("pieza " + n));
  useEffect(() => {
    const im = new Image();
    im.src = src;
    im.decode().then(() => continueRender(h), () => continueRender(h));
  }, [src, h]);
  const [w0, h0] = TAM[n];
  const ancho = anchoFijo ?? (alto * w0) / h0, x = cx - ancho / 2, y = base - alto;
  const pu = cruz ? PUERTA[n] : undefined;
  return (
    <g transform={espejo ? `translate(${2 * cx} 0) scale(-1 1)` : undefined}>
      <image href={src} x={x} y={y} width={ancho} height={alto} preserveAspectRatio="none" />
      {tinte > 0 && <image href={src} x={x} y={y} width={ancho} height={alto} preserveAspectRatio="none" opacity={tinte} style={{ filter: "brightness(0.55) sepia(0.4) hue-rotate(-20deg) saturate(1.3)" }} />}
      {pu && <g transform={`translate(${x + ancho * pu[0]} ${y + alto * pu[1]})`} stroke="#c0281e" strokeWidth={alto * 0.016} strokeLinecap="round">
        <path d={`M${-alto * 0.05} ${-alto * 0.06} L${alto * 0.05} ${alto * 0.06} M${alto * 0.05} ${-alto * 0.06} L${-alto * 0.05} ${alto * 0.06}`} />
      </g>}
    </g>
  );
};

const ACERA = PISO - 40; // donde apoyan las casas: un poco detrás de la línea de los pies

// [nombre, centro x, alto, espejo] · los hitos calzan con CALLE_M: trapero 900, panadería 2050, fuente 2650, taberna 3500, posada 4300, río 5600
const CASAS: [string, number, number, boolean?][] = [
  ["casa_g", -560, 900], ["casa_e", -110, 800], ["casa_b", 420, 760], ["casa_c", 920, 760], ["casa_a", 1420, 820],
  ["casa_f", 1960, 720], ["casa_g", 2560, 900, true], ["casa_b", 3000, 760, true], ["casa_d", 3500, 700], ["casa_e", 3950, 800, true],
  ["casa_posada", 4380, 820], ["casa_a", 4950, 820, true],
];
const TRAS: [string, number, number, boolean?][] = [
  ["casa_c", -300, 760, true], ["casa_a", 300, 820, true], ["casa_f", 860, 720, true], ["casa_g", 1380, 900], ["casa_b", 1920, 760],
  ["casa_d", 2500, 700], ["casa_e", 3060, 800], ["casa_a", 3600, 820], ["casa_c", 4150, 760], ["casa_posada", 4700, 820, true], ["casa_b", 5250, 760],
];

export const CallePintada: React.FC<{ capa: Capa; f: number; variante?: string; sinPuestos?: boolean }> = ({ capa, f, variante, sinPuestos }) => {
  const peste = variante === "peste";
  if (capa === "lejos") {
    const w = (1900 * TAM.lejos[0]) / TAM.lejos[1];
    // bruma: lo lejano se aclara y se aquieta para que no compita con la calle
    return <g>{[-1, 0, 1, 2].map((k) => <Pieza key={k} n="lejos" cx={960 + k * w} base={1330} alto={1900} espejo={k % 2 !== 0} />)}<rect x={-4000} y={-3000} width={14000} height={7000} fill="#f6e2cc" opacity={0.42} /></g>;
  }
  if (capa === "tras") return null; // 28-oct «fondos muy sobrecargados»: sin segunda fila de casas
  if (capa === "frente") {
    return (
      <g>
        <Pieza n="heno" cx={-260} base={PISO + 420} alto={330} />
        <Pieza n="carreta" cx={4300} base={PISO + 430} alto={340} espejo />
      </g>
    );
  }
  // medio: suelo (tiras en espejo) + casas + puestos + el Támesis al final
  const sw = 2700, sh = (sw * TAM.suelo[1]) / TAM.suelo[0];
  const aw = 3000, ah = (aw * TAM.agua[1]) / TAM.agua[0];
  return (
    <g>
      {[-1, 0, 1, 2].map((k) => <Pieza key={k} n="suelo" cx={-600 + sw / 2 + k * sw} base={ACERA - 30 + sh} alto={sh} espejo={k % 2 !== 0} />)}
      {CASAS.map(([n, cx, a, e], i) => <Pieza key={i} n={n} cx={cx} base={ACERA} alto={a} espejo={e} cruz={peste} tinte={peste ? 0.18 : 0} />)}
      {/* bruma sobre las fachadas (debajo de los personajes): el fondo acompaña, no compite */}
      <rect x={-4000} y={-2000} width={14000} height={ACERA + 2000} fill="#f4dcc2" opacity={0.2} />
      {!peste && !sinPuestos && <Pieza n="puesto" cx={1560} base={PISO - 4} alto={400} />}
      <Pieza n="pozo" cx={2650} base={PISO - 6} alto={380} />
      {/* el río: agua y un muelle de tablas */}
      <Pieza n="agua" cx={5250 + aw / 2} base={PISO - 70 + ah * 1.8} alto={ah * 1.8} ancho={aw} />
      <Pieza n="muelle" cx={5560} base={PISO + 60} alto={170} />
      {peste && <Carro x={3800} f={f} tapado />}
    </g>
  );
};

// ── interior: taberna / posada (hitos de TABERNA_M: barra 600, mesa 1250, cama 1500, fogón 2050) ──────────────────
export const TabernaPintada: React.FC<{ capa: Capa; f: number; variante?: string }> = ({ capa, f, variante }) => {
  const posada = variante === "posada";
  if (capa === "lejos") return <rect x={-3000} y={-2000} width={9000} height={5000} fill="#2a1c12" />;
  if (capa === "tras") return null;
  if (capa === "frente") return null;
  const pw = 3800, ph = (pw * TAM.pared_taberna[1]) / TAM.pared_taberna[0];
  const fuego = 0.75 + 0.25 * lento(f, 1.3) * lento(f, 0.8, 2);
  return (
    <g>
      {/* la pared pintada: el borde del piso de tablas (77 % del alto) cae 130 px detrás de los pies */}
      <rect x={-3000} y={PISO} width={9000} height={2000} fill="#5e3f26" />
      <Pieza n={posada ? "pared_posada" : "pared_taberna"} cx={1400} base={PISO - 130 + ph * 0.23} alto={ph} ancho={pw} />
      <rect x={-3000} y={PISO - 130 - ph * 0.77 - 1500} width={9000} height={1500} fill="#3a2414" />
      <Pieza n="fogon" cx={TABERNA_M.fogon} base={PISO - 20} alto={600} />
      <Halo x={TABERNA_M.fogon} y={PISO - 150} r={560} color="#ff9a40" fuerza={0.32 * fuego} />
      <Pieza n="barriles" cx={-300} base={PISO - 10} alto={300} />
      {!posada && <Pieza n="barra" cx={TABERNA_M.barra} base={PISO + 10} alto={270} />}
      {!posada && <Pieza n="mesa" cx={TABERNA_M.mesa} base={PISO + 20} alto={230} />}
      {posada && <>
        <Pieza n="cama" cx={TABERNA_M.cama} base={PISO + 10} alto={330} />
        {/* los cinco desconocidos: bultos bajo la manta que respiran (uno ronca más fuerte) */}
        {[0, 1, 2, 3, 4].map((k) => {
          const r = 1 + 0.06 * lento(f, k === 2 ? 0.35 : 0.25, k);
          return <g key={k} transform={`translate(${TABERNA_M.cama - 330 + k * 165},${PISO - 190}) scale(1,${r})`}>
            <ellipse cx={0} cy={0} rx={78} ry={34} fill={["#8a4a3a", "#4a6a7a", "#7a7a4a", "#6a4a7a", "#4a7a5a"][k]} stroke="#3a2414" strokeWidth={4} />
            <circle cx={-70} cy={-14} r={26} fill="#f2efe8" stroke="#3a2414" strokeWidth={4} />
          </g>;
        })}
      </>}
    </g>
  );
};

// ── puerto del Támesis (PUERTO_M: muelle 1400, soga 2300, barco 3000) ──────────────────────────────────────────────
export const PuertoPintado: React.FC<{ capa: Capa; f: number }> = ({ capa, f }) => {
  if (capa === "lejos") return <Pieza n="puerto_lejos" cx={1400} base={1500} alto={2300} />;
  if (capa === "tras") return null;
  if (capa === "frente") return <g>{[600, 2600].map((x) => <rect key={x} x={x} y={PISO - 40} width={46} height={600} fill="#3a2414" />)}</g>;
  const bx = PUERTO_M.barco, by = PISO + 60 + lento(f, 0.2) * 8; // el barco cabecea apenas (igual que puntoSoga)
  const aw = 3200, ah = (aw * TAM.agua[1]) / TAM.agua[0];
  const mw = 1800, mh = (mw * TAM.muelle[1]) / TAM.muelle[0];
  return (
    <g>
      {[0, 1].map((k) => <Pieza key={k} n="agua" cx={-1000 + aw / 2 + k * aw} base={PISO + 20 + ah} alto={ah} ancho={aw} espejo={k === 1} />)}
      <g transform={`rotate(${lento(f, 0.2, 1) * 1.2} ${bx} ${by})`}><Pieza n="barco" cx={bx} base={by + 40} alto={1150} /></g>
      {[0, 1].map((k) => <Pieza key={k} n="muelle" cx={-1000 + mw / 2 + k * mw} base={PISO - 40 + mh} alto={mh} ancho={mw} espejo={k === 1} />)}
      <Pieza n="cajas" cx={265} base={PISO} alto={240} />
      <Pieza n="barriles" cx={1975} base={PISO} alto={200} />
      {/* bolardo y soga al barco */}
      <rect x={PUERTO_M.soga - 30} y={PISO - 70} width={60} height={70} rx={10} fill="#3a3a3a" stroke="#1e140c" strokeWidth={4} />
      <path d={`M${PUERTO_M.soga} ${PISO - 60} Q${(PUERTO_M.soga + bx - 380) / 2} ${PISO - 90} ${bx - 380} ${by - 250}`} stroke="#c9a46a" strokeWidth={9} fill="none" />
    </g>
  );
};

// ── muralla, puerta de Aldgate y el campo (MURALLA_M: puerta 900, carro 1700, colina 3600) ──────────────────────────
export const MurallaPintada: React.FC<{ capa: Capa; f: number; hora?: number }> = ({ capa, hora = 0 }) => {
  if (capa === "lejos") return <Pieza n={hora > 0.5 ? "campo_tarde" : "campo_dia"} cx={2400} base={1500} alto={2600} />;
  if (capa === "tras") return null;
  if (capa === "frente") return <g>{Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${1800 + i * 500} ${PISO + 260} q20 -90 40 0 q16 -70 34 0`} fill="#4f6a36" />)}</g>;
  const P = MURALLA_M.puerta;
  const gw = 3400, gh = (gw * TAM.pasto[1]) / TAM.pasto[0];
  const sw = 2700, sh = (sw * TAM.suelo[1]) / TAM.suelo[0];
  return (
    <g>
      {[0, 1].map((k) => <Pieza key={k} n="pasto" cx={1200 + gw / 2 + k * gw} base={PISO - 60 + gh} alto={gh} ancho={gw} espejo={k === 1} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <Pieza key={i} n="arbol" cx={2000 + i * 640 + (i % 2) * 90} base={PISO - 40} alto={300 + (i % 3) * 70} espejo={i % 2 === 1} />)}
      <Pieza n="suelo" cx={-1200 + sw / 2} base={PISO - 30 + sh} alto={sh} />
      <Pieza n="muralla" cx={-120} base={PISO + 10} alto={640} ancho={2280} />
      <Pieza n="puerta_aldgate" cx={P} base={PISO + 10} alto={900} />
      <Pieza n="puente" cx={1360} base={PISO + 70} alto={190} />
    </g>
  );
};
