import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Zzz } from "./kit";
import { Persona } from "./persona";
import { CamP, Llave, aPantalla, SUELO } from "./mundo";
import { GUARDIA, Jarra, Cuerno } from "./objetos";
import { TarjetaTrampa, Inserto, Yo } from "./comun";

// TRAMPA 6 · LA GUARDIA (660,9-749,5 s). 2 de la mañana en el adarve: en tiempos de paz, un condestable y un
// puñado de guardias cansados, con frío y un galón de cerveza encima. El enemigo lo sabía: Roxburgh 1314
// (Douglas y sus hombres con capas negras, en cuatro patas: «son vacas»… que ponen escaleras de soga) y
// Edimburgo (el acantilado, por el camino secreto del que bajaba a ver a la novia). Una vaca o un ejército.
export const T0 = 660.9, T1 = 749.5;
export const CAM: Llave[] = [
  [661.6, 2620, 1880, 1.0], [663.4, 2620, 1860, 1.35], [664.7, 2620, 1860, 1.35], [666.6, 2620, 1950, 0.9], [668.5, 2620, 1980, 1.0],
  [674.4, 2620, 1960, 1.05], [676.2, 2620, 1900, 1.15], [680.8, 2620, 1880, 1.25], [682.2, 2620, 1900, 1.1],
  [729.9, 2620, 1920, 1.05], [735.8, 2620, 1900, 1.15], [737.6, 2620, 2000, 0.9], [741.6, 2620, 1900, 1.25],
  [743.2, 1650, 3350, 0.8], [745.6, 1600, 3400, 0.85], [747.6, 1950, 2900, 0.6], [749.3, 2050, 2800, 0.6],
];
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ADARVE = 1945;
const DOUGLAS = { tunica: "#1a1a24", tunica2: "#0a0a12", cinto: "#5a5a6a", piel: "#e8b890", piel2: "#c99070", pelo: "#3a2a1a" };

