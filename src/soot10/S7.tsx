import React from "react";
import { C, prog } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA } from "./persona";
import { Key, CUB, BAT, BOD, MAR, BarcoLejos } from "./barco";
import { G, S, P, arco, Sable, Botella, Cartucho, Astillas, Pila, Sello, Signo, Cota, Flecha, Moneda8, TINTA } from "./obj";
import { Txt, Lbl, Lista, Contador, Flash, en } from "./dsl";
import { CartelTrampa } from "./mundo";
import { Mapa } from "./mapa";
import { ROBERTS } from "./S3";

// TRAMPA 7 · LA BATALLA (668,5-807,9): la pelea imaginada vs la bandera negra como mensaje (rendite y vivís), el abordaje
// rápido (granadas caseras, mosquetes, sogas), el barco de la marina que no se rinde, el chico como "mono de pólvora"
// que sube y baja cartuchos, las astillas de roble, la muerte de Roberts frente a África, Cape Coast, Execution Dock.
const CC = 22000, LON = 30000;
const MERC = 4000;

export const K7: Key[] = [
  [670.7, 2050, 1330, -2.0, 0.9],
  [674.2, 2050, 1320, -1.4, 0.6, "seco"],
  [677.8, 2150, -300, -1.4, 1.2],
  [680.4, 2060, -380, -1.8, 0.8],
  [686.9, 3900, 1500, 0.42, 1.4],
  [691.9, 4200, 1550, 0.36, 0.9],
  [697.1, 3300, 1400, -1.1, 1.0],
  [699.2, 2950, 1300, -2.6, 0.6, "seco"],
  [701.0, 3700, 1500, -0.9, 0.7],
  [703.5, 3300, 1400, -1.2, 0.7],
  [705.6, 4100, 1300, 0.85, 0.9],
  [708.2, 3900, 1450, 0.55, 1.0],
  [712.2, 4600, 1550, 0.3, 1.6],
  [719.4, 1850, 1350, -2.2, 0.5, "seco"],
  [723.2, 2200, 1800, -1.3, 0.9],
  [735.5, 2050, 1500, -1.6, 0.9],
  [741.0, 2050, 1500, -1.3, 0.6],
  [743.3, 2600, 1720, -2.2, 0.5, "seco"],
  [747.9, 2400, 1730, -2.8, 0.8],
  [751.7, 2300, 1700, -1.8, 0.8],
  [761.5, 19700, 1700, 0.6, 1.6],
  [767.4, 20250, 1820, 1.3, 0.8],
  [771.7, 20250, 1800, 1.6, 0.6, "seco"],
  [776.1, 20000, 1900, 1.0, 0.9],
  [779.3, 21400, 1600, 0.5, 1.6],
  [783.0, CC, 1300, 0.55, 1.4],
  [787.7, CC, 1600, 0.9, 0.9],
  [789.4, LON - 100, 1500, 0.55, 2.0],
  [794.5, LON + 400, 1800, 0.95, 1.0],
  [797.9, 2050, 1100, -0.9, 1.6],
  [802.8, 2150, -330, -1.6, 1.0],
  [805.9, 2150, -380, -2.4, 1.6],
];

