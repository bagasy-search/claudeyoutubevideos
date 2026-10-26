// SET · DENTRO DEL FREEZER walk-in (-10 °F): paredes de acero con escarcha, estanterías de alambre a los dos lados
// con cajas rotuladas, foco enjaulado frío, la puerta al fondo con la PERILLA ROJA de seguridad del lado de adentro.
//   x 0…760 estantería izquierda (PATTIES / FRIES) · 880…1240 puerta · 1360…2120 estantería derecha (BUNS / HOT DOGS / ICE CREAM)
// Piso: FREEZER_PISO. props: puerta 0..1 (abierta = entra la luz cálida de la cocina), vacio 0..1 (cuánto se sacó),
// delantal (el delantal de Gus tirado junto a la puerta)
import React from "react";
import { random } from "remotion";
import { Cono, Halo, Polvo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { SetProps } from "../../anikit/sets/comun";

export const FREEZER_PISO = 900;
export const FREEZER_PUNTOS = { izq: 380, puerta: 1060, perilla: 1205, der: 1740, delantal: 1290 };
const P = FREEZER_PISO;

const Caja: React.FC<{ x: number; y: number; w: number; h: number; c: string; rot?: string }> = ({ x, y, w, h, c, rot }) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} rx={3} fill={c} />
    <rect x={x} y={y - h} width={w} height={8} fill="#000" opacity={0.15} />
    {rot && <text x={x + w / 2} y={y - h / 2 + 8} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={Math.min(22, w / 5)} fill="#2a2420">{rot}</text>}
    <rect x={x + 4} y={y - h + 2} width={w - 8} height={5} fill="#f4fbff" opacity={0.5} />
  </g>
);

const Estante: React.FC<{ x0: number; filas: [string, string][]; vacio: number; seed: number }> = ({ x0, filas, vacio, seed }) => (
  <g>
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={x0} y={P - 90 - r * 170} width={760} height={10} fill="#c8d4da" />
        {Array.from({ length: 5 }).map((_, k) => {
          if (random(`fz${seed}${r}${k}`) < vacio) return null;
          const [rot, c] = filas[(r + k) % filas.length];
          const h = 90 + random(`fh${seed}${r}${k}`) * 50;
          return <Caja key={k} x={x0 + 10 + k * 150} y={P - 90 - r * 170} w={138} h={h} c={c} rot={rot} />;
        })}
      </g>
    ))}
    {[x0, x0 + 752].map((x) => <rect key={x} x={x} y={P - 720} width={8} height={720} fill="#c8d4da" />)}
  </g>
);

export const Freezer: React.FC<SetProps & { puerta?: number | ((f: number) => number); vacio?: number; delantal?: boolean }> = ({ capa, f, puerta = 0, vacio = 0, delantal }) => {
  const ab = Math.max(0, Math.min(1, typeof puerta === "function" ? puerta(f) : puerta));
  if (capa === "lejos") return <rect x={-3000} y={-1500} width={9000} height={4000} fill="#0e161c" />;
  if (capa === "frente") return <g><Polvo x={0} y={P - 700} w={2200} h={700} n={60} color="#e4f6ff" f={f} seed={7} tam={2.6} /></g>;
  return (
    <g>
      {/* paredes de acero */}
      <rect x={-600} y={-1500} width={3400} height={P + 1500} fill="#7a96a6" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-600 + i * 120} y={-1500} width={4} height={P + 1500} fill="#6a8696" />)}
      {/* escarcha en las juntas */}
      {Array.from({ length: 90 }).map((_, i) => <circle key={i} cx={-600 + random(`fe${i}`) * 3400} cy={P - 760 + random(`fy${i}`) * 40} r={4 + random(`fr${i}`) * 9} fill="#eef9ff" opacity={0.35} />)}
      <rect x={-600} y={-1500} width={3400} height={720} fill="#e8f6ff" opacity={0.08} />
      {/* foco enjaulado */}
      <g transform="translate(1060,-140)"><rect x={-4} y={-200} width={8} height={160} fill="#5a6a74" /><circle r={34} fill="#f4fbff" /><path d="M-38,0 A38,38 0 0 1 38,0 M-30,-22 L30,22 M30,-22 L-30,22" stroke="#5a6a74" strokeWidth={4} fill="none" /></g>
      <Cono x={1060} y={-110} alto={1010} ancho={2200} boca={80} color="#dff4ff" fuerza={0.18} />
      <Halo x={1060} y={-140} r={500} color="#e4f6ff" fuerza={0.4} />
      {/* puerta al fondo: hueco con luz cálida cuando se abre; perilla roja del lado de adentro */}
      <rect x={880} y={P - 600} width={360} height={600} fill="#ffcf7a" opacity={ab} />
      {ab > 0 && <Cono x={1060} y={P - 600} alto={700} ancho={900} boca={360} color="#ffcf7a" fuerza={0.3 * ab} />}
      <g>
        <rect x={880} y={P - 600} width={360 * (1 - ab * 0.9)} height={600} rx={4} fill="#b9c8d0" stroke="#6a7a84" strokeWidth={6} />
        {ab < 0.4 && <>
          <rect x={1170} y={P - 330} width={20} height={60} fill="#6a7a84" />
          <circle cx={1205} cy={P - 300} r={22} fill="#e2302a" stroke="#7a1410" strokeWidth={4} />
          <text x={1060} y={P - 420} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#7a1410">PUSH TO OPEN</text>
        </>}
      </g>
      <Estante x0={0} vacio={vacio} seed={1} filas={[["PATTIES", "#d9b07a"], ["FRIES", "#e9c24a"], ["PATTIES", "#c99a62"]]} />
      <Estante x0={1360} vacio={vacio} seed={2} filas={[["BUNS", "#e9d6a8"], ["HOT DOGS", "#d8705a"], ["ICE CREAM", "#f4efe4"]]} />
      {/* piso de chapa antideslizante */}
      <rect x={-600} y={P} width={3400} height={900} fill="#8aa0ac" />
      {Array.from({ length: 120 }).map((_, i) => <rect key={i} x={-600 + (i % 30) * 115 + (Math.floor(i / 30) % 2) * 55} y={P + 20 + Math.floor(i / 30) * 40} width={30} height={6} rx={3} fill="#9cb2be" transform={`rotate(${i % 2 ? 30 : -30} ${-585 + (i % 30) * 115} ${P + 23 + Math.floor(i / 30) * 40})`} />)}
      {delantal && <path d={`M1250,${P + 8} q40,-26 90,-6 q30,14 60,0 l10,24 q-80,20 -170,2 Z`} fill="#8a2e4a" />}
    </g>
  );
};
