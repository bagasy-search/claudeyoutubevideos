// gb01 v2 · MINUTO 14 (ventanas 52-54, 870-909 s): acá está el quizás, la palanca, la cinta sin fin… y el punto rojo: cuatro
// engranajes · ahora los ves (la linterna) · una máquina que ves ya no te maneja en la oscuridad (se cortan los hilos) · quedate ·
// la próxima: otra máquina detrás de la cortina · hasta entonces: pará, respirá, mirá la ola.
import React from "react";
import { N, easeOut, lerp, ramp } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const PIEL = "#e6eeff";
const COL = [N.violeta, N.oro, N.cian, N.rojo];
const engr = (r: number, n = 10) => {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, w = Math.PI / n;
    ([[0.8, a - w * 0.9], [1, a - w * 0.45], [1, a + w * 0.45], [0.8, a + w * 0.9]] as const).forEach(([k, b], j) => { d += (i === 0 && j === 0 ? "M" : "L") + (r * k * Math.cos(b)).toFixed(1) + "," + (r * k * Math.sin(b)).toFixed(1); });
  }
  return d + "Z " + circ(0, 0, r * 0.28);
};
const Rueda: React.FC<{ x?: number; y?: number; r: number; c: string; rot: number; lbl?: string; op?: number }> = ({ x = 0, y = 0, r, c, rot, lbl, op = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={op} style={glow(c, 10)}>
    <path d={engr(r)} transform={`rotate(${rot})`} fill="rgba(5,5,6,.85)" stroke={c} strokeWidth={Math.max(2, r / 20)} />
    {lbl && <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={r * 0.42} fill={c}>{lbl}</text>}
  </g>
);
// ═════════ HUB 52 · "Here is the maybe, here is the lever, here is the endless reel, and" ═════════
const RuedaN = (i: number): D => ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={COL[i]} trazos={[]}><Rueda r={80} c={COL[i]} rot={(i % 2 ? -1 : 1) * t * 60} lbl={i === 0 ? "?" : String(i + 1)} /></Glifo>
);
const MaquinaVidrio: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-90,10 Q-100,-60 -40,-76 Q0,-96 46,-76 Q100,-62 96,0 Q100,40 50,50 Q20,76 -10,62 Q-70,70 -90,10 Z", a: 2.6 }]}>
    {[0, 1, 2].map((i) => <Rueda key={i} x={-40 + i * 40} y={-6 + (i % 2) * 20} r={20} c={COL[i]} rot={(i % 2 ? -1 : 1) * t * 80} />)}
  </Glifo>
);

// ═════════ ESCENA 52 · y el punto rojo: cuatro engranajes · ahora los ves · una máquina que ves ya no te controla en la oscuridad ═════════
const E52 = { red: T("the red dot", 875.5), four: T("four gears", 876.5), see: T("can see them", 878), machine: T("a machine you", 880), controls: T("no longer controls", 882.5), dark: T("the dark", 884) };
// objetos de vidrio de la escena 52
const B52: Beat[] = reg([
  { t: T("four gears", 876.5), id: "h_cuatro_engranajes", glow: N.oro, tit: "four *gears*" },
  { t: T("can see them", 878), id: "h_ojo_abierto", glow: N.cian, tit: "now you can *see* them" },
  { t: T("the dark", 884), id: "h_maquina_luz", glow: N.oro, tit: "no longer in the *dark*" },
]);
const Escena52: React.FC = () => <EscenaHeroes ini={875.5} fin={885.0} beats={B52} />;

// ═════════ HUB 53 · "If this helped you understand your own mind a little better," ═════════
const Ayudo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-70,20 L-70,-30 Q-70,-50 -50,-50 L-20,-50 L-10,-90 Q0,-100 14,-88 L10,-50 L60,-50 Q76,-48 72,-30 L60,40 Q56,56 40,56 L-70,56 Z M-90,-50 L-90,56", a: 2.6 }]} />
);
const Bombilla: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-26,40 Q-60,10 -60,-26 Q-60,-80 0,-80 Q60,-80 60,-26 Q60,10 26,40 Z M-24,54 L24,54 M-18,68 L18,68", a: 2.6 }]}>
    <circle cx={0} cy={-26} r={20 + 4 * Math.sin(t * 4)} fill={N.oro} opacity={0.5} style={glow(N.oro, 16)} />
  </Glifo>
);
const CerebroCalma: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-90,10 Q-100,-60 -40,-76 Q0,-96 46,-76 Q100,-62 96,0 Q100,40 50,50 Q20,76 -10,62 Q-70,70 -90,10 Z", a: 2.6, f: "rgba(203,251,255,.05)" }]}>
    <circle r={lerp(20, 40, (Math.sin(t * 1.3) + 1) / 2)} fill="none" stroke={N.cianClaro} strokeWidth={2} opacity={0.6} />
  </Glifo>
);

