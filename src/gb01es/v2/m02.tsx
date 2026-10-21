// gb01 v2 · MINUTO 2 (ventanas 4-7, 67-134 s): por qué agarrás el celular · 90 veces por día · el extraño que te
// toca el hombro · el primer engranaje · la caja de Skinner. Componentes nuevos, mismo neón.
import React from "react";
import { N, SANS, SERIF, Toma, easeOut, neonOn, ramp, useT, vis } from "../../kits/neon/base";
import { T, W } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { Contador, EscenaMundo, Heroe, Onda, Texto, circ, Beat, EscenaHeroes, reg } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const toques = (t0: number, n: number, paso: number) => Array.from({ length: n }, (_, i) => t0 + i * paso);

// ═════════ HUB 4 · "Why do you pick up your phone? … because I'm bored, or" ═════════
const Pregunta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-34,-40 Q-34,-80 0,-80 Q36,-80 36,-46 Q36,-22 10,-10 Q0,-4 0,14 L0,24", a: 4 },
    { d: circ(0, 52, 6), a: 4, f: N.violeta },
  ]} />
);
const CelularSube: D = ({ t, t0, on, tam }) => {
  const y = -40 * ramp(t, t0, 0.8, easeOut) + 6 * Math.sin(t * 2);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
      { d: `M-30,${y - 60} L30,${y - 60} Q38,${y - 60} 38,${y - 52} L38,${y + 52} Q38,${y + 60} 30,${y + 60} L-30,${y + 60} Q-38,${y + 60} -38,${y + 52} L-38,${y - 52} Q-38,${y - 60} -30,${y - 60} Z`, a: 2.6 },
      { d: `M-56,${y + 76} Q-30,${y + 40} -10,${y + 62} M56,${y + 76} Q30,${y + 40} 10,${y + 62}`, c: N.oro, a: 2 },
    ]} />
  );
};
const Bostezo: D = ({ t, t0, on, tam }) => {
  const b = 0.5 + 0.5 * Math.sin((t - t0) * 2.4);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
      { d: "M-70,10 Q-80,-40 -30,-44 Q-20,-80 20,-70 Q60,-80 66,-36 Q96,-20 76,14 Q60,40 0,34 Q-60,44 -70,10 Z", a: 2 },
      { d: "M-26,-8 L-12,-8 M12,-8 L26,-8", a: 2.4 },
      { d: `M-12,${10} Q0,${10 + 24 * b} 12,10 Q0,${6 - 4 * b} -12,10 Z`, a: 2 },
    ]}>
      <TextoNeon x={70} y={-60} texto="z" size={26} serif color={N.cianClaro} on={0.4 + 0.6 * b} />
    </Glifo>
  );
};

// ═════════ ESCENA 4 · "check something … the story the mind tells … the truth is stranger … researchers counted" ═════════
const E4 = { check: T("check something", 72), story: T("story the mind", 74), truth: T("truth is stranger", 77), res: T("Researchers", 79), phones: T("their phones", 81) };
const tomas4: Toma[] = [[W(72.0), 0, 0, 0.95], [W(75.3), 0, 0, 1.05, 0, "in"], [W(77.4), -28, 70, 1.3], [W(78.7), -28, 70, 3.4, 0, "in"], [W(79.2), -28, 70, 3.7, 0, "in"], [W(80.1), 1600, 0, 1.0, 0, "out"], [W(83.4), 1600, 0, 1.12]];
const Titulos4: React.FC = () => (
  <>
    <Texto x={960} y={105} t0={E4.story} t1={E4.truth} texto="la *historia* que cuenta la mente" size={82} />
    <Texto x={960} y={105} t0={E4.truth + 0.1} t1={W(79.3)} texto="la verdad es más *extraña*" size={82} color={N.oroClaro} />
    <Texto x={960} y={105} t0={E4.res} texto="los investigadores *contaron*" size={82} color={N.cianClaro} />
  </>
);
const Escena4: React.FC = () => (
  <EscenaMundo tomas={tomas4} pantalla={<Titulos4 />}>
    <Heroe id="h_cerebro_libro" x={0} y={30} h={760} t0={E4.check - 0.2} t1={W(79.8)} glow={N.oro} latidos={[E4.story, E4.truth + 0.1]} />
    <Onda x={-34} y={120} t0={E4.truth + 0.1} r={240} color={N.oroClaro} />
    <Heroe id="h_contador" x={1600} y={0} h={620} t0={W(79.3)} glow={N.oro} latidos={toques(E4.res + 0.5, 14, 0.18)} />
  </EscenaMundo>
);


