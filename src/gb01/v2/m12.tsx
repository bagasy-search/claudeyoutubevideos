// gb01 v2 · MINUTO 12 (ventanas 44-47, 736-803 s): segundo: la palanca pesada · apps a una carpeta lejana · logout · pantalla en
// gris (los caramelos pierden el color) · cada paso de esfuerzo despierta al guardián · tercero: tus propias puertas · escribir la
// última página · 10 minutos · la puerta más vieja: el celular duerme en la cocina · la práctica · nubes · urge surfing.
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
const APPC = [N.rojo, N.violeta, N.oro, N.verde, N.cian, "#ff7ad9", N.oroClaro, N.rojoBorde, N.cianClaro];
const gris = (c: string, k: number) => (k > 0.5 ? "rgba(200,200,210,.5)" : c);
const Persona: React.FC<{ x: number; y: number; s?: number; c?: string; op?: number }> = ({ x, y, s = 1, c = PIEL, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op} style={glow(c, 6)}>
    <circle cx={0} cy={-90} r={26} fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
    <path d="M-44,30 Q-44,-56 0,-58 Q44,-56 44,30 Z" fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
  </g>
);

// ═════════ HUB 44 · "make the lever heavy. Move the apps that pull you the most off your home screen into" ═════════
const PalancaPesa: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: "M-60,80 L60,80 L60,50 L-60,50 Z M0,50 L40,-50", a: 2.8 }]}>
    <g transform={`translate(40,${-50 + 4 * Math.sin(t * 2)})`}><path d="M-34,-10 L34,-10 L44,40 L-44,40 Z" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} /><text y={22} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={22} fill={N.oroClaro}>kg</text><circle cy={-18} r={8} fill="none" stroke={N.oroClaro} strokeWidth={3} /></g>
  </Glifo>
);
const AppsVuelan: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[]}>
    {[0, 1, 2, 3].map((i) => { const d = ((t * 0.8 + i * 0.25) % 1); return <rect key={i} x={-60 + (i % 2) * 50 + d * 70} y={-50 + Math.floor(i / 2) * 50 - d * 60} width={36} height={36} rx={9} fill="none" stroke={APPC[i]} strokeWidth={3} opacity={1 - d} transform={`scale(${1 - 0.5 * d})`} />; })}
    <path d="M40,-80 L90,-80 L90,-40" fill="none" stroke={N.cianClaro} strokeWidth={3} />
  </Glifo>
);
const HomeHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: tel(110, 180, 18), a: 2.6 }]}>
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-38 + (i % 3) * 28} y={-56 + Math.floor(i / 3) * 30} width={20} height={20} rx={5} fill="none" stroke={APPC[i]} strokeWidth={2.5} />)}
  </Glifo>
);

