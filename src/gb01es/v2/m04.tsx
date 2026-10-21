// gb01 v2 · MINUTO 4 (ventanas 12-15, 204-268 s): cada tirón puede ser el grande · tres cartas (alguien que querés /
// un video / nada) · el primer engranaje encaja · el humano antiguo y las bayas · pull-to-refresh en macro · palanca = gesto.
import React from "react";
import { N, easeOut, lerp, ramp } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { circ, Beat, EscenaHeroes, reg } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });

// ═════════ HUB 12 · "Every pull might be the big one. And your phone? Every time you open it," ═════════
const Jackpot: D = ({ t, t0, on, tam }) => {
  const f = Math.floor(t * 5) % 2;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[
      { d: "M-90,-40 L90,-40 L90,40 L-90,40 Z", a: 2.6, f: "rgba(244,194,74,.08)" },
      ...[-1, 1].map((s): Trazo => ({ d: `M${s * 104},-30 L${s * 120},-48 M${s * 108},0 L${s * 130},0 M${s * 104},30 L${s * 120},48`, c: N.oroClaro, a: 2.2, dt: 0.4 })),
    ]}>
      <TextoNeon y={2} texto="777" size={52} color={f ? N.oroClaro : N.rojo} on={ramp(t, t0 + 0.3, 0.2)} />
      <TextoNeon y={68} texto="el gran premio" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.4, 0.3)} />
    </Glifo>
  );
};
const CicloTiron: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M50,-40 A64,64 0 1,0 64,10", a: 3 }, { d: "M64,10 L80,-8 M64,10 L44,0", a: 3 },
  ]}>
    <g transform={`translate(0,${-14 * Math.abs(Math.sin(t * 3))})`}><path d="M0,-30 L0,30 M-16,14 L0,30 L16,14" stroke={N.violeta} strokeWidth={4} fill="none" /></g>
  </Glifo>
);
const CelularAbre: D = ({ t, t0, on, tam }) => {
  const ab = ramp(t, T("open it", 209) - 0.2, 0.4, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
      { d: "M-38,-74 Q-38,-82 -30,-82 L30,-82 Q38,-82 38,-74 L38,74 Q38,82 30,82 L-30,82 Q-38,82 -38,74 Z", a: 2.6 },
    ]}>
      {/* candado que se abre y la pantalla que se enciende */}
      <rect x={-32} y={-76} width={64} height={152} fill={N.cian} opacity={0.12 * ab} />
      <path d="M-14,0 L14,0 L14,22 L-14,22 Z" fill="none" stroke={ab > 0.5 ? N.fosfo : N.oro} strokeWidth={3} />
      <path d={`M-9,0 L-9,-10 Q-9,-22 0,-22 Q9,-22 9,-10 L9,${-10 * ab}`} fill="none" stroke={ab > 0.5 ? N.fosfo : N.oro} strokeWidth={3} transform={`translate(0,${-6 * ab})`} />
    </Glifo>
  );
};

// ═════════ ESCENA 12 · tres cartas: un mensaje de alguien que querés / un video gracioso / nada · se barajan ═════════
const E12 = { msg: T("message from someone", 210), love: T("you love", 211), video: T("funny video", 213), nada: T("might be nothing", 215), dont: T("You don't know", 216), not: T("not knowing", 217.5), thumb: T("thumb moving", 220) };
// objetos de vidrio de la escena 12
const B12: Beat[] = reg([
  { t: T("message from someone", 210), id: "h_sobre_corazon", glow: N.rojo, tit: "alguien que *amas*" },
  { t: T("funny video", 213), id: "h_play", glow: N.cian, tit: "un *video* gracioso" },
  { t: T("might be nothing", 215), id: "h_caja_vacia", glow: N.violeta, tit: "o *nada*" },
  { t: T("thumb moving", 220), id: "h_pulgar", glow: N.cian, tit: "tu pulgar sigue *moviéndose*" },
]);
const Escena12: React.FC = () => <EscenaHeroes ini={W(210.0)} fin={W(221.6)} beats={B12} />;

