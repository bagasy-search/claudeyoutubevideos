// gb01 v2 · MINUTO 14 (ventanas 52-54, 870-909 s): acá está el quizás, la palanca, la cinta sin fin… y el punto rojo: cuatro
// engranajes · ahora los ves (la linterna) · una máquina que ves ya no te maneja en la oscuridad (se cortan los hilos) · quedate ·
// la próxima: otra máquina detrás de la cortina · hasta entonces: pará, respirá, mirá la ola.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { EscenaMundo, Texto, circ } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const PIEL = "#e6eeff";
const COL = [N.violeta, N.oro, N.cian, N.rojo];
const engr = (r: number, n = 10) => {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, w = Math.PI / n;
    ([[0.8, a - w * 0.9], [1, a - w * 0.45], [1, a + w * 0.45], [0.8, a + w * 0.9]] as const).forEach(([k, b], j) => { d += (i === 0 && j === 0 ? "M" : "L") + (r * k * Math.cos(b)).toFixed(1) + "," + (r * k * Math.sin(b)).toFixed(1); });
  }
  return d + "Z " + circ(0, 0, r * 0.28);
};
const Rueda: React.FC<{ x?: number; y?: number; r: number; c: string; rot: number; lbl?: string; op?: number }> = ({ x = 0, y = 0, r, c, rot, lbl, op = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={op} style={glow(c, 10)}>
    <path d={engr(r)} transform={`rotate(${rot})`} fill="rgba(5,5,6,.85)" stroke={c} strokeWidth={Math.max(2, r / 20)} />
    {lbl && <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={r * 0.42} fill={c}>{lbl}</text>}
  </g>
);
const CEREBRO = "M-300,40 Q-340,-180 -140,-230 Q0,-300 160,-240 Q340,-200 330,-20 Q340,120 180,160 Q90,230 -20,196 Q-230,220 -300,40 Z";
const Persona: React.FC<{ x: number; y: number; s?: number; c?: string; op?: number }> = ({ x, y, s = 1, c = PIEL, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op} style={glow(c, 6)}>
    <circle cx={0} cy={-90} r={26} fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
    <path d="M-44,30 Q-44,-56 0,-58 Q44,-56 44,30 Z" fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
  </g>
);

// ═════════ HUB 52 · "Here is the maybe, here is the lever, here is the endless reel, and" ═════════
const RuedaN = (i: number): D => ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={COL[i]} trazos={[]}><Rueda r={80} c={COL[i]} rot={(i % 2 ? -1 : 1) * t * 60} lbl={i === 0 ? "?" : String(i + 1)} /></Glifo>
);
const MaquinaVidrio: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-90,10 Q-100,-60 -40,-76 Q0,-96 46,-76 Q100,-62 96,0 Q100,40 50,50 Q20,76 -10,62 Q-70,70 -90,10 Z", a: 2.6 }]}>
    {[0, 1, 2].map((i) => <Rueda key={i} x={-40 + i * 40} y={-6 + (i % 2) * 20} r={20} c={COL[i]} rot={(i % 2 ? -1 : 1) * t * 80} />)}
  </Glifo>
);

