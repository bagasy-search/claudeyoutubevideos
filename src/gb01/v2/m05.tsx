// gb01 v2 · MINUTO 5 (ventanas 16-19, 268-336 s): el inventor arrepentido · la palanca es lo FÁCIL (casino lejos vs
// celular en la mano) · el pergamino de los monjes: gatillo → acción → premio · el sendero que se vuelve autopista ·
// el aburrimiento como gatillo · la mano le gana a la mente · el engranaje 2 encaja.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, rnd, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { Contador, EscenaMundo, Obj, Texto, circ, Png } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const tachar = (dt: number): Trazo => ({ d: "M-74,-74 L74,74", c: N.rojo, a: 3.4, dt });

// ═════════ HUB 16 · "…that he wished it had not become so addictive. But the lever is not only" ═════════
const CitaCard: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-90,-56 L90,-56 L90,46 L-30,46 L-56,70 L-56,46 L-90,46 Z", a: 2.4 },
    { d: "M-60,-24 L60,-24 M-60,-4 L40,-4 M-60,16 L20,16", c: N.gris, a: 1.6 },
  ]}>
    <TextoNeon x={-70} y={-62} texto="“" size={60} serif color={N.oro} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);
const Alerta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M0,-70 L76,60 L-76,60 Z", a: 2.8, f: "rgba(255,42,72,.08)" }]}>
    <TextoNeon y={18} texto="!" size={70} color={N.rojoBorde} on={Math.floor(t * 4) % 2 ? 1 : 0.4} />
    <TextoNeon y={92} texto="addictive" size={22} serif color={N.rojoBorde} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);
const PalancaGrande: D = ({ t, t0, on, tam }) => {
  const pl = 0.5 + 0.5 * Math.sin(t * 2.4);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-40,90 L40,90 L40,50 L-40,50 Z", a: 2.6 }]}>
      <path d={`M0,50 L${lerp(-20, 30, pl)},${lerp(-60, -40, pl)}`} stroke={N.oro} strokeWidth={8} strokeLinecap="round" style={glow(N.oro)} />
      <circle cx={lerp(-20, 30, pl)} cy={lerp(-78, -58, pl)} r={22} fill={N.rojo} style={glow(N.rojo)} />
    </Glifo>
  );
};

