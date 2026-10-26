// The Last Census · sets del Ep.6 (sesión lc-c). Madeline Island / La Pointe, el canal helado, el corte del hielo,
// la estación de guardaparques, islas lejanas (Pitcairn, Tristan, lobos), la iglesia por dentro y el lago abierto.
// Reglas del mundo (MUNDO.md): piso y=900 en la capa MEDIO; vector plano; nada de filtros ni blend en capas grandes.
import React from "react";
import { interpolate, random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Arbol, Cielo, Colinas, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { F_MANO } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { Estrellas, NieveCae } from "../mundo/comun";
import { Hora, LUCES } from "../mundo/hora";
import { Arbolito, RadioHF } from "./piezas";
import { Termometro } from "../lcb/granja";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const NIEVE = "#eef0f4";
const HIELO = "#bcd4ea";
const HONDO = "#16233a";

// ---------------------------------------------------------------- piezas chicas del Ep.6
export const Iglesia: React.FC<{ x: number; y: number; s?: number; luz?: number; nieve?: number }> = ({ x, y, s = 1, luz = 0, nieve = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-200} width={300} height={200} fill="#f2efe6" />
    <path d="M-170,-196 L0,-300 L170,-196 Z" fill="#5a5560" />
    <rect x={-40} y={-420} width={80} height={240} fill="#f2efe6" />
    <path d="M-52,-416 L0,-560 L52,-416 Z" fill="#5a5560" />
    <rect x={-3} y={-610} width={6} height={60} fill="#3a3540" /><rect x={-20} y={-596} width={40} height={6} fill="#3a3540" />
    <path d="M-16,-370 a16,16 0 0 1 32,0 v40 h-32 Z" fill={luz > 0 ? mezclar("#3a4058", AMBAR, luz) : "#3a4058"} />
    {[-100, 100].map((d) => <path key={d} d={`M${d - 22},-90 a22,22 0 0 1 44,0 v70 h-44 Z`} fill={luz > 0 ? mezclar("#3a4058", AMBAR, luz) : "#3a4058"} />)}
    <path d="M-30,0 v-80 a30,30 0 0 1 60,0 v80 Z" fill="#6a4a30" />
    {nieve > 0 && <><path d="M-176,-194 L0,-304 L176,-194 L160,-188 L0,-286 L-160,-188 Z" fill={NIEVE} opacity={nieve} /><path d="M-56,-414 L0,-566 L56,-414 L44,-410 L0,-540 L-44,-410 Z" fill={NIEVE} opacity={nieve} /></>}
    {luz > 0 && <Halo x={0} y={-100} r={260} color={AMBAR} fuerza={0.35 * luz} />}
  </g>
);

export const Casita: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; techo?: string; luz?: number; nieve?: number; seed?: number }> = ({ x, y, w = 220, h = 160, color = "#b8c4c8", techo = "#4a4048", luz = 0, nieve = 0, seed = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill={color} />
    <path d={`M${-w / 2 - 16},${-h + 4} L0,${-h - w * 0.36} L${w / 2 + 16},${-h + 4} Z`} fill={techo} />
    {nieve > 0 && <path d={`M${-w / 2 - 20},${-h + 4} L0,${-h - w * 0.36 - 6} L${w / 2 + 20},${-h + 4} L${w / 2},${-h + 12} L0,${-h - w * 0.3} L${-w / 2},${-h + 12} Z`} fill={NIEVE} opacity={nieve} />}
    {[-w / 4, w / 4].map((d, i) => <rect key={i} x={d - 26} y={-h + 40} width={52} height={50} fill={luz > 0 && random(`v${seed}${i}`) < luz * 1.3 ? AMBAR : osc(color, 0.45)} stroke={acl(color, 0.5)} strokeWidth={5} />)}
    {luz > 0 && <Halo x={0} y={-h + 60} r={w} color={AMBAR} fuerza={0.25 * luz} />}
  </g>
);

export const Muelle: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 600 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={0} y={-22} width={w} height={22} fill="#7a5a3e" />
    {Array.from({ length: Math.floor(w / 40) }).map((_, i) => <rect key={i} x={i * 40} y={-22} width={2} height={22} fill="#5a4030" />)}
    {Array.from({ length: Math.floor(w / 120) + 1 }).map((_, i) => <rect key={i} x={i * 120} y={-6} width={16} height={110} fill="#4a3424" />)}
  </g>
);

export const Ferry: React.FC<{ x: number; y: number; s?: number; oxido?: number; autos?: boolean }> = ({ x, y, s = 1, oxido = 0, autos = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-260,-40 L260,-40 L230,20 L-230,20 Z" fill={mezclar("#e8e4da", "#8a5a3a", oxido)} />
    <rect x={-260} y={-48} width={520} height={10} fill={mezclar("#2f4a6a", "#5a3a2a", oxido)} />
    <rect x={120} y={-140} width={90} height={92} fill={mezclar("#f2efe6", "#a07050", oxido * 0.7)} /><rect x={130} y={-126} width={70} height={24} fill="#3a4a5a" />
    {autos && [-180, -60].map((d, i) => <g key={i} transform={`translate(${d},-48)`}><rect x={-46} y={-40} width={92} height={40} rx={10} fill={["#6a2f36", "#2f4a5e"][i]} /><rect x={-26} y={-60} width={52} height={24} rx={8} fill={["#6a2f36", "#2f4a5e"][i]} /></g>)}
    {oxido > 0 && Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-220 + i * 55} y={-30} width={6} height={30 + (i % 3) * 8} fill="#7a3a1a" opacity={oxido * 0.7} />)}
  </g>
);

export const Windsled: React.FC<{ x: number; y: number; s?: number; f?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, f = 0, dir = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
    <path d="M-200,-10 L180,-10 Q220,-10 230,-40 L-200,-40 Z" fill="#c8382c" />
    <rect x={-200} y={-60} width={140} height={22} fill="#e8e4da" /><rect x={-40} y={-110} width={160} height={70} rx={14} fill="#e8e4da" /><rect x={-20} y={-100} width={120} height={36} rx={8} fill="#3a4a5a" />
    <rect x={-250} y={-200} width={14} height={160} fill="#3a3a40" />
    <g transform={`translate(-243,-150) rotate(${(f * 47) % 360})`}><ellipse rx={12} ry={110} fill="#2a2a30" opacity={0.75} /><ellipse rx={110} ry={12} fill="#2a2a30" opacity={0.75} /></g>
    <ellipse cx={-243} cy={-150} rx={120} ry={120} fill="none" stroke="#8a8a92" strokeWidth={6} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${-280 - i * 60},${-4 - i * 8} q-40,-10 -80,0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.5 - i * 0.12} />)}
  </g>
);

