// gb01 v2 · MINUTO 7 (ventanas 24-27, 402-470 s): el guardián amordazado · la hora que desaparece y una mano se la lleva ·
// el plano de la tragamonedas · el casi-premio (la tercera cereza arriba de la línea) · el medidor casi = premio ·
// el feed lleno de "casi" · la linterna que busca "el que es" · engranaje 3 encaja · la zanahoria · engranaje 4 = punto rojo ·
// la tribu alrededor del fuego.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { EscenaMundo, Obj, Texto, circ, Png } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
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
    <TextoNeon y={86} texto="can't speak" size={20} serif color={N.texto2} on={ramp(t, t0 + 0.4, 0.3)} />
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
const tomas24: Toma[] = [[407.3, 0, 0, 1.15], [408.6, 400, 0, 0.9], [410.6, 640, 0, 1.08], [413.3, 640, 0, 1.0], [414.8, 1500, 0, 1.08], [419.7, 1500, 0, 1.0]];
const LevantaVista: React.FC = () => {
  const t = useT();
  const k = ramp(t, E24.look, 0.6, easeOut);
  return (
    <svg width={1} height={1} style={abs(-20, 60)} opacity={ramp(t, E24.look - 0.6, 0.3)}>
      <g style={glow("#fff", 6)} fill="none" stroke="#e6eeff" strokeWidth={4}>
        <path d="M-120,220 Q-120,40 0,20 Q120,40 120,220" />
        <g transform={`translate(0,-60) rotate(${lerp(32, -6, k)})`}><circle cx={0} cy={-30} r={56} fill="rgba(5,5,6,.9)" /><path d={`M18,${-40 + 8 * (1 - k)} l14,0`} /></g>
      </g>
      <path d="M-30,120 L40,90 L56,130 L-14,160 Z" fill="rgba(39,227,255,.12)" stroke={N.cianClaro} strokeWidth={3} opacity={1 - k * 0.6} />
    </svg>
  );
};
const RelojPared: React.FC = () => {
  const t = useT();
  const gira = ramp(t, E24.hour, 1.2, easeOut);
  const roto = ramp(t, E24.gone + 0.6, 0.6);
  const lleva = ramp(t, E24.taken, 1.2, easeOut);
  const cuna = `M0,0 L0,-180 A180,180 0 0,1 180,0 Z`;
  return (
    <>
      <svg width={1} height={1} style={abs(640, 0)} opacity={ramp(t, E24.hour - 0.4, 0.3)}>
        <circle r={200} fill="rgba(255,255,255,.02)" stroke="#e6eeff" strokeWidth={4} style={glow("#fff", 6)} />
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * 176},${Math.sin(a) * 176} L${Math.cos(a) * 190},${Math.sin(a) * 190}`} stroke="#e6eeff" strokeWidth={4} />; })}
        {/* la porción de una hora que se rompe y una mano se lleva */}
        <g transform={`translate(${lerp(0, 520, lleva)},${lerp(0, -140, lleva)}) rotate(${lerp(0, 25, lleva)}) scale(${1 - 0.6 * lleva})`} opacity={1 - ramp(t, E24.taken + 1.0, 0.3)}>
          <path d={cuna} fill={`rgba(244,194,74,${0.25 + 0.2 * roto})`} stroke={N.oro} strokeWidth={4} strokeDasharray={roto > 0.5 ? "12 8" : undefined} style={glow(N.oro, 10)} />
          <text x={74} y={-64} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={34} fill={N.oroClaro}>1h</text>
        </g>
        <path d={`M0,0 L${150 * Math.sin(gira * 2 * Math.PI)},${-150 * Math.cos(gira * 2 * Math.PI)}`} stroke={N.cianClaro} strokeWidth={5} strokeLinecap="round" />
        <path d={`M0,0 L${100 * Math.sin(gira * Math.PI / 2)},${-100 * Math.cos(gira * Math.PI / 2)}`} stroke={N.oro} strokeWidth={8} strokeLinecap="round" />
        <circle r={10} fill="#e6eeff" />
        {/* la mano que se la lleva */}
        <g transform={`translate(${lerp(560, 600, lleva)},${lerp(-260, -160, lleva)})`} opacity={ramp(t, E24.taken - 0.4, 0.3) * (1 - ramp(t, E24.taken + 1.1, 0.3))} style={glow(N.rojo, 8)}>
          <path d="M60,-40 L-10,10 Q-30,24 -20,40 Q-4,56 16,40 L40,22 M-20,40 Q-40,60 -20,70 M0,48 Q-6,74 14,74" fill="none" stroke={N.rojoBorde} strokeWidth={4} />
        </g>
      </svg>
      <Texto x={640} y={-280} t0={E24.gone} texto="an hour has *disappeared*" size={48} t1={E24.choose} />
      <Texto x={640} y={-280} t0={E24.choose} texto="you did not *choose* it" size={48} color={N.texto2} t1={E24.taken} />
      <Texto x={640} y={-280} t0={E24.taken} texto="it was simply *taken*" size={52} color={N.rojoBorde} />
    </>
  );
};
const Plano: React.FC = () => {
  const t = useT();
  if (t < E24.trick - 0.4) return null;
  const k = ramp(t, E24.designed - 0.3, 1.4, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(1500, 20)} opacity={ramp(t, E24.trick - 0.4, 0.4)}>
        <rect x={-420} y={-280} width={840} height={560} fill="rgba(39,120,255,.07)" stroke="#3d8bff" strokeWidth={2} />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-420 + i * 60},-280 L${-420 + i * 60},280`} stroke="#3d8bff" strokeWidth={1} opacity={0.3} />)}
        {Array.from({ length: 10 }, (_, i) => <path key={"h" + i} d={`M-420,${-280 + i * 60} L420,${-280 + i * 60}`} stroke="#3d8bff" strokeWidth={1} opacity={0.3} />)}
        <g stroke={N.cianClaro} strokeWidth={3} fill="none" strokeDasharray="1600" strokeDashoffset={1600 * (1 - k)} style={glow(N.cian, 6)}>
          <path d="M-150,-200 L150,-200 L170,220 L-170,220 Z M-110,-80 L110,-80 L110,40 L-110,40 Z M-36,-80 L-36,40 M36,-80 L36,40 M170,-20 L220,-20 L220,-160" />
          <path d="M-200,-200 L-200,220 M-210,-200 L-190,-200 M-210,220 L-190,220 M-110,90 L110,90 M-110,80 L-110,100 M110,80 L110,100" stroke={N.gris} />
        </g>
        <text x={250} y={-230} fontFamily="monospace" fontSize={20} fill={N.cianClaro} opacity={k}>fig. 3 — near miss</text>
        {/* el truco: un "?" que brilla dentro */}
        <text x={0} y={-6} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={90} fill={N.oro} opacity={neonOn(t, E24.trick + 0.3) * (1 - k * 0.6)} style={glow(N.oro, 10)}>?</text>
      </svg>
      <Texto x={1500} y={-340} t0={E24.trick} texto="another *trick*" size={52} color={N.oroClaro} t1={E24.designed} />
      <Texto x={1500} y={-340} t0={E24.designed} texto="slot machines are *designed*" size={46} color={N.cianClaro} />
    </>
  );
};
// objetos de vidrio de la escena 24
const H24: React.FC = () => (
  <>
    <Png id="reloj" x={1060} y={60} w={230} t0={E24.gone} glow={N.cian} />
    <Png id="tragamonedas" x={1920} y={60} w={240} t0={E24.designed} glow={N.oro} />
  </>
);
const Escena24: React.FC = () => <EscenaMundo tomas={tomas24}><LevantaVista /><RelojPared /><Plano /><H24 /></EscenaMundo>;

