// gb01 v2 · MINUTO 12 (ventanas 44-47, 736-803 s): segundo: la palanca pesada · apps a una carpeta lejana · logout · pantalla en
// gris (los caramelos pierden el color) · cada paso de esfuerzo despierta al guardián · tercero: tus propias puertas · escribir la
// última página · 10 minutos · la puerta más vieja: el celular duerme en la cocina · la práctica · nubes · urge surfing.
import React from "react";
import { N, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const PIEL = "#e6eeff";
const tel = (w: number, h: number, r = 18) => `M${-w / 2 + r},${-h / 2} L${w / 2 - r},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + r} L${w / 2},${h / 2 - r} Q${w / 2},${h / 2} ${w / 2 - r},${h / 2} L${-w / 2 + r},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - r} L${-w / 2},${-h / 2 + r} Q${-w / 2},${-h / 2} ${-w / 2 + r},${-h / 2} Z`;
const APPC = [N.rojo, N.violeta, N.oro, N.verde, N.cian, "#ff7ad9", N.oroClaro, N.rojoBorde, N.cianClaro];
// ═════════ HUB 44 · "make the lever heavy. Move the apps that pull you the most off your home screen into" ═════════
const PalancaPesa: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-60,80 L60,80 L60,50 L-60,50 Z M0,50 L40,-50", a: 2.8 }]}>
    <g transform={`translate(40,${-50 + 4 * Math.sin(t * 2)})`}><path d="M-34,-10 L34,-10 L44,40 L-44,40 Z" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} /><text y={22} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={22} fill={N.oroClaro}>kg</text><circle cy={-18} r={8} fill="none" stroke={N.oroClaro} strokeWidth={3} /></g>
  </Glifo>
);
const AppsVuelan: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[]}>
    {[0, 1, 2, 3].map((i) => { const d = ((t * 0.8 + i * 0.25) % 1); return <rect key={i} x={-60 + (i % 2) * 50 + d * 70} y={-50 + Math.floor(i / 2) * 50 - d * 60} width={36} height={36} rx={9} fill="none" stroke={APPC[i]} strokeWidth={3} opacity={1 - d} transform={`scale(${1 - 0.5 * d})`} />; })}
    <path d="M40,-80 L90,-80 L90,-40" fill="none" stroke={N.cianClaro} strokeWidth={3} />
  </Glifo>
);
const HomeHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tel(110, 180, 18), a: 2.6 }]}>
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-38 + (i % 3) * 28} y={-56 + Math.floor(i / 3) * 30} width={20} height={20} rx={5} fill="none" stroke={APPC[i]} strokeWidth={2.5} />)}
  </Glifo>
);

// ═════════ ESCENA 44 · las apps a una carpeta lejana · logout · pantalla en gris · los colores dejan de brillar como caramelos ═════════
const E44 = { folder: T("a folder far away", 742), logout: T("Log out after", 744), gray: T("screen to gray", 748), bw: T("black and white", 748), colors: T("colors stop shining", 750), candy: T("like candy", 752) };
// objetos de vidrio de la escena 44
const B44: Beat[] = reg([
  { t: T("a folder far away", 742), id: "h_carpeta_lejos", glow: N.cian, tit: "una carpeta *bien lejos*" },
  { t: T("Log out after", 744), id: "h_puerta_cierra", glow: N.violeta, tit: "*cierra sesión*" },
  { t: T("screen to gray", 748), id: "h_celu_gris", glow: N.cian, tit: "ponla en *gris*" },
  { t: T("colors stop shining", 750), id: "h_caramelos_grises", glow: N.violeta, tit: "basta de *golosinas*" },
]);
const Escena44: React.FC = () => <EscenaHeroes ini={W(742.4)} fin={W(753.1)} beats={B44} />;

