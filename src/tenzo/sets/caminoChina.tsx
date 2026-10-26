// SET tz03 · CAMINO DE TIERRA EN LA CHINA ANTIGUA (parábola «Ask the horse!»). Todo cálido (ámbar): las parábolas
// son la única parte del canal donde el mundo entero es tibio. Camino largo entre dos aldeas, campos de arroz/mijo,
// sauce, mojón de piedra; el granjero se apoya en la azada en GRANJERO_X.
// Piso: CHINA_PISO. x útil: -800 … 4200. Puntos: aldeaI 0, granjero 1500, sauce 1900, mojon 1200, aldeaD 3700.
import React from "react";
import { random } from "remotion";
import { Halo, Polvo } from "../../anikit/luz";
import { Arbusto, Cielo, SetProps, osc } from "../../anikit/sets/comun";

export const CHINA_PISO = 900;
export const CHINA_PUNTOS = { aldeaI: 0, mojon: 1200, granjero: 1500, sauce: 1950, aldeaD: 3700 };

const TIERRA = "#c98f52";
const CAMPO = "#b89a3e";

// casita de techo curvo (aldea china)
const Casa: React.FC<{ x: number; y: number; s?: number; seed: number }> = ({ x, y, s = 1, seed }) => {
  const pared = random(`cw${seed}`) > 0.5 ? "#e9cf9e" : "#dcb784";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-90} y={-120} width={180} height={120} fill={pared} />
      <rect x={-22} y={-74} width={44} height={74} fill="#6a3a22" />
      <rect x={-70} y={-96} width={30} height={26} fill="#8a5a32" />
      <path d="M-130,-112 Q-60,-128 0,-176 Q60,-128 130,-112 Q136,-128 120,-124 Q60,-140 0,-190 Q-60,-140 -120,-124 Q-136,-128 -130,-112 Z" fill="#7a3b26" />
      <path d="M-122,-118 L122,-118" stroke="#5a2a1a" strokeWidth={6} />
    </g>
  );
};

export const CaminoChina: React.FC<SetProps> = ({ capa, f }) => {
  const P = CHINA_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={["#e9925a", "#f6c27a", "#ffe6b0"]} x={-4500} w={11000} />
        <Halo x={2300} y={330} r={520} color="#fff1c4" fuerza={0.85} />
        <circle cx={2300} cy={330} r={80} fill="#fff6dc" />
        {/* tres cordones de montañas suaves, de lejos a cerca */}
        <path d="M-3500,560 Q-900,300 -300,520 Q300,260 900,500 Q1500,240 2100,480 Q2700,280 3300,500 Q3900,300 4600,520 L4600,900 L-3500,900 Z" fill="#e3a46a" />
        <path d="M-3500,640 Q-700,440 0,620 Q700,420 1400,600 Q2100,440 2800,610 Q3500,450 4600,620 L4600,900 L-3500,900 Z" fill="#cf8e58" />
        {/* nubes largas */}
        {[[-400, 180], [900, 120], [2900, 200]].map(([x, y], i) => (
          <ellipse key={i} cx={x + Math.sin(f / 300 + i) * 30} cy={y} rx={260} ry={26} fill="#fff1cf" opacity={0.6} />
        ))}
        {/* pagoda lejana */}
        <g transform="translate(3100,600)">
          {[0, 1, 2, 3].map((k) => (
            <g key={k}><rect x={-26 + k * 3} y={-60 - k * 48} width={52 - k * 6} height={40} fill="#b36a42" /><path d={`M${-56 + k * 6},${-58 - k * 48} Q0,${-80 - k * 48} ${56 - k * 6},${-58 - k * 48} Z`} fill="#8a4a2e" /></g>
          ))}
        </g>
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        <Polvo x={-2700} y={300} w={6700} h={620} n={60} color="#fff0c8" f={f} seed={31} />
        {/* matas de pasto seco que pasan por delante */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = -3000 + i * 360 + random(`pm${i}`) * 120;
          return (
            <g key={i} transform={`translate(${x},${P + 140})`}>
              {Array.from({ length: 7 }).map((__, k) => (
                <path key={k} d={`M0,0 q${(k - 3) * 9 + Math.sin(f / 30 + i + k) * 4},-60 ${(k - 3) * 18},-${90 + (k % 3) * 25}`} stroke={k % 2 ? "#a77a32" : "#8c6428"} strokeWidth={6} fill="none" strokeLinecap="round" />
              ))}
            </g>
          );
        })}
      </g>
    );
  }
  // ---- capa media ----
  return (
    <g>
      {/* campos en terrazas detrás del camino */}
      {[0, 1, 2].map((r) => (
        <rect key={r} x={-3400} y={P - 240 + r * 70} width={7900} height={74} fill={osc(CAMPO, 1 - r * 0.07)} />
      ))}
      {Array.from({ length: 100 }).map((_, i) => (
        <path key={i} d={`M${-3380 + i * 78},${P - 170} q4,-26 ${Math.sin(f / 40 + i) * 6},-44`} stroke="#8e7426" strokeWidth={5} fill="none" strokeLinecap="round" />
      ))}
      {/* aldeas en los dos extremos */}
      <g>{[-260, -40, 180].map((x, i) => <Casa key={i} x={x} y={P - 170} s={0.9 - i * 0.05} seed={i} />)}</g>
      <g>{[3500, 3720, 3960].map((x, i) => <Casa key={i} x={x} y={P - 170} s={0.85 + i * 0.04} seed={i + 5} />)}</g>
      {/* sauce */}
      <g transform={`translate(${CHINA_PUNTOS.sauce},${P - 150})`}>
        <path d="M-14,0 Q-20,-140 10,-260 L26,-260 Q10,-140 18,0 Z" fill="#6a4426" />
        <Arbusto x={-170} y={-200} w={340} h={110} color="#a99a3a" seed={7} />
        {Array.from({ length: 16 }).map((_, k) => (
          <path key={k} d={`M${-150 + k * 20},-250 q${Math.sin(f / 35 + k) * 10},120 ${Math.sin(f / 35 + k) * 18},${170 + (k % 4) * 20}`} stroke="#9a8c30" strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
      </g>
      {/* el camino de tierra (ancho, con huellas de carro) */}
      <rect x={-3400} y={P - 30} width={7900} height={900} fill={TIERRA} />
      <rect x={-3400} y={P - 34} width={7900} height={10} fill={osc(TIERRA, 0.85)} />
      {[P + 30, P + 70].map((y, i) => <rect key={i} x={-3400} y={y} width={7900} height={5} rx={2} fill={osc(TIERRA, 0.82)} />)}
      {Array.from({ length: 60 }).map((_, i) => (
        <ellipse key={i} cx={-3360 + i * 135 + random(`pi${i}`) * 60} cy={P + 10 + random(`py${i}`) * 110} rx={8 + random(`pr${i}`) * 10} ry={4} fill={osc(TIERRA, 0.75)} />
      ))}
      {/* mojón de piedra con un carácter tallado */}
      <g transform={`translate(${CHINA_PUNTOS.mojon},${P - 20})`}>
        <path d="M-34,0 L-30,-120 Q0,-140 30,-120 L34,0 Z" fill="#b9a688" />
        <path d="M-10,-100 h20 M0,-108 v40 M-14,-80 h28" stroke="#7a6a52" strokeWidth={5} />
      </g>
    </g>
  );
};
