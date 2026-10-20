// gb01 v2 · MINUTO 10 (ventanas 36-39, 603-670 s): la trampa del mono · el dulce, el coco atado al árbol · el mono huele, mete
// la mano, la cierra · el puño no sale · vuelven los cazadores · "abrí la mano" · nada lo sujetaba · tren, calle, cena con
// rectángulos que brillan · el celular-coco · nosotros lo sostenemos · el dulce es chiquito · "probá algo conmigo".
import React from "react";
import { N, Toma, easeOut, lerp, neonOn, pop, ramp, useT } from "../../kits/neon/base";
import { T } from "./datos";
import { Glifo, TextoNeon } from "./glifo";
import { EscenaMundo, Texto, circ } from "./esc";
import type { Seg } from "./Video";

type D = React.FC<{ t: number; t0: number; on: number; tam: number }>;
const abs = (x: number, y: number) => ({ position: "absolute" as const, left: x, top: y, overflow: "visible" as const });
const glow = (c: string, b = 8) => ({ filter: `drop-shadow(0 0 ${b}px ${c})` });
const COCO = "#c99a5b";
const MONO = N.oroClaro;
const DULCE = "#ff7ad9";
const Persona: React.FC<{ x: number; y: number; s?: number; c?: string; op?: number }> = ({ x, y, s = 1, c = "#e6eeff", op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op} style={glow(c, 6)}>
    <circle cx={0} cy={-90} r={26} fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
    <path d="M-44,30 Q-44,-56 0,-58 Q44,-56 44,30 Z" fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={3.5} />
  </g>
);
// el mono (de perfil, mirando a la derecha); brazo = ángulo en grados
const Mono: React.FC<{ x: number; y: number; s?: number; brazo?: number; grita?: number }> = ({ x, y, s = 1, brazo = 20, grita = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} style={glow(MONO, 6)}>
    <path d="M-40,40 Q-90,50 -80,0 Q-74,-30 -56,-20" fill="none" stroke={MONO} strokeWidth={3} />
    <ellipse cx={-10} cy={20} rx={34} ry={44} fill="rgba(5,5,6,.9)" stroke={MONO} strokeWidth={3} />
    <circle cx={0} cy={-46} r={30} fill="rgba(5,5,6,.9)" stroke={MONO} strokeWidth={3} />
    <circle cx={-28} cy={-54} r={11} fill="rgba(5,5,6,.9)" stroke={MONO} strokeWidth={3} />
    <circle cx={10} cy={-52} r={4} fill={MONO} />
    <path d={grita ? "M8,-34 Q22,-24 30,-36 Q20,-18 8,-34 Z" : "M14,-34 Q22,-32 28,-36"} fill={grita ? MONO : "none"} stroke={MONO} strokeWidth={2.5} />
    <path d={`M10,0 L${10 + 70 * Math.cos((brazo * Math.PI) / 180)},${70 * Math.sin((brazo * Math.PI) / 180)}`} stroke={MONO} strokeWidth={5} strokeLinecap="round" />
    <path d="M-30,60 L-34,90 M6,60 L10,90" stroke={MONO} strokeWidth={4} strokeLinecap="round" />
  </g>
);
const Caramelo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} style={glow(DULCE, 10)}>
    <circle r={16} fill="rgba(255,122,217,.4)" stroke={DULCE} strokeWidth={3} />
    <path d="M-16,0 L-32,-12 L-32,12 Z M16,0 L32,-12 L32,12 Z" fill="none" stroke={DULCE} strokeWidth={3} strokeLinejoin="round" />
  </g>
);
// mano: k=0 abierta (palma con cinco dedos, apuntando arriba), k=1 puño con nudillos; fundido entre las dos
const ManoK: React.FC<{ k: number; s?: number; c?: string }> = ({ k, s = 1, c = "#e6eeff" }) => {
  const a = Math.min(1, Math.max(0, 1 - k * 1.6)), b = Math.min(1, Math.max(0, (k - 0.35) * 1.6));
  return (
    <g transform={`scale(${s})`} style={glow(c, 6)}>
      <g opacity={a}>
        <path d="M-56,140 L-56,20 Q-60,-20 -92,-50 Q-104,-64 -90,-74 Q-76,-82 -62,-64 L-44,-36 L-44,-130 Q-44,-150 -28,-150 Q-12,-150 -12,-130 L-12,-60 L-12,-168 Q-12,-188 4,-188 Q20,-188 20,-168 L20,-60 L20,-156 Q20,-176 36,-176 Q52,-176 52,-156 L52,-50 L52,-112 Q52,-130 66,-130 Q80,-130 80,-112 L80,40 Q80,100 56,140 Z" fill="rgba(5,5,6,.88)" stroke={c} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <g opacity={b}>
        <path d="M-56,140 L-56,40 Q-70,-40 -40,-80 Q0,-100 60,-84 Q86,-70 84,-20 L80,60 Q76,110 56,140 Z" fill="rgba(5,5,6,.9)" stroke={c} strokeWidth={4} strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-40 + i * 32},-84 Q${-24 + i * 32},-100 ${-8 + i * 32},-84`} fill="none" stroke={c} strokeWidth={3.5} />)}
        {[0, 1, 2].map((i) => <path key={"l" + i} d={`M${-8 + i * 32},-84 L${-8 + i * 32},-40`} stroke={c} strokeWidth={2.5} opacity={0.7} />)}
        <path d="M-60,10 Q-20,-10 30,-30" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ═════════ HUB 36 · "Inside, they put a sweet. Then they tied the coconut to a tree and" ═════════
const DulceHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={DULCE} trazos={[]}><g transform={`rotate(${10 * Math.sin(t * 2)})`}><Caramelo x={0} y={0} s={2.4} /></g></Glifo>
);
const Soga: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#d9b98a" trazos={[{ d: "M-80,-40 Q-40,-80 0,-40 Q40,0 0,40 Q-40,80 -80,40 Q-110,0 -80,-40 M0,40 Q50,70 90,40", a: 3 }]} />
);
const CocoArbol: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={N.verde} trazos={[{ d: "M-50,90 L-46,-80 M-30,90 L-34,-80 M-40,-80 Q-100,-110 -90,-60 M-40,-80 Q20,-110 30,-60", a: 2.6 }, { d: "M-34,10 Q10,20 30,30", c: "#d9b98a", a: 2.2 }]}>
    <ellipse cx={46} cy={50} rx={34} ry={30} fill="rgba(140,90,40,.25)" stroke={COCO} strokeWidth={3} /><circle cx={56} cy={44} r={8} fill="#000" stroke={N.oroClaro} strokeWidth={2} />
  </Glifo>
);

// ═════════ ESCENA 36 · se van · llega el mono · huele · mete la mano · la cierra ═════════
const E36 = { walked: T("walked away", 608.5), came: T("A monkey came", 609.5), smelled: T("smelled the sweet", 611), slipped: T("slipped its hand", 613), hole: T("through the hole", 614), grabbed: T("grabbed it", 615), fist: T("hand was a", 617) };
const tomas36: Toma[] = [[609.0, 0, 0, 1.0], [611.3, 0, 0, 1.04], [611.8, 950, 0, 1.12], [615.2, 950, 0, 1.24], [616.6, 1850, 0, 1.08], [619.0, 1850, 0, 1.18]];
const Arbol: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`} style={glow(N.verde, 6)}>
    <path d="M-14,240 L-10,-140 M14,240 L10,-140" stroke={N.verde} strokeWidth={4} />
    <path d="M0,-140 Q-140,-190 -190,-100 M0,-140 Q140,-190 190,-100 M0,-140 Q-80,-230 -120,-220 M0,-140 Q80,-230 120,-220" fill="none" stroke={N.verde} strokeWidth={4} />
  </g>
);
const SeVan: React.FC = () => {
  const t = useT();
  const camina = ramp(t, E36.walked, 2.2);
  const llega = ramp(t, E36.came, 1.2, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 20)}>
        <Arbol x={-60} y={0} />
        <path d="M-50,80 Q20,110 60,130" fill="none" stroke="#d9b98a" strokeWidth={4} />
        <ellipse cx={90} cy={160} rx={60} ry={52} fill="rgba(140,90,40,.25)" stroke={COCO} strokeWidth={4} style={glow(COCO, 8)} />
        <circle cx={110} cy={146} r={13} fill="#000" stroke={N.oroClaro} strokeWidth={3} />
        {/* cazadores que se alejan (siluetas anónimas) */}
        {[0, 1].map((i) => <Persona key={i} x={lerp(280 + i * 90, 640 + i * 90, camina)} y={240 + 6 * Math.abs(Math.sin(t * 6 + i))} s={0.9} c={N.texto2} op={1 - ramp(t, E36.walked + 1.6, 0.6)} />)}
        {/* llega el mono */}
        <g opacity={llega}><Mono x={lerp(-600, -260, llega)} y={200 - 20 * Math.abs(Math.sin(t * 7)) * (1 - llega)} s={1.1} brazo={30} /></g>
      </svg>
      <Texto x={0} y={-300} t0={E36.walked} texto="they *walked away*" size={52} t1={E36.came} />
      <Texto x={0} y={-300} t0={E36.came} texto="a *monkey* came" size={56} color={MONO} />
    </>
  );
};
const Huele: React.FC = () => {
  const t = useT();
  if (t < E36.smelled - 0.5) return null;
  const entra = ramp(t, E36.slipped + 0.2, 1.0, easeOut);
  const cierra = ramp(t, E36.grabbed + 0.1, 0.4);
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E36.smelled - 0.5, 0.4)}>
        <defs><clipPath id="c36"><ellipse cx={0} cy={60} rx={226} ry={196} /></clipPath></defs>
        <ellipse cx={0} cy={60} rx={230} ry={200} fill="rgba(140,90,40,.2)" stroke={COCO} strokeWidth={5} style={glow(COCO, 8)} />
        <g clipPath="url(#c36)" opacity={0.25 + 0.75 * ramp(t, E36.hole, 0.4)}>
          {/* rayos-x: adentro se ve el dulce */}
          <Caramelo x={20} y={110} s={2.2 * (1 - 0.3 * cierra)} />
        </g>
        <circle cx={0} cy={-60} r={58} fill="#000" stroke={N.oroClaro} strokeWidth={4} />
        {/* olor */}
        {[0, 1, 2].map((i) => { const d = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M${-20 + i * 20},${-110 - d * 160} q12,-14 0,-28 q-12,-14 0,-28`} fill="none" stroke={DULCE} strokeWidth={3} opacity={(1 - d) * (1 - entra)} />; })}
        {/* la mano entra por el agujero y se cierra */}
        <g transform={`translate(0,${lerp(-300, 60, entra)})`} opacity={ramp(t, E36.slipped, 0.3)}><ManoK k={cierra} s={0.55} c={MONO} /></g>
      </svg>
      <Texto x={950} y={-300} t0={E36.smelled} texto="it *smelled* the sweet" size={50} color={DULCE} t1={E36.slipped} />
      <Texto x={950} y={-300} t0={E36.slipped} texto="slipped its hand *through*" size={50} t1={E36.grabbed} />
      <Texto x={950} y={-300} t0={E36.grabbed} texto="and *grabbed* it" size={56} color={MONO} />
    </>
  );
};
const Puno: React.FC = () => {
  const t = useT();
  if (t < E36.fist - 0.5) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(1850, 40)} opacity={ramp(t, E36.fist - 0.5, 0.4)}>
        <circle cx={0} cy={-150} r={58} fill="#000" stroke={N.oroClaro} strokeWidth={4} style={glow(N.oro, 8)} />
        <g transform="translate(0,90)"><ManoK k={1} s={1.4} c={MONO} /></g>
        <circle cx={0} cy={60} r={lerp(60, 120, (Math.sin(t * 5) + 1) / 2)} fill="none" stroke={DULCE} strokeWidth={3} opacity={0.4} />
      </svg>
      <Texto x={1850} y={-310} t0={E36.fist} texto="now its hand was a *fist*" size={52} color={MONO} />
    </>
  );
};
const Escena36: React.FC = () => <EscenaMundo tomas={tomas36}><SeVan /><Huele /><Puno /></EscenaMundo>;

// ═════════ HUB 37 · "a fist is bigger than an open hand. The monkey could not pull it out." ═════════
const PunoHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MONO} trazos={[{ d: circ(0, -80, 22), c: N.oroClaro, a: 2 }]}><g transform="translate(0,20)"><ManoK k={1} s={0.5} c={MONO} /></g></Glifo>
);
const AbiertaHub: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: circ(0, -80, 22), c: N.oroClaro, a: 2 }]}><g transform="translate(0,20)"><ManoK k={0} s={0.45} /></g></Glifo>
);
const Atascado: D = ({ t, t0, on, tam }) => {
  const tira = Math.sin(t * 9) * 6;
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={COCO} trazos={[]}>
      <ellipse cx={0} cy={20} rx={70} ry={60} fill="rgba(140,90,40,.25)" stroke={COCO} strokeWidth={3} />
      <path d={`M-10,-30 L${-20 + tira},-110 M10,-30 L${20 + tira},-110`} stroke={MONO} strokeWidth={5} strokeLinecap="round" />
      <path d={`M-40,-80 L-70,-100 M40,-80 L70,-100`} stroke={N.rojoBorde} strokeWidth={3} opacity={Math.abs(Math.sin(t * 9))} />
    </Glifo>
  );
};

// ═════════ ESCENA 37 · vuelven los cazadores · el mono grita y tira · nunca pensó · abrí la mano ═════════
const E37 = { back: T("hunters came back", 624), slowly: T("slowly", 625.5), screamed: T("monkey screamed", 626), pulled: T("pulled and pulled", 628), never: T("never thought", 630), free: T("set it free", 632), open: T("Open the hand", 633), letgo: T("let go of", 634) };
const tomas37: Toma[] = [[624.1, 0, 0, 1.0], [629.9, 0, 0, 1.06], [630.3, 950, 0, 1.12], [633.4, 950, 0, 1.0], [633.8, 1850, 0, 1.14], [636.3, 1850, 0, 1.26]];
const Vuelven: React.FC = () => {
  const t = useT();
  const vienen = ramp(t, E37.back, 5, (x) => x);
  const grito = t > E37.screamed && t < E37.never ? 1 : 0;
  const tiron = grito ? Math.sin(t * 18) * 14 : 0;
  return (
    <>
      <svg width={1} height={1} style={abs(0, 20)}>
        <Arbol x={-60} y={0} />
        <path d={`M-50,80 Q20,${100 - (grito ? 14 : 0)} 60,130`} fill="none" stroke="#d9b98a" strokeWidth={4} />
        <ellipse cx={90 + tiron * 0.4} cy={160} rx={60} ry={52} fill="rgba(140,90,40,.25)" stroke={COCO} strokeWidth={4} style={glow(COCO, 8)} />
        <g transform={`translate(${tiron},0)`}><Mono x={240} y={200} s={1.1} brazo={180} grita={grito} /></g>
        {grito > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${290 + i * 10},${110 - i * 16} l${30 + i * 10},${-20 - i * 6}`} stroke={N.rojoBorde} strokeWidth={4} strokeLinecap="round" opacity={Math.abs(Math.sin(t * 12 + i))} />)}
        {/* los cazadores vuelven despacio desde la derecha */}
        {[0, 1, 2].map((i) => <Persona key={i} x={lerp(900 + i * 90, 520 + i * 90, vienen)} y={240 + 4 * Math.abs(Math.sin(t * 3 + i))} s={1.0} c={N.texto2} op={ramp(t, E37.back - 0.3, 0.5)} />)}
      </svg>
      <Texto x={0} y={-300} t0={E37.back} texto="the hunters came back, *slowly*" size={48} color={N.texto2} t1={E37.screamed} />
      <Texto x={0} y={-300} t0={E37.screamed} texto="it *pulled* and pulled" size={56} color={N.rojoBorde} />
    </>
  );
};
const NuncaPenso: React.FC = () => {
  const t = useT();
  if (t < E37.never - 0.4) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E37.never - 0.4, 0.4)}>
        <Mono x={-120} y={150} s={1.6} brazo={60} />
        {[0, 1, 2].map((i) => <circle key={i} cx={-40 + i * 40} cy={-20 - i * 40} r={8 + i * 5} fill="none" stroke="#e6eeff" strokeWidth={3} />)}
        <g transform="translate(160,-150)">
          <ellipse rx={150} ry={100} fill="rgba(5,5,6,.9)" stroke="#e6eeff" strokeWidth={3.5} strokeDasharray="10 8" style={glow("#fff", 6)} />
          <g opacity={ramp(t, E37.free, 0.4)} transform="scale(0.45)"><ManoK k={0} c={N.verde} /></g>
          <text y={-130} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={30} fill={N.verde} opacity={ramp(t, E37.free, 0.4)}>the one thing</text>
        </g>
      </svg>
      <Texto x={950} y={-310} t0={E37.never} texto="it *never* thought of it" size={50} t1={E37.free} />
      <Texto x={950} y={-310} t0={E37.free} texto="the one thing that would set it *free*" size={44} color={N.verde} />
    </>
  );
};
const AbreLaMano: React.FC = () => {
  const t = useT();
  if (t < E37.open - 0.4) return null;
  const abre = ramp(t, E37.open + 0.3, 1.0, easeOut);
  const cae = ramp(t, E37.letgo + 0.2, 0.7);
  const sale = ramp(t, E37.letgo + 0.5, 0.8, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(1850, 40)} opacity={ramp(t, E37.open - 0.4, 0.4)}>
        <defs><clipPath id="c37"><ellipse cx={0} cy={80} rx={216} ry={176} /></clipPath></defs>
        <ellipse cx={0} cy={80} rx={220} ry={180} fill="rgba(140,90,40,.2)" stroke={COCO} strokeWidth={5} style={glow(COCO, 8)} />
        <g clipPath="url(#c37)"><Caramelo x={20} y={lerp(80, 200, cae)} s={2} /></g>
        <circle cx={0} cy={-60} r={58} fill="#000" stroke={N.oroClaro} strokeWidth={4} />
        <g transform={`translate(0,${lerp(70, -360, sale)})`}><ManoK k={1 - abre} s={0.6} c={abre > 0.9 ? N.verde : MONO} /></g>
        {sale > 0.2 && <circle cx={0} cy={-60} r={lerp(58, 260, sale)} fill="none" stroke={N.verde} strokeWidth={3} opacity={1 - sale} />}
      </svg>
      <Texto x={1850} y={-310} t0={E37.open} texto="*open* the hand" size={60} color={N.verde} t1={E37.letgo} />
      <Texto x={1850} y={-310} t0={E37.letgo} texto="let go of the *sweet*" size={56} color={DULCE} />
    </>
  );
};
const Escena37: React.FC = () => <EscenaMundo tomas={tomas37}><Vuelven /><NuncaPenso /><AbreLaMano /></EscenaMundo>;

