// lc01 · vuelta 4 (v4a, planos P01-P14): componentes nuevos. No toca los _comp compartidos ni v3a/v3b.
// - CuadernoAbreV4: inserto del cuaderno CENSUS; la mano del kit (manga naranja + puño + dedos, ManoV3) entra desde
//   abajo a la derecha, pellizca el borde de la tapa y la levanta: la tapa se abre DENTRO de los 0,8 s del plano.
// - GorroPerchero: gorro de lana colgado de una percha de pared (mundo), que se oculta cuando Theo lo descuelga.
// - Burbujas: vapor del aliento chico que sube (no tapa las caras).
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { CuadernoGrande } from "./base";
import { ManoV3 } from "./v3b_v3";
import { Gorro } from "./v3a_v3";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });

// ---------- 11 · la mano abre la tapa del cuaderno (pantalla) ----------
// abre = cuadro en que la tapa empieza a girar (dura 18); la mano llega 6 cuadros antes y suelta 4 después.
export const CuadernoAbreV4: React.FC<{ abre: number; zoom: [number, number, number] }> = ({ abre, zoom }) => {
  const f = useF();
  const ab = rp(f, abre, abre + 18);
  const entra = rp(f, abre - 7, abre);
  const suelta = rp(f, abre + 19, abre + 30);
  // borde libre de la tapa (marco del cuaderno, antes de la rotación de -3°): x = 960 + 660·cos(ab·π)
  const bx = 960 + 650 * Math.cos(ab * Math.PI), by = 830 - 70 * Math.sin(ab * Math.PI);
  const x = bx + (1 - entra) * 520 + suelta * 260, y = by + (1 - entra) * 420 + suelta * 300;
  const z = interpolate(f, [zoom[0], zoom[0] + 240], [zoom[1], zoom[2]], CL);
  return (
    <AbsoluteFill>
      <CuadernoGrande tapa abre={abre} zoom={zoom} />
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform="rotate(-3 960 540)">
            {/* sombra de la mano sobre la página */}
            <ellipse cx={x + 40} cy={y + 60} rx={110} ry={40} fill="#000" opacity={0.18 * entra * (1 - suelta)} />
            <ManoV3 x={x} y={y} ang={-36 - 34 * ab} gesto="pinza" s={0.72} />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- gorro colgado de una percha de pared (mundo; base de la percha en x, y) ----------
export const GorroPerchero: React.FC<{ x: number; y: number; colgado: boolean; s?: number }> = ({ x, y, colgado, s = 1.1 }) => (
  <g>
    <rect x={x - 5} y={y - 6} width={10} height={26} rx={3} fill="#2a2232" />
    <path d={`M${x},${y + 16} q12,0 12,12`} stroke="#8a8a92" strokeWidth={5} fill="none" />
    {colgado && <g transform={`translate(${x + 4},${y + 64})`}><Gorro s={s} /></g>}
  </g>
);

// ---------- aliento: vapor chico que sube (mundo) ----------
export const AlientoV4: React.FC<{ f: number; x: number; y: number; desde: number; dir?: 1 | -1; s?: number }> = ({ f, x, y, desde, dir = 1, s = 0.6 }) => {
  if (f < desde || f > desde + 46) return null;
  const t = (f - desde) / 46;
  return <g opacity={0.65 * Math.sin(Math.min(1, t * 1.6) * Math.PI * 0.5) * (1 - t)}>{[0, 1, 2].map((i) => <circle key={i} cx={x + dir * (8 + t * 30 + i * 10) * s} cy={y - (t * 70 + i * 14) * s} r={(6 + t * 14 + i * 3) * s} fill="#eef2ff" />)}</g>;
};
