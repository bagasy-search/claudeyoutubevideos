// CABALLO al galope (tz03, «Ask the horse!»), vector plano de 4 patas. El kit no trae animales: éste es de Tenzo.
// (x, piso) = punto del suelo bajo el centro del cuerpo. `fase` 0..1 = ciclo de galope (≈ 14 cuadros por ciclo).
// LOMO = altura del lomo sobre el piso (ahí se sienta el jinete). `variante: "mara"` = caballo-sombra con borde neón.
import React from "react";

export const CABALLO_LOMO = 250; // a escala 1

type Pata = { cx: number; cy: number; a1: number; a2: number };
// ángulos (grados, 0 = recto hacia abajo) de muslo y caña para cada pata en el ciclo
const ciclo = (fase: number, desfase: number, amp: number) => {
  const t = (fase + desfase) * Math.PI * 2;
  return { a1: amp * Math.sin(t), a2: Math.max(0, 55 * Math.sin(t + 1.2)) };
};

const pata = (p: Pata, color: string, casco: string, ancho: number) => {
  const L1 = 78, L2 = 86;
  const r1 = (p.a1 * Math.PI) / 180, r2 = ((p.a1 - p.a2) * Math.PI) / 180;
  const kx = p.cx + Math.sin(r1) * L1, ky = p.cy + Math.cos(r1) * L1;
  const hx = kx + Math.sin(r2) * L2, hy = ky + Math.cos(r2) * L2;
  return (
    <g>
      <path d={`M${p.cx},${p.cy} L${kx},${ky} L${hx},${hy}`} stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x={hx - 13} y={hy - 4} width={26} height={14} rx={4} fill={casco} transform={`rotate(${-(p.a1 - p.a2) * 0.5} ${hx} ${hy})`} />
    </g>
  );
};

export const Caballo: React.FC<{ x: number; piso: number; fase: number; dir?: 1 | -1; s?: number; color?: string; crin?: string; variante?: "normal" | "mara"; neon?: string; quieto?: boolean }> = ({
  x, piso, fase, dir = 1, s = 1, color = "#8a5230", crin = "#2e1a10", variante = "normal", neon = "#ff6a2b", quieto,
}) => {
  const mara = variante === "mara";
  const cuerpo = mara ? "#0b0909" : color;
  const oscuro = mara ? "#050404" : "#6a3d22";
  const pelo = mara ? "#0b0909" : crin;
  const casco = mara ? neon : "#2a1a12";
  const amp = quieto ? 4 : 38;
  const sube = quieto ? 0 : 14 * Math.abs(Math.sin(fase * Math.PI * 2)); // el cuerpo rebota en el galope
  const cab = quieto ? 0 : 7 * Math.sin(fase * Math.PI * 2 + 0.6);
  const ondea = (k: number) => (quieto ? 2 : 10) * Math.sin(fase * Math.PI * 4 + k);
  const y0 = -164 - sube; // centro del cuerpo
  // patas: traseras en -70, delanteras en +78 (las de atrás, más oscuras)
  const pI = ciclo(fase, 0.0, amp), pD = ciclo(fase, 0.12, amp), aI = ciclo(fase, 0.5, amp), aD = ciclo(fase, 0.62, amp);
  const borde = mara ? { stroke: neon, strokeWidth: 5 } : { stroke: "none" };
  return (
    <g transform={`translate(${x},${piso}) scale(${dir * s},${s})`}>
      <ellipse cx={0} cy={0} rx={150} ry={16} fill="#000" opacity={0.18} />
      {/* patas del lado de atrás */}
      {pata({ cx: -70, cy: y0 + 30, a1: -pI.a1 * 0.9, a2: pI.a2 }, oscuro, casco, 26)}
      {pata({ cx: 78, cy: y0 + 30, a1: -aI.a1, a2: aI.a2 }, oscuro, casco, 24)}
      {/* cola */}
      <path d={`M-140,${y0 - 20} Q${-200},${y0 + 10 + ondea(1)} ${-230},${y0 + 70 + ondea(2)} Q${-190},${y0 + 40} ${-150},${y0 + 10} Z`} fill={pelo} {...borde} />
      {/* cuerpo */}
      <ellipse cx={0} cy={y0} rx={150} ry={70} fill={cuerpo} {...borde} />
      {/* cuello y cabeza */}
      <g transform={`rotate(${cab} 110 ${y0 - 30})`}>
        <path d={`M90,${y0 - 40} Q140,${y0 - 120} 175,${y0 - 160} L220,${y0 - 120} Q170,${y0 - 70} 150,${y0 + 10} Z`} fill={cuerpo} {...borde} />
        <path d={`M170,${y0 - 165} Q215,${y0 - 175} 262,${y0 - 120} Q270,${y0 - 100} 250,${y0 - 92} Q225,${y0 - 95} 205,${y0 - 112} Z`} fill={cuerpo} {...borde} />
        <path d={`M178,${y0 - 172} L186,${y0 - 205} L198,${y0 - 170} Z`} fill={cuerpo} {...borde} />
        {/* ojo (en la sombra de Mara: rendija que brilla) */}
        {mara
          ? <path d={`M205,${y0 - 148} Q216,${y0 - 156} 228,${y0 - 146} Q216,${y0 - 144} 205,${y0 - 148} Z`} fill={neon} />
          : <circle cx={213} cy={y0 - 146} r={6} fill="#1a0e08" />}
        <circle cx={252} cy={y0 - 104} r={4} fill={mara ? neon : "#3a2014"} />
        {/* crin al viento */}
        {[0, 1, 2, 3, 4].map((k) => (
          <path key={k} d={`M${172 - k * 18},${y0 - 160 + k * 26} q${-30 - k * 4},${-6 + ondea(k)} ${-58 - k * 6},${10 + ondea(k + 1)}`} stroke={pelo} strokeWidth={18 - k * 2} strokeLinecap="round" fill="none" />
        ))}
        {/* riendas */}
        {!mara && <path d={`M235,${y0 - 110} Q150,${y0 - 60} 40,${y0 - 80}`} stroke="#3a2416" strokeWidth={4} fill="none" />}
      </g>
      {/* montura */}
      {!mara && (
        <g>
          <path d={`M-40,${y0 - 66} Q10,${y0 - 80} 60,${y0 - 66} L50,${y0 - 30} L-30,${y0 - 30} Z`} fill="#5a2c1a" />
          <rect x={-46} y={y0 - 34} width={110} height={10} rx={4} fill="#c9933a" />
        </g>
      )}
      {/* patas del lado de adelante */}
      {pata({ cx: -70, cy: y0 + 30, a1: -pD.a1 * 0.9, a2: pD.a2 }, cuerpo, casco, 28)}
      {pata({ cx: 78, cy: y0 + 30, a1: -aD.a1, a2: aD.a2 }, cuerpo, casco, 26)}
    </g>
  );
};