// el recorrido del mono de pólvora: [t, x, y]
const RUTA: [number, number, number][] = [
  [723.2, 1750, CUB], [723.9, 1500, CUB], [724.5, 1500, BAT], [725.5, 2500, BAT], [726.1, 2500, BOD], [726.8, 2850, BOD],
  [727.7, 2850, BOD], [728.3, 2500, BOD], [728.9, 2500, BAT], [729.8, 1900, BAT],
  [730.6, 1900, BAT], [731.3, 2500, BAT], [731.8, 2500, BOD], [732.3, 2850, BOD], [732.6, 2850, BOD], [733.1, 2500, BOD], [733.6, 2500, BAT], [734.3, 1900, BAT],
  [734.6, 1900, BAT], [735.2, 2400, BAT],
];
const ruta = (t: number) => {
  let i = 0;
  while (i + 1 < RUTA.length && RUTA[i + 1][0] <= t) i++;
  const a = RUTA[i], b = RUTA[Math.min(i + 1, RUTA.length - 1)];
  const u = b[0] > a[0] ? Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))) : 0;
  return { x: a[1] + (b[1] - a[1]) * u, y: a[2] + (b[2] - a[2]) * u, mueve: Math.abs(b[1] - a[1]) + Math.abs(b[2] - a[2]) > 0 && u < 1, izq: b[1] < a[1] };
};
const CARGA = (t: number) => en(t, 727.2, 729.8) || en(t, 732.4, 734.3);