// ═════════ ESCENA 16 · la palanca es lo fácil: el casino lejos (ruta, auto, plata) vs el celular en la mano ═════════
const E16 = { easy: T("how easy", 275), casino: T("real slot machine", 276), drive: T("drive there", 280), money: T("need money", 281), pocket: T("in your pocket", 282), hand: T("in your hand", 284) };
const tomas16: Toma[] = [[273.3, 0, 0, 1.1], [276.6, 0, 0, 1.0], [277.5, 1450, -20, 1.0], [279.6, 800, 0, 0.6], [283.5, 800, 0, 0.6], [284.4, 160, 0, 0.98], [285.8, 160, 0, 1.06]];
const Facilidad: React.FC = () => {
  const t = useT();
  const k = ramp(t, E16.easy, 1.0, easeOut);
  return (
    <svg width={1} height={1} style={abs(0, -250)} opacity={ramp(t, E16.easy - 0.3, 0.3) * (1 - ramp(t, E16.casino, 0.4))}>
      <text x={-230} y={-34} fontFamily="sans-serif" fontWeight={800} fontSize={20} fill={N.texto2}>effort</text>
      <rect x={-230} y={-14} width={460} height={28} rx={14} fill="none" stroke={N.gris} strokeWidth={3} />
      <rect x={-226} y={-10} width={452 * (1 - k) + 6} height={20} rx={10} fill={k > 0.9 ? N.verde : N.oro} opacity={0.8} style={glow(k > 0.9 ? N.verde : N.oro)} />
    </svg>
  );
};
const Casino: React.FC<{ x: number }> = ({ x }) => {
  const t = useT();
  const parp = (i: number) => (Math.floor(t * 6 + i) % 3 === 0 ? 1 : 0.35);
  return (
    <>
      <Obj x={x} y={0} t0={E16.casino - 0.4} tam={200} color={N.violeta} trazos={[
        { d: "M-220,200 L-220,-60 L220,-60 L220,200 Z", a: 2.6, f: "rgba(183,123,255,.05)" },
        { d: "M-240,-60 L0,-190 L240,-60", a: 2.6 },
        { d: "M-40,200 L-40,90 L40,90 L40,200", c: N.oro, a: 2.2 },
        { d: "M-170,0 L-110,0 L-110,50 L-170,50 Z M110,0 L170,0 L170,50 L110,50 Z", c: N.cianClaro, a: 1.8 },
      ]} />
      <svg width={1} height={1} style={abs(x, -110)} opacity={neonOn(t, E16.casino + 0.2)}>
        {"CASINO".split("").map((c, i) => <text key={i} x={-125 + i * 50} y={0} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={44} fill={N.oroClaro} opacity={parp(i)} style={glow(N.oro)}>{c}</text>)}
      </svg>
    </>
  );
};
const RutaYAuto: React.FC<{ xCas: number }> = ({ xCas }) => {
  const t = useT();
  if (t < E16.casino) return null;
  const rd = ramp(t, E16.casino + 0.3, 1.0, easeOut);
  const x0 = 240, x1 = xCas - 260;
  const car = ramp(t, E16.drive - 0.3, 1.6, easeOut);
  const cx = lerp(x0, x1, car);
  const millas = Math.round(lerp(25, 0, ramp(t, E16.hand - 0.2, 0.9, easeOut)));
  return (
    <>
      <svg width={1} height={1} style={abs(0, 200)}>
        <path d={`M${x0},0 L${lerp(x0, x1, rd)},0`} stroke="#e6eeff" strokeWidth={4} style={glow("#fff", 5)} />
        <path d={`M${x0},0 L${lerp(x0, x1, rd)},0`} stroke={N.oro} strokeWidth={3} strokeDasharray="30 30" transform="translate(0,-28)" opacity={0.6} />
        {/* auto */}
        <g transform={`translate(${cx},-40)`} opacity={ramp(t, E16.drive - 0.4, 0.3)} style={glow(N.cian)}>
          <path d="M-60,20 L-60,0 L-36,-26 L30,-26 L52,0 L64,4 L64,20 Z" fill="rgba(39,227,255,.1)" stroke={N.cian} strokeWidth={4} />
          <circle cx={-34} cy={22} r={12} fill="#050506" stroke={N.cianClaro} strokeWidth={4} /><circle cx={38} cy={22} r={12} fill="#050506" stroke={N.cianClaro} strokeWidth={4} />
        </g>
        <text x={(x0 + x1) / 2} y={70} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={54} fill={millas ? N.texto2 : N.verde} style={glow(millas ? "#fff" : N.verde, 6)}>{millas} miles</text>
      </svg>
    </>
  );
};
const Billetera: React.FC<{ x: number }> = ({ x }) => {
  const t = useT();
  const sale = ramp(t, E16.pocket, 0.6, easeOut);
  return (
    <Obj x={x + 330} y={-60} t0={E16.money - 0.2} tam={200} color={N.verde} trazos={[
      { d: "M-80,-50 L80,-50 L80,50 L-80,50 Z", a: 2.6 }, { d: "M30,-14 L80,-14 L80,14 L30,14 Z", a: 2 },
    ]}>
      {[0, 1].map((i) => <g key={i} transform={`translate(${-10 + i * 16},${-50 - 60 * sale - i * 14})`} opacity={sale}><rect x={-50} y={-22} width={100} height={44} rx={4} fill="rgba(141,255,160,.12)" stroke={N.verde} strokeWidth={3} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={26} fill={N.verde}>$</text></g>)}
    </Obj>
  );
};
const ManoCelular: React.FC = () => {
  const t = useT();
  const brilla = neonOn(t, E16.hand);
  return (
    <>
      <Obj x={0} y={60} t0={E16.easy - 0.6} tam={200} color={N.cianClaro} trazos={[
        { d: "M-70,-170 Q-70,-186 -54,-186 L54,-186 Q70,-186 70,-170 L70,120 Q70,136 54,136 L-54,136 Q-70,136 -70,120 Z", a: 2.8 },
        { d: "M-110,60 Q-120,-20 -76,-40 M-76,10 L-120,0 M-76,60 L-124,50 M70,-30 Q120,-40 116,20 Q112,120 40,200 L-60,200 Q-120,140 -110,60", c: N.oroClaro, a: 2.4 },
      ]}>
        <rect x={-62} y={-178} width={124} height={306} rx={12} fill={N.cian} opacity={0.12 * brilla} />
      </Obj>
      <Texto x={0} y={-260} t0={E16.easy} texto="how *easy* it is" size={56} color={N.verde} t1={E16.casino + 0.4} />
      <Texto x={0} y={-290} t0={E16.hand} texto="your phone is *in your hand*" size={50} color={N.cianClaro} />
    </>
  );
};
// objetos de vidrio de la escena 16
const H16: React.FC = () => (
  <>
    <Png id="celu" x={430} y={60} w={200} t0={E16.hand} glow={N.cian} />
    <Png id="casino" x={1870} y={60} w={300} t0={E16.casino} glow={N.oro} />
  </>
);
const Escena16: React.FC = () => {
  const t = useT();
  const xCas = lerp(1500, 520, ramp(t, E16.hand - 0.2, 0.9, easeOut));
  return (
    <EscenaMundo tomas={tomas16}><H16 />
      <Facilidad />
      <ManoCelular />
      <RutaYAuto xCas={xCas} />
      <Casino x={xCas} />
      <Billetera x={xCas} />
      <Texto x={1450} y={-300} t0={E16.casino} texto="a real slot machine is *far*" size={44} t1={E16.hand} />
    </EscenaMundo>
  );
};

