// The Last Census · los 7 que se suman en el Ep.3 (biblia §2) + Ore (labrador negro) + figuras de ESPALDAS
// (la miniatura del Ep.3: los 10 mirando la ciudad). Looks fijos: los usan lc03 en adelante.
import React from "react";
import { Look } from "../../anikit/personaje";
import { conAcc } from "../elenco";

export const MARCUS: Look = {
  estilo: "palo", camisa: "#3f6b3a", manga: "larga", pantalon: "#3f6b3a", zapatos: "#3a2a1c",
  accesorios: [{ t: "chaleco", color: "#355a31" }, { t: "gorra", color: "#2f4a2c" }],
};
export const ROSA: Look = {
  estilo: "palo", camisa: "#8a4a3a", manga: "larga", pantalon: "#3a3036", zapatos: "#1a1410",
  accesorios: [{ t: "pelo", forma: "bob", color: "#241612" }, { t: "delantal", color: "#d9a632" }],
};
export const PRIYA: Look = {
  estilo: "palo", camisa: "#6a4a9a", manga: "larga", pantalon: "#2b2f3a", zapatos: "#1a1410",
  accesorios: [{ t: "pelo", forma: "cola", color: "#120c0a" }, { t: "mochila", color: "#3a3a44" }],
};
export const DEV: Look = {
  estilo: "palo", camisa: "#7a7c84", manga: "larga", pantalon: "#2a3446", zapatos: "#e9e3d6",
  accesorios: [{ t: "capucha", color: "#6c6e76" }],
};
export const NAN: Look = {
  estilo: "palo", camisa: "#5a4a6a", manga: "larga", pantalon: "#3a3036", zapatos: "#1a1410",
  accesorios: [{ t: "pelo", forma: "bob", color: "#e6e2dc" }, { t: "bufanda", color: "#b8322c" }, { t: "lentes", forma: "redondo", color: "#2a2020" }],
};
export const BEN: Look = {
  estilo: "palo", camisa: "#e8b62a", manga: "larga", pantalon: "#2f4a6a", zapatos: "#1a1410", alto: 0.7,
  accesorios: [{ t: "pelo", forma: "punta", color: "#5a3a1e" }],
};
export const LILY: Look = {
  estilo: "palo", camisa: "#7cc0e8", manga: "larga", pantalon: "#3a3a52", zapatos: "#1a1410", alto: 0.7,
  accesorios: [{ t: "trenzas", color: "#5a3a1e", lazo: "#e86a8a" }],
};
export const NINO = 0.74; // escala de los mellizos
export const NAN_INV = NAN;
export const MARCUS_INV = conAcc(MARCUS, { t: "bufanda", color: "#c9b48a" });
export const PRIYA_INV = conAcc(PRIYA, { t: "bufanda", color: "#d9cdb2" });

// ---------- Ore: labrador negro de perfil (camina / sentado / echado), collar rojo ----------
export const Ore: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1; f: number; paso?: number; sentado?: number; echado?: number; cola?: number; cabeza?: number; ladra?: number }> = ({ x, y, s = 1, dir = 1, f, paso = 0, sentado = 0, echado = 0, cola = 1, cabeza = 0, ladra = 0 }) => {
  const N = "#17131a", N2 = "#241e28";
  const pata = (k: number) => Math.sin(paso * 0.22 + k * Math.PI) * 22 * (paso > 0 ? 1 : 0);
  const baja = echado * 34;
  const inc = -sentado * 34; // sentado: el lomo gira sobre la cadera
  const rot = (px: number, py: number) => { const a = (inc * Math.PI) / 180, cx = -45, cy = -45; return { x: cx + (px - cx) * Math.cos(a) - (py - cy) * Math.sin(a), y: cy + (px - cx) * Math.sin(a) + (py - cy) * Math.cos(a) + baja }; };
  const colaR = Math.sin(f / 3.2) * 24 * cola;
  const boca = ladra > 0 ? Math.max(0, Math.sin(f / 2.2)) * 10 * ladra : 0;
  const hom = rot(38, -52);
  const cuello = rot(52, -92);
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={2} rx={70} ry={10} fill="#000" opacity={0.22} />
      {/* patas traseras (sentado: el anca apoyada) */}
      {sentado > 0.5 ? <ellipse cx={-40} cy={-26} rx={36} ry={26} fill={N} /> : [0, 1].map((k) => <rect key={k} x={-52 + k * 14} y={-46 + baja} width={14} height={echado > 0.5 ? 18 : 46} rx={6} fill={k ? N : N2} transform={`rotate(${echado > 0.5 ? -80 : pata(k)} ${-45 + k * 14} ${-46 + baja})`} />)}
      <g transform={`translate(0,${baja}) rotate(${inc} -45 -45)`}>
        <path d={`M-62,-70 q-30,${-10 - colaR * 0.4} -44,${-34 - colaR}`} stroke={N} strokeWidth={12} strokeLinecap="round" fill="none" />
        <ellipse cx={-5} cy={-68} rx={64} ry={27} fill={N} />
      </g>
      {/* patas delanteras: del hombro al piso */}
      {[0, 1].map((k) => {
        const largo = echado > 0.5 ? 16 : -hom.y;
        return <rect key={k} x={hom.x - 7 + k * 14} y={hom.y} width={14} height={largo} rx={6} fill={k ? N : N2} transform={`rotate(${echado > 0.5 ? -80 : sentado > 0.5 ? 0 : pata(k + 0.5)} ${hom.x + k * 14} ${hom.y})`} />;
      })}
      {/* cabeza */}
      <g transform={`translate(${cuello.x},${cuello.y}) rotate(${cabeza})`}>
        <rect x={-14} y={8} width={22} height={30} rx={8} fill={N} />
        <ellipse cx={4} cy={0} rx={26} ry={22} fill={N} />
        <path d={`M14,${4} L46,${8} Q50,${16 + boca * 0.3} 44,${18 + boca * 0.2} L16,${18} Z`} fill={N} />
        {boca > 0.5 && <path d={`M18,${18} L44,${20 + boca}  L20,${22 + boca * 0.6} Z`} fill="#c0352c" />}
        <ellipse cx={47} cy={9} rx={5} ry={4} fill="#050405" />
        <path d="M-6,-14 Q-18,-4 -14,20 Q-6,22 -2,8 Z" fill={N2} />
        <circle cx={16} cy={-4} r={4} fill="#f6ecd2" />
        <circle cx={17} cy={-4} r={2.2} fill="#120f18" />
        <rect x={-16} y={18} width={26} height={8} rx={3} fill="#c0352c" transform="rotate(-10)" />
      </g>
    </g>
  );
};