export const A7: React.FC<{ t: number }> = ({ t }) => {
  if (t < 668 || t > 809) return null;
  const mono = en(t, 719.4, 743.3) ? ruta(Math.max(t, 723.2)) : null;
  return (
    <>
      {/* detrás del cartel: la tripulación afila los sables */}
      {en(t, 668, 670.7) && [1700, 1900, 2200, 2400].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={276 + i} ropa={PIRATA(i)} flip={i > 1} expr="enojado"
        bD={90 + Math.sin(t * 10 + i * 2) * 35} cD={40} manoD={<g transform="rotate(-80) scale(0.35)"><Sable /></g>} />)}
      {/* la pelea que todos imaginan */}
      {en(t, 670.6, 677.8) && [1850, 2250].map((x, i) => <Persona key={i} x={x + (i ? -1 : 1) * Math.abs(Math.sin(t * 5)) * 30} y={CUB} h={255} t={t} seed={280 + i} ropa={PIRATA(i + 2)} flip={i === 1}
        expr={t > 674.2 ? "neutro" : "enojado"} bD={t < 674.2 ? 60 + Math.sin(t * 9 + i) * 40 : 10} cD={20}
        manoD={t < 674.2 ? <g transform="rotate(-90) scale(0.35)"><Sable /></g> : undefined} />)}
      {/* abordaje: tiradores en la borda y los que cruzan con sogas */}
      {en(t, 697, 712.2) && [2700, 2880, 3060].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={283 + i} ropa={PIRATA(i)} expr="enojado"
        bD={en(t, 697.6 + i * 0.4, 703.4) ? 150 : 90} cD={en(t, 697.6 + i * 0.4, 703.4) ? 20 : 0}
        manoD={en(t, 697.4, 703.4) ? <g transform="scale(0.25)"><Botella c="#7a5a3a" mecha={697.4} t={t} /></g> : <g transform="rotate(-90) scale(0.35)"><rect x={-10} y={-20} width={20} height={300} rx={8} fill="#5a3418" /></g>} />)}
      {en(t, 705.5, 712.2) && [0, 1, 2, 3].map((i) => {
        const a = 705.6 + i * 0.5;
        const p = arco(t, a, a + 1.4, [2800 + i * 120, CUB - 300], [MERC + 260 + i * 160, 1830], -260);
        return t > a && <Persona key={i} x={p.x} y={p.y} h={240} t={t} seed={290 + i} ropa={PIRATA(i + 1)} expr="enojado" bD={170} cD={0} bI={110} cI={30}
          manoI={<g transform="rotate(-90) scale(0.32)"><Sable /></g>} />;
      })}
      {/* el chico: mono de pólvora */}
      {en(t, 719.4, 723.2) && <Persona x={1750} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} expr="miedo" />}
      {mono && t >= 723.2 && <Persona x={mono.x} y={mono.y} h={180} t={t} seed={7} ropa={GRUMETE} flip={mono.izq} expr="miedo" camina={mono.mueve ? 4 : 0}
        bD={CARGA(t) ? 110 : 20} cD={CARGA(t) ? 90 : 20} manoD={CARGA(t) ? <g transform="translate(0 -30) scale(0.4)"><Cartucho /></g> : undefined} />}
      {/* artilleros */}
      {en(t, 723, 743.3) && [1750, 2060].map((x, i) => <Persona key={i} x={x} y={BAT} h={240} t={t} seed={295 + i} ropa={PIRATA(i + 3)} flip={i === 1} expr="enojado" bD={70} cD={60} />)}
      {/* astillas: el chico se cubre */}
      {en(t, 743.2, 757.4) && <Persona x={2250} y={BAT} h={180} t={t} seed={7} ropa={GRUMETE} expr="miedo" bD={160} bI={160} cD={120} cI={120} ladea={-8} />}
      {/* el retorno: la bandera */}
      {en(t, 797.8, 809) && [1700, 2400].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={300 + i} ropa={PIRATA(i)} flip={i === 1} expr={t > 805.9 ? "triste" : "orgullo"} />)}
      <G>
        <Lbl t={t} t0={671.0} t1={674.1} x={2050} y={1180} txt="WHAT YOU IMAGINE" size={44} color={C.crema} />
        {[671.2, 671.8, 672.4, 673.0, 673.5].map((a, i) => <S key={i} t={a} p="sword" g={-8} pitch={1 + (i % 2) * 0.1} />)}
        <P t={t} t0={674.3} t1={677.7} x={2050} y={1300} s={1.6}><Signo k="cross" /></P>
        <S t={674.3} p="fail" g={-8} />
        {/* bandera negra = mensaje */}
        
        
        <S t={677.9} p="cloth" g={-6} />
        <S t={680.6} p="ding" g={-10} />
        <S t={684.4} p="boom" g={-6} />
        {/* granadas caseras */}
        {en(t, 699.2, 703.4) && <g transform="translate(2950 1300) scale(0.6)"><Botella c="#7a5a3a" mecha={699.3} t={t} /></g>}
        <Lbl t={t} t0={699.6} t1={703.4} x={2950} y={1205} txt="POWDER + SCRAP" size={40} color={C.oro} />
        <S t={699.3} p="sizzle" g={-8} d={2} />
        {[701.2, 701.8, 702.4].map((a, i) => {
          const p = arco(t, a, a + 1.1, [2800 + i * 150, 1150], [MERC + 300 + i * 200, 1800], 300);
          return en(t, a, a + 1.6) && <g key={i}>{t < a + 1.1 ? <g transform={`translate(${p.x} ${p.y}) rotate(${(t - a) * 600}) scale(0.22)`}><Botella c="#7a5a3a" mecha={a} t={t} /></g> : <circle cx={MERC + 300 + i * 200} cy={1790} r={40 + (t - a - 1.1) * 300} fill="#ffb347" opacity={1 - (t - a - 1.1) * 2} />}</g>;
        })}
        {[702.3, 702.9, 703.5].map((a, i) => <S key={i} t={a} p="explo" g={-8} pitch={1.1 + i * 0.1} />)}
        {en(t, 702.2, 712.2) && Array.from({ length: 9 }, (_, i) => { const a = 702.2 + i * 0.9, u = Math.max(0, t - a); return t > a && <circle key={i} cx={MERC + 300 + (i % 3) * 260 + u * 40} cy={1750 - u * 90} r={60 + u * 50} fill="#d8d4cc" opacity={Math.max(0, 0.75 - u * 0.22)} />; })}
        {/* mosquetes */}
        {en(t, 703.5, 705.6) && [2700, 2880, 3060].map((x, i) => ((t * 6 + i * 0.37) % 1) < 0.25 && <circle key={i} cx={x + 90} cy={CUB - 170} r={26} fill="#fff3c4" />)}
        {[703.6, 703.9, 704.2, 704.6, 704.9, 705.3].map((a, i) => <S key={i} t={a} p="gun" g={-10} pitch={1 + (i % 3) * 0.08} />)}
        {[705.7, 706.2, 706.7, 707.2].map((a, i) => <S key={i} t={a} p="rope" g={-8} pitch={1 + i * 0.05} />)}
        <S t={706.0} p="cheer" g={-8} d={3} />
        {[707.0, 707.4, 707.9, 708.6, 709.2].map((a, i) => <S key={i} t={a} p="sword" g={-8} />)}
        {/* el mono de pólvora */}
        <Lbl t={t} t0={726.9} t1={730.3} x={2720} y={1940} txt="THE MAGAZINE" size={36} color={C.rojo} />
        <S t={723.3} p="run" g={-6} d={3.6} />
        <S t={727.3} p="rope" g={-10} />
        <S t={728.0} p="run" g={-6} d={1.8} />
        <S t={730.4} p="run" g={-6} d={4.8} />
        <Lbl t={t} t0={730.5} t1={735.4} x={2200} y={1465} txt="AGAIN · AGAIN · AGAIN" size={34} color={C.oro} />
        {/* astillas */}
        {en(t, 743.3, 747.9) && <circle cx={2750} cy={1700} r={34} fill="#2a2a34" />}
        {en(t, 743.4, 749) && ([[743.5, 2720, 1640], [744.4, 2500, 1560], [745.3, 2850, 1600], [746.2, 2350, 1580], [747.0, 2650, 1560]] as [number, number, number][]).map(([a, x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><Astillas t={t} t0={a} n={26} dir={i % 2 ? 1 : -1} vel={420} /></g>)}
        {[744.4, 745.3, 746.2, 747.0].map((a, i) => <S key={i} t={a} p="wood_hit" g={-6} pitch={0.9 + i * 0.07} />)}
        <Flash t={t} t0={743.5} d={0.18} />
        <S t={743.5} p="explo" g={-2} />
        <S t={743.6} p="crunch" g={-4} />
        <S t={743.9} p="wood_hit" g={-6} />
        {en(t, 747.9, 757.4) && <path d="M 2330 1790 L 2520 1650 L 2545 1668 Z" fill="#c98a4a" stroke="#8a4f22" strokeWidth={5} />}
        <Cota t={t} t0={748.4} t1={751.6} x1={2320} y1={1600} x2={2550} y2={1600} txt="ARM-LONG OAK" size={26} c={C.oro} />
        <S t={748.4} p="ruler" g={-10} />
        {/* retorno: rico a veces, viejo nunca */}
        {en(t, 802.9, 805.9) && <g transform="translate(1900 -200) scale(0.6)"><Pila n={4} oro /></g>}
        <S t={802.9} p="coin" g={-6} />
      </G>
    </>
  );
};

