import React from "react";
import { C, prog, Chip } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA, Ropa } from "./persona";
import { Key, CUB, ALCA, BAT, MAR, BarcoLejos, Canon } from "./barco";
import { G, S, P, arco, Gato9, BolsaRoja, GatoAnimal, Tablon, Botella, Pistola, Cartucho, Moneda8, Precio, Sello, Signo, TINTA, Cota } from "./obj";
import { Txt, Lbl, Contador, Flash, en } from "./dsl";
import { CartelTrampa } from "./mundo";

// TRAMPA 4 · LOS CASTIGOS (369,8-466,1): justos con los piratas (más livianos que mercantes y marina), pero liviano ≠ suave.
// Phillips 1723: la ley de Moisés (40−1 = 39), el gato de nueve colas y su bolsa roja, el abandono en la isla con una
// pistola y una bala, la hija del artillero en la marina, el tablón = mito, el paso por la quilla = holandeses, y una soga.
const PHILLIPS: Ropa = { ...CAPITAN, tunica: "#2a5a3a", tunica2: "#173a24", gorroCol: "#1d1420", barba: "#5a3418", pelo: "#5a3418" };
const MARINO: Ropa = { ...PIRATA(1), tunica: "#2a3a6a", tunica2: "#1a2448", gorro: "tricornio", gorroCol: "#1a2448", barba: "#3a2a1a" };
const ISLA = 7800;

export const K4: Key[] = [
  [369.7, 1950, 1150, -1.3, 0.9],
  [372.1, 1900, 1350, 0.22, 1.4],
  [378.3, 2000, 1330, -1.4, 1.0],
  [382.5, 2050, 1340, -2.2, 0.6, "seco"],
  [385.1, 1000, 1080, -2.2, 0.8],
  [390.0, 2000, 1330, -2.0, 0.8],
  [392.3, 2050, 1300, -2.6, 0.5, "seco"],
  [394.5, 2050, 1260, -1.8, 0.8],
  [398.0, 2350, 1250, -3.2, 0.8],
  [401.1, 2350, 1300, -4.2, 2.4, "lineal"],
  [403.3, 2350, 1320, -3.0, 0.7],
  [406.6, 2420, 1360, -3.0, 0.6, "seco"],
  [410.8, 2050, 1310, -1.6, 0.8],
  [414.0, 2600, 1340, -2.1, 0.7],
  [416.6, ISLA, 1880, 2.0, 1.4],
  [418.3, ISLA - 40, 1880, 3.0, 1.0],
  [424.7, ISLA - 20, 1890, 4.2, 2.0],
  [426.9, ISLA - 100, 1880, 2.4, 2.0, "lineal"],
  [429.3, 900, 1690, -2.4, 1.2],
  [432.5, 900, 1720, -3.0, 0.7],
  [436.2, 900, 1700, -2.6, 0.7],
  [438.9, 3700, 1420, -2.0, 1.0],
  [440.6, 3800, 1380, -2.4, 0.5, "seco"],
  [442.3, 3700, 1400, -1.6, 0.8],
  [446.4, 3800, 1460, -1.9, 0.7],
  [448.3, 3950, 1700, -1.5, 1.0],
  [449.5, 4150, 1960, -1.9, 0.6],
  [451.3, 300, 2330, -1.8, 0.8],
  [452.1, 3600, 2340, -1.8, 6.5, "lineal"],
  [458.7, 2400, 2250, -0.75, 1.0],
  [461.8, 2050, 1340, -1.9, 1.0],
  [464.4, 2100, 1370, -2.9, 0.6, "seco"],
];

const LATIGAZOS = Array.from({ length: 12 }, (_, i) => 395.0 + i * 0.27);