// ═════════ HUB 17 · "No door, no drive, no cost. The lever is always one second away." ═════════
const Puerta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[{ d: "M-40,70 L-40,-70 L40,-70 L40,70", a: 2.6 }, { d: circ(24, 0, 5), a: 2.4 }, tachar(0.3)]} />
);
const Auto: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[
    { d: "M-70,20 L-70,0 L-42,-30 L36,-30 L60,0 L74,4 L74,20 Z", a: 2.6 }, { d: circ(-40, 24, 13) + " " + circ(44, 24, 13), a: 2.4 }, tachar(0.3),
  ]} />
);
const Dolar: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: circ(0, 0, 56), a: 2.6 }, tachar(0.3)]}>
    <TextoNeon y={4} texto="$" size={64} color={N.verde} />
  </Glifo>
);
const Crono1s: D = ({ t, t0, on, tam }) => {
  const a = ((t - t0) % 1) * 360;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: circ(0, 10, 70), a: 2.8 }, { d: "M-14,-66 L14,-66 M0,-66 L0,-58", a: 2.6 }]}>
      <path d={`M0,10 L${60 * Math.sin((a * Math.PI) / 180)},${10 - 60 * Math.cos((a * Math.PI) / 180)}`} stroke={N.oro} strokeWidth={5} strokeLinecap="round" style={glow(N.oro)} />
      <TextoNeon y={112} texto="1 second" size={24} serif color={N.oroClaro} on={ramp(t, T("one second away", 289.5), 0.3)} />
    </Glifo>
  );
};