// ═════════ HUB 5 · "The numbers are not small. In some surveys, the average person" ═════════
const Digitos: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} trazos={[]}>
    {["9", "0", "%", "7"].map((c, i) => (
      <TextoNeon key={i} x={-60 + i * 40} y={20 * Math.sin(t * 2 + i * 1.3)} texto={c} size={82} color={i % 2 ? N.cianClaro : N.oroClaro} on={neonOn(t, t0 + i * 0.1)} />
    ))}
  </Glifo>
);
const Encuesta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-60,-80 L60,-80 L60,80 L-60,80 Z", a: 2.2 },
    ...[0, 1, 2].map((i): Trazo => ({ d: `M-40,${-40 + i * 40} L-24,${-40 + i * 40} M-10,${-40 + i * 40} L40,${-40 + i * 40}`, c: i === 1 ? N.fosfo : N.gris, a: 2, dt: 0.3 + i * 0.2 })),
  ]} />
);
const Persona: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
    { d: circ(0, -50, 24), a: 2.4 },
    { d: "M-50,80 Q-50,-10 0,-14 Q50,-10 50,80", a: 2.4 },
    { d: "M22,20 L40,0 L52,0 L52,30 L40,30 Z", c: N.oro, a: 2 },
  ]} />
);

// ═════════ ESCENA 5 · "90 times a day … far more … a few seconds … unlock, look, lock, nothing happens" ═════════
const E5 = { picks: T("picks up the phone", 87), n90: T("90 times", 88), far: T("far more", 90), checks: T("checks last", 92), sec: T("few seconds", 94), unlock: T("unlock", 95), look: T("look", 96), lock: T("lock", 97.5), nada: T("nothing happens", 98) };
// anillo-cronómetro de neón: se llena en 3 segundos y se apaga (los "pocos segundos" de cada chequeo)
const AnilloSeg: React.FC<{ x: number; t0: number; t1: number }> = ({ x, t0, t1 }) => {
  const t = useT();
  if (!vis(t, t0 - 0.3, t1)) return null;
  const k = ramp(t, t0 + 0.4, 2.6, (v) => v), on = ramp(t, t0 - 0.3, 0.4) * (1 - ramp(t, t1 - 0.4, 0.4)), R = 290;
  const a = k * 2 * Math.PI - Math.PI / 2;
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: x, top: 0, overflow: "visible", opacity: on }}>
      <circle r={R} fill="none" stroke="rgba(39,227,255,.12)" strokeWidth={34} />
      {Array.from({ length: 60 }, (_, i) => { const b = (i / 60) * 2 * Math.PI; return <line key={i} x1={Math.cos(b) * (R + 34)} y1={Math.sin(b) * (R + 34)} x2={Math.cos(b) * (R + (i % 5 ? 44 : 58))} y2={Math.sin(b) * (R + (i % 5 ? 44 : 58))} stroke={i / 60 <= k ? N.cianClaro : N.gris} strokeWidth={i % 5 ? 2 : 4} />; })}
      <path d={`M0,${-R} A${R},${R} 0 ${k > 0.5 ? 1 : 0},1 ${Math.cos(a) * R},${Math.sin(a) * R}`} fill="none" stroke={N.cian} strokeWidth={30} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 22px ${N.cian})` }} />
      <circle cx={Math.cos(a) * R} cy={Math.sin(a) * R} r={22} fill="#fff" style={{ filter: `drop-shadow(0 0 18px ${N.cian})` }} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={SANS} fontWeight={900} fontSize={190} fill="#fff" style={{ filter: `drop-shadow(0 0 20px ${N.cian})` }}>{Math.min(3, Math.floor(k * 3 + 0.0001))}</text>
      <text y={130} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={48} fill={N.cianClaro}>segundos</text>
    </svg>
  );
};
const tomas5: Toma[] = [[W(87.2), 0, 0, 1.0], [W(92.2), 0, 0, 1.12, 0, "in"], [W(93.0), 1000, 0, 1.0, 0, "out"], [W(95.4), 1000, 0, 1.12, 0, "in"], [W(96.1), 1950, 0, 1.0, 0, "out"], [W(97.8), 1950, 0, 1.14], [W(99.9), 1950, 30, 0.94]];
const Titulos5: React.FC = () => (
  <>
    <Texto x={960} y={105} t0={E5.n90 + 1.2} t1={W(92.6)} texto="veces *al día*" size={82} />
    <Texto x={960} y={105} t0={E5.checks} t1={W(95.6)} texto="apenas unos *segundos*" size={82} color={N.cianClaro} />
    <Texto x={640} y={105} t0={E5.unlock} t1={E5.nada} texto="desbloqueas" size={82} />
    <Texto x={960} y={105} t0={E5.look} t1={E5.nada} texto="miras" size={82} />
    <Texto x={1280} y={105} t0={E5.lock} t1={E5.nada} texto="bloqueas" size={82} />
    <Texto x={960} y={960} t0={E5.nada} texto="*no pasa nada*" size={86} color={N.texto2} />
  </>
);
const Escena5: React.FC = () => (
  <EscenaMundo tomas={tomas5} pantalla={<Titulos5 />}>
    <Heroe id="h_celu" x={-140} y={0} h={700} t0={E5.picks - 0.3} t1={W(93.4)} glow={N.cian} latidos={[E5.n90, E5.far]} />
    <Contador x={300} y={-10} t0={E5.n90} d={1.3} a1={90} size={300} color={N.cianClaro} t1={W(93.4)} />
    <Onda x={300} y={-10} t0={E5.n90 + 1.3} r={420} />
    <Onda x={300} y={-10} t0={E5.far} r={520} color={N.cianClaro} />
    <AnilloSeg x={1000} t0={E5.checks} t1={W(96.2)} />
    <Heroe id="h_candado" x={1950} y={20} h={760} t0={E5.unlock - 0.5} glow={N.cian} tilt={4} luz={2.1} latidos={[E5.unlock, E5.look, E5.lock]} apagar={E5.nada} />
    <Onda x={1950} y={60} t0={E5.unlock} r={380} />
    <Onda x={1950} y={60} t0={E5.lock} r={380} color={N.cianClaro} />
  </EscenaMundo>
);

// ═════════ HUB 6 · "And a few minutes later, your hand does it again." ═════════
const RelojMin: D = ({ t, t0, on, tam }) => {
  const a = ramp(t, t0, 1.6) * 300;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: circ(0, 0, 70), a: 2.4 }, { d: "M0,0 L0,-40", a: 3 }]}>
      <line x1={0} y1={0} x2={60 * Math.sin((a * Math.PI) / 180)} y2={-60 * Math.cos((a * Math.PI) / 180)} stroke={N.cian} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${N.cian})` }} />
    </Glifo>
  );
};
const ManoEstira: D = ({ t, t0, on, tam }) => {
  const c = (t - t0) % 1.4, ext = Math.sin(Math.min(1, c / 0.7) * Math.PI) * 34;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[
      { d: `M-90,40 L${-30 + ext},40 Q${-10 + ext},40 ${-6 + ext},24 L${30 + ext},20 Q${40 + ext},16 ${32 + ext},8 L${-4 + ext},6 L${36 + ext},-4 Q${44 + ext},-12 ${34 + ext},-18 L${-6 + ext},-12 Q${-24 + ext},-26 ${-44 + ext},-14 L-90,-10`, a: 2.6 },
      { d: `M${60 + ext},-40 L${80 + ext},-40 Q${88 + ext},-40 ${88 + ext},-32 L${88 + ext},32 Q${88 + ext},40 ${80 + ext},40 L${60 + ext},40 Q${52 + ext},40 ${52 + ext},32 L${52 + ext},-32 Q${52 + ext},-40 ${60 + ext},-40 Z`, c: N.cianClaro, a: 2 },
    ]} />
  );
};
const Otravez: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-50,0 A50,50 0 1,1 0,50", a: 3 }, { d: "M-14,40 L0,50 L-12,64", a: 3 },
  ]}>
    <g transform={`rotate(${(t - t0) * 120})`} />
  </Glifo>
);

