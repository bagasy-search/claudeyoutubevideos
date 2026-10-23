import React from "react";
import { AbsoluteFill } from "remotion";
import { Capa, Cam, F, SUELO, at, andar, clamp, curva, lerp, recorrido, rnd, seco, suave } from "./lib";
import { Borde, Figura, Look, PARADO, Pose, SENTADO, alMundo, caminar, con, correr, esqueleto, giros, mezclar, secuencia } from "./rig";

// ---------- plano del local (coordenadas del plano de los personajes, D = F) ----------
const PUERTA = 1080; // bisagra; el vano va de 980 a 1080 y la pared de adelante tapa desde 1080
const BARRA = [150, 720] as const;
const MESA = -560;
const SILLA = -400;
const SILLA2 = -720;
const MARTA_X = 520;
const MOSTRADOR_E = 270;
const MATON_X = -225;
const FOTO = { x: 250, y: -60 }; // en la pared del fondo (D = 1400)

export const ERNESTO: Look = { color: "#141318", ancho: 10 };
const MARTA: Look = { color: "#16131a", ancho: 9.5, rodete: true, delantal: "#e9dccb" };
const MATON: Look = { color: "#100f12", ancho: 13, escala: 1.2, gorra: true };
const CLIENTE: Look = { color: "#1a1620", ancho: 10 };

// ---------- tiempos atados a la voz ----------
export const T = (() => {
  const empuja = at("empujaba la puerta");
  const cortado = at("un cortado");
  const sentaba = at("se sentaba junto");
  const ciudad = at("apagaba la ciudad");
  const peroTarde = at("pero esa tarde");
  const entro = at("entro alguien");
  const grande = at("un tipo grande");
  const mire = at("todo el mundo");
  const patea = at("pateo la silla");
  const tira = at("tiro el cafe encima");
  const rie = at("se rio");
  const limpia = at("se limpio la mano");
  const pie = at("se puso de pie");
  const noSabia = at("lo que ese tipo");
  const campeon = at("campeon sudamericano");
  const grandote = at("el grandote tiro");
  const golpe = at("primer golpe");
  const siquiera = at("ni siquiera");
  const basto = at("basto un segundo");
  const salio = at("el tipo salio");
  const levanta = at("levanto la silla");
  const seSento = at("se sento");
  const trajo = at("marta le trajo");
  const casa = at("invitacion de la casa");
  return { empuja, cortado, sentaba, ciudad, peroTarde, entro, grande, mire, patea, tira, rie, limpia, pie, noSabia, campeon, grandote, golpe, siquiera, basto, salio, levanta, seSento, trajo, casa };
})();

// ---------- cámara del local ----------
export const camCafe = (t: number): Cam => {
  const antes = t < 40;
  const r = antes
    ? recorrido(t, [
        [7.6, 900, 20, 140],
        [9.9, 520, 30, 280],
        [12.4, 480, 30, 360],
        [13.3, 360, 30, 320],
        [15.8, -330, 40, 260],
        [T.ciudad - 0.2, -560, 20, 390],
        [T.peroTarde + 0.3, -300, 25, 260],
        [T.entro + 0.4, 880, 40, 220],
        [T.grande + 0.6, 640, 95, 320],
        [T.mire + 0.3, 330, 70, 300],
        [T.patea, -330, 60, 380],
        [T.rie + 0.3, -340, 55, 400],
        [T.limpia + 1.6, -420, 70, 560],
        [T.pie + 0.4, -360, 20, 470],
        [T.noSabia + 1.0, -100, -20, 520],
        [T.campeon + 0.4, 350, -84, 1250],
      ])
    : recorrido(t, [
        [42.6, -335, 45, 400],
        [T.golpe, -330, 40, 430],
        [T.siquiera + 0.8, -340, 40, 470],
        [T.basto - 0.1, -335, 30, 470],
        [T.salio + 0.1, -250, 30, 430],
        [T.salio + 1.9, 700, 40, 260],
        [T.salio + 3.0, 620, 40, 260],
        [T.levanta + 0.2, -420, 50, 330],
        [T.trajo - 0.3, -560, 50, 360],
        [T.casa, -600, 55, 420],
        [62.5, -610, 60, 480],
      ]);
  // "Bastó un segundo": zoom seco hacia el golpe y vuelve despacio
  const golpeZoom = 140 * seco(t, T.basto - 0.05, T.basto + 0.15) * (1 - suave(t, T.basto + 0.9, T.basto + 1.8));
  const foco = antes
    ? curva(t, [
        [7.6, F],
        [T.ciudad - 0.9, F],
        [T.ciudad - 0.1, 1400],
        [T.peroTarde - 0.1, 1400],
        [T.peroTarde + 0.5, F],
        [T.noSabia + 0.9, F],
        [T.campeon - 0.6, 1400],
      ])
    : F;
  const ap = antes
    ? curva(t, [
        [7.6, 9],
        [12, 10],
        [T.ciudad, 14],
        [T.peroTarde + 1, 9],
        [T.limpia, 12],
        [T.limpia + 2, 16],
        [T.pie + 1, 12],
        [T.campeon, 14],
      ])
    : curva(t, [
        [42.6, 11],
        [T.basto, 13],
        [T.basto + 1, 15],
        [T.salio + 1, 9],
        [T.trajo, 12],
        [62.5, 15],
      ]);
  return { cx: r.cx, cy: r.cy, cz: r.cz + golpeZoom, foco, ap };
};

