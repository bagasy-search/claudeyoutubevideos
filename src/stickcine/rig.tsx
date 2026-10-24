import React from "react";
import { Easing, interpolate } from "remotion";
import { SUELO, lerp, clamp, suave } from "./lib";

// Marioneta de palitos. Los ángulos se miden desde "colgando hacia abajo"; positivo = hacia adelante.
// Siempre se arma mirando a la derecha; `mira = -1` la espeja alrededor de sus pies.

export type Pose = {
  y: number; // cadera
  torso: number;
  muslo: [number, number];
  pierna: [number, number];
  brazo: [number, number];
  ante: [number, number];
  cabeza: number;
};
export type Cara = { giro: number; sonrisa: number; parpado: number; enojo?: number; boca?: number; guino?: number; ojos?: number };
export type Look = {
  color: string;
  ancho: number;
  escala?: number;
  gorra?: boolean;
  rodete?: boolean;
  delantal?: string;
  guantes?: string;
  vincha?: string;
  mono?: string;
  papel?: boolean; // marioneta de cartulina: remaches en las articulaciones, sin sonrisa de emoji
};
export type Borde = { dx: number; dy: number; color: string; op: number };

const rad = Math.PI / 180;
const p = (x: number, y: number, a: number, L: number): [number, number] => [x + L * Math.sin(a * rad), y + L * Math.cos(a * rad)];

// ---------- poses ----------
export const PARADO: Pose = { y: SUELO - 126, torso: 0, muslo: [3, -3], pierna: [3, -3], brazo: [6, -3], ante: [10, 2], cabeza: 0 };
export const SENTADO: Pose = { y: 226, torso: -6, muslo: [86, 84], pierna: [4, -3], brazo: [10, 14], ante: [58, 64], cabeza: -3 };

export const caminar = (fase: number, amp = 1): Pose => {
  const s = Math.sin(fase);
  const c = Math.cos(fase);
  const sw = 24 * amp;
  const mL = sw * s;
  const mR = -sw * s;
  const alto = 124 * Math.cos(sw * Math.abs(s) * rad);
  return {
    y: SUELO - alto - 2 + 2.5 * amp * Math.cos(2 * fase),
    torso: 5 * amp,
    muslo: [mL, mR],
    pierna: [mL - 4 - 38 * amp * Math.max(0, c) ** 1.3, mR - 4 - 38 * amp * Math.max(0, -c) ** 1.3],
    brazo: [-18 * amp * s + 3, 18 * amp * s + 3],
    ante: [-18 * amp * s + 15 + 18 * amp * Math.max(0, -s), 18 * amp * s + 15 + 18 * amp * Math.max(0, s)],
    cabeza: 2 * amp * Math.sin(2 * fase),
  };
};
// correr: zancada larga, cuerpo inclinado, brazos doblados
export const correr = (fase: number): Pose => {
  const s = Math.sin(fase);
  const c = Math.cos(fase);
  return {
    y: SUELO - 118 + 6 * Math.cos(2 * fase),
    torso: 16,
    muslo: [40 * s + 8, -40 * s + 8],
    pierna: [40 * s - 30 - 50 * Math.max(0, c), -40 * s - 30 - 50 * Math.max(0, -c)],
    brazo: [-40 * s, 40 * s],
    ante: [-40 * s + 80, 40 * s + 80],
    cabeza: -6,
  };
};

export const mezclar = (a: Pose, b: Pose, u: number): Pose => ({
  y: lerp(a.y, b.y, u),
  torso: lerp(a.torso, b.torso, u),
  muslo: [lerp(a.muslo[0], b.muslo[0], u), lerp(a.muslo[1], b.muslo[1], u)],
  pierna: [lerp(a.pierna[0], b.pierna[0], u), lerp(a.pierna[1], b.pierna[1], u)],
  brazo: [lerp(a.brazo[0], b.brazo[0], u), lerp(a.brazo[1], b.brazo[1], u)],
  ante: [lerp(a.ante[0], b.ante[0], u), lerp(a.ante[1], b.ante[1], u)],
  cabeza: lerp(a.cabeza, b.cabeza, u),
});
export const con = (b: Pose, cambios: Partial<Pose>): Pose => ({ ...b, ...cambios });

// secuencia de poses: cada llave [t, pose, dur] llega a su pose en t, transicionando durante dur antes
// viva = anticipación + pasada (back in-out): el cuerpo junta envión antes y se pasa un poco al llegar
const vivo = Easing.inOut(Easing.back(1.3));
export const secuencia = (t: number, ks: [number, Pose, number?][], viva = false) => {
  let P = ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    const [ti, Pi, d = 0.4] = ks[i];
    if (t < ti - d) break;
    const u = viva ? interpolate(t, [ti - d, ti], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: vivo }) : suave(t, ti - d, ti);
    P = mezclar(P, Pi, u);
  }
  return P;
};

