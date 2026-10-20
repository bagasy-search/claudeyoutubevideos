// gb01 v2 · MINUTO 2 (ventanas 4-7, 67-134 s): por qué agarrás el celular · 90 veces por día · el extraño que te
// toca el hombro · el primer engranaje · la caja de Skinner. Componentes nuevos, mismo neón.
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, ramp, useT, vis } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon, Trazo } from "./glifo";
import { Contador, EscenaMundo, Obj, Texto, arco, circ } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const tick = (t: number, t0: number) => ramp(t, t0, 0.3, easeOut);

// ═════════ HUB 4 · "Why do you pick up your phone? … because I'm bored, or" ═════════
const Pregunta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-34,-40 Q-34,-80 0,-80 Q36,-80 36,-46 Q36,-22 10,-10 Q0,-4 0,14 L0,24", a: 4 },
    { d: circ(0, 52, 6), a: 4, f: N.violeta },
  ]} />
);
const CelularSube: D = ({ t, t0, on, tam }) => {
  const y = -40 * ramp(t, t0, 0.8, easeOut) + 6 * Math.sin(t * 2);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
      { d: `M-30,${y - 60} L30,${y - 60} Q38,${y - 60} 38,${y - 52} L38,${y + 52} Q38,${y + 60} 30,${y + 60} L-30,${y + 60} Q-38,${y + 60} -38,${y + 52} L-38,${y - 52} Q-38,${y - 60} -30,${y - 60} Z`, a: 2.6 },
      { d: `M-56,${y + 76} Q-30,${y + 40} -10,${y + 62} M56,${y + 76} Q30,${y + 40} 10,${y + 62}`, c: N.oro, a: 2 },
    ]} />
  );
};
const Bostezo: D = ({ t, t0, on, tam }) => {
  const b = 0.5 + 0.5 * Math.sin((t - t0) * 2.4);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
      { d: "M-70,10 Q-80,-40 -30,-44 Q-20,-80 20,-70 Q60,-80 66,-36 Q96,-20 76,14 Q60,40 0,34 Q-60,44 -70,10 Z", a: 2 },
      { d: "M-26,-8 L-12,-8 M12,-8 L26,-8", a: 2.4 },
      { d: `M-12,${10} Q0,${10 + 24 * b} 12,10 Q0,${6 - 4 * b} -12,10 Z`, a: 2 },
    ]}>
      <TextoNeon x={70} y={-60} texto="z" size={26} serif color={N.cianClaro} on={0.4 + 0.6 * b} />
    </Glifo>
  );
};

