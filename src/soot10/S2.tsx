import React from "react";
import { interpolate } from "remotion";
import { C, prog, Emote, Zzz } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA } from "./persona";
import { Key, CUB, ALCA, BAT, BOD, Hamaca, Rata } from "./barco";
import { G, S, P, arco, Balde, Gato9, Nube, Flecha, Cota, Signo, Carne, Galleta, Pistola, Zapato, Metronomo, TINTA } from "./obj";
import { Txt, Lbl, Lista, en } from "./dsl";
import { CartelTrampa } from "./mundo";

// TRAMPA 2 · LAS TAREAS (152,6-264,6): servir, la cocina con fuego, fregar la cubierta, recados y baldes,
// el reloj de arena y la campana (día y noche), "flogging the glass", la bomba de la sentina, la jarcia a 30 m,
// la caída, las guardias de 4 horas y el cansancio permanente.
export const K2: Key[] = [
  [154.8, 1850, 1370, -1.6, 0.8],
  [158.7, 1700, 1330, -0.9, 0.9],
  [161.0, 640, 1370, -2.0, 0.8, "seco"],
  [164.4, 3330, 1390, -2.4, 0.8, "seco"],
  [168.1, 3340, 1350, -3.0, 0.5, "seco"],
  [170.7, 2400, 1430, -2.6, 0.7, "seco"],
  [174.3, 2000, 1380, -1.4, 0.7],
  [176.6, 2800, 1430, -2.4, 0.6, "seco"],
  [179.1, 800, 1120, -2.4, 0.8],
  [180.4, 760, 1110, -3.6, 0.7],
  [183.8, 820, 1110, -2.6, 0.6],
  [188.2, 1300, 900, -0.75, 0.8],
  [191.6, 760, 1100, -3.4, 0.6, "seco"],
  [196.7, 820, 1120, -2.2, 0.6],
  [199.7, 2210, 1380, -1.9, 0.6, "seco"],
  [201.2, 2000, 1900, -0.85, 1.0],
  [202.9, 1800, 2230, -1.7, 0.9],
  [210.1, 2210, 1380, -1.9, 0.8],
  [214.4, 2300, 1400, -1.9, 0.6],
  [217.5, 2000, 1330, -2.2, 0.8],
  [220.4, 1960, 1250, -1.3, 0.8],
  [222.0, 1980, 500, -1.15, 5.0, "lineal"],
  [227.2, 2100, 850, -0.55, 1.0],
  [230.8, 2000, 700, -0.42, 0.8],
  [234.0, 1990, 420, -2.2, 0.7, "seco"],
  [238.6, 1990, 950, -0.6, 0.8],
  [241.6, 1950, 1450, -1.6, 0.8],
  [243.8, 1900, 1650, -0.85, 0.9],
  [247.4, 1600, 1640, -2.3, 0.8],
  [252.4, 1800, 1550, -0.9, 0.5, "seco"],
  [258.9, 1750, 1380, -2.3, 0.8],
  [262.6, 1800, 1300, -1.3, 1.5],
];