// giros: para darse vuelta pasa por "de frente" (giro 1), cambia de lado y vuelve al perfil
export const giros = (t: number, inicial: 1 | -1, ks: [number, 1 | -1][], dur = 0.22) => {
  let mira = inicial;
  let bump = 0;
  for (const [ti, m] of ks) {
    if (t >= ti) mira = m;
    bump = Math.max(bump, 1 - Math.abs(t - ti) / dur);
  }
  return { mira, bump: clamp(bump, 0, 1) };
};

// ---------- esqueleto ----------
export const esqueleto = (x: number, P: Pose) => {
  const cadera: [number, number] = [x, P.y];
  const cuello = p(x, P.y, 180 - P.torso, 112);
  const hombro = p(x, P.y, 180 - P.torso, 96);
  const cab = p(cuello[0], cuello[1], 180 - P.torso - P.cabeza, 36);
  const piernas = [0, 1].map((i) => {
    const rod = p(x, P.y, P.muslo[i], 62);
    const pie = p(rod[0], rod[1], P.pierna[i], 62);
    return { rod, pie };
  });
  const brazos = [0, 1].map((i) => {
    const codo = p(hombro[0], hombro[1], P.brazo[i], 50);
    const mano = p(codo[0], codo[1], P.ante[i], 48);
    return { codo, mano };
  });
  return { cadera, cuello, hombro, cab, piernas, brazos };
};

// punto del esqueleto llevado al mundo (espejo + escala alrededor de los pies)
export const alMundo = (x: number, mira: number, esc: number, pt: [number, number]): [number, number] => [
  x + (pt[0] - x) * mira * esc,
  SUELO + (pt[1] - SUELO) * esc,
];

// ---------- dibujo ----------
const Taza: React.FC<{ x: number; y: number; t: number; vapor: boolean }> = ({ x, y, t, vapor }) => (
  <g>
    {vapor &&
      [0, 1].map((i) => (
        <path
          key={i}
          d={`M${x - 3 + i * 7},${y - 18} q${5 * Math.sin(t * 2 + i)},-8 0,-16 q${-5 * Math.sin(t * 2 + i)},-8 0,-16`}
          stroke="#fff3e0"
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
          opacity={0.28 + 0.12 * Math.sin(t * 1.3 + i * 2)}
        />
      ))}
    <path d={`M${x - 11},${y - 15} L${x + 11},${y - 15} L${x + 8},${y + 2} L${x - 8},${y + 2} Z`} fill="#f2e8da" />
    <path d={`M${x + 10},${y - 11} q9,1 6,8 q-2,4 -8,3`} stroke="#f2e8da" strokeWidth={3} fill="none" />
    <rect x={x - 12} y={y - 17} width={24} height={4} rx={2} fill="#5a3420" />
  </g>
);