// ═════════ ESCENA 44 · las apps a una carpeta lejana · logout · pantalla en gris · los colores dejan de brillar como caramelos ═════════
const E44 = { folder: T("a folder far away", 742), logout: T("Log out after", 744), gray: T("screen to gray", 748), bw: T("black and white", 748), colors: T("colors stop shining", 750), candy: T("like candy", 752) };
const tomas44: Toma[] = [[742.4, 0, 0, 1.06], [745.0, 0, 0, 1.0], [745.4, 950, 0, 1.1], [747.2, 950, 0, 1.0], [747.7, 1900, 0, 1.04], [753.1, 1900, 0, 1.12]];
const CarpetaLejana: React.FC = () => {
  const t = useT();
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <path d={tel(300, 520, 34)} fill="rgba(5,5,6,.85)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 6)} />
        {/* carpeta chiquita, lejos, en el rincón del universo */}
        <g transform="translate(400,-240)" opacity={ramp(t, E44.folder, 0.4)}><path d="M-34,-20 L-10,-20 L-2,-30 L34,-30 L34,24 L-34,24 Z" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} style={glow(N.oro, 8)} /><text y={52} textAnchor="middle" fontFamily="monospace" fontSize={18} fill={N.oroClaro}>far away</text></g>
        <path d="M120,-100 Q260,-260 360,-250" fill="none" stroke={N.oroClaro} strokeWidth={2} strokeDasharray="6 10" opacity={ramp(t, E44.folder, 0.4) * 0.6} />
        {Array.from({ length: 9 }, (_, i) => {
          const x0 = -90 + (i % 3) * 90, y0 = -170 + Math.floor(i / 3) * 100, k = ramp(t, E44.folder - 0.4 + i * 0.12, 0.7, easeOut);
          const quedan = i === 4 || i === 6; // reloj y mensajes se quedan
          const kk = quedan ? 0 : k;
          return <rect key={i} x={lerp(x0, 400, kk) - 32 * (1 - 0.8 * kk)} y={lerp(y0, -246, kk) - 32 * (1 - 0.8 * kk)} width={64 * (1 - 0.8 * kk)} height={64 * (1 - 0.8 * kk)} rx={16 * (1 - 0.8 * kk)} fill="rgba(5,5,6,.9)" stroke={APPC[i]} strokeWidth={3} opacity={1 - 0.6 * kk} />;
        })}
      </svg>
      <Texto x={0} y={-310} t0={E44.folder} texto="into a folder *far away*" size={50} color={N.oroClaro} />
    </>
  );
};
const Logout: React.FC = () => {
  const t = useT();
  if (t < E44.logout - 0.5) return null;
  const toca = ramp(t, E44.logout + 0.5, 0.2) * (1 - ramp(t, E44.logout + 0.8, 0.2));
  const cierra = ramp(t, E44.logout + 0.9, 0.4, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E44.logout - 0.5, 0.4)}>
        <rect x={-220} y={60} width={440} height={100} rx={50} fill={`rgba(255,42,72,${0.15 + 0.3 * toca})`} stroke={N.rojo} strokeWidth={4} style={glow(N.rojo, 8)} transform={`scale(${1 - 0.05 * toca})`} />
        <text y={112} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={44} letterSpacing={3} fill="#fff">LOG OUT</text>
        {/* candado que se cierra arriba */}
        <g transform="translate(0,-100)" style={glow(N.oro, 10)}>
          <path d={`M-50,0 L-50,${-50 + 20 * (1 - cierra)} Q-50,-100 0,-100 Q50,-100 50,-50 L50,${-30 * (1 - cierra)}`} fill="none" stroke={N.oroClaro} strokeWidth={10} transform={`translate(0,${-24 * (1 - cierra)})`} />
          <rect x={-74} y={0} width={148} height={110} rx={16} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={5} />
          <circle cy={50} r={12} fill={N.oroClaro} />
        </g>
        <circle cx={60} cy={110} r={lerp(10, 40, toca)} fill="rgba(255,255,255,.3)" opacity={toca} />
      </svg>
      <Texto x={950} y={-310} t0={E44.logout} texto="*log out* after you use them" size={50} color={N.rojoBorde} />
    </>
  );
};
const PantallaGris: React.FC = () => {
  const t = useT();
  if (t < E44.gray - 0.5) return null;
  const g = ramp(t, E44.bw, 1.2);
  const candy = ramp(t, E44.candy, 0.4);
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 40)} opacity={ramp(t, E44.gray - 0.5, 0.4)}>
        <path d={tel(380, 600, 40)} fill="rgba(5,5,6,.85)" stroke={g > 0.5 ? N.texto2 : N.cianClaro} strokeWidth={4} style={glow(g > 0.5 ? "#888" : N.cian, 6)} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = -110 + (i % 3) * 110, y = -170 + Math.floor(i / 3) * 140, c = gris(APPC[i], g);
          const b = 1 + 0.08 * Math.sin(t * 6 + i) * (1 - g);
          return <g key={i} transform={`translate(${x},${y}) scale(${b})`} style={glow(c, 12 * (1 - g))}>
            {/* íconos como caramelos con envoltorio */}
            <circle r={36} fill={g > 0.5 ? "rgba(160,160,170,.15)" : `${c}44`} stroke={c} strokeWidth={4} />
            <path d="M-36,0 L-58,-16 L-58,16 Z M36,0 L58,-16 L58,16 Z" fill="none" stroke={c} strokeWidth={3} opacity={candy > 0 ? 1 - 0.6 * candy : 1} />
            {g < 0.5 && <path d="M-16,-20 Q-6,-30 6,-26" fill="none" stroke="#fff" strokeWidth={3} opacity={0.7} />}
          </g>;
        })}
        {/* perilla de color a gris */}
        <g transform="translate(0,350)"><rect x={-140} y={-16} width={280} height={32} rx={16} fill="none" stroke={N.gris} strokeWidth={2} /><circle cx={lerp(120, -120, g)} r={20} fill={g > 0.5 ? "#bbb" : N.oro} /></g>
      </svg>
      <Texto x={1900} y={-340} t0={E44.gray} texto="turn the screen *gray*" size={48} color="#c8c8d0" t1={E44.colors} />
      <Texto x={1900} y={-340} t0={E44.colors} texto="colors stop shining *like candy*" size={46} color="#ff9ae0" />
    </>
  );
};
// objetos de vidrio de la escena 44
const H44: React.FC = () => (
  <>
    <Png id="carpeta" x={440} y={60} w={240} t0={E44.folder} glow={N.cian} />
    <Png id="caramelo" x={2370} y={60} w={220} t0={E44.colors} glow={N.rojo} />
  </>
);
const Escena44: React.FC = () => <EscenaMundo tomas={tomas44}><CarpetaLejana /><Logout /><PantallaGris /><H44 /></EscenaMundo>;

// ═════════ HUB 45 · "Every small step of effort gives the wise guard in your forehead a" ═════════
const Escalones: D = ({ t, t0, on, tam }) => {
  const p = Math.floor(t * 2) % 4;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-80,70 L-40,70 L-40,30 L0,30 L0,-10 L40,-10 L40,-50 L80,-50", a: 2.8 }]}>
      <circle cx={-60 + p * 40} cy={56 - p * 40} r={10} fill={N.oroClaro} />
    </Glifo>
  );
};
const Frente2: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: "M-40,80 Q-70,40 -60,-10 Q-50,-80 10,-82 Q70,-80 70,-20 L70,40 Q60,80 20,80", a: 2.6 }]}>
    <circle cx={30} cy={-40} r={14 + 3 * Math.sin(t * 4)} fill={N.oro} opacity={0.8} style={glow(N.oro, 14)} />
  </Glifo>
);
const GuardianDespierta: D = ({ t, t0, on, tam }) => {
  const ojos = ramp(t, t0 + 0.6, 0.3);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: circ(0, -50, 30), a: 2.6 }, { d: "M-50,80 Q-50,-10 0,-14 Q50,-10 50,80 Z", a: 2.6 }, { d: "M60,10 L60,60 M52,60 L68,60", a: 2, c: N.oro }]}>
      <path d={`M-14,-52 Q-10,${-52 - 6 * ojos} -6,-52 M6,-52 Q10,${-52 - 6 * ojos} 14,-52`} fill="none" stroke={N.oroClaro} strokeWidth={3} />
      <circle cx={60} cy={0} r={10 + 4 * ojos} fill={N.oro} opacity={0.3 + 0.7 * ojos} style={glow(N.oro, 14 * ojos)} />
    </Glifo>
  );
};

