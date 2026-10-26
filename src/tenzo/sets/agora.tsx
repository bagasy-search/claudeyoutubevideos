// SET · ÁGORA DE CORINTO (tz07, sesión tz-c): parábola de Diógenes y Alejandro, mundo CÁLIDO de mediodía.
// Lejos: cielo dorado claro, el mar azul suave, el Acrocorinto con su templo. Medio: la puerta de la ciudad (izq.),
// la stoa de columnas blancas, los puestos del mercado con toldos (aceitunas, pescado, ánforas de vino), la esquina
// soleada con el BARRIL de Diógenes y la fuente (der.). Piso: AGORA_PISO. x útil: -900 … 4200.
// `variante`: "sombra" = la sombra de Alejandro cae sobre la esquina (se maneja desde la escena con <SombraRey>).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Haces, Polvo } from "../../anikit/luz";
import { Cielo, SetProps, osc } from "../../anikit/sets/comun";

export const AGORA_PISO = 900;
export const AGORA_PUNTOS = { puerta: -450, stoa: 700, puestos: 1500, barril: 2780, fuente: 3550, mercado: 1300 };

const PIEDRA = "#efe6d2", PIEDRA_O = "#d6c8aa", MAR = "#6aa6c6";

// pithos de barro acostado (la casa de Diógenes). Abre hacia la derecha. `capa`: "atras" (cuerpo y hueco) / "boca" (labio
// que tapa a quien está adentro). Origen = suelo bajo la boca.
export const Barril: React.FC<{ x: number; y: number; s?: number; capa: "atras" | "boca" }> = ({ x, y, s = 1, capa }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {capa === "atras" ? (
      <g>
        <ellipse cx={-180} cy={4} rx={260} ry={22} fill="#000" opacity={0.16} />
        <path d="M0,-30 Q-40,-260 -220,-250 Q-420,-240 -430,-130 Q-430,-20 -220,-6 Q-60,4 0,-30 Z" fill="#c07a48" />
        {[-0.2, -0.45, -0.7].map((u, i) => <path key={i} d={`M${u * 430},-${236 - i * 6} Q${u * 430 - 30},-130 ${u * 430},-${18 + i * 2}`} stroke="#9a5a34" strokeWidth={6} fill="none" />)}
        <path d="M-60,-232 Q-240,-262 -400,-170" stroke="#e8a874" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
        <ellipse cx={-14} cy={-136} rx={52} ry={118} fill="#3a2418" />
      </g>
    ) : (
      <g>
        <path d="M-14,-254 Q40,-136 -14,-18 L18,-14 Q74,-136 18,-258 Z" fill="#a8643a" />
        <path d="M-6,-250 Q46,-136 -6,-22" stroke="#e8a874" strokeWidth={5} fill="none" opacity={0.7} />
      </g>
    )}
  </g>
);

// sombra larga que proyecta alguien parado entre el sol y el barril (se dibuja en el piso del mundo)
export const SombraRey: React.FC<{ x: number; y: number; largo?: number; fuerza?: number }> = ({ x, y, largo = 520, fuerza = 0.42 }) => (
  <path d={`M${x - 40},${y} L${x + 40},${y} L${x - largo + 60},${y + 70} L${x - largo - 60},${y + 60} Z`} fill="#3a2a1a" opacity={fuerza} />
);

