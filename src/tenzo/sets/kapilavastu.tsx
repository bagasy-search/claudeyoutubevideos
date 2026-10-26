// SET · KAPILAVASTU, hace 2.500 años (parábola de tz02): el palacio que le escondía el mundo a Siddhartha.
//   sala    (x -1400 … 200): columnas talladas, cortinas, la cuna dorada (1ª escena, Asita) y el trono del rey
//   jardín  (x 400 … 2600): estanque de lotos, músicos, flores siempre frescas (todo PERFECTO, sin nada viejo ni roto)
//   muralla (x 2800 … 3200): la muralla alta con el portón (la salida de Channa)
//   camino  (x 3400 … 7000): casas humildes, polvo; ahí aparecen las 4 visiones (viejo 3900, enfermo 4700, funeral 5500, monje 6300)
// Piso: KAP_PISO. Puntos en KAP_PUNTOS.
// setProps: noche (la huida: luna, antorchas), portonAbierto 0..1, flores 0..1 (pétalos que caen en el jardín).
import React from "react";
import { random } from "remotion";
import { Halo, Haces, Polvo } from "../../anikit/luz";
import { Arbol, Cielo, Colinas, Nube, SetProps, osc } from "../../anikit/sets/comun";

export const KAP_PISO = 900;
export const KAP_PUNTOS = { cuna: -900, trono: -300, sala: -700, jardin: 1300, estanque: 1500, musicos: 900, flores: 2100, muralla: 3000, porton: 3000, camino: 3600, viejo: 3900, enfermo: 4700, funeral: 5500, monje: 6300 };

