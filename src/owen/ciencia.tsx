// INSERTOS DE CIENCIA del canal (pantalla completa, 1920x1080, vector plano). Cada uno corre con useF() (0 = su corte).
// Fondo común «pizarra noche» azul con grilla; acentos VERDE (el número flotante) y ámbar.
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { useF } from "../anikit/camara";
import { OWEN, VERDE } from "./elenco";
import { Actor } from "../anikit/actor";
import { EXPRESIONES } from "../anikit/personaje";

const AMBAR = "#ffc24a", ROJO = "#ff5a4a", TINTA = "#f4efe4", FONDO = "#14203a";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

// el que explica: Owen chiquito en la esquina que señala, habla, piensa y reacciona (la pizarra nunca queda sin personaje)
const POSES_PROFE = ["señalar", "hablar", "pensar", "señalar", "manosCintura", "hablar", "encogerse", "señalar"];
const CARAS_PROFE = ["neutral", "feliz", "pensar", "sorpresa", "neutral", "feliz"];
const Profe: React.FC<{ f: number }> = ({ f }) => {
  const per = 22;
  const poses = Array.from({ length: 90 }).map((_, i) => ({ f: i * per, v: POSES_PROFE[(i * 3) % POSES_PROFE.length] }));
  const caras = Array.from({ length: 90 }).map((_, i) => ({ f: i * per + 6, v: CARAS_PROFE[i % CARAS_PROFE.length] in EXPRESIONES ? CARAS_PROFE[i % CARAS_PROFE.length] : "neutral" }));
  // camina de un lado al otro de su rincón cada ~4 s (pasos reales), se para a explicar
  const ruta = Array.from({ length: 24 }).flatMap((_, i) => { const x = i % 2 ? 1560 : 1770; return [{ f: i * 120 + 40, x: i % 2 ? 1770 : 1560, y: 1040 }, { f: i * 120 + 100, x, y: 1040 }]; });
  const dir = Array.from({ length: 24 }).map((_, i) => ({ f: i * 120 + 40, v: (i % 2 ? -1 : 1) as 1 | -1 }));
  return (
    <g>
      <Actor look={OWEN} escala={1.35} seed={9} ruta={[{ f: 0, x: 1770, y: 1040 }, ...ruta]} dir={[{ f: 0, v: -1 }, ...dir]}
        poses={poses} caras={caras} habla={Array.from({ length: 60 }).map((_, i) => [i * 45 + 4, i * 45 + 34] as [number, number])} miradas={[{ f: 0, v: { x: -0.7, y: -0.3 } }, { f: 150, v: { x: 0.4, y: 0.2 } }, { f: 200, v: { x: -0.7, y: -0.3 } }, { f: 400, v: { x: 0.3, y: 0 } }, { f: 440, v: { x: -0.7, y: -0.3 } }]} />
    </g>
  );
};

export const Pizarra: React.FC<{ children: React.ReactNode; titulo?: string; fuente?: string; profe?: boolean }> = ({ children, titulo, fuente, profe = true }) => {
  const f = useF();
  return (
    <AbsoluteFill style={{ background: FONDO }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs><radialGradient id="pzv" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.45} /></radialGradient></defs>
        {Array.from({ length: 25 }).map((_, i) => <rect key={`v${i}`} x={i * 80} y={0} width={2} height={1080} fill="#22325a" />)}
        {Array.from({ length: 14 }).map((_, i) => <rect key={`h${i}`} x={0} y={i * 80} width={1920} height={2} fill="#22325a" />)}
        {children}
        {profe && <Profe f={f} />}
        {titulo && <text x={960} y={178} fontFamily={F_HUD} fontWeight={600} fontSize={52} letterSpacing={4} fill={TINTA} textAnchor="middle" opacity={ease(f, 0, 10)}>{titulo}</text>}
        {fuente && <text x={60} y={1040} fontFamily={F_HUD} fontSize={24} fill="#8a9ac0" textAnchor="start" opacity={ease(f, 10, 25)}>{fuente}</text>}
        <rect width={1920} height={1080} fill="url(#pzv)" />
      </svg>
    </AbsoluteFill>
  );
};

