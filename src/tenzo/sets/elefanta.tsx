// ELEFANTA (tz05, sesión tz-c): animal de 4 patas en SVG propio (el kit no los trae). Elefanta asiática de perfil,
// mira a la derecha (dir 1). Origen = suelo, bajo el centro del cuerpo. Alto ≈ 640 a s=1 (más alta que el poste de la carpa).
// Se balancea con los pies plantados (las patas son trapecios: arriba siguen al cuerpo, abajo quedan fijas),
// trompa que sube a la boca (heno), orejas como velas, cola, ojo que parpadea y lágrima. `cria` = bebé (cabeza más grande).
// `fase` (opcional) = ciclo de paso 0..1 para caminar. ESTACA + SOGA aparte: la soga va del tobillo (tobillo()) a la estaca.
import React from "react";
import { parpadear } from "../../anikit/personaje";
import { acl, osc } from "../../anikit/sets/comun";

export const PIEL_ELEFANTA = "#8f837b";

export type ElefantaProps = {
  x: number; y: number; s?: number; dir?: 1 | -1; f: number;
  balanceo?: number; // amplitud del balanceo en px (0 = quieta)
  trompa?: number; // 0 colgando … 1 enroscada a la boca
  oreja?: number; // amplitud del aleteo de la oreja (0..1)
  cria?: boolean; fase?: number; ojo?: number; // ojo 1 abierto … 0 cerrado
  lagrima?: number; // 0..1 (cae por la mejilla)
  cabeza?: number; // grados: baja la cabeza (+) o la sube (-)
  luz?: string; // rim light cálido sobre el lomo
  piel?: string; seed?: number;
};

// punto del tobillo trasero (el de la soga) en coordenadas del mundo
export const tobillo = (x: number, y: number, s = 1, dir: 1 | -1 = 1, cria = false) => {
  const k = cria ? 0.92 : 1;
  return { x: x + dir * -190 * s * k, y: y - 34 * s * k };
};