// ═════════ ESCENA 53 · quedate · la próxima abrimos otra vez el cerebro · otra máquina detrás de la cortina: la que te hace abandonar ═════════
const E53 = { stay: T("stay with me", 888.5), next: T("Next time", 890), open: T("open the glass", 891.5), different: T("different machine", 894), quit: T("makes you quit", 895.5), hard: T("hard things", 897), want: T("truly want", 897), until: T("Until then", 899.5) };
// objetos de vidrio de la escena 53
const B53: Beat[] = reg([
  { t: T("Next time", 890), id: "h_cerebro_puerta", glow: N.violeta, tit: "next time, we open it *again*" },
  { t: T("different machine", 894), id: "h_cortina_maquina", glow: N.rojo, tit: "a *different* machine" },
  { t: T("hard things", 897), id: "h_montana", glow: N.oro, tit: "the *hard things* you want" },
]);
const Escena53: React.FC = () => <EscenaHeroes ini={889.1} fin={900.7} beats={B53} />;

// ═════════ HUB 54 · "the next time your thumb reaches for the screen," ═════════
const OlaMini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[{ d: "M-90,40 Q-50,40 -30,0 Q-10,-50 30,-46 Q60,-40 50,-14 Q30,-30 20,0 Q10,40 90,40", a: 3 }]} />
);
const PantallaMini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-40,-80 L40,-80 Q50,-80 50,-70 L50,70 Q50,80 40,80 L-40,80 Q-50,80 -50,70 L-50,-70 Q-50,-80 -40,-80 Z", a: 2.6 }]}>
    <circle r={14 + 4 * Math.sin(t * 6)} fill={N.rojo} cx={30} cy={-60} style={glow(N.rojo, 10)} />
  </Glifo>
);
const PulgarHub: D = ({ t, t0, on, tam }) => {
  const a = ramp(t, t0 + 0.2, 1.0, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-10,-80 L50,-80 Q60,-80 60,-70 L60,70 Q60,80 50,80 L-10,80 Q-20,80 -20,70 L-20,-70 Q-20,-80 -10,-80 Z", c: N.cianClaro, a: 2.4 }]}>
      <path d={`M-100,${lerp(80, 40, a)} Q-60,${lerp(60, 10, a)} ${lerp(-60, 10, a)},${lerp(40, -10, a)}`} fill="none" stroke={PIEL} strokeWidth={22} strokeLinecap="round" />
    </Glifo>
  );
};

// ═════════ ESCENA 54 · pará · respirá · mirá la ola ═════════
const E54 = { stop: T("stop, breathe", 904), breathe: T("breathe, and watch", 904.5), wave: T("the wave", 906.5) };
// objetos de vidrio de la escena 54
const B54: Beat[] = reg([
  { t: T("stop, breathe", 904), id: "h_mar_calmo", glow: N.cian, tit: "stop, breathe, *watch*" },
]);
const Escena54: React.FC = () => <EscenaHeroes ini={904.3} fin={910.5} beats={B54} />;

export const SEGS_M14: Seg[] = [
  {
    hub: { portal: "maqv", orbs: [
      { id: "r0", t: T("the maybe", 871), ang: 198, anillo: 1, tam: 150, D: RuedaN(0) },
      { id: "r1", t: T("the lever", 872), ang: 128, anillo: 2, tam: 150, D: RuedaN(1) },
      { id: "r2", t: T("endless reel", 874), ang: 250, anillo: 1, tam: 150, D: RuedaN(2) },
      { id: "maqv", t: T("endless reel", 874) + 0.4, ang: -14, anillo: 0, tam: 240, D: MaquinaVidrio, png: "engranajes4" },
    ] },
    Escena: Escena52,
    sonidos: (s) => { s.add("vuelo", E52.red - 0.2, 0.5); s.add("engranaje", E52.red + 0.5, 0.7); s.add("maquinaGira", E52.four, 0.5); s.add("vuelo", 878.8, 0.5); s.add("luz", E52.see - 0.3, 0.6); s.add("vuelo", 880.4, 0.5); s.add("neonOn", E52.controls, 0.5); [0, 1, 2, 3].forEach((i) => s.add("tic", E52.controls + 0.6 + i * 0.08, 0.5)); s.add("maquinaFrena", E52.dark, 0.4); },
  },
  {
    hub: { portal: "calma", orbs: [
      { id: "ayudo", t: T("this helped you", 885.5), ang: 198, anillo: 1, tam: 150, D: Ayudo },
      { id: "bomb", t: T("understand your own", 885), ang: 128, anillo: 2, tam: 150, D: Bombilla },
      { id: "calma", t: T("your own mind", 886), ang: -14, anillo: 0, tam: 240, D: CerebroCalma },
    ] },
    Escena: Escena53,
    sonidos: (s) => { s.add("luz", E53.stay, 0.5); s.add("vuelo", 890.7, 0.5); s.add("vidrio", E53.open, 0.5); s.add("tiron", E53.different - 0.2, 0.5); s.add("vuelo", 895.8, 0.5); [0, 1, 2, 3].forEach((i) => s.add("aparece", E53.hard + i * 0.3, 0.3)); },
  },
  {
    hub: { portal: "pulgar", orbs: [
      { id: "olam", t: T("the next time", 900.5), ang: 198, anillo: 1, tam: 150, D: OlaMini },
      { id: "pant", t: T("the screen", 902), ang: 128, anillo: 2, tam: 150, D: PantallaMini },
      { id: "pulgar", t: T("thumb reaches for", 901), ang: -14, anillo: 0, tam: 240, D: PulgarHub },
    ] },
    Escena: Escena54,
    sonidos: (s) => { s.add("toque", E54.stop, 0.5); s.add("ola", E54.breathe, 0.4); s.add("ola", E54.wave, 0.6); },
  },
];
