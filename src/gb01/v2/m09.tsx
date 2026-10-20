// gb01 v2 · MINUTO 9 (ventanas 32-35, 535-603 s): la máquina entera · la palanca sin esfuerzo · las puertas que desaparecen ·
// el punto rojo que llega al miedo más viejo · 4 engranajes en el bolsillo · "no sos débil, no estás roto" (kintsugi) ·
// bayas, leones y fogata · miles de diseñadores contra un cerebro · la culpa que se levanta · la historia del mono y el coco.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { EscenaMundo, Obj, Texto, circ, Png } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const TRIBU = "#ffcf9a";
const FUEGO = "#ff9a3c";
// engranaje como path (dientes trapezoidales + agujero)
const engr = (r: number, n = 10) => {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, w = Math.PI / n;
    ([[0.8, a - w * 0.9], [1, a - w * 0.45], [1, a + w * 0.45], [0.8, a + w * 0.9]] as const).forEach(([k, b], j) => { d += (i === 0 && j === 0 ? "M" : "L") + (r * k * Math.cos(b)).toFixed(1) + "," + (r * k * Math.sin(b)).toFixed(1); });
  }
  return d + "Z " + circ(0, 0, r * 0.28);
};
const Gear: React.FC<{ x?: number; y?: number; r: number; c: string; rot: number; n?: number; lbl?: string; on?: number }> = ({ x = 0, y = 0, r, c, rot, n = 10, lbl, on = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={on} style={glow(c, 8)}>
    <path d={engr(r, n)} transform={`rotate(${rot})`} fill="rgba(5,5,6,.85)" stroke={c} strokeWidth={Math.max(2, r / 22)} />
    {lbl && <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={r * 0.42} fill={c}>{lbl}</text>}
  </g>
);
const Persona: React.FC<{ x: number; y: number; s?: number; c?: string; op?: number }> = ({ x, y, s = 1, c = "#e6eeff", op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op} style={glow(c, 6)}>
    <circle cx={0} cy={-90} r={26} fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
    <path d="M-44,30 Q-44,-56 0,-58 Q44,-56 44,30 Z" fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
  </g>
);
const CEREBRO = "M-260,40 Q-300,-160 -120,-200 Q0,-260 140,-210 Q300,-180 290,-20 Q300,110 160,140 Q80,200 -20,170 Q-200,190 -260,40 Z";

// ═════════ HUB 32 · "look at the whole machine. The maybe makes you want. The lever" ═════════
const Maquina: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-90,-70 L90,-70 L90,70 L-90,70 Z", a: 2.4 }]}>
    {[[-45, -20, N.violeta, 1], [10, 22, N.oro, -1], [52, -26, N.cian, 1], [-30, 40, N.rojo, -1]].map(([x, y, c, s], i) => <Gear key={i} x={x as number} y={y as number} r={30} c={c as string} rot={(s as number) * t * 60} n={8} />)}
  </Glifo>
);
const GearMaybe: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[]}><Gear r={80} c={N.violeta} rot={t * 50} lbl="?" /></Glifo>
);
const GearLever: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[]}>
    <Gear r={80} c={N.oro} rot={-t * 50} />
    <path d={`M0,0 L${36 * Math.sin(Math.sin(t * 4) * 0.6)},${-56 * Math.cos(Math.sin(t * 4) * 0.6)}`} stroke={N.oroClaro} strokeWidth={8} strokeLinecap="round" /><circle cx={36 * Math.sin(Math.sin(t * 4) * 0.6)} cy={-56 * Math.cos(Math.sin(t * 4) * 0.6)} r={12} fill={N.rojo} />
  </Glifo>
);