export const Elefanta: React.FC<ElefantaProps> = ({ x, y, s = 1, dir = 1, f, balanceo = 6, trompa = 0, oreja = 0.4, cria, fase, ojo = 1, lagrima = 0, cabeza = 0, luz = "#ffcf84", piel = PIEL_ELEFANTA, seed = 0 }) => {
  const sw = balanceo * Math.sin(f / 22 + seed);
  const swY = Math.abs(balanceo) * 0.25 * Math.cos(f / 11 + seed);
  const pielO = osc(piel, 0.78), pielC = acl(piel, 0.16);
  // proporciones de cría: patas más cortas, cabeza más grande
  const pata = cria ? 0.78 : 1;
  const cab = cria ? 1.25 : 1;
  const LT = 300 * pata; // alto de la pata
  const cy = -LT - 110; // centro del cuerpo
  const parp = parpadear(f, seed + 7);
  const abierto = Math.min(ojo, parp);
  // paso: pie que viaja hacia adelante y se levanta
  const pie = (k: number) => {
    if (fase === undefined) return { dx: 0, dy: 0 };
    const w = 2 * Math.PI * (fase + k * 0.25);
    return { dx: 26 * Math.sin(w), dy: -Math.max(0, Math.cos(w)) * 22 };
  };
  const PataQ: React.FC<{ px: number; ancho: number; col: string; k: number }> = ({ px, ancho, col, k }) => {
    const p = pie(k);
    const tx = px + sw, ty = cy + 60 + swY;
    const bx = px + p.dx, by = p.dy;
    return (
      <g>
        <path d={`M${tx - ancho / 2},${ty} L${tx + ancho / 2},${ty} L${bx + ancho / 2 + 4},${by - 6} Q${bx + ancho / 2 + 6},${by} ${bx + ancho / 2},${by} L${bx - ancho / 2},${by} Q${bx - ancho / 2 - 6},${by} ${bx - ancho / 2 - 4},${by - 6} Z`} fill={col} />
        {[-0.28, 0, 0.28].map((u, i) => <ellipse key={i} cx={bx + u * ancho} cy={by - 8} rx={ancho * 0.12} ry={7} fill={acl(col, 0.35)} />)}
        <path d={`M${tx - ancho / 2 + 10},${ty + LT * 0.55} q${ancho / 2 - 10},10 ${ancho - 20},0`} stroke={osc(col, 0.8)} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  // trompa: base en la cara, punta que va de colgar (abajo) a enroscarse hacia la boca
  const hx = 300 + sw, hy = cy - 70 + swY;
  const t = trompa;
  const p1 = { x: hx + 130 * cab, y: hy + 30 * cab };
  const pc = { x: hx + (175 - 40 * t) * cab, y: hy + (180 - 120 * t) * cab };
  const pp = { x: hx + (150 - 120 * t) * cab, y: hy + (330 - 260 * t) * cab };
  const balT = Math.sin(f / 17 + seed) * 10 * (1 - t);
  const ancho = 34 * cab;
  const trompaD = `M${p1.x - ancho},${p1.y} Q${pc.x - ancho + balT},${pc.y} ${pp.x - ancho * 0.45 + balT},${pp.y} L${pp.x + ancho * 0.45 + balT},${pp.y} Q${pc.x + ancho + balT},${pc.y} ${p1.x + ancho},${p1.y - 20} Z`;
  // oreja: aletea con escala en x desde el borde pegado a la cabeza
  const eo = 1 - oreja * 0.18 * (0.5 + 0.5 * Math.sin(f / 9 + seed));
  const colaR = 8 * Math.sin(f / 13 + seed);
  return (
    <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
      {/* sombra en el suelo */}
      <ellipse cx={20} cy={4} rx={360 * (cria ? 0.9 : 1)} ry={26} fill="#000" opacity={0.18} />
      {/* patas de atrás del lado lejano (más oscuras) */}
      <PataQ px={-130} ancho={92} col={pielO} k={1} />
      <PataQ px={170} ancho={96} col={pielO} k={3} />
      {/* cola */}
      <g transform={`rotate(${colaR} ${-300 + sw} ${cy - 40})`}>
        <path d={`M${-300 + sw},${cy - 40} Q${-340 + sw},${cy + 60} ${-325 + sw},${cy + 170}`} stroke={piel} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d={`M${-332 + sw},${cy + 165} l-10,34 l14,-8 l6,14 l6,-16 l14,6 l-10,-30 Z`} fill={osc(piel, 0.5)} />
      </g>
      {/* cuerpo */}
      <ellipse cx={sw} cy={cy + swY} rx={320} ry={200} fill={piel} />
      <path d={`M${-250 + sw},${cy + 120 + swY} Q${sw},${cy + 230 + swY} ${250 + sw},${cy + 120 + swY}`} fill={pielO} opacity={0.35} />
      {/* arrugas del lomo y rim light */}
      {[-140, -60, 30, 110].map((u, i) => <path key={i} d={`M${u + sw},${cy - 120 + swY} q14,60 0,120`} stroke={osc(piel, 0.84)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />)}
      <path d={`M${-290 + sw},${cy - 70 + swY} Q${-150 + sw},${cy - 215 + swY} ${120 + sw},${cy - 200 + swY}`} stroke={luz} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.55} />
      {/* patas del lado cercano */}
      <PataQ px={-210} ancho={100} col={piel} k={0} />
      <PataQ px={110} ancho={104} col={piel} k={2} />
      {/* cabeza (rota desde el cuello) */}
      <g transform={`rotate(${cabeza} ${200 + sw} ${cy - 40 + swY})`}>
        {/* oreja detrás de la cara */}
        <g transform={`translate(${hx - 20},${hy - 10}) scale(${eo},1) translate(${-(hx - 20)},${-(hy - 10)})`}>
          <path d={`M${hx - 20},${hy - 110 * cab} Q${hx - 210 * cab},${hy - 150 * cab} ${hx - 200 * cab},${hy + 40 * cab} Q${hx - 170 * cab},${hy + 190 * cab} ${hx - 40},${hy + 120 * cab} Z`} fill={pielO} />
          <path d={`M${hx - 40},${hy - 70 * cab} Q${hx - 170 * cab},${hy - 90 * cab} ${hx - 165 * cab},${hy + 40 * cab}`} stroke={acl(pielO, 0.2)} strokeWidth={5} fill="none" opacity={0.6} />
        </g>
        {/* cara: domo doble de la elefanta asiática */}
        <path d={`M${hx - 40},${hy + 110 * cab} Q${hx - 60},${hy - 150 * cab} ${hx + 60 * cab},${hy - 150 * cab} Q${hx + 110 * cab},${hy - 190 * cab} ${hx + 150 * cab},${hy - 120 * cab} Q${hx + 200 * cab},${hy - 40 * cab} ${hx + 170 * cab},${hy + 40 * cab} L${hx + 120 * cab},${hy + 120 * cab} Z`} fill={piel} />
        <path d={`M${hx + 20 * cab},${hy - 150 * cab} Q${hx + 70 * cab},${hy - 180 * cab} ${hx + 140 * cab},${hy - 130 * cab}`} stroke={luz} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.5} />
        {/* boca */}
        <path d={`M${hx + 90 * cab},${hy + 90 * cab} q20,26 46,6`} stroke={osc(piel, 0.55)} strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* trompa con anillos */}
        <path d={trompaD} fill={piel} />
        {[0.3, 0.45, 0.6, 0.75].map((u, i) => {
          const qx = (1 - u) * (1 - u) * p1.x + 2 * (1 - u) * u * (pc.x + balT) + u * u * (pp.x + balT);
          const qy = (1 - u) * (1 - u) * p1.y + 2 * (1 - u) * u * pc.y + u * u * pp.y;
          return <path key={i} d={`M${qx - ancho * 0.7},${qy} q${ancho * 0.7},8 ${ancho * 1.4},0`} stroke={osc(piel, 0.8)} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.7} />;
        })}
        {/* ojo */}
        <g>
          <ellipse cx={hx + 95 * cab} cy={hy - 40 * cab} rx={11 * cab} ry={Math.max(1.2, 11 * cab * abierto)} fill="#1e1814" />
          {abierto > 0.4 && <circle cx={hx + 98 * cab} cy={hy - 44 * cab} r={3 * cab} fill="#fff" opacity={0.85} />}
          <path d={`M${hx + 76 * cab},${hy - 58 * cab} q18,-10 38,0`} stroke={osc(piel, 0.6)} strokeWidth={4} fill="none" strokeLinecap="round" />
          {lagrima > 0 && <path d={`M${hx + 96 * cab},${hy - 24 * cab + lagrima * 70} q-8,14 0,20 q8,-6 0,-20 Z`} fill="#cfe3f2" opacity={0.9 * (1 - Math.max(0, lagrima - 0.85) / 0.15)} />}
        </g>
      </g>
    </g>
  );
};

