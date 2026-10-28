// UTILERÍA: cualquier objeto que nombre la voz, dibujado en el SEGUNDO en que lo nombra.
//   <Prop name="aguja" x={1220} y={COCINA_PISO - 180} desde={84} />        ← entra animado (pop / cae / desliza / sube)
//   <Prop name="coat" ... />  también acepta el nombre en inglés (ALIAS) y plurales ("needles" → aguja)
//   sfxProp("aguja", 84) → Cue[] con el foley de la entrada (pop + el sonido propio del objeto)
// Vector plano coherente con el kit: rellenos planos, UNA sombra (osc) y UN brillo (acl), sin trazos negros gruesos.
// Cada dibujo apoya en y = 0 (base, centro en x = 0) y mide ~60-170 px: x/y del Prop = el punto donde se apoya.
// `centro` = x/y es el centro del objeto (para la mano o el Inserto). Catálogo completo: comp «Ut-Catalogo».
import React from "react";
import { interpolate, spring } from "remotion";
import { useF } from "./camara";
import { cue, Cue } from "./explica/comun";
import { F_HUD } from "./pantalla";
import { acl, osc } from "./sets/comun";

type Dib = (c: string, f: number) => React.ReactNode;
type Def = { h: number; w: number; c: string; sfx: string; cat: string; d: Dib };
const D = (cat: string, h: number, w: number, c: string, sfx: string, d: Dib): Def => ({ cat, h, w, c, sfx, d });
const MAD = "#a4643a", MET = "#9aa3a8", OSC = "#2b2b30", PAP = "#fbf7ee", ORO = "#f1c24a";

