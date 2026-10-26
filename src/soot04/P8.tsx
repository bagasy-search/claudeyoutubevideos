import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Emote, fontFamily } from "./kit";
import type { Parte } from "./parte";
import { Svg, Ballenero, Cachalote, CasaNan, Torre, Lampara, Moneda0 } from "./kit3";
import { Titulo } from "./hud";
import { Persona, CAPITAN, CUAQUERO } from "./persona";
import { Tripulacion, Chico, X_CHICO } from "./reparto";
import { Articulos } from "./kit3";
import { EnBarco, CUBIERTA, bx, X_NAN2 } from "./estado";
import { Nubarron, salidaE } from "./P2";

// 803.5-901 s · EL GIRO Y EL CIERRE. Volvemos a nuestro barco, que navega a casa: no era la ballena, era el
// papel. En el espejismo del cielo: Chase capitán, Pollard naufraga en un arrecife y termina de sereno con su
// farol; cada 20 de noviembre se encierra sin comer. La ironía final: la torre de Pensilvania de 1859, flotas
// pudriéndose. Amarramos en Nantucket: el greenhand baja por la planchada debiendo 9 dólares, mira las casas
// grandes del cuáquero que cuenta monedas. CTA: suscribite + campana, la prisión medieval, ¿qué trampa te agarra?
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const pz = (t: number, ks: [number, number][]) => interpolate(t, ks.map((k) => k[0]), ks.map((k) => k[1]), cl);
const MUELLE = X_NAN2 + 900; // punta del muelle de vuelta
const PL: [number, number, number, number] = [600, CUBIERTA, MUELLE + 300, -60]; // planchada: cubierta (local) → muelle
const XQ = MUELLE + 3420; // casa rica del cuáquero

