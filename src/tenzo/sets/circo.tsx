// SET · CIRCO DE KIOTO (tz05, sesión tz-c): parábola de la elefanta, mundo CÁLIDO. Atardecer ámbar con montañas de Kioto
// y una pagoda de cinco pisos a lo lejos; la carpa roja y dorada con banderines y guirnaldas de faroles de papel; a la
// derecha, DETRÁS de la carpa, el barro con charcos, fardos de heno, el balde del entrenador y la estaca.
// Piso: CIRCO_PISO. x útil: -400 … 3600. `variante`: "noche" (cielo azul cálido, para el flashback de la cría).
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Polvo } from "../../anikit/luz";
import { Cielo, SetProps, osc } from "../../anikit/sets/comun";

export const CIRCO_PISO = 900;
export const CIRCO_PUNTOS = { entrada: 700, carpa: 1100, poste: 1750, atras: 2300, elefanta: 2650, estaca: 2380, balde: 3350, heno: 2950, nino: 2150 };

const ROJO = "#c8402e", ORO = "#e9b243", CREMA = "#f3dfb4";

// farol de papel colgante con halo cálido
export const FarolPapel: React.FC<{ x: number; y: number; f: number; s?: number; color?: string; seed?: number }> = ({ x, y, f, s = 1, color = "#e8573a", seed = 0 }) => {
  const b = Math.sin(f / 30 + seed) * 2;
  return (
    <g transform={`translate(${x},${y}) rotate(${b}) scale(${s})`}>
      <Halo x={0} y={20} r={70} color="#ffc56b" fuerza={0.5} />
      <rect x={-4} y={-18} width={8} height={12} fill="#3a2414" />
      <ellipse cx={0} cy={20} rx={24} ry={30} fill={color} />
      <ellipse cx={0} cy={20} rx={14} ry={22} fill="#ffcf7a" opacity={0.55} />
      {[-14, 0, 14].map((k) => <path key={k} d={`M${-23},${20 + k} Q0,${24 + k} 23,${20 + k}`} stroke={osc(color, 0.7)} strokeWidth={1.6} fill="none" />)}
      <rect x={-8} y={48} width={16} height={6} fill="#3a2414" />
    </g>
  );
};

// guirnalda de faroles entre dos puntos
const Guirnalda: React.FC<{ a: [number, number]; b: [number, number]; n: number; f: number; seed: number; s?: number }> = ({ a, b, n, f, seed, s = 1 }) => {
  const caida = 70;
  const pt = (u: number) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + Math.sin(Math.PI * u) * caida];
  const m = pt(0.5);
  return (
    <g>
      <path d={`M${a[0]},${a[1]} Q${m[0]},${m[1] + caida} ${b[0]},${b[1]}`} stroke="#3a2414" strokeWidth={3} fill="none" />
      {Array.from({ length: n }).map((_, i) => {
        const [px, py] = pt((i + 1) / (n + 1));
        return <FarolPapel key={i} x={px} y={py + 8} f={f} s={s} seed={seed + i} color={i % 3 === 1 ? "#e9b243" : "#e8573a"} />;
      })}
    </g>
  );
};

const Banderin: React.FC<{ x: number; y: number; f: number; color: string; seed: number }> = ({ x, y, f, color, seed }) => {
  const o = Math.sin(f / 8 + seed) * 10;
  return (
    <g>
      <rect x={x - 2} y={y - 90} width={4} height={90} fill="#5a3a20" />
      <path d={`M${x + 2},${y - 90} Q${x + 30},${y - 82 + o * 0.3} ${x + 62},${y - 74 + o} L${x + 2},${y - 58} Z`} fill={color} />
    </g>
  );
};