// ═════════ HUB 45 · "Every small step of effort gives the wise guard in your forehead a" ═════════
const Escalones: D = ({ t, t0, on, tam }) => {
  const p = Math.floor(t * 2) % 4;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-80,70 L-40,70 L-40,30 L0,30 L0,-10 L40,-10 L40,-50 L80,-50", a: 2.8 }]}>
      <circle cx={-60 + p * 40} cy={56 - p * 40} r={10} fill={N.oroClaro} />
    </Glifo>
  );
};
const Frente2: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-40,80 Q-70,40 -60,-10 Q-50,-80 10,-82 Q70,-80 70,-20 L70,40 Q60,80 20,80", a: 2.6 }]}>
    <circle cx={30} cy={-40} r={14 + 3 * Math.sin(t * 4)} fill={N.oro} opacity={0.8} style={glow(N.oro, 14)} />
  </Glifo>
);
const GuardianDespierta: D = ({ t, t0, on, tam }) => {
  const ojos = ramp(t, t0 + 0.6, 0.3);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: circ(0, -50, 30), a: 2.6 }, { d: "M-50,80 Q-50,-10 0,-14 Q50,-10 50,80 Z", a: 2.6 }, { d: "M60,10 L60,60 M52,60 L68,60", a: 2, c: N.oro }]}>
      <path d={`M-14,-52 Q-10,${-52 - 6 * ojos} -6,-52 M6,-52 Q10,${-52 - 6 * ojos} 14,-52`} fill="none" stroke={N.oroClaro} strokeWidth={3} />
      <circle cx={60} cy={0} r={10 + 4 * ojos} fill={N.oro} opacity={0.3 + 0.7 * ojos} style={glow(N.oro, 14 * ojos)} />
    </Glifo>
  );
};

// ═════════ ESCENA 45 · despertar y preguntar "¿lo quiero de verdad?" · tercero: tus propias puertas · escribir la última página · decidir antes ═════════
const E45 = { wake: T("to wake up", 757), ask: T("Do I really", 759.5), third: T("Third, build", 760), doors: T("your own doors", 761), reel: T("If the reel", 762), write: T("you write the", 766), yourself: T("page yourself", 767), decide: T("Decide before", 768), open: T("open the app", 769) };
// objetos de vidrio de la escena 45
const B45: Beat[] = reg([
  { t: T("Do I really", 759.5), id: "h_amanecer", glow: N.oro, tit: "¿de verdad *quiero* esto?" },
  { t: T("your own doors", 761), id: "h_puerta_ladrillos", glow: N.oro, tit: "construye tus *puertas*" },
  { t: T("you write the", 766), id: "h_pluma_pagina", glow: N.oro, tit: "escribe la *última página*" },
  { t: T("Decide before", 768.9), id: "h_temporizador", glow: N.cian, tit: "*decide* antes de abrir" },
]);
const Escena45: React.FC = () => <EscenaHeroes ini={W(757.6)} fin={W(770.8)} beats={B45} />;

// ═════════ HUB 46 · "Ten minutes. Set a timer. Or use the oldest door of all." ═════════
const DiezMin: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-90,-40 L90,-40 L90,40 L-90,40 Z", a: 2.6 }]}>
    <TextoNeon y={2} texto="10:00" size={46} color={N.oroClaro} />
  </Glifo>
);
const Timer: D = ({ t, t0, on, tam }) => {
  const a = -((t - t0) * 40);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: circ(0, 10, 66), a: 2.6 }, { d: "M-14,-62 L14,-62 M0,-62 L0,-56", a: 2.4 }]}>
      <path d={`M0,10 L${50 * Math.sin((a * Math.PI) / 180)},${10 - 50 * Math.cos((a * Math.PI) / 180)}`} stroke={N.cianClaro} strokeWidth={4} strokeLinecap="round" />
    </Glifo>
  );
};
const PuertaVieja: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-60,90 L-60,-30 Q-60,-90 0,-90 Q60,-90 60,-30 L60,90 Z", a: 2.6 }, { d: "M-40,90 L-40,-24 Q-40,-66 0,-66 Q40,-66 40,-24 L40,90 M0,-66 L0,90", a: 1.8, c: N.oro }]}>
    <circle cx={22} cy={20} r={6} fill={N.oroClaro} />
  </Glifo>
);