// ---------- personajes ----------
const fase = (dist: number, paso = 210) => (2 * Math.PI * dist) / paso;

// silla: inclinación por la patada y caída cuando se para de golpe
const sillaEstado = (t: number) => {
  const sacudon = Math.sin(clamp((t - T.patea - 0.12) / 0.35, 0, 1) * Math.PI) * (1 - clamp((t - T.patea - 0.12) / 0.6, 0, 1));
  const dx = 18 * sacudon;
  const cae = seco(t, T.pie + 0.25, T.pie + 0.6);
  const rebote = Math.sin(clamp((t - T.pie - 0.6) / 0.3, 0, 1) * Math.PI) * 6;
  const levanta = suave(t, T.levanta + 0.3, T.levanta + 1.0);
  const rot = (-90 * cae + rebote * (cae > 0.99 ? 1 : 0)) * (1 - levanta);
  return { dx, rot };
};

export const ernesto = (t: number) => {
  const mov = andar(
    t,
    [
      [7.6, 1100],
      [10.0, MOSTRADOR_E],
      [13.1, MOSTRADOR_E],
      [16.0, SILLA],
    ],
    280,
  );
  const silla = sillaEstado(t);
  const x = mov.x + (t > 16 && t < T.pie ? silla.dx : 0);
  const { mira, bump } = giros(t, -1, [
    [10.05, 1],
    [13.0, -1],
    [T.pie + 0.15, 1],
    [T.levanta - 0.05, -1],
  ]);
  const APOYA: Pose = con(SENTADO, { brazo: [62, 14], ante: [78, 64], torso: 6 });
  const SORBO: Pose = con(SENTADO, { brazo: [22, 14], ante: [168, 64] });
  const TAZA_ABAJO: Pose = con(SENTADO, { brazo: [26, 14], ante: [110, 64] });
  const MANOTAZO: Pose = con(SENTADO, { brazo: [40, 14], ante: [50, 64], torso: -14, cabeza: -10 });
  const LIMPIA: Pose = con(SENTADO, { brazo: [26, 34], ante: [88 + 8 * Math.sin(t * 5), 100 - 8 * Math.sin(t * 5)], torso: 4, cabeza: 14 });
  const ESQUIVA: Pose = con(PARADO, { torso: 34, cabeza: 18, muslo: [62, 30], pierna: [-38, -34], y: SUELO - 92, brazo: [40, 30], ante: [150, 140] });
  const JAB: Pose = con(PARADO, { brazo: [137, -3], ante: [137, 2], torso: 6, muslo: [10, -8], pierna: [4, -10], y: SUELO - 122 });
  const AGACHA: Pose = con(PARADO, { torso: 46, muslo: [40, 30], pierna: [-20, -24], y: SUELO - 104, brazo: [70, 64], ante: [70, 64], cabeza: 10 });
  const MOSTRADOR: Pose = con(PARADO, { brazo: [30, -3], ante: [90, 2] });
  const LLEVA: Pose = con(PARADO, { brazo: [24, -3], ante: [96, 2] });
  let P = secuencia(t, [
    [0, PARADO],
    [10.2, MOSTRADOR, 0.4],
    [11.3, PARADO, 0.5],
    [12.95, MOSTRADOR, 0.3],
    [13.2, LLEVA, 0.25],
    [16.6, SENTADO, 0.6],
    [16.9, APOYA, 0.3],
    [17.3, SENTADO, 0.4],
    [T.mire + 0.5, APOYA, 0.5],
    [T.mire + 1.1, SORBO, 0.5],
    [T.patea + 0.6, TAZA_ABAJO, 0.4],
    [T.tira + 0.05, MANOTAZO, 0.08],
    [T.tira + 0.9, SENTADO, 0.6],
    [T.limpia + 0.3, LIMPIA, 0.6],
    [T.pie - 0.1, SENTADO, 0.4],
    [T.pie + 0.6, PARADO, 0.6],
    [T.golpe + 0.05, ESQUIVA, 0.15],
    [T.golpe + 0.6, PARADO, 0.4],
    [T.basto + 0.05, JAB, 0.1],
    [T.basto + 1.2, JAB, 0.1],
    [T.basto + 1.7, PARADO, 0.4],
    [T.levanta + 0.25, AGACHA, 0.35],
    [T.levanta + 1.0, PARADO, 0.5],
    [T.seSento + 0.3, SENTADO, 0.6],
  ]);
  // caminar se mezcla encima según cuánto se mueve; con la taza en la mano el brazo de adelante no balancea
  if (mov.amp > 0.01) {
    const W = caminar(fase(mov.dist), 1);
    const lleva = t > 12.95 && t < 16.7;
    P = mezclar(P, lleva ? { ...W, brazo: [24, W.brazo[1]], ante: [96, W.ante[1]] } : W, clamp(mov.amp, 0, 1));
  }
  // el sacudón de la patada
  const jolt = Math.sin(clamp((t - T.patea - 0.12) / 0.3, 0, 1) * Math.PI);
  P = { ...P, torso: P.torso - 10 * jolt, cabeza: P.cabeza - 8 * jolt };
  // respiración
  P = { ...P, torso: P.torso + Math.sin(t * 2.1) * 0.8 };
  const enojo = suave(t, T.limpia, T.pie) * (1 - suave(t, T.salio, T.salio + 1));
  const cara = {
    giro: clamp(bump + 0.55 * suave(t, 10.1, 10.4) * (1 - suave(t, 12.9, 13.1)) + suave(t, T.casa + 0.3, T.casa + 0.9), 0, 1),
    sonrisa: t < T.patea ? 0.5 : t < T.salio + 1.5 ? 0.05 : lerp(0.3, 1, suave(t, T.trajo, T.casa)),
    parpado: Math.max(0, ...[9.1, 14.6, 19.2, T.limpia + 1.4, T.siquiera + 0.6, 55.0, 60.8].map((b) => 1 - Math.abs(t - b) / 0.08)),
    enojo: enojo * 0.7,
    boca: t > 10.3 && t < 11.3 ? 0.25 + 0.2 * Math.sin(t * 22) : 0,
  };
  const taza = (t > 12.95 && t < 16.75) || (t > T.mire + 0.7 && t < T.tira + 0.05) ? 0 : undefined;
  return { x, P, mira, cara, taza };
};