// ═════════ HUB 13 · "So that is the first gear, the maybe." ═════════
const MarcoEngr: D = ({ t, t0, on, tam }) => {
  const enc = ramp(t, T("first gear", 222) + 0.1, 0.5, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
      { d: "M-96,-60 L96,-60 L96,60 L-96,60 Z", a: 2.2 },
      ...[0, 1, 2, 3].map((i): Trazo => ({ d: circ(-66 + i * 44, 0, 18), c: i ? N.gris : N.oro, a: 1.6, dt: 0.1 + i * 0.06 })),
    ]}>
      <g transform={`translate(-66,${-90 * (1 - enc)}) rotate(${t * 90}) scale(0.24)`} opacity={ramp(t, t0, 0.3)}><EngranajeSvg r={80} color={N.oro} n={1} /></g>
      {enc > 0.95 && <circle cx={-66} cy={0} r={30 + 40 * (1 - ramp(t, T("first gear", 222) + 0.6, 0.4))} fill="none" stroke={N.oro} strokeWidth={2} opacity={1 - ramp(t, T("first gear", 222) + 0.6, 0.4)} />}
    </Glifo>
  );
};
const DadoQuizas: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-50,-30 L0,-56 L50,-30 L50,30 L0,56 L-50,30 Z M-50,-30 L0,-4 L50,-30 M0,-4 L0,56", a: 2.4 },
  ]}>
    <g transform={`rotate(${t * 40})`}><circle cx={-24} cy={14} r={6} fill={N.violeta} /><circle cx={24} cy={14} r={6} fill={N.violeta} /></g>
    <TextoNeon y={86} texto="el quizás" size={24} serif color={N.oroClaro} on={ramp(t, T("the maybe", 223.5), 0.3)} />
  </Glifo>
);
const Uno: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: circ(0, 0, 60), a: 2.2 }]}>
    <TextoNeon y={4} texto="1/4" size={44} color={N.oroClaro} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 13 · el regalo cerrado · el cerebro antiguo · el humano y las bayas · engranaje 2 = la palanca ═════════
const E13 = { never: T("phone never tells", 225), built: T("brain was built", 228), long: T("very long time ago", 229), chase: T("chase anything uncertain", 231), food: T("might be food", 233), second: T("second gear", 234.5), lever: T("the lever", 235.5) };
// línea del tiempo que corre hacia atrás: el teléfono de hoy → el fuego → el bosque
// objetos de vidrio de la escena 13
const B13: Beat[] = reg([
  { t: T("phone never tells", 225), id: "h_celu_niebla", glow: N.cian, tit: "nunca te lo *dice*" },
  { t: T("very long time ago", 229), id: "h_bayas", glow: N.violeta, tit: "hecho para perseguir lo *incierto*" },
  { t: T("second gear", 234.5), id: "h_engranaje_palanca", glow: N.oro, tit: "engranaje dos, la *palanca*" },
]);
const Escena13: React.FC = () => <EscenaHeroes ini={W(224.6)} fin={W(237.2)} beats={B13} />;

// ═════════ HUB 14 · "Watch your thumb the next time you open an app." ═════════
const PulgarGrande: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[
    { d: "M-34,90 L-34,-30 Q-34,-80 0,-80 Q34,-80 34,-30 L34,90", a: 2.8, f: "rgba(255,240,179,.05)" },
    { d: "M-20,-50 Q0,-64 20,-50 L20,-26 Q0,-16 -20,-26 Z", a: 2 },
    { d: "M-34,40 Q0,30 34,40", c: N.gris, a: 1.4 },
  ]}>
    <path d={`M-56,${-20 + 10 * Math.sin(t * 5)} L-56,${30 + 10 * Math.sin(t * 5)}`} stroke={N.oro} strokeWidth={3} opacity={0.6} />
  </Glifo>
);
const GrillaApps: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={Array.from({ length: 9 }, (_, i): Trazo => {
    const x = -60 + (i % 3) * 60, y = -60 + Math.floor(i / 3) * 60;
    return { d: `M${x - 20},${y - 20} L${x + 20},${y - 20} L${x + 20},${y + 20} L${x - 20},${y + 20} Z`, c: [N.cian, N.violeta, N.rojo, N.oro, N.verde][i % 5], a: 2.2, dt: 0.05 * i };
  })} />
);
const OjoMira: D = ({ t, t0, on, tam }) => {
  const p = 14 * Math.sin(t * 1.4);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-80,0 Q0,-60 80,0 Q0,60 -80,0 Z", a: 2.6 }]}>
      <circle cx={p} cy={0} r={22} fill="none" stroke={N.cian} strokeWidth={3} /><circle cx={p} cy={0} r={9} fill={N.cian} style={glow(N.cian)} />
    </Glifo>
  );
};

