// gb01 v2 · MINUTO 13 (ventanas 48-51, 803-870 s): pará y notá · ¿dónde sentís las ganas? (mapa del cuerpo) · respirá · mirala
// como una ola que llega a la playa · el secreto: la gana sube, hace pico y baja en 1-2 min · la autopista se angosta, tu camino
// se ensancha · no hace falta ser perfecto · ni tirar el celular al río · ola tras ola · semanas · la tragamonedas se vuelve herramienta.
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
const MAR = N.cian;
const tel = (w: number, h: number, r = 18) => `M${-w / 2 + r},${-h / 2} L${w / 2 - r},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + r} L${w / 2},${h / 2 - r} Q${w / 2},${h / 2} ${w / 2 - r},${h / 2} L${-w / 2 + r},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - r} L${-w / 2},${-h / 2 + r} Q${-w / 2},${-h / 2} ${-w / 2 + r},${-h / 2} Z`;
// cuerpo entero (silueta) en coordenadas locales, alto ~520
const CUERPO = "M0,-260 Q34,-260 34,-222 Q34,-186 0,-184 Q-34,-186 -34,-222 Q-34,-260 0,-260 Z M-70,-160 Q0,-180 70,-160 Q96,-150 100,-110 L120,40 Q122,56 108,58 Q96,58 92,44 L74,-80 L70,80 L60,250 Q58,262 44,262 Q30,262 30,250 L20,90 L-20,90 L-30,250 Q-30,262 -44,262 Q-58,262 -60,250 L-70,80 L-74,-80 L-92,44 Q-96,58 -108,58 Q-122,56 -120,40 L-100,-110 Q-96,-150 -70,-160 Z";
// una ola: y(x) para dibujar el mar
const olaPath = (x0: number, x1: number, y: (x: number) => number, base = 300) => { let d = `M${x0},${base}`; for (let x = x0; x <= x1; x += 20) d += ` L${x},${y(x).toFixed(1)}`; return d + ` L${x1},${base} Z`; };

// ═════════ HUB 48 · "Just stop and notice. Where do you feel the urge?" ═════════
const PalmaStop: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-40,80 L-40,-20 M-40,-20 L-40,-70 M-14,-20 L-14,-90 M12,-20 L12,-92 M38,-20 L38,-70 M-40,80 L44,80 L44,-20 M-40,0 Q-70,-10 -76,-40", a: 3 }]} />
);
const OjoNota: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-80,0 Q0,-56 80,0 Q0,56 -80,0 Z", a: 2.6 }, { d: circ(0, 0, 20), a: 2.6 }]}>
    <circle r={8 + 2 * Math.sin(t * 3)} fill={N.cianClaro} />
  </Glifo>
);
const CuerpoHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[]}>
    <g transform="scale(0.34)"><path d={CUERPO} fill="rgba(5,5,6,.85)" stroke={PIEL} strokeWidth={8} /></g>
    {[[38, 14], [0, -40], [0, -76]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={N.rojo} opacity={(Math.sin(t * 4 + i * 2) + 1) / 2} style={glow(N.rojo, 8)} />)}
  </Glifo>
);

