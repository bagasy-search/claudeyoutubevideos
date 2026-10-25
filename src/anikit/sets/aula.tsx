// SET 4 · AULA (Awaken «8 kids per couple»): zócalo de madera, pizarrón verde con texto a mano, ventanas
// con luz de tarde, reloj, láminas, biblioteca, escritorio del maestro con globo terráqueo, bancos de alumnos
// en primer término y lámparas colgantes. Piso: AULA_PISO. x útil: -500 … 3400.
// Puntos: pizarrón 1150 (ancho 1100), escritorio 1900, ventana 250, biblioteca 2700.
// `pizarra` = lo que está escrito en el pizarrón (children SVG, coordenadas del mundo).
import React from "react";
import { random } from "remotion";
import { Haces, LamparaColgante, Polvo } from "../luz";
import { F_MANO } from "../pantalla";
import { SetProps, Ventana, acl, osc } from "./comun";

export const AULA_PISO = 900;
export const AULA_PUNTOS = { pizarron: 1150, escritorio: 1900, ventana: 250, biblioteca: 2700 };
export const PIZARRON = { x: 600, y: 160, w: 1100, h: 480 };

export const Aula: React.FC<SetProps & { pizarra?: React.ReactNode; tiza?: string }> = ({ capa, f, pal, variante, pizarra, tiza = "Grab ONE wolf" }) => {
  const P = AULA_PISO;
  const gris = variante === "gris";
  const pared = gris ? "#2e2e33" : "#5a4a6a";
  const madera = gris ? "#3a332e" : "#6a4630";
  if (capa === "lejos") return <rect x={-800} y={-600} width={5200} height={1800} fill={gris ? "#17171a" : "#2a2040"} />;
  if (capa === "frente") {
    // bancos de alumnos en primer término (pasan por delante en los paneos)
    return (
      <g>
        {[300, 1250, 2200].map((x, i) => (
          <g key={i} transform={`translate(${x},${P + 200})`}>
            <rect x={-170} y={-120} width={340} height={22} rx={4} fill={acl(madera, 0.15)} />
            <rect x={-150} y={-100} width={14} height={180} fill={osc(madera, 0.7)} /><rect x={136} y={-100} width={14} height={180} fill={osc(madera, 0.7)} />
            <rect x={-60} y={-160} width={90} height={40} rx={4} fill={i === 1 ? "#d94a3a" : "#e9e1cf"} transform="rotate(-6)" />
          </g>
        ))}
        <Polvo x={-200} y={0} w={1600} h={900} n={34} f={f} seed={5} />
      </g>
    );
  }
  return (
    <g>
      <rect x={-800} y={-600} width={5200} height={P + 600} fill={pared} />
      {/* zócalo de madera con paneles */}
      <rect x={-800} y={P - 300} width={5200} height={300} fill={madera} />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-760 + i * 180} y={P - 270} width={150} height={240} rx={6} fill="none" stroke={osc(madera, 0.75)} strokeWidth={6} />)}
      <rect x={-800} y={P - 312} width={5200} height={18} fill={acl(madera, 0.2)} />
      {/* ventanas con luz de tarde y haces */}
      {[-260, 250].map((x, i) => <Ventana key={i} x={x} y={120} w={300} h={460} luz={gris ? "#9aa3b5" : "#ffb98a"} prendida marco={acl(pared, 0.5)} />)}
      <Haces x={330} y={160} ang={-38} largo={1100} n={4} ancho={80} color={gris ? "#c8cfdc" : "#ffd3a0"} fuerza={0.12} f={f} seed={3} />
      {/* pizarrón */}
      <rect x={PIZARRON.x - 24} y={PIZARRON.y - 24} width={PIZARRON.w + 48} height={PIZARRON.h + 48} rx={8} fill={acl(madera, 0.25)} />
      <rect x={PIZARRON.x} y={PIZARRON.y} width={PIZARRON.w} height={PIZARRON.h} fill={gris ? "#28302c" : "#2f4a3c"} />
      {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={PIZARRON.x + 150 + random(`bo${i}`) * 800} cy={PIZARRON.y + 80 + random(`bq${i}`) * 300} rx={140} ry={40} fill="#fff" opacity={0.035} />)}
      <rect x={PIZARRON.x - 10} y={PIZARRON.y + PIZARRON.h + 18} width={PIZARRON.w + 20} height={14} fill={osc(madera, 0.8)} />
      <rect x={PIZARRON.x + 120} y={PIZARRON.y + PIZARRON.h + 8} width={40} height={10} rx={3} fill="#f1ede4" />
      {pizarra ?? <text x={PIZARRON.x + 60} y={PIZARRON.y + 90} fontFamily={F_MANO} fontSize={64} fill="#ece8de" opacity={0.92}>{tiza}</text>}
      {/* reloj y láminas */}
      <g transform="translate(1960,170)">
        <circle r={50} fill="#efe8d8" stroke="#3a2a20" strokeWidth={7} />
        <rect x={-3} y={-30} width={6} height={32} rx={3} fill="#3a2a20" transform={`rotate(${120 + f * 0.05})`} />
        <rect x={-2} y={-40} width={4} height={42} rx={2} fill="#3a2a20" transform={`rotate(${f * 1.2})`} />
      </g>
      <rect x={2080} y={110} width={180} height={230} rx={4} fill="#e9dcc0" />
      <circle cx={2170} cy={200} r={60} fill="#c9463a" opacity={0.85} />
      <text x={2170} y={310} fontFamily={F_MANO} fontSize={30} fill="#3a2a20" textAnchor="middle">1987</text>
      {/* biblioteca */}
      <g>
        <rect x={2480} y={P - 640} width={460} height={640} fill={osc(madera, 0.85)} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={2490} y={P - 520 + r * 130} width={440} height={12} fill={acl(madera, 0.1)} />
            {Array.from({ length: 13 }).map((_, k) => {
              const h = 80 + random(`li${r}${k}`) * 30;
              return <rect key={k} x={2500 + k * 32} y={P - 520 + r * 130 - h} width={26} height={h} rx={2} fill={["#c9463a", "#e2b04a", "#4d7fa8", "#6aa05a", "#e9e1cf", "#8f6bd1"][(k + r * 2) % 6]} opacity={gris ? 0.55 : 0.95} />;
            })}
          </g>
        ))}
      </g>
      {/* escritorio del maestro con globo y manzana */}
      <g>
        <rect x={1700} y={P - 220} width={420} height={24} rx={4} fill={acl(madera, 0.3)} />
        <rect x={1720} y={P - 196} width={380} height={196} fill={acl(madera, 0.1)} />
        <circle cx={1790} cy={P - 290} r={50} fill="#4d8fd0" />
        <path d={`M1765,${P - 310} q20,-10 30,10 q10,20 -10,30 q-25,5 -20,-40 Z M1805,${P - 280} q15,0 15,15`} fill="#6aa05a" />
        <path d={`M1790,${P - 240} L1790,${P - 222} M1760,${P - 222} L1820,${P - 222}`} stroke="#3a2a20" strokeWidth={6} />
        <circle cx={2040} cy={P - 240} r={18} fill="#d9352e" />
        <rect x={2038} y={P - 266} width={4} height={10} fill="#3a2a20" />
      </g>
      <rect x={-800} y={P} width={5200} height={600} fill={gris ? "#26262a" : "#7a5236"} />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-800} y={P + 14 + i * 24} width={5200} height={2} fill="#000" opacity={0.12} />)}
      <LamparaColgante x={900} y={40} piso={P} color={pal.luz} techo={-600} f={f} fuerza={0.75} />
      <LamparaColgante x={1700} y={40} piso={P} color={pal.luz} techo={-600} f={f} fuerza={0.75} />
    </g>
  );
};