// ═════════ ESCENA 45 · despertar y preguntar "¿lo quiero de verdad?" · tercero: tus propias puertas · escribir la última página · decidir antes ═════════
const E45 = { wake: T("to wake up", 757), ask: T("Do I really", 759.5), third: T("Third, build", 760), doors: T("your own doors", 761), reel: T("If the reel", 762), write: T("you write the", 766), yourself: T("page yourself", 767), decide: T("Decide before", 768), open: T("open the app", 769) };
const tomas45: Toma[] = [[757.6, 0, 0, 1.1], [761.6, 0, 0, 1.0], [762.0, 950, 0, 1.1], [764.2, 950, 0, 1.0], [764.6, 1900, 0, 1.08], [768.9, 1900, 0, 1.0], [769.3, 2850, 0, 1.08], [770.8, 2850, 0, 1.14]];
const GuardiaPregunta: React.FC = () => {
  const t = useT();
  const ojo = ramp(t, E45.wake + 0.2, 0.4);
  const luz = ramp(t, E45.wake + 0.4, 0.8);
  return (
    <>
      <div style={{ position: "absolute", left: -360, top: -320, width: 720, height: 720, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,200,110,${0.16 * luz}), transparent 62%)` }} />
      <svg width={1} height={1} style={abs(0, 40)}>
        <g transform="translate(-120,0) scale(1.6)" style={glow(N.oroClaro, 6)}>
          <circle cx={0} cy={-90} r={30} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} />
          <path d={`M-14,-92 Q-10,${-92 - 6 * ojo} -6,-92 M6,-92 Q10,${-92 - 6 * ojo} 14,-92`} fill="none" stroke={N.oroClaro} strokeWidth={2.5} />
          <path d="M-54,60 Q-54,-50 0,-54 Q54,-50 54,60 Z" fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} />
          <path d="M50,-20 L80,-50 L80,-10" fill="none" stroke={N.oroClaro} strokeWidth={3} />
          <g transform="translate(80,-10)"><path d="M-12,0 L12,0 L16,34 L-16,34 Z" fill={`rgba(255,200,110,${0.2 + 0.6 * luz})`} stroke={N.oro} strokeWidth={2.5} /></g>
          {ojo < 1 && <text x={40} y={-130} fontFamily="serif" fontStyle="italic" fontSize={22} fill={N.texto2} opacity={1 - ojo}>z z</text>}
        </g>
        <g transform="translate(200,-120)" opacity={ramp(t, E45.ask, 0.3)}>
          <path d="M-190,-60 L190,-60 Q210,-60 210,-40 L210,40 Q210,60 190,60 L-110,60 L-150,100 L-140,60 L-190,60 Q-210,60 -210,40 L-210,-40 Q-210,-60 -190,-60 Z" fill="rgba(5,5,6,.92)" stroke={N.oroClaro} strokeWidth={3.5} style={glow(N.oro, 8)} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily="serif" fontStyle="italic" fontSize={38} fill={N.oroClaro}>do I really want this?</text>
        </g>
      </svg>
      <Texto x={0} y={-310} t0={E45.wake} texto="a moment to *wake up*" size={52} color={N.oroClaro} />
    </>
  );
};
const PuertasPropias: React.FC = () => {
  const t = useT();
  if (t < E45.third - 0.5) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E45.third - 0.5, 0.4)}>
        <text x={-330} y={-170} fontFamily="sans-serif" fontWeight={900} fontSize={90} fill={N.oroClaro} style={glow(N.oro, 12)} opacity={pop(t, E45.third, 8)}>3</text>
        <path d="M-420,200 L420,200" stroke={N.cianClaro} strokeWidth={3} />
        {[0, 1, 2].map((i) => {
          const x = -200 + i * 200, k = ramp(t, E45.doors + i * 0.35, 0.6);
          return <g key={i} transform={`translate(${x},200)`}>
            {/* la puerta se dibuja: marco, hoja, picaporte */}
            <path d="M-60,0 L-60,-240 L60,-240 L60,0" fill="none" stroke={N.verde} strokeWidth={5} strokeDasharray="600" strokeDashoffset={600 * (1 - k)} style={glow(N.verde, 8)} />
            <rect x={-48} y={-228} width={96} height={228} fill={`rgba(80,255,170,${0.08 * k})`} />
            <circle cx={36} cy={-110} r={7} fill={N.verde} opacity={k} />
            {i === 1 && <g transform="translate(110,-150)" opacity={ramp(t, E45.doors + 0.8, 0.3)}><path d="M0,0 L40,-16" stroke={N.oroClaro} strokeWidth={6} strokeLinecap="round" /><rect x={-4} y={-10} width={20} height={20} fill={N.oroClaro} transform="rotate(-20)" /></g>}
          </g>;
        })}
      </svg>
      <Texto x={950} y={-310} t0={E45.doors} texto="build your *own doors*" size={54} color={N.verde} />
    </>
  );
};
const UltimaPagina: React.FC = () => {
  const t = useT();
  if (t < E45.reel - 0.5) return null;
  const esc = ramp(t, E45.write + 0.2, 1.4);
  const letras = "the end.";
  const n = Math.floor(esc * letras.length);
  const px = -120 + n * 30;
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 40)} opacity={ramp(t, E45.reel - 0.5, 0.4)}>
        <path d="M0,-200 Q-150,-230 -320,-200 L-320,200 Q-150,170 0,200 Q150,170 320,200 L320,-200 Q150,-230 0,-200 Z" fill="rgba(255,240,220,.04)" stroke={PIEL} strokeWidth={4} style={glow("#fff", 5)} />
        <path d="M0,-200 L0,200" stroke={PIEL} strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-280,${-140 + i * 50} L-40,${-140 + i * 50}`} stroke={N.gris} strokeWidth={3} />)}
        <text x={-120} y={20} fontFamily="serif" fontStyle="italic" fontSize={58} fill={N.oroClaro} style={glow(N.oro, 8)}>{letras.slice(0, n)}</text>
        {/* pluma que escribe */}
        <g transform={`translate(${60 + px * 0.5 + (esc > 0 && esc < 1 ? 6 * Math.sin(t * 30) : 0) + 180},${-40 + (esc > 0 && esc < 1 ? 4 * Math.cos(t * 30) : 0)}) rotate(30)`} opacity={ramp(t, E45.write - 0.3, 0.3)} style={glow(PIEL, 6)}>
          <path d="M0,0 Q30,-90 10,-200 Q-30,-90 0,0 Z" fill="rgba(230,238,255,.1)" stroke={PIEL} strokeWidth={3} /><path d="M0,0 L8,-180" stroke={PIEL} strokeWidth={2} />
        </g>
      </svg>
      <Texto x={1900} y={-310} t0={E45.reel} texto="the reel has *no last page*" size={48} t1={E45.write} />
      <Texto x={1900} y={-310} t0={E45.write} texto="you write the last page *yourself*" size={46} color={N.oroClaro} />
    </>
  );
};
const DecideAntes: React.FC = () => {
  const t = useT();
  if (t < E45.decide - 0.5) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(2850, 40)} opacity={ramp(t, E45.decide - 0.5, 0.4)}>
        <rect x={-70} y={40} width={140} height={140} rx={34} fill="rgba(5,5,6,.9)" stroke={N.rojo} strokeWidth={4} style={glow(N.rojo, 8)} />
        <g transform={`translate(0,-110) scale(${pop(t, E45.decide + 0.2, 8)})`} style={glow(N.oro, 8)}>
          <rect x={-200} y={-70} width={400} height={140} rx={20} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={4} />
          <text y={-26} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={28} fill={N.texto2}>before you open:</text>
          <text y={28} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={46} fill={N.oroClaro}>how long?</text>
        </g>
      </svg>
      <Texto x={2850} y={-310} t0={E45.decide} texto="decide *before* you open it" size={50} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 45
