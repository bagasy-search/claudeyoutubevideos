// Piezas y sets de inserto del Ep.4 (lc04): primer plano genérico, balanza, sobres de semillas, bus escolar,
// escarabajos y hojas, barriles, bidón, canasta, reloj de latas, plantas de cerca, aire frío, grietas, puesto de ruta.
// Todo vector plano en código (cero imágenes generadas).
import React from "react";
import { interpolate, random } from "remotion";
import { Halo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { Lata } from "../../anikit/props";
import { SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { Papa } from "./granja";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const TXT: React.FC<{ x: number; y: number; t: string; tam: number; color?: string; ancla?: "start" | "middle" | "end"; peso?: number }> = ({ x, y, t, tam, color = "#2a1c18", ancla = "middle", peso = 600 }) => (
  <text x={x} y={y} textAnchor={ancla} fontFamily={F_HUD} fontWeight={peso} fontSize={tam} fill={color}>{t}</text>
);

// ---------- PRIMER PLANO genérico: fondo lleno (madera de mesa, tierra cenital, cielo, oscuro, verde de hoja) ----------
export const PRIMER_PISO = 900;
type PPr = SetProps & { fondo?: "madera" | "tierra" | "cielo" | "oscuro" | "verde" | "pared"; luz?: string };
export const Primer: React.FC<PPr> = ({ capa, f, fondo = "madera", luz = "#ffcf8a" }) => {
  const base = { madera: "#8a5e3c", tierra: "#5a3a28", cielo: "#6f8fb8", oscuro: "#17121c", verde: "#3f7a34", pared: "#d9cbb0" }[fondo];
  if (capa === "lejos") return <g><rect x={-3000} y={-2000} width={8000} height={5000} fill={osc(base, 0.7)} /><Halo x={960} y={300} r={1400} color={luz} fuerza={0.25} /></g>;
  if (capa === "frente") return null;
  return (
    <g>
      <rect x={-2000} y={-1500} width={6000} height={4000} fill={base} />
      {fondo === "madera" && Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-2000} y={-1500 + i * 100} width={6000} height={4} fill={osc(base, 0.82)} opacity={0.6} />)}
      {fondo === "madera" && Array.from({ length: 30 }).map((_, i) => <ellipse key={`n${i}`} cx={-1500 + random(`mn${i}`) * 5000} cy={-1200 + random(`my${i}`) * 3400} rx={30 + random(`mr${i}`) * 50} ry={6} fill={osc(base, 0.75)} opacity={0.5} />)}
      {fondo === "tierra" && Array.from({ length: 260 }).map((_, i) => <ellipse key={i} cx={-1500 + random(`tx${i}`) * 5000} cy={-1200 + random(`ty${i}`) * 3400} rx={4 + random(`tr${i}`) * 10} ry={3 + random(`tq${i}`) * 6} fill={random(`tc${i}`) > 0.5 ? osc(base, 0.75) : acl(base, 0.15)} />)}
      {fondo === "verde" && Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${-1500 + i * 180},2500 Q${-1400 + i * 180},400 ${-1300 + i * 180 + Math.sin(f / 40 + i) * 30},-1500`} stroke={osc(base, 0.85)} strokeWidth={18} fill="none" opacity={0.5} />)}
      {fondo === "pared" && Array.from({ length: 34 }).map((_, i) => <rect key={i} x={-2000} y={-1500 + i * 120} width={6000} height={6} fill={osc(base, 0.85)} />)}
      {fondo === "cielo" && <rect x={-2000} y={600} width={6000} height={3000} fill="#5f8a44" />}
    </g>
  );
};

// ---------- balanza de cocina ----------
export const Balanza: React.FC<{ x: number; y: number; s?: number; aguja?: number }> = ({ x, y, s = 1, aguja = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={170} ry={18} fill="#000" opacity={0.25} />
    <path d="M-150,0 L-120,-170 L120,-170 L150,0 Z" fill="#d84a3a" />
    <circle cx={0} cy={-90} r={62} fill="#f6efe0" stroke="#7a2a22" strokeWidth={6} />
    {Array.from({ length: 9 }).map((_, i) => { const a = (-120 + i * 30) * Math.PI / 180; return <line key={i} x1={Math.sin(a) * 48} y1={-90 - Math.cos(a) * 48} x2={Math.sin(a) * 56} y2={-90 - Math.cos(a) * 56} stroke="#2a1c18" strokeWidth={4} />; })}
    <line x1={0} y1={-90} x2={Math.sin((-120 + aguja * 120) * Math.PI / 180) * 46} y2={-90 - Math.cos((-120 + aguja * 120) * Math.PI / 180) * 46} stroke="#c0352c" strokeWidth={6} strokeLinecap="round" />
    <rect x={-20} y={-196} width={40} height={30} fill="#9aa0a8" />
    <ellipse cx={0} cy={-200} rx={170} ry={24} fill="#c9cfd6" />
    <ellipse cx={0} cy={-206} rx={150} ry={16} fill="#e6ebf0" />
  </g>
);

// ---------- sobre de semillas ----------
export const Sobre: React.FC<{ x: number; y: number; s?: number; rot?: number; t: string; color?: string; fecha?: string; gris?: number; dibujo?: "papa" | "poroto" | "zapallo" | "zanahoria" | "repollo" | "choclo" | "cebolla" }> = ({ x, y, s = 1, rot = 0, t, color = "#e0a040", fecha, gris = 0, dibujo }) => {
  const c = mezclar(color, "#7a7a80", gris);
  const fig = { papa: "#c9935a", poroto: "#5aa048", zapallo: "#e8a040", zanahoria: "#f08a3c", repollo: "#8acb6a", choclo: "#f2d04a", cebolla: "#e9d6a6" };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-92} y={-128} width={184} height={256} rx={6} fill="#000" opacity={0.2} transform="translate(8,10)" />
      <rect x={-92} y={-128} width={184} height={256} rx={6} fill="#f6efe0" />
      <rect x={-80} y={-116} width={160} height={150} rx={4} fill={c} />
      {dibujo && <g transform="translate(0,-40)">
        {dibujo === "zanahoria" ? <path d="M-14,-40 L14,-40 L0,50 Z" fill={mezclar(fig[dibujo], "#888", gris)} /> :
          dibujo === "choclo" ? <rect x={-20} y={-46} width={40} height={92} rx={20} fill={mezclar(fig[dibujo], "#888", gris)} /> :
            <ellipse rx={dibujo === "poroto" ? 22 : 44} ry={dibujo === "poroto" ? 40 : 36} fill={mezclar(fig[dibujo], "#888", gris)} />}
        <path d="M-6,-44 q6,-20 18,-26" stroke={mezclar("#4f9a3c", "#666", gris)} strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>}
      <TXT x={0} y={74} t={t} tam={t.length > 7 ? 26 : 32} color={mezclar("#2a1c18", "#6a6a70", gris)} />
      {fecha && <TXT x={0} y={110} t={fecha} tam={20} color="#c0352c" />}
    </g>
  );
};

// ---------- bus escolar amarillo (x = centro, y = piso) con bolsas en las ventanillas ----------
export const BusEscolar: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1; bolsas?: number; rueda?: number; chofer?: React.ReactNode }> = ({ x, y, s = 1, dir = 1, bolsas = 1, rueda = 0, chofer }) => (
  <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
    <ellipse cx={0} cy={4} rx={430} ry={16} fill="#000" opacity={0.3} />
    <path d="M-420,-40 L-420,-300 Q-420,-320 -400,-320 L300,-320 Q330,-320 340,-290 L360,-200 L420,-190 Q440,-188 440,-160 L440,-40 Z" fill="#f2b81e" />
    <rect x={-420} y={-130} width={860} height={14} fill="#1c1a1c" />
    <rect x={-420} y={-90} width={860} height={10} fill="#1c1a1c" />
    <TXT x={-40} y={-150} t="SCHOOL BUS" tam={40} color="#1c1a1c" peso={700} />
    {Array.from({ length: 7 }).map((_, i) => <g key={i}>
      <rect x={-395 + i * 92} y={-292} width={76} height={80} rx={6} fill="#2a3440" />
      {bolsas > 0 && i < Math.ceil(7 * bolsas) && <g><path d={`M${-388 + i * 92},-212 L${-386 + i * 92},-262 Q${-357 + i * 92},-284 ${-328 + i * 92},-262 L${-326 + i * 92},-212 Z`} fill={["#c9a26a", "#b08a5a", "#d6b67a"][i % 3]} /><TXT x={-357 + i * 92} y={-232} t="SEED" tam={14} color="#5a3a22" /></g>}
    </g>)}
    <rect x={262} y={-292} width={70} height={84} rx={6} fill="#2a3440" />
    {chofer && <g transform="translate(296,-210)">{chofer}</g>}
    <rect x={420} y={-110} width={26} height={18} fill="#fff6c0" />
    {[-260, 290].map((wx, k) => <g key={k} transform={`translate(${wx},-40)`}><circle r={54} fill="#1c1a1c" /><circle r={24} fill="#9aa0a8" />{[0, 1, 2, 3].map((j) => <rect key={j} x={-3} y={-50} width={6} height={12} fill="#2c2a2a" transform={`rotate(${rueda + j * 90})`} />)}</g>)}
    <rect x={-440} y={-130} width={30} height={60} fill="#c0352c" />
  </g>
);

// ---------- escarabajo de la papa (rayado naranja y negro) ----------
export const Escarabajo: React.FC<{ x: number; y: number; s?: number; rot?: number; f?: number; seed?: number }> = ({ x, y, s = 1, rot = 0, f = 0, seed = 0 }) => {
  const p = Math.sin(f / 2 + seed) * 8;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {[-1, 1].map((k) => [-14, 0, 14].map((py, j) => <line key={`${k}${j}`} x1={0} y1={py} x2={k * 34} y2={py + (j - 1) * 8 + (j % 2 ? p : -p) * 0.5} stroke="#1c1416" strokeWidth={5} strokeLinecap="round" />))}
      <ellipse rx={26} ry={34} fill="#f0b23a" />
      {[-15, -5, 5, 15].map((sx) => <path key={sx} d={`M${sx},-28 Q${sx * 1.1},0 ${sx},30`} stroke="#1c1416" strokeWidth={5} fill="none" />)}
      <ellipse cy={-36} rx={16} ry={11} fill="#e08a2a" />
      <circle cx={-6} cy={-38} r={3} fill="#1c1416" /><circle cx={6} cy={-38} r={3} fill="#1c1416" />
    </g>
  );
};

// ---------- hoja de papa en macro; mordida 0..1 = cuánto encaje le comieron ----------
export const HojaMacro: React.FC<{ x: number; y: number; s?: number; mordida?: number; helada?: number; seed?: number }> = ({ x, y, s = 1, mordida = 0, helada = 0, seed = 0 }) => {
  const id = `hm${seed}`;
  const verde = mezclar("#5aa848", "#1d2018", helada), claro = mezclar("#8ad06a", "#2a2a22", helada);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs><mask id={id}><rect x={-600} y={-500} width={1200} height={1000} fill="#fff" />
        {Array.from({ length: 40 }).map((_, i) => { const u = random(`${id}u${i}`); return u < mordida ? <circle key={i} cx={-380 + random(`${id}x${i}`) * 760} cy={-240 + random(`${id}y${i}`) * 480} r={18 + random(`${id}r${i}`) * 46 * mordida} fill="#000" /> : null; })}
      </mask></defs>
      <g mask={`url(#${id})`}>
        <path d="M-470,0 Q-300,-300 0,-280 Q320,-260 470,0 Q320,260 0,280 Q-300,300 -470,0 Z" fill={verde} />
        <path d="M-470,0 Q-300,-200 0,-180 Q300,-160 470,0" fill={claro} opacity={0.5} />
        <path d="M-470,0 L470,0" stroke={osc(verde, 0.7)} strokeWidth={14} />
        {[-300, -150, 0, 150, 300].map((vx) => <path key={vx} d={`M${vx},0 L${vx + 90},-170 M${vx},0 L${vx + 90},170`} stroke={osc(verde, 0.75)} strokeWidth={7} />)}
      </g>
    </g>
  );
};

// ---------- barril azul, bidón rojo, canasta, balde, pala, brocha, horquilla con papas ----------
export const Barril: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-60} y={-170} width={120} height={170} rx={16} fill="#2f6ab0" />
    {[-130, -50].map((ry) => <rect key={ry} x={-62} y={ry} width={124} height={10} fill="#24548c" />)}
    <ellipse cx={0} cy={-170} rx={60} ry={14} fill="#3a7ac4" />
  </g>
);
export const Bidon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={80} ry={10} fill="#000" opacity={0.3} />
    <path d="M-70,0 L-70,-150 L-40,-180 L60,-180 L70,-170 L70,0 Z" fill="#d8382c" />
    <path d="M-40,-150 L50,-60 M50,-150 L-40,-60" stroke="#a82820" strokeWidth={8} />
    <rect x={-20} y={-206} width={40} height={30} fill="#f2c14a" />
    <path d="M30,-180 L30,-210 L60,-210" stroke="#1c1a1c" strokeWidth={10} fill="none" />
    <TXT x={0} y={-24} t="DIESEL" tam={24} color="#f6ecd2" />
  </g>
);
export const Canasta: React.FC<{ x?: number; y?: number; s?: number; papas?: number }> = ({ x = 0, y = 0, s = 1, papas = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {papas > 0 && Array.from({ length: Math.round(7 * papas) }).map((_, i) => <Papa key={i} x={-44 + (i % 4) * 30} y={-62 - Math.floor(i / 4) * 16} s={0.6} rot={i * 37} />)}
    <path d="M-70,-60 L70,-60 L56,0 L-56,0 Z" fill="#b08a5a" />
    {[-40, -20].map((by) => <rect key={by} x={-66} y={by} width={130} height={5} fill="#8a6a42" />)}
    <path d="M-60,-60 Q0,-130 60,-60" stroke="#8a6a42" strokeWidth={8} fill="none" />
  </g>
);
export const Balde: React.FC<{ agua?: boolean }> = ({ agua = true }) => (
  <g transform="translate(0,40)">
    <path d="M-30,-50 L30,-50 L24,0 L-24,0 Z" fill="#9aa0a8" />
    {agua && <ellipse cx={0} cy={-50} rx={30} ry={7} fill="#cfe6f0" />}
    <path d="M-30,-50 Q0,-90 30,-50" stroke="#5a5a62" strokeWidth={4} fill="none" />
  </g>
);
export const Pala: React.FC<{ tierra?: boolean }> = ({ tierra }) => (
  <g>
    <rect x={-5} y={-200} width={10} height={210} rx={4} fill="#8a6a42" />
    <rect x={-22} y={-214} width={44} height={16} rx={6} fill="#5a3a22" />
    <path d="M-30,10 L30,10 L26,70 Q0,96 -26,70 Z" fill="#9aa0a8" />
    {tierra && <ellipse cx={0} cy={24} rx={30} ry={14} fill="#5a3a28" />}
  </g>
);
export const Brocha: React.FC<{ color?: string }> = ({ color = "#2a1c18" }) => (
  <g><rect x={-4} y={-70} width={8} height={70} fill="#c9a36a" /><rect x={-12} y={-96} width={24} height={30} rx={3} fill="#9aa0a8" /><rect x={-12} y={-112} width={24} height={18} fill={color} /></g>
);
export const HorquillaPapas: React.FC<{ papas?: number; s?: number }> = ({ papas = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-4} y={-30} width={8} height={190} rx={3} fill="#7a5532" />
    <path d="M-22,-30 L-22,-90 M-7,-30 L-7,-96 M7,-30 L7,-96 M22,-30 L22,-90 M-24,-30 L24,-30" stroke="#9aa0a8" strokeWidth={6} strokeLinecap="round" fill="none" />
    {papas > 0 && <g transform="translate(0,-110)">
      <path d="M0,0 Q-40,-80 -10,-150 M0,0 Q30,-90 60,-140 M0,0 Q-70,-50 -90,-110" stroke="#4f9a3c" strokeWidth={10} fill="none" strokeLinecap="round" />
      {Array.from({ length: 8 }).map((_, i) => i < papas ? <g key={i}><line x1={0} y1={0} x2={-70 + i * 20} y2={40 + (i % 3) * 22} stroke="#c9b48a" strokeWidth={3} /><Papa x={-70 + i * 20} y={50 + (i % 3) * 22} s={0.7} rot={i * 40} /></g> : null)}
    </g>}
  </g>
);

// ---------- llamita «2,000/day» sobre la cabeza ----------
export const Llamita: React.FC<{ x: number; y: number; f: number; o?: number }> = ({ x, y, f, o = 1 }) => {
  if (o <= 0) return null;
  const t = Math.sin(f / 4 + x) * 4;
  return (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <path d={`M0,0 Q-26,-30 -6,-64 Q${-2 + t},-44 10,-80 Q30,-40 22,-16 Q16,4 0,0 Z`} fill="#ff8a2a" />
      <path d={`M2,-6 Q-10,-24 2,-44 Q${8 + t * 0.5},-30 14,-40 Q20,-18 2,-6 Z`} fill="#ffd36a" />
      <TXT x={8} y={34} t="2,000/day" tam={26} color="#ffcf6e" />
    </g>
  );
};

// ---------- reloj de arena hecho de latas: k 0..1 = cuántas cayeron ----------
export const RelojLatas: React.FC<{ x: number; y: number; s?: number; k: number; f: number }> = ({ x, y, s = 1, k, f }) => {
  const N = 21, cayeron = Math.floor(N * k);
  const arriba: [number, number][] = [], abajo: [number, number][] = [];
  for (let r = 0, n = 0; r < 6 && n < N; r++) for (let c = 0; c <= 5 - r && n < N; c++, n++) arriba.push([(c - (5 - r) / 2) * 56, -150 - (5 - r) * 50 + r * 0]);
  for (let r = 0, n = 0; r < 6 && n < N; r++) for (let c = 0; c < 6 - r && n < N; c++, n++) abajo.push([(c - (5 - r) / 2) * 56, 260 - r * 50]);
  const fase = (f % 12) / 12;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-190,-440 L190,-440 L190,-420 L20,-10 L20,10 L190,420 L190,440 L-190,440 L-190,420 L-20,10 L-20,-10 L-190,-420 Z" fill="#cfe6f0" opacity={0.25} stroke="#e9f4fa" strokeWidth={6} />
      <rect x={-220} y={-470} width={440} height={30} rx={8} fill="#7a5532" /><rect x={-220} y={440} width={440} height={30} rx={8} fill="#7a5532" />
      {arriba.slice(0, N - cayeron).map(([ax, ay], i) => <Lata key={`a${i}`} x={ax} y={ay - 30 + (i % 6) * 0} color={["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a"][i % 4]} s={1.35} />)}
      {abajo.slice(0, cayeron).map(([ax, ay], i) => <Lata key={`b${i}`} x={ax} y={ay} color={["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a"][i % 4]} s={1.35} />)}
      {k > 0 && k < 1 && <Lata x={0} y={-20 + fase * 200} color="#f1c24a" s={1.1} rot={fase * 180} />}
    </g>
  );
};

