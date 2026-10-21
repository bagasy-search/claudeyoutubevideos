// gb01 v2 · MINUTO 8 (ventanas 28-31, 470-535 s): la tribu que se va y te deja solo · ojos de lobos · el radar del cerebro
// "¿me aceptan?" · el punto rojo como alarma en la parte más vieja · la tribu habla sin vos · "unread" · la deuda ·
// esperar los likes · cada like = "me aceptan" · el valor propio dentro del quizás · engranaje 4 · la palanca que cualquiera tira.
import React from "react";
import { N, pop, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import { } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const TRIBU = "#ffcf9a";
const corazon = (x: number, y: number, s: number) => `M${x},${y + 14 * s} C${x - 34 * s},${y - 6 * s} ${x - 22 * s},${y - 36 * s} ${x},${y - 18 * s} C${x + 22 * s},${y - 36 * s} ${x + 34 * s},${y - 6 * s} ${x},${y + 14 * s} Z`;
// silueta de persona (cabeza + torso) en coordenadas locales
// ═════════ HUB 28 · "being left out of the group was dangerous. If the tribe walked away without you," ═════════
const MiembroTribu: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={TRIBU} trazos={[{ d: circ(0, -40, 22), a: 2.6 }, { d: "M-36,60 Q-36,-10 0,-12 Q36,-10 36,60 Z", a: 2.6 }]} />
);
const Peligro: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M0,-70 L76,60 L-76,60 Z", a: 2.8, f: "rgba(255,42,72,.08)" }]}>
    <TextoNeon y={18} texto="!" size={64} color={N.rojoBorde} on={Math.floor(t * 4) % 2 ? 1 : 0.5} />
  </Glifo>
);
const Solo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: circ(0, 0, 90), c: N.gris, a: 1.4 }, { d: circ(0, -30, 20), a: 2.6 }, { d: "M-32,56 Q-32,-2 0,-4 Q32,-2 32,56 Z", a: 2.6 }]} />
);

// ═════════ ESCENA 28 · podías morir (ojos de lobos) · el radar del cerebro · ¿qué hacen los otros? · ¿me aceptan? · el punto rojo ═════════
const E28 = { die: T("could die", 475), brain: T("the brain became", 476.5), sens: T("very sensitive", 477.5), question: T("one question", 478.5), others: T("are the others", 480), accept: T("still accept me", 482.5), look: T("Now look at", 484), dot: T("red dot on", 485) };
const B28: Beat[] = reg([
  { t: T("could die", 475), id: "h_lobos", glow: N.rojo, tit: "solo, podías *morir*" },
  { t: T("very sensitive", 477.5), id: "h_radar_luz", glow: N.cian, tit: "qué hacen los *demás*" },
  { t: T("still accept me", 482.5), id: "h_figura_fuera", glow: N.violeta, tit: "¿todavía me *aceptan*?" },
  { t: T("Now look at", 484), id: "h_app_punto", glow: N.rojo, tit: "el pequeño *punto rojo*" },
]);
const Escena28: React.FC = () => <EscenaHeroes ini={W(475.5)} fin={W(486.9)} beats={B28} />;

// ═════════ HUB 29 · "One new message. Three likes. Someone mentioned you." ═════════
const Insignia = (txt: string, icono: "msg" | "heart" | "at"): D => ({ t, t0, on, tam }) => {
  const s = 0.7 + 0.3 * pop(t, t0 + 0.2, 8);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-50,-50 L50,-50 Q70,-50 70,-30 L70,30 Q70,50 50,50 L-50,50 Q-70,50 -70,30 L-70,-30 Q-70,-50 -50,-50 Z", a: 2.6 }]}>
      {icono === "msg" && <path d="M-34,-20 L34,-20 L34,18 L-6,18 L-20,32 L-20,18 L-34,18 Z" fill="none" stroke={N.cianClaro} strokeWidth={3} />}
      {icono === "heart" && <path d={corazon(0, 4, 1.2)} fill="rgba(255,42,72,.2)" stroke={N.rojo} strokeWidth={3} />}
      {icono === "at" && <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={64} fill={N.cianClaro}>@</text>}
      <g transform={`translate(64,-50) scale(${s})`} style={glow(N.rojo, 10)}><circle r={26} fill={N.rojo} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={28} fill="#fff">{txt}</text></g>
    </Glifo>
  );
};

// ═════════ ESCENA 29 · alarma en la parte más vieja · la tribu habla y vos no estás · unread ═════════
const E29 = { red: T("red dot is", 490.5), alarm: T("small alarm", 491), oldest: T("oldest part", 493.5), talking: T("tribe is talking", 496.5), not: T("not there", 498.5), hard: T("so hard", 501), unread: T("unread", 502) };
const B29: Beat[] = reg([
  { t: T("small alarm", 491), id: "h_sirena", glow: N.rojo, tit: "una pequeña *alarma*" },
  { t: T("oldest part", 493.5), id: "h_cerebro_antiguo", glow: N.rojo, tit: "la parte más *antigua*" },
  { t: T("tribe is talking", 496.5), id: "h_fogata_vacia", glow: N.oro, tit: "tú *no estás*" },
  { t: T("unread", 502), id: "h_sobre_lacre", glow: N.rojo, tit: "*sin leer*" },
]);
const Escena29: React.FC = () => <EscenaHeroes ini={W(490.9)} fin={W(503.3)} beats={B29} />;

