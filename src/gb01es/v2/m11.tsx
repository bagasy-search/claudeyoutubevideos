// gb01 v2 · MINUTO 11 (ventanas 40-43, 670-736 s): mirá tu mano · los dedos que envuelven el celular · parte del cuerpo ·
// imaginá apoyarlo y abrir la mano · la resistencia elástica · "¿y si pasa algo?" = el engranaje 1 hablando · ya sabés su nombre ·
// no con enojo · el caballo salvaje que se calma · sacar el quizás · apagar notificaciones (menos las de humanos) · el quizás a la mitad.
import React from "react";
import { N, lerp, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const PIEL = "#e6eeff";
const tel = (w: number, h: number, r = 18) => `M${-w / 2 + r},${-h / 2} L${w / 2 - r},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + r} L${w / 2},${h / 2 - r} Q${w / 2},${h / 2} ${w / 2 - r},${h / 2} L${-w / 2 + r},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - r} L${-w / 2},${-h / 2 + r} Q${-w / 2},${-h / 2} ${-w / 2 + r},${-h / 2} Z`;
// mano que sostiene un celular: palma detrás, pulgar por la izquierda, cuatro dedos que se curvan sobre el borde derecho (k=1) o quedan estirados (k=0)
const ManoEnvuelve: React.FC<{ k: number; c?: string; cel?: boolean; celC?: string }> = ({ k, c = PIEL, cel = true, celC = N.cianClaro }) => (
  <g>
    <path d="M-70,300 L-90,140 Q-100,60 -60,20 L90,20 Q110,60 100,140 L80,300 Z" fill="rgba(5,5,6,.85)" stroke={c} strokeWidth={4} style={glow(c, 5)} />
    {cel && <path d={tel(150, 280, 22)} fill="rgba(10,20,26,.92)" stroke={celC} strokeWidth={4} style={glow(N.cian, 8)} />}
    {cel && <rect x={-60} y={-120} width={120} height={220} rx={8} fill="rgba(160,240,255,.08)" />}
    {/* pulgar */}
    <path d={`M-80,120 Q${lerp(-150, -96, k)},${lerp(40, 60, k)} ${lerp(-170, -60, k)},${lerp(-60, 10, k)}`} fill="none" stroke={c} strokeWidth={28} strokeLinecap="round" style={glow(c, 4)} />
    {/* dedos */}
    {[0, 1, 2, 3].map((i) => { const y = -50 + i * 46, L = [1, 1.08, 1.02, 0.86][i]; return <path key={i} d={`M88,${y} Q${lerp(170, 104, k) * L},${y - lerp(0, 12, k)} ${lerp(220 * L, 48, k)},${y - lerp(0, 8, k)}`} fill="none" stroke={c} strokeWidth={28} strokeLinecap="round" style={glow(c, 4)} />; })}
  </g>
);

// ═════════ HUB 40 · "at your hand. If you are holding your phone while you watch this, notice how your fingers" ═════════
const ManoHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-50,90 L-50,0 L-50,-60 M-20,0 L-20,-80 M10,0 L10,-84 M40,0 L40,-66 M-50,0 Q-80,-20 -80,-50 M-50,90 L50,90 L50,0", a: 3 }]} />
);
const CelHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tel(90, 160, 14), a: 2.6 }]}>
    <rect x={-36} y={-66} width={72} height={120} rx={6} fill={`rgba(160,240,255,${0.1 + 0.08 * Math.sin(t * 3)})`} />
    <path d="M-12,-20 L18,-4 L-12,12 Z" fill={N.cianClaro} />
  </Glifo>
);
const DedosHub: D = ({ t, t0, on, tam }) => {
  const k = (Math.sin(t * 2.2) + 1) / 2;
  return <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[]}><g transform="scale(0.42) translate(0,-40)"><ManoEnvuelve k={k} /></g></Glifo>;
};