// ═════════ ESCENA 52 · y el punto rojo: cuatro engranajes · ahora los ves · una máquina que ves ya no te controla en la oscuridad ═════════
const E52 = { red: T("the red dot", 875.5), four: T("four gears", 876.5), see: T("can see them", 878), machine: T("a machine you", 880), controls: T("no longer controls", 882.5), dark: T("the dark", 884) };
const tomas52: Toma[] = [[875.5, 0, 0, 1.08], [878.4, 0, 0, 1.0], [878.8, 1000, 0, 1.06], [880.0, 1000, 0, 1.0], [880.4, 2000, 0, 1.02], [885.0, 2000, 0, 1.1]];
const CuatroRuedas: React.FC = () => {
  const t = useT();
  const cae = ramp(t, E52.red - 0.2, 0.7, easeOut);
  const POS = [[-240, -40], [-80, 30], [80, -40], [240, 30]];
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <path d={CEREBRO} fill="rgba(203,251,255,.04)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 10)} transform="scale(1.15)" />
        {POS.map(([x, y], i) => <Rueda key={i} x={x} y={i === 3 ? lerp(-420, y, cae) : y} r={78} c={COL[i]} rot={(i % 2 ? -1 : 1) * t * 50 + i * 18} lbl={String(i + 1)} op={i === 3 ? cae : 1} />)}
        {cae >= 1 && <circle cx={240} cy={30} r={lerp(78, 220, ramp(t, E52.red + 0.5, 0.6))} fill="none" stroke={N.rojo} strokeWidth={3} opacity={1 - ramp(t, E52.red + 0.5, 0.6)} />}
      </svg>
      <Texto x={0} y={-320} t0={E52.red} texto="and the *red dot*" size={52} color={N.rojoBorde} t1={E52.four} />
      <Texto x={0} y={-320} t0={E52.four} texto="*four* gears" size={62} color={N.oroClaro} />
    </>
  );
};
const Linterna: React.FC = () => {
  const t = useT();
  if (t < E52.see - 0.6) return null;
  const barre = ramp(t, E52.see - 0.3, 1.0, easeOut);
  const ang = lerp(-50, 0, barre);
  return (
    <>
      <svg width={1} height={1} style={abs(1000, 40)} opacity={ramp(t, E52.see - 0.6, 0.3)}>
        <defs><clipPath id="l52"><path d={`M0,300 L${-260 + 0},-300 L${260},-300 Z`} transform={`rotate(${ang} 0 300)`} /></clipPath></defs>
        {[0, 1, 2, 3].map((i) => <Rueda key={"d" + i} x={-210 + i * 140} y={-40 + (i % 2) * 60} r={64} c={N.gris} rot={(i % 2 ? -1 : 1) * t * 50} op={0.4} />)}
        <path d="M0,300 L-260,-300 L260,-300 Z" transform={`rotate(${ang} 0 300)`} fill="rgba(255,230,160,.1)" />
        <g clipPath="url(#l52)">{[0, 1, 2, 3].map((i) => <Rueda key={i} x={-210 + i * 140} y={-40 + (i % 2) * 60} r={64} c={COL[i]} rot={(i % 2 ? -1 : 1) * t * 50} lbl={String(i + 1)} />)}</g>
        <g transform={`translate(0,300) rotate(${ang})`} style={glow(N.oro, 10)}><rect x={-26} y={0} width={52} height={90} rx={10} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={4} /><rect x={-34} y={-14} width={68} height={20} rx={6} fill={N.oroClaro} /></g>
      </svg>
      <Texto x={1000} y={-320} t0={E52.see} texto="now you can *see* them" size={54} color={N.oroClaro} />
    </>
  );
};
const Hilos: React.FC = () => {
  const t = useT();
  if (t < E52.machine - 0.5) return null;
  const luz = ramp(t, E52.controls, 0.8);
  const corte = ramp(t, E52.controls + 0.6, 0.5);
  const cuelga = (1 - corte) * Math.sin(t * 3) * 8;
  return (
    <>
      <div style={{ position: "absolute", left: 2000 - 520, top: 40 - 420, width: 1040, height: 840, background: `radial-gradient(ellipse at 50% 30%, rgba(255,220,150,${0.18 * luz}), transparent 65%)` }} />
      <svg width={1} height={1} style={abs(2000, 40)} opacity={ramp(t, E52.machine - 0.5, 0.4)}>
        {/* la máquina arriba, en la oscuridad */}
        <rect x={-260} y={-300} width={520} height={110} rx={16} fill="rgba(5,5,6,.95)" stroke={luz > 0.5 ? N.oroClaro : N.gris} strokeWidth={4} style={glow(N.oro, 10 * luz)} />
        {[0, 1, 2, 3].map((i) => <Rueda key={i} x={-180 + i * 120} y={-245} r={40} c={luz > 0.5 ? COL[i] : N.gris} rot={(i % 2 ? -1 : 1) * t * 70 * (1 - corte * 0.8)} />)}
        {/* hilos de títere hasta la persona */}
        {[-70, -30, 30, 70].map((x, i) => <g key={i}>
          <path d={`M${x * 2},-190 L${x * 2},${-120 - 40 * corte}`} stroke={N.texto2} strokeWidth={2} />
          <path d={`M${x * 2},${-80 + 60 * corte} L${x + cuelga},${[30, -100, -100, 30][i]}`} stroke={N.texto2} strokeWidth={2} opacity={1 - corte} />
        </g>)}
        {corte > 0 && corte < 1 && [-140, -60, 60, 140].map((x, i) => <circle key={i} cx={x} cy={-100} r={10 * (1 - corte)} fill={N.oroClaro} />)}
        <g transform={`translate(${cuelga},${lerp(0, -10, corte)}) rotate(${cuelga * 0.6})`}><Persona x={0} y={120} s={1.6} c={corte > 0.5 ? N.oroClaro : PIEL} /></g>
      </svg>
      <Texto x={2000} y={-330} t0={E52.machine} texto="a machine you *can see*" size={50} t1={E52.controls} />
      <Texto x={2000} y={-330} t0={E52.controls} texto="no longer controls you *in the dark*" size={46} color={N.oroClaro} />
    </>
  );
};
const Escena52: React.FC = () => <EscenaMundo tomas={tomas52}><CuatroRuedas /><Linterna /><Hilos /></EscenaMundo>;