// ═════════ ESCENA 32 · la palanca sin esfuerzo · las puertas que desaparecen · el punto rojo al miedo más viejo ═════════
const E32 = { effort: T("makes it effortless", 539.5), reel: T("endless reel removes", 541), door: T("every door", 544), stop: T("could stop", 545), red: T("red dot reaches", 546.5), fear: T("oldest fear", 548.5), alone: T("left alone", 551) };
const tomas32: Toma[] = [[540.0, 0, 0, 1.12], [542.6, 0, 0, 1.0], [543.1, 900, 0, 1.08], [546.4, 900, 0, 1.0], [546.9, 1800, 0, 1.06], [550.8, 1800, 0, 1.0], [552.6, 1800, 30, 1.22]];
const PalancaPluma: React.FC = () => {
  const t = useT();
  const baja = ramp(t, E32.effort + 0.2, 0.5, easeOut) * (1 - ramp(t, E32.effort + 1.2, 0.4)) + ramp(t, E32.effort + 1.7, 0.4, easeOut);
  const a = lerp(-0.7, 0.7, Math.min(1, baja));
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)} opacity={ramp(t, E32.effort - 0.5, 0.4)}>
        <rect x={-150} y={110} width={300} height={130} rx={18} fill="rgba(5,5,6,.9)" stroke={N.oro} strokeWidth={4} style={glow(N.oro)} />
        <path d={`M100,140 L${100 + 260 * Math.sin(a)},${140 - 260 * Math.cos(a)}`} stroke={N.oroClaro} strokeWidth={12} strokeLinecap="round" style={glow(N.oro)} />
        {/* una pluma la empuja: cero esfuerzo */}
        <g transform={`translate(${100 + 280 * Math.sin(a)},${120 - 280 * Math.cos(a)}) rotate(${-30 + a * 30})`} style={glow("#fff", 8)}>
          <path d="M0,-70 Q34,-30 6,60 Q-26,-20 0,-70 Z" fill="rgba(230,238,255,.12)" stroke="#e6eeff" strokeWidth={3} /><path d="M0,-60 L4,74" stroke="#e6eeff" strokeWidth={2} />
        </g>
        <text x={-90} y={185} fontFamily="sans-serif" fontWeight={800} fontSize={26} fill={N.texto2}>effort</text>
        <rect x={10} y={168} width={70} height={22} rx={6} fill="none" stroke={N.gris} strokeWidth={2} /><rect x={12} y={170} width={2 + 4 * (1 - Math.min(1, baja))} height={18} fill={N.verde} />
      </svg>
      <Texto x={0} y={-290} t0={E32.effort} texto="*effortless*" size={66} color={N.oroClaro} t1={E32.reel + 0.4} />
    </>
  );
};
const PuertasSeVan: React.FC = () => {
  const t = useT();
  if (t < E32.reel - 0.4) return null;
  const desliz = (t - E32.reel) * 160;
  const PUERTAS = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <svg width={1} height={1} style={abs(900, 40)} opacity={ramp(t, E32.reel - 0.4, 0.4)}>
        {/* la cinta sin fin */}
        <path d="M-520,140 L520,140 M-520,170 L520,170" stroke={N.cianClaro} strokeWidth={3} style={glow(N.cian, 6)} />
        {Array.from({ length: 14 }, (_, i) => { const x = ((i * 80 - desliz) % 1120 + 1120) % 1120 - 560; return <path key={i} d={`M${x},142 L${x + 20},168`} stroke={N.cian} strokeWidth={2} opacity={0.5} />; })}
        {PUERTAS.map((i) => {
          const x = -420 + i * 170, tv = E32.door + i * 0.22, k = ramp(t, tv, 0.35);
          return <g key={i} transform={`translate(${x},20)`} opacity={1 - 0.7 * k}>
            <rect x={-50} y={-110} width={100} height={170} rx={6} fill="rgba(5,5,6,.9)" stroke={k > 0.5 ? N.gris : N.verde} strokeWidth={3.5} strokeDasharray={k > 0.5 ? "8 8" : undefined} style={glow(N.verde, 6 * (1 - k))} />
            <circle cx={30} cy={-20} r={6} fill={N.verde} opacity={1 - k} />
            <text y={-128} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={20} fill={N.verde}>stop</text>
          </g>;
        })}
      </svg>
      <Texto x={900} y={-290} t0={E32.reel} texto="every *door* where you could stop" size={44} color={N.verde} />
      <Texto x={900} y={290} t0={E32.stop + 0.3} texto="gone" size={42} color={N.rojoBorde} />
    </>
  );
};
const MiedoViejo: React.FC = () => {
  const t = useT();
  if (t < E32.red - 0.4) return null;
  const llega = ramp(t, E32.red + 0.2, 1.4, easeOut);
  const solo = ramp(t, E32.alone, 0.6);
  return (
    <>
      <svg width={1} height={1} style={abs(1800, 30)} opacity={ramp(t, E32.red - 0.4, 0.4)}>
        <path d={CEREBRO} fill="rgba(203,251,255,.03)" stroke={N.cianClaro} strokeWidth={3.5} style={glow(N.cian, 6)} opacity={1 - 0.6 * solo} />
        {/* el tentáculo del punto rojo entra hasta el núcleo */}
        <path d="M420,-260 Q260,-200 200,-80 Q140,40 0,60" fill="none" stroke={N.rojo} strokeWidth={5} strokeDasharray="700" strokeDashoffset={700 * (1 - llega)} style={glow(N.rojo, 12)} />
        <circle cx={420} cy={-260} r={30 + 4 * Math.sin(t * 8)} fill={N.rojo} style={glow(N.rojo, 18)} />
        <circle cx={0} cy={60} r={(18 + 8 * Math.sin(t * 9)) * neonOn(t, E32.fear)} fill={N.rojo} opacity={0.85} style={glow(N.rojo, 20)} />
        {/* el miedo: una figura sola en un círculo de oscuridad */}
        <g opacity={solo}>
          <circle cx={0} cy={60} r={lerp(60, 150, solo)} fill="rgba(0,0,0,.75)" stroke={N.rojoBorde} strokeWidth={2} strokeDasharray="5 9" />
          <Persona x={0} y={110} s={0.9} />
          {[0, 1, 2, 3].map((i) => { const a = -0.6 + i * 0.4 + Math.PI * (i % 2), r = lerp(200, 420, ramp(t, E32.alone + 0.2, 1.2, easeOut)); return <Persona key={i} x={Math.cos(a) * r} y={90 + Math.sin(a) * r * 0.35} s={0.6} c={TRIBU} op={0.7 * (1 - ramp(t, E32.alone + 0.6, 1))} />; })}
        </g>
      </svg>
      <Texto x={1800} y={-300} t0={E32.fear} texto="your *oldest fear*" size={52} color={N.rojoBorde} t1={E32.alone - 0.2} />
      <Texto x={1800} y={-300} t0={E32.alone - 0.2} texto="being left *alone*" size={56} color={N.rojoBorde} />
    </>
  );
};
// objetos de vidrio de la escena 32
const H32: React.FC = () => (
  <>
    <Png id="palanca" x={470} y={60} w={260} t0={E32.effort} glow={N.rojo} />
    <Png id="puerta" x={1330} y={60} w={260} t0={E32.reel} t1={E32.stop + 0.8} glow={N.oro} />
    <Png id="silla" x={2270} y={80} w={260} t0={E32.alone - 0.2} glow={N.violeta} />
  </>
);
const Escena32: React.FC = () => <EscenaMundo tomas={tomas32}><PalancaPluma /><PuertasSeVan /><MiedoViejo /><H32 /></EscenaMundo>;

