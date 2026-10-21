// gb01 v2 · MINUTO 7 (ventanas 24-27, 402-470 s): el guardián amordazado · la hora que desaparece y una mano se la lleva ·
// el plano de la tragamonedas · el casi-premio (la tercera cereza arriba de la línea) · el medidor casi = premio ·
// el feed lleno de "casi" · la linterna que busca "el que es" · engranaje 3 encaja · la zanahoria · engranaje 4 = punto rojo ·
// la tribu alrededor del fuego.
import React from "react";
import { N, easeOut, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const tela = (x: number, y: number, w: number, h: number, r = 12) => `M${x - w / 2 + r},${y - h / 2} L${x + w / 2 - r},${y - h / 2} Q${x + w / 2},${y - h / 2} ${x + w / 2},${y - h / 2 + r} L${x + w / 2},${y + h / 2 - r} Q${x + w / 2},${y + h / 2} ${x + w / 2 - r},${y + h / 2} L${x - w / 2 + r},${y + h / 2} Q${x - w / 2},${y + h / 2} ${x - w / 2},${y + h / 2 - r} L${x - w / 2},${y - h / 2 + r} Q${x - w / 2},${y - h / 2} ${x - w / 2 + r},${y - h / 2} Z`;
const Cereza: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = N.rojo }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} style={glow(c, 8)}>
    <path d="M-14,4 Q-6,-30 10,-40 M14,6 Q12,-24 10,-40 M10,-40 Q24,-46 30,-36" fill="none" stroke={N.verde} strokeWidth={3} />
    <circle cx={-14} cy={16} r={14} fill={c} opacity={0.85} /><circle cx={16} cy={18} r={14} fill={c} opacity={0.85} />
  </g>
);

// ═════════ HUB 24 · "When the reel never ends, the guard never gets its moment to speak. And" ═════════
const CintaPasa: D = ({ t, t0, on, tam }) => {
  const off = (t * 120) % 40;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-100,-26 L100,-26 M-100,26 L100,26", a: 2.4 }]}>
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-110 + i * 40 - off} y={-20} width={28} height={40} fill="none" stroke={N.oroClaro} strokeWidth={1.6} opacity={0.8} />)}
    </Glifo>
  );
};
const GuardiaMordaza: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: circ(0, -10, 56), a: 2.6 }, { d: "M-20,-24 L-8,-24 M8,-24 L20,-24", a: 2.4 },
    { d: "M-40,6 L40,10 L38,30 L-42,26 Z", c: N.oro, a: 2.6, f: "rgba(244,194,74,.3)", dt: 0.3 },
  ]}>
    <TextoNeon y={86} texto="no puede hablar" size={20} serif color={N.texto2} on={ramp(t, t0 + 0.4, 0.3)} />
  </Glifo>
);
const RelojHora: D = ({ t, t0, on, tam }) => {
  const a = (t - t0) * 240;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: circ(0, 0, 70), a: 2.8 }]}>
      <path d={`M0,0 L${50 * Math.sin((a * Math.PI) / 180)},${-50 * Math.cos((a * Math.PI) / 180)}`} stroke={N.cianClaro} strokeWidth={4} strokeLinecap="round" />
      <path d={`M0,0 L${34 * Math.sin((a / 12 * Math.PI) / 180)},${-34 * Math.cos((a / 12 * Math.PI) / 180)}`} stroke={N.oro} strokeWidth={6} strokeLinecap="round" />
    </Glifo>
  );
};

// ═════════ ESCENA 24 · levantás la vista: una hora desapareció · no la elegiste · te la llevaron · el plano ═════════
const E24 = { look: T("you look up", 407.5), hour: T("an hour", 408.5), gone: T("has disappeared", 409), choose: T("did not choose", 410), taken: T("simply taken", 413), trick: T("another trick", 414.5), designed: T("are designed", 418) };
// objetos de vidrio de la escena 24
const B24: Beat[] = reg([
  { t: T("an hour", 408.5), id: "reloj", carpeta: "png", glow: N.violeta, tit: "desapareció una *hora*" },
  { t: T("simply taken", 413), id: "h_mano_hora", glow: N.rojo, tit: "te la *quitaron*" },
  { t: T("another trick", 414.5), id: "h_tragamonedas_corte", glow: N.cian, tit: "otro *truco*" },
]);
const Escena24: React.FC = () => <EscenaHeroes ini={W(407.3)} fin={W(419.7)} beats={B24} />;