// ═════════ ESCENA 14 · pull-to-refresh en macro: la pantalla se estira, la ruedita gira, cae lo nuevo ═════════
const E14 = { pull: T("pull down to", 240), stretch: T("screen stretches", 242), wheel: T("little wheel spins", 244), drops: T("content drops in", 246), remind: T("remind you of", 249) };
// objetos de vidrio de la escena 14
const B14: Beat[] = reg([
  { t: T("pull down to", 240), id: "h_dedo_tira", glow: N.cian, tit: "*tira* para actualizar" },
  { t: T("little wheel spins", 244), id: "h_rueda_luz", glow: N.cian, tit: "la ruedita *gira*" },
  { t: T("content drops in", 246), id: "h_tarjetas_caen", glow: N.oro, tit: "cae algo *nuevo*" },
]);
const Escena14: React.FC = () => <EscenaHeroes ini={W(240.2)} fin={W(250.6)} beats={B14} />;

// ═════════ HUB 15 · "A slot machine has a handle. You pull it, the wheels spin, and you wait." ═════════
const Manija: D = ({ t, t0, on, tam }) => {
  const tp = T("pull it", 252);
  const pl = ramp(t, tp, 0.25) * (1 - ramp(t, tp + 0.5, 0.4));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-20,90 L-20,30 L20,30 L20,90", a: 2.4 }]}>
      <path d={`M0,30 L${lerp(10, 20, pl)},${lerp(-60, 60, pl)}`} stroke={N.oro} strokeWidth={6} strokeLinecap="round" style={glow(N.oro)} />
      <circle cx={lerp(10, 20, pl)} cy={lerp(-74, 74, pl)} r={18} fill={N.rojo} style={glow(N.rojo)} />
    </Glifo>
  );
};
const Rodillos: D = ({ t, t0, on, tam }) => {
  const ts = T("wheels spin", 254);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[
      { d: "M-96,-56 L96,-56 L96,56 L-96,56 Z", a: 2.6, f: "rgba(244,194,74,.05)" },
      { d: "M-32,-56 L-32,56 M32,-56 L32,56", a: 1.6 },
    ]}>
      <defs><clipPath id="clRod15"><rect x={-94} y={-54} width={188} height={108} /></clipPath></defs>
      <g clipPath="url(#clRod15)">
        {[0, 1, 2].map((i) => {
          const v = t > ts ? Math.max(0, 1 - (t - ts) / (1.4 + i * 0.5)) : 0;
          const off = ((t - ts) * 900 * v) % 60;
          return [-1, 0, 1, 2].map((j) => <text key={i + "_" + j} x={-64 + i * 64} y={j * 60 - off + 14} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={44} fill={j === 0 && v === 0 ? N.oroClaro : N.oro} opacity={v > 0 ? 0.6 : 1}>{["7", "$", "★", "7"][(i + j + 4) % 4]}</text>);
        })}
      </g>
    </Glifo>
  );
};
const RelojEspera: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[{ d: circ(0, 0, 56), a: 2.4 }]}>
    {[0, 1, 2].map((i) => <circle key={i} cx={-24 + i * 24} cy={0} r={7} fill={N.violeta} opacity={0.3 + 0.7 * ((Math.floor(t * 3) % 3) === i ? 1 : 0)} />)}
    <TextoNeon y={86} texto="esperas" size={22} serif color={N.violeta} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 15 · espejo: tirón de palanca = tirón del dedo · la espera es parte del placer · el inventor ═════════
const E15 = { waiting: T("waiting is part", 256), pleasure: T("of the pleasure", 256), phone: T("Your phone gives", 258), pull: T("same pull", 259), spin: T("same spin", 260), wait: T("same short wait", 261), inventor: T("the inventor", 263), gesture: T("pull-down gesture", 265.5), said: T("has said", 266.5) };
// objetos de vidrio de la escena 15
const B15: Beat[] = reg([
  { t: T("waiting is part", 256), id: "h_reloj_arena", glow: N.oro, tit: "la *espera* es el placer" },
  { t: T("same pull", 259), id: "h_palanca_celu", glow: N.rojo, tit: "mismo tirón, mismo *giro*" },
  { t: T("the inventor", 263), id: "h_plano_gesto", glow: N.cian, tit: "hasta su *inventor*" },
]);
const Escena15: React.FC = () => <EscenaHeroes ini={W(256.2)} fin={W(268.6)} beats={B15} />;