// ---------- plantas de cerca (porotos, tomates, zapallo) con helada 0..1 (se ennegrecen y caen) ----------
export const PlantaCerca: React.FC<{ tipo: "poroto" | "tomate" | "zapallo"; x: number; y: number; s?: number; helada?: number; f: number }> = ({ tipo, x, y, s = 1, helada = 0, f }) => {
  const v = mezclar("#4f9a3c", "#16181c", helada), c = mezclar("#7cc45a", "#24242a", helada);
  const caida = helada * 70;
  const sw = Math.sin(f / 30) * 4 * (1 - helada);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={10} rx={260} ry={30} fill="#3a2418" />
      {tipo === "poroto" && <>
        <rect x={-6} y={-520} width={12} height={530} fill="#8a6a42" />
        {Array.from({ length: 9 }).map((_, i) => { const yy = -60 - i * 52; const lado = i % 2 ? 1 : -1; return <g key={i} transform={`rotate(${lado * caida * 0.8} 0 ${yy})`}><ellipse cx={lado * 70 + sw} cy={yy} rx={58} ry={34} fill={i % 3 ? v : c} />{i % 3 === 1 && <path d={`M${lado * 40},${yy + 20} q${lado * 10},60 ${lado * 4},110`} stroke={mezclar("#6ab04a", "#222", helada)} strokeWidth={12} fill="none" strokeLinecap="round" />}</g>; })}
      </>}
      {tipo === "tomate" && <>
        <path d={`M0,0 Q${-20 + caida},-200 ${caida * 2},-${380 - caida * 3}`} stroke={v} strokeWidth={16} fill="none" />
        {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} cx={(i % 2 ? 70 : -70) + caida * (i / 4)} cy={-80 - i * 40 + caida * (i / 3)} rx={50} ry={28} fill={i % 2 ? v : c} transform={`rotate(${(i % 2 ? 30 : -30) + helada * 60})`} />)}
        {[[-60, -120], [50, -190], [-30, -260], [70, -90]].map(([tx, ty], i) => <ellipse key={i} cx={tx + caida} cy={ty + caida * 1.6} rx={32 * (1 + helada * 0.2)} ry={30 * (1 - helada * 0.45)} fill={mezclar("#e0402a", "#5a2a28", helada)} />)}
      </>}
      {tipo === "zapallo" && <>
        {Array.from({ length: 7 }).map((_, i) => { const a = -150 + i * 50; return <g key={i}><path d={`M0,-20 Q${a * 0.5},${-140 + caida * 1.5} ${a},${-200 + caida * 2.6}`} stroke={v} strokeWidth={10} fill="none" /><ellipse cx={a} cy={-220 + caida * 2.6} rx={80} ry={60 * (1 - helada * 0.5)} fill={i % 2 ? v : c} /></g>; })}
        <ellipse cx={60} cy={-30} rx={80} ry={56} fill={mezclar("#e8a040", "#6a4a2a", helada * 0.6)} />
      </>}
      {helada > 0.3 && Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-220 + random(`pc${i}`) * 440} cy={-500 + random(`pd${i}`) * 500} r={3 + random(`pe${i}`) * 4} fill="#e8f4ff" opacity={helada * 0.8} />)}
    </g>
  );
};

