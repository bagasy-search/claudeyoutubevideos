import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Emote, Particulas, Tienda, Estrellas, cabeza, fontFamily } from "./kit";
import { Persona, CIVIL, Ropa } from "./persona";
import { SUELO, Llave, G, interp, TextoMundo, Diario, Bolsa } from "./mundo";
import { Franz, Gente, Sello, Titulo, BurbujaM, Cuenta, Barras, HUD, vig } from "./actores";

// P8 · El giro + cierre (729,2-915,2 s). Sueldo de profesional (bolsa, leña, casa, sin impuestos) → el secreto: sabe
// cómo está armado el cuerpo mejor que el doctor del libro viejo → el médico secreto: de noche, el mercader que esa
// mañana se tiró al barro para no rozarte la manga golpea tu puerta con la muñeca hinchada → 15.000 pacientes vs ~400
// → los médicos protestan, los pacientes siguen viniendo → peticiones → 1624: el emperador le devuelve el honor (el
// primer apretón de manos: HANDSHAKES 1) → enterrado entre los honorables → recap → hilos de oro de su casa a todo el
// pueblo → CTA: el campamento vikingo dormido.
const CASA = 6620, ATRAS = 7120, PLAZA = 4800, CEM = 13100, VIK = 40000;
const MERCADER: Ropa = { tunica: "#2a6a8a", tunica2: "#18485e", cinto: C.oro, piel: "#f0c09a", piel2: "#d09a76", pelo: "#5a3a20" };
const DOCTOR: Ropa = { tunica: "#1b1530", tunica2: "#0e0a1e", cinto: "#5a4a8a", piel: "#f0c8a8", piel2: "#d0a888", pelo: "#bdb6ae" };
const NOBLE: Ropa = { tunica: "#2b2140", tunica2: "#1b1530", cinto: C.oro, piel: "#e9b08a", piel2: "#c98f6a", pelo: "#d8d2cc" };
const EMPERADOR: Ropa = { tunica: "#a3202f", tunica2: "#6e1420", cinto: C.oro, piel: "#f0c09a", piel2: "#d09a76", pelo: "#8a6a4a" };
const VIKINGO = (i: number): Ropa => ({ tunica: ["#5a6a4a", "#6a4a3a", "#3a4a6a", "#7a5a3a"][i % 4], tunica2: "#2b2a24", cinto: "#3b230f", piel: "#f0c09a", piel2: "#d09a76", pelo: ["#c9902a", "#8a4a1a", "#d8b060", "#5a3a1a"][i % 4] });

export const P8K: Llave[] = [
  [729.6, ATRAS - 40, 600, 1.0, 0.5],
  [731.0, CASA + 120, 560, 1.0, 1.0],
  [733.5, CASA + 200, 600, 1.4, 0.7],
  [737.2, CASA, 470, 0.75, 0.8],
  [741.1, CASA, 470, 0.75, 0.5],
  [745.1, CASA + 120, 640, 1.6, 0.8],
  [747.2, CASA + 60, 560, 1.0, 0.7],
  [750.7, 6440, 630, 3.0, 1.2],
  [764.9, PLAZA, 600, 1.15, 1.1, 0.35],
  [768.4, PLAZA, 520, 1.6, 0.8],
  [770.6, PLAZA + 200, 580, 0.9, 0.8],
  [777.0, PLAZA + 60, 560, 1.25, 0.8],
  [782.0, PLAZA + 350, 580, 1.1, 0.9],
  [785.4, 5900, 600, 1.0, 1.4],
  [788.6, ATRAS + 60, 600, 1.4, 2.4],
  [789.6, 7950, 600, 1.1, 0.9, 0.3],
  [796.4, ATRAS + 60, 600, 1.45, 1.0, 0.3],
  [800.5, ATRAS + 120, 560, 2.2, 1.2],
  [803.1, 6560, 600, 1.35, 0.9],
  [810.0, 6440, 630, 2.8, 1.0],
  [816.0, 6560, 520, 0.9, 1.0],
  [825.2, ATRAS + 400, 600, 0.95, 1.0],
  [831.4, 1300, 600, 0.95, 1.2, 0.4],
  [834.3, PLAZA, 600, 1.0, 1.2, 0.4],
  [841.9, PLAZA + 500, 580, 0.9, 1.4],
  [847.3, CASA, 600, 1.2, 1.2, 0.3],
  [851.7, 6440, 620, 1.9, 0.9],
  [855.9, PLAZA, 560, 1.0, 1.2, 0.35],
  [860.0, PLAZA, 520, 1.5, 0.8],
  [864.9, PLAZA, 600, 1.15, 0.8],
  [867.9, CEM, 250, 0.95, 1.0],
  [869.6, CEM, 560, 0.9, 1.4],
  [873.1, CEM + 80, 580, 1.4, 1.0],
  [877.6, 6300, 400, 0.32, 1.6, 0.2],
  [882.0, 2400, 600, 0.9, 1.0],
  [888.1, 5200, 600, 0.9, 3.0],
  [891.9, PLAZA, 560, 1.0, 1.0],
  [894.5, ATRAS + 60, 600, 1.4, 1.2],
  [898.4, 6100, 420, 0.22, 1.6],
  [902.9, 6100, 420, 0.24, 2.0],
  [906.9, 6100, 250, 0.95, 1.0],
  [908.3, VIK, 250, 0.95, 1.2],
  [909.7, VIK + 60, 540, 1.1, 1.2],
  [913.9, VIK + 60, 500, 0.98, 4.0],
];
// 0 = día, 1 = atardecer, 2 = noche
export const P8H: [number, number][] = [
  [729.2, 2], [730.4, 0], [782.0, 0], [783.2, 2], [789.4, 2], [789.9, 0], [796.0, 0], [796.6, 2], [834.0, 2], [835.0, 0],
  [865.0, 0], [868.5, 1], [882.0, 1], [888.0, 2], [915.2, 2],
];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;
const Moneda: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => <g><circle cx={x} cy={y} r={r} fill={C.oro} stroke="#8a5414" strokeWidth={4} /><circle cx={x} cy={y} r={r * 0.5} fill="none" stroke="#8a5414" strokeWidth={3} /></g>;
const Libro: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><rect x={-70} y={-50} width={140} height={100} rx={8} fill="#5a3418" stroke="#2b1c14" strokeWidth={5} /><rect x={-60} y={-44} width={120} height={88} fill="#f3dcb0" /><line x1={0} y1={-44} x2={0} y2={44} stroke="#7a3d14" strokeWidth={4} />
    <path d="M -60 -44 L -30 -14 M -60 -14 L -40 -44" stroke="#c9c2b6" strokeWidth={2} /></g>
);
const Cabestrillo: React.FC = () => <g><path d="M -40 -40 Q 0 30 40 -40" stroke="#f6efe6" strokeWidth={22} fill="none" /><circle cx={0} cy={-4} r={34} fill="#e2504a" opacity={0.45} /></g>;
// casco vikingo REAL (redondo con nasal, sin cuernos)
const Casco: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => {
  const c = cabeza(x, y, h);
  return <Svg><g transform={`translate(${c.x} ${c.y + 0 * c.s}) scale(${c.s})`}><path d="M -92 -10 A 92 92 0 0 1 92 -10 Z" fill="#8a8e98" stroke="#4a4e58" strokeWidth={8} /><rect x={-8} y={-14} width={16} height={70} rx={6} fill="#6a6e78" /><rect x={-96} y={-18} width={192} height={18} rx={8} fill="#6a6e78" /></g></Svg>;
};