export const MotoNieve: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-120,-10 L110,-10 Q150,-12 150,-36 L-110,-40 Z" fill="#2a2a30" />
    <path d="M-90,-40 L60,-40 L110,-90 L20,-110 L-60,-80 Z" fill="#2f6aa8" /><rect x={-40} y={-120} width={70} height={30} rx={10} fill="#1a1a20" />
    <path d="M110,-90 L150,-120" stroke="#9ab" strokeWidth={8} />
  </g>
);

export const AutoChico: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#6a2f36" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-140} y={-70} width={280} height={56} rx={16} fill={color} /><path d="M-80,-70 L-50,-120 L60,-120 L100,-70 Z" fill={color} /><path d="M-62,-74 L-40,-110 L0,-110 L0,-74 Z M12,-74 L12,-110 L52,-110 L82,-74 Z" fill="#9ab4c8" />
    {[-80, 80].map((d) => <circle key={d} cx={d} cy={-14} r={26} fill="#1a1a20" />)}
  </g>
);

export const Lobo: React.FC<{ x: number; y: number; s?: number; f?: number; echado?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, f = 0, echado = 0, dir = 1 }) => {
  const paso = Math.sin(f / 4) * 14 * (1 - echado);
  return (
    <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
      <g transform={`translate(0,${echado * 40})`}>
        {[-50, -30, 40, 60].map((d, i) => <rect key={i} x={d} y={-60} width={12} height={60 - echado * 40} fill="#5a5a62" transform={`rotate(${(i % 2 ? 1 : -1) * paso} ${d + 6} -60)`} />)}
        <ellipse cx={0} cy={-80} rx={90} ry={34} fill="#7a7a84" />
        <path d="M70,-96 L120,-120 L140,-100 L130,-88 L100,-80 Z" fill="#7a7a84" /><path d="M112,-120 l6,-22 l10,20 Z" fill="#5a5a62" />
        <path d="M-88,-90 q-50,0 -60,40" stroke="#7a7a84" strokeWidth={16} fill="none" strokeLinecap="round" />
        <circle cx={124} cy={-106} r={3} fill="#1a1a1a" />
      </g>
    </g>
  );
};

export const Velero: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-200,-30 L220,-30 L180,20 L-170,20 Z" fill="#5a3a24" />
    {[-90, 20, 120].map((d, i) => <g key={i}><rect x={d - 4} y={-330 + i * 20} width={8} height={300 - i * 20} fill="#3a2a1a" />{[0, 1, 2].map((k) => <path key={k} d={`M${d - 70 + k * 6},${-300 + i * 20 + k * 90} q70,30 140,0 l0,70 q-70,20 -140,0 Z`} fill="#efe6d2" />)}</g>)}
  </g>
);

export const Carguero: React.FC<{ x: number; y: number; s?: number; luz?: number }> = ({ x, y, s = 1, luz = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-420,-60 L400,-60 L440,-20 L420,10 L-400,10 L-430,-30 Z" fill="#1c1e28" />
    <rect x={-400} y={-110} width={90} height={50} fill="#262a36" /><rect x={300} y={-130} width={90} height={70} fill="#262a36" />
    <circle cx={345} cy={-112} r={6} fill={AMBAR} opacity={luz} /><Halo x={345} y={-112} r={80} color={AMBAR} fuerza={0.5 * luz} />
  </g>
);

export const Generador: React.FC<{ x: number; y: number; on?: number; f?: number; tos?: number }> = ({ x, y, on = 1, f = 0, tos = 0 }) => (
  <g transform={`translate(${x},${y + (tos > 0 ? Math.sin(f * 2.5) * 3 * tos : 0)})`}>
    <rect x={-120} y={-130} width={240} height={130} rx={10} fill="#4a6a3a" /><rect x={-100} y={-110} width={110} height={70} fill="#2a2e2a" />
    {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={-90} y={-104 + i * 13} width={90} height={5} fill="#4a4e4a" />)}
    <circle cx={70} cy={-80} r={18} fill={on > 0.5 ? "#7dffb0" : "#3a3a3a"} />
    <rect x={90} y={-190} width={14} height={60} fill="#3a3a40" />
    {tos > 0 && [0, 1, 2].map((i) => <circle key={i} cx={97 + Math.sin(f / 5 + i) * 10} cy={-200 - ((f * 2 + i * 30) % 90)} r={14 + i * 4} fill="#3a3a40" opacity={0.5 * tos * (1 - ((f * 2 + i * 30) % 90) / 90)} />)}
  </g>
);