// ═════════ ESCENA 6 · "a stranger tap your shoulder 90 times … police … we call it normal … open the glass brain … first gear" ═════════
const E6 = { str: T("stranger", 103), tap: T("tap your shoulder", 104), n90: T("90 times", 105), police: T("police", 107), phone: T("phone does it", 109), normal: T("normal", 110), open: T("open the glass brain", 112), first: T("first gear", 114) };
export const EngranajeSvg: React.FC<{ r: number; color: string; n?: number; dientes?: number }> = ({ r, color, n, dientes = 10 }) => {
  const pts: string[] = [];
  for (let i = 0; i < dientes * 2; i++) {
    const a0 = (i / (dientes * 2)) * Math.PI * 2, a1 = ((i + 1) / (dientes * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.8 : r;
    pts.push(`${i ? "L" : "M"}${Math.cos(a0) * rr},${Math.sin(a0) * rr} L${Math.cos(a1) * rr},${Math.sin(a1) * rr}`);
  }
  return (
    <svg width={1} height={1} style={{ overflow: "visible" }}>
      <path d={pts.join(" ") + " Z"} fill="rgba(244,194,74,.08)" stroke={color} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      <circle r={r * 0.32} fill="none" stroke={color} strokeWidth={3} />
      {n !== undefined && <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={r * 0.5} fill={color}>{n}</text>}
    </svg>
  );
};
const tomas6: Toma[] = [[W(103.2), 0, -20, 1.0], [W(107.3), 0, -40, 1.1], [W(109.5), 0, -40, 1.0, 0, "in"], [W(110.2), 1000, 0, 1.0, 0, "out"], [W(112.4), 1000, 0, 1.1, 0, "in"], [W(113.1), 1900, 0, 1.0, 0, "out"], [W(114.3), 1900, 0, 1.12, 0, "in"], [W(116.4), 1890, 0, 2.5]];
const toques6 = toques(E6.tap + 0.3, 14, 0.34);
// sirena: lavado rojo/azul de pantalla completa mientras dice "police"
const Sirena: React.FC = () => {
  const t = useT();
  if (!vis(t, E6.police - 0.1, W(109.6))) return null;
  const on = ramp(t, E6.police - 0.1, 0.2) * (1 - ramp(t, W(109.0), 0.5)), rojo = Math.floor(t * 5) % 2 === 0;
  return <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${rojo ? "15%" : "85%"} 50%, ${rojo ? N.rojo : "#2a6bff"}55, transparent 70%)`, opacity: on, mixBlendMode: "screen" }} />;
};
// el hombro del extraño: curva de neón que se hunde con cada toque
const HombroNeon: React.FC = () => {
  const t = useT();
  if (!vis(t, E6.str, W(110.4))) return null;
  const g = Math.max(0, ...toques6.map((tp) => (t >= tp && t < tp + 0.25 ? 1 - (t - tp) / 0.25 : 0)));
  const on = ramp(t, E6.str, 0.5) * (1 - ramp(t, W(110.0), 0.4));
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: on }}>
      <path d={`M${60 + 10 * g},-260 Q${40 + 14 * g},-60 ${170 + 10 * g},-10 Q${330},40 ${420},170`} fill="none" stroke={N.cianClaro} strokeWidth={7} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${14 + 20 * g}px ${N.cian})` }} />
      <path d={`M${120 + 10 * g},-300 Q${170},-380 ${250},-370`} fill="none" stroke={N.cianClaro} strokeWidth={5} strokeLinecap="round" opacity={0.6} style={{ filter: `drop-shadow(0 0 10px ${N.cian})` }} />
    </svg>
  );
};
const Titulos6: React.FC = () => (
  <>
    <Sirena />
    <Texto x={960} y={105} t0={E6.tap} t1={E6.police - 0.1} texto="un *desconocido* te toca el hombro" size={82} />
    <Texto x={960} y={105} t0={E6.police} t1={W(109.6)} texto="llamarías a la *policía*" size={82} color="#ffd2da" />
    <Texto x={960} y={105} t0={E6.phone} t1={W(112.6)} texto="lo llamamos *normal*" size={82} color={N.oroClaro} />
    <Texto x={960} y={105} t0={E6.first + 0.2} texto="el *primer engranaje*" size={88} color={N.oroClaro} />
  </>
);
const Escena6: React.FC = () => (
  <EscenaMundo tomas={tomas6} pantalla={<Titulos6 />}>
    <Heroe id="h_mano_toque" x={-330} y={60} h={680} t0={E6.str - 0.2} t1={W(110.4)} glow={N.violeta} tilt={3} rot={72} latidos={toques6} />
    <HombroNeon />
    {toques6.map((tt, i) => <Onda key={i} x={20} y={-50} t0={tt} r={260 + (i % 3) * 60} color={N.violeta} d={0.6} />)}
    <Contador x={420} y={230} t0={E6.n90} d={2.2} a1={90} size={200} color={N.violeta} t1={W(110.4)} />
    <Heroe id="hilos" carpeta="png" x={1000} y={0} h={640} t0={E6.phone - 0.4} t1={W(113.4)} glow={N.oro} tilt={5} latidos={[E6.normal]} />
    <Heroe id="h_cerebro_engranajes" x={1900} y={0} h={720} t0={E6.open - 0.3} glow={N.oro} tilt={3} latidos={[E6.open + 0.3, E6.first]} />
    <Onda x={1890} y={0} t0={E6.first} r={300} color={N.oroClaro} />
  </EscenaMundo>
);