// ═════════ HUB 38 · "Nothing was holding the monkey, only its own fist." ═════════
const Cadenas: D = ({ t, t0, on, tam }) => {
  const d = ramp(t, t0 + 0.6, 1.2);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.gris} trazos={[]}>
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-66 + i * 44} cy={(i % 2) * 6} rx={26} ry={14} fill="none" stroke={N.texto2} strokeWidth={5} transform={`translate(${(i - 1.5) * 40 * d},${-30 * d * (i % 2 ? 1 : -1)})`} opacity={1 - d} />)}
      <TextoNeon y={60} texto="nothing" size={22} serif color={N.texto2} on={ramp(t, t0 + 0.2, 0.3)} />
    </Glifo>
  );
};
const MonoCara: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MONO} trazos={[{ d: circ(0, 0, 50), a: 2.6 }, { d: circ(-56, -10, 18) + " " + circ(56, -10, 18), a: 2.4 }]}>
    <circle cx={-16} cy={-6} r={5} fill={MONO} /><circle cx={16} cy={-6} r={5} fill={MONO} /><path d="M-14,22 Q0,30 14,22" fill="none" stroke={MONO} strokeWidth={3} />
  </Glifo>
);
const PunoBrilla: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={MONO} trazos={[]}>
    <circle r={80 + 6 * Math.sin(t * 4)} fill="rgba(255,190,90,.08)" stroke={N.oro} strokeWidth={2} />
    <g transform="translate(0,10)"><ManoK k={1} s={0.62} c={MONO} /></g>
  </Glifo>
);