const pumpY = (t: number) => (en(t, 199.7, 201.3) || en(t, 210.1, 217.5) ? Math.sin((t - 199.7) * 6) * 40 : 0);
export const A2: React.FC<{ t: number }> = ({ t }) => {
  if (t < 151 || t > 266) return null;
  // dónde está el grumete en cada momento
  const sube = interpolate(t, [222, 227.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boy = t < 161 ? { x: 1850, y: CUB } : t < 164.4 ? { x: interpolate(t, [161, 162.4], [1050, 760], { extrapolateRight: "clamp" }), y: CUB } : t < 170.7 ? { x: 3560, y: CUB } : t < 174.3 ? { x: 2400 - (t - 170.7) * 40, y: CUB }
    : t < 176.6 ? { x: interpolate(t, [174.3, 176.6], [1250, 2650]), y: CUB } : t < 179.1 ? { x: 2800, y: CUB } : t < 199.7 ? { x: 690, y: ALCA } : t < 217.5 ? { x: 2330, y: CUB }
      : t < 241.5 ? { x: 1960 - sube * 30, y: interpolate(sube, [0, 1], [CUB, 330]) } : t < 247.4 ? { x: 1950, y: CUB } : t < 252.4 ? { x: 1600, y: 1660 } : { x: 1750, y: CUB };
  const trepa = en(t, 220.4, 241.5);
  const dormido = en(t, 247.4, 252.4);
  return (
    <>
      {/* tripulación de cubierta */}
      {en(t, 151, 161) && [1300, 1550, 2200, 2500, 2800].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={110 + i} ropa={PIRATA(i)} flip={x > 1850} expr="neutro" habla={i === 2 && en(t, 156.5, 158.7)} />)}
      {/* camarote: oficiales a la mesa */}
      {en(t, 160, 164.5) && [[430, CAPITAN], [560, PIRATA(3)], [880, PIRATA(5)]].map(([x, r], i) => <Persona key={i} x={x as number} y={CUB} h={250} t={t} seed={120 + i} ropa={r as typeof CAPITAN} flip={(x as number) > 700} habla={i === 0} expr="orgullo" bD={30} />)}
      {/* cocinero con pata de palo */}
      {en(t, 163.5, 171) && <Persona x={3270} y={CUB} h={240} t={t} seed={130} ropa={{ ...PIRATA(4), pataPalo: true, gorro: "gorra", gorroCol: "#fff" }} expr={t > 168.1 ? "sorpresa" : "feliz"} habla={en(t, 164.4, 168)} bD={60} cD={60} />}
      {/* bomberos de la bomba */}
      {(en(t, 199.5, 201.3) || en(t, 209, 218)) && [2120, 2290].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={140 + i} ropa={PIRATA(i + 1)} flip={i === 1} expr={t > 214.4 ? "enojado" : "neutro"} bD={110 + pumpY(t) * (i ? -1 : 1) * 0.6} bI={110} cD={40} />)}
      {/* guardias: unos en cubierta, otros en hamacas */}
      {en(t, 243.5, 266) && [1250, 2350, 2700, 2950].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={150 + i} ropa={PIRATA(i + 2)} flip={i % 2 === 1} expr={t > 258.9 ? "triste" : "neutro"} salta={252.5} />)}
      {/* el grumete */}
      {t < 264.6 && (
        <Persona x={boy.x} y={dormido ? 1610 : boy.y} h={180} t={t} seed={7} ropa={GRUMETE}
          expr={dormido ? "dormido" : en(t, 168.1, 170.7) ? "miedo" : en(t, 170.7, 174.3) ? "triste" : en(t, 196.7, 199.7) ? "miedo" : en(t, 214.4, 217.5) ? "enojado" : en(t, 227.2, 241.5) ? "miedo" : en(t, 252.4, 258.9) ? "sorpresa" : t > 258.9 ? "triste" : en(t, 183.8, 191.6) ? "feliz" : "neutro"}
          camina={en(t, 161, 162.4) || en(t, 174.3, 176.6) ? 2.2 : 0} flip={en(t, 161, 164.4)}
          inclina={en(t, 170.7, 174.3) ? 38 : dormido ? 80 : t > 258.9 ? 6 + Math.max(0, Math.sin((t - 258.9) * 2.2)) * 14 : 0}
          bD={trepa ? 160 + Math.sin(t * 6) * 15 : en(t, 161, 164.4) ? 70 : en(t, 170.7, 174.3) ? 90 + Math.sin(t * 9) * 30 : en(t, 183.8, 188.2) ? 120 : en(t, 214.4, 217.5) ? 140 : 10}
          bI={trepa ? 160 - Math.sin(t * 6) * 15 : en(t, 234, 238.6) ? 90 : 10} cD={en(t, 214.4, 217.5) ? 130 : 20}
          manoD={en(t, 161, 164.4) ? <g transform="translate(0 -10) scale(0.35)"><rect x={-90} y={-8} width={180} height={16} rx={6} fill="#c8ccd4" /><g transform="translate(0 -40) scale(0.6)"><Carne /></g></g>
            : en(t, 174.3, 175.4) ? <rect x={-30} y={-20} width={60} height={40} rx={4} fill="#f4ead2" stroke={TINTA} strokeWidth={4} />
              : en(t, 176.6, 179.1) ? <g transform="translate(0 40) scale(0.45)"><Balde peste t={t} /></g> : undefined} />
      )}
      {en(t, 216, 217.5) && <Emote t={t} t0={214.6} tipo="sudor" x={boy.x} y={boy.y - 165} s={0.33} />}
      <G>
        {/* camarote: la mesa servida */}
        {en(t, 160, 164.5) && <g><rect x={450} y={1390} width={420} height={22} rx={8} fill="#8a4f22" /><rect x={470} y={1410} width={18} height={90} fill="#6b3a1f" /><rect x={830} y={1410} width={18} height={90} fill="#6b3a1f" />
          {[520, 640, 760].map((x) => <ellipse key={x} cx={x} cy={1386} rx={40} ry={10} fill="#e8e2f0" />)}</g>}
        <S t={161.1} p="step" g={-10} d={1.3} />
        <S t={162.4} p="glass" g={-10} />
        {/* fuego en la cocina */}
        {en(t, 164.4, 171) && Array.from({ length: 7 }, (_, i) => { const k = t > 168.1 ? 1 + prog(t, 168.1, 168.8) * 1.6 : 1; return <path key={i} d={`M ${3360 + i * 26} ${CUB - 120} q 14 ${(-50 - Math.sin(t * 11 + i) * 24) * k} 24 0`} fill={i % 2 ? "#ffb020" : "#ff6a3d"} />; })}
        <Lbl t={t} t0={166.0} t1={168.1} x={3430} y={1230} txt="OPEN FIRE" size={44} color={C.ambar} />
        <Lbl t={t} t0={166.8} t1={168.1} x={3430} y={1290} txt="+ WOODEN SHIP" size={36} color={C.crema} />
        <S t={164.5} p="fire" g={-10} d={6} />
        <S t={168.1} p="whoosh_big" g={-6} />
        <S t={168.3} p="gasp" g={-8} />
        {/* fregar: arena y agua */}
        {en(t, 170.7, 174.3) && Array.from({ length: 14 }, (_, i) => <circle key={i} cx={boy.x + 50 + Math.sin(t * 7 + i) * 60 + i * 8} cy={CUB - 6 - (i % 3) * 4} r={5} fill={i % 2 ? "#e8c27a" : "#bff3ff"} />)}
        {en(t, 170.7, 174.3) && <rect x={boy.x + 30 + Math.sin(t * 9) * 26} y={CUB - 26} width={56} height={24} rx={6} fill="#d9d2c0" />}
        <Lbl t={t} t0={171.4} t1={174.2} x={2340} y={1300} txt="SAND + SEAWATER" size={44} color={C.crema} />
        <S t={170.8} p="paper" g={-10} d={3.4} />
        {/* recados, herramientas, baldes */}
        <Lbl t={t} t0={174.3} t1={176.5} x={1900} y={1130} txt="MESSAGES · TOOLS" size={60} color={C.teal} />
        <S t={174.3} p="step" g={-10} d={2.2} pitch={1.3} />
        {en(t, 177.6, 179.2) && (() => { const p = arco(t, 177.6, 178.6, [2830, 1420], [3350, 1950], 260); return <g transform={`translate(${p.x} ${p.y}) rotate(${p.u * 200})`}>{[0, 1, 2].map((k) => <circle key={k} cx={k * 20} cy={k * 12} r={14} fill="#7a6a3a" />)}</g>; })()}
        <Lbl t={t} t0={176.8} t1={179.1} x={2800} y={1265} txt="DON'T ASK" size={56} color={C.lima} />
        <S t={176.8} p="fly" g={-12} d={2.3} />
        <S t={178.6} p="splash" g={-8} />
        {/* el reloj de arena y la campana */}
        <Lbl t={t} t0={180.9} t1={183.8} x={760} y={1000} txt="30 MIN" size={46} color={C.oro} />
        <S t={180.5} p="tick" g={-10} d={3} />
        {[184.9, 188.6, 189.4, 190.2, 193.2].map((x, i) => <S key={i} t={x} p="wood_hit" g={-12} pitch={1.3} />)}
        {[186.1, 187.9, 188.9, 189.7, 190.5].map((x, i) => <S key={`b${i}`} t={x} p="bell" g={-6} />)}
        <Lbl t={t} t0={188.4} t1={191.6} x={1300} y={500} txt="DAY · NIGHT · DAY · NIGHT" size={110} color={C.crema} />
        <S t={188.6} p="whoosh" g={-12} />
        <S t={189.4} p="cricket" g={-14} d={0.8} />
        <S t={190.2} p="rooster" g={-14} />
        {/* adelantar el reloj = flogging the glass */}
        {en(t, 191.6, 199.7) && <Flecha t={t} t0={192.4} t1={195.3} d="M 860 1040 Q 760 960 690 1040" w={10} />}
        <Lbl t={t} t0={192.2} t1={195.3} x={840} y={992} txt="A LITTLE EARLY..." size={34} color={C.crema} />
        <P t={t} t0={196.8} t1={199.6} x={960} y={1060} s={0.32} rot={-20}><Gato9 t={t} latigo={198.4} /></P>
        <S t={196.9} p="swish" g={-8} />
        <S t={198.5} p="punch" g={-6} />
        {/* la sentina */}
        {en(t, 201, 210.2) && [800, 1400, 2700, 3100].map((x, i) => { const d = ((t * 1.4 + i * 0.37) % 1); return <path key={i} d={`M ${x} ${BOD + 20 + d * 120} q 6 10 0 16 q -6 -6 0 -16 Z`} fill="#7ad8ff" transform="scale(1)" opacity={1 - d} />; })}
        <Lbl t={t} t0={201.2} t1={202.9} x={1800} y={2010} txt="EVERY SHIP LEAKS" size={56} color={C.teal} />
        {([[207.7, 1300, "rata"], [208.3, 1900, "zapato"], [208.9, 2400, "carne"], [209.5, 1650, "galleta"]] as [number, number, string][]).map(([a, x, k], i) => {
          if (!en(t, a, 210.2)) return null;
          const y = interpolate(t, [a, a + 0.5], [BOD - 120, 2215], { extrapolateRight: "clamp" });
          return <g key={i} transform={`translate(${x} ${y}) rotate(${(t - a) * 60}) scale(0.32)`}>{k === "rata" ? <g transform="scale(2.4)"><Rata x={0} y={0} t={t} /></g> : k === "zapato" ? <Zapato /> : k === "carne" ? <Carne gris={1} /> : <Galleta />}</g>;
        })}
        {[207.7, 208.3, 208.9, 209.5].map((a, i) => <S key={i} t={a + 0.5} p="splash" g={-12} pitch={1 + i * 0.1} />)}
        {/* la bomba: palanca y chorro */}
        {(en(t, 199.5, 201.3) || en(t, 209.5, 218)) && <g transform={`rotate(${pumpY(t) * 0.5} 2210 1400)`}><rect x={2050} y={1385} width={320} height={22} rx={10} fill="#5a2d14" /></g>}
        {(en(t, 199.9, 201.3) || en(t, 210.4, 217.5)) && Array.from({ length: 8 }, (_, i) => { const d = ((t * 2 + i / 8) % 1); return <circle key={i} cx={2260 + d * 300} cy={1395 - Math.sin(d * Math.PI) * 120 + d * 400} r={14 - d * 8} fill="#7aa85a" />; })}
        <Lbl t={t} t0={210.6} t1={214.3} x={2210} y={1215} txt="TWICE A DAY" size={60} color={C.crema} />
        {[210.4, 211.4, 212.5, 213.5, 214.5, 215.5, 216.5].map((a, i) => <S key={i} t={a} p="creak" g={-12} />)}
        <S t={210.5} p="splash" g={-14} d={6} />
        <Nube t={t} t0={214.4} c="#9be15d" r={140} />
        <g transform="translate(2330 1300)"><Nube t={t} t0={214.9} c="#c9d86a" r={90} n={6} /></g>
        <Lbl t={t} t0={214.6} t1={217.4} x={2300} y={1180} txt="SMELL: DEAD ANIMAL + TOILET" size={44} color={C.lima} />
        <S t={214.5} p="fly" g={-10} d={3} />
        <S t={215.2} p="gasp" g={-10} />
        {/* la jarcia: 30 metros, sin arnés */}
        <S t={217.6} p="wind" g={-10} d={5} />
        {[222.2, 223.0, 223.8, 224.6, 225.4, 226.2].map((a, i) => <S key={i} t={a} p="rope" g={-14} pitch={1 + i * 0.05} />)}
        <Cota t={t} t0={227.3} t1={230.6} x1={2230} y1={CUB} x2={2230} y2={330} txt="30 M" size={170} c={C.oro} />
        <S t={227.3} p="riser" g={-10} d={3} />
        <S t={227.2} p="rain" g={-14} d={14} />
        <S t={230.8} p="creak" g={-8} d={3.5} />
        <S t={234.0} p="wind" g={-8} d={4} />
        {/* la caída: no al agua, a la cubierta */}
        {en(t, 238.7, 243.7) && <path d={`M 1940 330 L 1940 ${interpolate(t, [238.9, 240.2], [330, 1480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}`} stroke={C.rojo} strokeWidth={22} strokeDasharray="40 30" fill="none" />}
        {en(t, 240.2, 243.7) && <g transform="translate(1940 1480)"><Signo k="cross" s={1.4} /></g>}
        <Lbl t={t} t0={240.3} t1={243.7} x={1940} y={1330} txt="DECK" size={110} color={C.rojo} />
        <S t={238.9} p="fall" g={-6} />
        <S t={240.2} p="slam" g={-4} />
        {/* guardias */}
        {en(t, 243.6, 266) && [1450, 1600, 1750, 2050].map((x, i) => <Hamaca key={i} x={x} y={1640} w={150} t={t} />)}
        <Lbl t={t} t0={244.2} t1={252.3} x={2600} y={1250} txt="WATCH A: 4H ON DECK" size={56} color={C.oro} />
        <Lbl t={t} t0={245.6} t1={252.3} x={1700} y={1790} txt="WATCH B: 4H BELOW" size={48} color={C.teal} />
        <S t={244.2} p="pop" g={-8} />
        <S t={245.6} p="pop" g={-8} pitch={0.8} />
        <S t={247.6} p="snore" g={-8} d={4.5} />
        <S t={252.5} p="bell" g={-2} />
        <S t={252.6} p="gasp" g={-8} />
        <S t={253.2} p="stomp" g={-8} d={2} />
        <Lbl t={t} t0={253.0} t1={258.8} x={1800} y={1180} txt="ALL HANDS!" size={120} color={C.rojo} />
        <S t={262.6} p="creak" g={-10} d={2.2} />
      </G>
      {dormido && <Zzz t={t} x={1590} y={1470} />}
    </>
  );
};