const Tacha: React.FC<{ t: number; t0: number; t1: number; children: React.ReactNode }> = ({ t, t0, t1, children }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.3], [1, 0], cl);
  const k = prog(t, t0 + 0.35, t0 + 0.65);
  return (
    <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) scale(${e})` }}>
      <div style={{ position: "relative", width: 700, height: 380, borderRadius: 40, background: "rgba(20,10,40,.55)", border: "8px solid #fff", overflow: "hidden" }}>{children}</div>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={700} height={380}>
        <line x1={80} y1={60} x2={80 + 540 * k} y2={60 + 260 * k} stroke={C.rojo} strokeWidth={30} strokeLinecap="round" />
        <line x1={620} y1={60} x2={620 - 540 * k} y2={60 + 260 * k} stroke={C.rojo} strokeWidth={30} strokeLinecap="round" />
      </svg>
    </div>
  );
};
const Farolito: React.FC<{ t: number }> = ({ t }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
    <circle r={70} fill="#ffd27a" opacity={0.25 + 0.05 * Math.sin(t * 7)} />
    <line x1={0} y1={-40} x2={0} y2={-20} stroke="#3a3440" strokeWidth={4} />
    <rect x={-14} y={-20} width={28} height={34} rx={5} fill="#ffe08a" stroke="#3a3440" strokeWidth={4} />
  </svg>
);
const Calendario: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <Svg x={x} y={y} s={s}>
    <rect x={-90} y={-110} width={180} height={210} rx={14} fill="#fff" stroke="#2a1530" strokeWidth={7} />
    <rect x={-90} y={-110} width={180} height={60} rx={14} fill={C.rojo} />
    <text y={-66} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={36} fill="#fff">NOV</text>
    <text y={60} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={100} fill="#2a1530">20</text>
  </Svg>
);
const Castillo: React.FC<{ e: number; t: number }> = ({ e, t }) => (
  <svg style={{ position: "absolute", left: 960, top: 640, overflow: "visible", transform: `scale(${e})` }} width={1} height={1}>
    <circle cx={260} cy={-300} r={70} fill="#f4f0d8" opacity={0.9} />
    <path d="M -360 120 L -360 -170 L -320 -170 L -320 -210 L -280 -210 L -280 -170 L -240 -170 L -240 -210 L -200 -210 L -200 -170 L -160 -170 L -160 -60 L 160 -60 L 160 -170 L 200 -170 L 200 -210 L 240 -210 L 240 -170 L 280 -170 L 280 -210 L 320 -210 L 320 -170 L 360 -170 L 360 120 Z" fill="#1a1428" />
    <path d="M -60 -60 L -60 -260 L -80 -260 L 0 -330 L 80 -260 L 60 -260 L 60 -60 Z" fill="#1a1428" />
    <path d="M -50 120 L -50 20 Q 0 -30 50 20 L 50 120 Z" fill="#0a0812" />
    {[-30, -10, 10, 30].map((d) => <line key={d} x1={d} y1={0} x2={d} y2={120} stroke="#5a5e6a" strokeWidth={6} />)}
    <rect x={-270} y={-110} width={30} height={46} rx={10} fill="#ffb54a" opacity={0.6 + 0.4 * Math.sin(t * 5)} />
    <rect x={240} y={-110} width={30} height={46} rx={10} fill="#ffb54a" opacity={0.6 + 0.4 * Math.sin(t * 4 + 1)} />
  </svg>
);

export const P8: Parte = {
  a: 803.5, b: 901,
  keys: [
    { t: 805.6, x: 200, y: -650, z: 0.42, rel: true },
    { t: 811.8, x: 100, y: -620, z: 0.46, rel: true },
    { t: 820.2, x: 300, y: -600, z: 0.44, rel: true },
    { t: 822.0, x: 1750, y: -1300, z: 0.95, rel: true },
    { t: 842.6, x: 1750, y: -1300, z: 1.0, rel: true },
    { t: 844.4, x: 300, y: -620, z: 0.42, rel: true },
    { t: 850.8, x: 200, y: -620, z: 0.45, rel: true },
    { t: 852.6, x: 1750, y: -1400, z: 0.75, rel: true },
    { t: 866.2, x: 1750, y: -1400, z: 0.8, rel: true },
    { t: 868.4, x: 600, y: -500, z: 0.45, rel: true },
    { t: 871.6, x: X_NAN2 + 500, y: -420, z: 0.62 },
    { t: 874.2, x: MUELLE - 100, y: -330, z: 0.85 },
    { t: 877.4, x: MUELLE + 700, y: -300, z: 0.92 },
    { t: 882.6, x: MUELLE + 900, y: -300, z: 0.98 },
    { t: 884.0, x: XQ - 400, y: -520, z: 0.55 },
    { t: 888.4, x: XQ - 300, y: -540, z: 0.6 },
    { t: 890.4, x: XQ - 300, y: -700, z: 0.42 },
    { t: 901, x: XQ - 250, y: -720, z: 0.44 },
  ],
  pal: [[803.5, "dia", 2], [831.0, "noche", 3], [843.0, "tarde", 3], [851.2, "manana", 3], [861.2, "humo", 3], [868.0, "tarde", 3], [888.8, "noche", 4]],
  mundo: (t) => {
    const x = bx(t);
    const mx = x + 1800;
    const eA = t >= 820.6 && t < 843 ? salidaE(t, 820.6, 843) : 0;
    const eC = t >= 851.2 && t < 866.8 ? salidaE(t, 851.2, 866.8) : 0;
    const baja = prog(t, 874.0, 875.7);
    const enMuelle = t > 875.7;
    return (
      <>
        <EnBarco t={t} x={x}>
          <Tripulacion t={t} capitan expr={() => (t > 872 ? "feliz" : "neutro")} />
          {t < 874.0 && <Chico x={X_CHICO} y={CUBIERTA} t={t} expr={t > 807 && t < 820 ? "sorpresa" : "neutro"} mira={0.4} />}
        </EnBarco>
        {/* planchada y el greenhand que baja */}
        {t >= 872.6 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}><line x1={x + PL[0]} y1={PL[1]} x2={PL[2]} y2={PL[3]} stroke="#9a6a3a" strokeWidth={22} strokeLinecap="round" /></svg>}
        {t >= 874.0 && !enMuelle && <Chico x={interpolate(baja, [0, 1], [x + PL[0], PL[2]])} y={interpolate(baja, [0, 1], [PL[1], PL[3]])} t={t} camina={1.4} inclina={6} expr="triste" />}
        {enMuelle && <Chico x={PL[2] + pz(t, [[875.7, 0], [877.3, 640], [883.0, 640], [884.6, 900]])} y={-60} t={t} camina={(t < 877.3) || (t > 883 && t < 884.6) ? 1.4 : 0} expr={t > 885.5 ? "sorpresa" : t > 881.2 ? "triste" : "neutro"} mira={t > 883 ? 1 : 0.5} viejo={false} />}
        {enMuelle && t > 880 && t < 884 && [0, 1, 2].map((k) => { const u = ((t - 880) * 0.7 + k / 3) % 1; return <Svg key={k} x={PL[2] + 640 + Math.sin(u * 7 + k) * 30} y={-320 - u * 200}><circle r={18 + u * 26} fill="#8a8a96" opacity={0.45 * (1 - u)} /></Svg>; })}
        {/* el cuáquero rico cuenta monedas frente a su casa */}
        {t >= 883.4 && (
          <>
            <Persona x={XQ + 260} y={-70} h={230} t={t} seed={33} ropa={CUAQUERO} casco="galera" pantalon="#2a2830" expr="orgullo" aparece={883.5} flip bD={60 + Math.sin(t * 6) * 25} />
            {Array.from({ length: Math.min(14, Math.floor((t - 883.6) * 4)) }, (_, k) => <Svg key={k} x={XQ + 120} y={-80 - k * 12}><ellipse rx={36} ry={12} fill="#f7c548" stroke="#a8781a" strokeWidth={4} /></Svg>)}
            {t >= 884.3 && <Svg x={XQ + 150} y={-330 - ((t * 1.4) % 1) * 160} rot={t * 300} s={0.6}><Moneda0 r={40} /></Svg>}
          </>
        )}
        {/* espejismo A: Chase capitán · Pollard naufraga · Pollard sereno */}
        {eA > 0 && (
          <>
            <Nubarron x={mx} y={-1150} w={1900} e={eA} />
            {t < 831.0 && (
              <>
                <Persona x={mx - 600} y={-1160} h={190 * eA} t={t} seed={60} ropa={CAPITAN} casco="capitan" pantalon="#1a1420" expr="orgullo" aparece={821.0} />
                <div style={{ position: "absolute", left: 0, top: 0, opacity: eA }}>
                  <Ballenero x={mx + pz(t, [[822.4, -100], [825.6, 300]])} y={-1160} t={t} escala={0.22} velas={1} roto={pz(t, [[825.6, 0], [827.8, 0.55]])} />
                </div>
                {[0, 1, 2, 3].map((k) => <Svg key={k} x={mx + 420 + k * 60} y={-1160}><path d={`M -40 10 L ${-10 + k * 4} ${-40 - (k % 2) * 30} L 40 10 Z`} fill="#5a5260" /></Svg>)}
                {t >= 827.9 && <Persona x={mx + 100} y={-1160} h={190} t={t} seed={11} ropa={CAPITAN} casco="no" barba="#3a2616" pantalon="#1a1420" expr="triste" aparece={827.9} />}
              </>
            )}
            {t >= 831.0 && (
              <>
                {[-700, -380, 380, 700].map((d, k) => <CasaNan key={d} x={mx + d} y={-1160} s={0.55} tono={["#9aa0a8", "#8e949c", "#a8aeb6", "#9aa0a8"][k]} luz={k === 2 && t > 837.7} />)}
                <Persona x={mx + pz(t, [[831.2, -300], [837.4, 200]])} y={-1160} h={190} t={t} seed={11} ropa={CAPITAN} casco="no" viejo barba="#d8d2cc" pantalon="#1a1420" camina={t < 837.4 ? 1 : 0} expr="triste" opacity={t > 837.7 ? pz(t, [[837.7, 1], [838.4, 0]]) : 1} manoD={<Farolito t={t} />} />
                {t >= 837.7 && <Calendario x={mx - 60} y={-1420} s={ent(t, 837.8) * 0.8} />}
                {t >= 839.4 && <Svg x={mx + 160} y={-1430} s={ent(t, 839.4) * 0.9}><ellipse rx={80} ry={26} fill="#f4f0e8" stroke="#2a1530" strokeWidth={6} /><path d="M -50 -60 L 50 40 M 50 -60 L -50 40" stroke={C.rojo} strokeWidth={14} strokeLinecap="round" /></Svg>}
              </>
            )}
          </>
        )}
        {/* espejismo C: Pensilvania 1859 · flotas pudriéndose */}
        {eC > 0 && (
          <>
            <Nubarron x={mx} y={-1150} w={1900} e={eC} />
            {t < 861.3 ? (
              <>
                {[-640, -400, 560].map((d) => <Svg key={d} x={mx + d} y={-1160} s={eC}><path d="M -160 0 Q 0 -140 160 0 Z" fill="#5a8a3a" /></Svg>)}
                <Torre x={mx} y={-1160} t={t} s={0.6 * eC} chorro={prog(t, 853.6, 855.2)} />
                {t >= 857.5 && <div style={{ position: "absolute", left: 0, top: 0 }}><Lampara x={mx + 420} y={-1250} t={t} s={0.55} /></div>}
              </>
            ) : (
              <div style={{ position: "absolute", left: 0, top: 0, filter: "grayscale(0.85) brightness(0.8)" }}>
                {[-560, 0, 560].map((d, k) => <Ballenero key={d} x={mx + d} y={-1160} t={t + k} escala={0.2} velas={0} roto={0.15 + k * 0.1} />)}
                {t >= 865.2 && <Torre x={mx + 820} y={-1160} t={t} s={0.4} chorro={1} />}
              </div>
            )}
          </>
        )}
      </>
    );
  },
  hud: (t) => (
    <>
      <Chip t={t} t0={803.6} t1={806.9} text="SO… WAS IT A DEATH TRAP?" color={C.violeta} x={960} y={140} centro size={60} />
      <Titulo t={t} t0={807.05} t1={808.2} text="HERE IS THE TWIST" y={200} size={130} color={C.ambar} />
      <Tacha t={t} t0={808.33} t1={812.0}><div style={{ position: "absolute", left: 350, top: 200 }}><Cachalote x={0} y={0} t={t} s={0.36} /></div></Tacha>
      <Chip t={t} t0={808.33} t1={809.3} text="IT WAS NOT THE WHALE" color={C.rojo} x={960} y={140} centro size={62} />
      <Chip t={t} t0={809.4} t1={812.0} text="THE WHALE SANK ONE SHIP" color="#5a5e6a" x={960} y={140} centro size={58} />
      <Chip t={t} t0={812.1} t1={818.3} text="THE REAL TRAP: THE PAPER YOU SIGNED" color={C.rojo} x={960} y={110} centro size={54} />
      <Articulos t={t} t0={812.2} t1={818.3} x={960} y={600} s={0.62} tx={812.8} lay="1/175" tLay={813.6} />
      <Chip t={t} t0={814.8} t1={818.3} text="MOST SURVIVORS WENT BACK TO SEA" color={C.violeta} x={960} y={1010} centro size={46} />
      <Titulo t={t} t0={818.5} t1={819.3} text="THEY HAD TO." y={200} size={140} color={C.crema} />
      <Chip t={t} t0={819.35} t1={820.7} text="THEY STILL HAD TO EAT" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={60} />
      <Chip t={t} t0={821.0} t1={830.9} text="OWEN CHASE: BECAME A CAPTAIN" color={C.teal} tinta={C.noche} x={960} y={140} centro size={50} />
      <Chip t={t} t0={823.2} t1={830.9} text="POLLARD: NEW SHIP · WRECKED ON A REEF" color={C.rojo} x={960} y={250} centro size={46} />
      <Chip t={t} t0={827.9} t1={830.9} text="NOBODY GAVE HIM A BOAT AGAIN" color="#5a5e6a" x={960} y={360} centro size={46} />
      <Chip t={t} t0={831.2} t1={837.5} text="POLLARD · NANTUCKET NIGHT WATCHMAN" color={C.violeta} x={960} y={140} centro size={50} />
      <Chip t={t} t0={833.6} t1={837.5} text="THE TOWN WHALE OIL BUILT" color={C.ambar} tinta={C.noche} x={960} y={250} centro size={46} />
      <Chip t={t} t0={837.7} t1={842.9} text="EVERY NOV 20: LOCKED IN · DID NOT EAT" color={C.rojo} x={960} y={140} centro size={50} />
      <Titulo t={t} t0={843.2} t1={845.0} text="THE FINAL IRONY" y={200} size={130} color={C.ambar} />
      <Chip t={t} t0={845.1} t1={849.3} text="THE INDUSTRY DIDN'T DIE BECAUSE OF A WHALE" color={C.violeta} x={960} y={140} centro size={46} />
      <Titulo t={t} t0={849.5} t1={851.2} text="…BUT A ROCK" y={220} size={150} color={C.crema} />
      {t >= 849.5 && t < 851.4 && <Svg x={960} y={620} s={ent(t, 849.6) * 1.4}><path d="M -160 80 Q -190 -10 -110 -80 Q -20 -140 90 -100 Q 190 -40 170 60 Q 120 110 -160 80 Z" fill="#6a6470" stroke="#2a1530" strokeWidth={8} /><path d="M -60 -50 L -10 10 M 60 -40 L 100 20" stroke="#4a4450" strokeWidth={8} /></Svg>}
      <Chip t={t} t0={851.4} t1={857.3} text="1859 · PENNSYLVANIA" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={853.6} t1={857.3} text="OIL · FROM THE GROUND" color="#2a2430" x={960} y={250} centro size={50} />
      <Chip t={t} t0={857.5} t1={861.1} text="KEROSENE: CHEAPER" color={C.lima} tinta={C.noche} x={960} y={140} centro size={46} />
      <Chip t={t} t0={858.3} t1={861.1} text="CLEANER" color={C.teal} tinta={C.noche} x={960} y={250} centro size={46} />
      <Chip t={t} t0={859.2} t1={861.1} text="NOBODY ROWS TOWARD IT" color={C.ambar} tinta={C.noche} x={960} y={360} centro size={46} />
      <Chip t={t} t0={861.3} t1={865.1} text="THE GREAT FLEETS: ROTTING IN HARBOR" color="#5a5e6a" x={960} y={140} centro size={50} />
      <Chip t={t} t0={865.2} t1={871.7} text="NOT BEATEN BY MOBY-DICK…" color={C.violeta} x={960} y={140} centro size={54} />
      <Chip t={t} t0={867.2} t1={871.7} text="…BY A HOLE IN THE GROUND" color={C.rojo} x={960} y={250} centro size={54} />
      <Chip t={t} t0={872.0} t1={876.8} text="HOME · NANTUCKET" color={C.violeta} x={960} y={140} centro size={58} />
      {[["4 YEARS OLDER", 877.0, C.violeta], ["SUNBURNED", 878.2, C.ambar], ["MISSING A TOOTH", 879.0, "#5a5e6a"], ["SMELLS OF SMOKE", 880.0, "#3a3440"], ["OWES THE SHIP $9", 881.2, C.rojo]].map(([txt, a, col], i) => (
        <Chip key={i} t={t} t0={a as number} t1={883.1} text={txt as string} color={col as string} x={1520} y={170 + i * 105} centro size={46} />
      ))}
      <Chip t={t} t0={883.3} t1={885.4} text="BIG BEAUTIFUL HOUSES" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={56} />
      <Titulo t={t} t0={885.5} t1={888.7} text="WHO WAS REALLY DOING THE HUNTING?" y={200} size={84} color={C.crema} />
      {/* CTA */}
      <Chip t={t} t0={888.9} t1={891.5} text="ENJOYED 4 YEARS ON A WHALING SHIP?" color={C.violeta} x={960} y={140} centro size={52} />
      {t >= 891.6 && t < 893.5 && (
        <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${ent(t, 891.6) * (1 + (t >= 892.4 && t < 892.8 ? 0.06 * Math.sin(t * 60) : 0))})`, display: "flex", gap: 40, alignItems: "center" }}>
          <div style={{ background: C.rojo, color: "#fff", fontFamily, fontWeight: 700, fontSize: 80, padding: "24px 60px", borderRadius: 24, boxShadow: "0 12px 0 #8a1a20" }}>SUBSCRIBE</div>
          {t >= 892.4 && <svg width={150} height={150} viewBox="-75 -75 150 150" style={{ transform: `rotate(${Math.sin(t * 30) * 14 * Math.max(0, 1 - (t - 892.4))}deg)` }}><path d="M -46 30 L -46 -10 Q -46 -56 0 -58 Q 46 -56 46 -10 L 46 30 L 60 46 L -60 46 Z" fill="#f7c548" stroke="#2a1530" strokeWidth={8} /><circle cy={58} r={14} fill="#f7c548" stroke="#2a1530" strokeWidth={6} /></svg>}
        </div>
      )}
      {t >= 893.6 && t < 896.5 && <Castillo e={ent(t, 893.6)} t={t} />}
      <Chip t={t} t0={893.6} t1={896.5} text="NEXT TIME: A MEDIEVAL PRISON" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={896.6} t1={901.5} text="WHICH TRAP WOULD GET YOU FIRST?" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={58} />
      {t >= 897.6 && ["THE RECRUITER", "THE LAY", "THE FORECASTLE", "THE BOAT", "THE FIRE", "THE CAPTAIN", "THE ESSEX"].map((n, i) => (
        <div key={i} style={{ position: "absolute", left: 960 + (i - 3) * 250, top: 600, transform: `translate(-50%,-50%) scale(${ent(t, 897.6 + i * 0.25)})`, width: 220, height: 220, borderRadius: 26, background: "#fff", border: "7px solid #2a1530", fontFamily, fontWeight: 700, textAlign: "center", color: "#2a1530" }}>
          <div style={{ fontSize: 96, color: C.rojo, marginTop: 12 }}>{i + 1}</div>
          <div style={{ fontSize: 26, marginTop: 4, padding: "0 10px" }}>{n}</div>
        </div>
      ))}
      {t >= 899.0 && <Emote t={t} t0={899.0} tipo="preg" x={1700} y={330} s={1.4} />}
    </>
  ),
};
