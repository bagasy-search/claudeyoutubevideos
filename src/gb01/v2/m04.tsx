// gb01 v2 · MINUTO 4 (ventanas 12-15, 204-268 s): cada tirón puede ser el grande · tres cartas (alguien que querés /
// un video / nada) · el primer engranaje encaja · el humano antiguo y las bayas · pull-to-refresh en macro · palanca = gesto.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, rnd, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { EscenaMundo, Obj, Texto, circ, Png } from "./esc";
import { EngranajeSvg } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
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
      <TextoNeon y={68} texto="the big one" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.4, 0.3)} />
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
const tomas12: Toma[] = [[210.0, 0, 0, 1.0], [216.4, 0, 0, 1.06], [217.6, 0, -30, 0.96], [219.9, 0, -30, 0.98], [220.4, 860, 0, 1.0], [221.6, 860, 0, 1.05]];
const Carta: React.FC<{ x: number; t0: number; tVuelta: number; tBaraja: number; i: number; children: React.ReactNode; color: string }> = ({ x, t0, tVuelta, tBaraja, i, children, color }) => {
  const t = useT();
  if (t < t0 - 0.1) return null;
  const abre = ramp(t, tVuelta, 0.35), cierra = ramp(t, tBaraja, 0.3);
  const cara = abre * (1 - cierra);
  const sx = Math.abs(Math.cos((1 - cara) * Math.PI)) * 0.0 + Math.abs(lerp(1, -1, cara)) ; // vuelta en X
  const mezcla = ramp(t, tBaraja + 0.3, 1.6);
  const xx = mezcla > 0 && mezcla < 1 ? x + Math.sin(mezcla * Math.PI * 3 + i * 2.1) * 260 * Math.sin(mezcla * Math.PI) : x;
  const s = 0.8 + 0.2 * pop(t, t0, 12);
  const muestraCara = cara > 0.5;
  return (
    <div style={{ position: "absolute", left: xx, top: 0, transform: `scale(${s}) scaleX(${Math.max(0.04, sx)})`, opacity: ramp(t, t0, 0.3) }}>
      <svg width={1} height={1} style={{ overflow: "visible" }}>
        <rect x={-120} y={-170} width={240} height={340} rx={18} fill={muestraCara ? "rgba(255,255,255,.04)" : "rgba(183,123,255,.10)"} stroke={muestraCara ? color : N.violeta} strokeWidth={4} style={glow(muestraCara ? color : N.violeta, 10)} />
        {!muestraCara && <><path d="M-80,-130 L80,130 M80,-130 L-80,130" stroke={N.violeta} strokeWidth={1.5} opacity={0.4} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={110} fill={N.violeta} style={glow(N.violeta)}>?</text></>}
        {muestraCara && children}
      </svg>
    </div>
  );
};
const PulgarScroll: React.FC = () => {
  const t = useT();
  if (t < E12.thumb - 0.5) return null;
  const y = 40 * Math.sin((t - E12.thumb) * 7);
  return (
    <>
      <Obj x={860} y={0} t0={E12.thumb - 0.5} tam={200} color={N.cianClaro} trazos={[
        { d: "M-110,-210 Q-110,-230 -90,-230 L90,-230 Q110,-230 110,-210 L110,210 Q110,230 90,230 L-90,230 Q-110,230 -110,210 Z", a: 2.6 },
      ]} />
      <svg width={1} height={1} style={abs(860, 0)}>
        {Array.from({ length: 6 }, (_, i) => { const yy = ((i * 80 - (t - E12.thumb) * 420) % 480 + 480) % 480 - 220; return <rect key={i} x={-86} y={yy} width={172} height={60} rx={8} fill="none" stroke={N.gris} strokeWidth={2} />; })}
        <g transform={`translate(70,${80 + y})`} style={glow(N.oro)}>
          <path d="M-20,60 L-20,-20 Q-20,-44 0,-44 Q20,-44 20,-20 L20,60" fill="rgba(5,5,6,.85)" stroke={N.oroClaro} strokeWidth={4} />
          <path d="M-12,-30 Q0,-38 12,-30" stroke={N.oroClaro} strokeWidth={2} fill="none" />
        </g>
      </svg>
      <Texto x={860} y={-300} t0={E12.thumb} texto="keeps your thumb *moving*" size={44} color={N.oroClaro} />
    </>
  );
};
// objetos de vidrio de la escena 12
const H12: React.FC = () => (
  <>
    <Png id="dedo" x={1280} y={60} w={200} t0={E12.thumb} glow={N.cian} />
  </>
);
const Escena12: React.FC = () => {
  const t = useT();
  const late = 1 + 0.08 * Math.sin(t * 9);
  return (
    <EscenaMundo tomas={tomas12}><H12 />
      <Carta x={-330} t0={E12.msg - 0.5} tVuelta={E12.msg} tBaraja={E12.dont} i={0} color={N.rojoBorde}>
        <g transform={`translate(0,-40) scale(${late})`}><path d="M0,40 C-80,-10 -60,-80 0,-40 C60,-80 80,-10 0,40 Z" fill="rgba(255,42,72,.25)" stroke={N.rojo} strokeWidth={4} style={glow(N.rojo)} /></g>
        <rect x={-80} y={50} width={160} height={50} rx={14} fill="none" stroke={N.rojoBorde} strokeWidth={2.5} />
        <path d="M-60,70 L40,70 M-60,84 L10,84" stroke={N.rojoBorde} strokeWidth={2} />
      </Carta>
      <Carta x={0} t0={E12.video - 0.5} tVuelta={E12.video} tBaraja={E12.dont + 0.1} i={1} color={N.cianClaro}>
        <rect x={-90} y={-90} width={180} height={120} rx={10} fill="none" stroke={N.cianClaro} strokeWidth={3} />
        <path d="M-18,-56 L26,-30 L-18,-4 Z" fill={N.cian} style={glow(N.cian)} />
        <g transform="translate(0,96)" style={glow(N.oro)}><circle r={36} fill="none" stroke={N.oro} strokeWidth={4} /><path d="M-18,-10 q6,-8 12,0 M6,-10 q6,-8 12,0" stroke={N.oro} strokeWidth={3.5} fill="none" /><path d="M-20,6 Q0,30 20,6 Z" fill={N.oro} /></g>
      </Carta>
      <Carta x={330} t0={E12.nada - 0.4} tVuelta={E12.nada} tBaraja={E12.dont + 0.2} i={2} color={N.gris}>
        <path d="M-60,-20 L60,-20 M-40,20 L40,20" stroke={N.gris} strokeWidth={3} strokeDasharray="8 10" />
        <text y={100} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={34} fill={N.texto2}>nothing</text>
      </Carta>
      <Texto x={-330} y={230} t0={E12.love} texto="someone you *love*" size={34} color={N.rojoBorde} t1={E12.dont + 0.2} />
      <Texto x={0} y={230} t0={E12.video + 0.2} texto="a funny *video*" size={34} color={N.cianClaro} t1={E12.dont + 0.2} />
      <Texto x={330} y={230} t0={E12.nada + 0.2} texto="*nothing*" size={34} color={N.texto2} t1={E12.dont + 0.2} />
      <Texto x={0} y={-300} t0={E12.dont} texto="you don't *know*" size={64} color={N.violeta} />
      <Texto x={0} y={270} t0={E12.not} texto="and that *not knowing*…" size={46} color={N.oroClaro} />
      <PulgarScroll />
    </EscenaMundo>
  );
};

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
    <TextoNeon y={86} texto="the maybe" size={24} serif color={N.oroClaro} on={ramp(t, T("the maybe", 223.5), 0.3)} />
  </Glifo>
);
const Uno: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[{ d: circ(0, 0, 60), a: 2.2 }]}>
    <TextoNeon y={4} texto="1/4" size={44} color={N.oroClaro} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 13 · el regalo cerrado · el cerebro antiguo · el humano y las bayas · engranaje 2 = la palanca ═════════