// ═════════ ESCENA 40 · los dedos lo envuelven · natural, parte del cuerpo · imaginá apoyarlo · abrir la mano ═════════
const E40 = { wrap: T("wrap around it", 675.5), natural: T("how natural it", 677), part: T("part of your body", 679.5), moment: T("for a moment", 682), imagine: T("imagine putting it", 683.5), table: T("on the table", 685), opening: T("opening your hand", 685) };
// objetos de vidrio de la escena 40
const B40: Beat[] = reg([
  { t: T("wrap around it", 675.5), id: "h_dedos_celu", glow: N.cian, tit: "nota lo *natural*" },
  { t: T("imagine putting it", 683.5), id: "h_celu_mesa", glow: N.oro, tit: "*déjalo*" },
]);
const Escena40: React.FC = () => <EscenaHeroes ini={W(676.0)} fin={W(687.8)} beats={B40} />;

// ═════════ HUB 41 · "Do you feel that small resistance, that little voice that says," ═════════
const Elastico: D = ({ t, t0, on, tam }) => {
  const e = 30 * Math.abs(Math.sin(t * 2.5));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojoBorde} trazos={[{ d: circ(-70, 0, 10) + " " + circ(70, 0, 10), a: 2.4, c: PIEL }]}>
      <path d={`M-70,0 Q0,${e * 2} 70,0`} fill="none" stroke={N.rojo} strokeWidth={6} />
      <TextoNeon y={70} texto="resistencia" size={18} color={N.rojoBorde} on={ramp(t, t0 + 0.3, 0.3)} />
    </Glifo>
  );
};
const Oreja: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-20,70 Q-60,60 -50,10 Q-60,-70 0,-76 Q60,-74 56,-10 Q50,30 20,40 Q0,46 0,70 Q-6,90 -20,70 Z M-10,-30 Q20,-40 24,-6 Q20,12 4,14", a: 2.6 }]}>
    {[0, 1, 2].map((i) => <path key={i} d={`M${70 + i * 18},-30 Q${84 + i * 18},0 ${70 + i * 18},30`} fill="none" stroke={N.violeta} strokeWidth={3} opacity={(Math.sin(t * 5 - i) + 1) / 2} />)}
  </Glifo>
);
const Globito: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[{ d: "M-80,-50 L80,-50 Q96,-50 96,-34 L96,30 Q96,46 80,46 L-10,46 L-40,80 L-40,46 L-80,46 Q-96,46 -96,30 L-96,-34 Q-96,-50 -80,-50 Z", a: 2.6 }]}>
    <TextoNeon y={-2} texto="pero..." size={34} serif color={N.violeta} on={0.6 + 0.4 * Math.sin(t * 4)} />
  </Glifo>
);

// ═════════ ESCENA 41 · "¿y si pasa algo?" · es el engranaje 1 hablando · ya sabés su nombre · ¿cómo frenamos la máquina? ═════════
const E41 = { what: T("what if something", 693), voice: T("That voice is", 695), first: T("first gear speaking", 696), maybe: T("the maybe", 698), name: T("know its name", 699), stop: T("how do we", 701.5), machine: T("the machine", 702.3) };
// objetos de vidrio de la escena 41
const B41: Beat[] = reg([
  { t: T("what if something", 693), id: "h_celu_vibra", glow: N.rojo, tit: "¿y si *pasa* algo?" },
  { t: T("first gear speaking", 696), id: "h_engranaje_quizas", glow: N.oro, tit: "engranaje uno, el *quizás*" },
  { t: T("how do we", 701.5), id: "h_freno", glow: N.rojo, tit: "¿cómo lo *detenemos*?" },
]);
const Escena41: React.FC = () => <EscenaHeroes ini={W(693.1)} fin={W(703.5)} beats={B41} />;

