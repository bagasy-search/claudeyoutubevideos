// gb01 v2 · MINUTO 5 (ventanas 16-19, 268-336 s): el inventor arrepentido · la palanca es lo FÁCIL (casino lejos vs
// celular en la mano) · el pergamino de los monjes: gatillo → acción → premio · el sendero que se vuelve autopista ·
// el aburrimiento como gatillo · la mano le gana a la mente · el engranaje 2 encaja.
import React from "react";
import { N, lerp, ramp } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import { } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const tachar = (dt: number): Trazo => ({ d: "M-74,-74 L74,74", c: N.rojo, a: 3.4, dt });

// ═════════ HUB 16 · "…that he wished it had not become so addictive. But the lever is not only" ═════════
const CitaCard: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-90,-56 L90,-56 L90,46 L-30,46 L-56,70 L-56,46 L-90,46 Z", a: 2.4 },
    { d: "M-60,-24 L60,-24 M-60,-4 L40,-4 M-60,16 L20,16", c: N.gris, a: 1.6 },
  ]}>
    <TextoNeon x={-70} y={-62} texto="“" size={60} serif color={N.oro} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);
const Alerta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M0,-70 L76,60 L-76,60 Z", a: 2.8, f: "rgba(255,42,72,.08)" }]}>
    <TextoNeon y={18} texto="!" size={70} color={N.rojoBorde} on={Math.floor(t * 4) % 2 ? 1 : 0.4} />
    <TextoNeon y={92} texto="addictive" size={22} serif color={N.rojoBorde} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);
const PalancaGrande: D = ({ t, t0, on, tam }) => {
  const pl = 0.5 + 0.5 * Math.sin(t * 2.4);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-40,90 L40,90 L40,50 L-40,50 Z", a: 2.6 }]}>
      <path d={`M0,50 L${lerp(-20, 30, pl)},${lerp(-60, -40, pl)}`} stroke={N.oro} strokeWidth={8} strokeLinecap="round" style={glow(N.oro)} />
      <circle cx={lerp(-20, 30, pl)} cy={lerp(-78, -58, pl)} r={22} fill={N.rojo} style={glow(N.rojo)} />
    </Glifo>
  );
};

// ═════════ ESCENA 16 · la palanca es lo fácil: el casino lejos (ruta, auto, plata) vs el celular en la mano ═════════
const E16 = { easy: T("how easy", 275), casino: T("real slot machine", 276), drive: T("drive there", 280), money: T("need money", 281), pocket: T("in your pocket", 282), hand: T("in your hand", 284) };
// objetos de vidrio de la escena 16
const B16: Beat[] = reg([
  { t: T("real slot machine", 276), id: "h_casino", glow: N.oro, tit: "a real *casino*" },
  { t: T("drive there", 280), id: "h_auto_ruta", glow: N.violeta, tit: "drive there, bring *money*" },
  { t: T("in your hand", 284), id: "h_celu_mano", glow: N.cian, tit: "the phone is in your *hand*" },
]);
const Escena16: React.FC = () => <EscenaHeroes ini={273.3} fin={285.8} beats={B16} />;

// ═════════ HUB 17 · "No door, no drive, no cost. The lever is always one second away." ═════════
const Puerta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[{ d: "M-40,70 L-40,-70 L40,-70 L40,70", a: 2.6 }, { d: circ(24, 0, 5), a: 2.4 }, tachar(0.3)]} />
);
const Auto: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[
    { d: "M-70,20 L-70,0 L-42,-30 L36,-30 L60,0 L74,4 L74,20 Z", a: 2.6 }, { d: circ(-40, 24, 13) + " " + circ(44, 24, 13), a: 2.4 }, tachar(0.3),
  ]} />
);
const Dolar: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: circ(0, 0, 56), a: 2.6 }, tachar(0.3)]}>
    <TextoNeon y={4} texto="$" size={64} color={N.verde} />
  </Glifo>
);
const Crono1s: D = ({ t, t0, on, tam }) => {
  const a = ((t - t0) % 1) * 360;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: circ(0, 10, 70), a: 2.8 }, { d: "M-14,-66 L14,-66 M0,-66 L0,-58", a: 2.6 }]}>
      <path d={`M0,10 L${60 * Math.sin((a * Math.PI) / 180)},${10 - 60 * Math.cos((a * Math.PI) / 180)}`} stroke={N.oro} strokeWidth={5} strokeLinecap="round" style={glow(N.oro)} />
      <TextoNeon y={112} texto="1 second" size={24} serif color={N.oroClaro} on={ramp(t, T("one second away", 289.5), 0.3)} />
    </Glifo>
  );
};