const E13 = { never: T("phone never tells", 225), built: T("brain was built", 228), long: T("very long time ago", 229), chase: T("chase anything uncertain", 231), food: T("might be food", 233), second: T("second gear", 234.5), lever: T("the lever", 235.5) };
const tomas13: Toma[] = [[224.6, 0, 0, 1.26], [227.9, 0, 0, 1.12], [228.6, 520, 0, 1.0], [230.9, 940, 0, 1.06], [234.2, 940, 20, 1.14], [234.8, 1760, 0, 1.12], [237.2, 1760, 0, 1.2]];
const Regalo: React.FC = () => {
  const t = useT();
  const tiembla = Math.sin(t * 40) * 3 * ramp(t, E13.never + 0.6, 0.2) * (1 - ramp(t, E13.built - 0.2, 0.3));
  return (
    <>
      <Obj x={tiembla} y={40} t0={E13.never - 0.5} tam={200} color={N.violeta} trazos={[
        { d: "M-130,-40 L130,-40 L130,140 L-130,140 Z", a: 2.6, f: "rgba(183,123,255,.06)" },
        { d: "M-150,-90 L150,-90 L150,-40 L-150,-40 Z", a: 2.6 },
        { d: "M0,-90 L0,140", c: N.oro, a: 3 },
        { d: "M0,-90 Q-60,-170 -80,-120 Q-70,-90 0,-90 Q60,-170 80,-120 Q70,-90 0,-90", c: N.oro, a: 3 },
      ]}>
        <TextoNeon x={70} y={50} texto="?" size={80} color={N.oroClaro} on={neonOn(t, E13.never + 0.6)} />
      </Obj>
      <Texto x={0} y={-290} t0={E13.never} texto="what is *waiting*?" size={50} color={N.violeta} />
    </>
  );
};
// línea del tiempo que corre hacia atrás: el teléfono de hoy → el fuego → el bosque
const Linea: React.FC = () => {
  const t = useT();
  if (t < E13.built - 0.2) return null;
  const k = ramp(t, E13.long, 1.6, easeOut);
  const anos = Math.round(lerp(0, 200000, k));
  return (
    <svg width={1} height={1} style={abs(520, 300)} opacity={ramp(t, E13.built - 0.2, 0.3) * (1 - ramp(t, E13.chase + 0.8, 0.5))}>
      <path d={`M300,0 L${300 - 600 * ramp(t, E13.built, 0.8, easeOut)},0`} stroke="#e6eeff" strokeWidth={3} style={glow("#fff", 6)} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${300 - i * 100},-10 L${300 - i * 100},10`} stroke={N.gris} strokeWidth={2} opacity={ramp(t, E13.built + i * 0.1, 0.2)} />)}
      <text x={300} y={-26} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={20} fill={N.cianClaro}>today</text>
      <text x={-300} y={-26} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={30} fill={N.oroClaro} opacity={ramp(t, E13.long, 0.3)} style={glow(N.oro, 6)}>{anos.toLocaleString("en-US")} years</text>
      <circle cx={300 - 600 * k} cy={0} r={9} fill={N.oro} style={glow(N.oro)} />
    </svg>
  );
};
const Bayas: React.FC = () => {
  const t = useT();
  const brazo = ramp(t, E13.chase + 0.2, 0.6, easeOut);
  const BX = [[90, -120, 1], [150, -60, 0], [60, -40, 1], [180, -150, 0], [120, -190, 1], [40, -170, 0], [200, -90, 1]] as const;
  return (
    <>
      {/* arbusto */}
      <Obj x={1060} y={40} t0={E13.chase - 0.6} tam={200} color={N.verde} trazos={[
        { d: "M-60,140 Q-110,60 -60,0 Q-90,-80 -10,-110 Q20,-190 100,-150 Q190,-170 200,-80 Q260,-20 200,60 Q220,140 120,140 Z", a: 2.2, f: "rgba(141,255,160,.04)" },
        { d: "M60,140 L60,40 M60,60 L20,20 M60,80 L110,30", a: 1.6 },
      ]} />
      <svg width={1} height={1} style={abs(1060, 40)}>
        {BX.map(([x, y, si], i) => {
          const on = neonOn(t, E13.food - 0.2 + i * 0.08);
          return si ? <circle key={i} cx={x} cy={y} r={13} fill={N.rojo} opacity={on} style={glow(N.rojo)} />
            : <circle key={i} cx={x} cy={y} r={12} fill="none" stroke={N.gris} strokeWidth={2} strokeDasharray="4 5" opacity={on} />;
        })}
      </svg>
      {/* humano antiguo: silueta agachada que estira el brazo */}
      <Obj x={820} y={60} t0={E13.chase - 0.5} tam={200} color="#e6eeff" trazos={[
        { d: circ(0, -150, 34), a: 2.6 },
        { d: "M0,-116 Q-20,-40 -10,40 L-50,150 M-10,40 L30,150", a: 2.6 },
        { d: "M-4,-90 Q-40,-50 -60,-10", a: 2.4 },
      ]} />
      <svg width={1} height={1} style={abs(820, 60)}>
        <path d={`M-4,-90 Q${lerp(30, 120, brazo)},${lerp(-60, -110, brazo)} ${lerp(50, 200, brazo)},${lerp(-40, -130, brazo)}`} fill="none" stroke="#e6eeff" strokeWidth={4} strokeLinecap="round" style={glow("#fff", 6)} opacity={ramp(t, E13.chase - 0.3, 0.3)} />
      </svg>
      <Texto x={940} y={-290} t0={E13.chase} texto="chase anything *uncertain*" size={46} />
      <Texto x={940} y={270} t0={E13.food} texto="that might be *food*" size={42} color={N.rojoBorde} />
    </>
  );
};
const Engr2: React.FC = () => {
  const t = useT();
  if (t < E13.second - 0.2) return null;
  const sube = ramp(t, E13.second, 0.7, easeOut);
  const pl = ramp(t, E13.lever + 0.1, 0.25) * (1 - ramp(t, E13.lever + 0.6, 0.3));
  return (
    <>
      <div style={{ position: "absolute", left: 1760, top: 120 - 160 * sube, opacity: sube, transform: `rotate(${t * 40}deg) scale(${0.6 + 0.4 * sube})` }}>
        <EngranajeSvg r={100} color={N.oro} n={2} />
      </div>
      <svg width={1} height={1} style={abs(1940, -20)} opacity={ramp(t, E13.lever, 0.3)}>
        <g stroke={N.oro} strokeWidth={6} fill="none" strokeLinecap="round" style={glow(N.oro)}>
          <path d="M0,0 L0,140" /><path d={`M0,40 L${lerp(60, 70, pl)},${lerp(-90, 40, pl)}`} /><circle cx={lerp(60, 70, pl)} cy={lerp(-104, 50, pl)} r={16} fill={N.rojo} stroke={N.rojo} />
        </g>
      </svg>
      <Texto x={1800} y={-260} t0={E13.second} texto="the *second gear*" size={56} color={N.oroClaro} />
      <Texto x={1800} y={250} t0={E13.lever} texto="the *lever*" size={50} color={N.oro} />
    </>
  );
};
// objetos de vidrio de la escena 13
const H13: React.FC = () => (
  <>
    <Png id="bayas" x={1360} y={60} w={200} t0={E13.food} glow={N.rojo} />
    <Png id="palanca" x={2180} y={60} w={220} t0={E13.lever} glow={N.rojo} />
  </>
);
const Escena13: React.FC = () => (
  <EscenaMundo tomas={tomas13}><H13 />
    <Regalo />
    <Linea />
    <Bayas />
    <Engr2 />
  </EscenaMundo>
);

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
const tomas14: Toma[] = [[240.2, 0, -120, 1.2], [242.4, 0, -60, 1.05], [244.0, 0, -160, 1.25], [246.4, 0, -60, 0.95], [249.0, 0, 0, 0.8], [250.6, 0, 0, 0.76]];
const RefrescoMacro: React.FC = () => {
  const t = useT();
  const tira = ramp(t, E14.pull, 1.6, easeOut) * (1 - ramp(t, E14.drops - 0.3, 0.35));
  const estira = tira * 170;
  const giro = t > E14.wheel - 0.3 && t < E14.drops ? (t - E14.wheel) * 720 : 0;
  const ruedaOn = ramp(t, E14.wheel - 0.4, 0.3) * (1 - ramp(t, E14.drops, 0.3));
  const cae = ramp(t, E14.drops, 0.7, easeOut);
  const sombra = ramp(t, E14.remind + 0.3, 0.8);
  const viejos = [0, 1, 2, 3];
  return (
    <>
      {/* el fantasma de la tragamonedas detrás del celular */}
      <svg width={1} height={1} style={abs(0, 0)} opacity={0.5 * sombra}>
        <path d="M-260,-300 L260,-300 L290,360 L-290,360 Z" fill="none" stroke={N.oro} strokeWidth={3} strokeDasharray="10 12" style={glow(N.oro)} />
        <path d="M290,-60 L360,-60 L360,-260" fill="none" stroke={N.oro} strokeWidth={6} />
        <circle cx={360} cy={-280} r={22} fill="none" stroke={N.rojo} strokeWidth={4} />
      </svg>
      <Obj x={0} y={0} t0={E14.pull - 0.6} tam={200} color={N.cianClaro} trazos={[
        { d: "M-190,-380 Q-190,-410 -160,-410 L160,-410 Q190,-410 190,-380 L190,380 Q190,410 160,410 L-160,410 Q-190,410 -190,380 Z", a: 3 },
        { d: "M-40,-392 L40,-392", a: 2.4 },
      ]} />
      <svg width={1} height={1} style={abs(0, 0)}>
        <defs><clipPath id="cl14"><rect x={-180} y={-372} width={360} height={772} rx={20} /></clipPath></defs>
        <g clipPath="url(#cl14)">
          {/* rueda */}
          <g transform={`translate(0,${-372 + estira * 0.55}) rotate(${giro})`} opacity={ruedaOn}>
            {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 16} y1={Math.sin(a) * 16} x2={Math.cos(a) * 34} y2={Math.sin(a) * 34} stroke={N.cianClaro} strokeWidth={5} strokeLinecap="round" opacity={0.25 + 0.75 * (i / 10)} />; })}
          </g>
          {/* contenido nuevo que cae */}
          {[0, 1].map((i) => (
            <g key={"n" + i} transform={`translate(0,${lerp(-600, -330 + i * 150, cae)})`} opacity={cae}>
              <rect x={-150} y={0} width={300} height={130} rx={14} fill="rgba(244,194,74,.08)" stroke={N.oro} strokeWidth={3} style={glow(N.oro)} />
              <circle cx={-104} cy={40} r={22} fill="none" stroke={N.oroClaro} strokeWidth={3} />
              <path d="M-66,30 L110,30 M-66,56 L60,56 M-130,96 L110,96" stroke={N.oroClaro} strokeWidth={3} />
            </g>
          ))}
          {/* contenido viejo, estirado como goma */}
          {viejos.map((i) => {
            const y0 = -330 + i * 170 + estira * (1 - i * 0.12) + cae * 300;
            return (
              <g key={i} transform={`translate(0,${y0}) scale(1,${1 + tira * 0.12 * (3 - i) / 3})`}>
                <rect x={-150} y={0} width={300} height={140} rx={14} fill="none" stroke={N.gris} strokeWidth={2.5} />
                <circle cx={-104} cy={40} r={22} fill="none" stroke={N.gris} strokeWidth={2} />
                <path d="M-66,30 L110,30 M-66,56 L60,56" stroke={N.gris} strokeWidth={2} />
              </g>
            );
          })}
        </g>
        {/* dedo que tira */}
        <g transform={`translate(110,${-300 + estira})`} opacity={ramp(t, E14.pull - 0.3, 0.3) * (1 - ramp(t, E14.drops - 0.3, 0.3))} style={glow(N.oro)}>
          <path d="M-26,-140 L-26,-20 Q-26,10 0,10 Q26,10 26,-20 L26,-140" fill="rgba(5,5,6,.85)" stroke={N.oroClaro} strokeWidth={4} />
        </g>
      </svg>
      <Texto x={-430} y={-260} t0={E14.stretch} texto="the screen *stretches*" size={42} t1={E14.drops} ancla="c" />
      <Texto x={430} y={-180} t0={E14.wheel} texto="a little wheel *spins*" size={42} color={N.cianClaro} t1={E14.remind} />
      <Texto x={430} y={-80} t0={E14.drops} texto="new content *drops in*" size={42} color={N.oroClaro} t1={E14.remind + 0.6} />
      <Texto x={0} y={470} t0={E14.remind} texto="does that remind you of *anything*?" size={50} color={N.oro} />
    </>
  );
};
// objetos de vidrio de la escena 14
const H14: React.FC = () => (
  <>
    <Png id="rueda_carga" x={430} y={120} w={170} t0={E14.wheel} t1={E14.remind} glow={N.cian} />
  </>
);
const Escena14: React.FC = () => <EscenaMundo tomas={tomas14}><RefrescoMacro /><H14 /></EscenaMundo>;

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
    <TextoNeon y={86} texto="you wait" size={22} serif color={N.violeta} on={ramp(t, t0 + 0.2, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 15 · espejo: tirón de palanca = tirón del dedo · la espera es parte del placer · el inventor ═════════
const E15 = { waiting: T("waiting is part", 256), pleasure: T("of the pleasure", 256), phone: T("Your phone gives", 258), pull: T("same pull", 259), spin: T("same spin", 260), wait: T("same short wait", 261), inventor: T("the inventor", 263), gesture: T("pull-down gesture", 265.5), said: T("has said", 266.5) };
const tomas15: Toma[] = [[256.2, 0, 0, 1.12], [259.0, 0, 0, 1.0], [263.9, 0, 0, 1.02], [264.6, 1100, 0, 1.1], [268.6, 1100, 0, 1.2]];
const Espejo: React.FC = () => {
  const t = useT();
  const golpes = [E15.pull, E15.spin, E15.wait];
  const tPull = [E15.waiting - 0.3, E15.pull];
  const pl = Math.max(0, ...tPull.map((tp) => ramp(t, tp, 0.22) * (1 - ramp(t, tp + 0.45, 0.35))));
  const ts = Math.max(...tPull.filter((x) => x <= t), -99);
  const giro = t - ts < 2.2 ? (t - ts) * 600 * Math.max(0, 1 - (t - ts) / 2.2) : 0;
  const espera = ramp(t, E15.waiting, 1.6);
  return (
    <>
      {/* tragamonedas izquierda */}
      <Obj x={-330} y={20} t0={E15.waiting - 0.6} tam={200} color={N.oro} trazos={[
        { d: "M-150,-200 L150,-200 L170,220 L-170,220 Z", a: 2.6, f: "rgba(244,194,74,.04)" },
        { d: "M-110,-80 L110,-80 L110,40 L-110,40 Z M-36,-80 L-36,40 M36,-80 L36,40", a: 2 },
      ]} />
      <svg width={1} height={1} style={abs(-330, 20)}>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-72 + i * 72},-20)`}><path d={`M-20,${-20 + (giro * (1 + i * 0.3)) % 40 - 20} l40,0`} stroke={N.oroClaro} strokeWidth={4} opacity={giro ? 0.7 : 0} /><text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={50} fill={N.oroClaro} opacity={giro ? 0.25 : 1}>7</text></g>)}
        <g stroke={N.oro} strokeWidth={7} strokeLinecap="round" fill="none" style={glow(N.oro)}>
          <path d="M170,-20 L210,-20" /><path d={`M210,-20 L${lerp(230, 236, pl)},${lerp(-170, 120, pl)}`} />
        </g>
        <circle cx={lerp(230, 236, pl)} cy={lerp(-186, 136, pl)} r={20} fill={N.rojo} style={glow(N.rojo)} />
      </svg>
      {/* línea espejo */}
      <svg width={1} height={1} style={abs(0, 0)} opacity={ramp(t, E15.phone, 0.4)}>
        <path d="M0,-300 L0,300" stroke={N.gris} strokeWidth={2} strokeDasharray="6 10" />
      </svg>
      {/* celular derecha */}
      <Obj x={330} y={20} t0={E15.phone - 0.3} tam={200} color={N.cianClaro} trazos={[
        { d: "M-110,-210 Q-110,-230 -90,-230 L90,-230 Q110,-230 110,-210 L110,210 Q110,230 90,230 L-90,230 Q-110,230 -110,210 Z", a: 2.6 },
      ]} />
      <svg width={1} height={1} style={abs(330, 20)} opacity={ramp(t, E15.phone, 0.3)}>
        <g transform={`translate(0,${-170 + 70 * pl}) rotate(${giro * 1.5})`}>{Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 10} y1={Math.sin(a) * 10} x2={Math.cos(a) * 22} y2={Math.sin(a) * 22} stroke={N.cianClaro} strokeWidth={4} opacity={(giro ? 1 : 0.2) * (0.3 + 0.7 * i / 8)} />; })}</g>
        {[0, 1, 2].map((i) => <rect key={i} x={-86} y={-120 + i * 110 + 70 * pl} width={172} height={90} rx={10} fill="none" stroke={N.gris} strokeWidth={2.4} />)}
        <path d={`M60,${-160 + 160 * pl} L60,${-40 + 160 * pl}`} stroke={N.oroClaro} strokeWidth={30} strokeLinecap="round" opacity={0.85 * ramp(t, E15.pull - 0.4, 0.2)} style={glow(N.oro)} />
      </svg>
      {/* medidor de placer en la espera */}
      <svg width={1} height={1} style={abs(-330, 310)} opacity={ramp(t, E15.waiting, 0.3) * (1 - ramp(t, E15.phone, 0.4))}>
        <rect x={-160} y={-14} width={320} height={28} rx={14} fill="none" stroke={N.violeta} strokeWidth={3} />
        <rect x={-156} y={-10} width={312 * espera} height={20} rx={10} fill={N.violeta} opacity={0.7} style={glow(N.violeta)} />
      </svg>
      <Texto x={-330} y={-300} t0={E15.waiting} texto="the waiting is *pleasure*" size={44} color={N.violeta} t1={E15.phone} />
      {["same *pull*", "same *spin*", "same *short wait*"].map((s, i) => (
        <Texto key={i} x={0} y={-300 + 0 * i} t0={golpes[i]} t1={i < 2 ? golpes[i + 1] : Infinity} texto={s} size={60} color={[N.oroClaro, N.cianClaro, N.violeta][i]} />
      ))}
    </>
  );
};
const Inventor: React.FC = () => {
  const t = useT();
  const abre = ramp(t, E15.said, 0.5, easeOut);
  return (
    <>
      {/* silueta anónima (sin nombre ni cara) */}
      <Obj x={960} y={40} t0={E15.inventor - 0.3} tam={200} color="#e6eeff" trazos={[
        { d: circ(0, -120, 60), a: 2.6, f: "rgba(255,255,255,.03)" },
        { d: "M-130,160 Q-130,-20 0,-30 Q130,-20 130,160", a: 2.6 },
      ]}>
        <TextoNeon y={-120} texto="?" size={70} color={N.gris} />
      </Obj>
      {/* el gesto que inventó: flechita de tirar hacia abajo */}
      <svg width={1} height={1} style={abs(1250, -80)} opacity={ramp(t, E15.gesture, 0.3)}>
        <path d={`M0,${-60 + 30 * Math.abs(Math.sin(t * 3))} L0,${40 + 30 * Math.abs(Math.sin(t * 3))} M-22,${18 + 30 * Math.abs(Math.sin(t * 3))} L0,${40 + 30 * Math.abs(Math.sin(t * 3))} L22,${18 + 30 * Math.abs(Math.sin(t * 3))}`} fill="none" stroke={N.cianClaro} strokeWidth={6} strokeLinecap="round" style={glow(N.cian)} />
      </svg>
      {/* comillas que se abren */}
      <svg width={1} height={1} style={abs(1100, -250)} opacity={abre}>
        <text x={-80 - 40 * abre} y={0} fontFamily="serif" fontSize={150} fill={N.oro} style={glow(N.oro)}>“</text>
        <text x={80 + 40 * abre} y={0} fontFamily="serif" fontSize={150} fill={N.oro} style={glow(N.oro)}>”</text>
      </svg>
      <Texto x={1100} y={260} t0={E15.inventor} texto="the *inventor*" size={44} />
      <Texto x={1100} y={320} t0={E15.gesture} texto="of the pull-down gesture" size={28} color={N.texto2} />
    </>
  );
};
// objetos de vidrio de la escena 15
const H15: React.FC = () => (
  <>
    <Png id="palanca" x={470} y={80} w={220} t0={E15.pull} t1={E15.inventor} glow={N.rojo} />
  </>
);
const Escena15: React.FC = () => (
  <EscenaMundo tomas={tomas15}><H15 />
    <Espejo />
    <Inventor />
  </EscenaMundo>
);