// ---------------------------------------------------------------- ISLA (Madeline Island · La Pointe, de costado)
// agua a la izquierda (x < 300) con el muelle; tierra de 300 a 4800 con el pueblo. Bayfield lejos a la izquierda.
export const ISLA_PISO = 900;
export const ISLA_PUNTOS = { bayfield: -900, muelle: 0, iglesia: 1350, escuela: 2050, almacen: 2700, casas: 3300, estacion: 4300 };
type PI = SetProps & { hora?: Hora; estacion?: "verano" | "invierno"; luces?: number; hielo?: number; ferry?: number; ferryOxido?: number; pins?: number[]; nieve?: boolean; generador?: number };
export const Isla: React.FC<PI> = ({ capa, f, hora = "dia", estacion = "verano", luces = 0, hielo = 0, ferry = -1, ferryOxido = 0, pins = [], nieve, generador = -1 }) => {
  const L = LUCES[hora];
  const P = ISLA_PISO;
  const inv = estacion === "invierno";
  const suelo = inv ? mezclar(NIEVE, L.nieve, 0.5) : "#5f8a4a";
  const agua = mezclar(L.lago[0], HIELO, hielo);
  if (capa === "lejos") return (
    <g>
      <Cielo c={L.cielo} />
      {L.estrellas > 0 && <Estrellas f={f} o={L.estrellas} />}
      <circle cx={2600} cy={L.solY} r={70} fill={L.sol} opacity={hora === "noche" ? 0.9 : 1} /><Halo x={2600} y={L.solY} r={420} color={L.sol} fuerza={0.3} />
      <rect x={-3000} y={640} width={9000} height={900} fill={agua} />
      <Colinas y={660} alto={60} color={inv ? osc(L.nieve, 0.8) : "#3d5a48"} seed={6} />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-2000 + i * 500 + (f * 0.6) % 500} y={700 + (i % 5) * 40} width={160} height={3} fill={acl(agua, 0.35)} opacity={0.6 * (1 - hielo)} />)}
    </g>
  );
  if (capa === "frente") return <g>{(nieve ?? inv) && <NieveCae f={f} n={90} o={0.7} />}</g>;
  // pueblo de costado, del muelle a la estación
  const casas = Array.from({ length: 12 }).map((_, i) => ({ x: ISLA_PUNTOS.casas - 600 + i * 210 + (i > 5 ? 400 : 0), c: ["#b8c4c8", "#d8c8a8", "#c8a890", "#a8b8a0", "#e0d8c8"][i % 5], t: ["#4a4048", "#6a3a32", "#3a4a5a"][i % 3] }));
  return (
    <g>
      {/* agua del canal adelante del pueblo (lado izquierdo) */}
      <rect x={-3000} y={P - 10} width={3300} height={1600} fill={agua} />
      {hielo < 1 && Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${-2800 + i * 190 + Math.sin(f / 20 + i) * 20},${P + 40 + (i % 4) * 60} q30,-10 60,0 q30,10 60,0`} stroke={acl(agua, 0.4)} strokeWidth={4} fill="none" opacity={1 - hielo} />)}
      {hielo > 0.6 && <rect x={-3000} y={P - 10} width={3300} height={6} fill="#fff" opacity={(hielo - 0.6) * 2} />}
      <path d={`M300,${P} Q200,${P - 30} 150,${P + 60} L150,${P + 1600} L5000,${P + 1600} L5000,${P} Z`} fill={suelo} />
      <rect x={300} y={P} width={4700} height={10} fill={osc(suelo, 0.85)} />
      <Muelle x={-480} y={P + 20} w={620} />
      {ferry >= 0 && <Ferry x={lerp(-2600, -260, ferry)} y={P + 30} s={0.9} oxido={ferryOxido} autos={ferryOxido < 0.2} />}
      {Array.from({ length: 10 }).map((_, i) => <Arbol key={i} x={600 + i * 470} y={P - 2} s={0.9 + (i % 3) * 0.2} copa={inv ? "#3d5a50" : "#3f6a3a"} tipo="pino" />)}
      <Iglesia x={ISLA_PUNTOS.iglesia} y={P} luz={luces} nieve={inv ? 1 : 0} />
      {/* escuela (rojo ladrillo, campana) */}
      <g transform={`translate(${ISLA_PUNTOS.escuela},${P})`}><rect x={-200} y={-180} width={400} height={180} fill="#a85a42" /><path d="M-220,-176 L0,-260 L220,-176 Z" fill="#4a4048" />{[-130, -40, 50, 140].map((d, i) => <rect key={i} x={d - 26} y={-140} width={52} height={70} fill={luces > 0 && random(`es${i}`) < luces ? AMBAR : "#3a4058"} stroke="#e8e0cf" strokeWidth={5} />)}<text x={0} y={-196} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={22} fill="#f2ead8">SCHOOL</text></g>
      {/* almacén */}
      <g transform={`translate(${ISLA_PUNTOS.almacen},${P})`}><rect x={-180} y={-200} width={360} height={200} fill="#d8c8a8" /><rect x={-190} y={-220} width={380} height={30} fill="#6a3a32" /><text x={0} y={-198} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={22} fill="#f2ead8">LA POINTE STORE</text><rect x={-140} y={-160} width={120} height={100} fill={luces > 0 ? mezclar("#3a4058", AMBAR, luces) : "#3a4058"} stroke="#e8e0cf" strokeWidth={6} /><rect x={30} y={-150} width={80} height={150} fill="#6a4a30" /></g>
      {casas.map((c, i) => <Casita key={i} x={c.x} y={P} color={c.c} techo={c.t} luz={luces > 0 ? interpolate(luces, [i / 12, i / 12 + 0.08], [0, 1], cl) : 0} nieve={inv ? 1 : 0} seed={i} w={180 + (i % 3) * 30} h={140 + (i % 2) * 30} />)}
      {/* estación de guardaparques */}
      <g transform={`translate(${ISLA_PUNTOS.estacion},${P})`}><rect x={-170} y={-170} width={340} height={170} fill="#6a5a3a" /><path d="M-190,-166 L0,-250 L190,-166 Z" fill="#3a4a3a" /><rect x={-110} y={-130} width={80} height={60} fill={luces > 0 ? AMBAR : "#3a4058"} /><rect x={-6} y={-330} width={6} height={160} fill="#3a3a40" /><path d="M0,-330 l40,-60 M0,-330 l-40,-60" stroke="#3a3a40" strokeWidth={4} /><text x={40} y={-186} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={18} fill="#f2ead8">RANGER</text></g>
      {generador >= 0 && <Generador x={ISLA_PUNTOS.estacion + 300} y={P} on={generador} f={f} tos={generador > 0 && generador < 1 ? 1 : 0} />}
      {/* pins a mano (muelle, iglesia, escuela, pueblo) */}
      {pins.map((desde, i) => {
        const x = [0, ISLA_PUNTOS.iglesia, ISLA_PUNTOS.escuela, ISLA_PUNTOS.casas][i];
        const y = [P - 180, P - 720, P - 380, P - 360][i];
        const u = interpolate(f, [desde, desde + 8], [0, 1], cl);
        const t = ["DOCK", "CHURCH", "SCHOOL", "TOWN"][i];
        return u > 0 && <g key={i} transform={`translate(${x},${y - (1 - u) * 40})`} opacity={u}><path d="M0,0 C-30,-40 -40,-60 -40,-80 a40,40 0 0 1 80,0 c0,20 -10,40 -40,80 Z" fill="#c0352c" /><circle cy={-80} r={14} fill="#f2ead8" /><text x={0} y={-140} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={48} fill="#f6ecd2" stroke="#1a1a24" strokeWidth={6} paintOrder="stroke">{t}</text></g>;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- LAGO HELADO (en perspectiva: = miniatura del Ep.6)
// horizonte HZ; la isla con la iglesia al fondo; camino de arbolitos que va del frente-derecha a la isla.
export const LH_HZ = 470;
export const LH_ISLA = { x: 1120, y: LH_HZ };
export const LH_CERCA = { x: 1520, y: 1180 };
// punto del camino: t=0 cerca, t=1 en la isla; s = escala de una persona ahí (1 = y 900)
export const enCamino = (t: number, off = 0) => {
  const y = LH_HZ + (LH_CERCA.y - LH_HZ) * Math.pow(1 - t, 2.2);
  const s = (y - LH_HZ) / (900 - LH_HZ);
  const x = lerp(LH_CERCA.x, LH_ISLA.x, 1 - Math.pow(1 - t, 2.2)) + off * s;
  return { x, y, s };
};
type PL = SetProps & { hora?: Hora; arbolitos?: number; grieta?: number; agua?: number; lechoso?: number; calor?: number; autos?: number; nieveCae?: boolean; islaLuz?: number };
export const LagoHelado: React.FC<PL> = ({ capa, f, hora = "ocaso", arbolitos = 1, grieta = 0, agua = 0, lechoso = 0, calor = 0, autos = -1, nieveCae = false, islaLuz }) => {
  const L = LUCES[hora];
  const HZ = LH_HZ;
  const hielo = mezclar(L.nieve, HIELO, 0.25);
  const sup = mezclar(hielo, L.lago[0], agua);
  if (capa === "lejos") return (
    <g>
      <Cielo c={L.cielo} y={-1200} h={HZ + 1260} />
      {L.estrellas > 0 && <Estrellas f={f} o={L.estrellas} h={HZ + 500} />}
      {hora === "ocaso" && Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${600 + i * 260},${120 + (i % 3) * 60} q120,-30 260,0 q-120,24 -260,0`} fill={i % 2 ? "#f2924a" : "#e05a3a"} opacity={0.75} />)}
      <circle cx={1500} cy={HZ - 30} r={60} fill={L.sol} /><Halo x={1500} y={HZ - 30} r={600} color={L.sol} fuerza={0.45} />
      <Colinas y={HZ - 10} alto={40} color={osc(L.cielo[1], 0.7)} seed={3} />
    </g>
  );
  if (capa === "frente") return <g>{nieveCae && <NieveCae f={f} n={120} o={0.7} />}</g>;
  const I = LH_ISLA;
  // la grieta de la izquierda: bloques de hielo con agua negra entre medio
  const bloques = Array.from({ length: 14 }).map((_, i) => ({ x: -260 + i * 90 + (i % 2) * 30, y: 640 + i * 52, w: 180 + (i % 3) * 40, h: 60 + (i % 4) * 14 }));
  return (
    <g>
      <rect x={-3000} y={HZ} width={9000} height={2400} fill={sup} />
      {/* brillo del sol sobre el hielo */}
      <path d={`M1500,${HZ} L1200,1600 L2000,1600 Z`} fill={L.sol} opacity={0.18 * (1 - agua)} />
      {Array.from({ length: 22 }).map((_, i) => { const y = HZ + 20 + Math.pow(i / 22, 1.8) * 1100; return <rect key={i} x={-3000} y={y} width={9000} height={2 + i * 0.3} fill={acl(sup, 0.35)} opacity={0.4} />; })}
      {/* manchas: hielo lechoso (blanco) y "mapa de calor" frío */}
      {lechoso > 0 && Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={300 + i * 420} cy={HZ + 120 + (i % 3) * 140} rx={260} ry={50} fill="#ffffff" opacity={0.65 * lechoso} />)}
      {calor > 0 && Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={-200 + i * 330} cy={HZ + 90 + (i % 4) * 120} rx={240 - (i % 3) * 40} ry={40 + (i % 2) * 20} fill={["#1f4a8a", "#3a7ac8", "#8fc8f0", "#e8f4ff"][i % 4]} opacity={0.8 * calor} />)}
      {/* la isla con la iglesia */}
      <g>
        <path d={`M${I.x - 360},${HZ + 6} Q${I.x - 200},${HZ - 70} ${I.x},${HZ - 80} Q${I.x + 220},${HZ - 70} ${I.x + 380},${HZ + 6} Z`} fill={mezclar(L.nieve, "#ffffff", 0.3)} />
        {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${I.x - 300 + i * 40},${HZ - 30 - Math.sin(i / 3) * 30} l-14,40 h28 Z M${I.x - 300 + i * 40},${HZ - 55 - Math.sin(i / 3) * 30} l-11,34 h22 Z`} fill="#1e3a36" />)}
        <Iglesia x={I.x + 10} y={HZ - 60} s={0.22} luz={islaLuz ?? (hora === "noche" || hora === "ocaso" ? 1 : 0)} nieve={1} />
      </g>
      {/* la grieta */}
      {grieta > 0 && <g opacity={grieta}>
        <path d={`M-300,620 ${bloques.map((b) => `L${b.x + b.w},${b.y}`).join(" ")} L700,1500 L-300,1500 Z`} fill={HONDO} />
        {bloques.map((b, i) => <g key={i}><polygon points={`${b.x},${b.y} ${b.x + b.w},${b.y - 10} ${b.x + b.w - 20},${b.y + b.h} ${b.x - 10},${b.y + b.h + 6}`} fill={HIELO} /><polygon points={`${b.x - 10},${b.y + b.h + 6} ${b.x + b.w - 20},${b.y + b.h} ${b.x + b.w - 26},${b.y + b.h + 30} ${b.x - 6},${b.y + b.h + 34}`} fill="#6a9ac8" /><path d={`M${b.x + 20},${b.y + 14} l${b.w * 0.5},-4`} stroke="#fff" strokeWidth={3} opacity={0.7} /></g>)}
        {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={-200 + i * 90 + Math.sin(f / 6 + i) * 10} cy={900 + i * 50 + Math.cos(f / 5 + i) * 8} r={6 + (i % 3) * 3} fill="#e8f4ff" opacity={0.7} />)}
      </g>}
      {/* camino de arbolitos de Navidad */}
      {arbolitos > 0 && Array.from({ length: 24 }).map((_, i) => {
        const t = i / 24;
        const p = enCamino(t, i % 2 ? -260 : 300);
        return t < arbolitos && <Arbolito key={i} x={p.x} y={p.y} s={p.s * 0.85} seed={i} nieve />;
      })}
      {/* autos chicos de «antes» por el camino */}
      {autos >= 0 && [0, 1, 2].map((i) => { const t = (autos + i * 0.3) % 1; const p = enCamino(t); return <AutoChico key={i} x={p.x} y={p.y} s={p.s * 0.8} color={["#6a2f36", "#2f4a5e", "#c9b48a"][i]} />; })}
    </g>
  );
};

// ---------------------------------------------------------------- CORTE DEL HIELO (sección con regla)
// superficie arriba en HC_SUP; el espesor crece con `pulg` (1" = 34 px); agua abajo.
export const HC_SUP = 560;
export const PX_PULG = 34;
type PH = SetProps & { pulg?: number; lechoso?: number; grieta?: number; agujero?: number; vara?: number; hora?: Hora; marcas?: boolean };
export const HieloCorte: React.FC<PH> = ({ capa, f, pulg = 8, lechoso = 0, grieta = 0, agujero = 0, vara = 0, hora = "invierno", marcas = true }) => {
  const L = LUCES[hora];
  const S = HC_SUP, e = pulg * PX_PULG;
  if (capa === "lejos") return <g><Cielo c={L.cielo} y={-1200} h={S + 1200} /><Colinas y={S - 4} alto={50} color={osc(L.nieve, 0.82)} seed={9} /></g>;
  if (capa === "frente") return (
    <g>
      {/* la regla a la izquierda (fija al mundo) */}
      {marcas && <g transform={`translate(260,${S})`}>
        <rect x={-34} y={-20} width={68} height={16 * PX_PULG + 40} fill="#f2c14a" stroke="#8a6a2a" strokeWidth={3} />
        {Array.from({ length: 17 }).map((_, i) => <g key={i}><rect x={-34} y={i * PX_PULG - 1} width={i % 4 === 0 ? 40 : 22} height={3} fill="#2a1c18" />{i % 2 === 0 && <text x={14} y={i * PX_PULG + 9} fontFamily="Arial" fontWeight={800} fontSize={22} fill="#2a1c18">{i}"</text>}</g>)}
      </g>}
    </g>
  );
  return (
    <g>
      <rect x={-3000} y={S + e} width={9000} height={2000} fill={HONDO} />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-1000 + i * 180 + Math.sin(f / 20 + i) * 30} cy={S + e + 120 + ((i * 97 - f * 0.8) % 600 + 600) % 600} r={4 + (i % 3) * 3} fill="#5a8ab8" opacity={0.4} />)}
      {/* el hielo: negro transparente arriba de lo blanco lechoso */}
      <rect x={-3000} y={S} width={9000} height={e} fill="#2a3e5a" />
      <rect x={-3000} y={S} width={9000} height={e} fill="#7aa8d0" opacity={0.35} />
      {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M${-2000 + i * 160},${S + 10 + (i % 5) * e / 6} l40,${e / 8}`} stroke="#bfe0ff" strokeWidth={2} opacity={0.5} />)}
      {lechoso > 0 && <rect x={400} y={S} width={1400} height={e} fill="#f2f6fa" opacity={0.85 * lechoso} />}
      {lechoso > 0 && <text x={1100} y={S + e / 2 + 14} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#5a6a7a" opacity={lechoso}>CLOUDY ICE</text>}
      {grieta > 0 && <path d={`M900,${S} l-30,${e * 0.3} l40,${e * 0.25} l-26,${e * 0.25 * grieta}`} stroke="#0a1220" strokeWidth={5} fill="none" opacity={grieta} />}
      {/* nieve encima */}
      <rect x={-3000} y={S - 24} width={9000} height={26} fill={NIEVE} />
      {Array.from({ length: 50 }).map((_, i) => <ellipse key={i} cx={-2400 + i * 140} cy={S - 22} rx={70} ry={10} fill={NIEVE} />)}
      {/* agujero del barreno con vara */}
      {agujero > 0 && <g><rect x={1700} y={S - 24} width={70} height={e + 24} fill={HONDO} opacity={agujero} /><rect x={1700} y={S - 24} width={70} height={e + 24} fill="#7aa8d0" opacity={0.25 * agujero} />
        {vara > 0 && <g transform={`translate(1735,${S - 80})`} opacity={vara}><rect x={-8} y={0} width={16} height={e + 120} fill="#e8e4da" />{Array.from({ length: Math.ceil(pulg) + 3 }).map((_, i) => <rect key={i} x={-8} y={80 + i * PX_PULG} width={i % 4 === 0 ? 24 : 14} height={3} fill="#c0352c" />)}</g>}
      </g>}
    </g>
  );
};