// ═════════ ESCENA 17 · el pergamino de los monjes: un hábito vive en tres lugares ═════════
const E17 = { monks: T("old monks", 292), long: T("long before", 294), habit: T("habit lives in", 296), three: T("three places", 297), trigger: T("The trigger", 298.5), action: T("the action", 299.5), reward: T("and the reward", 300.5) };
// objetos de vidrio de la escena 17
const B17: Beat[] = reg([
  { t: T("old monks", 292), id: "h_pergamino", glow: N.oro, tit: "what the old *monks* knew" },
  { t: T("three places", 297), id: "h_tres_esferas", glow: N.violeta, tit: "trigger, action, *reward*" },
]);
const Escena17: React.FC = () => <EscenaHeroes ini={291.5} fin={302.0} beats={B17} />;

// ═════════ HUB 18 · "Something happens. You do something, and you feel something." (el bucle orbita al monje) ═════════
const NodoBucle = (i: number): D => ({ t, t0, on, tam }) => {
  const c = [N.cianClaro, N.oroClaro, N.oro][i];
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={c} trazos={[{ d: circ(0, 0, 70), a: 3, f: "rgba(5,5,6,.6)" }, { d: "M60,-50 L84,-74 M74,-46 L84,-74 L56,-70", a: 2.4, dt: 0.3 }]}>
      {i === 0 && <><path d="M-26,14 Q-26,-30 0,-30 Q26,-30 26,14 L34,22 L-34,22 Z" fill="none" stroke={c} strokeWidth={4} /><circle cx={0} cy={30} r={6} fill={c} /></>}
      {i === 1 && <path d="M-20,30 L-20,-10 Q-20,-30 -6,-30 L-6,-4 M-6,-30 Q0,-40 8,-30 L8,-4 M8,-26 Q16,-34 22,-24 L22,10 Q22,40 0,40 Q-20,40 -20,30 Z" fill="none" stroke={c} strokeWidth={4} />}
      {i === 2 && Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2 + t * 2; return <path key={k} d={`M${Math.cos(a) * 12},${Math.sin(a) * 12} L${Math.cos(a) * 36},${Math.sin(a) * 36}`} stroke={c} strokeWidth={4} strokeLinecap="round" />; })}
      <TextoNeon y={100} texto={["happens", "you do", "you feel"][i]} size={22} serif color={c} on={ramp(t, t0 + 0.2, 0.3)} />
    </Glifo>
  );
};

// ═════════ ESCENA 18 · campana → mano → chispa · x90 al día · por años · el sendero se vuelve autopista ═════════
const E18 = { notif: T("notification sound", 306), pick: T("pick up the", 308), spark: T("small spark", 310), repeat: T("Repeat this", 311.5), years: T("for years", 313.5), path: T("the path in", 314), highway: T("a highway", 316), after: T("After a while", 318) };
const B18: Beat[] = reg([
  { t: T("notification sound", 306), id: "h_campana", glow: N.oro, tit: "a *sound*" },
  { t: T("small spark", 310), id: "h_chispa", glow: N.rojo, tit: "a small *spark*" },
  { t: T("path in", 314), id: "h_autopista", glow: N.cian, tit: "the path becomes a *highway*" },
]);
const Escena18: React.FC = () => <EscenaHeroes ini={306.3} fin={319.8} beats={B18} />;

// ═════════ HUB 19 · "don't even need the sound. Boredom becomes the trigger." ═════════
const CampanaTachada: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-40,26 Q-40,-50 0,-50 Q40,-50 40,26 L54,40 L-54,40 Z", a: 2.6 }, tachar(0.3)]} />
);
const NubeAburrida: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-80,30 Q-110,-10 -70,-30 Q-60,-70 -10,-60 Q30,-90 60,-50 Q110,-50 96,0 Q110,40 60,40 L-60,40 Q-80,40 -80,30 Z", a: 2.6, f: "rgba(183,123,255,.05)" },
    { d: "M-34,-6 L-14,-6 M14,-6 L34,-6 M-20,18 L20,18", a: 2.6, dt: 0.3 },
  ]}>
    <TextoNeon x={90 + 6 * Math.sin(t * 2)} y={-70 - ((t * 20) % 30)} texto="z" size={26} color={N.violeta} on={0.7} />
  </Glifo>
);
const Gatillo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-60,-20 L40,-20 L60,0 L40,20 L-60,20 Z", a: 2.6, f: "rgba(255,42,72,.08)" }]}>
    <TextoNeon x={-8} y={2} texto="TRIGGER" size={22} color={N.rojoBorde} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 19 · carrusel de gatillos: un momento quieto · la pava · la mano le gana a la mente · engranaje 2 ═════════
