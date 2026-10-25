import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import type { Parte } from "./parte";
import { Svg, Barril0, Moneda0, Iglesia, CasaNan, Cachalote, Arpon, Articulos } from "./kit3";
import { CartelTrampa, Cuenta, Titulo } from "./hud";
import { Persona, CUAQUERO, Expr } from "./persona";
import { Chico, Tripulacion, XMARINO, X_CAPITAN, X_CHICO } from "./reparto";
import { EnBarco, CUBIERTA, bx } from "./estado";

// 149-266 s · TRAMPA 2: EL LAY. Navegando. La cuenta se hace EN la cubierta: barras de oro sobre la cabeza de
// cada uno, barriles que llueven, la mano gris de los dueños que se los lleva, las deducciones que le vacían
// el bolsillo al chico, y en el cielo un espejismo de Nantucket con los cuáqueros que firman los contratos.
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const BAR = 10500; // px de barra × fracción (1/15 → 700 px)

const Barra: React.FC<{ t: number; t0: number; x: number; den: number; den2?: number; t2?: number; rol: string; col?: string }> = ({ t, t0, x, den, den2, t2 = 1e9, rol, col = C.oro }) => {
  if (t < t0 || t > 181.6) return null;
  const sube = ent(t, t0, 0, { damping: 14, stiffness: 120 });
  const d = den2 && t > t2 ? den + (den2 - den) * prog(t, t2, t2 + 0.8) : den;
  const h = (BAR / d) * sube * interpolate(t, [181.0, 181.6], [1, 0], cl);
  const top = CUBIERTA - 280 - h;
  return (
    <Svg x={x} y={0}>
      <rect x={-34} y={top} width={68} height={h} rx={10} fill={col} stroke="#2a1530" strokeWidth={6} />
      <rect x={-22} y={top + 8} width={14} height={Math.max(0, h - 16)} rx={7} fill="#fff" opacity={0.35} />
      <text x={0} y={top - 28} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={84} fill="#fff" stroke="#2a1530" strokeWidth={10} paintOrder="stroke" opacity={sube}>{`1/${Math.round(d)}`}</text>
      <text x={0} y={top - 118} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={50} fill={C.crema} stroke="#2a1530" strokeWidth={8} paintOrder="stroke" opacity={sube}>{rol}</text>
    </Svg>
  );
};

// barriles que caen del cielo a la cubierta (183-186) y la mano de los dueños que se lleva casi todos (187.6-191)
const NB = 16;
const barrilPos = (i: number) => ({ x: -560 + (i % 8) * 150, y: CUBIERTA - 70 - Math.floor(i / 8) * 120 });
const Barriles: React.FC<{ t: number }> = ({ t }) => {
  if (t < 183 || t > 196.5) return null;
  const mano = prog(t, 188.4, 190.6);
  return (
    <>
      {Array.from({ length: NB }, (_, i) => {
        const p = barrilPos(i);
        const cae = prog(t, 183.2 + i * 0.14, 183.7 + i * 0.14);
        const queda = i === 3;
        const y = p.y - (1 - cae) * 1800 - (queda ? 0 : mano * 2600);
        const s = queda ? interpolate(t, [192.0, 193.4], [1, 0.12], cl) : 1;
        if (cae <= 0) return null;
        return <Svg key={i} x={p.x} y={y} s={0.95 * s} rot={(1 - cae) * 40 + (queda ? 0 : mano * (i % 2 ? 30 : -30))}><Barril0 /></Svg>;
      })}
    </>
  );
};
const ManoGris: React.FC<{ t: number; x: number }> = ({ t, x }) => {
  if (t < 187.6 || t > 191.2) return null;
  const baja = prog(t, 187.6, 188.4), sube = prog(t, 188.4, 190.8);
  const y = -2600 + baja * 2050 - sube * 2600;
  return (
    <Svg x={x + 40} y={y} s={2.4}>
      <rect x={-130} y={-900} width={260} height={780} fill="#6a6670" stroke="#2a1530" strokeWidth={6} />
      <rect x={-150} y={-160} width={300} height={70} rx={14} fill="#f4f0e8" stroke="#2a1530" strokeWidth={6} />
      <path d="M -150 -90 Q -190 40 -160 150 Q -120 210 -60 170 L -40 70 L -10 200 Q 30 230 50 190 L 50 80 L 90 180 Q 130 200 140 150 L 130 40 Q 180 90 200 40 Q 190 -40 150 -90 Z" fill="#f0c29e" stroke="#2a1530" strokeWidth={6} />
    </Svg>
  );
};