// ═════════ HUB 53 · "If this helped you understand your own mind a little better," ═════════
const Ayudo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-70,20 L-70,-30 Q-70,-50 -50,-50 L-20,-50 L-10,-90 Q0,-100 14,-88 L10,-50 L60,-50 Q76,-48 72,-30 L60,40 Q56,56 40,56 L-70,56 Z M-90,-50 L-90,56", a: 2.6 }]} />
);
const Bombilla: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-26,40 Q-60,10 -60,-26 Q-60,-80 0,-80 Q60,-80 60,-26 Q60,10 26,40 Z M-24,54 L24,54 M-18,68 L18,68", a: 2.6 }]}>
    <circle cx={0} cy={-26} r={20 + 4 * Math.sin(t * 4)} fill={N.oro} opacity={0.5} style={glow(N.oro, 16)} />
  </Glifo>
);
const CerebroCalma: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-90,10 Q-100,-60 -40,-76 Q0,-96 46,-76 Q100,-62 96,0 Q100,40 50,50 Q20,76 -10,62 Q-70,70 -90,10 Z", a: 2.6, f: "rgba(203,251,255,.05)" }]}>
    <circle r={lerp(20, 40, (Math.sin(t * 1.3) + 1) / 2)} fill="none" stroke={N.cianClaro} strokeWidth={2} opacity={0.6} />
  </Glifo>
);