const H45: React.FC = () => (
  <>
    <Png id="farol" x={440} y={60} w={230} t0={E45.wake} glow={N.oro} />
    <Png id="puerta" x={1390} y={60} w={240} t0={E45.doors} glow={N.verde} />
    <Png id="libro" x={2370} y={60} w={280} t0={E45.write} glow={N.oro} />
    <Png id="reloj_arena" x={3290} y={60} w={220} t0={E45.decide} glow={N.oro} />
  </>
);
const Escena45: React.FC = () => <EscenaMundo tomas={tomas45}><GuardiaPregunta /><PuertasPropias /><UltimaPagina /><DecideAntes /><H45 /></EscenaMundo>;

// ═════════ HUB 46 · "Ten minutes. Set a timer. Or use the oldest door of all." ═════════
const DiezMin: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-90,-40 L90,-40 L90,40 L-90,40 Z", a: 2.6 }]}>
    <TextoNeon y={2} texto="10:00" size={46} color={N.oroClaro} />
  </Glifo>
);
const Timer: D = ({ t, t0, on, tam }) => {
  const a = -((t - t0) * 40);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: circ(0, 10, 66), a: 2.6 }, { d: "M-14,-62 L14,-62 M0,-62 L0,-56", a: 2.4 }]}>
      <path d={`M0,10 L${50 * Math.sin((a * Math.PI) / 180)},${10 - 50 * Math.cos((a * Math.PI) / 180)}`} stroke={N.cianClaro} strokeWidth={4} strokeLinecap="round" />
    </Glifo>
  );
};
const PuertaVieja: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M-60,90 L-60,-30 Q-60,-90 0,-90 Q60,-90 60,-30 L60,90 Z", a: 2.6 }, { d: "M-40,90 L-40,-24 Q-40,-66 0,-66 Q40,-66 40,-24 L40,90 M0,-66 L0,90", a: 1.8, c: N.oro }]}>
    <circle cx={22} cy={20} r={6} fill={N.oroClaro} />
  </Glifo>
);