// ---------- capa de aire frío que baja por la loma y llena el campo (k 0..1) ----------
export const AireFrio: React.FC<{ k: number; f: number; x0?: number; x1?: number; piso: number }> = ({ k, f, x0 = 1800, x1 = 5400, piso }) => {
  if (k <= 0) return null;
  const frente = x0 + (x1 - x0) * k;
  return (
    <g opacity={0.75}>
      <defs><linearGradient id="af4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7ab4ff" stopOpacity={0} /><stop offset="1" stopColor="#9ac8ff" stopOpacity={0.75} /></linearGradient></defs>
      <path d={`M${x0},${piso - 360} Q${(x0 + frente) / 2},${piso - 240 + Math.sin(f / 20) * 12} ${frente},${piso - 120} L${frente + 120},${piso + 60} L${x0},${piso + 60} Z`} fill="url(#af4)" />
      {Array.from({ length: 10 }).map((_, i) => { const xx = x0 + ((i * 360 + f * 4) % Math.max(1, frente - x0)); return <path key={i} d={`M${xx},${piso - 60 - (i % 3) * 30} q60,-14 120,0 t120,0`} stroke="#d8ecff" strokeWidth={5} fill="none" opacity={0.6} />; })}
    </g>
  );
};

// ---------- grietas de sequía en el suelo ----------
export const Grietas: React.FC<{ x0: number; x1: number; y: number; k: number }> = ({ x0, x1, y, k }) => (
  <g opacity={k}>
    {Array.from({ length: 24 }).map((_, i) => { const x = x0 + (i / 24) * (x1 - x0) + random(`gr${i}`) * 60; const l = 40 + random(`gl${i}`) * 60; return <path key={i} d={`M${x},${y + (i % 3) * 22} l${l * 0.4},${8} l${l * 0.3},${-6} l${l * 0.3},${10} M${x + l * 0.4},${y + 8 + (i % 3) * 22} l-6,${16}`} stroke="#3a2418" strokeWidth={4} fill="none" />; })}
  </g>
);