export const P8Mundo: React.FC<{ t: number }> = ({ t }) => {
  return (
    <>
      {/* ── el sueldo: bolsa, monedas, leña, casa, sin impuestos */}
      {vig(t, 729.2, 750.9) && (
        <>
          <Franz x={CASA + 120} y={SUELO - 10} t={t} expr={t > 745 ? "orgullo" : t > 730.5 ? "feliz" : "sorpresa"} bD={110} cD={50} manoD={<Svg><g transform="translate(0 0)"><path d="M -40 -10 Q -50 60 0 66 Q 50 60 40 -10 Q 0 -30 -40 -10 Z" fill="#c9a060" stroke="#7a5a2a" strokeWidth={5} /><circle cx={0} cy={26} r={14} fill={C.oro} /></g></Svg>} />
          {/* pila de monedas semanal */}
          {t > 733.5 && <Svg>{Array.from({ length: Math.min(14, Math.floor((t - 733.5) * 6)) }, (_, i) => <ellipse key={i} cx={CASA + 330} cy={SUELO - 20 - i * 14} rx={36} ry={12} fill={C.oro} stroke="#8a5414" strokeWidth={4} />)}</Svg>}
          {vig(t, 735.6, 737.4) && [0, 1, 2].map((i) => <TextoMundo key={i} x={CASA + 250 + i * 80} y={SUELO - 300 - clamp((t - 735.7 - i * 0.3) * 160, 0, 120)} text="+1" size={54} color={C.lima} borde="#1b2a10" op={t > 735.7 + i * 0.3 ? 1 : 0} />)}
          {/* leña gratis */}
          {t > 738.6 && <Svg>{Array.from({ length: 9 }, (_, i) => <g key={i}><rect x={CASA - 380 + (i % 3) * 64 - (Math.floor(i / 3) % 2) * 32} y={SUELO - 50 - Math.floor(i / 3) * 46} width={60} height={42} rx={20} fill="#8a5a2a" stroke="#4a2810" strokeWidth={4} /><circle cx={CASA - 380 + (i % 3) * 64 - (Math.floor(i / 3) % 2) * 32 + 14} cy={SUELO - 29 - Math.floor(i / 3) * 46} r={10} fill="#d9a870" /></g>)}</Svg>}
          {vig(t, 737.2, 741.1) && (
            <>
              <TextoMundo x={CASA} y={SUELO - 780} text="FREE HOUSE ✓" size={70} color={C.lima} borde="#1b2a10" />
              {t > 738.6 && <TextoMundo x={CASA - 320} y={SUELO - 240} text="FREE FIREWOOD ✓" size={46} color={C.lima} borde="#1b2a10" />}
              <Particulas t={t} tipo="destellos" n={24} seed={8} />
            </>
          )}
          {/* el cofre del hombre rico */}
          {t > 745.1 && (
            <G x={CASA + 330} y={SUELO - 10}>
              <rect x={-90} y={-110} width={180} height={110} rx={10} fill="#7d4a24" stroke="#3b230f" strokeWidth={6} />
              <ellipse cx={0} cy={-110} rx={84} ry={30} fill={C.oro} />
              <G x={0} y={-110} rot={-interp(t, [745.2, 745.8], [0, 70])}><rect x={-90} y={-60} width={180} height={60} rx={14} fill="#8a5a2a" stroke="#3b230f" strokeWidth={6} /></G>
              <rect x={-14} y={-80} width={28} height={30} rx={4} fill={C.oro} />
            </G>
          )}
          {t > 745.4 && <Particulas t={t} tipo="lluviaoro" n={36} seed={11} />}
        </>
      )}
      {/* ── el diario: lo que aprendió del cuerpo */}
      {vig(t, 750.0, 764.9) && <Franz x={6700} y={SUELO - 10} t={t} flip expr="neutro" mira={-1} bD={70} cD={70} />}
      {/* ── el doctor del libro viejo, en la plaza */}
      {vig(t, 763.6, 782.6) && (
        <>
          <Svg>
            <rect x={PLAZA - 120} y={SUELO - 110} width={240} height={100} fill="#7d4a24" stroke="#4a2810" strokeWidth={6} />
            {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M ${PLAZA - 110 + i * 50} ${SUELO - 520} q 25 40 50 0`} stroke="#d8d2cc" strokeWidth={2} fill="none" opacity={0.8} />)}
          </Svg>
          <Persona x={PLAZA} y={SUELO - 10} h={310} t={t} seed={800} ropa={DOCTOR} gorro="noble" barba="#d8d2cc" viejo expr={vig(t, 777, 782) ? "orgullo" : "neutro"} habla={vig(t, 777, 782)} bD={110} cD={70} bI={110} cI={70}
            manoD={<Libro s={0.8} />} />
          <BurbujaM t={t} t0={768.5} t1={770.6} x={PLAZA - 40} y={SUELO - 430} text="ACCORDING TO THE OLD BOOK..." size={36} />
          <BurbujaM t={t} t0={778.0} t1={782.0} x={PLAZA - 40} y={SUELO - 430} text="DOLOR... MAGNUS... EST..." size={40} />
          {vig(t, 779.4, 782.2) && <G x={PLAZA - 220} y={SUELO - 10}><path d="M -60 -10 Q -70 -120 0 -130 Q 70 -120 60 -10 Z" fill="#c9a060" stroke="#7a5a2a" strokeWidth={6} /><text x={0} y={-50} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={60} fill={C.oro} stroke="#5a3a10" strokeWidth={3}>×10</text></G>}
          {/* los pacientes: brazo roto, tobillo, herida */}
          {t > 773.4 && [["#d8443a", "BROKEN ARM?", 773.5], ["#2a8a5a", "TWISTED ANKLE?", 774.4], ["#5a6ac0", "WON'T HEAL?", 775.3]].map(([col, txt, t0], i) => {
            const x0 = PLAZA + 300 + i * 260;
            return (
              <React.Fragment key={i}>
                <Persona x={x0} y={SUELO - 10} h={280} t={t} seed={810 + i} ropa={{ ...CIVIL(140 + i), tunica: col as string }} flip expr={t > 779.4 ? "miedo" : "triste"} aparece={t0 as number}
                  inclina={i === 1 ? -10 : 0} bD={i === 0 ? 60 : i === 2 ? 120 : 10} cD={i === 0 ? 110 : 40}
                  manoD={i === 0 ? <Cabestrillo /> : i === 2 ? <rect x={-30} y={-14} width={60} height={28} rx={8} fill="#f6efe6" /> : undefined}
                  manoI={i === 1 ? <rect x={-5} y={-40} width={10} height={260} fill="#8a5a2a" /> : undefined} />
                {vig(t, t0 as number, 777) && <TextoMundo x={x0} y={SUELO - 390 - (i % 2) * 95} text={txt as string} size={38} color="#fff3d6" borde="#2b1c14" />}
              </React.Fragment>
            );
          })}
        </>
      )}
      {/* ── de noche: cruza el puente mirando a los costados y golpea la puerta de atrás */}
      {vig(t, 782.0, 789.4) && (
        <>
          <Persona x={interp(t, [782.2, 783.6, 785.4, 788.4], [PLAZA + 300, PLAZA + 300, 5900, ATRAS + 140])} y={SUELO - 20} h={280} t={t} seed={810} ropa={{ ...CIVIL(140), tunica: "#d8443a" }} gorro="capucha" capa="#1b2440"
            camina={vig(t, 782.2, 783.6) || vig(t, 785.4, 788.4) ? 1.4 : 0} flip={vig(t, 783.6, 785.4) ? Math.sin(t * 3) > 0 : false} mira={vig(t, 783.6, 785.4) ? Math.sign(Math.sin(t * 3)) : 0} expr="miedo" bD={t > 788.4 ? 130 : 60} cD={t > 788.4 ? 40 : 110} manoD={t > 788.4 ? undefined : <Cabestrillo />} />
          {vig(t, 783.6, 785.4) && <Emote t={t} t0={783.7} tipo="preg" x={5300} y={SUELO - 380} s={0.7} />}
          {t > 788.4 && <TextoMundo x={ATRAS + 40} y={SUELO - 420} text="KNOCK KNOCK" size={60} color={C.ambar} borde="#2b1c14" rot={-6} />}
        </>
      )}
      {/* ── esa mañana: el mercader se tira al barro para no rozarte la manga */}
      {vig(t, 789.4, 796.5) && (
        <>
          <Svg><ellipse cx={7880} cy={SUELO + 30} rx={150} ry={34} fill="#5a3a1e" /></Svg>
          <Franz x={interp(t, [790.0, 795.5], [8350, 7600])} y={SUELO - 10} t={t} flip camina={1.3} expr="neutro" />
          <Persona x={interp(t, [790.0, 792.6, 793.2, 795.5], [7500, 7820, 7880, 8100])} y={SUELO - 10 + (vig(t, 792.6, 794.6) ? 40 : 0)} h={300} t={t} seed={790} ropa={MERCADER} gorro="noble"
            camina={vig(t, 792.6, 793.4) ? 0 : 1.4} expr={t > 792.6 ? "enojado" : "neutro"} inclina={vig(t, 792.6, 794.4) ? -16 : 0} bD={vig(t, 792.6, 794.4) ? 150 : 10} bI={vig(t, 792.6, 794.4) ? 150 : 10} />
          {vig(t, 792.7, 793.8) && <Svg>{Array.from({ length: 8 }, (_, i) => { const u = clamp((t - 792.7) / 0.8, 0, 1); const a = (i / 8) * Math.PI; return <circle key={i} cx={7880 + Math.cos(a) * 200 * u * (i % 2 ? 1 : -1)} cy={SUELO - Math.sin(a) * 160 * u + u * u * 120} r={14} fill="#5a3a1e" />; })}</Svg>}
          {vig(t, 792.8, 795) && <TextoMundo x={7880} y={SUELO - 420} text="SPLAT" size={70} color="#8a5a2a" borde="#fff3d6" rot={8} />}
        </>
      )}
      {/* ── medianoche: la muñeca hinchada, el susurro */}
      {vig(t, 796.4, 803.4) && (
        <>
          <Persona x={ATRAS + 140} y={SUELO - 20} h={300} t={t} seed={790} ropa={MERCADER} gorro="capucha" capa="#1b2440" flip expr="miedo" habla={t > 798.7} bD={110} cD={120} manoD={<circle cx={0} cy={0} r={34} fill="#e2504a" opacity={0.7} />} inclina={-6} />
          <Svg><rect x={7020} y={SUELO - 240} width={72} height={230} fill="#ffd27a" opacity={clamp((t - 797.5) / 0.6, 0, 1) * 0.7} /></Svg>
          {t > 797.6 && <Franz x={6990} y={SUELO - 10} t={t} expr="neutro" mira={1} />}
          <BurbujaM t={t} t0={800.4} t1={803.2} x={ATRAS + 100} y={SUELO - 470} text="please... don't tell anyone." size={42} />
        </>
      )}
      {/* ── Franz el médico: huesos, heridas, quemaduras, remedios */}
      {vig(t, 803.0, 816.2) && (
        <>
          <Persona x={6380} y={SUELO - 10} h={300} t={t} seed={790} ropa={MERCADER} expr={t > 806.6 ? "feliz" : "miedo"} bD={70} cD={70} manoD={t > 806.6 ? <Cabestrillo /> : <circle cx={0} cy={0} r={34} fill="#e2504a" opacity={0.7} />} />
          <Franz x={6560} y={SUELO - 10} t={t} flip expr="orgullo" bD={100 + Math.sin(t * 6) * 15} cD={60} bI={90} cI={50}
            manoD={vig(t, 808.5, 810.1) ? <g><path d="M -26 -40 L 26 -40 L 20 30 L -20 30 Z" fill="#7ac07a" stroke="#2b1c14" strokeWidth={4} /></g> : <rect x={-40} y={-10} width={80} height={22} rx={8} fill="#f6efe6" />} />
          {vig(t, 805.2, 806.8) && <TextoMundo x={6460} y={SUELO - 400} text="CLICK!" size={64} color={C.ambar} borde="#2b1c14" rot={-8} />}
          {/* caldero de remedios */}
          {t > 808.4 && <G x={6830} y={SUELO - 10}><path d="M -70 -90 Q -80 0 0 0 Q 80 0 70 -90 Z" fill="#2b2a34" /><ellipse cx={0} cy={-90} rx={74} ry={18} fill="#7ac07a" />{[0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 30} cy={-110 - ((t * 80 + i * 40) % 90)} r={10} fill="#a8e0a0" opacity={0.7} />)}</G>}
          {t > 810 && <Particulas t={t} tipo="luciernagas" n={20} seed={14} />}
        </>
      )}
      {/* ── la fila de noche: ricos, pobres y los más respetables */}
      {vig(t, 823.5, 831.6) && (
        <>
          {Array.from({ length: 8 }, (_, i) => {
            const tipos: [Ropa, any][] = [[NOBLE, "noble"], [{ ...CIVIL(150), tunica: "#8a8070", tunica2: "#6a6050" }, "campesino"], [{ ...CIVIL(0), tunica: "#f2ead8", tunica2: "#c9bca4" }, "cura"], [MERCADER, "noble"], [CIVIL(151), "toca"], [NOBLE, "noble"], [CIVIL(152), undefined], [{ ...CIVIL(153), tunica: "#8a8070" }, "campesino"]];
            const [r, g] = tipos[i];
            return <Persona key={i} x={ATRAS + 140 + i * 115} y={SUELO - 20} h={280} t={t} seed={820 + i} ropa={r} gorro={g} capa="#1b2440" flip expr={i % 3 ? "neutro" : "miedo"} mira={i % 2 ? 1 : 0} aparece={825.2 + i * 0.15} />;
          })}
          {vig(t, 827.4, 831.4) && <TextoMundo x={ATRAS + 600} y={SUELO - 420} text="RICH · POOR · VERY RESPECTABLE" size={72} color="#fff3d6" borde="#2b1c14" />}
        </>
      )}
      {/* ── la iglesia: esos mismos, bien lejos de su banco */}
      {vig(t, 830.2, 835.2) && (
        <>
          <Gente t={t} x0={600} x1={1250} n={6} y={SUELO - 30} h={260} seed={820} expr="neutro" mira={-1} />
          <Franz x={1560} y={SUELO - 20} t={t} expr="triste" mira={-1} />
        </>
      )}
      {/* ── los médicos protestan, los pacientes pasan de largo */}
      {vig(t, 833.0, 847.6) && (
        <>
          {[PLAZA - 220, PLAZA - 80, PLAZA + 60].map((cx, i) => <Persona key={cx} x={cx} y={SUELO - 10} h={300} t={t} seed={830 + i} ropa={DOCTOR} gorro="noble" barba={i === 1 ? "#d8d2cc" : undefined} viejo={i === 1} expr="enojado" habla salta={vig(t, 837.7, 841.9) ? 1 : 0}
            bD={150 + Math.sin(t * 8 + i) * 15} cD={10} manoD={i === 1 ? <g><rect x={-6} y={-260} width={12} height={260} fill="#6b3a1f" /></g> : <Libro s={0.6} />} />)}
          <G x={PLAZA - 80} y={SUELO - 500} rot={Math.sin(t * 4) * 3}><rect x={-260} y={-60} width={520} height={120} rx={14} fill="#fbecc8" stroke="#7a3d14" strokeWidth={8} /><text x={0} y={-8} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill={C.rojo}>STOP STEALING</text><text x={0} y={40} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill={C.rojo}>OUR PATIENTS!</text></G>
          {t > 841.9 && <Gente t={t} x0={interp(t, [841.9, 847.3], [PLAZA + 200, PLAZA + 900])} x1={interp(t, [841.9, 847.3], [PLAZA + 900, PLAZA + 1600])} n={6} y={SUELO + 20} h={280} seed={840} expr="feliz" habla />}
        </>
      )}
      {/* ── los hijos y las peticiones */}
      {vig(t, 846.0, 857.8) && (
        <>
          <Franz x={6560} y={SUELO - 10} t={t} flip viejoF expr={t > 851.7 ? "neutro" : "triste"} mira={-1} bD={t > 851.7 ? 70 : 10} cD={t > 851.7 ? 70 : 10} />
          {t < 851.8 && (
            <>
              <Persona x={6300} y={SUELO - 10} h={200} t={t} seed={850} ropa={CIVIL(160)} expr="feliz" bD={130} cD={30} manoD={<rect x={-5} y={-120} width={10} height={130} fill="#8a5a2a" />} />
              <Persona x={6200} y={SUELO - 10} h={180} t={t} seed={851} ropa={{ ...CIVIL(161), tunica: "#c8447a" }} gorro="toca" expr="feliz" />
              {t > 849.2 && <Svg><g opacity={clamp((t - 849.2) / 0.5, 0, 1)}><ellipse cx={6250} cy={SUELO - 320} rx={130} ry={46} fill="#3a3046" /><ellipse cx={6200} cy={SUELO - 350} rx={70} ry={40} fill="#3a3046" />{[0, 1, 2].map((i) => <line key={i} x1={6200 + i * 40} y1={SUELO - 280} x2={6190 + i * 40} y2={SUELO - 240} stroke="#7a8aa8" strokeWidth={5} />)}</g></Svg>}
              {t > 849.2 && <TextoMundo x={6250} y={SUELO - 250} text="THE CURSE" size={64} color="#fff3d6" borde="#2b1c14" />}
            </>
          )}
          {t > 853.3 && Array.from({ length: 10 }, (_, i) => {
            const u = clamp((t - 853.4 - i * 0.4) / 0.9, 0, 1);
            if (u <= 0 || u >= 1) return null;
            return <G key={i} x={6460 + u * 900} y={SUELO - 300 - Math.sin(u * Math.PI) * 220} rot={u * 200}><rect x={-34} y={-24} width={68} height={48} rx={4} fill="#fff6e0" stroke="#7a3d14" strokeWidth={4} /><circle cx={0} cy={0} r={8} fill={C.rojo} /></G>;
          })}
        </>
      )}
      {/* ── 1624: el emperador firma → el primer apretón de manos */}
      {vig(t, 855.5, 868.4) && (
        <>
          <Svg><rect x={PLAZA - 260} y={SUELO - 80} width={520} height={70} fill="#a3202f" /><rect x={PLAZA - 280} y={SUELO - 100} width={560} height={24} fill={C.oro} /></Svg>
          <Persona x={PLAZA - 60} y={SUELO - 100} h={320} t={t} seed={860} ropa={EMPERADOR} barba="#8a6a4a" capa="#f6efe6" expr="orgullo" bD={vig(t, 859.5, 862) ? 100 + Math.sin(t * 12) * 10 : 30} cD={50}
            manoD={<path d="M 0 0 L 40 -90" stroke="#fff" strokeWidth={6} />} />
          <G x={PLAZA - 60} y={SUELO - 100 - 318}><path d="M -50 0 L -58 -58 L -28 -28 L 0 -70 L 28 -28 L 58 -58 L 50 0 Z" fill={C.oro} stroke="#8a5414" strokeWidth={5} /></G>
          {vig(t, 859.4, 864.9) && <G x={PLAZA + 140} y={SUELO - 260} rot={4}><rect x={-80} y={-120} width={160} height={220} rx={10} fill="#fbecc8" stroke="#7a3d14" strokeWidth={6} />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-58} y={-90 + i * 30} width={116} height={8} rx={4} fill="#a8805a" />)}<circle cx={40} cy={70} r={22} fill={C.rojo} /></G>}
          {t > 864.9 && (
            <>
              <Franz x={PLAZA + 140} y={SUELO - 10} t={t} viejoF expr="feliz" bD={70} cD={10} />
              <Persona x={PLAZA + 300} y={SUELO - 10} h={300} t={t} seed={861} ropa={CIVIL(170)} gorro="campesino" flip expr="feliz" bD={70} cD={10} />
              <Persona x={PLAZA + 440} y={SUELO - 10} h={210} t={t} seed={850} ropa={CIVIL(160)} flip expr="feliz" salta={1} />
              <Particulas t={t} tipo="destellos" n={30} seed={15} />
            </>
          )}
        </>
      )}
      {/* ── el cementerio de los honorables (afuera, más allá de la horca) */}
      {vig(t, 866.5, 879.6) && (
        <>
          <Svg><rect x={CEM - 1600} y={SUELO} width={3200} height={900} fill="#5a8a3a" /><rect x={CEM - 1600} y={SUELO} width={3200} height={14} fill="#4a7a2a" /></Svg>
          <Svg>{Array.from({ length: 9 }, (_, i) => {
            const x = CEM - 760 + i * 190;
            if (i === 4) return null;
            return <g key={i}><path d={`M ${x - 46} ${SUELO} L ${x - 46} ${SUELO - 140} Q ${x} ${SUELO - 200} ${x + 46} ${SUELO - 140} L ${x + 46} ${SUELO} Z`} fill="#b8b4c0" stroke="#6a6676" strokeWidth={5} /><path d={`M ${x - 16} ${SUELO - 120} L ${x + 16} ${SUELO - 120} M ${x} ${SUELO - 140} L ${x} ${SUELO - 80}`} stroke="#6a6676" strokeWidth={6} /></g>;
          })}</Svg>
          {t > 869.0 && <G x={CEM} y={SUELO} s={1.7}><path d="M -70 0 L -70 -200 Q 0 -280 70 -200 L 70 0 Z" fill="#d8d4e0" stroke="#6a6676" strokeWidth={6} /><text x={0} y={-150} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#3a3646">FRANZ</text><text x={0} y={-114} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#3a3646">SCHMIDT</text><text x={0} y={-70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#3a3646">1634</text>
            <path d="M -60 -10 Q 0 -40 60 -10" stroke="#3a8a3a" strokeWidth={10} fill="none" /></G>}
          {t > 870.0 && <Gente t={t} x0={CEM - 700} x1={CEM - 200} n={5} y={SUELO + 20} h={290} seed={870} expr="triste" mira={1} />}
          {t > 870.0 && <Gente t={t} x0={CEM + 200} x1={CEM + 700} n={5} y={SUELO + 20} h={290} seed={875} expr="triste" mira={-1} />}
          {vig(t, 873.1, 877.6) && <TextoMundo x={CEM} y={SUELO - 420} text="AMONG THE HONORABLE" size={56} color={C.oro} borde="#2b1c14" />}
          <Particulas t={t} tipo="polvo" n={20} seed={16} />
        </>
      )}
      {/* ── recap: la plaza al anochecer, el banco vacío, la puerta de atrás */}
      {vig(t, 887.8, 898.6) && (
        <>
          {/* el cadalso (macizo, de madera) con Franz arriba y la gente mirando */}
          <Svg><rect x={PLAZA - 260} y={SUELO - 160} width={520} height={150} fill="#6b3a1f" stroke="#2b1c14" strokeWidth={8} />
            {[-200, -70, 60, 190].map((d) => <rect key={d} x={PLAZA + d} y={SUELO - 150} width={14} height={140} fill="#4a2810" />)}
            <rect x={PLAZA - 280} y={SUELO - 180} width={560} height={26} fill="#8a5a2a" stroke="#2b1c14" strokeWidth={6} />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={PLAZA + 270 + i * 40} y={SUELO - 150 + i * 36} width={44} height={14} fill="#8a5a2a" stroke="#2b1c14" strokeWidth={4} />)}</Svg>
          {vig(t, 887.8, 892.2) && <Franz x={PLAZA - 40} y={SUELO - 180} t={t} expr="neutro" bD={vig(t, 889.9, 891.6) ? 150 : 20} cD={vig(t, 889.9, 891.6) ? 20 : 10} manoD={<g transform="rotate(-20)"><rect x={-8} y={-300} width={16} height={300} fill="#dfe6ee" stroke="#2b2140" strokeWidth={4} /><rect x={-40} y={-10} width={80} height={16} fill="#8a5414" /></g>} />}
          {vig(t, 887.8, 892.2) && <Gente t={t} x0={PLAZA - 900} x1={PLAZA - 360} n={4} y={SUELO + 10} h={280} seed={888} expr="miedo" mira={1} />}
          {vig(t, 887.8, 892.2) && <Gente t={t} x0={PLAZA + 420} x1={PLAZA + 900} n={4} y={SUELO + 10} h={280} seed={889} expr="miedo" mira={-1} />}
          {vig(t, 889.9, 892) && <TextoMundo x={PLAZA + 420} y={SUELO - 470} text="1. JUSTICE" size={90} color={C.oro} borde="#2b1c14" />}
          <Svg><rect x={7020} y={SUELO - 240} width={72} height={230} fill="#ffd27a" stroke="#4a2810" strokeWidth={6} /></Svg>
          {t > 891.9 && <Franz x={ATRAS - 60} y={SUELO - 10} t={t} expr="feliz" bD={100} cD={40} manoD={<g><rect x={-14} y={-10} width={28} height={40} rx={6} fill="#ffd27a" stroke="#4a2810" strokeWidth={4} /></g>} flip />}
          {t > 891.9 && <Persona x={ATRAS + 140} y={SUELO - 20} h={290} t={t} seed={890} ropa={CIVIL(180)} gorro="capucha" capa="#1b2440" flip expr="miedo" bD={110} cD={120} manoD={<Cabestrillo />} />}
          {vig(t, 893.4, 898.4) && <TextoMundo x={ATRAS + 40} y={SUELO - 420} text="2. YOUR BONES" size={90} color={C.ambar} borde="#2b1c14" />}
        </>
      )}
      {/* ── el que mejor conocía a todos: hilos de oro de su casa a cada ventana */}
      {vig(t, 898.0, 907.0) && (
        <Svg>
          {[900, 1400, 2250, 3200, 3600, 4520, 5120, 5420, 7860, 8220, 8900, 9900].map((x, i) => {
            const u = clamp((t - 898.6 - i * 0.18) / 0.8, 0, 1);
            if (u <= 0) return null;
            const x0 = CASA, y0 = SUELO - 420, y1 = SUELO - 300 - (i % 3) * 90;
            const mx = (x0 + x) / 2, my = Math.min(y0, y1) - 600 - Math.abs(x - x0) * 0.1;
            const px = x0 + (x - x0) * u, py = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * my + u * u * y1;
            const qx = x0 + (mx - x0) * u, qy = y0 + (my - y0) * u;
            return <g key={i}><path d={`M ${x0} ${y0} Q ${qx} ${qy} ${px} ${py}`} stroke={C.oro} strokeWidth={30} fill="none" strokeLinecap="round" /><path d={`M ${x0} ${y0} Q ${qx} ${qy} ${px} ${py}`} stroke="#fff3c0" strokeWidth={10} fill="none" strokeLinecap="round" />{u >= 1 && <rect x={px - 60} y={py - 70} width={120} height={140} rx={10} fill="#ffd27a" stroke="#4a2810" strokeWidth={10} />}<circle cx={px} cy={py} r={u >= 1 ? 46 + Math.sin(t * 5 + i) * 8 : 34} fill="#fff3c0" stroke={C.oro} strokeWidth={8} /></g>;
          })}
          <circle cx={CASA} cy={SUELO - 420} r={110 + Math.sin(t * 4) * 12} fill="#fff3c0" stroke={C.oro} strokeWidth={14} />
        </Svg>
      )}
      {/* ── CTA: el campamento vikingo dormido */}
      {t > 906.5 && (
        <>
          <Svg><rect x={VIK - 2400} y={SUELO} width={4800} height={900} fill="#22323e" /><rect x={VIK - 2400} y={SUELO} width={4800} height={14} fill="#1a2832" />
            <path d={`M ${VIK - 2400} ${SUELO} Q ${VIK - 1400} ${SUELO - 260} ${VIK - 600} ${SUELO} Z`} fill="#1c2a36" /><path d={`M ${VIK + 500} ${SUELO} Q ${VIK + 1500} ${SUELO - 320} ${VIK + 2400} ${SUELO} Z`} fill="#1c2a36" /></Svg>
          {/* el barco varado */}
          <Svg><path d={`M ${VIK - 100 + 520} ${SUELO - 60} Q ${VIK - 100 + 900} ${SUELO + 30} ${VIK - 100 + 1280} ${SUELO - 60} L ${VIK - 100 + 1320} ${SUELO - 200} Q ${VIK - 100 + 1290} ${SUELO - 120} ${VIK - 100 + 1240} ${SUELO - 110} L ${VIK - 100 + 560} ${SUELO - 110} Q ${VIK - 100 + 510} ${SUELO - 120} ${VIK - 100 + 480} ${SUELO - 200} Z`} fill="#5a3a1e" stroke="#2b1c14" strokeWidth={6} />
            <rect x={VIK - 100 + 890} y={SUELO - 560} width={14} height={460} fill="#4a2810" /><path d={`M ${VIK - 100 + 740} ${SUELO - 520} L ${VIK - 100 + 1060} ${SUELO - 520} L ${VIK - 100 + 1040} ${SUELO - 240} L ${VIK - 100 + 760} ${SUELO - 240} Z`} fill="#c8283c" />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={VIK - 100 + 755 + i * 72} y={SUELO - 520} width={34} height={280} fill="#f3dcb0" opacity={0.85} />)}</Svg>
          <Tienda x={VIK - 480} y={SUELO - 6} s={1.4} />
          <Tienda x={VIK - 110} y={SUELO - 6} s={1.2} />
          {/* fogata */}
          <G x={VIK + 110} y={SUELO - 6} s={1.7}>{[0, 1, 2].map((i) => <path key={i} d={`M ${-30 + i * 30} 0 Q ${-50 + i * 30 + Math.sin(t * 9 + i) * 10} -80 ${-20 + i * 30} -${110 + Math.sin(t * 7 + i) * 20} Q ${10 + i * 30} -60 ${-10 + i * 30} 0 Z`} fill={i === 1 ? "#ffd27a" : "#ff8a3a"} />)}<rect x={-60} y={-12} width={120} height={16} rx={8} fill="#5a3418" /></G>
          {/* acostados alrededor del fuego, respirando bajo la manta */}
          {[[-560, 0], [-250, 1], [330, 2], [-60, 3]].map(([dx, i]) => {
            const resp = Math.sin(t * 2.2 + i * 1.7);
            const lado = i % 2 ? 1 : -1;
            return (
              <React.Fragment key={i}>
                <Persona x={VIK + dx} y={SUELO + 62 + resp * 2} h={280} t={t} seed={900 + i} ropa={VIKINGO(i)} barba={VIKINGO(i).pelo} expr="dormido" inclina={lado * 86} bD={0} />
                <G x={VIK + dx - lado * 70} y={SUELO - 4}><path d={`M -150 4 Q -158 ${-70 - resp * 6} -50 ${-80 - resp * 8} Q 60 ${-88 - resp * 9} 140 ${-50 - resp * 5} Q 156 -14 150 4 Z`} fill={["#6a4a8a", "#8a3a2a", "#3a6a5a", "#7a6a3a"][i]} stroke="#1a2832" strokeWidth={5} /></G>
                <TextoMundo x={VIK + dx - lado * 120} y={SUELO - 190 - ((t * 40 + i * 20) % 60)} text="z Z z" size={44} color="#bfe6ff" borde="#1a2832" />
              </React.Fragment>
            );
          })}
          <Particulas t={t} tipo="brasas" n={26} seed={17} />
        </>
      )}
    </>
  );
};

// esqueleto de dibujo (amable, como lámina de escuela)
const Lamina: React.FC<{ t: number }> = ({ t }) => {
  if (t < 755.9 || t > 764.9) return null;
  const e = clamp((t - 755.9) / 0.35, 0, 1) * clamp((764.9 - t) / 0.3, 0, 1);
  const L = (t0: number, x: number, y: number, tx: number, ty: number, txt: string) => t > t0 && (
    <g><line x1={x} y1={y} x2={tx} y2={ty} stroke={C.rojo} strokeWidth={5} /><circle cx={x} cy={y} r={9} fill={C.rojo} /><text x={tx + (tx > 300 ? 10 : -10)} y={ty + 12} textAnchor={tx > 300 ? "start" : "end"} fontFamily={fontFamily} fontWeight={700} fontSize={38} fill="#5a2a10">{txt}</text></g>
  );
  const B = "#f6efe6", K = "#7a6a5a";
  return (
    <div style={{ position: "absolute", left: 560, top: 560, transform: `translate(-50%,-50%) scale(${e * 0.88}) rotate(-2deg)`, background: "#fbecc8", border: "10px solid #7a3d14", borderRadius: 24, padding: 10, boxShadow: "0 14px 0 rgba(20,10,50,.35)" }}>
      <svg width={720} height={760} viewBox="-40 0 720 760">
        <g stroke={K} strokeWidth={5}>
          <circle cx={300} cy={100} r={62} fill={B} />
          <circle cx={278} cy={96} r={12} fill={K} /><circle cx={322} cy={96} r={12} fill={K} />
          <rect x={292} y={162} width={16} height={260} rx={8} fill={B} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 300 ${200 + i * 36} Q ${230 - i * 4} ${210 + i * 36} ${236} ${240 + i * 36} M 300 ${200 + i * 36} Q ${370 + i * 4} ${210 + i * 36} ${364} ${240 + i * 36}`} fill="none" />)}
          <path d="M 230 180 L 370 180" strokeWidth={14} stroke={B} /><path d="M 230 180 L 370 180" fill="none" />
          <rect x={196} y={186} width={22} height={170} rx={10} fill={B} transform="rotate(14 207 186)" /><rect x={382} y={186} width={22} height={170} rx={10} fill={B} transform="rotate(-14 393 186)" />
          <rect x={150} y={350} width={20} height={150} rx={9} fill={B} transform="rotate(8 160 350)" /><rect x={430} y={350} width={20} height={150} rx={9} fill={B} transform="rotate(-8 440 350)" />
          <path d="M 230 430 Q 300 390 370 430 L 350 480 L 250 480 Z" fill={B} />
          <rect x={244} y={486} width={24} height={200} rx={11} fill={B} /><rect x={332} y={486} width={24} height={200} rx={11} fill={B} />
          <circle cx={256} cy={590} r={16} fill={B} /><circle cx={344} cy={590} r={16} fill={B} />
        </g>
        {L(757.7, 364, 250, 470, 200, "BONES")}
        {L(759.6, 344, 590, 470, 640, "JOINTS")}
        {L(760.3, 440, 420, 470, 330, "WOUNDS")}
      </svg>
    </div>
  );
};

