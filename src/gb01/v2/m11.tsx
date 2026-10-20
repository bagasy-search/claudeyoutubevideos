// gb01 v2 · MINUTO 11 (ventanas 40-43, 670-736 s): mirá tu mano · los dedos que envuelven el celular · parte del cuerpo ·
// imaginá apoyarlo y abrir la mano · la resistencia elástica · "¿y si pasa algo?" = el engranaje 1 hablando · ya sabés su nombre ·
// no con enojo · el caballo salvaje que se calma · sacar el quizás · apagar notificaciones (menos las de humanos) · el quizás a la mitad.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { EscenaMundo, Texto, circ, Png } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
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
const tomas40: Toma[] = [[676.0, 0, 0, 1.06], [679.4, 0, 0, 1.0], [679.9, 950, 0, 1.08], [682.3, 950, 0, 1.0], [682.8, 1900, 0, 1.0], [686.6, 1900, 0, 1.0], [687.8, 1900, 0, 1.12]];
const Envuelve: React.FC = () => {
  const t = useT();
  const k = ramp(t, E40.wrap, 1.0, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 0)}><g transform="translate(0,30) scale(0.95)"><ManoEnvuelve k={k} /></g></svg>
      <Texto x={0} y={-310} t0={E40.wrap} texto="your fingers *wrap* around it" size={50} />
    </>
  );
};
const ParteCuerpo: React.FC = () => {
  const t = useT();
  if (t < E40.natural - 0.5) return null;
  const v = ramp(t, E40.part, 1.0, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(950, 0)} opacity={ramp(t, E40.natural - 0.5, 0.4)}>
        {/* brazo en rayos-x: nervios que nacen del celular y suben por el brazo */}
        <path d="M-160,330 Q-150,120 -110,-20 L110,-20 Q150,120 160,330" fill="rgba(203,251,255,.03)" stroke={N.gris} strokeWidth={3} />
        <path d={tel(170, 300, 22)} transform="translate(0,-150)" fill="rgba(160,240,255,.08)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 10)} />
        {[-50, -15, 20, 55].map((x, i) => <path key={i} d={`M${x * 0.6},-30 Q${x},120 ${x * 1.6},330`} fill="none" stroke={N.cian} strokeWidth={3} strokeDasharray="460" strokeDashoffset={460 * (1 - v)} style={glow(N.cian, 10)} />)}
        {[0, 1, 2].map((i) => { const y = -30 + ((t * 160 + i * 120) % 360); return <circle key={i} cx={Math.sin(y / 60) * 30} cy={y} r={6} fill={N.cianClaro} opacity={v} style={glow(N.cian, 8)} />; })}
        <g opacity={ramp(t, E40.natural, 0.4)}><path d="M-190,-60 Q-260,-60 -260,0" fill="none" stroke={N.verde} strokeWidth={2} /><text x={-270} y={30} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={22} fill={N.verde}>natural</text></g>
      </svg>
      <Texto x={950} y={-320} t0={E40.part} texto="like part of your *body*" size={50} color={N.cianClaro} />
    </>
  );
};
const Imagina: React.FC = () => {
  const t = useT();
  if (t < E40.moment - 0.5) return null;
  const baja = ramp(t, E40.table - 0.3, 0.9, easeOut);
  const abre = ramp(t, E40.opening + 0.2, 0.9, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 0)} opacity={ramp(t, E40.moment - 0.5, 0.4)}>
        {/* marco de "imaginá": nube punteada que respira */}
        <rect x={-460} y={-250} width={920} height={540} rx={60} fill="rgba(183,123,255,.03)" stroke={N.violeta} strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-t * 30} opacity={ramp(t, E40.imagine, 0.5)} />
        <path d="M-420,240 L420,240 M-380,240 L-400,300 M380,240 L400,300" stroke={N.oroClaro} strokeWidth={5} style={glow(N.oro, 6)} opacity={ramp(t, E40.table - 0.6, 0.4)} />
        {/* el celular queda sobre la mesa, acostado */}
        <g transform={`translate(${lerp(0, 120, baja)},${lerp(-40, 222, baja)}) rotate(${lerp(0, 90, baja)}) scale(${lerp(1, 0.55, baja)})`}><path d={tel(150, 280, 22)} fill="rgba(160,240,255,.08)" stroke={N.cianClaro} strokeWidth={6} style={glow(N.cian, 8)} /></g>
        {/* la mano se separa y se abre */}
        <g transform={`translate(${lerp(0, -170, baja)},${lerp(10, -10, baja)}) scale(0.7)`}><ManoEnvuelve k={1 - Math.max(baja * 0.5, abre)} cel={false} c={abre > 0.6 ? N.oroClaro : PIEL} /></g>
        {abre > 0 && <circle cx={-170} cy={-40} r={lerp(60, 300, abre)} fill="none" stroke={N.oroClaro} strokeWidth={2} opacity={1 - abre} />}
      </svg>
      <Texto x={1900} y={-320} t0={E40.imagine} texto="*imagine* putting it down" size={50} color={N.violeta} t1={E40.opening} />
      <Texto x={1900} y={-320} t0={E40.opening} texto="and *opening* your hand" size={54} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 40