// ═════════ ESCENA 46 · el celular duerme en la cocina · no puede robarte las 2 de la mañana · la práctica prometida · muy vieja ═════════
const E46 = { room: T("another room", 775), night: T("at night", 776), kitchen: T("the kitchen", 779), steal: T("cannot steal", 779.5), two: T("two in the morning", 780.5), practice: T("practice I promised", 782), old: T("very old", 784) };
const tomas46: Toma[] = [[775.4, 0, 0, 0.94], [780.2, 0, 0, 1.0], [780.6, 1050, 0, 1.12], [782.4, 1050, 0, 1.0], [782.8, 1950, 0, 1.06], [786.0, 1950, 0, 1.12]];
const Casa: React.FC = () => {
  const t = useT();
  const deja = ramp(t, E46.room - 0.4, 1.0, easeOut);
  const noche = ramp(t, E46.night, 0.8);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        {/* corte de una casa: dormitorio | cocina */}
        <path d="M-460,240 L-460,-120 L0,-300 L460,-120 L460,240 Z" fill={`rgba(20,30,60,${0.2 * noche})`} stroke={PIEL} strokeWidth={4} style={glow("#fff", 4)} />
        <path d="M0,-80 L0,240" stroke={PIEL} strokeWidth={4} />
        <rect x={-14} y={80} width={28} height={160} fill="#050506" />
        <path d="M-14,80 L-14,240 L14,240 L14,80" fill="none" stroke={N.oroClaro} strokeWidth={3} opacity={ramp(t, E46.steal, 0.3)} />
        {/* luna */}
        <g transform="translate(-330,-80)" opacity={noche}><circle r={30} fill={N.oroClaro} opacity={0.8} /><circle cx={12} cy={-8} r={26} fill="#0a0d18" /></g>
        {/* cama con la persona dormida */}
        <rect x={-400} y={170} width={300} height={40} rx={10} fill="rgba(5,5,6,.9)" stroke={N.violeta} strokeWidth={3} />
        <circle cx={-360} cy={150} r={22} fill="rgba(5,5,6,.9)" stroke={PIEL} strokeWidth={3} />
        <path d="M-336,160 Q-240,130 -120,165" fill="rgba(5,5,6,.9)" stroke={PIEL} strokeWidth={3} />
        <text x={-330} y={100} fontFamily="serif" fontStyle="italic" fontSize={30} fill={N.violeta} opacity={noche * (0.5 + 0.5 * Math.sin(t * 2))}>z z z</text>
        {/* cocina: mesada y el celular viaja hasta ahí */}
        <rect x={120} y={150} width={300} height={90} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} />
        <path d="M200,60 L200,10 Q200,-10 220,-10 Q240,-10 240,10" fill="none" stroke={N.gris} strokeWidth={3} />
        <g transform={`translate(${lerp(-240, 270, deja)},${lerp(150 - 120 * Math.sin(deja * Math.PI), 135, deja)}) rotate(${lerp(0, 90, deja)})`}><path d={tel(40, 74, 8)} fill={`rgba(160,240,255,${0.1 * (1 - noche)})`} stroke={N.cianClaro} strokeWidth={3} /></g>
        <text x={300} y={100} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={24} fill={N.cianClaro} opacity={noche * ramp(t, E46.kitchen, 0.4)}>sleeping</text>
      </svg>
      <Texto x={0} y={-330} t0={E46.room} texto="another room, *at night*" size={50} color={N.violeta} t1={E46.kitchen} />
      <Texto x={0} y={-330} t0={E46.kitchen} texto="it sleeps in the *kitchen*" size={50} color={N.cianClaro} />
    </>
  );
};
const DosAM: React.FC = () => {
  const t = useT();
  if (t < E46.steal - 0.5) return null;
  const salvo = ramp(t, E46.two + 0.3, 0.6);
  return (
    <>
      <svg width={1} height={1} style={abs(1050, 40)} opacity={ramp(t, E46.steal - 0.5, 0.4)}>
        <rect x={-260} y={-110} width={520} height={220} rx={26} fill="rgba(5,5,6,.9)" stroke={salvo > 0.5 ? N.verde : N.rojo} strokeWidth={5} style={glow(salvo > 0.5 ? N.verde : N.rojo, 12)} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={700} fontSize={130} fill={salvo > 0.5 ? N.verde : N.rojoBorde}>2:07</text>
        <text x={210} y={-70} textAnchor="end" fontFamily="sans-serif" fontWeight={800} fontSize={24} fill={N.texto2}>AM</text>
        {/* el escudo: está a salvo */}
        <g transform={`translate(0,220) scale(${pop(t, E46.two + 0.3, 8)})`} style={glow(N.verde, 10)}><path d="M0,-50 L44,-34 L40,10 Q30,44 0,56 Q-30,44 -40,10 L-44,-34 Z" fill="rgba(80,255,170,.12)" stroke={N.verde} strokeWidth={4} /><path d="M-16,4 L-4,16 L18,-12" fill="none" stroke={N.verde} strokeWidth={5} /></g>
      </svg>
      <Texto x={1050} y={-310} t0={E46.steal} texto="cannot *steal* your 2 a.m." size={52} color={N.verde} />
    </>
  );
};
const Practica: React.FC = () => {
  const t = useT();
  if (t < E46.practice - 0.5) return null;
  const abre = ramp(t, E46.practice, 1.0, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(1950, 40)} opacity={ramp(t, E46.practice - 0.5, 0.4)}>
        {/* loto que se abre */}
        {Array.from({ length: 8 }, (_, i) => { const a = (i - 3.5) * lerp(4, 22, abre); return <path key={i} d="M0,0 Q-40,-90 0,-170 Q40,-90 0,0 Z" transform={`translate(0,100) rotate(${a})`} fill="rgba(255,200,120,.08)" stroke={N.oroClaro} strokeWidth={3.5} style={glow(N.oro, 8)} />; })}
        <ellipse cx={0} cy={110} rx={160} ry={24} fill="none" stroke={N.oro} strokeWidth={3} />
        {/* sello antiguo */}
        <g transform="translate(260,180)" opacity={ramp(t, E46.old, 0.3)}><circle r={50} fill="rgba(255,42,72,.2)" stroke={N.rojo} strokeWidth={4} strokeDasharray="4 4" /><text textAnchor="middle" dominantBaseline="central" fontFamily="serif" fontStyle="italic" fontSize={22} fill={N.rojoBorde}>ancient</text></g>
      </svg>
      <Texto x={1950} y={-300} t0={E46.practice} texto="the *practice* I promised you" size={50} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 46
const H46: React.FC = () => (
  <>
    <Png id="luna" x={-470} y={-170} w={200} t0={E46.night} t1={E46.kitchen} glow={N.violeta} />
    <Png id="cama" x={1510} y={70} w={280} t0={E46.steal} glow={N.violeta} />
    <Png id="loto" x={1950} y={150} w={460} t0={E46.practice} glow={N.oro} />
  </>
);
const Escena46: React.FC = () => <EscenaMundo tomas={tomas46}><Casa /><DosAM /><Practica /><H46 /></EscenaMundo>;

// ═════════ HUB 47 · "very simple. In my tradition, we watch the mind the way you watch clouds" ═════════
const nube = (s = 1) => `M${-60 * s},${20 * s} Q${-90 * s},${20 * s} ${-80 * s},${-6 * s} Q${-76 * s},${-34 * s} ${-44 * s},${-26 * s} Q${-34 * s},${-60 * s} ${2 * s},${-50 * s} Q${30 * s},${-70 * s} ${50 * s},${-34 * s} Q${86 * s},${-34 * s} ${84 * s},${0} Q${84 * s},${22 * s} ${60 * s},${20 * s} Z`;
const NubeHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={PIEL} trazos={[{ d: nube(1), a: 2.6 }]}><g transform={`translate(${6 * Math.sin(t)},0)`}><circle cx={0} cy={-10} r={0} /></g></Glifo>
);
const Tradicion: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: "M0,40 Q-30,-10 0,-70 Q30,-10 0,40 Z M0,40 Q-60,10 -70,-40 Q-20,-20 0,40 Z M0,40 Q60,10 70,-40 Q20,-20 0,40 Z M-80,50 L80,50", a: 2.6 }]} />
);
const OjoMente: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[{ d: "M-80,0 Q0,-60 80,0 Q0,60 -80,0 Z", a: 2.6 }, { d: circ(0, 0, 22), a: 2.4 }]}>
    <path d={nube(0.18)} transform={`translate(${-10 + 14 * Math.sin(t * 1.4)},0)`} fill="none" stroke={N.cianClaro} strokeWidth={2} />
  </Glifo>
);
const NubeChica: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.gris} trazos={[]}><path d={nube(1)} fill="rgba(230,238,255,.05)" stroke={N.texto2} strokeWidth={3} /></Glifo>
);

