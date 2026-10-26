import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, prog } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA, CIVIL, Ropa } from "./persona";
import { Key, CUB, MAR, FONDO, BarcoLejos, Canon, Burbujas, Campana } from "./barco";
import { G, S, P, arco, Botella, Astillas, Sello, Globo, Moneda8, Zapato, Concrecion, Buzo, TINTA } from "./obj";
import { Txt, Lbl, Lista, Contador, Flash, en } from "./dsl";
import { Mapa } from "./mapa";

// EL GIRO + CTA (807,9-923): «begging» vuelve. John King en el Bonetta (nov 1716) ruega que lo lleven; Bellamy se lo lleva;
// abril 1717 el Whydah se parte frente a Cape Cod (140+ a bordo, 2 vivos). 1984: los buzos, la campana WHYDAH GALLY 1716,
// la concreción con el hueso, la media y EL ZAPATO. Los sellos forzado/olvidado/vendido/rogando. Suscribite + el verdugo.
const BON = 5400; // el Bonetta (mundo)
const DK = 1855; // su cubierta
const WX = -3500; // el naufragio en el fondo
const CX = WX + 1100, CY = FONDO - 150; // la concreción
const JOHN: Ropa = { tunica: "#3d6fa8", tunica2: "#264a7a", cinto: "#2a1a10", piel: "#f5c7a0", piel2: "#dc9d78", pelo: "#a0602c", piernas: "#2a2a3a", gorro: "no", gorroCol: "#000" };
const JOHN_P: Ropa = { ...JOHN, gorro: "bandana", gorroCol: "#e8344a" };
const MADRE: Ropa = { ...CIVIL(0), tunica: "#c94f8a", tunica2: "#8a2f5e" };
const BELLAMY: Ropa = { ...CAPITAN, tunica: "#2a2a3a", tunica2: "#16161f" };

export const K8: Key[] = [
  [809.6, 2300, 1250, -0.5, 1.6],
  [811.0, 3700, 1750, -0.8, 1.0],
  [812.2, 4900, 1960, 1.6, 0.8],
  [813.4, 4900, 1960, 1.9, 0.7],
  [819.0, 3900, 1400, 0.34, 2.0],
  [819.9, 4000, 1450, 0.33, 0.6],
  [822.0, 4300, 1550, 0.4, 2.0],
  [823.3, BON - 20, 1760, 1.5, 1.0],
  [827.4, BON - 70, 1770, 2.1, 1.4],
  [830.6, 4900, 1650, 0.85, 1.0],
  [833.0, BON - 150, 1750, 1.6, 0.8],
  [839.0, BON - 100, 1760, 1.3, 4.0],
  [840.4, BON - 20, 1760, 1.9, 0.7],
  [842.4, 4700, 1650, 0.8, 0.8],
  [843.6, 3900, 1450, -1.0, 0.6],
  [846.0, 2300, 1100, -0.42, 2.2],
  [848.7, 2300, 1150, -0.46, 2.0],
  [851.6, 2300, 1400, 0.4, 0.4],
  [853.8, 2300, 1700, 0.4, 2.0],
  [857.2, 2300, 3200, 0.42, 3.2],
  [859.4, 2600, 3450, 1.0, 1.6],
  [860.3, 2600, 3550, 1.0, 0.8],
  [862.4, WX, 4350, 0.75, 2.0],
  [864.2, WX - 150, 4500, 1.1, 1.4],
  [867.4, WX + 550, 4520, 1.7, 1.2],
  [870.2, WX + 520, 4500, 1.4, 0.8],
  [874.6, CX, 4500, 1.2, 1.2],
  [879.0, CX, 4540, 1.5, 2.0],
  [883.9, CX + 130, CY + 60, 3.6, 0.45, "seco"],
  [885.2, CX + 100, 4580, 2.4, 1.0],
  [889.8, CX, 4500, 1.0, 4.5],
  [892.6, CX, 1800, 0.55, 2.6],
  [898.6, CX + 100, 1750, 0.6, 5.0],
  [900.0, CX + 200, 1950, 1.5, 1.2],
  [903.2, CX + 200, 2150, 1.7, 2.4],
  [904.6, CX + 130, CY + 60, 2.6, 1.4],
  [907.9, CX + 130, CY + 60, 3.2, 3.2],
  [909.4, CX, 1500, 0.5, 1.4],
  [923, CX + 300, 1500, 0.55, 13],
];

