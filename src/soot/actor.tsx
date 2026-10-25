import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, F, SUELO, andar, clamp, lerp, recorrido, suave } from "./lib";
import { Borde, Cara, Figura, Look, PARADO, Pose, caminar, con, correr, giros, mezclar, secuencia } from "./rig";
import { CANTO, Foto, Lam, PISOS, PisoCapas, Sombra, fondo, suelo } from "./kit";

// ---------- poses de la legión (índice 0 = brazo/pierna de adelante) ----------
export const QUIETO: Pose = con(PARADO, { brazo: [8, -6], ante: [14, 4] });
export const FIRME: Pose = con(PARADO, { brazo: [2, -2], ante: [4, 2], torso: -2, cabeza: -2 });
export const JURA: Pose = con(PARADO, { brazo: [150, -4], ante: [168, 4], torso: -4, cabeza: -6 }); // brazo derecho al frente y arriba
export const FIRMA: Pose = con(PARADO, { brazo: [46, 8], ante: [104, 30], torso: 14, cabeza: 14 });
export const SEÑALA: Pose = con(PARADO, { brazo: [92, -4], ante: [94, 4], torso: -2 });
export const MANOS_CADERA: Pose = con(PARADO, { brazo: [38, 38], ante: [-60, -60], torso: -3, cabeza: -3 });
export const TRISTE: Pose = con(PARADO, { brazo: [2, -2], ante: [6, 4], torso: 9, cabeza: 22 });
export const AGOTADO: Pose = con(PARADO, { y: SUELO - 118, torso: 26, cabeza: 18, brazo: [28, 18], ante: [40, 30], muslo: [14, -6], pierna: [-4, -10] });
export const ESCUDO_FRENTE: Pose = con(PARADO, { brazo: [26, 44], ante: [86, 64], torso: 6 });
export const ALZA_ARMA: Pose = con(PARADO, { brazo: [168, 30], ante: [205, 60], torso: -8, cabeza: -6 }); // carga el golpe sobre la cabeza
export const GOLPE: Pose = con(PARADO, { brazo: [88, 30], ante: [82, 60], torso: 16, muslo: [24, -14], pierna: [10, -20] });
export const GOLPE_BAJO: Pose = con(PARADO, { brazo: [64, 30], ante: [40, 60], torso: 28, cabeza: 10, muslo: [30, -16], pierna: [12, -22], y: SUELO - 118 });
export const ESTOCADA: Pose = con(PARADO, { brazo: [86, 44], ante: [92, 70], torso: 14, muslo: [30, -16], pierna: [14, -24], y: SUELO - 120 });
export const LANZA_CARGA: Pose = con(PARADO, { brazo: [196, 20], ante: [214, 40], torso: -14, muslo: [-8, 14], pierna: [-14, 8] });
export const LANZA_SUELTA: Pose = con(PARADO, { brazo: [118, 30], ante: [104, 40], torso: 18, muslo: [26, -16], pierna: [8, -24] });
export const CAVA_A: Pose = con(PARADO, { brazo: [70, 50], ante: [130, 110], torso: 34, cabeza: 14, muslo: [26, -10], pierna: [-6, -16], y: SUELO - 116 });
export const CAVA_B: Pose = con(PARADO, { brazo: [130, 110], ante: [170, 150], torso: 4, cabeza: -4 });
export const CARGA_HOMBRO: Pose = con(PARADO, { brazo: [160, -4], ante: [206, 4], torso: 8, cabeza: 2 }); // la furca sobre el hombro
export const SENTADO_SUELO: Pose = { y: SUELO - 44, torso: 6, muslo: [92, 82], pierna: [4, -2], brazo: [24, 14], ante: [70, 50], cabeza: 8 };
export const RODILLA: Pose = { y: SUELO - 84, torso: 10, muslo: [86, -20], pierna: [-2, -94], brazo: [20, 14], ante: [40, 30], cabeza: 14 };
export const CUBRE: Pose = con(PARADO, { brazo: [150, 140], ante: [210, 200], torso: 18, cabeza: 24, y: SUELO - 120 }); // se cubre la cabeza
export const BEBE: Pose = con(PARADO, { brazo: [40, -4], ante: [176, 4], torso: -6, cabeza: -16 });
export const ABRAZO: Pose = con(PARADO, { brazo: [78, 70], ante: [120, 112], torso: 6 });
export const NADA_A: Pose = { y: SUELO - 70, torso: 74, muslo: [76, 100], pierna: [80, 110], brazo: [150, 40], ante: [160, 60], cabeza: -56 };
export const NADA_B: Pose = { y: SUELO - 70, torso: 74, muslo: [100, 78], pierna: [110, 82], brazo: [40, 150], ante: [60, 160], cabeza: -56 };
export const DORMIDO: Pose = { y: SUELO - 40, torso: 8, muslo: [90, 84], pierna: [0, -4], brazo: [30, 20], ante: [60, 40], cabeza: 34 };
export const LEE: Pose = con(PARADO, { brazo: [52, 48], ante: [130, 124], torso: 6, cabeza: 18 });
export const PALOS: Pose = con(PARADO, { brazo: [150, 30], ante: [190, 60], torso: -6 });
export { PARADO, caminar, correr, con, mezclar, secuencia };