// ═════════ ESCENA 4 · "check something … the story the mind tells … the truth is stranger … researchers counted" ═════════
const E4 = { check: T("check something", 72), story: T("story the mind", 74), truth: T("truth is stranger", 77), res: T("Researchers", 79), phones: T("their phones", 81) };
const tomas4: Toma[] = [[72.0, 0, 0, 1.25], [75.2, 0, 0, 1.32], [75.6, 720, 0, 1.08], [77.4, 720, -10, 1.18], [79.3, 720, 0, 1.14], [79.8, 1500, 0, 1.2], [83.3, 1500, 0, 1.32]];
const Burbuja: React.FC = () => {
  const t = useT();
  return (
    <Obj x={0} y={0} t0={E4.check - 0.4} tam={200} color="#e6eeff" trazos={[
      { d: "M-150,-30 Q-160,-110 -70,-110 Q-40,-160 30,-140 Q110,-160 140,-90 Q190,-60 160,0 Q150,60 60,60 Q-20,90 -90,60 Q-170,50 -150,-30 Z", a: 1.8 },
      { d: circ(-120, 100, 16) + " " + circ(-150, 140, 9), a: 1.6 },
      { d: "M-80,-60 L-40,-60 L-40,-20 L-80,-20 Z", c: N.cianClaro, a: 2.4 },
      { d: "M-74,-42 L-62,-28 L-34,-70", c: N.fosfo, a: 3.6, dt: E4.check + 0.3 - (E4.check - 0.4) },
      { d: "M-10,-46 L110,-46 M-10,-30 L80,-30", c: N.gris, a: 1.4 },
    ]}>
      <TextoNeon x={40} y={20} texto="check something" size={26} serif color={N.cianClaro} on={ramp(t, E4.check, 0.3)} />
    </Obj>
  );
};
// perfil de una cabeza: de la frente sale un libro de cuentos que se abre; "the truth is stranger" = la tapa se cae
// y adentro brilla una tragamonedas chiquita
const CabezaCuento: React.FC = () => {
  const t = useT();
  const ab = ramp(t, E4.story + 0.1, 0.6, easeOut);
  const cae = ramp(t, E4.truth + 0.1, 0.7);
  const on = neonOn(t, E4.truth + 0.35);
  return (
    <>
      <Obj x={620} y={60} t0={E4.story - 0.5} tam={200} color={N.cian} trazos={[
        { d: "M60,190 L60,120 Q100,110 96,80 L110,60 Q114,52 104,48 L110,20 Q90,-10 92,-40 Q90,-150 -20,-160 Q-130,-160 -150,-60 Q-160,10 -110,60 Q-90,90 -96,190", a: 2.4 },
      ]} />
      {/* libro: dos tapas que se abren desde el lomo */}
      <div style={{ position: "absolute", left: 640, top: -150, transform: `translate(0,${-40 * ab}px)` }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          {[-1, 1].map((sg) => (
            <g key={sg} transform={`skewY(${sg * -8 * ab}) scale(${lerp(0.15, 1, ab) * sg},1)`} opacity={ramp(t, E4.story - 0.2, 0.3) * (sg === -1 ? 1 : 1 - 0.0 * cae)}>
              <path d="M0,-70 L120,-80 L120,60 L0,70 Z" fill="rgba(183,123,255,.10)" stroke={N.violeta} strokeWidth={3} style={{ filter: `drop-shadow(0 0 8px ${N.violeta})` }}
                transform={sg === 1 ? `translate(0,${260 * cae * cae}) rotate(${50 * cae})` : undefined} />
              {sg === -1 && [-40, -16, 8, 32].map((yy) => <path key={yy} d={`M20,${yy} L100,${yy - 4}`} stroke={N.gris} strokeWidth={2} />)}
            </g>
          ))}
          <g transform="translate(60,0) scale(0.55)" opacity={on}>
            <path d="M-60,-70 L60,-70 L70,80 L-70,80 Z M-40,-30 L40,-30 L40,20 L-40,20 Z" fill="none" stroke={N.oro} strokeWidth={5} style={{ filter: `drop-shadow(0 0 10px ${N.oro})` }} />
            <path d="M70,-20 L92,-20 L92,-60" fill="none" stroke={N.oro} strokeWidth={5} />
            <circle cx={92} cy={-66} r={9} fill={N.rojo} />
          </g>
        </svg>
      </div>
    </>
  );
};
const Planilla: React.FC = () => {
  const t = useT();
  const marcas = Array.from({ length: 14 }, (_, i) => E4.res + 0.5 + i * 0.18);
  return (
    <Obj x={1500} y={20} t0={E4.res - 0.3} tam={200} color="#e6eeff" trazos={[
      { d: "M-110,-150 L110,-150 L110,170 L-110,170 Z", a: 2.2, f: "rgba(255,255,255,.03)" },
      { d: "M-40,-170 L40,-170 L40,-130 L-40,-130 Z", c: N.cianClaro, a: 2.4 },
      { d: "M-80,-100 L80,-100", c: N.gris, a: 1.4 },
      ...marcas.map((tm, i): Trazo => {
        const g = Math.floor(i / 5), j = i % 5;
        const x0 = -80 + g * 60, y0 = -60;
        return j < 4 ? { d: `M${x0 + j * 12},${y0} L${x0 + j * 12},${y0 + 60}`, c: N.oro, a: 3, dt: tm - (E4.res - 0.3), dur: 0.15 } as Trazo & { dur: number }
          : { d: `M${x0 - 6},${y0 + 50} L${x0 + 44},${y0 + 8}`, c: N.rojo, a: 3, dt: tm - (E4.res - 0.3) };
      }),
    ]}>
      <TextoNeon y={110} texto="checks / day" size={22} serif color={N.texto2} on={ramp(t, E4.phones, 0.3)} />
    </Obj>
  );
};
const Escena4: React.FC = () => (
  <EscenaMundo tomas={tomas4}>
    <Burbuja />
    <CabezaCuento />
    <Texto x={720} y={300} t0={E4.story} t1={E4.truth} texto="the *story* the mind tells" size={46} />
    <Texto x={720} y={300} t0={E4.truth + 0.1} texto="the truth is *stranger*" size={46} color={N.oroClaro} />
    <Planilla />
  </EscenaMundo>
);

// ═════════ HUB 5 · "The numbers are not small. In some surveys, the average person" ═════════
const Digitos: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} trazos={[]}>
    {["9", "0", "%", "7"].map((c, i) => (
      <TextoNeon key={i} x={-60 + i * 40} y={20 * Math.sin(t * 2 + i * 1.3)} texto={c} size={58} color={i % 2 ? N.cianClaro : N.oroClaro} on={neonOn(t, t0 + i * 0.1)} />
    ))}
  </Glifo>
);
const Encuesta: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-60,-80 L60,-80 L60,80 L-60,80 Z", a: 2.2 },
    ...[0, 1, 2].map((i): Trazo => ({ d: `M-40,${-40 + i * 40} L-24,${-40 + i * 40} M-10,${-40 + i * 40} L40,${-40 + i * 40}`, c: i === 1 ? N.fosfo : N.gris, a: 2, dt: 0.3 + i * 0.2 })),
  ]} />
);
const Persona: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.cianClaro} trazos={[
    { d: circ(0, -50, 24), a: 2.4 },
    { d: "M-50,80 Q-50,-10 0,-14 Q50,-10 50,80", a: 2.4 },
    { d: "M22,20 L40,0 L52,0 L52,30 L40,30 Z", c: N.oro, a: 2 },
  ]} />
);