// tarjetitas del recap: nadie te tocó, nadie se sentó, nadie se casó, nadie cargó el cajón
const Recap: React.FC<{ t: number }> = ({ t }) => {
  if (t < 882.0 || t > 888.1) return null;
  const items: [string, number][] = [["TOUCHED HIM", 882.05], ["SAT WITH HIM", 883.2], ["MARRIED IN", 884.45], ["CARRIED HIS COFFIN", 886.15]];
  const out = clamp((888.1 - t) / 0.3, 0, 1);
  return (
    <div style={{ position: "absolute", left: 960, top: 640, transform: `translate(-50%,-50%) scale(${out})`, display: "flex", gap: 26, fontFamily, fontWeight: 700 }}>
      {items.map(([x, t0], i) => {
        const e = clamp((t - t0) / 0.25, 0, 1);
        return (
          <div key={x} style={{ width: 380, background: "rgba(27,18,64,.9)", borderRadius: 26, padding: "22px 16px", textAlign: "center", transform: `scale(${e}) rotate(${(i % 2 ? 1 : -1) * 3}deg)`, boxShadow: "0 10px 0 rgba(10,5,30,.4)" }}>
            <div style={{ fontSize: 34, color: "#fff3d6" }}>NOBODY</div>
            <div style={{ fontSize: 40, color: C.ambar, minHeight: 100 }}>{x}</div>
            <div style={{ fontSize: 90, color: C.rojo, lineHeight: 1 }}>✗</div>
          </div>
        );
      })}
    </div>
  );
};