// mundo: el mercante que se rinde y el abordaje, la marina que no se rinde, el Swallow y Roberts, Cape Coast, Londres
export const M7: React.FC<{ t: number }> = ({ t }) => {
  if (t < 686 || t > 798) return null;
  return (
    <>
      {en(t, 686.5, 712.4) && <BarcoLejos x={t < 696.9 ? 5500 : MERC + 500} y={MAR - 30} t={t} s={2.2} tipo="mercante" flip iza={t > 689.2 && t < 690.5 ? 1 - prog(t, 689.2, 690.2) : 1} />}
      {en(t, 712, 719.6) && <BarcoLejos x={6200} y={MAR - 30} t={t} s={2.6} tipo="marina" flip fuego={713.4} />}
      {en(t, 761.3, 779.4) && <BarcoLejos x={20500} y={MAR - 30} t={t} s={1.8} tipo="pirata" iza={t > 776 ? 1 - prog(t, 776, 777.5) : 1} />}
      {en(t, 761.3, 779.4) && <BarcoLejos x={18900} y={MAR - 30} t={t} s={2.0} tipo="marina" fuego={771.6} />}
      {en(t, 767.3, 776.1) && <Persona x={20250} y={MAR - 120} h={200} t={t} seed={310} ropa={ROBERTS} flip expr={t > 771.7 ? "sorpresa" : "orgullo"} inclina={t > 771.9 ? Math.min(80, (t - 771.9) * 160) : 0} />}
      {en(t, 767.3, 771.6) && [20450, 20600, 20750].map((x, i) => <Persona key={i} x={x} y={MAR - 120} h={180} t={t} seed={311 + i} ropa={PIRATA(i)} expr="dormido" ladea={Math.sin(t * 2 + i) * 14} bD={100 + Math.sin(t * 4 + i) * 45} cD={50} manoD={<g transform="scale(0.22)"><Botella c="#5a8a3a" /></g>} />)}
      {/* Cape Coast: los presos encadenados */}
      {en(t, 783, 789.4) && [-450, -300, -150, 0, 150, 300, 450].map((dx, i) => <Persona key={i} x={CC + dx} y={MAR - 60} h={220} t={t} seed={320 + i} ropa={PIRATA(i)} expr="triste" bD={30} bI={30} cD={60} cI={60} inclina={6} camina={t < 786.5 ? 2 : 0} />)}
      <G>
        <Lbl t={t} t0={687.2} t1={696.8} x={5500} y={MAR - 820} txt="MERCHANT" size={90} color={C.crema} />
        {en(t, 689.4, 696.8) && <g transform={`translate(5500 ${MAR - 700}) scale(2.2)`}><Signo k="check" /></g>}
        <Lbl t={t} t0={689.6} t1={691.7} x={5500} y={MAR + 200} txt="SURRENDERED" size={90} color={C.lima} />
        <S t={689.4} p="ding" g={-8} />
        <S t={687.3} p="sea" g={-14} d={8} />
        <Lbl t={t} t0={694.8} t1={696.9} x={5400} y={MAR - 900} txt="THE SHIP, NOT A WRECK" size={100} color={C.oro} />
        <S t={694.8} p="pop" g={-8} />
        {/* la marina: no se rinde */}
        <Lbl t={t} t0={715.7} t1={719.5} x={6200} y={MAR - 960} txt="NAVY · HUNTING YOU" size={230} color={C.rojo} />
        <S t={712.3} p="thunder" g={-12} />
        <S t={715.7} p="suspense" g={-8} d={3.6} />
        {/* Roberts y el Swallow */}
        <Lbl t={t} t0={761.8} t1={767.3} x={20500} y={MAR - 760} txt="BARTHOLOMEW ROBERTS" size={80} color={C.oro} />
        <Lbl t={t} t0={766.6} t1={771.5} x={18900} y={MAR - 820} txt="HMS SWALLOW" size={90} color={C.rojo} />
        <S t={761.6} p="whoosh_big" g={-4} />
        <S t={766.7} p="fanfare" g={-10} />
        <Lbl t={t} t0={767.8} t1={771.5} x={20600} y={MAR - 420} txt="STILL DRUNK" size={50} color={C.lima} />
        <S t={768.0} p="laugh" g={-10} />
        <S t={768.6} p="glass" g={-12} />
        {en(t, 771.6, 772.4) && Array.from({ length: 14 }, (_, i) => { const u = prog(t, 771.6, 772.2); return <circle key={i} cx={18900 + 400 + u * 1300 + (i % 4) * 20} cy={MAR - 150 + ((i * 37) % 80) - 40} r={10} fill="#2a2a34" opacity={1 - u * 0.3} />; })}
        <S t={771.6} p="cannon" g={-4} />
        <S t={772.2} p="explo" g={-8} />
        <S t={776.5} p="splash" g={-6} />
        <Lbl t={t} t0={776.6} t1={779.3} x={20000} y={MAR - 300} txt="OVERBOARD · AS HE WISHED" size={56} color={C.crema} />
        {/* Cape Coast: la cadena */}
        {en(t, 783, 789.4) && <line x1={CC - 470} y1={MAR - 150} x2={CC + 470} y2={MAR - 150} stroke="#6a6a72" strokeWidth={8} strokeDasharray="18 8" />}
        <S t={783.6} p="rattle" g={-10} d={2} />
        {/* Cape Coast */}
        <S t={783.0} p="whoosh_big" g={-4} />
        <S t={786.6} p="gavel" g={-4} />
        <S t={786.9} p="gavel" g={-4} />
        {en(t, 787.7, 789.4) && Array.from({ length: 52 }, (_, i) => t > 787.8 + i * 0.022 && <line key={i} x1={CC - 600 + (i % 13) * 92 + (i % 5 === 4 ? -40 : 0)} y1={MAR - 280 + Math.floor(i / 13) * 70} x2={CC - 600 + (i % 13) * 92 + (i % 5 === 4 ? 40 : 0)} y2={MAR - 230 + Math.floor(i / 13) * 70} stroke={C.rojo} strokeWidth={14} strokeLinecap="round" />)}
        {/* Londres */}
        <S t={789.5} p="whoosh_big" g={-4} />
        <S t={790.0} p="bell" g={-10} />
        {[795.1, 795.9, 796.7].map((a, i) => <S key={i} t={a} p="sea" g={-10} d={1.2} pitch={1 + i * 0.1} />)}
      </G>
    </>
  );
};

