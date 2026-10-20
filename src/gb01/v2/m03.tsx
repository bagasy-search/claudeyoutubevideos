// gb01 v2 · MINUTO 3 (ventanas 8-11, 134-205 s): Skinner cambia una cosa · la ruleta sin patrón · la paloma que
// enloquece · recompensa variable · cerebro que se relaja vs que se inclina · dopamina = querer · el mono y la señal.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, ramp, useT, vis } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { Contador, EscenaMundo, Obj, Texto, circ } from "./esc";
import { Paloma } from "./m02";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const svgAbs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });

// ═════════ HUB 8 · "Then Skinner changed one thing. Sometimes the lever gave food" ═════════
const CajaMini: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[
    { d: "M-70,-40 L50,-40 L70,-56 L-50,-56 Z M50,-40 L50,50 L70,34 L70,-56 M-70,-40 L-70,50 L50,50", a: 2.2 },
    { d: "M20,10 L34,10 M26,10 L18,-6", c: N.oro, a: 2.6 },
    { d: "M-40,40 Q-30,20 -14,22 Q-6,10 2,18 L-2,26 Q-20,46 -40,40 Z", c: "#e6eeff", a: 1.8 },
  ]} />
);
const Interruptor: D = ({ t, t0, on, tam }) => {
  const k = ramp(t, t0 + 0.5, 0.25);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
      { d: "M-60,-26 L60,-26 A26,26 0 0,1 60,26 L-60,26 A26,26 0 0,1 -60,-26 Z", a: 2.4 },
    ]}>
      <circle cx={lerp(-58, 58, k)} cy={0} r={20} fill={k > 0.5 ? N.fosfo : N.gris} style={{ filter: `drop-shadow(0 0 8px ${k > 0.5 ? N.fosfo : "#fff"})` }} />
      <TextoNeon y={64} texto="one thing" size={24} serif color={N.cianClaro} on={k} />
    </Glifo>
  );
};
const Grano: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[0, 1, 2, 3, 4].map((i) => ({ d: circ(-40 + i * 20, 20 * Math.sin(t * 2 + i), 9), a: 2.2, f: "rgba(244,194,74,.4)" }))} />
);

