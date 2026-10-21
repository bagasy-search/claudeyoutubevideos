// gb01 v2 · MINUTO 6 (ventanas 20-23, 336-402 s): la acción ocurre sin vos (títere) · engranaje 3 = el carrete sin fin ·
// el diario que se termina · la tele que termina y el silencio · el libro con capítulos y las puertitas de la vida ·
// el scroll infinito · autoplay · el ingeniero arrepentido · el reloj de arena tragado · el guardián sabio de la frente.
import React from "react";
import { N, neonOn, ramp } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const tela = (x: number, y: number, w: number, h: number, r = 12) => `M${x - w / 2 + r},${y - h / 2} L${x + w / 2 - r},${y - h / 2} Q${x + w / 2},${y - h / 2} ${x + w / 2},${y - h / 2 + r} L${x + w / 2},${y + h / 2 - r} Q${x + w / 2},${y + h / 2} ${x + w / 2 - r},${y + h / 2} L${x - w / 2 + r},${y + h / 2} Q${x - w / 2},${y + h / 2} ${x - w / 2},${y + h / 2 - r} L${x - w / 2},${y - h / 2 + r} Q${x - w / 2},${y - h / 2} ${x - w / 2 + r},${y - h / 2} Z`;

// ═════════ HUB 20 · "The action is so small and so easy that it happens without you." ═════════
const ToqueChico: D = ({ t, t0, on, tam }) => {
  const g = Math.max(0, Math.sin(t * 5));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-14,60 L-14,-10 Q-14,-30 0,-30 Q14,-30 14,-10 L14,60", a: 2.6 }]}>
      <circle cx={0} cy={-50 + 8 * g} r={4 + 14 * g} fill="none" stroke={N.oro} strokeWidth={2} opacity={g} />
      <TextoNeon y={90} texto="so small" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.2, 0.3)} />
    </Glifo>
  );
};
const CelularTitere: D = ({ t, t0, on, tam }) => {
  const b = 10 * Math.sin(t * 2.2), r = 8 * Math.sin(t * 1.7);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-60,-90 L60,-90 M-40,-90 L-60,-110 M40,-90 L60,-110", c: N.oro, a: 2.4 }]}>
      <path d={`M-40,-90 L-20,${-30 + b} M40,-90 L20,${-30 - b} M0,-90 L0,${-34}`} stroke={N.gris} strokeWidth={1.6} />
      <g transform={`translate(0,${10 + b * 0.4}) rotate(${r})`}><path d={tela(0, 20, 60, 100, 10)} fill="rgba(39,227,255,.06)" stroke={N.cianClaro} strokeWidth={3} style={glow(N.cian)} /></g>
    </Glifo>
  );
};
const Engr3Mini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: circ(0, 0, 86), c: N.oroHondo, a: 1.4 }]}>
    <g transform={`rotate(${t * 50}) scale(0.9)`}><EngranajeSvg r={70} color={N.oro} n={3} /></g>
  </Glifo>
);

// ═════════ ESCENA 20 · engranaje 3 = el carrete sin fin · el diario que se termina y se deja ═════════
const E20 = { third: T("third gear is", 342), reel: T("the endless reel", 343), old: T("In the old", 344.5), news: T("a newspaper", 345.5), last: T("the last page", 348), down: T("put it down", 349.5) };
// objetos de vidrio de la escena 20
const B20: Beat[] = reg([
  { t: T("third gear is", 342), id: "h_carrete", glow: N.cian, tit: "gear three, the *endless reel*" },
  { t: T("a newspaper", 345.5), id: "h_diario", glow: N.oro, tit: "a newspaper *ended*" },
]);
const Escena20: React.FC = () => <EscenaHeroes ini={341.8} fin={350.8} beats={B20} />;

// ═════════ HUB 21 · "A television show ended, and there was a moment of silence before the next thing." ═════════
const TeleFin: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-90,-60 L90,-60 L90,60 L-90,60 Z", a: 2.6, f: "rgba(255,255,255,.03)" }, { d: "M-30,-60 L-60,-100 M30,-60 L60,-100 M-50,60 L-60,80 M50,60 L60,80", a: 2.2 },
  ]}>
    <TextoNeon y={2} texto="THE END" size={30} serif color={N.oroClaro} on={neonOn(t, t0 + 0.4)} />
  </Glifo>
);
const Silencio: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.3, 1.2);
  const d = Array.from({ length: 40 }, (_, i) => `${i ? "L" : "M"}${-90 + i * 4.6},${30 * (1 - k) * Math.sin(i * 0.9 + t * 8)}`).join(" ");
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[]}>
      <path d={d} fill="none" stroke={N.violeta} strokeWidth={3} style={glow(N.violeta)} />
      <TextoNeon y={60} texto="silence" size={24} serif color={N.violeta} on={k} />
    </Glifo>
  );
};
const Puntos: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[]}>
    {[0, 1, 2].map((i) => <circle key={i} cx={-40 + i * 40} cy={0} r={10} fill={N.cianClaro} opacity={ramp(t, t0 + 0.3 + i * 0.35, 0.2)} style={glow(N.cian)} />)}
  </Glifo>
);

