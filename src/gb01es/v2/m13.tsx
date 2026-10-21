// gb01 v2 · MINUTO 13 (ventanas 48-51, 803-870 s): pará y notá · ¿dónde sentís las ganas? (mapa del cuerpo) · respirá · mirala
// como una ola que llega a la playa · el secreto: la gana sube, hace pico y baja en 1-2 min · la autopista se angosta, tu camino
// se ensancha · no hace falta ser perfecto · ni tirar el celular al río · ola tras ola · semanas · la tragamonedas se vuelve herramienta.
import React from "react";
import { N, lerp, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const PIEL = "#e6eeff";
const MAR = N.cian;
const tel = (w: number, h: number, r = 18) => `M${-w / 2 + r},${-h / 2} L${w / 2 - r},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + r} L${w / 2},${h / 2 - r} Q${w / 2},${h / 2} ${w / 2 - r},${h / 2} L${-w / 2 + r},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - r} L${-w / 2},${-h / 2 + r} Q${-w / 2},${-h / 2} ${-w / 2 + r},${-h / 2} Z`;
// cuerpo entero (silueta) en coordenadas locales, alto ~520
const CUERPO = "M0,-260 Q34,-260 34,-222 Q34,-186 0,-184 Q-34,-186 -34,-222 Q-34,-260 0,-260 Z M-70,-160 Q0,-180 70,-160 Q96,-150 100,-110 L120,40 Q122,56 108,58 Q96,58 92,44 L74,-80 L70,80 L60,250 Q58,262 44,262 Q30,262 30,250 L20,90 L-20,90 L-30,250 Q-30,262 -44,262 Q-58,262 -60,250 L-70,80 L-74,-80 L-92,44 Q-96,58 -108,58 Q-122,56 -120,40 L-100,-110 Q-96,-150 -70,-160 Z";
// una ola: y(x) para dibujar el mar
const olaPath = (x0: number, x1: number, y: (x: number) => number, base = 300) => { let d = `M${x0},${base}`; for (let x = x0; x <= x1; x += 20) d += ` L${x},${y(x).toFixed(1)}`; return d + ` L${x1},${base} Z`; };

// ═════════ HUB 48 · "Just stop and notice. Where do you feel the urge?" ═════════
const PalmaStop: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-40,80 L-40,-20 M-40,-20 L-40,-70 M-14,-20 L-14,-90 M12,-20 L12,-92 M38,-20 L38,-70 M-40,80 L44,80 L44,-20 M-40,0 Q-70,-10 -76,-40", a: 3 }]} />
);
const OjoNota: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-80,0 Q0,-56 80,0 Q0,56 -80,0 Z", a: 2.6 }, { d: circ(0, 0, 20), a: 2.6 }]}>
    <circle r={8 + 2 * Math.sin(t * 3)} fill={N.cianClaro} />
  </Glifo>
);
const CuerpoHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[]}>
    <g transform="scale(0.34)"><path d={CUERPO} fill="rgba(5,5,6,.85)" stroke={PIEL} strokeWidth={8} /></g>
    {[[38, 14], [0, -40], [0, -76]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={N.rojo} opacity={(Math.sin(t * 4 + i * 2) + 1) / 2} style={glow(N.rojo, 8)} />)}
  </Glifo>
);

// ═════════ ESCENA 48 · ¿en la mano? ¿en el pecho? ¿detrás de los ojos? · respirá despacio · como una ola que llega a la playa · el secreto ═════════
const E48 = { hand: T("In your hand", 807.5), chest: T("In your chest", 808.5), eyes: T("behind your eyes", 810.5), breathe: T("Breathe once", 811.5), slowly: T("slowly, and", 813.5), wave: T("watch a wave", 815), beach: T("the beach", 817.5), secret: T("the secret", 819) };
// objetos de vidrio de la escena 48
const B48: Beat[] = reg([
  { t: T("In your hand", 807.5), id: "h_silueta_puntos", glow: N.violeta, tit: "¿dónde lo *sientes*?" },
  { t: T("Breathe once", 811.5), id: "h_pulmones", glow: N.cian, tit: "*respira*" },
  { t: T("watch a wave", 815), id: "h_ola_playa", glow: N.cian, tit: "mira la *ola*" },
]);
const Escena48: React.FC = () => <EscenaHeroes ini={W(807.8)} fin={W(820.4)} beats={B48} />;

