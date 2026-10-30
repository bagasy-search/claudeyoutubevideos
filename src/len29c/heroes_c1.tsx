// len29c · componentes únicos 1-15 (0:39 → 9:34). Viven en el Stage (foto del momento desenfocada, piso con luz, haz, motas):
// entran con su transición, los elementos llegan de a uno con resorte, la cámara curva y la salida se funde hacia atrás.
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const HAIR = "#3b2f27", SCUM = "#b9b2a0", CHROME = "#d7dce0", TILE = "#e9ecee";
const rn = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const hairPath = (x: number, y: number, len: number, i: number, t = 0) => `M ${x} ${y} C ${x + 20 * Math.sin(i + t)} ${y + len * 0.33} ${x - 24 * Math.cos(i * 2 + t)} ${y + len * 0.66} ${x + 10 * Math.sin(i * 3)} ${y + len}`;

// ---- 0:39 · LA REGLA DE SEIS PULGADAS: una regla de carpintero baja junto al desagüe; el tapón vive en los primeros centímetros ----
export const HSixInch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r = phys(tt, 0.4, 6, 0.5), mark = eio(tt, 1.6, 2.6);
  return <>
    <Head tt={tt} kick="THE MOST COMMON CALL" title="IT'S CLOSER THAN YOU THINK" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={300} y={360} width={1320} height={40} fill={TILE} /><rect x={900} y={360} width={120} height={660} fill="#cfd3d6" /><rect x={916} y={360} width={88} height={660} fill="#17191b" />
      <ellipse cx={960} cy={360} rx={110} ry={16} fill={CHROME} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={hairPath(930 + i * 5, 380, 120 + 60 * rn(i), i, tt)} stroke={HAIR} strokeWidth={3} fill="none" opacity={cl(phys(tt, 1.0 + i * 0.05, 6, 0.6))} />)}
      <g transform={`translate(${1060 + (1 - r) * 500} 360)`} opacity={cl(r * 2)}><rect width={90} height={600} fill="#f0c94a" />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={0} y={i * 46} width={i % 2 ? 26 : 46} height={4} fill="#3a2d10" />)}</g>
      <rect x={1040} y={360} width={150} height={276 * mark} fill={RED} opacity={0.18} />
    </svg>
    <Tag tt={tt} at={2.4} x={1400} y={500} txt="WITHIN 6 INCHES" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 1:11 · MENOS QUE UN CAFÉ: un vaso de café en la balanza de un almacén; del otro lado las dos herramientas lo levantan ----
export const HCoffeeCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = phys(tt, 0.4, 6, 0.5), tools = phys(tt, 1.4, 6, 0.5), tilt = 9 * eio(tt, 1.9, 3.0);
  return <>
    <Head tt={tt} kick="THE TOOLS" title="CHEAPER THAN A COFFEE" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={940} y={560} width={40} height={360} fill="#6a5a44" /><path d="M 860 920 L 1060 920 L 1020 880 L 900 880 Z" fill="#4e4233" />
      <g transform={`rotate(${tilt} 960 560)`}><rect x={560} y={548} width={800} height={24} rx={10} fill="#8a7658" />
        <g transform={`translate(640 ${548 - (1 - c) * 500})`} opacity={cl(c * 2)}><path d="M -60 0 L 60 0 L 70 -170 L -70 -170 Z" fill="#f4efe4" /><rect x={-74} y={-190} width={148} height={24} rx={6} fill="#5a3d2a" /><rect x={-66} y={-110} width={132} height={40} fill="#8a4b2c" /></g>
        <g transform={`translate(1240 ${548 - (1 - tools) * 500})`} opacity={cl(tools * 2)}><rect x={-120} y={-30} width={240} height={14} fill="#f2f0ea" /><path d="M -120 -40 L 120 -40" stroke="#d9d4c9" strokeWidth={8} strokeDasharray="6 10" /><path d="M -60 -60 Q -20 -150 40 -60" stroke="#b7bcc1" strokeWidth={6} fill="none" /></g>
      </g>
    </svg>
    <Tag tt={tt} at={3.2} x={1240} y={360} txt="UNDER $5 · BOTH" col={ICE} size={38} />
  </>;
}}</Stage>;