// ═════════ ESCENA 48 · ¿en la mano? ¿en el pecho? ¿detrás de los ojos? · respirá despacio · como una ola que llega a la playa · el secreto ═════════
const E48 = { hand: T("In your hand", 807.5), chest: T("In your chest", 808.5), eyes: T("behind your eyes", 810.5), breathe: T("Breathe once", 811.5), slowly: T("slowly, and", 813.5), wave: T("watch a wave", 815), beach: T("the beach", 817.5), secret: T("the secret", 819) };
const tomas48: Toma[] = [[807.8, 0, 0, 1.0], [811.6, 0, 0, 1.0], [812.0, 950, 0, 1.08], [815.0, 950, 0, 1.0], [815.4, 1900, 0, 1.02], [819.2, 1900, 0, 1.0], [820.4, 1900, 0, 1.1]];
const MapaCuerpo: React.FC = () => {
  const t = useT();
  const P = [{ x: 108, y: 30, t0: E48.hand, l: "hand?" }, { x: 0, y: -110, t0: E48.chest, l: "chest?" }, { x: 0, y: -224, t0: E48.eyes, l: "eyes?" }];
  return (
    <>
      <svg width={1} height={1} style={abs(0, 60)}>
        <path d={CUERPO} fill="rgba(5,5,6,.85)" stroke={PIEL} strokeWidth={4} style={glow(PIEL, 5)} />
        {P.map((p, i) => {
          const on = neonOn(t, p.t0 + 0.1), jit = i === 2 ? 3 * Math.sin(t * 40) : 0;
          return <g key={i} opacity={ramp(t, p.t0, 0.25)}>
            <circle cx={p.x + jit} cy={p.y} r={18 + 6 * Math.sin(t * 6 + i)} fill={N.rojo} opacity={0.8 * on} style={glow(N.rojo, 16)} />
            {[0, 1].map((k) => { const r = ((t * 60 + k * 40) % 80); return <circle key={k} cx={p.x} cy={p.y} r={20 + r} fill="none" stroke={N.rojo} strokeWidth={2} opacity={1 - r / 80} />; })}
            <path d={`M${p.x + 30},${p.y} L${p.x + 170 - (i === 0 ? 0 : 60)},${p.y}`} stroke={N.rojoBorde} strokeWidth={2} />
            <text x={p.x + 180 - (i === 0 ? 0 : 60)} y={p.y} dominantBaseline="central" fontFamily="serif" fontStyle="italic" fontSize={34} fill={N.rojoBorde}>{p.l}</text>
          </g>;
        })}
      </svg>
      <Texto x={0} y={-340} t0={E48.hand} texto="where do you feel the *urge*?" size={46} color={N.rojoBorde} />
    </>
  );
};
const Respira: React.FC = () => {
  const t = useT();
  if (t < E48.breathe - 0.5) return null;
  const f = (Math.sin((t - E48.breathe) * 1.3 - Math.PI / 2) + 1) / 2;
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E48.breathe - 0.5, 0.4)}>
        <circle r={lerp(90, 240, f)} fill={`rgba(80,200,255,${0.05 + 0.06 * f})`} stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 12)} />
        <circle r={lerp(60, 200, f)} fill="none" stroke={N.cian} strokeWidth={2} opacity={0.5} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily="serif" fontStyle="italic" fontSize={46} fill={N.cianClaro}>{f > 0.5 ? "in" : "out"}</text>
      </svg>
      <Texto x={950} y={-310} t0={E48.breathe} texto="breathe once, *slowly*" size={52} color={N.cianClaro} />
    </>
  );
};
const Playa: React.FC = () => {
  const t = useT();
  if (t < E48.wave - 0.6) return null;
  const llega = ((t - E48.wave) * 0.35) % 1;
  const y = (x: number) => 120 + 30 * Math.sin(x / 70 + t * 2) - 120 * Math.exp(-((x - lerp(-500, 380, llega)) ** 2) / 14000) * (1 - llega * 0.7);
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 40)} opacity={ramp(t, E48.wave - 0.6, 0.4)}>
        <path d="M200,300 Q340,140 480,120 L480,300 Z" fill="rgba(255,210,140,.12)" stroke={N.oroClaro} strokeWidth={3} />
        <path d={olaPath(-480, 420, y)} fill="rgba(80,200,255,.12)" stroke={MAR} strokeWidth={4} style={glow(MAR, 10)} />
        <g transform="translate(380,150)"><circle cx={0} cy={-80} r={22} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} /><path d="M-36,20 Q-36,-46 0,-48 Q36,-46 36,20 Z" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} /></g>
        <g transform="translate(0,-230)" opacity={ramp(t, E48.secret, 0.3)} style={glow(N.oro, 10)}>
          <circle cx={-40} r={26} fill="none" stroke={N.oroClaro} strokeWidth={6} /><path d="M-14,0 L70,0 M50,0 L50,20 M64,0 L64,16" stroke={N.oroClaro} strokeWidth={6} strokeLinecap="round" />
        </g>
      </svg>
      <Texto x={1900} y={-320} t0={E48.wave} texto="like a wave toward the *beach*" size={48} color={N.cianClaro} t1={E48.secret} />
      <Texto x={1900} y={-320} t0={E48.secret} texto="here is the *secret*" size={56} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 48
const H48: React.FC = () => (
  <>
    <Png id="pulmones" x={1390} y={60} w={250} t0={E48.breathe} glow={N.cian} />
    <Png id="playa" x={2370} y={80} w={300} t0={E48.wave} glow={N.cian} />
  </>
);
const Escena48: React.FC = () => <EscenaMundo tomas={tomas48}><MapaCuerpo /><Respira /><Playa /><H48 /></EscenaMundo>;

