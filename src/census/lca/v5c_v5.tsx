// lc01 · vuelta 5 (v5c, planos P01-P14 < 8): componentes nuevos. No toca los _comp compartidos ni v3*/v4*.
// - CuadernoV5: inserto del cuaderno CENSUS en UNA sola acción continua (0,8 s): la mano de Theo (manga naranja +
//   lápiz, la de P52/P56) ya está levantando la tapa en el cuadro 0, la tapa gira con un poco de perspectiva, la
//   cámara empuja todo el tiempo y la mano suelta y baja el lápiz a la página en el corte. Sin sub-cortes ni cuadros quietos.
// - SolTibioV5: sol de día cálido (halo amarillo r ≈ 120) + cielo un punto más tibio (degradé con alfa, sin filtros).
// - GolpesPared: ondas de los nudillos que salen del otro lado de la medianera (mundo).
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { Halo } from "../../anikit/luz";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { ROJO_CENSO } from "../elenco";
import { ManoLapiz } from "./lc01_planos2_comp";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const io = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.inOut(Easing.sin) });

const AlceV5: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-60,30 Q-62,-10 -20,-14 L40,-14 Q70,-12 70,20 L70,30 Z" fill="#7a4a26" />
    {[-50, -30, 40, 58].map((x) => <rect key={x} x={x} y={26} width={10} height={44} rx={4} fill="#5e3818" />)}
    <path d="M40,-14 Q60,-60 92,-46 Q110,-36 104,-18 Q96,-2 70,-4 Z" fill="#7a4a26" />
    <circle cx={88} cy={-36} r={5} fill="#1a120c" />
    <path d="M56,-44 q-30,-36 -6,-60 q4,20 18,14 q2,-22 18,-26 q-4,22 8,26 q10,-20 24,-14 q-8,30 -46,48 Z" fill="#e8c88a" />
  </g>
);

