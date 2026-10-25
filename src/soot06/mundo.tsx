import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, fontFamily } from "./kit";

// Mundo único de soot06: un castillo inglés de 1300 en CORTE (casa de muñecas) + la aldea de afuera + el foso.
// TODO el video vive acá adentro: la cámara viaja de cuarto en cuarto (paneo, dolly, zoom a un detalle) y nunca corta.
// Coordenadas de mundo: 7680 x 4320 (zoom 1 = un cuarto llena la pantalla). Suelo exterior y=3700.
export const MW = 7680, MH = 4320, SUELO = 3700;
// cuartos (centro y zoom que los encuadra justo) — para las llaves de cámara
export const CUARTO = {
  todo: [3840, 2160, 0.25], castillo: [5000, 2200, 0.34],
  aldea: [900, 3200, 0.62], campo: [1250, 3350, 0.8], foso: [2100, 3800, 0.9],
  muro: [2620, 2400, 0.7], adarve: [2620, 1850, 1], puerta: [2620, 3300, 0.8],
  patio: [3600, 3250, 0.62], cocina: [3400, 3200, 0.95],
  torre: [5800, 1900, 0.38], almena: [5800, 820, 0.85], solar: [5150, 1500, 1], capilla: [6580, 1500, 1],
  salon: [5800, 2500, 0.62], salonIz: [5000, 2520, 1], hogar: [5800, 2560, 1], estrado: [6800, 2500, 1],
  almacen: [5800, 3350, 0.62], letrina: [7400, 2420, 1], conducto: [7480, 3200, 0.55], escalera: [4400, 2350, 0.7],
} as const;
export type Llave = [number, number, number, number]; // [t, x, y, zoom]
export type Cuarto = keyof typeof CUARTO;
export const K = (t: number, c: Cuarto, dx = 0, dy = 0, dz = 1): Llave => [t, CUARTO[c][0] + dx, CUARTO[c][1] + dy, CUARTO[c][2] * dz];

// cámara: interpola entre llaves con aceleración/frenado (un dolly real, nunca un salto)
export const camEn = (t: number, ll: Llave[]) => {
  if (t <= ll[0][0]) return { x: ll[0][1], y: ll[0][2], z: ll[0][3] };
  for (let i = 0; i < ll.length - 1; i++) {
    const [ta, xa, ya, za] = ll[i], [tb, xb, yb, zb] = ll[i + 1];
    if (t <= tb) {
      const u = interpolate(t, [ta, tb], [0, 1], { easing: Easing.bezier(0.55, 0, 0.3, 1) });
      // el zoom viaja en escala logarítmica (se siente parejo) y, si el salto es largo, se aleja en el medio (arco de grúa)
      const lz = Math.log(za) + (Math.log(zb) - Math.log(za)) * u;
      const dist = Math.hypot(xb - xa, yb - ya) * Math.min(za, zb);
      const arco = dist > 2400 ? Math.sin(u * Math.PI) * Math.min(0.55, dist / 9000) : 0;
      return { x: xa + (xb - xa) * u, y: ya + (yb - ya) * u, z: Math.exp(lz - arco) };
    }
  }
  const l = ll[ll.length - 1];
  return { x: l[1], y: l[2], z: l[3] };
};
export type CamP = { x: number; y: number; z: number };
// convierte un punto del mundo a pantalla (para colgar chips/iris sobre objetos del mundo)
export const aPantalla = (c: CamP, x: number, y: number) => ({ x: 960 + (x - c.x) * c.z, y: 540 + (y - c.y) * c.z });

export const Camara: React.FC<{ c: CamP; children: React.ReactNode }> = ({ c, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: MW, height: MH, transformOrigin: "0 0", transform: `translate(${960 - c.x * c.z}px, ${540 - c.y * c.z}px) scale(${c.z})` }}>{children}</div>
  </AbsoluteFill>
);

// ── hora: 0 = 15:45 atardecer · 1 = noche cerrada · 2 = amanecer
const mezcla = (a: string, b: string, u: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join("");
};
const CIELO: string[][] = [
  ["#3a1d6e", "#8a3a8c", "#e8607a", "#ffa04d", "#ffd27a"], // atardecer
  ["#070418", "#0e0a2a", "#1b1240", "#2d1b69", "#3e2a80"], // noche
  ["#2b3a8a", "#6a5ab8", "#d98ab0", "#ffc38a", "#fff0c4"], // amanecer
];
export const cieloEn = (hora: number) => {
  const i = Math.min(1, Math.floor(hora)), u = Math.min(1, hora - i);
  return CIELO[0].map((_, k) => mezcla(CIELO[i][k], CIELO[i + 1][k], u));
};
// oscuridad 0..1 según la hora (noche = 1)
export const oscuro = (hora: number) => (hora <= 1 ? Math.min(1, hora * 1.3) : Math.max(0, 1 - (hora - 1) * 1.1));