export const O7: React.FC<{ t: number }> = ({ t }) => {
  if (t < 668 || t > 809) return null;
  return (
    <>
      <CartelTrampa t={t} t0={668.48} n={7} nombre="THE BATTLE" t1={670.6} />
      <S t={668.48} p="whoosh_big" g={-4} />
      <S t={668.7} p="wood_hit" g={-4} />
      <Txt t={t} t0={674.4} t1={677.7} text="REALITY: AVOID THE FIGHT" y={170} size={100} color={C.lima} />
      <Txt t={t} t0={677.9} t1={680.4} text="THE BLACK FLAG = A MESSAGE" y={170} size={90} />
      <Txt t={t} t0={691.9} t1={694.7} text="NO POLITE CANNON DUELS" y={170} size={100} color={C.lila} />
      <Txt t={t} t0={697.1} t1={699.1} text="COME IN CLOSE" y={170} size={120} color={C.oro} />
      <Txt t={t} t0={703.6} t1={705.5} text="MUSKETS!" y={170} size={140} color={C.rojo} />
      <Txt t={t} t0={705.7} t1={708.1} text="ROPES & CUTLASSES" y={170} size={120} color={C.oro} />
      <Txt t={t} t0={708.3} t1={712.1} text="FAST · LOUD · MINUTES" y={170} size={120} />
      <Txt t={t} t0={712.3} t1={715.6} text="BUT SOMETIMES..." y={170} size={120} color={C.lila} />
      <Txt t={t} t0={719.6} t1={721.6} text="YOUR JOB CHANGES" y={170} size={110} />
      <Txt t={t} t0={721.7} t1={723.2} text="POWDER MONKEY" y={170} size={150} color={C.oro} />
      <S t={721.7} p="boom" g={-6} />
      <Lista t={t} x={1280} y={240} size={42} w={560} titulo="WHY BOYS?" t1={741.0}
        items={[{ txt: "SMALL", t0: 735.8, ok: true }, { txt: "FAST", t0: 737.0, ok: true }, { txt: "EASY TO REPLACE", t0: 738.6, ok: true }]} />
      {[735.8, 737.0, 738.6].map((a, i) => <S key={i} t={a} p="write" g={-12} />)}
      <S t={739.0} p="sad" g={-10} />
      <Txt t={t} t0={740.8} t1={743.2} text="THE CANNONBALLS? NOT THE WORST" y={170} size={84} />
      <Txt t={t} t0={744.0} t1={747.8} text="A STORM OF SPLINTERS" y={170} size={110} color={C.naranja} />
      <Txt t={t} t0={751.8} t1={754.6} text="NOT IRON..." y={170} size={130} color="#c8c0d0" />
      <Txt t={t} t0={754.7} t1={757.3} text="...WOOD" y={170} size={150} color={C.naranja} />
      <Mapa t={t} t0={757.4} t1={761.4} titulo="FEBRUARY 1722"
        cam={[[757.4, -30, 12, 1.5], [759.5, -6, 6, 2.2]]}
        pins={[{ lugar: "capecoast", t0: 758.6, txt: "WEST AFRICA", icono: "barco" }]} />
      <S t={757.4} p="unroll" g={-4} />
      <S t={758.6} p="stamp" g={-8} />
      <Txt t={t} t0={771.8} t1={776.0} text="GRAPESHOT" y={170} size={140} color={C.rojo} />
      <Txt t={t} t0={779.4} t1={782.9} text="THE PART NOBODY PUTS ON A POSTER" y={170} size={78} color={C.lila} />
      <Txt t={t} t0={786.6} t1={787.6} text="ON TRIAL" y={170} size={130} />
      <Txt t={t} t0={787.8} t1={789.3} text="52 HANGED" y={170} size={150} color={C.rojo} />
      <S t={787.8} p="boom" g={-6} />
      <Txt t={t} t0={794.6} t1={797.8} text="LEFT FOR THREE TIDES" y={170} size={100} color="#bff3ff" />
      <Contador t={t} t0={795.0} t1={796.8} de={0} a={3} x={960} y={900} size={150} color="#bff3ff" pre="TIDE " post="" tFin={797.8} />
      {/* rendite = vivís / resistí = sin piedad */}
      {en(t, 680.6, 686.8) && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", opacity: prog(t, 680.6, 680.9) * (1 - prog(t, 686.4, 686.8)) }}>
        {[["SURRENDER", "YOU LIVE", "✓", C.lima, 680.6], ["RESIST", "NO MERCY", "✗", C.rojo, 684.4]].map(([a, b, ic, c, t0], i) => (
          <div key={i} style={{ flex: 1, height: 1080, background: i ? "rgba(60,10,14,0.88)" : "rgba(10,40,20,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: prog(t, t0 as number, (t0 as number) + 0.3), transform: `scale(${0.85 + 0.15 * prog(t, t0 as number, (t0 as number) + 0.3)})` }}>
            <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 110, color: "#fff8e8" }}>{a}</div>
            <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 260, color: c as string, lineHeight: 1 }}>{ic}</div>
            <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 96, color: c as string }}>{b}</div>
          </div>))}
      </div>}
      {/* cartucho tras cartucho */}
      {[[727.7, "×1"], [732.4, "×2"], [734.4, "×3"]].map(([a, x], i) => <Txt key={i} t={t} t0={a as number} t1={i < 2 ? [732.3, 734.3][i] : 735.4} text={`CARTRIDGE ${x}`} y={900} size={110} color={C.oro} />)}
      <Txt t={t} t0={759.8} t1={761.4} text="HMS SWALLOW CLOSES IN" y={900} size={90} color={C.rojo} />
      <Contador t={t} t0={798.2} t1={799.4} de={0} a={2} x={960} y={190} size={150} color={C.oro} pre="1–" post=" YEARS" tFin={802.7} />
      <Txt t={t} t0={799.6} t1={802.7} text="A TYPICAL PIRATE CAREER" y={330} size={64} />
      <Txt t={t} t0={802.9} t1={805.8} text="RICH? SOMETIMES." y={170} size={120} color={C.oro} />
      <Txt t={t} t0={806.0} t1={807.8} text="OLD? ALMOST NEVER." y={170} size={120} color={C.rojo} />
      <S t={806.0} p="boom" g={-6} />
    </>
  );
};
export const _7 = { CAPITAN, Sello, Flecha, Moneda8, TINTA, LON };
