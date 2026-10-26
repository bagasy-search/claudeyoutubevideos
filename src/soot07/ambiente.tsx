import React from "react";
import { Persona, CIVIL } from "./persona";
import { rnd } from "../soot/lib";
import { CALLE, temaEn, X } from "./motor07";
import { M } from "./guion07";
import { Tema, SvgMundo } from "./mundo";

// OJO v3: la calle nunca está vacía. Viñetas fijas en el mundo (plano medio, un poco más chicas que el nene):
// vecinos charlando, borracho con ánfora, vendedor cargando, perro que olfatea, gato que salta al barril,
// laternarius con antorcha alumbrando a su amo. El nene pasa al lado y siguen en lo suyo.
const K = "#1a0d24";
const VIVOS: Tema[] = ["insulas", "callejon", "via", "cruce", "valle"];
export type Vin = { x: number; tipo: number; seed: number };
export const VINETAS: Vin[] = (() => {
  const out: Vin[] = [];
  if (!CALLE.length) return out;
  const x0 = CALLE[0].x, x1 = CALLE[CALLE.length - 1].x;
  // lejos de las escenas que ya tienen su gente (el emperador, el matón, Craso, los vigiles, la multitud, la maceta, el rico, el abogado)
  const ocupado = ["emperador", "matón", "craso", "botas", "vienen", "multitud", "cayo", "rico", "abogado", "t1", "pasos", "oferta"].map((n) => M[n]).filter((v) => v !== undefined).map((tt) => X(tt));
  let k = 0;
  for (let x = x0 + 900; x < x1; x += 1150) {
    const r = rnd(k * 17 + 3);
    if (VIVOS.includes(temaEn(x)) && ocupado.every((o) => Math.abs(o - x) > 1500)) out.push({ x: x + r() * 300, tipo: k % 6, seed: 300 + k * 5 });
    k++;
  }
  return out;
})();
export const lucesVinetas = (desde: number, hasta: number) => VINETAS.filter((v) => v.tipo === 5 && v.x > desde && v.x < hasta).map((v) => ({ x: v.x + 70, y: -250 }));

const anfora = <g transform="translate(0 10)"><path d="M -8 -40 L 8 -40 L 10 -30 Q 30 -18 24 10 Q 18 30 0 34 Q -18 30 -24 10 Q -30 -18 -10 -30 Z" fill="#a0502a" stroke={K} strokeWidth={4} /></g>;
const saco = <g transform="translate(0 -20)"><ellipse rx={44} ry={30} fill="#c9a46a" stroke={K} strokeWidth={4} /><path d="M -10 -28 q 10 -12 20 0" stroke={K} strokeWidth={4} fill="none" /></g>;
const antorcha = (t: number) => <g><rect x={-6} y={-70} width={12} height={90} fill="#6b3a1f" stroke={K} strokeWidth={4} /><path d={`M -18 -66 Q -14 ${-110 - Math.sin(t * 13) * 10} 0 -130 Q 14 ${-104 + Math.sin(t * 9) * 8} 18 -66 Z`} fill="#ffd23a" stroke="#ff8a2a" strokeWidth={4} /></g>;

const Perro: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => {
  const olf = Math.sin(t * 1.1) > 0.2; // baja la cabeza a olfatear
  const pata = Math.sin(t * 8) * (olf ? 0 : 10);
  return (
    <g transform={`scale(${s})`}>
      {[-46, -26, 26, 46].map((x, k) => <rect key={k} x={x - 7} y={-46} width={14} height={46} rx={6} fill="#8a5a2a" stroke={K} strokeWidth={4} transform={`rotate(${k % 2 ? pata : -pata} ${x} -46)`} />)}
      <ellipse cx={0} cy={-62} rx={66} ry={30} fill="#a06a34" stroke={K} strokeWidth={5} />
      <path d={`M -62 -70 Q -96 ${-110 + Math.sin(t * 14) * 14} -80 -118`} stroke={K} strokeWidth={10} fill="none" strokeLinecap="round" />
      <g transform={`translate(64 ${olf ? -40 : -86}) rotate(${olf ? 30 : 0})`}>
        <ellipse rx={30} ry={24} fill="#a06a34" stroke={K} strokeWidth={5} />
        <ellipse cx={26} cy={8} rx={18} ry={12} fill="#c98a4a" stroke={K} strokeWidth={4} /><circle cx={40} cy={4} r={6} fill={K} />
        <circle cx={6} cy={-6} r={5} fill={K} /><path d="M -18 -18 Q -30 0 -20 16" fill="#6a3a1a" stroke={K} strokeWidth={4} />
      </g>
    </g>
  );
};
const Gato: React.FC<{ t: number }> = ({ t }) => {
  const c = (t % 6) / 6; // cada 6 s salta del piso al barril y vuelve
  const sube = c > 0.3 && c < 0.75;
  const u = c < 0.3 ? 0 : c < 0.4 ? (c - 0.3) / 0.1 : c < 0.75 ? 1 : c < 0.85 ? 1 - (c - 0.75) / 0.1 : 0;
  const y = -u * 92 - Math.sin(u * Math.PI) * 60;
  return (
    <g>
      <g transform="translate(60 0)"><rect x={-34} y={-92} width={68} height={92} rx={14} fill="#6b4024" stroke="#26170f" strokeWidth={4} /><rect x={-36} y={-72} width={72} height={8} fill="#3a2a1e" /><rect x={-36} y={-28} width={72} height={8} fill="#3a2a1e" /></g>
      <g transform={`translate(${u * 60} ${y})`}>
        <ellipse cx={0} cy={-22} rx={30} ry={18} fill="#2a2230" stroke={K} strokeWidth={4} />
        <circle cx={26} cy={-40} r={16} fill="#2a2230" stroke={K} strokeWidth={4} />
        <path d="M 16 -54 l 4 -14 l 8 10 M 30 -54 l 6 -12 l 4 12" fill="#2a2230" stroke={K} strokeWidth={3} />
        <circle cx={22} cy={-42} r={4} fill="#ffe24a" /><circle cx={32} cy={-42} r={4} fill="#ffe24a" />
        <path d={`M -28 -26 Q -54 ${-50 + Math.sin(t * 3) * 10} -44 -70`} stroke="#2a2230" strokeWidth={7} fill="none" strokeLinecap="round" />
        {!sube && <path d="M -16 -6 v 6 M 14 -6 v 6" stroke={K} strokeWidth={5} />}
      </g>
    </g>
  );
};