export const A4: React.FC<{ t: number }> = ({ t }) => {
  if (t < 369 || t > 468) return null;
  const pelea = en(t, 389.8, 394.4);
  const castigo = en(t, 394.4, 398);
  const bolsa = en(t, 403.2, 410.7);
  const abre = prog(t, 406.7, 407.2);
  const gato = en(t, 406.9, 414) ? arco(t, 406.9, 407.9, [2350, 1290], [2560, CUB], 220) : null;
  return (
    <>
      {/* comparación: un pirata se escapa del látigo del mercante (y se suma a los piratas) */}
      {en(t, 378.2, 385) && <Persona x={interpolate3(t, 378.3, 381.5, 1750, 2200)} y={CUB} h={250} t={t} seed={210} ropa={PIRATA(5)} expr={t < 380.6 ? "miedo" : "feliz"} camina={t < 381.5 ? 2.4 : 0} />}
      {en(t, 378.2, 382.4) && <Persona x={interpolate3(t, 378.3, 381.5, 1450, 1700)} y={CUB} h={265} t={t} seed={211} ropa={{ ...CAPITAN, tunica: "#3d6fa8", tunica2: "#24486e" }} expr="enojado" camina={t < 381.5 ? 2 : 0} bD={140 + Math.sin(t * 10) * 30} cD={20} manoD={<g transform="scale(0.25) rotate(180)"><Gato9 t={t} latigo={379} /></g>} />}
      {en(t, 378.2, 385) && [2300, 2500].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={212 + i} ropa={PIRATA(i + 2)} flip expr="feliz" bD={t > 380.6 ? 160 : 10} cD={t > 380.6 ? 0 : 30} />)}
      {/* Phillips */}
      {en(t, 385, 390) && <Persona x={1000} y={ALCA} h={270} t={t} seed={214} ropa={PHILLIPS} flip expr="orgullo" habla bD={80} cD={60} />}
      {/* pelea → castigo atado al mástil mayor */}
      {pelea && <Persona x={t < 391.8 ? 1880 : 1900} y={CUB} h={250} t={t} seed={215} ropa={PIRATA(1)} expr="enojado" bD={en(t, 391.8, 392.4) ? 90 : 40} cD={en(t, 391.8, 392.4) ? 0 : 90} habla={t < 391.8} />}
      {pelea && <Persona x={2200} y={CUB} h={250} t={t} seed={216} ropa={PIRATA(4)} flip expr={t > 392 ? "sorpresa" : "enojado"} inclina={t > 392 ? -Math.min(20, (t - 392) * 80) : 0} habla={t < 391.8} />}
      {castigo && <Persona x={2050} y={CUB} h={250} t={t} seed={215} ropa={PIRATA(1)} flip expr="miedo" bD={170} bI={170} cD={0} cI={0} />}
      {castigo && <Persona x={2330} y={CUB} h={275} t={t} seed={217} ropa={PIRATA(3)} flip expr="enojado" bD={LATIGAZOS.some((a) => en(t, a, a + 0.12)) ? 30 : 150} cD={20} manoD={<g transform="scale(0.24) rotate(180)"><Gato9 t={t} /></g>} />}
      {en(t, 389.6, 403.2) && <Persona x={2190} y={CUB} h={265} t={t} seed={217} ropa={PIRATA(3)} expr="orgullo" habla={en(t, 398.2, 403)} bD={100 + Math.sin(t * 3) * 6} cD={25} />}
      {/* el gato y su bolsa: la tripulación mira con terror */}
      {en(t, 410.7, 414) && [1750, 1950, 2150, 2350].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={220 + i} ropa={PIRATA(i)} flip={x > 2050} expr="miedo" ladea={(i - 1.5) * 4} />)}
      {/* robar / desertar */}
      {en(t, 414, 416.6) && <Persona x={interpolate3(t, 414.6, 416.4, 2450, 3050)} y={CUB} h={250} t={t} seed={224} ropa={PIRATA(2)} expr="miedo" camina={3} manoD={<g transform="translate(0 30) scale(0.35)"><Moneda8 r={40} oro t={t} /></g>} />}
      {/* marina: el chico sobre el cañón */}
      {en(t, 429.2, 438.9) && <Persona x={760} y={BAT} h={180} t={t} seed={7} ropa={GRUMETE} expr="miedo" inclina={t > 432.6 ? 78 : 0} bD={t > 432.6 ? 150 : 10} bI={t > 432.6 ? 150 : 10} />}
      {en(t, 429.2, 438.9) && <Persona x={1080} y={BAT} h={275} t={t} seed={225} ropa={MARINO} flip expr="enojado" bD={en(t, 433, 436.2) ? 60 + Math.abs(Math.sin(t * 7)) * 90 : 30} cD={20}
        manoD={<g transform="scale(0.3)"><rect x={-8} y={-10} width={16} height={300} rx={8} fill="#a8783a" /></g>} />}
      {/* el tablón (mito) */}
      {en(t, 438.8, 451.3) && <G><g transform={`translate(3640 ${CUB - 70}) rotate(${t > 448.4 ? Math.min(80, (t - 448.4) * 120) : 0})`}><Tablon largo={460} /></g></G>}
      {en(t, 438.8, 446.4) && <Persona x={3880} y={CUB - 86} h={250} t={t} seed={226} ropa={PIRATA(5)} expr="miedo" bD={40} bI={40} ladea={Math.sin(t * 3) * 6} />}
      {en(t, 448.3, 451.4) && (() => {
        const cae = t < 449.4 ? arco(t, 448.4, 449.4, [3990, CUB - 86], [4180, 2030], 140) : { x: 4180, y: 2030 + prog(t, 449.4, 449.8) * 70 + Math.sin(t * 5) * 10, u: 1 };
        return <>
          <Persona x={cae.x} y={cae.y} h={250} t={t} seed={226} ropa={PIRATA(5)} expr="miedo" bD={170 + Math.sin(t * 13) * 15} bI={170 - Math.sin(t * 13) * 15} cD={0} cI={0} inclina={t < 449.4 ? cae.u * 40 : Math.sin(t * 4) * 8} />
          {t > 449.4 && <G><path d={`M 3900 2030 Q 3990 ${2015 + Math.sin(t * 4) * 8} 4080 2030 T 4260 2030 T 4440 2030 L 4440 2330 L 3900 2330 Z`} fill="url(#aguaKH)" /><defs><linearGradient id="aguaKH" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#2f9ad0" stopOpacity={0} /><stop offset="0.3" stopColor="#2f9ad0" stopOpacity={0.9} /><stop offset="0.7" stopColor="#2f9ad0" stopOpacity={0.9} /><stop offset="1" stopColor="#2f9ad0" stopOpacity={0} /></linearGradient></defs></G>}
          {t > 449.4 && <G>{[0, 1, 2].map((k) => { const d = ((t - 449.4) * 0.9 + k / 3) % 1; return <ellipse key={k} cx={4180} cy={2035} rx={60 + d * 260} ry={(60 + d * 260) * 0.18} fill="none" stroke="#e8fbff" strokeWidth={8} opacity={1 - d} />; })}</G>}
        </>;
      })()}
      {en(t, 446.4, 448.3) && [3300, 3480].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={227 + i} ropa={PIRATA(i + 1)} expr="orgullo" bD={30} />)}
      {/* paso por la quilla */}
      {en(t, 451.2, 461.8) && (() => {
        const u = prog(t, 452.0, 458.6);
        const x = 300 + u * 3300;
        const y = 2385 + Math.sin(u * Math.PI) * 30;
        return <>
          <G><g transform={`translate(${x} ${y - 8}) rotate(${Math.sin(t * 9) * 4})`}>
            <rect x={-150} y={-14} width={90} height={14} rx={7} fill="#2a3a6a" /><rect x={-150} y={2} width={90} height={14} rx={7} fill="#2a3a6a" />
            <rect x={-70} y={-26} width={110} height={52} rx={20} fill="#3a8a5a" />
            <path d="M 30 -22 L 110 -40 M 30 22 L 110 40" stroke="#e8b48a" strokeWidth={14} strokeLinecap="round" />
            <circle cx={70} cy={0} r={34} fill="#e8b48a" /><circle cx={80} cy={-10} r={7} fill={TINTA} /><circle cx={80} cy={10} r={7} fill={TINTA} />
            <ellipse cx={100} cy={0} rx={6} ry={10} fill={TINTA} />
            {[0, 1, 2].map((k) => <circle key={k} cx={110 + k * 14} cy={-30 - ((t * 60 + k * 25) % 80)} r={6 + k * 2} fill="none" stroke="#e8fbff" strokeWidth={3} />)}
          </g></G>
          <G>
            <path d={`M 120 ${CUB - 40} Q 80 2300 ${x - 120} ${y - 50}`} stroke="#c9a06a" strokeWidth={10} fill="none" />
            <path d={`M ${x + 100} ${y - 50} Q 3800 2300 3720 ${CUB - 40}`} stroke="#c9a06a" strokeWidth={10} fill="none" />
            {Array.from({ length: 34 }, (_, i) => <ellipse key={i} cx={250 + i * 102} cy={2338 + (i % 3) * 4} rx={16} ry={10} fill={i % 2 ? "#e8e2f0" : "#c8c0d0"} stroke={TINTA} strokeWidth={3} />)}
          </G>
        </>;
      })()}
      {/* la soga: más barata */}
      {en(t, 461.7, 467) && <Persona x={1900} y={CUB} h={250} t={t} seed={230} ropa={PIRATA(0)} expr="orgullo" bD={110} cD={40} manoD={<g transform="scale(0.32)"><path d="M 0 0 Q 40 120 -10 240" stroke="#c9a06a" strokeWidth={30} fill="none" strokeLinecap="round" /><circle cx={-10} cy={250} r={26} fill="#a8803a" /></g>} />}
      {en(t, 461.7, 467) && <Persona x={2250} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} flip expr="miedo" />}
      <G>
        {/* 372: tres barcos, tres castigos */}
        {[[-1500, "NAVY", 3], [5300, "MERCHANT", 2], [1900, "PIRATES", 1]].map(([x, txt, n], i) => en(t, 373.0 + i * 0.6, 378.2) && (
          <g key={i}>
            <Lbl t={t} t0={373.0 + i * 0.6} t1={378.2} x={x as number} y={i === 2 ? 380 : 520} txt={txt as string} size={i === 2 ? 330 : 260} color={i === 2 ? C.lima : C.crema} />
            {Array.from({ length: n as number }, (_, k) => <g key={k} transform={`translate(${(x as number) - ((n as number) - 1) * 230 + k * 460} ${i === 2 ? 560 : 700}) scale(${0.8 * prog(t, 373.3 + i * 0.6 + k * 0.15, 373.6 + i * 0.6 + k * 0.15)})`}><Gato9 t={t} /></g>)}
          </g>
        ))}
        {[373.0, 373.6, 374.2].map((a, i) => <S key={i} t={a} p="whip" g={-10} pitch={1 + i * 0.1} />)}
        <S t={375.6} p="ding" g={-10} />
        <Lbl t={t} t0={379.0} t1={382.4} x={1800} y={1190} txt="NO MORE BEATINGS!" size={44} color={C.lima} />
        <S t={378.9} p="whip" g={-6} />
        <S t={379.5} p="run" g={-8} d={2} />
        <S t={380.7} p="cheer" g={-10} />
        {/* Phillips 1723 */}
        <S t={385.4} p="fanfare" g={-12} />
        <S t={386.3} p="paper" g={-6} />
        {/* golpe */}
        <S t={391.9} p="punch" g={-4} />
        <Flash t={t} t0={391.9} d={0.15} />
        {/* mástil + 40 − 1 */}
        {castigo && <rect x={2040} y={1150} width={30} height={330} fill="none" />}
        {LATIGAZOS.map((a, i) => <S key={i} t={a} p="whip" g={-8} pitch={0.95 + (i % 4) * 0.05} />)}
        {/* el gato de nueve colas */}
        <P t={t} t0={398.0} t1={403.2} x={2350} y={1180} s={0.55} rot={-8}><Gato9 t={t} /></P>
        <Lbl t={t} t0={398.6} t1={403.1} x={2230} y={1365} txt="CAT O' NINE TAILS" size={24} color={C.oro} />
        <Cota t={t} t0={401.3} t1={403.1} x1={2470} y1={1170} x2={2470} y2={1320} txt="9 KNOTS ×3" size={22} />
        <S t={398.1} p="whoosh" g={-6} />
        <S t={401.3} p="rope" g={-8} />
        {[401.6, 401.9, 402.2].map((a, i) => <S key={i} t={a} p="pop" g={-14} pitch={1 + i * 0.15} />)}
        {/* la bolsa roja */}
        {bolsa && <g transform={`translate(2350 1330) scale(${0.42 * prog(t, 403.2, 403.6)}) rotate(${en(t, 406.0, 406.7) ? Math.sin(t * 40) * 6 : 0})`}><BolsaRoja abre={abre} /></g>}
        {gato && <g transform={`translate(${gato.x} ${gato.y}) scale(0.4) rotate(${gato.u < 1 ? gato.u * 360 : 0})`}><GatoAnimal t={t} /></g>}
        {gato && gato.u >= 1 && t < 410.6 && <Lbl t={t} t0={407.9} t1={410.6} x={2560} y={1390} txt="MEOW?" size={30} color={C.crema} />}
        <S t={403.3} p="cloth" g={-6} />
        <S t={406.0} p="squeak" g={-10} />
        <S t={406.9} p="cat" g={-6} />
        <S t={407.8} p="pop" g={-8} />
        <Lbl t={t} t0={411.0} t1={413.9} x={2050} y={1150} txt="DON'T OPEN IT" size={60} color={C.rojo} />
        <S t={410.9} p="suspense" g={-10} d={2.6} />
        {/* robar / huir */}
        <Lbl t={t} t0={414.5} t1={416.5} x={2650} y={1160} txt="STEAL? RUN?" size={56} color={C.rojo} />
        <S t={414.6} p="run" g={-8} d={1.6} />
        <S t={414.4} p="coin" g={-10} />
        {/* la marina: kissing the gunner's daughter */}
        <Lbl t={t} t0={429.6} t1={432.4} x={900} y={1570} txt="ROYAL NAVY" size={44} color={C.crema} />
        <S t={429.4} p="whoosh_big" g={-6} />
        <S t={432.6} p="rope" g={-6} />
        {[433.3, 434.0, 434.7, 435.4].map((a, i) => <S key={i} t={a} p="whip" g={-10} pitch={1.2} />)}
        {/* el tablón */}
        <S t={438.9} p="creak" g={-6} />
        <S t={440.7} p="stamp" g={-3} />
        <Lbl t={t} t0={442.5} t1={446.3} x={3700} y={1150} txt="ONLY A HANDFUL · MOSTLY 1800s" size={40} color={C.crema} />
        <S t={442.5} p="write" g={-12} />
        <S t={448.5} p="creak" g={-6} />
        <S t={449.4} p="splash" g={-4} />
        {/* quilla */}
        <Lbl t={t} t0={451.6} t1={455.5} x={900} y={2200} txt="KEELHAULING" size={70} color={C.oro} />
        <S t={451.5} p="bubble" g={-8} d={6} />
        <S t={452.0} p="rope" g={-6} />
        {[453.0, 454.2, 455.4, 456.6, 457.8].map((a, i) => <S key={i} t={a} p="crunch" g={-12} pitch={1.1} />)}
        <Lbl t={t} t0={455.8} t1={458.6} x={2650} y={2200} txt="BARNACLES" size={52} color={C.crema} />
        <S t={458.9} p="ding" g={-10} />
        <S t={462.0} p="fail" g={-12} />
        <P t={t} t0={464.5} t1={466.2} x={2260} y={1330} s={0.38} rot={-8}><Precio txt="CHEAP" t={t} c={C.lima} /></P>
        <S t={464.5} p="coin" g={-6} />
        <S t={465.0} p="whip" g={-8} />
      </G>
    </>
  );
};
const interpolate3 = (t: number, a: number, b: number, x0: number, x1: number) => x0 + (x1 - x0) * prog(t, a, b);