const Toldo: React.FC<{ x: number; w: number; P: number; color: string; f: number; seed: number }> = ({ x, w, P, color, f, seed }) => (
  <g>
    <rect x={x + 6} y={P - 330} width={10} height={330} fill="#8a5a34" />
    <rect x={x + w - 16} y={P - 330} width={10} height={330} fill="#8a5a34" />
    <path d={`M${x - 20},${P - 330} L${x + w + 20},${P - 330} L${x + w + 40},${P - 280} ${Array.from({ length: 6 }).map((_, k) => `Q${x + w + 40 - (k + 0.5) * ((w + 80) / 6)},${P - 256 + Math.sin(f / 10 + seed + k) * 3} ${x + w + 40 - (k + 1) * ((w + 80) / 6)},${P - 280}`).join(" ")} Z`} fill={color} />
    {Array.from({ length: 5 }).map((_, k) => <rect key={k} x={x - 10 + k * ((w + 40) / 5)} y={P - 330} width={(w + 40) / 10} height={48} fill="#fbf1dc" opacity={0.75} />)}
    <rect x={x} y={P - 130} width={w} height={130} fill="#9a6a3e" />
    <rect x={x - 8} y={P - 140} width={w + 16} height={14} rx={3} fill="#b47e4a" />
  </g>
);

const Anfora: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#c47a46" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-10,-96 L10,-96 L12,-80 Q34,-60 30,-28 Q24,-4 0,0 Q-24,-4 -30,-28 Q-34,-60 -12,-80 Z" fill={color} />
    <path d="M-12,-84 q-16,6 -14,24 M12,-84 q16,6 14,24" stroke={osc(color, 0.7)} strokeWidth={5} fill="none" />
    <path d="M-26,-46 Q0,-38 26,-46" stroke="#2a1a10" strokeWidth={5} fill="none" opacity={0.6} />
  </g>
);