// ═════════ ESCENA 53 · quedate · la próxima abrimos otra vez el cerebro · otra máquina detrás de la cortina: la que te hace abandonar ═════════
const E53 = { stay: T("stay with me", 888.5), next: T("Next time", 890), open: T("open the glass", 891.5), different: T("different machine", 894), quit: T("makes you quit", 895.5), hard: T("hard things", 897), want: T("truly want", 897), until: T("Until then", 899.5) };
const tomas53: Toma[] = [[889.1, 0, 0, 1.06], [890.3, 0, 0, 1.0], [890.7, 1000, 0, 1.06], [E53.hard - 0.7, 1000, 0, 1.0], [E53.hard - 0.3, 1950, 0, 1.04], [899.8, 1950, 0, 1.0], [900.7, 1950, 0, 1.06]];
const Quedate: React.FC = () => {
  const t = useT();
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-300 + i * 100} cy={140 - Math.sin(i * 0.6) * 30} r={10} fill={N.oroClaro} opacity={neonOn(t, E53.stay + i * 0.1) * 0.8} style={glow(N.oro, 10)} />)}
        <g transform="translate(0,-20)" style={glow(N.oro, 14)}><path d="M-30,40 L30,40 L40,-50 L-40,-50 Z" fill={`rgba(255,200,110,${0.3 + 0.1 * Math.sin(t * 5)})`} stroke={N.oroClaro} strokeWidth={4} /><path d="M-24,-50 Q0,-90 24,-50" fill="none" stroke={N.oroClaro} strokeWidth={4} /></g>
      </svg>
      <Texto x={0} y={-300} t0={E53.stay} texto="*stay* with me" size={60} color={N.oroClaro} />
    </>
  );
};
const Cortina: React.FC = () => {
  const t = useT();
  if (t < E53.next - 0.5) return null;
  const tapa = ramp(t, E53.open, 1.0, easeOut);
  const abre = ramp(t, E53.different - 0.2, 1.2, easeOut);
  const vuelve = ramp(t, E53.quit + 0.3, 1.8);
  return (
    <>
      <svg width={1} height={1} style={abs(1000, 40)} opacity={ramp(t, E53.next - 0.5, 0.4)}>
        {/* el cerebro de vidrio que se abre como una caja */}
        <g transform="translate(-300,40) scale(0.55)">
          <path d="M-300,40 Q-320,120 -200,170 Q0,220 200,170 Q320,120 300,40 Z" fill="rgba(203,251,255,.04)" stroke={N.cianClaro} strokeWidth={6} style={glow(N.cian, 10)} />
          <g transform={`rotate(${-50 * tapa} -300 40)`}><path d="M-300,40 Q-340,-180 -140,-230 Q0,-300 160,-240 Q340,-200 330,-20 L300,40 Z" fill="rgba(203,251,255,.04)" stroke={N.cianClaro} strokeWidth={6} style={glow(N.cian, 10)} /></g>
          <circle cx={0} cy={60} r={60 * tapa} fill={N.oro} opacity={0.3} style={glow(N.oro, 30)} />
        </g>
        {/* la cortina y lo que hay detrás: una montaña, alguien que sube y se da vuelta */}
        <g transform="translate(220,0)">
          <rect x={-240} y={-230} width={480} height={430} fill="rgba(5,5,6,.6)" stroke={N.gris} strokeWidth={2} />
          <g opacity={abre}>
            <path d="M-200,190 L-20,-150 L60,-40 L110,-110 L220,190 Z" fill="rgba(183,123,255,.06)" stroke={N.violeta} strokeWidth={4} style={glow(N.violeta, 8)} />
            <path d="M-20,-150 L-20,-200 L20,-188 L-20,-176" fill="rgba(255,200,110,.4)" stroke={N.oroClaro} strokeWidth={3} />
            <g transform={`translate(${lerp(-140, -60, Math.min(1, vuelve * 2)) - lerp(0, 100, Math.max(0, vuelve * 2 - 1))},${lerp(150, 0, Math.min(1, vuelve * 2)) + lerp(0, 150, Math.max(0, vuelve * 2 - 1))}) scale(${vuelve > 0.5 ? -0.5 : 0.5},0.5)`}><Persona x={0} y={0} c={N.oroClaro} /></g>
            <text x={0} y={240} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={30} fill={N.violeta} opacity={ramp(t, E53.quit, 0.3)}>the quitting machine</text>
          </g>
          {/* paños de la cortina */}
          <path d={`M-240,-240 L${lerp(0, -200, abre)},-240 Q${lerp(-20, -210, abre)},0 ${lerp(0, -230, abre)},210 L-240,210 Z`} fill="rgba(120,10,30,.85)" stroke={N.rojo} strokeWidth={3} />
          <path d={`M240,-240 L${lerp(0, 200, abre)},-240 Q${lerp(20, 210, abre)},0 ${lerp(0, 230, abre)},210 L240,210 Z`} fill="rgba(120,10,30,.85)" stroke={N.rojo} strokeWidth={3} />
        </g>
      </svg>
      <Texto x={1000} y={-320} t0={E53.next} texto="next time: open the *glass brain* again" size={44} color={N.cianClaro} t1={E53.different} />
      <Texto x={1000} y={-320} t0={E53.different} texto="a *different* machine" size={52} color={N.violeta} />
    </>
  );
};
const LoQueQueres: React.FC = () => {
  const t = useT();
  if (t < E53.hard - 0.5) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(1950, 40)} opacity={ramp(t, E53.hard - 0.5, 0.4)}>
        {[["learn", N.cianClaro], ["create", N.violeta], ["train", N.verde], ["finish", N.oroClaro]].map(([l, c], i) => { const k = ramp(t, E53.hard + i * 0.3, 0.4); return <g key={i} transform={`translate(${-270 + i * 180},${20 + (i % 2) * 60})`} opacity={k}>
          <rect x={-74} y={-40} width={148} height={80} rx={16} fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3} style={glow(c, 6)} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={30} fill={c}>{l}</text>
          <path d={`M-80,0 L${-80 + 160 * ramp(t, E53.want + 0.3 + i * 0.15, 0.3)},0`} stroke={N.rojo} strokeWidth={5} opacity={0.6} />
        </g>; })}
        <text y={220} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={40} fill={N.texto2} opacity={ramp(t, E53.until, 0.4)}>until then…</text>
      </svg>
      <Texto x={1950} y={-310} t0={E53.hard} texto="the hard things you *truly want*" size={48} color={N.oroClaro} />
    </>
  );
};
const Escena53: React.FC = () => <EscenaMundo tomas={tomas53}><Quedate /><Cortina /><LoQueQueres /></EscenaMundo>;

