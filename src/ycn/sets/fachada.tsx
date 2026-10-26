// SET · HOLLIS LANES por fuera, de noche y con lluvia, sobre la Route 4 (Hamilton, Ohio).
//   lejos: cielo pizarra, árboles pelados, la gasolinera de enfrente con su techo iluminado y el Waffle House… (sin marca: «WAFFLES»)
//   medio: el edificio bajo (x -300…3600) con el LETRERO DE NEÓN ROSA sobre un poste (x 2700), la entrada con
//          persiana (x 1400…1900), estacionamiento con autos y charcos rosas; la Route 4 adelante (y > PISO+160)
// Piso: FACHADA_PISO (vereda de la entrada). props: persiana 0..1, neon 0..1 (o parpadea solo), sirenas (luces que pasan)
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Lluvia, Farol } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { Arbol, SetProps, acl, osc } from "../../anikit/sets/comun";
import { ROSA_NEON } from "../elenco";

export const FACHADA_PISO = 900;
export const FACHADA_PUNTOS = { entrada: 1650, letrero: 2700, auto1: 400, auto2: 3100, ruta: 1200 };
const P = FACHADA_PISO;

const Auto: React.FC<{ x: number; color: string; dir?: 1 | -1 }> = ({ x, color, dir = 1 }) => (
  <g transform={`translate(${x},${P + 70}) scale(${dir},1)`}>
    <path d="M-170,0 L-170,-60 Q-160,-80 -120,-84 L-80,-130 Q-60,-148 20,-148 Q70,-148 100,-110 L150,-84 Q172,-80 172,-56 L172,0 Z" fill={color} />
    <path d="M-66,-120 L-40,-138 L16,-138 L16,-92 L-80,-92 Z M28,-138 Q64,-138 84,-108 L92,-92 L28,-92 Z" fill="#20303a" />
    {[-104, 104].map((cx) => <g key={cx}><circle cx={cx} cy={0} r={30} fill="#16161a" /><circle cx={cx} cy={0} r={12} fill="#6a6a70" /></g>)}
    <rect x={150} y={-70} width={20} height={14} rx={4} fill="#fff1c8" />
  </g>
);