// ═════════ ESCENA 38 · tren · calle · cena · cada uno con un rectángulo que brilla · el coco · el celular no nos sujeta ═════════
const E38 = { train: T("on the train", 641.5), street: T("on the street", 643), dinner: T("at dinner with", 644), glowing: T("glowing rectangle", 647), coconut: T("that coconut", 649.5), phone: T("The phone does", 650.5), hold: T("not hold us", 651.5) };
const tomas38: Toma[] = [[641.0, 0, 0, 1.02], [642.9, 0, 0, 1.0], [643.3, 950, 0, 1.04], [644.3, 950, 0, 1.0], [644.8, 1900, 0, 1.04], [648.8, 1900, 0, 0.96], [649.3, 2850, 0, 1.1], [652.9, 2850, 0, 1.16]];
const PantallaCara: React.FC<{ x: number; y: number; s?: number; t: number; i: number }> = ({ x, y, s = 1, t, i }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Persona x={0} y={0} s={0.8} c={N.texto2} />
    <path d={`M-8,-60 L40,-120 L40,-20 Z`} fill={`rgba(160,240,255,${0.12 + 0.05 * Math.sin(t * 3 + i)})`} />
    <rect x={22} y={-48} width={30} height={46} rx={5} fill="rgba(160,240,255,.5)" stroke={N.cianClaro} strokeWidth={2.5} style={glow(N.cian, 12)} />
  </g>
);
const Tren: React.FC = () => {
  const t = useT();
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)} opacity={ramp(t, 640.6, 0.4)}>
        <rect x={-420} y={-170} width={840} height={340} rx={30} fill="rgba(5,5,6,.6)" stroke="#e6eeff" strokeWidth={3} style={glow("#fff", 4)} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-380 + i * 200} y={-140} width={160} height={90} rx={10} fill="none" stroke={N.gris} strokeWidth={2} />)}
        {[0, 1, 2, 3].map((i) => { const d = ((t * 400 + i * 200) % 800); return <path key={"l" + i} d={`M${-380 + d},-100 l60,0`} stroke={N.texto2} strokeWidth={2} opacity={0.4} />; })}
        {[0, 1, 2, 3].map((i) => <PantallaCara key={i} x={-300 + i * 200} y={140} s={0.9} t={t} i={i} />)}
      </svg>
      <Texto x={0} y={-300} t0={E38.train} texto="on the *train*" size={52} color={N.cianClaro} />
    </>
  );
};
const Calle: React.FC = () => {
  const t = useT();
  if (t < E38.street - 0.5) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(950, 40)} opacity={ramp(t, E38.street - 0.5, 0.3)}>
        {[[-300, 220], [-120, 280], [80, 200], [260, 260]].map(([x, h], i) => <rect key={i} x={x - 70} y={150 - h - 80} width={140} height={h} fill="rgba(5,5,6,.6)" stroke={N.gris} strokeWidth={2} />)}
        <path d="M-420,170 L420,170" stroke="#e6eeff" strokeWidth={3} />
        {[0, 1, 2].map((i) => <PantallaCara key={i} x={-220 + i * 220 + ((t * 30 + i * 70) % 60)} y={150} s={1} t={t} i={i} />)}
      </svg>
      <Texto x={950} y={-300} t0={E38.street} texto="on the *street*" size={52} color={N.cianClaro} />
    </>
  );
};
const Cena: React.FC = () => {
  const t = useT();
  if (t < E38.dinner - 0.5) return null;
  return (
    <>
      <svg width={1} height={1} style={abs(1900, 40)} opacity={ramp(t, E38.dinner - 0.5, 0.3)}>
        <path d="M-80,-230 L80,-230 L40,-180 L-40,-180 Z" fill="rgba(255,200,120,.1)" stroke={N.oroClaro} strokeWidth={2} />
        <path d="M-200,-180 L-340,140 M200,-180 L340,140" stroke="rgba(255,200,120,.08)" strokeWidth={0} />
        <ellipse cx={0} cy={120} rx={360} ry={70} fill="rgba(5,5,6,.9)" stroke={N.oroClaro} strokeWidth={3.5} style={glow(N.oro, 6)} />
        {[-140, 0, 140].map((x, i) => <ellipse key={i} cx={x} cy={118} rx={44} ry={12} fill="none" stroke={N.oro} strokeWidth={2} />)}
        {[[-300, 60, 1], [-110, 30, 0.85], [110, 30, 0.85], [300, 60, 1]].map(([x, y, s], i) => <PantallaCara key={i} x={x} y={y} s={s} t={t} i={i} />)}
        <path d="M-10,96 Q-6,70 4,60 M6,96 Q12,72 22,66" fill="none" stroke={N.texto2} strokeWidth={2} opacity={0.6} />
      </svg>
      <Texto x={1900} y={-300} t0={E38.dinner} texto="at dinner with their *families*" size={48} color={N.oroClaro} t1={E38.glowing} />
      <Texto x={1900} y={-300} t0={E38.glowing} texto="each one holding a *glowing rectangle*" size={44} color={N.cianClaro} />
    </>
  );
};
const CelularCoco: React.FC = () => {
  const t = useT();
  if (t < E38.coconut - 0.6) return null;
  const m = ramp(t, E38.coconut, 0.9, easeOut);
  const suelto = ramp(t, E38.hold, 0.8, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(2850, 40)} opacity={ramp(t, E38.coconut - 0.6, 0.4)}>
        {/* el celular se transforma en coco */}
        <rect x={lerp(-110, -230, m)} y={lerp(-200, -170, m)} width={lerp(220, 460, m)} height={lerp(400, 340, m)} rx={lerp(30, 170, m)} fill={`rgba(${Math.round(lerp(160, 140, m))},${Math.round(lerp(240, 90, m))},${Math.round(lerp(255, 40, m))},.2)`} stroke={m > 0.5 ? COCO : N.cianClaro} strokeWidth={5} style={glow(m > 0.5 ? COCO : N.cian, 10)} />
        <circle cx={0} cy={-60} r={lerp(0, 48, m)} fill="#000" stroke={N.oroClaro} strokeWidth={3} />
        {/* la mano que lo agarra, nada que la ate */}
        <g transform={`translate(${lerp(0, 0, suelto)},${lerp(220, 260, suelto)})`}><ManoK k={1} s={0.7} c="#e6eeff" /></g>
        {suelto > 0 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${-260 + i * 170},-260 L${-260 + i * 170},-200`} stroke={N.gris} strokeWidth={3} strokeDasharray="6 8" opacity={1 - suelto} />)}
      </svg>
      <Texto x={2850} y={-300} t0={E38.coconut} texto="I think of that *coconut*" size={50} color="#e8c48a" t1={E38.phone} />
      <Texto x={2850} y={-300} t0={E38.phone} texto="the phone does *not hold us*" size={50} />
    </>
  );
};
const Escena38: React.FC = () => <EscenaMundo tomas={tomas38}><Tren /><Calle /><Cena /><CelularCoco /></EscenaMundo>;

// ═════════ HUB 39 · "We hold it. And the sweet inside, the maybe, the little spark," ═════════
const ManoSostiene: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color="#e6eeff" trazos={[{ d: "M-26,-80 L26,-80 Q34,-80 34,-72 L34,-6 Q34,2 26,2 L-26,2 Q-34,2 -34,-6 L-34,-72 Q-34,-80 -26,-80 Z", c: N.cianClaro, a: 2.4 }]}>
    <g transform="translate(0,60)"><ManoK k={1} s={0.5} /></g>
  </Glifo>
);
const CelCoco: D = ({ t, t0, on, tam }) => (
  <Glifo t={t} t0={t0} on={on} tam={tam} color={COCO} trazos={[{ d: "M-50,-80 L50,-80 Q66,-80 66,-64 L66,64 Q66,80 50,80 L-50,80 Q-66,80 -66,64 L-66,-64 Q-66,-80 -50,-80 Z", a: 2.6 }]}>
    <Caramelo x={0} y={10} s={1.6} />
  </Glifo>
);
const Chispa: D = ({ t, t0, on, tam }) => {
  const s = 1 + 0.2 * Math.sin(t * 7);
  return (
    <Glifo t={t} t0={t0} on={on} tam={tam} color={N.oroClaro} trazos={[{ d: circ(0, 0, 80), c: N.gris, a: 1.4 }]}>
      <g transform={`scale(${s})`} style={glow(N.oro, 16)}><path d="M0,-40 L9,-9 L40,0 L9,9 L0,40 L-9,9 L-40,0 L-9,-9 Z" fill={N.oroClaro} /></g>
    </Glifo>
  );
};

// ═════════ ESCENA 39 · es tan chiquito · un mensaje que podía esperar · un video que olvidamos · un like de un desconocido · probá algo ═════════
const E39 = { small: T("is so small", 658), message: T("A message that", 659.5), hour: T("wait an hour", 660), video: T("A video we", 661), forget: T("forget tomorrow", 662), like: T("A like from", 665), never: T("never met", 666.5), try: T("Try something", 667.5), now: T("right now", 669), look: T("Look at your", 670) };
const tomas39: Toma[] = [[658.6, 0, 0, 1.2], [659.7, 0, 0, 1.0], [660.2, 900, 0, 1.08], [662.7, 900, 0, 1.0], [663.2, 1800, 0, 1.08], [665.1, 1800, 0, 1.0], [665.6, 2700, 0, 1.08], [667.5, 2700, 0, 1.0], [668.0, 3600, 0, 1.06], [670.8, 3600, 0, 1.18]];
const TanChico: React.FC = () => {
  const t = useT();
  const enc = 1 - 0.85 * ramp(t, E39.small + 0.2, 1.0, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(0, 40)}>
        <g transform={`scale(${enc})`} style={glow(N.oro, 16)}><path d="M0,-140 L30,-30 L140,0 L30,30 L0,140 L-30,30 L-140,0 L-30,-30 Z" fill={N.oroClaro} opacity={0.9} /></g>
        <circle r={lerp(200, 60, ramp(t, E39.small + 0.2, 1.0))} fill="none" stroke={N.cianClaro} strokeWidth={3} strokeDasharray="4 8" />
        <path d="M-180,200 L180,200 M-180,190 L-180,210 M180,190 L180,210" stroke={N.gris} strokeWidth={2} />
      </svg>
      <Texto x={0} y={-300} t0={E39.small} texto="so *small*" size={64} color={N.oroClaro} />
    </>
  );
};
const MsgEspera: React.FC = () => {
  const t = useT();
  if (t < E39.message - 0.5) return null;
  const gris = ramp(t, E39.hour, 0.8);
  return (
    <>
      <svg width={1} height={1} style={abs(900, 40)} opacity={ramp(t, E39.message - 0.5, 0.4)}>
        <path d="M-200,-90 L200,-90 Q220,-90 220,-70 L220,50 Q220,70 200,70 L-80,70 L-130,120 L-130,70 L-200,70 Q-220,70 -220,50 L-220,-70 Q-220,-90 -200,-90 Z" fill="rgba(5,5,6,.9)" stroke={gris > 0.5 ? N.gris : N.cianClaro} strokeWidth={4} style={glow(N.cian, 8 * (1 - gris))} />
        <path d="M-170,-40 L170,-40 M-170,0 L80,0" stroke={gris > 0.5 ? N.gris : N.cianClaro} strokeWidth={6} strokeLinecap="round" />
        <g transform="translate(240,-110)" opacity={ramp(t, E39.hour, 0.3)}><circle r={50} fill="rgba(5,5,6,.95)" stroke={N.oroClaro} strokeWidth={4} /><path d={`M0,0 L0,-34 M0,0 L${30 * Math.sin(t * 2)},${-30 * Math.cos(t * 2)}`} stroke={N.oroClaro} strokeWidth={4} strokeLinecap="round" /><text y={86} textAnchor="middle" fontFamily="sans-serif" fontWeight={900} fontSize={30} fill={N.oroClaro}>1h</text></g>
      </svg>
      <Texto x={900} y={-300} t0={E39.message} texto="a message that could *wait*" size={50} color={N.cianClaro} />
    </>
  );
};
const VideoOlvido: React.FC = () => {
  const t = useT();
  if (t < E39.video - 0.5) return null;
  const polvo = ramp(t, E39.forget + 0.2, 1.2);
  return (
    <>
      <svg width={1} height={1} style={abs(1800, 40)} opacity={ramp(t, E39.video - 0.5, 0.4)}>
        <g opacity={1 - polvo}><rect x={-200} y={-120} width={400} height={240} rx={20} fill="rgba(5,5,6,.9)" stroke={N.violeta} strokeWidth={4} style={glow(N.violeta, 8)} /><path d="M-26,-40 L40,0 L-26,40 Z" fill={N.violeta} /></g>
        {Array.from({ length: 40 }, (_, i) => { const x = -200 + (i % 10) * 44, y = -120 + Math.floor(i / 10) * 70; return <rect key={i} x={x + polvo * (60 + (i * 37) % 120)} y={y - polvo * (40 + (i * 53) % 160)} width={10} height={10} fill={N.violeta} opacity={polvo > 0 ? (1 - polvo) * 0.8 : 0} />; })}
        <text y={190} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={34} fill={N.texto2} opacity={ramp(t, E39.forget, 0.3)}>tomorrow: gone</text>
      </svg>
      <Texto x={1800} y={-300} t0={E39.video} texto="a video we will *forget*" size={50} color={N.violeta} />
    </>
  );
};
const LikeExtrano: React.FC = () => {
  const t = useT();
  if (t < E39.like - 0.5) return null;
  const vuela = ramp(t, E39.like + 0.2, 1.0, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(2700, 40)} opacity={ramp(t, E39.like - 0.5, 0.4)}>
        <g transform="translate(-260,120)"><circle cx={0} cy={-90} r={30} fill="rgba(5,5,6,.9)" stroke={N.gris} strokeWidth={3} strokeDasharray="6 6" /><path d="M-50,40 Q-50,-56 0,-58 Q50,-56 50,40 Z" fill="rgba(5,5,6,.9)" stroke={N.gris} strokeWidth={3} strokeDasharray="6 6" /><text y={-82} textAnchor="middle" dominantBaseline="central" fontFamily="sans-serif" fontWeight={900} fontSize={34} fill={N.texto2}>?</text></g>
        <g transform={`translate(${lerp(-200, 220, vuela)},${lerp(0, -40, vuela) - 80 * Math.sin(vuela * Math.PI)})`} style={glow(N.rojo, 10)}><path d="M0,24 C-54,-8 -36,-60 0,-30 C36,-60 54,-8 0,24 Z" fill={N.rojo} /></g>
        <g transform="translate(260,120)"><Persona x={0} y={0} s={1} /></g>
      </svg>
      <Texto x={2700} y={-300} t0={E39.like} texto="from someone we have *never met*" size={46} color={N.rojoBorde} />
    </>
  );
};
const Probemos: React.FC = () => {
  const t = useT();
  if (t < E39.try - 0.5) return null;
  const abre = ramp(t, E39.look, 0.8, easeOut);
  return (
    <>
      <svg width={1} height={1} style={abs(3600, 40)} opacity={ramp(t, E39.try - 0.5, 0.4)}>
        <circle r={240} fill="rgba(255,200,120,.04)" stroke={N.oroClaro} strokeWidth={2} strokeDasharray="4 10" transform={`rotate(${t * 10})`} />
        <g transform="translate(0,60)"><ManoK k={1 - abre} s={1.1} c={N.oroClaro} /></g>
        <text y={-210} textAnchor="middle" fontFamily="monospace" fontSize={26} fill={N.texto2} opacity={neonOn(t, E39.now)}>● now</text>
      </svg>
      <Texto x={3600} y={-300} t0={E39.try} texto="try something *with me*" size={54} color={N.oroClaro} />
    </>
  );
};
const Escena39: React.FC = () => <EscenaMundo tomas={tomas39}><TanChico /><MsgEspera /><VideoOlvido /><LikeExtrano /><Probemos /></EscenaMundo>;

export const SEGS_M10: Seg[] = [
  {
    hub: { portal: "coco", orbs: [
      { id: "dulce", t: T("put a sweet", 605), ang: 198, anillo: 1, tam: 160, D: DulceHub },
      { id: "soga", t: T("tied the coconut", 606), ang: 128, anillo: 2, tam: 160, D: Soga },
      { id: "coco", t: T("to a tree", 607.8), ang: -14, anillo: 0, tam: 240, D: CocoArbol },
    ] },
    Escena: Escena36,
    sonidos: (s) => { s.add("ola", E36.walked, 0.4); s.add("aparece", E36.came, 0.5); s.add("vuelo", 611.8, 0.5); s.add("sinapsis", E36.smelled, 0.5); s.add("tiron", E36.slipped + 0.2, 0.6); s.add("cierre", E36.grabbed + 0.1, 0.7); s.add("vuelo", 616.6, 0.5); s.add("golpe", E36.fist, 0.4); },
  },
  {
    hub: { portal: "atascado", orbs: [
      { id: "puno", t: T("a fist is", 618), ang: 198, anillo: 1, tam: 170, D: PunoHub },
      { id: "abierta", t: T("open hand", 619), ang: 128, anillo: 2, tam: 170, D: AbiertaHub },
      { id: "atascado", t: T("could not pull", 622), ang: -14, anillo: 0, tam: 240, D: Atascado },
    ] },
    Escena: Escena37,
    sonidos: (s) => { s.add("latido", E37.back, 0.5); s.add("latido", E37.slowly, 0.5); s.add("aviso", E37.screamed, 0.5); [0, 1, 2].forEach((i) => s.add("tiron", E37.pulled + i * 0.35, 0.5)); s.add("vuelo", 630.3, 0.5); s.add("luz", E37.free, 0.5); s.add("vuelo", 633.8, 0.5); s.add("aparece", E37.open + 0.3, 0.6); s.add("toque", E37.letgo + 0.5, 0.6); s.add("ola", E37.letgo + 0.6, 0.5); },
  },
  {
    hub: { portal: "punoB", orbs: [
      { id: "cad", t: T("Nothing was holding", 636), ang: 128, anillo: 2, tam: 170, D: Cadenas },
      { id: "mono", t: T("the monkey", 636), ang: 198, anillo: 1, tam: 150, D: MonoCara },
      { id: "punoB", t: T("own fist", 638), ang: -14, anillo: 0, tam: 240, D: PunoBrilla },
    ] },
    Escena: Escena38,
    sonidos: (s) => { s.add("rodillos", E38.train, 0.3); s.add("vuelo", 643.3, 0.5); s.add("vuelo", 644.8, 0.5); s.add("neonOn", E38.glowing, 0.5); s.add("vuelo", 649.3, 0.5); s.add("vidrio", E38.coconut + 0.2, 0.5); s.add("cierre", E38.hold, 0.5); },
  },
  {
    hub: { portal: "chispa", orbs: [
      { id: "sost", t: T("We hold it", 653), ang: 198, anillo: 1, tam: 160, D: ManoSostiene },
      { id: "celcoco", t: T("the sweet inside", 654.5), ang: 128, anillo: 2, tam: 160, D: CelCoco },
      { id: "chispa", t: T("little spark", 657), ang: -14, anillo: 0, tam: 230, D: Chispa },
    ] },
    Escena: Escena39,
    sonidos: (s) => { s.add("vacio", E39.small + 0.2, 0.5); s.add("vuelo", 660.2, 0.5); s.add("aviso", E39.message, 0.4); s.add("tic", E39.hour, 0.5); s.add("vuelo", 663.2, 0.5); s.add("ola", E39.forget + 0.2, 0.4); s.add("vuelo", 665.6, 0.5); s.add("like", E39.like + 0.2, 0.5); s.add("vuelo", 668.0, 0.5); s.add("aparece", E39.try, 0.5); },
  },
];