export const Circo: React.FC<SetProps> = ({ capa, f, variante }) => {
  const P = CIRCO_PISO;
  const noche = variante === "noche";
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={noche ? ["#1c2440", "#3a3d5e", "#6b5a6a"] : ["#d9784a", "#f2a65a", "#ffd892"]} />
        {!noche && <><Halo x={2200} y={560} r={600} color="#fff0c0" fuerza={0.7} /><circle cx={2200} cy={560} r={70} fill="#fff4d2" /></>}
        {noche && Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={-400 + random(`es${i}`) * 4400} cy={-300 + random(`ey${i}`) * 600} r={1.5 + random(`er${i}`) * 2} fill="#fff6dc" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 40 + i))} />)}
        {/* montañas de Kioto en tres planos */}
        <path d="M-1200,640 Q-700,380 -200,560 Q300,330 800,520 Q1300,300 1900,500 Q2500,320 3100,520 Q3700,360 4400,560 L4400,900 L-1200,900 Z" fill={noche ? "#3a3550" : "#c7745a"} opacity={0.55} />
        <path d="M-1200,720 Q-500,520 200,660 Q900,470 1600,640 Q2300,480 3000,650 Q3700,520 4400,680 L4400,900 L-1200,900 Z" fill={noche ? "#2c2a40" : "#a4584a"} opacity={0.75} />
        {/* pagoda de cinco pisos */}
        <g transform="translate(300,700)">
          {[0, 1, 2, 3, 4].map((k) => {
            const w = 110 - k * 14, y = -k * 46;
            return <g key={k}><rect x={-w * 0.32} y={y - 30} width={w * 0.64} height={30} fill={noche ? "#2a2436" : "#7a3a30"} /><path d={`M${-w},${y - 26} Q0,${y - 48} ${w},${y - 26} L${w * 0.7},${y - 34} Q0,${y - 54} ${-w * 0.7},${y - 34} Z`} fill={noche ? "#1e1a2a" : "#5a2a24"} /></g>;
          })}
          <rect x={-3} y={-300} width={6} height={70} fill={noche ? "#1e1a2a" : "#5a2a24"} />
        </g>
        <rect x={-1200} y={780} width={5600} height={200} fill={noche ? "#25223a" : "#8a4a3c"} />
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        <Guirnalda a={[-500, 40]} b={[900, 120]} n={6} f={f} seed={40} s={1.6} />
        <Polvo x={-200} y={200} w={3600} h={700} n={50} f={f} seed={9} color="#ffe3a8" />
      </g>
    );
  }
  // ---- capa media ----
  const bandas = 14;
  return (
    <g>
      {/* suelo: tierra apisonada delante de la carpa, barro con charcos detrás */}
      <rect x={-1200} y={P} width={5600} height={900} fill={noche ? "#4a3a36" : "#a8714a"} />
      <defs><linearGradient id="crbarro" x1="0" x2="1"><stop offset="0" stopColor={noche ? "#3a2c28" : "#7a5236"} stopOpacity={0} /><stop offset="0.22" stopColor={noche ? "#3a2c28" : "#7a5236"} /></linearGradient></defs>
      <rect x={1700} y={P} width={2700} height={900} fill="url(#crbarro)" />
      {Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={1950 + random(`ch${i}`) * 1900} cy={P + 30 + random(`cy${i}`) * 140} rx={60 + random(`cr${i}`) * 90} ry={10 + random(`cq${i}`) * 10} fill={noche ? "#5a5a78" : "#c99a6a"} opacity={0.5} />)}
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${1950 + random(`hu${i}`) * 1900},${P + 20 + random(`hv${i}`) * 160} q14,-6 28,0`} stroke={noche ? "#2a201c" : "#5e3e26"} strokeWidth={4} fill="none" strokeLinecap="round" />)}
      {/* CARPA roja y dorada */}
      <g>
        <path d={`M250,${P} L250,${P - 330} Q1100,${P - 990} 1950,${P - 330} L1950,${P} Z`} fill={ROJO} />
        {Array.from({ length: bandas }).map((_, i) => {
          const x0 = 250 + (i * 1700) / bandas, x1 = x0 + 1700 / bandas / 2;
          return i % 2 === 0 ? <path key={i} d={`M${x0},${P} L${x0},${P - 330 - Math.sin((Math.PI * (x0 - 250)) / 1700) * 330} L${x1},${P - 330 - Math.sin((Math.PI * (x1 - 250)) / 1700) * 330} L${x1},${P} Z`} fill={CREMA} opacity={0.92} /> : null;
        })}
        <path d={`M250,${P - 330} Q1100,${P - 990} 1950,${P - 330}`} stroke={ORO} strokeWidth={18} fill="none" />
        {/* festón dorado */}
        {Array.from({ length: 17 }).map((_, i) => <path key={i} d={`M${250 + i * 100},${P - 330 - Math.sin((Math.PI * i * 100) / 1700) * 330} q50,40 100,0`} fill={ORO} />)}
        {/* techo cónico y mástil */}
        <path d={`M760,${P - 600} L1100,${P - 960} L1440,${P - 600} Z`} fill={ROJO} />
        <path d={`M930,${P - 600} L1100,${P - 960} L1020,${P - 600} Z M1180,${P - 600} L1100,${P - 960} L1270,${P - 600} Z`} fill={CREMA} opacity={0.9} />
        <rect x={1094} y={P - 1060} width={12} height={110} fill="#5a3a20" />
        <path d={`M1106,${P - 1060} Q1150,${P - 1045 + Math.sin(f / 9) * 6} 1200,${P - 1030 + Math.sin(f / 9) * 10} L1106,${P - 1015} Z`} fill={ORO} />
        {/* entrada con cortinas abiertas y luz cálida adentro */}
        <path d={`M560,${P} L560,${P - 300} Q700,${P - 380} 840,${P - 300} L840,${P} Z`} fill="#ffcf7a" />
        <Halo x={700} y={P - 140} r={260} color="#ffd27a" fuerza={0.6} />
        <path d={`M560,${P} L560,${P - 300} Q610,${P - 330} 660,${P - 310} Q620,${P - 150} 600,${P} Z`} fill={osc(ROJO, 0.8)} />
        <path d={`M840,${P} L840,${P - 300} Q790,${P - 330} 740,${P - 310} Q780,${P - 150} 800,${P} Z`} fill={osc(ROJO, 0.8)} />
        {/* poste del costado (la elefanta es más alta que esto) */}
        <rect x={1740} y={P - 520} width={22} height={520} fill="#6a4426" />
        <path d={`M1751,${P - 520} L2050,${P}`} stroke="#3a2414" strokeWidth={3} />
        {[250, 600, 1100, 1600, 1950].map((x, i) => <Banderin key={i} x={x} y={P - 330 - Math.sin((Math.PI * (x - 250)) / 1700) * 330} f={f} color={i % 2 ? ORO : "#e8573a"} seed={i} />)}
      </g>
      <Guirnalda a={[-300, P - 420]} b={[560, P - 300]} n={5} f={f} seed={10} />
      <Guirnalda a={[840, P - 300]} b={[1740, P - 460]} n={6} f={f} seed={20} />
      {/* detrás de la carpa: carro de madera, fardos de heno, balde */}
      <g>
        <rect x={3650} y={P - 260} width={360} height={200} rx={8} fill="#8a5a34" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={3660 + k * 90} y={P - 250} width={6} height={180} fill="#6a4426" />)}
        <circle cx={3720} cy={P - 50} r={50} fill="none" stroke="#5a3a20" strokeWidth={10} /><circle cx={3940} cy={P - 50} r={50} fill="none" stroke="#5a3a20" strokeWidth={10} />
        {[0, 1, 2].map((k) => <g key={k} transform={`rotate(${k * 60} 3720 ${P - 50})`}><rect x={3716} y={P - 98} width={8} height={96} fill="#5a3a20" /></g>)}
        {[0, 1, 2].map((k) => <g key={k} transform={`rotate(${k * 60} 3940 ${P - 50})`}><rect x={3936} y={P - 98} width={8} height={96} fill="#5a3a20" /></g>)}
      </g>
      {[[3050, 0], [3150, 0], [3100, -70]].map(([x, dy], i) => (
        <g key={i}>
          <rect x={x - 60} y={P - 72 + dy} width={120} height={72} rx={10} fill="#d8a94a" />
          {Array.from({ length: 6 }).map((_, k) => <path key={k} d={`M${x - 55 + k * 20},${P - 68 + dy} l6,64`} stroke="#b48634" strokeWidth={3} />)}
          <rect x={x - 60} y={P - 44 + dy} width={120} height={6} fill="#8a5a28" />
        </g>
      ))}
      {/* heno suelto en el barro (la elefanta come de acá) */}
      {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M${2930 + random(`hn${i}`) * 160},${P + 4} l${(random(`hm${i}`) - 0.5) * 60},${-14 - random(`hk${i}`) * 10}`} stroke="#e2b858" strokeWidth={3} strokeLinecap="round" />)}
      <g transform={`translate(${CIRCO_PUNTOS.balde},${P})`}>
        <path d="M-34,0 L-40,-70 L40,-70 L34,0 Z" fill="#6a7078" />
        <rect x={-42} y={-74} width={84} height={8} rx={3} fill="#8a9098" />
        <rect x={-40} y={-40} width={80} height={5} fill="#555a62" />
      </g>
      <Charco x={700} y={P + 40} rx={420} color="#ffd27a" fuerza={0.4} />
    </g>
  );
};