// ═════════ ESCENA 5 · "90 times a day … far more … a few seconds … unlock, look, lock, nothing happens" ═════════
const E5 = { picks: T("picks up the phone", 87), n90: T("90 times", 88), far: T("far more", 90), checks: T("checks last", 92), sec: T("few seconds", 94), unlock: T("unlock", 95), look: T("look", 96), lock: T("lock", 97.5), nada: T("nothing happens", 98) };
const tomas5: Toma[] = [[87.2, 0, 0, 1.0], [92.3, 0, 0, 1.14], [92.8, 920, 0, 1.28], [95.5, 920, 0, 1.34], [95.9, 1860, 0, 1.0], [99.9, 1860, 0, 1.08]];
const Reloj24: React.FC = () => {
  const t = useT();
  const R = 300;
  const n = Math.round(90 * ramp(t, E5.n90, 1.4, (u) => 1 - Math.pow(1 - u, 2)));
  const extra = Math.round(40 * ramp(t, E5.far, 1.2));
  return (
    <>
      <Obj x={0} y={0} t0={E5.picks - 0.4} tam={400} color={N.cian} trazos={[
        { d: circ(0, 0, 150), a: 1.6 },
        ...Array.from({ length: 24 }, (_, h): Trazo => { const a = (h / 24) * Math.PI * 2 - Math.PI / 2; return { d: `M${Math.cos(a) * 140},${Math.sin(a) * 140} L${Math.cos(a) * (h % 6 ? 132 : 122)},${Math.sin(a) * (h % 6 ? 132 : 122)}`, a: 1.2, dt: 0.02 * h }; }),
      ]} />
      <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {Array.from({ length: n }, (_, i) => { const a = (i / 90) * Math.PI * 2 - Math.PI / 2; return <line key={i} x1={Math.cos(a) * (R - 26)} y1={Math.sin(a) * (R - 26)} x2={Math.cos(a) * R} y2={Math.sin(a) * R} stroke={N.oro} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${N.oro})` }} />; })}
        {Array.from({ length: extra }, (_, i) => { const a = (i / 40) * Math.PI * 2 - Math.PI / 2 + 0.04; return <line key={"x" + i} x1={Math.cos(a) * (R + 16)} y1={Math.sin(a) * (R + 16)} x2={Math.cos(a) * (R + 38)} y2={Math.sin(a) * (R + 38)} stroke={N.rojo} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${N.rojo})` }} />; })}
      </svg>
      <Contador x={0} y={-6} t0={E5.n90} d={1.4} a1={90} size={150} color={N.oroClaro} />
      <Texto x={0} y={80} t0={E5.n90 + 0.4} texto="*a day*" size={40} color={N.oroClaro} />
      <Texto x={0} y={-R - 90} t0={E5.far} texto="many people *far more*" size={44} color={N.rojoBorde} />
    </>
  );
};
const Cronometro: React.FC = () => {
  const t = useT();
  const a = Math.min(3, Math.max(0, t - E5.sec + 0.6)) / 60 * 360 * 10;
  return (
    <>
      <Obj x={920} y={0} t0={E5.checks - 0.2} tam={380} color={N.cianClaro} trazos={[
        { d: circ(0, 10, 100), a: 2.6 },
        { d: "M-14,-104 L14,-104 M0,-104 L0,-90 M70,-70 L84,-84", a: 2.6 },
      ]}>
        <g transform={`translate(0,10) rotate(${a})`}><line x1={0} y1={0} x2={0} y2={-80} stroke={N.oro} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${N.oro})` }} /></g>
        <path d={`M0,10 L0,-90 A100,100 0 ${a > 180 ? 1 : 0},1 ${100 * Math.sin((a * Math.PI) / 180)},${10 - 100 * Math.cos((a * Math.PI) / 180)} Z`} fill="rgba(244,194,74,.18)" />
      </Obj>
      <Texto x={920} y={200} t0={E5.sec} texto="a few *seconds*" size={46} />
    </>
  );
};
const Candado: React.FC<{ x: number; t0: number; tAbre: number; tCierra?: number }> = ({ x, t0, tAbre, tCierra = Infinity }) => {
  const t = useT();
  const ab = ramp(t, tAbre, 0.25) * (1 - ramp(t, tCierra, 0.25));
  return (
    <Obj x={x} y={0} t0={t0} tam={220} color={N.cianClaro} trazos={(tt) => [
      { d: "M-44,-6 L44,-6 L44,64 L-44,64 Z", a: 2.6, f: "rgba(203,251,255,.05)" },
      { d: `M-28,-6 L-28,${-40 - 0 * tt} Q-28,-72 0,-72 Q28,-72 28,-40 L28,${-6 - 30 * ab}`, a: 2.6 },
      { d: circ(0, 26, 8), c: ab > 0.5 ? N.fosfo : N.oro, a: 2.4 },
    ]} />
  );
};
const Ojo: React.FC<{ x: number; t0: number }> = ({ x, t0 }) => {
  const t = useT();
  const ab = ramp(t, t0, 0.3) * (1 - ramp(t, t0 + 0.6, 0.2));
  return (
    <Obj x={x} y={0} t0={t0 - 0.1} tam={220} color={N.cian} trazos={[
      { d: `M-70,0 Q0,${-50 * ab - 2} 70,0 Q0,${50 * ab + 2} -70,0 Z`, a: 2.6 },
      { d: circ(0, 0, 20 * ab + 0.1), c: N.cianClaro, a: 2.4 },
    ]} />
  );
};
const LineaPlana: React.FC = () => {
  const t = useT();
  if (!vis(t, E5.nada - 0.1)) return null;
  const k = ramp(t, E5.nada, 0.8);
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 1560, top: 190, overflow: "visible" }}>
      <path d={`M0,0 L${600 * k},0`} stroke="#e6eeff" strokeWidth={3} opacity={0.8} style={{ filter: "drop-shadow(0 0 6px #fff)" }} />
    </svg>
  );
};
const Escena5: React.FC = () => (
  <EscenaMundo tomas={tomas5}>
    <Reloj24 />
    <Cronometro />
    <Candado x={1620} t0={E5.unlock - 0.3} tAbre={E5.unlock} tCierra={E5.lock} />
    <Ojo x={1860} t0={E5.look} />
    <Texto x={1620} y={-170} t0={E5.unlock} texto="unlock" size={38} />
    <Texto x={1860} y={-170} t0={E5.look} texto="look" size={38} />
    <Texto x={2100} y={-170} t0={E5.lock} texto="lock" size={38} />
    <Candado x={2100} t0={E5.lock - 0.2} tAbre={E5.lock - 0.2} tCierra={E5.lock} />
    <LineaPlana />
    <Texto x={1860} y={250} t0={E5.nada} texto="*nothing happens*" size={48} color={N.texto2} />
  </EscenaMundo>
);

// ═════════ HUB 6 · "And a few minutes later, your hand does it again." ═════════
const RelojMin: D = ({ t, t0, on, tam }) => {
  const a = ramp(t, t0, 1.6) * 300;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: circ(0, 0, 70), a: 2.4 }, { d: "M0,0 L0,-40", a: 3 }]}>
      <line x1={0} y1={0} x2={60 * Math.sin((a * Math.PI) / 180)} y2={-60 * Math.cos((a * Math.PI) / 180)} stroke={N.cian} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${N.cian})` }} />
    </Glifo>
  );
};
const ManoEstira: D = ({ t, t0, on, tam }) => {
  const c = (t - t0) % 1.4, ext = Math.sin(Math.min(1, c / 0.7) * Math.PI) * 34;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[
      { d: `M-90,40 L${-30 + ext},40 Q${-10 + ext},40 ${-6 + ext},24 L${30 + ext},20 Q${40 + ext},16 ${32 + ext},8 L${-4 + ext},6 L${36 + ext},-4 Q${44 + ext},-12 ${34 + ext},-18 L${-6 + ext},-12 Q${-24 + ext},-26 ${-44 + ext},-14 L-90,-10`, a: 2.6 },
      { d: `M${60 + ext},-40 L${80 + ext},-40 Q${88 + ext},-40 ${88 + ext},-32 L${88 + ext},32 Q${88 + ext},40 ${80 + ext},40 L${60 + ext},40 Q${52 + ext},40 ${52 + ext},32 L${52 + ext},-32 Q${52 + ext},-40 ${60 + ext},-40 Z`, c: N.cianClaro, a: 2 },
    ]} />
  );
};
const Otravez: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-50,0 A50,50 0 1,1 0,50", a: 3 }, { d: "M-14,40 L0,50 L-12,64", a: 3 },
  ]}>
    <g transform={`rotate(${(t - t0) * 120})`} />
  </Glifo>
);