// ═════════ ESCENA 17 · el pergamino de los monjes: un hábito vive en tres lugares ═════════
const E17 = { monks: T("old monks", 292), long: T("long before", 294), habit: T("habit lives in", 296), three: T("three places", 297), trigger: T("The trigger", 298.5), action: T("the action", 299.5), reward: T("and the reward", 300.5) };
const tomas17: Toma[] = [[291.5, 0, -40, 1.1], [296.4, 0, -20, 0.95], [298.6, 0, 40, 1.12], [302.0, 0, 40, 1.2]];
const V17 = [[0, -150], [-180, 170], [180, 170]] as const;
const Pergamino: React.FC = () => {
  const t = useT();
  const ab = ramp(t, E17.monks - 0.2, 1.4, easeOut);
  const H = 520 * ab;
  return (
    <>
      <svg width={1} height={1} style={abs(0, 20)} opacity={ramp(t, E17.monks - 0.4, 0.3)}>
        <rect x={-300} y={-H / 2} width={600} height={H} fill="rgba(244,194,74,.05)" stroke={N.oroHondo} strokeWidth={2} />
        {[-1, 1].map((s) => <g key={s} transform={`translate(0,${(s * H) / 2})`} style={glow(N.oro)}><rect x={-330} y={-16} width={660} height={32} rx={16} fill="#050506" stroke={N.oro} strokeWidth={4} /><circle cx={-340} cy={0} r={12} fill={N.oro} /><circle cx={340} cy={0} r={12} fill={N.oro} /></g>)}
        {/* caligrafía falsa: trazos de pincel que se escriben solos */}
        {ab > 0.5 && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-240 + i * 30},${-200} q8,30 -4,60 q10,20 2,44`} fill="none" stroke={N.oroClaro} strokeWidth={3} opacity={0.5 * ramp(t, E17.monks + 0.6 + i * 0.12, 0.3)} />)}
      </svg>
      <Texto x={0} y={-330} t0={E17.monks} texto="what the old *monks* knew" size={48} color={N.oroClaro} t1={E17.habit} />
      <Texto x={0} y={-330} t0={E17.long} texto="long before any *scientist*" size={40} color={N.texto2} t1={E17.habit} />
    </>
  );
};
const Triangulo: React.FC = () => {
  const t = useT();
  if (t < E17.habit - 0.2) return null;
  const tt = [E17.trigger, E17.action, E17.reward];
  const lados = [0, 1, 2].map((i) => ramp(t, tt[i] + 0.25, 0.6, easeOut));
  const iconos = [
    <g key="b"><path d="M-26,14 Q-26,-30 0,-30 Q26,-30 26,14 L34,22 L-34,22 Z" fill="none" stroke={N.cianClaro} strokeWidth={4} /><circle cx={0} cy={30} r={6} fill={N.cianClaro} />{[1, 2].map((k) => <path key={k} d={`M${36 + k * 10},-20 q10,20 0,40 M${-36 - k * 10},-20 q-10,20 0,40`} stroke={N.cianClaro} strokeWidth={2.5} fill="none" opacity={(Math.sin(t * 8 + k) + 1) / 2} />)}</g>,
    <g key="m"><path d="M-20,30 L-20,-10 Q-20,-30 -6,-30 L-6,-4 M-6,-30 Q0,-40 8,-30 L8,-4 M8,-26 Q16,-34 22,-24 L22,10 Q22,40 0,40 Q-20,40 -20,30 Z" fill="none" stroke={N.oroClaro} strokeWidth={4} /></g>,
    <g key="s">{Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2 + t; return <path key={k} d={`M${Math.cos(a) * 12},${Math.sin(a) * 12} L${Math.cos(a) * 34},${Math.sin(a) * 34}`} stroke={N.oro} strokeWidth={4} strokeLinecap="round" />; })}<circle r={9} fill={N.oro} /></g>,
  ];
  const nombres = ["trigger", "action", "reward"];
  const cols = [N.cianClaro, N.oroClaro, N.oro];
  return (
    <svg width={1} height={1} style={abs(0, 20)} opacity={ramp(t, E17.habit - 0.2, 0.3)}>
      <text x={0} y={30} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={40} fill={N.oroClaro} opacity={ramp(t, E17.three, 0.4) * (1 - ramp(t, E17.trigger + 0.2, 0.4))}>three places</text>
      {[0, 1, 2].map((i) => {
        const a = V17[i], b = V17[(i + 1) % 3], k = lados[i];
        return <path key={i} d={`M${a[0]},${a[1]} L${lerp(a[0], b[0], k)},${lerp(a[1], b[1], k)}`} stroke={N.oro} strokeWidth={4} strokeDasharray="14 10" opacity={0.8} style={glow(N.oro, 6)} />;
      })}
      {[0, 1, 2].map((i) => {
        const on = ramp(t, tt[i] - 0.1, 0.25), s = 0.6 + 0.4 * pop(t, tt[i] - 0.1, 10);
        return (
          <g key={i} transform={`translate(${V17[i][0]},${V17[i][1]}) scale(${s})`} opacity={on} style={glow(cols[i])}>
            <circle r={70} fill="rgba(5,5,6,.9)" stroke={cols[i]} strokeWidth={4} />
            {iconos[i]}
            <text y={112} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={34} fill={cols[i]}>{nombres[i]}</text>
          </g>
        );
      })}
    </svg>
  );
};
// objetos de vidrio de la escena 17
const H17: React.FC = () => (
  <>
    <Png id="pergamino" x={-470} y={40} w={260} t0={E17.monks} glow={N.oro} />
  </>
);
const Escena17: React.FC = () => (
  <EscenaMundo tomas={tomas17}><H17 />
    <Pergamino />
    <Triangulo />
  </EscenaMundo>
);

// ═════════ HUB 18 · "Something happens. You do something, and you feel something." (el bucle orbita al monje) ═════════
const NodoBucle = (i: number): D => ({ t, t0, on, tam }) => {
  const c = [N.cianClaro, N.oroClaro, N.oro][i];
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={c} trazos={[{ d: circ(0, 0, 70), a: 3, f: "rgba(5,5,6,.6)" }, { d: "M60,-50 L84,-74 M74,-46 L84,-74 L56,-70", a: 2.4, dt: 0.3 }]}>
      {i === 0 && <><path d="M-26,14 Q-26,-30 0,-30 Q26,-30 26,14 L34,22 L-34,22 Z" fill="none" stroke={c} strokeWidth={4} /><circle cx={0} cy={30} r={6} fill={c} /></>}
      {i === 1 && <path d="M-20,30 L-20,-10 Q-20,-30 -6,-30 L-6,-4 M-6,-30 Q0,-40 8,-30 L8,-4 M8,-26 Q16,-34 22,-24 L22,10 Q22,40 0,40 Q-20,40 -20,30 Z" fill="none" stroke={c} strokeWidth={4} />}
      {i === 2 && Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2 + t * 2; return <path key={k} d={`M${Math.cos(a) * 12},${Math.sin(a) * 12} L${Math.cos(a) * 36},${Math.sin(a) * 36}`} stroke={c} strokeWidth={4} strokeLinecap="round" />; })}
      <TextoNeon y={100} texto={["happens", "you do", "you feel"][i]} size={22} serif color={c} on={ramp(t, t0 + 0.2, 0.3)} />
    </Glifo>
  );
};

// ═════════ ESCENA 18 · campana → mano → chispa · x90 al día · por años · el sendero se vuelve autopista ═════════
const E18 = { notif: T("notification sound", 306), pick: T("pick up the", 308), spark: T("small spark", 310), repeat: T("Repeat this", 311.5), years: T("for years", 313.5), path: T("the path in", 314), highway: T("a highway", 316), after: T("After a while", 318) };
const tomas18: Toma[] = [[306.3, -420, 0, 1.25], [308.0, -420, 0, 1.2], [308.6, 0, 0, 1.2], [309.8, 0, 0, 1.2], [310.4, 420, 0, 1.25], [311.6, 0, 0, 0.9], [315.0, 0, 0, 0.92], [315.8, 1500, 0, 1.0], [319.8, 1500, 0, 1.1]];
const Ciclo90: React.FC = () => {
  const t = useT();
  const ciclo = t > E18.repeat ? Math.min(90, Math.floor((t - E18.repeat) * 30)) : 0;
  const fase = t > E18.repeat && t < E18.path ? ((t - E18.repeat) * 3) % 1 : -1;
  const act = (i: number) => {
    const tt = [E18.notif, E18.pick, E18.spark][i];
    if (fase >= 0) return Math.floor(fase * 3) === i ? 1 : 0.35;
    return t >= tt ? 1 : 0;
  };
  const sube = ramp(t, E18.pick, 0.5, easeOut);
  return (
    <>
      {/* campana */}
      <Obj x={-420} y={0} t0={E18.notif - 0.4} tam={200} color={N.cianClaro} trazos={[{ d: "M-60,40 Q-60,-80 0,-80 Q60,-80 60,40 L80,60 L-80,60 Z", a: 3 }, { d: circ(0, 78, 12), a: 3 }]}>
        <g opacity={act(0)}>{[1, 2, 3].map((k) => <path key={k} d={`M${80 + k * 22},-50 q20,40 0,80 M${-80 - k * 22},-50 q-20,40 0,80`} stroke={N.cianClaro} strokeWidth={4} fill="none" opacity={(Math.sin(t * 10 - k) + 1) / 2} />)}</g>
      </Obj>
      {/* mano que levanta el celular */}
      <div style={{ position: "absolute", left: 0, top: 60 - 90 * sube, opacity: ramp(t, E18.pick - 0.3, 0.3) * (0.3 + 0.7 * act(1)) }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          <path d="M-46,-110 L46,-110 Q56,-110 56,-100 L56,80 Q56,90 46,90 L-46,90 Q-56,90 -56,80 L-56,-100 Q-56,-110 -46,-110 Z" fill="rgba(39,227,255,.06)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian)} />
          <path d="M-56,30 Q-100,30 -96,80 Q-90,150 -20,170 L40,170 Q90,150 90,80 L56,40" fill="none" stroke={N.oroClaro} strokeWidth={4} style={glow(N.oro)} />
        </svg>
      </div>
      {/* chispa */}
      <svg width={1} height={1} style={abs(420, 0)} opacity={act(2)}>
        {Array.from({ length: 12 }, (_, k) => { const a = (k / 12) * Math.PI * 2 + t * 0.6, L = 60 + 40 * Math.abs(Math.sin(t * 6 + k)); return <path key={k} d={`M${Math.cos(a) * 24},${Math.sin(a) * 24} L${Math.cos(a) * L},${Math.sin(a) * L}`} stroke={N.oro} strokeWidth={5} strokeLinecap="round" style={glow(N.oro)} />; })}
        <circle r={18} fill={N.oroClaro} style={glow(N.oro, 14)} />
      </svg>
      {/* flechas del ciclo */}
      <svg width={1} height={1} style={abs(0, 0)} opacity={ramp(t, E18.pick, 0.3)}>
        <path d="M-300,0 L-140,0 M-160,-14 L-140,0 L-160,14" stroke={N.gris} strokeWidth={4} fill="none" />
        <path d="M140,0 L300,0 M280,-14 L300,0 L280,14" stroke={N.gris} strokeWidth={4} fill="none" opacity={ramp(t, E18.spark, 0.3)} />
        <path d="M420,90 Q420,240 0,240 Q-420,240 -420,90 M-434,110 L-420,90 L-406,110" stroke={N.oro} strokeWidth={4} fill="none" opacity={ramp(t, E18.repeat, 0.3)} strokeDasharray="12 10" style={glow(N.oro, 5)} />
      </svg>
      <Texto x={-420} y={-210} t0={E18.notif} texto="a *notification*" size={44} color={N.cianClaro} t1={E18.repeat} />
      <Texto x={0} y={-210} t0={E18.pick} texto="you *pick it up*" size={44} color={N.oroClaro} t1={E18.repeat} />
      <Texto x={420} y={-210} t0={E18.spark} texto="a small *spark*" size={44} color={N.oro} t1={E18.repeat} />
      {t > E18.repeat - 0.1 && (
        <div style={{ position: "absolute", left: 0, top: -250, transform: "translate(-50%,-50%)", fontFamily: "sans-serif", fontWeight: 900, fontSize: 120, color: N.oroClaro, whiteSpace: "nowrap", textShadow: `0 0 24px ${N.oro}`, opacity: ramp(t, E18.repeat - 0.1, 0.2) * (1 - ramp(t, E18.path, 0.4)) }}>
          ×{ciclo}<span style={{ fontSize: 40, marginLeft: 14 }}>a day</span>
        </div>
      )}
      <Contador x={0} y={350} t0={E18.years} d={1.6} a0={1} a1={10} size={70} color={N.violeta} sufijo="years" t1={E18.path + 0.3} />
    </>
  );
};
const Autopista: React.FC = () => {
  const t = useT();
  if (t < E18.path - 0.4) return null;
  const k = ramp(t, E18.highway - 0.2, 1.2, easeOut);
  const d = "M-460,140 C-260,-180 120,260 460,-140";
  const ancho = lerp(3, 70, k);
  return (
    <svg width={1} height={1} style={abs(1500, 20)} opacity={ramp(t, E18.path - 0.4, 0.4)}>
      {/* contorno del cerebro */}
      <path d="M-520,60 Q-560,-220 -260,-280 Q-60,-360 160,-300 Q500,-280 520,-40 Q560,180 300,240 Q120,330 -100,260 Q-460,280 -520,60 Z" fill="none" stroke={N.gris} strokeWidth={3} />
      <path d={d} fill="none" stroke={N.oro} strokeWidth={ancho} strokeLinecap="round" opacity={0.25 + 0.35 * k} style={glow(N.oro, 12)} />
      <path d={d} fill="none" stroke={k > 0.5 ? "#050506" : N.oroClaro} strokeWidth={k > 0.5 ? ancho - 10 : 3} strokeDasharray={k > 0.5 ? undefined : "4 14"} strokeLinecap="round" opacity={0.9} />
      {k > 0.5 && <path d={d} fill="none" stroke={N.oroClaro} strokeWidth={3} strokeDasharray="30 30" strokeDashoffset={-t * 400} opacity={k} />}
      {k > 0.6 && [0, 1, 2, 3, 4].map((i) => <path key={i} d={d} fill="none" stroke={i % 2 ? N.rojo : "#fff"} strokeWidth={6} strokeLinecap="round" strokeDasharray="20 1200" strokeDashoffset={-((t * 700 + i * 260) % 1220)} transform={`translate(0,${(i % 2 ? 1 : -1) * 18})`} style={glow(i % 2 ? N.rojo : "#fff", 8)} />)}
      <text x={0} y={-340} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={48} fill="#fff" opacity={ramp(t, E18.path, 0.3) * (1 - ramp(t, E18.highway, 0.3))}>a path…</text>
      <text x={0} y={-340} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={70} fill={N.oroClaro} opacity={ramp(t, E18.highway, 0.3)} style={glow(N.oro, 10)}>a highway</text>
    </svg>
  );
};
const Escena18: React.FC = () => (
  <EscenaMundo tomas={tomas18}>
    <Ciclo90 />
    <Autopista />
  </EscenaMundo>
);

// ═════════ HUB 19 · "don't even need the sound. Boredom becomes the trigger." ═════════
const CampanaTachada: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-40,26 Q-40,-50 0,-50 Q40,-50 40,26 L54,40 L-54,40 Z", a: 2.6 }, tachar(0.3)]} />
);
const NubeAburrida: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-80,30 Q-110,-10 -70,-30 Q-60,-70 -10,-60 Q30,-90 60,-50 Q110,-50 96,0 Q110,40 60,40 L-60,40 Q-80,40 -80,30 Z", a: 2.6, f: "rgba(183,123,255,.05)" },
    { d: "M-34,-6 L-14,-6 M14,-6 L34,-6 M-20,18 L20,18", a: 2.6, dt: 0.3 },
  ]}>
    <TextoNeon x={90 + 6 * Math.sin(t * 2)} y={-70 - ((t * 20) % 30)} texto="z" size={26} color={N.violeta} on={0.7} />
  </Glifo>
);
const Gatillo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-60,-20 L40,-20 L60,0 L40,20 L-60,20 Z", a: 2.6, f: "rgba(255,42,72,.08)" }]}>
    <TextoNeon x={-8} y={2} texto="TRIGGER" size={22} color={N.rojoBorde} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 19 · carrusel de gatillos: un momento quieto · la pava · la mano le gana a la mente · engranaje 2 ═════════
const E19 = { quiet: T("quiet moment", 323), kettle: T("Waiting for the kettle", 325.5), boil: T("to boil becomes", 327), hand: T("hand moves before", 329.5), mind: T("your mind has", 330.5), decided: T("decided anything", 331.5), second: T("the second gear", 333.5), lever: T("the lever", 334.5) };
const tomas19: Toma[] = [[323.2, 0, 0, 1.12], [325.4, 0, 0, 1.18], [326.0, 760, 0, 1.12], [329.0, 760, 0, 1.18], [329.6, 1560, 0, 1.0], [333.0, 1560, 0, 1.04], [333.6, 2400, 0, 1.12], [336.3, 2400, 0, 1.2]];
const Etiqueta: React.FC<{ x: number; y: number; t0: number }> = ({ x, y, t0 }) => {
  const t = useT();
  if (t < t0) return null;
  const s = 1.6 - 0.6 * pop(t, t0, 9);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(-8deg) scale(${s})`, opacity: ramp(t, t0, 0.12), border: `4px solid ${N.rojo}`, borderRadius: 8, padding: "4px 16px", fontFamily: "sans-serif", fontWeight: 900, fontSize: 40, color: N.rojoBorde, boxShadow: `0 0 20px ${N.rojo}`, textShadow: `0 0 10px ${N.rojo}` }}>TRIGGER</div>
  );
};
const CelularChispa: React.FC<{ x: number; y: number; t0: number }> = ({ x, y, t0 }) => {
  const t = useT();
  return (
    <Obj x={x} y={y} t0={t0} tam={200} color={N.cianClaro} trazos={[{ d: "M-36,-66 L36,-66 Q44,-66 44,-58 L44,58 Q44,66 36,66 L-36,66 Q-44,66 -44,58 L-44,-58 Q-44,-66 -36,-66 Z", a: 2.6 }]}>
      <rect x={-38} y={-60} width={76} height={120} rx={6} fill={N.cian} opacity={0.18 * neonOn(t, t0 + 0.5)} />
    </Obj>
  );
};
const Banco: React.FC = () => {
  const t = useT();
  return (
    <>
      <Obj x={-60} y={60} t0={E19.quiet - 0.5} tam={200} color="#e6eeff" trazos={[
        { d: "M-160,40 L160,40 M-160,0 L160,0 M-140,40 L-140,110 M140,40 L140,110 M-160,-40 L160,-40", a: 2.6 },
        { d: "M240,110 L240,-230 Q240,-260 210,-260 L180,-260", c: N.gris, a: 2.2 },
      ]} />
      <svg width={1} height={1} style={abs(120, -200)} opacity={ramp(t, E19.quiet, 0.5)}>
        <path d="M-40,0 L40,0 L20,-30 L-20,-30 Z" fill="rgba(255,240,179,.2)" stroke={N.oroClaro} strokeWidth={3} />
        <path d="M-40,0 L-160,260 L160,260 L40,0 Z" fill="rgba(255,240,179,.06)" />
      </svg>
      <CelularChispa x={-240} y={-140} t0={E19.quiet + 0.6} />
      <Etiqueta x={-60} y={-260} t0={E19.quiet + 0.9} />
      <Texto x={-60} y={250} t0={E19.quiet} texto="a quiet *moment*" size={46} />
    </>
  );
};
const Pava: React.FC = () => {
  const t = useT();
  const hierve = ramp(t, E19.boil, 0.6);
  return (
    <>
      <Obj x={760} y={60} t0={E19.kettle - 0.4} tam={200} color="#e6eeff" trazos={[
        { d: "M-110,110 Q-130,-20 -70,-70 L70,-70 Q130,-20 110,110 Z", a: 2.8, f: "rgba(255,255,255,.03)" },
        { d: "M-50,-70 Q0,-140 50,-70 M110,-10 L190,-90 L200,-70", a: 2.6 },
        { d: "M-130,130 L130,130", c: N.rojo, a: 3 },
      ]} />
      <svg width={1} height={1} style={abs(950, -40)} opacity={hierve}>
        {[0, 1, 2].map((i) => { const y = -((t * 90 + i * 50) % 150); return <path key={i} d={`M${i * 16},${y} q-14,-20 0,-40 q14,-20 0,-40`} stroke="#e6eeff" strokeWidth={4} fill="none" opacity={1 + y / 150} />; })}
      </svg>
      <CelularChispa x={560} y={-140} t0={E19.boil + 0.3} />
      <Etiqueta x={760} y={-260} t0={E19.boil + 0.6} />
      <Texto x={760} y={260} t0={E19.kettle} texto="waiting for the *kettle*" size={46} />
    </>
  );
};
const Carrera: React.FC = () => {
  const t = useT();
  const kM = ramp(t, E19.hand, 1.1, easeOut), kC = ramp(t, E19.mind, 2.2);
  const x0 = 1180, x1 = 1900;
  return (
    <>
      <svg width={1} height={1} style={abs(0, 0)} opacity={ramp(t, E19.hand - 0.4, 0.3)}>
        <path d={`M${x0},-60 L${x1},-60 M${x0},120 L${x1},120`} stroke={N.gris} strokeWidth={2} strokeDasharray="10 12" />
        <path d={`M${x1 + 30},-150 L${x1 + 30},210`} stroke="#fff" strokeWidth={4} strokeDasharray="14 10" />
        {/* mano */}
        <g transform={`translate(${lerp(x0, x1, kM)},-60)`} style={glow(N.oro)}>
          <path d="M-30,30 L-30,-10 Q-30,-34 -10,-34 L-10,-6 M-10,-34 Q0,-46 10,-34 L10,-6 M10,-30 Q22,-38 30,-26 L30,12 Q30,46 0,46 Q-30,46 -30,30 Z" fill="rgba(5,5,6,.8)" stroke={N.oroClaro} strokeWidth={4} />
        </g>
        {/* mente */}
        <g transform={`translate(${lerp(x0, x1, kC * 0.55)},120)`} style={glow(N.violeta)}>
          <path d="M-50,10 Q-60,-34 -20,-44 Q0,-60 26,-46 Q60,-40 54,0 Q60,30 26,34 Q10,50 -10,40 Q-40,46 -50,10 Z" fill="rgba(5,5,6,.8)" stroke={N.violeta} strokeWidth={4} />
          <text y={-60} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={26} fill={N.violeta} opacity={ramp(t, E19.decided, 0.3)}>deciding…</text>
        </g>
      </svg>
      <Texto x={1540} y={-250} t0={E19.hand} texto="the *hand* moves first" size={50} color={N.oroClaro} />
      <Texto x={1540} y={280} t0={E19.decided} texto="before the mind *decides*" size={40} color={N.violeta} />
    </>
  );
};
const MarcoDos: React.FC = () => {
  const t = useT();
  if (t < E19.second - 0.4) return null;
  const enc = ramp(t, E19.second + 0.2, 0.6, easeOut);
  return (
    <>
      <Obj x={2400} y={20} t0={E19.second - 0.4} tam={200} color="#e6eeff" trazos={[
        { d: "M-380,-130 L380,-130 L380,130 L-380,130 Z", a: 2.4 },
        ...[0, 1, 2, 3].map((i): Trazo => ({ d: circ(-270 + i * 180, 0, 82), c: i < 2 ? N.oro : N.gris, a: 1.6, dt: 0.06 * i })),
      ]} />
      <div style={{ position: "absolute", left: 2400 - 270, top: 20, transform: `rotate(${t * 40}deg)` }}><EngranajeSvg r={72} color={N.oro} n={1} /></div>
      <div style={{ position: "absolute", left: 2400 - 90, top: 20 - 300 * (1 - enc), opacity: enc, transform: `rotate(${-t * 40}deg)` }}><EngranajeSvg r={72} color={N.oro} n={2} /></div>
      {enc > 0.98 && <svg width={1} height={1} style={abs(2310, 20)}><circle r={90 + 80 * ramp(t, E19.second + 0.8, 0.5)} fill="none" stroke={N.oro} strokeWidth={3} opacity={1 - ramp(t, E19.second + 0.8, 0.5)} /></svg>}
      <Texto x={2400} y={-230} t0={E19.second} texto="the *second gear*" size={58} color={N.oroClaro} />
      <Texto x={2400} y={230} t0={E19.lever} texto="the *lever*" size={50} color={N.oro} />
    </>
  );
};
// objetos de vidrio de la escena 19
const H19: React.FC = () => (
  <>
    <Png id="pava" x={1160} y={40} w={230} t0={E19.kettle} glow={N.cian} />
    <Png id="engranaje" x={2800} y={40} w={220} t0={E19.second} glow={N.oro} />
  </>
);
const Escena19: React.FC = () => (
  <EscenaMundo tomas={tomas19}><H19 />
    <Banco />
    <Pava />
    <Carrera />
    <MarcoDos />
  </EscenaMundo>
);