// ═════════ HUB 25 · "that you often almost win. Two cherries, and the third one" ═════════
const CasiMedidor: D = ({ t, t0, on, tam }) => {
  const k = 0.9 * ramp(t, t0 + 0.2, 0.9, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-80,30 A80,80 0 0,1 80,30", a: 2.6 }]}>
      <path d={`M0,30 L${-70 * Math.cos(k * Math.PI)},${30 - 70 * Math.sin(k * Math.PI)}`} stroke={N.rojo} strokeWidth={5} strokeLinecap="round" style={glow(N.rojo)} />
      <TextoNeon x={72} y={50} texto="WIN" size={18} color={N.oroClaro} />
      <TextoNeon y={76} texto="almost" size={24} serif color={N.oroClaro} on={ramp(t, t0 + 0.3, 0.3)} />
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
const tomas25: Toma[] = [[423.7, 0, 0, 1.3], [425.6, 0, 0, 1.15], [427.4, 0, 0, 1.0], [428.0, 900, 0, 1.0], [433.8, 900, 0, 1.08]];
const RodillosMacro: React.FC = () => {
  const t = useT();
  const fr = ramp(t, E25.stops - 0.6, 1.6, easeOut);
  const y3 = lerp(-900, -78, fr);
  const casi = ramp(t, E25.near, 0.3);
  return (
    <>
      <Obj x={0} y={0} t0={E25.stops - 1} tam={200} color={N.oro} trazos={[{ d: "M-330,-180 L330,-180 L330,180 L-330,180 Z M-110,-180 L-110,180 M110,-180 L110,180", a: 3 }]} />
      <svg width={1} height={1} style={abs(0, 0)}>
        <defs><clipPath id="cl25m"><rect x={-326} y={-176} width={652} height={352} /></clipPath></defs>
        <g clipPath="url(#cl25m)">
          <Cereza x={-220} y={0} s={2.6} /><Cereza x={0} y={0} s={2.6} />
          <Cereza x={220} y={y3} s={2.6} c={casi > 0.5 && Math.floor(t * 4) % 2 ? N.rojoBorde : N.rojo} />
          {[-1, 1].map((k) => <text key={k} x={-220 + 0} y={k * 150} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={70} fill={N.oroHondo}>7</text>)}
          {[-1, 1].map((k) => <text key={"b" + k} x={0} y={k * 150} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={70} fill={N.oroHondo}>★</text>)}
          <text x={220} y={y3 + 150} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={70} fill={N.oroHondo}>7</text>
        </g>
        <path d="M-360,0 L360,0" stroke={N.rojo} strokeWidth={5} style={glow(N.rojo)} />
        {/* la distancia de nada */}
        <g opacity={casi}><path d="M300,-78 L300,0 M286,-78 L314,-78 M286,0 L314,0" stroke={N.oroClaro} strokeWidth={3} /><text x={330} y={-34} fontFamily="sans-serif" fontWeight={800} fontSize={24} fill={N.oroClaro}>this much</text></g>
      </svg>
      <Texto x={0} y={-270} t0={E25.stops} texto="just *above* the line" size={50} t1={E25.near} />
      <Texto x={0} y={-270} t0={E25.near} texto="the *near miss*" size={66} color={N.rojoBorde} />
    </>
  );
};
const MedidorCerebro: React.FC = () => {
  const t = useT();
  if (t < E25.studies - 0.4) return null;
  const casi = 0.86 * ramp(t, E25.excite, 1.2, easeOut);
  const real = ramp(t, E25.real, 0.6, easeOut);
  return (
    <>
      <Obj x={760} y={-30} t0={E25.studies - 0.4} tam={360} color={N.cianClaro} trazos={[
        { d: "M-90,20 Q-110,-60 -40,-80 Q0,-110 50,-84 Q110,-70 100,0 Q110,50 50,60 Q30,90 -10,70 Q-70,80 -90,20 Z", a: 2.6, f: "rgba(203,251,255,.04)" },
        { d: "M-60,-20 Q-30,-50 0,-30 Q30,-60 60,-24", c: N.gris, a: 1.4 },
      ]}>
        <circle cx={10} cy={6} r={16} fill={N.oro} opacity={casi} style={glow(N.oro, 14)} />
      </Obj>
      <svg width={1} height={1} style={abs(1150, 220)} opacity={ramp(t, E25.excite - 0.2, 0.3)}>
        {[["near miss", casi, N.rojo], ["real win", real * 1.0, N.oro]].map(([lb, v, c], i) => (
          <g key={i} transform={`translate(${-80 + i * 160},0)`}>
            <rect x={-40} y={-400} width={80} height={400} fill="none" stroke={N.gris} strokeWidth={2} />
            <rect x={-36} y={-396 * (v as number)} width={72} height={396 * (v as number)} fill={c as string} opacity={0.7} style={glow(c as string, 10)} />
            <text y={40} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={22} fill="#e6eeff">{lb as string}</text>
          </g>
        ))}
      </svg>
      <Texto x={900} y={-300} t0={E25.studies} texto="studies have *shown*" size={44} t1={E25.excite} />
      <Texto x={900} y={-300} t0={E25.excite} texto="the brain's *reward* lights up" size={44} color={N.oroClaro} t1={E25.real} />
      <Texto x={900} y={-300} t0={E25.real} texto="almost like a *real win*" size={50} color={N.oro} />
    </>
  );
};
// objetos de vidrio de la escena 25
const H25: React.FC = () => (
  <>
    <Png id="cereza" x={440} y={60} w={200} t0={E25.near} glow={N.rojo} />
    <Png id="medidor" x={1320} y={60} w={240} t0={E25.real} glow={N.rojo} />
  </>
);
const Escena25: React.FC = () => <EscenaMundo tomas={tomas25}><RodillosMacro /><MedidorCerebro /><H25 /></EscenaMundo>;

// ═════════ HUB 26 · "and they make people want to play again. The endless reel is full of near misses," ═════════
const Replay: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: "M50,-40 A64,64 0 1,0 64,10", a: 3 }, { d: "M50,-40 L54,-70 M50,-40 L22,-46", a: 3 }]}>
    <g transform={`rotate(${-t * 90})`}><path d="M-10,-14 L16,0 L-10,14 Z" fill={N.verde} /></g>
    <TextoNeon y={92} texto="again" size={22} serif color={N.verde} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);