export const Fachada: React.FC<SetProps & { persiana?: number | ((f: number) => number); neon?: number; sirenas?: boolean }> = ({ capa, f, pal, persiana = 0, neon, sirenas }) => {
  const per = Math.max(0, Math.min(1, typeof persiana === "function" ? persiana(f) : persiana));
  // el neón zumba: casi siempre prendido, cada tanto titila (o lo fija la escena)
  const n = neon ?? (random(`nz${Math.floor(f / 4)}`) < 0.06 ? 0.35 : 1);
  if (capa === "lejos") {
    return (
      <g>
        <rect x={-4000} y={-2000} width={14000} height={4000} fill="#0f171c" />
        <rect x={-4000} y={-200} width={14000} height={900} fill="#1a262a" />
        {/* gasolinera de enfrente */}
        <g transform="translate(-300,0)">
          <rect x={-200} y={P - 470} width={900} height={60} fill="#e9e4d8" /><rect x={-200} y={P - 410} width={900} height={14} fill="#c23a2e" />
          <Halo x={250} y={P - 380} r={700} color="#f4fbff" fuerza={0.25} />
          {[0, 300, 600].map((x) => <rect key={x} x={x - 200 + 40} y={P - 396} width={24} height={300} fill="#c9cfd2" />)}
          <rect x={760} y={P - 500} width={60} height={120} fill="#2a3236" /><rect x={720} y={P - 560} width={140} height={70} rx={6} fill="#c23a2e" /><text x={790} y={P - 514} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#fff">GAS</text>
        </g>
        <g transform="translate(3300,0)">
          <rect x={0} y={P - 420} width={700} height={320} fill="#e2b23a" opacity={0.9} /><rect x={0} y={P - 470} width={700} height={60} fill="#2a2a2a" />
          <text x={350} y={P - 428} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} fill="#f2c230">WAFFLES · 24 HRS</text>
          {[0, 1, 2, 3].map((k) => <rect key={k} x={40 + k * 165} y={P - 360} width={130} height={110} fill="#fff1c8" opacity={0.85} />)}
        </g>
        {Array.from({ length: 16 }).map((_, i) => <Arbol key={i} x={-2600 + i * 520 + random(`ar${i}`) * 200} y={P - 100} s={1.6 + random(`as${i}`) * 0.6} copa="#18242a" tronco="#141c20" tipo={i % 3 ? "redondo" : "pino"} />)}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        <g transform="translate(0,-500)"><Lluvia f={f} w={6400} h={1800} x0={-1400} n={1000} seed={3} color="#c9d6e0" largo={2.2} /></g>
        {sirenas && <rect x={-2000} y={-1000} width={8000} height={3000} fill={Math.floor(f / 7) % 2 ? "#ff3a3a" : "#3a6aff"} opacity={0.08} />}
      </g>
    );
  }
  return (
    <g>
      {/* el edificio */}
      <rect x={-300} y={P - 520} width={3900} height={520} fill="#2f4446" />
      <rect x={-300} y={P - 560} width={3900} height={48} fill="#25363a" />
      {/* franjas retro */}
      <rect x={-300} y={P - 480} width={3900} height={18} fill={ROSA_NEON} opacity={0.35 + 0.5 * n} />
      <rect x={-300} y={P - 452} width={3900} height={8} fill="#43e0c4" opacity={0.6} />
      {/* bowlers pintados en la pared + ventanitas altas */}
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-200 + i * 320} y={P - 420} width={220} height={60} rx={6} fill="#f2c27a" opacity={0.55} />)}
      {/* entrada: puertas de vidrio iluminadas + persiana */}
      <rect x={1400} y={P - 360} width={500} height={360} fill="#ffcf7a" />
      <Halo x={1650} y={P - 180} r={600} color="#ffcf7a" fuerza={0.35 * (1 - per)} />
      <rect x={1640} y={P - 360} width={20} height={360} fill="#9aa3aa" />
      <rect x={1380} y={P - 420} width={540} height={60} rx={8} fill="#4a5058" />
      {per > 0 && <g><rect x={1400} y={P - 360} width={500} height={per * 360} fill="#7d858c" />{Array.from({ length: Math.ceil((per * 360) / 20) }).map((_, k) => <rect key={k} x={1400} y={P - 360 + k * 20} width={500} height={4} fill="#5f666c" />)}</g>}
      <rect x={1340} y={P - 380} width={620} height={24} fill="#1a2224" />
      {/* poste y letrero de neón (con el pino) */}
      <rect x={2690} y={P - 1100} width={26} height={1100} fill="#1d2628" />
      <g>
        <rect x={2340} y={P - 1300} width={720} height={260} rx={40} fill="#170f20" />
        <text x={2700} y={P - 1150} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={104} fill={ROSA_NEON} opacity={0.3 + 0.7 * n} letterSpacing={4}>HOLLIS</text>
        <text x={2700} y={P - 1066} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={70} fill="#ffd0e6" opacity={0.3 + 0.7 * n} letterSpacing={18}>LANES</text>
        <path d={`M3010,${P - 1270} c18,0 18,22 12,32 c-4,8 -4,12 4,24 c10,16 8,34 -4,34 l-24,0 c-12,0 -14,-18 -4,-34 c8,-12 8,-16 4,-24 c-6,-10 -6,-32 12,-32 Z`} fill="none" stroke={ROSA_NEON} strokeWidth={6} opacity={0.3 + 0.7 * n} />
        <Halo x={2700} y={P - 1170} r={900} color={ROSA_NEON} fuerza={0.45 * n} />
      </g>
      {/* faroles del estacionamiento */}
      <Farol x={300} piso={P + 60} alto={600} color="#ffd38a" fuerza={0.7} />
      <Farol x={3500} piso={P + 60} alto={600} color="#ffd38a" fuerza={0.7} lado={-1} />
      {/* estacionamiento: asfalto mojado con reflejos */}
      <rect x={-3000} y={P} width={9000} height={900} fill="#1c2428" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-600 + i * 380} y={P + 8} width={10} height={120} fill="#e9e4d8" opacity={0.5} transform={`skewX(-20)`} />)}
      <Charco x={2700} y={P + 90} rx={700} ry={70} color={ROSA_NEON} fuerza={0.4 * n} />
      <Charco x={1650} y={P + 50} rx={420} ry={50} color="#ffcf7a" fuerza={0.4 * (1 - per)} />
      {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={-800 + i * 360 + random(`ch${i}`) * 140} cy={P + 60 + random(`cy${i}`) * 80} rx={60 + random(`cr${i}`) * 80} ry={8} fill={acl("#1c2428", 0.15)} />)}
      <Auto x={FACHADA_PUNTOS.auto1} color="#5a3a4a" />
      <Auto x={FACHADA_PUNTOS.auto2} color="#2f5a6a" dir={-1} />
      {/* Route 4 adelante */}
      <rect x={-3000} y={P + 160} width={9000} height={600} fill={osc("#1c2428", 0.8)} />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-3000 + i * 320} y={P + 250} width={160} height={10} fill="#e2b23a" opacity={0.7} />)}
      <text x={-200} y={P + 230} fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#e9e4d8" opacity={0.4}>RTE 4</text>
      {sirenas && <g><rect x={((f * 40) % 6000) - 2500} y={P + 190} width={260} height={50} rx={10} fill="#e9e4d8" /><rect x={((f * 40) % 6000) - 2420} y={P + 176} width={100} height={18} fill={Math.floor(f / 4) % 2 ? "#ff3a3a" : "#3a6aff"} /><Halo x={((f * 40) % 6000) - 2370} y={P + 180} r={400} color={Math.floor(f / 4) % 2 ? "#ff3a3a" : "#3a6aff"} fuerza={0.4} /></g>}
    </g>
  );
};