// ═════════ HUB 30 · "It feels like a debt, like someone is waiting for you. And" ═════════
const Pagare: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-70,-80 L50,-80 L70,-60 L70,80 L-70,80 Z", a: 2.6 }, { d: "M-46,-30 L46,-30 M-46,0 L30,0 M-46,30 L40,30", c: N.gris, a: 1.6 }]}>
    <TextoNeon y={-54} texto="DEBO" size={22} color={N.oro} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);
const Esperando: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={TRIBU} trazos={[{ d: circ(0, -40, 22), a: 2.6 }, { d: "M-36,60 Q-36,-10 0,-12 Q36,-10 36,60 Z", a: 2.6 }]}>
    <g transform="translate(56,-50)"><circle r={18} fill="none" stroke={TRIBU} strokeWidth={2.5} /><path d={`M0,0 L${12 * Math.sin(t * 3)},${-12 * Math.cos(t * 3)}`} stroke={TRIBU} strokeWidth={2.5} /></g>
  </Glifo>
);
const CelularPost: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-40,-80 L40,-80 Q50,-80 50,-70 L50,70 Q50,80 40,80 L-40,80 Q-50,80 -50,70 L-50,-70 Q-50,-80 -40,-80 Z", a: 2.6 }, { d: "M-30,-50 L30,-50 L30,10 L-30,10 Z", c: N.violeta, a: 2 }]}>
    <rect x={-30} y={30} width={60} height={22} rx={11} fill={N.cian} opacity={0.4 + 0.4 * Math.abs(Math.sin(t * 3))} /><TextoNeon y={42} texto="PUBLICAR" size={14} color="#fff" />
  </Glifo>
);

// ═════════ ESCENA 30 · publicás · esperás los likes · cada uno = "la tribu me acepta" ═════════
const E30 = { post: T("you post something", 507.5), photo: T("a photo", 508), comment: T("a comment", 509), wait: T("wait for the likes", 511.5), each: T("Each one is", 513), sign: T("small sign", 513), accepts: T("tribe accepts me", 515.5) };
const B30: Beat[] = reg([
  { t: T("you post something", 507.5), id: "h_polaroid", glow: N.cian, tit: "*publicas*" },
  { t: T("wait for the likes", 511.5), id: "h_corazones", glow: N.rojo, tit: "los *me gusta*" },
  { t: T("tribe accepts me", 515.5), id: "h_figura_dentro", glow: N.oro, tit: "la tribu me *acepta*" },
]);
const Escena30: React.FC = () => <EscenaHeroes ini={W(507.3)} fin={W(517.6)} beats={B30} />;

// ═════════ HUB 31 · "Each missing one is a small worry. The maybe again, but now with your" ═════════
const CorazonFalta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.gris} trazos={[]}>
    <path d={corazon(0, 0, 2.4)} fill="none" stroke={N.rojoBorde} strokeWidth={3} strokeDasharray="8 8" opacity={0.6 + 0.4 * Math.sin(t * 3)} />
  </Glifo>
);
const Preocupa: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[{ d: circ(0, 0, 60), a: 2.6 }, { d: "M-30,-24 L-12,-16 M30,-24 L12,-16 M-24,30 Q0,14 24,30", a: 2.6, dt: 0.3 }]}>
    <path d="M44,-50 Q50,-36 44,-28 Q38,-36 44,-50 Z" fill={N.cian} opacity={0.8} />
  </Glifo>
);
const DadoCorazon: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[{ d: "M-60,-36 L0,-66 L60,-36 L60,36 L0,66 L-60,36 Z M-60,-36 L0,-6 L60,-36 M0,-6 L0,66", a: 2.6 }]}>
    <path d={corazon(-28, 20, 0.7)} fill={N.rojo} opacity={0.8} /><path d={corazon(30, 20, 0.7)} fill="none" stroke={N.rojo} strokeWidth={2} />
    <TextoNeon y={96} texto="el quizás" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 31 · tu valor dentro del quizás · engranaje 4 · la necesidad de pertenecer = palanca · rearmar el cerebro ═════════