// cosas que se le van al chico (vuelan de su mano hacia el capitán)
const Vuela: React.FC<{ t: number; t0: number; children: React.ReactNode }> = ({ t, t0, children }) => {
  const u = prog(t, t0, t0 + 1.1);
  if (u <= 0 || u >= 1) return null;
  const x = interpolate(u, [0, 1], [X_CHICO + 30, X_CAPITAN + 60]);
  const y = CUBIERTA - 180 - Math.sin(u * Math.PI) * 340;
  return <Svg x={x} y={y} rot={u * 300} s={0.9}>{children}</Svg>;
};
const Colchon = () => <rect x={-70} y={-24} width={140} height={48} rx={22} fill="#e8d28a" stroke="#b8983a" strokeWidth={6} />;
const Pantalon = () => <path d="M -40 -50 L 40 -50 L 46 60 L 10 60 L 0 -6 L -10 60 L -46 60 Z" fill="#2a3a5a" stroke="#141a30" strokeWidth={5} />;
const Tabaco = () => <g><rect x={-40} y={-26} width={80} height={52} rx={8} fill="#8a5a2a" stroke="#4a2a10" strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill="#f4e6c4">TOBACCO</text></g>;
const Aguja = () => <g><line x1={-50} y1={30} x2={50} y2={-30} stroke="#c8ccd8" strokeWidth={7} strokeLinecap="round" /><path d="M 50 -30 Q 90 -50 80 0 Q 60 40 20 30" stroke={C.rojo} strokeWidth={4} fill="none" /></g>;

