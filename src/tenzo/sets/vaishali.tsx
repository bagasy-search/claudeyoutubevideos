// SET · VAISHALI, hace 2.500 años (parábola de tz01): todo cálido, ámbar y ocre.
//   calle   (x -600 … 2000): casas con puertas de oro, toldos, banderines; el portón de Amrapali en 1900
//   jardín  (x 2200 … 3900): mangos cargados y el pabellón de Amrapali (columnas, cortinas, lámparas de aceite) en 3100
//   arboleda (x 4500 … 6600): el gran árbol (el Buda sentado debajo, en 5400) y filas de monjes sentados de túnica naranja
// Piso: VAI_PISO. Puntos en VAI_PUNTOS.
// setProps: lluvia (temporada de lluvias), noche (lámparas encendidas, cielo violeta-ámbar), murmullo 0..1 (los monjes
//           se inclinan unos a otros), monjes (default true), amrapaliEnPortal (nada: los personajes los pone la escena).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Haces, Lluvia, Polvo } from "../../anikit/luz";
import { Arbol, Cielo, Colinas, Nube, SetProps, osc } from "../../anikit/sets/comun";

export const VAI_PISO = 900;
export const VAI_PUNTOS = { calle: 800, portal: 1900, jardin: 2600, pabellon: 3100, cojin: 3100, sendero: 4100, monjes: 4900, arbol: 5400, buda: 5400, monjes2: 5950 };