// ── piezas de arquitectura (todas en coordenadas de mundo)
const PIEDRA = "#9c8fa8", PIEDRA2 = "#7d6f8c", PIEDRA3 = "#5d5070", JUNTA = "#6b5d7c";
const Sillares: React.FC<{ x: number; y: number; w: number; h: number; c?: string; seed?: number; fila?: number }> = ({ x, y, w, h, c = PIEDRA, seed = 1, fila = 70 }) => {
  const r = rnd(seed);
  const filas = Math.ceil(h / fila);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c} />
      {Array.from({ length: filas }, (_, i) => {
        const yy = y + i * fila;
        const off = (i % 2) * 60;
        const n = Math.ceil(w / 120) + 1;
        return (
          <g key={i}>
            <line x1={x} y1={yy} x2={x + w} y2={yy} stroke={JUNTA} strokeWidth={5} />
            {Array.from({ length: n }, (_, k) => {
              const xx = x + k * 120 - off + r() * 20;
              return xx > x && xx < x + w ? <line key={k} x1={xx} y1={yy} x2={xx} y2={Math.min(y + h, yy + fila)} stroke={JUNTA} strokeWidth={5} /> : null;
            })}
            {r() < 0.35 && <rect x={x + r() * (w - 120)} y={yy + 8} width={100} height={fila - 16} fill="#fff" opacity={0.06} />}
          </g>
        );
      })}
    </g>
  );
};
const Almenas: React.FC<{ x: number; y: number; w: number; c?: string }> = ({ x, y, w, c = PIEDRA2 }) => (
  <g fill={c}>
    {Array.from({ length: Math.floor(w / 110) }, (_, i) => <rect key={i} x={x + i * 110 + 10} y={y - 70} width={70} height={74} />)}
  </g>
);
// ventana de saetera con postigos de madera (abre 0..1)
export const Saetera: React.FC<{ x: number; y: number; abre?: number; luz?: string; vidrio?: boolean }> = ({ x, y, abre = 0, luz = "#1b1240", vidrio }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -34 120 L -34 -70 Q 0 -120 34 -70 L 34 120 Z" fill={PIEDRA3} />
    <path d="M -16 110 L -16 -60 Q 0 -86 16 -60 L 16 110 Z" fill={luz} />
    {vidrio && [0, 1, 2, 3].map((i) => <rect key={i} x={-14} y={-50 + i * 40} width={28} height={36} fill={["#e8344a", "#2ec4d6", "#f7c548", "#9b7bf0"][i]} opacity={0.85} />)}
    {!vidrio && (
      <>
        <rect x={-16 - 40 * abre} y={-60} width={16} height={170} fill="#7a4520" stroke="#4a2810" strokeWidth={3} />
        <rect x={16 * (1 - abre) - 16 + 40 * abre + 16} y={-60} width={16} height={170} fill="#7a4520" stroke="#4a2810" strokeWidth={3} transform={`translate(${-16} 0)`} />
      </>
    )}
  </g>
);
// antorcha / vela de pared con llama viva
export const Llama: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number; viva?: number }> = ({ x, y, t, s = 1, seed = 1, viva = 1 }) => {
  if (viva <= 0) return null;
  const f = Math.sin(t * 13 + seed) * 0.08 + Math.sin(t * 7.1 + seed * 2) * 0.06;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * viva} ${s * viva * (1 + f)})`}>
      <ellipse cx={0} cy={-20} rx={60} ry={70} fill="#ffb347" opacity={0.18} />
      <path d={`M 0 -70 Q ${22 + f * 60} -30 16 0 Q 0 14 -16 0 Q ${-20 + f * 40} -34 0 -70 Z`} fill="#ff7a3d" />
      <path d={`M 0 -44 Q ${10 + f * 30} -20 8 0 Q 0 8 -8 0 Q -10 -20 0 -44 Z`} fill="#ffe08a" />
    </g>
  );
};
export const Antorcha: React.FC<{ x: number; y: number; t: number; seed?: number; viva?: number }> = ({ x, y, t, seed = 1, viva = 1 }) => (
  <g>
    <path d={`M ${x - 10} ${y} L ${x + 10} ${y} L ${x + 6} ${y + 90} L ${x - 6} ${y + 90} Z`} fill="#6b3a1f" />
    <rect x={x - 16} y={y - 8} width={32} height={18} rx={4} fill="#3a3a48" />
    <Llama x={x} y={y - 4} t={t} seed={seed} viva={viva} />
  </g>
);
// pila de juncos del piso (con mugre que se ve si `asco` > 0)
const Juncos: React.FC<{ x: number; y: number; w: number; seed?: number; asco?: number }> = ({ x, y, w, seed = 2, asco = 0 }) => {
  const r = rnd(seed);
  return (
    <g>
      <rect x={x} y={y - 26} width={w} height={34} fill="#b59a4a" />
      {Array.from({ length: Math.floor(w / 18) }, (_, i) => {
        const xx = x + i * 18 + r() * 10;
        return <line key={i} x1={xx} y1={y + 4} x2={xx + (r() - 0.5) * 40} y2={y - 34 - r() * 18} stroke={r() < 0.5 ? "#d6bf6a" : "#8f7a34"} strokeWidth={5} strokeLinecap="round" />;
      })}
      {asco > 0 && Array.from({ length: Math.floor(w / 90) }, (_, i) => {
        const xx = x + 30 + i * 90 + r() * 40;
        const k = r();
        return k < 0.33 ? <ellipse key={i} cx={xx} cy={y - 10} rx={26} ry={9} fill="#6b4a1a" opacity={asco * 0.9} />
          : k < 0.66 ? <path key={i} d={`M ${xx - 22} ${y - 14} L ${xx + 22} ${y - 22} M ${xx - 18} ${y - 22} L ${xx - 26} ${y - 8} M ${xx + 18} ${y - 28} L ${xx + 28} ${y - 14}`} stroke="#f2ead6" strokeWidth={9} strokeLinecap="round" opacity={asco} />
            : <ellipse key={i} cx={xx} cy={y - 8} rx={34} ry={7} fill="#c9b23a" opacity={asco * 0.7} />;
      })}
    </g>
  );
};

// ── choza de la aldea (cortada al medio: familia + animales adentro)
const Choza: React.FC<{ x: number; t: number; s?: number; corte?: boolean; humo?: boolean }> = ({ x, t, s = 1, corte, humo = true }) => (
  <g transform={`translate(${x} ${SUELO}) scale(${s})`}>
    {humo && [0, 1, 2, 3].map((i) => {
      const k = ((t * 0.25 + i / 4) % 1);
      return <circle key={i} cx={20 + Math.sin(t + i) * 30 + k * 60} cy={-560 - k * 400} r={40 + k * 70} fill="#c9c0d6" opacity={0.35 * (1 - k)} />;
    })}
    <rect x={-300} y={-330} width={600} height={330} fill={corte ? "#5a3a2a" : "#c9965f"} />
    {corte && <rect x={-280} y={-310} width={560} height={310} fill="#3d2418" />}
    {!corte && [-240, -80, 80, 240].map((xx) => <rect key={xx} x={xx - 12} y={-330} width={24} height={330} fill="#6b3a1f" />)}
    {!corte && <rect x={-60} y={-200} width={120} height={200} rx={50} fill="#4a2810" />}
    <path d="M -380 -300 L 0 -620 L 380 -300 Z" fill="#c7a24a" />
    <path d="M 0 -620 L 380 -300 L 200 -300 Z" fill="#a8843a" />
    {Array.from({ length: 14 }, (_, i) => <line key={i} x1={-360 + i * 52} y1={-300} x2={-340 + i * 50} y2={-330 - (i < 7 ? i : 13 - i) * 40} stroke="#9a7a30" strokeWidth={6} />)}
    <rect x={-40} y={-640} width={80} height={40} fill="#3d2418" />
  </g>
);
// vaca de perfil (la del campo y la de la choza); `gatea` = soldado escocés tapado con capa negra
export const Vaca: React.FC<{ x: number; y: number; t: number; s?: number; flip?: boolean; gatea?: boolean; seed?: number; camina?: number }> = ({ x, y, t, s = 1, flip, gatea, seed = 1, camina = 0 }) => {
  const f = Math.sin(t * camina * 6 + seed) * 10;
  const neg = gatea ? "#1a1424" : "#f4efe6";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {[-90, -50, 60, 100].map((xx, i) => <rect key={xx} x={xx - 12} y={-70 + (i % 2 ? f : -f) * 0.3} width={24} height={72} rx={8} fill={gatea ? "#2a2234" : "#d9cfc0"} />)}
      <ellipse cx={0} cy={-120} rx={160} ry={78} fill={neg} />
      {!gatea && <><ellipse cx={-40} cy={-140} rx={50} ry={34} fill="#3a2a2a" /><ellipse cx={60} cy={-100} rx={36} ry={26} fill="#3a2a2a" /></>}
      {gatea && <path d="M -150 -150 Q 0 -230 150 -150" stroke="#3a3048" strokeWidth={10} fill="none" />}
      <g transform={`translate(160 -150) rotate(${Math.sin(t * 1.3 + seed) * 6})`}>
        <ellipse cx={30} cy={0} rx={56} ry={44} fill={neg} />
        {!gatea && <><ellipse cx={66} cy={14} rx={26} ry={20} fill="#f2b8b0" /><circle cx={30} cy={-10} r={8} fill="#2a1530" /><path d="M 0 -36 L -16 -64 M 40 -40 L 50 -66" stroke="#e8dcc0" strokeWidth={10} strokeLinecap="round" /></>}
        {gatea && <><circle cx={44} cy={-6} r={6} fill="#ffe08a" /><circle cx={62} cy={-4} r={6} fill="#ffe08a" /><path d="M 70 -20 L 96 -34" stroke="#c8ccd4" strokeWidth={8} /></>}
      </g>
      {!gatea && <path d={`M -158 -140 Q -190 ${-100 + Math.sin(t * 3) * 10} -180 -60`} stroke="#d9cfc0" strokeWidth={10} fill="none" strokeLinecap="round" />}
    </g>
  );
};

export type Luz = { x: number; y: number; r: number; k?: number };
type MundoP = {
  t: number; c: CamP; hora: number;
  fuego?: number; // fuego del hogar del salón 0..1.5 (1.5 = incendio)
  incendio?: number; // 0..1: humo que baja por el techo del salón + llamas en los juncos
  luces?: Luz[]; // luces extra (velas que lleva el chico, etc.)
  asco?: number; // mugre visible en los juncos
  postigos?: number; // abre los postigos del salón
  nieve?: number; lluvia?: number;
  luzSolar?: boolean; // vela del solar encendida
  humoChoza?: boolean;
};

// el mundo completo (sin actores: los actores los pone cada parte como hijos de <Camara>)
export const Mundo: React.FC<MundoP> = ({ t, c, hora, fuego = 1, incendio = 0, luces = [], asco = 0, postigos = 0, nieve = 0, luzSolar = true }) => {
  const cielo = cieloEn(hora);
  const os = oscuro(hora);
  const r = rnd(77);
  const estrellas = React.useMemo(() => Array.from({ length: 220 }, () => [r() * MW, r() * 2600, 2 + r() * 5, r() * 6]), []);
  // paralaje de colinas lejanas respecto de la cámara
  const px = (c.x - MW / 2) * 0.35, py = (c.y - MH / 2) * 0.25;
  const fl = fuego * (1 + Math.sin(t * 9) * 0.05 + Math.sin(t * 4.3) * 0.04);
  const LUCES: Luz[] = [
    { x: 5800, y: 2860, r: 900 * Math.min(1.4, fl), k: Math.min(1, fl) },
    { x: 3400, y: 3500, r: 420, k: 0.9 },
    ...(luzSolar ? [{ x: 4800, y: 1700, r: 380, k: 0.8 }] : []),
    { x: 6600, y: 1650, r: 360, k: 0.8 },
    { x: 2620, y: 1860, r: 300, k: 0.9 }, { x: 5100, y: 800, r: 300, k: 0.9 }, { x: 6500, y: 800, r: 300, k: 0.9 },
    ...luces,
  ];
  return (
    <svg width={MW} height={MH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="m_cielo" x1="0" y1="0" x2="0" y2="1">
          {cielo.map((col, i) => <stop key={i} offset={[0, 0.3, 0.55, 0.75, 0.92][i]} stopColor={col} />)}
        </linearGradient>
        <linearGradient id="m_agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a5a2a" /><stop offset="1" stopColor="#23280f" /></linearGradient>
        <radialGradient id="m_luz"><stop offset="0" stopColor="#000" stopOpacity={1} /><stop offset="0.55" stopColor="#000" stopOpacity={0.7} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
        <radialGradient id="m_brillo"><stop offset="0" stopColor="#ffb347" stopOpacity={0.55} /><stop offset="1" stopColor="#ff7a3d" stopOpacity={0} /></radialGradient>
        <mask id="m_noche" maskUnits="userSpaceOnUse" x={-5000} y={-4000} width={MW + 10000} height={MH + 8000}>
          <rect x={-5000} y={-4000} width={MW + 10000} height={MH + 8000} fill="#fff" />
          {LUCES.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={l.r} fill="url(#m_luz)" opacity={l.k ?? 1} />)}
        </mask>
      </defs>
      {/* cielo + estrellas + colinas */}
      <rect x={-5000} y={-4000} width={MW + 10000} height={4000} fill={cielo[0]} />
      <rect x={-5000} y={0} width={MW + 10000} height={MH} fill="url(#m_cielo)" />
      {estrellas.map(([x, y, s, f], i) => <circle key={i} cx={x} cy={y} r={s} fill="#fff" opacity={os * (0.45 + 0.45 * Math.sin(t * 2 + f))} />)}
      {/* el sol es un objeto lejanísimo: acompaña a la cámara (cuadro 0: disco gigante detrás de la bandera) y se hunde con la hora */}
      {hora < 0.75 && (() => {
        const sx = c.x - 330 / c.z, sy = c.y - 260 / c.z + Math.min(1, hora) * 1500 / Math.sqrt(c.z), sr = 260 / Math.pow(c.z, 0.45);
        return <g opacity={Math.min(1, (0.75 - hora) * 3)}><circle cx={sx} cy={sy} r={sr * 1.9} fill="#ffb347" opacity={0.25} /><circle cx={sx} cy={sy} r={sr} fill="#fff0b0" /></g>;
      })()}
      {hora > 1.5 && <circle cx={1400 - px * 0.2} cy={3700 - (hora - 1.5) * 1200} r={260} fill="#fff4c8" opacity={(hora - 1.5) * 2} />}
      <g transform={`translate(${px} ${py})`}>
        <path d={`M -6000 3400 L -2000 3300 Q 400 2800 1800 3150 Q 3600 2700 5200 3100 Q 7000 2750 9800 3200 L 13000 3300 L 13000 6400 L -6000 6400 Z`} fill={mezcla("#5a3a7a", "#1c1238", os)} />
      </g>
      <g transform={`translate(${px * 0.5} ${py * 0.5})`}>
        <path d={`M -6000 3550 L -1000 3500 Q 1200 3200 2600 3420 Q 4400 3150 6200 3400 Q 7600 3250 8800 3450 L 13000 3450 L 13000 6400 L -6000 6400 Z`} fill={mezcla("#4a2e62", "#150d2a", os)} />
      </g>
      {/* suelo, aldea, campo */}
      <rect x={-5000} y={SUELO} width={MW + 10000} height={3000} fill={mezcla("#5c7a3a", "#1f2a1a", os)} />
      <rect x={-5000} y={SUELO} width={MW + 10000} height={30} fill={mezcla("#7a9a4a", "#2a3a22", os)} />
      <Choza x={420} t={t} s={1} corte />
      <Choza x={1150} t={t} s={0.75} />
      <Choza x={-150} t={t} s={0.8} />
      {/* foso izquierdo y derecho */}
      <rect x={1900} y={SUELO} width={460} height={420} fill="url(#m_agua)" />
      <rect x={7330} y={SUELO} width={560} height={420} fill="url(#m_agua)" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${1920 + i * 140 + Math.sin(t + i) * 20} ${SUELO + 40} q 30 -14 60 0`} stroke="#7a8a4a" strokeWidth={6} fill="none" />)}
      {/* puente levadizo */}
      <rect x={1880} y={SUELO - 30} width={500} height={34} fill="#7a4520" />
      {/* MURALLA + puerta */}
      <Sillares x={2350} y={2000} w={540} h={SUELO - 2000} seed={11} />
      <Almenas x={2350} y={2000} w={540} />
      <rect x={2420} y={1940} width={400} height={60} fill={PIEDRA2} />
      <path d={`M 2500 ${SUELO} L 2500 3300 Q 2620 3180 2740 3300 L 2740 ${SUELO} Z`} fill="#2a1a2a" />
      <Saetera x={2620} y={2500} />
      <Saetera x={2620} y={2900} />
      {/* PATIO: cocina separada (techo de paja, chimenea) + pozo */}
      <g>
        <rect x={2890} y={SUELO - 10} width={1420} height={20} fill="#8a7a5a" />
        <rect x={3000} y={2900} width={820} height={800} fill="#3d2418" />
        <rect x={2980} y={2900} width={40} height={800} fill="#6b3a1f" />
        <rect x={3800} y={2900} width={40} height={800} fill="#6b3a1f" />
        <path d="M 2940 2920 L 3410 2520 L 3880 2920 Z" fill="#c7a24a" />
        <rect x={3600} y={2480} width={90} height={260} fill={PIEDRA2} />
        {/* hogar de la cocina y caldero */}
        <rect x={3250} y={3480} width={320} height={220} fill={PIEDRA3} />
        <Llama x={3410} y={3690} t={t} s={1.6} seed={3} />
        <path d="M 3330 3540 Q 3410 3640 3490 3540 Z" fill="#2a2a34" />
        <rect x={3080} y={3560} width={120} height={140} fill="#7a4520" />
        {[0, 1, 2].map((i) => <ellipse key={i} cx={3700} cy={3660 - i * 40} rx={60} ry={22} fill="#a8622c" />)}
        <ellipse cx={4100} cy={SUELO - 10} rx={110} ry={30} fill={PIEDRA3} />
        <rect x={3990} y={3560} width={220} height={130} fill={PIEDRA2} />
        <path d="M 3990 3560 L 4100 3460 L 4210 3560" stroke="#6b3a1f" strokeWidth={14} fill="none" />
      </g>
      {/* TORRE DEL HOMENAJE en corte */}
      <g>
        <Sillares x={4300} y={700} w={3050} h={SUELO - 700} seed={21} c={PIEDRA2} />
        <Almenas x={4300} y={700} w={3050} c={PIEDRA3} />
        {/* interiores (pared del fondo) */}
        <Sillares x={4450} y={1020} w={2750} h={930} seed={22} c="#b9a8c4" fila={80} />
        <Sillares x={4450} y={2040} w={2750} h={930} seed={23} c="#a8957a" fila={90} />
        <Sillares x={4450} y={3060} w={2750} h={630} seed={24} c="#8a7a6a" fila={80} />
        {/* pisos de madera */}
        {[1950, 2970].map((y) => <g key={y}><rect x={4440} y={y} width={2770} height={90} fill="#7a4520" /><rect x={4440} y={y} width={2770} height={18} fill="#a8622c" />{Array.from({ length: 24 }, (_, i) => <rect key={i} x={4470 + i * 116} y={y + 30} width={40} height={60} fill="#5a3418" />)}</g>)}
        {/* bandera en lo alto de la torre */}
        <rect x={5790} y={300} width={20} height={420} fill="#5a3418" />
        <path d={`M 5810 310 Q ${5950} ${300 + Math.sin(t * 4) * 30} ${6110} ${330 + Math.sin(t * 4 + 1) * 40} L ${6090} ${440 + Math.sin(t * 4 + 1.5) * 30} Q 5950 ${420 + Math.sin(t * 4 + 0.5) * 30} 5810 430 Z`} fill={C.rojo} />
        <circle cx={5930} cy={370 + Math.sin(t * 4 + 0.6) * 20} r={32} fill={C.oro} />
        {/* puerta del salón en el muro + escalera exterior de madera desde el patio */}
        <rect x={4300} y={2620} width={150} height={350} fill="#2a1a2a" />
        <path d="M 4300 2620 Q 4375 2540 4450 2620 Z" fill="#2a1a2a" />
        <path d="M 3900 3700 L 4300 2975" stroke="#5a3418" strokeWidth={30} />
        <path d="M 4010 3700 L 4300 3170" stroke="#5a3418" strokeWidth={20} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={3920 + i * 32} y1={3665 - i * 58} x2={4010 + i * 26} y2={3665 - i * 46} stroke="#7a4520" strokeWidth={16} />)}
        <rect x={4180} y={2960} width={130} height={24} fill="#7a4520" />
        {/* escalera caracol a la izquierda */}
        <rect x={4450} y={1020} width={180} height={2670} fill="#6b5d7c" />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M 4450 ${1080 + i * 88} L 4630 ${1120 + i * 88}`} stroke="#4a3f5a" strokeWidth={14} />)}
        {/* SOLAR: cama con dosel, chimenea, tapiz */}
        <g>
          <rect x={4700} y={1080} width={500} height={360} fill={C.rojo} />
          <path d="M 4700 1080 L 5200 1080 L 5200 1440 Q 4950 1380 4700 1440 Z" fill="#b5263a" />
          <circle cx={4950} cy={1250} r={90} fill={C.oro} opacity={0.85} />
          <path d="M 4950 1180 L 4980 1250 L 4950 1320 L 4920 1250 Z" fill="#b5263a" />
          {/* cama */}
          <rect x={5300} y={1300} width={30} height={650} fill="#5a3418" />
          <rect x={5880} y={1300} width={30} height={650} fill="#5a3418" />
          <rect x={5280} y={1280} width={650} height={60} fill="#7a1d4a" />
          <path d="M 5300 1340 Q 5340 1600 5310 1880 L 5360 1880 Q 5400 1600 5360 1340 Z" fill="#9b2b5a" />
          <path d="M 5910 1340 Q 5870 1600 5900 1880 L 5850 1880 Q 5810 1600 5850 1340 Z" fill="#9b2b5a" />
          <rect x={5320} y={1760} width={570} height={110} rx={20} fill="#f2ead6" />
          <rect x={5320} y={1800} width={570} height={110} rx={10} fill="#3a5bb5" />
          <rect x={5330} y={1730} width={140} height={60} rx={26} fill="#fff" />
          {/* chimenea del solar */}
          <rect x={4700} y={1640} width={300} height={310} fill={PIEDRA3} />
          <rect x={4750} y={1720} width={200} height={230} fill="#1a0d14" />
          {luzSolar && <Llama x={4850} y={1945} t={t} s={1.3} seed={8} />}
        </g>
        {/* CAPILLA: altar, velas de cera, vitral (el único vidrio) */}
        <g>
          <rect x={6180} y={1020} width={14} height={930} fill="#6b5d7c" />
          <Saetera x={6700} y={1300} vidrio />
          <rect x={6450} y={1700} width={500} height={250} fill="#e8dcc0" />
          <rect x={6450} y={1700} width={500} height={40} fill={C.oro} />
          <rect x={6680} y={1560} width={40} height={140} fill={C.oro} />
          <rect x={6640} y={1600} width={120} height={30} fill={C.oro} />
          {[6500, 6900].map((x) => <g key={x}><rect x={x - 14} y={1600} width={28} height={100} fill="#fff6e0" /><Llama x={x} y={1600} t={t} s={0.7} seed={x} /></g>)}
        </g>
        {/* GRAN SALÓN: puertas, bancos, mesas, hogar central, estrado con dosel, saeteras con postigos */}
        <g>
          <rect x={4640} y={2560} width={260} height={410} rx={20} fill="#4a2810" />
          <rect x={4640} y={2560} width={260} height={410} rx={20} fill="none" stroke="#2a1608" strokeWidth={14} />
          <rect x={4640} y={2740} width={260} height={30} fill="#2a1608" />
          {[5150, 6450].map((x) => <Saetera key={x} x={x} y={2300} abre={postigos} />)}
          {/* hogar central con su humo hacia el techo */}
          <ellipse cx={5800} cy={2950} rx={230} ry={36} fill={PIEDRA3} />
          <Llama x={5720} y={2940} t={t} s={1.9 * Math.min(1.5, fuego)} seed={4} />
          <Llama x={5860} y={2945} t={t} s={2.3 * Math.min(1.5, fuego)} seed={5} />
          <Llama x={5800} y={2930} t={t} s={1.5 * Math.min(1.5, fuego)} seed={6} />
          {[0, 1, 2, 3, 4].map((i) => {
            const k = ((t * 0.2 + i / 5) % 1);
            return <circle key={i} cx={5800 + Math.sin(t * 0.7 + i) * 60} cy={2780 - k * 700} r={50 + k * 90} fill="#6a5a6a" opacity={0.28 * (1 - k)} />;
          })}
          {/* estrado */}
          <rect x={6550} y={2840} width={660} height={130} fill="#7a4520" />
          <rect x={6620} y={2120} width={520} height={360} fill="#2d5bb5" />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${6620 + i * 87} 2120 l 43 60 l 44 -60`} fill="#f7c548" />)}
          <rect x={6620} y={2760} width={520} height={30} fill="#a8622c" />
          {[6660, 7080].map((x) => <rect key={x} x={x} y={2790} width={24} height={60} fill="#5a3418" />)}
          {/* mesas largas */}
          {[[4980, 5560], [6040, 6480]].map(([a, b]) => <g key={a}><rect x={a} y={2820} width={b - a} height={26} fill="#a8622c" /><rect x={a + 30} y={2846} width={20} height={124} fill="#5a3418" /><rect x={b - 50} y={2846} width={20} height={124} fill="#5a3418" /><rect x={a} y={2900} width={b - a} height={18} fill="#7a4520" /></g>)}
          {/* tapiz del salón */}
          <rect x={5380} y={2120} width={260} height={360} fill={C.violeta} />
          <path d="M 5420 2400 L 5510 2200 L 5600 2400 Z" fill={C.oro} />
          <Juncos x={4450} y={2965} w={2750} asco={asco} />
        </g>
        {/* ALMACÉN: barriles, bolsas de grano, jamones colgados */}
        <g>
          {[4800, 5000, 5200].map((x, i) => <g key={x}><ellipse cx={x} cy={3560 - (i === 1 ? 160 : 0)} rx={90} ry={110} fill="#8a4a20" /><rect x={x - 90} y={3530 - (i === 1 ? 160 : 0)} width={180} height={14} fill="#3a3a48" /><rect x={x - 90} y={3590 - (i === 1 ? 160 : 0)} width={180} height={14} fill="#3a3a48" /></g>)}
          {[6100, 6260, 6420, 6180, 6340].map((x, i) => <path key={i} d={`M ${x - 80} ${3690 - (i > 2 ? 150 : 0)} Q ${x - 90} ${3560 - (i > 2 ? 150 : 0)} ${x - 30} ${3530 - (i > 2 ? 150 : 0)} L ${x + 30} ${3530 - (i > 2 ? 150 : 0)} Q ${x + 90} ${3560 - (i > 2 ? 150 : 0)} ${x + 80} ${3690 - (i > 2 ? 150 : 0)} Z`} fill="#d9c08a" stroke="#a8843a" strokeWidth={6} />)}
          {[5600, 5750].map((x) => <g key={x}><line x1={x} y1={3060} x2={x} y2={3160} stroke="#5a3418" strokeWidth={6} /><ellipse cx={x} cy={3220} rx={46} ry={70} fill="#b5452c" /></g>)}
          <rect x={6700} y={3480} width={400} height={30} fill="#7a4520" />
          {[6740, 6860, 6980].map((x) => <rect key={x} x={x} y={3400} width={70} height={80} rx={10} fill="#c98f4a" />)}
        </g>
        {/* GARDEROBE: torrecita saliente a la derecha del salón + conducto hasta el foso */}
        <g>
          <rect x={7340} y={2180} width={220} height={420} fill={PIEDRA2} />
          <path d="M 7340 2600 L 7560 2600 L 7450 2700 Z" fill={PIEDRA2} />
          <rect x={7370} y={2230} width={160} height={300} fill="#3d3048" />
          <rect x={7360} y={2440} width={180} height={40} fill="#7a4520" />
          <ellipse cx={7450} cy={2446} rx={40} ry={10} fill="#1a0d14" />
          <rect x={7432} y={2480} width={36} height={SUELO - 2480} fill="#2a2030" opacity={0.75} />
          <path d={`M 7400 ${SUELO - 300} Q 7380 ${SUELO - 100} 7360 ${SUELO}`} stroke="#5a4a1a" strokeWidth={30} fill="none" opacity={0.6} />
        </g>
      </g>
      {/* noche: oscurece todo menos los círculos de luz; y el brillo cálido del fuego */}
      <rect x={-5000} y={-4000} width={MW + 10000} height={MH + 8000} fill="#0a0620" opacity={os * 0.5} mask="url(#m_noche)" />
      <circle cx={5800} cy={2860} r={700 * Math.min(1.5, fl)} fill="url(#m_brillo)" opacity={Math.min(1, fuego) * (0.4 + os * 0.4)} />
      {/* incendio: humo que baja del techo del salón y llamas en los juncos */}
      {incendio > 0 && (
        <g>
          <rect x={4450} y={2040} width={2750} height={930 * incendio} fill="#2a2030" opacity={0.85} />
          {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={4500 + i * 200 + Math.sin(t + i) * 40} cy={2040 + 930 * incendio + Math.sin(t * 1.3 + i) * 30} r={130} fill="#2a2030" opacity={0.85} />)}
          {Array.from({ length: Math.round(16 * incendio) }, (_, i) => <Llama key={i} x={5900 - i * 90 * (i % 2 ? 1 : -1) * 0.9} y={2965} t={t} s={1.2 + (i % 3) * 0.5} seed={i + 40} />)}
        </g>
      )}
      {nieve > 0 && Array.from({ length: 160 }, (_, i) => {
        const rr = rnd(i + 900);
        const x0 = rr() * MW, v = 60 + rr() * 80;
        const y = ((rr() * MH + t * v) % MH);
        return <circle key={i} cx={x0 + Math.sin(t + i) * 40} cy={y} r={6 + rr() * 8} fill="#fff" opacity={nieve * 0.8} />;
      })}
    </svg>
  );
};