// ═════════ ESCENA 47 · las nubes pasan · urge surfing (surfista en la ola) · sentís el tirón · no lo agarres · tampoco pelees ═════════
const E47 = { sky: T("in the sky", 792), today: T("Some people today", 792), surfing: T("urge surfing", 795.5), pull: T("feel the pull", 797.5), pick: T("to pick up", 798.5), donot: T("do not pick", 800), fight: T("not fight it", 802) };
const tomas47: Toma[] = [[791.7, 0, 0, 1.0], [793.7, 0, 0, 0.96], [794.2, 1000, 0, 1.06], [797.8, 1000, 0, 1.0], [798.1, 1950, 0, 1.06], [801.7, 1950, 0, 1.0], [802.1, 2850, 0, 1.08], [803.4, 2850, 0, 1.14]];
const Cielo: React.FC = () => {
  const t = useT();
  const N7 = [[-300, -160, 1.2, N.cianClaro, "ping"], [120, -60, 0.9, N.violeta, "?"], [-80, 120, 1.0, N.rojoBorde, "1"], [320, 160, 1.3, N.oroClaro, "like"], [0, -260, 0.8, PIEL, ""]] as const;
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        {N7.map(([x, y, s, c, txt], i) => { const dx = ((t * (30 + i * 8) + i * 300) % 1400) - 700; return <g key={i} transform={`translate(${x + dx},${y})`} opacity={ramp(t, 791.4 + i * 0.1, 0.5) * (1 - Math.abs(dx) / 760)} style={glow(c, 6)}><path d={nube(s * 1.6)} fill="rgba(230,238,255,.04)" stroke={c} strokeWidth={3} />{txt && <text y={-10} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={800} fontSize={30} fill={c}>{txt}</text>}</g>; })}
        {/* el que observa, quieto */}
        <Persona x={0} y={300} s={0.8} c={N.oroClaro} />
      </svg>
      <Texto x={0} y={-330} t0={E47.sky - 0.3} texto="clouds *passing* in the sky" size={50} />
    </>
  );
};
const Surf: React.FC = () => {
  const t = useT();
  if (t < E47.today - 0.5) return null;
  const sube = (Math.sin((t - E47.surfing) * 1.2) + 1) / 2;
  const ola = (x: number) => 120 - 180 * Math.exp(-((x - 60) ** 2) / 26000) * (0.5 + 0.6 * sube) + 10 * Math.sin(x / 40 + t * 3);
  const pts = Array.from({ length: 41 }, (_, i) => -440 + i * 22);
  const crest = 60;
  return (
    <>
      <svg width={1} height={1} style={abs(1000, 40)} opacity={ramp(t, E47.today - 0.5, 0.4)}>
        <path d={`M-440,260 ${pts.map((x) => `L${x},${ola(x).toFixed(1)}`).join(" ")} L440,260 Z`} fill="rgba(80,200,255,.1)" stroke={N.cian} strokeWidth={4} style={glow(N.cian, 10)} />
        <path d={`M${crest - 40},${ola(crest - 40)} Q${crest + 30},${ola(crest) - 60} ${crest + 70},${ola(crest + 60)}`} fill="none" stroke={N.cianClaro} strokeWidth={3} />
        {/* surfista sobre la cresta */}
        <g transform={`translate(${crest - 10},${ola(crest - 10) - 8}) rotate(${-10 + 8 * Math.sin(t * 2)})`} style={glow(N.oroClaro, 6)}>
          <ellipse cx={0} cy={0} rx={70} ry={10} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3} />
          <path d="M-20,-4 L-6,-60 L20,-4 M-6,-60 L-6,-100 M-40,-84 L-6,-80 L30,-90" fill="none" stroke={PIEL} strokeWidth={5} strokeLinecap="round" />
          <circle cx={-6} cy={-118} r={15} fill="rgba(5,5,6,.9)" stroke={PIEL} strokeWidth={4} />
        </g>
      </svg>
      <Texto x={1000} y={-320} t0={E47.surfing} texto="*urge* surfing" size={66} color={N.cianClaro} />
    </>
  );
};
const ElTiron: React.FC = () => {
  const t = useT();
  if (t < E47.pull - 0.5) return null;
  const tira = ramp(t, E47.pull, 1.4, easeOut);
  const frena = ramp(t, E47.donot + 0.2, 0.3);
  const x = lerp(-300, lerp(-80, -160, frena), tira);
  return (
    <>
      <svg width={1} height={1} style={abs(1950, 40)} opacity={ramp(t, E47.pull - 0.5, 0.4)}>
        <path d={tel(150, 270, 22)} transform="translate(250,0)" fill="rgba(160,240,255,.06)" stroke={N.cianClaro} strokeWidth={4} style={glow(N.cian, 8 + 6 * Math.sin(t * 6))} />
        {/* líneas de atracción del imán */}
        {[0, 1, 2].map((i) => { const d = (t * 1.2 + i / 3) % 1; return <path key={i} d={`M${170 - d * 200},-40 Q${150 - d * 200},0 ${170 - d * 200},40`} fill="none" stroke={N.rojoBorde} strokeWidth={3} opacity={(1 - d) * (1 - frena)} />; })}
        {/* la mano estirándose */}
        <g transform={`translate(${x},0)`} style={glow(PIEL, 6)}>
          <path d="M-300,30 L-60,30 L-60,-30 L-300,-30" fill="rgba(5,5,6,.85)" stroke={PIEL} strokeWidth={4} />
          <path d="M-60,-30 L20,-34 M-60,-12 L36,-14 M-60,8 L32,8 M-60,26 L16,28 M-70,-30 L-30,-70" stroke={PIEL} strokeWidth={14} strokeLinecap="round" />
        </g>
        {/* la línea de "no lo agarres" */}
        <path d="M120,-180 L120,180" stroke={N.oroClaro} strokeWidth={5} strokeDasharray="14 10" opacity={frena} style={glow(N.oro, 10)} />
      </svg>
      <Texto x={1950} y={-310} t0={E47.pull} texto="you feel the *pull*" size={52} color={N.rojoBorde} t1={E47.donot} />
      <Texto x={1950} y={-310} t0={E47.donot} texto="do *not* pick it up" size={54} color={N.oroClaro} />
    </>
  );
};
const NoPelear: React.FC = () => {
  const t = useT();
  if (t < E47.fight - 0.5) return null;
  const k = ramp(t, E47.fight + 0.2, 0.6);
  return (
    <>
      <svg width={1} height={1} style={abs(2850, 40)} opacity={ramp(t, E47.fight - 0.5, 0.4)}>
        <g style={glow(N.rojo, 8)}><path d="M-90,-60 Q-90,-110 -30,-110 L40,-110 Q100,-110 100,-50 L100,30 Q100,80 40,80 L-40,80 Q-90,80 -90,30 Z" fill="rgba(255,42,72,.15)" stroke={N.rojo} strokeWidth={5} /><path d="M-90,-20 Q-130,-20 -130,20 Q-130,50 -90,50" fill="none" stroke={N.rojo} strokeWidth={5} /><rect x={-60} y={80} width={130} height={60} fill="none" stroke={N.rojo} strokeWidth={4} /></g>
        <path d={`M-170,-170 L${-170 + 340 * k},${-170 + 340 * k}`} stroke={N.oroClaro} strokeWidth={10} strokeLinecap="round" style={glow(N.oro, 10)} />
      </svg>
      <Texto x={2850} y={-300} t0={E47.fight} texto="and do not *fight* it" size={54} />
    </>
  );
};
// objetos de vidrio de la escena 47
const H47: React.FC = () => (
  <>
    <Png id="nube" x={470} y={-120} w={280} t0={E47.sky} glow={N.cian} />
    <Png id="surfista" x={1470} y={60} w={300} t0={E47.surfing} glow={N.cian} />
  </>
);
const Escena47: React.FC = () => <EscenaMundo tomas={tomas47}><Cielo /><Surf /><ElTiron /><NoPelear /><H47 /></EscenaMundo>;