// mango: copa redonda olivácea con frutas
const Mango: React.FC<{ x: number; y: number; s?: number; seed: number; f: number }> = ({ x, y, s = 1, seed, f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-12,0 L-8,-150 Q0,-170 8,-150 L12,0 Z" fill="#6a4426" />
    <path d="M-4,-120 Q-60,-160 -90,-170 M4,-130 Q60,-170 80,-190" stroke="#6a4426" strokeWidth={10} fill="none" />
    {[[-90, -230, 95], [70, -250, 100], [0, -300, 110], [-40, -200, 90], [50, -200, 85]].map(([cx, cy, r], k) => (
      <circle key={k} cx={cx + Math.sin(f / 60 + k + seed) * 2} cy={cy} r={r} fill={k % 2 ? "#8a8a3a" : "#7a7a30"} />
    ))}
    {Array.from({ length: 10 }).map((_, k) => <ellipse key={k} cx={-110 + random(`mg${seed}${k}`) * 220} cy={-330 + random(`mh${seed}${k}`) * 180} rx={11} ry={15} fill={k % 3 ? "#f2a23a" : "#e8c040"} />)}
  </g>
);

// monje sentado de la multitud (silueta simple, barata): `inc` = inclinación (murmullo)
const MonjeSentado: React.FC<{ x: number; y: number; s: number; inc: number; tono: number }> = ({ x, y, s, inc, tono }) => {
  const tun = ["#e07a2c", "#d8702a", "#e88a34"][tono % 3];
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${inc})`}>
      <path d="M-46,0 Q-50,-40 -30,-70 Q0,-84 30,-70 Q50,-40 46,0 Z" fill={tun} stroke="#5a3418" strokeWidth={3} />
      <path d="M-30,-70 Q-6,-30 30,-6" stroke={osc(tun, 0.8)} strokeWidth={8} fill="none" />
      <circle cx={0} cy={-100} r={30} fill="#d9a273" stroke="#5a3418" strokeWidth={3} />
    </g>
  );
};

export const Vaishali: React.FC<SetProps & { lluvia?: boolean; noche?: boolean; murmullo?: number; monjes?: boolean }> = ({ capa, f, pal, lluvia = false, noche = false, murmullo = 0, monjes = true }) => {
  const P = VAI_PISO;
  const cielo: [string, string, string] = noche ? ["#3a2240", "#8a4a48", "#d98a50"] : lluvia ? ["#8a6a50", "#b08a62", "#d6b080"] : pal.cielo;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={cielo} />
        {!noche && !lluvia && <><Halo x={3600} y={260} r={700} color="#fff2c8" fuerza={0.7} /><circle cx={3600} cy={260} r={70} fill="#fff6dc" /></>}
        {noche && <circle cx={1200} cy={180} r={40} fill="#ffe9c0" opacity={0.9} />}
        {[[600, 160, 1.2], [2400, 100, 0.9], [4600, 200, 1.4], [6200, 120, 1]].map(([x, y, s], k) => <Nube key={k} x={x + f * 0.1} y={y} s={s} color={lluvia ? "#9a7a62" : "#ffe6b8"} o={0.8} />)}
        <Colinas y={P - 240} alto={200} color={noche ? "#5a3440" : lluvia ? "#9a7050" : "#d99a5a"} seed={3} x0={-1500} w={9000} />
        <Colinas y={P - 160} alto={140} color={noche ? "#4a2a36" : lluvia ? "#8a6244" : "#c9864a"} seed={5} x0={-1500} w={9000} />
        {/* siluetas de la ciudad (cúpulas, torres) */}
        {Array.from({ length: 14 }).map((_, k) => { const x = -600 + k * 360; const h = 140 + random(`vt${k}`) * 160; return <g key={k} fill={noche ? "#4a2a34" : "#c47e46"}><rect x={x} y={P - 160 - h} width={120} height={h} /><path d={`M${x - 10},${P - 160 - h} Q${x + 60},${P - 260 - h} ${x + 130},${P - 160 - h} Z`} /></g>; })}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {lluvia && <Lluvia f={f} x0={-800} w={8000} h={1400} n={260} color="#f4dcb0" largo={1.2} />}
        {!lluvia && !noche && <Haces x={3400} y={-100} ang={24} largo={1300} n={7} ancho={70} color="#fff0c0" fuerza={0.14} f={f} />}
        {!lluvia && <Polvo x={-600} y={150} w={7400} h={750} n={70} f={f} seed={4} color="#fff0c8" />}
      </g>
    );
  }
  const lampara = (x: number, y: number) => (
    <g key={`l${x}`}>
      <path d={`M${x - 14},${y} Q${x},${y + 14} ${x + 14},${y} Z`} fill="#8a5a2a" />
      <path d={`M${x},${y - 2} q-5,-10 0,-18 q5,8 0,18 Z`} fill="#ffd06a" opacity={0.9 + 0.1 * Math.sin(f / 5 + x)} />
      <Halo x={x} y={y - 8} r={noche ? 200 : 90} color="#ffc060" fuerza={noche ? 0.6 : 0.3} />
    </g>
  );
  return (
    <g>
      {/* ---------- CALLE ---------- */}
      {[-600, -120, 360, 840, 1320].map((x, k) => {
        const c = pal.fachada[k % 4], h = 460 + (k % 3) * 70;
        return (
          <g key={x}>
            <rect x={x} y={P - h} width={440} height={h} fill={c} />
            <rect x={x - 10} y={P - h - 20} width={460} height={24} fill={osc(c, 0.85)} />
            <path d={`M${x + 20},${P - h - 20} L${x + 220},${P - h - 110} L${x + 420},${P - h - 20} Z`} fill={osc(c, 0.75)} />
            {/* puerta de oro con arco */}
            <path d={`M${x + 160},${P} L${x + 160},${P - 200} Q${x + 220},${P - 280} ${x + 280},${P - 200} L${x + 280},${P} Z`} fill="#e0b040" stroke="#8a5a2a" strokeWidth={5} />
            <circle cx={x + 255} cy={P - 110} r={7} fill="#8a5a2a" />
            {/* ventanas con celosía */}
            {[60, 320].map((dx) => <g key={dx}><path d={`M${x + dx},${P - h + 110} L${x + dx},${P - h + 190} L${x + dx + 70},${P - h + 190} L${x + dx + 70},${P - h + 110} Q${x + dx + 35},${P - h + 70} ${x + dx},${P - h + 110} Z`} fill={noche ? "#ffcf7a" : "#7a4a2a"} />{[0, 1, 2].map((q) => <line key={q} x1={x + dx + 18 + q * 17} y1={P - h + 100} x2={x + dx + 18 + q * 17} y2={P - h + 190} stroke={osc(c, 0.7)} strokeWidth={3} />)}</g>)}
            {/* toldo a rayas */}
            <path d={`M${x + 20},${P - 300} L${x + 420},${P - 300} L${x + 440},${P - 240} L${x},${P - 240} Z`} fill={k % 2 ? "#c8603a" : "#e0a040"} />
            {Array.from({ length: 6 }).map((_, q) => <path key={q} d={`M${x + 40 + q * 66},${P - 300} L${x + 30 + q * 70},${P - 240}`} stroke="#f4e2c0" strokeWidth={14} opacity={0.5} />)}
            {lampara(x + 120, P - 330)}
          </g>
        );
      })}
      {/* banderines cruzando la calle */}
      {[0, 1].map((r) => <g key={r}><path d={`M-600,${-60 + r * 120} Q700,${60 + r * 120} 2000,${-60 + r * 120}`} stroke="#6a4426" strokeWidth={2} fill="none" />{Array.from({ length: 22 }).map((_, k) => { const t = k / 21, x = -600 + t * 2600, y = -60 + r * 120 + Math.sin(t * Math.PI) * 120 * 0.85; return <path key={k} d={`M${x - 16},${y} L${x + 16},${y} L${x},${y + 34 + Math.sin(f / 10 + k) * 3} Z`} fill={["#c8323a", "#e0b040", "#e8782c", "#f4e2c0"][k % 4]} />; })}</g>)}
      {/* ---------- PORTÓN DE AMRAPALI ---------- */}
      <g transform={`translate(${VAI_PUNTOS.portal},0)`}>
        <rect x={-210} y={P - 560} width={60} height={560} fill="#e8c08a" stroke="#8a5a2a" strokeWidth={4} />
        <rect x={150} y={P - 560} width={60} height={560} fill="#e8c08a" stroke="#8a5a2a" strokeWidth={4} />
        <path d={`M-230,${P - 560} Q0,${P - 760} 230,${P - 560} L230,${P - 520} Q0,${P - 700} -230,${P - 520} Z`} fill="#e0b040" stroke="#8a5a2a" strokeWidth={4} />
        <circle cx={0} cy={P - 670} r={26} fill="#c8323a" stroke="#e0b040" strokeWidth={6} />
        {[-180, 180].map((x) => <path key={x} d={`M${x},${P - 560} q-30,30 0,70 q30,40 0,80`} stroke="#5a8a3a" strokeWidth={8} fill="none" />)}
        {[-180, 180].map((x) => [0, 1, 2].map((k) => <circle key={`${x}${k}`} cx={x + (k % 2 ? 14 : -14)} cy={P - 520 + k * 50} r={10} fill="#f2c14a" />))}
      </g>
      {/* ---------- JARDÍN DE MANGOS ---------- */}
      <rect x={2050} y={P - 120} width={1950} height={120} fill="#c9925a" />
      {[[2250, 0.95], [2560, 1.05], [3680, 1], [3920, 0.9], [2900, 0.7], [3350, 0.72]].map(([x, s], k) => <Mango key={k} x={x} y={P} s={s} seed={k} f={f} />)}
      {/* pabellón de Amrapali */}
      <g transform={`translate(${VAI_PUNTOS.pabellon},0)`}>
        <rect x={-380} y={P - 40} width={760} height={40} fill="#e8c08a" stroke="#8a5a2a" strokeWidth={4} />
        {[-340, -170, 0, 170, 340].map((x) => <g key={x}><rect x={x - 16} y={P - 470} width={32} height={430} fill="#f0d2a0" stroke="#8a5a2a" strokeWidth={3} /><rect x={x - 24} y={P - 70} width={48} height={30} fill="#d9a86e" /><rect x={x - 24} y={P - 480} width={48} height={20} fill="#d9a86e" /></g>)}
        <path d={`M-420,${P - 470} L420,${P - 470} L340,${P - 600} L-340,${P - 600} Z`} fill="#c8603a" stroke="#8a3a2a" strokeWidth={4} />
        <path d={`M-200,${P - 600} Q0,${P - 720} 200,${P - 600} Z`} fill="#e0b040" stroke="#8a5a2a" strokeWidth={4} />
        {/* cortinas de seda */}
        {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 340},${P - 460} Q${sd * 300},${P - 250} ${sd * 330},${P - 40} L${sd * 250},${P - 40} Q${sd * 280},${P - 250} ${sd * 230},${P - 460} Z`} fill="#b8323a" opacity={0.85} transform={`translate(${Math.sin(f / 30 + sd) * 4},0)`} />)}
        <rect x={-120} y={P - 70} width={240} height={30} rx={10} fill="#a8323a" />
        <rect x={-80} y={P - 90} width={70} height={26} rx={10} fill="#e0b040" /><rect x={20} y={P - 90} width={70} height={26} rx={10} fill="#e0b040" />
        {[-280, 280].map((x) => lampara(x, P - 380))}
        {/* jazmines colgando */}
        {Array.from({ length: 12 }).map((_, k) => <circle key={k} cx={-330 + k * 60} cy={P - 455 + Math.sin(k) * 6} r={6} fill="#fff6e6" />)}
      </g>
      {/* ---------- SENDERO Y ARBOLEDA ---------- */}
      <path d={`M3950,${P} Q4200,${P - 20} 4500,${P}`} stroke="#d9a86e" strokeWidth={20} fill="none" />
      <Arbol x={4300} y={P} s={1.1} copa="#9a8a3a" tronco="#6a4426" />
      <Arbol x={6500} y={P} s={1.2} copa="#8a7a30" tronco="#6a4426" />
      {/* el gran árbol del Buda */}
      <g transform={`translate(${VAI_PUNTOS.arbol},0)`}>
        <path d={`M-60,${P} Q-40,${P - 260} -20,${P - 380} L20,${P - 380} Q40,${P - 260} 70,${P} Z`} fill="#6a4426" />
        <path d={`M-20,${P - 340} Q-200,${P - 420} -320,${P - 400} M20,${P - 350} Q220,${P - 460} 340,${P - 430}`} stroke="#6a4426" strokeWidth={22} fill="none" />
        {[[-300, -520, 190], [280, -540, 200], [0, -640, 240], [-150, -470, 160], [160, -470, 170], [-420, -430, 120], [420, -450, 120]].map(([cx, cy, r], k) => <circle key={k} cx={cx + Math.sin(f / 70 + k) * 3} cy={P + cy} r={r} fill={k % 2 ? "#8a8a36" : "#7a7a2e"} />)}
        {Array.from({ length: 18 }).map((_, k) => <ellipse key={k} cx={-420 + random(`hj${k}`) * 840} cy={P - 780 + random(`hk${k}`) * 400} rx={18} ry={11} fill="#a8a048" transform={`rotate(${random(`hr${k}`) * 90} ${-420 + random(`hj${k}`) * 840} ${P - 780 + random(`hk${k}`) * 400})`} />)}
        <ellipse cx={0} cy={P - 4} rx={170} ry={22} fill="#b07c4a" />
        <Halo x={0} y={P - 220} r={520} color="#fff2c8" fuerza={0.35} />
      </g>
      {/* piso de tierra cálida */}
      <rect x={-900} y={P} width={8200} height={900} fill={pal.piso} />
      <rect x={-900} y={P} width={8200} height={8} fill={osc(pal.piso, 0.85)} />
      {Array.from({ length: 40 }).map((_, k) => <ellipse key={k} cx={-800 + k * 200 + random(`pd${k}`) * 80} cy={P + 30 + random(`pe${k}`) * 160} rx={20 + random(`pf${k}`) * 30} ry={5} fill={osc(pal.piso, 0.88)} />)}
      {lluvia && Array.from({ length: 20 }).map((_, k) => <ellipse key={`ch${k}`} cx={-600 + k * 380} cy={P + 60 + (k % 3) * 40} rx={90} ry={10} fill="#f4dcb0" opacity={0.25} />)}
      <Charco x={VAI_PUNTOS.pabellon} y={P + 40} rx={600} color="#ffd88a" fuerza={noche ? 0.45 : 0.25} />
      {/* ---------- 500 MONJES (filas, de atrás hacia adelante) ---------- */}
      {monjes && [0, 1, 2, 3].map((fila) => {
        const s = 0.55 + fila * 0.13, y = P - 40 + fila * 30;
        return Array.from({ length: 9 - fila }).map((_, k) => [VAI_PUNTOS.monjes - 520, VAI_PUNTOS.monjes2 - 200].map((x0, lado) => {
          const x = x0 + k * (120 + fila * 8) + (fila % 2) * 50;
          const inc = murmullo * Math.sin(f / 9 + k * 1.7 + fila) * 9;
          return <MonjeSentado key={`${fila}${k}${lado}`} x={x} y={y} s={s} inc={inc} tono={k + fila} />;
        }));
      })}
    </g>
  );
};