export const Agora: React.FC<SetProps> = ({ capa, f }) => {
  const P = AGORA_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={["#f2c47a", "#f8dca2", "#fff0cf"]} />
        <Halo x={2900} y={-60} r={700} color="#fff7d8" fuerza={0.8} />
        <circle cx={2900} cy={-60} r={80} fill="#fffbea" />
        {/* el Acrocorinto con su templo */}
        <path d="M-400,700 Q300,180 1000,400 Q1400,520 1800,700 Z" fill="#d79a6a" opacity={0.75} />
        <g transform="translate(560,330)" fill="#f6ead2">
          <rect x={-60} y={-14} width={120} height={14} />
          {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-54 + k * 26} y={-64} width={10} height={50} />)}
          <path d="M-70,-64 L0,-92 L70,-64 Z" />
        </g>
        {/* el mar azul suave + reflejos */}
        <rect x={1500} y={600} width={4000} height={300} fill={MAR} />
        {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={1600 + random(`mr${i}`) * 3400 + Math.sin(f / 30 + i) * 10} y={620 + random(`my${i}`) * 200} width={50 + random(`mw${i}`) * 90} height={4} rx={2} fill="#e8f4f8" opacity={0.7} />)}
        {[2300, 3400].map((x, i) => (
          <g key={i} transform={`translate(${x + Math.sin(f / 80 + i) * 20},${640})`}>
            <path d="M-50,0 L50,0 L36,16 L-36,16 Z" fill="#7a4a30" /><path d="M0,-6 L0,-90 L44,-10 Z" fill="#fbf2dc" />
          </g>
        ))}
        <rect x={-2000} y={760} width={8000} height={200} fill="#e2cfa6" />
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        <Haces x={2900} y={-200} ang={-18} largo={1300} n={5} ancho={70} color="#fff3c8" fuerza={0.12} f={f} />
        <Polvo x={-600} y={100} w={4600} h={800} n={55} f={f} seed={7} color="#fff3d0" />
      </g>
    );
  }
  // ---- capa media ----
  return (
    <g>
      {/* empedrado */}
      <rect x={-2000} y={P} width={8000} height={900} fill={PIEDRA_O} />
      {Array.from({ length: 22 }).map((_, r) => Array.from({ length: 34 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={-1000 + c * 160 + (r % 2) * 80} y={P + 6 + r * 34} width={150} height={28} rx={6} fill={(r + c) % 3 ? PIEDRA : "#e6d9bc"} opacity={0.9} />
      )))}
      {/* puerta de la ciudad (arco de piedra) */}
      <g>
        <rect x={-900} y={P - 700} width={900} height={700} fill={PIEDRA_O} />
        {Array.from({ length: 10 }).map((_, r) => <rect key={r} x={-900} y={P - 700 + r * 70} width={900} height={3} fill="#bfae8a" />)}
        <path d={`M-660,${P} L-660,${P - 380} Q-450,${P - 560} -240,${P - 380} L-240,${P} Z`} fill="#f9e7c0" />
        <Halo x={-450} y={P - 200} r={280} color="#fff4d2" fuerza={0.6} />
        <rect x={-920} y={P - 730} width={940} height={40} fill={PIEDRA} />
      </g>
      {/* stoa: techo + columnas blancas con sombra cálida */}
      <g>
        <rect x={150} y={P - 560} width={1900} height={560} fill="#c9b48e" />
        <path d={`M120,${P - 560} L2080,${P - 560} L2080,${P - 620} L1100,${P - 700} L120,${P - 620} Z`} fill={PIEDRA} />
        <rect x={120} y={P - 580} width={1960} height={22} fill={PIEDRA_O} />
        {Array.from({ length: 11 }).map((_, k) => (
          <g key={k}>
            <rect x={180 + k * 180} y={P - 560} width={54} height={560} fill={PIEDRA} />
            {[0, 1, 2].map((q) => <rect key={q} x={190 + k * 180 + q * 15} y={P - 556} width={4} height={552} fill={PIEDRA_O} />)}
            <rect x={170 + k * 180} y={P - 572} width={74} height={18} fill={PIEDRA} />
            <rect x={172 + k * 180} y={P - 14} width={70} height={14} fill={PIEDRA_O} />
          </g>
        ))}
      </g>
      {/* puestos: aceitunas, pescado, vino */}
      <Toldo x={1150} w={300} P={P} color="#c8502e" f={f} seed={1} />
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={1180 + (i % 7) * 38} cy={P - 150 - Math.floor(i / 7) * 16} r={11} fill={i % 2 ? "#5a6a2a" : "#3a3a20"} />)}
      <Toldo x={1560} w={300} P={P} color="#3f7fa8" f={f} seed={2} />
      {[0, 1, 2].map((k) => <path key={k} d={`M${1600 + k * 80},${P - 150} q34,-24 68,0 q-34,24 -68,0 Z M${1668 + k * 80},${P - 150} l16,-12 l0,24 Z`} fill="#b8c4c8" />)}
      <Toldo x={1970} w={260} P={P} color="#e2a33a" f={f} seed={3} />
      {[0, 1, 2, 3].map((k) => <Anfora key={k} x={1995 + k * 62} y={P - 140} s={0.75} color={k % 2 ? "#b4683a" : "#c98a52"} />)}
      {[0, 1].map((k) => <Anfora key={k} x={2300 + k * 70} y={P} s={1} />)}
      {/* esquina soleada: un banco de piedra y el muro bajo */}
      <rect x={2400} y={P - 160} width={900} height={160} fill="#e6d6b4" />
      <rect x={2390} y={P - 176} width={920} height={20} fill={PIEDRA} />
      <Charco x={2780} y={P + 50} rx={520} color="#fff0b8" fuerza={0.45} />
      {/* fuente */}
      <g transform={`translate(${AGORA_PUNTOS.fuente},${P})`}>
        <ellipse cx={0} cy={-30} rx={200} ry={40} fill={PIEDRA_O} />
        <rect x={-200} y={-80} width={400} height={50} fill={PIEDRA} />
        <ellipse cx={0} cy={-80} rx={200} ry={30} fill="#8fc2d8" />
        <rect x={-24} y={-260} width={48} height={180} fill={PIEDRA} />
        <path d="M-40,-262 L40,-262 L30,-292 L-30,-292 Z" fill={PIEDRA_O} />
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M0,-280 q${-60 + k * 40},${-20 - ((f * 2 + k * 10) % 20)} ${-110 + k * 73},170`} stroke="#d4ecf4" strokeWidth={5} fill="none" opacity={0.8} />)}
      </g>
    </g>
  );
};