// a bordo (coords del barco): Bellamy y los suyos mirando al Bonetta, John en la tormenta, el casco que se parte
export const A8: React.FC<{ t: number }> = ({ t }) => {
  if (t < 807 || t > 862) return null;
  return (
    <>
      {en(t, 809.4, 811.4) && <Persona x={2300} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} expr={t > 810.2 ? "sorpresa" : "triste"} bD={t > 810.2 ? 150 : 10} cD={30} />}
      {en(t, 809.4, 811.4) && [1950, 2650].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={350 + i} ropa={PIRATA(i)} flip={i === 1} expr="neutro" />)}
      {en(t, 819.6, 843.6) && <Persona x={3700} y={CUB} h={260} t={t} seed={320} ropa={BELLAMY} expr={t > 832.8 ? "feliz" : "orgullo"} bD={t > 842.3 ? 150 : 20} cD={t > 842.3 ? 30 : 10} />}
      {en(t, 829.8, 843.6) && [3950, 4180].map((x, i) => <Persona key={i} x={x} y={CUB} h={245} t={t} seed={321 + i} ropa={PIRATA(i + 1)} expr={t > 832.8 ? "sorpresa" : "orgullo"} />)}
      {en(t, 843.5, 852.6) && <Persona x={t < 843.6 ? 3900 : 2600} y={CUB} h={175} t={t} seed={330} ropa={JOHN_P} expr={t > 848.8 ? "miedo" : "feliz"} bD={150} cD={30} ladea={t > 848.8 ? Math.sin(t * 3) * 8 : 0} />}
      {en(t, 843.6, 852.6) && [1900, 3200].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={331 + i} ropa={PIRATA(i + 3)} flip={i === 1} expr={t > 848.8 ? "miedo" : "neutro"} ladea={Math.sin(t * 2.4 + i) * 10} />)}
      <G>
        {/* el casco se parte */}
        {en(t, 852.7, 862) && <path d="M 2300 1280 L 2360 1500 L 2260 1700 L 2380 1950 L 2280 2200 L 2340 2360" stroke="#1d1420" strokeWidth={26} fill="none" strokeLinejoin="round" opacity={prog(t, 852.7, 853.1)} />}
        {en(t, 852.6, 856) && ([[852.7, 1300, 1950], [853.1, 2350, 2000], [853.5, 3400, 1850], [853.9, 2300, 1500]] as [number, number, number][]).map(([a, x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><Astillas t={t} t0={a} n={24} dir={i % 2 ? 1 : -1} vel={600} /></g>)}
        <S t={852.7} p="crunch" g={-2} />
        <S t={852.8} p="creak" g={-4} d={2.5} />
        {[853.1, 853.5, 853.9].map((a, i) => <S key={i} t={a} p="wood_hit" g={-5} pitch={0.85 + i * 0.08} />)}
        <S t={854.0} p="splash" g={-4} />
        <S t={855.2} p="bubble" g={-6} d={2} />
      </G>
    </>
  );
};

// la vincha roja que baja sola
const Vincha: React.FC = () => (
  <g><path d="M -70 -10 Q 0 -40 70 -10 L 60 14 Q 0 -10 -60 14 Z" fill="#e8344a" /><path d="M 60 0 L 110 40 L 84 52 Z M 62 4 L 96 70 L 70 72 Z" fill="#c92436" /></g>
);