// ---------- puesto de ruta (papas en bolsas) con cartel ----------
export const Puesto: React.FC<{ x: number; y: number; cartel: string; color?: string }> = ({ x, y, cartel, color = "#2f6a3a" }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-260} y={-210} width={520} height={30} fill={color} />
    {[-250, 230].map((px) => <rect key={px} x={px} y={-210} width={20} height={210} fill="#7a5532" />)}
    <rect x={-240} y={-90} width={480} height={20} fill="#8a6a42" />
    {Array.from({ length: 6 }).map((_, i) => <g key={i}><path d={`M${-220 + i * 78},-90 L${-218 + i * 78},-150 Q${-190 + i * 78},-170 ${-160 + i * 78},-150 L${-158 + i * 78},-90 Z`} fill={["#c9a26a", "#b08a5a", "#d6b67a"][i % 3]} /></g>)}
    <rect x={-200} y={-300} width={400} height={80} rx={8} fill="#f6efe0" stroke={color} strokeWidth={6} />
    <TXT x={0} y={-246} t={cartel} tam={cartel.length > 14 ? 30 : 40} color={color} peso={700} />
  </g>
);

// ---------- foto vieja de granja (sepia, mucha gente) en marco ----------
export const FotoVieja: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-230} y={-170} width={460} height={340} fill="#5a3a22" />
    <rect x={-205} y={-145} width={410} height={290} fill="#d8c4a0" />
    <rect x={-205} y={20} width={410} height={125} fill="#b89a70" />
    <path d="M-150,20 L-150,-60 L-110,-100 L-40,-100 L0,-60 L0,20 Z" fill="#9a7a58" />
    <rect x={40} y={-90} width={40} height={110} fill="#a88a66" />
    {Array.from({ length: 14 }).map((_, i) => <g key={i}><circle cx={-180 + i * 27} cy={58 + (i % 2) * 8} r={9} fill="#5a4630" /><rect x={-188 + i * 27} y={66 + (i % 2) * 8} width={16} height={40} rx={6} fill="#6a5238" /></g>)}
    <rect x={-205} y={-145} width={410} height={290} fill="#7a5a30" opacity={0.15} />
  </g>
);