// ═════════ HUB 7 · "The first gear is called the maybe. Many years ago, a psychologist named" ═════════
const Engranaje1: D = ({ t, t0, on, tam }) => (
  <div style={{ position: "absolute", opacity: on, transform: `rotate(${(t - t0) * 30}deg)` }}><EngranajeSvg r={tam * 0.42} color={N.oro} n={1} /></div>
);
const DadoQuizas: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-50,-30 L0,-60 L50,-30 L50,30 L0,60 L-50,30 Z M-50,-30 L0,0 L50,-30 M0,0 L0,60", a: 2.4 },
  ]}>
    <TextoNeon x={0} y={110} texto="quizás" size={36} serif color={N.oroClaro} on={ramp(t, t0 + 0.2, 0.3)} />
    <g transform={`rotate(${Math.sin(t * 3) * 8})`}><TextoNeon x={-24} y={-26} texto="?" size={28} color={N.cianClaro} /><TextoNeon x={26} y={14} texto="?" size={28} color={N.cianClaro} /></g>
  </Glifo>
);
const Ficha: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-80,-60 L80,-60 L80,60 L-80,60 Z", a: 2 },
    { d: circ(-40, -10, 22) + " M-70,40 Q-70,10 -40,10 Q-10,10 -10,40", c: N.gris, a: 2 },
    { d: "M10,-20 L60,-20 M10,0 L50,0", c: N.gris, a: 1.6 },
  ]}>
    <TextoNeon x={0} y={86} texto="1950s" size={22} serif color={N.texto2} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 7 · la caja de Skinner: palomas, palanca, comida, hambre ═════════