export const SEGS_M12: Seg[] = [
  {
    hub: { portal: "home", orbs: [
      { id: "pesa", t: T("the lever heavy", 737), ang: 198, anillo: 1, tam: 170, D: PalancaPesa },
      { id: "apps", t: T("Move the apps", 738.5), ang: 128, anillo: 2, tam: 160, D: AppsVuelan },
      { id: "home", t: T("home screen", 741), ang: -14, anillo: 0, tam: 240, D: HomeHub },
    ] },
    Escena: Escena44,
    sonidos: (s) => { Array.from({ length: 7 }, (_, i) => s.add("vuelo", E44.folder - 0.2 + i * 0.14, 0.25)); s.add("vuelo", 745.4, 0.5); s.add("toque", E44.logout + 0.5, 0.6); s.add("cierre", E44.logout + 1.0, 0.6); s.add("vuelo", 747.7, 0.5); s.add("ola", E44.bw, 0.4); s.add("vacio", E44.candy, 0.4); },
  },
  {
    hub: { portal: "guardia", orbs: [
      { id: "escal", t: T("small step of", 753), ang: 198, anillo: 1, tam: 160, D: Escalones },
      { id: "guardia", t: T("wise guard", 755), ang: -14, anillo: 0, tam: 240, D: GuardianDespierta },
      { id: "frente", t: T("your forehead", 756.8), ang: 128, anillo: 2, tam: 150, D: Frente2 },
    ] },
    Escena: Escena45,
    sonidos: (s) => { s.add("luz", E45.wake + 0.3, 0.5); s.add("aparece", E45.ask, 0.5); s.add("vuelo", 762.0, 0.5); s.add("golpe", E45.third, 0.4); [0, 1, 2].forEach((i) => s.add("traza", E45.doors + i * 0.35, 0.4)); s.add("vuelo", 764.6, 0.5); s.add("traza", E45.write + 0.2, 0.6); s.add("vuelo", 769.3, 0.5); s.add("aparece", E45.decide + 0.2, 0.5); },
  },
  {
    hub: { portal: "puerta", orbs: [
      { id: "diez", t: T("Ten minutes", 770.5), ang: 198, anillo: 1, tam: 170, D: DiezMin },
      { id: "timer", t: T("Set a timer", 772), ang: 128, anillo: 2, tam: 160, D: Timer },
      { id: "puerta", t: T("oldest door", 773.5), ang: -14, anillo: 0, tam: 240, D: PuertaVieja, png: "puerta" },
    ] },
    Escena: Escena46,
    sonidos: (s) => { s.add("vuelo", E46.room - 0.3, 0.5); s.add("toque", E46.room + 0.6, 0.5); s.add("ola", E46.night, 0.3); s.add("cierre", E46.steal, 0.5); s.add("vuelo", 780.6, 0.5); s.add("premio", E46.two + 0.3, 0.4); s.add("vuelo", 782.8, 0.5); s.add("luz", E46.practice, 0.5); },
  },
  {
    hub: { portal: "nube", orbs: [
      { id: "trad", t: T("my tradition", 787), ang: 198, anillo: 1, tam: 160, D: Tradicion },
      { id: "ojo", t: T("watch the mind", 788), ang: 128, anillo: 2, tam: 160, D: OjoMente },
      { id: "n1", t: T("watch clouds", 790.3) - 0.2, ang: 60, anillo: 2, tam: 140, D: NubeChica },
      { id: "n2", t: T("watch clouds", 790.3) - 0.1, ang: 250, anillo: 1, tam: 120, D: NubeChica },
      { id: "nube", t: T("watch clouds", 790.3), ang: -14, anillo: 0, tam: 240, D: NubeHub, png: "nube" },
    ] },
    Escena: Escena47,
    sonidos: (s) => { s.add("ola", E47.sky, 0.3); s.add("vuelo", 794.2, 0.5); s.add("ola", E47.surfing, 0.6); s.add("vuelo", 798.1, 0.5); s.add("tiron", E47.pull, 0.5); s.add("cierre", E47.donot + 0.2, 0.6); s.add("vuelo", 802.1, 0.5); s.add("traza", E47.fight + 0.2, 0.5); },
  },
];