// ═════════ HUB 49 · "An urge is like a wave. It rises," ═════════
const PicoRojo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-90,50 L-40,50 L-20,-70 L0,60 L20,20 L90,20", a: 3 }]} />
);
const Sube: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MAR} trazos={[{ d: "M-80,60 Q-20,60 0,-20 Q20,-80 60,-60", a: 3 }, { d: "M40,-80 L62,-60 L36,-44", a: 3 }]} />
);
const OlaHub: D = ({ t, t0, on, tam }) => {
  const y = (x: number) => 30 - 50 * Math.exp(-(x ** 2) / 1500) * (0.6 + 0.4 * Math.sin(t * 2)) + 6 * Math.sin(x / 14 + t * 3);
  return <Glifo t={t} t0={t0} on={on} tam={tam} color={MAR} trazos={[]}><path d={olaPath(-90, 90, y, 70)} fill="rgba(80,200,255,.15)" stroke={MAR} strokeWidth={4} /></Glifo>;
};

// ═════════ ESCENA 49 · sube, hace pico, baja si no la alimentás · en uno o dos minutos · cada ola que mirás pasar sin obedecer ═════════
const E49 = { peak: T("reaches a peak", 823), feed: T("do not feed", 826.5), falls: T("it falls", 827.5), minute: T("a minute or", 829.5), every: T("Every time", 831), pass: T("wave pass without", 831), obey: T("obeying it", 833.5) };
// objetos de vidrio de la escena 49
const B49: Beat[] = reg([
  { t: T("reaches a peak", 823), id: "h_ola_pico", glow: N.cian, tit: "llega al *pico*" },
  { t: T("it falls", 827.5), id: "h_ola_calma", glow: N.cian, tit: "después *baja*" },
  { t: T("Every time", 831), id: "h_sendero", glow: N.oro, tit: "tu camino se *ensancha*" },
]);
const Escena49: React.FC = () => <EscenaHeroes ini={W(824.2)} fin={W(834.9)} beats={B49} />;

// ═════════ HUB 50 · "the highway in your brain gets a little narrower, and the path to your own choice gets a little wider." ═════════
const AutopistaAngosta: D = ({ t, t0, on, tam }) => {
  const w = lerp(70, 22, ramp(t, t0 + 0.4, 1.4));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojoBorde} trazos={[]}>
      <path d={`M${-w},90 L${-w * 0.3},-90 L${w * 0.3},-90 L${w},90 Z`} fill="rgba(255,42,72,.1)" stroke={N.rojoBorde} strokeWidth={3} />
      <path d="M0,80 L0,60 M0,30 L0,10 M0,-20 L0,-40" stroke={N.rojoBorde} strokeWidth={3} />
    </Glifo>
  );
};
const CaminoAncho: D = ({ t, t0, on, tam }) => {
  const w = lerp(12, 60, ramp(t, t0 + 0.4, 1.4));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[]}>
      <path d={`M${-w},90 Q${-w - 30},0 ${-w * 0.4},-90 L${w * 0.4},-90 Q${w - 30},0 ${w},90 Z`} fill="rgba(80,255,170,.1)" stroke={N.verde} strokeWidth={3} />
    </Glifo>
  );
};
const Bifurca: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M0,90 L0,10 Q0,-20 -50,-80 M0,10 Q0,-20 50,-80", a: 1.6, c: N.gris }]}>
    <path d="M0,90 L0,10 Q0,-20 -50,-80" fill="none" stroke={N.rojoBorde} strokeWidth={lerp(14, 4, ramp(t, t0 + 0.3, 1))} />
    <path d="M0,10 Q0,-20 50,-80" fill="none" stroke={N.verde} strokeWidth={lerp(4, 14, ramp(t, t0 + 0.3, 1))} style={glow(N.verde, 8)} />
  </Glifo>
);

