// gb01 v2 · MINUTO 9 (ventanas 32-35, 535-603 s): la máquina entera · la palanca sin esfuerzo · las puertas que desaparecen ·
// el punto rojo que llega al miedo más viejo · 4 engranajes en el bolsillo · "no sos débil, no estás roto" (kintsugi) ·
// bayas, leones y fogata · miles de diseñadores contra un cerebro · la culpa que se levanta · la historia del mono y el coco.
import React from "react";
import { N, easeOut, lerp, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const TRIBU = "#ffcf9a";
const FUEGO = "#ff9a3c";
// engranaje como path (dientes trapezoidales + agujero)
const engr = (r: number, n = 10) => {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, w = Math.PI / n;
    ([[0.8, a - w * 0.9], [1, a - w * 0.45], [1, a + w * 0.45], [0.8, a + w * 0.9]] as const).forEach(([k, b], j) => { d += (i === 0 && j === 0 ? "M" : "L") + (r * k * Math.cos(b)).toFixed(1) + "," + (r * k * Math.sin(b)).toFixed(1); });
  }
  return d + "Z " + circ(0, 0, r * 0.28);
};
const Gear: React.FC<{ x?: number; y?: number; r: number; c: string; rot: number; n?: number; lbl?: string; on?: number }> = ({ x = 0, y = 0, r, c, rot, n = 10, lbl, on = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={on} style={glow(c, 8)}>
    <path d={engr(r, n)} transform={`rotate(${rot})`} fill="rgba(5,5,6,.85)" stroke={c} strokeWidth={Math.max(2, r / 22)} />
    {lbl && <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={r * 0.42} fill={c}>{lbl}</text>}
  </g>
);
// ═════════ HUB 32 · "look at the whole machine. The maybe makes you want. The lever" ═════════
const Maquina: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-90,-70 L90,-70 L90,70 L-90,70 Z", a: 2.4 }]}>
    {[[-45, -20, N.violeta, 1], [10, 22, N.oro, -1], [52, -26, N.cian, 1], [-30, 40, N.rojo, -1]].map(([x, y, c, s], i) => <Gear key={i} x={x as number} y={y as number} r={30} c={c as string} rot={(s as number) * t * 60} n={8} />)}
  </Glifo>
);
const GearMaybe: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[]}><Gear r={80} c={N.violeta} rot={t * 50} lbl="?" /></Glifo>
);
const GearLever: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[]}>
    <Gear r={80} c={N.oro} rot={-t * 50} />
    <path d={`M0,0 L${36 * Math.sin(Math.sin(t * 4) * 0.6)},${-56 * Math.cos(Math.sin(t * 4) * 0.6)}`} stroke={N.oroClaro} strokeWidth={8} strokeLinecap="round" /><circle cx={36 * Math.sin(Math.sin(t * 4) * 0.6)} cy={-56 * Math.cos(Math.sin(t * 4) * 0.6)} r={12} fill={N.rojo} />
  </Glifo>
);

// ═════════ ESCENA 32 · la palanca sin esfuerzo · las puertas que desaparecen · el punto rojo al miedo más viejo ═════════
const E32 = { effort: T("makes it effortless", 539.5), reel: T("endless reel removes", 541), door: T("every door", 544), stop: T("could stop", 545), red: T("red dot reaches", 546.5), fear: T("oldest fear", 548.5), alone: T("left alone", 551) };
// objetos de vidrio de la escena 32
const B32: Beat[] = reg([
  { t: T("makes it effortless", 539.5), id: "h_pluma_palanca", glow: N.cian, tit: "*sin esfuerzo*" },
  { t: T("every door", 544), id: "h_puertas_polvo", glow: N.oro, tit: "sin *puertas*" },
  { t: T("oldest fear", 548.5), id: "h_figura_sola", glow: N.violeta, tit: "quedarte *solo*" },
]);
const Escena32: React.FC = () => <EscenaHeroes ini={W(540.0)} fin={W(552.6)} beats={B32} />;