// vaca plana (pantalla o mundo; x,y = patas)
const Vaca: React.FC<{ x: number; y: number; s?: number; t: number; flip?: boolean; negra?: boolean }> = ({ x, y, s = 1, t, flip, negra }) => (
  <svg style={{ position: "absolute", left: x - 160 * s, top: y - 200 * s, overflow: "visible" }} width={320 * s} height={200 * s} viewBox="-160 -200 320 200">
    <g transform={`scale(${flip ? -1 : 1} 1)`}>
      {[-80, -40, 50, 90].map((lx, i) => <rect key={i} x={lx} y={-70 + Math.sin(t * 4 + i) * 3} width={22} height={70} rx={8} fill={negra ? "#4a4060" : "#5a3a2a"} />)}
      <ellipse cx={0} cy={-100} rx={130} ry={60} fill={negra ? "#4a4060" : "#f3eee4"} />
      {!negra && <><ellipse cx={-40} cy={-110} rx={36} ry={24} fill="#3a2a2a" /><ellipse cx={50} cy={-90} rx={30} ry={20} fill="#3a2a2a" /></>}
      <g transform={`translate(130 -130) rotate(${Math.sin(t * 2) * 6})`}>
        <ellipse cx={20} cy={0} rx={44} ry={36} fill={negra ? "#4a4060" : "#f3eee4"} />
        <ellipse cx={46} cy={14} rx={22} ry={16} fill={negra ? "#4a4060" : "#e8a0a0"} />
        {!negra && <circle cx={22} cy={-8} r={7} fill="#1a1020" />}
        <path d="M 0 -30 L -16 -54 M 30 -32 L 40 -56" stroke={negra ? "#4a4060" : "#e8d4a8"} strokeWidth={10} strokeLinecap="round" />
      </g>
      <path d={`M -130 -110 Q -170 ${-60 + Math.sin(t * 3) * 14} -150 -20`} stroke={negra ? "#4a4060" : "#f3eee4"} strokeWidth={10} fill="none" />
    </g>
  </svg>
);
// hombre en cuatro patas con capa negra (pantalla)
const Gateador: React.FC<{ x: number; y: number; s?: number; t: number; i: number; destapa?: number }> = ({ x, y, s = 1, t, i, destapa = 0 }) => (
  <svg style={{ position: "absolute", left: x - 140 * s, top: y - 160 * s, overflow: "visible" }} width={280 * s} height={160 * s} viewBox="-140 -160 280 160">
    {[-90, -50, 60, 100].map((lx, k) => <rect key={k} x={lx + Math.sin(t * 6 + i + k * 1.6) * 10} y={-60} width={20} height={60} rx={8} fill="#121018" />)}
    <ellipse cx={0} cy={-90} rx={130} ry={56} fill="#121018" />
    <circle cx={120} cy={-110} r={34} fill={destapa > 0.5 ? "#e8b890" : "#121018"} />
    {destapa > 0.5 && <path d="M 86 -118 Q 120 -170 154 -118 Z" fill="#8a8a9a" />}
    {destapa > 0.5 && <path d="M -80 -130 L 60 -130" stroke="#c9c9d9" strokeWidth={10} opacity={0.8} />}
  </svg>
);

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  const desp = t > 663.9;
  return (
    <>
      {/* el adarve: el guardia que dormía + el condestable y dos más */}
      <Persona x={2620} y={ADARVE} h={330} t={t} seed={22} ropa={GUARDIA} casco="medieval" expr={!desp ? "dormido" : t < 666 ? "sorpresa" : t < 731 ? "triste" : t < 745.5 ? "miedo" : "miedo"}
        inclina={!desp ? 8 : t > 745.5 ? 14 : Math.sin(t * 1.2) * 4} bD={t > 737.4 && t < 739.2 ? 150 : 30} cD={t > 737.4 && t < 739.2 ? 30 : 10}
        manoD={t > 737.4 && t < 739.2 ? <g transform="translate(0 -20) scale(0.35)"><Cuerno x={0} y={0} /></g> : undefined} mira={t > 742 ? -0.6 : 0.2} miraY={t > 742 ? 0.6 : 0} />
      {t > 669 && <Persona x={2490} y={ADARVE} h={330} t={t} seed={23} ropa={{ ...GUARDIA, tunica: "#7a1a2a", tunica2: "#4a0a1a" }} casco="medieval" expr={t > 733.5 && t < 737 ? "feliz" : "orgullo"} aparece={671.9} bD={t > 733.5 && t < 737 ? 150 : 100} cD={t > 733.5 && t < 737 ? 120 : 20} miraY={t > 733.5 && t < 737 ? -0.6 : 0}
        manoD={t > 733.5 && t < 737 ? <g transform="translate(0 -10) scale(0.4)"><Jarra x={0} y={0} s={1} t={t} t0={733.5} nivel={0.5} /></g> : undefined} />}
      {t > 672.8 && [2735, 2805].map((x, i) => <Persona key={i} x={x} y={ADARVE} h={300} t={t} seed={24 + i} ropa={GUARDIA} casco="medieval" expr={i ? "dormido" : t > 739 ? "dormido" : t > 734.4 ? "sorpresa" : "triste"} habla={!i && t > 734.4 && t < 736} aparece={672.9 + i * 0.2} inclina={i ? 10 + Math.sin(t * 1.5) * 3 : t > 740.4 ? Math.min(28, (t - 740.4) * 40) : Math.sin(t * 2) * 5} flip />)}
      {t > 679.8 && t < 683 && <div style={{ position: "absolute", left: 0, top: 0 }}><Jarra x={2700} y={ADARVE - 20} s={0.5} t={t} t0={679.9} nivel={0.2} /></div>}
      {t > 682 && t < 735 && <div style={{ position: "absolute", left: 2780, top: 1560 }}><Zzz x={0} y={0} t={t} /></div>}
      {/* en el campo, del otro lado del foso: ¿vacas o un ejército? */}
      {t > 742.6 && [1300, 1520, 1720].map((x, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: 0.85 }}>
          {t < 746.8 || i !== 1 ? <Vaca x={interpolate(t, [742.6, 749.5], [x - 120, x + 60], cl)} y={SUELO - 10} s={0.9} t={t} negra /> : <Persona x={interpolate(t, [742.6, 749.5], [x - 120, x + 60], cl)} y={SUELO} h={330} t={t} seed={70} ropa={DOUGLAS} casco="medieval" expr="enojado" />}
        </div>
      ))}
    </>
  );
};

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const g = P(2620, ADARVE);
  return (
    <>
      <TarjetaTrampa t={t} t0={660.89} t1={663.0} n={6} nombre="THE WATCH" hora="2 AM" color={C.teal} />
      {t > 663.1 && t < 674.4 && <Yo t={t} t0={663.2} x={360} h={600} expr={t > 668 ? "miedo" : "neutro"} mira={0.6} habla={t > 664 && t < 666} bD={130} cD={140} tiembla={t > 668} />}
      {t >= 663.15 && t < 664.6 && <Grande t={t} t0={663.15} text="2 AM." y={180} size={150} color={C.crema} />}
      {t > 663.9 && t < 665.6 && <Emote t={t} t0={664.0} tipo="excl" {...cabeza(g.x, g.y, 330 * c.z)} />}
      <Chip t={t} t0={664.69} t1={668.5} text="THE NIGHT WATCH IS ON DUTY" color={C.teal} tinta={C.noche} x={960} y={140} centro size={56} />
      {t >= 667.41 && t < 668.6 && <Grande t={t} t0={667.41} text="FIRST SURPRISE:" y={940} size={100} color={C.oro} />}
      <Chip t={t} t0={668.63} t1={674.4} text="IN PEACETIME…" color={C.lima} tinta={C.noche} x={160} y={150} size={54} />
      <Chip t={t} t0={670.25} t1={674.4} text="A HUGE CASTLE HELD BY…" color={C.violeta} x={160} y={250} size={50} />
      {t > 671.9 && t < 674.4 && <Chip t={t} t0={671.95} text="A CONSTABLE" color="#7a1a2a" x={P(2490, ADARVE - 420).x} y={P(2490, ADARVE - 420).y} centro size={46} />}
      <Chip t={t} t0={672.87} t1={674.4} text="+ A HANDFUL OF GUARDS" color={C.rojo} x={960} y={950} centro size={54} />
      {/* no cientos de caballeros */}
      {t > 674.4 && t < 676.0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(14,8,40,${0.7 * prog(t, 674.4, 674.6)})` }} />
          {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: 0.55 * ent(t, 674.5 + i * 0.03) }}><Persona x={140 + i * 112} y={720} h={240} t={t} seed={200 + i} ropa={GUARDIA} casco="medieval" expr="orgullo" /></div>)}
          <Chip t={t} t0={674.49} text="NOT HUNDREDS OF KNIGHTS" color={C.rojo} x={960} y={160} centro size={64} />
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><line x1={100} y1={420} x2={100 + 1720 * prog(t, 674.75, 675.1)} y2={760} stroke={C.rojo} strokeWidth={30} strokeLinecap="round" /></svg>
        </>
      )}
      <Chip t={t} t0={676.09} t1={681.3} text="A FEW TIRED MEN" color={C.violeta} x={160} y={150} size={58} />
      {[["IN THE COLD", "#bfefff", 677.27], ["IN THE DARK", C.noche, 678.09], ["AT 2 AM", C.teal, 678.77], ["AFTER A GALLON OF ALE", C.ambar, 679.89]].map(([k, col, t0], i) => (
        <Chip key={i} t={t} t0={t0 as number} t1={681.3} text={k as string} color={col as string} tinta={i === 1 ? C.crema : C.noche} x={160} y={250 + i * 80} size={44} />
      ))}
      {t > 677.3 && t < 681.3 && <Emote t={t} t0={677.4} tipo="sudor" {...cabeza(g.x, g.y, 330 * c.z)} />}
      {t >= 681.33 && t < 682.4 && <Grande t={t} t0={681.33} text="AND THE ENEMY KNEW IT." y={940} size={96} color={C.rojo} />}
      {/* inserto: Roxburgh, 1314 */}
      <Inserto t={t} t0={682.35} t1={714.1} ix={g.x} iy={g.y} fondo="#2a2a6a" fondo2="#08061a">
        {(() => {
          const luna = <div style={{ position: "absolute", left: 1640, top: 110, width: 130, height: 130, borderRadius: "50%", background: "#f3eec8", boxShadow: "0 0 60px #f3eec8" }} />;
          const castillo = (fiesta: boolean) => (
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <path d="M 0 860 Q 600 820 1100 850 Q 1500 830 1920 860 L 1920 1080 L 0 1080 Z" fill="#1a3a2a" />
              <rect x={1180} y={420} width={620} height={450} fill="#4a4a5e" />
              {Array.from({ length: 8 }, (_, i) => <rect key={i} x={1180 + i * 80} y={385} width={50} height={40} fill="#4a4a5e" />)}
              <rect x={1260} y={300} width={140} height={570} fill="#55556a" />
              {fiesta && [1300, 1460, 1620, 1720].map((x, i) => <rect key={i} x={x} y={560} width={50} height={70} rx={20} fill="#ffb84a" opacity={0.7 + 0.3 * Math.sin(t * 6 + i)} />)}
              <rect x={1440} y={330} width={14} height={60} fill="#22222e" />
            </svg>
          );
          if (t < 694.1) return (
            <>
              {luna}{castillo(t > 690.0)}
              <div style={{ position: "absolute", left: 960, top: 120, transform: `translate(-50%,-50%) scale(${ent(t, 682.4)})`, fontFamily, fontWeight: 700, fontSize: 120, color: C.crema, WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill" }}>1314</div>
              <Chip t={t} t0={683.67} text="SCOTLAND 🏴 vs ENGLAND" color={C.violeta} x={110} y={240} size={50} />
              <Chip t={t} t0={686.11} text="ENGLISH-HELD: ROXBURGH CASTLE" color={C.rojo} x={110} y={330} size={46} />
              <Chip t={t} t0={688.43} text="ON THE SCOTTISH BORDER" color={C.teal} tinta={C.noche} x={110} y={410} size={42} />
              <Chip t={t} t0={689.81} text="THE NIGHT BEFORE LENT" color={C.oro} tinta={C.noche} x={110} y={510} size={50} />
              {t > 691.1 && ["🍗", "🍺", "🎶", "🍺"].map((k, i) => <div key={i} style={{ position: "absolute", left: 1300 + i * 120, top: 470 - Math.abs(Math.sin(t * 5 + i)) * 30, fontSize: 64, transform: `scale(${ent(t, 691.2 + i * 0.2)})` }}>{k}</div>)}
              <Chip t={t} t0={691.15} text="THE GARRISON IS PARTYING" color={C.lima} tinta={C.noche} x={1160} y={940} size={46} />
            </>
          );
          if (t < 710.7) {
            const cerca = interpolate(t, [694.1, 710.7], [0, 1], cl);
            return (
              <>
                {luna}{castillo(true)}
                {t < 702.9 && <Persona x={300} y={860} h={420} t={t} seed={70} ropa={DOUGLAS} expr="enojado" aparece={694.2} habla={t > 694.5 && t < 696} />}
                {t < 702.9 && <Chip t={t} t0={694.49} text="SIR JAMES DOUGLAS" color={C.noche} x={110} y={240} size={54} />}
                {Array.from({ length: 6 }, (_, i) => <Gateador key={i} x={480 + i * 130 + cerca * 300} y={880 + (i % 2) * 30} s={0.7} t={t} i={i} />)}
                {t < 702.9 && <Chip t={t} t0={697.41} text="BLACK CLOAKS OVER ARMOR" color={C.crema} tinta={C.noche} x={110} y={330} size={44} />}
                {t < 702.9 && <Chip t={t} t0={699.19} text="ON HANDS AND KNEES" color={C.ambar} tinta={C.noche} x={110} y={410} size={44} />}
                {t > 702.9 && (
                  <>
                    <Persona x={1340} y={420} h={170} t={t} seed={22} ropa={GUARDIA} casco="medieval" expr="neutro" mira={-1} miraY={0.6} aparece={703.0} />
                    <Chip t={t} t0={701.43} text="THE OLD CHRONICLE SAYS…" color={C.tierra} x={110} y={240} size={50} />
                    {t > 704.7 && <div style={{ position: "absolute", left: 1160, top: 120, width: 520, height: 230, borderRadius: 120, background: "#fff", border: `8px solid ${C.noche}`, transform: `scale(${ent(t, 704.8)})` }}>{t > 708.4 && [0, 1, 2].map((i) => <Vaca key={i} x={110 + i * 150} y={190} s={0.42} t={t} />)}</div>}
                    <Chip t={t} t0={705.39} text="DARK SHAPES IN THE FIELD" color={C.violeta} x={110} y={330} size={46} />
                    {t >= 708.47 && <><div style={{ position: "absolute", left: 960, top: 560, width: 1260, height: 160, transform: "translate(-50%,-50%)", borderRadius: 30, background: "rgba(14,8,40,.85)", opacity: ent(t, 708.47) }} /><Grande t={t} t0={708.47} text="«JUST A FARMER'S CATTLE»" y={560} size={84} color={C.crema} /></>}
                  </>
                )}
              </>
            );
          }
          // los «vacas» ponen escaleras de soga
          const sube = prog(t, 712.2, 713.6);
          return (
            <>
              {luna}{castillo(true)}
              <Chip t={t} t0={710.73} text="A FEW MINUTES LATER…" color={C.violeta} x={110} y={240} size={54} />
              {[1200, 1300, 1420].map((x, i) => <svg key={i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><g opacity={prog(t, 712.2 + i * 0.15, 712.6 + i * 0.15)}><line x1={x} y1={880} x2={x + 20} y2={400} stroke="#c9a36a" strokeWidth={8} /><line x1={x + 40} y1={880} x2={x + 60} y2={400} stroke="#c9a36a" strokeWidth={8} />{Array.from({ length: 10 }, (_, k) => <line key={k} x1={x + k * 2} y1={860 - k * 48} x2={x + 40 + k * 2} y2={860 - k * 48} stroke="#c9a36a" strokeWidth={6} />)}</g></svg>)}
              {Array.from({ length: 6 }, (_, i) => i < 3
                ? <Gateador key={i} x={1220 + i * 110} y={880 - sube * (200 + i * 60)} s={0.6} t={t} i={i} destapa={sube} />
                : <Gateador key={i} x={800 + i * 70} y={890} s={0.7} t={t} i={i} destapa={sube} />)}
              {t >= 711.93 && <Grande t={t} t0={711.93} text="THE «CATTLE» PUT UP ROPE LADDERS" y={960} size={74} color={C.oro} />}
            </>
          );
        })()}
      </Inserto>
      {/* inserto: Edimburgo, el acantilado */}
      <Inserto t={t} t0={714.1} t1={729.8} ix={960} iy={540} ox={g.x} oy={g.y} fondo="#2a3a7a" fondo2="#08061a">
        {(() => {
          const sendero = prog(t, 724.2, 725.8);
          return (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                <path d="M 560 1080 L 640 600 Q 700 420 860 360 L 1300 340 Q 1420 400 1460 600 L 1560 1080 Z" fill="#4a3a4a" />
                <path d="M 640 600 Q 700 420 860 360 L 900 380 Q 760 470 720 640 Z" fill="#5a4a5a" />
                <rect x={820} y={210} width={500} height={140} fill="#6a6a80" />
                {Array.from({ length: 7 }, (_, i) => <rect key={i} x={820 + i * 75} y={180} width={45} height={34} fill="#6a6a80" />)}
                {[100, 260, 1640, 1780].map((x, i) => <g key={i}><rect x={x} y={930} width={120} height={110} fill="#7a4a2a" /><path d={`M ${x - 10} 930 L ${x + 60} 870 L ${x + 130} 930 Z`} fill="#3a2a2a" /><rect x={x + 44} y={960} width={30} height={30} fill="#ffb84a" opacity={0.6 + 0.4 * Math.sin(t * 3 + i)} /></g>)}
                <path d="M 1450 1040 Q 1380 900 1420 800 Q 1360 700 1400 600 Q 1340 500 1320 380" stroke={C.oro} strokeWidth={18} strokeDasharray="26 18" strokeLinecap="round" fill="none" pathLength={100} strokeDashoffset={100 - 100 * sendero} />
              </svg>
              <div style={{ position: "absolute", left: 960, top: 100, transform: `translate(-50%,-50%) scale(${ent(t, 716.39)})`, fontFamily, fontWeight: 700, fontSize: 90, color: C.crema, WebkitTextStroke: `9px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>EDINBURGH CASTLE</div>
              <Chip t={t} t0={714.09} text="SAME YEAR, A FEW WEEKS LATER" color={C.violeta} x={110} y={200} size={44} />
              <Chip t={t} t0={718.27} text="AT NIGHT" color={C.noche} x={110} y={280} size={50} />
              <Chip t={t} t0={719.21} text="BY CLIMBING THE CLIFF" color={C.rojo} x={110} y={360} size={50} />
              {t > 719.2 && [0, 1, 2, 3].map((k) => <Persona key={k} x={1440 - (k % 2) * 60 + Math.sin(t * 5 + k) * 8} y={interpolate(t, [719.3 + k * 0.7, 729.0 + k * 0.7], [1010, 470], cl)} h={260} t={t} seed={71 + k} ropa={DOUGLAS} expr={t > 727.8 && k === 0 ? "feliz" : "enojado"} bI={155 + Math.sin(t * 9 + k) * 18} bD={155 - Math.sin(t * 9 + k) * 18} cI={10} cD={10} aparece={720.6 + k * 0.9} />)}
              <Chip t={t} t0={720.57} text="ONE MAN USED TO BE IN THE GARRISON" color={C.teal} tinta={C.noche} x={110} y={480} size={40} />
              {t >= 724.23 && t < 725.6 && <Grande t={t} t0={724.23} text="A SECRET PATH" y={540} size={90} color={C.oro} />}
              {t > 727.8 && <div style={{ position: "absolute", left: 1600, top: 760, fontSize: 110, transform: `scale(${ent(t, 728.17, 0, { damping: 6, stiffness: 240 }) * (1 + 0.08 * Math.sin(t * 10))})` }}>❤️</div>}
              <Chip t={t} t0={727.89} text="TO VISIT HIS GIRLFRIEND IN TOWN" color={C.rosa} x={960} y={930} centro size={48} />
            </>
          );
        })()}
      </Inserto>
      {/* los muros valen lo que los hombres que están arriba */}
      {t >= 729.79 && t < 732.7 && <Grande t={t} t0={729.79} text="WALLS ARE ONLY AS GOOD…" y={850} size={84} color={C.crema} />}
      <Chip t={t} t0={731.29} t1={732.7} text="…AS THE MEN ON THEM" color={C.rojo} x={960} y={985} centro size={56} />
      {[["COLD", "#bfefff", 733.63], ["BORED", C.violeta, 734.61], ["FULL OF ALE", C.ambar, 735.07]].map(([k, col, t0], i) => (
        <Chip key={i} t={t} t0={t0 as number} t1={736.3} text={k as string} color={col as string} tinta={i === 1 ? C.crema : C.noche} x={260 + i * 520} y={150} size={60} />
      ))}
      <Chip t={t} t0={736.35} t1={739.0} text="THAT'S WHY GUARDS HAD HORNS" color={C.oro} tinta={C.noche} x={960} y={150} centro size={54} />
      <Chip t={t} t0={738.29} t1={739.0} text="+ BELLS 🔔" color={C.teal} tinta={C.noche} x={960} y={250} centro size={54} />
      {t > 737.5 && t < 739.2 && [0, 1, 2].map((i) => { const u = ((t - 737.5) * 1.6 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: g.x + 60 * c.z - u * 40, top: g.y - 300 * c.z - u * 120, width: 120 + u * 260, height: 120 + u * 260, marginLeft: -(60 + u * 130), marginTop: -(60 + u * 130), borderRadius: "50%", border: `8px solid ${C.oro}`, opacity: 1 - u }} />; })}
      {t > 739.0 && t < 742.1 && (
        <>
          <div style={{ position: "absolute", left: P(2805, ADARVE - 420).x, top: P(2805, ADARVE - 420).y, transform: "translate(-50%,-50%)" }}><Zzz x={0} y={0} t={t} /></div>
          <Chip t={t} t0={739.35} text="A SLEEPING SENTRY = SERIOUS TROUBLE" color={C.rojo} x={960} y={150} centro size={52} />
        </>
      )}
      {/* vaca o ejército */}
      {t >= 743.03 && t < 745.2 && <Grande t={t} t0={742.65} text="2 AM: A COW…" y={170} size={100} color={C.crema} />}
      {t >= 745.2 && t < 746.8 && <Grande t={t} t0={745.25} text="…OR AN ENEMY ARMY?" y={170} size={100} color={C.rojo} />}
      <Chip t={t} t0={746.49} t1={749.4} text="ONE TIRED MAN SQUINTING INTO THE DARK" color={C.violeta} x={960} y={950} centro size={50} />
      {t > 746.8 && t < 749.4 && <Emote t={t} t0={746.85} tipo="susto" {...cabeza(P(1520, SUELO).x, P(1520, SUELO).y, 330 * c.z)} />}
    </>
  );
};