const H40: React.FC = () => (
  <>
    <Png id="marioneta" x={1390} y={60} w={220} t0={E40.part} glow={N.oro} />
  </>
);
const Escena40: React.FC = () => <EscenaMundo tomas={tomas40}><Envuelve /><ParteCuerpo /><Imagina /><H40 /></EscenaMundo>;

// ═════════ HUB 41 · "Do you feel that small resistance, that little voice that says," ═════════
const Elastico: D = ({ t, t0, on, tam }) => {
  const e = 30 * Math.abs(Math.sin(t * 2.5));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojoBorde} trazos={[{ d: circ(-70, 0, 10) + " " + circ(70, 0, 10), a: 2.4, c: PIEL }]}>
      <path d={`M-70,0 Q0,${e * 2} 70,0`} fill="none" stroke={N.rojo} strokeWidth={6} />
      <TextoNeon y={70} texto="resistance" size={18} color={N.rojoBorde} on={ramp(t, t0 + 0.3, 0.3)} />
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
    <TextoNeon y={-2} texto="but..." size={34} serif color={N.violeta} on={0.6 + 0.4 * Math.sin(t * 4)} />
  </Glifo>
);

// ═════════ ESCENA 41 · "¿y si pasa algo?" · es el engranaje 1 hablando · ya sabés su nombre · ¿cómo frenamos la máquina? ═════════
const E41 = { what: T("what if something", 693), voice: T("That voice is", 695), first: T("first gear speaking", 696), maybe: T("the maybe", 698), name: T("know its name", 699), stop: T("how do we", 701.5), machine: T("the machine", 702.3) };
const tomas41: Toma[] = [[693.1, 0, 0, 1.12], [695.0, 0, 0, 1.0], [695.5, 950, 0, 1.08], [699.6, 950, 0, 1.0], [700.2, 950, 30, 1.16], [701.5, 950, 0, 1.0], [701.9, 1900, 0, 1.04], [703.5, 1900, 0, 1.12]];
const QueSiPasa: React.FC = () => {
  const t = useT();
  const k = pop(t, E41.what - 0.1, 8);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 20)}>
        {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7 + t * 0.4, r = 300 + 40 * Math.sin(t + i); return <text key={i} x={Math.cos(a) * r} y={Math.sin(a) * r * 0.6} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={40 + (i % 3) * 14} fill={N.violeta} opacity={0.25 + 0.2 * Math.sin(t * 2 + i)}>?</text>; })}
        <g transform={`scale(${k})`} style={glow(N.violeta, 12)}>
          <path d="M-300,-100 L300,-100 Q330,-100 330,-70 L330,60 Q330,90 300,90 L-40,90 L-110,160 L-100,90 L-300,90 Q-330,90 -330,60 L-330,-70 Q-330,-100 -300,-100 Z" fill="rgba(5,5,6,.9)" stroke={N.violeta} strokeWidth={5} />
          <text y={-4} textAnchor="middle" dominantBaseline="central" fontFamily="serif" fontStyle="italic" fontSize={56} fill="#f0e2ff">what if something happens?</text>
        </g>
      </svg>
    </>
  );
};
const EngranajeHabla: React.FC = () => {
  const t = useT();
  if (t < E41.voice - 0.5) return null;
  const boca = Math.abs(Math.sin(t * 9)) * (t > E41.first && t < E41.name ? 1 : 0.2);
  const tag = pop(t, E41.name + 0.1, 7);
  const n = 10;
  const d = Array.from({ length: n }, (_, i) => { const a = (i / n) * 2 * Math.PI, w = Math.PI / n; return [[0.8, a - w * 0.9], [1, a - w * 0.45], [1, a + w * 0.45], [0.8, a + w * 0.9]].map(([k, b], j) => `${i === 0 && j === 0 ? "M" : "L"}${(160 * k * Math.cos(b)).toFixed(1)},${(160 * k * Math.sin(b)).toFixed(1)}`).join(""); }).join("") + "Z";
  return (
    <>
      <svg width={1} height={1} style={abs(950, 30)} opacity={ramp(t, E41.voice - 0.5, 0.4)}>
        <path d={d} transform={`rotate(${t * 20})`} fill="rgba(5,5,6,.9)" stroke={N.violeta} strokeWidth={6} style={glow(N.violeta, 12)} />
        <circle cx={-40} cy={-30} r={14} fill={N.violeta} /><circle cx={40} cy={-30} r={14} fill={N.violeta} />
        <ellipse cx={0} cy={50} rx={46} ry={6 + 30 * boca} fill="#000" stroke={N.violeta} strokeWidth={4} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${190 + i * 26},-40 Q${210 + i * 26},0 ${190 + i * 26},40`} fill="none" stroke={N.violeta} strokeWidth={4} opacity={boca} />)}
        {/* etiqueta con su nombre */}
        <g transform={`translate(0,250) rotate(-4) scale(${tag})`} style={glow(N.oro, 10)}>
          <path d="M-190,-44 L170,-44 L210,0 L170,44 L-190,44 Z" fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={4} /><circle cx={170} cy={0} r={9} fill="none" stroke={N.oroClaro} strokeWidth={3} />
          <text x={-10} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={46} letterSpacing={4} fill={N.oroClaro}>THE MAYBE</text>
        </g>
      </svg>
      <Texto x={950} y={-300} t0={E41.first} texto="the *first gear* speaking" size={50} color={N.violeta} t1={E41.name} />
      <Texto x={950} y={-300} t0={E41.name} texto="now you know its *name*" size={52} color={N.oroClaro} />
    </>
  );
};
const ComoFrenar: React.FC = () => {
  const t = useT();
  if (t < E41.stop - 0.5) return null;
  const COL = [N.violeta, N.oro, N.cian, N.rojo];
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 30)} opacity={ramp(t, E41.stop - 0.5, 0.4)}>
        <rect x={-380} y={-160} width={760} height={320} rx={20} fill="rgba(5,5,6,.85)" stroke={PIEL} strokeWidth={3} style={glow("#fff", 4)} />
        {COL.map((c, i) => <g key={i} transform={`translate(${-270 + i * 180},0) rotate(${(i % 2 ? -1 : 1) * t * 60})`} style={glow(c, 8)}><circle r={70} fill="none" stroke={c} strokeWidth={14} strokeDasharray="18 14" /><circle r={22} fill="none" stroke={c} strokeWidth={4} /></g>)}
        <g transform="translate(0,230)" opacity={ramp(t, E41.machine, 0.3)}><circle r={50} fill="rgba(255,42,72,.3)" stroke={N.rojo} strokeWidth={5} style={glow(N.rojo, 14)} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={44} fill="#fff">?</text></g>
      </svg>
      <Texto x={1900} y={-300} t0={E41.stop} texto="how do we *stop* the machine?" size={50} />
    </>
  );
};
// objetos de vidrio de la escena 41
const H41: React.FC = () => (
  <>
    <Png id="alarma" x={440} y={60} w={240} t0={E41.what} glow={N.rojo} />
    <Png id="engranaje" x={1380} y={60} w={220} t0={E41.first} glow={N.oro} />
    <Png id="engranajes4" x={2360} y={60} w={280} t0={E41.stop} glow={N.oro} />
  </>
);
const Escena41: React.FC = () => <EscenaMundo tomas={tomas41}><QueSiPasa /><EngranajeHabla /><ComoFrenar /><H41 /></EscenaMundo>;

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
const tomas42: Toma[] = [[707.8, 0, 0, 1.04], [711.6, 0, 0, 1.0], [713.8, 0, 0, 0.98], [714.2, 950, 0, 1.1], [715.4, 950, 0, 1.0], [715.9, 1900, 0, 1.04], [719.4, 1900, 0, 1.0], [721.1, 1900, 0, 1.06]];
const CaballoSalvaje: React.FC = () => {
  const t = useT();
  const calma = ramp(t, E42.slowly, 2.4, easeOut);
  const salto = (1 - calma) * Math.max(0, Math.sin(t * 5));
  const mano = ramp(t, E42.slowly - 0.2, 1.2, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <g transform={`translate(80,${80 - 40 * salto}) rotate(${-24 * salto + 14 * calma}) scale(2.2)`}>
          <CaballoCabeza c={calma > 0.7 ? N.oroClaro : N.rojoBorde} boca={salto} />
          {/* crin que se agita y después cae */}
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-10 - i * 4},${-60 + i * 22} q${-30 - 20 * (1 - calma) * Math.sin(t * 9 + i)},${10} ${-40},${30 * calma}`} fill="none" stroke={calma > 0.7 ? N.oroClaro : N.rojoBorde} strokeWidth={2.5} />)}
        </g>
        {(1 - calma) > 0.2 && [0, 1].map((i) => <path key={i} d={`M${-240 + i * 30},${120 - i * 20} l-40,30`} stroke={N.rojoBorde} strokeWidth={4} opacity={Math.abs(Math.sin(t * 10 + i))} />)}
        {/* la mano abierta que se acerca despacio */}
        <g transform={`translate(${lerp(640, 440, mano)},120) rotate(-90)`} opacity={mano} style={glow(N.oroClaro, 8)}>
          <path d="M-40,90 L-40,0 L-36,-80 M-12,0 L-12,-100 M14,0 L14,-104 M40,0 L40,-84 M-40,0 Q-70,-10 -80,-50 M-40,90 L44,90 L44,0" fill="none" stroke={N.oroClaro} strokeWidth={10} strokeLinecap="round" />
        </g>
      </svg>
      <Texto x={0} y={-310} t0={E42.horse} texto="calm a *wild horse*" size={56} color={N.rojoBorde} t1={E42.slowly} />
      <Texto x={0} y={-310} t0={E42.slowly} texto="slowly, with *understanding*" size={52} color={N.oroClaro} />
    </>
  );
};
const SacarQuizas: React.FC = () => {
  const t = useT();
  if (t < E42.first - 0.5) return null;
  const sale = ramp(t, E42.maybe - 0.3, 0.9, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E42.first - 0.5, 0.4)}>
        <rect x={-260} y={-60} width={520} height={240} rx={18} fill="rgba(5,5,6,.85)" stroke={PIEL} strokeWidth={3} />
        <rect x={-90} y={-60} width={180} height={30} fill="#000" />
        {[N.oro, N.cian, N.rojo].map((c, i) => <circle key={i} cx={-160 + i * 160} cy={80} r={50} fill="none" stroke={c} strokeWidth={10} strokeDasharray="14 12" transform={`rotate(${(1 - ramp(t, E42.maybe, 1)) * t * 60} ${-160 + i * 160} 80)`} opacity={i === 1 ? 0 : 0.9} />)}
        {/* el engranaje del quizás, levantado por una mano */}
        <g transform={`translate(0,${lerp(80, -200, sale)}) rotate(${t * 40})`} style={glow(N.violeta, 12)}><circle r={56} fill="rgba(5,5,6,.9)" stroke={N.violeta} strokeWidth={12} strokeDasharray="16 12" /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={44} fill={N.violeta} transform={`rotate(${-t * 40})`}>?</text></g>
        <text x={-230} y={-90} fontFamily="sans-serif" fontWeight={900} fontSize={70} fill={N.oroClaro} style={glow(N.oro, 10)} opacity={pop(t, E42.first, 8)}>1</text>
      </svg>
      <Texto x={950} y={-310} t0={E42.first} texto="first: take away *the maybe*" size={50} color={N.violeta} />
    </>
  );
};
const Interruptores: React.FC = () => {
  const t = useT();
  if (t < E42.off - 0.6) return null;
  const ROWS = [{ l: "games", h: 0 }, { l: "shopping", h: 0 }, { l: "news", h: 0 }, { l: "Mom", h: 1 }, { l: "videos", h: 0 }, { l: "social", h: 0 }];
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 40)} opacity={ramp(t, E42.off - 0.6, 0.4)}>
        <path d={tel(560, 600, 40)} fill="rgba(5,5,6,.85)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 6)} />
        {ROWS.map((r, i) => {
          const y = -230 + i * 88, off = r.h ? 0 : ramp(t, E42.off + 0.3 + i * 0.35, 0.25);
          const verde = r.h && t > E42.human;
          return <g key={i} transform={`translate(0,${y})`}>
            <rect x={-240} y={-36} width={480} height={72} rx={14} fill={verde ? "rgba(80,255,170,.08)" : "transparent"} stroke={verde ? N.verde : N.gris} strokeWidth={2} />
            {r.h ? <g transform="translate(-196,0) scale(0.32)"><circle cx={0} cy={-40} r={30} fill="none" stroke={N.verde} strokeWidth={8} /><path d="M-50,60 Q-50,-6 0,-8 Q50,-6 50,60" fill="none" stroke={N.verde} strokeWidth={8} /></g> : <rect x={-220} y={-20} width={40} height={40} rx={10} fill="none" stroke={N.texto2} strokeWidth={3} />}
            <text x={-160} y={2} dominantBaseline="central" fontFamily="sans-serif" fontWeight={800} fontSize={30} fill={r.h ? N.verde : N.texto2}>{r.l}</text>
            <rect x={120} y={-22} width={90} height={44} rx={22} fill={r.h || off < 0.5 ? "rgba(80,255,170,.6)" : "rgba(255,255,255,.08)"} stroke={r.h || off < 0.5 ? N.verde : N.gris} strokeWidth={2} />
            <circle cx={lerp(188, 142, off)} cy={0} r={17} fill="#fff" />
          </g>;
        })}
      </svg>
      <Texto x={1900} y={-330} t0={E42.off} texto="turn off every *notification*" size={46} t1={E42.human} />
      <Texto x={1900} y={-330} t0={E42.human} texto="except a *real human* who needs you" size={44} color={N.verde} />
    </>
  );
};
// objetos de vidrio de la escena 42
const H42: React.FC = () => (
  <>
    <Png id="regalo" x={1390} y={60} w={240} t0={E42.first} t1={E42.off} glow={N.rojo} />
    <Png id="sobre" x={1440} y={80} w={220} t0={E42.off} glow={N.rojo} />
  </>
);
const Escena42: React.FC = () => <EscenaMundo tomas={tomas42}><CaballoSalvaje /><SacarQuizas /><Interruptores /><H42 /></EscenaMundo>;

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
const tomas43: Toma[] = [[725.5, 0, 0, 1.1], [727.0, 0, 0, 1.0], [727.4, 900, 0, 1.08], [729.4, 900, 0, 1.0], [729.8, 1800, 0, 1.08], [731.9, 1800, 0, 1.0], [732.3, 2700, 0, 1.04], [735.8, 2700, 0, 0.94], [736.8, 2700, 0, 1.0]];
const AlertaNoticias: React.FC = () => {
  const t = useT();
  const sale = ramp(t, E43.news + 0.4, 0.6, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <path d={tel(300, 520, 34)} fill="rgba(5,5,6,.85)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 6)} />
        <g transform={`translate(${lerp(0, 520, sale)},-160)`} opacity={1 - sale}>
          <rect x={-130} y={-40} width={260} height={80} rx={16} fill="rgba(5,5,6,.95)" stroke={N.rojoBorde} strokeWidth={3} />
          <text x={-110} y={-10} fontFamily="sans-serif" fontWeight={900} fontSize={20} fill={N.rojoBorde}>BREAKING</text>
          <path d="M-110,14 L90,14" stroke={N.texto2} strokeWidth={4} />
        </g>
        <text y={20} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={36} fill={N.texto2} opacity={sale}>quiet</text>
      </svg>
      <Texto x={0} y={-310} t0={E43.news} texto="no alerts for *news*" size={52} />
    </>
  );
};
const DejaDeLlamar: React.FC = () => {
  const t = useT();
  if (t < E43.stops - 0.8) return null;
  const para = ramp(t, E43.stops + 0.4, 0.6);
  const vib = (1 - para) * Math.sin(t * 60) * 6;
  return (
    <>
      <svg width={1} height={1} style={abs(900, 40)} opacity={ramp(t, E43.stops - 0.8, 0.3)}>
        <g transform={`translate(${vib},0)`}><path d={tel(260, 460, 32)} fill="rgba(5,5,6,.85)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 6 + 10 * (1 - para))} /></g>
        {[0, 1, 2].map((i) => <g key={i} opacity={(1 - para) * ((Math.sin(t * 8 - i) + 1) / 2)}><path d={`M${-170 - i * 30},-80 Q${-200 - i * 30},0 ${-170 - i * 30},80`} fill="none" stroke={N.rojoBorde} strokeWidth={4} /><path d={`M${170 + i * 30},-80 Q${200 + i * 30},0 ${170 + i * 30},80`} fill="none" stroke={N.rojoBorde} strokeWidth={4} /></g>)}
        <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily="serif" fontStyle="italic" fontSize={60} fill={N.cianClaro} opacity={para}>z z z</text>
      </svg>
      <Texto x={900} y={-310} t0={E43.stops} texto="the phone stops *calling* you" size={48} color={N.cianClaro} />
    </>
  );
};
const MedidorMitad: React.FC = () => {
  const t = useT();
  if (t < E43.loses - 0.5) return null;
  const nivel = lerp(1, 0.5, ramp(t, E43.half, 0.8, easeOut));
  return (
    <>
      <svg width={1} height={1} style={abs(1800, 40)} opacity={ramp(t, E43.loses - 0.5, 0.4)}>
        <rect x={-90} y={-220} width={180} height={440} rx={24} fill="rgba(5,5,6,.9)" stroke={N.violeta} strokeWidth={4} style={glow(N.violeta, 8)} />
        <rect x={-74} y={204 - 408 * nivel} width={148} height={408 * nivel} rx={14} fill="rgba(183,123,255,.5)" />
        <path d="M-110,0 L110,0" stroke={N.oroClaro} strokeWidth={3} strokeDasharray="10 8" opacity={ramp(t, E43.half, 0.3)} />
        <text x={130} y={8} fontFamily="sans-serif" fontWeight={900} fontSize={40} fill={N.oroClaro} opacity={ramp(t, E43.half, 0.3)}>½</text>
        <text y={270} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={34} fill={N.violeta}>the maybe</text>
      </svg>
      <Texto x={1800} y={-310} t0={E43.half} texto="loses *half* its power" size={52} color={N.violeta} />
    </>
  );
};
const VosDecidis: React.FC = () => {
  const t = useT();
  if (t < E43.check - 0.5) return null;
  const giro = ramp(t, E43.it - 0.2, 0.8, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(2700, 40)} opacity={ramp(t, E43.check - 0.5, 0.4)}>
        {/* la correa: antes el celular tiraba de vos; ahora la sostenés vos */}
        <Persona2 x={-220} y={150} />
        <path d={tel(130, 230, 20)} transform="translate(220,40)" fill="rgba(5,5,6,.85)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 6)} />
        <path d={`M-180,${lerp(40, 90, giro)} Q0,${lerp(140, 60, giro)} 160,${lerp(40, 60, giro)}`} fill="none" stroke={giro > 0.5 ? N.oroClaro : N.rojoBorde} strokeWidth={5} style={glow(giro > 0.5 ? N.oro : N.rojo, 8)} />
        <g transform={`translate(${lerp(160, -180, giro)},${lerp(40, 90, giro)})`}><circle r={16} fill={giro > 0.5 ? N.oroClaro : N.rojo} /></g>
        <text x={0} y={280} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={34} fill={N.oroClaro} opacity={ramp(t, E43.decide, 0.3)}>you decide</text>
        <text x={0} y={280} dy={44} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} fontSize={26} fill={N.texto2} opacity={ramp(t, E43.it, 0.3)} textDecoration="line-through">not it</text>
        <text x={360} y={-200} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={110} fill={N.oroClaro} style={glow(N.oro, 14)} opacity={pop(t, E43.second, 8)}>2</text>
      </svg>
      <Texto x={2700} y={-310} t0={E43.check} texto="you check it when *you* decide" size={48} color={N.oroClaro} />
    </>
  );
};
const Persona2: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`} style={glow(PIEL, 6)}>
    <circle cx={0} cy={-150} r={36} fill="rgba(5,5,6,.9)" stroke={PIEL} strokeWidth={4} />
    <path d="M-60,40 Q-60,-100 0,-104 Q60,-100 60,40 Z" fill="rgba(5,5,6,.9)" stroke={PIEL} strokeWidth={4} />
  </g>
);
// objetos de vidrio de la escena 43
const H43: React.FC = () => (
  <>
    <Png id="icono_noticias" x={440} y={60} w={230} t0={E43.news} glow={N.oro} />
    <Png id="megafono" x={1340} y={60} w={250} t0={E43.stops} glow={N.rojo} />
    <Png id="medidor" x={2240} y={60} w={260} t0={E43.half} glow={N.rojo} />
    <Png id="estrella" x={3160} y={60} w={240} t0={E43.check} glow={N.oro} />
  </>
);
const Escena43: React.FC = () => <EscenaMundo tomas={tomas43}><AlertaNoticias /><DejaDeLlamar /><MedidorMitad /><VosDecidis /><H43 /></EscenaMundo>;

export const SEGS_M11: Seg[] = [
  {
    hub: { portal: "dedos", orbs: [
      { id: "mano", t: T("at your hand", 670), ang: 198, anillo: 1, tam: 160, D: ManoHub },
      { id: "cel", t: T("holding your phone", 672), ang: 128, anillo: 2, tam: 160, D: CelHub, png: "celu_brilla" },
      { id: "dedos", t: T("notice how your", 673), ang: -14, anillo: 0, tam: 240, D: DedosHub },
    ] },
    Escena: Escena40,
    sonidos: (s) => { s.add("toque", E40.wrap + 0.3, 0.5); s.add("vuelo", 679.9, 0.5); s.add("sinapsis", E40.part, 0.5); s.add("traza", E40.part + 0.1, 0.4); s.add("vuelo", 682.8, 0.5); s.add("ola", E40.imagine, 0.4); s.add("toque", E40.table + 0.5, 0.6); s.add("luz", E40.opening + 0.3, 0.5); },
  },
  {
    hub: { portal: "globito", orbs: [
      { id: "elast", t: T("small resistance", 689), ang: 198, anillo: 1, tam: 170, D: Elastico },
      { id: "oreja", t: T("voice that", 690), ang: 128, anillo: 2, tam: 150, D: Oreja },
      { id: "globito", t: T("little voice", 690.5), ang: -14, anillo: 0, tam: 240, D: Globito },
    ] },
    Escena: Escena41,
    sonidos: (s) => { s.add("aparece", E41.what - 0.1, 0.6); s.add("vuelo", 695.5, 0.5); s.add("engranaje", E41.first, 0.6); s.add("golpe", E41.name + 0.1, 0.5); s.add("vuelo", 701.9, 0.5); s.add("maquinaGira", E41.stop, 0.4); },
  },
  {
    hub: { portal: "caballo", orbs: [
      { id: "enojo", t: T("Not with anger", 703.5), ang: 198, anillo: 1, tam: 160, D: Enojo },
      { id: "chispa", t: T("another spark", 706), ang: 128, anillo: 2, tam: 150, D: ChispaSeApaga },
      { id: "caballo", t: T("another spark", 706) + 0.5, ang: -14, anillo: 0, tam: 240, D: CaballoHub, png: "caballo" },
    ] },
    Escena: Escena42,
    sonidos: (s) => { s.add("golpe", E42.horse, 0.4); s.add("ola", E42.slowly, 0.5); s.add("latido", E42.slowly + 1.2, 0.4); s.add("vuelo", 714.2, 0.5); s.add("tiron", E42.maybe - 0.3, 0.5); s.add("vuelo", 715.9, 0.5); [0, 1, 2, 4, 5].forEach((i) => s.add("tic", E42.off + 0.3 + i * 0.35, 0.5)); s.add("luz", E42.human, 0.5); },
  },
  {
    hub: { portal: "celsil", orbs: [
      ...[0, 1, 2].map((i) => ({ id: "pto" + i, t: T("No red dots", 721) + i * 0.2, ang: 150 + i * 60, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 100, D: PuntoOff })),
      { id: "campana", t: T("no sounds", 723.5), ang: 40, anillo: 2, tam: 160, D: CampanaMuda, png: "campana" },
      { id: "celsil", t: T("for likes", 723), ang: -14, anillo: 0, tam: 230, D: CelSilencio },
    ] },
    Escena: Escena43,
    sonidos: (s) => { s.add("tiron", E43.news + 0.4, 0.5); s.add("vuelo", 727.4, 0.5); s.add("aviso", E43.stops - 0.6, 0.4); s.add("vacio", E43.stops + 0.4, 0.5); s.add("vuelo", 729.8, 0.5); s.add("maquinaFrena", E43.half, 0.5); s.add("vuelo", 732.3, 0.5); s.add("tiron", E43.it - 0.2, 0.5); s.add("aparece", E43.second, 0.6); },
  },
];