// ---------------------------------------------------------------- ESTACIÓN DE LA ISLA (interior de la guardaparques)
export const EI_PISO = 900;
export const EI_PUNTOS = { ventana: 380, termometro: 560, radio: 1080, silla: 940, mapa: 1720, puerta: 2300 };
type PE = SetProps & { hora?: Hora; luzRadio?: number; aguja?: number; temp?: number; ruta?: number; afuera?: "verano" | "invierno"; lampara?: number };
export const EstacionIsla: React.FC<PE> = ({ capa, f, hora = "noche", luzRadio = 0.8, aguja = 0.55, temp = 20, ruta = 0, afuera = "invierno", lampara = 1 }) => {
  const L = LUCES[hora];
  const P = EI_PISO;
  const pared = "#5a6a52";
  if (capa === "lejos") return <g><rect x={-3000} y={-2000} width={9000} height={5000} fill={osc(pared, 0.5)} /></g>;
  if (capa === "frente") return <g />;
  const V = { x: EI_PUNTOS.ventana - 160, y: 260, w: 320, h: 300 };
  return (
    <g>
      <rect x={-2000} y={-1200} width={6000} height={P + 1200} fill={pared} />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-2000 + i * 160} y={-1200} width={4} height={P + 1200} fill={osc(pared, 0.85)} />)}
      <rect x={-2000} y={P - 120} width={6000} height={120} fill={osc(pared, 0.8)} />
      {/* ventana al lago */}
      <g>
        <rect x={V.x} y={V.y} width={V.w} height={V.h} fill={L.cielo[1]} />
        <rect x={V.x} y={V.y + V.h * 0.62} width={V.w} height={V.h * 0.38} fill={afuera === "invierno" ? L.nieve : L.lago[0]} />
        {L.estrellas > 0 && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={V.x + 20 + i * 30} cy={V.y + 30 + (i % 3) * 30} r={2} fill="#fff" opacity={0.7} />)}
        <rect x={V.x - 14} y={V.y - 14} width={V.w + 28} height={14} fill="#e8e0cf" /><rect x={V.x - 14} y={V.y + V.h} width={V.w + 28} height={22} fill="#e8e0cf" /><rect x={V.x - 14} y={V.y} width={14} height={V.h} fill="#e8e0cf" /><rect x={V.x + V.w} y={V.y} width={14} height={V.h} fill="#e8e0cf" /><rect x={V.x + V.w / 2 - 5} y={V.y} width={10} height={V.h} fill="#e8e0cf" />
        {afuera === "invierno" && <path d={`M${V.x},${V.y + V.h} q40,-30 80,0 q40,-26 80,0 q40,-30 80,0 q40,-24 80,0 Z`} fill="#f4f6fa" />}
      </g>
      <Termometro x={EI_PUNTOS.termometro} y={V.y + V.h - 20} temp={temp} s={0.9} />
      {/* mesa + radio */}
      <rect x={EI_PUNTOS.radio - 300} y={P - 280} width={620} height={24} fill="#7a5a3e" /><rect x={EI_PUNTOS.radio - 280} y={P - 256} width={18} height={256} fill="#5a4030" /><rect x={EI_PUNTOS.radio + 280} y={P - 256} width={18} height={256} fill="#5a4030" />
      <RadioHF x={EI_PUNTOS.radio + 80} y={P - 280} f={f} luz={luzRadio} aguja={aguja} mic />
      {/* lámpara */}
      <g transform={`translate(${EI_PUNTOS.radio - 220},${P - 280})`}><rect x={-4} y={-150} width={8} height={150} fill="#2a2a30" /><path d="M-50,-150 L50,-150 L30,-200 L-30,-200 Z" fill="#3f6a4a" /><Halo x={0} y={-120} r={500} color="#ffd890" fuerza={0.35 * lampara} /></g>
      {/* mapa de Apostle Islands */}
      <g transform={`translate(${EI_PUNTOS.mapa},${300})`}>
        <rect x={-260} y={-160} width={520} height={360} fill="#efe6d2" stroke="#6a5240" strokeWidth={6} />
        <rect x={-240} y={-140} width={480} height={320} fill="#9cc4dc" />
        <path d="M-240,180 L-240,60 Q-150,40 -90,90 Q-40,120 0,180 Z" fill="#c8d8a8" />
        {[[-40, -60, 38], [40, -90, 26], [110, -20, 30], [-110, -100, 20], [150, -110, 18], [60, 40, 46], [-160, -40, 16]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.6} fill="#c8d8a8" stroke={i === 5 ? "#c0352c" : "none"} strokeWidth={4} />)}
        <text x={60} y={46} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={13} fill="#2a1c18">MADELINE</text>
        <text x={-170} y={164} fontFamily="Arial" fontWeight={800} fontSize={13} fill="#2a1c18">BAYFIELD</text>
        <text x={0} y={-124} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={18} fill="#1d3a6a">APOSTLE ISLANDS</text>
        {ruta > 0 && <path d={`M20,60 L${20 - 120 * ruta},${60 + 60 * ruta}`} stroke="#c0352c" strokeWidth={5} strokeDasharray="10 8" fill="none" />}
      </g>
      {/* sombrero colgado + puerta */}
      <g transform={`translate(${EI_PUNTOS.puerta},${P})`}><rect x={-120} y={-460} width={240} height={460} fill="#4a3424" /><circle cx={80} cy={-230} r={10} fill="#c8a84a" /></g>
      <rect x={-2000} y={P} width={6000} height={1600} fill="#6a4a30" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-2000 + i * 200} y={P} width={3} height={1600} fill="#5a3e28" />)}
    </g>
  );
};