export const SEGS_M04: Seg[] = [
  {
    hub: { portal: "celA", orbs: [
      { id: "ciclo", t: T("Every pull", 204.5), ang: 198, anillo: 1, tam: 150, D: CicloTiron },
      { id: "jack", t: T("the big one", 206), ang: 128, anillo: 2, tam: 210, D: Jackpot },
      { id: "celA", t: T("your phone", 207.5), ang: -14, anillo: 0, tam: 240, D: CelularAbre },
    ] },
    Escena: Escena12,
    sonidos: (s) => { [E12.msg, E12.video, E12.nada].forEach((x) => { s.add("vuelo", x, 0.4); s.add("aparece", x + 0.15, 0.6); }); s.add("latido", E12.love, 0.6); s.add("vuelo", E12.dont, 0.45); s.add("tiron", E12.dont + 0.4, 0.7); s.add("tiron", E12.dont + 1.1, 0.6); s.add("vuelo", 220.2, 0.6); s.add("toque", E12.thumb + 0.2, 0.5); s.add("toque", E12.thumb + 0.65, 0.5); },
  },
  {
    hub: { portal: "marco", orbs: [
      { id: "uno", t: T("So that is", 221.5), ang: 198, anillo: 1, tam: 140, D: Uno },
      { id: "marco", t: T("first gear", 222), ang: -14, anillo: 0, tam: 250, D: MarcoEngr },
      { id: "dado", t: T("the maybe", 223.5), ang: 128, anillo: 2, tam: 170, D: DadoQuizas },
    ] },
    Escena: Escena13,
    sonidos: (s) => { s.add("aparece", E13.never - 0.3); s.add("toque", E13.never + 0.6, 0.6); s.add("vuelo", E13.built, 0.6); s.add("traza", E13.built + 0.1); s.add("digito", E13.long); s.add("vuelo", 230.9, 0.5); s.add("aparece", E13.chase); s.add("luz", E13.food - 0.1, 0.6); s.add("vuelo", 234.8, 0.6); s.add("engranaje", E13.second + 0.1); s.add("palanca", E13.lever + 0.1); },
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
    sonidos: (s) => { s.add("palanca", T("pull it", 252)); s.add("rodillos", T("wheels spin", 254)); s.add("palanca", E15.waiting - 0.3); s.add("rodillos", E15.waiting - 0.2, 0.7); s.add("aparece", E15.phone, 0.6); s.add("palanca", E15.pull); s.add("tiron", E15.pull + 0.05, 0.7); s.add("vuelo", E15.spin, 0.45); s.add("tic", E15.wait, 0.6); s.add("vuelo", 264.5, 0.6); s.add("aparece", E15.inventor); s.add("vuelo", E15.said, 0.4); },
  },
];