// ═════════ ESCENA 46 · el celular duerme en la cocina · no puede robarte las 2 de la mañana · la práctica prometida · muy vieja ═════════
const E46 = { room: T("another room", 775), night: T("at night", 776), kitchen: T("the kitchen", 779), steal: T("cannot steal", 779.5), two: T("two in the morning", 780.5), practice: T("practice I promised", 782), old: T("very old", 784) };
// objetos de vidrio de la escena 46
const B46: Beat[] = reg([
  { t: T("another room", 775), id: "cocina", carpeta: "png", glow: N.violeta, tit: "duerme en la *cocina*" },
  { t: T("two in the morning", 780.5), id: "h_reloj_mesa", glow: N.violeta, tit: "tus *dos de la mañana*" },
  { t: T("practice I promised", 782), id: "h_cuenco", glow: N.oro, tit: "la *práctica*" },
]);
const Escena46: React.FC = () => <EscenaHeroes ini={W(775.4)} fin={W(786.0)} beats={B46} />;

// ═════════ HUB 47 · "very simple. In my tradition, we watch the mind the way you watch clouds" ═════════
const nube = (s = 1) => `M${-60 * s},${20 * s} Q${-90 * s},${20 * s} ${-80 * s},${-6 * s} Q${-76 * s},${-34 * s} ${-44 * s},${-26 * s} Q${-34 * s},${-60 * s} ${2 * s},${-50 * s} Q${30 * s},${-70 * s} ${50 * s},${-34 * s} Q${86 * s},${-34 * s} ${84 * s},${0} Q${84 * s},${22 * s} ${60 * s},${20 * s} Z`;
const NubeHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: nube(1), a: 2.6 }]}><g transform={`translate(${6 * Math.sin(t)},0)`}><circle cx={0} cy={-10} r={0} /></g></Glifo>
);
const Tradicion: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M0,40 Q-30,-10 0,-70 Q30,-10 0,40 Z M0,40 Q-60,10 -70,-40 Q-20,-20 0,40 Z M0,40 Q60,10 70,-40 Q20,-20 0,40 Z M-80,50 L80,50", a: 2.6 }]} />
);
const OjoMente: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-80,0 Q0,-60 80,0 Q0,60 -80,0 Z", a: 2.6 }, { d: circ(0, 0, 22), a: 2.4 }]}>
    <path d={nube(0.18)} transform={`translate(${-10 + 14 * Math.sin(t * 1.4)},0)`} fill="none" stroke={N.cianClaro} strokeWidth={2} />
  </Glifo>
);
const NubeChica: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.gris} trazos={[]}><path d={nube(1)} fill="rgba(230,238,255,.05)" stroke={N.texto2} strokeWidth={3} /></Glifo>
);

// ═════════ ESCENA 47 · las nubes pasan · urge surfing (surfista en la ola) · sentís el tirón · no lo agarres · tampoco pelees ═════════
const E47 = { sky: T("in the sky", 792), today: T("Some people today", 792), surfing: T("urge surfing", 795.5), pull: T("feel the pull", 797.5), pick: T("to pick up", 798.5), donot: T("do not pick", 800), fight: T("not fight it", 802) };
// objetos de vidrio de la escena 47
const B47: Beat[] = reg([
  { t: T("in the sky", 792), id: "h_nubes", glow: N.cian, tit: "como nubes que *pasan*" },
  { t: T("urge surfing", 795.5), id: "h_surf", glow: N.cian, tit: "*surfear* el impulso" },
  { t: T("do not pick", 800), id: "semaforo", carpeta: "png", glow: N.oro, tit: "no lo *agarres*" },
]);
const Escena47: React.FC = () => <EscenaHeroes ini={W(791.7)} fin={W(803.4)} beats={B47} />;