export const O2: React.FC<{ t: number }> = ({ t }) => {
  if (t < 152 || t > 266) return null;
  return (
    <>
      {/* el chico reacciona en primer plano */}
      {en(t, 207.6, 210.1) && <Persona x={300} y={1100} h={400} t={t} seed={7} ropa={GRUMETE} expr="miedo" ladea={Math.sin(t * 3) * 6} bD={110} cD={60} aparece={207.6} />}
      <CartelTrampa t={t} t0={152.56} n={2} nombre="THE CHORES" t1={154.6} />
      <S t={152.56} p="whoosh_big" g={-4} />
      <S t={152.75} p="wood_hit" g={-4} />
      <Txt t={t} t0={156.5} t1={158.6} text="WHAT DOES A CABIN BOY DO?" y={170} size={96} />
      <Txt t={t} t0={158.75} t1={160.9} text="EVERYTHING NOBODY WANTS" y={170} size={100} color={C.oro} />
      <Lista t={t} x={60} y={250} size={46} w={470} titulo="CHORES" t1={180.3}
        items={[{ txt: "SERVE", t0: 161.1, ok: true }, { txt: "CLEAN", t0: 163.2, ok: true }, { txt: "COOK", t0: 164.5, ok: true }, { txt: "SCRUB", t0: 170.8, ok: true }, { txt: "MESSAGES", t0: 174.4, ok: true }, { txt: "TOOLS", t0: 175.4, ok: true }, { txt: "BUCKETS", t0: 176.6, ok: true }, { txt: "KEEP TIME", t0: 179.2, ok: true }]} />
      {[161.1, 163.2, 164.5, 170.8, 174.4, 175.4, 176.6, 179.2].map((a, i) => <S key={i} t={a} p="write" g={-14} />)}
      <Txt t={t} t0={168.2} t1={170.6} text="AS SAFE AS IT SOUNDS" y={170} size={90} color={C.ambar} />
      <Txt t={t} t0={172.4} t1={174.2} text="UNTIL YOUR KNEES BLEED" y={900} size={90} color={C.rojo} />
      <Txt t={t} t0={189.0} t1={191.5} text="×48 A DAY" y={880} size={130} color={C.oro} />
      <S t={189.0} p="coin" g={-10} />
      <Txt t={t} t0={195.4} t1={196.7} text="FLOGGING THE GLASS" y={170} size={110} color={C.oro} />
      <Txt t={t} t0={196.9} t1={199.6} text="GUESS WHO GOT FLOGGED?" y={900} size={96} />
      <Txt t={t} t0={199.8} t1={201.1} text="THE PUMP" y={170} size={130} />
      <Txt t={t} t0={204.0} t1={207.5} text="THE BILGE" y={170} size={130} color={C.lima} />
      <Txt t={t} t0={207.8} t1={210.1} text="FALLS · SPILLS · ROTS · DIES" y={930} size={84} color={C.lima} />
      <Txt t={t} t0={217.6} t1={220.3} text="THE WIND CHANGES..." y={170} size={100} />
      <Txt t={t} t0={220.5} t1={227.1} text="BOYS: LIGHT + FAST" y={170} size={100} color={C.teal} />
      <Txt t={t} t0={228.4} t1={230.7} text="NO HARNESS" y={900} size={120} color={C.rojo} />
      {en(t, 230.8, 234.2) && <div style={{ position: "absolute", left: 1640, top: 640 }}><svg width={1} height={1} style={{ overflow: "visible" }}><g transform="scale(0.9)"><Metronomo t={t - 230.8} /></g></svg></div>}
      <Txt t={t} t0={230.9} t1={234.0} text="A GIANT METRONOME" y={170} size={100} />
      <S t={230.9} p="tick" g={-6} d={3.2} />
      <Txt t={t} t0={234.1} t1={238.5} text="ONE HAND FOR YOU, ONE FOR THE SHIP" y={900} size={76} />
      <Txt t={t} t0={241.6} t1={243.7} text="AND SLEEP?" y={170} size={130} color={C.lila} />
      <Txt t={t} t0={248.5} t1={252.3} text="MAX 4 HOURS" y={170} size={120} color={C.oro} />
      <Txt t={t} t0={259.0} t1={264.4} text="PERMANENTLY TIRED" y={170} size={110} color={C.lila} />
      <S t={259.0} p="sad" g={-12} />
      {/* barra de energía del grumete */}
      {en(t, 259.3, 264.6) && (
        <div style={{ position: "absolute", left: 1390, top: 760, transform: `scale(${Math.min(1, (t - 259.3) * 5)})`, display: "flex", alignItems: "center", gap: 18, fontFamily: "Fredoka", fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill" }}>
          ENERGY
          <div style={{ width: 230, height: 90, border: "10px solid #2a1530", borderRadius: 18, background: "#f4ead2", padding: 8, position: "relative" }}>
            <div style={{ width: `${Math.max(6, 22 - (t - 259.3) * 3)}%`, height: "100%", borderRadius: 8, background: (t * 2) % 1 < 0.5 ? "#e8344a" : "#a8202f" }} />
            <div style={{ position: "absolute", right: -26, top: 22, width: 16, height: 30, background: "#2a1530", borderRadius: 4 }} />
          </div>
        </div>
      )}
      <S t={259.3} p="fail" g={-12} />
    </>
  );
};
export const _2 = { Pistola, BAT, Cota };
