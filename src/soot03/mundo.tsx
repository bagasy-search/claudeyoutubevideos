import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd, clamp } from "./lib";
import { C, fontFamily } from "./kit";

// Soot 03 — UN solo mundo continuo: el Muro de Adriano visto de costado (mirando al norte), del mar de Irlanda
// (izquierda) al mar del Norte (derecha). La cámara viaja por coordenadas de mundo; las capas lejanas se mueven
// menos (paralaje) y hacen menos zoom (z^f). Todo SVG/React, cero imágenes.
export const TOP = 600; // corona del muro (ahí pisan los soldados)
export const BASE = 900; // suelo al pie del muro (lado sur, el nuestro)
export const WX0 = -9000, WX1 = 47000; // extremos del muro (después, mar)
export const MC = (k: number) => 4000 + (k - 1) * 6000; // milecastle de la trampa k (1..7)
export const TORRES = [-6000, -2000, 0, 2000, 6000, 8000, 12000, 14000, 18000, 20000, 24000, 26000, 30000, 32000, 36000, 38000, 42000, 44000];
export const FUERTE_V = 14600; // Vindolanda (detrás del muro, nuestro lado)
export const FUERTE_H = 27800; // Housesteads + vicus

export type Cam = { x: number; y: number; z: number };
export type K = [number, number, number, number]; // [t, x, y, z]
// cámara: x/y con Catmull-Rom; el zoom se interpola en log (un dolly de 0,03 a 3 se siente parejo)
// Hermite monótono (Fritsch-Carlson): pasa por las llaves sin frenar y SIN pasarse de largo (nada de rebotes de zoom)
export const mono = (t: number, ks: [number, number][]) => {
  const n = ks.length;
  if (t <= ks[0][0]) return ks[0][1];
  if (t >= ks[n - 1][0]) return ks[n - 1][1];
  let i = 0;
  while (t > ks[i + 1][0]) i++;
  const d = (j: number) => (ks[j + 1][1] - ks[j][1]) / Math.max(1e-6, ks[j + 1][0] - ks[j][0]);
  const m = (j: number) => {
    if (j === 0 || j === n - 1) return 0;
    const a = d(j - 1), b = d(j);
    if (a * b <= 0) return 0;
    return (2 * a * b) / (a + b);
  };
  const [t0, v0] = ks[i], [t1, v1] = ks[i + 1];
  const h = t1 - t0, u = (t - t0) / h;
  const u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * v0 + (u3 - 2 * u2 + u) * m(i) * h + (-2 * u3 + 3 * u2) * v1 + (u3 - u2) * m(i + 1) * h;
};
export const camara = (t: number, ks: K[]): Cam => ({
  x: mono(t, ks.map((k) => [k[0], k[1]])),
  y: mono(t, ks.map((k) => [k[0], k[2]])),
  z: Math.exp(mono(t, ks.map((k) => [k[0], Math.log(k[3])]))),
});
// mundo → pantalla (capa f)
export const pant = (x: number, y: number, c: Cam, f = 1) => {
  const zf = Math.pow(c.z, f);
  return [960 + (x - c.x * f) * zf, 540 + (y - c.y * f) * zf];
};
export const visible = (x: number, c: Cam, margen = 600) => Math.abs(x - c.x) < 960 / c.z + margen;