// ADN que gira con banderitas en los sitios CpG; el contador sube hasta n
export const AdnCpG: React.FC<{ n?: number; desde?: number }> = ({ n = 353, desde = 20 }) => {
  const f = useF();
  const vistos = Math.round(interpolate(f, [desde, desde + 90], [0, n], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pasos = 44;
  return (
    <Pizarra titulo="353 SPOTS ON YOUR DNA" fuente="Horvath, Genome Biology, 2013">
      {Array.from({ length: pasos }).map((_, i) => {
        const x = 160 + i * 37;
        const ph = i * 0.42 + f * 0.05;
        const y1 = 560 + Math.sin(ph) * 150, y2 = 560 - Math.sin(ph) * 150;
        const z = Math.cos(ph);
        const flag = i % 3 === 1 && (i / pasos) * n < vistos;
        return (
          <g key={i}>
            <line x1={x} y1={y1} x2={x} y2={y2} stroke={["#5b8fd6", "#e86a5a", "#e7b240", "#4fbf8a"][i % 4]} strokeWidth={8} opacity={0.55 + 0.35 * z} />
            <circle cx={x} cy={y1} r={13 + 4 * z} fill="#9cc8ff" />
            <circle cx={x} cy={y2} r={13 - 4 * z} fill="#ff9ab0" />
            {flag && <g transform={`translate(${x},${y1 - 20}) scale(${ease(f, desde + (i / pasos) * 90, desde + (i / pasos) * 90 + 8)})`}><rect x={-2} y={-60} width={4} height={60} fill={TINTA} /><path d="M2,-60 h34 l-8,12 l8,12 h-34 Z" fill={VERDE} /></g>}
          </g>
        );
      })}
      <text x={960} y={900} fontFamily={F_HUD} fontWeight={600} fontSize={110} fill={VERDE} textAnchor="middle">{vistos}</text>
      <text x={960} y={960} fontFamily={F_HUD} fontSize={34} letterSpacing={3} fill={TINTA} textAnchor="middle">CpG SITES · CHEMICAL TAGS THAT CHANGE WITH AGE</text>
    </Pizarra>
  );
};

const Esfera: React.FC<{ x: number; y: number; r: number; etiqueta: string; valor: number; color: string; vel: number; f: number }> = ({ x, y, r, etiqueta, valor, color, vel, f }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r + 16} fill="#0c1426" />
    <circle r={r} fill={TINTA} stroke={color} strokeWidth={14} />
    {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={-4} y={-r + 14} width={8} height={k % 3 ? 18 : 34} fill="#20242c" transform={`rotate(${k * 30})`} />)}
    <rect x={-6} y={-r * 0.78} width={12} height={r * 0.78} rx={6} fill="#20242c" transform={`rotate(${f * vel})`} />
    <rect x={-8} y={-r * 0.5} width={16} height={r * 0.5} rx={8} fill={color} transform={`rotate(${f * vel / 12})`} />
    <circle r={14} fill="#20242c" />
    <text y={r + 90} fontFamily={F_HUD} fontWeight={600} fontSize={40} letterSpacing={3} fill={TINTA} textAnchor="middle">{etiqueta}</text>
    <text y={r + 190} fontFamily={F_HUD} fontWeight={600} fontSize={110} fill={color} textAnchor="middle">{valor}</text>
  </g>
);