// ═════════ HUB 33 · "Four gears turning together all day long in your pocket." ═════════
const COLS = [N.violeta, N.oro, N.cian, N.rojo];
const GearN = (i: number): D => ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={COLS[i]} trazos={[]}><Gear r={78} c={COLS[i]} rot={(i % 2 ? -1 : 1) * t * 70} lbl={String(i + 1)} /></Glifo>
);
const SolLuna: D = ({ t, t0, on, tam }) => {
  const a = t * 1.4;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-80,40 L80,40", a: 2, c: N.gris }]}>
      <circle cx={70 * Math.cos(a)} cy={40 - 70 * Math.abs(Math.sin(a))} r={16} fill={Math.sin(a) > 0 ? N.oro : "none"} stroke={N.oroClaro} strokeWidth={3} />
      <TextoNeon y={72} texto="all day" size={20} color={N.oroClaro} serif on={ramp(t, t0 + 0.3, 0.3)} />
    </Glifo>
  );
};
const Bolsillo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-80,-60 L80,-60 L80,30 Q80,90 0,90 Q-80,90 -80,30 Z", a: 2.6 }, { d: "M-80,-40 L80,-40", a: 1.6, c: N.gris }]}>
    <g transform="translate(0,-70)"><rect x={-30} y={-50} width={60} height={100} rx={10} fill="rgba(5,5,6,.95)" stroke={N.cianClaro} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => <Gear key={i} x={(i % 2 ? 10 : -10)} y={-30 + i * 18} r={9} c={COLS[i]} rot={(i % 2 ? -1 : 1) * t * 90} n={7} />)}</g>
  </Glifo>
);

