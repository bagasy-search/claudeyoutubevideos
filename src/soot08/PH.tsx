import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, Chip } from "./kit";
import { Piernas, Reloj } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, Sala, NINO, OBRERO, DUENO, GenteFab } from "./mundo";
import { Gran, Cuenta, Sello, Flash, sacudon, Velo, Horror, Latigo, Lista } from "./capas";
import { Retrato } from "./piezas";
import { Persona } from "./persona";

// PARTE H · HORROR #7, TU CUERPO (650,2-718,8 s). El repaso de los seis horrores que sobreviviste → lo que la fábrica
// se lleva despacio: 14 horas de pie doblan los huesos (las piernas que se arquean) → Hebergam ante el comité de Sadler,
// que necesita ayuda para caminar → el chico de la fábrica al lado del chico del campo → el número grande de Chadwick:
// 17 contra 38 → la calle de noche, la vuelta a casa → «¿era una trampa mortal? SÍ».
export const H0 = 650.2, H1 = 718.8;

const KH: K[] = [
  [650.2, 3300, -1500, 0.32], [652.3, 2500, -380, 1.3], [658.5, 2600, -380, 1.35], [660.5, 2800, -400, 1.25], [666.4, 2600, -420, 1.1], [673.6, 2600, -420, 1.15],
  [673.61, 300, -600, 0.62], [677.9, 500, -580, 0.75], [680.6, 820, -520, 1.1], [683.8, 820, -520, 1.15], [691.3, 700, -560, 0.9],
  [691.31, -1500, -420, 0.85], [699.5, -1200, -420, 0.9], [711.3, -900, -420, 0.9],
  [711.31, 300, -380, 1.3], [716.0, -900, -380, 1.35], [718.8, -1110, -430, 1.3],
];
const seg = (t: number) => (t < 673.61 ? "fab" : t < 691.31 ? "sala" : t < 711.31 ? "calle" : "noche");

const Muleta: React.FC = () => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
    <line x1={0} y1={-60} x2={6} y2={150} stroke="#8a5a2c" strokeWidth={10} strokeLinecap="round" />
    <line x1={-22} y1={-60} x2={22} y2={-60} stroke="#8a5a2c" strokeWidth={10} strokeLinecap="round" />
  </svg>
);