const Loto: React.FC<{ x: number; y: number; s?: number; f: number; k: number }> = ({ x, y, s = 1, f, k }) => (
  <g transform={`translate(${x},${y + Math.sin(f / 25 + k) * 2}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={46} ry={10} fill="#5a8a4a" />
    {[-36, -18, 0, 18, 36].map((a, q) => <path key={q} d="M0,0 Q-12,-30 0,-48 Q12,-30 0,0 Z" fill={q === 2 ? "#ffd2c8" : "#f4a8a0"} transform={`rotate(${a})`} />)}
  </g>
);

// casa humilde de adobe del camino
const Casita: React.FC<{ x: number; P: number; c: string; k: number }> = ({ x, P, c, k }) => (
  <g>
    <rect x={x} y={P - 260} width={300} height={260} fill={c} />
    <path d={`M${x - 30},${P - 250} L${x + 150},${P - 360} L${x + 330},${P - 250} Z`} fill="#9a6a3a" />
    {Array.from({ length: 7 }).map((_, q) => <line key={q} x1={x - 20 + q * 50} y1={P - 255} x2={x + 150} y2={P - 355} stroke="#7a5028" strokeWidth={3} opacity={0.5} />)}
    <rect x={x + 110} y={P - 150} width={80} height={150} fill="#5a3a20" />
    <rect x={x + 30} y={P - 200} width={50} height={40} fill="#5a3a20" />
    {k % 2 === 0 && <ellipse cx={x + 250} cy={P - 20} rx={40} ry={20} fill="#a8703a" />}
  </g>
);

export const Kapilavastu: React.FC<SetProps & { noche?: boolean; portonAbierto?: number; flores?: number }> = ({ capa, f, pal, noche = false, portonAbierto = 0, flores = 0 }) => {
  const P = KAP_PISO;
  const cielo: [string, string, string] = noche ? ["#1e1830", "#3a2a48", "#6a4250"] : pal.cielo;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={cielo} />
        {noche ? <><circle cx={2400} cy={200} r={60} fill="#fff1d0" /><Halo x={2400} y={200} r={300} color="#ffe9c0" fuerza={0.3} /></> : <><Halo x={1200} y={240} r={700} color="#fff2c8" fuerza={0.6} /><circle cx={1200} cy={240} r={70} fill="#fff6dc" /></>}
        {!noche && [[0, 140, 1.1], [2000, 90, 0.9], [4200, 170, 1.3], [6200, 110, 1]].map(([x, y, s], k) => <Nube key={k} x={x + f * 0.1} y={y} s={s} color="#ffe6b8" o={0.8} />)}
        {/* los Himalayas a lo lejos */}
        <path d={`M-2000,${P - 260} L-1200,${P - 560} L-700,${P - 380} L0,${P - 640} L800,${P - 400} L1500,${P - 600} L2400,${P - 380} L3200,${P - 620} L4200,${P - 400} L5200,${P - 600} L6200,${P - 420} L7400,${P - 580} L8000,${P - 260} Z`} fill={noche ? "#3a3048" : "#e6b07a"} />
        <path d={`M-1200,${P - 560} L-1060,${P - 500} L-1300,${P - 520} Z M0,${P - 640} L140,${P - 570} L-120,${P - 590} Z M1500,${P - 600} L1640,${P - 540} L1380,${P - 555} Z M3200,${P - 620} L3340,${P - 555} L3080,${P - 570} Z M5200,${P - 600} L5340,${P - 540} L5080,${P - 555} Z`} fill={noche ? "#8a84a0" : "#fff2dc"} />
        <Colinas y={P - 170} alto={130} color={noche ? "#2e2638" : "#d39a5e"} seed={8} x0={-2000} w={10000} />
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {!noche && <Haces x={-500} y={-100} ang={22} largo={1300} n={6} ancho={80} color="#fff0c0" fuerza={0.12} f={f} />}
        {flores > 0 && Array.from({ length: 40 }).map((_, i) => {
          const r = (k: string) => random(`pt${k}${i}`);
          const y = -200 + ((r("y") * 1300 + f * (1.2 + r("v"))) % 1300);
          const x = 200 + r("x") * 2600 + Math.sin(f / 30 + i) * 30;
          return <ellipse key={i} cx={x} cy={y} rx={8} ry={5} fill={i % 2 ? "#f4a8a0" : "#ffd2c8"} opacity={flores * 0.85} transform={`rotate(${f * 2 + i * 40} ${x} ${y})`} />;
        })}
        <Polvo x={3400} y={300} w={3700} h={600} n={50} f={f} seed={2} color="#fff0c8" />
      </g>
    );
  }
  const antorcha = (x: number, y: number) => (
    <g key={`a${x}`}>
      <rect x={x - 6} y={y} width={12} height={90} fill="#6a4426" />
      <path d={`M${x},${y - 6} q-16,-26 0,-52 q16,26 0,52 Z`} fill="#ffb03a" transform={`scale(1,${1 + 0.08 * Math.sin(f / 3 + x)})`} style={{ transformOrigin: `${x}px ${y}px` }} />
      <Halo x={x} y={y - 26} r={noche ? 260 : 100} color="#ffb050" fuerza={noche ? 0.6 : 0.25} />
    </g>
  );
  return (
    <g>
      {/* ---------- SALA DEL PALACIO ---------- */}
      <rect x={-1500} y={P - 820} width={1750} height={820} fill={noche ? "#5a3a3a" : "#e8c08a"} />
      <rect x={-1500} y={P - 820} width={1750} height={60} fill={osc(noche ? "#5a3a3a" : "#e8c08a", 0.8)} />
      {Array.from({ length: 16 }).map((_, k) => <path key={k} d={`M${-1480 + k * 110},${P - 760} q55,40 110,0`} stroke="#c8903a" strokeWidth={6} fill="none" />)}
      {[-1400, -1080, -760, -440, -120, 160].map((x) => (
        <g key={x}>
          <rect x={x - 26} y={P - 760} width={52} height={760} fill="#f0d2a0" stroke="#8a5a2a" strokeWidth={3} />
          {[0, 1, 2, 3].map((q) => <rect key={q} x={x - 34} y={P - 720 + q * 190} width={68} height={14} fill="#d9a86e" />)}
          <path d={`M${x - 40},${P - 760} Q${x},${P - 800} ${x + 40},${P - 760} Z`} fill="#e0b040" />
        </g>
      ))}
      {/* cortinas entre columnas */}
      {[-1240, -600, 20].map((x, k) => <path key={x} d={`M${x - 120},${P - 750} Q${x},${P - 620} ${x + 120},${P - 750} L${x + 120},${P - 720} Q${x},${P - 580} ${x - 120},${P - 720} Z`} fill={k % 2 ? "#b8323a" : "#c8603a"} transform={`translate(0,${Math.sin(f / 40 + k) * 3})`} />)}
      {/* alfombra */}
      <rect x={-1400} y={P - 16} width={1500} height={16} fill="#a8323a" />
      {/* cuna dorada */}
      <g transform={`translate(${KAP_PUNTOS.cuna},0)`}>
        <path d={`M-130,${P - 150} Q0,${P - 40} 130,${P - 150} L120,${P - 110} Q0,${P - 10} -120,${P - 110} Z`} fill="#e0b040" stroke="#8a5a2a" strokeWidth={4} />
        <path d={`M-110,${P - 140} Q0,${P - 80} 110,${P - 140} Z`} fill="#fff2dc" />
        <rect x={-120} y={P - 60} width={10} height={60} fill="#8a5a2a" /><rect x={110} y={P - 60} width={10} height={60} fill="#8a5a2a" />
        <path d={`M-130,${P - 150} Q-160,${P - 260} -100,${P - 300} Q0,${P - 330} 100,${P - 300} Q160,${P - 260} 130,${P - 150}`} stroke="#e0b040" strokeWidth={5} fill="none" />
        <Halo x={0} y={P - 130} r={260} color="#fff2c8" fuerza={0.4} />
      </g>
      {/* trono */}
      <g transform={`translate(${KAP_PUNTOS.trono},0)`}>
        <rect x={-110} y={P - 60} width={220} height={60} fill="#c8903a" />
        <path d={`M-100,${P - 60} L-100,${P - 340} Q0,${P - 420} 100,${P - 340} L100,${P - 60} Z`} fill="#e0b040" stroke="#8a5a2a" strokeWidth={4} />
        <rect x={-80} y={P - 130} width={160} height={40} rx={10} fill="#a8323a" />
      </g>
      {antorcha(-1250, P - 520)}{antorcha(80, P - 520)}
      {/* ---------- JARDÍN ---------- */}
      <rect x={300} y={P - 40} width={2400} height={40} fill="#7aa04a" />
      {[[500, 1.1], [2400, 1.15], [1000, 0.8], [2000, 0.85]].map(([x, s], k) => <Arbol key={k} x={x} y={P} s={s * 2.2} copa={k % 2 ? "#8aa040" : "#9ab048"} tronco="#6a4426" />)}
      {/* flores siempre frescas en macetas */}
      {[650, 820, 1950, 2150].map((x, k) => <g key={x}><path d={`M${x - 40},${P} L${x - 50},${P - 70} L${x + 50},${P - 70} L${x + 40},${P} Z`} fill="#c8703a" />{Array.from({ length: 6 }).map((_, q) => <circle key={q} cx={x - 40 + q * 16} cy={P - 95 - (q % 2) * 18} r={14} fill={["#f4a8a0", "#ffd06a", "#fff2dc"][(q + k) % 3]} />)}</g>)}
      {/* estanque de lotos */}
      <ellipse cx={KAP_PUNTOS.estanque} cy={P + 70} rx={520} ry={70} fill="#d9a86e" />
      <ellipse cx={KAP_PUNTOS.estanque} cy={P + 70} rx={490} ry={56} fill={noche ? "#3a4a6a" : "#7ab8c8"} />
      {[-300, -120, 80, 260, -200, 180].map((dx, k) => <Loto key={k} x={KAP_PUNTOS.estanque + dx} y={P + 60 + (k % 3) * 12} s={0.9} f={f} k={k} />)}
      {[-380, 0, 380].map((dx, k) => <path key={k} d={`M${KAP_PUNTOS.estanque + dx - 60},${P + 80 + k * 6} q60,-8 120,0`} stroke="#bfe2ea" strokeWidth={3} fill="none" opacity={0.6 + 0.3 * Math.sin(f / 20 + k)} />)}
      {/* músicos (sitar y tambor, sentados en una alfombra) */}
      <g transform={`translate(${KAP_PUNTOS.musicos},0)`}>
        <rect x={-150} y={P - 14} width={300} height={14} rx={6} fill="#a8323a" />
        {[-80, 80].map((dx, k) => <g key={dx}><path d={`M${dx - 40},${P - 14} Q${dx - 44},${P - 70} ${dx - 24},${P - 100} Q${dx},${P - 112} ${dx + 24},${P - 100} Q${dx + 44},${P - 70} ${dx + 40},${P - 14} Z`} fill={k ? "#e0b040" : "#c8603a"} /><circle cx={dx} cy={P - 130} r={24} fill="#c88a5a" /><path d={`M${dx - 26},${P - 140} Q${dx},${P - 168} ${dx + 26},${P - 140} Z`} fill="#fff2dc" /></g>)}
        <g transform={`translate(-30,${P - 70}) rotate(${-30 + Math.sin(f / 6) * 3})`}><ellipse cx={0} cy={0} rx={24} ry={20} fill="#8a5a2a" /><rect x={-4} y={-120} width={8} height={120} fill="#8a5a2a" /></g>
        <ellipse cx={130} cy={P - 40} rx={24} ry={30} fill="#8a5a2a" /><ellipse cx={130} cy={P - 66} rx={22} ry={6} fill="#e8d4b0" transform={`translate(0,${Math.abs(Math.sin(f / 4)) * -2})`} />
      </g>
      {/* ---------- MURALLA Y PORTÓN ---------- */}
      <g transform={`translate(${KAP_PUNTOS.muralla},0)`}>
        <rect x={-260} y={P - 700} width={520} height={700} fill={noche ? "#6a4a40" : "#d9a86e"} stroke="#8a5a2a" strokeWidth={4} />
        {Array.from({ length: 7 }).map((_, k) => <rect key={k} x={-260 + k * 80} y={P - 750} width={50} height={50} fill={noche ? "#6a4a40" : "#d9a86e"} stroke="#8a5a2a" strokeWidth={4} />)}
        {Array.from({ length: 10 }).map((_, k) => <line key={k} x1={-260} y1={P - 640 + k * 64} x2={260} y2={P - 640 + k * 64} stroke="#b07c4a" strokeWidth={2} opacity={0.5} />)}
        <path d={`M-140,${P} L-140,${P - 320} Q0,${P - 440} 140,${P - 320} L140,${P} Z`} fill={noche ? "#1e1830" : "#f2c48a"} />
        {/* hojas del portón: se abren hacia afuera */}
        {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 140},${P} L${sd * 140},${P - 320} Q${sd * 70},${P - 400} 0,${P - 410} L0,${P} Z`} fill="#8a5a2a" stroke="#5a3418" strokeWidth={4} transform={`translate(${sd * 140},0) scale(${1 - portonAbierto * 0.85},1) translate(${-sd * 140},0)`} />)}
        {antorcha(-200, P - 420)}{antorcha(200, P - 420)}
      </g>
      {/* ---------- CAMINO DE AFUERA ---------- */}
      {[3400, 3820, 4300, 4880, 5350, 5900, 6420, 6900].map((x, k) => <Casita key={x} x={x} P={P} c={pal.fachada[k % 4]} k={k} />)}
      <Arbol x={5200} y={P} s={1.6} copa="#9a8a3a" tronco="#6a4426" />
      <Arbol x={6250} y={P} s={1.4} copa="#8a8a36" tronco="#6a4426" />
      {/* piso: losas en el palacio, tierra afuera */}
      <rect x={-1600} y={P} width={4860} height={900} fill={noche ? "#5a4038" : "#e2b47e"} />
      {Array.from({ length: 30 }).map((_, k) => <line key={k} x1={-1600 + k * 160} y1={P} x2={-1600 + k * 160 - 80} y2={P + 300} stroke="#c8925a" strokeWidth={3} opacity={0.5} />)}
      <rect x={3260} y={P} width={4200} height={900} fill={noche ? "#4a3430" : pal.piso} />
      {Array.from({ length: 24 }).map((_, k) => <ellipse key={k} cx={3300 + k * 170 + random(`kc${k}`) * 60} cy={P + 30 + random(`kd${k}`) * 160} rx={18 + random(`ke${k}`) * 28} ry={5} fill={osc(pal.piso, 0.86)} />)}
      <rect x={-1600} y={P} width={9100} height={8} fill="#a8703a" opacity={0.6} />
    </g>
  );
};