// ═════════ ESCENA 33 · quiero ser claro · no sos débil · no estás roto (kintsugi) · tu cerebro hace lo que fue hecho para hacer ═════════
const E33 = { clear: T("be clear about", 559), weak: T("not weak", 561.5), broken: T("not broken", 563), brain: T("Your brain is", 564.5), exactly: T("doing exactly what", 564), built: T("built to do", 566.5) };
const tomas33: Toma[] = [[558.0, 0, 0, 1.1], [561.0, 0, 0, 1.0], [561.4, 900, 0, 1.1], [564.8, 900, 0, 1.0], [565.3, 1800, 0, 1.06], [568.0, 1800, 0, 1.12]];
const VidrioLimpio: React.FC = () => {
  const t = useT();
  const k = ramp(t, E33.clear, 1.0, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 30)} opacity={ramp(t, 557.6, 0.4)}>
        <defs><clipPath id="g33v"><rect x={-260} y={-170} width={520} height={340} rx={20} /></clipPath></defs>
        <rect x={-260} y={-170} width={520} height={340} rx={20} fill="rgba(203,251,255,.04)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 8)} />
        <g clipPath="url(#g33v)">
          <Persona x={0} y={110} s={1.2} c="#e6eeff" />
          {/* empañado que se limpia de izq a der */}
          <rect x={lerp(-260, 260, k)} y={-170} width={520} height={340} fill="rgba(120,130,150,.55)" />
          <path d={`M${lerp(-260, 260, k)},-170 L${lerp(-260, 260, k)},170`} stroke="#fff" strokeWidth={6} opacity={k < 1 ? 0.9 : 0} style={glow("#fff", 12)} />
        </g>
      </svg>
      <Texto x={0} y={-290} t0={E33.clear} texto="let me be *clear*" size={60} t1={E33.weak} />
    </>
  );
};
const NoDebil: React.FC = () => {
  const t = useT();
  if (t < E33.weak - 0.4) return null;
  const tacha = ramp(t, E33.weak + 0.4, 0.3);
  const junta = ramp(t, E33.broken + 0.3, 1.0, easeOut);
  // pedazos de un corazón que se juntan con vetas doradas
  const P = [{ d: "M0,-30 L-70,-80 Q-120,-60 -100,0 L0,90 Z", dx: -120, dy: -60, r: -20 }, { d: "M0,-30 L70,-80 Q120,-60 100,0 L30,20 Z", dx: 140, dy: -80, r: 25 }, { d: "M30,20 L100,0 L0,90 Z", dx: 110, dy: 120, r: 30 }];
  return (
    <>
      <svg width={1} height={1} style={abs(900, 30)} opacity={ramp(t, E33.weak - 0.4, 0.4)}>
        <g transform="translate(-220,0)" opacity={1 - ramp(t, E33.broken - 0.2, 0.4) * 0.5}>
          <rect x={-130} y={-40} width={260} height={80} rx={12} fill="rgba(5,5,6,.9)" stroke={N.gris} strokeWidth={3} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={52} fill={N.texto2}>WEAK</text>
          <path d={`M-140,0 L${-140 + 280 * tacha},0`} stroke={N.rojo} strokeWidth={9} strokeLinecap="round" style={glow(N.rojo, 10)} />
        </g>
        <g transform="translate(200,10) scale(1.4)" opacity={ramp(t, E33.broken - 0.4, 0.3)}>
          {P.map((p, i) => <path key={i} d={p.d} transform={`translate(${p.dx * (1 - junta)},${p.dy * (1 - junta)}) rotate(${p.r * (1 - junta)})`} fill="rgba(255,42,72,.22)" stroke={N.rojo} strokeWidth={3} style={glow(N.rojo, 8)} />)}
          <path d="M0,-30 L0,90 M0,-30 L30,20 L100,0 M30,20 L0,90" fill="none" stroke={N.oroClaro} strokeWidth={3.5} opacity={ramp(t, E33.broken + 1.1, 0.4)} style={glow(N.oro, 10)} />
        </g>
      </svg>
      <Texto x={900} y={-290} t0={E33.weak} texto="you are *not weak*" size={54} t1={E33.broken} />
      <Texto x={900} y={-290} t0={E33.broken} texto="you are *not broken*" size={54} color={N.oroClaro} />
    </>
  );
};
const PlanoCerebro: React.FC = () => {
  const t = useT();
  if (t < E33.brain - 0.4) return null;
  const ok = pop(t, E33.built + 0.2, 7);
  return (
    <>
      <svg width={1} height={1} style={abs(1800, 30)} opacity={ramp(t, E33.brain - 0.4, 0.4)}>
        <rect x={-380} y={-230} width={760} height={460} fill="rgba(30,80,160,.12)" stroke={N.cian} strokeWidth={2} />
        {Array.from({ length: 19 }, (_, i) => <path key={i} d={`M${-380 + i * 40},-230 L${-380 + i * 40},230`} stroke={N.cian} strokeWidth={0.6} opacity={0.3} />)}
        {Array.from({ length: 12 }, (_, i) => <path key={"h" + i} d={`M-380,${-230 + i * 40} L380,${-230 + i * 40}`} stroke={N.cian} strokeWidth={0.6} opacity={0.3} />)}
        <g transform="scale(0.75)"><path d={CEREBRO} fill="none" stroke={N.cianClaro} strokeWidth={4} strokeDasharray="1600" strokeDashoffset={1600 * (1 - ramp(t, E33.brain, 1.2))} style={glow(N.cian, 6)} /></g>
        {[[-90, -40], [60, -70], [120, 40], [-40, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill={N.oro} opacity={neonOn(t, E33.exactly + i * 0.2)} style={glow(N.oro, 10)} />)}
        <text x={360} y={-200} textAnchor="end" fontFamily="monospace" fontSize={20} fill={N.cian}>spec: survive · belong · seek</text>
        <g transform={`translate(260,150) scale(${ok})`} style={glow(N.verde, 12)}><circle r={48} fill="rgba(5,5,6,.9)" stroke={N.verde} strokeWidth={5} /><path d="M-22,0 L-6,18 L24,-18" fill="none" stroke={N.verde} strokeWidth={7} strokeLinecap="round" /></g>
      </svg>
      <Texto x={1800} y={-300} t0={E33.exactly} texto="exactly what it was *built* to do" size={46} color={N.verde} />
    </>
  );
};
// objetos de vidrio de la escena 33
const H33: React.FC = () => (
  <>
    <Png id="cerebro" x={480} y={230} w={240} t0={E33.clear} glow={N.cian} />
    <Png id="corazon_kintsugi" x={1330} y={60} w={300} t0={E33.broken} glow={N.oro} />
    <Png id="neurona" x={2270} y={40} w={320} t0={E33.exactly} glow={N.violeta} />
  </>
);
const Escena33: React.FC = () => <EscenaMundo tomas={tomas33}><VidrioLimpio /><NoDebil /><PlanoCerebro /><H33 /></EscenaMundo>;

// ═════════ HUB 34 · "built for a world of berries and lions and small tribes around a fire." ═════════
const Bayas2: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: "M0,-80 Q-10,-30 -30,0 M0,-80 Q20,-30 30,10 M0,-80 L0,-20", a: 2.4 }]}>
    {[[-30, 10], [-50, 30], [-14, 34], [30, 20], [46, 44], [14, 48]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill="rgba(183,123,255,.5)" stroke={N.violeta} strokeWidth={2.5} />)}
  </Glifo>
);
const Leon: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `${i ? "L" : "M"}${80 * Math.cos(a)},${80 * Math.sin(a)} L${58 * Math.cos(a + 0.22)},${58 * Math.sin(a + 0.22)}`; }).join(" ") + "Z", a: 2.4 }, { d: circ(0, 0, 46), a: 2.6 }, { d: "M-18,-10 L-10,-6 M18,-10 L10,-6 M-10,18 L0,26 L10,18 M0,10 L0,26", a: 2.4, dt: 0.3 }]} />
);
const FogataHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={FUEGO} trazos={[{ d: "M-50,70 L50,50 M-50,50 L50,70", c: N.oroHondo, a: 3 }]}>
    {[0, 1, 2].map((i) => <path key={i} d={`M${-26 + i * 26},56 Q${-40 + i * 26 + 8 * Math.sin(t * 8 + i)},10 ${-8 + i * 16},${-40 + 14 * Math.sin(t * 6 + i)} Q${8 + i * 8},10 ${26 - i * 8},56 Z`} fill="rgba(255,140,40,.35)" stroke={i === 1 ? N.oroClaro : FUEGO} strokeWidth={2.5} />)}
    {[-1, 1].map((s) => <g key={s} transform={`translate(${s * 78},60) scale(0.4)`}><circle cx={0} cy={-90} r={24} fill="none" stroke={TRIBU} strokeWidth={5} /><path d="M-40,20 Q-40,-60 0,-62 Q40,-60 40,20 Z" fill="none" stroke={TRIBU} strokeWidth={5} /></g>)}
  </Glifo>
);