// mundo: botella, Bonetta, la gente del Bonetta, el salto, el fondo marino de 1984
export const M8: React.FC<{ t: number }> = ({ t }) => {
  if (t < 807 || t > 924) return null;
  const salto = en(t, 842.5, 843.5) ? arco(t, 842.5, 843.5, [BON - 70, DK], [3900, CUB], -300) : null;
  const botY = t < 901.8 ? MAR - 15 + Math.sin(t * 2) * 10 : MAR - 15 + interpolate(t, [901.8, 903.6], [0, 420], { extrapolateRight: "clamp" });
  return (
    <>
      {/* la botella BEGGING */}
      {en(t, 811.6, 813.6) && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><g transform={`translate(4900 ${MAR - 45 + Math.sin(t * 2) * 10}) rotate(${70 + Math.sin(t * 1.6) * 8}) scale(0.55)`}><Botella c="#7ac8e8" txt="BEGGING" /></g></svg>}
      {en(t, 898.6, 903.7) && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><g transform={`translate(${CX + 200} ${botY}) rotate(${70 + Math.sin(t * 1.6) * 8 + (t > 901.8 ? (t - 901.8) * 30 : 0)}) scale(0.55)`}><Botella c="#7ac8e8" txt="BEGGING" /></g></svg>}
      {/* el Bonetta */}
      {en(t, 818.8, 843.6) && <BarcoLejos x={BON} y={MAR - 30} t={t} s={2.2} tipo="mercante" flip iza={t > 821 ? 1 - prog(t, 821, 822.2) : 1} />}
      {en(t, 822.3, 842.5) && <Persona x={BON - 70} y={DK} h={112} t={t} seed={330} ropa={JOHN} flip={en(t, 829.8, 838)} expr={t > 840.4 ? "enojado" : t > 829.8 ? "feliz" : "neutro"}
        bD={en(t, 832.7, 834.4) || en(t, 840.4, 842.5) ? 160 : 20} cD={en(t, 832.7, 834.4) ? 20 + Math.sin(t * 14) * 30 : 10} bI={en(t, 840.4, 842.5) ? 120 : 10} salta={en(t, 832.8, 834.4) ? Math.abs(Math.sin(t * 7)) * 18 : 0} />}
      {salto && <Persona x={salto.x} y={salto.y} h={112 + prog(t, 842.5, 843.5) * 63} t={t} seed={330} ropa={JOHN} flip expr="feliz" bD={160} bI={160} />}
      {en(t, 822.3, 843.6) && <Persona x={BON + 90} y={DK} h={165} t={t} seed={340} ropa={MADRE} flip expr={t > 840.4 ? "sorpresa" : t > 832.8 ? "miedo" : "neutro"} bD={en(t, 832.8, 843.6) ? 120 : 15} cD={60} />}
      <G>
        <Lbl t={t} t0={812.3} t1={813.4} x={4900} y={MAR - 120} txt="REMEMBER?" size={44} color={C.ambar} />
        <S t={812.2} p="splash" g={-10} />
        <S t={812.3} p="ding" g={-10} />
        <Lbl t={t} t0={820.0} t1={822.4} x={BON} y={MAR - 1180} txt="THE BONETTA" size={230} color={C.crema} />
        <Lbl t={t} t0={820.4} t1={822.4} x={3300} y={900} txt="BLACK SAM BELLAMY" size={190} color={C.oro} />
        <S t={819.9} p="whoosh_big" g={-4} />
        <S t={820.0} p="sea" g={-14} d={6} />
        <S t={821.1} p="cloth" g={-8} />
        <Lbl t={t} t0={822.9} t1={829.8} x={BON - 230} y={DK - 170} txt="JOHN KING" size={62} color={C.oro} />
        <Lbl t={t} t0={825.9} t1={829.8} x={BON + 230} y={DK - 250} txt="HIS MOTHER" size={54} color={C.crema} />
        <S t={822.9} p="pop" g={-8} />
        <S t={825.9} p="pop" g={-10} />
        <Lbl t={t} t0={827.4} t1={829.8} x={BON - 260} y={DK - 90} txt="AGE 8–11" size={62} color={C.lima} />
        <S t={827.4} p="tick" g={-8} />
        {/* no se esconde: quiere ir */}
        <P t={t} t0={832.8} t1={834.5} x={BON - 260} y={DK - 200} s={0.5}><Globo txt="TAKE ME!" cola={1} /></P>
        <S t={832.8} p="pop" g={-6} />
        <S t={833.0} p="cheer" g={-12} d={1.5} />
        <P t={t} t0={840.5} t1={842.4} x={BON - 260} y={DK - 200} s={0.5}><Globo txt="LET ME GO!" cola={1} /></P>
        <S t={840.5} p="gasp" g={-8} />
        <S t={842.5} p="whoosh" g={-6} />
        <S t={843.4} p="thud" g={-6} />
        {/* la vincha baja sola */}
        {en(t, 858.0, 861) && <g transform={`translate(${2600 + Math.sin(t * 1.3) * 60} ${3300 + (t - 858) * 70}) rotate(${Math.sin(t * 1.1) * 25})`}><Vincha /></g>}
        <S t={858.3} p="sad" g={-8} />
        {/* 1984: el naufragio */}
        {en(t, 860.3, 924) && (
          <g>
            {[[-4100, -10], [-3900, 18], [-3650, -24], [-3050, 12], [-2850, -6]].map(([x, r], i) => <rect key={i} x={x} y={FONDO - 70} width={260} height={34} rx={8} fill="#5a3a2a" transform={`rotate(${r} ${x} ${FONDO - 50})`} />)}
            {[-4000, -3840, -3680, -3520, -3160, -3000].map((x, i) => <path key={i} d={`M ${x} ${FONDO - 20} Q ${x - 40} ${FONDO - 260} ${x + 30} ${FONDO - 380 + (i % 2) * 60}`} stroke="#4a2e22" strokeWidth={30} fill="none" strokeLinecap="round" />)}
            <g transform={`translate(${WX - 280} ${FONDO - 10}) rotate(-14)`}><Canon x={0} y={0} t={t} /></g>
            <g transform={`translate(${WX + 230} ${FONDO - 6}) rotate(10) scale(0.8)`}><Canon x={0} y={0} t={t} flip /></g>
            {[[-3600, 5], [-3540, 10], [-3480, 3], [-3250, 8], [-3200, 2], [-3420, 6]].map(([x, d], i) => <g key={i} transform={`translate(${x} ${FONDO - d}) scale(0.35)`}><Moneda8 r={40} oro t={t} /></g>)}
            {/* la campana: sube un poco con el buzo */}
            <Campana x={WX + 550} y={FONDO - 30 - interpolate(t, [865, 867.4], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} t={t} s={1.4} txt="WHYDAH GALLY 1716" golpes={[870.5, 871.7, 872.6, 873.3]} />
            <g transform={`translate(${CX} ${CY})`}><Concrecion rayos={prog(t, 877.6, 878.6)} t={t} /></g>
            {t > 883.8 && <g transform={`translate(${CX + 130} ${CY + 70}) scale(0.9)`}><Zapato brillo={prog(t, 883.84, 884.6)} t={t} /></g>}
            {en(t, 861.4, 868.5) && <g transform={`translate(${interpolate(t, [861.4, 864.5, 866], [WX - 1200, WX - 200, WX + 300], { extrapolateRight: "clamp" })} ${FONDO - 170 + Math.sin(t) * 12}) scale(0.42)`}><Buzo t={t} luz={prog(t, 861.8, 862.6)} /></g>}
          </g>
        )}
        <Lbl t={t} t0={863.4} t1={866.4} x={WX - 450} y={FONDO - 230} txt="COINS" size={50} color={C.oro} />
        <Lbl t={t} t0={864.0} t1={866.4} x={WX + 150} y={FONDO - 300} txt="CANNONS" size={50} color={C.crema} />
        <Lbl t={t} t0={866.5} t1={867.7} x={WX + 550} y={FONDO - 380} txt="THE SHIP'S BELL" size={56} color={C.oro} />
        <Lbl t={t} t0={874.4} t1={878.3} x={CX} y={CY - 240} txt="SAND + IRON" size={56} color={C.crema} />
        {en(t, 879.9, 883.8) && <circle cx={CX - 120} cy={CY - 20} r={150} fill="none" stroke={C.lima} strokeWidth={8} opacity={t < 881 ? 1 : 0} />}
        {en(t, 880.9, 883.8) && <circle cx={CX + 60} cy={CY - 80} r={110} fill="none" stroke={C.lima} strokeWidth={8} opacity={t < 882.1 ? 1 : 0} />}
        {en(t, 882.1, 883.8) && <circle cx={CX + 130} cy={CY + 70} r={120} fill="none" stroke={C.oro} strokeWidth={10} />}
        <Lbl t={t} t0={879.9} t1={883.8} x={CX - 300} y={CY - 200} txt="LEG BONE" size={66} color={C.lima} />
        <Lbl t={t} t0={880.9} t1={883.8} x={CX + 200} y={CY - 210} txt="SILK STOCKING" size={66} color={C.lima} />
        <Lbl t={t} t0={882.1} t1={883.8} x={CX + 360} y={CY + 230} txt="LEATHER SHOE" size={72} color={C.oro} />
        <S t={861.5} p="bubble" g={-8} d={2} />
        <S t={862.4} p="suspense" g={-12} d={4} />
        <S t={863.4} p="coin" g={-8} />
        <S t={863.9} p="metal" g={-8} />
        <S t={865.0} p="rope" g={-10} />
        <S t={866.5} p="bell" g={-8} />
        {[870.5, 871.7, 872.6, 873.3].map((a, i) => <S key={i} t={a} p="bell" g={-10 - i} />)}
        <S t={874.4} p="thud" g={-8} />
        <S t={877.6} p="sparkle" g={-8} />
        {[879.9, 880.9, 882.1].map((a, i) => <S key={i} t={a} p="ding" g={-10} pitch={1 + i * 0.08} />)}
        <S t={883.9} p="boom" g={-2} />
        <S t={883.95} p="sparkle" g={-6} />
        <S t={886.7} p="boom" g={-4} />
        <S t={890.2} p="whoosh_big" g={-6} />
        <S t={898.7} p="splash" g={-10} />
        <S t={901.9} p="bubble" g={-6} d={1.6} />
        <S t={903.7} p="whoosh_big" g={-6} />
        <S t={903.9} p="suspense" g={-10} d={4} />
      </G>
      {en(t, 869.9, 873.95) && <Persona x={WX + 380} y={FONDO} h={210} t={t} seed={330} ropa={JOHN_P} opacity={0.5 * prog(t, 869.9, 870.4)} expr="neutro"
        bD={[870.5, 871.7, 872.6, 873.3].some((g) => en(t, g - 0.2, g + 0.1)) ? 120 : 70} cD={40} />}
      {en(t, 886.6, 890.2) && <Persona x={CX + 330} y={FONDO} h={210} t={t} seed={330} ropa={JOHN_P} opacity={0.45 * prog(t, 886.6, 887.3)} expr="feliz" flip />}
      {en(t, 859.4, 861.4) && <Burbujas t={t} x={2600} y={3500} w={600} n={20} />}
    </>
  );
};

// cuadrícula de 140 hombres → 2 vivos
const Hombres: React.FC<{ t: number }> = ({ t }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
    <rect x={300} y={320} width={1320} height={700} rx={30} fill="#140a24" opacity={0.78 * Math.min(1, (t - 854.4) * 4)} />
    {Array.from({ length: 140 }, (_, i) => {
      const c = i % 14, r = Math.floor(i / 14);
      const x = 960 - 13 * 46 + c * 92, y = 380 + r * 64;
      const vive = i === 61 || i === 96;
      const on = t > 854.9 + (i % 23) * 0.02;
      const apaga = t > 856.9 && !vive;
      if (!on) return null;
      const col = apaga ? "#4a4458" : vive && t > 856.9 ? C.lima : C.crema;
      return <g key={i} transform={`translate(${x} ${y})`} opacity={apaga ? 0.6 : 1}><circle cy={-18} r={13} fill={col} /><rect x={-12} y={-4} width={24} height={28} rx={8} fill={col} /></g>;
    })}
  </svg>
);

// el verdugo: pueblo medieval, capucha y hacha
const Verdugo: React.FC<{ t: number }> = ({ t }) => {
  const dx = interpolate(t, [912.3, 912.8, 917.4, 917.8], [1920, 0, 0, -1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `translateX(${dx}px)` }}>
      <svg width={1920} height={1080}>
        <defs><linearGradient id="vcielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a0e1e" /><stop offset="0.6" stopColor="#8a2a2a" /><stop offset="1" stopColor="#e07a3a" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#vcielo)" />
        <circle cx={1500} cy={300} r={110} fill="#ffcf8a" opacity={0.8} />
        {[[0, 640, 160], [150, 560, 130], [270, 600, 170], [430, 520, 120], [540, 610, 150], [1400, 580, 140], [1530, 500, 120], [1640, 620, 160], [1790, 560, 130]].map(([x, y, w], i) => (
          <g key={i}><rect x={x} y={y} width={w} height={1080 - y} fill="#1d0e18" /><path d={`M ${x - 10} ${y} L ${x + w / 2} ${y - 90} L ${x + w + 10} ${y} Z`} fill="#1d0e18" />
            <rect x={x + w / 2 - 14} y={y + 60} width={28} height={36} fill={(i + Math.floor(t * 2)) % 3 ? "#ffcf5a" : "#7a4a2a"} /></g>
        ))}
        <rect x={0} y={900} width={1920} height={180} fill="#140810" />
        {/* el tajo y el gentío */}
        <rect x={760} y={820} width={400} height={90} rx={10} fill="#4a2a1a" />
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={60 + i * 120 + (i > 5 && i < 11 ? 900 : 0) * 0} cy={980 + (i % 2) * 20 + Math.sin(t * 6 + i) * 6} r={42} fill="#0a0408" />)}
        {/* el verdugo */}
        <g transform={`translate(960 ${820 + Math.sin(t * 1.5) * 4})`}>
          <path d="M -150 0 L -120 -330 Q 0 -380 120 -330 L 150 0 Z" fill="#141018" />
          <path d="M -95 -330 Q -110 -560 0 -600 Q 110 -560 95 -330 Z" fill="#0a0810" />
          <ellipse cx={-36} cy={-450} rx={20} ry={12} fill="#ff4a3a" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
          <ellipse cx={36} cy={-450} rx={20} ry={12} fill="#ff4a3a" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
          <g transform={`rotate(${-20 + Math.sin(t * 1.2) * 6} 150 -200)`}>
            <rect x={140} y={-520} width={22} height={420} rx={8} fill="#6b3a1f" />
            <path d="M 150 -520 Q 300 -560 290 -400 Q 230 -420 150 -420 Z" fill="#c8ccd4" stroke={TINTA} strokeWidth={6} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const O8: React.FC<{ t: number }> = ({ t }) => {
  if (t < 807.5) return null;
  return (
    <>
      <Txt t={t} t0={807.9} t1={810.8} text="SO... A DEATH TRAP?" y={170} size={110} />
      <Txt t={t} t0={810.9} t1={811.9} text="HERE'S THE TWIST" y={170} size={140} color={C.oro} />
      <S t={810.9} p="whoosh_big" g={-4} />
      <Txt t={t} t0={812.2} t1={813.2} text="REMEMBER: BEGGING" y={170} size={110} color={C.ambar} />
      <Mapa t={t} t0={813.3} t1={819.7} titulo="NOVEMBER 1716"
        cam={[[813.3, -66, 21, 1.3], [816.0, -61.8, 17.1, 3.0], [819.7, -61.8, 17.1, 3.4]]}
        pins={[{ lugar: "antigua", t0: 815.6, txt: "ANTIGUA", icono: "barco" }]} />
      <S t={813.3} p="unroll" g={-4} />
      <S t={815.6} p="stamp" g={-8} />
      <Txt t={t} t0={813.8} t1={816.4} text="SAMUEL BELLAMY" y={900} size={100} color={C.oro} />
      <Txt t={t} t0={816.6} t1={819.6} text="CAPTURES THE BONETTA" y={900} size={90} />
      <S t={816.6} p="cannon" g={-10} />
      <Txt t={t} t0={829.9} t1={832.7} text="HE DID NOT HIDE" y={170} size={120} />
      <Txt t={t} t0={832.8} t1={834.4} text="HE WANTED IN" y={170} size={130} color={C.oro} />
      {/* el testimonio */}
      {en(t, 834.5, 840.0) && (
        <div style={{ position: "absolute", left: 960, top: 560, width: 1300, transform: `translate(-50%,-50%) rotate(-2deg) scale(${Math.min(1, (t - 834.5) * 5) * interpolate(t, [839.7, 840.0], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, background: "#f4ead2", border: `8px solid ${TINTA}`, borderRadius: 24, padding: "40px 60px", boxShadow: "0 16px 0 rgba(20,10,40,.45)", fontFamily: "Fredoka", fontWeight: 700, color: TINTA, textAlign: "center" }}>
          <div style={{ fontSize: 40, color: C.rojo, letterSpacing: 3 }}>THE CAPTAIN'S TESTIMONY</div>
          <div style={{ fontSize: 76, lineHeight: 1.15, marginTop: 14 }}>“HE WOULD KILL HIMSELF<br />IF HE WAS KEPT FROM GOING”</div>
          <div style={{ fontSize: 38, marginTop: 14, color: "#6a5a6a" }}>ABOUT A BOY OF 8–11</div>
        </div>
      )}
      <S t={834.5} p="paper" g={-6} />
      <S t={835.6} p="write" g={-12} d={3} />
      <Txt t={t} t0={840.6} t1={842.3} text="HE THREATENED HIS MOTHER" y={170} size={100} color={C.rojo} />
      {en(t, 842.4, 843.6) && <div style={{ position: "absolute", left: 960, top: 560 }}><svg width={1} height={1} style={{ overflow: "visible" }}><Sello t={t} t0={842.8} txt="JOINED" size={130} c={C.rojo} /></svg></div>}
      <S t={842.8} p="stamp" g={-3} />
      <Txt t={t} t0={843.7} t1={845.0} text="FIVE MONTHS LATER" y={170} size={110} />
      <Txt t={t} t0={845.1} t1={847.0} text="APRIL 1717" y={170} size={140} color={C.lila} />
      <Txt t={t} t0={847.1} t1={848.8} text="HIS FLAGSHIP: THE WHYDAH" y={170} size={100} color={C.oro} />
      <S t={843.6} p="thunder" g={-6} />
      <Flash t={t} t0={846.2} d={0.22} c="#e8f0ff" />
      <S t={846.2} p="thunder" g={-4} />
      <Flash t={t} t0={850.1} d={0.22} c="#e8f0ff" />
      <S t={850.1} p="thunder" g={-4} />
      <S t={844.0} p="sea" g={-8} d={8} />
      <Mapa t={t} t0={848.9} t1={851.6} titulo="CAPE COD · NEW ENGLAND"
        cam={[[848.9, -62, 36, 1.4], [850.8, -69.95, 41.9, 3.2]]}
        pins={[{ lugar: "capecod", t0: 850.6, icono: "x" }]} />
      <S t={848.9} p="unroll" g={-6} />
      <S t={850.6} p="stamp" g={-8} />
      <Txt t={t} t0={852.8} t1={854.2} text="BROKE APART" y={170} size={150} color={C.rojo} />
      <Flash t={t} t0={852.7} d={0.2} />
      {/* 140 → 2 */}
      {en(t, 854.4, 858.2) && <Hombres t={t} />}
      <Txt t={t} t0={854.9} t1={856.8} text="140+ MEN ON BOARD" y={200} size={100} />
      <Txt t={t} t0={856.9} t1={858.2} text="ONLY 2 SURVIVED" y={200} size={110} color={C.lima} />
      {[854.9, 855.1, 855.3, 855.5].map((a, i) => <S key={i} t={a} p="popcluster" g={-12} pitch={1 + i * 0.05} />)}
      <S t={856.9} p="fail" g={-10} />
      <Txt t={t} t0={858.4} t1={860.1} text="JOHN KING WAS NOT ONE OF THEM" y={170} size={78} color="#c8c0d0" />
      <Contador t={t} t0={860.3} t1={861.8} de={1717} a={1984} x={960} y={200} size={170} color={C.oro} tFin={862.4} />
      <Txt t={t} t0={861.6} t1={863.0} text="DIVERS FIND THE WRECK" y={340} size={80} />
      <S t={860.3} p="tick" g={-10} d={1.5} />
      <Txt t={t} t0={867.8} t1={869.8} text="“WHYDAH GALLY · 1716”" y={170} size={100} color={C.oro} />
      <Txt t={t} t0={870.0} t1={872.0} text="EVERY HALF HOUR" y={170} size={110} />
      <Txt t={t} t0={872.1} t1={873.9} text="DAY AND NIGHT" y={170} size={120} color={C.lila} />
      <Txt t={t} t0={874.0} t1={876.6} text="YEARS LATER..." y={170} size={110} />
      <Txt t={t} t0={876.7} t1={879.8} text="ARCHAEOLOGISTS LOOK INSIDE" y={170} size={90} color="#bff3ff" />
      <Txt t={t} t0={883.9} t1={885.0} text="A CHILD'S SHOE" y={170} size={140} color={C.crema} />
      <Flash t={t} t0={883.9} d={0.3} />
      <Txt t={t} t0={885.1} t1={886.6} text="IT BELONGED TO..." y={170} size={110} />
      <Txt t={t} t0={886.7} t1={887.6} text="JOHN KING" y={170} size={180} color={C.oro} />
      <Txt t={t} t0={887.7} t1={890.1} text="THE YOUNGEST PIRATE WHOSE NAME WE KNOW" y={170} size={66} />
      {/* los sellos vuelven */}
      {en(t, 891.4, 892.7) && <div style={{ position: "absolute", left: 960, top: 600 }}><svg width={1} height={1} style={{ overflow: "visible" }}><Sello t={t} t0={891.5} txt="NO BOYS" size={140} /></svg></div>}
      <S t={891.5} p="stamp" g={-3} />
      <Txt t={t} t0={892.7} t1={895.0} text="MOST NEVER CHOSE IT" y={170} size={110} />
      {en(t, 895.2, 903.6) && <div style={{ position: "absolute", left: 600, top: 400 }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          <Sello t={t} t0={895.36} txt="FORCED" size={70} rot={-10} />
          <g transform="translate(0 150)"><Sello t={t} t0={896.28} txt="FORGOTTEN" size={70} rot={6} c={C.violeta} /></g>
          <g transform="translate(0 300)"><Sello t={t} t0={897.12} txt="SOLD" size={70} rot={-4} c={C.naranja} /></g>
          <g transform="translate(720 150)"><Sello t={t} t0={900.98} txt="BEGGING" size={110} rot={-8} c={C.ambar} /></g>
        </svg>
      </div>}
      {[895.36, 896.28, 897.12].map((a, i) => <S key={i} t={a} p="stamp" g={-4} />)}
      <S t={900.98} p="stamp" g={-2} />
      <Txt t={t} t0={898.8} t1={900.9} text="THE ONE WHO CHOSE IT" y={170} size={110} color={C.ambar} />
      <Txt t={t} t0={901.8} t1={903.5} text="GOT EXACTLY WHAT HE ASKED FOR" y={170} size={84} />
      <Txt t={t} t0={904.0} t1={906.5} text="NOBODY WANTED TO BE THE CABIN BOY..." y={170} size={76} />
      <Txt t={t} t0={906.6} t1={907.9} text="EXCEPT THE ONE WHO DID" y={170} size={110} color={C.oro} />
      {/* CTA */}
      {en(t, 908.0, 912.4) && (() => {
        const e = Math.min(1, (t - 908.0) * 4) * interpolate(t, [912.0, 912.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pul = t > 910.76 && t < 910.95 ? 0.9 : 1;
        const hecho = t > 910.76;
        const mx = interpolate(t, [909.8, 910.7], [1500, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const my = interpolate(t, [909.8, 910.7], [950, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${e})`, transformOrigin: "960px 600px" }}>
            <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-60%,-50%) scale(${pul})`, background: hecho ? "#5a5468" : "#e8344a", border: `8px solid ${TINTA}`, borderRadius: 30, padding: "24px 70px", fontFamily: "Fredoka", fontWeight: 700, fontSize: 96, color: "#fff", boxShadow: "0 14px 0 rgba(20,10,40,.45)" }}>{hecho ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
              <Campana x={1480} y={690} t={t} s={1.2} golpes={[911.6]} />
            </svg>
          </div>
        );
      })()}
      <Txt t={t} t0={908.0} t1={910.6} text="ONE VOYAGE UNDER THE BLACK FLAG" y={250} size={76} />
      <S t={908.1} p="pop" g={-6} />
      <S t={910.76} p="tick" g={-4} />
      <S t={910.8} p="ding" g={-8} />
      <S t={911.6} p="bell" g={-6} />
      {/* el próximo: el verdugo */}
      {en(t, 912.3, 918) && <Verdugo t={t} />}
      <S t={912.3} p="whoosh_big" g={-4} />
      <S t={912.9} p="bell" g={-8} pitch={0.6} />
      <S t={914.5} p="rattle" g={-10} />
      <S t={916.7} p="bell" g={-6} pitch={0.5} />
      <Txt t={t} t0={912.5} t1={914.4} text="NEXT TIME..." y={170} size={120} />
      <Txt t={t} t0={914.4} t1={916.6} text="THE MOST HATED MAN IN TOWN" y={170} size={86} color={C.crema} />
      <Txt t={t} t0={916.7} t1={917.6} text="THE EXECUTIONER" y={170} size={150} color={C.rojo} />
      <S t={917.8} p="whoosh_big" g={-6} />
      <Txt t={t} t0={917.9} t1={923} text="WHICH TRAP GETS YOU FIRST?" y={150} size={96} color={C.oro} />
      <Lista t={t} x={560} y={230} size={50} w={800} titulo="TELL ME IN THE COMMENTS"
        items={["THE CAPTURE", "THE CHORES", "THE ARTICLES", "THE PUNISHMENTS", "THE FOOD", "THE FEVER", "THE BATTLE"].map((txt, i) => ({ txt: `${i + 1}. ${txt}`, t0: 918.3 + i * 0.25 }))} />
      {Array.from({ length: 7 }, (_, i) => <S key={i} t={918.3 + i * 0.25} p="write" g={-14} pitch={1 + i * 0.04} />)}
    </>
  );
};
export const _8 = { GRUMETE, Flash };
