// SET · CENTRO DE VISITANTES DE CANAL PARK (lc-b, Ep.3), por dentro. Piso VIS_PISO. Mundo útil x −300 … 3400.
//   pizarra blanca de Gus (VIS_PIZARRA, 220…900) · ventanal al canal con el Aerial Lift Bridge y el lago (1100…2300)
//   · mapa de Duluth en la pared (VIS_MAPA, 2450…3250) con los 4 lugares que se salvan · maqueta de un laker en vitrina
//   · cartel CANAL PARK VISITOR CENTER. La pizarra y el mapa se escriben/marcan con `pizarra` y `mapa`.
// props: hora · alza 0..1 (tablero del puente) · pizarra [{t, desde, fila, x?, color?, tam?}] · tachas [f por fila] ·
//        mapa { desde?: f de los círculos [4], apagar?: f en que todo se apaga menos los círculos }
import React from "react";
import { interpolate, random } from "remotion";
import { Charco, Halo, Haces, Polvo } from "../../anikit/luz";
import { Cielo, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { F_MANO } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { Vapor } from "../mundo/comun";
import { Hora, LUCES } from "../mundo/hora";
import { PuenteLift } from "../mundo/puenteLift";

export const VIS_PISO = 900;
export const VIS_PIZARRA = { x: 220, y: 250, w: 680, h: 420 };
export const VIS_MAPA = { x: 2450, y: 220, w: 800, h: 470 };
export const VIS_PUNTOS = { pizarra: 560, ventana: 1700, mapa: 2850, vitrina: 1000, puerta: 3350 };
// lugares del mapa (coordenadas del mundo) en el orden en que se salvan: biblioteca, farmacia del hospital, radio, botes
export const MAPA_LUGARES = [
  { x: VIS_MAPA.x + 300, y: VIS_MAPA.y + 230, t: "LIBRARY" },
  { x: VIS_MAPA.x + 470, y: VIS_MAPA.y + 160, t: "PHARMACY" },
  { x: VIS_MAPA.x + 205, y: VIS_MAPA.y + 330, t: "RADIO" },
  { x: VIS_MAPA.x + 130, y: VIS_MAPA.y + 395, t: "BOATS" },
];

export type Renglon = { t: string; desde: number; fila: number; x?: number; color?: string; tam?: number };
type P = SetProps & { hora?: Hora; alza?: number; pizarra?: Renglon[]; tachas?: number[]; mapa?: { desde?: number[]; apagar?: number } };

const revela = (f: number, desde: number, n: number, vel = 1.3) => interpolate(f, [desde, desde + Math.max(6, n * vel)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Visitantes: React.FC<P> = ({ capa, f, hora = "dia", alza = 1, pizarra = [], tachas = [], mapa = {} }) => {
  const L = LUCES[hora];
  const P = VIS_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} x={-1500} w={6000} />
        <Halo x={1500} y={L.solY} r={420} color={L.sol} fuerza={0.6} />
        <rect x={-1500} y={560} width={6000} height={500} fill={L.lago[0]} />
        <rect x={-1500} y={680} width={6000} height={400} fill={L.lago[1]} opacity={0.6} />
        {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={600 + random(`vl${i}`) * 1900 + Math.sin(f / 30 + i) * 10} y={575 + i * 8} width={40 + random(`vw${i}`) * 90} height={3} rx={2} fill={acl(L.lago[0], 0.35)} opacity={0.5} />)}
        <Vapor f={f} x0={500} w={2200} y={600} o={hora === "invierno" ? 0.6 : 0.25} />
        {/* muelle del canal y el puente levadizo */}
        <rect x={400} y={600} width={2400} height={26} fill={mezclar("#5a5060", L.tinte, 0.3)} />
        <PuenteLift x={1040} y={610} W={1140} H={470} color={mezclar("#2a2436", L.tinte, 0.2)} alza={alza} />
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        <Haces x={1700} y={120} ang={-24} largo={1100} n={5} ancho={70} color={acl(L.sol, 0.2)} fuerza={0.1} f={f} />
        <Polvo x={300} y={150} w={2600} h={700} n={40} f={f} seed={5} />
      </g>
    );
  }
  const pared = "#2f3a48";
  const apagar = mapa.apagar ?? 1e9;
  const oscMapa = interpolate(f, [apagar, apagar + 24], [0, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      {/* pared con hueco del ventanal */}
      <defs><clipPath id="vispared"><path clipRule="evenodd" d={`M-800,-400 H4000 V${P} H-800 Z M1100,120 V740 H2300 V120 Z`} /></clipPath></defs>
      <g clipPath="url(#vispared)">
        <rect x={-800} y={-400} width={4800} height={P + 400} fill={pared} />
        {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-800 + i * 120} y={-400} width={3} height={P + 400} fill={osc(pared, 0.85)} />)}
        <rect x={-800} y={P - 160} width={4800} height={160} fill={osc(pared, 0.8)} />
        <Halo x={1700} y={450} r={1200} color={L.sol} fuerza={0.22} />
      </g>
      {/* ventanal */}
      <rect x={1090} y={110} width={1220} height={640} fill="none" stroke="#1a1f28" strokeWidth={22} />
      {[1495, 1900].map((x) => <rect key={x} x={x} y={110} width={14} height={640} fill="#1a1f28" />)}
      <rect x={1060} y={748} width={1280} height={22} rx={4} fill="#4a5262" />
      {/* cartel */}
      <rect x={1300} y={20} width={800} height={64} rx={8} fill="#1d2a38" stroke={AMBAR} strokeWidth={3} />
      <text x={1700} y={64} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={34} fill="#f6ecd2" letterSpacing={3}>CANAL PARK VISITOR CENTER</text>

      {/* PIZARRA */}
      <g>
        <rect x={VIS_PIZARRA.x - 14} y={VIS_PIZARRA.y - 14} width={VIS_PIZARRA.w + 28} height={VIS_PIZARRA.h + 28} rx={8} fill="#a9b0ba" />
        <rect x={VIS_PIZARRA.x} y={VIS_PIZARRA.y} width={VIS_PIZARRA.w} height={VIS_PIZARRA.h} fill="#f4f6f6" />
        <rect x={VIS_PIZARRA.x} y={VIS_PIZARRA.y + VIS_PIZARRA.h} width={VIS_PIZARRA.w} height={14} fill="#8a909a" />
        {[0, 1, 2].map((k) => <rect key={k} x={VIS_PIZARRA.x + 40 + k * 40} y={VIS_PIZARRA.y + VIS_PIZARRA.h - 2} width={30} height={10} rx={3} fill={["#2a3a8a", "#c0352c", "#2a7a3a"][k]} />)}
        {pizarra.map((r, i) => {
          const tam = r.tam ?? 46;
          const x = VIS_PIZARRA.x + (r.x ?? 36), y = VIS_PIZARRA.y + 66 + r.fila * 58;
          const pr = revela(f, r.desde, r.t.length);
          const id = `vz${i}`;
          return (
            <g key={i}>
              <defs><clipPath id={id}><rect x={x - 6} y={y - tam} width={(r.t.length * tam * 0.6 + 20) * pr} height={tam * 1.4} /></clipPath></defs>
              <text x={x} y={y} clipPath={`url(#${id})`} fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={r.color ?? "#1d2a6a"}>{r.t}</text>
            </g>
          );
        })}
        {tachas.map((ft, fila) => {
          if (ft === undefined || ft < 0) return null;
          const t = revela(f, ft, 8, 1);
          if (t <= 0) return null;
          const x = VIS_PIZARRA.x + 470, y = VIS_PIZARRA.y + 52 + fila * 58;
          return <path key={fila} d={`M${x},${y - 18} L${x + 44 * t},${y - 18 + 40 * t} M${x + 44},${y - 18} L${x + 44 - 44 * Math.max(0, t * 2 - 1)},${y - 18 + 40 * Math.max(0, t * 2 - 1)}`} stroke="#d8382c" strokeWidth={9} strokeLinecap="round" />;
        })}
      </g>

      {/* vitrina con la maqueta del laker */}
      <g>
        <rect x={860} y={P - 200} width={200} height={200} fill="#3a3a44" />
        <rect x={850} y={P - 360} width={220} height={160} fill={acl(pared, 0.2)} opacity={0.5} stroke="#8a909a" strokeWidth={4} />
        <path d={`M875,${P - 240} L1050,${P - 240} L1040,${P - 222} L885,${P - 222} Z`} fill="#8a2a26" />
        <rect x={880} y={P - 262} width={30} height={22} fill="#efe6d2" /><rect x={1015} y={P - 262} width={28} height={22} fill="#efe6d2" />
      </g>

      {/* MAPA DE DULUTH */}
      <g>
        <rect x={VIS_MAPA.x - 12} y={VIS_MAPA.y - 12} width={VIS_MAPA.w + 24} height={VIS_MAPA.h + 24} fill="#6a4a32" />
        <rect x={VIS_MAPA.x} y={VIS_MAPA.y} width={VIS_MAPA.w} height={VIS_MAPA.h} fill="#e9dcc0" />
        {/* lago abajo a la izquierda, la costa en diagonal (Duluth corre de SO a NE sobre la orilla) */}
        <path d={`M${VIS_MAPA.x},${VIS_MAPA.y + 470} L${VIS_MAPA.x},${VIS_MAPA.y + 380} Q${VIS_MAPA.x + 300},${VIS_MAPA.y + 330} ${VIS_MAPA.x + 800},${VIS_MAPA.y + 120} L${VIS_MAPA.x + 800},${VIS_MAPA.y + 470} Z`} fill="#7fa6c8" />
        <path d={`M${VIS_MAPA.x + 120},${VIS_MAPA.y + 395} L${VIS_MAPA.x + 150},${VIS_MAPA.y + 470}`} stroke="#5a7a9a" strokeWidth={6} />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${VIS_MAPA.x + 20 + i * 30},${VIS_MAPA.y + 360 - i * 10} L${VIS_MAPA.x + 400 + i * 45},${VIS_MAPA.y + 60 - i * 4}`} stroke="#c9b48a" strokeWidth={4} opacity={0.0} />)}
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${VIS_MAPA.x + 30},${VIS_MAPA.y + 345 - i * 45} Q${VIS_MAPA.x + 350},${VIS_MAPA.y + 300 - i * 50} ${VIS_MAPA.x + 790},${VIS_MAPA.y + 90 - i * 40}`} stroke="#b9a47a" strokeWidth={3} fill="none" />)}
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${VIS_MAPA.x + 40 + i * 64},${VIS_MAPA.y + 20} L${VIS_MAPA.x + 20 + i * 64},${VIS_MAPA.y + 360 - i * 22}`} stroke="#c9b48a" strokeWidth={2.5} />)}
        {Array.from({ length: 70 }).map((_, i) => {
          const u = random(`mb${i}`), v = random(`mv${i}`);
          const x = VIS_MAPA.x + 30 + u * 740, y = VIS_MAPA.y + 30 + v * (330 - u * 220);
          return <rect key={i} x={x} y={y} width={14} height={10} fill="#8a7a6a" opacity={0.55} />;
        })}
        <text x={VIS_MAPA.x + 24} y={VIS_MAPA.y + 50} fontFamily={F_MANO} fontWeight={700} fontSize={38} fill="#3a2a20">DULUTH</text>
        <text x={VIS_MAPA.x + 560} y={VIS_MAPA.y + 420} fontFamily={F_MANO} fontWeight={700} fontSize={30} fill="#2a4a6a">Lake Superior</text>
        <rect x={VIS_MAPA.x} y={VIS_MAPA.y} width={VIS_MAPA.w} height={VIS_MAPA.h} fill="#0b0a12" opacity={oscMapa} />
        {MAPA_LUGARES.map((l, i) => {
          const d = mapa.desde?.[i];
          if (d === undefined) return null;
          const t = revela(f, d, 10, 1.4);
          if (t <= 0) return null;
          const r = 46;
          const arco = 2 * Math.PI * r;
          return (
            <g key={i}>
              <Halo x={l.x} y={l.y} r={90} color={AMBAR} fuerza={0.5 * t} />
              <circle cx={l.x} cy={l.y} r={r} fill="none" stroke={AMBAR} strokeWidth={8} strokeDasharray={`${arco * t} ${arco}`} transform={`rotate(-90 ${l.x} ${l.y})`} strokeLinecap="round" />
              <circle cx={l.x} cy={l.y} r={9} fill={AMBAR} opacity={t} />
              <text x={l.x + 56} y={l.y + 10} fontFamily={F_MANO} fontWeight={700} fontSize={30} fill={AMBAR} opacity={t}>{l.t}</text>
            </g>
          );
        })}
      </g>

      {/* piso de baldosas */}
      <rect x={-800} y={P} width={4800} height={900} fill="#3a3a44" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-800 + i * 120} y={P} width={3} height={300} fill="#2c2c34" />)}
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-800} y={P + 20 + i * 40} width={4800} height={2} fill="#2c2c34" />)}
      <Charco x={1700} y={P + 40} rx={1000} color={L.sol} fuerza={0.3} />
      {/* banco largo bajo el ventanal */}
      <rect x={1250} y={P - 110} width={900} height={22} rx={6} fill="#8a6a48" />
      {[1290, 2090].map((x) => <rect key={x} x={x} y={P - 90} width={16} height={90} fill="#5a4030" />)}
    </g>
  );
};