// ---------- figura de ESPALDAS (plano de la miniatura): abrigo, mochila, gorro o pelo, sombra larga hacia cámara ----------
export type Espalda = { abrigo: string; mochila?: string; gorro?: string; vuelta?: string; pelo?: string; cola?: boolean; rizos?: boolean; pantalon?: string; nino?: boolean; perro?: boolean };
export const DeEspaldas: React.FC<{ x: number; y: number; s?: number; e: Espalda; f: number; seed?: number; borde?: string; sombra?: number }> = ({ x, y, s = 1, e, f, seed = 0, borde = "#ffcf6e", sombra = 1 }) => {
  const k = e.nino ? 0.74 : 1;
  const resp = Math.sin(f / 26 + seed) * 1.6; // respiración: los hombros suben y bajan
  const pant = e.pantalon ?? "#1c1820";
  const H = 300 * k; // alto total
  const cab = H - 30 * k;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {sombra > 0 && <path d={`M-30,0 L30,0 L${90 * k},${260 * k} L${-90 * k},${260 * k} Z`} fill="#0b0810" opacity={0.42 * sombra} />}
      {/* piernas */}
      <rect x={-24 * k} y={-110 * k} width={18 * k} height={110 * k} rx={6} fill={pant} />
      <rect x={6 * k} y={-110 * k} width={18 * k} height={110 * k} rx={6} fill={pant} />
      <ellipse cx={-15 * k} cy={-2} rx={15 * k} ry={7 * k} fill="#0b0a0c" />
      <ellipse cx={15 * k} cy={-2} rx={15 * k} ry={7 * k} fill="#0b0a0c" />
      <g transform={`translate(0,${resp})`}>
        {/* abrigo (de espaldas: un poco más ancho en los hombros) */}
        <path d={`M${-46 * k},${-H + 92 * k} Q${-52 * k},${-H + 70 * k} ${-30 * k},${-H + 64 * k} L${30 * k},${-H + 64 * k} Q${52 * k},${-H + 70 * k} ${46 * k},${-H + 92 * k} L${50 * k},${-96 * k} Q0,${-86 * k} ${-50 * k},${-96 * k} Z`} fill={e.abrigo} />
        {/* brazos a los costados */}
        <rect x={-62 * k} y={-H + 80 * k} width={22 * k} height={110 * k} rx={10 * k} fill={e.abrigo} transform={`rotate(6 ${-50 * k} ${-H + 80 * k})`} />
        <rect x={40 * k} y={-H + 80 * k} width={22 * k} height={110 * k} rx={10 * k} fill={e.abrigo} transform={`rotate(-6 ${50 * k} ${-H + 80 * k})`} />
        {/* borde de luz del sol (contraluz) */}
        <path d={`M${-46 * k},${-H + 92 * k} Q${-52 * k},${-H + 70 * k} ${-30 * k},${-H + 64 * k} L${30 * k},${-H + 64 * k} Q${52 * k},${-H + 70 * k} ${46 * k},${-H + 92 * k}`} stroke={borde} strokeWidth={5} fill="none" opacity={0.8} />
        {/* mochila */}
        {e.mochila && <g><rect x={-32 * k} y={-H + 96 * k} width={64 * k} height={84 * k} rx={14 * k} fill={e.mochila} /><rect x={-22 * k} y={-H + 136 * k} width={44 * k} height={30 * k} rx={8 * k} fill="#000" opacity={0.18} /></g>}
        {/* cabeza */}
        <circle cx={0} cy={-cab + 18 * k} r={34 * k} fill={e.pelo ?? "#2a1e1a"} />
        {e.rizos && Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={Math.cos((i / 6) * Math.PI + Math.PI) * 30 * k} cy={-cab + 14 * k + Math.sin((i / 6) * Math.PI + Math.PI) * 26 * k} r={14 * k} fill={e.pelo} />)}
        {e.cola && <path d={`M${10 * k},${-cab + 30 * k} q${34 * k},${10 * k} ${26 * k},${70 * k} q${-8 * k},${10 * k} ${-14 * k},${-4 * k} q${6 * k},${-36 * k} ${-20 * k},${-56 * k} Z`} fill={e.pelo} />}
        {e.gorro && <g><path d={`M${-35 * k},${-cab + 12 * k} Q${-36 * k},${-cab - 34 * k} 0,${-cab - 36 * k} Q${36 * k},${-cab - 34 * k} ${35 * k},${-cab + 12 * k} Z`} fill={e.gorro} /><rect x={-37 * k} y={-cab + 2 * k} width={74 * k} height={16 * k} rx={7 * k} fill={e.vuelta ?? e.gorro} /></g>}
        <path d={`M${-24 * k},${-cab - 10 * k} A${34 * k},${34 * k} 0 0 1 ${24 * k},${-cab - 10 * k}`} stroke={borde} strokeWidth={4} fill="none" opacity={e.gorro ? 0 : 0.7} />
      </g>
    </g>
  );
};

