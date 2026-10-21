// gb01 v2 · MINUTO 10 (ventanas 36-39, 603-670 s): la trampa del mono · el dulce, el coco atado al árbol · el mono huele, mete
// la mano, la cierra · el puño no sale · vuelven los cazadores · "abrí la mano" · nada lo sujetaba · tren, calle, cena con
// rectángulos que brillan · el celular-coco · nosotros lo sostenemos · el dulce es chiquito · "probá algo conmigo".
import React from "react";
import { N, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const COCO = "#c99a5b";
const MONO = N.oroClaro;
const DULCE = "#ff7ad9";
// el mono (de perfil, mirando a la derecha); brazo = ángulo en grados
const Caramelo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} style={glow(DULCE, 10)}>
    <circle r={16} fill="rgba(255,122,217,.4)" stroke={DULCE} strokeWidth={3} />
    <path d="M-16,0 L-32,-12 L-32,12 Z M16,0 L32,-12 L32,12 Z" fill="none" stroke={DULCE} strokeWidth={3} strokeLinejoin="round" />
  </g>
);
// mano: k=0 abierta (palma con cinco dedos, apuntando arriba), k=1 puño con nudillos; fundido entre las dos
const ManoK: React.FC<{ k: number; s?: number; c?: string }> = ({ k, s = 1, c = "#e6eeff" }) => {
  const a = Math.min(1, Math.max(0, 1 - k * 1.6)), b = Math.min(1, Math.max(0, (k - 0.35) * 1.6));
  return (
    <g transform={`scale(${s})`} style={glow(c, 6)}>
      <g opacity={a}>
        <path d="M-56,140 L-56,20 Q-60,-20 -92,-50 Q-104,-64 -90,-74 Q-76,-82 -62,-64 L-44,-36 L-44,-130 Q-44,-150 -28,-150 Q-12,-150 -12,-130 L-12,-60 L-12,-168 Q-12,-188 4,-188 Q20,-188 20,-168 L20,-60 L20,-156 Q20,-176 36,-176 Q52,-176 52,-156 L52,-50 L52,-112 Q52,-130 66,-130 Q80,-130 80,-112 L80,40 Q80,100 56,140 Z" fill="rgba(5,5,6,.88)" stroke={c} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <g opacity={b}>
        <path d="M-56,140 L-56,40 Q-70,-40 -40,-80 Q0,-100 60,-84 Q86,-70 84,-20 L80,60 Q76,110 56,140 Z" fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={4} strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-40 + i * 32},-84 Q${-24 + i * 32},-100 ${-8 + i * 32},-84`} fill="none" stroke={c} strokeWidth={3.5} />)}
        {[0, 1, 2].map((i) => <path key={"l" + i} d={`M${-8 + i * 32},-84 L${-8 + i * 32},-40`} stroke={c} strokeWidth={2.5} opacity={0.7} />)}
        <path d="M-60,10 Q-20,-10 30,-30" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ═════════ HUB 36 · "Inside, they put a sweet. Then they tied the coconut to a tree and" ═════════
const DulceHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={DULCE} trazos={[]}><g transform={`rotate(${10 * Math.sin(t * 2)})`}><Caramelo x={0} y={0} s={2.4} /></g></Glifo>
);
const Soga: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#d9b98a" trazos={[{ d: "M-80,-40 Q-40,-80 0,-40 Q40,0 0,40 Q-40,80 -80,40 Q-110,0 -80,-40 M0,40 Q50,70 90,40", a: 3 }]} />
);
const CocoArbol: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: "M-50,90 L-46,-80 M-30,90 L-34,-80 M-40,-80 Q-100,-110 -90,-60 M-40,-80 Q20,-110 30,-60", a: 2.6 }, { d: "M-34,10 Q10,20 30,30", c: "#d9b98a", a: 2.2 }]}>
    <ellipse cx={46} cy={50} rx={34} ry={30} fill="rgba(140,90,40,.25)" stroke={COCO} strokeWidth={3} /><circle cx={56} cy={44} r={8} fill="#000" stroke={N.oroClaro} strokeWidth={2} />
  </Glifo>
);

// ═════════ ESCENA 36 · se van · llega el mono · huele · mete la mano · la cierra ═════════
const E36 = { walked: T("walked away", 608.5), came: T("A monkey came", 609.5), smelled: T("smelled the sweet", 611), slipped: T("slipped its hand", 613), hole: T("through the hole", 614), grabbed: T("grabbed it", 615), fist: T("hand was a", 617) };
// objetos de vidrio de la escena 36
const B36: Beat[] = reg([
  { t: T("A monkey came", 609.5), id: "h_mono", glow: N.verde, tit: "llegó un *mono*" },
  { t: T("grabbed it", 615), id: "puno", carpeta: "png", glow: N.rojo, tit: "ahora su mano es un *puño*" },
]);
const Escena36: React.FC = () => <EscenaHeroes ini={W(609.0)} fin={W(619.0)} beats={B36} />;

// ═════════ HUB 37 · "a fist is bigger than an open hand. The monkey could not pull it out." ═════════
const PunoHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MONO} trazos={[{ d: circ(0, -80, 22), c: N.oroClaro, a: 2 }]}><g transform="translate(0,20)"><ManoK k={1} s={0.5} c={MONO} /></g></Glifo>
);
const AbiertaHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: circ(0, -80, 22), c: N.oroClaro, a: 2 }]}><g transform="translate(0,20)"><ManoK k={0} s={0.45} /></g></Glifo>
);
const Atascado: D = ({ t, t0, on, tam }) => {
  const tira = Math.sin(t * 9) * 6;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={COCO} trazos={[]}>
      <ellipse cx={0} cy={20} rx={70} ry={60} fill="rgba(140,90,40,.25)" stroke={COCO} strokeWidth={3} />
      <path d={`M-10,-30 L${-20 + tira},-110 M10,-30 L${20 + tira},-110`} stroke={MONO} strokeWidth={5} strokeLinecap="round" />
      <path d={`M-40,-80 L-70,-100 M40,-80 L70,-100`} stroke={N.rojoBorde} strokeWidth={3} opacity={Math.abs(Math.sin(t * 9))} />
    </Glifo>
  );
};

// ═════════ ESCENA 37 · vuelven los cazadores · el mono grita y tira · nunca pensó · abrí la mano ═════════
const E37 = { back: T("hunters came back", 624), slowly: T("slowly", 625.5), screamed: T("monkey screamed", 626), pulled: T("pulled and pulled", 628), never: T("never thought", 630), free: T("set it free", 632), open: T("Open the hand", 633), letgo: T("let go of", 634) };
// objetos de vidrio de la escena 37
const B37: Beat[] = reg([
  { t: T("hunters came back", 624), id: "h_antorchas", glow: N.rojo, tit: "los cazadores *volvieron*" },
  { t: T("never thought", 630), id: "h_mano_suelta_dulce", glow: N.oro, tit: "*abrir* la mano" },
]);
const Escena37: React.FC = () => <EscenaHeroes ini={W(624.1)} fin={W(636.3)} beats={B37} />;

// ═════════ HUB 38 · "Nothing was holding the monkey, only its own fist." ═════════
const Cadenas: D = ({ t, t0, on, tam }) => {
  const d = ramp(t, t0 + 0.6, 1.2);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.gris} trazos={[]}>
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-66 + i * 44} cy={(i % 2) * 6} rx={26} ry={14} fill="none" stroke={N.texto2} strokeWidth={5} transform={`translate(${(i - 1.5) * 40 * d},${-30 * d * (i % 2 ? 1 : -1)})`} opacity={1 - d} />)}
      <TextoNeon y={60} texto="nada" size={22} serif color={N.texto2} on={ramp(t, t0 + 0.2, 0.3)} />
    </Glifo>
  );
};
const MonoCara: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MONO} trazos={[{ d: circ(0, 0, 50), a: 2.6 }, { d: circ(-56, -10, 18) + " " + circ(56, -10, 18), a: 2.4 }]}>
    <circle cx={-16} cy={-6} r={5} fill={MONO} /><circle cx={16} cy={-6} r={5} fill={MONO} /><path d="M-14,22 Q0,30 14,22" fill="none" stroke={MONO} strokeWidth={3} />
  </Glifo>
);
const PunoBrilla: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MONO} trazos={[]}>
    <circle r={80 + 6 * Math.sin(t * 4)} fill="rgba(255,190,90,.08)" stroke={N.oro} strokeWidth={2} />
    <g transform="translate(0,10)"><ManoK k={1} s={0.62} c={MONO} /></g>
  </Glifo>
);

// ═════════ ESCENA 38 · tren · calle · cena · cada uno con un rectángulo que brilla · el coco · el celular no nos sujeta ═════════
const E38 = { train: T("on the train", 641.5), street: T("on the street", 643), dinner: T("at dinner with", 644), glowing: T("glowing rectangle", 647), coconut: T("that coconut", 649.5), phone: T("The phone does", 650.5), hold: T("not hold us", 651.5) };
// objetos de vidrio de la escena 38
const B38: Beat[] = reg([
  { t: T("on the train", 641.5), id: "h_tren", glow: N.cian, tit: "en el *tren*" },
  { t: T("at dinner with", 644), id: "h_mesa_cena2", glow: N.oro, tit: "en la *cena*" },
  { t: T("that coconut", 649.5), id: "h_coco_celu", glow: N.violeta, tit: "el teléfono no nos *sujeta*" },
]);
const Escena38: React.FC = () => <EscenaHeroes ini={W(641.0)} fin={W(652.9)} beats={B38} />;

// ═════════ HUB 39 · "We hold it. And the sweet inside, the maybe, the little spark," ═════════
const ManoSostiene: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-26,-80 L26,-80 Q34,-80 34,-72 L34,-6 Q34,2 26,2 L-26,2 Q-34,2 -34,-6 L-34,-72 Q-34,-80 -26,-80 Z", c: N.cianClaro, a: 2.4 }]}>
    <g transform="translate(0,60)"><ManoK k={1} s={0.5} /></g>
  </Glifo>
);
const CelCoco: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={COCO} trazos={[{ d: "M-50,-80 L50,-80 Q66,-80 66,-64 L66,64 Q66,80 50,80 L-50,80 Q-66,80 -66,64 L-66,-64 Q-66,-80 -50,-80 Z", a: 2.6 }]}>
    <Caramelo x={0} y={10} s={1.6} />
  </Glifo>
);
const Chispa: D = ({ t, t0, on, tam }) => {
  const s = 1 + 0.2 * Math.sin(t * 7);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: circ(0, 0, 80), c: N.gris, a: 1.4 }]}>
      <g transform={`scale(${s})`} style={glow(N.oro, 16)}><path d="M0,-40 L9,-9 L40,0 L9,9 L0,40 L-9,9 L-40,0 L-9,-9 Z" fill={N.oroClaro} /></g>
    </Glifo>
  );
};

// ═════════ ESCENA 39 · es tan chiquito · un mensaje que podía esperar · un video que olvidamos · un like de un desconocido · probá algo ═════════
const E39 = { small: T("is so small", 658), message: T("A message that", 659.5), hour: T("wait an hour", 660), video: T("A video we", 661), forget: T("forget tomorrow", 662), like: T("A like from", 665), never: T("never met", 666.5), try: T("Try something", 667.5), now: T("right now", 669), look: T("Look at your", 670) };
// objetos de vidrio de la escena 39
const B39: Beat[] = reg([
  { t: T("A message that", 659.5), id: "h_burbuja", glow: N.cian, tit: "un mensaje que podía *esperar*" },
  { t: T("A video we", 661), id: "h_pelicula_polvo", glow: N.violeta, tit: "un video que vamos a *olvidar*" },
  { t: T("A like from", 665), id: "h_corazon_niebla", glow: N.rojo, tit: "un me gusta de un *desconocido*" },
  { t: T("Look at your", 669), id: "h_palma", glow: N.violeta, tit: "mira tu *mano*" },
]);
const Escena39: React.FC = () => <EscenaHeroes ini={W(658.6)} fin={W(670.8)} beats={B39} />;

export const SEGS_M10: Seg[] = [
  {
    hub: { portal: "coco", orbs: [
      { id: "dulce", t: T("put a sweet", 605), ang: 198, anillo: 1, tam: 160, D: DulceHub, png: "caramelo" },
      { id: "soga", t: T("tied the coconut", 606), ang: 128, anillo: 2, tam: 160, D: Soga },
      { id: "coco", t: T("to a tree", 607.8), ang: -14, anillo: 0, tam: 240, D: CocoArbol, png: "coco" },
    ] },
    Escena: Escena36,
    sonidos: (s) => { s.add("ola", E36.walked, 0.4); s.add("aparece", E36.came, 0.5); s.add("vuelo", W(611.8), 0.5); s.add("sinapsis", E36.smelled, 0.5); s.add("tiron", E36.slipped + 0.2, 0.6); s.add("cierre", E36.grabbed + 0.1, 0.7); s.add("vuelo", W(616.6), 0.5); s.add("golpe", E36.fist, 0.4); },
  },
  {
    hub: { portal: "atascado", orbs: [
      { id: "puno", t: T("a fist is", 618), ang: 198, anillo: 1, tam: 170, D: PunoHub },
      { id: "abierta", t: T("open hand", 619), ang: 128, anillo: 2, tam: 170, D: AbiertaHub },
      { id: "atascado", t: T("could not pull", 622), ang: -14, anillo: 0, tam: 240, D: Atascado },
    ] },
    Escena: Escena37,
    sonidos: (s) => { s.add("latido", E37.back, 0.5); s.add("latido", E37.slowly, 0.5); s.add("aviso", E37.screamed, 0.5); [0, 1, 2].forEach((i) => s.add("tiron", E37.pulled + i * 0.35, 0.5)); s.add("vuelo", W(630.3), 0.5); s.add("luz", E37.free, 0.5); s.add("vuelo", W(633.8), 0.5); s.add("aparece", E37.open + 0.3, 0.6); s.add("toque", E37.letgo + 0.5, 0.6); s.add("ola", E37.letgo + 0.6, 0.5); },
  },
  {
    hub: { portal: "punoB", orbs: [
      { id: "cad", t: T("Nothing was holding", 636), ang: 128, anillo: 2, tam: 170, D: Cadenas },
      { id: "mono", t: T("the monkey", 636), ang: 198, anillo: 1, tam: 150, D: MonoCara },
      { id: "punoB", t: T("own fist", 638), ang: -14, anillo: 0, tam: 240, D: PunoBrilla },
    ] },
    Escena: Escena38,
    sonidos: (s) => { s.add("rodillos", E38.train, 0.3); s.add("vuelo", W(643.3), 0.5); s.add("vuelo", W(644.8), 0.5); s.add("neonOn", E38.glowing, 0.5); s.add("vuelo", W(649.3), 0.5); s.add("vidrio", E38.coconut + 0.2, 0.5); s.add("cierre", E38.hold, 0.5); },
  },
  {
    hub: { portal: "chispa", orbs: [
      { id: "sost", t: T("We hold it", 653), ang: 198, anillo: 1, tam: 160, D: ManoSostiene },
      { id: "celcoco", t: T("the sweet inside", 654.5), ang: 128, anillo: 2, tam: 160, D: CelCoco },
      { id: "chispa", t: T("little spark", 657), ang: -14, anillo: 0, tam: 230, D: Chispa, png: "chispa" },
    ] },
    Escena: Escena39,
    sonidos: (s) => { s.add("vacio", E39.small + 0.2, 0.5); s.add("vuelo", W(660.2), 0.5); s.add("aviso", E39.message, 0.4); s.add("tic", E39.hour, 0.5); s.add("vuelo", W(663.2), 0.5); s.add("ola", E39.forget + 0.2, 0.4); s.add("vuelo", W(665.6), 0.5); s.add("like", E39.like + 0.2, 0.5); s.add("vuelo", W(668.0), 0.5); s.add("aparece", E39.try, 0.5); },
  },
];