// ---- 1:45 · EL PISO EN CAPAS: el piso de la ducha se abre como una torta; rejilla, cruz, caño y sifón bajan cada uno a su piso ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L: [string, string][] = [["THE GRATE", CHROME], ["THE CROSS", "#9aa1a7"], ["THE PIPE", "#e6e2d8"], ["THE TRAP", "#d6d1c4"]];
  return <>
    <Head tt={tt} kick="CUT THE FLOOR IN HALF" title="WHAT'S DOWN THERE" col={ICE} />
    {L.map(([n, c], i) => { const s = phys(tt, 0.5 + i * 0.7, 6, 0.45), y = 300 + i * 175;
      return <div key={n} style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) perspective(1200px) rotateX(58deg) translateY(${(1 - s) * -300}px)`, opacity: cl(s * 2) }}>
        <div style={{ width: 520, height: 520, borderRadius: i === 3 ? 60 : "50%", background: c, boxShadow: "0 40px 60px rgba(0,0,0,.55)", position: "relative" }}>
          {i === 0 && Array.from({ length: 40 }, (_, k) => <div key={k} style={{ position: "absolute", left: 60 + (k % 8) * 52, top: 120 + Math.floor(k / 8) * 56, width: 20, height: 20, borderRadius: "50%", background: "#3a3e42" }} />)}
          {i === 1 && <><div style={{ position: "absolute", left: 240, top: 30, width: 40, height: 460, background: "#5b6166" }} /><div style={{ position: "absolute", left: 30, top: 240, width: 460, height: 40, background: "#5b6166" }} /></>}
          {i === 2 && <div style={{ position: "absolute", inset: 110, borderRadius: "50%", background: "#141516" }} />}
        </div></div>; })}
    {L.map(([n], i) => <Tag key={n} tt={tt} at={0.9 + i * 0.7} x={1420} y={300 + i * 175} txt={n} col={i === 1 ? AMB : TX} size={32} />)}
  </>;
}}</Stage>;

// ---- 2:20 · EL TEJIDO: la cruz vista desde arriba; los pelos llegan de a uno, se enganchan, se enroscan y el jabón los pega ----
export const HWeave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const soap = eio(tt, 3.6, 5.4), n = Math.floor(eio(tt, 0.6, 3.6) * 40);
  return <>
    <Head tt={tt} kick="ONE HAIR AT FIRST" title="IT CATCHES ON THE CROSS" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <circle cx={960} cy={590} r={300} fill="#141516" /><circle cx={960} cy={590} r={300} fill="none" stroke={CHROME} strokeWidth={24} />
      <rect x={940} y={290} width={40} height={600} fill="#7d848a" /><rect x={660} y={570} width={600} height={40} fill="#7d848a" />
      {Array.from({ length: n }, (_, i) => { const a = rn(i) * Math.PI * 2, r = 60 + rn(i, 2) * 220, x = 960 + Math.cos(a) * r * 0.2, y = 590 + Math.sin(a) * r * 0.2;
        return <path key={i} d={`M ${960 + Math.cos(a) * r} ${590 + Math.sin(a) * r} Q ${x + 60 * Math.sin(i)} ${y + 40} ${960 + (rn(i, 3) - 0.5) * 80} ${590 + (rn(i, 4) - 0.5) * 80}`} stroke={HAIR} strokeWidth={3} fill="none" />; })}
      <circle cx={960} cy={590} r={120} fill={SCUM} opacity={0.55 * soap} />
    </svg>
    <Tag tt={tt} at={4.2} x={1460} y={420} txt="SOAP IS THE GLUE" col={ICE} size={36} />
  </>;
}}</Stage>;

// ---- 2:51 · LA SOGA QUE CRECE: vista de costado, la mata cuelga de la cruz y se alarga semana a semana hasta el sifón ----
export const HRopeGrow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const len = 60 + 520 * eio(tt, 0.6, 4.8), wk = Math.max(1, Math.round(eio(tt, 0.6, 4.8) * 52));
  return <>
    <Head tt={tt} kick="WEEK AFTER WEEK" title="UNTIL IT'S A ROPE" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={880} y={250} width={160} height={780} fill="#cfd3d6" /><rect x={896} y={250} width={128} height={780} fill="#141516" />
      <rect x={880} y={330} width={160} height={14} fill="#7d848a" />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={hairPath(930 + i * 3, 340, len * (0.7 + 0.3 * rn(i)), i, tt * 0.6)} stroke={i % 3 ? HAIR : SCUM} strokeWidth={4 + 3 * rn(i, 2)} fill="none" />)}
    </svg>
    <div style={{ position: "absolute", left: 1220, top: 520, fontFamily: MARK, fontSize: 96, color: AMB }}>WEEK {wk}</div>
    <Tag tt={tt} at={4.4} x={1380} y={700} txt="2, 3, 4 INCHES" col={TX} size={32} />
  </>;
}}</Stage>;

// ---- 3:25 · DEL TAMAÑO DE UN GATO: la mata sale del desagüe y al lado aparece la silueta de un gato del mismo tamaño ----
export const HCatSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pull = eio(tt, 0.4, 3.0), cat = phys(tt, 3.2, 6, 0.45);
  return <>
    <Head tt={tt} kick="LOGAN SQUARE · 1988" title="IT KEPT COMING" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={600} cy={880} rx={180} ry={30} fill={CHROME} />
      <g transform={`translate(600 ${880 - 420 * pull})`}>
        {Array.from({ length: 34 }, (_, i) => <path key={i} d={hairPath(-60 + i * 4, 0, 300 * pull + 40, i, tt)} stroke={i % 4 ? HAIR : SCUM} strokeWidth={5} fill="none" />)}
        <ellipse cx={0} cy={140 * pull} rx={120 * pull} ry={110 * pull} fill={HAIR} opacity={0.85} /></g>
      <g transform={`translate(1240 640) scale(${cl(cat)})`} opacity={cl(cat * 2) * 0.85}>
        <path d="M -150 120 Q -170 -40 -40 -60 L -60 -150 L 0 -90 L 60 -150 L 50 -60 Q 170 -40 150 120 Z" fill="none" stroke={TX} strokeWidth={8} strokeDasharray="18 12" />
        <path d="M 150 100 Q 260 60 230 -40" stroke={TX} strokeWidth={8} fill="none" strokeDasharray="18 12" /></g>
    </svg>
    <Tag tt={tt} at={3.6} x={1240} y={880} txt="A SMALL CAT" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 4:02 · EL PISTÓN: el sopapapo empuja como un émbolo; la soga se aprieta, se dobla y queda clavada en la curva del sifón ----
export const HPiston: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const push = eio(tt, 0.8, 3.6), sink = 380 * push;
  return <>
    <Head tt={tt} kick="WHY THE PLUNGER" title="IT PUSHES IT DOWN" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 860 250 L 860 720 Q 860 860 1000 860 Q 1140 860 1140 720 L 1140 600 L 1400 600" stroke="#cfd3d6" strokeWidth={130} fill="none" />
      <path d="M 860 250 L 860 720 Q 860 860 1000 860 Q 1140 860 1140 720 L 1140 600 L 1400 600" stroke="#141516" strokeWidth={104} fill="none" />
      <rect x={810} y={190 + 120 * push} width={100} height={24} rx={6} fill="#5a87b0" />
      <g transform={`translate(860 ${340 + sink})`}>{Array.from({ length: 18 }, (_, i) => <path key={i} d={`M ${-30 + i * 3} 0 q ${30 * Math.sin(i)} ${60 - 40 * push} 0 ${120 - 80 * push}`} stroke={HAIR} strokeWidth={5} fill="none" />)}
        <ellipse cx={0} cy={60 - 30 * push} rx={44} ry={30 + 30 * push} fill={HAIR} opacity={0.5 + 0.4 * push} /></g>
    </svg>
    <Tag tt={tt} at={3.2} x={1420} y={820} txt="PACKED IN THE BEND" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 4:30 · LA MANO Y LA DISTANCIA: una mano en la boca del desagüe; el tapón a 3 pulgadas, el sopapo lo manda a un pie ----
export const HHandReach: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const move = eio(tt, 2.0, 3.6), y = 400 + 120 + 360 * move;
  return <>
    <Head tt={tt} kick="YOU MOVED IT" title="3 INCHES → 1 FOOT" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={880} y={400} width={160} height={640} fill="#cfd3d6" /><rect x={896} y={400} width={128} height={640} fill="#141516" />
      <g opacity={cl(phys(tt, 0.4, 6, 0.6))}><path d="M 700 300 Q 760 250 840 300 L 900 380 L 870 400 L 800 340 Q 740 330 700 360 Z" fill="#d8a888" /></g>
      <ellipse cx={960} cy={y} rx={50} ry={40} fill={HAIR} />
      <line x1={1100} y1={400} x2={1100} y2={y} stroke={move > 0.5 ? RED : ICE} strokeWidth={6} />
      <path d={`M 1080 ${y - 2} l 20 20 l 20 -20`} stroke={move > 0.5 ? RED : ICE} strokeWidth={6} fill="none" />
    </svg>
    <Tag tt={tt} at={1.0} x={1300} y={520} txt="3 INCHES · EASY" col={ICE} size={34} />
    <Tag tt={tt} at={3.4} x={1300} y={880} txt="1 FOOT · PACKED" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 5:08 · TRES TAPAS: tres rejillas de verdad giran hacia cámara una tras otra: con tornillo, a presión, a rosca ----
export const HCovers3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const C: [string, React.ReactNode][] = [
    ["SCREWS", <g><circle r={140} fill={CHROME} />{Array.from({ length: 24 }, (_, k) => <circle key={k} cx={Math.cos(k / 24 * 6.28) * 100} cy={Math.sin(k / 24 * 6.28) * 100} r={9} fill="#3a3e42" />)}<circle r={18} fill="#8a9096" /><rect x={-14} y={-3} width={28} height={6} fill="#3a3e42" /></g>],
    ["SNAPS IN", <g><circle r={140} fill={CHROME} />{Array.from({ length: 6 }, (_, k) => <rect key={k} x={-110} y={-80 + k * 30} width={220} height={12} rx={6} fill="#3a3e42" />)}</g>],
    ["SCREWS IN", <g><circle r={140} fill={CHROME} /><circle r={100} fill="#202326" /><rect x={-100} y={-10} width={200} height={20} fill={CHROME} /><rect x={-10} y={-100} width={20} height={200} fill={CHROME} /></g>],
  ];
  return <>
    <Head tt={tt} kick="LOOK AT YOURS" title="THREE KINDS OF COVERS" col={ICE} />
    {C.map(([n, g], i) => { const s = phys(tt, 0.5 + i * 0.8, 6, 0.45);
      return <div key={n} style={{ position: "absolute", left: 480 + i * 480, top: 560, transform: `translate(-50%,-50%) rotateY(${(1 - s) * 90}deg) rotate(${30 * Math.sin(tt * 0.5 + i)}deg)`, opacity: cl(s * 2) }}>
        <svg width={320} height={320} viewBox="-160 -160 320 320" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>{g}</svg></div>; })}
    {C.map(([n], i) => <Tag key={n} tt={tt} at={0.9 + i * 0.8} x={480 + i * 480} y={810} txt={n} col={i === 2 ? AMB : TX} size={32} />)}
  </>;
}}</Stage>;

// ---- 6:10 · LA X DE PINZAS: dos pinzas se cruzan en la rejilla de la bañera y giran juntas contra reloj ----
export const HXPliers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p1 = phys(tt, 0.5, 6, 0.5), p2 = phys(tt, 1.0, 6, 0.5), rot = -120 * eio(tt, 2.0, 4.6);
  const Plier = (a: number, s: number) => <g transform={`rotate(${a}) translate(0 ${(1 - s) * -400})`} opacity={cl(s * 2)}>
    <rect x={-14} y={-260} width={28} height={200} rx={12} fill="#c2302a" /><rect x={-14} y={60} width={28} height={200} rx={12} fill="#c2302a" /><rect x={-20} y={-60} width={40} height={120} fill="#8d949a" /></g>;
  return <>
    <Head tt={tt} kick="THE OLD PLUMBER'S TRICK" title="TWO PLIERS IN AN X" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(960 600)"><circle r={200} fill={CHROME} /><circle r={160} fill="#202326" />
        <g transform={`rotate(${rot})`}><rect x={-160} y={-12} width={320} height={24} fill={CHROME} /><rect x={-12} y={-160} width={24} height={320} fill={CHROME} />{Plier(45, p1)}{Plier(-45, p2)}</g></g>
    </svg>
    <Tag tt={tt} at={2.6} x={1400} y={360} txt="COUNTERCLOCKWISE · GENTLE" col={ICE} size={32} />
  </>;
}}</Stage>;

// ---- 7:02 · LA ESPINA DE PESCADO: la tira plástica se dibuja como un esqueleto de pez; los dientes miran para arriba ----
export const HFishbone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const draw = eio(tt, 0.5, 2.8), down = eio(tt, 3.2, 4.4), up = eio(tt, 4.6, 5.6);
  return <>
    <Head tt={tt} kick="THE $3 TOOL" title="A PLASTIC DRAIN STRIP" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${380 + 80 * down - 40 * up} 560)`}>
        <rect x={0} y={-14} width={1160 * draw} height={28} rx={8} fill="#f4f2ec" />
        {Array.from({ length: 22 }, (_, i) => { const x = 40 + i * 50; if (x > 1160 * draw) return null;
          return <g key={i}><path d={`M ${x} -14 l -26 -44`} stroke="#f4f2ec" strokeWidth={10} strokeLinecap="round" /><path d={`M ${x} 14 l -26 44`} stroke="#f4f2ec" strokeWidth={10} strokeLinecap="round" /></g>; })}
      </g>
      <path d={`M 1700 ${470 + 40 * Math.sin(tt * 2)} l -60 0 m 60 0 l -24 -24 m 24 24 l -24 24`} stroke={ICE} strokeWidth={8} fill="none" opacity={eio(tt, 3.0, 3.4) * (1 - up)} />
    </svg>
    <Tag tt={tt} at={2.6} x={960} y={720} txt="TEETH POINT UP" col={ICE} size={38} />
    <Tag tt={tt} at={4.8} x={960} y={360} txt="SLIDES DOWN · GRABS UP" col={TX} size={32} />
  </>;
}}</Stage>;