// ═════════ HUB 25 · "that you often almost win. Two cherries, and the third one" ═════════
const CasiMedidor: D = ({ t, t0, on, tam }) => {
  const k = 0.9 * ramp(t, t0 + 0.2, 0.9, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-80,30 A80,80 0 0,1 80,30", a: 2.6 }]}>
      <path d={`M0,30 L${-70 * Math.cos(k * Math.PI)},${30 - 70 * Math.sin(k * Math.PI)}`} stroke={N.rojo} strokeWidth={5} strokeLinecap="round" style={glow(N.rojo)} />
      <TextoNeon x={72} y={50} texto="PREMIO" size={18} color={N.oroClaro} />
      <TextoNeon y={76} texto="casi" size={24} serif color={N.oroClaro} on={ramp(t, t0 + 0.3, 0.3)} />
    </Glifo>
  );
};
const DosCerezas: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[]}>
    <g opacity={ramp(t, t0, 0.3)}><Cereza x={-40} y={0} s={1.3} /><Cereza x={40} y={0} s={1.3} /></g>
  </Glifo>
);
const VentanaCasi: D = ({ t, t0, on, tam }) => {
  const ts = T("the third one", 423);
  const v = Math.max(0, 1 - Math.max(0, t - ts + 0.6) / 1.4);
  const y3 = -30 - 60 * ((t * 3 * v) % 1) * (v > 0.05 ? 1 : 0);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-96,-56 L96,-56 L96,56 L-96,56 Z M-32,-56 L-32,56 M32,-56 L32,56", a: 2.4 }, { d: "M-104,0 L104,0", c: N.rojo, a: 2, dt: 0.3 }]}>
      <defs><clipPath id="cl25"><rect x={-94} y={-54} width={188} height={108} /></clipPath></defs>
      <g clipPath="url(#cl25)"><Cereza x={-64} y={0} s={0.9} /><Cereza x={0} y={0} s={0.9} /><Cereza x={64} y={y3} s={0.9} /></g>
    </Glifo>
  );
};

// ═════════ ESCENA 25 · la cereza frena justo arriba de la línea · el casi · el medidor del cerebro casi como ganar ═════════
const E25 = { stops: T("stops just above", 423.5), near: T("The near miss", 426), studies: T("Studies have shown", 427.5), excite: T("excite the brain's", 428), reward: T("reward system", 430), real: T("real win", 432.5) };
// objetos de vidrio de la escena 25
const B25: Beat[] = reg([
  { t: T("stops just above", 423.5), id: "h_cerezas", glow: N.rojo, tit: "*justo* encima de la línea" },
  { t: T("excite the brain's", 428), id: "h_medidor_casi", glow: N.oro, tit: "casi como *ganar*" },
]);
const Escena25: React.FC = () => <EscenaHeroes ini={W(423.7)} fin={W(433.8)} beats={B25} />;

// ═════════ HUB 26 · "and they make people want to play again. The endless reel is full of near misses," ═════════
const Replay: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: "M50,-40 A64,64 0 1,0 64,10", a: 3 }, { d: "M50,-40 L54,-70 M50,-40 L22,-46", a: 3 }]}>
    <g transform={`rotate(${-t * 90})`}><path d="M-10,-14 L16,0 L-10,14 Z" fill={N.verde} /></g>
    <TextoNeon y={92} texto="otra vez" size={22} serif color={N.verde} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);