const E19 = { quiet: T("quiet moment", 323), kettle: T("Waiting for the kettle", 325.5), boil: T("to boil becomes", 327), hand: T("hand moves before", 329.5), mind: T("your mind has", 330.5), decided: T("decided anything", 331.5), second: T("the second gear", 333.5), lever: T("the lever", 334.5) };
// objetos de vidrio de la escena 19
const B19: Beat[] = reg([
  { t: T("quiet moment", 323), id: "h_silla", glow: N.violeta, tit: "a *quiet* moment" },
  { t: T("Waiting for the kettle", 325.5), id: "pava", carpeta: "png", glow: N.oro, tit: "the *kettle*" },
  { t: T("hand moves before", 329.5), id: "h_mano_rapida", glow: N.rojo, tit: "the hand moves *first*" },
  { t: T("second gear", 333), id: "h_engranaje", glow: N.oro, tit: "the second gear, the *lever*", luz: 2.2 },
]);
const Escena19: React.FC = () => <EscenaHeroes ini={323.2} fin={336.3} beats={B19} />;

export const SEGS_M05: Seg[] = [
  {
    hub: { portal: "palanca", orbs: [
      { id: "cita", t: T("he wished", 268), ang: 198, anillo: 1, tam: 190, D: CitaCard },
      { id: "alerta", t: T("so addictive", 269), ang: 128, anillo: 2, tam: 170, D: Alerta },
      { id: "palanca", t: T("the lever is", 272), ang: -14, anillo: 0, tam: 240, D: PalancaGrande, png: "palanca" },
    ] },
    Escena: Escena16,
    sonidos: (s) => { s.add("aparece", E16.easy, 0.6); s.add("traza", E16.easy + 0.1, 0.6); s.add("vuelo", 277.3, 0.6); s.add("neonOn", E16.casino + 0.2); s.add("vuelo", 279.6, 0.5); s.add("tiron", E16.drive - 0.3, 0.6); s.add("aparece", E16.money); s.add("digito", E16.pocket, 0.6); s.add("vueloLargo", E16.hand - 0.2, 0.7); s.add("golpe", E16.hand + 0.6, 0.5); },
  },
  {
    hub: { portal: "crono", orbs: [
      { id: "puerta", t: T("No door", 285.3), ang: 200, anillo: 1, tam: 150, D: Puerta, png: "puerta" },
      { id: "auto", t: T("no drive", 286), ang: 130, anillo: 2, tam: 170, D: Auto },
      { id: "dolar", t: T("no cost", 287), ang: 40, anillo: 2, tam: 140, D: Dolar },
      { id: "crono", t: T("always one second", 289), ang: -14, anillo: 0, tam: 240, D: Crono1s },
    ] },
    Escena: Escena17,
    sonidos: (s) => { s.add("traza", 285.9, 0.5); s.add("traza", 287.0, 0.5); s.add("traza", 288.1, 0.5); s.add("tic", T("one second away", 289.5)); s.add("tiron", E17.monks - 0.2, 0.7); s.add("hilo", E17.monks + 0.6, 0.5); s.add("aparece", E17.three, 0.6); s.add("aviso", E17.trigger); s.add("toque", E17.action); s.add("sinapsis", E17.reward); },
  },
  {
    hub: { portal: "n2", orbs: [0, 1, 2].map((i) => ({ id: "n" + i, t: [T("Something happens", 302), T("You do something", 303), T("feel something", 304.5)][i], ang: -14 + i * 120, anillo: 0 as const, tam: 190, D: NodoBucle(i) })) },
    Escena: Escena18,
    sonidos: (s) => { s.add("aviso", E18.notif); s.add("vuelo", 308.1, 0.5); s.add("tiron", E18.pick); s.add("vuelo", 310.0, 0.5); s.add("sinapsis", E18.spark); s.add("vuelo", 311.6, 0.5); for (let i = 0; i < 12; i++) s.add("tic", E18.repeat + i * 0.33, 0.4); s.add("digito", E18.years, 0.6); s.add("vueloLargo", 315.7, 0.6); s.add("luz", E18.highway); s.add("ola", E18.highway + 0.3, 0.5); },
  },
  {
    hub: { portal: "nube", orbs: [
      { id: "campana", t: T("need the sound", 319), ang: 198, anillo: 1, tam: 160, D: CampanaTachada },
      { id: "nube", t: T("Boredom becomes", 321), ang: -14, anillo: 0, tam: 250, D: NubeAburrida },
      { id: "gat", t: T("the trigger", 322), ang: 128, anillo: 2, tam: 170, D: Gatillo },
    ] },
    Escena: Escena19,
    sonidos: (s) => { s.add("aparece", E19.quiet, 0.5); s.add("aviso", E19.quiet + 0.6, 0.6); s.add("golpe", E19.quiet + 0.9, 0.5); s.add("vuelo", 325.9, 0.5); s.add("ola", E19.boil, 0.4); s.add("aviso", E19.boil + 0.3, 0.6); s.add("golpe", E19.boil + 0.6, 0.5); s.add("vuelo", 329.5, 0.5); s.add("tiron", E19.hand); s.add("vuelo", 333.5, 0.5); s.add("engranaje", E19.second + 0.3); s.add("golpe", E19.second + 0.8, 0.6); },
  },
];
