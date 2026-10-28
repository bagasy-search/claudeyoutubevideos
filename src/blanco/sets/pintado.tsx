// SET pintado: la calle de Londres hecha con ilustraciones 2D (agnes 2K, fondo magenta recortado → webp con alfa)
// en capas de profundidad. Lo que se mueve o se agarra sigue en código (sobre/frente de la escena).
//   lejos (z .25): panorama de techos y la aguja de San Pablo · tras (z .6): fila de casas de atrás, más chicas
//   medio (z 1): suelo + fila de casas + puestos · frente (z 1.4): heno, carreta, barriles que pasan por delante
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { PISO } from "./londres";

type Capa = "lejos" | "tras" | "medio" | "frente";
const DIR = "blanco/fondos/";
// tamaño en px de cada webp (para escalar por alto sin medir en runtime)
const TAM: Record<string, [number, number]> = {
  barriles: [1419, 1202], cajas: [1500, 1326], carreta: [1500, 873], heno: [1500, 969], poste: [710, 1500], pozo: [1151, 1500], puesto: [1272, 1500],
  casa_a: [913, 1500], casa_b: [1089, 1500], casa_c: [1119, 1500], casa_d: [1272, 1500], casa_e: [1022, 1500], casa_f: [1136, 1500], casa_g: [653, 1500],
  lejos: [2624, 1472], suelo: [2624, 1031],
};

// <image> de SVG no lo espera Remotion: se bloquea el cuadro hasta que la imagen está decodificada
const Pieza: React.FC<{ n: string; cx: number; base: number; alto: number; espejo?: boolean; tinte?: number }> = ({ n, cx, base, alto, espejo, tinte = 0 }) => {
  const src = staticFile(DIR + n + ".webp");
  const [h] = useState(() => delayRender("pieza " + n));
  useEffect(() => {
    const im = new Image();
    im.src = src;
    im.decode().then(() => continueRender(h), () => continueRender(h));
  }, [src, h]);
  const [w0, h0] = TAM[n];
  const ancho = (alto * w0) / h0, x = cx - ancho / 2, y = base - alto;
  return (
    <g transform={espejo ? `translate(${2 * cx} 0) scale(-1 1)` : undefined}>
      <image href={src} x={x} y={y} width={ancho} height={alto} preserveAspectRatio="none" />
      {tinte > 0 && <image href={src} x={x} y={y} width={ancho} height={alto} preserveAspectRatio="none" opacity={tinte} style={{ filter: "brightness(0.55) sepia(0.4) hue-rotate(-20deg) saturate(1.3)" }} />}
    </g>
  );
};

const ACERA = PISO - 40; // donde apoyan las casas: un poco detrás de la línea de los pies

// [nombre, centro x, alto, espejo]
const CASAS: [string, number, number, boolean?][] = [
  ["casa_g", -560, 900], ["casa_e", -110, 800], ["casa_b", 420, 760], ["casa_d", 960, 700], ["casa_a", 1400, 820],
  ["casa_f", 1900, 720], ["casa_c", 2430, 760], ["casa_e", 2960, 800, true], ["casa_b", 3500, 760, true], ["casa_d", 4060, 700, true], ["casa_g", 4520, 900, true],
];
const TRAS: [string, number, number, boolean?][] = [
  ["casa_c", -300, 760, true], ["casa_a", 300, 820, true], ["casa_f", 860, 720, true], ["casa_g", 1380, 900], ["casa_b", 1920, 760],
  ["casa_d", 2500, 700], ["casa_e", 3060, 800], ["casa_a", 3600, 820], ["casa_c", 4150, 760],
];

export const CallePintada: React.FC<{ capa: Capa; f: number; sinPuestos?: boolean }> = ({ capa, sinPuestos }) => {
  if (capa === "lejos") return <Pieza n="lejos" cx={960} base={1330} alto={1900} />;
  if (capa === "tras") return <g>{TRAS.map(([n, cx, a, e], i) => <Pieza key={i} n={n} cx={cx} base={ACERA - 40} alto={a * 0.82} espejo={e} tinte={0.28} />)}</g>;
  if (capa === "frente") {
    return (
      <g>
        <Pieza n="heno" cx={-260} base={PISO + 420} alto={330} />
        <Pieza n="carreta" cx={3300} base={PISO + 430} alto={340} espejo />
        <Pieza n="barriles" cx={4300} base={PISO + 420} alto={330} />
      </g>
    );
  }
  // medio: suelo (dos tiras, la 2ª en espejo) + casas + puestos
  const sw = 2700, sh = (sw * TAM.suelo[1]) / TAM.suelo[0];
  return (
    <g>
      {[-1, 0, 1].map((k) => <Pieza key={k} n="suelo" cx={-600 + sw / 2 + (k + 1) * sw - sw} base={ACERA - 30 + sh} alto={sh} espejo={k % 2 !== 0} />)}
      {CASAS.map(([n, cx, a, e], i) => <Pieza key={i} n={n} cx={cx} base={ACERA} alto={a} espejo={e} />)}
      <Pieza n="pozo" cx={640} base={PISO - 10} alto={360} />
      <Pieza n="poste" cx={1180} base={PISO - 6} alto={520} />
      {!sinPuestos && <Pieza n="puesto" cx={2440} base={PISO - 4} alto={400} />}
      <Pieza n="cajas" cx={2800} base={PISO} alto={230} />
      <Pieza n="barriles" cx={220} base={PISO} alto={240} espejo />
    </g>
  );
};