// ---- 7:20 · GIRAR Y SUBIR: la tira gira dentro del caño (las vueltas se cuentan con flechas curvas) y sube lenta ----
export const HTwistPull: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const tw = eio(tt, 0.6, 3.0), up = eio(tt, 3.4, 5.6), spin = Math.sin(tt * 6) * 30 * (1 - up);
  return <>
    <Head tt={tt} kick="DON'T YANK IT" title="TWIST · THEN PULL SLOW" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect x={880} y={420} width={160} height={620} fill="#cfd3d6" /><rect x={896} y={420} width={128} height={620} fill="#141516" />
      <g transform={`translate(960 ${-300 * up}) rotate(${spin} 0 700)`}>
        <rect x={-8} y={180} width={16} height={760} fill="#f4f2ec" />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={hairPath(-30 + (i % 10) * 6, 700 + Math.floor(i / 10) * 40, 140, i, tt * 3 * (1 - up))} stroke={HAIR} strokeWidth={4} fill="none" opacity={tw} />)}
      </g>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${760 - i * 20} ${560 + i * 70} A 200 50 0 0 0 ${1160 + i * 20} ${560 + i * 70}`} stroke={ICE} strokeWidth={6} fill="none" opacity={cl(tw * 3 - i) * (1 - up)} />)}
    </svg>
    <Tag tt={tt} at={3.8} x={1360} y={300} txt="SLOW AND STEADY" col={ICE} size={34} />
  </>;
}}</Stage>;

// ---- 7:54 · CUATRO TIRONES: cuatro tiras salen una al lado de la otra; la primera trae la mata grande, la cuarta sale limpia ----
export const HFourPulls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Head tt={tt} kick="EVERYBODY STOPS AT ONE" title="I ALWAYS SAY FOUR" col={AMB} />
  {[1, 0.55, 0.25, 0].map((amt, i) => { const s = phys(tt, 0.5 + i * 0.9, 6, 0.45), x = 480 + i * 320;
    return <div key={i} style={{ position: "absolute", left: x, top: 260, transform: `translateY(${(1 - s) * 400}px)`, opacity: cl(s * 2) }}>
      <svg width={200} height={640} viewBox="-100 0 200 640"><rect x={-8} y={0} width={16} height={600} fill="#f4f2ec" />
        {Array.from({ length: Math.round(26 * amt) }, (_, k) => <path key={k} d={hairPath(-40 + (k % 9) * 10, 360 + Math.floor(k / 9) * 50, 160 * amt + 40, k)} stroke={HAIR} strokeWidth={4} fill="none" />)}</svg>
      <div style={{ textAlign: "center", fontFamily: MARK, fontSize: 70, color: i === 3 ? ICE : AMB }}>{i + 1}</div></div>; })}
  <Tag tt={tt} at={4.0} x={1440} y={200} txt="COMES UP CLEAN" col={ICE} size={32} />
</>}</Stage>;

// ---- 8:40 · VEINTE DE UNA: la tira que el creído no quería se multiplica en abanico, veinte de golpe sobre el mostrador ----
export const HTwentyStrips: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.floor(eio(tt, 0.6, 3.6) * 20);
  return <>
    <Head tt={tt} kick="NORTH SIDE · 2003" title="I WENT BACK FOR TWENTY" col={AMB} />
    <div style={{ position: "absolute", left: 260, right: 260, top: 830, height: 30, background: "linear-gradient(180deg,#8a6b45,#5e4528)", borderRadius: 6 }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: n + 1 }, (_, i) => { const a = -60 + (i / 20) * 120; return <g key={i} transform={`translate(960 830) rotate(${a})`}>
        <rect x={-6} y={-520} width={12} height={520} fill="#f4f2ec" stroke="rgba(0,0,0,.15)" />{Array.from({ length: 10 }, (_, k) => <path key={k} d={`M 6 ${-80 - k * 44} l 14 -20`} stroke="#f4f2ec" strokeWidth={5} />)}</g>; })}
    </svg>
    <div style={{ position: "absolute", left: 1500, top: 420, fontFamily: MARK, fontSize: 120, color: TX }}>{n}</div>
  </>;
}}</Stage>;

// ---- 9:21 · EL CALIBRE DEL GANCHO: un gancho grande empuja el pelo para abajo; uno de un cuarto de pulgada lo engancha ----
export const HHookGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = eio(tt, 0.8, 2.6), b = eio(tt, 2.8, 4.6);
  const Pipe = (x: number) => <g><rect x={x - 80} y={400} width={160} height={600} fill="#cfd3d6" /><rect x={x - 64} y={400} width={128} height={600} fill="#141516" /></g>;
  return <>
    <Head tt={tt} kick="BEND A COAT HANGER" title="A TINY HOOK" col={AMB} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Pipe(620)}{Pipe(1300)}
      <path d={`M 620 ${180 + 360 * a} L 620 ${480 + 360 * a} q 0 60 -50 60 q -50 0 -50 -50`} stroke="#b7bcc1" strokeWidth={8} fill="none" />
      <ellipse cx={620} cy={620 + 240 * a} rx={50} ry={34} fill={HAIR} />
      <path d={`M 1300 ${180 + 300 * b - 220 * eio(tt, 4.8, 5.8)} L 1300 ${480 + 300 * b - 220 * eio(tt, 4.8, 5.8)} q 0 16 -14 16 q -12 0 -12 -12`} stroke="#b7bcc1" strokeWidth={8} fill="none" />
      <ellipse cx={1300} cy={820 - 220 * eio(tt, 4.8, 5.8)} rx={50} ry={34} fill={HAIR} />
    </svg>
    <Tag tt={tt} at={2.4} x={620} y={340} txt="BIG: PUSHES IT" col={RED} size={32} />
    <Tag tt={tt} at={4.4} x={1300} y={340} txt="¼ INCH: CATCHES" col={ICE} size={32} />
  </>;
}}</Stage>;