// ═════════ HUB 49 · "An urge is like a wave. It rises," ═════════
const PicoRojo: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-90,50 L-40,50 L-20,-70 L0,60 L20,20 L90,20", a: 3 }]} />
);
const Sube: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MAR} trazos={[{ d: "M-80,60 Q-20,60 0,-20 Q20,-80 60,-60", a: 3 }, { d: "M40,-80 L62,-60 L36,-44", a: 3 }]} />
);
const OlaHub: D = ({ t, t0, on, tam }) => {
  const y = (x: number) => 30 - 50 * Math.exp(-(x ** 2) / 1500) * (0.6 + 0.4 * Math.sin(t * 2)) + 6 * Math.sin(x / 14 + t * 3);
  return <Glifo t={t} t0={t0} on={on} tam={tam} color={MAR} trazos={[]}><path d={olaPath(-90, 90, y, 70)} fill="rgba(80,200,255,.15)" stroke={MAR} strokeWidth={4} /></Glifo>;
};

// ═════════ ESCENA 49 · sube, hace pico, baja si no la alimentás · en uno o dos minutos · cada ola que mirás pasar sin obedecer ═════════
const E49 = { peak: T("reaches a peak", 823), feed: T("do not feed", 826.5), falls: T("it falls", 827.5), minute: T("a minute or", 829.5), every: T("Every time", 831), pass: T("wave pass without", 831), obey: T("obeying it", 833.5) };
const tomas49: Toma[] = [[824.2, 0, 0, 1.02], [831.1, 0, 0, 0.96], [831.5, 1050, 0, 1.08], [834.9, 1050, 0, 1.12]];
const Curva: React.FC = () => {
  const t = useT();
  const W = 860, x0 = -430;
  const f = (u: number) => Math.exp(-((u - 0.4) ** 2) / 0.045); // 0..1
  const prog = ramp(t, 823.9, 0.4) * lerp(0.25, 1, ramp(t, E49.peak - 0.6, E49.falls + 1 - (E49.peak - 0.6)));
  const pts = Array.from({ length: 61 }, (_, i) => i / 60).filter((u) => u <= prog);
  const d = pts.map((u, i) => `${i ? "L" : "M"}${(x0 + u * W).toFixed(1)},${(180 - 320 * f(u)).toFixed(1)}`).join(" ");
  const u = pts[pts.length - 1] ?? 0;
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <path d={`M${x0},180 L${x0 + W},180 M${x0},180 L${x0},-180`} stroke={N.gris} strokeWidth={3} />
        <text x={x0 - 12} y={-170} textAnchor="end" fontFamily="sans-serif" fontWeight={800} fontSize={22} fill={N.texto2}>urge</text>
        <path d={d} fill="none" stroke={MAR} strokeWidth={6} style={glow(MAR, 12)} />
        <circle cx={x0 + u * W} cy={180 - 320 * f(u)} r={12} fill={N.cianClaro} />
        <text x={x0 + 0.4 * W} y={-170} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={30} fill={N.cianClaro} opacity={ramp(t, E49.peak, 0.3)}>peak</text>
        <g opacity={ramp(t, E49.minute, 0.3)}>
          <path d={`M${x0 + 0.05 * W},230 L${x0 + 0.85 * W},230 M${x0 + 0.05 * W},218 L${x0 + 0.05 * W},242 M${x0 + 0.85 * W},218 L${x0 + 0.85 * W},242`} stroke={N.oroClaro} strokeWidth={3} />
          <text x={x0 + 0.45 * W} y={276} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={34} fill={N.oroClaro}>1–2 min</text>
        </g>
        {/* lo que la alimentaría: un celular tachado */}
        <g transform={`translate(${x0 + 0.62 * W},-40)`} opacity={ramp(t, E49.feed, 0.3) * (1 - ramp(t, E49.minute, 0.4))}><path d={tel(50, 86, 10)} fill="none" stroke={N.rojoBorde} strokeWidth={3} /><path d="M-40,-50 L40,50" stroke={N.rojo} strokeWidth={5} /></g>
      </svg>
      <Texto x={0} y={-320} t0={E49.peak} texto="it rises, *peaks*, and falls" size={50} color={N.cianClaro} />
    </>
  );
};
const MirarPasar: React.FC = () => {
  const t = useT();
  if (t < E49.every - 0.5) return null;
  const pasa = ramp(t, E49.pass - 0.3, 2.0);
  const y = (x: number) => 140 + 18 * Math.sin(x / 60 + t * 2) - 170 * Math.exp(-((x - lerp(-600, 600, pasa)) ** 2) / 16000);
  return (
    <>
      <svg width={1} height={1} style={abs(1050, 40)} opacity={ramp(t, E49.every - 0.5, 0.4)}>
        <path d={olaPath(-500, 500, y)} fill="rgba(80,200,255,.12)" stroke={MAR} strokeWidth={4} style={glow(MAR, 10)} />
        {/* el observador en una roca, sereno, no se tira */}
        <path d="M-80,90 Q0,40 80,90 Z" fill="rgba(5,5,6,.95)" stroke={N.texto2} strokeWidth={3} transform="translate(0,-40)" />
        <g transform="translate(0,20)"><circle cx={0} cy={-120} r={24} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} /><path d="M-50,10 Q-50,-80 0,-84 Q50,-80 50,10 Z" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} /></g>
        <text x={0} y={-200} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={32} fill={N.oroClaro} opacity={ramp(t, E49.obey, 0.3)}>just watching</text>
      </svg>
      <Texto x={1050} y={-310} t0={E49.pass} texto="watch it pass *without obeying*" size={48} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 49