export const SEGS_M04: Seg[] = [
  {
    hub: { portal: "celA", orbs: [
      { id: "ciclo", t: T("Every pull", 204.5), ang: 198, anillo: 1, tam: 150, D: CicloTiron },
      { id: "jack", t: T("the big one", 206), ang: 128, anillo: 2, tam: 210, D: Jackpot },
      { id: "celA", t: T("your phone", 207.5), ang: -14, anillo: 0, tam: 240, D: CelularAbre },
    ] },
    Escena: Escena12,
    sonidos: (s) => { [E12.msg, E12.video, E12.nada].forEach((x) => { s.add("vuelo", x, 0.4); s.add("aparece", x + 0.15, 0.6); }); s.add("latido", E12.love, 0.6); s.add("vuelo", E12.dont, 0.45); s.add("tiron", E12.dont + 0.4, 0.7); s.add("tiron", E12.dont + 1.1, 0.6); s.add("vuelo", W(220.2), 0.6); s.add("toque", E12.thumb + 0.2, 0.5); s.add("toque", E12.thumb + 0.65, 0.5); },
  },
  {
    hub: { portal: "marco", orbs: [
      { id: "uno", t: T("So that is", 221.5), ang: 198, anillo: 1, tam: 140, D: Uno },
      { id: "marco", t: T("first gear", 222), ang: -14, anillo: 0, tam: 250, D: MarcoEngr },
      { id: "dado", t: T("the maybe", 223.5), ang: 128, anillo: 2, tam: 170, D: DadoQuizas },
    ] },
    Escena: Escena13,
    sonidos: (s) => { s.add("aparece", E13.never - 0.3); s.add("toque", E13.never + 0.6, 0.6); s.add("vuelo", E13.built, 0.6); s.add("traza", E13.built + 0.1); s.add("digito", E13.long); s.add("vuelo", W(230.9), 0.5); s.add("aparece", E13.chase); s.add("luz", E13.food - 0.1, 0.6); s.add("vuelo", W(234.8), 0.6); s.add("engranaje", E13.second + 0.1); s.add("palanca", E13.lever + 0.1); },
  },
  {
    hub: { portal: "pulgar", orbs: [
      { id: "ojo", t: T("Watch", 237), ang: 198, anillo: 1, tam: 150, D: OjoMira, png: "ojo" },
      { id: "pulgar", t: T("your thumb", 237.5), ang: -14, anillo: 0, tam: 250, D: PulgarGrande },
      { id: "apps", t: T("open an app", 238), ang: 128, anillo: 2, tam: 180, D: GrillaApps },
    ] },
    Escena: Escena14,
    sonidos: (s) => { s.add("tiron", E14.pull); s.add("hilo", E14.stretch, 0.6); s.add("vuelo", E14.wheel, 0.45); s.add("aviso", E14.drops); s.add("aparece", E14.drops + 0.2, 0.6); s.add("neonOn", E14.remind + 0.3, 0.5); },
  },
  {
    hub: { portal: "rod", orbs: [
      { id: "manija", t: T("has a handle", 251), ang: 198, anillo: 1, tam: 170, D: Manija },
      { id: "rod", t: T("wheels spin", 254), ang: -14, anillo: 0, tam: 250, D: Rodillos },
      { id: "espera", t: T("you wait", 255), ang: 128, anillo: 2, tam: 150, D: RelojEspera },
    ] },
    Escena: Escena15,
    sonidos: (s) => { s.add("palanca", T("pull it", 252)); s.add("rodillos", T("wheels spin", 254)); s.add("palanca", E15.waiting - 0.3); s.add("rodillos", E15.waiting - 0.2, 0.7); s.add("aparece", E15.phone, 0.6); s.add("palanca", E15.pull); s.add("tiron", E15.pull + 0.05, 0.7); s.add("vuelo", E15.spin, 0.45); s.add("tic", E15.wait, 0.6); s.add("vuelo", W(264.5), 0.6); s.add("aparece", E15.inventor); s.add("vuelo", E15.said, 0.4); },
  },
];