// ---------------------------------------------------------------- ISLA LEJANA (Pitcairn, Tristan, lobos)
type PIL = SetProps & { tipo?: "pitcairn" | "tristan" | "lobos" | "hoy"; barco?: number; casitas?: number; hora?: Hora };
export const ISLA_LEJANA_PUNTOS = { playa: 900, pueblo: 1500, cima: 1300 };
export const IslaLejana: React.FC<PIL> = ({ capa, f, tipo = "pitcairn", barco = -1, casitas = 0, hora }) => {
  const P = 900;
  const trop = tipo === "pitcairn" || tipo === "hoy";
  const cielo: [string, string, string] = trop ? ["#3a8ac8", "#8ac8e8", "#e8f4f0"] : tipo === "tristan" ? ["#4a5a74", "#8a9ab0", "#c9d3e2"] : LUCES[hora ?? "invierno"].cielo;
  const mar = trop ? "#1e8ab0" : tipo === "tristan" ? "#2a4a6a" : "#8fa6c0";
  if (capa === "lejos") return (
    <g>
      <Cielo c={cielo} />
      {trop && <circle cx={2400} cy={220} r={80} fill="#fff6d0" />}
      <rect x={-3000} y={720} width={9000} height={1000} fill={mar} />
      {Array.from({ length: 18 }).map((_, i) => <path key={i} d={`M${-2000 + i * 340 + ((f * 1.2) % 340)},${760 + (i % 4) * 40} q30,-12 60,0 q30,12 60,0`} stroke={acl(mar, 0.4)} strokeWidth={4} fill="none" />)}
    </g>
  );
  if (capa === "frente") return <g>{tipo === "lobos" && <NieveCae f={f} n={70} o={0.6} />}</g>;
  const isla = trop ? "#3f8a3a" : tipo === "tristan" ? "#4a4a48" : "#e8eef4";
  return (
    <g>
      <rect x={-3000} y={P - 20} width={9000} height={1600} fill={mar} />
      {Array.from({ length: 20 }).map((_, i) => <path key={i} d={`M${-2600 + i * 300 + Math.sin(f / 15 + i) * 30},${P + 40 + (i % 5) * 60} q40,-14 80,0 q40,14 80,0`} stroke={acl(mar, 0.35)} strokeWidth={5} fill="none" />)}
      {tipo === "tristan"
        ? <g><path d={`M200,${P} L1100,${P - 760} L1260,${P - 780} L2300,${P} Z`} fill={isla} /><path d={`M960,${P - 640} L1100,${P - 760} L1260,${P - 780} L1420,${P - 640} Q1300,${P - 600} 1180,${P - 660} Q1060,${P - 600} 960,${P - 640} Z`} fill="#f4f6fa" /><rect x={300} y={P - 60} width={1800} height={60} fill="#5a7a4a" /></g>
        : <g><path d={`M300,${P} Q500,${P - 520} 1100,${P - 600} Q1700,${P - 560} 2100,${P} Z`} fill={isla} />
          {trop && Array.from({ length: 7 }).map((_, i) => <g key={i} transform={`translate(${520 + i * 220},${P - 60 - Math.sin(i / 2) * 120})`}><path d="M0,0 q10,-80 0,-160" stroke="#6a4a2a" strokeWidth={10} fill="none" />{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M0,-160 q${-60 + k * 30},${-30 + Math.abs(k - 2) * 12} ${-100 + k * 50},${10 + Math.abs(k - 2) * 20}`} stroke="#2f7a2a" strokeWidth={12} fill="none" strokeLinecap="round" />)}</g>)}
          {tipo === "lobos" && Array.from({ length: 12 }).map((_, i) => <Arbol key={i} x={500 + i * 130} y={P - 40 - Math.sin(i / 3.5) * 300} s={0.7} copa="#2f4a40" tipo="pino" />)}
        </g>}
      <path d={`M300,${P} Q1200,${P - 40} 2100,${P} Z`} fill={trop ? "#e8d8a0" : tipo === "lobos" ? "#f4f6fa" : "#6a6a60"} />
      {casitas > 0 && Array.from({ length: Math.round(8 * casitas) }).map((_, i) => <Casita key={i} x={(tipo === "tristan" ? 500 : 700) + i * 150} y={P - 30} w={110} h={80} color={["#f2efe6", "#e8d8b8", "#c8d8e0"][i % 3]} techo={tipo === "tristan" ? "#3a4a5a" : "#8a3a2a"} seed={i} />)}
      {barco >= 0 && (tipo === "tristan" || tipo === "hoy" ? <g transform={`translate(${lerp(3600, 2500, barco)},${P + 30}) scale(0.6)`}><path d="M-260,-40 L260,-40 L230,20 L-230,20 Z" fill="#3a3a44" /><rect x={-60} y={-120} width={160} height={80} fill="#e8e4da" /><rect x={20} y={-170} width={30} height={50} fill="#c0352c" /></g> : <Velero x={lerp(3400, 2500, barco)} y={P + 20} s={0.7} />)}
    </g>
  );
};

// ---------------------------------------------------------------- IGLESIA POR DENTRO (La Pointe)
export const IG_PISO = 900;
export const IG_PUNTOS = { puerta: 200, bancos: 1100, frente: 2300, pizarra: 2450, tablero: 3000 };
type PIg = SetProps & { luz?: number; plan?: number; hilos?: number; tarjetas?: number; nombres?: number };
export const IglesiaDentro: React.FC<PIg> = ({ capa, f, luz = 1, plan = 0, hilos = 0, tarjetas = 0, nombres = 0 }) => {
  const P = IG_PISO;
  const pared = "#e8e0cf";
  if (capa === "lejos") return <g><rect x={-3000} y={-2000} width={9000} height={5000} fill="#3a3430" /></g>;
  if (capa === "frente") return <g />;
  const tarj = Array.from({ length: 18 }).map((_, i) => ({ x: IG_PUNTOS.tablero - 260 + (i % 6) * 100, y: 260 + Math.floor(i / 6) * 120 }));
  return (
    <g>
      <rect x={-2000} y={-1200} width={7000} height={P + 1200} fill={pared} />
      {[600, 1300, 2000].map((x, i) => <g key={i}><path d={`M${x - 60},420 v-160 a60,60 0 0 1 120,0 v160 Z`} fill="#6a8ab0" /><path d={`M${x},200 v220 M${x - 60},330 h120`} stroke="#c8b070" strokeWidth={6} /><Halo x={x} y={330} r={260} color="#fff4d0" fuerza={0.25 * luz} /></g>)}
      <rect x={-2000} y={P - 160} width={7000} height={160} fill="#c8b898" />
      {/* pizarra con PLAN */}
      <g transform={`translate(${IG_PUNTOS.pizarra},${P - 520})`}><rect x={-200} y={0} width={400} height={260} fill="#2a3a30" stroke="#6a4a30" strokeWidth={14} />
        {plan > 0 && <text x={0} y={150} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={110} fill="#f2ead8">{"PLAN".slice(0, Math.ceil(4 * plan))}</text>}
      </g>
      {/* tablero de tarjetas con hilos (registro de familias) */}
      <g>
        <rect x={IG_PUNTOS.tablero - 320} y={200} width={640} height={400} fill="#b8946a" stroke="#6a4a30" strokeWidth={12} />
        {tarj.map((t, i) => i < tarjetas * 18 && <g key={i}><rect x={t.x - 36} y={t.y - 26} width={72} height={52} fill="#f2ead8" /><circle cx={t.x} cy={t.y - 20} r={5} fill="#c0352c" /><rect x={t.x - 24} y={t.y - 6} width={48} height={4} fill="#8a7a6a" /><rect x={t.x - 24} y={t.y + 6} width={34} height={4} fill="#8a7a6a" /></g>)}
        {hilos > 0 && [[0, 7], [1, 8], [7, 13], [2, 9], [9, 15], [4, 10], [10, 16], [3, 8], [5, 11]].map(([a, b], i) => i < hilos * 9 && <path key={i} d={`M${tarj[a].x},${tarj[a].y - 20} L${tarj[b].x},${tarj[b].y - 20}`} stroke="#c0352c" strokeWidth={3} />)}
      </g>
      {/* lista de nombres en la cartelera de la puerta */}
      <g transform={`translate(${IG_PUNTOS.puerta + 260},${P - 560})`}><rect x={-110} y={0} width={220} height={300} fill="#f2ead8" stroke="#6a4a30" strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => i < nombres * 12 && <rect key={i} x={-90} y={20 + i * 22} width={100 + ((i * 37) % 70)} height={6} fill="#4a3a30" />)}
      </g>
      <g transform={`translate(${IG_PUNTOS.puerta},${P})`}><path d="M-110,0 v-360 a110,110 0 0 1 220,0 v360 Z" fill="#6a4a30" /></g>
      <rect x={-2000} y={P} width={7000} height={1600} fill="#7a5a3e" />
      {Array.from({ length: 36 }).map((_, i) => <rect key={i} x={-2000 + i * 200} y={P} width={3} height={1600} fill="#5a4030" />)}
    </g>
  );
};
// bancos de la iglesia (van en `frente` del plano, delante de la gente sentada)
export const Bancos: React.FC<{ x0?: number; n?: number; piso?: number }> = ({ x0 = 700, n = 6, piso = 900 }) => (
  <g>{Array.from({ length: n }).map((_, i) => <g key={i} transform={`translate(${x0 + i * 260},${piso})`}><rect x={-110} y={-120} width={220} height={20} fill="#6a4a30" /><rect x={-110} y={-200} width={16} height={200} fill="#5a3e28" /><rect x={94} y={-120} width={16} height={120} fill="#5a3e28" /></g>)}</g>
);

// ---------------------------------------------------------------- LAGO ABIERTO (olas, tormenta, el fondo con barcos hundidos)
// superficie en LA_SUP; bajo el agua hasta y≈2600 (la cámara baja con mira y > 1500).
export const LA_SUP = 760;
type PLA = SetProps & { ola?: number; hora?: Hora; hundidos?: number; costa?: boolean; carguero?: number; ferry?: number };
export const LagoAbierto: React.FC<PLA> = ({ capa, f, ola = 0.3, hora = "tormenta", hundidos = 0, costa = true, carguero = -1, ferry = -1 }) => {
  const L = LUCES[hora];
  const S = LA_SUP;
  const A = 20 + ola * 140;
  if (capa === "lejos") return <g><Cielo c={L.cielo} y={-1200} h={S + 1300} />{hora === "tormenta" && Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={-400 + i * 700 + ((f * 2) % 700)} cy={80 + (i % 2) * 90} rx={420} ry={90} fill="#1a2232" opacity={0.7} />)}</g>;
  if (capa === "frente") return <g>{hora === "tormenta" && Array.from({ length: 80 }).map((_, i) => <path key={i} d={`M${((i * 173 + f * 22) % 4000) - 1000},${((i * 97 + f * 40) % 1400) - 300} l-16,40`} stroke="#c9d3e2" strokeWidth={2} opacity={0.4} />)}</g>;
  const onda = (y: number, a: number, fase: number, k = 1) => {
    let d = `M-3000,${y}`;
    for (let x = -3000; x <= 6000; x += 60) d += ` L${x},${y + Math.sin(x / (160 * k) + f / 9 + fase) * a}`;
    return d + ` L6000,${y + 700} L-3000,${y + 700} Z`;
  };
  return (
    <g>
      {/* fondo del lago con los barcos hundidos en fila hacia la oscuridad */}
      <rect x={-3000} y={S} width={9000} height={3000} fill={L.lago[1]} />
      <rect x={-3000} y={S + 900} width={9000} height={2400} fill={osc(L.lago[1], 0.55)} />
      <path d={`M-3000,2500 Q0,2380 1500,2460 Q3000,2540 6000,2420 L6000,4000 L-3000,4000 Z`} fill="#0c1018" />
      {hundidos > 0 && Array.from({ length: 7 }).map((_, i) => <g key={i} transform={`translate(${-400 + i * 620},${2440 + (i % 2) * 30}) rotate(${(i % 3 - 1) * 8}) scale(${1 - i * 0.08})`} opacity={hundidos * (1 - i * 0.1)}><path d="M-300,-40 L300,-40 L330,0 L-320,0 Z" fill="#3e4e66" /><rect x={-260} y={-90} width={70} height={50} fill="#3e4e66" /><rect x={200} y={-110} width={70} height={70} fill="#3e4e66" /></g>)}
      {hundidos > 0 && Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={-200 + i * 300 + Math.sin(f / 12 + i) * 20} cy={2300 - ((f * 1.5 + i * 90) % 1300)} r={5} fill="#5a7aa8" opacity={0.4 * hundidos} />)}
      {/* costa rocosa a la derecha */}
      {costa && <path d={`M2600,${S + 60} L2700,${S - 160} L2860,${S - 220} L3000,${S - 140} L3200,${S - 260} L3500,${S - 200} L3500,${S + 600} L2600,${S + 600} Z`} fill="#3a3a40" />}
      {carguero >= 0 && <Carguero x={lerp(-600, 2200, carguero)} y={S - 20 + Math.sin(f / 9) * A * 0.4} s={0.7} luz={1} />}
      {ferry >= 0 && <Ferry x={lerp(-800, 2600, ferry)} y={S + Math.sin(f / 12) * 8} s={0.9} />}
      <path d={onda(S, A, 0)} fill={L.lago[0]} />
      <path d={onda(S + 40, A * 0.7, 2, 0.7)} fill={mezclar(L.lago[0], L.lago[1], 0.4)} opacity={0.9} />
      {ola > 0.5 && Array.from({ length: 12 }).map((_, i) => { const x = -1200 + i * 420 + ((f * 3) % 420); return <path key={i} d={`M${x},${S - A * 0.8} q40,-40 90,-10 q-30,0 -40,30`} fill="#e8eef6" opacity={0.85} />; })}
      {costa && ola > 0.5 && Array.from({ length: 6 }).map((_, i) => { const u = ((f / 20 + i / 6) % 1); return <circle key={i} cx={2640 + i * 40} cy={S - u * 280} r={20 + u * 30} fill="#f2f6fa" opacity={(1 - u) * 0.8} />; })}
    </g>
  );
};