// CTA: suscribirse + campana, y la pregunta con las 7 trampas
const Cta: React.FC<{ t: number }> = ({ t }) => {
  const sub = vig(t, 905.2, 909.0) ? clamp((t - 905.2) / 0.3, 0, 1) * clamp((909.0 - t) / 0.3, 0, 1) : 0;
  const tocado = t > 906.1;
  const campana = t > 906.6 ? Math.sin((t - 906.6) * 30) * 18 * Math.exp(-(t - 906.6) * 2) : 0;
  const q = t > 910.4 ? clamp((t - 910.4) / 0.35, 0, 1) : 0;
  const trampas = ["BLOOD", "TOUCH", "CHURCH", "ADDRESS", "MARRIAGE", "STAGE", "JOBS"];
  return (
    <>
      {sub > 0 && (
        <div style={{ position: "absolute", left: 960, top: 860, transform: `translate(-50%,-50%) scale(${sub})`, display: "flex", alignItems: "center", gap: 30, fontFamily, fontWeight: 700 }}>
          <div style={{ background: tocado ? "#5a5a66" : "#e0202a", color: "#fff", fontSize: 64, padding: "18px 50px", borderRadius: 20, transform: `scale(${vig(t, 906.0, 906.25) ? 0.9 : 1})`, boxShadow: "0 10px 0 rgba(10,5,30,.4)" }}>{tocado ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
          <svg width={120} height={120} viewBox="-60 -60 120 120" style={{ transform: `rotate(${campana}deg)` }}>
            <path d="M -36 24 L -36 -6 Q -36 -40 0 -44 Q 36 -40 36 -6 L 36 24 L 46 34 L -46 34 Z" fill={C.ambar} stroke="#5a3a10" strokeWidth={6} />
            <circle cx={0} cy={44} r={10} fill={C.ambar} stroke="#5a3a10" strokeWidth={5} />
          </svg>
        </div>
      )}
      {q > 0 && (
        <div style={{ position: "absolute", left: 960, top: 175, transform: `translate(-50%,-50%) scale(${q})`, background: "rgba(27,18,64,.92)", borderRadius: 30, padding: "26px 40px", fontFamily, fontWeight: 700, textAlign: "center", boxShadow: "0 12px 0 rgba(10,5,30,.4)" }}>
          <div style={{ fontSize: 52, color: "#fff3d6" }}>WHICH TRAP WOULD GET YOU FIRST?</div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 18 }}>
            {trampas.map((x, i) => <div key={x} style={{ fontSize: 30, background: [C.rojo, C.violeta, C.teal, C.ambar, C.rosa, C.naranja, C.lima][i], color: i > 1 ? C.noche : "#fff", padding: "8px 16px", borderRadius: 14, opacity: t > 910.6 + i * 0.12 ? 1 : 0 }}>{i + 1} {x}</div>)}
          </div>
          <div style={{ fontSize: 34, color: C.ambar, marginTop: 16 }}>TELL ME IN THE COMMENTS</div>
        </div>
      )}
    </>
  );
};