// ═════════ ESCENA 8 · ruleta sin patrón · la paloma enloquece · más que antes · aunque no haya comida ═════════
const E8 = { nothing: T("gave nothing", 139), pattern: T("No pattern", 140), chance: T("Pure chance", 142), crazy: T("went crazy", 143), pressed: T("pressed and pressed", 145), more: T("much more", 148), kept: T("kept pressing", 149.5), stopped: T("food had stopped", 151) };
const tomas8: Toma[] = [[138.7, 0, 0, 1.22], [143.4, 0, 0, 1.12], [143.8, 940, 0, 1.04], [149.4, 940, 0, 1.12], [151.2, 940, 20, 1.2]];
const RES = [1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0];
const Ruleta: React.FC = () => {
  const t = useT();
  const giro = t < E8.nothing ? 0 : 900 * (1 - Math.exp(-1.6 * (t - E8.nothing)));
  return (
    <>
      <Obj x={0} y={-30} t0={E8.nothing - 0.6} tam={220} color={N.violeta} trazos={[
        { d: circ(0, 0, 180), a: 2.4 },
        { d: "M0,-200 L-14,-226 L14,-226 Z", c: N.oroClaro, a: 2.4, f: N.oro },
      ]}>
        <g transform={`rotate(${giro})`}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <g key={i}>
                <line x1={0} y1={0} x2={Math.cos(a) * 180} y2={Math.sin(a) * 180} stroke={N.gris} strokeWidth={1.5} />
                {RES[i] ? <circle cx={Math.cos(a + 0.26) * 130} cy={Math.sin(a + 0.26) * 130} r={12} fill={N.oro} style={{ filter: `drop-shadow(0 0 6px ${N.oro})` }} />
                  : <path d={`M${Math.cos(a + 0.26) * 130 - 10},${Math.sin(a + 0.26) * 130 - 10} l20,20 m0,-20 l-20,20`} stroke={N.rojo} strokeWidth={4} />}
              </g>
            );
          })}
        </g>
      </Obj>
      {/* tira de resultados: sin patrón */}
      <svg width={1} height={1} style={svgAbs(-330, 290)}>
        {RES.concat([0, 1]).map((r, i) => {
          const on = neonOn(t, E8.pattern + i * 0.09);
          return r ? <circle key={i} cx={i * 52} cy={0} r={14} fill={N.oro} opacity={on} style={{ filter: `drop-shadow(0 0 6px ${N.oro})` }} />
            : <path key={i} d={`M${i * 52 - 12},-12 l24,24 m0,-24 l-24,24`} stroke={N.rojo} strokeWidth={4} opacity={on} />;
        })}
      </svg>
      <Texto x={0} y={-310} t0={E8.pattern} t1={E8.chance} texto="no *pattern*" size={56} />
      <Texto x={0} y={-310} t0={E8.chance} texto="pure *chance*" size={56} color={N.violeta} />
    </>
  );
};
const presiones = (a: number, b: number, paso: number) => Array.from({ length: Math.floor((b - a) / paso) }, (_, i) => a + i * paso);
const PalomaLoca: React.FC = () => {
  const t = useT();
  const P1 = presiones(E8.pressed, E8.stopped + 1.6, 0.21);
  const n = P1.filter((x) => x <= t).length;
  const vacia = ramp(t, E8.kept, 0.4);
  return (
    <>
      <Obj x={940} y={40} t0={E8.crazy - 0.5} tam={200} color={N.cian} trazos={[
        { d: "M-240,-140 L180,-140 L250,-190 L-170,-190 Z M180,-140 L180,160 L250,110 L250,-190 M-240,-140 L-240,160 L180,160", a: 2.2 },
      ]} />
      <Paloma x={880} y={140} t0={E8.crazy - 0.3} picotazos={P1} s={1.5} color={N.oroClaro} />
      <svg width={1} height={1} style={svgAbs(1060, 80)}>
        {(() => { const ult = P1.filter((x) => x <= t).pop() ?? -9; const g = Math.max(0, 1 - (t - ult) / 0.18); return (
          <g stroke={N.oro} strokeWidth={5} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${N.oro})` }}>
            <path d="M0,0 L40,0" /><path d={`M8,0 L-12,${-36 + 26 * g}`} /><circle cx={-12} cy={-40 + 26 * g} r={8} fill={N.rojo} stroke={N.rojo} />
          </g>); })()}
        <path d="M-6,90 L52,90 L46,110 L0,110 Z" stroke={vacia > 0.5 ? N.rojo : N.oro} strokeWidth={4} fill="none" />
        <text x={24} y={140} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={22} fill={N.rojo} opacity={vacia}>EMPTY</text>
      </svg>
      <Contador x={940} y={-290} t0={E8.pressed} d={0.01} a0={n} a1={n} size={110} color={N.oroClaro} sufijo="presses" />
      {/* antes vs ahora */}
      <svg width={1} height={1} style={svgAbs(1300, 140)} opacity={ramp(t, E8.more, 0.3)}>
        <rect x={0} y={-60} width={50} height={60} fill="none" stroke={N.gris} strokeWidth={3} />
        <rect x={80} y={-260 * ramp(t, E8.more, 0.9, easeOut)} width={50} height={260 * ramp(t, E8.more, 0.9, easeOut)} fill="rgba(244,194,74,.2)" stroke={N.oro} strokeWidth={3} style={{ filter: `drop-shadow(0 0 8px ${N.oro})` }} />
        <text x={25} y={30} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={18} fill={N.texto2}>before</text>
        <text x={105} y={30} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={18} fill={N.oroClaro}>now</text>
      </svg>
    </>
  );
};
const Escena8: React.FC = () => (
  <EscenaMundo tomas={tomas8}>
    <Ruleta />
    <PalomaLoca />
    <Texto x={940} y={330} t0={E8.kept} texto="long after the food *stopped*" size={46} color={N.rojoBorde} />
  </EscenaMundo>
);

// ═════════ HUB 9 · "after the food had stopped. Scientists call this a variable reward." ═════════
const BandejaVacia: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.rojo} trazos={[{ d: "M-60,0 L60,0 L48,30 L-48,30 Z", a: 2.6 }, { d: "M-30,-40 L30,20 M30,-40 L-30,20", a: 2, dt: 0.3 }]} />
);
const Matraz: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[
    { d: "M-16,-70 L16,-70 M-10,-70 L-10,-20 L-56,60 Q-60,70 -50,70 L50,70 Q60,70 56,60 L10,-20 L10,-70", a: 2.4 },
    { d: "M-40,40 Q0,20 40,40", a: 2, dt: 0.3 },
  ]}>
    {[0, 1, 2].map((i) => <circle key={i} cx={-10 + i * 12} cy={30 - ((t * 40 + i * 30) % 90)} r={4} fill={N.verde} opacity={0.7} />)}
  </Glifo>
);
const BarrasVariables: D = ({ t, t0, on, tam }) => {
  const H = [30, 80, 10, 60, 100, 20, 70, 40];
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[
      { d: "M-90,60 L90,60 M-90,60 L-90,-80", c: N.gris, a: 1.6 },
      ...H.map((h, i): Trazo => ({ d: `M${-76 + i * 22},60 L${-76 + i * 22},${60 - h * (0.8 + 0.2 * Math.sin(t * 3 + i))}`, a: 5, dt: 0.1 + i * 0.05 })),
    ]}>
      <TextoNeon y={92} texto="variable reward" size={22} serif color={N.oroClaro} on={ramp(t, t0 + 0.4, 0.3)} />
    </Glifo>
  );
};

// ═════════ ESCENA 9 · "I call it the maybe … brain relaxes … leans forward … cannot stop thinking" ═════════
const E9 = { maybe: T("maybe", 157), know: T("know exactly", 158), relax: T("relaxes", 160), dont: T("don't know", 162), leans: T("leans forward", 163.5), stop: T("cannot stop", 165) };
const tomas9: Toma[] = [[156.3, 0, -230, 1.3], [157.9, 0, -40, 0.92], [158.4, -460, 40, 1.18], [162.1, -460, 40, 1.22], [162.5, 460, 40, 1.18], [165.3, 460, 40, 1.26], [167.6, 0, 20, 0.92]];
const CerebroMini: React.FC<{ x: number; y: number; t0: number; rot?: number; color: string; brillo?: number }> = ({ x, y, t0, rot = 0, color, brillo = 0 }) => (
  <Obj x={x} y={y} t0={t0} tam={360} color={color} rot={rot} trazos={[
    { d: "M-90,20 Q-110,-60 -40,-80 Q0,-110 50,-84 Q110,-70 100,0 Q110,50 50,60 Q30,90 -10,70 Q-70,80 -90,20 Z", a: 2.6, f: `rgba(255,255,255,${0.03 + 0.12 * brillo})` },
    { d: "M-60,-20 Q-30,-50 0,-30 Q30,-60 60,-24 M-50,20 Q-10,0 20,24 Q50,10 70,30", a: 1.6 },
    { d: "M10,60 Q14,90 4,110", a: 2.2 },
  ]} />
);
const Ondas: React.FC<{ x: number; y: number; t0: number; color: string; vel: number; amp: number }> = ({ x, y, t0, color, vel, amp }) => {
  const t = useT();
  if (t < t0) return null;
  const d = Array.from({ length: 60 }, (_, i) => `${i ? "L" : "M"}${-200 + i * 7},${amp * Math.sin(i * 0.3 - t * vel)}`).join(" ");
  return <svg width={1} height={1} style={svgAbs(x, y)} opacity={ramp(t, t0, 0.4)}><path d={d} fill="none" stroke={color} strokeWidth={3} style={{ filter: `drop-shadow(0 0 6px ${color})` }} /></svg>;
};
const BucleIdea: React.FC<{ x: number; y: number; t0: number }> = ({ x, y, t0 }) => {
  const t = useT();
  if (t < t0 - 0.1) return null;
  const a = (t - t0) * 360;
  return (
    <svg width={1} height={1} style={svgAbs(x, y)} opacity={ramp(t, t0, 0.3)}>
      <g transform={`rotate(${a})`}>
        <path d="M150,0 A150,150 0 0,1 -106,106" fill="none" stroke={N.oro} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${N.oro})` }} />
        <path d="M-106,106 l-4,-26 m4,26 l24,-8" stroke={N.oro} strokeWidth={4} />
        <path d="M-150,0 A150,150 0 0,1 106,-106" fill="none" stroke={N.oro} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${N.oro})` }} />
        <path d="M106,-106 l4,26 m-4,-26 l-24,8" stroke={N.oro} strokeWidth={4} />
      </g>
    </svg>
  );
};
const Escena9: React.FC = () => {
  const t = useT();
  const inclina = 22 * ramp(t, E9.leans, 0.6, easeOut);
  return (
    <EscenaMundo tomas={tomas9}>
      <Texto x={0} y={-250} t0={E9.maybe - 0.1} texto="the *maybe*" size={110} color={N.oroClaro} />
      {/* lo sé: caja abierta, cerebro tranquilo */}
      <Obj x={-460} y={-170} t0={E9.know} tam={220} color={N.cianClaro} trazos={[{ d: "M-60,0 L60,0 L60,60 L-60,60 Z M-60,0 L-80,-30 M60,0 L80,-30", a: 2.4 }, { d: circ(0, -10, 16), c: N.oro, a: 2.4 }]} />
      <CerebroMini x={-460} y={110} t0={E9.know + 0.3} color={N.cian} />
      <Ondas x={-460} y={300} t0={E9.relax} color={N.cian} vel={1.2} amp={8} />
      <Texto x={-460} y={-300} t0={E9.relax} texto="the brain *relaxes*" size={40} color={N.cianClaro} />
      {/* no sé: caja cerrada con ?, cerebro inclinado hacia adelante */}
      <Obj x={460} y={-170} t0={E9.dont} tam={220} color={N.violeta} trazos={[{ d: "M-60,-30 L60,-30 L60,60 L-60,60 Z M-66,-30 L66,-30", a: 2.4 }]}>
        <TextoNeon y={16} texto="?" size={64} color={N.oroClaro} />
      </Obj>
      <CerebroMini x={460} y={110} t0={E9.dont + 0.3} rot={inclina} color={N.oro} brillo={ramp(t, E9.leans, 0.4)} />
      <Ondas x={460} y={300} t0={E9.leans} color={N.oro} vel={7} amp={26} />
      <BucleIdea x={460} y={110} t0={E9.stop} />
      <Texto x={460} y={-300} t0={E9.leans} texto="the brain *leans forward*" size={40} color={N.oroClaro} />
    </EscenaMundo>
  );
};

// ═════════ HUB 10 · "look inside the glass brain. Deep in the middle, a small group of cells" ═════════
const CerebroVidrio: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
    { d: "M-90,20 Q-110,-60 -40,-80 Q0,-110 50,-84 Q110,-70 100,0 Q110,50 50,60 Q30,90 -10,70 Q-70,80 -90,20 Z", a: 2.4, f: "rgba(203,251,255,.05)" },
    { d: "M-60,-20 Q-30,-50 0,-30 Q30,-60 60,-24", c: N.gris, a: 1.4 },
  ]}>
    <circle cx={10} cy={6} r={10 + 3 * Math.sin(t * 4)} fill={N.oro} opacity={neonOn(t, T("Deep in the middle", 169))} style={{ filter: `drop-shadow(0 0 12px ${N.oro})` }} />
  </Glifo>
);
const Lupa: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: circ(-14, -14, 50), a: 3 }, { d: "M22,22 L70,70", a: 6 }]}>
    <circle cx={-14} cy={-14} r={46} fill="rgba(203,251,255,.06)" />
  </Glifo>
);
const Celulas: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oro} trazos={[0, 1, 2, 3, 4, 5].map((i): Trazo => {
    const a = (i / 6) * Math.PI * 2 + t * 0.4, r = i ? 46 : 0;
    return { d: circ(Math.cos(a) * r, Math.sin(a) * r, 18 + 3 * Math.sin(t * 3 + i)), a: 2.2, f: "rgba(244,194,74,.15)", dt: i * 0.07 };
  })} />
);

// ═════════ ESCENA 10 · neuronas que sueltan dopamina · "pleasure" tachado · "wanting" · el mono ═════════
const E10 = { release: T("release a chemical", 173), dopa: T("dopamine", 174), pleasure: T("pleasure chemical", 176), not: T("not quite right", 178.5), wanting: T("wanting", 182), forward: T("looking forward", 183.5), monkeys: T("monkeys", 186) };
const tomas10: Toma[] = [[173.2, 0, 0, 1.32], [175.8, 0, 0, 1.0], [180.2, 240, -40, 1.04], [184.6, 330, -40, 1.0], [186.0, 1050, 0, 1.18], [188.2, 1050, 0, 1.24]];
const Neurona: React.FC<{ x: number; y: number; t0: number; rot: number; tFuego: number }> = ({ x, y, t0, rot, tFuego }) => {
  const t = useT();
  const f = neonOn(t, tFuego);
  return (
    <Obj x={x} y={y} t0={t0} tam={300} color={N.oro} rot={rot} trazos={[
      { d: circ(0, 0, 26), a: 2.6, f: `rgba(244,194,74,${0.1 + 0.4 * f})` },
      { d: "M20,-16 Q60,-40 90,-30 M60,-34 L80,-60 M-22,-14 Q-60,-50 -84,-40 M-26,8 Q-70,20 -90,50 M0,26 Q10,80 60,110 Q80,120 110,110", a: 1.8 },
    ]} />
  );
};
const Moleculas: React.FC = () => {
  const t = useT();
  if (t < E10.release) return null;
  return (
    <svg width={1} height={1} style={svgAbs(0, 0)}>
      {Array.from({ length: 22 }, (_, i) => {
        const d = t - (E10.release + (i % 11) * 0.12);
        if (d < 0) return null;
        const a = (i / 22) * Math.PI * 2 + i * 0.4, r = 40 + 220 * (1 - Math.exp(-0.8 * d));
        const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.8, h = 12;
        const hex = Array.from({ length: 6 }, (_, k) => `${k ? "L" : "M"}${x + Math.cos((k / 6) * Math.PI * 2 + t) * h},${y + Math.sin((k / 6) * Math.PI * 2 + t) * h}`).join(" ") + "Z";
        return <path key={i} d={hex} fill="rgba(244,194,74,.25)" stroke={N.oro} strokeWidth={2.4} opacity={Math.min(1, d * 3)} style={{ filter: `drop-shadow(0 0 6px ${N.oro})` }} />;
      })}
    </svg>
  );
};
const Tachado: React.FC<{ x: number; y: number; t0: number; ancho: number }> = ({ x, y, t0, ancho }) => {
  const t = useT();
  if (t < t0) return null;
  return <svg width={1} height={1} style={svgAbs(x, y)}><path d={`M${-ancho / 2},6 L${-ancho / 2 + ancho * ramp(t, t0, 0.35)},-6`} stroke={N.rojo} strokeWidth={7} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${N.rojo})` }} /></svg>;
};
const Flecha: React.FC<{ x: number; y: number; t0: number; largo: number; color: string }> = ({ x, y, t0, largo, color }) => {
  const t = useT();
  if (t < t0) return null;
  const k = ramp(t, t0, 0.6, easeOut), L = largo * k;
  return <svg width={1} height={1} style={svgAbs(x, y)}><path d={`M0,0 L${L},0 M${L - 26},-18 L${L},0 L${L - 26},18`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${color})` }} /></svg>;
};
export const Mono: React.FC<{ x: number; y: number; t0: number; s?: number }> = ({ x, y, t0, s = 1 }) => (
  <Obj x={x} y={y} t0={t0} tam={300 * s} color="#e6eeff" trazos={[
    { d: circ(0, 0, 70), a: 2.4 },
    { d: circ(-86, -10, 26) + " " + circ(86, -10, 26), a: 2.2 },
    { d: "M-44,10 Q-50,-40 0,-40 Q50,-40 44,10 Q50,56 0,56 Q-50,56 -44,10 Z", c: N.oroClaro, a: 1.8 },
    { d: circ(-18, -6, 6) + " " + circ(18, -6, 6), a: 2.4 },
    { d: "M-14,30 Q0,40 14,30", a: 2 },
  ]} />
);
const Escena10: React.FC = () => (
  <EscenaMundo tomas={tomas10}>
    <Neurona x={-70} y={-40} t0={E10.release - 0.6} rot={0} tFuego={E10.release} />
    <Neurona x={80} y={40} t0={E10.release - 0.45} rot={150} tFuego={E10.release + 0.15} />
    <Neurona x={-20} y={100} t0={E10.release - 0.3} rot={260} tFuego={E10.release + 0.3} />
    <Moleculas />
    <Texto x={0} y={-310} t0={E10.dopa} t1={E10.pleasure - 0.1} texto="*dopamine*" size={90} color={N.oroClaro} />
    <Texto x={240} y={-320} t0={E10.pleasure} texto="pleasure" size={70} color="#e6eeff" />
    <Tachado x={240} y={-320} t0={E10.not} ancho={330} />
    <Texto x={240} y={-190} t0={E10.wanting} texto="*wanting*" size={96} color={N.oro} />
    <Flecha x={60} y={-80} t0={E10.forward} largo={520} color={N.oro} />
    <Texto x={330} y={-20} t0={E10.forward} texto="looking *forward*" size={40} color={N.oroClaro} />
    <Mono x={1050} y={0} t0={E10.monkeys} />
  </EscenaMundo>
);

// ═════════ HUB 11 · "scientists saw these cells fire hardest, not when the reward" ═════════
const MonoChico: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: circ(0, 0, 44), a: 2.4 }, { d: circ(-54, -6, 16) + " " + circ(54, -6, 16), a: 2.2 }, { d: circ(-12, -4, 4) + " " + circ(12, -4, 4), a: 2.4 },
  ]} />
);
const Osciloscopio: D = ({ t, t0, on, tam }) => {
  const d = Array.from({ length: 50 }, (_, i) => { const x = -90 + i * 3.6; const sp = (i + Math.floor(t * 12)) % 7 === 0 ? -50 : 0; return `${i ? "L" : "M"}${x},${10 + sp}`; }).join(" ");
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.fosfo} trazos={[{ d: "M-100,-60 L100,-60 L100,60 L-100,60 Z", c: "#e6eeff", a: 2 }]}>
      <path d={d} fill="none" stroke={N.fosfo} strokeWidth={2.6} style={{ filter: `drop-shadow(0 0 6px ${N.fosfo})` }} />
    </Glifo>
  );
};
const Gota: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cian} trazos={[{ d: "M0,-60 Q40,0 30,30 Q20,60 0,60 Q-20,60 -30,30 Q-40,0 0,-60 Z", a: 2.6, f: "rgba(39,227,255,.15)" }]} />
);

// ═════════ ESCENA 11 · la señal: el pico aparece cuando es POSIBLE, no cuando llega · "a maybe machine" ═════════
const E11 = { arrived: T("arrived", 192), possible: T("possible", 194), certain: T("not yet certain", 195), excited: T("excited", 197.5), prize: T("not by the prize", 199.5), slot: T("slot machine is", 201.5), machine: T("maybe machine", 203) };
const tomas11: Toma[] = [[192.4, 0, 0, 1.12], [197.0, 0, 0, 1.0], [197.4, 560, 0, 1.06], [201.7, 560, 0, 1.1], [202.2, 1150, 0, 1.18], [204.6, 1150, 0, 1.24]];
const Senal: React.FC = () => {
  const t = useT();
  const k = ramp(t, E11.arrived - 0.2, 3.2, (u) => u);
  const xCue = -260, xRew = 200;
  const pts = Array.from({ length: 120 }, (_, i) => {
    const x = -420 + i * 7.5;
    let y = 0;
    if (Math.abs(x - xCue) < 60) y = -150 * Math.exp(-Math.pow((x - xCue) / 22, 2)) * (1 + 0.2 * Math.sin(i * 1.7));
    else if (Math.abs(x - xRew) < 40) y = -30 * Math.exp(-Math.pow((x - xRew) / 18, 2));
    else y = 6 * Math.sin(i * 2.3);
    return [x, y] as const;
  }).filter(([x]) => x < -420 + 900 * k);
  return (
    <>
      <Obj x={0} y={0} t0={E11.arrived - 0.4} tam={200} color="#e6eeff" trazos={[{ d: "M-440,-200 L440,-200 L440,120 L-440,120 Z", a: 1.6 }, { d: "M-420,60 L420,60", c: N.gris, a: 1 }]} />
      <svg width={1} height={1} style={svgAbs(0, 60)}>
        <path d={pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ")} fill="none" stroke={N.fosfo} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${N.fosfo})` }} />
      </svg>
      <Texto x={xCue} y={210} t0={E11.possible} texto="*possible*" size={48} color={N.fosfo} />
      <Texto x={xCue} y={268} t0={E11.certain} texto="not yet certain" size={28} color={N.texto2} />
      <Obj x={xRew} y={-80} t0={E11.arrived} tam={140} color={N.cian} trazos={[{ d: "M0,-50 Q34,0 26,26 Q16,50 0,50 Q-16,50 -26,26 Q-34,0 0,-50 Z", a: 2.6, f: "rgba(39,227,255,.15)" }]} />
      <Texto x={xRew} y={210} t0={E11.arrived + 0.2} texto="reward" size={36} color={N.cianClaro} />
    </>
  );
};
const MaquinaQuizas: React.FC = () => {
  const t = useT();
  const on = neonOn(t, E11.machine);
  return (
    <Obj x={1150} y={20} t0={E11.slot - 0.3} tam={240} color={N.oro} trazos={[
      { d: "M-120,-150 L120,-150 L140,170 L-140,170 Z", a: 2.6, f: "rgba(244,194,74,.05)" },
      { d: "M-90,-210 Q0,-260 90,-210 L120,-150 L-120,-150 Z", c: N.rojo, a: 2.4 },
      { d: "M-90,-60 L90,-60 L90,40 L-90,40 Z", a: 2.2 },
      { d: "M140,-40 L176,-40 L176,-120", a: 3 },
    ]}>
      <TextoNeon y={-186} texto="MAYBE" size={34} color={N.oroClaro} on={on} />
      {["?", "?", "?"].map((c, i) => <TextoNeon key={i} x={-60 + i * 60} y={-8} texto={c} size={60} color={i === 1 ? N.rojo : N.cianClaro} on={on} />)}
    </Obj>
  );
};
const Escena11: React.FC = () => (
  <EscenaMundo tomas={tomas11}>
    <Senal />
    <Texto x={560} y={-300} t0={E11.excited} texto="excited by the *maybe*" size={52} color={N.oroClaro} />
    <Texto x={560} y={-220} t0={E11.prize} texto="not by the prize" size={34} color={N.texto2} />
    <MaquinaQuizas />
  </EscenaMundo>
);