// dos relojes: el del calendario y el biológico (el biológico corre a otra velocidad)
export const DosRelojes: React.FC<{ cal: number; bio: number; titulo?: string }> = ({ cal, bio, titulo = "TWO CLOCKS" }) => {
  const f = useF();
  const vb = bio > cal ? 9 : bio < cal ? 1.4 : 3;
  const vbio = Math.round(interpolate(f, [15, 60], [cal, bio], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Pizarra titulo={titulo}>
      <Esfera x={600} y={470} r={200} etiqueta="CALENDAR AGE" valor={cal} color={AMBAR} vel={3} f={f} />
      <Esfera x={1320} y={470} r={200} etiqueta="BIOLOGICAL AGE" valor={vbio} color={bio > cal ? ROJO : VERDE} vel={vb} f={f} />
    </Pizarra>
  );
};

// dinamómetro de mano: la aguja sube a `kg`; `caida` resta libras y aparece el +16 %
export const Dinamometro: React.FC<{ lb?: number; caida?: number; desdeCaida?: number }> = ({ lb = 90, caida = 11, desdeCaida = 70 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const sube = spring({ frame: f - 10, fps, config: { damping: 9 } });
  const baja = ease(f, desdeCaida, desdeCaida + 25);
  const v = lb * sube - caida * baja;
  const ang = -120 + (v / 140) * 240;
  return (
    <Pizarra titulo="GRIP STRENGTH" fuente="Leong et al., The Lancet, 2015 · ~140,000 people · 17 countries">
      <g transform="translate(760,600)">
        <path d="M-300,0 A300,300 0 1,1 300,0" fill="none" stroke="#2a3a62" strokeWidth={46} />
        <path d="M-300,0 A300,300 0 0,1 -150,-260" fill="none" stroke={ROJO} strokeWidth={46} opacity={0.8} />
        {Array.from({ length: 15 }).map((_, k) => <rect key={k} x={-3} y={-340} width={6} height={k % 2 ? 20 : 36} fill={TINTA} transform={`rotate(${-120 + k * (240 / 14)})`} />)}
        <rect x={-8} y={-270} width={16} height={270} rx={8} fill={AMBAR} transform={`rotate(${ang})`} />
        <circle r={34} fill={TINTA} />
        <text y={140} fontFamily={F_HUD} fontWeight={600} fontSize={96} fill={TINTA} textAnchor="middle">{Math.round(v)} lb</text>
      </g>
      {/* la mano que aprieta el dinamómetro */}
      <g transform="translate(1440,560)">
        <rect x={-50} y={-180} width={100} height={360} rx={40} fill="#8a9096" />
        <rect x={-40} y={-60} width={80} height={120} rx={10} fill="#20242c" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={-130 + sube * 30} y={-130 + k * 64} width={150} height={52} rx={26} fill="#e0a77e" />)}
      </g>
      <g opacity={baja}>
        <text x={1440} y={860} fontFamily={F_HUD} fontWeight={600} fontSize={64} fill={ROJO} textAnchor="middle">−{caida} lb = +16% risk</text>
      </g>
    </Pizarra>
  );
};

// velocímetro de la caminata (m/s) de un viejo que camina sobre una cinta
export const Velocimetro: React.FC<{ ms?: number; etiqueta?: string }> = ({ ms = 1.2, etiqueta = "WALKING SPEED" }) => {
  const f = useF();
  const v = ms * ease(f, 10, 50);
  const ang = -120 + (v / 1.6) * 240;
  return (
    <Pizarra titulo={etiqueta} fuente="Studenski et al., JAMA, 2011 · ~35,000 older adults">
      <g transform="translate(960,640)">
        <path d="M-320,0 A320,320 0 1,1 320,0" fill="none" stroke="#2a3a62" strokeWidth={50} />
        <path d="M-320,0 A320,320 0 0,1 -230,-222" fill="none" stroke={ROJO} strokeWidth={50} />
        <path d="M160,-277 A320,320 0 0,1 320,0" fill="none" stroke={VERDE} strokeWidth={50} />
        <rect x={-9} y={-290} width={18} height={290} rx={9} fill={AMBAR} transform={`rotate(${ang})`} />
        <circle r={36} fill={TINTA} />
        <text y={150} fontFamily={F_HUD} fontWeight={600} fontSize={100} fill={TINTA} textAnchor="middle">{v.toFixed(1)} m/s</text>
      </g>
      {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={((k * 180 - f * 6) % 2160) - 120} y={1000} width={90} height={10} fill="#2a3a62" />)}
    </Pizarra>
  );
};