// ═════════ ESCENA 6 · "a stranger tap your shoulder 90 times … police … we call it normal … open the glass brain … first gear" ═════════
const E6 = { str: T("stranger", 103), tap: T("tap your shoulder", 104), n90: T("90 times", 105), police: T("police", 107), phone: T("phone does it", 109), normal: T("normal", 110), open: T("open the glass brain", 112), first: T("first gear", 114) };
const tomas6: Toma[] = [[103.2, 0, -30, 1.12], [107.5, 0, -80, 0.98], [109.4, 0, -60, 0.98], [109.8, 860, 0, 1.18], [112.4, 860, 0, 1.24], [112.9, 1720, -20, 1.08], [116.4, 1720, -60, 1.34]];
const toques = (t0: number, n: number, paso: number) => Array.from({ length: n }, (_, i) => t0 + i * paso);
const Hombro: React.FC = () => {
  const t = useT();
  const T0 = toques(E6.tap + 0.3, 14, 0.34);
  const ult = T0.filter((x) => x <= t).pop() ?? -9;
  const golpe = Math.exp(-14 * Math.max(0, t - ult));
  return (
    <>
      <Obj x={0} y={60} t0={E6.str - 0.4} tam={200} color={N.cianClaro} trazos={[
        { d: circ(0, -110, 58), a: 2.4 },
        { d: "M-200,200 Q-200,40 -70,20 Q0,8 70,20 Q200,40 200,200", a: 2.4 },
      ]} />
      {/* el dedo del extraño */}
      <div style={{ position: "absolute", left: 140, top: -10 + 18 * golpe, opacity: ramp(t, E6.tap, 0.3) }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          <path d="M120,-60 L20,10 Q6,20 14,30 Q22,38 34,30 L130,-30" fill="none" stroke={N.oroClaro} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${N.oro})` }} />
          {golpe > 0.2 && <path d="M0,40 L-20,56 M10,48 L4,72 M24,46 L36,66" stroke="#fff" strokeWidth={3} opacity={golpe} />}
        </svg>
      </div>
      <Contador x={-280} y={-150} t0={E6.tap + 0.3} d={E6.police - E6.tap - 0.3} a1={90} size={96} color={N.oroClaro} sufijo="taps" />
    </>
  );
};
const Sirena: React.FC = () => {
  const t = useT();
  if (!vis(t, E6.police - 0.2)) return null;
  const f = Math.floor(t * 6) % 2;
  const k = ramp(t, E6.police - 0.1, 0.3);
  return (
    <div style={{ position: "absolute", left: 0, top: -360, opacity: k }}>
      <div style={{ position: "absolute", left: -700, top: -300, width: 1400, height: 900, background: `radial-gradient(ellipse at ${f ? 30 : 70}% 40%, ${f ? "rgba(255,42,72,.35)" : "rgba(39,120,255,.35)"}, transparent 60%)` }} />
      <svg width={1} height={1} style={{ overflow: "visible" }}>
        <path d="M-60,30 L-50,-30 Q0,-70 50,-30 L60,30 Z" fill={f ? "rgba(255,42,72,.3)" : "rgba(39,120,255,.3)"} stroke={f ? N.rojo : "#3d8bff"} strokeWidth={4} style={{ filter: `drop-shadow(0 0 16px ${f ? N.rojo : "#3d8bff"})` }} />
        <path d="M-80,30 L80,30" stroke="#e6eeff" strokeWidth={4} />
      </svg>
    </div>
  );
};
const CelularHombro: React.FC = () => {
  const t = useT();
  const zz = Math.sin(t * 60) * 3 * (1 - ramp(t, E6.normal + 0.4, 0.5));
  return (
    <>
      <Obj x={860 + zz} y={20} t0={E6.phone - 0.3} tam={360} color={N.cianClaro} trazos={[
        { d: "M-56,-110 L56,-110 Q68,-110 68,-98 L68,98 Q68,110 56,110 L-56,110 Q-68,110 -68,98 L-68,-98 Q-68,-110 -56,-110 Z", a: 2.6 },
        { d: "M-100,-40 Q-112,0 -100,40 M-120,-60 Q-140,0 -120,60 M100,-40 Q112,0 100,40 M120,-60 Q140,0 120,60", c: N.violeta, a: 2, dt: 0.3 },
      ]}>
        <circle cx={48} cy={-92} r={13} fill={N.rojo} style={{ filter: `drop-shadow(0 0 8px ${N.rojo})` }} />
      </Obj>
      <Texto x={860} y={230} t0={E6.normal} texto="we call it *normal*" size={52} color={N.verde} />
    </>
  );
};
const CerebroAbre: React.FC = () => {
  const t = useT();
  const ab = ramp(t, E6.open + 0.3, 0.8, easeOut);
  const sube = ramp(t, E6.first, 0.7, easeOut);
  return (
    <>
      <Obj x={1720} y={60} t0={E6.open - 0.3} tam={200} color={N.cianClaro} trazos={[
        { d: "M-180,10 Q-190,120 -60,140 Q0,170 60,140 Q190,120 180,10 L-180,10", a: 2.4, f: "rgba(203,251,255,.03)" },
        { d: "M-120,60 Q-80,40 -40,70 Q0,100 40,60 Q90,40 130,70", c: N.gris, a: 1.6 },
      ]} />
      <div style={{ position: "absolute", left: 1720 - 180, top: 70, transformOrigin: "0 0", transform: `rotate(${-58 * ab}deg)` }}>
        <svg width={1} height={1} style={{ overflow: "visible" }} opacity={ramp(t, E6.open - 0.3, 0.4)}>
          <path d="M0,0 Q-10,-150 120,-170 Q180,-200 250,-170 Q370,-150 360,0 Z" fill="rgba(203,251,255,.04)" stroke={N.cianClaro} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${N.cian})` }} />
          <path d="M60,-60 Q100,-120 160,-90 Q220,-140 280,-80" fill="none" stroke={N.gris} strokeWidth={3} />
        </svg>
      </div>
      {/* engranaje 1 sale del cerebro */}
      <div style={{ position: "absolute", left: 1720, top: 60 - 220 * sube, opacity: sube, transform: `rotate(${t * 40}deg) scale(${0.6 + 0.4 * sube})` }}>
        <EngranajeSvg r={90} color={N.oro} n={1} />
      </div>
    </>
  );
};
export const EngranajeSvg: React.FC<{ r: number; color: string; n?: number; dientes?: number }> = ({ r, color, n, dientes = 10 }) => {
  const pts: string[] = [];
  for (let i = 0; i < dientes * 2; i++) {
    const a0 = (i / (dientes * 2)) * Math.PI * 2, a1 = ((i + 1) / (dientes * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.8 : r;
    pts.push(`${i ? "L" : "M"}${Math.cos(a0) * rr},${Math.sin(a0) * rr} L${Math.cos(a1) * rr},${Math.sin(a1) * rr}`);
  }
  return (
    <svg width={1} height={1} style={{ overflow: "visible" }}>
      <path d={pts.join(" ") + " Z"} fill="rgba(244,194,74,.08)" stroke={color} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      <circle r={r * 0.32} fill="none" stroke={color} strokeWidth={3} />
      {n !== undefined && <text textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={r * 0.5} fill={color}>{n}</text>}
    </svg>
  );
};
const Escena6: React.FC = () => (
  <EscenaMundo tomas={tomas6}>
    <Hombro />
    <Sirena />
    <Texto x={0} y={-230} t0={E6.police} texto="you would call the *police*" size={50} />
    <CelularHombro />
    <CerebroAbre />
    <Texto x={1720} y={-330} t0={E6.first + 0.2} texto="the *first gear*" size={50} color={N.oroClaro} />
  </EscenaMundo>
);

// ═════════ HUB 7 · "The first gear is called the maybe. Many years ago, a psychologist named" ═════════
const Engranaje1: D = ({ t, t0, on, tam }) => (
  <div style={{ position: "absolute", opacity: on, transform: `rotate(${(t - t0) * 30}deg)` }}><EngranajeSvg r={tam * 0.42} color={N.oro} n={1} /></div>
);
const DadoQuizas: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.violeta} trazos={[
    { d: "M-50,-30 L0,-60 L50,-30 L50,30 L0,60 L-50,30 Z M-50,-30 L0,0 L50,-30 M0,0 L0,60", a: 2.4 },
  ]}>
    <TextoNeon x={0} y={110} texto="maybe" size={36} serif color={N.oroClaro} on={ramp(t, t0 + 0.2, 0.3)} />
    <g transform={`rotate(${Math.sin(t * 3) * 8})`}><TextoNeon x={-24} y={-26} texto="?" size={28} color={N.cianClaro} /><TextoNeon x={26} y={14} texto="?" size={28} color={N.cianClaro} /></g>
  </Glifo>
);
const Ficha: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[
    { d: "M-80,-60 L80,-60 L80,60 L-80,60 Z", a: 2 },
    { d: circ(-40, -10, 22) + " M-70,40 Q-70,10 -40,10 Q-10,10 -10,40", c: N.gris, a: 2 },
    { d: "M10,-20 L60,-20 M10,0 L50,0", c: N.gris, a: 1.6 },
  ]}>
    <TextoNeon x={0} y={86} texto="1950s" size={22} serif color={N.texto2} on={ramp(t, t0 + 0.3, 0.3)} />
  </Glifo>
);