// ═════════ HUB 33 · "Four gears turning together all day long in your pocket." ═════════
const COLS = [N.violeta, N.oro, N.cian, N.rojo];
const GearN = (i: number): D => ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={COLS[i]} trazos={[]}><Gear r={78} c={COLS[i]} rot={(i % 2 ? -1 : 1) * t * 70} lbl={String(i + 1)} /></Glifo>
);
const SolLuna: D = ({ t, t0, on, tam }) => {
  const a = t * 1.4;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-80,40 L80,40", a: 2, c: N.gris }]}>
      <circle cx={70 * Math.cos(a)} cy={40 - 70 * Math.abs(Math.sin(a))} r={16} fill={Math.sin(a) > 0 ? N.oro : "none"} stroke={N.oroClaro} strokeWidth={3} />
      <TextoNeon y={72} texto="todo el día" size={20} color={N.oroClaro} serif on={ramp(t, t0 + 0.3, 0.3)} />
    </Glifo>
  );
};
const Bolsillo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-80,-60 L80,-60 L80,30 Q80,90 0,90 Q-80,90 -80,30 Z", a: 2.6 }, { d: "M-80,-40 L80,-40", a: 1.6, c: N.gris }]}>
    <g transform="translate(0,-70)"><rect x={-30} y={-50} width={60} height={100} rx={10} fill="rgba(5,5,6,.95)" stroke={N.cianClaro} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => <Gear key={i} x={(i % 2 ? 10 : -10)} y={-30 + i * 18} r={9} c={COLS[i]} rot={(i % 2 ? -1 : 1) * t * 90} n={7} />)}</g>
  </Glifo>
);

// ═════════ ESCENA 33 · quiero ser claro · no sos débil · no estás roto (kintsugi) · tu cerebro hace lo que fue hecho para hacer ═════════
const E33 = { clear: T("be clear about", 559), weak: T("not weak", 561.5), broken: T("not broken", 563), brain: T("Your brain is", 564.5), exactly: T("doing exactly what", 564), built: T("built to do", 566.5) };
// objetos de vidrio de la escena 33
const B33: Beat[] = reg([
  { t: T("not weak", 561.5), id: "h_roble", glow: N.oro, tit: "no eres *débil*" },
  { t: T("not broken", 563), id: "h_kintsugi", glow: N.oro, tit: "no estás *roto*" },
  { t: T("doing exactly what", 564), id: "h_cerebro_brujula", glow: N.cian, tit: "hace aquello para lo que fue *construido*" },
]);
const Escena33: React.FC = () => <EscenaHeroes ini={W(558.0)} fin={W(568.0)} beats={B33} />;

// ═════════ HUB 34 · "built for a world of berries and lions and small tribes around a fire." ═════════
const Bayas2: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: "M0,-80 Q-10,-30 -30,0 M0,-80 Q20,-30 30,10 M0,-80 L0,-20", a: 2.4 }]}>
    {[[-30, 10], [-50, 30], [-14, 34], [30, 20], [46, 44], [14, 48]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill="rgba(183,123,255,.5)" stroke={N.violeta} strokeWidth={2.5} />)}
  </Glifo>
);
const Leon: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `${i ? "L" : "M"}${80 * Math.cos(a)},${80 * Math.sin(a)} L${58 * Math.cos(a + 0.22)},${58 * Math.sin(a + 0.22)}`; }).join(" ") + "Z", a: 2.4 }, { d: circ(0, 0, 46), a: 2.6 }, { d: "M-18,-10 L-10,-6 M18,-10 L10,-6 M-10,18 L0,26 L10,18 M0,10 L0,26", a: 2.4, dt: 0.3 }]} />
);
const FogataHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={FUEGO} trazos={[{ d: "M-50,70 L50,50 M-50,50 L50,70", c: N.oroHondo, a: 3 }]}>
    {[0, 1, 2].map((i) => <path key={i} d={`M${-26 + i * 26},56 Q${-40 + i * 26 + 8 * Math.sin(t * 8 + i)},10 ${-8 + i * 16},${-40 + 14 * Math.sin(t * 6 + i)} Q${8 + i * 8},10 ${26 - i * 8},56 Z`} fill="rgba(255,140,40,.35)" stroke={i === 1 ? N.oroClaro : FUEGO} strokeWidth={2.5} />)}
    {[-1, 1].map((s) => <g key={s} transform={`translate(${s * 78},60) scale(0.4)`}><circle cx={0} cy={-90} r={24} fill="none" stroke={TRIBU} strokeWidth={5} /><path d="M-40,20 Q-40,-60 0,-62 Q40,-60 40,20 Z" fill="none" stroke={TRIBU} strokeWidth={5} /></g>)}
  </Glifo>
);

