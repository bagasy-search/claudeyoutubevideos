import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, Particulas } from "./kit";
import type { Parte } from "./parte";
import { Svg, Diario, Articulos, Isla, Moneda0, Barril, Tiburon } from "./kit3";
import { Papiro } from "./kit2";
import { CartelTrampa, Cuenta, Titulo } from "./hud";
import { Persona, MARINO, TIBURON, CAPITAN } from "./persona";
import { Chico } from "./reparto";
import { X_FARM, X_NY, X_DOCK, EnBarco, CUBIERTA, bx } from "./estado";

// 64,5-149 s · TRAMPA 1: EL RECLUTADOR. La cámara viaja hacia el oeste hasta la granja (1841), vuelve por el
// camino de postes hasta la oficina del "land shark" en Nueva York, después sigue al este hasta Nantucket, el
// muelle, la planchada y la cubierta: firma con la X, gorro rojo de greenhand, y el barco suelta amarras.
const CX = -2300;
const NYB = X_NY - 200; // el chico en la oficina
const NYT = X_NY + 300; // el land shark
const PLANCHA: [number, number, number, number] = [CX + 60, -60, X_DOCK - 760, CUBIERTA]; // planchada muelle → popa

const subida = (t: number) => prog(t, 122.0, 123.6);
const chicoMuelleX = (t: number) => interpolate(t, [118, 122], [CX - 500, CX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Cultivo: React.FC<{ x: number; t: number; seco: number }> = ({ x, t, seco }) => (
  <Svg x={x} y={-70}>
    <line x1={0} y1={0} x2={Math.sin(t + x) * 4 + seco * 40} y2={-200 + seco * 90} stroke={seco > 0.5 ? "#a8884a" : "#5a9a3a"} strokeWidth={10} strokeLinecap="round" />
    <path d={`M 0 -100 Q ${-50 + seco * 20} ${-140 + seco * 120} -70 ${-110 + seco * 140}`} stroke={seco > 0.5 ? "#a8884a" : "#6aaa4a"} strokeWidth={9} fill="none" />
    <path d={`M 0 -150 Q ${50 - seco * 10} ${-190 + seco * 140} 70 ${-160 + seco * 150}`} stroke={seco > 0.5 ? "#a8884a" : "#6aaa4a"} strokeWidth={9} fill="none" />
  </Svg>
);

export const Globo: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; children: React.ReactNode }> = ({ t, t0, t1, x, y, children }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0, 0, { damping: 11, stiffness: 160 }) * interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Svg x={x} y={y} s={e}>
      <circle cx={-170} cy={250} r={18} fill="#fff" /><circle cx={-120} cy={190} r={28} fill="#fff" />
      <ellipse cx={0} cy={0} rx={330} ry={210} fill="#fff" stroke="#2a1530" strokeWidth={8} />
      <g>{children}</g>
    </Svg>
  );
};

