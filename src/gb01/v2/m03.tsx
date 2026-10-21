// gb01 v2 · MINUTO 3 (ventanas 8-11, 134-205 s): Skinner cambia una cosa · la ruleta sin patrón · la paloma que
// enloquece · recompensa variable · cerebro que se relaja vs que se inclina · dopamina = querer · el mono y la señal.
import React from "react";
import { N, lerp, neonOn, ramp } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { Obj, circ, Beat, EscenaHeroes, reg } from "./esc";
import { } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
// ═════════ HUB 8 · "Then Skinner changed one thing. Sometimes the lever gave food" ═════════
const CajaMini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[
    { d: "M-70,-40 L50,-40 L70,-56 L-50,-56 Z M50,-40 L50,50 L70,34 L70,-56 M-70,-40 L-70,50 L50,50", a: 2.2 },
    { d: "M20,10 L34,10 M26,10 L18,-6", c: N.oro, a: 2.6 },
    { d: "M-40,40 Q-30,20 -14,22 Q-6,10 2,18 L-2,26 Q-20,46 -40,40 Z", c: "#e6eeff", a: 1.8 },
  ]} />
);
const Interruptor: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.5, 0.25);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
      { d: "M-60,-26 L60,-26 A26,26 0 0,1 60,26 L-60,26 A26,26 0 0,1 -60,-26 Z", a: 2.4 },
    ]}>
      <circle cx={lerp(-58, 58, k)} cy={0} r={20} fill={k > 0.5 ? N.fosfo : N.gris} style={{ filter: `drop-shadow(0 0 8px ${k > 0.5 ? N.fosfo : "#fff"})` }} />
      <TextoNeon y={64} texto="one thing" size={24} serif color={N.cianClaro} on={k} />
    </Glifo>
  );
};
const Grano: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[0, 1, 2, 3, 4].map((i) => ({ d: circ(-40 + i * 20, 20 * Math.sin(t * 2 + i), 9), a: 2.2, f: "rgba(244,194,74,.4)" }))} />
);

// ═════════ ESCENA 8 · ruleta sin patrón · la paloma enloquece · más que antes · aunque no haya comida ═════════
const E8 = { nothing: T("gave nothing", 139), pattern: T("No pattern", 140), chance: T("Pure chance", 142), crazy: T("went crazy", 143), pressed: T("pressed and pressed", 145), more: T("much more", 148), kept: T("kept pressing", 149.5), stopped: T("food had stopped", 151) };
const presiones = (a: number, b: number, paso: number) => Array.from({ length: Math.floor((b - a) / paso) }, (_, i) => a + i * paso);
// objetos de vidrio de la escena 8
const B8: Beat[] = reg([
  { t: T("gave nothing", 139), id: "h_ruleta_vacia", glow: N.violeta, tit: "no *pattern*" },
  { t: T("went crazy", 143), id: "h_paloma_loca", glow: N.rojo, tit: "the pigeons went *crazy*" },
  { t: T("kept pressing", 149.5), id: "h_palanca_gastada", glow: N.oro, tit: "long after the food *stopped*" },
]);
const Escena8: React.FC = () => <EscenaHeroes ini={138.7} fin={151.2} beats={B8} />;

// ═════════ HUB 9 · "after the food had stopped. Scientists call this a variable reward." ═════════
const BandejaVacia: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-60,0 L60,0 L48,30 L-48,30 Z", a: 2.6 }, { d: "M-30,-40 L30,20 M30,-40 L-30,20", a: 2, dt: 0.3 }]} />
);
const Matraz: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[
    { d: "M-16,-70 L16,-70 M-10,-70 L-10,-20 L-56,60 Q-60,70 -50,70 L50,70 Q60,70 56,60 L10,-20 L10,-70", a: 2.4 },
    { d: "M-40,40 Q0,20 40,40", a: 2, dt: 0.3 },
  ]}>
    {[0, 1, 2].map((i) => <circle key={i} cx={-10 + i * 12} cy={30 - ((t * 40 + i * 30) % 90)} r={4} fill={N.verde} opacity={0.7} />)}
  </Glifo>
);
const BarrasVariables: D = ({ t, t0, on, tam }) => {
  const H = [30, 80, 10, 60, 100, 20, 70, 40];
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[
      { d: "M-90,60 L90,60 M-90,60 L-90,-80", c: N.gris, a: 1.6 },
      ...H.map((h, i): Trazo => ({ d: `M${-76 + i * 22},60 L${-76 + i * 22},${60 - h * (0.8 + 0.2 * Math.sin(t * 3 + i))}`, a: 5, dt: 0.1 + i * 0.05 })),
    ]}>
      <TextoNeon y={92} texto="variable reward" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.4, 0.3)} />
    </Glifo>
  );
};