// cartel con la hora (vela-reloj con marcas: se consume a lo largo del video)
export const HORAS = ["4 PM", "6 PM", "8 PM", "10 PM", "MIDNIGHT", "2 AM", "4 AM", "DAWN"];
export const RelojVela: React.FC<{ t: number; hora: string; consumo: number; x?: number; y?: number; s?: number; op?: number }> = ({ t, hora, consumo, x = 1760, y = 150, s = 1, op = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: op, display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: C.crema, background: "rgba(27,18,64,.85)", padding: "6px 18px", borderRadius: 14, whiteSpace: "nowrap" }}>{hora}</div>
    <svg width={60} height={150} viewBox="-30 -150 60 150" style={{ overflow: "visible" }}>
      <rect x={-18} y={-120 + 100 * consumo} width={36} height={120 - 100 * consumo} fill="#fff3d6" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-18} y1={-110 + i * 20} x2={18} y2={-110 + i * 20} stroke={C.rojo} strokeWidth={3} opacity={-110 + i * 20 > -120 + 100 * consumo ? 1 : 0} />)}
      <g transform={`translate(0 ${-120 + 100 * consumo})`}><path d={`M 0 -36 Q ${12 + Math.sin(t * 11) * 4} -14 8 0 Q 0 6 -8 0 Q -10 -16 0 -36 Z`} fill="#ffb020" /></g>
      <rect x={-26} y={-4} width={52} height={10} rx={4} fill={C.ambar} />
    </svg>
  </div>
);