export const P1: Parte = {
  a: 64.5, b: 149,
  keys: [
    { t: 66.4, x: CX + 220, y: -450, z: 0.72 },
    { t: 68.6, x: X_FARM + 300, y: -380, z: 0.6 },
    { t: 72.2, x: X_FARM + 520, y: -330, z: 0.86 },
    { t: 80.8, x: X_FARM + 600, y: -360, z: 0.8 },
    { t: 83.3, x: X_NY, y: -520, z: 0.52 },
    { t: 86.9, x: X_NY, y: -860, z: 0.72 },
    { t: 88.1, x: NYT - 40, y: -330, z: 1.05, e: "o" },
    { t: 90.0, x: X_NY + 60, y: -470, z: 0.72 },
    { t: 100.0, x: X_NY + 20, y: -470, z: 0.78 },
    { t: 100.9, x: NYT, y: -320, z: 1.2, e: "o" },
    { t: 104.4, x: NYT - 40, y: -320, z: 1.25 },
    { t: 105.2, x: X_NY + 60, y: -360, z: 0.85 },
    { t: 108.3, x: X_NY + 80, y: -400, z: 0.8 },
    { t: 113.0, x: -4300, y: -460, z: 0.5, e: "io" },
    { t: 121.6, x: -3000, y: -420, z: 0.62, e: "lin" },
    { t: 123.6, x: X_DOCK - 820, y: -400, z: 0.78 },
    { t: 133.7, x: X_DOCK - 760, y: -430, z: 0.82 },
    { t: 134.6, x: X_DOCK - 700, y: -360, z: 1.25, e: "o" },
    { t: 139.8, x: X_DOCK - 660, y: -380, z: 1.15 },
    { t: 141.0, x: X_DOCK, y: -520, z: 0.56 },
    { t: 145.4, x: X_DOCK - 200, y: -500, z: 0.55 },
    { t: 146.6, x: CX - 300, y: -380, z: 0.75 },
    { t: 149.0, x: 200, y: -560, z: 0.42, rel: true },
  ],
  pal: [[68.6, "dia", 1.8], [72.0, "calma", 2.2], [80.0, "dia", 1.5], [122, "manana", 4]],
  mundo: (t) => (
    <>
      {/* ── la granja que no anda */}
      {t > 66 && t < 82 && (
        <>
          {[-600, -480, -360, -240, 600, 720, 840, 960].map((d, i) => <Cultivo key={d} x={X_FARM + d} t={t} seco={prog(t, 71.0 + i * 0.12, 71.6 + i * 0.12)} />)}
          <Svg x={X_FARM + 2300} y={-900} s={0.9}><path d="M -220 40 Q -240 -30 -150 -40 Q -120 -120 -20 -100 Q 50 -160 130 -90 Q 230 -100 230 0 Q 260 40 200 50 Z" fill="#6a6a80" />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={-160 + i * 44} y1={60 + ((t * 300 + i * 40) % 200)} x2={-170 + i * 44} y2={90 + ((t * 300 + i * 40) % 200)} stroke="#8ab8f0" strokeWidth={5} />)}</Svg>
          <Chico x={X_FARM + 560 + (t > 80.9 ? (t - 80.9) * 900 : 0)} y={-70} t={t} gorro="paja" h={250} expr={t < 71 ? "neutro" : t < 73.4 ? "triste" : "sorpresa"} camina={t > 80.9 ? 2.2 : 0} mira={t > 73.4 && t < 80.9 ? 0.6 : 0} />
        </>
      )}
      {/* ── la oficina del land shark */}
      {t > 80 && t < 109.5 && (
        <>
          {t > 87.6 && <div style={{ position: "absolute", left: 0, top: 0, opacity: 0.28 * prog(t, 87.6, 88.2) }}><Tiburon x={NYT - 60} y={-560} t={t} s={1.5} flip /></div>}
          <Persona x={NYT} y={-70} h={300} t={t} seed={13} ropa={TIBURON} casco="galera" pantalon="#1a1420" expr={t > 100.2 && t < 108 ? "orgullo" : "feliz"} habla={t > 89 && t < 100} flip
            bD={t > 100.6 && t < 103.6 ? 70 : t > 89 && t < 100 ? interpolate(Math.sin(t * 4), [-1, 1], [40, 90]) : 10} cD={60} />
          <div style={{ position: "absolute", left: X_NY + 20, top: -282, width: 460, height: 212, background: "#7a4a26", borderTop: "14px solid #9a6a3a" }} />
          <Chico x={interpolate(t, [80.9, 83.3], [X_NY - 1100, NYB], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={-70} t={t} gorro="paja" h={250} camina={t < 83.3 ? 1.6 : 0} expr={t > 95.5 && t < 100 ? "feliz" : t > 104.6 ? "neutro" : "sorpresa"} salta={95.6} />
          {t > 100.5 && t < 103.8 && <Svg x={NYT + 50} y={-330 + prog(t, 101.0, 101.6) * 120} s={0.7}><Moneda0 /></Svg>}
          {t > 104.7 && t < 108 && Array.from({ length: 6 }, (_, i) => {
            const u = prog(t, 104.9 + i * 0.25, 105.6 + i * 0.25);
            return u > 0 && u < 1 ? <Svg key={i} x={NYB + (NYT - NYB) * u} y={-220 - Math.sin(u * Math.PI) * 260} s={0.55} rot={u * 360}><Moneda0 /></Svg> : null;
          })}
        </>
      )}
      <Globo t={t} t0={90.3} t1={99.9} x={NYB + 260} y={-860}>
        {t < 95.4 ? (
          <g>
            <g transform="scale(0.32) translate(0 260)"><Isla x={0} y={0} t={t} s={1} seed={2} /></g>
            {t > 93.2 && <g transform={`translate(170 -40) scale(${ent(t, 93.2)})`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-26} rx={18} ry={30} fill={C.rosa} transform={`rotate(${a})`} />)}<circle r={16} fill={C.ambar} /></g>}
          </g>
        ) : (
          <g>{Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${-150 + (i % 4) * 100} ${-30 + Math.floor(i / 4) * 90}) scale(${ent(t, 95.6 + i * 0.08)})`}><Moneda0 r={44} /></g>)}</g>
        )}
      </Globo>
      {/* ── Nantucket: el chico llega con su equipo y el land shark lo empuja a la planchada */}
      {t > 112 && t < 124 && (
        <>
          <Persona x={chicoMuelleX(t) - 260} y={-60} h={290} t={t} seed={13} ropa={TIBURON} casco="galera" pantalon="#1a1420" expr="feliz" camina={t < 122 ? 1.2 : 0} bD={t > 121.6 ? 95 : 10} cD={10} />
          {t < 122.05 && <Chico x={chicoMuelleX(t)} y={-60} t={t} gorro="paja" camina={t < 122 ? 1.2 : 0} expr="neutro" />}
          {t < 122.05 && <Svg x={chicoMuelleX(t) + 40} y={-240}><rect x={-80} y={-40} width={170} height={60} rx={26} fill="#e8d28a" stroke="#b8983a" strokeWidth={6} /></Svg>}
        </>
      )}
      {t < 146 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><line x1={PLANCHA[0]} y1={PLANCHA[1]} x2={PLANCHA[2]} y2={PLANCHA[3]} stroke="#9a6a3a" strokeWidth={22} strokeLinecap="round" /></svg>}
      {t > 122.0 && t < 123.7 && <Chico x={interpolate(subida(t), [0, 1], [PLANCHA[0], PLANCHA[2]])} y={interpolate(subida(t), [0, 1], [PLANCHA[1], PLANCHA[3]])} t={t} gorro="paja" camina={1.6} expr="miedo" inclina={-8} />}
      {/* ── a bordo */}
      {t >= 123.7 && (
        <EnBarco t={t} x={bx(t)}>
          {Array.from({ length: 10 }, (_, i) => (
            <React.Fragment key={i}>
              <Persona x={-300 + i * 95} y={CUBIERTA} h={200} t={t} seed={60 + i} ropa={MARINO(i)} casco={i % 3 === 0 ? "gorro" : "no"} gorroCol={["#2b6ad0", "#d8343a", "#3d6e5a"][i % 3]} pantalon={["#3a3a4a", "#2a3a5a", "#5a4a3a"][i % 3]} flip={i % 2 === 0} expr={t > 140 && i % 2 ? "miedo" : "neutro"} />
              {t > 140.4 && i % 2 === 1 && <div style={{ position: "absolute", left: -300 + i * 95 - 24, top: CUBIERTA - 260, width: 48, height: 48, borderRadius: 24, background: C.lima, border: "5px solid #fff", transform: `scale(${ent(t, 140.4 + i * 0.06)})` }} />}
            </React.Fragment>
          ))}
          <Persona x={-480} y={CUBIERTA} h={230} t={t} seed={11} ropa={CAPITAN} casco="capitan" barba="#3a2616" pantalon="#141a30" expr={t > 131 && t < 134 ? "orgullo" : "neutro"} bD={t > 124 && t < 133 ? 70 : 8} cD={40} />
          <Chico x={-660} y={CUBIERTA} t={t} gorro={t > 134.15} expr={t < 128.7 ? "neutro" : t < 133.9 ? "sorpresa" : t < 140 ? "orgullo" : "feliz"} salta={134.2} mira={0.4} />
          {t > 133.6 && t < 134.2 && <Svg x={-660} y={CUBIERTA - 1000 + prog(t, 133.6, 134.15) * 560} s={0.45}><path d="M -104 -470 Q -110 -600 0 -604 Q 110 -600 104 -470 Z" fill="#d8343a" /></Svg>}
        </EnBarco>
      )}
      {t > 143.8 && <Persona x={interpolate(t, [143.8, 149], [CX + 40, CX - 600])} y={-60} h={240} t={t} seed={77} ropa={MARINO(2)} casco="gorro" gorroCol="#3d6e5a" barba="#c9c4c0" viejo pantalon="#3a3a4a" camina={1.1} flip expr="feliz" bD={t > 146.5 ? interpolate(Math.sin(t * 9), [-1, 1], [140, 170]) : 8} />}
      <Barril x={CX - 120} y={-90} s={1.1} />
    </>
  ),
  hud: (t) => (
    <>
      <CartelTrampa t={t} t0={64.6} t1={66.5} n={1} nombre="THE RECRUITER" />
      <Titulo t={t} t0={66.8} t1={68.6} text="1841" y={200} size={220} color={C.crema} />
      <Chip t={t} t0={69.4} t1={71.6} text="FARM BOY · UPSTATE NEW YORK" color={C.tierra} x={960} y={140} centro size={62} />
      <Chip t={t} t0={71.4} t1={73.2} text="NOT GOING WELL" color={C.rojo} x={960} y={140} centro size={66} />
      <Diario t={t} t0={73.6} x={1360} y={520} s={0.95} tPay={78.9} tWorld={79.6} t1={80.8} />
      <Chip t={t} t0={81.3} t1={84.9} text="NEW YORK" color={C.violeta} x={960} y={140} centro size={70} />
      <Chip t={t} t0={83.4} t1={84.9} text="A VERY FRIENDLY MAN" color={C.teal} tinta={C.noche} x={1300} y={260} centro size={52} />
      <Chip t={t} t0={85.3} t1={87.5} text="SHIPPING AGENT" color={C.violeta} x={960} y={150} centro size={70} />
      <Titulo t={t} t0={88.0} t1={90.0} text="LAND SHARK" y={190} size={170} color={C.rojo} />
      <Chip t={t} t0={90.6} t1={95.3} text="PALM TREES" color={C.lima} tinta={C.noche} x={420} y={180} centro size={56} />
      <Chip t={t} t0={91.9} t1={95.3} text="ISLANDS" color={C.teal} tinta={C.noche} x={420} y={270} centro size={56} />
      <Chip t={t} t0={93.1} t1={95.3} text="FLOWERS IN THEIR HAIR" color={C.rosa} x={480} y={360} centro size={56} />
      <Cuenta t={t} t0={96.6} t1={98.4} de={0} a={500} x={480} y={220} size={150} color={C.lima} pre="$" t2={99.9} />
      <Chip t={t} t0={100.5} t1={104.4} text="HE GETS A FEE PER BODY" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={102.0} t1={104.4} text="BODY #37 →" color={C.ambar} tinta={C.noche} x={420} y={430} centro size={48} />
      <Titulo t={t} t0={104.8} t1={108.2} text="FROM YOUR WAGES" y={190} size={120} color={C.rojo} />
      <Chip t={t} t0={108.5} t1={110.4} text="TRAIN → NEW BEDFORD" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={110.4} t1={112.3} text="BOAT → NANTUCKET" color={C.teal} tinta={C.noche} x={960} y={140} centro size={58} />
      {t < 122.3 && <Papiro t={t} x={1420} y={560} w={720} t0={112.5} titulo="SEA GEAR · ON CREDIT" tacha={false}
        items={[{ txt: "STRAW MATTRESS", t0: 115.2, monto: "$5" }, { txt: "TIN PLATE", t0: 117.2, monto: "$2" }, { txt: "SPOON", t0: 118.2, monto: "$1" }, { txt: "WOOLEN SHIRTS", t0: 119.2, monto: "$9" }]} />}
      <Chip t={t} t0={120.6} t1={122.2} text="+ HEALTHY MARKUP ↑" color={C.rojo} x={1420} y={890} centro size={52} />
      <Chip t={t} t0={122.1} t1={123.5} text="HANDED TO THE SHIP" color={C.violeta} x={960} y={140} centro size={62} />
      <Articulos t={t} t0={123.8} x={1380} y={540} s={0.82} tx={131.7} borroso={[125.9, 128.6]} t1={133.6} />
      <Chip t={t} t0={126.0} t1={128.6} text="CAN YOU READ IT?" color={C.ambar} tinta={C.noche} x={520} y={200} centro size={58} />
      <Chip t={t} t0={128.8} t1={129.7} text="THAT'S FINE." color={C.teal} tinta={C.noche} x={520} y={200} centro size={58} />
      <Chip t={t} t0={129.8} t1={131.2} text="NOBODY EXPECTS YOU TO" color={C.violeta} x={520} y={200} centro size={52} />
      <Titulo t={t} t0={134.2} t1={139.8} text="GREENHAND" y={190} size={170} color={C.lima} />
      <Chip t={t} t0={136.6} t1={139.8} text="NEVER BEEN TO SEA" color={C.violeta} x={960} y={330} centro size={58} />
      <Chip t={t} t0={140.4} t1={144.1} text="≈ HALF THE CREW" color={C.lima} tinta={C.noche} x={960} y={150} centro size={70} />
      <Chip t={t} t0={144.3} t1={145.5} text="WHICH TELLS YOU SOMETHING" color={C.violeta} x={960} y={150} centro size={56} />
      <Chip t={t} t0={145.7} t1={148.8} text="THE PROS KNEW BETTER" color={C.rojo} x={960} y={150} centro size={64} />
      {t > 95.6 && t < 99.8 && <Emote t={t} t0={95.6} tipo="brillos" x={700} y={560} s={1.4} />}
      {t > 104.8 && t < 106.5 && <Emote t={t} t0={104.8} tipo="susto" x={700} y={560} s={1.4} />}
      {t > 113 && t < 116 && <Particulas t={t} tipo="polvo" n={20} seed={5} />}
    </>
  ),
};