// ═════════ ESCENA 9 · "I call it the maybe … brain relaxes … leans forward … cannot stop thinking" ═════════
const E9 = { maybe: T("maybe", 157), know: T("know exactly", 158), relax: T("relaxes", 160), dont: T("don't know", 162), leans: T("leans forward", 163.5), stop: T("cannot stop", 165) };
// objetos de vidrio de la escena 9
const B9: Beat[] = reg([
  { t: T("maybe", 157), id: "h_quizas", glow: N.oro, tit: "the *maybe*" },
  { t: T("relaxes", 160), id: "h_cerebro_relajado", glow: N.cian, tit: "you know, it *relaxes*" },
  { t: T("leans forward", 163.5), id: "h_cerebro_inclinado", glow: N.rojo, tit: "you don't, it *leans forward*" },
]);
const Escena9: React.FC = () => <EscenaHeroes ini={156.3} fin={167.6} beats={B9} />;

// ═════════ HUB 10 · "look inside the glass brain. Deep in the middle, a small group of cells" ═════════
const CerebroVidrio: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
    { d: "M-90,20 Q-110,-60 -40,-80 Q0,-110 50,-84 Q110,-70 100,0 Q110,50 50,60 Q30,90 -10,70 Q-70,80 -90,20 Z", a: 2.4, f: "rgba(203,251,255,.05)" },
    { d: "M-60,-20 Q-30,-50 0,-30 Q30,-60 60,-24", c: N.gris, a: 1.4 },
  ]}>
    <circle cx={10} cy={6} r={10 + 3 * Math.sin(t * 4)} fill={N.oro} opacity={neonOn(t, T("Deep in the middle", 169))} style={{ filter: `drop-shadow(0 0 12px ${N.oro})` }} />
  </Glifo>
);
const Lupa: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: circ(-14, -14, 50), a: 3 }, { d: "M22,22 L70,70", a: 6 }]}>
    <circle cx={-14} cy={-14} r={46} fill="rgba(203,251,255,.06)" />
  </Glifo>
);
const Celulas: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[0, 1, 2, 3, 4, 5].map((i): Trazo => {
    const a = (i / 6) * Math.PI * 2 + t * 0.4, r = i ? 46 : 0;
    return { d: circ(Math.cos(a) * r, Math.sin(a) * r, 18 + 3 * Math.sin(t * 3 + i)), a: 2.2, f: "rgba(244,194,74,.15)", dt: i * 0.07 };
  })} />
);

// ═════════ ESCENA 10 · neuronas que sueltan dopamina · "pleasure" tachado · "wanting" · el mono ═════════
const E10 = { release: T("release a chemical", 173), dopa: T("dopamine", 174), pleasure: T("pleasure chemical", 176), not: T("not quite right", 178.5), wanting: T("wanting", 182), forward: T("looking forward", 183.5), monkeys: T("monkeys", 186) };
export const Mono: React.FC<{ x: number; y: number; t0: number; s?: number }> = ({ x, y, t0, s = 1 }) => (
  <Obj x={x} y={y} t0={t0} tam={300 * s} color="#e6eeff" trazos={[
    { d: circ(0, 0, 70), a: 2.4 },
    { d: circ(-86, -10, 26) + " " + circ(86, -10, 26), a: 2.2 },
    { d: "M-44,10 Q-50,-40 0,-40 Q50,-40 44,10 Q50,56 0,56 Q-50,56 -44,10 Z", c: N.oroClaro, a: 1.8 },
    { d: circ(-18, -6, 6) + " " + circ(18, -6, 6), a: 2.4 },
    { d: "M-14,30 Q0,40 14,30", a: 2 },
  ]} />
);
// objetos de vidrio de la escena 10
const B10: Beat[] = reg([
  { t: T("release a chemical", 173), id: "h_neurona_dopa", glow: N.oro, tit: "*dopamine*" },
  { t: T("not quite right", 178.5), id: "h_caramelo_roto", glow: N.rojo, tit: "not *pleasure*" },
  { t: T("wanting", 182), id: "h_mano_alcanza", glow: N.violeta, tit: "the chemical of *wanting*" },
  { t: T("monkeys", 186), id: "h_mono_luz", glow: N.cian, tit: "the *monkey* experiments" },
]);
const Escena10: React.FC = () => <EscenaHeroes ini={173.2} fin={188.2} beats={B10} />;

// ═════════ HUB 11 · "scientists saw these cells fire hardest, not when the reward" ═════════
const MonoChico: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: circ(0, 0, 44), a: 2.4 }, { d: circ(-54, -6, 16) + " " + circ(54, -6, 16), a: 2.2 }, { d: circ(-12, -4, 4) + " " + circ(12, -4, 4), a: 2.4 },
  ]} />
);
const Osciloscopio: D = ({ t, t0, on, tam }) => {
  const d = Array.from({ length: 50 }, (_, i) => { const x = -90 + i * 3.6; const sp = (i + Math.floor(t * 12)) % 7 === 0 ? -50 : 0; return `${i ? "L" : "M"}${x},${10 + sp}`; }).join(" ");
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.fosfo} trazos={[{ d: "M-100,-60 L100,-60 L100,60 L-100,60 Z", c: "#e6eeff", a: 2 }]}>
      <path d={d} fill="none" stroke={N.fosfo} strokeWidth={2.6} style={{ filter: `drop-shadow(0 0 6px ${N.fosfo})` }} />
    </Glifo>
  );
};
const Gota: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[{ d: "M0,-60 Q40,0 30,30 Q20,60 0,60 Q-20,60 -30,30 Q-40,0 0,-60 Z", a: 2.6, f: "rgba(39,227,255,.15)" }]} />
);