export const UTILERIA: Record<string, Def> = {
  // ---------------- ROPA ----------------
  abrigo: D("ropa", 140, 160, "#8a5a3a", "paper", (c) => (
    <g>
      <path d="M-48,-126 L-70,-118 L-84,-30 L-64,-26 L-54,-90 Z M48,-126 L70,-118 L84,-30 L64,-26 L54,-90 Z" fill={osc(c, 0.82)} />
      <path d="M-34,-138 L34,-138 L50,-126 L52,0 L-52,0 L-50,-126 Z" fill={c} />
      <path d="M-14,-138 L0,-104 L14,-138 Z" fill="#f1ece2" />
      <path d="M-34,-138 L0,-78 L34,-138 L22,-140 L0,-100 L-22,-140 Z" fill={osc(c, 0.68)} />
      <line x1={0} y1={-80} x2={0} y2={0} stroke={osc(c, 0.65)} strokeWidth={3} />
      {[-62, -40, -18].map((y) => <circle key={y} cx={8} cy={y} r={4.5} fill={osc(c, 0.5)} />)}
      <rect x={-42} y={-44} width={24} height={5} rx={2} fill={osc(c, 0.65)} /><rect x={18} y={-44} width={24} height={5} rx={2} fill={osc(c, 0.65)} />
      <path d="M-50,-120 L-44,-10" stroke={acl(c, 0.18)} strokeWidth={4} strokeLinecap="round" />
    </g>
  )),
  sombrero: D("ropa", 64, 130, "#5a4636", "paper", (c) => (
    <g>
      <ellipse cx={0} cy={-12} rx={64} ry={12} fill={osc(c, 0.85)} />
      <path d="M-36,-14 Q-40,-58 -20,-62 Q0,-52 20,-62 Q40,-58 36,-14 Z" fill={c} />
      <rect x={-37} y={-28} width={74} height={12} fill={osc(c, 0.45)} />
      <path d="M-10,-56 Q0,-46 10,-56" stroke={osc(c, 0.7)} strokeWidth={3} fill="none" />
      <path d="M-30,-22 Q-32,-48 -20,-56" stroke={acl(c, 0.2)} strokeWidth={3} fill="none" />
    </g>
  )),
  bota: D("ropa", 96, 110, "#6b4a33", "step", (c) => (
    <g>
      <path d="M-24,-96 L16,-96 L18,-36 Q20,-26 40,-22 Q64,-18 64,-6 L64,0 L-26,0 Z" fill={c} />
      <rect x={-26} y={-9} width={90} height={9} rx={3} fill={osc(c, 0.45)} />
      <rect x={-28} y={-100} width={48} height={10} rx={4} fill={osc(c, 0.7)} />
      {[-82, -68, -54, -40].map((y) => <line key={y} x1={2} y1={y} x2={16} y2={y + 4} stroke={acl(c, 0.45)} strokeWidth={3} strokeLinecap="round" />)}
      <path d="M-18,-88 L-18,-14" stroke={acl(c, 0.15)} strokeWidth={4} strokeLinecap="round" />
    </g>
  )),
  camiseta: D("ropa", 104, 120, "#e0563a", "paper", (c) => (
    <g>
      <path d="M-26,-102 Q0,-90 26,-102 L60,-86 L48,-58 L35,-64 L35,0 L-35,0 L-35,-64 L-48,-58 L-60,-86 Z" fill={c} />
      <path d="M-26,-102 Q0,-82 26,-102" stroke={osc(c, 0.7)} strokeWidth={5} fill="none" />
      <path d="M-35,-64 L-35,0" stroke={osc(c, 0.8)} strokeWidth={4} />
      <path d="M-28,-60 L-28,-8" stroke={acl(c, 0.2)} strokeWidth={4} strokeLinecap="round" />
    </g>
  )),
  bufanda: D("ropa", 110, 120, "#d8382c", "paper", (c) => (
    <g>
      <path d="M-54,-100 Q0,-80 54,-100 L54,-80 Q0,-60 -54,-80 Z" fill={c} />
      <path d="M18,-84 L36,-84 L44,-16 L26,-16 Z" fill={osc(c, 0.85)} />
      {[-66, -48, -30].map((y) => <path key={y} d={`M${21 + (y + 84) * 0.06},${y} L${39 + (y + 84) * 0.1},${y}`} stroke="#f1ece2" strokeWidth={5} />)}
      {[0, 1, 2, 3].map((k) => <line key={k} x1={28 + k * 5} y1={-16} x2={28 + k * 5} y2={-2} stroke={c} strokeWidth={3} strokeLinecap="round" />)}
      {[-30, 0, 30].map((x) => <path key={x} d={`M${x},${-93 + Math.abs(x) * 0.12} L${x},${-75 + Math.abs(x) * 0.12}`} stroke="#f1ece2" strokeWidth={6} />)}
    </g>
  )),
  guante: D("ropa", 86, 90, "#5aa0d8", "paper", (c) => (
    <g>
      <path d="M-26,0 L-26,-58 Q-26,-86 0,-86 Q26,-86 26,-58 L26,0 Z" fill={c} />
      <path d="M-24,-40 Q-48,-46 -44,-64 Q-38,-76 -24,-60 Z" fill={osc(c, 0.88)} />
      <rect x={-30} y={-16} width={60} height={16} rx={4} fill={osc(c, 0.7)} />
      {[-18, -6, 6, 18].map((x) => <line key={x} x1={x} y1={-14} x2={x} y2={-2} stroke={osc(c, 0.55)} strokeWidth={3} />)}
      <path d="M14,-74 Q20,-60 18,-30" stroke={acl(c, 0.3)} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  )),
  gorro: D("ropa", 92, 100, "#3f8a5a", "paper", (c) => (
    <g>
      <path d="M-44,-22 Q-44,-76 0,-76 Q44,-76 44,-22 Z" fill={c} />
      {[-20, 0, 20].map((x) => <path key={x} d={`M${x},-74 L${x * 1.5},-24`} stroke={osc(c, 0.8)} strokeWidth={3} />)}
      <rect x={-48} y={-26} width={96} height={26} rx={9} fill={osc(c, 0.78)} />
      <circle cx={0} cy={-78} r={15} fill={acl(c, 0.45)} />
    </g>
  )),
  anteojos: D("ropa", 46, 130, "#2a2420", "click", (c) => (
    <g>
      {[-28, 28].map((x) => <circle key={x} cx={x} cy={-22} r={20} fill="#dff3ff" fillOpacity={0.35} stroke={c} strokeWidth={6} />)}
      <path d="M-8,-26 Q0,-34 8,-26" stroke={c} strokeWidth={5} fill="none" />
      <path d="M-48,-26 L-62,-34 M48,-26 L62,-34" stroke={c} strokeWidth={5} strokeLinecap="round" />
      <path d="M-36,-32 L-26,-38 M20,-32 L30,-38" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    </g>
  )),

  // ---------------- HERRAMIENTAS ----------------
  aguja: D("herramientas", 120, 120, "#d8382c", "metal", (c) => (
    <g>
      <path d="M2,-104 Q44,-142 52,-92 Q58,-52 26,-40 Q6,-34 10,-16" stroke={c} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      <g transform="rotate(32)">
        <path d="M-4,-122 Q0,-128 4,-122 L4,-14 L0,6 L-4,-14 Z" fill="#c8d0d6" />
        <ellipse cx={0} cy={-110} rx={1.8} ry={7} fill={OSC} />
        <line x1={-1.5} y1={-96} x2={-1.5} y2={-20} stroke="#fff" strokeWidth={1.6} />
      </g>
    </g>
  )),
  estaca: D("herramientas", 150, 70, "#b07a48", "hit", (c) => (
    <g transform="rotate(14)">
      <path d="M-11,-152 L11,-152 L11,-42 L0,0 L-11,-42 Z" fill={c} />
      <path d="M0,-42 L11,-42 L0,0 Z M3,-152 L11,-152 L11,-42 L3,-42 Z" fill={osc(c, 0.78)} />
      <rect x={-13} y={-156} width={26} height={10} rx={3} fill={osc(c, 0.62)} />
      <path d="M-5,-136 L-5,-104 M-3,-90 L-3,-60" stroke={osc(c, 0.6)} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  )),
  cuerda: D("herramientas", 84, 140, "#c9a36a", "paper", (c) => (
    <g>
      {[[0, -18, 58, 18], [0, -38, 52, 16], [0, -58, 44, 14]].map(([x, y, rx, ry], i) => (
        <g key={i}><ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={osc(c, 0.82)} strokeWidth={13} />
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={acl(c, 0.2)} strokeWidth={13} strokeDasharray="5 9" /></g>
      ))}
      <path d="M44,-56 Q76,-40 70,-8 Q66,6 82,6" stroke={c} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d="M44,-56 Q76,-40 70,-8 Q66,6 82,6" stroke={osc(c, 0.7)} strokeWidth={12} fill="none" strokeDasharray="4 10" />
    </g>
  )),
  martillo: D("herramientas", 128, 80, MAD, "metal", (c) => (
    <g>
      <rect x={-6} y={-112} width={13} height={112} rx={6} fill={c} />
      <rect x={-6} y={-40} width={13} height={40} rx={6} fill={osc(c, 0.7)} />
      <path d="M-30,-126 L22,-126 L22,-100 L-30,-100 Q-38,-113 -30,-126 Z" fill="#6b7178" />
      <path d="M22,-126 Q44,-130 50,-112 Q38,-118 22,-108 Z" fill="#6b7178" />
      <rect x={-28} y={-124} width={46} height={6} rx={3} fill={acl("#6b7178", 0.35)} />
    </g>
  )),
  llaveInglesa: D("herramientas", 140, 70, MET, "metal", (c) => (
    <g transform="rotate(22)">
      <rect x={-8} y={-104} width={16} height={104} rx={8} fill={c} />
      <path d="M-24,-100 L-24,-136 L-9,-136 L-9,-114 L9,-114 L9,-136 L24,-136 L24,-100 Q0,-86 -24,-100 Z" fill={c} />
      <rect x={-3} y={-90} width={4} height={80} rx={2} fill={acl(c, 0.4)} />
      <circle cx={0} cy={-14} r={4} fill={osc(c, 0.6)} />
    </g>
  )),
  destornillador: D("herramientas", 134, 40, ORO, "click", (c) => (
    <g>
      <rect x={-4} y={-76} width={8} height={70} fill="#c8d0d6" />
      <path d="M-4,-8 L4,-8 L1.5,0 L-1.5,0 Z" fill="#9aa3a8" />
      <rect x={-13} y={-134} width={26} height={60} rx={11} fill={c} />
      {[-6, 0, 6].map((x) => <line key={x} x1={x} y1={-126} x2={x} y2={-84} stroke={osc(c, 0.75)} strokeWidth={3} strokeLinecap="round" />)}
      <rect x={-15} y={-80} width={30} height={8} rx={3} fill={OSC} />
    </g>
  )),
  serrucho: D("herramientas", 72, 160, "#c8d0d6", "metal", (c) => (
    <g>
      <path d="M-36,-62 L76,-38 L76,-10 L-36,-10 Z" fill={c} />
      <path d={`M-36,-10 ${Array.from({ length: 14 }).map((_, k) => `L${-32 + k * 8},-2 L${-28 + k * 8},-10`).join(" ")}`} fill={c} />
      <path d="M-30,-52 L70,-32" stroke="#fff" strokeWidth={3} opacity={0.7} />
      <path d="M-76,-70 L-34,-70 L-34,-4 L-76,-4 Q-84,-37 -76,-70 Z" fill={MAD} />
      <rect x={-66} y={-56} width={20} height={34} rx={9} fill={osc(MAD, 0.45)} />
    </g>
  )),
  linterna: D("herramientas", 52, 120, "#3a5a8a", "click", (c) => (
    <g>
      <path d="M50,-46 L150,-82 L150,32 L50,-2 Z" fill="#fff3c0" opacity={0.2} />
      <rect x={-58} y={-36} width={80} height={26} rx={8} fill={c} />
      <rect x={-52} y={-34} width={68} height={6} rx={3} fill={acl(c, 0.3)} />
      <path d="M20,-40 L46,-48 L46,0 L20,-6 Z" fill={osc(c, 0.75)} />
      <rect x={46} y={-48} width={6} height={48} rx={2} fill="#fff3c0" />
      <rect x={-20} y={-42} width={14} height={8} rx={3} fill={osc(c, 0.5)} />
    </g>
  )),
  tijeras: D("herramientas", 120, 90, "#d8382c", "click", (c) => (
    <g>
      <path d="M-4,-58 L-20,-120 L-12,-120 L6,-62 Z" fill="#c8d0d6" />
      <path d="M4,-58 L20,-120 L12,-120 L-6,-62 Z" fill="#dfe5e8" />
      <circle cx={0} cy={-60} r={4} fill={OSC} />
      <path d="M-4,-54 L-18,-34 M4,-54 L18,-34" stroke={c} strokeWidth={8} strokeLinecap="round" />
      <circle cx={-22} cy={-20} r={17} fill="none" stroke={c} strokeWidth={9} />
      <circle cx={22} cy={-20} r={17} fill="none" stroke={c} strokeWidth={9} />
    </g>
  )),
  clavo: D("herramientas", 94, 40, MET, "metal", (c) => (
    <g>
      <rect x={-16} y={-94} width={32} height={9} rx={3} fill={osc(c, 0.85)} />
      <rect x={-5} y={-86} width={10} height={74} fill={c} />
      <path d="M-5,-12 L5,-12 L0,0 Z" fill={c} />
      <line x1={-2} y1={-82} x2={-2} y2={-16} stroke="#fff" strokeWidth={2} opacity={0.7} />
    </g>
  )),
  pala: D("herramientas", 170, 70, "#8a949a", "metal", (c) => (
    <g>
      <rect x={-5} y={-164} width={10} height={112} fill={MAD} />
      <rect x={-20} y={-172} width={40} height={12} rx={6} fill={osc(MAD, 0.75)} />
      <path d="M-32,-56 L32,-56 L28,-16 Q0,8 -28,-16 Z" fill={c} />
      <path d="M-24,-50 L-20,-18" stroke={acl(c, 0.4)} strokeWidth={4} strokeLinecap="round" />
      <rect x={-8} y={-62} width={16} height={10} rx={2} fill={osc(c, 0.7)} />
    </g>
  )),
  hacha: D("herramientas", 150, 90, "#8a949a", "hit", (c) => (
    <g>
      <path d="M-4,0 Q-12,-70 0,-142" stroke={MAD} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d="M-6,-136 L36,-152 Q56,-122 38,-92 L-6,-108 Z" fill={c} />
      <path d="M36,-152 Q56,-122 38,-92 L32,-96 Q46,-122 30,-146 Z" fill={acl(c, 0.45)} />
      <rect x={-10} y={-140} width={14} height={36} rx={3} fill={osc(c, 0.7)} />
    </g>
  )),
  candado: D("herramientas", 96, 80, ORO, "click", (c) => (
    <g>
      <path d="M-22,-52 L-22,-72 Q-22,-96 0,-96 Q22,-96 22,-72 L22,-52" stroke={MET} strokeWidth={11} fill="none" />
      <rect x={-34} y={-58} width={68} height={58} rx={9} fill={c} />
      <rect x={-34} y={-58} width={68} height={10} rx={5} fill={acl(c, 0.3)} />
      <circle cx={0} cy={-32} r={7} fill={osc(c, 0.4)} /><rect x={-3} y={-30} width={6} height={16} rx={2} fill={osc(c, 0.4)} />
    </g>
  )),
  llave: D("herramientas", 44, 130, ORO, "coin", (c) => (
    <g>
      <circle cx={-40} cy={-22} r={20} fill={c} /><circle cx={-40} cy={-22} r={7} fill={osc(c, 0.55)} />
      <rect x={-22} y={-27} width={78} height={10} rx={3} fill={c} />
      <path d="M36,-17 L36,-6 L44,-6 L44,-12 L50,-12 L50,-4 L56,-4 L56,-17 Z" fill={c} />
      <line x1={-18} y1={-24} x2={50} y2={-24} stroke={acl(c, 0.45)} strokeWidth={2.5} />
    </g>
  )),
  cinta: D("herramientas", 72, 150, ORO, "click", (c) => (
    <g>
      <rect x={30} y={-14} width={66} height={12} fill="#fff3c0" />
      {Array.from({ length: 9 }).map((_, k) => <line key={k} x1={36 + k * 7} y1={-14} x2={36 + k * 7} y2={k % 2 ? -9 : -5} stroke={OSC} strokeWidth={1.6} />)}
      <rect x={94} y={-16} width={6} height={16} fill={MET} />
      <rect x={-40} y={-72} width={76} height={72} rx={20} fill={c} />
      <circle cx={-2} cy={-36} r={18} fill={osc(c, 0.75)} /><circle cx={-2} cy={-36} r={6} fill={OSC} />
      <rect x={-34} y={-66} width={30} height={7} rx={3} fill={acl(c, 0.35)} />
    </g>
  )),

  // ---------------- COCINA ----------------
  sarten: D("cocina", 40, 170, OSC, "metal", (c) => (
    <g>
      <rect x={38} y={-30} width={80} height={11} rx={5} fill={c} transform="rotate(-6 38 -24)" />
      <path d="M-66,-22 L-60,0 L40,0 L46,-22 Z" fill={osc(c, 0.8)} />
      <ellipse cx={-10} cy={-22} rx={56} ry={16} fill={c} />
      <ellipse cx={-10} cy={-21} rx={47} ry={11} fill={acl(c, 0.12)} />
    </g>
  )),
  olla: D("cocina", 96, 140, MET, "metal", (c, f) => (
    <g>
      {[0, 1].map((k) => <path key={k} d={`M${-12 + k * 22},-92 q8,-14 0,-28 q-8,-14 3,-28`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.28 + 0.18 * Math.sin(f / 9 + k * 2)} />)}
      <rect x={-64} y={-62} width={18} height={10} rx={5} fill={osc(c, 0.6)} /><rect x={46} y={-62} width={18} height={10} rx={5} fill={osc(c, 0.6)} />
      <rect x={-50} y={-74} width={100} height={74} rx={10} fill={c} />
      <ellipse cx={0} cy={-74} rx={52} ry={10} fill={acl(c, 0.3)} />
      <ellipse cx={0} cy={-73} rx={44} ry={6} fill={osc(c, 0.55)} />
      <rect x={-40} y={-62} width={8} height={54} rx={4} fill={acl(c, 0.35)} />
    </g>
  )),
  cuchillo: D("cocina", 30, 160, "#d4dade", "metal", (c) => (
    <g>
      <path d="M-10,-26 L72,-26 Q84,-22 72,-6 L-10,-6 Z" fill={c} />
      <line x1={-6} y1={-22} x2={68} y2={-22} stroke="#fff" strokeWidth={2.5} />
      <rect x={-74} y={-28} width={64} height={24} rx={7} fill="#4a3426" />
      {[-60, -40, -22].map((x) => <circle key={x} cx={x} cy={-16} r={3} fill={MET} />)}
    </g>
  )),
  tenedor: D("cocina", 140, 40, MET, "metal", (c) => (
    <g>
      <rect x={-5} y={-86} width={10} height={86} rx={5} fill={c} />
      <path d="M-17,-108 L17,-108 L14,-86 Q0,-80 -14,-86 Z" fill={c} />
      {[-17, -8, 1, 10].map((x) => <rect key={x} x={x} y={-140} width={6} height={36} rx={3} fill={c} />)}
      <line x1={-2} y1={-80} x2={-2} y2={-6} stroke="#fff" strokeWidth={2} opacity={0.7} />
    </g>
  )),
  cuchara: D("cocina", 140, 50, MET, "metal", (c) => (
    <g>
      <rect x={-5} y={-92} width={10} height={92} rx={5} fill={c} />
      <ellipse cx={0} cy={-114} rx={19} ry={27} fill={c} />
      <ellipse cx={-5} cy={-120} rx={6} ry={12} fill="#fff" opacity={0.6} />
    </g>
  )),
  plato: D("cocina", 32, 140, "#f4efe6", "metal", (c) => (
    <g>
      <path d="M-40,-8 L-30,0 L30,0 L40,-8 Z" fill={osc(c, 0.8)} />
      <ellipse cx={0} cy={-14} rx={68} ry={17} fill={c} stroke={osc(c, 0.72)} strokeWidth={3} />
      <ellipse cx={0} cy={-14} rx={58} ry={13} fill="none" stroke="#5aa0d8" strokeWidth={3} />
      <ellipse cx={0} cy={-14} rx={44} ry={9} fill={osc(c, 0.9)} />
      <path d="M-56,-20 Q-30,-28 0,-30" stroke="#fff" strokeWidth={3} fill="none" />
    </g>
  )),
  botella: D("cocina", 146, 70, "#5aa86a", "water", (c) => (
    <g>
      <path d="M-10,-134 L10,-134 L10,-110 Q34,-96 34,-70 L34,-6 Q34,0 28,0 L-28,0 Q-34,0 -34,-6 L-34,-70 Q-34,-96 -10,-110 Z" fill={c} fillOpacity={0.88} />
      <rect x={-12} y={-146} width={24} height={14} rx={3} fill={osc(c, 0.55)} />
      <rect x={-34} y={-62} width={68} height={34} fill="#f4efe6" />
      <rect x={-22} y={-52} width={44} height={6} rx={3} fill={c} />
      <rect x={-26} y={-92} width={7} height={86} rx={3} fill="#fff" opacity={0.45} />
    </g>
  )),
  tetera: D("cocina", 104, 150, "#e0563a", "water", (c) => (
    <g>
      <path d="M38,-46 Q66,-58 72,-88 L80,-86 Q76,-46 44,-26 Z" fill={c} />
      <path d="M-40,-78 Q-74,-66 -66,-40 Q-60,-24 -44,-28" stroke={osc(c, 0.7)} strokeWidth={9} fill="none" />
      <path d="M-46,0 L46,0 Q54,-40 40,-70 Q0,-92 -40,-70 Q-54,-40 -46,0 Z" fill={c} />
      <ellipse cx={0} cy={-76} rx={30} ry={8} fill={osc(c, 0.75)} /><circle cx={0} cy={-88} r={8} fill={osc(c, 0.6)} />
      <path d="M-30,-56 Q-36,-30 -28,-10" stroke={acl(c, 0.35)} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  )),
  tabla: D("cocina", 64, 160, "#c9935a", "hit", (c) => (
    <g>
      <rect x={-72} y={-64} width={144} height={60} rx={14} fill={c} />
      <rect x={-72} y={-8} width={144} height={8} rx={4} fill={osc(c, 0.7)} />
      <circle cx={50} cy={-46} r={8} fill={osc(c, 0.55)} />
      {[-48, -34, -20].map((y) => <path key={y} d={`M-60,${y} Q-10,${y - 6} 30,${y}`} stroke={osc(c, 0.82)} strokeWidth={2.5} fill="none" />)}
    </g>
  )),
  taza: D("cocina", 70, 100, "#f4efe6", "metal", (c, f) => (
    <g>
      {[0, 1].map((k) => <path key={k} d={`M${-8 + k * 14},-76 q7,-12 0,-24 q-7,-12 2,-24`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.3 + 0.18 * Math.sin(f / 9 + k * 2)} />)}
      <path d="M30,-56 Q56,-54 52,-32 Q48,-14 28,-16" stroke={osc(c, 0.85)} strokeWidth={9} fill="none" />
      <path d="M-34,-64 L34,-64 L30,-6 Q30,0 24,0 L-24,0 Q-30,0 -30,-6 Z" fill={c} />
      <ellipse cx={0} cy={-64} rx={34} ry={7} fill={osc(c, 0.8)} /><ellipse cx={0} cy={-63} rx={28} ry={4.5} fill="#6b3a24" />
      <rect x={-24} y={-52} width={7} height={42} rx={3} fill="#fff" opacity={0.55} />
      <path d="M-12,-36 q12,-12 24,0" stroke="#e0453a" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  )),
  vaso: D("cocina", 80, 60, "#7ec8ff", "water", (c) => (
    <g>
      <path d="M-24,-80 L24,-80 L19,0 L-19,0 Z" fill="#dff3ff" fillOpacity={0.5} />
      <path d="M-22,-50 L22,-50 L19,0 L-19,0 Z" fill={c} opacity={0.75} />
      <rect x={-18} y={-74} width={5} height={66} rx={2.5} fill="#fff" opacity={0.7} />
    </g>
  )),
  frasco: D("cocina", 104, 80, "#e0563a", "water", (c) => (
    <g>
      <rect x={-34} y={-86} width={68} height={86} rx={12} fill="#dff3ff" fillOpacity={0.45} />
      <rect x={-30} y={-58} width={60} height={54} rx={9} fill={c} />
      {[[-14, -38], [10, -26], [-4, -16], [16, -46]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill={acl(c, 0.3)} />)}
      <rect x={-37} y={-102} width={74} height={18} rx={5} fill={ORO} />
      <rect x={-26} y={-80} width={7} height={70} rx={3} fill="#fff" opacity={0.55} />
    </g>
  )),

  // ---------------- OFICINA Y TECNOLOGÍA ----------------
  lapiz: D("oficina", 22, 160, ORO, "write", (c) => (
    <g>
      <rect x={-62} y={-22} width={104} height={22} fill={c} />
      <rect x={-62} y={-22} width={104} height={7} fill={acl(c, 0.3)} />
      <path d="M42,-22 L74,-11 L42,0 Z" fill="#e8c9a0" /><path d="M64,-14.5 L74,-11 L64,-7.5 Z" fill={OSC} />
      <rect x={-72} y={-22} width={12} height={22} fill={MET} />
      <rect x={-86} y={-22} width={16} height={22} rx={5} fill="#ff8aa0" />
    </g>
  )),
  hoja: D("oficina", 124, 100, PAP, "paper", (c) => (
    <g>
      <path d="M-46,-124 L26,-124 L46,-104 L46,0 L-46,0 Z" fill={c} />
      <path d="M26,-124 L26,-104 L46,-104 Z" fill={osc(c, 0.85)} />
      {[-98, -82, -66, -50, -34, -18].map((y, i) => <line key={y} x1={-34} y1={y} x2={i % 2 ? 22 : 34} y2={y} stroke="#9ab0c8" strokeWidth={3} strokeLinecap="round" />)}
    </g>
  )),
  carpeta: D("oficina", 104, 140, ORO, "paper", (c) => (
    <g>
      <path d="M-66,-96 L-24,-96 L-14,-86 L66,-86 L66,0 L-66,0 Z" fill={osc(c, 0.82)} />
      <rect x={-54} y={-92} width={104} height={70} fill={PAP} transform="rotate(-3)" />
      <path d="M-70,-66 L70,-66 L64,0 L-64,0 Z" fill={c} />
      <rect x={-20} y={-44} width={40} height={14} rx={3} fill={PAP} />
    </g>
  )),
  sobre: D("oficina", 76, 140, "#f4efe6", "paper", (c) => (
    <g>
      <rect x={-64} y={-76} width={128} height={76} rx={4} fill={c} />
      <path d="M-64,0 L0,-38 L64,0" stroke={osc(c, 0.8)} strokeWidth={3} fill="none" />
      <path d="M-64,-76 L0,-30 L64,-76 Z" fill={osc(c, 0.9)} />
      <circle cx={0} cy={-34} r={11} fill="#d8382c" />
    </g>
  )),
  reloj: D("oficina", 120, 110, "#d8382c", "tick", (c, f) => (
    <g>
      <path d="M-36,-10 L-46,0 M36,-10 L46,0" stroke={OSC} strokeWidth={7} strokeLinecap="round" />
      <path d="M-46,-92 Q-50,-118 -24,-116 Z M46,-92 Q50,-118 24,-116 Z" fill={c} />
      <circle cx={0} cy={-58} r={48} fill={c} />
      <circle cx={0} cy={-58} r={38} fill="#fbf7ee" />
      {[0, 1, 2, 3].map((k) => <line key={k} x1={0} y1={-90} x2={0} y2={-84} stroke={OSC} strokeWidth={3} transform={`rotate(${k * 90} 0 -58)`} />)}
      <line x1={0} y1={-58} x2={0} y2={-84} stroke={OSC} strokeWidth={4} strokeLinecap="round" transform={`rotate(${f * 6} 0 -58)`} />
      <line x1={0} y1={-58} x2={16} y2={-58} stroke={OSC} strokeWidth={5} strokeLinecap="round" />
      <circle cx={0} cy={-58} r={4} fill={c} />
    </g>
  )),
  laptop: D("oficina", 96, 180, "#9aa3a8", "click", (c) => (
    <g>
      <rect x={-62} y={-96} width={124} height={80} rx={7} fill={OSC} />
      <rect x={-54} y={-88} width={108} height={64} rx={3} fill="#7ec8ff" />
      <rect x={-46} y={-80} width={50} height={8} rx={3} fill="#fff" opacity={0.7} />
      <rect x={-46} y={-66} width={80} height={6} rx={3} fill="#fff" opacity={0.45} />
      <rect x={-46} y={-54} width={64} height={6} rx={3} fill="#fff" opacity={0.45} />
      <path d="M-78,-16 L78,-16 L88,0 L-88,0 Z" fill={c} />
      <rect x={-18} y={-10} width={36} height={5} rx={2} fill={osc(c, 0.7)} />
    </g>
  )),
  calculadora: D("oficina", 114, 80, "#3a3a40", "click", (c) => (
    <g>
      <rect x={-38} y={-114} width={76} height={114} rx={9} fill={c} />
      <rect x={-28} y={-104} width={56} height={24} rx={3} fill="#b8d8a0" />
      <text x={22} y={-86} textAnchor="end" fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#2a3a20">1,250</text>
      {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={-28 + (k % 3) * 20} y={-72 + Math.floor(k / 3) * 17} width={16} height={12} rx={3} fill={k === 11 ? "#f05a1f" : acl(c, 0.35)} />)}
    </g>
  )),
  celular: D("tecnologia", 146, 80, "#7ec8ff", "click", (c) => (
    <g>
      <rect x={-38} y={-146} width={76} height={146} rx={13} fill="#15151a" />
      <rect x={-32} y={-136} width={64} height={124} rx={7} fill={c} />
      <rect x={-10} y={-142} width={20} height={4} rx={2} fill="#3a3a44" />
      {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={-24 + (k % 3) * 18} y={-118 + Math.floor(k / 3) * 20} width={12} height={12} rx={3} fill={["#ffd27a", "#ff8aa0", "#7fc46a", "#fff"][k % 4]} opacity={0.9} />)}
      <rect x={-24} y={-48} width={48} height={22} rx={6} fill="#fff" opacity={0.8} />
      <rect x={-14} y={-8} width={28} height={3} rx={1.5} fill="#fff" opacity={0.6} />
    </g>
  )),
  control: D("tecnologia", 134, 50, OSC, "click", (c) => (
    <g>
      <rect x={-20} y={-134} width={40} height={134} rx={13} fill={c} />
      <circle cx={0} cy={-114} r={7} fill="#e0453a" />
      {Array.from({ length: 9 }).map((_, k) => <rect key={k} x={-13 + (k % 3) * 10} y={-94 + Math.floor(k / 3) * 12} width={6} height={7} rx={2} fill={acl(c, 0.45)} />)}
      <circle cx={0} cy={-36} r={12} fill={acl(c, 0.25)} /><circle cx={0} cy={-36} r={4} fill={acl(c, 0.5)} />
    </g>
  )),
  camara: D("tecnologia", 84, 140, OSC, "click", (c) => (
    <g>
      <path d="M-26,-72 L-16,-84 L16,-84 L26,-72 Z" fill={osc(c, 0.8)} />
      <rect x={-62} y={-72} width={124} height={72} rx={11} fill={c} />
      <rect x={-62} y={-50} width={124} height={8} fill={acl(c, 0.2)} />
      <circle cx={0} cy={-36} r={28} fill={acl(c, 0.25)} /><circle cx={0} cy={-36} r={19} fill="#1a2a3a" /><circle cx={-6} cy={-42} r={5} fill="#9fd6ff" />
      <rect x={38} y={-66} width={16} height={10} rx={2} fill="#fff3c0" />
      <rect x={-54} y={-82} width={16} height={10} rx={3} fill="#e0453a" />
    </g>
  )),
  radio: D("tecnologia", 96, 150, "#d8382c", "click", (c) => (
    <g>
      <line x1={40} y1={-78} x2={70} y2={-134} stroke={MET} strokeWidth={4} strokeLinecap="round" />
      <rect x={-68} y={-80} width={136} height={80} rx={13} fill={c} />
      <circle cx={-28} cy={-40} r={26} fill={osc(c, 0.6)} />
      {Array.from({ length: 13 }).map((_, k) => <circle key={k} cx={-28 + Math.cos(k * 2.4) * (k % 3) * 8} cy={-40 + Math.sin(k * 2.4) * (k % 3) * 8} r={3} fill={osc(c, 0.4)} />)}
      <rect x={10} y={-62} width={46} height={18} rx={3} fill="#fff3c0" /><line x1={30} y1={-60} x2={30} y2={-46} stroke="#d8382c" strokeWidth={2} />
      <circle cx={20} cy={-24} r={8} fill={acl(c, 0.4)} /><circle cx={46} cy={-24} r={8} fill={acl(c, 0.4)} />
    </g>
  )),
  lampara: D("oficina", 146, 120, "#3f8a5a", "click", (c) => (
    <g>
      <circle cx={40} cy={-86} r={46} fill="#fff3c0" opacity={0.18} />
      <ellipse cx={0} cy={-6} rx={40} ry={8} fill={osc(c, 0.7)} />
      <path d="M-4,-8 L-20,-80 L30,-118" stroke={osc(c, 0.85)} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M18,-140 L62,-110 L46,-84 L6,-118 Z" fill={c} />
      <ellipse cx={54} cy={-97} rx={14} ry={7} fill="#fff3c0" transform="rotate(34 54 -97)" />
    </g>
  )),
  bateria: D("tecnologia", 100, 60, ORO, "click", (c) => (
    <g>
      <rect x={-8} y={-100} width={16} height={10} rx={2} fill={MET} />
      <rect x={-26} y={-92} width={52} height={92} rx={8} fill={OSC} />
      <rect x={-26} y={-92} width={52} height={34} rx={8} fill={c} />
      <path d="M-6,-75 L6,-75 M0,-81 L0,-69" stroke={OSC} strokeWidth={4} strokeLinecap="round" />
      <rect x={-20} y={-54} width={6} height={48} rx={3} fill="#fff" opacity={0.25} />
    </g>
  )),

  // ---------------- COMIDA ----------------
  manzana: D("comida", 96, 110, "#e0453a", "pop", (c) => (
    <g>
      <path d="M0,-72 C-30,-92 -58,-66 -52,-36 C-46,-6 -18,6 0,-6 C18,6 46,-6 52,-36 C58,-66 30,-92 0,-72 Z" fill={c} />
      <path d="M0,-72 L4,-94" stroke="#5a3a26" strokeWidth={5} strokeLinecap="round" />
      <path d="M6,-88 Q26,-104 36,-86 Q18,-78 6,-88 Z" fill="#5aa86a" />
      <ellipse cx={-26} cy={-50} rx={8} ry={14} fill="#fff" opacity={0.4} transform="rotate(20 -26 -50)" />
    </g>
  )),
  banana: D("comida", 62, 150, "#f6d04a", "pop", (c) => (
    <g>
      <path d="M-66,-50 Q-10,16 62,-46 L70,-40 Q-6,30 -70,-42 Z" fill={c} />
      <path d="M-62,-44 Q-8,12 56,-40" stroke={osc(c, 0.8)} strokeWidth={4} fill="none" />
      <circle cx={-68} cy={-48} r={5} fill="#5a3a26" /><rect x={62} y={-50} width={10} height={9} rx={2} fill="#5a3a26" />
    </g>
  )),
  pan: D("comida", 74, 150, "#d79a52", "pop", (c) => (
    <g>
      <path d="M-68,0 L-68,-36 Q-68,-74 0,-74 Q68,-74 68,-36 L68,0 Z" fill={c} />
      <path d="M-68,-10 L68,-10 L68,0 L-68,0 Z" fill={osc(c, 0.8)} />
      {[-34, 0, 34].map((x) => <path key={x} d={`M${x - 12},-48 Q${x},-62 ${x + 12},-56`} stroke={acl(c, 0.4)} strokeWidth={6} fill="none" strokeLinecap="round" />)}
    </g>
  )),
  queso: D("comida", 72, 140, "#f6c84a", "pop", (c) => (
    <g>
      <path d="M-62,0 L62,0 L62,-48 L-62,-30 Z" fill={c} />
      <path d="M-62,-30 L62,-48 L36,-72 Z" fill={acl(c, 0.35)} />
      {[[-34, -14, 9], [6, -24, 6], [36, -12, 10], [-6, -8, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={osc(c, 0.75)} />)}
    </g>
  )),
  huevo: D("comida", 84, 80, "#f4efe6", "pop", (c) => (
    <g>
      <path d="M0,-84 C30,-84 42,-32 38,-16 C32,4 -32,4 -38,-16 C-42,-32 -30,-84 0,-84 Z" fill={c} />
      <path d="M14,-80 C34,-70 42,-32 38,-16 C32,4 -10,6 -26,-4 C6,-6 24,-30 14,-80 Z" fill={osc(c, 0.82)} />
      <ellipse cx={-14} cy={-56} rx={7} ry={13} fill="#fff" opacity={0.75} transform="rotate(18 -14 -56)" />
      <path d="M-34,-14 C-24,0 24,0 34,-14" stroke={osc(c, 0.85)} strokeWidth={5} fill="none" />
    </g>
  )),
  pizza: D("comida", 120, 120, "#f2c35a", "pop", (c) => (
    <g>
      <path d="M-52,-112 Q0,-126 52,-112 L0,0 Z" fill={c} />
      <path d="M-56,-110 Q0,-130 56,-110 L52,-100 Q0,-116 -52,-100 Z" fill="#c9843a" />
      {[[-16, -84], [14, -70], [-4, -44], [20, -98]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#c8402e" />)}
      <path d="M-30,-60 q4,10 -2,18" stroke={acl(c, 0.4)} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  )),
  hamburguesa: D("comida", 100, 130, "#e0a050", "pop", (c) => (
    <g>
      <rect x={-56} y={-20} width={112} height={20} rx={9} fill={c} />
      <rect x={-60} y={-38} width={120} height={20} rx={10} fill="#6b3a24" />
      <path d="M-58,-40 L58,-40 L48,-28 L30,-36 L10,-26 L-12,-36 L-34,-26 L-58,-34 Z" fill="#f6c84a" />
      <path d="M-62,-46 Q-40,-36 -20,-46 Q0,-36 20,-46 Q40,-36 62,-46 L60,-52 L-60,-52 Z" fill="#5aa86a" />
      <path d="M-58,-52 Q-58,-100 0,-100 Q58,-100 58,-52 Z" fill={c} />
      {[[-24, -80], [6, -88], [28, -74], [-4, -70]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={4} ry={2.5} fill="#fff3d0" />)}
    </g>
  )),
  zanahoria: D("comida", 130, 70, "#f07a2a", "pop", (c) => (
    <g>
      {[-14, 0, 14].map((a) => <path key={a} d="M0,-104 Q-6,-124 0,-140 Q6,-124 0,-104 Z" fill="#5aa86a" transform={`rotate(${a} 0 -104)`} />)}
      <path d="M-18,-104 Q0,-110 18,-104 L2,0 L-2,0 Z" fill={c} />
      {[-82, -60, -38].map((y) => <line key={y} x1={-10} y1={y} x2={0} y2={y + 3} stroke={osc(c, 0.75)} strokeWidth={3} strokeLinecap="round" />)}
    </g>
  )),
  pescado: D("comida", 60, 160, "#7fa8c4", "water", (c) => (
    <g>
      <path d="M-66,-30 Q-20,-64 40,-30 Q-20,4 -66,-30 Z" fill={c} />
      <path d="M38,-30 L74,-56 L66,-30 L74,-4 Z" fill={osc(c, 0.8)} />
      <path d="M-30,-30 Q-10,-40 14,-30" stroke={acl(c, 0.4)} strokeWidth={4} fill="none" />
      <circle cx={-48} cy={-34} r={5} fill="#fff" /><circle cx={-48} cy={-34} r={2.5} fill={OSC} />
    </g>
  )),
  dona: D("comida", 66, 120, "#d79a52", "pop", (c) => (
    <g>
      <ellipse cx={0} cy={-30} rx={54} ry={30} fill={c} />
      <path d="M-50,-36 Q-52,-58 0,-60 Q52,-58 50,-36 Q40,-28 26,-34 Q10,-24 -6,-34 Q-24,-26 -38,-34 Q-46,-30 -50,-36 Z" fill="#ff8aa0" />
      <ellipse cx={0} cy={-38} rx={15} ry={7} fill={osc(c, 0.55)} />
      {[[-30, -48, 0], [24, -50, 50], [-12, -52, -30], [36, -40, 80], [-38, -40, 20]].map(([x, y, a], i) => <rect key={i} x={x} y={y} width={9} height={3} rx={1.5} fill={["#fff", "#7ec8ff", "#f6d04a"][i % 3]} transform={`rotate(${a} ${x} ${y})`} />)}
    </g>
  )),
  helado: D("comida", 146, 80, "#ff8aa0", "pop", (c) => (
    <g>
      <path d="M-26,-74 L26,-74 L0,0 Z" fill="#d79a52" />
      <path d="M-18,-60 L10,-20 M-6,-74 L16,-40 M18,-68 L-12,-28 M6,-74 L-16,-46" stroke={osc("#d79a52", 0.7)} strokeWidth={2.5} />
      <circle cx={0} cy={-90} r={28} fill="#f4efe6" />
      <circle cx={0} cy={-120} r={24} fill={c} />
      <circle cx={2} cy={-146} r={6} fill="#c8402e" />
      <path d="M-26,-76 Q-20,-64 -12,-74 Q-4,-64 4,-74 Q12,-64 20,-74 Q26,-66 28,-80" stroke="#f4efe6" strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  )),

  // ---------------- ANIMALES CHICOS (con vida propia: cola, respiración, alas) ----------------
  gato: D("animales", 116, 120, "#e8913a", "farm", (c, f) => (
    <g>
      <path d={`M30,-10 Q70,-8 ${66 + Math.sin(f / 14) * 6},-40 Q${62 + Math.sin(f / 14) * 10},-70 ${52 + Math.sin(f / 11) * 10},-74`} stroke={c} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M-34,0 Q-40,-62 0,-66 Q40,-62 34,0 Z" fill={c} transform={`scale(1,${1 + Math.sin(f / 18) * 0.015})`} />
      <ellipse cx={0} cy={-30} rx={16} ry={26} fill={acl(c, 0.45)} />
      <g transform={`translate(0,-82) rotate(${Math.sin(f / 40) * 4})`}>
        <path d="M-26,-14 L-24,-44 L-6,-24 Z M26,-14 L24,-44 L6,-24 Z" fill={c} />
        <circle r={28} fill={c} />
        <ellipse cx={-10} cy={-2} rx={4} ry={6} fill={OSC} /><ellipse cx={10} cy={-2} rx={4} ry={6} fill={OSC} />
        <path d="M-3,8 L3,8 L0,12 Z" fill="#ff8aa0" />
        <path d="M-30,8 L-14,10 M-30,14 L-14,12 M30,8 L14,10 M30,14 L14,12" stroke={osc(c, 0.6)} strokeWidth={2} />
      </g>
      {[-14, 14].map((x) => <ellipse key={x} cx={x} cy={-4} rx={10} ry={6} fill={acl(c, 0.2)} />)}
    </g>
  )),
  perro: D("animales", 118, 130, "#c9935a", "farm", (c, f) => (
    <g>
      <path d={`M32,-16 Q60,-20 ${62 + Math.sin(f / 4) * 10},-50`} stroke={c} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M-36,0 Q-42,-60 0,-64 Q42,-60 36,0 Z" fill={c} />
      <ellipse cx={0} cy={-26} rx={18} ry={24} fill={acl(c, 0.4)} />
      <g transform={`translate(-4,-84) rotate(${Math.sin(f / 30) * 5})`}>
        <circle r={28} fill={c} />
        <ellipse cx={-12} cy={12} rx={22} ry={14} fill={acl(c, 0.4)} />
        <ellipse cx={-28} cy={0} rx={9} ry={20} fill={osc(c, 0.7)} transform="rotate(16 -28 0)" />
        <ellipse cx={24} cy={-2} rx={9} ry={20} fill={osc(c, 0.7)} transform="rotate(-16 24 -2)" />
        <circle cx={-6} cy={-6} r={4.5} fill={OSC} /><circle cx={12} cy={-6} r={4.5} fill={OSC} />
        <ellipse cx={-16} cy={6} rx={7} ry={5} fill={OSC} />
        <path d={`M-14,18 q0,${10 + Math.sin(f / 5) * 2} 7,${10 + Math.sin(f / 5) * 2} q6,-2 3,-12`} fill="#ff8aa0" />
      </g>
      {[-16, 16].map((x) => <ellipse key={x} cx={x} cy={-4} rx={11} ry={6} fill={acl(c, 0.2)} />)}
    </g>
  )),
  raton: D("animales", 48, 130, "#9aa3a8", "farm", (c, f) => (
    <g>
      <path d={`M30,-12 Q60,-4 64,${-20 + Math.sin(f / 9) * 6} Q68,-34 84,-28`} stroke="#ff9fb0" strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-20} rx={36} ry={20} fill={c} />
      <path d="M-30,-26 L-58,-14 L-30,-8 Z" fill={c} />
      <circle cx={-26} cy={-38} r={12} fill={c} /><circle cx={-26} cy={-38} r={7} fill="#ff9fb0" />
      <circle cx={-58} cy={-14 + Math.sin(f / 3) * 0.8} r={4} fill="#ff6f8a" />
      <circle cx={-40} cy={-22} r={3} fill={OSC} />
      <path d="M-56,-16 l-14,-5 M-56,-14 l-14,3" stroke={osc(c, 0.6)} strokeWidth={1.5} />
    </g>
  )),
  pajaro: D("animales", 70, 100, "#5aa0d8", "farm", (c, f) => (
    <g>
      <path d="M-6,0 L-6,-12 M8,0 L8,-12" stroke="#e8913a" strokeWidth={3} strokeLinecap="round" />
      <path d="M26,-30 L52,-40 L44,-24 Z" fill={osc(c, 0.75)} />
      <ellipse cx={0} cy={-34} rx={32} ry={24} fill={c} />
      <ellipse cx={-4} cy={-26} rx={18} ry={12} fill={acl(c, 0.5)} />
      <path d={`M4,-40 Q22,${-56 - Math.sin(f / 3) * 10} 34,-38 Q18,-30 4,-40 Z`} fill={osc(c, 0.75)} />
      <circle cx={-24} cy={-52} r={16} fill={c} />
      <circle cx={-28} cy={-55} r={3.5} fill={OSC} />
      <path d="M-40,-52 L-54,-48 L-40,-44 Z" fill="#f6b04a" />
    </g>
  )),
  conejo: D("animales", 122, 110, "#f1ece2", "farm", (c, f) => (
    <g>
      <circle cx={36} cy={-18} r={11} fill="#fff" />
      <path d="M-36,0 Q-44,-56 0,-62 Q44,-56 36,0 Z" fill={c} />
      <path d="M10,-60 Q44,-54 36,0 L14,0 Q30,-30 10,-60 Z" fill={osc(c, 0.86)} />
      <g transform="translate(-2,-80)">
        <ellipse cx={-12} cy={-40} rx={9} ry={30} fill={c} transform={`rotate(${-8 + Math.sin(f / 26) * 4} -12 -14)`} />
        <ellipse cx={12} cy={-40} rx={9} ry={30} fill={c} transform="rotate(10 12 -14)" />
        <ellipse cx={-12} cy={-40} rx={4} ry={22} fill="#ffb3c0" transform={`rotate(${-8 + Math.sin(f / 26) * 4} -12 -14)`} />
        <circle r={24} fill={c} />
        <circle cx={-9} cy={-4} r={3.5} fill={OSC} /><circle cx={9} cy={-4} r={3.5} fill={OSC} />
        <ellipse cx={0} cy={7 + Math.sin(f / 4) * 0.8} rx={4} ry={3} fill="#ff8aa0" />
      </g>
      {[-15, 15].map((x) => <ellipse key={x} cx={x} cy={-4} rx={11} ry={6} fill={osc(c, 0.9)} />)}
    </g>
  )),
  rana: D("animales", 70, 120, "#5aa86a", "farm", (c, f) => (
    <g>
      <path d="M-50,0 Q-56,-16 -36,-14 M50,0 Q56,-16 36,-14" stroke={c} strokeWidth={10} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-26} rx={46} ry={26} fill={c} />
      <ellipse cx={0} cy={-14} rx={22 + Math.max(0, Math.sin(f / 12)) * 8} ry={10 + Math.max(0, Math.sin(f / 12)) * 5} fill={acl(c, 0.5)} />
      {[-22, 22].map((x) => <g key={x}><circle cx={x} cy={-52} r={14} fill={c} /><circle cx={x} cy={-54} r={9} fill="#fff" /><circle cx={x + (x > 0 ? -2 : 2)} cy={-54} r={4.5} fill={OSC} /></g>)}
      <path d="M-20,-28 Q0,-20 20,-28" stroke={osc(c, 0.6)} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  )),
  arana: D("animales", 74, 110, OSC, "farm", (c, f) => (
    <g transform={`translate(0,${Math.sin(f / 16) * 6})`}>
      <line x1={0} y1={-60} x2={0} y2={-420} stroke="#e8e4dc" strokeWidth={1.6} opacity={0.6} />
      {[-1, 1].map((s) => [0, 1, 2, 3].map((k) => <path key={`${s}${k}`} d={`M0,-36 Q${s * 30},${-58 + k * 14} ${s * 46},${-40 + k * 14 + Math.sin(f / 5 + k) * 3}`} stroke={c} strokeWidth={4} fill="none" strokeLinecap="round" />))}
      <ellipse cx={0} cy={-30} rx={20} ry={24} fill={c} />
      <circle cx={0} cy={-56} r={12} fill={c} />
      <circle cx={-4} cy={-58} r={3} fill="#ff4a3d" /><circle cx={4} cy={-58} r={3} fill="#ff4a3d" />
    </g>
  )),
  abeja: D("animales", 60, 90, "#f6c84a", "farm", (c, f) => (
    <g transform={`translate(0,${-10 + Math.sin(f / 7) * 6})`}>
      <ellipse cx={-8} cy={-48} rx={12} ry={18 + Math.sin(f * 1.4) * 5} fill="#dff3ff" opacity={0.7} transform="rotate(-24 -8 -40)" />
      <ellipse cx={8} cy={-48} rx={12} ry={18 + Math.cos(f * 1.4) * 5} fill="#dff3ff" opacity={0.7} transform="rotate(24 8 -40)" />
      <ellipse cx={0} cy={-26} rx={30} ry={20} fill={c} />
      {[-10, 4].map((x) => <rect key={x} x={x} y={-45} width={8} height={38} fill={OSC} />)}
      <path d="M28,-26 L38,-26" stroke={OSC} strokeWidth={4} strokeLinecap="round" />
      <circle cx={-26} cy={-28} r={11} fill={OSC} /><circle cx={-29} cy={-30} r={3} fill="#fff" />
    </g>
  )),
  pez: D("animales", 120, 130, "#f07a2a", "water", (c, f) => {
    const px = Math.sin(f / 22) * 22, d = Math.cos(f / 22) >= 0 ? 1 : -1;
    return (
      <g>
        <ellipse cx={0} cy={-6} rx={36} ry={6} fill={osc("#7ec8ff", 0.8)} opacity={0.6} />
        <circle cx={0} cy={-62} r={58} fill="#dff3ff" fillOpacity={0.35} />
        <path d="M-54,-46 A58,58 0 0,0 54,-46 Q0,-40 -54,-46 Z" fill="#7ec8ff" opacity={0.55} />
        <g transform={`translate(${px},-42) scale(${d},1)`}>
          <path d="M-20,0 Q0,-14 18,0 Q0,14 -20,0 Z" fill={c} /><path d="M-18,0 L-32,-10 L-30,0 L-32,10 Z" fill={osc(c, 0.8)} />
          <circle cx={9} cy={-2} r={2.5} fill={OSC} />
        </g>
        {[0, 1, 2].map((k) => <circle key={k} cx={px * 0.6 + 14 + k * 4} cy={-60 - ((f * 1.2 + k * 14) % 50)} r={3 - k * 0.6} fill="#fff" opacity={0.7} />)}
        <path d="M-40,-110 Q-56,-80 -50,-52" stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
        <ellipse cx={0} cy={-118} rx={32} ry={5} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={3} />
      </g>
    );
  }),

  // ---------------- CIRCO ----------------
  globo: D("circo", 176, 90, "#e0453a", "pop", (c, f) => (
    <g transform={`rotate(${Math.sin(f / 30) * 4} 0 0)`}>
      <path d={`M0,0 Q${-10 + Math.sin(f / 10) * 6},-30 0,-60 Q${10 - Math.sin(f / 10) * 6},-80 0,-96`} stroke="#e8e4dc" strokeWidth={2.5} fill="none" />
      <path d="M-6,-92 L6,-92 L0,-100 Z" fill={osc(c, 0.75)} />
      <ellipse cx={0} cy={-136} rx={36} ry={42} fill={c} />
      <ellipse cx={-14} cy={-150} rx={7} ry={14} fill="#fff" opacity={0.5} transform="rotate(20 -14 -150)" />
    </g>
  )),
  nariz: D("circo", 56, 60, "#e0453a", "pop", (c) => (
    <g><circle cx={0} cy={-28} r={28} fill={c} /><circle cx={-10} cy={-38} r={8} fill="#fff" opacity={0.6} /><path d="M-20,-10 Q0,4 20,-10" stroke={osc(c, 0.7)} strokeWidth={4} fill="none" /></g>
  )),
  galera: D("circo", 116, 140, "#1e1e22", "paper", (c) => (
    <g>
      <ellipse cx={0} cy={-12} rx={66} ry={13} fill={c} />
      <rect x={-40} y={-112} width={80} height={100} rx={4} fill={c} />
      <ellipse cx={0} cy={-112} rx={40} ry={8} fill={acl(c, 0.12)} />
      <rect x={-40} y={-42} width={80} height={16} fill="#d8382c" />
      <rect x={-32} y={-104} width={8} height={56} rx={4} fill="#fff" opacity={0.12} />
    </g>
  )),
  malabares: D("circo", 170, 140, "#e0453a", "pop", (c, f) => (
    <g>
      {[0, 1, 2].map((k) => {
        const t = ((f / 40 + k / 3) % 1);
        const x = Math.cos(t * Math.PI * 2) * 54, y = -100 - Math.sin(t * Math.PI * 2) * 62;
        const col = [c, "#f6c84a", "#5aa0d8"][k];
        return <g key={k}><circle cx={x} cy={y} r={18} fill={col} /><circle cx={x - 6} cy={y - 6} r={5} fill="#fff" opacity={0.5} /></g>;
      })}
    </g>
  )),
  aro: D("circo", 170, 170, "#f6c84a", "drum", (c, f) => (
    <g>
      {Array.from({ length: 14 }).map((_, k) => {
        const a = (k / 14) * Math.PI * 2, x = Math.cos(a) * 74, y = -86 + Math.sin(a) * 74, h = 22 + Math.sin(f / 4 + k * 1.7) * 6;
        return <path key={k} d={`M${x - 9},${y} Q${x},${y - h * 1.5} ${x + 9},${y} Z`} fill={k % 2 ? "#ff8a3d" : "#ffd25a"} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />;
      })}
      <circle cx={0} cy={-86} r={74} fill="none" stroke={osc(c, 0.85)} strokeWidth={11} />
      <circle cx={0} cy={-86} r={74} fill="none" stroke={c} strokeWidth={11} strokeDasharray="22 14" />
      <rect x={-6} y={-12} width={12} height={12} fill={osc(c, 0.6)} />
    </g>
  )),
  tambor: D("circo", 100, 140, "#d8382c", "drum", (c) => (
    <g>
      <rect x={-56} y={-80} width={112} height={74} fill={c} />
      <path d={`M-56,-76 ${Array.from({ length: 7 }).map((_, k) => `L${-48 + k * 16},${k % 2 ? -76 : -10}`).join(" ")} L56,-76`} stroke="#f6c84a" strokeWidth={3} fill="none" />
      <ellipse cx={0} cy={-6} rx={56} ry={10} fill={osc(c, 0.65)} />
      <ellipse cx={0} cy={-80} rx={56} ry={12} fill="#f4efe6" />
      <rect x={-56} y={-86} width={112} height={8} fill="#f6c84a" opacity={0.85} />
      <path d="M-20,-96 L-52,-130 M20,-96 L56,-124" stroke={MAD} strokeWidth={6} strokeLinecap="round" />
      <circle cx={-52} cy={-130} r={7} fill="#f4efe6" /><circle cx={56} cy={-124} r={7} fill="#f4efe6" />
    </g>
  )),
  entrada: D("circo", 66, 150, "#f6c84a", "paper", (c) => (
    <g>
      <path d="M-70,-66 L70,-66 L70,-44 Q60,-33 70,-22 L70,0 L-70,0 L-70,-22 Q-60,-33 -70,-44 Z" fill={c} />
      <line x1={36} y1={-60} x2={36} y2={-6} stroke={osc(c, 0.65)} strokeWidth={3} strokeDasharray="6 5" />
      <text x={-18} y={-26} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#8a3a2e">ADMIT ONE</text>
      <text x={53} y={-26} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#8a3a2e">★</text>
    </g>
  )),
  pochoclo: D("circo", 130, 110, "#e0453a", "pop", (c) => (
    <g>
      {[[-30, -100], [-12, -112], [8, -108], [26, -100], [-20, -90], [16, -92], [0, -96], [-36, -86], [34, -86]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill={i % 3 ? "#fff3d0" : "#f6e0a0"} />)}
      <path d="M-44,-86 L44,-86 L34,0 L-34,0 Z" fill="#f4efe6" />
      {[-30, -6, 18].map((x) => <path key={x} d={`M${x},-86 L${x + 12},-86 L${x * 0.8 + 10},0 L${x * 0.8},0 Z`} fill={c} />)}
      <rect x={-46} y={-90} width={92} height={8} rx={3} fill={osc(c, 0.8)} />
    </g>
  )),
  pelota: D("circo", 104, 110, "#5aa0d8", "drum", (c) => (
    <g>
      <circle cx={0} cy={-52} r={52} fill={c} />
      <path d="M-52,-52 Q0,-80 52,-52 Q0,-24 -52,-52 Z" fill="#f6c84a" />
      <path d="M0,-104 Q-24,-52 0,0" stroke="#e0453a" strokeWidth={14} fill="none" />
      <circle cx={-20} cy={-78} r={9} fill="#fff" opacity={0.5} />
    </g>
  )),

  // ---------------- VARIOS ----------------
  billete: D("varios", 64, 150, "#7fb06a", "paper", (c) => (
    <g>
      <rect x={-70} y={-64} width={140} height={64} rx={5} fill={c} />
      <rect x={-62} y={-56} width={124} height={48} rx={3} fill="none" stroke={osc(c, 0.7)} strokeWidth={3} />
      <circle cx={0} cy={-32} r={18} fill={acl(c, 0.35)} />
      <text x={0} y={-24} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} fill={osc(c, 0.5)}>$</text>
      <text x={-46} y={-38} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={16} fill={osc(c, 0.55)}>100</text>
    </g>
  )),
  moneda: D("varios", 70, 70, ORO, "coin", (c) => (
    <g>
      <circle cx={0} cy={-35} r={34} fill={osc(c, 0.8)} />
      <circle cx={0} cy={-35} r={27} fill={c} />
      <text x={0} y={-24} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} fill={osc(c, 0.6)}>$</text>
      <path d="M-18,-54 Q-26,-40 -22,-26" stroke="#fff" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
    </g>
  )),
  bolsaDinero: D("varios", 120, 120, "#c9a36a", "coins_many", (c) => (
    <g>
      <path d="M-16,-96 Q-30,-112 -14,-118 L14,-118 Q30,-112 16,-96 Z" fill={c} />
      <path d="M-18,-96 Q-58,-70 -54,-30 Q-50,0 0,0 Q50,0 54,-30 Q58,-70 18,-96 Z" fill={c} />
      <rect x={-20} y={-100} width={40} height={10} rx={4} fill={osc(c, 0.6)} />
      <text x={0} y={-24} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={48} fill={osc(c, 0.5)}>$</text>
      <path d="M-40,-62 Q-46,-36 -36,-16" stroke={acl(c, 0.35)} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  )),
  vela: D("varios", 130, 60, "#f4efe6", "fire", (c, f) => {
    const l = Math.sin(f / 5) * 2.5, h = 26 + Math.sin(f / 3.3) * 3;
    return (
      <g>
        <circle cx={0} cy={-100} r={46} fill="#ffd27a" opacity={0.16 + 0.04 * Math.sin(f / 4)} />
        <rect x={-18} y={-80} width={36} height={80} rx={4} fill={c} />
        <path d="M-18,-78 Q-12,-66 -8,-76 Q-4,-60 2,-76 L18,-80 L-18,-80 Z" fill={acl(c, 0.5)} />
        <line x1={0} y1={-80} x2={0} y2={-88} stroke={OSC} strokeWidth={2.5} />
        <path d={`M0,-86 Q-10,-${88 + h * 0.4} ${l},-${86 + h} Q10,-${88 + h * 0.4} 0,-86 Z`} fill="#ffb03a" />
        <path d={`M0,-87 Q-5,-${88 + h * 0.3} ${l * 0.6},-${86 + h * 0.6} Q5,-${88 + h * 0.3} 0,-87 Z`} fill="#fff3c0" />
      </g>
    );
  }),
  relojArena: D("varios", 124, 80, "#f2c35a", "tick", (c, f) => {
    const u = (f % 300) / 300;
    return (
      <g>
        <rect x={-36} y={-124} width={72} height={10} rx={3} fill={MAD} /><rect x={-36} y={-10} width={72} height={10} rx={3} fill={MAD} />
        <path d="M-28,-114 L28,-114 L4,-62 L28,-10 L-28,-10 L-4,-62 Z" fill="#dff3ff" fillOpacity={0.4} />
        <path d={`M${-24 + 20 * u},${-108 + 44 * u} L${24 - 20 * u},${-108 + 44 * u} L3,-64 L-3,-64 Z`} fill={c} />
        <path d={`M-26,-12 L26,-12 L${18 - u * 10},${-12 - 40 * u} L${-18 + u * 10},${-12 - 40 * u} Z`} fill={c} />
        <line x1={0} y1={-64} x2={0} y2={-14} stroke={c} strokeWidth={2} />
        <path d="M-34,-114 L-34,-10 M34,-114 L34,-10" stroke={MAD} strokeWidth={5} />
      </g>
    );
  }),
  mochila: D("varios", 120, 110, "#3a5a8a", "paper", (c) => (
    <g>
      <path d="M-20,-112 Q0,-132 20,-112" stroke={osc(c, 0.7)} strokeWidth={7} fill="none" />
      <rect x={-46} y={-112} width={92} height={112} rx={22} fill={c} />
      <path d="M-46,-80 Q0,-100 46,-80 L46,-64 Q0,-84 -46,-64 Z" fill={osc(c, 0.8)} />
      <rect x={-30} y={-52} width={60} height={42} rx={10} fill={acl(c, 0.15)} />
      <rect x={-6} y={-56} width={12} height={10} rx={3} fill={ORO} />
    </g>
  )),
  paraguas: D("varios", 160, 170, "#d8382c", "whoosh", (c) => (
    <g>
      <path d="M0,-130 L0,-16 Q0,0 -14,0 Q-24,0 -24,-12" stroke={OSC} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-80,-118 Q-80,-160 0,-160 Q80,-160 80,-118 Q60,-128 40,-118 Q20,-128 0,-118 Q-20,-128 -40,-118 Q-60,-128 -80,-118 Z" fill={c} />
      <path d="M0,-160 Q-22,-140 -40,-118 M0,-160 Q22,-140 40,-118" stroke={osc(c, 0.75)} strokeWidth={3} fill="none" />
      <circle cx={0} cy={-164} r={5} fill={OSC} />
    </g>
  )),
  pastillas: D("varios", 96, 130, "#f07a2a", "click", (c) => (
    <g>
      <rect x={-34} y={-76} width={68} height={76} rx={8} fill={c} fillOpacity={0.9} />
      <rect x={-38} y={-96} width={76} height={22} rx={5} fill="#f4efe6" />
      <rect x={-34} y={-58} width={68} height={34} fill="#f4efe6" />
      <path d="M-8,-41 L8,-41 M0,-49 L0,-33" stroke="#d8382c" strokeWidth={5} strokeLinecap="round" />
      <g transform="translate(56,-10) rotate(-20)"><rect x={-16} y={-8} width={32} height={16} rx={8} fill="#fff" /><rect x={0} y={-8} width={16} height={16} rx={8} fill="#5aa0d8" /></g>
    </g>
  )),
  caja: D("varios", 96, 130, "#c9935a", "hit", (c) => (
    <g>
      <rect x={-58} y={-80} width={116} height={80} fill={c} />
      <path d="M-58,-80 L-44,-96 L72,-96 L58,-80 Z" fill={acl(c, 0.25)} />
      <path d="M58,-80 L72,-96 L72,-16 L58,0 Z" fill={osc(c, 0.75)} />
      <rect x={-8} y={-80} width={16} height={80} fill={acl(c, 0.4)} opacity={0.7} />
      <path d="M-46,-24 L-26,-24 M-46,-16 L-34,-16" stroke={osc(c, 0.6)} strokeWidth={3} />
    </g>
  )),
  regalo: D("varios", 112, 120, "#5aa0d8", "sparkle", (c) => (
    <g>
      <rect x={-48} y={-70} width={96} height={70} fill={c} />
      <rect x={-54} y={-86} width={108} height={20} rx={3} fill={acl(c, 0.2)} />
      <rect x={-8} y={-86} width={16} height={86} fill="#e0453a" />
      <path d="M0,-86 Q-34,-118 -34,-96 Q-30,-84 0,-86 Z M0,-86 Q34,-118 34,-96 Q30,-84 0,-86 Z" fill="#e0453a" />
      <circle cx={0} cy={-88} r={6} fill={osc("#e0453a", 0.7)} />
    </g>
  )),
  bombilla: D("varios", 120, 90, "#ffe39a", "ding", (c, f) => (
    <g>
      <circle cx={0} cy={-82} r={56} fill={c} opacity={0.18 + 0.05 * Math.sin(f / 6)} />
      <path d="M-14,-30 L-14,-42 Q-40,-56 -40,-84 Q-40,-118 0,-118 Q40,-118 40,-84 Q40,-56 14,-42 L14,-30 Z" fill={c} />
      <path d="M-8,-44 L-8,-70 L0,-62 L8,-70 L8,-44" stroke="#c9843a" strokeWidth={3} fill="none" />
      <rect x={-16} y={-32} width={32} height={22} rx={3} fill={MET} />
      {[-26, -18].map((y) => <line key={y} x1={-16} y1={y} x2={16} y2={y} stroke={osc(MET, 0.7)} strokeWidth={2.5} />)}
      <path d="M-6,-10 L6,-10 L2,0 L-2,0 Z" fill={OSC} />
      <path d="M-24,-96 Q-26,-76 -16,-64" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
    </g>
  )),
};