export const SEGS_M05: Seg[] = [
  {
    hub: { portal: "palanca", orbs: [
      { id: "cita", t: T("he wished", 268), ang: 198, anillo: 1, tam: 190, D: CitaCard },
      { id: "alerta", t: T("so addictive", 269), ang: 128, anillo: 2, tam: 170, D: Alerta },
      { id: "palanca", t: T("the lever is", 272), ang: -14, anillo: 0, tam: 240, D: PalancaGrande, png: "palanca" },
    ] },
    Escena: Escena16,
    sonidos: (s) => { s.add("aparece", E16.easy, 0.6); s.add("traza", E16.easy + 0.1, 0.6); s.add("vuelo", 277.3, 0.6); s.add("neonOn", E16.casino + 0.2); s.add("vuelo", 279.6, 0.5); s.add("tiron", E16.drive - 0.3, 0.6); s.add("aparece", E16.money); s.add("digito", E16.pocket, 0.6); s.add("vueloLargo", E16.hand - 0.2, 0.7); s.add("golpe", E16.hand + 0.6, 0.5); },
  },
  {
    hub: { portal: "crono", orbs: [
      { id: "puerta", t: T("No door", 285.3), ang: 200, anillo: 1, tam: 150, D: Puerta, png: "puerta" },
      { id: "auto", t: T("no drive", 286), ang: 130, anillo: 2, tam: 170, D: Auto },
      { id: "dolar", t: T("no cost", 287), ang: 40, anillo: 2, tam: 140, D: Dolar },
      { id: "crono", t: T("always one second", 289), ang: -14, anillo: 0, tam: 240, D: Crono1s },
    ] },
    Escena: Escena17,
    sonidos: (s) => { s.add("traza", 285.9, 0.5); s.add("traza", 287.0, 0.5); s.add("traza", 288.1, 0.5); s.add("tic", T("one second away", 289.5)); s.add("tiron", E17.monks - 0.2, 0.7); s.add("hilo", E17.monks + 0.6, 0.5); s.add("aparece", E17.three, 0.6); s.add("aviso", E17.trigger); s.add("toque", E17.action); s.add("sinapsis", E17.reward); },
  },
  {
    hub: { portal: "n2", orbs: [0, 1, 2].map((i) => ({ id: "n" + i, t: [T("Something happens", 302), T("You do something", 303), T("feel something", 304.5)][i], ang: -14 + i * 120, anillo: 0 as const, tam: 190, D: NodoBucle(i) })) },
    Escena: Escena18,
    sonidos: (s) => { s.add("aviso", E18.notif); s.add("vuelo", 308.1, 0.5); s.add("tiron", E18.pick); s.add("vuelo", 310.0, 0.5); s.add("sinapsis", E18.spark); s.add("vuelo", 311.6, 0.5); for (let i = 0; i < 12; i++) s.add("tic", E18.repeat + i * 0.33, 0.4); s.add("digito", E18.years, 0.6); s.add("vueloLargo", 315.7, 0.6); s.add("luz", E18.highway); s.add("ola", E18.highway + 0.3, 0.5); },
  },
  {
    hub: { portal: "nube", orbs: [
      { id: "campana", t: T("need the sound", 319), ang: 198, anillo: 1, tam: 160, D: CampanaTachada },
      { id: "nube", t: T("Boredom becomes", 321), ang: -14, anillo: 0, tam: 250, D: NubeAburrida },
      { id: "gat", t: T("the trigger", 322), ang: 128, anillo: 2, tam: 170, D: Gatillo },
    ] },
    Escena: Escena19,
    sonidos: (s) => { s.add("aparece", E19.quiet, 0.5); s.add("aviso", E19.quiet + 0.6, 0.6); s.add("golpe", E19.quiet + 0.9, 0.5); s.add("vuelo", 325.9, 0.5); s.add("ola", E19.boil, 0.4); s.add("aviso", E19.boil + 0.3, 0.6); s.add("golpe", E19.boil + 0.6, 0.5); s.add("vuelo", 329.5, 0.5); s.add("tiron", E19.hand); s.add("vuelo", 333.5, 0.5); s.add("engranaje", E19.second + 0.3); s.add("golpe", E19.second + 0.8, 0.6); },
  },
];