// ═════════ ESCENA 7 · la caja de Skinner: palomas, palanca, comida, hambre ═════════
const E7 = { skinner: T("Skinner", 121), pigeons: T("pigeons", 122), box: T("box", 123), lever: T("small lever", 124), pressed: T("pressed the lever", 126), food: T("food came out", 127), simple: T("Simple", 129), hungry: T("hungry", 131), full: T("full", 133) };
const tomas7: Toma[] = [[121.2, -40, -40, 1.34], [122.6, 0, 0, 1.0], [126.0, 0, 20, 1.08], [129.2, 0, 20, 1.16], [129.9, 260, 0, 1.0], [134.3, 260, 0, 1.06]];
export const Paloma: React.FC<{ x: number; y: number; t0: number; picotazos: number[]; s?: number; color?: string }> = ({ x, y, t0, picotazos, s = 1, color = "#e6eeff" }) => {
  const t = useT();
  if (t < t0 - 0.2) return null;
  const pk = Math.max(0, ...picotazos.map((tp) => (t >= tp - 0.12 && t < tp + 0.25 ? Math.sin(((t - tp + 0.12) / 0.37) * Math.PI) : 0)));
  const bob = Math.sin(t * 5) * 2;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, opacity: ramp(t, t0, 0.3), transform: `scale(${s})` }}>
      <svg width={1} height={1} style={{ overflow: "visible" }}>
        <g style={{ filter: `drop-shadow(0 0 7px ${color})` }} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
          <path d="M-50,10 Q-40,-30 0,-30 Q10,-32 18,-36 M18,-36 Q30,-30 20,24 Q-10,40 -50,10 Z" fill="rgba(230,238,255,.05)" />
          <path d="M-30,0 Q0,-14 24,4 Q0,14 -30,0" stroke={N.violeta} />
          <path d="M-50,10 L-80,0 L-74,18 Z" />
          <path d="M0,30 L-4,52 M12,28 L14,52" stroke={N.oro} />
          <g transform={`rotate(${pk * 38}, 18, -30)`}>
            <path d="M18,-36 Q22,-60 40,-56 Q52,-52 48,-42 L62,-38 L46,-34 Q40,-26 28,-26" fill="rgba(230,238,255,.05)" />
            <circle cx={38} cy={-48} r={3} fill={color} />
          </g>
        </g>
      </svg>
    </div>
  );
};
const CajaSkinner: React.FC = () => {
  const t = useT();
  const pres = [E7.pressed, E7.pressed + 1.2, E7.hungry - 0.2, E7.hungry + 0.4];
  const comida = [E7.food, E7.hungry + 0.6];
  const palanca = Math.max(0, ...pres.map((tp) => (t >= tp && t < tp + 0.3 ? 1 - (t - tp) / 0.3 : 0)));
  const lleno = ramp(t, E7.food + 0.4, 0.5) * 0.4 + ramp(t, E7.hungry + 1, 0.6) * 0.6;
  return (
    <>
      <Obj x={0} y={40} t0={E7.box - 0.3} tam={200} color={N.cian} trazos={[
        { d: "M-260,-150 L200,-150 L280,-210 L-180,-210 Z M200,-150 L200,170 L280,110 L280,-210", a: 2.2 },
        { d: "M-260,-150 L-260,170 L200,170", a: 2.2 },
        { d: "M-260,170 L-180,110 L280,110 M-180,110 L-180,-210", c: N.gris, a: 1.2 },
      ]} />
      <Paloma x={-60} y={110} t0={E7.pigeons} picotazos={pres} s={1.5} />
      {/* palanca + bandeja */}
      <div style={{ position: "absolute", left: 130, top: 40, opacity: ramp(t, E7.lever, 0.3) }}>
        <svg width={1} height={1} style={{ overflow: "visible" }}>
          <g style={{ filter: `drop-shadow(0 0 8px ${N.oro})` }} stroke={N.oro} strokeWidth={5} fill="none" strokeLinecap="round">
            <path d="M0,0 L40,0" /><path d={`M8,0 L${8 - 20},${-36 + 26 * palanca}`} /><circle cx={8 - 20} cy={-40 + 26 * palanca} r={8} fill={N.rojo} stroke={N.rojo} />
            <path d="M-10,90 L50,90 L44,110 L-4,110 Z" />
          </g>
          {comida.map((tc, i) => {
            const d = t - tc;
            if (d < 0 || d > 4) return null;
            const yy = Math.min(84, -60 + 700 * d * d);
            return <circle key={i} cx={20} cy={yy} r={8} fill={N.oro} opacity={1 - ramp(t, tc + 2.6, 0.4)} style={{ filter: `drop-shadow(0 0 8px ${N.oro})` }} />;
          })}
        </svg>
      </div>
      {/* medidor de hambre */}
      <Obj x={470} y={20} t0={E7.hungry - 0.6} tam={300} color="#e6eeff" trazos={[{ d: "M-26,-120 L26,-120 L26,120 L-26,120 Z", a: 2.2 }]}>
        <rect x={-18} y={112 - 224 * lleno} width={36} height={224 * lleno} fill={lleno > 0.9 ? N.verde : N.oro} opacity={0.7} />
      </Obj>
      <Texto x={470} y={-170} t0={E7.hungry} texto="hungry" size={36} color={N.oroClaro} t1={E7.full - 0.1} />
      <Texto x={470} y={-170} t0={E7.full} texto="*full*" size={44} color={N.verde} />
    </>
  );
};
const Escena7: React.FC = () => (
  <EscenaMundo tomas={tomas7}>
    <Texto x={-40} y={-330} t0={E7.skinner - 0.3} t1={E7.box} texto="B. F. *Skinner*" size={60} />
    <CajaSkinner />
    <Texto x={0} y={-320} t0={E7.simple} t1={E7.hungry - 0.2} texto="*Simple.*" size={64} />
  </EscenaMundo>
);

