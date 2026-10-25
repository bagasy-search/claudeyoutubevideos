// SET 6 · LABORATORIO / HUD OSCURO (IFShift «parent A / parent B», Awaken «mutations»): azul noche con grilla
// de plano, línea de piso que brilla, consolas con pantallas, tubos de muestra que burbujean, anillo de escaneo
// y siluetas de "datos". Es el set de la CIENCIA: aquí se explica con números. Piso: LAB_PISO. x útil: -600 … 3600.
// Puntos: escaneo 1100, tubos 2200, consola 2900. `contenido` = gráficos propios (SVG en el mundo).
import React from "react";
import { random } from "remotion";
import { Charco, Halo } from "../luz";
import { F_HUD } from "../pantalla";
import { SetProps, acl } from "./comun";

export const LAB_PISO = 930;
export const LAB_PUNTOS = { escaneo: 1100, tubos: 2200, consola: 2900 };

export const AnilloEscaneo: React.FC<{ x: number; y: number; f: number; color: string; r?: number }> = ({ x, y, f, color, r = 220 }) => {
  const sy = y - 40 - ((f * 6) % 420);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.18} fill="none" stroke={color} strokeWidth={4} opacity={0.8} />
      <ellipse cx={x} cy={y} rx={r * 0.8} ry={r * 0.14} fill="none" stroke={color} strokeWidth={2} opacity={0.5} strokeDasharray="12 10" strokeDashoffset={-f * 2} />
      <Charco x={x} y={y} rx={r * 1.2} color={color} fuerza={0.4} />
      <rect x={x - r * 0.7} y={sy} width={r * 1.4} height={4} fill={color} opacity={0.55} />
      <rect x={x - r * 0.7} y={sy} width={r * 1.4} height={40} fill={color} opacity={0.07} />
    </g>
  );
};

export const Lab: React.FC<SetProps & { contenido?: React.ReactNode }> = ({ capa, f, pal, contenido }) => {
  const P = LAB_PISO;
  const c = pal.luzFria;
  if (capa === "lejos") {
    return (
      <g>
        <defs>
          <radialGradient id="labfondo" cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#1c2f6a" /><stop offset="1" stopColor="#0a1230" /></radialGradient>
          <pattern id="labgrilla" width={60} height={60} patternUnits="userSpaceOnUse"><path d="M60,0 H0 V60" fill="none" stroke="#3a5aa8" strokeWidth={1} opacity={0.35} /></pattern>
          <pattern id="labgrilla2" width={300} height={300} patternUnits="userSpaceOnUse"><path d="M300,0 H0 V300" fill="none" stroke="#4a6ac8" strokeWidth={2} opacity={0.35} /></pattern>
        </defs>
        <rect x={-1500} y={-800} width={7000} height={2400} fill="url(#labfondo)" />
        <rect x={-1500} y={-800} width={7000} height={2400} fill="url(#labgrilla)" />
        <rect x={-1500} y={-800} width={7000} height={2400} fill="url(#labgrilla2)" />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={-1200 + random(`ls${i}`) * 6000} cy={-500 + random(`lt${i}`) * 1300} r={1.6} fill="#9fb8ff" opacity={0.3 + 0.3 * Math.sin(f / 20 + i)} />)}
      </g>
    );
  }
  if (capa === "frente") return <g>{contenido}</g>;
  return (
    <g>
      {/* piso oscuro con línea de luz y reflejo */}
      <rect x={-1500} y={P} width={7000} height={700} fill="#070d22" />
      <rect x={-1500} y={P} width={7000} height={3} fill={c} opacity={0.6} />
      <rect x={-1500} y={P + 3} width={7000} height={40} fill={c} opacity={0.06} />
      {/* consolas a los costados con pantallas que muestran ondas */}
      {[-300, 2750].map((x, i) => (
        <g key={i}>
          <rect x={x} y={P - 260} width={420} height={260} rx={14} fill="#121c40" stroke="#2a3c78" strokeWidth={3} />
          <rect x={x + 30} y={P - 560} width={360} height={240} rx={12} fill="#0a1638" stroke={c} strokeOpacity={0.6} strokeWidth={3} />
          <path d={Array.from({ length: 36 }).map((_, k) => `${k ? "L" : "M"}${x + 50 + k * 9.2},${P - 440 + Math.sin(k / 2 + f / 6 + i) * 40 * Math.sin(k / 11)}`).join(" ")} stroke={c} strokeWidth={3} fill="none" />
          {Array.from({ length: 5 }).map((_, k) => <rect key={k} x={x + 50 + k * 66} y={P - 200} width={44} height={14} rx={4} fill={k === (Math.floor(f / 12) + i) % 5 ? c : "#2a3c78"} />)}
          <Halo x={x + 210} y={P - 440} r={260} color={c} fuerza={0.18} />
        </g>
      ))}
      {/* tubos de muestra */}
      {[0, 1, 2, 3].map((k) => {
        const x = LAB_PUNTOS.tubos + (k - 1.5) * 130;
        return (
          <g key={k}>
            <rect x={x - 40} y={P - 520} width={80} height={480} rx={40} fill={c} opacity={0.12} />
            <rect x={x - 40} y={P - 360 + k * 20} width={80} height={320 - k * 20} rx={30} fill={c} opacity={0.22} />
            {Array.from({ length: 5 }).map((_, b) => <circle key={b} cx={x - 15 + random(`tb${k}${b}`) * 30} cy={P - 60 - ((f * (1.5 + b * 0.3) + b * 60) % (280 - k * 20))} r={4 + random(`tr${k}${b}`) * 4} fill={acl(c, 0.5)} opacity={0.6} />)}
            <rect x={x - 40} y={P - 520} width={80} height={480} rx={40} fill="none" stroke={acl(c, 0.3)} strokeWidth={3} opacity={0.8} />
            <rect x={x - 54} y={P - 44} width={108} height={44} rx={8} fill="#1a2650" />
            <rect x={x - 54} y={P - 540} width={108} height={30} rx={8} fill="#1a2650" />
          </g>
        );
      })}
      <Halo x={LAB_PUNTOS.tubos} y={P - 280} r={500} color={c} fuerza={0.2} />
      <AnilloEscaneo x={LAB_PUNTOS.escaneo} y={P} f={f} color={c} />
      <text x={LAB_PUNTOS.escaneo} y={P + 80} fontFamily={F_HUD} fontWeight={600} fontSize={22} letterSpacing={6} fill={c} opacity={0.7} textAnchor="middle">SUBJECT 01</text>
    </g>
  );
};
