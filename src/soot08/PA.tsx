import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, fontFamily, Chip, Emote, Pan, Particulas, Rayos } from "./kit";
import { Persona } from "./persona";
import { Reloj, Termometro, Moneda3, Rosbif, V, T, Carta } from "./kit3";
import { Espacio, camara, K, CieloHora, Horizonte, Pueblo, CasaAdentro, NINO, NINA, HILANDERO, OBRERO, CAPATAZ, GenteFab, FCX, mulaVaiven } from "./mundo";
import { Mini0 } from "./Mini0";
import { Gran, Cuenta, Sello, Tachado, Lista, Carretes, Flash, sacudon, Velo } from "./capas";
import { Primer } from "./piezas";

// PARTE A · gancho y premisa (0-81,3 s). Un solo pueblo: la calle de noche → el reloj → el portón que se cierra →
// la cámara se zambulle por el portón y la fachada se abre (casa de muñecas) → la fábrica entera en el pueblo →
// la casa del chico → el mapa de los 7 horrores dibujado SOBRE la fábrica → la carta que viene de 4.000 millas.
export const A0 = 0, A1 = 81.3;

// el chico corre por la calle hasta el portón
const chicoX = (t: number) => interpolate(t, [0, 3.9], [2150, 3180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const KA: K[] = [
  [0, 2300, -330, 1.75], [1.5, 2800, -380, 1.6],
  [2.05, FCX, -3440, 1.5], [3.4, FCX, -3440, 1.85],
  [3.85, 3380, -420, 1.25], [6.5, 3420, -400, 1.3], [8.0, 3560, -330, 1.75], [10.5, 3380, -380, 1.35], [13.3, 3500, -330, 1.3],
  [14.05, FCX, -330, 5.2], [14.7, 2850, -440, 1.6], [17.9, 2800, -440, 1.65], [18.8, 3300, -420, 1.55], [23.6, 3200, -420, 1.7],
  [25.3, 2300, -1900, 0.31], [27.9, 2100, -2100, 0.27], [30.4, 1900, -2600, 0.2], [32.2, 1900, -700, 0.6], [34.4, 2400, -420, 0.95],
  [35.2, 3150, -380, 1.3], [36.3, 3100, -420, 0.95], [38.6, 3100, -300, 1.1], [40.6, 3700, -560, 1.7], [43.4, 3000, -420, 1.15],
  [45.7, 2800, -460, 1.05], [48.5, 2850, -460, 1.1], [49.4, 3300, -470, 1.5], [51.0, 3300, -470, 1.55],
  [51.9, -1110, -420, 1.0], [52.8, -1175, -395, 7.5],
];
// adentro de la casa (otro espacio: entramos por la ventana del cuarto y salimos por la misma)
const KC: K[] = [[52.8, 610, -660, 4.2], [53.6, 0, -470, 1.25], [56.0, 80, -460, 1.3], [58.4, 240, -450, 1.32], [61.5, 380, -470, 1.3], [63.3, 610, -660, 1.4], [64.3, 610, -660, 5.0]];
// afuera otra vez: de la ventana a la fábrica abierta con el mapa de los 7, y de ahí al horizonte
const KB: K[] = [[64.3, -1175, -395, 5.5], [65.4, -600, -900, 0.9], [67.4, 1600, -1700, 0.33], [72.6, 2300, -1750, 0.27], [75.6, 2250, -1800, 0.25], [78.9, 2400, -1800, 0.27], [79.6, 3500, -420, 1.15], [81.3, 3500, -400, 1.3]];

// los 7 horrores marcados sobre la fábrica abierta (piso, x, y)
const MARCAS: [number, number, string][] = [[FCX, -3440, "THE CLOCK"], [3300, -420, "THE MACHINE"], [1800, -1500, "THE AIR"], [4400, -1600, "THE FINES"], [5550, -420, "THE STRAP"], [2400, -2400, "THE ACCIDENT"], [-1110, -500, "YOUR BODY"]];

export const PA: React.FC<{ t: number }> = ({ t }) => {
  const enCasa = t >= 52.8 && t < 64.3;
  const cam = t < 52.8 ? camara(t, KA) : enCasa ? camara(t, KC) : camara(t, KB);
  const abre = t < 13.6 ? 0 : t < 23.7 ? prog(t, 13.6, 14.1) : t < 35.6 ? 1 - prog(t, 23.7, 24.6) : t < 51.1 ? prog(t, 35.6, 36.2) : t < 64.3 ? 1 - prog(t, 51.1, 51.6) : prog(t, 66.2, 67.4);
  const porton = t < 3.6 ? 1 : t < 13.2 ? 1 - prog(t, 3.6, 3.85) : 1;
  const hora = t < 4.6 ? 5.5 : 5.5 + prog(t, 5.3, 6.2) * (2 / 60);
  const sh = sacudon(t, [3.9, 4.2, 22.96]);
  // gente del pueblo: el chico, la fila de chicos al amanecer, los de adentro
  const gente: GenteFab[] = [];
  if (t < 13.6) gente.push({ seed: 1, x: chicoX(t), y: 0, h: 300, ropa: NINO, gorro: "gorra", expr: t < 3.9 ? "miedo" : t < 5.1 ? "sorpresa" : "triste", camina: t < 3.9 ? 2.4 : 0, inclina: t < 3.9 ? 8 : 0, bD: t > 4.2 && t < 6 ? 120 : undefined, cD: 40, mira: t > 4 ? 1 : 0 });
  if (t > 30 && t < 36) for (let i = 0; i < 9; i++) gente.push({ seed: 40 + i, x: interpolate(t, [30, 36], [-200 + i * 330, 900 + i * 330]), y: 10 + (i % 2) * 14, h: 250 + (i % 3) * 22, ropa: i % 3 ? OBRERO(i) : i % 2 ? NINA : NINO, gorro: i % 3 === 1 ? "cofia" : "gorra", largo: i % 3 === 1, camina: 1.7, expr: i % 2 ? "triste" : "neutro" });
  const adentro: GenteFab[] = [
    { seed: 2, x: t < 38.7 ? 2700 : t < 40.6 ? interpolate(t, [38.7, 40.4], [2700, 3050]) : 2800, y: t > 38.7 && t < 40.6 ? 60 : 0, h: 300, ropa: NINO, gorro: "gorra", expr: t < 20 ? "miedo" : t < 23.7 ? "triste" : t < 45 ? "neutro" : "triste", inclina: t > 38.7 && t < 40.6 ? 78 : 0, bD: t > 40.6 && t < 43 ? 150 : undefined, cD: 60, mira: 1 },
    { seed: 3, x: 4300, y: 0, h: 470, ropa: HILANDERO, expr: t > 43.5 && t < 45 ? "enojado" : "neutro", habla: t > 43.5 && t < 45, flip: true, bD: 30 },
    { seed: 4, x: 1900, y: 0, h: 290, ropa: NINA, gorro: "cofia", largo: true, expr: "triste", camina: 0.6 },
  ];
  const casa: GenteFab[] = [
    { seed: 20, x: -560, y: -40, h: 520, ropa: OBRERO(1), expr: t < 57 ? "triste" : "neutro", habla: t > 57 && t < 58.4 },
    { seed: 21, x: -200, y: -40, h: 490, ropa: OBRERO(4), largo: true, gorro: "cofia", expr: "triste", flip: true },
    { seed: 22, x: 200, y: -20, h: 330, ropa: NINO, expr: t > 60.6 && t < 62.1 ? "triste" : t > 62.6 ? "orgullo" : "neutro", gorro: t > 62.6 ? "gorra" : undefined, aparece: undefined, salta: 62.6 },
  ];
  const yb = 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {!enCasa ? (
        <>
          <CieloHora t={t} luz={interpolate(t, [0, 24, 30, 81], [0.05, 0.25, 0.75, 0.5], { extrapolateRight: "clamp" })} />
          <Espacio cam={cam} para={0.35}><div style={{ position: "absolute", left: 0, top: yb - 300 }}><Horizonte t={t} /></div></Espacio>
          <Espacio cam={cam}>
            <Pueblo t={t} e={{ abre, hora, tCampana: t < 30 ? 7.4 : 79.5, porton, luzCasa: t > 64 ? 1 : 0.6 }} adentro={{ gente: adentro, calor: t > 15.9 && t < 24 ? prog(t, 15.9, 17) : 0, corta: t > 40.6 && t < 41.9 ? [10, 11] : [], mulaU: t > 18 && t < 23.7 ? (x) => mulaVaiven(x, 2.4) : undefined }} />
            {gente.map((g) => <Persona key={g.seed} t={t} {...g} />)}
            {/* el mapa de los 7 horrores dibujado sobre la fábrica abierta */}
            {t > 67.4 && t < 79.6 && (
              <svg style={{ position: "absolute", left: -2000, top: -4200, overflow: "visible", pointerEvents: "none" }} width={10000} height={5000}>
                <path d={`M ${-1110 + 2000} ${-300 + 4200} ` + MARCAS.map(([x, y]) => `L ${x + 2000} ${y + 4200}`).join(" ")} stroke="#fff" strokeWidth={30} strokeDasharray="60 40" fill="none" pathLength={1000} style={{ strokeDasharray: `${prog(t, 67.6, 72.6) * 1000} 1000` }} opacity={0.9} />
                {MARCAS.map(([x, y, n], i) => {
                  const t0 = 68.6 + i * 0.5;
                  if (t < t0) return null;
                  const e = ent(t, t0, 0, { damping: 9, stiffness: 190 });
                  return (
                    <g key={n} transform={`translate(${x + 2000} ${y + 4200}) scale(${e * 3.4})`}>
                      <circle r={60} fill={C.rojo} stroke="#fff" strokeWidth={12} />
                      <text y={24} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff">{i + 1}</text>
                      <rect x={-200} y={78} width={400} height={74} rx={20} fill={C.noche} />
                      <text y={132} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#fff">{n}</text>
                    </g>
                  );
                })}
              </svg>
            )}
          </Espacio>
        </>
      ) : (
        <>
          <AbsoluteFill style={{ background: "#2a1830" }} />
          <Espacio cam={cam}>
            <CasaAdentro t={t} gente={casa} />
            {/* monedas en la mesa y el pan */}
            {t > 54.9 && [0, 1, 2, 3].map((i) => <Moneda3 key={i} t={t} t0={54.9 + i * 0.22} x={560 + i * 70} y={-370} s={0.38} txt="d" oro />)}
            {t > 58.5 && [0, 1].map((i) => <Moneda3 key={`s${i}`} t={t} t0={58.6 + i * 0.25} x={860 + i * 70} y={-370} s={0.42} txt="1s" t1={61.2} />)}
            {t > 60.3 && t < 61.25 && <Pan x={700} y={-420} s={1.2 * ent(t, 60.3)} />}
          </Espacio>
        </>
      )}

      {/* cuadro 0 = la miniatura en código, que cobra vida y se zambulle en el reloj de la torre */}
      <Mini0 t={t} />
      {/* primeros planos: el chico grande actuando en los planos anchos */}
      <Primer t={t} t0={24.7} t1={30.3} lado="izq" g={{ expr: "miedo", miraY: -1 }} />
      <Primer t={t} t0={64.5} t1={67.3} lado="izq" g={{ expr: "triste", camina: 1.3 }} />
      {/* ── capas de pantalla ── */}
      <Chip t={t} t0={0.12} t1={1.5} text="AGE 9" color={C.rojo} x={960} y={170} centro size={150} />
      <Chip t={t} t0={2.2} t1={3.4} text="5:30 AM" color={C.violeta} x={960} y={950} centro size={96} />
      <Flash t={t} at={[3.9, 4.2, 22.96]} />
      <Sello t={t} t0={4.2} t1={6.4} text="FINED" x={960} y={430} size={190} />
      {t > 5.1 && t < 8.4 && (
        <>
          <div style={{ position: "absolute", left: 1640, top: 260, transform: `translate(-50%,-50%) scale(${ent(t, 5.14) * (1 - prog(t, 8.1, 8.4))})` }}><div style={{ position: "relative", width: 1, height: 1 }}><Reloj x={0} y={200} s={0.8} hora={hora} /></div></div>
          <Chip t={t} t0={5.5} t1={8.1} text="+2 MINUTES" color={C.rojo} x={1640} y={520} centro size={64} />
        </>
      )}
      {/* candado */}
      {t > 7.1 && t < 10.5 && (
        <svg style={{ position: "absolute", left: 860, top: 330, transform: `scale(${ent(t, 7.1, 0, { damping: 8, stiffness: 220 }) * (1 - prog(t, 10.2, 10.5))})`, overflow: "visible" }} width={200} height={240} viewBox="0 0 200 240">
          <path d="M 50 110 L 50 70 Q 50 20 100 20 Q 150 20 150 70 L 150 110" stroke="#c8ccd4" strokeWidth={26} fill="none" />
          <rect x={20} y={100} width={160} height={130} rx={20} fill={C.oro} />
          <circle cx={100} cy={155} r={18} fill={T} /><rect x={92} y={160} width={16} height={40} fill={T} />
        </svg>
      )}
      <Chip t={t} t0={7.75} t1={10.4} text="LOCKED AT THE FIRST BELL" color={C.noche} x={960} y={140} centro size={64} />
      {/* monedas que vuelan del bolsillo a la fábrica */}
      {[0, 1, 2, 3, 4].map((i) => {
        const t0 = 8.85 + i * 0.16;
        if (t < t0 || t > t0 + 1.4) return null;
        const k = (t - t0) / 1.4;
        return <Moneda3 key={i} t={t} t0={t0} x={820 + k * 900 + i * 20} y={720 - Math.sin(k * Math.PI) * 420 - k * 300} s={0.5} txt="d" oro />;
      })}
      <Chip t={t} t0={9.2} t1={10.5} text="OUT OF YOUR WAGES" color={C.rojo} x={960} y={950} centro size={66} />
      <Chip t={t} t0={11.4} t1={13.4} text="A FEW SHILLINGS A WEEK" color={C.ambar} tinta={C.noche} x={960} y={950} centro size={72} />
      <Cuenta t={t} t0={14.2} t1={14.9} de={0} a={14} x={960} y={300} size={300} color={C.ambar} suf=" HOURS" fuera={15.8} />
      <Chip t={t} t0={15.2} t1={16.2} text="ON YOUR FEET" color={C.violeta} x={960} y={520} centro size={80} />
      {t > 16.1 && t < 18.2 && <div style={{ position: "absolute", left: 1560, top: 170, transform: `scale(${ent(t, 16.1)})` }}><div style={{ position: "relative" }}><Termometro x={0} y={860} s={0.95} nivel={prog(t, 16.2, 17.4) * 0.92} /></div></div>}
      <Chip t={t} t0={16.6} t1={18.2} text="HOTTER THAN SPAIN IN SUMMER" color={C.naranja} x={800} y={160} centro size={68} />
      <Chip t={t} t0={18.4} t1={19.8} text="A MACHINE THAT DOES NOT STOP" color={C.noche} x={960} y={140} centro size={70} />
      <Chip t={t} t0={20.6} t1={23.6} text="NOT FOR LUNCH" color={C.violeta} x={960} y={300} centro size={84} />
      <Chip t={t} t0={21.75} t1={23.6} text="NOT FOR TEARS" color={C.teal} tinta={C.noche} x={960} y={430} centro size={84} />
      <Emote t={t} t0={21.8} t1={23.6} tipo="lagrimas" x={960 + (2700 - cam.x) * cam.z} y={540 + (-200 - 450 * (300 / 560) - cam.y) * cam.z} s={0.55 * cam.z} />
      <Chip t={t} t0={22.9} t1={23.6} text="NOT FOR FINGERS" color={C.rojo} x={960} y={560} centro size={96} />
      <Chip t={t} t0={24.9} t1={27.6} text="LANCASHIRE, ENGLAND" color={C.violeta} x={960} y={150} centro size={76} />
      <Gran t={t} t0={26.6} t1={30.2} text="c. 1830" y={880} size={170} color={C.ambar} />
      {t > 27.9 && t < 32 && <Particulas t={t} tipo="lluviaoro" n={60} seed={5} />}
      <Chip t={t} t0={28.3} t1={32} text="THE RICHEST COUNTRY ON EARTH" color={C.oro} tinta={C.noche} x={960} y={150} centro size={74} />
      <Chip t={t} t0={30.4} t1={32} text="BUILT IN ROOMS LIKE THIS" color={C.noche} x={960} y={930} centro size={64} />
      <Velo t={t} t0={33.6} t1={35.6} op={0.5} />
      <Gran t={t} t0={33.7} t1={34.5} text="CHILDREN" y={330} size={200} color={C.crema} />
      {t > 34.5 && t < 35.5 && <Gran t={t} t0={34.58} t1={35.5} text="WHY?" y={470} size={230} color={C.rojo} />}
      <Lista t={t} t0={36.3} t1={45.7} x={110} y={110} titulo="THE PERFECT WORKER" size={54} items={[{ txt: "SMALL", t0: 38.72 }, { txt: "NIMBLE", t0: 40.78 }, { txt: "TOO YOUNG TO ARGUE", t0: 43.56 }, { txt: "CHEAP", t0: 44.94 }]} />
      <Chip t={t} t0={39.3} t1={40.6} text="FITS UNDER THE MACHINE" color={C.teal} tinta={C.noche} x={1300} y={930} centro size={60} />
      <Chip t={t} t0={41.8} t1={43.4} text="1 BROKEN THREAD · 1 SECOND" color={C.violeta} x={1250} y={930} centro size={60} />
      {/* balanza: hombre vs chico */}
      {t > 46.2 && t < 49.6 && (
        <>
          {Array.from({ length: 9 }, (_, i) => <Moneda3 key={i} t={t} t0={46.4 + i * 0.07} x={1430} y={720 - i * 52} s={0.5} txt="s" />)}
          {Array.from({ length: 2 }, (_, i) => <Moneda3 key={`c${i}`} t={t} t0={47.2 + i * 0.1} x={500} y={720 - i * 52} s={0.5} txt="s" />)}
          <Chip t={t} t0={46.4} text="GROWN MAN" color={C.noche} x={1430} y={860} centro size={56} />
          <Chip t={t} t0={47.2} text="CHILD" color={C.rojo} x={500} y={860} centro size={56} />
        </>
      )}
      <Chip t={t} t0={49.6} t1={51.0} text="THE MACHINE DOESN'T CARE" color={C.noche} x={960} y={150} centro size={70} />
      <Gran t={t} t0={51.3} t1={53.4} text="YOUR PARENTS?" y={170} size={140} />
      <Chip t={t} t0={53.5} t1={54.3} text="NOT CRUEL" color={C.teal} tinta={C.noche} x={960} y={950} centro size={70} />
      <Chip t={t} t0={55.6} t1={57} text="EVERY PENNY" color={C.oro} tinta={C.noche} x={960} y={950} centro size={76} />
      <Chip t={t} t0={57.4} t1={58.4} text="DAD: WEAVER" color={C.violeta} x={420} y={170} centro size={60} />
      <Chip t={t} t0={60.36} t1={61.2} text="EATING" color={C.lima} tinta={C.noche} x={960} y={170} centro size={80} />
      <Chip t={t} t0={61.2} t1={62.1} text="NOT EATING" color={C.rojo} x={960} y={170} centro size={80} />
      <Tachado t={t} t0={61.25} t1={62.1} x={960} y={420} w={420} h={300} />
      <Sello t={t} t0={63.6} t1={64.3} text="HIRED" x={960} y={300} size={170} color={C.lima} rot={8} />
      <Chip t={t} t0={65.3} t1={67.4} text="ONE WORKING LIFE" color={C.violeta} x={960} y={140} centro size={74} />
      <Chip t={t} t0={68.7} t1={71.6} text="EVERY WAY IT TRIES TO BREAK YOU" color={C.rojo} x={960} y={140} centro size={66} />
      <Carretes t={t} t0={71.8} t1={73.6} n={7} y={940} s={0.95} />
      <Gran t={t} t0={71.9} t1={73.6} text="7" y={180} size={260} color={C.rojo} />
      <Velo t={t} t0={74.3} t1={79.3} op={0.5} />
      {/* la carta que viene de 4.000 millas */}
      {t > 74.4 && t < 79.4 && (() => {
        const k = prog(t, 74.4, 77.3);
        return <Carta t={t} t0={74.4} x={1780 - k * 360} y={600 + Math.sin(k * Math.PI) * -120} s={0.42 + k * 0.1} abre={0} />;
      })()}
      <Chip t={t} t0={74.6} t1={77} text="A PRESIDENT" color={C.violeta} x={960} y={140} centro size={70} />
      <Chip t={t} t0={75.5} t1={79.2} text="4,000 MILES AWAY" color={C.teal} tinta={C.noche} x={960} y={940} centro size={70} />
      <Chip t={t} t0={77.6} t1={79.2} text="WHY?" color={C.rojo} x={960} y={140} centro size={90} />
      <Velo t={t} t0={79.5} t1={81.5} op={0.25} />
      <Gran t={t} t0={79.6} t1={81.3} text="YOUR SHIFT" y={390} size={170} />
      <Gran t={t} t0={80.4} t1={81.3} text="STARTS NOW" y={590} size={190} color={C.ambar} />
    </AbsoluteFill>
  );
};