// ---------- un actor: recorrido + poses + giros + parpadeo; camina solo cuando se mueve ----------
export type Actor = {
  look: Look;
  ruta: [number, number][]; // [t, x]
  poses?: [number, Pose, number?][];
  mira?: 1 | -1;
  vueltas?: [number, 1 | -1][];
  cara?: (t: number) => Partial<Cara>;
  rot?: (t: number) => number;
  op?: (t: number) => number;
  dy?: (t: number) => number;
  vel?: number;
  corre?: boolean;
  seed?: number;
  sinSombra?: boolean;
  sombraOp?: number;
  bordes?: Borde[];
  lenta?: boolean; // marcha pesada (paso corto)
};
export const ponerActor = (t: number, a: Actor) => {
  const mov = andar(t, a.ruta, a.vel ?? 240);
  const base = a.poses ? secuencia(t, a.poses, true) : QUIETO;
  const s = a.seed ?? 1;
  const resp = Math.sin(t * 1.6 + s * 1.7);
  const vivo = con(base, { torso: base.torso + resp * 1.1, cabeza: base.cabeza + Math.sin(t * 0.9 + s) * 1.6 });
  const paso = a.corre ? correr(mov.dist / 55) : caminar(mov.dist / (a.lenta ? 58 : 70), Math.min(1, mov.amp));
  const P = mezclar(vivo, paso, clamp(mov.amp * 3, 0, 1));
  // hacia dónde mira: la dirección de la marcha (si se mueve) o el último giro pedido
  let dir: 1 | -1 = a.mira ?? 1;
  for (let i = 1; i < a.ruta.length; i++) {
    const [t0, x0] = a.ruta[i - 1];
    const [, x1] = a.ruta[i];
    if (t >= t0 - 0.1 && x1 !== x0) dir = x1 > x0 ? 1 : -1;
  }
  const g = a.vueltas ? giros(t, a.mira ?? 1, a.vueltas) : { mira: dir, bump: 0 };
  const mira = a.vueltas ? g.mira : dir;
  const ciclo = ((t + s * 1.37) % 3.9) / 3.9;
  const parp = ciclo > 0.965 ? 1 : 0;
  const extra = a.cara ? a.cara(t) : {};
  const cara: Cara = { giro: 0.6 + g.bump * 0.4, sonrisa: 0.1, parpado: parp, boca: 0.12, ...extra };
  if (parp) cara.parpado = 1;
  return { x: mov.x, P, mira, cara, rot: a.rot ? a.rot(t) : 0, op: a.op ? a.op(t) : 1, dy: a.dy ? a.dy(t) : 0 };
};
export const Act: React.FC<{ t: number; a: Actor; D?: number }> = ({ t, a, D = F }) => {
  const s = ponerActor(t, a);
  if (s.op <= 0.01) return null;
  return (
    <g transform={`translate(0,${suelo(D) - SUELO + s.dy})`} opacity={s.op}>
      {!a.sinSombra && <Sombra x={s.x} op={(a.sombraOp ?? 0.4) * clamp(1 - Math.abs(s.dy) / 120, 0, 1)} />}
      <Figura x={s.x} P={s.P} mira={s.mira} look={a.look} t={t} cara={s.cara} rot={s.rot} bordes={a.bordes ?? CANTO} />
    </g>
  );
};
export const Elenco: React.FC<{ t: number; actores: Actor[]; D?: number }> = ({ t, actores, D }) => (
  <>
    {actores.map((a, i) => (
      <Act key={i} t={t} a={a} D={D} />
    ))}
  </>
);

// ---------- cámara de escena: llaves [t, cx, cy, cz] + foco + apertura ----------
export const camara = (t: number, ks: [number, number, number, number][], ap = 7, foco = F): Cam => ({ ...recorrido(t, ks), foco, ap });
// sacudón de un golpe: se apaga rápido
export const sacudon = (t: number, t0: number, fuerza = 7) => {
  const u = t - t0;
  return u > 0 ? Math.exp(-u * 9) * Math.sin(u * 60) * fuerza : 0;
};

// ---------- el escenario estándar: fondo agnes atrás + tiras de piso + lo que se le ponga delante ----------
export const Escenario: React.FC<{
  cam: Cam;
  f: string;
  piso: keyof typeof PISOS;
  e?: number;
  fy?: number;
  fx?: number;
  filtro?: string;
  bg?: string;
  children?: React.ReactNode;
  extraFotos?: Foto[];
}> = ({ cam, f, piso, e = 0.8, fy = -40, fx = 0, filtro = "", bg = "#20140c", children, extraFotos = [] }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    <Lam D={1400} cam={cam} fotos={[fondo(f, e, fx, fy), ...extraFotos]} filtro={filtro} />
    <PisoCapas cam={cam} piso={PISOS[piso]} />
    {children}
  </AbsoluteFill>
);

// fundido a negro/papel entre escenas (corto, sólo donde la voz respira)
export const fundido = (t: number, t0: number, t1: number, d = 0.25) => Math.min(suave(t, t0, t0 + d), 1 - suave(t, t1 - d, t1));
export const tri = (t: number, a: number, b: number, c: number, d: number) => Math.min(suave(t, a, b), 1 - suave(t, c, d));
export { lerp, clamp, suave };