// ═════════ ESCENA 21 · el libro con capítulos · las puertitas de la vida · "enough" · el scroll que nunca termina ═════════
const E21 = { book: T("A book had", 356), life: T("Life was full", 358), stop: T("little stopping", 358), doors: T("small doors", 361), mind: T("where the mind", 362), enough: T("enough", 363), look: T("Now look at", 364), scroll: T("You scroll", 366), more: T("there is more", 367) };
// objetos de vidrio de la escena 21
const B21: Beat[] = reg([
  { t: T("A book had", 356), id: "h_libro_capitulos", glow: N.oro, tit: "a book had *chapters*" },
  { t: T("small doors", 361), id: "h_puertas", glow: N.oro, tit: "small *doors* to stop" },
  { t: T("You scroll", 366), id: "h_scroll_infinito", glow: N.cian, tit: "and there is *more*" },
]);
const Escena21: React.FC = () => <EscenaHeroes ini={356.1} fin={368.8} beats={B21} />;

// ═════════ HUB 22 · "You scroll again, and there is more. The video ends," (la cinta del feed gira alrededor del monje) ═════════
const Post = (i: number): D => ({ t, t0, on, tam }) => {
  const c = [N.oro, N.cian, N.violeta, N.rojo, N.verde][i % 5];
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={c} trazos={[{ d: tela(0, 0, 170, 110, 12), a: 2.4, f: "rgba(5,5,6,.6)" }, { d: circ(-54, -18, 14) + " M-30,-24 L60,-24 M-30,-6 L30,-6 M-66,26 L66,26", a: 1.8, dt: 0.15 }]} />
  );
};
const VideoFin: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, T("The video ends", 370), 0.8);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tela(0, 0, 180, 110, 10), a: 2.6, f: "rgba(39,227,255,.05)" }, { d: "M-14,-22 L22,0 L-14,22 Z", a: 2.6 }]}>
      <rect x={-80} y={42} width={160} height={6} fill={N.gris} /><rect x={-80} y={42} width={160 * k} height={6} fill={N.rojo} style={glow(N.rojo, 4)} />
    </Glifo>
  );
};

// ═════════ ESCENA 22 · autoplay · el libro sin última página · el ingeniero arrepentido · el tiempo tragado ═════════
const E22 = { next: T("the next one", 373), playing: T("already playing", 373), nolast: T("no last page", 375.5), engineer: T("The engineer who", 377), endless: T("create the endless", 378), regret: T("he regretted it", 381), saw: T("he saw how", 382.5), time: T("human time", 383.5), swallow: T("swallowing", 384.5) };
// objetos de vidrio de la escena 22
const B22: Beat[] = reg([
  { t: T("already playing", 373), id: "h_autoplay", glow: N.cian, tit: "already *playing*" },
  { t: T("no last page", 375.5), id: "h_libro_infinito", glow: N.oro, tit: "no *last page*" },
  { t: T("he regretted it", 381), id: "carta", carpeta: "png", glow: N.violeta, tit: "he *regretted* it" },
  { t: T("swallowing", 383), id: "h_reloj_vortice", glow: N.rojo, tit: "*swallowing* time" },
]);
const Escena22: React.FC = () => <EscenaHeroes ini={372.9} fin={385.7} beats={B22} />;

// ═════════ HUB 23 · "Inside the glass brain, there is a part right behind your forehead that acts like a" ═════════
const CerebroFrente: D = ({ t, t0, on, tam }) => {
  const f = neonOn(t, T("behind your forehead", 388.5));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
      { d: "M-90,20 Q-110,-60 -40,-80 Q0,-110 50,-84 Q110,-70 100,0 Q110,50 50,60 Q30,90 -10,70 Q-70,80 -90,20 Z", a: 2.4, f: "rgba(203,251,255,.04)" },
      { d: "M-60,-20 Q-30,-50 0,-30 Q30,-60 60,-24", c: N.gris, a: 1.4 },
    ]}>
      <path d="M50,-84 Q110,-70 100,0 Q70,-10 56,-40 Q40,-70 50,-84 Z" fill={N.oro} opacity={0.35 * f} style={glow(N.oro, 12)} />
    </Glifo>
  );
};
const Frente: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-20,-80 Q40,-80 50,-30 L56,-10 L70,10 L54,16 L56,40 Q50,60 30,60 L20,80", a: 2.6 }, { d: "M60,-40 L90,-50 M62,-56 L84,-80", c: N.oro, a: 2.4, dt: 0.3 }]} />
);
const Farol: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-30,-40 L30,-40 L40,40 L-40,40 Z M-20,-40 Q0,-80 20,-40 M0,-80 L0,-96", a: 2.6 }]}>
    <circle cx={0} cy={4} r={14 + 3 * Math.sin(t * 7)} fill={N.oroClaro} opacity={0.8} style={glow(N.oro, 14)} />
  </Glifo>
);