const FeedCasi: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tela(0, 0, 120, 190, 14), a: 2.6 }, { d: tela(0, -40, 96, 60, 8) + " " + tela(0, 34, 96, 60, 8), c: N.gris, a: 1.6 }]}>
    <TextoNeon y={-40} texto="almost" size={18} serif color={N.oroClaro} on={ramp(t, t0 + 0.3, 0.3)} />
    <TextoNeon y={34} texto="almost" size={18} serif color={N.oroClaro} on={ramp(t, t0 + 0.5, 0.3)} />
  </Glifo>
);
const CerezaCasi: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-80,20 L80,20", a: 2 }]}><Cereza x={0} y={-30 + 4 * Math.sin(t * 3)} s={1.4} /></Glifo>
);

// ═════════ ESCENA 26 · casi genial · casi lo que querías · una más · la linterna busca "el que es" · nunca llega · el diseño ═════════
const E26 = { video: T("a video that", 439.5), great: T("almost great", 440), post: T("a post that", 442), wanted: T("what you wanted", 443), scroll: T("scroll one more", 444), looking: T("looking for the", 447), satisfy: T("finally satisfy", 448), never: T("It never comes", 450.5), design: T("That is the design", 451) };
const tomas26: Toma[] = [[439.7, -200, 0, 1.12], [442.0, -200, 0, 1.06], [442.6, 200, 0, 1.1], [445.0, 0, 0, 0.94], [447.0, 1100, 0, 0.9], [451.9, 1100, 0, 0.96], [453.5, 1100, 0, 1.04]];
const Estrellas: React.FC<{ n: number; x: number; y: number; t0: number }> = ({ n, x, y, t0 }) => {
  const t = useT();
  return <svg width={1} height={1} style={abs(x, y)}>{[0, 1, 2, 3, 4].map((i) => { const llena = i < n - 0.5; const media = !llena && i < n; const on = ramp(t, t0 + i * 0.12, 0.2); const p = Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * Math.PI * 2 - Math.PI / 2, r = k % 2 ? 9 : 22; return `${k ? "L" : "M"}${i * 54 - 108 + Math.cos(a) * r},${Math.sin(a) * r}`; }).join(" ") + "Z"; return <path key={i} d={p} fill={llena ? N.oro : media ? "rgba(244,194,74,.35)" : "none"} stroke={N.oro} strokeWidth={2.5} opacity={on} />; })}</svg>;
};
const Casis: React.FC = () => {
  const t = useT();
  const sube = ramp(t, E26.scroll, 0.8, easeOut);
  return (
    <div style={{ position: "absolute", left: 0, top: -700 * sube, opacity: 1 - ramp(t, E26.looking, 0.5) }}>
      {/* video casi genial */}
      <Obj x={-200} y={0} t0={E26.video - 0.4} tam={200} color={N.cianClaro} trazos={[{ d: tela(0, 0, 340, 220, 16), a: 2.8 }, { d: "M-20,-30 L28,0 L-20,30 Z", a: 2.6 }]} />
      <Estrellas n={4.5} x={-200} y={160} t0={E26.great} />
      <Texto x={-200} y={-170} t0={E26.great} texto="*almost* great" size={40} color={N.oroClaro} />
      {/* post casi lo que querías: una pieza que falta */}
      <Obj x={220} y={40} t0={E26.post - 0.4} tam={200} color={N.violeta} trazos={[
        { d: tela(0, 0, 300, 220, 16), a: 2.8 },
        { d: "M-100,-60 L20,-60 L20,-30 Q40,-40 40,-16 Q40,8 20,0 L20,60 L-100,60 Z", c: N.violeta, a: 2.2, f: "rgba(183,123,255,.12)" },
        { d: "M40,-60 L100,-60 L100,60 L40,60", c: N.gris, a: 1.6 },
      ]} />
      <svg width={1} height={1} style={abs(220 + 70, 40)} opacity={ramp(t, E26.wanted, 0.3)}>
        <path d={`M${-10 + 40 * Math.sin(t * 2)},${-60 - 60} l60,0 l0,40 q10,10 0,20 l0,40 l-60,0 z`} fill="none" stroke={N.oroClaro} strokeWidth={2.5} strokeDasharray="8 6" />
      </svg>
      <Texto x={220} y={-130} t0={E26.wanted} texto="*almost* what you wanted" size={38} color={N.violeta} />
    </div>
  );
};
const Linterna: React.FC = () => {
  const t = useT();
  if (t < E26.scroll) return null;
  const barrido = Math.sin((t - E26.looking) * 1.4) * 0.5;
  const nunca = ramp(t, E26.never, 0.8);
  const off = (t * 60) % 180;
  return (
    <>
      {/* campo de tarjetas que pasan */}
      <svg width={1} height={1} style={abs(1100, 0)} opacity={ramp(t, E26.scroll, 0.4)}>
        {Array.from({ length: 30 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6); const x = -600 + c * 220, y = -340 + r * 180 - off; return <rect key={i} x={x - 80} y={y - 55} width={160} height={110} rx={10} fill="none" stroke={N.gris} strokeWidth={2} />; })}
        {/* "el que es": tarjeta dorada al fondo que se aleja y se apaga */}
        <g transform={`translate(${380},${-200}) scale(${1 - 0.5 * nunca})`} opacity={ramp(t, E26.satisfy, 0.4) * (1 - nunca)}>
          <rect x={-90} y={-60} width={180} height={120} rx={12} fill="rgba(244,194,74,.18)" stroke={N.oro} strokeWidth={4} style={glow(N.oro, 14)} />
          <text y={10} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={30} fill={N.oroClaro}>the one</text>
        </g>
        {/* haz de la linterna */}
        <g transform={`translate(-560,320) rotate(${-38 + barrido * 40})`} opacity={ramp(t, E26.looking, 0.3)}>
          <path d="M0,0 L1200,-200 L1200,200 Z" fill="rgba(255,240,179,.12)" />
          <rect x={-70} y={-24} width={90} height={48} rx={10} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={4} style={glow(N.oro)} />
        </g>
      </svg>
      <Texto x={1100} y={-330} t0={E26.looking} texto="looking for *the one*" size={50} color={N.oroClaro} t1={E26.never} />
      <Texto x={1100} y={-330} t0={E26.never} texto="it never *comes*" size={56} color={N.texto2} t1={E26.design} />
      <DisenoSello />
    </>
  );
};
const DisenoSello: React.FC = () => {
  const t = useT();
  if (t < E26.design) return null;
  const s = 1.8 - 0.8 * pop(t, E26.design + 0.1, 9);
  return (
    <div style={{ position: "absolute", left: 1100, top: 30, transform: `translate(-50%,-50%) rotate(-10deg) scale(${s})`, opacity: ramp(t, E26.design + 0.1, 0.12), border: `6px solid #3d8bff`, borderRadius: 10, padding: "8px 30px", fontFamily: "sans-serif", fontWeight: 900, fontSize: 72, letterSpacing: 6, color: "#cfe0ff", boxShadow: "0 0 30px #3d8bff", textShadow: "0 0 16px #3d8bff", whiteSpace: "nowrap" }}>BY DESIGN</div>
  );
};
// objetos de vidrio de la escena 26
const H26: React.FC = () => (
  <>
    <Png id="lupa" x={1520} y={60} w={220} t0={E26.looking} glow={N.cian} />
  </>
);
const Escena26: React.FC = () => <EscenaMundo tomas={tomas26}><Casis /><Linterna /><H26 /></EscenaMundo>;

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
const tomas27: Toma[] = [[457.9, 0, 0, 1.1], [459.3, 0, 0, 1.0], [459.9, 760, 0, 1.0], [463.0, 900, 0, 1.0], [463.5, 1700, 0, 1.1], [465.8, 1700, 0, 1.12], [466.4, 2600, 0, 1.06], [470.2, 2600, 0, 1.12]];
const LibroSinTapa: React.FC = () => {
  const t = useT();
  const pasa = (t - E27.nolast) * 3;
  return (
    <>
      <svg width={1} height={1} style={abs(0, 30)} opacity={ramp(t, E27.nolast - 0.4, 0.3) * (1 - ramp(t, E27.feeling + 0.5, 0.4))}>
        <path d="M0,-130 L-220,-120 L-220,130 L0,140 Z" fill="rgba(255,255,255,.03)" stroke="#e6eeff" strokeWidth={3} style={glow("#fff", 6)} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0,-130 L${200 - i * 6},${-120 - i * 3} L${200 - i * 6},${130 - i * 3} L0,140`} fill="none" stroke="#e6eeff" strokeWidth={1.5} opacity={0.5} />)}
        {Array.from({ length: 3 }, (_, i) => { const k = (pasa + i / 3) % 1; return <path key={"p" + i} d={`M0,-130 L${220 * Math.cos(k * Math.PI)},-120 L${220 * Math.cos(k * Math.PI)},130 L0,140 Z`} fill="rgba(5,5,6,.85)" stroke="#e6eeff" strokeWidth={2} />; })}
        <text x={230} y={-150} fontFamily="sans-serif" fontWeight={800} fontSize={24} fill={N.rojoBorde}>no back cover</text>
      </svg>
      <Texto x={0} y={-260} t0={E27.nolast} texto="no *last page*" size={56} t1={E27.feeling + 0.6} />
    </>
  );
};
const Zanahoria: React.FC = () => {
  const t = useT();
  if (t < E27.feeling - 0.3) return null;
  const camina = (t - E27.feeling) * 60;
  const bam = 14 * Math.sin(t * 5);
  return (
    <>
      <svg width={1} height={1} style={abs(760 + Math.min(camina, 160), 40)} opacity={ramp(t, E27.feeling - 0.3, 0.3)}>
        {/* figura que camina con la vara en la espalda */}
        <g fill="none" stroke="#e6eeff" strokeWidth={4} style={glow("#fff", 6)}>
          <circle cx={-160} cy={-130} r={36} />
          <path d={`M-160,-94 L-160,40 L${-190 + 20 * Math.sin(t * 6)},150 M-160,40 L${-130 - 20 * Math.sin(t * 6)},150 M-160,-60 L-110,-20`} />
          <path d="M-170,-90 L-180,-200 Q40,-300 220,-170" stroke={N.oroHondo} strokeWidth={5} />
          <path d={`M220,-170 L220,${-60 + bam}`} stroke={N.gris} strokeWidth={2} />
        </g>
        <g transform={`translate(220,${-40 + bam}) rotate(${10 * Math.sin(t * 3)})`} style={glow(N.oro, 10)}>
          <path d="M-20,0 L20,0 L0,90 Z" fill="rgba(255,140,40,.4)" stroke="#ff9a3c" strokeWidth={4} />
          <path d="M-10,0 L-20,-24 M0,0 L0,-30 M10,0 L20,-24" stroke={N.verde} strokeWidth={4} />
        </g>
        <text x={220} y={110 + bam} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={34} fill="#ffcf9a" opacity={ramp(t, E27.next, 0.3)}>the next one</text>
      </svg>
      <Texto x={900} y={-300} t0={E27.better} texto="will be *better*…" size={52} color="#ffcf9a" />
    </>
  );
};
const MarcoCuatro: React.FC = () => {
  const t = useT();
  if (t < E27.fourth - 0.4) return null;
  const enc = ramp(t, E27.fourth + 0.3, 0.6, easeOut);
  const punto = neonOn(t, E27.red);
  return (
    <>
      <Obj x={1700} y={20} t0={E27.fourth - 0.4} tam={200} color="#e6eeff" trazos={[{ d: "M-380,-130 L380,-130 L380,130 L-380,130 Z", a: 2.4 }, ...[0, 1, 2, 3].map((i): Trazo => ({ d: circ(-270 + i * 180, 0, 82), c: i < 3 ? N.oro : N.rojo, a: 1.6, dt: 0.06 * i }))]} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1700 - 270 + i * 180, top: 20, transform: `rotate(${(i % 2 ? -1 : 1) * t * 40}deg)` }}><EngranajeSvg r={72} color={N.oro} n={i + 1} /></div>)}
      <div style={{ position: "absolute", left: 1700 + 270, top: 20 - 300 * (1 - enc), opacity: enc, transform: `rotate(${-t * 40}deg)` }}><EngranajeSvg r={72} color={N.rojo} /></div>
      <svg width={1} height={1} style={abs(1970, 20 - 300 * (1 - enc))}><circle r={22 + 4 * Math.sin(t * 6)} fill={N.rojo} opacity={punto} style={glow(N.rojo, 16)} /></svg>
      <Texto x={1700} y={-240} t0={E27.fourth} texto="the *fourth gear*" size={58} color={N.oroClaro} />
      <Texto x={1700} y={240} t0={E27.red} texto="the *red dot*" size={54} color={N.rojoBorde} />
    </>
  );
};
const Fogata: React.FC = () => {
  const t = useT();
  if (t < E27.tribal - 0.4) return null;
  const n = 7;
  return (
    <>
      <div style={{ position: "absolute", left: 2600 - 400, top: 80 - 400, width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,150,40,${0.18 + 0.04 * Math.sin(t * 9)}), transparent 60%)`, opacity: ramp(t, E27.tribal - 0.4, 0.5) }} />
      <svg width={1} height={1} style={abs(2600, 80)} opacity={ramp(t, E27.tribal - 0.4, 0.4)}>
        {/* fuego */}
        {[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},40 Q${-50 + i * 30 + 10 * Math.sin(t * 8 + i)},${-20 - 30 * i % 40} ${-10 + i * 20},${-80 + 20 * Math.sin(t * 6 + i)} Q${10 + i * 10},-20 ${30 - i * 10},40 Z`} fill="rgba(255,140,40,.35)" stroke={i === 1 ? N.oroClaro : "#ff9a3c"} strokeWidth={3} style={glow("#ff9a3c", 12)} />)}
        <path d="M-60,50 L60,30 M-60,30 L60,50" stroke={N.oroHondo} strokeWidth={6} />
        {/* la tribu en ronda */}
        {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + Math.PI / 2 + Math.PI / n, x = Math.cos(a) * 300, y = Math.sin(a) * 110 + 20, s = 0.8 + 0.25 * Math.sin(a); return <g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity={ramp(t, E27.tribal + i * 0.08, 0.3)} style={glow("#ffcf9a", 6)}><circle cx={0} cy={-90} r={24} fill="rgba(5,5,6,.9)" stroke="#ffcf9a" strokeWidth={3} /><path d="M-40,20 Q-40,-60 0,-62 Q40,-60 40,20 Z" fill="rgba(5,5,6,.9)" stroke="#ffcf9a" strokeWidth={3} /></g>; })}
      </svg>
      <Texto x={2600} y={-280} t0={E27.tribal} texto="*tribal* animals" size={60} color="#ffcf9a" />
    </>
  );
};
// objetos de vidrio de la escena 27
const H27: React.FC = () => (
  <>
    <Png id="fogata" x={3020} y={60} w={260} t0={E27.tribal} glow={N.oro} />
  </>
);
const Escena27: React.FC = () => <EscenaMundo tomas={tomas27}><LibroSinTapa /><Zanahoria /><MarcoCuatro /><Fogata /><H27 /></EscenaMundo>;

export const SEGS_M07: Seg[] = [
  {
    hub: { portal: "reloj", orbs: [
      { id: "cinta", t: T("the reel never", 402), ang: 198, anillo: 1, tam: 170, D: CintaPasa },
      { id: "guardia", t: T("the guard never", 404.5), ang: 128, anillo: 2, tam: 190, D: GuardiaMordaza },
      { id: "reloj", t: T("moment to speak", 405.5), ang: -14, anillo: 0, tam: 230, D: RelojHora, png: "reloj" },
    ] },
    Escena: Escena24,
    sonidos: (s) => { s.add("aparece", E24.look, 0.5); s.add("vuelo", 408.6, 0.5); s.add("maquinaGira", E24.hour, 0.5); s.add("grieta", E24.gone + 0.6, 0.6); s.add("tiron", E24.taken, 0.6); s.add("vacio", E24.taken + 0.6, 0.5); s.add("vuelo", 414.8, 0.5); s.add("neonOn", E24.trick + 0.3); s.add("traza", E24.designed - 0.3); },
  },
  {
    hub: { portal: "ventana", orbs: [
      { id: "casi", t: T("almost win", 420), ang: 198, anillo: 1, tam: 170, D: CasiMedidor },
      { id: "dos", t: T("Two cherries", 421.5), ang: 128, anillo: 2, tam: 170, D: DosCerezas, png: "cereza" },
      { id: "ventana", t: T("the third one", 423) - 0.6, ang: -14, anillo: 0, tam: 250, D: VentanaCasi },
    ] },
    Escena: Escena25,
    sonidos: (s) => { s.add("rodillos", E25.stops - 1.0, 0.6); s.add("rodilloFrena", E25.stops + 0.6); s.add("vacio", E25.near - 0.1, 0.6); s.add("aviso", E25.near, 0.4); s.add("vuelo", 427.9, 0.5); s.add("sinapsis", E25.excite); s.add("traza", E25.excite + 0.1, 0.5); s.add("premio", E25.real, 0.4); },
  },
  {
    hub: { portal: "feed", orbs: [
      { id: "replay", t: T("play again", 435), ang: 198, anillo: 1, tam: 160, D: Replay },
      { id: "cer", t: T("The endless", 436.5), ang: 128, anillo: 2, tam: 150, D: CerezaCasi },
      { id: "feed", t: T("near misses", 438.5), ang: -14, anillo: 0, tam: 240, D: FeedCasi },
    ] },
    Escena: Escena26,
    sonidos: (s) => { s.add("aparece", E26.video); s.add("tic", E26.great, 0.5); s.add("vuelo", 442.6, 0.5); s.add("aparece", E26.post); s.add("vacio", E26.wanted, 0.5); s.add("tiron", E26.scroll, 0.6); s.add("vuelo", 447.0, 0.5); s.add("luz", E26.looking, 0.6); s.add("neonOn", E26.satisfy, 0.6); s.add("vacio", E26.never + 0.3, 0.6); s.add("golpe", E26.design + 0.15, 0.7); },
  },
  {
    hub: { portal: "marco3", orbs: [
      { id: "marco3", t: T("third gear", 453.5), ang: -14, anillo: 0, tam: 250, D: MarcoTres },
      { id: "bucle", t: T("the endless reel", 454), ang: 198, anillo: 1, tam: 170, D: BucleCinta },
      { id: "puerta", t: T("No door", 456.5), ang: 128, anillo: 2, tam: 150, D: SinPuerta },
    ] },
    Escena: Escena27,
    sonidos: (s) => { s.add("engranaje", 454.0 + 0.4); s.add("tiron", E27.nolast, 0.5); s.add("vuelo", 459.9, 0.5); s.add("aparece", E27.next, 0.6); s.add("vuelo", 463.5, 0.5); s.add("engranaje", E27.fourth + 0.3); s.add("aviso", E27.red); s.add("vuelo", 466.4, 0.5); s.add("luz", E27.tribal, 0.6); },
  },
];