// ── colores
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mezclaCol = (a: string, b: string, u: number) => {
  const A = hex(a), B = hex(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join("");
};
export const PALETAS: Record<string, string[]> = {
  // cielo arriba → horizonte, colina lejana, colina norte, pasto, piedra del muro
  tormenta: ["#120c2e", "#2b2457", "#4a3f7a", "#2a2350", "#1c1a3a", "#2c4a3a", "#7d7690"],
  gris: ["#5a6c8a", "#8ea0b8", "#c4cdd8", "#6f7f96", "#55697a", "#5f8a4a", "#b9ad98"],
  dia: ["#3c9ad6", "#79c0e8", "#cdeaf2", "#7fa3c2", "#5d8aa0", "#7fb34a", "#d8c8ae"],
  atardecer: ["#2d1b69", "#8a3a8f", "#ff8a5a", "#7a3a6a", "#4e2a5a", "#6a8a3a", "#e0b48a"],
  noche: ["#0b0826", "#1b1240", "#3a2a74", "#22184a", "#160f36", "#22402e", "#6b6488"],
  nieve: ["#7d8fb0", "#b6c4d8", "#eef2f6", "#c9d3e0", "#a9b8c8", "#e8eef4", "#c2b8a6"],
  sangre: ["#1a0614", "#4a0f2a", "#b0303a", "#4a1530", "#2e0e22", "#3a3a2a", "#a08a80"],
  calido: ["#ff9a4d", "#ffc77a", "#ffe9b0", "#d9a06a", "#b5784a", "#8ab04a", "#e8cfa8"],
};
export type Pal = keyof typeof PALETAS;
// llaves de ambiente [t, paleta]: se funde en 1,2 s alrededor de cada llave
export const paleta = (t: number, ks: [number, Pal][]) => {
  let i = 0;
  while (i < ks.length - 1 && t >= ks[i + 1][0]) i++;
  const cur = PALETAS[ks[i][1]];
  const prev = i > 0 ? PALETAS[ks[i - 1][1]] : cur;
  const u = i > 0 ? clamp((t - ks[i][0] + 0.6) / 1.2, 0, 1) : 1;
  return cur.map((c, j) => mezclaCol(prev[j], c, u));
};

// ── capa con paralaje: los hijos se posicionan en coordenadas de mundo (left/top absolutos)
export const Capa: React.FC<{ c: Cam; f?: number; children: React.ReactNode; op?: number }> = ({ c, f = 1, children, op = 1 }) => {
  const zf = Math.pow(c.z, f);
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px,540px) scale(${zf}) translate(${-c.x * f}px,${-c.y * f}px)` }}>{children}</div>
    </AbsoluteFill>
  );
};
// svg en coordenadas de mundo dentro de una Capa
export const SW: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }} width={1} height={1}>{children}</svg>
);

// silueta de colinas sobre un rango enorme (memoizada por semilla)
const perfil = (seed: number, y0: number, amp: number, paso: number, x0 = -160000, x1 = 200000) => {
  const r = rnd(seed);
  const fases = [r() * 6, r() * 6, r() * 6];
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += paso) {
    const y = y0 - amp * (0.55 + 0.3 * Math.sin(x / 2300 + fases[0]) + 0.15 * Math.sin(x / 830 + fases[1]) + 0.08 * Math.sin(x / 310 + fases[2]));
    pts.push(`${x},${y.toFixed(0)}`);
  }
  return `M ${x0},6000 L ${pts.join(" L ")} L ${x1},6000 Z`;
};
const P_LEJOS = perfil(11, 430, 260, 240);
const P_NORTE = perfil(23, 480, 190, 160);
const P_FRENTE = perfil(41, 1500, 60, 120);

// ── el Muro (piedra con patrón, almenas, torres, milecastles)
export const Muro: React.FC<{ c: Cam; piedra: string; t: number; sombra?: string; obra?: [number, number, number] | null }> = ({ c, piedra, t, sombra = "rgba(30,20,50,.35)", obra }) => {
  const x0 = Math.max(WX0, c.x - 960 / c.z - 800), x1 = Math.min(WX1, c.x + 960 / c.z + 800);
  const claro = mezclaCol(piedra, "#ffffff", 0.18), oscuro = mezclaCol(piedra, "#2a1530", 0.32);
  const almenas = c.z > 0.12;
  const nA = almenas ? Math.ceil((x1 - x0) / 90) : 0;
  const a0 = Math.floor(x0 / 90) * 90;
  const fin = obra ? obra[0] + (obra[1] - obra[0]) * obra[2] : 0;
  return (
    <SW>
      {obra && <defs><clipPath id="obra"><rect x={WX0 - 2000} y={-4000} width={fin - WX0 + 2000} height={9000} /><rect x={obra[1]} y={-4000} width={WX1 + 2000 - obra[1]} height={9000} /></clipPath></defs>}
      <g clipPath={obra ? "url(#obra)" : undefined}>
      <defs>
        <pattern id="piedra" patternUnits="userSpaceOnUse" width={120} height={60}>
          <rect width={120} height={60} fill={piedra} />
          <rect x={2} y={2} width={56} height={26} rx={5} fill={claro} opacity={0.55} />
          <rect x={62} y={2} width={56} height={26} rx={5} fill={claro} opacity={0.35} />
          <rect x={-28} y={32} width={56} height={26} rx={5} fill={claro} opacity={0.4} />
          <rect x={32} y={32} width={56} height={26} rx={5} fill={claro} opacity={0.6} />
          <rect x={92} y={32} width={56} height={26} rx={5} fill={claro} opacity={0.3} />
        </pattern>
      </defs>
      <rect x={x0} y={TOP} width={x1 - x0} height={BASE - TOP + 40} fill="url(#piedra)" />
      <rect x={x0} y={TOP} width={x1 - x0} height={16} fill={claro} />
      <rect x={x0} y={BASE - 30} width={x1 - x0} height={70} fill={oscuro} opacity={0.35} />
      {Array.from({ length: nA }, (_, i) => {
        const x = a0 + i * 90;
        if (x < WX0 || x > WX1) return null;
        return <rect key={i} x={x} y={TOP - 46} width={52} height={50} rx={4} fill={piedra} stroke={oscuro} strokeWidth={3} />;
      })}
      {TORRES.filter((x) => x > x0 - 400 && x < x1 + 400).map((x) => <Torre key={x} x={x} piedra={piedra} claro={claro} oscuro={oscuro} t={t} />)}
      {[1, 2, 3, 4, 5, 6, 7].map((k) => MC(k)).filter((x) => x > x0 - 800 && x < x1 + 800).map((x, i) => <Milecastle key={x} x={x} piedra={piedra} claro={claro} oscuro={oscuro} k={i} />)}
      <rect x={x0} y={BASE + 10} width={x1 - x0} height={30} fill={sombra} />
      </g>
    </SW>
  );
};
const Torre: React.FC<{ x: number; piedra: string; claro: string; oscuro: string; t: number }> = ({ x, piedra, claro, oscuro }) => (
  <g>
    <rect x={x - 150} y={TOP - 260} width={300} height={BASE - TOP + 260} fill="url(#piedra)" stroke={oscuro} strokeWidth={6} />
    <rect x={x - 170} y={TOP - 290} width={340} height={40} rx={6} fill={claro} stroke={oscuro} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={x - 165 + i * 92} y={TOP - 340} width={56} height={54} rx={4} fill={piedra} stroke={oscuro} strokeWidth={4} />)}
    <rect x={x - 30} y={TOP - 200} width={60} height={90} rx={30} fill={oscuro} />
  </g>
);
export const Milecastle: React.FC<{ x: number; piedra: string; claro: string; oscuro: string; k: number }> = ({ x, piedra, claro, oscuro, k }) => (
  <g>
    <rect x={x - 520} y={TOP - 120} width={1040} height={BASE - TOP + 120} fill="url(#piedra)" stroke={oscuro} strokeWidth={6} />
    {Array.from({ length: 11 }, (_, i) => <rect key={i} x={x - 515 + i * 94} y={TOP - 170} width={56} height={54} rx={4} fill={piedra} stroke={oscuro} strokeWidth={4} />)}
    {/* torre de la puerta */}
    <rect x={x - 200} y={TOP - 380} width={400} height={300} fill="url(#piedra)" stroke={oscuro} strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={x - 196 + i * 84} y={TOP - 430} width={56} height={54} rx={4} fill={piedra} stroke={oscuro} strokeWidth={4} />)}
    <rect x={x - 40} y={TOP - 300} width={80} height={110} rx={40} fill={oscuro} />
    {/* portón de la aduana (abajo) */}
    <path d={`M ${x - 150} ${BASE + 10} L ${x - 150} ${BASE - 170} Q ${x} ${BASE - 330} ${x + 150} ${BASE - 170} L ${x + 150} ${BASE + 10} Z`} fill="#3a2418" />
    <path d={`M ${x - 150} ${BASE - 170} Q ${x} ${BASE - 330} ${x + 150} ${BASE - 170}`} stroke={claro} strokeWidth={22} fill="none" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={x - 110 + i * 73} y1={BASE - 240 + Math.abs(i - 1.5) * 30} x2={x - 110 + i * 73} y2={BASE + 10} stroke="#5a3a22" strokeWidth={10} />)}
    <rect x={x - 520} y={TOP - 120} width={1040} height={20} fill={claro} opacity={0.7} />
  </g>
);

// ── fondo completo del mundo (cielo, nubes, colinas, muro, suelo, mar en las puntas)
export type Ambiente = { pal: string[]; lluvia: number; nieve: number; niebla: number; rayo: number; sol?: [number, number]; luna?: boolean; obra?: [number, number, number] | null };
export const Fondo: React.FC<{ t: number; c: Cam; a: Ambiente; norte?: React.ReactNode; lejos?: React.ReactNode }> = ({ t, c, a, norte, lejos }) => {
  const [s0, s1, s2, hl, hn, pasto, piedra] = a.pal;
  const zSuelo = Math.pow(c.z, 1);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${s0} 0%, ${s1} 45%, ${s2} 100%)` }}>
      {a.sol && <Sol x={a.sol[0]} y={a.sol[1]} luna={a.luna} />}
      {a.luna && <Estrellas t={t} />}
      <Nubes t={t} c={c} col={mezclaCol(s1, "#ffffff", a.lluvia > 0.3 ? 0.05 : 0.35)} oscura={a.lluvia > 0.3} />
      <Capa c={c} f={0.3}><SW><path d={P_LEJOS} fill={hl} /></SW>{lejos}</Capa>
      <Capa c={c} f={0.62}><SW><path d={P_NORTE} fill={hn} /></SW>{norte}</Capa>
      {a.niebla > 0 && <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 20%, ${mezclaCol(s2, "#ffffff", 0.3)} 70%)`, opacity: a.niebla * 0.8 }} />}
      <Capa c={c} f={1}>
        <SW>
          {/* mar en las dos puntas */}
          <rect x={-200000} y={BASE - 60} width={200000 + WX0 + 600} height={90000} fill="#2f6fb0" />
          <rect x={WX1 - 600} y={BASE - 60} width={200000} height={90000} fill="#2f6fb0" />
          {c.z < 0.6 && [WX0 - 3000, WX1 + 3000].map((x) => <path key={x} d={`M ${x - 6000} ${BASE - 40} ${Array.from({ length: 40 }, (_, i) => `q 150 ${i % 2 ? 30 : -30} 300 0`).join(" ")}`} stroke="#9fd0ff" strokeWidth={16} fill="none" opacity={0.6} transform={`translate(${Math.sin(t) * 80} 0)`} />)}
          {/* suelo sur */}
          <rect x={WX0 - 600} y={BASE} width={WX1 - WX0 + 1200} height={90000} fill={pasto} />
          <rect x={WX0 - 600} y={BASE + 70} width={WX1 - WX0 + 1200} height={40} fill={mezclaCol(pasto, "#c9a36a", 0.55)} />
        </SW>
        <Muro c={c} piedra={piedra} t={t} obra={a.obra} />
      </Capa>
      {zSuelo > 0 && null}
    </AbsoluteFill>
  );
};
const Sol: React.FC<{ x: number; y: number; luna?: boolean }> = ({ x, y, luna }) => (
  <div style={{ position: "absolute", left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${luna ? "#fff6d8" : "#fff2b0"} 0 22%, ${luna ? "rgba(255,246,216,.25)" : "rgba(255,200,90,.35)"} 23%, transparent 70%)` }} />
);
const Estrellas: React.FC<{ t: number }> = ({ t }) => {
  const r = rnd(77);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {Array.from({ length: 80 }, (_, i) => { const x = r() * 1920, y = r() * 600, s = 1 + r() * 2.4, f = r() * 6; return <circle key={i} cx={x} cy={y} r={s} fill="#fff" opacity={0.4 + 0.45 * Math.sin(t * 2 + f)} />; })}
    </svg>
  );
};
// nubes en capa f=0.12, que además derivan con el viento
const Nubes: React.FC<{ t: number; c: Cam; col: string; oscura?: boolean }> = ({ t, c, col, oscura }) => {
  const r = rnd(5);
  const ns = Array.from({ length: 9 }, () => ({ x: r() * 2600, y: 60 + r() * 300, s: 0.7 + r() * 0.9 }));
  const dx = -c.x * 0.06 - t * 25;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {ns.map((n, i) => {
        const x = ((((n.x + dx) % 2600) + 2600) % 2600) - 340;
        return (
          <g key={i} transform={`translate(${x} ${n.y}) scale(${n.s})`} fill={col} opacity={oscura ? 0.95 : 0.8}>
            <ellipse cx={0} cy={0} rx={150} ry={50} /><ellipse cx={-70} cy={-20} rx={80} ry={56} /><ellipse cx={60} cy={-34} rx={96} ry={70} />
          </g>
        );
      })}
    </svg>
  );
};
// clima en pantalla (encima de todo el mundo)
export const Clima: React.FC<{ t: number; a: Ambiente }> = ({ t, a }) => {
  const r = React.useMemo(() => { const q = rnd(9); return Array.from({ length: 160 }, () => [q() * 2300 - 200, q(), 0.7 + q() * 0.6, q()]); }, []);
  const n = Math.round(160 * a.lluvia), ns = Math.round(120 * a.nieve);
  return (
    <>
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
        {r.slice(0, n).map(([x0, ph, v], i) => {
          const k = (t * 1.9 * v + ph) % 1, y = k * 1260 - 140, x = x0 - 0.45 * y;
          return <line key={i} x1={x} y1={y} x2={x + 26} y2={y - 58} stroke="#d6e6ff" strokeWidth={4} strokeLinecap="round" opacity={0.55} />;
        })}
        {r.slice(0, ns).map(([x0, ph, v, w], i) => {
          const k = (t * 0.22 * v + ph) % 1, y = k * 1200 - 60, x = x0 + Math.sin(t * 1.3 + w * 9) * 40 - y * 0.15;
          return <circle key={"n" + i} cx={x} cy={y} r={4 + w * 6} fill="#fff" opacity={0.85} />;
        })}
      </svg>
      {a.rayo > 0 && <AbsoluteFill style={{ background: "#eef0ff", opacity: a.rayo * 0.32, mixBlendMode: "screen" }} />}
    </>
  );
};
// rayos: lista de tiempos → destello que decae (doble golpe)
export const destello = (t: number, ts: number[]) => ts.reduce((m, r) => {
  const d = t - r;
  if (d < 0 || d > 0.3) return m;
  return Math.max(m, Math.exp(-d * 22) + (d > 0.08 ? 0.4 * Math.exp(-(d - 0.08) * 20) : 0));
}, 0);
export const Relampago: React.FC<{ t: number; t0: number; x: number }> = ({ t, t0, x }) => {
  const d = t - t0;
  if (d < 0 || d > 0.35) return null;
  const r = rnd(Math.round(t0 * 100));
  let px = x, py = -20;
  const pts = [`${px},${py}`];
  for (let i = 0; i < 9; i++) { px += (r() - 0.5) * 140; py += 60 + r() * 30; pts.push(`${px.toFixed(0)},${py.toFixed(0)}`); }
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <polyline points={pts.join(" ")} stroke="#fff" strokeWidth={10} fill="none" opacity={1 - d / 0.35} strokeLinejoin="round" />
      <polyline points={pts.join(" ")} stroke="#b9c6ff" strokeWidth={26} fill="none" opacity={(1 - d / 0.35) * 0.4} strokeLinejoin="round" />
    </svg>
  );
};