// estaca chica de madera clavada en el barro
export const Estaca: React.FC<{ x: number; y: number; s?: number; inclina?: number }> = ({ x, y, s = 1, inclina = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${inclina}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={34} ry={8} fill="#3f2a1c" opacity={0.6} />
    <path d="M-11,0 L-9,-62 L0,-72 L9,-62 L11,0 Z" fill="#8a6038" />
    <path d="M-9,-62 L0,-72 L9,-62 Z" fill="#b3824e" />
    <rect x={-12} y={-46} width={24} height={7} rx={2} fill="#5d3e22" />
  </g>
);

// soga finita del tobillo a la estaca; `tension` 1 = tirante (recta), 0 = floja (cuelga)
export const Soga: React.FC<{ a: { x: number; y: number }; b: { x: number; y: number }; tension?: number; color?: string; grosor?: number }> = ({ a, b, tension = 0.3, color = "#c9a46a", grosor = 4 }) => {
  const mx = (a.x + b.x) / 2, my = Math.max(a.y, b.y) + (1 - tension) * 26;
  return (
    <g>
      <path d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y - 40}`} stroke={osc(color, 0.6)} strokeWidth={grosor + 2} fill="none" strokeLinecap="round" />
      <path d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y - 40}`} stroke={color} strokeWidth={grosor} fill="none" strokeLinecap="round" strokeDasharray="7 5" />
      <ellipse cx={a.x} cy={a.y} rx={14} ry={7} fill="none" stroke={color} strokeWidth={grosor} />
    </g>
  );
};
