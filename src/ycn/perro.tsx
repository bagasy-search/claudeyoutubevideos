// BISCUIT · el basset hound de la liga (de Dot). Cuerpo largo y bajo, orejas que arrastran, collar rojo con chapita,
// tricolor (lomo negro, tostado, panza y punta de la cola blancas). Mismo idioma que el palo: formas planas, sin contorno.
// <Biscuit f ruta=[{f,x,y?}] /> camina solo cuando la ruta se mueve (4 patas en diagonal, orejas que se balancean);
// pose: "parado" | "sentado" | "acostado" | "olfatea" | "aulla"; cola: vel. del meneo (0 quieta); luz: rim como LuzP
import React, { useId } from "react";
import { interpolate } from "remotion";
import { LuzP } from "../anikit/personaje";

export type PoseBiscuit = "parado" | "sentado" | "acostado" | "olfatea" | "aulla";
type Paso = { f: number; x: number; y?: number };

const C = { lomo: "#1d1612", tostado: "#b8743c", blanco: "#f1ebe0", oreja: "#7a4524", nariz: "#120c0a", collar: "#e2302a", chapa: "#f2c230" };

export const Biscuit: React.FC<{
  f: number; ruta: Paso[]; y?: number; dir?: 1 | -1; pose?: PoseBiscuit | ((f: number) => PoseBiscuit);
  cola?: number; escala?: number; luz?: LuzP; mirar?: number;
}> = ({ f, ruta, y = 900, dir, pose = "parado", cola = 1, escala = 1, luz, mirar = 0 }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fs = ruta.map((r) => r.f), xs = ruta.map((r) => r.x);
  const x = ruta.length > 1 ? interpolate(f, fs, xs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : ruta[0].x;
  const yy = ruta.length > 1 ? interpolate(f, fs, ruta.map((r) => r.y ?? y), { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : (ruta[0].y ?? y);
  const vel = ruta.length > 1 ? interpolate(f + 1, fs, xs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) - x : 0;
  const d = dir ?? (vel < -0.05 ? -1 : 1);
  const anda = Math.min(1, Math.abs(vel) / 3);
  const ps = typeof pose === "function" ? pose(f) : pose;
  const sentado = ps === "sentado", acostado = ps === "acostado";
  const fase = (f * 0.32) % (Math.PI * 2);
  const rebote = anda * Math.abs(Math.sin(fase)) * 4;
  const respira = Math.sin(f / 14) * 1.5;
  const bajo = acostado ? 34 : sentado ? 0 : 0;
  // patas: [x de la cadera/hombro, desfase] — diagonales juntas
  const pata = (hx: number, desf: number, del: boolean) => {
    if (acostado) return <path key={hx} d={`M${hx},-34 l${del ? 26 : 18},4`} stroke={C.tostado} strokeWidth={11} strokeLinecap="round" />;
    if (sentado && !del) return <path key={hx} d={`M${hx},-34 q20,8 28,30 l14,0`} stroke={C.tostado} strokeWidth={13} strokeLinecap="round" fill="none" />;
    const s = Math.sin(fase + desf) * anda;
    const pie = hx + s * 14, rod = hx + s * 6 + (del ? 3 : -3);
    return <g key={hx}><path d={`M${hx},-30 L${rod},-15 L${pie},-2`} stroke={C.tostado} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" /><ellipse cx={pie + 3} cy={-2} rx={9} ry={5} fill={C.blanco} /></g>;
  };
  // cuerpo: sentado = se inclina hacia atrás (pecho arriba)
  const inc = sentado ? -24 : 0;
  const cab = ps === "olfatea" ? 22 : ps === "aulla" ? -28 : 0; // rotación de la cabeza
  const cabY = ps === "olfatea" ? 22 : 0;
  const meneo = Math.sin(f * 0.5 * cola) * 18 * Math.min(1, cola);
  const oreja = Math.sin(fase * 1 + 1) * anda * 8 + Math.sin(f / 20) * 2 + (ps === "acostado" ? 62 : 0);
  const lz = luz ? luz.lado * d : 1;
  return (
    <g transform={`translate(${x},${yy}) scale(${escala * d},${escala})`}>
      <defs>
        <linearGradient id={`b${id}`} x1={lz > 0 ? "0%" : "100%"} x2={lz > 0 ? "100%" : "0%"}>
          <stop offset="0.6" stopColor={luz?.color ?? "#fff"} stopOpacity={0} />
          <stop offset="1" stopColor={luz?.borde ?? luz?.color ?? "#ffd9a0"} stopOpacity={(luz?.fuerza ?? 0.8) * 0.9} />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={2} rx={118} ry={12} fill="#000" opacity={0.3} />
      <g transform={`translate(0,${bajo - rebote})`}>
        {/* patas de atrás (lejos) */}
        {pata(-58, Math.PI, false)}{pata(52, 0, true)}
        {/* cola */}
        <g transform={`translate(-82,${-62 + (sentado ? 20 : 0)}) rotate(${-50 + meneo})`}>
          <path d="M0,0 q-8,-30 4,-56" stroke={C.tostado} strokeWidth={10} strokeLinecap="round" fill="none" />
          <path d="M3,-44 q2,-8 1,-12" stroke={C.blanco} strokeWidth={10} strokeLinecap="round" />
        </g>
        <g transform={`rotate(${inc} -60 -40)`}>
          {/* cuerpo largo + lomo negro + panza blanca */}
          <rect x={-96} y={-76 + respira * 0.3} width={178} height={52} rx={26} fill={C.tostado} />
          {sentado && <ellipse cx={-62} cy={-40} rx={40} ry={34} fill={C.tostado} />}
          <path d={`M-88,${-70 + respira * 0.3} Q-10,-90 66,-72 L62,-56 Q-10,-70 -84,-52 Z`} fill={C.lomo} />
          <path d="M-62,-28 Q0,-20 62,-30 L58,-24 Q0,-14 -58,-22 Z" fill={C.blanco} />
          <rect x={-96} y={-76} width={178} height={52} rx={26} fill={`url(#b${id})`} />
          {/* pecho */}
          <ellipse cx={76} cy={-46} rx={24} ry={26} fill={C.blanco} />
          {/* collar */}
        </g>
        {/* patas de adelante (cerca) */}
        {pata(-40, 0, false)}{pata(70, Math.PI, true)}
        {/* cabeza */}
        <g transform={`translate(${96},${-84 + cabY + (sentado ? -34 : 0)}) rotate(${cab})`}>
          <ellipse cx={0} cy={0} rx={32} ry={28} fill={C.tostado} />
          <path d="M-8,-26 Q4,-6 -2,22 L10,22 Q16,-6 6,-26 Z" fill={C.blanco} />
          {/* hocico largo */}
          <path d="M14,-8 Q58,-10 62,10 Q60,28 30,26 Q14,24 12,14 Z" fill={C.tostado} />
          <path d="M24,4 Q50,0 58,12 Q56,24 30,24 Z" fill={C.blanco} />
          <ellipse cx={60} cy={4} rx={9} ry={7} fill={C.nariz} />
          {/* belfos */}
          <path d="M26,22 Q32,40 46,28" fill={C.tostado} />
          {ps === "aulla" && <ellipse cx={46} cy={24} rx={7} ry={5} fill="#3a1a1a" />}
          {/* ojo caído */}
          <ellipse cx={14 + mirar * 3} cy={-6} rx={6} ry={5} fill="#1a0f0a" />
          <path d="M6,-10 Q14,-15 22,-10" stroke="#5a3418" strokeWidth={3} fill="none" />
          <path d="M8,0 Q14,5 20,0" stroke="#7a4524" strokeWidth={3} fill="none" />
          {/* oreja que arrastra */}
          <g transform={`translate(-14,-12) rotate(${oreja})`}>
            <path d="M0,0 Q-26,36 -14,98 Q-2,110 12,98 Q18,46 10,0 Z" fill={C.oreja} />
            <path d="M0,0 Q-26,36 -14,98 Q-2,110 12,98 Q18,46 10,0 Z" fill={`url(#b${id})`} />
          </g>
          <ellipse cx={0} cy={0} rx={32} ry={28} fill={`url(#b${id})`} />
        </g>
        <g transform={`translate(0,${cabY * 0.5 + (sentado ? -30 : 0)})`}>
          <path d="M58,-92 Q74,-72 62,-50" stroke={C.collar} strokeWidth={10} fill="none" strokeLinecap="round" />
          <circle cx={70} cy={-56} r={7} fill={C.chapa} />
        </g>
      </g>
    </g>
  );
};