// ═════════ ESCENA 34 · nunca hecho para pelear contra una máquina de miles · mantenerte mirando · dejar de culparte · trabajar con tu mente ═════════
const E34 = { never: T("never built", 574.5), machine: T("machine designed by", 575), thousands: T("thousands of clever", 576), job: T("whose job", 579), looking: T("keep you looking", 580), understand: T("you understand that", 582), blaming: T("blaming yourself", 583), working: T("working with", 586) };
// objetos de vidrio de la escena 34
const B34: Beat[] = reg([
  { t: T("machine designed by", 575), id: "h_maquina_gigante", glow: N.rojo, tit: "hecha por *miles*" },
  { t: T("keep you looking", 580), id: "h_ojo_engranaje", glow: N.cian, tit: "que sigas *mirando*" },
  { t: T("blaming yourself", 584), id: "h_cadenas", glow: N.oro, tit: "deja de *culparte*" },
]);
const Escena34: React.FC = () => <EscenaHeroes ini={W(574.4)} fin={W(587.6)} beats={B34} />;

// ═════════ HUB 35 · "instead of against it. There is an old story that I like to tell my students." ═════════
const ConContra: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.4, 0.6, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[]}>
      <path d="M-80,-24 L60,-24 M40,-44 L64,-24 L40,-4" fill="none" stroke={N.oroClaro} strokeWidth={6} strokeLinecap="round" />
      <g transform={`rotate(${lerp(180, 0, k)} 0 24)`}><path d="M-80,24 L60,24 M40,4 L64,24 L40,44" fill="none" stroke={k < 0.9 ? N.rojoBorde : N.oroClaro} strokeWidth={6} strokeLinecap="round" /></g>
    </Glifo>
  );
};
const Pergamino2: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.2, 0.7, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[]}>
      <rect x={-70} y={-70 * k} width={140} height={140 * k} fill="rgba(255,200,120,.08)" stroke={N.oro} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M-50,${-40 + i * 26} L${30 + (i % 2) * 18},${-40 + i * 26}`} stroke={N.oroClaro} strokeWidth={3} opacity={k > 0.3 + i * 0.15 ? 1 : 0} />)}
      <rect x={-84} y={-70 * k - 14} width={168} height={22} rx={11} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={3} />
      <rect x={-84} y={70 * k - 8} width={168} height={22} rx={11} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={3} />
    </Glifo>
  );
};
const Alumnos: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={TRIBU} trazos={[]}>
    {[-56, 0, 56].map((x, i) => <g key={i}><ellipse cx={x} cy={60} rx={26} ry={9} fill="rgba(255,42,72,.2)" stroke={N.rojoBorde} strokeWidth={2.5} /><g transform={`translate(${x},${54}) scale(0.5)`}><circle cx={0} cy={-90} r={24} fill="none" stroke={TRIBU} strokeWidth={5} /><path d="M-40,20 Q-40,-60 0,-62 Q40,-60 40,20 Z" fill="none" stroke={TRIBU} strokeWidth={5} /></g></g>)}
  </Glifo>
);

// ═════════ ESCENA 35 · la selva · cazar monos · el coco · el agujero · justo para una mano abierta ═════════
const E35 = { caught: T("people once caught", 593), forest: T("the forest", 595), hunters: T("The hunters", 596.5), coconut: T("took a coconut", 597), hole: T("small hole", 599), big: T("big enough", 600.5), hand: T("open hand", 602) };
// objetos de vidrio de la escena 35
const B35: Beat[] = reg([
  { t: T("the forest", 595), id: "h_selva", glow: N.verde, tit: "el *bosque*" },
  { t: T("took a coconut", 597), id: "h_coco", glow: N.oro, tit: "un *coco*" },
  { t: T("big enough", 600.5), id: "h_coco_mano", glow: N.oro, tit: "justo para una *mano abierta*" },
]);
const Escena35: React.FC = () => <EscenaHeroes ini={W(593.2)} fin={W(603.7)} beats={B35} />;

export const SEGS_M09: Seg[] = [
  {
    hub: { portal: "maq", orbs: [
      { id: "gmaybe", t: T("The maybe makes", 538), ang: 198, anillo: 1, tam: 170, D: GearMaybe },
      { id: "glever", t: T("The lever", 539.5), ang: 128, anillo: 2, tam: 170, D: GearLever },
      { id: "maq", t: T("the whole machine", 535), ang: -14, anillo: 0, tam: 240, D: Maquina },
    ] },
    Escena: Escena32,
    sonidos: (s) => { s.add("palanca", E32.effort + 0.2, 0.6); s.add("vuelo", W(543.1), 0.5); s.add("rodillos", E32.reel, 0.4); [0, 1, 2, 3, 4, 5].forEach((i) => s.add("cierre", E32.door + i * 0.22, 0.35)); s.add("vuelo", W(546.9), 0.5); s.add("aviso", E32.red, 0.5); s.add("traza", E32.red + 0.2, 0.5); s.add("latido", E32.fear); s.add("vacio", E32.alone, 0.6); },
  },
  {
    hub: { portal: "bolsillo", orbs: [
      ...[0, 1, 2, 3].map((i) => ({ id: "g" + i, t: T("Four gears", 552.5) + i * 0.25, ang: 150 + i * 50, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 140, D: GearN(i) })),
      { id: "dia", t: T("all day long", 554), ang: 60, anillo: 2, tam: 150, D: SolLuna },
      { id: "bolsillo", t: T("in your pocket", 556.5), ang: -14, anillo: 0, tam: 240, D: Bolsillo },
    ] },
    Escena: Escena33,
    sonidos: (s) => { s.add("vidrio", E33.clear, 0.5); s.add("vuelo", W(561.4), 0.5); s.add("traza", E33.weak + 0.4, 0.6); s.add("grieta", E33.broken - 0.2, 0.5); s.add("cierre", E33.broken + 1.2, 0.6); s.add("vuelo", W(565.3), 0.5); s.add("traza", E33.brain, 0.5); s.add("premio", E33.built + 0.2, 0.5); },
  },
  {
    hub: { portal: "fogata", orbs: [
      { id: "bayas", t: T("berries and lions", 569), ang: 198, anillo: 1, tam: 160, D: Bayas2, png: "bayas" },
      { id: "leon", t: T("and lions", 569), ang: 128, anillo: 2, tam: 170, D: Leon },
      { id: "fogata", t: T("around a fire", 572), ang: -14, anillo: 0, tam: 240, D: FogataHub, png: "fogata" },
    ] },
    Escena: Escena34,
    sonidos: (s) => { s.add("maquinaGira", E34.machine, 0.5); s.add("digito", E34.thousands, 0.5); s.add("vuelo", W(579.9), 0.5); s.add("sinapsis", E34.looking, 0.5); s.add("vuelo", W(582.2), 0.5); s.add("luz", E34.understand, 0.5); s.add("ola", E34.blaming + 0.2, 0.5); s.add("vuelo", W(586.7), 0.5); s.add("cierre", E34.working + 0.6, 0.5); },
  },
  {
    hub: { portal: "perg", orbs: [
      { id: "contra", t: T("instead of against", 587), ang: 198, anillo: 1, tam: 160, D: ConContra },
      { id: "perg", t: T("an old story", 589), ang: -14, anillo: 0, tam: 240, D: Pergamino2, png: "pergamino" },
      { id: "alumnos", t: T("my students", 591.5), ang: 128, anillo: 2, tam: 170, D: Alumnos },
    ] },
    Escena: Escena35,
    sonidos: (s) => { s.add("aparece", E35.caught + 0.3, 0.5); s.add("vuelo", W(597.1), 0.5); s.add("toque", E35.coconut + 0.4, 0.6); s.add("traza", E35.hole + 0.1, 0.6); s.add("vuelo", W(600.9), 0.5); s.add("tiron", E35.hand, 0.5); },
  },
];
