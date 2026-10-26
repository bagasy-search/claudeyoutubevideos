import React from "react";
import { C, prog, Chip } from "./kit";
import { Persona, GRUMETE, PIRATA, Ropa } from "./persona";
import { Key, CUB, BAT, BOD, Hamaca, Rata, Barril } from "./barco";
import { G, S, P, arco, Galleta, Gorgojo, Queso, Carne, Arvejas, Diente, Tortuga, Fruta, Cuenco, Pupitre, Balde, Nube, Globo, Cota, Botella, TINTA } from "./obj";
import { Txt, Lbl, Contador, en } from "./dsl";
import { CartelTrampa } from "./mundo";

// TRAMPA 5 · LA COMIDA (466,1-571,5): la despensa del primer día, la galleta que rompe dientes, las semanas que pasan
// (carne gris, queso con opiniones, gorgojos), comer a oscuras, el agua verde, cerveza y ron, las ratas (y comérselas),
// semana buena / semana mala, el salmagundi y de noche las hamacas de 14 pulgadas encima de la sentina.
const COCINERO: Ropa = { ...PIRATA(4), tunica: "#f4ead2", tunica2: "#c9b98a", gorro: "no", pataPalo: true, barba: "#5a3418" };

export const K5: Key[] = [
  [468.5, 2300, 1360, -1.7, 0.9],
  [476.1, 2650, 1360, -3.2, 0.7, "seco"],
  [480.0, 2650, 1360, -3.8, 0.4, "seco"],
  [481.9, 2400, 1360, -2.0, 0.7],
  [484.9, 2050, 1380, -3.0, 0.7],
  [487.1, 2350, 1380, -3.0, 0.6, "seco"],
  [489.8, 2650, 1380, -3.2, 0.6, "seco"],
  [491.8, 2650, 1400, -6.0, 0.6],
  [494.4, 2550, 1390, -2.6, 0.7],
  [497.5, 2300, 1350, -2.0, 0.8],
  [501.5, 1600, 1390, -2.6, 0.9],
  [503.5, 1600, 1420, -3.6, 0.8],
  [508.0, 1800, 1380, -1.9, 0.8],
  [511.2, 1800, 1370, -1.6, 0.8],
  [515.4, 2100, 1420, -2.2, 0.6, "seco"],
  [519.7, 2500, 1420, -3.4, 0.6],
  [520.9, 2300, 1360, -2.2, 0.8],
  [524.5, 2550, 1420, -3.6, 0.7],
  [527.9, 1950, 1330, -1.6, 1.0],
  [530.1, 1700, 1380, -2.0, 1.0],
  [535.4, 2700, 1380, -2.0, 1.0],
  [538.8, 3420, 1380, -2.4, 1.0],
  [541.2, 3370, 1360, -2.6, 0.8],
  [548.4, 3370, 1350, -3.0, 0.6, "seco"],
  [552.4, 1750, 1640, -2.0, 1.2],
  [556.0, 1650, 1620, -3.4, 0.8],
  [560.5, 1720, 1620, -3.0, 0.7],
  [562.9, 1750, 1640, -1.9, 0.9],
  [567.6, 1750, 1900, -1.7, 1.4],
];

// la despensa del primer día sobre la mesa
const MESA = 2050;
const COMIDA: [number, number, string, string][] = [[471.6, 0, "BEEF", "carne"], [472.4, 1, "PORK", "cerdo"], [473.3, 2, "PEAS", "arvejas"], [474.2, 3, "CHEESE", "queso"], [475.0, 4, "BISCUIT", "galleta"]];

