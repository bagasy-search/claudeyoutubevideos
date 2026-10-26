// SETS CHICOS de lc-b (Ep.3 y Ep.4): insertos de mesa (cuaderno rojo, radio, hornalla, olla, sobres de semillas),
// el techo de Gus con la antena, la fachada de la biblioteca y el bote. Todos en vector plano, sin imágenes.
import React from "react";
import { interpolate, random } from "remotion";
import { Halo } from "../../anikit/luz";
import { F_MANO } from "../../anikit/pantalla";
import { Cielo, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { Edificio, Estrellas, NieveCae } from "../mundo/comun";
import { ROJO_CENSO } from "../elenco";

// ---------- texto escrito a mano en el mundo (revela de izquierda a derecha) ----------
export type Escrito = { t: string; desde: number; x: number; y: number; tam?: number; color?: string; vel?: number; sub?: number[] };
export const EscritoMano: React.FC<{ e: Escrito; f: number }> = ({ e, f }) => {
  const tam = e.tam ?? 64;
  const vel = e.vel ?? 1.4; // caracteres por cuadro
  const n = e.t.length;
  const k = interpolate(f, [e.desde, e.desde + n / vel], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (k <= 0) return null;
  const w = n * tam * 0.5;
  const id = `esc${Math.round(e.x)}${Math.round(e.y)}${e.desde}`;
  return (
    <g>
      <defs><clipPath id={id}><rect x={e.x - 10} y={e.y - tam} width={(w + 20) * k} height={tam * 1.5} /></clipPath></defs>
      <text x={e.x} y={e.y} fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={e.color ?? "#1d1a2a"} clipPath={`url(#${id})`}>{e.t}</text>
      {(e.sub ?? []).map((s, i) => {
        const u = interpolate(f, [s, s + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return u > 0 ? <path key={i} d={`M${e.x - 6},${e.y + 12 + i * 12} q${w * 0.5},${-6 + i * 4} ${w * 1.02 * u},${2}`} stroke={e.color ?? "#1d1a2a"} strokeWidth={6} fill="none" strokeLinecap="round" /> : null;
      })}
    </g>
  );
};

// ---------- MESA: insertos cenitales / de cerca. Encuadre = mira(0,960,540,1) ----------
type PM = SetProps & {
  obj: "cuaderno" | "radio" | "hornalla" | "olla" | "semillas" | "escaner";
  escritos?: Escrito[]; luzRadio?: number; llama?: number; aguja?: number; hervor?: number; tono?: "calido" | "frio"; dial?: number; fecha?: string;
};
export const Mesa: React.FC<PM> = ({ capa, f, obj, escritos = [], luzRadio = 0, llama = 1, aguja = 0.7, hervor = 0, tono = "calido", dial = 0, fecha = "BEST BY 08/2027" }) => {
  const mad = tono === "calido" ? "#6a4a32" : "#4a4250";
  if (capa === "lejos") return <g><rect x={-2000} y={-1000} width={6000} height={3000} fill={osc(mad, 0.55)} /><Halo x={1500} y={200} r={900} color={tono === "calido" ? "#ffb46a" : "#9bb7ff"} fuerza={0.35} /></g>;
  if (capa === "frente") return null;
  return (
    <g>
      {/* tablas de la mesa */}
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-600} y={-300 + i * 190} width={3200} height={186} fill={mezclar(mad, i % 2 ? "#000" : "#fff", 0.06)} />)}
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${-600 + random(`vt${i}`) * 3000},${-280 + (i % 9) * 190 + 60 + random(`vy${i}`) * 80} q120,${-8} 260,0`} stroke={osc(mad, 0.82)} strokeWidth={3} fill="none" opacity={0.6} />)}
      <Halo x={960} y={520} r={760} color={tono === "calido" ? "#ffd9a0" : "#c9d6ff"} fuerza={0.22} />
      {obj === "cuaderno" && (
        <g>
          <rect x={430} y={150} width={1080} height={800} rx={18} fill="#000" opacity={0.25} transform="translate(14,18)" />
          <rect x={420} y={140} width={1080} height={800} rx={18} fill={ROJO_CENSO} />
          <rect x={460} y={170} width={1000} height={740} rx={6} fill="#f4ecd8" />
          <rect x={955} y={170} width={10} height={740} fill="#d8ccb0" />
          {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={470} y={230 + i * 42} width={980} height={2} fill="#9ab8d8" opacity={0.6} />)}
          <rect x={530} y={170} width={3} height={740} fill="#e88a8a" opacity={0.6} />
          {/* alce chico en la esquina (la tapa del cuaderno de June) */}
          <g transform="translate(1390,860) scale(0.5)" opacity={0.55}><path d="M-40,0 L-30,-40 L30,-40 L40,0 M-30,-40 Q-50,-70 -20,-70 L20,-70 Q50,-70 30,-40 M20,-70 L44,-110 M30,-90 L60,-100 M-20,-70 L-44,-110 M-30,-90 L-60,-100" stroke="#7a2a22" strokeWidth={8} fill="none" /></g>
          {escritos.map((e, i) => <EscritoMano key={i} e={e} f={f} />)}
        </g>
      )}
      {(obj === "radio" || obj === "escaner") && (
        <g>
          {obj === "radio" ? (
            <g>
              <rect x={420} y={300} width={1080} height={460} rx={26} fill="#2a2a30" />
              <rect x={460} y={340} width={520} height={200} rx={10} fill={mezclar("#1a2a20", "#7cff9a", 0.18 + 0.5 * luzRadio)} />
              <text x={720} y={465} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={70} fill={mezclar("#2a4a30", "#c9ffd6", luzRadio)}>{(146.52 + dial).toFixed(2)}</text>
              {[0, 1, 2].map((k) => <g key={k} transform={`translate(${1130 + k * 120},${440})`}><circle r={46} fill="#3a3a42" /><circle r={36} fill="#55555e" /><rect x={-4} y={-34} width={8} height={26} fill="#f6ecd2" transform={`rotate(${k === 0 ? dial * 40 - 40 : k * 50 - 30})`} /></g>)}
              <circle cx={1450} cy={340} r={14} fill={luzRadio > 0.5 ? "#ff3a2e" : "#5a2020"} />
              {luzRadio > 0.5 && <Halo x={1450} y={340} r={70} color="#ff3a2e" fuerza={0.6} />}
              {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={480 + i * 40} y={600} width={22} height={120} rx={6} fill="#1a1a1e" />)}
              {/* micrófono de mano con su cable */}
              <path d="M1200,760 C1200,860 1360,820 1400,900" stroke="#141416" strokeWidth={10} fill="none" />
              <rect x={1350} y={860} width={110} height={150} rx={30} fill="#1d1d22" transform="rotate(-14 1400 930)" />
            </g>
          ) : (
            <g transform="rotate(-8 960 560)">
              <rect x={760} y={260} width={300} height={600} rx={40} fill="#22242a" />
              <rect x={900} y={120} width={30} height={160} rx={10} fill="#1a1a1e" />
              <rect x={800} y={320} width={220} height={140} rx={10} fill={mezclar("#1a2a20", "#ffcf6e", 0.15 + 0.6 * luzRadio)} />
              <text x={910} y={410} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={46} fill={mezclar("#3a3020", "#2a1a08", luzRadio)}>162.4</text>
              {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={830 + (i % 3) * 80} cy={540 + Math.floor(i / 3) * 80} r={26} fill="#3a3c44" />)}
              {luzRadio > 0.3 && <Halo x={910} y={390} r={260} color="#ffcf6e" fuerza={0.45 * luzRadio} />}
            </g>
          )}
          {luzRadio > 0.2 && Array.from({ length: 3 }).map((_, i) => { const r = ((f * 4 + i * 60) % 180); return <circle key={i} cx={obj === "radio" ? 720 : 910} cy={obj === "radio" ? 260 : 140} r={40 + r} fill="none" stroke="#ffcf6e" strokeWidth={5} opacity={luzRadio * (1 - r / 180) * 0.7} />; })}
        </g>
      )}
      {obj === "hornalla" && (
        <g>
          <rect x={200} y={300} width={1520} height={900} rx={20} fill="#e8e2d6" />
          <rect x={200} y={300} width={1520} height={40} fill="#cfc8ba" />
          <circle cx={960} cy={640} r={260} fill="#2a2a30" />
          <circle cx={960} cy={640} r={120} fill="#3a3a42" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const h = (40 + 26 * Math.sin(f / 2.1 + i * 1.7)) * llama;
            const x = 960 + Math.cos(a) * 120, y = 640 + Math.sin(a) * 120 * 0.5;
            return <path key={i} d={`M${x - 10},${y} Q${x},${y - h * 1.4} ${x + 10},${y} Z`} fill={i % 2 ? "#4a8aff" : "#7ab8ff"} opacity={0.9 * Math.min(1, llama * 2)} />;
          })}
          {llama > 0.05 && <Halo x={960} y={600} r={300} color="#5a9aff" fuerza={0.45 * llama} />}
          {[0, 1, 2, 3].map((k) => <rect key={k} x={960 - 260 + k * 170} y={640 - 8} width={10} height={16} fill="#1a1a1e" transform={`rotate(${k * 45} 960 640)`} />)}
          {/* perilla y manómetro de gas */}
          <g transform="translate(1520,960)"><circle r={70} fill="#efe6d2" stroke="#55525a" strokeWidth={10} /><path d="M-48,26 A54,54 0 1 1 48,26" stroke="#7cc46a" strokeWidth={9} fill="none" /><path d="M-48,26 A54,54 0 0 1 -54,-8" stroke="#d8382c" strokeWidth={9} fill="none" /><rect x={-3} y={-52} width={6} height={54} rx={3} fill="#2a2020" transform={`rotate(${interpolate(aguja, [0, 1], [-125, 125])})`} /><circle r={7} fill="#2a2020" /><text y={44} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={20} fill="#3a2a20">GAS</text></g>
        </g>
      )}
      {obj === "olla" && (
        <g>
          {/* fogata con leña */}
          {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={760 + i * 70} y={860} width={240} height={36} rx={16} fill="#5a3a22" transform={`rotate(${i * 36 - 72} ${880 + i * 10} 878)`} />)}
          {Array.from({ length: 9 }).map((_, i) => { const h = 120 + 50 * Math.sin(f / 3 + i * 2); return <path key={i} d={`M${800 + i * 40},880 Q${820 + i * 40},${880 - h} ${840 + i * 40},880 Z`} fill={i % 2 ? "#ff7a2a" : "#ffcf6e"} />; })}
          <Halo x={960} y={820} r={420} color="#ff9a3a" fuerza={0.6} />
          <path d="M640,420 L1280,420 L1240,800 Q960,850 680,800 Z" fill="#7a7c84" />
          <ellipse cx={960} cy={420} rx={320} ry={50} fill="#5a5c64" />
          <ellipse cx={960} cy={428} rx={300} ry={42} fill="#7ab8e8" />
          {Array.from({ length: 14 }).map((_, i) => { const u = ((f * 1.4 + i * 17) % 40) / 40; return hervor > 0 ? <circle key={i} cx={700 + random(`ob${i}`) * 520} cy={430 - u * 8} r={(6 + random(`or${i}`) * 10) * (1 - u) * hervor} fill="#e8f6ff" /> : null; })}
          {Array.from({ length: 6 }).map((_, i) => { const u = ((f * 0.8 + i * 30) % 120) / 120; return <ellipse key={i} cx={760 + i * 80 + Math.sin(f / 20 + i) * 20} cy={400 - u * 340} rx={50 + u * 60} ry={30 + u * 30} fill="#f4f6ff" opacity={0.35 * (1 - u) * hervor} />; })}
          <rect x={600} y={460} width={50} height={24} rx={10} fill="#55575e" /><rect x={1270} y={460} width={50} height={24} rx={10} fill="#55575e" />
        </g>
      )}
      {obj === "semillas" && (
        <g>
          {[["CORN", "#e8c040", -14, 560], ["BEANS", "#7cb85a", 6, 960], ["SQUASH", "#e8803a", -4, 1360]].map(([n, c, r, x], i) => (
            <g key={i} transform={`rotate(${r} ${x} 560)`}>
              <rect x={(x as number) - 170} y={280} width={340} height={520} rx={14} fill="#f4ecd8" />
              <rect x={(x as number) - 150} y={300} width={300} height={300} rx={10} fill={c as string} />
              <circle cx={x as number} cy={450} r={90} fill={acl(c as string, 0.35)} />
              <text x={x as number} y={680} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={58} fill="#3a2a20">{n}</text>
              <text x={x as number} y={760} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={800} fontSize={26} fill="#c0352c">{fecha}</text>
            </g>
          ))}
          {escritos.map((e, i) => <EscritoMano key={i} e={e} f={f} />)}
        </g>
      )}
    </g>
  );
};

// ---------- TECHO de Gus en Canal Park, de noche: 2 mástiles, antena de hilo, 3 baterías de auto, la radio ----------
export const TECHO_PISO = 900;
type PT = SetProps & { onda?: number[]; luna?: number; cae?: boolean };
export const Techo: React.FC<PT> = ({ capa, f, onda = [], luna = 0, cae = false }) => {
  const P = TECHO_PISO;
  if (capa === "lejos") {
    const lx = interpolate(luna, [0, 1], [-400, 2400]);
    return (
      <g>
        <Cielo c={["#0c0a18", "#1d2440", "#3b2e42"]} x={-2400} y={-1200} w={7000} h={2600} />
        <Estrellas f={f} o={0.9} x0={-2000} w={6000} y0={-900} h={1300} />
        <circle cx={lx} cy={180 - Math.sin(luna * Math.PI) * 120} r={46} fill="#f6ecd2" />
        <Halo x={lx} y={180 - Math.sin(luna * Math.PI) * 120} r={240} color="#c9d6ff" fuerza={0.35} />
        {Array.from({ length: 30 }).map((_, i) => <g key={i} transform={`translate(${-1500 + i * 160},${760}) scale(0.5)`}><Edificio x={0} y={0} w={240 + random(`tw${i}`) * 120} h={300 + random(`th${i}`) * 500} color="#1a1626" luces={0} seed={`tc${i}`} techoNieve={0.6} /></g>)}
        <rect x={-2000} y={760} width={6000} height={600} fill="#16131f" />
      </g>
    );
  }
  if (capa === "frente") return cae ? <NieveCae f={f} n={110} x0={-600} w={3200} /> : null;
  const ondas = onda.flatMap((t, k) => [0, 1, 2].map((j) => {
    const u = (f - t - j * 10) / 80;
    if (u < 0 || u > 1) return null;
    return <ellipse key={`${k}-${j}`} cx={1000} cy={260} rx={60 + u * 1500} ry={30 + u * 700} fill="none" stroke="#ffcf6e" strokeWidth={8 * (1 - u) + 2} opacity={(1 - u) * 0.8} />;
  }));
  return (
    <g>
      {ondas}
      {/* techo: borde, chimenea, puerta de la escalera */}
      <rect x={-800} y={P - 20} width={3600} height={800} fill="#2a2432" />
      <rect x={-800} y={P - 34} width={3600} height={22} fill="#e9eef8" opacity={0.8} />
      <rect x={120} y={P - 260} width={220} height={240} fill="#3a2e36" />
      <rect x={170} y={P - 220} width={110} height={200} fill="#1a1418" />
      <rect x={1600} y={P - 190} width={90} height={170} fill="#4a3236" />
      {/* mástiles y antena de hilo */}
      {[600, 1400].map((x) => <g key={x}><rect x={x - 6} y={P - 600} width={12} height={580} fill="#55525e" />{[-1, 1].map((d) => <path key={d} d={`M${x},${P - 560} L${x + d * 180},${P - 20}`} stroke="#3a3842" strokeWidth={3} />)}</g>)}
      <path d={`M600,${P - 590} Q1000,${P - 540} 1400,${P - 590}`} stroke="#c9c4b8" strokeWidth={4} fill="none" />
      <path d={`M1000,${P - 558} L1000,${P - 140} Q1000,${P - 90} 1060,${P - 90}`} stroke="#1d1a20" strokeWidth={6} fill="none" />
      {/* mesa con la radio y 3 baterías */}
      <rect x={1040} y={P - 150} width={420} height={18} fill="#5a4232" />
      <rect x={1060} y={P - 132} width={14} height={112} fill="#4a3426" /><rect x={1430} y={P - 132} width={14} height={112} fill="#4a3426" />
      <rect x={1080} y={P - 250} width={260} height={100} rx={10} fill="#2a2a30" />
      <rect x={1100} y={P - 232} width={130} height={50} rx={4} fill="#3a6a4a" />
      <circle cx={1310} cy={P - 230} r={8} fill="#ff3a2e" /><Halo x={1310} y={P - 230} r={50} color="#ff3a2e" fuerza={0.5} />
      <Halo x={1165} y={P - 207} r={140} color="#7cff9a" fuerza={0.25} />
      {[0, 1, 2].map((k) => <g key={k}><rect x={1100 + k * 110} y={P - 90} width={96} height={70} rx={6} fill="#1d1d22" /><rect x={1110 + k * 110} y={P - 100} width={16} height={12} fill="#c0352c" /><rect x={1170 + k * 110} y={P - 100} width={16} height={12} fill="#2a2a2e" /></g>)}
      <path d={`M1118,${P - 100} Q1200,${P - 160} 1300,${P - 150}`} stroke="#c0352c" strokeWidth={4} fill="none" />
    </g>
  );
};

// ---------- BIBLIOTECA PÚBLICA de Duluth (W Superior St): fachada larga de hormigón con ventanas en banda ----------
export const BIB_PISO = 900;
export const Biblioteca: React.FC<SetProps & { nieve?: number }> = ({ capa, f, nieve = 0.3 }) => {
  const P = BIB_PISO;
  if (capa === "lejos") return <g><Cielo c={["#8aa0c8", "#b8c4dc", "#e8d8c8"]} /><Halo x={1500} y={260} r={500} color="#fff2d0" fuerza={0.5} /></g>;
  if (capa === "frente") return null;
  return (
    <g>
      <rect x={-800} y={P - 10} width={4000} height={800} fill="#4a4452" />
      <rect x={-800} y={P - 20} width={4000} height={16} fill="#e9eef8" opacity={nieve} />
      <path d={`M-200,${P - 10} L-200,${P - 520} L2400,${P - 560} L2400,${P - 10} Z`} fill="#b8b0a4" />
      {[0, 1, 2].map((r) => <rect key={r} x={-180} y={P - 470 + r * 140} width={2560} height={70} fill="#3a4a5e" />)}
      {Array.from({ length: 26 }).map((_, i) => <rect key={i} x={-180 + i * 100} y={P - 470} width={8} height={350} fill="#9a9288" />)}
      <rect x={760} y={P - 640} width={680} height={90} fill="#2a2430" />
      <text x={1100} y={P - 580} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={50} letterSpacing={6} fill="#f6ecd2">DULUTH PUBLIC LIBRARY</text>
      <rect x={1000} y={P - 230} width={200} height={220} fill="#2a2430" />
      <rect x={1010} y={P - 220} width={86} height={200} fill="#3a4a5e" /><rect x={1104} y={P - 220} width={86} height={200} fill="#3a4a5e" />
      {[300, 1900].map((x) => <rect key={x} x={x} y={P - 60} width={260} height={50} rx={10} fill="#8a8278" />)}
    </g>
  );
};

// ---------- BOTE de aluminio con dos personas que reman / llenan baldes (x = centro, y = línea de agua) ----------
export const Bote: React.FC<{ x: number; y: number; s?: number; f: number; color?: string; dir?: 1 | -1 }> = ({ x, y, s = 1, f, color = "#9aa0a8", dir = 1 }) => {
  const bam = Math.sin(f / 18) * 4;
  return (
    <g transform={`translate(${x},${y + bam}) rotate(${Math.sin(f / 22) * 1.5}) scale(${s * dir},${s})`}>
      <path d="M-260,-60 L260,-60 L220,20 L-230,20 Z" fill={color} />
      <rect x={-260} y={-70} width={520} height={14} rx={5} fill={osc(color, 0.7)} />
      <path d="M-230,0 L220,0" stroke={osc(color, 0.8)} strokeWidth={4} />
    </g>
  );
};

// ---------- CARTEL verde de ruta / de entrada a la ciudad (en el mundo) ----------
export const CartelVerde: React.FC<{ x: number; y: number; s?: number; l1: string; l2?: string; nieve?: number }> = ({ x, y, s = 1, l1, l2, nieve = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-120} y={-10} width={12} height={240} fill="#6a6a72" /><rect x={108} y={-10} width={12} height={240} fill="#6a6a72" />
    <rect x={-200} y={-190} width={400} height={190} rx={14} fill="#1f6a3e" stroke="#f6ecd2" strokeWidth={6} />
    <text x={0} y={l2 ? -110 : -80} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={58} fill="#f6ecd2" letterSpacing={3}>{l1}</text>
    {l2 && <text x={0} y={-40} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={500} fontSize={38} fill="#f6ecd2" letterSpacing={2}>{l2}</text>}
    {nieve > 0 && <rect x={-204} y={-198} width={408} height={14 * nieve} rx={6} fill="#e9eef8" />}
  </g>
);

// ---------- SÓTANO de Gus (flashback del 1er invierno): ladrillo, caldera a carbón, muebles rotos, catre ----------
export const SOT_PISO = 900;
export const Sotano: React.FC<SetProps & { fuego?: number; farol?: number }> = ({ capa, f, fuego = 1, farol = 0.6 }) => {
  const P = SOT_PISO;
  if (capa === "lejos") return <rect x={-2000} y={-1000} width={6000} height={3000} fill="#1a1216" />;
  if (capa === "frente") return <g>{[-300, 2300].map((x) => <rect key={x} x={x} y={-400} width={160} height={2000} fill="#0e0a0c" />)}</g>;
  const fl = 0.75 + 0.25 * Math.sin(f / 2.3) * Math.sin(f / 3.7);
  return (
    <g>
      <rect x={-600} y={-200} width={3400} height={P + 200} fill="#3a2a2a" />
      {Array.from({ length: 40 }).map((_, r) => <rect key={r} x={-600} y={-200 + r * 28} width={3400} height={3} fill="#2a1e1e" />)}
      {Array.from({ length: 300 }).map((_, i) => { const r = Math.floor(i / 10), c = i % 10; return <rect key={i} x={-600 + c * 340 + (r % 2) * 170} y={-200 + r * 28} width={3} height={28} fill="#2a1e1e" />; })}
      <rect x={-600} y={P} width={3400} height={600} fill="#2a2226" />
      {/* tubos del techo */}
      <rect x={-600} y={60} width={3400} height={30} fill="#55525a" /><rect x={-600} y={110} width={3400} height={18} fill="#4a4048" />
      {/* caldera a carbón */}
      <g>
        <rect x={700} y={P - 520} width={520} height={520} rx={30} fill="#3a3a40" />
        <rect x={740} y={P - 480} width={440} height={60} rx={10} fill="#2a2a30" />
        <rect x={900} y={P - 760} width={120} height={260} fill="#3a3a40" />
        <rect x={820} y={P - 330} width={280} height={200} rx={16} fill="#1a1416" />
        <rect x={835} y={P - 315} width={250} height={170} rx={12} fill={mezclar("#5a1a0a", "#ffb04a", fuego * fl)} />
        {Array.from({ length: 7 }).map((_, i) => { const h = (70 + 40 * Math.sin(f / 2 + i * 2)) * fuego; return <path key={i} d={`M${850 + i * 34},${P - 150} Q${866 + i * 34},${P - 150 - h} ${882 + i * 34},${P - 150} Z`} fill={i % 2 ? "#ff7a2a" : "#ffcf6e"} />; })}
        <Halo x={960} y={P - 230} r={700} color="#ff8a3a" fuerza={0.55 * fuego * fl} />
      </g>
      {/* pila de muebles rotos */}
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={1450 + random(`sm${i}`) * 300} y={P - 30 - random(`sh${i}`) * 140} width={160 + random(`sw${i}`) * 120} height={22} rx={6} fill={i % 2 ? "#6a4a32" : "#5a3a26"} transform={`rotate(${(random(`sr${i}`) - 0.5) * 70} ${1550 + i * 20} ${P - 60})`} />)}
      {/* catre y farol */}
      <rect x={-200} y={P - 120} width={560} height={30} rx={8} fill="#4a5a6a" /><rect x={-180} y={P - 90} width={14} height={90} fill="#2a2a2e" /><rect x={320} y={P - 90} width={14} height={90} fill="#2a2a2e" />
      <rect x={-200} y={P - 150} width={200} height={40} rx={18} fill="#c9c4b8" />
      {farol > 0 && <g><rect x={400} y={P - 210} width={50} height={70} rx={8} fill="#ffcf6e" /><Halo x={425} y={P - 175} r={260} color="#ffcf6e" fuerza={0.5 * farol} /></g>}
      {/* carbón */}
      <path d={`M1240,${P} Q1300,${P - 90} 1380,${P}`} fill="#141216" />
    </g>
  );
};