// ── Plano: un detalle del mundo que se abre a pantalla completa desde su punto (iris) y vuelve a cerrarse en él.
export const Plano: React.FC<{ t: number; t0: number; t1: number; desde?: [number, number]; fondo?: string; children: React.ReactNode; forma?: "circulo" | "rect" }> = ({ t, t0, t1, fondo = C.noche, children }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  // barrido diagonal rápido (entra de izquierda a derecha, sale hacia la derecha): el contenido está entero desde el 1er cuadro
  const e = interpolate(t, [t0, t0 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const s = interpolate(t, [t1, t1 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const a = -300 + 2520 * e, b = -300 + 2520 * s;
  const clip = `polygon(${b + 300}px 0, ${a + 300}px 0, ${a}px 1080px, ${b}px 1080px)`;
  // cámara orgánica: empuje lento + deriva de mano, para que ningún panel quede clavado
  const d = t - t0, k = Math.min(1, d / Math.max(2, t1 - t0));
  const z = 1 + 0.035 * Easing.inOut(Easing.sin)(k), dx = Math.sin(d * 0.37) * 12, dy = Math.cos(d * 0.29) * 7;
  return (
    <AbsoluteFill style={{ clipPath: clip, background: fondo, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${(1 - e) * -120 + s * 120 + dx}px) translateY(${dy}px) scale(${z})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
      {(e < 1 || s > 0) && <div style={{ position: "absolute", left: (e < 1 ? a : b) + 270 + 11, top: -40, width: 60, height: 1160, background: "#fff", transform: "skewX(-15.5deg)", transformOrigin: "0 0" }} />}
    </AbsoluteFill>
  );
};

// cartel de trampa (sobre el mundo, sin cortar): franja que cruza + número enorme
export const CartelTrampa: React.FC<{ t: number; t0: number; n: number; titulo: string; color?: string }> = ({ t, t0, n, titulo, color = C.rojo }) => {
  const d = t - t0;
  if (d < 0 || d > 3.4) return null;
  const e = interpolate(d, [0, 0.28], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const o = interpolate(d, [2.9, 3.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(d, [0, 0.3, 2.9, 3.4], [-2200, 0, 0, 2200], { easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: -100, right: -100, top: 330, height: 420, background: color, transform: `translateX(${x}px) rotate(-4deg)`, boxShadow: "0 18px 0 rgba(20,8,40,.4)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", transform: `translateX(${x * 0.8}px) scale(${e}) rotate(-4deg)`, opacity: o }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 120, color: "#fff", WebkitTextStroke: "12px #2a1530", paintOrder: "stroke fill", letterSpacing: 4 }}>TRAP #{n}</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 170, color: C.ambar, WebkitTextStroke: "16px #2a1530", paintOrder: "stroke fill", marginTop: -20 }}>{titulo}</div>
      </div>
    </AbsoluteFill>
  );
};
