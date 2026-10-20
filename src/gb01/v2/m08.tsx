// gb01 v2 · MINUTO 8 (ventanas 28-31, 470-535 s): la tribu que se va y te deja solo · ojos de lobos · el radar del cerebro
// "¿me aceptan?" · el punto rojo como alarma en la parte más vieja · la tribu habla sin vos · "unread" · la deuda ·
// esperar los likes · cada like = "me aceptan" · el valor propio dentro del quizás · engranaje 4 · la palanca que cualquiera tira.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { EscenaMundo, Obj, Texto, circ } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const TRIBU = "#ffcf9a";
const corazon = (x: number, y: number, s: number) => `M${x},${y + 14 * s} C${x - 34 * s},${y - 6 * s} ${x - 22 * s},${y - 36 * s} ${x},${y - 18 * s} C${x + 22 * s},${y - 36 * s} ${x + 34 * s},${y - 6 * s} ${x},${y + 14 * s} Z`;
// silueta de persona (cabeza + torso) en coordenadas locales
const Persona: React.FC<{ x: number; y: number; s?: number; c?: string; op?: number; fill?: string }> = ({ x, y, s = 1, c = "#e6eeff", op = 1, fill = "rgba(5,5,6,.9)" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op} style={glow(c, 6)}>
    <circle cx={0} cy={-90} r={26} fill={fill} stroke={c} strokeWidth={3.5} />
    <path d="M-44,30 Q-44,-56 0,-58 Q44,-56 44,30 Z" fill={fill} stroke={c} strokeWidth={3.5} />
  </g>
);

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
const tomas28: Toma[] = [[475.5, 0, 0, 1.2], [476.8, 0, 0, 1.05], [477.3, 860, 0, 1.12], [480.2, 1500, 0, 0.98], [484.2, 1600, 0, 1.0], [484.8, 2500, 0, 1.0], [486.9, 2600, -40, 1.6]];
const Lobos: React.FC = () => {
  const t = useT();
  const OJ = [[-420, -150], [-300, 200], [380, -220], [460, 120], [-120, -300], [180, 280], [-500, 40]];
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <Persona x={0} y={60} s={1.6} op={ramp(t, E28.die - 0.5, 0.3)} />
        {OJ.map(([x, y], i) => { const on = neonOn(t, E28.die + 0.2 + i * 0.12) * (Math.floor(t * 1.3 + i * 0.7) % 5 === 0 ? 0.1 : 1); return <g key={i} opacity={on} style={glow(N.rojo, 10)}><ellipse cx={x - 16} cy={y} rx={10} ry={5} fill={N.rojo} transform={`rotate(-12 ${x - 16} ${y})`} /><ellipse cx={x + 16} cy={y} rx={10} ry={5} fill={N.rojo} transform={`rotate(12 ${x + 16} ${y})`} /></g>; })}
      </svg>
      <Texto x={0} y={-300} t0={E28.die} texto="you could *die*" size={60} color={N.rojoBorde} t1={E28.brain + 0.5} />
    </>
  );
};
const Radar: React.FC = () => {
  const t = useT();
  if (t < E28.brain - 0.4) return null;
  const barr = (t * 180) % 360;
  return (
    <>
      <Obj x={860} y={60} t0={E28.brain - 0.4} tam={300} color={N.cianClaro} trazos={[
        { d: "M-90,20 Q-110,-60 -40,-80 Q0,-110 50,-84 Q110,-70 100,0 Q110,50 50,60 Q30,90 -10,70 Q-70,80 -90,20 Z", a: 2.4, f: "rgba(203,251,255,.04)" },
        { d: "M0,-96 L0,-150 M-20,-150 L20,-150", a: 2.6 },
      ]} />
      <svg width={1} height={1} style={abs(860, -165)} opacity={ramp(t, E28.sens, 0.3)}>
        {[0, 1, 2].map((i) => { const r = ((t * 120 + i * 80) % 240); return <circle key={i} r={r} fill="none" stroke={N.cian} strokeWidth={3} opacity={1 - r / 240} />; })}
        <path d={`M0,0 L${200 * Math.cos((barr * Math.PI) / 180)},${200 * Math.sin((barr * Math.PI) / 180)}`} stroke={N.cianClaro} strokeWidth={2} opacity={0.6} />
      </svg>
      <Texto x={860} y={330} t0={E28.question} texto="*one* question" size={50} color={N.cianClaro} />
    </>
  );
};
const Otros: React.FC = () => {
  const t = useT();
  if (t < E28.others - 0.4) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(1500, 40)} opacity={ramp(t, E28.others - 0.4, 0.4)}>
        {[0, 1, 2, 3].map((i) => <Persona key={i} x={240 + i * 90} y={60 + (i % 2) * 20} s={0.8} c={TRIBU} />)}
        {[0, 1].map((i) => <g key={i} transform={`translate(${280 + i * 160},-110)`} opacity={ramp(t, E28.others + 0.3 + i * 0.2, 0.3)}><rect x={-34} y={-26} width={68} height={52} rx={14} fill="rgba(5,5,6,.9)" stroke={TRIBU} strokeWidth={3} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={30} fill={TRIBU}>…</text></g>)}
        <Persona x={-220} y={70} s={1.1} />
        <g transform="translate(-220,-130)" opacity={ramp(t, E28.accept, 0.3)}>
          <path d="M-150,-46 L150,-46 Q166,-46 166,-30 L166,30 Q166,46 150,46 L-20,46 L-40,80 L-50,46 L-150,46 Q-166,46 -166,30 L-166,-30 Q-166,-46 -150,-46 Z" fill="rgba(5,5,6,.9)" stroke={N.violeta} strokeWidth={3} style={glow(N.violeta)} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily="serif" fontStyle="italic" fontSize={36} fill={N.violeta}>do they accept me?</text>
        </g>
      </svg>
      <Texto x={1600} y={-310} t0={E28.others} texto="what are the *others* doing?" size={46} color={TRIBU} t1={E28.look} />
    </>
  );
};
const Apps: React.FC = () => {
  const t = useT();
  if (t < E28.look - 0.4) return null;
  const cols = [N.cian, N.violeta, N.oro, N.verde, N.rojo, N.cianClaro, N.oroClaro, N.violeta, N.cian];
  return (
    <svg width={1} height={1} style={abs(2500, 0)} opacity={ramp(t, E28.look - 0.4, 0.4)}>
      <path d="M-200,-330 L200,-330 Q230,-330 230,-300 L230,300 Q230,330 200,330 L-200,330 Q-230,330 -230,300 L-230,-300 Q-230,-330 -200,-330 Z" fill="none" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 6)} />
      {cols.map((c, i) => { const x = -130 + (i % 3) * 130, y = -200 + Math.floor(i / 3) * 150; return <g key={i} transform={`translate(${x},${y})`}><rect x={-46} y={-46} width={92} height={92} rx={22} fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3} />{i === 2 && <circle cx={44} cy={-44} r={16 + 3 * Math.sin(t * 8)} fill={N.rojo} opacity={neonOn(t, E28.dot)} style={glow(N.rojo, 14)} />}</g>; })}
    </svg>
  );
};
const Escena28: React.FC = () => <EscenaMundo tomas={tomas28}><Lobos /><Radar /><Otros /><Apps /></EscenaMundo>;

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
const tomas29: Toma[] = [[490.9, 0, 0, 1.1], [493.4, 300, 0, 0.9], [494.0, 800, 0, 1.1], [496.2, 800, 0, 1.1], [496.7, 1600, 0, 1.0], [499.8, 1600, 20, 1.1], [500.3, 2450, 0, 1.06], [503.3, 2450, 0, 1.2]];
const Alarma: React.FC = () => {
  const t = useT();
  const gira = t * 260;
  const on = ramp(t, E29.alarm, 0.3);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 20)} opacity={ramp(t, E29.red - 0.4, 0.3)}>
        <g transform={`rotate(${gira})`} opacity={on}><path d="M0,0 L620,-120 L620,120 Z" fill="rgba(255,42,72,.14)" /><path d="M0,0 L-620,-120 L-620,120 Z" fill="rgba(255,42,72,.14)" /></g>
        <path d="M-110,90 L-110,-20 Q-110,-130 0,-130 Q110,-130 110,-20 L110,90 Z" fill="rgba(255,42,72,.25)" stroke={N.rojo} strokeWidth={5} style={glow(N.rojo, 18)} />
        <rect x={-150} y={90} width={300} height={40} rx={8} fill="rgba(5,5,6,.9)" stroke="#e6eeff" strokeWidth={3} />
        <circle r={36 + 6 * Math.sin(t * 10)} fill={N.rojo} style={glow(N.rojo, 24)} />
      </svg>
      <Texto x={0} y={-270} t0={E29.alarm} texto="a small *alarm*" size={60} color={N.rojoBorde} t1={E29.oldest + 0.4} />
    </>
  );
};
const CerebroViejo: React.FC = () => {
  const t = useT();
  if (t < E29.oldest - 0.5) return null;
  const f = neonOn(t, E29.oldest + 0.2);
  return (
    <>
      <svg width={1} height={1} style={abs(800, 30)} opacity={ramp(t, E29.oldest - 0.5, 0.4)}>
        <path d="M-260,40 Q-300,-160 -120,-200 Q0,-260 140,-210 Q300,-180 290,-20 Q300,110 160,140 Q80,200 -20,170 Q-200,190 -260,40 Z" fill="rgba(203,251,255,.03)" stroke={N.cianClaro} strokeWidth={3.5} style={glow(N.cian, 6)} />
        {/* capas: la nueva arriba, la vieja en el fondo */}
        <path d="M-160,-40 Q0,-140 160,-40" fill="none" stroke={N.gris} strokeWidth={2} />
        <path d="M-90,30 Q0,-30 90,30" fill="none" stroke={N.gris} strokeWidth={2} />
        <path d="M-20,90 Q0,60 20,90 L24,220 L-24,220 Z" fill={`rgba(255,42,72,${0.15 + 0.35 * f})`} stroke={N.rojo} strokeWidth={3} style={glow(N.rojo, 14)} />
        <circle cx={-6} cy={80} r={22 + 4 * Math.sin(t * 9)} fill={N.rojo} opacity={0.8 * f} style={glow(N.rojo, 16)} />
        <text x={160} y={240} fontFamily="sans-serif" fontWeight={800} fontSize={24} fill={N.rojoBorde} opacity={f}>oldest part</text>
        <path d="M150,232 L40,140" stroke={N.rojoBorde} strokeWidth={2} opacity={f} />
      </svg>
      <Texto x={800} y={-290} t0={E29.oldest} texto="the *oldest* part of your mind" size={44} />
    </>
  );
};
const TribuHabla: React.FC = () => {
  const t = useT();
  if (t < E29.talking - 0.4) return null;
  const n = 7, hueco = 2;
  return (
    <>
      <svg width={1} height={1} style={abs(1600, 60)} opacity={ramp(t, E29.talking - 0.4, 0.4)}>
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2 + Math.PI / 2, x = Math.cos(a) * 300, y = Math.sin(a) * 110, s = 0.75 + 0.2 * Math.sin(a);
          if (i === hueco) return <g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity={ramp(t, E29.not, 0.3)}><circle cx={0} cy={-90} r={26} fill="none" stroke={N.rojo} strokeWidth={3} strokeDasharray="6 6" /><path d="M-44,30 Q-44,-56 0,-58 Q44,-56 44,30 Z" fill="none" stroke={N.rojo} strokeWidth={3} strokeDasharray="6 6" /><text y={70} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={30} fill={N.rojoBorde}>you?</text></g>;
          const habla = Math.floor(t * 2 + i) % 3 === 0;
          return <g key={i}><Persona x={x} y={y} s={s} c={TRIBU} />{habla && <g transform={`translate(${x + 30},${y - 150})`}><rect x={-26} y={-18} width={52} height={36} rx={10} fill="rgba(5,5,6,.9)" stroke={TRIBU} strokeWidth={2.5} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={22} fill={TRIBU}>…</text></g>}</g>;
        })}
      </svg>
      <Texto x={1600} y={-300} t0={E29.talking} texto="the tribe is *talking*" size={50} color={TRIBU} t1={E29.not} />
      <Texto x={1600} y={-300} t0={E29.not} texto="and you are *not there*" size={50} color={N.rojoBorde} />
    </>
  );
};
const NoLeido: React.FC = () => {
  const t = useT();
  if (t < E29.hard - 0.6) return null;
  const tiembla = Math.sin(t * 50) * 4 * ramp(t, E29.hard, 0.3);
  return (
    <>
      <svg width={1} height={1} style={abs(2450 + tiembla, 30)} opacity={ramp(t, E29.hard - 0.6, 0.3)}>
        <rect x={-120} y={-120} width={240} height={240} rx={56} fill="rgba(5,5,6,.9)" stroke={N.cianClaro} strokeWidth={5} style={glow(N.cian, 8)} />
        <path d="M-60,-30 L60,-30 L60,40 L-10,40 L-36,66 L-36,40 L-60,40 Z" fill="none" stroke={N.cianClaro} strokeWidth={4} />
        <g transform="translate(110,-110)" style={glow(N.rojo, 16)}><circle r={46} fill={N.rojo} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={50} fill="#fff">1</text></g>
        <g transform={`translate(${60 + 10 * Math.sin(t * 3)},${240 - 20 * Math.abs(Math.sin(t * 3))})`} style={glow(N.oro)}><path d="M-22,90 L-22,0 Q-22,-26 0,-26 Q22,-26 22,0 L22,90" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={4} /></g>
      </svg>
      <Texto x={2450} y={-280} t0={E29.unread} texto="leave it *unread*" size={56} color={N.rojoBorde} />
    </>
  );
};
const Escena29: React.FC = () => <EscenaMundo tomas={tomas29}><Alarma /><CerebroViejo /><TribuHabla /><NoLeido /></EscenaMundo>;

