import React from "react";
import { interpolate } from "remotion";
import { C, prog, Chip, Grande, Emote, cabeza } from "./kit";
import { Persona } from "./persona";
import { CamP, Llave, aPantalla, SUELO } from "./mundo";
import { CHICO, GUARDIA, Rata, Jarra, Trinchero, Campanita, Globo } from "./objetos";
import { Marcador, Rastrillo, Confeti, Ficha, Yo } from "./comun";

// GANCHO 0-55,2 s. Plan de director (un cambio cada ~0,7-1 s, todo dentro del mismo castillo):
// 0-5   bandera en la torre en primerísimo plano → dolly hacia atrás: el castillo entero al atardecer, nieve, DECEMBER 1300
// 5-10  el sol se hunde en timelapse, cae la noche, estrellas: «16 HOURS» de oscuridad
// 10.6  rebobina a las 15:45 → el chico (vos) llega por el camino al puente: YOU · 14 · NEW JOB · NIGHT #1
// 17-26 confeti; muro (más grueso que vos), rastrillo que cae, foso, guardias en el adarve
// 27-36 gira por los cuartos: FREEZE / STARVE / POISON / BITE / BURN / … y te caés por la letrina
// 36-44 conducto de la letrina: un soldado SUBE por el caño y asoma la cabeza por el asiento → loop abierto
// 45-55 el castillo entero con la ruta de la noche y los 7 pines; la campana suena; entramos al salón
export const T0 = 0, T1 = 55.2;
export const CAM: Llave[] = [
  [0, 5930, 380, 2.4], [2.9, 5930, 380, 2.3], [4.0, 5800, 600, 1.1], [5.6, 4300, 2500, 0.34], [9.8, 4000, 2600, 0.4], [10.8, 3900, 2650, 0.4],
  [12.0, 1950, 3420, 0.95], [16.6, 2250, 3420, 1.0], [18.6, 3000, 2900, 0.6], [21.1, 3150, 2850, 0.63],
  [21.6, 2560, 3320, 0.95], [23.2, 2600, 3330, 0.95], [24.1, 2400, 3600, 0.9], [25.0, 2400, 3600, 0.9], [25.5, 2620, 1960, 1.05], [26.7, 2620, 1960, 1.0],
  [28.4, 6000, 2300, 0.6], [30.4, 5850, 2350, 0.66],
  [30.9, 5000, 2560, 0.95], [31.6, 5000, 2560, 0.95], [32.0, 5400, 2700, 1.1], [32.4, 5400, 2700, 1.1], [32.9, 6250, 2720, 1.2], [33.2, 6250, 2720, 1.2],
  [33.6, 5900, 3420, 0.9], [33.9, 5900, 3420, 0.9], [34.3, 5800, 2650, 0.95], [34.6, 5800, 2650, 0.95], [35.0, 7450, 2400, 1.05], [36.1, 7450, 2600, 0.9],
  [37.2, 7470, 3350, 1.6], [39.6, 7460, 2900, 1.7], [40.4, 7450, 2380, 1.7], [43.6, 7450, 2400, 1.5],
  [46.0, 5300, 2150, 0.32], [51.0, 5300, 2250, 0.355], [52.5, 5300, 2250, 0.355], [53.2, 6900, 760, 0.9], [53.8, 6900, 780, 0.95], [55.2, 4560, 2700, 0.85],
];