const E7 = { skinner: T("Skinner", 121), pigeons: T("pigeons", 122), box: T("box", 123), lever: T("small lever", 124), pressed: T("pressed the lever", 126), food: T("food came out", 127), simple: T("Simple", 129), hungry: T("hungry", 131), full: T("full", 133) };
export const Paloma: React.FC<{ x: number; y: number; t0: number; picotazos: number[]; s?: number; color?: string }> = ({ x, y, t0, picotazos, s = 1, color = "#e6eeff" }) => {
  const t = useT();
  if (t < t0 - 0.2) return null;
  const pk = Math.max(0, ...picotazos.map((tp) => (t >= tp - 0.12 && t < tp + 0.25 ? Math.sin(((t - tp + 0.12) / 0.37) * Math.PI) : 0)));
  const bob = Math.sin(t * 5) * 2;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, opacity: ramp(t, t0, 0.3), transform: `scale(${s})` }}>
      <svg width={1} height={1} style={{ overflow: "visible" }}>
        <g style={{ filter: `drop-shadow(0 0 7px ${color})` }} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
          <path d="M-50,10 Q-40,-30 0,-30 Q10,-32 18,-36 M18,-36 Q30,-30 20,24 Q-10,40 -50,10 Z" fill="rgba(230,238,255,.05)" />
          <path d="M-30,0 Q0,-14 24,4 Q0,14 -30,0" stroke={N.violeta} />
          <path d="M-50,10 L-80,0 L-74,18 Z" />
          <path d="M0,30 L-4,52 M12,28 L14,52" stroke={N.oro} />
          <g transform={`rotate(${pk * 38}, 18, -30)`}>
            <path d="M18,-36 Q22,-60 40,-56 Q52,-52 48,-42 L62,-38 L46,-34 Q40,-26 28,-26" fill="rgba(230,238,255,.05)" />
            <circle cx={38} cy={-48} r={3} fill={color} />
          </g>
        </g>
      </svg>
    </div>
  );
};
const B7: Beat[] = reg([
  { t: T("Skinner", 121), id: "h_caja_skinner", glow: N.cian, tit: "la caja de *Skinner*" },
  { t: T("pressed the lever", 126), id: "h_palanca_comida", glow: N.oro, tit: "aprieta, y sale *comida*" },
  { t: T("hungry", 131), id: "h_paloma_llena", glow: N.violeta, tit: "hambre, después *llenas*" },
]);
const Escena7: React.FC = () => <EscenaHeroes ini={W(121.2)} fin={W(134.3)} beats={B7} />;