// el baúl del capitán (slop chest) con etiquetas de precio
const Baul: React.FC<{ t: number }> = ({ t }) => {
  if (t < 221.2 || t > 229.9) return null;
  const e = ent(t, 221.3) * interpolate(t, [229.4, 229.9], [1, 0], cl);
  const abre = prog(t, 222.0, 222.8);
  const tags = [["NEEDLE", "$1"], ["THREAD", "$2"], ["SOAP", "$3"], ["BOOTS", "$9"]];
  return (
    <Svg x={X_CAPITAN + 140} y={CUBIERTA} s={e}>
      <rect x={-120} y={-150} width={240} height={150} rx={12} fill="#7a4a26" stroke="#3a1a08" strokeWidth={7} />
      <g transform={`translate(0 -150) rotate(${-abre * 70} -120 0)`}><rect x={-120} y={-60} width={240} height={60} rx={20} fill="#9a6a3a" stroke="#3a1a08" strokeWidth={7} /></g>
      <rect x={-20} y={-120} width={40} height={36} rx={6} fill={C.oro} stroke="#3a1a08" strokeWidth={5} />
      {abre > 0.5 && <ellipse cx={0} cy={-160} rx={110} ry={40} fill="#fff3c4" opacity={0.5 * abre} />}
      {tags.map(([n, p], i) => {
        const s = ent(t, 223.0 + i * 0.35);
        const x = -270 + i * 180, y = -420 - (i % 2) * 90 + Math.sin(t * 3 + i) * 8;
        return (
          <g key={n} transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t * 2.4 + i) * 8})`}>
            <line x1={0} y1={-60} x2={0} y2={-110} stroke="#3a2418" strokeWidth={3} />
            <rect x={-80} y={-60} width={160} height={110} rx={12} fill="#f4e6c4" stroke="#3a2418" strokeWidth={5} />
            <text y={-18} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={28} fill="#3a2418">{n}</text>
            <text y={34} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={50} fill={C.rojo}>{t > 225.6 ? p.replace("$", "$$$") : p}</text>
          </g>
        );
      })}
    </Svg>
  );
};

// espejismo en el cielo: nube-isla con lo que el chico imagina (peón en su cama / muelle / Nantucket cuáquera)
export const Nubarron: React.FC<{ x: number; y: number; w: number; e: number }> = ({ x, y, w, e }) => (
  <Svg x={x} y={y} s={e}>
    <ellipse cx={0} cy={40} rx={w / 2 + 80} ry={110} fill="#ffffff" opacity={0.25} />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-w / 2 + (i * w) / 8} cy={40 + Math.sin(i * 1.7) * 14} r={90 + (i % 3) * 30} fill="#fbfbff" />)}
    <rect x={-w / 2} y={0} width={w} height={60} fill="#fbfbff" />
  </Svg>
);
export const salidaE = (t: number, a: number, b: number) => ent(t, a, 0, { damping: 14, stiffness: 120 }) * interpolate(t, [b - 0.4, b], [1, 0], cl);

const Cama: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-170} y={-90} width={340} height={70} rx={14} fill="#f4f0e8" stroke="#3a2418" strokeWidth={6} />
    <rect x={-190} y={-170} width={30} height={170} fill="#7a4a26" /><rect x={160} y={-130} width={30} height={130} fill="#7a4a26" />
    <path d="M -150 -90 Q -20 -150 150 -100 L 150 -70 L -150 -70 Z" fill="#6a9ad8" />
    <circle cx={-110} cy={-118} r={34} fill="#f2b48a" stroke="#3a2418" strokeWidth={4} />
    <text x={-40} y={-180 - (t % 1.2) * 30} fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#5a6a9a" opacity={1 - (t % 1.2) / 1.2}>z</text>
  </g>
);

export const P2: Parte = {
  a: 149, b: 266,
  keys: [
    { t: 152.0, x: 120, y: -600, z: 0.45, rel: true },
    { t: 154.6, x: -560, y: -400, z: 1.0, rel: true },
    { t: 155.9, x: -540, y: -420, z: 0.95, rel: true },
    { t: 158.0, x: -60, y: -900, z: 0.5, rel: true },
    { t: 163.4, x: -40, y: -860, z: 0.52, rel: true },
    { t: 165.2, x: -260, y: -660, z: 0.66, rel: true },
    { t: 172.0, x: -300, y: -650, z: 0.66, rel: true },
    { t: 173.8, x: X_CHICO, y: -420, z: 1.25, rel: true, e: "o" },
    { t: 180.6, x: X_CHICO + 20, y: -420, z: 1.3, rel: true },
    { t: 182.6, x: 0, y: -640, z: 0.5, rel: true },
    { t: 187.0, x: 0, y: -620, z: 0.52, rel: true },
    { t: 188.6, x: 20, y: -900, z: 0.4, rel: true },
    { t: 191.4, x: 0, y: -620, z: 0.5, rel: true },
    { t: 193.2, x: X_CHICO + 180, y: -380, z: 1.05, rel: true },
    { t: 200.6, x: X_CHICO + 180, y: -400, z: 1.0, rel: true },
    { t: 202.0, x: X_CHICO + 100, y: -760, z: 0.6, rel: true },
    { t: 205.0, x: X_CHICO + 120, y: -760, z: 0.6, rel: true },
    { t: 207.6, x: (X_CHICO + X_CAPITAN) / 2, y: -440, z: 0.95, rel: true },
    { t: 221.0, x: (X_CHICO + X_CAPITAN) / 2 + 40, y: -450, z: 0.92, rel: true },
    { t: 222.6, x: X_CAPITAN + 60, y: -520, z: 0.8, rel: true },
    { t: 229.4, x: X_CAPITAN + 60, y: -520, z: 0.82, rel: true },
    { t: 231.0, x: -100, y: -560, z: 0.55, rel: true },
    { t: 236.6, x: -100, y: -580, z: 0.55, rel: true },
    { t: 238.0, x: 900, y: -1300, z: 0.6, rel: true },
    { t: 240.8, x: 900, y: -1300, z: 0.62, rel: true },
    { t: 243.0, x: 2350, y: -1420, z: 0.8, rel: true },
    { t: 252.2, x: 2350, y: -1420, z: 0.86, rel: true },
    { t: 253.6, x: 2700, y: -1500, z: 0.5, rel: true, e: "o" },
    { t: 257.4, x: 2500, y: -1480, z: 0.56, rel: true },
    { t: 262.8, x: 2400, y: -1500, z: 0.62, rel: true },
    { t: 265.0, x: 600, y: -700, z: 0.42, rel: true },
  ],
  pal: [[150, "dia", 3], [233, "tarde", 6]],
  mundo: (t) => {
    const x = bx(t);
    const espejo = (a: number, b: number) => (t > a && t < b ? salidaE(t, a, b) : 0);
    const eCama = espejo(201.0, 205.6), eMuelle = espejo(237.0, 241.4), eQ = espejo(241.0, 266);
    const qExpr: Expr = t > 252.4 && t < 257.6 ? "enojado" : t > 257.6 ? "orgullo" : "neutro";
    return (
      <>
        <EnBarco t={t} x={x}>
          <Tripulacion t={t} expr={(i) => (t > 160.1 && t < 163.5 ? "feliz" : t > 229.7 && t < 241 && i % 2 ? "triste" : "neutro")} />
          <Chico x={X_CHICO} y={CUBIERTA} t={t}
            expr={t < 160.1 ? "neutro" : t < 163.5 ? "feliz" : t < 172.2 ? "neutro" : t < 181 ? "sorpresa" : t < 193 ? "feliz" : t < 201 ? "sorpresa" : t < 207.8 ? "triste" : t < 229.7 ? "miedo" : "triste"}
            bD={t > 209.6 && t < 222 ? 60 + Math.sin(t * 5) * 10 : 8} mira={0.4} salta={160.3} />
          {/* sin sueldo: la moneda tachada */}
          {t > 152.7 && t < 155.9 && <Svg x={X_CHICO} y={CUBIERTA - 380} s={ent(t, 152.8) * interpolate(t, [155.4, 155.9], [1, 0], cl) * 1.3}><Moneda0 r={50} /><line x1={-60} y1={-60} x2={60} y2={60} stroke={C.rojo} strokeWidth={14} strokeLinecap="round" /></Svg>}
          <Barra t={t} t0={164.6} x={X_CAPITAN} den={15} rol="CAPTAIN" />
          <Barra t={t} t0={167.1} x={XMARINO(0)} den={20} rol="1ST MATE" />
          <Barra t={t} t0={169.9} x={XMARINO(3)} den={80} rol="HARPOONER" />
          <Barra t={t} t0={172.2} x={X_CHICO} den={175} den2={350} t2={178.4} rol="YOU" col={C.lima} />
          <Barriles t={t} />
          {t > 193 && t < 196.5 && <Svg x={X_CHICO + 70} y={CUBIERTA - 160} s={ent(t, 193.2) * 0.5}><Moneda0 /></Svg>}
          <Vuela t={t} t0={209.8}><Colchon /></Vuela>
          <Vuela t={t} t0={213.2}><Moneda0 r={36} /></Vuela>
          <Vuela t={t} t0={213.6}><Moneda0 r={36} /></Vuela>
          <Vuela t={t} t0={218.6}><Pantalon /></Vuela>
          <Vuela t={t} t0={219.9}><Tabaco /></Vuela>
          <Vuela t={t} t0={221.5}><Aguja /></Vuela>
          <Baul t={t} />
        </EnBarco>
        <ManoGris t={t} x={x} />
        {/* espejismo 1: el peón de granja en su cama */}
        {eCama > 0 && (
          <>
            <Nubarron x={x + X_CHICO + 100} y={-1060} w={760} e={eCama} />
            <Svg x={x + X_CHICO + 100} y={-1060} s={eCama}><Cama t={t} /><text x={0} y={-260} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#1a6a3a" stroke="#fff" strokeWidth={10} paintOrder="stroke">FARMHAND · MORE $ + A BED</text></Svg>
          </>
        )}
        {/* espejismo 2: el chico vuelve al muelle encadenado al barco */}
        {eMuelle > 0 && (
          <>
            <Nubarron x={x + 900} y={-1100} w={1100} e={eMuelle} />
            <Svg x={x + 900} y={-1100} s={eMuelle}>
              <rect x={-520} y={-30} width={540} height={40} fill="#9a6a3a" />
              <path d="M 120 -10 L 520 -10 L 480 70 L 150 70 Z" fill="#2a1c22" />
              <rect x={300} y={-420} width={14} height={410} fill="#6a4a30" />
              <path d="M -260 -90 Q -20 -40 120 -40" stroke="#555a66" strokeWidth={10} strokeDasharray="22 10" fill="none" />
              <circle cx={-260} cy={-90} r={16} fill="#555a66" />
            </Svg>
            <Chico x={x + 900 - 300} y={-1130} t={t} h={210 * eMuelle} expr="triste" />
          </>
        )}
        {/* espejismo 3: Nantucket de los cuáqueros */}
        {eQ > 0 && (
          <>
            <Nubarron x={x + 2400} y={-1250} w={1700} e={eQ} />
            <Svg x={x + 2400} y={-1250} s={eQ}><g transform="translate(-560 0)"><Iglesia x={0} y={0} s={0.7} /></g></Svg>
            <CasaNan x={x + 2400 + 520} y={-1250} s={0.8 * eQ} rica={t > 263.1} luz={t > 263.1} />
            {[-180, 0, 180].map((d, k) => (
              <Persona key={k} x={x + 2400 + d} y={-1250} h={(k === 1 ? 270 : 240) * eQ} t={t} seed={90 + k} ropa={CUAQUERO} casco={k === 2 ? "no" : "cuaquero"} pantalon="#45424a" expr={qExpr} flip={k === 2}
                bD={k === 1 && t > 257.7 ? 70 : t > 244.7 && t < 252 ? 150 : 8} cD={t > 244.7 && t < 252 && k !== 1 ? 120 : 30} bI={t > 244.7 && t < 252 ? 150 : 8} cI={t > 244.7 && t < 252 ? 120 : 20} />
            ))}
            {t > 252.4 && t < 257.6 && <Cachalote x={x + 2400 + 1150} y={-1150 - prog(t, 252.5, 253.3) * 140} t={t} s={0.55} rot={-14} chorro={1} enojo />}
            {t > 252.6 && t < 257.6 && <Arpon x={x + 2400 + 900} y={-1420} s={1.2} rot={30} />}
            {t > 263.1 && Array.from({ length: 10 }, (_, i) => {
              const u = ((t - 263.1) * 0.9 + i * 0.1) % 1;
              return <Svg key={i} x={interpolate(u, [0, 1], [x, x + 2400 + 520])} y={interpolate(u, [0, 1], [-300, -1350]) - Math.sin(u * Math.PI) * 300} s={0.5}><Moneda0 /></Svg>;
            })}
          </>
        )}
      </>
    );
  },
  hud: (t) => {
    // bolsillo del chico (deducciones escalonadas)
    const pasos: [number, number][] = [[207.8, 200], [212.2, 116], [216.7, 41], [219.6, 29], [222.4, 22], [228.0, -9]];
    const hechos = pasos.filter((p) => t >= p[0]);
    const v = hechos.slice(-1)[0]?.[1] ?? 200;
    const ult = hechos.slice(-1)[0]?.[0] ?? 0;
    const sacude = Math.max(0, 1 - (t - ult) * 3) * Math.sin(t * 60) * 14;
    return (
      <>
        <CartelTrampa t={t} t0={149.0} t1={152.6} n={2} nombre="THE LAY" />
        <Chip t={t} t0={152.7} t1={155.6} text="NO SALARY" color={C.rojo} x={960} y={150} centro size={74} />
        <Chip t={t} t0={155.9} t1={160.0} text="A LAY = YOUR SHARE OF THE CATCH" color={C.violeta} x={960} y={150} centro size={60} />
        <Chip t={t} t0={157.4} t1={160.0} text="…AFTER EXPENSES" color={C.ambar} tinta={C.noche} x={960} y={250} centro size={48} />
        <Chip t={t} t0={160.1} t1={163.3} text="FULL SHIP = EVERYBODY WINS" color={C.lima} tinta={C.noche} x={960} y={150} centro size={62} />
        <Chip t={t} t0={163.5} t1={164.5} text="IN THEORY" color={C.rojo} x={960} y={150} centro size={70} />
        <Chip t={t} t0={178.4} t1={180.9} text="SOME SIGNED FOR 1/350" color={C.rojo} x={960} y={150} centro size={64} />
        <Titulo t={t} t0={181.2} t1={182.6} text="LET'S DO THE MATH" y={200} size={130} color={C.crema} />
        <Cuenta t={t} t0={182.9} t1={185.6} de={0} a={50000} x={960} y={200} size={140} color={C.oro} pre="$" t2={187.5} />
        <Chip t={t} t0={187.7} t1={191.4} text="OWNERS' CUT + VOYAGE COSTS" color="#6a6670" x={960} y={150} centro size={62} />
        <Chip t={t} t0={191.6} t1={196.2} text="YOUR SLICE: 1/175 OF WHAT'S LEFT" color={C.lima} tinta={C.noche} x={960} y={150} centro size={58} />
        <Cuenta t={t} t0={196.4} t1={197.6} de={0} a={200} x={700} y={330} size={150} color={C.lima} pre="$" t2={200.9} />
        <Chip t={t} t0={196.5} t1={200.9} text="4 YEARS" color={C.violeta} x={700} y={450} centro size={54} />
        <Cuenta t={t} t0={198.4} t1={199.4} de={0} a={50} x={1240} y={330} size={150} color={C.ambar} pre="$" t2={200.9} />
        <Chip t={t} t0={198.5} t1={200.9} text="A YEAR" color={C.rojo} x={1240} y={450} centro size={54} />
        <Titulo t={t} t0={205.4} t1={207.6} text="BUT WAIT…" y={210} size={140} color={C.crema} />
        <Titulo t={t} t0={207.8} t1={209.6} text="THE DEDUCTIONS" y={210} size={130} color={C.rojo} />
        {t > 207.8 && t < 229.6 && (
          <div style={{ position: "absolute", right: 70, top: 60, transform: `translateX(${sacude}px) scale(${ent(t, 207.9)})`, transformOrigin: "right top", fontFamily, fontWeight: 700, background: "#f4e6c4", border: "6px solid #3a2418", borderRadius: 18, padding: "10px 30px", textAlign: "center", boxShadow: "0 10px 0 rgba(0,0,0,.3)" }}>
            <div style={{ fontSize: 30, color: "#3a2418", letterSpacing: 2 }}>YOUR SHARE</div>
            <div style={{ fontSize: 110, color: v < 0 ? C.rojo : "#1a6a3a" }}>{v < 0 ? `-$${-v}` : `$${v}`}</div>
          </div>
        )}
        <Chip t={t} t0={209.7} t1={212.0} text="THE LAND SHARK'S GEAR" color={C.violeta} x={560} y={160} centro size={52} />
        <Chip t={t} t0={212.2} t1={213.0} text="DEDUCTED + INTEREST" color={C.rojo} x={560} y={160} centro size={56} />
        <Chip t={t} t0={213.1} t1={216.5} text="THE CASH ADVANCE" color={C.violeta} x={560} y={160} centro size={52} />
        <Chip t={t} t0={216.7} t1={218.4} text="DEDUCTED + INTEREST" color={C.rojo} x={560} y={160} centro size={56} />
        <Chip t={t} t0={218.6} t1={221.2} text="PANTS · TOBACCO" color={C.violeta} x={560} y={160} centro size={52} />
        <Chip t={t} t0={222.4} t1={229.4} text="THE SLOP CHEST" color={C.tierra} x={560} y={160} centro size={62} />
        <Chip t={t} t0={225.6} t1={229.4} text="PRICES TO MAKE A PIRATE BLUSH" color={C.rosa} x={560} y={260} centro size={44} />
        <Chip t={t} t0={228.0} t1={229.4} text="DEDUCTED" color={C.rojo} x={960} y={900} centro size={80} />
        {t > 229.7 && t < 237.0 && [["SEAMAN · 4 YEARS", "$3.12"], ["GREENHAND · 3 YEARS", "$0.75"], ["GREENHAND · 4 YEARS", "-$11.40"]].map(([a, b], i) => {
          const e = ent(t, 230.6 + i * 1.3) * interpolate(t, [236.6, 237.0], [1, 0], cl);
          return (
            <div key={i} style={{ position: "absolute", left: 240 + i * 500, top: 640, width: 440, transform: `scale(${e}) rotate(${(i - 1) * 3}deg)`, fontFamily, fontWeight: 700, background: "#f4e6c4", border: "5px solid #3a2418", borderRadius: 14, padding: "18px 20px", textAlign: "center", boxShadow: "0 10px 0 rgba(0,0,0,.3)" }}>
              <div style={{ fontSize: 22, color: "#7a6448", letterSpacing: 2 }}>CREW ACCOUNT · PAID OFF</div>
              <div style={{ fontSize: 34, color: "#3a2418", marginTop: 6 }}>{a}</div>
              <div style={{ fontSize: 84, color: b.startsWith("-") ? C.rojo : "#1a6a3a" }}>{b}</div>
            </div>
          );
        })}
        <Chip t={t} t0={229.8} t1={236.8} text="WHAT YOUNG MEN TOOK HOME" color={C.violeta} x={960} y={150} centro size={60} />
        <Chip t={t} t0={237.1} t1={241.0} text="IN DEBT TO THE SHIP HE SURVIVED" color={C.rojo} x={960} y={150} centro size={58} />
        <Chip t={t} t0={241.3} t1={242.7} text="WHO OWNED THE SHIPS?" color={C.violeta} x={960} y={150} centro size={62} />
        <Titulo t={t} t0={242.8} t1={244.6} text="NANTUCKET QUAKERS" y={200} size={120} color={C.crema} />
        <Chip t={t} t0={244.8} t1={252.2} text="PLAIN GREY" color="#6a6670" x={420} y={170} centro size={50} />
        <Chip t={t} t0={247.0} t1={252.2} text="NO WARS" color={C.teal} tinta={C.noche} x={960} y={170} centro size={50} />
        <Chip t={t} t0={249.2} t1={252.2} text="NO VIOLENCE" color={C.lima} tinta={C.noche} x={1500} y={170} centro size={50} />
        <Chip t={t} t0={252.4} t1={255.4} text="…AGAINST PEOPLE" color={C.rojo} x={960} y={170} centro size={64} />
        <Titulo t={t} t0={255.6} t1={257.6} text="THE FIGHTING QUAKERS" y={200} size={120} color={C.rojo} />
        <Chip t={t} t0={257.7} t1={263.0} text="SUNDAY: PRAY" color={C.teal} tinta={C.noche} x={560} y={170} centro size={58} />
        <Chip t={t} t0={259.6} t1={263.0} text="MONDAY: SIGN YOU AT 1/175" color={C.rojo} x={1300} y={170} centro size={52} />
        {t > 259.7 && t < 263.0 && <Articulos t={t} t0={259.8} x={1500} y={640} s={0.55} lay="1/175" tLay={260.6} t1={262.8} />}
        <Chip t={t} t0={263.2} t1={265.8} text="NOT RICH BY ACCIDENT" color={C.oro} tinta={C.noche} x={960} y={170} centro size={66} />
        {t > 160.2 && t < 163 && <Emote t={t} t0={160.2} tipo="brillos" x={960} y={560} s={1.6} />}
        {t > 172.3 && t < 176 && <Emote t={t} t0={172.4} tipo="preg" x={1100} y={420} s={1.4} />}
        {t > 205.5 && t < 208 && <Emote t={t} t0={205.5} tipo="excl" x={1100} y={420} s={1.4} />}
      </>
    );
  },
};