const marta = (t: number) => {
  const mov = andar(
    t,
    [
      [0, MARTA_X],
      [11.55, MARTA_X],
      [11.85, 650],
      [12.35, 650],
      [12.65, 440],
      [13.6, 440],
      [14.6, MARTA_X],
      [T.salio + 1.4, MARTA_X],
      [T.salio + 1.8, 650],
      [T.salio + 2.4, 650],
      [T.trajo + 0.8, -905],
    ],
    260,
  );
  const { mira, bump } = giros(t, -1, [
    [11.6, 1],
    [12.4, -1],
    [T.salio + 1.45, 1],
    [T.salio + 2.45, -1],
    [T.trajo + 0.85, 1],
  ]);
  const SALUDO: Pose = con(PARADO, { brazo: [-3, 150], ante: [2, 170 + 20 * Math.sin(t * 9)] });
  const HACE: Pose = con(PARADO, { brazo: [40, -3], ante: [80, 2] });
  const DEJA: Pose = con(PARADO, { brazo: [60, -3], ante: [80, 2], torso: 8 });
  const LLEVA: Pose = con(PARADO, { brazo: [24, -3], ante: [96, 2] });
  let P = secuencia(t, [
    [0, PARADO],
    [8.75, SALUDO, 0.35],
    [9.7, PARADO, 0.4],
    [12.0, HACE, 0.3],
    [12.35, LLEVA, 0.2],
    [12.7, DEJA, 0.25],
    [13.0, PARADO, 0.4],
    [T.salio + 2.0, HACE, 0.3],
    [T.salio + 2.4, LLEVA, 0.2],
    [T.trajo + 1.1, DEJA, 0.3],
    [T.trajo + 1.6, PARADO, 0.5],
  ]);
  if (mov.amp > 0.01) {
    const W = caminar(fase(mov.dist), 1);
    const lleva = (t > 12.35 && t < 12.7) || (t > T.salio + 2.4 && t < T.trajo + 1.0);
    P = mezclar(P, lleva ? { ...W, brazo: [24, W.brazo[1]], ante: [96, W.ante[1]] } : W, clamp(mov.amp, 0, 1));
  }
  const cara = {
    giro: clamp(bump + 0.45 * suave(t, T.mire + 0.2, T.mire + 0.6) * (1 - suave(t, T.salio + 1, T.salio + 1.4)) + suave(t, T.casa, T.casa + 0.4), 0, 1),
    sonrisa: t > T.patea && t < T.salio + 1 ? 0.0 : 0.85,
    parpado: Math.max(0, ...[10.6, 16.3, 27.9, 45.2].map((b) => 1 - Math.abs(t - b) / 0.08)),
    guino: t > T.casa + 0.5 && t < T.casa + 1.1 ? 1 : 0,
    enojo: suave(t, T.tira, T.tira + 0.5) * (1 - suave(t, T.salio, T.salio + 1)) * 0.5,
  };
  const taza = (t > 12.35 && t < 12.75) || (t > T.salio + 2.4 && t < T.trajo + 1.15) ? 0 : undefined;
  return { x: mov.x, P, mira, cara, taza };
};

