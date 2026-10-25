import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import type { Parte } from "./parte";
import { Svg, Isla, Humo } from "./kit3";
import { CartelTrampa, Titulo } from "./hud";
import { Persona, MARINO, CUAQUERO } from "./persona";
import { Tripulacion, Chico, Capitan, Marino, XMARINO, X_CHICO } from "./reparto";
import { EnBarco, CUBIERTA, bx, X_ISLA } from "./estado";
import { Nubarron, salidaE } from "./P2";

// 578-660 s · TRAMPA 6: EL CAPITÁN. Navegando de nuevo: el capitán crece hasta ser "la ley", se pone la
// tormenta, la ley de 1850 que tira por la borda, los castigos (sólo insinuados), y en la isla tropical los
// marineros que se escapan nadando a la selva. Después, en un espejismo del cielo, Melville: su valle, sus
// dos libros y el hombre que conoció en Nantucket. Al final la cámara se zambulle hacia el Essex.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const pz = (t: number, ks: [number, number][]) => interpolate(t, ks.map((k) => k[0]), ks.map((k) => k[1]), cl);
const DESERTA = [1, 5, 8];

// icono con tachado (sin policía, sin juez, sin diario)
const Tachado: React.FC<{ t: number; t0: number; t1: number; x: number; label: string; children: React.ReactNode }> = ({ t, t0, t1, x, label, children }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.3], [1, 0], cl);
  const tx = prog(t, t0 + 0.4, t0 + 0.7);
  return (
    <svg style={{ position: "absolute", left: x - 130, top: 330, overflow: "visible", transform: `scale(${e})` }} width={260} height={320}>
      <circle cx={130} cy={130} r={120} fill="#f4e6c4" stroke="#2a1530" strokeWidth={8} />
      <g transform="translate(130 130)">{children}</g>
      <line x1={50} y1={50} x2={50 + 160 * tx} y2={50 + 160 * tx} stroke={C.rojo} strokeWidth={20} strokeLinecap="round" />
      <text x={130} y={300} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#fff" stroke="#2a1530" strokeWidth={9} paintOrder="stroke">{label}</text>
    </svg>
  );
};
const Libro: React.FC<{ t: number; t0: number; x: number; y: number; titulo: string; col: string; ballena?: boolean }> = ({ t, t0, x, y, titulo, col, ballena }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 10, stiffness: 150 });
  return (
    <Svg x={x} y={y + Math.sin(t * 1.5 + x) * 10} s={e * 1.2} rot={-6 + Math.sin(t + x) * 3}>
      <rect x={-130} y={-180} width={260} height={360} rx={12} fill={col} stroke="#2a1530" strokeWidth={8} />
      <rect x={-130} y={-180} width={36} height={360} fill="#000" opacity={0.2} />
      <text y={-90} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#f7c548">{titulo}</text>
      <text y={150} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={24} fill="#f4e6c4">H. MELVILLE</text>
      {ballena ? <path d="M -90 40 Q -40 -30 60 -10 Q 100 0 96 30 Q 60 70 -40 60 L -80 80 L -76 50 L -110 40 Z" fill="#f4f0e8" /> : <g><path d="M -90 70 Q -40 -40 0 30 Q 40 -50 90 70 Z" fill="#46a85a" /><circle cx={50} cy={-20} r={24} fill="#f7c548" /></g>}
    </Svg>
  );
};