// ═════════ HUB 54 · "the next time your thumb reaches for the screen," ═════════
const OlaMini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[{ d: "M-90,40 Q-50,40 -30,0 Q-10,-50 30,-46 Q60,-40 50,-14 Q30,-30 20,0 Q10,40 90,40", a: 3 }]} />
);
const PantallaMini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-40,-80 L40,-80 Q50,-80 50,-70 L50,70 Q50,80 40,80 L-40,80 Q-50,80 -50,70 L-50,-70 Q-50,-80 -40,-80 Z", a: 2.6 }]}>
    <circle r={14 + 4 * Math.sin(t * 6)} fill={N.rojo} cx={30} cy={-60} style={glow(N.rojo, 10)} />
  </Glifo>
);
const PulgarHub: D = ({ t, t0, on, tam }) => {
  const a = ramp(t, t0 + 0.2, 1.0, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-10,-80 L50,-80 Q60,-80 60,-70 L60,70 Q60,80 50,80 L-10,80 Q-20,80 -20,70 L-20,-70 Q-20,-80 -10,-80 Z", c: N.cianClaro, a: 2.4 }]}>
      <path d={`M-100,${lerp(80, 40, a)} Q-60,${lerp(60, 10, a)} ${lerp(-60, 10, a)},${lerp(40, -10, a)}`} fill="none" stroke={PIEL} strokeWidth={22} strokeLinecap="round" />
    </Glifo>
  );
};

// ═════════ ESCENA 54 · pará · respirá · mirá la ola ═════════
const E54 = { stop: T("stop, breathe", 904), breathe: T("breathe, and watch", 904.5), wave: T("the wave", 906.5) };
const tomas54: Toma[] = [[904.3, 0, 0, 1.06], [905.9, 0, 0, 1.0], [906.3, 0, 0, 0.92], [910.5, 0, 0, 0.86]];
const Cierre: React.FC = () => {
  const t = useT();
  const resp = (Math.sin((t - E54.breathe) * 1.4 - Math.PI / 2) + 1) / 2;
  const ola = ramp(t, E54.wave - 0.2, 2.6);
  const y = (x: number) => 260 + 14 * Math.sin(x / 70 + t * 2) - 200 * Math.exp(-((x - lerp(-1100, 1100, ola)) ** 2) / 60000);
  let d = "M-1200,420"; for (let x = -1200; x <= 1200; x += 24) d += ` L${x},${y(x).toFixed(1)}`; d += " L1200,420 Z";
  return (
    <>
      <svg width={1} height={1} style={abs(0, 0)}>
        <path d={d} fill="rgba(80,200,255,.1)" stroke={N.cian} strokeWidth={4} opacity={ramp(t, E54.wave - 0.4, 0.5)} style={glow(N.cian, 12)} />
        {/* pará: la palma */}
        <g transform="translate(-420,-20)" opacity={ramp(t, E54.stop, 0.3)} style={glow(N.oroClaro, 8)}>
          <path d="M-40,80 L-40,-20 M-40,-20 L-40,-70 M-14,-20 L-14,-90 M12,-20 L12,-92 M38,-20 L38,-70 M-40,80 L44,80 L44,-20 M-40,0 Q-70,-10 -76,-40" fill="none" stroke={N.oroClaro} strokeWidth={9} strokeLinecap="round" />
          <text y={150} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={46} fill={N.oroClaro}>stop</text>
        </g>
        {/* respirá: el aro */}
        <g transform="translate(0,-20)" opacity={ramp(t, E54.breathe, 0.3)}>
          <circle r={lerp(50, 110, resp)} fill={`rgba(80,200,255,${0.05 + 0.05 * resp})`} stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 12)} />
          <text y={170} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={46} fill={N.cianClaro}>breathe</text>
        </g>
        {/* mirá la ola: el ojo sereno */}
        <g transform="translate(420,-20)" opacity={ramp(t, E54.wave - 0.3, 0.3)} style={glow(N.cian, 8)}>
          <path d="M-90,0 Q0,-60 90,0 Q0,60 -90,0 Z" fill="rgba(5,5,6,.9)" stroke={PIEL} strokeWidth={4} />
          <circle r={24} fill="none" stroke={N.cian} strokeWidth={4} /><circle r={9} fill={PIEL} />
          <text y={150} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={46} fill={N.cian}>watch the wave</text>
        </g>
      </svg>
    </>
  );
};
const Escena54: React.FC = () => <EscenaMundo tomas={tomas54}><Cierre /></EscenaMundo>;