const H49: React.FC = () => (
  <>
    <Png id="ojo" x={1510} y={60} w={240} t0={E49.every} glow={N.cian} />
  </>
);
const Escena49: React.FC = () => <EscenaMundo tomas={tomas49}><Curva /><MirarPasar /><H49 /></EscenaMundo>;

// ═════════ HUB 50 · "the highway in your brain gets a little narrower, and the path to your own choice gets a little wider." ═════════
const AutopistaAngosta: D = ({ t, t0, on, tam }) => {
  const w = lerp(70, 22, ramp(t, t0 + 0.4, 1.4));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojoBorde} trazos={[]}>
      <path d={`M${-w},90 L${-w * 0.3},-90 L${w * 0.3},-90 L${w},90 Z`} fill="rgba(255,42,72,.1)" stroke={N.rojoBorde} strokeWidth={3} />
      <path d="M0,80 L0,60 M0,30 L0,10 M0,-20 L0,-40" stroke={N.rojoBorde} strokeWidth={3} />
    </Glifo>
  );
};
const CaminoAncho: D = ({ t, t0, on, tam }) => {
  const w = lerp(12, 60, ramp(t, t0 + 0.4, 1.4));
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[]}>
      <path d={`M${-w},90 Q${-w - 30},0 ${-w * 0.4},-90 L${w * 0.4},-90 Q${w - 30},0 ${w},90 Z`} fill="rgba(80,255,170,.1)" stroke={N.verde} strokeWidth={3} />
    </Glifo>
  );
};
const Bifurca: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M0,90 L0,10 Q0,-20 -50,-80 M0,10 Q0,-20 50,-80", a: 1.6, c: N.gris }]}>
    <path d="M0,90 L0,10 Q0,-20 -50,-80" fill="none" stroke={N.rojoBorde} strokeWidth={lerp(14, 4, ramp(t, t0 + 0.3, 1))} />
    <path d="M0,10 Q0,-20 50,-80" fill="none" stroke={N.verde} strokeWidth={lerp(4, 14, ramp(t, t0 + 0.3, 1))} style={glow(N.verde, 8)} />
  </Glifo>
);