// los 10 + Ore de espaldas, en el orden de la miniatura del Ep.3 (izq → der)
export const FILA_10: (Espalda & { id: string })[] = [
  { id: "ben", abrigo: "#3a5a8a", mochila: "#22262e", gorro: "#e8b62a", nino: true },
  { id: "rosa", abrigo: "#b8742a", mochila: "#7a4a22", pelo: "#241612" },
  { id: "lily", abrigo: "#2f7a4a", mochila: "#1f4a30", gorro: "#5a7ae8", nino: true },
  { id: "nan", abrigo: "#7a4a8a", mochila: "#5a3266", pelo: "#e6e2dc", rizos: true },
  { id: "gus", abrigo: "#8a6b3e", mochila: "#5a4428", pelo: "#cfcac2", rizos: true },
  { id: "theo", abrigo: "#e0682a", mochila: "#8a3a1a", gorro: "#b2342a", vuelta: "#efe3c8" },
  { id: "june", abrigo: "#2f9aa0", mochila: "#1d4a50", pelo: "#17110d", cola: true },
  { id: "ore", abrigo: "#17131a", perro: true },
  { id: "marcus", abrigo: "#3f6b3a", mochila: "#2a4a26", gorro: "#4a8a3a" },
  { id: "priya", abrigo: "#c0452c", mochila: "#7a2a1a", pelo: "#120c0a" },
  { id: "dev", abrigo: "#c9a24a", mochila: "#7a6a3a", gorro: "#efe3c8", nino: false },
];

// Ore sentado de espaldas (orejas, collar rojo, cola que barre la nieve)
export const OreEspaldas: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,0 L40,0 L110,200 L-110,200 Z" fill="#0b0810" opacity={0.42} />
    <path d={`M30,-14 q${50 + Math.sin(f / 4) * 14},-6 ${60 + Math.sin(f / 4) * 20},-40`} stroke="#17131a" strokeWidth={16} strokeLinecap="round" fill="none" />
    <ellipse cx={0} cy={-56} rx={52} ry={60} fill="#17131a" />
    <rect x={-34} y={-136} width={68} height={22} rx={8} fill="#c0352c" />
    <ellipse cx={0} cy={-150} rx={38} ry={32} fill="#17131a" />
    <path d="M-36,-164 Q-56,-150 -46,-118 Q-34,-124 -30,-150 Z M36,-164 Q56,-150 46,-118 Q34,-124 30,-150 Z" fill="#241e28" />
    <path d="M-26,-176 A38,32 0 0 1 26,-176" stroke="#ffcf6e" strokeWidth={4} fill="none" opacity={0.7} />
  </g>
);