const maton = (t: number) => {
  const huye = t > T.salio + 0.15;
  const mov = andar(
    t,
    [
      [T.entro, 1150],
      [T.grande + 1.3, 380],
      [T.mire - 0.2, 380],
      [T.patea - 0.15, MATON_X],
      [T.salio + 0.15, MATON_X],
      [T.salio + 2.2, 1250],
    ],
    300,
  );
  const { mira, bump } = giros(t, -1, [[T.salio + 0.05, 1]]);
  const PECHO: Pose = con(PARADO, { torso: -7, brazo: [32, 30], ante: [-34, -30], cabeza: -6 });
  const PATADA: Pose = con(PARADO, { muslo: [40, -6], pierna: [50, -8], torso: -10, y: SUELO - 126 });
  const ARRIBA: Pose = con(PECHO, { brazo: [140, 30], ante: [150, -30], torso: 12 });
  const MANOTAZO: Pose = con(PECHO, { brazo: [60, 30], ante: [60, -30], torso: 30 });
  const RISA: Pose = con(PARADO, { torso: -16 + 4 * Math.sin(t * 16), brazo: [28, 34], ante: [-30, -36], cabeza: -12 + 3 * Math.sin(t * 16) });
  const CARGA: Pose = con(PECHO, { brazo: [20, -50], ante: [-10, -20], torso: -12 });
  const GOLPE: Pose = con(PECHO, { brazo: [20, 88], ante: [-10, 88], torso: 16 });
  const MIEDO: Pose = con(PARADO, { torso: -14, brazo: [40, 30], ante: [120, 110], cabeza: -10 });
  let P = secuencia(t, [
    [0, PARADO],
    [T.grande + 1.6, PECHO, 0.4],
    [T.patea + 0.18, PATADA, 0.12],
    [T.patea + 0.6, PECHO, 0.3],
    [T.tira - 0.3, ARRIBA, 0.3],
    [T.tira + 0.05, MANOTAZO, 0.1],
    [T.tira + 0.6, PECHO, 0.4],
    [T.rie + 0.1, RISA, 0.3],
    [T.limpia + 0.6, PECHO, 0.5],
    [T.golpe - 0.35, CARGA, 0.45],
    [T.golpe + 0.08, GOLPE, 0.12],
    [T.golpe + 0.7, PECHO, 0.4],
    [T.basto + 0.08, MIEDO, 0.12],
  ]);
  if (mov.amp > 0.01) {
    const W = huye ? correr(fase(mov.dist, 330)) : { ...caminar(fase(mov.dist), 1), torso: -6 };
    P = mezclar(P, W, clamp(mov.amp, 0, 1));
  }
  P = { ...P, torso: P.torso + Math.sin(t * 1.9) * 1 };
  const cara = {
    giro: clamp(bump + 0.6 * suave(t, T.mire - 0.1, T.mire + 0.3) * (1 - suave(t, T.mire + 1.0, T.mire + 1.4)) + 0.5 * suave(t, T.rie, T.rie + 0.2) * (1 - suave(t, T.limpia, T.limpia + 0.4)), 0, 1),
    sonrisa: t < T.basto ? 0.6 : 0,
    parpado: Math.max(0, ...[21.4, 31.2, 40].map((b) => 1 - Math.abs(t - b) / 0.08)),
    enojo: t < T.basto ? 0.8 : 0,
    boca: t > T.rie && t < T.limpia ? 0.5 + 0.35 * Math.sin(t * 24) : t > T.basto + 0.05 ? 0.6 : 0,
    ojos: t > T.basto + 0.05 ? 1.5 : 1,
  };
  const visible = t > T.entro - 0.3 && t < T.salio + 2.6;
  return { x: mov.x, P, mira, cara, visible };
};

// ---------- utilería ----------
const Silla: React.FC<{ x: number; lado: 1 | -1; rot?: number; color: string }> = ({ x, lado, rot = 0, color }) => {
  const pivote = x - 34 * lado;
  return (
    <g transform={`rotate(${rot * lado} ${pivote} ${SUELO})`} stroke={color} strokeWidth={9} strokeLinecap="round" fill="none">
      <path d={`M${x - 42},228 L${x + 42},228`} />
      <path d={`M${x - 34},232 L${x - 36},300 M${x + 34},232 L${x + 36},300`} />
      <path d={`M${x + 44 * lado},228 L${x + 50 * lado},146`} />
      <path d={`M${x + 46 * lado},170 L${x + 48 * lado},186`} strokeWidth={14} />
    </g>
  );
};

const Mesa: React.FC<{ x: number; color: string }> = ({ x, color }) => (
  <g>
    <rect x={x - 85} y={186} width={170} height={10} rx={4} fill={color} />
    <path d={`M${x},196 L${x},292 M${x - 40},300 L${x + 40},300`} stroke={color} strokeWidth={8} strokeLinecap="round" />
  </g>
);

const TazaSuelta: React.FC<{ x: number; y: number; rot?: number; vapor?: boolean; t: number }> = ({ x, y, rot = 0, vapor, t }) => (
  <g transform={`rotate(${rot} ${x} ${y - 6})`}>
    {vapor &&
      [0, 1].map((i) => (
        <path
          key={i}
          d={`M${x - 3 + i * 7},${y - 18} q${5 * Math.sin(t * 2 + i)},-8 0,-16 q${-5 * Math.sin(t * 2 + i)},-8 0,-16`}
          stroke="#fff3e0"
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
          opacity={0.3}
        />
      ))}
    <path d={`M${x - 11},${y - 15} L${x + 11},${y - 15} L${x + 8},${y + 2} L${x - 8},${y + 2} Z`} fill="#f2e8da" />
    <path d={`M${x + 10},${y - 11} q9,1 6,8 q-2,4 -8,3`} stroke="#f2e8da" strokeWidth={3} fill="none" />
    <rect x={x - 12} y={y - 17} width={24} height={4} rx={2} fill="#5a3420" />
  </g>
);