// nombres en inglés (lo que dice la voz en los canales EN) y sinónimos en castellano
export const ALIAS: Record<string, string> = {
  coat: "abrigo", jacket: "abrigo", campera: "abrigo", saco: "abrigo", hat: "sombrero", boot: "bota", shoe: "bota", shirt: "camiseta", tshirt: "camiseta", remera: "camiseta",
  scarf: "bufanda", glove: "guante", mitten: "guante", beanie: "gorro", cap: "gorro", glasses: "anteojos", lentes: "anteojos",
  needle: "aguja", stake: "estaca", rope: "cuerda", soga: "cuerda", hammer: "martillo", wrench: "llaveInglesa", screwdriver: "destornillador", saw: "serrucho",
  flashlight: "linterna", torch: "linterna", scissors: "tijeras", nail: "clavo", shovel: "pala", axe: "hacha", padlock: "candado", lock: "candado", key: "llave",
  tape: "cinta", "tape measure": "cinta", metro: "cinta",
  pan: "sarten", frypan: "sarten", pot: "olla", knife: "cuchillo", fork: "tenedor", spoon: "cuchara", plate: "plato", bottle: "botella", kettle: "tetera", teapot: "tetera",
  mug: "taza", cup: "taza", coffee: "taza", cafe: "taza", glass: "vaso", water: "vaso", agua: "vaso", "cutting board": "tabla", board: "tabla", jar: "frasco",
  pencil: "lapiz", paper: "hoja", sheet: "hoja", page: "hoja", folder: "carpeta", envelope: "sobre", letter: "sobre", carta: "sobre", clock: "reloj", alarm: "reloj",
  laptop: "laptop", computer: "laptop", computadora: "laptop", calculator: "calculadora", phone: "celular", cellphone: "celular", smartphone: "celular", telefono: "celular",
  remote: "control", camera: "camara", lamp: "lampara", battery: "bateria", pila: "bateria",
  apple: "manzana", banana: "banana", bread: "pan", cheese: "queso", egg: "huevo", pizza: "pizza", burger: "hamburguesa", hamburger: "hamburguesa", carrot: "zanahoria",
  fish: "pescado", donut: "dona", doughnut: "dona", "ice cream": "helado",
  cat: "gato", dog: "perro", mouse: "raton", rat: "raton", bird: "pajaro", rabbit: "conejo", bunny: "conejo", frog: "rana", spider: "arana", bee: "abeja", fishbowl: "pez", goldfish: "pez",
  balloon: "globo", "clown nose": "nariz", "top hat": "galera", juggling: "malabares", "juggling balls": "malabares", hoop: "aro", "ring of fire": "aro", drum: "tambor",
  ticket: "entrada", boleto: "entrada", popcorn: "pochoclo", palomitas: "pochoclo", ball: "pelota",
  bill: "billete", cash: "billete", money: "billete", dinero: "billete", coin: "moneda", "money bag": "bolsaDinero", candle: "vela", hourglass: "relojArena",
  backpack: "mochila", umbrella: "paraguas", pills: "pastillas", medicine: "pastillas", remedio: "pastillas", box: "caja", gift: "regalo", present: "regalo", bulb: "bombilla", "light bulb": "bombilla", idea: "bombilla",
};