export const PH: React.FC<{ t: number }> = ({ t }) => {
  const s = seg(t);
  const cam = camara(t, KH);
  const sh = sacudon(t, [717.55]);
  const dobla = prog(t, 666.4, 672.2);
  const g0: GenteFab[] = [];
  if (s === "fab") g0.push({ seed: 2, x: 2700, y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: t > 658.5 ? "triste" : "neutro", inclina: 12 * prog(t, 670.5, 672.2), ladea: 6 * dobla, mira: 1 });
  const gS: GenteFab[] = [
    ...[-1150, -850, -560, -260].map((x, i) => ({ seed: 70 + i, x, y: -170, h: 470, ropa: DUENO, gorro: "copa" as const, barba: i % 2 === 0, expr: (t > 680.6 ? "sorpresa" : "neutro") as GenteFab["expr"], mira: 1 })),
    { seed: 78, x: interpolate(t, [674, 679.5], [1500, 800], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), y: -200, h: 480, ropa: OBRERO(2), flip: true, camina: t > 674 && t < 679.5 ? 0.6 : 0, expr: "triste", inclina: 10, bI: 8, manoI: <Muleta />, habla: t > 680.6 && t < 683.6 && Math.floor(t * 3) % 2 === 0 },
    { seed: 79, x: interpolate(t, [674, 679.5], [1760, 1060], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), y: -200, h: 500, ropa: OBRERO(5), gorro: "gorra", flip: true, camina: t > 674 && t < 679.5 ? 0.6 : 0, expr: "triste", bD: 60, cD: 40 },
  ];
  const gP: GenteFab[] = [];
  if (s === "calle") {
    // calle apretada: chicos chicos, ropa colgada, gente por todos lados
    [-2700, -2350, -1950, -1600, -1250, -900, -520, -150].forEach((x, i) => gP.push({ seed: 110 + i, x, y: 0, h: i % 3 === 0 ? 200 : 300 + (i % 2) * 150, ropa: OBRERO(i), gorro: i % 2 ? "cofia" : undefined, largo: i % 2 === 1, expr: "triste", camina: i % 4 === 1 ? 0.8 : 0, flip: i % 2 === 0 }));
  }
  if (s === "noche") gP.push({ seed: 2, x: interpolate(t, [711.4, 716.6], [700, -1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), y: 0, h: 300, ropa: NINO, gorro: "gorra", flip: true, camina: t < 716.6 ? 1.0 : 0, expr: "triste", inclina: 8 });
  const afuera = s === "calle" || s === "noche";
  const luz = s === "noche" ? 0.02 : 1.7;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {s === "sala" ? (
        <>
          <AbsoluteFill style={{ background: "#2d1b4a" }} />
          <Espacio cam={cam}><Sala t={t} gente={gS} /></Espacio>
        </>
      ) : (
        <>
          <CieloHora t={t} luz={luz} />
          <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} /></div></Espacio>
          <Espacio cam={cam}>
            <Pueblo t={t} e={{ abre: afuera ? 0 : 1, hora: s === "noche" ? 21 : 13, luz: s === "noche" ? 0.02 : 1.8, porton: 1, gente: gP, luzCasa: 1 }} adentro={{ gente: g0 }} />
            {/* ropa colgada entre las casas */}
            {s === "calle" && (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                <path d="M -3000 -640 Q -1900 -520 -800 -640" stroke="#2a1530" strokeWidth={5} fill="none" />
                {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-2900 + i * 230} y={-610 + Math.sin(i) * 10} width={110} height={130 + (i % 3) * 30} rx={10} fill={["#c9b9a6", "#8a8494", "#b4876a"][i % 3]} transform={`rotate(${Math.sin(t * 2 + i) * 4} ${-2845 + i * 230} -610)`} />)}
              </svg>
            )}
          </Espacio>
        </>
      )}

      {/* ── capas de pantalla ── */}
      <Latigo t={t} at={[650.25, 673.61, 691.31, 711.31]} />
      <Horror t={t} t0={650.25} n={7} nombre="YOUR BODY" t1={652.1} />
      <Lista t={t} t0={652.4} t1={658.3} x={90} y={150} titulo="YOU SURVIVED…" size={52} items={[
        { txt: "THE CLOCK", t0: 653.6, ok: true }, { txt: "THE MACHINE", t0: 654.4, ok: true }, { txt: "THE DUST", t0: 655.2, ok: true },
        { txt: "THE FINES", t0: 655.9, ok: true }, { txt: "THE STRAP", t0: 656.6, ok: true }, { txt: "THE GEARS", t0: 657.6, ok: true },
      ]} />
      <Chip t={t} t0={658.6} t1={660.4} text="THE FACTORY STILL TAKES SOMETHING" color={C.rojo} x={960} y={150} centro size={62} />
      {t > 660.5 && t < 666.3 && <div style={{ position: "absolute", left: 1500, top: 180, transform: `scale(${ent(t, 660.6) * (1 - prog(t, 666, 666.3))})` }}><div style={{ position: "relative" }}><Reloj x={0} y={420} s={0.8} hora={6 + prog(t, 660.8, 665.6) * 14} /></div></div>}
      <Cuenta t={t} t0={661.0} t1={665.0} de={0} a={14} suf=" HOURS STANDING" x={960} y={210} size={84} color={C.ambar} fuera={666.2} />
      <Chip t={t} t0={663.0} t1={666.2} text="WHILE YOUR BONES ARE STILL GROWING" color={C.noche} x={960} y={950} centro size={58} />
      {t > 666.4 && t < 673.5 && <Velo t={t} t0={666.4} t1={673.4} op={0.45} />}
      {t > 666.4 && t < 673.5 && <Piernas t={t} t0={666.5} x={1420} y={960} s={1.25} dobla={dobla} />}
      <Chip t={t} t0={666.5} t1={673.4} text="“FACTORY CRIPPLES”" color={C.rojo} x={960} y={150} centro size={72} />
      <Chip t={t} t0={668.6} t1={673.4} text="KNEES TURNED IN" color={C.violeta} x={500} y={460} centro size={56} />
      <Chip t={t} t0={670.2} t1={673.4} text="LEGS BOWED OUT" color={C.violeta} x={500} y={600} centro size={56} />
      <Chip t={t} t0={672.2} t1={673.4} text="SPINES CURVED" color={C.violeta} x={500} y={740} centro size={56} />
      <Retrato t={t} t0={673.8} t1={680.4} x={380} y={480} g={{ seed: 78, ropa: OBRERO(2), expr: "triste" }} nombre="JOSEPH HEBERGAM" sub="BEFORE THE SADLER COMMITTEE" s={1.0} />
      <Chip t={t} t0={679.0} t1={680.5} text="STARTED WORK AT 7" color={C.oro} tinta={C.noche} x={1200} y={150} centro size={64} />
      <Chip t={t} t0={680.7} t1={683.8} text="NOW HE NEEDS HELP TO WALK" color={C.rojo} x={960} y={150} centro size={66} />
      {/* el chico de la fábrica al lado del chico del campo */}
      {t > 683.9 && t < 691.2 && (
        <>
          <Velo t={t} t0={683.9} t1={691.1} op={0.9} />
          <div style={{ position: "absolute", left: 560, top: 260, width: 8, height: 680, background: "#fff3d6", opacity: 0.35 }} />
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: 550, top: 930 - i * 130, width: 28, height: 4, background: "#fff3d6", opacity: 0.4 }} />)}
          <Persona t={t} seed={2} x={800} y={930} h={500} ropa={{ ...NINO, piel: "#f1e4da" }} gorro="gorra" expr="triste" viejo={t > 689} aparece={684} />
          <Persona t={t} seed={140} x={1300} y={930} h={640} ropa={{ ...NINO, piel: "#c98b5e", tunica: "#6aa84f", tunica2: "#4b7d35" }} expr="feliz" aparece={684.3} />
          <Chip t={t} t0={684.2} t1={691.1} text="MILL CHILD" color={C.rojo} x={800} y={1000} centro size={44} />
          <Chip t={t} t0={684.5} t1={691.1} text="FIELD CHILD" color={C.lima} tinta={C.noche} x={1300} y={1000} centro size={44} />
        </>
      )}
      <Chip t={t} t0={684.0} t1={688.8} text="SHORTER · THINNER · PALER" color={C.noche} x={960} y={150} centro size={66} />
      <Chip t={t} t0={689.0} t1={691.2} text="“THEY LOOKED OLD”" color={C.violeta} x={960} y={150} centro size={72} />
      <Gran t={t} t0={691.4} t1={693.0} text="THE BIG NUMBER" y={540} size={140} color={C.ambar} />
      <Retrato t={t} t0={693.2} t1={699.4} x={1460} y={470} g={{ seed: 141, ropa: DUENO, gorro: "copa", expr: "neutro" }} nombre="EDWIN CHADWICK" sub="REPORT · 1842" s={0.9} />
      <Chip t={t} t0={693.3} t1={699.4} text="HOW THE WORKING POOR LIVED" color={C.noche} x={700} y={150} centro size={60} />
      {t > 699.5 && t < 711.2 && (
        <>
          <Velo t={t} t0={699.5} t1={711.1} op={0.72} />
          <Chip t={t} t0={699.6} t1={711.1} text="MANCHESTER · AVERAGE AGE AT DEATH" color={C.oro} tinta={C.noche} x={960} y={130} centro size={56} />
          {/* barras: obreros 17 contra gentry 38 */}
          <div style={{ position: "absolute", left: 420, top: 820 - 12 * 17 * prog(t, 699.8, 701.6), width: 360, height: 12 * 17 * prog(t, 699.8, 701.6), background: C.rojo, borderRadius: "16px 16px 0 0" }} />
          {t > 704.3 && <div style={{ position: "absolute", left: 1140, top: 820 - 12 * 38 * prog(t, 704.4, 704.9), width: 360, height: 12 * 38 * prog(t, 704.4, 704.9), background: C.lima, borderRadius: "16px 16px 0 0" }} />}
          <div style={{ position: "absolute", left: 340, top: 820, width: 1240, height: 10, background: "#fff3d6" }} />
          <Chip t={t} t0={699.7} t1={711.1} text="LABOURERS' FAMILIES" color={C.rojo} x={600} y={880} centro size={44} />
          <Chip t={t} t0={704.4} t1={711.1} text="GENTRY" color={C.lima} tinta={C.noche} x={1320} y={880} centro size={44} />
        </>
      )}
      <Cuenta t={t} t0={699.8} t1={701.6} de={0} a={17} x={600} y={480} size={150} color={C.rojo} fuera={711.1} />
      <Cuenta t={t} t0={704.4} t1={704.9} de={0} a={38} x={1320} y={260} size={150} color={C.lima} fuera={711.1} />
      <Chip t={t} t0={706.3} t1={711.1} text="MOSTLY BABIES & SMALL CHILDREN" color={C.violeta} x={960} y={1010} centro size={52} />
      <Chip t={t} t0={711.5} t1={714.0} text="THE WORLD YOU CAME HOME TO" color={C.noche} x={960} y={150} centro size={62} />
      <Gran t={t} t0={714.2} t1={717.4} text="A DEATH TRAP FOR A CHILD?" y={200} size={110} color={C.crema} />
      <Flash t={t} at={[717.55]} />
      <Sello t={t} t0={717.55} t1={718.7} text="YES. IT WAS." x={960} y={540} size={170} />
    </AbsoluteFill>
  );
};