// mundo: la marina y el mercante a los lados, el abandonado en la isla
export const M4: React.FC<{ t: number }> = ({ t }) => {
  if (t < 371 || t > 461) return null;
  const isla = en(t, 416.4, 429.3);
  return (
    <>
      {en(t, 371.5, 378.4) && <BarcoLejos x={-1500} y={MAR - 40} t={t} s={2.0} tipo="marina" />}
      {en(t, 371.5, 378.4) && <BarcoLejos x={5300} y={MAR - 40} t={t} s={2.0} tipo="mercante" flip />}
      {isla && <Persona x={ISLA - 100} y={1945} h={180} t={t} seed={231} ropa={PIRATA(2)} expr={t > 424.6 ? "triste" : "miedo"} flip={t > 424.6} />}
      {isla && <G>
        <P t={t} t0={419.0} x={ISLA - 230} y={1935} s={0.3}><Botella c="#7ac8e8" txt="H₂O" /></P>
        <P t={t} t0={421.5} x={ISLA + 20} y={1935} s={0.3}><Botella c="#3a3a3a" txt="☢" /></P>
        <P t={t} t0={422.6} x={ISLA + 90} y={1945} s={0.22} rot={-15}><Pistola t={t} /></P>
        <P t={t} t0={423.7} x={ISLA + 150} y={1940} s={0.25}><Cartucho /></P>
        <Lbl t={t} t0={416.8} t1={418.6} x={ISLA} y={1640} txt="MAROONED" size={90} color={C.oro} />
        <S t={416.4} p="whoosh_big" g={-4} />
        <S t={417.0} p="sea" g={-12} d={6} />
        <S t={419.0} p="drop" g={-6} />
        <S t={421.5} p="drop" g={-6} />
        <S t={422.6} p="metal" g={-8} />
        <S t={423.7} p="tick" g={-6} />
        <S t={424.7} p="suspense" g={-8} d={4} />
        <S t={427.0} p="heart" g={-10} />
      </G>}
    </>
  );
};