const limpio = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[-_]/g, " ").trim();
const CLAVES = Object.keys(UTILERIA);
// resuelve lo que dice la voz → clave del catálogo ("Needles" → "aguja", "llave inglesa" → "llaveInglesa"). undefined si no hay.
export const nombreProp = (n: string): string | undefined => {
  const l = limpio(n), sin = l.replace(/\s/g, "");
  const directo = CLAVES.find((k) => k.toLowerCase() === sin);
  if (directo) return directo;
  if (ALIAS[l]) return ALIAS[l];
  for (const cut of [l.replace(/es$/, ""), l.replace(/s$/, "")]) {
    const k = CLAVES.find((c) => c.toLowerCase() === cut.replace(/\s/g, ""));
    if (k) return k;
    if (ALIAS[cut]) return ALIAS[cut];
  }
  return undefined;
};
export const CATEGORIAS = CLAVES.reduce<Record<string, string[]>>((o, k) => ((o[UTILERIA[k].cat] ||= []).push(k), o), {});

export type EntradaProp = "pop" | "cae" | "desliza" | "sube" | "ya";
export type PropProps = {
  name: string; x?: number; y?: number; s?: number; rot?: number; color?: string;
  desde?: number; hasta?: number; entra?: EntradaProp; lado?: 1 | -1; // desde qué lado entra (desliza) / hacia dónde gira (pop)
  centro?: boolean; sombra?: boolean; dir?: 1 | -1; // dir -1 = espejado
};
// cuadro en que el objeto toca el piso / termina de entrar (para el foley)
const ATERRIZA: Record<EntradaProp, number> = { pop: 4, cae: 11, desliza: 10, sube: 8, ya: 0 };