/** Dibujar en coordenadas de mundo (dentro de la Capa de la calle). */
export const Ambiente: React.FC<{ t: number; camX: number; ancho: number }> = ({ t, camX, ancho }) => {
  const vis = VINETAS.filter((v) => Math.abs(v.x - camX) < ancho);
  return (
    <>
      {vis.map((v) => {
        const r = rnd(v.seed);
        const h = 225 + r() * 20;
        const ph = r() * 9;
        if (v.tipo === 0) return (
          <React.Fragment key={v.x}>
            <Persona x={v.x} y={-8} h={h} t={t} seed={v.seed} ropa={CIVIL(v.seed % 7)} expr="feliz" habla={Math.sin(t * 0.8 + ph) > 0} bD={Math.sin(t * 0.8 + ph) > 0 ? 70 + Math.sin(t * 5) * 15 : 15} cD={50} />
            <Persona x={v.x + 120} y={-8} h={h * 0.95} t={t} seed={v.seed + 1} ropa={CIVIL((v.seed + 3) % 7)} expr={Math.sin(t * 0.8 + ph) > 0 ? "neutro" : "feliz"} habla={Math.sin(t * 0.8 + ph) <= 0} flip bI={Math.sin(t * 0.8 + ph) <= 0 ? 80 : 20} />
          </React.Fragment>
        );
        if (v.tipo === 1) return <Persona key={v.x} x={v.x + Math.sin(t * 0.7 + ph) * 30} y={-8} h={h} t={t} seed={v.seed} ropa={CIVIL(v.seed % 7)} expr="feliz" inclina={Math.sin(t * 1.6 + ph) * 14} ladea={Math.sin(t * 1.1) * 10} manoD={anfora} bD={110 + Math.sin(t * 1.6) * 20} cD={70} habla={Math.sin(t * 0.5 + ph) > 0.4} />;
        if (v.tipo === 2) { const dx = Math.sin(t * 0.12 + ph) * 260; const dir = Math.cos(t * 0.12 + ph); return <Persona key={v.x} x={v.x + dx} y={-8} h={h} t={t} seed={v.seed} ropa={CIVIL(v.seed % 7)} expr="neutro" camina={0.9} flip={dir < 0} manoD={saco} bD={160} cD={40} />; }
        if (v.tipo === 3) { const dx = Math.sin(t * 0.2 + ph) * 180; return <SvgMundo key={v.x}><g transform={`translate(${v.x + dx} -6) scale(${Math.cos(t * 0.2 + ph) < 0 ? -1 : 1} 1)`}><Perro t={t + ph} s={0.9} /></g></SvgMundo>; }
        if (v.tipo === 4) return <SvgMundo key={v.x}><g transform={`translate(${v.x} -6)`}><Gato t={t + ph} /></g></SvgMundo>;
        return (
          <React.Fragment key={v.x}>
            <Persona x={v.x} y={-8} h={h} t={t} seed={v.seed} ropa={{ ...CIVIL(1), tunica: "#f2ead8", tunica2: "#c9bfa8" }} expr="orgullo" camina={0.6} />
            <Persona x={v.x + 140} y={-8} h={h * 0.9} t={t} seed={v.seed + 2} ropa={CIVIL(5)} expr="neutro" camina={0.6} manoD={antorcha(t)} bD={150} cD={30} />
          </React.Fragment>
        );
      })}
    </>
  );
};