export const SEGS_M14: Seg[] = [
  {
    hub: { portal: "maqv", orbs: [
      { id: "r0", t: T("the maybe", 871), ang: 198, anillo: 1, tam: 150, D: RuedaN(0) },
      { id: "r1", t: T("the lever", 872), ang: 128, anillo: 2, tam: 150, D: RuedaN(1) },
      { id: "r2", t: T("endless reel", 874), ang: 250, anillo: 1, tam: 150, D: RuedaN(2) },
      { id: "maqv", t: T("endless reel", 874) + 0.4, ang: -14, anillo: 0, tam: 240, D: MaquinaVidrio },
    ] },
    Escena: Escena52,
    sonidos: (s) => { s.add("vuelo", E52.red - 0.2, 0.5); s.add("engranaje", E52.red + 0.5, 0.7); s.add("maquinaGira", E52.four, 0.5); s.add("vuelo", 878.8, 0.5); s.add("luz", E52.see - 0.3, 0.6); s.add("vuelo", 880.4, 0.5); s.add("neonOn", E52.controls, 0.5); [0, 1, 2, 3].forEach((i) => s.add("tic", E52.controls + 0.6 + i * 0.08, 0.5)); s.add("maquinaFrena", E52.dark, 0.4); },
  },
  {
    hub: { portal: "calma", orbs: [
      { id: "ayudo", t: T("this helped you", 885.5), ang: 198, anillo: 1, tam: 150, D: Ayudo },
      { id: "bomb", t: T("understand your own", 885), ang: 128, anillo: 2, tam: 150, D: Bombilla },
      { id: "calma", t: T("your own mind", 886), ang: -14, anillo: 0, tam: 240, D: CerebroCalma },
    ] },
    Escena: Escena53,
    sonidos: (s) => { s.add("luz", E53.stay, 0.5); s.add("vuelo", 890.7, 0.5); s.add("vidrio", E53.open, 0.5); s.add("tiron", E53.different - 0.2, 0.5); s.add("vuelo", 895.8, 0.5); [0, 1, 2, 3].forEach((i) => s.add("aparece", E53.hard + i * 0.3, 0.3)); },
  },
  {
    hub: { portal: "pulgar", orbs: [
      { id: "olam", t: T("the next time", 900.5), ang: 198, anillo: 1, tam: 150, D: OlaMini },
      { id: "pant", t: T("the screen", 902), ang: 128, anillo: 2, tam: 150, D: PantallaMini },
      { id: "pulgar", t: T("thumb reaches for", 901), ang: -14, anillo: 0, tam: 240, D: PulgarHub },
    ] },
    Escena: Escena54,
    sonidos: (s) => { s.add("toque", E54.stop, 0.5); s.add("ola", E54.breathe, 0.4); s.add("ola", E54.wave, 0.6); },
  },
];