// ═════════ HUB 30 · "It feels like a debt, like someone is waiting for you. And" ═════════
const Pagare: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-70,-80 L50,-80 L70,-60 L70,80 L-70,80 Z", a: 2.6 }, { d: "M-46,-30 L46,-30 M-46,0 L30,0 M-46,30 L40,30", c: N.gris, a: 1.6 }]}>
    <TextoNeon y={-54} texto="I OWE" size={22} color={N.oro} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);
const Esperando: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={TRIBU} trazos={[{ d: circ(0, -40, 22), a: 2.6 }, { d: "M-36,60 Q-36,-10 0,-12 Q36,-10 36,60 Z", a: 2.6 }]}>
    <g transform="translate(56,-50)"><circle r={18} fill="none" stroke={TRIBU} strokeWidth={2.5} /><path d={`M0,0 L${12 * Math.sin(t * 3)},${-12 * Math.cos(t * 3)}`} stroke={TRIBU} strokeWidth={2.5} /></g>
  </Glifo>
);
const CelularPost: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-40,-80 L40,-80 Q50,-80 50,-70 L50,70 Q50,80 40,80 L-40,80 Q-50,80 -50,70 L-50,-70 Q-50,-80 -40,-80 Z", a: 2.6 }, { d: "M-30,-50 L30,-50 L30,10 L-30,10 Z", c: N.violeta, a: 2 }]}>
    <rect x={-30} y={30} width={60} height={22} rx={11} fill={N.cian} opacity={0.4 + 0.4 * Math.abs(Math.sin(t * 3))} /><TextoNeon y={42} texto="POST" size={14} color="#fff" />
  </Glifo>
);