export const SEGS_M02: Seg[] = [
  {
    hub: { portal: "preg", orbs: [
      { id: "preg", t: T("Why", 67), ang: -14, anillo: 0, tam: 220, D: Pregunta },
      { id: "cel", t: T("pick up your phone", 67), ang: 200, anillo: 1, tam: 170, D: CelularSube },
      { id: "bost", t: T("bored", 70), ang: 128, anillo: 2, tam: 220, D: Bostezo },
    ] },
    Escena: Escena4,
    sonidos: (s) => { s.add("tic", E4.check + 0.3); s.add("vuelo", 75.5, 0.6); s.add("aparece", E4.story); s.add("grieta", E4.truth + 0.1, 0.5); s.add("neonOn", E4.truth + 0.35); s.add("vuelo", 79.7, 0.6); for (let i = 0; i < 14; i++) s.add("tic", E4.res + 0.5 + i * 0.18, 0.6); },
  },
  {
    hub: { portal: "enc", orbs: [
      { id: "dig", t: T("numbers", 83), ang: 196, anillo: 1, tam: 200, D: Digitos },
      { id: "enc", t: T("surveys", 84), ang: -12, anillo: 0, tam: 220, D: Encuesta },
      { id: "per", t: T("average person", 86), ang: 126, anillo: 2, tam: 200, D: Persona },
    ] },
    Escena: Escena5,
    sonidos: (s) => { for (let i = 0; i < 18; i++) s.add("digito", E5.n90 + i * 0.075, 0.6); for (let i = 0; i < 8; i++) s.add("tic", E5.far + i * 0.14, 0.6); s.add("vuelo", 92.7, 0.6); s.add("traza", E5.sec - 0.4); s.add("vuelo", 95.8, 0.6); s.add("palanca", E5.unlock, 0.6); s.add("aparece", E5.look, 0.6); s.add("palanca", E5.lock, 0.6); s.add("vacio", E5.nada); },
  },
  {
    hub: { portal: "mano", orbs: [
      { id: "rel", t: T("few minutes", 99), ang: 198, anillo: 1, tam: 170, D: RelojMin },
      { id: "mano", t: T("your hand", 101), ang: -14, anillo: 0, tam: 260, D: ManoEstira },
      { id: "otra", t: T("again", 102), ang: 130, anillo: 2, tam: 160, D: Otravez },
    ] },
    Escena: Escena6,
    sonidos: (s) => { toques(E6.tap + 0.3, 14, 0.34).forEach((tt) => s.add("toque", tt, 0.7)); s.add("aviso", E6.police - 0.1, 0.8); s.add("vuelo", 109.7, 0.6); s.add("aviso", E6.phone, 0.6); s.add("vuelo", 112.8, 0.6); s.add("grieta", E6.open + 0.3, 0.6); s.add("engranaje", E6.first); },
  },
  {
    hub: { portal: "eng", orbs: [
      { id: "eng", t: T("first gear", 116), ang: -16, anillo: 0, tam: 230, D: Engranaje1, png: "engranaje" },
      { id: "dado", t: T("maybe", 117), ang: 196, anillo: 1, tam: 160, D: DadoQuizas },
      { id: "ficha", t: T("psychologist", 119), ang: 128, anillo: 2, tam: 200, D: Ficha },
    ] },
    Escena: Escena7,
    sonidos: (s) => { s.add("aparece", E7.pigeons); s.add("traza", E7.box - 0.3); s.add("palanca", E7.pressed); s.add("palanca", E7.pressed + 1.2, 0.7); s.add("premio", E7.food, 0.5); s.add("palanca", E7.hungry - 0.2, 0.7); s.add("palanca", E7.hungry + 0.4, 0.7); s.add("premio", E7.hungry + 0.6, 0.4); s.add("latido", E7.full); },
  },
];