const FeedCasi: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tela(0, 0, 120, 190, 14), a: 2.6 }, { d: tela(0, -40, 96, 60, 8) + " " + tela(0, 34, 96, 60, 8), c: N.gris, a: 1.6 }]}>
    <TextoNeon y={-40} texto="casi" size={18} serif color={N.oroClaro} on={ramp(t, t0 + 0.3, 0.3)} />
    <TextoNeon y={34} texto="casi" size={18} serif color={N.oroClaro} on={ramp(t, t0 + 0.5, 0.3)} />
  </Glifo>
);
const CerezaCasi: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-80,20 L80,20", a: 2 }]}><Cereza x={0} y={-30 + 4 * Math.sin(t * 3)} s={1.4} /></Glifo>
);

// ═════════ ESCENA 26 · casi genial · casi lo que querías · una más · la linterna busca "el que es" · nunca llega · el diseño ═════════
const E26 = { video: T("a video that", 439.5), great: T("almost great", 440), post: T("a post that", 442), wanted: T("what you wanted", 443), scroll: T("scroll one more", 444), looking: T("looking for the", 447), satisfy: T("finally satisfy", 448), never: T("It never comes", 450.5), design: T("That is the design", 451) };
// objetos de vidrio de la escena 26
const B26: Beat[] = reg([
  { t: T("almost great", 440), id: "h_estrellas_casi", glow: N.oro, tit: "*casi* genial" },
  { t: T("scroll one more", 444), id: "h_linterna", glow: N.cian, tit: "una vez *más*" },
  { t: T("It never comes", 449.6), id: "h_horizonte", glow: N.violeta, tit: "*nunca* llega" },
]);
const Escena26: React.FC = () => <EscenaHeroes ini={W(439.7)} fin={W(453.5)} beats={B26} />;

// ═════════ HUB 27 · "That is the third gear, the endless reel. No door," ═════════
const MarcoTres: D = ({ t, t0, on, tam }) => {
  const enc = ramp(t, t0 + 0.4, 0.5, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-96,-50 L96,-50 L96,50 L-96,50 Z", a: 2.2 }, ...[0, 1, 2, 3].map((i): Trazo => ({ d: circ(-66 + i * 44, 0, 18), c: i < 3 ? N.oro : N.gris, a: 1.6, dt: 0.06 * i }))]}>
      {[0, 1].map((i) => <g key={i} transform={`translate(${-66 + i * 44},0) rotate(${(i ? -1 : 1) * t * 80}) scale(0.22)`}><EngranajeSvg r={70} color={N.oro} /></g>)}
      <g transform={`translate(22,${-80 * (1 - enc)}) rotate(${t * 80}) scale(0.22)`} opacity={enc}><EngranajeSvg r={70} color={N.oro} n={3} /></g>
    </Glifo>
  );
};
const BucleCinta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M0,0 C40,-60 90,-60 90,0 C90,60 40,60 0,0 C-40,-60 -90,-60 -90,0 C-90,60 -40,60 0,0 Z", a: 3 }]}>
    <circle cx={90 * Math.sin(t * 2)} cy={40 * Math.sin(t * 4)} r={8} fill={N.oroClaro} style={glow(N.oro)} />
  </Glifo>
);
const SinPuerta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[{ d: "M-40,70 L-40,-70 L40,-70 L40,70", a: 2.6 }, { d: "M-74,-74 L74,74", c: N.rojo, a: 3.4, dt: 0.3 }]} />
);

// ═════════ ESCENA 27 · sin última página · la zanahoria del "el próximo va a ser mejor" · engranaje 4 = punto rojo · la tribu ═════════
const E27 = { nolast: T("no last page", 457.5), feeling: T("always the feeling", 459.5), next: T("the next one", 460.5), better: T("be better", 462), fourth: T("The fourth gear", 463), red: T("the red dot", 464), tribal: T("tribal animals", 466.5), history: T("For most of", 468) };
// objetos de vidrio de la escena 27
const B27: Beat[] = reg([
  { t: T("always the feeling", 459.5), id: "h_zanahoria_palo", glow: N.oro, tit: "la siguiente será *mejor*" },
  { t: T("The fourth gear", 463), id: "h_punto_rojo", glow: N.rojo, tit: "engranaje cuatro, el *punto rojo*" },
  { t: T("tribal animals", 466.5), id: "h_fogata", glow: N.oro, tit: "animales *tribales*" },
]);
const Escena27: React.FC = () => <EscenaHeroes ini={W(457.9)} fin={W(470.2)} beats={B27} />;