const E31 = { worth: T("sense of worth", 522.5), fourth: T("the fourth gear", 525), red: T("the red dot", 526.5), belong: T("need to belong", 528.5), lever: T("into a lever", 529), anyone: T("anyone can", 531), together: T("glass brain back", 534) };
const B31: Beat[] = reg([
  { t: T("sense of worth", 522.5), id: "h_balanza", glow: N.violeta, tit: "tu *valor*" },
  { t: T("into a lever", 529), id: "h_palanca_corazon", glow: N.rojo, tit: "una palanca que *cualquiera* tira" },
  { t: T("glass brain back", 534), id: "h_cerebro_cuatro", glow: N.oro, tit: "volver a *armarlo*" },
]);
const Escena31: React.FC = () => <EscenaHeroes ini={W(522.8)} fin={W(535.2)} beats={B31} />;

export const SEGS_M08: Seg[] = [
  {
    hub: { portal: "solo", orbs: [
      ...[0, 1, 2, 3, 4].map((i) => ({ id: "tr" + i, t: T("left out of", 470.5) - 0.3 + i * 0.12, t1: T("walked away", 473.5) + 0.2 + i * 0.1, ang: 150 + i * 46, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 120, D: MiembroTribu })),
      { id: "peligro", t: T("dangerous", 471.5), ang: 60, anillo: 2, tam: 150, D: Peligro },
      { id: "solo", t: T("without you", 473), ang: -14, anillo: 0, tam: 230, D: Solo },
    ] },
    Escena: Escena28,
    sonidos: (s) => { s.add("latido", E28.die, 0.7); [0, 1, 2].forEach((i) => s.add("neonOn", E28.die + 0.2 + i * 0.3, 0.4)); s.add("vuelo", W(477.3), 0.5); s.add("sinapsis", E28.sens, 0.6); s.add("vuelo", W(480.2), 0.5); s.add("aparece", E28.accept, 0.6); s.add("vuelo", W(484.8), 0.5); s.add("aviso", E28.dot); },
  },
  {
    hub: { portal: "at", orbs: [
      { id: "msg", t: T("One new message", 486.5), ang: 198, anillo: 1, tam: 160, D: Insignia("1", "msg") },
      { id: "likes", t: T("Three likes", 488), ang: 128, anillo: 2, tam: 160, D: Insignia("3", "heart") },
      { id: "at", t: T("mentioned you", 489.5), ang: -14, anillo: 0, tam: 230, D: Insignia("1", "at") },
    ] },
    Escena: Escena29,
    sonidos: (s) => { s.add("aviso", E29.red, 0.6); s.add("latido", E29.alarm); s.add("latido", E29.alarm + 0.6, 0.6); s.add("vuelo", W(493.4), 0.5); s.add("sinapsis", E29.oldest + 0.2); s.add("vuelo", W(496.7), 0.5); s.add("aparece", E29.talking, 0.5); s.add("vacio", E29.not, 0.6); s.add("vuelo", W(500.3), 0.5); s.add("aviso", E29.hard, 0.6); s.add("tic", E29.unread, 0.6); },
  },
  {
    hub: { portal: "post", orbs: [
      { id: "deuda", t: T("like a debt", 504), ang: 198, anillo: 1, tam: 170, D: Pagare },
      { id: "espera", t: T("waiting for you", 506), ang: 128, anillo: 2, tam: 170, D: Esperando },
      { id: "post", t: T("waiting for you", 506) + 0.4, ang: -14, anillo: 0, tam: 230, D: CelularPost },
    ] },
    Escena: Escena30,
    sonidos: (s) => { s.add("aparece", E30.post, 0.6); s.add("vuelo", E30.photo + 0.3, 0.5); s.add("vuelo", E30.comment + 0.3, 0.5); s.add("vuelo", W(511.8), 0.5); Array.from({ length: 9 }, (_, i) => E30.each + i * 0.3 + (i > 3 ? 0.3 : 0)).forEach((x) => s.add("like", x, 0.5)); s.add("vueloLargo", W(516.0), 0.5); s.add("luz", E30.accepts, 0.6); },
  },
  {
    hub: { portal: "dado", orbs: [
      { id: "falta", t: T("missing one", 517), ang: 198, anillo: 1, tam: 160, D: CorazonFalta },
      { id: "preoc", t: T("small worry", 519), ang: 128, anillo: 2, tam: 160, D: Preocupa },
      { id: "dado", t: T("The maybe again", 520.5), ang: -14, anillo: 0, tam: 240, D: DadoCorazon },
    ] },
    Escena: Escena31,
    sonidos: (s) => { s.add("aparece", E31.worth, 0.5); s.add("vuelo", W(525.5), 0.5); s.add("engranaje", E31.fourth + 0.2); s.add("aviso", E31.red, 0.6); s.add("vuelo", W(528.8), 0.5); s.add("latido", E31.belong, 0.6); s.add("palanca", E31.anyone + 0.2); s.add("palanca", E31.anyone + 0.9, 0.7); s.add("palanca", E31.anyone + 1.6, 0.6); s.add("vuelo", W(533.4), 0.5); s.add("engranaje", E31.together + 0.6); },
  },
];