// ═════════ ESCENA 50 · no hace falta ser perfecto · ni tirarlo al río · ola tras ola · en unas semanas · algo raro ═════════
const E50 = { perfect: T("to be perfect", 841.5), throw: T("throw your phone", 843.5), river: T("the river", 844), one: T("begin with one", 846.5), another: T("then another", 848), weeks: T("In a few", 849.5), strange: T("something strange", 851) };
const tomas50: Toma[] = [[841.3, 0, 0, 1.06], [843.4, 0, 0, 1.0], [843.8, 950, 0, 1.06], [846.0, 950, 0, 1.0], [846.4, 1900, 0, 1.06], [849.5, 1900, 0, 1.0], [849.9, 2850, 0, 1.06], [852.6, 2850, 0, 1.12]];
const NoPerfecto: React.FC = () => {
  const t = useT();
  const tacha = ramp(t, E50.perfect + 0.3, 0.3);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <g transform="translate(0,-20)">
          <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={170} fill={N.texto2}>100%</text>
          <path d={`M-220,0 L${-220 + 440 * tacha},0`} stroke={N.rojo} strokeWidth={12} strokeLinecap="round" style={glow(N.rojo, 10)} />
        </g>
        <text y={170} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={56} fill={N.oroClaro} opacity={ramp(t, E50.perfect + 0.7, 0.4)} style={glow(N.oro, 8)}>just a little</text>
      </svg>
      <Texto x={0} y={-310} t0={E50.perfect} texto="you do not have to be *perfect*" size={50} />
    </>
  );
};
const AlRio: React.FC = () => {
  const t = useT();
  if (t < E50.throw - 0.5) return null;
  const vuela = ramp(t, E50.throw + 0.2, 1.0);
  const nope = pop(t, E50.river + 0.4, 8);
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E50.throw - 0.5, 0.4)}>
        <path d="M-460,170 Q-200,120 0,170 Q200,220 460,170 L460,280 L-460,280 Z" fill="rgba(80,200,255,.1)" stroke={MAR} strokeWidth={4} style={glow(MAR, 8)} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${-300 + i * 260 + ((t * 40) % 60)},${220 + i * 14} l60,0`} stroke={N.cianClaro} strokeWidth={2} opacity={0.6} />)}
        <g transform={`translate(${lerp(-300, 200, vuela)},${lerp(0, 150, vuela) - 260 * Math.sin(vuela * Math.PI)}) rotate(${vuela * 540})`}><path d={tel(60, 104, 12)} fill="rgba(5,5,6,.9)" stroke={N.cianClaro} strokeWidth={3} /></g>
        <g transform={`translate(0,-30) scale(${nope})`} style={glow(N.rojo, 12)}><circle r={130} fill="none" stroke={N.rojo} strokeWidth={10} /><path d="M-92,-92 L92,92" stroke={N.rojo} strokeWidth={10} /></g>
      </svg>
      <Texto x={950} y={-310} t0={E50.throw} texto="no need to throw it in the *river*" size={46} color={N.cianClaro} />
    </>
  );
};
const OlaTrasOla: React.FC = () => {
  const t = useT();
  if (t < E50.one - 0.5) return null;
  const marcas = [E50.one + 0.3, E50.another - 0.2, E50.another + 0.3, E50.another + 0.7, E50.another + 1.1].filter((x) => x <= t).length;
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 40)} opacity={ramp(t, E50.one - 0.5, 0.4)}>
        {Array.from({ length: 5 }, (_, i) => { const k = ramp(t, [E50.one + 0.3, E50.another - 0.2, E50.another + 0.3, E50.another + 0.7, E50.another + 1.1][i], 0.5, easeOut); return <path key={i} d={`M${-400 + i * 160},120 Q${-340 + i * 160},${120 - 110 * k} ${-280 + i * 160},120`} fill="rgba(80,200,255,.12)" stroke={MAR} strokeWidth={4} opacity={0.3 + 0.7 * k} style={glow(MAR, 8 * k)} />; })}
        <text y={250} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={60} fill={N.cianClaro}>{["", "1", "2", "3", "4", "5"][marcas]}</text>
      </svg>
      <Texto x={1900} y={-310} t0={E50.one} texto="one wave, then *another*" size={52} color={N.cianClaro} />
    </>
  );
};
const Semanas: React.FC = () => {
  const t = useT();
  if (t < E50.weeks - 0.5) return null;
  const hoja = Math.min(4, Math.floor(ramp(t, E50.weeks, 1.4) * 4.99));
  return (
    <>
      <svg width={1} height={1} style={abs(2850, 40)} opacity={ramp(t, E50.weeks - 0.5, 0.4)}>
        <rect x={-180} y={-160} width={360} height={320} rx={20} fill="rgba(5,5,6,.9)" stroke={PIEL} strokeWidth={4} />
        <rect x={-180} y={-160} width={360} height={70} rx={20} fill="rgba(255,42,72,.25)" stroke={N.rojo} strokeWidth={3} />
        <text y={-124} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={34} fill="#fff">week</text>
        <text y={50} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={150} fill={PIEL}>{hoja || 1}</text>
        <g transform="translate(240,-170)" opacity={ramp(t, E50.strange, 0.3)} style={glow(N.oro, 12)}><path d="M0,-40 L10,-10 L40,0 L10,10 L0,40 L-10,10 L-40,0 L-10,-10 Z" fill={N.oroClaro} /></g>
      </svg>
      <Texto x={2850} y={-310} t0={E50.weeks} texto="in a few *weeks*" size={54} t1={E50.strange} />
      <Texto x={2850} y={-310} t0={E50.strange} texto="something *strange*" size={56} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 50
const H50: React.FC = () => (
  <>
    <Png id="trofeo" x={440} y={60} w={230} t0={E50.perfect} glow={N.oro} />
    <Png id="celu" x={1390} y={60} w={200} t0={E50.throw} glow={N.cian} />
    <Png id="ola" x={2370} y={60} w={300} t0={E50.one} glow={N.cian} />
    <Png id="calendario" x={3290} y={60} w={240} t0={E50.weeks} glow={N.oro} />
  </>
);
const Escena50: React.FC = () => <EscenaMundo tomas={tomas50}><NoPerfecto /><AlRio /><OlaTrasOla /><Semanas /><H50 /></EscenaMundo>;

// ═════════ HUB 51 · "The phone will still be there in your pocket, but it will feel less like" ═════════
const BolsilloCel: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-70,-30 L70,-30 L70,40 Q70,90 0,90 Q-70,90 -70,40 Z", a: 2.6 }]}>
    <path d={tel(50, 90, 10)} transform="translate(0,-40)" fill="rgba(5,5,6,.95)" stroke={N.cianClaro} strokeWidth={3} />
    <path d="M-70,-30 L70,-30" stroke={PIEL} strokeWidth={3} />
  </Glifo>
);
const FantasmaSlot: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.gris} trazos={[{ d: "M-60,-70 L60,-70 L60,80 L-60,80 Z M-44,-40 L44,-40 L44,10 L-44,10 Z M60,-30 L80,-30 L80,-70", a: 2.2 }]}>
    <g opacity={0.4 + 0.3 * Math.sin(t * 2)}><TextoNeon y={-14} texto="7 7 ?" size={22} color={N.texto2} /></g>
  </Glifo>
);
const SlotACel: D = ({ t, t0, on, tam }) => {
  const m = (Math.sin(t * 1.6) + 1) / 2;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[]}>
      <rect x={lerp(-70, -46, m)} y={lerp(-80, -84, m)} width={lerp(140, 92, m)} height={lerp(160, 168, m)} rx={lerp(6, 16, m)} fill="rgba(5,5,6,.9)" stroke={m > 0.5 ? N.cianClaro : N.rojo} strokeWidth={4} />
      <path d={`M${lerp(70, 46, m)},-40 L${lerp(92, 46, m)},-40 L${lerp(92, 46, m)},-70`} fill="none" stroke={N.rojo} strokeWidth={3} opacity={1 - m} />
    </Glifo>
  );
};

// ═════════ ESCENA 51 · menos tragamonedas, más herramienta · lo agarrás cuando elegís, lo soltás cuando terminás · una última mirada al cerebro de vidrio ═════════
const E51 = { slot: T("slot machine and", 857), meant: T("meant to be", 859), tool: T("a tool", 860), pick: T("you pick up", 862), choose: T("when you choose", 863), down: T("and put down", 864), done: T("you are done", 865), look: T("Let us look", 867), glass: T("glass brain", 869) };
const tomas51: Toma[] = [[857.3, 0, 0, 1.04], [862.4, 0, 0, 1.0], [862.8, 950, 0, 1.06], [867.0, 950, 0, 1.0], [867.4, 1900, 0, 1.04], [870.3, 1900, 0, 1.14]];
const Herramienta: React.FC = () => {
  const t = useT();
  const m = ramp(t, E51.meant - 0.4, 1.4, easeOut);
  const ICON = [{ c: N.verde, d: "M-14,-6 Q-14,-20 0,-20 Q14,-20 14,-6 L14,14 L-14,14 Z" }, { c: N.oroClaro, d: "M-16,-12 L16,-12 L16,14 L-16,14 Z M-6,-12 L-2,-18 L6,-18 L10,-12" }, { c: N.cianClaro, d: "M0,-18 Q14,-18 14,-4 Q14,8 0,20 Q-14,8 -14,-4 Q-14,-18 0,-18 Z" }, { c: N.violeta, d: "M-16,-16 L16,-16 L16,16 L-16,16 Z M-16,-4 L16,-4" }];
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        {/* la tragamonedas se vuelve celular-herramienta */}
        <rect x={lerp(-230, -140, m)} y={lerp(-220, -250, m)} width={lerp(460, 280, m)} height={lerp(440, 500, m)} rx={lerp(20, 40, m)} fill="rgba(5,5,6,.9)" stroke={m > 0.5 ? N.cianClaro : N.rojo} strokeWidth={5} style={glow(m > 0.5 ? N.cian : N.rojo, 10)} />
        <g opacity={1 - m}>
          {[-1, 0, 1].map((i) => <rect key={i} x={i * 120 - 50} y={-120} width={100} height={130} rx={8} fill="none" stroke={N.oro} strokeWidth={3} />)}
          {[-1, 0, 1].map((i) => <text key={"s" + i} x={i * 120} y={-50} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={60} fill={N.oro}>{i === 1 ? "?" : "7"}</text>)}
          <path d="M230,-60 L290,-60 L290,-200" fill="none" stroke={N.rojo} strokeWidth={6} /><circle cx={290} cy={-210} r={20} fill={N.rojo} />
        </g>
        <g opacity={m}>
          {ICON.map((ic, i) => <g key={i} transform={`translate(${-60 + (i % 2) * 120},${-110 + Math.floor(i / 2) * 140}) scale(2)`}><rect x={-26} y={-26} width={52} height={52} rx={12} fill="rgba(5,5,6,.9)" stroke={ic.c} strokeWidth={2} /><path d={ic.d} fill="none" stroke={ic.c} strokeWidth={2.2} /></g>)}
          <text y={190} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={40} fill={N.cianClaro}>a tool</text>
        </g>
      </svg>
      <Texto x={0} y={-330} t0={E51.slot} texto="less like a *slot machine*" size={50} color={N.rojoBorde} t1={E51.tool} />
      <Texto x={0} y={-330} t0={E51.tool} texto="what it was meant to be: *a tool*" size={48} color={N.cianClaro} />
    </>
  );
};
const AgarraSuelta: React.FC = () => {
  const t = useT();
  if (t < E51.pick - 0.5) return null;
  const sube = ramp(t, E51.choose - 0.2, 0.6, easeOut), baja = ramp(t, E51.done - 0.2, 0.6, easeOut);
  const y = lerp(150, -60, sube) + lerp(0, 210, baja);
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E51.pick - 0.5, 0.4)}>
        <path d="M-400,210 L400,210" stroke={N.oroClaro} strokeWidth={5} style={glow(N.oro, 6)} />
        <g transform={`translate(0,${y}) rotate(${lerp(90, 0, sube) + lerp(0, 90, baja)})`}><path d={tel(90, 160, 14)} fill="rgba(5,5,6,.9)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 6)} /></g>
        {/* mano que entra y sale con el celular */}
        <g transform={`translate(${lerp(90, 70, sube)},${y + 10})`} opacity={sube * (1 - ramp(t, E51.done + 0.6, 0.4))}><path d="M40,-30 L180,-40 L190,40 L40,40" fill="rgba(5,5,6,.85)" stroke={PIEL} strokeWidth={4} /></g>
        <text x={-260} y={-140} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={40} fill={N.verde} opacity={ramp(t, E51.choose, 0.3)}>you choose</text>
        <text x={260} y={-140} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={40} fill={N.oroClaro} opacity={ramp(t, E51.done, 0.3)}>you're done</text>
      </svg>
      <Texto x={950} y={-310} t0={E51.pick} texto="pick it up, *put it down*" size={50} />
    </>
  );
};
const CerebroFinal: React.FC = () => {
  const t = useT();
  if (t < E51.look - 0.5) return null;
  const k = ramp(t, E51.look, 1.4, easeOut);
  const COL = [N.violeta, N.oro, N.cian, N.rojo];
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 40)} opacity={ramp(t, E51.look - 0.5, 0.4)}>
        <path d="M-300,40 Q-340,-180 -140,-230 Q0,-300 160,-240 Q340,-200 330,-20 Q340,120 180,160 Q90,230 -20,196 Q-230,220 -300,40 Z" fill="rgba(203,251,255,.05)" stroke={N.cianClaro} strokeWidth={5} strokeDasharray="2000" strokeDashoffset={2000 * (1 - k)} style={glow(N.cian, 14)} />
        {COL.map((c, i) => <circle key={i} cx={-150 + i * 100} cy={-20 + (i % 2) * 50} r={36} fill="none" stroke={c} strokeWidth={8} strokeDasharray="10 8" opacity={ramp(t, E51.glass + i * 0.15, 0.3)} transform={`rotate(${(i % 2 ? -1 : 1) * t * 60} ${-150 + i * 100} ${-20 + (i % 2) * 50})`} />)}
      </svg>
      <Texto x={1900} y={-320} t0={E51.look} texto="one last look at the *glass brain*" size={48} color={N.cianClaro} />
    </>
  );
};
// objetos de vidrio de la escena 51
const H51: React.FC = () => (
  <>
    <Png id="tragamonedas" x={-450} y={60} w={240} t0={E51.slot} t1={E51.tool} glow={N.oro} />
    <Png id="herramienta" x={-450} y={60} w={240} t0={E51.tool} glow={N.oro} />
    <Png id="mano_abierta" x={1390} y={60} w={260} t0={E51.pick} glow={N.cian} />
    <Png id="cerebro" x={1900} y={50} w={520} t0={E51.look} glow={N.cian} />
  </>
);
const Escena51: React.FC = () => <EscenaMundo tomas={tomas51}><Herramienta /><AgarraSuelta /><CerebroFinal /><H51 /></EscenaMundo>;

export const SEGS_M13: Seg[] = [
  {
    hub: { portal: "cuerpo", orbs: [
      { id: "stop", t: T("stop and notice", 803), ang: 198, anillo: 1, tam: 160, D: PalmaStop },
      { id: "ojo", t: T("notice. Where", 804.5), ang: 128, anillo: 2, tam: 150, D: OjoNota },
      { id: "cuerpo", t: T("feel the urge", 805), ang: -14, anillo: 0, tam: 240, D: CuerpoHub },
    ] },
    Escena: Escena48,
    sonidos: (s) => { s.add("latido", E48.hand + 0.1, 0.4); s.add("latido", E48.chest + 0.1, 0.4); s.add("sinapsis", E48.eyes + 0.1, 0.4); s.add("vuelo", 812.0, 0.5); s.add("ola", E48.breathe, 0.4); s.add("vuelo", 815.4, 0.5); s.add("ola", E48.wave, 0.5); s.add("luz", E48.secret, 0.5); },
  },
  {
    hub: { portal: "ola", orbs: [
      { id: "pico", t: T("An urge is", 820.5), ang: 198, anillo: 1, tam: 160, D: PicoRojo },
      { id: "ola", t: T("like a wave", 821.5), ang: -14, anillo: 0, tam: 240, D: OlaHub, png: "ola" },
      { id: "sube", t: T("It rises", 822.5), ang: 128, anillo: 2, tam: 160, D: Sube },
    ] },
    Escena: Escena49,
    sonidos: (s) => { s.add("traza", E49.peak - 0.5, 0.5); s.add("ola", E49.peak, 0.5); s.add("ola", E49.falls, 0.4); s.add("tic", E49.minute, 0.5); s.add("vuelo", 831.5, 0.5); s.add("ola", E49.pass - 0.3, 0.6); },
  },
  {
    hub: { portal: "bifurca", orbs: [
      { id: "auto", t: T("highway in your", 834), ang: 198, anillo: 1, tam: 160, D: AutopistaAngosta },
      { id: "camino", t: T("path to your", 838), ang: 128, anillo: 2, tam: 160, D: CaminoAncho },
      { id: "bifurca", t: T("a little wider", 839.5), ang: -14, anillo: 0, tam: 240, D: Bifurca },
    ] },
    Escena: Escena50,
    sonidos: (s) => { s.add("traza", E50.perfect + 0.3, 0.5); s.add("vuelo", 843.8, 0.5); s.add("vueloLargo", E50.throw + 0.2, 0.4); s.add("golpe", E50.river + 0.4, 0.5); s.add("vuelo", 846.4, 0.5); [E50.one + 0.3, E50.another - 0.2, E50.another + 0.3, E50.another + 0.7, E50.another + 1.1].forEach((x) => s.add("ola", x, 0.3)); s.add("vuelo", 849.9, 0.5); [0, 1, 2, 3].forEach((i) => s.add("tic", E50.weeks + i * 0.35, 0.4)); s.add("luz", E50.strange, 0.5); },
  },
  {
    hub: { portal: "slotcel", orbs: [
      { id: "bols", t: T("in your pocket", 854.5), ang: 198, anillo: 1, tam: 160, D: BolsilloCel },
      { id: "fant", t: T("feel less like", 856), ang: 128, anillo: 2, tam: 160, D: FantasmaSlot },
      { id: "slotcel", t: T("feel less like", 856) + 0.4, ang: -14, anillo: 0, tam: 240, D: SlotACel },
    ] },
    Escena: Escena51,
    sonidos: (s) => { s.add("rodillos", E51.slot, 0.4); s.add("vidrio", E51.meant, 0.5); s.add("aparece", E51.tool, 0.5); s.add("vuelo", 862.8, 0.5); s.add("toque", E51.choose, 0.5); s.add("toque", E51.done + 0.3, 0.5); s.add("vuelo", 867.4, 0.5); s.add("traza", E51.look, 0.5); s.add("engranaje", E51.glass, 0.5); },
  },
];
