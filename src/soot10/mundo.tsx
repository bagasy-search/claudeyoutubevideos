import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, fontFamily, prog } from "./kit";
import { Barco, BarcoLejos, Cielo, Nubes, Mar, MAR, FONDO, Cam, Clima, Key, camara, vista, Rotulo } from "./barco";
import { Lluvia } from "./kit2";

// Estado global del mundo de soot10 en función del tiempo: dónde está el barco, el clima, las luces, la bandera.
// Las secciones sólo agregan gente/objetos y sus llaves de cámara; el mundo es uno solo y siempre está.

const pw = (t: number, pts: [number, number][], ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, pts.map((p) => p[0]), pts.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// barco pirata: x en el mundo (se va lejos en el flashback del mercante y vuelve a abordarlo)
export const SX = (t: number) => {
  if (t < 53) return 0;
  if (t < 103) return 30000;
  if (t < 151) return pw(t, [[103, 6200], [110, -3500], [148, -3500], [151, -3500]]);
  return pw(t, [[151, -3500], [154.6, 0]]);
};
// hundimiento del final (Whydah): baja y escora
export const SY = (t: number) => pw(t, [[852.5, 0], [856, 380], [862, 2700]], Easing.in(Easing.quad));
export const ROT = (t: number) => {
  const mar = clima(t).ola;
  const base = Math.sin(t * 0.85) * (0.6 + mar * 1.6) + Math.sin(t * 0.37 + 1) * 0.3;
  const metronomo = t > 230.6 && t < 234.4 ? Math.sin((t - 230.6) * 2.4) * 7 * Math.sin(((t - 230.6) / 3.8) * Math.PI) : 0;
  const hunde = pw(t, [[852.3, 0], [856, -9], [862, -24]]);
  return base + metronomo + hunde;
};
export const MERCANTE_X = -8200;
export const MX = (t: number) => (t < 148 ? MERCANTE_X : pw(t, [[148, MERCANTE_X], [156, MERCANTE_X - 6000]]));

// paletas de clima con mezcla suave
const P: Record<string, Clima> = {
  dia: { cielo: ["#3f9fe0", "#9fd8f2", "#fff3d6"], mar: ["#22a8cc", "#0d4f8a"], ola: 0.15, noche: 0, tormenta: 0 },
  alba: { cielo: ["#2d1b69", "#e2557a", "#ffc27a"], mar: ["#3a7ab8", "#14306a"], ola: 0.1, noche: 0.2, tormenta: 0 },
  tarde: { cielo: ["#5b2bb5", "#ff7a8a", "#ffd27a"], mar: ["#2a8ab8", "#123a7a"], ola: 0.15, noche: 0.1, tormenta: 0 },
  noche: { cielo: ["#0e0a2a", "#241650", "#4a2f8f"], mar: ["#1b3a7a", "#0a1a44"], ola: 0.12, noche: 1, tormenta: 0 },
  lluvia: { cielo: ["#2a2a4a", "#56507a", "#8a84a8"], mar: ["#2a6a8a", "#0a2a4a"], ola: 0.6, noche: 0.3, tormenta: 0.7 },
  tormenta: { cielo: ["#120e24", "#2a2444", "#4a4468"], mar: ["#1d4a6a", "#061a34"], ola: 1, noche: 0.6, tormenta: 1 },
  humo: { cielo: ["#5a3a5a", "#c27a6a", "#f2c290"], mar: ["#2a7aa8", "#123a6a"], ola: 0.25, noche: 0.1, tormenta: 0.1 },
  africa: { cielo: ["#e07a3a", "#f7b85a", "#fff0c0"], mar: ["#2a9ab8", "#0d4f8a"], ola: 0.15, noche: 0, tormenta: 0 },
};
// [t, paleta] — se mezcla en 1,2 s alrededor de cada cambio
const CLIMAS: [number, string][] = [
  [0, "humo"], [5.5, "dia"], [94, "alba"], [104, "dia"],
  [186, "dia"], [188.6, "tarde"], [189.4, "noche"], [190.2, "alba"], [191, "dia"],
  [226.5, "lluvia"], [241.5, "dia"], [243.6, "noche"], [265, "dia"],
  [293.7, "noche"], [302.4, "dia"],
  [552.2, "noche"], [572, "dia"],
  [605, "africa"], [615, "dia"],
  [712, "humo"], [757, "africa"], [789, "noche"], [798, "dia"],
  [843.4, "tormenta"], [863, "dia"],
];
export const clima = (t: number): Clima => {
  let i = 0;
  while (i + 1 < CLIMAS.length && CLIMAS[i + 1][0] <= t) i++;
  const a = P[CLIMAS[i][1]];
  const prev = i > 0 ? P[CLIMAS[i - 1][1]] : a;
  const u = Math.min(1, (t - CLIMAS[i][0]) / 1.2);
  const mix = (x: string, y: string) => interpolateColors(u, [0, 1], [x, y]);
  return {
    cielo: [0, 1, 2].map((k) => mix(prev.cielo[k], a.cielo[k])) as [string, string, string],
    mar: [mix(prev.mar[0], a.mar[0]), mix(prev.mar[1], a.mar[1])],
    ola: prev.ola + (a.ola - prev.ola) * u, noche: prev.noche + (a.noche - prev.noche) * u, tormenta: prev.tormenta + (a.tormenta - prev.tormenta) * u,
  };
};

// cañonazos del barco pirata (cada tiempo va al cañón j % 7); cada cañón muestra su último disparo
export const FUEGO: number[] = [0.25, 0.7, 1.15, 1.6, 2.9, 3.3, 4.1, 4.6, 99.9, 735.6, 736.2, 736.9, 737.5, 738.2, 712.6, 713.1, 713.7, 714.4, 715.2, 716.0, 716.9];
const disparos = (t: number) => Array.from({ length: 7 }, (_, i) => {
  let u: number | undefined;
  FUEGO.forEach((f, j) => { if (j % 7 === i && f <= t && (u === undefined || f > u)) u = f; });
  return u ?? -99;
});
// estado del barco pirata
export const estadoPirata = (t: number) => ({
  dispara: disparos(t),
  bandera: { tipo: "pirata" as const, iza: t < 5.6 ? 1 : t < 9 ? prog(t, 5.7, 7.4) : 1 },
  luces: t > 293.9 && t < 302.4 ? 0 : t > 552 && t < 571 ? 1 : clima(t).noche > 0.5 ? 1 : 0.6,
  velas: 1,
  danio: t > 740 && t < 808 ? 0.6 : 0,
  nombre: t > 843 ? "WHYDAH" : undefined,
  campana: [186.1, 187.9, 188.9, 189.7, 190.5, 255, 869.9, 909.6, 912.1],
  reloj: [184.9, 188.6, 189.4, 190.2, 193.2],
  agua: t > 200 && t < 218 ? prog(t, 203, 209) - prog(t, 211, 214) : 0.2,
  humo: t < 5.5 ? 1 : t > 712 && t < 760 ? 0.8 : 0,
});

// ── lugares del mundo (sólo se dibujan si están en cuadro)
const Palmera: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 0 Q 30 -200 -20 -420" stroke="#8a5a2a" strokeWidth={30} fill="none" strokeLinecap="round" />
    {[-150, -100, -40, 20, 80, 140].map((a, i) => (
      <path key={i} transform={`translate(-20 -420) rotate(${a + Math.sin(t * 1.3 + i) * 5})`} d="M 0 0 Q 90 -60 200 10 Q 100 -20 0 0 Z" fill={i % 2 ? "#2f9a4a" : "#3fb85a"} />
    ))}
    <circle cx={-10} cy={-410} r={16} fill="#6b3a1f" /><circle cx={-34} cy={-404} r={14} fill="#6b3a1f" />
  </g>
);
const Choza: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#e8b98a" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-220} width={320} height={220} fill={c} />
    <rect x={40} y={-220} width={120} height={220} fill="rgba(60,20,30,.18)" />
    <path d="M -200 -210 L 0 -360 L 200 -210 Z" fill="#c9a050" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-180 + i * 50} y1={-215} x2={-150 + i * 40} y2={-300} stroke="#a8803a" strokeWidth={6} />)}
    <rect x={-50} y={-140} width={90} height={140} rx={8} fill="#5a3418" />
    <rect x={-140} y={-170} width={60} height={56} rx={6} fill="#5a3418" />
  </g>
);
export const Puerto: React.FC<{ t: number; v: ReturnType<typeof vista> }> = ({ t, v }) => {
  if (v.x1 < -17500 || v.x0 > MERCANTE_X + 400) return null;
  const tierra = "#e8c27a";
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {/* cerros verdes de Jamaica */}
      <path d="M -19000 1700 Q -17500 900 -16000 1500 Q -15000 1000 -13600 1450 Q -12600 1150 -11400 1600 Q -10400 1450 -9600 1760 L -9600 2100 L -19000 2100 Z" fill="#2f8a5a" />
      <path d="M -19000 1850 Q -16500 1500 -14000 1750 Q -12000 1600 -10200 1860 L -10200 2100 L -19000 2100 Z" fill="#4aa86a" />
      <path d="M -19000 1900 L -10000 1900 Q -9400 1960 -9000 2040 L -19000 2040 Z" fill={tierra} />
      {/* muelle hasta el mercante */}
      <rect x={-9900} y={1880} width={1900} height={30} fill="#8a5a2a" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-9860 + i * 220} y={1900} width={22} height={260} fill="#5a3418" />)}
      {[-15400, -14600, -13700, -12700, -11800, -11000].map((x, i) => <Choza key={x} x={x} y={1910} s={0.95 + (i % 3) * 0.12} c={["#e8b98a", "#f2d0a0", "#d9a878"][i % 3]} />)}
      {[-16200, -14150, -12250, -10500, -9700].map((x, i) => <Palmera key={x} x={x} y={1920} s={1 + (i % 2) * 0.25} t={t} />)}
      {/* barriles de azúcar en el muelle */}
      {[-9500, -9400, -9300, -9450, -9350].map((x, i) => (
        <g key={i} transform={`translate(${x} ${i < 3 ? 1880 : 1770})`}>
          <path d="M -46 0 Q -58 -55 -46 -110 L 46 -110 Q 58 -55 46 0 Z" fill="#c9a06a" />
          <text x={0} y={-44} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill="#5a3418">SUGAR</text>
        </g>
      ))}
      <Rotulo x={-13600} y={1050} txt="JAMAICA" size={150} />
    </svg>
  );
};
export const Isla: React.FC<{ t: number; v: ReturnType<typeof vista>; x?: number }> = ({ t, v, x = 7800 }) => {
  if (v.x1 < x - 1400 || v.x0 > x + 1400 || v.y1 < 1200) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <ellipse cx={x} cy={MAR + 30} rx={900} ry={140} fill="#e8c27a" />
      <ellipse cx={x} cy={MAR + 50} rx={980} ry={90} fill="#bff3ff" opacity={0.4} />
      <path d={`M ${x - 700} ${MAR + 10} Q ${x} ${MAR - 120} ${x + 700} ${MAR + 10} Z`} fill="#f2d08a" />
      <Palmera x={x + 260} y={MAR - 40} s={1.4} t={t} />
      <Palmera x={x - 420} y={MAR - 20} s={0.9} t={t} />
    </svg>
  );
};
// Charleston (puerto con casas y muelle), Cape Coast Castle (fuerte blanco en la costa) y el muelle de Londres
export const Charleston: React.FC<{ t: number; v: ReturnType<typeof vista>; x?: number }> = ({ t, v, x = 14000 }) => {
  if (v.x1 < x - 2600 || v.x0 > x + 2600) return null;
  const r = rnd(5);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={`M ${x - 600} ${MAR - 60} L ${x + 2800} ${MAR - 60} L ${x + 2800} ${MAR + 200} L ${x - 800} ${MAR + 200} Z`} fill="#7aa85a" />
      {Array.from({ length: 12 }, (_, i) => {
        const xx = x - 400 + i * 260, h = 220 + r() * 260;
        return (
          <g key={i}>
            <rect x={xx} y={MAR - 60 - h} width={200} height={h} fill={["#f2d0a0", "#e8a87a", "#d9c0e8", "#f7e0b0"][i % 4]} />
            <path d={`M ${xx - 20} ${MAR - 60 - h} L ${xx + 100} ${MAR - 160 - h} L ${xx + 220} ${MAR - 60 - h} Z`} fill={["#b5452c", "#5b3b8a", "#2a5a8a"][i % 3]} />
            {[0, 1].map((k) => <rect key={k} x={xx + 30 + k * 90} y={MAR - h + 10} width={50} height={60} rx={6} fill="#5a3418" />)}
          </g>
        );
      })}
      <rect x={x + 900} y={MAR - 600} width={60} height={540} fill="#e8e0d0" />
      <path d={`M ${x + 880} ${MAR - 600} L ${x + 930} ${MAR - 760} L ${x + 980} ${MAR - 600} Z`} fill="#e8e0d0" />
      <Rotulo x={x + 1100} y={MAR - 900} txt="CHARLESTON · 1718" size={110} />
    </svg>
  );
};
export const CastilloCapeCoast: React.FC<{ t: number; v: ReturnType<typeof vista>; x?: number }> = ({ t, v, x = 22000 }) => {
  if (v.x1 < x - 2600 || v.x0 > x + 2600) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={`M ${x - 2400} ${MAR - 40} Q ${x - 1000} ${MAR - 160} ${x + 2400} ${MAR - 120} L ${x + 2400} ${MAR + 200} L ${x - 2400} ${MAR + 200} Z`} fill="#e8c27a" />
      <path d={`M ${x - 1300} ${MAR - 80} L ${x - 1300} ${MAR - 600} L ${x + 1300} ${MAR - 600} L ${x + 1300} ${MAR - 80} Z`} fill="#f4f1e8" />
      <path d={`M ${x - 1300} ${MAR - 600} L ${x + 1300} ${MAR - 600}`} stroke="#d9d2c0" strokeWidth={30} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={x - 1300 + i * 190} y={MAR - 660} width={110} height={70} fill="#f4f1e8" />)}
      {[-1, 1].map((s) => <g key={s}><rect x={x + s * 1300 - 180} y={MAR - 900} width={360} height={820} fill="#ece7da" /><path d={`M ${x + s * 1300 - 200} ${MAR - 900} L ${x + s * 1300 + 200} ${MAR - 900} L ${x + s * 1300 + 200} ${MAR - 960} L ${x + s * 1300 - 200} ${MAR - 960} Z`} fill="#d9d2c0" /></g>)}
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={x - 900 + i * 320} y={MAR - 420} width={60} height={110} rx={30} fill="#5a4a3a" />)}
      <rect x={x - 6} y={MAR - 1300} width={12} height={400} fill="#5a3418" />
      <Rotulo x={x} y={MAR - 1400} txt="CAPE COAST CASTLE" size={120} />
      <Palmera x={x - 1900} y={MAR - 80} s={1.3} t={t} /><Palmera x={x + 1800} y={MAR - 100} s={1.1} t={t} />
    </svg>
  );
};
export const MuelleLondres: React.FC<{ t: number; v: ReturnType<typeof vista>; x?: number; marea?: number }> = ({ t, v, x = 30000, marea = 0 }) => {
  if (v.x1 < x - 2600 || v.x0 > x + 2600) return null;
  const r = rnd(9);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {Array.from({ length: 10 }, (_, i) => {
        const xx = x - 2400 + i * 500, h = 500 + r() * 500;
        return <g key={i}><rect x={xx} y={MAR - 200 - h} width={440} height={h} fill={["#6a6a8a", "#7a7a9a", "#5a5a7a"][i % 3]} />{Array.from({ length: Math.floor(h / 120) }, (_, k) => <rect key={k} x={xx + 60} y={MAR - 160 - h + k * 120} width={320} height={50} rx={6} fill="#ffd27a" opacity={0.5} />)}</g>;
      })}
      <rect x={x - 2600} y={MAR - 200} width={5200} height={220} fill="#7a6a5a" />
      {/* horca de la marea (silueta) */}
      <g transform={`translate(${x} ${MAR + 60})`}>
        <rect x={-14} y={-560} width={28} height={600} fill="#2a1a10" />
        <rect x={-14} y={-560} width={260} height={26} fill="#2a1a10" />
        <line x1={220} y1={-534} x2={220} y2={-420} stroke="#2a1a10" strokeWidth={8} />
      </g>
      {/* marcas de las tres mareas */}
      {[1, 2, 3].map((k) => <g key={k} opacity={marea >= k ? 1 : 0.25}><line x1={x + 300} y1={MAR + 40 - k * 130} x2={x + 700} y2={MAR + 40 - k * 130} stroke="#bff3ff" strokeWidth={10} strokeDasharray="30 20" /><Rotulo x={x + 860} y={MAR + 60 - k * 130} txt={`TIDE ${k}`} size={60} /></g>)}
      <Rotulo x={x - 400} y={MAR - 1300} txt="EXECUTION DOCK · LONDON" size={110} />
    </svg>
  );
};