// la ruta de la noche (de pin en pin) y los 7 pines
const HOP = 0.72; // s por salto de la bolita
export const PINES: [number, number, number][] = [[6100, 2800, 1], [6700, 1600, 2], [5150, 2420, 3], [7450, 2440, 4], [6300, 3460, 5], [5100, 760, 6], [5800, 2950, 7]];

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t > T1 + 1) return null;
  const bx = interpolate(t, [11.0, 16.4], [1500, 2330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = t > 11 && t < 16.4 ? 1.6 : 0;
  return (
    <>
      {/* el chico llega por el camino y cruza el puente */}
      {t > 10.6 && t < 26 && (
        <Persona x={bx} y={SUELO - 26} h={300} t={t} seed={7} ropa={CHICO} expr={t < 17.5 ? "feliz" : "sorpresa"} camina={cam} salta={17.5}
          bD={t > 17.5 && t < 19 ? 150 : t > 13.3 && t < 15 ? 40 : 8} cD={t > 13.3 && t < 15 ? 70 : 10} mira={t > 21 ? -1 : 0.5}
          manoD={t > 13.3 && t < 15 ? <g transform="translate(0 30)"><rect x={-40} y={-10} width={80} height={60} rx={14} fill="#c9a36a" stroke="#7a4520" strokeWidth={6} /></g> : undefined} />
      )}
      {/* muro más grueso que vos: regla de medida */}
      {t > 21.2 && t < 24.4 && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
          <g opacity={prog(t, 21.2, 21.5)}>
            <line x1={2350} y1={3150} x2={2350 + 540 * prog(t, 21.3, 21.9)} y2={3150} stroke={C.oro} strokeWidth={18} />
            <path d="M 2350 3110 L 2350 3190" stroke={C.oro} strokeWidth={14} />
            {prog(t, 21.3, 21.9) >= 1 && <path d="M 2890 3110 L 2890 3190" stroke={C.oro} strokeWidth={14} />}
          </g>
        </svg>
      )}
      <Rastrillo t={t} tc={23.45} />
      {/* salpicón en el foso */}
      {t > 24.2 && t < 25.4 && Array.from({ length: 10 }, (_, i) => {
        const u = t - 24.2, a = -Math.PI / 2 + (i - 4.5) * 0.22;
        return <div key={i} style={{ position: "absolute", left: 2150 + Math.cos(a) * 500 * u, top: SUELO + 10 + Math.sin(a) * 600 * u + 900 * u * u, width: 26, height: 26, borderRadius: 13, background: "#9aaa5a" }} />;
      })}
      {/* guardias en el adarve */}
      {t > 24.9 && t < 30 && [0, 1].map((i) => (
        <Persona key={i} x={2470 + i * 300} y={1945} h={330} t={t} seed={20 + i} ropa={GUARDIA} casco="medieval" aparece={25.14 + i * 0.25} flip={i === 1} expr={i ? "enojado" : "orgullo"}
          bD={30} cD={60} manoD={<g transform="rotate(170)"><line x1={0} y1={-40} x2={0} y2={300} stroke="#6b3a1f" strokeWidth={12} /><path d="M -14 300 L 0 350 L 14 300 Z" fill="#c8ccd4" /></g>} />
      ))}
      {/* montaje: cada verbo en su cuarto */}
      {t > 30.4 && t < 32 && <Persona x={5000} y={2965} h={330} t={t} seed={7} ropa={{ ...CHICO, piel: "#a8d8f0", piel2: "#7ab8d8" }} expr="miedo" bI={30} bD={30} cI={120} cD={120} />}
      {t > 30.4 && t < 32 && <Emote t={t} t0={30.75} tipo="susto" {...cabeza(5000, 2965, 330)} />}
      {t > 31.5 && t < 33 && <Trinchero x={5400} y={2800} s={1.1} t={t} t0={31.78} duro />}
      {t > 32.3 && t < 33.6 && <Jarra x={6250} y={2730} s={1.1} t={t} t0={32.6} />}
      {t > 32.6 && t < 33.6 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 6230 + i * 30 - 30, top: 2600 - ((t * 1.5 + i / 3) % 1) * 160, width: 30, height: 30, borderRadius: 15, background: C.lima, opacity: 0.8 }} />)}
      {t > 33.3 && t < 34.4 && <Rata x={5900 + (t - 33.34) * 400} y={3560 - Math.abs(Math.sin((t - 33.34) * 6)) * 120} s={1.6} t={t} t0={33.34} />}
      {t > 34.8 && t < 36.3 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${t > 35.3 ? ((t - 35.3) * 1.8) ** 2 * 300 : 0}px)` }}>
          <Persona x={7450} y={2470} h={300} t={t} seed={7} ropa={CHICO} expr="miedo" bI={160} bD={160} />
        </div>
      )}
      {/* el soldado que SUBE por el conducto y asoma por el asiento */}
      {t > 36.3 && t < 40.2 && (
        <Persona x={7450} y={interpolate(t, [36.5, 40.1], [3700, 2900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} h={260} t={t} seed={31} ropa={GUARDIA} casco="medieval" bI={170} bD={170} cI={10} cD={10} expr="enojado" />
      )}
      {t > 40.4 && t < 44.2 && (
        <div style={{ position: "absolute", left: 7370, top: 2240, width: 160, height: 210, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 80, top: 0, transform: `translateY(${t < 40.7 ? (40.7 - t) * 600 : t > 43.6 ? (t - 43.6) * 500 : 0}px)` }}>
            <Persona x={0} y={420} h={260} t={t} seed={31} ropa={GUARDIA} casco="medieval" expr="feliz" mira={-0.6} />
          </div>
        </div>
      )}
      {t > 40.4 && t < 44.2 && <Globo t={t} t0={40.9} x={7560} y={2230} text="HELLO!" s={0.7} />}
      {/* la ruta de la noche + 7 pines */}
      {/* una bolita dorada (vos) salta de pin en pin: cada trampa brota cuando cae (antes: curva que se cruzaba = garabato) */}
      {t > 47.3 && t < 47.3 + 6 * HOP + 0.3 && (() => {
        const k = Math.min(5, Math.floor((t - 47.3) / HOP)), u = Math.min(1, (t - 47.3 - k * HOP) / HOP);
        const [ax, ay] = PINES[k], [bx2, by2] = PINES[k + 1];
        const x = ax + (bx2 - ax) * u, y = ay - 60 + (by2 - ay) * u - Math.sin(Math.PI * u) * 700 - 260;
        return <div style={{ position: "absolute", left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 70, background: C.oro, border: "16px solid #fff", boxShadow: "0 14px 0 rgba(14,8,40,.4)" }} />;
      })()}
      {t > 45 && t < 54 && PINES.map(([x, y, n], i) => <Marcador key={n} t={t} t0={47.3 + i * 0.72} t1={52.45} x={x} y={y - 60} n={n} s={2.6} />)}
      {/* campana de la torre */}
      <Campanita x={6900} y={560} s={1.6} t={t} tb={[52.76, 53.1, 53.5]} />
    </>
  );
};

const ICONOS: Record<string, React.ReactNode> = {
  FREEZE: <g><path d="M 0 -80 L 0 80 M -70 -40 L 70 40 M -70 40 L 70 -40" stroke="#7fd6ff" strokeWidth={18} strokeLinecap="round" />{[0, 60, 120, 180, 240, 300].map((a) => <path key={a} transform={`rotate(${a})`} d="M -20 -60 L 0 -40 L 20 -60" stroke="#7fd6ff" strokeWidth={12} fill="none" strokeLinecap="round" />)}</g>,
  STARVE: <g><ellipse cx={0} cy={20} rx={90} ry={34} fill="#c9a36a" /><ellipse cx={0} cy={12} rx={70} ry={20} fill="#7a4520" /><path d="M -20 -60 Q 0 -90 20 -60" stroke="#a89a8a" strokeWidth={8} fill="none" /></g>,
  POISON: <g><rect x={-50} y={-50} width={100} height={130} rx={14} fill="#a8622c" /><rect x={-50} y={-20} width={100} height={100} fill={C.lima} />{[-20, 15].map((x) => <circle key={x} cx={x} cy={-70} r={16} fill={C.lima} />)}<path d="M -20 20 L 20 50 M 20 20 L -20 50" stroke="#2a1530" strokeWidth={10} /></g>,
  BITE: <g><path d="M -80 -10 Q 0 -90 80 -10 Q 0 20 -80 -10 Z" fill="#fff" stroke="#2a1530" strokeWidth={8} />{[-50, -20, 10, 40].map((x) => <path key={x} d={`M ${x} -14 l 14 30 l 14 -30`} fill="#fff" stroke="#2a1530" strokeWidth={6} />)}</g>,
  BURN: <g><path d="M 0 -90 Q 60 -20 40 50 Q 0 80 -40 50 Q -60 -20 0 -90 Z" fill="#ff7a3d" /><path d="M 0 -30 Q 26 10 16 50 Q 0 60 -16 50 Q -26 10 0 -30 Z" fill="#ffe08a" /></g>,
  FLUSH: <g><rect x={-80} y={-20} width={160} height={40} rx={10} fill="#a8622c" /><ellipse cx={0} cy={-20} rx={44} ry={12} fill="#2a1530" /><path d="M 0 30 L 0 90 M -24 66 L 0 92 L 24 66" stroke={C.rojo} strokeWidth={14} fill="none" strokeLinecap="round" /></g>,
};

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t > T1 + 0.5) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const anio = Math.round(interpolate(t, [2.0, 2.9], [1000, 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const horas = Math.round(interpolate(t, [9.7, 10.4], [1, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const chico = P(interpolate(t, [11.0, 16.4], [1500, 2330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), SUELO - 330);
  const vb = [30.74, 31.76, 32.66, 33.34, 34.1, 34.74];
  return (
    <>
      {/* 0-5: DECEMBER 1300 */}
      <Chip t={t} t0={0.3} t1={5.2} text="FIRST WEEK OF" color={C.violeta} x={120} y={150} size={50} />
      <Chip t={t} t0={1.12} t1={5.2} text="DECEMBER" color={C.teal} tinta={C.noche} x={120} y={250} size={84} />
      {t >= 2.0 && t < 5.3 && <Grande t={t} t0={2.0} text={`${anio}`} x={1500} y={240} size={230} color={C.oro} />}
      <Chip t={t} t0={4.2} t1={5.3} text="NORTH OF ENGLAND" color={C.rojo} x={960} y={960} centro size={60} />
      {/* 5-10: el sol se va 16 horas */}
      <Chip t={t} t0={6.4} t1={9.5} text="SUNSET: 3:45 PM" color={C.naranja} x={960} y={150} centro size={70} />
      {t >= 9.6 && t < 10.75 && <div style={{ position: "absolute", inset: 0, background: "rgba(14,8,40,.6)", opacity: prog(t, 9.6, 9.8) }} />}
      {t > 9.6 && t < 10.8 && <Yo t={t} t0={9.65} x={1770} h={600} expr="sorpresa" bD={140} cD={130} bI={140} cI={130} />}
      {t >= 9.7 && t < 10.75 && <Grande t={t} t0={9.7} text={`${horas} HOURS`} x={800} y={480} size={240} color={C.crema} />}
      {t >= 10.14 && t < 10.75 && <Grande t={t} t0={10.14} text="OF DARKNESS" y={700} size={120} color={C.lila} />}
      {t > 10.7 && t < 11.6 && <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 4px, transparent 4px 9px)` }} />}
      <Chip t={t} t0={10.72} t1={11.6} text="◀◀ BACK TO 3:45 PM" color={C.noche} x={960} y={130} centro size={56} />
      {/* 11-17: vos */}
      {t > 11.4 && t < 17.3 && (
        <>
          <Chip t={t} t0={11.46} t1={17.2} text="YOU · 14" color={C.lima} tinta={C.noche} x={chico.x} y={chico.y - 110} centro size={64} />
          <svg style={{ position: "absolute", left: chico.x - 30, top: chico.y - 70, transform: `translateY(${Math.sin(t * 8) * 10}px)` }} width={60} height={60}><path d="M 0 0 L 60 0 L 30 50 Z" fill={C.lima} stroke="#fff" strokeWidth={6} /></svg>
        </>
      )}
      <Chip t={t} t0={13.44} t1={17.2} text="NEW JOB: CASTLE" color={C.violeta} x={120} y={160} size={60} />
      <Chip t={t} t0={15.5} t1={17.2} text="NIGHT #1" color={C.rojo} x={120} y={270} size={70} />
      {/* 17-26: felicitaciones y defensas */}
      <Confeti t={t} t0={17.48} />
      {t >= 17.5 && t < 21.1 && <Grande t={t} t0={17.5} text="CONGRATULATIONS!" y={200} size={130} color={C.oro} />}
      {t > 17.5 && t < 21.1 && <Yo t={t} t0={17.6} x={1690} h={720} expr="feliz" habla bD={150} cD={20} manoD={<g transform="rotate(-30)"><circle cx={0} cy={-70} r={34} fill="none" stroke="#f2c14e" strokeWidth={16} /><rect x={-8} y={-40} width={16} height={110} fill="#f2c14e" /><rect x={8} y={40} width={30} height={14} fill="#f2c14e" /><rect x={8} y={60} width={22} height={12} fill="#f2c14e" /></g>} />}
      <Chip t={t} t0={19.16} t1={21.1} text="STRONGEST BUILDING IN THE COUNTY" color={C.teal} tinta={C.noche} x={960} y={900} centro size={58} />
      <Chip t={t} t0={21.84} t1={23.3} text="THICKER THAN YOU ARE TALL" color={C.oro} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={23.52} t1={24.1} text="A GATE" color={C.rojo} x={960} y={140} centro size={70} />
      <Chip t={t} t0={24.34} t1={25.0} text="A DITCH" color={C.teal} tinta={C.noche} x={960} y={140} centro size={70} />
      <Chip t={t} t0={25.3} t1={26.7} text="ARMED MEN" color={C.violeta} x={960} y={140} centro size={70} />
      {/* 27-36: y aun así… */}
      {t > 28.0 && t < 30.7 && <Yo t={t} t0={28.1} x={1660} h={700} expr="miedo" tiembla bD={140} cD={120} bI={140} cI={120} />}
      {t >= 28.0 && t < 30.6 && <Grande t={t} t0={28.0} text="BY SUNRISE…" y={200} size={130} color={C.crema} />}
      {vb.map((tv, i) => {
        const k = ["FREEZE", "STARVE", "POISON", "BITE", "BURN", "FLUSH"][i];
        return t < 36.4 ? <Ficha key={k} t={t} t0={tv} x={260 + i * 280} y={880} label={k} color={[C.teal, C.ambar, C.lima, C.rosa, C.naranja, C.violeta][i]} icono={ICONOS[k]} /> : null;
      })}
      {/* 36-44: tomado por la letrina */}
      <Chip t={t} t0={37.0} t1={40.2} text="ONE OF THE MOST FAMOUS CASTLES IN EUROPE" color={C.violeta} x={960} y={130} centro size={50} />
      <Chip t={t} t0={38.52} t1={40.2} text="CAPTURED" color={C.rojo} x={960} y={950} centro size={96} />
      {t >= 40.32 && t < 44.3 && <Grande t={t} t0={40.32} text="THROUGH ITS TOILET" y={930} size={130} color={C.oro} />}
      <Chip t={t} t0={42.28} t1={44.4} text="EXACTLY HOW? END OF THE VIDEO" color={C.noche} x={960} y={130} centro size={54} />
      {/* 45-55: el mapa de la noche */}
      <Chip t={t} t0={45.0} t1={52.4} text="YOUR FIRST NIGHT" color={C.violeta} x={960} y={110} centro size={64} />
      <Chip t={t} t0={47.32} t1={52.4} text="HOUR BY HOUR" color={C.teal} tinta={C.noche} x={960} y={210} centro size={56} />
      {t >= 50.6 && t < 52.4 && <Chip t={t} t0={50.64} t1={52.4} text="WAYS IT KILLS YOU" color={C.rojo} x={960} y={970} centro size={60} />}
      {t >= 51.66 && t < 52.5 && <Grande t={t} t0={51.66} text="7" x={1720} y={900} size={260} color={C.oro} />}
      <Chip t={t} t0={53.82} t1={55.1} text="LET'S GO INSIDE" color={C.oro} tinta={C.noche} x={960} y={950} centro size={64} />
    </>
  );
};