export const SEGS_M12: Seg[] = [
  {
    hub: { portal: "home", orbs: [
      { id: "pesa", t: T("the lever heavy", 737), ang: 198, anillo: 1, tam: 170, D: PalancaPesa },
      { id: "apps", t: T("Move the apps", 738.5), ang: 128, anillo: 2, tam: 160, D: AppsVuelan },
      { id: "home", t: T("home screen", 741), ang: -14, anillo: 0, tam: 240, D: HomeHub },
    ] },
    Escena: Escena44,
    sonidos: (s) => { Array.from({ length: 7 }, (_, i) => s.add("vuelo", E44.folder - 0.2 + i * 0.14, 0.25)); s.add("vuelo", W(745.4), 0.5); s.add("toque", E44.logout + 0.5, 0.6); s.add("cierre", E44.logout + 1.0, 0.6); s.add("vuelo", W(747.7), 0.5); s.add("ola", E44.bw, 0.4); s.add("vacio", E44.candy, 0.4); },
  },
  {
    hub: { portal: "guardia", orbs: [
      { id: "escal", t: T("small step of", 753), ang: 198, anillo: 1, tam: 160, D: Escalones },
      { id: "guardia", t: T("wise guard", 755), ang: -14, anillo: 0, tam: 240, D: GuardianDespierta },
      { id: "frente", t: T("your forehead", 756.8), ang: 128, anillo: 2, tam: 150, D: Frente2 },
    ] },
    Escena: Escena45,
    sonidos: (s) => { s.add("luz", E45.wake + 0.3, 0.5); s.add("aparece", E45.ask, 0.5); s.add("vuelo", W(762.0), 0.5); s.add("golpe", E45.third, 0.4); [0, 1, 2].forEach((i) => s.add("traza", E45.doors + i * 0.35, 0.4)); s.add("vuelo", W(764.6), 0.5); s.add("traza", E45.write + 0.2, 0.6); s.add("vuelo", W(769.3), 0.5); s.add("aparece", E45.decide + 0.2, 0.5); },
  },
  {
    hub: { portal: "puerta", orbs: [
      { id: "diez", t: T("Ten minutes", 770.5), ang: 198, anillo: 1, tam: 170, D: DiezMin },
      { id: "timer", t: T("Set a timer", 772), ang: 128, anillo: 2, tam: 160, D: Timer },
      { id: "puerta", t: T("oldest door", 773.5), ang: -14, anillo: 0, tam: 240, D: PuertaVieja, png: "puerta" },
    ] },
    Escena: Escena46,
    sonidos: (s) => { s.add("vuelo", E46.room - 0.3, 0.5); s.add("toque", E46.room + 0.6, 0.5); s.add("ola", E46.night, 0.3); s.add("cierre", E46.steal, 0.5); s.add("vuelo", W(780.6), 0.5); s.add("premio", E46.two + 0.3, 0.4); s.add("vuelo", W(782.8), 0.5); s.add("luz", E46.practice, 0.5); },
  },
  {
    hub: { portal: "nube", orbs: [
      { id: "trad", t: T("my tradition", 787), ang: 198, anillo: 1, tam: 160, D: Tradicion },
      { id: "ojo", t: T("watch the mind", 788), ang: 128, anillo: 2, tam: 160, D: OjoMente },
      { id: "n1", t: T("watch clouds", 790.3) - 0.2, ang: 60, anillo: 2, tam: 140, D: NubeChica },
      { id: "n2", t: T("watch clouds", 790.3) - 0.1, ang: 250, anillo: 1, tam: 120, D: NubeChica },
      { id: "nube", t: T("watch clouds", 790.3), ang: -14, anillo: 0, tam: 240, D: NubeHub, png: "nube" },
    ] },
    Escena: Escena47,
    sonidos: (s) => { s.add("ola", E47.sky, 0.3); s.add("vuelo", W(794.2), 0.5); s.add("ola", E47.surfing, 0.6); s.add("vuelo", W(798.1), 0.5); s.add("tiron", E47.pull, 0.5); s.add("cierre", E47.donot + 0.2, 0.6); s.add("vuelo", W(802.1), 0.5); s.add("traza", E47.fight + 0.2, 0.5); },
  },
];