// soledad = cigarrillos por día: van apareciendo hasta n
export const Cigarrillos: React.FC<{ n?: number }> = ({ n = 15 }) => {
  const f = useF();
  const vistos = Math.min(n, Math.floor(Math.max(0, f - 15) / 3));
  return (
    <Pizarra titulo="LONELINESS" fuente="Holt-Lunstad et al., PLOS Medicine, 2010 · 148 studies">
      {Array.from({ length: n }).map((_, k) => {
        const on = k < vistos;
        const x = 360 + (k % 5) * 250, y = 330 + Math.floor(k / 5) * 170;
        return (
          <g key={k} transform={`translate(${x},${y}) rotate(-8) scale(${on ? ease(f, 15 + k * 3, 21 + k * 3) : 0})`}>
            <rect x={-100} y={-14} width={160} height={28} rx={6} fill={TINTA} />
            <rect x={60} y={-14} width={46} height={28} rx={6} fill="#d98a3a" />
            <rect x={-108} y={-14} width={12} height={28} rx={4} fill={ROJO} />
            <path d={`M-112,-16 q-16,-30 0,-56 q16,-26 -4,-50`} stroke="#c9d3e0" strokeWidth={5} fill="none" opacity={0.4 + 0.2 * Math.sin(f / 7 + k)} />
          </g>
        );
      })}
      <text x={960} y={900} fontFamily={F_HUD} fontWeight={600} fontSize={80} fill={AMBAR} textAnchor="middle" opacity={ease(f, 15 + n * 3, 25 + n * 3)}>≈ {n} CIGARETTES A DAY</text>
    </Pizarra>
  );
};

// celular en primer plano con un mensaje (va solo, o adentro de un plano como «hud»)
export const MensajeCel: React.FC<{ de: string; texto: string; extra?: string; desde?: number; extraDesde?: number; x?: number; y?: number; s?: number }> = ({ de, texto, extra, desde = 0, extraDesde, x = 960, y = 560, s = 1 }) => {
  const xd = extraDesde ?? desde + 60;
  const f = useF();
  const e = ease(f, desde, desde + 14);
  const chars = Math.floor(Math.max(0, f - desde - 10) * 1.8);
  return (
    <g transform={`translate(${x},${y + (1 - e) * 500}) scale(${s})`} opacity={e}>
      <rect x={-230} y={-430} width={460} height={860} rx={60} fill="#111317" />
      <rect x={-210} y={-400} width={420} height={800} rx={40} fill="#0f1a2c" />
      <rect x={-50} y={-418} width={100} height={18} rx={9} fill="#000" />
      <text x={0} y={-330} fontFamily={F_HUD} fontWeight={600} fontSize={60} fill={TINTA} textAnchor="middle">11:02</text>
      <rect x={-190} y={-250} width={380} height={300} rx={26} fill="#f4f6fa" />
      <text x={-160} y={-200} fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#20242c">{de}</text>
      {texto.slice(0, chars).split("\n").map((l, i) => <text key={i} x={-160} y={-150 + i * 40} fontFamily={F_HUD} fontSize={28} fill="#20242c">{l}</text>)}
      {extra && <text x={0} y={140} fontFamily={F_HUD} fontWeight={600} fontSize={46} fill={ROJO} textAnchor="middle" opacity={ease(f, xd, xd + 8)} transform={`translate(0,${140 * 0}) scale(${1 + 0.25 * Math.max(0, 1 - Math.abs(f - xd - 4) / 6)})`} style={{ transformOrigin: "0px 130px" }}>{extra}</text>}
    </g>
  );
};

// lista de «su día» que se va tachando en rojo
export const ListaDia: React.FC<{ items: string[]; titulo?: string; check?: boolean; tiempos?: number[] }> = ({ items, titulo = "OWEN'S DAY", check, tiempos }) => {
  const f = useF();
  return (
    <Pizarra titulo={titulo}>
      <rect x={560} y={200} width={800} height={180 + items.length * 120} rx={14} fill="#fbf6e8" transform="rotate(-2 960 540)" />
      {items.map((t, i) => {
        const a = tiempos ? tiempos[i] : 15 + i * 26;
        return (
          <g key={i} opacity={ease(f, a, a + 6)} transform="rotate(-2 960 540)">
            <text x={640} y={330 + i * 120} fontFamily={F_MANO} fontWeight={700} fontSize={70} fill="#2a2420">{t}</text>
            {check ? <path d={`M1200,${300 + i * 120} l24,26 l50,-60`} stroke={VERDE} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={140} strokeDashoffset={140 * (1 - ease(f, a + 8, a + 16))} />
              : <path d={`M630,${310 + i * 120} q300,-12 640,4`} stroke={ROJO} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - ease(f, a + 12, a + 20))} />}
          </g>
        );
      })}
    </Pizarra>
  );
};