// ═════════ ESCENA 30 · publicás · esperás los likes · cada uno = "la tribu me acepta" ═════════
const E30 = { post: T("you post something", 507.5), photo: T("a photo", 508), comment: T("a comment", 509), wait: T("wait for the likes", 511.5), each: T("Each one is", 513), sign: T("small sign", 513), accepts: T("tribe accepts me", 515.5) };
const tomas30: Toma[] = [[507.3, 0, 0, 1.12], [511.2, 0, 0, 1.0], [511.8, 820, 0, 1.12], [515.4, 820, 0, 1.0], [516.0, 1300, 0, 0.82], [517.6, 1300, 0, 0.86]];
const Publicar: React.FC = () => {
  const t = useT();
  const vuela = (t0: number) => ramp(t, t0 + 0.3, 0.7, easeOut);
  return (
    <>
      <Obj x={0} y={40} t0={E30.post - 0.4} tam={200} color={N.cianClaro} trazos={[{ d: "M-120,-230 L120,-230 Q140,-230 140,-210 L140,210 Q140,230 120,230 L-120,230 Q-140,230 -140,210 L-140,-210 Q-140,-230 -120,-230 Z", a: 3 }]} />
      <svg width={1} height={1} style={abs(0, 40)}>
        {/* foto */}
        <g transform={`translate(${lerp(-420, 0, vuela(E30.photo))},${lerp(-160, -90, vuela(E30.photo))}) rotate(${lerp(-14, 0, vuela(E30.photo))})`} opacity={ramp(t, E30.photo - 0.2, 0.3)} style={glow(N.violeta, 6)}>
          <rect x={-100} y={-80} width={200} height={160} fill="rgba(183,123,255,.08)" stroke={N.violeta} strokeWidth={4} />
          <path d="M-80,60 L-30,0 L10,40 L40,10 L80,60 Z" fill="none" stroke={N.violeta} strokeWidth={3} /><circle cx={50} cy={-40} r={16} fill="none" stroke={N.oro} strokeWidth={3} />
        </g>
        {/* comentario */}
        <g transform={`translate(${lerp(420, 0, vuela(E30.comment))},${lerp(160, 90, vuela(E30.comment))})`} opacity={ramp(t, E30.comment - 0.2, 0.3)} style={glow(N.cian, 6)}>
          <path d="M-100,-40 L100,-40 L100,30 L-40,30 L-70,56 L-70,30 L-100,30 Z" fill="rgba(5,5,6,.9)" stroke={N.cianClaro} strokeWidth={3} />
          <path d="M-76,-16 L70,-16 M-76,6 L30,6" stroke={N.cianClaro} strokeWidth={3} />
        </g>
      </svg>
      <Texto x={0} y={-300} t0={E30.post} texto="you *post* something" size={52} t1={E30.wait} />
    </>
  );
};
const Likes: React.FC = () => {
  const t = useT();
  if (t < E30.wait - 0.4) return null;
  const TL = Array.from({ length: 9 }, (_, i) => E30.each + i * 0.3 + (i > 3 ? 0.3 : 0));
  const n = TL.filter((x) => x <= t).length;
  return (
    <>
      <svg width={1} height={1} style={abs(820, 0)} opacity={ramp(t, E30.wait - 0.4, 0.3)}>
        <path d={corazon(0, 20, 5.4)} fill={`rgba(255,42,72,${0.06 + 0.04 * n})`} stroke={N.rojo} strokeWidth={5} style={glow(N.rojo, 12)} />
        <text x={0} y={30} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={110} fill="#fff" style={glow(N.rojo, 10)}>{n}</text>
        {TL.map((tl, i) => { const d = t - tl; if (d < 0 || d > 1.2) return null; const a = -Math.PI / 2 + (i % 2 ? 0.6 : -0.6) * (1 + (i % 3) * 0.3); return <path key={i} d={corazon(Math.cos(a) * (150 + 160 * d), 20 + Math.sin(a) * (150 + 160 * d), 1.2)} fill={N.rojo} opacity={1 - d / 1.2} style={glow(N.rojo, 8)} />; })}
        {/* ojos que esperan: puntitos de "escribiendo" */}
        {n === 0 && [0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 30} cy={210} r={8} fill="#e6eeff" opacity={Math.floor(t * 3) % 3 === i ? 1 : 0.3} />)}
      </svg>
      <Texto x={820} y={-310} t0={E30.wait} texto="you wait for the *likes*" size={50} color={N.rojoBorde} t1={E30.sign} />
      <Texto x={820} y={-310} t0={E30.sign} texto="each one: a small *sign*" size={50} color={N.oroClaro} />
    </>
  );
};
const Acepta: React.FC = () => {
  const t = useT();
  if (t < E30.accepts - 0.5) return null;
  const k = ramp(t, E30.accepts, 0.8, easeOut);
  return (
    <>
      <div style={{ position: "absolute", left: 1600 - 380, top: 60 - 380, width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,180,90,${0.2 * k}), transparent 62%)` }} />
      <svg width={1} height={1} style={abs(1600, 60)} opacity={ramp(t, E30.accepts - 0.5, 0.4)}>
        {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + 0.3, r = lerp(420, 260, k); return <g key={i} transform={`translate(${Math.cos(a) * r},${Math.sin(a) * r * 0.42})`}><Persona x={0} y={0} s={0.7} c={TRIBU} /></g>; })}
        <Persona x={0} y={10} s={1.05} c="#fff" />
      </svg>
      <Texto x={1500} y={-280} t0={E30.accepts} texto="the tribe *accepts me*" size={58} color={TRIBU} />
    </>
  );
};
const Escena30: React.FC = () => <EscenaMundo tomas={tomas30}><Publicar /><Likes /><Acepta /></EscenaMundo>;

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
    <TextoNeon y={96} texto="the maybe" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 31 · tu valor dentro del quizás · engranaje 4 · la necesidad de pertenecer = palanca · rearmar el cerebro ═════════
const E31 = { worth: T("sense of worth", 522.5), fourth: T("the fourth gear", 525), red: T("the red dot", 526.5), belong: T("need to belong", 528.5), lever: T("into a lever", 529), anyone: T("anyone can", 531), together: T("glass brain back", 534) };
const tomas31: Toma[] = [[522.8, 0, 0, 1.1], [525.0, 0, 0, 1.0], [525.5, 900, 0, 1.1], [528.2, 900, 0, 1.0], [528.8, 1800, 0, 1.06], [532.6, 1800, 0, 1.0], [533.4, 2700, 0, 1.04], [535.2, 2700, 0, 1.14]];
const Balanza: React.FC = () => {
  const t = useT();
  const inc = 14 * Math.sin(t * 1.6);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)} opacity={ramp(t, E31.worth - 0.5, 0.4)}>
        <path d="M0,200 L0,-120 M-80,200 L80,200" stroke="#e6eeff" strokeWidth={5} style={glow("#fff", 6)} />
        <g transform={`rotate(${inc} 0 -120)`}>
          <path d="M-260,-120 L260,-120" stroke="#e6eeff" strokeWidth={5} />
          <g transform={`translate(-260,-120) rotate(${-inc})`}><path d="M0,0 L-60,110 M0,0 L60,110 M-80,110 L80,110" stroke={N.gris} strokeWidth={2.5} fill="none" /><path d={corazon(0, 80, 1.6)} fill="rgba(255,42,72,.3)" stroke={N.rojo} strokeWidth={3} /><text y={150} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={28} fill={N.rojoBorde}>your worth</text></g>
          <g transform={`translate(260,-120) rotate(${-inc})`}><path d="M0,0 L-60,110 M0,0 L60,110 M-80,110 L80,110" stroke={N.gris} strokeWidth={2.5} fill="none" />{[0, 1, 2].map((i) => <path key={i} d={corazon(-30 + i * 30, 92 - (i % 2) * 18, 0.7)} fill={N.rojo} opacity={0.6} />)}<text y={150} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={26} fill={N.texto2}>likes</text></g>
        </g>
      </svg>
      <Texto x={0} y={-290} t0={E31.worth} texto="now with your *worth* inside it" size={46} color={N.rojoBorde} />
    </>
  );
};
const Marco4: React.FC = () => {
  const t = useT();
  if (t < E31.fourth - 0.4) return null;
  const punto = neonOn(t, E31.red);
  return (
    <>
      <Obj x={900} y={20} t0={E31.fourth - 0.4} tam={200} color="#e6eeff" trazos={[{ d: "M-380,-130 L380,-130 L380,130 L-380,130 Z", a: 2.4 }]} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 900 - 270 + i * 180, top: 20, transform: `rotate(${(i % 2 ? -1 : 1) * t * 40}deg) scale(${i === 3 ? 0.9 + 0.1 * pop(t, E31.fourth + 0.2, 8) : 1})` }}><EngranajeSvg r={72} color={i === 3 ? N.rojo : N.oro} n={i < 3 ? i + 1 : undefined} /></div>)}
      <svg width={1} height={1} style={abs(1170, 20)}><circle r={22 + 4 * Math.sin(t * 6)} fill={N.rojo} opacity={punto} style={glow(N.rojo, 16)} /></svg>
      <Texto x={900} y={-240} t0={E31.fourth} texto="the *fourth gear*" size={56} color={N.oroClaro} />
      <Texto x={900} y={240} t0={E31.red} texto="the *red dot*" size={52} color={N.rojoBorde} />
    </>
  );
};
const PalancaCorazon: React.FC = () => {
  const t = useT();
  if (t < E31.belong - 0.5) return null;
  const vuelve = ramp(t, E31.lever, 0.8, easeOut);
  const tirones = [E31.anyone + 0.2, E31.anyone + 0.9, E31.anyone + 1.6];
  const pl = Math.max(0, ...tirones.map((x) => ramp(t, x, 0.18) * (1 - ramp(t, x + 0.35, 0.25))));
  return (
    <>
      <svg width={1} height={1} style={abs(1800, 40)} opacity={ramp(t, E31.belong - 0.5, 0.4)}>
        {/* base de la palanca */}
        <path d="M-60,220 L60,220 L60,160 L-60,160 Z" fill="none" stroke={N.oro} strokeWidth={4} opacity={vuelve} style={glow(N.oro)} />
        <path d={`M0,160 L${lerp(0, lerp(40, 70, pl), vuelve)},${lerp(0, lerp(-120, 120, pl), vuelve)}`} stroke={N.oro} strokeWidth={10} strokeLinecap="round" opacity={vuelve} style={glow(N.oro)} />
        {/* el corazón se vuelve la bocha de la palanca */}
        <g transform={`translate(${lerp(0, lerp(40, 70, pl), vuelve)},${lerp(-40, lerp(-150, 100, pl), vuelve)}) scale(${lerp(3, 1.6, vuelve)})`} style={glow(N.rojo, 12)}><path d={corazon(0, 0, 1.4)} fill="rgba(255,42,72,.5)" stroke={N.rojo} strokeWidth={2} /></g>
        {/* manos de cualquiera */}
        {[[-320, -200], [340, -160], [-300, 160], [320, 200]].map(([x, y], i) => { const k = ramp(t, E31.anyone + i * 0.2, 0.5, easeOut); return <g key={i} transform={`translate(${lerp(x * 1.8, x * 0.55, k)},${lerp(y * 1.6, y * 0.4, k)}) rotate(${Math.atan2(-y, -x) * 57.3})`} opacity={k} style={glow(N.texto2, 6)}><path d="M-80,-18 L10,-18 Q34,-18 34,0 Q34,18 10,18 L-80,18" fill="rgba(5,5,6,.9)" stroke="#e6eeff" strokeWidth={3} /><path d="M10,-18 L30,-34 M16,18 L34,30" stroke="#e6eeff" strokeWidth={3} /></g>; })}
      </svg>
      <Texto x={1800} y={-300} t0={E31.belong} texto="your need to *belong*" size={50} color={N.rojoBorde} t1={E31.anyone} />
      <Texto x={1800} y={-300} t0={E31.anyone} texto="a lever *anyone* can pull" size={50} color={N.oroClaro} />
    </>
  );
};
const Rearmar: React.FC = () => {
  const t = useT();
  if (t < E31.together - 0.8) return null;
  const k = ramp(t, E31.together, 1.2, easeOut);
  return (
    <svg width={1} height={1} style={abs(2700, 20)} opacity={ramp(t, E31.together - 0.8, 0.4)}>
      <path d="M-260,40 Q-300,-160 -120,-200 Q0,-260 140,-210 Q300,-180 290,-20 Q300,110 160,140 Q80,200 -20,170 Q-200,190 -260,40 Z" fill="rgba(203,251,255,.04)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 8)} />
      {[[-120, -60], [80, -100], [-40, 70], [150, 40]].map(([x, y], i) => { const x0 = [-700, -200, 300, 700][i], y0 = 300; return <g key={i} transform={`translate(${lerp(x0, x, k)},${lerp(y0, y, k)}) rotate(${t * 60 * (i % 2 ? -1 : 1)}) scale(0.6)`}><circle r={0} /><foreignObject x={0} y={0} width={1} height={1} style={{ overflow: "visible" }}><div style={{ position: "absolute" }}><EngranajeSvg r={72} color={i === 3 ? N.rojo : N.oro} /></div></foreignObject></g>; })}
    </svg>
  );
};
const Escena31: React.FC = () => <EscenaMundo tomas={tomas31}><Balanza /><Marco4 /><PalancaCorazon /><Rearmar /></EscenaMundo>;

export const SEGS_M08: Seg[] = [
  {
    hub: { portal: "solo", orbs: [
      ...[0, 1, 2, 3, 4].map((i) => ({ id: "tr" + i, t: T("left out of", 470.5) - 0.3 + i * 0.12, t1: T("walked away", 473.5) + 0.2 + i * 0.1, ang: 150 + i * 46, anillo: (i % 2 ? 2 : 1) as 1 | 2, tam: 120, D: MiembroTribu })),
      { id: "peligro", t: T("dangerous", 471.5), ang: 60, anillo: 2, tam: 150, D: Peligro },
      { id: "solo", t: T("without you", 473), ang: -14, anillo: 0, tam: 230, D: Solo },
    ] },
    Escena: Escena28,
    sonidos: (s) => { s.add("latido", E28.die, 0.7); [0, 1, 2].forEach((i) => s.add("neonOn", E28.die + 0.2 + i * 0.3, 0.4)); s.add("vuelo", 477.3, 0.5); s.add("sinapsis", E28.sens, 0.6); s.add("vuelo", 480.2, 0.5); s.add("aparece", E28.accept, 0.6); s.add("vuelo", 484.8, 0.5); s.add("aviso", E28.dot); },
  },
  {
    hub: { portal: "at", orbs: [
      { id: "msg", t: T("One new message", 486.5), ang: 198, anillo: 1, tam: 160, D: Insignia("1", "msg") },
      { id: "likes", t: T("Three likes", 488), ang: 128, anillo: 2, tam: 160, D: Insignia("3", "heart") },
      { id: "at", t: T("mentioned you", 489.5), ang: -14, anillo: 0, tam: 230, D: Insignia("1", "at") },
    ] },
    Escena: Escena29,
    sonidos: (s) => { s.add("aviso", E29.red, 0.6); s.add("latido", E29.alarm); s.add("latido", E29.alarm + 0.6, 0.6); s.add("vuelo", 493.4, 0.5); s.add("sinapsis", E29.oldest + 0.2); s.add("vuelo", 496.7, 0.5); s.add("aparece", E29.talking, 0.5); s.add("vacio", E29.not, 0.6); s.add("vuelo", 500.3, 0.5); s.add("aviso", E29.hard, 0.6); s.add("tic", E29.unread, 0.6); },
  },
  {
    hub: { portal: "post", orbs: [
      { id: "deuda", t: T("like a debt", 504), ang: 198, anillo: 1, tam: 170, D: Pagare },
      { id: "espera", t: T("waiting for you", 506), ang: 128, anillo: 2, tam: 170, D: Esperando },
      { id: "post", t: T("waiting for you", 506) + 0.4, ang: -14, anillo: 0, tam: 230, D: CelularPost },
    ] },
    Escena: Escena30,
    sonidos: (s) => { s.add("aparece", E30.post, 0.6); s.add("vuelo", E30.photo + 0.3, 0.5); s.add("vuelo", E30.comment + 0.3, 0.5); s.add("vuelo", 511.8, 0.5); Array.from({ length: 9 }, (_, i) => E30.each + i * 0.3 + (i > 3 ? 0.3 : 0)).forEach((x) => s.add("like", x, 0.5)); s.add("vueloLargo", 516.0, 0.5); s.add("luz", E30.accepts, 0.6); },
  },
  {
    hub: { portal: "dado", orbs: [
      { id: "falta", t: T("missing one", 517), ang: 198, anillo: 1, tam: 160, D: CorazonFalta },
      { id: "preoc", t: T("small worry", 519), ang: 128, anillo: 2, tam: 160, D: Preocupa },
      { id: "dado", t: T("The maybe again", 520.5), ang: -14, anillo: 0, tam: 240, D: DadoCorazon },
    ] },
    Escena: Escena31,
    sonidos: (s) => { s.add("aparece", E31.worth, 0.5); s.add("vuelo", 525.5, 0.5); s.add("engranaje", E31.fourth + 0.2); s.add("aviso", E31.red, 0.6); s.add("vuelo", 528.8, 0.5); s.add("latido", E31.belong, 0.6); s.add("palanca", E31.anyone + 0.2); s.add("palanca", E31.anyone + 0.9, 0.7); s.add("palanca", E31.anyone + 1.6, 0.6); s.add("vuelo", 533.4, 0.5); s.add("engranaje", E31.together + 0.6); },
  },
];