// ═════════ ESCENA 11 · la señal: el pico aparece cuando es POSIBLE, no cuando llega · "a maybe machine" ═════════
const E11 = { arrived: T("arrived", 192), possible: T("possible", 194), certain: T("not yet certain", 195), excited: T("excited", 197.5), prize: T("not by the prize", 199.5), slot: T("slot machine is", 201.5), machine: T("maybe machine", 203) };
// objetos de vidrio de la escena 11
const B11: Beat[] = reg([
  { t: T("possible", 194), id: "h_regalo_luz", glow: N.oro, tit: "when a reward is *possible*" },
  { t: T("not by the prize", 199.5), id: "h_trofeo_apagado", glow: N.violeta, tit: "not by the *prize*" },
  { t: T("slot machine is", 201.5), id: "h_tragamonedas", glow: N.rojo, tit: "a *maybe* machine" },
]);
const Escena11: React.FC = () => <EscenaHeroes ini={192.4} fin={204.6} beats={B11} />;

export const SEGS_M03: Seg[] = [
  {
    hub: { portal: "caja", orbs: [
      { id: "caja", t: T("Skinner changed", 134), ang: -14, anillo: 0, tam: 230, D: CajaMini, png: "caja_skinner" },
      { id: "sw", t: T("one thing", 135), ang: 198, anillo: 1, tam: 170, D: Interruptor, png: "interruptor" },
      { id: "grano", t: T("food", 137.5), ang: 128, anillo: 2, tam: 150, D: Grano, png: "grano" },
    ] },
    Escena: Escena8,
    sonidos: (s) => { s.add("rodillos", E8.nothing, 0.8); s.add("rodilloFrena", E8.nothing + 1.2); for (let i = 0; i < 14; i++) s.add("tic", E8.pattern + i * 0.09, 0.5); s.add("vuelo", 143.7, 0.6); presiones(E8.pressed, E8.stopped + 1.6, 0.42).forEach((x) => s.add("palanca", x, 0.45)); s.add("traza", E8.more); s.add("vacio", E8.kept + 0.2); },
  },
  {
    hub: { portal: "barras", orbs: [
      { id: "band", t: T("stopped", 151.5), ang: 198, anillo: 1, tam: 150, D: BandejaVacia },
      { id: "matraz", t: T("Scientists", 153), ang: 128, anillo: 2, tam: 170, D: Matraz },
      { id: "barras", t: T("variable reward", 154), ang: -14, anillo: 0, tam: 240, D: BarrasVariables },
    ] },
    Escena: Escena9,
    sonidos: (s) => { s.add("neonOn", E9.maybe); s.add("vuelo", 158.3, 0.6); s.add("aparece", E9.know); s.add("ola", E9.relax, 0.5); s.add("vuelo", 162.4, 0.6); s.add("aparece", E9.dont); s.add("latido", E9.leans); s.add("sinapsis", E9.stop); },
  },
  {
    hub: { portal: "cel", orbs: [
      { id: "cer", t: T("glass brain", 168.5), ang: 198, anillo: 1, tam: 200, D: CerebroVidrio },
      { id: "lupa", t: T("Deep in the middle", 169), ang: 128, anillo: 2, tam: 170, D: Lupa, png: "lupa" },
      { id: "cel", t: T("small group of cells", 171), ang: -14, anillo: 0, tam: 220, D: Celulas, png: "neurona" },
    ] },
    Escena: Escena10,
    sonidos: (s) => { s.add("sinapsis", E10.release); s.add("sinapsis", E10.release + 0.3, 0.7); s.add("neonOn", E10.dopa); s.add("aparece", E10.pleasure); s.add("traza", E10.not, 0.8); s.add("golpe", E10.wanting, 0.6); s.add("vuelo", E10.forward, 0.6); s.add("vuelo", 185.9, 0.6); s.add("aparece", E10.monkeys); },
  },
  {
    hub: { portal: "osc", orbs: [
      { id: "mono", t: T("scientists saw", 188), ang: 198, anillo: 1, tam: 170, D: MonoChico, png: "mono" },
      { id: "osc", t: T("fire hardest", 189.5), ang: -14, anillo: 0, tam: 240, D: Osciloscopio },
      { id: "gota", t: T("reward", 191.5), ang: 128, anillo: 2, tam: 140, D: Gota, png: "dopamina" },
    ] },
    Escena: Escena11,
    sonidos: (s) => { s.add("traza", E11.arrived - 0.2); s.add("sinapsis", 192.6); s.add("tic", E11.possible); s.add("aparece", E11.arrived); s.add("vuelo", 197.3, 0.6); s.add("vuelo", 202.1, 0.6); s.add("neonOn", E11.machine); s.add("rodillos", E11.machine + 0.2, 0.6); },
  },
];