// ═════════ HUB 42 · "Not with anger. Anger is just another spark." ═════════
const Enojo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: circ(0, 0, 56), a: 2.6 }, { d: "M-30,-26 L-10,-14 M30,-26 L10,-14 M-22,28 Q0,12 22,28", a: 2.8, dt: 0.2 }]}>
    {[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},-66 l${-6 + i * 6},-20`} stroke={N.rojo} strokeWidth={4} opacity={Math.abs(Math.sin(t * 8 + i))} />)}
  </Glifo>
);
const ChispaSeApaga: D = ({ t, t0, on, tam }) => {
  const f = 1 - ramp(t, t0 + 0.8, 1.0);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojoBorde} trazos={[]}>
      <g transform={`scale(${0.4 + 0.6 * f})`} opacity={0.3 + 0.7 * f} style={glow(N.rojo, 14 * f)}><path d="M0,-60 L14,-14 L60,0 L14,14 L0,60 L-14,14 L-60,0 L-14,-14 Z" fill={N.rojo} /></g>
      {f < 0.6 && <path d={`M0,-20 Q10,-50 0,-80 Q-10,-110 4,-130`} fill="none" stroke={N.gris} strokeWidth={4} opacity={1 - f} />}
    </Glifo>
  );
};
const CaballoCabeza: React.FC<{ c: string; boca?: number }> = ({ c, boca = 0 }) => (
  <g style={glow(c, 6)}>
    <path d={`M-30,90 Q-40,20 -20,-30 Q-10,-70 20,-80 L30,-110 L40,-76 Q70,-60 84,-20 Q96,10 90,24 Q80,${40 + boca * 10} 60,30 Q40,20 30,40 Q20,70 30,90 Z`} fill="rgba(5,5,6,.85)" stroke={c} strokeWidth={4} />
    <circle cx={40} cy={-40} r={5} fill={c} />
    <path d="M-20,-30 Q-50,-20 -60,20 M-14,-50 Q-50,-50 -66,-10 M-6,-66 Q-40,-80 -60,-50" fill="none" stroke={c} strokeWidth={3} />
  </g>
);
const CaballoHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[]}><g transform="scale(0.9)"><CaballoCabeza c={N.oroClaro} /></g></Glifo>
);

// ═════════ ESCENA 42 · como calmar un caballo salvaje · despacio, entendiendo · primero, sacar el quizás · apagar notificaciones ═════════
const E42 = { calm: T("way you calm", 708.5), horse: T("a wild horse", 708), slowly: T("slowly, with understanding", 710.5), first: T("First, take away", 712), maybe: T("the maybe. Turn", 713), off: T("off every notification", 715), human: T("real human being", 718), needs: T("who needs you", 719) };
// objetos de vidrio de la escena 42
const B42: Beat[] = reg([
  { t: T("a wild horse", 708), id: "h_caballo", glow: N.oro, tit: "calmar un *caballo salvaje*" },
  { t: T("off every notification", 715), id: "h_interruptor", glow: N.cian, tit: "*apaga* las notificaciones" },
  { t: T("real human", 718), id: "h_mano_tendida", glow: N.oro, tit: "un *humano* real que te necesita" },
]);
const Escena42: React.FC = () => <EscenaHeroes ini={W(707.8)} fin={W(721.1)} beats={B42} />;

// ═════════ HUB 43 · "No red dots from apps, no sounds for likes," ═════════
const PuntoOff: D = ({ t, t0, on, tam }) => {
  const off = ramp(t, t0 + 0.5, 0.3);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[]}>
      <circle r={50} fill={off > 0.5 ? "none" : N.rojo} stroke={off > 0.5 ? N.gris : N.rojo} strokeWidth={4} strokeDasharray={off > 0.5 ? "6 6" : undefined} style={glow(N.rojo, 14 * (1 - off))} />
    </Glifo>
  );
};
const CampanaMuda: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-50,40 L-50,-10 Q-50,-60 0,-62 Q50,-60 50,-10 L50,40 L64,56 L-64,56 Z M-12,66 Q0,80 12,66", a: 2.6 }, { d: "M-70,-70 L70,70", c: N.rojo, a: 3.2, dt: 0.4 }]} />
);
const CelSilencio: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tel(100, 170, 16), a: 2.6 }]}>
    <TextoNeon y={0} texto="z z" size={30} serif color={N.cianClaro} on={0.5 + 0.5 * Math.sin(t * 2)} />
  </Glifo>
);

// ═════════ ESCENA 43 · sin alertas de noticias · el celular deja de llamarte · el quizás pierde la mitad · decidís vos · segundo ═════════
const E43 = { news: T("alerts for news", 725.5), stops: T("stops calling you", 727), loses: T("the maybe loses", 728), half: T("half its power", 729), check: T("You will check", 731), decide: T("when you decide", 732), it: T("when it decides", 734), second: T("Second,", 735.5) };
// objetos de vidrio de la escena 43
const B43: Beat[] = reg([
  { t: T("alerts for news", 725.5), id: "h_megafono_mudo", glow: N.violeta, tit: "sin *alertas*" },
  { t: T("the maybe loses", 728), id: "h_quizas_mitad", glow: N.oro, tit: "el quizás pierde la *mitad*" },
  { t: T("when you decide", 732), id: "h_llave", glow: N.cian, tit: "cuando *tú* decidas" },
]);
const Escena43: React.FC = () => <EscenaHeroes ini={W(725.5)} fin={W(736.8)} beats={B43} />;

export const SEGS_M11: Seg[] = [
  {
    hub: { portal: "dedos", orbs: [
      { id: "mano", t: T("at your hand", 670), ang: 198, anillo: 1, tam: 160, D: ManoHub },
      { id: "cel", t: T("holding your phone", 672), ang: 128, anillo: 2, tam: 160, D: CelHub, png: "celu_brilla" },
      { id: "dedos", t: T("notice how your", 673), ang: -14, anillo: 0, tam: 240, D: DedosHub },
    ] },
    Escena: Escena40,
    sonidos: (s) => { s.add("toque", E40.wrap + 0.3, 0.5); s.add("vuelo", W(679.9), 0.5); s.add("sinapsis", E40.part, 0.5); s.add("traza", E40.part + 0.1, 0.4); s.add("vuelo", W(682.8), 0.5); s.add("ola", E40.imagine, 0.4); s.add("toque", E40.table + 0.5, 0.6); s.add("luz", E40.opening + 0.3, 0.5); },
  },
  {
    hub: { portal: "globito", orbs: [
      { id: "elast", t: T("small resistance", 689), ang: 198, anillo: 1, tam: 170, D: Elastico },
      { id: "oreja", t: T("voice that", 690), ang: 128, anillo: 2, tam: 150, D: Oreja },
      { id: "globito", t: T("little voice", 690.5), ang: -14, anillo: 0, tam: 240, D: Globito },
    ] },
    Escena: Escena41,
    sonidos: (s) => { s.add("aparece", E41.what - 0.1, 0.6); s.add("vuelo", W(695.5), 0.5); s.add("engranaje", E41.first, 0.6); s.add("golpe", E41.name + 0.1, 0.5); s.add("vuelo", W(701.9), 0.5); s.add("maquinaGira", E41.stop, 0.4); },
  },
  {
    hub: { portal: "caballo", orbs: [
      { id: "enojo", t: T("Not with anger", 703.5), ang: 198, anillo: 1, tam: 160, D: Enojo },
      { id: "chispa", t: T("another spark", 706), ang: 128, anillo: 2, tam: 150, D: ChispaSeApaga },
      { id: "caballo", t: T("another spark", 706) + 0.5, ang: -14, anillo: 0, tam: 240, D: CaballoHub, png: "caballo" },
    ] },
    Escena: Escena42,
    sonidos: (s) => { s.add("golpe", E42.horse, 0.4); s.add("ola", E42.slowly, 0.5); s.add("latido", E42.slowly + 1.2, 0.4); s.add("vuelo", W(714.2), 0.5); s.add("tiron", E42.maybe - 0.3, 0.5); s.add("vuelo", W(715.9), 0.5); [0, 1, 2, 4, 5].forEach((i) => s.add("tic", E42.off + 0.3 + i * 0.35, 0.5)); s.add("luz", E42.human, 0.5); },
  },
  {
    hub: { portal: "celsil", orbs: [
      ...[0, 1, 2].map((i) => ({ id: "pto" + i, t: T("No red dots", 721) + i * 0.2, ang: 150 + i * 60, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 100, D: PuntoOff })),
      { id: "campana", t: T("no sounds", 723.5), ang: 40, anillo: 2, tam: 160, D: CampanaMuda, png: "campana" },
      { id: "celsil", t: T("for likes", 723), ang: -14, anillo: 0, tam: 230, D: CelSilencio },
    ] },
    Escena: Escena43,
    sonidos: (s) => { s.add("tiron", E43.news + 0.4, 0.5); s.add("vuelo", W(727.4), 0.5); s.add("aviso", E43.stops - 0.6, 0.4); s.add("vacio", E43.stops + 0.4, 0.5); s.add("vuelo", W(729.8), 0.5); s.add("maquinaFrena", E43.half, 0.5); s.add("vuelo", W(732.3), 0.5); s.add("tiron", E43.it - 0.2, 0.5); s.add("aparece", E43.second, 0.6); },
  },
];
