import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, Pan, Zzz } from "./kit";
import { Reloj, Moneda3, RelojBolsillo, Retrete } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, CasaAdentro, Sala, NINO, NINA, HILANDERO, OBRERO, DUENO, GenteFab, FCX, CASA_NINO } from "./mundo";
import { Gran, Cuenta, Sello, Tachado, Flash, sacudon, Velo, Horror, BarraDia, Latigo, Semana } from "./capas";
import { Girado, Despertador, Goteras, Primer } from "./piezas";
import { Persona } from "./persona";

// PARTE B · HORROR #1, EL RELOJ (81,3-189,7 s). Mismo pueblo, de noche: el despertador con la pértiga golpea la
// ventana del chico → la campana → la fábrica se abre y la máquina de vapor arranca todo → el portón se cierra en
// la cara de una nena → la barra del día → la sala del comité (Coulson) → la casa (las nenas dormidas, cargadas) →
// los relojes trucados → la semana → de vuelta a la cama compartida, el retrete de la calle, y la pértiga OTRA VEZ.
export const B0 = 81.3, B1 = 189.7;

const WX = CASA_NINO - 65, WY = -395; // ventana de arriba del chico
const despX = (t: number) => (t < 120 ? interpolate(t, [87.6, 91.4], [-250, -880], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : interpolate(t, [186.4, 187.9], [-400, -880], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

// pueblo (afuera)
const KP: K[] = [
  [81.3, 3500, -400, 1.3], [83.6, FCX, -1700, 0.42], [85.8, -450, -520, 0.95], [88.0, -700, -430, 1.1], [91.0, -1000, -420, 1.25], [92.3, -1100, -430, 1.55], [96.0, -1050, -420, 1.4], [99.5, -1000, -460, 1.1],
  [99.95, FCX, -3600, 1.3], [101.0, FCX, -3650, 1.12], [102.6, FCX, -3700, 1.05],
  [103.4, 1350, -480, 1.15], [104.7, 2300, -520, 0.7], [106.4, 3300, -1500, 0.32], [107.4, 3300, -1300, 0.36],
  [108.2, 3250, -380, 1.15], [110.4, 3300, -380, 1.35], [113.2, 3320, -360, 1.55], [115.2, 3320, -380, 1.65],
  [116.9, FCX, -3440, 1.25], [122.4, FCX, -3440, 1.4], [123.0, FCX, -3440, 7.0],
];
// sala del comité, 1832
const KS: K[] = [[123.0, 0, -620, 2.2], [123.8, -300, -600, 0.8], [126.3, -500, -580, 0.92], [127.2, -560, -560, 1.05], [130.0, -500, -560, 1.0], [130.8, 820, -520, 1.0], [133.6, 900, -500, 1.05], [136.8, 700, -560, 0.85], [146.2, 820, -540, 0.9], [147.4, 900, -500, 1.1]];
// casa de noche: las nenas cargadas a la cama
const KC1: K[] = [[147.4, 100, -500, 1.3], [148.2, 100, -500, 0.9], [150.6, -300, -460, 1.1], [152.3, -420, -420, 1.55], [153.8, -420, -420, 1.7]];
// pueblo de día: los relojes trucados, la semana
const KD: K[] = [[153.8, FCX, -3440, 1.0], [155.0, FCX, -3440, 1.45], [156.9, FCX, -3440, 1.5], [157.4, FCX, -1700, 0.5], [165.6, FCX, -1600, 0.55], [166.4, FCX, -3300, 1.0], [169.8, FCX, -2400, 0.55], [173.8, 2400, -1400, 0.36], [174.6, -1110, -420, 1.0], [175.6, WX, WY, 7.5]];
// la cama compartida en el sótano
const KC2: K[] = [[175.6, 610, -660, 4.2], [176.4, -100, -500, 0.95], [179.4, -500, -470, 1.15], [181.8, -300, -500, 1.0], [182.4, 610, -660, 4.5]];
// afuera: el retrete de toda la calle y la pértiga otra vez
const KF: K[] = [[182.4, WX, WY, 5.5], [183.3, -2700, -420, 0.8], [185.0, -2500, -440, 0.85], [186.3, -1300, -440, 1.05], [188.2, -1120, -420, 1.45], [189.7, -1100, -420, 1.65]];

const tramo = (t: number) => (t < 123 ? "P" : t < 147.4 ? "S" : t < 153.8 ? "C1" : t < 175.6 ? "D" : t < 182.4 ? "C2" : "F");

export const PB: React.FC<{ t: number }> = ({ t }) => {
  const z = tramo(t);
  const cam = z === "P" ? camara(t, KP) : z === "S" ? camara(t, KS) : z === "C1" ? camara(t, KC1) : z === "D" ? camara(t, KD) : z === "C2" ? camara(t, KC2) : camara(t, KF);
  const sh = sacudon(t, [101.3, 103.4, 108.75, 110.1, 165.1]);
  const abre = t < 102.8 ? 0 : t < 107.2 ? prog(t, 102.8, 103.4) : 1 - prog(t, 107.2, 107.8);
  const porton = t < 108.55 ? 1 : 1 - prog(t, 108.55, 108.8);
  // la hora del reloj de la fábrica
  const hora = t < 99 ? 4.8 : t < 116 ? 5.5 + prog(t, 99, 99.8) * 0 + prog(t, 103, 108) * 0.5 : t < 123 ? 6 + prog(t, 117, 121.6) * 16.5 : t < 160 ? 6 + prog(t, 159.4, 160.0) * 0.33 : 19 - prog(t, 161.6, 162.3) * 0.33;
  // luz: noche (0) → amanecer (1) → día con humo (2)
  const luz = z === "P" ? (t < 103 ? 0.05 : t < 116 ? 0.05 + prog(t, 103, 112) * 0.6 : 0.8) : z === "D" ? (t < 173.8 ? 1.9 : 1.9 - prog(t, 173.8, 174.6) * 1.85) : 0.05;

  // gente del pueblo
  const gP: GenteFab[] = [];
  // la nena que llega tarde al portón
  if (t > 106.9 && t < 116) gP.push({ seed: 31, x: interpolate(t, [106.9, 108.7], [2300, 3260], { extrapolateRight: "clamp" }), y: 0, h: 290, ropa: NINA, gorro: "cofia", largo: true, camina: t < 108.7 ? 2.6 : 0, inclina: t < 108.7 ? 9 : 0, expr: t < 108.6 ? "miedo" : t < 110 ? "sorpresa" : "triste", bD: t > 108.8 && t < 110.4 ? 150 : 0, cD: 30, mira: 1, salta: 108.75 });
  // fila del retrete
  if (z === "F" && t < 186.5) for (let i = 0; i < 7; i++) gP.push({ seed: 60 + i, x: -3150 + i * 150, y: 6, h: i % 3 === 0 ? 300 : 440 + (i % 2) * 30, ropa: i % 3 === 0 ? (i % 2 ? NINA : NINO) : OBRERO(i), gorro: i % 3 === 1 ? "cofia" : "gorra", largo: i % 3 === 1, flip: true, expr: i === 0 ? "enojado" : "triste", camina: 0 });

  // sala: comité + testigo + sus hijas
  const gS: GenteFab[] = [
    ...[-1150, -850, -560, -260].map((x, i) => ({ seed: 70 + i, x, y: -170, h: 470, ropa: DUENO, gorro: "copa" as const, barba: i % 2 === 0, expr: (t > 137 && t < 146 ? "sorpresa" : "neutro") as GenteFab["expr"], habla: i === 2 && t > 126.5 && t < 129.6, mira: 1 })),
    { seed: 75, x: 820, y: -200, h: 500, ropa: HILANDERO, gorro: "gorra", flip: true, expr: t < 148 && t > 149 ? "neutro" : "triste", habla: t > 133 && t < 146, bD: t > 140.5 && t < 142.5 ? 60 : 0, mira: -1 },
    { seed: 76, x: 1080, y: -200, h: 290, ropa: NINA, gorro: "cofia", largo: true, flip: true, expr: "dormido", aparece: 132.2 },
    { seed: 77, x: 1260, y: -200, h: 250, ropa: NINA, largo: true, flip: true, expr: "dormido", aparece: 132.5 },
  ];
  // casa: el padre carga a la nena dormida hasta la cama
  const padreX = interpolate(t, [147.8, 150.6], [700, -260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const madreX = interpolate(t, [148.4, 151.2], [1000, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gC1: GenteFab[] = [
    { seed: 80, x: padreX, y: -40, h: 520, ropa: OBRERO(1), camina: t < 150.6 ? 1.2 : 0, flip: true, bD: 70, cD: 50, bI: 70, cI: 50, expr: "triste" },
    { seed: 81, x: madreX, y: -40, h: 490, ropa: OBRERO(4), gorro: "cofia", largo: true, camina: t < 151.2 ? 1.2 : 0, flip: true, bD: 70, cD: 50, bI: 70, cI: 50, expr: "triste" },
  ];
  const nenaEnBrazos = t < 150.8;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {z === "P" || z === "D" || z === "F" ? (
        <>
          <CieloHora t={t} luz={luz} />
          <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: -300 }}><Horizonte t={t} /></div></Espacio>
          <Espacio cam={cam}>
            <Pueblo t={t} e={{ abre, hora, tCampana: 101.3, porton, luz, luzCasa: z === "F" ? (t > 188.6 ? 1 : 0) : 0.2 }} adentro={{ detenida: t < 103.45, vaporVel: prog(t, 103.4, 104.8) }} />
            {z === "F" && <Retrete t={t} x={-3400} y={0} s={1} />}
            {(z === "P" && t < 100) && <Despertador t={t} x={despX(t)} wx={WX} wy={WY} golpe={92.1} camina={t < 91.4 ? 1.4 : 0} />}
            {(z === "F" && t > 186.2) && <Despertador t={t} x={despX(t)} wx={WX} wy={WY} golpe={188.0} camina={t < 187.9 ? 1.4 : 0} />}
            {gP.map((g) => <Persona key={g.seed} t={t} {...g} />)}
            {/* monedas a la mano del despertador */}
            {z === "P" && t > 96.3 && t < 99.4 && [0, 1, 2].map((i) => <Moneda3 key={i} t={t} t0={96.4 + i * 0.18} x={-760 + i * 46} y={-560 - i * 30} s={0.32} txt="d" oro t1={99.2} />)}
            {z === "F" && t > 183.4 && t < 186.2 && <Emote t={t} t0={183.5} tipo="enojo" x={-3150} y={-260} s={0.7} />}
          </Espacio>
        </>
      ) : z === "S" ? (
        <>
          <AbsoluteFill style={{ background: "#2d1b4a" }} />
          <Espacio cam={cam}><Sala t={t} gente={gS} /></Espacio>
        </>
      ) : (
        <>
          <AbsoluteFill style={{ background: "#2a1830" }} />
          <Espacio cam={cam}>
            {z === "C1" ? (
              <>
                <CasaAdentro t={t} gente={gC1} />
                {/* la nena dormida en brazos del padre y después en la cama, con el pan en la boca */}
                <Girado t={t} rot={nenaEnBrazos ? -78 : -90} g={nenaEnBrazos ? { seed: 82, x: padreX - 140, y: -250, h: 280, ropa: NINA, largo: true, expr: "dormido" } : { seed: 82, x: -700, y: -330, h: 280, ropa: NINA, largo: true, expr: "dormido" }} />
                <Girado t={t} rot={t < 151.4 ? -78 : -90} g={t < 151.4 ? { seed: 83, x: madreX - 140, y: -250, h: 250, ropa: NINA, gorro: "cofia", expr: "dormido" } : { seed: 83, x: -420, y: -330, h: 250, ropa: NINA, gorro: "cofia", expr: "dormido" }} />
                {t > 151.6 && <div style={{ position: "absolute", left: -985, top: -372 }}><Pan x={0} y={0} s={0.28 * ent(t, 151.7)} /></div>}
                {t > 151.0 && <Zzz x={-560} y={-560} t={t} />}
              </>
            ) : (
              <>
                <CasaAdentro t={t} vela={0.6} />
                <Goteras t={t} x={-1380} y={-1080} w={2700} h={700} n={16} op={t > 180.2 ? prog(t, 180.2, 180.8) : 0.25} />
                {[0, 1, 2].map((i) => <Girado key={i} t={t} rot={-90} g={{ seed: 85 + i, x: -900 + i * 330, y: -330, h: i === 1 ? 300 : 320, ropa: i === 1 ? NINO : { ...NINO, tunica: ["#8a5a2c", "", "#5e6b3a"][i], tunica2: "#3b2616" }, gorro: undefined, expr: t > 177 && i === 1 ? "triste" : "dormido", aparece: i === 1 ? undefined : 179.2 + (i ? 0.2 : 0) }} />)}
                {t > 177 && <Zzz x={-360} y={-560} t={t} />}
              </>
            )}
          </Espacio>
        </>
      )}

      {/* ── capas de pantalla ── */}
      <Horror t={t} t0={81.32} n={1} nombre="THE CLOCK" t1={83.7} />
      <Chip t={t} t0={84.0} t1={86.8} text="BEFORE THE SUN" color={C.violeta} x={960} y={150} centro size={76} />
      <Chip t={t} t0={88.1} t1={91.0} text="THE KNOCKER-UP" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={86} />
      <Chip t={t} t0={91.1} t1={92.0} text="A LONG POLE" color={C.noche} x={960} y={950} centro size={66} />
      <Chip t={t} t0={92.2} t1={94.1} text="TAP · TAP · TAP" color={C.rojo} x={960} y={950} centro size={80} />
      <Chip t={t} t0={94.2} t1={96.3} text="NOBODY OVERSLEEPS" color={C.violeta} x={960} y={150} centro size={72} />
      <Chip t={t} t0={96.5} t1={98.4} text="A FEW PENNIES A WEEK" color={C.oro} tinta={C.noche} x={960} y={950} centro size={70} />
      <Gran t={t} t0={98.5} t1={99.8} text="OVERSLEEPING = EXPENSIVE" y={200} size={96} color={C.rojo} />
      <Latigo t={t} at={[99.95, 103.0, 123.0, 147.4, 153.8, 174.9]} />
      <Chip t={t} t0={100.1} t1={101.2} text="5:30 AM" color={C.violeta} x={960} y={950} centro size={90} />
      <Flash t={t} at={[101.3, 103.4, 108.75]} />
      <Gran t={t} t0={101.35} t1={102.7} text="DONG!" y={240} size={200} color={C.oro} rot={-6} />
      <Chip t={t} t0={103.5} t1={104.6} text="6:00 · THE STEAM ENGINE" color={C.noche} x={960} y={150} centro size={70} />
      <Gran t={t} t0={104.7} t1={107.0} text="EVERY MACHINE" x={1180} y={200} size={120} color={C.ambar} />
      <Primer t={t} t0={104.75} t1={106.9} lado="izq" g={{ expr: "sorpresa", miraY: -0.6 }} emo="excl" />
      <Primer t={t} t0={154.3} t1={156.9} lado="izq" g={{ expr: "miedo", miraY: -1 }} emo="preg" />
      <Chip t={t} t0={108.6} t1={110.0} text="THE GATE IS SHUT" color={C.noche} x={960} y={150} centro size={76} />
      <Sello t={t} t0={110.1} t1={112.3} text="DOCKED" x={960} y={330} size={180} />
      {t > 111.5 && t < 115.3 && (
        <svg style={{ position: "absolute", left: 1460, top: 300, transform: `scale(${ent(t, 111.5, 0, { damping: 8, stiffness: 220 }) * (1 - prog(t, 115, 115.3))})`, overflow: "visible" }} width={200} height={240} viewBox="0 0 200 240">
          <path d="M 50 110 L 50 70 Q 50 20 100 20 Q 150 20 150 70 L 150 110" stroke="#c8ccd4" strokeWidth={26} fill="none" />
          <rect x={20} y={100} width={160} height={130} rx={20} fill={C.oro} />
          <circle cx={100} cy={155} r={18} fill="#2a1530" /><rect x={92} y={160} width={16} height={40} fill="#2a1530" />
        </svg>
      )}
      <Chip t={t} t0={112.4} t1={113.5} text="LOCKED · THE WHOLE MORNING" color={C.rojo} x={960} y={150} centro size={66} />
      <Chip t={t} t0={113.6} t1={115.3} text="LATE = LOSE HALF A DAY" color={C.ambar} tinta={C.noche} x={960} y={950} centro size={76} />
      <Gran t={t} t0={115.4} t1={117.9} text="HOW LONG IS THE DAY?" y={180} size={110} />
      <BarraDia t={t} t0={117.8} t1={122.7} y={880} titulo="ONE WORKING DAY" tramos={[
        { de: 6, a: 18, t0: 118.2, t1: 119.4, color: C.violeta, txt: "12 HOURS OF WORK" },
        { de: 18, a: 19.5, t0: 119.7, t1: 120.3, color: C.teal },
        { de: 19.5, a: 22.5, t0: 120.8, t1: 121.6, color: C.rojo },
      ]} />
      <Chip t={t} t0={119.7} t1={120.7} text="+ THE BREAKS" color={C.teal} tinta={C.noche} x={1500} y={700} centro size={56} />
      <Gran t={t} t0={121.0} t1={122.7} text="MUCH LONGER" y={200} size={140} color={C.rojo} />
      {/* 1832: la sala del comité */}
      <Gran t={t} t0={123.1} t1={125.6} text="1832" y={180} size={200} color={C.ambar} />
      <Chip t={t} t0={124.0} t1={126.3} text="A PARLIAMENTARY COMMITTEE" color={C.violeta} x={960} y={950} centro size={66} />
      <Chip t={t} t0={126.6} t1={130.2} text="MICHAEL SADLER" color={C.oro} tinta={C.noche} x={960} y={150} centro size={80} />
      <Chip t={t} t0={128.0} t1={130.2} text="ASKED WORKERS ABOUT THEIR HOURS" color={C.noche} x={960} y={950} centro size={58} />
      <Chip t={t} t0={130.5} t1={133.0} text="SAMUEL COULSON · FATHER" color={C.violeta} x={960} y={150} centro size={72} />
      <Chip t={t} t0={132.4} t1={136.6} text="HIS DAUGHTERS" color={C.teal} tinta={C.noche} x={960} y={950} centro size={66} />
      <Chip t={t} t0={133.3} t1={136.6} text="BUSY SEASON · ABOUT 6 WEEKS" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={66} />
      <Velo t={t} t0={136.7} t1={146.4} op={0.55} />
      <BarraDia t={t} t0={136.8} t1={146.4} y={880} titulo="THE COULSON GIRLS · ONE DAY" tramos={[
        { de: 3, a: 12, t0: 137.0, t1: 138.4, color: C.rojo, txt: "AT THE MILL" },
        { de: 12, a: 22.5, t0: 138.4, t1: 140.0, color: C.rojo, txt: "STILL AT THE MILL" },
        { de: 12, a: 13, t0: 143.6, t1: 145.6, color: C.lima, txt: "" },
      ]} />
      <Chip t={t} t0={137.0} t1={138.7} text="LEAVE 3:00 AM" color={C.noche} x={500} y={170} centro size={66} />
      <Chip t={t} t0={138.8} t1={146.4} text="HOME 10:30 PM" color={C.noche} x={1420} y={170} centro size={66} />
      <Cuenta t={t} t0={139.0} t1={140.4} de={0} a={19} x={960} y={420} size={190} color={C.crema} suf="½ HOURS" fuera={143.0} />
      <Chip t={t} t0={140.9} t1={143.0} text="YOUNGEST: JUST OVER 8" color={C.rojo} x={960} y={600} centro size={66} />
      <Chip t={t} t0={143.4} t1={146.4} text="ALL BREAKS: ~1 HOUR" color={C.lima} tinta={C.noche} x={960} y={620} centro size={80} />
      <Chip t={t} t0={148.0} t1={150.4} text="CARRIED TO BED" color={C.violeta} x={960} y={150} centro size={76} />
      <Chip t={t} t0={150.9} t1={153.6} text="ASLEEP" color={C.noche} x={960} y={150} centro size={86} />
      <Chip t={t} t0={152.0} t1={153.6} text="FOOD STILL IN THEIR MOUTHS" color={C.rojo} x={960} y={950} centro size={70} />
      {/* los relojes trucados */}
      <Chip t={t} t0={154.2} t1={157.0} text="THE CLOCK WASN'T ON YOUR SIDE" color={C.rojo} x={960} y={150} centro size={66} />
      {t > 157.0 && t < 166.0 && (
        <>
          <Velo t={t} t0={157} t1={165.7} op={0.62} />
          {[0, 1].map((i) => {
            const h = i === 0 ? (t < 161 ? 5.67 + prog(t, 157, 159.4) * 0.33 : 19 + prog(t, 161, 161.6) * 0.33) : hora;
            return (
              <div key={i} style={{ position: "absolute", left: i ? 1340 : 580, top: 230, transform: `translate(-50%,0) scale(${ent(t, 157.1 + i * 0.25) * (1 - prog(t, 165.7, 166))})` }}>
                <div style={{ position: "relative", width: 1, height: 1 }}><Reloj x={0} y={480} s={1.05} hora={h} marco={i ? "#7a2f3a" : "#2e2a3a"} /></div>
              </div>
            );
          })}
          <Chip t={t} t0={157.2} t1={165.7} text="REAL TIME" color={C.teal} tinta={C.noche} x={580} y={800} centro size={60} />
          <Chip t={t} t0={157.4} t1={165.7} text="MILL CLOCK" color={C.rojo} x={1340} y={800} centro size={60} />
          <Chip t={t} t0={159.4} t1={161.4} text="MORNING: MOVED FORWARD" color={C.violeta} x={960} y={950} centro size={60} />
          <Chip t={t} t0={161.6} t1={163.0} text="EVENING: MOVED BACK" color={C.violeta} x={960} y={950} centro size={60} />
          <Cuenta t={t} t0={163.2} t1={163.2} de={12} a={12} x={960} y={950} size={100} color={C.crema} pre="OFFICIAL: " suf="-HOUR DAY" fuera={164.95} />
          <Cuenta t={t} t0={165.1} t1={165.1} de={13} a={13} x={960} y={950} size={120} color={C.rojo} pre="REALLY: " suf="+ HOURS" fuera={165.7} />
        </>
      )}
      <Flash t={t} at={[165.1]} color="#ffdddd" />
      <Chip t={t} t0={166.1} t1={169.2} text="YOU COULD NOT CHECK" color={C.noche} x={960} y={150} centro size={76} />
      <RelojBolsillo t={t} t0={167.4} t1={170.0} x={960} y={540} s={1.2} />
      <Tachado t={t} t0={169.4} t1={170.0} x={960} y={540} w={360} h={360} />
      <Chip t={t} t0={168.0} t1={170.0} text="WATCHES? NOT ALLOWED" color={C.rojo} x={960} y={880} centro size={66} />
      <Semana t={t} t0={170.2} tDom={172.9} t1={174.4} y={540} />
      <Chip t={t} t0={170.3} t1={172.8} text="SIX DAYS A WEEK" color={C.rojo} x={960} y={300} centro size={80} />
      <Chip t={t} t0={172.9} t1={174.4} text="…UNLESS THE MACHINES NEED CLEANING" color={C.naranja} x={960} y={300} centro size={58} />
      <Chip t={t} t0={176.4} t1={178.3} text="NO REST EITHER" color={C.violeta} x={960} y={150} centro size={74} />
      <Chip t={t} t0={178.5} t1={180.2} text="ONE BED · THREE BOYS" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={74} />
      <Chip t={t} t0={180.4} t1={181.4} text="A DAMP CELLAR" color={C.teal} tinta={C.noche} x={960} y={950} centro size={70} />
      <Chip t={t} t0={181.5} t1={182.4} text="OR A BACK-TO-BACK HOUSE" color={C.violeta} x={960} y={950} centro size={66} />
      <Gran t={t} t0={182.9} t1={185.0} text="1 TOILET" y={180} size={170} color={C.ambar} />
      <Chip t={t} t0={183.9} t1={185.0} text="FOR THE WHOLE STREET" color={C.rojo} x={960} y={330} centro size={70} />
      <Cuenta t={t} t0={185.2} t1={185.5} de={0} a={6} x={960} y={220} size={170} color={C.crema} pre="≈" suf=" HOURS LATER" fuera={187.6} />
      <Chip t={t} t0={186.9} t1={188.0} text="THE LONG POLE" color={C.ambar} tinta={C.noche} x={960} y={950} centro size={70} />
      <Gran t={t} t0={188.0} t1={189.6} text="TAP · TAP · TAP" y={190} size={130} color={C.rojo} />
    </AbsoluteFill>
  );
};