export const O4: React.FC<{ t: number }> = ({ t }) => {
  if (t < 369 || t > 468) return null;
  return (
    <>
      {en(t, 407.6, 410.6) && <Persona x={330} y={1050} h={420} t={t} seed={7} ropa={GRUMETE} expr="miedo" bD={140} cD={100} aparece={407.6} />}
      <CartelTrampa t={t} t0={369.84} n={4} nombre="THE PUNISHMENTS" t1={372.0} />
      <S t={369.84} p="whoosh_big" g={-4} />
      <S t={370.05} p="wood_hit" g={-4} />
      <Txt t={t} t0={372.2} t1={374.4} text="LET'S BE FAIR" y={150} size={100} />
      <Txt t={t} t0={382.6} t1={385.0} text="LIGHTER ≠ LIGHT" y={170} size={140} color={C.rojo} />
      <S t={382.6} p="stamp" g={-6} />
      {en(t, 386.2, 390.0) && (
        <div style={{ position: "absolute", left: 1180, top: 230, width: 660, transform: `scale(${prog(t, 386.2, 386.6)}) rotate(2deg)`, transformOrigin: "50% 0", background: "#f4ead2", border: `10px solid #8a5a2a`, borderRadius: 18, padding: "26px 36px", boxShadow: "0 16px 0 rgba(20,10,40,.4)", fontFamily: "Fredoka", fontWeight: 700, color: TINTA }}>
          <div style={{ fontSize: 46, color: C.rojo, letterSpacing: 3 }}>JOHN PHILLIPS · 1723</div>
          <div style={{ fontSize: 30, color: "#8a5a2a", marginBottom: 12 }}>THE PRICE LIST</div>
          {[["STRIKE A MAN", "39 LASHES", 387.0], ["STEAL", "MAROONED", 387.8], ["DESERT", "MAROONED", 388.6]].map(([a, b, t0], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 40, lineHeight: 1.35, opacity: t > (t0 as number) ? 1 : 0, transform: `translateX(${t > (t0 as number) ? 0 : -40}px)` }}><span>{a}</span><span style={{ color: C.rojo }}>{b}</span></div>
          ))}
        </div>
      )}
      {[387.0, 387.8, 388.6].map((a, i) => <S key={i} t={a} p="write" g={-10} />)}
      <Txt t={t} t0={392.6} t1={394.4} text="MOSES' LAW" y={170} size={130} color={C.oro} />
      <S t={392.6} p="boom" g={-8} />
      <Contador t={t} t0={394.6} t1={398.0} de={0} a={39} x={960} y={190} size={170} color={C.rojo} post=" LASHES" tFin={398.0} />
      <Txt t={t} t0={396.4} t1={398.0} text="40 − 1" y={330} size={80} color={C.crema} />
      <Txt t={t} t0={407.6} t1={410.6} text="LETTING THE CAT OUT OF THE BAG" y={170} size={84} color={C.oro} />
      <S t={407.6} p="sparkle" g={-10} />
      <Txt t={t} t0={424.8} t1={426.8} text="NOT FOR HUNTING" y={900} size={84} color={C.crema} />
      {(["1 · WATER", "2 · POWDER", "3 · PISTOL", "4 · ONE SHOT"]).map((x, i) => <Chip key={i} t={t} t0={[419.0, 421.4, 422.4, 423.6][i]} t1={426.8} text={x} color={i === 3 ? C.rojo : C.teal} x={1380} y={260 + i * 115} size={56} />)}
      {en(t, 426.9, 429.3) && <div style={{ position: "absolute", inset: 0, background: `rgba(10,5,20,${0.55 * prog(t, 426.9, 428.2)})` }} />}
      <Txt t={t} t0={436.3} t1={438.8} text="“KISSING THE GUNNER'S DAUGHTER”" y={170} size={78} color={C.oro} />
      <S t={436.3} p="sparkle" g={-12} />
      <Txt t={t} t0={439.0} t1={440.5} text="WALKING THE PLANK?" y={930} size={110} />
      {en(t, 440.6, 442.3) && <div style={{ position: "absolute", left: 1180, top: 330 }}><svg width={1} height={1} style={{ overflow: "visible" }}><Sello t={t} t0={440.6} txt="MYTH" size={130} /></svg></div>}
      <Txt t={t} t0={446.5} t1={448.2} text="NO THEATER NEEDED" y={170} size={100} color={C.lila} />
      <Txt t={t} t0={448.5} t1={451.2} text="THE SEA IS ENOUGH" y={170} size={110} color={C.teal} />
      <Txt t={t} t0={458.8} t1={461.7} text="DUTCH NAVY · LONG BEFORE" y={170} size={90} color={C.oro} />
      {en(t, 458.8, 461.7) && <Persona x={1640} y={1050} h={400} t={t} seed={7} ropa={GRUMETE} expr="miedo" ladea={Math.sin(t * 3) * 5} bD={110} cD={60} aparece={458.8} />}
      <Txt t={t} t0={461.9} t1={464.3} text="TOO MUCH TROUBLE" y={170} size={110} />
      <Txt t={t} t0={464.5} t1={466.1} text="A ROPE'S END" y={170} size={120} color={C.lima} />
    </>
  );
};
export const _4 = { Canon, Signo };