// ═════════ ESCENA 23 · el guardián sabio con el farol: planea, decide, "that's enough, go to sleep" · necesita una puerta ═════════
const E23 = { guard: T("wise old guard", 390.5), plans: T("It plans", 392.5), decides: T("it decides", 393.5), says: T("it says", 394), enough: T("that's enough", 395.5), sleep: T("go to sleep", 396.5), but: T("But this guard", 398), door: T("a door to", 398), stop: T("a stopping point", 400.5) };
// objetos de vidrio de la escena 23
const B23: Beat[] = reg([
  { t: T("wise old guard", 390.5), id: "h_farol_guardia", glow: N.oro, tit: "a wise old *guard*" },
  { t: T("go to sleep", 396.5), id: "h_luna_almohada", glow: N.violeta, tit: "*go to sleep*" },
  { t: T("a door to", 398.5), id: "h_puerta_sola", glow: N.oro, tit: "it needs a *door*" },
]);
const Escena23: React.FC = () => <EscenaHeroes ini={390.9} fin={402.7} beats={B23} />;

export const SEGS_M06: Seg[] = [
  {
    hub: { portal: "engr3", orbs: [
      { id: "toque", t: T("so small", 337), ang: 198, anillo: 1, tam: 150, D: ToqueChico },
      { id: "titere", t: T("happens without you", 340), ang: 128, anillo: 2, tam: 200, D: CelularTitere },
      { id: "engr3", t: T("without you", 340.5), ang: -14, anillo: 0, tam: 230, D: Engr3Mini },
    ] },
    Escena: Escena20,
    sonidos: (s) => { s.add("engranaje", E20.third); s.add("maquinaGira", E20.reel, 0.5); s.add("vuelo", 344.6, 0.5); s.add("vuelo", 345.4, 0.5); s.add("aparece", E20.news); [0, 1, 2, 3, 4].forEach((i) => s.add("tiron", E20.news + 0.5 + i * 0.45, 0.35)); s.add("cierre", E20.last + 0.1, 0.6); s.add("golpe", E20.down + 0.7, 0.5); },
  },
  {
    hub: { portal: "tele", orbs: [
      { id: "tele", t: T("television show", 351), ang: -14, anillo: 0, tam: 240, D: TeleFin },
      { id: "sil", t: T("moment of silence", 353.5), ang: 198, anillo: 1, tam: 180, D: Silencio },
      { id: "puntos", t: T("the next thing", 354.5), ang: 128, anillo: 2, tam: 160, D: Puntos },
    ] },
    Escena: Escena21,
    sonidos: (s) => { s.add("aparece", E21.book); s.add("tiron", E21.book + 0.1, 0.5); s.add("vuelo", 359.2, 0.6); s.add("traza", E21.life); [0, 1, 2, 3, 4].forEach((j) => s.add("tic", E21.stop + j * 0.25, 0.5)); s.add("cierre", E21.enough); s.add("vuelo", 365.6, 0.6); s.add("tiron", E21.scroll, 0.6); s.add("tiron", E21.more, 0.6); },
  },
  {
    hub: { portal: "vid", orbs: [
      ...[0, 1, 2, 3].map((i) => ({ id: "p" + i, t: T("You scroll again", 368.5) + i * 0.35, ang: 200 + i * 52, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 150, D: Post(i) })),
      { id: "vid", t: T("The video ends", 370) - 0.3, ang: -14, anillo: 0, tam: 240, D: VideoFin },
    ] },
    Escena: Escena22,
    sonidos: (s) => { s.add("tic", E22.next, 0.6); s.add("tic", E22.next + 0.45, 0.6); s.add("tic", E22.next + 0.9, 0.6); s.add("vuelo", E22.playing + 0.2, 0.6); s.add("vuelo", 375.9, 0.5); s.add("tiron", E22.nolast, 0.5); s.add("vuelo", 378.1, 0.5); s.add("aparece", E22.engineer); s.add("ola", E22.regret, 0.4); s.add("vuelo", 382.9, 0.5); s.add("vueloLargo", E22.swallow, 0.6); },
  },
  {
    hub: { portal: "cer", orbs: [
      { id: "cer", t: T("the glass brain", 385), ang: -14, anillo: 0, tam: 250, D: CerebroFrente },
      { id: "frente", t: T("behind your forehead", 388.5), ang: 198, anillo: 1, tam: 160, D: Frente },
      { id: "farol", t: T("acts like a", 389.5), ang: 128, anillo: 2, tam: 160, D: Farol, png: "farol" },
    ] },
    Escena: Escena23,
    sonidos: (s) => { s.add("luz", E23.guard); s.add("aparece", E23.plans); s.add("traza", E23.plans + 0.3, 0.5); s.add("aparece", E23.decides, 0.6); s.add("aviso", E23.says, 0.4); s.add("ola", E23.sleep, 0.4); s.add("vuelo", 398.2, 0.5); s.add("traza", E23.door); s.add("golpe", E23.stop, 0.5); },
  },
];