export const A5: React.FC<{ t: number }> = ({ t }) => {
  if (t < 466 || t > 573) return null;
  const semanas = t > 484.9;
  const mesa = en(t, 468.4, 501.5);
  const ratas = en(t, 515.3, 527.9);
  return (
    <>
      {/* el cocinero (pata de palo) y el chico */}
      {en(t, 468.4, 484.9) && <Persona x={1860} y={CUB} h={265} t={t} seed={240} ropa={COCINERO} expr="orgullo" habla={t < 471.3} bD={en(t, 471.3, 476) ? 100 : 20} cD={40} />}
      {en(t, 468.4, 476) && <Persona x={2620} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} flip expr="feliz" bD={en(t, 469, 471.3) ? 125 + Math.abs(Math.sin(t * 6)) * 25 : 30} cD={en(t, 469, 471.3) ? 120 : 20} manoD={en(t, 469, 471.3) ? <g transform="scale(0.2)"><Galleta /></g> : undefined} />}
      <S t={469.2} p="munch" g={-10} />
      {en(t, 476, 484.9) && <Persona x={2860} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} flip expr={t > 480.1 ? "miedo" : "neutro"} bD={120} cD={60} salta={480.1}
        manoD={t < 480.1 ? <g transform="scale(0.3)"><Galleta /></g> : undefined} />}
      {en(t, 494.3, 501.5) && <Persona x={2300} y={CUB} h={250} t={t} seed={241} ropa={PIRATA(2)} expr={t > 497.5 ? "dormido" : "enojado"} bD={t < 497.5 ? 90 + Math.abs(Math.sin(t * 9)) * 40 : 60} cD={40}
        manoD={<g transform="scale(0.28)"><Galleta bichos={2} t={t} /></g>} />}
      {/* el agua y la cerveza */}
      {en(t, 508, 515.3) && [1500, 1700, 1900].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={242 + i} ropa={PIRATA(i)} expr="feliz" bD={en(t, 508.3 + i * 0.3, 512.7) ? 150 : 30} cD={40}
        manoD={<g transform="translate(0 -10) scale(0.26)"><Botella c={i === 1 ? "#7a3a1a" : "#5a8a3a"} /></g>} />)}
      {/* ratas: el que se come la rata */}
      {en(t, 520.9, 524.4) && <Persona x={2150} y={CUB} h={255} t={t} seed={245} ropa={PIRATA(5)} expr="feliz" habla bD={130} cD={30}
        manoD={<g transform="translate(0 40) rotate(90) scale(0.9)"><Rata x={0} y={0} t={t} /></g>} />}
      {en(t, 519.6, 524.4) && <Persona x={2500} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} flip expr={t < 520.9 ? "triste" : "sorpresa"} />}
      {/* buena semana / mala semana */}
      {en(t, 530, 538.8) && <Persona x={1450} y={CUB} h={255} t={t} seed={246} ropa={PIRATA(1)} expr="feliz" bD={150} bI={150} cD={0} cI={0} />}
      {en(t, 535.3, 538.8) && <Persona x={2950} y={CUB} h={255} t={t} seed={247} ropa={PIRATA(3)} flip expr="triste" />}
      {/* salmagundi */}
      {en(t, 538.7, 552.4) && <Persona x={3270} y={CUB} h={265} t={t} seed={240} ropa={COCINERO} expr={t > 549.5 && t < 550.6 ? "sorpresa" : "orgullo"} habla={t > 549.4 && t < 550.6}
        bD={en(t, 541.2, 548.4) ? 110 + Math.sin(t * 8) * 25 : en(t, 548.4, 550.6) ? 140 + Math.abs(Math.sin(t * 20)) * 30 : 30} cD={50} />}
      <G>
        {/* mesa */}
        {mesa && <g><rect x={MESA - 60} y={CUB - 90} width={720} height={22} rx={8} fill="#a8682f" /><rect x={MESA - 40} y={CUB - 70} width={18} height={70} fill="#7a4520" /><rect x={MESA + 620} y={CUB - 70} width={18} height={70} fill="#7a4520" /></g>}
        {mesa && COMIDA.map(([t0, i, txt, k]) => {
          const x = MESA + 40 + i * 140;
          if (t < t0) return null;
          const s = 0.55 * prog(t, t0, t0 + 0.25);
          const gris = prog(t, 485.2, 486.4);
          return (
            <g key={i}>
              <g transform={`translate(${x} ${CUB - 130}) scale(${s})`}>
                {k === "carne" || k === "cerdo" ? <g style={{ filter: k === "cerdo" ? "hue-rotate(-20deg) saturate(.6) brightness(1.3)" : undefined }}><Carne gris={gris} /></g>
                  : k === "arvejas" ? <Arvejas />
                    : k === "queso" ? <Queso t={t} cara={t > 487.1} habla={en(t, 487.6, 489.8)} verde={prog(t, 487.1, 487.6)} />
                      : <g transform={`translate(0 ${en(t, 494.6, 497.4) ? -Math.abs(Math.sin((t - 494.6) * 8)) * 60 : 0})`}><Galleta t={t} bichos={t > 489.9 ? Math.min(8, Math.floor((t - 489.9) * 5)) : 0} /></g>}
              </g>
              <Lbl t={t} t0={t0} t1={476.0} x={x} y={CUB - 230 - (i % 2) * 40} txt={txt} size={30} color={C.crema} />
            </g>
          );
        })}
        {COMIDA.map(([t0], i) => <S key={i} t={t0} p="pop" g={-8} pitch={0.9 + i * 0.08} />)}
        {/* la galleta del chico: dura como piedra */}
        <Lbl t={t} t0={476.3} t1={479.9} x={2650} y={1280} txt="SHIP'S BISCUIT" size={36} color={C.oro} />
        <Lbl t={t} t0={477.6} t1={479.9} x={2650} y={1450} txt="LASTS FOR MONTHS" size={30} color={C.crema} />
        <S t={476.3} p="knock" g={-6} />
        <S t={477.0} p="knock" g={-6} pitch={0.9} />
        {t > 480.1 && t < 483.4 && (() => { const p = arco(t, 480.1, 481.2, [2830, 1320], [3000, CUB], 160); return <g transform={`translate(${p.x} ${p.y}) rotate(${(t - 480.1) * 900}) scale(0.28)`}><Diente /></g>; })()}
        <S t={480.1} p="crunch" g={-2} />
        <S t={480.2} p="glass" g={-10} />
        <S t={481.2} p="drop" g={-10} pitch={1.6} />
        {en(t, 481.9, 483.4) && Array.from({ length: 9 }, (_, i) => { const p = arco(t, 481.9 + i * 0.1, 482.6 + i * 0.1, [2000 + i * 90, 1100], [2000 + i * 90, CUB - 10], -80); return t > 481.9 + i * 0.1 && <g key={i} transform={`translate(${p.x} ${p.y}) scale(0.2)`}><Diente /></g>; })}
        {Array.from({ length: 9 }, (_, i) => <S key={i} t={482.6 + i * 0.1} p="drop" g={-16} pitch={1.4 + i * 0.05} />)}
        {/* semanas */}
        <Lbl t={t} t0={485.3} t1={487.0} x={2050} y={1250} txt="GRAY & STRINGY" size={34} color="#c8c0d0" />
        <S t={485.2} p="squish" g={-8} />
        {en(t, 487.6, 489.8) && <g transform="translate(2480 1290) scale(0.3)"><Globo txt="I HAVE OPINIONS." w={560} /></g>}
        <S t={487.6} p="squeak" g={-8} />
        <S t={488.4} p="laugh" g={-12} pitch={1.4} />
        <Lbl t={t} t0={490.0} t1={491.7} x={2650} y={1260} txt="WEEVILS" size={50} color={C.lima} />
        <S t={490.0} p="bug" g={-8} d={3} />
        {en(t, 491.8, 494.4) && <g transform="translate(2650 1395)"><Gorgojo s={0.7} t={t} rot={Math.sin(t * 5) * 10} /></g>}
        <Lbl t={t} t0={492.0} t1={494.3} x={2650} y={1462} txt="LIVING IN YOUR BREAD" size={14} color={C.crema} />
        <S t={491.9} p="bug" g={-6} pitch={0.8} />
        {[494.8, 495.3, 495.8, 496.3, 496.8].map((a, i) => <S key={i} t={a} p="knock" g={-6} />)}
        {en(t, 494.8, 497.6) && Array.from({ length: 10 }, (_, i) => { const a = 494.9 + i * 0.25; const p = arco(t, a, a + 0.7, [2610, CUB - 140], [2400 + i * 50, CUB - 95], 90); return t > a && <Gorgojo key={i} x={p.x} y={p.y} s={0.2} t={t} rot={(t - a) * 500} />; })}
        {/* agua en barriles */}
        {en(t, 501.4, 512.8) && <Barril x={1450} y={CUB} s={1.1} txt="WATER" />}
        {en(t, 501.4, 512.8) && <g transform={`translate(1650 ${CUB - 50}) scale(0.5)`}><Balde t={t} agua={t > 503.6 ? "#6a9a3a" : "#7ab8d8"} peste={t > 505.7} /></g>}
        <Lbl t={t} t0={503.7} t1={505.6} x={1600} y={1300} txt="WEEK 3: GREEN" size={44} color={C.lima} />
        <S t={503.6} p="bubble" g={-8} d={2} />
        {t > 505.7 && t < 508 && <g transform={`translate(1650 ${CUB - 120})`}><Nube t={t} t0={505.7} r={80} n={6} /></g>}
        <Lbl t={t} t0={505.9} t1={507.9} x={1650} y={1312} txt="FILM + SMELL" size={30} color={C.lima} />
        <S t={505.8} p="fart" g={-12} />
        {en(t, 508, 512.8) && <><Barril x={2080} y={CUB} s={0.9} txt="BEER" c="#c9773a" /><Barril x={2210} y={CUB} s={0.9} txt="RUM" c="#7a3a1a" /></>}
        <S t={508.2} p="drink" g={-6} />
        <S t={508.8} p="glass" g={-10} />
        <S t={509.6} p="laugh" g={-12} />
        <Lbl t={t} t0={511.3} t1={512.7} x={1800} y={1140} txt="NOT JUST FOR FUN" size={52} color={C.oro} />
        {/* ratas */}
        {ratas && Array.from({ length: 9 }, (_, i) => {
          const x = 1300 + ((t - 515.3) * (260 + i * 30) + i * 160) % 1700;
          if (t > 519.4 && t < 524.4 && Math.abs(x - 2500) < 170) return null;
          return <Rata key={i} x={x} y={CUB - 4} s={0.9} t={t} />;
        })}
        {[515.4, 515.7, 516.1, 516.6].map((a, i) => <S key={i} t={a} p="squeak" g={-8} pitch={1 + i * 0.1} />)}
        <S t={515.5} p="scurry" g={-6} d={4} />
        <Lbl t={t} t0={516.8} t1={519.6} x={2100} y={1290} txt="EVERY SHIP HAD THEM" size={40} color={C.crema} />
        {en(t, 519.6, 520.9) && <g transform={`translate(2440 ${CUB - 130}) scale(0.3)`}><Galleta /></g>}
        <Lbl t={t} t0={519.8} t1={520.9} x={2500} y={1300} txt="FIRST." size={40} color={C.rojo} />
        <S t={519.8} p="crunch" g={-8} />
        <Lbl t={t} t0={521.2} t1={524.4} x={2300} y={1195} txt="REVENGE" size={60} color={C.rojo} />
        <S t={521.2} p="squeak" g={-4} pitch={1.3} />
        <S t={522.0} p="crunch" g={-6} />
        {en(t, 524.4, 527.9) && <g transform={`translate(2550 ${CUB - 4}) scale(1.4)`}><Rata x={0} y={0} t={t} /><ellipse cx={0} cy={-22} rx={60} ry={34} fill="#6b6170" /></g>}
        {en(t, 524.4, 527.9) && <g transform={`translate(2470 ${CUB - 30}) scale(0.18)`}><Galleta bichos={0} /></g>}
        <Lbl t={t} t0={524.7} t1={527.8} x={2550} y={1330} txt="THE GOOD PART" size={30} color={C.oro} />
        <S t={524.6} p="munch" g={-8} />
        {/* semana buena / semana mala */}
        {en(t, 530.2, 538.8) && <>
          <g transform={`translate(1650 ${CUB - 60}) scale(0.5)`}><Carne /></g>
          <P t={t} t0={531.6} x={1800} y={CUB - 45} s={0.45}><Tortuga t={t} /></P>
          <P t={t} t0={532.4} x={1950} y={CUB - 40} s={0.45}><Fruta k="pina" /></P>
          <P t={t} t0={532.7} x={2060} y={CUB - 30} s={0.4}><Fruta k="banana" /></P>
          <P t={t} t0={533.0} x={2150} y={CUB - 30} s={0.4}><Fruta k="coco" /></P>
          {Array.from({ length: 5 }, (_, i) => <Barril key={i} x={1550 + i * 120} y={CUB - 110} s={0.55} c="#c9773a" />).filter(() => t > 533.6)}
        </>}
        <Lbl t={t} t0={530.4} t1={538.7} x={1800} y={1190} txt="GOOD WEEK" size={54} color={C.lima} />
        <Lbl t={t} t0={533.6} t1={535.3} x={1800} y={1250} txt="+ A WHOLE PANTRY" size={30} color={C.crema} />
        {[530.6, 531.6, 532.4, 532.7, 533.0, 533.7].map((a, i) => <S key={i} t={a} p="pop" g={-8} pitch={1 + i * 0.06} />)}
        <S t={530.4} p="cheer" g={-10} />
        {en(t, 535.4, 538.8) && <>
          <g transform={`translate(2650 ${CUB - 50}) scale(0.3)`}><Galleta bichos={6} t={t} /></g>
          {[0, 1, 2].map((i) => <Gorgojo key={i} x={2750 + i * 30} y={CUB - 20} s={0.25} t={t} />)}
          <g transform={`translate(2820 ${CUB - 40}) scale(0.4)`}><Balde t={t} agua="#6a9a3a" peste /></g>
        </>}
        <Lbl t={t} t0={535.5} t1={538.7} x={2700} y={1190} txt="BAD WEEK" size={54} color={C.rojo} />
        <S t={535.5} p="fail" g={-10} />
        {/* salmagundi */}
        {en(t, 538.7, 552.4) && <g transform={`translate(3440 ${CUB - 60}) scale(0.62)`}><Cuenco t={t} /></g>}
        <S t={539.0} p="fanfare" g={-10} />
        {([[541.3, "carne"], [542.4, "huevo"], [543.4, "pepino"], [545.8, "cebolla"], [546.6, "ajo"]] as [number, string][]).map(([a, k], i) => {
          if (!en(t, a, a + 0.8)) return null;
          const p = arco(t, a, a + 0.7, [3200 + (i % 2) * 450, 1180], [3440, CUB - 80], 120);
          return <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${(t - a) * 400}) scale(0.3)`}>{k === "carne" ? <Carne /> : k === "huevo" ? <g><ellipse rx={50} ry={64} fill="#fff8e8" stroke={TINTA} strokeWidth={5} /><circle r={26} fill="#ffc83a" /></g> : k === "pepino" ? <rect x={-80} y={-26} width={160} height={52} rx={26} fill="#5a8a3a" stroke={TINTA} strokeWidth={5} /> : k === "cebolla" ? <path d="M 0 -70 Q 60 -10 50 30 Q 0 70 -50 30 Q -60 -10 0 -70 Z" fill="#c8a0d8" stroke={TINTA} strokeWidth={5} /> : <path d="M 0 -60 Q 50 0 30 40 L -30 40 Q -50 0 0 -60 Z" fill="#fff8e8" stroke={TINTA} strokeWidth={5} />}</g>;
        })}
        {[541.3, 542.4, 543.4, 545.8, 546.6].map((a, i) => <S key={i} t={a + 0.6} p="splash" g={-14} pitch={1.3} />)}
        {([[541.6, "MEAT"], [542.6, "BOILED EGGS"], [543.6, "PICKLES"], [546.0, "ONIONS"], [546.8, "GARLIC"]] as [number, string][]).map(([a, txt], i) => <Lbl key={i} t={t} t0={a} t1={548.3} x={3170 + (i % 2) * 520} y={1225 + Math.floor(i / 2) * 45} txt={txt} size={24} color={C.crema} />)}
        {en(t, 547.2, 551) && Array.from({ length: 30 }, (_, i) => { const a = 547.2 + (i % 10) * 0.08; const p = arco(t, a, a + 0.9, [3440 + ((i * 37) % 60) - 30, 1240], [3380 + ((i * 53) % 130), CUB - 70], 30); return t > a && <circle key={i} cx={p.x} cy={p.y} r={4} fill={i % 2 ? C.rojo : C.naranja} />; })}
        <S t={547.3} p="shake" g={-8} d={1.5} />
        <S t={549.6} p="sneeze" g={-6} />
        {/* noche: las hamacas */}
        {en(t, 552.3, 573) && [1450, 1580, 1710, 1840, 1970, 2100].map((x, i) => (
          <g key={i}>
            <Hamaca x={x} y={1640} w={150} t={t} />
            <circle cx={x - 40} cy={1650} r={20} fill={i === 2 ? "#e8b48a" : ["#c98a5a", "#8a5a3a", "#e8b48a", "#6b3a1f", "#c98a5a", "#e8b48a"][i]} />
            {i === 2 && <path d={`M ${x - 62} 1645 Q ${x - 40} 1618 ${x - 18} 1645 Z`} fill={C.rojo} />}
            {i !== 2 && t > 562.9 && <Lbl t={t} t0={562.9 + i * 0.12} x={x} y={1590 - ((t * 20 + i * 13) % 40)} txt="z" size={26} color={C.crema} />}
          </g>
        ))}
        {en(t, 562.9, 573) && [1515, 1645, 1775, 1905, 2035].map((x, i) => <Hamaca key={i} x={x} y={1720} w={150} t={t + 1} />)}
        <S t={552.5} p="creak" g={-10} d={3} />
        <Cota t={t} t0={556.4} t1={562.8} x1={1640} y1={1700} x2={1780} y2={1700} txt="14 IN" size={26} c={C.oro} />
        <S t={556.4} p="ruler" g={-8} />
        {en(t, 560.6, 562.9) && <g transform="translate(1720 1770) scale(0.4)"><Pupitre /></g>}
        <Lbl t={t} t0={560.8} t1={562.8} x={1720} y={1600} txt="= A SCHOOL DESK" size={26} color={C.crema} />
        <S t={560.7} p="pop" g={-8} />
        {t > 563.5 && [1500, 1800, 2050].map((x, i) => <g key={i} transform={`translate(${x} 1680)`}><Nube t={t} t0={563.5 + i * 0.4} r={60} n={5} c="#9be15d" /></g>)}
        <Lbl t={t} t0={564.0} t1={567.5} x={1750} y={1560} txt="WEEKS WITHOUT A BATH" size={32} color={C.lima} />
        <S t={563.6} p="fart" g={-10} />
        <S t={565.2} p="snore" g={-8} d={3} />
        {t > 568 && <g transform={`translate(1750 ${BOD + 60})`}><Nube t={t} t0={568} r={110} n={7} /></g>}
        <Lbl t={t} t0={568.4} t1={571.5} x={1750} y={2050} txt="THE BILGE · RIGHT THERE" size={46} color={C.crema} />
        <S t={567.8} p="bubble" g={-8} d={3} />
        <S t={568.6} p="drip" g={-10} />
      </G>
    </>
  );
};

export const O5: React.FC<{ t: number }> = ({ t }) => {
  if (t < 466 || t > 573) return null;
  return (
    <>
      {en(t, 527.9, 530.0) && [1380, 1620].map((x, i) => <Persona key={i} x={x} y={1100} h={430} t={t} seed={400 + i} ropa={PIRATA(i + 2)} flip={i === 1} expr="enojado" bD={100 + Math.sin(t * 8 + i) * 40} cD={30} aparece={527.9 + i * 0.15} />)}
      <CartelTrampa t={t} t0={466.14} n={5} nombre="THE FOOD" t1={468.4} />
      <S t={466.14} p="whoosh_big" g={-4} />
      <S t={466.35} p="wood_hit" g={-4} />
      <Txt t={t} t0={468.6} t1={471.2} text="DAY 1: NOT BAD" y={170} size={110} color={C.lima} />
      <Txt t={t} t0={480.1} t1={481.8} text="CRACK!" y={170} size={150} color={C.rojo} rot={-4} />
      <Txt t={t} t0={482.0} t1={483.4} text="MANY SAILORS DID" y={900} size={84} />
      <Contador t={t} t0={483.5} t1={484.8} de={1} a={8} x={960} y={190} size={140} color={C.crema} pre="WEEK " tFin={484.9} />
      <S t={483.5} p="tick" g={-8} d={1.3} />
      <Txt t={t} t0={494.5} t1={497.4} text="TAP, TAP, TAP" y={170} size={110} color={C.oro} />
      <Chip t={t} t0={471.3} t1={483.4} text="DAY 1" color={C.teal} x={60} y={60} size={54} />
      <Chip t={t} t0={484.9} t1={501.4} text="WEEK 8" color={C.rojo} x={60} y={60} size={54} />
      <Chip t={t} t0={530.3} t1={538.8} text="GOOD WEEK ✓ MEAT · TURTLES · FRUIT" color={C.teal} x={90} y={300} size={52} />
      {en(t, 497.5, 501.4) && <div style={{ position: "absolute", inset: 0, background: `rgba(6,3,14,${0.6 * prog(t, 497.5, 498.3)})` }} />}
      {en(t, 498.3, 501.4) && <div style={{ position: "absolute", left: 960, top: 480, transform: "translate(-50%,-50%)", display: "flex", gap: 30 }}>{[0, 1].map((i) => <div key={i} style={{ width: 46, height: (t * 2) % 3 < 0.15 ? 6 : 46, borderRadius: 23, background: "#fff" }} />)}</div>}
      <Txt t={t} t0={498.5} t1={501.4} text="EAT IN THE DARK" y={760} size={96} color={C.crema} />
      <S t={498.4} p="crunch" g={-8} />
      <S t={499.6} p="crunch" g={-8} pitch={0.9} />
      <Txt t={t} t0={512.9} t1={515.3} text="THE ONLY THING NOT ALIVE" y={170} size={90} color={C.oro} />
      <Txt t={t} t0={515.4} t1={516.8} text="...AND THE RATS" y={170} size={120} color={C.rojo} />
      <Txt t={t} t0={528.0} t1={530.0} text="PIRATES RAIDED OFTEN" y={170} size={100} color={C.oro} />
      <Txt t={t} t0={539.0} t1={541.1} text="SALMAGUNDI" y={170} size={120} color={C.oro} />
      <Txt t={t} t0={548.5} t1={552.3} text="LOTS OF SPICE" y={170} size={110} color={C.rojo} />
      <Txt t={t} t0={552.5} t1={555.9} text="IF YOU WERE LUCKY: A HAMMOCK" y={170} size={84} />
    </>
  );
};
export const _5 = { BAT };