const Cuerpo: React.FC<{ x: number; P: Pose; look: Look; color: string; principal: boolean; cara?: Cara; taza?: number; t: number; vapor?: boolean }> = ({
  x,
  P,
  look,
  color,
  principal,
  cara,
  taza,
  t,
  vapor = false,
}) => {
  const e = esqueleto(x, P);
  const linea = { stroke: color, strokeWidth: look.ancho, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const pierna = (i: number) => {
    const { rod, pie } = e.piernas[i];
    return <path key={"p" + i} d={`M${x},${P.y} L${rod[0]},${rod[1]} L${pie[0]},${pie[1]} l9,0`} {...linea} />;
  };
  const brazo = (i: number) => {
    const { codo, mano } = e.brazos[i];
    return (
      <g key={"b" + i}>
        <path d={`M${e.hombro[0]},${e.hombro[1]} L${codo[0]},${codo[1]} L${mano[0]},${mano[1]}`} {...linea} />
        {look.guantes && <circle cx={mano[0]} cy={mano[1]} r={15} fill={principal ? look.guantes : color} />}
      </g>
    );
  };
  const inclin = -P.torso - P.cabeza;
  return (
    <g>
      {pierna(1)}
      {brazo(1)}
      <path d={`M${x},${P.y} L${e.cuello[0]},${e.cuello[1]}`} {...linea} strokeWidth={look.ancho * (look.escala && look.escala > 1.1 ? 1.5 : 1)} />
      {look.delantal && principal && (
        <path
          d={`M${e.hombro[0] + 4},${e.hombro[1] + 18} L${x + 16},${P.y + 30} L${x - 2},${P.y + 34} L${e.hombro[0] - 6},${e.hombro[1] + 20} Z`}
          fill={look.delantal}
          opacity={0.92}
        />
      )}
      {look.mono && principal && <path d={`M${e.cuello[0] - 9},${e.cuello[1] + 6} l9,5 l9,-5 l0,10 l-9,-5 l-9,5 Z`} fill={look.mono} />}
      {pierna(0)}
      <circle cx={e.cab[0]} cy={e.cab[1]} r={33} fill={color} />
      {look.rodete && <circle cx={e.cab[0] - 28} cy={e.cab[1] - 22} r={15} fill={color} />}
      {look.vincha && principal && (
        <path d={`M${e.cab[0] - 31},${e.cab[1] - 12} Q${e.cab[0]},${e.cab[1] - 22} ${e.cab[0] + 31},${e.cab[1] - 12}`} stroke={look.vincha} strokeWidth={7} fill="none" />
      )}
      {look.gorra && (
        <g transform={`translate(${e.cab[0]},${e.cab[1]}) rotate(${inclin})`}>
          <path d="M-35,-4 Q-33,-42 0,-42 Q33,-42 35,-6 Z" fill={principal ? "#7a1e1e" : color} />
          <path d="M18,-9 L50,-7 Q54,-2 48,1 L20,-1 Z" fill={principal ? "#5a1414" : color} />
        </g>
      )}
      {cara && principal && <Rostro x={e.cab[0]} y={e.cab[1]} c={cara} inclin={inclin} papel={look.papel} />}
      {brazo(0)}
      {look.papel && principal && (
        <g fill="#9c8a6c" stroke="#3a2c1c" strokeWidth={1.2}>
          {[e.hombro, e.cuello, [x, P.y] as [number, number], e.brazos[0].codo, e.piernas[0].rod].map((q, i) => (
            <circle key={i} cx={q[0]} cy={q[1]} r={look.ancho * 0.36} />
          ))}
        </g>
      )}
      {taza !== undefined && principal && <Taza x={e.brazos[taza].mano[0] + 4} y={e.brazos[taza].mano[1] - 2} t={t} vapor={vapor} />}
    </g>
  );
};

// la cara: de perfil (mirando adelante, giro 0) a de frente (giro 1)
const Rostro: React.FC<{ x: number; y: number; c: Cara; inclin: number; papel?: boolean }> = ({ x, y, c, inclin, papel }) => {
  const g = c.giro;
  const grande = c.ojos ?? 1;
  const ry = 4.2 * grande * (1 - c.parpado * 0.9);
  const ojo1 = lerp(17, -11, g);
  const ojo2 = lerp(27, 11, g);
  const bx = lerp(15, 0, g);
  const bw = lerp(9, 13, g) * (0.8 + 0.3 * c.sonrisa);
  const curvaB = 3 + 9 * c.sonrisa - 6 * (c.enojo ?? 0);
  const boca = c.boca ?? 0;
  const en = c.enojo ?? 0;
  const guino = c.guino ?? 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${inclin})`}>
      {/* ojo de adelante (el que guiña) */}
      {guino > 0.5 ? (
        <path d={`M${ojo2 - 5},${-5} q5,4 10,0`} stroke="#fff6e8" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx={ojo2} cy={-5} rx={3.6 * grande * Math.min(1, 0.35 + g)} ry={ry} fill="#fff6e8" opacity={Math.min(1, 0.3 + g * 1.6)} />
      )}
      <ellipse cx={ojo1} cy={-5} rx={3.6 * grande} ry={ry} fill="#fff6e8" opacity={1 - Math.max(0, 1 - g * 3) * 0.0} />
      {en > 0.05 && (
        <g stroke="#fff6e8" strokeWidth={2.4} strokeLinecap="round" opacity={en}>
          <path d={`M${ojo1 - 6},${-16 - 2 * en} L${ojo1 + 6},${-14 + 3 * en}`} />
          {g > 0.4 && <path d={`M${ojo2 - 6},${-14 + 3 * en} L${ojo2 + 6},${-16 - 2 * en}`} />}
        </g>
      )}
      {boca > 0.08 ? (
        <ellipse cx={bx} cy={11} rx={bw * 0.75} ry={2 + 7 * boca} fill="#fff6e8" />
      ) : papel ? null : (
        <path
          d={`M${bx - bw},${9} Q${bx},${9 + curvaB} ${bx + bw},${9 - 1.5 * c.sonrisa}`}
          stroke="#fff6e8"
          strokeWidth={3.4}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
};

// Figura completa: luces de borde (copias desplazadas en el mundo) + cuerpo principal.
export const Figura: React.FC<{
  x: number;
  P: Pose;
  mira: number;
  look: Look;
  cara?: Cara;
  bordes?: Borde[];
  taza?: number;
  vapor?: boolean;
  t?: number;
  opacidad?: number;
  rot?: number; // giro del cuerpo entero alrededor de los pies (caídas)
}> = ({ x, P, mira, look, cara, bordes = [], taza, vapor, t = 0, opacidad = 1, rot = 0 }) => {
  const esc = look.escala ?? 1;
  const tf = `rotate(${rot} ${x} ${SUELO}) translate(${x},${SUELO}) scale(${mira * esc},${esc}) translate(${-x},${-SUELO})`;
  return (
    <g opacity={opacidad}>
      {bordes.map((b, i) =>
        b.op > 0.01 ? (
          <g key={i} transform={`translate(${b.dx},${b.dy})`} opacity={b.op}>
            <g transform={tf}>
              <Cuerpo x={x} P={P} look={look} color={b.color} principal={false} t={t} />
            </g>
          </g>
        ) : null,
      )}
      <g transform={tf}>
        <Cuerpo x={x} P={P} look={look} color={look.color} principal cara={cara} taza={taza} t={t} vapor={vapor} />
      </g>
    </g>
  );
};