// ── el escenario completo: cielo, nubes, lugares, barcos, mar; `mundo` = cosas en coords de mundo, `abordo` = coords del barco pirata
export const Escenario: React.FC<{ t: number; keys: Key[]; abordo?: React.ReactNode; mundo?: React.ReactNode; mercante?: React.ReactNode; frente?: React.ReactNode }> = ({ t, keys, abordo, mundo, mercante, frente }) => {
  const cam = camaraT(t, keys);
  const cl = clima(t);
  const v = vista(cam);
  const sx = SX(t), sy = SY(t), rot = ROT(t);
  const ep = estadoPirata(t);
  // velocidad de cámara → estela de paneo rápido
  const c2 = camaraT(t - 1 / 30, keys);
  const vel = Math.hypot((cam.x - c2.x) * cam.z, (cam.y - c2.y) * cam.z);
  const dz = Math.abs(Math.log(cam.z / c2.z)) * 30;
  const verBarco = v.x1 > sx - 600 && v.x0 < sx + 4600 && v.y1 > -800 + sy && v.y0 < 2500 + sy;
  const mx = MX(t);
  const verMerc = t < 160 && v.x1 > mx - 600 && v.x0 < mx + 4600;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: cl.cielo[0] }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${960 - cam.x * cam.z}px, ${540 - cam.y * cam.z}px) scale(${cam.z})` }}>
        <Cielo cl={cl} cam={cam} />
        {cl.noche > 0.3 && <Estrellas2 t={t} cam={cam} op={(cl.noche - 0.3) / 0.7} />}
        <Sol t={t} cam={cam} cl={cl} />
        <Nubes t={t} cam={cam} cl={cl} />
        <Puerto t={t} v={v} />
        <Charleston t={t} v={v} />
        <CastilloCapeCoast t={t} v={v} />
        <MuelleLondres t={t} v={v} marea={t > 794 ? Math.min(3, Math.floor((t - 795) / 0.8) + 1) : 0} />
        <Mar t={t} cam={cam} cl={cl} />
        <Isla t={t} v={v} />
        {verMerc && (
          <div style={{ position: "absolute", left: mx, top: 0, transformOrigin: "2000px 2000px", transform: `rotate(${Math.sin(t * 0.8 + 2) * 0.8}deg)` }}>
            <Barco t={t} mercante bandera={{ tipo: "mercante", iza: t < 112.4 ? 1 : 1 - prog(t, 112.4, 114.2) }} luces={0.6} velas={t < 64 ? 0.15 : 1} campana={[]} reloj={[]} />
            {mercante}
          </div>
        )}
        {verBarco && (
          <div style={{ position: "absolute", left: sx, top: sy, transformOrigin: "2000px 2000px", transform: `rotate(${rot}deg)` }}>
            <Barco {...ep} t={t} />
            {abordo}
          </div>
        )}
        {mundo}
        <Mar t={t} cam={cam} cl={cl} frente />
        {frente}
      </div>
      {cl.tormenta > 0.4 && <Lluvia t={t} n={160} angulo={24} op={0.5 * cl.tormenta} />}
      {t > 226.8 && t < 241 && <Lluvia t={t} n={110} angulo={14} op={0.45} />}
      {/* estela de paneo/dolly rápido */}
      {(vel > 260 || dz > 0.9) && <Estela t={t} k={Math.min(1, Math.max((vel - 260) / 300, (dz - 0.9) * 2))} radial={dz > 0.9 && vel < 260} />}
      {cl.noche > 0.4 && <AbsoluteFill style={{ background: "rgba(20,10,60,.25)", opacity: cl.noche, pointerEvents: "none" }} />}
    </AbsoluteFill>
  );
};

let _cache: { keys: Key[] | null; t: number; c: Cam } = { keys: null, t: -1, c: { x: 0, y: 0, z: 1 } };
// llaves relativas al barco: x negativo enorme no se usa; las relativas se marcan con z < 0 (z = -zoom)
export const camaraT = (t: number, keys: Key[]): Cam => {
  if (_cache.keys === keys && _cache.t === t) return _cache.c;
  const sx = SX(t), sy = SY(t);
  const ks = keys.map((k) => (k[3] < 0 ? ([k[0], k[1] + sx, k[2] + sy, -k[3], k[4], k[5]] as Key) : k));
  const c = camara(t, ks);
  _cache = { keys, t, c };
  return c;
};

const Estrellas2: React.FC<{ t: number; cam: Cam; op: number }> = ({ t, cam, op }) => {
  const v = vista(cam);
  const r = rnd(11);
  const e = Array.from({ length: 160 }, () => [r() * 3, r(), 2 + r() * 4, r() * 6]);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }} width={1} height={1}>
      {e.map(([a, b, s, f], i) => <circle key={i} cx={v.x0 + (a / 3) * (v.x1 - v.x0)} cy={v.y0 + b * Math.max(10, Math.min(v.y1, MAR) - v.y0) * 0.9} r={s / cam.z} fill="#fff" opacity={0.4 + 0.5 * Math.sin(t * 2 + f)} />)}
    </svg>
  );
};
const Sol: React.FC<{ t: number; cam: Cam; cl: Clima }> = ({ t, cam, cl }) => {
  const v = vista(cam);
  if (v.y0 > MAR || cl.tormenta > 0.6) return null;
  const luna = cl.noche > 0.5;
  const x = v.x0 + (v.x1 - v.x0) * 0.78, y = Math.min(MAR - 300, v.y0 + (Math.min(v.y1, MAR) - v.y0) * 0.24);
  const r = 90 / cam.z;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <defs><radialGradient id="solh"><stop offset="0.3" stopColor={luna ? "#fff6d8" : "#fff0b0"} stopOpacity={0.5} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient></defs>
      <circle cx={x} cy={y} r={r * 3.2} fill="url(#solh)" />
      <g transform={`translate(${x} ${y}) rotate(${t * 6})`} opacity={luna ? 0 : 0.18}>
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, b = a + 0.16; return <path key={i} d={`M 0 0 L ${Math.cos(a) * r * 14} ${Math.sin(a) * r * 14} L ${Math.cos(b) * r * 14} ${Math.sin(b) * r * 14} Z`} fill="#fff3c4" />; })}
      </g>
      <circle cx={x} cy={y} r={r} fill={luna ? "#fff6d8" : "#fff0b0"} />
    </svg>
  );
};
const Estela: React.FC<{ t: number; k: number; radial?: boolean }> = ({ t, k, radial }) => {
  const r = rnd(Math.floor(t * 30));
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {Array.from({ length: 26 }, (_, i) => {
        if (radial) {
          const a = r() * Math.PI * 2, d0 = 300 + r() * 300;
          return <line key={i} x1={960 + Math.cos(a) * d0} y1={540 + Math.sin(a) * d0} x2={960 + Math.cos(a) * (d0 + 300 + r() * 400)} y2={540 + Math.sin(a) * (d0 + 300 + r() * 400)} stroke="#fff" strokeWidth={4 + r() * 6} opacity={0.35 * k} strokeLinecap="round" />;
        }
        const y = r() * 1080, x = r() * 1920, w = 300 + r() * 700;
        return <line key={i} x1={x} y1={y} x2={x + w} y2={y} stroke="#fff" strokeWidth={3 + r() * 6} opacity={0.3 * k} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// capa de pantalla para títulos de trampa: cartel de madera que baja colgado de sogas
export const CartelTrampa: React.FC<{ t: number; t0: number; n: number; nombre: string; t1?: number }> = ({ t, t0, n, nombre, t1 = t0 + 2.6 }) => {
  if (t < t0 - 0.1 || t > t1 + 0.6) return null;
  const baja = interpolate(t, [t0, t0 + 0.5], [-560, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const sube = interpolate(t, [t1, t1 + 0.5], [0, -700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const sw = Math.sin((t - t0) * 5) * 6 * Math.exp(-(t - t0) * 1.5);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 960 - 520, top: 130 + baja + sube, width: 1040, transformOrigin: "520px -130px", transform: `rotate(${sw}deg)` }}>
        <svg style={{ position: "absolute", left: 0, top: -300, overflow: "visible" }} width={1040} height={300}>
          <line x1={120} y1={0} x2={150} y2={300} stroke="#3a2414" strokeWidth={10} /><line x1={920} y1={0} x2={890} y2={300} stroke="#3a2414" strokeWidth={10} />
        </svg>
        <div style={{ background: "linear-gradient(180deg,#b8743a,#8a4f22)", border: "12px solid #5a2d14", borderRadius: 26, padding: "26px 40px 30px", boxShadow: "0 18px 0 rgba(20,10,40,.45)", textAlign: "center", fontFamily }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: C.oro, WebkitTextStroke: "6px #3a1c10", paintOrder: "stroke fill", letterSpacing: 4 }}>TRAP #{n}</div>
          <div style={{ fontSize: 112, fontWeight: 700, color: C.crema, WebkitTextStroke: "10px #3a1c10", paintOrder: "stroke fill", lineHeight: 1.05 }}>{nombre}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 14 }}>
            {Array.from({ length: 7 }, (_, i) => (
              <svg key={i} width={58} height={58} viewBox="-30 -30 60 60" style={{ transform: `scale(${i === n - 1 ? 1.2 + 0.1 * Math.sin(t * 8) : 1})` }}>
                <circle r={27} fill={i < n ? (i === n - 1 ? C.rojo : "#3a1c10") : "rgba(255,255,255,.25)"} stroke="#fff3d6" strokeWidth={4} />
                <path d="M -11 -2 Q -12 -16 0 -16 Q 12 -16 11 -2 Q 10 4 6 5 L 6 9 L -6 9 L -6 5 Q -10 4 -11 -2 Z" fill={i < n ? "#fff3d6" : "rgba(255,255,255,.5)"} />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
export { MAR, FONDO };