// ---------- escena ----------
export const Cafe: React.FC<{ t: number }> = ({ t }) => {
  const cam = camCafe(t);
  const E = ernesto(t);
  const M = marta(t);
  const B = maton(t);
  const silla = sillaEstado(t);

  // luz de la ventana: el atardecer se va apagando
  const sol = 1 - 0.75 * suave(t, 14, 34);
  const noche = suave(t, 12, 40);
  const lamparas = 0.75 + 0.25 * suave(t, 14, 30);

  const bordes = (fuerza = 1): Borde[] => [
    { dx: 0, dy: -2.6, color: "#ffc47a", op: 0.85 * lamparas * fuerza },
    { dx: -2.6, dy: -0.6, color: "#ff9a7a", op: 0.8 * sol * fuerza },
  ];

  // puerta: se abre cuando entra Ernesto, cuando entra el matón y cuando huye
  const abre = Math.max(
    suave(t, 7.4, 7.8) * (1 - suave(t, 8.6, 9.2)),
    suave(t, T.entro - 0.6, T.entro - 0.2) * (1 - suave(t, T.entro + 0.8, T.entro + 1.4)),
    suave(t, T.salio + 1.3, T.salio + 1.6) * (1 - suave(t, T.salio + 2.6, T.salio + 3.4)),
  );
  const campana = [7.5, T.entro - 0.5, T.salio + 1.35].reduce((acc, b) => {
    const d = t - b;
    return d > 0 ? acc + 22 * Math.exp(-d * 2.4) * Math.sin(d * 16) : acc;
  }, 0);

  // taza volando + gotas
  const t0 = T.tira + 0.05;
  const sale = (() => {
    const e = ernesto(t0);
    const sk = esqueleto(e.x, e.P);
    return alMundo(e.x, e.mira, 1, sk.brazos[0].mano);
  })();
  const dt = t - t0;
  const gTaza = 1600;
  const tazaVuela = (() => {
    if (dt < 0) return null;
    const vx = -380;
    const vy = -420;
    const tPiso = (-vy + Math.sqrt(vy * vy + 2 * gTaza * (SUELO - 4 - sale[1]))) / gTaza;
    const tt = Math.min(dt, tPiso);
    return { x: sale[0] + vx * tt, y: sale[1] + vy * tt + 0.5 * gTaza * tt * tt, rot: -700 * tt, rota: dt >= tPiso, tPiso };
  })();
  const r = rnd(5);
  const gotas = Array.from({ length: 30 }, () => ({ vx: -150 - r() * 520, vy: -520 + r() * 420, s: 2.5 + r() * 4 }));

  // mostrador / mesa: tazas apoyadas
  const tazaBarra = t > 12.75 && t < 12.95;
  const tazaMesa = t > 16.75 && t < T.mire + 0.7;
  const tazaMesa2 = t > T.trajo + 1.15;

  // posición del matón, la ruptura y la sombra
  const vidrioAfuera = `rgb(${lerp(255, 70, noche)},${lerp(170, 60, noche)},${lerp(120, 110, noche)})`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#120c0a" }}>
      {/* pared del fondo con ventana, pizarra y fotos */}
      <Capa D={1400} cam={cam}>
        <defs>
          <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1812" />
            <stop offset="0.5" stopColor="#5a3424" />
            <stop offset="1" stopColor="#3a2219" />
          </linearGradient>
          <linearGradient id="afuera" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgb(${lerp(70, 22, noche)},${lerp(60, 26, noche)},${lerp(130, 70, noche)})`} />
            <stop offset="0.55" stopColor={vidrioAfuera} />
            <stop offset="1" stopColor={`rgb(${lerp(255, 120, noche)},${lerp(205, 90, noche)},${lerp(140, 110, noche)})`} />
          </linearGradient>
          <clipPath id="vano">
            <rect x={-1150} y={-330} width={700} height={430} rx={6} />
          </clipPath>
        </defs>
        <rect x={-4000} y={-1400} width={8000} height={2200} fill="url(#pared)" />
        {/* ladrillos suaves */}
        {Array.from({ length: 40 }, (_, i) => (
          <line key={i} x1={-4000} x2={4000} y1={-700 + i * 34} y2={-700 + i * 34} stroke="#24140f" strokeWidth={2} opacity={0.35} />
        ))}
        {/* ventana con la ciudad */}
        <g clipPath="url(#vano)">
          <rect x={-1200} y={-400} width={800} height={560} fill="url(#afuera)" />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={-1180 + i * 55} y={40 - ((i * 37) % 90)} width={48} height={200} fill={`rgb(${lerp(110, 30, noche)},${lerp(80, 26, noche)},${lerp(120, 60, noche)})`} />
          ))}
          {Array.from({ length: 40 }, (_, i) => {
            const on = suave(t, 14 + (i % 13) * 0.5, 14.6 + (i % 13) * 0.5);
            return <circle key={i} cx={-1170 + ((i * 97) % 690)} cy={70 - ((i * 53) % 120)} r={3} fill="#ffd9a0" opacity={on} />;
          })}
        </g>
        <rect x={-1150} y={-330} width={700} height={430} rx={6} fill="none" stroke="#1c110c" strokeWidth={16} />
        <path d="M-800,-330 L-800,100 M-1150,-115 L-450,-115" stroke="#1c110c" strokeWidth={10} />
        <rect x={-1170} y={100} width={740} height={16} fill="#1c110c" />
        {/* pizarra */}
        <rect x={500} y={-330} width={330} height={210} rx={6} fill="#1d221e" stroke="#3a2418" strokeWidth={10} />
        {["CAFÉ  ·  $900", "CORTADO  ·  $1000", "MEDIALUNAS  ·  $500"].map((s, i) => (
          <text key={i} x={525} y={-280 + i * 52} fill="#e8e4d8" fontFamily="Caveat" fontSize={34} opacity={0.85}>
            {s}
          </text>
        ))}
        {/* fotos: la del boxeador es la que importa */}
        <g>
          <rect x={FOTO.x - 62} y={FOTO.y - 82} width={124} height={164} fill="#2a1a10" />
          <rect x={FOTO.x - 52} y={FOTO.y - 72} width={104} height={144} fill="#c9a77a" />
          <g transform={`translate(${FOTO.x},${FOTO.y + 50}) scale(0.32)`}>
            <path d="M0,-120 L0,-232 M0,-120 L-28,-62 L-30,0 M0,-120 L26,-62 L32,0 M0,-216 L-40,-250 L-48,-300 M0,-216 L40,-180 L56,-210" stroke="#3a2416" strokeWidth={12} strokeLinecap="round" fill="none" />
            <circle cx={0} cy={-268} r={33} fill="#3a2416" />
            <circle cx={-48} cy={-300} r={17} fill="#8a2a20" />
            <circle cx={56} cy={-210} r={17} fill="#8a2a20" />
          </g>
          <rect x={FOTO.x - 52} y={FOTO.y + 50} width={104} height={22} fill="#3a2416" opacity={0.25} />
        </g>
        <rect x={FOTO.x + 100} y={-120} width={90} height={70} fill="#2a1a10" />
        <rect x={FOTO.x + 108} y={-112} width={74} height={54} fill="#7a8a90" opacity={0.7} />
        <rect x={FOTO.x - 190} y={-150} width={80} height={100} fill="#2a1a10" />
        <rect x={FOTO.x - 182} y={-142} width={64} height={84} fill="#a07a60" opacity={0.7} />
      </Capa>

      {/* rayos de la ventana atravesando el local */}
      <Capa D={1250} cam={cam} mezcla="screen" opacidad={0.5 * sol} extra={10}>
        {[0, 1, 2].map((i) => (
          <polygon
            key={i}
            points={`${-1050 + i * 220},-280 ${-900 + i * 220},-280 ${-150 + i * 260},420 ${-420 + i * 260},420`}
            fill="#ffb98a"
            opacity={0.32 + 0.06 * Math.sin(t * 0.6 + i)}
          />
        ))}
      </Capa>

      {/* clientes del fondo */}
      <Capa D={1200} cam={cam}>
        <Mesa x={-140} color="#1a120e" />
        <Silla x={-260} lado={-1} color="#1a120e" />
        <Silla x={-20} lado={1} color="#1a120e" />
        {[
          { x: -260, mira: 1 as const, s: 0 },
          { x: -20, mira: -1 as const, s: 1.3 },
        ].map((c, i) => {
          const mira = c.mira;
          const ve = suave(t, T.mire + 0.1 + i * 0.15, T.mire + 0.5 + i * 0.15) * (1 - suave(t, T.salio + 2.5, T.salio + 3.2));
          const P = con(SENTADO, { brazo: [14, 20 + 4 * Math.sin(t * 1.5 + c.s)], ante: [70 + 10 * Math.sin(t * 1.1 + c.s), 64] });
          return (
            <Figura
              key={i}
              x={c.x}
              P={P}
              mira={mira}
              look={CLIENTE}
              t={t}
              cara={{ giro: ve * 0.7, sonrisa: 0.4 * (1 - ve), parpado: 0, boca: ve > 0.5 && t > T.basto ? 0.4 : 0 }}
              bordes={[{ dx: 0, dy: -2.4, color: "#ffc47a", op: 0.7 }]}
            />
          );
        })}
        {/* repisas detrás de la barra */}
        <rect x={180} y={-210} width={520} height={8} fill="#2a1810" />
        <rect x={180} y={-110} width={520} height={8} fill="#2a1810" />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={200 + i * 50} y={-150 + (i % 2) * 100 - 100} width={26} height={40} rx={4} fill={["#7a4a2a", "#3a5a4a", "#8a6a3a"][i % 3]} opacity={0.8} />
        ))}
      </Capa>

      {/* lámparas colgantes */}
      <Capa D={1150} cam={cam}>
        <defs>
          <radialGradient id="foco">
            <stop offset="0" stopColor="#ffe7b0" stopOpacity="1" />
            <stop offset="0.3" stopColor="#ffbf6a" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ff9a40" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[-700, -120, 440, 960].map((lx, i) => (
          <g key={i}>
            <line x1={lx} y1={-900} x2={lx} y2={-250} stroke="#0e0907" strokeWidth={3} />
            <circle cx={lx} cy={-205} r={190} fill="url(#foco)" opacity={lamparas * 0.75} />
            <path d={`M${lx - 46},-210 Q${lx},-268 ${lx + 46},-210 Z`} fill="#1a110c" />
            <ellipse cx={lx} cy={-206} rx={20} ry={7} fill="#fff1c8" opacity={lamparas} />
          </g>
        ))}
      </Capa>

      {/* PLANO DE LOS PERSONAJES */}
      <Capa D={F} cam={cam}>
        <defs>
          <linearGradient id="piso" x1="0" y1={190} x2="0" y2={900} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#6a4228" />
            <stop offset="0.2" stopColor="#4a2c1c" />
            <stop offset="1" stopColor="#1a0f0a" />
          </linearGradient>
          <linearGradient id="madera" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a3420" />
            <stop offset="1" stopColor="#2a170e" />
          </linearGradient>
          <filter id="difuso" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="sombraC" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <clipPath id="adentro">
            <rect x={-5000} y={-3000} width={5000 + PUERTA} height={6000} />
          </clipPath>
        </defs>
        {/* piso */}
        <rect x={-5000} y={196} width={10000} height={2000} fill="url(#piso)" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={-5000} x2={5000} y1={300 + i * i * 14 + i * 10} y2={300 + i * i * 14 + i * 10} stroke="#2a180f" strokeWidth={2} opacity={0.6} />
        ))}
        <rect x={-5000} y={190} width={10000} height={10} fill="#24150e" />
        {/* charcos de luz de las lámparas y de la ventana */}
        {[-700, -120, 440, 960].map((lx, i) => (
          <ellipse key={i} cx={lx * 0.95} cy={318} rx={220} ry={34} fill="#ffc47a" opacity={0.22 * lamparas} filter="url(#difuso)" />
        ))}
        <ellipse cx={-500} cy={320} rx={420} ry={40} fill="#ff9f7a" opacity={0.25 * sol} filter="url(#difuso)" />

        {/* sombras de contacto */}
        {[E.x, M.x, B.visible ? B.x : 99999].map((sx, i) => (
          <ellipse key={i} cx={sx} cy={SUELO + 4} rx={i === 2 ? 56 : 44} ry={7} fill="#000" opacity={0.45} filter="url(#sombraC)" />
        ))}

        {/* vano de la puerta: se ve la calle al anochecer */}
        <rect x={980} y={-20} width={100} height={320} fill={`rgb(${lerp(120, 40, noche)},${lerp(90, 40, noche)},${lerp(130, 90, noche)})`} />

        {/* Marta (detrás de la barra) */}
        <Figura x={M.x} P={M.P} mira={M.mira} look={MARTA} cara={M.cara} taza={M.taza} vapor t={t} bordes={bordes()} />

        {/* barra */}
        <g>
          <rect x={BARRA[0]} y={180} width={BARRA[1] - BARRA[0]} height={120} fill="url(#madera)" />
          <rect x={BARRA[0] - 12} y={172} width={BARRA[1] - BARRA[0] + 24} height={12} rx={3} fill="#2a170e" />
          <rect x={BARRA[0] - 12} y={170} width={BARRA[1] - BARRA[0] + 24} height={3} fill="#ffc47a" opacity={0.6 * lamparas} />
          {/* cafetera */}
          <rect x={600} y={92} width={100} height={80} rx={8} fill="#2c2a2e" />
          <rect x={600} y={92} width={100} height={4} fill="#ffd9a0" opacity={0.6} />
          <rect x={622} y={150} width={56} height={10} fill="#141316" />
          {t > 11.9 && t < 12.6 &&
            [0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${640 + i * 10},150 q${8 * Math.sin(t * 6 + i)},-30 0,-60 q${-8 * Math.sin(t * 6 + i)},-30 0,-60`}
                stroke="#fff3e0"
                strokeWidth={4}
                fill="none"
                opacity={0.35 * suave(t, 11.9, 12.1) * (1 - suave(t, 12.4, 12.6))}
              />
            ))}
          {/* campana de medialunas */}
          <path d="M210,172 Q210,120 260,120 Q310,120 310,172 Z" fill="#fff" opacity={0.18} />
          <path d="M230,170 q15,-18 30,0 q15,-18 30,0" stroke="#c8843a" strokeWidth={9} fill="none" />
          {tazaBarra && <TazaSuelta x={350} y={170} t={t} vapor />}
        </g>

        {/* mesa de Ernesto, sillas */}
        <Silla x={SILLA2} lado={-1} color="#1c120c" />
        <Mesa x={MESA} color="#1c120c" />
        {tazaMesa && <TazaSuelta x={-520} y={184} t={t} vapor={t < T.mire} />}
        {tazaMesa2 && <TazaSuelta x={-610} y={184} t={t} vapor />}
        <g transform={`translate(${t > 16 && t < T.pie ? silla.dx : 0},0)`}>
          <Silla x={SILLA} lado={1} rot={silla.rot} color="#1c120c" />
        </g>

        {/* Ernesto */}
        <g clipPath={t < 9 ? "url(#adentro)" : undefined}>
          <Figura x={E.x} P={E.P} mira={E.mira} look={ERNESTO} cara={E.cara} taza={E.taza} vapor={t < T.mire} t={t} bordes={bordes()} />
        </g>

        {/* el matón */}
        {B.visible && (
          <g clipPath={t < T.entro + 1 || t > T.salio + 1 ? "url(#adentro)" : undefined}>
            <Figura x={B.x} P={B.P} mira={B.mira} look={MATON} cara={B.cara} t={t} bordes={bordes()} />
          </g>
        )}

        {/* el café volando */}
        {tazaVuela && !tazaVuela.rota && <TazaSuelta x={tazaVuela.x} y={tazaVuela.y} rot={tazaVuela.rot} t={t} />}
        {tazaVuela && tazaVuela.rota && (
          <g>
            {[-1, -0.4, 0.3, 1].map((k, i) => {
              const d = Math.min(dt - tazaVuela.tPiso, 0.6);
              const avance = (1 - Math.exp(-d * 6)) * 60 * k;
              return <path key={i} d={`M${tazaVuela.x + avance},${SUELO - 2} l${8 + i * 2},-${6 + i} l${6},${6 + i} Z`} fill="#f2e8da" />;
            })}
            <ellipse cx={tazaVuela.x} cy={SUELO + 2} rx={Math.min(50, (dt - tazaVuela.tPiso) * 160 + 10)} ry={5} fill="#3a2010" opacity={0.85} />
          </g>
        )}
        {dt > 0 &&
          gotas.map((g, i) => {
            const tPiso = (-g.vy + Math.sqrt(g.vy * g.vy + 2 * 1500 * (SUELO - sale[1]))) / 1500;
            const tt = Math.min(dt, tPiso);
            const gx = sale[0] + g.vx * tt;
            const gy = sale[1] + g.vy * tt + 0.5 * 1500 * tt * tt;
            return dt < tPiso ? (
              <ellipse key={i} cx={gx} cy={gy} rx={g.s} ry={g.s * 1.3} fill="#5a3018" />
            ) : (
              <ellipse key={i} cx={gx} cy={SUELO + 1} rx={g.s * 2.2} ry={g.s * 0.6} fill="#3a2010" opacity={0.85} />
            );
          })}

        {/* pared de adelante de la puerta (tapa a quien entra o sale) */}
        <rect x={PUERTA} y={-2000} width={4000} height={2300} fill="#2a1812" />
        <rect x={PUERTA} y={-2000} width={14} height={2300} fill="#ffc47a" opacity={0.25} />
        {/* hoja de la puerta, abisagrada en PUERTA */}
        <g>
          <rect x={PUERTA - 100 * (1 - 0.85 * abre)} y={-20} width={100 * (1 - 0.85 * abre)} height={320} fill="#2a1a12" stroke="#120a06" strokeWidth={6} />
          <rect x={PUERTA - 100 * (1 - 0.85 * abre) + 14 * (1 - 0.85 * abre)} y={10} width={72 * (1 - 0.85 * abre)} height={150} fill="#ffcf9a" opacity={0.18} />
        </g>
        {/* campanita */}
        <g transform={`rotate(${campana} 975 -40)`}>
          <line x1={975} y1={-40} x2={975} y2={-14} stroke="#1a110c" strokeWidth={3} />
          <path d="M962,-2 Q962,-24 975,-24 Q988,-24 988,-2 Z" fill="#c8a050" />
        </g>
      </Capa>

      {/* primer plano: planta y la punta de otra mesa */}
      <Capa D={640} cam={cam}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = -150 + i * 22 + Math.sin(t * 0.8 + i) * 2;
          return (
            <ellipse
              key={i}
              cx={-1180 + Math.cos(a * (Math.PI / 180)) * 120}
              cy={520 + Math.sin(a * (Math.PI / 180)) * 160}
              rx={95}
              ry={30}
              transform={`rotate(${a} ${-1180 + Math.cos(a * (Math.PI / 180)) * 120} ${520 + Math.sin(a * (Math.PI / 180)) * 160})`}
              fill="#14200f"
            />
          );
        })}
        <rect x={700} y={430} width={700} height={22} rx={6} fill="#1a100a" />
        <rect x={860} y={380} width={40} height={52} rx={6} fill="#d8d0c4" opacity={0.85} />
      </Capa>
    </AbsoluteFill>
  );
};