export const SEGS_M07: Seg[] = [
  {
    hub: { portal: "reloj", orbs: [
      { id: "cinta", t: T("the reel never", 402), ang: 198, anillo: 1, tam: 170, D: CintaPasa },
      { id: "guardia", t: T("the guard never", 404.5), ang: 128, anillo: 2, tam: 190, D: GuardiaMordaza },
      { id: "reloj", t: T("moment to speak", 405.5), ang: -14, anillo: 0, tam: 230, D: RelojHora, png: "reloj" },
    ] },
    Escena: Escena24,
    sonidos: (s) => { s.add("aparece", E24.look, 0.5); s.add("vuelo", W(408.6), 0.5); s.add("maquinaGira", E24.hour, 0.5); s.add("grieta", E24.gone + 0.6, 0.6); s.add("tiron", E24.taken, 0.6); s.add("vacio", E24.taken + 0.6, 0.5); s.add("vuelo", W(414.8), 0.5); s.add("neonOn", E24.trick + 0.3); s.add("traza", E24.designed - 0.3); },
  },
  {
    hub: { portal: "ventana", orbs: [
      { id: "casi", t: T("almost win", 420), ang: 198, anillo: 1, tam: 170, D: CasiMedidor },
      { id: "dos", t: T("Two cherries", 421.5), ang: 128, anillo: 2, tam: 170, D: DosCerezas, png: "cereza" },
      { id: "ventana", t: T("the third one", 423) - 0.6, ang: -14, anillo: 0, tam: 250, D: VentanaCasi },
    ] },
    Escena: Escena25,
    sonidos: (s) => { s.add("rodillos", E25.stops - 1.0, 0.6); s.add("rodilloFrena", E25.stops + 0.6); s.add("vacio", E25.near - 0.1, 0.6); s.add("aviso", E25.near, 0.4); s.add("vuelo", W(427.9), 0.5); s.add("sinapsis", E25.excite); s.add("traza", E25.excite + 0.1, 0.5); s.add("premio", E25.real, 0.4); },
  },
  {
    hub: { portal: "feed", orbs: [
      { id: "replay", t: T("play again", 435), ang: 198, anillo: 1, tam: 160, D: Replay },
      { id: "cer", t: T("The endless", 436.5), ang: 128, anillo: 2, tam: 150, D: CerezaCasi },
      { id: "feed", t: T("near misses", 438.5), ang: -14, anillo: 0, tam: 240, D: FeedCasi },
    ] },
    Escena: Escena26,
    sonidos: (s) => { s.add("aparece", E26.video); s.add("tic", E26.great, 0.5); s.add("vuelo", W(442.6), 0.5); s.add("aparece", E26.post); s.add("vacio", E26.wanted, 0.5); s.add("tiron", E26.scroll, 0.6); s.add("vuelo", W(447.0), 0.5); s.add("luz", E26.looking, 0.6); s.add("neonOn", E26.satisfy, 0.6); s.add("vacio", E26.never + 0.3, 0.6); s.add("golpe", E26.design + 0.15, 0.7); },
  },
  {
    hub: { portal: "marco3", orbs: [
      { id: "marco3", t: T("third gear", 453.5), ang: -14, anillo: 0, tam: 250, D: MarcoTres },
      { id: "bucle", t: T("the endless reel", 454), ang: 198, anillo: 1, tam: 170, D: BucleCinta },
      { id: "puerta", t: T("No door", 456.5), ang: 128, anillo: 2, tam: 150, D: SinPuerta },
    ] },
    Escena: Escena27,
    sonidos: (s) => { s.add("engranaje", W(454.0) + 0.4); s.add("tiron", E27.nolast, 0.5); s.add("vuelo", W(459.9), 0.5); s.add("aparece", E27.next, 0.6); s.add("vuelo", W(463.5), 0.5); s.add("engranaje", E27.fourth + 0.3); s.add("aviso", E27.red); s.add("vuelo", W(466.4), 0.5); s.add("luz", E27.tribal, 0.6); },
  },
];