// 40 a 1: cuarenta curados (cruces verdes que se encienden de a uno) contra UN castigado
const Cuarenta: React.FC<{ t: number }> = ({ t }) => {
  if (t < 820.1 || t > 825.0) return null;
  const e = clamp((t - 820.1) / 0.3, 0, 1) * clamp((825.0 - t) / 0.25, 0, 1);
  return (
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) scale(${e})`, display: "flex", alignItems: "center", gap: 50, background: "rgba(27,18,64,.88)", padding: "34px 50px", borderRadius: 30, fontFamily, fontWeight: 700 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 64px)", gap: 12 }}>
        {Array.from({ length: 40 }, (_, i) => {
          const a = clamp((t - 820.3 - i * 0.05) / 0.18, 0, 1);
          return <svg key={i} width={64} height={64} viewBox="-32 -32 64 64" style={{ transform: `scale(${0.4 + 0.6 * a})`, opacity: 0.2 + 0.8 * a }}><path d="M -9 -28 H 9 V -9 H 28 V 9 H 9 V 28 H -9 V 9 H -28 V -9 H -9 Z" fill={C.lima} stroke="#1b1240" strokeWidth={4} /></svg>;
        })}
      </div>
      <div style={{ fontSize: 110, color: "#fff3d6" }}>VS</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: clamp((t - 822.5) / 0.3, 0, 1) }}>
        <svg width={120} height={140} viewBox="-60 -70 120 140"><rect x={-8} y={-40} width={16} height={110} rx={6} fill="#8a5414" /><path d="M -8 -60 Q -60 -50 -56 -6 L -8 -14 Z" fill="#c8ccd4" stroke="#4a4e58" strokeWidth={5} /></svg>
        <div style={{ fontSize: 70, color: C.rojo }}>1</div>
      </div>
    </div>
  );
};

const Flash: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => (t > t0 && t < t0 + 0.4 ? <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 1 - (t - t0) / 0.4 }} /> : null);

export const P8Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Titulo t={t} t0={729.3} t1={730.5} text="THE TWIST" y={210} size={180} color={C.ambar} borde="#2b0a14" />
    <Chip t={t} t0={730.55} t1={733.4} text="ONE OF THE BEST-PAID MEN IN TOWN" color={C.oro} tinta={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={733.5} t1={735.5} text="A WEEKLY SALARY FROM THE CITY" color={C.teal} tinta={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={735.6} t1={737.1} text="+ EXTRA PAY FOR EVERY JOB" color={C.lima} tinta={C.noche} x={960} y={150} centro size={58} />
    <Sello t={t} t0={739.4} t1={741.0} text="TAX FREE" x={1400} y={560} size={110} color="#2a8a3a" rot={-8} />
    <Chip t={t} t0={741.1} t1={745.0} text="NUREMBERG: MORE THAN MOST MASTER CRAFTSMEN" color={C.violeta} x={960} y={150} centro size={48} />
    <Barras t={t} t0={741.4} t1={745.0} x={1420} y={880} items={[{ label: "MASTER", v: 3, color: "#8a8aa0" }, { label: "FRANZ", v: 5, color: C.oro, t0: 742.6 }]} alto={380} />
    <Chip t={t} t0={745.15} t1={747.1} text="HE DIED A WEALTHY MAN" color={C.oro} tinta={C.noche} x={960} y={150} centro size={60} />
    <Chip t={t} t0={747.25} t1={750.6} text="TREATED LIKE DIRT" color="#6a4a2a" x={560} y={150} centro size={56} />
    <Chip t={t} t0={748.6} t1={750.6} text="PAID LIKE A PRO" color={C.oro} tinta={C.noche} x={1380} y={150} centro size={56} />
    <Titulo t={t} t0={750.75} t1={752.5} text="BUT THE REAL SECRET..." y={200} size={100} color={C.crema} />
    <Chip t={t} t0={752.6} t1={755.9} text="THINK ABOUT HIS WHOLE CAREER" color={C.violeta} x={960} y={150} centro size={58} />
    <Lamina t={t} />
    <Chip t={t} t0={762.95} t1={764.85} text="HOW A BODY IS PUT TOGETHER" color={C.teal} tinta={C.noche} x={560} y={150} centro size={52} />
    <Chip t={t} t0={765.0} t1={768.4} text="BETTER THAN MANY OFFICIAL DOCTORS" color={C.noche} x={960} y={150} centro size={56} />
    <Barras t={t} t0={768.5} t1={770.5} x={1540} y={760} items={[{ label: "DOCTOR", v: 2, color: "#5a4a8a" }, { label: "FRANZ", v: 9, color: C.lima, t0: 769.0 }]} alto={360} ancho={120} />
    <Titulo t={t} t0={770.65} t1={773.4} text="THE TOWN'S SECRET DOCTOR" y={200} size={100} color={C.lima} borde="#1b2a10" />
    <Chip t={t} t0={777.05} t1={781.9} text="LATIN FOR YOU + A FORTUNE FOR HIM" color={C.violeta} x={960} y={150} centro size={54} />
    <Chip t={t} t0={782.05} t1={785.3} text="WAIT FOR DARK · MAKE SURE NOBODY'S LOOKING" color={C.noche} x={960} y={150} centro size={50} />
    <Chip t={t} t0={785.4} t1={788.9} text="CROSS THE BRIDGE · THE BACK DOOR" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={56} />
    <Titulo t={t} t0={789.05} t1={789.6} text="PICTURE IT." y={200} size={120} color={C.crema} />
    <Chip t={t} t0={789.65} t1={791.4} text="THIS MORNING: A RESPECTED MERCHANT" color={C.teal} tinta={C.noche} x={960} y={150} centro size={54} />
    <Chip t={t} t0={791.55} t1={796.3} text="INTO THE MUD... JUST TO AVOID YOUR SLEEVE" color={C.noche} x={960} y={150} centro size={52} />
    <Chip t={t} t0={796.45} t1={800.4} text="MIDNIGHT. SAME MAN. SWOLLEN WRIST." color={C.violeta} x={960} y={150} centro size={56} />
    <Chip t={t} t0={803.15} t1={805.1} text="FRANZ BECAME FAMOUS FOR IT" color={C.oro} tinta={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={805.2} t1={810.0} text="SET BONES ✓" color={C.lima} tinta={C.noche} x={380} y={150} centro size={48} />
    <Chip t={t} t0={806.65} t1={810.0} text="WOUNDS & BURNS ✓" color={C.teal} tinta={C.noche} x={960} y={150} centro size={48} />
    <Chip t={t} t0={808.5} t1={810.0} text="HIS OWN MEDICINES ✓" color={C.ambar} tinta={C.noche} x={1540} y={150} centro size={48} />
    <Chip t={t} t0={810.05} t1={812.9} text="LATER, HE WROTE DOWN THE COUNT" color={C.violeta} x={960} y={150} centro size={56} />
    <Cuenta t={t} t0={813.0} t1={816.0} de={0} a={15000} dur={2.4} x={960} y={300} size={180} suf="+ PATIENTS" color={C.lima} />
    <Barras t={t} t0={816.1} t1={820.0} x={960} y={900} items={[{ label: "PATIENTS: 15,000", v: 15000, color: C.lima }, { label: "EXECUTIONS: ~400", v: 400, color: C.rojo, t0: 817.6 }]} alto={560} ancho={300} />
    <Cuarenta t={t} />
    <Titulo t={t} t0={820.1} t1={825.1} text="HEALED ~40x MORE" y={210} size={120} color={C.lima} borde="#1b2a10" />
    <Chip t={t} t0={821.3} t1={825.1} text="...THAN HE EVER PUNISHED" color={C.noche} x={960} y={950} centro size={60} />
    <Chip t={t} t0={825.2} t1={831.3} text="QUIETLY: NUREMBERG'S MOST RESPECTABLE" color={C.violeta} x={960} y={150} centro size={52} />
    <Chip t={t} t0={831.45} t1={834.2} text="THE SAME PEOPLE WHO WOULDN'T SIT NEXT TO HIM" color={C.noche} x={960} y={150} centro size={48} />
    <Chip t={t} t0={834.35} t1={837.7} text="THE REAL PHYSICIANS HATED IT" color={C.rojo} x={960} y={150} centro size={58} />
    <Chip t={t} t0={841.95} t1={844.0} text="THE PATIENTS KEPT COMING" color={C.teal} tinta={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={844.1} t1={847.2} text="CHEAPER ✓" color={C.lima} tinta={C.noche} x={700} y={150} centro size={60} />
    <Chip t={t} t0={845.65} t1={847.2} text="USUALLY BETTER ✓" color={C.oro} tinta={C.noche} x={1240} y={150} centro size={60} />
    <Chip t={t} t0={847.35} t1={851.6} text="ONE MORE GOAL: SPARE HIS CHILDREN" color={C.violeta} x={960} y={150} centro size={54} />
    <Chip t={t} t0={851.7} t1={855.4} text="RETIRED · YEARS OF PETITIONS" color={C.noche} x={960} y={150} centro size={58} />
    <Sello t={t} t0={855.6} t1={859.4} text="1624" x={1450} y={420} size={130} color={C.violeta} rot={-8} />
    <Chip t={t} t0={857.55} t1={859.4} text="ABOUT 70 YEARS OLD" color={C.teal} tinta={C.noche} x={960} y={150} centro size={58} />
    <Chip t={t} t0={859.5} t1={862.0} text="THE HOLY ROMAN EMPEROR HIMSELF" color={C.rojo} x={960} y={150} centro size={56} />
    <Sello t={t} t0={862.05} t1={864.85} text="HONOR RESTORED" x={960} y={170} size={110} color="#2a8a3a" rot={-6} />
    <Chip t={t} t0={865.0} t1={867.8} text="HIS CHILDREN COULD CHOOSE A DIFFERENT LIFE" color={C.teal} tinta={C.noche} x={860} y={150} centro size={48} />
    <Chip t={t} t0={869.6} t1={873.0} text="1634: NUREMBERG'S MOST RESPECTED CEMETERY" color={C.violeta} x={960} y={150} centro size={48} />
    <Titulo t={t} t0={875.45} t1={877.5} text="THE TOWN FOUND ROOM FOR HIM" y={220} size={90} color={C.oro} borde="#2b1c14" />
    <Titulo t={t} t0={877.65} t1={880.85} text="THE LONELIEST MAN IN TOWN?" y={220} size={100} color={C.crema} />
    <Sello t={t} t0={880.9} t1={881.95} text="ABSOLUTELY." x={1480} y={880} size={100} />
    <Recap t={t} />
    <Titulo t={t} t0={888.15} t1={891.9} text="BUT THE TOWN NEEDED HIM TWICE" y={200} size={90} color={C.ambar} borde="#2b0a14" />
    <Chip t={t} t0={896.4} t1={898.3} text="IT JUST NEVER WANTED TO BE SEEN WITH HIM" color={C.noche} x={960} y={150} centro size={52} />
    <Titulo t={t} t0={898.5} t1={902.8} text="THE MAN WHO KNEW EVERYBODY BEST" y={200} size={90} color={C.oro} borde="#2b1c14" />
    <Cta t={t} />
    <Chip t={t} t0={907.0} t1={910.4} text="NEXT TIME: A SLEEPING VIKING CAMP" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
  </>
);