export const SEGS_M03: Seg[] = [
  {
    hub: { portal: "caja", orbs: [
      { id: "caja", t: T("Skinner changed", 134), ang: -14, anillo: 0, tam: 230, D: CajaMini },
      { id: "sw", t: T("one thing", 135), ang: 198, anillo: 1, tam: 170, D: Interruptor },
      { id: "grano", t: T("food", 137.5), ang: 128, anillo: 2, tam: 150, D: Grano },
    ] },
    Escena: Escena8,
    sonidos: (s) => { s.add("rodillos", E8.nothing, 0.8); s.add("rodilloFrena", E8.nothing + 1.2); for (let i = 0; i < 14; i++) s.add("tic", E8.pattern + i * 0.09, 0.5); s.add("vuelo", 143.7, 0.6); presiones(E8.pressed, E8.stopped + 1.6, 0.42).forEach((x) => s.add("palanca", x, 0.45)); s.add("traza", E8.more); s.add("vacio", E8.kept + 0.2); },
  },
  {
    hub: { portal: "barras", orbs: [
      { id: "band", t: T("stopped", 151.5), ang: 198, anillo: 1, tam: 150, D: BandejaVacia },
      { id: "matraz", t: T("Scientists", 153), ang: 128, anillo: 2, tam: 170, D: Matraz },
      { id: "barras", t: T("variable reward", 154), ang: -14, anillo: 0, tam: 240, D: BarrasVariables },
    ] },
    Escena: Escena9,
    sonidos: (s) => { s.add("neonOn", E9.maybe); s.add("vuelo", 158.3, 0.6); s.add("aparece", E9.know); s.add("ola", E9.relax, 0.5); s.add("vuelo", 162.4, 0.6); s.add("aparece", E9.dont); s.add("latido", E9.leans); s.add("sinapsis", E9.stop); },
  },
  {
    hub: { portal: "cel", orbs: [
      { id: "cer", t: T("glass brain", 168.5), ang: 198, anillo: 1, tam: 200, D: CerebroVidrio },
      { id: "lupa", t: T("Deep in the middle", 169), ang: 128, anillo: 2, tam: 170, D: Lupa },
      { id: "cel", t: T("small group of cells", 171), ang: -14, anillo: 0, tam: 220, D: Celulas },
    ] },
    Escena: Escena10,
    sonidos: (s) => { s.add("sinapsis", E10.release); s.add("sinapsis", E10.release + 0.3, 0.7); s.add("neonOn", E10.dopa); s.add("aparece", E10.pleasure); s.add("traza", E10.not, 0.8); s.add("golpe", E10.wanting, 0.6); s.add("vuelo", E10.forward, 0.6); s.add("vuelo", 185.9, 0.6); s.add("aparece", E10.monkeys); },
  },
  {
    hub: { portal: "osc", orbs: [
      { id: "mono", t: T("scientists saw", 188), ang: 198, anillo: 1, tam: 170, D: MonoChico },
      { id: "osc", t: T("fire hardest", 189.5), ang: -14, anillo: 0, tam: 240, D: Osciloscopio },
      { id: "gota", t: T("reward", 191.5), ang: 128, anillo: 2, tam: 140, D: Gota },
    ] },
    Escena: Escena11,
    sonidos: (s) => { s.add("traza", E11.arrived - 0.2); s.add("sinapsis", 192.6); s.add("tic", E11.possible); s.add("aparece", E11.arrived); s.add("vuelo", 197.3, 0.6); s.add("vuelo", 202.1, 0.6); s.add("neonOn", E11.machine); s.add("rodillos", E11.machine + 0.2, 0.6); },
  },
];