// ═════════ ESCENA 34 · nunca hecho para pelear contra una máquina de miles · mantenerte mirando · dejar de culparte · trabajar con tu mente ═════════
const E34 = { never: T("never built", 574.5), machine: T("machine designed by", 575), thousands: T("thousands of clever", 576), job: T("whose job", 579), looking: T("keep you looking", 580), understand: T("you understand that", 582), blaming: T("blaming yourself", 583), working: T("working with", 586) };
const tomas34: Toma[] = [[574.4, 0, 0, 1.0], [576.8, 0, 0, 0.92], [579.4, 0, 0, 0.88], [579.9, 1000, 0, 1.08], [581.7, 1000, 0, 1.0], [582.2, 1900, 0, 1.06], [586.2, 1900, 0, 1.0], [586.7, 2800, 0, 1.08], [587.6, 2800, 0, 1.14]];
const MilesContraUno: React.FC = () => {
  const t = useT();
  const n = Math.round(lerp(1, 4000, ramp(t, E34.thousands, 1.4)));
  const vis = Math.min(60, Math.floor(ramp(t, E34.thousands, 1.4) * 60));
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)} opacity={ramp(t, 574, 0.4)}>
        {/* el cerebrito solo */}
        <g transform="translate(-420,60) scale(0.38)"><path d={CEREBRO} fill="rgba(203,251,255,.05)" stroke={N.cianClaro} strokeWidth={8} style={glow(N.cian, 8)} /></g>
        <text x={-420} y={170} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={26} fill={N.cianClaro}>one brain</text>
        <text x={-170} y={70} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={60} fill={N.texto2} opacity={ramp(t, E34.machine, 0.3)}>vs</text>
        {/* la máquina gigante */}
        <g opacity={ramp(t, E34.machine - 0.2, 0.4)}>
          <rect x={-60} y={-200} width={540} height={400} rx={16} fill="rgba(5,5,6,.9)" stroke={N.rojo} strokeWidth={4} style={glow(N.rojo, 10)} />
          <Gear x={60} y={-110} r={60} c={N.rojo} rot={t * 50} />
          <Gear x={160} y={-80} r={40} c={N.rojoBorde} rot={-t * 75} n={8} />
          {/* los miles de diseñadores, en grilla */}
          {Array.from({ length: vis }, (_, i) => { const x = -20 + (i % 12) * 42, y = -10 + Math.floor(i / 12) * 42; return <g key={i} transform={`translate(${x},${y + 30}) scale(0.26)`}><circle cx={0} cy={-90} r={26} fill="none" stroke={N.oroClaro} strokeWidth={6} /><path d="M-44,30 Q-44,-56 0,-58 Q44,-56 44,30 Z" fill="none" stroke={N.oroClaro} strokeWidth={6} /></g>; })}
          <text x={420} y={-150} textAnchor="end" fontFamily="sans-serif" fontWeight={900} fontSize={44} fill={N.oroClaro} opacity={ramp(t, E34.thousands, 0.3)}>×{n.toLocaleString("en-US")}</text>
        </g>
      </svg>
      <Texto x={0} y={-310} t0={E34.never} texto="never built to fight *a machine*" size={50} t1={E34.thousands} />
      <Texto x={0} y={-310} t0={E34.thousands} texto="*thousands* of clever people" size={50} color={N.oroClaro} />
    </>
  );
};
const Hipnosis: React.FC = () => {
  const t = useT();
  if (t < E34.job - 0.4) return null;
  const rot = t * 120;
  return (
    <>
      <svg width={1} height={1} style={abs(1000, 30)} opacity={ramp(t, E34.job - 0.4, 0.4)}>
        <rect x={-170} y={-260} width={340} height={520} rx={40} fill="rgba(5,5,6,.9)" stroke={N.cianClaro} strokeWidth={5} style={glow(N.cian, 8)} />
        <g transform={`rotate(${rot})`}>
          <path d={Array.from({ length: 80 }, (_, i) => { const a = i * 0.32, r = i * 1.9; return `${i ? "L" : "M"}${r * Math.cos(a)},${r * Math.sin(a)}`; }).join(" ")} fill="none" stroke={N.violeta} strokeWidth={5} style={glow(N.violeta, 10)} />
        </g>
        {/* el ojo que mira, pegado */}
        <g transform="translate(0,330)"><path d="M-80,0 Q0,-56 80,0 Q0,56 -80,0 Z" fill="rgba(5,5,6,.9)" stroke="#e6eeff" strokeWidth={4} /><circle r={22} fill="none" stroke={N.violeta} strokeWidth={4} /><circle r={9} fill="#e6eeff" /></g>
      </svg>
      <Texto x={1000} y={-320} t0={E34.looking} texto="keep you *looking*" size={50} color={N.violeta} />
    </>
  );
};
const CulpaSeVa: React.FC = () => {
  const t = useT();
  if (t < E34.understand - 0.4) return null;
  const sube = ramp(t, E34.blaming + 0.2, 1.4, easeOut);
  const enco = 1 - sube;
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 60)} opacity={ramp(t, E34.understand - 0.4, 0.4)}>
        <g transform={`translate(0,${40 * enco}) rotate(${-6 * enco})`}><Persona x={0} y={120} s={1.3} c="#e6eeff" /></g>
        {/* la bolsa de la culpa: aplasta y después se va flotando */}
        <g transform={`translate(${lerp(0, 120, sube)},${lerp(-120 + 30 * enco, -420, sube)}) rotate(${10 * sube})`} opacity={1 - ramp(t, E34.blaming + 1.2, 0.5)} style={glow(N.rojo, 8)}>
          <path d="M-110,-60 L110,-60 L130,60 L-130,60 Z" fill="rgba(5,5,6,.9)" stroke={N.rojoBorde} strokeWidth={4} />
          <text y={4} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={36} fill={N.rojoBorde}>MY FAULT</text>
        </g>
        {/* luz de comprensión */}
        <circle cx={0} cy={-40} r={lerp(0, 220, ramp(t, E34.understand, 0.8))} fill="none" stroke={N.oroClaro} strokeWidth={2} opacity={0.5 * (1 - ramp(t, E34.understand + 0.8, 0.6))} />
      </svg>
      <Texto x={1900} y={-310} t0={E34.understand} texto="when you *understand*" size={50} color={N.oroClaro} t1={E34.blaming} />
      <Texto x={1900} y={-310} t0={E34.blaming} texto="stop *blaming yourself*" size={50} />
    </>
  );
};
const ConTuMente: React.FC = () => {
  const t = useT();
  if (t < E34.working - 0.4) return null;
  const k = ramp(t, E34.working, 0.8, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(2800, 60)} opacity={ramp(t, E34.working - 0.4, 0.3)}>
        <Persona x={lerp(-260, -110, k)} y={120} s={1.2} />
        <g transform={`translate(${lerp(260, 110, k)},-10) scale(0.32)`}><path d={CEREBRO} fill="rgba(203,251,255,.06)" stroke={N.cianClaro} strokeWidth={10} style={glow(N.cian, 8)} /></g>
        <path d={`M${lerp(-200, -60, k)},40 Q0,${lerp(40, 0, k)} ${lerp(200, 60, k)},40`} fill="none" stroke={N.oroClaro} strokeWidth={5} opacity={k} style={glow(N.oro, 10)} />
      </svg>
      <Texto x={2800} y={-280} t0={E34.working} texto="work *with* your mind" size={54} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 34
const H34: React.FC = () => (
  <>
    <Png id="manos_celus" x={560} y={60} w={360} t0={E34.thousands} glow={N.cian} />
    <Png id="hipnosis" x={1430} y={40} w={300} t0={E34.looking} glow={N.violeta} />
    <Png id="vela" x={2370} y={80} w={200} t0={E34.blaming} glow={N.oro} />
    <Png id="llave" x={2330} y={60} w={220} t0={E34.working} glow={N.oro} />
  </>
);
const Escena34: React.FC = () => <EscenaMundo tomas={tomas34}><MilesContraUno /><Hipnosis /><CulpaSeVa /><ConTuMente /><H34 /></EscenaMundo>;

// ═════════ HUB 35 · "instead of against it. There is an old story that I like to tell my students." ═════════
const ConContra: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.4, 0.6, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[]}>
      <path d="M-80,-24 L60,-24 M40,-44 L64,-24 L40,-4" fill="none" stroke={N.oroClaro} strokeWidth={6} strokeLinecap="round" />
      <g transform={`rotate(${lerp(180, 0, k)} 0 24)`}><path d="M-80,24 L60,24 M40,4 L64,24 L40,44" fill="none" stroke={k < 0.9 ? N.rojoBorde : N.oroClaro} strokeWidth={6} strokeLinecap="round" /></g>
    </Glifo>
  );
};
const Pergamino2: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.2, 0.7, easeOut);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[]}>
      <rect x={-70} y={-70 * k} width={140} height={140 * k} fill="rgba(255,200,120,.08)" stroke={N.oro} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M-50,${-40 + i * 26} L${30 + (i % 2) * 18},${-40 + i * 26}`} stroke={N.oroClaro} strokeWidth={3} opacity={k > 0.3 + i * 0.15 ? 1 : 0} />)}
      <rect x={-84} y={-70 * k - 14} width={168} height={22} rx={11} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={3} />
      <rect x={-84} y={70 * k - 8} width={168} height={22} rx={11} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={3} />
    </Glifo>
  );
};
const Alumnos: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={TRIBU} trazos={[]}>
    {[-56, 0, 56].map((x, i) => <g key={i}><ellipse cx={x} cy={60} rx={26} ry={9} fill="rgba(255,42,72,.2)" stroke={N.rojoBorde} strokeWidth={2.5} /><g transform={`translate(${x},${54}) scale(0.5)`}><circle cx={0} cy={-90} r={24} fill="none" stroke={TRIBU} strokeWidth={5} /><path d="M-40,20 Q-40,-60 0,-62 Q40,-60 40,20 Z" fill="none" stroke={TRIBU} strokeWidth={5} /></g></g>)}
  </Glifo>
);

// ═════════ ESCENA 35 · la selva · cazar monos · el coco · el agujero · justo para una mano abierta ═════════
const E35 = { caught: T("people once caught", 593), forest: T("the forest", 595), hunters: T("The hunters", 596.5), coconut: T("took a coconut", 597), hole: T("small hole", 599), big: T("big enough", 600.5), hand: T("open hand", 602) };
const tomas35: Toma[] = [[593.2, 0, 0, 1.0], [596.6, 0, 0, 1.06], [597.1, 950, 0, 1.08], [600.4, 950, 0, 1.18], [600.9, 1800, 0, 1.1], [603.7, 1800, 0, 1.22]];
const Selva: React.FC = () => {
  const t = useT();
  const mono = ramp(t, E35.caught + 0.3, 0.5);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)} opacity={ramp(t, 593, 0.5)}>
        {[[-480, 1.1], [-260, 0.8], [-40, 1.25], [200, 0.9], [440, 1.05]].map(([x, s], i) => <g key={i} transform={`translate(${x},180) scale(${s})`} opacity={ramp(t, 593 + i * 0.15, 0.4)} style={glow(N.verde, 6)}>
          <path d="M-10,0 L-8,-200 M10,0 L8,-200" stroke={N.verde} strokeWidth={4} />
          <path d={`M0,-200 Q-120,-${230 + 10 * Math.sin(t + i)} -150,-150 M0,-200 Q120,-${230 + 10 * Math.cos(t + i)} 150,-150 M0,-200 Q-70,-280 -100,-260 M0,-200 Q70,-280 100,-260`} fill="none" stroke={N.verde} strokeWidth={4} />
        </g>)}
        {/* liana con el mono */}
        <path d={`M150,-300 Q${170 + 20 * Math.sin(t * 1.4)},-160 ${160 + 40 * Math.sin(t * 1.4)},-60`} fill="none" stroke={N.verde} strokeWidth={4} />
        <g transform={`translate(${160 + 40 * Math.sin(t * 1.4)},-10) scale(1.8)`} opacity={mono} style={glow(N.oro, 6)}>
          <circle cx={0} cy={-10} r={22} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} />
          <circle cx={-22} cy={-16} r={9} fill="none" stroke={N.oroClaro} strokeWidth={3} /><circle cx={22} cy={-16} r={9} fill="none" stroke={N.oroClaro} strokeWidth={3} />
          <ellipse cx={0} cy={36} rx={20} ry={28} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} />
          <path d="M-14,20 Q-20,-20 -10,-40 M18,60 Q50,70 48,30" fill="none" stroke={N.oroClaro} strokeWidth={3} />
        </g>
      </svg>
      <Texto x={0} y={-310} t0={E35.caught} texto="how people once caught *monkeys*" size={48} color={N.oroClaro} />
    </>
  );
};
const Coco: React.FC = () => {
  const t = useT();
  if (t < E35.hunters - 0.4) return null;
  const corte = ramp(t, E35.hole + 0.1, 0.9);
  const ang = corte * Math.PI * 2;
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E35.hunters - 0.4, 0.4)}>
        {/* cazador (silueta anónima) */}
        <g transform="translate(-260,40)"><Persona x={0} y={140} s={1.6} c={N.texto2} /><path d="M40,0 Q120,40 170,20" fill="none" stroke={N.texto2} strokeWidth={8} strokeLinecap="round" opacity={ramp(t, E35.coconut, 0.3)} /></g>
        {/* el coco */}
        <g transform={`translate(${lerp(-60, 120, ramp(t, E35.coconut + 0.1, 0.5, easeOut))},40)`} opacity={ramp(t, E35.coconut, 0.3)}>
          <ellipse rx={130} ry={115} fill="rgba(140,90,40,.25)" stroke="#c99a5b" strokeWidth={5} style={glow("#c99a5b", 8)} />
          {[[-50, -40], [-20, 30], [40, -60], [60, 30], [-70, 40]].map(([x, y], i) => <path key={i} d={`M${x},${y} l18,8`} stroke="#c99a5b" strokeWidth={2} opacity={0.7} />)}
          {/* el agujero se va cortando */}
          {corte > 0 && <path d={`M28,-10 A28,28 0 ${ang > Math.PI ? 1 : 0} 1 ${28 * Math.cos(ang)},${-10 + 28 * Math.sin(ang)}`} transform="translate(-28,0)" fill="none" stroke={N.oroClaro} strokeWidth={5} style={glow(N.oro, 10)} />}
          {corte >= 1 && <circle cx={0} cy={-10} r={28} fill="#000" stroke={N.oroClaro} strokeWidth={3} />}
          {/* cuchillo */}
          {corte > 0 && corte < 1 && <g transform={`translate(${28 * Math.cos(ang) - 28},${-10 + 28 * Math.sin(ang)}) rotate(-40)`}><path d="M0,0 L50,-8 L50,8 Z" fill="#e6eeff" /><rect x={50} y={-6} width={44} height={12} rx={3} fill="#8a6a3a" /></g>}
        </g>
      </svg>
      <Texto x={950} y={-300} t0={E35.coconut} texto="a *coconut*" size={56} color="#e8c48a" t1={E35.hole} />
      <Texto x={950} y={-300} t0={E35.hole} texto="a *small* hole" size={56} color={N.oroClaro} />
    </>
  );
};
const ManoAbierta: React.FC = () => {
  const t = useT();
  if (t < E35.big - 0.5) return null;
  const entra = ramp(t, E35.hand, 0.8, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(1800, 40)} opacity={ramp(t, E35.big - 0.5, 0.4)}>
        {/* el agujero en primer plano con su medida */}
        <ellipse cx={0} cy={60} rx={260} ry={230} fill="rgba(140,90,40,.18)" stroke="#c99a5b" strokeWidth={5} />
        <circle cx={0} cy={60} r={96} fill="#000" stroke={N.oroClaro} strokeWidth={4} style={glow(N.oro, 10)} />
        <path d="M-96,-200 L96,-200 M-96,-210 L-96,-190 M96,-210 L96,-190" stroke={N.cianClaro} strokeWidth={3} opacity={ramp(t, E35.big, 0.3)} />
        {/* la mano abierta, de canto, que entra justo */}
        <g transform={`translate(0,${lerp(-260, 40, entra)})`} style={glow("#fff", 6)}>
          <path d="M-60,-200 L-60,-20 Q-70,-80 -80,-60 L-70,20 Q-40,90 0,90 Q60,90 70,20 L70,-120 Q60,-140 50,-120 L50,-40 L50,-170 Q40,-190 28,-170 L28,-50 L28,-190 Q16,-210 4,-190 L4,-50 L4,-170 Q-8,-190 -20,-170 L-20,-40" fill="rgba(5,5,6,.85)" stroke="#e6eeff" strokeWidth={4} transform="scale(0.85)" />
        </g>
        <text x={0} y={-220} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={24} fill={N.cianClaro} opacity={ramp(t, E35.big, 0.3)}>just enough</text>
      </svg>
      <Texto x={1800} y={-300} t0={E35.hand} texto="a monkey's *open hand*" size={52} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 35
const H35: React.FC = () => (
  <>
    <Png id="mono" x={470} y={80} w={280} t0={E35.caught} glow={N.oro} />
    <Png id="coco" x={1380} y={60} w={260} t0={E35.coconut} glow={N.oro} />
    <Png id="cuchillo" x={1500} y={-60} w={120} t0={E35.hole} glow={N.cian} />
    <Png id="mano_abierta" x={2270} y={60} w={320} t0={E35.hand} glow={N.cian} />
  </>
);
const Escena35: React.FC = () => <EscenaMundo tomas={tomas35}><Selva /><Coco /><ManoAbierta /><H35 /></EscenaMundo>;

export const SEGS_M09: Seg[] = [
  {
    hub: { portal: "maq", orbs: [
      { id: "gmaybe", t: T("The maybe makes", 538), ang: 198, anillo: 1, tam: 170, D: GearMaybe },
      { id: "glever", t: T("The lever", 539.5), ang: 128, anillo: 2, tam: 170, D: GearLever },
      { id: "maq", t: T("the whole machine", 535), ang: -14, anillo: 0, tam: 240, D: Maquina },
    ] },
    Escena: Escena32,
    sonidos: (s) => { s.add("palanca", E32.effort + 0.2, 0.6); s.add("vuelo", 543.1, 0.5); s.add("rodillos", E32.reel, 0.4); [0, 1, 2, 3, 4, 5].forEach((i) => s.add("cierre", E32.door + i * 0.22, 0.35)); s.add("vuelo", 546.9, 0.5); s.add("aviso", E32.red, 0.5); s.add("traza", E32.red + 0.2, 0.5); s.add("latido", E32.fear); s.add("vacio", E32.alone, 0.6); },
  },
  {
    hub: { portal: "bolsillo", orbs: [
      ...[0, 1, 2, 3].map((i) => ({ id: "g" + i, t: T("Four gears", 552.5) + i * 0.25, ang: 150 + i * 50, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 140, D: GearN(i) })),
      { id: "dia", t: T("all day long", 554), ang: 60, anillo: 2, tam: 150, D: SolLuna },
      { id: "bolsillo", t: T("in your pocket", 556.5), ang: -14, anillo: 0, tam: 240, D: Bolsillo },
    ] },
    Escena: Escena33,
    sonidos: (s) => { s.add("vidrio", E33.clear, 0.5); s.add("vuelo", 561.4, 0.5); s.add("traza", E33.weak + 0.4, 0.6); s.add("grieta", E33.broken - 0.2, 0.5); s.add("cierre", E33.broken + 1.2, 0.6); s.add("vuelo", 565.3, 0.5); s.add("traza", E33.brain, 0.5); s.add("premio", E33.built + 0.2, 0.5); },
  },
  {
    hub: { portal: "fogata", orbs: [
      { id: "bayas", t: T("berries and lions", 569), ang: 198, anillo: 1, tam: 160, D: Bayas2, png: "bayas" },
      { id: "leon", t: T("and lions", 569), ang: 128, anillo: 2, tam: 170, D: Leon },
      { id: "fogata", t: T("around a fire", 572), ang: -14, anillo: 0, tam: 240, D: FogataHub, png: "fogata" },
    ] },
    Escena: Escena34,
    sonidos: (s) => { s.add("maquinaGira", E34.machine, 0.5); s.add("digito", E34.thousands, 0.5); s.add("vuelo", 579.9, 0.5); s.add("sinapsis", E34.looking, 0.5); s.add("vuelo", 582.2, 0.5); s.add("luz", E34.understand, 0.5); s.add("ola", E34.blaming + 0.2, 0.5); s.add("vuelo", 586.7, 0.5); s.add("cierre", E34.working + 0.6, 0.5); },
  },
  {
    hub: { portal: "perg", orbs: [
      { id: "contra", t: T("instead of against", 587), ang: 198, anillo: 1, tam: 160, D: ConContra },
      { id: "perg", t: T("an old story", 589), ang: -14, anillo: 0, tam: 240, D: Pergamino2, png: "pergamino" },
      { id: "alumnos", t: T("my students", 591.5), ang: 128, anillo: 2, tam: 170, D: Alumnos },
    ] },
    Escena: Escena35,
    sonidos: (s) => { s.add("aparece", E35.caught + 0.3, 0.5); s.add("vuelo", 597.1, 0.5); s.add("toque", E35.coconut + 0.4, 0.6); s.add("traza", E35.hole + 0.1, 0.6); s.add("vuelo", 600.9, 0.5); s.add("tiron", E35.hand, 0.5); },
  },
];