// ═════════ ESCENA 50 · no hace falta ser perfecto · ni tirarlo al río · ola tras ola · en unas semanas · algo raro ═════════
const E50 = { perfect: T("to be perfect", 841.5), throw: T("throw your phone", 843.5), river: T("the river", 844), one: T("begin with one", 846.5), another: T("then another", 848), weeks: T("In a few", 849.5), strange: T("something strange", 851) };
// objetos de vidrio de la escena 50
const B50: Beat[] = reg([
  { t: T("to be perfect", 841.5), id: "h_taza", glow: N.oro, tit: "no *perfecto*" },
  { t: T("throw your phone", 843.5), id: "h_rio_celu", glow: N.cian, tit: "no hace falta *tirarlo*" },
  { t: T("begin with one", 846.5), id: "h_olas_serie", glow: N.cian, tit: "una ola, después *otra*" },
  { t: T("something strange", 851), id: "h_cerebro_calmo", glow: N.violeta, tit: "algo *extraño*" },
]);
const Escena50: React.FC = () => <EscenaHeroes ini={W(841.3)} fin={W(852.6)} beats={B50} />;

// ═════════ HUB 51 · "The phone will still be there in your pocket, but it will feel less like" ═════════
const BolsilloCel: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-70,-30 L70,-30 L70,40 Q70,90 0,90 Q-70,90 -70,40 Z", a: 2.6 }]}>
    <path d={tel(50, 90, 10)} transform="translate(0,-40)" fill="rgba(5,5,6,.95)" stroke={N.cianClaro} strokeWidth={3} />
    <path d="M-70,-30 L70,-30" stroke={PIEL} strokeWidth={3} />
  </Glifo>
);
const FantasmaSlot: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.gris} trazos={[{ d: "M-60,-70 L60,-70 L60,80 L-60,80 Z M-44,-40 L44,-40 L44,10 L-44,10 Z M60,-30 L80,-30 L80,-70", a: 2.2 }]}>
    <g opacity={0.4 + 0.3 * Math.sin(t * 2)}><TextoNeon y={-14} texto="7 7 ?" size={22} color={N.texto2} /></g>
  </Glifo>
);
const SlotACel: D = ({ t, t0, on, tam }) => {
  const m = (Math.sin(t * 1.6) + 1) / 2;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[]}>
      <rect x={lerp(-70, -46, m)} y={lerp(-80, -84, m)} width={lerp(140, 92, m)} height={lerp(160, 168, m)} rx={lerp(6, 16, m)} fill="rgba(5,5,6,.9)" stroke={m > 0.5 ? N.cianClaro : N.rojo} strokeWidth={4} />
      <path d={`M${lerp(70, 46, m)},-40 L${lerp(92, 46, m)},-40 L${lerp(92, 46, m)},-70`} fill="none" stroke={N.rojo} strokeWidth={3} opacity={1 - m} />
    </Glifo>
  );
};

// ═════════ ESCENA 51 · menos tragamonedas, más herramienta · lo agarrás cuando elegís, lo soltás cuando terminás · una última mirada al cerebro de vidrio ═════════
const E51 = { slot: T("slot machine and", 857), meant: T("meant to be", 859), tool: T("a tool", 860), pick: T("you pick up", 862), choose: T("when you choose", 863), down: T("and put down", 864), done: T("you are done", 865), look: T("Let us look", 867), glass: T("glass brain", 869) };
// objetos de vidrio de la escena 51
const B51: Beat[] = reg([
  { t: T("a tool", 860), id: "h_herramienta2", glow: N.oro, tit: "una *herramienta*" },
  { t: T("you pick up", 862), id: "h_mano_deja", glow: N.cian, tit: "suéltalo cuando *termines*" },
  { t: T("Let us look", 867), id: "h_cerebro_giro", glow: N.oro, tit: "una última *mirada*" },
]);
const Escena51: React.FC = () => <EscenaHeroes ini={W(857.3)} fin={W(870.3)} beats={B51} />;

