// v7a (lc01 vuelta 7): piezas para P12Hora (desaparición con barrido opaco, sin fundido de opacidad) y
// P19Holiday (la jarra de café que Theo levanta y huele: se tapa la jarra del set y se dibuja la propia).
import React from "react";
import { Halo } from "../../anikit/luz";
import { rampa, TIENDA } from "./lc01_planos1_comp";

// ---------- P12 · barrido opaco de arriba abajo: lo que está por encima de la línea ya no existe ----------
// t = 0 → todo visible; t = 1 → nada (el borde es duro: no hay media opacidad).
export const BarridoDesaparece: React.FC<{ id: string; f: number; f0: number; dur: number; x: number; arriba: number; abajo: number; colores?: string[]; children: React.ReactNode }> = ({ id, f, f0, dur, x, arriba, abajo, children }) => {
  const t = rampa(f, f0, f0 + dur);
  if (t >= 1) return null;
  const linea = arriba + (abajo - arriba) * t;
  return (
    <g>
      {t < 1 && (
        <>
          <defs><clipPath id={id}><rect x={x - 400} y={linea} width={800} height={abajo - linea + 400} /></clipPath></defs>
          <g clipPath={`url(#${id})`}>{children}</g>
          {t > 0 && <path d={`M${x - 70},${linea} L${x + 70},${linea}`} stroke="#dfe8ff" strokeWidth={4} strokeLinecap="round" />}
        </>
      )}
    </g>
  );
};

// ---------- P19 · la jarra de la cafetera de Holiday (mismas coords locales que el set Tienda) ----------
// origen = (TIENDA.cafe, TIENDA.piso - 226) cuando está en la placa. Agarre (lado de Theo) = origen + (-52, -72).
export const AGARRE = { x: -52, y: -72 };
export const JarraCafe: React.FC<{ x: number; y: number; f: number; inclina?: number }> = ({ x, y, f, inclina = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${inclina})`}>
    <path d="M-50,-120 L30,-120 Q42,-60 26,-14 L-46,-14 Q-62,-60 -50,-120 Z" fill="#c6d4e0" />
    <path d={`M-56,${-60 + 2 * Math.sin(f / 4)} Q-58,-30 -46,-14 L26,-14 Q38,-30 36,${-60 + 2 * Math.sin(f / 4 + 1)} Z`} fill="#4a2a14" />
    <path d="M-50,-120 L30,-120" stroke="#2a2630" strokeWidth={6} strokeLinecap="round" />
    <path d="M30,-110 q30,0 30,30 q0,26 -24,30" stroke="#1d1a20" strokeWidth={9} fill="none" />
    <path d="M-40,-104 L-44,-30" stroke="#ffffff" strokeWidth={5} opacity={0.6} strokeLinecap="round" />
  </g>
);
// tapa la jarra del set (pared + campana de la cafetera repintadas encima), con el mismo Halo del set recortado
export const TapaJarraTienda: React.FC<{ on: boolean }> = ({ on }) => {
  if (!on) return null;
  const P = TIENDA.piso;
  const ox = TIENDA.cafe, oy = P - 226;
  return (
    <g>
      <defs><clipPath id="v7tapajarra"><rect x={ox - 66} y={oy - 240} width={115} height={229} /></clipPath></defs>
      <g clipPath="url(#v7tapajarra)">
        <rect x={ox - 66} y={oy - 240} width={115} height={229} fill="#e4dccc" />
        <rect x={ox - 80} y={oy - 190} width={160} height={40} rx={8} fill="#1d1a20" />
        <Halo x={1250} y={P - 600} r={900} color="#fff8e6" fuerza={0.25} />
      </g>
    </g>
  );
};
// vapor que sale de la boca de la jarra y se curva hacia la nariz (trazos opacos que cambian de forma, no de opacidad del set)
export const VaporJarra: React.FC<{ f: number; x: number; y: number; hacia: number; fuerza: number }> = ({ f, x, y, hacia, fuerza }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const t = (f / 30 + k / 3) % 1;
      const px = x + k * 18 - 18 + hacia * t * 46;
      const py = y - t * 70;
      return <path key={k} d={`M${px},${py} q${8 + hacia * 6},-14 ${hacia * 4},-28 q-8,-14 ${4 + hacia * 6},-26`} stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI) * 0.8 * fuerza} />;
    })}
  </g>
);