// ---------- 11 · el cuaderno se abre (pantalla completa, 24 cuadros + lo que tapa la cortina) ----------
export const CuadernoV5: React.FC = () => {
  const f = useF();
  // tapa: ya despegada en el cuadro 0 y girando; llega a abierta en el 20
  // (la mano la empuja hasta pasar la vertical y la suelta: cae sola y rebota un poco al apoyarse)
  const ab0 = 0.05 + 0.95 * io(f, -6, 16);
  const ab = f > 16 ? 1 - 0.035 * Math.abs(Math.sin((f - 16) / 2.2)) * Math.exp(-(f - 16) / 5) : ab0;
  // cámara: empuje continuo (nunca quieto) hacia la página derecha
  const z = interpolate(f, [-10, 30], [1.0, 1.2], CL);
  const cx = interpolate(f, [-10, 30], [960, 1010], CL), cy = interpolate(f, [-10, 30], [560, 520], CL);
  const papel = "#f8f2e2";
  const c = Math.cos(ab * Math.PI), sn = Math.sin(ab * Math.PI);
  // borde libre de la tapa (marco del cuaderno, antes de la rotación de -3°)
  const ex = 960 + 650 * c, ey = 820 - 130 * sn;
  // mano: entra (antes del 0), pellizca el borde mientras gira, suelta y baja el lápiz a la página derecha
  const entra = io(f, -16, -4);
  const suelta = io(f, 6, 22);
  const S = 0.78;
  const pinX = ex - 74 * S, pinY = ey + 74 * S; // la punta del lápiz queda bajo el puño
  const tx = 1170, ty = 364; // segundo renglón de la página derecha
  const hx = pinX + (tx - pinX) * suelta + (1 - entra) * 560;
  const hy = pinY + (ty - pinY) * suelta + (1 - entra) * 460;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #3a2c2a 0%, #0f0c14 85%)" }}>
      <AbsoluteFill style={{ transform: `translate(${960 - cx * z}px,${540 - cy * z}px) scale(${z})`, transformOrigin: "0 0" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {/* mesa de madera */}
          <rect x={-200} y={-200} width={2320} height={1480} fill="#4a2e1e" opacity={0.55} />
          {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-200} y={-130 + i * 130} width={2320} height={4} fill="#2e1c12" opacity={0.5} />)}
          <g transform="rotate(-3 960 540)">
            {/* sombra del cuaderno */}
            <rect x={300 + (1 - ab) * 640 + 18} y={204} width={1320 - (1 - ab) * 640} height={720} rx={12} fill="#000" opacity={0.35} />
            {/* página derecha */}
            <rect x={960} y={190} width={640} height={720} rx={10} fill={papel} />
            {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={980} y={270 + i * 46} width={600} height={2} fill="#9fb4d4" opacity={0.6} />)}
            <rect x={1040} y={190} width={3} height={720} fill="#e09a9a" opacity={0.7} />
            {/* sombra que la tapa levantada tira sobre la página derecha */}
            {ab < 0.5 && <path d={`M960,190 L${ex + 40},${190 + 30 * sn} L${ex + 40},${920} L960,920 Z`} fill="#000" opacity={0.22 * sn} />}
            {/* la tapa: gira sobre el lomo con un poco de perspectiva (el borde libre sube al levantarse) */}
            <g transform={`translate(960,0) scale(${c},1) translate(-960,0)`}>
              <g transform={`translate(960,550) skewY(${-7 * sn * Math.sign(c || 1)}) translate(-960,-550)`}>
                <rect x={960} y={180} width={660} height={740} rx={14} fill={ab < 0.5 ? ROJO_CENSO : "#8a2a22"} />
                <rect x={1590} y={180} width={30} height={740} rx={8} fill={ab < 0.5 ? "#9a2a20" : "#6a1e18"} />
                {ab < 0.5 ? <>
                  <rect x={1010} y={240} width={560} height={110} rx={8} fill="#f4ecd6" />
                  <text x={1290} y={318} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={74} fill="#1d3a8a">CENSUS</text>
                  <g transform="translate(1250,620)"><AlceV5 s={1.6} /></g>
                  <text x={1290} y={870} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill="#f4ecd6" opacity={0.8}>GAS · SNACKS · BAIT</text>
                </> : <>
                  {/* cara de adentro de la tapa: forro de papel y un bolsillo */}
                  <rect x={990} y={210} width={600} height={680} rx={8} fill="#efe3c8" opacity={0.9} />
                  <path d="M990,700 L1590,700 L1590,890 L990,890 Z" fill="#d9c8a4" />
                  <path d="M990,700 L1590,700" stroke="#b8a682" strokeWidth={4} />
                </>}
              </g>
            </g>
            {/* lomo */}
            <rect x={952} y={186} width={16} height={728} rx={6} fill="#6a1e18" />
            {/* sombra de la mano y la mano (manga naranja de Theo + lápiz) */}
            <ellipse cx={hx + 120} cy={hy + 70} rx={120} ry={40} fill="#000" opacity={0.16 * entra} />
            <ManoLapiz x={hx} y={hy} manga="#c8582b" s={S} />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 7 · sol cálido + cielo tibio (pantalla, va dentro del Empuje) ----------
export const SolTibioV5: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 52 }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="v5cTibio" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#ffc778" stopOpacity={0.46} />
        <stop offset="0.35" stopColor="#ffd9a0" stopOpacity={0.22} />
        <stop offset="0.6" stopColor="#ffe6c0" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1500} fill="url(#v5cTibio)" />
    <Halo x={x} y={y} r={r * 6} color="#ffcf7a" fuerza={0.5} />
    <Halo x={x} y={y} r={120} color="#ffb547" fuerza={0.9} />
    <circle cx={x} cy={y} r={r} fill="#ffe9a8" />
    <circle cx={x - r * 0.18} cy={y - r * 0.18} r={r * 0.62} fill="#fff6d2" />
  </svg>
);

// ---------- 13 · golpes en la medianera: ondas que salen del lado del vecino (mundo) ----------
export const GolpesPared: React.FC<{ f: number; x: number; y: number; golpes: number[] }> = ({ f, x, y, golpes }) => (
  <g>
    {golpes.map((g0, i) => {
      if (f < g0 || f > g0 + 22) return null;
      const u = (f - g0) / 22;
      return [0, 1].map((j) => {
        const r = 22 + u * 70 + j * 22;
        return <path key={`${i}-${j}`} d={`M${x + r * 0.5},${y - r * 0.87} A${r},${r} 0 0 1 ${x + r * 0.5},${y + r * 0.87}`} stroke="#f6ecd2" strokeWidth={6 - 3 * u} fill="none" strokeLinecap="round" opacity={(1 - u) * (0.85 - 0.3 * j)} />;
      });
    })}
  </g>
);