// ---------- manómetro de barco (flashback de Gus) ----------
export const Manometro: React.FC<{ x: number; y: number; s?: number; aguja?: number }> = ({ x, y, s = 1, aguja = 0.5 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={140} fill="#b08a3a" /><circle r={118} fill="#f6efe0" />
    {Array.from({ length: 11 }).map((_, i) => { const a = (-135 + i * 27) * Math.PI / 180; return <line key={i} x1={Math.sin(a) * 94} y1={-Math.cos(a) * 94} x2={Math.sin(a) * 110} y2={-Math.cos(a) * 110} stroke="#2a1c18" strokeWidth={5} />; })}
    <path d={`M${Math.sin(((-135 + 270 * 0.75) * Math.PI) / 180) * 100},${-Math.cos(((-135 + 270 * 0.75) * Math.PI) / 180) * 100} A100,100 0 0 1 ${Math.sin((135 * Math.PI) / 180) * 100},${-Math.cos((135 * Math.PI) / 180) * 100}`} stroke="#d8382c" strokeWidth={10} fill="none" />
    <line x1={0} y1={0} x2={Math.sin(((-135 + 270 * aguja) * Math.PI) / 180) * 96} y2={-Math.cos(((-135 + 270 * aguja) * Math.PI) / 180) * 96} stroke="#1c1416" strokeWidth={8} strokeLinecap="round" />
    <circle r={14} fill="#1c1416" />
  </g>
);

// ---------- cancha de fútbol americano dibujada (vista aérea) ----------
export const Cancha: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 1 }) => (
  <g opacity={o}>
    <rect x={x} y={y} width={w} height={h} fill="#4f9a3c" stroke="#f6efe0" strokeWidth={8} />
    {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={x + (w * i) / 10 - 2} y={y} width={4} height={h} fill="#f6efe0" opacity={0.8} />)}
    {[0, 1].map((k) => <rect key={k} x={k ? x + w : x - w * 0.08} y={y} width={w * 0.08} height={h} fill="#c0352c" opacity={0.6} />)}
  </g>
);

// paso de tiempo «sol/luna n veces»: hora discreta por ciclo
export const horaCiclo = (f: number, f0: number, f1: number, n: number): "dia" | "ocaso" | "noche" | "alba" => {
  const u = interpolate(f, [f0, f1], [0, n], cl);
  const fr = u % 1;
  return u >= n ? "dia" : fr < 0.45 ? "dia" : fr < 0.55 ? "ocaso" : fr < 0.9 ? "noche" : "alba";
};

// sol que cruza el cielo (para el paso del tiempo): u 0..n
export const SolCruza: React.FC<{ u: number; x0: number; x1: number; y: number; luna?: boolean }> = ({ u, x0, x1, y, luna }) => {
  const fr = u % 1;
  const xx = x0 + (x1 - x0) * fr, yy = y - Math.sin(fr * Math.PI) * 260;
  return <g><Halo x={xx} y={yy} r={160} color={luna ? "#e8ecff" : "#fff3c0"} fuerza={0.6} /><circle cx={xx} cy={yy} r={luna ? 40 : 56} fill={luna ? "#e8ecff" : "#fff0b0"} /></g>;
};