export const Prop: React.FC<PropProps> = ({ name, x = 0, y = 0, s = 1, rot = 0, color, desde = 0, hasta, entra = "pop", lado = 1, centro, sombra = true, dir = 1 }) => {
  const f = useF();
  const k = nombreProp(name);
  const t = f - desde;
  if (!k) { if (t === 0) console.warn(`[utileria] objeto desconocido: "${name}"`); return null; }
  if (t < 0 || (hasta !== undefined && f > hasta)) return null;
  const def = UTILERIA[k];
  const fps = 30;
  const sp = (cfg: object) => (entra === "ya" ? 1 : spring({ frame: t, fps, config: { damping: 11, stiffness: 170, mass: 0.8, ...cfg } }));
  let sc = 1, dx = 0, dy = 0, r = 0, sx = 1, sy = 1, op = 1;
  if (entra === "pop") { sc = sp({}); r = (1 - Math.min(1, sc)) * -16 * lado; }
  if (entra === "cae") { const q = sp({ damping: 9, stiffness: 140 }); dy = -380 * Math.max(0, 1 - q); const sq = Math.max(0, q - 1); sy = 1 - sq * 1.6; sx = 1 + sq * 1.1; r = Math.max(0, 1 - q) * 18 * lado; }
  if (entra === "desliza") { const q = sp({ damping: 14, stiffness: 120 }); dx = -lado * 460 * (1 - q); r = (1 - q) * 9 * lado; op = interpolate(t, [0, 6], [0, 1], { extrapolateRight: "clamp" }); }
  if (entra === "sube") { const q = sp({ damping: 13, stiffness: 150 }); dy = 70 * (1 - q); op = interpolate(t, [0, 8], [0, 1], { extrapolateRight: "clamp" }); }
  // salida: se achica con suavidad (nunca un parpadeo de 1 cuadro)
  if (hasta !== undefined) { const u = interpolate(f, [hasta - 9, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); sc *= u; op *= Math.min(1, u * 2); }
  const c = color ?? def.c;
  const base = centro ? def.h / 2 : 0;
  const alto = Math.max(0, -dy) / 380;
  return (
    <g transform={`translate(${x},${y + base})`} opacity={op}>
      {sombra && !centro && <ellipse cx={dx} cy={2} rx={def.w * 0.42 * s * Math.max(0, Math.min(1, sc)) * (1 - alto * 0.5)} ry={7 * s} fill="#000" opacity={0.2 * (1 - alto * 0.7)} />}
      <g transform={`translate(${dx},${dy}) rotate(${rot + r}) scale(${s * sc * sx * dir},${s * sc * sy})`}>{def.d(c, f)}</g>
    </g>
  );
};

// foley de la entrada: el pop/caída + el sonido propio del objeto («aguja» = metal, «gato» = farm…)
export const sfxProp = (name: string, desde: number, entra: EntradaProp = "pop"): Cue[] => {
  const k = nombreProp(name);
  const propio = k ? UTILERIA[k].sfx : "pop";
  const at = desde + ATERRIZA[entra];
  if (entra === "cae") return [cue(desde, "whoosh", -14), cue(at, propio === "pop" ? "hit" : propio, -6)];
  if (entra === "desliza") return [cue(desde, "whoosh", -10), cue(at, propio, -9)];
  return [cue(desde, "pop", -9), ...(propio !== "pop" ? [cue(at + 2, propio, -10)] : [])];
};