export const SEGS_M13: Seg[] = [
  {
    hub: { portal: "cuerpo", orbs: [
      { id: "stop", t: T("stop and notice", 803), ang: 198, anillo: 1, tam: 160, D: PalmaStop },
      { id: "ojo", t: T("notice. Where", 804.5), ang: 128, anillo: 2, tam: 150, D: OjoNota },
      { id: "cuerpo", t: T("feel the urge", 805), ang: -14, anillo: 0, tam: 240, D: CuerpoHub },
    ] },
    Escena: Escena48,
    sonidos: (s) => { s.add("latido", E48.hand + 0.1, 0.4); s.add("latido", E48.chest + 0.1, 0.4); s.add("sinapsis", E48.eyes + 0.1, 0.4); s.add("vuelo", W(812.0), 0.5); s.add("ola", E48.breathe, 0.4); s.add("vuelo", W(815.4), 0.5); s.add("ola", E48.wave, 0.5); s.add("luz", E48.secret, 0.5); },
  },
  {
    hub: { portal: "ola", orbs: [
      { id: "pico", t: T("An urge is", 820.5), ang: 198, anillo: 1, tam: 160, D: PicoRojo },
      { id: "ola", t: T("like a wave", 821.5), ang: -14, anillo: 0, tam: 240, D: OlaHub, png: "ola" },
      { id: "sube", t: T("It rises", 822.5), ang: 128, anillo: 2, tam: 160, D: Sube },
    ] },
    Escena: Escena49,
    sonidos: (s) => { s.add("traza", E49.peak - 0.5, 0.5); s.add("ola", E49.peak, 0.5); s.add("ola", E49.falls, 0.4); s.add("tic", E49.minute, 0.5); s.add("vuelo", W(831.5), 0.5); s.add("ola", E49.pass - 0.3, 0.6); },
  },
  {
    hub: { portal: "bifurca", orbs: [
      { id: "auto", t: T("highway in your", 834), ang: 198, anillo: 1, tam: 160, D: AutopistaAngosta },
      { id: "camino", t: T("path to your", 838), ang: 128, anillo: 2, tam: 160, D: CaminoAncho },
      { id: "bifurca", t: T("a little wider", 839.5), ang: -14, anillo: 0, tam: 240, D: Bifurca },
    ] },
    Escena: Escena50,
    sonidos: (s) => { s.add("traza", E50.perfect + 0.3, 0.5); s.add("vuelo", W(843.8), 0.5); s.add("vueloLargo", E50.throw + 0.2, 0.4); s.add("golpe", E50.river + 0.4, 0.5); s.add("vuelo", W(846.4), 0.5); [E50.one + 0.3, E50.another - 0.2, E50.another + 0.3, E50.another + 0.7, E50.another + 1.1].forEach((x) => s.add("ola", x, 0.3)); s.add("vuelo", W(849.9), 0.5); [0, 1, 2, 3].forEach((i) => s.add("tic", E50.weeks + i * 0.35, 0.4)); s.add("luz", E50.strange, 0.5); },
  },
  {
    hub: { portal: "slotcel", orbs: [
      { id: "bols", t: T("in your pocket", 854.5), ang: 198, anillo: 1, tam: 160, D: BolsilloCel },
      { id: "fant", t: T("feel less like", 856), ang: 128, anillo: 2, tam: 160, D: FantasmaSlot },
      { id: "slotcel", t: T("feel less like", 856) + 0.4, ang: -14, anillo: 0, tam: 240, D: SlotACel },
    ] },
    Escena: Escena51,
    sonidos: (s) => { s.add("rodillos", E51.slot, 0.4); s.add("vidrio", E51.meant, 0.5); s.add("aparece", E51.tool, 0.5); s.add("vuelo", W(862.8), 0.5); s.add("toque", E51.choose, 0.5); s.add("toque", E51.done + 0.3, 0.5); s.add("vuelo", W(867.4), 0.5); s.add("traza", E51.look, 0.5); s.add("engranaje", E51.glass, 0.5); },
  },
];