export const SEGS_M02: Seg[] = [
  {
    hub: { portal: "preg", orbs: [
      { id: "preg", t: T("Why", 67), ang: -14, anillo: 0, tam: 220, D: Pregunta },
      { id: "cel", t: T("pick up your phone", 67), ang: 200, anillo: 1, tam: 170, D: CelularSube },
      { id: "bost", t: T("bored", 70), ang: 128, anillo: 2, tam: 220, D: Bostezo },
    ] },
    Escena: Escena4,
    sonidos: (s) => { s.add("tic", E4.check + 0.3); s.add("vuelo", W(75.5), 0.6); s.add("aparece", E4.story); s.add("grieta", E4.truth + 0.1, 0.5); s.add("neonOn", E4.truth + 0.35); s.add("vuelo", W(79.7), 0.6); for (let i = 0; i < 14; i++) s.add("tic", E4.res + 0.5 + i * 0.18, 0.6); },
  },
  {
    hub: { portal: "enc", orbs: [
      { id: "dig", t: T("numbers", 83), ang: 196, anillo: 1, tam: 200, D: Digitos },
      { id: "enc", t: T("surveys", 84), ang: -12, anillo: 0, tam: 220, D: Encuesta },
      { id: "per", t: T("average person", 86), ang: 126, anillo: 2, tam: 200, D: Persona },
    ] },
    Escena: Escena5,
    sonidos: (s) => { for (let i = 0; i < 18; i++) s.add("digito", E5.n90 + i * 0.075, 0.6); for (let i = 0; i < 8; i++) s.add("tic", E5.far + i * 0.14, 0.6); s.add("vuelo", W(92.7), 0.6); s.add("traza", E5.sec - 0.4); s.add("vuelo", W(95.8), 0.6); s.add("palanca", E5.unlock, 0.6); s.add("aparece", E5.look, 0.6); s.add("palanca", E5.lock, 0.6); s.add("vacio", E5.nada); },
  },
  {
    hub: { portal: "mano", orbs: [
      { id: "rel", t: T("few minutes", 99), ang: 198, anillo: 1, tam: 170, D: RelojMin },
      { id: "mano", t: T("your hand", 101), ang: -14, anillo: 0, tam: 260, D: ManoEstira },
      { id: "otra", t: T("again", 102), ang: 130, anillo: 2, tam: 160, D: Otravez },
    ] },
    Escena: Escena6,
    sonidos: (s) => { toques6.forEach((tt) => s.add("toque", tt, 0.7)); s.add("aviso", E6.police - 0.1, 0.8); s.add("vuelo", W(109.7), 0.6); s.add("aviso", E6.phone, 0.6); s.add("vuelo", W(112.8), 0.6); s.add("grieta", E6.open + 0.3, 0.6); s.add("engranaje", E6.first); },
  },
  {
    hub: { portal: "eng", orbs: [
      { id: "eng", t: T("first gear", 116), ang: -16, anillo: 0, tam: 230, D: Engranaje1, png: "engranaje" },
      { id: "dado", t: T("maybe", 117), ang: 196, anillo: 1, tam: 160, D: DadoQuizas },
      { id: "ficha", t: T("psychologist", 119), ang: 128, anillo: 2, tam: 200, D: Ficha },
    ] },
    Escena: Escena7,
    sonidos: (s) => { s.add("aparece", E7.pigeons); s.add("traza", E7.box - 0.3); s.add("palanca", E7.pressed); s.add("palanca", E7.pressed + 1.2, 0.7); s.add("premio", E7.food, 0.5); s.add("palanca", E7.hungry - 0.2, 0.7); s.add("palanca", E7.hungry + 0.4, 0.7); s.add("premio", E7.hungry + 0.6, 0.4); s.add("latido", E7.full); },
  },
];