export const P6: Parte = {
  a: 578, b: 660,
  keys: [
    { t: 580.6, x: 200, y: -700, z: 0.42, rel: true },
    { t: 584.6, x: 100, y: -640, z: 0.46, rel: true },
    { t: 586.4, x: -480, y: -470, z: 0.8, rel: true },
    { t: 590.8, x: -470, y: -480, z: 0.8, rel: true },
    { t: 592.6, x: -250, y: -640, z: 0.5, rel: true },
    { t: 600.4, x: -200, y: -640, z: 0.52, rel: true },
    { t: 602.2, x: -480, y: -420, z: 0.85, rel: true },
    { t: 609.2, x: -300, y: -480, z: 0.7, rel: true },
    { t: 612.0, x: 600, y: -500, z: 0.36, rel: true },
    { t: 614.0, x: 1000, y: -420, z: 0.4, rel: true },
    { t: 619.6, x: 1300, y: -300, z: 0.48, rel: true },
    { t: 626.8, x: 900, y: -420, z: 0.4, rel: true },
    { t: 629.4, x: 1750, y: -1300, z: 0.95, rel: true },
    { t: 636.8, x: 1750, y: -1300, z: 1.0, rel: true },
    { t: 638.6, x: 1950, y: -1360, z: 0.9, rel: true },
    { t: 642.8, x: 1950, y: -1360, z: 0.94, rel: true },
    { t: 645.0, x: 2050, y: -1300, z: 1.05, rel: true },
    { t: 653.8, x: 2050, y: -1300, z: 1.1, rel: true },
    { t: 656.6, x: 600, y: -200, z: 0.36, rel: true },
    { t: 659.9, x: 400, y: 2700, z: 0.45, rel: true, e: "i" },
  ],
  pal: [[591.2, "tormenta", 2.5], [609.2, "dia", 3], [612.6, "tropico", 2.5], [627.2, "tarde", 4], [655.6, "abismo", 3.5]],
  mundo: (t) => {
    const x = bx(t);
    const capH = pz(t, [[584.9, 230], [586.2, 430], [588.0, 430], [588.8, 260], [591.1, 260], [592.2, 330], [609, 330], [610, 230]]);
    const fuera = t > 614.5 ? DESERTA : [];
    const eM = t > 627.0 && t < 656.4 ? salidaE(t, 627.0, 656.4) : 0;
    const mx = x + 1800;
    return (
      <>
        <EnBarco t={t} x={x}>
          <Tripulacion t={t} capitan={false} sin={[...fuera, ...(t > 603.4 && t < 609.4 ? [2] : [])]} expr={() => (t > 591 && t < 612 ? "miedo" : "neutro")} />
          {/* nuevos marineros contratados en la isla */}
          {t > 621.5 && DESERTA.map((i, k) => <Persona key={i} x={XMARINO(i)} y={CUBIERTA} h={200} t={t} seed={300 + k} ropa={MARINO(k + 9)} casco="no" pantalon="#e8e2d0" expr="neutro" aparece={621.6 + k * 0.4} flip={k % 2 === 0} />)}
          <Capitan t={t} h={capH} expr={t > 591.1 && t < 612 ? "enojado" : t > 588.2 && t < 591 ? "orgullo" : "neutro"} bD={t > 600.6 && t < 602.6 ? 120 : 8} cD={30} />
          <Chico x={X_CHICO} y={CUBIERTA} t={t} expr={t > 591 && t < 612 ? "miedo" : t > 613 && t < 626 ? "sorpresa" : "neutro"} mira={t > 613 && t < 626 ? 1 : 0.4} />
          {/* hierros en los tobillos del marino 2 (insinuado) */}
          {t > 603.4 && t < 609.4 && <Marino i={2} t={t} expr="triste" inclina={6} />}
          {t > 603.4 && t < 609.4 && <Svg x={XMARINO(2)} y={CUBIERTA - 6} s={ent(t, 603.5)}><circle cx={-16} r={12} fill="none" stroke="#5a5e6a" strokeWidth={6} /><circle cx={16} r={12} fill="none" stroke="#5a5e6a" strokeWidth={6} /><path d="M -4 0 Q 0 16 4 0" stroke="#5a5e6a" strokeWidth={5} fill="none" /></Svg>}
          {/* la carta de la ley de 1850 que el capitán tira por la borda */}
          {t > 600.6 && t < 603.2 && (
            <Svg x={pz(t, [[600.6, 900], [601.6, -400], [602.4, -900]])} y={pz(t, [[600.6, -900], [601.6, -520], [602.4, -200], [603.2, 200]])} rot={pz(t, [[601.6, 0], [603.2, 380]])} s={0.9}>
              <rect x={-70} y={-48} width={140} height={96} rx={6} fill="#f4f0e8" stroke="#3a2418" strokeWidth={5} />
              <text y={-6} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={24} fill="#3a2418">LAW · 1850</text>
              <text y={26} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={20} fill={C.rojo}>NO FLOGGING</text>
            </Svg>
          )}
        </EnBarco>
        {/* los que desertan: saltan, nadan, corren a la selva */}
        {t > 613.3 && t < 621 && DESERTA.map((i, k) => {
          const a = 613.4 + k * 0.9;
          const u = prog(t, a, a + 4.2);
          if (u <= 0) return null;
          const x0 = x + XMARINO(i), x1 = X_ISLA - 700 + k * 260;
          const nada = u < 0.6;
          const px = interpolate(u, [0, 0.6, 1], [x0, x1 - 120, x1 + 260]);
          const py = u < 0.08 ? CUBIERTA - Math.sin((u / 0.08) * Math.PI) * 80 + (u / 0.08) * 230 : nada ? 30 : interpolate(u, [0.6, 1], [10, -80]);
          if (u >= 1) return null;
          return nada && u > 0.08
            ? <Svg key={i} x={px} y={py + Math.sin(t * 6 + k) * 4}><circle cx={0} cy={-14} r={22} fill={["#f2b48a", "#8d5a3b", "#c98b62"][k]} /><path d={`M -40 0 q 20 ${-10 + Math.sin(t * 8) * 8} 40 0 q 20 ${10 - Math.sin(t * 8) * 8} 40 0`} stroke="#fff" strokeWidth={5} fill="none" /></Svg>
            : <Marino key={i} i={i} t={t} x={px} y={py} camina={u > 0.6 ? 2.2 : 0} flip={false} expr="feliz" />;
        })}
        {/* canoa con los nuevos marineros */}
        {t > 619.8 && t < 622 && <Svg x={pz(t, [[619.8, X_ISLA - 900], [621.6, x + 500]])} y={30}><path d="M -160 -20 Q 0 20 160 -20 Q 120 30 0 34 Q -120 30 -160 -20 Z" fill="#7a4a26" />{[-80, 0, 80].map((d, k) => <circle key={k} cx={d} cy={-40} r={20} fill={["#8d5a3b", "#6e4128", "#c98b62"][k]} />)}</Svg>}
        {/* espejismo de Melville */}
        {eM > 0 && (
          <>
            <Nubarron x={mx} y={-1150} w={1900} e={eM} />
            <Svg x={mx - 380} y={-1150} s={eM * 0.9}><Isla x={0} y={0} t={t} s={1} seed={7} humo /></Svg>
            {t < 637.4 && <Persona x={mx - 600 + pz(t, [[631.0, 0], [634.0, 300]])} y={-1160} h={170 * eM} t={t} seed={410} ropa={MARINO(3)} casco="no" pantalon="#e8e2d0" camina={t > 631 && t < 634 ? 2 : 0} expr={t > 634 ? "sorpresa" : "feliz"} opacity={t > 634.5 ? pz(t, [[634.5, 1], [635.5, 0.25]]) : 1} />}
            {t > 631 && t < 637.2 && [0, 1, 2, 3].map((k) => <Svg key={k} x={mx - 380 + (k - 1.5) * 120} y={-1300 - (k % 2) * 60}><circle cx={-10} r={7} fill="#fff" opacity={0.6 + 0.4 * Math.sin(t * 3 + k)} /><circle cx={10} r={7} fill="#fff" opacity={0.6 + 0.4 * Math.sin(t * 3 + k)} /></Svg>)}
            <Libro t={t} t0={637.2} x={mx + 420} y={-1420} titulo="TYPEE" col="#2f6a3a" />
            <Libro t={t} t0={639.0} x={mx + 760} y={-1420} titulo="MOBY-DICK" col="#1d2a52" ballena />
            {/* Nantucket, años después: el visitante y el hombre que sobrevivió */}
            {t > 643.1 && (
              <>
                <Persona x={mx - 200} y={-1160} h={200 * eM} t={t} seed={411} ropa={{ tunica: "#3a2a22", tunica2: "#1a120e", cinto: "#0c0f20", piel: "#f0c29e", piel2: "#d29c78", pelo: "#5a3a22" }} casco="galera" barba="#5a3a22" pantalon="#1a1420" aparece={643.2} expr={t > 651.4 ? "sorpresa" : "neutro"} mira={1} />
                <Persona x={mx + 140} y={-1160} h={200 * eM} t={t} seed={412} ropa={CUAQUERO} casco="no" viejo barba="#d8d2cc" pantalon="#45424a" aparece={643.6} expr="triste" flip opacity={0.92} />
                <Svg x={mx + 140} y={-1430} s={ent(t, 644.4)}><text textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={90} fill="#fff" stroke="#2a1530" strokeWidth={12} paintOrder="stroke">?</text></Svg>
              </>
            )}
          </>
        )}
        {t > 655.8 && <Humo x={x + 500} y={300} t={t} s={0.6} n={10} col="#cfe8ff" op={0.4} viento={30} />}
      </>
    );
  },
  hud: (t) => (
    <>
      <CartelTrampa t={t} t0={578.4} t1={580.5} n={6} nombre="THE CAPTAIN" />
      <Tachado t={t} t0={580.7} t1={584.7} x={560} label="POLICE"><path d="M 0 -70 L 60 -40 L 50 40 Q 0 80 -50 40 L -60 -40 Z" fill="#2b6ad0" stroke="#1a3a7a" strokeWidth={6} /><path d="M 0 -20 L 10 4 L 34 4 L 14 18 L 22 42 L 0 28 L -22 42 L -14 18 L -34 4 L -10 4 Z" fill="#f7c548" /></Tachado>
      <Tachado t={t} t0={581.9} t1={584.7} x={960} label="JUDGE"><g transform="rotate(-35)"><rect x={-60} y={-40} width={120} height={50} rx={10} fill="#8a5a2a" stroke="#4a2a10" strokeWidth={6} /><rect x={-10} y={10} width={20} height={80} fill="#8a5a2a" stroke="#4a2a10" strokeWidth={5} /></g></Tachado>
      <Tachado t={t} t0={583.1} t1={584.7} x={1360} label="NEWS"><rect x={-60} y={-70} width={120} height={140} rx={6} fill="#fff" stroke="#3a2418" strokeWidth={6} />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-44} y1={-40 + i * 24} x2={44} y2={-40 + i * 24} stroke="#3a2418" strokeWidth={6} />)}</Tachado>
      <Titulo t={t} t0={584.9} t1={588.0} text="THE CAPTAIN IS THE LAW" y={200} size={110} color={C.crema} />
      <Chip t={t} t0={588.2} t1={591.0} text="GOOD SHIP: STRICT BUT FAIR" color={C.lima} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={591.1} t1={594.4} text="BAD SHIP: A TYRANT ON A FLOATING ISLAND" color={C.rojo} x={960} y={140} centro size={52} />
      <Chip t={t} t0={594.6} t1={600.4} text="FLOGGING: OUTLAWED IN 1850" color="#5a5e6a" x={960} y={140} centro size={58} />
      <Chip t={t} t0={600.6} t1={603.2} text="SOME CAPTAINS MISSED THE MEMO" color={C.rojo} x={960} y={140} centro size={56} />
      <Chip t={t} t0={603.4} t1={609.2} text="IRONS" color="#5a5e6a" x={420} y={140} centro size={52} />
      <Chip t={t} t0={604.6} t1={609.2} text="STARVED" color={C.tierra} x={800} y={140} centro size={52} />
      <Chip t={t} t0={605.6} t1={609.2} text="BEATEN" color={C.rojo} x={1160} y={140} centro size={52} />
      <Chip t={t} t0={606.6} t1={609.2} text="KEPT AT SEA" color={C.violeta} x={1520} y={140} centro size={52} />
      <Chip t={t} t0={609.4} t1={611.8} text="A SIMPLE DECISION" color={C.violeta} x={960} y={140} centro size={62} />
      <Titulo t={t} t0={611.9} t1={613.6} text="THEY RAN AWAY" y={200} size={140} color={C.lima} />
      <Chip t={t} t0={613.8} t1={619.6} text="TROPICAL ISLAND · INTO THE JUNGLE" color={C.teal} tinta={C.noche} x={960} y={140} centro size={54} />
      <Chip t={t} t0={619.8} t1={626.9} text="SO COMMON: CAPTAINS HIRED NEW CREWS" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={50} />
      <Titulo t={t} t0={627.2} t1={630.8} text="1842" y={200} size={180} color={C.crema} />
      <Chip t={t} t0={628.6} t1={630.8} text="A YOUNG SAILOR RUNS" color={C.violeta} x={960} y={330} centro size={52} />
      <Chip t={t} t0={631.0} t1={637.0} text="THE MARQUESAS" color={C.teal} tinta={C.noche} x={560} y={140} centro size={52} />
      <Chip t={t} t0={633.6} t1={637.0} text="RUMORED CANNIBALS" color={C.rojo} x={1360} y={140} centro size={52} />
      <Chip t={t} t0={637.2} t1={638.9} text="HE WROTE A BOOK" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={639.0} t1={641.1} text="…THEN ONE ABOUT A WHALE" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={56} />
      <Titulo t={t} t0={641.3} t1={643.0} text="HERMAN MELVILLE" y={200} size={130} color={C.crema} />
      <Chip t={t} t0={643.2} t1={648.0} text="YEARS LATER · NANTUCKET" color={C.violeta} x={960} y={140} centro size={56} />
      <Chip t={t} t0={645.0} t1={648.0} text="THE MAN WHO LIVED THROUGH IT" color={C.rojo} x={960} y={250} centro size={48} />
      <Chip t={t} t0={648.2} t1={651.3} text="TO THE ISLANDERS: NOBODY" color="#5a5e6a" x={960} y={140} centro size={58} />
      <Chip t={t} t0={651.4} t1={654.3} text="TO MELVILLE: THE MOST IMPRESSIVE MAN" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={50} />
      <Chip t={t} t0={654.4} t1={660.2} text="INSPIRED BY A REAL NANTUCKET SHIP" color={C.violeta} x={960} y={140} centro size={54} />
      {t > 591.2 && t < 594 && <Emote t={t} t0={591.2} tipo="enojo" x={760} y={420} s={1.5} />}
      {t > 651.5 && t < 654.2 && <Emote t={t} t0={651.5} tipo="brillos" x={860} y={520} s={1.4} />}
    </>
  ),
};
